"""Local attention mathematics and whole-decoder invariants."""
import math
from dataclasses import replace
import pytest
import torch
from adapters import LabConfig


@pytest.mark.parametrize("kv_heads", [4, 2, 1])
@pytest.mark.parametrize("t,s", [(5, 5), (2, 7)])
@pytest.mark.parametrize("causal", [False, True])
def test_attention_matches_explicit_head_loop(lab, kv_heads, t, s, causal):
    """Head groups must be contiguous, scaled correctly, with cached causal offsets."""
    q = torch.randn(2, 4, t, 8, dtype=torch.float64)
    k = torch.randn(2, kv_heads, s, 8, dtype=torch.float64)
    v = torch.randn(2, kv_heads, s, 8, dtype=torch.float64)
    expected = torch.empty_like(q)
    for b in range(2):
        for h in range(4):
            kh = h // (4 // kv_heads)
            for pos in range(t):
                end = s - t + pos + 1 if causal else s
                weights = (q[b, h, pos] @ k[b, kh, :end].T / math.sqrt(8)).softmax(-1)
                expected[b, h, pos] = weights @ v[b, kh, :end]
    torch.testing.assert_close(lab.grouped_query_attention(q, k, v, causal), expected,
                               msg="Check contiguous KV groups, sqrt(d) scaling and S-T causal offset")


def test_rope_norm_relative_dot_and_absolute_slice(lab):
    """RoPE preserves norms, relative dot products, and absolute slice positions."""
    x = torch.randn(2, 3, 12, 8, dtype=torch.float64)
    positions = torch.arange(12)
    rotated = lab.apply_rope(x, positions, 10000.)
    torch.testing.assert_close(rotated.norm(dim=-1), x.norm(dim=-1), msg="RoPE must preserve vector norms")
    sliced = lab.apply_rope(x[..., 5:9, :], positions[5:9], 10000.)
    torch.testing.assert_close(sliced, rotated[..., 5:9, :], msg="RoPE must honor absolute positions, not restart at zero")
    q, k = torch.randn(1, 8, dtype=torch.float64), torch.randn(1, 8, dtype=torch.float64)
    def dot(m, n):
        return (lab.apply_rope(q, torch.tensor([m]), 10000.) *
                lab.apply_rope(k, torch.tensor([n]), 10000.)).sum()
    torch.testing.assert_close(dot(8, 3), dot(13, 8), msg="RoPE dot products should depend only on relative positions")
    angle = torch.tensor(3.) * 10000. ** (-torch.arange(0, 8, 2, dtype=torch.float64) / 8)
    expected = torch.stack((q[..., ::2]*angle.cos()-q[..., 1::2]*angle.sin(),
                            q[..., ::2]*angle.sin()+q[..., 1::2]*angle.cos()), -1).flatten(-2)
    torch.testing.assert_close(lab.apply_rope(q, torch.tensor([3]), 10000.), expected,
                               msg="Use adjacent CS336 rotation pairs, not split-half pairs")


@pytest.mark.parametrize("kv_heads", [4, 2, 1])
@pytest.mark.parametrize("tied", [False, True])
def test_model_parameter_count_shape_causality_batch_and_seed(lab, kv_heads, tied):
    """Decoder is causal, batch-independent, seeded, and has contracted weights."""
    c = replace(LabConfig(), n_kv_heads=kv_heads, tie_embeddings=tied)
    model = lab.make_model(c, 19)
    d, kv = c.d_model, c.n_kv_heads * (c.d_model // c.n_heads)
    expected = c.vocab_size * d  # token embedding
    expected += c.n_layers * (2*d + 2*d*d + 2*d*kv + 3*d*c.d_ff)  # two norms; Q/O; K/V; SwiGLU
    expected += d  # final RMSNorm
    expected += 0 if tied else c.vocab_size*d  # unique LM head
    assert sum(p.numel() for p in model.parameters()) == expected, "Check KV projections, norms and true weight tying"
    tokens = torch.randint(c.vocab_size, (3, 9))
    with torch.no_grad():
        original = lab.model_logits(model, tokens)
        assert original.shape == (3, 9, c.vocab_size), "Logits must have [batch,time,vocab] shape"
        assert original.dtype == torch.float32, "Shared decoder contract uses float32"
        changed = tokens.clone()
        changed[0, 4] = (changed[0, 4] + 1) % c.vocab_size
        intervention = lab.model_logits(model, changed)
        assert torch.equal(original[0, :4], intervention[0, :4]), "Future tokens must not affect earlier logits"
        assert not torch.equal(original[0, 4:], intervention[0, 4:]), "Token intervention must change current/later logits"
        assert torch.equal(original[1:], intervention[1:]), "Changing one batch row must not affect other rows"
        again = lab.model_logits(lab.make_model(c, 19), tokens)
        assert torch.equal(original, again), "Fixed model seed must reproduce exact CPU logits"
