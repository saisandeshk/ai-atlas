"""A cache must preserve logits, use grouped storage, and avoid prefix recomputation."""
from dataclasses import replace

import pytest
import torch
from torch.utils.flop_counter import FlopCounterMode

from adapters import LabConfig


@pytest.mark.parametrize("kv_heads", [4, 2, 1])
@pytest.mark.parametrize("prompt_length", [1, 7, 11])
def test_cached_greedy_generation_matches_full_prefix(lab, kv_heads, prompt_length):
    """Twelve cached steps match full-prefix logits/tokens, including batch size three."""
    config = replace(LabConfig(), n_kv_heads=kv_heads)
    model = lab.make_cached_model(config, 21)
    prefix = torch.randint(config.vocab_size, (3, prompt_length))
    with torch.no_grad():
        cached, cache = lab.cached_forward(model, prefix, None, 0)
        for step in range(12):
            full = lab.uncached_forward(model, prefix)
            torch.testing.assert_close(cached[:, -1], full[:, -1], atol=1e-5, rtol=0,
                                       msg=f"Cached logits differ at step {step}; use absolute RoPE positions and offset causal masks")
            next_cached, next_full = cached[:, -1].argmax(-1), full[:, -1].argmax(-1)
            assert torch.equal(next_cached, next_full), "Cached greedy tokens must exactly match uncached tokens"
            old_length = prefix.shape[1]
            prefix = torch.cat((prefix, next_full[:, None]), dim=1)
            cached, cache = lab.cached_forward(model, next_cached[:, None], cache, old_length)


@pytest.mark.parametrize("kv_heads", [4, 2, 1])
def test_chunked_prefill_preserves_absolute_positions_and_causality(lab, kv_heads):
    """Three then four prompt tokens equal a one-shot seven-token prefill."""
    config = replace(LabConfig(), n_kv_heads=kv_heads)
    model = lab.make_cached_model(config, 47)
    prompt = torch.randint(config.vocab_size, (3, 7))
    with torch.no_grad():
        whole, _ = lab.cached_forward(model, prompt, None, 0)
        first, cache = lab.cached_forward(model, prompt[:, :3], None, 0)
        second, cache = lab.cached_forward(model, prompt[:, 3:], cache, 3)
        torch.testing.assert_close(torch.cat((first, second), 1), whole, atol=1e-5, rtol=0,
                                   msg="Chunked prefill must rotate at absolute offsets and mask within the new chunk")
        torch.testing.assert_close(whole, lab.uncached_forward(model, prompt), atol=1e-5, rtol=0,
                                   msg="Cached and uncached paths must share weights")


@pytest.mark.parametrize("kv_heads", [4, 2, 1])
@pytest.mark.parametrize("batch,length", [(1, 1), (3, 7), (2, 16)])
def test_kv_byte_formula_matches_real_allocated_cache(lab, kv_heads, batch, length):
    """KV storage scales with KV heads, not query heads, and matches tensor allocation."""
    config = replace(LabConfig(), n_kv_heads=kv_heads)
    for element_bytes in (2, 4, 8):
        expected = 2 * config.n_layers * batch * length * kv_heads * (config.d_model // config.n_heads) * element_bytes
        assert lab.kv_cache_bytes(config, batch, length, element_bytes) == expected, "Count both K/V using n_kv_heads and head_dim"
    model = lab.make_cached_model(config, 51)
    with torch.no_grad():
        _, cache = lab.cached_forward(model, torch.randint(config.vocab_size, (batch, length)), None, 0)
    actual = lab.cache_nbytes(cache)
    exact = lab.kv_cache_bytes(config, batch, length, 4)
    # Full-context preallocation is the only alternative allowed by the contract.
    preallocated = lab.kv_cache_bytes(config, batch, config.context_length, 4)
    assert actual in (exact, preallocated), "Actual K/V allocation must equal used length or documented full-context preallocation"


@pytest.mark.parametrize("kv_heads", [4, 2, 1])
def test_decode_flops_grow_only_by_attention_to_extra_keys(lab, kv_heads):
    """Doubling prefix length adds only scores/weighted-value work for eight keys."""
    config = replace(LabConfig(), n_kv_heads=kv_heads)
    model = lab.make_cached_model(config, 72)
    tokens = torch.randint(config.vocab_size, (3, 17))
    measured = []
    with torch.no_grad():
        for prefix_length in (8, 16):
            _, cache = lab.cached_forward(model, tokens[:, :prefix_length], None, 0)
            with FlopCounterMode(display=False) as counter:
                lab.cached_forward(model, tokens[:, prefix_length:prefix_length+1], cache, prefix_length)
            measured.append(counter.get_total_flops())
    growth = measured[1] - measured[0]
    # Two matmuls per layer, each 2*B*Hq*1*extra_keys*head_dim FLOPs.
    attention_growth = 4 * config.n_layers * 3 * config.n_heads * 8 * (config.d_model // config.n_heads)
    # Zero growth is fine for a cache preallocated to context_length, whose
    # attention already spans the full buffer.
    assert 0 <= growth <= attention_growth * 1.05, (
        f"Decode FLOP growth {growth} exceeds attention-only budget {attention_growth}; "
        "do not recompute the prefix inside a cached decode step"
    )
