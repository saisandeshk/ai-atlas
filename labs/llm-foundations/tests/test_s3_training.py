"""Sampling boundaries, learnable next-token prediction, and exact resume."""
import math
import numpy as np
import pytest
import torch

from adapters import LabConfig


def brute_probs(logits, temperature, k, p):
    if temperature == 0:
        expected = torch.zeros_like(logits)
        expected[logits.argmax()] = 1
        return expected
    probabilities = (logits / temperature).softmax(-1)
    order = sorted(range(len(logits)), key=lambda i: -probabilities[i].item())
    if k is not None:
        order = order[:k]
    mass = sum(probabilities[i].item() for i in order)
    selected, cumulative = [], 0.
    for i in order:
        selected.append(i)
        cumulative += probabilities[i].item() / mass
        if p is not None and cumulative >= p:
            break
    expected = torch.zeros_like(logits)
    for i in selected:
        expected[i] = probabilities[i]
    return expected / expected.sum()


@pytest.mark.parametrize("batched", [False, True])
def test_sampling_matches_brute_force_random_cases(lab, batched):
    """Temperature precedes softmax; top-k renormalizes before nucleus selection."""
    generator = torch.Generator().manual_seed(81)
    for _ in range(40):
        logits = torch.randn(3, 11, generator=generator, dtype=torch.float64)
        temperature = [.3, .7, 1., 2.][int(torch.randint(4, (), generator=generator))]
        k = [None, 1, 4, 11, 20][int(torch.randint(5, (), generator=generator))]
        p = [None, .1, .5, .8, 1.][int(torch.randint(5, (), generator=generator))]
        expected = torch.stack([brute_probs(row, temperature, k, p) for row in logits])
        if not batched:
            logits, expected = logits[0], expected[0]
        actual = lab.filter_probs(logits, temperature, k, p)
        torch.testing.assert_close(actual, expected, msg="Check temperature -> softmax -> top-k -> renormalize -> inclusive top-p -> renormalize")
        torch.testing.assert_close(actual.sum(-1), torch.ones_like(actual.sum(-1)), msg="Filtered probabilities must sum to one")


@pytest.mark.parametrize("temperature,k,p", [(0., None, None), (1., 1, 1.),
    (1., 20, 1.), (1., None, .25), (1., None, .75), (1., 2, 2/3)])
def test_sampling_greedy_and_exact_nucleus_boundaries(lab, temperature, k, p):
    """Include exactly-reaching and crossing tokens; k>=V and p=1 keep all."""
    logits = torch.tensor([math.log(4), math.log(2), math.log(1), math.log(1/2)], dtype=torch.float64)
    # Obtain the boundary from the same softmax to avoid decimal rounding.
    if p == .75:
        p = logits.softmax(-1)[:2].sum().item()
    expected = brute_probs(logits, temperature, k, p)
    torch.testing.assert_close(lab.filter_probs(logits, temperature, k, p), expected,
                               msg="Nucleus is the smallest set reaching p, not only tokens strictly below p")


@pytest.mark.parametrize("batched", [False, True], ids=["vector", "batch"])
@pytest.mark.parametrize("k,p", [(1, .1), (4, .8), (20, 1.), (None, None)])
def test_sampling_zero_temperature_is_argmax_with_filters(lab, batched, k, p):
    """Greedy sampling returns exact per-row argmax one-hots even with filters enabled."""
    generator = torch.Generator().manual_seed(81)
    logits = torch.randn(3, 11, generator=generator, dtype=torch.float64)
    if not batched:
        logits = logits[0]
    expected = torch.zeros_like(logits)
    expected.scatter_(-1, logits.argmax(-1, keepdim=True), 1.)
    actual = lab.filter_probs(logits, 0., k, p)
    assert actual.shape == logits.shape, "Greedy probabilities must preserve [V] or [B,V] shape"
    assert actual.dtype == logits.dtype, "Greedy probabilities must preserve the logits dtype"
    torch.testing.assert_close(actual, expected, rtol=0, atol=0,
                               msg="Temperature zero must return exact argmax one-hots regardless of top-k/top-p")


def markov_corpus(seed, length, vocab=64):
    """Doubly stochastic transitions give known uniform stationary distribution."""
    transition = np.full((vocab, vocab), .05 / vocab)
    for i in range(vocab):
        transition[i, i] += .75
        transition[i, (i + 1) % vocab] += .20
    stationary = np.full(vocab, 1 / vocab)
    assert np.allclose(stationary @ transition, stationary), "Constructed chain must have the claimed stationary distribution"
    entropy = -np.sum(stationary[:, None] * transition * np.log(transition))
    rng = np.random.default_rng(seed)
    corpus = np.empty(length, dtype=np.int64)
    corpus[0] = rng.integers(vocab)
    cumulative = transition.cumsum(-1)
    uniforms = rng.random(length - 1)
    for i, draw in enumerate(uniforms, start=1):
        corpus[i] = np.searchsorted(cumulative[corpus[i - 1]], draw)
    return corpus, float(entropy)


def test_markov_validation_loss_reaches_entropy_without_label_leakage(lab, tmp_path):
    """Next-token CE approaches a known entropy, never implausibly below it."""
    config = LabConfig()
    training, entropy = markov_corpus(18, 40000)
    validation, _ = markov_corpus(93, 32769)
    losses = lab.run_training(config, training, 180, str(tmp_path), None, 27)
    assert len(losses) == 180 and np.isfinite(losses).all(), "Return one finite training CE per executed global step"
    checkpoint_path = tmp_path / "checkpoint.pt"
    assert checkpoint_path.exists(), "Training must save checkpoint.pt"
    checkpoint = torch.load(checkpoint_path, weights_only=False, map_location="cpu")
    model = lab.make_model(config, 27)
    model.load_state_dict(checkpoint["model"])
    model.eval()
    total = 0.
    with torch.no_grad():
        # Consecutive independent context windows, labels shifted by one.
        x = torch.from_numpy(validation[:-1].reshape(-1, config.context_length))
        y = torch.from_numpy(validation[1:].reshape(-1, config.context_length))
        for begin in range(0, len(x), 32):
            logits = lab.model_logits(model, x[begin:begin+32])
            total += torch.nn.functional.cross_entropy(logits.flatten(0, 1), y[begin:begin+32].flatten(), reduction="sum").item()
    ce = total / y.numel()
    assert ce < entropy + .35, f"Validation CE {ce:.3f} should approach entropy {entropy:.3f}; check shifted labels, data loading and optimization"
    assert ce >= entropy - .05, f"Validation CE {ce:.3f} below entropy {entropy:.3f} suggests labels leak into inputs or attention"


def test_checkpoint_resume_matches_uninterrupted_losses_exactly(lab, tmp_path):
    """Resume must restore optimizer, global schedule and data RNG from a fresh model."""
    tokens, _ = markov_corpus(61, 5000)
    config = LabConfig()
    full = lab.run_training(config, tokens, 20, str(tmp_path / "full"), None, 9)
    first = lab.run_training(config, tokens, 10, str(tmp_path / "split"), None, 9)
    resumed = lab.run_training(config, tokens, 20, str(tmp_path / "resumed"),
                               str(tmp_path / "split" / "checkpoint.pt"), 9)
    assert first == full[:10], "The first ten steps must agree before resuming"
    assert resumed == full[10:], "Resume differs: restore AdamW moments/step, schedule and data-generator state, not just weights"
    assert len(resumed) == 10, "steps is a global endpoint, not ten additional epochs or twenty new steps"
    no_steps = lab.run_training(config, tokens, 20, str(tmp_path / "done"),
                                str(tmp_path / "resumed" / "checkpoint.pt"), 42)
    assert no_steps == [], "Already-completed global steps must not execute again"
