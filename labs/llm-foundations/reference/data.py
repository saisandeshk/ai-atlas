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


def pack_documents(docs, context_length, eos_id):
    """Return (inputs, targets, loss_mask), each [windows, context_length].

    Append one EOS to EVERY document (including empty documents). EOS belongs
    to that document. Concatenate, then take context_length+1-token windows at
    context_length strides, dropping incomplete windows. Inputs are each
    window's first tokens and targets its last tokens, both int64. The boolean
    loss_mask is true iff input and target belong to the same document: token
    to its own EOS is supervised, but EOS to the next document is not.
    """
    if context_length < 1:
        raise ValueError("context_length must be positive")
    tokens, owners = [], []
    for index, document in enumerate(docs):
        chunk = list(document) + [eos_id]
        tokens.extend(chunk)
        owners.extend([index] * len(chunk))
    stream = np.asarray(tokens, dtype=np.int64)
    ownership = np.asarray(owners, dtype=np.int64)
    count = max(0, (len(stream) - 1) // context_length)
    offsets = np.arange(count)[:, None] * context_length
    positions = offsets + np.arange(context_length)[None, :]
    loss_mask = ownership[positions] == ownership[positions + 1]
    return stream[positions], stream[positions + 1], loss_mask


def document_attention_mask(doc_ids):
    """Return a boolean [T,T] allowed-attention mask for one 1D ID array.

    The final two axes are (query, key). A query may attend to itself and
    earlier tokens ONLY when both tokens have the same document owner.
    """
    owners = np.asarray(doc_ids)
    if owners.ndim != 1:
        raise ValueError("doc_ids must be a vector")
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


def exact_duplicates(docs):
    """Return sorted indices of documents repeating an earlier document.

    Equivalence is NFC normalization plus whitespace collapse/trim; case is
    preserved. Keep the first occurrence; return every subsequent occurrence.
    """
    seen = set()
    duplicates = []
    for index, document in enumerate(docs):
        normalized = _normalize(document)
        if normalized in seen:
            duplicates.append(index)
        seen.add(normalized)
    return duplicates


def near_duplicate_pairs(docs, n=5, threshold=0.8):
    """Return (i, j), i < j, whose word-ngram-set Jaccard >= threshold.

    Normalize NFC and whitespace, preserving case. A document shorter than
    n words contributes exactly one ngram: its whole word tuple (including
    the empty tuple for an empty document). Pairs are lexicographically sorted.
    """
    if n < 1:
        raise ValueError("n must be positive")
    if not 0 <= threshold <= 1:
        raise ValueError("threshold must be between zero and one")
    shingles = [_word_ngrams(text, n, short_document=True) for text in docs]
    pairs = []
    for i, left in enumerate(shingles):
        for j in range(i + 1, len(shingles)):
            right = shingles[j]
            similarity = len(left & right) / len(left | right)
            if similarity >= threshold:
                pairs.append((i, j))
    return pairs


def contamination_report(train_docs, eval_docs, n=13):
    """Return list[float] contamination fractions, one per evaluation document.

    Each fraction is the proportion of evaluation word-ngram OCCURRENCES that
    occur in the union of training documents' ngram sets. Repeated evaluation
    ngrams count repeatedly in both numerator and denominator. Document boundaries
    are not crossed. Normalize NFC and whitespace, preserving case. Evaluation
    documents shorter than n words score zero, even if present verbatim in
    training. Training documents shorter than n contribute no ngrams.
    """
    if n < 1:
        raise ValueError("n must be positive")
    training = set()
    for document in train_docs:
        training.update(_word_ngrams(document, n))
    fractions = []
    for document in eval_docs:
        words = _normalize(document).split()
        evaluation = [tuple(words[i : i + n]) for i in range(len(words) - n + 1)]
        matched = sum(ngram in training for ngram in evaluation)
        fractions.append(matched / len(evaluation) if evaluation else 0.0)
    return fractions
