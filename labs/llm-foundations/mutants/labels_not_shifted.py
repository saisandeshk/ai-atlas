"""Train each token to predict itself instead of its next token."""
from reference import *
from reference.training import train


def run_training(config, tokens, steps, out_dir, resume_from, seed):
    return train(config, tokens, steps, out_dir, resume_from, seed, unshifted_labels=True)
