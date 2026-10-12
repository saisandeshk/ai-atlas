"""Explicit attention and bias-free decoder; caches allocate exact length."""
import math
import torch
from torch import nn


def apply_rope(x, positions, theta):
    d = x.shape[-1]
    frequencies = theta ** (-torch.arange(0, d, 2, device=x.device, dtype=x.dtype) / d)
    angles = positions.to(x.dtype).unsqueeze(-1) * frequencies
    a, b = x[..., 0::2], x[..., 1::2]
    return torch.stack((a * angles.cos() - b * angles.sin(),
                        a * angles.sin() + b * angles.cos()), dim=-1).flatten(-2)


def grouped_query_attention(q, k, v, causal):
    repeats = q.shape[1] // k.shape[1]
    k, v = k.repeat_interleave(repeats, 1), v.repeat_interleave(repeats, 1)
    scores = q @ k.transpose(-1, -2) / math.sqrt(q.shape[-1])
    if causal:
        t, s = q.shape[-2], k.shape[-2]
        allowed = torch.arange(s, device=q.device)[None, :] <= (
            s - t + torch.arange(t, device=q.device)[:, None])
        scores = scores.masked_fill(~allowed, float("-inf"))
    return scores.softmax(dim=-1) @ v


class RMSNorm(nn.Module):
    def __init__(self, width):
        super().__init__()
        self.weight = nn.Parameter(torch.ones(width))

    def forward(self, x):
        return x * torch.rsqrt(x.square().mean(-1, keepdim=True) + 1e-5) * self.weight


class Block(nn.Module):
    def __init__(self, config):
        super().__init__()
        self.config = config
        d = config.d_model
        kv = config.n_kv_heads * (d // config.n_heads)
        self.attn_norm, self.ff_norm = RMSNorm(d), RMSNorm(d)
        self.q, self.k, self.v = (nn.Linear(d, size, bias=False) for size in (d, kv, kv))
        self.o = nn.Linear(d, d, bias=False)
        self.gate, self.up = (nn.Linear(d, config.d_ff, bias=False) for _ in range(2))
        self.down = nn.Linear(config.d_ff, d, bias=False)

    def forward(self, x, positions, past=None):
        c = self.config
        b, t, _ = x.shape
        h = c.d_model // c.n_heads
        norm = self.attn_norm(x)
        q = self.q(norm).view(b, t, c.n_heads, h).transpose(1, 2)
        k = self.k(norm).view(b, t, c.n_kv_heads, h).transpose(1, 2)
        v = self.v(norm).view(b, t, c.n_kv_heads, h).transpose(1, 2)
        q, k = apply_rope(q, positions, c.rope_theta), apply_rope(k, positions, c.rope_theta)
        if past is not None:
            k, v = torch.cat((past[0], k), -2), torch.cat((past[1], v), -2)
        attended = grouped_query_attention(q, k, v, causal=True)
        x = x + self.o(attended.transpose(1, 2).reshape(b, t, c.d_model))
        norm = self.ff_norm(x)
        x = x + self.down(torch.nn.functional.silu(self.gate(norm)) * self.up(norm))
        return x, (k, v)


class Decoder(nn.Module):
    def __init__(self, config):
        super().__init__()
        self.config = config
        self.embedding = nn.Embedding(config.vocab_size, config.d_model)
        self.blocks = nn.ModuleList(Block(config) for _ in range(config.n_layers))
        self.norm = RMSNorm(config.d_model)
        self.head = nn.Linear(config.d_model, config.vocab_size, bias=False)
        if config.tie_embeddings:
            self.head.weight = self.embedding.weight

    def forward(self, tokens, cache=None, start_pos=0, *, rope_start=None):
        if start_pos + tokens.shape[1] > self.config.context_length:
            raise ValueError("prefix exceeds context_length")
        if cache is not None and cache[0][0].shape[-2] != start_pos:
            raise ValueError("start_pos must equal cache length")
        position_start = start_pos if rope_start is None else rope_start
        positions = torch.arange(position_start, position_start + tokens.shape[1], device=tokens.device)
        x = self.embedding(tokens)
        updated = []
        for i, block in enumerate(self.blocks):
            x, kv = block(x, positions, None if cache is None else cache[i])
            updated.append(kv)
        return self.head(self.norm(x)), updated


def make_model(config, seed):
    torch.manual_seed(seed)
    return Decoder(config)


def model_logits(model, tokens):
    return model(tokens)[0]


def make_cached_model(config, seed):
    return make_model(config, seed)


def cached_forward(model, tokens, cache, start_pos):
    return model(tokens, cache, start_pos)


def uncached_forward(model, tokens):
    return model_logits(model, tokens)


def kv_cache_bytes(config, batch, seq_len, bytes_per_element):
    return 2 * config.n_layers * batch * seq_len * config.n_kv_heads * (
        config.d_model // config.n_heads) * bytes_per_element


def cache_nbytes(cache):
    return sum(t.untyped_storage().nbytes() for layer in cache for t in layer)
