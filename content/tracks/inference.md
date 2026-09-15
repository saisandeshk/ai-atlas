<!-- Generated from content/curriculum.json. Edit the JSON and run npm run content:generate. -->

# 05. LLM Inference & Serving

**Level:** Advanced specialization  
**Scope:** 9 track stages · 251 required topics · 45 optional, depth, or later topics

Build LLM serving systems from request arithmetic and phase measurement through KV memory, scheduling, kernels, compression, distributed serving and production operation. Every optimization is bounded by a fixed workload, correctness and quality contract, and the final gate requires a tested real-engine contribution with an honest negative result.

## Order

INF-1. Model, Workload and Request Arithmetic
INF-2. Prefill, Decode and Baseline Measurement
INF-3. KV Memory and Prefix Reuse
INF-4. Batching, Scheduling and Admission
INF-5. Inference Kernels and Graph Execution
INF-6. Quantization and Speculative Decoding
INF-7. Distributed and Disaggregated Inference
INF-8. Production Serving and Reliability
INF-9. Capacity, Economics and Engine Extension

## INF-1. Model, Workload and Request Arithmetic

**Why:** Serving decisions start with the model, request distribution and user contract. Exact units and request-state ownership prevent attractive optimizations from solving the wrong bottleneck.

### Learn this much

- [ ] Model, tokenizer, chat template and revision identity _(Required)_
- [ ] Dense, MoE and attention architecture fields that affect serving _(Required)_
- [ ] Parameter count and weight memory by dtype _(Required)_
- [ ] Runtime, workspace, graph and allocator memory categories _(Required)_
- [ ] MHA, GQA, MQA and MLA KV bytes per token _(Required)_
- [ ] Logical versus allocated KV capacity _(Required)_
- [ ] Approximate transformer prefill operations _(Required)_
- [ ] Approximate autoregressive decode operations per token _(Required)_
- [ ] Input and output length distributions _(Required)_
- [ ] Prompt reuse and cache-locality distributions _(Required)_
- [ ] Arrival rate, concurrency and burst shape _(Required)_
- [ ] Open-loop versus closed-loop load _(Required)_
- [ ] Streaming, sampling, stop and timeout contracts _(Required)_
- [ ] TTFT, TPOT, inter-token latency and end-to-end latency _(Required)_
- [ ] Throughput, goodput, rejection and quality acceptance _(Required)_
- [ ] p50, p95 and p99 latency interpretation _(Required)_
- [ ] API, tokenizer, queue, admission and scheduler lifecycle _(Required)_
- [ ] Block manager, model runner, sampler and detokenizer lifecycle _(Required)_
- [ ] Streaming, cancellation, failure and cleanup states _(Required)_
- [ ] Request and resource ownership invariants _(Required)_
- [ ] Offered token rate and completed token rate _(Required)_
- [ ] First-order concurrency, service-time and capacity estimates _(Required)_
- [ ] Immutable workload and environment manifest _(Required)_
- [ ] Deterministic request corpus and replay _(Required)_
- [ ] Validated open-loop and closed-loop load generator _(Required)_
- [ ] Per-request raw event and output retention _(Required)_
- [ ] Multimodal encoder and media-token budgeting _(Optional)_
- [ ] Hybrid attention and state-space cache vocabulary _(Optional)_
- [ ] Energy per accepted token as an additional outcome _(Optional)_
- [ ] Inference-time compute and multi-sample request budgeting _(Depth)_
- [ ] Provider-wide demand forecasting and procurement _(Later)_

### Resource route

- **Primary - Theory:** [How to Scale Your Model - Inference](https://jax-ml.github.io/scaling-book/inference/) - Read the complete inference chapter for model, KV, batching, parallelism and capacity arithmetic. Reproduce every equation for one fixed model and workload, then use the public serving companion and book overview to connect the quantities to the request lifecycle.
- **Required - Implementation:** [Hands-On LLM Serving and Optimization companion - serving foundations](https://github.com/orca3/llm-model-inference/tree/main/ch02) - Use the Chapter 2 notebooks to trace transformer execution, prefill, decode, KV-cache state and core serving metrics. Build one request-lifecycle diagram and one arithmetic worksheet for the exact model you will use.
- **Required - Theory:** [Transformer Inference Arithmetic](https://kipp.ly/transformer-inference-arithmetic/) - Re-derive weight bytes, KV bytes per token, prefill work, decode work and arithmetic intensity with explicit units. Replace every example constant with your model configuration and compare the estimates with the book.
- **Required - Reference:** [Machine Learning Engineering Open Book - Inference](https://github.com/stas00/ml-engineering/tree/master/inference) - Use inference/README.md for the prefill/decode distinction, memory formulas, MHA/GQA/MQA/MLA comparison and current glossary. Treat unfinished sections as a reference boundary, not as the main course.
- **Support - Course:** [Stanford CS336 - Inference Lecture](https://www.youtube.com/watch?v=fcgPYo3OtV0) - Watch the inference lecture once after the arithmetic reading. Pause to reproduce its model-memory and phase-bottleneck calculations; advanced serving mechanisms are routed to their later stages.
- **Support - Practice:** [100 Days of LLM Inference - Days 1, 2, 5 and 6](https://github.com/elizabetht/100-days-of-inference) - Run only the four named notebooks for request anatomy, model configuration, KV sizing and roofline orientation. Verify every formula independently because this public learning journal is a useful practice supplement, not the authority.
- **Support - Reference:** [AI Performance Engineering - Minimum Mental Model](https://github.com/wafer-ai/gpu-perf-engineering-resources) - Use Start here: the minimum mental model to locate the CUDA guide, PMPP, roofline, Transformer Inference Arithmetic and Efficiently Scaling Transformer Inference. Open a linked source only when the current derivation has a specific gap.
- **Support - Project:** [LLM Inference Systems Laboratory - Workload and Baseline](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/capstones/llm-inference-systems-laboratory.md) - Start the immutable workload manifest, deterministic fake server, request-state trace and arithmetic planner. Keep this same repository through INF-9 so later comparisons preserve the contract.

### Exit checkpoint

Trace successful, cancelled, timed-out and failed requests end to end, reconcile model and KV arithmetic with an observed baseline, and prove that the load generator preserves offered load and output semantics.

<details>
<summary>Deliberately left for later</summary>

- Kernel optimization before phase and workload baselines exist
- Fleet procurement and global demand forecasting
- Unsupported performance claims from analytical hardware estimates

</details>

## INF-2. Prefill, Decode and Baseline Measurement

**Why:** Prefill, decode, queueing and host work fail for different reasons. Phase-separated traces and correct asynchronous timing are required before any optimization claim is credible.

### Learn this much

- [ ] Prompt tokenization and request preprocessing _(Required)_
- [ ] Prefill attention and sequence parallelism _(Required)_
- [ ] Autoregressive decode dependency _(Required)_
- [ ] Decode matrix-vector-like shapes _(Required)_
- [ ] Compute-bound, bandwidth-bound and launch-bound regimes _(Required)_
- [ ] Capacity-bound and queue-bound regimes _(Required)_
- [ ] Arithmetic intensity and roofline position _(Required)_
- [ ] Batch size and sequence-shape effects _(Required)_
- [ ] Chunked prefill vocabulary and phase interference _(Required)_
- [ ] Queue, tokenize, schedule and host timing _(Required)_
- [ ] Model, sample, detokenize and stream timing _(Required)_
- [ ] Device synchronization and CUDA event semantics _(Required)_
- [ ] Warmup, compilation and graph-capture state _(Required)_
- [ ] Cold versus warm model and cache state _(Required)_
- [ ] Identical prompt, output-limit and stop contracts _(Required)_
- [ ] Greedy, seeded sampling and distributional comparison _(Required)_
- [ ] Single-request latency baseline _(Required)_
- [ ] Concurrency and request-rate sweeps _(Required)_
- [ ] Length and batch shape matrix _(Required)_
- [ ] Raw request timestamps and decode-gap records _(Required)_
- [ ] GPU memory, utilization and power context _(Required)_
- [ ] Repeated trials, variance and uncertainty _(Required)_
- [ ] Profiler ranges across the request lifecycle _(Required)_
- [ ] Queueing versus execution stall diagnosis _(Required)_
- [ ] Prediction before profile and residual explanation _(Required)_
- [ ] Measurement overhead and observer effects _(Required)_
- [ ] Goodput under explicit TTFT and TPOT targets _(Required)_
- [ ] Batch-invariant kernels and deterministic inference vocabulary _(Optional)_
- [ ] Tokenizer and detokenizer CPU flame graphs _(Optional)_
- [ ] Energy-normalized serving comparisons _(Optional)_
- [ ] Hardware-counter roofline residual analysis _(Depth)_
- [ ] Cross-provider benchmark publication _(Later)_

### Resource route

- **Primary - Paper:** [Efficiently Scaling Transformer Inference](https://proceedings.mlsys.org/paper_files/paper/2023/file/c4be71ab8d24cdfb45e3d06dbfca2780-Paper-mlsys2023.pdf) - Read the prefill and decode cost, memory, batching and parallelism sections. Use its models to predict phase bottlenecks before measurement and record which assumptions fail on the selected model, engine and GPU.
- **Required - Implementation:** [AI Systems Performance Engineering companion - inference profiling](https://github.com/cfregly/ai-performance-engineering/tree/main/code/ch16) - Use the Chapter 16 profiling and tuning labs with the request lifecycle in view. Track phase metrics, tail latency, cache and queue telemetry, and iterative bottleneck shifts; reserve quantization experiments for INF-6.
- **Required - Lab:** [AI Systems Performance Engineering - Chapter 16 Code](https://github.com/cfregly/ai-performance-engineering/tree/main/code/ch16) - Begin with inference_profiling.py, inference_server_load_test.py, monitoring_bundle.py and runtime scheduler instrumentation. Run only hardware-compatible targets, retain raw artifacts and re-measure all bundled expectations on your own device.
- **Required - Implementation:** [Hands-On LLM Serving and Optimization companion - bottleneck experiments](https://github.com/orca3/llm-model-inference) - Use the repository overview and Chapter 2 baseline to connect model behavior, hardware limits and workload shape to observed bottlenecks. Turn each claim into a falsifiable prediction for one short-prompt and one long-prompt workload.
- **Required - Reference:** [vLLM Metrics Design and Production Metrics](https://docs.vllm.ai/en/latest/design/metrics/) - Map scheduler and cache events to exported request, queue, TTFT, inter-token and generation metrics. Verify metric definitions against the installed engine version before building dashboards.
- **Support - Reference:** [TensorRT-LLM Benchmarking Guide](https://nvidia.github.io/TensorRT-LLM/developer-guide/perf-benchmarking.html) - Use Before Benchmarking and Online Serving Benchmarking as a reproducibility checklist. Borrow environment capture and startup metrics even if TensorRT-LLM is not the selected engine.
- **Support - Practice:** [Time to First Token - Measurement and Load-Testing Sessions](https://github.com/patchy631/time-to-first-token) - Use only Week 3 and Week 5 as a practical checklist for Prometheus, Grafana and request-rate sweeps. Follow the competency gate rather than its calendar, and replace fixed concurrency goals with your hardware-safe saturation range.
- **Support - Project:** [LLM Inference Systems Laboratory - Instrumentation](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/capstones/llm-inference-systems-laboratory.md) - Complete Milestone B: correlate request, iteration, KV, scheduler, kernel and resource events, quantify observer overhead, and retain raw arrival and completion records.

### Exit checkpoint

Produce separate prefill and decode distributions, classify three workload regimes before profiling, and explain one failed bottleneck hypothesis from synchronized traces without changing the correctness or workload contract.

<details>
<summary>Deliberately left for later</summary>

- Tuning engine knobs before the baseline harness passes fake-server checks
- Comparisons with different tokenizers, outputs or cache states
- Fleet-scale conclusions from a single GPU trace

</details>

## INF-3. KV Memory and Prefix Reuse

**Why:** KV state is both the main variable memory budget and a correctness-sensitive shared resource. Paging and prefix reuse must preserve ownership, positions, versions and tenant boundaries under churn.

### Learn this much

- [ ] Per-layer KV tensor layouts _(Required)_
- [ ] MHA, GQA, MQA and MLA cache consequences _(Required)_
- [ ] Logical KV tokens and physical allocation _(Required)_
- [ ] Contiguous versus paged KV storage _(Required)_
- [ ] Block size and block-table address translation _(Required)_
- [ ] Internal and external fragmentation _(Required)_
- [ ] Free lists, allocation and reserve policies _(Required)_
- [ ] Sequence block tables and append semantics _(Required)_
- [ ] Reference counts and copy-on-write _(Required)_
- [ ] Fork, beam and shared-prefix ownership _(Required)_
- [ ] Eviction, recomputation and preemption _(Required)_
- [ ] Cancellation and terminal cleanup _(Required)_
- [ ] Prefix hashing and collision verification _(Required)_
- [ ] Trie and radix longest-prefix lookup _(Required)_
- [ ] Exact token, position and chat-template identity _(Required)_
- [ ] Model, tokenizer, adapter and cache-layout version scope _(Required)_
- [ ] Tenant and privacy scope _(Required)_
- [ ] Cache-aware routing and load balance _(Required)_
- [ ] KV offload to CPU or storage vocabulary _(Required)_
- [ ] KV connectors and transfer metadata _(Required)_
- [ ] Capacity and page-waste derivation _(Required)_
- [ ] Allocator and prefix-index state machines _(Required)_
- [ ] Randomized operation-sequence properties _(Required)_
- [ ] No double allocation, free or stale reference _(Required)_
- [ ] Prefix reuse TTFT and goodput measurement _(Required)_
- [ ] Eviction, fairness and memory-pressure measurement _(Required)_
- [ ] Hit rate versus application outcome _(Required)_
- [ ] KV quantization and compression orientation _(Optional)_
- [ ] Hybrid attention and state-space cache identity _(Optional)_
- [ ] Multimodal embedding and media-cache identity _(Optional)_
- [ ] Tiered distributed KV cache and remote-memory policy _(Depth)_
- [ ] Novel cache-eviction research without a validated baseline _(Later)_

### Resource route

- **Primary - Paper:** [Efficient Memory Management for Large Language Model Serving with PagedAttention](https://arxiv.org/abs/2309.06180) - Read the memory-waste motivation, block-table design, sharing and copy-on-write sections, then reproduce the logical-to-physical translation on paper. Separate the paper's reported workloads from results on your engine and hardware.
- **Required - Paper:** [SGLang: Efficient Execution of Structured Language Model Programs](https://arxiv.org/abs/2312.07104) - Study RadixAttention, longest-prefix matching, eviction and cache-aware scheduling. Compare its sequence-level radix index with vLLM's block-level paging instead of treating them as competing names for one mechanism.
- **Required - Implementation:** [Nano-vLLM - Block Manager and Sequence Lifecycle](https://github.com/GeeeekExplorer/nano-vllm) - Trace nanovllm/engine/block_manager.py, sequence.py, scheduler.py and attention.py. Draw allocate, append, share, preempt and free transitions, then implement randomized allocator tests in your own project before touching production-engine code.
- **Required - Implementation:** [Mini-SGLang - Radix Cache and Cache Tests](https://github.com/sgl-project/mini-sglang) - Read docs/structures.md, the cache allocation code and tests/core/test_cache_allocate.py. Compare exact prefix identity and lifecycle with Nano-vLLM, then add tenant and version fields to your own prefix index.
- **Required - Reference:** [vLLM Automatic Prefix Caching Design](https://docs.vllm.ai/en/latest/design/prefix_caching/) - Use the current design to check block hashing, multimodal inputs, LoRA identity, isolation and eviction behavior. Pin the inspected version because cache-key fields and supported models change.
- **Support - Reference:** [AI Performance Engineering - KV Cache Systems](https://github.com/wafer-ai/gpu-perf-engineering-resources) - Use Section 4 KV cache systems for vLLM, SGLang, GQA, MLA, KIVI and CacheGen, then Section 5 only for Mooncake and KV transfer orientation. Keep compression and disaggregation implementation for INF-6 and INF-7.
- **Support - Practice:** [100 Days of LLM Inference - Days 5, 9, 10 and 16](https://github.com/elizabetht/100-days-of-inference) - Use the four notebooks for KV arithmetic, paged allocation, radix reuse and prompt-layout experiments. Re-run conclusions against your own property tests and workload because these notebooks are a supplementary learning journal.
- **Support - Project:** [LLM Inference Systems Laboratory - KV State](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/capstones/llm-inference-systems-laboratory.md) - Implement the paged allocator and prefix index with differential, randomized, cancellation, collision, fork and pressure tests. Retain one reuse workload that improves hit rate but not goodput.

### Exit checkpoint

Pass long randomized allocate, append, fork, copy-on-write, evict and cancel histories, reconcile derived capacity with physical state, and show one workload where reuse helps and one where hit rate is misleading.

<details>
<summary>Deliberately left for later</summary>

- Distributed KV transfer before local ownership invariants pass
- Aggressive KV compression before quality and cache tests exist
- Cross-tenant reuse without an explicit isolation contract

</details>

## INF-4. Batching, Scheduling and Admission

**Why:** A serving scheduler decides which users progress, which memory is reserved and what happens under overload. Throughput, latency, fairness and cancellation must be visible in the same policy evaluation.

### Learn this much

- [ ] Static, dynamic and continuous batching _(Required)_
- [ ] Iteration-level token scheduling _(Required)_
- [ ] Waiting, running, preempted and terminal request sets _(Required)_
- [ ] Token budgets and maximum batched tokens _(Required)_
- [ ] Sequence-count and model-runner limits _(Required)_
- [ ] Memory admission and KV reserve _(Required)_
- [ ] Prefill and decode mixing _(Required)_
- [ ] Chunked prefill and decode protection _(Required)_
- [ ] Preemption, recomputation and swap vocabulary _(Required)_
- [ ] Priority classes and deadlines _(Required)_
- [ ] Fairness, starvation and priority inversion _(Required)_
- [ ] Head-of-line blocking and convoy effects _(Required)_
- [ ] Request cancellation and disconnect handling _(Required)_
- [ ] Overload, rejection and load shedding _(Required)_
- [ ] SLO-aware goodput _(Required)_
- [ ] Scheduler state and resource invariants _(Required)_
- [ ] Progress and bounded-wait invariants _(Required)_
- [ ] Continuous-batching simulator _(Required)_
- [ ] Deterministic workload replay _(Required)_
- [ ] Per-request scheduler event traces _(Required)_
- [ ] Long-prefill and decode-heavy workloads _(Required)_
- [ ] Mixed-length and bursty workloads _(Required)_
- [ ] Priority and cancellation workloads _(Required)_
- [ ] Offered-load sweep through saturation _(Required)_
- [ ] Queue growth and recovery analysis _(Required)_
- [ ] Policy ablation and negative regime _(Required)_
- [ ] Real-engine bounded policy change _(Required)_
- [ ] Adapter-affinity and prefix-locality scheduling _(Optional)_
- [ ] Structured-output and grammar-cost scheduling _(Optional)_
- [ ] Multimodal encoder and decoder co-scheduling _(Optional)_
- [ ] Learned or predictive service-time scheduling with safe fallback _(Depth)_
- [ ] Fleet-wide scheduling before single-engine policy evidence _(Later)_

### Resource route

- **Primary - Implementation:** [Hands-On LLM Serving and Optimization companion - batching and prefix optimization](https://github.com/orca3/llm-model-inference/tree/main/ch06) - Use the Chapter 6 code for batching, quantization and optimization experiments. Recreate scheduling and prefix caching in a small event simulator and state the user-visible metric each mechanism can improve or harm.
- **Required - Paper:** [Orca: A Distributed Serving System for Transformer-Based Generative Models](https://www.usenix.org/conference/osdi22/presentation/yu) - Study iteration-level scheduling and selective batching, including the workload assumptions. Reproduce one scheduling timeline by hand and use it as the correctness baseline for the simulator.
- **Required - Paper:** [Sarathi-Serve: Tackling Throughput-Latency Tradeoffs in LLM Inference](https://arxiv.org/abs/2403.02310) - Focus on chunked prefills, stall-free batching and the throughput-latency trade-off. Implement a fixed-token chunk policy and preserve a workload where chunking loses to the simpler scheduler.
- **Required - Implementation:** [Nano-vLLM - Scheduler, Block Manager and Engine Loop](https://github.com/GeeeekExplorer/nano-vllm) - Trace scheduler.py with llm_engine.py and block_manager.py. Add event logging in your own fork or project, explain every transition, and implement one bounded admission or chunking change with regression tests.
- **Required - Implementation:** [Mini-SGLang - Scheduler and Overlap Scheduling](https://github.com/sgl-project/mini-sglang) - Read docs/structures.md, scheduler implementation and tests/core/test_scheduler.py, then compare overlap scheduling with the Nano-vLLM loop. Use the online benchmark only after fixing the same workload and hardware contract.
- **Support - Lab:** [AI Systems Performance Engineering - Continuous Batching Lab](https://github.com/cfregly/ai-performance-engineering/tree/main/code/ch15) - Run the Chapter 15 baseline and optimized continuous-batching pair under CPU-safe or available-GPU settings. Inspect the shared comparison contract and re-measure rather than quoting bundled deltas.
- **Support - Project:** [LLM Inference Systems Laboratory - Scheduler](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/capstones/llm-inference-systems-laboratory.md) - Add token and memory admission, chunking, priority, cancellation, overload and fairness to the simulator, then carry one policy through the real engine path with a reference fallback.

### Exit checkpoint

Preserve request, memory, progress and fairness invariants under adversarial load, demonstrate one policy win and one regression, and explain both from scheduler traces rather than aggregate throughput.

<details>
<summary>Deliberately left for later</summary>

- Learned scheduling before deterministic baselines and safe fallback
- Combinatorial tuning of every engine flag
- Fleet routing before local admission and overload behavior are correct

</details>

## INF-5. Inference Kernels and Graph Execution

**Why:** Inference uses unusual shapes, changing sequence lengths and repeated small decode steps. A kernel or graph optimization matters only when its numerical contract, dispatch coverage and engine-level effect all hold.

### Learn this much

- [ ] Stable and online softmax _(Required)_
- [ ] Normalization and fused residual paths _(Required)_
- [ ] Prefill attention tensor shapes _(Required)_
- [ ] Decode attention tensor shapes _(Required)_
- [ ] IO-aware attention and FlashAttention _(Required)_
- [ ] Paged and variable-length decode attention _(Required)_
- [ ] GQA grouping and KV address calculation _(Required)_
- [ ] KV append, gather and layout _(Required)_
- [ ] RoPE position and offset handling _(Required)_
- [ ] Sampling and token-selection kernels _(Required)_
- [ ] Structured and guided decoding integration _(Required)_
- [ ] Memory layout, strides and alignment _(Required)_
- [ ] Operator fusion and intermediate traffic _(Required)_
- [ ] Kernel launch and host overhead _(Required)_
- [ ] CUDA streams, events and asynchronous execution _(Required)_
- [ ] CUDA graph capture and replay _(Required)_
- [ ] Static-address and shape constraints _(Required)_
- [ ] Graph buckets, padding and eager fallback _(Required)_
- [ ] Compilation, graph breaks and recompilation _(Required)_
- [ ] Shape, dtype, mask and tolerance contract _(Required)_
- [ ] Independent PyTorch or NumPy oracle _(Required)_
- [ ] Randomized differential tests _(Required)_
- [ ] Warmup and correct device timing _(Required)_
- [ ] FLOP, byte and launch accounting _(Required)_
- [ ] Profiler evidence for bottleneck classification _(Required)_
- [ ] Engine dispatch and fallback integration _(Required)_
- [ ] Kernel-to-endpoint translation _(Required)_
- [ ] Negative end-to-end result preservation _(Required)_
- [ ] FlashDecoding and decode mega-kernel vocabulary _(Optional)_
- [ ] FlashInfer backend selection and custom masks _(Optional)_
- [ ] Batch-invariant reduction kernels _(Optional)_
- [ ] Custom Triton or CUDA serving-critical kernel _(Depth)_
- [ ] Architecture-specific kernel portfolio outside the active bottleneck _(Later)_

### Resource route

- **Primary - Paper:** [FlashInfer: Efficient and Customizable Attention Engine for LLM Inference Serving](https://arxiv.org/abs/2501.01005) - Read the storage heterogeneity, plan and run separation, load-balanced scheduling, customization, CUDA Graph compatibility and end-to-end evaluation. Use it to connect serving-shaped attention kernels to dynamic workloads and dispatch constraints.
- **Required - Implementation:** [AI Systems Performance Engineering companion - KV-cache tuning](https://github.com/cfregly/ai-performance-engineering/tree/main/code/ch18) - Use the Chapter 18 labs to inspect decode kernels, paged attention, KV movement and adaptive scheduling. Choose one bounded critical path and verify every result with an independent correctness and measurement wrapper.
- **Required - Lab:** [AI Systems Performance Engineering - Chapter 18 Code](https://github.com/cfregly/ai-performance-engineering/tree/main/code/ch18) - Start with paged_attn_common.py, the dense versus paged layout pair, CUDA graph bucketing and the vLLM integration pair. Run correctness tests first, then a hardware-compatible benchmark with newly captured artifacts.
- **Required - Paper:** [FlashAttention-2: Faster Attention with Better Parallelism and Work Partitioning](https://arxiv.org/abs/2307.08691) - Derive online-softmax state, memory traffic and work partitioning. Implement only a small oracle-backed version or use the CS336 assignment; production kernel tuning belongs to the GPU track.
- **Required - Reference:** [FlashInfer Documentation](https://docs.flashinfer.ai/) - Use the current attention, PageAttention, sampling, JIT and CUDA Graph interfaces while implementing. Pin the version and supported GPU architecture, and validate dispatch and fallback over the real workload shape distribution.
- **Required - Assignment:** [CS336 Assignment 2 - FlashAttention and Triton Sections](https://github.com/stanford-cs336/assignment2-systems) - Complete the relevant derivation, PyTorch reference and Triton sections using your own code. Follow assignment integrity: use external help for concepts, invariants, tests and profiling, not copied solutions or edited answer code.
- **Support - Implementation:** [Mini-SGLang - Kernel, Model Runner and Overlap Boundaries](https://github.com/sgl-project/mini-sglang) - Trace how FlashAttention or FlashInfer, KV layouts, tensor parallel communication and overlap scheduling meet the model runner. Identify the fallback and state-reset boundary before attempting a change.
- **Support - Reference:** [AI Performance Engineering - Kernel Optimization, Profiling and Attention](https://github.com/wafer-ai/gpu-perf-engineering-resources) - Use Sections 2 and 3 to select PMPP, Triton, FlashAttention, FlashInfer and profiler references for the exact bottleneck. Do not read the entire source inventory linearly.
- **Support - Reference:** [TensorRT-LLM Architecture Overview](https://nvidia.github.io/TensorRT-LLM/developer-guide/overview.html) - Use the runtime-optimization section to compare graph replay, overlap scheduling and backend dispatch with your selected engine. Record current version and hardware support before treating a path as available.

### Exit checkpoint

Integrate one oracle-backed kernel or graph path, pass the serving shape and dtype matrix, explain its measured hardware bottleneck, and either demonstrate or honestly reject endpoint benefit under replayable load.

<details>
<summary>Deliberately left for later</summary>

- Custom kernels unrelated to the measured serving critical path
- Backward kernels unless the selected inference path needs them
- Hardware claims for architectures that were not measured

</details>

## INF-6. Quantization and Speculative Decoding

**Why:** Low precision and speculative execution change memory, kernels, quality and request state. Both need a correctness contract and measured crossover region, not a nominal bit width or acceptance-rate headline.

### Learn this much

- [ ] Integer and floating-point inference formats _(Required)_
- [ ] Weight-only, weight-activation and KV quantization _(Required)_
- [ ] Symmetric and asymmetric quantization _(Required)_
- [ ] Scale, zero point and representable range _(Required)_
- [ ] Per-tensor, per-channel and group granularity _(Required)_
- [ ] Calibration data and observer selection _(Required)_
- [ ] Outliers and activation smoothing _(Required)_
- [ ] Packing, metadata and alignment overhead _(Required)_
- [ ] Accumulator precision and dequantization _(Required)_
- [ ] Fused dequantization and hardware kernel support _(Required)_
- [ ] Post-training and quantization-aware vocabulary _(Required)_
- [ ] Perplexity, task and slice quality checks _(Required)_
- [ ] Memory, latency and throughput measurement _(Required)_
- [ ] Draft and target model roles _(Required)_
- [ ] Exact speculative acceptance probability _(Required)_
- [ ] Correction distribution after rejection _(Required)_
- [ ] Cache advance, rollback and stop handling _(Required)_
- [ ] Tokenizer and vocabulary compatibility _(Required)_
- [ ] Draft cost, target verification and accepted tokens _(Required)_
- [ ] Speculation speedup and crossover model _(Required)_
- [ ] N-gram, tree and learned-draft vocabulary _(Required)_
- [ ] Medusa, EAGLE and multi-token-head orientation _(Required)_
- [ ] Deterministic distribution simulator _(Required)_
- [ ] Distributional equivalence tests _(Required)_
- [ ] Quantized or speculative engine integration _(Required)_
- [ ] Versioned configuration and safe fallback _(Required)_
- [ ] Benefit and loss regions across batch and length _(Required)_
- [ ] Mixed-precision layer sensitivity search _(Optional)_
- [ ] KV cache quantization under long context _(Optional)_
- [ ] Structured decoding combined with speculation _(Optional)_
- [ ] Custom quantized kernel or learned drafter evaluation _(Depth)_
- [ ] Novel sub-4-bit format without hardware and quality evidence _(Later)_

### Resource route

- **Primary - Implementation:** [Hands-On LLM Serving and Optimization companion - quantization and speculative decoding](https://github.com/orca3/llm-model-inference) - Use the ch06 quantization and ch07 speculative-decoding examples. For each method, write its correctness contract, required engine support and predicted winning and losing workload before running it.
- **Required - Course:** [MIT 6.5940 TinyML and Efficient Deep Learning Computing - Quantization Lectures](https://hanlab.mit.edu/courses/2024-fall-65940) - Use Lectures 5 and 6 for quantization fundamentals, SmoothQuant, GPTQ and AWQ. Implement a small affine quantizer and an outlier experiment before using a pre-quantized checkpoint.
- **Required - Paper:** [SmoothQuant: Accurate and Efficient Post-Training Quantization for Large Language Models](https://arxiv.org/abs/2211.10438) - Study activation outliers and the offline smoothing transformation. Reproduce the algebra on one linear layer and compare calibration-sensitive quality with an unmodified reference.
- **Required - Paper:** [AWQ: Activation-Aware Weight Quantization for LLM Compression and Acceleration](https://arxiv.org/abs/2306.00978) - Focus on salient-weight protection, group scaling and the distinction between simulated quality and real kernel speed. Compare one supported AWQ path with the same unquantized workload.
- **Required - Paper:** [Fast Inference from Transformers via Speculative Decoding](https://proceedings.mlr.press/v202/leviathan23a.html) - Derive acceptance and correction probabilities and implement the exact categorical simulator. Prove distributional equality on tiny distributions before adding a model or engine.
- **Required - Lab:** [AI Systems Performance Engineering - Chapters 16, 18 and 19 Labs](https://github.com/cfregly/ai-performance-engineering/tree/main/code) - Use Chapter 16 AWQ, GPTQ and SmoothQuant pairs, Chapter 18 speculation sweeps and Chapter 19 dynamic quantized cache. Run one family at a time, require quality or numerical parity, and regenerate results on available hardware.
- **Support - Practice:** [100 Days of LLM Inference - Days 13, 14 and 15](https://github.com/elizabetht/100-days-of-inference) - Use the numeric-format, quantization-algorithm and speculative-decoding notebooks as compact preparation. Keep their synthetic demos separate from production-engine and hardware evidence.
- **Support - Reference:** [AI Performance Engineering - Quantization and Speculative Decoding](https://github.com/wafer-ai/gpu-perf-engineering-resources) - Use Section 4 to find GPTQ, SmoothQuant, AWQ, Leviathan, Medusa and EAGLE sources. Open only the sources needed to explain an observed quality, acceptance or kernel-support gap.

### Exit checkpoint

Show numerical or task-quality correctness for one quantized path and distributional correctness for exact speculation, then identify a measured win and loss region for each mechanism with safe fallback.

<details>
<summary>Deliberately left for later</summary>

- Benchmarking pre-quantized checkpoints without a quality baseline
- Speculative methods that lack a understood correction contract
- Hardware-specific low-precision claims on unsupported devices

</details>

## INF-7. Distributed and Disaggregated Inference

**Why:** Multiple devices add communication, placement, queue and failure boundaries. A topology is justified only when its added capacity or phase isolation exceeds collective and KV-transfer costs for the declared workload.

### Learn this much

- [ ] Replica or data-parallel serving _(Required)_
- [ ] Tensor-parallel inference shapes and collectives _(Required)_
- [ ] Pipeline-parallel inference stages and bubbles _(Required)_
- [ ] Expert-parallel MoE dispatch and combine _(Required)_
- [ ] Context and sequence parallelism vocabulary _(Required)_
- [ ] Model weights and KV sharding _(Required)_
- [ ] Per-rank memory and local tensor ownership _(Required)_
- [ ] Collective and point-to-point communication volume _(Required)_
- [ ] PCIe, NVLink, NVSwitch and network topology _(Required)_
- [ ] Small-batch latency versus distributed capacity _(Required)_
- [ ] Replica routing and load balancing _(Required)_
- [ ] Cache-aware routing and locality skew _(Required)_
- [ ] Prefill and decode disaggregation _(Required)_
- [ ] Independent phase parallelism and capacity _(Required)_
- [ ] KV transfer size, latency and bandwidth _(Required)_
- [ ] NIXL and KV connector vocabulary _(Required)_
- [ ] Transfer overlap and backpressure _(Required)_
- [ ] Prefill and decode pool placement _(Required)_
- [ ] Heterogeneous GPU and phase assignment _(Required)_
- [ ] Disaggregation break-even model _(Required)_
- [ ] Request identity and KV version across phases _(Required)_
- [ ] Checksums and layout compatibility _(Required)_
- [ ] Cancellation, timeout and retry propagation _(Required)_
- [ ] Worker, rank and transfer failure _(Required)_
- [ ] Duplicate request and stale KV diagnosis _(Required)_
- [ ] Topology and capacity simulator _(Required)_
- [ ] Measured versus simulated evidence labels _(Required)_
- [ ] Goodput, utilization, KV traffic and cost comparison _(Required)_
- [ ] Warm pools and elastic phase resizing _(Optional)_
- [ ] KV offload across HBM, DRAM and storage tiers _(Optional)_
- [ ] Topology-aware MoE expert placement _(Optional)_
- [ ] Dynamic disaggregation and adaptive parallelism _(Depth)_
- [ ] Frontier fleet scale as a completion requirement _(Later)_

### Resource route

- **Primary - Paper:** [DistServe: Disaggregating Prefill and Decoding for Goodput-Optimized LLM Serving](https://www.usenix.org/conference/osdi24/presentation/zhong-yinmin) - Read the interference model, independent phase parallelism, placement, KV transfer and goodput evaluation. Reuse the break-even method with your workload and topology; do not transfer the paper's speedups to different hardware.
- **Required - Implementation:** [AI Systems Performance Engineering companion - distributed inference](https://github.com/cfregly/ai-performance-engineering/tree/main/code/ch15) - Use the Chapter 15 and 17 labs for multinode parallelism, MoE, routing and prefill-decode disaggregation. Reproduce every communication and KV-transfer estimate for a small declared topology.
- **Required - Lab:** [AI Systems Performance Engineering - Chapters 15 and 17 Code](https://github.com/cfregly/ai-performance-engineering/tree/main/code) - Use the single-device KV-handoff and simulation paths before the multi-GPU pairs. Then choose one disaggregation, routing or MoE target compatible with available hardware and keep bundled results separate from newly captured evidence.
- **Required - Reference:** [NVIDIA Dynamo - Disaggregated Serving and KV-Aware Routing](https://docs.nvidia.com/dynamo/dev/knowledge-base/concepts/system-architecture/disaggregated-serving) - Trace frontend, prefill router, prefill worker, KV transfer, decode routing and decode worker. Record how load, cache overlap, worker discovery and transfer metadata affect placement; implement only a small simulated or available-hardware slice.
- **Required - Reference:** [TensorRT-LLM Disaggregated Serving and KV Cache Exchange](https://nvidia.github.io/TensorRT-LLM/features/disagg-serving.html) - Study the KV exchange abstraction, unique request identity, layout conversion, overlap and fleet-worker model. Use its reproducible benchmark sections only on supported hardware and pin the release.
- **Support - Paper:** [Mooncake: A KVCache-Centric Disaggregated Architecture for LLM Serving](https://www.usenix.org/conference/fast25/presentation/qin) - Read the KV-centric architecture, transfer engine and scheduling sections to understand remote cache pools. Compare its assumptions with DistServe and your simpler handoff; defer reproduction requiring a large cluster.
- **Support - Practice:** [100 Days of LLM Inference - Days 12, 17 and 18](https://github.com/elizabetht/100-days-of-inference) - Use the Dynamo, model-parallelism and disaggregation notebooks for a compact topology simulator and request-handoff trace. Label notebook outputs as local analytical or simulated evidence unless real devices were used.
- **Support - Reference:** [AI Performance Engineering - Distributed Inference](https://github.com/wafer-ai/gpu-perf-engineering-resources) - Use Section 5 to navigate TP, PP, EP, MoE serving, DistServe, Splitwise, Mooncake, NIXL and Dynamo. Select sources from the bottleneck in the topology model rather than reading the entire list.

### Exit checkpoint

Defend single-node, replica, TP, PP, EP or disaggregated choices with a quantitative topology model, preserve request and KV lifecycle through cancellation or failure, and label every result as analytical, simulated, local-process or measured multi-device evidence.

<details>
<summary>Deliberately left for later</summary>

- Large-cluster reproduction before small topology predictions are validated
- Adaptive fleet controllers without a safe static baseline
- Distributed speedup claims that omit KV transfer and queueing

</details>

## INF-8. Production Serving and Reliability

**Why:** A fast model runner is only one component of a service. The production gate covers API semantics, lifecycle, overload, isolation, observability, rollout and recovery while preserving model quality.

### Learn this much

- [ ] Typed OpenAI-compatible request and response schemas _(Required)_
- [ ] Token streaming and backpressure _(Required)_
- [ ] Deadlines, disconnects and cancellation propagation _(Required)_
- [ ] Authentication, quotas and request validation _(Required)_
- [ ] Idempotency and retry boundaries _(Required)_
- [ ] Router and load-balancer responsibilities _(Required)_
- [ ] Token-aware and cache-aware routing _(Required)_
- [ ] Model formats, weight loading and startup phases _(Required)_
- [ ] Warmup, health and readiness _(Required)_
- [ ] Graceful drain and process termination _(Required)_
- [ ] Model, tokenizer, template and configuration compatibility _(Required)_
- [ ] Canary, blue-green and rollback workflows _(Required)_
- [ ] Autoscaling signals and startup lag _(Required)_
- [ ] Failure reserve, degraded-mode headroom and admission response _(Required)_
- [ ] Overload, admission and load shedding _(Required)_
- [ ] Retry budgets and storm prevention _(Required)_
- [ ] Multi-tenant model and cache isolation _(Required)_
- [ ] Prompt, output and trace privacy _(Required)_
- [ ] Per-request logs, metrics and traces _(Required)_
- [ ] Queue, phase, token, cache and scheduler telemetry _(Required)_
- [ ] GPU, CPU, memory and network telemetry _(Required)_
- [ ] Quality, availability, latency and error SLIs _(Required)_
- [ ] SLOs, error budgets and goodput _(Required)_
- [ ] Worker and GPU-process failure injection _(Required)_
- [ ] Dependency delay and cache-degradation injection _(Required)_
- [ ] Bad model or configuration rollout injection _(Required)_
- [ ] Seeded performance and security incident diagnosis _(Required)_
- [ ] Runbooks and first-cause timelines _(Required)_
- [ ] Saturation, recovery and rollback load tests _(Required)_
- [ ] Multi-LoRA adapter residency and affinity routing _(Optional)_
- [ ] Structured-output API and grammar-cache lifecycle _(Optional)_
- [ ] Multimodal media validation and encoder scheduling _(Optional)_
- [ ] Kubernetes Gateway API Inference Extension and llm-d deployment _(Depth)_
- [ ] Multi-region active-active serving and global procurement _(Later)_

### Resource route

- **Primary - Documentation:** [vLLM Online Serving, Architecture and Production Metrics](https://docs.vllm.ai/en/latest/serving/online_serving/) - Trace the current API server, EngineCore, scheduler, KV manager and model runner, then map documented metrics to the stage SLIs. Pin the release and add missing auth, tenant, quality and rollout controls around the engine.
- **Required - Implementation:** [Hands-On LLM Serving and Optimization companion - serving architecture](https://github.com/orca3/llm-model-inference) - Use the ch03 and ch04 services to examine single-model and multi-model APIs, streaming, batching, hosting and production structure. Convert the implementations into explicit request, model-lifecycle and failure state machines.
- **Required - Reference:** [vLLM Production Metrics](https://docs.vllm.ai/en/latest/usage/metrics/) - Define every selected queue, cache, phase and request metric, check histogram buckets and measure exporter overhead. Add model version, cancellation, rejection, quality sample and tenant-safe trace fields in the surrounding service.
- **Required - Reference:** [Gateway API Inference Extension](https://gateway-api-inference-extension.sigs.k8s.io/) - Study model-aware routing, endpoint selection and operational integration. Use it for architecture and an optional local deployment only after the service passes lifecycle and failure tests without Kubernetes.
- **Required - Lab:** [AI Systems Performance Engineering - Production Inference Labs](https://github.com/cfregly/ai-performance-engineering/tree/main/code) - Use Chapter 16 monitoring, cache health, capacity planning and load-test utilities, then Chapter 17 routing only if distributed. Add process death, overload and bad-version cases that the performance pairs do not cover.
- **Support - Practice:** [100 Days of LLM Inference - Days 22 to 26](https://github.com/elizabetht/100-days-of-inference) - Use the container, autoscaling, routing, capacity and zero-downtime notebooks as small operational simulations. Replace calendar order and fixed scale targets with the stage checkpoint and your hardware limits.
- **Support - Project:** [AI Infrastructure Engineer Learning - Project 103 LLM Deployment](https://github.com/ai-infra-curriculum/ai-infra-engineer-learning/tree/main/projects/project-103-llm-deployment) - Use its Docker, API, monitoring, Kubernetes and cost files as scaffolding only. Correct the resource assumptions and unmatched benchmarks noted in Resource-Survey before reusing any results.
- **Support - Project:** [LLM Inference Systems Laboratory - Operations and Failure](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/capstones/llm-inference-systems-laboratory.md) - Complete production gateway, isolation, telemetry, canary, drain, rollback and fault campaigns. Store first-cause timelines and revise runbooks from observed blind spots.

### Exit checkpoint

Meet the request and isolation contract under saturation, cancellation, worker death and bad rollout, then diagnose one seeded performance incident and one lifecycle or security incident from stored evidence and execute a clean drain and rollback.

<details>
<summary>Deliberately left for later</summary>

- Large Kubernetes deployment before the local service is operable
- Multi-region resilience before one-region recovery and rollback pass
- Private prompt or output capture in unrestricted telemetry

</details>

## INF-9. Capacity, Economics and Engine Extension

**Why:** The final stage turns mechanisms into engineering judgment. You must reconstruct an unfamiliar engine, change one real path and defend its benefit, cost, failure behavior and losing regimes under governed benchmarks.

### Learn this much

- [ ] Benchmark question and decision owner _(Required)_
- [ ] Immutable model, engine, hardware and workload manifest _(Required)_
- [ ] Tuning traces versus final traces _(Required)_
- [ ] Offered versus completed load _(Required)_
- [ ] Throughput versus SLO goodput _(Required)_
- [ ] Utilization versus useful work _(Required)_
- [ ] Cost per input, output and accepted token _(Required)_
- [ ] Quality acceptance and retry cost _(Required)_
- [ ] Warmup, cache state and arrival-process fairness _(Required)_
- [ ] Raw per-request trace retention _(Required)_
- [ ] p50, p95 and p99 with uncertainty _(Required)_
- [ ] Capacity-planning headroom under demand growth _(Required)_
- [ ] Three workload and SLO scenarios _(Required)_
- [ ] Engine API and tokenizer path reconstruction _(Required)_
- [ ] Scheduler and request-state reconstruction _(Required)_
- [ ] Block manager and prefix-cache reconstruction _(Required)_
- [ ] Model runner and attention-backend reconstruction _(Required)_
- [ ] Sampling, streaming and cleanup reconstruction _(Required)_
- [ ] Distributed worker and telemetry reconstruction _(Required)_
- [ ] Contribution hypothesis and predicted boundary _(Required)_
- [ ] One scheduler, cache, routing, instrumentation or kernel change _(Required)_
- [ ] Reference fallback and versioned configuration _(Required)_
- [ ] Unit, property, integration and regression tests _(Required)_
- [ ] Correctness, quality and failure protection _(Required)_
- [ ] Strong baseline and comparable tuning _(Required)_
- [ ] At least three mechanism-isolating ablations _(Required)_
- [ ] At least three informative workload regions _(Required)_
- [ ] Neutral or negative result preservation _(Required)_
- [ ] Bottleneck-shift explanation _(Required)_
- [ ] Capacity and cost decision _(Required)_
- [ ] Independent reproduction package _(Required)_
- [ ] Technical design defense _(Required)_
- [ ] Second model family or hardware generation validation _(Optional)_
- [ ] Upstream-quality patch and external review _(Optional)_
- [ ] Energy and carbon accounting alongside cost _(Optional)_
- [ ] Research proposal grounded in the measured mechanism boundary _(Depth)_
- [ ] Broad engine rewrite instead of a bounded reviewable contribution _(Later)_

### Resource route

- **Primary - Reference:** [TensorRT-LLM Benchmarking Guide](https://nvidia.github.io/TensorRT-LLM/developer-guide/perf-benchmarking.html) - Use the current benchmark workflow, configuration capture, startup metrics and online-serving path as a benchmark-governance reference. Apply the same discipline to the selected engine and never import NVIDIA results as your own evidence.
- **Required - Implementation:** [Hands-On LLM Serving and Optimization companion - Qwen3 optimization](https://github.com/orca3/llm-model-inference/tree/main/ch09) - Use the ch09 Qwen3 project as a worked sequence from traffic generation and baseline through quantized and distributed variants. Replace its model, engine version and hardware with your fixed contract and keep only comparable steps.
- **Required - Implementation:** [vLLM V1 Architecture Overview](https://docs.vllm.ai/en/latest/design/arch_overview/) - Map API server, EngineCore, scheduler, KV cache manager, model executor and distributed deployment from the current documentation into exact source files. Select the bounded contribution only after identifying its state and fallback boundaries.
- **Required - Implementation:** [Nano-vLLM and Mini-SGLang as Engine Reconstruction Bridges](https://github.com/GeeeekExplorer/nano-vllm) - Reconstruct Nano-vLLM first, then compare Mini-SGLang cache, scheduler, overlap and model-runner boundaries. Move to vLLM or SGLang only when you can predict where the same responsibility lives.
- **Required - Lab:** [AI Performance Engineering - Inference Engine and Benchmark Lanes](https://github.com/wafer-ai/gpu-perf-engineering-resources) - Use Sections 4 and 5 of the public guide to choose one mechanism source, then use the companion ch15 to ch19 or labs path for controlled baseline, optimization and profiler patterns. Re-run everything under the capstone manifest.
- **Required - Paper:** [Etalon: Holistic Performance Evaluation Framework for LLM Inference Systems](https://arxiv.org/abs/2407.07000) - Use its per-request SLO and goodput framing to audit the benchmark. Preserve raw outcomes, quality acceptance and load shape so a throughput increase cannot hide missed latency targets.
- **Support - Reference:** [MLPerf Inference Datacenter Benchmark](https://mlcommons.org/benchmarks/inference-datacenter/) - Study scenario definitions, audit discipline and reproducibility. Borrow governance ideas appropriate to the capstone; submitting to MLPerf or reproducing its fleet hardware is outside the gate.
- **Required - Project:** [LLM Inference Systems Laboratory - Full Capstone](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/capstones/llm-inference-systems-laboratory.md) - Complete the architecture map, contribution, fallbacks, correctness and fault suite, raw benchmark package, negative result, capacity and cost plan, independent reproduction and design defense. This artifact supplies the track milestone.

### Exit checkpoint

Deliver a tested real-engine contribution with a reference fallback, three workload regions, three mechanism ablations, one honest neutral or negative result, fault evidence, a capacity and cost decision, and independent reproduction with measured, simulated and inferred claims separated.

<details>
<summary>Deliberately left for later</summary>

- Benchmark-only changes that bypass the real request path
- Headline speedups without raw requests, output checks and uncertainty
- A broad engine rewrite that cannot be reviewed or ablated

</details>

## Track milestone

### LLM Inference Systems Laboratory

Extend one service from a reference-equivalent baseline into an observable, failure-aware serving system, then modify one real engine path and defend its workload boundary. CPU or simulation evidence can establish state correctness, while GPU, multi-device and fleet claims require measurements on that exact hardware.

- A request and engine architecture map, analytical model, immutable workload manifest, validated load generator and raw phase-separated baseline traces.
- One scheduler, KV, routing, instrumentation or kernel contribution with fallback, correctness and fault tests, three ablations, three workload regions and a preserved neutral or negative result.
- A production operations and evaluation package with SLO and quality goodput, capacity and cost, isolation, canary and rollback, runbooks, evidence labels and independent reproduction.

