"""Bug: budgets parameters and moments but forgets gradients."""

from reference import *
from reference.arithmetic import count_parameters


def adamw_training_bytes(config, param_bytes=4):
    return 3 * param_bytes * count_parameters(config)
