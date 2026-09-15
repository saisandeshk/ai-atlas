<!-- Generated from content/curriculum.json. Edit the JSON and run npm run content:generate. -->

# 07. LLM Foundations

**Level:** Core  
**Scope:** 5 sections · 101 required topics · 21 optional, depth, or later topics

Build the tokenizer-to-cached-generation path, test every causal and state boundary, and connect model quality claims to evaluation and arithmetic.

## Order

01. Tokenization, Corpus Identity & Packed Data
02. Decoder Transformer Mechanics
03. Causal Training, Checkpointing & Generation
04. Evaluation, Claims & Model Arithmetic
05. KV Cache, Prefill & Decode

## 01. Tokenization, Corpus Identity & Packed Data

**Why:** The model sees token identities and loss masks rather than raw text. This section makes every transformation from bytes to training examples deterministic, reversible where promised and auditable across splits.

### Learn this much

- [ ] Unicode code points, byte encodings and invalid-byte policy _(Required)_
- [ ] Normalization choices and distinctions they erase _(Required)_
- [ ] Character, byte and token counts _(Required)_
- [ ] Byte-level tokenization and complete input coverage _(Required)_
- [ ] BPE pair counts, merges and deterministic tie breaking _(Required)_
- [ ] Unigram tokenizer intuition and contrast with BPE _(Required)_
- [ ] Vocabulary size, token fertility and sequence-length trade-offs _(Required)_
- [ ] Special-token IDs, boundaries and injection policy _(Required)_
- [ ] Encode, decode, round-trip and serialized tokenizer identity _(Required)_
- [ ] Streaming inputs and chunk-boundary invariance _(Required)_
- [ ] Documents, boundary tokens, truncation and packing _(Required)_
- [ ] Causal loss masks across packed document boundaries _(Required)_
- [ ] Source and document identities, lineage and provenance _(Required)_
- [ ] Split-before-fit and split-before-pack discipline _(Required)_
- [ ] Exact deduplication and near-duplicate strategy _(Required)_
- [ ] Contamination probes and false-match review _(Required)_
- [ ] Filtering reasons, yield and representative slices _(Required)_
- [ ] Mixture weights, sampling units and token exposure _(Required)_
- [ ] Deterministic sharding, manifests and restart behavior _(Required)_
- [ ] Tokenizer comparisons across language and code slices _(Optional)_
- [ ] Small PII, toxicity and quality-filter policy exercise _(Optional)_
- [ ] Internet-scale crawling and distributed corpus processing _(Later)_
- [ ] Full Unigram tokenizer training and production data governance _(Later)_

### Resource route

- **Primary - Implementation:** [LLMs from Scratch companion - tokenization and data loading](https://github.com/rasbt/LLMs-from-scratch/tree/main/ch02) - Work through the ch02 main notebook, 05_bpe-from-scratch and 04_bonus_dataloader-intuition. Rebuild byte-level BPE, serialization and packed windows in blank files, then add multilingual, control, whitespace and chunk-boundary properties.
- **Required - Assessment:** [Stanford CS336 Assignment 1 - tokenizer contract](https://github.com/stanford-cs336/assignment1-basics) - Read the Assignment 1 tokenizer handout and use the named unicode1, unicode2, train_bpe, tokenizer and tokenizer_experiments specifications plus public tests as an acceptance contract. Implement independently in your own repository and do not copy or modify course solutions.
- **Support - Implementation:** [Modern LLM Notebook - tokenization and data experiments](https://walkinglabs.github.io/modern-llm-notebook/?lang=en) - Run English notebooks 01-tokenizer-basics and 02-bpe-tokenizer. Use only the quality, deduplication and mixture examples from 15-data-engineering. Change the corpus and tie cases, then verify every quantitative claim independently.
- **Support - Project:** [Tokenizer and Corpus Pipeline - reduced foundation slice](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/tokenizer-corpus-pipeline.md) - Use the byte, identity, split, deduplication, contamination, packing, manifest and restart correctness requirements. Keep the corpus small and stop before distributed processing or internet-scale filtering.
- **Optional - Reference:** [Hugging Face LLM Course - tokenizer translation](https://huggingface.co/learn/llm-course/chapter6/1) - After the blank-file tokenizer passes, use the tokenizer chapters to map vocabulary, special tokens, fast tokenizers and batching into library APIs. Do not replace the deterministic implementation gate with a pretrained tokenizer call.

### Exit checkpoint

Implement and serialize deterministic byte-level BPE, pass adversarial round-trip, merge-tie, special-token and chunk-boundary tests, then publish a small packed split with provenance and an automated contamination check.

<details>
<summary>Deliberately left for later</summary>

- Internet-scale collection, distributed sharding and data lakes
- Production PII, toxicity and quality classifiers
- Full Unigram training and exhaustive tokenizer comparison

</details>

## 02. Decoder Transformer Mechanics

**Why:** The transformer should be a set of owned tensor operations rather than a diagram or framework class. This section connects shapes, causal information flow, modern block choices and parameter arithmetic.

### Learn this much

- [ ] Token embeddings, vocabulary axis and lookup semantics _(Required)_
- [ ] Absolute, sinusoidal and relative position vocabulary _(Required)_
- [ ] Query, key and value projections with explicit shapes _(Required)_
- [ ] Scaled dot-product attention and the scaling term _(Required)_
- [ ] Stable softmax and causal mask construction _(Required)_
- [ ] Padding masks versus causal masks _(Required)_
- [ ] Head split, transpose, merge and tensor layout _(Required)_
- [ ] Multi-head attention forward and backward behavior _(Required)_
- [ ] Multi-query and grouped-query attention shapes _(Required)_
- [ ] MHA, MQA and GQA parameter and KV trade-offs _(Required)_
- [ ] Rotary Position Embedding as paired rotations _(Required)_
- [ ] RoPE offsets and relative-position identity _(Required)_
- [ ] Residual stream and pre-norm decoder blocks _(Required)_
- [ ] LayerNorm versus RMSNorm _(Required)_
- [ ] GELU, gated feed-forward blocks and SwiGLU _(Required)_
- [ ] Embedding-output weight tying and final logits _(Required)_
- [ ] Initialization and residual-scale vocabulary _(Required)_
- [ ] Decoder composition and configuration ownership _(Required)_
- [ ] Parameter counts and dominant operation terms _(Required)_
- [ ] Slow attention oracle and causal intervention tests _(Required)_
- [ ] Encoder-only BERT contrast _(Optional)_
- [ ] One small MHA versus GQA memory comparison _(Optional)_
- [ ] MLA, MoE and architecture-specific model surveys _(Later)_
- [ ] FlashAttention kernels, sparse attention and long-context methods _(Later)_

### Resource route

- **Primary - Course:** [Modern LLM Notebook - decoder construction path](https://walkinglabs.github.io/modern-llm-notebook/?lang=en) - Work through English notebooks 03-embedding, 04-position-encoding, 05-transformer-block, 06-mini-gpt and the selected normalization, RoPE, GQA and SwiGLU comparisons in 08-gpt2-to-modern-models. Re-derive shapes and rerun with changed dimensions.
- **Required - Implementation:** [LLMs from Scratch companion - attention and GPT construction](https://github.com/rasbt/LLMs-from-scratch) - Use the ch03 attention notebooks and ch04 model code. Rebuild the model without a high-level Transformer module and compare one forward and backward path with an independent small reference.
- **Required - Assessment:** [Stanford CS336 Assignment 1 - model contract](https://github.com/stanford-cs336/assignment1-basics) - Use the named linear, embedding, rmsnorm, positionwise_feedforward, rope, softmax, scaled_dot_product_attention, multihead_self_attention, transformer_block, transformer_lm and transformer_accounting specifications and public tests. Keep implementation independent and respect the course AI and honor-code boundary.
- **Support - Reference:** [PyTorch scaled dot product attention reference](https://docs.pytorch.org/docs/stable/generated/torch.nn.functional.scaled_dot_product_attention.html) - Use the functional contract only after the explicit attention oracle passes. Transfer identical weights and masks, compare outputs and gradients, and explain dtype, causal and dropout behavior from the documented semantics.
- **Optional - Practice:** [Deep-ML candidate - three transformer closing drills](https://www.deep-ml.com/problems) - After the platform quality sample passes, attempt at most problems 490, 53 and 904 as changed-prompt drills for attention shapes and multi-head composition. Preserve independent tests; a judge result does not replace the section checkpoint.

### Exit checkpoint

Build a tiny decoder from blank tensor operations, derive every intermediate shape and parameter count, and pass causal intervention, mask, RoPE-offset, grouped-head, residual, normalization, tying and differential forward or backward tests.

<details>
<summary>Deliberately left for later</summary>

- MoE, MLA and broad modern-architecture catalogs
- FlashAttention and custom GPU kernels
- Long-context extension and production transformer libraries

</details>

## 03. Causal Training, Checkpointing & Generation

**Why:** A correct forward pass is only the beginning. This section fixes target alignment, valid-token weighting, full training state and sampling semantics so that a tiny model can train, resume and generate reproducibly.

### Learn this much

- [ ] Autoregressive factorization and next-token likelihood _(Required)_
- [ ] Input-target shift and off-by-one failure modes _(Required)_
- [ ] Packed document, padding and valid-token loss masks _(Required)_
- [ ] Token-weighted cross-entropy and perplexity _(Required)_
- [ ] Sequence batching, shuffling and data-loader state _(Required)_
- [ ] Initialization and stable first-step controls _(Required)_
- [ ] AdamW moments and decoupled weight decay _(Required)_
- [ ] Warmup, cosine decay and schedule state _(Required)_
- [ ] Gradient accumulation and global token batch _(Required)_
- [ ] Gradient clipping and numerical-event logging _(Required)_
- [ ] Mixed-precision vocabulary, scaling and overflow signals _(Required)_
- [ ] Model, optimizer, scheduler, scaler and RNG checkpoint state _(Required)_
- [ ] Tokenizer, data and configuration identity binding _(Required)_
- [ ] Interrupted versus uninterrupted resume equivalence _(Required)_
- [ ] Logits, greedy decoding and deterministic argmax _(Required)_
- [ ] Temperature and distribution renormalization _(Required)_
- [ ] Top-k and nucleus top-p truncation _(Required)_
- [ ] Beam-search objective and cost vocabulary _(Required)_
- [ ] EOS, stop sequences, maximum length and finished batches _(Required)_
- [ ] Sampling RNG, reproducibility and output validation _(Required)_
- [ ] Tiny-set overfit and shuffled-label controls _(Required)_
- [ ] Prompt and chat-template comparison _(Optional)_
- [ ] Repetition and length penalties _(Optional)_
- [ ] Supervised fine-tuning, LoRA and preference optimization _(Later)_
- [ ] Distributed training and large-scale pretraining _(Later)_

### Resource route

- **Primary - Implementation:** [LLMs from Scratch companion - training and generation](https://github.com/rasbt/LLMs-from-scratch/tree/main/ch05) - Use the ch05 training and generation code for the small pretraining loop. Add full checkpoint state, explicit loss masks and resume-equivalence tests that the base example does not supply.
- **Required - Assessment:** [Stanford CS336 Assignment 1 - training and decoding contract](https://github.com/stanford-cs336/assignment1-basics) - Use cross_entropy, adamw, adamw_accounting, learning_rate_schedule, gradient_clipping, data_loading, checkpointing, training_together and decoding specifications plus public tests. Debug on CPU and implement independently in your own repository.
- **Support - Implementation:** [Modern LLM Notebook - configuration, loss and generation](https://walkinglabs.github.io/modern-llm-notebook/?lang=en) - Use English notebooks 09-model-config, 10-training-loss and 20-generation to visualize configuration ownership, shifted loss and decoding policies. Change edge cases and cross-check probability calculations against your own implementation.
- **Support - Reference:** [PyTorch saving, loading and reproducibility references](https://docs.pytorch.org/tutorials/beginner/saving_loading_models.html) - Use the state-dict and reproducibility notes to enumerate all state needed for the supported resume guarantee. Test model, optimizer, schedule, scaler, data order and RNG state across an interruption.
- **Optional - Application:** [Hugging Face LLM Course - library translation](https://huggingface.co/learn/llm-course/chapter1/1) - Only after the blank-file loop passes, map tokenization, model configuration, data collation, generation configuration and stopping behavior into Transformers APIs. Keep the from-scratch tests as the authority.

### Exit checkpoint

Overfit one tiny batch, prove target and mask alignment, train and resume a compact decoder with a stated equivalence level, then reproduce fixed-seed greedy, temperature, top-k and top-p outputs while explaining each distributional change.

<details>
<summary>Deliberately left for later</summary>

- Large-scale pretraining and distributed checkpointing
- SFT, LoRA, DPO, RLHF and RLVR
- Production decoding servers and fleet scheduling

</details>

## 04. Evaluation, Claims & Model Arithmetic

**Why:** A score is useful only when the task, parser, sampling policy, uncertainty and contamination boundary are defensible. Cost estimates must likewise state shapes, units and omitted overhead before they guide a design.

### Learn this much

- [ ] Conditional likelihood and token-weighted perplexity _(Required)_
- [ ] Tokenizer dependence and limits of perplexity comparison _(Required)_
- [ ] Task contract, prompt version and output schema _(Required)_
- [ ] Exact match, normalized match and structured verifiers _(Required)_
- [ ] Generation metrics and their counterexamples _(Required)_
- [ ] Human review and adjudication subsets _(Required)_
- [ ] Model-based judge position, length, style and identity bias _(Required)_
- [ ] Raw-output retention and evaluator versioning _(Required)_
- [ ] Slices, paired comparisons and bootstrap uncertainty _(Required)_
- [ ] Prompt sensitivity, robustness and sampling-compute budgets _(Required)_
- [ ] Exact and approximate contamination checks _(Required)_
- [ ] Memorization, duplicates and unsupported capability claims _(Required)_
- [ ] Capability versus safety evaluation boundaries _(Required)_
- [ ] Embedding, attention, feed-forward and output parameter counts _(Required)_
- [ ] Forward, backward and training FLOP approximations _(Required)_
- [ ] Gradient, optimizer, activation and temporary memory _(Required)_
- [ ] Sequence length, vocabulary and batch scaling terms _(Required)_
- [ ] Arithmetic intensity vocabulary and hardware-independent limits _(Required)_
- [ ] Allocator, graph, kernel and framework overhead reconciliation _(Required)_
- [ ] Quality-compute comparisons and uncertainty ranges _(Required)_
- [ ] Small evaluator-disagreement study _(Optional)_
- [ ] Bounded IsoFLOPs curve-fitting exercise _(Optional)_
- [ ] Benchmark leadership and large-scale contamination research _(Later)_
- [ ] Safety red teaming and post-training evaluation suites _(Later)_

### Resource route

- **Primary - Course:** [Stanford CS336 - resource accounting, inference and evaluation](https://cs336.stanford.edu/) - Use Spring 2026 Lectures 2, 10 and 12 for FLOPs, memory, arithmetic intensity, inference and evaluation. Reproduce the small calculations locally. Assignment 3 IsoFLOPs analysis is optional; do not require its hosted training API or costly experiments.
- **Required - Implementation:** [LLMs from Scratch companion - GPT FLOP analysis](https://github.com/rasbt/LLMs-from-scratch/blob/main/ch04/02_performance-analysis/flops-analysis.ipynb) - Use ch04/02_performance-analysis/flops-analysis.ipynb as a concrete calculator, then rebuild the formulas from the model configuration and reconcile parameters and at least one memory or operation estimate with runtime state.
- **Required - Implementation:** [Modern LLM Notebook - evaluation and FLOP accounting](https://walkinglabs.github.io/modern-llm-notebook/?lang=en) - Use English notebook 25-evaluation and Appendix B FLOP and memory accounting. Build a 20-example evaluator with two slices, raw outputs and bootstrap intervals, and deliberately create one parser, prompt or judge failure.
- **Support - Assessment:** [LLM Foundations Checkpoint - evaluation and arithmetic slice](https://github.com/saisandeshk/Roadmap-Final/blob/main/checkpoints/llm-foundations.md) - Use the contamination, evaluator-bias, parameter, FLOP, activation, state and KV requirements as the assessment contract. Keep raw outputs and distinguish a verified task result from a broad model capability claim.
- **Optional - Reference:** [Language Model Evaluation Harness](https://github.com/EleutherAI/lm-evaluation-harness) - After the small evaluator passes, inspect task versioning, request construction and result schemas to understand production evaluation plumbing. Do not use the harness as a substitute for owning the task and metric contract.

### Exit checkpoint

Produce a versioned evaluation with likelihood, one exact or structured metric, two slices, raw outputs, bootstrap uncertainty and contamination checks. Expose one evaluator failure and reconcile parameter, FLOP, activation and optimizer-memory estimates with the tiny model.

<details>
<summary>Deliberately left for later</summary>

- Leaderboard claims and broad capability conclusions
- Large scaling-law sweeps and hosted-compute experiments
- Full safety, alignment and model-judge research

</details>

## 05. KV Cache, Prefill & Decode

**Why:** Autoregressive generation has two distinct execution regimes and a stateful cache. This final section proves cache correctness first, then explains capacity and latency without importing an entire serving stack.

### Learn this much

- [ ] Autoregressive dependency and naive prefix recomputation _(Required)_
- [ ] Cached keys and values versus token-specific queries _(Required)_
- [ ] Per-layer KV ownership and sequence identity _(Required)_
- [ ] KV tensor shapes, layout, capacity and append state _(Required)_
- [ ] Position offsets and RoPE consistency under cached decode _(Required)_
- [ ] MHA, MQA and GQA KV head mapping _(Required)_
- [ ] KV bytes per token, sequence, layer and batch _(Required)_
- [ ] Full-prefix versus cached-logit equivalence _(Required)_
- [ ] Variable-length batches and padding state _(Required)_
- [ ] Finished-sequence compaction and EOS handling _(Required)_
- [ ] Cancellation cleanup, truncation, forks and stale-cache hazards _(Required)_
- [ ] Prefill parallelism and prompt-length scaling _(Required)_
- [ ] Decode serialization and per-token work _(Required)_
- [ ] Compute, memory-bandwidth, launch and capacity limits _(Required)_
- [ ] Time to first token and prefill latency _(Required)_
- [ ] Inter-token latency and decode throughput _(Required)_
- [ ] Batch, context and generated-length regime changes _(Required)_
- [ ] Warmup, synchronization and phase-specific timing _(Required)_
- [ ] Cache dtype and quantized-cache vocabulary _(Required)_
- [ ] Prefix sharing and paged-cache vocabulary _(Required)_
- [ ] Speculative decoding promise and exactness contract _(Required)_
- [ ] One small prefix-sharing state diagram _(Optional)_
- [ ] Cache-capacity sensitivity across dtypes _(Optional)_
- [ ] Paged attention and continuous batching implementation _(Later)_
- [ ] Quantized KV kernels and speculative decoding implementation _(Later)_
- [ ] Production scheduling, disaggregation and serving fleets _(Later)_

### Resource route

- **Primary - Implementation:** [LLMs from Scratch companion - KV cache and GQA](https://github.com/rasbt/LLMs-from-scratch/tree/main/ch04) - Use ch04/03_kv-cache and ch04/04_gqa with the chapter model code. Add explicit per-layer ownership, position offsets, variable lengths, EOS compaction and MHA-versus-GQA cache arithmetic to the runnable comparison.
- **Required - Implementation:** [Modern LLM Notebook - KV cache and inference acceleration](https://walkinglabs.github.io/modern-llm-notebook/?lang=en) - Use the KV-cache portions of English notebooks 11-mla-kv-cache and 21-inference-acceleration. Skip MLA and advanced acceleration as core work. Recalculate cache sizes and verify timing after warmup and explicit synchronization.
- **Required - Theory:** [Stanford CS336 - Lecture 10 Inference](https://cs336.stanford.edu/) - Use the Spring 2026 inference lecture to connect KV arithmetic, phase behavior and batching vocabulary. Keep kernels, distributed serving and expensive performance experiments for the later tracks.
- **Depth - Theory:** [How to Scale Your Model - inference chapter](https://jax-ml.github.io/scaling-book/inference/) - After cache equivalence and phase measurement pass, read the inference chapter for arithmetic intensity, parallelism and production-scale reasoning. Treat it as the handoff to inference and performance tracks, not required foundation work.
- **Depth - Reference:** [AI Performance Engineering - inference-engine bridge](https://github.com/wafer-ai/gpu-perf-engineering-resources) - Use Sections 4 and 5 only after this gate to choose the next inference, KV-cache, scheduling, quantization or distributed-serving resource. Do not treat its GPU and kernel material as unfinished LLM Foundations work.
- **Optional - Practice:** [No Magic - micro KV or paged-cache simulation](https://github.com/no-magic-ai/no-magic) - Use one small CPU simulation such as microkv.py or micropaged.py only to visualize state ownership. Do not present Python timing as GPU or serving-performance evidence.

### Exit checkpoint

Prove full-prefix and cached logits or tokens agree across adversarial MHA and GQA shapes, offsets and variable lengths. Derive KV capacity and measure prefill and decode separately across at least two context and batch regimes with trustworthy timing.

<details>
<summary>Deliberately left for later</summary>

- FlashAttention, Triton and custom GPU kernels
- Paged attention, continuous batching and production schedulers
- Tensor parallelism, disaggregation and serving-fleet design

</details>

## Stage milestone

### Tokenizer-to-Cached-Generation Evidence Pack

Keep one small corpus, tokenizer identity, model configuration and evaluation manifest across three artifacts. The result proves the whole causal-language-model mechanism while leaving large-scale training and serving to their dedicated tracks.

- Tokenizer and corpus audit pack - deterministic byte-safe BPE, serialized identity, adversarial properties, split-before-pack pipeline, provenance manifest, deduplication report, contamination probe and reproducible restart
- Tiny decoder stack - blank-file embeddings, RoPE, RMSNorm, MHA plus GQA or MQA, SwiGLU, causal loss, AdamW, complete checkpoint state, four decoding policies and differential, causality, mask and resume tests
- Evaluation, arithmetic and cached-generation dossier - versioned task and parser, raw outputs, slices and uncertainty, evaluator failure case, parameter, FLOP and memory worksheet, full-prefix cache equivalence and separate prefill and decode measurements

