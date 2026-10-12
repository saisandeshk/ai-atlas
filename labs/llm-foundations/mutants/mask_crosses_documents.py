"""Bug: causal attention ignores document ownership and crosses boundaries."""

from reference import *
import numpy as np


def document_attention_mask(document_ids):
    """Bug: allow every earlier key, including keys from other documents."""
    owners = np.asarray(document_ids)
    if owners.ndim not in (1, 2):
        raise ValueError("document_ids must be a vector or a batch of vectors")
    length = owners.shape[-1]
    causal = np.arange(length)[:, None] >= np.arange(length)[None, :]
    return np.broadcast_to(causal, owners.shape[:-1] + causal.shape).copy()
