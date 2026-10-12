"""Public reference adapter surface assembled from teaching modules."""
from adapters import LabConfig
from .data import (
    pack_documents, document_attention_mask, exact_duplicates,
    near_duplicate_pairs, contamination_report,
)
from .model import (
    apply_rope, grouped_query_attention, make_model, model_logits,
    make_cached_model, cached_forward, uncached_forward, kv_cache_bytes, cache_nbytes,
)
from .training import filter_probs, run_training
from .arithmetic import (
    count_parameters, forward_matmul_flops, adamw_training_bytes,
    bootstrap_ci, paired_bootstrap_diff,
)
