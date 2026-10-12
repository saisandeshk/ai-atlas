"""Measure contamination with n-1-word shingles instead of n-word shingles."""
from reference import *
from reference.data import _normalize


def contamination_report(train_docs, eval_docs, n=13):
    width = n - 1
    training = set()
    for doc in train_docs:
        words = _normalize(doc).split()
        training.update(tuple(words[i:i+width]) for i in range(len(words)-width+1))
    result = []
    for doc in eval_docs:
        words = _normalize(doc).split()
        grams = [tuple(words[i:i+width]) for i in range(len(words)-width+1)]
        result.append(sum(gram in training for gram in grams) / len(grams) if grams else 0.)
    return result
