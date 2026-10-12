"""Bug: omit the EOS separator appended to every document."""

from reference import *
import numpy as np


def pack_documents(documents, context_length, eos_id):
    """Bug: pack raw documents without their required terminal EOS tokens."""
    if context_length < 1:
        raise ValueError("context_length must be positive")
    tokens, owners = [], []
    for index, document in enumerate(documents):
        chunk = list(document)
        tokens.extend(chunk)
        owners.extend([index] * len(chunk))
    stream = np.asarray(tokens, dtype=np.int64)
    ownership = np.asarray(owners, dtype=np.int64)
    count = max(0, (len(stream) - 1) // context_length)
    positions = np.arange(count)[:, None] * context_length + np.arange(context_length)[None, :]
    loss_mask = ownership[positions] == ownership[positions + 1]
    return stream[positions], stream[positions + 1], loss_mask
