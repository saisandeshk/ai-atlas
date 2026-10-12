"""Zero filtered tokens without renormalizing the surviving probability mass."""
from reference import *
from reference.training import filter_probs as correct


def filter_probs(logits, temperature, top_k, top_p):
    result = correct(logits, temperature, top_k, top_p)
    if temperature == 0:
        return result
    return (logits / temperature).softmax(-1) * (result > 0)
