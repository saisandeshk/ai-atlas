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

### Study units

#### U1. Run identity, launch configuration and the setup, step, save, load and teardown contract

**About 4 h** · **Target:** Explain + Implement

Topics: Launch configuration, immutable run identity and environment capture; Framework contracts for setup, step, save, load and teardown

Distributed runs multiply every unspecified choice: one missing flag or untracked code change becomes a different experiment on every rank. A written run contract makes resume and blame possible before any parallelism is added.

**You can now**

- Explain what belongs in an immutable run identity and why a seed alone cannot reproduce a run.
- Implement setup, step, save, load and teardown in one script so a relaunch resumes from committed state instead of restarting.
- Capture the launch configuration and environment needed to tell a changed setup apart from a broken resume.

**Study**

1. [Single-GPU trainer end to end](https://github.com/LambdaLabsML/distributed-training-guide/blob/aed748914472cca80d8cfe139ab43ec63103913a/01-single-gpu/train_llm.py) (Distributed Training Guide - Chapter 1 and Related Topics) - README.md Code explanation from Argument parsing through Checkpoints; `train_llm.py` `_get_parser`, `LocalTimer`, the checkpoint-save block writing `model.pt`, `optimizer.pt`, `lr_scheduler.pt` and `state.json`, and the resume branch reloading them and skipping finished steps.
2. [Pipeline architecture and the benchmark envelope](https://mlsysbook.ai/vol1/training/training.html) (Machine Learning Systems Volume I - ML Frameworks, Model Training and Benchmarking) - Model Training, Pipeline Architecture; Training Benchmarks in https://mlsysbook.ai/vol1/benchmarking/benchmarking.html for the full envelope of commit, checksum, preprocessing, seed plan, versions, precision, batch schedule, topology, power and thermal, and checkpoint behavior.
3. [Reproducible environment capture](https://github.com/stas00/ml-engineering/blob/139708e52cb06f9191cf1d9959def9187b205c58/training/reproducibility/README.md) (Machine Learning Engineering Open Book - Training and PyTorch Debugging) - `enforce_reproducibility`: seed handling, `CUBLAS_WORKSPACE_CONFIG` set before CUDA init, `torch.use_deterministic_algorithms(True)`, `cudnn.benchmark=False`; Reproduce env: `modules.txt`, `env.txt`, `pip freeze`, `git diff` of local installs.

**Focus**

- The run identity is code version, dataset version, config, seeds, and hardware and software versions together. Logging `os.environ` and args, as the single-GPU guide script does, starts the identity but `pip freeze` and the dataset version complete it.
- `state.json` carries `epoch`, `global_step`, `epoch_step` and `running_loss` beside the three state dicts. Resume restores all of them and skips finished batches; loading weights alone restarts the schedule midstream.
- Process-global flags are environment, not model config. In PyTorch 2.14 the default is `torch.backends.cuda.matmul.allow_tf32` False with `torch.get_float32_matmul_precision` returning `highest`; record both in the manifest.
- Teardown belongs to the contract: workers shut down, barriers complete, and only committed checkpoints are read back.

**Reproduce:** From a blank file, write a loop that saves model, optimizer, scheduler and a position record every N steps, stops mid-epoch, and relaunches to the same loss trajectory. State which files must exist before the resumed run may continue.

**Traps**

- Treating the random seed as the full identity. Seeding alone still leaves algorithm choice and data position unspecified.
- Reading a checkpoint written by different code or config and calling the mismatch a resume bug. Reject resume under a changed configuration instead.
- Saving only `model.state_dict`. Optimizer, scheduler and data position are state too; without them the trajectory diverges after resume.

**Practice**

- [01-single-gpu: interrupted and resumed run](https://github.com/LambdaLabsML/distributed-training-guide/blob/aed748914472cca80d8cfe139ab43ec63103913a/01-single-gpu/README.md) - Outputs and Resuming plus Checkpoints: with one GPU on your machine, launch `train_llm.py` on the smallest model that fits, stop it mid-epoch, relaunch with the same experiment name and show it resumes from `state.json` instead of restarting. On a CPU-only machine run the same interrupt-and-resume cycle with the loop from the reproduce step, since this script hardcodes CUDA, `fused=True` and `bfloat16`. Keep the timer and memory logs from both halves as the resume evidence.

**Stop when:** You can list the complete identity for your own loop, and an interrupted run continues its loss trajectory instead of restarting it.

<details>
<summary>Self-test</summary>

1. A resumed run reproduces the loss values but the learning rate schedule looks shifted by half an epoch. Which state was likely not restored?
   - The scheduler state and the position record (`epoch_step` or `global_step`). Weights plus optimizer without scheduler and position restart the schedule at the wrong point.
2. Why is logging `os.environ` and parsed args insufficient as a run identity?
   - It misses code version, dataset version, installed package versions and process-global flags. Two runs can share env and args yet differ in code, data or library behavior.
3. Where must `CUBLAS_WORKSPACE_CONFIG` be set, and why?
   - Before any CUDA work, as the Stas recipe does; it raises if CUDA is already initialized. cuBLAS reads the setting when it creates its workspaces, and with deterministic algorithms on PyTorch raises at a cuBLAS call when the variable is missing.
4. A crash leaves new weight files but no new `state.json`. Should the resumed run load the new weights?
   - No. Only a committed checkpoint with its position record is readable. Rebuild or discard the uncommitted shards first.

</details>

#### U2. Dataset manifests, document-to-batch lineage and deterministic sampler position

**About 4 h** · **Target:** Implement

Topics: Dataset manifests, versions and document-to-batch lineage; Deterministic shuffle, shards, workers and sampler position

Data order is optimizer input: a duplicated shard or a reshuffle on resume silently trains a different model. Lineage plus sampler position makes every example accountable before ranks are added.

**You can now**

- Implement a restartable sharded sampler with deterministic shuffle, disjoint coverage and a stated padding or drop policy.
- Trace any batch back to document IDs and a manifest version, and serialize sampler position as epoch plus RNG state.
- Diagnose duplicate or omitted samples and seed collisions across ranks and loader workers.

**Study**

1. [Sampler order, sharding and worker randomness](https://docs.pytorch.org/docs/2.14/data.html) (PyTorch data loading API - DataLoader, Sampler and multi-process loading) - Data Loading Order and Sampler; Single- and Multi-process Data Loading with Randomness in multi-process data loading; `DistributedSampler` entry: `set_epoch`, `seed`, `drop_last` head padding, `len` reporting the per-rank count. Depth: Read the sampler contract, not the whole loader reference. Note that `DistributedSampler` has no `state_dict`; position is the epoch integer plus the loop-owned RNG state.
2. [Determinism and data-loading notes](https://github.com/LambdaLabsML/distributed-training-guide/blob/aed748914472cca80d8cfe139ab43ec63103913a/related-topics/determinism/README.md) (Distributed Training Guide - Chapter 1 and Related Topics) - RNG save and restore (`rng.pt` with torch, NumPy and Python states), `torch.use_deterministic_algorithms(True)`, seeded `Generator` with `_seed_worker`; related-topics `optimizing-data-loading` README for `num_workers`, `prefetch_factor` and the rank-wait timer.
3. [Deterministic seeding and worker discipline](https://github.com/stas00/ml-engineering/blob/139708e52cb06f9191cf1d9959def9187b205c58/training/reproducibility/README.md) (Machine Learning Engineering Open Book - Training and PyTorch Debugging) - `enforce_reproducibility(use_seed=None)`: seeds for `random`, NumPy, torch and CUDA, `CUBLAS_WORKSPACE_CONFIG` set before CUDA init, `torch.use_deterministic_algorithms(True)` and `cudnn.benchmark=False`. For the copied-generator trap read Randomness in multi-process data loading in https://docs.pytorch.org/docs/2.14/data.html and reseed inside each loader worker from the seed that `torch.utils.data.get_worker_info()` reports.

**Focus**

- Sampler position is an epoch integer owned by the training loop plus dataset version and RNG state. Call `set_epoch(n)` every epoch or every epoch repeats the first epoch's order.
- With `shuffle=False` and `drop_last=False` an uneven split pads with head indices: 10 items over 3 ranks yield per-rank rows $`[0, 3, 6, 9]`$, $`[1, 4, 7, 0]`$ and $`[2, 5, 8, 1]`$. Padding duplicates examples, so token and sample counts must use the manifest, not the batch count.
- Main-process shuffling assigns indices to loader workers, but an RNG object created in `Dataset.__init__` is fork-copied identically into each worker. Seed inside each worker process from the seed that `torch.utils.data.get_worker_info()` reports instead.
- Document-to-batch lineage means each batch element records its document ID, shard and position. A manifest fixes ordered shard paths, checksums, counts and recipe version; resume under a changed manifest is rejected.

**Reproduce:** From a blank file, build a 10-item dataset with a 3-way sampler, print the per-rank index rows with `drop_last` True and False, and show that `set_epoch(0)` and `set_epoch(1)` give different orders while re-setting the same epoch reproduces them. Save and restore the epoch plus RNG state mid-epoch and continue the identical sequence.

**Traps**

- Calling `DistributedSampler.state_dict`. It does not exist; resume restores the epoch integer and the loop-owned RNG and worker state.
- Assuming padding is free. Padded head items are real repeated examples that inflate token counts unless the loss denominator excludes them.
- Seeding only the main process and trusting it to cover workers. Since PyTorch 1.9 each worker gets a per-worker seed for torch and the `random` and NumPy global RNGs, but an RNG object built in `Dataset.__init__` is still copied identically into every worker. Build or reseed generators inside each worker from the seed that `get_worker_info` reports.

**Practice**

- The section mini-project covers this: deterministic sampler with disjoint-coverage tests, padding and drop policy, document-to-batch lineage, and interrupted versus uninterrupted record-ID equivalence.

**Stop when:** Your sampler prints disjoint per-rank rows for both padding policies, and a mid-epoch save and restore continues the identical example sequence.

<details>
<summary>Self-test</summary>

1. Ten items, 3 replicas, `shuffle=False`, `drop_last=False`. Which indices does rank 1 yield?
   - $`[1, 4, 7, 0]`$. Each rank takes every third index and rank 1 pads with head index 0 to reach length 4.
2. What must be saved to resume a shuffled sampler exactly?
   - The epoch integer passed to `set_epoch`, the dataset and recipe version, and the RNG state feeding shuffle and workers. The sampler object itself holds no serializable position.
3. Two loader workers produce identical augmentations. What is the likely cause on a current PyTorch?
   - An RNG object created in `Dataset.__init__` was copied identically into both workers. Build or reseed the generator in each process from the seed that `get_worker_info` reports.
4. Why must resume be rejected when the manifest changed?
   - Shard order, counts or recipe changes remap positions to different documents. Continuing from the old cursor silently duplicates some examples and omits others.

</details>

#### U3. Microbatches, accumulation, global batch, token accounting and update semantics

**About 4 h** · **Target:** Derive + Implement

Topics: Microbatch, gradient accumulation, global batch and token accounting; Gradient accumulation, zeroing and optimizer update semantics

The global batch sets gradient noise and learning-rate scaling, while the microbatch sets memory. Confusing the two changes the optimized objective without changing any config name.

**You can now**

- Derive global batch and token counts from microbatch size, accumulation steps, packing and data-parallel degree.
- Implement accumulation with correct mean weighting over uneven microbatches and one optimizer step per global batch.
- Explain when accumulation matches a large batch and which padding and zeroing choices break the match.

**Study**

1. [Gradient accumulation and the batch equation](https://nanotron-ultrascale-playbook.static.hf.space/index.html#gradient_accumulation) (Ultra-Scale Playbook - First Steps: Training on One GPU) - Gradient accumulation through Revisiting global batch size: microbatch size, accumulation steps and $`\text{gbs} = \text{mbs} \times \text{grad\_acc} \times \text{dp}`$; the note that accumulation keeps separate gradient buffers alive across the step.
2. [Accumulation and effective batch size](https://github.com/LambdaLabsML/distributed-training-guide/blob/aed748914472cca80d8cfe139ab43ec63103913a/related-topics/gradient-accumulation/README.md) (Distributed Training Guide - Chapter 1 and Related Topics) - Effective batch as `batch * accum_steps` with `backward` each step and `step` only when `i % accum == 0`; related-topics `effective-batch-size-and-lr` README for linear versus square-root learning-rate scaling with batch size.
3. [Capacity levers: accumulation and checkpointing](https://mlsysbook.ai/vol1/training/training.html) (Machine Learning Systems Volume I - ML Frameworks, Model Training and Benchmarking) - Model Training, Pipeline Optimizations: gradient accumulation and activation checkpointing as the capacity responses when a batch does not fit.

**Focus**

- Global batch is $`\text{gbs} = \text{mbs} \times \text{grad\_acc} \times \text{dp}`$, with tokens $`\text{gbs} \times \text{seq}`$. In LLM reports the batch is quoted in tokens so the count survives a sequence-length change.
- Uneven microbatches need size-weighted averaging. With per-microbatch mean gradients $`g_1 = [1, -1]`$ over 2 examples and $`g_2 = [-2, -2]`$ over 1, the full-batch gradient is $`[0, -1.33]`$; averaging the two means gives the wrong $`[-0.5, -1.5]`$.
- Accumulation keeps gradient buffers across micro-steps but holds only one microbatch's activations at a time, so its peak sits below a single large batch when activations dominate, even though the update matches. The optimizer steps once per global batch, then gradients are cleared.
- Padding and packing change the denominator. Padded positions and cross-document transitions excluded from the loss must not count as tokens in the batch.

**Reproduce:** Closed-book, derive the update for two microbatches of sizes 2 and 1 with the gradients above, showing the size-weighted mean and one SGD step. Then implement accumulation over uneven microbatches and match it against a single full-batch step to 1e-5.

**Traps**

- Averaging per-microbatch losses or gradients instead of weighting by microbatch size. Equal weight per microbatch overweights small ones.
- Stepping the optimizer per microbatch. That trains with the microbatch size while the config claims the global size.
- Counting padded or masked positions as batch tokens. Throughput and scaling rules then use tokens the loss never saw.

**Practice**

- [TensorTonic: Gradient Accumulation Equivalence](https://www.tensortonic.com/problems/cs336-l02-gradient-accumulation-step) - Implement `gradient_accumulation_step`: accumulate the full-batch mean-squared-error gradient over uneven microbatches and return the updated parameter and full gradient; the public cases check uneven sizes, equal sizes and zero loss. Answer the weighting by hand first: each example contributes equally even when microbatch sizes differ. Then run the same comparison in your own trainer against a full-batch step.

**Stop when:** You derive the global batch in samples and tokens for any setting, and your accumulator matches a full-batch step while the naive mean-of-means fails as predicted.

<details>
<summary>Self-test</summary>

1. Microbatch 8 with seq 4096, 4 accumulation steps, dp 2. What is the global batch in samples and tokens?
   - $`\text{gbs} = 8 \times 4 \times 2 = 64`$ samples, or $`64 \times 4096 = 262{,}144`$ tokens.
2. Why does naive averaging of per-microbatch gradients fail for uneven microbatches?
   - Each microbatch gradient is already a mean over its own size. The full-batch mean must weight each by its example count; unweighted averaging gives small microbatches excess influence.
3. Does accumulation with the same global batch always match a large batch numerically?
   - It matches when every microbatch uses the same graph, the correctly weighted mean, one step per global batch and identical ordering. It differs when padding, dropout draws, batch statistics or ordering differ.
4. Where does the extra memory of accumulation sit?
   - In gradient buffers held across micro-steps plus one microbatch of activations at a time, instead of the full-batch activation peak.

</details>

#### U4. Who owns parameters, buffers, gradients, optimizer, scheduler, scaler, RNG and loader state

**About 4 h** · **Target:** Explain + Implement

Topics: Model parameters, buffers, gradients and optimizer state ownership; Scheduler, scaler, RNG and dataloader state

Every later sharding and checkpoint decision is a question of who owns which tensor and when. An ownership table turns silent state bugs into checkable rows.

**You can now**

- Explain which object owns parameters, buffers, gradients, optimizer state, scheduler, scaler, RNG and loader state during one step.
- Build a state-ownership table for your trainer and show the update each entry receives per step.
- Predict which missing entry diverges a resume and which leaves memory allocated but unused.

**Study**

1. [Anatomy of a training step](https://mlsysbook.ai/vol1/frameworks/frameworks.html) (Machine Learning Systems Volume I - ML Frameworks, Model Training and Benchmarking) - ML Frameworks, Anatomy of a Training Step: the seven-statement two-layer MLP traced through forward dispatch, `loss.backward` traversal with `.grad` accumulation and freed saved tensors, and the optimizer update.
2. [Every state object in one file](https://github.com/LambdaLabsML/distributed-training-guide/blob/aed748914472cca80d8cfe139ab43ec63103913a/01-single-gpu/train_llm.py) (Distributed Training Guide - Chapter 1 and Related Topics) - `train_llm.py` model init with `torch.compile`, `DataLoader` with `num_workers=1` and `prefetch_factor=2`, `AdamW(fused=True)`, `CosineAnnealingLR`, the `zero_grad(set_to_none=True)` update block, and the checkpoint block saving model, optimizer and scheduler state dicts.
3. [RNG ownership and deterministic flags](https://github.com/stas00/ml-engineering/blob/139708e52cb06f9191cf1d9959def9187b205c58/training/reproducibility/README.md) (Machine Learning Engineering Open Book - Training and PyTorch Debugging) - `enforce_reproducibility`: torch, CUDA, NumPy and Python RNG streams seeded together, `CUBLAS_WORKSPACE_CONFIG` before CUDA init, and `torch.use_deterministic_algorithms(True)` with `cudnn.benchmark=False`; check the round trip of `torch.get_rng_state` and `torch.set_rng_state` yourself, since this note does not cover it.

**Focus**

- Parameters and buffers live in the module; gradients accumulate into `.grad` on leaves; optimizer state (momentum, variance, plus an FP32 master copy when parameters are stored in low precision) lives in the optimizer; scheduler step count lives in the scheduler. Each has exactly one writer per step.
- The scaler owns the scale factor and the skip-or-step decision; the RNG streams owned by torch, CUDA, NumPy and Python decide dropout, init and shuffle draws; the loader owns worker processes, prefetch queues and the sampler cursor.
- Buffers such as BatchNorm running statistics update by moving average, not by gradient. Forgetting them in a checkpoint corrupts evaluation while training loss looks fine.
- `zero_grad()` sets `.grad` to None by default (`set_to_none=True`) instead of filling zeros. Code that adds into `.grad` before the next backward then raises on None rather than reading zeros.

**Reproduce:** Closed-book, draw the ownership table for a tiny model with AdamW, cosine schedule, scaler and a two-worker loader: one row per state with owner, dtype, writer and lifetime. Then save and reload every row and show the next-step update matches an uninterrupted run.

**Traps**

- Constructing the optimizer before the parameters it should track, or adding new parameters later without extending the optimizer. Those parameters train with no update while the loss still falls.
- Saving the model but not the scaler. The resumed run restarts from the initial scale, so it repeats the early overflow skips and its updates differ from the uninterrupted run.
- Moving the model to a device after the optimizer has stepped. The parameters move in place, but the existing optimizer state stays on the first device and the next step raises a device-mismatch error. Move the model first, then build the optimizer.

**Practice**

- [01-single-gpu: state-ownership table](https://github.com/LambdaLabsML/distributed-training-guide/blob/aed748914472cca80d8cfe139ab43ec63103913a/01-single-gpu/train_llm.py) - Walk `train_llm.py` top to bottom and list every stateful object with its owner, dtype and per-step writer; then delete one saved entry at a time from a resumed run and record which deletion diverges the trajectory. Keep the table; later sharding units add an owner column per rank.

**Stop when:** Your table names every stateful object in your loop with its writer, and you can predict the symptom of deleting any single row.

<details>
<summary>Self-test</summary>

1. Which objects must be saved so an AdamW plus cosine-schedule run resumes its exact trajectory?
   - Model, optimizer, scheduler and scaler state dicts plus RNG states and the data position record. Weights alone restart the schedule and the scale history at the wrong point.
2. Why do BatchNorm running statistics need checkpointing if they receive no gradients?
   - They are updated by forward moving averages and used at evaluation. Restoring weights without them shifts every normalized activation at test time.
3. What does `zero_grad(set_to_none=True)` change about `.grad` ownership?
   - It sets `.grad` to None instead of zeros, and it is the default. The next backward allocates a fresh gradient; code that adds into `.grad` in between fails on None, and code that reads it sees None, not zeros.
4. A resumed run diverges although model and optimizer were restored. Name two other owners to check first.
   - Scheduler position and RNG plus loader position. A shifted schedule or a different example and dropout sequence changes every later update.

</details>

#### U5. Autograd graphs, backward scheduling, saved tensors and gradient hooks

**About 5 h** · **Target:** Explain + Implement

Topics: Autograd graph creation, backward scheduling and saved tensors; Gradient hooks, readiness order and synchronization side effects; Custom autograd Function with explicit forward and backward

Distributed overlap hooks into gradient readiness: a hook that fires late or mutates state delays or corrupts every collective built on top of it. The single-process ordering must be exact first.

**You can now**

- Explain how the backward graph is rebuilt each iteration, which tensors are saved for backward, and when each gradient becomes ready.
- Implement a custom autograd `Function` with explicit forward and backward and verify it against a numeric gradient.
- Predict hook firing order and which hook side effects break accumulation or overlap.

**Study**

1. [Graph encoding, saved tensors and hook order](https://docs.pytorch.org/docs/2.14/notes/autograd.html) (PyTorch Autograd mechanics note) - How autograd encodes the history with Saved tensors (`save_for_backward`, `_saved` attributes, pack and unpack hooks); Backward Hooks execution (whether each of `register_hook`, `register_post_accumulate_grad_hook`, node pre and post hooks fires, and their firing order).
2. [Differentiation problem and backward cost](https://mlsysbook.ai/vol1/frameworks/frameworks.html) (Machine Learning Systems Volume I - ML Frameworks, Model Training and Benchmarking) - ML Frameworks, Differentiation Problem: why reverse mode wins for a scalar loss over millions of parameters and the stored-intermediate memory price; the backward-at-twice-forward FLOP ratio is in the Model Training chapter.

**Focus**

- The graph is rebuilt from scratch every iteration: what you run is what you differentiate. Control flow may change the graph shape each step, so a hook registered on one iteration's node may not exist on the next.
- Only operations with at least one input requiring grad are recorded, and only leaves with `requires_grad=True` accumulate `.grad`. A `register_hook` fires while its gradient is computed; a `register_post_accumulate_grad_hook` fires once after accumulation into `.grad`, and only on leaves.
- Saved tensors are the forward intermediates backward needs: `x.pow(2)` saves its input for the gradient. Pack hooks run once at save time while unpack hooks may run many times; mutating their inputs in place is forbidden.
- In-place operations bump a version counter that is checked when backward unpacks a saved tensor, so an in-place change to a saved value raises. Mutation through `.data` skips the counter, so that route can still produce a silent wrong gradient.

**Reproduce:** From a blank file, implement a custom autograd `Function` for $`y = x^2`$ with `save_for_backward` in forward and the chain-rule product in backward, verify it against a finite-difference gradient, and log the firing order of a tensor hook versus a post-accumulate hook over two steps with accumulation.

**Traps**

- Misusing a post-accumulate hook. On a non-leaf tensor it errors even after `retain_grad()`; on a leaf it receives the parameter itself, not the gradient, so read `param.grad`. Picotron's `DataParallelNaive` hook all-reduces its argument, so it averages parameters and leaves the gradients unsynchronized.
- Mutating a gradient inside a `register_hook` and expecting later hooks to see the original. Hooks compose in order, so each sees the previous hook's output.
- Doing collective or CUDA-sync side effects inside a hook during overlap experiments. The hook runs inside backward scheduling, so a blocking call serializes the very overlap being measured.

**Practice**

- The section mini-project covers this: a custom autograd function or gradient hook with ordering, numerical-result and accumulation-interaction tests against a single-process oracle.

**Stop when:** Your custom Function matches finite differences, and you can predict for any hook whether it fires, when, and what it observes.

<details>
<summary>Self-test</summary>

1. Why does `y = x.pow(2)` keep `x` alive after forward?
   - Backward needs the input to compute $`2x`$. The gradient function saves it at forward time and releases it once backward completes, unless the graph is retained.
2. A tensor hook and a post-accumulate hook are registered on the same leaf. Which fires first?
   - The tensor hook, while that gradient is computed. The post-accumulate hook fires right after the gradient is accumulated into that leaf's `.grad`, still during backward, not at the end of the whole pass.
3. Backward is called twice without `retain_graph=True`. What fails and why?
   - The second call finds freed saved tensors. The first backward releases intermediates as it traverses unless retention was requested.
4. When does a node hook not fire although its tensor received a gradient?
   - When the node itself did not execute, for example a tensor passed as `inputs` to `torch.autograd.grad` whose `grad_fn` was skipped. Tensor hooks still fire; node hooks do not.

</details>

#### U6. FP32, TF32, BF16 and FP16 state, autocast and loss-scaling failures

**About 4 h** · **Target:** Explain + Derive + Measure

Topics: FP32, TF32, BF16 and FP16 state and accumulation choices; Mixed-precision autocast and loss scaling failure modes

Precision is a memory and stability contract: the wrong accumulation dtype silently deletes small updates, while the wrong loss scale deletes the gradients. Both look like a healthy run with worse results.

**You can now**

- Explain which training state lives in which precision and where accumulation must stay in FP32.
- Derive the per-dtype byte counts for parameters, gradients and optimizer state of a small model.
- Diagnose lost updates, underflowed gradients and overflowed products from a failing mixed-precision run.

**Study**

1. [Mixed Precision Training](https://arxiv.org/abs/1710.03740) (Mixed Precision Training) - Sections 1 to 3: FP32 master weights, loss scaling that lifts gradients above the FP16 underflow point $`2^{-24}`$ (values below the minimum normal $`2^{-14}`$ are subnormal and lose precision), and FP32 accumulation; Section 5 for the accuracy-matching evidence across architectures (arXiv:1710.03740v3).
2. [Dtype states and TF32](https://github.com/stas00/ml-engineering/blob/139708e52cb06f9191cf1d9959def9187b205c58/training/dtype.md) (Machine Learning Engineering Open Book - Training and PyTorch Debugging) - Tensor Precision with the ML dtype progression; TF32 (`allow_tf32` matmul and cudnn flags); When to use fp32 accumulators (LayerNorm, reductions, gradient accumulation and master weights).
3. [CS336 Assignment 2: mixed-precision accumulation](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/cs336_assignment2_systems.pdf) (CS336 Assignment 2 (Spring 2026) - Sections 2 and 3) - Section 2.1.5 `mixed_precision_accumulation`: the four-loop `0.01 * 1000` accumulation in fp32 versus fp16; Section 2.1.5 `benchmarking_mixed_precision`: `ToyModel` dtype table under `torch.autocast` and why LayerNorm is sensitive.

**Focus**

- Three techniques together make FP16 training match FP32: an FP32 master copy updated by the optimizer, a loss scale keeping small gradients representable in FP16, and FP32 accumulation of products. Each fixes a different failure.
- Autocast keeps parameters in FP32 while running matmuls in low precision: a CPU check shows a Linear output in `torch.bfloat16` with `weight.dtype` still FP32. Reductions and norms stay wide because they sum many small terms.
- TF32 is a process-global matmul mode, default `allow_tf32` False in PyTorch 2.14. It changes every matmul silently, so it belongs in the run manifest, not in model code.
- The 2018 paper predates BF16 and TF32. Its loss-scaling derivation still holds, but every BF16 range claim must come from the Stas notes or current docs, never from this paper.

**Reproduce:** Closed-book, run the four-loop accumulation (`0.01 * 1000` in fp32-on-fp32, fp16-on-fp16, fp32-on-fp16 and cast-back) and explain which loop drifts and why. Then show one overflow fixed by scaling the loss and one small-update loss fixed by FP32 accumulation.

**Traps**

- Testing loss scaling only on clean steps. The skip-and-backoff path runs only after an overflow: put an `inf` into one gradient and check that the step is skipped and the scale halves, from 65536 to 32768. This works on CPU in PyTorch 2.14.1.
- Casting the master weights to FP16 to save memory. Small updates then round to zero and the model freezes while the loss looks algorithmically stuck.
- Citing the 2018 paper for BF16 behavior. BF16 has the range of FP32 with short mantissa, the opposite tradeoff to FP16, and the paper predates it.

**Practice**

- [CS336 Assignment 2: `mixed_precision_accumulation` and `benchmarking_mixed_precision`](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/cs336_assignment2_systems.pdf) - Section 2.1.5 both problems on model sizes your hardware fits: the accumulation error table with a 2 to 3 sentence accuracy comment, and the autocast dtype table with the LayerNorm sensitivity explanation. These are writeup problems with no public tests; checking is your own error table plus the dtype table. Run the accumulation loops on CPU, the autocast table needs one GPU.

**Stop when:** Your accumulation table predicts which loop drifts, and you can attribute a new mixed-precision failure to scale, accumulation width or master-copy dtype.

<details>
<summary>Self-test</summary>

1. FP16 gradients underflow while FP32 loss looks fine. Which of the three techniques is missing or misset?
   - Loss scaling. In FP16, gradients below $`2^{-24}`$ round to zero and those below $`2^{-14}`$ already lose precision; scaling the loss up before backward and the gradients down before the step keeps them representable.
2. A BF16 run keeps parameters in FP32 under autocast. Why not store them in BF16 directly?
   - The optimizer needs the FP32 master copy so small updates accumulate instead of rounding away. Autocast casts to BF16 only for compute.
3. Why does LayerNorm stay in FP32 under autocast while linears run narrow?
   - It reduces over many elements, so narrow accumulation compounds rounding and its statistics need range. Linears are products plus a single accumulation that the backend keeps wide.
4. TF32 was enabled halfway through a study. Which comparisons break?
   - All matmul numerics across the flag change. TF32 rounds differently from FP32, so loss, gradient and timing comparisons across the change confound precision with the studied effect.

</details>

#### U7. Persistent, activation, temporary and allocator memory in one training step

**About 4 h** · **Target:** Derive + Measure

Topics: Persistent, activation, temporary and allocator memory accounting

OOMs are decided before the step runs: persistent state sets the floor, activations scale with batch and sequence, and the allocator decides what fits in practice. A ledger turns an OOM into an arithmetic error with a line number.

**You can now**

- Derive parameter, gradient, optimizer, activation, temporary and checkpoint bytes by dtype for a small model.
- Distinguish allocated, reserved and peak memory in a profiler snapshot and explain the gaps.
- Validate one predicted memory number against measurement and explain allocator and temporary-buffer differences.

**Study**

1. [Weight, gradient, optimizer and activation bytes](https://nanotron-ultrascale-playbook.static.hf.space/index.html#memory_usage_in_transformers) (Ultra-Scale Playbook - First Steps: Training on One GPU) - Memory usage in transformers: the FP32 and mixed-precision byte rules with the 1B, 7B, 70B and 405B table; the activation formula $`m_{\text{act}}`$ in sequence length, batch, width, heads and layers and its quadratic sequence dependence. Depth: Derive the table rows by hand; use the interactive calculator only after fixing sequence length and recomputation mode, since it does not display either.
2. [Second derivation of the training ledger](https://blog.eleuther.ai/transformer-math/) (Transformer Math 101) - Memory Requirements, Training: Model Parameters, Optimizer States, Gradients, Activations and Batch Size, Total Training Memory; Distributed Training, Sharded Optimizers for the ZeRO-1, ZeRO-2 and ZeRO-3 rows.
3. [Bottleneck signatures around the ledger](https://mlsysbook.ai/vol1/training/training.html) (Machine Learning Systems Volume I - ML Frameworks, Model Training and Benchmarking) - Model Training, Identifying Bottlenecks: MFU with the 7B, 1024-token, 1.2s A100 example at 11.5 percent, and the compute, memory and data-bound signatures that say which ledger row binds.

**Focus**

- Persistent bytes follow $`M = N \times w`$: element count times byte width. Mixed precision without FP32 gradient accumulation holds $`2 + 2 + 4 + 8 = 16`$ bytes per parameter; with FP32 gradient accumulation it holds 20. The book table checks: 1B gives 16 GB and 20 GB, 7B gives 112 GB and 140 GB.
- Eleuther counts the same 16 bytes differently: 2 for BF16 parameters, 2 for gradients and 12 for optimizer with the FP32 master inside. Reconcile presentations before comparing numbers across sources.
- Activations scale with batch and quadratically with sequence while persistent state does not. For long sequences activations dominate; for short ones the persistent rows do.
- Allocated is tensors alive, reserved includes the caching allocator pool, peak is the high-water mark. The Playbook budgets 1 to 2 GB for CUDA kernels on first use; measure yours, since lazy module loading makes it smaller, and fragmentation makes reserved exceed allocated even when the ledger balances.

**Reproduce:** Closed-book, ledger a 10M-parameter Adam model in mixed precision without FP32 gradient accumulation: parameters, gradients, optimizer and a stated activation shape in bytes. Then measure one row on your machine and explain the gap to allocator or temporary buffers.

**Traps**

- Quoting GB against GiB without converting. The book table uses GB; profiler snapshots and the CS336 3.6 GiB per-layer numbers use GiB, 7 percent apart.
- Treating mixed precision as memory saving for persistent state. It redistributes the same 16 bytes and adds 4 more with FP32 accumulation; the saving sits in activations and compute, not in the persistent rows.
- Reading the Playbook widget number against the formula with unstated widget state. Without its sequence length and recomputation mode the two cannot be compared.

**Practice**

- [TensorTonic: Mixed-Precision Training Memory Accountant](https://www.tensortonic.com/problems/cs336-l02-training-memory-accountant) - Implement `memory_accountant`: byte counts for parameters, gradients, saved activations and optimizer state (none for SGD, one per parameter for AdaGrad, two for Adam) from shapes and byte widths; the public cases check BF16 with FP32 gradients under Adam, FP32 SGD and BF16 AdaGrad. The problem excludes allocator overhead and master-weight copies by construction; state both exclusions when you compare its totals with your measured ledger.

**Stop when:** Your hand ledger predicts the measured persistent bytes within allocator noise, and you can name which row any batch, sequence or dtype change moves.

<details>
<summary>Self-test</summary>

1. A 1B-parameter model trains mixed precision with Adam, no FP32 gradient accumulation. What are the persistent bytes?
   - 16 GB: $`16 \times 10^9`$ bytes, as 2 GB parameters, 2 GB gradients, 12 GB optimizer with master, momentum and variance.
2. Why do Eleuther (2 plus 2 plus 12) and the Playbook (2 plus 2 plus 4 plus 8) agree?
   - Both sum to 16 bytes per parameter. Eleuther files the 4-byte FP32 master inside the 12-byte optimizer row; the Playbook lists it as a separate parameters row.
3. Allocated reads 0.85 GB while reserved reads 1.29 GB after a step. Is memory leaking?
   - Not necessarily. Reserved includes the allocator pool held for reuse plus fragmentation; allocated is live tensors. A leak needs growth across steps, not a reserved gap.
4. Batch doubles but persistent state is unchanged. Which row grows and how?
   - Activations grow linearly with batch (and quadratically with sequence). Parameters, gradients and optimizer state are batch independent.

</details>

#### U8. Activation checkpointing, recomputation cost and selective policies

**About 4 h** · **Target:** Derive + Measure

Topics: Activation checkpointing and recomputation trade-offs; Selective activation checkpoint policy

Activations are the elastic row of the ledger: checkpointing trades a bounded recompute cost for a large memory cut. The policy choice decides whether a bigger batch or a longer sequence fits.

**You can now**

- Derive the memory saving and extra forward cost of full versus selective checkpointing for a small stack.
- Apply `torch.utils.checkpoint` with `use_reentrant=False` and validate the peak-memory change by measurement.
- Choose checkpoint granularity from a memory profile instead of a rule of thumb.

**Study**

1. [Full versus selective recomputation](https://nanotron-ultrascale-playbook.static.hf.space/index.html#activation_recomputation) (Ultra-Scale Playbook - First Steps: Training on One GPU) - Activation recomputation: full checkpointing at layer boundaries costing up to 30 to 40 percent extra compute, selective checkpointing of attention at about 70 percent memory saving for 2.7 percent cost on GPT-3 175B, and the HFU versus MFU accounting that follows.
2. [CS336 Assignment 2: checkpointing mechanics](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/cs336_assignment2_systems.pdf) (CS336 Assignment 2 (Spring 2026) - Sections 2 and 3) - Section 3.1 autograd residuals with `saved_tensors_hooks` and Section 3.2.1 `gradient_checkpointing`: the memory-optimal nested strategy with asymptotics, then the single-level granularity choice on a model size your GPU fits (the handout uses `xl`) validated by peak-memory profile.

**Focus**

- Full checkpointing stores only layer-boundary activations and replays each layer forward in backward, adding up to a full extra forward pass. Selective checkpointing stores the cheap-to-keep feedforward activations and recomputes only attention, which is expensive to store but cheap to redo.
- Recompute cost belongs in the FLOP count honestly: hardware FLOPs include the replayed forward, model FLOPs exclude it. Recompute can raise HFU while MFU falls, because MFU improves only when the same model work finishes sooner.
- Checkpointing changes which tensors backward saves, not the mathematics. Gradients must match the uncheckpointed run; only the memory timeline and step time change.
- Pin `use_reentrant=False` explicitly. Omitting it in PyTorch 2.14.1 warns and falls back to the reentrant mode, which supports only `backward`, needs an input that requires grad, and always recomputes the whole region.

**Reproduce:** Closed-book, sketch the nested checkpoint plan for a stack of N identical blocks with its memory asymptotics. Then checkpoint one granularity on a tiny model, show gradients match the baseline and the peak-memory profile moves as predicted.

**Traps**

- Passing `preserve_rng_state=False` to skip the RNG bookkeeping while the region uses dropout. The replay then draws different masks and the gradients silently differ; with the default both modes replay torch RNG exactly, but randomness from other libraries is never replayed.
- Wrapping the loss or the optimizer step in a checkpointed region. Recompute replays forward ops only; step side effects replay wrongly or not at all.
- Comparing step times with and without checkpointing as pure overhead. The checkpointed run may fit a larger microbatch, so compare at equal global batch or not at all.

**Practice**

- [CS336 Assignment 2: `gradient_checkpointing`](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/cs336_assignment2_systems.pdf) - Section 3.2.1 on a model size your hardware fits: the nested-strategy asymptotics sketch, then the single-level granularity choice validated against the peak-memory profile of the neighboring sizes. A writeup problem with no public tests; checking is your gradient-equality test plus the before and after memory profiles.

**Stop when:** Your checkpointed run matches baseline gradients and your profile explains which granularity fits the next larger batch.

<details>
<summary>Self-test</summary>

1. Why does selective checkpointing target attention activations?
   - They grow largest with sequence length yet cost little to recompute per byte saved. Feedforward activations are cheaper to store relative to their recompute cost, so they are kept.
2. A checkpointed run matches loss but its step is slower. Is the optimization failing?
   - Not necessarily. Extra forward work is expected; the win is fitting a larger batch or longer sequence. Judge at equal global batch and memory, not per-step time alone.
3. Checkpointed and baseline gradients differ with dropout on. What is the first suspect?
   - RNG state across the replay. Forward randomness must be preserved and replayed identically; otherwise backward differentiates a different graph.
4. What distinguishes HFU from MFU when recomputation is on?
   - HFU counts the replayed forward in achieved FLOPs; MFU counts only the required forward and backward. Recompute raises hardware work while model work stays fixed.

</details>

#### U9. Step timelines and repeated-trial benchmark hygiene

**About 4 h** · **Target:** Measure

Topics: Input, transfer, forward, backward, optimizer and checkpoint timelines; Warmup, synchronization and repeated-trial benchmark hygiene

Without phase timers every optimization is a guess: input stalls look like slow kernels and allocator warmup looks like a regression. Timelines make the bottleneck state its name.

**You can now**

- Instrument one step into data, transfer, forward, backward, optimizer and checkpoint phases with honest synchronization.
- Run repeated trials with warmup and report mean, spread and exact settings instead of a best step.
- Attribute a slow step to its phase from timer evidence rather than from intuition.

**Study**

1. [CS336 Assignment 2: benchmarking method](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/cs336_assignment2_systems.pdf) (CS336 Assignment 2 (Spring 2026) - Sections 2 and 3) - Section 2.1.3 `benchmarking_script`: `benchmark.py` with selectable forward-only, forward plus backward and plus `optimizer.step` modes, `torch.cuda.synchronize` around `timeit.default_timer`, 5 warmup plus 10 measured steps with mean and standard deviation; Section 2.1.4 `nsys_profile` for the annotated trace.
2. [Per-phase timers and memory statistics](https://github.com/LambdaLabsML/distributed-training-guide/blob/aed748914472cca80d8cfe139ab43ec63103913a/01-single-gpu/train_llm.py) (Distributed Training Guide - Chapter 1 and Related Topics) - `LocalTimer` with `data`, `forward`, `backward` and `update` phases using `synchronize` plus `time.time`, `get_mem_stats` with current and peak allocation and reservation, and the per-`log_freq` logging line reporting loss, tokens per second and all four timers.
3. [What a benchmark must hold fixed](https://mlsysbook.ai/vol1/benchmarking/benchmarking.html) (Machine Learning Systems Volume I - ML Frameworks, Model Training and Benchmarking) - Benchmarking, Training Benchmarks: time to fixed quality rather than raw step speed, the full run envelope, and the distribution of accepted runs rather than a single best run; Benchmarking Best Practices: the methodology limits that decide whether a benchmark carries over to deployment.

**Focus**

- CUDA launches are asynchronous, so a timer without `torch.cuda.synchronize` measures launch time, not work time. `LocalTimer` synchronizes around every phase boundary and the CS336 script around every timed step.
- The first steps include allocator prep, compilation and cache fill, so they run slower and allocate differently. The CS336 5-warmup plus 10-measured pattern with 0 versus 1 to 2 warmup comparison exists to show this effect, not to hide it.
- Report mean and standard deviation over the measured steps with model size, batch, sequence, precision, hardware, backend and commit. A single fast step is a sample of one from an unknown distribution.
- Keep data, transfer, forward, backward, optimizer and checkpoint phases separate. The guide logs show all four timers plus tokens per second on every line so a slow step names its phase immediately.

**Reproduce:** Closed-book, write a three-mode timer (forward-only, forward plus backward, full step) with synchronization and warmup, and run it on a tiny model reporting mean and standard deviation per phase. Then remove warmup and synchronization one at a time and explain how each number lies.

**Traps**

- Timing the first step and calling it the step time. Allocator and compilation effects make it unrepresentative in both directions.
- Averaging across a checkpoint step. Checkpoint I/O belongs to its own phase; folding it into the mean hides both the steady step and the save cost.
- Comparing steps across machines or commits without restating settings. Interconnect, allocator state and kernel versions move numbers more than most optimizations.

**Practice**

- [CS336 Assignment 2: `benchmarking_script`](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/cs336_assignment2_systems.pdf) - Section 2.1.3 on the Table 1 sizes your hardware fits: all three timer modes with mean and standard deviation tables, plus the 0 versus 1 to 2 warmup comparison with its explanation. A writeup problem with no public tests; checking is your timing tables plus the annotated explanation. Needs one GPU; CPU timers cannot stand in for device phases.

**Stop when:** Your phase table attributes any slow step to a named phase, and a peer can rerun your exact settings from the report alone.

<details>
<summary>Self-test</summary>

1. Forward time measures near zero while backward looks normal. What is wrong with the timer?
   - Missing synchronization around the forward phase. The timer recorded kernel launch and returned while the GPU still worked; backward synchronized implicitly and absorbed the forward time.
2. Why do the CS336 instructions ask for runs with 0 and with 1 to 2 warmup steps?
   - To exhibit the warmup effect directly. The unwarmed mean mixes compilation and allocator prep with steady state; the comparison quantifies the bias warmup removes.
3. Tokens per second rises but time to fixed quality does not. Which benchmark view disagrees and why?
   - The training-benchmark view: time to quality counts convergence per token, while tokens per second counts throughput. A faster step that harms sample efficiency can lose on quality time.
4. One step in ten is far slower and the slow phase is data. What do you check first?
   - Loader workers, prefetch depth and storage versus local disk, not kernels. Periodic data-phase spikes with idle compute point at input starvation.

</details>

#### U10. PyTorch profiler traces, memory snapshots and NVTX ranges for a training step

**About 3 h** · **Target:** Measure

Topics: PyTorch profiler, memory snapshots and NVTX ranges

Coarse timers say which phase is slow; traces say why. A labeled step trace plus a snapshot turns hidden synchronization and retained state into visible events.

**You can now**

- Capture a profiler trace of one full training step with labeled ranges and explain every gap in it.
- Record a CUDA memory snapshot around a peak and attribute the largest allocations to a ledger row.
- Annotate loader, forward, backward and optimizer phases with NVTX ranges that survive into Nsight timelines.

**Study**

1. [PyTorch profiler recipe](https://docs.pytorch.org/tutorials/recipes/recipes/profiler_recipe.html) (PyTorch Profiler Recipes) - Using profiler to analyze execution time (`activities`, `record_shapes`, `record_function`, self versus total time); Using profiler to analyze memory consumption (`profile_memory`); Using tracing functionality (`export_chrome_trace`); Using profiler to analyze long-running jobs (`schedule` with wait, warmup and active plus `on_trace_ready`) (page read 2026-10-14).
2. [CS336 Assignment 2: traces and snapshots](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/cs336_assignment2_systems.pdf) (CS336 Assignment 2 (Spring 2026) - Sections 2 and 3) - Section 2.1.4 `nsys_profile`: `nsys profile` with cuda, cudnn, cublas, osrt, nvtx and backtrace flags, `torch.cuda.nvtx.range` annotation and warmup filtering; Section 2.1.6 `memory_profiling`: `_record_memory_history` with `_dump_snapshot` into the memory visualizer and the forward versus full-step Active timelines.
3. [NVTX markers and the allocator view](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 13 and 14) - Chapter 13, NVTX Markers and Profiling Tools; Chapter 13, Profiling PyTorch to Identify Bottlenecks with Using PyTorch Profiler; Chapter 13, Tuning the CUDA Memory Allocator; Chapter 13, Optimizing the Data Input Pipeline.

**Focus**

- Self time excludes children while total time includes them, so a large `model_inference` total with small self time points at the child operator holding the cost. Group by input shape to split one operator name across its call sites.
- A trace needs both activities: CPU shows launch order and gaps, CUDA shows kernel execution. A CPU gap with no kernel beneath is launch overhead or a synchronization stall, not compute.
- Snapshots record a few iterations only: start `_record_memory_history` just before the suspect region and dump right after, then render in the visualizer. Tracing a whole epoch produces an unreadable file.
- `record_function` and NVTX ranges are the labels that make a trace attributable. Wrap each phase so loader waits, forward, backward and optimizer appear as named spans in both the chrome trace and Nsight.

**Reproduce:** Closed-book, profile three steps of a tiny linear model on CPU with shapes and memory recording, print the top table by total CPU time, and export a chrome trace. Then annotate each phase with a named range and explain the largest gap in the trace.

**Traps**

- Profiling the first step and diagnosing steady state from it. Warmup kernels and allocator prep dominate the first trace; schedule wait plus warmup before the active window.
- Reading CPU-side operator time as device time. Without the CUDA activity the table hides kernel overlap and misattributes device stalls to host operators.
- Leaving memory history recording on for a full run. The buffer grows with every allocation event and perturbs the run it measures; scope it to a few iterations.

**Practice**

- [CS336 Assignment 2: `memory_profiling`](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/cs336_assignment2_systems.pdf) - Section 2.1.6 on a model size your GPU fits (the handout uses `xl`) at context 128 and 2048: forward versus full-step Active timeline images with stage labels, the 2 by 2 peak-memory table, and the largest-allocation stack-trace analysis. A writeup problem with no public tests; checking is your timeline images plus the peak table reconciled against the ledger. Needs one GPU.

**Stop when:** One labeled trace of your own step has no unexplained gap, and your snapshot attributes its peak to named ledger rows.

<details>
<summary>Self-test</summary>

1. The table shows `aten::conv2d` with large total time but tiny self time. Where is the cost?
   - In a child operator it calls. Self time excludes children, total includes them; descend to the child row holding the self time.
2. A trace shows a long CPU gap with no kernel running beneath it. What does that indicate?
   - Host-side stall: kernel launch overhead, a synchronization point, or the CPU waiting on data. No device work was even queued in that window.
3. Why does the long-running-jobs API use wait, warmup and active phases?
   - Wait skips unrepresentative early steps, warmup discards profiler-skewed samples at trace start, and active records the steady window. Continuous tracing would be slow and unreadable.
4. A snapshot shows peak far above the ledger prediction with many small blocks. What is the likely cause?
   - Allocator fragmentation or retained temporaries, not model state. Check the largest allocations with stack traces and whether freed blocks are reusable.

</details>

#### U11. `torch.compile` on a training step: graph boundaries, recompiles and breaks

**About 3 h** · **Target:** Explain + Measure

Topics: torch.compile graph boundaries, recompilation and graph breaks

Compilation moves work across the eager boundary: a break silently keeps the slow path while the config claims the fast one. Knowing where the graph ends says which optimizations actually apply.

**You can now**

- Explain what `torch.compile` captures, what forces a graph break, and what invalidates a compiled graph.
- Locate every graph break in one training step with `torch._dynamo.explain` and explain each in one sentence.
- Measure compiled versus eager step time honestly, with compilation time kept out of the steady-step mean.

**Study**

1. [Graph breaks and recompilations](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 13 and 14) - Chapter 13, PyTorch Compiler (`torch.compile`) with Using the PyTorch Compiler and Compilation Modes and Trade-Offs in Speed, Memory, and Compile Time; Chapter 14, Explaining and Minimizing Graph Breaks with Graph Breaks and TorchDynamo explain(), Minimize Graph Recompilations, and Debugging Compiler Phases, Graph Breaks, and Performance.
2. [CS336 Assignment 2: compile on the reference model](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/cs336_assignment2_systems.pdf) (CS336 Assignment 2 (Spring 2026) - Sections 2 and 3) - Section 3.1.1 Operator Fusion for `torch.compile` fusion and Section 4 `torch_compile` (2pt): compile the attention benchmarking script and then the whole Transformer, compare eager and compiled timing tables, and report where fusion helps and where it does not.

**Focus**

- Dynamo captures bytecode into graphs guarded on shapes, devices, grad mode and hook state. A CPU check of a compiled Linear reports Graph Count 1 with Break Count 0; any data-dependent branch or untraceable call splits the graph and runs the fragment eager.
- Guards explain recompiles: a new shape, a toggled grad mode, a changed hook table or a new argument structure re-triggers compilation. Stable training loops keep shapes and modes fixed for exactly this reason.
- Breaks preserve numerics but drop optimization scope. A step with many breaks is eager with extra overhead, so count breaks before quoting speedups.
- Compilation time is a first-step cost like allocator prep. Warm it up, then time steady steps; folding compile minutes into the step mean punishes the compiled run for one-off work.

**Reproduce:** Closed-book, compile a tiny Linear training step, print the explain graph and break counts, add one branch on a `.item()` value and show the break count rise (a branch on a tensor predicate alone may not break). Then time eager versus compiled steady steps with warmup separated from measurement.

**Traps**

- Quoting first-step compiled time as the compiled step time. Compilation happens once; steady steps are the comparison.
- Assuming fewer breaks always means faster. A single graph with tiny dynamic shapes can recompile every step, which is worse than two stable graphs.
- Calling `.item()` or printing a tensor inside the compiled step. Each forces a graph break and a device sync, so the step runs as fragments with a host round trip in the middle.

**Practice**

- [CS336 Assignment 2: `torch_compile`](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/cs336_assignment2_systems.pdf) - Section 4 `torch_compile` on a size your hardware fits: eager versus compiled comparison with the break and guard evidence for where fusion applies. A writeup problem; checking is your explain output plus honest steady-step tables with compilation kept separate. Needs one GPU for device-relevant breaks; CPU shows the counting method.

**Stop when:** You can point at every break in your own step, name the guard or construct behind it, and defend the compiled speedup with warmup excluded.

<details>
<summary>Self-test</summary>

1. Explain reports Graph Count 1 and Break Count 0 for a Linear. What does that promise?
   - The whole call captured as one graph under its guards. It promises nothing about speed; it only says no fragment fell back to eager.
2. A loop over varying sequence lengths recompiles every step. Which guard fires?
   - The shape guard. Each new shape invalidates the compiled graph; padding or bucketing to fixed shapes stops the storm.
3. A compiled step matches eager loss but runs slower. Name two suspects before blaming the compiler.
   - Graph breaks leaving most work eager with added overhead, and timing that includes compilation or allocator warmup in the compiled mean.

</details>

#### U12. Exact resume state and tiny deterministic fixtures for systems debugging

**About 5 h** · **Target:** Implement

Topics: Checkpoint contents, compatibility and exact resume state; Tiny deterministic fixtures for fast systems debugging

Systems debugging is iteration speed times certainty: a tiny fixture that resumes exactly lets every later fault experiment run in seconds with an oracle to check against.

**You can now**

- Specify the complete resume state for a training job and reject incompatible checkpoints explicitly.
- Build tiny deterministic fixtures that run a full interrupt and resume cycle in seconds on CPU.
- Prove uninterrupted versus resumed equivalence for data order, RNG draws and optimizer trajectory.

**Study**

1. [Tiny models and fast-debug discipline](https://github.com/stas00/ml-engineering/blob/139708e52cb06f9191cf1d9959def9187b205c58/debug/pytorch.md) (Machine Learning Engineering Open Book - Training and PyTorch Debugging) - Fast debug with Tiny Models, Tokenizers and Datasets: shrink width, depth, layers and data to the smallest case showing the bug, including the layer-count edit and the tiny-dataset recipe; Memory usage for the OOM triage that keeps fixtures small.
2. [Deterministic resume pattern](https://github.com/LambdaLabsML/distributed-training-guide/blob/aed748914472cca80d8cfe139ab43ec63103913a/related-topics/determinism/README.md) (Distributed Training Guide - Chapter 1 and Related Topics) - Save and restore of torch, NumPy, Python and CUDA RNG into `rng.pt` with `torch.use_deterministic_algorithms(True)`; the `01-single-gpu` resume branch in https://github.com/LambdaLabsML/distributed-training-guide/blob/aed748914472cca80d8cfe139ab43ec63103913a/01-single-gpu/train_llm.py as the commit-then-read pattern to copy.
3. [Subsystem Milestone A as the fixture contract](https://github.com/saisandeshk/Roadmap-Final/blob/e840bca144d922ddf2e4cf96dda24786c1d6675d/projects/tier-3/distributed-training-subsystem.md) (Distributed Training Subsystem) - Milestone A: frozen golden data, model and update with a hand-checked step, plus the single-process golden trainer everything later compares against.

**Focus**

- Complete resume state is model, optimizer, scheduler, scaler, every RNG stream, data position with dataset version, and the code and config identity. The fixture asserts all of them; a CPU check shows `get_rng_state` and `set_rng_state` round-tripping a `randn` draw exactly.
- Compatibility is a gate, not a warning: tokenizer identity, config version, manifest version and world layout must match before loading. Mismatched loads can produce confident wrong results instead of errors.
- Tiny means seconds on CPU with the same code paths: same sampler, same accumulation, same checkpoint format, miniature sizes. A fixture that swaps in toy logic for speed proves nothing about the real path.
- Equivalence has a tolerance policy stated up front. Bitwise identity holds for CPU deterministic replay with the same thread count and library build; GPU reductions and TF32-class modes need a norm tolerance with its justification.

**Reproduce:** From a blank file, build a CPU fixture with a fixed seed, a few dozen examples and a two-layer model that checkpoints mid-epoch, kills the run, resumes, and asserts identical example IDs, RNG draws, losses and parameters against an uninterrupted twin. Then change one config value and show resume refuses.

**Traps**

- Testing resume with the same process instead of a fresh one. In-memory state masks missing checkpoint rows; kill and relaunch to test what was actually written.
- Freezing the seed but not the data position. Identical RNG with a restarted cursor replays early examples and silently overtrains them.
- Validating on training loss alone. Loss can match while example order differs; assert consumed IDs and optimizer state, not just the scalar.

**Practice**

- The section mini-project covers this: frozen golden trainer, mid-run interruption with fresh-process resume, consumed-ID and optimizer-trajectory equivalence, and changed-config refusal.

**Stop when:** Your fixture interrupts and resumes to identical IDs, draws and parameters on CPU, and refuses a changed config with a named reason.

<details>
<summary>Self-test</summary>

1. Loss matches after resume but per-example IDs differ from the twin. Is resume correct?
   - No. Matching loss with different order is coincidence or averaging luck; the run trains a different example sequence and later updates diverge.
2. Why must the resume test relaunch a fresh process?
   - Only a fresh process reads exclusively from the checkpoint files. A same-process test inherits live optimizer, RNG and loader state that hides missing rows.
3. A fixture passes on CPU bitwise but fails bitwise on GPU. What changes?
   - The tolerance policy, not the verdict method. Parallel reduction order and matmul modes vary device results; assert a justified norm tolerance while keeping the CPU bitwise gate.
4. The checkpoint loads but the tokenizer version differs. Proceed?
   - No. Token IDs map to different embeddings and a different objective. Reject and re-tokenize or retrain from the compatible artifact.

</details>

### Mini-project: Single-process golden trainer founding trainlab

**About 12 to 16 hours.** Create trainlab and build its single-process core: a tiny transformer with a numerical oracle, a versioned corpus with deterministic sampling, and a frozen golden trainer. Every later section proves distributed equivalence against this core, so resume, lineage and ledgers must be exact here first.

1. Create `trainlab` with `manifests/`, `data/`, `model/`, `comm/`, `parallel/`, `plan/`, `ckpt/`, `faults/`, `trace/`, `ext/`, `tests/` and `reports/`; add a tiny transformer with a single-process oracle in `model/` and a versioned corpus with a tokenizer in `data/`.
2. Build a deterministic sampler over the versioned corpus with disjoint-coverage tests, stated padding and drop policies and document-to-batch lineage; interrupt a run mid-epoch and prove the resumed record-ID sequence matches the uninterrupted run.
3. Implement accumulation over uneven microbatches with size-weighted averaging and one optimizer step per global batch, matching a full-batch oracle; pass the TensorTonic gradient-accumulation cases and show the naive mean-of-means fails as predicted.
4. Tabulate every training state with owner, dtype and writer; ledger persistent bytes by dtype against measured tensors after the first optimizer update; pass the TensorTonic memory-accountant cases; show a loss-scaling overflow skips and recovers, and checkpointed recompute matches baseline gradients with a smaller peak.
5. Write a custom autograd `Function` with explicit forward and backward, checked against finite differences; log `register_hook` against `register_post_accumulate_grad_hook` order over accumulated steps and test each against the single-process oracle.
6. Freeze the golden trainer, interrupt it mid-run and resume in a fresh process from committed state only; prove consumed-ID and optimizer-trajectory equivalence with the uninterrupted run and refuse resume under a changed config with a named reason.
7. Instrument one step into data, transfer, forward, backward, optimizer and checkpoint phases with synchronization and warmup, reporting spread over repeated trials; capture a labeled profiler trace with memory recording and, on your GPU, a memory snapshot attributing the peak to ledger rows, and locate every `torch.compile` graph break with `torch._dynamo.explain`.

**Deliverables**

- The `trainlab` skeleton with `model/`, `data/`, `manifests/`, tests and the frozen golden trainer.
- Sampler, accumulation, autograd-hook and resume tests with oracle comparisons and the lineage evidence.
- State-ownership table, dtype-aware memory ledger, phase-timing report and the labeled step trace.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [TensorTonic: Gradient Accumulation Equivalence](https://www.tensortonic.com/problems/cs336-l02-gradient-accumulation-step). Pass the public uneven-size cases in your harness before the trainer comparison.
- external-tests: [TensorTonic: Mixed-Precision Training Memory Accountant](https://www.tensortonic.com/problems/cs336-l02-training-memory-accountant). Pass the public dtype cases; state the allocator and master-copy exclusions.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Sampler lineage | Interrupted and uninterrupted runs yield identical record-ID sequences under both padding policies with disjoint coverage proved. | A worker-seeding defect is seeded, caught by the tests, and the lineage traces any batch to document IDs. |
| Resume equivalence | Fresh-process resume from committed state matches the uninterrupted trajectory, and changed configs are refused with reasons. | Each state row dropped in turn fails its targeted check, and CPU resume matches exactly with the settings named. |
| State ledger | Hand ledger reconciles with measured tensors after the first update, and the accountant cases pass with exclusions stated. | One mispredicted row is explained to allocator or temporary buffers, and recompute keeps gradients while cutting peak. |
| Autograd correctness | Custom `Function` matches finite differences and hook order is logged against the oracle. | A broken backward is shown to fail the check, and accumulation interaction is tested. |
| Timing honesty | Phase timers use synchronization and warmup with spread reported, and the trace has no unexplained gap. | Removing warmup or sync is shown to move the numbers, and breaks are each explained. |

Feeds into: The golden trainer, sampler, oracle, manifests and ledgers feed every later parallel section and the capstone correctness core.

### Resource route

- **Primary - Book:** [Machine Learning Systems Volume I - ML Frameworks, Model Training and Benchmarking](https://mlsysbook.ai/vol1/training/training.html) - Read Model Training (Iron Law of Training Performance, Pipeline Architecture, Identifying Bottlenecks, Pipeline Optimizations), then ML Frameworks (Execution Problem, Differentiation Problem, Anatomy of a Training Step) at https://mlsysbook.ai/vol1/frameworks/frameworks.html and Benchmarking (Training Benchmarks, Benchmarking Best Practices) at https://mlsysbook.ai/vol1/benchmarking/benchmarking.html. Turn the reading into a state-ownership table and a deterministic train-resume trace before the CS336 exercises.
- **Required - Theory:** [Ultra-Scale Playbook - First Steps: Training on One GPU](https://nanotron-ultrascale-playbook.static.hf.space/index.html#first_steps:_training_on_one_gpu) - Read Memory usage in transformers, Activation recomputation and Gradient accumulation, then Appendix A1 on profiling. Derive weight, gradient, optimizer and activation bytes for your tiny model before measuring; the interactive calculator does not show its sequence length or recomputation setting, so compare it with the formulas only after setting both.
- **Required - Assignment:** [CS336 Assignment 2 (Spring 2026) - Sections 2 and 3](https://github.com/stanford-cs336/assignment2-systems) - Complete `benchmarking_script`, `nsys_profile`, `mixed_precision_accumulation`, `benchmarking_mixed_precision`, `memory_profiling` and `gradient_checkpointing` on model sizes your hardware fits, with your own solutions. Keep timing tables, memory predictions and failure notes; the FlashAttention kernel (Section 4) and the leaderboard (Section 9) are outside this stage.
- **Required - Lab:** [Distributed Training Guide - Chapter 1 and Related Topics](https://github.com/LambdaLabsML/distributed-training-guide) - Trace `01-single-gpu/train_llm.py` end to end with its README (argument parsing, model initialization, checkpoint save of model, optimizer and scheduler, timers and memory statistics), then the related-topics folders on determinism, gradient accumulation, effective batch size and optimized data loading. Produce a state-ownership table and prove identical data order and optimizer trajectory after a controlled interruption.
- **Required - Reference:** [Machine Learning Engineering Open Book - Training and PyTorch Debugging](https://github.com/stas00/ml-engineering) - Read training/README.md, training/dtype.md, training/reproducibility/README.md and the tiny-model, memory and profiling sections of debug/pytorch.md. Use its commands as a field checklist while diagnosing your own loop.
- **Support - Book:** [AI Systems Performance Engineering - Chapters 13 and 14](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) - Read Chapter 13 on NVTX markers, the PyTorch profiler, memory and allocator tuning, activation checkpointing and the data input pipeline, and the Chapter 14 sections on graph breaks and recompilation. Use them to explain one profiled step of your own trainer; treat bundled expectations as the author's hardware results.
- **Support - Guide:** [Transformer Math 101](https://blog.eleuther.ai/transformer-math/) - Use the compute, parameter, optimizer, gradient and activation memory equations as a second derivation of your memory ledger. Check each per-dtype byte count against your own trainer's state.
- **Support - Paper:** [Mixed Precision Training](https://arxiv.org/abs/1710.03740) - Read the sections on FP32 master weights, loss scaling and FP32 accumulation. Connect each to a failure your trainer can show: lost small updates, underflowed gradients or overflowed products.
- **Support - Reference:** [PyTorch Profiler Recipes](https://docs.pytorch.org/tutorials/recipes/recipes/profiler_recipe.html) - Use the profiler, memory snapshot and benchmark recipes only when the CS336 handout calls for them. Annotate one complete step and explain every visible gap or synchronization event.
- **Support - Practice:** [TensorTonic - Training Arithmetic Problems](https://www.tensortonic.com/study-plans/language-modeling-from-scratch) - Solve Training FLOP Estimator, Mixed-Precision Training Memory Accountant and Gradient Accumulation Equivalence (free problems in the Language Modeling from Scratch plan) before the CS336 measurements.
- **Support - Project:** [Distributed Training Subsystem](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-3/distributed-training-subsystem.md) - Start Milestone A with the deterministic sampler, state manifest, event trace and single-process oracle. Keep extending this repository through DT-9.
- **Reference - Reference:** [PyTorch data loading API - DataLoader, Sampler and multi-process loading](https://docs.pytorch.org/docs/2.14/data.html) - Read Data Loading Order and Sampler, Single- and Multi-process Data Loading with its Randomness subsection, and the DistributedSampler entry for `set_epoch`, `drop_last` padding and worker seeding. Use it to define sampler position and worker sharding for the lineage and resume units.
- **Reference - Reference:** [PyTorch Autograd mechanics note](https://docs.pytorch.org/docs/2.14/notes/autograd.html) - Read How autograd encodes the history with Saved tensors, Hooks for saved tensors, and Backward Hooks execution (whether each hook fires and in which order). Use it for the autograd graph, saved-tensor and hook-ordering claims.

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

### Study units

#### U1. Processes, global and local rank, world size and one process per device

**About 3 h** · **Target:** Explain

Topics: Processes, global rank, local rank and world size; Device placement and one-process-per-device convention

Every collective names its participants by rank. A wrong rank map turns each later group and collective into a hang or a silent mismatch, so ranks come before any communication.

**You can now**

- Explain global rank, local rank and world size, and state which launcher variables set each.
- Explain the one-process-per-device convention and predict what breaks when two ranks share one GPU.
- Map a stated node and GPU count to global ranks, node-local ranks and device choices.

**Study**

1. [Setup and the All-Reduce example (page read 2026-10-14)](https://docs.pytorch.org/tutorials/intermediate/dist_tuto.html) (Writing Distributed Applications with PyTorch) - Setup: the spawn template with `MASTER_ADDR`, `MASTER_PORT` and `dist.init_process_group`, then Collective Communication with `dist.new_group` and the `dist.all_reduce` example.
2. [A0 opening through Broadcast setup](https://nanotron-ultrascale-playbook.static.hf.space/index.html#a0:_parallel_programming_crash_course) (Ultra-Scale Playbook - A0: Parallel Programming Crash Course) - A0 Parallel Programming Crash Course, from its opening through the Broadcast setup code with `dist.get_rank`. Depth: Read for the rank and world-size vocabulary. The prose misspells the init call as `dist.initi_process_group` (the code spells it right), and the snippets assume NCCL with one GPU per rank through `torch.cuda.set_device(dist.get_rank())`. For CPU practice switch the backend to `gloo` and drop the `.cuda()` calls; the Reduce example also prints an undefined `rank`.
3. [Ranks and the process group](https://www.youtube.com/watch?v=XoGvCBRnwLs&t=18920s) (Building a Distributed Training Framework from First Principles) - From 5:15:20 to about 5:20:00 (hours:minutes:seconds): what torchrun assigns as global and local rank and why a process group is created.

**Focus**

- Global rank $`r`$ with $`0 \le r < W`$ names one process in a run of $`W`$ processes. Local rank names the same process inside its node. World size $`W`$ is the process count, not the GPU count.
- `RANK`, `WORLD_SIZE` and `LOCAL_RANK` come from the launcher. `MASTER_ADDR` and `MASTER_PORT` tell every process where rank 0 waits for the handshake.
- Plan one process per GPU and set the device from the local rank, as in `torch.cuda.set_device(local_rank)`. Two ranks sharing one GPU serialize kernels and break the one-device-per-rank NCCL setup.

**Reproduce:** Closed-book, map 2 nodes with 4 GPUs each under one launcher job of 8 processes: the world size, the global ranks on each node, each rank's local rank, and the device each rank sets. Then state which rank holds local rank value 1 on the second node.

**Traps**

- Reading local rank as global rank on the second node. Local ranks restart at 0 on each node.
- Launching more processes than GPUs and assigning two ranks to one device. NCCL expects one device per rank.
- Setting WORLD_SIZE to a value that disagrees with the spawned process count. The init handshake waits for processes that never arrive.

**Practice**

- [Writing Distributed Applications with PyTorch: Setup and All-Reduce example](https://docs.pytorch.org/tutorials/intermediate/dist_tuto.html) - Adapt the Setup template and the All-Reduce example to `torchrun --nproc-per-node 4` with the gloo backend: print `dist.get_rank` and `dist.get_world_size` on each rank and assert that all-reducing ones gives the world size. Run on CPU with four processes and a distinct port. Keep the GPU device lines for a later run with four GPUs.

**Stop when:** Your rank table for a two-node layout is correct, and the four-process gloo run prints consistent ranks with the expected all-reduce sum.

<details>
<summary>Self-test</summary>

1. Two nodes hold 4 GPUs each and one job launches 8 processes. Which global ranks sit on node 1, and what is the local rank of global rank 6?
   - Node 1 holds global ranks 4 to 7. Rank 6 has local rank 2 and uses the third GPU of that node.
2. What does `dist.init_process_group` exchange between processes?
   - Only handshake locations through the master address and port, a shared file, or a TCP endpoint. No tensors move; setup only makes later communication possible.
3. A snippet calls `dist.all_reduce(tensor, dst=0)`. Why is that wrong?
   - `dist.all_reduce` takes no `dst` argument, and every rank keeps the reduced result. The `dst` argument belongs to `dist.reduce`, whose result is valid only on the root.
4. Two ranks share one GPU and both call NCCL collectives. What breaks?
   - The one-device-per-rank setup breaks. Kernels from both ranks serialize on the shared device, and the communicator is built per device, so sharing is unsupported even when it appears to start.

</details>

#### U2. Rendezvous, stores, launchers and default and nested process groups

**About 4 h** · **Target:** Explain + Implement

Topics: Rendezvous, stores, launchers and process-group lifecycle; Default and nested process groups

Collectives run inside named groups, not on bare machines. The store handshake and the group grid decide who talks to whom before any tensor moves.

**You can now**

- Explain rendezvous, stores and launchers, and what the process-group lifecycle owns.
- Build the default world group plus nested subgroups for a stated 2 by 2 layout.
- Predict init hangs from a mismatched world size, endpoint or mesh shape.

**Study**

1. [Initialization methods (page read 2026-10-14)](https://docs.pytorch.org/tutorials/intermediate/dist_tuto.html) (Writing Distributed Applications with PyTorch) - Initialization Methods: Environment Variable, Shared File-System with the fcntl locking warning, and TCP.
2. [Single-node and elastic launch flags](https://docs.pytorch.org/docs/2.14/elastic/run.html) (PyTorch 2.14 torchrun (elastic launch) reference) - Single-node multi-worker through the elastic membership rows: `RANK`, `WORLD_SIZE` and `LOCAL_RANK`, plus flags `--standalone`, `--nnodes`, `--nproc-per-node`, `--rdzv-backend` and `--rdzv-endpoint`.
3. [ProcessGroupManager grid and subgroup enumeration](https://github.com/huggingface/picotron/blob/59714b1bf25541dbeb6f5a721ed15f6d0768e786/picotron/process_group_manager.py) (Picotron - Process Groups and Communication Files) - `ProcessGroupManager` through `setup_process_group_manager`: the `arange` grid over `dp`, `pp`, `cp` and `tp` plus `new_subgroups_by_enumeration`.
4. [Steps 1 to 3 with diffs and the Part 1 video](https://github.com/huggingface/picotron_tutorial) (Picotron Tutorial - Steps 1 to 3 and Part 1 Video) - step2_process_group_manager and step3_dataloader with their diffs and the Part 1 video on the model, the process group manager and the dataloader. Depth: Rebuild the rank grid yourself before reading the solution.

**Focus**

- A store is a key-value handshake; the rendezvous stores are `TCPStore` and `FileStore`. The launcher starts the processes, rendezvous introduces them, and `dist.init_process_group` builds the world group.
- The default group holds all $`W`$ ranks. `dist.new_group` carves named subsets, one rank may belong to several groups at once, and each group orders its own collectives.
- Picotron lays ranks out as `torch.arange(world).view(dp, pp, cp, tp)` and enumerates one subgroup per axis. Every rank must build the identical grid or the groups disagree silently.
- File init needs a nonexistent or empty shared file with fcntl locking. Mesh shapes must match on all ranks or setup hangs.

**Reproduce:** Closed-book, take world size 4 with dp 2 and tp 2 in Picotron axis order: write the tensor-parallel groups and the data-parallel groups as rank sets.

**Traps**

- Reusing one fixed MASTER_PORT for several concurrent runs. The second job fails or joins the wrong rendezvous, so use a distinct port per run.
- Deriving the local rank from the global rank in example code, as in `rank % torch.cuda.device_count()`. It breaks when nodes hold different GPU counts or ranks are not packed node by node; read the `LOCAL_RANK` the launcher sets.
- Assuming subgroups inherit a barrier or an ordering from the world group. Each group needs its own calls in the same order.

**Practice**

- [Picotron Tutorial: Steps 1 to 3 (process group manager and dataloader)](https://github.com/huggingface/picotron_tutorial) - step2_process_group_manager and step3_dataloader with their diffs: rebuild the rank grid yourself, then diff against the solution. Keep the Part 1 video for the second pass over the same steps.

**Stop when:** Your hand-drawn groups match the subgroup enumeration on CPU, and a subgroup barrier passes on four processes.

<details>
<summary>Self-test</summary>

1. What does the store do, and when is it no longer needed?
   - Ranks exchange their addresses through it during init, so they can find each other. It stays in use after init: `new_group` coordinates through it, `monitored_barrier` reports through it, and errors are shared through it. Collective payloads never pass through the store.
2. World size 4 with dp 2 and tp 2 in Picotron order: which ranks share a tensor-parallel group, and which share a data-parallel group?
   - Tensor-parallel groups are {0, 1} and {2, 3}. Data-parallel groups are {0, 2} and {1, 3}.
3. Rank 0 of a subgroup calls `all_reduce` but rank 1 of the same subgroup calls `broadcast`. What happens?
   - The calls never pair up. On gloo with the default debug level both ranks block until the timeout; with `TORCH_DISTRIBUTED_DEBUG=DETAIL` the wrapper compares collective fingerprints and both ranks fail at once with "Detected mismatch between collectives on ranks". Every member must issue the same sequence, and subgroups do not inherit ordering from the world group.
4. Two jobs on one machine share MASTER_PORT. What goes wrong?
   - The second job either fails to bind or rendezvous with the wrong peers. Give each run its own port.

</details>

#### U3. Point-to-point transfers, broadcast and reduce ownership

**About 4 h** · **Target:** Implement

Topics: Point-to-point send and receive semantics; Broadcast and reduce ownership semantics

Pipelines move activations along single edges, not group averages. One unmatched send or one read of a stale root buffer corrupts the handoff silently.

**You can now**

- Implement matched send and receive pairs with blocking and non-blocking calls.
- Implement broadcast and reduce and state exactly which ranks hold valid results.
- Predict the deadlock or stale read from an unmatched pair or an early buffer access.

**Study**

1. [Point-to-point listings and wait rules (page read 2026-10-14)](https://docs.pytorch.org/tutorials/intermediate/dist_tuto.html) (Writing Distributed Applications with PyTorch) - Point-to-Point Communication: the blocking listing, the non-blocking listing with `dist.isend` and `dist.irecv`, and the two undefined-behaviour rules before `req.wait()`.
2. [Broadcast and reduce bullets (page read 2026-10-14)](https://docs.pytorch.org/tutorials/intermediate/dist_tuto.html) (Writing Distributed Applications with PyTorch) - Collective Communication: the `dist.broadcast` and `dist.reduce` bullets plus the `ReduceOp` list with `SUM`.
3. [Point-to-point, Broadcast and Reduce](https://github.com/stas00/ml-engineering/blob/139708e52cb06f9191cf1d9959def9187b205c58/network/comms.md) (Machine Learning Engineering Open Book - Communication Patterns) - Point-to-point communications with send, recv, isend and irecv, then Broadcast and Reduce with their call signatures.
4. [Send, receive and pipeline handoffs](https://www.youtube.com/watch?v=XoGvCBRnwLs&t=25685s) (Building a Distributed Training Framework from First Principles) - From 7:08:05 to about 7:10:00 (hours:minutes:seconds): send and receive as point-to-point primitives, with the pipeline send near 9:59:00 to 10:00:00 as the use case.

**Focus**

- Every `dist.send` names a dst and every `dist.recv` names a src, with a preallocated buffer of matching shape and dtype on the receiving rank. Blocking calls return after completion; immediates return a `Work` handle that requires `req.wait()`.
- After `dist.isend`, writing the sent tensor is undefined until wait. After `dist.irecv`, reading the receive buffer is undefined until wait. After wait, the transfer is guaranteed.
- Broadcast copies one source tensor to all ranks. Reduce combines every rank into dst only; other ranks' tensors are left undefined, and gloo uses them as scratch for partial sums.
- A send with no matching receive, or a receive with no send, blocks until the group timeout. The matched pair is the unit that must agree.

**Reproduce:** Closed-book, write the two-process exchange: rank 0 builds a 3-element tensor and sends it to rank 1 with isend and irecv plus wait, then rank 1 broadcasts it back so both ranks hold it. State every buffer each rank allocates.

**Traps**

- Allocating the receive buffer with the wrong shape or dtype. On gloo the receiving process aborts with "Received data size doesn't match expected size", killing the rank instead of raising a Python error; other backends may hang or corrupt. Allocate from the agreed shape.
- Reading a reduce result on a non-root rank. Only dst holds the combined value.
- Reusing a send buffer right after isend without wait. The transfer may still be in flight.

**Practice**

- [Writing Distributed Applications with PyTorch: point-to-point listings](https://docs.pytorch.org/tutorials/intermediate/dist_tuto.html) - Blocking plus Non-blocking listings on two gloo CPU processes: assert both ranks end with 1.0, then extend the script with the two-process exchange from Reproduce. Run with `torchrun --nproc-per-node 2` and a distinct port. Never touch a buffer before its wait.

**Stop when:** The exchange passes on two processes, and you can name every valid and every stale buffer without notes.

<details>
<summary>Self-test</summary>

1. What is the observable difference between `dist.send` with `dist.recv` and `dist.isend` with `dist.irecv`?
   - The blocking pair returns after the transfer completes. The immediate pair returns a `Work` handle at once, and the transfer is only guaranteed after `req.wait()`.
2. Rank 0 calls isend on a tensor, then overwrites the tensor before wait. Rank 1 receives after its own wait. What can rank 1 hold?
   - Anything, including a mix of old and new values. Writing a sent buffer before wait is undefined behaviour.
3. Four ranks call `dist.reduce` with `dst=0` and `SUM`. Afterwards rank 2 reads its tensor. What does it see?
   - Nothing it can rely on. Only rank 0 is guaranteed the sum; on gloo in PyTorch 2.14.1 a 4-rank run with inputs 1 to 4 left partial sums such as [9, 9, 10, 10, 2, 2, 5, 5] in rank 1's tensor. Treat non-destination buffers as scratch, or broadcast the result if other ranks need it.
4. Rank 0 sends to rank 1, but rank 1 never posts a receive and instead calls `all_reduce`. What happens?
   - Both block until the timeout. The send waits for a matching receive that never comes, and rank 1 waits at a collective rank 0 never joins.

</details>

#### U4. All-reduce, gradient averaging and the all-gather and reduce-scatter duality

**About 4 h** · **Target:** Derive + Implement

Topics: All-reduce semantics and gradient averaging; All-gather and reduce-scatter duality

Data-parallel training is one repeated all-reduce. The ring duality also decides how sharded training later splits one average into two cheaper halves.

**You can now**

- Derive per-rank bytes and steps for the ring forms of all-reduce, all-gather and reduce-scatter.
- Implement all three on several CPU processes and check every rank against a single-process oracle.
- Explain gradient averaging as a sum followed by a division, and state where each part happens.

**Study**

1. [Six primitives, the bandwidth lower bound and ring all-reduce](https://mlsysbook.ai/vol2/collective_communication/collective_communication.html) (Machine Learning Systems Volume II - Collective Communication) - Choosing the Vehicle with The six core primitives, then Engineering the Flow with The bandwidth-optimal lower bound and Ring AllReduce.
2. [Gradient averaging and the ring challenge (page read 2026-10-14)](https://docs.pytorch.org/tutorials/intermediate/dist_tuto.html) (Writing Distributed Applications with PyTorch) - Distributed Training: the `average_gradients` function with `dist.all_reduce` and division by world size, then Our Own Ring-Allreduce with the `torch.chunk` exercise.
3. [Collective decomposition demo](https://github.com/stanford-cs336/spring2025-lectures/blob/b98b08a98d9d47a69bbdcb4e96a58aa48ee4d13b/lecture_08.py) (CS336 Spring 2025 - Lecture 8 Parallelism (executable lecture)) - `collective_operations` plus `torch_distributed` with `collective_operations_main`: the live `all_reduce`, `reduce_scatter_tensor` and `all_gather_into_tensor` sequence that proves the decomposition.
4. [Ring costs for all-gather, reduce-scatter and all-reduce](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/cs336_assignment2_systems.pdf) (CS336 Assignment 2 (Spring 2026) - Sections 5.1 and 8.1) - Section 8.1, Communication Primitives (pp. 40 to 41): the ring all-gather, ring reduce-scatter and ring all-reduce costs in the rendered equations.

**Focus**

- Ring all-reduce is a reduce-scatter followed by an all-gather. With $`N`$ ranks and payload $`S`$, each half moves $`\frac{N-1}{N} S`$ bytes per rank, so all-reduce moves $`2 \frac{N-1}{N} S`$.
- Gradient averaging is `dist.all_reduce(param.grad.data, op=dist.ReduceOp.SUM)` on every rank, then division by the world size. The sum is collective; the division is local.
- All-gather takes one tensor per rank and returns a length-$`N`$ list on every rank. Reduce-scatter takes a list of per-rank inputs and returns one shard per rank.
- The tutorial ring challenge sends full buffers, not chunks. Chunking into $`N`$ pieces is what turns its $`(N-1) S`$ cost into the ring cost above.

**Reproduce:** By hand, take 4 ranks and a 1 GB payload: reduce-scatter moves 0.75 GB per rank, all-gather moves 0.75 GB per rank, and ring all-reduce moves 1.5 GB per rank. Then run all three on 4 gloo CPU processes and match every rank against the single-process sums.

**Traps**

- Passing one stacked tensor to `dist.reduce_scatter`. It takes a list of per-rank input tensors and raises a type error otherwise.
- Forgetting the division by world size after a SUM all-reduce. Every update then silently uses a learning rate scaled by worker count.
- Treating reduce-scatter as a cheaper drop-in for all-reduce. It returns only one shard per rank; the all-gather half is still owed.

**Practice**

- [TensorTonic: Simulate Distributed Collectives](https://www.tensortonic.com/problems/cs336-l07-simulate-collectives) - The `all_gather` and `reduce_scatter` public cases: rank-ordered concatenation and equal contiguous chunks of the sum. The `all_to_all` case belongs to the token-exchange unit; solve it there.
- [Writing Distributed Applications with PyTorch: gradient averaging](https://docs.pytorch.org/tutorials/intermediate/dist_tuto.html) - The `average_gradients` function on 4 gloo CPU processes: compare every parameter gradient against a single-process run on the joined batch. Keep the MNIST data lines for the data-parallelism section; here a small fixed tensor batch is enough.

**Stop when:** Your hand bytes match the ring formulas, the TensorTonic cases pass, and all three gloo collectives match the single-process oracle on every rank.

<details>
<summary>Self-test</summary>

1. Four ranks all-reduce a 1 GB gradient buffer. How many payload bytes cross each rank, and how does that compare with a naive full-buffer ring?
   - Ring all-reduce moves $`2 \times 3/4 \times 1`$ GB = 1.5 GB per rank. A naive ring that forwards full buffers moves $`(4-1) \times 1`$ GB = 3 GB per rank, twice as much.
2. The tutorial all-reduces gradients and then divides by the world size. Would dividing first be wrong?
   - No. Sum then divide and divide then sum both give the mean. DDP divides each bucket by the world size before its all-reduce, which also keeps low-precision sums smaller. The bug to avoid is dividing twice or not at all.
3. Two ranks hold [1, 2, 3, 4] and [10, 20, 30, 40]. What does each rank hold after reduce-scatter with SUM?
   - Rank 0 holds [11, 22] and rank 1 holds [33, 44]: chunk 0 and chunk 1 of the elementwise sum.
4. All-gather and reduce-scatter each move about half the bytes of all-reduce. When does that factor of 2 fail?
   - For small latency-bound messages, where startup cost dominates bytes moved. The factor of 2 holds in the bandwidth-bound regime with equal payloads.

</details>

#### U5. All-to-all semantics and token exchange

**About 3 h** · **Target:** Implement

Topics: All-to-all and token exchange semantics

Expert and sequence-parallel designs move distinct data to distinct destinations. That pattern is all-to-all, and it stresses the network in the opposite way from an average.

**You can now**

- Explain all-to-all from input and output ownership on each rank.
- Implement all-to-all on several CPU processes and check the per-rank mix against an oracle.
- Contrast token exchange with gradient averaging and state which later layers route tokens.

**Study**

1. [All-to-all](https://github.com/stas00/ml-engineering/blob/139708e52cb06f9191cf1d9959def9187b205c58/network/comms.md) (Machine Learning Engineering Open Book - Communication Patterns) - All-to-all with the `dist.all_to_all` call and the Ulysses sequence-parallel and MoE expert-parallel uses.
2. [All-to-all contention and the MoE example](https://mlsysbook.ai/vol2/collective_communication/collective_communication.html) (Machine Learning Systems Volume II - Collective Communication) - Choosing the Vehicle with The six core primitives: the all-to-all row with its $`O(N^2)`$ contention note, plus the MoE message-size example.
3. [All-to-all meaning and the two-step exchange](https://www.youtube.com/watch?v=XoGvCBRnwLs&t=35875s) (Building a Distributed Training Framework from First Principles) - From 9:57:55 to about 10:00:00 (hours:minutes:seconds) for the all-to-all meaning, then https://www.youtube.com/watch?v=XoGvCBRnwLs&t=69724s from 19:22:04 to about 19:24:00 for why one exchange carries counts and a second carries data. Depth: Watch the semantics segments only. Skip the expert-parallel implementation around them; it belongs to the MoE section.

**Focus**

- All-to-all takes a list of per-destination inputs on each rank. Rank $`r`$ receives chunk $`r`$ from every source, concatenated in source-rank order, so each rank ends with a different mix.
- All-reduce gives every rank the same aggregate. All-to-all gives each rank a different slice. Token routing needs the second pattern.
- All-to-all fan-out grows as $`O(N^2)`$ logical pairs, so contention bounds it where per-node bytes bound all-reduce. Small routed messages are latency-bound.
- The gloo backend runs `dist.all_to_all` on CPU in PyTorch 2.14, although the backends table marks it unsupported. Test it instead of routing around it.

**Reproduce:** By hand, take rank inputs `[[1, 2, 3, 4], [5, 6, 7, 8]]`: rank 0 receives `[1, 2, 5, 6]` and rank 1 receives `[3, 4, 7, 8]`. Then run `dist.all_to_all` on 2 gloo CPU processes and match both ranks.

**Traps**

- Assuming all-to-all concatenates like all-gather. All-gather gives every rank the same concatenation; all-to-all gives each rank its own chunk from each source.
- Passing single tensors instead of per-rank lists. Both the input and the output of `dist.all_to_all` are lists with one entry per rank.
- Passing uneven per-rank lists to `dist.all_to_all`. On gloo that aborts the process with "invalid tensor size". Ragged routing exchanges counts first and then calls `dist.all_to_all_single` with input and output split sizes, or pads every chunk to one size.

**Practice**

- [TensorTonic: Simulate Distributed Collectives](https://www.tensortonic.com/problems/cs336-l07-simulate-collectives) - The `all_to_all` public case: chunk $`r`$ from each source concatenated in source-rank order. Solve the `all_gather` and `reduce_scatter` cases in the duality unit first, then finish with this case.

**Stop when:** Your hand result, the TensorTonic case and the gloo run all agree on both ranks, and you can contrast the all-to-all mix with the all-reduce aggregate without notes.

<details>
<summary>Self-test</summary>

1. Two ranks hold [1, 2, 3, 4] and [5, 6, 7, 8]. What does each rank hold after all-to-all?
   - Rank 0 holds [1, 2, 5, 6] and rank 1 holds [3, 4, 7, 8]: chunk 0 from each source lands on rank 0, chunk 1 on rank 1.
2. Why does expert routing use all-to-all rather than all-reduce?
   - Each token must reach one specific expert rank, so destinations need distinct payloads. All-reduce would give every rank the same sum, which cannot route.
3. Why is all-to-all contention-sensitive while ring all-reduce keeps constant per-node bytes?
   - All-to-all opens a logical pair per rank pair, so pairs grow quadratically while all-reduce only talks to ring neighbours with constant bytes per node.
4. Rank 0 sends 3 tokens to rank 0 and 1 to rank 1; rank 1 sends 2 to rank 0 and 2 to rank 1. What split sizes does each rank pass to `all_to_all_single`, and why must counts move first?
   - Rank 0 passes input splits [3, 1] and output splits [3, 2]; rank 1 passes input splits [2, 2] and output splits [1, 2]. Output splits are the other ranks' input counts, so a first all-to-all of counts tells each rank how much to receive before the data exchange.

</details>

#### U6. Barriers, collective ordering and shape and dtype agreement

**About 4 h** · **Target:** Explain + Implement

Topics: Barrier use, misuse and implicit synchronization; Collective ordering and shape or dtype agreement

Most distributed hangs are ordering faults, not network faults. The fix is a discipline about call order and metadata agreement, applied before any debugging tool.

**You can now**

- Explain why every member of a group must issue the same collective sequence.
- Predict hang or corruption from conditional, reordered or shape-mismatched collectives.
- Use barriers and short timeouts to localize an ordering fault to the guilty rank.

**Study**

1. [Ordering, barriers and debug entries](https://docs.pytorch.org/docs/2.14/distributed.html) (PyTorch 2.14 `torch.distributed` reference) - The `batch_isend_irecv` ordering rule, the barrier and `monitored_barrier` entries, and `TORCH_DISTRIBUTED_DEBUG` with `OFF`, `INFO` and `DETAIL`.
2. [A0 Barrier section](https://nanotron-ultrascale-playbook.static.hf.space/index.html#a0:_parallel_programming_crash_course) (Ultra-Scale Playbook - A0: Parallel Programming Crash Course) - A0 Parallel Programming Crash Course, the Barrier section with the sleep demonstration and `dist.barrier`. Depth: Read the arrival semantics only. The sleep demo shows waiting, not data movement.
3. [Pipeline communicate ordering](https://github.com/huggingface/picotron/blob/59714b1bf25541dbeb6f5a721ed15f6d0768e786/picotron/pipeline_parallel/pp_communications.py) (Picotron - Process Groups and Communication Files) - `pipeline_communicate` with `recv_forward`, `send_forward`, `recv_backward` and `send_backward` through `batch_isend_irecv`. Depth: Read how operations pair sends with receives in a fixed order. Leave the stage schedule for the pipeline section.
4. [Barrier as a rendezvous point](https://www.youtube.com/watch?v=XoGvCBRnwLs&t=47874s) (Building a Distributed Training Framework from First Principles) - From 13:17:54 to about 13:18:30 (hours:minutes:seconds): all devices wait until every rank arrives at the barrier.

**Focus**

- Every rank in a group must invoke the same collectives in the same order with agreeing shapes and dtypes. Any deviation hangs or corrupts, because there is no central scheduler to reconcile the calls.
- `dist.barrier` blocks until all ranks in the group arrive. It synchronizes arrival only; it moves no tensors and fixes no data skew.
- Conditional collectives, where only some ranks enter the call, are the classic hang. So are swapped orders, such as rank 0 calling all-reduce then broadcast while rank 1 calls broadcast then all-reduce.
- `dist.monitored_barrier` with a short timeout plus `TORCH_DISTRIBUTED_DEBUG=DETAIL` names the rank that never arrived. The default 30-minute gloo timeout turns every hang into a long silence.

**Reproduce:** Closed-book, write the order-swap drill on 2 gloo CPU processes with a 20-second timeout: rank 0 calls all-reduce then broadcast while rank 1 calls broadcast then all-reduce. Predict the timeout, then fix the order and show both calls pass.

**Traps**

- Using a barrier as if it synchronizes data. Ranks can arrive together and still hold different tensors.
- Running hang drills with the default timeout. Set a timeout of seconds for drills; the 30-minute default is for production patience, not debugging.
- Blaming the network for a shape mismatch hang. Agree shapes and dtypes first, then suspect links.

**Practice**

- [Writing Distributed Applications with PyTorch: barrier plus ordering drill](https://docs.pytorch.org/tutorials/intermediate/dist_tuto.html) - The `dist.barrier` bullet in Collective Communication, extended with the order-swap drill from Reproduce on 2 gloo CPU processes with a 20-second timeout. Run the hanging order first to see the timeout fire, then the fixed order. Log the collective sequence number on each rank.

**Stop when:** The swapped order times out on a short fuse, the fixed order passes, and you can name the order, membership and metadata mismatch classes without notes.

<details>
<summary>Self-test</summary>

1. Rank 0 calls all-reduce then broadcast; rank 1 calls broadcast then all-reduce with matching shapes. What happens?
   - On gloo with the default debug level both block until the timeout: rank 0 sits in all-reduce and rank 1 in broadcast, so neither call finds its partner. With `TORCH_DISTRIBUTED_DEBUG=DETAIL` the swap fails at once with a collective mismatch report at sequence number 0.
2. All ranks call `dist.barrier` and proceed. Does that prove their tensors agree?
   - No. The barrier only proves every rank arrived. Tensor agreement needs the right collectives with matching data, not arrival.
3. A job hangs at a collective with the default gloo timeout. How long until it fails, and what finds the guilty rank faster?
   - About 30 minutes. A short explicit timeout plus `monitored_barrier` and `DETAIL` debug output names the rank that never arrived within seconds.
4. Only ranks with nonzero loss call all-reduce. Why is that unsafe even when the math looks conditional-safe?
   - Collectives are group operations, not local branches. Ranks that skip the call leave the others waiting, so the condition must be reduced to all ranks first or every rank must enter the call.

</details>

#### U7. Asynchronous collective handles, CUDA streams, events and completion

**About 4 h** · **Target:** Explain + Measure

Topics: Synchronous calls, asynchronous handles and completion; CUDA streams, events and dependency ordering

Overlap starts with issuing work without waiting. A handle used wrong corrupts buffers, and a timing without dependencies proves nothing about concurrency.

**You can now**

- Explain the `Work` handle contract for `async_op` and state exactly when buffers are safe to touch.
- Explain CUDA streams, events and dependency ordering around async collectives.
- Measure sync versus async issue time on CPU and state what would prove true overlap on a GPU.

**Study**

1. [Non-blocking point-to-point and the Work handle (page read 2026-10-14)](https://docs.pytorch.org/tutorials/intermediate/dist_tuto.html) (Writing Distributed Applications with PyTorch) - Point-to-Point Communication: the Non-blocking listing with `dist.isend`, `dist.irecv` and `req.wait` plus the two undefined-behaviour rules.
2. [Async launch, streams and device sync](https://www.youtube.com/watch?v=XoGvCBRnwLs&t=36442s) (Building a Distributed Training Framework from First Principles) - From 10:07:22 to about 10:15:00 (hours:minutes:seconds): why an all-reduce can launch while backward continues, CUDA streams, and when `torch.cuda.synchronize` is required.
3. [Communication-computation overlap](https://mlsysbook.ai/vol2/collective_communication/collective_communication.html) (Machine Learning Systems Volume II - Collective Communication) - Communication-Computation Overlap with Layer-by-layer overlap, Bucket fusion and Overlap limits. Depth: Read for the overlap vocabulary and the exposed-versus-hidden distinction. Leave bucket tuning for the data-parallelism section.

**Focus**

- Passing `async_op=True` returns a `Work` handle at once. The collective completes only after `handle.wait()`, and buffers on both sides are unsafe until then.
- A CUDA stream orders work; an event marks a point in a stream. Dependencies between compute and communication streams, not mere async issue, decide what actually overlaps.
- Overlap hides transfer time behind compute only when compute outlasts the transfer and no dependency forces a wait. Async issue without such cover is just deferred waiting.
- CPU `time.perf_counter` around async calls measures issue overhead, not GPU concurrency. Event-attributed timelines on a GPU are the proof; treat CPU numbers as issue-cost examples only.

**Reproduce:** On 2 gloo CPU processes, issue `dist.all_reduce` with `async_op=True`, run a fixed local matrix multiply, then wait and assert the reduced value. Time the same script with a blocking call and report both numbers as issue costs, not as overlap evidence.

**Traps**

- Reading the result tensor right after an async call without wait. The values are undefined until completion.
- Claiming overlap from a shorter async wall time on CPU. The CPU returns early by construction; concurrency needs stream dependency proof on a GPU.
- Writing to a buffer that an async collective still uses. Call `handle.wait()` first; with NCCL that call only makes the current CUDA stream wait for the collective, so a CPU timer or a host read still needs `torch.cuda.synchronize()`.

**Practice**

- [Writing Distributed Applications with PyTorch: async handles drill](https://docs.pytorch.org/tutorials/intermediate/dist_tuto.html) - The Non-blocking listing extended to `dist.all_reduce` with `async_op=True` on 2 gloo CPU processes: wait, assert the sum, then add a local compute between issue and wait and time both variants. Report both timings as issue costs with backend, world size and PyTorch version. Do not present them as interconnect results.

**Stop when:** The async script passes on two processes with correct wait placement, and you can state what a GPU timeline must show before you claim overlap.

<details>
<summary>Self-test</summary>

1. What does `dist.all_reduce` with `async_op=True` return, and when may the input buffer be reused?
   - A `Work` handle. The buffer may be touched only after `handle.wait()` confirms completion.
2. What is the difference between a CUDA stream and a CUDA event in overlap work?
   - A stream orders queued work; an event records that a stream reached a point. Code waits on events to express that communication may proceed only after some compute finished.
3. An async all-reduce script runs faster on CPU than its blocking twin. Does that prove communication overlapped with compute?
   - No. The async call returns before the transfer finishes, so a shorter Python wall time only shows deferred waiting. Proof needs GPU timelines showing transfer and compute on overlapping intervals with satisfied dependencies.
4. Where must the wait go if a second collective consumes the first collective's output?
   - Between them on every rank that consumes the data. Issuing the consumer early reads an incomplete buffer.

</details>

#### U8. Ring and tree collectives and the $`\alpha`$-$`\beta`$ cost model

**About 5 h** · **Target:** Derive

Topics: Ring and tree collective algorithms; Latency, bandwidth and $`\alpha`$-$`\beta`$ cost models

Algorithm choice is a size question, not a brand question. The same ring that wins on gigabyte gradients loses on kilobyte tokens, and the crossover is one equation.

**You can now**

- Derive ring and tree all-reduce costs from the $`\alpha`$-$`\beta`$ model and locate the crossover.
- Classify a message as latency-bound or bandwidth-bound from its size against the crossover size.
- Adjust a textbook prediction with the measured NCCL small-message overhead.

**Study**

1. [Cost models, ring and tree algorithms with the crossover](https://mlsysbook.ai/vol2/collective_communication/collective_communication.html) (Machine Learning Systems Volume II - Collective Communication) - Mapping the Terrain with The $`\alpha`$-$`\beta`$ cost model, The LogP model and Theory vs. practice: The NCCL reality gap, then Engineering the Flow with Ring AllReduce, Tree AllReduce and The algorithm crossover point.
2. [Ring costs as rendered equations](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/cs336_assignment2_systems.pdf) (CS336 Assignment 2 (Spring 2026) - Sections 5.1 and 8.1) - Section 8.1, Communication Primitives (pp. 40 to 41): the ring all-gather, reduce-scatter and all-reduce costs plus the alternate ring problem. Depth: Read the rendered PDF, not an extracted text copy: the text layer drops fraction bars, so N-1 over N reads as N-1N.
3. [Intra-node collective costs on GPUs](https://jax-ml.github.io/scaling-book/gpus) (How to Scale Your Model - Sharded Matrices and GPU Collectives) - How Do Collectives Work on GPUs, Intra-node collectives: the ring all-gather and reduce-scatter time approaching bytes over egress bandwidth.
4. [Unchunked ring sketch (page read 2026-10-14)](https://docs.pytorch.org/tutorials/intermediate/dist_tuto.html) (Writing Distributed Applications with PyTorch) - Our Own Ring-Allreduce: the `isend` and `recv` ring with the `torch.chunk` exercise left to the reader.

**Focus**

- Every message costs $`T(n) = \alpha + n / \beta`$: a startup tax $`\alpha`$ plus a transit fee per byte. The crossover size $`n^* = \alpha \beta`$ separates latency-bound small messages from bandwidth-bound large ones.
- Ring all-reduce costs $`2 (N-1) \alpha + 2 \frac{N-1}{N} \frac{S}{\beta}`$: many latency steps but minimal bytes. Tree forms pay about $`\log N`$ steps with more bytes per step, so trees win small and rings win large.
- Chunking is what makes the ring cheap: each of the $`N-1`$ steps moves $`S/N`$ bytes per rank. A ring that forwards whole buffers keeps the steps but sends far more per step; CS336 writes the per-device egress bandwidth as $`W`$, which is $`\beta`$ here, not the world size.
- In the book's illustrative DGX H100 table, NCCL small-message latency runs 7 to 8 times the wire $`\alpha`$, so the real crossover sits above the textbook one. Measure effective $`\alpha`$ on the target fabric before choosing.

**Reproduce:** Closed-book, derive ring all-reduce time from reduce-scatter plus all-gather, then evaluate 4 ranks and a 1 GB payload at $`\alpha = 2\,\mu\text{s}`$ and $`\beta = 50`$ GB/s: latency 12 microseconds plus 30 ms of bandwidth, about 30.01 ms. Then state which side of the 100 KB crossover a 4 KB token message sits on.

**Traps**

- Quoting bandwidth only. Below the crossover size the byte count barely matters and startup dominates.
- Assuming reduce-scatter always costs half an all-reduce. That holds for ring all-reduce, which is reduce-scatter plus all-gather; NCCL may run all-reduce as a tree or with in-switch reduction, so measure both before using the ratio.
- Copying TPU link constants from the scaling-book answers into NCCL predictions. Redo every answer with your own $`\alpha`$ and $`\beta`$.

**Practice**

- [CS336 Assignment 2: `alternate_ring_all_reduce`](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/cs336_assignment2_systems.pdf) - Section 8.1, problem `alternate_ring_all_reduce` (p. 41): derive the (N-1) S over W time with the one-sentence justification. Answer from the ring derivation before reading any solution, and write the cost with $`\beta`$ for egress bandwidth so it does not clash with world size.

**Stop when:** You derive both ring and tree costs without notes, classify messages against the crossover, and your alternate-ring answer states the missing chunking saving.

<details>
<summary>Self-test</summary>

1. On a link with $`\alpha = 2\,\mu\text{s}`$ and $`\beta = 50`$ GB/s, what is the crossover size, and is a 4 KB MoE token message latency-bound or bandwidth-bound?
   - The crossover is $`2 \times 10^{-6} \times 5 \times 10^{10} = 100{,}000`$ bytes, about 100 KB. A 4 KB message sits 25 times below it, so it is latency-bound and fusing helps more than adding bandwidth.
2. Derive the ring all-reduce bandwidth term from its two halves.
   - Reduce-scatter moves $`\frac{N-1}{N} S`$ bytes per rank and all-gather moves the same again, so the ring total is $`2 \frac{N-1}{N} \frac{S}{\beta}`$ plus $`2 (N-1)`$ latency steps.
3. Eight ranks ring all-reduce a 64 MB gradient ($`64 \times 10^6`$ bytes) with $`\alpha = 5\,\mu\text{s}`$ and $`\beta = 25`$ GB/s. Compute both terms and say which dominates.
   - Latency is $`2 \times 7 \times 5\,\mu\text{s} = 70\,\mu\text{s}`$. Bandwidth is $`2 \times \frac{7}{8} \times 64 \times 10^6 / (25 \times 10^9) \approx 4.48`$ ms. Bandwidth dominates by about 64 times, so this message is far above the crossover.
4. A textbook crossover says rings win above 1 MB, but NCCL measurements prefer trees up to several MB. Why?
   - The textbook $`\alpha`$ is the wire value. NCCL protocol setup inflates effective small-message latency several-fold, which pushes the real crossover upward.

</details>

#### U9. Per-rank bytes, critical paths, message size and effective bandwidth

**About 4 h** · **Target:** Derive + Measure

Topics: Per-rank byte volume and critical-path derivation; Message-size effects, contention and effective bandwidth

Vendor plots quote bus bandwidth while timers measure time. The correction factor between them decides whether a link is saturated or the algorithm is wasteful.

**You can now**

- Derive per-rank wire bytes and the critical path for all five core collectives.
- Convert a measured time into algorithm bandwidth and bus bandwidth with the right correction factor.
- Run a message-size sweep on CPU and separate the latency-flat sizes from the bandwidth-linear ones.

**Study**

1. [Algorithm bandwidth versus bus bandwidth](https://github.com/NVIDIA/nccl-tests/blob/master/doc/PERFORMANCE.md) (nccl-tests and its performance notes) - Bandwidth with Algorithm bandwidth as S over t, Bus bandwidth with the per-collective correction table, and the AllReduce derivation.
2. [Benchmarking formulas and warmup discipline](https://github.com/stanford-cs336/spring2025-lectures/blob/b98b08a98d9d47a69bbdcb4e96a58aa48ee4d13b/lecture_08.py) (CS336 Spring 2025 - Lecture 8 Parallelism (executable lecture)) - Benchmarking with `all_reduce` and `reduce_scatter`: the sent-bytes lines with the factor of 2 for all-reduce only (the lecture warms up once), plus Section 5.1.1 of the assignment handout for 5 warmups and `torch.cuda.synchronize`.
3. [NCCL reality gap across message sizes](https://mlsysbook.ai/vol2/collective_communication/collective_communication.html) (Machine Learning Systems Volume II - Collective Communication) - Mapping the Terrain with Theory vs. practice: The NCCL reality gap, including the small-message overhead ratios and the large-message agreement.

**Focus**

- Per-rank wire bytes with $`n`$ ranks and payload $`S`$: all-reduce $`2 \frac{n-1}{n} S`$, all-gather and reduce-scatter $`\frac{n-1}{n} S`$ each, broadcast and reduce $`S`$ through the root bottleneck, all-to-all $`\frac{n-1}{n} S`$ under contention.
- Algorithm bandwidth is $`\text{algbw} = S / t`$. Bus bandwidth multiplies by the correction factor: $`2 \frac{n-1}{n}`$ for all-reduce, $`\frac{n-1}{n}`$ for all-gather, reduce-scatter and all-to-all, and 1 for broadcast and reduce.
- Small sizes show flat time against the latency floor; large sizes show time linear in bytes. The knee between them sits near the crossover size of the fabric.
- CPU gloo sweeps show the shape of that knee and validate the byte factors. They say nothing about GPU link speeds, so never compare a gloo GB/s number with an NVLink or InfiniBand figure.

**Reproduce:** On 4 gloo CPU processes, sweep all-reduce payloads from 4 KB to 16 MB with 5 warmups: plot time and bus bandwidth with the 1.5 correction factor, mark the flat and the linear regimes, and state the assumed crossover for comparison.

**Traps**

- Calling the TensorTonic `algorithm_bytes` a bus bandwidth. That problem counts ring wire bytes, while nccl-tests reserves algorithm bandwidth for S over t and applies the correction after.
- Timing one shot without warmup or synchronization. First iterations pay setup cost and async calls return early, so both inflate bandwidth.
- Comparing effective bandwidth across different rank counts without the correction. The factor removes the rank-count trend so the remainder reflects the hardware.

**Practice**

- [TensorTonic: Calculate Collective Effective Bandwidth](https://www.tensortonic.com/problems/cs336-l07-collective-bandwidth) - All three public cases: the pass count of 2 for all-reduce and 1 otherwise, with modeled bytes A and bandwidth B. Describe only what the cases check: the byte formula and the division by duration. Remember its `algorithm_bytes` name differs from the nccl-tests one.
- [CS336 Assignment 2: `distributed_communication_single_node`](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/cs336_assignment2_systems.pdf) - Section 5.1 with the Section 5.1.1 benchmarking practices (p. 32): sizes 1 MB, 10 MB, 100 MB and 1 GB on 2, 4 or 6 processes, with a plot or table plus 2 to 3 sentences. Run the sweep on CPU gloo with 5 warmups. Each run must finish inside 5 minutes.

**Stop when:** Your byte factors match the correction table, the TensorTonic cases pass, and your sweep shows the flat-to-linear knee with warmup and synchronization in place.

<details>
<summary>Self-test</summary>

1. Four ranks all-reduce 1024 bytes in 0.001 s. What are the modeled bytes per rank and the bandwidth?
   - Bytes per rank are $`2 \times 1024 \times 3/4 = 1536`$. Bandwidth is $`1536 / 0.001 = 1{,}536{,}000`$ bytes/s, which nccl-tests would call bus bandwidth.
2. Why does the lecture benchmark double the sent bytes for all-reduce but not for reduce-scatter?
   - Ring all-reduce performs both halves, reduce-scatter plus all-gather, while reduce-scatter performs only the reduction half. The factor of 2 counts the second pass.
3. A sweep shows flat time up to 64 KB and linear time above 4 MB. Which regime is which, and what does the flat part measure?
   - Flat is latency-bound and linear is bandwidth-bound. The flat part measures startup and software overhead, not link speed.
4. Your 4-process gloo sweep reports 2 GB/s bus bandwidth. The book quotes 50 GB/s InfiniBand. Is your link 25 times slower?
   - No comparison follows. The gloo number ran over loopback or TCP on CPU with different software overhead, so it cannot speak about the GPU fabric.

</details>

#### U10. PCIe, NVLink, NVSwitch, NICs, node topology and the NCCL and Gloo backends

**About 4 h** · **Target:** Explain

Topics: PCIe, NVLink, NVSwitch, NIC and node topology vocabulary; NCCL and Gloo backend roles and constraints

The same collective runs at NVLink speed or at network speed depending on placement. Backend and topology vocabulary turns that placement from luck into a decision.

**You can now**

- Explain the intra-node and inter-node link tiers and which traffic each tier should carry.
- Choose between NCCL and Gloo from the tensor devices and state what each backend expects.
- Read a node topology and NCCL debug output at the level of links, not just rank counts.

**Study**

1. [Communication backends (page read 2026-10-14)](https://docs.pytorch.org/tutorials/intermediate/dist_tuto.html) (Writing Distributed Applications with PyTorch) - Communication Backends: the Gloo, MPI and NCCL paragraphs with the one-GPU-per-process device lines. Depth: Skip the MPI rebuild steps. Note the Gloo GPU paragraph as vocabulary, not as a performance recommendation.
2. [Library landscape and topology-aware routing](https://mlsysbook.ai/vol2/collective_communication/collective_communication.html) (Machine Learning Systems Volume II - Collective Communication) - The Communication Library Landscape with NCCL, MPI, Gloo and the selection guide, plus Hierarchical Communication with Topology-aware routing.
3. [Hardware glossary and bandwidth vocabulary](https://github.com/stas00/ml-engineering/blob/139708e52cb06f9191cf1d9959def9187b205c58/network/README.md) (Machine Learning Engineering Open Book - Communication Patterns) - Glossary and concepts: NCCL, peer-to-peer versus all-to-all, NVLS and NVLSTree, SHARP, algorithm versus bus bandwidth, and Unidirectional versus Bidirectional.
4. [NCCL topology, algorithms and communicator lifecycle](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapter 4 Distributed Networking Communication) - Chapter 4 Distributed Networking Communication: NCCL for Distributed Multi-GPU Communication, Topology Awareness in NCCL, NCCL Communication Algorithms, and NCCL Communicator Lifecycle and Environment Gotchas.

**Focus**

- Inside a node, GPUs meet over NVLink and NVSwitch with PCIe to the host. Between nodes, NICs carry traffic over InfiniBand or Ethernet at an order less bandwidth. Keep the heavy bytes on the fast tier.
- Use NCCL for CUDA tensors and Gloo for CPU tensors. NCCL needs one GPU per rank; Gloo runs the same collective vocabulary on CPU without GPU-tuned speed.
- NVLink numbers come in pairs: the H100 figure of 900 GB/s is bidirectional, which is 450 GB/s one-way, and only the one-way rate enters $`T(n) = \alpha + n / \beta`$. Mixing the two doubles or halves every prediction.
- Companion code `format_bandwidth` reports total gathered bytes over time for all-gather, which equals algorithm bandwidth, not bus bandwidth: https://github.com/cfregly/ai-performance-engineering/blob/b57e4c6a9e261c09ac09208705d040c81b03d35e/code/ch04/nccl_benchmark.py - multiply its all-gather rate by $`(n-1)/n`$ before comparing with bus-bandwidth figures.

**Reproduce:** Closed-book, choose the backend for three runs: 4 CPU processes, 2 GPUs on one node, and 8 GPUs across 2 nodes. Name the tier each all-reduce mostly crosses and which bandwidth row of the book table governs it.

**Traps**

- Reading CPU gloo timings as interconnect evidence. They cross loopback or office TCP with CPU overhead, so they cannot speak about NVLink or InfiniBand.
- Assuming one GPU is enough for multi-rank NCCL practice. One GPU means at most one NCCL rank; further ranks need more GPUs or the gloo CPU path.
- Treating MPI as a pip-install backend. PyTorch binaries exclude it, so MPI needs a source rebuild and stays vocabulary here.

**Practice**

- [Stas `all_reduce_bench.py`: `timed_allreduce` reading and conditional run](https://github.com/stas00/ml-engineering/blob/139708e52cb06f9191cf1d9959def9187b205c58/network/benchmarks/all_reduce_bench.py) - `timed_allreduce` with `dist.barrier` and CUDA events, the `busbw_coeff` line in `run`, plus the `torch.distributed.run` rendezvous command lines. With two or more GPUs, run the 2-process command and label the exact topology. On CPU, read the timing lines and state why gloo numbers are not interconnect evidence.

**Stop when:** Your backend choices are correct for CPU, single-node and multi-node runs, and you can sketch which tier each collective crosses without notes.

<details>
<summary>Self-test</summary>

1. Eight ranks span 2 nodes of 4 GPUs. Which tier should carry the bulk of an all-reduce, and why?
   - The intra-node NVLink tier. A hierarchical plan reduces inside each node first and sends only shards between nodes, because the inter-node tier is far slower per byte.
2. Four CPU processes need broadcast and all-reduce. Which backend, and what changes with 4 GPUs?
   - Gloo on CPU. With 4 GPUs use NCCL with one GPU per rank, since NCCL carries the GPU-tuned collectives and Gloo GPU paths are unoptimized.
3. A table quotes 900 GB/s for NVLink. What value enters the $`\alpha`$-$`\beta`$ formula, and why?
   - 450 GB/s one-way. The formula counts bytes in one direction, while 900 GB/s is the bidirectional total.
4. `NCCL_DEBUG=INFO` shows `NET/IB` for some ranks and `NET/Socket` for others. What does that tell you?
   - Traffic split across tiers: some ranks use InfiniBand and some fall back to sockets. Placement or interface settings disagree across the run.

</details>

#### U11. Rank-local logs, collective sequence numbers, timeouts, aborts and teardown

**About 4 h** · **Target:** Implement

Topics: Rank-local structured logs and collective sequence numbers; Timeout, abort, teardown and orphan-process behavior

A hang report that names no rank and no sequence number is unactionable. Rank-local logs with sequence numbers turn who waited for whom into a readable fact.

**You can now**

- Implement per-rank structured logs with collective sequence numbers and tensor metadata.
- Set timeouts and teardown correctly and predict orphan behavior on abort.
- Attribute a slow collective to the guilty rank from aligned rank-local evidence.

**Study**

1. [Timeout, teardown, barriers and debug levels](https://docs.pytorch.org/docs/2.14/distributed.html) (PyTorch 2.14 `torch.distributed` reference) - The `init_process_group` timeout entry with 10 minutes for NCCL and 30 minutes for other backends, `destroy_process_group`, the `monitored_barrier` entry, and TORCH_DISTRIBUTED_DEBUG with OFF, INFO and DETAIL.
2. [Network debug checklist](https://github.com/stas00/ml-engineering/blob/139708e52cb06f9191cf1d9959def9187b205c58/network/debug/README.md) (Machine Learning Engineering Open Book - Communication Patterns) - How to diagnose NCCL multi-gpu and multi-node connectivity issues with `NCCL_DEBUG=INFO`, How to check if P2P is supported, How to count NCCL calls, and Useful NCCL Debug Environment Variables.
3. [Process-group timeout and teardown](https://www.youtube.com/watch?v=XoGvCBRnwLs&t=20260s) (Building a Distributed Training Framework from First Principles) - From 5:37:40 to about 5:38:10 (hours:minutes:seconds): a higher timeout at group creation, a lower one after the first step, and the short wait before the process exits.
4. [Setup and cleanup helpers](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/tests/common.py) (CS336 Assignment 2 (Spring 2026) - Sections 5.1 and 8.1) - `tests/common.py`: `_setup_process_group` and `_cleanup_process_group` as the setup and teardown pattern behind the DDP and FSDP tests.

**Focus**

- Log on every rank: rank, group, collective sequence number, tensor shape and dtype, and start and end times. Rank 0 logs alone never show the failing rank.
- Sequence numbers align the same collective across ranks. A gap or a lone high number on one rank points at the call that diverged.
- Timeouts bound every wait: 30 minutes default for gloo and other backends, 10 minutes for NCCL. `dist.monitored_barrier` with a short fuse names the rank that never arrives.
- Call `dist.destroy_process_group` on every rank at the end. When one rank dies, the survivors block in their next collective until the timeout; torchrun then stops the other workers, but ranks started by hand in a shell loop can outlive the run and hold the port, so the next rendezvous fails.

**Reproduce:** On 2 gloo CPU processes, log 3 collectives with sequence numbers 0, 1 and 2 plus shapes and durations on both ranks. Then make rank 1 sleep 20 seconds before a `monitored_barrier` with a 10-second timeout and show the rank 0 report naming rank 1.

**Traps**

- Logging only on rank 0. The guilty rank is usually elsewhere, so rank-0 logs show a clean run that waited forever.
- Keeping default timeouts during fault drills. A 30-minute fuse turns a 10-second diagnosis into a coffee break.
- Expecting `NCCL_DEBUG=INFO` to show your call order. By default it reports init and connectivity; per-call lines need `NCCL_DEBUG_SUBSYS=COLL`, and even those come from NCCL, not your code, so keep your own sequence log.

**Practice**

- [Timeout and teardown drill with `monitored_barrier`](https://docs.pytorch.org/docs/2.14/distributed.html) - The `monitored_barrier` entry on 2 gloo CPU processes: log 3 collectives with sequence numbers on both ranks, make rank 1 sleep past a 10-second barrier timeout, and report which rank the barrier names. Keep every log line structured with rank, group, sequence, shape and duration. Compare with the Stas debug checklist for what NCCL output would add on GPUs.

**Stop when:** Logs from all ranks align by sequence number, and the delay drill attributes the wait to the correct rank with evidence, not guesses.

<details>
<summary>Self-test</summary>

1. What are the default collective timeouts for NCCL and for gloo, and why do drills override them?
   - 10 minutes for NCCL and 30 minutes for other backends including gloo. Drills use seconds so a hang reports quickly instead of stalling the session.
2. Rank 0 logs sequence numbers 0, 1, 2 and rank 1 logs 0, 1, 1. What diverged?
   - The third collective. Rank 1 repeated or never advanced past sequence 1, so its call sequence disagrees with rank 0 from number 2 on.
3. One rank is killed mid-run before `destroy_process_group`. What do the other ranks do, and what can linger?
   - They block in their next collective until the timeout, then fail. torchrun stops the remaining workers of the group; processes started by hand can linger and hold the master port, so check for them before the next run.
4. Ranks 2 and 3 are both late to a `monitored_barrier` on 4 ranks. What does rank 0 report with the default arguments, and how do you see both?
   - By default rank 0 names only the first rank that missed the timeout. Pass `wait_all_ranks=True` to collect every late rank in one report, such as "Ranks 2, 3 failed to pass monitoredBarrier".

</details>

#### U12. A CPU multiprocess collective correctness suite

**About 4 h** · **Target:** Implement

Topics: CPU multiprocess collective correctness testing

Every later parallel strategy rests on these five collectives. A suite that checks them on CPU catches ordering and ownership bugs before they hide inside a trainer.

**You can now**

- Build a multiprocess suite that checks broadcast, all-reduce, all-gather, reduce-scatter and all-to-all against single-process oracles.
- Cover ranks, subgroups, dtypes and edge cases with deterministic seeds and distinct ports.
- Prove that one injected fault fails loudly instead of passing silently.

**Study**

1. [Gradient averaging as the oracle pattern (page read 2026-10-14)](https://docs.pytorch.org/tutorials/intermediate/dist_tuto.html) (Writing Distributed Applications with PyTorch) - Distributed Training: `average_gradients` compared against single-process math, which is the oracle shape to copy for every collective.
2. [Equivalence test pattern](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/tests/test_ddp.py) (CS336 Assignment 2 (Spring 2026) - Sections 5.1 and 8.1) - `tests/test_ddp.py` with `tests/common.py`: the broadcast check plus the multi-step equivalence against a single-process reference.
3. [Oracle semantics for four collectives](https://www.tensortonic.com/problems/cs336-l07-simulate-collectives) (TensorTonic - Collective Simulation Problems) - The problem statement: rank-ordered concatenation for `all_gather`, elementwise sums for `all_reduce`, equal contiguous chunks for `reduce_scatter`, and source-ordered blocks for `all_to_all`. Depth: Use the statement as the oracle contract. Solve the problem itself in the earlier units.

**Focus**

- The oracle is a single-process computation: the same sums, concatenations and chunks with no communication. Every rank result must equal its oracle slice exactly.
- Cover the world group plus one subgroup, two dtypes, empty tensors, and at least world sizes 2 and 4. Uneven inputs get an assert-raises check on the list APIs, which gloo rejects, plus `all_to_all_single` with split sizes. Bugs that pass at world 2 often fail at world 4.
- Fix seeds, set a short timeout, and give each concurrent run a distinct master port. Shared ports let two suites join each other.
- The suite checks semantics only. Timing numbers from gloo runs must not appear as performance claims anywhere in the report.

**Reproduce:** From a blank file, write the suite skeleton for 4 gloo CPU processes: all five collectives asserted against the oracle on every rank. Run it green, then inject one fault such as a missing division by world size and show the suite failing on the exact assertion.

**Traps**

- Testing only world size 2. Ring wrap and subgroup indexing faults need 3 or more ranks to trigger.
- Comparing only rank 0 results. Ownership bugs show on the ranks nobody asserts.
- Sharing one master port across parallel suites. Ranks from different suites rendezvous together and every assertion becomes noise.

**Practice**

- The section mini-project covers this: the CPU multiprocess collective correctness suite with single-process oracles, subgroup and edge coverage, and one injected-fault demonstration.

**Stop when:** The suite is green on 4 processes across ranks, subgroups, dtypes and edge cases, and the injected fault fails on its exact assertion.

<details>
<summary>Self-test</summary>

1. Why must the oracle be single-process rather than another distributed run?
   - Two distributed runs can share the same bug, such as a missing rescale, and agree with each other. The single-process math is independent of the communication code under test.
2. What does a subgroup test add beyond world-group tests?
   - It checks group construction and per-group ordering: ranks must build identical membership and issue the subgroup sequence separately from the world sequence.
3. Which edge inputs belong in the suite, and why?
   - Empty tensors, both dtypes in use, world sizes 2 and 4, and uneven sizes: gloo's `all_gather` rejects unequal tensors with "invalid tensor size", so the suite asserts that error and tests ragged exchange through `all_to_all_single` splits. These cases reach the error, split and indexing paths that even inputs never touch.
4. Two suites run at once with the same port and both fail strangely. What happened?
   - Cross-joined rendezvous: ranks from different suites formed one group. Distinct ports per run keep suites apart.

</details>

#### U13. Hierarchical collectives and compressed communication with accuracy controls

**About 3 h** · **Target:** Derive

Topics: Hierarchical collectives across nodes and devices; Communication compression with accuracy controls

Flat collectives waste the fast tier, and raw compression wastes accuracy. Hierarchy and accuracy-controlled compression are the two levers that survive at cluster scale.

**You can now**

- Derive the three-phase hierarchical all-reduce bytes and state when hierarchy wins.
- Explain quantization, sparsification and error feedback with their accuracy controls.
- State the warmup and measurement contract that makes a compression claim trustworthy.

**Study**

1. [Hierarchical all-reduce with the worked saving](https://mlsysbook.ai/vol2/collective_communication/collective_communication.html) (Machine Learning Systems Volume II - Collective Communication) - Hierarchical Communication with Hierarchical AllReduce: the three phases plus the flat 40 ms versus hierarchical 8.3 ms worked comparison.
2. [Compression, error feedback and when to use it](https://mlsysbook.ai/vol2/collective_communication/collective_communication.html) (Machine Learning Systems Volume II - Collective Communication) - Gradient Compression Under Bandwidth Scarcity with Quantization, Sparsification, Error feedback and When to use compression, including the telescoping-sum argument.
3. [Cross-node collectives and the node-bound quiz](https://jax-ml.github.io/scaling-book/gpus) (How to Scale Your Model - Sharded Matrices and GPU Collectives) - How Do Collectives Work on GPUs, Cross-node collectives: the fat-tree time set by node egress bandwidth, and why cross-node all-to-all gains nothing from the hierarchy.

**Focus**

- Hierarchy works in three phases: reduce-scatter inside each node over the fast tier, all-reduce each GPU's shard across nodes over the slow tier, then all-gather inside each node. The saving equals the bytes kept off the slow tier.
- Compression only helps bandwidth-bound traffic above the crossover size. Below it the latency term is unchanged, so small routed messages gain nothing from fewer bytes.
- Error feedback carries the compression residual forward, so the telescoping sum preserves the true total across steps. Naive top-k without it is biased and drifts.
- One-bit and sparse schemes usually start with a full-precision warmup plus a measured accuracy check. A byte saving without a convergence comparison is not a result.

**Reproduce:** Closed-book, recompute the book flat-versus-hierarchical comparison (40 ms against 8.3 ms) from the tier bandwidths, then write the 3-step telescoping sum that shows error feedback preserving the total of the true gradients.

**Traps**

- Quoting the book H100-cluster reference values as targets. They are the authors' cluster numbers; your fabric needs its own $`\alpha`$, $`\beta`$ and measurement.
- Compressing latency-bound traffic. Shrinking a 4 KB routing message changes almost nothing because startup dominates its cost.
- Skipping warmup for 1-bit schemes. Early-step statistics are unstable, so full-precision warmup plus a loss comparison is part of the method, not optional.

**Practice**

- [How to Scale Your Model: GPU Quiz 4 on collectives](https://jax-ml.github.io/scaling-book/gpus) - Quiz 4, Question 5 in How Do Collectives Work on GPUs: the precise cost of an all-gather over exactly 2 nodes, answered before opening the solution. Treat the given link numbers as the question givens, not as predictions for your own fabric.

**Stop when:** You derive the three-phase bytes, explain the telescoping sum, and can state the warmup-plus-accuracy contract for any compression proposal.

<details>
<summary>Self-test</summary>

1. What are the three hierarchical phases, and which bytes avoid the slow tier?
   - Intra-node reduce-scatter, inter-node all-reduce of each GPU's $`1/G`$ shard, intra-node all-gather. Only the shards cross the slow tier; the full payload never leaves the fast tier.
2. Why does error feedback preserve the true gradient sum across steps?
   - Each step sends the compressed value of the gradient plus the carried residual, and keeps the new residual for the next step. Summed over steps the residuals telescope, so the total sent differs from the total of the true gradients only by the last residual.
3. A 140 GB gradient compresses to 1.4 GB. Does the operation become latency-bound?
   - No. At 1.4 GB it still sits far above any realistic crossover size, so it stays bandwidth-bound with a proportionally smaller term.
4. What must a compression experiment report besides the byte saving?
   - Warmup policy, the accuracy or loss comparison against the uncompressed run, and the fabric and message regime, so the saving is tied to preserved model quality.

</details>

### Mini-project: Ordered collectives with a CPU correctness suite

**About 12 to 16 hours.** Build the rank and group layer in `comm/` and check every collective against a single-process oracle on CPU processes. Exact ordering, ownership and cost reasoning here prevents hangs and silent mismatch in every parallel design that follows.

1. Launch CPU processes with `torchrun`, map global ranks to devices through the launcher variables, and build the default group plus nested subgroups for a small grid, each run on a distinct port with `gloo`.
2. Exchange tensors with matched blocking and non-blocking send and receive pairs, then broadcast and reduce; prove which ranks hold valid results and show an early buffer touch corrupts the handoff.
3. Implement all-reduce, all-gather, reduce-scatter and all-to-all on several CPU processes, checking every rank against single-process oracles; pass the TensorTonic collectives cases and derive the per-rank byte factor for each.
4. Run the order-swap drill with a short timeout and attribute the hang with `monitored_barrier` and debug output; issue one async collective with compute between issue and wait, reporting CPU timings as issue cost only.
5. Derive ring and tree all-reduce costs from the latency-bandwidth model and locate the crossover; pass the TensorTonic bandwidth cases and sweep sizes with warmup and synchronization, adding a measured variant only with two or more GPUs while recording backend and link tier beside every number.
6. Ship the CPU multiprocess collective suite in `tests/` covering ranks, subgroups, dtypes and edges with deterministic seeds; keep rank-attributed logs with collective sequence numbers, bounded teardown, and one injected fault that fails its exact assertion.

**Deliverables**

- The `comm/` rank and group layer with launch, mapping and subgroup construction.
- The CPU collective suite with oracle comparisons, edge coverage and the injected-fault demonstration.
- Cost derivations, the CPU sweep table and rank-attributed logs with teardown evidence.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [TensorTonic: Simulate Distributed Collectives](https://www.tensortonic.com/problems/cs336-l07-simulate-collectives). Pass the gather, scatter and all-to-all cases in your harness before the multiprocess runs.
- external-tests: [TensorTonic: Calculate Collective Effective Bandwidth](https://www.tensortonic.com/problems/cs336-l07-collective-bandwidth). Pass the public byte-factor cases before computing bandwidth from your own sweep.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Collective correctness | Every collective matches the single-process oracle on every rank across subgroups, dtypes and edge cases. | An uneven-split case and a subgroup case are added beyond the named suites. |
| Ordering discipline | The swapped order times out on a short fuse, the fixed order passes, and the guilty rank is named from evidence. | A second mismatch class, shape or dtype, is drilled with its distinct symptom. |
| Cost honesty | Byte factors are derived per collective, CPU sweeps carry warmup, backend and commit, and no CPU number is quoted as link bandwidth. | The crossover prediction is tested against a sweep and the residual is attributed. |
| Suite rigor | The suite is green with deterministic seeds and distinct ports, and the injected fault fails its exact assertion. | Fault coverage extends to a second class and teardown leaves no orphan holding the port. |

Feeds into: Rank and group construction plus the collective suite feed data, sharded and model parallel sections and the capstone evidence core.

### Resource route

- **Primary - Theory:** [Machine Learning Systems Volume II - Collective Communication](https://mlsysbook.ai/vol2/collective_communication/collective_communication.html) - Read From Parallelism to Communication Patterns, Network Performance Modeling, Collective Operation Primitives, AllReduce Algorithms, Hierarchical Communication and Communication-Computation Overlap. Use its latency and bandwidth model to derive one communication budget, and return to The Distributed Training Step in https://mlsysbook.ai/vol2/distributed_training/distributed_training.html during DT-3.
- **Required - Theory:** [How to Scale Your Model - Sharded Matrices and GPU Collectives](https://jax-ml.github.io/scaling-book/sharding) - Work the collective-cost problems in Part 3 (all-gather, reduce-scatter, all-reduce and all-to-all volumes, latency versus bandwidth) before opening each answer, then read How Do Collectives Work on GPUs in Part 12 at https://jax-ml.github.io/scaling-book/gpus. The worked answers use TPU link constants; redo them with your own bandwidth and latency.
- **Required - Interactive book:** [Ultra-Scale Playbook - A0: Parallel Programming Crash Course](https://nanotron-ultrascale-playbook.static.hf.space/index.html#a0:_parallel_programming_crash_course) - Read A0 from processes and ranks through point-to-point communication, broadcast, reduce, all-reduce, all-gather, reduce-scatter, the ring all-reduce and asynchronous operations. Reproduce every small `torch.distributed` example on Gloo and annotate tensor ownership before moving to higher parallelism.
- **Required - Course:** [Building a Distributed Training Framework from First Principles](https://www.youtube.com/watch?v=XoGvCBRnwLs) - Watch only 04:32:59 for autograd and distributed mathematics, 05:04:19 for distributed graphs and DDP, 09:48:52 for collectives, and 10:49:41 for DeviceMesh, DDP and FSDP. Pause after each segment to reproduce the rank and tensor transitions with CPU torchrun; the nearly twenty-hour full video is not required.
- **Support - Course:** [CS336 Spring 2025 - Lecture 8 Parallelism (executable lecture)](https://github.com/stanford-cs336/spring2025-lectures/blob/b98b08a98d9d47a69bbdcb4e96a58aa48ee4d13b/lecture_08.py) - Read `lecture_08.py` Part 1 (collective operations, `torch.distributed`, all-reduce and reduce-scatter benchmarks) and skim Part 2 (data, tensor and pipeline parallelism sketches). Run its CPU examples before the Playbook appendix.
- **Required - Implementation:** [Picotron - Process Groups and Communication Files](https://github.com/huggingface/picotron) - Trace picotron/process_group_manager.py plus tp_communications.py, pp_communications.py and cp_communications.py. Draw every group, rank coordinate and tensor transfer for one 2 x 2 layout, then add a failing collective-order test in your own project.
- **Support - Course:** [Picotron Tutorial - Steps 1 to 3 and Part 1 Video](https://github.com/huggingface/picotron_tutorial) - Follow `step2_process_group_manager` and `step3_dataloader` with their diffs and the Part 1 video (model, process group manager and dataloader). Rebuild the rank grid yourself before reading the solution.
- **Required - Reference:** [Machine Learning Engineering Open Book - Communication Patterns](https://github.com/stas00/ml-engineering) - Read `network/comms.md` from point-to-point through ring all-reduce, then `network/README.md` and `network/debug/README.md` selectively. Derive bytes and steps before running anything; `network/benchmarks/all_reduce_bench.py` needs two or more GPUs and reports bus bandwidth.
- **Required - Lab:** [Writing Distributed Applications with PyTorch](https://docs.pytorch.org/tutorials/intermediate/dist_tuto.html) - Work through process-group setup, point-to-point communication and the collective operations, then adapt the examples to test broadcast, all-reduce, all-gather, reduce-scatter and all-to-all on Gloo with several CPU processes. Check backend support in the 2.14 `torch.distributed` reference; Gloo all-to-all runs on CPU in 2.14.
- **Required - Assignment:** [CS336 Assignment 2 (Spring 2026) - Sections 5.1 and 8.1](https://github.com/stanford-cs336/assignment2-systems) - Complete `distributed_communication_single_node` with the Section 5.1.1 benchmarking practices on as many processes as you have, then derive the ring all-gather, reduce-scatter and all-reduce costs in Section 8.1 and solve `alternate_ring_all_reduce`.
- **Support - Practice:** [TensorTonic - Collective Simulation Problems](https://www.tensortonic.com/study-plans/language-modeling-from-scratch) - Solve Simulate Distributed Collectives and Calculate Collective Effective Bandwidth. The bandwidth problem counts ring passes; reconcile it with your alpha-beta model and with bus bandwidth before comparing numbers.
- **Support - Book:** [AI Systems Performance Engineering - Chapter 4 Distributed Networking Communication](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) - Read NCCL for Distributed Multi-GPU Communication, Topology Awareness in NCCL, NCCL Communication Algorithms, NCCL Communicator Lifecycle and Environment Gotchas, and Profiling and Debugging NCCL. With two or more GPUs, run `code/ch04/nccl_benchmark.py` from the companion repository and label the exact topology.
- **Support - Reference:** [nccl-tests and its performance notes](https://github.com/NVIDIA/nccl-tests) - With two or more GPUs, run `all_reduce_perf` over a message-size sweep and read `doc/PERFORMANCE.md` for algorithm bandwidth versus bus bandwidth. Without them, use the document to interpret published numbers.
- **Reference - Reference:** [PyTorch 2.14 `torch.distributed` reference](https://docs.pytorch.org/docs/2.14/distributed.html) - Look up the backends table, `init_process_group` with timeout and `device_id`, `new_group` and `new_subgroups`, the `Work` and `async_op` contract, `monitored_barrier`, `destroy_process_group` and `TORCH_DISTRIBUTED_DEBUG`. Use it for API lookup beside the tutorial first pass.
- **Reference - Reference:** [PyTorch 2.14 torchrun (elastic launch) reference](https://docs.pytorch.org/docs/2.14/elastic/run.html) - Read Single-node multi-worker through the elastic membership rows for `RANK`, `WORLD_SIZE` and `LOCAL_RANK`, plus flags `--standalone`, `--nnodes`, `--nproc-per-node`, `--rdzv-backend` and `--rdzv-endpoint`. Launch every CPU run with `torchrun --standalone` and a distinct port per run.

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

### Study units

#### U1. Replicated state, disjoint data ownership and DistributedSampler invariants

**About 3 h** · **Target:** Explain + Implement

Topics: Replicated parameters and optimizer state; Disjoint data ownership and DistributedSampler invariants

Every rank trains a full copy of the model on its own shard. Overlapping shards or miscounted padding silently change the global batch, so ownership must be proved before any timing or scaling claim.

**You can now**

- Explain what each data-parallel rank replicates and what it owns: full parameters, gradients and optimizer state are replicated, while the data shard is disjoint.
- Build a disjoint sharding with `DistributedSampler`, calling `set_epoch` each epoch and stating the padding and drop policy.
- Predict how a sharding bug (overlap, repeat, or miscounted padding) changes the global batch.

**Study**

1. [DDP construction, rank-zero-first downloads and rank-tagged logs](https://github.com/LambdaLabsML/distributed-training-guide/blob/aed748914472cca80d8cfe139ab43ec63103913a/02-distributed-data-parallel/train_llm.py) (Distributed Training Guide - Chapter 2 DDP) - Lines 36 to 50: rank, device and process-group init with the `[rank=...]` log format; lines 55 to 68: `rank0_first` downloads plus the `DistributedDataParallel` wrap with `bucket_cap_mb=500`; lines 272 to 280: the `rank0_first` definition.
2. [DistributedSampler with per-epoch `set_epoch`](https://github.com/LambdaLabsML/distributed-training-guide/blob/aed748914472cca80d8cfe139ab43ec63103913a/02-distributed-data-parallel/train_llm.py) (Distributed Training Guide - Chapter 2 DDP) - Lines 76 to 84: the `DataLoader` with `DistributedSampler(train_data, shuffle=True, drop_last=True)`; lines 129 to 137: the `set_epoch` call before iterating, with the shuffle comment.
3. [Data partitioning and sampling strategies](https://www.oreilly.com/library/view/deep-learning-at/9781098145279/) (Deep Learning at Scale - Chapter 7 Data Parallelism) - Chapter 7 Data Parallelism: Data Partitioning and Implications of Data Sampling Strategies (pp. 229 to 231); Distributed Data Parallel (pp. 242 to 243) including the Devil in the details box on DataLoaders and multiprocessing start methods (p. 243).

**Focus**

- `DistributedDataParallel` broadcasts the `state_dict` from rank 0 at construction. It never shards data; the sampler or manual offsets own disjointness. This extends the single-process loader contract from Datasets, data loaders and samplers.
- `DistributedSampler` deals strided shards. With `shuffle=False` over 10 items and 2 ranks, rank 0 owns `[0, 2, 4, 6, 8]` and rank 1 owns `[1, 3, 5, 7, 9]`.
- `set_epoch` re-seeds the shuffle each epoch. Without it every epoch repeats the same order on every rank.
- With `drop_last=False`, short datasets pad by repeating head indices. Over 10 items and 3 ranks each rank holds 4 indices and ranks 1 and 2 repeat 0 and 1, so token counts must account for the repeats.

**Reproduce:** On CPU with no process group, build a `TensorDataset` of 10 items and two `DistributedSampler` instances with `num_replicas=2` and `shuffle=False`. Print both index lists, assert they are disjoint and their union is 0 to 9. Then repeat with 3 replicas and `drop_last=False` and show each rank holds 4 indices with the head repeats.

**Traps**

- Assuming the DDP wrapper shards batches. The guide states it does not: the wrapper syncs grads while the sampler splits data.
- Forgetting `set_epoch`, then reading correlated epochs as a data bug. Same order every epoch is the default without it.
- Storing resume position in the sampler. It has no `state_dict`; the loop owns the epoch integer, and the dataset version plus worker RNG must be restored beside it.

**Practice**

- The section mini-project covers this: sampler disjointness and union checks, padding versus drop policy, and epoch-resume equivalence.

**Stop when:** Your CPU script prints disjoint even and odd shards for two ranks and the padded 4-per-rank lists for three ranks, and you can state what each rank replicates and what it owns without notes.

<details>
<summary>Self-test</summary>

1. What state is replicated on each rank and what differs?
   - Parameters, gradients and optimizer state are replicated; the data shard differs. After backward the grads are averaged, so the local optimizer steps agree.
2. Ten items over three ranks with `drop_last=False`. How many indices per rank, and which repeat?
   - Four per rank. Rank 0 holds `[0, 3, 6, 9]`, rank 1 holds `[1, 4, 7, 0]` and rank 2 holds `[2, 5, 8, 1]`; 0 and 1 are the head repeats.
3. `set_epoch` is never called with `shuffle=True`. What breaks?
   - Nothing crashes, but every epoch shuffles identically, so epochs are fully correlated and any epoch-dependent analysis is wrong.
4. Where does sampler resume position live?
   - In the training loop as the epoch integer, not in the sampler. Resume must also fix the dataset version and worker seeding.

</details>

#### U2. Loss reduction, update equivalence and the single-process oracle

**About 4 h** · **Target:** Derive + Implement

Topics: Local loss, gradient sum or average and update equivalence; Single-process numerical oracle and tolerance policy

Equivalence to one process is the contract that buckets, hooks, compression and sharding must all preserve. An oracle plus a tolerance turns silent scale bugs into loud failures.

**You can now**

- Derive when averaged rank-local mean gradients equal the full-batch gradient, and how sum reduction changes the answer by a factor of the rank count.
- Implement a single-process oracle and compare losses, gradients, parameters and optimizer state under a stated tolerance.
- Explain why the CS336 test shuffles with one shared seed across ranks.

**Study**

1. [DDP oracle test: one process versus two disjoint shards](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/tests/test_ddp.py) (CS336 Assignment 2 (Spring 2026) - Section 5 Distributed Data Parallel Training) - Function `_test_DistributedDataParallel`: non-parallel baseline on all 20 fixture rows, per-rank disjoint 10-row shards at `offset = rank * local_bs`, 5 SGD steps at lr 0.1 with `torch.allclose` after each step, shared shuffle seed `42 + i`.
2. [Data-parallel averaging during backward](https://nanotron-ultrascale-playbook.static.hf.space/index.html#data_parallelism) (Ultra-Scale Playbook - Data Parallelism) - Data Parallelism through the first optimization (overlap gradient synchronization with backward pass): per-GPU micro-batches with gradient averaging by all-reduce before the optimizer step.
3. [Sum versus mean loss across nodes](https://docs.pytorch.org/docs/2.14/generated/torch.nn.parallel.DistributedDataParallel.html) (PyTorch DDP Tutorial, Design Note and Communication Hooks) - Note on training on M nodes with batch N: summed losses give M-times-smaller grads than the single-node batch M times N; treat mean-reduction models as equivalent at the same global batch.

**Focus**

- With per-rank mean loss, averaging local grads equals the full-batch mean grad. A 2-rank CPU run on an 8-row oracle matches params with `torch.allclose` at `atol=1e-6`.
- With per-rank sum loss, averaging gives the full-batch sum divided by the rank count. Sum the grads, or scale the learning rate, to match a summed oracle.
- The oracle fixes init, data pool and global batch, then compares loss, grads, params and optimizer state. Exact `torch.eq` can fail across different GEMM blockings (a CPU port of Picotron's tensor-parallel test missed by `1.8e-7` on PyTorch 2.14.1); use `assert_close` with a stated tolerance.
- One shared shuffle seed keeps shards disjoint. Rank-dependent seeds can deal overlapping rows to both ranks.

**Reproduce:** Run two CPU ranks on a fixed 8-row linear-regression oracle with `MSELoss` mean reduction: rank shards of 4 rows, local backward, `all_reduce` SUM then divide by 2, one SGD step. Assert both ranks match the oracle params with `torch.allclose`. Then repeat with sum reduction and show averaging misses by the rank count unless grads are summed.

**Traps**

- Comparing a mean-reduction DP run against a sum-reduction oracle and blaming the collective for the factor-of-R gap.
- Demanding bitwise equality between sharded and full GEMM paths. Rounding differs by blocking; tolerance is the contract.
- Shuffling per rank with rank-dependent seeds and silently overlapping shards. The shared seed is load-bearing.

**Practice**

- [TensorTonic: Synchronize Data-Parallel Gradients](https://www.tensortonic.com/problems/cs336-l07-data-parallel-gradient-sync) - Function `data_parallel_gradient_sync(parameter_replicas, gradient_replicas, learning_rate)`: public cases check two-rank means, a zero local gradient, and three ranks with two parameter shapes; mean grads are stored in each parameter dtype and updated replicas are independent copies. Solve before the CS336 DDP tests, as the pool orders it. It checks the averaging arithmetic, not the collective.

**Stop when:** Your 2-rank gloo run matches the oracle with `assert_close`, and you can derive the sum-versus-mean factor without notes.

<details>
<summary>Self-test</summary>

1. Two ranks hold mean-loss grads over disjoint halves. What does their average equal?
   - The gradient of the mean loss over the concatenated batch: $`(g_0 + g_1)/2`$ is the full-batch mean gradient.
2. Same setup with sum losses. What does averaging give relative to the full-batch sum gradient?
   - The full-batch sum gradient divided by 2. Average to match a mean oracle; sum to match a sum oracle.
3. Why does the CS336 test use `torch.manual_seed(42 + i)` on every rank before shuffling?
   - All ranks draw the identical permutation, so the two 10-row shards stay disjoint. Different seeds per rank could overlap rows.
4. A CPU port of Picotron's tensor-parallel linear test (2 `gloo` ranks, PyTorch 2.14.1) fails `torch.eq` by `1.8e-7` on the gathered outputs. Does that point to a broken collective?
   - No. Splitting a GEMM changes its blocking and rounding, and the same port passes `assert_close`. A DP oracle meets the same effect: per-rank half-batch GEMMs round differently from the full batch.

</details>

#### U3. Global batch across workers and accumulation, and `no_sync`

**About 4 h** · **Target:** Derive + Implement

Topics: Global batch under workers and gradient accumulation; Gradient accumulation with no_sync

Global batch is the fixed semantic; microbatch, accumulation and worker count are interchangeable ways to reach it. `no_sync` is what makes accumulation cheaper than repeating full syncs.

**You can now**

- Derive the global batch in samples and tokens from microbatch, accumulation steps and DP degree.
- Implement accumulation with `no_sync` so only the final micro-step synchronizes.
- Explain the two failure modes: syncing every micro-step (correct but slow) and syncing none (stale grads).

**Study**

1. [Global batch across workers and accumulation](https://nanotron-ultrascale-playbook.static.hf.space/index.html#revisiting_global_batch_size) (Ultra-Scale Playbook - Data Parallelism) - Revisiting global batch size: the batch equation of microbatch, accumulation and DP degree plus the maximize-dp-then-accumulate recipe; Our journey up to now for the worked large-batch example pattern.
2. [Microbatch accumulation on one GPU](https://nanotron-ultrascale-playbook.static.hf.space/index.html#gradient_accumulation) (Ultra-Scale Playbook - Data Parallelism) - Gradient accumulation: microbatch versus global batch before data parallelism enters.
3. [Accumulation with `no_sync`](https://github.com/LambdaLabsML/distributed-training-guide/blob/aed748914472cca80d8cfe139ab43ec63103913a/related-topics/gradient-accumulation/README.md) (Distributed Training Guide - Chapter 2 DDP) - Standard Implementation versus DataDistributedParalell Implementation: `maybe_sync_grads` with `model.no_sync` on non-final steps and `nullcontext` on the final step, with forward and backward inside the context.

**Focus**

- Global batch is $`\text{gbs} = \text{mbs} \times \text{grad\_acc} \times \text{dp}`$ in samples, times sequence length in tokens. Example: $`\text{mbs} = 2`$, $`\text{grad\_acc} = 4`$, $`\text{dp} = 128`$ gives 1024 samples, or 4,194,304 tokens at length 4096.
- `no_sync` scopes forward plus backward on non-final micro-steps; grads accumulate locally and the first step outside the context syncs.
- Under mean reduction each micro loss is scaled by one over the accumulation count before backward, so the accumulated grad equals the global mean grad. A 2-rank CPU run with two halved micro-steps matches the oracle. The single-process baseline is the one from Schedules, gradient accumulation and clipping.
- The training guide's chapter 2 README (`02-distributed-data-parallel/README.md`) says `optimizer.step()` synchronizes gradients. For DDP that is wrong: the reducer all-reduces during backward and the step is local. During accumulation only the final backward syncs.

**Reproduce:** Extend the unit-2 script: wrap the model in `DistributedDataParallel` on `gloo` (`no_sync` exists only on the wrapper), split each rank shard into two micro-batches with each micro loss halved, run the first forward and backward inside `no_sync` and the second outside it, then take one SGD step. Assert oracle match. Then move the first forward outside the context, count the all-reduces with a communication hook, and show the extra sync while results stay correct.

**Traps**

- Wrapping only backward in `no_sync`. The DDP docs require the forward inside too, or grads still sync.
- Skipping the one-over-K loss scaling under mean reduction. Accumulated grads come out K times too large, which looks like a learning-rate bug.
- Reading the guide's chapter 2 sentence that `optimizer.step()` synchronizes as DDP behavior. With DDP the sync point is backward.

**Practice**

- The section mini-project covers this: accumulation and `no_sync` equivalence under a fixed global batch, including the loss-scaling check.

**Stop when:** You derive the global batch both ways without notes, and your `no_sync` run matches the oracle while the mis-scoped variant stays correct but syncs.

<details>
<summary>Self-test</summary>

1. Microbatch 2, 4 accumulation steps, 128 workers, sequence length 4096. Global batch?
   - 1024 samples; 4,194,304 tokens (about 4M).
2. Why scale each micro loss by one over K for K micro-steps under mean reduction?
   - The K micro-means sum to K times the global mean; dividing restores the oracle gradient.
3. Forward runs outside `no_sync`, backward inside. Effect?
   - Still correct, but DDP synchronizes on that step anyway, so the accumulation saving is lost.
4. Where does DDP synchronize: backward or optimizer step?
   - Backward, through bucket all-reduces on grad-ready hooks. The optimizer step is local on identical averaged grads.

</details>

#### U4. Minimal data parallelism with an explicit all-reduce

**About 4 h** · **Target:** Implement

Topics: Minimal data parallelism with explicit all-reduce

One explicit collective loop, written by hand, is the reference every wrapper must match. Wrappers hide ordering; this unit makes it visible.

**You can now**

- Implement naive data parallelism by hand: broadcast at init, shard the batch evenly, all-reduce and average grads, step locally.
- Pass the CS336 DDP public tests for the plain and tied-weight toy models on CPU.
- State the per-step collective volume for the toy model from its parameter count.

**Study**

1. [Naive DDP: broadcast, shard, all-reduce, step](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/cs336_assignment2_systems.pdf) (CS336 Assignment 2 (Spring 2026) - Section 5 Distributed Data Parallel Training) - Section 5.2 A Naive Implementation of Distributed Data Parallel Training (p. 33): broadcast from rank 0, shard batch n over d devices, local forward and backward, all-reduce average grads, local optimizer step; problems `naive_ddp` (5pt) and `naive_ddp_benchmarking` (3pt).
2. [Public DDP tests and adapter contract](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/tests/test_ddp.py) (CS336 Assignment 2 (Spring 2026) - Section 5 Distributed Data Parallel Training) - Tests `test_DistributedDataParallel` over `ToyModel` and `ToyModelWithTiedWeights` at world size 2 on gloo: `validate_ddp_net_equivalence` broadcast check, disjoint 10-row shards, 5 SGD steps at lr 0.1 with `torch.allclose` per step; adapters `get_ddp` plus `ddp_on_after_backward`.
3. [Naive-path trap (read, do not copy)](https://github.com/huggingface/picotron/blob/59714b1bf25541dbeb6f5a721ed15f6d0768e786/picotron/data_parallel/data_parallel.py) (Picotron - Data Parallelism) - Class `DataParallelNaive`: `register_backward_hook` with `register_post_accumulate_grad_hook` in `_allreduce_grads` (lines 33 to 49). Read-only trap: the hook receives the parameter, so this path averages parameters and leaves `param.grad` local.

**Focus**

- Init broadcasts params from rank 0; the CS336 check `validate_ddp_net_equivalence` all-gathers the `state_dict` and asserts `allclose` on every rank.
- Each rank forwards its disjoint shard (20 rows over 2 ranks gives `offset = rank * local_bs` with 10 rows each), backprops a local mean loss, then `all_reduce` SUM plus divide by world size.
- The optimizer step stays local: identical averaged grads plus identical init keep replicas in sync with no per-step broadcast.
- Frozen params with `requires_grad=False` carry no grads: `no_grad_fixed_param` and the `_FC2` bias stay equal and untouched.

**Reproduce:** Implement `get_ddp` and `ddp_on_after_backward` in your own repo and run `pytest tests/test_ddp.py` on CPU (world size 2, gloo) until both model variants pass all 5 steps.

**Traps**

- Copying the Picotron naive hook. `register_post_accumulate_grad_hook` receives the parameter tensor, not the grad: the shipped code all-reduces weights while grads diverge (for example `grad[0,0]` of `-0.0538` on rank 0 versus `-0.0662` on rank 1 after one backward on different inputs, 2 CPU ranks on `gloo`, PyTorch 2.14.1).
- Dividing by world size twice, or never. All-reduce SUM followed by exactly one division matches the mean oracle.
- Requiring grads for frozen params. The test asserts they stay equal without sync; only `requires_grad` params enter the collective.

**Practice**

- [CS336 Assignment 2: `naive_ddp`](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/tests/test_ddp.py) - Problem (`naive_ddp`), Section 5.2; connect your container to `get_ddp` in `tests/adapters.py` and pass `tests/test_ddp.py`. Runs on CPU with gloo. Implement in your own repository; keep the benchmark write-up even where two GPUs are unavailable.

**Stop when:** Both toy variants pass all 5 steps, and you can explain the Picotron hook trap without notes.

<details>
<summary>Self-test</summary>

1. What three operations does naive DDP need, and when?
   - Broadcast params once at init; per step, all-reduce SUM grads plus one division; local optimizer step. No per-step broadcast.
2. The Picotron naive hook all-reduces its argument and divides. Why do grads still diverge across ranks?
   - Its argument is the parameter. Parameters get averaged while `param.grad` stays local on every rank.
3. 20 examples, world size 2. Which rows does rank 1 train on?
   - Rows 10 to 19: `offset = rank * local_bs` with `local_bs` 10.
4. Why does the test call `ddp_on_after_backward` before the optimizer step?
   - Async implementations wait on grad handles there. A blocking naive version implements it as a no-op.

</details>

#### U5. DDP construction, parameter registration and reducer buckets

**About 4 h** · **Target:** Explain

Topics: PyTorch DDP construction and parameter registration; Reducer buckets and reverse gradient-ready order

Buckets in reverse order are why communication starts before backward finishes. Misreading the order makes every later overlap prediction wrong.

**You can now**

- Explain DDP construction: rank-0 broadcast, reducer creation, bucket formation in reverse registration order.
- Explain gradient-ready order: one hook per parameter, async all-reduce per full bucket, blocking wait at end of backward.
- Contrast bucketed DDP with the hand-rolled per-param loop on launch count and overlap.

**Study**

1. [DDP design note: construction and backward](https://docs.pytorch.org/docs/2.14/notes/ddp.html) (PyTorch DDP Tutorial, Design Note and Communication Hooks) - Construction: broadcast of `state_dict` from rank 0, reducer with buckets sized by `bucket_cap_mb`, mapping in roughly reverse `Model.parameters()` order, one autograd hook per parameter; Backward Pass: per-ready-grad marking, async all-reduce per full bucket, blocking wait, averaged grads in `param.grad`.
2. [DDP constructor surface](https://docs.pytorch.org/docs/2.14/generated/torch.nn.parallel.DistributedDataParallel.html) (PyTorch DDP Tutorial, Design Note and Communication Hooks) - `bucket_cap_mb` default 25 MiB; parameters allreduce in reverse registration order; `find_unused_parameters` default `False`; `static_graph`, `gradient_as_bucket_view`, `no_sync` and `register_comm_hook` signatures.
3. [Overlapped per-parameter DDP](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/cs336_assignment2_systems.pdf) (CS336 Assignment 2 (Spring 2026) - Section 5 Distributed Data Parallel Training) - Section 5.3.2 Overlapping Computation with Communication of Individual Parameter Gradients (pp. 34 to 36): `register_post_accumulate_grad_hook` per param, `async_op=True` all-reduce per ready grad, `finish_gradient_synchronization` wait; problems `ddp_overlap_individual_parameters` (5pt) plus benchmarking (1pt).
4. [PyTorch DDP paper: bucketing and overlap](https://arxiv.org/abs/2006.15704) (PyTorch Distributed: Experiences on Accelerating Data Parallel Training) - arXiv:2006.15704v1, Sections 3 and 5.2: reducer design, overlap through autograd hooks and buckets, default 25MB buckets, with 10 to 25MB best on ResNet50 with NCCL, 50MB best on BERT with NCCL and 5MB best with Gloo, on 16 GPUs.

**Focus**

- The design note maps buckets in roughly reverse `Model.parameters()` order because backward readies last-layer grads first. In PyTorch 2.14.1 with default flags, construction puts every parameter in one bucket; after the first backward DDP rebuilds the buckets in the order the grads actually became ready. With `find_unused_parameters=True` the construction-time buckets stay.
- The reducer fires one async all-reduce per full bucket and always launches buckets in index order on every rank; mismatched order hangs or corrupts.
- After backward returns, `param.grad` already holds the averaged grad on every rank; the optimizer step is local.
- The CS336 overlap build is per-parameter, not bucketed: one async all-reduce per ready grad plus an explicit finish wait. This handout has no bucketed problem; buckets come from Picotron in the next unit.

**Reproduce:** Closed-book, draw a 4-parameter model with a cap covering 2 params: place grads into buckets per the reverse-order rule for a steady-state step, mark which bucket all-reduces first, and state when each launches relative to backward.

**Traps**

- Assuming buckets follow forward order. They follow reverse registration; forward order delays every launch.
- Assuming launches follow ready order across ranks. Index order is the safety rule; ready order can differ per rank.
- Adding or removing params after construction. Hooks were registered at construction for the exact set and order.

**Practice**

- [CS336 Assignment 2: `ddp_overlap_individual_parameters`](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/tests/test_ddp.py) - Problem (`ddp_overlap_individual_parameters`), Section 5.3.2; connect to `get_ddp` plus `ddp_on_after_backward` and run `tests/test_ddp.py` 5 times. Per-param overlap only. Bucketed overlap is built from Picotron in the next unit.

**Stop when:** You can narrate construction, buckets, hooks, ordered all-reduce and the `param.grad` handoff without notes.

<details>
<summary>Self-test</summary>

1. Why reverse order?
   - Backward computes last-layer grads first, so reverse registration matches readiness and buckets fill at the earliest time.
2. The reverse-order assumption is wrong for a model. Consequence?
   - Later launches and less overlap, until DDP rebuilds the buckets in observed ready order after the first iteration (not with `find_unused_parameters=True`). Correctness holds either way.
3. Why bucket index order instead of ready order?
   - Every rank must invoke matching all-reduces in the same order; otherwise backward hangs or grads mismatch.
4. CS336 overlap versus DDP buckets?
   - CS336 launches one async all-reduce per ready param plus a finish wait; DDP groups params into buckets for fewer launches with the same overlap idea.

</details>

#### U6. Bucket size, launch count, autograd hooks and compute-communication overlap

**About 5 h** · **Target:** Implement + Measure

Topics: Bucket size, launch count and exposed communication; Autograd hooks and compute-communication overlap

Bucket size trades launch overhead against exposed communication. The default is a starting point, not an optimum.

**You can now**

- Derive bucket count, launch count and per-step collective bytes from `bucket_cap_mb` and the parameter count.
- Implement bucketed overlap on the Picotron bucket path with an equality test against one process.
- Explain when smaller buckets help overlap and when launch overhead wins, citing the paper's middle-range result.

**Study**

1. [Bucketed overlap implementation](https://github.com/huggingface/picotron/blob/59714b1bf25541dbeb6f5a721ed15f6d0768e786/picotron/data_parallel/bucket.py) (Picotron - Data Parallelism) - `BucketManager._initialize_buckets`: params grouped by `bucket_size` elements with per-param views into `grad_data`; `Bucket.sync_gradient`: divide by group size then async `all_reduce`; `mark_param_as_ready` launches when the bucket fills; `wait` blocks in `_post_backward`.
2. [DataParallelBucket wrapper](https://github.com/huggingface/picotron/blob/59714b1bf25541dbeb6f5a721ed15f6d0768e786/picotron/data_parallel/data_parallel.py) (Picotron - Data Parallelism) - Class `DataParallelBucket`: `bucket_size` from `bucket_cap_mb` with 4 bytes per fp32 grad; grad-accumulator hooks accumulate into `main_grad`; `no_sync` skips marking; `_post_backward` waits then copies `main_grad` to `param.grad`.
3. [Bucket-size sweep](https://arxiv.org/abs/2006.15704) (PyTorch Distributed: Experiences on Accelerating Data Parallel Training) - arXiv:2006.15704v1, Section 5.2: bucket-size sweep with 10 to 25MB best on ResNet50 with NCCL, 50MB best on BERT with NCCL and 5MB best with Gloo, on 16 GPUs; extremes lose to launch overhead or late starts.
4. [Bucket and overlap trade-offs](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapter 4 Overlap and DDP Strategies) - Chapter 4: Overlapping Communication and Computation (Pipelining), Reducing Communication Frequency and Volume, and Achieving Maximal Overlap in Practice; default 25MB buckets, large buckets use bandwidth but delay first launch, small buckets start early but add overhead.

**Focus**

- Bucket count follows the cap and parameter boundaries. On PyTorch 2.14.1 with 2 `gloo` ranks and eight 6.25 MiB fp32 weights (50 MiB), `bucket_cap_mb=25` gave 2 all-reduces per step and the default cap gave 3, because the default keeps the first rebuilt bucket small. The first iteration used one 50 MiB bucket in both. Total bytes stay identical; only launch count and timing change.
- Picotron accumulates each ready grad into its `main_grad` bucket view, fires async all-reduce per full bucket during backward, and copies back to `param.grad` after the wait.
- The paper sweep peaks in the middle: 10 to 25MB best on ResNet50 with NCCL, 50MB best on BERT with NCCL and 5MB best with Gloo, on 16 GPUs. Tiny buckets drown in launch overhead; giant buckets start late and barely overlap.
- One giant bucket means one end-of-backward all-reduce with almost no overlap. Treat any larger-is-sooner claim as workload-specific until your timeline says otherwise.

**Reproduce:** On a 4-param toy with a cap covering exactly one param versus all params, count the launches per step (4 versus 1) and show identical averaged grads; state the launch-count rule.

**Traps**

- Reading fewer launches as fewer bytes. Bytes are fixed by the parameter count and rank count; bucketing only regroups them.
- Expecting overlap from a single giant bucket. With one bucket the all-reduce waits for the last grad.
- Quoting CPU gloo timings as NCCL evidence. Order and equality transfer; timings do not.

**Practice**

- [CS336 Assignment 2: `minimal_ddp_flat_benchmarking`](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/cs336_assignment2_systems.pdf) - Section 5.3.1: single flattened all-reduce through `torch._utils._flatten_dense_tensors`; compare with the per-tensor version at 1 node by 2 GPUs on the xl model; report time per iter plus comm share plus 1 to 2 sentences
- [CS336 Assignment 2: `naive_ddp_benchmarking`](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/cs336_assignment2_systems.pdf) - Section 5.2: per-param all-reduce timing on the xl model at 1 node by 2 GPUs; total step time plus gradient-communication share
- [CS336 Assignment 2: `ddp_overlap_individual_parameters_benchmarking`](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/cs336_assignment2_systems.pdf) - Section 5.3.2: overlapped versus flat versus per-tensor timings plus Nsight screenshots proving overlap. Needs 2 GPUs with NCCL plus Nsight. On CPU or one GPU, run the same three as labeled timing examples only; they are not interconnect evidence.

**Stop when:** Your bucketed run matches the oracle, and you can predict launch count from the cap and explain a measured crossover.

<details>
<summary>Self-test</summary>

1. 50 MiB of fp32 grads in eight equal weights with `bucket_cap_mb=25`. Buckets and launches per step?
   - 2 buckets and 2 all-reduces from the second iteration on; the first used one bucket. The bytes match one 50 MiB all-reduce; the timing differs. The default cap gives 3, since its first rebuilt bucket is small.
2. Why can smaller buckets hurt?
   - Per-launch latency and overhead dominate, and fragmentation grows; the middle range wins.
3. What does `_post_backward` do and when does it run?
   - Queued once per backward; waits for all bucket handles, then copies `main_grad` into `param.grad` before the optimizer step.
4. A source says raising the cap launches sooner. Right?
   - Not in general. Larger buckets fill later; they move bytes more efficiently but start later.

</details>

#### U7. Unused parameters, static graphs and divergent control flow

**About 4 h** · **Target:** Explain + Implement

Topics: Unused parameters and static versus dynamic graphs; Divergent control flow and collective mismatch

One rank taking a different branch turns a collective into a hang. Static versus dynamic is the difference between paying traversal every step and promising stability.

**You can now**

- Explain `find_unused_parameters` cost and `static_graph` promises, and choose between them for a given model.
- Implement correct handling for frozen and tied params, and diagnose a divergent-control hang from the sync-point rule.
- State why `torch.autograd.grad` does not work with DDP.

**Study**

1. [DDP sync points and stragglers](https://docs.pytorch.org/tutorials/intermediate/ddp_tutorial.html) (PyTorch DDP Tutorial, Design Note and Communication Hooks) - Skewed Processing Speeds: constructor, forward and backward as sync points in the same order, plus large `timeout` for stragglers; Basic Use Case broadcast contract (page read 2026-10-14).
2. [Unused-parameter handling in the design note](https://docs.pytorch.org/docs/2.14/notes/ddp.html) (PyTorch DDP Tutorial, Design Note and Communication Hooks) - Forward Pass: graph traversal from the output with `find_unused_parameters=True`, all buckets still reduced, overhead warning.
3. [Static graphs and related constructor flags](https://docs.pytorch.org/docs/2.14/generated/torch.nn.parallel.DistributedDataParallel.html) (PyTorch DDP Tutorial, Design Note and Communication Hooks) - `find_unused_parameters` default `False`, `static_graph` semantics (its logging-key check is stale in 2.14.1), `skip_all_reduce_unused_params`, `no_sync` forward-inside warning, no `torch.autograd.grad` support.

**Focus**

- `find_unused_parameters=True` walks the autograd graph from the output on every forward to mark unused params ready. It still reduces all buckets; it only stops the wait. Pay it only when some forwards genuinely skip params.
- `static_graph=True` promises the used set and the control flow never change. It then supports reentrant backward, activation checkpointing applied several times or over unused parameters, and parameters outside forward. Decide from graph stability: the `can_set_static_graph` logging key the docstring names is absent from `_get_ddp_logging_data()` in PyTorch 2.14.1.
- Constructor, forward and backward are sync points every rank must reach in the same order at about the same time. A rank-dependent branch gives a collective mismatch: hang, timeout, or wrong grads.
- With `skip_all_reduce_unused_params=True` DDP skips reducing unused params. The same params must stay unused on every rank for the whole run; otherwise ranks desynchronize and can hang.

**Reproduce:** On 2 CPU ranks, train a model with a frozen bias and a tied linear pair through the CS336 suite and show both pass unchanged. Then sketch the divergent case on paper: rank 0 runs an extra DDP forward that rank 1 skips, and name the first mismatched collective.

**Traps**

- Setting `find_unused_parameters=True` always to be safe. It pays a traversal every forward; a stable graph with `static_graph=True` is cheaper.
- Changing graph shape per iteration (for example depth by input) with `static_graph=True`. The promise breaks and training hangs or corrupts.
- Calling `torch.autograd.grad` with DDP. The module only works when grads accumulate into `param.grad`.

**Practice**

- [CS336 Assignment 2: frozen and tied params in `test_ddp.py`](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/tests/test_ddp.py) - The frozen-parameter cases (`no_grad_fixed_param`, `_FC2` bias with `requires_grad=False`) and the tied-weight case (`ToyModelWithTiedWeights` with `fc4.weight` tied to `fc2.weight`) inside `tests/test_ddp.py`

**Stop when:** You can decide between `find_unused_parameters` and `static_graph` for a given model and explain a divergent hang from the sync-point rule.

<details>
<summary>Self-test</summary>

1. What does `find_unused_parameters` cost, and when is it worth it?
   - A per-forward graph walk from the output. Pay it only when some params are genuinely unused in some forwards; otherwise use a static graph.
2. Two ranks run different numbers of DDP forwards per step. Symptom?
   - Collective mismatch: hang, timeout, or wrong grads. Constructor, forward and backward must match in count and order on all ranks.
3. What does `static_graph=True` newly support?
   - Reentrant backward, activation checkpointing applied several times or over unused parameters, and parameters outside the forward function. It also skips the per-step search for unused parameters.
4. How does equivalence treat the ToyModel's `fc2.fc.bias` with `requires_grad=False`?
   - It stays equal with no grad and no sync. Init broadcast covers it; the collective touches only `requires_grad` params.

</details>

#### U8. Rank-consistent loss and metrics, and distributed batch normalization

**About 3 h** · **Target:** Explain + Implement

Topics: Rank-consistent loss and metric reduction; Distributed batch normalization vocabulary and limits

Local batch stats and local means lie. A reported loss that mixes denominators cannot be compared across runs.

**You can now**

- Reduce rank-local losses and metrics to one consistent global number with the correct denominator.
- Convert BatchNorm to SyncBatchNorm before DDP and state its training-only and single-GPU limits.
- Explain DDP buffer broadcast versus gradient averaging.

**Study**

1. [DDP buffers and BatchNorm state](https://www.oreilly.com/library/view/deep-learning-at/9781098145279/) (Deep Learning at Scale - Chapter 7 Data Parallelism) - Distributed Data Parallel (pp. 242 to 243): replicas plus per-forward buffer broadcast from the leader, BatchNorm batch statistics through buffers; Devil in the details box on start methods (p. 243).
2. [SyncBatchNorm conversion and limits](https://docs.pytorch.org/docs/2.14/generated/torch.nn.SyncBatchNorm.html) (PyTorch SyncBatchNorm API) - `convert_sync_batchnorm(module, process_group)`: converts all `BatchNorm` layers before the DDP wrap; stats sync within the group; sync disabled in eval; single GPU per process note.
3. [Buffer broadcast versus param sync](https://docs.pytorch.org/docs/2.14/generated/torch.nn.parallel.DistributedDataParallel.html) (PyTorch DDP Tutorial, Design Note and Communication Hooks) - Note that buffers (for example BatchNorm stats) broadcast from rank 0 every iteration while parameters are never broadcast; grads are all-reduced.

**Focus**

- Global mean needs the global denominator: average rank-local means only with equal local counts. With 4 versus 2 samples, sum-then-divide gives 2.667 while averaging the means gives 3.0.
- Reduce metrics as SUM and COUNT, then divide once. Never average per-rank accuracies over different denominators.
- Convert with `convert_sync_batchnorm` before wrapping with DDP. Stats sync within the group during training only; eval uses running estimates; only single GPU per process is supported. Its training forward rejects CPU tensors (`SyncBatchNorm expected input tensor to be on GPU`), so a CPU check reduces sums and counts by hand. The BatchNorm axes are the ones from Batch, layer, group and RMS normalization.
- DDP broadcasts buffers from rank 0 every forward but never rebroadcasts params; grads are the all-reduced quantity in backward.

**Reproduce:** On 2 CPU ranks with uneven shards (4 versus 2 samples), compute the global mean both ways: plain average of local means and sum-over-count. Show they differ, then implement the correct reduction and match a single-process mean over all 6 samples.

**Traps**

- Averaging per-rank accuracies or losses over unequal local shards (padding, last batches, join). The small shard gets overweighted.
- Skipping conversion and running per-rank BatchNorm. Local stats plus running estimates diverge silently across ranks.
- Expecting stat sync in eval. SyncBatchNorm syncs during training only.

**Practice**

- [Deep Learning at Scale: Scene Parsing with DDP](https://www.oreilly.com/library/view/deep-learning-at/9781098145279/) - Hands-On Exercise #4 Scene Parsing with DDP (pp. 247 to 251): Lightning `strategy=ddp` training with `sync_dist=True` validation reduction; compare the 1-GPU baseline against rank-consistent 2-GPU numbers. With two or more GPUs, run it and compare the rank-consistent numbers against the 1-GPU baseline. On one GPU or CPU, read the `sync_dist=True` path and treat the book's 1-GPU versus 2-GPU V100 numbers as the author's example. Focus on the metric-reduction path, not the segmentation scores.

**Stop when:** Your reduction matches sum-over-count on uneven shards, and you can state the BatchNorm conversion order plus its limits without notes.

<details>
<summary>Self-test</summary>

1. Rank losses 2.0 over 4 samples and 4.0 over 2 samples. Global mean?
   - 2.667, from `(2.0 * 4 + 4.0 * 2) / 6`. Averaging the means gives 3.0, which overweights the small shard.
2. When is averaging local means correct?
   - With equal local counts and the same reduction. Otherwise weight by counts.
3. Where does `convert_sync_batchnorm` go relative to the DDP wrap?
   - Before wrapping. Then wrap; only single GPU per process is supported.
4. Buffers versus params in a DDP iteration?
   - Buffers broadcast from rank 0 to all ranks each forward; params are never rebroadcast; grads all-reduce in backward.

</details>

#### U9. DDP communication hooks, compression contracts and a PowerSGD experiment

**About 4 h** · **Target:** Implement + Measure

Topics: Communication hooks and compression contracts; PowerSGD or low-precision communication hook experiment

Compression trades bytes for bias. The hook contract decides where the bias enters and who corrects it.

**You can now**

- Explain the comm-hook contract: `GradBucket` in, Future of one same-shape tensor out, division owned by the hook.
- Implement `fp16_compress_hook` on a 2-rank CPU DDP job and bound its error versus vanilla all-reduce.
- Run a small PowerSGD experiment and report the compression-versus-accuracy trade with its tuning knobs.

**Study**

1. [Comm-hook contract and default hooks](https://docs.pytorch.org/docs/2.14/ddp_comm_hooks.html) (PyTorch DDP Tutorial, Design Note and Communication Hooks) - How to Use plus What Does a Communication Hook Operate On: `GradBucket.buffer`, per-bucket call, single-tensor Future; Default hooks: `allreduce_hook` reference plus `fp16_compress_hook` and `bf16_compress_hook`; Debugging hooks: `noop_hook` headroom-only warning.
2. [PowerSGD state and hooks](https://docs.pytorch.org/docs/2.14/ddp_comm_hooks.html) (PyTorch DDP Tutorial, Design Note and Communication Hooks) - PowerSGD State (`matrix_approximation_rank`, `start_powerSGD_iter`, `min_compression_rate`, `use_error_feedback`, `warm_start`, grad-sized extra memory, minimum start 2) plus PowerSGD Hooks (per-tensor path versus batched variant) and the serialization example.
3. [Hook registration contract](https://docs.pytorch.org/docs/2.14/generated/torch.nn.parallel.DistributedDataParallel.html) (PyTorch DDP Tutorial, Design Note and Communication Hooks) - `register_comm_hook(state, hook)`: hook signature, buckets not predivided by world size, register once before backward, Future holds the new bucket value.

**Focus**

- Each hook takes one flattened bucket buffer and returns a Future of a single tensor with the same shape. Custom ops divide by world size themselves: buckets are not predivided.
- The `fp16_compress_hook` casts, all-reduces in fp16, casts back. Bound it near `1e-3` relative (a 2-rank `gloo` ToyModel run on PyTorch 2.14.1 stayed within it); bandwidth claims need NCCL hardware.
- PowerSGD keeps low-rank factors with error feedback and warm start at about grad-sized extra memory, defers compression to `start_powerSGD_iter`, tunes rank 1, 2, 4 upward, and skips vectors and incompressible tensors.
- The `noop_hook` measures all-reduce headroom only. Never train with it.

**Reproduce:** On 2 CPU ranks, register `fp16_compress_hook` on one ToyModel DDP job and `allreduce_hook` on an identical one; assert grads agree within `1e-3` relative for 5 steps. Then switch to `powerSGD_hook` with `matrix_approximation_rank=1` and `start_powerSGD_iter=10` and show the first 10 steps match vanilla exactly.

**Traps**

- Forgetting the division in a custom hook. Buckets arrive undivided, so grads come out R times too large.
- Registering the hook after backward started. It applies late or errors; register before the loop.
- Reading CPU gloo compression timing as interconnect evidence, or compressing from step 0 with feedback on. Bandwidth claims need NCCL hardware and early sensitive steps need vanilla all-reduce.

**Practice**

- [PyTorch docs: PowerSGD hook experiment](https://docs.pytorch.org/docs/2.14/ddp_comm_hooks.html) - PowerSGD State plus PowerSGD Hooks sections with the end-to-end register-and-compare example: `PowerSGDState(process_group, matrix_approximation_rank=1, start_powerSGD_iter=10)` with `powerSGD_hook` on the ToyModel DDP job versus vanilla `allreduce_hook`; report steps-to-match and final param distance. CPU gloo bounds the error only. Throughput or compression-ratio claims need NCCL hardware.

**Stop when:** The fp16 run stays within its bound and you can state the PowerSGD rank, start-iter and feedback trade without notes.

<details>
<summary>Self-test</summary>

1. A hook returns what, and who divides?
   - A Future of a single tensor with the bucket buffer shape. Custom ops divide by world size themselves.
2. Why is `start_powerSGD_iter` at least 2 with error feedback on?
   - DDP rebuilds buckets at iteration 1, which conflicts with tensors memorized before the rebuild.
3. fp16 hook error bound on the CPU demo?
   - Near `1e-3` relative versus fp32 vanilla. Bandwidth claims need NCCL hardware.
4. Which tensors does PowerSGD skip, and why?
   - Vectors such as biases, plus shapes failing `min_compression_rate`. Overhead would exceed the saving.

</details>

#### U10. Stragglers, weak and strong scaling, parallel efficiency and hierarchical DP

**About 5 h** · **Target:** Derive + Measure

Topics: Slow data ranks and compute stragglers; Weak scaling, strong scaling and parallel efficiency; Hierarchical data parallelism within and across nodes

More workers can reduce both statistical and hardware efficiency. Scaling numbers without fixed work and denominators are marketing.

**You can now**

- Derive weak versus strong scaling efficiency and parallel efficiency from fixed-work timings.
- Diagnose a straggler to input, launch, kernel, collective or imbalance causes using rank timelines.
- Explain hierarchical data parallelism across fast intra-node and slow inter-node links plus the ring-latency limit.

**Study**

1. [Data-parallel scaling limits](https://nanotron-ultrascale-playbook.static.hf.space/index.html#data_parallelism) (Ultra-Scale Playbook - Data Parallelism) - Past the DP optimizations: ring-latency bound past hundreds of GPUs with flat memory per GPU and dropping throughput; Our journey up to now: the dp-first then accumulation recipe.
2. [Stragglers as sync-point timeouts](https://docs.pytorch.org/tutorials/intermediate/ddp_tutorial.html) (PyTorch DDP Tutorial, Design Note and Communication Hooks) - Skewed Processing Speeds: constructor, forward and backward as sync points in the same order, workload balance as user duty, large `timeout` for stragglers (page read 2026-10-14).
3. [Single-node collective benchmarking](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/cs336_assignment2_systems.pdf) (CS336 Assignment 2 (Spring 2026) - Section 5 Distributed Data Parallel Training) - Section 5.1 Single-Node Distributed Communication in PyTorch (pp. 30 to 32) with 5.1.1 Best Practices (p. 32): all-reduce over 1MB to 1GB across 2, 4 or 6 ranks, 5 warmup iters, synchronize even with `async_op=False`, aggregate with `dist.all_gather_object`; problem `distributed_communication_single_node` (5pt).
4. [Per-phase timers with sync](https://github.com/LambdaLabsML/distributed-training-guide/blob/aed748914472cca80d8cfe139ab43ec63103913a/02-distributed-data-parallel/train_llm.py) (Distributed Training Guide - Chapter 2 DDP) - Lines 127 and 140 to 159: the `timers` dict over data, forward, backward and update phases; class `LocalTimer` (lines 283 to 309) synchronizes the device before and after each region.

**Focus**

- Strong scaling fixes the global batch and divides it; weak scaling fixes the per-rank shard and grows the global batch. Strong efficiency is $`T_1/(p T_p)`$; weak compares the 1-rank step against the p-rank step at fixed per-rank work.
- Attribute first: per-rank data, forward, backward and update timers separate input starvation from launch, kernel, collective and imbalance causes. Timeouts name the reporter; the slowest rank's last phase names the culprit.
- Hierarchical DP uses the two-level all-reduce from Hierarchical collectives and compressed communication with accuracy controls: reduce-scatter inside each node, all-reduce each shard across nodes, all-gather inside the node. Past hundreds of GPUs ring latency bounds flat DP; the Playbook runs are their H100 and EFA cluster's results, not targets.
- CPU gloo timings prove logic and efficiency arithmetic only. No interconnect claim leaves this unit without NCCL hardware.

**Reproduce:** Run the fixed 8-row oracle job on 1 rank and on 2 CPU ranks with `torchrun`; compute strong efficiency from the two step times, labeled with hardware, PyTorch 2.14.1, gloo and world size; then inject a 200 ms sleep into rank 1's data phase and show which timer moves.

**Traps**

- Changing the global batch between the 1-rank and p-rank runs, then calling the ratio strong scaling.
- Blaming the rank that raised the timeout. Collectives report at the waiter; diagnose from the slowest rank's timers.
- Quoting Playbook, paper, or vendor speedups as targets. They are other clusters' measurements under other batches.

**Practice**

- [CS336 Assignment 2: `distributed_communication_single_node`](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/cs336_assignment2_systems.pdf) - Section 5.1 with 5.1.1: benchmark all-reduce over 1MB, 10MB, 100MB and 1GB across 2, 4 or 6 ranks; warmup, synchronize, aggregate; plots or tables plus 2 to 3 sentences. Use gloo on CPU for debug and NCCL on GPUs for bandwidth. CPU numbers are not interconnect evidence.

**Stop when:** You compute both efficiencies from fixed-work runs and localize an injected slow rank to the right timer without notes.

<details>
<summary>Self-test</summary>

1. Strong versus weak setup and efficiency formula?
   - Strong: fixed global batch with efficiency $`T_1/(p T_p)`$. Weak: fixed per-rank work with a p-times global batch, efficiency against the 1-rank step.
2. Only rank 3's data timer is high. First suspect?
   - That rank's input path: loader, prefetch, storage or shared-drive contention. Not the collective.
3. Why does Playbook DP throughput drop past hundreds of GPUs?
   - Ring-latency bound coordination plus overhead; per-GPU memory stays flat.
4. Hierarchical DP in one sentence?
   - Reduce-scatter within each node, all-reduce each GPU's shard across nodes, then all-gather within the node, so only a 1/g share of the node's reduced gradient crosses the slow links per GPU, where g is GPUs per node.

</details>

#### U11. Synchronized timing under fixed work and gradient-ready and bucket timelines

**About 4 h** · **Target:** Measure

Topics: Warmup, fixed global work and synchronized timing; Gradient-ready and bucket timeline instrumentation

Unsynchronized, unwarmmed timings are fiction on async runtimes. The bucket timeline is the only honest picture of overlap.

**You can now**

- Apply warmup, synchronization and fixed global work to every timing.
- Instrument gradient-ready and bucket all-reduce start and end per rank.
- Read a timeline to say whether communication hid behind compute or stayed exposed.

**Study**

1. [Benchmark hygiene and Nsight overlap proof](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/cs336_assignment2_systems.pdf) (CS336 Assignment 2 (Spring 2026) - Section 5 Distributed Data Parallel Training) - Section 5.1.1 Best Practices for Benchmarking Distributed Applications (p. 32): warmup, synchronize, same-machine comparison, cross-rank aggregation; Section 5.3.2 benchmarking (p. 36): two Nsight screenshots proving overlapped versus sequential backward plus communication.
2. [Synchronized per-phase timers](https://github.com/LambdaLabsML/distributed-training-guide/blob/aed748914472cca80d8cfe139ab43ec63103913a/02-distributed-data-parallel/train_llm.py) (Distributed Training Guide - Chapter 2 DDP) - `timers` dict over data, forward, backward and update (lines 127, 140 to 159); `LocalTimer` synchronizes the device before and after each region and reports average ms (lines 283 to 309).
3. [Streams, events and overlap reading](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapter 4 Overlap and DDP Strategies) - Chapter 13: Concurrency with CUDA Streams and Overlapping Communication and Computation; Stream Synchronization with Events (with two or more GPUs, read bucket all-reduces on the communication stream against backward compute).

**Focus**

- Warm up (5 iters per CS336), synchronize both sides of every region, fix the global batch, aggregate across ranks, report mean plus spread. These are the rules from Streams, asynchronous copies and honest timing and Profiling training phases and verifying optimizations.
- Stamp grad-ready plus all-reduce start and end per bucket per rank. Interleaved all-reduces during backward are hidden; the tail wait after backward is exposed.
- One bucket gives one end-of-backward all-reduce: fully exposed. The CS336 screenshots show the same contrast under Nsight.
- CPU timelines prove ordering and the hidden-versus-exposed reading. GPU overlap claims need two or more GPUs.

**Reproduce:** On 2 CPU ranks, log per-bucket ready plus all-reduce start and end stamps around a 2-bucket backward on a step after the first, once DDP has rebuilt its buckets; print the interleave and compute the exposed tail as the time from the last grad-ready stamp to the end of the last all-reduce.

**Traps**

- Timing CUDA without synchronize. Async launches return at once; you time submission.
- Timing the first step as steady state. Allocator prep plus DDP bucket rebuild make it slower; warmup excludes it.
- Comparing timelines across different global batches. Fix work first; the scaling unit enforces it.

**Practice**

- The section mini-project covers this: per-rank gradient-ready and bucket-collective timelines with hidden-versus-exposed reading.

**Stop when:** Your 2-rank timeline labels hidden and exposed intervals under fixed global work without notes.

<details>
<summary>Self-test</summary>

1. Why synchronize before and after the timed region?
   - Launches are async: without sync you time submission, and earlier work bleeds into the region.
2. All-reduces sit entirely after backward. Reading?
   - Fully exposed, no overlap. Check the bucket count; one bucket explains it.
3. First step 3 times slower, rest flat. Bug?
   - Usually not: allocator prep, DDP's single all-parameter bucket on the first iteration and the bucket rebuild after it. Warmup exists for this.
4. CPU timeline interleaves perfectly. Claim GPU overlap?
   - No. Ordering logic transfers; timing does not across streams, NCCL and kernels.

</details>

#### U12. Failure cleanup and rank-attributed logs in data-parallel training

**About 3 h** · **Target:** Implement

Topics: Failure cleanup and rank-attributed logs

A multi-process job with one log stream is undebuggable. Rank tags plus bounded cleanup turn hangs into readable first-cause lines.

**You can now**

- Add rank-attributed logging to every data-parallel log line.
- Implement bounded teardown with barrier timeout and `destroy_process_group` in `finally`.
- Attribute a rank crash to its first cause from per-rank logs.

**Study**

1. [Rank-attributed logs and rank-zero side effects](https://github.com/LambdaLabsML/distributed-training-guide/blob/aed748914472cca80d8cfe139ab43ec63103913a/02-distributed-data-parallel/train_llm.py) (Distributed Training Guide - Chapter 2 DDP) - Lines 43 to 50: the `[rank=...]` log format plus rank and world-size line; line 132: progress bar disabled above rank 0; lines 122 to 125 and 192 to 199: rank-0-only directory and checkpoint with barrier guards; lines 272 to 280: `rank0_first`.
2. [Rank-attributed failure walk](https://github.com/LambdaLabsML/distributed-training-guide/blob/aed748914472cca80d8cfe139ab43ec63103913a/related-topics/elastic-training/toy.py) (Distributed Training Guide - Chapter 2 DDP) - Per-rank step logs with the rank tag, `dist.barrier` per step, rank-0 state persist; each rank raises when its draw falls under 0.001, so the job crashes on its own within a few hundred steps (a 2-rank CPU run on PyTorch 2.14.1 stopped at step 402 in about 2 s). Delete `toy-state.json` before a fresh run: a rerun resumes from its step count.
3. [Teardown and checkpoint barriers](https://docs.pytorch.org/tutorials/intermediate/ddp_tutorial.html) (PyTorch DDP Tutorial, Design Note and Communication Hooks) - Save and Load Checkpoints: save on rank 0, `dist.barrier` before load, per-rank `map_location`; `cleanup` with `destroy_process_group`; file deletion needs no extra barrier after backward all-reduce (page read 2026-10-14).

**Focus**

- Tag every line with rank (plus local rank at launch): the `[rank=...]` format makes interleaved streams attributable.
- Rank 0 owns side effects: downloads, directories, checkpoints, progress. Barriers bracket shared artifacts so no rank reads unfinished state.
- Teardown runs in `finally` with a bounded timeout plus `destroy_process_group`. A barrier with no explicit timeout waits for the process-group default (30 minutes, or 10 for NCCL, in 2.14.1) while a peer is stuck, so pass a short one.
- Read first cause, not the reporter: the earliest stuck rank with its last timer phase (data, backward, collective) attributes the fault.

**Reproduce:** Launch a 2-rank CPU job with rank-tagged logs and `try` with `finally` teardown; raise on rank 1 at step 3. Show the survivor exits boundedly and the logs name rank 1 with its last phase.

**Traps**

- One shared log stream with no rank tags. Interleaved ranks cannot attribute a stall.
- Skipping teardown on the exception path. Orphan procs hold the port and the next run collides; use a distinct port per run.
- Checkpointing on all ranks to one path concurrently. Writes interleave; rank-0-only plus barrier is the rule.

**Practice**

- [Training-guide lab: elastic-training `toy.py`](https://github.com/LambdaLabsML/distributed-training-guide/blob/aed748914472cca80d8cfe139ab43ec63103913a/related-topics/elastic-training/toy.py) - Run on 2 CPU ranks with the GPU hidden (`CUDA_VISIBLE_DEVICES=` selects `gloo`) under `timeout`: read the rank-tagged step logs, watch barrier-coupled progress, find the raising rank in the traceback and the rank-0 state file, and state the first-cause rank. Read here for log attribution and teardown only; restart membership belongs to the checkpointing section.

**Stop when:** Your crash run names the first-cause rank within a bounded time and no orphan holds the port.

<details>
<summary>Self-test</summary>

1. Why barriers on both sides of `rank0_first`?
   - Rank 0 acts first while others wait; the trailing barrier stops early readers of unfinished state.
2. A survivor sits in a barrier for many minutes while its peer is stuck. Missing what?
   - A short explicit timeout and teardown in `finally`. Without one the barrier waits for the process-group default timeout.
3. Rank 1 times out in backward all-reduce. Culprit?
   - Not necessarily rank 1. Find the slowest rank and its last phase; the waiter reports, the straggler causes.
4. Why a distinct port per run?
   - Crashed runs leave orphans holding ports; concurrent workers collide on fixed ports.

</details>

### Mini-project: Data-parallel training with overlapped buckets

**About 12 to 16 hours.** Build data-parallel training in `parallel/` on the `comm/` layer: disjoint sharding, explicit averaging, bucketed overlap and honest timelines. This is the first distributed optimizer step in trainlab, and its oracle discipline carries into sharded and model-parallel sections.

1. Shard the corpus with `DistributedSampler`, proving disjointness and union on every rank under both padding policies; call `set_epoch` each epoch and show epoch resume reproduces the interrupted order.
2. Fix a single-process oracle for a small model, then match it step for step with hand-rolled broadcast, shard, all-reduce average and a per-rank update; pass the CS336 DDP tests for plain and tied-weight models.
3. Hold the global batch fixed while accumulating over micro-steps with `no_sync` on non-final steps; prove equivalence with the oracle, show the mis-scoped variant still syncs, and check the loss-scaling rule.
4. Group gradients into buckets that all-reduce asynchronously during backward and match the oracle; compare launch counts across bucket caps, and bound a compressed hook plus a small PowerSGD experiment against vanilla averaging with accuracy evidence.
5. Record per-rank gradient-ready and bucket-collective intervals under fixed global work and label hidden against exposed communication; derive scaling efficiency from fixed-work runs and localize an injected slow rank, keeping GPU timing claims to runs with two or more GPUs.
6. Reduce rank shard losses and counts to one global metric with the correct denominator; reduce BatchNorm sums and counts by hand on CPU, where `SyncBatchNorm` rejects training input, and on your GPU convert with `convert_sync_batchnorm` before wrapping, and attribute a rank crash to its first cause from rank-tagged logs with bounded teardown.

**Deliverables**

- Disjoint sharding with sampler tests and the single-process oracle.
- Explicit, bucketed and overlapped data-parallel steps with equivalence and timeline evidence.
- Compression bounds, scaling-efficiency numbers and the crash-attribution log.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [CS336 Assignment 2 DDP tests](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/tests/test_ddp.py). Pass both model variants on CPU with the oracle comparison after every step.
- external-tests: [TensorTonic: Synchronize Data-Parallel Gradients](https://www.tensortonic.com/problems/cs336-l07-data-parallel-gradient-sync). Pass the public averaging cases before wiring the collective version.
- external-tests: [PyTorch DDP communication hooks PowerSGD experiment](https://docs.pytorch.org/docs/2.14/ddp_comm_hooks.html). Run the register-and-compare example on CPU; keep error and accuracy evidence.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Shard ownership | Shards are proved disjoint with union coverage under both policies, and epoch resume reproduces the interrupted order. | A seeded overlap is caught by the tests and padding tokens are excluded from the reported batch. |
| Update equivalence | Explicit, accumulated and bucketed steps each match the oracle within a stated tolerance, including tied weights. | The suite passes repeatedly and the tolerance is derived from a rounding study, not guessed. |
| Overlap honesty | Timelines label hidden against exposed intervals under fixed work, and launch counts follow the cap. | A bucket-size crossover is measured with the losing side kept, and compression keeps its accuracy bound. |
| Failure attribution | Metrics use the global denominator, and the crash run names its first cause within a bounded time. | A divergent-control hang is drilled and distinguished from a dead rank. |

Feeds into: Averaged data-parallel steps, the oracle habit and timelines feed sharded training, model parallelism and the capstone contribution baseline.

### Resource route

- **Primary - Assignment:** [CS336 Assignment 2 (Spring 2026) - Section 5 Distributed Data Parallel Training](https://github.com/stanford-cs336/assignment2-systems) - Complete `naive_ddp`, `naive_ddp_benchmarking`, `minimal_ddp_flat_benchmarking`, `ddp_overlap_individual_parameters` and its benchmarking problem with your own implementation. `tests/test_ddp.py` runs on CPU with Gloo; keep the benchmark method and written derivations even when multiple GPUs are unavailable. This year's handout has no bucketed problem: build buckets from Picotron.
- **Required - Implementation:** [Picotron - Data Parallelism](https://github.com/huggingface/picotron) - Read `data_parallel/bucket.py` and the `DataParallelBucket` path beside `train.py`, and rebuild bucketed overlap with an equality test against one process. Read `DataParallelNaive` as a trap: its `register_post_accumulate_grad_hook` hook receives the parameter, so it averages parameters and leaves gradients local; show the unequal gradients on two CPU ranks.
- **Support - Course:** [Picotron Tutorial - Steps 5 and 6 and Part 3 Video](https://github.com/huggingface/picotron_tutorial) - Follow `step5_data_parallel_naive` and `step6_data_parallel_bucket` with the Part 3 video. Step 5 carries the same parameter-hook trap as Picotron; use step 6 for the equivalence gate.
- **Support - Lab:** [Distributed Training Guide - Chapter 2 DDP](https://github.com/LambdaLabsML/distributed-training-guide) - Apply Chapter 2 to a tiny causal-LM loop: `torchrun`, rank-aware logs, `DistributedSampler`, rank-zero side effects and the ZeRO memory subsection, plus the gradient-accumulation and effective-batch related topics. Its README says `optimizer.step()` synchronizes gradients; DDP averages them during backward, so correct that line in your notes.
- **Required - Theory:** [Ultra-Scale Playbook - Data Parallelism](https://nanotron-ultrascale-playbook.static.hf.space/index.html#data_parallelism) - Read Data Parallelism through Revisiting global batch size and Our journey up to now (overlap, bucketing, accumulation and the global batch equation). Derive replicated-state memory, gradient communication and batch constraints for your tiny model before measuring it; ZeRO belongs to DT-4.
- **Support - Reference:** [PyTorch DDP Tutorial, Design Note and Communication Hooks](https://docs.pytorch.org/tutorials/intermediate/ddp_tutorial.html) - Use the tutorial for setup, `DistributedSampler`, `no_sync`, unused parameters and teardown, the design note at https://docs.pytorch.org/docs/2.14/notes/ddp.html for buckets and gradient-ready order, and https://docs.pytorch.org/docs/2.14/ddp_comm_hooks.html for communication hooks. Consult them after the from-scratch path so wrappers do not replace the mechanism model.
- **Support - Paper:** [PyTorch Distributed: Experiences on Accelerating Data Parallel Training](https://arxiv.org/abs/2006.15704) - Read the design sections on gradient bucketing, overlap with backward, `no_sync` and unused-parameter detection. Use them to explain why buckets follow reverse registration order.
- **Support - Book:** [Deep Learning at Scale - Chapter 7 Data Parallelism](https://www.oreilly.com/library/view/deep-learning-at/9781098145279/) - Read Data Partitioning, Sampling Strategies, DDP and the data-pipeline sections, and use the small DDP exercises as extra practice. Its FSDP and ZeRO material predates FSDP2.
- **Support - Practice:** [TensorTonic - Synchronize Data-Parallel Gradients](https://www.tensortonic.com/study-plans/language-modeling-from-scratch) - Solve Synchronize Data-Parallel Gradients before the CS336 DDP tests.
- **Support - Book:** [AI Systems Performance Engineering - Chapter 4 Overlap and DDP Strategies](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) - Read Overlapping Communication and Computation, Achieving Maximal Overlap in Practice and Distributed Data Parallel Strategies in Chapter 4, and the Chapter 13 streams section on overlapping communication. With two or more GPUs, compare `code/ch04/ddp_no_overlap.py` and `ddp_overlap.py`; they refuse one-rank runs.
- **Reference - Reference:** [PyTorch SyncBatchNorm API](https://docs.pytorch.org/docs/2.14/generated/torch.nn.SyncBatchNorm.html) - Use `convert_sync_batchnorm` to convert BatchNorm layers before wrapping with DDP, and read the training-only sync plus single-GPU-per-process limits.

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

### Study units

#### U1. The replicated data-parallel memory baseline by dtype

**About 3 h** · **Target:** Derive

Topics: Replicated data parallel memory baseline by dtype

Sharding savings are only meaningful against a stated baseline. Build on GPU memory: allocated, reserved, peak and memory models, and Optimizers from SGD to AdamW; here the new job is accounting by rank and dtype.

**You can now**

- Derive replicated parameter, gradient and Adam state bytes from the tensors actually kept by a precision policy.
- Separate persistent model state from gathered weights, activations, temporary buffers and allocator reserve.

**Study**

1. [ZeRO: the model-state baseline](https://arxiv.org/abs/1910.02054v3) (ZeRO: Memory Optimizations Toward Training Trillion Parameter Models) - arXiv:1910.02054v3, Section 3.1, Model States: Optimizer States, Gradients and Parameters; Section 3.2, Residual Memory Consumption.
2. [Memory usage revisited](https://nanotron-ultrascale-playbook.static.hf.space/index.html#zero_redundancy_optimizer_(zero)) (Ultra-Scale Playbook - Zero Redundancy Optimizer (ZeRO)) - Zero Redundancy Optimizer (ZeRO), subsection Memory usage revisited. Depth: Stop before ZeRO-1. Its extra FP32 accumulation buffer is a specific storage choice, not a mandatory extra copy under every mixed-precision implementation.

**Focus**

- For parameter count $`N`$, sum each stored category once. The paper keeps half-precision parameters and gradients plus FP32 master parameters and two FP32 moments: $`(2+2+4+4+4)N = 16N`$ bytes.
- FP32 parameters with FP32 gradients and two FP32 Adam moments also use $`16N`$ tensor bytes, but have different lifetimes and communication payloads. Autocast alone does not require a persistent half-precision parameter copy.
- Inspect Adam after its first update, when moments exist. Count per-parameter step scalars separately; gradients may be absent after clearing them.
- Use decimal GB for $`10^9`$ bytes and GiB for $`2^{30}`$ bytes. Persistent model-state totals are not peak process or device memory.

**Reproduce:** Closed-book, make a rank-local byte ledger for a model with $`N = 1{,}000{,}000`$ parameters under the paper's half-precision Adam layout. Derive 16,000,000 tensor bytes per replica, excluding step scalars, activations and temporaries. Then count parameters, gradients and Adam moments in a small FP32 CPU model after one update and explain why its main tensor categories have the same total but a different layout.

**Traps**

- Counting an FP32 master parameter twice when the optimizer already updates the original FP32 parameter.
- Dividing activations by world size while holding local microbatch fixed. ZeRO changes model-state ownership, not that local workload.
- Measuring only before the first optimizer step and concluding that Adam has no state.

**Practice**

- The section mini-project covers this: the trainlab dtype-aware replicated-state ledger, checked against actual tensors after the first optimizer update.

**Stop when:** Your ledger names every tensor category and reconciles its byte count with a small CPU model, without calling the persistent total a peak.

<details>
<summary>Self-test</summary>

1. Does BF16 compute imply two-byte persistent parameters?
   - No. FSDP2 can keep original FP32 shards for the optimizer while gathering BF16 parameters for compute. State the storage policy separately from compute precision.
2. Why is the paper's optimizer multiplier 12 rather than 8 bytes per parameter?
   - It includes the four-byte FP32 master parameter as well as two four-byte Adam moments.
3. Can a model whose persistent state fits still run out of memory?
   - Yes. Activations, full gathered weights, full local gradients, communication staging, optimizer temporaries and allocator reserve can raise the peak above capacity.

</details>

#### U2. ZeRO-1, ZeRO-2 and ZeRO-3 partitioning

**About 5 h** · **Target:** Derive

Topics: ZeRO-1 optimizer-state partitioning; ZeRO-2 gradient and optimizer-state partitioning; ZeRO-3 parameter, gradient and optimizer-state partitioning

Each ZeRO stage removes a different replicated category. That distinction predicts both the memory floor and the communication needed to preserve data-parallel updates.

**You can now**

- Derive per-rank model-state memory for ZeRO-1, ZeRO-2 and ZeRO-3 from ownership, including the unsharded floor.
- Explain which rank updates each shard and how all ranks obtain the next parameter version.
- Distinguish the assignment's whole-parameter optimizer partition from ideal evenly pooled sharding.

**Study**

1. [The three ZeRO stages](https://nanotron-ultrascale-playbook.static.hf.space/index.html#zero_redundancy_optimizer_(zero)) (Ultra-Scale Playbook - Zero Redundancy Optimizer (ZeRO)) - Zero Redundancy Optimizer (ZeRO): ZeRO-1: Partitioning optimizer states; ZeRO-2: Adding gradient partitioning; ZeRO-3: Adding parameter partitioning (FSDP). Depth: Stop before Tensor Parallelism. Read the 'two times faster' aside as an equal-payload ring byte comparison, not a measured latency guarantee.
2. [Ownership and memory savings](https://arxiv.org/abs/1910.02054v3) (ZeRO: Memory Optimizations Toward Training Trillion Parameter Models) - arXiv:1910.02054v3, Sections 5.1 to 5.3, Deep Dive into ZeRO-DP; Figure 1 and Table 1.
3. [Optimizer-state sharding contract](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/cs336_assignment2_systems.pdf) (CS336 Assignment 2 (Spring 2026) - Sections 6, 7 and 8.3) - Section 6, problems `optimizer_state_sharding` and `optimizer_state_sharding_accounting`, printed pp. 37 to 38. Depth: Implement the CPU correctness part now. For accounting parts (a) and (b), use a CPU tensor ledger first; with two or more GPUs, measure a model that fits your GPUs rather than requiring the handout's xl configuration.

**Focus**

- Let $`P`$, $`G`$ and $`O`$ be total parameter, gradient and optimizer bytes, and $`R`$ the rank count. Ideal even-shard persistent totals are $`P+G+O`$, $`P+G+O/R`$, $`P+(G+O)/R`$ and $`(P+G+O)/R`$ for DDP through ZeRO-3.
- In the paper's layout, $`P=2N`$, $`G=2N`$ and $`O=12N`$. The advertised fourfold and eightfold stage-1 and stage-2 savings are large-degree limits, not exact savings at every rank count.
- The assignment retains replicated parameters and gradients, updates only owned whole parameters, then broadcasts them. Its public test supplies matching gradients on both ranks; gradient averaging on disjoint data remains your trainer's responsibility.
- Whole-parameter ownership, per-tensor dim-0 sharding, padding and pooled-byte ceilings are different allocation models. Write down which one your calculation uses.

**Reproduce:** Derive the four memory expressions without looking. For the paper's layout with $`N=1{,}000{,}000`$ and $`R=4`$, obtain 16,000,000, 7,000,000, 5,500,000 and 4,000,000 persistent bytes per rank. Then draw which rank owns a parameter's moments, reduced gradient and stored weight at each stage; add the transient full weight needed by stage 3.

**Traps**

- Calling optimizer-state sharding gradient synchronization. Ownership of moments does not itself average different ranks' gradients.
- Assigning tied parameter aliases to different owners and applying the update twice.
- Using the ideal persistent ZeRO-3 total as an OOM prediction without a gather window.

**Practice**

- [TensorTonic: Account for ZeRO Memory by Stage](https://www.tensortonic.com/problems/cs336-l08-zero-memory-accounting) - Implement `zero_memory_accounting(parameter_bytes, gradient_bytes, optimizer_bytes, world_size)`. Free. Public cases cover even four-way sharding, an uneven three-way byte pool and one rank. Follow its pooled-byte ceilings; they are not PyTorch's per-tensor allocation rule.
- [CS336 Assignment 2: `optimizer_state_sharding`](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/tests/test_sharded_optimizer.py) - Section 6; implement `get_sharded_optimizer` in `tests/adapters.py`, then run `pytest tests/test_sharded_optimizer.py`. The two-process CPU Gloo tests compare AdamW final parameters after ten updates, including tied weights. They do not check disjoint-data gradient reduction or memory savings; add those checks in trainlab.

**Stop when:** You derive each stage's persistent-state ledger, pass both named practice suites and explain what their tests leave unproved.

<details>
<summary>Self-test</summary>

1. What memory floor remains as the rank count grows under ZeRO-2?
   - The full replicated parameter storage. Gradients and optimizer state shrink ideally, but parameters do not.
2. Does ZeRO-3 split a layer's matrix multiplication across the ranks?
   - No. It splits stored model state; each rank gathers the required weights and computes on its own data. Tensor parallelism splits the layer computation.
3. Why does the assignment need broadcasts after the optimizer step?
   - Each owner changes only its parameters. Broadcasting those updates restores a consistent full parameter replica for the next forward on every rank.
4. Do equal-payload reduce-scatter and all-gather always cost exactly the same as an all-reduce?
   - Their total ring send volume equals a bandwidth-optimal ring all-reduce. Different dtypes, launch counts, topology, implementation and overlap can change elapsed time.

</details>

#### U3. Parameter all-gather before compute and gradient reduce-scatter after backward

**About 6 h** · **Target:** Explain + Implement

Topics: Parameter all-gather before computation; Gradient reduce-scatter after backward

Correct ownership is not enough if weights are absent when autograd uses them. This unit makes the parameter and gradient lifecycle explicit before adding scheduling optimizations.

**You can now**

- Implement gather-before-use, release-after-use and reduced-gradient ownership in a tiny fully sharded trainer.
- Match gradients and parameter updates to an unsharded oracle with the same global batch and loss normalization.
- Explain when backward needs a full weight and when the optimizer needs only a shard.

**Study**

1. [The current FSDP lifecycle](https://docs.pytorch.org/tutorials/intermediate/FSDP_tutorial.html#how-fsdp2-works) (PyTorch FSDP2 Tutorial (fully_shard)) - How FSDP2 works and How to use FSDP2 / Model Initialization (page read 2026-10-14).
2. [Build fully sharded training](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/cs336_assignment2_systems.pdf) (CS336 Assignment 2 (Spring 2026) - Sections 6, 7 and 8.3) - Section 7, problem `fsdp`, printed pp. 38 to 39; Section 8.3, equations (34) to (44), pp. 42 to 43. Depth: Implement and test the CPU Gloo path first. Leave GPU profiling in `fsdp_accounting` to the peak-memory unit. The handout's FP32 master-weight prescription is its implementation contract, not a theorem forbidding other training formats.

**Focus**

- For a sharded linear layer, gather the full compute weight before forward. If released afterward, gather it again before backward computes input gradients. Reducing weight gradients does not replace that second gather.
- Reduce-scatter combines contributions from all data ranks and gives each owner its reduced gradient slice. For equal local mean losses, divide the summed gradient by the data-parallel degree exactly once.
- Resharding parameters normally means freeing the gathered representation and re-registering the stored shard. It is not another scatter collective.
- The assignment shards Linear and Embedding weights and keeps norms replicated. Replicated parameters still need gradient synchronization. Build the optimizer against the parameters it must update.

**Reproduce:** From a blank file, implement a tiny gather-compute-release-backward-reduce-scatter-update cycle on CPU Gloo. Use your DT-3 single-process oracle with identical initial weights, the concatenated global batch and equal local batch sizes. Record each rank's shard ranges and collective order; compare reconstructed gradients and several updates within explicit floating-point tolerances.

**Traps**

- Freeing a tensor still needed by autograd. The hook schedule and saved-tensor lifetime must agree; swapping storage blindly can corrupt backward.
- Reducing only sharded weights while silently leaving replicated normalization gradients local.
- Comparing each rank's local mean loss with the global mean and calling their difference an FSDP error. Reduce the metric separately.

**Practice**

- [CS336 Assignment 2: `fsdp`](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/tests/test_fsdp.py) - Section 7; implement `get_fsdp`, `fsdp_on_after_backward` and `fsdp_gather_full_params` in `tests/adapters.py`; run `pytest tests/test_fsdp.py`. Two CPU Gloo ranks. `test_fsdp_correctness` compares three SGD updates with full-batch training in FP32 and FP16 compute. `test_fsdp_gradient_sync` checks gradient shape and master dtype, and cross-rank agreement of replicated gradients. The section mini-project adds shard ownership and lifecycle evidence.

**Stop when:** Your educational FSDP passes the public correctness and gradient tests, and its rank logs explain where each full weight and reduced shard lives.

<details>
<summary>Self-test</summary>

1. Why can a linear layer need its full weight during backward?
   - Its input gradient multiplies the output gradient by the weight. Releasing the forward compute weight therefore requires restoring it before that multiplication.
2. Is parameter resharding a network transfer?
   - Not ordinarily. Each rank retains its persistent shard and frees the transient gathered copy. Gradient reduce-scatter is the network operation that produces the owned reduced gradient.
3. When does a mean of local mean gradients equal the global mean gradient?
   - When local losses use the same normalization and each rank has the same number of contributing examples or tokens. Unequal counts require weighting by those counts.

</details>

#### U4. Reshard-after-forward policies and forward and backward prefetch

**About 4 h** · **Target:** Explain + Measure

Topics: Reshard-after-forward policies; Forward and backward prefetch ordering

A policy can save one gather yet retain a large full tensor. Prefetch can hide a gather yet create an OOM. Both choices need a lifecycle timeline, not a universal fastest setting.

**You can now**

- Predict full-parameter lifetimes and gather counts for reshard-after-forward policies.
- Compare prefetch depth using a live-state timeline and identify communication that remains exposed.
- Explain the memory cost of keeping weights through backward or gathering future groups early.

**Study**

1. [Reshard policy in PyTorch 2.14](https://docs.pytorch.org/docs/2.14/distributed.fsdp.fully_shard.html#torch.distributed.fsdp.fully_shard) (PyTorch FSDP2 Tutorial (fully_shard)) - `fully_shard`, parameter `reshard_after_forward`; `FSDPModule.set_modules_to_forward_prefetch`, `set_modules_to_backward_prefetch` and `unshard`. Depth: Read the Boolean and default policies first. Use the integer policy only in the simulator unless you have a suitable mesh; only a non-trivial divisor of the mesh shard dim size gives distinct behavior: 1 collapses to `False` and the shard size itself to `True`, both without an error.
2. [Implicit and explicit prefetch](https://docs.pytorch.org/tutorials/intermediate/FSDP_tutorial.html#forward-backward-with-prefetching) (PyTorch FSDP2 Tutorial (fully_shard)) - Forward/Backward with Prefetching, including both timeline diagrams and explicit-prefetch code (page read 2026-10-14).

**Focus**

- With `reshard_after_forward=True`, discard the full weight after forward and gather it for backward. With `reshard_after_forward=False`, retain it until backward and avoid that gather.
- In 2.14, `reshard_after_forward=None` resolves to true for non-root modules and false for the forward root. Set the policy explicitly when comparing schedules; do not assume a root-only run has two gathers.
- Backward's default prefetch follows reverse post-forward order. An explicit list overrides it; deeper prefetch increases simultaneous gathered state and is only useful if earlier launch reduces waiting.
- Use a deterministic event simulator first to measure live bytes and dependency stalls. With two or more GPUs, compare synchronized fixed-workload traces, allocated peaks and step times for these policies. CPU Gloo timings do not establish GPU overlap or interconnect performance.

**Reproduce:** Draw a three-group forward/backward event trace twice: first release every group's full weights after forward, then retain them until backward. Assume each group needs its weight in both passes, no accumulation and no prefetch. Count two gathers per group in the first trace and one in the second; compute the simultaneous full-weight bytes. Add one-group-ahead prefetch and show the extra live window before testing the schedules in trainlab.

**Traps**

- Treating asynchronous launch as proof of overlap. Only a timeline with concurrent work and satisfied dependencies establishes overlap.
- Copying a fixed prefetch list onto rank-divergent execution. Every group must still execute compatible collectives in the same order.
- Using `unshard()` on the root and assuming it recursively gathers every nested FSDP group. It is not recursive.

**Practice**

- The section mini-project covers this: trainlab event timelines for reshard and prefetch policies, with oracle checks and conditional multi-GPU traces.

**Stop when:** Your policy comparison gives gather counts, peak live bytes and dependency stalls for identical work, and explains one case where more prefetch is worse.

<details>
<summary>Self-test</summary>

1. What does retaining full parameters after forward buy?
   - It removes the backward parameter all-gather for those parameters, at the cost of a longer full-parameter lifetime. Gradient reduction is still required.
2. Why can deeper prefetch make a previously fitting model fail?
   - Several gathered groups and their staging buffers can coexist with current compute and saved activations. The persistent shards have not changed, but the live peak has.
3. Why might the default keep the root's full parameters?
   - The root is needed near the forward/backward boundary. Freeing and immediately gathering its parameters again can add traffic with little lifetime reduction. This is a heuristic, not proof that every root should be retained.

</details>

#### U5. Flat parameters, wrapping granularity and hybrid sharding

**About 5 h** · **Target:** Explain

Topics: Flat parameters, handles and original-parameter views; Module wrapping and sharding granularity; Hybrid sharded data parallel vocabulary

Wrapping determines what must fit in memory at once and which ranks communicate. Understanding both FSDP generations lets you read legacy code without importing its configuration into FSDP2.

**You can now**

- Explain FSDP1 flat storage, original-parameter views and communication grouping without treating them as FSDP2's representation.
- Choose wrapping boundaries from the largest live group, launch count and shared-parameter ownership.
- Map hybrid sharding's sharding and replication groups and explain both gradient reductions.

**Study**

1. [Legacy flat parameters and hybrid sharding](https://arxiv.org/abs/2304.11277v2) (PyTorch FSDP: Experiences on Scaling Fully Sharded Data Parallel) - arXiv:2304.11277v2, Sections 3.2.1 Full Sharding, 3.2.2 Hybrid Sharding and 3.2.3 Autograd; Figures 3 and 4. Depth: Read the representation and ownership design, not the paper's cluster benchmarks. This paper describes FSDP1.
2. [From flat parameters to DTensor](https://github.com/pytorch/torchtitan/blob/0b75362025f037a2d1a23240ba21786928a9052e/docs/fsdp.md) (TorchTitan - FSDP2 Notes) - Why FSDP2? and FSDP1 <> FSDP2 API Differences, including the mesh and state-dict tables. Depth: Use the tables for migration vocabulary only. The statements that forward prefetch is 'not yet implemented' or 'under discussion' are stale; use the 2.14 prefetch APIs from the preceding unit.
3. [Current grouping and mesh contract](https://docs.pytorch.org/docs/2.14/distributed.fsdp.fully_shard.html#communication-grouping-and-scheduling) (PyTorch FSDP2 Tutorial (fully_shard)) - Communication Grouping and Scheduling; `fully_shard` parameter `mesh` and the FSDP1 comparison.

**Focus**

- FSDP1 flattens and concatenates a group's parameters, pads, then chunks the flat storage. Original parameter tensors are views into that storage. A handle manages this group's lifecycle; it is not a separate model-state category.
- FSDP2 shards each parameter as a DTensor, normally along dim 0, but still groups communication by `fully_shard` calls. Per-parameter representation does not mean one collective per parameter.
- Apply `fully_shard` bottom-up to blocks, then the root. The root owns remaining parameters such as embeddings and the output head. Root-only grouping materializes the whole model's managed weights together.
- For a 2D hybrid mesh, the first dimension replicates and the second shards. Reduce-scatter within each shard group, then all-reduce matching gradient shards across replicas. Model-state memory scales with shard degree, not total world size.

**Reproduce:** Draw a deterministic four-rank mesh with rows `[0, 1]` and `[2, 3]`. Identify sharding groups `[0, 1]` and `[2, 3]`, replication groups `[0, 2]` and `[1, 3]`, and each parameter shard's two copies. Sum gradient contributions within rows, then across columns; show that each owner obtains the same averaged shard as a global single-process oracle. Contrast root-only, per-block and per-linear communication groups on a two-block model.

**Traps**

- Dividing persistent memory by all four ranks in a two-by-two hybrid mesh. Each shard is replicated twice.
- Wrapping tied aliases as unrelated groups. A shared parameter needs one compatible ownership and gather lifecycle for every use.
- Assuming smaller groups always run faster. They lower individual gather sizes but increase collective launches and can expose latency.

**Practice**

- The section mini-project covers this: the trainlab wrap-group inventory and four-rank hybrid ownership and reduction simulation.

**Stop when:** You can reconstruct the hybrid reduction by hand, identify every group's parameters, and explain why your chosen granularity differs from both root-only and per-parameter grouping.

<details>
<summary>Self-test</summary>

1. Does FSDP2 use a `FlatParameter` for each group?
   - No. It stores per-parameter DTensor shards and groups them for communication. `FlatParameter` is the legacy FSDP1 representation.
2. Why does hybrid sharding need a second gradient reduction?
   - The reduce-scatter only combines data contributions inside one shard group. Matching shards in other replicated groups saw other data and must also be combined.
3. What happens to parameters not assigned by the inner sharding calls?
   - A later root call groups the remaining parameters. Omitting that call can leave intended-to-be-sharded parameters unmanaged.

</details>

#### U6. FSDP2 on DTensor with mixed parameter and reduction dtypes

**About 4 h** · **Target:** Implement

Topics: Mixed parameter and reduction dtypes; FSDP2 DTensor-native configuration

Build on Precision formats, autocast and gradient scaling. The new issue is where casts occur across ranks: compute weights, reduction payloads and optimizer shards can have three different roles.

**You can now**

- Apply FSDP2 bottom-up on a CPU device mesh and inspect local DTensor shards before and after a step.
- Choose parameter, reduction and output dtypes separately and account for their storage and communication.
- Construct the optimizer after sharding and verify global gradient clipping against an unsharded oracle.

**Study**

1. [FSDP2 precision and DTensor optimizer](https://docs.pytorch.org/tutorials/intermediate/FSDP_tutorial.html#enabling-mixed-precision) (PyTorch FSDP2 Tutorial (fully_shard)) - Enabling Mixed Precision; Gradient Clipping and Optimizer with DTensor; revisit Model Initialization's DTensor inspection (page read 2026-10-14).
2. [MixedPrecisionPolicy in PyTorch 2.14](https://docs.pytorch.org/docs/2.14/distributed.fsdp.fully_shard.html#torch.distributed.fsdp.MixedPrecisionPolicy) (PyTorch FSDP2 Tutorial (fully_shard)) - `MixedPrecisionPolicy`: `param_dtype`, `reduce_dtype`, `output_dtype` and `cast_forward_inputs`; `fully_shard` user contract.

**Focus**

- Start with FP32 and a 1D CPU mesh on Gloo. Shard blocks before the root, use `model(x)` so hooks run, then construct AdamW from the sharded parameters. Inspect global shapes and `to_local()` separately.
- For original FP32 parameters, `MixedPrecisionPolicy(param_dtype=torch.bfloat16, reduce_dtype=torch.float32)` gathers BF16 weights, computes in BF16 and reduces gradients in FP32. The optimizer updates original FP32 shards; it does not need another FP32 master copy.
- If `reduce_dtype=None` and `param_dtype` is set, the reduction payload uses the compute dtype, and the stored gradient shard is cast back to the original parameter dtype. `output_dtype` changes floating-point outputs at the module boundary, not the optimizer's state dtype.
- Use `torch.nn.utils.clip_grad_norm_` on the DTensor parameters, not on each rank's local shards separately. A global norm must combine the disjoint gradient contributions without counting replicated copies twice.

**Reproduce:** Adapt the tutorial to two CPU Gloo processes with `init_device_mesh('cpu', (2,))` and a tiny two-linear-layer model. First match several FP32 AdamW updates and a clipped gradient norm to the single-process global-batch oracle. Then use BF16 parameter compute and FP32 reduction; inspect the full compute weight during a forward pre-hook, the FP32 shard and gradient after backward, and FP32 Adam moments after the update. Compare mixed precision to an oracle with matching casts, not to a bitwise FP32 target.

**Traps**

- Inspecting the weight in a post-forward hook registered after FSDP's hook and expecting the compute dtype. It may already have been resharded to the original dtype; inspect inside forward or after FSDP's pre-hook.
- Calling `model.forward(x)` directly. It bypasses the pre-forward gather and reads whatever is registered: after resharding it fails with a mixed Tensor and DTensor error, and while full weights are still retained it can silently run, so a passing call proves nothing.
- Clipping each local shard to the same maximum norm. That implements different scaling from clipping the reconstructed global gradient.

**Practice**

- The section mini-project covers this: the trainlab FSDP2 CPU configuration, dtype inspections and same-policy update and global-clipping oracles.

**Stop when:** Your dtype and placement logs agree with the selected policy, and FP32 updates and global clipping match the oracle before you introduce low-precision compute.

<details>
<summary>Self-test</summary>

1. Which dtype determines parameter all-gather bytes?
   - The unsharded parameter dtype, selected by `param_dtype` when set. The stored optimizer shard can remain FP32.
2. Does FP32 reduction recover precision lost during BF16 compute?
   - No. It limits additional rounding during reduction, but cannot recover information already lost in low-precision computations.
3. Why initialize the optimizer after `fully_shard`?
   - It must reference the DTensor parameters that the sharded optimizer step will update, with the correct ownership and shape semantics.
4. What should happen when a correct mixed-precision run is compared with FP32?
   - Small numerical differences can occur. Validate against a same-policy oracle with explicit tolerances, and report any FP32 comparison as a precision comparison rather than bitwise equivalence.

</details>

#### U7. Activation checkpointing under FSDP and CPU and storage offload

**About 5 h** · **Target:** Measure

Topics: Activation checkpointing interaction with FSDP; CPU and storage offload trade-offs; Selective offload and activation-aware wrapping study

Build on Activation checkpointing and recomputation. At distributed depth, recompute can cross gather boundaries, while offload moves pressure onto another memory tier rather than removing it.

**You can now**

- Measure recomputation and collective events when activation checkpointing is composed with FSDP groups.
- Account for host memory, transfer traffic and CPU optimizer work under model-state offload.
- Compare selective checkpointing, wrap boundaries and selective offload under a stated memory budget.

**Study**

1. [Activation-checkpoint placement and selective policies](https://github.com/hkproj/torchfeather/blob/c416ab1ad0fd3567a0a6c8ad0da570c8fd6e55aa/torchfeather/distributed/activation_checkpoint.py) (TorchFeather - FSDP and Activation Checkpointing) - `_apply_full_ac`, `_apply_layer_sac`, `_apply_op_sac` and `apply_ac`; then `parallelize_deepseekv3` in `torchfeather/model/parallelize.py` at the same commit. Depth: Read the policy functions and checkpoint-before-FSDP call order only. Do not adopt the private compiler controls or the full framework. Open the second file at https://github.com/hkproj/torchfeather/blob/c416ab1ad0fd3567a0a6c8ad0da570c8fd6e55aa/torchfeather/model/parallelize.py.
2. [CPU offload in PyTorch 2.14](https://docs.pytorch.org/docs/2.14/distributed.fsdp.fully_shard.html#torch.distributed.fsdp.CPUOffloadPolicy) (PyTorch FSDP2 Tutorial (fully_shard)) - `CPUOffloadPolicy`, including `pin_memory`; `fully_shard` parameter `offload_policy`.
3. [CPU versus storage offload vocabulary](https://www.deepspeed.ai/tutorials/zero/#offloading-to-cpu-and-nvme-with-zero-infinity) (DeepSpeed ZeRO Tutorial) - Offloading to CPU and NVMe with ZeRO-Infinity (page read 2026-10-14). Depth: Read the tier and state-category distinction. Do not run the large-model scripts or port DeepSpeed's configuration keys into FSDP2.

**Focus**

- Checkpoint placement relative to the FSDP group decides whether recomputation re-enters gather hooks. Count actual all-gathers rather than assuming every checkpoint adds one or that recomputation is communication-free.
- TorchFeather's checkpoint policies use `preserve_rng_state=False`. For a stochastic block, use preserved RNG state in your baseline and test the recomputed gradient; the source's choice is not safe for arbitrary dropout.
- FSDP2 CPU offload keeps parameter and gradient shards and optimizer state on CPU. Copy shards to the training device before gathering, copy reduced gradients back, and run the optimizer on CPU. The gathered weights of the active group and its activations must still fit on the training device.
- NVMe adds a storage-to-host tier and staging buffers; `CPUOffloadPolicy` does not implement it. Use a deterministic tiered-transfer model on CPU first. With two or more GPUs, measure checkpoint and per-group CPU-offload variants with host traffic, memory peaks and fixed-workload step times.

**Reproduce:** On CPU Gloo, compare a tiny block-sharded model with and without non-reentrant activation checkpointing. Keep inputs, weights and precision fixed; check gradients against the no-checkpoint oracle and count block re-execution and gather events. In a separate deterministic transfer simulation, move only selected groups' stored shards to a host or storage tier; record resident bytes and bytes crossing each link, including staging. Predict which tier becomes the bottleneck without claiming CPU timings measure GPU transfers.

**Traps**

- Assuming offload removes the full-layer working set. It can lower total device peak while leaving that gathered-layer requirement unchanged.
- Treating pinned host memory as free. It is a constrained resource shared with input loading and checkpoint staging.
- Selecting every group for offload without comparing recomputation or narrower wrap boundaries. Added transfers and CPU optimizer work can dominate.

**Practice**

- The section mini-project covers this: trainlab recompute-equivalence and event-count checks plus a selective-offload tier ledger, with conditional device measurements.

**Stop when:** Your comparison preserves gradient correctness, explains the observed recompute and gather counts, and includes both memory saved and traffic added for each offloaded tier.

<details>
<summary>Self-test</summary>

1. Does activation checkpointing reduce persistent Adam moments?
   - No. It changes saved activations and recomputation. Sharding or offload changes optimizer-state ownership or placement.
2. Can CPU offload lower peak GPU memory even though the largest full layer is unchanged?
   - Yes. Removing resident model-state shards leaves more room for that layer and activations. It does not make an individually oversized compute group fit by itself.
3. Why can a checkpointed stochastic block give the wrong gradient?
   - If recomputation uses different random draws, it differentiates a different realization. Preserve the needed RNG state or implement a tested equivalent RNG contract.
4. What extra costs appear with storage offload compared with CPU offload?
   - Storage reads and writes, storage latency, host staging capacity and another transfer dependency. Their cost depends on the actual access and reuse schedule.

</details>

#### U8. Meta-device and deferred parameter initialization

**About 3 h** · **Target:** Implement

Topics: Meta-device and deferred parameter initialization

A model may fail before its first step if initialization materializes the whole model on each device. Shard-first initialization avoids that peak but makes initialization and buffer completeness part of the correctness contract.

**You can now**

- Construct a meta model, shard it before materializing storage and initialize or load every parameter and buffer.
- Distinguish metadata-only construction from deferred replay of initialization operations.
- Verify shard initialization against an explicitly defined full-model oracle rather than relying on seeds alone.

**Study**

1. [Shard first, materialize second](https://docs.pytorch.org/tutorials/intermediate/FSDP_tutorial.html#fsdp1-to-fsdp2-migration-guide) (PyTorch FSDP2 Tutorial (fully_shard)) - FSDP1-to-FSDP2 migration guide, New `fully_shard()` usage and Migration Steps (page read 2026-10-14).
2. [Meta initialization and buffers](https://github.com/LambdaLabsML/distributed-training-guide/blob/aed748914472cca80d8cfe139ab43ec63103913a/04-fully-sharded-data-parallel/README.md) (Distributed Training Guide - Chapter 4 FSDP) - Delayed initialization - the meta device; Sharding the meta model; Initializing the model, including the rotary-buffer example. Depth: Read these initialization subsections only, not the Run Command. Meta avoids tensor data storage, not all Python memory. The overview's claim that each layer gathers optimizer state is incorrect; only weights are needed for layer compute.
3. [Deferred initialization is a different mechanism](https://arxiv.org/abs/2304.11277v2) (PyTorch FSDP: Experiences on Scaling Fully Sharded Data Parallel) - arXiv:2304.11277v2, Section 3.1, Model Initialization. Depth: Use this to distinguish recorded initialization replay from the current meta flow, not as an FSDP2 API recipe.

**Focus**

- A meta tensor has shape and dtype but no data to copy. `to_empty` allocates uninitialized destination storage; it does not restore values or replay random initialization.
- Create the module under `torch.device('meta')`, apply bottom-up FSDP2 sharding with the intended mesh, then materialize only the stored shards. Initialize them or load a compatible checkpoint before any compute or optimizer step.
- Initialize buffers too. A module-specific `reset_parameters()` may not rebuild position or rotary buffers. Enumerate parameters and buffers and give each an initialization or load path.
- An identical seed alone is not an initialization specification across shard layouts. Check reconstructed values against a full tensor, or define a global-index-based initializer that is independent of rank count.

**Reproduce:** In two CPU Gloo processes, construct `torch.nn.Linear(8, 4)` under `torch.device('meta')`, shard it on `init_device_mesh('cpu', (2,))`, and check that its parameters remain meta. Call `to_empty(device='cpu')`; under `torch.no_grad()`, fill the stored weight with 0.25 and bias with zero. For `torch.ones(2, 8)`, obtain a two-by-four output filled with 2 on each rank, matching an ordinary CPU linear layer initialized identically. Add a buffer and show that it also requires explicit initialization.

**Traps**

- Calling `.to('cpu')` on a meta tensor and expecting its values. There are no values to copy.
- Materializing the full model before applying sharding, defeating the initialization memory saving.
- Assuming the base `nn.Module` implements recursive `reset_parameters()`. Initialization is model-specific.

**Practice**

- The section mini-project covers this: the trainlab meta-to-shard initialization test, including a buffer inventory and reconstruction oracle.

**Stop when:** The tiny meta-initialized model matches the ordinary model, no meta or uninitialized tensor reaches compute, and each buffer has a checked initialization path.

<details>
<summary>Self-test</summary>

1. Does meta construction preserve the random parameter values that construction would have generated?
   - No. It produces metadata without tensor data. Deferred initialization that records and replays operations is a separate mechanism.
2. What must be true before the first forward after `to_empty`?
   - Every parameter and buffer the forward reads must have valid initialized or loaded values on the intended device and with a consistent distributed layout.
3. Why is constant initialization useful in the tiny check?
   - Its full-tensor meaning is independent of RNG and partitioning, so it isolates meta materialization and shard reconstruction from random-initializer behavior. It is not a recommended training initializer.

</details>

#### U9. Peak memory from live windows and FSDP communication volume

**About 5 h** · **Target:** Derive + Measure

Topics: Peak memory from live parameter and activation windows; Communication volume and exposed collectives

Persistent ZeRO-3 state can fit while a gather window does not. Build on Memory, arithmetic intensity and reconciling estimates; here the estimate must include the distributed lifecycle and critical path.

**You can now**

- Derive peak live memory from stored shards, gathered groups, activations, gradients and staging lifetimes.
- Derive per-rank collective send volume with separate parameter and reduction dtypes.
- Validate a byte or lifetime prediction and distinguish total communication from exposed communication.

**Study**

1. [FSDP memory and communication accounting](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/cs336_assignment2_systems.pdf) (CS336 Assignment 2 (Spring 2026) - Sections 6, 7 and 8.3) - Section 7, `fsdp_accounting`, p. 39; Section 8.3, `fsdp_calcs`, pp. 42 to 44; use the notation and bandwidth assumptions at the start of Section 8. Depth: Keep the handout's buffer-excluded estimate separate from your real peak, which includes gather staging. Solve the analytical questions on CPU; with two or more GPUs, profile a fitting model instead of the prescribed xl model.
2. [Stage-3 communication volume](https://arxiv.org/abs/1910.02054v3) (ZeRO: Memory Optimizations Toward Training Trillion Parameter Models) - arXiv:1910.02054v3, Section 7, Communication Analysis of ZeRO-DP.
3. [A communication roofline, not an overlap guarantee](https://jax-ml.github.io/scaling-book/training/#fully-sharded-data-parallelism-fsdp) (How to Scale Your Model - Chapter 5 Training) - Fully-Sharded Data Parallelism (FSDP), its communication/compute equations; Takeaways from LLM Training on TPUs, forward/backward communication table. Depth: Use the equations and table, not the claim that all ZeRO stages have the same communication cost. For release-after-forward FSDP with weights needed in backward, there are two gathers plus a reduce-scatter; its own table shows more total traffic than DDP. TPU bandwidth and batch thresholds are not GPU measurements.

**Focus**

- Compute peak as a maximum over time: $`M_{\text{peak}}=\max_t[S(t)+U(t)+A(t)+G(t)+T(t)]`$. The categories are disjoint: stored model state excluding gradients, full gathered weights, saved activations, live gradients and other temporaries. Add allocator reserve separately.
- Let $`N`$ be managed parameter elements, $`R`$ the shard degree, and $`b_p`$, $`b_g`$ parameter-gather and gradient-reduction bytes per element. With even shards, a ring, two gathers, one reduce-scatter and no accumulation or extra recompute gathers, each rank sends $`\frac{R-1}{R}N(2b_p+b_g)`$ bytes per step; it receives the same volume.
- At equal payload dtypes, that is 1.5 times DDP's ring all-reduce send volume. If BF16 weights are gathered and FP32 gradients reduced, recompute the ratio; do not apply the equal-payload slogan.
- Full local gradients and collective staging can coexist with gathered weights. Prefetch changes simultaneous live groups; it need not change total bytes. Exposed communication is determined by dependency slack, launch timing and contention, not by total volume alone.

**Reproduce:** For a simulated single FSDP group with $`N=1{,}024`$, $`R=4`$, BF16 gathers and FP32 gradient reduction, derive 6,144 sent bytes per rank for two gathers plus one reduce-scatter. Compare with 6,144 sent bytes for DDP reducing the same FP32 gradients: the byte ratio is one, not 1.5. Exclude padding, metadata and accumulation. Then sum disjoint live categories at each event in your trainlab trace and predict its peak before inspecting the measured or simulated ledger.

**Traps**

- Adding maxima from different phases as if they occurred together, or counting an alias as another allocation.
- Reading the Scaling Book's 'same communication cost' sentence as equal total step traffic. Similar ideal communication-to-compute bounds do not mean equal byte counts.
- Calling the sum of sent and received bytes the send volume, or treating a raw payload/time ratio as NCCL bus bandwidth without the collective correction.

**Practice**

- [CS336 Assignment 2: `fsdp_calcs` and `fsdp_accounting`](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/cs336_assignment2_systems.pdf) - `fsdp_calcs` (a) to (c), Section 8.3; `fsdp_accounting` (a) and the conditional profiling in (b), Section 7. These written questions have no public accounting tests. Separate the handout's ideal estimate from a trainlab live-state ledger, and label CPU simulation versus conditional multi-GPU profiling evidence.

**Stop when:** You solve the named accounting questions, reproduce the dtype-aware byte count and explain the difference between persistent state, simulated live peak and any measured allocator peak.

<details>
<summary>Self-test</summary>

1. When does the familiar 1.5 traffic ratio apply?
   - For equal parameter and gradient payload dtypes, even shards and bandwidth-optimal ring accounting: two gathers plus one reduce-scatter versus DDP's two-pass all-reduce. Retention, padding or extra gathers change the comparison.
2. What is the model-state memory benefit of narrower wrap groups?
   - They reduce the size of individual materialized groups, potentially reducing the peak. Prefetch, activations and staging still determine which groups coexist.
3. Can equal total bytes give different step times?
   - Yes. Launch count, payload size, link contention and where the collectives lie on the critical path can differ. Only measured traces establish overlap on a device topology.

</details>

#### U10. Full, local and sharded state dictionaries and optimizer state

**About 4 h** · **Target:** Implement

Topics: Full, local and sharded state dictionaries; Optimizer-state save and load under sharding

A shard's tensor values are not a checkpoint contract without its global identity and placement. The optimizer's moments and parameter mapping must survive the same transition as the weights.

**You can now**

- Distinguish full logical state, layout-bound local state and metadata-bearing sharded state dictionaries.
- Save and load model and optimizer state with named-parameter contracts instead of assuming rank-local optimizer IDs are portable.
- Prove same-world-size checkpoint restore by comparing the next optimizer update, not just loaded weights.

**Study**

1. [FSDP2 state dictionaries](https://docs.pytorch.org/tutorials/intermediate/FSDP_tutorial.html#state-dicts-with-dtensor-apis) (PyTorch FSDP2 Tutorial (fully_shard)) - State Dicts with DTensor APIs and State Dict with DCP APIs (page read 2026-10-14). Depth: Use the sharded or DCP path for routine restore. For manual consolidation, every rank gathers, but only the designated writer should call `torch.save`; the example's final save line is outside its rank-zero branch.
2. [Current model and optimizer state contract](https://docs.pytorch.org/docs/2.14/distributed.checkpoint.html#torch.distributed.checkpoint.state_dict.get_state_dict) (PyTorch FSDP2 Tutorial (fully_shard)) - `get_state_dict`, `set_state_dict` and `StateDictOptions`; `state_dict_saver.save` and `state_dict_loader.load`. Depth: Use these current APIs, not the earlier FSDP1 `load_sharded_optimizer_state_dict` example on the same page.
3. [Legacy format vocabulary](https://docs.pytorch.org/docs/2.14/fsdp.html#torch.distributed.fsdp.FullStateDictConfig) (PyTorch FSDP2 Tutorial (fully_shard)) - FSDP1 `StateDictType`, `FullStateDictConfig`, `LocalStateDictConfig`, `ShardedStateDictConfig` and `FullyShardedDataParallel.optim_state_dict`. Depth: Read for full/local/sharded terminology only. FSDP1 is deprecated; do not implement its state-dict context manager in a new FSDP2 trainer.

**Focus**

- A full dictionary contains full logical tensors under model names. Legacy local dictionaries preserve rank-local flat layout and are tied to that partition. A sharded dictionary carries global tensor identities and layouts so a loader can locate each slice.
- FSDP2's `model.state_dict()` retains parameter names and DTensor layouts without gathering all parameters. `to_local()` alone discards the information needed to identify a shard globally.
- Use `get_state_dict` and `set_state_dict` for the model/optimizer pair. Their optimizer mapping uses canonical fully qualified parameter names rather than assuming numeric optimizer IDs mean the same thing after rebuilding.
- Checkpoint after an optimizer step with initialized moments and cleared gradients. DCP requires allocated destination state and consistent keys across participating ranks. Weights alone are insufficient for training resume; the complete RNG, sampler and scheduler contract belongs to DT-9.

**Reproduce:** On two CPU Gloo ranks, train a tiny FSDP2 model with AdamW long enough to create moments. Use `get_state_dict` to save model and optimizer with DCP, rebuild the same sharded model and optimizer, load into the destination dictionaries, then apply `set_state_dict`. Compare reconstructed weights, moment tensors, step counters and the next fixed-batch update with an uninterrupted branch. Inspect local tensor sizes and placements so successful restore cannot hide full-state replication.

**Traps**

- Saving only rank zero's local shard and calling it a full model.
- Treating `state_dict()` as an immutable snapshot while continuing to mutate the underlying tensors. Save synchronously here, or explicitly clone the reference branch.
- Checking loaded weights but ignoring optimizer moments and counters. The first resumed update can diverge even if the forward initially matches.

**Practice**

- The section mini-project covers this: trainlab same-world-size model and optimizer checkpoint round-trip, next-update equivalence and rank-local ownership inspection.

**Stop when:** The restored next update matches the uninterrupted branch within stated tolerances, optimizer state is mapped correctly, and each rank still owns only its intended shards.

<details>
<summary>Self-test</summary>

1. What is missing from a saved `to_local()` tensor?
   - Its global shape, shard placement, mesh and global parameter identity unless stored separately. Raw values alone do not identify where the shard belongs.
2. Does an FSDP2 sharded `model.state_dict()` require full-parameter all-gathers?
   - No. It exposes DTensor state in its sharded representation. Requesting full tensors or a full-state option does require consolidation work.
3. Why compare the next update after restore?
   - It exercises parameter mapping, optimizer moments, counters and hyperparameters together. A weight-only comparison cannot detect missing or misassigned optimizer history.

</details>

#### U11. Checkpoint consolidation and resharding to a new world size

**About 3 h** · **Target:** Implement

Topics: Checkpoint consolidation and world-size resharding

A checkpoint should describe the logical model, not depend on yesterday's rank numbers. World-size changes test whether that contract covers both weights and optimizer history.

**You can now**

- Consolidate a small sharded checkpoint into full logical tensors while accounting for the host-memory requirement.
- Restore parameter and optimizer shards onto a different world size and prove the next global-batch update.
- Explain which metadata makes repartitioning possible and which semantic changes resharding cannot repair.

**Study**

1. [DCP load-time resharding and format conversion](https://docs.pytorch.org/tutorials/recipes/distributed_checkpoint_recipe.html#loading) (PyTorch FSDP2 Tutorial (fully_shard)) - How DCP works; Loading, including different world size; Formats (page read 2026-10-14). Depth: Use the matching `AppState` structure for save and load. The later unwrapped example uses a top-level `model` key while the preceding save used `app.model`; preserve the saved nesting instead of copying that example unchanged.
2. [Destination layouts and state-dict options](https://docs.pytorch.org/docs/2.14/distributed.checkpoint.html#torch.distributed.checkpoint.state_dict_loader.load) (PyTorch FSDP2 Tutorial (fully_shard)) - `state_dict_loader.load`; `state_dict.StateDictOptions`, especially `full_state_dict`, `cpu_offload` and `broadcast_from_rank0`.

**Focus**

- Load into an allocated destination model whose DTensor mesh and placements describe the new partition. The loader reads old chunks intersecting each new local slice; old rank IDs are not new owners.
- Consolidation is representation conversion, not training resume. Full tensors can require enough host memory for the whole model and optimizer state plus temporary copies. Avoid it for routine resharding when DCP can load directly.
- World-size changes must preserve names, global shapes, precision policy, optimizer mapping and the fixed global batch used by your oracle. Resharding does not fix a changed vocabulary or an incompatible optimizer.
- A changed rank count can alter reduction rounding, data partitioning and RNG streams. Check numerical update equivalence with explicit tolerances; bitwise-identical continuation requires a stronger execution contract.

**Reproduce:** Save a tiny FSDP2 AdamW checkpoint using four CPU Gloo ranks, then rebuild and restore on two ranks. Choose parameter row counts and a global batch divisible by both degrees. Preserve saved dictionary nesting, reconstruct weights and moments, and compare the next update to the same global-batch oracle. Separately use `dcp_to_torch_save` on the tiny checkpoint and confirm that the consolidated model and optimizer entries represent the same logical state; do not use consolidation as the reshard mechanism.

**Traps**

- Renaming shard files by new rank and ignoring tensor offsets. New shards can span several old shards.
- Loading weights successfully but dropping or reassigning optimizer moments after repartitioning.
- Keeping the local batch fixed when world size changes, then attributing the resulting different global update to checkpoint corruption.

**Practice**

- The section mini-project covers this: trainlab four-to-two-rank model and optimizer restore, full-format comparison and fixed-global-batch next-update oracle.

**Stop when:** Both the direct changed-world-size restore and tiny consolidated export reconstruct the same logical state, and the restored optimizer's next update matches the oracle.

<details>
<summary>Self-test</summary>

1. What lets a loader restore four saved shards into two destination shards?
   - Global tensor names and shapes, old chunk offsets and sizes, and the destination layout. It computes the required intersections rather than assuming rank-to-rank file identity.
2. Must all old shards be loaded in full on every new rank?
   - No. A layout-aware loader can read the parts needed for each destination shard. Full consolidation is a separate, memory-heavier operation.
3. Does loading onto fewer ranks guarantee bitwise-identical future training?
   - No. Collective reduction order and data/RNG assignment may change. First prove the same logical state and a fixed-batch update within stated tolerances.

</details>

#### U12. Sharded equivalence tests and auto-wrap, OOM and replication failures

**About 4 h** · **Target:** Implement

Topics: Single-process equivalence and rank-local state tests; Auto-wrap mistakes, OOMs and unexpected replication

A decreasing loss can hide wrong averaging, incomplete synchronization or replicated state. The section checkpoint needs evidence that the update is right and the intended state is actually sharded.

**You can now**

- Build independent loss, gradient, clipping, update and shard-ownership checks for a tiny sharded run.
- Diagnose a correctness failure from rank-local tensor metadata and collective order.
- Distinguish gather-window OOMs, retained full weights, unexpected replication and allocator reserve.

**Study**

1. [What the FSDP public checks actually prove](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/tests/test_fsdp.py) (CS336 Assignment 2 (Spring 2026) - Sections 6, 7 and 8.3) - `test_fsdp_correctness`, `_test_fsdp_correctness`, `test_fsdp_gradient_sync` and `_test_fsdp_gradient_sync`. Depth: Read the oracle construction, loss normalization and assertions. Do not reread the whole assignment or copy the test implementation into your trainer.
2. [Debug the current ownership contract](https://docs.pytorch.org/docs/2.14/distributed.fsdp.fully_shard.html#communication-grouping-and-scheduling) (PyTorch FSDP2 Tutorial (fully_shard)) - User contract, Communication Grouping and Scheduling; `fully_shard` parameters `ignored_params` and `reshard_after_forward`.

**Focus**

- Use the DT-3 update oracle with fixed initial state, data, precision, normalization and optimizer settings. Compare reconstructed gradients and updates, global clipping and reduced metrics separately, within justified tolerances.
- Inspect unique parameter identities, names, global shapes, local shard sizes, dtypes and optimizer references. Check moments after their first allocation. Loss agreement alone cannot prove memory ownership.
- The assignment's tests check SGD updates and replicated gradient agreement, not gathered-weight lifetime, Adam resume or sharding memory. Keep those trainlab checks independent of public-test success.
- For legacy FSDP1, inspect the auto-wrap result; for FSDP2, inspect explicit bottom-up groups and root coverage. Diagnose a budget failure from the live-state ledger first. With two or more GPUs, compare allocator peaks and gather timelines before assigning an OOM to fragmentation.

**Reproduce:** Use a tiny CPU Gloo sharded model and the full-batch oracle. Introduce one fault at a time: omit the data-degree division in educational gradient reduction, leave one intended parameter replicated, or clip only local shards. Each fault must fail the appropriate numerical or ownership assertion. In the live-state simulator, change from block groups to a root-only group or retain all full weights; choose a budget that the original schedule fits and show which event exceeds it, without provoking a real machine OOM.

**Traps**

- Comparing to a reference with a different batch, precision policy or optimizer initialization and treating any discrepancy as a sharding defect.
- Summing DTensor global element counts on every rank as if they were local allocations. Inspect local storage and include replicated categories explicitly.
- Ignoring unmanaged parameters. In FSDP2, `ignored_params` are neither sharded nor gradient-reduced by FSDP; a replicated trainable parameter still needs a synchronization contract.

**Practice**

- The section mini-project covers this: trainlab negative tests for gradient scaling, clipping and replication, plus a gather-peak budget failure with rank-local evidence.

**Stop when:** The correct run passes the numerical and ownership oracles, each injected fault fails a targeted check, and you diagnose one correctness and one memory failure from saved evidence.

<details>
<summary>Self-test</summary>

1. Why is matching the loss curve not enough?
   - Small update errors can still decrease loss, and fully replicated training can be numerically correct while failing the sharding objective. Check gradients, updates and rank-local ownership separately.
2. Which evidence distinguishes retained full weights from optimizer-state growth?
   - Inspect full-parameter lifetimes across forward and backward, and optimizer tensor allocations after the first step. Their categories and allocation times differ even if both raise peak memory.
3. Can a root-only group be numerically correct but a bad memory configuration?
   - Yes. It can gather the entire managed model at once. Correct updates do not imply that its peak working set fits the chosen budget.
4. What makes a tied-parameter ownership check meaningful?
   - It checks the shared tensor's identity and all use sites, ensures one compatible sharding lifecycle and optimizer update, and verifies that aliases reconstruct the same logical values.

</details>

### Mini-project: Fully sharded training with resharding evidence

**About 14 to 18 hours.** Shard the data-parallel trainer in `parallel/` from full replication to full sharding with checkpoints that survive changed layouts. This turns the memory ledger into per-rank ownership and gives the capstone its recovery story.

1. Ledger replicated state by dtype against measured tensors after the first optimizer update; pass the TensorTonic ZeRO accounting cases and extend the CS336 sharded-optimizer tests with disjoint-data reduction and memory-saving checks.
2. Build a tiny gather-compute-release and reduce-scatter trainer that matches the oracle over several updates; pass the CS336 FSDP tests and log where each full weight and reduced shard lives on every rank.
3. Compare reshard-after-forward policies and prefetch depths on identical work with event timelines, keeping oracle equivalence; report live bytes and exposed stalls, with device traces only on two or more GPUs.
4. Inventory wrap groups against the largest live group and simulate four-rank hybrid ownership with both gradient reductions; construct on the meta device and configure FSDP2 on a CPU mesh, checking shard and buffer materialization, dtypes, same-policy updates and global clipping against the oracle.
5. Derive peak live memory and dtype-aware send volume, separating the ideal estimate from the live-state ledger and CPU simulation from device profiles; keep recompute gradient-equivalent with event counts and ledger a selective offload tier.
6. Round-trip model and optimizer checkpoints at one world size with next-update equivalence and ownership inspection; restore onto a smaller world size, compare against the full format, and prove the next fixed-global-batch update.
7. Seed gradient-scaling, clipping and replication faults plus one gather-peak budget break; show each fails its targeted check and diagnose one correctness and one memory failure from rank evidence.

**Deliverables**

- Sharded trainer with ZeRO ledgers, lifecycle logs and wrap-group inventory.
- Same-size and changed-layout checkpoint restores with next-update proofs.
- Peak and volume derivations, offload ledger and the negative-test evidence.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [TensorTonic: Account for ZeRO Memory by Stage](https://www.tensortonic.com/problems/cs336-l08-zero-memory-accounting). Pass the public stage cases; follow its pooled-byte ceilings and state the rule.
- external-tests: [CS336 Assignment 2 sharded optimizer tests](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/tests/test_sharded_optimizer.py). Pass the two-process CPU comparison including tied weights.
- external-tests: [CS336 Assignment 2 FSDP tests](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/tests/test_fsdp.py). Pass correctness and gradient-sync on two CPU ranks before trainlab extensions.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Shard accounting | Ledgers reconcile with measured tensors and the accounting cases pass with the allocation rule stated. | Disjoint-data reduction and memory savings are checked beyond the public tests. |
| Lifecycle correctness | Gather and reduce-scatter runs match the oracle and logs place every weight and shard. | Reshard and prefetch timelines explain one case where deeper prefetch is worse. |
| Checkpoint recovery | Same-size and changed-layout restores prove next-update equivalence with ownership intact. | The full-format comparison and the direct restore agree, and metadata limits are stated. |
| Negative evidence | Each seeded fault fails its targeted check with rank evidence kept. | The gather-peak break is budgeted in advance and the diagnosis names the live window. |

Feeds into: Sharded steps, ownership ledgers and reshardable checkpoints feed model parallelism, planning, recovery and the capstone contribution.

### Resource route

- **Primary - Assignment:** [CS336 Assignment 2 (Spring 2026) - Sections 6, 7 and 8.3](https://github.com/stanford-cs336/assignment2-systems) - Complete `optimizer_state_sharding` and `optimizer_state_sharding_accounting` (Section 6), `fsdp` and `fsdp_accounting` (Section 7) and `fsdp_calcs` (Section 8.3) with your own code. `tests/test_sharded_optimizer.py` and `tests/test_fsdp.py` run on CPU with Gloo. For each variant, predict per-rank state, peak live tensors and collective bytes before testing tiny cases.
- **Required - Theory:** [Ultra-Scale Playbook - Zero Redundancy Optimizer (ZeRO)](https://nanotron-ultrascale-playbook.static.hf.space/index.html#zero_redundancy_optimizer_(zero)) - Read the ZeRO-1, ZeRO-2 and ZeRO-3 progression. Reproduce the memory diagrams for one transformer layer and annotate every all-gather, reduce-scatter and reshard boundary. Its "two times faster" line holds for bytes moved at equal payload in the bandwidth-bound regime.
- **Required - Reference:** [PyTorch FSDP2 Tutorial (fully_shard)](https://docs.pytorch.org/tutorials/intermediate/FSDP_tutorial.html) - Work through `fully_shard` per block then root, `MixedPrecisionPolicy`, `reshard_after_forward`, explicit prefetch and DTensor state dicts, and check each against the 2.14 API reference. FSDP1 (`FullyShardedDataParallel`) is the legacy API; record the PyTorch version beside every result.
- **Required - Paper:** [ZeRO: Memory Optimizations Toward Training Trillion Parameter Models](https://arxiv.org/abs/1910.02054) - Read the memory analysis (model states with $`K = 12`$ optimizer bytes per parameter) and the stage-by-stage savings and communication analysis. Reproduce its per-device memory for one model and degree.
- **Support - Paper:** [PyTorch FSDP: Experiences on Scaling Fully Sharded Data Parallel](https://arxiv.org/abs/2304.11277) - Read the design sections on wrapping granularity, prefetching, rate limiting and hybrid sharding. Its flat parameter describes FSDP1; FSDP2 shards each parameter as a DTensor.
- **Support - Reference:** [TorchTitan - FSDP2 Notes](https://github.com/pytorch/torchtitan) - Read `docs/fsdp.md` for the FSDP1 to FSDP2 changes, dim-0 DTensor shards, `reshard_after_forward` values and hybrid sharding on a 2D mesh, then `torchtitan/distributed/fsdp.py`. Pin the commit you read.
- **Support - Reference:** [DeepSpeed ZeRO Tutorial](https://www.deepspeed.ai/tutorials/zero/) - Use the stage definitions and the `zero_optimization` configuration as the original vocabulary for the three stages and offload. Running it needs CUDA GPUs.
- **Support - Lab:** [Distributed Training Guide - Chapter 4 FSDP](https://github.com/LambdaLabsML/distributed-training-guide) - Read model initialization on the meta device, sharding, reshard policy, CPU offload and sharded checkpoint code in `04-fully-sharded-data-parallel` as a practitioner second view. Its scripts need CUDA.
- **Support - Implementation:** [TorchFeather - FSDP and Activation Checkpointing](https://github.com/hkproj/torchfeather) - Watch the video segment at 10:49:41 on meshes, DDP and FSDP, then read `distributed/activation_checkpoint.py` and the FSDP calls in `model/parallelize.py`. Trace how parallel dimensions select the mesh, FSDP policy, precision and reshard behavior; do not adopt the full framework.
- **Support - Theory:** [How to Scale Your Model - Chapter 5 Training](https://jax-ml.github.io/scaling-book/training) - Work the FSDP, model-state sharding, rematerialization and offload calculations in Chapter 5. Translate each JAX-oriented layout into equivalent parameter, activation and collective ownership without implementing JAX.
- **Support - Practice:** [TensorTonic - Account for ZeRO Memory by Stage](https://www.tensortonic.com/study-plans/language-modeling-from-scratch) - Solve Account for ZeRO Memory by Stage before the CS336 accounting problems.

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

### Study units

#### U1. Column- and row-parallel linear layers and communication cancellation

**About 5 h** · **Target:** Derive + Implement

Topics: Column-parallel linear layers and output ownership; Row-parallel linear layers and partial-result reduction; Colwise-to-rowwise communication cancellation

TP changes which rank computes each part of one layer. A plausible forward output can hide a missing input-gradient reduction or a repeated bias.

**You can now**

- Derive local outputs, weight gradients and input-gradient reductions for column- and row-parallel linear layers.
- Implement a paired sharded MLP and reconstruct its forward and backward results against an unsharded oracle.
- Explain why keeping the intermediate features sharded removes communication between the two projections.

**Study**

1. [Two matrix partitions and their composition](https://nanotron-ultrascale-playbook.static.hf.space/index.html#tensor_parallelism) (Ultra-Scale Playbook - Tensor, Sequence and Context Parallelism) - Tensor Parallelism; Tensor parallelism in a transformer block, opening feedforward example. Depth: Stop before the attention discussion. Do not gather column outputs when the next row-parallel layer consumes the same feature shards.
2. [Megatron-LM: forward and backward communication](https://arxiv.org/abs/1909.08053v4) (Megatron-LM: Training Multi-Billion Parameter Language Models Using Model Parallelism) - arXiv:1909.08053v4, Section 3, equations 1 to 3, Figure 3a and Code 1. Depth: Read through the MLP derivation. Leave self-attention and vocabulary sharding to the next units.
3. [Weight storage and conjugate autograd operators](https://github.com/huggingface/picotron/blob/59714b1bf25541dbeb6f5a721ed15f6d0768e786/picotron/tensor_parallel/tensor_parallel.py) (Picotron - Tensor and Context Parallelism) - `ColumnParallelLinear` and `RowParallelLinear`, including initialization and `forward`. Depth: Also open https://github.com/huggingface/picotron/blob/59714b1bf25541dbeb6f5a721ed15f6d0768e786/picotron/tensor_parallel/tp_communications.py and read `CopyToModelParallelRegion`, `ReduceFromModelParallelRegion` and `GatherFromModelParallelRegion`. Defer the asynchronous operator.

**Focus**

- Use the paper's convention $`Y=XW`$, then translate to PyTorch's stored $`W`$ of shape $`[D_{\text{out}},D_{\text{in}}]`$. Column parallelism shards stored rows; row parallelism shards stored columns.
- Column outputs own distinct features. Their input gradients are partial contributions that must be summed. Row outputs are full-shaped partial sums; their forward reduction must happen before adding a replicated bias.
- An elementwise activation preserves feature ownership. Pair matching column output shards with row input shards instead of gathering and splitting again.
- Megatron's identity-backward reduction assumes replicated outputs represent one logical loss, not separate independent losses on every TP rank. Reconstruct gradients under that contract.

**Reproduce:** Closed-book, derive and simulate a bias-free column-GELU-row MLP on CPU with two shards, $`X`$ shaped $`[2,3,4]`$, first stored weight $`[8,4]`$ and second $`[4,8]`$. Generate all tensors once with seed 0 in `torch.float64`, slice the same weights, and use squared-output mean loss. Match output, input gradient and both reconstructed weight gradients with `torch.testing.assert_close`. Then add one shared output bias after summation.

**Traps**

- Applying GELU to each row-parallel partial sum before reduction. Nonlinearity does not commute with summation.
- Adding a full output bias on every rank before a sum. The result contains one bias per rank.
- Comparing bitwise equality after changing GEMM partitioning. Floating-point reduction order changes; use a justified tolerance.

**Practice**

- [TensorTonic: Reconstruct a Column-Parallel MLP Layer](https://www.tensortonic.com/problems/cs336-l07-column-parallel-mlp) - Implement `column_parallel_mlp(x, weight_shards, bias_shards)`; public cases: Two single-column shards, Uneven biased shards and One shard. This free problem reconstructs a linear projection only, despite its title. Its weights use input-by-output storage. It checks rank-ordered outputs, not collectives or gradients. The section mini-project covers the paired TP MLP, explicit communication and gradient oracle in `trainlab`.

**Stop when:** The three public cases and your paired MLP output and gradient checks pass, and you draw both passes with no intermediate gather and exactly one output bias.

<details>
<summary>Self-test</summary>

1. Why does the first projection need a backward sum even though its forward pass is local?
   - Each feature shard contributes to the same input. The full input gradient is the sum of those contributions.
2. For stored weights shaped $`[8,4]`$ and $`[4,8]`$ on two ranks, what shapes stay local?
   - The first weight is $`[4,4]`$, the intermediate is $`[2,3,4]`$, and the second weight is $`[4,4]`$. Each second-projection partial output is $`[2,3,4]`$ and must be summed.
3. Does column-to-row pairing eliminate all communication?
   - No. It eliminates the intermediate gather. With replicated block boundaries, the row output still needs a forward sum and the column input gradient a backward sum.

</details>

#### U2. Vocabulary-parallel embeddings, output projection and cross-entropy

**About 5 h** · **Target:** Derive + Implement

Topics: Vocabulary-parallel embedding and output projection; Parallel cross-entropy and log-sum-exp reduction; Loss parallel APIs in current PyTorch

Vocabulary logits can be much larger than the residual stream. Reducing per-token statistics avoids gathering them, but only if target ownership and the loss denominator remain correct.

**You can now**

- Derive stable vocabulary-parallel cross-entropy and its local logit gradients without gathering full logits.
- Implement vocabulary-range embedding ownership and preserve tied embedding/output weights.
- Compare a CPU sharded loss with ordinary cross-entropy, then map it to PyTorch 2.14 loss parallelism.

**Study**

1. [Sharded input and output embeddings](https://arxiv.org/abs/1909.08053v4) (Megatron-LM: Training Multi-Billion Parameter Language Models Using Model Parallelism) - arXiv:1909.08053v4, Section 3, paragraphs beginning 'The transformer language model has an output embedding' through the fused cross-entropy discussion.
2. [Vocabulary ranges and masked lookup](https://github.com/huggingface/picotron/blob/59714b1bf25541dbeb6f5a721ed15f6d0768e786/picotron/tensor_parallel/tensor_parallel.py) (Picotron - Tensor and Context Parallelism) - `VocabParallelEmbedding`, especially `_vocab_range_from_global_vocab_size` and `forward`; `apply_tensor_parallel` final-projection replacement. Depth: Use default dense lookup without padding or renormalization. Picotron gathers the final logits; use the loss-parallel route below to avoid that gather.
3. [Loss-parallel layouts and current contract](https://docs.pytorch.org/tutorials/intermediate/TP_tutorial.html#apply-loss-parallel) (PyTorch Tensor Parallel Tutorial) - Apply Loss Parallel, Figure 2 and final-projection plan (page read 2026-10-14). Depth: Open https://docs.pytorch.org/docs/2.14/distributed.tensor.parallel.html#torch.distributed.tensor.parallel.loss_parallel for the 2.14 contract. Keep the first implementation on a one-dimensional CPU mesh with class-index targets and no label smoothing.

**Focus**

- Build on Stable softmax, cross-entropy and loss reductions. For a token, reduce local maxima to $`m=\max_j z_j`$, then sum local exponentials into $`s=\sum_j\exp(z_j-m)`$. Reduce the target logit from its unique owner; loss is $`m+\log s-z_y`$.
- Each vocabulary shard computes its part of $`\operatorname{softmax}(z)-\operatorname{onehot}(y)`$. Only the target owner subtracts one. Apply the same valid-token denominator as the unsharded loss.
- Embedding ranks own disjoint vocabulary ranges. Nonowners contribute zero; summation reconstructs each lookup. Tied embeddings and output projections must share the same trainable shard, accumulating both gradient contributions once.
- `loss_parallel()` requires class-sharded DTensor logits and backward inside the context. PyTorch 2.14 supports mean reduction only on a one-dimensional mesh; multi-dimensional token sharding needs sums or unreduced losses and an explicit global denominator.

**Reproduce:** Without notes, split `torch.tensor([[1000., 1001., -1000., 999.], [2., -1., 0., 3.]], dtype=torch.float64)` into two class shards and use targets `[1, 3]`. Compute the max, exponential-sum and target-owner reductions, then the mean loss and analytic logit gradients. Match ordinary `torch.nn.functional.cross_entropy`. Repeat with class-sharded DTensors on two CPU processes using Gloo and `loss_parallel()`, comparing loss and reconstructed gradients.

**Traps**

- Normalizing each vocabulary shard separately. That produces multiple distributions rather than one distribution over the full vocabulary.
- Treating every nonlocal token as an invalid global token. Validate the global ID first, then mask nonownership before lookup.
- Padding the vocabulary and leaving padded logits in the softmax. Those classes change the denominator unless explicitly excluded.

**Practice**

- The section mini-project covers this: vocabulary-range lookup, stable sharded loss, tied-weight accumulation and loss/gradient comparisons in `trainlab`.

**Stop when:** Your sharded loss and logit gradients match the ordinary oracle, lookup ownership passes at both ends of each range, and a tied-weight test accumulates both uses into one shard.

<details>
<summary>Self-test</summary>

1. Why must the maximum be global before summing exponentials?
   - All shard sums must use the same exponential scale. Independent local maxima require additional rescaling before their sums can be combined.
2. Does averaging local vocabulary losses recover cross-entropy?
   - No. Vocabulary shards partition classes for the same tokens. Combine their normalization statistics first; average only over the declared valid tokens.
3. What gradient reaches a tied vocabulary shard?
   - The sum of its input-embedding and output-projection contributions. Two independently updated copies are not weight tying.

</details>

#### U3. Tensor-parallel attention heads, GQA divisibility and MLP partitioning

**About 5 h** · **Target:** Derive + Implement

Topics: Tensor-parallel attention head partitioning; Grouped-query attention divisibility constraints; Tensor-parallel MLP partitioning

Attention heads and MLP features supply independent work, but shared KV heads and paired gates constrain which shards may be kept local.

**You can now**

- Partition complete attention heads and matching output-projection columns, preserving forward and backward semantics.
- Derive legal GQA head layouts and distinguish KV sharding from KV replication.
- Implement matching gate/up feature shards for a tensor-parallel SwiGLU block.

**Study**

1. [Transformer TP and the GQA qualification](https://nanotron-ultrascale-playbook.static.hf.space/index.html#tensor_parallelism_in_a_transformer_block) (Ultra-Scale Playbook - Tensor, Sequence and Context Parallelism) - Tensor parallelism in a transformer block: feedforward and multi-head attention diagrams, MQA/GQA paragraph and KV-head synchronization example. Depth: Stop before the throughput plots. The stated head limit describes whole-head partitioning, not every possible tensor-parallel algorithm.
2. [Whole-head attention partitioning](https://arxiv.org/abs/1909.08053v4) (Megatron-LM: Training Multi-Billion Parameter Language Models Using Model Parallelism) - arXiv:1909.08053v4, Section 3, Figure 3b and Figure 4.
3. [Tensor-parallel attention oracle](https://github.com/hkproj/torchfeather/blob/c416ab1ad0fd3567a0a6c8ad0da570c8fd6e55aa/minimal_examples/tp_attention.py) (TorchFeather - TP and Ring Attention Minimal Examples) - `split_heads`, `merge_heads`, `local_attention` and `main`: projection placements through output and all gradient comparisons.
4. [Aligned SwiGLU shards](https://github.com/hkproj/torchfeather/blob/c416ab1ad0fd3567a0a6c8ad0da570c8fd6e55aa/minimal_examples/tp_swiglu.py) (TorchFeather - TP and Ring Attention Minimal Examples) - `swiglu`; `main` from gate/up/down distribution through reconstruction and gradient assertions.

**Focus**

- Build on Multi-head attention: split, merge and gradients, MQA and GQA: sharing keys and values, and The modern decoder block. The new task is ownership and communication, not another attention implementation.
- For whole-head sharding without KV replication, TP degree $`p`$ divides both $`H_q`$ and $`H_{\mathrm{kv}}`$, and $`H_{\mathrm{kv}}`$ divides $`H_q`$. Preserve each query's KV mapping when slicing projection rows and output-projection columns.
- When $`p>H_{\mathrm{kv}}`$, a different plan may replicate KV heads among ranks. Their shared projection gradients must then be summed across the replica subgroup; the simple equally sharded plan is not legal.
- SwiGLU gate and up projections use identical intermediate-feature boundaries. Their product remains sharded; the down projection produces partial residual-width outputs.

**Reproduce:** Run the two named CPU examples below, then redraw their local projection and head shapes without notes. Extend a deterministic simulation to $`H_q=8`$, $`H_{\mathrm{kv}}=2`$, head width 4 and TP degree 2: each rank owns four contiguous query heads and their one KV head. With identical seed-0 `torch.float64` inputs and zero dropout, concatenated local attention must match the full GQA oracle. Reject degree 4 under the no-KV-replication policy.

**Traps**

- Splitting channels through the middle of a head and using the original softmax as if each shard had a complete query/key dot product.
- Dividing query heads but forgetting KV-head constraints. Shapes may be divisible while query-to-KV ownership is wrong.
- Pairing differently ordered gate and up shards. Their elementwise product then changes the MLP.

**Practice**

- [TorchFeather: tensor-parallel SwiGLU and attention minimal examples](https://github.com/hkproj/torchfeather/blob/c416ab1ad0fd3567a0a6c8ad0da570c8fd6e55aa/minimal_examples/tp_attention.py) - Run `torchrun --nproc-per-node 2 --master-port 29652 minimal_examples/tp_attention.py` and `torchrun --nproc-per-node 2 --master-port 29651 minimal_examples/tp_swiglu.py` from the repository root at commit c416ab1. Both use Gloo on CPU and compare outputs, loss, input gradients, norm gradients and projection gradients with ordinary tensors. They cover MHA, not GQA. The section mini-project covers the GQA ownership variation in `trainlab`.

**Stop when:** Both named examples pass, your GQA reconstruction passes, and you identify illegal head plans before launching collectives.

<details>
<summary>Self-test</summary>

1. Can eight query heads and two KV heads use four equally KV-sharded ranks?
   - Not with complete KV heads and no replication. Two KV heads cannot give every rank one shard. A replicated-KV implementation is a separate plan with shared-gradient reduction.
2. Why is an output-projection reduction still needed after local head attention?
   - Each head subset contributes through a different set of output-projection input columns to the same residual-width output. Those partial contributions must be summed.
3. Which intermediate dimension must both SwiGLU branches shard identically?
   - The expanded feedforward feature dimension. Each gate value must multiply the up value for the same feature before the row-parallel down projection.

</details>

#### U4. Sequence-parallel normalization and residual layouts

**About 3 h** · **Target:** Derive + Implement

Topics: Sequence parallel normalization and residual layouts

Plain TP leaves the residual stream replicated. Sequence parallelism reduces its saved activation footprint while preserving full feature vectors for each local token.

**You can now**

- Derive the all-gather/reduce-scatter boundaries between sequence-parallel norms and tensor-parallel projections in both passes.
- Keep residual additions on matching token shards and sum replicated norm-parameter gradients.
- Explain which saved activations shrink and which full-shaped temporary tensors remain.

**Study**

1. [Sequence-parallel regions and norm gradients](https://nanotron-ultrascale-playbook.static.hf.space/index.html#sequence_parallelism) (Ultra-Scale Playbook - Tensor, Sequence and Context Parallelism) - Sequence parallelism: region-transition diagram, TP versus TP+SP layout table and closing LayerNorm-gradient note. Depth: Skip benchmark plots. Do not adopt the claim that every maximum activation is divided by TP degree: the all-gathered input and full-shaped partial output remain live temporaries.
2. [Sequence-parallel forward and backward derivation](https://arxiv.org/abs/2205.05198v1) (Reducing Activation Recomputation in Large Transformer Models) - arXiv:2205.05198v1, Section 4.2.2, Figures 5 and 6, equations 3 and 4, including the saved-input/re-gather paragraph. Depth: Stop before Pipeline Parallelism. The equal ring-byte argument is not a guarantee of equal runtime or zero overhead; extra saved-input re-gathers must be counted when enabled.
3. [Sequence-parallel normalization and residual contract](https://docs.pytorch.org/tutorials/intermediate/TP_tutorial.html#apply-sequence-parallel-to-layernorm-rmsnorm-layers) (PyTorch Tensor Parallel Tutorial) - Apply Sequence Parallel to LayerNorm/RMSNorm layers: block forward and adjusted parallelization plan (page read 2026-10-14). Depth: Check `SequenceParallel` at https://docs.pytorch.org/docs/2.14/distributed.tensor.parallel.html#torch.distributed.tensor.parallel.SequenceParallel for sequence-axis defaults and the custom-initialization warning.

**Focus**

- For $`[B,S,D]`$ activations, each SP rank keeps $`[B,S/p,D]`$. Normalization reduces over features within each token, so it needs no cross-token statistics.
- All-gather the normalized token shards before the column projection. Reduce-scatter the row projection's partial output along sequence before residual addition. Both operands then own the same tokens.
- In backward, the forward all-gather has a reduce-scatter adjoint under this logical tensor contract; the forward reduce-scatter has an all-gather adjoint. Replicated norm weights receive different token contributions that must be summed.
- The paper's activation formula counts saved tensors under its storage/recomputation choices. A transient replicated input does not disappear merely because the block's boundary layout is sharded.

**Reproduce:** Return to TorchFeather's `tp_swiglu.py` from the previous unit. Without notes, trace `x`, `normalized`, `replicated`, `hidden`, `down_partial`, `down_sequence` and the residual output through both passes. With its two-rank settings, the residual shards are $`[2,2,8]`$, the gathered input and partial down output are $`[2,4,8]`$, and the intermediate features are logically $`[2,4,16]`$, held as $`[2,4,8]`$ local shards. Confirm these layouts and the norm-gradient oracle on CPU.

**Traps**

- Normalizing across the sharded sequence axis instead of the complete feature axis. That changes the model and may leak future tokens.
- Adding two equal-shaped local tensors that own different token ranges. Shape equality is not layout equality.
- Leaving custom-initialized norm gains different across ranks. `SequenceParallel` assumes the usual unit initialization; synchronize custom gains explicitly.

**Practice**

- The section mini-project covers this: sequence-sharded norms and residuals, replicated gain-gradient sums, layout assertions and saved-versus-temporary tensor accounting in `trainlab`.

**Stop when:** Your forward/backward layout table matches the CPU example, the residual and norm gradients match the unsharded oracle, and the table includes gathered and partial temporaries.

<details>
<summary>Self-test</summary>

1. Why can SP normalization be local while feature-sharded normalization may not be?
   - An SP shard contains every feature for its tokens. A feature shard lacks part of each token's normalization statistics.
2. Why do norm weights need gradient reduction under SP but not necessarily under replicated plain TP?
   - SP ranks process different tokens, so each gradient is a contribution to the shared weight. Plain TP replicated norms can compute identical complete gradients under identical input and loss semantics.
3. Does replacing an all-reduce with an all-gather plus reduce-scatter guarantee equal step time?
   - No. Ideal ring payloads can match, but launch count, ordering, buffers, kernel shapes and extra re-gathers can differ.

</details>

#### U5. DTensor placements and redistribution as collectives

**About 4 h** · **Target:** Explain + Implement

Topics: DTensor placements: Replicate, Shard and Partial; Redistribution as collective communication

DTensor automates communication from layout metadata. Incorrect metadata can silently turn a valid local tensor into the wrong logical tensor.

**You can now**

- Explain Replicate, Shard and Partial as ownership states of one logical tensor.
- Implement redistribution checks and predict which transitions require communication.
- Distinguish a logical layout transition from the backend algorithm used to execute it.

**Study**

1. [Sharded contractions and unreduced results](https://jax-ml.github.io/scaling-book/sharding#computation-with-sharded-arrays) (How to Scale Your Model - Chapters 3 and 5) - Chapter 3, Computation With Sharded Arrays: Cases 1, 2 and 3. Depth: Stop before Case 4. Translate unreduced outputs to `Partial()` rather than copying JAX syntax into PyTorch.
2. [PyTorch 2.14 placement and redistribution reference](https://docs.pytorch.org/docs/2.14/distributed.tensor.html#torch.distributed.tensor.DTensor.redistribute) (PyTorch Tensor Parallel Tutorial) - DTensor Placement Types: `Shard`, `Replicate`, `Partial`; `DTensor.redistribute` transition list; `DTensor.from_local`, `to_local`, `full_tensor` and `distribute_tensor`. Depth: Stay on one DeviceMesh. Skip private placement types and tensor factory functions.
3. [A real Partial result before reduction](https://github.com/hkproj/torchfeather/blob/c416ab1ad0fd3567a0a6c8ad0da570c8fd6e55aa/minimal_examples/tp_swiglu.py) (TorchFeather - TP and Ring Attention Minimal Examples) - `main`: `down_partial` placement assertion, `partial_to_sequence` redistribution and `describe` output.

**Focus**

- `Replicate()` means identical complete values; `Shard(dim)` means distinct indexed pieces; `Partial()` means full-shaped contributions awaiting a sum by default. Equal local shapes do not imply equal ownership.
- On one mesh axis, shard-to-replicate is an all-gather, partial-to-replicate an all-reduce, and partial-to-shard a reduce-scatter. Replicate-to-shard needs local slicing only.
- Changing the sharded tensor dimension requires a logical all-to-all. In PyTorch 2.14.1 CPU DTensor execution can fall back to all-gather plus chunking; do not assign the ideal all-to-all byte count to that fallback.
- `distribute_tensor` starts from a global leaf tensor. `DTensor.from_local` declares ownership of existing local values and is differentiable; with `run_check=False`, correctness is your responsibility. `full_tensor()` can communicate.

**Reproduce:** On four CPU processes with Gloo, distribute `torch.arange(16, dtype=torch.float64).reshape(4, 4)` with `Shard(0)`. Reconstruct it, redistribute to `Shard(1)`, and reconstruct again. Separately wrap full-shaped local matrices filled with rank plus one using `DTensor.from_local` and `Partial()`: reduction must give 10 in every entry. Obtain both replicated and row-sharded reduced layouts and verify the same logical value. Predict each collective before executing it.

**Traps**

- Wrapping different complete values as replicas without synchronizing them. Metadata does not make unequal data identical.
- Gathering Partial values as if they were distinct output features. Partial values must be reduced, not concatenated.
- Calling `full_tensor()` only on rank zero. Every participating rank must execute the required collective in the same order.

**Practice**

- The section mini-project covers this: a CPU placement-transition suite with logical reconstruction, rank-owned metadata and backend-aware collective records in `trainlab`.

**Stop when:** Every reconstruction agrees, your transition table predicts local versus communicating operations, and your logs distinguish logical all-to-all from the CPU fallback.

<details>
<summary>Self-test</summary>

1. A local row-parallel matmul has the full output shape. Is it replicated?
   - Not before reduction. Each rank used only part of the contracting dimension, so its result is a Partial contribution.
2. Which placement change can avoid communication in forward?
   - Replicate-to-Shard: every rank already has all values and can keep its own slice. Backward still follows the chosen gradient-layout contract.
3. Does `to_local()` return the global tensor?
   - Only when the placement is already replicated. For Shard it returns a shard; for Partial it returns an unreduced contribution.

</details>

#### U6. DeviceMesh, tensor-parallel groups and input, output and gradient layouts

**About 4 h** · **Target:** Implement

Topics: DeviceMesh and tensor-parallel process groups; Input, output and gradient layout contracts

A mesh names who participates; placements name what they own. Both must agree with the module's local computation and backward contract.

**You can now**

- Construct named CPU device meshes and verify the membership and order of tensor-parallel subgroups.
- Implement explicit module input/output layout contracts and inspect parameter and gradient placements.
- Diagnose wrong input ownership, group membership and local-versus-global shape assumptions before they become numerical mismatches.

**Study**

1. [Mesh construction and SPMD agreement](https://docs.pytorch.org/docs/2.14/distributed.html#torch.distributed.device_mesh.init_device_mesh) (PyTorch Tensor Parallel Tutorial) - `init_device_mesh`: SPMD notes and parameters; `DeviceMesh` methods `get_coordinate`, `get_local_rank` and `get_group`. Depth: Use CPU meshes and Gloo first. Read only these mesh entries, not the full communication reference. For named-axis slicing, use the DP/TP mesh example in the input-ownership guide below.
2. [Parallel styles are boundary contracts](https://docs.pytorch.org/docs/2.14/distributed.tensor.parallel.html#torch.distributed.tensor.parallel.parallelize_module) (PyTorch Tensor Parallel Tutorial) - `parallelize_module`, `ColwiseParallel`, `RowwiseParallel` and `PrepareModuleInput`: input/output layouts, `use_local_output` and source-rank semantics.
3. [Same inputs within a tensor group](https://github.com/LambdaLabsML/distributed-training-guide/blob/aed748914472cca80d8cfe139ab43ec63103913a/06-tensor-parallel/README.md#ensure-all-gpus-on-a-node-get-the-same-input) (Distributed Training Guide - Chapter 6 Tensor Parallelism) - Ensure all GPUs on a node get the same input: named DP/TP mesh, four-rank table and sampler arguments; Computing throughput with our new world size. Depth: Read the ownership example, not the GPU training script. TP is not inherently node-local: the example chooses that placement.

**Focus**

- A named mesh axis identifies ordered process groups, not a tensor dimension. `Shard(1)` refers to a tensor axis; `mesh['tp']` chooses a communicator axis.
- `parallelize_module` accepts a one-dimensional mesh. Slice a composed mesh before passing the TP submesh. All ranks must agree on mesh construction and module plans.
- The default column style interprets ordinary inputs as replicated and returns local feature shards. The default row style interprets ordinary inputs as feature shards and returns replicated outputs. Use `use_local_output=False` while inspecting logical shapes and placements.
- TP partners process the same logical examples. Their distinct weight shards contribute to one model result; do not count them as separate data replicas or multiply token throughput by TP degree.

**Reproduce:** Launch four CPU processes with Gloo and construct `init_device_mesh('cpu', (2, 2), mesh_dim_names=('dp', 'tp'))`. Verify TP groups `[0, 1]` and `[2, 3]`, and DP groups `[0, 2]` and `[1, 3]`. On each TP submesh, parallelize an MLP containing `Linear(4, 8)`, GELU and `Linear(8, 4)` with column then row styles and DTensor outputs. Transfer identical seed-0 weights and inputs to an ordinary MLP; compare output, input gradient and reconstructed parameter gradients for squared-output mean loss.

**Traps**

- Using global rank as the sampler's data-replica rank. TP partners then consume different inputs while trying to compute one layer.
- Treating a plain local output shape as the global shape in a head reshape. Keep DTensor metadata or adjust the local reshape explicitly.
- Passing a two-dimensional mesh directly to `parallelize_module`. The TP API requires its one-dimensional submesh.

**Practice**

- The section mini-project covers this: named mesh/group manifests, TP module-boundary assertions and forward/backward oracle comparisons in `trainlab`.

**Stop when:** Every rank's group manifest matches the hand table, the MLP oracle passes, and each boundary records logical shape, local shape, placement and expected gradient ownership.

<details>
<summary>Self-test</summary>

1. On the reproduced mesh, which ranks share rank 2's TP computation?
   - Ranks 2 and 3. Rank 0 is rank 2's DP partner for the same TP-coordinate weight shard, not its TP partner.
2. Can a local tensor prove that its claimed replica is identical elsewhere?
   - No. Validate or synchronize the data across its group. Declaring a replicated layout is a contract, not evidence.
3. Why keep input-gradient placement in the boundary table?
   - The caller must receive the derivative of the intended logical input. A correct forward shard can still return a partial or duplicated gradient incorrectly.

</details>

#### U7. Tensor-parallel memory and communication volume by layer

**About 4 h** · **Target:** Derive

Topics: Activation and parameter memory accounting; Tensor-parallel communication volume by layer

A parameter shard can shrink while activation or communication buffers still dominate the peak. A byte ledger makes the degree choice testable.

**You can now**

- Derive per-rank parameter, gradient, optimizer and activation bytes from actual TP/SP ownership and dtypes.
- Count forward and backward collective payloads by layer, separating logical payload from per-rank ring traffic.
- Explain memory-model residuals caused by saved inputs, re-gathers, partial outputs and temporary buffers.

**Study**

1. [Saved activations, not a universal peak formula](https://arxiv.org/abs/2205.05198v1) (Reducing Activation Recomputation in Large Transformer Models) - arXiv:2205.05198v1, Sections 4.1, 4.2.1 and 4.2.2, equations 1, 2 and 4; Section 5 and Table 2. Depth: Keep the stated two-byte activations, one-byte dropout masks and GPT-style architecture assumptions. Re-derive the ledger for SwiGLU, GQA or memory-efficient attention instead of applying its coefficients unchanged.
2. [The transformer-block collective count](https://arxiv.org/abs/1909.08053v4) (Megatron-LM: Training Multi-Billion Parameter Language Models Using Model Parallelism) - arXiv:1909.08053v4, Section 3, Figure 4 and its four-operation caption.
3. [Communication follows the sharded contraction](https://jax-ml.github.io/scaling-book/training#tensor-parallelism) (How to Scale Your Model - Chapters 3 and 5) - Chapter 5, Tensor Parallelism: forward/backward algorithm and compute/communication model. Depth: Stop before Combining FSDP and Tensor Parallelism. Its boundaries shard hidden features, not the SP token layout. Retain the topology and overlap assumptions; its TPU constants are not measurements of your machine.

**Focus**

- For a bias-free SwiGLU with model width $`D`$, expanded width $`F`$ and TP degree $`p`$, sharded weights total $`3DF/p`$ elements per rank. Replicated norm gains add $`D`$. Count gradients and each optimizer tensor at their own dtype, with no automatic master-weight assumption.
- For batch $`B`$, sequence $`S`$ and bytes per activation $`q`$, a full residual has $`n=q \times B \times S \times D`$ bytes. A ring all-reduce sends $`2(p-1)n/p`$ bytes per rank; a ring all-gather or reduce-scatter sends $`(p-1)n/p`$. Receive traffic is equal and is not included in these send counts.
- A plain Megatron attention-plus-MLP block has two forward and two backward activation all-reduces. TP+SP replaces those with four all-gathers and four reduce-scatters across both passes; norm-gradient sums, loss traffic and optional saved-input re-gathers are additional.
- Record unique storage and lifetimes, not just tensor names. Views can share storage; all-gathered inputs, full-shaped partial outputs, receive buffers and allocator reserve can make peak memory exceed saved-activation estimates.

**Reproduce:** Derive a byte ledger for TorchFeather's bias-free RMSNorm-SwiGLU at $`B=2`$, $`S=4`$, $`D=8`$, $`F=16`$, $`p=2`$, with `torch.float32` weights and activations. Each rank's three weight shards plus norm gain occupy 800 bytes; a replicated residual occupies 256 bytes and its sequence shard 128 bytes. Separately derive 1024 sent bytes per rank for the four ring activation all-reduces of a plain attention-plus-MLP training block at those residual dimensions. TP+SP's corresponding eight collectives have the same ideal send volume, excluding the extra operations listed in Focus. Check the storage counts against local tensors and label the ring traffic as analytical, not measured backend traffic.

**Traps**

- Dividing the entire optimizer or activation footprint by TP degree. Replicated gains, temporaries and optional full-precision copies need separate terms.
- Confusing all-reduce payload bytes with sent-plus-received traffic. State the counting convention before comparing formulas.
- Treating a saved-activation equation as a GPU memory-peak prediction, especially after replacing materialized attention with a tiled kernel.

**Practice**

- [How to Scale Your Model: Chapter 3, Question 4 [matmul strategies]](https://jax-ml.github.io/scaling-book/sharding#some-problems-to-work) - Some Problems to Work: Question 4 [matmul strategies]. Answer before opening the printed solution. Derive local FLOPs and communication for gather-before-matmul versus partial-matmul-then-reduce. Distinguish the book's bandwidth-dominated TPU model from finite-degree ring send counts and from serial dependency bounds. The section mini-project covers the layer ledger and collective records.

**Stop when:** Your ledger reconciles local parameter and boundary-activation storage, accounts for both passes and extra collectives, and labels payload, send traffic, saved memory and peak memory separately.

<details>
<summary>Self-test</summary>

1. Where do the 800 parameter bytes in Reproduce come from?
   - Three matrices of shape $`8 \times 16`$ split over two ranks give 192 elements, plus eight replicated gains. At four bytes per element, 200 elements occupy 800 bytes.
2. For two ranks and a 256-byte payload, how much does one ideal ring all-reduce send per rank?
   - 256 bytes: $`2(2-1)256/2`$. It also receives 256 bytes, so sent-plus-received traffic is 512 bytes.
3. Can matching ideal ring bytes establish matching TP and TP+SP runtime?
   - No. Startup costs, backend algorithms, re-gathers, kernel shapes and overlap differ. The byte equality covers only the specified collective payloads.

</details>

#### U8. Context-parallel sequence ownership and ring attention

**About 5 h** · **Target:** Derive + Implement

Topics: Context-parallel sequence ownership; Ring attention block exchange and online softmax state

CP keeps tokens partitioned through the block instead of gathering the full sequence for TP. Attention must still combine every allowed remote key with each local query.

**You can now**

- Derive query ownership, KV visits and per-rank forward communication for a context-parallel ring.
- Implement a deterministic ring-attention simulation with dense output and gradient oracles.
- Explain causal load imbalance and distinguish streamed KV storage from gathering all KV.

**Study**

1. [Context ownership, ring exchange and causal imbalance](https://nanotron-ultrascale-playbook.static.hf.space/index.html#context_parallelism) (Ultra-Scale Playbook - Tensor, Sequence and Context Parallelism) - Context Parallelism; Ring Attention; Zig-Zag Ring Attention - A balanced compute implementation. Depth: Read the ownership and KV-exchange diagrams, not the benchmark plots. The rendered zig-zag heading uses a long dash; locate it by title.
2. [Incremental attention across a ring](https://arxiv.org/abs/2310.01889v4) (Ring Attention with Blockwise Transformers for Near-Infinite Context) - arXiv:2310.01889v4, Section 3, Ring-Based Blockwise Attention; Algorithm 1; Appendix A, `scan_kv_block` and the forward `lax.scan`. Depth: Algorithm 1 prints only $`N_h-1`$ compute iterations before feedforward and omits the final received block's attention evaluation. Use Appendix A's $`N_h`$ visits as the coverage contract; an optimized forward ring needs $`N_h-1`$ transfers. Leave fused kernels to depth work.
3. [Four-rank causal ring on CPU](https://github.com/hkproj/torchfeather/blob/c416ab1ad0fd3567a0a6c8ad0da570c8fd6e55aa/minimal_examples/ring_attention.py) (TorchFeather - TP and Ring Attention Minimal Examples) - `rotate_tensors`, `apply_local_causal_mask`, `ring_attention`, `format_ring_schedule` and `main` output comparison. Depth: This example checks forward output only and waits for communication before the next compute. It is not gradient or overlap evidence. Its final rotation is redundant for forward output.

**Focus**

- Keep queries and outputs local; stream KV shards past each query shard. With contiguous sequence ownership, a rank skips wholly future KV blocks and masks its own diagonal block. Reordered ownership requires actual global token indices.
- Reuse Online softmax state, query and key-value tiling and output tolerance. Carry the running maximum, exponential denominator and weighted numerator across KV visits; never softmax each block independently and sum normalized outputs.
- For CP degree $`c`$, batch $`B`$, sequence $`S`$, KV heads $`H_{\mathrm{kv}}`$, head width $`d`$ and element bytes $`q`$, one equal KV shard is $`2qB(S/c)H_{\mathrm{kv}}d`$ bytes. A forward ring without the redundant return sends $`(c-1)`$ shards per rank, excluding metadata. Backward requires its own communication ledger.
- Remote keys accumulate gradient contributions from multiple query owners. A differentiable simulation can retain that graph; a real P2P implementation must explicitly return and sum remote KV gradients. CP parameter replicas also need globally weighted gradient sums.

**Reproduce:** Closed-book, draw four ranks' KV-owner visits for an eight-token causal sequence, then simulate the same visits on CPU with seed-0 `torch.float64` query, key and value tensors shaped $`[1,2,8,4]`$. Compare outputs and all three input gradients under squared-output sum loss with dense causal attention, at a stated tolerance. Skip wholly masked blocks safely. For the named `torch.float32` example, count 128 bytes per KV shard: four rotations send 512 bytes per rank, while three sufficient rotations send 384 bytes. Removing only the final rotation must preserve output.

**Traps**

- Summing per-block normalized attention. Each block used a different denominator; merge unnormalized statistics instead.
- Assuming a correct P2P forward pass gives remote KV gradients automatically. Ordinary send/receive calls do not create that distributed autograd path.
- Calling contiguous causal partitioning balanced. Early query shards have fewer allowed KV blocks than late shards; zig-zag placement changes this work distribution.

**Practice**

- [TorchFeather: ring-attention minimal example](https://github.com/hkproj/torchfeather/blob/c416ab1ad0fd3567a0a6c8ad0da570c8fd6e55aa/minimal_examples/ring_attention.py) - At commit c416ab1, run `torchrun --nproc-per-node 4 --master-port 29653 minimal_examples/ring_attention.py` from the repository root. It uses Gloo on CPU, prints KV-owner schedules and checks output against ordinary causal SDPA. Remove the redundant final rotation and recheck. The section mini-project covers remote-gradient ownership and mask variations in `trainlab`; the public example does not test them.

**Stop when:** The CPU example and your dense forward/gradient simulation agree, every allowed KV block is visited once, and your byte count distinguishes four shipped rotations from three necessary transfers.

<details>
<summary>Self-test</summary>

1. How many KV visits and transfers are needed for a noncausal forward ring on four ranks?
   - Four visits, including the local shard, and three transfers per rank. Returning the last shard to its original owner is unnecessary for the forward output.
2. Under contiguous causal ownership, which rank has more useful work: the first or last?
   - The last. Its queries can use all earlier blocks; the first rank can use only its own causally masked block.
3. Does CP alone divide parameter memory by its degree?
   - No. It partitions sequence activations and work while parameters remain replicated over the CP group unless another sharding dimension is added.

</details>

#### U9. Causal masks, document boundaries, positions and RNG across shards

**About 4 h** · **Target:** Implement

Topics: Causal masks, document boundaries and position offsets under CP; Dropout and initialization RNG consistency across shards

A shard-local index is not a token's logical position. Correct shapes and collectives can still compute a different objective if masking, rotation or randomness changes with partitioning.

**You can now**

- Preserve causal visibility, document isolation and position IDs when tokens cross CP shard boundaries.
- Implement initialization and dropout checks that distinguish replicas from disjoint shards.
- Diagnose mask-offset, rotary-table and RNG mismatches with a partition-independent CPU oracle.

**Study**

1. [Sequence buffers and the rotary-frequency trap](https://docs.pytorch.org/tutorials/unstable/context_parallel.html#introduction) (PyTorch Context Parallel Tutorial) - Introduction: `buffers`, `buffer_seq_dims` and missing `freq_cis` warning; Enable Context Parallel: sharding/restoration and output comparison (page read 2026-10-14). Depth: Read on any machine. With two or more GPUs, run the example with one NCCL rank per GPU and a matching process count. On CPU, use the ring simulation instead. The tutorial compares outputs only, not gradients or dropout replay.
2. [Explicit packed-document visibility](https://docs.pytorch.org/docs/2.14/generated/torch.nn.functional.scaled_dot_product_attention.html) (PyTorch 2.14 SDPA - explicit masks and dropout) - Equivalent implementation; boolean mask note; parameters `attn_mask`, `is_causal` and `dropout_p`. Depth: Build the CPU oracle with an explicit allowed-entry mask and zero SDPA dropout. Apply the document-boundary policy from From documents to training examples: packing and loss masks. Do not pass a custom mask to the CP wrapper without separately verifying its support.
3. [Replicated versus model-parallel random streams](https://arxiv.org/abs/1909.08053v4) (Megatron-LM: Training Multi-Billion Parameter Language Models Using Model Parallelism) - arXiv:1909.08053v4, Appendix B.2, Model Parallel Random Number Generation.
4. [Initialize globally, then select the intended shard](https://github.com/huggingface/picotron/blob/59714b1bf25541dbeb6f5a721ed15f6d0768e786/picotron/tensor_parallel/tensor_parallel.py) (Picotron - Tensor and Context Parallelism) - `ColumnParallelLinear.reset_parameters`, `RowParallelLinear.reset_parameters` and `VocabParallelEmbedding.reset_parameters`. Depth: Inspect the master-weight generation and shard selection. This depends on matching RNG state across ranks; it is not a broadcast or a guarantee for independently initialized ranks.

**Focus**

- Build on RoPE and From documents to training examples: packing and loss masks. Carry global token indices, document IDs, declared position IDs and validity with each shard. For isolated causal documents, allow only valid keys from the same document no later than the query.
- Slice masks by query and KV ownership, not local triangular indices alone. Slice rotary frequencies using the same position IDs as the unsharded path; zig-zag placement needs index selection rather than one contiguous offset.
- Replicated values must use identical initialization and replicated dropout masks. Disjoint head/token shards need their own logical random entries, not repeated same-seed local masks. A global mask sliced by logical indices is a small partition-independent oracle, not a scalable implementation.
- Attention-probability dropout acts on the normalized weights, not on the softmax denominator. For exact replay, key mask entries by logical query/key/head identity or slice one global mask. Same seed alone does not align different draw shapes and orders.

**Reproduce:** On CPU, use seed-0 `torch.float64` inputs shaped $`[1,2,8,4]`$, document IDs `[0, 0, 0, 1, 1, 1, 1, 1]` and position IDs 0 through 7. Split the sequence into four shards; compare explicit masked attention and gradients against the dense isolated-document oracle. Apply your existing RoPE with the same position IDs and verify sharded reconstruction, then reset each shard's positions to zero and catch the mismatch. For output dropout probability 0.25, generate one global keep mask and scale by $`1/0.75`$; slicing and reconstructing it must reproduce the dense masked output. Changing a value in the first document must not change the second document's output.

**Traps**

- Using `is_causal=True` on a rectangular local-query/global-key block. SDPA's upper-left alignment does not supply the shard's position offset.
- Assuming EOS isolates documents or that a loss mask changes attention visibility. The two masks preserve different semantics.
- Restarting the same seed for each disjoint shard. This can repeat dropout patterns and cannot establish equality with a global random stream.

**Practice**

- The section mini-project covers this: packed-document masks, rotary position alignment, replicated initialization and indexed dropout replay with negative cases in `trainlab`.

**Stop when:** Your dense/sharded mask, position and dropout checks pass, and reset-position, repeated-mask and cross-document-visibility mutations each fail the intended invariant.

<details>
<summary>Self-test</summary>

1. A query in the second document follows a key from the first. Is the key allowed under the isolated policy?
   - No. Causal order is necessary but not sufficient; document identity must also match.
2. Why is rank-local `arange` insufficient for rotary positions?
   - It loses logical offsets or reordered indices. Each token must receive the same rotation as in the declared unsharded position policy.
3. Do distinct rank seeds guarantee partition-independent dropout?
   - No. They can provide distinct streams for a fixed layout, but changing ownership changes which random entry reaches a logical element. Exact oracle replay needs explicit logical indexing.

</details>

#### U10. Divisibility failures and single-process reconstruction oracles

**About 4 h** · **Target:** Implement

Topics: Uneven sequence and head divisibility failures; Single-process reconstruction and gradient oracle tests

A divisible shape does not prove correct ownership, and an uneven shape is not automatically illegal. Explicit policies and independent oracles separate implementation limits from mathematical limits.

**You can now**

- Validate sequence, feature and head ownership under an explicit equal-shard, uneven-shard or padding policy.
- Implement independent single-process forward, loss and gradient oracles for TP and CP layouts.
- Catch wrong shard order, repeated bias, invalid targets and missing gradient sums with negative tests.

**Study**

1. [Uneven DTensor shards and metadata checks](https://docs.pytorch.org/docs/2.14/distributed.tensor.html#torch.distributed.tensor.placement_types.Shard) (PyTorch Tensor Parallel Tutorial) - `Shard`: `torch.chunk` semantics and experimental uneven-sharding note; `DTensor.from_local`: `run_check`, `shape` and `stride`. Depth: Read these entries only. Uneven placement support does not imply every module or collective accepts ragged inputs.
2. [Equal-shard assertions and a linear oracle suite](https://github.com/huggingface/picotron/blob/59714b1bf25541dbeb6f5a721ed15f6d0768e786/tests/test_tensor_parallel.py) (Picotron - Tensor and Context Parallelism) - Reference weight transfer; forward comparisons; backward weight, bias and input-gradient checks. Depth: Also inspect constructor divisibility assertions in https://github.com/huggingface/picotron/blob/59714b1bf25541dbeb6f5a721ed15f6d0768e786/picotron/tensor_parallel/tensor_parallel.py . Port the CUDA/NCCL harness to CPU/Gloo as described in Practice.
3. [Dense CP reconstruction and its missing checks](https://github.com/hkproj/torchfeather/blob/c416ab1ad0fd3567a0a6c8ad0da570c8fd6e55aa/minimal_examples/ring_attention.py) (TorchFeather - TP and Ring Attention Minimal Examples) - `main`: sequence partition, dense causal SDPA reference and output comparison. Depth: Reuse the dense reference, not the ring implementation, as the oracle. Add gradients and uneven-token cases in your deterministic simulation; the shipped suite checks neither.

**Focus**

- Record the ownership policy before launching. Picotron requires equal linear/vocabulary shards. Whole-head GQA without KV replication requires TP degree to divide query and KV head counts; retain the mapping checks from the attention unit.
- DTensor uneven sharding follows `torch.chunk`, not a balanced remainder policy. On four ranks, ten elements have lengths `[3, 3, 3, 1]`. A custom CP simulation may use different boundaries if it preserves every logical token exactly once.
- Reconstruct by logical indices and compare against ordinary PyTorch with the same global weights, inputs, masks, positions and loss denominator. Reusing the sharded mask builder in both paths can hide the same bug.
- Compare input and reconstructed parameter gradients, not only output. Start with zero dropout and `torch.float64`; then add indexed RNG replay and justify lower-precision tolerances separately.

**Reproduce:** Closed-book, simulate causal attention for ten tokens over four CPU shards with boundaries `[0, 3, 6, 9, 10]`. Compare outputs and query/key/value gradients against dense attention under squared-output sum loss. Separately reconstruct `torch.arange(10.)` from four Gloo DTensor shards and check lengths `[3, 3, 3, 1]`. Reject four-way equal KV-head sharding for eight query heads and two KV heads. Swap two output shards and remove one gradient contribution; each mutation must fail a specific oracle assertion rather than hang in a collective.

**Traps**

- Assuming `torch.chunk` assigns the remainder one element at a time. Its shard boundaries can differ from a balanced split.
- Padding tokens without excluding padded keys and padded loss entries. The padded execution then changes the objective.
- Testing only all-ones upstream gradients. Add a nonuniform or nonlinear scalar loss to expose indexing errors.

**Practice**

- [Picotron: tensor-parallel linear forward/backward tests](https://github.com/huggingface/picotron/blob/59714b1bf25541dbeb6f5a721ed15f6d0768e786/tests/test_tensor_parallel.py) - At commit 59714b1, port `tests/test_tensor_parallel.py` and run it with four CPU processes. Use CPU tensors, Gloo and `torch.manual_seed(42)` instead of the utility import; replace the column test's exact `torch.eq` with `torch.testing.assert_close`. Keep identical reference weights and inputs across TP partners. Run the port with `torchrun --nproc-per-node 4` and your file path. The section mini-project covers uneven CP, invalid targets, padding and ownership mutations in `trainlab`.

**Stop when:** The CPU linear suite and uneven attention output/gradient oracle pass, and each declared illegal layout or injected ownership error fails before performance measurement.

<details>
<summary>Self-test</summary>

1. Must a ten-token sequence be rejected on four CP ranks?
   - Only if the implementation requires equal shards and has no padding policy. An uneven implementation can be correct with explicit boundaries, valid masks and compatible communication.
2. Why can a correct output hide an incorrect backward pass?
   - Missing input-gradient sums or remote KV-gradient returns do not change forward values. Compare each derivative under the same logical loss.
3. What makes the dense path an independent oracle?
   - It uses ordinary full tensors and independently declared global visibility and positions. It does not reproduce the partitioned algorithm's ownership logic.

</details>

#### U11. Choosing TP and CP degrees, and asynchronous tensor parallelism

**About 4 h** · **Target:** Derive + Measure

Topics: TP or CP degree choice under link bandwidth and sequence length; Asynchronous tensor parallelism and collective overlap

Increasing a degree shrinks local work but adds communication and can worsen kernel efficiency. Choose a correct, memory-feasible plan before testing whether overlap reduces its critical path.

**You can now**

- Derive feasible TP and CP degree candidates from head policy, memory, sequence length and link bandwidth.
- Measure synchronous and asynchronous CPU correctness paths without claiming GPU overlap from their timings.
- Distinguish an asynchronous launch from hidden communication using a dependency model and, when hardware permits, a GPU trace.

**Study**

1. [Degree choice depends on the workload and links](https://nanotron-ultrascale-playbook.static.hf.space/index.html#tensor_parallelism_in_a_transformer_block) (Ultra-Scale Playbook - Tensor, Sequence and Context Parallelism) - Closing TP throughput/memory trade-off; Sequence parallelism closing benchmark summary; Context Parallelism and Ring Attention overlap discussion. Depth: Use the trends and dependencies, not the plotted throughput as a target. The node boundary and eight-GPU threshold describe the authors' topology, not a universal TP limit.
2. [Chunked communication and matmul overlap](https://jax-ml.github.io/scaling-book/sharding#how-to-overlap-matmul-communication-with-compute) (How to Scale Your Model - Chapters 3 and 5) - Chapter 3, How to overlap matmul communication with compute: collective-matmul animation and chunked matmul/ring-reduction explanation. Depth: Read this subsection only. Transfer the dependency reasoning; TPU bandwidth and tiled-kernel behavior are not GPU measurements.
3. [Input-gradient reduction beside weight-gradient compute](https://github.com/huggingface/picotron/blob/59714b1bf25541dbeb6f5a721ed15f6d0768e786/picotron/tensor_parallel/tp_communications.py) (Picotron - Tensor and Context Parallelism) - `LinearWithAsyncAllReduce.backward`; `linear_with_all_reduce` and `linear_with_async_all_reduce`. Depth: Trace launch, independent weight/bias work and final wait. This is backward overlap at one column layer, not a tiled forward asynchronous-TP implementation.
4. [Asynchronous results still need completion](https://docs.pytorch.org/docs/2.14/distributed.tensor.html#torch.distributed.tensor.DTensor.redistribute) (PyTorch Tensor Parallel Tutorial) - `DTensor.redistribute`: `async_op`; `DTensor.to_local`: `AsyncCollectiveTensor` return and `wait` contract.

**Focus**

- TP shards large weights and feature work but communicates at projection boundaries. CP partitions tokens and attention work without sharding parameters by itself. Longer sequences supply more attention compute per streamed KV byte, but causal imbalance and small local blocks can limit that advantage.
- Enumerate legal degrees, keep global valid tokens and model semantics fixed, and combine the earlier storage/traffic ledger with launch latency and effective bandwidth. Local GEMM efficiency and temporary-buffer peaks can invalidate an otherwise attractive byte-only plan.
- Picotron computes the input gradient, launches its all-reduce, computes independent weight/bias gradients, then waits before returning. Tiled forward asynchronous TP instead overlaps partial matmuls with communication chunks; it requires additional scheduling and buffer dependencies.
- For ideal independent compute and communication durations, an overlap window costs $`\max(T_{\text{compute}},T_{\text{comm}})`$, not their sum. Startup, final drain and contention remain. CPU timings and a host's early return establish neither this ideal nor real GPU overlap.

**Reproduce:** Without notes, draw Picotron's synchronous and asynchronous backward dependencies. On four CPU/Gloo processes, run the previous linear oracle with `async_all_reduce=False` and `async_all_reduce=True`, keeping inputs and weights fixed. Compare all gradients and record warmed-up wall-clock backward samples with communication complete before stopping the timer; label them CPU execution, not GPU overlap evidence. In a deterministic timing model with independent 3 ms compute and 2 ms communication, compare a 5 ms serial window with a 3 ms ideal overlapped window. Sweep hypothetical bandwidth and sequence length for legal TP/CP candidates using the earlier ledger. With two or more GPUs, optionally repeat the matched NCCL variants with synchronized timing and a profiler trace; report exposed communication and any regression, not an assumed speedup.

**Traps**

- Timing only the asynchronous launch or reading a collective output before completion. Neither measures the completed operation.
- Increasing TP until local matmuls become too small, or choosing CP to solve parameter memory that remains replicated.
- Claiming overlap because compute and communication appear on different streams. Their actual intervals, dependencies and contention determine the exposed tail.

**Practice**

- The section mini-project covers this: legal TP/CP candidate tables, bandwidth-sensitive timing models and matched synchronous/asynchronous correctness and timing records in `trainlab`. GPU overlap traces are conditional on two or more GPUs; CPU results remain explicitly CPU-only.

**Stop when:** Your legal candidate table names memory and communication limits, both CPU variants match the gradient oracle, and your model or available GPU trace distinguishes launch, useful overlap and exposed communication.

<details>
<summary>Self-test</summary>

1. Which work can Picotron place beside the input-gradient all-reduce?
   - Weight- and bias-gradient computation. They use saved input and upstream gradient, not the reduced input gradient. The caller still needs completion before consuming that input gradient.
2. Does a longer sequence always make a larger CP degree faster?
   - No. It can improve compute per KV byte, but local block size, imbalance, launch latency and link contention still constrain useful degrees.
3. Can an asynchronous variant pass every oracle and still be slower?
   - Yes. Correct scheduling may add launches, waits, buffers or contention without hiding enough communication. Preserve correctness and report the measured regression.

</details>

### Mini-project: Tensor, sequence and context parallelism with owned layouts

**About 12 to 16 hours.** Extend `trainlab` with tensor, sequence and context parallel mechanisms over the tiny transformer, each checked against a single-process oracle on CPU. Sharded layouts, collective records and timing models make degree choices testable instead of inherited.

1. Build the paired column-to-row MLP in `parallel/` with explicit Gloo communication, and reconstruct outputs plus input and weight gradients against the `model/` oracle, keeping collective records. Anchor the linear path with the TensorTonic column-parallel problem and the ported Picotron linear tests.
2. Extend the layout to grouped-query attention and SwiGLU in `parallel/`, preserving query-to-value mapping and matching gate and up shards, checked against the `model/` oracle for outputs and gradients. Run the TorchFeather attention and SwiGLU examples, then cover the grouped-query ownership variation the examples omit.
3. Add vocabulary-parallel embedding and sharded cross-entropy in `parallel/` with per-token reductions, tied-weight accumulation and range checks against ordinary cross-entropy. Add sequence-sharded norms and residuals with per-rank gain-gradient sums, layout assertions and saved-versus-temporary accounting.
4. Express the layouts as `DTensor` placements on a named mesh in `comm/`, with group manifests, boundary assertions and forward and backward oracle comparisons. Keep a transition suite that reconstructs each layout and records the backend-aware collective behind every communicating move.
5. Build the ring-attention path in `parallel/` with streamed key-value visits, online softmax state and remote-gradient returns, removing the redundant rotation and rechecking outputs and gradients. Cover packed-document masks, rotary alignment and indexed dropout replay with negative cases plus uneven-shard, padding, invalid-target and ownership-mutation oracles.
6. Derive the per-rank ledger in `plan/` after working the JAX matmul-strategies question. Tabulate feasible degree candidates with a bandwidth-sensitive timing model and matched correctness and timing records for the sync and async paths, with GPU overlap traces only with two or more GPUs.

**Deliverables**

- The `parallel/` tensor, sequence and context mechanisms with oracles, manifests and collective records.
- The `plan/` ledger, candidate table and timing model with synchronous and asynchronous records.
- `tests/` replaying every oracle and negative case plus `reports/` separating CPU from GPU evidence.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [TensorTonic: Reconstruct a Column-Parallel MLP Layer](https://www.tensortonic.com/problems/cs336-l07-column-parallel-mlp). Pass the public cases in your harness; keep rank-ordered outputs without claiming collectives.
- external-tests: [TorchFeather tensor-parallel attention example](https://github.com/hkproj/torchfeather/blob/c416ab1ad0fd3567a0a6c8ad0da570c8fd6e55aa/minimal_examples/tp_attention.py). Run the CPU comparison; extend to grouped-query ownership in trainlab.
- external-tests: [TorchFeather tensor-parallel SwiGLU example](https://github.com/hkproj/torchfeather/blob/c416ab1ad0fd3567a0a6c8ad0da570c8fd6e55aa/minimal_examples/tp_swiglu.py). Run the CPU comparison; keep gate and up shards aligned.
- external-tests: [TorchFeather ring-attention minimal example](https://github.com/hkproj/torchfeather/blob/c416ab1ad0fd3567a0a6c8ad0da570c8fd6e55aa/minimal_examples/ring_attention.py). Recheck outputs after removing the redundant rotation; add gradient ownership.
- external-tests: [Picotron tensor-parallel linear tests](https://github.com/huggingface/picotron/blob/59714b1bf25541dbeb6f5a721ed15f6d0768e786/tests/test_tensor_parallel.py). Port to CPU processes with modern assertions; keep shared reference weights.
- external-tests: [How to Scale Your Model matmul strategies question](https://jax-ml.github.io/scaling-book/sharding#some-problems-to-work). Derive both strategies on paper before opening the printed solution.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Paired MLP correctness | Outputs plus input and weight gradients match the oracle, and collective records name each communicating move. | A second sharding or activation choice replays cleanly, and one seeded defect shows which check catches it. |
| Vocabulary and sequence layouts | Sharded loss, tied weights, norms and residuals match oracles, with gain sums and accounting kept. | Reset-position and repeated-mask mutations fail named assertions, and padding policy is exercised. |
| Ring and oracle discipline | Ring outputs and gradients match dense attention, uneven and empty cases pass, and illegal layouts are rejected. | Ownership mutations fail specific assertions, and the redundant rotation removal keeps the match. |
| Ledger and degree choice | The ledger covers parameters, activations and collectives, separating payload, traffic, saved and peak memory. | Synchronous and asynchronous paths match oracles, candidates name their limiting constraint, and GPU traces report exposed communication honestly. |

Feeds into: The `parallel/` mechanisms, oracles, ledgers and candidate tables feed pipeline and expert composition, the multidimensional plan and the capstone.

### Resource route

- **Primary - Theory:** [Ultra-Scale Playbook - Tensor, Sequence and Context Parallelism](https://nanotron-ultrascale-playbook.static.hf.space/index.html#tensor_parallelism) - Read Tensor Parallelism, Tensor parallelism in a transformer block, Sequence parallelism, Context Parallelism, Ring Attention and Zig-Zag Ring Attention in order. Redraw every tensor shape and collective for a concrete batch, sequence, hidden and head configuration; the context-parallel section gives no byte formula, so derive one yourself.
- **Required - Paper:** [Megatron-LM: Training Multi-Billion Parameter Language Models Using Model Parallelism](https://arxiv.org/abs/1909.08053) - Read the model-parallel section: the $`f`$ and $`g`$ operators, MLP and self-attention partitioning, and the parallel embedding and cross-entropy. Derive each forward and backward collective before reading the code.
- **Support - Paper:** [Reducing Activation Recomputation in Large Transformer Models](https://arxiv.org/abs/2205.05198) - Read the sequence-parallelism and selective-recomputation sections and the activation-memory equations. Check them against your own per-layer memory derivation.
- **Support - Paper:** [Ring Attention with Blockwise Transformers for Near-Infinite Context](https://arxiv.org/abs/2310.01889) - Read the ring algorithm and its overlap condition, then compare it with all-gather context parallelism and DeepSpeed-Ulysses (arXiv 2309.14509) when choosing a context-parallel scheme.
- **Required - Implementation:** [Picotron - Tensor and Context Parallelism](https://github.com/huggingface/picotron) - Read `tensor_parallel/tensor_parallel.py`, `tp_communications.py`, `context_parallel/context_parallel.py` and `cp_communications.py`. `tests/test_tensor_parallel.py` hardcodes NCCL and CUDA; port it to Gloo on CPU and compare with `torch.testing.assert_close`, because its exact equality check fails when sharded and full matmuls round differently.
- **Support - Course:** [Picotron Tutorial - Step 4 and Part 2 Video](https://github.com/huggingface/picotron_tutorial) - Follow `step4_tensor_parallel` with its diff and the Part 2 video. Write your own column and row layers first.
- **Required - Lab:** [TorchFeather - TP and Ring Attention Minimal Examples](https://github.com/hkproj/torchfeather) - Run `minimal_examples/block_matrix_multiply.py`, then `tp_swiglu.py` and `tp_attention.py` with 2 processes and `ring_attention.py` with 4, all on Gloo on CPU; each checks its output and gradients against ordinary tensors. Change one placement or mask and watch the check fail.
- **Support - Lab:** [Distributed Training Guide - Chapter 6 Tensor Parallelism](https://github.com/LambdaLabsML/distributed-training-guide) - Read colwise and rowwise linear layers, embeddings, norms, loss parallelism and throughput accounting in `06-tensor-parallel` as a practitioner second view. Its script needs one GPU per rank.
- **Required - Reference:** [PyTorch Tensor Parallel Tutorial](https://docs.pytorch.org/tutorials/intermediate/TP_tutorial.html) - Use the tutorial to map `ColwiseParallel`, `RowwiseParallel`, `SequenceParallel`, `PrepareModuleInput` and loss parallelism to the ownership model you derived, with the DTensor reference at https://docs.pytorch.org/docs/2.14/distributed.tensor.html for `Shard`, `Replicate`, `Partial` and `redistribute`. Add assertions around every layout transition.
- **Support - Reference:** [PyTorch Context Parallel Tutorial](https://docs.pytorch.org/tutorials/unstable/context_parallel.html) - Read the `context_parallel` API, buffer sequence dimensions, rotation methods and the rotary-frequency trap. It needs CUDA GPUs and NCCL; on CPU, keep to the TorchFeather ring-attention example.
- **Support - Theory:** [How to Scale Your Model - Chapters 3 and 5](https://jax-ml.github.io/scaling-book/sharding) - Solve the sharded-matrix multiplication layouts in Chapter 3 and the Megatron sharding section of Chapter 5. Translate the results into PyTorch DTensor placements and collective counts.
- **Support - Practice:** [TensorTonic - Reconstruct a Column-Parallel MLP Layer](https://www.tensortonic.com/study-plans/language-modeling-from-scratch) - Solve Reconstruct a Column-Parallel MLP Layer, including its uneven-shard cases.
- **Reference - Reference:** [PyTorch 2.14 SDPA - explicit masks and dropout](https://docs.pytorch.org/docs/2.14/generated/torch.nn.functional.scaled_dot_product_attention.html) - Use the equivalent attention implementation and `attn_mask`/`dropout_p` contract to build a CPU packed-document oracle before translating masks to context-parallel blocks. Do not assume the experimental CP wrapper supports every SDPA mask.

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

### Study units

#### U1. Ordered stages, stage cost and balanced or automated partitioning

**About 5 h** · **Target:** Derive + Implement

Topics: Layer partitioning into ordered pipeline stages; Stage cost estimation and balanced partitioning; Automated graph partitioning

A pipeline is only as fast as its slowest stage, and every later schedule assumes the partition. Placing embedding, layers and output head once, with cost attached, fixes the map the rest of the section executes.

**You can now**

- Partition an ordered layer stack over $`p`$ stages with embedding-first and output-last ownership and a stated remainder rule.
- Estimate per-stage cost from forward plus backward time and name the critical stage that sets the makespan.
- Explain why hand-placed splits are not automatic graph partitioning and what an automatic partitioner would still decide.

**Study**

1. [Split layers across devices](https://nanotron-ultrascale-playbook.static.hf.space/index.html#pipeline_parallelism) (Ultra-Scale Playbook - Pipeline Parallelism) - Pipeline Parallelism introduction through Splitting layers on various nodes - All forward, all backward: layer ranges per GPU, low-bandwidth activation transfers, and the note that activation memory stays flat because each stage holds $`1/p`$ of the layers for $`p`$ microbatches in flight.
2. [PipelineParallel stage construction](https://github.com/huggingface/picotron/blob/59714b1bf25541dbeb6f5a721ed15f6d0768e786/picotron/pipeline_parallel/pipeline_parallel.py) (Picotron - Pipeline Parallelism) - `PipelineParallel`: `distribute_layers` evening out remainder layers over early ranks, `embedding` on the first stage only, `final_norm` and `final_proj` on the last stage only, `forward` threading `hidden_states` through the assigned decoder layers.
3. [Stage maps with embedding and output weights](https://github.com/hkproj/torchfeather/blob/c416ab1ad0fd3567a0a6c8ad0da570c8fd6e55aa/torchfeather/distributed/pipeline_parallel.py) (TorchFeather - Pipeline Minimal Example and Runtime) - `generate_llm_fqn_per_model_part` with `input_weight` and `output_weight` charging `tok_embeddings` and `norm` plus `output` against the first and last stages, and `pipeline_module_split` looped versus V-shaped placement.
4. [Manual and tracer model splits](https://docs.pytorch.org/tutorials/intermediate/pipelining_tutorial.html) (PyTorch Pipeline Parallelism Tutorial) - Step 1 (page read 2026-10-14): manual split deleting layers 4 to 7 or 0 to 3 with `ModuleDict` names kept, and tracer split with `SplitPoint.BEGINNING` at `layers.4` plus `build_stage`. Depth: Stop after Step 1. Schedules and loss placement belong to later units.

**Focus**

- Stages are ordered and contiguous: microbatch $`i`$ leaves stage $`s`$ for stage $`s+1`$ in both directions, so any partition is a cut plan over the layer list.
- First and last stages carry extra cost: the embedding lookup lives on stage 0 and the final norm plus output projection live on the last stage, and a balance that ignores them overloads both ends.
- Equal layer counts do not imply equal stage cost: position-dependent work such as the vocabulary projection, plus backward costing about twice forward, moves the critical stage.
- The tracer `split_spec` still takes hand-placed split points; it automates cutting, not choosing where to cut.

**Reproduce:** From a blank file, partition a 10-layer stack over 3 stages with the remainder-to-early-ranks rule, mark embedding and output ownership, and write each stage's layer list with its per-stage layer count.

**Traps**

- Counting the embedding, norm and output projection as free when balancing. Measure them as layers would be measured, or the end stages become the bottleneck.
- Assuming equal layer counts balance the pipe. Estimate forward plus backward seconds per stage and balance those, not layer counts.
- Calling a tracer `split_spec` an automatic partitioner. It places cuts you chose; a true partitioner would also choose cut positions from a cost model, and that stays later work.

**Practice**

- [PyTorch pipelining tutorial: both splits, one output check](https://docs.pytorch.org/tutorials/intermediate/pipelining_tutorial.html) - Run the Step 2 script with `manual_model_split` and again with `tracer_model_split` under `torchrun --nnodes 1 --nproc_per_node 2`; assert rank 1 prints identical losses. The script falls back to `torch.device(cpu)`, so CPU is enough. Keep the 8-layer split and 4 microbatches; the output-equality gate is the point, not step time.

**Stop when:** Both split modes print identical rank-1 losses, and you can write any small layer-to-stage map with embedding and output ownership from memory.

<details>
<summary>Self-test</summary>

1. Split 10 layers over 3 stages with Picotron's remainder rule. Which layers land on each stage?
   - Counts $`[4, 3, 3]`$: stage 0 holds layers 0 to 3, stage 1 holds 4 to 6, stage 2 holds 7 to 9. The $`10 \bmod 3 = 1`$ remainder layer goes to the earliest rank.
2. Why does the Playbook say pipeline parallelism saves no activation memory per GPU?
   - Each stage holds $`1/p`$ of the layers but $`p`$ microbatches are in flight before the first backward, so the layer fraction times the microbatch count leaves activation memory about flat.
3. Why does the tutorial split delete `ModuleDict` entries instead of rebuilding a smaller list?
   - Deleting keeps fully qualified names stable, so checkpoints save and load and FQN-addressed services keep resolving. Reindexing shifts every name.
4. A 12-layer model with `input_weight` 1 and `output_weight` 1 is split over 4 stages. How many transformer layers does each stage hold?
   - 14 effective layers split $`[4, 4, 3, 3]`$, minus the end weights: $`[3, 4, 3, 2]`$, which sums to 12.

</details>

#### U2. Microbatches, the forward and backward dependency graph and divisibility

**About 4 h** · **Target:** Derive

Topics: Microbatch splitting and global batch accounting; Forward and backward dependency graph; Uneven microbatch and divisibility constraints

Microbatches turn a sequential layer stack into a parallel schedule, but only if batch accounting and cross-stage dependencies are exact. Every bubble number and equivalence check later divides by these counts.

**You can now**

- Derive global batch and token counts from microbatch size, microbatch count and data-parallel degree.
- Draw the forward activation and backward gradient edges across stages and place the synchronous update.
- State divisibility constraints and a remainder policy that keeps the loss mean correct.

**Study**

1. [Microbatching and synchronous accumulation](https://arxiv.org/abs/1811.06965) (GPipe: Efficient Training of Giant Neural Networks using Pipeline Parallelism) - Sections 2 and 3 (arXiv:1811.06965v5): splitting each mini-batch of size $`N`$ into $`M`$ equal microbatches, forward and backward dependencies across stages, gradients applied synchronously after accumulating over all $`M`$.
2. [Microbatch constants and divisibility gates](https://github.com/hkproj/torchfeather/blob/c416ab1ad0fd3567a0a6c8ad0da570c8fd6e55aa/minimal_examples/pp_gpipe.py) (TorchFeather - Pipeline Minimal Example and Runtime) - `LOCAL_BATCH_SIZE` 8 with `MICRO_BATCH_SIZE` 2, the `LOCAL_BATCH_SIZE % MICRO_BATCH_SIZE` guard, `inputs.split(MICRO_BATCH_SIZE)`, and each microbatch loss divided by `num_microbatches` before summing.
3. [`grad_acc_steps` as the microbatch count](https://github.com/huggingface/picotron/blob/59714b1bf25541dbeb6f5a721ed15f6d0768e786/train.py) (Picotron - Pipeline Parallelism) - `pp_engine` branch calling the AFAB or 1F1B step with `grad_acc_steps` microbatches, and `MicroBatchDataLoader` with `global_batch_size` equal to microbatch size times `grad_acc_steps` times `dp_world_size`.
4. [Pipelining pseudocode and dependency walk](https://jax-ml.github.io/scaling-book/training) (How to Scale Your Model - Pipeline Parallelism in Chapter 5) - Pipelining section: layer-by-layer forward with device handoffs, loss derivative seeding the backward walk, per-stage input-gradient and weight-gradient computation.

**Focus**

- Global batch is a product: microbatch size times microbatch count times data-parallel degree, and token counts multiply by sequence length on top.
- Forward edges carry activations to the next stage; backward edges carry input gradients to the previous stage; weights never move between stages.
- The synchronous update sits after the last microbatch's gradients accumulate at mini-batch end, which is what makes the pipeline update match a large-batch update.
- Equal microbatches keep every mean exact; a short tail microbatch needs explicit reweighting or padding, never silent averaging.

**Reproduce:** Closed-book, write the global-batch equation and the forward and backward dependency edges for $`p`$ stages and $`m`$ microbatches: which forward output feeds which stage, which gradient flows back, and where the synchronous update sits.

**Traps**

- Reading the microbatch size as the global batch. Multiply by the microbatch count and the data-parallel degree first.
- Letting a short last microbatch keep weight 1 in the loss mean. Size-weight it or pad it, or the update drifts from the oracle.
- Starting backward before microbatch 0 reaches the last stage. The loss seed does not exist until then, so early backward calls have nothing to differentiate.

**Practice**

- [TorchFeather `pp_gpipe.py`: microbatch-count variation with reference check](https://github.com/hkproj/torchfeather/blob/c416ab1ad0fd3567a0a6c8ad0da570c8fd6e55aa/minimal_examples/pp_gpipe.py) - Run the stock 8-rank CPU launch with `MICRO_BATCH_SIZE` 2 and again with 4; both runs must print the GPipe PASS line. Change only the microbatch constant and recompute the expected per-microbatch loss scaling. CPU gloo timings are not interconnect evidence; the reference match is the gate.

**Stop when:** Both microbatch settings print PASS, and you can write the global-batch product and the cross-stage edge directions without notes.

<details>
<summary>Self-test</summary>

1. Microbatch size 2, microbatch count 4, data-parallel degree 4. What is the global batch?
   - $`2 \times 4 \times 4 = 32`$ examples before any sequence-length factor.
2. Where does the synchronous update sit in GPipe, and why does that placement matter?
   - After gradients accumulate over all $`M`$ microbatches at mini-batch end. That placement is what equates one pipelined step with one large-batch synchronous step.
3. What happens on setting `MICRO_BATCH_SIZE` 3 with `LOCAL_BATCH_SIZE` 8 in the TorchFeather example?
   - The divisibility guard raises. Either pad or re-split into equal microbatches, or implement a remainder policy that reweights the loss mean.
4. In the JAX pipelining pseudocode, what is copied between devices on the forward pass and on the backward pass?
   - Forward copies activations to the next device; backward copies the loss derivative with respect to the input to the previous device. Weights stay sharded per device.

</details>

#### U3. Activation and gradient transfer, send and receive protocols and stalled peers

**About 5 h** · **Target:** Implement

Topics: Point-to-point activation and gradient transfer; Tag, shape and ordering protocols for send and receive; Rank failure, stalled peer and timeout diagnosis

Activations move forward and gradients move back over point-to-point links with no collective to hide a mismatch. Tag, shape and order agreements are the contract, and a stalled peer is usually a broken one.

**You can now**

- Send activations forward and gradients backward between two gloo processes with per-microbatch tags and shape assertions.
- Explain tag, shape and ordering agreements and how a mismatch stalls a peer.
- Read a per-rank event trace to name the unmatched send or receive.

**Study**

1. [Tagged microbatch transfers and per-rank schedules](https://github.com/hkproj/torchfeather/blob/c416ab1ad0fd3567a0a6c8ad0da570c8fd6e55aa/minimal_examples/pp_gpipe.py) (TorchFeather - Pipeline Minimal Example and Runtime) - `run_schedule`: `IRECV_FORWARD` and `ISEND_FORWARD` with `FORWARD_TAG_BASE` plus microbatch, `IRECV_BACKWARD` and `ISEND_BACKWARD` with `BACKWARD_TAG_BASE` plus microbatch, wait-before-use ordering, and the printed per-rank schedule.
2. [Raw pipeline communicate calls](https://github.com/huggingface/picotron/blob/59714b1bf25541dbeb6f5a721ed15f6d0768e786/picotron/pipeline_parallel/pp_communications.py) (Picotron - Pipeline Parallelism) - `pipeline_communicate` with `recv_forward`, `send_forward`, `recv_backward` and `send_backward` over `batch_isend_irecv`, `bidirectional_pipeline_communicate` pairing one send with one receive, and the `VERBOSE` step prints.
3. [The pipeline process group](https://docs.pytorch.org/tutorials/intermediate/pipelining_tutorial.html) (PyTorch Pipeline Parallelism Tutorial) - `init_distributed` (page read 2026-10-14): `pp_group` from `dist.new_group` as the send and receive group, `stage_index` equal to rank, `num_stages` equal to world size, with the note that the group can be a subgroup in the N-D parallel case.
4. [Forward and backward handoffs between devices](https://www.youtube.com/watch?v=XoGvCBRnwLs&t=21977s) (First-Principles Video - Pipeline Parallelism Segment) - 06:06:14 to 06:11:12: layer groups per GPU, forward activation handoffs to the next device, and backward upstream-gradient handoffs to the previous device.

**Focus**

- Each transfer is identified by direction plus microbatch: TorchFeather adds the microbatch index to a per-direction tag base so in-flight microbatches cannot match the wrong receive.
- Picotron leans the other way: single ops on the default tag pair up in strict program order, so any rank-specific branch in the op sequence deadlocks the pair.
- Shapes and dtypes are agreed out of band: the receiver allocates the buffer from `tensor_shapes` before the transfer. On gloo a size mismatch aborts the receiving process; on other backends it can hang or corrupt, so assert shapes before the transfer instead of waiting for an error.
- First and last stages skip one direction each: the first stage never receives forward, the last stage never receives backward, and the skip must be in the protocol, not just the compute.

**Reproduce:** Closed-book, write a two-process gloo script where rank 0 sends an activation tensor forward with tag 100 plus microbatch index and rank 1 returns its gradient with tag 200 plus microbatch index, asserting shape and dtype on receipt.

**Traps**

- Reusing one tag for every microbatch and trusting call order. Tag per microbatch as TorchFeather does, or prove every rank runs an identical op sequence as Picotron requires.
- Calling `torch.cuda.synchronize` after a gloo transfer on a CPU-only run. It raises when no GPU is visible (a CPU-only machine or `CUDA_VISIBLE_DEVICES=`), so gate device sync on the backend instead of copying GPU code.
- Posting a blocking send before the peer posts its receive on both ranks at once. Pair each send with a receive through one bidirectional call, or keep the recv-first order on both sides.

**Practice**

- [TorchFeather `pp_gpipe.py` stock run on CPU](https://github.com/hkproj/torchfeather/blob/c416ab1ad0fd3567a0a6c8ad0da570c8fd6e55aa/minimal_examples/pp_gpipe.py) - `torchrun --standalone --nproc-per-node=8 ./minimal_examples/pp_gpipe.py` on CPU with gloo; rank 0 prints the GPipe PASS line and every rank prints its schedule and trace path. Run from the pinned commit with 8 processes. The script pins the gloo backend on CPU, so one GPU or none both work; then break one tag on purpose and read which rank stalls.

**Stop when:** Rank 0 prints PASS, every rank prints its schedule and trace path, your two-process tag script round-trips, and you can name the stalled side of a broken-tag run from its event log.

<details>
<summary>Self-test</summary>

1. Why do TorchFeather tags add the microbatch index to the base instead of using one tag per direction?
   - Several microbatches are in flight at once, so one tag per direction could match a receive with the wrong microbatch's send. Each direction-plus-microbatch pair gets its own tag.
2. Picotron posts single ops with `batch_isend_irecv` and waits immediately. What ordering property does the schedule rely on?
   - Every rank calls the same op sequence, so sends and receives pair in program order on the default tag. Any rank-specific branch breaks the pairing and stalls the peer.
3. A run hangs after changing `FORWARD_TAG_BASE` on one rank only. What is the first check?
   - Tag agreement across peers, then shape and dtype agreement, then a per-rank event log in the TorchFeather schedule-print style to find the unmatched op.
4. Where does the pipeline group come from when pipeline composes with data parallelism?
   - A subgroup over the pipeline ranks, built with `dist.new_group`. Gradient averaging uses the separate replicate group, never the pipeline group.

</details>

#### U4. GPipe fill-drain and 1F1B schedules with their phases

**About 5 h** · **Target:** Derive

Topics: Fill-drain GPipe schedule; One-forward-one-backward schedule; Warmup, steady state and cooldown phases

GPipe and 1F1B are the two schedules every later variant modifies. Their phases decide which tensors are alive when, which is what the bubble and memory derivations price.

**You can now**

- Write the AFAB two-loop schedule and the 1F1B warmup, steady-state and cooldown phases for any rank.
- Derive each stage's warmup count and the FIFO drain order of stored tensors.
- Explain why 1F1B bounds in-flight activations while keeping the same bubble.

**Study**

1. [AFAB schedule and code](https://nanotron-ultrascale-playbook.static.hf.space/index.html#pipeline_parallelism) (Ultra-Scale Playbook - Pipeline Parallelism) - Splitting layers on various nodes - All forward, all backward with FIG.XLVIII and CODE.VII: the all-forward then all-backward loops, loss on the last stage, and the note that plot numbers are microbatches from here on.
2. [1F1B schedule and code](https://nanotron-ultrascale-playbook.static.hf.space/index.html#pipeline_parallelism) (Ultra-Scale Playbook - Pipeline Parallelism) - One forward, one backward and Llama 3.1 schemes with FIG.XLIX and CODE.VIII parts 1 and 2: warmup forwards, steady state alternating one forward and one backward, cooldown backward drain.
3. [AFAB and 1F1B step functions](https://github.com/huggingface/picotron/blob/59714b1bf25541dbeb6f5a721ed15f6d0768e786/picotron/pipeline_parallel/pipeline_parallel.py) (Picotron - Pipeline Parallelism) - `train_step_pipeline_afab` all-forward then all-backward loops with FIFO tensor pops, and `train_step_pipeline_1f1b` with warmup count `min(pp_world_size - pp_rank - 1, grad_acc_steps)`, bidirectional steady-state exchanges and cooldown drain.
4. [AFAB then 1F1B as cumulative diffs](https://github.com/huggingface/picotron_tutorial/tree/master/step7_pipeline_parallel_afab) (Picotron Tutorial - Steps 7 and 8) - `step7_pipeline_parallel_afab` with `pipeline_parallel.py` and `patch_step_7.diff` for the AFAB step, then `step8_pipeline_parallel_1f1b` with its diff for the 1F1B step; read the step-8 diff as the exact AFAB-to-1F1B change.
5. [GPipe grid, 1F1B steady state and activation freeing](https://www.youtube.com/watch?v=XoGvCBRnwLs&t=23212s) (First-Principles Video - Pipeline Parallelism Segment) - 06:26:15 to 06:38:33: GPipe grid inefficiency, 1F1B warmup into alternating steady state, backward costing about twice a forward for matmul-heavy layers, and why 1F1B frees each microbatch's activations earlier.

**Focus**

- AFAB keeps both waves sequential: all $`m`$ forwards complete before any backward starts, so every stage holds all $`m`$ microbatches at the wave boundary.
- 1F1B starts each microbatch's backward as soon as its loss exists, which alternates one forward with one backward in steady state and frees activations stage by stage.
- Warmup on rank $`r`$ of $`p`$ stages is $`\min(p - 1 - r, m)`$: the last stage warms up zero forwards and the first stage warms up the most.
- Stored tensors drain first-in first-out: the oldest forward pairs with the incoming gradient, and the cooldown loop exists only to finish the warmup leftovers.

**Reproduce:** Closed-book, draw the 1F1B event grid for 3 stages and 4 microbatches: mark warmup, steady state and cooldown on each stage and count each stage's forwards and backwards.

**Traps**

- Expecting 1F1B to shrink the bubble at fixed microbatch count. The bubble is the same size as AFAB; the win is bounded activation memory that permits more microbatches.
- Starting steady state before microbatch 0 reaches the last stage. No loss exists yet, so early backward calls have no seed gradient.
- Forgetting the cooldown. Warmup forwards leave stored tensors behind, and their backward passes still have to run after the last steady-state step.

**Practice**

- [PyTorch pipelining tutorial: GPipe versus 1F1B](https://docs.pytorch.org/tutorials/intermediate/pipelining_tutorial.html) - Swap `ScheduleGPipe` for `Schedule1F1B` in the Step 2 script and run both under `torchrun --nnodes 1 --nproc_per_node 2`; compare the rank-1 `losses` lists. Keep the 8-layer split and 4 microbatches fixed. The gate is matching losses across schedules, not timing.

**Stop when:** Both schedules print equal rank-1 losses, and you can write any rank's warmup, steady-state and cooldown counts without notes.

<details>
<summary>Self-test</summary>

1. A run has 4 stages and 8 microbatches. How many warmup forwards does each rank do?
   - $`\min(3 - r, 8)`$: ranks 0 to 3 do 3, 2, 1 and 0 warmup forwards.
2. Why does the video draw backward blocks about twice as wide as forward blocks?
   - A matmul backward needs two matmuls, one for the input gradient and one for the weight gradient, so it costs about twice one forward matmul.
3. What work remains after the last 1F1B steady-state iteration on a rank with nonzero warmup?
   - One backward per warmup forward, drained oldest-first from the stored tensors: the cooldown phase.
4. In the step-8 tutorial diff, what is the structural change from AFAB to 1F1B?
   - The single all-backward loop becomes warmup forwards, an alternating forward-backward steady state with paired exchanges, and a cooldown drain of the leftover stored tensors.

</details>

#### U5. The pipeline bubble and activation lifetime under GPipe and 1F1B

**About 4 h** · **Target:** Derive

Topics: Pipeline bubble derivation; Activation lifetime under GPipe and 1F1B

The bubble decides whether more stages buy speed, and activation lifetime decides whether the schedule fits in memory. Both come from one slot count.

**You can now**

- Derive bubble fraction, utilization and makespan for fill-drain schedules from the $`T = m + p - 1`$ slot model.
- Contrast GPipe and 1F1B activation lifetimes and state each schedule's peak stashed count.
- Predict how utilization moves with stage and microbatch counts before measuring.

**Study**

1. [Naive bubble, AFAB estimate and the 1F1B memory note](https://nanotron-ultrascale-playbook.static.hf.space/index.html#pipeline_parallelism) (Ultra-Scale Playbook - Pipeline Parallelism) - Pipeline Parallelism naive bubble with FIG.XLVII, the AFAB estimate pages with FIG.XLVIII, and the 1F1B note that stashed activations drop from $`m`$ to $`p`$ microbatches while the bubble stays the same size.
2. [1F1B activation bound](https://arxiv.org/abs/2006.09503) (Memory-Efficient Pipeline-Parallel DNN Training) - Sections 2 and 3 (arXiv:2006.09503v3): 1F1B steady state with at most $`p`$ microbatches in flight and no weight stashing in the Flush variant, contrasted with GPipe holding all $`m`$.
3. [Bubble figures and transfer on the critical path](https://jax-ml.github.io/scaling-book/gpus) (How to Scale Your Model - Pipeline Parallelism in Chapter 5) - Pipeline Parallelism section: the 2-stage 2-microbatch bubble figure with data-parallel AllReduces marked, and the transfer-cost figure shifting stages on the critical path.

**Focus**

- One wave lasts $`T = m + p - 1`$ slots: utilization is $`m / (m + p - 1)`$ and the idle fraction is $`(p - 1) / (m + p - 1)`$, for either wave direction.
- The book's $`(p - 1) / m`$ is bubble over ideal compute, an upper bound that exceeds 1 when $`m < p - 1`$; use the slot fraction when you need a fraction of total time.
- GPipe stashes $`m`$ microbatches per stage at the wave boundary; 1F1B keeps at most warmup plus one live per stage, so at most $`p`$ on the first stage and 1 on the last.
- Backward costing twice forward scales bubble and total together, so the fraction is unchanged under equal stage costs; unequal stages need the critical-stage derivation instead.

**Reproduce:** Closed-book, derive idle fraction $`(p - 1) / (m + p - 1)`$ and utilization $`m / (m + p - 1)`$ for $`p`$ stages and $`m`$ microbatches, and hand-write the forward schedule for $`p = 2`$, $`m = 3`$ with cells placed by $`i = t - s`$.

**Traps**

- Quoting $`(p - 1) / m`$ as the idle fraction. It is bubble over ideal compute; the idle fraction of total slots is $`(p - 1) / (m + p - 1)`$.
- Assuming 1F1B wastes less compute than AFAB at fixed $`m`$. Same bubble; the memory bound is what lets $`m`$ grow.
- Treating the TensorTonic two-wave model as 1F1B. Its backward wave starts only after the forward wave completes, which is the AFAB shape, not interleaved steady state.

**Practice**

- [TensorTonic: Measure Pipeline Bubble Utilization](https://www.tensortonic.com/problems/cs336-l08-pipeline-bubble-utilization) - Implement `pipeline_bubble_utilization(num_stages, num_microbatches, include_backward)` returning `schedule`, `bubble_slots`, `total_slots` and `utilization`; pass all public cases. Derive answers from the slot model before running: the checker compares exact schedule cells, idle counts and the float ratio.

**Stop when:** The TensorTonic cases pass and you can derive utilization, idle fraction and both peak counts for any small $`p`$ and $`m`$ without notes.

<details>
<summary>Self-test</summary>

1. A run has 4 stages and 8 microbatches. What are the utilization and the idle fraction?
   - Utilization $`8 / 11 \approx 0.73`$, idle fraction $`3 / 11 \approx 0.27`$.
2. What is each schedule's peak stashed activation count per stage?
   - GPipe holds all $`m`$ microbatches at the wave boundary. 1F1B holds at most warmup plus one live per stage, peaking at $`p`$ on the first stage.
3. Backward costs twice forward on every stage. Does the bubble fraction change?
   - No. Both bubble and total scale by the same forward-plus-backward factor, so the fraction stays $`(p - 1) / (m + p - 1)`$ under equal stage costs.
4. Two stages, two microbatches, forward plus backward waves. What are total slots, bubble slots and utilization?
   - Total 12, bubble 4, utilization $`8 / 12 \approx 0.67`$: each $`T = 3`$ wave has 2 useful cells per slot-row pattern giving 8 useful of 12.

</details>

#### U6. Interleaved virtual stages and zero-bubble and dual-pipeline schedules

**About 4 h** · **Target:** Derive

Topics: Interleaved virtual pipeline stages; Zero-bubble and dual-pipeline schedule vocabulary

Interleaved and zero-bubble schedules are the vocabulary production stacks speak. This unit teaches reading them and pricing them, not building them.

**You can now**

- Explain virtual stages, the bubble-versus-communication trade and depth-first versus breadth-first priority.
- Explain the input-gradient versus weight-gradient backward split and what a zero-bubble schedule reschedules.
- Name each PyTorch multi-stage schedule class and its preconditions.

**Study**

1. [Interleaved stages](https://nanotron-ultrascale-playbook.static.hf.space/index.html#pipeline_parallelism) (Ultra-Scale Playbook - Pipeline Parallelism) - Interleaving stages with FIG.LI and FIG.LII: chunks per GPU dividing pass time by $`v`$, communication growing by $`v`$, depth-first versus breadth-first priority, and the Llama 3.1 schedule in FIG.LIII.
2. [Zero bubble and DualPipe sketch](https://nanotron-ultrascale-playbook.static.hf.space/index.html#pipeline_parallelism) (Ultra-Scale Playbook - Pipeline Parallelism) - Zero bubble and DualPipe with FIG.LIV and FIG.LV: splitting backward into input-gradient and weight-gradient parts and scheduling weight gradients after their input gradients to fill bubbles. Depth: Stop at the integer-programming paragraph. Handcrafted and solved schedules are vocabulary here; implementation stays depth work.
3. [Split backprop and handcrafted schedules](https://arxiv.org/abs/2401.10241) (Zero Bubble Pipeline Parallelism) - Abstract and Sections 1 to 4 (arXiv:2401.10241v1): the input-gradient versus parameter-gradient split, the handcrafted ZB-H1 and ZB-H2 schedules, the automatically searched ZB-1P schedule behind `ScheduleInterleavedZeroBubble`, and the Section 4 optimizer-step sync bypass needed for true zero bubble; read for vocabulary, not for a build.
4. [Multi-stage schedule reference](https://docs.pytorch.org/docs/2.14/distributed.pipelining.html) (PyTorch Pipeline Parallelism Tutorial) - Pipeline Schedules (page read 2026-10-14): `ScheduleInterleaved1F1B` depth-first, `ScheduleLoopedBFS` breadth-first, `ScheduleInterleavedZeroBubble` as ZB1P, `ScheduleZBVZeroBubble` needing exactly two stages per rank with zero bubble only when forward, input-backward and weight-backward times match, and `ScheduleDualPipeV`. Depth: Names and preconditions only. Constructing multi-stage runs needs more than two stages and stays an extension of the simulator unit.
5. [Looped layout and the zero-bubble intro](https://www.youtube.com/watch?v=XoGvCBRnwLs&t=23934s) (First-Principles Video - Pipeline Parallelism Segment) - 06:38:54 for the interleaved looped layout with earlier flush and the hop-count cost, and 06:47:59 for the zero-bubble input-gradient versus weight-gradient split intro.

**Focus**

- Virtual stages cut each device's passes into $`v`$ chunks: the bubble shrinks by about $`v`$ while each microbatch crosses about $`v`$ times more stage boundaries.
- Only the input gradient sits on the critical path to earlier stages; the weight gradient waits only for its own input gradient plus the optimizer step, so it fills idle slots.
- Depth-first serves earlier microbatches through later stages first; breadth-first serves earlier stages with all ready microbatches first.
- Zero bubble is conditional: matched op times, enough microbatches, and bypassed optimizer-step sync all have to hold at once.

**Reproduce:** Closed-book, sketch how $`v = 2`$ virtual stages per GPU cut the bubble while raising hop count on 4 GPUs, and state the three conditions zero-bubble-class schedules need: the gradient split, matched op times, and optimizer-sync handling.

**Traps**

- Calling any interleaved run zero-bubble. Interleaving shrinks the bubble by about $`v`$ but keeps one; zero needs the gradient split plus the sync bypass.
- Ignoring the extra communication. Each microbatch crosses more stage boundaries, so slow links can eat the schedule win.
- Expecting ZBV zero bubble on real layers. It needs forward, input-backward and weight-backward times equal, which real models rarely satisfy.

**Practice**

- The section mini-project covers this: one interleaved-schedule extension in the validated simulator with bubble and memory deltas.

**Stop when:** You can price any named schedule's bubble, memory and preconditions from its class name and state which two conditions fail first on real layers.

<details>
<summary>Self-test</summary>

1. Two chunks per GPU: what happens to the bubble and to point-to-point volume?
   - The bubble shrinks by about a factor of 2 while P2P volume roughly doubles, since each microbatch crosses twice as many stage boundaries.
2. What does the weight gradient wait for, and what does the input gradient unblock?
   - The weight gradient waits only for its own input gradient and the optimizer step. The input gradient unblocks the previous stage, so it stays on the critical path while weight gradients fill idle slots.
3. How do Interleaved 1F1B and Looped BFS differ when several microbatches are ready?
   - Interleaved 1F1B is depth-first: it prioritizes earlier microbatches through later stages. Looped BFS is breadth-first: it prioritizes earlier stages and runs all ready microbatches there.
4. What are the ZBV schedule's preconditions?
   - Exactly two stages per rank, and the zero-bubble property only when forward, input-backward and weight-backward times match.

</details>

#### U7. A validated pipeline schedule event simulator

**About 4 h** · **Target:** Implement

Topics: Schedule event simulation and validation

A simulator turns schedule arguments into checkable traces. It is the oracle the section checkpoint asks for: valid GPipe and 1F1B traces with predicted bubbles and peaks.

**You can now**

- Implement a deterministic event simulator for GPipe and 1F1B with timeline and per-stage live-activation state.
- Validate traces against dependency, order and peak-live checks plus hand traces for small stage and microbatch counts.
- Emit failure-injection cases with wrong order, short microbatches and stalled peers that the validator rejects.

**Study**

1. [Fill-drain specification](https://arxiv.org/abs/1811.06965) (GPipe: Efficient Training of Giant Neural Networks using Pipeline Parallelism) - Sections 2 and 3 (arXiv:1811.06965v5) as the fill-drain specification the simulator reproduces: $`M`$ equal microbatches, simultaneous work on different microbatches, synchronous apply at mini-batch end.
2. [AFAB and 1F1B as event-order oracles](https://github.com/huggingface/picotron/blob/59714b1bf25541dbeb6f5a721ed15f6d0768e786/picotron/pipeline_parallel/pipeline_parallel.py) (Picotron - Pipeline Parallelism) - `train_step_pipeline_afab` and `train_step_pipeline_1f1b` as event-order oracles: FIFO tensor pops, the warmup formula, bidirectional steady-state exchanges, and the cooldown drain.
3. [Action tables as the trace format](https://github.com/hkproj/torchfeather/blob/c416ab1ad0fd3567a0a6c8ad0da570c8fd6e55aa/minimal_examples/pp_gpipe.py) (TorchFeather - Pipeline Minimal Example and Runtime) - `build_stage_zero_schedule` and `build_stage_one_schedule` action tables with `ActionKind` events and `format_schedule` prints as the trace format to match, including the empty-schedule guard.
4. [Schedule cell representation](https://www.tensortonic.com/problems/cs336-l08-pipeline-bubble-utilization) (TensorTonic - Pipeline Bubble Utilization) - Time-ordered stage-ordered lists with forward, backward and idle cells as the interchange format for traces.
5. [Scheduler contract from the subsystem project](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-3/distributed-training-subsystem.md) (Distributed Training Subsystem - Pipeline Scheduler) - Milestones B, D and E: per-rank event trace (B), failure-injection cases (D), and bubble and activation-peak prediction versus measurement (E); keep the simulator runnable without GPUs.

**Focus**

- Events are timestamped stage ops with explicit dependencies: a forward needs the previous stage's forward for its microbatch, a backward needs its own forward plus the next stage's backward.
- Live-activation state is part of the trace: each stored forward increments the count, each consumed backward decrements it, and the peak per stage is checked against $`m`$ for GPipe and $`p`$ for 1F1B.
- Validation is three checks on every trace: dependencies completed, each microbatch's backward after its forward on every stage, and no stage running two ops at once.
- Failure cases are first-class outputs: wrong order, short microbatch and stalled peer must each fail validation with a named cause, not a silent wrong trace.

**Reproduce:** Closed-book, write the event rules that generate valid GPipe and 1F1B traces for $`p`$ stages and $`m`$ microbatches, and the three validation checks with the peak-live bounds $`m`$ for GPipe and at most $`p`$ for 1F1B.

**Traps**

- Validating only the happy path. Inject wrong order, short microbatches and stalled peers, and require the validator to reject each by name.
- Reporting simulator makespans as hardware predictions. Unit-cost traces prove schedule validity, not GPU step time.
- Accepting degenerate inputs. Mirror the TorchFeather guards: reject empty microbatch counts and warn when microbatches undercount stages.

**Practice**

- The section mini-project covers this: the validated GPipe and 1F1B event simulator with trace output, activation accounting and failure-injection cases.

**Stop when:** Hand traces for small stage and microbatch counts match simulator output cell for cell, and all three injected failures fail validation by name.

<details>
<summary>Self-test</summary>

1. What three checks validate a trace?
   - Every op's dependencies completed first; each microbatch's backward comes after its forward on every stage; no stage runs two ops at once.
2. GPipe with 3 stages and 5 microbatches at unit forward and backward cost: what makespan and peak live count does the simulator predict?
   - Each wave lasts $`5 + 3 - 1 = 7`$ slots for a makespan of 14, and each stage peaks at 5 live microbatches at the wave boundary.
3. 1F1B with 3 stages and 5 microbatches: what warmup counts and peak live counts apply?
   - Warmup forwards $`[2, 1, 0]`$ by rank, and each stage peaks at warmup plus one live, at most 3 on the first stage.
4. Why keep the simulator deterministic and CPU-only?
   - Schedule validity is a discrete property of event order, so determinism makes traces diffable. Hardware timing belongs to the trade-offs unit with a stated topology.

</details>

#### U8. Stage-local ownership, final-stage loss and tied embeddings

**About 4 h** · **Target:** Implement

Topics: Stage-local parameter and optimizer ownership; Loss computation and final-stage semantics; Tied embeddings across first and last stages

Ownership decides what each rank saves, optimizes and differentiates. Loss placement and gradient scaling decide whether pipeline gradients mean the same thing as single-process ones.

**You can now**

- Assign parameters, loss computation and optimizer state to stages for embedding-first, output-last splits.
- Correct microbatch gradient scaling so pipeline updates match a single-process oracle.
- State the tied-weight contract across first and last stages.

**Study**

1. [Stage-local parameters and last-stage loss](https://github.com/huggingface/picotron/blob/59714b1bf25541dbeb6f5a721ed15f6d0768e786/picotron/pipeline_parallel/pipeline_parallel.py) (Picotron - Pipeline Parallelism) - `PipelineParallel` init owning `embedding` on the first stage and `final_norm` plus `final_proj` on the last, per-microbatch mean `cross_entropy` on the last stage only, and `logging_loss` averaged over `grad_acc_steps`; note the backward loss is not divided, so accumulated gradients sum microbatch means.
2. [Split ownership and last-stage loss contract](https://docs.pytorch.org/tutorials/intermediate/pipelining_tutorial.html) (PyTorch Pipeline Parallelism Tutorial) - Step 1 manual split (page read 2026-10-14): `tok_embeddings` with stage 0 and `norm` plus `output` with stage 1; Step 2 `tokenwise_loss_fn` with the `losses` list filled on the last stage through `step(target=y, losses=losses)`.
3. [Reference loss and gradient averaging](https://github.com/hkproj/torchfeather/blob/c416ab1ad0fd3567a0a6c8ad0da570c8fd6e55aa/minimal_examples/pp_gpipe.py) (TorchFeather - Pipeline Minimal Example and Runtime) - `run_reference` full-model loss versus summed per-microbatch losses each divided by `num_microbatches`, and `average_gradients` all-reducing over the `dp_replicate` group.

**Focus**

- Token IDs enter as a batch of sequences and leave as vectors per the embeddings-and-positions unit; the first stage owns that lookup and the last stage owns the projection back to vocabulary.
- Only the last stage holds logits, so `loss_fn`, targets and the per-microbatch `losses` list all belong there; other stages receive gradients, never targets.
- Accumulated microbatch-mean gradients sum to $`m`$ times the global-batch mean: divide by $`m`$ or scale the learning rate before comparing with a single-process oracle.
- Tied weights live on two stages at once: Picotron sidesteps this by not tying, and any tied design must sync gradients across the first and last stage before the optimizer step.

**Reproduce:** Closed-book, write which rank owns parameters, loss and optimizer state for a 2-stage run, and the gradient-scale correction that makes accumulated microbatch-mean gradients equal the global-batch mean.

**Traps**

- Comparing Picotron updates directly with a same-learning-rate single-process run. Per-microbatch mean losses sum to $`m`$ times the global mean, so divide by $`m`$ first or read a scaling difference as a pipeline bug.
- Splitting a tied embedding and output projection by copying the weight to two stages. The copies drift after step one unless gradients sync across both stages every step.
- Computing loss off the last stage. Only the last stage holds logits, so the loss function and the losses list belong there.

**Practice**

- [PyTorch pipelining tutorial: single-process output equivalence](https://docs.pytorch.org/tutorials/intermediate/pipelining_tutorial.html) - Compare the rank-1 merged output and `losses` against the same 8-layer model run on one process with dropout off (call `eval()` on both copies: the tutorial's decoder layers keep the default dropout of 0.1); gate on forward match within 1e-5 and equal per-microbatch losses. Run on CPU. In a measured example with 2 CPU processes on gloo and PyTorch 2.14.1, an equivalent probe matched forwards within 1e-5; your transformer numbers will differ, and the match is the gate, not the values.

**Stop when:** Pipeline outputs match the single-process run within 1e-5 with the scaling correction stated, and you can place parameters, loss and tied weights on a stage diagram from memory.

<details>
<summary>Self-test</summary>

1. Four microbatches with per-microbatch mean losses accumulate gradients. What factor separates the sum from the global-batch mean gradient?
   - 4. Each backward adds one full mean gradient, so the accumulated sum is $`m`$ times the mean for $`m`$ equal microbatches.
2. How do TorchFeather and PyTorch `scale_grads=True` avoid that factor?
   - TorchFeather divides each microbatch loss by the microbatch count before summing. `scale_grads=True` divides accumulated gradients by `n_microbatches`, which matches an averaging loss function.
3. A tied embedding weight sits on stages 0 and 3 with independent optimizers. What breaks?
   - Each stage updates its copy from its own gradient slice, so the copies diverge after the first step. Sync the gradients, or share the storage, before updating.
4. Why must `ModuleDict` names survive the split?
   - Checkpoint keys and fully-qualified-name services such as FSDP or tensor parallelism resolve by name; renaming breaks save and load.

</details>

#### U9. Recompute inside stages and pipeline groups combined with DP or TP

**About 4 h** · **Target:** Explain + Implement

Topics: Activation checkpointing within stages; Pipeline groups combined with data or tensor groups

Stages compose: recompute trades memory inside a stage, and data parallelism replicates stages across groups. Both change what the backward communicates, so both need oracle checks.

**You can now**

- Apply activation checkpointing inside a stage and state the alive-versus-recomputed contract.
- Build pipeline-by-data group membership and place gradient averaging on the replicate group.
- Explain the ZeRO-1 versus ZeRO-3 pairing choice under microbatching.

**Study**

1. [Re-materialization design](https://arxiv.org/abs/1811.06965) (GPipe: Efficient Training of Giant Neural Networks using Pipeline Parallelism) - Section 3 (arXiv:1811.06965v5): re-materialization recomputing forward activations in the backward pass to trade compute for memory; pair with the activation-lifetime numbers from the bubble unit.
2. [Selective and full checkpoint policies](https://github.com/hkproj/torchfeather/blob/c416ab1ad0fd3567a0a6c8ad0da570c8fd6e55aa/torchfeather/distributed/activation_checkpoint.py) (TorchFeather - Pipeline Minimal Example and Runtime) - `apply_ac` with the selective custom policy and `_apply_full_ac` per transformer block as the policy menu for checkpointing inside stages.
3. [Pipeline stages composed with other parallelism](https://github.com/hkproj/torchfeather/blob/c416ab1ad0fd3567a0a6c8ad0da570c8fd6e55aa/torchfeather/distributed/pipeline_parallel.py) (TorchFeather - Pipeline Minimal Example and Runtime) - `pipeline_llm`: stages per rank from the schedule class, per-part `parallelize_fn` applying tensor or data parallelism inside each pipeline group, and `build_pipeline_schedule` warning when microbatches undercount stages.
4. [Composability contract](https://docs.pytorch.org/docs/2.14/distributed.pipelining.html) (PyTorch Pipeline Parallelism Tutorial) - What is `torch.distributed.pipelining` (page read 2026-10-14): composability with DDP, FSDP and tensor parallelism with the TorchTitan 3D reference, and the `PipelineStage` group argument carrying the pipeline subgroup.
5. [Pipeline plus sharding pairing costs](https://jax-ml.github.io/scaling-book/gpus) (How to Scale Your Model - Pipeline Parallelism in Chapter 5) - Pipeline Parallelism item (2), Pipelining makes data parallelism and FSDP hard: per-microbatch weight all-gathers and delayed gradient reduction as the composition costs, with ZeRO-1 style replication as the workable pairing.

**Focus**

- Checkpoint regions must sit inside one stage: only the region inputs stay alive and the rest recomputes, following the activation-checkpointing unit's contract.
- Pipeline groups move activations while replicate groups average gradients: same-stage ranks across data coordinates form the averaging group, and pipeline peers never average each other's parameters.
- Microbatching shrinks the compute that amortizes a ZeRO-3 all-gather to one microbatch share, which is why replication-style ZeRO-1 pairs better with pipelines.
- Picotron holds data-parallel sync until the last microbatch's backward through `require_backward_grad_sync`; syncing every microbatch would pay a full all-reduce per microbatch.

**Reproduce:** Closed-book, state what stays alive and what recomputes when one stage is checkpointed, and draw pipeline-by-data group membership for 8 processes with pipeline degree 2 and data degree 4, marking which group averages gradients.

**Traps**

- Checkpointing across a stage boundary. The recompute region must sit inside one stage, or the backward needs activations from another rank.
- Composing pipeline with ZeRO-3 naively. Per-microbatch all-gathers amortize over a microbatch share of the batch, so prefer replication inside pipeline groups.
- Forgetting RNG determinism under recompute. State the seed-preservation policy from the activation-checkpointing unit, or dropout diverges between the two passes.

**Practice**

- The section mini-project covers this: recompute inside one owned stage with equivalence checks, and a pipeline-by-data group composition test against a single-process oracle.

**Stop when:** You can draw the group grid, place the averaging call, and state the alive set of a checkpointed stage without notes.

<details>
<summary>Self-test</summary>

1. What stays alive when one pipeline stage is checkpointed with `torch.utils.checkpoint`?
   - Only the region inputs. Region outputs and intermediates recompute in the backward pass, and the recompute region must not cross a stage boundary.
2. Eight processes run pipeline degree 2 by data degree 4. Which ranks average gradients together?
   - Same-stage ranks across data coordinates, in the replicate group. Pipeline peers hold different parameters and never average each other.
3. Why does ZeRO-3 pair badly with pipelines while ZeRO-1 pairs well?
   - ZeRO-3 all-gathers weights per microbatch while compute per microbatch shrinks to a batch share. ZeRO-1 replicates parameters and shards only optimizer state, so no per-microbatch gather sits on the critical path.
4. Why does Picotron set `require_backward_grad_sync` false during 1F1B steady state?
   - Data-parallel sync waits for the last microbatch's backward. Syncing every microbatch would pay a full gradient all-reduce per microbatch instead of once per step.

</details>

#### U10. Throughput, latency and memory trade-offs across schedules

**About 3 h** · **Target:** Measure

Topics: Throughput, latency and memory trade-offs across schedules

Throughput, latency and memory pull in different directions across schedules. This unit turns the section's derivations into a measurement discipline with stated setups.

**You can now**

- Measure bubble, memory, transfer and step time across stages, microbatch counts and schedules on a stated setup.
- Explain why a smaller theoretical bubble can leave measured throughput flat.
- Keep analytical predictions and measured results distinct with residuals stated.

**Study**

1. [Throughput scaling with microbatch count](https://nanotron-ultrascale-playbook.static.hf.space/index.html#pipeline_parallelism) (Ultra-Scale Playbook - Pipeline Parallelism) - Throughput scaling pages with FIG.L: microbatches at or below pipeline degree minus one hurt and fall with more stages, many more microbatches help low degrees, and the target global batch size caps the ratio; the plotted numbers are the authors' cluster results, read them as method.
2. [Cluster recipes with pipeline degrees](https://jax-ml.github.io/scaling-book/gpus) (How to Scale Your Model - Pipeline Parallelism in Chapter 5) - Pipeline Parallelism examples: 16-way pipeline with 2-way ZeRO-1 data parallelism, and 8-way tensor plus 16-way pipeline plus 128-way ZeRO-1 data parallelism, as cited cluster recipes with stated batch sizes.
3. [What the 20x claim compares](https://arxiv.org/abs/2006.09503) (Memory-Efficient Pipeline-Parallel DNN Training) - Abstract and Section 5 (arXiv:2006.09503v3): the up-to-20x figure is against non-pipelined model-parallel baselines (tensor model parallelism and inter-layer model parallelism) on up to 64 16-GB V100s, not a schedule-versus-schedule speedup; against GPipe the gain is up to 3.2x.
4. [Measurement contract from the subsystem project](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-3/distributed-training-subsystem.md) (Distributed Training Subsystem - Pipeline Scheduler) - Milestone E: predict versus measure bubbles and imbalance, compare candidate layouts on the available tier, and keep analytical and measured results distinct.

**Focus**

- Vary one thing at a time: stages, microbatch count, schedule or recompute, while the global batch, dtype and backend stay fixed and equivalence still passes.
- Report the full row per configuration: predicted bubble, peak live activations, transfer bytes, measured step time, and the equivalence result with its tolerance.
- Name the setup on every number: hardware, PyTorch version, backend, world size, stage and microbatch counts, schedule and settings.
- CPU gloo timings bound nothing about GPU links: they check schedule logic and equivalence, never interconnect behavior.

**Reproduce:** Closed-book, write the measurement table for one schedule comparison with bubble, peak live activations, transfer bytes, step time and equivalence columns, and list the setup each entry needs.

**Traps**

- Reporting CPU gloo step times as interconnect evidence. They say nothing about NVLink or InfiniBand behavior.
- Quoting paper or Playbook speedups as expected learner results. They are author-cluster numbers under fixed recipes.
- Tuning the microbatch count on the simulator and skipping the equivalence gate. A faster schedule with wrong gradients is a bug, not a trade-off.

**Practice**

- The section mini-project covers this: bubble, memory, transfer and step-time measurements across stages, microbatch counts and schedules with equivalence kept.

**Stop when:** Your table fills one full comparison with setups stated, residuals explained, and equivalence passing on every row.

<details>
<summary>Self-test</summary>

1. Microbatches at or below pipeline degree minus one: what does the scaling plot show, and why?
   - Low throughput that falls as stages grow. Too few microbatches leave the pipe mostly bubble, so extra stages add idle time without useful work.
2. What caps the microbatch count in practice?
   - The target global batch size: microbatch size times microbatch count times data-parallel degree is fixed by the recipe.
3. A smaller theoretical bubble leaves measured throughput flat. What are the first three suspects?
   - Point-to-point transfer sitting on the critical path, small-kernel launch overhead, and host or data starvation stalling the first stage.
4. What must every measurement entry name?
   - Hardware, PyTorch version, backend, world size, stage and microbatch counts, schedule, dtype and settings. Measured numbers are labeled examples, never targets.

</details>

### Mini-project: Pipeline schedules with validated simulation and measured trade-offs

**About 10 to 14 hours.** Build pipeline stages and microbatch flow in `trainlab`, validate fill-drain and one-forward-one-backward schedules in an event simulator, and measure schedule trade-offs with equivalence kept. Stalled peers, recompute and group composition turn schedule sketches into runnable evidence.

1. Partition an ordered layer stack into stages with embedding-first and output-last ownership in `parallel/`, splitting batches into equal microbatches with a stated remainder policy. Anchor the map with the PyTorch pipelining tutorial splits and the TorchFeather microbatch variation, keeping output equality as the gate.
2. Send activations forward and gradients backward between processes over the Gloo backend with per-microbatch tags and shape assertions, reading stalled peers from event traces. Execute fill-drain and one-forward-one-backward schedules over the pairs, matching losses across schedules as the PyTorch tutorial and TorchFeather run do.
3. Derive bubble and lifetime predictions for each schedule from the model, and pass the TensorTonic bubble-utilization cases. Encode the schedules as an event simulator in `parallel/` with trace output, live-activation accounting and named rejection of wrong order, short microbatches and stalled peers.
4. Extend the validated simulator with one interleaved-schedule variant, keeping bubble and memory deltas against the baseline. Place parameters, loss and optimizer state by stage with final-stage loss and a stated tied-weight contract, proving update equivalence against the `model/` oracle with the microbatch-mean scaling correction.
5. Checkpoint one stage with recompute equivalence checks, and compose pipeline groups with data groups with gradient averaging on the replicate group against the `model/` oracle. Measure bubble, memory, transfer and step time across configurations in `trace/`, keeping equivalence passing and predictions distinct from measurements.

**Deliverables**

- The `parallel/` stages, microbatch flow and validated schedule simulator with traces.
- Stage ownership, recompute and group-composition proofs against the single-process oracle.
- `trace/` and `reports/` with bubble, memory, transfer and step-time comparisons and residuals.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [PyTorch pipelining tutorial](https://docs.pytorch.org/tutorials/intermediate/pipelining_tutorial.html). Run both splits and both schedules; gate on matching losses.
- external-tests: [TorchFeather pipeline GPipe example](https://github.com/hkproj/torchfeather/blob/c416ab1ad0fd3567a0a6c8ad0da570c8fd6e55aa/minimal_examples/pp_gpipe.py). Run the stock comparison; vary only the microbatch setting.
- external-tests: [TensorTonic: Measure Pipeline Bubble Utilization](https://www.tensortonic.com/problems/cs336-l08-pipeline-bubble-utilization). Derive answers from the slot model before running the checker.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Schedule validity | Hand traces match simulator cells, and wrong order, short microbatches and stalled peers fail by name. | The interleaved extension replays with bubble and memory deltas attributed to schedule changes. |
| Transfer and stall reading | Tagged transfers round-trip with shape agreement, and event logs name the unmatched side. | A broken-tag run is diagnosed from the trace without rerunning with extra logging. |
| Ownership and equivalence | Stage state placement is drawn from memory, and updates match the oracle after scaling correction. | Recompute and group composition keep equivalence, with the averaging group named correctly. |
| Measurement honesty | Every row states its setup, keeps equivalence passing and separates prediction from measurement. | Residuals name the bottleneck, and one regime where the smaller bubble does not win is kept. |

Feeds into: The simulator, stage map, ownership proofs and trade-off tables feed composed planning, checkpointing and the capstone.

### Resource route

- **Primary - Theory:** [Ultra-Scale Playbook - Pipeline Parallelism](https://nanotron-ultrascale-playbook.static.hf.space/index.html#pipeline_parallelism) - Read Pipeline Parallelism through All forward, all backward, One forward, one backward, Interleaving stages and Zero bubble and DualPipe. Derive bubble fraction and peak activation count for your simulator before running any schedule.
- **Required - Implementation:** [Picotron - Pipeline Parallelism](https://github.com/huggingface/picotron) - Read pipeline_parallel/pipeline_parallel.py and pp_communications.py beside the pipeline branch in train.py. Build a schedule event simulator first, then reproduce GPipe and 1F1B with shape, tag and ordering assertions.
- **Support - Course:** [Picotron Tutorial - Steps 7 and 8](https://github.com/huggingface/picotron_tutorial) - Read `step7_pipeline_parallel_afab` and `step8_pipeline_parallel_1f1b` with their diffs; the video series stops before pipeline parallelism.
- **Required - Lab:** [TorchFeather - Pipeline Minimal Example and Runtime](https://github.com/hkproj/torchfeather) - Run `minimal_examples/pp_gpipe.py` with 8 Gloo processes on CPU (two stages by four replicas); it checks outputs and averaged gradients against a reference. Read its tagged `isend` and `irecv` calls, then `distributed/pipeline_parallel.py`, and compare the event order with Picotron.
- **Support - Course:** [First-Principles Video - Pipeline Parallelism Segment](https://www.youtube.com/watch?v=XoGvCBRnwLs&t=21977s) - Watch 06:06:17 for pipeline parallelism and 06:26:52 for GPipe, 1F1B and zero-bubble schedules. Stop after GPipe and 1F1B to draw and test those event traces; zero-bubble implementation remains depth work.
- **Required - Lab:** [PyTorch Pipeline Parallelism Tutorial](https://docs.pytorch.org/tutorials/intermediate/pipelining_tutorial.html) - Complete the tutorial and compare `ScheduleGPipe` and `Schedule1F1B`, then read https://docs.pytorch.org/docs/2.14/distributed.pipelining.html for the interleaved, looped, zero-bubble and DualPipeV schedules the tutorial omits. Preserve the model split, microbatch and loss contracts before adapting it.
- **Support - Theory:** [How to Scale Your Model - Pipeline Parallelism in Chapter 5](https://jax-ml.github.io/scaling-book/training) - Work the pipeline bubble and communication examples in Chapter 5. Use them to test your cost model under different stage counts, microbatch counts and imbalanced layers.
- **Support - Paper:** [GPipe: Efficient Training of Giant Neural Networks using Pipeline Parallelism](https://arxiv.org/abs/1811.06965) - Read the partitioning, microbatching and re-materialization design and the bubble overhead statement. Use it as the fill-drain specification your simulator reproduces.
- **Support - Paper:** [Memory-Efficient Pipeline-Parallel DNN Training](https://arxiv.org/abs/2006.09503) - Read the PipeDream-Flush (1F1B) schedule and its activation-memory bound. Compare its stashed-activation count with GPipe in your simulator.
- **Support - Paper:** [Zero Bubble Pipeline Parallelism](https://arxiv.org/abs/2401.10241) - Read the split of backward into input and weight gradients and the handcrafted schedules. Optional vocabulary for zero-bubble and DualPipe schedules.
- **Support - Practice:** [TensorTonic - Pipeline Bubble Utilization](https://www.tensortonic.com/study-plans/language-modeling-from-scratch) - Solve the pipeline bubble utilization problem, then extend its model to 1F1B and interleaved stages in your simulator.
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

### Study units

#### U1. Sparse MoE layers, router scores and shared and fine-grained experts

**About 5 h** · **Target:** Explain + Implement

Topics: Sparse MoE layer structure and expert MLPs; Router logits and token-to-expert scores; Shared experts and fine-grained expert architectures

Every MoE layer replaces a dense feed-forward block with routed experts plus a router. The router decides which parameters run for each token, so sparse parameter count and active compute diverge from here on.

**You can now**

- Explain router logits, token-to-expert scores and top-$`k`$ selection, and compute active expert FLOPs per token versus total expert parameters.
- Implement a router that maps token vectors to scores, selects $`k`$ experts and combines their outputs with a shared expert.
- Contrast shared experts with routed experts, and fine-grained experts with few large experts.

**Study**

1. [MoE layers, routers and sparsity](https://huggingface.co/blog/moe) (Mixture of Experts Explained) - What is a Mixture of Experts (MoE)? and What is Sparsity?, including Noisy Top-k Gating with the KeepTopK and softmax equations.
2. [DeepSeekMoE with shared and fine-grained experts](https://arxiv.org/abs/2412.19437) (DeepSeek-V3 Technical Report - MoE Sections) - Section 2.1.2, Basic Architecture of DeepSeekMoE, Equations 12 to 15 (arXiv:2412.19437v2): shared experts, routed experts, sigmoid affinities and top-k normalization.
3. [Router and MoE layer code](https://github.com/hkproj/torchfeather/blob/c416ab1ad0fd3567a0a6c8ad0da570c8fd6e55aa/torchfeather/model/moe/moe.py) (TorchFeather - Expert Parallelism) - `MoEArgs` defaults, `TokenChoiceTopKRouter.forward` and `MoE.forward`, including `score_func`, `route_norm`, `route_scale`, `expert_bias`, `score_before_experts` and the shared expert. Depth: Read the code. On CPU its forward stops at `torch.histc` on int64 expert indices (`histogram_cpu not implemented for Long`), so a CPU oracle counts with `torch.bincount` instead.

**Focus**

- Router logits are $`h = W_{r} x`$; scores are $`\operatorname{softmax}(h)`$ or $`\operatorname{sigmoid}(h)`$. The gate value that multiplies an expert output comes from the scores, not from the ranking.
- With top-$`k`$ routing each token activates $`k`$ of $`E`$ experts. Active expert FLOPs scale with $`k`$; total expert parameters scale with $`E`$.
- A shared expert runs for every token and is added outside the top-$`k`$ weighting. Fine-grained experts split the same capacity into more, smaller experts with larger $`k`$.
- On a CUDA device TorchFeather computes the gate in float32 under autocast, then optionally normalizes (`route_norm`) and scales (`route_scale`) the selected scores. On CPU that autocast is disabled with a warning, so keep oracle inputs in float32. The bias term changes selection only, as in DeepSeek-V3.

**Reproduce:** Closed-book, compute router scores $`s = x^{\top} w`$ for $`x = [1, 0]`$ and $`w = [[1, 0, 1], [0, 1, 1]]`$, select top-$`k`$ with $`k = 2`$ under lower-index ties, renormalize the two weights with softmax, and combine the expert outputs $`[[10, 0], [0, 0], [0, 10]]`$ plus shared output $`[1, 1]`$ to get $`[6, 6]`$. State which parts change when the shared expert is removed.

**Traps**

- `torch.topk` with `sorted=False`, as TorchFeather uses it, does not promise lower-index tie order or descending output. A contract that needs ties and order needs an explicit stable sort.
- Sigmoid scores are independent affinities between 0 and 1; they sum to 1 across experts only after `route_norm`. Do not treat raw sigmoid outputs as a distribution.
- The shared expert is not one of the $`k`$ routed choices. Counting it inside top-$`k`$ undercounts routed compute and breaks the load statistics.

**Practice**

- [Deep-ML 125: Implement a Sparse Mixture of Experts Layer](https://www.deep-ml.com/problems/125) - Implement `moe(x, We, Wg, n_experts, top_k)`; the tests check the seed-42 forward values with $`d = 2`$, 4 experts and top-$`k = 2`$, and the all-zero expert-weight edge case. Do the closed-book reproduce first. The tests check forward values only, not routing gradients or dispatch.

**Stop when:** Your router reproduces the $`[6, 6]`$ example by hand, and your MoE layer passes both Deep-ML 125 tests.

<details>
<summary>Self-test</summary>

1. For scores $`[1, 0, 1]`$ and $`k = 2`$ with lower-index ties, which experts are selected and with what weights?
   - Experts 0 and 2 in that order. Selected scores $`[1, 1]`$ give softmax weights $`[0.5, 0.5]`$.
2. A layer has $`E = 8`$ experts with $`k = 2`$ active per token. How do parameters and active compute scale?
   - Parameters scale with 8 experts; active expert compute scales with 2. Doubling $`E`$ at fixed $`k`$ adds parameters without adding per-token FLOPs.
3. What changes in the routed result if the shared expert output is zero?
   - The result is only the weighted routed sum. In the example above it would be $`[5, 5]`$ instead of $`[6, 6]`$.
4. TorchFeather adds `expert_bias` to scores before `torch.topk` but gathers gate values from the original scores. Why?
   - The bias steers selection toward underloaded experts without changing the multiplies. It implements auxiliary-loss-free balancing; gate values still derive from the unaugmented affinities.

</details>

#### U2. Top-k selection with deterministic ties and output recombination

**About 4 h** · **Target:** Implement

Topics: Top-k expert selection and deterministic tie handling; Routing weights and output recombination

Selection and recombination are the only numerics every token passes through. An unstable tie rule or a wrong normalization silently changes which expert runs and how its output is weighted.

**You can now**

- Select top-$`k`$ experts with a deterministic lower-index tie rule and keep them in descending score order.
- Renormalize weights over the selected experts and recombine expert outputs plus the shared expert without losing token contributions.
- Compute per-expert token fractions $`f_{e}`$ and mean probabilities $`m_{e}`$ for a small batch.

**Study**

1. [Top-k routing contract with load statistics](https://www.tensortonic.com/problems/cs336-l04-topk-moe-router) (TensorTonic - Top-k MoE Router with Load Statistics) - Statement, function `topk_moe_router(x, w_router, expert_outputs, shared_output, k)` and the three public cases; score equation, lower-index tie rule, weight renormalization and the $`f_{e}`$ and $`m_{e}`$ definitions. Depth: Attempt the public cases by hand before comparing with the worked examples.
2. [KeepTopK gating](https://huggingface.co/blog/moe#what-is-sparsity) (Mixture of Experts Explained) - Noisy Top-k Gating: noise, KeepTopK with negative-infinity masking, then softmax.
3. [Simplified top-1 routing](https://jmlr.org/papers/v23/21-0998.html) (Switch Transformers) - Section 2.1: routing to a single expert ($`k = 1`$), with the three stated effects on router compute, expert batch size and communication.

**Focus**

- Scores are $`s_{t,e} = x_{t}^{\top} w_{e}`$; selection sorts them descending with lower-index tie breaks. Keep that order in the outputs.
- Weights renormalize over the selected $`k`$ only. The full-vocabulary softmax is a separate statistic ($`m_{e}`$), not the combine weight.
- The routed result is the shared output plus the weighted routed sum, with weights summing to 1 per token, so token contributions are conserved through combine.
- Switch shows $`k = 1`$ preserves quality while cutting router compute, expert batch size and communication. The unit default is general $`k`$; $`k = 1`$ is the special case.

**Reproduce:** From a blank file, implement the TensorTonic contract and reproduce public case 1 by hand: scores $`[[1, 0, 1], [0, 1, 1]]`$, selected $`[[0, 2], [1, 2]]`$, weights $`[[0.5, 0.5], [0.5, 0.5]]`$, outputs $`[[6, 6], [5, 5]]`$, $`f = [0.5, 0.5, 1]`$ and $`m = [0.288841, 0.288841, 0.422319]`$.

**Traps**

- `torch.topk` tie order is implementation-defined and `sorted=False` drops ordering. Use a stable descending sort when the contract needs ties and order.
- Softmax over all $`E`$ experts ($`m_{e}`$) and softmax over the selected $`k`$ (combine weights) are different objects. Using $`m_{e}`$ as combine weights leaks unselected experts into the output.
- GShard dispatches the second expert randomly with probability proportional to its weight; Switch and TensorTonic are deterministic. Do not mix the two semantics in one oracle.

**Practice**

- [TensorTonic: Top-k MoE Router with Load Statistics](https://www.tensortonic.com/problems/cs336-l04-topk-moe-router) - Implement `topk_moe_router`; the three public cases check tied top-two routing, single-expert selection and all-tied selection with exact outputs, indices, weights, token fractions and probability masses. Solve on paper before running. Return `selected_experts` as int64 and everything else in the input dtype on the input device, as the statement requires.

**Stop when:** Your implementation matches all three public cases exactly, including order, dtype and device, and you can redo case 1 by hand.

<details>
<summary>Self-test</summary>

1. Scores $`[2, 1, 0.5, 0.1]`$, $`k = 2`$. Which experts and weights?
   - Experts 0 and 1. Softmax over $`[2, 1]`$ gives $`[0.7311, 0.2689]`$.
2. Scores $`[1, 1, 0.6, 0.5]`$, $`k = 2`$. What does the tie rule give?
   - Experts 0 and 1 with weights $`[0.5, 0.5]`$; lower index wins the tie and order stays descending.
3. Why is $`f_{2} = 1`$ while $`m_{2} = 0.422319`$ in public case 1?
   - Both tokens select expert 2, so its token fraction is 1. Its mean probability averages the full softmax rows, which spread mass over all experts.
4. A combine drops the shared expert term. Which public-case outputs change?
   - All outputs shift by the shared output: case 1 becomes $`[[5, 5], [3, 3]]`$.

</details>

#### U3. Token packing, all-to-all dispatch and inverse combine

**About 5 h** · **Target:** Implement

Topics: Token packing by destination expert and rank; All-to-all dispatch and inverse combine

Dispatch is where routing meets the network. Packing decides the grouped matrix layout, the two all-to-alls move the rows, and the inverse permutation decides whether each output lands back on its token.

**You can now**

- Pack routed rows by destination expert and rank with a stable permutation, and invert it exactly on combine.
- Exchange variable row counts with `all_to_all_single` using explicit uneven splits, including empty experts.
- Prove token identity through dispatch, expert compute and combine against a single-process oracle.

**Study**

1. [Dispatch and combine as linear algebra](https://arxiv.org/abs/2006.16668) (GShard: Scaling Giant Models with Conditional Computation and Automatic Sharding) - Section 3.1, Algorithm 2 (arXiv:2006.16668v1): dispatch einsum, grouped expert einsums and combine einsum; Section 3.3.1 for the AllToAll resharding primitive.
2. [All-to-all dispatch and combine walkthrough](https://www.youtube.com/watch?v=XoGvCBRnwLs) (TorchFeather - Expert Parallelism) - 19:01:56 (all-to-all dispatch and combine): counts all-to-all first, payload all-to-all second, then permute and unpermute.
3. [Dispatch, permute and combine code](https://github.com/hkproj/torchfeather/blob/c416ab1ad0fd3567a0a6c8ad0da570c8fd6e55aa/torchfeather/distributed/expert_parallel.py) (TorchFeather - Expert Parallelism) - `ExpertParallel._token_dispatch` (counts `all_to_all_single`, `input_splits` and `output_splits` from row sums, `all_to_all_single_autograd` payload, `_permute`) and `_token_combine` (`_unpermute`, then swapped splits); `model/moe/utils.py` `_permute` and `_unpermute`.
4. [`all_to_all_single` split semantics](https://docs.pytorch.org/docs/2.14/distributed.html#torch.distributed.all_to_all_single) (PyTorch Distributed - all-to-all collective) - `input_split_sizes` and `output_split_sizes` for dim 0 with the uneven-split example (zero entries also run: a 4-process `gloo` check with an empty expert completes, though the docs example does not show one).

**Focus**

- Two all-to-alls: an equal-split exchange of per-expert counts, then an uneven payload exchange with explicit splits. Skipping the counts exchange leaves receive sizes unknown.
- Splits count rows, not bytes. Dispatch sends with the receive counts first and the send counts second; combine swaps them.
- `_permute` converts source-major rows to padded local-expert-major rows for grouped matrix multiply; `_unpermute` inverts it before the combine all-to-all. Padding rows are zeros for compute only and never return to tokens.
- GShard expresses the same path as einsums over dispatch and combine weights. The TorchFeather code is that math with ranks, splits and padding made explicit.

**Reproduce:** With 6 tokens, 4 experts, top-k of 2 and hidden width 4 on one process, pack rows by expert with a stable sort, record the inverse permutation, run a fixed split table with one empty expert by slicing rows, apply per-expert linear maps, unpermute and combine. Then run the same splits through `torchrun --nproc-per-node 4` on the `gloo` backend with `dist.all_to_all_single` and assert identical outputs and recovered order.

**Traps**

- Passing equal splits to the payload all-to-all when experts are imbalanced. If every rank uses the same wrong table, rows reach the wrong experts with no error (measured on 2 `gloo` processes); if send and receive splits disagree, `gloo` raises an enforce failure, and other backends need not check. Derive splits from exchanged counts every step.
- Padded grouped-MM row counts from `_permute` are multiples of 8 and are not token counts. Using them for load fractions or capacity overstates load.
- CPU `gloo` timings validate byte counts and identity, not GPU interconnect behavior. Do not quote them as NVLink or InfiniBand evidence.

**Practice**

- The section mini-project covers this: router-to-dispatch-to-combine oracle with uneven and empty splits, forward and gradient equivalence against a single process, and a 4-process `gloo` identity run.

**Stop when:** Your oracle round-trips token identity through pack, uneven exchange and combine with an empty expert, and the `gloo` run matches it exactly.

<details>
<summary>Self-test</summary>

1. In the file worked example rank 0 sends $`[8, 8, 10, 6]`$. What do they sum to and why?
   - 32, which is $`(16 / 2) \times 4`$: 8 local tokens after the TP split times top-$`k = 4`$.
2. Rank 0 receives 31 rows but sent 32. Is that a bug?
   - No. Sends count rows by destination expert; receives count rows for owned experts from all sources. Imbalance makes them differ; the exchanged counts predict both.
3. Combine swaps the split arguments. Why?
   - Dispatch moves rows from source layout to owner layout; combine moves results back. Each rank send sizes on dispatch are its receive sizes on combine.
4. An expert gets zero tokens on all ranks. What must still hold?
   - Every rank passes matching zero splits for it, the payload all-to-all still runs, and the expert contributes nothing. Empty splits are legal, as the 4-process `gloo` check shows.

</details>

#### U4. Expert process groups, expert tensor parallelism and expert state ownership

**About 4 h** · **Target:** Explain

Topics: Expert process groups and expert ownership; Expert tensor parallelism vocabulary; Expert and dense parameter state ownership

Groups decide which ranks exchange tokens and which own each expert. Every later claim about sharding, placement or accounting rests on this mapping.

**You can now**

- Explain expert-parallel groups, expert ownership and why EP composes with data parallelism.
- Distinguish expert parallelism (shard across experts) from expert tensor parallelism (shard within each expert).
- State which parameters live on which mesh for dense versus expert-sharded state.

**Study**

1. [Expert parallelism and its 5D interaction](https://nanotron-ultrascale-playbook.static.hf.space/index.html) (Ultra-Scale Playbook - Expert Parallelism) - Chapter 7, Expert Parallelism: independent experts on different workers without splitting matrix multiplies; Chapter 8, 5D Parallelism in a Nutshell: EP along experts composed with DP along batch, and the note that some implementations treat EP as DP with routing.
2. [EP and expert tensor parallelism walkthrough](https://www.youtube.com/watch?v=XoGvCBRnwLs) (TorchFeather - Expert Parallelism) - 16:49:58 (MoE) through 18:36:24 (expert parallelism), and 19:27:38 (expert tensor parallelism).
3. [EP, ETP and combined application code](https://github.com/hkproj/torchfeather/blob/c416ab1ad0fd3567a0a6c8ad0da570c8fd6e55aa/torchfeather/distributed/expert_parallel.py) (TorchFeather - Expert Parallelism) - `ExpertParallel._partition_fn` (shard on the expert dim), `ExpertTensorParallel` (two-dim sharding over the EP and ETP mesh), `ReordererSequenceParallel` (token split with rank offsets) and `apply_moe_ep_tp` branch logic.
4. [Production mesh composition](https://github.com/pytorch/torchtitan/blob/0b75362025f037a2d1a23240ba21786928a9052e/torchtitan/distributed/parallelism_context.py) (TorchTitan - MoE Model and Parallelism) - `MeshAxisName` EP and EDP_SHARD entries, `build_mesh` dense and sparse views, and the rule that `ep` divides the sparse region with `edp_shard = dp_shard * cp * tp / ep`; `config/validation.py` requires `ep >= tp` and `num_experts % ep == 0`. Depth: Read after the tiny oracle passes; record the mapping, do not run the trainer.

**Focus**

- EP shards the expert dimension: each rank owns whole experts. Non-MoE layers are unaffected, so EP alone leaves dense compute replicated; compose it with DP over the batch.
- Expert tensor parallelism additionally shards within each expert (`Shard(1)` on `w1` and `w3`, `Shard(2)` on `w2` in TorchFeather). EP chooses the expert; ETP chooses the shard.
- TorchTitan borrows dense ranks for the sparse region instead of multiplying the world size by EP. Dense state uses the DP mesh; expert weights shard on EP with FSDP over EDP_SHARD.
- Validation is mechanical: $`ep`$ divides the sparse region, $`ep \geq tp`$, and $`E \bmod \text{ep} = 0`$.

**Reproduce:** Closed-book, map world size 8 with `dp_shard = 4` and `tp = 2` plus `ep = 4` over 12 experts: derive the sparse region (8 ranks), `edp_shard = 2`, the two EP groups, 3 experts per rank, and which mesh each of `w1`, the router gate and the attention weights lives on.

**Traps**

- EP borrows ranks, so the world-size product counts dense axes only. Multiplying by EP again double-counts ranks and invents groups that do not exist.
- ETP is not a bigger EP. EP without ETP keeps each owned expert whole; ETP splits every expert and needs its own mesh dimension and collectives.
- Expert weights and dense weights need different FSDP meshes. Wrapping a whole MoE layer in one FSDP unit mixes them and breaks the sparse sharding.

**Practice**

- The section mini-project covers this: rank-coordinate mapper for EP and ETP groups with round-trip and invalid-configuration tests.

**Stop when:** You can draw the dense and sparse meshes for the 8-rank example from memory, with every parameter family on its mesh and every rejected configuration named.

<details>
<summary>Self-test</summary>

1. World size 8, `dp_shard = 4`, `tp = 2`, `ep = 4`. What is `edp_shard` and how many experts per rank with $`E = 12`$?
   - `edp_shard = 4 * 2 / 4 = 2`; each EP rank owns $`12 / 4 = 3`$ experts.
2. Why must EP be composed with DP instead of used alone?
   - EP only affects MoE layers. Without DP over the batch, all ranks would redundantly compute every non-MoE block.
3. What breaks if $`E = 10`$ with $`ep = 4`$?
   - 10 is not divisible by 4, so experts cannot split evenly; validation rejects it. Each rank must own the same count of whole experts.
4. Where do the router gate weights live relative to the experts?
   - On the dense side: the gate sees every local token before dispatch, so it is not expert-sharded. Only the expert MLPs shard on EP.

</details>

#### U5. Capacity factor and dropless, dropped and padded routing

**About 4 h** · **Target:** Derive + Implement

Topics: Capacity factor and per-expert token capacity; Dropless, dropped and padded routing semantics

Static shapes force a fixed per-expert buffer before routing is known. The capacity factor sets that buffer, and the overflow policy decides whether extra tokens skip compute, waste it or stall.

**You can now**

- Derive per-expert capacity from tokens, experts and the capacity factor for one batch.
- Contrast dropless, dropped and padded routing and state what happens to overflow tokens.
- Compare the Switch capacity rule with the GShard group capacity rule.

**Study**

1. [Expert capacity and its costs](https://jmlr.org/papers/v23/21-0998.html) (Switch Transformers) - Section 2.2 with Equation 3 and Figure 3: capacity as tokens per batch over experts times the capacity factor, overflow handling, and the finding that Switch performs best at capacity factors 1.0 to 1.25.
2. [Capacity, dropping and communication](https://huggingface.co/blog/moe#capacity-factor-and-communication-costs) (Mixture of Experts Explained) - Switch Transformers capacity equation, the Capacity Factor and communication costs subsection, and the GShard expert-capacity paragraph with overflow via residual connections.
3. [Group capacity and overflow policy](https://arxiv.org/abs/2006.16668) (GShard: Scaling Giant Models with Conditional Computation and Automatic Sharding) - Section 2.2 and Algorithm 1 (arXiv:2006.16668v1): per-group fractional capacity, overflow tokens passed on via residual connections, and random second-expert routing.
4. [Capacity factor trade-offs](https://arxiv.org/abs/2202.08906) (ST-MoE: Designing Stable and Transferable Sparse Expert Models) - Table 1 capacity factor definition and Section 5.2 (arXiv:2202.08906v2): raising train and eval capacity improves quality but linearly raises einsum, memory, all-to-all and allreduce costs.

**Focus**

- Switch capacity is $`(\text{tokens per batch} / N) \times c`$, with $`c`$ the capacity factor and $`N`$ the expert count. For top-$`k`$ routing the numerator counts assignments ($`T \times k`$), not tokens.
- Dropped tokens skip expert compute and flow through the residual; padded slots consume expert FLOPs on zeros. Dropless with imbalance still pays padding or irregular shapes.
- GShard splits the batch into groups with fractional capacity per group; Switch sets one buffer per expert for the whole batch. Both enforce the same idea: at most $`c`$ times the even share fits.
- Switch keeps quality at $`c = 1.0`$ to $`1.25`$; larger $`c`$ buys less dropping at linearly higher communication and activation cost.

**Reproduce:** Closed-book, compute Switch capacity for 16 tokens and 4 experts at $`c = 1.0`$ (4 slots) and $`c = 1.25`$ (5 slots). Route 8 tokens to one expert under each and state dropped counts (4 and 3), then state the padded-row cost if dropping is forbidden.

**Traps**

- Forgetting the $`k`$ multiplier: with top-$`k`$ routing each token occupies $`k`$ slots, so capacity from tokens alone under-provisions by a factor of $`k`$.
- Treating dropped tokens as lost. They skip the expert but keep their residual stream and reach the next layer; the damage is missing expert compute, not a missing position.
- Reading GShard and Switch capacities as one rule. GShard rations per group with random second-expert admission; Switch rations per expert over the batch. Compare them, do not merge them.

**Practice**

- The section mini-project covers this: capacity derivation for one batch, drop and pad accounting, and overflow behavior under skewed routing.

**Stop when:** You reproduce the 16-token capacity arithmetic from memory and predict drops and padding for a skewed assignment without notes.

<details>
<summary>Self-test</summary>

1. 32 tokens, 8 experts, $`c = 1.0`$, top-1 routing. What is the capacity?
   - $`(32 / 8) \times 1.0 = 4`$ slots per expert.
2. Same batch with top-2 routing and $`c = 1.0`$. What buffer holds the even share?
   - $`(32 \times 2 / 8) \times 1.0 = 8`$ slots, because 64 assignments spread over 8 experts.
3. An expert receives 9 tokens at capacity 5 under dropping. What happens to the 4 extras?
   - They skip expert compute and pass through the residual connection to the next layer.
4. Why can raising the capacity factor hurt step time even as drops fall?
   - Every extra slot adds activation memory and all-to-all payload whether or not a real token fills it. Communication and einsum costs grow linearly with the factor.

</details>

#### U6. Auxiliary load-balancing loss and router z-loss

**About 4 h** · **Target:** Derive + Implement

Topics: Auxiliary load-balancing loss; Router z-loss and numerical stability

Without a balancing force the router collapses onto a few experts, overflows their buffers and starves the rest. The auxiliary loss and the z-loss are the two standard counterweights, with different failure modes.

**You can now**

- Derive the Switch auxiliary load-balancing loss and its gradients at the level needed to spot sign, normalization and detach errors.
- Explain the router z-loss, what it penalizes and why it stabilizes routing precision.
- Contrast auxiliary-loss balancing with auxiliary-loss-free bias routing.

**Study**

1. [Auxiliary load-balancing loss](https://jmlr.org/papers/v23/21-0998.html) (Switch Transformers) - Section 2.2, Equations 4 to 6: $`\text{loss} = \alpha N \sum f_{i} P_{i}`$ with token fraction $`f`$ and router probability fraction $`P`$, the non-differentiability of $`f`$, and $`\alpha = 10^{-2}`$.
2. [Earlier auxiliary loss form](https://arxiv.org/abs/2006.16668) (GShard: Scaling Giant Models with Conditional Computation and Automatic Sharding) - Algorithm 1, line 17 (arXiv:2006.16668v1): $`\ell_{\text{aux}} = (1/E) \sum (c_{e}/S) m_{e}`$ with counts $`c_{e}`$ and mean gates $`m_{e}`$ as the differentiable approximation.
3. [Router z-loss](https://arxiv.org/abs/2202.08906) (ST-MoE: Designing Stable and Transferable Sparse Expert Models) - Section 3.3, Equations 5 and 6, and Table 4 (arXiv:2202.08906v2): z-loss as mean squared log-sum-exp of router logits, total loss weights with $`c_{z} = 0.001`$, and stabilization without quality loss versus update clipping.
4. [Auxiliary-loss-free balancing](https://arxiv.org/abs/2412.19437) (DeepSeek-V3 Technical Report - MoE Sections) - Section 2.1.2, Auxiliary-Loss-Free Load Balancing with Equation 16, and Complementary Sequence-Wise Auxiliary Loss, Equations 17 to 20 (arXiv:2412.19437v2): bias-only routing plus a tiny sequence-wise loss; throughput figures are the authors cluster results.

**Focus**

- The Switch loss multiplies by $`N`$ so uniform routing gives the same value at any expert count. $`f`$ is a non-differentiable count fraction; gradients flow only through $`P`$.
- The z-loss penalizes large router logits through the squared log-sum-exp. Small logits shrink bfloat16 roundoff inside the router exponentials, which selective float32 precision alone did not fix at scale.
- Auxiliary-loss-free routing adds a per-expert bias for selection only and adapts it from observed load. Gate values still come from unaugmented affinities; the bias is updated outside backward.
- Loss scales do not transfer: Switch uses $`\alpha = 10^{-2}`$; DeepSeek-V3 keeps only an extremely small sequence-wise coefficient. Copying one into the other over- or under-balances.

**Reproduce:** Closed-book, compute the Switch loss with $`\alpha = 0.01`$ and $`N = 2`$ for a balanced batch ($`f = P = [0.5, 0.5]`$, loss 0.01) and a collapsed batch ($`f = P = [1, 0]`$, loss 0.02). Then compute the z-loss for logits $`[2, 1, 0.5]`$ (log-sum-exp 2.4644, loss 6.0731) and state the sign of each logit gradient.

**Traps**

- Letting gradients flow into the count fraction $`f`$. Detach it: only $`P`$ (or $`m_{e}`$) is differentiable. Differentiating counts is the standard implementation bug.
- Treating the z-loss as a load balancer. It balances logit magnitudes for numerical stability, not token counts across experts; it complements the auxiliary loss rather than replacing it.
- Tuning the bias as a gradient parameter. The aux-loss-free bias is a control variable updated from load statistics in a pre-hook, not through the loss.

**Practice**

- [Deep-ML 389: Mixture of Experts Load Balancing Loss](https://www.deep-ml.com/problems/389) - Implement `moe_load_balancing_loss(gate_logits, num_experts, alpha)`; the tests check 0.01 for a balanced two-expert batch and 0.02 for a fully collapsed batch at `alpha = 0.01`. Derive the two expected values from the Switch formula before running. The tests check loss values only, not z-loss or bias routing.

**Stop when:** You derive both auxiliary losses and the z-loss from memory, predict the 0.01 versus 0.02 cases, and pass Deep-ML 389.

<details>
<summary>Self-test</summary>

1. Why does the Switch loss multiply by $`N`$?
   - Under uniform routing each $`f_{i} P_{i} = 1/N^{2}`$, so the sum is $`1/N`$. Multiplying by $`N`$ keeps the loss constant as experts are added.
2. Which vector carries gradients in the auxiliary loss, and why?
   - Only $`P`$: $`f`$ comes from argmax counts and has no derivative. The loss optimizes the differentiable probability fraction toward the observed counts.
3. Logits $`[2, 1, 0.5]`$ give z-loss 6.0731. What are the gradient signs?
   - All positive, proportional to softmax: about $`[3.10, 1.14, 0.69]`$. The loss pushes every logit down, largest first.
4. When would you prefer bias routing over a large auxiliary loss?
   - When balancing pressure degrades quality: the bias keeps load even without taxing the main objective, at the cost of external load tracking.

</details>

#### U7. Tokens-per-expert histograms, hot experts and all-to-all skew

**About 4 h** · **Target:** Measure

Topics: Tokens-per-expert histograms and imbalance metrics; Hot experts, stragglers and all-to-all skew

Averages hide the failure. One hot expert sets the step time and the largest all-to-all, so diagnosis reads per-expert and per-rank distributions, not global means.

**You can now**

- Report tokens-per-expert histograms with token fractions $`f_{e}`$, mean probabilities $`m_{e}`$ and a max-to-mean ratio.
- Explain hot experts, stragglers and all-to-all skew from per-rank send and receive splits.
- State why balanced counts need not imply equal compute or equal network load.

**Study**

1. [Load statistics definitions](https://www.tensortonic.com/problems/cs336-l04-topk-moe-router) (TensorTonic - Top-k MoE Router with Load Statistics) - Token fraction $`f_{e}`$ and probability mass $`m_{e}`$ definitions with the three public cases as worked histogram examples.
2. [Token counting instrumentation](https://github.com/hkproj/torchfeather/blob/c416ab1ad0fd3567a0a6c8ad0da570c8fd6e55aa/torchfeather/model/moe/moe.py) (TorchFeather - Expert Parallelism) - `TokenChoiceTopKRouter.forward` and `TokenReorderer.forward` (`torch.histc` counts, which run on CUDA; on CPU use `torch.bincount`, since `torch.histc` on int64 indices raises `histogram_cpu not implemented for Long`), and `MoE.forward` accumulation into `tokens_per_expert`.
3. [Cross-node skew and its fix](https://arxiv.org/abs/2412.19437) (DeepSeek-V3 Technical Report - MoE Sections) - Section 3.2.2 (arXiv:2412.19437v2): IB at 50 GB/s versus NVLink at 160 GB/s, at most 4 nodes per token, IB and NVLink overlap, 20 SMs for communication; cluster figures only.

**Focus**

- Histogram first: counts per expert, $`f_{e}`$ for selection share, $`m_{e}`$ for router confidence, and max-to-mean count ratio for the hotspot size.
- Read the dispatch splits per rank: sends by destination expert group, receives for owned experts. The slowest rank and the largest receive set the all-to-all, not the mean.
- Balanced counts still allow skew: top-$`k`$ duplicates multiply rows, padding wastes FLOPs, and co-located hot experts pile traffic on one link.
- Name the setup behind every number: these traces come from CPU processes or a simulator unless two or more GPUs ran them.

**Reproduce:** Closed-book, instrument the 6-token oracle from the dispatch unit: emit per-expert counts, $`f_{e}`$, $`m_{e}`$ and the max-to-mean ratio, plus a per-rank send and receive table for EP degree 2 with one hot expert. Point at the rank and the expert that set the step.

**Traps**

- Calling uniform counts proof of uniform compute. Duplicated top-$`k`$ rows, padding and uneven expert shapes break that equality.
- Calling uniform counts proof of uniform network load. Tokens for one expert may arrive from many ranks while another expert sits local; the receive table tells the truth.
- Quoting CPU `gloo` skew timings as interconnect evidence. They exercise the accounting path only; link claims need the link hardware.

**Practice**

- The section mini-project covers this: per-expert histograms, drop counts, per-rank timing and communication splits, and one diagnosed hotspot or empty-expert case.

**Stop when:** Your oracle tables name the hot expert, the slow rank and the max-to-mean ratio from memory, with the hardware behind each number stated.

<details>
<summary>Self-test</summary>

1. Counts $`[4, 2, 3, 3]`$ over 6 tokens with $`k = 2`$. What are $`f_{0}`$ and the max-to-mean ratio?
   - Assignments total 12, mean 3. $`f_{0} = 4/6 \approx 0.667`$; max-to-mean is $`4/3 \approx 1.33`$.
2. Two ranks send $`[8, 8]`$ and receive $`[12, 4]`$. Which rank sets the all-to-all?
   - Rank 0: it receives 12 rows against 4. Receives size the payload each rank must absorb.
3. Every expert holds exactly 3 tokens but step time still skews. Name two causes.
   - Any two of: top-$`k`$ duplicates counted once but computed twice, padding on some ranks, co-located hot experts sharing one link, or a slow rank outside routing.
4. How do $`f_{e}`$ and $`m_{e}`$ disagree under collapse?
   - Both pile on the favored expert, but $`f_{e}`$ is 0 or 1 from hard selection while $`m_{e}`$ spreads residual mass; the gap measures router overconfidence versus assignments.

</details>

#### U8. Masked-token, router-gradient and empty-expert tests

**About 5 h** · **Target:** Implement

Topics: Masked or repeated-token correctness tests; Router and dispatcher gradient tests; Failure cases from empty experts and uneven tokens

Routing bugs look like quality loss, not crashes. Only targeted tests separate a wrong router, a broken permutation and a true hotspot.

**You can now**

- Test masked and repeated tokens for exact dispatch identity and recombination.
- Test router and dispatcher gradients, including empty experts and uneven tokens.
- Name failure cases from empty experts, uneven splits and lost order.

**Study**

1. [MoE correctness test patterns](https://github.com/pytorch/torchtitan/blob/0b75362025f037a2d1a23240ba21786928a9052e/tests/unit_tests/cpu/test_moe.py) (TorchTitan - MoE Model and Parallelism) - `test_padding_is_excluded_from_counts_but_still_dispatched`, `test_eval_forward_does_not_accumulate_tokens_per_expert`, `test_explicit_moe_tp_transitions_with_ep_without_sp` and `test_routed_branch_rejects_tp_without_ep`. Depth: Read after the tiny oracle passes; copy the test patterns, not the framework.
2. [Combine and scoring-order code](https://github.com/hkproj/torchfeather/blob/c416ab1ad0fd3567a0a6c8ad0da570c8fd6e55aa/torchfeather/model/moe/moe.py) (TorchFeather - Expert Parallelism) - `MoE.forward`: `score_before_experts` scaling position, `torch.gather` routing, `scatter_add` combine, and `tokens_per_expert` accumulation under `torch.no_grad`.

**Focus**

- Masked tokens are still dispatched but excluded from counts and the auxiliary loss. Dropping them from dispatch instead changes expert outputs.
- Router gradients flow through selected scores only; selection indices carry none. The combine must use tensor weights, never Python floats.
- Empty experts must run with zero rows and return zero grads. Uneven splits must be tested with at least one empty expert and one duplicated token.
- Evaluation must not accumulate usage counters. TorchTitan fails a model that counts eval tokens toward balancing state.

**Reproduce:** Closed-book, extend the oracle with three tests: repeated tokens produce identical outputs at both positions; converting combine weights with `float()` kills the router gradient while the tensor version keeps it; an expert with zero assigned tokens returns zeros with zero grads and matching empty splits.

**Traps**

- Wrapping a routing weight in `float()` inside the combine loop. It detaches the router graph: in a measured example with 4 CPU processes on `gloo` and PyTorch 2.14.1, the tensor version keeps `grad Wg` while the `float()` version leaves it `None`.
- Testing dispatch with balanced splits only. Real routing is uneven; without an empty expert and a duplicated token the tests miss the exact cases that break collectives.
- Counting eval tokens in `tokens_per_expert`. The bias update then learns from inference-like passes; gate eval behind the training flag as the TorchTitan test demands.

**Practice**

- [Deep-ML 229: Sparse MoE Top-K Routing](https://www.deep-ml.com/problems/229) - Implement `moe_topk_routing(router_logits, expert_outputs, k)`; the tests check the combined output for weights $`[0.7311, 0.2689]`$ and for the tied $`[0.5, 0.5]`$ case. Use it as the recombination oracle. Add your own masked-token, gradient and empty-expert tests around it.

**Stop when:** Your three oracle tests pass, Deep-ML 229 passes, and you can state the detach bug from the measured gradient run.

<details>
<summary>Self-test</summary>

1. Two identical tokens at positions 0 and 5 route differently. What is broken?
   - Dispatch or packing order: identical inputs must select the same experts with the same weights. Check the stable sort and the permutation inverse.
2. Router gradients are all `None` but expert gradients exist. What is the likely bug?
   - Weights were detached before combine, for example via `float()`. Keep them as tensors so the graph reaches the gate.
3. An empty expert raises a shape error in grouped matrix multiply. What should happen?
   - It should compute zero rows and return zeros with zero grads. Guard the zero-row case instead of skipping the expert.
4. Padding is excluded from counts. Must padded rows still reach experts?
   - Yes for compute layout in padded schemes, but they must not enter counts or the auxiliary loss. The TorchTitan padding test pins exactly this split.

</details>

#### U9. FSDP with expert-sharded parameters and EP, TP and DP groups

**About 4 h** · **Target:** Explain

Topics: FSDP interaction with expert-sharded parameters; EP, TP and data-parallel group composition

Expert parameters need a different sharding than everything else. One flat FSDP wrap mixes the meshes; the composed plan keeps them separate and testable.

**You can now**

- Explain how FSDP shards expert weights on the sparse mesh while dense state stays on the dense mesh.
- Compose EP, TP and data-parallel groups without double-counting ranks.
- State the validation rules that reject a bad composition.

**Study**

1. [Sparse FSDP and expert placements](https://github.com/pytorch/torchtitan/blob/0b75362025f037a2d1a23240ba21786928a9052e/torchtitan/distributed/fsdp.py) (TorchTitan - MoE Model and Parallelism) - `resolve_sparse_fsdp_mesh` versus `resolve_fsdp_mesh`, and `apply_fsdp_to_decoder` with `edp_mesh`: routed-expert parameters use the sparse mesh while other parameters use the dense mesh. Depth: Read after the tiny oracle passes; record the mesh choice, do not run the trainer.
2. [Expert parameter placements](https://github.com/pytorch/torchtitan/blob/0b75362025f037a2d1a23240ba21786928a9052e/torchtitan/models/common/moe_sharding.py) (TorchTitan - MoE Model and Parallelism) - `expert_param_placement_sparse` (EP shards dim 0, FSDP reshards EDP_SHARD) versus `replicated_param_placement_sparse` for shared expert state.
3. [Combining expert, model and data parallelism](https://jmlr.org/papers/v23/21-0998.html) (Switch Transformers) - Sections 5.4 and 5.5: expert plus data parallelism, then expert plus model plus data parallelism with the data, weight and expert partitioning strategies.

**Focus**

- Two meshes over the same ranks: dense storage and forward views for attention, router and shared experts; the sparse view for routed experts. Rank sets overlap; parameter sets do not.
- Expert weights shard dim 0 on EP and reshard on EDP_SHARD under FSDP. Shared experts and the gate stay dense-family placements.
- EP borrows ranks from the dense grid, so group sizes obey the borrowing rule, not an independent product. Degrees that ignore it fail validation.
- Switch Sections 5.4 and 5.5 are the conceptual version of the TorchTitan code: same composition, XLA-era vocabulary instead of DeviceMesh.

**Reproduce:** Closed-book, fill a table for world size 8 with `dp_shard = 4`, `tp = 2`, `ep = 4`: dense mesh axes, sparse mesh axes, `edp_shard`, experts per rank at $`E = 12`$, and the placement of expert weights, gate, shared experts and attention weights. State the three validation checks.

**Traps**

- Applying one FSDP wrap to a whole MoE layer. Dense and expert parameters need different meshes; a single wrap shards one family wrongly.
- Overlapping EP all-to-all with FSDP reduce-scatter on the same ranks without a plan. The collectives contend; order and overlap need explicit design, not hope.
- Reading Switch group vocabulary as DeviceMesh code. Translate sharding intent, not API names, across the XLA to PyTorch gap.

**Practice**

- The section mini-project covers this: mesh table for one composition with validation checks, plus a rejected configuration for each rule.

**Stop when:** Your mesh table places every parameter family correctly and rejects a bad degree with the exact rule it breaks.

<details>
<summary>Self-test</summary>

1. Which parameters use the sparse mesh?
   - Only routed-expert weights. Gate, shared experts, attention and dense MLPs stay on the dense mesh.
2. State the three composition validation checks.
   - `ep` divides the sparse region; `ep >= tp`; $`E \bmod \text{ep} = 0`$.
3. What does EDP_SHARD reshard under FSDP?
   - The expert weights after EP sharding: FSDP gathers and releases them around compute while dense state follows the DP mesh.
4. Why do Switch Sections 5.4 and 5.5 still matter for a DeviceMesh stack?
   - They define the composition semantics (which dims shard, which replicate, which collectives appear) that the mesh code implements.

</details>

#### U10. MoE communication and memory accounting and topology-aware placement

**About 4 h** · **Target:** Derive

Topics: Communication and memory accounting for MoE layers; Node-limited routing and topology-aware expert placement

MoE trades dense FLOPs for token movement. The byte count decides whether more experts help or just buy communication, and placement decides which links pay it.

**You can now**

- Derive dispatch and combine bytes for one MoE layer from tokens, top-$`k`$, hidden width and dtype.
- Apply the JAX roofline rule for when expert parallelism stays cheap across nodes.
- Explain node-limited routing and topology-aware expert placement.

**Study**

1. [Expert-parallel roofline on GPUs](https://jax-ml.github.io/scaling-book/gpus) (How to Scale Your Model - Expert Parallelism on GPUs) - Rooflines for LLM Scaling on GPUs, Expert Parallelism: math versus communication time with the takeaway on small versus large feed-forward width (page read 2026-10-14); Quiz 5: LLM rooflines (page read 2026-10-14). Depth: Work Quiz 5 on paper before opening the answers. Use the all-to-all cost half for your own accounting; keep its H100 numbers labeled as H100 numbers.
2. [Capacity factor and communication costs](https://huggingface.co/blog/moe#capacity-factor-and-communication-costs) (Mixture of Experts Explained) - Capacity Factor and communication costs: raising capacity raises quality, communication and activation memory; top-2 at 1.25 as the starting point.
3. [Node-limited routing and EP scale](https://arxiv.org/abs/2412.19437) (DeepSeek-V3 Technical Report - MoE Sections) - Section 3.2.2 and Section 3.2 (arXiv:2412.19437v2): at most 4 nodes per token, IB and NVLink overlap with 20 SMs, 64-way EP spanning 8 nodes with 16-way PP and ZeRO-1 DP; all figures are the authors cluster results.

**Focus**

- One all-to-all moves $`T \times k \times d`$ elements; dispatch plus combine doubles it before bytes per element. In fixed-capacity schemes the padding rows move too; in dropless uneven dispatch padding is added locally after the exchange and never crosses the network.
- The JAX rule compares feed-forward width against scaled compute-to-bandwidth: narrow experts stay within about 2 nodes, wide experts scale further. Restate it with your own $`C`$ and $`W`$, never with borrowed constants.
- Node-limited routing caps the nodes each token touches (4 in DeepSeek-V3) so slow inter-node links carry less. Topology-aware placement then keeps hot experts behind fast intra-node links.
- DeepSeek-V3 trains without tensor parallelism by pairing 64-way EP with 16-way PP and 2-way DP. That mix is their cluster answer, not a universal recipe.

**Reproduce:** Closed-book, derive bytes for $`T = 16`$ tokens, $`k = 2`$, $`d = 32`$ in bf16: 2048 bytes per all-to-all, 4096 total for dispatch plus combine. Then state the JAX takeaway condition in words and apply it to one narrow and one wide expert case.

**Traps**

- Counting one all-to-all. Dispatch and combine both move the full routed payload; forgetting combine halves the bytes.
- Mixing units: GB against GiB, Gbit/s against GB/s, FLOPs against FLOP/s, algorithm against bus bandwidth. The byte count is exact; the time needs the stated bandwidth and its definition.
- Lifting H100 or TPU constants onto your machine. The JAX numbers assume their fabric; your accounting must plug in measured or explicitly assumed links, and CPU `gloo` timings never stand in for them.

**Practice**

- The section mini-project covers this: byte and memory accounting for one MoE layer, a stated placement with its contended links, and one measured-versus-predicted residual.

**Stop when:** Your byte derivation matches 2048 and 4096 from memory, and you can defend a placement with named links and labeled bandwidths.

<details>
<summary>Self-test</summary>

1. $`T = 16`$, $`k = 2`$, $`d = 32`$, bf16. How many bytes per all-to-all and total?
   - $`16 \times 2 \times 32 \times 2 = 2048`$ bytes each; 4096 total.
2. Capacity factor rises from 1.0 to 1.5 with no routing change. What happens to bytes?
   - In a fixed-capacity scheme the buffer grows to 1.5 times the even share, so up to 1.5 times the rows move and activation memory grows with them even though real tokens did not. Dropless uneven dispatch moves only the real rows.
3. What does node-limited routing buy?
   - It bounds slow-link traffic per token. With at most 4 nodes, most expert fan-out stays behind fast intra-node links under the overlap design.
4. When does the JAX rule favor wide multi-node EP?
   - When feed-forward width exceeds the scaled compute-to-bandwidth threshold, so math outweighs the cross-node all-to-all cost.

</details>

### Mini-project: Expert-parallel MoE with balanced routing and honest accounting

**About 12 to 16 hours.** Build the tiny MoE dispatcher in `parallel/` with packing, all-to-all exchange and combine, then balance, diagnose and cost it. Per-expert histograms, capacity math and placement records show where tokens move and which links pay.

1. Implement the router and top-$`k`$ selection in `parallel/` with deterministic ties, renormalized weights and shared-expert recombination, reporting token fractions and mean probabilities. Pass the Deep-ML sparse-expert and TensorTonic top-$`k`$ router cases, then keep the hand derivation as the first regression.
2. Pack rows by expert and rank with a permutation in `parallel/`, exchange counts and payload over all-to-all with explicit splits, and invert the permutation on combine. Prove token identity and gradient flow against `model/` oracle with uneven and empty splits, confirmed by a Gloo run.
3. Build the rank-coordinate mapper for expert and expert-tensor groups in `comm/`, with round-trip and invalid-configuration tests. Tabulate one dense and sparse mesh composition with validation checks, keeping routed experts sparse and gate and shared state dense, plus one rejected configuration for each rule.
4. Derive per-expert capacity for one batch with drop and pad accounting, and show overflow behavior under skewed routing. Implement the auxiliary balancing loss and router z-loss with detached count fractions, passing the Deep-ML balancing-loss cases and contrasting bias routing without gradients.
5. Instrument per-expert histograms with drop counts and per-rank timing and communication splits in `trace/`, diagnosing one hotspot or empty-expert case. Harden the path with masked, repeated-token, router-gradient and empty-expert tests in the TorchTitan CPU style, using the Deep-ML routing cases as the recombination oracle.
6. Derive dispatch and combine bytes with memory accounting for one layer in `plan/`, state a placement with its contended links, and keep one measured-versus-predicted residual. Label CPU timings as accounting checks only, with link claims reserved for measured hardware.

**Deliverables**

- The `parallel/` dispatcher with packing, exchange, combine and routing oracles.
- Group mapper, mesh tables, capacity math and imbalance evidence with one diagnosis.
- `plan/` byte and memory accounting with placement, contended links and one residual.
- `tests/` and `trace/` replaying identity, gradients and negative cases.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [Deep-ML 125 Sparse Mixture of Experts Layer](https://www.deep-ml.com/problems/125). Pass both forward tests; add routing and dispatch checks around them.
- external-tests: [TensorTonic Top-k MoE Router with Load Statistics](https://www.tensortonic.com/problems/cs336-l04-topk-moe-router). Match order, dtype and device on all public cases exactly.
- external-tests: [Deep-ML 389 MoE Load Balancing Loss](https://www.deep-ml.com/problems/389). Derive both expected values from the formula before running.
- external-tests: [Deep-ML 229 Sparse MoE Top-K Routing](https://www.deep-ml.com/problems/229). Use as the recombination oracle beside masked and empty tests.
- external-tests: [TorchTitan CPU MoE unit tests](https://github.com/pytorch/torchtitan/blob/0b75362025f037a2d1a23240ba21786928a9052e/tests/unit_tests/cpu/test_moe.py). Copy the padding, counter and transition patterns, not the framework.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Dispatch identity | Uneven and empty splits round-trip token identity through a stable permutation, and gradients reach router and experts. | A duplicated-token case and a swapped-split mutation each fail a named assertion. |
| Groups and meshes | Coordinates round-trip, invalid configurations are rejected, and every family sits on its mesh. | Each composition rule has a rejected configuration naming the exact rule broken. |
| Balance and capacity | Capacity math predicts drops and pads, and balancing losses match expected values. | Skewed routing shows where the buffer overflows, and bias routing is contrasted without gradients. |
| Cost honesty | Bytes count both exchanges, placement names contended links, and one residual is kept. | CPU timings stay labeled as accounting checks, and the hotspot diagnosis names rank and expert. |

Feeds into: The dispatcher, histograms, mesh tables and byte accounting feed composed planning, fleet diagnosis and the capstone.

### Resource route

- **Primary - Theory:** [Ultra-Scale Playbook - Expert Parallelism](https://nanotron-ultrascale-playbook.static.hf.space/index.html#expert_parallelism) - Read Expert Parallelism and its interaction with DP in the 5D summary. Derive tokens, bytes and expected imbalance for one top-k routing example; use the linked MoE introduction only if the architecture is unfamiliar.
- **Support - Theory:** [How to Scale Your Model - Expert Parallelism on GPUs](https://jax-ml.github.io/scaling-book/gpus) - Read the expert-parallelism part of Rooflines for LLM Scaling on GPUs and work its quiz before the answer. Use it for the all-to-all cost half of your MoE accounting.
- **Required - Implementation:** [TorchFeather - Expert Parallelism](https://github.com/hkproj/torchfeather) - Watch the video segments from 16:49:58 (MoE) through 18:36:24 (expert parallelism), 19:01:56 (all-to-all dispatch and combine) and 19:27:38 (expert tensor parallelism), then trace `model/moe/` and `distributed/expert_parallel.py`. Build a tiny router-dispatch-expert-combine oracle first, then map each group, placement and `all_to_all_single` call to it.
- **Required - Reference:** [Mixture of Experts Explained](https://huggingface.co/blog/moe) - Study routing, capacity, token dropping, auxiliary loss and the expert-parallelism sections. Implement the small routing examples and verify conservation of token contributions through combine; group composition and FSDP interaction come from the papers and TorchTitan.
- **Support - Paper:** [GShard: Scaling Giant Models with Conditional Computation and Automatic Sharding](https://arxiv.org/abs/2006.16668) - Read the mixture-of-experts layer: top-2 gating, expert capacity, the auxiliary loss and random routing. Compare its capacity rule with Switch.
- **Support - Paper:** [ST-MoE: Designing Stable and Transferable Sparse Expert Models](https://arxiv.org/abs/2202.08906) - Read the stability section that introduces the router z-loss and compare it with the auxiliary balancing loss.
- **Support - Paper:** [DeepSeek-V3 Technical Report - MoE Sections](https://arxiv.org/abs/2412.19437) - Read the DeepSeekMoE architecture (shared and fine-grained experts, auxiliary-loss-free balancing, node-limited routing) and the all-to-all communication design. Its throughput figures are its own cluster's results.
- **Support - Practice:** [TensorTonic - Top-k MoE Router with Load Statistics](https://www.tensortonic.com/study-plans/language-modeling-from-scratch) - Solve Top-k MoE Router with Load Statistics, including its lower-index tie rule, before building dispatch.
- **Depth - Case study:** [Bumblebee - Router, Dispatcher and Expert Primitives](https://github.com/isLinXu/bumblebee) - Only as a possible capstone target: read `primitive/modules/router.py`, `dispatcher.py`, `experts.py` and `moe.py` in a clean checkout. Its own todo lists no multi-GPU correctness test yet, so do not treat it as a reference implementation.
- **Support - Reference:** [TorchTitan - MoE Model and Parallelism](https://github.com/pytorch/torchtitan) - Read the MoE model files and their parallelization plan only after the tiny oracle passes, at a pinned commit. Record how a production PyTorch stack composes EP, expert FSDP and the other mesh dimensions.
- **Support - Paper:** [Switch Transformers](https://jmlr.org/papers/v23/21-0998.html) - Read Section 2 for simplified routing, the capacity factor and the load-balancing loss, and Section 5 for combining data, model and expert parallelism. Reproduce its capacity arithmetic for one batch.
- **Reference - Reference:** [PyTorch Distributed - all-to-all collective](https://docs.pytorch.org/docs/2.14/distributed.html#torch.distributed.all_to_all_single) - Read `all_to_all_single` for `input_split_sizes` and `output_split_sizes` on dim 0 and its uneven-split example. Use it for the dispatch and combine calls in the tiny oracle, and check zero splits yourself.

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

### Study units

#### U1. The parallel dimensions and world-size factorization

**About 4 h** · **Target:** Explain + Derive

Topics: Parallel dimensions: DP, FSDP, TP, SP, CP, PP and EP; World-size factorization and divisibility constraints

A planner must count physical ranks once even when their ownership changes between dense and expert layers. Start from the mechanisms you built in DT-3 through DT-7, not a list of parallelism labels.

**You can now**

- Identify the state or tensor dimension partitioned by each strategy and the communication it introduces.
- Derive world size from independent mesh axes without counting SP or a reused expert mesh twice.
- Distinguish data replicas, state-sharding groups and expert replicas in one composed plan.

**Study**

1. [The strategies as one ownership map](https://nanotron-ultrascale-playbook.static.hf.space/index.html#5d_parallelism_in_a_nutshell) (The Ultra-Scale Playbook - 5D Parallelism and Finding the Best Configuration) - 5D Parallelism in a Nutshell, including Scope and focus and Summarizing it all.
2. [Dense and sparse meshes reuse the same world](https://github.com/hkproj/torchfeather/blob/c416ab1ad0fd3567a0a6c8ad0da570c8fd6e55aa/torchfeather/distributed/parallel_dims.py) (TorchFeather - ParallelDims and Composition Plan) - `ParallelDims._validate` and `build_mesh`, especially the `dataloading`, `dense` and `sparse` mesh products. Depth: Trace the products and ownership only. Do not copy the private mesh methods into your planner. The trainer package requires PyTorch 2.11 up to but excluding 2.12; that range is an implementation convention, not a current public API contract.

**Focus**

- For an independent dense mesh, write $`W = d_r d_s t c p`$, with replicated DP, sharded DP, TP, CP and PP degrees respectively. FSDP describes state ownership on existing ranks, not another factor.
- Megatron-style SP uses the TP group for selected sequence-sharded activations. It does not add ranks. CP is a separate sequence axis in this mesh.
- TorchFeather uses $`d_s c t = d_e e t_e`$ for expert-FSDP, EP and expert-TP degrees. The expert mesh refactors the same ranks; dense and expert state have different owners.

**Reproduce:** Closed-book, draw TorchFeather's three meshes for replicated DP 1, sharded DP 4, CP 2, TP 2, PP 1, EP 4 and expert TP 2. All use 16 ranks. Derive dense FSDP degree 8, expert FSDP degree 2 and independent data-replica degree 4; explain why multiplying by EP again would be wrong.

**Traps**

- Treating every named strategy as an independent axis. Ask whether it introduces new ranks or changes ownership on existing ranks.
- Using the data-replica count for every gradient reduction. CP ranks contribute different tokens, and expert parameters have their own replication groups.

**Practice**

- The section mini-project covers this: trainlab's dense and expert ownership tables and world-size validation.

**Stop when:** Your ownership table accounts for all 16 ranks once in each mesh and names the reduction group for dense and expert gradients.

<details>
<summary>Self-test</summary>

1. Does enabling SP on an existing TP group double world size?
   - No. It changes selected activation layouts on those ranks.
2. Why does CP not create new examples in the global batch?
   - Its ranks own pieces of the same sequences. Their token contributions must be combined, not counted as independent copies of those sequences.
3. Can an expert parameter use the dense FSDP divisor without checking its mesh?
   - No. EP assigns different experts to ranks, so the ranks holding replicas of one expert can be a smaller group than the dense FSDP group.

</details>

#### U2. Named device meshes, rank coordinates and group construction

**About 4 h** · **Target:** Implement

Topics: Logical device meshes and named mesh dimensions; Rank coordinates and process-group construction

A legal product is not enough: a wrong slice silently synchronizes unrelated shards. This unit extends DT-2 group construction to a named multidimensional layout.

**You can now**

- Implement rank-to-coordinate and coordinate-to-rank mappings with round-trip tests.
- Construct groups by varying one coordinate while holding the others fixed.
- Reject inconsistent mesh products and verify group membership with CPU collectives.

**Study**

1. [Explicit coordinate slices](https://github.com/huggingface/picotron/blob/59714b1bf25541dbeb6f5a721ed15f6d0768e786/picotron/process_group_manager.py) (Picotron - 4D Composition) - `ProcessGroupManager.__init__`: `grid`, coordinate lookup, subgroup enumeration and group rank lists.
2. [A CPU named mesh with independent checks](https://github.com/hkproj/torchfeather/blob/c416ab1ad0fd3567a0a6c8ad0da570c8fd6e55aa/minimal_examples/pp_gpipe.py) (TorchFeather - ParallelDims and Composition Plan) - `main` from process-group initialization to `get_group`, plus `peer_rank`. Depth: Read mesh construction only here. Leave the schedule and numerical oracle for the correctness unit.

**Focus**

- Picotron orders axes as DP, PP, CP, TP. Its row-major rank is $`r = (((i_d p + i_p)c + i_c)t + i_t)`$. Store axis order as part of the plan.
- Different axis groups through one rank intersect at that rank. Groups on the same axis partition the world. Neither property means their physical links are independent.
- All ranks must agree on group creation order and membership. Enumerate the full group list deterministically before any rank-specific execution.

**Reproduce:** On four CPU processes with gloo, build a row-major DP-by-TP mesh of shape 2 by 2. Verify TP groups `[0, 1]` and `[2, 3]`, DP groups `[0, 2]` and `[1, 3]`, and rank-coordinate round trips. All-reduce the global rank as a scalar within each group and check its sum against the listed members. Then simulate a four-axis mesh with all degrees 2 and test every rank.

**Traps**

- Inferring node placement from adjacent rank numbers. Logical ordering and physical placement are separate inputs.
- Creating groups only on participating ranks while other ranks follow a different order. Use a consistent global construction sequence.

**Practice**

- The section mini-project covers this: trainlab's rank-coordinate mapper, group membership, round-trip and invalid-product tests.

**Stop when:** All simulated round trips and four-process group sums pass, and an invalid world-size product is rejected before group creation.

<details>
<summary>Self-test</summary>

1. What is rank 2's coordinate in the row-major 2 by 2 DP-by-TP mesh?
   - DP coordinate 1 and TP coordinate 0. Its TP peer is rank 3 and its DP peer is rank 0.
2. Which coordinates change inside a pure PP group?
   - Only the PP coordinate. DP, CP and TP coordinates stay fixed.
3. What does a successful rank-sum check prove, and what does it not prove?
   - It checks the chosen group's collective membership for that fixture. It does not prove tensor ownership, update equivalence or placement performance.

</details>

#### U3. Batch and token equations and divisibility across dimensions

**About 4 h** · **Target:** Derive

Topics: Batch and token equations across DP and pipeline microbatches; Head, hidden, vocabulary, sequence, layer and expert divisibility

The model-parallel ranks cooperate on the same data. Counting them as data replicas changes the update contract before any performance comparison begins.

**You can now**

- Derive unique examples and valid loss tokens per update for a composed mesh.
- Build a divisibility table for heads, widths, vocabulary, sequence, layers and experts.
- Separate mathematical constraints from a chosen implementation's equal-shard restrictions.

**Study**

1. [Hit the batch without inventing data replicas](https://nanotron-ultrascale-playbook.static.hf.space/index.html#step_2:_achieving_the_target_global_batch_size_) (The Ultra-Scale Playbook - 5D Parallelism and Finding the Best Configuration) - Step 2: Achieving the target global batch size; cross-check with Revisiting global batch size. Depth: Treat the CP bullets as allocation advice, not batch equations. Changing CP alone partitions existing sequences and does not multiply unique examples.
2. [Implementation-specific divisibility](https://github.com/hkproj/torchfeather/blob/c416ab1ad0fd3567a0a6c8ad0da570c8fd6e55aa/torchfeather/model/parallelize.py) (TorchFeather - ParallelDims and Composition Plan) - `parallelize_deepseekv3` sequence and head checks; `apply_non_moe_tp` embedding, attention, output and MLP layouts.
3. [Mesh and balanced-context restrictions](https://github.com/hkproj/torchfeather/blob/c416ab1ad0fd3567a0a6c8ad0da570c8fd6e55aa/torchfeather/distributed/parallel_dims.py) (TorchFeather - ParallelDims and Composition Plan) - `_validate` expert-mesh constraints and `seq_len_divisor`.
4. [Uneven layer partitions](https://github.com/hkproj/torchfeather/blob/c416ab1ad0fd3567a0a6c8ad0da570c8fd6e55aa/torchfeather/distributed/pipeline_parallel.py) (TorchFeather - ParallelDims and Composition Plan) - `generate_llm_fqn_per_model_part`: effective layer weights, remainder distribution and stage bounds.
5. [Equal expert-owner chunks](https://github.com/hkproj/torchfeather/blob/c416ab1ad0fd3567a0a6c8ad0da570c8fd6e55aa/torchfeather/distributed/expert_parallel.py) (TorchFeather - ParallelDims and Composition Plan) - `ExpertParallel._token_dispatch`: `num_local_experts` and the reshape of `num_tokens_per_expert` into expert-owner chunks. Depth: Trace the equal-expert-count layout only. Do not run the full expert stack here.

**Focus**

- With independent data degree $`d`$, microbatch examples $`b`$, microbatches per update $`m`$ and full sequence length $`s`$, unique examples are $`d \, b \, m`$ and dense input tokens are $`d \, b \, m \, s`$. Count unmasked loss tokens separately.
- For equal head shards, query heads must divide by TP; GQA needs a stated KV-head sharding or replication policy. Check hidden and MLP widths, and vocabulary padding, against the actual tensor layouts.
- Balanced CP may require two chunks per rank; combined SP can strengthen the sequence divisor. Equal layers per stage and equal experts per EP rank are planner policies, not universal requirements. Uneven partitions need explicit metadata and costs.

**Reproduce:** For DP 2, TP 2, CP 2 and PP 2, with microbatch 2 examples, eight microbatches per update and full sequence length 1024, derive 32 unique examples and 32,768 input tokens. Write equal-shard checks for a model with 8 query heads, 2 KV heads, hidden width 256, MLP width 768, vocabulary 1024, 8 layers and 4 experts; use EP 2 as a refactoring, not an extra factor. Reject an unpadded vocabulary of 1025 and sequence length 1025 under those equal-shard policies.

**Traps**

- Multiplying global batch by PP, TP or CP. None introduces independent examples in this convention.
- Rejecting every uneven layer count as mathematically impossible. A pipeline can have uneven stages, but the planner must cost their imbalance.
- Dividing a mean loss by world size. Weight gradients by the global valid-token denominator, accounting for replicated outputs.

**Practice**

- The section mini-project covers this: trainlab's batch-token ledger and model-layout divisibility validator, including invalid and uneven cases.

**Stop when:** Your ledger recovers the stated unique-token count and your table explains every rejection as a mesh, data or implementation-layout constraint.

<details>
<summary>Self-test</summary>

1. Does doubling CP at fixed data degree and full sequence length double update tokens?
   - No. It reduces local sequence ownership while keeping the same full sequences.
2. Why might TP exceed the number of KV heads legally?
   - An implementation may replicate KV heads across TP ranks. That changes ownership and memory costs; it is not equal KV-head sharding.
3. What changes when some tokens are masked out of the loss?
   - The valid-token denominator and useful-token count. Input processing cost can remain unchanged, so report both counts.

</details>

#### U4. Per-rank parameter, gradient, optimizer, checkpoint and buffer memory

**About 4 h** · **Target:** Derive

Topics: Per-rank parameter, gradient and optimizer memory; Checkpoint and communication buffer memory

Build on Memory, arithmetic intensity and reconciling estimates. Composition adds different divisors for different state, plus transient gathers that can invalidate an otherwise correct persistent-state estimate.

**You can now**

- Derive persistent parameter, gradient, master-weight and optimizer bytes from their actual owners and dtypes.
- Account for gathered parameters, reduction buffers and checkpoint staging by lifetime and memory tier.
- Find the worst rank rather than accepting an average per-rank fit.

**Study**

1. [State ownership under ZeRO and model parallelism](https://blog.eleuther.ai/transformer-math/) (Transformer Math 101 - Distributed Training) - Distributed Training: Sharded Optimizers, 3D Parallelism and Sharded Optimizers + 3D Parallelism. Depth: Do not copy the 3D gradient-memory formula as universal: it omits the TP divisor for TP-sharded weight gradients. Derive each gradient from its local parameter shape. The 12-byte optimizer convention includes a master weight; it is not every PyTorch AdamW configuration.
2. [FSDP gathers a TP shard, not the whole model](https://github.com/LambdaLabsML/distributed-training-guide/blob/aed748914472cca80d8cfe139ab43ec63103913a/07-2d-parallel/README.md) (Distributed Training Guide - Chapter 7 FSDP plus TP) - Six-device ownership example and Applying FSDP after TP.
3. [Checkpoint state and asynchronous lifetime](https://github.com/hkproj/torchfeather/blob/c416ab1ad0fd3567a0a6c8ad0da570c8fd6e55aa/torchfeather/components/checkpoint.py) (TorchFeather - ParallelDims and Composition Plan) - `CheckpointManager.__init__`, `dcp_save`, `save` and `close`: state inventory, save future and waiting. Depth: Trace retained state and completion only. Leave checkpoint durability and resume semantics for DT-9.

**Focus**

- Use the DT-4 dtype ledger, but apply TP, PP and state-sharding divisors only to tensors they actually partition. CP usually leaves dense weights replicated unless its ranks also participate in state sharding.
- A gather materializes the stage's TP-local parameter unit. Prefetch may make multiple units live together. Do not divide this full compute window by the FSDP degree again.
- Separate durable checkpoint bytes from additional staging allocations. State-dict views can alias existing tensors; clones do not. Charge host staging to RAM and concurrent device buffers to device memory.
- Compute a timeline maximum of live allocations, not the sum of each category's separate maximum. Include tied state, padding, allocator reserve and the largest stage.

**Reproduce:** For a synthetic model with 12 million evenly partitioned parameters, TP 2, PP 3 and FSDP 4, assume BF16 parameters and gradients, an FP32 master copy and two FP32 moments. Derive persistent tensor storage of 8,000,000 bytes per rank. Then draw a live-window ledger for one gathered TP-local layer, its prefetched successor, a gradient buffer and an asynchronous host checkpoint copy. Mark unknown workspace and allocator reserve separately; do not call the persistent total a peak.

**Traps**

- Treating the source's bytes-per-parameter convention as an AdamW default. Record the tensors your implementation actually stores.
- Adding checkpoint file size to device memory even when staging lives on the host.
- Averaging uneven stages. The smallest device must fit its assigned peak, not the fleet's average.

**Practice**

- The section mini-project covers this: trainlab's per-rank state, communication-buffer and checkpoint-staging ledger with live-window tests.

**Stop when:** Every persistent tensor has a dtype and owner, and your peak ledger distinguishes device gathers, host staging, shared storage and reserve.

<details>
<summary>Self-test</summary>

1. Why is the synthetic persistent ledger 8,000,000 bytes?
   - Each rank owns 500,000 parameters after TP, PP and FSDP. The stated state uses 16 bytes per parameter, giving 8,000,000 bytes, before transient storage.
2. What parameter shape is gathered under FSDP plus TP?
   - The complete TP-local shard for the wrapped unit, not the unpartitioned model tensor and not just the persistent FSDP fragment.
3. Does an asynchronous save necessarily double device memory?
   - No. Extra storage depends on staging location, copying and aliasing. A retained host copy increases host memory while training continues.

</details>

#### U5. Per-rank activation and temporary memory under a composed plan

**About 3 h** · **Target:** Derive

Topics: Per-rank activation and temporary memory

Training-step operation, activation and communication arithmetic gave a whole-model estimate. A composed plan needs the peak lifetime on each stage, not that estimate divided by world size.

**You can now**

- Derive saved activation bytes from local layouts and the number of live pipeline microbatches.
- Separate saved tensors from attention, routing and collective workspaces.
- Revise a plan's activation estimate when recomputation, SP or CP changes.

**Study**

1. [Which activations really shrink with TP?](https://blog.eleuther.ai/transformer-math/) (Transformer Math 101 - Distributed Training) - Training: Activations and Batch Size, including the three recomputation formulas and their assumptions. Depth: Use this as an FP16, no-SP reference model. Do not apply its materialized-attention term to a fused attention implementation without checking what is saved.
2. [Schedule changes activation lifetime](https://nanotron-ultrascale-playbook.static.hf.space/index.html#one_forward,_one_backward_and_llama_3.1_schemes) (The Ultra-Scale Playbook - 5D Parallelism and Finding the Best Configuration) - One forward, one backward and Llama 3.1 schemes: stored activations and the comparison with all-forward-all-backward. Depth: Use your DT-6 schedules rather than rebuilding them. Track saved tensors at stage boundaries and within stages.

**Focus**

- Count each saved tensor from its local shape and dtype. Residuals may be replicated while MLP intermediates are TP-sharded; SP changes only the regions where its layout is active.
- At a stage, multiply per-microbatch saved bytes by the schedule's live microbatch count, then add temporary storage at that event. GPipe and 1F1B need not have the same peak.
- CP shards queries and sequence-local tensors, but remote KV blocks or all-gathered KV storage add temporary memory. EP needs routing indices, packed tokens and padding for the actual capacity policy.

**Reproduce:** In a deterministic simulation, let a stage retain one BF16 boundary tensor per live microbatch, with local shape 2 examples by 1024 tokens by hidden width 256. Derive 1,048,576 bytes per tensor. Replay your DT-6 GPipe and 1F1B event lists, allocating at forward completion and freeing after the matching backward. Check the peak against the maximum number of live tensor identities, then add a temporary receive buffer at its actual lifetime.

**Traps**

- Dividing all activation memory by TP. Replicated residuals and normalization inputs can remain unchanged without SP.
- Calling activation checkpointing a durable training checkpoint. Here it trades saved tensors for recomputation, not recovery storage.
- Charging a quadratic attention matrix when the chosen fused kernel does not save it, or forgetting its linear-size statistics and workspace.

**Practice**

- The section mini-project covers this: trainlab's activation lifetime simulation and per-stage temporary-memory accounting.

**Stop when:** The simulated live-set maximum agrees with your byte ledger for both schedules, and changing recomputation or layout changes only the tensors it actually affects.

<details>
<summary>Self-test</summary>

1. Eight synthetic boundary tensors are live. What storage do they occupy?
   - 8,388,608 bytes, or 8 MiB. This counts only the stated boundary tensors.
2. Does increasing accumulation always increase activation memory?
   - No. Sequential microbatches can release activations before the next starts. A pipeline schedule can keep several microbatches live, so use its lifetime trace.
3. Why does full recomputation not make activation memory zero?
   - It retains recomputation boundaries and still needs current-layer intermediates, outputs and workspaces.

</details>

#### U6. Per-layer FLOPs and the collective volume of every dimension

**About 5 h** · **Target:** Derive

Topics: Per-layer compute and transformer FLOP estimates; Collective volume for every parallel dimension

Use Counting parameters and FLOPs and Operation counts for projections, MLPs, output and attention as inputs. The new task is to distribute those operations and count the communication that makes them valid.

**You can now**

- Derive local matmul shapes and forward, backward and recomputation FLOPs for each stage.
- List every DP, FSDP, TP, SP, CP, PP and EP transfer with group, dtype, payload and frequency.
- Keep logical payload, per-rank transmitted bytes and critical-path time distinct.

**Study**

1. [A gated FFN with explicit forward and backward communication](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/cs336_assignment2_systems.pdf) (CS336 Assignment 2 (Spring 2026) - Section 8 Analyzing Parallelism Strategies) - Sections 8.1 to 8.4, Communication Primitives through Analyzing Tensor Parallel, printed pp. 40 to 45.
2. [Transformer terms beyond the FFN](https://jax-ml.github.io/scaling-book/transformers/) (How to Scale Your Model - Chapters 4 to 6) - Global FLOPs and Params Calculation: MLPs, Attention, Other Operations and Fractional cost of attention with context length.
3. [Sequence, context, pipeline and expert transfers](https://nanotron-ultrascale-playbook.static.hf.space/index.html#5d_parallelism_in_a_nutshell) (The Ultra-Scale Playbook - 5D Parallelism and Finding the Best Configuration) - Summarizing it all, the combined MoE-layer diagram; follow back to Sequence parallelism, Ring Attention and Expert Parallelism for the transfer paths. Depth: Use the diagrams to enumerate transfers. Do not use Appendix A3's shard-size lines as transmitted bytes: an input shard is not the total traffic, and element counts need their dtype multiplier.

**Focus**

- For a gated FFN with token rows $`n`$, hidden width $`h`$ and MLP width $`f`$, three projections cost $`6 n \, h \, f`$ forward FLOPs and about $`12 n \, h \, f`$ backward FLOPs. Distribute rows and weights according to actual layouts, not every mesh degree blindly.
- For a ring on $`q`$ ranks and full logical tensor size $`S`$ bytes, all-gather or reduce-scatter sends $`(q-1)S/q`$ per rank; all-reduce sends twice that. At degree 1 all three have zero network traffic.
- DP reduces gradients once per synchronization; FSDP gathers each live parameter unit and scatters gradients; TP/SP moves activations at layout boundaries. PP sends boundary activations and their gradients. CP exchanges attention blocks; EP dispatches and combines routed tokens, including backward transfers.
- Include attention score/value matmuls, vocabulary projection, recomputation and replicated operations. CP and EP counts depend on algorithm, masks, routing and padding; count the actual messages rather than assuming uniform traffic.

**Reproduce:** Derive the three CS336 FFN strategies from tensor shapes without notes. For a separate synthetic four-rank ring all-reduce with a 1 MiB logical tensor, derive 1,572,864 transmitted bytes per rank, excluding protocol overhead. Extend one composed-plan ledger with every transfer type in the combined MoE diagram; record forward/backward frequency and explicitly mark any inactive dimension as zero.

**Traps**

- Treating FLOPs divided by peak FLOP/s as a measured kernel time. Local shard shapes can reduce attainable throughput.
- Adding send and receive bytes and then dividing by an egress-only bandwidth. Keep the byte and bandwidth convention consistent.
- Counting only EP forward dispatch. Combine and the backward routing paths also move tensors.

**Practice**

- [CS336 Assignment 2: `data_parallel_calcs`, `fsdp_calcs` and `tp_calcs`](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/cs336_assignment2_systems.pdf) - Section 8.2 problem on p. 42, Section 8.3 problem on pp. 43 to 44 and Section 8.4 problem on pp. 44 to 45. These are written derivations, not public autograded tests. Retain the finite-rank ring factors and the handout's FP16 and egress-bandwidth assumptions. The section mini-project extends your transfer ledger to CP, PP and EP.

**Stop when:** Your three written solutions agree with an independent shape-and-message count, and the composed ledger names every active transfer and its units.

<details>
<summary>Self-test</summary>

1. Why is the gated FFN forward count larger than a two-matrix MLP count?
   - It has gate, up and down projections rather than just up and down. Each costs twice token rows times the two weight dimensions.
2. What happens to FSDP traffic if parameters are retained across the forward/backward boundary?
   - A backward parameter gather may be avoided for retained units, but memory rises. Count gathers from the retention policy, not a fixed slogan.
3. Why is the 1 MiB ring input not the per-rank all-reduce traffic?
   - Each rank sends three quarters of the tensor in reduce-scatter and again in all-gather. That totals 1.5 MiB.

</details>

#### U7. Bubble and imbalance cost, critical paths and overlap constraints

**About 5 h** · **Target:** Derive

Topics: Pipeline bubble and stage-imbalance cost; Critical-path versus total-byte reasoning; Communication overlap and dependency constraints

Cost categories and the Amdahl bound on end-to-end gain established why total work is not elapsed time. Composition makes the dependency graph and shared resources the planner's central objects.

**You can now**

- Derive ideal pipeline overhead and distinguish it from the idle fraction of elapsed time.
- Compute makespan from a dependency graph with stage imbalance and communication resources.
- Identify which transfers can overlap and which must finish before their consumers.

**Study**

1. [Bubble, microbatch size and composed schedules](https://arxiv.org/html/2104.04473v5#S2.SS2) (Efficient Large-Scale Language Model Training on GPU Clusters Using Megatron-LM) - arXiv:2104.04473v5, Sections 2.2.1 to 2.2.2 and 3.1 to 3.4; Figures 3, 4 and 8. Depth: Use the schedule and cost analysis. The A100 Selene results are source measurements, not targets for your machine.
2. [Where overlap assumptions enter the model](https://jax-ml.github.io/scaling-book/training/#combining-fsdp-and-tensor-parallelism) (How to Scale Your Model - Chapters 4 to 6) - Combining FSDP and Tensor Parallelism: forward/backward algorithm and the two assumptions before minimizing communication. Depth: A maximum of costs is an ideal overlap bound, not a guarantee. Include first-layer gathers and last gradient reductions when constructing the full step.

**Focus**

- For balanced non-interleaved fill-drain with $`p`$ stages, $`m`$ microbatches, stage forward time $`t_f`$ and backward time $`t_b`$, makespan is $`(m+p-1)(t_f+t_b)`$, ignoring transfers and update. Bubble overhead relative to ideal work is $`(p-1)/m`$; its elapsed-time fraction is $`(p-1)/(m+p-1)`$.
- Use the DT-6 event simulator with per-stage durations. The busiest stage limits steady-state throughput; embeddings, output projection and routed-expert skew can make equal layer counts unbalanced.
- An asynchronous launch removes host waiting, not a tensor dependency. The consuming matmul waits for its gather or reduction. Overlap also needs independent resource capacity and enough ready compute.
- The last gradient bucket can remain exposed even if earlier reductions overlap. Retaining parameters or adding prefetch can shorten waits while enlarging live memory.

**Reproduce:** Simulate balanced fill-drain with four stages, eight microbatches, forward duration 1 time unit and backward duration 2 time units per stage, with zero transfer and update cost. Recover makespan 33, ideal work time 24 and bubble time 9. Then double one stage's durations and insert a positive receive dependency; recompute the makespan from events rather than reusing the balanced formula.

**Traps**

- Calling the paper's bubble-to-ideal-work ratio the fraction of elapsed step time. The denominators differ.
- Replacing all compute and communication sums with a maximum. Dependent operations and shared links cannot overlap freely.
- Charging bubble time twice, once in the simulator and again as an added analytic penalty.

**Practice**

- The section mini-project covers this: trainlab's composed critical-path simulator, stage-imbalance cases and overlap-versus-serialization bounds.

**Stop when:** Your simulator reproduces the ideal case and explains an imbalance or blocked-transfer case through dependencies, without double-counting bubble or overlap.

<details>
<summary>Self-test</summary>

1. What are the two bubble ratios in the synthetic balanced case?
   - Overhead relative to ideal work is $`3/8`$, or 37.5%. The fraction of elapsed time is $`3/11`$, about 27.3%.
2. Does non-interleaved 1F1B automatically remove the ideal fill-drain bubble?
   - No. Under the balanced ideal model it has the same bubble while reducing outstanding activation lifetimes.
3. A gather is shorter than total backward compute. Is that enough to hide it?
   - No. It needs ready independent compute in its own release-to-consumer window, sufficient buffers and uncongested resources.

</details>

#### U8. Link contention, intra- and inter-node placement and fast links for TP and EP

**About 5 h** · **Target:** Derive + Explain

Topics: Link contention among simultaneous mesh dimensions; Intra-node and inter-node placement policy; Fast-link preference for tensor and expert parallelism

Orthogonal groups can still share a NIC. A topology-aware plan needs physical routes and shared capacities, not just one bandwidth constant per logical dimension.

**You can now**

- Map logical groups onto device, node, NIC and switch links with a traffic table.
- Identify simultaneous dimensions that contend for the same physical capacity.
- Defend fast-link placement for frequent TP or EP traffic without treating it as a universal rule.

**Study**

1. [Node and cross-node collective capacity](https://jax-ml.github.io/scaling-book/gpus/#how-do-collectives-work-on-gpus) (How to Scale Your Model - Chapters 4 to 6) - How Do Collectives Work on GPUs: Intra-node collectives and Cross-node collectives; Rooflines for LLM Scaling on GPUs: Tensor Parallelism, Expert Parallelism and Caveat about latency. Depth: Keep the chapter's H100 and GB200 constants labeled as its hardware assumptions. Reuse the hierarchy and message-size reasoning, not those constants as measurements of your machine.
2. [Independent versus contending FSDP and TP](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/cs336_assignment2_systems.pdf) (CS336 Assignment 2 (Spring 2026) - Section 8 Analyzing Parallelism Strategies) - Section 8.5, 2D Parallelism (FSDP + TP), problem `fsdp_tp_calcs`, printed pp. 45 to 46.

**Focus**

- Separate rank-to-device placement from coordinate-to-rank mapping. Map each message onto links and direction; count simultaneous traffic at the GPU interface, shared NIC and network cuts.
- TP collectives recur inside each layer's dependency chain. EP all-to-all can expose routing skew and many destinations. Fast links often help these paths, but feasibility and available domains can force cross-node groups.
- On one directed bottleneck of capacity $`w`$, transfers of $`S_1`$ and $`S_2`$ bytes require at least $`(S_1+S_2)/w`$ if neither can use another route. Taking their individual times' maximum spends the same bandwidth twice.
- Use egress bandwidth for transmitted bytes. Algorithm bandwidth is logical payload divided by time; bus bandwidth applies the collective's traffic factor. Neither automatically equals physical peak bandwidth.

**Reproduce:** Draw two simulated nodes with two devices each and a single shared outbound link per node. Place a 2 by 2 DP-by-TP mesh once with TP inside nodes and once with TP across nodes. Use the same layer/message ledger and symbolic capacities for both. Mark simultaneous FSDP and TP traffic on shared links and derive serialization and independent-link bounds; explain which placement wins under each capacity ratio.

**Traps**

- Giving every rank the full node NIC capacity. Shared egress must be budgeted across all active rank flows.
- Assuming simultaneous collectives have independent bandwidth because their groups intersect only at one rank.
- Calling CPU gloo timing evidence about NVLink or inter-node NCCL performance. The CPU experiment verifies semantics only.

**Practice**

- [CS336 Assignment 2: `fsdp_tp_calcs`](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/cs336_assignment2_systems.pdf) - Section 8.5, all four parts of `fsdp_tp_calcs`, printed pp. 45 to 46. Solve the independent-axis and shared-network cases separately. This is a written problem with no public autograded tests. Check your optimum against an enumeration of legal integer factors; the handout's continuous optimum is only a relaxation. Trainlab extends the exercise to placement and EP.

**Stop when:** Your written solutions distinguish overlapping and shared-resource costs, and both placements have a per-link traffic table with no duplicated bandwidth budget.

<details>
<summary>Self-test</summary>

1. Two equal-sized transfers share one saturated directed link. Is their completion time the individual time's maximum?
   - No. The link must carry twice the bytes. Ignoring latency, the lower bound is twice the individual transfer time.
2. Why can EP need a different placement preference from DP?
   - EP routes activations between expert owners, often on the layer critical path and with skew. DP reduces gradient tensors with a different readiness and overlap pattern.
3. Does moving PP across nodes make its transfer cost zero?
   - No. Boundary tensors and gradients still cross links and block dependent work. PP often has less frequent communication, not free communication.

</details>

#### U9. TP versus CP for long context, and DP, ZeRO and PP under batch limits

**About 4 h** · **Target:** Derive

Topics: Long-context trade-offs between TP and CP; Batch-limit trade-offs between DP, ZeRO and PP

More dimensions are not automatically better. A plan must respect batch and memory constraints while retaining enough useful work per rank to amortize its communication.

**You can now**

- Compare TP and CP for a long-context workload using local shapes, memory and attention communication.
- Compare DP, ZeRO and PP at a fixed global batch without changing the intended update.
- Defend at least three feasible alternatives and state when recomputation, offload or fewer dimensions is preferable.

**Study**

1. [Weights, activations and long-context tradeoffs](https://nanotron-ultrascale-playbook.static.hf.space/index.html#5d_parallelism_in_a_nutshell) (The Ultra-Scale Playbook - 5D Parallelism and Finding the Best Configuration) - 5D Parallelism in a Nutshell: PP versus ZeRO-3 comparison, TP/SP interplay and the CP discussion.
2. [Fixed batch limits the data dimension](https://jax-ml.github.io/scaling-book/applied-training/#how-to-shard-llama-3-70b-for-training) (How to Scale Your Model - Chapters 4 to 6) - How to shard LLaMA 3-70B for training: pure FSDP, sequence-sharded and mixed FSDP/TP questions. Depth: Answer before revealing the solutions. The final suggested 2048-way FSDP with 4-way TP uses 8192 chips, not the stated full 8960-chip pod. Treat it as a smaller allocation, then enumerate legal factors for the full pod. The memory table earlier in the chapter omits gradients and transient buffers.

**Focus**

- CP reduces local sequence ownership and adds attention exchange, while usually retaining dense weights. TP reduces selected weights and computation widths, but can make local GEMMs small and introduce dependent collectives throughout the block.
- At fixed update batch, increasing DP reduces examples per replica and the microbatches available to each pipeline. Neither TP nor CP creates extra training examples. Derive the batch again after each factorization.
- ZeRO-3 trades persistent state for gathers; PP trades depth ownership for bubbles and boundary transfers. Retention across microbatches can avoid repeated gathers but raises peak memory.
- Compare recomputation and host offload as alternatives when their compute or transfer cost buys feasibility. Keep the loss, token budget and optimizer update fixed; throughput does not establish convergence or recovery suitability.

**Reproduce:** Build three analytical scenarios: a short-context model that fits unsharded, a weight-heavy model and a long-context model with constrained global batch. For each, compare at least three legal plans using your state, activation and message ledgers. Identify a memory or bandwidth assumption that reverses the preferred plan. In the scaling-book case, separately check the suggested allocation product and the full-pod factorization before using its optimum.

**Traps**

- Increasing global batch merely to make the preferred mesh look efficient. That changes the optimization workload.
- Assuming CP fixes a weight-memory problem. It mainly partitions sequence-local activations unless combined with state sharding.
- Rounding each degree independently and forgetting to recheck the world-size product.

**Practice**

- [How To Scale Your Model: sharding LLaMA 3-70B for training](https://jax-ml.github.io/scaling-book/applied-training/#how-to-shard-llama-3-70b-for-training) - The pure FSDP, sequence-sharded and mixed FSDP plus TP questions in How to shard LLaMA 3-70B for training, answered on paper before opening each solution. The givens are TPU v5p numbers; keep them labeled as such. Check the suggested allocation's product against the full pod, then add gradients and transient buffers to its memory answer. The section mini-project carries the three-scenario comparison into trainlab.

**Stop when:** Your three scenario tables retain at least three feasible alternatives each and explain distinct winners without changing the batch or hiding unused ranks.

<details>
<summary>Self-test</summary>

1. Why can TP help a weight-heavy model more than CP at the same degree?
   - TP partitions substantial parameter tensors. Pure CP retains those weights and mainly reduces local activation ownership.
2. Why can a small fixed global batch make deep PP unattractive?
   - Few microbatches per pipeline leave a large fill/drain overhead. More accumulation is not free if it changes the prescribed global batch.
3. Is 2048-way FSDP with 4-way TP a legal allocation of every chip in an 8960-chip pod?
   - No. It uses 8192 chips. Either name the unused capacity or choose factors whose product is 8960 and recheck model and batch constraints.

</details>

#### U10. Configuration search with legal-plan pruning and predicted regimes

**About 5 h** · **Target:** Implement

Topics: Configuration search with legal-plan pruning; Predicted OOM, communication-bound and bubble-bound regimes

The preceding ledgers become useful only when they reject bad allocations and expose alternatives. Search a bounded space before requesting hardware, then validate its leading assumptions.

**You can now**

- Enumerate legal integer plans and retain a reason for every rejection.
- Rank feasible plans using peak memory, local compute, communication, bubble and topology costs.
- Predict OOM, exposed-communication and bubble-dominated regimes without presenting analytical labels as measurements.

**Study**

1. [A bounded configuration search](https://nanotron-ultrascale-playbook.static.hf.space/index.html#finding_the_best_training_configuration) (The Ultra-Scale Playbook - 5D Parallelism and Finding the Best Configuration) - Finding the Best Training Configuration: Steps 1 to 3, then Benchmarking thousands of configurations. Depth: Use the search ordering, not fixed model-size or rank-count thresholds as universal rules. The heatmaps are Hugging Face's H100-cluster results at sequence length 4096 and global batch 1M tokens.
2. [A finite planner with an exact scoring contract](https://www.tensortonic.com/problems/cs336-l08-topology-aware-parallel-plan) (TensorTonic - Choose a Topology-Aware Parallel Plan) - Choose a Topology-Aware Parallel Plan: statement, feasibility rules, lexicographic score and three public examples. Depth: Implement its supplied model exactly for this problem. It has no FSDP, EP, pipeline activation-lifetime or step-time model; passing it does not validate those parts of trainlab.

**Focus**

- Enumerate factor tuples, then prune by mesh reuse, model divisibility, batch integrality and peak capacity with reserve. For degree 1, charge no network transfer. Keep a full rejection record instead of deleting inconvenient cases.
- Apply stage-specific cost functions to local shapes. A plan with smaller FLOPs per rank can lose through tiny GEMMs, launch overhead, bubbles or contending links.
- Use predicted regimes as hypotheses: memory exceeds usable capacity, a required transfer is exposed, or idle schedule time dominates. Feasibility and a fast predicted time are separate questions.
- Rank only plans with the same model, valid tokens and update contract. Add checkpoint staging, failure-domain restrictions and supported implementation features as constraints, not invented performance bonuses.

**Reproduce:** From a blank file, enumerate all ordered positive-integer DP, TP, PP and CP factors for a small world size and implement TensorTonic's exact ceiling, feasibility and tie-breaking rules. Compare factor-first enumeration with an independent brute-force loop over degrees. Then extend trainlab with state-sharding policies, expert-mesh reuse and schedule costs; keep the platform's simplified scorer as a separate baseline.

**Traps**

- Using the TensorTonic score as a throughput estimate. It ranks modeled byte counts lexicographically, not seconds.
- Pruning on persistent memory alone while a gather or pipeline live set exceeds capacity.
- Treating the first predicted winner as measured optimal. Preserve close alternatives and uncertainty ranges.

**Practice**

- [TensorTonic: Choose a Topology-Aware Parallel Plan](https://www.tensortonic.com/problems/cs336-l08-topology-aware-parallel-plan) - Implement `topology_aware_parallel_plan` using the function signature and public cases on the page. The free public cases exercise single-node TP, CP with PP, and DP with TP under the supplied model. They do not check FSDP, EP or real throughput. Add your own no-feasible-plan and tied-score tests; the section mini-project extends the planner.

**Stop when:** The named problem's public cases pass, independent enumerations agree, and your extended planner reports feasible candidates and explicit rejection reasons for all three scenarios.

<details>
<summary>Self-test</summary>

1. Can a configuration with the correct world-size product still be illegal?
   - Yes. It can violate batch, tensor-layout, expert-reuse, sequence, stage or supported-implementation constraints.
2. Why should feasibility use a memory reserve?
   - Tensor estimates omit or approximate workspace, runtime allocations and allocator effects. State the reserve and test sensitivity rather than treating nominal capacity as fully usable.
3. What evidence distinguishes a predicted communication regime from a demonstrated one?
   - A measured timeline and controlled variation showing exposed communication limits step time on the executed topology. Byte volume alone is not enough.

</details>

#### U11. Measured-to-predicted residuals and the topology and assumption manifest

**About 4 h** · **Target:** Measure

Topics: Measured-to-predicted residual analysis; Topology and assumption manifest for every result

A planner is a falsifiable model, not a fitting exercise. The useful result is an explained residual and a revised assumption that predicts a new case.

**You can now**

- Freeze a prediction and compute signed timing or memory residuals against a scoped observation.
- Attribute the largest discrepancy to kernels, overlap, contention, input, stragglers or runtime overhead.
- Preserve the workload, topology, software and assumptions needed to reproduce a plan comparison.

**Study**

1. [What makes a configuration result non-transferable?](https://nanotron-ultrascale-playbook.static.hf.space/index.html#lessons_learned_on_benchmarking) (The Ultra-Scale Playbook - 5D Parallelism and Finding the Best Configuration) - Benchmarking thousands of configurations and Lessons learned on benchmarking.
2. [Rank-local schedule labels and CPU traces](https://github.com/hkproj/torchfeather/blob/c416ab1ad0fd3567a0a6c8ad0da570c8fd6e55aa/minimal_examples/pp_gpipe.py) (TorchFeather - ParallelDims and Composition Plan) - `run_schedule` action labels and `main` CPU profiling and trace export. Depth: Use this to inspect event ordering. It profiles one schedule execution, not a repeated-trial steady-state throughput benchmark.
3. [Audit the reported step boundary](https://github.com/huggingface/picotron/blob/59714b1bf25541dbeb6f5a721ed15f6d0768e786/train.py) (Picotron - 4D Composition) - Main training loop from `step_start_time` through `step_duration`, logging and checkpoint save. Depth: Read only. Its wall-clock boundary excludes checkpoint saves and is not an explicit synchronized GPU timing contract. Do not reuse its logged time as validated end-to-end GPU latency.

**Focus**

- Define $`r = T_{\text{observed}} - T_{\text{predicted}}`$ and relative residual $`r/T_{\text{predicted}}`$ for a positive predicted duration. Keep the original estimate alongside any calibrated revision.
- Use rank-local phase durations and the slowest completed rank for the declared step boundary. Cross-rank clock alignment needs a stated method; raw timestamps are not automatically comparable.
- The manifest names model shapes, seeds, data/token identity, batch and accumulation, masks, dtypes, optimizer, mesh order, rank placement, links, bandwidth convention, reserve, schedule, recomputation, software versions and source commits.
- Retain raw trials, warmup policy, timing boundary, observer overhead and evidence tier. CPU gloo timing describes your machine's CPU execution, not a GPU interconnect.

**Reproduce:** Freeze a schedule and predicted phase costs for a tiny CPU gloo PP-plus-DP plan, using the same shapes and settings for every trial. Run correctness checks first, then time repeated warm steady-state steps without profiling and keep a separate labeled trace run. Reconcile the largest signed residual using a controlled change to one suspected term. With two or more GPUs, repeat on one GPU per NCCL rank with synchronized timing and measured device/link assumptions; keep that evidence separate.

**Traps**

- Calibrating on every observation and reporting only the revised prediction. That hides whether the model predicts unseen configurations.
- Adding durations from overlapping phases as if they were disjoint step components.
- Comparing a profiled cold step with an unprofiled steady-state prediction, or omitting checkpoint cost while calling the result end to end.

**Practice**

- The section mini-project covers this: trainlab's frozen prediction, repeated-trial manifest, largest-residual attribution and held-out configuration check.

**Stop when:** You retain the original prediction, raw trials and manifest, explain the largest residual with a controlled comparison, and test the revised assumption on a new configuration.

<details>
<summary>Self-test</summary>

1. What does a negative timing residual mean?
   - The observed duration is shorter than predicted. Possible causes include pessimistic rates or more overlap, but check equal work and timing boundaries before explaining it.
2. Why can the sum of phase durations exceed measured step time?
   - Some phases run concurrently. Their sum counts overlapping intervals more than once.
3. Which test separates a bad link-rate assumption from a data-loader delay?
   - Hold tensors and compute fixed, remove input preparation with resident synthetic batches, then inspect transfer intervals and exposed wait. Preserve both runs and their changed input assumption.

</details>

#### U12. Correctness tests for a composed 2D or 4D plan

**About 4 h** · **Target:** Implement

Topics: Correctness tests for a composed 2D or 4D plan

Correct dimensions in isolation do not guarantee a correct composition. The same global batch and optimizer state must produce the intended update after group construction, accumulation and transfers interact.

**You can now**

- Execute a CPU-safe composed plan and compare outputs, global loss, gradients and updates with an unpartitioned oracle.
- Test sample identity, global normalization and complete state ownership across groups.
- Localize a composition defect with group, tensor-layout and collective-order evidence.

**Study**

1. [A composed PP-plus-DP numerical check](https://github.com/hkproj/torchfeather/blob/c416ab1ad0fd3567a0a6c8ad0da570c8fd6e55aa/minimal_examples/pp_gpipe.py) (TorchFeather - ParallelDims and Composition Plan) - `run_schedule`, `average_gradients`, `run_reference`, `assert_parameter_gradients_match` and the assertions in `main`.
2. [Compare a second composition's ownership](https://github.com/LambdaLabsML/distributed-training-guide/blob/aed748914472cca80d8cfe139ab43ec63103913a/07-2d-parallel/README.md) (Distributed Training Guide - Chapter 7 FSDP plus TP) - Applying FSDP after TP and Controlling TP size. Depth: Read the ownership path without launching the GPU trainer. Extend CPU checks with the reduced sharding and TP mechanisms you already built; the README has no independent update oracle.

**Focus**

- The supplied example checks two-stage PP with four DP replicas on CPU gloo. It compares final-stage outputs and loss, and all stage-local parameter gradients; it does not step an optimizer or test checkpoint resume.
- Its reference averages gradients through the same DP groups. Add a stronger oracle that concatenates all replicas' distinct input and target tensors and computes one global mean loss in a single process.
- Keep model and data seeds, token identities, loss denominator and optimizer hyperparameters identical. Compare floating-point tensors with justified absolute and relative tolerances, not bitwise equality.
- Test nontrivial data on every replica, accumulation changes, tied-state ownership and invalid layouts. Log collective group, sequence, shape and dtype; reject known bad meshes before entering collectives.

**Reproduce:** Run the CPU example with its supplied model/data seeds and shapes. Then add one SGD update at learning rate 0.01 to a reduced PP-plus-DP trainer and to an independent concatenated-batch oracle. Compare stage parameters and global loss before and after the update, under a stated tolerance. Perturb one replica's reduction denominator and require the oracle test to fail; keep the first mismatching tensor and its owner.

**Traps**

- Reusing the distributed reduction in the only oracle. A wrong group or divisor can then appear correct in both paths.
- Claiming the supplied PASS message proves optimizer or recovery equivalence. Those are not tested by this example.
- Running every replica on identical data. That can hide missing synchronization and incorrect sample ownership.

**Practice**

- [TorchFeather CPU example: GPipe with replicated DP](https://github.com/hkproj/torchfeather/blob/c416ab1ad0fd3567a0a6c8ad0da570c8fd6e55aa/minimal_examples/pp_gpipe.py) - Run `torchrun --nnodes=1 --nproc-per-node=8 --master-port=29884 minimal_examples/pp_gpipe.py` from the repository root. The standalone example uses only PyTorch and CPU gloo; it passed on PyTorch 2.14.1. Its checks cover outputs, loss and averaged gradients for the stated fixture, not optimizer state. The section mini-project adds a concatenated-batch oracle, update checks and negative cases in trainlab.

**Stop when:** The supplied example passes, your independent oracle matches one composed SGD update, and a wrong reduction denominator produces a localized failing test.

<details>
<summary>Self-test</summary>

1. What is the reference loss for the example's equal-sized DP replicas?
   - The supplied reference is per replica: the mean squared error on that replica's own 8-sample batch. Its global equivalent is the mean squared error over the concatenation of all replicas' outputs and targets; with equal local sizes averaging the local means gives the same value, while unequal sizes need count weighting. Your added oracle should compute the concatenated form directly.
2. Why compare gradients as well as final parameters?
   - A small learning rate or rounding can hide a gradient-scale defect in parameters. Gradients expose the error before the optimizer transforms it.
3. Does one-step equivalence establish long-run convergence equivalence?
   - No. It checks a bounded update contract. Stochastic streams, repeated numerical error and altered optimization policies need trajectory or convergence evidence.

</details>

#### U13. Plan ranking under uncertain bandwidth and heterogeneous devices

**About 3 h** · **Target:** Derive

Topics: Automated plan ranking under uncertain bandwidth; Heterogeneous device planning

This optional extension turns a point estimate into a decision boundary. It is useful when device types differ or the available link rate is not yet known, without requiring a heterogeneous fleet.

**You can now**

- Derive a plan crossover and report when a bandwidth interval leaves the ranking unresolved.
- Partition stages using device-specific capacity and compute rates instead of fleet averages.
- Test ranking sensitivity to latency, reserve, sequence, batch and stage imbalance.

**Study**

1. [Expose the assumptions behind a ranking](https://jax-ml.github.io/scaling-book/training/#combining-fsdp-and-tensor-parallelism) (How to Scale Your Model - Chapters 4 to 6) - Combining FSDP and Tensor Parallelism: continuous optimum and compute-to-communication ratio. Depth: Vary rates and legal integer factors instead of assuming the continuous optimum survives uncertain bandwidth.
2. [Device-specific partitions and virtual-worker placement](https://arxiv.org/html/2005.14038v1#S7) (HetPipe - Heterogeneous Partitioning and Placement) - arXiv:2005.14038v1, Section 4 Pipelined Model Parallelism Within a VW (Model Partitioning paragraph), Section 7 Partitioning Algorithm and Section 8.1 Methodology (resource allocation for virtual workers). Depth: Stop before reproducing the system. Its TensorFlow experiments use stale-weight WSP semantics; borrow the cost and placement questions for a synchronous simulator, not its update rule. It does not evaluate heterogeneous link rates.

**Focus**

- For two serialized cost models $`T_A(w)=a_A+S_A/w`$ and $`T_B(w)=a_B+S_B/w`$, solve their equality before ranking. Latency, overlap and routing can require a richer model; name what this abstraction omits.
- A ranking is robust over an interval only if it remains feasible and preferred throughout that interval. Endpoint checks suffice for a monotone difference in the simple model, not for arbitrary piecewise schedules.
- Use compute cost by layer and device type, peak memory by assigned stage and communication by actual route. Averages can hide both a slow stage and a small-memory device.
- Sweep uncertain bandwidth, latency and reserve alongside sequence, batch and stage balance. Report rank reversals and feasibility cliffs; do not assign a probability without a distributional assumption.

**Reproduce:** Use synthetic, serialized models: plan A has 12 ms of non-transfer cost and 120,000,000 transmitted bytes; plan B has 20 ms and 40,000,000 bytes. With shared egress rate between 5 and 20 GB/s, zero launch latency and no overlap, derive the crossover at 10 GB/s and show both endpoint winners. Separately partition 12 identical layers, each costing one work unit, between devices sustaining 2 and 1 work units per time unit. With zero transfer cost and capacity for eight layers on each device, enumerate contiguous cuts and recover the balanced 8/4 split. Then add activation lifetimes and a slow link to see when that split ceases to win.

**Traps**

- Calling the nominal-rate winner robust when the supplied rate interval crosses its decision boundary.
- Aggregating memory across devices. An allocation fails if any assigned rank's peak exceeds that device's usable capacity.
- Copying an asynchronous paper's convergence claim into a synchronous update-equivalence contract. Different update semantics need separate evidence.

**Practice**

- The section mini-project covers this: trainlab's optional bandwidth sensitivity and heterogeneous-stage simulation with rank-reversal and capacity-cliff reports.

**Stop when:** Your sensitivity report distinguishes robust and unresolved rankings and your heterogeneous simulation checks every device's peak under a stated synchronous schedule.

<details>
<summary>Self-test</summary>

1. Which synthetic plan wins at 5 and 20 GB/s?
   - At 5 GB/s, A takes 36 ms and B 28 ms, so B wins. At 20 GB/s, A takes 18 ms and B 22 ms, so A wins. They tie at 24 ms at 10 GB/s.
2. Why is the zero-transfer heterogeneous split 8/4 rather than 6/6?
   - Eight layers on the faster device and four on the slower both take 4 time units. The equal split takes 3 and 6, so its slowest stage is worse.
3. Do overlapping plan-time intervals prove a rank reversal?
   - No. Both plans may depend on the same uncertain quantities. Compare their paired costs under each admissible scenario, not independent interval extrema alone.

</details>

### Mini-project: Composed parallel plan with tested critical path

**About 16 to 24 hours.** Extend trainlab with a mesh planner that turns a world size into legal parallel layouts with predicted memory and step time. Validate every ledger against CPU collectives and independent oracles, and freeze one prediction to reconcile against measurement. Legal plans feed the recovery dossier and the capstone mesh choice.

1. Build the `plan/` mesh validator: dense and expert ownership tables, world-size factorization, rank-coordinate maps with round trips, group construction, and invalid-product rejection tested with CPU `gloo` collectives.
2. Add the batch-token ledger and layout validator: unique examples and valid tokens per update, divisibility tables for heads, widths, vocabulary, sequence, layers and experts, with invalid and uneven cases refused loudly.
3. Extend the ledger to per-rank state, buffers and checkpoint staging with live-window peaks, then add activation lifetimes and per-stage temporary memory under the pipeline schedules you validated earlier.
4. Derive per-layer FLOPs and the full collective-volume ledger across data, sharded, tensor, sequence, context, pipeline and expert dimensions, then map groups onto links with a contention table; solve the CS336 data-parallel, FSDP and TP calculations and the scaling-book sharding case first.
5. Build the composed critical-path simulator with imbalance cases and overlap-versus-serialization bounds, then compare three workload scenarios that keep batch and update fixed while naming the assumption that reverses each winner.
6. Extend the planner past the TensorTonic topology cases with sharding, expert reuse and schedule costs, keeping rejection reasons and adding no-feasible-plan and tied-score tests; freeze one prediction, reconcile the largest residual with a controlled change, and test a held-out configuration.
7. Run the TorchFeather composed CPU example, then add a concatenated-batch oracle with update checks and negative cases in trainlab; close with bandwidth-sensitivity and heterogeneous-stage simulations reporting reversals and capacity cliffs.

**Deliverables**

- The `plan/` mesh, batch, memory, volume and critical-path ledgers with the planner and its rejection record.
- CPU equivalence evidence: oracle comparisons, residual manifests with raw trials, and the held-out configuration report.
- The three-scenario comparison, sensitivity report, and the composed-oracle negative cases with first-mismatch owners.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [TensorTonic: Choose a Topology-Aware Parallel Plan](https://www.tensortonic.com/problems/cs336-l08-topology-aware-parallel-plan). Pass the public cases in your harness; keep the simplified scorer apart from the trainlab planner.
- external-tests: [TorchFeather CPU example: GPipe with replicated DP](https://github.com/hkproj/torchfeather/blob/c416ab1ad0fd3567a0a6c8ad0da570c8fd6e55aa/minimal_examples/pp_gpipe.py). Run the composed example on CPU; add the concatenated oracle and update checks in trainlab.
- external-tests: [CS336 Assignment 2 parallelism calculations](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/cs336_assignment2_systems.pdf). Solve the data, sharded, tensor and two-dimensional calcs on paper before trusting the ledger.
- external-tests: [How To Scale Your Model: sharding case](https://jax-ml.github.io/scaling-book/applied-training/#how-to-shard-llama-3-70b-for-training). Answer on paper first with TPU figures labeled as such; carry the comparison into trainlab.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Mesh legality | Ownership tables cover every rank once per mesh, round trips pass, and invalid products fail before group creation. | Dense and expert meshes share one world with distinct reduction groups named, plus a rejected configuration per rule. |
| Ledger accuracy | Batch, state, activation and volume ledgers match independent shape counts, and peaks come from live windows. | One controlled change moves the largest residual, and the held-out configuration report explains the miss. |
| Plan ranking | The search enumerates legal plans with rejection reasons, and the winner carries topology and batch constraints. | Sensitivity and heterogeneous runs name reversals and cliffs, and losing regimes stay in the report. |
| Composed correctness | The concatenated-batch oracle matches one update, and a wrong denominator fails with the owner named. | Negative cases cover uneven layouts and tied state, each localized to group, layout and collective order. |

Feeds into: The mesh validator, ledgers, planner and oracle feed the checkpoint restore mesh, the fleet measurements and the capstone dossier.

### Resource route

- **Primary - Book:** [The Ultra-Scale Playbook - 5D Parallelism and Finding the Best Configuration](https://nanotron-ultrascale-playbook.static.hf.space/index.html#5d_parallelism_in_a_nutshell) - Study 5D Parallelism in a Nutshell, then Finding the Best Training Configuration (fitting a step in memory, reaching the global batch, optimizing throughput) at https://nanotron-ultrascale-playbook.static.hf.space/index.html#finding_the_best_training_configuration. Rebuild a small planner that enumerates legal DP, TP, CP, PP and EP degrees and ranks them by predicted memory and step time; its heatmaps are its own H100 cluster's results.
- **Required - Implementation:** [Picotron - 4D Composition](https://github.com/huggingface/picotron) - Trace create_config.py, process_group_manager.py and train.py across DP, TP, PP and CP. Run the CPU 3D example or a smaller equivalent, assert group membership and compare observed event order with the planner.
- **Support - Course:** [First-Principles Video - Device Mesh Composition Segment](https://www.youtube.com/watch?v=XoGvCBRnwLs&t=31054s) - Watch 08:37:34 on device meshes and combining pipeline with data parallelism. Reconstruct its rank-coordinate table and compare it with Picotron process groups and your planner output.
- **Support - Lab:** [Distributed Training Guide - Chapter 7 FSDP plus TP](https://github.com/LambdaLabsML/distributed-training-guide) - Read the 2D FSDP plus TP path in `07-2d-parallel` and explain why FSDP is applied after TP and what limits the TP degree. Running it needs several GPUs.
- **Required - Book:** [How to Scale Your Model - Chapters 4 to 6](https://jax-ml.github.io/scaling-book/) - Use Part 4 (transformer math), Part 5 (training parallelism) and Part 6 (LLaMA 3 case study) to independently estimate parameters, FLOPs, memory, communication, time and cost for one configuration, then the GPU rooflines in Part 12. Keep TPU constants labeled and compare its recommendation with the Playbook.
- **Required - Paper:** [Efficient Large-Scale Language Model Training on GPU Clusters Using Megatron-LM](https://arxiv.org/abs/2104.04473) - Read the composition of tensor, pipeline and data parallelism, the interleaved schedule and the performance analysis of parallel configurations. Check its guidance against your planner on one model and cluster.
- **Required - Assignment:** [CS336 Assignment 2 (Spring 2026) - Section 8 Analyzing Parallelism Strategies](https://github.com/stanford-cs336/assignment2-systems) - Solve `data_parallel_calcs`, `fsdp_calcs`, `tp_calcs` and `fsdp_tp_calcs` (Sections 8.2 to 8.5) with your planner, and reconcile any disagreement before trusting either.
- **Support - Guide:** [Transformer Math 101 - Distributed Training](https://blog.eleuther.ai/transformer-math/) - Use the sharded-optimizer, 3D-parallelism and activation equations as a cross-check of your planner's memory terms.
- **Support - Implementation:** [TorchFeather - ParallelDims and Composition Plan](https://github.com/hkproj/torchfeather) - Inspect distributed/parallel_dims.py and model/parallelize.py. Build the exact mesh product and divisibility table for one FSDP, TP, CP, PP and EP configuration, then identify ordering assumptions in its composition.
- **Support - Practice:** [TensorTonic - Choose a Topology-Aware Parallel Plan](https://www.tensortonic.com/study-plans/language-modeling-from-scratch) - Solve Choose a Topology-Aware Parallel Plan, then compare its memory and communication model with yours.
- **Depth - Production reference:** [Nanotron](https://github.com/huggingface/nanotron) - Inspect configuration, parallel context and trainer paths used by the Ultra-Scale benchmarks only after the planner works. Its "3D" means DP, TP and PP: there is no context or expert parallelism.
- **Depth - Case study:** [Bumblebee - Parallel State and Composition](https://github.com/isLinXu/bumblebee) - Only as a possible capstone target: read `primitive/parallel/` and the composition tests in a clean checkout to compare TP, EP, ETP, CP and PP contracts. Its multi-GPU paths are untested upstream.
- **Support - Paper:** [HetPipe - Heterogeneous Partitioning and Placement](https://arxiv.org/html/2005.14038v1#S7) - Read arXiv:2005.14038v1 Section 4, Pipelined Model Parallelism Within a VW, for its Model Partitioning paragraph, Section 7, Partitioning Algorithm, and Section 8.1, Methodology, for resource allocation to virtual workers. Reuse device-specific compute, memory and placement constraints in a synchronous simulator; do not adopt its stale-weight update semantics or source speedups.

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

### Study units

#### U1. The recoverable state set and deterministic resume of samplers and RNG streams

**About 4 h** · **Target:** Implement

Topics: Model, optimizer, scheduler, scaler, RNG and dataloader state; Deterministic resume of sampler, shuffle and RNG streams

A resume that restores weights but not data position or RNG trains a different experiment while the loss looks normal. Every later unit in this section assumes this contract.

**You can now**

- List the complete resume state of a distributed job: model, optimizer, scheduler, scaler, every RNG stream, sampler position, and config and code identity.
- Resume a multi-process CPU job mid-epoch and prove the next batches, RNG draws and updates match an uninterrupted run.

**Study**

1. [Deterministic resume: RNG states and loader seeding](https://github.com/LambdaLabsML/distributed-training-guide/blob/aed748914472cca80d8cfe139ab43ec63103913a/related-topics/determinism/README.md) (Distributed Training Guide - Sharded Checkpoints, Determinism and Elastic Training) - Code Changes diff: `torch.use_deterministic_algorithms(True)`, a seeded `Generator` with `DistributedSampler`, `worker_init_fn=_seed_worker`, and save plus restore of `rng.pt` holding NumPy, Python, torch and per-device CUDA states.
2. [Crash-and-restart state discipline](https://github.com/LambdaLabsML/distributed-training-guide/blob/aed748914472cca80d8cfe139ab43ec63103913a/related-topics/elastic-training/toy.py) (Distributed Training Guide - Sharded Checkpoints, Determinism and Elastic Training) - `_STATE_PATH` load at start, `random.seed(rank + world_size * num_steps)` from the saved step, rank-0 write between two `dist.barrier()` calls; README Elastic Training: all workers restart on one failure and ranks are unstable across restarts.
3. [Every stream as a Stateful entry](https://github.com/hkproj/torchfeather/blob/c416ab1ad0fd3567a0a6c8ad0da570c8fd6e55aa/torchfeather/components/checkpoint.py) (TorchFeather - Distributed Checkpoint Manager) - `CheckpointManager.__init__` states map with `MODEL`, `OPTIMIZER`, `DATALOADER`, `LR_SCHEDULER` plus `additional_states`; `ModelWrapper`, `OptimizersContainer`, `LRSchedulersContainer` and `BaseDataLoader` each implement `Stateful`.

**Focus**

- Resume state is every stream that advances: parameters, optimizer moments and step counters, scheduler position, scaler state, each RNG stream, and the sampler epoch plus consumed offset. Each missing stream replays or skips data.
- Sampler resume needs the epoch and the offset inside it: same seed with `set_epoch`, then fast-forward past consumed batches. Restarting the iterator replays the epoch from batch 0.
- The DCP recipe's `AppState` holds model and optimizer only. Scheduler, scaler, RNG and loader state must be added as further `Stateful` entries, as TorchFeather's states map shows.
- Per-worker RNG needs per-worker construction. A `Generator` built in the `Dataset` constructor is copied identically into every worker and repeats its stream; reseed from `torch.initial_seed()` inside `worker_init_fn`.

**Reproduce:** On CPU with 2 gloo processes, train a tiny model with dropout under a `DistributedSampler` loader for 2 steps, and save model, optimizer, torch RNG state, sampler epoch and consumed count. Continue 2 steps as reference. Resume fresh objects from the save, fast-forward the loader, run 2 steps, and show `torch.equal` on weights. Then restart the loader from batch 0 and show the first batches repeat.

**Traps**

- Saving only model and optimizer. The loss curve looks normal while data order and schedule quietly diverge, so check the next-batch sequence, not just the loss.
- Treating the recipe's `get_state_dict` pattern as full resume. It manages FSDP names for model and optimizer but knows nothing of scheduler, scaler, RNG or loader position.
- Seeding `random.seed(rank + world_size * steps)` once and assuming draws stay aligned. Any extra draw on one rank desynchronizes the streams, so reseed from saved step counts at load.

**Practice**

- [Crash-and-restart loop with the guide `toy.py`](https://github.com/LambdaLabsML/distributed-training-guide/blob/aed748914472cca80d8cfe139ab43ec63103913a/related-topics/elastic-training/toy.py) - Run `toy.py` with two CPU processes with GPUs hidden so it uses gloo: let it crash once, restart, and show `num_steps` continues from the saved state. Each rank raises with probability 0.001 per step, so a 2-process run crashes within a few hundred steps (step 402 in about 2 s on CPU with PyTorch 2.14.1) and leaves `toy-state.json`; a rerun continues from it, so delete the file before a fresh start. Compare post-restart draws with an uninterrupted run and explain the gap: the script reseeds from the step count instead of restoring the RNG state.

**Stop when:** A mid-epoch resume reproduces the reference run's next batches and weights exactly on CPU, and you can name every stream in the checkpoint plus what breaks when each is dropped.

<details>
<summary>Self-test</summary>

1. A resumed run matches the reference loss for 50 steps, then diverges slowly. The checkpoint held model, optimizer and scheduler. Name the two most likely missing pieces and the test that tells them apart.
   - Sampler position and RNG state. Log the first batches after resume and compare with the reference batches at that step: repeated or shifted batches point to the sampler, identical batches with diverging updates point to an unrestored RNG stream.
2. Why does rank 0's file write in `toy.py` sit between two `dist.barrier()` calls?
   - The first barrier stops rank 0 from writing state for a step some rank has not finished. The second stops every rank from starting the next step before the write lands. Without them a crash leaves state ahead of or behind the slowest rank.
3. Two `DataLoader` workers emit identical augmentation streams. What was built in the wrong place, and where should it be built?
   - A `torch.Generator` built in the `Dataset` constructor was copied identically into both workers. Build or reseed it inside `worker_init_fn` from `torch.initial_seed()`.
4. `torch.get_rng_state()` is saved but CUDA draws still diverge after resume. What is missing?
   - The CUDA RNG states from `torch.cuda.get_rng_state_all()`, restored per device with `torch.cuda.set_rng_state`, plus the NumPy and Python states if the pipeline draws from them.

</details>

#### U2. Full and sharded formats and distributed checkpoint state-dict contracts

**About 4 h** · **Target:** Explain + Implement

Topics: Full versus sharded checkpoint formats; Distributed checkpoint state-dict contracts

Sharded checkpoints are the only format that scales past one device's memory. The state-dict contract of pre-allocated storage plus name management is what later makes resharding possible.

**You can now**

- Explain when each rank writes its own shard versus gathering a full copy, and what the `.metadata` plus one-file-per-rank layout guarantees.
- Save and load a tiny FSDP2 model with `get_state_dict` and `set_state_dict` plus a `Stateful` wrapper on CPU, and convert the result to a single-file torch checkpoint.

**Study**

1. [DCP save and load with FSDP2](https://docs.pytorch.org/tutorials/recipes/distributed_checkpoint_recipe.html) (PyTorch Distributed Checkpoint Recipes) - How DCP works: parallel save, reshard at load, multiple files with at least one per rank, in-place operation, `Stateful` handling; Saving: `AppState`, `get_state_dict`, `dcp.save`; Loading: rebuild model and optimizer first, then `dcp.load`, at the same or a different world size (page read 2026-10-14).
2. [Sharded save and load in the distributed-training guide](https://github.com/LambdaLabsML/distributed-training-guide/blob/aed748914472cca80d8cfe139ab43ec63103913a/04-fully-sharded-data-parallel/README.md) (Distributed Training Guide - Sharded Checkpoints, Determinism and Elastic Training) - Sharded Checkpoints with `StateDictOptions(full_state_dict=False, cpu_offload=True)`; Saving a sharded checkpoint: barrier, then all ranks call `get_state_dict` for one file per rank; Loading a sharded checkpoint: `get_state_dict`, `load`, `set_state_dict`; Converting a sharded checkpoint to a full state dict checkpoint. Depth: The chapter links the unversioned `stable` reference; read the 2.14 pages instead, where FSDP2 (`fully_shard`) is current and FSDP1 helpers are legacy.
3. [Formats: DCP versus `torch.save`](https://docs.pytorch.org/tutorials/recipes/distributed_checkpoint_recipe.html#formats) (PyTorch Distributed Checkpoint Recipes) - Formats: `dcp_to_torch_save` and `torch_save_to_dcp` with `python -m torch.distributed.checkpoint.format_utils dcp_to_torch <dir> <out>` (page read 2026-10-14).
4. [Per-rank files without DCP](https://github.com/huggingface/picotron/blob/59714b1bf25541dbeb6f5a721ed15f6d0768e786/picotron/checkpoint.py) (Picotron - Checkpoint State) - `CheckpointManager._get_checkpoint_path` names files by TP and PP rank; `save_checkpoint` writes model, optimizer, `trained_steps` and `trained_tokens` with `torch.save` from DP and CP rank 0 only; `load_checkpoint` assumes the same topology.

**Focus**

- DCP loads into pre-allocated storage: rebuild the model and optimizer before `dcp.load`, because sharding for the load plan comes from the live objects. `torch.load` needs only a path.
- Sharded means every rank saves. The checkpoint is the set of per-rank files plus `.metadata`; a missing shard is a corrupt checkpoint, not a smaller one.
- `get_state_dict` with `full_state_dict=False` keeps shards local with CPU offload; `True` gathers the full copy on each rank. Choose per use, not per habit: shards for training, full for export.
- Picotron's hand-rolled per-rank `torch.save` files carry no resharding metadata, so restore needs the identical TP and PP layout. That limitation is what DCP's planner plus `.metadata` removes.

**Reproduce:** On CPU with 2 gloo processes, save a `fully_shard` toy model plus Adam state with the recipe's `AppState`, mutate both, reload, and show all 16 flattened state entries equal with `torch.equal`. Then convert the directory with `dcp_to_torch_save`.

**Traps**

- Expecting `dcp.load` to create the model. It updates the passed state dict in place, so an unbuilt model gives it nothing to write into.
- Saving only on rank 0 with a sharded state dict. Skipped ranks lose their shards and `.metadata` describes files that do not exist.
- Reading one rank's `.distcp` file as a partial model. Shards are planner-assigned ranges, not layers; only `dcp.load` reassembles them.

**Practice**

- [PyTorch DCP recipe: FSDP save plus load, CPU-ported](https://docs.pytorch.org/tutorials/recipes/distributed_checkpoint_recipe.html) - Port the Saving and Loading examples to CPU with gloo and `torchrun --nproc-per-node 2` (no per-rank CUDA device): save after one step, mutate, reload, and assert bit-exact parameters and optimizer state; then run `dcp_to_torch_save` on the directory. The recipe targets an 8-GPU server with NCCL but the logic is identical on gloo. Expect `.metadata` plus one `__<rank>_0.distcp` per rank.

**Stop when:** Your CPU port saves, reloads bit-exactly and converts to a single file, and you can state which half of the contract (`get_state_dict` versus `set_state_dict`) each failure violates.

<details>
<summary>Self-test</summary>

1. Why does the DCP loading example rebuild the FSDP model and optimizer before calling `dcp.load`?
   - DCP loads in place into pre-allocated storage and takes each rank's sharding from the live objects. Without them it has nowhere to write and no resharding plan.
2. A 4-rank checkpoint directory holds `.metadata` and three `.distcp` files. Is it loadable?
   - No. One shard is missing, so the checkpoint is incomplete. Resume must refuse it and fall back to the last known good, never train on three quarters of the state.
3. When should `full_state_dict` be true at save time, and what does it cost?
   - Only to export for single-process use such as inference. Every rank gathers the full model, so peak memory holds the whole copy instead of one shard.
4. Picotron saves one `.pth` per TP and PP rank with `torch.save`. What breaks when the job restarts with a different TP degree?
   - Each file holds a fixed TP slice with no resharding metadata, and `load_checkpoint` assumes the same topology. The slices no longer match the new layout.

</details>

#### U3. Checkpoint manifests, schema versions and name and optimizer compatibility

**About 4 h** · **Target:** Implement

Topics: Checkpoint manifests, schema and version compatibility; Parameter-name and optimizer-state compatibility

Silent name or shape mismatches resume successfully and train the wrong model. The manifest turns that into a loud refusal or a logged remap.

**You can now**

- Write a checkpoint manifest with schema version, topology, config and code identity, and refuse resume on mismatch.
- Handle renamed parameters and missing or extra optimizer keys with explicit strict versus lax loading and a logged decision per key.

**Study**

1. [Nanotron serialization format and its limits](https://github.com/huggingface/nanotron/blob/fb0747bac263a4c3a8ff4d724869a533afb561d8/docs/docs.md) (Nanotron - Distributed Serialization) - Distributed serialization mechanism: `checkpoint_metadata.json` with version and topology, per-rank optimizer, scheduler and `random` shards, model `safetensors`; checkpoints are NOT topology agnostic because of `random_states` and sharded tensors, with the `checkpoint_reshape` plan.
2. [Keys, versions and partial loading](https://github.com/pytorch/torchtitan/blob/0b75362025f037a2d1a23240ba21786928a9052e/docs/checkpoint.md) (TorchTitan - Checkpointing) - EXCLUDING SPECIFIC KEYS FROM CHECKPOINT LOADING with `exclude_from_loading` for `dataloader`, `lr_scheduler` and `ema` plus the cold-start warning; Creating a seed checkpoint; Conversion support for HuggingFace and Torch formats.
3. [Minimal manifest probe and strictness choices](https://github.com/hkproj/torchfeather/blob/c416ab1ad0fd3567a0a6c8ad0da570c8fd6e55aa/torchfeather/components/checkpoint.py) (TorchFeather - Distributed Checkpoint Manager) - `_find_load_step`: `step-*` directories count only with a `.metadata` probe; `ModelWrapper.load_state_dict` uses `StateDictOptions(strict=False)` and rebuilds its cache; `load` with `step == 0` loads model weights only.

**Focus**

- A manifest answers four questions before training resumes: which schema version, which topology produced this, which config and code, and which keys with which shapes. Anything less is directory discovery, not a manifest.
- `strict=False` is a policy, not a default to copy. TorchFeather uses it for model weights so renamed runs still load, but every skipped or remapped key must be logged, and optimizer state needs stricter handling because a dropped moment silently restarts adaptation.
- Seed checkpoints separate initialization from training. TorchTitan builds weights once on one device and DCP-reshards them anywhere, so layout never leaks into the initial weights.
- Nanotron's format shows why manifests must record topology. Per-rank optimizer and RNG shards have no defined meaning under a new TP, DP or PP layout, so the honest manifest refuses rather than guesses.

**Reproduce:** Write a three-key manifest (schema version, topology, config hash) for a toy checkpoint, then demonstrate all three refusals: bump the schema, rename one parameter under strict loading, and delete `.metadata`. Each must fail loudly with the cause named. Catch a failed `dcp.load` as `CheckpointException`: in PyTorch 2.14.1 it derives from `BaseException`, so `except Exception` lets it through.

**Traps**

- Trusting file names as a manifest. `step-12` without a `.metadata` probe is an interrupted write; TorchFeather's loader skips it, and yours must too.
- Excluding a key from loading and forgetting to remove the exclusion. TorchTitan's EMA note shows the failure: every later resume cold-starts the EMA and discards its history.
- Reloading optimizer state whenever shapes match. Changed `betas` or `eps` keep shapes but change the update, so record hyperparameters in the manifest and refuse or warm-start explicitly.

**Practice**

- [TorchTitan CPU checkpoint suite](https://github.com/pytorch/torchtitan/blob/0b75362025f037a2d1a23240ba21786928a9052e/tests/unit_tests/cpu/test_checkpoint.py) - Run `tests/unit_tests/cpu/test_checkpoint.py`: save, load, `load_step` selection and purge cases on CPU. Run in the repo's dev environment on CPU; the full trainer needs GPUs. Read the case names as the manifest contract: latest-complete selection, key exclusion, stale cleanup.

**Stop when:** Your loader refuses a version bump, a renamed parameter under strict mode, and a manifest-less directory, each with a message naming the cause; lax loads log every remapped key.

<details>
<summary>Self-test</summary>

1. A checkpoint directory contains `step-9` with shards but no `.metadata`, plus a complete `step-8`. Which step loads, and why?
   - Step 8. Without the manifest probe the newer directory is an interrupted write, so the loader takes the newest complete checkpoint.
2. After enabling EMA mid-run, resume fails on a missing `ema` key. What is the one-resume fix, and what must happen right after?
   - Exclude `ema` from loading once so it cold-starts from the loaded weights, then remove the exclusion so later resumes keep the EMA history.
3. A renamed layer loads with `strict=False` and training continues. What two records make this safe instead of silent?
   - The manifest's map from old to new key names, and a load log of every skipped, remapped and shape-changed key. Unlogged lax loading is silent corruption.
4. Why does Nanotron record topology in `checkpoint_metadata.json` instead of attempting cross-topology loads?
   - Its per-rank optimizer and RNG shards are only defined under the saving layout. The metadata states that assumption, so a changed mesh fails loudly instead of misassigning state.

</details>

#### U4. Atomic publish, commit markers, checksums and corruption detection

**About 4 h** · **Target:** Implement

Topics: Atomic publish with temporary paths and commit markers; Checksums, completeness validation and corruption detection

A crash during a write is normal at scale. Without atomic publish the newest checkpoint is the corrupt one, and without checksums that corruption trains silently.

**You can now**

- Publish a sharded checkpoint so readers only ever see complete versions: temp directory, barrier, atomic replace, manifest last.
- Detect corruption with per-shard checksums plus a completeness check, and fall back to the last known good.

**Study**

1. [Temporary-directory publish with barriers](https://github.com/allenai/OLMo-core/blob/5f6f58a133e7ef577d596295f2c8db4651c27857/src/olmo_core/train/checkpoint.py) (OLMo-core Checkpointer) - `_temporary_wd` with `_get_tmp_dir` (`<name>-tmp`), `_teardown_tmp_dir` (barrier, rank-0 `replace`, visibility `wait_for`), `_prepare_dir` barrier discipline, `_save_metadata` writing rank-0 `.metadata.json` last.
2. [Checksums on every sync](https://github.com/stas00/ml-engineering/blob/139708e52cb06f9191cf1d9959def9187b205c58/storage/README.md) (Machine Learning Engineering Open Book - Checkpoints, Storage and Fault Tolerance) - Don't forget the checksums: verify MD5 or SHA256 on sync because some tools skip it; slow but safe.
3. [Commit marker on the read path](https://github.com/hkproj/torchfeather/blob/c416ab1ad0fd3567a0a6c8ad0da570c8fd6e55aa/torchfeather/components/checkpoint.py) (TorchFeather - Distributed Checkpoint Manager) - `_find_load_step` `.metadata` probe for newest complete step; `_purge_stale_checkpoints` rank-0 only with sorted `step-*` selection.
4. [Check-and-verify against silent corruption](https://mlsysbook.ai/vol2/fault_tolerance/fault_tolerance.html) (Machine Learning Systems Volume II - Chapter 7 Fault Tolerance) - Check-and-Verify: Defending Against Silent Data Corruption, with Napkin Math 1.2: hash each gradient shard or reduced buffer and block the optimizer step on digest mismatch.

**Focus**

- Publish order is the whole protocol: write shards to a temp directory, barrier, atomically replace onto the final name, then write the manifest. Readers list only final names and require the manifest.
- The manifest is the commit marker. A directory without it is garbage from an interrupted write, however new its shards are.
- Checksums catch bit rot and truncated transfers; completeness (every shard present, sizes matching the manifest) catches interruption. Run both: a complete set of corrupt shards and a pristine subset both refuse.
- Hash in-flight reductions too, not just files at rest. Check-and-verify compares digests across ranks before the optimizer step, because a corrupt buffer poisons weights no disk checksum can see.

**Reproduce:** Kill a two-process CPU save between the last shard write and the replace, and show the loader ignores the temp directory and loads the previous complete checkpoint. Then flip one byte in a good shard and show the checksum check refuses the checkpoint.

**Traps**

- Writing shards straight into the final directory. A crash mid-write leaves the newest version half complete, and the loader cannot tell it from a good one.
- Checksumming the archive but skipping per-shard hashes. One corrupt shard then invalidates the whole checkpoint with no way to name the bad file.
- Syncing file data but ignoring the directory entry. The earlier unit Files, page cache, fsync, atomic rename and durability covers the full contract: each file made durable first, then the rename, with the containing directory made durable.

**Practice**

- [Atomic publish plus tamper refusal in your own harness](https://github.com/allenai/OLMo-core/blob/5f6f58a133e7ef577d596295f2c8db4651c27857/src/test/train/checkpoint_test.py) - Mirror the `run_checkpointer` assertions (`dir_is_checkpoint`, `find_checkpoints`, `latest_checkpoint`, reload equivalence) for a temp-dir publish with manifest plus per-shard SHA256, and add a one-byte tamper case that refuses the checkpoint. Implement in your own repository on CPU with small shards. The OLMo suite is the layout contract, not a drop-in dependency.

**Stop when:** An interrupted publish never appears on the load path, a tampered shard is named by its checksum failure, and both cases fall back to the previous complete checkpoint.

<details>
<summary>Self-test</summary>

1. Ranks finish writing shards at different times and rank 0 replaces the temp directory as soon as its own shard lands. What breaks?
   - The replace publishes an incomplete checkpoint. The barrier before teardown exists so every rank's shards are durable before any reader can see the final name.
2. Every shard verifies against its checksum but training still diverges right after resume. Which check is missing?
   - Completeness against the manifest: a stale shard from an older step carries a valid checksum. Sizes, versions and the full shard set must match too.
3. Why is the manifest written after the replace rather than before the shards?
   - The manifest is the commit marker. Written early it commits shards that do not exist yet; written last it certifies exactly what is durable.
4. A gradient shard's checksum matches on disk but the loss spikes after one AllReduce. Where did verification miss?
   - In flight: silent corruption during the reduction never touched the disk copy. Check-and-verify hashes reduced buffers across ranks before the optimizer step.

</details>

#### U5. Coordinated saves, asynchronous checkpointing and staging memory

**About 5 h** · **Target:** Explain + Measure

Topics: Rank participation and coordinated save barriers; Synchronous versus asynchronous checkpointing; Staging buffers and host-memory pressure during async save; Asynchronous checkpoint isolation with a separate process group

Synchronous saves stop the world; asynchronous saves move the cost to host memory and a background thread. Ranks that disagree on participation corrupt the checkpoint either way.

**You can now**

- Explain who must participate in a save and where the barriers go, including the separate-group isolation pattern.
- Measure synchronous pause against asynchronous overlap on CPU and state the staging memory cost of each mode.

**Study**

1. [The async DCP recipe](https://docs.pytorch.org/tutorials/recipes/distributed_async_checkpoint_recipe.html) (PyTorch Distributed Checkpoint Recipes) - Asynchronous Checkpointing Overview: copy to CPU buffers first, memory rises by per-rank size times ranks, one outstanding request at a time; Fully Asynchronous Staging with `DefaultStager` (new in 2.9): `staging_completion` before `optimizer.step`, `upload_completion` join; Even more performance with Pinned Memory: `FileSystemWriter(cache_staged_state_dict=True)` keeps a persistent buffer (page read 2026-10-14).
2. [Coordinated async with an isolated group](https://github.com/hkproj/torchfeather/blob/c416ab1ad0fd3567a0a6c8ad0da570c8fd6e55aa/torchfeather/components/checkpoint.py) (TorchFeather - Distributed Checkpoint Manager) - `AsyncMode` with `dist.new_group(backend="gloo")` for `async_save_pg` with all ranks participating; `_async_wait` before each new save and in `close`; the last-step save forced synchronous; garbage collection around async saves.
3. [Async modes and staging waits](https://github.com/pytorch/torchtitan/blob/0b75362025f037a2d1a23240ba21786928a9052e/torchtitan/components/checkpointer/dcp.py) (TorchTitan - Checkpointing) - `AsyncMode` with `DISABLED`, `ASYNC` and `ASYNC_WITH_PINNED_MEM`; `DefaultStager` with `StagingOptions`; `_maybe_wait_for_staging` separating staging from upload completion.
4. [All ranks enter every save](https://github.com/LambdaLabsML/distributed-training-guide/blob/aed748914472cca80d8cfe139ab43ec63103913a/04-fully-sharded-data-parallel/README.md) (Distributed Training Guide - Sharded Checkpoints, Determinism and Elastic Training) - Saving a sharded checkpoint: `dist.barrier`, then all ranks call `get_state_dict` because every shard is needed.

**Focus**

- Every rank participates in every save. DCP plans across the group, so a rank that skips `save` breaks the plan for all. Barrier before, join the future before the next save.
- Async staging copies parameters to CPU buffers first so training continues. The copy costs per-rank size times ranks of host memory, and pinned buffers persist between saves instead of releasing.
- With a `DefaultStager` doing asynchronous staging, `async_save` returns two futures with two deadlines: `staging_completion` must resolve before `optimizer.step` mutates the parameters, and `upload_completion` before the next save reuses the buffers or the job exits. The CPU default path stages synchronously and returns one future; join it before the next save or the exit.
- Isolate checkpoint collectives on their own process group, as TorchFeather's gloo `async_save_pg` does, so save coordination never interleaves with training collectives.

**Reproduce:** Time 5 synchronous `dcp.save` calls against 5 `async_save` calls with joining on CPU, and report both totals plus how many staging copies are held at once. Then destroy the process group right after the last `async_save` without joining: on 2 CPU processes with PyTorch 2.14.1 this left `.metadata` plus only rank 0's shard, with exit code 0. A plain exit without the destroy still completes, because the interpreter waits for the background thread.

**Traps**

- Queueing a second `async_save` before joining the first. Each outstanding request holds a full staging copy, and on one `gloo` group the two background saves interleave their collectives: in a 2-process CPU run both timed out and neither checkpoint was written.
- Calling `optimizer.step` right after `async_save` with a `DefaultStager`. The device-to-host copy may still be in flight, so wait on `staging_completion` first or the checkpoint captures half-updated weights.
- Tearing down while the future is pending. Join first, as TorchFeather's `close` does with `_async_wait` before destroying its group: destroying the group with the save in flight produced `.metadata` plus one of two shards and a clean exit code.

**Practice**

- [PyTorch async DCP recipe loop, CPU-ported](https://docs.pytorch.org/tutorials/recipes/distributed_async_checkpoint_recipe.html) - Port the 10-step `async_save` loop to CPU gloo: one outstanding request with a `.result()` join per step, then add the `DefaultStager` variant with `staging_completion` before `optimizer.step` and `upload_completion` at the end; time the pause against synchronous `dcp.save`. The recipe uses CUDA devices. On CPU there is no device-to-host copy, so timings compare API overhead and disk writes only. GPU staging overlap needs two or more GPUs; state that condition in your notes.

**Stop when:** Your CPU port joins exactly one outstanding request per step, separates staging from upload completion in the `DefaultStager` variant, and your timings state which costs transfer to GPUs and which do not.

<details>
<summary>Self-test</summary>

1. Training continues immediately after `async_save` returns. What protects the checkpoint from the next `optimizer.step`?
   - The staging copy: parameters are first copied to CPU buffers, and the step mutates device weights, not the staged copy. With `DefaultStager` the copy itself is asynchronous, so `staging_completion` must resolve before the step.
2. Two ranks save while a third skips the call and keeps training. What happens at load?
   - The save plan assumed all ranks, so the checkpoint is missing a shard while `.metadata` disagrees with the files. Every rank must enter every save.
3. Why does TorchFeather create a separate gloo group for async saves instead of reusing the training group?
   - So checkpoint coordination traffic and barriers never interleave with training collectives on the default group. The save path gets its own ordering domain.
4. Host memory grows with every checkpoint although each save completes. What was kept, and what releases it?
   - The pinned staging buffer from `cache_staged_state_dict=True`, which persists between saves by design. Only destroying the writer releases it; without the cache, buffers release at each save's completion.

</details>

#### U6. Checkpoint frequency, save cost, lost work and recovery objectives

**About 4 h** · **Target:** Derive

Topics: Checkpoint frequency, save cost and recomputation loss; Incremental and differential checkpoint vocabulary; Recovery point and recovery time objectives

Every checkpoint policy is one trade: frequent writes burn throughput, rare writes burn rework. RPO and RTO turn that trade into objectives the schedule must meet.

**You can now**

- Derive the Young-Daly interval from write time and system MTBF and recompute the chapter's worked numbers.
- State RPO and RTO for a job and show how interval, retention and recovery time each move them.
- Use incremental and differential vocabulary precisely: what each reuses and what a restore needs.

**Study**

1. [The interval model](https://mlsysbook.ai/vol2/fault_tolerance/fault_tolerance.html) (Machine Learning Systems Volume II - Chapter 7 Fault Tolerance) - Checkpointing: Preserving Progress with Definition 1.1; Checkpoint interval from failure analysis with Figure 25 and Napkin Math 1.3; Systems Perspective 1.3 on Young-Daly assumptions; Checkpoint overhead analysis; The stop-the-world cost.
2. [Recovery budgets and vocabulary](https://mlsysbook.ai/vol2/fault_tolerance/fault_tolerance.html) (Machine Learning Systems Volume II - Chapter 7 Fault Tolerance) - Failure Detection and Recovery with equation 9 for recovery time; Checkpoint 1.4: Reasoning about the checkpoint tax; appendix Reliability Foundations: Checkpoint Optimization, Recovery Budgets, Strategy Selection.
3. [Frequency arithmetic from production](https://github.com/stas00/ml-engineering/blob/139708e52cb06f9191cf1d9959def9187b205c58/training/fault-tolerance/README.md) (Machine Learning Engineering Open Book - Checkpoints, Storage and Fault Tolerance) - Frequent checkpoint saving: BLOOM-176B wrote 2.3TB in 40 seconds on 384 processes every 3 hours, 720 saves totalling 8 hours (0.37 percent); keep the 2 most recent checkpoints local for fast resume.
4. [Failure rates to plan against](https://arxiv.org/abs/2407.21783) (The Llama 3 Herd of Models - Reliability and Operational Challenges) - Section 3.3.4 Reliability and Operational Challenges with Table 5: 466 interruptions over a 54-day snapshot, 47 planned and 419 unexpected; Section 3.3.1 storage on bursty writes and minimizing pause time (arXiv:2407.21783v3).
5. [Incremental checkpoints and their restore chain](https://mlsysbook.ai/vol2/data_storage/data_storage.html) (Machine Learning Systems Volume II - Chapter 7 Fault Tolerance) - Checkpoint Storage: the paragraph beginning "Incremental checkpointing offers a further optimization". Depth: It defines an incremental checkpoint as changes since the last full one, which backup vocabulary calls differential, yet restores it by applying a chain of increments. Use this unit's two definitions and record in the manifest which one each partial checkpoint follows.

**Focus**

- Total waste is write cost plus expected rework: $`T_{\text{write}} / \tau + \tau / (2 \cdot \text{MTBF})`$. The Young-Daly interval $`\tau_{\text{opt}} = \sqrt{2 \cdot T_{\text{write}} \cdot \text{MTBF}}`$ sits at its minimum. Derive it by differentiating, not by quoting.
- Restart time is a per-failure term, not a smaller write time. Folding restart into the square root needs a recovery-aware model, as Systems Perspective 1.3 warns.
- RPO is the oldest state you can lose, bounded by interval plus retention gaps. RTO is detect plus restart plus load plus warmup, the chapter's equation 9. Interval moves RPO; recovery engineering moves RTO. Both terms come from SLIs, SLOs, error budgets and recovery objectives, applied here to checkpoints.
- Incremental checkpoints store changes since the last checkpoint of any kind; differential store changes since the last full one. Restore needs the base plus every incremental since, or the base plus the latest differential. Neither replaces a correct full checkpoint. The storage chapter uses incremental for since-last-full deltas, so name the definition you use.

**Reproduce:** Closed-book, recompute Napkin Math 1.3 (37-second writes with 3.69-hour MTBF give a 991-second interval at 7.5 percent total waste) and the BLOOM overhead (720 saves of 40 seconds are 8 hours, 0.37 percent of 90 days).

**Traps**

- Setting the interval from write time alone, or quoting the chapter's 16.5-minute interval as a recommendation. The formula needs the fleet MTBF as its second input, and that worked number belongs to a 10,000-GPU cluster with 37-second writes.
- Trusting the printed Table 5 percentages. The counts sum to 419 but the Faulty GPU share (30.1 percent) disagrees with its count (148 of 419 is 35.3 percent), so plan from counts and recompute shares yourself.
- Calling RTO the checkpoint write time. RTO includes detection, scheduling, loading and warmup, which run 3 to 5 times the write in production.

**Practice**

- [MLSys Checkpoint 1.4: Reasoning about the checkpoint tax](https://mlsysbook.ai/vol2/fault_tolerance/fault_tolerance.html) - Checkpoint 1.4: Young-Daly shift, Two-sided tax, Faster writes, Square-root scaling. Answer all four boxes on paper first: recompute Napkin Math 1.3 and the Llama 3 fleet MTBF (419 over 54 days) before checking against the text.

**Stop when:** You derive the interval from the tax expression without notes, recompute both worked numbers exactly, and can state your own job's RPO and RTO with the input each depends on.

<details>
<summary>Self-test</summary>

1. Derive the Young-Daly interval from the two-sided tax.
   - Minimize $`T_{\text{write}} / \tau + \tau / (2 \cdot \text{MTBF})`$ over $`\tau`$: $`-T_{\text{write}} / \tau^2 + 1 / (2 \cdot \text{MTBF}) = 0`$, so $`\tau = \sqrt{2 \cdot T_{\text{write}} \cdot \text{MTBF}}`$.
2. A cluster doubles in size and system MTBF halves with write time fixed. How does the optimal interval move?
   - It shortens by $`\sqrt{2}`$: the new interval is $`\tau / \sqrt{2}`$, since only the MTBF term changes.
3. Llama 3 saw 419 unexpected interruptions in 54 days. What fleet MTBF does that imply, and what is it for?
   - About 3.1 hours (54 times 24 divided by 419). It is the MTBF input to the interval model for a fleet of that scale, not a constant for all jobs.
4. A job keeps hourly checkpoints with a 10-minute RTO and the last two are corrupt. What are the realized RPO and recovery time?
   - Up to 3 hours of lost work: the newest usable checkpoint is the third most recent. Recovery still takes the 10-minute RTO on top. Retention depth is part of the RPO, not just the interval.

</details>

#### U7. Restoring onto a different world size or mesh

**About 4 h** · **Target:** Implement

Topics: World-size and mesh resharding on restore

Jobs rarely restart on identical hardware. Resharding turns a checkpoint from a same-mesh snapshot into portable state.

**You can now**

- Load a sharded checkpoint onto a different world size and prove full-parameter equality.
- Explain which state reshards cleanly (parameters, aligned optimizer moments) and which does not (RNG streams, topology-bound shards).

**Study**

1. [Reshard across topologies at load](https://docs.pytorch.org/tutorials/recipes/distributed_checkpoint_recipe.html) (PyTorch Distributed Checkpoint Recipes) - How DCP works: save on any number of ranks, then re-shard across differing cluster topologies at load time; Loading: same or different world size with the pre-allocated destination plan; Formats for the single-file export path (page read 2026-10-14).
2. [Seed checkpoints and resharding](https://github.com/pytorch/torchtitan/blob/0b75362025f037a2d1a23240ba21786928a9052e/docs/checkpoint.md) (TorchTitan - Checkpointing) - Creating a seed checkpoint: every parallelism degree set to 1 on one device, then loaded anywhere via DCP resharding.
3. [Why resharding is hard](https://github.com/huggingface/nanotron/blob/fb0747bac263a4c3a8ff4d724869a533afb561d8/docs/docs.md) (Nanotron - Distributed Serialization) - Distributed serialization mechanism: checkpoints are NOT topology agnostic because of `random_states` and sharded tensors, with the `checkpoint_reshape` plan; optimizer states aligned with parameters as the reshardable part.
4. [The no-reshard baseline](https://github.com/huggingface/picotron/blob/59714b1bf25541dbeb6f5a721ed15f6d0768e786/picotron/checkpoint.py) (Picotron - Checkpoint State) - `load_checkpoint`: Assume the topology is the same, with per-TP and PP-rank `.pth` names, so resume never remaps across degrees; `adjust_tensor_size` belongs to the separate Hugging Face initialization path, where it slices embedding, output-projection and MLP weights by TP rank but takes the leading rows of q, k and v on every rank.

**Focus**

- DCP resharding is a load-time plan from saved shards to live objects: same files, new layout, decided from the destination model's sharding. Nothing in the checkpoint changes.
- Parameters and their aligned optimizer moments remap; RNG streams do not. Two streams at $`\text{TP} = 2`$ have no $`\text{TP} = 1`$ equivalent, so a resharded resume reseeds or replays RNG explicitly.
- A seed checkpoint is the extreme case: build once at degree 1, reshard everywhere. It separates initialization randomness from layout.
- Picotron resumes only onto the saving layout. Its slicer serves initialization from full Hugging Face weights, and even there its q, k and v slices ignore the TP rank. Shrinking from $`\text{TP} = 4`$ onto $`\text{TP} = 2`$ needs concatenation across files, which only a planner (DCP) or an explicit reshape provides.

**Reproduce:** Save a `fully_shard` toy model plus Adam state at world size 2 on CPU, load it at world size 1 over differently seeded initialization, and show the full parameter tensors equal the world-size-2 reference exactly.

**Traps**

- Assuming shard files map to ranks. Planner-assigned ranges follow the destination layout; a new rank's slice may come from any old file.
- Resharding the model but skipping the moments check. Moments follow parameters only while the parameter-to-state alignment holds, so verify moments per parameter after the move.
- Expecting the sampler position to survive a world-size change. Per-rank data ownership changes with the new degree, so recompute the shard assignment and resume from a global step, not a rank offset.

**Practice**

- [DCP recipe Loading example across world sizes](https://docs.pytorch.org/tutorials/recipes/distributed_checkpoint_recipe.html) - Loading: rebuild the model at the new world size, then `dcp.load` the old `checkpoint_id`; assert full-parameter equality with a `full_state_dict=True` comparison. Proven pattern on CPU gloo: save at 2 processes, load at 1, all 4 parameter tensors bit-exact. Check optimizer moments the same way when the optimizer configuration is unchanged.

**Stop when:** A 2-to-1 CPU restore matches the reference bit-exactly on parameters, and you can state for each state class (parameters, moments, RNG, sampler) whether it reshards, reseeds or recomputes.

<details>
<summary>Self-test</summary>

1. A 4-rank checkpoint loads onto 2 ranks. Where does the second rank's new slice come from?
   - Wherever the load plan puts it: DCP reads all saved shards and writes each destination rank its new slice. Files are not rank-addressed.
2. After a restore from $`\text{TP} = 2`$ to $`\text{TP} = 1`$, loss matches but later dropout draws differ from the same-mesh resume. Is the restore broken?
   - No. Parameters and optimizer state reshard, but RNG streams have no cross-topology equivalent, so dropout draws legitimately differ. Statistical match is the right bar for that stream.
3. Why can a seed checkpoint initialize any mesh while a training checkpoint cannot resume on any mesh without extra work?
   - The seed holds only initial weights, which slice cleanly. A training checkpoint also holds optimizer moments, scheduler position, RNG streams and data position, each with its own layout dependence.
4. Picotron's `adjust_tensor_size` pads a narrowed slice with `torch.empty` rows when the target is wider. What must happen before training on those rows?
   - They must be re-initialized: `torch.empty` allocates without drawing values, so the padded rows are garbage until reset. That path is Hugging Face initialization, not resume.

</details>

#### U8. Preemption signals and bounded graceful shutdown

**About 3 h** · **Target:** Implement

Topics: Preemption signals and bounded graceful shutdown

Preemption is scheduled, not random. A bounded handler converts a killed job into a clean checkpoint instead of lost work.

**You can now**

- Install a signal handler that finishes the current iteration, saves a checkpoint and exits inside a grace budget.
- Derive the grace budget from iteration time plus save time, and synchronize the exit decision across ranks.

**Study**

1. [Graceful exit before the time limit](https://github.com/stas00/ml-engineering/blob/139708e52cb06f9191cf1d9959def9187b205c58/training/fault-tolerance/README.md) (Machine Learning Engineering Open Book - Checkpoints, Storage and Fault Tolerance) - Dealing with forced job preemption: grace budget as iteration time plus save time, doubled; Approach A (a training-script exit-duration argument, `args.exit_duration_in_mins` in the quoted Megatron code, with an `all_reduce` MAX sync); Approach B.1 (the `#SBATCH --signal=USR1@600` directive with a `SIGUSR1` handler and exit-asap flag); Approach B.2 (launcher signal forwarding with `B:USR1`, `trap` and `pgrep` children); QoS-based SLURM preemption.
2. [Kill and save switches](https://github.com/stas00/ml-engineering/blob/139708e52cb06f9191cf1d9959def9187b205c58/training/fault-tolerance/README.md) (Machine Learning Engineering Open Book - Checkpoints, Storage and Fault Tolerance) - Kill switch: poll for a file before each iteration, save and exit; Save switch: save and continue, removing the switch file.

**Focus**

- Grace time must cover a full started iteration plus the save: measure both, then double. Exiting early wastes nothing; exiting late loses the save.
- The exit decision is collective. Reduce one flag across ranks, as BLOOM's `all_reduce` MAX pattern does, so no rank saves while another trains on.
- Signals sent to the launcher do not reach the workers: a `SIGUSR1` sent to the `torchrun` agent terminated it, and no worker handler fired (2 CPU processes, PyTorch 2.14.1). Signal each worker process directly, or forward with the B.2 trap.
- Kill and save switches are the same mechanism without the scheduler. A file poll before each iteration gives operators a manual preemption path.

**Reproduce:** On CPU, run a two-process job with a `SIGUSR1` handler that sets a flag, finishes the iteration, saves model plus step, and exits. Send the signal mid-run and show both ranks exit 0 with a loadable checkpoint at the post-iteration step.

**Traps**

- Relying on the default 30 to 60 seconds of `SIGTERM`. Large-model saves take minutes, so request the early signal (`USR1@600`) and handle that instead.
- Saving inside the signal handler. Handlers run asynchronously, so set a flag and let the main loop finish the iteration, then save and exit.
- Letting one rank exit on its signal while others continue. The job hangs in a collective, so synchronize the decision before anyone leaves.

**Practice**

- [Stas `SIGUSR1` trap demo as a bounded-shutdown test](https://github.com/stas00/ml-engineering/blob/139708e52cb06f9191cf1d9959def9187b205c58/training/fault-tolerance/README.md) - Approach B.1 `sigusr1.slurm` handler plus the train-loop flag pattern; test on a two-process CPU job by sending `kill -s USR1 "$pid"` mid-run and assert both ranks save and exit within the budget. No SLURM needed for the mechanism test: signal by PID and verify the checkpoint loads afterwards. The SLURM headers only schedule the signal.

**Stop when:** A mid-iteration signal produces a complete checkpoint at a clean boundary on every rank, inside a budget you derived from measured iteration and save times.

<details>
<summary>Self-test</summary>

1. An iteration takes up to 2 minutes and a save takes up to 2 minutes. What grace period do you request, and why not exactly 4?
   - At least 8 minutes (double the sum). Exact budgets fail on jitter: a slow iteration plus a slow save overruns 4 minutes and the kill lands mid-write.
2. Rank 0's handler sets its flag but rank 1 never receives the signal. How does the job still exit cleanly?
   - The flag is reduced across ranks before acting (MAX over the done tensor), so one rank's signal becomes every rank's decision in the same iteration.
3. Why does Approach B.2 send the signal to the `sbatch` shell instead of the launcher?
   - Launchers such as `torchrun` do not forward `SIGUSR1` to workers. The shell traps it and re-sends to the child processes found with `pgrep`.
4. A QoS preemption can land at any time, unlike a time-limit preemption. What changes in the handler?
   - Nothing in the handler: the same flag, collective decision and bounded save run. What changes is that the grace duration is fixed by policy, so the budget must fit the worst case, not the schedule.

</details>

#### U9. Rank crashes, collective timeouts, elastic restart and replica recovery

**About 5 h** · **Target:** Explain + Implement

Topics: Rank crash, collective timeout and process-group teardown; Rendezvous restart and elastic membership vocabulary; Replica-based in-memory recovery

One dead rank invalidates the whole communicator. The choice is restart-from-checkpoint, which works everywhere, versus heal-in-place, which needs replicas.

**You can now**

- Explain what a rank crash does to a collective, how teardown plus rendezvous rebuilds membership, and what unstable ranks imply for state.
- Restart a crashed CPU job with `torchrun --max-restarts` and resume from the last checkpoint; contrast with per-step healing.

**Study**

1. [Restart and membership vocabulary](https://docs.pytorch.org/docs/2.14/elastic/run.html) (PyTorch Elastic Run Documentation) - Fault tolerant (fixed sized number of workers, no elasticity, tolerates 3 failures) with `--max-restarts=3`; Elastic (`min=1`, `max=4`) with `--nnodes=1:4`; Note on rendezvous backend (`rdzv-id`, `rdzv-backend` c10d, endpoint default 29400); Definitions (Node, Worker, WorkerGroup, `RANK`, `WORLD_SIZE`); Environment Variables (`TORCHELASTIC_RESTART_COUNT`, `TORCHELASTIC_MAX_RESTARTS`).
2. [Crash-and-restart behavior](https://github.com/LambdaLabsML/distributed-training-guide/blob/aed748914472cca80d8cfe139ab43ec63103913a/related-topics/elastic-training/toy.py) (Distributed Training Guide - Sharded Checkpoints, Determinism and Elastic Training) - README Elastic Training: all workers restart on one failure and ranks are unstable across restarts, with one crashing attempt's `error.json`; `toy.py`: barrier-separated steps with a rank-0 state write and a random crash.
3. [Per-step healing as the contrast](https://github.com/meta-pytorch/torchft/blob/b8a096f9f23589ec93e988e2368a934cab01b890/README.md) (torchft) - Overview: per-step fault tolerance without interrupting the job; Lighthouse: `torchft_lighthouse` quorum with step-granularity membership; Example Training Loop (DDP) with `Manager`, `ProcessGroupGloo` and `TORCHFT_LIGHTHOUSE`; Fault Tolerant HSDP Algorithm (page read 2026-10-14).
4. [Detection, teardown and warm versus cold](https://mlsysbook.ai/vol2/fault_tolerance/fault_tolerance.html) (Machine Learning Systems Volume II - Chapter 7 Fault Tolerance) - Failure Detection and Recovery: heartbeat versus collective-timeout versus orchestration layers, Figure 28's detect, pause, rescale and resume sequence with the equation 9 recovery budget, cold versus warm restart with Table 9; Checkpoint 1.5: Tuning detection and recovery.

**Focus**

- A crashed rank turns every pending collective into a hang or an error. Survivors must tear down the process group and re-rendezvous; no rank is removed in place from a live communicator. PyTorch 2.14.1 also ships an experimental, private reconfigure path behind `init_process_group(..., enable_reconfigure=True)`; this section does not rely on it.
- Elastic restart rebuilds the group of workers, not the failed rank. `RANK` and `WORLD_SIZE` can change, so resume keys state by global step, never by rank.
- `--max-restarts` bounds crash loops. Each attempt re-runs the script, which reloads the last checkpoint itself, and exceeding the budget surfaces the failure instead of spinning forever.
- torchft heals inside the job when replicas exist (lighthouse quorum per step, live peer transfer). Restart-from-checkpoint works with no replicas but loses work back to the last save. Replicas are the precondition, not the default.

**Reproduce:** Run a one-process job that exits 1 on its first attempt and 0 after, under `torchrun --max-restarts=1`. Show `TORCHELASTIC_RESTART_COUNT` reads 0 then 1 and the final exit code is 0.

**Traps**

- Catching the exception and continuing in the same process group. Timeouts and dead peers leave the communicator unusable; teardown plus fresh rendezvous is the only path.
- Assuming `RANK` is stable across a restart. The guide states it explicitly: re-derive sharding and logging identity from the new membership.
- Treating torchft as a checkpoint replacement for all jobs. Without at least two replicas there is no healthy peer to heal from; single-replica jobs still need file checkpoints.

**Practice**

- [torchrun bounded-restart test plus crash loop](https://docs.pytorch.org/docs/2.14/elastic/run.html) - Run the Reproduce script under `--max-restarts=1` and assert the retry runs with `TORCHELASTIC_RESTART_COUNT=1` and the job exits 0; then run the guide's `toy.py` with two CPU processes and inspect one crashing attempt's `error.json`. Both run on CPU gloo. `toy.py` crashes on its own within seconds; delete `toy-state.json` before each fresh run and wrap it in `timeout`.

**Stop when:** You can crash any rank of a CPU job, watch the agent restart within budget, resume from the checkpoint, and state when healing needs replicas.

<details>
<summary>Self-test</summary>

1. Rank 2 dies mid-`all_reduce`. Why must the surviving ranks tear down instead of continuing?
   - The collective never completes, so every survivor hangs waiting for rank 2's contribution. The communicator is defined over the full group, so a membership change needs a new group.
2. A job with `--max-restarts=3` fails four times. How many training attempts ran, and what ends the loop?
   - Four: the initial attempt plus three restarts. The fourth failure exceeds the budget, so the agent surfaces the error instead of restarting.
3. After an elastic restart with fewer workers, each rank reloads its old rank's data shard. What breaks?
   - Coverage: shards were computed for the old world size. Reshard the dataset for the new membership and resume from the global step.
4. When does per-step healing beat restart-from-checkpoint, and what does it cost standing by?
   - When replicas exist and failures are frequent: it loses at most a step instead of all work since the last save. It costs per-step lighthouse coordination plus peer capacity to heal onto.

</details>

#### U10. Storage saturation, partial writes, slow ranks and last-known-good retention

**About 4 h** · **Target:** Measure + Implement

Topics: Storage saturation, partial writes and slow rank diagnosis; Retention, garbage collection and last-known-good protection

Checkpoint writes are the heaviest storage burst in the job. Without retention discipline the disk fills, the newest save corrupts, and there is nothing to fall back to.

**You can now**

- Detect a saturated filesystem, a partial write and a slow saver from rank-side evidence, and act before the job dies.
- Implement keep-k retention that never deletes the last known good and garbage-collects in the background.

**Study**

1. [Disk watchdogs and the 80 percent rule](https://github.com/stas00/ml-engineering/blob/139708e52cb06f9191cf1d9959def9187b205c58/training/fault-tolerance/README.md) (Machine Learning Engineering Open Book - Checkpoints, Storage and Fault Tolerance) - Low disk space alerts: 80 percent is full on rebalancing filesystems, inode exhaustion, `df` staleness, `fs-watchdog.py`; Dealing with slow memory leaks: voluntary exit with `save_checkpoint` before OOM.
2. [BLOOM retention arithmetic](https://github.com/stas00/ml-engineering/blob/139708e52cb06f9191cf1d9959def9187b205c58/training/fault-tolerance/README.md) (Machine Learning Engineering Open Book - Checkpoints, Storage and Fault Tolerance) - Frequent checkpoint saving: 2.3TB every 3 hours is 18.4TB a day; keep the 2 most recent checkpoints local for fast resume.
3. [Keep-k retention in code](https://github.com/hkproj/torchfeather/blob/c416ab1ad0fd3567a0a6c8ad0da570c8fd6e55aa/torchfeather/components/checkpoint.py) (TorchFeather - Distributed Checkpoint Manager) - `keep_latest_k`: rejecting 1, rank-0 `_purge_stale_checkpoints` with sorted `step-*` selection, background `purge_thread` with `TerminateSentinel`, `_save_last_step` always synchronous and full.
4. [Stragglers and slow ranks](https://mlsysbook.ai/vol2/fault_tolerance/fault_tolerance.html) (Machine Learning Systems Volume II - Chapter 7 Fault Tolerance) - Distinguishing stragglers from failures with Definition 1.2 and the straggler step-time model; Napkin Math 1.5: the straggler tax.

**Focus**

- Treat 80 percent as full on shared filesystems. Rebalancing can fail a write while `df` still shows space, and `df` itself can lag by 30 minutes. Monitor the consumption rate in TB per day, not just the percent.
- Keep at least two complete checkpoints. The newest may be mid-write when the crash lands, so retention protects the last known good, never just the last.
- Delete in the background and never on the training thread. Rank-0 selection plus a purge queue keeps `rmtree` latency off the critical path.
- A slow saver is a straggler, not yet a failure. Per-rank save timings name it, and past the break-even point killing and recovering beats waiting.

**Reproduce:** With `keep_latest_k=2`, save steps 1 to 4 on CPU, delete `.metadata` from step 4, and show the loader selects step 3 while the purge set holds only the older steps.

**Traps**

- Setting `keep_latest_k=1` to save space. TorchFeather rejects it because the single copy can be purged while its replacement is still writing; the minimum safe retention is 2.
- Purging from every rank. Concurrent deletes race and partially remove directories, so only rank 0 selects and a single background thread deletes.
- Watching bytes but not inodes. Virtualenvs and sharded checkpoints create many small files, so an inode-full filesystem fails writes with terabytes free.

**Practice**

- [Retention plus watchdog lab](https://github.com/hkproj/torchfeather/blob/c416ab1ad0fd3567a0a6c8ad0da570c8fd6e55aa/torchfeather/components/checkpoint.py) - TorchFeather `_purge_stale_checkpoints` with `keep_latest_k=2`: save 4 interval checkpoints, corrupt the newest, and show the loader falls back to the previous complete one while the purge removes only older ones; adapt the Stas `fs-watchdog.py` thresholds to your disk with a consumption-rate estimate. Run on CPU with small shards; the purge and fallback logic is identical at scale. The Stas watchdog lives at https://github.com/stas00/ml-engineering/blob/139708e52cb06f9191cf1d9959def9187b205c58/training/fault-tolerance/README.md under Low disk space alerts.

**Stop when:** A corrupted newest checkpoint falls back to the previous complete one, retention holds exactly 2, and your watchdog names the byte rate and the inode headroom.

<details>
<summary>Self-test</summary>

1. A filesystem shows 78 percent used and writes start failing. What is the most likely cause, and what threshold would have prevented it?
   - Rebalancing or per-device imbalance on a shared filesystem: one device is full while the aggregate shows space. Alert at 80 percent at the latest, and track the daily consumption rate against the job length.
2. Why must the purge select on rank 0 and delete on a background thread?
   - Selection needs one decider to avoid races; deletion is slow I/O that must stay off the training thread. The queue between them bounds both.
3. Checkpoints land every hour and each takes 6 minutes to write on the slowest rank. When is that rank a straggler to kill rather than wait for?
   - Sustained, it holds every step 10 percent longer ($`6/60`$). Napkin Math 1.5's rule: replace it once that slowdown share exceeds $`T_{\text{recovery}} / \text{MTBF}_{\text{system}}`$; past that break-even point, killing and recovering beats waiting.
4. `df` shows free space but a save fails with no space. Name two non-capacity causes from the chapter.
   - Inode exhaustion, and stale `df` on a distributed filesystem that lags reality by up to 30 minutes.

</details>

#### U11. Kill-at-every-boundary campaigns, post-resume equivalence and the recovery audit

**About 5 h** · **Target:** Implement

Topics: Kill-at-every-boundary fault injection; Reference trajectory and post-resume equivalence tests; Failure manifest and recovery audit trail

The section checkpoint is this unit. Recovery that works everywhere except the one untested boundary is not recovery.

**You can now**

- Enumerate every crash window in a save and load cycle and kill the job in each one.
- Validate post-resume equivalence against a reference trajectory with declared deterministic versus statistical bars.
- Write a failure manifest and recovery audit entry per incident: what died, what was kept, what was refused.

**Study**

1. [Fault injection and recovery validation](https://mlsysbook.ai/vol2/fault_tolerance/fault_tolerance.html) (Machine Learning Systems Volume II - Chapter 7 Fault Tolerance) - Fault Injection Tools and Frameworks; Failure Detection and Recovery: the detect, pause, rescale and resume sequence in Figure 28 and recovery validation (shapes, dtypes, loss consistency, gradient statistics); Distributed Debugging and Observability.
2. [What production failures look like](https://arxiv.org/abs/2407.21783) (The Llama 3 Herd of Models - Reliability and Operational Challenges) - Section 3.3.4 Reliability and Operational Challenges: 466 interruptions over a 54-day snapshot with the Table 5 root-cause mix (plan from counts: the printed Faulty GPU share disagrees with its count); NCCL flight recorder paragraph on ring-buffer collective metadata with automatic dumps on watchdog or heartbeat timeout (arXiv:2407.21783v3).
3. [Boundary enumeration from the save path](https://github.com/hkproj/torchfeather/blob/c416ab1ad0fd3567a0a6c8ad0da570c8fd6e55aa/torchfeather/components/checkpoint.py) (TorchFeather - Distributed Checkpoint Manager) - `save` (should-save decision, async-wait join, sync or async write, purge), `close` (final join, group destroy, purge-thread join), `load` (`_find_load_step`, model-only versus full): one kill window per boundary.
4. [Capstone-adjacent smoke tests (depth)](https://github.com/isLinXu/bumblebee/blob/5782386adbf5e518e42804597f7206b3fc9ce8cc/bumblebee/primitive/ckpt/dcp.py) (Bumblebee - DCP and Checkpoint Smoke Tests) - `primitive/ckpt/dcp.py` entry points `save_training_checkpoint` and `load_training_checkpoint`; `tests/qwen3_moe/test_checkpoint_smoke.py` only asserts that the two exports resolve to the local DCP runtime and are callable, and `docs/roadmap.md` lists reshardable optimizer state as a P2 item, so treat it as an untested target, not a reference.

**Focus**

- A boundary is any point where a crash changes what resume sees: before the first shard, mid-shards, after shards before commit, after commit before manifest, during purge, during load. List them from the code, then kill in each.
- Equivalence has two bars. Deterministic state (parameters, optimizer, data position) must match exactly on CPU; stochastic streams after a reshard match statistically with a declared test.
- Every incident writes the same record: failed rank and step, surviving checkpoints with checksums, refused artifacts with reasons, and the recovery action. The audit is the deliverable, not the log.
- Production mixes set the campaign weights. Hardware dominates Table 5's counts, but the campaign still covers hangs, slow ranks and corrupt files, because those are the cases restart logic gets wrong.

**Reproduce:** List every kill window in a two-process CPU save and load cycle from the code, then kill in each window and show every kill either resumes to the reference trajectory or refuses loudly with an audit entry.

**Traps**

- Testing only clean kills between steps. Mid-write, mid-commit and mid-purge kills are the windows that corrupt; a campaign of tidy exits proves nothing.
- Comparing resumed loss to reference loss with no tolerance statement. Deterministic CPU resume must be exact, so any gap is a bug; GPU or resharded resume needs an explicit statistical bar.
- Keeping the audit in the training log. Rank-interleaved stdout is not an audit trail; write one manifest entry per incident with the kept and refused artifacts named.

**Practice**

- The section mini-project covers this: kill-at-every-boundary campaign on a sharded CPU job, post-resume equivalence against a reference trajectory, and the failure-manifest plus recovery-audit trail.

**Stop when:** Your campaign kills in every listed window, each kill either resumes to the reference trajectory or refuses loudly with an audit entry, and no window is untested.

<details>
<summary>Self-test</summary>

1. Name six kill windows in an async checkpoint cycle.
   - Before the first shard write, mid-shard writes, after shards before the future joins, after join before commit, during manifest write, and during stale purge; plus during load. Each must leave a loadable prior checkpoint or a refused partial.
2. Post-resume weights match exactly but the next data batches differ. Which window was hit, and what does the audit record?
   - The sampler-position window: state saved without the consumed offset. Record the kept checkpoint, the duplicated batch range, and the missing offset field.
3. Table 5 shows 6 silent-data-corruption interruptions out of 419. Why does the campaign still include corruption injection?
   - Rare but load-bearing: corruption defeats every path that assumes files are honest. Confirmed plus suspected cases justify a checksum-and-refuse test.
4. A recovery audit lists the loaded checkpoint but not the refused ones. What is missing, and why does it matter?
   - The refused artifacts with reasons. Without them a later reader cannot tell a tested refusal from an untested path, and the same corrupt file can be retried.

</details>

### Mini-project: Atomic sharded checkpoints with kill-tested recovery

**About 14 to 20 hours.** Extend trainlab `ckpt/` and `faults/` with sharded DCP checkpoints, manifests, atomic publish and changed-layout restore. Prove recovery with kill-at-every-boundary campaigns, corruption refusal and a per-incident audit trail, so restarts resume the same experiment instead of a shifted one.

1. Port the DCP recipe to CPU `gloo`: save a sharded model plus optimizer state through `get_state_dict`, reload bit-exactly after mutation, convert to a single file, and resume sampler position with RNG streams intact.
2. Add versioned manifests with topology, config and code identity plus strict-versus-lax key policy, and pass the TorchTitan CPU checkpoint suite with every refusal and remap logged.
3. Publish through a temporary directory with barrier discipline, manifest-last commit and per-shard checksums; corrupt one byte to prove refusal, and keep retention that never deletes the last known good.
4. Coordinate one outstanding asynchronous save, adding the `DefaultStager` variant for staging-before-step discipline, and time it against synchronous saves on CPU, then work the MLSys checkpoint-tax boxes to set interval, RPO and RTO.
5. Restore a sharded checkpoint onto a changed world size with full-parameter equality, then rehearse the Stas preemption trap and a bounded crash restart under the elastic-run reference from global step.
6. List every kill window in the save and load cycle from the code, kill in each one, and show every kill resumes to the reference trajectory or refuses loudly with a manifest and audit entry.

**Deliverables**

- The `ckpt/` sharded save, manifest, atomic publish and changed-layout restore with refusal tests.
- Sync-versus-async timings, the interval derivation with RPO and RTO, and retention plus watchdog evidence.
- The kill campaign matrix with reference-trajectory results and the per-incident failure manifest plus recovery audit.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [PyTorch distributed checkpoint recipe](https://docs.pytorch.org/tutorials/recipes/distributed_checkpoint_recipe.html). Port the sharded save, load and cross-size restore to CPU gloo with bit-exact assertions.
- external-tests: [PyTorch asynchronous checkpoint recipe](https://docs.pytorch.org/tutorials/recipes/distributed_async_checkpoint_recipe.html). Port the async loop with one outstanding request and separated staging discipline.
- external-tests: [TorchTitan CPU checkpoint suite](https://github.com/pytorch/torchtitan/blob/0b75362025f037a2d1a23240ba21786928a9052e/tests/unit_tests/cpu/test_checkpoint.py). Run the save, load, selection and purge cases on CPU; keep the suite green.
- external-tests: [MLSys Checkpoint 1.4 boxes](https://mlsysbook.ai/vol2/fault_tolerance/fault_tolerance.html). Work the interval and tax boxes on paper before setting the job policy.
- external-tests: [Stas fault-tolerance guide](https://github.com/stas00/ml-engineering/blob/139708e52cb06f9191cf1d9959def9187b205c58/training/fault-tolerance/README.md). Rehearse the preemption trap and retention arithmetic on a CPU job.
- external-tests: [PyTorch elastic run reference](https://docs.pytorch.org/docs/2.14/elastic/run.html). Run the bounded-restart test and crash loop on CPU gloo.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Resume identity | Mid-epoch resume reproduces batches, RNG draws and weights exactly on CPU, with every stream named. | Dropping any single stream fails a named test, and cross-size restore keeps moments aligned. |
| Publish integrity | Interrupted publishes never appear on the load path, and tampered shards are refused by checksum with fallback kept. | Retention holds the last known good under corruption, and the watchdog names byte rate and headroom. |
| Recovery proof | Every kill window is tested, each kill resumes to the trajectory or refuses with an audit entry. | The audit names kept and refused artifacts per incident, and preemption exits inside a derived budget. |

Feeds into: Sharded checkpoints, the restore mesh and the kill campaign feed fleet runbooks, the extension baseline and the capstone dossier.

### Resource route

- **Primary - Book:** [Machine Learning Systems Volume II - Chapter 7 Fault Tolerance](https://mlsysbook.ai/vol2/fault_tolerance/fault_tolerance.html) - Read Failure Analysis at Scale, Hardware Fault Taxonomy, Check-and-Verify, Fault Injection Tools and Frameworks, Checkpointing, Failure Detection and Recovery, Elastic Recovery and Distributed Debugging and Observability. Turn them into a failure matrix before implementing the PyTorch DCP lab.
- **Required - Lab:** [PyTorch Distributed Checkpoint Recipes](https://docs.pytorch.org/tutorials/recipes/distributed_checkpoint_recipe.html) - Complete the distributed checkpoint recipe with a tiny sharded model on CPU, then `dcp.async_save` from the 2.14 reference at https://docs.pytorch.org/docs/2.14/distributed.checkpoint.html. The recipe saves model and optimizer only: add scheduler, scaler, RNG and dataloader state yourself, then inject partial directories, missing shards and a changed world-size restore.
- **Required - Implementation:** [TorchFeather - Distributed Checkpoint Manager](https://github.com/hkproj/torchfeather) - Trace components/checkpoint.py through state wrappers, DCP save and load, asynchronous mode, retention and cleanup. Write a failure table for every barrier, future, temporary artifact and deletion boundary.
- **Required - Field guide:** [Machine Learning Engineering Open Book - Checkpoints, Storage and Fault Tolerance](https://github.com/stas00/ml-engineering) - Read `training/fault-tolerance/README.md` (frequent checkpoints, kill and save switches, watchdogs, preemption) and the "Don't forget the checksums" and benchmark sections of `storage/README.md`. Turn them into an operational save, verify, publish, retain and recover runbook.
- **Required - Lab:** [Distributed Training Guide - Sharded Checkpoints, Determinism and Elastic Training](https://github.com/LambdaLabsML/distributed-training-guide) - Run `related-topics/elastic-training/toy.py` with two CPU processes (hide any GPU so it uses Gloo) to see a crash-and-restart loop, then read the determinism related topic and the Chapter 4 sharded save and load. Prove the same next batches and updates after one interrupted run.
- **Support - Implementation:** [Picotron - Checkpoint State](https://github.com/huggingface/picotron) - Inspect picotron/checkpoint.py and every call site in train.py. List which state is saved, how ranks participate and which DT-1 reproducibility requirements need to be added in your project.
- **Support - Reference:** [Nanotron - Distributed Serialization](https://github.com/huggingface/nanotron) - Read the serialization section of `docs/docs.md` (metadata, per-rank optimizer and RNG shards) and its statement that checkpoints are not topology agnostic, then the reasons in `src/nanotron/serialize/`. Use it as the worked example of why resharding is hard.
- **Support - Reference:** [PyTorch Elastic Run Documentation](https://docs.pytorch.org/docs/2.14/elastic/run.html) - Use failure modes and membership changes to understand agent, worker group, rendezvous and restart semantics. Implement only bounded local restart tests; elasticity is not a substitute for checkpoint correctness.
- **Support - Reference:** [torchft](https://github.com/meta-pytorch/torchft) - Read the README and `train_ddp.py`: per-step quorum through the lighthouse, fault-tolerant DDP and HSDP, and live peer recovery. Compare per-step healing with restart-from-checkpoint.
- **Support - Reference:** [TorchTitan - Checkpointing](https://github.com/pytorch/torchtitan) - Read `docs/checkpoint.md` and the checkpointer component at a pinned commit: intervals, model-only and export saves, asynchronous modes and keys excluded from loading.
- **Support - Paper:** [The Llama 3 Herd of Models - Reliability and Operational Challenges](https://arxiv.org/abs/2407.21783) - Read the reliability section and its interruption table (root causes of unexpected interruptions over a 54-day snapshot) and use it to set failure rates in your checkpoint-interval model.
- **Depth - Case study:** [Bumblebee - DCP and Checkpoint Smoke Tests](https://github.com/isLinXu/bumblebee) - Only as a possible capstone target: read `primitive/ckpt/dcp.py` and the checkpoint smoke tests in a clean checkout. Its own roadmap lists reshardable optimizer state as a gap.
- **Support - Reference:** [OLMo-core Checkpointer](https://github.com/allenai/OLMo-core/blob/5f6f58a133e7ef577d596295f2c8db4651c27857/src/olmo_core/train/checkpoint.py) - Read `src/olmo_core/train/checkpoint.py` (`_temporary_wd`, `_get_tmp_dir`, `_teardown_tmp_dir`, `_save_metadata`) for temp-directory atomic publish with barrier discipline, and `src/test/train/checkpoint_test.py` (`run_checkpointer`) for the save, find and reload assertions.

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

### Study units

#### U1. Step time, token throughput and MFU versus HFU

**About 4 h** · **Target:** Derive + Measure

Topics: Step time, samples per second and tokens per second; Model FLOPs utilization (MFU) and hardware FLOPs utilization (HFU)

Throughput numbers mean nothing without fixed workload semantics and stated FLOP counts. This unit fixes the definitions before any diagnosis.

**You can now**

- Define step time, tokens per second, MFU and HFU, stating the FLOP count and peak each ratio uses.
- Derive tokens per second from step time and batch tokens, and MFU from model FLOPs over peak throughput.
- Measure step time and tokens per second with warmup and synchronization, and label CPU timings as non-evidence for GPU interconnects.

**Study**

1. [MFU versus HFU and FLOP counting](https://github.com/stas00/ml-engineering/blob/139708e52cb06f9191cf1d9959def9187b205c58/training/performance/README.md) (Machine Learning Engineering Open Book - Network, Debug, Training Performance and Orchestration) - MFU vs HFU section with $`\text{HFU} = \text{actual FLOPs} / \text{peak}`$ and the `FlopCounterMode` snippet; MFU is a very rough approximation subsection.
2. [Rooflines and the H100 crossover](https://jax-ml.github.io/scaling-book/roofline) (How to Scale Your Model - Chapters 1, 5, 9 and 12) - Where Does the Time Go through A Few Problems to Work, with the intensity definition, the Q1 derivation and Q5 on the H100 SXM crossover near 295, all with answers. Depth: Keep TPU ICI numbers labeled as TPU numbers. Re-parameterize the crossover for your hardware before quoting it.
3. [Roofline diagnosis and the MFU definition](https://mlsysbook.ai/vol2/performance_engineering/performance_engineering.html) (Machine Learning Systems Volume II - Fleet Orchestration and Performance Engineering) - The Memory Wall and Roofline Diagnosis with the iron law and ridge table, and Measurement at Scale with the MFU bands (40 to 60 percent good, above 60 excellent).

**Focus**

- Step time is wall-clock per optimizer step at fixed global batch, sequence length and precision. Tokens per second is global-batch tokens divided by step time.
- MFU uses model FLOPs, commonly $`6 N D`$ for training, over peak. HFU uses actual FLOPs including recomputation and padding. State both before comparing.
- MFU is rough under mixed precision because regions run in different formats while the peak assumes one. Compare before and after on the same setup, never across clusters.

**Reproduce:** Closed-book, derive tokens per second and MFU for $`N = 10^9`$ parameters, $`D = 10^6`$ tokens and $`T_{\text{step}} = 30`$ s at the H100 SXM dense BF16 peak of $`989`$ TFLOP/s: tokens/s is about 33,333, model FLOPs are $`6 \times 10^{15}`$, achieved about 200 TFLOP/s, MFU about 20 percent.

**Traps**

- Comparing MFUs built from different FLOP counts (with versus without attention terms, forward-only versus training) or different peaks (sparse versus dense, BF16 versus FP16).
- Reading CPU `gloo` step times as evidence about GPU throughput or interconnects. They check semantics only.
- Treating `FlopCounterMode` as exact. It has performance and memory problems and serves as a cross-check, not the answer.

**Practice**

- [CS336 Assignment 2: `benchmarking_script` and `benchmarking_mixed_precision`](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/cs336_assignment2_systems.pdf) - Section 2.1.3 `benchmarking_script` and Section 2.1.5 `benchmarking_mixed_precision` in the Spring 2026 handout; produce warmup-controlled forward, backward and full-step timings with `torch.cuda.synchronize`. Run the portable parts on your machine. GPU timing needs CUDA. Report step time, batch tokens, tokens/s, hardware, PyTorch version and precision.

**Stop when:** You can state tokens/s, the FLOP count and the peak for one run, and explain why its MFU cannot be compared to a published cluster MFU.

<details>
<summary>Self-test</summary>

1. How are step time, global-batch tokens and tokens per second related?
   - Tokens per second is $`D_{\text{tokens}} / T_{\text{step}}`$ at fixed batch, sequence and precision. Change any of the three and the ratio is incomparable.
2. Why can HFU exceed MFU on the same run?
   - HFU counts the FLOPs the hardware actually ran, including recomputation and padding. MFU counts model FLOPs only, so extra work raises HFU but not MFU. Waiting in collectives adds time, not FLOPs, and lowers both.
3. A paper reports 55.2 percent MFU on 12,288 GPUs. Can you compare your single-GPU MFU to it?
   - No. Different hardware, FLOP-count convention and workload. The 55.2 percent figure is MegaScale's own cluster result for a 175B model, not a transferable target.
4. Manual arithmetic and `FlopCounterMode` disagree. Which do you trust?
   - The manual count with stated assumptions. The counter is a cross-check with known performance and memory issues.

</details>

#### U2. Strong and weak scaling efficiency and goodput under failures

**About 4 h** · **Target:** Derive

Topics: Strong scaling, weak scaling and parallel efficiency; Goodput with failures, retries and unusable work

More ranks can raise utilization while lowering useful output once failures, restarts and stragglers dominate. This unit separates busy hardware from finished work.

**You can now**

- Define strong scaling, weak scaling and parallel efficiency, stating the fixed quantity in each.
- Derive goodput with failures, retries and unusable work for one job size from failure rate and restart cost.
- Explain why high device utilization can coexist with poor useful throughput.

**Study**

1. [Scheduling, fragmentation and utilization grades](https://mlsysbook.ai/vol2/fleet_orchestration/fleet_orchestration.html) (Machine Learning Systems Volume II - Fleet Orchestration and Performance Engineering) - The Scheduling Problem with gang scheduling and fragmentation math, and Debugging Cluster Utilization with allocated versus productive utilization.
2. [MegaScale scaling and straggler evidence](https://arxiv.org/abs/2402.15627) (MegaScale: Scaling Large Language Model Training to More Than 10,000 GPUs) - arXiv:2402.15627v1, Sections 4 to 6: heartbeat fault loop, straggler mitigation and 55.2 percent MFU on 12,288 GPUs for a 175B model. Depth: Treat the MFU and speedup as that cluster's results. Reproduce the method, not the numbers.
3. [Failure taxonomy and MTTF versus job size](https://arxiv.org/abs/2410.21680) (Revisiting Reliability in Large-Scale Machine Learning Research Clusters) - arXiv:2410.21680v2, Sections 2 and 5: RSC cluster design, failure taxonomy and MTTF analysis with scheduler-side requeue metrics. Depth: Model goodput for one job size only. Do not merge these research-cluster numbers with Llama 3 production counts.

**Focus**

- Strong scaling fixes the global problem and grows ranks. Weak scaling grows the problem with ranks, usually tokens per GPU. Efficiency is speedup over ranks, or throughput over ranks versus the baseline.
- Goodput discounts failed, repeated and unusable work: restarts, preemption, straggler idle and checkpoint overhead. Busy GPUs doing repeated work raise utilization but not goodput.
- Failure rate grows with job size, so large jobs pay more checkpoint and restart tax. Every MTTF number is cluster-specific.

**Reproduce:** Closed-book, compute strong-scaling efficiency for $`T_1 = 100`$ ms and $`T_4 = 30`$ ms: speedup $`100/30 \approx 3.33`$, efficiency $`3.33/4 \approx 83`$ percent. Then derive goodput for a job interrupted once every 8 hours, with a 2-minute checkpoint every hour and 15 minutes to restart: per 8 hours it spends about 16 minutes checkpointing, loses 30 minutes of work on average and 15 minutes restarting, so useful time is about $`(480 - 61)/480 \approx 87`$ percent.

**Traps**

- Quoting weak-scaling efficiency without stating what is held fixed per rank (tokens, batch or model shard).
- Merging interruption counts across studies. Llama 3 Table 5 and the Meta reliability MTTF come from different clusters and mixes.
- Treating device utilization as useful throughput when restarts, retries and straggler idle consume the hours.

**Practice**

- [CS336 Assignment 2: `data_parallel_calcs` and `fsdp_calcs`](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/cs336_assignment2_systems.pdf) - Section 8.2 `data_parallel_calcs` and Section 8.3 `fsdp_calcs` in the Spring 2026 handout: backward FLOPs, backward communication time and the bottleneck inequality in batch, dimension and bandwidth terms. Analytic problems graded by the handout. Compare one prediction with a measurement on your hardware where it can run honestly.

**Stop when:** You can derive efficiency and goodput for one job size from stated failure and restart numbers, and name which cluster each number came from.

<details>
<summary>Self-test</summary>

1. What is fixed in strong scaling versus weak scaling?
   - Strong scaling fixes the global problem size. Weak scaling grows it with ranks, typically holding tokens or work per rank fixed.
2. Four ranks cut step time from 100 ms to 30 ms. What are speedup and efficiency?
   - Speedup $`100/30 \approx 3.33`$. Efficiency $`3.33/4 \approx 83`$ percent against the single-rank baseline.
3. How can utilization read 90 percent while goodput is poor?
   - GPUs stay busy on repeated, failed or unusable work: restarts after interruptions, straggler waiting, and checkpoint overhead all count as utilized but not useful.
4. Why does MTTF fall as job size grows, and what follows for checkpointing?
   - More components mean more chances per hour that one fails. Larger jobs need cheaper checkpoints and faster restart because interruptions arrive sooner.

</details>

#### U3. Fixed-workload benchmark contracts, variance and regression manifests

**About 5 h** · **Target:** Implement + Measure

Topics: Fixed-workload benchmark contracts and correctness guards; Warmup, synchronization, repetitions and variance; Performance regression tests and evidence manifests

A speedup claim without a fixed workload and a correctness guard is noise. This unit makes every later measurement comparable and every regression checkable.

**You can now**

- Write a fixed-workload benchmark contract with correctness guards that reject wrong-but-fast results.
- Apply warmup, synchronization, repetitions and variance reporting to step-time measurement.
- Build a regression test with an evidence manifest recording workload, configuration and environment.

**Study**

1. [Profiling and benchmarking discipline](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/cs336_assignment2_systems.pdf) (CS336 Assignment 2 (Spring 2026) - Profiling and Parallelism Analysis) - Section 2.1.2 model sizing through Section 2.1.6 memory profiling, with `benchmarking_script`, `nsys_profile` and `memory_profiling` problems in the Spring 2026 handout.
2. [Benchmarking thousands of configurations](https://nanotron-ultrascale-playbook.static.hf.space/index.html#benchmarking_thousands_of_configurations) (Ultra-Scale Playbook - Benchmarking Configurations) - Benchmarking thousands of configurations: fixed 1M-token workload at sequence length 4096, legal search space with impossible configs excluded, and MFU heatmaps over DP, TP, PP and ZeRO cells.
3. [Lessons learned on benchmarking](https://nanotron-ultrascale-playbook.static.hf.space/index.html#lessons_learned_on_benchmarking) (Ultra-Scale Playbook - Benchmarking Configurations) - Lessons learned on benchmarking: restart and idle cost, NCCL debug logs, allocator behavior and multi-node pipeline tuning.
4. [Continuous benchmarking and logging](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 1 to 5, 13 and 14) - Chapter 13, Continuous Integration and Performance Benchmarking, with the HUD performance dashboard and MLPerf logging sections.

**Focus**

- A fixed workload names model, data, global batch, sequence, precision and a correctness check. The Ultra-Scale heatmaps compare configs at one fixed 1M-token workload, never across workloads.
- Warmup settles compilation, allocator and cache state. `torch.cuda.synchronize` and a cross-rank barrier separate launch from work. Report raw samples with median and spread from repeated trials.
- A manifest records workload hash, config, code version, hardware, backend, environment flags and raw samples. The correctness guard runs with every timing so a fast wrong result fails.

**Reproduce:** From a blank file, write a benchmark harness for a tiny MLP step that warms up, synchronizes (with `torch.cuda.synchronize` on a GPU), times repeated trials, reports median and spread, and checks the result against a single-process reference within tolerance.

**Traps**

- Timing CUDA work without synchronization. Asynchronous launch returns early and measures queueing, not execution.
- Reporting one trial or a mean without warmup. Compilation, allocator growth and cache state dominate the first steps.
- Changing batch, precision or data between runs and calling the difference a speedup. Fix the workload first.

**Practice**

- [CS336 Assignment 2: `benchmarking_script` and `nsys_profile`](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/cs336_assignment2_systems.pdf) - Section 2.1.3 `benchmarking_script` and Section 2.1.4 `nsys_profile` in the Spring 2026 handout; deliver warmup-controlled timings plus an Nsight Systems trace that matches the timer. Keep a manifest with hardware, PyTorch version, backend and raw samples. Nsight portions need NVIDIA tooling; the timing harness runs on CPU with gloo for semantics.

**Stop when:** Your harness reports median and spread with a passing correctness guard, and a changed workload or missing synchronization fails the contract instead of looking faster.

<details>
<summary>Self-test</summary>

1. Why must the workload stay fixed across a comparison?
   - Step time, tokens/s and MFU all depend on model, batch, sequence and precision. Changing any of them changes the work, so the comparison measures a different job.
2. What goes wrong when CUDA timing omits synchronization?
   - Kernel launches are asynchronous, so the timer stops at enqueue time. The measured time is launch overhead, far below execution time.
3. What does warmup settle, and what happens without it?
   - Compilation, allocator blocks and cache state. Without warmup the first trials are slower and more variable, and the mean misleads.
4. What belongs in a regression evidence manifest?
   - Workload identity and hash, configuration, code version, hardware and topology, backend, environment flags, raw timing samples, and the correctness-guard result.

</details>

#### U4. Timeline attribution and multi-rank trace alignment

**About 5 h** · **Target:** Measure

Topics: CPU, input, kernel, memory and communication timeline attribution; PyTorch profiler and multi-rank trace alignment

A single step-time number hides whether input, kernels or collectives dominate. Aligned traces turn the number into an attributable timeline.

**You can now**

- Attribute step time to CPU, input, kernel, memory and communication regions from a trace.
- Collect PyTorch profiler traces with NVTX ranges and align multi-rank timelines by collective markers.
- State observer overhead and cross-rank timing limits for every trace claim.

**Study**

1. [PyTorch profiler, NVTX and Nsight timelines](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 1 to 5, 13 and 14) - Chapter 13, Profiling PyTorch to Identify Bottlenecks, with Using PyTorch Profiler and System Profiling with Nsight Systems and NVTX Timelines.
2. [Nsight traces and memory timelines](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/cs336_assignment2_systems.pdf) (CS336 Assignment 2 (Spring 2026) - Profiling and Parallelism Analysis) - Section 2.1.4 `nsys_profile` and Section 2.1.6 `memory_profiling` in the Spring 2026 handout: trace-to-timer match, top kernels and the memory timeline.
3. [Reading a trace against predictions](https://jax-ml.github.io/scaling-book/profiling) (How to Scale Your Model - Chapters 1, 5, 9 and 12) - Trace Viewer through the worked problems, including the feedforward versus ReduceScatter timing check and the memory profile.
4. [Systematic profiling and fleet traces](https://mlsysbook.ai/vol2/performance_engineering/performance_engineering.html) (Machine Learning Systems Volume II - Fleet Orchestration and Performance Engineering) - System Profiling with the drill from application to operation, and Measurement at Scale on fleet traces and gray stragglers.

**Focus**

- Split the step into input wait, host transfer, forward and backward kernels, bucket collectives, optimizer and checkpoint. `torch.cuda.nvtx.range_push` and `range_pop` name regions so kernels map to source.
- Ranks have skewed clocks, so align by collective entry and exit markers and sequence numbers, never by raw wall-clock order.
- The profiler perturbs the run: the MLSys book puts full traces with memory profiling at 10 to 20 percent overhead, and a recorded run can keep buffers alive longer and raise peak memory. Compare with and without profiling and state the overhead beside every trace claim.

**Reproduce:** Without notes, capture a three-step CPU trace with `torch.profiler.profile`, `record_shapes=True` and `torch.profiler.record_function` labels around forward and backward (NVTX ranges show up in Nsight Systems, not in this trace), export the chrome trace, and name the top operation class by time.

**Traps**

- Ordering cross-rank events by unsynchronized wall-clock. Clock skew exceeds collective latency, so apparent order is not causal order.
- Quoting a profiled run's peak memory or step time as the production number. The trace shows the structure of the step correctly, but its absolute numbers overstate the unobserved run.
- Blaming the network for an NCCL wait when the peer is stalled in the data loader. The waiter is the victim; the straggler is the cause.

**Practice**

- [CS336 Assignment 2: `nsys_profile` and `memory_profiling`](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/cs336_assignment2_systems.pdf) - Section 2.1.4 `nsys_profile` and Section 2.1.6 `memory_profiling` in the Spring 2026 handout; match trace totals to timers and attribute peaks on the memory timeline. Start with the CPU profiler path on your machine. Nsight portions need NVIDIA tooling; state observer overhead in the report.

**Stop when:** Your attributed timeline names the dominant region for one step, aligned across two ranks by collective markers, with overhead stated.

<details>
<summary>Self-test</summary>

1. What do NVTX ranges add to a profiler trace?
   - Named source regions around forward, backward and transfers. Kernels inside a range inherit its label, so time maps to code instead of anonymous kernels.
2. How do you align two rank timelines?
   - By shared collective markers with matching sequence numbers and entry or exit events. Raw timestamps cannot order across skewed clocks.
3. How do you check profiler overhead?
   - Compare step time and key counters with and without the profiler on the same fixed workload. Report the difference beside trace-derived numbers.
4. Rank 0 waits in `all_reduce` while rank 1 loads data. Which is the cause?
   - Rank 1 input stall is the cause. Rank 0 wait is the victim symptom; fixing the network would not move the step.

</details>

#### U5. NCCL traces, Flight Recorder and desynchronization reports

**About 3 h** · **Target:** Measure

Topics: NCCL traces, flight recorder and desynchronization reports

A hung job parks every rank inside the same collective wait. The desync report and recorder history name the rank that never arrived.

**You can now**

- Enable the desynchronization report and Flight Recorder controls and read which rank and collective fell out of step.
- Analyze per-rank dumps with the `fr_trace` tool to separate first cause from synchronization victims.
- Distinguish PyTorch-level recorder controls from NCCL-level transport controls.

**Study**

1. [Flight Recorder for stuck jobs](https://docs.pytorch.org/tutorials/unstable/flight_recorder_tutorial.html) (PyTorch Flight Recorder Tutorials) - Enabling Flight Recorder through Analyzing Flight Recorder Dumps, with `TORCH_NCCL_TRACE_BUFFER_SIZE`, `TORCH_NCCL_DUMP_ON_TIMEOUT` and `TORCH_FR_DUMP_TEMP_FILE` (page read 2026-10-14).
2. [Hangs with TorchComms and the debug server](https://docs.pytorch.org/tutorials/intermediate/debug_hangs_with_flight_recorder.html) (PyTorch Flight Recorder Tutorials) - The Scenario through Running the FR CLI on Per-Rank Pickle Dumps, with `TEST_BACKEND=gloo` and `TEST_DEVICE=cpu` (page read 2026-10-14). Depth: The tutorial runs on CPU with `TEST_BACKEND=gloo` and `TEST_DEVICE=cpu`, but it needs the separate torchcomms package, and its `pip install torchcomms` line fetches a PyPI placeholder (0.0.1) whose import raises "can't be installed via PyPi"; install it as the torchcomms README describes. Treat dump reading as the core skill and the CPU run as optional.
3. [Desync reports, recorder traces and NCCL transport logs](https://github.com/stas00/ml-engineering/blob/139708e52cb06f9191cf1d9959def9187b205c58/debug/pytorch.md) (Machine Learning Engineering Open Book - Network, Debug, Training Performance and Orchestration) - Diagnosing crashes hangs and tracing execution: The desync report with `TORCH_NCCL_DESYNC_DEBUG`, The flight recorder trace with `TORCH_FR_BUFFER_SIZE` and `TORCH_FR_DUMP_TEMP_FILE`, and `NCCL_DEBUG=INFO` with `NCCL_DEBUG_SUBSYS`.

**Focus**

- The desync report names the rank and collective that fell out of step at timeout. The recorder adds per-rank collective history with Python stacks. Enable both before launching; dumps are post-mortem.
- The `fr_trace` analysis aggregates per-rank pickles and shows states and sequence numbers. A collective with matching `collective_seq_id` across ranks but a missing rank points at the rank that never arrived.
- `TORCH_FR_BUFFER_SIZE` and `TORCH_NCCL_DUMP_ON_TIMEOUT` are PyTorch recorder controls. `NCCL_DEBUG` and `NCCL_DEBUG_SUBSYS` are NCCL transport controls. Before PyTorch 2.9 the buffer variables carried `TORCH_NCCL_` names that still work with a warning.

**Reproduce:** Closed-book, list the variables that arm dump-on-timeout and the analysis command: `TORCH_FR_BUFFER_SIZE=2000`, `TORCH_NCCL_DUMP_ON_TIMEOUT=1` and `TORCH_FR_DUMP_TEMP_FILE=/tmp/fr/rank_` (one file per rank, `/tmp/fr/rank_0` and so on), plus `TORCH_NCCL_ENABLE_MONITORING=1`, which the installed `ProcessGroupNCCL.hpp` requires for the dump, then `python -m torch.distributed.flight_recorder.fr_trace /tmp/fr -p rank_`.

**Traps**

- Mixing recorder and transport layers. `NCCL_DEBUG=INFO` shows devices and sockets, not which Python collective mismatched.
- Using the pre-2.9 buffer names without knowing they warn. Old and new names both arm the recorder, but only the new names are quiet.
- Assuming CPU runs record nothing. In PyTorch 2.14.1 the recorder also logs gloo collectives, with entries such as `gloo:all_reduce` and their sequence ids, but the automatic dump on timeout comes from the NCCL watchdog. A CPU drill needs an explicit dump: the private `torch._C._distributed_c10d._dump_fr_trace()` returns the pickled trace as bytes.

**Practice**

- The section mini-project covers this: diagnose one injected hang from per-rank dumps, naming the first-cause rank and the victim ranks.

**Stop when:** You can arm the recorder variables from memory and read a desync plus `fr_trace` output down to the first-cause rank.

<details>
<summary>Self-test</summary>

1. What does the desync report add over a bare timeout?
   - It names which collective and which rank fell out of step, instead of leaving every rank parked in the same wait with no attribution.
2. The aggregated dump shows a collective with `missing_ranks` holding one rank. What does that mean?
   - That rank never reached the collective with the matching sequence number. It is the first suspect; the waiting ranks are victims.
3. Which controls belong to PyTorch and which to NCCL?
   - PyTorch owns the recorder buffer, dump-on-timeout and dump path. NCCL owns `NCCL_DEBUG`, `NCCL_DEBUG_SUBSYS`, interface selection and transport logging.

</details>

#### U6. Compute, memory and communication bounds and exposed communication

**About 4 h** · **Target:** Measure

Topics: Compute-bound, memory-bound and communication-bound diagnosis; Collective overlap and exposed communication measurement

Optimizing the wrong bound wastes the change. This unit predicts the limit first, then proves overlap with timelines instead of assuming it.

**You can now**

- Label a workload compute, memory or communication bound from roofline intensity and trace evidence.
- Measure collective overlap and exposed communication for one bucket or prefetch policy.
- Predict the dominant limit of one run before tracing, then quantify the residual.

**Study**

1. [Roofline derivations with answers](https://jax-ml.github.io/scaling-book/roofline) (How to Scale Your Model - Chapters 1, 5, 9 and 12) - Where Does the Time Go through A Few Problems to Work, with the intensity definition, the Q1 derivation and Q5 on the H100 crossover, all with answers.
2. [GPU rooflines for parallel dimensions](https://jax-ml.github.io/scaling-book/gpus) (How to Scale Your Model - Chapters 1, 5, 9 and 12) - Rooflines for LLM Scaling on GPUs with the DP, TP, EP and PP cost models, worked examples and Quiz 5 with answers. Depth: Keep TPU ICI constants out of NCCL predictions. Re-parameterize collective costs for your fabric.
3. [Overlap math and roofline tables](https://mlsysbook.ai/vol2/performance_engineering/performance_engineering.html) (Machine Learning Systems Volume II - Fleet Orchestration and Performance Engineering) - Communication-Computation Overlap with the overlap inequality and the 7B worked step, and The Memory Wall and Roofline Diagnosis with the intensity table.
4. [Overlap in practice](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 1 to 5, 13 and 14) - Chapter 4, Overlapping Communication and Computation (Pipelining), with Achieving Maximal Overlap in Practice and Distributed Data Parallel Strategies.

**Focus**

- Intensity is $`I = \text{FLOPs} / \text{bytes}`$. Above the ridge (near 295 FLOP per byte for H100 FP16) the op is compute bound; below it, memory bound. Communication bound means exposed collective time dominates the step.
- Exposed communication is total collective time minus the overlapped part. Overlap needs asynchronous buckets or prefetch on separate streams plus enough compute to hide the transfer.
- Small messages are launch bound, not bandwidth bound. Halving the bytes halves the bandwidth term but leaves the latency term, so the factor-of-two slogans fail there.

**Reproduce:** Closed-book, compute intensity for an int8 matmul with $`B = 32`$ and $`D = F = 4096`$, the JAX Q1 shape made concrete (about 17M bytes, about 1.07G FLOPs, $`I \approx 63`$) and label it memory bound against a ridge of 295. Then state the exposed-communication formula as total minus overlapped time.

**Traps**

- Claiming overlap from asynchronous issue alone. Concurrency needs timeline proof that compute and communication actually coincide.
- Assuming reduce-scatter always costs half an all-reduce. That holds for ring all-reduce, which is reduce-scatter plus all-gather; NCCL may run all-reduce as a tree or with in-switch reduction, so measure both.
- Treating intensity as a hardware constant. It is a property of the op shape and batch; the ridge is the hardware property.

**Practice**

- [CS336 Assignment 2: `data_parallel_calcs`, `fsdp_calcs` and `tp_calcs`](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/cs336_assignment2_systems.pdf) - Sections 8.2 to 8.4 in the Spring 2026 handout: backward FLOPs, collective times and the bottleneck inequality for DP, FSDP and TP. Derive the bound inequalities by hand, then validate one term with a trace on hardware you can run honestly.

**Stop when:** You can predict the dominant bound for one configuration, confirm it on a trace, and quantify the residual with a named cause.

<details>
<summary>Self-test</summary>

1. Intensity 63 against ridge 295: which bound?
   - Memory bound. Achievable throughput is bandwidth times intensity, well below peak FLOPs.
2. What is exposed communication?
   - Collective time not hidden under compute: total communication minus the overlapped portion, measured from aligned timelines.
3. How do you prove overlap instead of mere asynchrony?
   - Show concurrent compute and communication intervals on aligned rank timelines with dependencies that permit concurrency, not just nonblocking calls.
4. When does the reduce-scatter factor-of-two claim break?
   - When all-reduce is not a ring. In the ring model both the latency and the bandwidth terms of reduce-scatter are half those of all-reduce; a tree or in-switch all-reduce, which NCCL may pick, breaks the ratio, so measure it.

</details>

#### U7. Data loader, storage and host-transfer bottlenecks

**About 3 h** · **Target:** Measure

Topics: Data-loader, storage and host-transfer bottlenecks

An idle accelerator is often a starved one. This unit proves the feed path before touching kernels or collectives.

**You can now**

- Separate input starvation from compute and communication bounds with loader and transfer evidence.
- Tune workers, pinned memory and prefetch from a measured loader sweep, not defaults.
- Distinguish storage throughput limits from host-transfer and preprocessing limits.

**Study**

1. [Data pipeline tuning and diagnosis](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 1 to 5, 13 and 14) - Chapter 5, GPU-Based Storage I/O Optimizations, section Tuning the Data Pipeline, with Efficient Data Loading and Preprocessing, Scaling Out Workers as You Scale Out Number of GPUs, and Diagnosing Communication- Versus Compute-Bound Workloads.
2. [Asynchronous DataLoader tuning](https://github.com/stas00/ml-engineering/blob/139708e52cb06f9191cf1d9959def9187b205c58/training/performance/README.md) (Machine Learning Engineering Open Book - Network, Debug, Training Performance and Orchestration) - DataLoader section with `num_workers`, pinned memory and `non_blocking` device copy, plus the `num-workers-bench.py` and `pin-memory-non-block-bench.py` results.
3. [Storage benchmarking for training](https://github.com/stas00/ml-engineering/blob/139708e52cb06f9191cf1d9959def9187b205c58/storage/README.md) (Machine Learning Engineering Open Book - Network, Debug, Training Performance and Orchestration) - Benchmarks section with `fio` for throughput, IOPS and latency, and DLIO for the training-like I/O pattern without accelerators.

**Focus**

- With `num_workers=0` the accelerator blocks on fetch and transforms. Sweep workers and watch iteration time plus CPU saturation; two workers often suffice and more can hang dual loaders.
- `pin_memory=True` with `non_blocking=True` plus prefetch hides host-to-device transfer. Measure with and without: a nonblocking copy from pageable memory buys nothing, pinned memory alone keeps most of the gain, and the pair is best.
- Sequential versus random reads, local NVMe versus shared filesystem, and preprocessing on CPU versus GPU are different limits. `fio` tests the device; DLIO tests the training pattern.

**Reproduce:** From a blank file, sweep `num_workers` from 0 to 4 on a synthetic transform-bound loader, plot mean iteration time with `pin_memory` on and off, and name the count where the curve flattens with CPU saturation as evidence.

**Traps**

- Adding workers until the problem disappears. Dual-loader hangs and diminishing returns need a measured optimum, not a maximum.
- Setting `pin_memory=True` without `non_blocking=True`. Pinned staging without asynchronous copy still blocks the transfer.
- Blaming the interconnect for storage starvation. A slow filesystem or random-read pattern starves every rank identically.

**Practice**

- [Stas Bekman DataLoader benches: num-workers-bench and pin-memory-non-block-bench](https://github.com/stas00/ml-engineering/blob/139708e52cb06f9191cf1d9959def9187b205c58/training/performance/benchmarks/dataloader/num-workers-bench.py) - Run `num-workers-bench.py` with 0 to 4 workers and `pin-memory-non-block-bench.py` with and without pinned async copy; report iteration times with hardware and PyTorch version. Both scripts need CUDA as written: they time with CUDA events and move batches to `cuda:0`. On a CPU-only machine, port the `num_workers` sweep to `time.perf_counter` first; the pinned-memory comparison needs a GPU. Treat the 5.4 to 0.8 s fall as the guide's example, not your target.

**Stop when:** Your loader sweep names the bound (workers, transfer or storage) with iteration times and CPU evidence, and the chosen settings survive a repeat run.

<details>
<summary>Self-test</summary>

1. Iteration time falls from 5.4 s to 0.8 s as workers go 0 to 3, then stalls. What do you conclude?
   - Input was the bound up to 3 workers, then compute or another stage dominates. Adding a fourth worker buys nothing; confirm with CPU saturation and trace attribution.
2. Why pair `pin_memory` with `non_blocking`?
   - Pinned memory lets the copy run as DMA from page-locked memory, which is faster, and `non_blocking=True` lets it overlap compute. A nonblocking copy from pageable memory is still a staged synchronous copy, and pinned memory alone speeds the copy but still blocks.
3. When does `fio` mislead about training input?
   - When the pattern differs: `fio` reports device throughput and IOPS, while training does small random reads with preprocessing. DLIO emulates the loader pattern.

</details>

#### U8. Allocator fragmentation, activation peaks, OOMs and recompilation storms

**About 4 h** · **Target:** Measure

Topics: Allocator fragmentation, activation peaks and OOM diagnosis; Compilation graph breaks and recompilation storms

Out-of-memory and sudden slowdowns after a code edit are usually allocator state or compiler guards, not model size. This unit reads the evidence instead of shrinking the batch blindly.

**You can now**

- Diagnose an OOM as fragmentation, activation peak or leak using allocator and snapshot evidence.
- Fix fragmentation with staged settings and activation peaks with checkpointing or offload, preserving equivalence.
- Detect graph breaks and recompilation storms from logs and explain which change triggered them.

**Study**

1. [CUDA allocator, checkpointing and offload](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 1 to 5, 13 and 14) - Chapter 13, Profiling and Tuning Memory in PyTorch, with Tuning the CUDA Memory Allocator, Activation Checkpointing for Memory Savings, and Offloading Parameters to CPU and NVMe.
2. [Graph breaks and recompilations](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 1 to 5, 13 and 14) - Chapter 14, Explaining and Minimizing Graph Breaks, with Graph Breaks and TorchDynamo explain(), Minimize Graph Recompilations, and Debugging Compiler Phases, Graph Breaks, and Performance.
3. [OOM triage and fragmentation fixes](https://github.com/stas00/ml-engineering/blob/139708e52cb06f9191cf1d9959def9187b205c58/debug/pytorch.md) (Machine Learning Engineering Open Book - Network, Debug, Training Performance and Orchestration) - Debugging CUDA OOM in forward and backward, Overcoming CUDA OOM due to memory fragmentation with expandable segments, and the memory profiler plus allocation tracing sections.

**Focus**

- Free memory with no large-enough block is fragmentation; a spike at a known layer is an activation peak; growth across steps is a leak. `torch.cuda.memory_stats` plus the snapshot timeline separates the three.
- Fix in order: confirm the cause from the snapshot, then try allocator settings such as expandable segments, then activation checkpointing or offload. Each change keeps an equivalence check so memory savings do not silently change numerics.
- `torch._dynamo.explain` plus `TORCH_LOGS` with graph breaks and recompiles names the break. Dynamic shapes and data-dependent branches add guards; each new guard shape recompiles.

**Reproduce:** Without notes, enable the memory snapshot around one training step, capture the peak segment, and explain from the timeline whether the peak is parameters, activations or temporaries. Then run `torch._dynamo.explain` on a toy function with a data-dependent branch and name the break.

**Traps**

- Shrinking the batch for a fragmentation OOM. Smaller tensors can fragment worse; expandable segments or staged allocation often fixes the real cause.
- Enabling checkpointing without accounting for the extra forward FLOPs. Step time grows by the recompute, so MFU falls while HFU counts the extra work.
- Allowing `allow_in_graph` as a quick fix for every break. It bypasses safety checks and can silently produce wrong results.

**Practice**

- [CS336 Assignment 2: `memory_profiling`](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/cs336_assignment2_systems.pdf) - Section 2.1.6 `memory_profiling` in the Spring 2026 handout; attribute the peak at short versus long sequence and the mixed-precision difference on the memory timeline. Use the CPU and portable snapshot path on your machine. GPU peaks need CUDA; report allocator settings beside every number.

**Stop when:** You can classify one OOM from snapshot evidence and silence one recompilation storm by removing or scoping the break that caused it.

<details>
<summary>Self-test</summary>

1. Memory shows 10 GB free but a 2 GB allocation fails. What is the likely cause?
   - Fragmentation: no single free block fits 2 GB. Check the block-size histogram and expandable-segments behavior before changing the model.
2. Peak memory lands on activations at long sequence. Which fixes preserve the update?
   - Activation checkpointing with recomputation, or offload with correct restore. Both keep the mathematical update while trading compute or transfer for memory.
3. Step time jumps after adding a print of a tensor value. What happened?
   - A graph break: Dynamo cannot trace the builtin `print` with a tensor argument, so it splits the graph there and the step pays a device sync to read the value. Confirm with `torch._dynamo.explain` or `TORCH_LOGS=graph_breaks`.

</details>

#### U9. Kernel launch gaps and rank and node straggler localization

**About 4 h** · **Target:** Measure

Topics: Kernel launch gaps and small-operation overhead; Rank and node straggler localization

Thousands of tiny launches leave the accelerator idle between kernels, and one slow rank holds every barrier. Both look like low throughput until per-rank timelines separate them.

**You can now**

- Detect kernel launch gaps and small-operation overhead from kernel counts and non-matmul fractions.
- Localize a rank or node straggler by elimination with per-rank timings.
- Apply graphs or fusion only after traces identify launch overhead as the dominant cost.

**Study**

1. [CUDA graphs for launch overhead](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 1 to 5, 13 and 14) - Chapter 13, Reducing Kernel Launch Overhead with CUDA Graphs, with Capturing a CUDA Graph and Preallocating Memory and Best Practices for CUDA Graphs.
2. [Straggler detection and mitigation](https://arxiv.org/abs/2402.15627) (MegaScale: Scaling Large Language Model Training to More Than 10,000 GPUs) - arXiv:2402.15627v1, Section 5: straggler detection, mitigation and diagnosis tooling with measured MFU attached.
3. [Kernel census from traces](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/cs336_assignment2_systems.pdf) (CS336 Assignment 2 (Spring 2026) - Profiling and Parallelism Analysis) - Section 2.1.4 `nsys_profile` in the Spring 2026 handout: top CUDA kernels, non-matmul share and the AdamW matmul fraction.
4. [Gray stragglers at fleet scale](https://mlsysbook.ai/vol2/performance_engineering/performance_engineering.html) (Machine Learning Systems Volume II - Fleet Orchestration and Performance Engineering) - Measurement at Scale with tiered canaries and gray straggler detection, and System Profiling with bottleneck patterns.

**Focus**

- Launch gaps show as many short kernels with CPU time between them and a high non-matmul share. Small payloads are launch bound: in the MLSys example, a 32.8 KB tensor-parallel all-reduce at batch size 1 takes about 36 ns on 900 GB/s NVLink, against about 5 microseconds of launch overhead.
- Localize stragglers with per-rank step times and barrier waits, then eliminate by node subset. Report max versus median, never the mean alone.
- `torch.cuda.CUDAGraph` replay removes Python and launch gaps for static shapes. It is the fix only when the trace already proves launch dominates.

**Reproduce:** Without notes, take one profiler trace and compute the top kernel by time, the non-matmul time share, and max versus median rank step time. State launch-bound, kernel-bound or straggler-bound with the numbers.

**Traps**

- Fusing kernels before traces identify launch as dominant. Kernel work without a measured launch bottleneck adds complexity for no step-time gain.
- Averaging rank times. One slow rank hides inside a healthy mean; max versus median exposes it.
- Calling a barrier waiter slow. The waiter is the victim of the straggler that arrives last.

**Practice**

- [CS336 Assignment 2: `nsys_profile` kernel census](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/cs336_assignment2_systems.pdf) - Section 2.1.4 `nsys_profile` in the Spring 2026 handout; report the top kernels, the non-matmul share and whether launch or kernels dominate. Nsight needs NVIDIA tooling. On CPU use the PyTorch profiler kernel list as the portable substitute and state the substitution.

**Stop when:** Your trace census names launch, kernel or straggler as the dominant cost with per-rank max versus median evidence.

<details>
<summary>Self-test</summary>

1. What trace signature says launch-bound?
   - High kernel count with short mean duration, visible CPU gaps between launches, and a large non-matmul time share.
2. Ranks report steps of 100, 102, 99 and 250 ms. What do you report?
   - A straggler on the fourth rank: median about 101 ms, max 250 ms. The mean hides it; investigate that rank or node first.
3. When do CUDA graphs help, and what breaks them?
   - They help when launch overhead dominates at static shapes. Dynamic shapes, data-dependent control flow and host syncs break capture or force recapture.

</details>

#### U10. Network, topology and placement regressions and numerical instability at scale

**About 4 h** · **Target:** Explain + Measure

Topics: Network, topology and placement regressions; Numerical instability under precision or scale changes

A slower step after a move or a dtype switch is two different failures. Placement changes the interconnect; precision changes the arithmetic. Each needs its own test.

**You can now**

- Explain how placement across slow links produces a throughput regression at fixed workload.
- Detect a topology or placement regression from bandwidth and trace evidence.
- Detect numerical instability from a precision or scale change with equivalence tests.

**Study**

1. [Topology, NCCL and multinode pitfalls](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 1 to 5, 13 and 14) - Chapter 2, Ultrascale Networking Treating Many GPUs as One, with NVLink and NVSwitch, and Chapter 4, Topology Awareness in NCCL with Multinode Communication Pitfalls.
2. [NCCL transport diagnosis](https://github.com/stas00/ml-engineering/blob/139708e52cb06f9191cf1d9959def9187b205c58/network/debug/README.md) (Machine Learning Engineering Open Book - Network, Debug, Training Performance and Orchestration) - How to diagnose NCCL connectivity issues with `NCCL_DEBUG=INFO`, interface selection via `NCCL_IB_HCA` and `NCCL_SOCKET_IFNAME`, and `NCCL_DEBUG_SUBSYS` for collective versus topology failures.
3. [Topology-aware placement](https://mlsysbook.ai/vol2/fleet_orchestration/fleet_orchestration.html) (Machine Learning Systems Volume II - Fleet Orchestration and Performance Engineering) - Topology-Aware Scheduling with link tiers and compact pod placement, plus quarantine of bad nodes, racks or links from Elastic Scheduling.
4. [Numerical correctness under precision change](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 1 to 5, 13 and 14) - Chapter 14, Performance Hints and Debugging Generated Code plus Debugging Numerical Correctness and Accuracy.

**Focus**

- Moving collectives from NVLink to inter-node links cuts effective bandwidth severalfold. A scattered allocation or a degraded switch shows as stretched communication on traces with unchanged compute.
- Read bus bandwidth for the fabric and algorithm bandwidth for the workload. A busbw drop is the network; a stable busbw with slower steps is placement or overlap loss.
- Precision switches change range and rounding: FP16 overflows where BF16 survives, and larger scales reorder reductions. Gate every switch on loss and gradient equivalence within a derived tolerance plus overflow counters.

**Reproduce:** Without notes, state the two-check procedure for a slower step after a move or dtype switch: first the topology check with `NCCL_DEBUG=INFO` interface and topology lines plus busbw, then the numerical check with reference loss and gradient comparison plus overflow counts.

**Traps**

- Quoting microbenchmark busbw as a training speedup. The benchmark measures the fabric; the workload adds overlap, imbalance and launch effects.
- Blaming code for a fabric change. A new allocation, a replaced switch or a degraded link regresses throughput with identical code.
- Treating BF16 as a wider FP16. Subnormal handling, overflow thresholds and loss-scaling needs differ, so FP16 recipes do not transfer verbatim.

**Practice**

- The section mini-project covers this: a placement-regression experiment with busbw and trace evidence, plus a precision-switch equivalence gate with overflow counts.

**Stop when:** You can separate a placement regression from a numerical regression on one slowed run, with the fabric and equivalence evidence named.

<details>
<summary>Self-test</summary>

1. Steps slow 20 percent with identical code and config. What do you check first?
   - Placement and fabric: allocation map, `NCCL_DEBUG=INFO` transport lines, busbw versus history, and whether collectives crossed to slower links.
2. Busbw is stable but steps are slower. What does that separate?
   - Fabric health from workload placement and overlap. The links deliver, but collectives now cross slower tiers or hide less under compute.
3. What gates a precision switch?
   - Loss and gradient equivalence against the reference within a derived tolerance, plus overflow and underflow counters, all at fixed workload and seed.

</details>

#### U11. Gang scheduling, quotas, preemption, capacity and Kubernetes versus Slurm

**About 5 h** · **Target:** Explain

Topics: Gang scheduling and topology-aware placement; Quotas, fairness, backfill and preemption vocabulary; Capacity, queue time and accelerator fragmentation; Kubernetes and Slurm policy comparison

A fast plan that never gets compact accelerators together finishes later than a slower plan that does. Scheduling decides which evidence the fleet can even produce.

**You can now**

- Explain gang scheduling and topology-aware placement for synchronous training jobs.
- Use quotas, fairness, backfill and preemption vocabulary to predict queue and share behavior.
- Compare Kubernetes and Slurm policy controls for one training job.
- Explain capacity, queue time and accelerator fragmentation.

**Study**

1. [The scheduling problem and paradigms](https://mlsysbook.ai/vol2/fleet_orchestration/fleet_orchestration.html) (Machine Learning Systems Volume II - Fleet Orchestration and Performance Engineering) - The Scheduling Problem with gang scheduling and fragmentation, and Orchestration Paradigms with Slurm batch versus Kubernetes reconciliation plus Volcano and Kueue.
2. [Placement, elasticity and tenancy](https://mlsysbook.ai/vol2/fleet_orchestration/fleet_orchestration.html) (Machine Learning Systems Volume II - Fleet Orchestration and Performance Engineering) - Topology-Aware Scheduling with compact placement, Elastic Scheduling with grow-shrink contracts, and Multi-Tenancy and Quotas with fair-share, borrowing and preemption.
3. [Slurm user controls](https://github.com/stas00/ml-engineering/blob/139708e52cb06f9191cf1d9959def9187b205c58/orchestration/slurm/users.md) (Machine Learning Engineering Open Book - Network, Debug, Training Performance and Orchestration) - Partitions with `sinfo` and `scontrol`, wait time with `squeue`, allocation and faulty-node exclusion, plus FairShare with `sshare`.
4. [Kubernetes versus Slurm for GPUs](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 1 to 5, 13 and 14) - Chapter 3, Job Scheduling with Kubernetes and SLURM, with Kubernetes Topology Manager and Slicing a GPU with MIG.

**Focus**

- Synchronous collectives barrier across ranks, so a training job needs all its accelerators together or none. Fragmentation is idle GPUs that no queued shape fits; topology-aware placement keeps collectives on fast tiers.
- Quotas cap shares, fair-share favors historically under-served teams, backfill slides small jobs into idle holes, and preemption reclaims with a checkpoint-and-restart cost.
- Slurm speaks partitions, jobs and FairShare. Kubernetes speaks queues, priorities and reconcilers with gang and topology plugins. Both need the same two guarantees: all-or-nothing start and compact placement.

**Reproduce:** Without notes, state the gang condition for a synchronous job with $`p`$ ranks, give one fragmentation example where free GPUs cannot fit the next queued shape, and name the Slurm and Kubernetes control that expresses each of quota, priority and topology.

**Traps**

- Demanding gang scheduling for everything. Asynchronous shards and elastic jobs can grow or shrink; only synchronous barriers need all-or-nothing.
- Reading fair-share as an equal split now. It weights history, so a recently heavy team waits behind a light one at equal quotas.
- Scheduling without topology. Scattered ranks across slow tiers run measurably slower at identical GPU count.

**Practice**

- The section mini-project covers this: a fleet and placement simulator with gang, topology, quota, fairness, fragmentation, preemption and failure scenarios.

**Stop when:** You can predict queue, share and placement outcomes for one job under stated quotas and topology, and name the control that enforces each.

<details>
<summary>Self-test</summary>

1. Why does synchronous data-parallel training need gang scheduling?
   - Every step barriers across ranks in collectives. A partially started job holds accelerators while waiting for the rest, wasting the held share.
2. Eight GPUs are free as four plus four on two nodes but the queue wants eight compact. What is this?
   - Fragmentation with a topology constraint. The GPUs are idle yet unusable for the queued shape without crossing the slower tier.
3. How do backfill and preemption differ in cost?
   - Backfill uses idle holes without disturbing running jobs. Preemption reclaims running capacity and pays checkpoint, lost-work and restart costs.
4. Which controls set quota and topology in Slurm versus Kubernetes?
   - Slurm uses partitions, QoS and FairShare with node constraints and exclusions. Kubernetes has ResourceQuota and PriorityClass built in; queues, gang admission and cross-node topology placement come from add-ons such as Kueue or Volcano, while the kubelet Topology Manager only aligns CPUs and devices inside one node.

</details>

#### U12. Health checks, canaries, rollback, runbooks and fleet anomaly detection

**About 4 h** · **Target:** Explain + Implement

Topics: Health checks, canaries, rollback and runbooks; Automated anomaly detection over fleet telemetry

Fleets fail in the same few ways. Checks that match those modes plus a rehearsed runbook turn incidents into routine requeues.

**You can now**

- Design health checks, canaries and rollback gates for a training fleet.
- Write a runbook that maps symptom to evidence to cause for hangs, OOMs and stragglers.
- Explain fleet anomaly detection over telemetry including gray slow failures.

**Study**

1. [Debugging utilization and fleet telemetry](https://mlsysbook.ai/vol2/fleet_orchestration/fleet_orchestration.html) (Machine Learning Systems Volume II - Fleet Orchestration and Performance Engineering) - Debugging Cluster Utilization with policy-topology mismatch diagnosis, and Cost Optimization with spot and checkpoint-on-preemption strategy.
2. [Canaries and gray failures at scale](https://mlsysbook.ai/vol2/performance_engineering/performance_engineering.html) (Machine Learning Systems Volume II - Fleet Orchestration and Performance Engineering) - Measurement at Scale with fleet MFU, scaling tax, tiered canaries and gray straggler detection.
3. [Heartbeat, diagnosis and fast restart](https://arxiv.org/abs/2402.15627) (MegaScale: Scaling Large Language Model Training to More Than 10,000 GPUs) - arXiv:2402.15627v1, Section 4: heartbeat-based detection, automated fault localization and fast recovery.
4. [Faulty-node triage in Slurm](https://github.com/stas00/ml-engineering/blob/139708e52cb06f9191cf1d9959def9187b205c58/orchestration/slurm/users.md) (Machine Learning Engineering Open Book - Network, Debug, Training Performance and Orchestration) - Find faulty nodes and exclude them, with the GPU memory check, the NCCL barrier test and the network failure exclusion pattern.

**Focus**

- Health checks must match the failure taxonomy: GPU access, link errors, memory, plus an NCCL barrier test for collective hangs. Run them at alloc and re-run after any hang before requeue.
- A canary is a small fixed workload that must pass before and after each change. Rollback returns to the last-known-good config and checkpoint when it fails.
- Gray failures are slow, not dead: limping links, throttled clocks, skewed input. Tiered canaries plus MFU and scaling-tax trends catch what binary alive checks miss.

**Reproduce:** From a blank file, write a one-page NCCL-hang runbook: symptom, evidence commands with `NCCL_DEBUG=INFO`, the desync report and `fr_trace` plus per-rank times, a cause table, and actions for exclude, rollback and requeue.

**Traps**

- Health checks without a collective test. GPUs can pass memory checks yet hang every all-reduce on a broken link.
- Canaries without a fixed workload. An unpinned canary passes or fails for workload reasons, hiding the regression.
- Auto-restart onto the same nodes. Without exclusion the job repeats the failure and burns goodput.

**Practice**

- The section mini-project covers this: health checks, a canary with rollback, and a runbook rehearsed against an injected hang, OOM and straggler.

**Stop when:** Your runbook resolves one injected failure to exclusion plus rollback plus requeue, with the evidence trail attached.

<details>
<summary>Self-test</summary>

1. What belongs in a pre-flight health check?
   - GPU access and memory, link error counters, interface selection, a small NCCL barrier or all-reduce, and storage reachability. Each maps to a known failure mode.
2. How do canary and rollback work together?
   - The canary gates promotion: it must pass on the new config. On failure, rollback restores the last-known-good code, config and checkpoint.
3. What is a gray failure and what catches it?
   - A component that is slow rather than dead, such as a degraded link. Trend canaries, per-rank timing skew and MFU drops catch it; alive checks do not.

</details>

#### U13. Cost per useful token and performance per watt

**About 3 h** · **Target:** Derive

Topics: Cost per useful token and performance per watt

Throughput without price picks pretty configurations. Cost per useful token picks the one the budget can actually train on.

**You can now**

- Derive cost per useful token from goodput, price and overhead.
- Compare throughput and latency designs in cost terms at fixed quality.
- Explain performance per watt and where power dominates cost.

**Study**

1. [Fleet cost optimization](https://mlsysbook.ai/vol2/fleet_orchestration/fleet_orchestration.html) (Machine Learning Systems Volume II - Fleet Orchestration and Performance Engineering) - Cost Optimization with idle-cost math, spot versus reserved tiers and checkpoint-on-preemption strategy.
2. [Goodput, power and upgrade ROI](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 1 to 5, 13 and 14) - Chapter 1, Measuring Goodput Useful Throughput, and Chapter 2, Compute Density and Power Requirements with ROI of Upgrading Your Hardware.
3. [End-to-end time and cost estimate](https://jax-ml.github.io/scaling-book/applied-training) (How to Scale Your Model - Chapters 1, 5, 9 and 12) - The LLaMA 70B case study on a TPU v5p pod with the training time estimate worked from the parallelism plan (44 days at 40 percent MFU, a TPU number).

**Focus**

- Cost per useful token is price per hour divided by goodput tokens per hour: $`C = P / G`$. Goodput, not raw throughput, belongs in the denominator because failures and idle raise cost per finished token.
- For training the trade is time to result against cost: more accelerators finish sooner at lower scaling efficiency, so each useful token costs more. Fix the quality target, a loss or eval score, before comparing configurations.
- Performance per watt is useful tokens per joule, or $`\text{tokens/s} / \text{watts}`$. Idle and cooling watts count; an allocated but stalled fleet still bills and burns.

**Reproduce:** Closed-book, derive dollars per 1k tokens for $`P = 16`$ dollars per hour at $`G = 10{,}000`$ tokens/s: hourly tokens are $`36{,}000{,}000`$, so $`C \approx 4.44 \times 10^{-7}`$ dollars per token, about 0.00044 dollars per 1k and 0.44 dollars per 1M.

**Traps**

- Pricing raw throughput instead of goodput. Restarts, retries and queue idle are paid for but produce no finished tokens.
- Comparing an FP8 run with a BF16 run on dollars per token without a quality gate. Cheaper tokens that hurt convergence are not cheaper training.
- Counting only compute watts. Idle draw, cooling and stalled-but-allocated hours dominate at fleet scale.

**Practice**

- The section mini-project covers this: validate a capacity and cost model for one scenario and explain the residual and portability limits.

**Stop when:** You can derive dollars per useful token for one scenario from stated price and goodput, and name which overhead dominates it.

<details>
<summary>Self-test</summary>

1. Write the cost-per-useful-token formula and name each term.
   - $`C = P / G`$ with $`P`$ the all-in price per hour and $`G`$ the goodput in finished tokens per hour, including failure and idle effects.
2. Why can the cheapest dollars-per-token config be the wrong choice?
   - It may miss the latency, quality or deadline constraint. Cost compares only among configs that meet quality and schedule gates.
3. How does spot pricing change the math?
   - Spot lowers $`P`$ but adds preemption tax in $`G`$: checkpoint, lost work and restart. The switch wins only when the price cut exceeds the goodput cut.

</details>

#### U14. A small real-code contribution with before and after evidence

**About 6 h** · **Target:** Implement + Measure

Topics: Small real-code contribution with before and after evidence

The section ends where the track ends: a real change to real code, defended by measurement instead of adjectives. Bounded scope plus fallback keeps the contribution reviewable.

**You can now**

- Instrument a real training codebase with correlated rank, collective and memory timelines for one bottleneck.
- Implement one bounded optimization or observability contribution with regression, equivalence and fallback tests.
- Compare off versus on under fixed workload with variance, preserving a regime where the change loses or does not apply.

**Study**

1. [Debugging workflow and fake backends](https://github.com/pytorch/torchtitan/blob/0b75362025f037a2d1a23240ba21786928a9052e/docs/debugging.md) (TorchTitan) - Enable Memory Profiling, Fake Backend Debugging with fake versus real-PP-fake-SPMD modes, Memory debugging workflow, and Troubleshooting jobs that timeout with Flight Recorder dumps.
2. [CPU unit tests as the contribution gate](https://github.com/pytorch/torchtitan/tree/0b75362025f037a2d1a23240ba21786928a9052e/tests/unit_tests/cpu) (TorchTitan) - `test_checkpoint.py`, `test_fsdp.py` and `test_parallelism_config.py`; run with pytest and keep the suite green before and after the change.
3. [Contribution and measurement requirements](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/capstones/distributed-training-systems-laboratory.md) (Distributed Training Systems Laboratory) - Milestone C for hypothesis, invariants, alternatives and reversal conditions, and Milestone E for baseline-versus-alternative comparison with retained negative results.
4. [Ordered optimization method](https://mlsysbook.ai/vol2/performance_engineering/performance_engineering.html) (Machine Learning Systems Volume II - Fleet Orchestration and Performance Engineering) - The Optimization Playbook: A 70B LLM Case Study with the diagnostic sequence, combining rules and lessons.

**Focus**

- Bounded means one measured bottleneck, one seam, one config flag with fallback. Name the hypothesis, the invariants, the predicted regimes and the reversal conditions before coding.
- Off-versus-on runs share model, data, batch, precision, topology and correctness oracle, and report step time, tokens/s, memory, communication, utilization and failures with variance. Keep a losing regime in the report.
- Defend against two alternatives and show the change addresses the traced critical path rather than an attractive proxy. No benchmark-only special cases and no transfer claims beyond measured scope.

**Reproduce:** Closed-book, state the contribution contract: hypothesis, invariants, predicted regimes, two alternatives, reversal conditions, equivalence tests, fallback flag, and the off-versus-on metric set with variance.

**Traps**

- Optimizing a microbenchmark instead of the traced critical path. Busbw wins that do not move step time are proxies.
- Shipping without fallback or with a benchmark-only branch. The capstone rejects both: retain the baseline path and fail cleanly.
- Claiming transfer to other hardware or scales. One GPU plus CPU evidence never proves multi-GPU or multi-node behavior.

**Practice**

- [TorchTitan CPU unit tests with one bounded change](https://github.com/pytorch/torchtitan/tree/0b75362025f037a2d1a23240ba21786928a9052e/tests/unit_tests/cpu) - Run `test_checkpoint.py`, `test_fsdp.py` and `test_parallelism_config.py` with pytest at the pinned commit, then implement one bounded improvement through the `debugging.md` workflow with fallback and equivalence tests. Install the repository's `requirements.txt` first: it pins `grain`, `datasets` and a git build of `torch_remat`. Without them the failures are environmental (a bare environment fails one `test_checkpoint.py` case on a missing `datasets` import). Do not attempt a wholesale rewrite.

**Stop when:** Your change passes the CPU suite, beats the baseline on the traced bottleneck at fixed workload with variance, keeps fallback, and names where it loses or does not transfer.

<details>
<summary>Self-test</summary>

1. What makes a contribution bounded?
   - One bottleneck from a trace, one seam, one flag with fallback, plus stated regimes and reversal conditions. Anything larger is a rewrite, not a contribution.
2. What does a complete off-versus-on comparison include?
   - Fixed workload and oracle, step time and tokens/s with variance, memory, communication and utilization deltas, failure counts, and a preserved losing or not-applicable regime.
3. Why two alternatives?
   - They test whether the chosen fix beats the next-best options on the same evidence. A lone proposal cannot show it addresses the bottleneck rather than coinciding with noise.

</details>

### Mini-project: Measured fleet baseline with one real-code win

**About 20 to 30 hours.** Build fixed-workload benchmarks, aligned traces and fleet simulators in trainlab, rehearse hang, placement and cost regressions, then land one bounded change in a real training codebase with before-and-after evidence. Every claim separates CPU, single-GPU and multi-GPU evidence and keeps the regimes where the change loses.

1. Write the fixed-workload harness with warmup, synchronization and a correctness guard that rejects fast-but-wrong results, and solve the CS336 benchmarking problems while stating tokens per second, MFU, HFU and goodput.
2. Capture attributed timelines with profiler ranges around transfers and collectives, align ranks by collective markers, and work the CS336 trace and memory problems while stating observer overhead.
3. Inject one hang, arm the recorder and desync controls before launch, and diagnose the first-cause rank against victim ranks from per-rank dumps with the analysis tool; on CPU, dump explicitly, since automatic dumps on timeout come from the NCCL watchdog.
4. Predict the bound with the CS336 inequalities before tracing, measure exposed communication for one bucket policy, run the Stas loader sweep to rule out starvation, and gate a precision switch on equivalence with overflow counts; with two or more GPUs, read a placement regression from busbw and traces.
5. Extend `plan/` with a fleet and placement simulator covering gang starts, topology-aware placement, quotas, fairness, backfill, fragmentation, preemption and failures, and validate it against hand-worked scenarios.
6. Write health checks with a collective test, a fixed-workload canary with rollback, and runbooks rehearsed against injected hang, OOM and straggler; validate the cost-per-useful-token model for one scenario with residual and portability limits.
7. Land one bounded change in Picotron, TorchFeather, TorchTitan or an isolated Bumblebee branch through the debugging workflow: fixed-workload baseline, aligned profiles, equivalence plus regression tests, fallback flag, before-and-after results with variance, and the losing regime.

**Deliverables**

- The fixed-workload harness with manifests, attributed timelines, hang diagnosis and bound plus placement evidence.
- The fleet simulator with scenario results, health checks, canary, runbooks and the validated cost model.
- The bounded real-code change with baseline, profiles, equivalence and regression tests, variance and losing regimes.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [CS336 Assignment 2 profiling and scaling problems](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/cs336_assignment2_systems.pdf). Run the benchmarking, trace, memory and bound problems on hardware each part honestly allows.
- external-tests: [Stas DataLoader benches](https://github.com/stas00/ml-engineering/blob/139708e52cb06f9191cf1d9959def9187b205c58/training/performance/benchmarks/dataloader/num-workers-bench.py). Port the loader sweep first, then run the pinned-transfer comparison where a GPU exists.
- external-tests: [PyTorch Flight Recorder tutorial](https://docs.pytorch.org/tutorials/unstable/flight_recorder_tutorial.html). Arm the recorder controls and read per-rank dumps down to first cause.
- external-tests: [TorchTitan CPU unit tests](https://github.com/pytorch/torchtitan/tree/0b75362025f037a2d1a23240ba21786928a9052e/tests/unit_tests/cpu). Keep the suite green before and after the bounded change.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Honest measurement | Fixed workload with correctness guard, raw samples with variance, and overhead stated beside trace claims. | A second operator reproduces the headline numbers from the manifest, and losing shapes stay in the report. |
| Diagnosis and fleet | Hang, placement and precision regressions localize first cause, and the simulator covers gang, quota and failure scenarios. | Runbooks resolve injected faults to exclusion plus rollback, and the cost model explains its residual. |
| Real-code change | The bounded change passes the CPU suite and equivalence tests, beats the baseline on the traced bottleneck, and keeps fallback. | Two alternatives are defended against, and a preserved losing regime bounds where the change applies. |

Feeds into: The harness, simulator, runbooks and extension become the capstone evidence core with its skeptical defense.

### Resource route

- **Primary - Book:** [Machine Learning Systems Volume II - Fleet Orchestration and Performance Engineering](https://mlsysbook.ai/vol2/fleet_orchestration/fleet_orchestration.html) - Read Scheduling Problem, Orchestration Paradigms, Topology-Aware Scheduling, Elastic Scheduling, Cost Optimization, Multi-Tenancy and Quotas and Debugging Cluster Utilization, then Memory Wall and Roofline Diagnosis, Graph Compilation, Communication-Computation Overlap, System Profiling and Measurement at Scale at https://mlsysbook.ai/vol2/performance_engineering/performance_engineering.html. Use the framework to choose one bottleneck-specific lab and one rollback metric.
- **Required - Book:** [AI Systems Performance Engineering - Chapters 1 to 5, 13 and 14](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) - Use Chapter 1 for goodput and reproducibility, Chapters 2 to 5 for topology, orchestration, communication, storage and the data pipeline, Chapter 13 for PyTorch profiling and scaling, and the Chapter 14 sections on graph breaks and recompilation. Run only the companion labs for the bottleneck you observe, preserve workload correctness and record hardware assumptions.
- **Required - Field guide:** [Machine Learning Engineering Open Book - Network, Debug, Training Performance and Orchestration](https://github.com/stas00/ml-engineering) - Use `network/debug/README.md`, the hang, crash and OOM sections of `debug/pytorch.md`, `training/performance/README.md`, `storage/README.md` and `orchestration/slurm/users.md` as an incident-driven reference. Build one symptom-to-evidence-to-cause runbook rather than reading every page.
- **Support - Reference:** [PyTorch Flight Recorder Tutorials](https://docs.pytorch.org/tutorials/unstable/flight_recorder_tutorial.html) - Read the environment-variable Flight Recorder tutorial (trace buffer, dump on timeout, `fr_trace` analysis), then the newer tutorial at https://docs.pytorch.org/tutorials/intermediate/debug_hangs_with_flight_recorder.html, which needs `torchcomms` and can run on CPU with Gloo. Diagnose one injected hang from per-rank dumps.
- **Support - Paper:** [MegaScale: Scaling Large Language Model Training to More Than 10,000 GPUs](https://arxiv.org/abs/2402.15627) - Read the efficiency optimizations, the fault-tolerance loop (heartbeats, diagnostics, fast restart) and the straggler and diagnosis tooling. Its MFU and scale numbers are its own cluster's results.
- **Support - Paper:** [Revisiting Reliability in Large-Scale Machine Learning Research Clusters](https://arxiv.org/abs/2410.21680) - Read the failure taxonomy, mean time to failure versus job size and the scheduler-side metrics. Use them to model goodput with failures for one job size.
- **Required - Book:** [How to Scale Your Model - Chapters 1, 5, 9 and 12](https://jax-ml.github.io/scaling-book/) - Use rooflines, training cost models, profiling workflow and GPU topology to predict the dominant limit of one run. Compare the prediction with a trace and quantify the residual before proposing a change.
- **Required - Assignment:** [CS336 Assignment 2 (Spring 2026) - Profiling and Parallelism Analysis](https://github.com/stanford-cs336/assignment2-systems) - Revisit Section 2 profiling and Section 8 communication analysis. Produce warmup-controlled timing, Nsight or PyTorch traces, memory evidence and analytic DP, FSDP, TP and 2D comparisons on configurations you can execute honestly.
- **Support - Reference:** [Ultra-Scale Playbook - Benchmarking Configurations](https://nanotron-ultrascale-playbook.static.hf.space/index.html#benchmarking_thousands_of_configurations) - Study the configuration-search experiments and Lessons learned on benchmarking as method. Its heatmaps are its own H100 cluster's results; reproduce the method on a tiny legal search space, separating analytic predictions, simulations and measurements.
- **Depth - Production reference:** [TorchTitan](https://github.com/pytorch/torchtitan) - Read `docs/debugging.md` (memory snapshots, fake-backend modes, Flight Recorder dumps) and the CPU unit tests under `tests/unit_tests/cpu/`, then the configuration, metrics, profiling, checkpoint and parallelization seams at a pinned commit. Select one bounded issue or measurable improvement and follow the contribution standards; do not attempt a wholesale rewrite.
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

**Capstone rubric** (about 30 to 45 hours)

| Criterion | Pass | Strong |
| --- | --- | --- |
| Correctness core | Restartable data and state, rank and group construction, tested collectives and single-process oracles support DDP and sharded steps, TP, CP and PP mechanisms, a tiny MoE dispatcher, structured rank traces and analytic memory and communication models. | Every equivalence runs on CPU processes with the gloo backend against an independent oracle, and one defect per mechanism is caught by a named test. |
| Plan and recovery | A legal two- or four-dimensional mesh carries topology and batch constraints with predicted memory and critical path, atomic sharded checkpoints, changed-layout restore, and kill and corruption campaigns with simulated, CPU, single-GPU and multi-GPU evidence labeled apart. | A blinded mesh choice precedes execution with residuals explained, and the game-day recovery replays from committed state only. |
| Real-code extension | The Picotron, TorchFeather, TorchTitan or isolated Bumblebee change carries a fixed-workload baseline, aligned profiles, correctness and regression tests, before-and-after results with variance, a reproducible manifest and negative evidence plus a skeptical design defense. | Two alternatives are measured against the change on the traced critical path, and the losing regimes bound its claims. |
| Reproducibility and judgment | A clean checkout rebuilds every table from raw per-rank traces, every protection has an injected-defect test, and claims state the hardware and simulation tier behind them. | An independent operator reproduces the dossier, and the defense names what to remove if the measured benefit is weak. |

