"""Bug: omit the final evaluation ngram (including the sole 13-word gram)."""

from reference import *
import unicodedata
import numpy as np


def contamination_report(training_documents, evaluation_documents, n=13):
    """Bug: evaluation windows stop one position too early."""
    if n < 1:
        raise ValueError("n must be positive")

    def words(text):
        return unicodedata.normalize("NFC", text).split()

    training = set()
    for document in training_documents:
        tokens = words(document)
        training.update(tuple(tokens[i : i + n]) for i in range(len(tokens) - n + 1))
    fractions = []
    for document in evaluation_documents:
        tokens = words(document)
        evaluation = {tuple(tokens[i : i + n]) for i in range(len(tokens) - n)}
        fractions.append(len(evaluation & training) / len(evaluation) if evaluation else 0.0)
    return np.asarray(fractions, dtype=np.float64)
