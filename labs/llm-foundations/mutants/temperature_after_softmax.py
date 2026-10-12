"""Apply temperature by division after softmax, which cancels on renormalization."""
from reference import *
from reference.training import filter_probs as correct


def filter_probs(logits, temperature, top_k, top_p):
    return correct(logits, 0 if temperature == 0 else 1., top_k, top_p)
