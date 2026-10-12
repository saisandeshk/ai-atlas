"""Architecture accounting and seeded percentile-bootstrap estimates."""

import numpy as np


def count_parameters(config):
    """Count trainable scalars, counting a tied embedding only once."""
    d = config.d_model
    kv = d // config.n_heads * config.n_kv_heads
    block = 2 * d + 2 * d * d + 2 * d * kv + 3 * d * config.d_ff
    return config.vocab_size * d + config.n_layers * block + d + (
        0 if config.tie_embeddings else config.vocab_size * d
    )


def forward_matmul_flops(config, batch, seq_len):
    """Count 2mnk per matmul, full T*T attention, and no elementwise work.

    Causal masking does not reduce the dense attention matmul count.
    """
    d = config.d_model
    kv = d // config.n_heads * config.n_kv_heads
    linear = config.n_layers * (2 * d * d + 2 * d * kv + 3 * d * config.d_ff)
    linear += config.vocab_size * d
    attention = 4 * config.n_layers * batch * seq_len * seq_len * d
    return 2 * batch * seq_len * linear + attention


def adamw_training_bytes(config, param_bytes=4):
    """Return integer byte counts for weights, gradients, moments, and total."""
    size = int(param_bytes * count_parameters(config))
    result = {name: size for name in ("params", "grads", "adam_m", "adam_v")}
    result["total"] = sum(result.values())
    return result


def _scores(scores):
    values = np.asarray(scores, dtype=float)
    if values.ndim != 1 or values.size == 0 or not np.all(np.isfinite(values)):
        raise ValueError("scores must be a nonempty, finite one-dimensional array")
    return values


def _bounds(values, confidence):
    if not 0 < confidence < 1:
        raise ValueError("confidence must lie strictly between zero and one")
    alpha = (1 - confidence) / 2
    lower, upper = np.quantile(values, [alpha, 1 - alpha])
    return float(lower), float(upper)


def bootstrap_ci(scores, confidence=0.95, n_resamples=2000, seed=0):
    """Return percentile bounds for the mean using a local seeded RNG."""
    scores = _scores(scores)
    if not isinstance(n_resamples, (int, np.integer)) or n_resamples <= 0:
        raise ValueError("n_resamples must be a positive integer")
    rng = np.random.default_rng(seed)
    means = np.empty(n_resamples)
    # Bound peak memory even when evaluating a large dataset.
    for start in range(0, n_resamples, 256):
        size = min(256, n_resamples - start)
        indices = rng.integers(0, scores.size, size=(size, scores.size))
        means[start : start + size] = scores[indices].mean(axis=1)
    return _bounds(means, confidence)


def paired_bootstrap_diff(a, b, confidence=0.95, n_resamples=2000, seed=0):
    """Bootstrap mean(a - b) by resampling matched examples together."""
    a, b = _scores(a), _scores(b)
    if a.shape != b.shape:
        raise ValueError("paired scores must have the same length")
    return bootstrap_ci(a - b, confidence, n_resamples, seed)
