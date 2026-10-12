"""Small, deterministic data-preparation routines; no model dependencies."""

import unicodedata

import numpy as np

__all__ = [
    "pack_documents",
    "document_attention_mask",
    "exact_duplicates",
    "near_duplicate_pairs",
    "contamination_report",
]


def pack_documents(documents, context_length, eos_id):
    """Return (inputs, targets, owners), each int64 [windows, context_length].

    Append one EOS to EVERY document (including empty documents). EOS belongs
    to that document. Concatenate, then take context_length+1-token windows at
    context_length strides, dropping incomplete windows. Inputs are each
    window's first tokens, targets its last tokens, and owners identify the
    input tokens' original documents. Document indices start at zero.
    """
    if context_length < 1:
        raise ValueError("context_length must be positive")
    tokens, owners = [], []
    for index, document in enumerate(documents):
        chunk = list(document) + [eos_id]
        tokens.extend(chunk)
        owners.extend([index] * len(chunk))
    stream = np.asarray(tokens, dtype=np.int64)
    ownership = np.asarray(owners, dtype=np.int64)
    count = max(0, (len(stream) - 1) // context_length)
    offsets = np.arange(count)[:, None] * context_length
    positions = offsets + np.arange(context_length)[None, :]
    return stream[positions], stream[positions + 1], ownership[positions]


def document_attention_mask(document_ids):
    """Return a boolean allowed-attention mask for 1D or batched 2D owners.

    The final two axes are (query, key). A query may attend to itself and
    earlier tokens ONLY when both tokens have the same document owner.
    """
    owners = np.asarray(document_ids)
    if owners.ndim not in (1, 2):
        raise ValueError("document_ids must be a vector or a batch of vectors")
    length = owners.shape[-1]
    causal = np.arange(length)[:, None] >= np.arange(length)[None, :]
    return (owners[..., :, None] == owners[..., None, :]) & causal


def _normalize(text):
    return " ".join(unicodedata.normalize("NFC", text).split())


def _word_ngrams(text, n, short_document=False):
    words = _normalize(text).split()
    if len(words) < n:
        return {tuple(words)} if short_document else set()
    return {tuple(words[i : i + n]) for i in range(len(words) - n + 1)}


def exact_duplicates(documents):
    """Return index groups (size >= 2), in first-occurrence order.

    Equivalence is NFC normalization plus whitespace collapse/trim; case is
    preserved. Indices inside each group are in original document order.
    """
    groups = {}
    for index, document in enumerate(documents):
        groups.setdefault(_normalize(document), []).append(index)
    return [indices for indices in groups.values() if len(indices) > 1]


def near_duplicate_pairs(documents, n=3, threshold=0.8):
    """Return (i, j), i < j, whose word-ngram-set Jaccard >= threshold.

    Normalize NFC and whitespace, preserving case. A document shorter than
    n words contributes exactly one ngram: its whole word tuple (including
    the empty tuple for an empty document). Pairs are lexicographically sorted.
    """
    if n < 1:
        raise ValueError("n must be positive")
    if not 0 <= threshold <= 1:
        raise ValueError("threshold must be between zero and one")
    shingles = [_word_ngrams(text, n, short_document=True) for text in documents]
    pairs = []
    for i, left in enumerate(shingles):
        for j in range(i + 1, len(shingles)):
            right = shingles[j]
            similarity = len(left & right) / len(left | right)
            if similarity >= threshold:
                pairs.append((i, j))
    return pairs


def contamination_report(training_documents, evaluation_documents, n=13):
    """Return a float64 vector of contamination fractions, one per eval doc.

    Each fraction is the proportion of DISTINCT evaluation word ngrams that
    occur in the union of training documents' ngram sets. Document boundaries
    are not crossed. Normalize NFC and whitespace, preserving case. Evaluation
    documents shorter than n words score zero, even if present verbatim in
    training. Training documents shorter than n contribute no ngrams.
    """
    if n < 1:
        raise ValueError("n must be positive")
    training = set()
    for document in training_documents:
        training.update(_word_ngrams(document, n))
    fractions = []
    for document in evaluation_documents:
        evaluation = _word_ngrams(document, n)
        fractions.append(len(evaluation & training) / len(evaluation) if evaluation else 0.0)
    return np.asarray(fractions, dtype=np.float64)
