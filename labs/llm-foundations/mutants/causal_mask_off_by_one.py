"""Allow the query to see the next token in causal attention."""
from reference import *
import math
import torch


def grouped_query_attention(q, k, v, causal):
    repeats = q.shape[1] // k.shape[1]
    k, v = k.repeat_interleave(repeats, 1), v.repeat_interleave(repeats, 1)
    scores = q @ k.transpose(-1, -2) / math.sqrt(q.shape[-1])
    if causal:
        t, s = q.shape[-2], k.shape[-2]
        allowed = torch.arange(s)[None, :] <= s - t + torch.arange(t)[:, None] + 1
        scores = scores.masked_fill(~allowed, float("-inf"))
    return scores.softmax(-1) @ v
