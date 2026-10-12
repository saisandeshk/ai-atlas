"""Independent architecture and statistical checks for the S4 adapter.

Counter convention: 2mnk FLOPs per matmul, full T*T attention with no causal
savings, and elementwise work excluded (norms, activations, softmax, and RoPE).
"""

import math

import numpy as np
import pytest
import torch
from torch import nn
from torch.utils.flop_counter import FlopCounterMode

from adapters import LabConfig


class AccountingBlock(nn.Module):
    """A test-owned block with explicit, full-quadratic attention matmuls."""

    def __init__(self, config):
        super().__init__()
        self.config = config
        d = config.d_model
        kv = d // config.n_heads * config.n_kv_heads
        self.norm1 = nn.Parameter(torch.ones(d))
        self.norm2 = nn.Parameter(torch.ones(d))
        self.q = nn.Linear(d, d, bias=False)
        self.k = nn.Linear(d, kv, bias=False)
        self.v = nn.Linear(d, kv, bias=False)
        self.o = nn.Linear(d, d, bias=False)
        self.gate = nn.Linear(d, config.d_ff, bias=False)
        self.up = nn.Linear(d, config.d_ff, bias=False)
        self.down = nn.Linear(config.d_ff, d, bias=False)

    def forward(self, x):
        c = self.config
        batch, length, d = x.shape
        normalized = x * torch.rsqrt(x.square().mean(-1, keepdim=True) + 1e-5)
        normalized = normalized * self.norm1
        q = self.q(normalized).view(batch, length, c.n_heads, d // c.n_heads)
        k = self.k(normalized).view(batch, length, c.n_kv_heads, d // c.n_heads)
        v = self.v(normalized).view(batch, length, c.n_kv_heads, d // c.n_heads)
        q = q.transpose(1, 2)
        k = k.transpose(1, 2)
        # RoPE and causal masking add no matmul FLOPs, but keep this an actual
        # shared-contract decoder rather than a parameter-only mock module.
        angles = torch.arange(length)[:, None] * c.rope_theta ** (
            -torch.arange(0, d // c.n_heads, 2, dtype=x.dtype) / (d // c.n_heads))
        def rotate(tensor):
            even, odd = tensor[..., ::2], tensor[..., 1::2]
            return torch.stack((even*angles.cos()-odd*angles.sin(),
                                even*angles.sin()+odd*angles.cos()), -1).flatten(-2)
        q, k = rotate(q), rotate(k)
        k = k.repeat_interleave(c.n_heads // c.n_kv_heads, dim=1)
        v = v.transpose(1, 2).repeat_interleave(c.n_heads // c.n_kv_heads, dim=1)
        scores = q @ k.transpose(-2, -1) / math.sqrt(d // c.n_heads)
        causal = torch.arange(length)[:, None] >= torch.arange(length)[None, :]
        probabilities = scores.masked_fill(~causal, float("-inf")).softmax(-1)
        attended = (probabilities @ v).transpose(1, 2).reshape(batch, length, d)
        x = x + self.o(attended)
        normalized = x * torch.rsqrt(x.square().mean(-1, keepdim=True) + 1e-5)
        normalized = normalized * self.norm2
        return x + self.down(torch.nn.functional.silu(self.gate(normalized)) * self.up(normalized))


class AccountingModel(nn.Module):
    def __init__(self, config):
        super().__init__()
        self.embedding = nn.Embedding(config.vocab_size, config.d_model)
        self.blocks = nn.ModuleList([AccountingBlock(config) for _ in range(config.n_layers)])
        self.final_norm = nn.Parameter(torch.ones(config.d_model))
        self.lm_head = nn.Linear(config.d_model, config.vocab_size, bias=False)
        if config.tie_embeddings:
            self.lm_head.weight = self.embedding.weight

    def forward(self, tokens):
        x = self.embedding(tokens)
        for block in self.blocks:
            x = block(x)
        x = x * torch.rsqrt(x.square().mean(-1, keepdim=True) + 1e-5)
        return self.lm_head(x * self.final_norm)


CONFIGS = [
    {},
    {"tie_embeddings": True},
    {"n_kv_heads": 1},
    {"n_kv_heads": 4},
    {"d_model": 48, "n_heads": 6, "n_kv_heads": 3, "d_ff": 80},
    {"vocab_size": 37, "n_layers": 3, "d_model": 24, "n_heads": 4,
     "n_kv_heads": 1, "d_ff": 40, "tie_embeddings": True},
]


def make_config(overrides):
    fields = dict(vocab_size=64, context_length=32, d_model=32, n_layers=2,
                  n_heads=4, n_kv_heads=2, d_ff=64, rope_theta=10000,
                  tie_embeddings=False)
    fields.update(overrides)
    return LabConfig(**fields)


@pytest.mark.parametrize("overrides", CONFIGS)
def test_parameter_count_matches_independent_module(lab, overrides):
    """Count real trainable tensors independently, including MQA/MHA and ties."""
    torch.manual_seed(41)
    config = make_config(overrides)
    expected = sum(parameter.numel() for parameter in AccountingModel(config).parameters())
    assert lab.count_parameters(config) == expected, "Count all norms and count tied weights only once"


@pytest.mark.parametrize("overrides", CONFIGS)
@pytest.mark.parametrize("batch,seq_len", [(1, 3), (2, 7)])
def test_forward_flops_match_torch_counter(lab, overrides, batch, seq_len):
    """Match 2mnk dense linear and full T*T attention FLOPs, not elementwise ops."""
    torch.manual_seed(42)
    config = make_config(overrides)
    model = AccountingModel(config)
    tokens = torch.randint(config.vocab_size, (batch, seq_len))
    with torch.no_grad(), FlopCounterMode(display=False) as counter:
        model(tokens)
    assert lab.forward_matmul_flops(config, batch, seq_len) == counter.get_total_flops(), (
        "Include Q/K/V/O, all three SwiGLU matrices, LM head, and both attention matmuls; MAC = 2 FLOPs"
    )


@pytest.mark.parametrize("param_bytes", [2, 4, 8])
@pytest.mark.parametrize("overrides", CONFIGS)
def test_adamw_bytes_exact(lab, overrides, param_bytes):
    """Check every integer byte-count bucket and their total, including defaults."""
    config = make_config(overrides)
    parameters = sum(p.numel() for p in AccountingModel(config).parameters())
    size = parameters * param_bytes
    expected = {name: size for name in ("params", "grads", "adam_m", "adam_v")}
    expected["total"] = 4 * size
    actual = lab.adamw_training_bytes(config, param_bytes)
    assert isinstance(actual, dict), "Return named byte-count buckets, not a scalar total"
    assert actual == expected, (
        "Each AdamW bucket stores one scalar per parameter; total includes all four buckets"
    )
    assert all(type(value) is int for value in actual.values()), "Byte counts must be integers"
    default = {name: parameters * 4 for name in ("params", "grads", "adam_m", "adam_v")}
    default["total"] = parameters * 16
    assert lab.adamw_training_bytes(config) == default, (
        "Default scalar storage is four bytes in each of the four AdamW buckets"
    )


def test_bootstrap_deterministic_and_centered_on_mean(lab):
    """Seeded percentile intervals target the mean and collapse for constant data."""
    scores = np.random.default_rng(51).normal(3, 1, 200)
    first = lab.bootstrap_ci(scores, confidence=0.95, n_resamples=1500, seed=52)
    assert first == lab.bootstrap_ci(scores, confidence=0.95, n_resamples=1500, seed=52), (
        "The seed must reproduce the same bootstrap interval"
    )
    lower, upper = first
    assert lower < scores.mean() < upper, "Bootstrap the mean, not individual score quantiles"
    assert abs((lower + upper) / 2 - scores.mean()) < 0.04, (
        "For symmetric scores the mean interval should be centered near the observed mean"
    )
    assert lab.bootstrap_ci([7] * 20, 0.95, 300, 53) == (7, 7), (
        "Constant scores have no resampling uncertainty, so both endpoints must equal seven"
    )


def test_bootstrap_width_scales_with_sample_count(lab):
    """Holding the empirical distribution fixed isolates the 1/sqrt(n) scaling."""
    rng = np.random.default_rng(54)
    small = rng.normal(size=200)
    large = np.tile(small, 4)
    small_ci = lab.bootstrap_ci(small, 0.95, 2000, 55)
    large_ci = lab.bootstrap_ci(large, 0.95, 2000, 56)
    ratio = (large_ci[1] - large_ci[0]) / (small_ci[1] - small_ci[0])
    assert 0.42 < ratio < 0.58, "Quadrupling n should halve mean-interval width"


def test_bootstrap_bernoulli_coverage(lab):
    """Check nominal 95% coverage over 300 seeded Bernoulli datasets of size 200."""
    rng = np.random.default_rng(57)
    covered = 0
    for trial in range(300):
        scores = rng.binomial(1, 0.7, size=200)
        lower, upper = lab.bootstrap_ci(scores, 0.95, 800, 1000 + trial)
        covered += lower <= 0.7 <= upper
    coverage = covered / 300
    assert 0.90 <= coverage <= 0.98, f"95% intervals covered p=0.7 in {coverage:.1%} of 300 trials"


def test_paired_bootstrap_preserves_pairing(lab):
    """Pairing detects a constant gain that an independent bootstrap obscures."""
    # Shared example difficulty is huge, but every paired improvement is exactly 0.25.
    a = np.linspace(-100, 100, 100) + 0.25
    b = np.linspace(-100, 100, 100)
    interval = lab.paired_bootstrap_diff(a, b, 0.95, 1000, 61)
    assert np.allclose(interval, (0.25, 0.25), atol=1e-12), (
        "Resample the same indices for a and b; independent resampling destroys pairing"
    )
    assert interval == lab.paired_bootstrap_diff(a, b, 0.95, 1000, 61), (
        "The paired interval must also be exactly reproducible with the same seed"
    )
    rng = np.random.default_rng(61)
    a_means = a[rng.integers(0, len(a), (1000, len(a)))].mean(axis=1)
    b_means = b[rng.integers(0, len(b), (1000, len(b)))].mean(axis=1)
    unpaired = np.quantile(a_means - b_means, [0.025, 0.975])
    assert unpaired[0] < 0 < unpaired[1], (
        "Independent resampling must include zero here despite the strictly positive paired gain"
    )


def test_paired_bootstrap_matches_bootstrap_of_differences(lab):
    """Shared resampling is exactly a mean bootstrap over per-example differences."""
    rng = np.random.default_rng(62)
    b = rng.normal(0, 10, 200)
    a = b + rng.normal(0.3, 0.2, 200)
    expected = lab.bootstrap_ci(a - b, 0.95, 1200, 63)
    actual = lab.paired_bootstrap_diff(a, b, 0.95, 1200, 63)
    assert np.allclose(actual, expected, atol=1e-12), "Paired bootstrap is bootstrap on per-example differences"
