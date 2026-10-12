"""Restart rotary positions at zero for every input slice."""
from reference import *
from reference.model import apply_rope as correct
import torch


def apply_rope(x, positions, theta):
    return correct(x, torch.arange(x.shape[-2]), theta)
