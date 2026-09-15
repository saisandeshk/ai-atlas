<!-- Generated from content/curriculum.json. Edit the JSON and run npm run content:generate. -->

# 01. Mathematical Foundations

**Level:** Foundational  
**Scope:** 5 sections · 73 required topics · 10 optional, depth, or later topics

The mathematical language needed to understand, implement and diagnose learning systems.

## Order

01. Linear Algebra & Proof
02. Calculus & Automatic Differentiation
03. Probability, Information & Bayesian Reasoning
04. Statistics, Experimentation & Causality
05. Optimization & Numerical Methods

## 01. Linear Algebra & Proof

**Why:** Models are compositions of linear maps. Geometry, rank and conditioning explain what a model can represent and when a correct formula still fails numerically.

### Learn this much

- [ ] Definitions, quantifiers, implications and counterexamples _(Required)_
- [ ] Scalars, vectors, matrices and tensor shape notation _(Required)_
- [ ] Linear maps, matrix representations and composition _(Required)_
- [ ] Span, independence, basis and change of coordinates _(Required)_
- [ ] Column space, row space, null space and orthogonal complements _(Required)_
- [ ] Rank, invertibility, solution sets and identifiability _(Required)_
- [ ] Inner products, norms, angles and distance _(Required)_
- [ ] Orthogonality, orthonormal bases and Gram-Schmidt _(Required)_
- [ ] Projection matrices and residual geometry _(Required)_
- [ ] Least squares, normal equations and stable solution routes _(Required)_
- [ ] Eigenvalues, eigenvectors, diagonalization and spectral reasoning _(Required)_
- [ ] Symmetric and positive-semidefinite matrices; Gram matrices _(Required)_
- [ ] Singular-value decomposition and the pseudoinverse _(Required)_
- [ ] PCA, low-rank approximation and reconstruction error _(Required)_
- [ ] Batched shapes, broadcasting, parameter counts and operation costs _(Required)_
- [ ] Condition number, residual error, solution error and numerical stability _(Required)_
- [ ] Sparse and structured matrices _(Later)_
- [ ] Advanced matrix perturbation theory _(Depth)_

### Resource route

- **Primary - Course:** [MIT 18.06 - Linear Algebra](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/) - Follow lectures 1-10, 14-17, 21-22, 25, 27, 29-31 and 33 with matching problems. This is the ordered first pass.
- **Required - Practice:** [MIT 6.042J - Proof strand](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/pages/readings/) - Study textbook Chapters 1 and 3, §§4.1-4.4 and §§5.1-5.4 with matching Unit 1 problems. Leave the rest of the course.
- **Required - Application:** [MIT 18.065 - Applied matrix bridge](https://ocw.mit.edu/courses/18-065-matrix-methods-in-data-analysis-signal-processing-and-machine-learning-spring-2018/resources/lecture-videos/) - Use lectures 3-10 after 18.06 for SVD, PCA, low-rank approximation, matrix norms and solver difficulty.
- **Reference - Theory:** [Mathematics for Machine Learning](https://mml-book.github.io/) - Use Chapters 2-4 and §10.2 to check notation or re-derive a result. Do not treat it as a second course.
- **Support - Practice:** [Introduction to Applied Linear Algebra](https://web.stanford.edu/~boyd/vmls/) - Sample Chapters 1-13 and the extra exercises for computational practice in fitting, least squares and pseudoinverses.
- **Optional - Intuition:** [Essence of Linear Algebra](https://www.3blue1brown.com/topics/linear-algebra) - Open only when a geometric picture is missing; it does not replace derivation or problem solving.

### Exit checkpoint

Derive least squares and PCA, implement both from a blank file, and diagnose one rank-deficient or ill-conditioned case.

<details>
<summary>Deliberately left for later</summary>

- Advanced matrix perturbation bounds
- Specialized sparse-direct solvers
- Functional analysis beyond what later tracks require

</details>

## 02. Calculus & Automatic Differentiation

**Why:** Training is repeated differentiation through composed programs. Shape-aware derivatives and numerical checks are the fastest way to separate a wrong model from a wrong implementation.

### Learn this much

- [ ] Limits, local approximation and differentiability _(Required)_
- [ ] Partial and directional derivatives _(Required)_
- [ ] Gradients as local linear models and steepest directions _(Required)_
- [ ] Jacobians, Hessians and consistent shape conventions _(Required)_
- [ ] First- and second-order Taylor approximations _(Required)_
- [ ] Scalar and multivariable chain rule _(Required)_
- [ ] Matrix derivatives for affine, quadratic and least-squares objectives _(Required)_
- [ ] Gradients of logistic, softmax cross-entropy and regularized losses _(Required)_
- [ ] Computational graphs and accumulation through branches _(Required)_
- [ ] Forward mode, reverse mode, JVPs and VJPs _(Required)_
- [ ] Backpropagation through dense layers and nonlinearities _(Required)_
- [ ] Finite-difference gradient checking and its failure modes _(Required)_
- [ ] Hessian-vector products _(Optional)_
- [ ] Implicit differentiation _(Depth)_

### Resource route

- **Primary - Course:** [MIT 18.S096 - Matrix Calculus for ML](https://ocw.mit.edu/courses/18-s096-matrix-calculus-for-machine-learning-and-beyond-january-iap-2023/pages/lecture-notes-and-readings/) - Use lectures 1-5, the Hessian portion of lecture 7 and computational-graph portion of lecture 8; do the supplied problems and notebooks.
- **Required - Implementation:** [Hands-On ML - Autodiff notebook](https://github.com/ageron/handson-mlp/blob/main/Appendix_A_autodiff.ipynb) - Work through numerical differentiation and both AD modes, then rebuild the essential reverse-mode engine independently.
- **Required - Reference:** [PyTorch Autograd mechanics](https://docs.pytorch.org/docs/stable/notes/autograd) - Consult after the handwritten engine for accumulation, graph behavior, disabled tracking and vector-Jacobian products.
- **Reference - Theory:** [Mathematics for Machine Learning - Ch. 5](https://mml-book.github.io/) - Use Chapter 5 as the compact derivative, Jacobian, chain-rule and backpropagation reference.
- **Optional - Refresher:** [MIT 18.02SC - Multivariable Calculus Unit 2](https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/pages/2.-partial-derivatives/) - Use sessions 24-38 only if partial derivatives, gradients, Hessians or the multivariable chain rule are weak.

### Exit checkpoint

Derive a branched matrix computation, implement a small reverse-mode autodiff engine, and isolate a seeded gradient error.

<details>
<summary>Deliberately left for later</summary>

- General differential geometry
- Full symbolic differentiation systems
- Higher-order implicit differentiation

</details>

## 03. Probability, Information & Bayesian Reasoning

**Why:** Model outputs, losses, sampling and uncertainty all depend on conditioning correctly and keeping the data-generating assumptions visible.

### Learn this much

- [ ] Sample spaces, events and probability axioms _(Required)_
- [ ] Random variables, PMFs, PDFs and CDFs _(Required)_
- [ ] Joint, marginal and conditional distributions _(Required)_
- [ ] Independence and conditional independence _(Required)_
- [ ] Expectation, variance, covariance and correlation _(Required)_
- [ ] Total probability, expectation and variance _(Required)_
- [ ] Bernoulli, binomial, categorical, Gaussian, exponential and Poisson families _(Required)_
- [ ] Transformations of random variables _(Required)_
- [ ] Bayes rule, likelihood, evidence and posterior _(Required)_
- [ ] Conditional expectation _(Required)_
- [ ] Law of large numbers and central-limit behavior _(Required)_
- [ ] Concentration bounds and what breaks under dependence or heavy tails _(Required)_
- [ ] Monte Carlo estimation and sampling error _(Required)_
- [ ] Entropy, cross-entropy, KL divergence and mutual information _(Required)_
- [ ] Priors, conjugacy, posterior predictive distributions and sensitivity _(Required)_
- [ ] Simple graphical factorization and latent variables _(Optional)_
- [ ] Measure-theoretic probability _(Depth)_

### Resource route

- **Primary - Course:** [Harvard Stat 110 - Probability](https://stat110.hsites.harvard.edu/youtube) - Follow lectures 4-14, 17-23 and 25-30 with matching Strategic Practice. Use lectures 1-3 only for prerequisite repair.
- **Required - Practice:** [Stat 110 Strategic Practice](https://stat110.hsites.harvard.edu/strategic-practice-problems) - Solve the matching sets before marking a probability topic Practised; use solutions to audit reasoning, not to begin it.
- **Required - Course:** [MIT 18.05 - Bayesian bridge](https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/pages/calendar/) - Use classes 10-16 for MLE, Bayesian updating, posterior prediction, conjugacy, prior choice and credible intervals.
- **Reference - Theory:** [Probabilistic Machine Learning: An Introduction](https://probml.github.io/book1) - Consult targeted parts of Chapters 2, 3, 4 and 6 for ML notation, Monte Carlo, factorization, posterior prediction and information theory.
- **Required - Implementation:** [D2L - Information Theory](https://d2l.ai/chapter_appendix-mathematics-for-deep-learning/information-theory.html) - Use §§22.11.1-22.11.5 for runnable entropy, cross-entropy, KL and mutual-information examples and exercises.

### Exit checkpoint

Solve a new conditional-probability problem, verify it by simulation, and derive a posterior predictive calculation with its assumptions.

<details>
<summary>Deliberately left for later</summary>

- Measure-theoretic proofs
- Advanced stochastic processes
- General-purpose approximate inference

</details>

## 04. Statistics, Experimentation & Causality

**Why:** A model result matters only when the estimand, uncertainty and decision rule survive leakage, selection and alternative explanations.

### Learn this much

- [ ] Populations, samples, estimands, estimators and estimates _(Required)_
- [ ] Bias, variance, consistency and efficiency _(Required)_
- [ ] Likelihood, maximum likelihood and MAP estimation _(Required)_
- [ ] Confidence, credible and prediction intervals _(Required)_
- [ ] Hypothesis tests, errors, power and effect size _(Required)_
- [ ] Bootstrap and permutation tests _(Required)_
- [ ] Multiple comparisons, optional stopping and winner's curse _(Required)_
- [ ] Regression assumptions and diagnostics _(Required)_
- [ ] Calibration and uncertainty decomposition _(Required)_
- [ ] Missingness and selection mechanisms _(Required)_
- [ ] Randomization, units, metrics and experiment design _(Required)_
- [ ] Power and minimum detectable effect _(Required)_
- [ ] Predictive, associational and causal claims _(Required)_
- [ ] Causal graphs, confounders, colliders and mediators _(Required)_
- [ ] Interventions, adjustment and identification assumptions _(Required)_
- [ ] Heterogeneous treatment effects _(Optional)_
- [ ] Semiparametric causal estimation _(Depth)_

### Resource route

- **Primary - Course:** [MIT 14.310x - Data Analysis for Social Scientists](https://ocw.mit.edu/courses/14-310x-data-analysis-for-social-scientists-spring-2023/pages/calendar/) - Follow lectures 11-15, 17-20 and 22 with matching slides and problem sets for inference, regression, causality and experiment design.
- **Required - Practice:** [MIT 18.05 - Inference practice](https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/pages/calendar/) - Use classes 17-20, 22-24 and 26 with their problem sets for tests, intervals, bootstrap and regression.
- **Required - Theory:** [Causal Inference: What If](https://www.hsph.harvard.edu/miguel-hernan/wp-content/uploads/sites/1268/2024/04/hernanrobins_WhatIf_26apr24.pdf) - Read Chapters 1-3 and 6-8 for causal effects, DAGs, confounding, selection bias and identification reasoning.
- **Required - Application:** [Patterns of trustworthy experimentation](https://www.microsoft.com/en-us/research/group/experimentation-platform-exp/articles/patterns-of-trustworthy-experimentation-during-experiment-stage/) - Read after the course to connect health checks, guardrails and statistical interpretation to production launch decisions.
- **Depth - Depth:** [Always Valid Inference](https://arxiv.org/abs/1512.04922) - Use the introduction and worked motivation to understand optional-stopping failure. Reproducing the theory is outside this gate.

### Exit checkpoint

Audit a flattering experiment, identify its validity failures, and produce a defensible rerun and decision memo.

<details>
<summary>Deliberately left for later</summary>

- Advanced semiparametric efficiency theory
- Longitudinal causal inference
- Specialized survey methodology

</details>

## 05. Optimization & Numerical Methods

**Why:** Training behavior is controlled by objective geometry, stochastic noise, finite precision and the state carried by the optimizer.

### Learn this much

- [ ] Convex sets, convex functions and geometric intuition _(Required)_
- [ ] First- and second-order optimality conditions _(Required)_
- [ ] Smoothness, strong convexity and conditioning _(Required)_
- [ ] Gradient descent on quadratic and general objectives _(Required)_
- [ ] Stochastic gradients, minibatches and noise _(Required)_
- [ ] Momentum and acceleration intuition _(Required)_
- [ ] Adaptive optimizers, bias correction and weight decay _(Required)_
- [ ] Learning-rate schedules, clipping and stopping _(Required)_
- [ ] Constrained optimization, Lagrangians and KKT conditions _(Required)_
- [ ] Regularization and proximal intuition _(Required)_
- [ ] Floating-point representation, rounding and machine precision _(Required)_
- [ ] Overflow, underflow and catastrophic cancellation _(Required)_
- [ ] Stable softmax, log-sum-exp and online reductions _(Required)_
- [ ] Residuals, tolerances and iterative-solver error _(Required)_
- [ ] Mixed precision and accumulation choices _(Required)_
- [ ] Newton and quasi-Newton methods _(Optional)_
- [ ] Convex duality beyond KKT interpretation _(Depth)_

### Resource route

- **Primary - Course:** [Stanford EE364a - Convex Optimization](https://see.stanford.edu/Course/EE364A) - Follow lectures 1-9 and 15-16; use lecture 17 only for KKT systems. Leave full interior-point treatment for later.
- **Required - Theory:** [Convex Optimization](https://web.stanford.edu/~boyd/cvxbook/) - Read Chapters 1-5 and 9 with the course; use Chapter 10 only for equality-constrained Newton steps.
- **Required - Implementation:** [D2L - Optimization Algorithms](https://d2l.ai/chapter_optimization/) - Use the convexity, GD, SGD, minibatch, momentum, AdaGrad, RMSProp, Adam and scheduler sections for ML derivations and code.
- **Required - Numerics:** [Fundamentals of Numerical Computation](https://fncbook.com/) - Study §§1.1-1.4, 2.7-2.8, 3.2-3.4 and 4.2-4.3 for floating point, conditioning, stability, least squares and iteration error.
- **Support - Reference:** [CVXPY basic and DCP tutorials](https://www.cvxpy.org/tutorial/intro/index.html) - Use as the solver oracle after deriving a constrained problem and its KKT conditions by hand.

### Exit checkpoint

Implement and compare optimizers on changed geometry, then diagnose one divergence and one finite-precision failure.

<details>
<summary>Deliberately left for later</summary>

- Interior-point implementation details
- Nonsmooth variational analysis
- Large-scale distributed optimizer design

</details>

## Stage milestone

### Numerical Learning Laboratory

Build a small NumPy project that connects least squares and PCA, reverse-mode differentiation, Monte Carlo uncertainty, experiment analysis and optimizer stability. Each component must include one failure case and one independent check.

- Derivations and assumption notes
- Runnable implementation with tests and raw numerical comparisons
- A short defense of solver, estimator and tolerance choices

