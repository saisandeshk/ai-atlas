"""Bug: exact duplicate normalization skips Unicode NFC composition."""

from reference import *


def exact_duplicates(documents):
    """Bug: collapse whitespace but do not normalize equivalent Unicode."""
    seen = set()
    duplicates = []
    for index, document in enumerate(documents):
        normalized = " ".join(document.split())
        if normalized in seen:
            duplicates.append(index)
        seen.add(normalized)
    return duplicates
