"""Bug: budgets parameters and moments but forgets gradients."""

from reference import *
from reference.arithmetic import adamw_training_bytes as _correct


def adamw_training_bytes(config, param_bytes=4):
    result = _correct(config, param_bytes)
    result["total"] -= result["grads"]
    result["grads"] = 0
    return result
