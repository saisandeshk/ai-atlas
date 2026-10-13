<!-- Generated from content/curriculum.json. Edit the JSON and run npm run content:generate. -->

# 01. Applied Science & ML Research

**Level:** Advanced  
**Scope:** 8 track stages · 144 required topics · 25 optional, depth, or later topics

Turn an ambiguous ML question into a falsifiable formulation, fair comparison, trustworthy experiment and defensible decision. One investigation grows across the track, preserving uncertainty, negative evidence and reproducible lineage.

## Order

AS-1. Falsifiable Formulation
AS-2. Statistical Learning Judgment
AS-3. Measurement and Uncertainty
AS-4. Data-Centric Science and Shift
AS-5. Causal Reasoning and Online Experiments
AS-6. Reproduction, Ablation and Scaling
AS-7. Research Communication and Review
AS-8. Original Research Judgment

## AS-1. Falsifiable Formulation

**Why:** A useful investigation begins with a decision, a measurable claim and evidence that could prove the proposed explanation wrong. This stage fixes that contract before model choice can hide a weak question.

### Learn this much

- [ ] Problem context, stakeholders and the decision that may change _(Required)_
- [ ] Decision, prediction and causal questions as distinct formulations _(Required)_
- [ ] User action, intervention and outcome horizon _(Required)_
- [ ] Population, unit, target and estimand _(Required)_
- [ ] Feature time, label time and action time _(Required)_
- [ ] Constructs, proxy metrics and construct validity _(Required)_
- [ ] Utility, error cost, operational constraints and guardrails _(Required)_
- [ ] Mechanism hypothesis and predicted observable signatures _(Required)_
- [ ] Falsification conditions and competing explanations _(Required)_
- [ ] Smallest useful effect and practical significance _(Required)_
- [ ] Deploy, iterate, collect-data and stop thresholds _(Required)_
- [ ] Naive, heuristic, simple learned and strongest reasonable baselines _(Required)_
- [ ] Split, metric and evaluation contract fixed before comparison _(Required)_
- [ ] Baseline-only study of variance, slices, difficulty and headroom _(Required)_
- [ ] Failure tree across data, model, metric, causal, system and product causes _(Required)_
- [ ] Data rights, privacy, safety, compute and feasibility boundaries _(Required)_
- [ ] Value-of-information ranking for candidate experiments _(Optional)_
- [ ] Formal utility and Bayesian decision theory _(Depth)_
- [ ] Full causal identification analysis _(Later)_

### Resource route

- **Primary - Guide:** [Project Design - Planning and Checklist](https://book.the-turing-way.org/project-design/pd-overview/) - Use Getting Started with Project Design, the Getting Started Checklist and Reproducibility Methods. Record users, methods, resources, risks, ethics, expected outcomes and which work is exploratory or confirmatory.
- **Required - Course:** [Machine Learning Problem Framing](https://developers.google.com/machine-learning/problem-framing) - Complete Understand the Problem, Frame the ML Problem and Summary with every embedded exercise. Convert the result into a one-page contract naming the decision, output, data, metric, benchmark and non-ML alternative.
- **Required - Reference:** [The Heilmeier Catechism](https://www.darpa.mil/about/heilmeier-catechism) - Answer all eight questions for the proposed investigation, including current practice, novelty, who cares, risks, cost, duration and the midterm and final examinations. Use the answers to remove vague scope.
- **Support - Reference:** [Rules of Machine Learning - Selected Rules](https://developers.google.com/machine-learning/guides/rules-of-ml) - Read the opening, Rules 1-5, Rule 12 and Rules 25-28. Use them to preserve a simple baseline, define the first pipeline and anticipate metric and error-pattern failures. Do not read all 43 rules now.
- **Support - Course:** [CS329S - Machine Learning Systems Design](https://stanford-cs329s.github.io/syllabus.html) - Use the lectures Understanding ML Production, Training Data, Model Selection and Development, Model Training and Offline Evaluation. Extract operational constraints and failure modes into the problem contract.
- **Support - Project:** [Applied Science Investigation - Research Charter](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-3/applied-science-investigation.md) - Use Overview, Milestone A and the correctness requirements as the artifact template. Begin one investigation here and keep extending the same artifact through AS-8.

### Exit checkpoint

Defend three formulations for one ambiguous request, select one, and show an executable baseline contract with timing and leakage tests plus a result that would falsify the proposed mechanism.

<details>
<summary>Deliberately left for later</summary>

- Full causal identification and policy optimization
- Production feature-store and monitoring architecture
- Formal decision theory beyond the chosen decision

</details>

## AS-2. Statistical Learning Judgment

**Why:** Model choice is a scientific comparison problem. This stage teaches how to match inductive bias to data and decision constraints while preventing tuning effort, seed choice or leakage from deciding the winner.

### Learn this much

- [ ] Empirical risk, expected risk and generalization _(Required)_
- [ ] Hypothesis classes and inductive bias _(Required)_
- [ ] Capacity, complexity and regularization _(Required)_
- [ ] Bias-variance tradeoff and its observable signatures _(Required)_
- [ ] Irreducible, approximation, estimation, optimization and distribution error _(Required)_
- [ ] Model family choice from data, decision and operational constraints _(Required)_
- [ ] Nested model selection and final-test isolation _(Required)_
- [ ] Preprocessing and feature selection inside the selection loop _(Required)_
- [ ] Matched tuning, compute and wall-clock budgets _(Required)_
- [ ] Complete seed retention and no best-seed filtering _(Required)_
- [ ] Learning curves and validation curves for diagnosis _(Required)_
- [ ] Calibration, recalibration and decision thresholds _(Required)_
- [ ] Abstention and selective risk-coverage behavior _(Required)_
- [ ] Ensembles, diversity and correlated errors _(Required)_
- [ ] Data intervention versus model intervention _(Required)_
- [ ] Residual, shortcut, counterfactual and slice diagnosis _(Required)_
- [ ] Bayesian prior sensitivity for high-cost decisions _(Optional)_
- [ ] PAC bounds and uniform convergence proofs _(Depth)_
- [ ] Bayesian model averaging and posterior predictive comparison _(Depth)_
- [ ] Large automated hyperparameter sweeps _(Later)_

### Resource route

- **Primary - Course:** [STATS202 - Data Mining and Analysis](https://web.stanford.edu/class/stats202/intro.html) - Follow Introduction, Regression, Classification, Resampling, Model Selection, Tree-Based Methods, SVM and Unsupervised Learning in that order. Complete the matching public labs and prediction challenge workflow.
- **Required - Book:** [An Introduction to Statistical Learning with Python](https://www.statlearning.com/) - Use Chapters 2-9 and 12 only where STATS202 needs a second explanation or lab. Prioritize the end-of-chapter labs for resampling, model selection, trees, SVM and unsupervised learning.
- **Required - Theory:** [CS229 Public Materials - Learning Theory and Model Selection](https://see.stanford.edu/Course/CS229) - Read notes4 on learning theory, notes5 on regularization and model selection, and the practical advice material. Use them to defend capacity, regularization and fair selection without repeating the full core ML course.
- **Required - Guide:** [Deep Learning Tuning Playbook - Scientific Tuning](https://github.com/google-research/tuning_playbook) - Read the scientific approach, incremental tuning, exploration versus exploitation, scientific and nuisance hyperparameters, and study-design sections. Predeclare fair budgets and retain every valid run.
- **Support - Practice:** [scikit-learn - Model Selection and Evaluation](https://scikit-learn.org/stable/model_selection.html) - Implement nested cross-validation, learning curves and validation curves from the linked examples. Add a test that fails if preprocessing or selection sees the final test fold.
- **Support - Practice:** [scikit-learn - Probability Calibration Examples](https://scikit-learn.org/stable/auto_examples/calibration/index.html) - Run the calibration-curve and classifier-calibration examples. Compare ranking, probability quality and the downstream decision after calibration instead of reporting accuracy alone.

### Exit checkpoint

Run a matched-budget comparison of two materially different model families. The ranking must survive reasonable seed and budget changes, and the report must isolate whether the next gain is more likely to come from data or model complexity.

<details>
<summary>Deliberately left for later</summary>

- Full proofs of statistical learning theory
- Bayesian model averaging and advanced posterior computation
- Large search services and population-based tuning

</details>

## AS-3. Measurement and Uncertainty

**Why:** A model result is useful only when the measurement matches the sampling process and the remaining uncertainty is visible. This stage turns scores into decisions without hiding dependence, multiplicity or practical cost.

### Learn this much

- [ ] Internal, external, construct and statistical-conclusion validity _(Required)_
- [ ] Sampling unit, dependence and pseudoreplication _(Required)_
- [ ] Estimand, estimator and effect size _(Required)_
- [ ] Sampling distributions and standard errors _(Required)_
- [ ] Confidence intervals and repeated-sampling interpretation _(Required)_
- [ ] Credible intervals and prior-dependent interpretation _(Required)_
- [ ] Bootstrap at the correct resampling unit _(Required)_
- [ ] Permutation and randomization tests _(Required)_
- [ ] Null, alternative, test statistic and reference distribution _(Required)_
- [ ] Type I and II errors, power and minimum detectable effect _(Required)_
- [ ] Optional stopping and sequential looks _(Required)_
- [ ] Multiple outcomes, slices, comparisons and adjustments _(Required)_
- [ ] Pre-analysis plan, exclusions and deviation log _(Required)_
- [ ] Seed, data, annotator and system variance _(Required)_
- [ ] Robust aggregation, distributions and sensitivity analysis _(Required)_
- [ ] Heterogeneous effects, slice counts and stability _(Required)_
- [ ] Calibration, sharpness and limits of aggregate ECE _(Required)_
- [ ] Prediction intervals and conformal coverage _(Required)_
- [ ] Selective risk, coverage and abstention _(Optional)_
- [ ] Semiparametric efficiency and always-valid inference _(Depth)_
- [ ] Formal asymptotic theory beyond the selected estimator _(Later)_

### Resource route

- **Primary - Course:** [MS&E 226 - Fundamentals of Data Science](https://web.stanford.edu/class/msande226/l_notes.html) - Study Lectures 8-12 on frequentist inference, standard errors, confidence intervals, bootstrap, hypothesis testing and multiple tests, then Lecture 16 on Bayesian inference and decision making. Complete the linked notebooks or apps.
- **Required - Practice:** [SciPy Statistics - Resampling and Monte Carlo Methods](https://docs.scipy.org/doc/scipy/tutorial/stats/resampling.html) - Complete the Monte Carlo test, permutation test and bootstrap tutorials. Rebuild one interval or test from blank NumPy code and validate its behavior under a null and a known effect.
- **Required - Reference:** [statsmodels - Power and Multiple Testing](https://www.statsmodels.org/stable/stats.html) - Use the power and sample-size classes plus multipletests for the chosen experiment. Record the assumed effect and variance, then test sensitivity to plausible misspecification.
- **Support - Practice:** [MAPIE - Prediction Sets and Intervals](https://mapie.readthedocs.io/en/stable/) - Use the quick start for one regression interval or classification prediction set. Check empirical coverage overall and by a predeclared slice, then report interval width or set size.
- **Depth - Theory:** [18.650 - Statistics for Applications](https://ocw.mit.edu/courses/18-650-statistics-for-applications-fall-2016/pages/syllabus/) - Use selected lectures and problem sets on parametric inference, maximum likelihood, hypothesis testing, Bayesian statistics and generalized linear models when the investigation needs more derivation than MS&E 226 supplies.
- **Support - Assessment:** [Applied Science and ML Research Checkpoint](https://github.com/saisandeshk/Roadmap-Final/blob/main/checkpoints/applied-science-ml-research.md) - Use the Formulate and Reason plus Reproduce and Experiment sections as the closed-note audit for sampling units, uncertainty, robustness and decision language.

### Exit checkpoint

Execute a precommitted analysis with the correct sampling and resampling units. Demonstrate by simulation that a naive analysis can mislead, then defend the repaired decision using effect, uncertainty, cost and validity threats.

<details>
<summary>Deliberately left for later</summary>

- Sequential and always-valid inference theory
- Semiparametric efficiency and influence functions
- Hierarchical Bayesian modeling beyond the chosen investigation

</details>

## AS-4. Data-Centric Science and Shift

**Why:** The dataset is part of the mechanism, not a neutral input. This stage makes provenance, coverage, label policy, leakage, shift and feedback measurable before another model iteration is allowed.

### Learn this much

- [ ] Provenance, license, consent, privacy and permitted use _(Required)_
- [ ] Schema, units, ranges and semantic contracts _(Required)_
- [ ] MCAR, MAR and MNAR as diagnostic models _(Required)_
- [ ] Annotation instructions, disagreement and adjudication _(Required)_
- [ ] Label-error detection and confident-learning intuition _(Required)_
- [ ] Class imbalance, rare events and metric consequences _(Required)_
- [ ] Outliers, hard negatives and boundary coverage _(Required)_
- [ ] Exact duplicates, near duplicates and benchmark contamination _(Required)_
- [ ] Sampling, population coverage and long-tail behavior _(Required)_
- [ ] Predeclared slice taxonomy and sparse-slice uncertainty _(Required)_
- [ ] Fairness metrics, label bias and subgroup harm boundaries _(Required)_
- [ ] Covariate, label and concept shift _(Required)_
- [ ] Observed drift versus measured performance degradation _(Required)_
- [ ] Delayed labels, detection delay and monitoring blind spots _(Required)_
- [ ] Fixed-model relabeling, filtering, deduplication and coverage studies _(Required)_
- [ ] Active selection and information value of new labels _(Required)_
- [ ] Synthetic-data amplification, collapse and provenance risks _(Required)_
- [ ] Feedback loops, selective labels and retraining bias _(Required)_
- [ ] Data lineage, transformation state and version manifest _(Required)_
- [ ] Advanced fairness-constrained optimization _(Optional)_
- [ ] Differential privacy and privacy-preserving learning _(Depth)_
- [ ] Large-scale annotation and data-governance platforms _(Later)_

### Resource route

- **Primary - Course:** [Introduction to Data-Centric AI](https://dcai.csail.mit.edu/) - Follow the 2024 lectures and labs on data-centric versus model-centric development, label errors, imbalance, outliers, distribution shift, dataset creation, curation and evaluation. Use the GenAI curation unit only if the chosen artifact is generative.
- **Required - Guide:** [Data Governance for the ML Pipeline](https://book.the-turing-way.org/project-design/data-security/data-governance/data-gov-ml/) - Read Data Governance for the ML Pipeline, Version Control for Data and Data Cleaning. Record ownership, consent, access, deletion, transformations, fitted state, quality checks and immutable identifiers.
- **Required - Practice:** [Data Cards Playbook - User Guide](https://sites.research.google/datacardsplaybook/guide/) - Complete the eight-step workflow. Produce a compact data card covering authorship, intent, access, deletion, provenance, sensitive attributes, transformations, annotations, sampling, validation and known uses.
- **Required - Practice:** [scikit-learn - Common Pitfalls](https://scikit-learn.org/stable/common_pitfalls.html) - Study inconsistent preprocessing and data leakage. Convert the examples into tests for split overlap, future features, preprocessing scope, duplicate entities and fitted-state leakage.
- **Support - Course:** [ML Crash Course - Production ML Systems](https://developers.google.com/machine-learning/crash-course/production-ml-systems) - Use the production systems unit for data dependencies, feedback loops and monitoring. Apply its exercises to the artifact's delayed labels, drift signals and retraining boundary.
- **Support - Course:** [ML Crash Course - Fairness](https://developers.google.com/machine-learning/crash-course/fairness) - Use the fairness unit for sources of bias, subgroup evaluation and metric choice. Apply only the exercises needed to state and measure the artifact's fairness boundary.
- **Support - Project:** [Applied Science Investigation - Data Audit](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-3/applied-science-investigation.md) - Use Milestones B and E plus the failure-injection list for provenance, leakage, duplicates, shift, subgroup sparsity and data-lineage evidence.

### Exit checkpoint

Trace every reported example to a versioned data and label process, then run at least three fixed-model data interventions and a controlled-shift test with uncertainty, slice effects, detection delay and an explicit retraining decision.

<details>
<summary>Deliberately left for later</summary>

- Advanced fairness optimization and causal fairness
- Differential privacy and federated data governance
- Large annotation operations and production data platforms

</details>

## AS-5. Causal Reasoning and Online Experiments

**Why:** Prediction, association and intervention answer different questions. This stage establishes the minimum causal reasoning and experiment-integrity discipline needed to make deployment claims safely.

### Learn this much

- [ ] Potential outcomes and ATE, ATT and CATE estimands _(Required)_
- [ ] Consistency, exchangeability and overlap assumptions _(Required)_
- [ ] SUTVA, interference and treatment leakage _(Required)_
- [ ] Causal DAGs as assumption maps _(Required)_
- [ ] Confounders, colliders, mediators and post-treatment variables _(Required)_
- [ ] Identification and valid adjustment sets _(Required)_
- [ ] Prediction, association and intervention claims _(Required)_
- [ ] Randomization unit and analysis unit _(Required)_
- [ ] Blocking, stratification and variance reduction _(Required)_
- [ ] Cluster randomization and dependent outcomes _(Required)_
- [ ] Power, precision and smallest useful effect _(Required)_
- [ ] Assignment, exposure, outcome and exclusion logs _(Required)_
- [ ] Sample-ratio mismatch and experiment-integrity diagnosis _(Required)_
- [ ] Guardrails, staged ramp and rollback _(Required)_
- [ ] Novelty, seasonality and carryover effects _(Required)_
- [ ] Sequential monitoring without post hoc threshold changes _(Required)_
- [ ] Heterogeneous effects with predeclared slices _(Required)_
- [ ] Matching, weighting and regression adjustment boundaries _(Required)_
- [ ] Sensitivity to unmeasured confounding and alternative specifications _(Required)_
- [ ] Natural experiments and quasi-experimental designs _(Optional)_
- [ ] Longitudinal g-methods and time-varying confounding _(Depth)_
- [ ] Always-valid inference for continuous experimentation _(Later)_

### Resource route

- **Primary - Book:** [Causal Inference: What If](https://miguelhernan.org/whatifbook) - Read Chapters 1-3 for causal effects without models and Chapters 6-8 for causal diagrams, confounding, selection and identification. Reproduce one associated code example and label every assumption.
- **Required - Course:** [14.310x - Data Analysis for Social Scientists](https://ocw.mit.edu/courses/14-310x-data-analysis-for-social-scientists-spring-2023/pages/calendar/) - Revisit Weeks 7, 9 and 10 for randomized experiments, omitted-variable bias, endogeneity, instrumental variables and experimental design. Complete one design problem and one analysis problem.
- **Required - Guide:** [Patterns of Trustworthy Experimentation - Pre-Experiment](https://www.microsoft.com/en-us/research/group/experimentation-platform-exp/articles/patterns-of-trustworthy-experimentation-pre-experiment-stage/) - Use the pre-experiment checks to lock hypotheses, metrics, randomization, power, telemetry, guardrails and ramp criteria before outcomes are inspected.
- **Required - Guide:** [Patterns of Trustworthy Experimentation - During Experiment](https://www.microsoft.com/en-us/research/group/experimentation-platform-exp/articles/patterns-of-trustworthy-experimentation-during-experiment-stage/) - Use the during-experiment checks for assignment, exposure, data quality, novelty, guardrails and staged ramp. Keep integrity checks separate from effect estimation.
- **Required - Practice:** [Diagnosing Sample Ratio Mismatch in A/B Testing](https://www.microsoft.com/en-us/research/articles/diagnosing-sample-ratio-mismatch-in-a-b-testing/) - Implement an SRM check and a diagnosis tree. Seed one assignment or telemetry defect and resolve it before estimating the treatment effect.
- **Optional - Book:** [Causal Inference: The Mixtape](https://mixtape.scunning.com/) - Use selected chapters on DAGs, experiments and matching only if the What If presentation does not make the design boundary clear. It is an alternate explanation, not a second required spine.

### Exit checkpoint

Simulate confounding, collider adjustment, post-treatment selection and interference, then defend an online experiment plan with correct units, power or precision, telemetry, SRM checks, guardrails, ramp, stopping and rollback.

<details>
<summary>Deliberately left for later</summary>

- Longitudinal causal inference and mediation
- Semiparametric causal estimators
- Always-valid inference infrastructure for continuous experimentation

</details>

## AS-6. Reproduction, Ablation and Scaling

**Why:** Research claims often collapse under implementation differences, evaluator changes or unequal resources. This stage turns a paper claim into a tested mechanism with complete lineage, controlled ablations and explicit scale boundaries.

### Learn this much

- [ ] Claim decomposition into mechanism, assumptions and evidence _(Required)_
- [ ] Equation-to-code and claim-to-output traceability _(Required)_
- [ ] Environment, data, evaluator and protocol equivalence _(Required)_
- [ ] Predeclared reproduction tolerance and equivalence criteria _(Required)_
- [ ] Baseline fidelity and matched resource budgets _(Required)_
- [ ] Clean-room reproduction from documented artifacts _(Required)_
- [ ] Discrepancy log and unresolved-difference boundary _(Required)_
- [ ] All-run, all-seed and failed-run retention _(Required)_
- [ ] Mechanism invariants, parity tests and negative tests _(Required)_
- [ ] Scientific, nuisance and fixed experimental factors _(Required)_
- [ ] One-factor and small factorial ablation designs _(Required)_
- [ ] Interaction effects and non-additive ablations _(Required)_
- [ ] Minimum mechanism-isolating ablation matrix _(Required)_
- [ ] Negative controls and placebo interventions _(Required)_
- [ ] Compute, data, precision, hardware and system matching _(Required)_
- [ ] Scaling curves, resource normalization and uncertainty _(Required)_
- [ ] Interpolation, extrapolation and regime boundaries _(Required)_
- [ ] Robustness, out-of-distribution and stress tests _(Required)_
- [ ] Null, negative and contradictory evidence _(Required)_
- [ ] Immutable raw results, environment and analysis manifests _(Required)_
- [ ] Hyperparameter transfer across scale _(Optional)_
- [ ] Formal scaling-law estimation and uncertainty _(Depth)_
- [ ] Frontier-scale distributed replication _(Later)_

### Resource route

- **Primary - Guide:** [The Turing Way - Reproducible Research](https://book.the-turing-way.org/reproducible-research/overview/) - Read the overview, Version Control for Data, Testing, Reproducible Environments and Research Compendia. Build a clean reproduction bundle containing code, data, configuration, environment, hardware, raw outputs, failures and analysis version.
- **Required - Guide:** [Deep Learning Tuning Playbook - Experiment Design](https://github.com/google-research/tuning_playbook) - Use the sections on scientific, nuisance and fixed hyperparameters, designing studies, extracting insights, evaluation and experiment tracking. Turn each ablation into a stated question rather than a sweep.
- **Required - Checklist:** [NeurIPS Paper Checklist](https://neurips.cc/public/guides/PaperChecklist) - Audit experimental details, statistical claims, compute, data, code and reproducibility before accepting a reproduction. Link every answer to an artifact or a clearly stated limitation.
- **Support - Reference:** [PyTorch Reproducibility Notes](https://docs.pytorch.org/docs/2.14/notes/randomness.html) - For neural investigations, control documented randomness sources and deterministic settings, record device and version, and state where exact cross-platform reproducibility is unavailable.
- **Depth - Book:** [How to Scale Your Model](https://jax-ml.github.io/scaling-book/) - Use only the relevant sections on roofline analysis, sharding, transformer math, training, inference, JAX and GPUs. Apply them to resource matching and scale boundaries, not as another systems course.
- **Support - Project:** [Applied Science Investigation - Reproduction and Ablation](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-3/applied-science-investigation.md) - Use Milestones C through F, the correctness requirements and failure-injection list as the evidence contract for reproduction, ablations, robustness, lineage and independent regeneration.

### Exit checkpoint

Reproduce or rigorously bound one nontrivial claim, then run three mechanism-isolating ablations, one negative control and one robustness or scale-boundary test. Preserve every discrepancy, failed run and null result.

<details>
<summary>Deliberately left for later</summary>

- Frontier-scale distributed reproduction
- Formal scaling-law research beyond the selected claim
- Large combinatorial or automated ablation sweeps

</details>

## AS-7. Research Communication and Review

**Why:** A conclusion is only defensible when every claim can be traced to evidence and its strongest limitation is visible. This stage turns the investigation into an auditable report that can survive skeptical review.

### Learn this much

- [ ] Claim-evidence ledger with artifact links _(Required)_
- [ ] Observation, inference, decision and speculation as separate statements _(Required)_
- [ ] Prior-work and claim matrix _(Required)_
- [ ] Novelty and contribution boundary _(Required)_
- [ ] Paper and report structure as an evidence argument _(Required)_
- [ ] Methods section and locked experiment contract _(Required)_
- [ ] Results generated from immutable raw artifacts _(Required)_
- [ ] Figure and table units, denominators, sample counts and uncertainty _(Required)_
- [ ] Honest axes, scales, aggregation and comparison sets _(Required)_
- [ ] Ablation narrative tied to the mechanism hypothesis _(Required)_
- [ ] Limitations, negative evidence and unresolved discrepancies _(Required)_
- [ ] Artifact README, commands and environment reconstruction _(Required)_
- [ ] Report-to-code and figure-to-raw-output traceability _(Required)_
- [ ] Peer review across validity, baselines, statistics and overclaiming _(Required)_
- [ ] Review-response matrix with evidence and remaining risk _(Required)_
- [ ] Oral defense of assumptions, alternatives and strongest unsupported inference _(Required)_
- [ ] Independent clean reproduction of one primary result _(Required)_
- [ ] Next experiment selected by information gain _(Required)_
- [ ] Plain-language and stakeholder communication _(Optional)_
- [ ] Venue-specific positioning and rebuttal strategy _(Depth)_
- [ ] Publication formatting and submission operations _(Later)_

### Resource route

- **Primary - Checklist:** [NeurIPS Paper Checklist](https://neurips.cc/public/guides/PaperChecklist) - Use the checklist while planning and writing. Audit claims, limitations, assumptions, experimental details, statistics, compute, data, code, ethics and societal impact, with every answer linked to a report section or artifact.
- **Required - Guide:** [The Turing Way - Guide for Communication](https://book.the-turing-way.org/communication/communication/) - Read the communication overview, wider-audience principles and Research Objects. Produce a technical report, decision memo and plain-language summary that preserve the same claim boundary.
- **Required - Assessment:** [NeurIPS 2026 Reviewer Guidelines](https://neurips.cc/Conferences/2026/ReviewerGuidelines) - Structure an adversarial review around quality, clarity, significance and originality. Require three to five actionable objections that could change the conclusion, then answer them with evidence or explicit remaining risk.
- **Support - Guide:** [Journal or Conference Paper CommKit](https://mitcommlab.mit.edu/eecs/commkit/journal-or-conference-paper/) - Use the argument, audience, outline and section guidance to convert the evidence ledger into a readable technical paper. Check that each paragraph advances a claim or establishes its boundary.
- **Support - Guide:** [Results and Figure Design CommKits](https://mitcommlab.mit.edu/eecs/commkit/journal-article-results/) - Use the Results guidance and figure-design principles to choose comparisons, expose uncertainty and make every axis, unit, denominator and visual encoding interpretable without hidden context.
- **Support - Reference:** [Artifact Review and Badging](https://www.acm.org/publications/policies/artifact-review-and-badging-current) - Use the current availability, functionality, reproducibility and replicability criteria as an artifact audit. This is a quality target for the bundle, not a requirement to submit it.

### Exit checkpoint

Generate the report and every figure from immutable raw results, pass a skeptical review using a claim-evidence response matrix, and have a clean environment or independent person reproduce one primary result.

<details>
<summary>Deliberately left for later</summary>

- Venue-specific formatting and submission operations
- Rebuttal tactics beyond an evidence-based response
- Publication strategy and research branding

</details>

## AS-8. Original Research Judgment

**Why:** Research independence is the ability to choose a consequential bounded question, design the smallest decisive study, respond honestly to negative evidence and stop when the remaining claim is not supported.

### Learn this much

- [ ] New mechanism, measurement, analysis, negative result and useful combination as contribution types _(Required)_
- [ ] Problem selection from decision relevance and tractability _(Required)_
- [ ] Who acts differently under each possible outcome _(Required)_
- [ ] Prior work, closest claim and precise novelty boundary _(Required)_
- [ ] Hidden assumptions and strongest competing explanation _(Required)_
- [ ] Expected information gain of candidate experiments _(Required)_
- [ ] Feasibility, compute, data, time and skill budget _(Required)_
- [ ] Technical risk, ethics, misuse and societal-impact boundary _(Required)_
- [ ] Small portfolio of competing hypotheses _(Required)_
- [ ] Success, partial, null, contradiction and stop outcomes _(Required)_
- [ ] Minimum decisive experiment _(Required)_
- [ ] Simpler alternative designs and non-ML routes _(Required)_
- [ ] Independent implementation or material modification of the central mechanism _(Required)_
- [ ] Exploratory work separated from confirmatory claims _(Required)_
- [ ] External validity, regime boundary and unsupported transfer _(Required)_
- [ ] Extend, narrow, revise or stop after negative evidence _(Required)_
- [ ] Independent reproduction and adversarial review _(Required)_
- [ ] Strongest unsupported inference stated explicitly _(Required)_
- [ ] A coherent multi-project research portfolio _(Optional)_
- [ ] Formal replication track or publication route _(Depth)_
- [ ] Independent lab leadership and long-horizon agenda setting _(Later)_

### Resource route

- **Primary - Guide:** [The Turing Way - Project Design](https://book.the-turing-way.org/project-design/pd-overview/) - Use Overview, Getting Started with Project Design, the checklist and Reproducibility Methods to define the question, users, methods, resources, risks, governance, communication plan and success criteria before implementation.
- **Required - Assessment:** [The Heilmeier Catechism](https://www.darpa.mil/about/heilmeier-catechism) - Answer all eight questions for two candidate projects. Reject any proposal that cannot state current practice, novelty, value, risk, resource cost and concrete midterm and final examinations.
- **Required - Guide:** [Registered Reports](https://book.the-turing-way.org/communication/dif-articles/reg/) - Use the format to separate question quality from result direction. Write a short preregistration naming success, partial success, null, contradiction and stop outcomes before the decisive experiment.
- **Required - Assessment:** [NeurIPS Reviewer Criteria](https://neurips.cc/Conferences/2026/ReviewerGuidelines) - Score two candidate questions for quality, clarity, significance and originality, then audit limitations and unsupported claims. Treat a negative result or new measurement as valid only when the evidence changes understanding.
- **Required - Project:** [Applied Science Research Laboratory](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/capstones/applied-science-research-laboratory.md) - Use the complete capstone contract for the bounded original question, baseline reproduction, preregistered intervention, ablations, failures, independent reproduction, report, review response and oral defense.
- **Depth - Reference:** [MLRC 2026 - Reproducibility Track](https://blog.neurips.cc/2026/05/04/mlrc-2026-reproducibility-as-an-official-track-at-neurips/) - Read the official track announcement only after the local capstone passes. Use it to understand how a rigorous reproduction, replication or negative result can become a public research artifact.

### Exit checkpoint

Choose between two bounded questions, preregister the minimum decisive study for one, build or materially modify its central mechanism, and make an extend, narrow, revise or stop decision after independent reproduction and adversarial review.

<details>
<summary>Deliberately left for later</summary>

- Flagship publication as a completion requirement
- A multi-project research portfolio
- Independent lab leadership and long-horizon agenda setting

</details>

## Track milestone

### Applied Science Investigation

Choose one bounded consequential claim in a domain already covered by the core. Carry the same versioned investigation from formulation through reproduction, controlled experimentation, review and a final research decision.

- A research charter and clean baseline reproduction with versioned data, code, environment and evaluation manifests, leakage tests and a discrepancy log.
- A preregistered matched-budget study with naive and strong baselines, mechanism ablations, a negative control, correct uncertainty, shift and error analysis, and all-attempt retention.
- A generated technical report and decision memo with claim-to-artifact links, independent clean reproduction, a skeptical review response and the next smallest decisive experiment.

