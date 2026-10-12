"""Bug: counts multiply-accumulate pairs instead of FLOPs."""

from reference import *
from reference.arithmetic import forward_matmul_flops as _correct


def forward_matmul_flops(config, batch, seq_len):
    return _correct(config, batch, seq_len) // 2
