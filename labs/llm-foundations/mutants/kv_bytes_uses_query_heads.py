"""Compute KV cache storage using query heads instead of grouped KV heads."""
from reference import *


def kv_cache_bytes(config, batch, seq_len, bytes_per_element):
    return 2 * config.n_layers * batch * seq_len * config.n_heads * (config.d_model // config.n_heads) * bytes_per_element
