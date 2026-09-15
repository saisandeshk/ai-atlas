<!-- Generated from content/curriculum.json. Edit the JSON and run npm run content:generate. -->

# 04. Classical Machine Learning

**Level:** Core  
**Scope:** 5 sections · 76 required topics · 13 optional, depth, or later topics

Frame defensible prediction problems, implement central model families, and turn evaluation evidence into bounded decisions.

## Order

01. Formulation, Data Contracts & Baselines
02. Linear & Probabilistic Prediction
03. Trees, Ensembles, Neighbors & Kernels
04. Features, Representation & Unsupervised Learning
05. Evaluation, Uncertainty, Shift & Decisions

## 01. Formulation, Data Contracts & Baselines

**Why:** A model cannot repair a target defined after the decision, a feature unavailable at prediction time, or an evaluation set that already influenced the work. This section fixes the scientific contract before estimator choice.

### Learn this much

- [ ] Unit of observation, population and prediction context _(Required)_
- [ ] Prediction time, feature cutoff, action time and label horizon _(Required)_
- [ ] Target, estimand, loss, metric and decision rule _(Required)_
- [ ] Regression, classification, ranking and unsupervised framing _(Required)_
- [ ] Prediction language versus causal language _(Required)_
- [ ] Random, stratified, grouped and temporal splits _(Required)_
- [ ] Nested selection and final test isolation _(Required)_
- [ ] Target, future, entity, duplicate and preprocessing leakage _(Required)_
- [ ] Label delay, selection bias and feedback leakage _(Required)_
- [ ] Schema, types, provenance, missingness and duplicate audits _(Required)_
- [ ] Categorical unknowns, class prevalence and feature availability _(Required)_
- [ ] Training-only imputation, scaling, encoding and learned state _(Required)_
- [ ] Constant, frequency, heuristic, last-value and simple learned baselines _(Required)_
- [ ] Immutable snapshots, split identities, seeds and raw-prediction lineage _(Required)_
- [ ] Pipeline serialization and training-serving feature parity _(Required)_
- [ ] Production feature stores and streaming ingestion _(Later)_
- [ ] Causal effect estimation and policy optimization _(Later)_

### Resource route

- **Primary - Course:** [Hands-On Machine Learning - Chapters 1 and 2](https://github.com/ageron/handson-mlp) - Use notebooks 01 and 02 plus ml-project-checklist.md for framing, data inspection, test-set creation, preprocessing pipelines, cross-validation, error analysis and persistence. Rebuild the workflow on UCI Bike Sharing with a chronological split and prohibit casual and registered when predicting cnt.
- **Required - Reference:** [scikit-learn - Common pitfalls and pipelines](https://scikit-learn.org/stable/common_pitfalls.html) - Read Common Pitfalls sections on inconsistent preprocessing and leakage, then Pipeline and ColumnTransformer. Seed global scaling, a target-derived feature and a partition duplicate, and make tests reject each defect.
- **Support - Reference:** [scikit-learn - Cross-validation splitters](https://scikit-learn.org/stable/modules/cross_validation.html) - Use the group-aware and time-aware splitter sections plus GroupKFold and TimeSeriesSplit. Choose from the dependence structure and assert that no prohibited group or future timestamp crosses the boundary.
- **Support - Application:** [Rules of Machine Learning - first controls](https://developers.google.com/machine-learning/guides/rules-of-ml) - Read Rules 1-5 and 8-9. Turn the existing heuristic into a baseline and test the feature path independently of the learner.
- **Support - Practice:** [UCI Bike Sharing Dataset](https://archive.ics.uci.edu/dataset/275/bike+sharing+dataset) - Use hour.csv as the compact integrated dataset. Preserve a raw snapshot and data dictionary, split chronologically, and document why casual and registered are target proxies for cnt.

### Exit checkpoint

Defend a one-page prediction contract, split and baseline ladder, then show a seeded leakage or availability defect being caught and changing the conclusion after repair.

<details>
<summary>Deliberately left for later</summary>

- Feature-store and streaming architecture
- Production monitoring implementation
- Causal intervention and policy claims

</details>

## 02. Linear & Probabilistic Prediction

**Why:** Linear and probabilistic models expose their assumptions. They connect likelihood, optimization, regularization, probabilities and decision thresholds before flexible models make those choices harder to see.

### Learn this much

- [ ] Linear regression, residuals and squared versus absolute loss _(Required)_
- [ ] Normal equations, stable solvers and gradient descent _(Required)_
- [ ] Conditioning, feature scale and coefficient instability _(Required)_
- [ ] Polynomial and interaction bases _(Required)_
- [ ] Ridge, lasso and elastic net regularization _(Required)_
- [ ] Logistic regression, odds, sigmoid and log likelihood _(Required)_
- [ ] Stable binary cross-entropy with logits _(Required)_
- [ ] Softmax regression and multiclass cross-entropy _(Required)_
- [ ] One-versus-rest classification _(Required)_
- [ ] LDA and QDA equations, assumptions and decision boundaries _(Required)_
- [ ] Bernoulli, multinomial and Gaussian naive Bayes _(Required)_
- [ ] Priors, smoothing, conditional independence and log-space scoring _(Required)_
- [ ] Generative versus discriminative classification _(Required)_
- [ ] Probability estimates, class priors and asymmetric thresholds _(Required)_
- [ ] Residual, leverage, separation and misspecification diagnostics _(Required)_
- [ ] Robust regression and high-dimensional inference theory _(Depth)_
- [ ] Generalized linear model families beyond link-function intuition _(Later)_
- [ ] Bayesian regression and posterior computation _(Later)_

### Resource route

- **Primary - Course:** [Illinois CS446/ECE449 - linear and probabilistic models](https://courses.grainger.illinois.edu/cs446/fa2025/) - Study Fall 2025 Lectures 5-10, 13 and 15: estimation, naive Bayes, logistic regression, optimization, linear regression, empirical risk and bias-variance. Rework each central derivation on a hand-sized dataset.
- **Required - Theory:** [An Introduction to Statistical Learning with Python](https://www.statlearning.com/) - Use Chapters 3, 4 and 6 with only their Python labs for model assumptions, diagnostics, classification, basis expansion and regularization paths.
- **Required - Implementation:** [Dive into Deep Learning - linear models slice](https://d2l.ai/) - Use 3.1, 3.4, 3.6, 3.7, 4.1, 4.4, 22.7 and 22.9 for linear regression, generalization, weight decay, softmax, maximum likelihood and naive Bayes. Implement with NumPy first and use the PyTorch versions only as a differential reference.
- **Reference - Reference:** [scikit-learn - linear models, discriminant analysis and naive Bayes](https://scikit-learn.org/stable/supervised_learning.html) - Use the official Linear Models, LDA and QDA, and Naive Bayes guides to verify estimator semantics and selected edge cases after the independent implementation works.
- **Support - Implementation:** [Hands-On Machine Learning - classification and linear models](https://github.com/ageron/handson-mlp) - Use notebooks 03 and 04 for classification diagnostics, linear and polynomial regression, regularization and logistic regression. Recreate the target mechanism independently before inspecting worked exercise code.
- **Support - Practice:** [NeetCode ML - linear-model closing drill](https://neetcode.io/practice/machine-learning) - After the section gate, solve Gradient Descent, Sigmoid and ReLU, Softmax, Cross-Entropy Loss, Linear Regression Forward and Linear Regression Training cold. Repeat only failed items from a blank file with changed values.
- **Optional - Practice:** [Deep-ML candidate - linear and probabilistic problems](https://www.deep-ml.com/problems) - Before adopting it, sample problem 15 or 106 and verify its statement, tests, difficulty and feedback. If it passes, use at most one of 15, 106, 140 or 261 as a changed-prompt drill. The local implementation remains the evidence.

### Exit checkpoint

Derive and independently implement linear regression, logistic regression and one naive Bayes variant, then diagnose one numerical failure and one assumption failure on a changed dataset.

<details>
<summary>Deliberately left for later</summary>

- Full generalized linear model theory
- Bayesian posterior computation
- Specialized robust and high-dimensional estimators

</details>

## 03. Trees, Ensembles, Neighbors & Kernels

**Why:** These families encode different geometries and costs. The goal is to choose among them from evidence and constraints instead of defaulting to whichever library wins one score.

### Learn this much

- [ ] CART classification and regression split objectives _(Required)_
- [ ] Gini, entropy, information gain and variance reduction _(Required)_
- [ ] Stopping, pruning and deterministic split ties _(Required)_
- [ ] Bagging, bootstrap samples and variance reduction _(Required)_
- [ ] Random forests, feature subsampling and out-of-bag estimates _(Required)_
- [ ] AdaBoost sample weighting and weak learners _(Required)_
- [ ] Gradient boosting, pseudo-residuals, shrinkage and early stopping _(Required)_
- [ ] k-nearest neighbors, distance, weighting and feature scale _(Required)_
- [ ] Neighbor search cost and the curse of dimensionality _(Required)_
- [ ] Hard and soft margins, hinge loss, slack and support vectors _(Required)_
- [ ] Polynomial and RBF kernels, bandwidth and similarity geometry _(Required)_
- [ ] Kernel matrix time and memory cost _(Required)_
- [ ] Feature importance caveats under correlation and cardinality _(Required)_
- [ ] Class weighting and resampling effects on probability semantics _(Required)_
- [ ] XGBoost, LightGBM and CatBoost configuration literacy _(Optional)_
- [ ] Histogram and distributed boosting internals _(Depth)_
- [ ] Kernel-method proofs and approximation methods _(Depth)_

### Resource route

- **Primary - Course:** [Illinois CS446/ECE449 - neighbors, kernels, trees and ensembles](https://courses.grainger.illinois.edu/cs446/fa2025/) - Study Fall 2025 Lectures 2, 11-13 and 15-20 in order. Work a kNN case, SVM margin case, kernel matrix, tree split and one AdaBoost round by hand.
- **Required - Implementation:** [Hands-On Machine Learning - nonlinear classical models](https://github.com/ageron/handson-mlp) - Use notebooks 03, 05, 06 and Appendix C only for performance measures, trees, ensembles and SVMs. Vary depth, estimators, learning rate, k, C and RBF width under fixed splits.
- **Reference - Reference:** [scikit-learn - neighbors, SVMs, trees and ensembles](https://scikit-learn.org/stable/supervised_learning.html) - Check official estimator constraints, complexity, preprocessing needs, missing-value behavior and probability caveats. Do not use library calls as the mechanism implementation.
- **Support - Theory:** [ISLP - tree-based methods and support vector machines](https://www.statlearning.com/) - Use Chapters 8 and 9 plus their Python labs when a model-choice or feature-importance argument needs a statistical explanation.
- **Optional - Practice:** [Deep-ML candidate - tree, ensemble and kernel problems](https://www.deep-ml.com/problems) - After the platform admission check, use at most one of 138 Best Gini Split, 20 Decision Tree Learning, 307 Bagging, 21 Pegasos Kernel SVM or 280 RBF Kernel as a changed-prompt drill.

### Exit checkpoint

Implement a tested tree core plus one neighbor or kernel mechanism, then defend a family choice using geometry, uncertainty, interpretability, fit cost and prediction cost.

<details>
<summary>Deliberately left for later</summary>

- Distributed and histogram-based boosting internals
- Large-scale approximate nearest-neighbor systems
- SHAP, LIME and advanced kernel proofs

</details>

## 04. Features, Representation & Unsupervised Learning

**Why:** Preprocessing and representation alter the geometry seen by every estimator. Unsupervised output becomes useful evidence only when its stability and downstream value are tested.

### Learn this much

- [ ] Numeric transforms, scaling, clipping and missingness indicators _(Required)_
- [ ] Categorical encoding, unknown categories and sparse features _(Required)_
- [ ] Interactions and feature selection inside the split boundary _(Required)_
- [ ] Fit-state serialization and sparse-to-dense hazards _(Required)_
- [ ] Centered PCA, SVD and principal directions _(Required)_
- [ ] Explained variance, reconstruction error and component choice _(Required)_
- [ ] PCA sign ambiguity and invariant tests _(Required)_
- [ ] k-means objective, assignment, update and initialization _(Required)_
- [ ] Empty clusters, inertia and seed instability _(Required)_
- [ ] Gaussian mixtures, responsibilities and EM intuition _(Required)_
- [ ] DBSCAN and agglomerative clustering geometry _(Required)_
- [ ] Cluster stability, usefulness and internal-metric limits _(Required)_
- [ ] Outlier versus novelty detection and threshold policy _(Required)_
- [ ] Representation dependence of anomaly scores _(Required)_
- [ ] t-SNE and UMAP for guarded exploratory visualization _(Optional)_
- [ ] ICA, NMF, topic models and manifold-learning theory _(Later)_
- [ ] Deep representation learning _(Later)_

### Resource route

- **Primary - Course:** [Hands-On Machine Learning - dimensionality reduction and unsupervised learning](https://github.com/ageron/handson-mlp) - Use notebooks 07 and 08 for PCA, k-means, DBSCAN, agglomerative clustering, Gaussian mixtures and anomaly detection. Stop before extended semi-supervised and face-data projects.
- **Required - Theory:** [Illinois CS446/ECE449 - clustering, PCA and SVD](https://courses.grainger.illinois.edu/cs446/fa2025/) - Study Fall 2025 Lectures 21 and 22. Derive k-means updates and PCA projection and reconstruction before using library estimators.
- **Reference - Reference:** [scikit-learn - decomposition, clustering and outlier detection](https://scikit-learn.org/stable/unsupervised_learning.html) - Check decomposition orientation and solver behavior, cluster API semantics, and the distinction between novelty and outlier detection after the independent tests pass.
- **Support - Theory:** [ISLP - Unsupervised Learning](https://www.statlearning.com/) - Use Chapter 12 and its Python lab for a compact second explanation of PCA and clustering, especially stability and interpretation limits.
- **Optional - Practice:** [Deep-ML candidate - unsupervised problems](https://www.deep-ml.com/problems) - Use the admission sample to inspect 19 PCA or 17 K-Means. If the judge catches a seeded wrong implementation, use at most one of 19, 17, 341, 259 or 367 as a changed-prompt drill.

### Exit checkpoint

Produce a reproducible feature, PCA and clustering result with invariant-aware tests, then state what the clusters or anomaly scores do and do not justify from stability and downstream evidence.

<details>
<summary>Deliberately left for later</summary>

- Deep representation learning
- Full manifold-learning theory
- Semantic claims from unlabeled clusters

</details>

## 05. Evaluation, Uncertainty, Shift & Decisions

**Why:** A score becomes actionable only after selection, uncertainty, calibration, slices, costs and plausible shifts have been checked under a frozen protocol.

### Learn this much

- [ ] Holdout, cross-validation, nested selection and final test isolation _(Required)_
- [ ] Group and temporal resampling with the correct sampling unit _(Required)_
- [ ] MAE, RMSE and decision-weighted regression error _(Required)_
- [ ] Confusion matrix, precision, recall and F1 _(Required)_
- [ ] ROC AUC, average precision, log loss and Brier score _(Required)_
- [ ] Calibration curves, slope and intercept at interpretation level _(Required)_
- [ ] Platt and isotonic calibration on held-out predictions _(Required)_
- [ ] Cost-sensitive thresholds and selective prediction _(Required)_
- [ ] Class imbalance, prevalence change and metric choice _(Required)_
- [ ] Paired bootstrap intervals, permutation tests and effect sizes _(Required)_
- [ ] Multiplicity, search history and winner's curse _(Required)_
- [ ] Learning curves, error taxonomies and slice support counts _(Required)_
- [ ] Permutation importance and correlated-feature limits _(Required)_
- [ ] Partial dependence and noncausal interpretation boundaries _(Required)_
- [ ] Covariate, label and concept shift _(Required)_
- [ ] Data drift, performance drift and label delay _(Required)_
- [ ] Ablations, negative controls and failure injection _(Required)_
- [ ] Threats to validity and narrow decision memos _(Required)_
- [ ] Conformal prediction and formal fairness criteria _(Later)_
- [ ] Causal estimation and online experiment infrastructure _(Later)_

### Resource route

- **Primary - Course:** [scikit-learn - model selection and evaluation route](https://scikit-learn.org/stable/model_selection.html) - Follow Cross-validation, Hyperparameter tuning, Decision threshold tuning, Metrics and scoring, Probability calibration, Validation curves, Permutation importance and Common Pitfalls. Retain raw predictions and independently hand-check central metrics.
- **Required - Theory:** [ISLP - resampling and multiple testing](https://www.statlearning.com/) - Use Chapter 5 and the relevant selection-history parts of Chapter 13 with their Python labs. Connect resampling to uncertainty and multiplicity without repeating the full statistics stage.
- **Reference - Assessment:** [Classical ML Scientific Investigation](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-2/classical-ml-scientific-investigation.md) - Use Core requirements, architecture constraints, Milestones A-F and failure injection as the standard for end-to-end evidence. The full project remains a later capstone route.
- **Support - Theory:** [D2L - Environment and Distribution Shift](https://d2l.ai/chapter_linear-classification/environment-and-distribution-shift.html) - Read 4.7, then construct one controlled covariate, label and concept shift. Record what changes, which signal detects it and what response the evidence supports.
- **Optional - Practice:** [Deep-ML candidate - evaluation problems](https://www.deep-ml.com/problems) - After the platform admission check, use at most one of 18 K-Fold CV, 260 Expected Calibration Error, 276 ROC, 277 AUC or 840 Stratified K-Fold. Hand-checked local metrics remain the evidence.

### Exit checkpoint

Produce a frozen comparison with paired uncertainty, calibration or a reason it does not apply, threshold policy, slices, one shift study and a decision that survives a small movement in the best score.

<details>
<summary>Deliberately left for later</summary>

- Full causal and policy evaluation
- Production online experimentation and monitoring
- Formal conformal and fairness frameworks

</details>

## Stage milestone

### Classical ML Investigation Pack

Complete one compact investigation on a controlled structured dataset. Three artifacts are enough to show formulation, mechanism fluency and decision quality without collecting unrelated notebooks.

- Contract and leakage pack - prediction contract, immutable manifest, split builder, schema and availability tests, two naive baselines, and one preserved leakage failure with its repair
- Classical mechanisms suite - tested NumPy implementations of regularized linear or logistic regression, naive Bayes, a deterministic tree core plus one ensemble, kNN or a small kernel model, PCA and k-means
- Decision dossier - locked model budget, raw predictions, paired uncertainty, calibration and threshold policy where relevant, slices, error analysis, one shift or failure injection, a negative result and a bounded next decision

