"""Restore checkpoint weights but discard the AdamW moment and step state."""
from reference import *
from reference.training import train


def run_training(config, tokens, steps, out_dir, resume_from, seed):
    return train(config, tokens, steps, out_dir, resume_from, seed, restore_optimizer=False)
