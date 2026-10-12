"""Restart the seeded data stream on resume rather than restore its position."""
from reference import *
from reference.training import train


def run_training(config, tokens, steps, out_dir, resume_from, seed):
    return train(config, tokens, steps, out_dir, resume_from, seed, restore_data=False)
