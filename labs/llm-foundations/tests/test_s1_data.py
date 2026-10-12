"""Stage 07 s1 contracts. The shared lab fixture selects the implementation."""

import numpy as np
import pytest


def _expected_pack(documents, context, eos):
    stream, owners = [], []
    for i, document in enumerate(documents):
        stream.extend([*document, eos])
        owners.extend([i] * (len(document) + 1))
    starts = range(0, max(0, len(stream) - context), context)
    x, y, masks = [], [], []
    for start in starts:
        x.append(stream[start : start + context])
        y.append(stream[start + 1 : start + context + 1])
        masks.append([owners[i] == owners[i + 1] for i in range(start, start + context)])
    shape = (-1, context)
    return (
        np.asarray(x, dtype=np.int64).reshape(shape),
        np.asarray(y, dtype=np.int64).reshape(shape),
        np.asarray(masks, dtype=bool).reshape(shape),
    )


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
def test_pack_exact_windows_and_loss_mask(lab, documents, context):
    """Retain EOS, one-token overlap, ownership masking and only full windows."""
    actual = lab.pack_documents(documents, context, eos_id=99)
    expected = _expected_pack(documents, context, 99)
    assert len(actual) == 3, "packing must return inputs, targets, and a boolean loss mask"
    for label, observed, wanted in zip(("inputs", "targets", "loss_mask"), actual, expected):
        np.testing.assert_array_equal(observed, wanted, err_msg=f"incorrect packed {label}: EOS, stride, or tail handling")
        assert observed.dtype == wanted.dtype, f"packed {label} must have dtype {wanted.dtype}, including empty outputs"


def test_pack_roundtrip_retained_stream(lab):
    """Random packed windows reconstruct the retained stream without interior drops."""
    rng = np.random.default_rng(701)
    documents = [rng.integers(0, 80, size=int(length)).tolist() for length in rng.integers(0, 20, size=25)]
    eos, context = 999, 7
    x, y, loss_mask = lab.pack_documents(documents, context, eos)
    original = [token for document in documents for token in [*document, eos]]
    recovered = [*x.ravel().tolist(), int(y[-1, -1])]
    assert recovered == original[: len(recovered)], "overlapping next-token windows must roundtrip the entire retained stream"
    np.testing.assert_array_equal(x[1:, 0], y[:-1, -1], err_msg="window stride must be context_length, not context_length+1")
    assert len(original) - len(recovered) < context, "only an incomplete final window may be discarded"
    assert loss_mask.shape == x.shape, "loss eligibility is required for every input-target pair"
    np.testing.assert_array_equal(loss_mask, _expected_pack(documents, context, eos)[2], err_msg="random packing loss mask must follow document ownership")


def test_pack_keeps_existing_and_inserted_eos(lab):
    """EOS is appended even to documents already ending in the same token ID."""
    x, y, loss_mask = lab.pack_documents([[5, 99], [6]], 2, 99)
    np.testing.assert_array_equal(x, [[5, 99], [99, 6]], err_msg="each document needs an appended EOS even when already ending in EOS")
    np.testing.assert_array_equal(y, [[99, 99], [6, 99]], err_msg="Targets must be the one-token shift, including inserted EOS")
    np.testing.assert_array_equal(loss_mask, [[True, True], [False, True]], err_msg="own EOS is supervised; EOS-to-next-document prediction must be masked")


def test_mask_blocks_cross_document_and_future_attention(lab):
    """A hand-built mask blocks future keys and keys in other documents."""
    owners = np.array([0, 0, 1, 1])
    expected = np.array([[1, 0, 0, 0], [1, 1, 0, 0], [0, 0, 1, 0], [0, 0, 1, 1]], dtype=bool)
    actual = lab.document_attention_mask(owners)
    assert actual.dtype == np.bool_, "allowed-attention mask must be boolean"
    np.testing.assert_array_equal(actual, expected, err_msg="attention must be causal AND within the same document")


@pytest.mark.parametrize("length", [0, 1, 2, 17])
def test_mask_random_brute_force(lab, length):
    """Random one-window IDs, including repeated noncontiguous IDs, match brute force."""
    rng = np.random.default_rng(702 + length)
    owners = rng.integers(0, 5, size=length)
    expected = np.zeros((length, length), dtype=bool)
    for query in range(length):
        for key in range(length):
            expected[query, key] = key <= query and owners[query] == owners[key]
    np.testing.assert_array_equal(lab.document_attention_mask(owners), expected, err_msg="Mask disagrees with causal ownership-based brute force")


def test_exact_duplicates_nfc_whitespace_and_case(lab):
    """Only later repeats count, after NFC/whitespace normalization without casefolding."""
    documents = ["café  au\tlait", " cafe\u0301\nau lait ", "Café au lait", "unique", "\t", "", "unique"]
    assert lab.exact_duplicates(documents) == [1, 5, 6], "return only later duplicate indices, sorted, with NFC/whitespace normalization and preserved case"
    assert lab.exact_duplicates([]) == [], "empty corpus has no duplicate indices"
    assert lab.exact_duplicates(["one"]) == [], "the first occurrence is not a duplicate"
    assert lab.exact_duplicates(["a", "b", "a", "a", "b"]) == [2, 3, 4], "every repeat must be returned, not first occurrences or grouped indices"


def test_near_duplicates_planted_60_word_pair_and_threshold(lab):
    """A one-word change passes; unrelated docs do not; the exact threshold is included."""
    words = [f"word{i}" for i in range(60)]
    changed = words.copy()
    changed[30] = "replacement"
    documents = [" ".join(words), "\n".join(changed), " ".join(f"other{i}" for i in range(60))]
    # 56 distinct five-word grams each; one replacement removes five shared grams.
    boundary = 51 / 61
    assert lab.near_duplicate_pairs(documents) == [(0, 1)], "the planted 60-word pair must pass the default five-word Jaccard threshold"
    assert lab.near_duplicate_pairs(documents, threshold=boundary) == [(0, 1)], "the planted 60-word pair must pass the inclusive Jaccard boundary"
    assert lab.near_duplicate_pairs(documents, threshold=np.nextafter(boundary, 1.0)) == [], "threshold above the exact Jaccard score must exclude the planted pair"


def test_near_duplicates_use_sets_not_counts(lab):
    """Jaccard uses sets of ordered shingles, not frequency counts or bags of words."""
    assert lab.near_duplicate_pairs(["a a a", "a a a a a"], n=2, threshold=1.0) == [(0, 1)], "repeated ngrams must not change set Jaccard"
    assert lab.near_duplicate_pairs(["a b", "b a"], n=2, threshold=0.1) == [], "ngrams must preserve word order, not just word membership"


def test_near_duplicates_default_is_five_word_ngrams(lab):
    """The default shingle width is five, but an explicit width is honored."""
    documents = ["a b c d e f", "a b c d x f"]
    assert lab.near_duplicate_pairs(documents, threshold=0.1) == [], "default n=5 has no shared grams; n=3 would incorrectly include this pair"
    assert lab.near_duplicate_pairs(documents, n=3, threshold=0.1) == [(0, 1)], "explicit n remains configurable"


def test_near_duplicates_short_docs_normalization_and_case(lab):
    """Short documents contribute one full tuple, including normalized empty text."""
    documents = ["café\tcat", " cafe\u0301 cat ", "Café cat", "café", "", "\n"]
    assert lab.near_duplicate_pairs(documents, n=3, threshold=1.0) == [(0, 1), (4, 5)], "short documents use the whole normalized tuple; differing short tuples are not duplicates"
    assert lab.near_duplicate_pairs([], n=3) == [], "an empty corpus has no pairs"
    assert lab.near_duplicate_pairs(["only one"], n=3) == [], "a document cannot duplicate itself"
    assert lab.near_duplicate_pairs(["a", "b"], n=3, threshold=0.0) == [(0, 1)], "zero-similarity pairs meet an inclusive zero threshold"


def test_contamination_13_12_word_boundary(lab):
    """Thirteen-word overlap counts; twelve-word and empty eval documents score zero."""
    thirteen = " ".join(f"w{i}" for i in range(13))
    twelve = " ".join(f"w{i}" for i in range(12))
    actual = lab.contamination_report([thirteen, twelve], [thirteen, twelve, ""])
    assert isinstance(actual, list) and all(isinstance(score, float) for score in actual), "contamination_report must return list[float], not an ndarray"
    np.testing.assert_array_equal(actual, [1.0, 0.0, 0.0], err_msg="13 words yield one 13-gram; 12 words yield none and must score zero")


def test_contamination_union_fraction_and_no_boundary_crossing(lab):
    """Pool training shingles without creating shingles across document boundaries."""
    evaluation = " ".join(f"w{i}" for i in range(15))
    first = " ".join(f"w{i}" for i in range(13))
    last = " ".join(f"w{i}" for i in range(2, 15))
    actual = lab.contamination_report([first, last], [evaluation])
    np.testing.assert_allclose(actual, [2 / 3], err_msg="contamination must count matches against the union of all training sets")
    np.testing.assert_array_equal(lab.contamination_report(["a b", "c d"], ["b c"], n=2), [0.0], err_msg="training document boundaries must not create synthetic ngrams")


def test_contamination_sets_normalization_and_case(lab):
    """Match normalized shingles against training sets while preserving case."""
    train = ["café a a"]
    evaluation = [" cafe\u0301\ta a a a ", "Café a", "a a a a"]
    np.testing.assert_array_equal(lab.contamination_report(train, evaluation, n=2), [1.0, 0.0, 1.0], err_msg="fractions use normalized word-ngram occurrences, without casefolding")
    np.testing.assert_array_equal(lab.contamination_report([], ["a b"], n=2), [0.0], err_msg="empty training union implies zero contamination")
    empty = lab.contamination_report(train, [], n=2)
    assert isinstance(empty, list) and empty == [], "empty eval corpus returns an empty list"


def test_contamination_counts_repeated_eval_ngram_occurrences(lab):
    """Each eval shingle occurrence contributes separately to the overlap fraction."""
    np.testing.assert_allclose(
        lab.contamination_report(["a"], ["a a a b c"], n=1),
        [3 / 5],
        err_msg="three occurrences of 'a' count as three matched occurrences out of five, not one distinct gram out of three",
    )
    np.testing.assert_allclose(
        lab.contamination_report(["a a"], ["a a a b a a"], n=2),
        [3 / 5],
        err_msg="repeated overlapping eval bigrams count separately against the training set",
    )
