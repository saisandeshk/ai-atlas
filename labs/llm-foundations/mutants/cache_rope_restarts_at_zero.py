"""Rotate each cached chunk starting at zero instead of its absolute position."""
from reference import *


def cached_forward(model, tokens, cache, start_pos):
    return model(tokens, cache, start_pos, rope_start=0)
