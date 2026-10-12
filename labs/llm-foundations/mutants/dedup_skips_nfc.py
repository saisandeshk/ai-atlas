"""Bug: exact duplicate normalization skips Unicode NFC composition."""

from reference import *


def exact_duplicates(documents):
    """Bug: collapse whitespace but do not normalize equivalent Unicode."""
    groups = {}
    for index, document in enumerate(documents):
        groups.setdefault(" ".join(document.split()), []).append(index)
    return [indices for indices in groups.values() if len(indices) > 1]
