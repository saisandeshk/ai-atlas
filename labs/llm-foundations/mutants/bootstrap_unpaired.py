"""Bug: independently resamples two scores that describe matched examples."""

import numpy as np

from reference import *


def paired_bootstrap_diff(a, b, confidence=0.95, n_resamples=2000, seed=0):
    a, b = np.asarray(a), np.asarray(b)
    rng = np.random.default_rng(seed)
    a_means = a[rng.integers(0, len(a), (n_resamples, len(a)))].mean(axis=1)
    b_means = b[rng.integers(0, len(b), (n_resamples, len(b)))].mean(axis=1)
    alpha = (1 - confidence) / 2
    return tuple(np.quantile(a_means - b_means, [alpha, 1 - alpha]))
