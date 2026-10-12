"""Select learner adapters, or an explicitly requested reference/mutant."""
import importlib
import os
import pytest


class ConnectedAdapters:
    def __init__(self, module):
        self.module = module

    def __getattr__(self, name):
        value = getattr(self.module, name)
        if not callable(value):
            return value

        def connected(*args, **kwargs):
            try:
                return value(*args, **kwargs)
            except NotImplementedError:
                pytest.skip("adapter not connected")
        return connected


@pytest.fixture
def lab():
    return ConnectedAdapters(importlib.import_module(os.getenv("ATLAS_LAB_IMPL", "adapters")))


@pytest.fixture(autouse=True)
def deterministic_test():
    import random
    import numpy as np
    import torch
    random.seed(123)
    np.random.seed(123)
    torch.manual_seed(123)
    torch.set_num_threads(1)
    torch.use_deterministic_algorithms(True)
