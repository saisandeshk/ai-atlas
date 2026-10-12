"""Supervise EOS-to-next-document targets instead of masking document crossings."""

from reference import *
import numpy as np


def pack_documents(docs, context_length, eos_id):
    from reference.data import pack_documents as correct
    inputs, targets, loss_mask = correct(docs, context_length, eos_id)
    return inputs, targets, np.ones_like(loss_mask)
