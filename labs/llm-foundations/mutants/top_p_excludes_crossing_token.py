"""Drop the token whose cumulative probability crosses the nucleus threshold."""
from reference import *
import torch


def filter_probs(logits, temperature, top_k, top_p):
    from reference.training import filter_probs as correct
    probs = correct(logits, temperature, top_k, None)
    if temperature == 0 or top_p is None:
        return probs
    values, indices = probs.sort(descending=True, dim=-1)
    keep = values.cumsum(-1) <= top_p
    keep[..., 0] = True
    values = values * keep
    values = values / values.sum(-1, keepdim=True)
    return torch.zeros_like(probs).scatter(-1, indices, values)
