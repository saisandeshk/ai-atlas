<!-- Generated from content/curriculum.json. Edit the JSON and run npm run content:generate. -->

# 05. Deep Learning

**Level:** Core  
**Scope:** 8 sections · 131 required topics · 21 optional, depth, or later topics

Own neural mechanisms, PyTorch execution, training diagnosis, major architectures, representation learning and reliable measurement on compact models.

## Order

01. Neural Computation, Losses & Reverse Mode
02. PyTorch Foundations & Low-Level Training Loops
03. Training Dynamics, Regularization & Diagnosis
04. Convolutional & Recurrent Architectures
05. Representation, Self-Supervision & Paired Modalities
06. Generative Modeling
07. Attention & Transformer Foundations
08. Reliable PyTorch Execution, State & Profiling

## 01. Neural Computation, Losses & Reverse Mode

**Why:** Deep learning becomes debuggable when tensor semantics, objective reductions and reverse accumulation are understood below the framework surface.

### Learn this much

- [ ] Affine maps, nonlinearities, logits and tensor shapes _(Required)_
- [ ] ReLU, GELU, sigmoid and tanh behavior _(Required)_
- [ ] Stable softmax and log-softmax _(Required)_
- [ ] Cross-entropy and binary cross-entropy with logits _(Required)_
- [ ] Regression, reconstruction and masked loss reductions _(Required)_
- [ ] Computation graphs and local derivatives _(Required)_
- [ ] Vector-Jacobian products and reverse accumulation _(Required)_
- [ ] Repeated use, branches and gradient accumulation _(Required)_
- [ ] Broadcast forward rules and unbroadcast in backward _(Required)_
- [ ] Leaf and intermediate tensors and saved forward values _(Required)_
- [ ] Finite-difference gradient checks and step-size limits _(Required)_
- [ ] Shape, axes, dtype, layout, stride and storage _(Required)_
- [ ] View, copy, reshape, transpose and noncontiguous inputs _(Required)_
- [ ] Aliasing, mutation and detached-path hazards _(Required)_
- [ ] Parameter, buffer and module ownership at mechanism level _(Required)_
- [ ] Higher-order automatic differentiation _(Later)_
- [ ] Full symbolic differentiation systems _(Later)_

### Resource route

- **Primary - Theory:** [Understanding Deep Learning - Chapters 3 to 7](https://udlbook.github.io/udlbook/) - Read Chapters 3-7, emphasizing Chapter 5 for likelihood-derived losses and Chapter 7 for backpropagation and initialization. Use notebooks 3.1, 4.1, 5.1, 6.1 and 7.1 only as equation and plot companions.
- **Required - Implementation:** [D2L - tensors, autograd, MLP and backpropagation](https://d2l.ai/) - Use chapter_preliminaries ndarray and autograd, then MLP, backpropagation, and numerical stability and initialization. Recreate scalar operations, affine maps, activation, reduction, stable cross-entropy, topological backward and unbroadcast in a blank file.
- **Required - Practice:** [TensorTonic - Build Micrograd from Scratch](https://www.tensortonic.com/problems) - Use the 25-problem Micrograd study plan in order for derivatives, gradient checks, value graphs, reverse mode, accumulation, operators, modules, losses and training. Preserve local tests as the evidence instead of a platform score.
- **Optional - Practice:** [Deep-ML candidate - autograd and loss problems](https://www.deep-ml.com/problems) - After the five-sample platform check passes, use at most one of 26 Basic Autograd Operations, 997 Manual Cross-Entropy Backprop or 1227 Stable Softmax as a changed-prompt drill.

### Exit checkpoint

From a blank file, implement reverse accumulation for a branched broadcast graph, match finite differences and PyTorch within justified tolerance, and explain each saved value and mutation hazard.

<details>
<summary>Deliberately left for later</summary>

- Higher-order autodiff and symbolic differentiation
- Framework compiler internals
- Large neural architectures

</details>

## 02. PyTorch Foundations & Low-Level Training Loops

**Why:** PyTorch is the execution substrate for the remaining stage. This module makes tensor storage, autograd state, data flow and checkpoint ownership explicit before higher-level architectures are added.

### Learn this much

- [ ] Tensor creation, indexing, devices and dtypes _(Required)_
- [ ] Storage, stride, offset, contiguity and layout _(Required)_
- [ ] Views, copies, clone, detach and safe in-place operations _(Required)_
- [ ] nn.Module, Parameter, buffers and nested registration _(Required)_
- [ ] Functional versus module APIs _(Required)_
- [ ] Explicit initialization and state_dict semantics _(Required)_
- [ ] requires_grad, leaves, nonleaves and gradient accumulation _(Required)_
- [ ] backward, autograd.grad, zero_grad and gradcheck _(Required)_
- [ ] no_grad, inference mode and evaluation state _(Required)_
- [ ] Custom autograd.Function forward and backward _(Required)_
- [ ] Dataset, DataLoader, collate functions and transforms _(Required)_
- [ ] Sampler, shuffle, worker and device-transfer behavior _(Required)_
- [ ] Explicit train_one_epoch and evaluate loops _(Required)_
- [ ] Metric aggregation and reduction correctness _(Required)_
- [ ] Checkpointing model, optimizer, scheduler and scaler state _(Required)_
- [ ] Configuration, data position and random generator state _(Required)_
- [ ] Reproducibility claims across CPU, GPU and data workers _(Required)_
- [ ] High-level trainer frameworks _(Later)_
- [ ] Distributed data loading and sharded state _(Later)_

### Resource route

- **Primary - Course:** [PyTorch - Learn the Basics](https://docs.pytorch.org/tutorials/beginner/basics/) - Complete Tensors, Datasets and DataLoaders, Transforms, Build Model, Autograd, Optimization, and Save and Load Model. Rebuild each essential example in a small src package instead of retaining a tutorial notebook.
- **Required - Reference:** [PyTorch - Autograd mechanics, serialization and reproducibility](https://docs.pytorch.org/docs/stable/notes/autograd.html) - Read Autograd mechanics, Serialization semantics and Reproducibility. Test leaf behavior, saved tensors, grad modes, state dictionaries and the exact tolerance promised by one interrupted and resumed run.
- **Required - Practice:** [Learn PyTorch - selected framework exercises](https://www.learnpytorch.io/) - Complete exercise 00, tasks 1-5 in 01, tasks 1-7 in 02, tasks 5-13 in 03, tasks 1-3 in 05, and exercises 1-2 in 07. Recreate solutions independently and verify behavior against current official docs.
- **Support - Implementation:** [Deep Learning with PyTorch, 2nd edition companion code - framework foundations](https://github.com/deep-learning-with-pytorch/dlwpt-code-2e) - Use the Chapter 3, 5 and 6 notebooks when tensor storage, autograd or module ownership needs a second implementation. Inspect the Chapter 4 and 7 code only for a diagnosed data-representation or loading gap.
- **Optional - Practice:** [TensorTonic - PyTorch Sheet](https://www.tensortonic.com/problems) - If access is available, select Tensor Factory, Shape Manipulation, Basic Autograd, Custom Linear Layer, Mini Training, Custom Dataset and Balanced DataLoader. Do not treat the 30-problem sheet as required completion.
- **Optional - Practice:** [NeetCode ML - PyTorch closing drills](https://neetcode.io/practice/machine-learning) - After the module gate, solve Pytorch Basics, Layer Normalization, Batch Normalization and RMS Normalization cold. Explain shapes, state and train-evaluation behavior aloud. These do not replace the package and resume test.

### Exit checkpoint

Present a minimal trainer without a high-level framework, explain every owned state item, resume under a stated tolerance, and reduce and repair one view or in-place autograd failure.

<details>
<summary>Deliberately left for later</summary>

- Lightning, Accelerate and other trainer abstractions
- Distributed and sharded checkpoints
- Production input pipelines

</details>

## 03. Training Dynamics, Regularization & Diagnosis

**Why:** A working model is not enough. You need controls that distinguish an objective, optimization, data, mode, numerical or capacity failure before changing the configuration.

### Learn this much

- [ ] Objective target shapes, masks, weights and reductions _(Required)_
- [ ] Xavier and Kaiming initialization _(Required)_
- [ ] Activation and gradient scale across depth _(Required)_
- [ ] Dead, saturated, vanishing and exploding units _(Required)_
- [ ] Residual paths and gradient flow _(Required)_
- [ ] Batch, layer, group and RMS normalization axes _(Required)_
- [ ] Dropout, label smoothing and data augmentation _(Required)_
- [ ] Weight decay versus an L2 penalty _(Required)_
- [ ] SGD, momentum and Nesterov intuition _(Required)_
- [ ] AdaGrad and RMSProp recognition and failure regimes _(Required)_
- [ ] Adam and AdamW state and update equations _(Required)_
- [ ] Warmup, cosine schedules and schedule order _(Required)_
- [ ] Gradient accumulation and effective batch size _(Required)_
- [ ] Gradient clipping by global norm _(Required)_
- [ ] Tiny-set overfit and shuffled-label controls _(Required)_
- [ ] Nonlearning, divergence, NaN and Inf diagnosis _(Required)_
- [ ] Train-evaluation mismatch and stale state _(Required)_
- [ ] Learning curves, per-slice errors and seed variation _(Required)_
- [ ] Learning-rate range tests _(Optional)_
- [ ] Large-scale hyperparameter sweeps _(Later)_
- [ ] Advanced optimizer research _(Later)_

### Resource route

- **Primary - Theory:** [Understanding Deep Learning - fitting, gradients and regularization](https://udlbook.github.io/udlbook/) - Use Chapters 6-9 and targeted parts of Chapter 20 for optimization, initialization, measurement, regularization and why training works. Re-derive the update rules you keep in the trainer.
- **Required - Implementation:** [D2L - optimization and regularization slice](https://d2l.ai/) - Use MLP implementation, dropout, deep generalization, numerical stability, optimization introduction, SGD, minibatch SGD, momentum, AdaGrad, RMSProp, Adam and learning-rate scheduler. Implement momentum, AdamW, initialization, dropout, one normalization, clipping and one schedule.
- **Reference - Reference:** [PyTorch - optimization and automatic mixed precision examples](https://docs.pytorch.org/tutorials/recipes/recipes/amp_recipe.html) - Check optimizer, scheduler, gradient clipping and AMP API semantics. Preserve the correct order for zeroing, scaling, backward, unscaling, clipping, stepping and updating.
- **Support - Practice:** [TensorTonic - Gradient Accumulation Equivalence](https://www.tensortonic.com/study-plans/language-modeling-from-scratch) - Solve this one named prompt after implementing accumulation locally. Reconcile reduction, microbatch count, step timing and numerical tolerance with a full-batch reference.
- **Optional - Practice:** [Deep-ML candidate - optimization and normalization problems](https://www.deep-ml.com/problems) - After the platform admission check, use at most one of 146 Momentum, 169 AdamW, 197 Global-Norm Clipping, 109 LayerNorm or 115 BatchNorm as a changed-prompt drill.

### Exit checkpoint

Given an unfamiliar failing compact run, choose a discriminating control, repair the causal defect, add a regression test, and defend the configuration with activation, gradient, update and generalization evidence across two seeds.

<details>
<summary>Deliberately left for later</summary>

- Optimizer research and broad tuning sweeps
- Distributed optimizer state
- Task-specific augmentation libraries

</details>

## 04. Convolutional & Recurrent Architectures

**Why:** Convolution and recurrence supply complementary inductive biases. Owning their shapes, costs, state and failure modes makes architecture choice explainable in interviews and experiments.

### Learn this much

- [ ] Convolution kernels, channels and output shapes _(Required)_
- [ ] Padding, stride, dilation and groups _(Required)_
- [ ] Pooling and transposed convolution at recognition depth _(Required)_
- [ ] Receptive fields, parameters, FLOPs and activation memory _(Required)_
- [ ] Translation equivariance and its limits _(Required)_
- [ ] Residual blocks, normalization and initialization in CNNs _(Required)_
- [ ] Augmentation and resolution-driven cost _(Required)_
- [ ] Vanilla recurrent cells and sequence unrolling _(Required)_
- [ ] Backpropagation through time and truncated BPTT _(Required)_
- [ ] Vanishing and exploding recurrent gradients _(Required)_
- [ ] GRU and LSTM gates _(Required)_
- [ ] Hidden-state lifetime and stateful versus stateless evaluation _(Required)_
- [ ] Encoder-decoder sequence models _(Required)_
- [ ] Teacher forcing and exposure mismatch _(Required)_
- [ ] Autoregressive greedy decoding and beam-search recognition _(Required)_
- [ ] Variable-length batches, padding and loss masks _(Required)_
- [ ] Packed sequences at recognition depth _(Required)_
- [ ] Spatial, hidden-state and future-token leak tests _(Required)_
- [ ] Object detection and segmentation systems _(Later)_
- [ ] Large speech and video architectures _(Later)_

### Resource route

- **Primary - Course:** [D2L - convolutional and recurrent architecture route](https://d2l.ai/) - Use why convolution, convolution layer, padding and strides, pooling, channels, batch normalization and ResNet, then RNN, BPTT, scratch RNN, GRU, LSTM, encoder-decoder and seq2seq. Work through the scratch mechanisms before concise APIs.
- **Required - Theory:** [Understanding Deep Learning - convolution and residual networks](https://udlbook.github.io/udlbook/) - Use Chapters 10 and 11 to sharpen convolutional invariance, receptive-field reasoning, residual paths and normalization. D2L remains the recurrent implementation route.
- **Support - Practice:** [Stanford CS231n - Assignments 1 and 2](https://cs231n.stanford.edu/2025/assignments.html) - Use only the neural network, normalization, dropout, convolution and PyTorch components that match this section. Do not complete the course or unrelated vision tasks.
- **Optional - Practice:** [Deep-ML candidate - convolution and recurrence problems](https://www.deep-ml.com/problems) - After the platform admission check, use at most one of 41 Conv2D, 62 RNN with BPTT, 287 GRU or 59 LSTM as a changed-prompt drill.

### Exit checkpoint

Derive shape, receptive field and cost for a stated CNN, implement one convolution and one recurrent or gated cell, then prove padding or future input cannot alter a valid output.

<details>
<summary>Deliberately left for later</summary>

- Detection, segmentation, speech and video specialization
- Large-scale architecture reproduction
- Production sequence decoding systems

</details>

## 05. Representation, Self-Supervision & Paired Modalities

**Why:** Representation objectives need an explicit invariance, pairing contract and held-out evaluator. A falling pretraining loss alone does not show useful transfer.

### Learn this much

- [ ] Embeddings, dot products, cosine geometry and normalization _(Required)_
- [ ] Metric learning and contrastive logits _(Required)_
- [ ] Temperature and batch-negative effects _(Required)_
- [ ] Positive and negative construction _(Required)_
- [ ] Augmentation assumptions, false negatives and shortcuts _(Required)_
- [ ] Representation collapse and norm diagnostics _(Required)_
- [ ] Frozen encoders, linear probes and fine-tuning _(Required)_
- [ ] Held-out retrieval and transfer evaluation _(Required)_
- [ ] Pair, identity and near-duplicate leakage _(Required)_
- [ ] Image layout, patches and patch embeddings _(Required)_
- [ ] Positional information for patch encoders _(Required)_
- [ ] Projector heads and paired-modality alignment _(Required)_
- [ ] Modality imbalance and zero-shot retrieval vocabulary _(Required)_
- [ ] Graph message passing, permutation behavior and oversmoothing recognition _(Required)_
- [ ] Graph neural network implementation _(Depth)_
- [ ] Large multimodal pretraining pipelines _(Later)_
- [ ] Multimodal generation and alignment safety _(Later)_

### Resource route

- **Primary - Theory:** [Understanding Deep Learning - representation foundations](https://udlbook.github.io/udlbook/) - Use 9.3.6-9.3.7 for transfer and self-supervision, 12.9-12.10 for image transformers, and 13.1-13.4 plus 13.10 for GNN vocabulary. Open notebooks 9.4, 12.4 and 13.1 only when a figure or mechanism is unclear.
- **Required - Implementation:** [D2L - Vision Transformer](https://d2l.ai/) - Use vision-transformer.md for patch extraction, patch embeddings and a tested small encoder. Add a compact SimCLR-style or paired-data contrastive objective in the explicit training loop from Sections 2 and 3.
- **Support - Course:** [Stanford CS231n - transformer and self-supervised assignment slice](https://cs231n.stanford.edu/2025/assignments.html) - Use only the Assignment 3 components for transformers, self-supervised learning, CLIP or DINO that directly test representation and pairing. Keep the controlled local evaluator as the gate.
- **Support - Practice:** [TensorTonic - patchify and symmetric CLIP loss](https://www.tensortonic.com/study-plans/language-modeling-from-scratch) - Solve only Patchify a Batch of Images and Implement Symmetric CLIP Contrastive Loss. Transfer both into the controlled experiment and preserve local leakage and collapse tests.
- **Optional - Practice:** [Deep-ML candidate - InfoNCE Loss](https://www.deep-ml.com/problems) - If the platform admission check passes, use problem 384 once after deriving the objective. Add local tests for temperature extremes, missing positives, duplicate pairs and normalized versus unnormalized embeddings.

### Exit checkpoint

Derive a contrastive objective, build a compact representation learner, detect a seeded pair leak, and defend held-out retrieval or transfer evidence with explicit limits.

<details>
<summary>Deliberately left for later</summary>

- Full graph neural network implementations
- Large CLIP-style training pipelines
- Multimodal generation and alignment research

</details>

## 06. Generative Modeling

**Why:** The core skill is distinguishing objective families, sampling paths and evaluation limits. One compact representative should be implemented well instead of reproducing every family.

### Learn this much

- [ ] Autoencoder reconstruction objectives _(Required)_
- [ ] Latent variables, priors and approximate posteriors _(Required)_
- [ ] ELBO reconstruction and KL terms _(Required)_
- [ ] Reparameterized sampling and gradient flow _(Required)_
- [ ] Posterior collapse and decoder capacity _(Required)_
- [ ] GAN minimax objectives and alternating updates _(Required)_
- [ ] Generator-discriminator balance and mode collapse _(Required)_
- [ ] Diffusion forward corruption and reverse denoising _(Required)_
- [ ] Noise, data and velocity prediction recognition _(Required)_
- [ ] Schedules, iterative sampling and compute-quality trade-offs _(Required)_
- [ ] Conditioning and guidance at recognition depth _(Required)_
- [ ] Reconstruction, likelihood and sample-quality limits _(Required)_
- [ ] Autoregressive, latent, adversarial and diffusion comparisons _(Required)_
- [ ] Normalizing-flow likelihood contrast _(Optional)_
- [ ] Large image diffusion training and evaluation _(Later)_
- [ ] Specialized generative-model alignment _(Later)_

### Resource route

- **Primary - Theory:** [Understanding Deep Learning - generative models](https://udlbook.github.io/udlbook/) - Read Chapter 14 for evaluation limits, 15 for GANs, 17 for VAE and ELBO, and 18 for diffusion. Read Chapter 16 only for flow recognition. Use notebooks 17.1-17.3 and 18.1-18.4 as mathematical and visual practice.
- **Support - Implementation:** [D2L - GAN and DCGAN](https://d2l.ai/) - Use gan.md and dcgan.md for one bounded adversarial exposure. The required implementation remains a small VAE with separate reconstruction and KL terms on a two-dimensional mixture or binarized MNIST subset.
- **Optional - Practice:** [Deep-ML candidate - VAE, GAN and diffusion problems](https://www.deep-ml.com/problems) - After the platform admission check, use at most one of 393 VAE Loss, 1384 Reparameterization, 174 1D GAN or 303 Forward Diffusion as a changed-prompt drill.
- **Optional - Course:** [Stanford CS231n - diffusion assignment slice](https://cs231n.stanford.edu/2025/assignments.html) - Use the Assignment 3 diffusion component only after the VAE gate if diffusion mechanics remain weak. It is not a second required generative implementation.

### Exit checkpoint

Derive and implement a compact VAE objective and sampler, expose posterior or mode collapse in a controlled run, and explain what the loss, reconstructions and samples cannot prove.

<details>
<summary>Deliberately left for later</summary>

- Implementing every generative family
- Large diffusion reproduction
- Domain-specific generative evaluation suites

</details>

## 07. Attention & Transformer Foundations

**Why:** Attention must be understood as shape-correct weighted communication with explicit masking and cost. This is the foundation for later LLM work, not a compressed LLM specialization.

### Learn this much

- [ ] Query, key and value projections _(Required)_
- [ ] Scaled dot-product attention _(Required)_
- [ ] Stable row-wise softmax _(Required)_
- [ ] Causal masks, padding masks and all-masked rows _(Required)_
- [ ] Self-attention versus cross-attention _(Required)_
- [ ] Multi-head shapes, concatenation and output projection _(Required)_
- [ ] Positional information and position offsets _(Required)_
- [ ] Residual stream and pre versus post normalization _(Required)_
- [ ] Feed-forward and gated feed-forward blocks _(Required)_
- [ ] Encoder, decoder and encoder-decoder patterns _(Required)_
- [ ] Parameter and FLOP accounting _(Required)_
- [ ] Score memory, activation storage and data movement _(Required)_
- [ ] Quadratic score materialization _(Required)_
- [ ] Convolution, recurrence and attention trade-offs _(Required)_
- [ ] Head, sequence and batch axis hazards _(Required)_
- [ ] Causal, padding and low-precision correctness tests _(Required)_
- [ ] Noncontiguous and variable-length input behavior _(Required)_
- [ ] Decoder-only LLM architecture details _(Later)_
- [ ] FlashAttention kernel implementation _(Later)_
- [ ] KV-cache serving and distributed attention _(Later)_

### Resource route

- **Primary - Theory:** [Understanding Deep Learning - Transformers](https://udlbook.github.io/udlbook/) - Use Chapter 12.1-12.11 and the matching notebooks for dot-product self-attention, extension to transformers, transformer layers and vision transformers.
- **Required - Implementation:** [D2L - attention and transformer implementation route](https://d2l.ai/) - Use queries-keys-values, attention-scoring-functions, multihead-attention, self-attention-and-positional-encoding, transformer and vision-transformer. Implement masked single-head attention, multi-head attention and one pre-normalized block before comparing with PyTorch.
- **Reference - Reference:** [PyTorch - scaled dot product attention](https://docs.pytorch.org/docs/stable/generated/torch.nn.functional.scaled_dot_product_attention.html) - Use the official function documentation as a differential oracle for shapes, masks, dropout and backend behavior after the manual version passes intervention tests.
- **Support - Practice:** [TensorTonic - Named-Dimension Batched Attention Scores](https://www.tensortonic.com/study-plans/language-modeling-from-scratch) - Solve only this named prompt. State the axis contract, preserve named dimensions in tests, and compare with the manual attention block under batch and sequence permutations.
- **Optional - Practice:** [Deep-ML candidate - attention problems](https://www.deep-ml.com/problems) - Use 490 Scaled Dot-Product Attention as the fifth platform admission sample. If the judge catches a seeded masking error, use at most one of 490, 491, 53, 904 or 905 as a changed-prompt drill.

### Exit checkpoint

Derive attention and its cost for a stated shape, implement a general multi-head block, and prove with interventions that neither future nor padded tokens affect valid causal outputs.

<details>
<summary>Deliberately left for later</summary>

- Tokenizer and decoder-only LLM specialization
- RoPE, GQA, KV caches and serving
- Custom fused attention kernels

</details>

## 08. Reliable PyTorch Execution, State & Profiling

**Why:** Framework fluency becomes engineering evidence when precision, memory, state, compilation and timing claims can be predicted, measured and reproduced.

### Learn this much

- [ ] Eager execution, dispatch and autograd nodes _(Required)_
- [ ] Saved tensors and their lifetimes _(Required)_
- [ ] Device streams, asynchronous copies and synchronization _(Required)_
- [ ] Allocated, reserved and peak memory _(Required)_
- [ ] FP32, TF32-style settings, FP16 and BF16 _(Required)_
- [ ] Autocast, gradient scaling and unscale-before-clip order _(Required)_
- [ ] Nonassociativity, overflow and underflow _(Required)_
- [ ] First-invalid-value instrumentation _(Required)_
- [ ] Parameter, gradient, optimizer and activation memory models _(Required)_
- [ ] Temporary workspace, input and allocator reserve _(Required)_
- [ ] Activation checkpointing and recomputation _(Required)_
- [ ] Complete checkpoint and resume state _(Required)_
- [ ] Atomic writes and reproducibility boundaries _(Required)_
- [ ] torch.compile capture, guards and graph breaks _(Required)_
- [ ] Dynamic shapes, recompilation and semantic comparison _(Required)_
- [ ] Profiler annotations and phase timing _(Required)_
- [ ] Data wait, transfer, forward, backward and optimizer decomposition _(Required)_
- [ ] Accidental synchronization and measurement error _(Required)_
- [ ] Correctness and learning checks after optimization _(Required)_
- [ ] Compiler internals and custom graph transformations _(Depth)_
- [ ] DDP, FSDP and distributed checkpointing _(Later)_
- [ ] Custom CUDA and Triton kernels _(Later)_

### Resource route

- **Primary - Course:** [PyTorch - reliability and performance recipes](https://docs.pytorch.org/tutorials/recipes/recipes_index.html) - Use the Profiler, Automatic Mixed Precision, model loading and Benchmark recipes, then the Performance Tuning Guide. Apply each to one compact model from an earlier section and keep a CPU fallback when CUDA is unavailable.
- **Required - Reference:** [PyTorch - compiler troubleshooting](https://docs.pytorch.org/docs/stable/torch.compiler_troubleshooting.html) - Read graph breaks, guards, recompilations and logging. Compile one stable fragment, intentionally trigger a graph break or recompilation, inspect it, and compare eager and compiled outputs and gradients.
- **Required - Reference:** [PyTorch - checkpointing, numerical accuracy and CUDA semantics](https://docs.pytorch.org/docs/stable/checkpoint.html) - Use the official user-guide entries for torch.utils.checkpoint, numerical accuracy, CUDA semantics, reproducibility and serialization. Predict memory categories before measuring and define resume equivalence before running.
- **Reference - Assessment:** [Deep Learning Training Debugger](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-2/deep-learning-training-debugger.md) - Use the failure-injection, measurement and evidence rules as the deeper standard. The full Tier 2 project is a later route and is not added to this stage milestone.
- **Support - Practice:** [TensorTonic - mixed-precision memory and transformer FLOPs](https://www.tensortonic.com/study-plans/language-modeling-from-scratch) - Solve only Mixed-Precision Training Memory Accountant and Transformer Training FLOP Estimator. Reconcile both with the compact model's profiler and document every included and excluded term.
- **Optional - Implementation:** [Learn PyTorch - profiler walkthrough](https://www.learnpytorch.io/) - Use notebook 10 only if the official profiler route remains unclear. Transfer the relevant annotations into the compact model instead of keeping the tutorial code.

### Exit checkpoint

Predict memory categories and the slowest phase, produce a synchronized profile, explain one discrepancy, repair a precision, state, graph or performance fault, and show retained learning and resume behavior.

<details>
<summary>Deliberately left for later</summary>

- Distributed training and sharded state
- Custom kernel development
- Production trainer and fleet operations

</details>

## Stage milestone

### Neural Mechanisms & Training Evidence Pack

Review the stage through three compact artifacts that prove mechanism fluency, PyTorch ownership and diagnosis. Keep every model and dataset small enough to rerun locally or in a free notebook runtime.

- Neural core proof pack - branched tensor autodiff with tests, stable cross-entropy, one tensor MLP, finite-difference and PyTorch differential checks, and one saved-value or broadcast defect with its regression test
- Reproducible PyTorch training run - one small CNN, recurrent, VAE or attention model with explicit loops, configuration and split provenance, tiny-set and shuffled-label controls, complete checkpoint state and a stated resume-equivalence result
- Diagnosis and profile casebook - three seeded-fault postmortems across objective or data, numerical or state, and performance or compile behavior, each with hypotheses, a discriminating control, repair, regression guard, measured evidence and one limitation

