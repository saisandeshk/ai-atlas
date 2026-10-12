"""Build a separate LM head even when shared embeddings are requested."""
from reference import *
from reference.model import make_model as correct
from dataclasses import replace


def make_model(config, seed):
    return correct(replace(config, tie_embeddings=False), seed)
