"""Bug: omits the final RMSNorm weight vector."""

from reference import *
from reference.arithmetic import count_parameters as _correct


def count_parameters(config):
    return _correct(config) - config.d_model
