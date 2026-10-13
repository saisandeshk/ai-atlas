<!-- Generated from content/curriculum.json. Edit the JSON and run npm run content:generate. -->

# 07. Performance & GPU Programming

**Level:** Advanced specialization  
**Scope:** 10 track stages · 236 required topics · 33 optional, depth, or later topics

Predict, profile and optimize AI workloads from one request and one kernel through tensor cores, compilers, inference integration and multi-GPU communication, with correctness, strong baselines and negative regimes preserved.

## Order

GPU-1. Workload Arithmetic and Performance Contracts
GPU-2. GPU Execution, Memory and Code Generation
GPU-3. Measurement, Profiling and Correctness
GPU-4. CUDA Data Movement and Parallel Primitives
GPU-5. GEMM, Tensor Cores and Low Precision
GPU-6. Attention and Transformer Fusion
GPU-7. Triton, CuTe and Compiler Paths
GPU-8. Kernel-to-Inference Integration
GPU-9. Multi-GPU Communication and Distributed Inference Performance
GPU-10. Portability, Benchmark Audit and Performance Research

## GPU-1. Workload Arithmetic and Performance Contracts

**Why:** Optimization starts with a workload and a falsifiable performance model. This stage traces one transformer request from prefill through decode, accounts for operations and bytes, and defines evidence strong enough to distinguish useful speed from a misleading microbenchmark.

### Learn this much

- [ ] One inference request from tokenize and prefill through autoregressive decode _(Required)_
- [ ] Layers, hidden size, heads, key-value heads, sequence lengths, batch and precision _(Required)_
- [ ] Useful operations for projections, MLPs and output layers _(Required)_
- [ ] Prefill and decode attention operations by sequence and head shape _(Required)_
- [ ] Parameter bytes under storage and execution precision _(Required)_
- [ ] Activation, temporary workspace and allocator memory _(Required)_
- [ ] MHA, GQA and MQA key-value bytes per token and request _(Required)_
- [ ] Weight, activation, key-value, workspace and graph memory residency _(Required)_
- [ ] Compute-heavy prefill and bandwidth or latency-sensitive decode regimes _(Required)_
- [ ] Time to first token, time per output token, inter-token and end-to-end latency _(Required)_
- [ ] Tokens per second, requests per second and useful work per device _(Required)_
- [ ] Goodput under per-request latency and correctness requirements _(Required)_
- [ ] Prompt, output, batch, dtype, shape and arrival distributions _(Required)_
- [ ] Cold start, compilation, autotuning, cache warmup and steady state _(Required)_
- [ ] Compute, memory, launch, synchronization, host and communication cost categories _(Required)_
- [ ] Arithmetic intensity and a first roofline estimate _(Required)_
- [ ] Kernel share, Amdahl bound and maximum end-to-end impact _(Required)_
- [ ] Framework, vendor library, compiler and existing engine baselines _(Required)_
- [ ] Numerical correctness, output quality and semantic-equivalence contract _(Required)_
- [ ] Hardware, firmware, driver, toolkit, compiler, library and configuration manifest _(Required)_
- [ ] Claim schema with workload, hardware, baseline, timing boundary and correctness method _(Required)_
- [ ] Prediction, falsifying signals and decision rule declared before profiling _(Required)_
- [ ] Raw trials, traces, counters, code revision and generated report lineage _(Required)_
- [ ] Training-step operation, activation and communication arithmetic _(Optional)_
- [ ] Agentic, voice, video and multimodal serving distributions _(Depth)_
- [ ] Fleet procurement, capacity markets and organization-wide cost planning _(Later)_

### Resource route

- **Primary - Guide:** [AI Performance Engineering - Start Here](https://github.com/wafer-ai/gpu-perf-engineering-resources) - Follow the eight Start Here items in order. Re-derive one request through prefill and decode, then create a single claim template that records hardware, workload, precision, baseline, correctness, TTFT, TPOT, goodput, raw trials and source revision. Treat later sections as references for the stage where they are assigned.
- **Required - Book:** [How to Scale Your Model - Inference](https://jax-ml.github.io/scaling-book/inference/) - Work through the single-request, batching, key-value memory and parallelism arithmetic. Recompute every quantity for the small model and workload used by the track project, keeping symbols, units and assumptions visible.
- **Required - Article:** [Transformer Inference Arithmetic](https://kipply.github.io/blog/transformer-inference-arithmetic/) - Reproduce the FLOP, parameter-byte, key-value-byte and communication estimates for dense transformer inference. Compare the formulas with an instrumented framework trace and explain model residuals instead of fitting constants after measurement.
- **Required - Paper:** [Efficiently Scaling Transformer Inference](https://proceedings.mlsys.org/paper_files/paper/2023/file/c4be71ab8d24cdfb45e3d06dbfca2780-Paper-mlsys2023.pdf) - Study the latency, memory and parallelism model. Use the paper to derive a batch and parallelism crossover for your workload, while reserving distributed execution for GPU-9.
- **Support - Paper:** [Etalon](https://arxiv.org/html/2407.07000) - Read the metric definitions and goodput methodology. Add TTFT and TPOT SLOs to a small load generator, and show why peak token throughput can rank two systems differently from SLO-qualified goodput.
- **Support - Project:** [GPU Microbenchmark and Kernel Suite](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/gpu-microbenchmark-kernel-suite.md) - Adopt the project harness schema, architecture constraints and hardware tiers now. Implement only the environment manifest, independent references, raw-trial storage and the initial operation and byte models in this stage.

### Exit checkpoint

Predict operations, useful and allocated bytes, key-value memory, latency regimes and an end-to-end speedup bound for one request, then reconcile the model with a cold and warm trace under a versioned claim and artifact schema.

<details>
<summary>Deliberately left for later</summary>

- Transformer derivations and model architecture study already owned by LLM Foundations
- Fleet procurement and organization-wide inference economics
- Unmeasured vendor peak claims or production-scale throughput claims without the named hardware

</details>

## GPU-2. GPU Execution, Memory and Code Generation

**Why:** Kernel performance follows from how threads, memory transactions and machine instructions map onto a real device. This stage builds the execution model needed to predict coalescing, divergence, resource limits and compilation behavior before using a profiler.

### Learn this much

- [ ] Host, device, kernels and heterogeneous execution boundaries _(Required)_
- [ ] Grids, blocks, threads and multidimensional index mapping _(Required)_
- [ ] Warp formation, active lanes and partial warps _(Required)_
- [ ] Streaming multiprocessors, block scheduling and residency _(Required)_
- [ ] Warp scheduling, dependency latency and latency hiding _(Required)_
- [ ] Occupancy constraints from threads, warps, registers and shared memory _(Required)_
- [ ] Registers, local memory and spill behavior _(Required)_
- [ ] Global memory, L1 and L2 caches and memory transactions _(Required)_
- [ ] Shared memory banks, conflicts, padding and broadcast _(Required)_
- [ ] Constant and read-only cache use cases _(Optional)_
- [ ] Address patterns, alignment, vector width and coalescing _(Required)_
- [ ] Control divergence, predication and reconvergence _(Required)_
- [ ] Warp, block, cluster, device and system synchronization scopes _(Required)_
- [ ] Atomics, memory visibility and ordering vocabulary _(Required)_
- [ ] Launch dimensions, dynamic shared memory and resource validation _(Required)_
- [ ] Compute capability, device properties and feature detection _(Required)_
- [ ] Device allocation, copies and explicit ownership _(Required)_
- [ ] Grid-stride loops, tails, zero sizes and bounds safety _(Required)_
- [ ] CUDA source through host code, device code, PTX and machine code _(Required)_
- [ ] NVCC architecture, code-generation and compatibility flags _(Required)_
- [ ] PTX virtual ISA, address spaces and target features _(Required)_
- [ ] Cubin, fatbinary, SASS, cuobjdump and nvdisasm _(Required)_
- [ ] Tensor shape, stride, dtype, stream and error contracts at a native extension _(Required)_
- [ ] Alignment, aliasing, layout and compiler optimization constraints _(Required)_
- [ ] Architecture capability checks and correct fallback paths _(Required)_
- [ ] TMA, clusters, tensor memory and current architecture features _(Depth)_
- [ ] AMD, TPU and Trainium execution models _(Later)_

### Resource route

- **Primary - Course:** [Programming Massively Parallel Processors, 4th edition companion materials](https://shop.elsevier.com/books/book-companion/9780323912310) - Use the official lecture slides, lab materials and code skeletons for the Chapter 2 through 6 concepts. Implement vector addition and matrix mapping, answer the architecture, warp, occupancy, memory and coalescing exercises, and predict three altered launch or address patterns before running them.
- **Required - Documentation:** [CUDA Programming Guide](https://docs.nvidia.com/cuda/cuda-programming-guide/) - Read the Basics and Programming Model chapters plus the sections on memory, synchronization, hardware implementation and compute capabilities used by your kernels. Record the toolkit documentation version alongside every claim.
- **Required - Documentation:** [CUDA C++ Best Practices Guide](https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/) - Study Assess, Parallelize, Optimize, Deploy; Getting the Right Answer; memory optimization; execution configuration; instruction optimization; and deployment compatibility. Convert recommendations into hypotheses, not universal rules.
- **Reference - Specification:** [Parallel Thread Execution ISA](https://docs.nvidia.com/cuda/parallel-thread-execution/) - Read the PTX purpose, machine model, state spaces, memory consistency and target directives. Compile two tiny kernels, map source to PTX and SASS, and explain what PTX does and does not guarantee across devices.
- **Support - Lectures:** [GPU MODE Foundations Lectures](https://github.com/gpu-mode/lectures) - Use Lectures 2, 3, 4, 5, 8, 37 and 41 for PMPP review, CUDA setup, architecture, optimization checklists, SASS and documentation reading. Reproduce only the examples that test a prediction from this stage.
- **Support - Guide:** [AI Performance Engineering - GPU Fundamentals](https://github.com/wafer-ai/gpu-perf-engineering-resources) - Use Section 1 as the curated index for the programming model, compilation and machine-code references. Check architecture-specific claims against the exact tuning guide for the available GPU.

### Exit checkpoint

Predict warp membership, addresses, transactions, bank mapping, divergence, occupancy limits and generated-code targets for three unfamiliar kernels, then verify the mapping with device properties, PTX and SASS inspection.

<details>
<summary>Deliberately left for later</summary>

- General C++ ownership, concurrency and CPU performance already owned by Programming and Systems
- Architecture-specific TMA, tensor-memory and cluster programming before portable CUDA fundamentals pass
- Non-NVIDIA accelerator programming until one CUDA execution model is operational

</details>

## GPU-3. Measurement, Profiling and Correctness

**Why:** GPU timing is asynchronous and performance tools perturb the workload. This stage builds a correctness-first harness, combines timelines with kernel counters and roofline models, and requires converging evidence before any optimization claim.

### Learn this much

- [ ] Benchmark question, timed boundary and excluded work _(Required)_
- [ ] Asynchronous launch, implicit synchronization and host timer failure _(Required)_
- [ ] CUDA events, device synchronization and stream-scoped timing _(Required)_
- [ ] Warmup convergence, JIT compilation, autotuning and cache state _(Required)_
- [ ] Allocator pools, L2 and application-cache state _(Required)_
- [ ] Clock, power, thermal and throttling state _(Required)_
- [ ] Process, device, multi-tenant and background-work interference _(Required)_
- [ ] Interleaved variants, randomized order and raw repeated trials _(Required)_
- [ ] Median, tail, variance, uncertainty and practical significance _(Required)_
- [ ] Machine, driver, toolkit, compiler, library, flags and code revision capture _(Required)_
- [ ] Reference implementation independent of target kernel logic _(Required)_
- [ ] Differential and property tests across shapes, strides, dtypes and masks _(Required)_
- [ ] Tolerance from precision, reduction order, conditioning and output use _(Required)_
- [ ] NaN, Inf, overflow, underflow, denorm and extreme-input policy _(Required)_
- [ ] Out-of-bounds and misaligned access diagnosis with memcheck _(Required)_
- [ ] Race, initialization and synchronization diagnostics _(Required)_
- [ ] CPU-GPU timelines, API calls, copies, kernels and synchronization _(Required)_
- [ ] NVTX ranges and trace-to-source correlation _(Required)_
- [ ] Kernel counters, section sets, replay and metric interpretation _(Required)_
- [ ] Useful versus executed operations and useful versus requested or actual bytes _(Required)_
- [ ] Achieved bandwidth, compute throughput and efficiency _(Required)_
- [ ] Arithmetic intensity, roofline bounds and regime transitions _(Required)_
- [ ] Warp stalls, occupancy, register pressure and resource evidence _(Required)_
- [ ] Launch, memory, compute, resource, synchronization, transfer and host bottlenecks _(Required)_
- [ ] Profiler overhead, replay effects and counter multiplexing _(Required)_
- [ ] Kernel speedup, dispatch cost and end-to-end translation _(Required)_
- [ ] Performance regressions and retained no-benefit regimes _(Required)_
- [ ] Cross-device and cross-generation reproducibility _(Optional)_
- [ ] Energy, power caps and performance-per-watt experiments _(Depth)_

### Resource route

- **Primary - Implementation:** [AI Systems Performance Engineering companion - profiling and memory](https://github.com/cfregly/ai-performance-engineering/tree/main/code) - Use the Chapter 6 through 8 labs for GPU architecture, Compute Sanitizer, roofline analysis, memory access and Nsight Compute. Reproduce a baseline and optimized pair only after auditing its correctness and measurement boundaries.
- **Required - Lab:** [AI Systems Performance Engineering Companion Code](https://github.com/cfregly/ai-performance-engineering/tree/main/code) - Use selected baseline and optimized pairs from code/ch06, ch07 and ch08 plus the shared benchmark and verification machinery. Run only hardware-compatible paths, inspect the tests first, retain raw artifacts and document any guard or unavailable feature.
- **Required - Documentation:** [Nsight Systems User Guide](https://docs.nvidia.com/nsight-systems/UserGuide/) - Learn capture, statistics, CUDA API and GPU timeline views, NVTX ranges and report export. Produce one trace that attributes a host gap, transfer or synchronization cost without using the kernel profiler first.
- **Required - Documentation:** [Nsight Compute Profiling Guide](https://docs.nvidia.com/nsight-compute/ProfilingGuide/) - Study the profiling model, replay, metric collection, sections, roofline and source correlation. Collect the smallest counter set that can falsify your bottleneck hypothesis and record profiler overhead.
- **Required - Documentation:** [Compute Sanitizer](https://docs.nvidia.com/compute-sanitizer/ComputeSanitizer/) - Run memcheck plus applicable racecheck, initcheck and synccheck cases against seeded defects. Preserve minimal reproducers and regression tests, and distinguish unsupported checks from a clean result.
- **Required - Paper:** [Roofline: An Insightful Visual Performance Model](https://www2.eecs.berkeley.edu/Pubs/TechRpts/2008/EECS-2008-134.html) - Read the original model and construct one roofline plot with explicit peak assumptions, useful operations and bytes. Add measured points and explain gaps from launch, resource, cache or instruction effects.
- **Support - Methodology:** [CUTLASS GEMM Performance Measurement Methodology](https://docs.nvidia.com/cutlass/latest/media/docs/cpp/gemm_performance_measurement_methodology_guidelines.html) - Apply the environment, clock, warmup, timing, verification and reporting guidance to the benchmark harness. Generalize the method beyond GEMM and document every intentional deviation.
- **Support - Project:** [GPU Microbenchmark and Kernel Suite - Harness and Instrumentation](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/gpu-microbenchmark-kernel-suite.md) - Complete Milestones A and B: correct references, synchronized timing, raw samples, noise characterization, environment capture, operation and byte models, timeline traces and profiler evidence.

### Exit checkpoint

Audit and repair a misleading GPU benchmark, diagnose one correctness defect and classify three kernel regimes using independent references, synchronized raw trials, timelines, counters and a roofline model declared before profiling.

<details>
<summary>Deliberately left for later</summary>

- Large monitoring platforms and fleet-wide telemetry
- Collecting every profiler metric without a falsifiable question
- Cross-generation claims until one device has a complete reproducibility package

</details>

## GPU-4. CUDA Data Movement and Parallel Primitives

**Why:** Transpose, reduction, scan, histogram and softmax expose the recurring constraints behind larger kernels: memory layout, synchronization, work efficiency, atomics, numerical order and asynchronous lifetime.

### Learn this much

- [ ] Elementwise maps and grid-stride coverage _(Required)_
- [ ] Naive matrix transpose and requested memory transactions _(Required)_
- [ ] Shared-memory transpose tiling and coalesced reads and writes _(Required)_
- [ ] Bank-conflict diagnosis and padding or swizzle fixes _(Required)_
- [ ] Alignment-safe vectorized loads and stores _(Required)_
- [ ] Reduction trees, operation count and work efficiency _(Required)_
- [ ] Floating-point non-associativity and reduction tolerances _(Required)_
- [ ] Warp shuffle and warp-level reduction _(Required)_
- [ ] Block reduction, partials, atomics and multi-pass completion _(Required)_
- [ ] Zero, odd, tiny, large and nonmultiple lengths _(Required)_
- [ ] Kogge-Stone scan and work-depth trade-offs _(Required)_
- [ ] Brent-Kung scan and reduced work _(Required)_
- [ ] Decoupled look-back and single-pass scan _(Depth)_
- [ ] Segmented scan and boundary semantics _(Optional)_
- [ ] Histogram atomics, contention and collision distributions _(Required)_
- [ ] Privatization, aggregation and merge costs _(Required)_
- [ ] Predicate, scan and scatter for stream compaction _(Required)_
- [ ] Numerically stable online normalizer and softmax _(Required)_
- [ ] Extreme logits, all-masked rows and empty-row policy _(Required)_
- [ ] Thread coarsening, instruction work and memory reuse _(Required)_
- [ ] Pinned host memory and asynchronous transfers _(Required)_
- [ ] Streams, events, dependency graphs and buffer lifetime _(Required)_
- [ ] Copy and compute overlap with timeline proof _(Required)_
- [ ] CUDA graph capture, replay, update and eager fallback _(Required)_
- [ ] Shape, dtype, layout and device dispatch with validated fallback _(Required)_
- [ ] Race, divergent barrier, partial warp, stale buffer and mask defects _(Required)_
- [ ] GPU sorting and graph primitives _(Later)_

### Resource route

- **Primary - Course:** [Programming Massively Parallel Processors companion - parallel patterns](https://shop.elsevier.com/books/book-companion/9780323912310) - Use the official slides, labs and skeletons for histogram, reduction, scan, tiling and boundary handling. Choose one optional convolution, stencil, merge or sorting lab as a transfer problem.
- **Required - Lab:** [Efficient Matrix Transpose in CUDA C/C++](https://developer.nvidia.com/blog/efficient-matrix-transpose-cuda-cc/) - Rebuild copy, naive transpose, coalesced transpose and padded shared-memory variants. Update deprecated details for the installed toolkit and compare requested transactions, bank behavior and achieved bandwidth on odd as well as friendly shapes.
- **Required - Lab:** [Optimizing Parallel Reduction in CUDA](https://developer.download.nvidia.com/assets/cuda/files/reduction.pdf) - Implement the optimization sequence from interleaved addressing through sequential addressing, first-add-during-load, unrolling and warp-level completion. Correct outdated assumptions and retain the stage where each optimization stops helping.
- **Depth - Paper:** [Single-pass Parallel Prefix Scan with Decoupled Look-back](https://research.nvidia.com/sites/default/files/pubs/2016-03_Single-pass-Parallel-Prefix/nvr-2016-002.pdf) - Read after two-pass scans pass. Derive the state and progress argument, then implement or inspect a bounded version only if the available hardware and time support meaningful comparison.
- **Required - Paper:** [Online Normalizer Calculation for Softmax](https://arxiv.org/abs/1805.02867) - Derive the running maximum and normalizer recurrence, test extreme and all-masked rows, and compare materialized, two-pass and online implementations before using the recurrence inside attention.
- **Required - Practice:** [LeetGPU - CUDA Primitive Challenges](https://leetgpu.com/challenges/) - Solve challenge 3 Matrix Transpose, 4 Reduction, 5 Softmax, 13 Histogramming and 16 Prefix Sum in CUDA. Add 70 Segmented Prefix Sum or 72 Stream Compaction only after the required set. Keep local source, hidden-shape assumptions, hardware, raw timings and correctness evidence outside the leaderboard.
- **Support - Lectures:** [GPU MODE - Reductions and Scans](https://github.com/gpu-mode/lectures) - Use Lectures 9, 20, 21 and 24 after the PMPP implementations. Reproduce one faster scan or reduction idea and show the exact shape and device regime where it changes the bottleneck.
- **Support - Project:** [GPU Microbenchmark and Kernel Suite - CUDA Core](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/gpu-microbenchmark-kernel-suite.md) - Complete the CUDA vector map, reduction, transpose and stable softmax requirements plus seeded access, synchronization, mask, stream and numerical failures. Preserve library and framework baselines.

### Exit checkpoint

Implement and diagnose CUDA transpose, reduction, scan or histogram, and online softmax across adversarial tails and values, then prove a measured data-movement or synchronization improvement with profiler evidence and a retained losing regime.

<details>
<summary>Deliberately left for later</summary>

- A universal primitives library or fastest-on-one-shape leaderboard chase
- Sorting, graph analytics and domain-specific stencil libraries beyond one transfer exercise
- Using global synchronization or relaxed tolerances to hide an incorrect primitive

</details>

## GPU-5. GEMM, Tensor Cores and Low Precision

**Why:** Matrix multiplication is the central case study in co-designing data layout, reuse, instruction choice and asynchronous pipelines. Low precision adds scaling and numerical contracts that must remain visible behind impressive throughput numbers.

### Learn this much

- [ ] M, N, K, batch shapes and useful GEMM operations _(Required)_
- [ ] Naive thread-per-output GEMM and its traffic _(Required)_
- [ ] Shared-memory tiles and global-memory reuse _(Required)_
- [ ] Register tiles, thread coarsening and accumulator ownership _(Required)_
- [ ] CTA, warp and instruction-level hierarchical tiling _(Required)_
- [ ] Coalesced and vectorized matrix tile copies _(Required)_
- [ ] Shared-memory layouts, swizzles and bank conflicts _(Required)_
- [ ] Predication and boundary handling for arbitrary dimensions _(Required)_
- [ ] Registers, shared memory, occupancy and tile-size constraints _(Required)_
- [ ] cuBLAS or framework library baselines and dispatch context _(Required)_
- [ ] Tensor-core matrix multiply-accumulate model _(Required)_
- [ ] WMMA, MMA atoms and CuTe-level abstraction boundaries _(Required)_
- [ ] Operand fragments, layout ownership and accumulator layout _(Required)_
- [ ] Input, product, accumulation and output precision _(Required)_
- [ ] FP16, BF16 and TF32 range, precision and execution _(Required)_
- [ ] E4M3 and E5M2 encoding, range and exceptional values _(Required)_
- [ ] FP4 and microscaling formats with shared scale metadata _(Depth)_
- [ ] Tensor, channel, block and dynamic scale selection _(Required)_
- [ ] Quantization and accumulation error against task tolerances _(Required)_
- [ ] Asynchronous copy, multistage producer-consumer pipeline and barriers _(Required)_
- [ ] Tensor Memory Accelerator descriptors and data movement _(Depth)_
- [ ] Producer and consumer warp specialization _(Required)_
- [ ] Thread-block clusters and distributed shared memory _(Depth)_
- [ ] Persistent, grouped and mixture-of-experts GEMM _(Optional)_
- [ ] Bias, activation, scale and dequantization epilogue fusion _(Required)_
- [ ] Shape-aware tuning, dispatch and unseen-shape fallback _(Required)_
- [ ] Roofline, instruction, resource and end-to-end residual analysis _(Required)_

### Resource route

- **Primary - Implementation:** [AI Systems Performance Engineering companion - GEMM and pipelines](https://github.com/cfregly/ai-performance-engineering/tree/main/code) - Use the Chapter 9 and 10 labs for arithmetic intensity, microtiling, fusion, mixed precision, tensor cores, CUTLASS, PTX and asynchronous pipelines. Implement one portable tiled GEMM before architecture-specific variants.
- **Required - Lab:** [AI Systems Performance Engineering Companion - GEMM and Pipelines](https://github.com/cfregly/ai-performance-engineering/tree/main/code) - Inspect and run compatible baseline and optimized paths from code/ch09 and ch10. Verify whether each path is a custom kernel, compiler selection or library dispatch, then add an independent correctness and timing wrapper.
- **Required - Tutorial:** [CuTe GEMM Tutorial](https://docs.nvidia.com/cutlass/latest/media/docs/cpp/cute/0x_gemm_tutorial.html) - Work through tiling, layouts, copy atoms and MMA atoms. Draw the logical and physical ownership for one tile, then modify a shape or layout and verify both generated mapping and numerical output.
- **Required - Specification:** [OCP 8-bit Floating Point Specification](https://www.opencompute.org/documents/ocp-8-bit-floating-point-specification-ofp8-revision-1-1-final-pdf) - Study E4M3 and E5M2 encodings, exceptional values and conversion behavior. Build value-boundary tests and separate format correctness from the scaling policy chosen by a framework or kernel.
- **Required - Practice:** [LeetGPU - GEMM and Quantized Matmul Challenges](https://leetgpu.com/challenges/) - Solve 2 Matrix Multiplication and 22 GEMM, then choose 30 Batched Matrix Multiplication or 57 FP16 Batched Matmul. Attempt 32 INT8 Quantized Matmul or 81 INT4 Matmul only after scale and accumulator tests pass. Preserve local baselines and shape matrices.
- **Support - Lectures:** [GPU MODE - CUTLASS, Tensor Cores and CuTe](https://github.com/gpu-mode/lectures) - Use Lectures 15, 23, 36, 57, 86, 103 and 114 selectively. Pair each chosen lecture with one implemented layout, instruction or pipeline change and compare it against a vendor-library baseline.
- **Depth - Implementation:** [DeepGEMM](https://github.com/deepseek-ai/DeepGEMM) - After the portable GEMM passes, reconstruct one Hopper FP8 path from source, identify its hardware, layout and scaling assumptions, and test a bounded modification only on supported hardware. Do not generalize repository benchmarks to other shapes or GPUs.
- **Depth - Book:** [Modern GPU Programming for MLSys](https://mlc.ai/modern-gpu-programming-for-mlsys/) - Read the performance, data-layout, tensor-core, TMA, tensor-memory, barrier and GEMM chapters for a Blackwell-depth route. Execute only with sm_100a and the pinned TIRx toolchain; otherwise use it for derivation and code reading.

### Exit checkpoint

Build a correctness-gated tiled GEMM, explain its hierarchy and low-precision contract, compare it across representative shapes with a strong library baseline, and show profiler evidence for both its best regime and a regime where it loses.

<details>
<summary>Deliberately left for later</summary>

- Blackwell-only TMA, tensor-memory and cluster optimization without matching hardware
- A general GEMM library or unsupported claim of beating cuBLAS
- New low-precision training research beyond format, scaling and inference-kernel correctness

</details>

## GPU-6. Attention and Transformer Fusion

**Why:** Attention combines matrix multiplication, reduction, numerical stability, masks and expensive data movement. This stage derives the IO-aware algorithm, implements a bounded version and connects kernel behavior to prefill, decode and fused transformer operations.

### Learn this much

- [ ] Attention equations, head shapes and tensor layouts _(Required)_
- [ ] Prefill and decode attention shape and reuse regimes _(Required)_
- [ ] Materialized score and probability tensors and HBM traffic _(Required)_
- [ ] Running maximum, normalizer and output rescaling _(Required)_
- [ ] Query, key and value block tiling _(Required)_
- [ ] Causal, padding and arbitrary mask boundaries _(Required)_
- [ ] MHA, GQA and MQA head grouping and data reuse _(Required)_
- [ ] Accumulation, exponentials, rescaling and output tolerance _(Required)_
- [ ] FlashAttention IO complexity and memory hierarchy assumptions _(Required)_
- [ ] FlashAttention-2 work partitioning and occupancy _(Required)_
- [ ] FlashAttention-3 asynchronous movement and overlap _(Depth)_
- [ ] FlashAttention-4 Blackwell schedule and tensor memory _(Depth)_
- [ ] Backward attention state and recomputation _(Optional)_
- [ ] Variable-length and ragged attention _(Required)_
- [ ] Paged and decode attention address mapping _(Required)_
- [ ] Key-value append, gather, layout conversion and cache writes _(Required)_
- [ ] Quantized key-value loads and dequantization _(Optional)_
- [ ] Stable RMSNorm and LayerNorm reduction and fusion _(Required)_
- [ ] Rotary position embedding layout and fusion _(Required)_
- [ ] SwiGLU and MLP fusion boundaries _(Required)_
- [ ] Residual, norm, activation and scale epilogue fusion _(Required)_
- [ ] Compiler, framework and production attention-library baselines _(Required)_
- [ ] Sequence, head, batch, mask, dtype and alignment matrix _(Required)_
- [ ] Kernel gain translated to TTFT, TPOT, memory and goodput _(Required)_
- [ ] Small, decode-heavy, irregular and unsupported losing regimes _(Required)_
- [ ] Sparse and long-context attention algorithms _(Later)_

### Resource route

- **Primary - Paper:** [FlashAttention](https://arxiv.org/abs/2205.14135) - Read the IO-awareness argument, exact attention algorithm and complexity analysis. Derive the online state and block dataflow, then implement a reduced forward kernel or trace a trusted implementation across at least causal and noncausal cases.
- **Required - Paper:** [FlashAttention-2](https://arxiv.org/abs/2307.08691) - Study reduced non-matmul work, sequence parallelism and warp work partitioning. Compare the schedule with the first paper and predict which shapes benefit before checking measurements.
- **Required - Paper:** [Online Normalizer Calculation for Softmax](https://arxiv.org/abs/1805.02867) - Re-derive the recurrence inside tiled attention and prove rescaling correctness. Add extreme-logit, all-masked, odd-head and partial-tile tests before any performance comparison.
- **Required - Practice:** [LeetGPU - Attention and Transformer Challenges](https://leetgpu.com/challenges/) - Solve 6 Softmax Attention and 12 Multi-Head Attention or 53 Causal Attention. Then choose two of 50 RMS Normalization, 54 SwiGLU, 61 RoPE, 80 Grouped Query Attention, 83 Fused Residual Add RMS Norm and 84 SwiGLU MLP Block. Keep correctness tests beyond the hosted score.
- **Support - Implementation:** [FlashInfer](https://github.com/flashinfer-ai/flashinfer) - Inspect the attention, sampling and serving-kernel interfaces. Reconstruct one dispatch path and compare its layout and workspace contracts with your reduced kernel instead of copying the optimized implementation.
- **Support - Lectures:** [GPU MODE - Attention and Fused Kernels](https://github.com/gpu-mode/lectures) - Use Lectures 12, 13, 18, 36 and 40 for FlashAttention, Ring Attention, fusion, FlashAttention-3 and FlashInfer. Reproduce one schedule or fusion idea under the stage shape matrix and a strong baseline.
- **Depth - Paper:** [FlashAttention-3](https://arxiv.org/abs/2407.08608) - Study Hopper-specific asynchronous execution and low-precision design after the portable kernel. Implement only with the required architecture, and separate algorithmic from hardware-specific gains.
- **Depth - Book:** [Modern GPU Programming for MLSys - Flash Attention 4](https://mlc.ai/modern-gpu-programming-for-mlsys/) - Read the complete Blackwell attention chapter, including two MMAs, online softmax, causal masking and GQA. Run it only on compatible sm_100a hardware with the pinned TIRx stack; otherwise use the code for architecture reconstruction.

### Exit checkpoint

Derive and implement or reconstruct IO-aware attention with stable online softmax, causal and edge-tile correctness, then explain prefill and decode performance across a shape matrix and show one end-to-end gain plus one losing regime.

<details>
<summary>Deliberately left for later</summary>

- Full sparse-attention and long-context algorithm research
- FlashAttention-3 or FlashAttention-4 implementation without the matching architecture
- A complete production attention library outside the active integration bottleneck

</details>

## GPU-7. Triton, CuTe and Compiler Paths

**Why:** Modern kernel work spans CUDA, tile languages, template libraries and graph compilers. This stage implements the same mechanisms through multiple abstraction levels, inspects lowering and makes autotuning, dispatch and fallback correctness explicit.

### Learn this much

- [ ] Triton blocked-program and SPMD execution model _(Required)_
- [ ] Program IDs, logical tiles and launch grids _(Required)_
- [ ] Pointer, stride, block pointer and layout arithmetic _(Required)_
- [ ] Masked loads and stores with safe boundary behavior _(Required)_
- [ ] Triton reductions and numerical order _(Required)_
- [ ] Dot operations, input precision and accumulator behavior _(Required)_
- [ ] Compile-time meta-parameters and specialization _(Required)_
- [ ] Autotune configuration, keys, pruning and cache identity _(Required)_
- [ ] Correctness-gated candidates and invalid configuration rejection _(Required)_
- [ ] Compile, autotune, cold-cache and warm-cache accounting _(Required)_
- [ ] Registers, shared memory, occupancy and generated-code inspection _(Required)_
- [ ] Interpreter, assertions, sanitizer limits and minimal reproducers _(Required)_
- [ ] Matched CUDA and Triton implementations of the same kernel _(Required)_
- [ ] Frontend, IR, lowering, LLVM, PTX and machine-code trajectory _(Required)_
- [ ] Framework graph capture, fusion and generated-kernel boundaries _(Required)_
- [ ] Graph breaks, guards, recompilation and dynamic-shape behavior _(Required)_
- [ ] Custom operator registration, stream semantics and autograd contracts _(Required)_
- [ ] CUTLASS device, kernel, collective, tiled MMA and atom hierarchy _(Required)_
- [ ] CuTe layouts, coordinates, composition and logical division _(Required)_
- [ ] Copy and MMA atoms, tiled copies and tiled MMAs _(Required)_
- [ ] Pipeline stages, barriers and producer-consumer ownership _(Required)_
- [ ] CUDA Tile IR programming model and compiler-owned tiling _(Depth)_
- [ ] Pallas, ROCm and NKI programming-model comparison _(Optional)_
- [ ] Device, dtype, shape and layout dispatch with fallback _(Required)_
- [ ] Compiler-version, generated-code and performance regression tests _(Required)_
- [ ] Compiler pass or backend extension _(Later)_

### Resource route

- **Primary - Tutorial:** [Triton Programming Guide and Tutorials](https://triton-lang.org/main/getting-started/tutorials/) - Complete the vector add, fused softmax, matrix multiplication, LayerNorm and fused-attention tutorials that run on your hardware. For each, add adversarial tails, independent references, cold and warm timing, resource inspection and a correct fallback.
- **Required - Implementation:** [AI Systems Performance Engineering companion - compilers and Triton](https://github.com/cfregly/ai-performance-engineering/tree/main/code/ch14) - Use the Chapter 14 compiler and Triton labs to trace one framework operation from graph capture through generated GPU code. Identify graph breaks, phase boundaries and every specialization guard.
- **Support - Lab:** [AI Systems Performance Engineering Companion - Triton and Compiler Labs](https://github.com/cfregly/ai-performance-engineering/tree/main/code) - Use code/ch09, ch10, ch13 and ch14 selectively for Triton, warp specialization, persistent kernels and compiler comparisons. Strip local compatibility shims when diagnosing upstream failures and record every guard in the measurement context.
- **Required - Documentation:** [CUTLASS 3.x Design and CuTe Layout Algebra](https://docs.nvidia.com/cutlass/latest/media/docs/cpp/cutlass_3x_design.html) - Study the collective and kernel hierarchy, then the CuTe layout algebra guide. Reconstruct one GEMM configuration down to layouts, copy atoms and MMA atoms and compare it with the equivalent Triton blocked program.
- **Required - Practice:** [LeetGPU - CUDA and Triton Parity Set](https://leetgpu.com/challenges/) - Re-solve one primitive, one GEMM and one transformer challenge from GPU-4 through GPU-6 in Triton. Compare CUDA, Triton, compiler and library paths on identical tests and hardware; leaderboard rank does not replace local raw evidence.
- **Support - Lectures:** [GPU MODE - Triton, CuTe and Machine Code](https://github.com/gpu-mode/lectures) - Use Lectures 14, 15, 29, 37, 57, 86, 103, 104 and 114 selectively. Assign one lecture to each actual implementation question rather than watching the collection linearly.
- **Reference - Specification:** [PTX ISA and CUDA Binary Utilities](https://docs.nvidia.com/cuda/cuda-binary-utilities/) - Inspect generated PTX and SASS for the matched CUDA and Triton kernels. Check instruction, memory-space and target assumptions in the versioned ISA and use binary tools to confirm which device code ships.
- **Depth - Documentation:** [CUDA Tile IR Programming Model](https://docs.nvidia.com/cuda/tile-ir/latest/sections/prog_model.html) - Read the programming model and inspect the official repository after CUDA, Triton and CuTe mappings are clear. Implement one tiny parity kernel only if the toolchain supports it and record compiler-version constraints.
- **Depth - Book:** [Modern GPU Programming for MLSys - TIRx](https://mlc.ai/modern-gpu-programming-for-mlsys/) - Use Parts II and III plus the compiler reference as a Blackwell-specific comparison of layouts, dispatch, TMA pipelines and persistent scheduling. Do not make TIRx a required dependency for the portable track.

### Exit checkpoint

Implement the same nontrivial kernel in CUDA and Triton, reconstruct the lowering and resource behavior, correctness-gate autotuning and dispatch, and preserve compiler or library fallback across unseen shapes and one version change.

<details>
<summary>Deliberately left for later</summary>

- Collecting DSLs without a shared kernel and evidence contract
- Writing a complete compiler backend before generated-code inspection and dispatch are reliable
- Blackwell-only TIRx or CUDA Tile work when the required toolchain is unavailable

</details>

## GPU-8. Kernel-to-Inference Integration

**Why:** A fast isolated kernel matters only when the engine actually dispatches it and the request-level bottleneck moves. This stage integrates one custom path, traces scheduling and memory interactions, and measures TTFT, TPOT, goodput, memory and output quality together.

### Learn this much

- [ ] Framework operator, dispatcher, backend and kernel selection path _(Required)_
- [ ] PyTorch profiler, NVTX and CPU-GPU trace correlation _(Required)_
- [ ] Operator graph, fusion groups and generated kernels _(Required)_
- [ ] Launch overhead, CUDA graphs, bucketing and eager fallback _(Required)_
- [ ] Queue, prefill, decode, sample and completion lifecycle at performance depth _(Required)_
- [ ] Continuous batching effects on kernel shapes and occupancy _(Required)_
- [ ] Key-value allocation, paging, fragmentation and address mapping _(Required)_
- [ ] Prefix reuse, cache identity and kernel shape changes _(Required)_
- [ ] Chunked prefill, decode interference and kernel scheduling _(Required)_
- [ ] Weight, activation and key-value quantized kernel dispatch _(Required)_
- [ ] Speculative decoding verification cost and batch shape _(Required)_
- [ ] Structured decoding masks, CPU interaction and kernel gaps _(Required)_
- [ ] Fair scheduling and heterogeneous request sizes _(Required)_
- [ ] Long-context prefill and memory-capacity regimes _(Required)_
- [ ] Multimodal encoder and decoder co-execution _(Optional)_
- [ ] Custom operator build, registration, stream and lifetime contracts _(Required)_
- [ ] Workspace, metadata, layout, graph and capture-safe kernel interface _(Required)_
- [ ] vLLM, SGLang and FlashInfer component boundaries _(Required)_
- [ ] Token, distribution or task-quality equivalence after optimization _(Required)_
- [ ] Endpoint-derived shape and arrival distribution _(Required)_
- [ ] TTFT, TPOT, memory, throughput and goodput measurement _(Required)_
- [ ] Production engine and vendor-library baseline _(Required)_
- [ ] Attribution from kernel change to request-level effect _(Required)_
- [ ] Dispatch overhead, graph misses and workload-weighted losing regimes _(Required)_
- [ ] Versioned regression gate, fallback and rollback _(Required)_
- [ ] Complete scheduler, cache and serving-platform implementation _(Later)_

### Resource route

- **Primary - Implementation:** [AI Systems Performance Engineering companion - PyTorch and inference](https://github.com/cfregly/ai-performance-engineering/tree/main/code) - Use selected Chapter 13, 15 and 16 labs for PyTorch profiling and compilation, attention, quantization, streams, graphs, parallelism, decoding, routing and inference profiling. Keep Chapter 17 through 19 experiments for GPU-9 or depth.
- **Required - Lab:** [AI Systems Performance Engineering Companion - Inference Paths](https://github.com/cfregly/ai-performance-engineering/tree/main/code) - Use compatible examples from code/ch12 through ch16. Trace whether each optimized path changes a kernel, graph, compiler choice, scheduler or library dispatch, then integrate one bounded custom path into a realistic operator or small endpoint.
- **Required - Guide:** [AI Performance Engineering - Inference Engines](https://github.com/wafer-ai/gpu-perf-engineering-resources) - Use Section 4 to select the mechanism relevant to the measured bottleneck: continuous batching, paged key-value memory, quantization, speculative decoding, structured decoding or long-context inference. Read the introducing paper and implementation, not every item.
- **Required - Paper:** [PagedAttention and vLLM](https://arxiv.org/html/2309.06180) - Study block-based key-value allocation, sharing and scheduling interaction. Trace logical token positions to physical blocks in one engine run and quantify fragmentation and memory-capacity effects.
- **Support - Paper:** [SGLang](https://arxiv.org/html/2312.07104) - Read the runtime and RadixAttention design, then inspect the repository path for one kernel or prefix-reuse interaction. Use it as an alternative architecture in the integration defense.
- **Required - Practice:** [LeetGPU - Inference Kernel Set](https://leetgpu.com/challenges/) - Choose three bottleneck-matched challenges from 74 GPT-2 Block, 83 Fused Residual Add RMS Norm, 84 SwiGLU MLP Block, 87 Speculative Decoding Verification, 93 Llama Transformer Block and 96 INT8 KV Cache Attention. Integrate one result locally rather than stopping at the hosted submission.
- **Support - Implementation:** [FlashInfer](https://github.com/flashinfer-ai/flashinfer) - Use the repository as the serving-kernel baseline and interface reference. Reconstruct workspace planning, layouts, dispatch and stream behavior for one selected operation before comparing your path.
- **Support - Project:** [GPU Microbenchmark and Kernel Suite - Integration](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/gpu-microbenchmark-kernel-suite.md) - Complete the real tensor or model-operation integration, dispatch and fallback requirements. Report compilation and invocation overhead, workload frequency, correctness or quality and the end-to-end no-benefit regime.

### Exit checkpoint

Integrate one custom CUDA or Triton path into a real operator or small inference endpoint, prove dispatch and rollback, and show request-level TTFT, TPOT, memory, goodput and quality effects across the real shape distribution.

<details>
<summary>Deliberately left for later</summary>

- Reimplementing the full scheduler, key-value manager or production serving platform already owned by the Inference track
- Every quantization, speculative decoding and long-context method in the resource index
- Endpoint speed claims inferred from an isolated friendly-shape kernel

</details>

## GPU-9. Multi-GPU Communication and Distributed Inference Performance

**Why:** Beyond one GPU, topology, collective algorithms, transfer paths and load balance determine whether kernel gains survive. This stage models communication, profiles overlap and studies distributed inference mechanisms without duplicating full training or serving-platform ownership.

### Learn this much

- [ ] PCIe, NVLink, NVSwitch and intra-node topology _(Required)_
- [ ] NICs, RDMA, InfiniBand or Ethernet and scale-out topology _(Required)_
- [ ] Directional bandwidth, latency, contention and topology assumptions _(Required)_
- [ ] Rank, group, shape, dtype and ordering contracts _(Required)_
- [ ] Latency-bandwidth cost model and message-size crossover _(Required)_
- [ ] Ring and tree all-reduce algorithms _(Required)_
- [ ] All-gather and reduce-scatter communication volume _(Required)_
- [ ] All-to-all and mixture-of-experts dispatch traffic _(Required)_
- [ ] NCCL algorithms, protocols, channels and topology selection _(Required)_
- [ ] Rank, tensor, expert and process placement on fast links _(Required)_
- [ ] Compute-communication overlap and exposed communication _(Required)_
- [ ] Communication streams, events and buffer lifetime _(Required)_
- [ ] Rank-aligned timelines, collective sequence and straggler attribution _(Required)_
- [ ] Link congestion, shared-fabric interference and tail behavior _(Required)_
- [ ] Mixture-of-experts dispatch, combine and communication kernels _(Required)_
- [ ] Token skew, hot experts and load-balanced placement _(Required)_
- [ ] Prefill and decode disaggregation as a performance mechanism _(Required)_
- [ ] Key-value transfer bytes, bandwidth, latency and crossover _(Required)_
- [ ] NIXL and connector data-path identity _(Required)_
- [ ] DistServe, Splitwise and Mooncake architectural trade-offs _(Required)_
- [ ] Collective timeout, partial failure, retry and invalid measurement _(Required)_
- [ ] Single-node and multi-node bandwidth, latency, clocks and raw-result contract _(Required)_
- [ ] Analytical and CPU simulation when multiple GPUs are unavailable _(Required)_
- [ ] Custom collective, NVSHMEM or fused communication-compute kernel _(Depth)_
- [ ] Training parallel strategy and fault-tolerant pipeline ownership _(Later)_
- [ ] Cluster scheduler and production fleet orchestration _(Later)_

### Resource route

- **Primary - Implementation:** [AI Systems Performance Engineering companion - communication and disaggregation](https://github.com/cfregly/ai-performance-engineering/tree/main/code) - Use the Chapter 4, 15, 17 and 18 labs for communication-compute overlap, NCCL, MoE parallelism, prefill-decode disaggregation and KV transfer. Re-derive every volume and crossover for the hardware tier actually available.
- **Support - Lab:** [AI Systems Performance Engineering Companion - Multi-GPU Labs](https://github.com/cfregly/ai-performance-engineering/tree/main/code) - Use compatible examples from code/ch04, ch15 and ch17 for NCCL, topology, overlap and disaggregated inference. Run preflight checks, lock and record clocks through the harness, and mark unsupported transport or topology paths as explicit blockers.
- **Required - Guide:** [AI Performance Engineering - Distributed Inference](https://github.com/wafer-ai/gpu-perf-engineering-resources) - Use Section 5 to select primary papers and implementations for collectives, MoE serving, disaggregation, production routing and serving benchmarks. Keep the resource selection tied to one measured communication bottleneck.
- **Required - Implementation:** [NCCL](https://github.com/NVIDIA/nccl) - Study the collective API, communicator and topology behavior, then run a bounded nccl-tests message-size sweep when multiple GPUs are available. Correlate algorithm bandwidth, bus bandwidth and rank timelines with the $`\alpha`$-$`\beta`$ model.
- **Support - Lectures:** [GPU MODE - Collective Communication](https://github.com/gpu-mode/lectures) - Use Lectures 17, 67, 70 and 78 for NCCL, NVSHMEM, fault-tolerant collectives and multi-GPU Triton. Implement or inspect one communication mechanism only after the volume and topology model is written.
- **Required - Paper:** [DistServe](https://arxiv.org/html/2401.09670) - Study prefill-decode interference, phase-specific parallelism and goodput optimization. Build a small simulator or measured two-pool experiment and test the key-value transfer crossover rather than reproducing the complete serving system.
- **Support - Implementation:** [NVIDIA Inference Xfer Library](https://github.com/ai-dynamo/nixl) - Inspect memory registration, transfer backends and metadata APIs as the state-movement layer for disaggregation. Run only supported local transports and compare measured transfer setup and steady-state cost with the model.
- **Depth - Implementation:** [DeepEP](https://github.com/deepseek-ai/DeepEP) - Reconstruct expert dispatch and combine paths, low-latency versus high-throughput modes and hardware assumptions. Test a small supported path only after a standard collective baseline and load-skew model exist.

### Exit checkpoint

Model and measure one collective or key-value transfer path across message sizes and topology, align multi-rank traces, quantify exposed communication or disaggregation crossover, and retain a single-GPU analytical route when hardware blocks execution.

<details>
<summary>Deliberately left for later</summary>

- Full distributed-training strategy, sharding and checkpointing already owned by Distributed Training
- Full serving scheduler, request identity and production disaggregation already owned by Inference
- Custom transport, collective or multi-node claims without the required hardware and topology evidence

</details>

## GPU-10. Portability, Benchmark Audit and Performance Research

**Why:** The final stage turns isolated optimizations into defensible engineering. It audits benchmark validity, handles architecture and compiler change, modifies a real kernel or compiler path, and reports workload-weighted gains, losses and portability limits.

### Learn this much

- [ ] Architecture brief, tuning guide, ISA and counter documentation as separate evidence _(Required)_
- [ ] Hopper, Blackwell and later NVIDIA capability differences _(Required)_
- [ ] AMD CDNA, ROCm counters and implementation vocabulary _(Optional)_
- [ ] TPU hardware model and Pallas kernel vocabulary _(Depth)_
- [ ] Trainium architecture and NKI kernel vocabulary _(Depth)_
- [ ] Device, compiler, library and feature capability matrix _(Required)_
- [ ] Correct fallback, unsupported-path errors and compatibility tests _(Required)_
- [ ] Vendor peak numbers as analytical bounds, not measurements _(Required)_
- [ ] Offline, server, single-stream and interactive scenario boundaries _(Required)_
- [ ] MLPerf scenario, load-generation and result-boundary vocabulary _(Required)_
- [ ] Endpoint goodput under latency and correctness constraints _(Required)_
- [ ] Production-like arrival, length and burst distributions _(Required)_
- [ ] Timing, baseline, workload, correctness and cherry-picking audit _(Required)_
- [ ] Baseline parity in precision, algorithm, compiler flags and allowed libraries _(Required)_
- [ ] KernelBench task, correctness and speedup contract _(Required)_
- [ ] Hardened correctness, baseline parity and evaluator coverage _(Required)_
- [ ] Hardware speed-of-light bound and attainable efficiency _(Required)_
- [ ] AI-generated kernel reward hacking, undefined behavior and narrow tests _(Required)_
- [ ] Held-out shapes, values, devices and compiler versions _(Required)_
- [ ] Reconstruction of a real kernel, compiler or communication dispatch path _(Required)_
- [ ] One bounded change with a predeclared mechanism hypothesis _(Required)_
- [ ] Correctness, performance, dispatch, fallback and rollback protection _(Required)_
- [ ] Clean build, environment lock and independent reproduction _(Required)_
- [ ] Claim-to-code, raw result, trace, counter and report links _(Required)_
- [ ] Workload-weighted endpoint or training-step impact _(Required)_
- [ ] Negative result, losing regime and portability limit _(Required)_
- [ ] Defense against stronger baselines, alternate explanations and maintenance cost _(Required)_
- [ ] AI-assisted kernel generation and adaptive runtime tuning _(Depth)_
- [ ] Unshipped hardware and unreproduced frontier claims _(Later)_

### Resource route

- **Primary - Guide:** [AI Performance Engineering - Hardware, Frontier and Source Policy](https://github.com/wafer-ai/gpu-perf-engineering-resources) - Use Section 6 and Frontier as a dated map, then apply the Source Policy to every final claim. Select one available architecture and one optional comparison, verify against its current tuning or ISA documentation, and exclude watchlist items that lack shipped systems and reproducible measurements.
- **Required - Implementation:** [AI Systems Performance Engineering companion - adaptive optimization](https://github.com/cfregly/ai-performance-engineering/tree/main/code) - Use the Chapter 19 and 20 labs plus the repository checklists to study adaptive kernel and memory policy, assisted optimization and reproducible performance work. Treat every performance number as a hypothesis requiring your own evidence.
- **Required - Project:** [GPU Microbenchmark and Kernel Suite - Final Evaluation](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/gpu-microbenchmark-kernel-suite.md) - Complete Milestones C through F: CUDA and Triton kernel suite, failure injection, model-versus-profile reconciliation, strong baselines, real integration, full shape matrix, dispatch and fallback defense, clean reproduction and negative results.
- **Support - Assessment:** [Performance Engineering and GPU Programming Checkpoint](https://github.com/saisandeshk/Roadmap-Final/blob/main/checkpoints/performance-gpu-programming.md) - Use the checkpoint as the final adversarial assessment after the source-derived route. Pass the real kernel, compiler or communication modification and end-to-end evidence clauses; ignore its ordering where it conflicts with this track.
- **Required - Benchmark:** [KernelBench-Verified](https://arxiv.org/html/2607.16241) - Study the evaluator hardening and baseline-parity failures found in the original benchmark. Run a very small task slice or port its adversarial testing ideas into the project evaluator; do not optimize for aggregate benchmark score.
- **Support - Benchmark:** [SOL-ExecBench](https://github.com/nvidia/sol-execbench) - Inspect how correctness and performance are compared with a hardware speed-of-light model. Apply one attainable-efficiency analysis to a project kernel and explain missing hardware or model assumptions.
- **Support - Benchmark:** [MLPerf Endpoints](https://mlcommons.org/benchmarks/endpoints/) - Read the endpoint-level scenario and load-generation rules. Borrow the workload and result-boundary discipline for the integrated benchmark without claiming an official MLPerf result.
- **Reference - Documentation:** [CUDA Toolkit and Architecture Tuning Guides](https://docs.nvidia.com/cuda/) - Use the current toolkit root, release notes and the tuning guide matching the measured GPU. Pin the document and toolkit versions, verify capability checks and rerun any claim affected by compiler or architecture change.
- **Depth - Book:** [Modern GPU Programming for MLSys](https://mlc.ai/modern-gpu-programming-for-mlsys/) - Use the Blackwell GEMM and Flash Attention path as a real architecture-specific reconstruction target if compatible hardware is available. Otherwise produce a static mechanism audit and leave all performance claims open.

### Exit checkpoint

Reconstruct and modify one real kernel, compiler or communication path, pass hardened correctness and held-out workload tests, validate a performance model, show workload-weighted end-to-end impact, and defend negative regimes, fallback and portability limits from a clean reproduction.

<details>
<summary>Deliberately left for later</summary>

- Unshipped hardware, vendor roadmap claims and unreproduced AI-kernel leaderboards
- A universal compiler, kernel library or cross-vendor backend
- Production rollout beyond the available hardware and independently reproduced evidence

</details>

## Track milestone

### Kernel-to-System Performance Laboratory

Carry one transformer operation and one realistic inference workload through a single evidence repository, from arithmetic and benchmark design through CUDA and Triton kernels, compiler and engine integration, communication analysis and a final architecture-aware extension.

- A correctness-first performance laboratory with hardware and software manifests, independent framework or CPU references, synchronized cold and warm benchmarks, raw interleaved trials, operation and byte models, roofline analysis, Nsight timelines and counters, sanitizer regressions and a repaired misleading benchmark.
- A CUDA and Triton kernel suite containing data movement, reduction or scan, stable softmax, tiled GEMM and one attention or fused transformer path; LeetGPU challenge evidence; adversarial shape, stride, dtype, mask, numerical and asynchronous tests; strong library and compiler baselines; autotuning, dispatch and correct fallback; and retained losing regimes.
- A real kernel-to-inference or communication integration with TTFT, TPOT, memory, goodput and quality evidence; one reconstructed and modified production kernel, compiler or collective path; held-out and portability tests; a clean reproduction package; claim-to-artifact links; a workload-weighted gain; and an honest negative result.

