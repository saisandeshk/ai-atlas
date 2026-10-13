<!-- Generated from content/curriculum.json. Edit the JSON and run npm run content:generate. -->

# 02. LLM Research, Training & Post-training

**Level:** Advanced  
**Scope:** 11 track stages · 203 required topics · 43 optional, depth, or later topics

Design and execute trustworthy language-model training and post-training research from data and architecture through scaling, evaluation, adaptation, preference optimization, reasoning, multimodality and safety. One versioned research program grows across the track and ends in a mechanism-isolating contribution.

## Order

LMR-1. Data and Tokenizer Systems
LMR-2. Architecture and Numerics
LMR-3. Pretraining Reliability
LMR-4. Scaling and Data Mixtures
LMR-5. Language-Model Evaluation
LMR-6. Adaptation and Distillation
LMR-7. Preference Modeling and Direct Optimization
LMR-8. RL Post-training and Reasoning
LMR-9. Multimodal Language Models
LMR-10. Alignment, Safety and Release Evaluation
LMR-11. Research-Scale Integration

## LMR-1. Data and Tokenizer Systems

**Why:** Language-model behavior begins in the corpus. This stage makes extraction, filtering, deduplication, tokenization, mixing and batch lineage reproducible enough that a model result can be attributed to a real data intervention.

### Learn this much

- [ ] Corpus purpose, target population and intended model behavior _(Required)_
- [ ] Acquisition provenance, consent, licensing, permitted use and deletion obligations _(Required)_
- [ ] WARC and HTML parsing, boilerplate removal and document-boundary preservation _(Required)_
- [ ] Language, domain and source identification with confidence and sampled error review _(Required)_
- [ ] Unicode, normalization and irreversible text-cleaning decisions _(Required)_
- [ ] Quality rules and learned filters, threshold choice and false-positive analysis _(Required)_
- [ ] Stable exact document and line deduplication _(Required)_
- [ ] MinHash, LSH and task-appropriate near-deduplication thresholds _(Required)_
- [ ] Evaluation contamination checks with stored matches and adjudication _(Required)_
- [ ] PII, toxicity and harmful-content detection with utility and coverage trade-offs _(Required)_
- [ ] Tokenizer fertility, vocabulary choice and language or domain disparities _(Required)_
- [ ] Document packing, boundary tokens, causal masks and cross-document leakage _(Required)_
- [ ] Source mixture weights, temperature sampling and realized-token accounting _(Required)_
- [ ] Curriculum order, repetition, synthetic data and effective data diversity _(Required)_
- [ ] Deterministic shards, shuffle state, worker ownership and restart position _(Required)_
- [ ] Raw tokens, effective tokens, data epochs and small-source oversampling _(Required)_
- [ ] Lineage from raw document through every transform to a concrete training batch _(Required)_
- [ ] Immutable dataset versions, manifests, data cards and checkpoint linkage _(Required)_
- [ ] Multilingual and code-corpus quality audits beyond English web text _(Optional)_
- [ ] Model-based data selection and influence-style attribution _(Depth)_
- [ ] Production-scale deletion propagation across derived datasets and checkpoints _(Later)_
- [ ] Large human annotation operations and governance platforms _(Later)_

### Resource route

- **Primary - Assignment:** [CS336 Assignment 4 - Data](https://github.com/stanford-cs336/assignment4-data) - Complete the offline-sized path through HTML extraction, language identification, PII masking, harmful-content filtering, Gopher-style rules, the quality classifier, exact deduplication and MinHash. Train only the smallest comparison needed to test one data intervention; the 8-B200 leaderboard run is outside this gate.
- **Required - Course:** [CS336 2026 - Data Lectures 13 and 14](https://cs336.stanford.edu/) - Study Lecture 13 on sources and datasets and Lecture 14 on filtering, deduplication, mixing and synthetic data before finalizing the pipeline contract. Reconcile each lecture claim with the Assignment 4 implementation.
- **Required - Implementation:** [Dolma Toolkit](https://github.com/allenai/dolma) - Read the toolkit overview and inspect extraction, filtering, deduplication, mixing and tokenization configuration. Use it as a real pipeline reference after the CS336 implementation works, and record which production concerns your smaller pipeline omits.
- **Support - Lab:** [Modern LLM Notebook - Data Engineering](https://walkinglabs.github.io/modern-llm-notebook/?lang=en) - Work through notebook 15-data-engineering. Reproduce the compact extraction, filtering, deduplication and mixture examples, then compare their assumptions with the stricter CS336 tests.
- **Support - Practice:** [TensorTonic - Data Processing Set](https://www.tensortonic.com/study-plans/language-modeling-from-scratch) - Solve Perform Stable Exact Deduplication, Build Deterministic MinHash Signatures and Compute Temperature-Based Data Mixtures. Keep the outputs as unit-tested utilities in the track project.
- **Support - Project:** [Tokenizer and Corpus Pipeline](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/tokenizer-corpus-pipeline.md) - Reuse the project correctness, lineage and contamination contracts. Extend the artifact instead of starting another tokenizer implementation.
- **Depth - Research:** [DataComp for Language Models](https://github.com/mlfoundations/dclm) - Read the baseline paper and inspect the repository only after the bounded data experiment. Use it to study large-scale pool construction and data-selection experiments, not as required infrastructure.

### Exit checkpoint

Reproduce an arbitrary training batch from dataset version, seed, shard and position; bound duplicate and evaluation overlap with reviewed evidence; then show a fixed-compute model result for one filtering or mixture intervention.

<details>
<summary>Deliberately left for later</summary>

- Full-corpus Common Crawl processing and the CS336 data leaderboard
- Cluster-scale data stores and deletion services
- General-purpose data attribution and active data selection research

</details>

## LMR-2. Architecture and Numerics

**Why:** Advanced architecture work matters only when the mechanism, numerics and comparison budget are controlled. This stage moves beyond assembling a standard decoder to reconstructing and testing one meaningful variant.

### Learn this much

- [ ] Residual-stream semantics, pre-normalization and depth stability _(Required)_
- [ ] Initialization, residual scaling and signal propagation with depth _(Required)_
- [ ] RMSNorm, LayerNorm, logit scale and numerical hotspots _(Required)_
- [ ] SwiGLU, gated feed-forwards and parameter-matched width accounting _(Required)_
- [ ] MHA, MQA and GQA shape, quality and state trade-offs _(Required)_
- [ ] RoPE, position offsets and extrapolation failure _(Required)_
- [ ] Position interpolation, NTK-aware scaling and YaRN vocabulary _(Required)_
- [ ] Sparse, linear, recurrent and state-space sequence mechanisms as distinct contracts _(Required)_
- [ ] Sparse MoE routing, expert capacity, dispatch and token ownership _(Required)_
- [ ] Auxiliary load balancing, router z-loss, dropped tokens and expert collapse _(Required)_
- [ ] Expert-parallel communication implications without implementing the distributed runtime _(Required)_
- [ ] Parameter, activation, KV-memory and operation accounting for architecture variants _(Required)_
- [ ] Precision boundaries, stable softmax, normalization accumulation and overflow _(Required)_
- [ ] Activation and gradient-scale diagnostics across layers and sequence lengths _(Required)_
- [ ] Shape, causal, position-offset, dtype and long-context property tests _(Required)_
- [ ] Weight transfer and differential tests where variant semantics overlap _(Required)_
- [ ] Matched-parameter, matched-token and matched-compute architecture comparisons _(Required)_
- [ ] Architecture selection from a decisive mechanism-risk experiment _(Required)_
- [ ] Multi-head latent attention and decoupled-RoPE vocabulary _(Optional)_
- [ ] A bounded Mamba-2 or gated state-space implementation _(Optional)_
- [ ] Original sequence-model architecture research _(Depth)_
- [ ] Custom fused kernels and production optimization _(Later)_
- [ ] Distributed expert routing and fault-tolerant MoE training _(Later)_

### Resource route

- **Primary - Course:** [CS336 2026 - Architectures and Attention Alternatives](https://cs336.stanford.edu/) - Study Lectures 3 and 4, reconstruct every parameter and state equation, then implement one bounded variant. Keep GPUs, kernels and parallelism from Lectures 5 to 8 for their dedicated tracks.
- **Required - Case-study:** [OLMo 2 Open Model and Training Recipe](https://allenai.org/olmo2) - Read the technical report sections on architecture, initialization, normalization and training stability, then inspect the matching public configuration. Use it to connect a paper claim to executable model settings.
- **Support - Lab:** [Modern LLM Notebook - Architecture Frontiers](https://walkinglabs.github.io/modern-llm-notebook/?lang=en) - Use notebooks 08, 13, 27 and 30 for modern decoder changes, MoE, long context and efficient-attention experiments. Implement only the one variant selected for the checkpoint.
- **Support - Practice:** [TensorTonic - Architecture and Attention Alternatives](https://www.tensortonic.com/study-plans/language-modeling-from-scratch) - Solve RMSNorm Forward Pass, Parameter-Matched SwiGLU Block, Rotary Query and Key Embeddings, Causal Grouped-Query Attention, Top-k MoE Router with Load Statistics and one recurrent or linear-attention problem.
- **Support - Project:** [Decoder-Only Transformer Stack](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-2/decoder-only-transformer-stack.md) - Extend the already-tested decoder with the chosen mechanism. Preserve its slow oracle, causal and position tests, generation behavior and model arithmetic.
- **Depth - Paper:** [Switch Transformers](https://arxiv.org/abs/2101.03961) - Use the routing, capacity, load-balancing and stability sections as the deeper MoE reference. Reproduce only a tiny router experiment; full sparse pretraining belongs to later systems work.

### Exit checkpoint

Reconstruct one unfamiliar architecture mechanism from equations, add it to the tested decoder, pass shape, mask, position, precision and gradient checks, and attribute a measured difference under a fair parameter or compute contract.

<details>
<summary>Deliberately left for later</summary>

- A survey implementation of every architecture family
- Custom production kernels and distributed expert parallelism
- Frontier-scale long-context or MoE pretraining

</details>

## LMR-3. Pretraining Reliability

**Why:** A small training run should already have the state, observability and failure discipline required at larger scale. This stage makes silent data, numerical, checkpoint and performance failures diagnosable.

### Learn this much

- [ ] Token-weighted causal loss, valid-token masks and denominator checks _(Required)_
- [ ] Microbatches, accumulation, global batch tokens, optimizer steps and seen-token counts _(Required)_
- [ ] AdamW state, parameter groups, weight decay and update-to-weight ratios _(Required)_
- [ ] Warmup, stable training, decay and stop schedules _(Required)_
- [ ] Gradient noise, critical-batch vocabulary and batch-size limits _(Required)_
- [ ] Mixed precision, loss scaling, accumulation dtype and nonfinite handling _(Required)_
- [ ] Gradient clipping semantics, placement and diagnostics _(Required)_
- [ ] Initialization transfer and muP width-scaling vocabulary _(Required)_
- [ ] Deterministic smoke tests and overfit-one-batch checks _(Required)_
- [ ] Model, optimizer, scheduler, scaler, RNG, data and configuration checkpoint state _(Required)_
- [ ] Atomic checkpoint publication, restart selection and corrupted-state handling _(Required)_
- [ ] Exact and statistical resume equivalence and explicit nondeterminism _(Required)_
- [ ] Data-source, shard, tokenizer and sequence-length discontinuity diagnostics _(Required)_
- [ ] Loss spikes, divergence, plateaus and delayed numerical failure _(Required)_
- [ ] Activation, gradient, update, norm and nonfinite instrumentation _(Required)_
- [ ] Input, forward, backward, optimizer, checkpoint and evaluation step timelines _(Required)_
- [ ] Tokens per second, peak memory, state memory and operation accounting _(Required)_
- [ ] Failed-run triage, exclusion policy and all-attempt retention _(Required)_
- [ ] Versioned run contract, monitoring, rollback and stop rules _(Required)_
- [ ] Hardware and interconnect failure signatures _(Optional)_
- [ ] Gradient-noise-scale estimation and large-batch optimization theory _(Depth)_
- [ ] Multi-node fleet operations and elastic recovery _(Later)_

### Resource route

- **Primary - Implementation:** [OLMo-core and Official Training Scripts](https://github.com/allenai/OLMo-core) - Trace one tiny or OLMo-2 training configuration through model, optimizer, scheduler, trainer, callbacks and checkpoint state. Run a CPU or single-device smoke path if practical, then document what the official large-run recipe adds.
- **Required - Assignment:** [CS336 Assignment 1 - Training and Serialization](https://github.com/stanford-cs336/assignment1-basics) - Revisit only the optimizer, schedule, gradient clipping, data loading, checkpointing, training-together and decoding problems. Add kill-and-resume, tokenizer mismatch and corrupted-checkpoint tests beyond the foundation implementation.
- **Required - Guide:** [Deep Learning Tuning Playbook](https://github.com/google-research/tuning_playbook) - Use the sections on initial configuration, scientific versus nuisance hyperparameters, incremental tuning, failed trials and additional training-pipeline guidance. Write the pretraining run and triage protocol before launching comparisons.
- **Support - Lab:** [Modern LLM Notebook - Training and Accounting](https://walkinglabs.github.io/modern-llm-notebook/?lang=en) - Use notebook 10-training-loss and Appendices B and C for the compact trainer, FLOP and memory accounting, mixed precision and framework-state map. Seed one numerical failure and reconcile the estimate with measurement.
- **Support - Practice:** [TensorTonic - Training Reliability Drills](https://www.tensortonic.com/study-plans/language-modeling-from-scratch) - Solve Mixed-Precision Training Memory Accountant, Transformer Training FLOP Estimator, Gradient Accumulation Equivalence and Generate a Warmup-Stable-Decay Schedule. Validate each against the training harness.
- **Support - Project:** [Decoder-Only Transformer Stack - Reliable Training](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-2/decoder-only-transformer-stack.md) - Use the existing training, resume and arithmetic contracts as the small controlled system. Add stored evidence for data, numerical, state and throughput failure injections.

### Exit checkpoint

Resume a versioned run without an unexplained state or data discontinuity, diagnose one seeded data, numerical, checkpoint and throughput failure from stored evidence, and reconcile one memory and one compute prediction with measurements.

<details>
<summary>Deliberately left for later</summary>

- Multi-node parallelism and optimizer sharding
- Production fleet schedulers and elastic recovery
- Hyperparameter sweeps without a stated mechanism question

</details>

## LMR-4. Scaling and Data Mixtures

**Why:** Scaling claims are empirical models with narrow support, not universal laws. This stage uses small experiments to allocate compute while exposing uncertainty, confounding and regimes where the fitted relationship fails.

### Learn this much

- [ ] Parameter, data, token and compute scaling as separate variables _(Required)_
- [ ] Fixed-token, fixed-data and fixed-compute comparison contracts _(Required)_
- [ ] Kaplan-style loss scaling and its compute-allocation conclusion _(Required)_
- [ ] Chinchilla IsoFLOP profiles and compute-optimal allocation _(Required)_
- [ ] Irreducible loss, additive noise floors and unstable exponent fitting _(Required)_
- [ ] Sparse but identifiable experiment matrices under a fixed budget _(Required)_
- [ ] Nonlinear versus log-space fitting and weighting choices _(Required)_
- [ ] Parameter uncertainty, residual analysis and influence of failed runs _(Required)_
- [ ] Prediction on a configuration excluded from fitting _(Required)_
- [ ] Critical batch, learning-rate scaling and optimization transfer _(Required)_
- [ ] muP width invariants and limits of hyperparameter transfer _(Required)_
- [ ] Source-specific mixture response curves and realized-token counts _(Required)_
- [ ] Data quality, quantity, repetition and effective diversity _(Required)_
- [ ] Curriculum, mid-training and annealing as distribution changes _(Required)_
- [ ] Synthetic-data gains, teacher dependence and collapse risk _(Required)_
- [ ] Architecture, optimization, tokenizer, kernel and evaluator confounding _(Required)_
- [ ] Budget allocation across models, tokens, mixtures and experiments _(Required)_
- [ ] Inference-aware scaling and lifetime-compute trade-offs _(Optional)_
- [ ] Data-constrained and repeated-token scaling _(Optional)_
- [ ] Theoretical derivations of empirical scaling exponents _(Depth)_
- [ ] Frontier-scale validation across many model families _(Later)_

### Resource route

- **Primary - Assignment:** [CS336 Assignment 3 - Scaling](https://github.com/stanford-cs336/assignment3-scaling) - Complete the Chinchilla IsoFLOPs analysis using the supplied data and fit a bounded scaling surface. Replace inaccessible hosted-API or leaderboard runs with a small local sweep, retain failed runs and test one held-out configuration.
- **Required - Paper:** [Scaling Laws for Neural Language Models](https://arxiv.org/abs/2001.08361) - Read the empirical setup, fitted relationships and compute-allocation sections. Reproduce one fit and list every assumption that differs from your experiment.
- **Required - Paper:** [Training Compute-Optimal Large Language Models](https://arxiv.org/abs/2203.15556) - Study the IsoFLOP method, revised model-token allocation and fitting appendices. Recreate the conclusion only within the range supported by your run matrix.
- **Support - Lab:** [Modern LLM Notebook - Scaling Laws](https://walkinglabs.github.io/modern-llm-notebook/?lang=en) - Use notebook 14-scaling-laws for a compact bridge among Kaplan, Chinchilla, muP, FLOPs and memory. Treat its calculations as exercises to verify, not as evidence for extrapolation.
- **Support - Practice:** [TensorTonic - Scaling Laws I and II](https://www.tensortonic.com/study-plans/language-modeling-from-scratch) - Solve Fit a Data Power Law with a Noise Floor, Extrapolate Data-Mixture Scaling Curves, Estimate Critical Batch Size, Recover an IsoFLOP Frontier, Fit Learning-Rate and Batch-Size Scaling and Diagnose muP Width Invariants.
- **Depth - Research:** [Scaling Data-Constrained Language Models](https://github.com/huggingface/datablations) - Inspect the paper and reproducibility repository after the main gate. Use one small repeated-data or data-constrained experiment to challenge the standard compute-optimal assumption.
- **Support - Project:** [Applied Science Research Laboratory - Scaling Study](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/capstones/applied-science-research-laboratory.md) - Borrow the preregistration, matched-budget, uncertainty, residual and negative-result requirements for the scaling experiment.

### Exit checkpoint

Fit a scaling or mixture relationship with identifiable variables, uncertainty and residuals; validate one held-out configuration; preserve one failed regime; and state the budget decision it changes plus the range where it must not be used.

<details>
<summary>Deliberately left for later</summary>

- Purchasing frontier-scale training solely to imitate published curves
- Distributed-training implementation and topology tuning
- Treating a fitted exponent as mechanism proof

</details>

## LMR-5. Language-Model Evaluation

**Why:** Training research is only as trustworthy as its instruments. This stage builds an evaluator hierarchy, attacks its failure modes and fixes inference budgets before comparing checkpoints or methods.

### Learn this much

- [ ] Task definition, construct validity and intended decision _(Required)_
- [ ] Likelihood, multiple-choice and generation evaluation contracts _(Required)_
- [ ] Prompt, few-shot set, system instruction and chat-template versioning _(Required)_
- [ ] Answer extraction, normalization, invalid outputs and denominator policy _(Required)_
- [ ] Exact, executable and structured verifiers with false-acceptance tests _(Required)_
- [ ] Model-judge prompts, rubrics, calibration and residual uncertainty _(Required)_
- [ ] Position, length, style, verbosity, identity and self-preference bias _(Required)_
- [ ] Human pairwise evaluation, disagreement, adjudication and annotator effects _(Required)_
- [ ] Bradley-Terry and Elo-style summaries with ordering limits _(Required)_
- [ ] Pass-at-k, self-consistency and sampling-budget accounting _(Required)_
- [ ] Matched tokens, samples, verifier calls, latency and inference compute _(Required)_
- [ ] Train-evaluation overlap, contamination, memorization and leakage _(Required)_
- [ ] Benchmark saturation, selection pressure and hidden-test limits _(Required)_
- [ ] Capability versus elicitation, prompting and search gains _(Required)_
- [ ] Prompt variants, perturbations, domains, languages and failure slices _(Required)_
- [ ] Paired uncertainty, multiple comparisons and practical effect size _(Required)_
- [ ] Item-level inputs, raw outputs, scores, evaluator versions and lineage _(Required)_
- [ ] Evaluator agreement, calibration against trusted subsets and failure taxonomy _(Required)_
- [ ] Primary metrics, guardrails, regression thresholds and rollback _(Required)_
- [ ] Tool-use and long-horizon agentic evaluation _(Optional)_
- [ ] Adaptive and contamination-resistant benchmark research _(Depth)_
- [ ] Restricted dangerous-capability evaluations _(Later)_

### Resource route

- **Primary - Course:** [CS336 2026 - Evaluation](https://cs336.stanford.edu/) - Study Lecture 12 and its code. Rebuild conditional perplexity, multiple-choice scoring and one generation evaluator, then specify prompt, decoding, item and inference-compute versions before any comparison.
- **Required - Implementation:** [Language Model Evaluation Harness](https://github.com/EleutherAI/lm-evaluation-harness) - Follow the task guide to create one versioned local task with explicit output type, prompts, filters, metrics and decontamination query. Pin the harness revision and save sample-level outputs.
- **Required - Framework:** [Holistic Evaluation of Language Models](https://crfm.stanford.edu/helm/latest/) - Read the methodology for scenarios, adaptations, metrics and perturbations. Use it to define capability, robustness, fairness, toxicity and efficiency as separate evidence dimensions rather than one aggregate score.
- **Support - Lab:** [Modern LLM Notebook - Evaluation](https://walkinglabs.github.io/modern-llm-notebook/?lang=en) - Use notebook 25-evaluation for the compact framework and judge examples. Reproduce its judge comparison with position and response-length counterexamples.
- **Support - Practice:** [TensorTonic - Evaluation Set](https://www.tensortonic.com/study-plans/language-modeling-from-scratch) - Solve Compute Conditional Perplexity, Score Multiple-Choice Continuations, Fit Elo Ratings from Pairwise Votes and Remove Response-Length Bias from Judge Scores. Add all four to evaluator unit tests.
- **Support - Implementation:** [Inspect](https://inspect.aisi.org.uk/) - Implement one small Inspect task with a deterministic scorer and one model-graded scorer. Preserve transcripts and compare the model grader against a trusted subset before using it for a claim.
- **Support - Assessment:** [LLM Research Track Checkpoint](https://github.com/saisandeshk/Roadmap-Final/blob/main/checkpoints/llm-research-training-posttraining.md) - Use the evaluation and compare sections as a closed-note audit after the harness exposes at least three instrument failures.

### Exit checkpoint

Compare two checkpoints under identical items, prompts, output budgets and evaluator versions; demonstrate three evaluator failures with mitigations; quantify agreement against a trusted subset; and state what the evidence cannot establish.

<details>
<summary>Deliberately left for later</summary>

- A giant benchmark sweep without a release decision
- Safety certification from general capability benchmarks
- Agentic, multimodal and restricted dangerous-capability evaluation suites

</details>

## LMR-6. Adaptation and Distillation

**Why:** Adaptation is a data, objective and deployment choice. This stage compares supervised, low-rank and distillation routes while proving masks, merges, forgetting and end-to-end cost.

### Learn this much

- [ ] Continued pretraining, mid-training and supervised instruction tuning as distinct interventions _(Required)_
- [ ] Instruction, input, response and conversation data contracts _(Required)_
- [ ] Chat templates, roles, special tokens and train-serve consistency _(Required)_
- [ ] Assistant-only loss masks and token-level denominator checks _(Required)_
- [ ] Packed SFT boundaries, attention masks and cross-example leakage _(Required)_
- [ ] Full fine-tuning state, memory and optimizer cost _(Required)_
- [ ] LoRA factorization, rank, scale, initialization and target modules _(Required)_
- [ ] Adapter serialization, merge, unmerge and forward equivalence _(Required)_
- [ ] QLoRA, quantized base weights and optimizer-state vocabulary _(Required)_
- [ ] Trainable-parameter savings versus activation and total training memory _(Required)_
- [ ] Domain balancing, replay and prerequisite-skill retention _(Required)_
- [ ] Forgetting, interference and capability regression slices _(Required)_
- [ ] Teacher-student logit distillation, temperature and KL direction _(Required)_
- [ ] Sequence and synthetic-data distillation with teacher provenance _(Required)_
- [ ] Feature and representation distillation boundaries _(Required)_
- [ ] On-policy distillation and exposure-bias motivation _(Required)_
- [ ] Prompted, smaller-model and no-training baselines _(Required)_
- [ ] Quality, train memory, latency, serving memory and update-cost comparison _(Required)_
- [ ] Model merging and task-vector vocabulary _(Optional)_
- [ ] Prompt and prefix-tuning mechanisms _(Optional)_
- [ ] Original teacher-signal or on-policy distillation research _(Depth)_
- [ ] Multi-tenant adapter serving and production lifecycle _(Later)_

### Resource route

- **Primary - Book:** [RLHF Book - Training Overview, Instruction Tuning and Synthetic Data](https://rlhfbook.com/) - Read Chapters 3, 4 and 12, then complete the chapter exercises. Use the canonical training-recipe maps to separate continued pretraining, SFT, rejection sampling and distillation before selecting an intervention.
- **Required - Assignment:** [CS336 Assignment 5 Supplement - SFT](https://github.com/stanford-cs336/assignment5-alignment) - Complete the baseline evaluation, instruction-data inspection, data loading, assistant-only loss and SFT script. Use a smaller open model and bounded sample if the listed B200 run is impractical; preserve identical evaluations before and after.
- **Required - Paper:** [LoRA: Low-Rank Adaptation of Large Language Models](https://arxiv.org/abs/2106.09685) - Derive the low-rank update, scaling and parameter count, then implement LoRA for selected decoder linear layers and test merged equivalence.
- **Reference - Paper:** [QLoRA: Efficient Finetuning of Quantized LLMs](https://arxiv.org/abs/2305.14314) - Read the method and memory-analysis sections only after plain LoRA passes. Use it to explain quantized-base adaptation and its numerical assumptions, not as a mandatory large training run.
- **Support - Lab:** [Modern LLM Notebook - LoRA, Distillation and OPD](https://walkinglabs.github.io/modern-llm-notebook/?lang=en) - Use notebooks 16, 17 and 31 for compact LoRA, teacher-student and on-policy-distillation implementations. Verify the objectives independently and retain only one distillation experiment.
- **Support - Practice:** [TensorTonic - Assistant-Only SFT Loss Mask](https://www.tensortonic.com/study-plans/language-modeling-from-scratch) - Solve Build an Assistant-Only SFT Loss Mask and add adversarial tests for empty answers, multi-turn roles, truncation, packed examples and special-token boundaries.
- **Support - Implementation:** [RLHF Book Code - Instruction Tuning and Distillation](https://github.com/natolambert/rlhf-book/tree/main/code) - Run the smallest instruction-tuning and string-reversal distillation examples. Hold the data and evaluator fixed, sweep one mechanism variable and compare with a no-distillation baseline.

### Exit checkpoint

Produce a tested SFT or continued-pretraining baseline plus one low-rank or distillation route; prove masks, trainable state and merge behavior; and show quality, forgetting, memory and latency under the same evaluator and inference budget.

<details>
<summary>Deliberately left for later</summary>

- Completing every parameter-efficient fine-tuning variant
- Large synthetic-data factories and teacher fleets
- Production multi-tenant adapter serving and quantization kernels

</details>

## LMR-7. Preference Modeling and Direct Optimization

**Why:** Preference optimization can improve its own reward while degrading real behavior. This stage derives the data and objective path, then tests it against length, style, evaluator and distribution shortcuts.

### Learn this much

- [ ] Policy-dependent preference-data generation and prompt sampling _(Required)_
- [ ] Pairwise, listwise, ratings, ties and indifference labels _(Required)_
- [ ] Annotator disagreement, noise, expertise and adjudication _(Required)_
- [ ] Position, length, style, verbosity, identity and presentation bias _(Required)_
- [ ] Bradley-Terry preference likelihood and reward differences _(Required)_
- [ ] Reward identifiability, offsets, scale and calibration limits _(Required)_
- [ ] Preference and outcome reward-model training contracts _(Required)_
- [ ] Reward-model shift across policies, prompts and response lengths _(Required)_
- [ ] Reward overoptimization, Goodhart effects and proxy regressions _(Required)_
- [ ] Reference policies, KL-regularized RL objective and policy distance _(Required)_
- [ ] DPO derivation from policy and reference log-probability ratios _(Required)_
- [ ] Beta, margins and gradient pressure on chosen and rejected responses _(Required)_
- [ ] Response-only sequence log probabilities, masks and length normalization _(Required)_
- [ ] Reference-checkpoint identity, tokenizer compatibility and stale caches _(Required)_
- [ ] Provenance, duplicates, leakage, balance, agreement and slice audit _(Required)_
- [ ] Preference-loss numerical, sign, gradient and invariance tests _(Required)_
- [ ] Independent capability, safety, calibration and diversity evaluation _(Required)_
- [ ] Versioned sampling, labeling, optimization, evaluation and rollback loop _(Required)_
- [ ] IPO, SimPO, ORPO and related direct-objective vocabulary _(Optional)_
- [ ] AI feedback and constitution-conditioned preference generation _(Optional)_
- [ ] New direct preference objectives and consistency theory _(Depth)_
- [ ] Sensitive large-scale human preference collection _(Later)_

### Resource route

- **Primary - Book:** [RLHF Book - Reward Models, Direct Alignment and Preferences](https://rlhfbook.com/) - Read Chapters 5, 8, 10, 11, 14 and 15 with the chapter exercises. Trace preference generation through reward modeling or DPO, then list each distribution and evaluator assumption before training.
- **Required - Paper:** [Direct Preference Optimization](https://arxiv.org/abs/2305.18290) - Derive the objective from the KL-constrained reward formulation, implement it from policy and reference log probabilities, and gradient-check $`\beta`$, sign, masking and identical-pair cases.
- **Required - Assignment:** [CS336 Assignment 5 Supplement - Preference Data and DPO](https://github.com/stanford-cs336/assignment5-alignment) - Complete preference-data inspection and dpo_loss. Run a bounded DPO comparison only after the external baseline and evaluator are frozen; replace the 1-B200 target with a smaller controlled run if necessary.
- **Support - Implementation:** [RLHF Book Code - Reward Models and Direct Alignment](https://github.com/natolambert/rlhf-book/tree/main/code) - Run the smallest Bradley-Terry reward-model and DPO examples. Compare DPO, IPO and normalized DPO on one fixed sample and explain margins, accuracy and reward signals rather than raw loss alone.
- **Support - Practice:** [TensorTonic - Preference Optimization Set](https://www.tensortonic.com/study-plans/language-modeling-from-scratch) - Solve Canonicalize Pairwise Preference Data, Score a KL-Regularized Policy Batch and Implement the DPO Loss. Add swapped-label, duplicate, length and reference-mismatch cases.
- **Support - Reference:** [TRL DPO Trainer](https://huggingface.co/docs/trl/dpo_trainer) - After the scratch loss passes, map dataset format, reference model, $`\beta`$, loss variants and logging into TRL. Confirm the library run matches the scratch objective on one frozen batch.
- **Optional - Lab:** [Modern LLM Notebook - RLHF Alignment](https://walkinglabs.github.io/modern-llm-notebook/?lang=en) - Use notebook 19 as a compact end-to-end orientation. Do not substitute its overview for the RLHF Book derivations or CS336 objective tests.

### Exit checkpoint

Gradient-check the chosen preference objective, audit its data and policy versions, then show that its improvement over SFT survives external evaluation and controls for response length, style, judge bias, $`\beta`$ and reference mismatch.

<details>
<summary>Deliberately left for later</summary>

- A catalog of every DPO-family objective
- Large-scale human-feedback operations
- Treating reward or preference accuracy as the final capability metric

</details>

## LMR-8. RL Post-training and Reasoning

**Why:** Reasoning post-training combines policy learning, sampling and verification, so an apparent gain has several competing explanations. This stage separates learned capability from search, reward and evaluator effects.

### Learn this much

- [ ] Prompts, prefixes, tokens, trajectories and terminal events as a decision process _(Required)_
- [ ] Sequence, token, outcome and process rewards _(Required)_
- [ ] Score-function policy gradient for language trajectories _(Required)_
- [ ] Baselines, leave-one-out estimators and variance reduction _(Required)_
- [ ] Value functions and generalized advantage estimation vocabulary _(Required)_
- [ ] Importance ratios, PPO clipping and failure boundaries _(Required)_
- [ ] Group-normalized advantages and zero-variance groups _(Required)_
- [ ] Sequence versus token loss normalization and length pressure _(Required)_
- [ ] Reference KL, entropy, exploration and collapse diagnostics _(Required)_
- [ ] Actor, reference, reward model, verifier and value-model roles _(Required)_
- [ ] Immutable prompt, policy, reference, reward, RNG and trajectory metadata _(Required)_
- [ ] On-policy sampling, asynchronous policy lag and stale rollouts _(Required)_
- [ ] Off-policy importance weighting, clipping and support mismatch _(Required)_
- [ ] Rule-based verifiers, false acceptance and reward loopholes _(Required)_
- [ ] Reward hacking, format gaming, length bias and evaluator exploitation _(Required)_
- [ ] Reasoning traces, hidden reasoning, outcome and process feedback boundaries _(Required)_
- [ ] Best-of-N and self-consistency as selection methods _(Required)_
- [ ] Search, verifier-guided inference and test-time compute curves _(Required)_
- [ ] Learned capability versus sampling, search and answer-length gains _(Required)_
- [ ] Distilling rollout or search improvements into the policy _(Required)_
- [ ] Rejection fine-tuning, RLOO and neighboring estimators _(Optional)_
- [ ] Process reward models and step-level credit _(Optional)_
- [ ] Full RL convergence, trust-region and off-policy theory _(Depth)_
- [ ] Frontier-scale reasoning and long-horizon agent training _(Depth)_
- [ ] Distributed rollout scheduling and fault tolerance _(Later)_

### Resource route

- **Primary - Assignment:** [CS336 Assignment 5 - Alignment and Reasoning RL](https://github.com/stanford-cs336/assignment5-alignment) - Complete prompting and verifier baselines, baseline variance calculations, tokenization and log-probabilities, rollout rewards, group normalization, loss aggregation and the on-policy GRPO train step. Run one small GRPO and one prompt or normalization ablation; do not require the full B200 budget.
- **Required - Book:** [RLHF Book - Policy Gradients, Reasoning and Rejection Sampling](https://rlhfbook.com/) - Read Chapters 6, 7, 9, 12 and 15. Derive only the estimator used in the experiment, then use the overoptimization and regularization chapters to design the reward-hacking tests.
- **Required - Paper:** [DeepSeek-R1 Technical Report](https://arxiv.org/abs/2501.12948) - Use the R1-Zero, cold-start, RL and distillation sections as a case study. Separate evidence in the report from the tiny local experiment and list scale, data and infrastructure differences that block direct reproduction.
- **Support - Implementation:** [RLHF Book Code - Policy Gradients and Rejection Sampling](https://github.com/natolambert/rlhf-book/tree/main/code) - Run the smallest REINFORCE or GRPO procedural task and matched random-versus-reward rejection-sampling control. Sweep one variable and retain an unstable or hacked run.
- **Support - Practice:** [TensorTonic - RLVR Set](https://www.tensortonic.com/study-plans/language-modeling-from-scratch) - Solve Normalize GRPO Group Advantages, Compute a Clipped GRPO Surrogate and Compare Sequence and Token Length Normalization. Cross-check results against the CS336 tests.
- **Support - Lab:** [Modern LLM Notebook - Reasoning and On-Policy Distillation](https://walkinglabs.github.io/modern-llm-notebook/?lang=en) - Use notebooks 28 and 31 to compare CoT, inference-time search, RL-style training and on-policy distillation. Measure tokens and verifier calls so selection is not confused with learning.
- **Reference - Course:** [Berkeley CS285 - LLM Reinforcement Learning](https://rail.eecs.berkeley.edu/deeprlcourse/) - Use the LLM RL lecture and policy-gradient material to repair RL prerequisites. Full policy-optimization depth remains owned by the Reinforcement Learning track.
- **Support - Project:** [LLM Post-Training Laboratory - RL and Reasoning](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-3/llm-post-training-laboratory.md) - Use the rollout, objective, policy-version, reward-hacking and compute-normalized evaluation requirements as the persistent artifact for this and later stages.

### Exit checkpoint

Run a tiny verifiable-reward study with SFT or direct-preference and no-RL baselines; show external improvement under matched inference compute; attack the reward and verifier; and explain one negative or unstable run from trajectory and policy-version evidence.

<details>
<summary>Deliberately left for later</summary>

- Full RL foundations already owned by the Reinforcement Learning track
- Distributed rollout engines and asynchronous fleet scheduling
- Claims that tiny-task reasoning results transfer to frontier models

</details>

## LMR-9. Multimodal Language Models

**Why:** Multimodal models add representation, alignment and data contracts that text-only intuition does not cover. This stage implements one bounded image-text path and tests whether the model is grounded or merely exploiting pairing and language priors.

### Learn this much

- [ ] Image patching, vision encoders and visual-token sequences _(Required)_
- [ ] Projectors between modality and language representation spaces _(Required)_
- [ ] Early fusion, late fusion and cross-attention trade-offs _(Required)_
- [ ] Symmetric CLIP contrastive loss and temperature _(Required)_
- [ ] SigLIP pairwise sigmoid loss and batch-size behavior _(Required)_
- [ ] Paired, interleaved and instruction-tuning multimodal data _(Required)_
- [ ] Synthetic captions and instruction data with generator provenance _(Required)_
- [ ] Modality tokens, attention masks and position ownership _(Required)_
- [ ] Multimodal RoPE coordinates and aspect or resolution handling _(Required)_
- [ ] Resolution, patch count, context length, memory and compute _(Required)_
- [ ] Frozen encoders, projector warmup and staged fine-tuning _(Required)_
- [ ] Paired retrieval versus generative instruction objectives _(Required)_
- [ ] Missing, corrupted and conflicting modality behavior _(Required)_
- [ ] Visual grounding, hallucination and language-prior shortcuts _(Required)_
- [ ] Cross-modal duplicates, benchmark contamination and pairing leakage _(Required)_
- [ ] Object, text-in-image, spatial, counting and resolution slices _(Required)_
- [ ] Text-only, shuffled-pair and corrupted-image baselines _(Required)_
- [ ] Audio and video tokenization and temporal-alignment vocabulary _(Optional)_
- [ ] Image or audio generation objectives _(Optional)_
- [ ] Large-scale multimodal mixture and scaling research _(Depth)_
- [ ] Production VLM serving, batching and modality pipelines _(Later)_

### Resource route

- **Primary - Course:** [CS336 2026 - Alignment and Multimodality](https://cs336.stanford.edu/) - Study Lecture 17 and its code. Reconstruct patching, projector, fusion, multimodal positions and the chosen objective before implementing the bounded image-text path.
- **Required - Paper-code:** [CLIP Paper and Official Code](https://github.com/openai/CLIP) - Derive and implement the symmetric contrastive loss, then use the official code and model card to validate preprocessing and zero-shot evaluation assumptions.
- **Required - Paper-code:** [LLaVA - Visual Instruction Tuning](https://llava-vl.github.io/) - Read the architecture, synthetic instruction-data and training-stage sections. Build only a tiny frozen-encoder plus projector path and compare it with text-only and shuffled-pair controls.
- **Support - Lab:** [Modern LLM Notebook - Vision-Language Models](https://walkinglabs.github.io/modern-llm-notebook/?lang=en) - Complete notebook 29-vlm through the minimal VLM implementation. Add missing-image, conflicting-caption, resolution and serialization tests that the walkthrough does not supply.
- **Support - Practice:** [TensorTonic - Alignment and Multimodality Set](https://www.tensortonic.com/study-plans/language-modeling-from-scratch) - Solve Patchify a Batch of Images, Implement Symmetric CLIP Contrastive Loss, Implement the SigLIP Pairwise Loss and Assign Multimodal RoPE Coordinates.
- **Reference - Implementation:** [OpenCLIP](https://github.com/mlfoundations/open_clip) - Inspect the current task, loss, data and evaluation boundaries after the scratch mechanism works. Use a pinned release for one small comparison; do not adopt the whole distributed training stack.
- **Support - Project:** [LLM Post-Training Laboratory - Multimodal Module](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-3/llm-post-training-laboratory.md) - Use the optional multimodal evidence module for versioned aligned data, projector or fusion tests, retrieval and generation evaluation, and modality-specific safety checks.

### Exit checkpoint

Implement one image-text encoder, projector or fusion mechanism; verify masks and positions; compare against text-only and corrupted-pair baselines; and report retrieval or generation quality, grounding failures and compute by modality slice.

<details>
<summary>Deliberately left for later</summary>

- Training a general-purpose frontier VLM
- Audio, video and image-generation model families
- Production multimodal serving and high-resolution optimization

</details>

## LMR-10. Alignment, Safety and Release Evaluation

**Why:** A safety score is meaningful only relative to a threat model, benign utility and adaptive attacks. This stage tests training and mitigation claims without equating refusal or benchmark success with alignment.

### Learn this much

- [ ] Behavioral specification, policy boundaries and unresolved normative choices _(Required)_
- [ ] Assets, actors, capabilities, attack surfaces, mitigations and residual consequences _(Required)_
- [ ] Harmful capability, elicitation and harmful compliance as distinct measurements _(Required)_
- [ ] Refusal, overrefusal, helpfulness and safe-completion trade-offs _(Required)_
- [ ] Jailbreak, prompt-injection and multi-turn attack families _(Required)_
- [ ] Memorization, training-data extraction and sensitive-information leakage _(Required)_
- [ ] Bias, representation, disparate errors and affected-group slices _(Required)_
- [ ] Adaptive red teaming, attack provenance and held-out attack families _(Required)_
- [ ] Matched benign utility and false-positive controls _(Required)_
- [ ] Deterministic, model-graded and human safety-evaluator calibration _(Required)_
- [ ] Reward-model and evaluator exploitation, style and length shortcuts _(Required)_
- [ ] Safety SFT, preference and constitutional data lineage _(Required)_
- [ ] Critique, revision and AI-feedback loops with explicit principles _(Required)_
- [ ] Training, classifier, system and monitoring mitigations as defense in depth _(Required)_
- [ ] Capability-safety trade-off curves rather than aggregate refusal rates _(Required)_
- [ ] Safety-test contamination, stale attacks and test-set gaming _(Required)_
- [ ] Predeclared capability, safety and uncertainty release thresholds _(Required)_
- [ ] Staged rollout, monitoring, incident response and rollback _(Required)_
- [ ] Residual risk, evidence gaps and explicit ownership _(Required)_
- [ ] Activation probes and mechanistic evidence as supporting, not conclusive, safety evidence _(Optional)_
- [ ] Debate, recursive oversight and supervision beyond human capability _(Optional)_
- [ ] Sparse autoencoders, causal tracing and mechanistic anomaly research _(Depth)_
- [ ] Frontier safety certification or real dangerous-capability testing _(Later)_

### Resource route

- **Primary - Assignment:** [CS336 Assignment 5 Supplement - Safety Alignment](https://github.com/stanford-cs336/assignment5-alignment) - Complete zero-shot MMLU, GSM8K, AlpacaEval and SimpleSafetyTests baselines, the bounded SFT and DPO paths, and the red-team exercise. Use a smaller open model where needed and keep benign utility beside safety results.
- **Required - Implementation:** [Inspect and Inspect Evals](https://inspect.aisi.org.uk/) - Build a versioned safety task with attack provenance, sandbox or tool boundaries, deterministic and calibrated model scorers, transcript retention and regression thresholds. Run benign, adversarial and out-of-distribution slices.
- **Required - Guide:** [NIST AI RMF Generative AI Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence) - Use the Govern, Map, Measure and Manage actions to create the threat, evaluation, release, monitoring and residual-risk record. Select only actions relevant to the research artifact.
- **Reference - Paper:** [Constitutional AI: Harmlessness from AI Feedback](https://www.anthropic.com/research/constitutional-ai-harmlessness-from-ai-feedback) - Study the supervised critique-revision and RLAIF stages. Reproduce only a tiny critique-revision or preference-data intervention and test for evasiveness, overrefusal and evaluator dependence.
- **Support - Course:** [ARENA - Evals, Alignment and Interpretability](https://learn.arena.education/) - Use selected evaluation and alignment exercises to build attack sets and grader tests. Treat interpretability units as optional evidence for a concrete hypothesis, not as proof of safety.
- **Support - Project:** [LLM Post-Training Laboratory - Safety Campaign](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-3/llm-post-training-laboratory.md) - Run the reward-hacking, adversarial and failure campaign. Preserve attacks, false positives, raw generations, evaluator versions and the rollback decision.

### Exit checkpoint

Produce a threat model and adaptive safety/privacy evaluation with matched benign utility; demonstrate one mitigation whose gain survives held-out attacks and evaluator review; and state residual risk without claiming general alignment or certification.

<details>
<summary>Deliberately left for later</summary>

- Restricted evaluations that require controlled access or domain experts
- A comprehensive interpretability curriculum
- Regulatory certification and production incident operations

</details>

## LMR-11. Research-Scale Integration

**Why:** The final stage connects data, model, objective, training state, rollout and evaluation into one auditable experiment. It proves that a bounded real-code change, rather than extra compute or evaluator drift, caused the reported result.

### Learn this much

- [ ] Data-to-checkpoint-to-post-training-to-evaluation lifecycle _(Required)_
- [ ] Ownership of dataset, tokenizer, model, optimizer, policy, reference, reward and evaluator state _(Required)_
- [ ] Configuration, code, environment, artifact and evaluation lineage _(Required)_
- [ ] Reconstructing launch, configuration, data, model, objective, trainer and evaluation paths _(Required)_
- [ ] Compute, training state, activation, communication and checkpoint budgets with uncertainty _(Required)_
- [ ] Data, tensor, pipeline, sequence and expert parallel interfaces _(Required)_
- [ ] Checkpoint publication, resume, conversion and resharding contracts _(Required)_
- [ ] Rollout, reward, verifier and evaluation service boundaries _(Required)_
- [ ] Data, loss, gradient, update, throughput, rollout, reward and evaluator observability _(Required)_
- [ ] Failures spanning data version, checkpoint, policy freshness, reward and evaluation _(Required)_
- [ ] Retry, duplication, partial work and artifact-commit semantics _(Required)_
- [ ] Training, rollout, evaluation, storage and researcher-time cost _(Required)_
- [ ] Privacy, access, safety gates and rollback across the research lifecycle _(Required)_
- [ ] A bounded modification to a real training or post-training implementation _(Required)_
- [ ] Strong baseline, matched budget, mechanism ablation and negative control _(Required)_
- [ ] Data, scale, kernel, communication and evaluator confounds _(Required)_
- [ ] Analytical resource prediction versus measured residual _(Required)_
- [ ] Local, simulated, analytical and distributed evidence labels _(Required)_
- [ ] Clean reproduction and discrepancy log _(Required)_
- [ ] Research contribution, skeptical review and next decisive experiment _(Required)_
- [ ] Measured multi-node validation of the full system _(Optional)_
- [ ] Frontier-scale training-system ownership and fleet operations _(Depth)_
- [ ] General training-platform or orchestration construction _(Later)_

### Resource route

- **Primary - Project:** [LLM Post-Training Laboratory](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-3/llm-post-training-laboratory.md) - Complete the project through its baseline, SFT, preference or reward, RL or reasoning, evaluation, failure campaign, reproduction and extension gates. Keep one versioned artifact chain across the whole track.
- **Required - Case-study:** [OLMo Fully Open Training Stack](https://allenai.org/olmo2) - Trace a released configuration from dataset and tokenizer through training code, checkpoints and evaluation. Reconstruct only the paths relevant to your modification and record what was measured versus inferred.
- **Required - Implementation:** [Open Instruct](https://github.com/allenai/open-instruct) - Inspect one current SFT, preference or RL recipe and its evaluator path. Make a bounded tested modification using a small model or fixture instead of attempting the released large-scale run.
- **Support - Assignment-set:** [CS336 Assignments 4 and 5 - Integration Handoff](https://cs336.stanford.edu/) - Reuse the data and alignment artifacts already completed. Connect their versions through a single manifest and rerun one clean baseline before the extension.
- **Support - Implementation:** [RLHF Book Companion Code](https://github.com/natolambert/rlhf-book/tree/main/code) - Use the reader experiment path as the small reference implementation. Trace one objective end to end, add resume and regression coverage, then compare the modified and unchanged paths.
- **Support - Guide:** [The Turing Way - Reproducible Research](https://book.the-turing-way.org/reproducible-research/reproducible-research) - Use the reproducibility, code review, testing, data management and research-compendium guidance to package the final artifact for an independent clean run.
- **Depth - Reference:** [How to Scale Your Model](https://jax-ml.github.io/scaling-book/) - Use the compute, memory, roofline, collective and sharding chapters only to defend the analytical distributed plan. Actual topology and parallel-runtime mastery belongs to the ML Systems track.

### Exit checkpoint

Modify a real training or post-training implementation, reproduce the unchanged baseline, run a matched mechanism ablation with quality, safety and resource evidence, survive a clean rerun, and label every claim as local, simulated, analytical or distributed.

<details>
<summary>Deliberately left for later</summary>

- Owning every component of a production training platform
- Reimplementing distributed runtime and kernel internals
- Claiming frontier-scale validity from a single-device experiment

</details>

## Track milestone

### Versioned LLM Training and Post-Training Study

Choose one bounded language-model capability or behavior question and carry the same model family, data lineage, evaluator suite and experiment registry from corpus construction through pretraining or adaptation, post-training, multimodal or safety stress tests, and a final mechanism-isolating extension.

- A reproducible baseline package with dataset, tokenizer, model, optimizer, checkpoint and evaluator manifests; a small reliable training or adaptation run; batch lineage; resume tests; compute and memory accounting; and a discrepancy log.
- A matched-budget post-training study containing SFT, a preference or reward route, and one RL, reasoning or distillation route; external capability and safety evaluation; reward and evaluator attacks; uncertainty; ablations; and all valid and failed runs.
- A tested real-code extension plus one bounded multimodal or safety module, an independent clean reproduction, a generated research report with claim-to-artifact links, a skeptical-review response, and the next smallest decisive experiment.

