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

### Study units

#### U1. Affine maps, nonlinearities and logits

**About 4 h** · **Target:** Explain + Derive

Topics: Affine maps, nonlinearities, logits and tensor shapes; ReLU, GELU, sigmoid and tanh behavior

Every network is affine maps plus nonlinearities, and the raw affine outputs (logits) feed every loss in this section. Wrong shapes or a dead activation here break everything downstream.

**You can now**

- Write the batched affine map Y = XW + 1 b^T with exact shapes, and derive its weight, bias and input gradients.
- Derive ReLU, sigmoid and tanh derivatives from their definitions, and state where each saturates or dies.
- Explain why stacked affine maps without a nonlinearity collapse to one affine map, and what logits are.

**Study**

1. [Shallow and deep affine structure](https://udlbook.github.io/udlbook/) (Understanding Deep Learning - Chapters 3 to 7) - Chapter 3, Sections 3.1 to 3.5 (Eq 3.1 to 3.12, printed pp. 25 to 35) for the scalar, multivariate and general affine-plus-activation forms; Chapter 4, Sections 4.1 to 4.4 (Eq 4.1 to 4.16, printed pp. 41 to 49) for composed maps and matrix notation.
2. [MLP math and activation curves](https://d2l.ai/chapter_multilayer-perceptrons/mlp.html) (D2L - tensors, autograd, MLP and backpropagation) - Hidden Layers: the linear-collapse derivation W = W1 W2, b = b1 W2 + b2 with X in R^{n x d}, H in R^{n x h}; Activation Functions: ReLU, sigmoid and tanh definitions, plots and derivative maxima. Depth: Skip the Universal Approximators discussion and the Exercises until practice. For the convention that this book calls affine maps linear, read the Chapter 3 Notes paragraph "Linear, affine, and nonlinear functions" in UDL (p. 39).

**Focus**

- Batched affine: X (n x d), W (d x h), b (h,) broadcasts over rows, so Y = XW + 1 b^T has shape (n, h). The bias gradient is the row sum of the upstream gradient.
- Without a nonlinearity, two affine layers collapse to one: substituting H = XW1 + b1 into O = HW2 + b2 gives W = W1W2 and b = b1W2 + b2. Depth without activation adds no function class.
- Sigmoid slope peaks at 0.25 at input 0; tanh peaks at 1 at input 0; both decay toward 0 for large |x|. ReLU has slope 0 below 0 and 1 above; D2L takes the left derivative, 0, exactly at 0.
- GELU is x times the standard Gaussian CDF, smooth rather than piecewise linear, with GELU(0) = 0 and slope 0.5 at 0. UDL Figure 3.13 (p. 37) names it Gaussian error linear unit.

**Reproduce:** Closed-book, for X (4 x 3), W (3 x 5), b (5,) and upstream G = dL/dY: write Y shape (4 x 5) and derive dL/dW = X^T G, dL/db = sum of G over rows, dL/dX = G W^T. Then derive the sigmoid, tanh and ReLU derivatives and state each maximum.

**Traps**

- Returning G itself, or its mean, as the bias gradient. The bias is broadcast over the n rows, so dL/db = 1^T G, the sum over the batch with shape (h,). A mean belongs only to an explicit mean in the loss.
- Reading ReLU slope at 0 as mathematically settled. Frameworks pick a subgradient (D2L uses 0); the kink matters for gradient checks in a later unit.
- Assuming tanh fixes the sigmoid saturation problem. It is zero-centered but still saturates, and its per-layer factor is at most 1.

**Practice**

- [TensorTonic: Evaluate a Dense Layer (autograd-l07-dense-layer-forward)](https://www.tensortonic.com/study-plans/autograd-from-scratch/autograd-l07-dense-layer-forward) - Neural-Network Modules section: Evaluate a Dense Layer; implement the batched affine forward in your own repository. Check your output shape and bias broadcasting against the reproduce derivation before submitting.
- [TensorTonic: Differentiate a Tanh Activation (autograd-l04-tanh-forward-backward)](https://www.tensortonic.com/study-plans/autograd-from-scratch/autograd-l04-tanh-forward-backward) - Neurons and Activation Gradients section: Differentiate a Tanh Activation, then Backpropagate Through a Scalar Neuron. Derive 1 - tanh^2 by hand first; confirm the peak value 1 at input 0.

**Stop when:** You write the 4 x 3 example gradients and all three activation derivatives from memory, and both TensorTonic problems pass with failures, if any, limited to sign conventions you can fix on sight.

<details>
<summary>Self-test</summary>

1. X is 4 x 3, W is 3 x 5, b has 5 entries. What is the shape of Y = XW + b, and of dL/dW in terms of G = dL/dY?
   - Y is 4 x 5. dL/dW = X^T G is (3 x 4) times (4 x 5) = 3 x 5. dL/db is the sum of G over the 4 rows.
2. Why do two stacked affine layers without an activation collapse?
   - Substitution gives a single affine map with W = W1W2 and b = b1W2 + b2, so the pair expresses nothing a single layer cannot.
3. What are the maximum slopes of the sigmoid and tanh, and where?
   - Sigmoid peaks at 0.25 at input 0; tanh peaks at 1 at input 0. Both approach 0 for large positive or negative inputs.
4. What are GELU(0) and the GELU slope at 0?
   - GELU(0) = 0 since 0 times Phi(0) is 0. The derivative is Phi(x) + x phi(x), so at 0 it equals Phi(0) = 0.5.

</details>

#### U2. Stable softmax, cross-entropy and loss reductions

**About 5 h** · **Target:** Derive + Implement

Topics: Stable softmax and log-softmax; Cross-entropy and binary cross-entropy with logits; Regression, reconstruction and masked loss reductions

Classification and contrastive objectives call softmax and cross-entropy on raw logits. The naive form overflows on ordinary inputs, and the wrong reduction silently rescales every gradient.

**You can now**

- Derive the per-example cross-entropy with logits as -f_y + log-sum-exp, and its gradient softmax(z) minus one-hot(y).
- Implement max-subtracted softmax and log-softmax that never overflow, and binary cross-entropy with logits that never takes log of a rounded sigmoid.
- State sum, mean and masked-mean reductions exactly: divisor used, and which positions get zero gradient.

**Study**

1. [Losses from maximum likelihood](https://udlbook.github.io/udlbook/) (Understanding Deep Learning - Chapters 3 to 7) - Chapter 5, Sections 5.1 to 5.2 (Eq 5.1 to 5.6, printed pp. 56 to 60) for likelihood to negative log-likelihood; Section 5.3 (Eq 5.7 to 5.15, pp. 61 to 64) for least squares; Section 5.4 (Eq 5.16 to 5.20, pp. 64 to 66) for sigmoid plus binary cross-entropy; Section 5.5 (Eq 5.21 to 5.24, pp. 67 to 69) and Section 5.7 (Eq 5.27 to 5.31, pp. 71 to 72) for softmax plus multiclass cross-entropy.
2. [Naive softmax and the spelled-out cross-entropy](https://d2l.ai/chapter_linear-classification/softmax-regression-scratch.html) (D2L - tensors, autograd, MLP and backpropagation) - The Softmax: the three-step naive code plus the warning that it is not robust and not for serious use; The Cross-Entropy Loss: y_hat[[0, 1], y] indexing and the reduce_mean of negative logs. Depth: Do not copy the naive softmax or the log-of-probability loss into your own code. Use them only to see what the stable versions below replace.
3. [The max-subtraction trick](https://cs231n.github.io/linear-classify/#softmax-classifier) (CS231n Linear Classification - Softmax classifier and numeric stability) - Softmax classifier: L_i = -f_{y_i} + log sum_j e^{f_j}; Practical issues: Numeric stability: the f -= np.max(f) code turning [123, 456, 789] into [-666, -333, 0].
4. [Masked reductions in cross_entropy](https://docs.pytorch.org/docs/stable/generated/torch.nn.functional.cross_entropy.html) (torch.nn.functional.cross_entropy - reduction and ignore_index) - ignore_index and reduction parameters: ignored targets contribute no gradient, and mean averages over the non-ignored targets only.

**Focus**

- Max subtraction is exact, not approximate: shifting every logit by c multiplies numerator and denominator by e^c, which cancels. The largest shifted logit is 0, so every exp input is at most 0 and no term overflows.
- The fused per-example loss is L_i = -f_{y_i} + log sum_j exp(f_j), and its logit gradient is softmax(z) minus one-hot(y). This matches centered differences to about 1e-9 in float64.
- Binary cross-entropy with logits must use the log-sigmoid form, never sigmoid followed by log: a confident sigmoid rounds to exactly 0 or 1 and the log is then infinite. Its logit gradient is sigmoid(z) - y.
- Mean divides every gradient by N; a masked mean divides by the valid count and gives masked positions exactly zero gradient. D2L cross_entropy uses reduce_mean; UDL least squares (Eq 5.11) sums.

**Reproduce:** Closed-book, implement log_softmax with max subtraction and a cross-entropy returning per-example losses plus their mean. Derive dL/dz = softmax(z) minus one-hot(y). Show softmax([1000, 1001, 1002]) = [0.0900, 0.2447, 0.6652], and explain why the naive form returns [nan, nan, nan].

**Traps**

- Taking log(softmax(z)) in two steps. Even with max subtraction, a very small probability can underflow to 0 and its log becomes -inf. log_softmax(z) = (z - m) - log sum exp(z - m), with m the max, never forms the probability.
- Clipping probabilities after a naive softmax to fix overflow. exp(1000) already overflowed to inf and the division already produced nan; clipping cannot recover the true distribution.
- Expecting the stable answer on [1000, 1001, 1002] to be [1, 0, 0]. Only logit gaps matter, so the result equals softmax([0, 1, 2]): about [0.09, 0.245, 0.665].

**Practice**

- [Deep-ML 1227: Numerically Stable Softmax](https://www.deep-ml.com/problems/1227) - Implement softmax(t, dim) by subtracting the max along dim. The two platform tests use a small 2 x 3 tensor along rows and along columns, so they do not exercise overflow.. After it passes, add your own large-logit test: [1000, 1001, 1002] must give [0.0900, 0.2447, 0.6652], and your log-softmax plus mean cross-entropy must stay finite.
- [TensorTonic: Calculate Squared-Error Loss Gradients (autograd-l08-squared-error-loss-gradients)](https://www.tensortonic.com/study-plans/autograd-from-scratch/autograd-l08-squared-error-loss-gradients) - Losses, Training, and Zeroing Gradients section: Calculate Squared-Error Loss Gradients. State whether your derivation sums or means over examples, and how that choice scales the gradient.

**Stop when:** Your fused loss matches centered differences, survives logits of magnitude 1000, and you can state the divisor and the masked-position gradient for sum, mean and masked mean without notes.

<details>
<summary>Self-test</summary>

1. Why does subtracting the maximum logit prevent overflow without changing softmax?
   - Softmax depends only on logit differences: shifting all logits by c scales numerator and denominator by the same e^c. After subtracting the max, the largest exp input is 0, so every term is at most 1.
2. What is the gradient of the per-example cross-entropy with respect to the logits?
   - softmax(z) minus one-hot(y): p_k - 1 at the true class, p_j elsewhere. It matches centered finite differences to about 1e-9 in float64.
3. A batch of 5 has 2 masked positions under a masked mean. What is the divisor, and what gradient do masked positions get?
   - The divisor is the valid count, 3. Masked positions get exactly zero gradient, matching ignore_index semantics.
4. Why must binary cross-entropy with logits avoid sigmoid-then-log?
   - A confident logit makes sigmoid round to exactly 0 or 1 in floating point, and log(0) is infinite. The fused log-sigmoid form stays finite, with gradient sigmoid(z) - y.

</details>

#### U3. Computation graphs and reverse accumulation

**About 5 h** · **Target:** Derive + Implement

Topics: Computation graphs and local derivatives; Vector-Jacobian products and reverse accumulation

Frameworks hide this loop, but every gradient bug in later sections is a broken graph, a wrong local derivative or a missed accumulation. The engine you build here is the reference for all of them.

**You can now**

- Draw an operation graph, label every local derivative, and hand-run reverse accumulation in topological order.
- Implement a scalar autodiff engine with topological backward that matches centered finite differences.
- Explain vector-Jacobian products: the reverse pass multiplies each incoming gradient by the local Jacobian, seeded with 1 for a scalar loss.

**Study**

1. [Backpropagation from toy model to algorithm](https://udlbook.github.io/udlbook/) (Understanding Deep Learning - Chapters 3 to 7) - Chapter 7, Section 7.2 Observations 1 and 2 (printed pp. 97 to 99) for saved forward activations and ripple effects; Section 7.3 toy example forward (Eq 7.9, p. 101) and backward (Eq 7.10 to 7.16, pp. 101 to 103); Section 7.4 with the summary (Eq 7.17 to 7.26, pp. 103 to 106).
2. [Backprop equations and graph cost](https://d2l.ai/chapter_multilayer-perceptrons/backprop.html) (D2L - tensors, autograd, MLP and backpropagation) - Forward Propagation, Computational Graph of Forward Propagation, and Backpropagation: the W2 and W1 gradient equations; Training Neural Networks: why training memory exceeds prediction memory and grows with layers times batch. Depth: The worked model omits biases by statement; Exercise 2 asks you to add one. Do not mistake the W-only equations for a complete MLP.
3. [The vector-Jacobian seed](https://d2l.ai/chapter_preliminaries/autograd.html) (D2L - tensors, autograd, MLP and backpropagation) - Opening paragraphs on the computational graph and backpropagation; Section 2.5.2 Backward for Non-Scalar Variables: y.backward(gradient=torch.ones(len(y))) computing v^T partial y / partial x.

**Focus**

- Forward pass saves what backward needs: UDL Observation 1 stores every hidden activation because weight gradients are computed from them (dL/dW2 needs h). Saving is a design obligation, not caching.
- Reverse accumulation visits nodes in reverse topological order and multiplies the incoming gradient by each local derivative. That product is the vector-Jacobian product; a scalar loss seeds it with 1.
- PyTorch backward on a non-scalar needs the seed vector explicitly (the gradient argument), while MXNet and TensorFlow sum first. A missing seed is an error, not an implicit sum, in PyTorch.
- Training memory exceeds prediction memory because intermediates are retained for backward, scaling with layers times batch (D2L). Prediction keeps only the current layer.

**Reproduce:** Closed-book, write the UDL toy forward (Eq 7.9) for one example, derive dL/df3 = 2(f3 - y) down through the chain to the w0 term, then implement scalar Value objects with topological backward and match centered differences on the neuron graph.

**Traps**

- Running backward in forward order. A node must accumulate every downstream contribution before propagating further; forward order uses unfinished gradients.
- Assuming saved activations are optional. Without the forward values, local derivatives at nonlinearities and the outer products for weights cannot be evaluated.
- Calling backward twice on the same graph to get the same gradient. The second call re-accumulates (a later unit shows why); kept graphs also keep their saved memory alive.

**Practice**

- [TensorTonic: Topologically Sort a Computation DAG (autograd-l05-topological-sort)](https://www.tensortonic.com/study-plans/autograd-from-scratch/autograd-l05-topological-sort) - Automatic Reverse-Mode Autodiff section: Topologically Sort a Computation DAG, then Run Reverse-Mode Autodiff. Implement both in your own repository; the sort must handle shared nodes visited once.
- [D2L Backprop Exercises: add a bias](https://d2l.ai/chapter_multilayer-perceptrons/backprop.html) - Exercises: add a bias to the hidden layer, draw the computational graph, and derive the forward and backward equations. Compare your bias gradient against the affine-unit rule dL/db = row-summed upstream gradient.

**Stop when:** Your engine differentiates the scalar neuron graph, matches centered differences, and you can hand-run the UDL toy chain and name every saved value backward needs.

<details>
<summary>Self-test</summary>

1. Why does the forward pass store every hidden activation?
   - Backward evaluates local derivatives at the forward values: weight gradients need h (dL/dW2 uses h^T) and nonlinearity derivatives need their inputs. Without them the chain rule has no numbers.
2. A node feeds two downstream ops. What is its reverse-mode gradient?
   - The sum of the vector-Jacobian products over both outgoing edges, by the multivariate chain rule. Accumulation is covered fully in the next unit.
3. In PyTorch, what does y.backward() do when y = x * x is a vector?
   - It raises an error. PyTorch needs an explicit seed vector, as in y.backward(gradient=torch.ones(len(y))), which computes v^T partial y / partial x.
4. For loss (f3 - y)^2, what is dL/df3?
   - 2(f3 - y) (UDL Eq 7.11). It seeds the whole reverse chain.
5. When is forward-mode differentiation cheaper than reverse mode?
   - Roughly when there are fewer inputs than outputs: forward mode costs about one pass per input dimension, reverse mode about one pass per output. A scalar loss with many parameters favors reverse mode.

</details>

#### U4. Branches, broadcasting and saved values in backward

**About 5 h** · **Target:** Derive + Implement

Topics: Repeated use, branches and gradient accumulation; Broadcast forward rules and unbroadcast in backward; Leaf and intermediate tensors and saved forward values

Real graphs reuse nodes and stretch small tensors across batches. Each reuse adds an accumulation obligation and each stretch adds a reduction obligation; missing either gives a silently wrong gradient.

**You can now**

- Hand-compute vector-Jacobian products and accumulated gradients for a branched, broadcast graph with a repeated operand.
- State the broadcast forward rules and implement the backward unbroadcast as a sum over exactly the broadcast axes.
- Distinguish leaf from intermediate tensors, and name every forward value each backward function saves.

**Study**

1. [Accumulation and non-scalar seeds](https://d2l.ai/chapter_preliminaries/autograd.html) (D2L - tensors, autograd, MLP and backpropagation) - Section 2.5.1: PyTorch does not reset the gradient buffer, so the new gradient is added and x.grad.zero_() resets it, which suits sums of objectives; Section 2.5.2: the gradient argument as the seed vector v.
2. [Broadcasting and in-place memory](https://d2l.ai/chapter_preliminaries/ndarray.html) (D2L - tensors, autograd, MLP and backpropagation) - Broadcasting: a of shape (3, 1) plus b of shape (1, 2) giving a 3 x 2 result by copying along length-1 axes; Saving Memory: Y = Y + X reallocates (id changes) while Z[:] = X + Y and X += Y reuse storage. Depth: The page shows forward broadcasting only. Derive the backward rule in Focus below; the PyTorch note gives the exact forward contract it inverts.
3. [Exact broadcast contract](https://docs.pytorch.org/docs/stable/notes/broadcasting.html) (PyTorch Broadcasting semantics) - General semantics: trailing-dimension rules, prepend-1 alignment, result size as the per-dimension max, with (5, 1, 4, 1) plus (3, 1, 1) giving (5, 3, 4, 1); In-place semantics: an in-place tensor may not change shape.
4. [Saved forward values](https://udlbook.github.io/udlbook/) (Understanding Deep Learning - Chapters 3 to 7) - Chapter 7, Section 7.2 Observation 1 (printed pp. 97 to 98): run the network and store the activations of all hidden units in the forward pass for later gradient computation.

**Focus**

- A node feeding two downstream ops gets the sum of both vector-Jacobian products. PyTorch .grad also accumulates across backward calls, so a missing zero_() silently adds yesterday's gradient to today's.
- Broadcast forward: align trailing dimensions, prepend 1 to the shorter shape, and take the per-dimension max. Backward inverts it: sum the upstream gradient over exactly the axes where the input had size 1 or a prepended dimension, then reshape back.
- For L = sum((X + b)^2) with X (2, 3) and b (3,): dL/dX = 2(X + b) keeps shape (2, 3), while dL/db = 2 times the sum of (X + b) over rows. This matches centered differences to about 1e-8 in float64.
- Leaves are user-created tensors with requires_grad; intermediates carry the graph. Backward saves the forward values its local derivatives need (activations for weights, inputs for nonlinearities); detaching cuts provenance so gradients stop at the cut.

**Reproduce:** Closed-book, for L = sum((X + b)^2) with X (2, 3) and b (3,): derive dL/db as 2 times the row sums of (X + b) and dL/dX as 2(X + b). Implement broadcast plus accumulation in your blank-file engine and match centered differences.

**Traps**

- Averaging instead of summing at a branch. The 1/N factor belongs to an explicit mean op, never to fan-out: a doubly used node contributes twice.
- Summing over the wrong axes in unbroadcast. Sum exactly the axes where the input was size 1 or prepended; summing a full-size axis silently shrinks a real dimension.
- Assuming backward zeroes .grad. It adds; the D2L page states this explicitly for PyTorch, unlike MXNet and TensorFlow which reset.

**Practice**

- [TensorTonic: Accumulate Shared-Path Gradients (autograd-l06-shared-path-gradient-accumulation)](https://www.tensortonic.com/study-plans/autograd-from-scratch/autograd-l06-shared-path-gradient-accumulation) - Accumulation and Complete Scalar Operators section: Accumulate Shared-Path Gradients. Extend your engine so a doubly used node sums both path contributions, then re-run your earlier gradient checks.
- [D2L Data Manipulation Exercises: broadcasting with other shapes](https://d2l.ai/chapter_preliminaries/ndarray.html) - Exercises: replace the two broadcast operands with other shapes, including 3-dimensional tensors, and check the result matches the trailing-dimension rules. For each shape pair, also write down the backward summation axes before running anything.

**Stop when:** Your engine accumulates shared-node gradients, unbroadcasts a (2, 3) plus (3,) graph, matches centered differences, and you can state the summation axes for any broadcast pair without notes.

<details>
<summary>Self-test</summary>

1. z = x * u with u = y.detach() and y = x * x. What is dz/dx, and why not 3x^2?
   - u. Detach wipes provenance, so x influences z only directly through the x factor; the path through y carries no gradient. D2L verifies x.grad == u.
2. What is the shape of (5, 1, 4, 1) plus (3, 1, 1), and over which axes is the smaller operand's gradient summed?
   - The result is (5, 3, 4, 1). The smaller operand aligns as (1, 3, 1, 1), so its gradient sums over dims 0 and 2, then reshapes to (3, 1, 1).
3. What happens on a second backward call without zero_()?
   - The new gradient adds to the stored one. That suits optimizing a sum of objectives but corrupts per-batch training.
4. For y = XW + b inside a deeper network, which values must backward have available?
   - X, for dL/dW = X^T G, and W, for dL/dX = G W^T. W costs no extra memory because the parameter is alive anyway; X is the activation memory backward forces you to keep. dL/db needs only G.

</details>

#### U5. Gradient checks with finite differences

**About 3 h** · **Target:** Implement + Measure

Topics: Finite-difference gradient checks and step-size limits

An analytic gradient is a claim, and this unit is the assay. Every engine and loss in this section ships only after finite differences confirm it, within a tolerance you can defend.

**You can now**

- Implement a centered-difference gradient checker with relative error in float64, and state its pass thresholds.
- Diagnose check failures from step size, precision, kinks, regularization, nondeterminism and overlapping memory.
- Decide where a check applies: a few parameters, a few datapoints, at a characteristic point, with noise turned off.

**Study**

1. [The gradient-check protocol](https://cs231n.github.io/neural-networks-3/#gradcheck) (CS231n Neural Networks 3 - Gradient checks) - Gradient Checks: the centered formula with O(h^2) error, relative error with the 1e-2 / 1e-4 / 1e-7 bands, double precision, h near 1e-5, kinks at ReLU, few datapoints, burn-in point, regularization and dropout discipline, and checking a few dimensions per parameter.
2. [Where the formula comes from](https://d2l.ai/chapter_appendix-mathematics-for-deep-learning/single-variable-calculus.html) (D2L - tensors, autograd, MLP and backpropagation) - The limit definition of the derivative and the linear approximation f(x + eps) approx f(x) + eps f'(x): finite differences evaluate the quotient at small nonzero eps instead of taking the limit. Depth: Read for the definition only. The centered formula, error orders and protocol all come from the CS231n note above.
3. [Framework defaults and the overlap warning](https://docs.pytorch.org/docs/stable/generated/torch.autograd.gradcheck.gradcheck.html) (torch.autograd.gradcheck API and tolerances) - Signature defaults eps 1e-6, atol 1e-5, rtol 1e-3; the note that checked tensors with overlapping memory, for example expand outputs, will likely fail.

**Focus**

- Use the centered form (f(x+h) - f(x-h)) / 2h. On exp at 1 with h = 1e-5 it errs by about 6e-11 (second order), while one-sided errs by about 1.4e-5 (first order).
- Compare with relative error |a - n| / max(|a|, |n|) and pass both-zero explicitly. CS231n bands: above 1e-2 probably wrong, 1e-4 to 1e-2 uncomfortable, below 1e-4 fine with kinks, 1e-7 or less happy.
- Run in float64: centered differences on exp at 1 err by about 1e-2 in float32 against about 6e-11 in float64. Smaller h is not always better; roundoff grows as truncation shrinks.
- ReLU at exactly 0 gives centered 0.5 against analytic 0, a relative error of 1: the signature of a crossed kink, not a broken derivative. Check few datapoints, past burn-in, with regularization off and noise seeded or disabled.

**Reproduce:** Closed-book, implement gradcheck(f, x) with centered differences in float64, h = 1e-5 and relative error. Show exp matching to below 1e-7, and ReLU at 0 giving 0.5 against analytic 0.

**Traps**

- Using absolute error on tiny gradients. A 1e-4 gap on 1e-5 gradients is a huge failure; relative error exists for exactly this case.
- Checking with regularization on or dropout active. The simple regularization gradient then dominates or noise swamps the comparison, masking a wrong data-loss gradient.
- Perturbing one element of expanded or otherwise overlapping memory. Every aliased index moves at once, so the numerical gradient is meaningless and the check fails on correct code.

**Practice**

- [TensorTonic: Check a Product-Chain Gradient (autograd-l01-gradient-check-product-chain)](https://www.tensortonic.com/study-plans/autograd-from-scratch/autograd-l01-gradient-check-product-chain) - Derivatives and Gradient Checks section: Check a Product-Chain Gradient, after Estimate a Scalar Derivative and Measure Scalar Expression Partials. Write your own centered checker first with the bands above, then confirm it agrees with the platform tests.
- [TensorTonic: Gradient-Check an Autodiff Graph (autograd-l05-autodiff-gradient-check)](https://www.tensortonic.com/study-plans/autograd-from-scratch/autograd-l05-autodiff-gradient-check) - Automatic Reverse-Mode Autodiff section: Gradient-Check an Autodiff Graph. Check a few dimensions per parameter in float64, past a short burn-in, with any noise disabled.

**Stop when:** Your checker reproduces the exp and ReLU-at-0 numbers from memory, and every earlier engine and loss in this section passes it in float64 with a defended threshold.

<details>
<summary>Self-test</summary>

1. One-sided differences on exp at 1 with h = 1e-5 err by about 1.4e-5. What does centered achieve, and why?
   - About 6e-11. Taylor expansion cancels the first-order term, leaving O(h^2) error instead of O(h).
2. Analytic gradient is 0 and numerical is 0.5 at a ReLU evaluated at 0. What is the relative error, and what does it mean?
   - |0 - 0.5| / max(0, 0.5) = 1. The perturbations crossed the kink, so the centered quotient averages both sides; it indicts the check point, not the implementation.
3. Both analytic and numerical gradients are exactly 0. Pass or fail?
   - Pass, by an explicit both-zero rule. The ratio form would divide zero by zero.
4. A correct gradient shows relative error near 1e-2 in float32. What do you change?
   - Rerun the check in float64. Single-precision roundoff alone can fail a correct gradient; the same exp check drops to about 6e-11 in float64.
5. Why does torch gradcheck warn about expand outputs as inputs?
   - Expanded indices share memory, so perturbing one index changes all its aliases at once. Point perturbation assumes independent coordinates.

</details>

#### U6. Tensor layout: shape, stride, views and copies

**About 3 h** · **Target:** Explain + Implement

Topics: Shape, axes, dtype, layout, stride and storage; View, copy, reshape, transpose and noncontiguous inputs

A tensor is storage plus an interpretation. Backward passes that assume contiguous input misread transposed data, and view-versus-copy mistakes turn a reshape into silent corruption.

**You can now**

- Compute an element address from shape, stride and index, and predict contiguity after transpose or slicing.
- Classify each reshape, transpose, slice and index operation as view or copy, and state the reshape and indexing rules you may not rely on.
- Handle noncontiguous inputs in your own engine: read them correctly through strides or copy to contiguous first, and justify the choice.

**Study**

1. [Tensor creation, shape and memory reuse](https://d2l.ai/chapter_preliminaries/ndarray.html) (D2L - tensors, autograd, MLP and backpropagation) - Getting Started: arange, zeros, ones, shape, size and reshape with -1 inference; Indexing and Slicing; Saving Memory: Y = Y + X reallocates (id changes) while Z[:] = X + Y and X += Y reuse storage. Depth: The page never defines stride, view or storage: those come from the two PyTorch notes below. Use this page for construction, shape inference and the realloc-versus-reuse demos.
2. [Which ops share storage](https://docs.pytorch.org/docs/stable/tensor_view.html) (PyTorch Tensor Views) - The view/storage sharing example with data_ptr and mutation through the view; the transpose example turning a contiguous tensor non-contiguous with no data movement; the full view-ops list; reshape may-copy and contiguous conditional-copy notes; basic indexing returns views while advanced indexing copies.
3. [Strides as element steps](https://docs.pytorch.org/docs/stable/generated/torch.Tensor.stride.html) (torch.Tensor.stride - stride and storage offset) - Stride definition: per-dimension element steps that, with storage_offset, locate every element; combine with the Tensor Views transpose and expand layouts.

**Focus**

- A tensor is storage plus shape, stride, offset and dtype. Element [2, 1] of a (3, 4) C-contiguous float32 tensor sits at offset 2*4 + 1*1 = 9, so the strides are (4, 1) in elements. NumPy reports the same layout in bytes: (16, 4) for float32.
- Transpose swaps shape and strides without moving data: (3, 4) with strides (4, 1) becomes (4, 3) with strides (1, 4), non-contiguous but still a view, so [1, 2] of the transpose aliases offset 9 of the base.
- Reshape, reshape_as and flatten may return a view or a copy: never rely on which. view() demands a compatible layout instead. Basic indexing gives views; advanced indexing (integer or boolean arrays) copies.
- Expand is a stride-0 view: no storage advances along the stretched axis, which is why perturbing one expanded element moves all its aliases and breaks point-wise gradient checks.

**Reproduce:** Closed-book, for a C-contiguous (3, 4) float32 tensor: give strides (4, 1) and offset 9 for [2, 1]; after transpose give shape (4, 3), strides (1, 4), non-contiguous, with [1, 2] aliasing offset 9. Then classify view, reshape, transpose, x[0] and x[[0, 2]] as copy or view.

**Traps**

- Assuming transpose or reshape copies. Both can be views: writing through them mutates the base, and the docs mutate t through b to prove it.
- Assuming view() always works. It needs a compatible layout; a transposed tensor needs reshape (which may copy) or .contiguous() first.
- Mixing byte and element strides. Torch strides count elements; NumPy .strides counts bytes. Convert with itemsize before comparing.

**Practice**

- The section mini-project covers this: noncontiguous and transposed inputs to your engine, view-versus-copy storage checks with shared-storage assertions, and offset accounting verified against the framework on adversarial shapes.

**Stop when:** You compute strides, offsets and aliasing for transpose and expand cases from memory, and your engine reads a transposed input correctly either through strides or through an explicit contiguous copy.

<details>
<summary>Self-test</summary>

1. A (3, 4) float32 tensor is C-contiguous. What are its strides, and what is the offset of [2, 1]?
   - Strides (4, 1) in elements. Offset 2*4 + 1*1 = 9.
2. Transpose it. What are the new shape, strides and contiguity, and which base offset does [1, 2] read?
   - Shape (4, 3), strides (1, 4), non-contiguous view. Offset 1*1 + 2*4 = 9, the same element.
3. Which of these copy: x[0], x[[0, 2]], x.reshape(-1), x.transpose(0, 1)?
   - Only x[[0, 2]] is guaranteed to copy (advanced indexing). x[0] and the transpose are views; reshape may be either, so code must not rely on it.
4. Y = Y + X versus Y[:] = X + Y: which reallocates, and how do you tell?
   - The first reallocates: id(Y) changes. The second reuses storage. D2L demonstrates both with id().

</details>

#### U7. Aliasing, mutation and module ownership

**About 3 h** · **Target:** Explain + Measure

Topics: Aliasing, mutation and detached-path hazards; Parameter, buffer and module ownership at mechanism level

Views alias memory, in-place ops rewrite history, and detach cuts the graph without warning. Ownership rules decide which tensor the optimizer may touch and which state merely travels along.

**You can now**

- Predict when an in-place or view mutation corrupts backward, and route around it with out-of-place ops or no-grad updates.
- Explain detach as a provenance cut, and diagnose detached-path and forgotten-zeroing gradient bugs from their signatures.
- State module ownership at mechanism level: recursive parameter collection, parameters versus buffers, and who may mutate what.

**Study**

1. [In-place hazards and the version counter](https://docs.pytorch.org/docs/stable/notes/autograd.html) (PyTorch Autograd mechanics - in-place operations) - In-place operations with autograd: in-place is discouraged because it rewrites the graph instead of allocating new nodes; In-place correctness checks: every tensor keeps a version counter, and accessing a saved tensor whose version changed raises an error.
2. [Detach and the training loop contract](https://d2l.ai/chapter_preliminaries/autograd.html) (D2L - tensors, autograd, MLP and backpropagation) - Section 2.5.3 Detaching Computation: u = y.detach() with z = u * x gives gradient u, not 3x^2, while the graph to y persists; Section 2.5.1: the gradient buffer accumulates, so x.grad.zero_() resets it between objectives.
3. [Parameters versus buffers](https://docs.pytorch.org/docs/stable/generated/torch.nn.Module.html) (torch.nn.Module - parameters, buffers and state) - Parameters and buffers documentation: modules collect parameters recursively for the optimizer; register_buffer holds persistent non-parameter tensors that are saved alongside parameters without getting gradients.

**Focus**

- Every tensor carries a version counter, bumped by each in-place op. Backward saved the counter value too, so mutating a needed value raises an error instead of computing a wrong gradient. Treat the error as a correct alarm, not an obstacle.
- In-place graph rewrites are only safe for updates outside tracking: optimizer steps mutate parameters under no-grad. Anything inside the tracked graph should allocate new nodes.
- Detach cuts provenance silently: gradients stop at the cut and read as correct-looking smaller values (u instead of 3x^2). A forgotten zero_() is the mirror bug: values look plausible but sum two objectives.
- Ownership: a module owns its parameters recursively (TensorTonic parameter collection below), the optimizer mutates exactly those, and buffers carry persistent non-differentiated state such as running statistics.

**Reproduce:** Closed-book, write the two canonical failures. First, h = x.sigmoid() saves its output; mutate h in place with h.mul_(2) before backward and read the version-counter error. Second, with y = x * x and u = y.detach(), show that z = x * u gives dz/dx = u = x^2, not 3x^2. Then state the parameter-versus-buffer rule for a layer with a running counter.

**Traps**

- Silencing the version-counter error by mutating through .data. Changes made through .data skip the version counter, so backward runs without an error on the mutated value and returns a wrong gradient. Fix the order of operations or clone before the mutation instead.
- Detaching a hidden activation on the path to the loss. Everything before the cut gets no gradient (.grad stays None) with no error, while later layers still train. Detaching the loss itself does fail loudly; the silent case is the middle of the network.
- Registering persistent state as a Parameter. It then gets gradients and optimizer updates it should never have; buffers travel in state without differentiation.

**Practice**

- [TensorTonic: Collect Module Parameters Recursively (autograd-l07-recursive-parameter-collection)](https://www.tensortonic.com/study-plans/autograd-from-scratch/autograd-l07-recursive-parameter-collection) - Neural-Network Modules section: Collect Module Parameters Recursively, after Build a Scalar Neuron Module and Evaluate a Multi-Layer Perceptron. Then state for each collected tensor whether the optimizer may mutate it and whether it needs a gradient.
- [TensorTonic: Apply One Full SGD Training Step (autograd-l08-sgd-training-step)](https://www.tensortonic.com/study-plans/autograd-from-scratch/autograd-l08-sgd-training-step) - Losses, Training, and Zeroing Gradients section: Apply One Full SGD Training Step. Confirm gradients are zeroed before the step and the parameter update itself runs outside gradient tracking.

**Stop when:** You can predict the version error, the detach signature and the accumulation signature on sight, and your module separates parameters from buffers with a stated mutation rule for each.

<details>
<summary>Self-test</summary>

1. You modify a saved activation in place, then call backward. What happens?
   - PyTorch raises a version-counter error when backward accesses the modified saved tensor. The counter recorded at save time no longer matches.
2. For z = x * u with u = y.detach() and y = x * x, what is dz/dx?
   - u, i.e. x^2 in value. Provenance through y is cut, so the 2x^2 path contributes nothing and the total is not 3x^2.
3. Two backward calls with no zero_(): what is in .grad, and when is that what you want?
   - The sum of both gradients. Wanted when optimizing a sum of objectives; a bug when the calls were meant to be separate batch updates.
4. A layer keeps a running event counter alongside its weights. Parameter or buffer?
   - Buffer. It must persist and save with the module but never receive gradients or optimizer updates.

</details>

### Mini-project: Tensor reverse-mode engine with differential checks

**About 10 to 14 hours.** Build a small tensor autodiff engine on NumPy in your own repository: broadcast-aware operations, reverse accumulation over branched graphs, a stable cross-entropy and one tensor MLP. Prove its gradients against finite differences and PyTorch, not against a training curve.

1. Implement a Tensor class on NumPy with add, mul, matmul, sum over axes, exp, log, tanh and ReLU, each with a backward rule, and a backward() that visits a topological order and accumulates into .grad.
2. Make every binary op broadcast-aware: sum each incoming gradient over the broadcast axes back to the operand shape. Test (3, 1) with (1, 4), (4,) with (3, 4), and a scalar, against PyTorch.
3. Add log-softmax and mean cross-entropy as one fused op whose gradient is softmax minus one-hot over the batch size. Test float32 logits of magnitude 1000 for finite loss and gradients, against torch.nn.functional.cross_entropy.
4. Build a branched graph where one tensor reaches the loss through at least three paths, one of them broadcast, for example L = sum(x * w + x.sum(0) * b + tanh(x)). Check every leaf gradient against central differences and against PyTorch, both in float64, with a step and tolerance you justify.
5. Train a two-layer tensor MLP with your engine on a small synthetic classification set, and show its first-step gradients match a PyTorch copy with the same weights.
6. Layout tests: feed transposed and noncontiguous arrays into your engine and match gradients from contiguous copies. For PyTorch views, assert shared storage through untyped_storage().data_ptr(), and compute the element offset from strides and storage_offset for a slice, a transpose and an expand.
7. Reproduce one saved-value or mutation defect, such as an input edited in place between forward and backward. Show the wrong or refused gradient, fix it with a copy on save or a version counter, and keep a regression test.

**Deliverables**

- The engine package: ops with broadcast-aware backward, topological backward, fused cross-entropy and the MLP.
- The test suite: float64 finite-difference and PyTorch checks, broadcast cases, extreme-logit cases, layout and storage tests, and the defect regression test.
- A one-page note listing the values each op saves for backward, why, and the tolerance chosen for each check.

**Checks**

- external-tests: [TensorTonic autograd-from-scratch problems named in the units](https://www.tensortonic.com/study-plans/autograd-from-scratch). Free plan. Solve the dense layer, tanh, topological sort, shared-path accumulation and gradient-check problems before you wire the same rules into your engine.
- rubric: Self-grade with the rubric below.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Gradient correctness | Every op matches PyTorch in float64 within a stated tolerance on random inputs. | The branched broadcast graph matches both finite differences and PyTorch, and the note justifies the step size and tolerance. |
| Broadcasting | Gradients reduce to each operand shape in the tested broadcast cases. | A property test draws random broadcast-compatible shape pairs and compares against PyTorch. |
| Numerical stability | Cross-entropy is finite for float32 logits of magnitude 1000. | A test shows the naive form failing on the same input, and the note explains why the max shift leaves the gradient unchanged. |
| Saved values and mutation | One defect is reproduced, fixed and guarded by a test. | The note lists every saved value per op, and the engine either refuses or survives an in-place edit of a saved input, with a test for each case. |
| Layout | Transposed and noncontiguous inputs give the same gradients as contiguous copies. | Storage and offset assertions cover a slice, a transpose and an expand, checked against PyTorch strides. |

Feeds into: Capstone artifact 1, the neural core proof pack.

### Resource route

- **Primary - Theory:** [Understanding Deep Learning - Chapters 3 to 7](https://udlbook.github.io/udlbook/) - Read Chapters 3-7, emphasizing Chapter 5 for likelihood-derived losses and Chapter 7 for backpropagation and initialization. Use notebooks 3.1, 4.1, 5.1, 6.1 and 7.1 only as equation and plot companions.
- **Required - Implementation:** [D2L - tensors, autograd, MLP and backpropagation](https://d2l.ai/) - Use chapter_preliminaries ndarray and autograd, then MLP, backpropagation, and numerical stability and initialization. Recreate scalar operations, affine maps, activation, reduction, stable cross-entropy, topological backward and unbroadcast in a blank file.
- **Required - Practice:** [TensorTonic - Build Micrograd from Scratch](https://www.tensortonic.com/problems) - Use the 25-problem Micrograd study plan in order for derivatives, gradient checks, value graphs, reverse mode, accumulation, operators, modules, losses and training. Preserve local tests as the evidence instead of a platform score.
- **Optional - Practice:** [Deep-ML candidate - autograd and loss problems](https://www.deep-ml.com/problems) - After the five-sample platform check passes, use at most one of 26 Basic Autograd Operations, 997 Manual Cross-Entropy Backprop or 1227 Stable Softmax as a changed-prompt drill.
- **Reference - Reference:** [CS231n Linear Classification - Softmax classifier and numeric stability](https://cs231n.github.io/linear-classify/#softmax-classifier) - Read the Softmax classifier section for the cross-entropy form L_i = -f_{y_i} + log sum exp, then the Practical issues: Numeric stability part for the max-subtraction code f -= np.max(f).
- **Reference - Reference:** [CS231n Neural Networks 3 - Gradient checks](https://cs231n.github.io/neural-networks-3/#gradcheck) - Read the Gradient Checks section only: centered formula with O(h^2) error, relative error with thresholds, double precision, step size h near 1e-5, kinks, few datapoints, burn-in, regularization and dropout discipline, and checking a few dimensions per parameter.
- **Reference - Reference:** [PyTorch Broadcasting semantics](https://docs.pytorch.org/docs/stable/notes/broadcasting.html) - Read General semantics for the trailing-dimension rules, prepend-1 alignment and max-size result, with the (5, 1, 4, 1) plus (3, 1, 1) examples; read In-place semantics for why an in-place tensor may not change shape.
- **Reference - Reference:** [torch.autograd.gradcheck API and tolerances](https://docs.pytorch.org/docs/stable/generated/torch.autograd.gradcheck.gradcheck.html) - Read the gradcheck signature defaults (eps 1e-6, atol 1e-5, rtol 1e-3) and the note that inputs with overlapping memory, such as expand outputs, will likely fail the check.
- **Reference - Reference:** [torch.nn.functional.cross_entropy - reduction and ignore_index](https://docs.pytorch.org/docs/stable/generated/torch.nn.functional.cross_entropy.html) - Read the ignore_index and reduction parameters: ignored targets contribute no gradient, and mean reduction averages over the non-ignored targets only.
- **Reference - Reference:** [PyTorch Tensor Views](https://docs.pytorch.org/docs/stable/tensor_view.html) - Read the view and storage sharing example (data_ptr, mutating the view changes the base), the transpose non-contiguous example, the full view-ops list, and the special notes: reshape may copy, contiguous copies only when needed, basic indexing returns views while advanced indexing copies.
- **Reference - Reference:** [torch.Tensor.stride - stride and storage offset](https://docs.pytorch.org/docs/stable/generated/torch.Tensor.stride.html) - Read the stride definition: strides are per-dimension element steps, and with storage_offset they locate every element. Combine with the Tensor Views page for transposed and expanded layouts.
- **Reference - Reference:** [PyTorch Autograd mechanics - in-place operations](https://docs.pytorch.org/docs/stable/notes/autograd.html) - Read In-place operations with autograd (why in-place rewrites the graph and is discouraged) and In-place correctness checks (the version counter and the error on accessing a modified saved tensor).
- **Reference - Reference:** [torch.nn.Module - parameters, buffers and state](https://docs.pytorch.org/docs/stable/generated/torch.nn.Module.html) - Read the parameters and buffers documentation: modules collect parameters recursively for the optimizer, while register_buffer holds persistent non-parameter tensors saved alongside them.

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

### Study units

#### U1. PyTorch tensors: creation, indexing, storage and strides

**About 3 h** · **Target:** Explain + Implement

Topics: Tensor creation, indexing, devices and dtypes; Storage, stride, offset, contiguity and layout

Every later failure in this stage, from silent dtype promotion to aliasing bugs, starts as a wrong picture of what a tensor owns. Storage, stride and device are that picture.

**You can now**

- Create tensors with explicit dtype and device, and predict shape, dtype and device after indexing, concatenation and device moves.
- Compute a storage offset from shape, stride and index, and classify a tensor as contiguous, transposed or sliced from its stride.
- Predict when a torch tensor and a NumPy array share memory, and when an op copies instead.

**Study**

1. [Tensors: initialization, attributes, indexing and NumPy sharing](https://docs.pytorch.org/tutorials/beginner/basics/tensorqs_tutorial.html) (PyTorch - Learn the Basics) - Initializing a Tensor; Attributes of a Tensor; Operations on Tensors through Single-element tensors; Bridge with NumPy.
2. [Tensor storage, strides and transpose sharing (notebook)](https://github.com/deep-learning-with-pytorch/dlwpt-code-2e/blob/main/p1ch3/1_tensors.ipynb) (Deep Learning with PyTorch, 2nd edition companion code - framework foundations) - Cells using points.storage(), storage_offset(), stride(), the transpose storage-identity check, is_contiguous() and contiguous(). Depth: Use only the storage, stride, transpose and contiguity cells. Skip the named-tensor notebook; named dimensions are out of scope here.

**Focus**

- dtype is inferred at creation and the device is CPU unless you choose one. Tensor.to() returns a tensor (the same one when nothing changes), so assign the result. Module.to() is the exception: it converts the module in place.
- Element offset is storage_offset plus the sum over dims of index times stride. Transpose and slicing change stride and offset, not storage.
- Basic indexing gives views. .numpy() and torch.from_numpy() share one CPU allocation, so in-place edits leak across the boundary.
- contiguous() returns the same tensor when already contiguous and copies otherwise. Never branch on reshape returning a view.

**Reproduce:** Closed-book, take x = torch.zeros(3, 4). Write the shape, stride, storage_offset and is_contiguous of x, xt = x.t() and y = x[::2]. Show that xt[2][1] and x[1][2] name the same element, and assert the shared storage with data_ptr.

**Traps**

- Reading transpose or permute as a copy. They return views, so writing through them changes the base.
- Trusting reshape to return a view. It may copy; check data_ptr instead of assuming.
- Calling x.to(device) on a tensor and then using x. The call returns the moved tensor; x stays where it was. (model.to(device) does move the module in place, which is why the habit forms.)

**Practice**

- [Learn PyTorch 00: tensor creation, matmul, seeds and squeeze (tasks 2 to 10)](https://www.learnpytorch.io/00_pytorch_fundamentals) - Exercises, tasks 2 to 10: (7, 7) and (2, 3) creation, matmul with transpose, manual_seed replays, GPU seed lookup, argmax and argmin, squeeze of (1, 1, 1, 10). Write the tasks in your own script, not in the solutions notebook. Task 1 is background reading; tasks 2 to 10 are the checked work. Run the GPU tasks on whatever device you have and say which one you used.

**Stop when:** Your written shape, stride and offset table for x, x.t() and x[::2] matches data_ptr and is_contiguous checks, and tasks 2 to 10 run without the solutions notebook.

<details>
<summary>Self-test</summary>

1. x = torch.zeros(3, 4). What are the strides of x and of x.t(), and is either contiguous?
   - x has stride (4, 1) and is contiguous. x.t() has shape (4, 3) and stride (1, 4); it shares storage and is not contiguous.
2. Which element does xt[2][1] alias, and at what storage offset?
   - x[1][2], at offset 2*1 + 1*4 = 6 from a zero storage_offset.
3. t = torch.ones(5); n = t.numpy(); t.add_(1). What is n now, and why?
   - All twos. The tensor and the array share one CPU allocation, so the in-place add is visible through both.
4. When does c = t.contiguous() copy, and when does it return t itself?
   - It copies only when t is non-contiguous. On a contiguous t it returns the same tensor.

</details>

#### U2. Autograd state: views, in-place ops, leaves and accumulation

**About 4 h** · **Target:** Explain + Measure

Topics: Views, copies, clone, detach and safe in-place operations; requires_grad, leaves, nonleaves and gradient accumulation

In-place edits and hidden views are the most common source of corrupt gradients that still run. This unit makes the failure loud and the fix routine.

**You can now**

- Classify an op as view, copy or ambiguous, including basic versus advanced indexing, and predict aliasing with data_ptr.
- Explain leaf versus non-leaf gradient storage, accumulation into .grad, and when zero_grad, detach or retain_grad is required.
- Trigger, read and repair an in-place version-counter failure without guessing.

**Study**

1. [Tensor Views: view ops, indexing and reshape ambiguity](https://docs.pytorch.org/docs/2.14/tensor_view.html) (PyTorch - Autograd mechanics, serialization and reproducibility) - View definition and data_ptr example; transpose contiguity example; full view-ops list with detach; basic versus advanced indexing note; reshape and contiguous special behavior.
2. [Autograd mechanics: saved tensors, requires_grad, grad modes, in-place checks](https://docs.pytorch.org/docs/stable/notes/autograd.html) (PyTorch - Autograd mechanics, serialization and reproducibility) - Saved tensors; Setting requires_grad; Grad Modes table with no-grad versus inference reuse; In-place operations with autograd and In-place correctness checks. Depth: Skip Multithreaded Autograd, Autograd for Complex Numbers and the division-by-zero section.
3. [Autograd: no_grad, detach and the accumulation demo](https://docs.pytorch.org/tutorials/beginner/basics/autogradqs_tutorial.html) (PyTorch - Learn the Basics) - Disabling Gradient Tracking (no_grad block and detach); Optional Reading: Tensor Gradients and Jacobian Products (accumulation across calls, zeroing).
4. [Autograd loop mechanics: zero_grad and no_grad updates](https://github.com/deep-learning-with-pytorch/dlwpt-code-2e/blob/main/p1ch5/2_autograd.ipynb) (Deep Learning with PyTorch, 2nd edition companion code - framework foundations) - Cells with params.grad.zero_(), loss.backward() and the torch.no_grad() parameter update.

**Focus**

- detach() is a view that shares storage but cuts grad history. clone() is absent from the view-ops list, so it copies the data. Test both claims with data_ptr and requires_grad.
- Only leaves with requires_grad=True accumulate into .grad, and every backward() adds. Non-leaves need retain_grad before the backward that consumes them.
- Inference-mode tensors cannot re-enter grad-mode computation; no-grad tensors can. Use inference mode only for pure evaluation paths.
- An in-place bump of a saved tensor raises a version-counter error at backward. Clone before the saving op or move the mutation earlier; do not catch and ignore.

**Reproduce:** Closed-book, write x = torch.randn(4, requires_grad=True) and y = (x ** 2).sum(). Show that x.add_(1) fails at once because x is a leaf that requires grad. Then do the same update under torch.no_grad() and read the version-counter error that y.backward() raises, because pow saved x. Repair it by computing y from z = x.clone(), and check that x.grad equals 2 times the value x had during the forward.

**Traps**

- Treating detach() as a copy. It shares storage, so an in-place edit through either side is visible to both.
- Reading .grad on a non-leaf. It stays None unless retain_grad() was called; only leaves accumulate.
- Updating a leaf that requires grad in place outside torch.no_grad(). PyTorch refuses at once ("a leaf Variable that requires grad is being used in an in-place operation"); manual parameter updates belong under no_grad.

**Practice**

- The section mini-project covers this: reduce one view or in-place autograd failure to a minimal script, repair it, and keep it as a regression test.

**Stop when:** You classify ten ops as view, copy or ambiguous without the list, and your version-counter script fails before the fix and passes after.

<details>
<summary>Self-test</summary>

1. b = t.view(2, 8); b[0][0] = 3.14. What is t[0][0]?
   - 3.14. The view shares storage, so the write is visible through the base.
2. Is t.reshape(2, 8) guaranteed to behave the same way?
   - No. reshape may return a view or a copy, so never rely on aliasing through it.
3. You call out.backward(torch.ones_like(out), retain_graph=True) twice without zeroing. How does inp.grad after the second call relate to the first?
   - It is twice the first. backward() adds into .grad; the autogradqs Jacobian-product section shows this doubling, and zeroing inp.grad resets it.
4. What is the practical difference between no-grad and inference mode for tensors you keep?
   - Both skip graph recording, but inference-mode tensors cannot be used in later grad-mode computation while no-grad tensors can.

</details>

#### U3. Modules, parameters, buffers and initialization

**About 4 h** · **Target:** Explain + Implement

Topics: nn.Module, Parameter, buffers and nested registration; Functional versus module APIs; Explicit initialization and state_dict semantics

Parameters, buffers and init are the state you own for the rest of the stage. Confusing them turns every later resume, transfer and device bug into a mystery.

**You can now**

- Assemble nested modules and read ownership from dotted names in named_parameters.
- Separate Parameters, persistent buffers and non-persistent buffers, and predict exactly which names appear in state_dict.
- Replace default initialization explicitly, and reload saved state into a fresh instance.

**Study**

1. [Build the Neural Network: class, layers, parameters](https://docs.pytorch.org/tutorials/beginner/basics/buildmodel_tutorial.html) (PyTorch - Learn the Basics) - Define the Class (nn.Module subclass, forward, never call model.forward() directly); Model Layers (Flatten, Linear, ReLU, Sequential, Softmax); Model Parameters (named_parameters with dotted names).
2. [Modules note: nesting, state, buffers, initialization](https://docs.pytorch.org/docs/2.14/notes/modules.html) (PyTorch - Autograd mechanics, serialization and reproducibility) - A Simple Custom Module; Modules as Building Blocks (children, recursion, ModuleList and ModuleDict, to(), apply() with xavier init); Module State (parameters, persistent and non-persistent buffers, StatefulModule key list); Module Initialization (skip_init with orthogonal_). Depth: Skip Module Hooks and Advanced Features; they belong to later profiling and distributed work.
3. [Extending torch.nn: the module recommendation and the Linear example](https://docs.pytorch.org/docs/2.14/notes/extending.html) (PyTorch - Autograd mechanics, serialization and reproducibility) - Extending torch.nn intro (modules for stateful layers, functional form for parameter-less ops); Adding a Module (nn.Parameter, register_parameter, register_buffer, nn.init.uniform_ comments). Depth: Read only the Adding a Module part here; the autograd Function part belongs to the custom-autograd unit.

**Focus**

- Assigning nn.Parameter registers; assigning a plain Tensor does not. Registration is what parameters(), .to() and optimizers see.
- Persistent buffers ship in state_dict, non-persistent ones do not, but .to() moves both.
- state_dict maps dotted names to tensors only. Reloading needs a matching live instance first; mismatched names fail unless explicitly allowed.
- Default init runs at construction. To study init, skip it with skip_init and apply one nn.init function yourself, as the Modules note does with orthogonal_.

**Reproduce:** Closed-book, write a two-layer Net with a Linear submodule, a persistent running-mean buffer and a ParameterList. Predict the state_dict keys, save, reload into a fresh instance, and assert the buffer matches.

**Traps**

- Expecting a plain-Tensor attribute to train. Only Parameters and their submodules appear in parameters().
- Saving the model object instead of its state_dict. Pickle then binds the file to the class definition; state_dict plus code reloads cleanly.
- Copying the Extending example uniform(-0.1, 0.1) init into real work. It ignores fan-in; use a fan-aware nn.init function or skip_init plus your own.

**Practice**

- [Learn PyTorch 01: nn.Module with Parameters, then save and reload (tasks 2 and 5)](https://www.learnpytorch.io/01_pytorch_workflow) - Exercises, task 2 (nn.Module subclass with nn.Parameter weight and bias, state_dict check) and task 5 (save state_dict, reload into a new instance, verify predictions match). Implement in your own script. The prediction check must compare outputs, not just file existence.

**Stop when:** Your predicted key list matches the printed state_dict before you print it, and the reloaded instance reproduces predictions exactly.

<details>
<summary>Self-test</summary>

1. Which names appear in StatefulModule state_dict, and which entries are absent?
   - param1, param2, buffer1, the param_list and param_dict entries, linear.weight and linear.bias appear. The non-persistent buffer2 and the reserved None entries param3 and buffer3 are absent.
2. Why does load_state_dict need a constructed model first?
   - The dict holds tensors under names, not the module graph. The instance supplies the structure the names attach to.
3. A BatchNorm layer updates statistics in train mode and freezes them in eval mode. Where do those statistics live?
   - In persistent buffers. They are saved in state_dict and moved by .to(), but never given to the optimizer.
4. What does module.apply(init_weights) give you that a loop over named_parameters does not?
   - apply calls the function on every submodule and then on the module itself, so one function with an isinstance check can initialize each layer type its own way. A named_parameters loop sees only names and tensors, not the layer each one belongs to.

</details>

#### U4. Backward, zero_grad, gradcheck and evaluation modes

**About 3 h** · **Target:** Implement + Measure

Topics: backward, autograd.grad, zero_grad and gradcheck; no_grad, inference mode and evaluation state

Gradients accumulate silently, grad modes look alike, and eval state hides inside layers. This unit separates the three mechanisms before they combine in the training loop.

**You can now**

- Run backward, autograd.grad and zero_grad correctly, including the grad argument for non-scalar outputs and retain_graph for repeated backward.
- Check a handmade op with torch.autograd.gradcheck in float64, and read a tolerance failure as a wrong formula, not noise.
- Switch train and eval modes plus no_grad and inference mode correctly, and state what each one changes.

**Study**

1. [Autograd: computing gradients, retain_graph, accumulation](https://docs.pytorch.org/tutorials/beginner/basics/autogradqs_tutorial.html) (PyTorch - Learn the Basics) - Computing Gradients (loss.backward, leaf-only grad, retain_graph); Optional Reading: Tensor Gradients and Jacobian Products (ones seed, accumulation doubling, zeroing).
2. [Zeroing out gradients recipe](https://docs.pytorch.org/tutorials/recipes/recipes/zeroing_out_gradients.html) (PyTorch - Learn the Basics) - Introduction (accumulation into .grad); Steps 4 and 5 (optimizer, zero_grad before forward, backward, step); model.zero_grad() equivalence condition.
3. [Gradcheck mechanics: central differences and Jacobian rebuild](https://docs.pytorch.org/docs/2.14/notes/gradcheck.html) (PyTorch - Autograd mechanics, serialization and reproducibility) - Default backward mode gradcheck behavior: Real-to-real functions (central-difference formula, column-by-column numerical rebuild, row-by-row analytical rebuild). Depth: Skip complex inputs, fast mode and gradgradcheck; the real-to-real section is the whole assignment.
4. [Autograd mechanics: requires_grad, grad modes, evaluation mode](https://docs.pytorch.org/docs/stable/notes/autograd.html) (PyTorch - Autograd mechanics, serialization and reproducibility) - Setting requires_grad (leaf freezing); Grad Modes table with Default, No-grad and Inference rows; Evaluation Mode (nn.Module.eval, orthogonal to grad modes, Dropout and BatchNorm).

**Focus**

- backward() on a scalar means a ones seed. Non-scalar outputs need an explicit grad argument of matching shape.
- The graph is freed after backward unless retain_graph is set. Repeated backward without it errors; with it, .grad keeps accumulating.
- gradcheck rebuilds full Jacobians: central differences numerically, one-hot seeds analytically. Run it in float64, as the Extending example does with dtype=torch.double, eps=1e-6, atol=1e-4.
- model.eval() changes layer behavior, not grad tracking. Pair it with no_grad for evaluation; inference mode additionally forbids later grad-mode reuse.

**Reproduce:** Closed-book, predict the three printed gradients in the autogradqs Jacobian-product snippet (first call, second call, after zeroing) from the eye(4, 5) input, then explain why the second call doubles and the third resets.

**Traps**

- Calling backward twice on one graph. The second call fails unless retain_graph was set, and then it adds to .grad instead of replacing.
- Reading model.eval() as gradient control. It is orthogonal to no_grad and inference mode; eval changes Dropout and BatchNorm behavior only.
- Assuming model.zero_grad() always equals optimizer.zero_grad(). They match only when every model parameter sits in that optimizer.

**Practice**

- [Learn PyTorch 02 task 6: pure-PyTorch tanh, then gradcheck it](https://www.learnpytorch.io/02_pytorch_classification) - Exercises, task 6 (replicate tanh in pure PyTorch); check the result with torch.autograd.gradcheck in float64 per the gradcheck note. Write tanh from primitives first, match it against torch.tanh, then gradcheck your version. A tolerance failure is a bug in your formula.
- [NeetCode ML: PyTorch closing drills cold](https://neetcode.io/practice/machine-learning) - PyTorch category (4 problems): Pytorch Basics, Layer Normalization, Batch Normalization, RMS Normalization. Solve cold after the module gate. Explain shapes, state and train-versus-eval behavior aloud; these do not replace the reload and resume checks.

**Stop when:** You predict all three Jacobian-product printouts before running, and your handmade tanh passes gradcheck in float64.

<details>
<summary>Self-test</summary>

1. out = (inp + 1).pow(2).t() with inp = eye(4, 5) requiring grad, seeded with ones. What is inp.grad[0][0] and inp.grad[0][1] after one backward?
   - 4 and 2. Each entry gets 2*(inp+1) at its own position: 2*2 on the diagonal ones, 2*1 elsewhere.
2. The same backward runs again with retain_graph and no zeroing. What changes?
   - Every entry doubles. The new gradients add to the existing .grad instead of replacing it.
3. Why does the Extending gradcheck example use dtype=torch.double?
   - Central differences with eps=1e-6 need precision far above float32 rounding. In float32 the numerical Jacobian is usually too noisy for the tolerances.
4. Two evaluation passes over the same test set with the same weights give different accuracies. Which call is missing, and which layers cause the difference?
   - model.eval(). In training mode Dropout drops random units on every pass, and BatchNorm normalizes with the current batch statistics and keeps updating its running buffers.

</details>

#### U5. Custom autograd functions

**About 3 h** · **Target:** Derive + Implement

Topics: Custom autograd.Function forward and backward

Custom Functions are where the VJP becomes your code. One correct handwritten backward removes the mystery from every built-in one.

**You can now**

- Write forward, setup_context and backward for a Function subclass, with save_for_backward and None grads for non-tensor args.
- Validate the backward with gradcheck in float64, and state whether double backward is supported.
- Explain why saved state must go through save_for_backward rather than raw ctx attributes.

**Study**

1. [Extending torch.autograd: custom Function contract and examples](https://docs.pytorch.org/docs/2.14/notes/extending.html) (PyTorch - Autograd mechanics, serialization and reproducibility) - When to use and When not to use; How to use steps 1 to 4 (forward, setup_context, backward, ctx rules, once_differentiable, gradcheck); Example (LinearFunction, MulConstant, gradcheck with dtype=torch.double, eps=1e-6, atol=1e-4); Combined or separate forward() and setup_context(). Depth: Skip the __torch_function__ protocol, C++ extensions, forward-mode jvp and torch.func transforms. Stop at Combined or separate forward() and setup_context().
2. [Autograd mechanics: how saved tensors work](https://docs.pytorch.org/docs/stable/notes/autograd.html) (PyTorch - Autograd mechanics, serialization and reproducibility) - Saved tensors (what pow and exp save, packing versus unpacking, saved-tensor hooks). Depth: Read only the Saved tensors section here; the grad-mode and in-place sections belong to earlier units.

**Focus**

- forward() runs with grad recording off, so nothing inside it is tracked. setup_context() owns the ctx writes. backward() receives one grad per output and returns one grad per forward input.
- Save tensors with save_for_backward. The Extending note gives the reasons: the engine frees them when this backward finishes, it avoids reference cycles when you save an output, and saved-tensor hooks (activation checkpointing, offloading) can see them. Saved tensors are also version-checked, so a later in-place edit raises an error instead of corrupting the gradient.
- Non-tensor forward args get None grads, and backward must never modify its grad inputs in place. Gate optional work with needs_input_grad.
- Derive the linear backward shapes on paper first: grad_input = grad_output mm weight, grad_weight = grad_output.t() mm input, grad_bias = grad_output.sum(0).

**Reproduce:** From a blank file, reimplement LinearFunction and MulConstant with separate setup_context, and gradcheck both in float64. Then break the bias grad (return zeros) and quote the gradcheck mismatch before fixing it.

**Traps**

- Stashing tensors as plain ctx attributes. They stay alive for the whole graph, can form a reference cycle with the output, escape the in-place version check, and are invisible to saved-tensor hooks. Keep ctx attributes for non-tensors.
- Writing into grad_output inside backward. Grad inputs are read-only; in-place edits corrupt every other consumer of that graph.
- Returning a tensor grad for a non-tensor arg like constant. Those positions must be None, as MulConstant shows.

**Practice**

- [Extending PyTorch worked examples: LinearFunction and MulConstant, each gradchecked](https://docs.pytorch.org/docs/2.14/notes/extending.html) - Example: reimplement LinearFunction and both MulConstant variants from a blank file, then run the gradcheck snippet (double inputs, eps=1e-6, atol=1e-4) on each. Do not copy the page. Write from the contract (forward, setup_context, backward), pass gradcheck, then deliberately break one grad and read the failure.

**Stop when:** Both reimplementations pass gradcheck from memory, and you can state for each saved value why it is saved and when it is freed.

<details>
<summary>Self-test</summary>

1. Linear forward is input.mm(weight.t()) with input (5, 4) and weight (3, 4). What are the shapes of grad_input and grad_weight for grad_output (5, 3)?
   - grad_input is (5, 4) from grad_output mm weight; grad_weight is (3, 4) from grad_output.t() mm input.
2. Why does MulConstant backward return two values with the second None?
   - backward returns one grad per forward input. constant is not a Tensor, so its position must be None.
3. With separate forward and setup_context, you want to save an intermediate computed in forward that is neither an input nor an output. What do you do?
   - setup_context only receives the inputs and the output, so the intermediate is out of reach. Return it as an extra output and save it in setup_context, as the Extending note does with dx, or use the combined forward(ctx, ...) style.

</details>

#### U6. Datasets, data loaders and samplers

**About 4 h** · **Target:** Implement

Topics: Dataset, DataLoader, collate functions and transforms; Sampler, shuffle, worker and device-transfer behavior

The loader decides order, batching, dtype and device of every tensor the loop ever sees. Bugs here look like model bugs downstream.

**You can now**

- Implement a Dataset with init, len and getitem plus a collate and transform pipeline, and read batch shapes off the loader.
- Control sampler, shuffle, worker count and seeding, and move batches to device with explicit transfer.
- State what a loader does not guarantee: ragged batching, worker-shared state and exact resume need extra code.

**Study**

1. [Datasets and DataLoaders: FashionMNIST, custom Dataset, batching](https://docs.pytorch.org/tutorials/beginner/basics/data_tutorial.html) (PyTorch - Learn the Basics) - Loading a Dataset (root, train, download, transform); Iterating and Visualizing; Creating a Custom Dataset (__init__, __len__, __getitem__ with decode_image); Preparing your data with DataLoaders (batch_size, shuffle); Iterate through the DataLoader (batch shapes [64, 1, 28, 28], Samplers link).
2. [Transforms: v2 pipeline and Lambda label encoding](https://docs.pytorch.org/tutorials/beginner/basics/transforms_tutorial.html) (PyTorch - Learn the Basics) - ToImage() and ToDtype() with scale=True; Lambda Transforms with one_hot labels.
3. [Reproducibility: DataLoader worker seeding](https://docs.pytorch.org/docs/stable/notes/randomness.html) (PyTorch - Autograd mechanics, serialization and reproducibility) - DataLoader section (per-worker reseeding, worker_init_fn with torch.initial_seed, generator seeding). Depth: Read only the DataLoader section here; the nondeterminism catalog belongs to the checkpoint unit.

**Focus**

- Dataset answers one sample; DataLoader answers one batch. Custom datasets implement exactly init, len and getitem.
- Default collate stacks equal-shape samples. Ragged samples need a custom collate_fn; no loader pads for you.
- shuffle reorders per epoch through the sampler. Workers are subprocesses: each gets a derived seed, and main-process state is not shared with them.
- Device transfer is the loop's job. Batches arrive on CPU; .to(device) returns the moved copy.

**Reproduce:** From a blank file, write a CSVDataset over (path, label) rows with a transform arg, wrap it in a DataLoader with batch 8, shuffle and 2 workers, and print one batch's shapes. Then add a worker_init_fn that prints each worker seed and show the seeds differ.

**Traps**

- Mutating the dataset object in the main process after iteration starts and expecting workers to see it. Workers hold their own copies; non-persistent workers pick up the change only when the next epoch recreates them.
- Creating an RNG object such as np.random.default_rng(0) in the Dataset __init__. Every worker gets an identical copy, so all workers draw the same augmentation stream. The global random, torch and NumPy generators are already reseeded per worker; a private generator must be reseeded in worker_init_fn from torch.initial_seed().
- Leaving device transfer implicit. The tutorial batch is CPU [64, 1, 28, 28]; the model page moves inputs explicitly, and .to() must be assigned.

**Practice**

- [Learn PyTorch 03: MNIST loading, visualization and DataLoaders (tasks 5 to 13)](https://www.learnpytorch.io/03_pytorch_computer_vision) - Exercises, tasks 5 to 13: load torchvision MNIST train and test, visualize samples, DataLoader with batch_size=32, TinyVGG adaptation, CPU versus GPU timing, predictions, confusion matrix, Conv2d kernel-size probe, FashionMNIST error plots. Skip tasks 1 to 4 (industry prose and overfitting definitions). Tasks 5 to 7 are the loader core; tasks 8 to 13 rehearse the loop of the next unit and can wait for it.

**Stop when:** Your CSVDataset loader prints correct batch shapes with 2 workers, worker seeds differ on purpose, and a ragged input fails loudly until your collate_fn handles it.

<details>
<summary>Self-test</summary>

1. What three methods must a custom Dataset implement, and what does each promise?
   - init (runs once, stores paths, labels, transforms), len (sample count), getitem (loads and returns sample idx as a tensor tuple).
2. A DataLoader with two workers is created after torch.manual_seed(0). Do the workers draw identical augmentations, and does the next run repeat this one?
   - The workers differ: each seeds torch and random with base_seed + worker_id and NumPy with a state derived from both. The run repeats: base_seed comes from the main process RNG, or from the generator you pass, which the seed fixes.
3. A batch of variable-length sequences hits the default collate. What happens?
   - It fails. Default collate stacks equal shapes; ragged input needs a custom collate_fn with explicit padding.
4. The loader yields CPU batches and the model sits on CUDA. What is missing?
   - An explicit transfer: inputs = inputs.to(device), using the return value, before the forward call.

</details>

#### U7. Explicit training and evaluation loops with correct metrics

**About 4 h** · **Target:** Implement + Measure

Topics: Explicit train_one_epoch and evaluate loops; Metric aggregation and reduction correctness

The loop is where grad state, eval state and metrics meet. A wrong reduction here fakes every comparison the rest of the stage makes.

**You can now**

- Write train and test loops with train and eval modes, no_grad evaluation, zeroing, backward and step in the right order.
- Aggregate loss and accuracy with stated reduction and sample weighting, and catch batch-mean versus sample-mean drift.
- Drive a loop to a stated gate (moons accuracy, workflow regression) and read its loss and accuracy printouts.

**Study**

1. [Optimizing Model Parameters: train_loop and test_loop](https://docs.pytorch.org/tutorials/beginner/basics/optimization_tutorial.html) (PyTorch - Learn the Basics) - Hyperparameters (epochs, batch size, learning rate); Loss Function (CrossEntropyLoss over logits); Optimizer (zero_grad, backward, step); Full Implementation (train_loop with model.train, test_loop with model.eval and no_grad, accuracy accumulation).

**Focus**

- train_loop sets model.train() and test_loop sets model.eval() with no_grad. The comments call both best practice even where the tiny net needs neither.
- Zero before backward each iteration (or right after step, every iteration). step() applies whatever sits in .grad, including stale values.
- The tutorial test_loss divides by batch count, which weights batches equally. With an uneven tail batch that differs from the sample mean; correct over size is exact.
- CrossEntropyLoss takes raw logits and reduces by mean over the batch. Changing batch size changes the noise of that mean, not its expectation.

**Reproduce:** From memory, write train and test loops with sample-weighted loss and accuracy, train the Learn PyTorch 01 workflow model, and reach its task gates. Then show the tutorial test_loop loss and your sample-weighted loss differ on an uneven tail batch.

**Traps**

- Averaging per-batch losses with equal weights and calling it the epoch loss. Short tail batches then count as much as full ones.
- Evaluating without model.eval(). Dropout keeps dropping units, so evaluation becomes random, and BatchNorm normalizes with test-batch statistics while updating its running buffers on test data.
- Logging loss.item() but stepping on a different loss. The printed number and the backward graph must come from the same tensor.

**Practice**

- [Learn PyTorch 01: SGD training loop and test plots (tasks 1 to 4)](https://www.learnpytorch.io/01_pytorch_workflow) - Exercises, tasks 1 to 4: straight-line dataset, L1Loss with SGD for 300 epochs testing every 20, test predictions with plots. Keep the loop explicit: no high-level trainer. Record the exact reduction of every logged number.
- [Learn PyTorch 02: moons classifier loop above 96 percent (tasks 1 to 4)](https://www.learnpytorch.io/02_pytorch_classification) - Exercises, tasks 1 to 4: make_moons split, nonlinear nn.Module, binary loss and optimizer, train and test loop past 96 percent accuracy with prints every 10 epochs. Stop at task 4 for this unit. Task 6 (pure-PyTorch tanh) belongs to the backward unit; tasks 5 to 7 are the stretch goals.

**Stop when:** Both loops run from memory, every logged number states its reduction, and the moons run passes 96 percent with a sample-weighted loss you can defend.

<details>
<summary>Self-test</summary>

1. Test set 10000, batch 64. The tutorial reports test_loss /= num_batches. What does that number weight equally?
   - Batches: 156 full plus one tail batch of 16. The tail batch counts as much as any full batch, so the figure is a batch mean, not the sample mean.
2. Where must zero_grad sit relative to backward and step, and what breaks if it is missing?
   - Every iteration, before backward (or right after step). Without it, .grad accumulates across batches and step() applies stale plus fresh gradients together.
3. test_loop wraps evaluation in no_grad but the tutorial also sets model.eval(). What does each contribute?
   - eval() switches Dropout and BatchNorm to evaluation behavior. no_grad() skips graph recording, saving memory and compute.
4. Your evaluation loop uses CrossEntropyLoss with reduction="mean" per batch. How do you report the exact per-sample mean loss over the test set?
   - Accumulate loss.item() times the batch size (or use reduction="sum") and divide the total by the number of samples, not by the number of batches.

</details>

#### U8. Checkpoints, configuration and reproducibility

**About 5 h** · **Target:** Implement + Measure

Topics: Checkpointing model, optimizer, scheduler and scaler state; Configuration, data position and random generator state; Reproducibility claims across CPU, GPU and data workers

An experiment you cannot resume is an anecdote. Checkpoints plus config plus seeds turn a run into evidence you can re-enter.

**You can now**

- Save and restore model, optimizer, scheduler, epoch and RNG state, and state the resume tolerance you actually tested.
- Record hyperparameters, data position and generator state so a resumed run continues the same stream, not a similar one.
- Draw the reproducibility boundary: what matches bitwise, what matches statistically, and what never matches across CPU, GPU and workers.

**Study**

1. [Saving and Loading Models: state_dict, checkpoints, devices](https://docs.pytorch.org/tutorials/beginner/saving_loading_models.html) (PyTorch - Autograd mechanics, serialization and reproducibility) - What is a state_dict (model and optimizer dicts); Saving and Loading Model for Inference (Save and Load state_dict, model.eval); Saving and Loading a General Checkpoint for Inference and/or Resuming Training (epoch, model and optimizer state, loss); Saving and Loading Model Across Devices (map_location, DataParallel module prefix). Depth: Skip Saving an Exported Program, Saving Multiple Models in One File and Warmstarting. The deprecated general-checkpoint recipe redirects to this page.
2. [Automatic Mixed Precision recipe: saving and resuming the GradScaler](https://docs.pytorch.org/tutorials/recipes/recipes/amp_recipe.html#saving-resuming) (PyTorch Automatic Mixed Precision recipe - Saving/Resuming) - Saving/Resuming: the scaler state_dict saved beside model and optimizer, when to save it, and resuming across runs with and without AMP.
3. [Reproducibility: randomness control and nondeterminism limits](https://docs.pytorch.org/docs/stable/notes/randomness.html) (PyTorch - Autograd mechanics, serialization and reproducibility) - Reproducibility intro (no cross-release, cross-platform or CPU-versus-GPU guarantee); Controlling sources of randomness (manual_seed, Python and NumPy seeds, cudnn benchmark); Avoiding nondeterministic algorithms (use_deterministic_algorithms, uninitialized memory); DataLoader (worker_init_fn, generator). Depth: Read the section intros and the DataLoader part fully. Skim the per-op catalog (convolution, SDPA backends, RNN); the boundary table is the assignment, not every kernel.

**Focus**

- A resume checkpoint holds model, optimizer and scheduler state, the GradScaler state when you train with AMP, the epoch and step, and the RNG states. Model weights alone restart the model but not the training.
- Config means every number that changes the stream: hyperparameters, data order and position, transform versions, worker count and seeds. Log them with the checkpoint.
- Identical seeds do not promise identical results across releases, platforms, or CPU versus GPU. Promise bitwise match only inside one tested configuration.
- Deterministic flags trade speed for repeatability and can throw on ops without a deterministic path. cudnn benchmark selection is itself a randomness source.

**Reproduce:** Interrupt a small training run mid-schedule, restart the process, reload the full checkpoint, and show the next-epoch loss matches an uninterrupted run within your stated tolerance. Then list what your checkpoint deliberately excludes.

**Traps**

- Saving model.state_dict() and calling it a training checkpoint. Without optimizer, scheduler, epoch and RNG state, resume restarts the optimization, not the run.
- Pickling the whole model and loading it with the default weights_only=True. Since PyTorch 2.6 that default refuses arbitrary pickled objects, and weights_only=False runs pickle, which can execute code. Save state_dicts, and load untrusted files only with weights_only=True.
- Claiming GPU determinism from a CPU test. Nondeterministic kernels, benchmark selection and worker seeding each break the claim independently.

**Practice**

- [Learn PyTorch 01 task 5: save, reload and verify predictions](https://www.learnpytorch.io/01_pytorch_workflow) - Exercises, task 5: save state_dict, reload into a new instance, verify predictions match. Extend it: add optimizer state, epoch and torch, Python and NumPy RNG states, then run the interrupted-versus-uninterrupted resume comparison from Reproduce.
- [Learn PyTorch 05: scripted training with argparse config (tasks 1 to 3)](https://www.learnpytorch.io/05_pytorch_going_modular) - Exercises, tasks 1 to 3: get_data.py with existing-data check, train.py with argparse for data dirs, lr, batch size, epochs and hidden units, predict.py that loads the saved model. Treat the argparse flags plus seeds as the config record. A run whose flags are not logged does not count as reproduced.

**Stop when:** An interrupted and an uninterrupted run agree within your written tolerance, and your config log plus boundary statement say exactly what would break that agreement.

<details>
<summary>Self-test</summary>

1. The resumed weights give the same validation loss as the uninterrupted run at the checkpoint, yet the training curves split within a few updates. Name three state items that could be missing.
   - Optimizer state such as momentum or Adam moments, scheduler state (so the learning rate is wrong), and the RNG and data-order state (different shuffles and dropout masks). None of them changes the loss of the saved weights.
2. Same seed, same code, CPU run matches but GPU run differs in the last decimals. Is anything wrong?
   - Not necessarily. The note disclaims CPU-versus-GPU bitwise match; different kernels accumulate floating point in different orders.
3. use_deterministic_algorithms(True) throws on your model. What does that tell you, and what is the cost of obeying it?
   - One op has no deterministic implementation. Obeying it means replacing the op or staying nondeterministic; deterministic paths are also usually slower.
4. A DataParallel checkpoint loads with missing-key errors on a single-GPU model. What happened?
   - The keys carry the module. prefix from DataParallel. Save model.module.state_dict() for device flexibility, or strip the prefix on load.

</details>

### Mini-project: Minimal PyTorch trainer with owned state

**About 8 to 12 hours.** Write a small trainer in plain PyTorch, with no high-level training framework, for one compact model and dataset. Every piece of state is explicit, checkpointed and tested: data order, parameters, optimizer, scheduler, random number generators and metrics.

1. Define one config object for data, model, optimizer, scheduler, seed and paths, and log it with a hash at the start of every run.
2. Build the Dataset and DataLoader with a seeded generator and a worker_init_fn, and record split provenance (indices or file hashes) so train, validation and test can be rebuilt exactly.
3. Write explicit train and eval loops: switch train() and eval(), evaluate under torch.no_grad(), place zero_grad deliberately, and accumulate metrics by sample count rather than averaging per batch.
4. Add one custom autograd Function, such as a scaled tanh or a clamp with a straight-through gradient, and pass torch.autograd.gradcheck in float64.
5. Checkpoint model, optimizer, scheduler, epoch, step, RNG states and data-order state. Resume from disk mid-run and compare with an uninterrupted run under a stated tolerance.
6. Reduce one view or in-place autograd failure to a minimal script, such as an in-place edit of a tensor saved for backward, repair it, and keep the script as a regression test.

**Deliverables**

- The trainer package: config, data, model, loops and checkpointing.
- Tests: gradcheck for the custom Function, resume equivalence, metric aggregation with an uneven last batch, and the in-place regression script.
- A state inventory: every piece of state the run owns, where it lives, and whether the checkpoint restores it.

**Checks**

- rubric: Self-grade with the rubric below.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Owned state | The inventory lists model, optimizer, scheduler, RNG, data order and metrics, and the checkpoint restores each one. | A test drops each item from the checkpoint in turn and shows which resume check then fails. |
| Resume | Resume from disk matches the uninterrupted run within a stated tolerance. | On CPU it matches exactly, and you name the settings that relies on, such as deterministic algorithms, worker count and generator state. |
| Evaluation correctness | Evaluation runs in eval mode under no_grad, and metrics weight by sample count. | A test with an uneven last batch shows a per-batch average differs while your metric does not. |
| Custom Function | gradcheck passes in float64. | You also break the backward on purpose and show gradcheck catches it. |
| Autograd failure | One minimal failing script, its repair and a regression test. | You name the version-counter or view rule involved and show a second variant that fails at a different point, at the edit or at backward. |

Feeds into: Capstone artifact 2, the reproducible training run: this trainer runs the model from section 4, 6 or 7.

### Resource route

- **Primary - Course:** [PyTorch - Learn the Basics](https://docs.pytorch.org/tutorials/beginner/basics/) - Complete Tensors, Datasets and DataLoaders, Transforms, Build Model, Autograd, Optimization, and Save and Load Model. Rebuild each essential example in a small src package instead of retaining a tutorial notebook.
- **Required - Reference:** [PyTorch - Autograd mechanics, serialization and reproducibility](https://docs.pytorch.org/docs/stable/notes/autograd.html) - Read Autograd mechanics, Serialization semantics and Reproducibility. Test leaf behavior, saved tensors, grad modes, state dictionaries and the exact tolerance promised by one interrupted and resumed run.
- **Required - Practice:** [Learn PyTorch - selected framework exercises](https://www.learnpytorch.io/) - Complete exercise 00, tasks 1-5 in 01, tasks 1-7 in 02, tasks 5-13 in 03, tasks 1-3 in 05, and exercises 1-2 in 07. Recreate solutions independently and verify behavior against current official docs.
- **Support - Implementation:** [Deep Learning with PyTorch, 2nd edition companion code - framework foundations](https://github.com/deep-learning-with-pytorch/dlwpt-code-2e) - Use the Chapter 3, 5 and 6 notebooks when tensor storage, autograd or module ownership needs a second implementation. Inspect the Chapter 4 and 7 code only for a diagnosed data-representation or loading gap.
- **Optional - Practice:** [TensorTonic - PyTorch Sheet](https://www.tensortonic.com/problems) - If access is available, select Tensor Factory, Shape Manipulation, Basic Autograd, Custom Linear Layer, Mini Training, Custom Dataset and Balanced DataLoader. Do not treat the 30-problem sheet as required completion.
- **Optional - Practice:** [NeetCode ML - PyTorch closing drills](https://neetcode.io/practice/machine-learning) - After the module gate, solve Pytorch Basics, Layer Normalization, Batch Normalization and RMS Normalization cold. Explain shapes, state and train-evaluation behavior aloud. These do not replace the package and resume test.
- **Reference - Reference:** [PyTorch Automatic Mixed Precision recipe - Saving/Resuming](https://docs.pytorch.org/tutorials/recipes/recipes/amp_recipe.html#saving-resuming) - Read the Saving/Resuming section: save scaler.state_dict() with the model and optimizer state, at the start of an iteration or after scaler.update(), and how to resume with or without AMP.

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

### Study units

#### U1. Initialization and signal scale across depth

**About 4 h** · **Target:** Derive + Measure

Topics: Xavier and Kaiming initialization; Activation and gradient scale across depth

Every later unit assumes signals survive the forward and backward pass. Wrong scale fails silently as flat or exploding loss, and no optimizer setting repairs it.

**You can now**

- Derive the He variance 2/fan-in for ReLU layers from variance propagation, and state the Xavier form for symmetric activations.
- Predict whether activations and gradients shrink or grow across depth for a stated initialization scale.
- Measure per-layer activation and gradient norms in a deep MLP and name the failing regime.

**Study**

1. [Parameter initialization (derivation)](https://udlbook.github.io/udlbook/) (Understanding Deep Learning - fitting, gradients and regularization) - Chapter 7, Section 7.5 through 7.5.3 (pp. 107 to 111): forward variance, backward variance and the 4/(fan-in + fan-out) compromise.
2. [Numerical stability, symmetry breaking and Xavier](https://d2l.ai/chapter_multilayer-perceptrons/numerical-stability-and-init.html#sec-numerical-stability) (D2L - optimization and regularization slice) - Vanishing and Exploding Gradients, Breaking the Symmetry, Parameter Initialization and Xavier Initialization; Summary.

**Focus**

- ReLU keeps about half of symmetric inputs, so E[h^2] is half the pre-activation variance. That half is where the factor 2 in He comes from.
- Xavier balances fan-in against fan-out for the near-linear regime. UDL's compromise averages the two He conditions; it is not the classic tanh Xavier formula.
- Constant initialization never breaks symmetry: identical weights give identical gradients, so units update identically forever. Randomness must differ across units, not just across layers.
- Variance preservation is an expectation over random draws. One unlucky draw still skews a narrow layer, so width matters alongside scale.

**Reproduce:** Closed-book, derive sigma^2 = 2/fan-in for a ReLU layer from mean-zero pre-activations and E[h^2] = Var(f)/2. Then push a batch through a 50-layer, width-100 ReLU MLP at weight variances 0.001, 0.02 and 1.0 and log the mean squared pre-activation per layer. Expect 0.001 to collapse toward zero, 1.0 to overflow, and 0.02 (the He value) to stay within about an order of magnitude of its start; single draws drift, so try a few seeds.

**Traps**

- Using Xavier variance for ReLU layers. Without the factor 2 the forward variance halves each layer; use He for ReLU and Xavier-style 1/fan forms for tanh or sigmoid.
- Reading UDL equation 7.34 as classic Xavier. It averages the forward and backward He conditions for ReLU, 4/(fan-in + fan-out); the chapter Notes (p. 113) say Glorot or Xavier initialization ignores the ReLU and so differs by a factor of two.
- Concluding stability from one seed. Variance statements are expectations, so rerun narrow layers with fresh draws before trusting a scale.

**Practice**

- [D2L Numerical Stability and Initialization: Exercises](https://d2l.ai/chapter_multilayer-perceptrons/numerical-stability-and-init.html) - Exercises: the symmetry-breaking, constant-init and eigenvalue questions

**Stop when:** You derive 2/fan-in without notes, and your probe shows collapse below the He value, overflow above it, and bounded drift at it across a few seeds.

<details>
<summary>Self-test</summary>

1. A ReLU layer has fan-in 200. What weight variance preserves activation scale, and why 2 and not 1?
   - 2/200 = 0.01. The ReLU clips about half of symmetric pre-activations to zero, halving E[h^2]; the 2 compensates that half.
2. Tanh layer, fan-in 256, fan-out 128. Give the D2L Xavier uniform bound.
   - Uniform U(-sqrt(6/384), sqrt(6/384)) = U(-0.125, 0.125), since 6/(256+128) = 1/64.
3. All weights in an MLP layer are initialized to the same constant. What happens?
   - Every unit computes the same forward value and receives the same gradient, so they update identically forever. Symmetry never breaks; use independent random draws.
4. Init variance is far too large. Which two signatures do you expect forward and backward?
   - Pre-activation magnitudes grow with depth until floating point saturates, and gradient norms grow backward through the same products. Both come from multiplying by large weights at every layer.

</details>

#### U2. Dead, saturated and exploding units, and residual paths

**About 4 h** · **Target:** Explain + Measure

Topics: Dead, saturated, vanishing and exploding units; Residual paths and gradient flow

Most failed runs show one of four signatures. Reading the signature decides whether to change the activation, the scale, the depth structure or the evaluation mode.

**You can now**

- Distinguish dead, saturated, vanishing and exploding regimes from activation histograms and gradient norms.
- Explain how residual identity paths change the gradient product and which failure they leave in place.
- Predict train-time versus test-time behavior differences caused by batch statistics.

**Study**

1. [Vanishing and exploding gradients (problem setup)](https://udlbook.github.io/udlbook/) (Understanding Deep Learning - fitting, gradients and regularization) - Chapter 7, Section 7.5 opening (pp. 107 to 108): small versus large init variance and the vanishing and exploding gradient problem.
2. [Vanishing and exploding gradients, activations](https://d2l.ai/chapter_multilayer-perceptrons/numerical-stability-and-init.html#sec-numerical-stability) (D2L - optimization and regularization slice) - Vanishing and Exploding Gradients: the matrix-product gradient form, sigmoid tails versus ReLU, and Breaking the Symmetry.
3. [Residual blocks and batch normalization](https://udlbook.github.io/udlbook/) (Understanding Deep Learning - fitting, gradients and regularization) - Chapter 11, Sections 11.2 through 11.4 (pp. 189 to 194): residual connections and gradient paths, exploding variance in residual nets, and batch normalization training statistics. Depth: Stop at Section 11.4. Skip the architecture catalog in 11.5 and later.

**Focus**

- Sigmoid derivatives peak at 0.25 and decay to zero at both tails; tanh peaks at 1 but still decays. Products of many such terms vanish, while ReLU passes 1 on its active side and 0 elsewhere.
- A residual block outputs x + f(x), so its gradient is I plus residual terms. The identity term gives every layer a direct path, but He init still doubles per-block variance, which is why these nets pair residuals with normalization.
- Dead ReLU units output zero and pass zero gradient for all negative inputs. A large negative bias update can silence a unit for the rest of training.
- Batch normalization uses batch statistics during training and frozen statistics at test time. A train and eval gap with normalization present points at state handling before architecture.

**Reproduce:** Closed-book, write a two-block residual unrolling x2 = x0 + f1(x0) + f2(x0 + f1(x0)) and its gradient with respect to x0, and circle the identity term that survives even if both residual Jacobians vanish.

**Traps**

- Calling any flat loss a vanishing-gradient problem. Dead units, saturated outputs, too-small learning rates and broken objectives all flatten curves; check gradient norms before renaming the failure.
- Believing residuals remove all scale problems. UDL Section 11.3 shows per-block variance still doubles under He init; residuals fix paths while normalization fixes scale.
- Testing with training-mode normalization or dropout and reporting the gap as overfitting. Set eval mode first, then compare.

**Practice**

- [D2L LeNet with Batch Normalization: learning-rate robustness](https://d2l.ai/chapter_convolutional-modern/batch-norm.html) - LeNet with Batch Normalization; Exercises: the learning-rate comparison and failure-point questions

**Stop when:** You classify a dead, a saturated and an exploding layer from histograms and gradient norms alone, and you write the residual gradient with its identity term without notes.

<details>
<summary>Self-test</summary>

1. In a 10-layer sigmoid MLP, gradient norms shrink by about 0.2 per layer. Where does a factor near 0.2 come from, and what does it do over 10 layers?
   - Each layer multiplies the gradient by its weights and by a sigmoid derivative of at most 0.25. Ten factors near 0.2 give about 0.2^10, roughly 1e-7, so early layers barely learn.
2. Half the ReLUs in a layer output zero on every training example and their weights never change. Dead or saturated, and why stuck?
   - Dead. Their pre-activations are negative on every example, so the ReLU derivative is zero and no gradient reaches their incoming weights or bias. They recover only if earlier layers happen to shift their inputs.
3. Why does x + f(x) train deeper than f(x) alone, in one gradient sentence?
   - Its Jacobian is I plus df/dx, so the gradient contains an identity term that reaches early layers directly instead of only through products of small or unstable Jacobians.
4. Training accuracy is 95 percent and evaluation accuracy 70 percent, with batch normalization and dropout. Name the first two checks.
   - First, confirm evaluation runs in eval mode (model.eval(): no dropout, running statistics). Second, measure training accuracy the same way, in eval mode on a training subset, because the logged training number came from train mode. Only a gap that survives both is overfitting.

</details>

#### U3. Batch, layer, group and RMS normalization

**About 3 h** · **Target:** Derive + Implement

Topics: Batch, layer, group and RMS normalization axes

Normalization decides which axes share statistics and whether evaluation depends on the batch. The wrong choice breaks single-example prediction or leaks batch mates into each output.

**You can now**

- Derive the normalized output, parameter count and normalized axes for batch, layer, group and RMS normalization.
- Implement layer normalization from tensor ops and match the reference on random input.
- Predict when batch statistics help, hurt or break, and choose the matching normalization.

**Study**

1. [Batch, layer and prediction behavior](https://d2l.ai/chapter_convolutional-modern/batch-norm.html#batch-normalization-layers) (D2L - optimization and regularization slice) - Batch Normalization Layers (fully connected and convolutional), Layer Normalization, and Batch Normalization During Prediction.
2. [Batch normalization (equations and behavior)](https://udlbook.github.io/udlbook/) (Understanding Deep Learning - fitting, gradients and regularization) - Chapter 11, Section 11.4 (pp. 192 to 194): batch equations, train versus test statistics, and costs with benefits.
3. [Group normalization axes](https://docs.pytorch.org/docs/stable/generated/torch.nn.GroupNorm.html) (PyTorch GroupNorm reference) - GroupNorm page: channel grouping, normalized axes and the affine parameters.
4. [RMS normalization formula](https://docs.pytorch.org/docs/stable/generated/torch.nn.RMSNorm.html) (PyTorch RMSNorm reference) - RMSNorm page: RMS formula, normalized_shape axes, and absent centering.

**Focus**

- Batch norm normalizes each channel over batch and spatial axes with learned per-channel scale and shift. One example's training output depends on the other batch members.
- Layer norm normalizes one example over its features with no running statistics, so train and test match. Group norm sits between: G channel groups per example, with G = C giving per-channel behavior.
- RMS norm drops mean centering and bias and scales by the root mean square only. Fewer statistics, same axis argument.
- PyTorch tracks batch statistics as exponential running averages during training. D2L's full-dataset recomputation after training describes the goal, not the implementation.

**Reproduce:** Closed-book, implement layer normalization for a (batch, features) input from sums only. Then compute batch norm by hand for values [0, 2, 4] with unit scale, zero shift and zero epsilon: outputs -1.225, 0 and 1.225.

**Traps**

- Normalizing with batch statistics at test time. Eval must use the tracked running statistics; with a batch of one, a fully connected batch-norm layer would map every feature to its shift parameter.
- Keeping a bias right before batch normalization. Batch norm subtracts the per-channel batch mean, which removes any per-channel constant, so that bias is redundant (a D2L exercise asks this). Before layer norm a per-feature bias is not fully removed, because layer norm subtracts one mean across features.
- Treating RMS norm as layer norm without bias. It also removes mean centering, so a large constant offset passes through scaled but unshifted.

**Practice**

- [D2L Batch Normalization from Scratch and Concise implementation](https://d2l.ai/chapter_convolutional-modern/batch-norm.html#implementation-from-scratch) - Implementation from Scratch and Concise Implementation: build batch norm, match the concise layer, and answer the bias-removal exercise

**Stop when:** Your from-scratch layer norm matches the framework output on random input, and you state each method's axes and eval behavior without notes.

<details>
<summary>Self-test</summary>

1. Batch values [0, 2, 4], gamma 1, beta 0, epsilon 0. What are the normalized outputs?
   - Mean 2, variance 8/3, std 1.633. Outputs (-2/1.633, 0, 2/1.633) = (-1.225, 0, 1.225).
2. Conv input (N, C, H, W). Which axes does batch norm use per channel, and why does batch size 1 still work?
   - Batch, height and width. Even one image supplies H times W values per channel, so mean and variance are defined. Fully connected batch norm has only the batch axis and degenerates at batch size 1.
3. Group norm with G = 1 versus G = C on one example. What does each compute?
   - G = 1 normalizes all channels and spatial positions jointly with one mean and variance. G = C normalizes each channel separately, which is per-channel instance behavior.
4. RMS norm input [3, 4], gamma 1. What is the output?
   - RMS = sqrt((9+16)/2) = 3.536. Outputs (0.849, 1.131). No centering is applied.

</details>

#### U4. Regularization: dropout, label smoothing, augmentation and weight decay

**About 4 h** · **Target:** Explain + Derive

Topics: Dropout, label smoothing and data augmentation; Weight decay versus an L2 penalty

Regularization trades training fit for held-out behavior. Each method changes a different part of the objective or the data, and conflating them leads to double-counted or cancelled effects.

**You can now**

- Derive the SGD weight-decay update from the L2-penalized objective and state exactly where the Adam equivalence breaks.
- Explain dropout scaling, label-smoothing targets and augmentation policy as separate generalization levers.
- Choose which parameters escape decay and defend the choice.

**Study**

1. [Explicit and implicit regularization](https://udlbook.github.io/udlbook/) (Understanding Deep Learning - fitting, gradients and regularization) - Chapter 9, Sections 9.1 through 9.2 (pp. 138 to 143): L2 regularization and implicit regularization in gradient descent and SGD.
2. [Dropout, label smoothing and augmentation](https://udlbook.github.io/udlbook/) (Understanding Deep Learning - fitting, gradients and regularization) - Chapter 9, Sections 9.3.3, 9.3.4 and 9.3.8 (pp. 147 to 154): dropout, applying noise with label smoothing, and augmentation. Depth: Read Sections 9.3.3, 9.3.4 and 9.3.8 only. Skip Bayesian inference, transfer learning and self-supervised learning.
3. [Dropout scaling and behavior](https://d2l.ai/chapter_multilayer-perceptrons/dropout.html#sec-dropout) (D2L - optimization and regularization slice) - Dropout in Practice and Implementation from Scratch: inverted scaling and the train and eval split.
4. [Weight decay under SGD](https://d2l.ai/chapter_linear-regression/weight-decay.html#sec-weight-decay) (D2L - optimization and regularization slice) - Norms and Weight Decay and Implementation from Scratch: penalized objective, SGD shrinkage update, and bias exclusion.
5. [Decoupled weight decay](https://docs.pytorch.org/docs/stable/generated/torch.optim.AdamW.html) (PyTorch torch.optim.AdamW reference) - AdamW algorithm box: the decoupled decay line and its defaults.

**Focus**

- L2 adds (lambda/2)||w||^2 to the loss, and SGD turns it into per-step shrinkage (1 - eta*lambda). The 1/2 cancels the square's derivative.
- Adam normalizes the whole gradient, L2 term included, by its adaptive denominator, so the penalty no longer shrinks weights by a fixed fraction. AdamW applies the shrinkage outside the adaptive update.
- Inverted dropout divides kept activations by (1-p) during training, so test time needs no scaling and the expectation stays exact.
- Label smoothing replaces hard targets with a blend of the true class and uniform. Augmentation enlarges the data, but its transforms must not change the label.

**Reproduce:** Closed-book, derive w <- (1 - eta*lambda)w - eta*grad from the penalized loss. Then write the AdamW two-line update, decoupled decay plus bias-corrected adaptive step, and state the default decay 0.01.

**Traps**

- Adding L2 to Adam and calling it weight decay. The adaptive denominator rescales the penalty per coordinate; use the optimizer's decoupled decay instead.
- Decaying biases and normalization scales by default. They hold offsets, not feature weights; D2L excludes the bias from the penalty, and the same argument covers normalization scales.
- Reading UDL's implicit-regularization equations as exact. The modified loss is a first-order approximation in the step size; it explains tendencies, not exact trajectories.

**Practice**

- [D2L Dropout: Exercises](https://d2l.ai/chapter_multilayer-perceptrons/dropout.html) - Exercises: layer-probability swaps, the dropout versus no-dropout comparison, activation variance plots, and the dropout plus weight-decay interaction
- [D2L Weight Decay: Exercises](https://d2l.ai/chapter_linear-regression/weight-decay.html) - Exercises: the lambda sweep on training and validation accuracy and the validation-optimum question

**Stop when:** You write both the SGD shrinkage update and the AdamW decoupled update without notes, and your lambda sweep on the D2L regression task shows training loss rising with lambda while validation loss first falls, then rises.

<details>
<summary>Self-test</summary>

1. Loss L(w) plus (lambda/2)||w||^2 under SGD with step eta. What is the update?
   - w <- w - eta*(grad + lambda*w) = (1 - eta*lambda)*w - eta*grad.
2. Why does the same penalty fail to shrink weights by a fixed fraction under Adam?
   - Adam divides the total gradient, penalty included, by sqrt(v) + eps. The penalty's effect is rescaled per coordinate by gradient history instead of applying a fixed (1 - eta*lambda) factor.
3. Dropout p 0.3, activation 10. What values can the next layer see during training, and what is the mean?
   - 0 with probability 0.3, or 10/0.7 = 14.29 with probability 0.7. Mean 0.7 times 14.29 = 10.
4. 10 classes, smoothing 0.1. What target values do the true class and each other class get?
   - True class 0.9 + 0.1/10 = 0.91; each other class 0.01.

</details>

#### U5. Optimizers from SGD to AdamW

**About 5 h** · **Target:** Derive + Implement

Topics: SGD, momentum and Nesterov intuition; AdaGrad and RMSProp recognition and failure regimes; Adam and AdamW state and update equations

The optimizer is the difference between a loss that falls and one that stalls or explodes. Its state also persists across restarts, so a wrong mental model corrupts both training and resume.

**You can now**

- Write the SGD, heavy-ball momentum, Nesterov, AdaGrad, RMSProp, Adam and AdamW updates with their state.
- Derive the effective step of momentum and the bias correction of Adam.
- Implement momentum and AdamW from primitives and match reference trajectories on a quadratic.

**Study**

1. [Optimizers from GD to Adam](https://udlbook.github.io/udlbook/) (Understanding Deep Learning - fitting, gradients and regularization) - Chapter 6, Sections 6.1 through 6.4 (pp. 77 to 90): gradient descent, SGD, momentum with Nesterov, and Adam with bias correction.
2. [Momentum (heavy-ball form)](https://d2l.ai/chapter_optimization/momentum.html#sec-momentum) (D2L - optimization and regularization slice) - The Momentum Method and Effective Sample Weight: heavy-ball update and the eta/(1-beta) effective step; Theoretical Analysis.
3. [AdaGrad recognition and failure regime](https://d2l.ai/chapter_optimization/adagrad.html#sec-adagrad) (D2L - optimization and regularization slice) - Sparse Features, Preconditioning and The Algorithm: accumulating denominator and its decay.
4. [RMSProp recognition and failure regime](https://d2l.ai/chapter_optimization/rmsprop.html#sec-rmsprop) (D2L - optimization and regularization slice) - The Algorithm: leaking average fix for the unbounded denominator.
5. [Adam with bias correction](https://d2l.ai/chapter_optimization/adam.html#sec-adam) (D2L - optimization and regularization slice) - The Algorithm and Yogi: bias correction and the divergence fix.
6. [AdamW state and update equations](https://docs.pytorch.org/docs/stable/generated/torch.optim.AdamW.html) (PyTorch torch.optim.AdamW reference) - AdamW algorithm box: decoupled decay step, moments, corrections and defaults.

**Focus**

- UDL writes momentum as an exponential average of gradients, while D2L and PyTorch use heavy-ball v <- beta*v + g. Same direction, different scale: heavy-ball steps larger by 1/(1-beta).
- AdaGrad divides by the root of all past squared gradients, so its steps decay toward zero even far from the optimum on dense problems. RMSProp's leaking average keeps the denominator current.
- Adam debiases both moments because zero initialization drags early averages toward zero. For beta1 = 0.9 the correction fades within a few dozen steps; for beta2 = 0.999 it still multiplies v by about 10 at step 100 (1 - 0.999^100 is about 0.095) and fades only after a few thousand steps.
- AdamW applies weight decay before the adaptive step, outside m and v. The decay rate then means the same thing at every coordinate regardless of gradient scale.

**Reproduce:** Closed-book, run one Adam step on scalar gradient 2 with eta 0.001, betas (0.9, 0.999) and eps 1e-8: m 0.2, v 0.004, corrected 2 and 4, update 0.001. Then state the general first-step rule: about eta times the sign of the gradient.

**Traps**

- Mixing UDL and PyTorch momentum hyperparameters. Beta 0.9 means an effective step 10 times larger under heavy-ball than under UDL's averaged form at the same eta.
- Carrying a learning rate between SGD and Adam. Adam moves each coordinate by about lr regardless of gradient scale, while an SGD step scales with the gradient, so a good SGD rate says nothing about a good Adam rate.
- Tuning Adam's weight_decay as if it were L2 strength. In plain Adam the penalty enters the moments; switch to AdamW for decoupled meaning.

**Practice**

- [Deep-ML 169: Implement AdamW Optimizer Step](https://www.deep-ml.com/problems/169) - Problem 169: implement the decoupled AdamW step; cross-check the decay placement against the PyTorch AdamW reference. Free in the browser. This is the section's single Deep-ML drill; use changed constants and verify the decay sits outside the moments.
- [D2L Adam: Exercises](https://d2l.ai/chapter_optimization/adam.html#sec-adam) - Exercises: the bias-correction-free rewrite and the Adam-diverges and Yogi-converges case

**Stop when:** Your from-scratch momentum and AdamW match the framework step for step on a quadratic, and you convert a beta between UDL and heavy-ball forms without notes.

<details>
<summary>Self-test</summary>

1. Heavy-ball momentum beta 0.9, eta 0.1, constant gradient g. What is the steady-state step?
   - v settles at g/(1-0.9) = 10g, so the step is 0.1 times 10g = g. The effective learning rate is 10 times the nominal one.
2. Why does AdaGrad stall on dense deep-learning objectives, and what does RMSProp change?
   - Its denominator sums every past squared gradient and grows without bound, driving per-coordinate rates toward zero. RMSProp replaces the sum with a leaking average at gamma 0.9, so old gradients stop counting.
3. Adam's first step on gradient 2 with default betas and eta 0.001 is about 0.001 regardless of gradient size. Show why.
   - m1 = 0.1 times 2 = 0.2, v1 = 0.001 times 4 = 0.004; corrected m = 2, v = 4; update 0.001 times 2/(2+eps), about 0.001. Debiasing restores the gradient scale, so the step is eta times the sign.
4. AdamW weight_decay 0.01, lr 0.001. How much does a weight of 0.5 shrink per step from decay alone?
   - theta <- theta - 0.001 times 0.01 times 0.5 = 0.5 - 0.000005. The shrinkage is proportional to the weight and independent of gradient history.

</details>

#### U6. Schedules, gradient accumulation and clipping

**About 4 h** · **Target:** Implement + Measure

Topics: Warmup, cosine schedules and schedule order; Gradient accumulation and effective batch size; Gradient clipping by global norm; Learning-rate range tests

Schedules, batch size and clipping jointly set the update scale. Each one silently changes what the learning rate means, so they must be reasoned about as one mechanism.

**You can now**

- Implement linear warmup followed by cosine decay with the scheduler stepped in the right order.
- Implement gradient accumulation that matches a full-batch gradient up to floating-point order, and state the effective batch size.
- Apply global-norm clipping after unscaling in mixed precision, and run an LR range test to set bounds.

**Study**

1. [Schedules and warmup](https://d2l.ai/chapter_optimization/lr-scheduler.html#sec-scheduler) (D2L - optimization and regularization slice) - Schedulers and Policies: factor, multi-factor, cosine with formula, and warmup.
2. [Gradient clipping by global norm](https://d2l.ai/chapter_recurrent-neural-networks/rnn-scratch.html#gradient-clipping) (D2L - optimization and regularization slice) - Gradient Clipping: Lipschitz bound, the min(1, theta/||g||) projection, and its limits. Depth: Read the Gradient Clipping section only. Skip the RNN implementation around it.
3. [Clip API semantics](https://docs.pytorch.org/docs/stable/generated/torch.nn.utils.clip_grad_norm_.html) (PyTorch - optimization and automatic mixed precision examples) - clip_grad_norm_ page: global-norm definition over concatenated per-parameter norms, in-place edit, returned total norm, error_if_nonfinite.
4. [Scaler order with clipping](https://docs.pytorch.org/tutorials/recipes/recipes/amp_recipe.html) (PyTorch - optimization and automatic mixed precision examples) - Adding GradScaler and Inspecting/modifying gradients: autocast forward, scale, backward, unscale, clip, step, update, zero_grad.
5. [LR range test](https://arxiv.org/abs/1506.01186) (Cyclical Learning Rates for Training Neural Networks (Smith, 2017)) - Abstract and range-test description: linearly increasing the rate for a few epochs to read reasonable bounds.

**Focus**

- Cosine decay sets eta_t from a closed form with fixed T. Stepping the scheduler per step versus per epoch changes the curve, so record which one the code does.
- Accumulation adds K microbatch gradients and steps once. Scaling each microbatch's mean loss by 1/K reproduces the full-batch mean gradient when the microbatches are equal in size and nothing updates between them. Batch-norm statistics and dropout masks still differ, and the summation order changes, so agreement is to floating-point tolerance.
- Scaled gradients must be unscaled before clipping. Clipping scaled values applies the threshold in the wrong units; the recipe unscales first so max_norm keeps its unscaled meaning.
- The range test raises the rate linearly and reads bounds off the loss: flat start, steady fall, then divergence. It sets a search interval, not an optimum.

**Reproduce:** Closed-book, write the cosine formula and evaluate it at halfway: eta0 0.3, etaT 0.01, T 20, t 10 gives 0.155. Write the clipping rescale min(1, theta/||g||) and apply it to per-param norms 3 and 4 with theta 1: total 5, scale 0.2. Write the accumulation average that reproduces a batch-32 mean from four microbatches of 8.

**Traps**

- Calling scheduler.step() before optimizer.step(). PyTorch warns because the first scheduled rate is skipped; assert the rate used on step one. Forgetting zero_grad at the start of each accumulation cycle silently adds the previous cycle's gradients.
- Claiming accumulation equals large-batch training. Batch-norm running statistics update per microbatch and dropout draws differ, so the match is statistical, not bitwise.
- Treating warmup as a universal fix. The Tuning Playbook shows instabilities that need clipping or architecture change; warmup only shortens the risky early phase.

**Practice**

- [TensorTonic: Gradient Accumulation Equivalence](https://www.tensortonic.com/study-plans/language-modeling-from-scratch/cs336-l02-gradient-accumulation-step) - Prompt cs336-l02-gradient-accumulation-step: solve the accumulation prompt, then reconcile microbatch count, reduction and step timing against a local full-batch reference within floating-point tolerance. Account required.
- [D2L Learning-Rate Scheduling: Exercises](https://d2l.ai/chapter_optimization/lr-scheduler.html#sec-scheduler) - Exercises 1 and 4 (best fixed-rate model, warmup length); run the cosine comparison of exercise 3 on Fashion-MNIST instead of ImageNet

**Stop when:** Your accumulated run matches the full-batch gradient within floating-point tolerance, your clipped AMP order passes the unscale check, and your range test names defensible bounds.

<details>
<summary>Self-test</summary>

1. Cosine schedule eta0 0.3, etaT 0.01, T 20. What is eta at t 10 and t 20?
   - eta_t = 0.01 + 0.145*(1+cos(pi*t/20)). At t=10, cos(pi/2)=0, eta=0.155. At t=20, cos(pi)=-1, eta=0.01.
2. Four microbatches of 8 with mean-reduced losses give microbatch gradients a, b, c and d. What update matches batch-32 SGD, and when does it fail to match?
   - One optimizer step along (a + b + c + d)/4. It fails if you add the four gradients without dividing by 4 (a step 4 times too large), if the microbatches differ in size, or if state such as batch-norm statistics updates per microbatch.
3. Where does clipping go in a GradScaler step, and what breaks if it moves before unscaling?
   - After scaler.unscale_ and before scaler.step. Before unscaling, gradients carry the dynamic scale factor, so a fixed max_norm threshold means something different every iteration.
4. Range-test loss falls slowly, then steeply, then explodes. How do you read it?
   - The flat start is below the useful range, the steep fall is the usable interval, and the explosion is the ceiling. Search between the fall and below the ceiling; the test gives bounds, not the best rate.

</details>

#### U7. Objective checks, tiny-set overfit and shuffled-label controls

**About 3 h** · **Target:** Implement + Measure

Topics: Objective target shapes, masks, weights and reductions; Tiny-set overfit and shuffled-label controls

A failing run is usually a broken objective before it is a broken optimizer. Shape, mask and reduction bugs change the loss silently, and the two controls separate them from optimization failures in minutes.

**You can now**

- Derive per-position cross-entropy with class weights, ignore_index masks and mean versus sum reduction.
- Run single-batch overfit and shuffled-label controls and state what each outcome proves about capacity, optimization and data.

**Study**

1. [Loss construction from likelihood](https://udlbook.github.io/udlbook/) (Understanding Deep Learning - fitting, gradients and regularization) - Chapter 5: Maximum likelihood (5.1), Recipe for constructing loss functions (5.2) and multiclass classification (5.5).
2. [Target shapes, masks, weights and reductions](https://docs.pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html) (PyTorch CrossEntropyLoss reference) - Shape, Parameters (weight, ignore_index, reduction, label_smoothing) and both Examples.
3. [Random-label fitting evidence](https://udlbook.github.io/udlbook/) (Understanding Deep Learning - fitting, gradients and regularization) - Section 8.4 with 15 percent randomized labels, and Chapter 20, Section 20.2.1: fitting random pixels and labels as capacity evidence.
4. [Overfit, underfit and selection](https://d2l.ai/chapter_linear-regression/generalization.html#underfitting-or-overfitting) (D2L - optimization and regularization slice) - Underfitting or Overfitting and Model Selection: capacity versus error and cross-validation discipline.

**Focus**

- Mean reduction divides by the number of non-ignored positions, or by the sum of their weights when weight is set, not by the batch size. Averaging per-batch means with different valid counts weights tokens unequally; accumulate sums and counts instead.
- ignore_index removes padding from both loss and gradient but keeps the positions in the tensor. Weight rescales classes for imbalance; neither fixes mislabeled data.
- Single-batch overfit that fails proves an optimization or capacity bug, not a data bug: the model cannot fit even a handful of examples.
- Shuffle the training labels only. On held-out data the shuffled run must score at chance; anything above chance means leakage between splits or an evaluation bug. On training data a large model can still memorize shuffled labels, more slowly than true ones, so a true-label run that trains no faster than the shuffled one is not using the signal.

**Reproduce:** Closed-book, compute cross-entropy for logits [[2, 1, 0], [1, 2, 0]] with targets [0, -100] under ignore_index -100 and mean reduction: 0.408. Then write the two controls with their pass and fail readings.

**Traps**

- Dividing a masked loss by the batch size or sequence length. PyTorch divides by the valid count (the sum of valid weights); a hand-written mask that sums and divides by the full size shrinks the loss and its gradient as padding grows.
- Expecting a shuffled-label run to fail to fit the training set. Overparameterized nets memorize random labels (UDL 20.2.1); the readings that matter are chance-level held-out accuracy and slower fitting than with true labels.
- Comparing cross-entropy values across different reductions or target sets as quality scores. Mean versus sum differ by the denominator, and different targets differ in what they average over.

**Practice**

- [PyTorch CrossEntropyLoss doc examples, extended](https://docs.pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html) - Examples with class indices and class probabilities; extend the first with ignore_index and weight and check the denominator by hand
- [D2L Generalization: Exercises](https://d2l.ai/chapter_linear-regression/generalization.html) - Exercises: the zero-training-error question and the cross-validation questions

**Stop when:** Your hand-computed masked loss matches the framework to three decimals, and both controls give the predicted reading on a broken and a healthy run.

<details>
<summary>Self-test</summary>

1. Logits [[2, 1, 0], [1, 2, 0]], targets [0, -100], ignore_index -100, mean reduction. What is the loss?
   - The second position is ignored. First position: softmax gives p0 = e^2/(e^2+e+1) = 0.665, loss -ln(0.665) = 0.408. Mean over one valid position: 0.408.
2. Single-batch overfit stalls at high loss. What is ruled out, and what remains?
   - Data scale, label noise and evaluation protocol are ruled out as the blocker. What remains is capacity, objective wiring, or optimization: learning rate, initialization or gradient flow.
3. Shuffled-label training reaches near-zero loss but true-label training does not generalize. What does the control prove?
   - It proves the model and optimizer can fit arbitrary patterns, so capacity and optimization work. The true-label failure is about signal: features, labels or leakage, not fitting power.
4. A shuffled-label run scores 30 percent held-out accuracy on a balanced 10-class task. What does that mean?
   - Chance is 10 percent, so something leaks: duplicates across splits, labels recoverable from features such as file names or order, or an evaluation bug. Find it before trusting any true-label number.
5. Class weight 5.0 on the rare class under mean reduction. How does one rare example count?
   - Its unreduced loss is multiplied by 5 and the mean divides by the sum of valid weights, so it pulls the average five times harder than an unweighted example.

</details>

#### U8. Diagnosing failed runs: divergence, stale state, slices and seeds

**About 5 h** · **Target:** Measure

Topics: Nonlearning, divergence, NaN and Inf diagnosis; Train-evaluation mismatch and stale state; Learning curves, per-slice errors and seed variation

Loss curves alone never name the broken mechanism. Diagnosis is a designed experiment per failure, and this unit turns the section checkpoint into a repeatable drill.

**You can now**

- Localize flat, diverging, NaN and eval-gap failures to objective, optimization, state or data causes using competing controls.
- Instrument the first invalid value and per-slice errors, and report seed variation instead of single-run conclusions.
- Repair a failing compact run, add a regression test, and defend the configuration with measured evidence.

**Study**

1. [Error sources and learning curves](https://udlbook.github.io/udlbook/) (Understanding Deep Learning - fitting, gradients and regularization) - Chapter 8, Sections 8.1 through 8.3 (pp. 118 to 126): training a simple model, sources of error, and reducing error. Depth: Read Sections 8.1 through 8.3. Skip double descent in 8.4 here.
2. [Overfitting, interpolation and early stopping](https://d2l.ai/chapter_multilayer-perceptrons/generalization-deep.html#early-stopping) (D2L - optimization and regularization slice) - Revisiting Overfitting and Regularization, Early Stopping, and Classical Regularization Methods for Deep Networks.
3. [Debugging optimization failures](https://github.com/google-research/tuning_playbook#how-can-optimization-failures-be-debugged-and-mitigated) (Deep Learning Tuning Playbook FAQ: debugging optimization failures) - FAQ How can optimization failures be debugged and mitigated: Identifying unstable workloads, Potential fixes, Learning rate warmup, Gradient clipping.
4. [Train and eval state revisited](https://d2l.ai/chapter_convolutional-modern/batch-norm.html#batch-normalization-during-prediction) (D2L - optimization and regularization slice) - Batch Normalization During Prediction and Dropout in Practice, revisited with a stale-state lens: frozen statistics, eval mode, and what a mode gap proves.

**Focus**

- Flat from the start means no learning signal: check objective wiring and LR scale before touching the architecture. Diverging or NaN means too much update: halve the LR, enable clipping, then bisect to the first invalid op.
- An eval gap that vanishes in eval mode was stale state, not overfitting. Compare modes before comparing curves.
- Aggregate metrics hide slice failures. Cut errors by source, length or class, and rerun the fix on a second seed; one seed proves nothing about stability.
- Patience-based early stopping needs a no-improvement threshold and a fixed budget. Without both, stopping decisions are hindsight.

**Reproduce:** Closed-book, write the five-branch drill: flat, diverging, NaN or Inf, eval gap, noisy plateau. For each, name the first measurement, the control that splits two causes, and the fix you try first.

**Traps**

- Reading any falling training loss as progress. Memorization falls too; only held-out slices and controls tell fitting from learning.
- Fixing NaN by switching to float64 or adding an epsilon somewhere. Either can hide the first invalid op; find it first, then decide between learning rate, clipping, initialization and objective order.
- Reporting the best of many seeds as the result. Report the spread across at least two seeds, with the same seeds for the baseline and the fix, before claiming a fix.

**Practice**

- The section mini-project covers this: fault-injection diagnosis of a failing compact run with regression tests across two seeds.

**Stop when:** Given a fresh failing run, you name the branch, run its control, repair it and show the fix holding on a second seed.

<details>
<summary>Self-test</summary>

1. Loss is exactly flat from step 0 with a nonzero learning rate. Name three causes and the two measurements that split them.
   - Gradients are zero (broken or detached graph, dead units); gradients are nonzero but parameters do not move (optimizer built on other parameters, zero_grad between backward and step, a missing step); or parameters move but the loss ignores them (loss computed from a detached tensor or from the targets). Log the gradient norm and the parameter-update norm per step.
2. Loss explodes to NaN at step 200 after falling. What is the ordered response?
   - Halve the LR and rerun to test update scale; enable global-norm clipping; log the first step whose activations or gradients go non-finite and inspect that op's inputs. Change one thing per rerun.
3. Eval error exceeds train error only when dropout and batch norm are in training mode. Diagnosis?
   - Stale evaluation state, not overfitting. Eval must use frozen statistics with dropout off; the gap measures mode mismatch until modes are fixed.
4. A fix works on seed 0 but fails on seed 1. What do you conclude and what next?
   - The fix is not established; seed variation dominates. Rerun both configs on at least two more seeds and compare means and spreads before keeping it.

</details>

### Mini-project: Seeded-fault diagnosis of a compact run

**About 10 to 14 hours.** Instrument a small MLP or CNN trained with your section 2 trainer, inject faults you do not choose yourself, and diagnose each with a discriminating control, a repair, a regression test and evidence across two seeds. Finish by defending one configuration with measurements.

1. Instrument the run: per-layer activation mean and std, dead or saturated fractions, gradient norms, update-to-weight ratios, loss, and train and validation metrics, logged per step.
2. Run the controls first and keep them as tests: overfit one fixed batch to near-zero loss, and train on shuffled labels until training accuracy rises while held-out accuracy stays at chance.
3. Write a fault script that applies one of at least six faults chosen from a seed and writes the choice to a file you open only after committing your diagnosis. Include a softmax before CrossEntropyLoss, a missing zero_grad, eval mode left on, a learning rate 100 times too high, a bad initialization scale and validation data passed through training augmentation.
4. Diagnose three injected faults. For each, write rival hypotheses first, run one control that separates them, repair, and add a regression test that fails on the fault and passes on the repair.
5. Compare SGD with momentum and AdamW with decoupled weight decay at matched budgets, with warmup, a cosine schedule and gradient clipping, across two seeds.
6. Check gradient accumulation: k micro-batches of size b match one batch of size k times b within tolerance for a model without batch normalization or dropout, and show what breaks when the loss is not divided by k.

**Deliverables**

- The instrumented trainer, the control tests and the fault script.
- Three postmortems, each with symptom, rival hypotheses, discriminating control, repair, regression test and one limitation.
- A configuration defense: two-seed curves with activation, gradient, update and validation evidence for the chosen optimizer and schedule.

**Checks**

- rubric: Self-grade with the rubric below.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Controls | The fixed batch reaches near-zero loss, and shuffled labels leave held-out accuracy at chance. | Both run as automated tests in under a minute on a CPU. |
| Diagnosis | Each of three faults is found with a stated discriminating control. | Each postmortem names at least two rival hypotheses and shows why the control separates them. |
| Regression guards | Each repair has a test that fails on the fault. | The tests run on both seeds and check a mechanism, such as a norm, a mode flag or a reduction, not only the final loss. |
| Configuration evidence | Two seeds for the chosen configuration, with activation, gradient and update statistics. | Update-to-weight ratios and the validation gap support the chosen learning rate and decay against one rejected alternative. |
| Accumulation | Accumulated gradients match the large batch within tolerance. | You also show the mismatch caused by an undivided loss and explain why batch normalization breaks exact equivalence. |

Feeds into: Capstone artifact 3, the diagnosis and profile casebook: the objective or data postmortem and the numerical or state postmortem can come from here.

### Resource route

- **Primary - Theory:** [Understanding Deep Learning - fitting, gradients and regularization](https://udlbook.github.io/udlbook/) - Use Chapters 6-9 and targeted parts of Chapter 20 for optimization, initialization, measurement, regularization and why training works. Re-derive the update rules you keep in the trainer.
- **Required - Implementation:** [D2L - optimization and regularization slice](https://d2l.ai/) - Use MLP implementation, dropout, deep generalization, numerical stability, optimization introduction, SGD, minibatch SGD, momentum, AdaGrad, RMSProp, Adam and learning-rate scheduler. Implement momentum, AdamW, initialization, dropout, one normalization, clipping and one schedule.
- **Reference - Reference:** [PyTorch - optimization and automatic mixed precision examples](https://docs.pytorch.org/tutorials/recipes/recipes/amp_recipe.html) - Check optimizer, scheduler, gradient clipping and AMP API semantics. Preserve the correct order for zeroing, scaling, backward, unscaling, clipping, stepping and updating.
- **Support - Practice:** [TensorTonic - Gradient Accumulation Equivalence](https://www.tensortonic.com/study-plans/language-modeling-from-scratch) - Solve this one named prompt after implementing accumulation locally. Reconcile reduction, microbatch count, step timing and numerical tolerance with a full-batch reference.
- **Optional - Practice:** [Deep-ML candidate - optimization and normalization problems](https://www.deep-ml.com/problems) - After the platform admission check, use at most one of 146 Momentum, 169 AdamW, 197 Global-Norm Clipping, 109 LayerNorm or 115 BatchNorm as a changed-prompt drill.
- **Reference - Reference:** [PyTorch GroupNorm reference](https://docs.pytorch.org/docs/stable/generated/torch.nn.GroupNorm.html) - Read how input channels are split into num_groups groups and which axes each group normalizes; compare num_groups 1 against num_channels.
- **Reference - Reference:** [PyTorch RMSNorm reference](https://docs.pytorch.org/docs/stable/generated/torch.nn.RMSNorm.html) - Read the RMS formula and which axes normalized_shape covers; note the missing mean centering and bias.
- **Reference - Reference:** [PyTorch torch.optim.AdamW reference](https://docs.pytorch.org/docs/stable/generated/torch.optim.AdamW.html) - Read the AdamW algorithm box for the decoupled weight-decay step, the bias-corrected moments and the defaults, and follow the Decoupled Weight Decay Regularization link for the argument.
- **Reference - Reference:** [PyTorch CrossEntropyLoss reference](https://docs.pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html) - Read Shape, Parameters (weight, ignore_index, reduction, label_smoothing) and both Examples; extend the class-index example with ignore_index and a class weight.
- **Reference - Reference:** [Cyclical Learning Rates for Training Neural Networks (Smith, 2017)](https://arxiv.org/abs/1506.01186) - Read the abstract and the range test: increase the rate linearly for a few epochs and read usable bounds off the loss curve.
- **Reference - Reference:** [Deep Learning Tuning Playbook FAQ: debugging optimization failures](https://github.com/google-research/tuning_playbook) - Read How can optimization failures be debugged and mitigated (identifying unstable workloads, warmup, clipping) and Batch normalization implementation details.

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

### Study units

#### U1. Convolution shapes: channels, padding, stride, dilation and groups

**About 5 h** · **Target:** Derive + Implement

Topics: Convolution kernels, channels and output shapes; Padding, stride, dilation and groups

Every CNN bug report starts with a shape mismatch. Channels, padding and groups decide tensor layout before any learning happens.

**You can now**

- Derive output shapes with padding, stride, dilation and groups, including the effective kernel size d(k-1)+1.
- State the weight layout (C_out, C_in/G, kH, kW) and count parameters for plain, grouped and depthwise cases.
- Implement cross-correlation from loops and match a framework Conv2d on shapes and values.

**Study**

1. [Cross-correlation, kernels and the feature map](https://d2l.ai/chapter_convolutional-neural-networks/conv-layer.html) (D2L - convolutional and recurrent architecture route) - Section 7.2: The Cross-Correlation Operation (corr2d from scratch), Convolutional Layers (the Conv2D class), Object Edge Detection in Images, Learning a Kernel, and Cross-Correlation and Convolution.
2. [Padding and stride shapes](https://d2l.ai/chapter_convolutional-neural-networks/padding-and-strides.html) (D2L - convolutional and recurrent architecture route) - Sections 7.3.1 and 7.3.2: the padding formula (7.3.1), the stride formula (7.3.2), and the comp_conv2d shape demos including kernel (3, 5) with padding (0, 1) and stride (3, 4).
3. [Channels and 1x1 convolutions](https://d2l.ai/chapter_convolutional-neural-networks/channels.html) (D2L - convolutional and recurrent architecture route) - Section 7.4: multiple input channels, multiple output channels, and 1x1 convolutions with the reshape-plus-matmul check. Depth: Skip the ResNeXt preview at the end. Grouped cost returns through the PyTorch reference below.
4. [Stride, dilation and channels](https://udlbook.github.io/udlbook/) (Understanding Deep Learning - convolution and residual networks) - Chapter 10, Sections 10.2.3 to 10.2.5 (pp. 164 to 165): stride, kernel size, dilation rate as zeros-plus-one, and channel counts Ci by Co by K.
5. [The exact shape and groups contract](https://docs.pytorch.org/docs/stable/generated/torch.nn.Conv2d.html) (PyTorch nn.Conv2d reference) - Signature and Shape: the floor formula with dilation, the groups divisibility rule with the groups=2 and depthwise examples, and the Variables weight shape.

**Focus**

- Deep-learning convolution is cross-correlation with no kernel flip. A learned kernel absorbs the flip, so the distinction changes nothing in a trained layer.
- Output size per axis is floor((n + 2p - d(k-1) - 1)/s + 1). With odd k and matching same padding each output centers on its input pixel.
- Groups split channels into G independent convolutions. Parameters and multiply-adds fall by G, while output shape is unchanged. Groups equal to C_in is depthwise convolution.
- A 1x1 convolution is a per-pixel linear map across channels. Stacked 1x1 layers need a nonlinearity between them or they fold into one linear map.

**Reproduce:** Closed-book, derive that Conv2d(3, 64, k=7, s=2, p=3) on 224x224 gives 112x112 with 9,472 parameters. Then implement corr2d from loops and match torch.nn.Conv2d values on a 5x5 input.

**Traps**

- Counting padding once in the formula. D2L and PyTorch p means padding on both sides, so the total added rows are 2p.
- Assuming groups change the output shape. Groups change only the weight layout and the cost, not H_out or W_out.
- Reading convolution as flipped correlation and hand-flipping a learned kernel before reuse. Export the kernel as is.

**Practice**

- [CS231n Assignment 2 Q3: convolution layers in ConvolutionalNetworks.ipynb](https://cs231n.github.io/assignments2025/assignment2) - Q3: Convolutional Neural Networks, ConvolutionalNetworks.ipynb in the starter code (https://cs231n.github.io/assignments/2026/assignment2.zip): Convolution: Naive Forward Pass and Naive Backward Pass. Each cell compares your output with expected values or numerical gradients through rel_error.. Gradescope is for enrolled students; the notebook checks are the gate. Expect relative errors around 1e-8 or smaller.

**Stop when:** Your loop corr2d matches Conv2d values, and you derive grouped and dilated shapes without notes.

<details>
<summary>Self-test</summary>

1. 3x3 input, 2x2 kernel, no padding, stride 1. What is the output shape and why?
   - 2x2. The 2-wide window fits 3 - 2 + 1 = 2 times per axis; without padding a k-wide kernel loses k - 1 positions per axis.
2. Conv2d(32, 32, k=3, groups=8). What is the weight shape and the parameter count with bias?
   - (32, 4, 3, 3): 32 times 4 times 9 equals 1,152 weights plus 32 biases, or 1,184. The dense version needs 9,216 weights plus 32 biases.
3. Kernel size 3 with dilation 2. What is the effective kernel size and what does it buy?
   - 5, from d(k-1)+1. A 3x3 kernel with dilation 2 sees a 5x5 window with 9 weights per channel pair, at the multiply-add cost of an ordinary 3x3 kernel.
4. Two stacked 1x1 convolutions with no nonlinearity between them. What is the problem?
   - They compose into a single linear map. Keep a 1x1 layer only with a nonlinearity or normalization separating it from the next linear map.

</details>

#### U2. Pooling, transposed convolution, receptive fields and cost

**About 4 h** · **Target:** Derive

Topics: Pooling and transposed convolution at recognition depth; Receptive fields, parameters, FLOPs and activation memory

Resolution sets both what a unit can see and what training costs. A receptive field smaller than the object and an activation bill larger than memory fail the same run.

**You can now**

- Derive receptive-field growth across stride, kernel and dilation choices.
- Count parameters, multiply-adds and activation bytes for a stated conv stack.
- Explain transposed convolution as learned upsampling and state when it is not an inverse.

**Study**

1. [Pooling from scratch](https://d2l.ai/chapter_convolutional-neural-networks/pooling.html) (D2L - convolutional and recurrent architecture route) - Section 7.5: Maximum and Average Pooling (pool2d from scratch), Padding and Stride, and Multiple Channels.
2. [Transposed convolution](https://d2l.ai/chapter_computer-vision/transposed-conv.html) (D2L - convolutional and recurrent architecture route) - Sections 14.10.1 and 14.10.2: Basic Operation and Padding, Strides, and Multiple Channels, including Connection to Matrix Transposition.
3. [Receptive fields, downsampling and upsampling](https://udlbook.github.io/udlbook/) (Understanding Deep Learning - convolution and residual networks) - Chapter 10, Sections 10.2.6 and 10.4 (pp. 167 to 174): receptive fields with Figure 10.6, and downsampling plus upsampling with Figures 10.11 to 10.13. Depth: Skip Section 10.5 Applications. Detection and segmentation are later topics.

**Focus**

- Receptive field grows by (k-1) times the product of earlier strides per layer. Stride-2 downsampling doubles the growth rate while quartering activations.
- One conv layer holds C_out times (C_in/G) times kH times kW weights plus C_out biases, and costs about twice that many FLOPs per output position for the multiply-add.
- Pooling has no parameters, acts per channel, and 2x2 stride-2 pooling quarters resolution. Max-pooling gives limited shift tolerance inside a window, not invariance.
- A transposed convolution applies the transpose of a downsampling weight matrix. It learns an upsampling and is not an inverse of any forward convolution.

**Reproduce:** Closed-book, compute for a 56x56x64 input with Conv2d(64, 128, k=3, s=1, p=1): output 56x56x128, 73,856 parameters, about 4.6e8 FLOPs, and about 1.6 MB of float32 output activations. Then grow the receptive field through two more k=3 s=1 layers to 7.

**Traps**

- Quoting parameter counts as cost. FLOPs and activations scale with resolution, so doubling both sides quadruples both.
- Calling transposed convolution an inverse by name. It shares only the naming pattern, so its outputs need their own checks.
- Treating the receptive-field formula as uniform coverage. Center pixels feed more paths than edge pixels, so the formula gives the maximum extent.

**Practice**

- [UDL Chapter 10 Problems 10.8, 10.9, 10.11 and 10.14: channel counts and receptive fields](https://udlbook.github.io/udlbook/) - Problems (pp. 184 to 185): 10.8 (two-layer channel counts), 10.9 (three k=3 layers), 10.11 (receptive field with a stride-2 layer) and 10.14 (5x5 kernel, 3 to 10 channels). Solve on paper against the weight-shape formula before checking the section text.

**Stop when:** Your hand counts match the weight-shape formula on a new layer, and a shifted-input probe shows exactly which pooling outputs move.

<details>
<summary>Self-test</summary>

1. Three k=3 s=1 layers on a 1D input. What is the receptive-field size?
   - 7: 1 plus 3 times 2. Each k=3 layer adds 2 to the extent at stride 1.
2. Stride-2 pooling quarters the positions. Why does it not quarter the compute of the next stage?
   - Networks usually double the channels after downsampling. Convolution cost scales with positions times C_in times C_out, so doubling both channel counts restores the FLOPs exactly, while activation memory only halves.
3. Does a transposed convolution invert the convolution with the same weights?
   - No. It applies the transposed weight matrix with its own learned weights, so equal shape back does not mean equal values.
4. 2x2 stride-2 max-pooling. Which input shifts leave the output unchanged?
   - A shift by 2 pixels shifts the output by one cell (equivariance on the coarse grid). A one-pixel shift leaves an output unchanged only when that window's maximum stays inside the window, which depends on the data; test with a shifted copy.

</details>

#### U3. Equivariance, residual CNN blocks and resolution cost

**About 5 h** · **Target:** Explain + Measure

Topics: Translation equivariance and its limits; Residual blocks, normalization and initialization in CNNs; Augmentation and resolution-driven cost

Residual structure and augmentation decide whether a deeper or larger-input model trains at all. Equivariance claims decide whether it should have been a CNN in the first place.

**You can now**

- Explain what translation equivariance promises and name three mechanisms that break it: stride, pooling and padding boundaries.
- Explain the residual unraveled-path view and why identity paths stabilize deep CNNs.
- Measure resolution-driven time and memory across two input sizes and attribute the change.

**Study**

1. [Why convolution: invariance and locality](https://d2l.ai/chapter_convolutional-neural-networks/why-conv.html) (D2L - convolutional and recurrent architecture route) - Sections 7.1.1 to 7.1.4: Invariance, Constraining the MLP with translation invariance and locality, and Convolutions. Depth: Skim the Channels section. Channel mechanics belong to the first unit.
2. [Residual blocks and ResNet](https://d2l.ai/chapter_convolutional-modern/resnet.html) (D2L - convolutional and recurrent architecture route) - Sections 8.6.1 to 8.6.3: Function Classes with nested sets, Residual Blocks, and the ResNet Model stem plus four stages. Depth: Skim ResNeXt and Training. You train your own small net in practice below.
3. [Equivariance, residual paths and normalization](https://udlbook.github.io/udlbook/) (Understanding Deep Learning - convolution and residual networks) - Chapter 10, Section 10.1 (p. 161) and Chapter 11, Sections 11.2 to 11.4 (pp. 189 to 193): equivariance versus invariance, residual blocks and operation order, exploding variance and batch normalization. Depth: Skip Section 11.5 architectures and Section 10.5 applications. DenseNet, U-Net, detection and segmentation are later topics.
4. [Image augmentation methods](https://d2l.ai/chapter_computer-vision/image-augmentation.html) (D2L - convolutional and recurrent architecture route) - Section 14.1: Common Image Augmentation Methods with flipping, cropping and color changes.

**Focus**

- Convolution is equivariant to translation in the interior. Stride, pooling and zero-padded borders break exact equivariance, and pooling trades it for local tolerance.
- Zero padding leaks absolute position. The network can learn where the whitespace border is.
- A residual block fits the difference from identity, so pushing branch weights toward zero recovers a shallower net. The unraveled sum gives 2^K paths for K blocks.
- Each residual addition grows activation variance under standard initialization. Per-channel batch normalization, or branch rescaling, keeps the forward stable.

**Reproduce:** Closed-book, sketch why the ResNet stem maps 224 to 56x56x64: 7x7 s2 p3 gives 112, then 3x3 max-pool s2 p1 gives 56. State the test-time batch-norm rule: use the running statistics accumulated during training, so no output depends on the rest of the batch.

**Traps**

- Calling CNNs translation invariant. Convolutions are approximately equivariant; invariance comes from pooling, above all global pooling before the classifier.
- Leaving batch normalization in training mode at test time. Small or single-example batches then rescale outputs with batch noise.
- Reading higher resolution as free accuracy. Activations and per-layer FLOPs grow about fourfold when both sides double, so measure before committing.

**Practice**

- [CS231n Assignment 2 Q4: train a convnet on CIFAR-10 in PyTorch](https://cs231n.github.io/assignments2025/assignment2) - Q4: PyTorch on CIFAR-10, PyTorch.ipynb in the starter code (https://cs231n.github.io/assignments/2026/assignment2.zip): design and train a convolutional network on CIFAR-10.. Gradescope is for enrolled students; your own held-out accuracy is the gate. Log time and peak memory at two input resolutions and attribute the change before tuning accuracy.
- [CS231n Assignment 2 Q1: batch and layer normalization](https://cs231n.github.io/assignments2025/assignment2) - Q1: Batch Normalization, BatchNormalization.ipynb in the starter code (https://cs231n.github.io/assignments/2026/assignment2.zip): batch and layer normalization forward and backward, checked with rel_error against numerical gradients.

**Stop when:** You can break and repair equivariance with shift probes, and a two-resolution timing run attributes time and memory changes to resolution.

<details>
<summary>Self-test</summary>

1. Stride-2 convolution on an input shifted by one pixel. Does the output shift by half a pixel?
   - No. Outputs live on the subsampled grid, so a one-pixel input shift can change which inputs each output sees. Exact equivariance fails under stride.
2. Why can a deeper ResNet train when a deeper plain net degrades?
   - Each block can push its branch to zero and pass identity through, so the deeper net contains the shallower one. Plain stacks must fit identity through nonlinear layers.
3. Batch normalization left in training mode at test time with batch size 1. What breaks?
   - Statistics come from that one example (over its spatial positions in a conv layer), so the layer acts like instance normalization: outputs depend on the example's own contrast instead of the training distribution, and the running buffers get overwritten with test data. Use eval mode.
4. Random cropping as augmentation. What is the failure mode to guard against?
   - A crop that removes the object teaches guessing from background. Keep crops large relative to the object and compare against a no-augmentation baseline.

</details>

#### U4. Recurrent cells, unrolling and backpropagation through time

**About 5 h** · **Target:** Derive + Implement

Topics: Vanilla recurrent cells and sequence unrolling; Backpropagation through time and truncated BPTT

Unrolling turns a loop into a deep shared-weight network. BPTT is backprop on that unrolled graph, and truncation decides which dependencies the gradient can ever see.

**You can now**

- Unroll a vanilla RNN cell and derive its per-step shapes and shared-parameter count.
- Derive BPTT as chained Jacobian products and state what truncating at tau keeps and drops.
- Implement an RNN language model from tensor ops with gradient clipping and train it below uniform perplexity.

**Study**

1. [The recurrent cell and its unrolling](https://d2l.ai/chapter_recurrent-neural-networks/rnn.html) (D2L - convolutional and recurrent architecture route) - Recurrent Neural Networks with Hidden States (the H_t recurrence and parameter sharing) and RNN-Based Character-Level Language Models.
2. [Scratch RNN with clipping and decoding](https://d2l.ai/chapter_recurrent-neural-networks/rnn-scratch.html) (D2L - convolutional and recurrent architecture route) - The RNN Model from scratch, One-Hot Encoding, Gradient Clipping with the min(1, theta/||g||) rule, Training, and Decoding with warm-up prefix.
3. [Backpropagation through time and truncation](https://d2l.ai/chapter_recurrent-neural-networks/bptt.html) (D2L - convolutional and recurrent architecture route) - Analysis of Gradients (full computation with the chained sum, regular truncation at tau, randomized truncation) and Backprop Through Time in Detail (the W_qh, W_hx and W_hh gradient sums).

**Focus**

- H_t = phi(X_t W_xh + H_{t-1} W_hh + b_h) reuses the same three matrices every step. Sequence length adds depth, not parameters.
- BPTT sums per-step losses whose gradients chain products of hidden Jacobians. Regular truncation at tau drops all paths longer than tau and biases long-dependency learning.
- Clip by global norm g <- min(1, theta/||g||) g after unrolling. It bounds the step, not the Jacobian product, so it treats explosion, not vanishing.
- Detaching the hidden state between batches stops gradients but keeps the values. Truncated BPTT still learns only within-segment dependencies.

**Reproduce:** Closed-book, write the H_t and O_t equations with shapes for the D2L character vocabulary of 28 tokens, hidden size 32 and batch 4, and derive dL/dW_hh as the chained sum. Then train the scratch RNN on The Time Machine to a perplexity well below 28, the value of uniform guessing.

**Traps**

- Averaging the loss over time and thinking truncation is then unbiased. Truncation drops long paths whatever the reduction.
- Carrying hidden state across batches and calling it full BPTT. Values carry but gradients do not unless the graph does.
- Clipping to fix non-learning from vanishing. Clipping only caps large steps, so vanishing needs architecture or objective changes.

**Practice**

- [Deep-ML 62: Implement a Simple RNN with Backpropagation Through Time (BPTT)](https://www.deep-ml.com/problems/62) - The RNN forward pass and BPTT gradient in NumPy. The page checks the solution against test cases in the browser.. Free in the browser. Do it after the D2L scratch model so the changed prompt tests understanding, not recall.

**Stop when:** Your scratch RNN trains below uniform perplexity, Deep-ML 62 passes, and you can state which dependencies your tau can and cannot learn.

<details>
<summary>Self-test</summary>

1. T=100, hidden 32. How many W_hh matrices does the unrolled graph hold?
   - One shared (32, 32) matrix. Unrolling copies the use, not the parameters, and gradients accumulate into it from all steps.
2. Truncated BPTT with tau=10 on a dependency of length 50. What happens?
   - The gradient path is cut. The update cannot assign credit across the full span, so the dependency is effectively unlearnable at that tau.
3. Gradient norm 12 with theta=1. What is the clipped gradient?
   - g/12. min(1, 1/12) scales the norm to exactly 1 without changing direction.
4. Why does D2L one-hot encode instead of using an embedding layer?
   - Small char vocab makes one-hot cheap and explicit. It is the same linear map as an embedding row lookup, so shapes and gradients agree.

</details>

#### U5. Recurrent gradients, GRU and LSTM gates

**About 5 h** · **Target:** Derive + Implement

Topics: Vanishing and exploding recurrent gradients; GRU and LSTM gates

Gates are the fix for the gradient pathology of the previous unit. Each gate is a differentiable decision to keep, overwrite or reveal memory.

**You can now**

- Derive why repeated hidden Jacobians vanish or explode from their eigenvalue powers.
- Write the GRU and LSTM updates from memory and explain what each gate preserves or erases.
- Implement both cells from tensor ops and match framework cells on values and gradients.

**Study**

1. [Jacobian powers and gradient pathology](https://d2l.ai/chapter_recurrent-neural-networks/bptt.html) (D2L - convolutional and recurrent architecture route) - Backprop Through Time in Detail: the linear-recurrence gradient derivation ending in hidden-Jacobian powers. Exercises question 1: symmetric-matrix powers and what they mean for RNN gradients..
2. [GRU gates and scratch implementation](https://d2l.ai/chapter_recurrent-modern/gru.html) (D2L - convolutional and recurrent architecture route) - Reset Gate and Update Gate, Candidate Hidden State, Hidden State, and Implementation from Scratch.
3. [LSTM gates and scratch implementation](https://d2l.ai/chapter_recurrent-modern/lstm.html) (D2L - convolutional and recurrent architecture route) - Input, Forget and Output Gates, Memory Cell Internal State with C_t = F_t C_{t-1} + I_t tilde-C_t, Hidden State, and Implementation from Scratch. Depth: Skip the JAX lax.scan branches unless you train in JAX. The equations are framework-free.

**Focus**

- dL/dh_t fans out through powers of W_hh transposed. Eigenvalues below 1 decay geometrically and above 1 grow geometrically, and tanh or sigmoid derivatives shrink most steps further.
- GRU: R gates how much past state enters the candidate, and Z interpolates old state with candidate. LSTM splits the same job across F for erase, I for write and O for reveal, with a separate cell C_t.
- With F=1 and I=0 the cell holds its value exactly and gradients flow unchanged. That constant-error path is the whole point.
- PyTorch and D2L agree on the update gate: z weights the old state. They differ on the reset gate: D2L multiplies R into the state before W_hh, while torch.nn.GRU applies r after the recurrent matmul and its bias, r * (W_hn h + b_hn). Implement the PyTorch form when you match torch.nn.GRU.

**Reproduce:** Closed-book, write all GRU and LSTM equations with gate nonlinearities. Then implement both cells from tensor ops and match torch.nn.GRU and torch.nn.LSTM outputs on random input to float32 tolerance, using the PyTorch reset-gate form for the GRU.

**Traps**

- Porting gate formulas between sources without checking conventions. Some texts write h_t = (1 - z) h_{t-1} + z h~, the opposite of D2L and PyTorch, and the reset placement differs between D2L and torch.nn.GRU.
- Assuming LSTM always beats GRU. Cost and data decide, which is why the LSTM page asks for the cost comparison.
- Treating saturated gates as a bug to tune away. Gates at 0 or 1 stop gate learning while protecting memory, so that trade is expected.

**Practice**

- [D2L GRU Exercises 1 and 4: gate values and single-gate ablation](https://d2l.ai/chapter_recurrent-modern/gru.html) - Exercises: question 1 (best reset and update values to use only the input at t-prime for the output at t) and question 4 (a GRU with only a reset gate or only an update gate)
- [D2L LSTM Exercise 3: gated-cell cost comparison](https://d2l.ai/chapter_recurrent-modern/lstm.html) - Exercises: question 3 (computational cost of GRU, LSTM and plain RNN at fixed hidden size, training and inference)

**Stop when:** Your cells match framework outputs and gradients, and the ablations show which gate carries long-span memory.

<details>
<summary>Self-test</summary>

1. A linear recurrence has W_hh with spectral radius 1.5. What gradient scale results over 100 steps?
   - About 1.5^100, near 4e17: explosion. Below 1 it vanishes the same way, so only near-1 spectra plus gating survive long spans.
2. GRU with Z=1 everywhere under the D2L convention. What behavior results?
   - H_t equals H_{t-1}: the state freezes and ignores all inputs. With Z=0 the state is just the candidate, a tanh RNN whose recurrent input is gated by R.
3. LSTM: which gate settings copy C_{t-1} unchanged?
   - F=1 and I=0. The output gate then decides how much of tanh(C) shows in H.
4. A GRU with a reset gate but no update gate. What breaks?
   - Every step replaces the state with a fresh tanh candidate, so there is no copy path. Long-span memory must survive repeated multiplication by W_hh and tanh, which brings back vanishing gradients.

</details>

#### U6. Hidden state, encoder-decoder models and teacher forcing

**About 4 h** · **Target:** Explain

Topics: Hidden-state lifetime and stateful versus stateless evaluation; Encoder-decoder sequence models; Teacher forcing and exposure mismatch

State lifetime and teacher forcing are silent evaluation bugs. A model that trains on truth and tests on its own guesses fails exactly where the demo looked best.

**You can now**

- Explain hidden-state lifetime: what reset, detach and carry choices preserve or leak across batches.
- Explain the encoder-decoder contract from variable-length input to fixed context to variable-length output.
- Explain teacher forcing and exposure mismatch, and predict when each training choice hurts.

**Study**

1. [The encoder-decoder interface](https://d2l.ai/chapter_recurrent-modern/encoder-decoder.html) (D2L - convolutional and recurrent architecture route) - Encoder, Decoder, and Putting the Encoder and Decoder Together: the fixed-state interface with init_state.
2. [Teacher forcing and the encoder context](https://d2l.ai/chapter_recurrent-modern/seq2seq.html) (D2L - convolutional and recurrent architecture route) - Sections 10.7.1 and 10.7.2: Teacher Forcing with the '<bos> Ils regardent .' shift example, and the Encoder context variable. Depth: Stop before Section 10.7.4. The training loop, masking and BLEU belong to the next unit.
3. [Fixed-length batches for variable-length text](https://d2l.ai/chapter_recurrent-modern/machine-translation-and-dataset.html) (D2L - convolutional and recurrent architecture route) - Section 10.5: fixed-length truncation and padding with valid lengths and the <bos>-shifted decoder input.

**Focus**

- The encoder compresses variable-length input into a fixed context. The decoder is a language model conditioned on that context plus its own previous outputs.
- Teacher forcing feeds ground-truth tokens in training but predictions at test time. The mismatch compounds because errors become inputs.
- Reset state between unrelated sequences. Detach stops gradients but keeps values, so a carried state still biases the next batch.
- D2L seeds decoder state directly from encoder state, so layers and hidden size must match. Mismatched shapes need a projection, not a reshape hack.

**Reproduce:** Closed-book, draw the encoder input, decoder input and label rows for the pair ('go .', 'va !') with <bos>, <eos> and <pad>, and mark which positions teacher forcing feeds.

**Traps**

- Evaluating statefully after training statelessly, or the reverse. Hidden-state lifetime is part of the model contract, so changing it silently shifts results.
- Reading low teacher-forced loss as generation quality. The loss never scores the model's own continuations, so greedy rollout and BLEU do that in the next unit.
- Padding the decoder input and forgetting the label shift. Decoder input drops the final token and labels drop <bos>, so misaligning by one trains every position on the wrong target.

**Practice**

- [D2L seq2seq Exercises 3 and 4: mismatched decoder init and no-teacher-forcing training](https://d2l.ai/chapter_recurrent-modern/seq2seq.html) - Exercises: question 4 (replace teacher forcing with the previous prediction in training) and question 3 (different encoder and decoder layers or widths for decoder init)

**Stop when:** Your shift diagram matches the <bos> and <eos> example, and the no-teacher-forcing run shows how loss and translations change.

<details>
<summary>Self-test</summary>

1. Why does teacher forcing train faster yet generate worse than its loss suggests?
   - Training always conditions on truth, so early errors never compound. At test time each error becomes the next input and drift accumulates.
2. Hidden state carried across shuffled batches with detach. Is there harm?
   - Yes. Gradients stop but stale values bias the next unrelated batch, so reset state at sequence boundaries unless order is meaningful.
3. Encoder with 2 layers, decoder with 1 layer. Can the D2L init work?
   - No. It seeds decoder state directly from encoder state, so layers and hidden size must match, or add a projection as seq2seq Exercise 3 asks.
4. Target 'a b <eos>' with <bos> start. What are the decoder input and labels?
   - Input '<bos> a b' and labels 'a b <eos>'. Same length, shifted by one.

</details>

#### U7. Decoding, variable-length batches and leak tests

**About 5 h** · **Target:** Implement + Measure

Topics: Autoregressive greedy decoding and beam-search recognition; Variable-length batches, padding and loss masks; Packed sequences at recognition depth; Spatial, hidden-state and future-token leak tests

Decoding and masking turn a trained seq2seq net into honest predictions. One unmasked pad token or one peeking future input invalidates every number above it.

**You can now**

- Implement greedy decoding and describe how beam search trades compute for sequence score.
- Implement masked variable-length loss so padding contributes nothing to loss or metrics.
- Prove with leak tests that padding, hidden-state carry and future tokens cannot change valid outputs.

**Study**

1. [Masked loss, greedy prediction and BLEU](https://d2l.ai/chapter_recurrent-modern/seq2seq.html) (D2L - convolutional and recurrent architecture route) - Sections 10.7.5, 10.7.7 and 10.7.8: Loss Function with Masking ((l times mask).sum() over mask.sum()), greedy predict_step, and the BLEU measure. Depth: Use D2L bleu() as a relative probe only. It weights n-grams by (1/2)^n, unlike the uniform 1/k of Papineni et al.
2. [Greedy, exhaustive and beam search](https://d2l.ai/chapter_recurrent-modern/beam-search.html) (D2L - convolutional and recurrent architecture route) - Sections 10.8.1 to 10.8.4: Greedy Search with the 0.048 and 0.054 examples, Exhaustive Search cost, Beam Search, and the length penalty with alpha 0.75.
3. [Packed sequences at recognition depth](https://docs.pytorch.org/docs/stable/generated/torch.nn.utils.rnn.pack_padded_sequence.html) (PyTorch sequence packing utilities) - pack_padded_sequence: the lengths argument, enforce_sorted and batch-first. Depth: Recognition only. Know what packing skips and what contract it demands; do not reimplement the packed format.

**Focus**

- Greedy decoding feeds each argmax back with <bos> start and <eos> stop. Beam search keeps k hypotheses with length normalization, so larger k costs linearly more for usually better sequences.
- Masked loss divides by valid tokens, not by batch times steps. Dividing by the padded size silently down-weights short-sequence batches.
- Packing skips pad steps in the RNN so pads cost nothing and contribute no state. It needs lengths and, by default, length-sorted batches.
- A leak test perturbs what should not matter, such as pad values, future tokens or carried state, and asserts that valid outputs do not change: bit-identical for a causal RNN on CPU, and within a tight tolerance wherever a kernel may reorder sums.

**Reproduce:** Closed-book, implement masked cross-entropy with mask equal to targets-not-pad and sum-over-sum reduction, plus a greedy loop. Then pass three leak probes: random pad ids, changed tokens after position t (outputs up to t must not move), and carried versus reset hidden state.

**Traps**

- Averaging masked loss over all positions including pads. Short sequences then count less per token, so always divide by the mask sum.
- Sorting by length for packing and forgetting to unsort for metrics. Either restore the original order yourself or pass enforce_sorted=False and let PyTorch track the permutation.
- Stopping generation at fixed num_steps instead of <eos>. Tail pads then enter BLEU and length statistics as fake content.

**Practice**

- [CS231n Assignment 2 Q5: image captioning with vanilla RNNs](https://cs231n.github.io/assignments2025/assignment2) - Q5: Image Captioning with Vanilla RNNs. Implement vanilla RNNs and apply them to image captioning on COCO in RNN_Captioning_pytorch.ipynb.
- [D2L beam-search Exercise 2: beam size versus quality and speed](https://d2l.ai/chapter_recurrent-modern/beam-search.html) - Exercises: question 2 (beam size effects on translation quality and prediction speed in the seq2seq MT problem)

**Stop when:** Your masked loss matches a manual per-sequence mean, beam search beats greedy on a held-out sentence, and all three leak probes pass.

<details>
<summary>Self-test</summary>

1. Batch of lengths 5 and 2 padded to 5. What is the masked-loss denominator?
   - 7: 5 plus 2 valid tokens. Summing over 10 positions would dilute the short sequence.
2. In D2L's greedy-search example, greedy scores 0.048 while picking a different second token gives 0.054. Why does greedy miss it, and what does beam search change?
   - Greedy takes the most likely token at each step and never revisits. The other second token is less likely by itself but makes the later tokens more likely. Beam search keeps k partial sequences, so it can keep that branch alive long enough to see the payoff, though it is not guaranteed to find the best sequence.
3. The D2L beam score divides the log-probability by L^alpha, with alpha 0.75. What does raising alpha do?
   - It favors longer outputs. Log-probabilities are negative and grow in magnitude with length, so a larger divisor for long sequences offsets more of that penalty. Alpha 0 recovers the raw log-probability, which favors short outputs.
4. Leak probe: all <pad> ids replaced with random ids, and valid outputs change. Is that a bug?
   - Yes. Valid outputs must not depend on pad contents, so the change shows padding leaking into the representation or the loss.

</details>

### Mini-project: Convolution, gated recurrence and leak tests

**About 10 to 14 hours.** Implement a convolution and a GRU or LSTM cell from tensor operations and check them against PyTorch. Derive a small CNN's shapes, receptive field and cost before measuring them, and prove with interventions that padding and future inputs cannot change valid outputs.

1. Pass the CS231n Assignment 2 checks for the naive convolution and max-pooling passes in ConvolutionalNetworks.ipynb and for the vanilla RNN step and sequence passes in RNN_Captioning_pytorch.ipynb.
2. Write conv2d with padding, stride, dilation and groups, using unfold or loops, and match torch.nn.functional.conv2d in float64 over a grid of settings that includes groups equal to channels.
3. For a stated CNN of four to six layers, derive every output shape, the last layer's receptive field, the parameter count and the forward multiply-adds by hand. Check shapes and parameters in code. Check the receptive field by which input pixels get a nonzero gradient from one output, after setting weights to ones, removing ReLUs and swapping max for average pooling so no path is zeroed by chance.
4. Implement a GRU or LSTM cell in PyTorch's gate convention, load weights from torch.nn.GRUCell or LSTMCell, and match outputs and gradients over a 20-step unroll in float64.
5. Batch variable-length sequences with padding plus masks or packing, and test that changing padded values leaves every valid output and the final valid hidden state unchanged.
6. For a unidirectional model, test that changing the input at step t leaves outputs before t unchanged. Run the same test on a bidirectional model and show that it fails, which proves the test can fail.
7. Plot gradient norms through time for a vanilla RNN and your gated cell on a long sequence, and relate them to measured gate values.

**Deliverables**

- Convolution and gated-cell modules with float64 differential tests against PyTorch.
- The derivation sheet for the stated CNN, with code checks for shapes, parameters and receptive field.
- The leak tests: padding invariance, future-input invariance and the bidirectional counter-case.

**Checks**

- external-tests: [CS231n Assignment 2: ConvolutionalNetworks.ipynb and RNN_Captioning_pytorch.ipynb checks](https://cs231n.github.io/assignments/2026/assignment2.zip). Run the notebook cells locally; each prints a rel_error against stored values or numerical gradients. Gradescope is for enrolled students only, so these printed checks are the gate.
- rubric: Self-grade with the rubric below.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Convolution | Matches F.conv2d in float64 for the tested padding, stride, dilation and group settings. | Gradients also match, and a property test samples random valid settings. |
| Derivation | Hand-derived shapes, parameters and multiply-adds match the code. | The gradient-based receptive field matches the derivation, including a dilated layer. |
| Gated cell | Outputs match the PyTorch cell with loaded weights. | Gradients through the 20-step unroll match too, and you show that a D2L-convention GRU does not match PyTorch even with the same weights, because the reset gate acts before rather than after the hidden-state matmul. |
| Leak tests | Padding and future-input interventions leave valid outputs unchanged within tolerance. | The bidirectional counter-case fails the future-input test, and the padding test covers an all-padding row under a stated convention. |
| Gradients through time | Gradient norms by time step are plotted for both cells. | You tie the decay to measured gate values or to norms of the recurrent Jacobian. |

Feeds into: Capstone artifact 2: this CNN or recurrent model is one option for the reproducible training run, and the leak tests can support a casebook postmortem.

### Resource route

- **Primary - Course:** [D2L - convolutional and recurrent architecture route](https://d2l.ai/) - Use why convolution, convolution layer, padding and strides, pooling, channels, batch normalization and ResNet, then RNN, BPTT, scratch RNN, GRU, LSTM, encoder-decoder and seq2seq. Work through the scratch mechanisms before concise APIs.
- **Required - Theory:** [Understanding Deep Learning - convolution and residual networks](https://udlbook.github.io/udlbook/) - Use Chapters 10 and 11 to sharpen convolutional invariance, receptive-field reasoning, residual paths and normalization. D2L remains the recurrent implementation route.
- **Support - Practice:** [Stanford CS231n - Assignments 1 and 2](https://cs231n.stanford.edu/2025/assignments.html) - Use only the neural network, normalization, dropout, convolution and PyTorch components that match this section. Do not complete the course or unrelated vision tasks.
- **Optional - Practice:** [Deep-ML candidate - convolution and recurrence problems](https://www.deep-ml.com/problems) - After the platform admission check, use at most one of 41 Conv2D, 62 RNN with BPTT, 287 GRU or 59 LSTM as a changed-prompt drill.
- **Reference - Reference:** [PyTorch nn.Conv2d reference](https://docs.pytorch.org/docs/stable/generated/torch.nn.Conv2d.html) - Read Signature and Shape for the exact floor formula with dilation, the groups divisibility rule with grouped and depthwise examples, and the weight layout (C_out, C_in/groups, kH, kW). D2L and UDL teach the mechanism; this page is the shape contract to code against.
- **Reference - Reference:** [PyTorch sequence packing utilities](https://docs.pytorch.org/docs/stable/generated/torch.nn.utils.rnn.pack_padded_sequence.html) - Read pack_padded_sequence for lengths, enforce_sorted and batch-first at recognition depth: what packing skips and what contract it demands. Do not reimplement the packed format; pair it with the masked-loss implementation in D2L seq2seq.

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

### Study units

#### U1. Embedding geometry and contrastive logits

**About 3 h** · **Target:** Derive

Topics: Embeddings, dot products, cosine geometry and normalization; Metric learning and contrastive logits

Contrastive objectives compare directions, not positions. If norms leak into the logits, the loss rewards loud embeddings instead of aligned ones.

**You can now**

- Explain why cosine similarity keeps angles and discards norms, and when that helps retrieval.
- Derive NT-Xent as softmax cross-entropy over the 2N-1 other views, with 1/tau logit scaling.
- Predict the loss for degenerate batches, including the log(2N-1) uniform case.

**Study**

1. [NT-Xent and cosine similarity](https://ar5iv.labs.arxiv.org/html/2002.05709) (SimCLR - A Simple Framework for Contrastive Learning of Visual Representations) - Section 2.1, Eq. (1): sim(u,v) as the L2-normalized dot product and l_{i,j} with the sum over k != i; Algorithm 1 for the full loop.
2. [Why normalization matters](https://ar5iv.labs.arxiv.org/html/2002.05709) (SimCLR - A Simple Framework for Contrastive Learning of Visual Representations) - Section 5.1, Table 5: L2 Yes versus No rows, with the sentence that normalization plus temperature weights examples by hardness. Depth: Skip the temperature-value comparison; the next unit owns tau.

**Focus**

- Cosine similarity is a dot product after L2 normalization. Positive scaling of either vector changes nothing.
- NT-Xent treats the 2N-1 other views as classes. The positive stays in the denominator, so the loss is a valid cross-entropy.
- With identical embeddings every row is uniform at any tau, so the loss equals log(2N-1): log 3 = 1.0986 for 2N = 4.
- Without normalization, one large-norm embedding dominates every softmax row it appears in.

**Reproduce:** Closed-book, derive l_{i,j} from softmax cross-entropy over pairwise similarities. Then compute the tau = 1 loss by hand for embeddings [1,0], [1,0], [0,1], [0,1] and get 0.5514.

**Traps**

- Calling cosine similarity translation-invariant. It is invariant to positive scaling, not to shifts; centering the batch changes all angles.
- Dropping the positive from the denominator. SimCLR sums over k != i, which includes the positive; without it the loss can go negative.
- Reading NT-Xent as fixed-class classification. The classes are the current batch views, so the same pair gets a different loss in different batches.

**Practice**

- [Deep-ML 384: Contrastive Loss (InfoNCE / SimCLR-style)](https://www.deep-ml.com/problems/384) - Implement contrastive_loss(embeddings, temperature). The visible tests check two identical pairs at tau = 1.0 for 0.5514 and four identical embeddings for 1.0986.. Then add local tests for temperature extremes, a missing positive, duplicate pairs, and normalized versus unnormalized inputs.

**Stop when:** You derive NT-Xent without notes, reproduce 0.5514 by hand, and your implementation passes the Deep-ML tests plus the four local edge tests.

<details>
<summary>Self-test</summary>

1. Embeddings [1,0], [1,0], [0,1], [0,1] at tau = 1 give loss 0.5514. Show the per-row terms.
   - For row 0 the positive scores 1 and the two negatives score 0, so l = -1 + log(e + 2) = 0.5514. Rows 1, 2 and 3 match by symmetry, and the mean over all four rows is 0.5514.
2. All four embeddings are identical. What is the loss at tau = 1?
   - log 3 = 1.0986. Every row is uniform over its three candidates, so each row contributes log 3.
3. Why does SimCLR Table 5 favor L2 normalization?
   - Raw dot products mix angle with norm, so loud vectors dominate the softmax. With normalization plus temperature the loss weights examples by relative hardness, and Top-1 rises from 57.2 to 64.4 at the best setting. Without normalization the contrastive accuracy is higher (91.7 versus 87.8) yet the representation is worse, so the pretext score does not measure representation quality.
4. Is the positive pair part of its own denominator?
   - Yes. The sum runs over all k != i including the positive index j, which keeps the loss a proper cross-entropy bounded below by 0.

</details>

#### U2. Temperature, negatives and positive construction

**About 4 h** · **Target:** Derive + Measure

Topics: Temperature and batch-negative effects; Positive and negative construction

Temperature and batch size set the difficulty of the discrimination game. The positive construction declares which variation the representation must ignore.

**You can now**

- Derive the 1/tau sharpening of logits and gradients, and predict saturation at small tau.
- Explain how batch size sets the negative count and when longer training closes the gap.
- Build positives by augmentation composition and state the invariance each transform declares.

**Study**

1. [Temperature and normalization](https://ar5iv.labs.arxiv.org/html/2002.05709) (SimCLR - A Simple Framework for Contrastive Learning of Visual Representations) - Section 5.1, Table 5: tau 0.05, 0.1, 0.5 and 1.0 with L2 normalization; best Top-1 64.4 at tau = 0.1; the hard-negative weighting sentence.
2. [Batch size and training length](https://ar5iv.labs.arxiv.org/html/2002.05709) (SimCLR - A Simple Framework for Contrastive Learning of Visual Representations) - Sections 2.2 and 5.2 with Figure 9: batch sizes 256 to 8192 with 16,382 negatives per positive at 8192; larger batches help early and the gap shrinks with longer training.
3. [Augmentation composition](https://ar5iv.labs.arxiv.org/html/2002.05709) (SimCLR - A Simple Framework for Contrastive Learning of Visual Representations) - Section 3.1 with Figures 5 and 6: single transforms fail while crop plus color distortion wins; color histograms alone suffice as a shortcut.

**Focus**

- Dividing by tau multiplies every logit gap. Small tau sharpens toward argmax; large tau flattens toward uniform.
- The positive-logit gradient is -(1 - p_pos)/tau. Easy pairs saturate near zero gradient at small tau, so hard negatives drive learning.
- Negatives per positive equal 2(N-1): 510 at batch 256 and 16,382 at batch 8192. Longer training closes much of the batch gap.
- Random crop plus color distortion wins because it blocks the color-histogram shortcut, not because either transform is strong alone.

**Reproduce:** Closed-book, write the NT-Xent gradient for the positive similarity. For similarities [2, 1, 0], compute the tau = 1 softmax [0.665, 0.245, 0.090] with gradient -0.335, and the tau = 0.1 gradient of about -0.0005.

**Traps**

- Pushing tau ever lower. Below 0.1 easy pairs saturate and a few hard negatives dominate; Table 5 drops from 64.4 at 0.1 to 59.7 at 0.05.
- Assuming bigger batches always win. Figure 9 shows large gains at 100 epochs that mostly disappear with longer training on randomly resampled batches.
- Letting labels choose positives and still calling the method self-supervised. SimCLR positives are two views of one image; once class labels pick positives, it is supervised contrastive learning and must be compared as such.

**Practice**

- [TensorTonic: Implement Symmetric CLIP Contrastive Loss](https://www.tensortonic.com/problems/cs336-l17-symmetric-clip-loss) - Named problem on the free language-modeling-from-scratch plan: implement the two-directional loss over an image-text similarity batch.. Transfer your NT-Xent derivation: CLIP swaps augmentation pairs for image-text pairs and averages both softmax directions.

**Stop when:** You predict tau-sharpening and batch-size effects from the formulas, and your two-directional implementation passes the page tests.

<details>
<summary>Self-test</summary>

1. Similarities [2, 1, 0] at tau = 1: what is the positive probability?
   - e^2/(e^2 + e + 1) = 0.665. The remaining mass splits 0.245 and 0.090.
2. What happens to easy-pair gradients as tau goes to 0?
   - The softmax saturates to one-hot, so (1 - p)/tau goes to 0 for decided pairs and learning concentrates on the remaining hard pairs; too small stalls training.
3. Batch 8192 gives how many negatives per positive, and why?
   - 16,382. The batch holds 2N = 16,384 views; excluding the anchor and its positive leaves 2N - 2 negatives.
4. Positive-identification accuracy is near perfect but linear evaluation is poor. What went wrong?
   - The task is solvable by shortcut, such as color histograms under crop-only augmentation. Composition makes pairing harder and representations better.

</details>

#### U3. Augmentation shortcuts, false negatives and collapse

**About 5 h** · **Target:** Explain + Measure

Topics: Augmentation assumptions, false negatives and shortcuts; Representation collapse and norm diagnostics

Without negatives the objective accepts a constant answer; with lazy positives it accepts a cheating one. Both failure modes look like falling loss.

**You can now**

- Explain how augmentation shortcuts and false negatives arise, using the color-histogram case.
- Detect collapse with per-dimension spread, norm and rank checks.
- Explain why stop-gradient and predictor asymmetry prevent collapse in positive-only methods.

**Study**

1. [Self-supervision and augmentation](https://udlbook.github.io/udlbook/) (Understanding Deep Learning - representation foundations) - Sections 9.3.7-9.3.8 (pp. 152-153): contrastive pairs of transformed images; augmentation as label-preserving expansion; Figure 9.12.
2. [Negative rule and augmentation shortcuts](https://ar5iv.labs.arxiv.org/html/2002.05709) (SimCLR - A Simple Framework for Contrastive Learning of Visual Representations) - Section 2.1: all other 2(N-1) views count as negatives, including same-class views; Section 3.1 with Figure 6: color histograms alone suffice to distinguish images.
3. [Collapse without stop-gradient](https://ar5iv.labs.arxiv.org/html/2011.10566) (SimSiam - Exploring Simple Siamese Representation Learning) - Figure 2: 67.7 percent with stop-gradient versus 0.1 percent without, plus the per-channel spread plot; Table 1 row (a): no predictor also gives 0.1 percent.

**Focus**

- An augmentation declares an invariance. Crop-only declares color histograms fair game, and the encoder takes that shortcut.
- Every batch negative is repelled, including same-class images. At batch 8192 with 1000 balanced classes, each anchor repels about 16 same-class views.
- Full collapse keeps per-dimension spread at zero and rank at one while the loss sits at log(2N-1). Partial collapse needs the same checks, since its loss still falls.
- SimSiam avoids collapse on positives alone with stop-gradient and a predictor. The constant solution still minimizes its loss; the paper shows that removing either piece collapses to 0.1 percent and offers an EM-style hypothesis, not a proof.

**Reproduce:** From a blank file, write the three-line collapse check (mean per-dimension std of the L2-normalized embeddings, mean norm, numerical rank with a stated tolerance) and run it on constant versus Gaussian 128-d embeddings: expect spread 0.0 versus about 0.088, which is 1/sqrt(128), and rank 1 versus 128.

**Traps**

- Trusting falling loss as proof of learning. Partial collapse keeps the loss falling while dimensions die; only spread and rank checks catch it.
- Dismissing false negatives as rare. About 16 per anchor at SimCLR scale is a steady repulsive pressure on same-class views.
- Crediting the predictor alone for SimSiam. Figure 2 shows stop-gradient removal by itself collapses to 0.1 percent.

**Practice**

- [CS231n Assignment 3, Q2: augmentation ablation from scratch](https://cs231n.github.io/assignments2025/assignment3/) - Self_Supervised_Learning.ipynb: Data Augmentation (compute_train_transform, checked with rel_error), Train the SimCLR model, and the Finetune a Linear Layer comparison on the 10 percent split. The training cell loads pretrained weights and runs one epoch, so the ablation needs its own runs: skip the load_state_dict line, train a few epochs with and without color jitter at the notebook tau of 0.5, then probe both. Small runs may show only a small gap; report what you measure, and run your collapse check on both embedding sets.

**Stop when:** Your collapse check reports spread and numerical rank for constant, Gaussian and learned embeddings, and your ablation reports probe accuracy for both runs against the frozen random-encoder baseline.

<details>
<summary>Self-test</summary>

1. What does the middle plot of SimSiam Figure 2 show without stop-gradient?
   - Per-channel std of the normalized output falls toward zero: the embeddings go constant and validation accuracy drops to 0.1 percent.
2. Estimate same-class negatives per anchor at batch 8192 with 1000 balanced classes.
   - About 16: 16,382 negatives divided by 1000 classes.
3. Your embeddings have numerical rank 3 in a 128-d space, but the loss keeps falling. Is that collapse?
   - Dimensional collapse: the loss can still fall inside the live subspace while most dimensions carry nothing. Report spread and the singular-value spectrum, and check the probe; a falling loss does not rule it out.
4. Why does adding color distortion to cropping improve representations while making pairing harder?
   - It removes the color-histogram shortcut, so the encoder must use shape and content that transfer.

</details>

#### U4. Linear probes, transfer evaluation and pair leakage

**About 5 h** · **Target:** Implement + Measure

Topics: Frozen encoders, linear probes and fine-tuning; Held-out retrieval and transfer evaluation; Pair, identity and near-duplicate leakage

A probe is the representation's external exam. A leaked pair turns the exam into a memory test, so the split discipline matters as much as the accuracy.

**You can now**

- Implement a frozen-encoder linear probe with matched baseline budgets.
- Evaluate transfer with held-out retrieval or classification and state slice limits.
- Build pair-identity and near-duplicate checks that catch train/test leakage.

**Study**

1. [Linear evaluation protocol](https://ar5iv.labs.arxiv.org/html/2002.05709) (SimCLR - A Simple Framework for Contrastive Learning of Visual Representations) - Section 2.3: linear classifier on the frozen base network with test accuracy as the representation-quality proxy.
2. [Transfer learning and fine-tuning](https://udlbook.github.io/udlbook/) (Understanding Deep Learning - representation foundations) - Section 9.3.6 (pp. 151-152) with Figure 9.12a (p. 153): pretrain on a secondary task, replace the last layers, then train only the new layers or fine-tune all.
3. [Probe the encoder, not the projector](https://ar5iv.labs.arxiv.org/html/2002.05709) (SimCLR - A Simple Framework for Contrastive Learning of Visual Representations) - Section 4.2 with Table 3: h beats z by over 10 points; rotation prediction 67.6 percent from h versus 25.6 percent from g(h).
4. [Frozen linear probe on CIFAR](https://cs231n.github.io/assignments2025/assignment3/) (Stanford CS231n - transformer and self-supervised assignment slice) - Self_Supervised_Learning.ipynb: Classifier with frozen Model().f, Finetune a Linear Layer for Classification, Baseline Without Self-Supervised Learning versus With Self-Supervised Learning, Plot your Comparison.

**Focus**

- Freeze the encoder (requires_grad False) and train only the head. Anything else measures supervised relearning.
- Probe h, the pre-projection features. In SimCLR Table 3, where rotation was added to the augmentations, the projector output z lost the rotation information that h kept.
- Match budgets exactly: same data fraction, epochs and head settings for baseline and pretrained runs.
- Split by source identity before augmenting. Two views of one image on opposite sides of the split leak the answer.

**Reproduce:** Closed-book, write the frozen-probe loop: load the encoder, freeze all of f, attach one linear layer, and train the head on the fixed 10 percent split. Then state what turns it into fine-tuning: unfreeze f and give its parameters to the optimizer, usually at a lower learning rate.

**Traps**

- Probing z instead of h. In SimCLR Table 3 an MLP on h predicts rotation at 67.6 percent and one on z at 25.6, near the 25 percent chance level, because rotation was one of the augmentations.
- Celebrating a probe win with mismatched budgets. A longer-trained or larger-split baseline can erase the gap.
- Splitting augmented views independently. Near-duplicates across the split inflate retrieval and probe scores without teaching anything.

**Practice**

- [CS231n Assignment 3, Q2: SimCLR plus linear probe](https://cs231n.github.io/assignments2025/assignment3/) - Self_Supervised_Learning.ipynb: simclr_loss_naive and simclr_loss_vectorized in cs231n/simclr/contrastive_loss.py, Train the SimCLR model, then Finetune a Linear Layer for Classification with the frozen encoder.. Match the naive and vectorized losses first; the probe comparison is only meaningful on a correct objective. The section mini-project adds seeded pair-leak detection and a held-out retrieval defense.

**Stop when:** Your frozen probe beats the matched no-pretrain baseline, your naive and vectorized losses agree, and your split audit shows no shared source identities across train and test.

<details>
<summary>Self-test</summary>

1. Why does the notebook set requires_grad False on model.f?
   - To freeze the encoder so test accuracy measures representation quality, following the SimCLR Section 2.3 protocol.
2. Rotation prediction: h scores 67.6 percent, g(h) 25.6 percent. What does that tell you about probing?
   - Probe h. In that run rotation was one of the augmentations, so the contrastive loss trained z to ignore it; probing z understates what the encoder keeps.
3. Your retrieval score rises after adding test pairs mined from the training distribution. Leak or gain?
   - Suspect near-duplicate leakage first. Re-split by pair identity, re-run, and only then claim a gain.
4. Your probe reaches a reference accuracy quoted in a notebook comment, but your baseline trained for fewer epochs. What can you claim?
   - Nothing about the representation yet. Only a comparison with matched data fraction, epochs and head settings isolates the effect of pretraining.

</details>

#### U5. Patch embeddings and positional information

**About 3 h** · **Target:** Implement

Topics: Image layout, patches and patch embeddings; Positional information for patch encoders

Patches turn an image into a token sequence. The grid position that convolution got for free must be added back before attention can use it.

**You can now**

- Implement patch extraction as stride-equals-size convolution and verify count, order and flat dimension.
- Explain where positional information enters a ViT and why attention needs it.
- Predict token counts and attention-cost scaling when patch size or resolution changes.

**Study**

1. [Patch embedding as strided convolution](https://d2l.ai/chapter_attention-mechanisms-and-transformers/vision-transformer.html) (D2L - Vision Transformer) - Model plus Patch Embedding sections: m = hw/p^2 patches flattened to cp^2; single convolution with kernel size and stride set to patch size; worked example img_size 96 with patch 16 gives 36 patches of shape (4, 36, 512).
2. [Class token, positions and pre-norm blocks](https://d2l.ai/chapter_attention-mechanisms-and-transformers/vision-transformer.html) (D2L - Vision Transformer) - Putting It All Together and Vision Transformer Encoder: cls_token plus learnable pos_embedding over num_patches + 1 positions; ViTBlock pre-normalization; head reads X[:, 0].
3. [Vision transformers and scale](https://udlbook.github.io/udlbook/) (Understanding Deep Learning - representation foundations) - Sections 12.10.2-12.10.3 (pp. 229-232): 16x16 patches with learned linear map and learned 1D positional encodings; Figure 12.17; SWin multi-scale windows in Figure 12.18.

**Focus**

- Patchify is a disjoint row-major grid: (H/p) by (W/p) patches, each flattened to C*p^2 values (768 for 3-channel 16px patches).
- One convolution with kernel equal to stride equal to patch size does extraction plus projection; D2L output keeps one vector per patch.
- Self-attention is permutation-equivariant, so order must be injected. D2L learns pos_embedding from random init; the UDL ViT learns 1D encodings too.
- Halving patch size quadruples tokens, multiplies attention-score work by 16, and multiplies per-token projection and MLP work by 4.

**Reproduce:** From a blank file, patchify a 2x2 single-channel image with patch size 1 and show row-major order [0, 1, 2, 3]. Then derive the (4, 36, 512) output shape from img_size 96 and patch 16.

**Traps**

- Using overlapping patches by default. ViT and D2L use stride equal to patch size, so patches are disjoint.
- Equating the cls representation with patch averaging. The cls token is learned aggregation; D2L Exercise 2 asks you to implement averaging as an experiment, not an identity.
- Assuming sinusoidal positions. Both D2L and the UDL ViT learn positional embeddings, so 2D layout must be learned from data.

**Practice**

- [TensorTonic: Patchify a Batch of Images](https://www.tensortonic.com/problems/cs336-l17-vision-transformer-patchify) - Named problem on the free language-modeling-from-scratch plan: split image batches into a row-major grid of non-overlapping flattened patches.. Match D2L patch count and ordering before adding any learned projection.
- [D2L Vision Transformer exercises](https://d2l.ai/chapter_attention-mechanisms-and-transformers/vision-transformer.html) - Exercises: img_size versus training time, averaged-patch head instead of cls, and hyperparameter tuning for accuracy.

**Stop when:** Your patchify matches the D2L shape assertions with row-major order, and you predict tokens and attention scaling for a new patch size without notes.

<details>
<summary>Self-test</summary>

1. 224x224 image, patch 16: patches and tokens?
   - 196 patches, 197 tokens with cls.
2. Why does a ViT need positional embeddings when a CNN needs none?
   - Attention is permutation-equivariant (UDL Problem 12.3), so it cannot see order; convolution bakes locality and translation structure into the operation.
3. Patch size 16 to 8 at fixed resolution: how does attention work scale?
   - Tokens quadruple, so the attention matrix grows 16-fold.
4. What does LazyConv2d with kernel 16 and stride 16 compute on the worked example?
   - Patch extraction plus learned projection to 512-d, giving (4, 36, 512) for batch 4.

</details>

#### U6. Paired modalities: projector heads, alignment and zero-shot retrieval

**About 4 h** · **Target:** Explain + Implement

Topics: Projector heads and paired-modality alignment; Modality imbalance and zero-shot retrieval vocabulary

Paired data aligns two geometries into one shared space. That space supports retrieval and zero-shot transfer, but alignment alone provides no reasoning or grounding.

**You can now**

- Explain the symmetric image-text objective over the N x N similarity matrix.
- Implement the two-directional loss with learned temperature and batched negatives.
- Run zero-shot retrieval and state the slice limits of the alignment.

**Study**

1. [Symmetric contrastive objective](https://ar5iv.labs.arxiv.org/html/2103.00020) (CLIP - Learning Transferable Visual Models From Natural Language Supervision) - Section 2.3: N x N possible pairings with maximization of the N real-pair similarities; symmetric cross-entropy; temperature tau as a learned log-parameterized scalar.
2. [Scale and temperature limits](https://ar5iv.labs.arxiv.org/html/2103.00020) (CLIP - Learning Transferable Visual Models From Natural Language Supervision) - Section 2.5: minibatch 32,768; tau initialized to 0.07 and clipped to scale logits by at most 100.
3. [Zero-shot transfer and prompts](https://ar5iv.labs.arxiv.org/html/2103.00020) (CLIP - Learning Transferable Visual Models From Natural Language Supervision) - Sections 3.1.2 and 3.1.4: zero-shot as text-generated classifier weights; A photo of a {label} gains 1.3 percent, 80-prompt ensembling adds 3.5 percent.
4. [Projector heads and CLIP practice](https://cs231n.github.io/assignments2025/assignment3/) (Stanford CS231n - transformer and self-supervised assignment slice) - cs231n/simclr/model.py class Model: ResNet-50 backbone f giving the 2048-d feature h, MLP head g giving z, both returned L2-normalized; CLIP_DINO.ipynb: get_similarity_no_loop, clip_zero_shot_classifier, CLIPImageRetriever.retrieve.

**Focus**

- The loss makes 2N decisions per batch: each image picks its text and each text picks its image from N options.
- Temperature is learned, not tuned: log-parameterized, started at 0.07, capped at 100x for stability.
- Each pair trains against 32,767 in-batch negatives, so every step is a 32,768-way proxy classification.
- Zero-shot builds the classifier from text at test time. Prompts are model inputs: the default template gains 1.3 percent and 80-prompt ensembling adds 3.5 percent on ImageNet.

**Reproduce:** Closed-book, compute the symmetric tau = 1 loss for similarity matrix [[3, 1], [1, 2]]: row losses 0.1269 and 0.3133 with mean 0.2201 in both directions.

**Traps**

- Assuming aligned embeddings understand new words. The text encoder embeds prompts; unseen vocabulary and slices degrade, so alignment quality stays slice-dependent.
- Training one direction only. CLIP optimizes both image-to-text and text-to-image jointly over the same matrix.
- Mixing up the two evaluation spaces. Zero-shot retrieval must use the shared projected space, because that is where images and texts are compared. For a linear probe, also test the features before the projection; SimCLR Section 4.2 found them better in its setup.

**Practice**

- [CS231n Assignment 3, Q4: CLIP zero-shot and retrieval](https://cs231n.github.io/assignments2025/assignment3/) - CLIP_DINO.ipynb: get_similarity_no_loop for the NxM cosine matrix, clip_zero_shot_classifier for prompt-based labels, CLIPImageRetriever.retrieve with top-k.. Precompute image features once in __init__ instead of per query, as the starter-code comment directs.

**Stop when:** You reproduce 0.2201 by hand, your Q4 functions label and retrieve COCO images, and you can state one slice where you would not trust the alignment.

<details>
<summary>Self-test</summary>

1. Batch of N pairs: how many scores and how many decisions?
   - N^2 scores; 2N decisions, N per direction.
2. Why does CLIP learn tau, and with what guardrails?
   - It sets the logit range for the softmax; learning avoids tuning it. Init 0.07, clipped at 100x scaling to prevent instability.
3. What is a zero-shot classifier in CLIP terms?
   - Cosine softmax with L2-normalized inputs, text-generated weights, no bias and temperature scaling; the text encoder generates the classifier.
4. Prompt template plus ensembling: what gains on ImageNet?
   - 1.3 percent from A photo of a {label}, another 3.5 percent from 80-prompt ensembling.

</details>

#### U7. Graph message passing and oversmoothing

**About 2 h** · **Target:** Explain

Topics: Graph message passing, permutation behavior and oversmoothing recognition

Graphs make neighborhoods explicit. Each layer trades local identity for wider context, and past a point the averaging erases what made nodes distinct.

**You can now**

- Explain one message-passing step as neighborhood aggregation plus update.
- State permutation equivariance for layers and invariance for readouts, and test it.
- Recognize oversmoothing and name the random-walk averaging behind it.

**Study**

1. [Graphs and adjacency powers](https://udlbook.github.io/udlbook/) (Understanding Deep Learning - representation foundations) - Sections 13.1-13.2 (pp. 241-244): node and edge matrices; entry (m, n) of A^L counts length-L walks; Figures 13.3-13.4.
2. [Tasks and equivariant layers](https://udlbook.github.io/udlbook/) (Understanding Deep Learning - representation foundations) - Sections 13.3-13.4.1 (pp. 245-250): graph and node tasks; layers must be permutation-equivariant; Figure 13.7 aggregate-then-update.
3. [Why deep GNNs stall](https://udlbook.github.io/udlbook/) (Understanding Deep Learning - representation foundations) - Notes to Chapter 13, Oversmoothing and suspended animation (pp. 265-266): two-layer norm, random-walk stationary washout, over-squashing, residuals for depth.
4. [Graph encoding notebook](https://github.com/udlbook/udlbook/blob/main/Notebooks/Chap13/13_1_Graph_Representation.ipynb) (Understanding Deep Learning - representation foundations) - Notebook 13.1, Graph Representation: adjacency and embedding encodings. Depth: Open only if the A^L walk counting in Section 13.2 is unclear.

**Focus**

- A^L counts walks, not paths: revisits allowed. The diagonal of A^2 holds node degrees.
- Correct layers are permutation-equivariant: permuting node order permutes embeddings identically. Readouts for graph labels must be invariant.
- Repeated averaging converges toward the random-walk stationary distribution, so deep stacks wash out local signal.
- Two layers are the empirical norm: the original GCN and GraphSAGE both use two. Depth needs residual connections or similar fixes, not more of the same layer.

**Reproduce:** Closed-book, write one aggregate-then-update step for a single node. Then square the 3-node path adjacency and read off one length-2 walk from node 1 to node 3 and two from node 2 to itself.

**Traps**

- Counting paths with A^L. Walks may revisit nodes; the book states this explicitly.
- Expecting depth to help by default. Mean aggregation converges across nodes, so a 10-layer stack can underperform a 2-layer one.
- Indexing nodes as an ordered input. If shuffling IDs changes predictions beyond permutation, the layer is wrong, not the data.

**Practice**

- [UDL Chapter 13 problems: graphs, walks and equivariance](https://udlbook.github.io/udlbook/) - Problems 13.1, 13.3, 13.5 and 13.7 (pp. 266-267): adjacency matrices, walk counts, the responsible permutation matrix, and the equivariance proof for the simple layer.

**Stop when:** You solve Problems 13.1, 13.3, 13.5 and 13.7 without notes, and on a small graph you can show cross-node spread shrinking with depth under repeated mean aggregation.

<details>
<summary>Self-test</summary>

1. Path 1-2-3: length-2 walks from 1 to 3, and from 2 to 2?
   - One (1-2-3) and two (2-1-2, 2-3-2), matching the A^2 entries 1 and 2.
2. What must a permutation of node order do to layer outputs?
   - Permute them identically (equivariance); a graph-level readout must stay unchanged (invariance).
3. All node embeddings look identical after six layers. Diagnose and name the mechanism.
   - Oversmoothing from repeated neighborhood averaging toward the stationary distribution. Confirm per-layer cross-node spread, then cut depth or add residuals.
4. Why do the original GCN and GraphSAGE use two layers?
   - Two hops already mix neighborhoods; deeper stacks wash out local information faster than they add useful context, per the Notes.

</details>

### Mini-project: Compact contrastive learner with a seeded leak audit

**About 10 to 14 hours.** Train a small SimCLR-style encoder on a CIFAR-10 subset, evaluate it with a frozen linear probe and held-out retrieval against a random-encoder baseline, and show that your split audit catches a pair leak you planted yourself.

1. Implement NT-Xent from your derivation. Pass Deep-ML 384 and the CS231n Assignment 3 simclr_loss_naive and simclr_loss_vectorized checks, and add tests for identical embeddings (log(2N-1)), temperature extremes and unnormalized inputs.
2. Train a small encoder with a projector on a fixed CIFAR-10 subset at a stated temperature and batch size. Log loss, positive-pair accuracy and the collapse check (per-dimension spread of normalized embeddings and numerical rank) every epoch.
3. Evaluate with a frozen linear probe on h and on z, and with nearest-neighbour retrieval on a held-out split, against a frozen random-encoder baseline with matched budgets, over two seeds.
4. Split by source image before augmenting, and write a split audit that combines exact hashes with a near-duplicate check, such as cosine similarity of downsampled pixels above a stated threshold.
5. Plant a leak: copy a few hundred test images, lightly augmented, into the training set. Show what the audit flags and misses, and measure how much the leak inflates retrieval and probe scores.
6. Run one ablation, such as dropping color jitter, and report probe accuracy and the collapse check for both runs.
7. Write the limits: what your subset, resolution and budget cannot show about large-scale pretraining or paired image-text alignment.

**Deliverables**

- Training and evaluation code with the loss tests, the collapse check and the split audit.
- A results table with seeds: probe on h and z, retrieval, the random-encoder baseline, the ablation, and leaked versus clean scores.
- A one-page limits note.

**Checks**

- external-tests: [Deep-ML 384: Contrastive Loss (InfoNCE / SimCLR-style)](https://www.deep-ml.com/problems/384).
- external-tests: [CS231n Assignment 3, Self_Supervised_Learning.ipynb loss and augmentation checks](https://cs231n.github.io/assignments/2026/assignment3.zip). Run the notebook cells locally; each prints a rel_error against stored values or numerical gradients. Gradescope is for enrolled students only, so these printed checks are the gate.
- rubric: Self-grade with the rubric below.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Objective | NT-Xent passes Deep-ML 384, the CS231n loss checks and your edge tests. | Your tests also cover duplicate images in one batch and show how they change the loss. |
| Evaluation protocol | The frozen probe and retrieval beat the random-encoder baseline at matched budgets. | The result holds on both seeds, and the gap between probing h and z is reported. |
| Leak detection | The audit flags the planted near-duplicates. | You report the audit's misses and false alarms on the planted set, and the score inflation the leak caused. |
| Collapse | Spread and rank are logged for every run. | A deliberately collapsed run, such as a constant projector output, trips the check. |
| Limits | The note names what the compact run cannot show. | Each limit names the measurement that would settle it. |

Feeds into: Capstone artifact 3: the planted leak and its audit can be the objective or data postmortem.

### Resource route

- **Primary - Theory:** [Understanding Deep Learning - representation foundations](https://udlbook.github.io/udlbook/) - Use 9.3.6-9.3.7 for transfer and self-supervision, 12.9-12.10 for image transformers, and 13.1-13.4 plus 13.10 for GNN vocabulary. Open notebooks 9.4, 12.4 and 13.1 only when a figure or mechanism is unclear.
- **Required - Implementation:** [D2L - Vision Transformer](https://d2l.ai/) - Use vision-transformer.md for patch extraction, patch embeddings and a tested small encoder. Add a compact SimCLR-style or paired-data contrastive objective in the explicit training loop from Sections 2 and 3.
- **Support - Course:** [Stanford CS231n - transformer and self-supervised assignment slice](https://cs231n.stanford.edu/2025/assignments.html) - Use only the Assignment 3 components for transformers, self-supervised learning, CLIP or DINO that directly test representation and pairing. Keep the controlled local evaluator as the gate.
- **Support - Practice:** [TensorTonic - patchify and symmetric CLIP loss](https://www.tensortonic.com/study-plans/language-modeling-from-scratch) - Solve only Patchify a Batch of Images and Implement Symmetric CLIP Contrastive Loss. Transfer both into the controlled experiment and preserve local leakage and collapse tests.
- **Optional - Practice:** [Deep-ML candidate - InfoNCE Loss](https://www.deep-ml.com/problems) - If the platform admission check passes, use problem 384 once after deriving the objective. Add local tests for temperature extremes, missing positives, duplicate pairs and normalized versus unnormalized embeddings.
- **Required - Paper:** [SimCLR - A Simple Framework for Contrastive Learning of Visual Representations](https://arxiv.org/abs/2002.05709) - Use Section 2.1 Eq. (1) and Algorithm 1 for NT-Xent, 2.3 for the linear-evaluation protocol, 3.1 with Figures 5-6 for augmentation composition and shortcuts, 4.2 for the projection head, and 5.1-5.2 with Table 5 and Figure 9 for temperature and batch-size effects.
- **Required - Paper:** [CLIP - Learning Transferable Visual Models From Natural Language Supervision](https://arxiv.org/abs/2103.00020) - Use Section 2.3 for the symmetric image-text objective and learned temperature, 2.5 for batch size and temperature limits, and 3.1.2 with 3.1.4 for zero-shot transfer and prompt ensembling.
- **Support - Paper:** [SimSiam - Exploring Simple Siamese Representation Learning](https://arxiv.org/abs/2011.10566) - Use Figure 2 and Table 1 for collapse under removed stop-gradient or predictor, including the per-channel spread diagnostic.

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

### Study units

#### U1. Autoencoders and latent-variable models

**About 3 h** · **Target:** Explain + Derive

Topics: Autoencoder reconstruction objectives; Latent variables, priors and approximate posteriors

Every later unit reuses the same split: a prior over z, a decoder likelihood, and an approximate posterior. If this split is vague, the ELBO looks like bookkeeping instead of a bound.

**You can now**

- Derive a mixture-of-Gaussians marginal and state the prior, likelihood and marginal of the nonlinear latent variable model.
- Explain why the VAE is a training architecture while the learned model is the nonlinear latent variable model.
- Contrast a plain autoencoder bottleneck with a probabilistic latent model that defines Pr(x).

**Study**

1. [Latent variable models and the nonlinear generator](https://udlbook.github.io/udlbook/) (Understanding Deep Learning - generative models) - Sections 17.1 and 17.2, with Equations 17.1 to 17.7 (pp. 327 to 330). Depth: Stop before Section 17.3. Training and the ELBO belong to the next unit.
2. [Notebook 17.1: latent variable models](https://github.com/udlbook/udlbook/blob/main/Notebooks/Chap17/17_1_Latent_Variable_Models.ipynb) (Understanding Deep Learning - generative models) - The notebook that accompanies Sections 17.1 and 17.2, margin-noted beside Equation 17.7.

**Focus**

- The marginal Pr(x) = integral Pr(x|z)Pr(z) dz sums over every latent cause. The mixture example (Eq 17.4) is the discrete case; the nonlinear model (Eq 17.7) replaces the table with a network f[z,phi].
- The prior is fixed to N(0,I) (Eq 17.5) while the likelihood N(f[z,phi], sigma squared I) carries the parameters (Eq 17.6). Generation samples z first and never touches the encoder.
- The chapter introduction warns that calling the VAE the model of Pr(x) misleads. The final model is a nonlinear latent variable model with no variational and no autoencoder parts.
- A plain autoencoder minimizes reconstruction through a bottleneck and defines no distribution. The probabilistic model adds prior, likelihood and posterior, which is what makes a likelihood bound possible.

**Reproduce:** Closed-book, write Equations 17.1, 17.2 and 17.7 from memory, then state the prior, likelihood and generation path for a 2D latent and 1D observation.

**Traps**

- Reading the encoder as part of the generative model. Generation draws z from the prior and decodes; the encoder only proposes q during training.
- Treating a low reconstruction error as a likelihood claim. Autoencoders have no Pr(x), so their error cannot be compared with ELBO or flow likelihood numbers.

**Practice**

- [UDL Problems 17.1 to 17.3: MoG parameters, log concavity and Jensen](https://udlbook.github.io/udlbook/) - Problems 17.1 to 17.3 (p. 348): count mixture parameters with ranges, prove log is concave, prove the second-moment bound. Do these on paper before the ELBO unit. Problem 17.2 is the concave-log fact that Jensen needs in Section 17.3.

**Stop when:** You can write the MoG marginal and Eqs 17.5 to 17.7 without notes and explain which parts survive into the final Pr(x).

<details>
<summary>Self-test</summary>

1. A 1D mixture of Gaussians has 5 components. How many raw parameters does it need, and how many are free?
   - 15 raw numbers: 5 means, 5 variances and 5 weights. Weights lie in [0,1] and sum to 1, which removes one degree of freedom, so 14 are free. Means are real and variances are positive.
2. Why does the book say the VAE is an architecture, not the model of Pr(x)?
   - The learned model is the nonlinear latent variable model: prior N(0,I) plus decoder likelihood. The encoder and the sampling step only help optimize the bound and are absent from the final Pr(x).
3. How does a plain autoencoder differ from the VAE bottleneck?
   - An autoencoder learns a low-dimensional code that reconstructs well and defines no distribution. A VAE learns a prior, a likelihood and an approximate posterior, so it defines Pr(x) and a lower bound on its log likelihood.
4. How do you generate from the Section 17.2 model?
   - Draw z from N(0,I), compute f[z,phi], then draw x from N(f[z,phi], sigma squared I). The encoder plays no role.

</details>

#### U2. The ELBO and reparameterized sampling

**About 4 h** · **Target:** Derive + Implement

Topics: ELBO reconstruction and KL terms; Reparameterized sampling and gradient flow

The ELBO is the only training signal in the required VAE build. A sign error in the KL term or a blocked sampler fails silently into blurry reconstructions.

**You can now**

- Derive the ELBO from Jensen and split it into a reconstruction term and a KL term against the prior.
- Implement the one-sample VAE loss with separate reconstruction and KL terms that match the public tests.
- Implement reparameterized sampling so gradients flow through the encoder mean and variance.

**Study**

1. [ELBO derivation and the reconstruction-minus-KL form](https://udlbook.github.io/udlbook/) (Understanding Deep Learning - generative models) - Sections 17.3 to 17.6, with Equations 17.14 to 17.24 (pp. 331 to 338). Depth: Read Section 17.6.1 for the one-sample estimate (Eq 17.23). Leave Sections 17.8 to 17.9 and the Notes for later units.
2. [The reparameterization trick](https://udlbook.github.io/udlbook/) (Understanding Deep Learning - generative models) - Section 17.7 with Equation 17.25 and Notebook 17.2 (pp. 339 to 340).

**Focus**

- Jensen turns log E into E log and creates the bound (Eqs 17.14 to 17.16). Equation 17.17 shows the gap to the true log likelihood is exactly DKL[q||posterior], so the bound is tight when q equals the posterior.
- Equation 17.18 rewrites the same bound as expected log likelihood minus DKL[q||prior]. Section 17.6 conditions q on x to get the VAE form (Eq 17.21) with encoder networks for mean and covariance.
- The one-sample estimate (Eq 17.23) pairs one decoded log likelihood with the closed-form Gaussian KL (Eq 17.24). Keep the two terms separate in code so collapse is visible.
- Reparameterization (Eq 17.25) moves randomness into eps from N(0,I). Backprop passes through mu and Sigma and never down the stochastic branch.

**Reproduce:** Closed-book, derive Equation 17.18 from Equation 17.16 in four lines, then compute the Deep-ML 393 check (0.5 reconstruction, 2.5 KL, 3.0 total) with NumPy.

**Traps**

- Coding std as exp(logvar) instead of exp(0.5 logvar). The samples then have variance sigma to the fourth power while the KL in Eq 17.24 assumes sigma squared.
- Averaging the KL over the wrong axis. The closed form sums over latent dimensions first and then averages over the batch; swapping the two changes the loss scale with latent size.
- Comparing the Equation 17.30 objective with an ordinary ELBO. With beta above 1 it is still a lower bound on log Pr(x), but a looser one, so its value is not comparable with the beta = 1 bound.

**Practice**

- [Deep-ML 393: Implement VAE Loss (ELBO)](https://www.deep-ml.com/problems/393) - Implement vae_loss(x, x_reconstructed, mu, log_var) returning (total, reconstruction, KL); the two public tests check (0.02, 0.02, 0.0) and (3.0, 0.5, 2.5). Solve it changed-prompt: rename the arguments, swap the batch order, and re-derive the KL from Eq 17.24 before coding. The tests check the split, not just the total.

**Stop when:** You derive Eq 17.18 without notes and your vae_loss passes both public tests with the two terms reported separately.

<details>
<summary>Self-test</summary>

1. State the ELBO in reconstruction-minus-KL form and say when it is tight.
   - ELBO = E_q[log Pr(x|z,phi)] - DKL[q||prior] (Eqs 17.18 and 17.21). It equals log Pr(x|phi) minus DKL[q||posterior] (Eq 17.17), so it is tight exactly when q equals the true posterior.
2. Write the reparameterized sample and explain why gradients flow.
   - z* = mu + Sigma^{1/2} eps with eps from N(0,I) (Eq 17.25). Randomness enters through eps, which has no parameters, so gradients flow through mu and Sigma and skip the stochastic branch.
3. For x=[[1,0]], x_hat=[[0.5,0.5]], mu=[[1,2]] and log_var=[[0,0]], what does Deep-ML 393 return?
   - (3.0, 0.5, 2.5). Reconstruction 0.5 is the summed squared error 0.25 + 0.25. KL 2.5 is 0.5 times (1 + 4). Total is their sum.
4. Why does the VAE use one sample per data point in Equation 17.23?
   - The expectation over q is estimated by Monte Carlo with N=1 while the KL stays closed-form. One sample per point is unbiased and keeps the per-step cost low; more samples only reduce estimator variance.

</details>

#### U3. Posterior collapse and decoder capacity

**About 3 h** · **Target:** Measure

Topics: Posterior collapse and decoder capacity

Collapse is the characteristic VAE failure: the loss looks fine while the latent code carries nothing. The checkpoint requires you to produce it on purpose and then bound it.

**You can now**

- Detect posterior collapse from per-dimension KL and from resampling tests on a small VAE.
- Explain why a high-capacity decoder lets the ELBO keep reconstruction while the KL goes to zero.
- Apply KL annealing and decoder-capacity bounds and state what each intervention cannot prove.

**Study**

1. [Posterior collapse and the information preference note](https://udlbook.github.io/udlbook/) (Understanding Deep Learning - generative models) - Notes: the Posterior collapse paragraph and the Chen et al. paragraph (p. 346).
2. [Disentanglement and the beta-weighted loss](https://udlbook.github.io/udlbook/) (Understanding Deep Learning - generative models) - Section 17.8.4 with Equation 17.30 (pp. 342 to 343). Depth: Equation 17.30 with beta above 1 is still a lower bound, only a looser one. The Notes sentence about gradually increasing the KL term describes annealing: the KL weight starts near 0 and rises to 1.

**Focus**

- Collapse means the encoder outputs the prior for every input: per-dimension KL sits near zero and resampling z leaves reconstructions and samples unchanged.
- Chen et al. observed the mechanism: with a PixelCNN-class likelihood the decoder models x alone, so the ELBO keeps reconstruction while the KL term pays for nothing and is driven to zero.
- Beta above 1 in Eq 17.30 pushes q harder toward the prior and raises collapse risk. Annealing starts the KL weight at 0 and raises it to 1 so the code is used before it is taxed.
- The book names VQ-VAE style discrete latents and total-correlation penalties as further directions. Treat them as pointers, not as claims you verified here.

**Reproduce:** Train a tiny VAE on a 2D mixture twice: once with KL weight 1 and once with a large weight such as beta = 10 (or a decoder that also sees x). Log per-dimension KL each epoch. In the collapsed run, show that KL sits near zero and that decoding fresh prior samples gives nearly the same output. Then add annealing from 0 to 1 to the weight-1 run and state the schedule you used.

**Traps**

- Reading a falling total loss as learning. In collapse the reconstruction term improves while the KL term dies; only the split plot shows it.
- Raising the KL weight to fix blurry samples. A larger final weight pressures q toward the prior and makes collapse more likely, not less.

**Practice**

- The section mini-project covers this: a controlled collapse run with per-dimension KL logs, a decoder-capacity ablation, KL annealing from 0 to 1, and a resampling test.

**Stop when:** Your split KL plot shows collapse on demand, annealing restores nonzero KL, and the resampling test passes with the schedule written down.

<details>
<summary>Self-test</summary>

1. What is posterior collapse in one observable sentence?
   - The encoder predicts the prior for every input: per-dimension KL is near zero and resampling z does not change reconstructions or samples.
2. Why does a powerful autoregressive decoder invite collapse?
   - It can model x without z, so the ELBO keeps the reconstruction term while the KL term is pure cost. Optimization then sets q to the prior.
3. What does beta above 1 in Equation 17.30 do to collapse risk?
   - It raises the KL penalty, which pushes q toward the prior and makes collapse more likely. The objective stays a lower bound, only a looser one.
4. Name two measurements that expose collapse.
   - Per-dimension KL near zero across epochs, and a resampling test where fresh z with a fixed decoder leaves outputs unchanged while the loss barely moves.

</details>

#### U4. GAN objectives, alternating updates and mode collapse

**About 4 h** · **Target:** Derive + Explain

Topics: GAN minimax objectives and alternating updates; Generator-discriminator balance and mode collapse

GANs are the adversarial counterpoint to likelihood training: no density, a learned loss, and failures that look like good samples. The minimax argument explains why.

**You can now**

- Derive the minimax losses, the optimal discriminator, and the Jensen-Shannon form of the generator signal.
- Run alternating D-then-G updates with the non-saturating generator loss on a small GAN.
- Distinguish mode dropping from mode collapse and name the imbalance that causes each.

**Study**

1. [Minimax, optimal discriminator and the Jensen-Shannon split](https://udlbook.github.io/udlbook/) (Understanding Deep Learning - generative models) - Sections 15.1 to 15.2.2 with Equations 15.2 to 15.9 (pp. 276 to 283).
2. [Wasserstein, DCGAN recipe and collapse](https://udlbook.github.io/udlbook/) (Understanding Deep Learning - generative models) - Sections 15.2.3 to 15.2.6 on Wasserstein (pp. 284 to 286); Section 15.1.3 DCGAN recipe and Section 15.1.4 with Figure 15.5 on mode dropping and collapse (pp. 279 to 281). Depth: Skip Sections 15.3 to 15.6 here: progressive growing, conditional GANs, translation and StyleGAN are later material.
3. [Basic GAN on a 2D Gaussian](https://d2l.ai/chapter_generative-adversarial-networks/gan.html) (D2L - GAN and DCGAN) - Generate Some Real Data, Generator, Discriminator and Training: 2D Gaussian with A=[[1,2],[-0.1,0.5]] and b=[1,2], linear generator, 3-layer Tanh discriminator, batch size 8, D updated before G each iteration.
4. [DCGAN blocks and Pokemon training](https://d2l.ai/chapter_generative-adversarial-networks/dcgan.html) (D2L - GAN and DCGAN) - The Generator with G_block and the 100-dim latent to 64 by 64 map; Discriminator with D_block and leaky ReLU 0.2; Training with Adam beta1 0.5.

**Focus**

- Equations 15.2 to 15.5 turn binary cross-entropy into a minimax game. The practical generator loss is the non-saturating -log D(G(z)) (label flipped to 1), because the max-log(1-D) form saturates when D is confident.
- Section 15.2.1 shows the optimal discriminator is Pr(x)/[Pr(x)+Pr(fake)], and the loss becomes a Jensen-Shannon divergence split into quality and coverage terms. The book notes that the real-data term of Eq 15.6 does not involve the generator, so nothing directly rewards it for covering missed modes; it calls this the putative reason for mode dropping.
- Section 15.1.4 separates the failures: mode dropping generates a realistic subset (no beards), while collapse maps most z to one or few points and ignores z. Figure 15.5 and the Notes diversity paragraph make this concrete.
- The DCGAN recipe is strided convolutions, BatchNorm in both nets, leaky ReLU in D and Adam with beta1 0.5. D2L updates D first each iteration with detached fakes so no gradient reaches G through the D step.

**Reproduce:** Closed-book, write the two losses of Equation 15.5 and the non-saturating generator loss. Then run the D2L basic GAN for 20 epochs at lr_D 0.05 and lr_G 0.005 and watch the discriminator loss move toward about 0.69 (log 2, the value when D outputs 0.5 everywhere) as the fake scatter covers the real Gaussian.

**Traps**

- Forgetting detach on fake_X in the D step. The D loss then backpropagates into G: wasted compute, and if G's gradients are not zeroed before its own step, G also moves in the direction that helps D.
- Following the DCGAN summary line about BatchNorm literally. The shipped D_block applies BatchNorm in every block including the first, while the paper recipe uses no norm on the discriminator input. Implement the paper variant and note the difference.
- Reading D accuracy 0.5 as proof of distributional match. A finite-capacity D reaches chance on a mode-dropped generator too; the Notes duplicate test shows support can be far smaller than the training set.

**Practice**

- [D2L basic GAN: alternating training on the 2D Gaussian](https://d2l.ai/chapter_generative-adversarial-networks/gan.html) - Training with update_D and update_G: batch size 8, latent dim 2, 20 epochs; confirm D runs before G and fakes use detach. Plot real versus fake scatter at epochs 1, 5 and 20, and add a discriminator-accuracy printout. State the epoch where accuracy first nears 0.5, and remember that chance accuracy does not prove the distributions match.
- [UDL Problem 15.4: divergences for shifted uniforms](https://udlbook.github.io/udlbook/) - Problem 15.4 (p. 303): KL, reverse KL, JS and Wasserstein for uniform [0,1] versus [a,a+1] over a in [-3,3]. Do it on paper: KL is infinite for any nonzero a, JS is |a| log 2 up to 1 and log 2 after, W1 is |a|. This is the disjoint-support case Wasserstein was introduced for.

**Stop when:** You derive the JS split without notes, your D2L run shows D-first updates with detached fakes, and you solve Problem 15.4 for a=0, 0.5 and 2.

<details>
<summary>Self-test</summary>

1. Write the two alternating losses and the update order.
   - D minimizes BCE on real data with label 1 and detached fakes with label 0. G minimizes -log D(G(z)), the same BCE with fake labels flipped to 1. Each iteration updates D first, then G.
2. Why can the generator ignore coverage, according to Section 15.2.1?
   - In Equation 15.6 the real-data term does not involve G, so for a fixed discriminator the generator's gradient comes only from its own samples. Generating a realistic subset is not penalized directly. The book offers this as the putative reason for mode dropping.
3. Distinguish mode dropping from mode collapse.
   - Dropping covers a realistic subset of modes. Collapse maps most or all z to one or few points and ignores the latent input.
4. For uniform [0,1] versus [a,a+1] with a=2, give KL, JS and W1.
   - Both KL directions are infinite because the supports are disjoint. JS is log 2 (1 bit). W1 is |a| = 2.

</details>

#### U5. Diffusion: forward corruption, reverse denoising and prediction targets

**About 5 h** · **Target:** Derive

Topics: Diffusion forward corruption and reverse denoising; Noise, data and velocity prediction recognition

Diffusion training is ELBO arithmetic plus one Gaussian closure. Once the closed form and the noise-to-data map are routine, schedules and samplers become cost choices.

**You can now**

- Derive the one-step forward kernel, the closed-form x0-to-xt sampler and the reverse conditional used for training.
- Derive the diffusion ELBO down to the per-step noise matching loss of Algorithm 18.1.
- Recognize noise, data and velocity prediction targets and state when each stays stable.

**Study**

1. [Forward encoder and closed-form sampling](https://udlbook.github.io/udlbook/) (Understanding Deep Learning - generative models) - Sections 18.1 and 18.2 with Equations 18.1 to 18.8 and Figures 18.2 and 18.3 (pp. 349 to 353).
2. [Reverse decoder, ELBO and the noise reparameterization](https://udlbook.github.io/udlbook/) (Understanding Deep Learning - generative models) - Sections 18.3 to 18.5 with Equations 18.16 to 18.40 and Algorithm 18.1 (pp. 356 to 363).
3. [Velocity parameterization](https://arxiv.org/html/2202.00512v2) (Progressive Distillation for Fast Sampling of Diffusion Models) - Section 4: the v = alpha eps - sigma x definition with x_hat = alpha zt - sigma v_hat, and the low signal-to-noise stability argument. Depth: Read only the parameterization and loss-weighting discussion. Leave Algorithms 1 and 2 and all distillation results for later.

**Focus**

- The forward kernel is q(zt|zt-1) = N(sqrt(1-beta_t) zt-1, beta_t I) (Eq 18.2). Products of Gaussians close in closed form: xt = sqrt(alpha_bar_t) x0 + sqrt(1-alpha_bar_t) eps with alpha_bar_t the product of (1-beta_s) (Eqs 18.7 and 18.8).
- The reverse conditional q(zt-1|zt,x) (Eq 18.15) trains the decoder. The ELBO (Eq 18.25) becomes per-step KL terms that reduce to squared error between the true reverse mean and f_t (Eqs 18.28 and 18.29).
- Section 18.5 converts data prediction into noise prediction through Eq 18.30 and trains g to output eps with the plain loss of Eq 18.40. The map is linear, so the two targets carry the same information with different conditioning.
- Velocity v = alpha eps - sigma x keeps the implied x prediction stable when signal-to-noise goes to zero, where eps-to-x division by alpha blows up. UDL never names it, so the paper supplies this one recognition item.

**Reproduce:** Closed-book, derive the three-step closed form of Problem 18.3 from Equations 18.5 to 18.7, then verify with NumPy that x0=[1,2] at t=3 with eps=[0.5,-0.5] on linspace(0.1,0.2,5) gives [1.1057,1.3488].

**Traps**

- Scaling the mean by 1 - beta instead of sqrt(1 - beta). The square root is what keeps the variance at 1 when the input has unit variance (Problem 18.1); without it the signal shrinks faster than the noise is added.
- Indexing alpha_bar at t instead of t-1 in the reverse mean. The coefficient (1-alpha_{t-1})/(1-alpha_t) in Eq 18.28 is sensitive to this shift; test t=1 separately.
- Treating noise, data and velocity targets as different models. They parameterize the same reverse mean; only their numerical behavior at low signal-to-noise differs.

**Practice**

- [UDL Problems 18.1 to 18.3: variance preservation and the closed form](https://udlbook.github.io/udlbook/) - Problems 18.1 to 18.3 (pp. 372 to 373): covariance preservation, combining two noises, and the three-step expansion to Eq 18.45. Do all three on paper, then check the [1.2649] and [1.1057,1.3488] numbers with NumPy. These are the forward-process facts every sampler assumes.

**Stop when:** You derive Eq 18.8 without notes, both numeric checks match to 4 decimals, and you can convert a noise output into data and velocity forms.

<details>
<summary>Self-test</summary>

1. Write the one-step forward kernel and the direct x0-to-xt sampler.
   - q(zt|zt-1) = N(sqrt(1-beta_t) zt-1, beta_t I). Then xt = sqrt(alpha_bar_t) x0 + sqrt(1-alpha_bar_t) eps with alpha_bar_t the product of (1-beta_s) over s=1 to t.
2. With a linear beta schedule linspace(0.1,0.2,5), what is x_1 for x0=[1.0] and eps=[1.0]?
   - [1.2649]. alpha_bar_1 is 0.9, so sqrt(0.9) + sqrt(0.1) = 0.9487 + 0.3162.
3. How are noise prediction and data prediction related?
   - By x = (zt - sqrt(1-alpha_t) eps)/sqrt(alpha_t) (Eqs 18.30 and 18.31). UDL trains g to predict eps (Eqs 18.35 to 18.40); the data estimate follows by this linear map.
4. State the velocity target and why it helps.
   - v = alpha_t eps - sigma_t x with x_hat = alpha_t zt - sigma_t v_hat. It stays well scaled at zero signal-to-noise, where converting an eps prediction to x divides by alpha near zero.

</details>

#### U6. Diffusion sampling schedules, cost and guidance

**About 3 h** · **Target:** Explain

Topics: Schedules, iterative sampling and compute-quality trade-offs; Conditioning and guidance at recognition depth

A trained denoiser is not yet a generator. Sampling cost and conditioning decide whether the model is usable, and both are set after training.

**You can now**

- Explain why ancestral sampling needs about 1000 serial U-Net evals and what DDIM changes.
- Compare step-count versus quality trade-offs including the 50-step DDIM point and cascades.
- Distinguish classifier guidance from classifier-free guidance and predict the stereotyping effect of overweighting.

**Study**

1. [Implementation: U-Net, time embedding, DDIM and cascades](https://udlbook.github.io/udlbook/) (Understanding Deep Learning - generative models) - Section 18.6 with Algorithms 18.1 and 18.2 and Notebooks 18.3 and 18.4 (pp. 363 to 368).
2. [Conditioning and guidance](https://udlbook.github.io/udlbook/) (Understanding Deep Learning - generative models) - Sections 18.6.3 and 18.6.4 with Equation 18.41 on classifier guidance and the classifier-free paragraph (pp. 365 to 368). Depth: Read for schedule, step-count and guidance mechanics at recognition depth. Do not train a large image model here.

**Focus**

- One U-Net maps zt to an eps estimate at one noise level, conditioned on a sinusoidal time embedding. Ancestral sampling (Algorithm 18.2) calls it serially about 1000 times per image, so cost scales with steps, not with parameters alone.
- DDIM is a deterministic integrator of the probability-flow ODE: it drops per-step noise and gives good samples in about 50 steps on the book example. The Notes add latent-space diffusion as the further speedup used by Stable Diffusion.
- Classifier guidance adds sigma_t squared times grad log Pr(c|zt) from a separate noisy classifier (Eq 18.41). Classifier-free guidance trains g(zt,phit,c) with randomly dropped labels and mixes conditional and unconditional scores at sample time.
- Overweighting the conditioning improves apparent quality but produces stereotyped outputs. The book draws the same trade as GAN truncation: less variety for cleaner exemplars.

**Reproduce:** Write Algorithm 18.2 (ancestral sampling) from memory, then write how a deterministic DDIM sampler on a 50-step subsequence changes it. Count network evaluations per sample for both, 1000 against 50, and if you trained a model in the CS231n notebook, time both samplers.

**Traps**

- Calling DDIM faster per step. The gain is fewer steps with a different integrator, not a cheaper network; one DDIM step costs about the same as one ancestral step.
- Reading guidance scale as likelihood tempering. It reweights the conditional score at sample time and changes coverage; it does not retrain the density.
- Comparing step counts across different noise schedules. Fifty steps under one schedule is not the same compute-quality point as fifty under another; always fix the schedule first.

**Practice**

- [Stanford CS231n Assignment 3 Q3: DDPM notebook (conditional)](https://cs231n.github.io/assignments2025/assignment3/) - Q3 Denoising Diffusion Probabilistic Models, DDPM.ipynb in the starter code (https://cs231n.github.io/assignments/2026/assignment3.zip); attempt the forward-process and loss parts only, after the VAE gate. Use it as a mechanics check if diffusion sampling still feels vague. It is not a second required generative implementation; stop before large-scale image training.

**Stop when:** You can cost a sampler in U-Net evals, explain the 1000 versus 50 step points, and state which guidance form a config uses from its sampling code.

<details>
<summary>Self-test</summary>

1. Why is diffusion sampling slow, in one line of arithmetic?
   - Each reverse step needs one full U-Net eval and good ancestral images need about 1000 serial steps, so one sample costs about 1000 network passes.
2. What does DDIM change?
   - It integrates the probability-flow ODE deterministically without per-step noise, so the book gets good samples in about 50 steps. It is still slower than most GAN sampling.
3. Contrast classifier guidance with classifier-free guidance.
   - Classifier guidance adds the gradient of a separately trained noisy classifier (Eq 18.41). Classifier-free guidance folds the class into the denoiser, drops it at random during training, and mixes conditional and unconditional predictions at sample time.
4. What happens when conditioning is over-weighted?
   - Higher apparent quality but stereotyped, low-variety samples. UDL notes the same quality-variety trade as GAN truncation.

</details>

#### U7. Evaluating and comparing generative model families

**About 3 h** · **Target:** Explain

Topics: Reconstruction, likelihood and sample-quality limits; Autoregressive, latent, adversarial and diffusion comparisons; Normalizing-flow likelihood contrast

Every family optimizes a different proxy, and every metric rewards a different slice. Choosing or trusting a model without this map repeats the section checkpoint failure.

**You can now**

- State what likelihood, ELBO, reconstructions and samples each prove and what each hides.
- Compute Inception Score limits, FID behavior and precision-recall splits for a stated failure.
- Contrast flows, VAEs, GANs and diffusion by likelihood, sampling, coverage, stability and evaluation at recognition depth.

**Study**

1. [What makes a good model and how to quantify it](https://udlbook.github.io/udlbook/) (Understanding Deep Learning - generative models) - Sections 14.2 and 14.3 with Figure 14.3, Equations 14.1 to 14.3, and the test likelihood, inception, FID and precision-recall paragraphs (pp. 270 to 275).
2. [Flow likelihood contrast at recognition depth](https://udlbook.github.io/udlbook/) (Understanding Deep Learning - generative models) - Sections 16.1 to 16.2 with Equations 16.1 to 16.3, and Section 16.3.3 coupling Equations 16.13 and 16.14 (pp. 304 to 312). Depth: Read flows only far enough to state the change-of-variables likelihood and why coupling keeps the Jacobian triangular. Leave residual, autoregressive and multiscale flow details for later.

**Focus**

- Test likelihood needs a density: flows give it exactly (Eqs 16.1 to 16.3), VAE and diffusion give a lower bound, and GANs give nothing because they only sample. Training likelihood is not a generalization claim.
- Inception Score (Eqs 14.2 and 14.3) rewards one realistic example per ImageNet class under one classifier. FID fits Gaussians to Inception features of real and fake sets, so it sees within-class spread but only through retained features. Precision-recall splits the two: realism versus coverage via k-nearest hyperspheres.
- Figure 14.3 summarizes the trade: no family has efficient sampling, top quality, full coverage, a good latent space and exact likelihood at once. Quote the row, not a slogan.
- Coupling (Eqs 16.13 and 16.14) leaves half the variables fixed and applies an invertible elementwise map to the rest with params from the fixed half. The Jacobian is triangular, so the determinant is the diagonal product and both directions stay cheap.

**Reproduce:** Closed-book, derive the Problem 16.1 density 1/(2 sqrt(x)) and check its integral equals 1, then fill one Figure 14.3 row per family from memory.

**Traps**

- Comparing likelihood numbers across families or preprocessings. VAE and diffusion report bounds, flows report exact values, and any dequantization or resolution change breaks comparability.
- Reporting one FID from few samples or mismatched Inception weights. FID is a distribution distance under a Gaussian fit; small sample counts and different feature layers move it without any model change.
- Treating low FID as proof of coverage. A mode-dropped GAN can score well; only the recall side or a duplicate test like the Notes 400-sample argument addresses support size.

**Practice**

- [UDL Problems 16.1 and 16.2: 1D flow densities](https://udlbook.github.io/udlbook/) - Problems 16.1 and 16.2 (p. 325): uniform through x = z squared and standard normal through the sigmoid. Derive both densities by CDF differentiation and verify each integrates to 1. These are the smallest exact-likelihood claims in the section.

**Stop when:** You can place any two families on likelihood, sampling cost, coverage and evaluation without notes and name the metric that would catch a mode-dropped winner.

<details>
<summary>Self-test</summary>

1. Which families give exact likelihood, a lower bound, or nothing?
   - Flows give exact likelihood by change of variables. VAE and diffusion give a lower bound through the ELBO. GANs give no density; they sample without evaluating probabilities.
2. State the 1D flow density for uniform z through x = z squared.
   - Pr(x) = 1/(2 sqrt(x)) on (0,1]. The CDF is P(X<=x) = sqrt(x); differentiate to get the density, which integrates to 1.
3. Why is Inception Score insufficient, and what do FID and precision-recall add?
   - IS needs ImageNet classes and one classifier and rewards a single good example per class. FID compares Gaussian-fitted Inception features of both sets, capturing within-class spread through retained features. Precision-recall splits realism (fakes inside the real manifold) from coverage (real data inside the fake manifold).
4. How does coupling keep flows tractable?
   - Half the variables pass through unchanged while the rest get an elementwise invertible map with parameters from the fixed half. The Jacobian is triangular, so its determinant is the product of diagonal terms and both directions stay cheap.

</details>

### Mini-project: Compact VAE with a controlled collapse study

**About 8 to 12 hours.** Derive and implement a small VAE, then run a controlled study that produces posterior collapse on purpose, measures it per latent dimension and repairs it. Compare with a small GAN on a 2D mixture, and end with what the loss, reconstructions and samples cannot prove.

1. Derive the ELBO for a diagonal Gaussian encoder, including the closed-form KL per dimension, and implement it with the reparameterization trick. Pass Deep-ML 393, and test your KL against torch.distributions.kl_divergence and a Monte Carlo estimate.
2. Train a small VAE on binarized MNIST, or on a 2D mixture if you only have a CPU, and log the reconstruction term, the total KL and the KL of each latent dimension every epoch.
3. Produce collapse on purpose with a much stronger decoder or a large KL weight such as beta = 10. Show most dimensions with KL near zero, and a resampling test: decoding fresh prior samples gives nearly the same output.
4. Ablate decoder capacity or beta at three settings, and add KL annealing from 0 to 1 over a stated number of steps. Report active units, the dimensions whose KL exceeds a threshold you state, for each run.
5. Report the test ELBO in nats per example beside reconstructions and samples, and give one way each of the three could mislead.
6. Train a small GAN on an eight-Gaussian 2D mixture with alternating updates, and count the modes its samples cover with a fixed sample size and distance threshold, over training and two seeds.

**Deliverables**

- The VAE code with ELBO tests: Deep-ML 393, the KL checks and the resampling test.
- The collapse study: per-dimension KL plots, active-unit counts, the ablation and the annealing run, plus the GAN mode-coverage plot.
- A limits note on what the loss, reconstructions and samples cannot prove, citing your own runs.

**Checks**

- external-tests: [Deep-ML 393: Implement VAE Loss (ELBO)](https://www.deep-ml.com/problems/393). Its tests use a squared-error reconstruction term with the closed-form Gaussian KL.
- rubric: Self-grade with the rubric below.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Objective | Deep-ML 393 passes, and the closed-form KL matches torch.distributions within float tolerance. | The Monte Carlo KL estimate agrees within its standard error, and the note derives the per-dimension KL. |
| Controlled collapse | One run shows most dimensions with near-zero KL, and the resampling test confirms the decoder ignores z. | The ablation reports active units across two seeds and explains any setting that breaks the trend. |
| Repair | Annealing or a capacity change restores active units under the stated threshold. | You report the repair's cost in ELBO and reconstruction, not only its benefit. |
| Mode coverage | GAN coverage of the eight modes is counted with a stated threshold and sample size. | Coverage is tracked over training and across two seeds, and drops are tied to the alternating updates. |
| Honest limits | The note gives one way each of loss, reconstructions and samples can mislead. | Each claim points to a run in your study that shows it. |

Feeds into: Capstone artifact 2 can use this VAE as its trained model, and the collapse study can be a casebook postmortem.

### Resource route

- **Primary - Theory:** [Understanding Deep Learning - generative models](https://udlbook.github.io/udlbook/) - Read Chapter 14 for evaluation limits, 15 for GANs, 17 for VAE and ELBO, and 18 for diffusion. Read Chapter 16 only for flow recognition. Use notebooks 17.1-17.3 and 18.1-18.4 as mathematical and visual practice.
- **Support - Implementation:** [D2L - GAN and DCGAN](https://d2l.ai/) - Use gan.md and dcgan.md for one bounded adversarial exposure. The required implementation remains a small VAE with separate reconstruction and KL terms on a two-dimensional mixture or binarized MNIST subset.
- **Optional - Practice:** [Deep-ML candidate - VAE, GAN and diffusion problems](https://www.deep-ml.com/problems) - After the platform admission check, use at most one of 393 VAE Loss, 1384 Reparameterization, 174 1D GAN or 303 Forward Diffusion as a changed-prompt drill.
- **Optional - Course:** [Stanford CS231n - diffusion assignment slice](https://cs231n.stanford.edu/2025/assignments.html) - Use the Assignment 3 diffusion component only after the VAE gate if diffusion mechanics remain weak. It is not a second required generative implementation.
- **Reference - Reference:** [Progressive Distillation for Fast Sampling of Diffusion Models](https://arxiv.org/html/2202.00512v2) - Read Section 4 only for the velocity parameterization v = alpha eps - sigma x and why it stays stable at zero signal-to-noise ratio. Leave Algorithms 1 and 2 and the distillation results for later.

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

### Study units

#### U1. Queries, keys, values and scaled dot-product attention

**About 4 h** · **Target:** Derive + Implement

Topics: Query, key and value projections; Scaled dot-product attention; Stable row-wise softmax

Attention is the only communication path between positions in a transformer. If the scale, the softmax axis or the stability fix is wrong, every later block inherits the error.

**You can now**

- Derive the 1/sqrt(d_k) scale from unit-variance query and key components and state the assumption it needs.
- Implement stable scaled dot-product attention from tensor operations, with a row-wise softmax that cannot overflow in fp32.
- Explain attention output as a convex combination of values and predict how a logit shift moves the weights.

**Study**

1. [Dot-product self-attention through scaling](https://udlbook.github.io/udlbook/) (Understanding Deep Learning - Transformers) - Sections 12.2 to 12.3.2 (pp. 208 to 214): value, query and key computation in equations 12.2 to 12.4, attention weights in 12.5, matrix form in 12.7 and 12.8, and the scaling argument with equation 12.9.
2. [Notebook 12.1: self-attention](https://github.com/udlbook/udlbook/blob/main/Notebooks/Chap12/12_1_Self_Attention.ipynb) (Understanding Deep Learning - Transformers) - The complete notebook, referenced in the margin of the matrix-form derivation.
3. [Queries, keys and values](https://d2l.ai/chapter_attention-mechanisms-and-transformers/queries-keys-values.html) (D2L - attention and transformer implementation route) - Section 11.1: the attention-pooling equation, the nonnegative, convex-combination, single-selection and average-pooling cases, and show_heatmaps.
4. [Dot-product attention and scaling](https://d2l.ai/chapter_attention-mechanisms-and-transformers/attention-scoring-functions.html) (D2L - attention and transformer implementation route) - Section 11.3.1 including the variance-d derivation of the scaled scoring function, then the Scaled Dot Product Attention class with the (2, 1, 2) query toy and heatmap check. Depth: Skip Additive Attention; it is not a unit topic. Read the batch matrix multiplication part of Section 11.3.2 for shapes only.
5. [Equivalent-implementation box](https://docs.pytorch.org/docs/stable/generated/torch.nn.functional.scaled_dot_product_attention.html) (PyTorch - scaled dot product attention) - The Efficient implementation equivalent code box: default scale 1/sqrt(E), score-times-scale order, and softmax-then-dropout order.

**Focus**

- Queries, keys and values are three learned linear maps of the same input. D2L builds them bias-free by default while UDL equations 12.4 and 12.6 carry bias vectors, so the two parameter counts differ by construction.
- Under independent zero-mean unit-variance components, q^T k has variance d. The 1/sqrt(d) factor restores unit variance before the softmax; without it large d saturates the softmax and gradients vanish.
- Stable softmax subtracts the row max first. Naive fp32 softmax on the UDL Problem 12.4 logits overflows at exp(100): that entry becomes inf/inf, which is NaN, and the rest become 0. The shifted form returns the correct weights.
- UDL lays inputs out as D by N columns with softmax per column; D2L uses batch by queries by keys with softmax on the last axis. In both, exactly one axis sums to 1: check which one before reading any heatmap.

**Reproduce:** Closed-book, derive the 1/sqrt(d) scale from the variance argument. Then hand-compute the Deep-ML 490 first test: scores [[0.7071, 0], [0, 0.7071]], weights [[0.6698, 0.3302], [0.3302, 0.6698]], output [[1.6605, 2.6605], [2.3395, 3.3395]].

**Traps**

- Computing softmax as exp(z)/sum(exp(z)) in fp32. exp(100) overflows to inf, so the sum is inf, the large entry becomes NaN and every other entry 0. Always subtract the row max, and recheck any code that skips it.
- Softmaxing the wrong axis after a transpose. UDL and D2L sum over different axes by layout; a heatmap that sums to 1 along queries instead of keys inverts the routing story.
- Quoting D2L parameter counts for UDL equations or vice versa. The bias terms add 3D parameters; carry them only when the equations you implement include them.

**Practice**

- [Deep-ML 490: Build Scaled Dot-Product Attention](https://www.deep-ml.com/problems/490) - Both shown tests (the 2x2 identity Q/K case and the 1x3 over 2x3 case) plus the prompt mask rule (0 blocks, 1 keeps). The two shown tests are unmasked and check outputs and weights to 4 decimals. Add your own hand-computed masked case before the masks unit.

**Stop when:** You derive the scale without notes, reproduce the 490 numbers by hand, and your own implementation matches a softmax-based reference on random small cases.

<details>
<summary>Self-test</summary>

1. Query and key components are independent with zero mean and unit variance, in dimension d. What are the mean and variance of their dot product, and what scale restores unit variance?
   - Mean 0 and variance d, since the dot product sums d independent unit-variance products. Multiply by 1/sqrt(d) to restore unit variance before the softmax.
2. Naive fp32 softmax meets UDL Problem 12.4 logits [-3, 1, 100, 5, -1]. What comes out, what does the max-subtracted form give, and what do the 25 derivatives say?
   - Naive exp overflows at exp(100), so the denominator is inf and the output is [0, 0, NaN, 0, 0]. Max-subtracted softmax gives y3 near 1 and the rest near 0. All 25 derivatives are near 0 (largest magnitude about 5.5e-42): a saturated softmax with vanishing gradients.
3. A self-attention block takes N = 5 inputs of width D = 8, with queries, keys and values also width 8. How many QKV weights and biases, how many attention weights, and how many weights and biases in a fully connected DN to DN map?
   - QKV: 3 times (64 + 8) = 216. Attention weights: 25. Fully connected: 1600 weights plus 40 biases = 1640.
4. Why must attention weights be nonnegative and sum to one, and where does each output lie?
   - They form a convex combination, so each output is a weighted average of the value vectors and lies in their convex hull. Routing language only makes sense under this constraint.

</details>

#### U2. Causal masks, padding masks and fully masked rows

**About 3 h** · **Target:** Implement + Measure

Topics: Causal masks, padding masks and all-masked rows

Masks decide which tokens may speak to which. A leak through a future position or a padding slot silently changes the objective the model optimizes.

**You can now**

- Combine causal and padding masks into one score bias and predict each row's valid positions.
- Implement valid-length masking and state exactly what a fully masked row returns.
- Prove causal behavior with a future-token intervention test rather than by inspecting weights.

**Study**

1. [Masked self-attention and interaction matrices](https://udlbook.github.io/udlbook/) (Understanding Deep Learning - Transformers) - Section 12.7.2 (pp. 222 to 223): setting dot products to negative infinity before softmax, with Figure 12.12 loss wiring; Section 12.9 with Figure 12.15 (pp. 227 to 228) for encoder versus decoder interaction counts.
2. [Masked softmax operation](https://d2l.ai/chapter_attention-mechanisms-and-transformers/attention-scoring-functions.html) (D2L - attention and transformer implementation route) - Section 11.3.2 Masked Softmax Operation: the -1e6 fill, and both runnable examples on (2, 2, 4) inputs with valid lengths [2, 3] and [[1, 3], [2, 4]].
3. [Decoder causal lengths](https://d2l.ai/chapter_attention-mechanisms-and-transformers/transformer.html) (D2L - attention and transformer implementation route) - TransformerDecoderBlock: the training branch building dec_valid_lens rows [1, 2, ..., num_steps], and the inference branch passing None with cached key_values.
4. [Mask semantics, causality and dropout](https://docs.pytorch.org/docs/stable/generated/torch.nn.functional.scaled_dot_product_attention.html) (PyTorch - scaled dot product attention) - The boolean-mask Note (True means participate, inverse of MultiheadAttention key_padding_mask), the is_causal parameter entry including the non-square upper-left bias, and the dropout Warning that dropout applies in every mode.

**Focus**

- Padding and causal masks compose by intersection: a score survives only if both allow it. D2L valid_lens expresses padding lengths, the decoder [1..n] rows express causality, and a real batch needs both at once.
- Mask value conventions differ by API. SDPA bool True means participate while MultiheadAttention key_padding_mask True means mask out. Copying one convention into the other leaks padding.
- A fully masked row has no agreed meaning. D2L -1e6 gives uniform weights, all -inf through plain softmax gives NaN, and SDPA on CPU returned zeros in version 2.14. Test your convention instead of assuming one.
- SDPA applies dropout_p in every mode. Pass 0.0 outside training or evaluation outputs stay stochastic.

**Reproduce:** From a blank file, build combined causal plus padding masks for two sequences of valid lengths 3 and 2 over 4 keys, show every disallowed weight is exactly 0, then change a future token and a padded value and show the earlier valid outputs do not move.

**Traps**

- Trusting uniform weights on a fully masked row. D2L returns 1/n there, so padding values still mix into the output unless you zero the row downstream.
- Passing both attn_mask and is_causal to SDPA. The function raises an error; pick one expression of the same mask.
- Leaving dropout_p nonzero during evaluation or testing. Outputs differ run to run and differential tests against a manual path fail for no structural reason.

**Practice**

- [Deep-ML 490 masked-case drill](https://www.deep-ml.com/problems/490) - The prompt mask rule (0 blocks, 1 keeps); the two shown tests are unmasked. Hand-compute a two-query masked case, assert blocked weights are exactly 0, and add a future-token intervention test in your own repository.

**Stop when:** Your combined mask gives exact zeros in every disallowed slot, the intervention test passes, and you can state each API mask convention and fully-masked-row behavior from memory.

<details>
<summary>Self-test</summary>

1. D2L masked_softmax meets a row with valid length 0 over 4 keys. What weights come out and why is that dangerous?
   - Uniform weights 0.25 each: all four -1e6 entries softmax equally. The output mixes padding values with full weight, so the row must be zeroed or excluded downstream.
2. An SDPA bool mask marks padding as True. What happens, and how does MultiheadAttention key_padding_mask differ?
   - SDPA treats True as participate, so padding joins attention: a leak. MultiheadAttention key_padding_mask uses the inverse convention, True means mask out. Invert when migrating.
3. Why is a future-token intervention a stronger causal proof than reading attention weights?
   - Weights show one layer; dropout, residuals and later layers remix paths. Perturbing a future token and requiring earlier outputs to stay fixed tests the composed block, including leaks through paths the weight plot never shows.
4. SDPA is called with dropout_p 0.5 during evaluation. What goes wrong?
   - Dropout still applies in every mode, so outputs stay stochastic. Pass 0.0 when the caller is not training.

</details>

#### U3. Self-attention, cross-attention and multi-head shapes

**About 4 h** · **Target:** Implement

Topics: Self-attention versus cross-attention; Multi-head shapes, concatenation and output projection

Heads are parallel representation subspaces, and cross-attention is the bridge between sequences. Shape errors here run without error and fail silently as wrong mixing.

**You can now**

- Distinguish self-attention from cross-attention by which tensors supply queries, keys and values.
- Implement head splitting, per-head attention, concatenation and output projection with exact shapes.
- Explain why fixing total width while varying head count holds parameters and compute flat.

**Study**

1. [Multi-head self-attention](https://udlbook.github.io/udlbook/) (Understanding Deep Learning - Transformers) - Section 12.3.3 (pp. 214 to 215): per-head equations 12.10 and 12.11, D/H sizing, and concatenation with output projection in equation 12.12.
2. [Cross-attention for encoder-decoder models](https://udlbook.github.io/udlbook/) (Understanding Deep Learning - Transformers) - Section 12.8 with Figure 12.14 (pp. 226 to 227): queries from decoder embeddings, keys and values from encoder embeddings.
3. [Notebook 12.2: multi-head self-attention](https://github.com/udlbook/udlbook/blob/main/Notebooks/Chap12/12_2_Multihead_Self_Attention.ipynb) (Understanding Deep Learning - Transformers) - The complete notebook, referenced in the margin of the multi-head derivation.
4. [Multi-head attention implementation](https://d2l.ai/chapter_attention-mechanisms-and-transformers/multihead-attention.html) (D2L - attention and transformer implementation route) - Section 11.5: the head equations with p set to num_hiddens over num_heads, transpose_qkv and transpose_output, the valid_lens repeat per head, and the num_hiddens 100 with num_heads 5 shape check.
5. [Self-attention call and decoder cross-attention](https://d2l.ai/chapter_attention-mechanisms-and-transformers/self-attention-and-positional-encoding.html) (D2L - attention and transformer implementation route) - Section 11.6 Self-Attention: the attention(X, X, X, valid_lens) toy with batch 2, 4 queries and width 100. Depth: Stop before the CNN, RNN and self-attention comparison and before Positional Encoding; both belong to later units.
6. [Decoder self versus encoder-decoder attention](https://d2l.ai/chapter_attention-mechanisms-and-transformers/transformer.html) (D2L - attention and transformer implementation route) - TransformerDecoderBlock: attention1 over (X, key_values, key_values) with dec_valid_lens versus attention2 over (Y, enc_outputs, enc_outputs) with enc_valid_lens.

**Focus**

- D2L sets per-head width to num_hiddens over num_heads, so all four projections stay num_hiddens by num_hiddens. The head count changes mixing, not size.
- Heads fold into the batch axis: (batch, steps, heads, width) becomes (batch times heads, steps, width) for the shared attention call, then unfolds back. valid_lens must repeat once per head to stay aligned.
- Cross-attention reuses the identical math with different sources: queries from the decoder state, keys and values from encoder outputs, with padding-only lengths.
- UDL Problem 12.5 is the cost intuition: narrow heads at fixed total width keep the implementation efficient.

**Reproduce:** Closed-book, walk shapes for batch 2, 4 queries, width 100, 5 heads: projections stay (2, 4, 100), folded per-head tensors are (10, 4, 20), concatenation restores (2, 4, 100). State BERT per-head width 64 from 1024 over 16 heads.

**Traps**

- Folding heads with one reshape. Going straight from (batch, steps, hidden) to (batch times heads, steps, hidden/heads) runs without error but gives each head a mix of positions. Split hidden into (heads, head width), move the head axis next to batch, then merge, as transpose_qkv does.
- Repeating valid_lens in the wrong order. D2L folds batch-major, so lengths need repeat_interleave ([l0, l0, l1, l1]). Tiling with repeat ([l0, l1, l0, l1]) has the right length and silently masks heads with another example's length. Dropping the repeat fails loudly in masked_softmax.
- Assuming cross-attention needs a new formula. Only the sources change; calling self-attention with (Y, encoder outputs, encoder outputs) is the whole difference.

**Practice**

- [TensorTonic: Named-Dimension Batched Attention Scores](https://www.tensortonic.com/problems/cs336-l02-einsum-attention-scores) - The single named problem in the PyTorch and einops group: batched multi-head query-key scores contracting only the head-width dimension. The problem page renders client-side; the verified contract is its title and description. Implement scores with named batch, head, sequence and width axes, then cross-check against your multi-head block under batch and head permutations.
- [D2L Multi-Head Attention: Exercise 1 (visualize heads)](https://d2l.ai/chapter_attention-mechanisms-and-transformers/multihead-attention.html) - Exercises in Section 11.5: visualize attention weights of multiple heads in the toy experiment. Plot one head per panel on the same input and confirm different heads attend differently; identical panels expose a split bug.

**Stop when:** Your multi-head block returns (2, 4, 100) on the D2L toy, per-head weights match a manual single-head call, and masking with valid lengths [3, 2] zeroes the same key slots in every head.

<details>
<summary>Self-test</summary>

1. BERT uses width 1024 with 16 heads. What is the per-head width, and what shape are its per-head query matrices?
   - 64. Each per-head query, key and value matrix is 64 by 1024.
2. Why does fixing total width while varying head count hold parameters and compute flat?
   - All four projections stay num_hiddens by num_hiddens regardless of head count, so QKVO parameters stay 4 times width squared and per-head matmuls sum back to the same total.
3. In the D2L decoder block, which tensors supply queries, keys and values to the second attention call, and which lengths mask it?
   - Queries come from the decoder state Y after self-attention; keys and values come from encoder outputs. Only encoder padding lengths mask it; there is no causal mask on this call.
4. The valid_lens repeat per head is deleted. What breaks?
   - The folded batch has batch times heads rows but only batch lengths, so D2L masked_softmax fails with a mask shape error. The silent form of the bug is tiling with repeat instead of repeat_interleave: the count matches, but heads use another example's length.

</details>

#### U4. Positional information and position offsets

**About 3 h** · **Target:** Derive + Implement

Topics: Positional information and position offsets

Self-attention sees sets, not sequences. Positional information is the only place order enters, so every offset bug becomes a meaning bug.

**You can now**

- Prove permutation equivariance of unpositioned self-attention and explain why order needs extra input.
- Implement sinusoidal absolute encodings and predict any entry from the closed form.
- Derive the relative-offset rotation and use it to explain shift generalization.

**Study**

1. [Positional encoding](https://udlbook.github.io/udlbook/) (Understanding Deep Learning - Transformers) - Section 12.3.1 (pp. 213 to 214): permutation equivariance, absolute encoding matrix, and relative per-offset parameters, with Figure 12.5.
2. [Positional encoding implementation and theory](https://d2l.ai/chapter_attention-mechanisms-and-transformers/self-attention-and-positional-encoding.html) (D2L - attention and transformer implementation route) - Positional Encoding: the sine-cosine formula, the PositionalEncoding class with max_len 1000 and dropout after the add, the encoding_dim 32 with num_steps 60 run plotting columns 6:10, the binary-frequency intuition, and the relative-offset rotation derivation.
3. [Order-free self-attention](https://d2l.ai/chapter_attention-mechanisms-and-transformers/self-attention-and-positional-encoding.html) (D2L - attention and transformer implementation route) - The paragraphs before Positional Encoding on parallel computation discarding sequential order.

**Focus**

- Without positions the block is permutation-equivariant: Sa[XP] equals Sa[X]P. UDL Problem 12.3 asks for this proof; it is the reason order must be injected as input.
- Absolute encodings add a unique column per position. The D2L TransformerEncoder scales embeddings by sqrt(width) before the add because the encodings stay in [-1, 1].
- Sinusoid pairs rotate with offset: position i plus delta is a fixed 2x2 rotation of position i, depending on delta and frequency only. Shifting text shifts encodings linearly.
- Relative schemes index by the offset between key and query positions, not by absolute index. They survive absolute shifts that absolute tables must relearn.

**Reproduce:** Closed-book, write p(i, 2j) and p(i, 2j+1), sketch the Sa[XP] equals Sa[X]P proof, and verify the 2x2 rotation numerically for one (i, delta, j) triple.

**Traps**

- Not stating where positions enter. UDL lists three placements: once at the input, at every layer, or only in the query and key computation. The last leaves values free of position, which changes what later layers can read; write down which one your block uses.
- Exceeding D2L max_len 1000. The stored table is fixed width, so longer inputs fail on the add; rebuild the table instead of truncating silently.
- Comparing encodings or outputs in train mode. D2L applies dropout to the sum of embeddings and encodings, so train-mode runs drop entries at random; compare in eval mode or with dropout 0, as the D2L plot does.

**Practice**

- [D2L PositionalEncoding: frequency and offset check](https://d2l.ai/chapter_attention-mechanisms-and-transformers/self-attention-and-positional-encoding.html) - The encoding_dim 32 with num_steps 60 run plotting columns 6:10, plus the relative-offset rotation derivation. Reproduce the column plot, then assert the 2x2 rotation identity numerically for one (i, delta, j) triple in your own repository.
- [UDL Problem 12.3: permutation equivariance](https://udlbook.github.io/udlbook/) - Problems (p. 239): show Sa[XP] equals Sa[X]P for equation 12.8. Pen-and-paper proof through the value, query and key maps and the column-wise softmax.

**Stop when:** Your encoding table matches the closed form entry by entry, the rotation check passes, and you can say which tensors carry position into the first attention call.

<details>
<summary>Self-test</summary>

1. State permutation equivariance for self-attention and explain why it forces positional input.
   - Sa[XP] equals Sa[X]P for any permutation matrix P: reordering inputs reorders outputs identically. The block therefore carries no order information, so positions must enter as extra input.
2. Write the D2L sinusoidal encoding entries.
   - p(i, 2j) equals sin(i / 10000^(2j/d)) and p(i, 2j+1) equals cos(i / 10000^(2j/d)), with i the position and d the width.
3. What does the 2x2 rotation from position i to position i plus delta depend on?
   - Only the offset delta and the pair frequency omega_j. It never depends on the absolute position i, which is why a fixed shift is a fixed linear map.
4. A 1500-token input meets D2L default PositionalEncoding. What happens?
   - The stored table is 1000 wide, so the slice caps at 1000 and the add fails on shape mismatch. Rebuild the encoding with a larger max_len.

</details>

#### U5. Transformer blocks: residual stream, normalization and feed-forward

**About 5 h** · **Target:** Explain + Implement

Topics: Residual stream and pre versus post normalization; Feed-forward and gated feed-forward blocks; Encoder, decoder and encoder-decoder patterns

The block is the unit that stacks. Normalization order decides trainability at depth, and the encoder, decoder and cross choice decides which context each token may use.

**You can now**

- Contrast pre- and post-normalization block orders and predict where activations and gradients differ.
- Implement a pre-normalized residual attention-plus-MLP block with explicit positions and shape invariance.
- Select encoder, decoder or encoder-decoder structure from the task's context needs.
- Explain what a gated feed-forward adds over the plain two-matrix MLP and what it costs.

**Study**

1. [Transformer layers, BERT, GPT and encoder-decoder models](https://udlbook.github.io/udlbook/) (Understanding Deep Learning - Transformers) - Section 12.4 (pp. 215 to 216) for the post-norm layer in equation 12.13; Section 12.6 (pp. 219 to 221) for BERT widths, heads and parameter counts; Section 12.7 (pp. 222 to 225) for autoregressive factorization, masked training and GPT-3 sizes; Section 12.8 (pp. 226 to 227) for cross-attention with Figure 12.13. Depth: Skip Section 12.5.1 tokenization and the GPT-3 few-shot anecdotes; stop Section 12.7 at generation mechanics.
2. [Feed-forward, AddNorm, encoder and decoder blocks](https://d2l.ai/chapter_attention-mechanisms-and-transformers/transformer.html) (D2L - attention and transformer implementation route) - PositionWiseFFN, the AddNorm residual-plus-LayerNorm class, TransformerEncoderBlock, TransformerDecoderBlock with its three norms and same-width comment, and the encoder shape-invariance checks. Depth: Read Training for loss wiring only; do not run full machine-translation training here.
3. [Pre-norm vision transformer block](https://d2l.ai/chapter_attention-mechanisms-and-transformers/vision-transformer.html) (D2L - attention and transformer implementation route) - ViTBlock with its pre-versus-post-normalization paragraph, PatchEmbedding with the (96, 16, 512) shape check, and Putting It All Together for encoder-only assembly. Depth: Skip Training; the Fashion-MNIST run is not part of this unit.

**Focus**

- Post-norm (UDL equation 12.13, D2L encoder) normalizes after each residual add; pre-norm (ViTBlock) normalizes the branch inputs and adds untouched residuals. D2L states pre-norm trains more effectively.
- Residuals force equal widths: D2L requires decoder num_hiddens to equal the encoder width for the adds and the cross QK^T product.
- Neither D2L MLP is gated: PositionWiseFFN is ReLU and ViTMLP is GELU with dropout. A gated block adds a third projection and an elementwise product; hold parameters fixed by shrinking width, not by ignoring the extra matrix.
- Pattern follows context: BERT-style encoders read both sides for representations, GPT-style decoders mask the future for generation, encoder-decoders add cross-attention for sequence-to-sequence tasks.

**Reproduce:** From a blank file, build the ViTBlock-pattern pre-norm block (norm, attention, add, norm, MLP, add) and show a (2, 100, 24) input returns (2, 100, 24). Then convert one D2L post-norm block to pre-norm and list exactly which lines moved.

**Traps**

- Calling SDPA with nonzero dropout_p in eval. Dropout applies in every mode, so a finished block still jitters; set 0.0 outside training.
- Normalizing the wrong axis. LayerNorm statistics run over the feature width (D2L norm_shape equals num_hiddens); including batch or sequence axes computes nonsense moments.
- Counting a gated MLP as two matrices. The gate is a third full projection; parameter and FLOP claims must include it.

**Practice**

- The section mini-project covers this: a pre-normalized residual attention-plus-gated-MLP block with explicit positions, shape-invariance checks and serialization.

**Stop when:** Your block holds shapes across depths, gives the same output on two eval-mode runs, and you can convert post-norm to pre-norm on demand.

<details>
<summary>Self-test</summary>

1. Write the operation order of a post-norm and a pre-norm attention sublayer.
   - Post-norm: Y equals LayerNorm(X plus Attention(X)). Pre-norm: Y equals X plus Attention(LayerNorm(X)). Same parts, different order; only pre-norm keeps a clean residual path.
2. Contrast BERT and GPT-3 on attention pattern, objective and size.
   - BERT is a bidirectional encoder trained to predict masked words: 24 layers, width 1024, 16 heads of width 64, MLP width 4096. GPT-3 is a causal decoder trained on next tokens: 96 layers, width 12288, 96 heads of width 128.
3. Why must the D2L decoder match the encoder num_hiddens?
   - Residual adds need identical shapes, and encoder-decoder attention multiplies decoder queries against encoder keys. Different widths break both the adds and the score product.
4. What is missing from D2L MLPs if the target is a gated feed-forward?
   - A third projection and the elementwise gate product. Both D2L MLPs are plain two-matrix stacks, so the gated block must be built and its extra matrix counted.

</details>

#### U6. Parameter, FLOP and memory accounting for attention

**About 4 h** · **Target:** Derive + Measure

Topics: Parameter and FLOP accounting; Score memory, activation storage and data movement; Quadratic score materialization

Attention scales quadratically in sequence length. The budget must be derived before launch, because the out-of-memory error arrives after the design is fixed.

**You can now**

- Derive attention and MLP parameter, FLOP, score-memory and activation costs across batch, heads, sequence and width.
- Measure score materialization for a stated shape and report it in correct binary units.
- Explain which term dominates in short- versus long-sequence regimes and what the math-backend upcast changes.

**Study**

1. [Complexity, sequential ops and path lengths](https://d2l.ai/chapter_attention-mechanisms-and-transformers/self-attention-and-positional-encoding.html) (D2L - attention and transformer implementation route) - Comparing CNNs, RNNs, and Self-Attention: O(k n d^2) with O(1) ops and O(n/k) path for CNNs, O(n d^2) with O(n) ops and path for RNNs, O(n^2 d) with O(1) ops and path for self-attention.
2. [Quadratic attention and model sizes](https://udlbook.github.io/udlbook/) (Understanding Deep Learning - Transformers) - Section 12.2.1 (p. 209) for N^2 attention weights independent of width; Section 12.9 (pp. 227 to 228) for roughly half the interactions in decoders and the sparsification gallery; BERT and GPT-3 parameter listings (pp. 219 and 224 to 225) as worked sizes. Depth: Treat the sparsification gallery as orientation only; sparse kernels are a later topic.
3. [Backends and precision behavior](https://docs.pytorch.org/docs/stable/generated/torch.nn.functional.scaled_dot_product_attention.html) (PyTorch - scaled dot product attention) - The three-implementation Note with backend selection functions, and the Numerical accuracy paragraph: math backend keeps fp32 intermediates for half and bf16 inputs, and outputs may differ by backend. Depth: Skip grouped-query attention; it belongs to decoder specialization.

**Focus**

- Count with multiply-add as 2 FLOP: QKVO projections 8 n d^2, scores plus weighting 4 n^2 d, width-4d MLP 16 n d^2. At n 512 and d 1024 that is about 5.37 GFLOP for attention and 8.59 GFLOP for the MLP.
- Score memory is heads times n^2 entries in the working dtype: 16 heads at n 512 in fp32 is exactly 16 MiB, 1 MiB per head. At n 4096 the same block needs 1 GiB.
- Causal masking keeps n(n+1)/2 pairs, so the necessary score FLOPs roughly halve, as UDL notes. A dense matmul followed by a mask still computes all n^2 scores; only a kernel that skips masked tiles saves the work, and only a fused kernel avoids materializing the scores.
- The math backend upcasts half and bf16 intermediates to fp32, so measured bytes can exceed a naive dtype-times-entries count. Fused backends can change numerics without changing the asymptotic count.

**Reproduce:** Closed-book, fill the table for n 512, d 1024, h 16, fp32: attention parameters 4.19M, MLP parameters 8.39M, score memory 16 MiB, attention forward about 5.37 GFLOP. Then scale scores to n 4096 and show 1 GiB.

**Traps**

- Mixing MACs with FLOPs. One multiply-add is 2 FLOP; state the convention or totals disagree by exactly 2x.
- Quoting GB for GiB quantities. 16 times 4096^2 times 4 bytes is 2^30 bytes: 1 GiB, not 1 GB.
- Trusting fused-kernel numerics to match the math path bit for bit. The docs warn outputs may differ by backend; test within tolerance, not equality.

**Practice**

- [D2L Attention Scoring Functions: Exercise 3 (cost scaling)](https://d2l.ai/chapter_attention-mechanisms-and-transformers/attention-scoring-functions.html) - Exercises: cost versus key, query and value dimensionality and count, plus the memory-bandwidth follow-up. Answer with the derived 8nd^2 plus 4n^2d model and the 512-case numbers, stating the multiply-add convention.
- [TensorTonic: Transformer Training FLOP Estimator](https://www.tensortonic.com/problems/cs336-l02-training-flop-estimator) - The estimator problem in the PyTorch and einops group of the free language-modeling-from-scratch plan. It estimates one training step from forward matrix multiplications plus a supplied forward attention cost. Match its forward matmul terms to your 8nd^2 and 16nd^2 counts, then document how it counts the backward pass and every term it includes or leaves out.

**Stop when:** Your hand table matches measured score bytes and a profiler FLOP count within stated conventions, and you can name the dominant attention term on either side of n equals 2d (6d once the MLP is included).

<details>
<summary>Self-test</summary>

1. How many score bytes do 8 heads at n 1024 in fp32 need?
   - 8 times 1024^2 entries times 4 bytes equals 33,554,432 bytes, which is 32 MiB.
2. Why does decoder attention need only about half the encoder score FLOPs, and when is the saving real?
   - Causality keeps the lower triangle: n(n+1)/2 pairs instead of n^2, roughly half for long sequences. A dense matmul plus mask still spends all n^2; the saving is real only in a kernel that skips masked blocks.
3. How many bias-free attention parameters does one BERT-width layer hold?
   - 4 times 1024^2 equals 4,194,304, about 4.19M. Biases would add 4 times 1024 on top.
4. Sequence length grows from 512 to 4096 at fixed width. What scales by 64, and what becomes the main cost?
   - Score entries, bytes and score FLOPs all scale by 8^2 equals 64, while projection FLOPs scale by 8 and weights stay fixed. The score tensor grows from 16 MiB to 1 GiB per layer and example, so it is usually the first memory limit. Since n is now above 2d, score FLOPs also exceed the projection FLOPs.

</details>

#### U7. Architecture trade-offs and attention correctness tests

**About 5 h** · **Target:** Explain + Measure

Topics: Convolution, recurrence and attention trade-offs; Head, sequence and batch axis hazards; Causal, padding and low-precision correctness tests; Noncontiguous and variable-length input behavior

Attention fails quietly: transposed axes still run, padding still mixes, fused kernels still return. Only deliberate tests separate a correct block from a plausible one.

**You can now**

- Compare convolution, recurrence and attention by invariance, path length, parallelism, state and scaling, and pick the simplest adequate mechanism.
- Run an intervention battery (future-token, padding, permutation) that proves mask and position semantics.
- Diagnose axis, contiguity and dtype hazards in a multi-head implementation.
- State which behaviors need measurement (backend, dtype, length regime) versus derivation.

**Study**

1. [Architecture comparison and hazard sites](https://d2l.ai/chapter_attention-mechanisms-and-transformers/self-attention-and-positional-encoding.html) (D2L - attention and transformer implementation route) - Comparing CNNs, RNNs, and Self-Attention with its figure, plus the transpose_qkv and transpose_output pair and the valid_lens repeat in the multi-head implementation for the axis checklist.
2. [Transformer summary and long-sequence gallery](https://udlbook.github.io/udlbook/) (Understanding Deep Learning - Transformers) - Section 12.11 (p. 232) for parallel computation with quadratic scaling; Section 12.9 gallery (pp. 227 to 228) for sparsification patterns at recognition depth; Section 12.10 (pp. 228 to 231) for convolutional inductive bias versus data scale. Depth: Stop at recognition of the gallery patterns; sparse and image architectures are not built here.
3. [Backend selection and determinism limits](https://docs.pytorch.org/docs/stable/generated/torch.nn.functional.scaled_dot_product_attention.html) (PyTorch - scaled dot product attention) - Backend selection functions, the outputs-may-differ paragraph, and the cuDNN nondeterminism Note with its deterministic flag.

**Focus**

- Choose by mechanism, not fashion: CNNs share local filters with translation structure, RNNs carry fixed state through O(n) sequential steps, attention pays O(n^2 d) for content-based O(1) paths. The D2L table makes the trade exact.
- The axis checklist is short: which axis the softmax sums to 1, whether head splitting precedes the transpose, whether valid_lens repeats per head, and whether transposed tensors are contiguous before any view.
- Interventions beat inspections: perturb future tokens, change padded content, permute the batch (and the sequence, for an unmasked block without positions), and require matching outputs. UDL Section 12.7.2 explains how a decoder that sees the future can cheat; only the intervention proves yours cannot.
- Some claims need a run: fused-backend numerics, half-precision intermediates, and the length where materialization binds. Derive the model, then measure the regime.

**Reproduce:** On your own block, run the three-test battery: changing future tokens leaves earlier outputs unchanged; changing padded content leaves valid outputs unchanged; permuting the batch permutes the outputs the same way. Also show that permuting the sequence permutes outputs for an unmasked block without positions, and fails once the causal mask is on. Then differential-test forward and backward against the SDPA math backend within tolerance, excluding fully masked rows.

**Traps**

- Asserting bitwise equality across backends. The docs say outputs may differ by backend and that cuDNN may pick a nondeterministic algorithm; tolerance plus a pinned backend is the valid test.
- Using view on a freshly transposed tensor. Head-fold transposes are noncontiguous; view fails where reshape, or contiguous plus view, succeeds.
- Reading causality off one layer weights. Dropout, residuals and later layers remix paths; the intervention on the composed block is the proof.

**Practice**

- The section mini-project covers this: the intervention battery, variable-length and noncontiguous stress cases, and the SDPA differential test with the fully-masked-row convention pinned.

**Stop when:** The battery passes on shapes you did not tune for, including all-padded rows under your stated convention, and you can attribute any mismatch to mask, axis, dtype or backend.

<details>
<summary>Self-test</summary>

1. Fill the D2L trade-off row for CNNs, RNNs and self-attention: compute order, sequential ops, max path.
   - CNN: O(k n d^2), O(1), O(n/k). RNN: O(n d^2), O(n), O(n). Self-attention: O(n^2 d), O(1), O(1).
2. Which D2L line protects multi-head masking, and what is the failure without it?
   - torch.repeat_interleave(valid_lens, num_heads, dim=0). Without it D2L masked_softmax fails with a mask shape error. Tiling with repeat instead runs but gives heads another example's length, because the fold is batch-major.
3. Why must the SDPA differential test exclude fully masked rows?
   - Conventions disagree there: D2L -1e6 gives uniform weights, all -inf through plain softmax gives NaN, and SDPA on CPU returned zeros in PyTorch 2.14. Assert your convention in a separate test.
4. transpose_qkv ends with reshape after permute. Why not view?
   - Permuted tensors are noncontiguous, and view requires contiguity. reshape copies when needed; view would raise. Call contiguous first if a later view matters.

</details>

### Mini-project: General multi-head block with an intervention battery

**About 10 to 14 hours.** Implement a pre-norm transformer block with multi-head attention, masks and positions from tensor operations, derive its cost for a stated shape, and prove with interventions that future and padded tokens cannot change valid causal outputs.

1. Implement scaled dot-product attention with a stable softmax and boolean causal and padding masks. Pass Deep-ML 490 and the CS231n Assignment 3 MultiHeadAttention and PositionalEncoding checks in Transformer_Captioning.ipynb.
2. Build multi-head attention with an explicit split, transpose and merge, self- and cross-attention through one module, and valid lengths repeated per head in batch-major order.
3. Assemble a pre-norm block (norm, attention, add, norm, gated MLP, add) with sinusoidal or learned positions. Check shapes across depths, batch sizes and sequence lengths, and identical eval-mode outputs after saving and reloading the state_dict.
4. Run the intervention battery on the composed block: changing future tokens leaves earlier outputs unchanged, changing padded content leaves valid outputs unchanged, and permuting the batch permutes the outputs. Show that sequence permutation passes without mask or positions and fails with the causal mask.
5. Differential-test forward and backward against torch.nn.functional.scaled_dot_product_attention on the math backend, within tolerance, with noncontiguous inputs and variable lengths, excluding fully masked rows. Pin your fully-masked-row convention in a separate test.
6. Derive parameters, forward FLOPs and score memory for n = 512, d = 1024, h = 16 in fp32, then measure the score tensor bytes and a profiler FLOP count and reconcile them under stated conventions.

**Deliverables**

- The attention and block package with masks, positions and the gated MLP.
- The test suite: oracle checks, the intervention battery, the SDPA differential tests and the fully-masked-row convention test.
- A cost sheet for the stated shape with measured numbers beside derived ones.

**Checks**

- external-tests: [Deep-ML 490: Build Scaled Dot-Product Attention](https://www.deep-ml.com/problems/490).
- external-tests: [CS231n Assignment 3, Transformer_Captioning.ipynb attention and positional-encoding checks](https://cs231n.github.io/assignments/2026/assignment3.zip). Run the notebook cells locally; each prints a rel_error against stored values or numerical gradients. Gradescope is for enrolled students only, so these printed checks are the gate.
- rubric: Self-grade with the rubric below.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Attention correctness | Deep-ML 490 and the CS231n attention checks pass. | Forward and backward match the SDPA math backend in float64 on noncontiguous inputs. |
| Masks and causality | Future-token and padding interventions leave valid outputs unchanged. | The battery passes on shapes you did not tune for, and the causal sequence-permutation test fails as it should. |
| Head handling | Split, transpose and merge match a loop over heads. | A test shows that tiling valid lengths with repeat masks the wrong heads while repeat_interleave masks the right ones. |
| Block | Shapes hold across depths, and eval-mode outputs survive a save and reload. | You compare pre-norm and post-norm on a short training run and report gradient norms per layer. |
| Cost accounting | Parameters, FLOPs and score bytes are derived for the stated shape. | Measured score bytes and profiler FLOPs agree with the derivation, with each convention stated, such as multiply-adds versus FLOPs and MiB versus MB. |

Feeds into: Capstone artifact 2 can use a model built on this block; the LLM Foundations stage builds its decoder from the same parts.

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

### Study units

#### U1. Eager execution, autograd nodes and saved tensors

**About 3 h** · **Target:** Explain

Topics: Eager execution, dispatch and autograd nodes; Saved tensors and their lifetimes

Every memory number and profiler row later in this section is a consequence of this graph. If you cannot name the saved tensors, you cannot explain what checkpointing or the profiler is measuring.

**You can now**

- Trace one eager operation from the Python call to its backward Function node and name each node on the path.
- Explain which forward tensors autograd must keep for backward, how long they live, and what frees them.
- Predict whether an in-place edit raises at the edit or at backward, and state what the version numbers mean.

**Study**

1. [How autograd encodes the history](https://docs.pytorch.org/docs/stable/notes/autograd.html#how-autograd-encodes-the-history) (PyTorch - checkpointing, numerical accuracy and CUDA semantics) - How autograd encodes the history: Function graph rebuilt each iteration, grad_fn entry points, what-you-run-is-what-you-differentiate.
2. [Saved tensors](https://docs.pytorch.org/docs/stable/notes/autograd.html#saved-tensors) (PyTorch - checkpointing, numerical accuracy and CUDA semantics) - Saved tensors: the x-squared example, save_for_backward, _saved attribute inspection, the pow identity-True and exp identity-False examples with shared storage.
3. [In-place checks and saved-tensor hooks](https://docs.pytorch.org/docs/stable/notes/autograd.html#in-place-operations-with-autograd) (PyTorch - checkpointing, numerical accuracy and CUDA semantics) - In-place operations with autograd and In-place correctness checks: version counters and the no-error-means-correct-gradients guarantee. Depth: Skim Hooks for saved tensors after the pack_hook and unpack_hook contract. Skip the multithreading and complex-number sections.

**Focus**

- The graph is rebuilt from scratch every iteration. A grad_fn object from a previous iteration is stale and must never be reused.
- Forward keeps only what backward needs. For x squared it keeps x; the rest of the forward temporaries are free to go.
- Object identity of a saved tensor is an implementation detail. The pow case returns the same object and the exp case returns a different object, but both share storage and compare equal.
- The first backward frees saved tensors. A second backward without retain_graph fails because the saved values are gone, not because the graph forgot the formula.

**Reproduce:** Closed-book on CPU: build y = (x @ W + b).relu().sum() with a 2 by 3 x, a 3 by 4 W and a bias of 4, all requiring grad. Walk y.grad_fn through next_functions and write down SumBackward0, ReluBackward0, AddBackward0, MmBackward0 and AccumulateGrad in order. Then show (x ** 2).grad_fn._saved_self is x gives True while its storage is shared.

**Traps**

- Reading _saved_self is as identity proof. Packing may return a new object sharing storage, so test storage and equality, never identity.
- Editing a leaf with requires_grad errors at the edit, but editing a saved non-leaf passes and fails at backward with a version error. The two messages describe different checks.
- Assuming no-grad regions keep no state and therefore cost nothing. They keep no graph, but the forward compute and its live outputs still cost time and memory.

**Practice**

- The section mini-project covers this: saved-tensor accounting and autograd-state instrumentation for the compact model.

**Stop when:** You complete the reproduce walk without notes, and can predict for any small graph which tensors survive until backward and which edit raises where.

<details>
<summary>Self-test</summary>

1. For y = (x @ W + b).relu().sum(), name the backward node types from y down to the leaves.
   - SumBackward0, ReluBackward0, AddBackward0, MmBackward0, then AccumulateGrad at each leaf.
2. x.pow(2).grad_fn._saved_self is x is True, but x.exp().grad_fn._saved_result is y is False. Do both saved tensors share storage with the named tensor?
   - Yes. Both compare equal and share storage. Whether packing returns the same object depends on whether the saved tensor is an output of its own grad_fn, which is an implementation detail.
3. The first loss.backward() succeeds and the second raises about saved intermediate values. What was freed, and what flag keeps it?
   - The saved tensors were freed after the first backward. Pass retain_graph=True to keep them for a second backward.
4. Backward fails with expected version 0 but found version 1 on a saved tensor. What do the two numbers mean?
   - The tensor was saved at version 0 and edited in place once since. Gradients computed from the edited value could be wrong, so autograd refuses instead of guessing.

</details>

#### U2. Streams, asynchronous copies and honest timing

**About 4 h** · **Target:** Explain + Measure

Topics: Device streams, asynchronous copies and synchronization; Accidental synchronization and measurement error

Every speedup claim in this section stands or falls on timing discipline. Async execution makes naive timers lie, and a hidden sync can pose as a slow kernel.

**You can now**

- Explain why GPU launches return before the work finishes and where PyTorch syncs for you.
- Order wait_stream and record_stream correctly when a side stream consumes a default-stream tensor.
- Time a GPU operation with events and show why a bare wall clock understates it.

**Study**

1. [Asynchronous execution and CUDA streams](https://docs.pytorch.org/docs/stable/notes/cuda.html) (PyTorch - checkpointing, numerical accuracy and CUDA semantics) - Asynchronous execution: enqueue semantics, CUDA_LAUNCH_BLOCKING, and the Event timing example; CUDA streams: default-stream auto-sync, the wait_stream plus record_stream fix, and Stream semantics of backward passes. Depth: Skip the TF32, GEMM precision, allocator-tuning and CUDA-graph sections here. They belong to later units.
2. [Pinned memory and asynchronous copies](https://docs.pytorch.org/docs/stable/notes/cuda.html) (PyTorch - checkpointing, numerical accuracy and CUDA semantics) - Best practices, Use pinned memory buffers: pin_memory, non_blocking copies, and overlapping transfer with compute.
3. [Operations that force synchronization](https://docs.pytorch.org/tutorials/recipes/recipes/tuning_guide.html) (PyTorch - reliability and performance recipes) - GPU specific optimizations, Avoid unnecessary CPU-GPU synchronization: the print, item, copy, nonzero and data-dependent-control-flow list.

**Focus**

- Launches enqueue; they do not execute. On-device order is preserved per stream, and PyTorch syncs around CPU-GPU copies on the default stream only.
- Side streams get no automatic safety. The consumer stream waits on the producer with wait_stream, and the tensor records its new stream with record_stream so its memory is not reused early.
- non_blocking=True is a request, not a command. From pageable host memory the copy still syncs; pin the source first.
- Backward follows forward stream placement. Grads produced under a side-stream backward must be consumed in the same stream context or after an explicit wait.

**Reproduce:** On a CUDA GPU, warm up, then time a 2048 by 2048 fp32 matmul both ways: CUDA events around the op with a synchronize before reading, versus a bare perf_counter around the launch. The matmul is 2 times 2048^3, about 17.2 GFLOP, so the event time is a few milliseconds at most (4.1 ms on a laptop RTX 3050), while the bare clock reads microseconds (0.007 ms there) because it measures enqueue only. Exact numbers depend on hardware; the size of the gap is the assertion.

**Traps**

- Timing with time.perf_counter and no sync, then reporting the result as kernel time. You timed the launch, not the work.
- Calling .item(), printing a CUDA tensor, or branching on one inside the timed region. Each forces a sync and the stall gets billed to the wrong line.
- Assuming default-stream safety extends to side streams. In the docs example, sum on a side stream may start before normal_ finishes on the default stream. The side stream must wait_stream on the default stream, and record_stream protects the tensor if it is freed while the side stream still uses it.

**Practice**

- The section mini-project covers this: synchronized phase timing with explicit stream boundaries.

**Stop when:** Your two-way timing shows the enqueue gap on your GPU, and you can point at the sync in any snippet that prints, copies, or branches on a CUDA tensor.

<details>
<summary>Self-test</summary>

1. An Event-timed matmul reports 4.1 ms while a bare wall clock reports 0.007 ms. Which is the kernel time and why?
   - The Event time. Launches are asynchronous, so the bare clock measures enqueue only. Events plus a synchronize measure the queued work.
2. Data comes from pageable host memory with .to(device, non_blocking=True). Is the copy asynchronous?
   - Effectively no. Asynchronous host-to-device copies need pinned source memory, so set pin_memory=True in the loader first.
3. loss.backward() runs under torch.cuda.stream(s). Where may the .grad tensors be consumed?
   - Inside the same stream context, or after the consuming stream waits on s. Using them on the default stream without a wait is unsafe in current PyTorch.
4. Which of print(t), t.item() and t.to(cpu) force a host sync for a CUDA tensor t?
   - All three. Each needs the values or the transfer finished on the host before Python continues.

</details>

#### U3. GPU memory: allocated, reserved, peak and memory models

**About 5 h** · **Target:** Derive + Measure

Topics: Allocated, reserved and peak memory; Parameter, gradient, optimizer and activation memory models; Temporary workspace, input and allocator reserve

OOM errors name a requested size but never the cause. The fix differs completely between live tensors, cached reserve and fragmentation, and only the counters tell them apart.

**You can now**

- Derive persistent training memory from parameter, gradient, optimizer-state and activation terms at stated precision.
- Read allocated, reserved and peak counters and explain each discrepancy between them.
- Separate live tensors, allocator reserve and outside-allocator memory when an OOM makes no sense.

**Study**

1. [Caching-allocator memory management](https://docs.pytorch.org/docs/stable/notes/cuda.html) (PyTorch - checkpointing, numerical accuracy and CUDA semantics) - Memory management: memory_allocated and max_memory_allocated for tensors, memory_reserved and max_memory_reserved for the allocator, empty_cache releasing only unused segments.
2. [Snapshot-based memory debugging](https://docs.pytorch.org/docs/stable/torch_cuda_memory.html) (PyTorch - checkpointing, numerical accuracy and CUDA semantics) - Generating a Snapshot with _record_memory_history and _dump_snapshot; Allocator State History: segments, blocks and active_allocated versus inactive states; Identifying Non-PyTorch allocations. Depth: Skip pinned host-memory capture. Use device-only snapshots for this unit.
3. [Profiler memory analysis](https://docs.pytorch.org/tutorials/recipes/recipes/profiler_recipe.html) (PyTorch - reliability and performance recipes) - Step 4, Using profiler to analyze memory consumption: profile_memory with self versus total memory and the aten::empty example.
4. [Mixed-Precision Training Memory Accountant](https://www.tensortonic.com/problems/cs336-l02-training-memory-accountant) (TensorTonic - mixed-precision memory and transformer FLOPs) - Compute exact storage for parameters, gradients, saved activations, and optimizer state from tensor shapes and byte widths.

**Focus**

- fp32 Adam training holds about 16 bytes per parameter before activations: 4 for the weight, 4 for the gradient, 8 for the two moment buffers. Precision and optimizer choice change the constants, not the method.
- Allocated sums live tensors; reserved sums allocator segments. A 4 MiB tensor can sit inside 20 MiB of reserve, and nvidia-smi reports closer to reserve.
- Peak counters are sticky. Reset them immediately before the measured region or the peak belongs to an earlier phase.
- empty_cache returns unused segments to the driver. It never frees live tensors and never defragments them, so it cannot make a too-large tensor fit.

**Reproduce:** Derive fp32 Adam memory for a 10M-parameter model as 160 MB (152.6 MiB) before activations. Then, in a fresh process on a CUDA GPU, allocate one 1024 by 1024 fp32 tensor and read memory_allocated as 4.00 MiB and memory_reserved as 20.00 MiB. Run one matmul and read allocated again: it stays higher by the cuBLAS workspace (about 8 MiB on an RTX 3050 with PyTorch 2.14). State which number nvidia-smi tracks.

**Traps**

- Reading nvidia-smi as live usage. It sees everything the driver gave the process: the CUDA context, cached segments and non-PyTorch allocations such as NCCL.
- Counting the cuBLAS workspace as model memory. The CUDA notes say each handle and stream keeps its workspace until explicitly cleared, so take the baseline after a warm-up matmul, not before.
- Comparing a derived model against current allocated only. Peak across forward, backward and optimizer phases is the number that must fit, and it needs a reset counter.

**Practice**

- [TensorTonic: Mixed-Precision Training Memory Accountant](https://www.tensortonic.com/problems/cs336-l02-training-memory-accountant) - Solve the storage accounting from tensor shapes and byte widths. Free problem. Then reconcile your formula with the compact model's profiler memory table and write down every included and excluded term.

**Stop when:** Your hand-derived parameter, gradient and optimizer bytes match the profiler within stated exclusions, and you can attribute any allocated-versus-reserved gap to segments, peak staleness or outside-allocator memory.

<details>
<summary>Self-test</summary>

1. A 10M-parameter model trains in fp32 with Adam and no AMP. How many bytes do parameters, gradients and optimizer states hold?
   - 40 MB, 40 MB and 80 MB: 160 MB total before activations, workspace, inputs and reserve.
2. After allocating one 1024 by 1024 fp32 tensor, allocated reads 4.00 MiB and reserved reads 20.00 MiB. What is the extra 16 MiB?
   - The unused rest of the 20 MiB segment the allocator reserved for this request, held for reuse, not live tensors. nvidia-smi tracks closer to reserved than to allocated.
3. Peak grows every loop iteration while current stays flat. What was forgotten?
   - reset_peak_memory_stats before the measured region. Max counters never decrease on their own.
4. Will empty_cache let a run allocate one bigger tensor than the OOM size?
   - No. It returns unused cached segments to the driver for other processes, but it frees no live tensors, so the docs say it cannot increase the memory available to PyTorch.

</details>

#### U4. Precision formats, autocast and gradient scaling

**About 4 h** · **Target:** Explain + Implement

Topics: FP32, TF32-style settings, FP16 and BF16; Autocast, gradient scaling and unscale-before-clip order

Mixed precision is the cheapest memory and speed win in training, but it moves range failures into the gradient stream where a wrong threshold or a stale flag silently changes the update.

**You can now**

- Explain what TF32, fp16 and bf16 change about range, precision and accumulation, and state the current defaults.
- Implement an autocast forward with a gradient scaler, including save and resume of scaler state.
- Apply unscale before clipping with an unchanged threshold and diagnose skipped steps from the scale.

**Study**

1. [Automatic Mixed Precision recipe](https://docs.pytorch.org/tutorials/recipes/recipes/amp_recipe.html) (PyTorch - reliability and performance recipes) - Adding torch.autocast with the fp16 linear output and fp32 loss asserts; Adding GradScaler with scale, backward, step and update; Inspecting/modifying gradients with unscale_ before clip_grad_norm_ at max_norm 0.1; Saving/Resuming with scaler state_dict.
2. [TF32 precision controls](https://docs.pytorch.org/docs/stable/notes/cuda.html) (PyTorch - checkpointing, numerical accuracy and CUDA semantics) - TensorFloat-32 on Ampere and later devices: the new fp32_precision settings per backend and operator, matmul versus cuDNN defaults, and the rule against mixing old and new APIs.
3. [Reduced-precision accumulation](https://docs.pytorch.org/docs/stable/notes/numerical_accuracy.html) (PyTorch - checkpointing, numerical accuracy and CUDA semantics) - Reduced Precision Reduction for FP16 and BF16 GEMMs with the off switches; Reduced Precision Reduction for FP16 and BF16 in SDPA with the fp32 upcast default.

**Focus**

- Autocast chooses per operation: matmul-like ops go narrow, reductions stay wide. A fp16 linear output with a fp32 loss is the contract working, not a bug.
- The scaler exists because small fp16 gradients flush to zero. It scales the loss, unscales before the optimizer sees grads, and skips the step on inf or NaN.
- Current defaults are full precision for CUDA matmul and TF32 allowed for cuDNN convolutions. Set them with fp32_precision, never by mixing allow_tf32 with the new API.
- The recipe assumes a CUDA GPU. The CPU fallback is autocast with bf16 and no scaler, with its own dtype asserts.

**Reproduce:** On a CUDA GPU, run a fp16 autocast forward over one linear layer and assert the output is fp16 while an mse loss over it is fp32. Construct torch.amp.GradScaler('cuda'), confirm the initial scale reads 65536.0, then run scale, backward, unscale_, clip_grad_norm_ and step plus update without error.

**Traps**

- Mixing allow_tf32 and fp32_precision. In PyTorch 2.14, reading allow_tf32 after setting fp32_precision raises a RuntimeError, while the reverse just reports the mapped value. The docs do not support mixing, so pick one API and stay on it.
- Clipping .grad between backward and scaler.step without unscale_ first. The threshold then applies to scaled values and silently clips the wrong updates.
- Copying CUDA fp16 settings to CPU. The recipe requires a CUDA GPU; on CPU use bf16 autocast and do not expect the fp16 asserts to transfer.

**Practice**

- [PyTorch AMP recipe: vary participating sizes](https://docs.pytorch.org/tutorials/recipes/recipes/amp_recipe.html) - The Exercise above the batch_size cell: rerun Default Precision and All together with batch sizes such as 128, 256 and 513, using the recipe's synchronized timers. Report the speedup per size on your GPU. Compare the 513 run with the Troubleshooting advice that matmul sizes be multiples of 8, and say whether your GPU and library versions still show that effect. Then add the unscale_ plus clip and scaler save and resume sections to the same loop.

**Stop when:** Your autocast plus scaler loop asserts the right dtypes, clips at an unchanged threshold, and you can explain any skipped step from the scale history.

<details>
<summary>Self-test</summary>

1. What are the current defaults for TF32 on CUDA matmul and cuDNN convolutions?
   - Matmul uses full precision and cuDNN convolutions allow TF32. Both are set per backend or operator with fp32_precision.
2. Code sets torch.backends.cuda.matmul.fp32_precision to tf32, and a library later reads allow_tf32. What happens?
   - In PyTorch 2.14 the read raises a RuntimeError about mixing the legacy and new APIs. Set and read TF32 through one API only.
3. Scaled gradients sit in .grad. Where does clipping go, and does max_norm change?
   - Call scaler.unscale_(optimizer) first, then clip with the same max_norm used in unscaled training.
4. Why does fp16 training need a gradient scaler while bf16 training usually does not?
   - Small fp16 gradients underflow to zero, so the scaler keeps them representable. bf16 keeps near-fp32 range, so plain updates survive.

</details>

#### U5. Overflow, underflow and finding the first invalid value

**About 3 h** · **Target:** Measure

Topics: Nonassociativity, overflow and underflow; First-invalid-value instrumentation

A NaN loss names no culprit. The only cheap evidence is the first invalid value and the operation that made it, and both need instrumentation in place before the failure.

**You can now**

- Explain why mathematically identical floating-point computations may differ bitwise across batches, slices and backends.
- Enable anomaly detection to name the first backward function that produces NaN, with its forward traceback.
- Place isfinite checks so an invalid value is caught at creation, not ten steps later.

**Study**

1. [Nonassociativity, batches, slices and extremal values](https://docs.pytorch.org/docs/stable/notes/numerical_accuracy.html) (PyTorch - checkpointing, numerical accuracy and CUDA semantics) - Opening paragraphs on limited accuracy and nonassociativity; Batched computations or slice computations with the bmm and sum examples; Extremal values with the norm overflow example and the isfinite advice.
2. [Anomaly detection reference](https://docs.pytorch.org/docs/stable/autograd.html#torch.autograd.set_detect_anomaly) (PyTorch - checkpointing, numerical accuracy and CUDA semantics) - detect_anomaly and set_detect_anomaly: forward traceback of the failing operation plus the check_nan error on NaN generated in backward; debug-only slowdown warning.
3. [Debugging APIs stay off in timed runs](https://docs.pytorch.org/tutorials/recipes/recipes/tuning_guide.html) (PyTorch - reliability and performance recipes) - General optimizations, Disable debugging APIs: anomaly detection, profiler hooks and gradcheck off for regular training.

**Focus**

- Floating point addition and multiplication are not associative. Batching, slicing and backend choice change reduction order, so bitwise identity is never promised.
- Overflow can strike intermediates while the final value is representable. The fp32 norm of [1e20, 1e20] is inf while the fp64 norm is finite.
- Anomaly detection answers which backward made NaN, not which forward looked odd. check_nan fires on NaN generated inside backward.
- Detection and profiling both slow execution. Neither belongs in a timed run or a production loop.

**Reproduce:** On CPU, show torch.tensor([1e20, 1e20]).norm() gives inf while the double version is finite. Then run (x / x).backward() at x = 0 under autograd.detect_anomaly() and record the exact error naming DivBackward0 and its NaN output.

**Traps**

- Asserting bitwise equality across batch sizes, slices or devices. The docs promise nothing here; compare with a tolerance.
- Expecting anomaly detection to flag NaN flowing from forward. Log of a negative is NaN forward with a finite grad of -1, and check_nan stays silent because backward generated nothing invalid.
- Leaving anomaly detection or the profiler on while timing. Both add overhead, so a slow profiled run proves nothing about the clean run.

**Practice**

- The section mini-project covers this: first-invalid capture and seeded NaN diagnosis with fixed-batch replay.

**Stop when:** You can produce the named DivBackward0 error on demand, and every equality in your checks carries an explicit tolerance.

<details>
<summary>Self-test</summary>

1. Under detect_anomaly, (x / x).backward() at x = 0 names DivBackward0. What does that name identify?
   - The backward function whose output went NaN, hence the forward division. The mode also prints the traceback of that forward call.
2. torch.log of -1.0 gives NaN forward and grad -1.0 with no anomaly error. Why silent?
   - check_nan fires on NaN generated by backward computation. Here backward computed the finite value 1/x, so there is nothing to report.
3. (A@B)[0] equaled A[0]@B[0] bitwise on your machine. May a test assert == across batchings?
   - No. Bitwise identity across batched and unbatched paths is not guaranteed, so assert allclose with an explicit tolerance.
4. Times look bad with anomaly detection and the profiler enabled. What is the first correction?
   - Disable both for timed runs. Both are debug-only overhead, so their timings do not describe the clean run.

</details>

#### U6. Activation checkpointing and recomputation

**About 3 h** · **Target:** Implement + Measure

Topics: Activation checkpointing and recomputation

Checkpointing converts the activation term of the memory model into extra compute. Done blindly it slows training for no reason; done deliberately it is what lets larger batches fit.

**You can now**

- Wrap a segment with torch.utils.checkpoint and state exactly what stays alive and what is recomputed.
- Choose use_reentrant False with reasons, and pass it explicitly.
- Measure the memory saving against the recompute cost and the RNG effects.

**Study**

1. [torch.utils.checkpoint API](https://docs.pytorch.org/docs/stable/checkpoint.html) (PyTorch - checkpointing, numerical accuracy and CUDA semantics) - checkpoint signature and semantics: only args stay alive, region outputs are recomputed in backward; use_reentrant False versus True differences; preserve_rng_state with the multi-device caveat; determinism_check and debug.
2. [Which layers to checkpoint](https://docs.pytorch.org/tutorials/recipes/recipes/tuning_guide.html) (PyTorch - reliability and performance recipes) - General optimizations, Checkpoint intermediate buffers: large layer outputs with small recompute cost as targets.

**Focus**

- Only the checkpoint inputs stay alive; everything the region computes is rerun in backward. Memory saved is the activations the region would have kept, and the price is one extra forward of the region during backward.
- Non-reentrant is the recommended path: it supports grad, keyword args and nested structures, and it stops recomputation early once the needed activations exist.
- RNG state is stashed and restored by default so dropout masks match. Turning that off changes gradients, not forward outputs.
- Recompute reruns the region code. Globals read inside the region, device moves, and multi-device RNG all break the equivalence silently or loudly.

**Reproduce:** On CPU, checkpoint a dropout block with use_reentrant=False and show its gradients equal the plain block at the same seed (torch.equal held on CPU with PyTorch 2.14). Rerun with preserve_rng_state=False and show the gradients differ while the forward outputs still match.

**Traps**

- Omitting use_reentrant and assuming a default. Current PyTorch warns that it must be passed explicitly; pass False deliberately.
- Wrapping tiny cheap regions. Recompute then costs more than the memory it saves; target large outputs with small recompute cost.
- Changing code or globals between forward and backward. The recompute must see the identical function, or gradients are silently wrong.

**Practice**

- The section mini-project covers this: activation-checkpointing memory savings with equivalence checks.

**Stop when:** Your checkpointed block matches plain gradients at a fixed seed within a stated tolerance, and you can price any block in memory saved versus recompute added.

<details>
<summary>Self-test</summary>

1. What stays alive across a checkpointed region, and what is recomputed?
   - Only the input args stay alive. The region reruns in backward to rebuild every forward tensor it needs.
2. With preserve_rng_state False, forward outputs still match but gradients differ. Why?
   - Forward runs once either way. The flag only controls the RNG state used by the backward recompute, so only dropout-dependent gradients change.
3. What happens when use_reentrant is omitted, and which value is recommended?
   - PyTorch warns that it must be passed explicitly. False is recommended: it supports grad, kwargs and nested structures with early stop.
4. With use_reentrant=True and no input requiring grad, the region's parameters get no gradients. Why, and which variant avoids it?
   - The reentrant variant runs the region under no_grad inside an autograd Function whose output requires grad only if an input does. With none, backward never enters the region and PyTorch warns that gradients will be None. The non-reentrant variant has no such requirement.

</details>

#### U7. Complete checkpoints, atomic writes and reproducibility boundaries

**About 4 h** · **Target:** Implement

Topics: Complete checkpoint and resume state; Atomic writes and reproducibility boundaries

Resume bugs waste entire training runs: the loss looks fine while the data order, the schedule, or the augmentation stream quietly diverges. The checkpoint contract is what makes a restart a continuation instead of a new experiment.

**You can now**

- Save and restore every state a resume needs: model, optimizer, scheduler, scaler, epoch, RNG and data position.
- Write checkpoints atomically so a crash never leaves a half-written file on the load path.
- State the exact reproducibility boundary: what matches bitwise, what matches statistically, and what never matches.

**Study**

1. [General checkpoints for resume](https://docs.pytorch.org/tutorials/beginner/saving_loading_models.html) (PyTorch - reliability and performance recipes) - What is a state_dict; Saving and Loading a General Checkpoint: save and load patterns, optimizer state, 2 to 3 times model size, .tar convention, eval versus train mode; the best_model_state reference pitfall. Depth: Skip Saving an Exported Program and the DataParallel section unless your model uses them.
2. [Reproducibility: seeds, determinism and data loading](https://docs.pytorch.org/docs/stable/notes/randomness.html) (PyTorch - checkpointing, numerical accuracy and CUDA semantics) - Controlling sources of randomness including manual_seed across devices; Avoiding nondeterministic algorithms with the cross-release and CPU-versus-GPU limits; DataLoader worker seeding with worker_init_fn and generator; CUDA convolution benchmarking versus determinism.
3. [Atomic renames for checkpoint writes](https://docs.python.org/3/library/os.html#os.replace) (Python os - os.replace) - os.replace: a successful rename is atomic, so write the checkpoint to a temp file in the same directory, flush and fsync, then replace the final name.

**Focus**

- A resume checkpoint is a dict of state, not a model file: epoch, model, optimizer, scheduler, scaler, RNG states and the sampler position all belong in it.
- state_dict returns references to live tensors. Training on after building the dict mutates the saved copy too; serialize to disk or deepcopy at save time.
- Per-worker RNG needs explicit construction. A Generator built in Dataset init is fork-copied identically into every worker and repeats its stream.
- Exact resume is realistic only on one machine, build and device kind, with deterministic algorithms. The reproducibility notes promise nothing across releases, platforms, or CPU versus GPU, so declare a tolerance there.

**Reproduce:** On CPU, train a small model with dropout for 3 steps, save model, optimizer and torch RNG state to disk, and train 2 more steps. Load the file into fresh model and optimizer objects, restore the RNG state, run the same 2 steps, and show the weights equal the continuous run (torch.equal held on CPU here). Rerun without restoring the RNG and show the weights differ.

**Traps**

- Reloading from the in-memory dict after further training. The dict aliases live optimizer buffers, so the resume silently starts from the later state.
- Seeding only torch.manual_seed with several DataLoader workers. Global RNGs get per-worker seeds, but a copied Generator object repeats exactly; build it per worker from torch.initial_seed.
- Writing the checkpoint straight to the final name. A mid-write crash leaves a corrupt file on the load path; temp file plus os.replace avoids it.

**Practice**

- The section mini-project covers this: resume equivalence and interruption handling with declared tolerances.

**Stop when:** Your disk-roundtrip resume matches the continuous run (exactly on CPU, or within a declared tolerance elsewhere), and a changed-seed or unrestored-RNG resume is caught by your own equivalence check.

<details>
<summary>Self-test</summary>

1. Name the checkpoint contents for exact resume on one GPU of SGD with momentum, a StepLR scheduler, fp16 AMP with a GradScaler and a shuffled loader.
   - Model, optimizer with its momentum buffers, scheduler, scaler, epoch and step, CPU and CUDA RNG states, and the sampler position or loader generator state.
2. A saved dict is kept in memory, training continues, then a fresh optimizer loads that dict. Why are its buffers wrong?
   - state_dict returns references, so continued training mutated the same buffers the dict aliases. Serialize to disk or deepcopy at save time.
3. Two DataLoader workers emit identical augmentation streams. State the bug and the fix.
   - A Generator built in Dataset init was fork-copied identically into both workers. Reseed it per worker in worker_init_fn from torch.initial_seed(), or create it lazily inside the worker.
4. The job dies mid-write and the checkpoint is corrupt. What write pattern survives this?
   - Write to a temp file in the same directory, flush and fsync, then os.replace onto the final name. Readers only ever see complete files.

</details>

#### U8. torch.compile: capture, guards, graph breaks and dynamic shapes

**About 4 h** · **Target:** Measure

Topics: torch.compile capture, guards and graph breaks; Dynamic shapes, recompilation and semantic comparison

Compile silently accepts partial graphs: a break just runs that part eagerly. Without break counts and equivalence checks, a speedup number can hide a semantics change.

**You can now**

- Compile a stable fragment and prove eager equivalence on values and gradients.
- Trigger a graph break and a recompilation on purpose, then read each from the logs.
- Choose fullgraph, dynamic and backend settings from the failure you want to forbid or allow.

**Study**

1. [torch.compile parameters](https://docs.pytorch.org/docs/stable/generated/torch.compile.html) (PyTorch - compiler troubleshooting) - fullgraph, dynamic, backend and mode; guard failures with TORCH_LOGS=guards; recompile_limit of 8 before falling back to eager.
2. [Breaks, guards, recompiles and logs](https://docs.pytorch.org/docs/stable/user_guide/torch_compiler/torch.compiler_troubleshooting.html) (PyTorch - compiler troubleshooting) - Terminology with the graph break, guards, recompilation and dynamic shapes definitions; Logging Tools with TORCH_LOGS graph_breaks, guards and recompiles; Simple Workarounds including data-dependent fixes; Reporting Issues, Ablation with eager and inductor backends. Depth: Read Terminology, Logging Tools and Simple Workarounds fully. Skim TorchDynamo internals and Reporting Issues.

**Focus**

- Default compile is partial: each frame compiles what it can and runs the rest eagerly. fullgraph=True turns an unnoticed break into a loud error.
- Guards are runtime checks on shapes, types and values. A failed guard recompiles, and eight recompiles exhaust the budget and fall back to eager.
- Data-dependent control flow is the classic break: .item, tensor conditions and prints split the graph. Hoist, use torch.cond, or capture scalar outputs.
- Equivalence comes before timing. Compare eager and compiled values and gradients with a tolerance, across shapes, before believing any speedup.

**Reproduce:** Compile a pure function and assert eager and compiled outputs match. Then compile a branch on flag.item() and read the TORCH_LOGS=graph_breaks line naming Tensor.item() as the break. Call torch._dynamo.reset(), compile the same function with fullgraph=True and show it raises. Finally count unique graphs with a counting backend: dynamic=False gives one per shape.

**Traps**

- Reporting a speedup without a break count. A fully broken compile is just eager with overhead, and the timer will not tell you.
- Feeding changing Python floats, such as a scheduled learning rate, into a compiled function. Under dynamic=False each new value recompiles until the limit of 8; the default recompiles once and then treats the float as dynamic. A tensor avoids both.
- Reusing a function across compile experiments. Caches are per code object, so a fullgraph=True compile of a function already compiled without it can reuse the old entries and not raise. Call torch._dynamo.reset() between experiments.

**Practice**

- The section mini-project covers this: triggered graph-break repair with eager comparison.

**Stop when:** You can trigger, name and fix one break and one recompile from the logs, with eager equivalence holding across your test shapes.

<details>
<summary>Self-test</summary>

1. Compiled code matches eager but the log names Tensor.item() as a graph break. What happened to the function?
   - Dynamo split it at the .item() call and runs that part eagerly. Fix by hoisting the value out, using torch.cond, or enabling scalar capture.
2. Under dynamic=False, one shape reuses its graph while a new shape adds a second. What does dynamic=True change?
   - dynamic=True traces shape-generic graphs from the start, where the operations allow it. The default, None, compiles static first and recompiles once as dynamic after a shape change: two graphs for sizes 3, 3, 4 and 5, against three under dynamic=False.
3. Timing collapses to eager speed after several shape changes. Which limit fired, and how do you see why?
   - The recompile limit, default 8, fell back to eager. Inspect the failing guards with TORCH_LOGS=recompiles.
4. Why compare values and gradients with tolerance before trusting a compile speedup?
   - Partial capture or specialization can change numerics. Equivalence first proves the speedup measures the same computation.

</details>

#### U9. Profiling training phases and verifying optimizations

**About 5 h** · **Target:** Measure

Topics: Profiler annotations and phase timing; Data wait, transfer, forward, backward and optimizer decomposition; Correctness and learning checks after optimization

Optimization without a phase breakdown optimizes the wrong line. The profile decides whether the step is data-starved, launch-bound, compute-bound or sync-bound, and the revalidation proves the faster run still learns.

**You can now**

- Annotate a training step and attribute time to data wait, transfer, forward, backward and optimizer phases.
- Read self versus total time and memory, and split shared operators by input shape.
- Revalidate learning and resume behavior after any optimization, and explain one model-versus-measured discrepancy.

**Study**

1. [PyTorch Profiler recipe](https://docs.pytorch.org/tutorials/recipes/recipes/profiler_recipe.html) (PyTorch - reliability and performance recipes) - Step 3 execution time with activities, record_function and key_averages self versus total; group_by_input_shape with record_shapes; Step 4 memory with profile_memory; Step 5 chrome trace export; Step 7 schedule, on_trace_ready and prof.step for long jobs.
2. [Tuning guide: data flow and zeroing](https://docs.pytorch.org/tutorials/recipes/recipes/tuning_guide.html) (PyTorch - reliability and performance recipes) - Enable asynchronous data loading and augmentation with num_workers and pin_memory; Use parameter.grad = None instead of zeroing; Avoid unnecessary CPU-GPU synchronization.
3. [Profiler inside a training loop](https://www.learnpytorch.io/10_pytorch_profiling) (Learn PyTorch - profiler walkthrough) - Adjust training function to track results with SummaryWriter: train_step with tensorboard_trace_handler, non_blocking transfers, autocast forward, and backward plus step inside the profiled range. Depth: Transfer the annotation pattern into your own compact model. Do not keep the tutorial's EfficientNet code, and do not copy its fp16 autocast loop, which has no GradScaler.
4. [Transformer Training FLOP Estimator](https://www.tensortonic.com/problems/cs336-l02-training-flop-estimator) (TensorTonic - mixed-precision memory and transformer FLOPs) - Estimate one training step from forward matrix multiplications and a supplied forward attention cost.

**Focus**

- Annotate before measuring: one range per phase with record_function, plus DataLoader timing outside the step, so data wait cannot hide inside forward.
- Self time excludes children and total includes them. A big total with small self points at the children, not at the named line.
- Predict first, then profile. Write the expected slowest phase and the expected memory peak before running, and explain the residual in writing.
- Every optimization revalidates learning: loss, gradients, controls and resume. A faster run that learns differently is a defect, not a win.

**Reproduce:** On CPU, profile one annotated step of a small MLP with forward, backward and optimizer ranges. Show the train_step total covers its children, export the chrome trace to a nonempty file, and write one sentence attributing the largest phase.

**Traps**

- Profiling with stacks, anomaly detection or gradcheck on and calling it a measurement. Debug tooling distorts the run; measure the clean configuration.
- Tuning the fastest phase. Rank phases first; a 2x win on 5 percent of the step is noise against an unexamined data wait.
- Skipping learning checks after AMP, compile or fusion. Numerics move silently; rerun controls and resume checks before keeping the change.

**Practice**

- [TensorTonic: Transformer Training FLOP Estimator](https://www.tensortonic.com/problems/cs336-l02-training-flop-estimator) - Estimate one training step from forward matrix multiplications and a supplied forward attention cost. Free problem. Then reconcile your estimate with the compact model's profiled step and write down every included and excluded term.

**Stop when:** Your annotated profile attributes every phase, your prediction names the slowest one before the run, and one optimization ships with passing learning and resume checks.

<details>
<summary>Self-test</summary>

1. key_averages shows forward total 55 percent but self 13 percent. Where is the rest?
   - In child operators such as addmm. Self excludes children while total includes them.
2. One aten operator appears twice with different shapes. Which flags produce that split?
   - record_shapes True with group_by_input_shape True on the averages.
3. The memory table shows aten::empty with large self memory and convolutions with none. What does that mean?
   - empty performs the allocation, so it owns the self bytes. The convolutions allocate through calls beneath them.
4. After AMP, compile and a larger batch, loss matches but step time barely moves. Name the next two checks.
   - Read which phase dominates; the bottleneck may be data wait or sync, not math. Then confirm debug tooling is off before further tuning.

</details>

### Mini-project: Profiled, resumable training with one repaired fault

**About 10 to 14 hours.** Take your compact model and trainer, predict its memory and slowest phase before measuring, and profile it with synchronized phases. Then repair one precision, state, graph or performance fault, and show the repaired run still learns and resumes.

1. Write predictions first: parameter, gradient, optimizer-state and activation bytes for your model and batch, and which phase (data wait, transfer, forward, backward, optimizer) will be slowest.
2. Annotate one training step with record_function ranges, time data wait outside the step, and use CUDA events or synchronize at phase boundaries. Profile a few steps with a schedule; on a CPU, profile there and say so.
3. Read allocated, reserved and peak memory per phase, reset peaks before each measured region, list the saved tensors of one layer, and explain one gap between prediction and measurement.
4. Instrument numerics: count non-finite values per step, capture the first invalid value with forward hooks, and replay a fixed batch under anomaly detection to name the backward node.
5. Seed one fault and repair it: fp16 autocast without a GradScaler, clipping before unscale_, an .item() sync inside the step, a graph break under torch.compile, or an incomplete checkpoint.
6. Apply one optimization (autocast, activation checkpointing, compile or loader settings). Show outputs and gradients match eager within tolerance, report a measured gain or an honest null result, and rerun your learning controls.
7. Interrupt the optimized run and resume it from an atomic checkpoint written to a temp file and moved with os.replace, and compare with an uninterrupted run under a declared tolerance.

**Deliverables**

- The prediction sheet and the synchronized profile, with a phase table and memory per phase.
- One fault postmortem with hypotheses, the discriminating measurement, the repair and a regression guard.
- The optimization report: equivalence, timing method and results, learning controls and the resume check.

**Checks**

- external-tests: [TensorTonic: Mixed-Precision Training Memory Accountant and Transformer Training FLOP Estimator](https://www.tensortonic.com/study-plans/language-modeling-from-scratch). Free problems in the PyTorch and einops group. Solve both before filling your prediction sheet.
- rubric: Self-grade with the rubric below.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Prediction before measurement | Predictions are committed before the profile is run. | Each gap between predicted and measured memory or time is explained by a named term, such as the cuBLAS workspace, allocator reserve, a sync or recomputation. |
| Honest timing | Phase times use events or synchronize, and data wait is measured outside the step. | You show one timing that changes when a sync moves, and explain why. |
| Fault repair | One seeded fault is found, repaired and guarded by a test. | The postmortem shows the discriminating measurement and one rejected hypothesis. |
| Optimization validity | Optimized outputs and gradients match eager within tolerance, and the learning controls still pass. | The gain is reported with its spread over repeated runs, or a null result is reported with its cause. |
| Resume | Resume from the atomic checkpoint matches within a declared tolerance. | A test that kills the process during a write shows the previous checkpoint survives. |

Feeds into: Capstone artifact 3: the performance or compile postmortem comes from here, and the resume result also serves artifact 2.

### Resource route

- **Primary - Course:** [PyTorch - reliability and performance recipes](https://docs.pytorch.org/tutorials/recipes/recipes_index.html) - Use the Profiler, Automatic Mixed Precision, model loading and Benchmark recipes, then the Performance Tuning Guide. Apply each to one compact model from an earlier section and keep a CPU fallback when CUDA is unavailable.
- **Required - Reference:** [PyTorch - compiler troubleshooting](https://docs.pytorch.org/docs/stable/torch.compiler_troubleshooting.html) - Read graph breaks, guards, recompilations and logging. Compile one stable fragment, intentionally trigger a graph break or recompilation, inspect it, and compare eager and compiled outputs and gradients.
- **Required - Reference:** [PyTorch - checkpointing, numerical accuracy and CUDA semantics](https://docs.pytorch.org/docs/stable/checkpoint.html) - Use the official user-guide entries for torch.utils.checkpoint, numerical accuracy, CUDA semantics, reproducibility and serialization. Predict memory categories before measuring and define resume equivalence before running.
- **Reference - Assessment:** [Deep Learning Training Debugger](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-2/deep-learning-training-debugger.md) - Use the failure-injection, measurement and evidence rules as the deeper standard. The full Tier 2 project is a later route and is not added to this stage milestone.
- **Support - Practice:** [TensorTonic - mixed-precision memory and transformer FLOPs](https://www.tensortonic.com/study-plans/language-modeling-from-scratch) - Solve only Mixed-Precision Training Memory Accountant and Transformer Training FLOP Estimator. Reconcile both with the compact model's profiler and document every included and excluded term.
- **Optional - Implementation:** [Learn PyTorch - profiler walkthrough](https://www.learnpytorch.io/) - Use notebook 10 only if the official profiler route remains unclear. Transfer the relevant annotations into the compact model instead of keeping the tutorial code.
- **Reference - Reference:** [Python os - os.replace](https://docs.python.org/3/library/os.html#os.replace) - Read os.replace for the atomic-rename step of checkpoint writes: save to a temp file in the same directory, flush and fsync, then replace the final name.

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

**Capstone rubric** (about 10 to 16 hours)

| Criterion | Pass | Strong |
| --- | --- | --- |
| Neural core proof pack | The section 1 mini-project meets Pass on every criterion. | It meets Strong on gradient correctness and on saved values, and one command runs every differential check. |
| Reproducible PyTorch training run | One small CNN, recurrent, VAE or attention model trains in the section 2 trainer with config and split provenance, tiny-set and shuffled-label controls, complete checkpoint state and a stated resume-equivalence result. | Resume is exact on CPU, and a fresh clone reproduces the reported metrics within the stated tolerance. |
| Diagnosis and profile casebook | Three seeded-fault postmortems, one each for objective or data, numerical or state, and performance or compile behavior, each with hypotheses, a discriminating control, repair, regression guard, measured evidence and one limitation. | Each regression guard fails on its fault and passes on its repair in one test command. |
| Rebuild from a clean clone | A README lists the commands that rebuild each artifact. | One script rebuilds every reported number on a CPU or a free notebook GPU, with its run time stated. |
| Honest limits | Each artifact states what its compact model and data cannot show. | Each limit names the later stage or track that addresses it. |

