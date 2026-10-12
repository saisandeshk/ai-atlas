"""Retain prompt tokens and recompute the full prefix for every decode step."""
from reference import *
import torch


class PrefixCache(list):
    """KV-compatible cache with extra token history for the erroneous slow path."""


def cached_forward(model, tokens, cache, start_pos):
    prefix = tokens if cache is None else torch.cat((cache.tokens, tokens), 1)
    logits, kv = model(prefix)
    updated = PrefixCache(kv)
    updated.tokens = prefix
    return logits[:, -tokens.shape[1]:], updated
