"""Assign query heads to KV heads cyclically instead of in contiguous groups."""
from reference import *
from reference.model import grouped_query_attention as correct


def grouped_query_attention(q, k, v, causal):
    repeats = q.shape[1] // k.shape[1]
    return correct(q, k.repeat(1, repeats, 1, 1), v.repeat(1, repeats, 1, 1), causal)
