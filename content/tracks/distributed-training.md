<!-- Generated from content/curriculum.json. Edit the JSON and run npm run content:generate. -->

# 04. ML Systems & Distributed Training

**Level:** Advanced specialization  
**Scope:** 10 track stages · 221 required topics · 42 optional, depth, or later topics

Build distributed training systems from state and collective semantics upward: deterministic input and restart, communication, DDP and FSDP, model parallelism, composed plans, recovery, profiling and fleet operation. CPU multiprocess evidence is sufficient for correctness gates; GPU and cluster claims require the topology on which they were measured.

## Order

DT-1. Training Pipeline and Framework Internals
DT-2. Ranks, Collectives and Topology
DT-3. Data Parallelism and Overlap
DT-4. ZeRO and Fully Sharded Training
DT-5. Tensor, Sequence and Context Parallelism
DT-6. Pipeline Parallelism
DT-7. Expert Parallelism and Mixture of Experts
DT-8. Multidimensional Parallel Planning
DT-9. Checkpointing and Fault Tolerance
DT-10. Performance and Fleet Operation

## DT-1. Training Pipeline and Framework Internals

**Why:** Distributed execution magnifies any ambiguity in data order, state ownership, precision or timing. First make one training step observable, reproducible and restartable before adding ranks.

### Learn this much

- [ ] Launch configuration, immutable run identity and environment capture _(Required)_
- [ ] Dataset manifests, versions and document-to-batch lineage _(Required)_
- [ ] Deterministic shuffle, shards, workers and sampler position _(Required)_
- [ ] Microbatch, gradient accumulation, global batch and token accounting _(Required)_
- [ ] Model parameters, buffers, gradients and optimizer state ownership _(Required)_
- [ ] Autograd graph creation, backward scheduling and saved tensors _(Required)_
- [ ] Gradient hooks, readiness order and synchronization side effects _(Required)_
- [ ] Gradient accumulation, zeroing and optimizer update semantics _(Required)_
- [ ] Scheduler, scaler, RNG and dataloader state _(Required)_
- [ ] FP32, TF32, BF16 and FP16 state and accumulation choices _(Required)_
- [ ] Mixed-precision autocast and loss scaling failure modes _(Required)_
- [ ] Persistent, activation, temporary and allocator memory accounting _(Required)_
- [ ] Activation checkpointing and recomputation trade-offs _(Required)_
- [ ] Input, transfer, forward, backward, optimizer and checkpoint timelines _(Required)_
- [ ] Warmup, synchronization and repeated-trial benchmark hygiene _(Required)_
- [ ] PyTorch profiler, memory snapshots and NVTX ranges _(Required)_
- [ ] torch.compile graph boundaries, recompilation and graph breaks _(Required)_
- [ ] Checkpoint contents, compatibility and exact resume state _(Required)_
- [ ] Tiny deterministic fixtures for fast systems debugging _(Required)_
- [ ] Framework contracts for setup, step, save, load and teardown _(Required)_
- [ ] Custom autograd Function with explicit forward and backward _(Optional)_
- [ ] Selective activation checkpoint policy _(Optional)_
- [ ] Compiler and autograd internals below public PyTorch APIs _(Depth)_
- [ ] Full production data platform and experiment service _(Later)_

### Resource route

- **Primary - Book:** [Machine Learning Systems Volume I - Chapters 7, 8 and 12](https://mlsysbook.ai/vol1/) - Read Chapter 7 for framework execution and state, Chapter 8 for the training pipeline and checkpoint lifecycle, and Sections 12.1, 12.4, 12.5, 12.7 and 12.10 for benchmark design. Convert the reading into a state-ownership table and a deterministic train-resume trace before starting the CS336 exercises.
- **Required - Assignment:** [CS336 Assignment 2 - Systems, Sections 2 and 3](https://github.com/stanford-cs336/assignment2-systems) - Complete the benchmarking, profiling, memory-accounting and activation-checkpointing portions on tiny configurations. Write your own solution and retain timing tables, memory predictions and failure notes; the FlashAttention leaderboard and large GPU runs are outside this stage.
- **Required - Lab:** [Distributed Training Guide - Chapter 1 and Related Topics](https://github.com/LambdaLabsML/distributed-training-guide) - Trace 01-single-gpu/train_llm.py end to end, then apply Related Topics on determinism, gradient accumulation and optimized data loading. Produce a state-ownership table and prove identical data order and optimizer trajectory after a controlled interruption.
- **Required - Reference:** [Machine Learning Engineering Open Book - Training and PyTorch Debugging](https://github.com/stas00/ml-engineering) - Read training/README.md, training/dtype.md, training/reproducibility/README.md and the tiny-model, memory and profiling sections of debug/pytorch.md. Use its commands as a field checklist while diagnosing your own loop.
- **Support - Reference:** [PyTorch Profiler Recipes](https://docs.pytorch.org/tutorials/recipes/recipes/profiler_recipe.html) - Use the profiler, memory snapshot and benchmark recipes only when the CS336 handout calls for them. Annotate one complete step and explain every visible gap or synchronization event.
- **Support - Project:** [Distributed Training Subsystem](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-3/distributed-training-subsystem.md) - Start Milestone A with the deterministic sampler, state manifest, event trace and single-process oracle. Keep extending this repository through DT-9.

### Exit checkpoint

Interrupt and resume a tiny run with identical data order and optimizer trajectory, account for every major memory category, and diagnose one hidden synchronization or retained-state failure from a step trace.

<details>
<summary>Deliberately left for later</summary>

- Custom FlashAttention kernels and leaderboard-scale profiling
- Production experiment tracking and feature stores
- Compiler internals beyond locating and explaining graph breaks

</details>

## DT-2. Ranks, Collectives and Topology

**Why:** Every higher parallel strategy reduces to ordered communication among named groups. Exact tensor ownership, collective order and a simple cost model turn hangs and slowdowns into diagnosable mechanisms.

### Learn this much

- [ ] Processes, global rank, local rank and world size _(Required)_
- [ ] Rendezvous, stores, launchers and process-group lifecycle _(Required)_
- [ ] Default and nested process groups _(Required)_
- [ ] Device placement and one-process-per-device convention _(Required)_
- [ ] Point-to-point send and receive semantics _(Required)_
- [ ] Broadcast and reduce ownership semantics _(Required)_
- [ ] All-reduce semantics and gradient averaging _(Required)_
- [ ] All-gather and reduce-scatter duality _(Required)_
- [ ] All-to-all and token exchange semantics _(Required)_
- [ ] Barrier use, misuse and implicit synchronization _(Required)_
- [ ] Collective ordering and shape or dtype agreement _(Required)_
- [ ] Synchronous calls, asynchronous handles and completion _(Required)_
- [ ] CUDA streams, events and dependency ordering _(Required)_
- [ ] Ring and tree collective algorithms _(Required)_
- [ ] Latency, bandwidth and $`\alpha`$-$`\beta`$ cost models _(Required)_
- [ ] Per-rank byte volume and critical-path derivation _(Required)_
- [ ] PCIe, NVLink, NVSwitch, NIC and node topology vocabulary _(Required)_
- [ ] NCCL and Gloo backend roles and constraints _(Required)_
- [ ] Message-size effects, contention and effective bandwidth _(Required)_
- [ ] Rank-local structured logs and collective sequence numbers _(Required)_
- [ ] Timeout, abort, teardown and orphan-process behavior _(Required)_
- [ ] CPU multiprocess collective correctness testing _(Required)_
- [ ] Hierarchical collectives across nodes and devices _(Optional)_
- [ ] Communication compression with accuracy controls _(Optional)_
- [ ] NCCL algorithm and protocol tuning internals _(Depth)_
- [ ] Custom transport or collective library implementation _(Later)_

### Resource route

- **Primary - Interactive book:** [Ultra-Scale Playbook - Parallel Programming Crash Course](https://nanotron-ultrascale-playbook.static.hf.space/index.html#parallel-programming-crash-course) - Read A0 from process launch and ranks through point-to-point communication, broadcast, all-reduce, all-gather, reduce-scatter and asynchronous operations. Reproduce every small torch.distributed example on Gloo and annotate tensor ownership before moving to higher parallelism.
- **Required - Theory:** [Machine Learning Systems Volume II - Chapters 5 and 6](https://mlsysbook.ai/vol2/) - Read Sections 5.1 to 5.3 for the distributed step and data-parallel communication, then Chapter 6 through collective primitives, FSDP patterns, ring, tree and algorithm crossover. Use its equations to derive one communication budget; return to Sections 5.5, 5.7 and 5.9 during DT-8.
- **Required - Course:** [Building a Distributed Training Framework from First Principles](https://www.youtube.com/watch?v=XoGvCBRnwLs) - Watch only 04:32:59 for autograd and distributed mathematics, 05:04:19 for distributed graphs and DDP, 09:48:52 for collectives, and 10:49:41 for DeviceMesh, DDP and FSDP. Pause after each segment to reproduce the rank and tensor transitions with CPU torchrun; the nearly twenty-hour full video is not required.
- **Required - Implementation:** [Picotron - Process Groups and Communication Files](https://github.com/huggingface/picotron) - Trace picotron/process_group_manager.py plus tp_communications.py, pp_communications.py and cp_communications.py. Draw every group, rank coordinate and tensor transfer for one 2 x 2 layout, then add a failing collective-order test in your own project.
- **Required - Reference:** [Machine Learning Engineering Open Book - Communication Patterns](https://github.com/stas00/ml-engineering) - Read network/comms.md from point-to-point through ring all-reduce, then network/README.md and debug/nccl-performance-debug.md selectively. Derive bytes and steps before running its small benchmarks.
- **Required - Lab:** [PyTorch Distributed Tutorials](https://docs.pytorch.org/tutorials/distributed.html) - Complete Getting Started with Distributed Data Parallel only through process-group setup and basic collectives, then adapt the examples to test broadcast, all-reduce, all-gather, reduce-scatter and all-to-all on Gloo.
- **Support - Lab:** [AI Systems Performance Engineering - Chapter 4 Code](https://github.com/cfregly/ai-performance-engineering/tree/main/code/ch04) - Run only the CPU-safe baseline communication and all-reduce examples first. On suitable GPUs, use bandwidth_benchmark_suite_multigpu.py and nccl_benchmark.py to compare predicted and measured link behavior; label the exact topology.

### Exit checkpoint

Simulate and test the five core collectives across multiple CPU processes, match results to tensor-ownership invariants, validate one cost prediction, and diagnose three injected rank, order or metadata mismatches.

<details>
<summary>Deliberately left for later</summary>

- Hand-tuned NCCL algorithms and custom transports
- Cluster claims without measured multi-node hardware
- Lossy gradient compression beyond a controlled accuracy study

</details>

## DT-3. Data Parallelism and Overlap

**Why:** Data parallelism is the cleanest place to prove distributed optimization equivalence. It also exposes the central performance pattern of making communication begin as gradients become ready.

### Learn this much

- [ ] Replicated parameters and optimizer state _(Required)_
- [ ] Disjoint data ownership and DistributedSampler invariants _(Required)_
- [ ] Local loss, gradient sum or average and update equivalence _(Required)_
- [ ] Global batch under workers and gradient accumulation _(Required)_
- [ ] Minimal data parallelism with explicit all-reduce _(Required)_
- [ ] PyTorch DDP construction and parameter registration _(Required)_
- [ ] Reducer buckets and reverse gradient-ready order _(Required)_
- [ ] Bucket size, launch count and exposed communication _(Required)_
- [ ] Autograd hooks and compute-communication overlap _(Required)_
- [ ] Gradient accumulation with no_sync _(Required)_
- [ ] Unused parameters and static versus dynamic graphs _(Required)_
- [ ] Divergent control flow and collective mismatch _(Required)_
- [ ] Rank-consistent loss and metric reduction _(Required)_
- [ ] Distributed batch normalization vocabulary and limits _(Required)_
- [ ] Communication hooks and compression contracts _(Required)_
- [ ] Slow data ranks and compute stragglers _(Required)_
- [ ] Single-process numerical oracle and tolerance policy _(Required)_
- [ ] Weak scaling, strong scaling and parallel efficiency _(Required)_
- [ ] Warmup, fixed global work and synchronized timing _(Required)_
- [ ] Gradient-ready and bucket timeline instrumentation _(Required)_
- [ ] Failure cleanup and rank-attributed logs _(Required)_
- [ ] Hierarchical data parallelism within and across nodes _(Optional)_
- [ ] PowerSGD or low-precision communication hook experiment _(Optional)_
- [ ] Custom DDP reducer implementation _(Depth)_
- [ ] Asynchronous or stale-gradient optimization algorithms _(Later)_

### Resource route

- **Primary - Assignment:** [CS336 Assignment 2 - Section 5 Distributed Data Parallel Training](https://github.com/stanford-cs336/assignment2-systems) - Complete the naive DDP, bucketed communication and overlap problems using your own implementation. Use small local cases for correctness; keep benchmark methodology and written derivations even when multiple GPUs are unavailable.
- **Required - Implementation:** [Picotron - Data Parallelism](https://github.com/huggingface/picotron) - Read data_parallel/data_parallel.py and bucket.py beside train.py. Recreate the naive all-reduce path first, then the bucketed overlap path; test equality against one process and log gradient-ready, collective-start and collective-end events.
- **Required - Lab:** [Distributed Training Guide - Chapter 2 DDP](https://github.com/LambdaLabsML/distributed-training-guide) - Apply Chapter 2 to a tiny causal-LM loop, including torchrun, rank-aware logs, DistributedSampler, rank-zero side effects and ZeRO optimizer vocabulary. Add the gradient-accumulation and effective-batch related topics.
- **Required - Theory:** [Ultra-Scale Playbook - Data Parallelism and ZeRO-1](https://nanotron-ultrascale-playbook.static.hf.space/index.html#data_parallelism) - Read from Data Parallelism through the first ZeRO optimizer-state discussion. Derive replicated-state memory, gradient communication and batch constraints for your tiny model before measuring it.
- **Support - Reference:** [PyTorch DDP Tutorial and API Notes](https://docs.pytorch.org/tutorials/intermediate/ddp_tutorial.html) - Use the DDP tutorial to verify public API behavior for setup, DistributedSampler, no_sync, unused parameters and teardown. Consult it after the from-scratch path so wrappers do not replace the mechanism model.
- **Support - Lab:** [AI Systems Performance Engineering - DDP Overlap Labs](https://github.com/cfregly/ai-performance-engineering/tree/main/code/ch04) - Compare ch04/ddp_no_overlap.py, ddp_overlap.py and the paired baseline and optimized data-parallel scripts. Run CPU-safe logic tests locally and reserve multi-GPU speed claims for an identified GPU topology.

### Exit checkpoint

Match one-process updates with two-process DDP under fixed global batch, prove sampler disjointness, show a gradient-bucket timeline, and explain a measured or simulated case where overlap does and does not help.

<details>
<summary>Deliberately left for later</summary>

- Exotic decentralized and asynchronous optimizers
- Compression claims without convergence evidence
- Large-node scaling until the same correctness suite passes locally

</details>

## DT-4. ZeRO and Fully Sharded Training

**Why:** Sharded training changes when parameters, gradients and optimizer state exist on each rank. Exact gather, reduce-scatter and reshard boundaries are needed to reason about memory, communication and checkpoints.

### Learn this much

- [ ] Replicated data parallel memory baseline by dtype _(Required)_
- [ ] ZeRO-1 optimizer-state partitioning _(Required)_
- [ ] ZeRO-2 gradient and optimizer-state partitioning _(Required)_
- [ ] ZeRO-3 parameter, gradient and optimizer-state partitioning _(Required)_
- [ ] Parameter all-gather before computation _(Required)_
- [ ] Gradient reduce-scatter after backward _(Required)_
- [ ] Reshard-after-forward policies _(Required)_
- [ ] Flat parameters, handles and original-parameter views _(Required)_
- [ ] Module wrapping and sharding granularity _(Required)_
- [ ] Forward and backward prefetch ordering _(Required)_
- [ ] Mixed parameter and reduction dtypes _(Required)_
- [ ] Activation checkpointing interaction with FSDP _(Required)_
- [ ] CPU and storage offload trade-offs _(Required)_
- [ ] Meta-device and deferred parameter initialization _(Required)_
- [ ] Peak memory from live parameter and activation windows _(Required)_
- [ ] Communication volume and exposed collectives _(Required)_
- [ ] Full, local and sharded state dictionaries _(Required)_
- [ ] Optimizer-state save and load under sharding _(Required)_
- [ ] Checkpoint consolidation and world-size resharding _(Required)_
- [ ] Single-process equivalence and rank-local state tests _(Required)_
- [ ] Auto-wrap mistakes, OOMs and unexpected replication _(Required)_
- [ ] Hybrid sharded data parallel vocabulary _(Required)_
- [ ] Selective offload and activation-aware wrapping study _(Optional)_
- [ ] FSDP2 DTensor-native configuration _(Optional)_
- [ ] Custom sharded optimizer and flat-parameter runtime _(Depth)_
- [ ] Framework-specific ZeRO extensions beyond PyTorch behavior _(Later)_

### Resource route

- **Primary - Assignment:** [CS336 Assignment 2 - Optimizer State Sharding and FSDP](https://github.com/stanford-cs336/assignment2-systems) - Complete Section 6 optimizer-state sharding and the fully sharded implementation and accounting problems with your own code. For each variant, predict per-rank state, peak live tensors and collective bytes before testing tiny cases.
- **Required - Theory:** [Ultra-Scale Playbook - ZeRO-1, ZeRO-2, ZeRO-3 and FSDP](https://nanotron-ultrascale-playbook.static.hf.space/index.html#zero_1) - Read the full ZeRO progression and FSDP discussion. Reproduce the memory diagrams for one transformer layer and annotate every all-gather, reduce-scatter and reshard boundary.
- **Required - Lab:** [Distributed Training Guide - Chapter 4 FSDP](https://github.com/LambdaLabsML/distributed-training-guide) - Trace model initialization, auto-wrap, reshard policy, CPU offload and sharded checkpoint code in 04-fully-sharded-data-parallel. Port one small model and compare state ownership with DDP.
- **Required - Reference:** [PyTorch FSDP Tutorials](https://docs.pytorch.org/tutorials/intermediate/FSDP1_tutorial.html) - Use the FSDP tutorial and current API reference to verify wrapping, mixed precision, prefetch, state-dict and optimizer-state behavior. Record the PyTorch version because FSDP APIs and defaults evolve.
- **Support - Implementation:** [TorchFeather - FSDP and Activation Checkpointing](https://github.com/hkproj/torchfeather) - Inspect distributed/model_parallel.py, activation_checkpoint.py and model/parallelize.py. Trace how parallel dimensions select the device mesh, FSDP policy, precision and reshard behavior; do not adopt the full framework yet.
- **Support - Theory:** [How to Scale Your Model - Chapter 5 Training](https://jax-ml.github.io/scaling-book/training/) - Work the FSDP, model-state sharding, rematerialization and offload calculations in Chapter 5. Translate each JAX-oriented layout into equivalent parameter, activation and collective ownership without implementing JAX.

### Exit checkpoint

Implement optimizer-state sharding and a minimal fully sharded step, match an unsharded oracle, predict and inspect peak live state, and save and restore a sharded checkpoint without silent replication.

<details>
<summary>Deliberately left for later</summary>

- Framework-specific offload engines and proprietary memory tiers
- Full-size model initialization on a large cluster
- FSDP internals below the behavior needed to debug ownership and collectives

</details>

## DT-5. Tensor, Sequence and Context Parallelism

**Why:** Model parallelism splits one layer or sequence across ranks. Correct layouts, partial reductions, RNG and loss ownership matter more than memorizing wrapper APIs.

### Learn this much

- [ ] Column-parallel linear layers and output ownership _(Required)_
- [ ] Row-parallel linear layers and partial-result reduction _(Required)_
- [ ] Colwise-to-rowwise communication cancellation _(Required)_
- [ ] Vocabulary-parallel embedding and output projection _(Required)_
- [ ] Parallel cross-entropy and log-sum-exp reduction _(Required)_
- [ ] Tensor-parallel attention head partitioning _(Required)_
- [ ] Grouped-query attention divisibility constraints _(Required)_
- [ ] Tensor-parallel MLP partitioning _(Required)_
- [ ] Sequence parallel normalization and residual layouts _(Required)_
- [ ] DTensor placements: Replicate, Shard and Partial _(Required)_
- [ ] Redistribution as collective communication _(Required)_
- [ ] DeviceMesh and tensor-parallel process groups _(Required)_
- [ ] Input, output and gradient layout contracts _(Required)_
- [ ] Activation and parameter memory accounting _(Required)_
- [ ] Tensor-parallel communication volume by layer _(Required)_
- [ ] Context-parallel sequence ownership _(Required)_
- [ ] Ring attention block exchange and online softmax state _(Required)_
- [ ] Causal masks, document boundaries and position offsets under CP _(Required)_
- [ ] Dropout and initialization RNG consistency across shards _(Required)_
- [ ] Uneven sequence and head divisibility failures _(Required)_
- [ ] Single-process reconstruction and gradient oracle tests _(Required)_
- [ ] TP or CP degree choice under link bandwidth and sequence length _(Required)_
- [ ] Asynchronous tensor parallelism and collective overlap _(Optional)_
- [ ] Loss parallel APIs in current PyTorch _(Optional)_
- [ ] Custom ring-attention kernels and fused collectives _(Depth)_
- [ ] Sequence parallel variants tied to one vendor framework _(Later)_

### Resource route

- **Primary - Theory:** [Ultra-Scale Playbook - Tensor, Sequence and Context Parallelism](https://nanotron-ultrascale-playbook.static.hf.space/index.html#tensor_parallelism) - Read Tensor Parallelism, Sequence Parallelism and Context Parallelism in order. Redraw every tensor shape and collective for a concrete batch, sequence, hidden and head configuration before using framework APIs.
- **Required - Implementation:** [Picotron - Tensor and Context Parallelism](https://github.com/huggingface/picotron) - Read tensor_parallel/tensor_parallel.py, tp_communications.py, context_parallel/context_parallel.py and cp_communications.py with tests/test_tensor_parallel.py. Trace layouts through attention and MLP, then reproduce one TP linear and one ring-attention step with reconstructed-output and gradient tests.
- **Required - Lab:** [Distributed Training Guide - Chapter 6 Tensor Parallelism](https://github.com/LambdaLabsML/distributed-training-guide) - Work through colwise and rowwise linear layers, embeddings, norms, loss parallelism and throughput accounting in 06-tensor-parallel. Test the same tiny model at TP degree 1 and 2.
- **Required - Reference:** [PyTorch Tensor Parallel Tutorial](https://docs.pytorch.org/tutorials/intermediate/TP_tutorial.html) - Use the tutorial to map ColwiseParallel, RowwiseParallel, SequenceParallel, PrepareModuleInput and DeviceMesh to the ownership model you derived. Add assertions around every layout transition.
- **Support - Lab:** [TorchFeather - TP and Ring Attention Minimal Examples](https://github.com/hkproj/torchfeather) - Run or inspect minimal_examples/tp_attention.py, tp_swiglu.py, ring_attention.py and block_matrix_multiply.py. Use them as compact cross-checks after Picotron, not as another framework to learn end to end.
- **Support - Theory:** [How to Scale Your Model - Chapters 3 and 5](https://jax-ml.github.io/scaling-book/sharding/) - Solve the sharded-matrix multiplication layouts in Chapter 3 and the Megatron sharding section of Chapter 5. Translate the results into PyTorch DTensor placements and collective counts.

### Exit checkpoint

Implement and gradient-test column and row parallel linear layers plus a small context-parallel attention path, reconstruct the single-process result, and defend the collective and memory cost of each layout.

<details>
<summary>Deliberately left for later</summary>

- Kernel-level fused TP and CP implementations
- Very-long-context benchmarks without suitable hardware
- Vendor-specific sharding DSLs beyond translating their layouts

</details>

## DT-6. Pipeline Parallelism

**Why:** Pipeline parallelism adds a time schedule to tensor ownership. Microbatch order, bubbles, activation lifetime and backward dependencies must be correct before throughput tuning.

### Learn this much

- [ ] Layer partitioning into ordered pipeline stages _(Required)_
- [ ] Microbatch splitting and global batch accounting _(Required)_
- [ ] Point-to-point activation and gradient transfer _(Required)_
- [ ] Forward and backward dependency graph _(Required)_
- [ ] Fill-drain GPipe schedule _(Required)_
- [ ] One-forward-one-backward schedule _(Required)_
- [ ] Warmup, steady state and cooldown phases _(Required)_
- [ ] Pipeline bubble derivation _(Required)_
- [ ] Activation lifetime under GPipe and 1F1B _(Required)_
- [ ] Interleaved virtual pipeline stages _(Required)_
- [ ] Schedule event simulation and validation _(Required)_
- [ ] Stage-local parameter and optimizer ownership _(Required)_
- [ ] Loss computation and final-stage semantics _(Required)_
- [ ] Tied embeddings across first and last stages _(Required)_
- [ ] Uneven microbatch and divisibility constraints _(Required)_
- [ ] Stage cost estimation and balanced partitioning _(Required)_
- [ ] Activation checkpointing within stages _(Required)_
- [ ] Pipeline groups combined with data or tensor groups _(Required)_
- [ ] Tag, shape and ordering protocols for send and receive _(Required)_
- [ ] Rank failure, stalled peer and timeout diagnosis _(Required)_
- [ ] Throughput, latency and memory trade-offs across schedules _(Required)_
- [ ] Zero-bubble and dual-pipeline schedule vocabulary _(Optional)_
- [ ] Automated graph partitioning _(Optional)_
- [ ] Custom production pipeline scheduler _(Depth)_
- [ ] Interleaved schedules beyond one validated simulator _(Later)_

### Resource route

- **Primary - Theory:** [Ultra-Scale Playbook - Pipeline Parallelism](https://nanotron-ultrascale-playbook.static.hf.space/index.html#pipeline_parallelism) - Read the pipeline section from naive partitioning through 1F1B, interleaving, bubble analysis and stage balancing. Derive bubble fraction and peak activation count for your simulator.
- **Required - Implementation:** [Picotron - Pipeline Parallelism](https://github.com/huggingface/picotron) - Read pipeline_parallel/pipeline_parallel.py and pp_communications.py beside the pipeline branch in train.py. Build a schedule event simulator first, then reproduce GPipe and 1F1B with shape, tag and ordering assertions.
- **Support - Course:** [First-Principles Video - Pipeline Parallelism Segment](https://www.youtube.com/watch?v=XoGvCBRnwLs&t=21977s) - Watch 06:06:17 for pipeline parallelism and 06:26:52 for GPipe, 1F1B and zero-bubble schedules. Stop after GPipe and 1F1B to draw and test those event traces; zero-bubble implementation remains depth work.
- **Required - Lab:** [PyTorch Pipeline Parallelism Tutorial](https://docs.pytorch.org/tutorials/intermediate/pipelining_tutorial.html) - Complete the two-stage GPT tutorial and compare ScheduleGPipe and Schedule1F1B. Preserve the tutorial model split, microbatch and loss contracts before adapting it to your own tiny model.
- **Support - Lab:** [TorchFeather - Pipeline Minimal Example and Runtime](https://github.com/hkproj/torchfeather) - Inspect minimal_examples/pp_gpipe.py, distributed/pipeline_parallel.py and the PP path in train.py. Compare its public schedule abstraction with Picotron event order and list the extra production checks.
- **Support - Theory:** [How to Scale Your Model - Pipeline Parallelism in Chapter 5](https://jax-ml.github.io/scaling-book/training/) - Work the pipeline bubble and communication examples in Chapter 5. Use them to test your cost model under different stage counts, microbatch counts and imbalanced layers.
- **Support - Project:** [Distributed Training Subsystem - Pipeline Scheduler](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-3/distributed-training-subsystem.md) - Complete the scheduler, event trace, activation-lifetime accounting and failure injection required in Milestone B. Keep the simulator runnable without GPUs.

### Exit checkpoint

Generate valid GPipe and 1F1B traces, match a two-stage PyTorch run on outputs and gradients, predict bubbles and activation peaks, and diagnose an injected ordering or stalled-peer failure.

<details>
<summary>Deliberately left for later</summary>

- Zero-bubble schedule implementation
- Automatic partitioners for arbitrary model graphs
- Large pipeline benchmarks without enough stages and devices

</details>

## DT-7. Expert Parallelism and Mixture of Experts

**Why:** MoE makes compute sparse but communication and load imbalance explicit. A correct route-dispatch-expert-combine path and capacity accounting are the foundation for any performance claim.

### Learn this much

- [ ] Sparse MoE layer structure and expert MLPs _(Required)_
- [ ] Router logits and token-to-expert scores _(Required)_
- [ ] Top-k expert selection and deterministic tie handling _(Required)_
- [ ] Routing weights and output recombination _(Required)_
- [ ] Token packing by destination expert and rank _(Required)_
- [ ] All-to-all dispatch and inverse combine _(Required)_
- [ ] Expert process groups and expert ownership _(Required)_
- [ ] Expert tensor parallelism vocabulary _(Required)_
- [ ] Capacity factor and per-expert token capacity _(Required)_
- [ ] Dropless, dropped and padded routing semantics _(Required)_
- [ ] Auxiliary load-balancing loss _(Required)_
- [ ] Router z-loss and numerical stability _(Required)_
- [ ] Tokens-per-expert histograms and imbalance metrics _(Required)_
- [ ] Hot experts, stragglers and all-to-all skew _(Required)_
- [ ] Masked or repeated-token correctness tests _(Required)_
- [ ] Router and dispatcher gradient tests _(Required)_
- [ ] Expert and dense parameter state ownership _(Required)_
- [ ] FSDP interaction with expert-sharded parameters _(Required)_
- [ ] EP, TP and data-parallel group composition _(Required)_
- [ ] Communication and memory accounting for MoE layers _(Required)_
- [ ] Failure cases from empty experts and uneven tokens _(Required)_
- [ ] Node-limited routing and topology-aware expert placement _(Optional)_
- [ ] Shared experts and fine-grained expert architectures _(Optional)_
- [ ] DeepEP-style optimized dispatch kernels _(Depth)_
- [ ] Large-scale expert load-balancing research _(Depth)_
- [ ] Full DeepSeek-V3 training stack _(Later)_

### Resource route

- **Primary - Theory:** [Ultra-Scale Playbook - Expert Parallelism](https://nanotron-ultrascale-playbook.static.hf.space/index.html#expert_parallelism) - Read Expert Parallelism and its interaction with DP in the 5D summary. Derive tokens, bytes and expected imbalance for one top-k routing example; use the linked MoE introduction only if the architecture is unfamiliar.
- **Required - Implementation:** [TorchFeather - Expert Parallelism](https://github.com/hkproj/torchfeather) - Trace distributed/expert_parallel.py, model/parallelize.py, the MoE model path and minimal tensor-parallel examples. Build a tiny router-dispatch-expert-combine oracle first, then map each TorchFeather group, DTensor placement and all-to-all to it.
- **Required - Reference:** [Mixture of Experts Explained](https://huggingface.co/blog/moe) - Study routing, capacity, token dropping, auxiliary loss and expert parallelism sections. Implement the small routing examples and verify conservation of token contributions through combine.
- **Support - Case study:** [Bumblebee - Router, Dispatcher and Expert Primitives](https://github.com/isLinXu/bumblebee) - In a separate clean working branch or read-only checkout, inspect primitive/modules/router.py, dispatcher.py, experts.py and moe.py plus the Qwen3-MoE tests. Compare contracts with TorchFeather; do not make this repository a prerequisite or overwrite its existing state.
- **Support - Reference:** [TorchTitan - MoE Model and Parallelism](https://github.com/pytorch/torchtitan) - Inspect the MoE model and parallelization plan only after the tiny oracle passes. Record how a production PyTorch stack composes EP, expert FSDP and other mesh dimensions.
- **Depth - Paper:** [Switch Transformers](https://jmlr.org/papers/v23/21-0998.html) - Read Sections 2 and 3 for routing, capacity factor, load balancing and expert parallel execution. Reproduce only one routing or capacity ablation if MoE becomes the active research direction.

### Exit checkpoint

Implement a tiny top-k router, all-to-all-equivalent dispatch and combine path with forward and gradient oracles, report capacity and imbalance, and explain one hotspot or empty-expert failure from traces.

<details>
<summary>Deliberately left for later</summary>

- Optimized DeepEP-class communication kernels
- Full DeepSeek-V3 or trillion-parameter MoE reproduction
- Novel routing research before the baseline dispatcher is correct

</details>

## DT-8. Multidimensional Parallel Planning

**Why:** Real training jobs combine dimensions. The useful skill is to turn a model, batch, topology and reliability requirement into a legal plan whose memory and critical path can be defended before allocation.

### Learn this much

- [ ] Parallel dimensions: DP, FSDP, TP, SP, CP, PP and EP _(Required)_
- [ ] World-size factorization and divisibility constraints _(Required)_
- [ ] Logical device meshes and named mesh dimensions _(Required)_
- [ ] Rank coordinates and process-group construction _(Required)_
- [ ] Batch and token equations across DP and pipeline microbatches _(Required)_
- [ ] Head, hidden, vocabulary, sequence, layer and expert divisibility _(Required)_
- [ ] Per-rank parameter, gradient and optimizer memory _(Required)_
- [ ] Per-rank activation and temporary memory _(Required)_
- [ ] Checkpoint and communication buffer memory _(Required)_
- [ ] Per-layer compute and transformer FLOP estimates _(Required)_
- [ ] Collective volume for every parallel dimension _(Required)_
- [ ] Pipeline bubble and stage-imbalance cost _(Required)_
- [ ] Critical-path versus total-byte reasoning _(Required)_
- [ ] Communication overlap and dependency constraints _(Required)_
- [ ] Link contention among simultaneous mesh dimensions _(Required)_
- [ ] Intra-node and inter-node placement policy _(Required)_
- [ ] Fast-link preference for tensor and expert parallelism _(Required)_
- [ ] Long-context trade-offs between TP and CP _(Required)_
- [ ] Batch-limit trade-offs between DP, ZeRO and PP _(Required)_
- [ ] Configuration search with legal-plan pruning _(Required)_
- [ ] Predicted OOM, communication-bound and bubble-bound regimes _(Required)_
- [ ] Measured-to-predicted residual analysis _(Required)_
- [ ] Correctness tests for a composed 2D or 4D plan _(Required)_
- [ ] Topology and assumption manifest for every result _(Required)_
- [ ] Automated plan ranking under uncertain bandwidth _(Optional)_
- [ ] Heterogeneous device planning _(Optional)_
- [ ] Production auto-parallel compiler and planner _(Depth)_
- [ ] Cluster-scale configuration sweeps beyond available hardware _(Later)_

### Resource route

- **Primary - Book:** [The Ultra-Scale Playbook - 5D Parallelism and Configuration Search](https://nanotron-ultrascale-playbook.static.hf.space/index.html#high-level_overview) - Study the complete 5D summary, memory and communication accounting, practical parallelism-selection procedure and configuration heatmaps. Rebuild a small planner that enumerates legal DP, TP, CP, PP and EP degrees and ranks them by predicted memory and step time.
- **Required - Implementation:** [Picotron - 4D Composition](https://github.com/huggingface/picotron) - Trace create_config.py, process_group_manager.py and train.py across DP, TP, PP and CP. Run the CPU 3D example or a smaller equivalent, assert group membership and compare observed event order with the planner.
- **Support - Course:** [First-Principles Video - Device Mesh Composition Segment](https://www.youtube.com/watch?v=XoGvCBRnwLs&t=31054s) - Watch 08:37:34 on device meshes and combining pipeline with data parallelism. Reconstruct its rank-coordinate table and compare it with Picotron process groups and your planner output.
- **Required - Lab:** [Distributed Training Guide - Chapter 7 FSDP plus TP](https://github.com/LambdaLabsML/distributed-training-guide) - Implement the 2D FSDP plus TP path in 07-2d-parallel and reproduce its configuration comparison with the smallest viable model. Explain why FSDP is applied after TP and what controls TP degree.
- **Required - Book:** [How to Scale Your Model - Chapters 4 to 6](https://jax-ml.github.io/scaling-book/) - Use transformer math, training parallelism and the LLaMA 3 case study to independently estimate parameters, FLOPs, memory, communication, time and cost for one configuration. Compare its recommendation with Ultra-Scale.
- **Support - Implementation:** [TorchFeather - ParallelDims and Composition Plan](https://github.com/hkproj/torchfeather) - Inspect distributed/parallel_dims.py and model/parallelize.py. Build the exact mesh product and divisibility table for one FSDP, TP, CP, PP and EP configuration, then identify ordering assumptions in its composition.
- **Depth - Production reference:** [Nanotron](https://github.com/huggingface/nanotron) - Inspect configuration, parallel context and trainer paths used by the Ultra-Scale benchmarks only after the planner works. Compare one production configuration with Picotron and list the reliability and performance machinery added.
- **Depth - Case study:** [Bumblebee - Parallel State and Composition](https://github.com/isLinXu/bumblebee) - In an isolated read-only or clean branch, inspect primitive/parallel/state.py, linear.py, cp.py, pp.py and the composition tests. Use it to compare TP, EP, ETP, CP and PP contracts; preserve all existing local work.

### Exit checkpoint

Given a model, global batch and named topology, enumerate legal parallel plans, reject infeasible ones, predict memory and step time, execute one CPU-safe composed plan, and explain the largest prediction error.

<details>
<summary>Deliberately left for later</summary>

- A production auto-parallel compiler
- Thousands of cluster configurations reproduced locally
- Heterogeneous-fleet optimization without access to that fleet

</details>

## DT-9. Checkpointing and Fault Tolerance

**Why:** A fast job that cannot resume correctly is not a training system. Recovery must preserve model, optimizer, scheduler, RNG and data position while surviving partial writes, changed layouts and rank failure.

### Learn this much

- [ ] Model, optimizer, scheduler, scaler, RNG and dataloader state _(Required)_
- [ ] Full versus sharded checkpoint formats _(Required)_
- [ ] Distributed checkpoint state-dict contracts _(Required)_
- [ ] Checkpoint manifests, schema and version compatibility _(Required)_
- [ ] Atomic publish with temporary paths and commit markers _(Required)_
- [ ] Checksums, completeness validation and corruption detection _(Required)_
- [ ] Rank participation and coordinated save barriers _(Required)_
- [ ] Synchronous versus asynchronous checkpointing _(Required)_
- [ ] Staging buffers and host-memory pressure during async save _(Required)_
- [ ] Checkpoint frequency, save cost and recomputation loss _(Required)_
- [ ] Incremental and differential checkpoint vocabulary _(Required)_
- [ ] World-size and mesh resharding on restore _(Required)_
- [ ] Parameter-name and optimizer-state compatibility _(Required)_
- [ ] Deterministic resume of sampler, shuffle and RNG streams _(Required)_
- [ ] Preemption signals and bounded graceful shutdown _(Required)_
- [ ] Rank crash, collective timeout and process-group teardown _(Required)_
- [ ] Rendezvous restart and elastic membership vocabulary _(Required)_
- [ ] Storage saturation, partial writes and slow rank diagnosis _(Required)_
- [ ] Recovery point and recovery time objectives _(Required)_
- [ ] Retention, garbage collection and last-known-good protection _(Required)_
- [ ] Kill-at-every-boundary fault injection _(Required)_
- [ ] Reference trajectory and post-resume equivalence tests _(Required)_
- [ ] Failure manifest and recovery audit trail _(Required)_
- [ ] Asynchronous checkpoint isolation with a separate process group _(Optional)_
- [ ] Replica-based in-memory recovery _(Optional)_
- [ ] Large-scale elastic optimization with changing world size _(Depth)_
- [ ] Cross-cloud checkpoint replication and disaster recovery service _(Later)_

### Resource route

- **Primary - Book:** [Machine Learning Systems Volume II - Chapter 7 Fault Tolerance](https://mlsysbook.ai/vol2/) - Read Sections 7.1 and 7.3 for failure models, 7.4 and 7.5 for check-and-verify and fault injection, 7.6 through 7.8 for checkpointing, detection and elastic recovery, and 7.11 for distributed debugging. Turn them into a failure matrix before implementing the PyTorch DCP lab.
- **Required - Lab:** [PyTorch Distributed Checkpoint Recipes](https://docs.pytorch.org/tutorials/recipes/distributed_checkpoint_recipe.html) - Complete the distributed checkpoint and asynchronous checkpoint recipes with a tiny sharded model. Add model, optimizer, scheduler, RNG and dataloader state, then inject partial directories, missing shards and a changed world-size restore.
- **Required - Implementation:** [TorchFeather - Distributed Checkpoint Manager](https://github.com/hkproj/torchfeather) - Trace components/checkpoint.py through state wrappers, DCP save and load, asynchronous mode, retention and cleanup. Write a failure table for every barrier, future, temporary artifact and deletion boundary.
- **Required - Field guide:** [Machine Learning Engineering Open Book - Checkpoints, Storage and Fault Tolerance](https://github.com/stas00/ml-engineering) - Read training/checkpoints/README.md, training/fault-tolerance/README.md and the checksum, benchmark and retention sections of storage/README.md. Turn them into an operational save, verify, publish, retain and recover runbook.
- **Required - Lab:** [Distributed Training Guide - Sharded Checkpoints, Determinism and Elastic Training](https://github.com/LambdaLabsML/distributed-training-guide) - Use Chapter 4 sharded save, load and consolidation plus Related Topics on determinism and elastic training. Prove the same next batches and updates after one interrupted run.
- **Support - Implementation:** [Picotron - Checkpoint State](https://github.com/huggingface/picotron) - Inspect picotron/checkpoint.py and every call site in train.py. List which state is saved, how ranks participate and which DT-1 reproducibility requirements need to be added in your project.
- **Support - Reference:** [PyTorch Elastic Run Documentation](https://docs.pytorch.org/docs/2.14/elastic/run.html) - Use failure modes and membership changes to understand agent, worker group, rendezvous and restart semantics. Implement only bounded local restart tests; elasticity is not a substitute for checkpoint correctness.
- **Depth - Case study:** [Bumblebee - DCP and Checkpoint Smoke Tests](https://github.com/isLinXu/bumblebee) - Read primitive/ckpt/dcp.py and tests/qwen3_moe/test_checkpoint_smoke.py in isolation. Compare its state and HF bridge contracts with TorchFeather; do not modify existing Bumblebee work.

### Exit checkpoint

Kill a sharded training job at multiple save boundaries, reject corrupt or incomplete checkpoints, resume to the reference trajectory, and restore one checkpoint under a changed legal layout with an audit trail.

<details>
<summary>Deliberately left for later</summary>

- Cross-region disaster recovery infrastructure
- Elastic convergence research under continuously changing membership
- Incremental checkpoint engines before full checkpoints are correct

</details>

## DT-10. Performance and Fleet Operation

**Why:** The final skill is to turn profiles, topology and failure evidence into a safe system change. Throughput matters only with fixed workload semantics, correct results, reliability and resource cost.

### Learn this much

- [ ] Step time, samples per second and tokens per second _(Required)_
- [ ] Model FLOPs utilization (MFU) and hardware FLOPs utilization (HFU) _(Required)_
- [ ] Strong scaling, weak scaling and parallel efficiency _(Required)_
- [ ] Goodput with failures, retries and unusable work _(Required)_
- [ ] Fixed-workload benchmark contracts and correctness guards _(Required)_
- [ ] Warmup, synchronization, repetitions and variance _(Required)_
- [ ] CPU, input, kernel, memory and communication timeline attribution _(Required)_
- [ ] PyTorch profiler and multi-rank trace alignment _(Required)_
- [ ] NCCL traces, flight recorder and desynchronization reports _(Required)_
- [ ] Compute-bound, memory-bound and communication-bound diagnosis _(Required)_
- [ ] Collective overlap and exposed communication measurement _(Required)_
- [ ] Data-loader, storage and host-transfer bottlenecks _(Required)_
- [ ] Allocator fragmentation, activation peaks and OOM diagnosis _(Required)_
- [ ] Compilation graph breaks and recompilation storms _(Required)_
- [ ] Kernel launch gaps and small-operation overhead _(Required)_
- [ ] Rank and node straggler localization _(Required)_
- [ ] Network, topology and placement regressions _(Required)_
- [ ] Numerical instability under precision or scale changes _(Required)_
- [ ] Gang scheduling and topology-aware placement _(Required)_
- [ ] Quotas, fairness, backfill and preemption vocabulary _(Required)_
- [ ] Capacity, queue time and accelerator fragmentation _(Required)_
- [ ] Health checks, canaries, rollback and runbooks _(Required)_
- [ ] Cost per useful token and performance per watt _(Required)_
- [ ] Performance regression tests and evidence manifests _(Required)_
- [ ] Small real-code contribution with before and after evidence _(Required)_
- [ ] Kubernetes and Slurm policy comparison _(Optional)_
- [ ] Automated anomaly detection over fleet telemetry _(Optional)_
- [ ] Cross-rack scheduler design and production rollout _(Depth)_
- [ ] Custom fused kernels for a measured dominant bottleneck _(Depth)_
- [ ] Vendor-specific fleet tuning without access to that hardware _(Later)_

### Resource route

- **Primary - Book:** [Machine Learning Systems Volume II - Chapters 8 and 9](https://mlsysbook.ai/vol2/) - Read Sections 8.1 to 8.5 and 8.8 to 8.9 for gang scheduling, topology, elasticity, cost, quotas and utilization, then Sections 9.1, 9.5 and 9.7 to 9.10 for rooflines, compilation, communication, profiling and measurement. Use the chapter framework to choose one bottleneck-specific AISys lab and one rollback metric.
- **Required - Book and labs:** [AI Systems Performance Engineering - Chapters 1 to 5 and 13](https://github.com/cfregly/ai-performance-engineering) - Use Chapter 1 for goodput and reproducibility, Chapters 2 to 5 for topology, orchestration, communication, storage and data movement, and Chapter 13 for PyTorch profiling and scaling. Run only the matching companion labs for the bottleneck you actually observe; preserve workload correctness and record hardware assumptions.
- **Required - Field guide:** [Machine Learning Engineering Open Book - Network, Debug, Training Performance and Orchestration](https://github.com/stas00/ml-engineering) - Use network, debug/nccl-performance-debug.md, debug/torch-distributed-hanging-solutions.md, training/performance/README.md, storage and orchestration as an incident-driven reference. Build one symptom-to-evidence-to-cause runbook rather than reading every page linearly.
- **Required - Book:** [How to Scale Your Model - Chapters 1, 5, 9 and 12](https://jax-ml.github.io/scaling-book/) - Use rooflines, training cost models, profiling workflow and GPU topology to predict the dominant limit of one run. Compare the prediction with a trace and quantify the residual before proposing a change.
- **Required - Assignment:** [CS336 Assignment 2 - Profiling and Parallelism Analysis](https://github.com/stanford-cs336/assignment2-systems) - Revisit Section 2 profiling and Section 8 communication analysis. Produce warmup-controlled timing, Nsight or PyTorch traces, memory evidence and analytic DP, FSDP, TP and 2D comparisons on configurations you can execute honestly.
- **Required - Reference:** [Ultra-Scale Playbook - Benchmarking Configurations](https://nanotron-ultrascale-playbook.static.hf.space/index.html#benchmarking_thousands_of_configurations) - Study the configuration-search experiments and normalized utilization heatmaps. Reproduce the method on a tiny legal search space, separating analytic predictions, simulations and measurements.
- **Depth - Production reference:** [TorchTitan](https://github.com/pytorch/torchtitan) - Inspect configuration, metrics, profiling, checkpoint and parallelization seams after the local subsystem is complete. Select one bounded issue or measurable improvement and follow project contribution standards; do not attempt a wholesale framework rewrite.
- **Support - Project:** [Distributed Training Systems Laboratory](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/capstones/distributed-training-systems-laboratory.md) - Complete the capstone with a fixed workload, correctness oracle, analytic plan, fault campaign, aligned traces and one real-code extension. Label CPU simulation, single-GPU evidence and multi-GPU evidence separately.

### Exit checkpoint

For one fixed and correct workload, predict the bottleneck, confirm it with aligned traces, implement one bounded change, report throughput, memory, reliability and cost with variance, and defend a rollback-ready real-code contribution.

<details>
<summary>Deliberately left for later</summary>

- Fleet-wide scheduling policy changes without a safe test environment
- Kernel optimization before traces identify a dominant kernel bottleneck
- Performance claims extrapolated beyond the measured hardware and workload

</details>

## Track milestone

### Distributed Training Systems Laboratory

Carry one tiny transformer and one evidence repository through the track. Keep correctness runnable on CPU processes, add hardware measurements only where available, and finish with a bounded change to a real training codebase.

- A correctness core with restartable data and state, rank and group construction, tested collectives, single-process numerical oracles, DDP and sharded steps, TP, CP and PP mechanisms, a tiny MoE dispatcher, structured rank traces and analytic memory and communication models.
- A composed-plan and recovery dossier with a legal 2D or 4D device mesh, topology and batch constraints, predicted memory and critical path, atomic sharded checkpoints, changed-layout restore, kill and corruption campaigns, and explicit separation of simulated, CPU, single-GPU and multi-GPU evidence.
- A real-code extension in Picotron, TorchFeather, TorchTitan or an isolated Bumblebee branch with a fixed-workload baseline, aligned profiles, correctness and regression tests, before and after throughput, memory and reliability results with variance, a reproducible manifest, negative evidence and a skeptical design defense.

