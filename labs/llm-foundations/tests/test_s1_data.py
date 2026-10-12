"""Stage 07 s1 contracts. The shared lab fixture selects the implementation."""

import numpy as np
import pytest


def _expected_pack(documents, context, eos):
    stream, owners = [], []
    for i, document in enumerate(documents):
        stream.extend([*document, eos])
        owners.extend([i] * (len(document) + 1))
    starts = range(0, max(0, len(stream) - context), context)
    x, y, ids = [], [], []
    for start in starts:
        x.append(stream[start : start + context])
        y.append(stream[start + 1 : start + context + 1])
        ids.append(owners[start : start + context])
    shape = (-1, context)
    return tuple(np.asarray(value, dtype=np.int64).reshape(shape) for value in (x, y, ids))


@pytest.mark.parametrize(
    "documents,context",
    [
        ([[11, 12], [21, 22]], 2),
        ([list(range(19)), [50, 51]], 4),
        ([[1], [2], [3], [4]], 1),
        ([[], [7], []], 2),
        ([[1, 2, 3, 4, 5]], 4),
        ([[1]], 4),
        ([], 3),
    ],
    ids=["two-documents", "long-doc", "singletons", "empty-doc-eos", "drop-tail", "too-short", "no-docs"],
)
def test_pack_exact_windows_and_ownership(lab, documents, context):
    actual = lab.pack_documents(documents, context, eos_id=99)
    expected = _expected_pack(documents, context, 99)
    assert len(actual) == 3, "packing must return inputs, targets, and input ownership"
    for label, observed, wanted in zip(("inputs", "targets", "owners"), actual, expected):
        np.testing.assert_array_equal(observed, wanted, err_msg=f"incorrect packed {label}: EOS, stride, or tail handling")
        assert observed.dtype == np.int64, f"packed {label} must be int64, including empty outputs"


def test_pack_roundtrip_retained_stream(lab):
    rng = np.random.default_rng(701)
    documents = [rng.integers(0, 80, size=int(length)).tolist() for length in rng.integers(0, 20, size=25)]
    eos, context = 999, 7
    x, y, owners = lab.pack_documents(documents, context, eos)
    original = [token for document in documents for token in [*document, eos]]
    recovered = [*x.ravel().tolist(), int(y[-1, -1])]
    assert recovered == original[: len(recovered)], "overlapping next-token windows must roundtrip the entire retained stream"
    np.testing.assert_array_equal(x[1:, 0], y[:-1, -1], err_msg="window stride must be context_length, not context_length+1")
    assert len(original) - len(recovered) < context, "only an incomplete final window may be discarded"
    assert owners.shape == x.shape, "ownership is required for every input token"


def test_pack_keeps_existing_and_inserted_eos(lab):
    x, y, owners = lab.pack_documents([[5, 99], [6]], 2, 99)
    np.testing.assert_array_equal(x, [[5, 99], [99, 6]], err_msg="each document needs an appended EOS even when already ending in EOS")
    np.testing.assert_array_equal(y, [[99, 99], [6, 99]])
    np.testing.assert_array_equal(owners, [[0, 0], [0, 1]], err_msg="inserted EOS must belong to the document it terminates")


def test_mask_blocks_cross_document_and_future_attention(lab):
    owners = np.array([0, 0, 1, 1])
    expected = np.array([[1, 0, 0, 0], [1, 1, 0, 0], [0, 0, 1, 0], [0, 0, 1, 1]], dtype=bool)
    actual = lab.document_attention_mask(owners)
    assert actual.dtype == np.bool_, "allowed-attention mask must be boolean"
    np.testing.assert_array_equal(actual, expected, err_msg="attention must be causal AND within the same document")


@pytest.mark.parametrize("length", [0, 1, 2, 17])
def test_mask_random_brute_force(lab, length):
    rng = np.random.default_rng(702 + length)
    owners = rng.integers(0, 5, size=(4, length))
    expected = np.zeros((4, length, length), dtype=bool)
    for batch in range(4):
        for query in range(length):
            for key in range(length):
                expected[batch, query, key] = key <= query and owners[batch, query] == owners[batch, key]
    np.testing.assert_array_equal(lab.document_attention_mask(owners), expected, err_msg="batched mask disagrees with ownership-based brute force")


def test_exact_duplicates_nfc_whitespace_and_case(lab):
    documents = ["café  au\tlait", " cafe\u0301\nau lait ", "Café au lait", "unique", "\t", "", "unique"]
    assert lab.exact_duplicates(documents) == [[0, 1], [3, 6], [4, 5]], "exact groups must collapse whitespace and NFC, but never casefold"
    assert lab.exact_duplicates([]) == [], "empty corpus has no duplicate groups"
    assert lab.exact_duplicates(["one"]) == [], "singleton groups are not duplicates"


def test_near_duplicates_planted_60_word_pair_and_threshold(lab):
    words = [f"word{i}" for i in range(60)]
    changed = words.copy()
    changed[30] = "replacement"
    documents = [" ".join(words), "\n".join(changed), " ".join(f"other{i}" for i in range(60))]
    # 58 distinct trigrams each; one replacement removes three shared grams.
    boundary = 55 / 61
    assert lab.near_duplicate_pairs(documents, n=3, threshold=boundary) == [(0, 1)], "the planted 60-word pair must pass the inclusive Jaccard boundary"
    assert lab.near_duplicate_pairs(documents, n=3, threshold=np.nextafter(boundary, 1.0)) == [], "threshold above the exact Jaccard score must exclude the planted pair"


def test_near_duplicates_use_sets_not_counts(lab):
    assert lab.near_duplicate_pairs(["a a a", "a a a a a"], n=2, threshold=1.0) == [(0, 1)], "repeated ngrams must not change set Jaccard"
    assert lab.near_duplicate_pairs(["a b", "b a"], n=2, threshold=0.1) == [], "ngrams must preserve word order, not just word membership"


def test_near_duplicates_short_docs_normalization_and_case(lab):
    documents = ["café\tcat", " cafe\u0301 cat ", "Café cat", "café", "", "\n"]
    assert lab.near_duplicate_pairs(documents, n=3, threshold=1.0) == [(0, 1), (4, 5)], "short documents use the whole normalized tuple; differing short tuples are not duplicates"
    assert lab.near_duplicate_pairs([], n=3) == [], "an empty corpus has no pairs"
    assert lab.near_duplicate_pairs(["only one"], n=3) == [], "a document cannot duplicate itself"
    assert lab.near_duplicate_pairs(["a", "b"], n=3, threshold=0.0) == [(0, 1)], "zero-similarity pairs meet an inclusive zero threshold"


def test_contamination_13_12_word_boundary(lab):
    thirteen = " ".join(f"w{i}" for i in range(13))
    twelve = " ".join(f"w{i}" for i in range(12))
    actual = lab.contamination_report([thirteen, twelve], [thirteen, twelve, ""])
    np.testing.assert_array_equal(actual, [1.0, 0.0, 0.0], err_msg="13 words yield one 13-gram; 12 words yield none and must score zero")


def test_contamination_union_fraction_and_no_boundary_crossing(lab):
    evaluation = " ".join(f"w{i}" for i in range(15))
    first = " ".join(f"w{i}" for i in range(13))
    last = " ".join(f"w{i}" for i in range(2, 15))
    actual = lab.contamination_report([first, last], [evaluation])
    np.testing.assert_allclose(actual, [2 / 3], err_msg="contamination must count matches against the union of all training sets")
    np.testing.assert_array_equal(lab.contamination_report(["a b", "c d"], ["b c"], n=2), [0.0], err_msg="training document boundaries must not create synthetic ngrams")


def test_contamination_sets_normalization_and_case(lab):
    train = ["café a a"]
    evaluation = [" cafe\u0301\ta a a a ", "Café a", "a a a a"]
    np.testing.assert_array_equal(lab.contamination_report(train, evaluation, n=2), [1.0, 0.0, 1.0], err_msg="fractions use distinct normalized word ngrams, without casefolding")
    np.testing.assert_array_equal(lab.contamination_report([], ["a b"], n=2), [0.0], err_msg="empty training union implies zero contamination")
    empty = lab.contamination_report(train, [], n=2)
    assert empty.shape == (0,) and empty.dtype == np.float64, "empty eval corpus returns an empty float64 vector"


def test_contamination_distinct_ngrams_not_occurrence_weighted(lab):
    np.testing.assert_allclose(
        lab.contamination_report(["a"], ["a a a b c"], n=1),
        [1 / 3],
        err_msg="three occurrences of 'a' count as one matched distinct ngram, not three",
    )
