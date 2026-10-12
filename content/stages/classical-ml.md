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

### Study units

#### U1. Unit of observation, prediction time and label horizon

**About 3 h** · **Target:** Explain

Topics: Unit of observation, population and prediction context; Prediction time, feature cutoff, action time and label horizon

Every later choice inherits the prediction context. A row is not a prediction; the contract that binds a row to a decision time is.

**You can now**

- State the unit of observation, the population, and the prediction context for a new problem in one short paragraph.
- Specify prediction time, feature cutoff, action time, label horizon, and label availability for an hourly bike-demand task.
- Explain why hour.csv and day.csv define different prediction contexts even though they describe the same system.

**Study**

1. [ML project checklist: framing and data capture](https://github.com/ageron/handson-mlp/blob/main/ml-project-checklist.md) (Hands-On Machine Learning - Chapters 1 and 2) - Frame the problem and look at the big picture, items 1 to 12; Get the data, items 1 to 11, including item 11 on sampling a test set aside and never looking at it. Depth: Read as a checklist, not a textbook. Skip the Launch section here; it returns in the lineage unit.
2. [Housing task statement as a prediction-context example](https://github.com/ageron/handson-mlp/blob/main/02_end_to_end_machine_learning_project.ipynb) (Hands-On Machine Learning - Chapters 1 and 2) - Chapter 2 notebook, Get the Data: the Housing Corp task statement, predicting median house values in Californian districts, where the unit of observation is one district.
3. [Instances, examples, and freshness requirements](https://developers.google.com/machine-learning/guides/rules-of-ml) (Rules of Machine Learning - first controls) - Terminology: Instance, Label, Feature, Feature Column, Example; Rule 8: Know the freshness requirements of your system, with the Play Search and Whats Hot staleness examples.
4. [Bike Sharing data dictionary and files](https://archive.ics.uci.edu/dataset/275/bike+sharing+dataset) (UCI Bike Sharing Dataset) - Variables Table and Additional Variable Information: instant, dteday, hr, casual, registered, cnt, including the note that hr is absent from day.csv; Dataset Files: hour.csv, day.csv, Readme.txt; Dataset Characteristics with the no-missing-values statement.

**Focus**

- The unit of observation is the row the decision attaches to: one district in housing, one system-hour in hour.csv, one system-day in day.csv. The two bike files are different populations of prediction contexts, not two views of one table.
- Prediction time fixes which fields may be used. Anything recorded after the cutoff is unavailable even when it sits in the same CSV row: the horizon outcome itself, and also the weather observed during the hour. At the top of the hour a live system has only a forecast, so using hour.csv weather is an oracle-forecast assumption the contract must declare.
- Freshness is part of the context. State how old a model or feature may be before quality loss forces action, using Rule 8: Play Search degrades in under a month without updates, while identifier-free Whats Hot models export infrequently.
- Checklist items 1 to 12 plus Get-the-data item 11 are the contract skeleton: objective, usage, current workaround, framing, measure, alignment, minimum performance, assumptions, and one untouched test set.

**Reproduce:** Closed-book, write the one-paragraph contract for hourly bike demand: unit (one system-hour), population (dated hours in hour.csv), prediction time (top of the hour, before that hour rentals are known), cutoff (fields timestamped at or before prediction time only), horizon (the coming hour cnt), and action (fleet rebalancing). State why day.csv needs a separate contract.

**Traps**

- Treating each CSV row as a prediction without naming the decision time. hour.csv and day.csv can describe the same period at different grains and need different horizons and actions.
- Reading dteday as a ready timestamp. In hour.csv it is a date string plus a separate hr column; the prediction instant is their combination, and parsing it is part of the contract.
- Quoting the landing page count as the file count. The page states 17389 instances while the downloadable hour.csv holds 17379 data rows by direct count; count the file you downloaded and record the date.

**Practice**

- The section mini-project covers this: a one-page prediction contract with unit, prediction time, cutoff, horizon, and an availability table for the Bike Sharing rebuild.

**Stop when:** You can write the hourly bike contract from memory, including why day.csv is excluded and which columns are unavailable at prediction time.

<details>
<summary>Self-test</summary>

1. In the Housing Corp task, what is the unit of observation?
   - One Californian district, which is one row of the housing data. The model predicts one median house value per district.
2. Why do hour.csv and day.csv need separate prediction contracts?
   - Different units (hour versus day), different horizons (next-hour versus next-day cnt), and different availability: hr exists only in hour.csv, and an hourly rebalancing action cannot wait for the day aggregate.
3. A bike feature table refreshes daily but predictions run hourly. What must the contract state?
   - The feature cutoff and the freshness requirement: hourly predictions reuse the last daily value, with a stated maximum age and a staleness check in the style of Rule 8.
4. Where does the label horizon sit relative to prediction time in the bike contract?
   - After it: cnt over the coming hour is realized after prediction time. The same-hour casual and registered counts are label parts, not features.

</details>

#### U2. Targets, losses, metrics, decision rules and problem framing

**About 3 h** · **Target:** Explain

Topics: Target, estimand, loss, metric and decision rule; Regression, classification, ranking and unsupervised framing; Prediction language versus causal language

The loss and the decision rule decide what the model learns to care about. A perfect score on the wrong target still ships the wrong behavior.

**You can now**

- Distinguish the scientific question, prediction target, estimand, action, outcome, loss, metric, and product decision on a worked example.
- Choose regression, classification, or an unsupervised framing from the decision thresholds, and defend a proxy label with its failure modes.
- State success metrics separately from evaluation metrics, and keep prediction language associative rather than causal.

**Study**

1. [Framing: outputs, thresholds, proxies, success metrics](https://developers.google.com/machine-learning/problem-framing/ml-framing) (Google ML Problem Framing - framing an ML problem) - Identify the output you need; Classification; Regression including the video-caching 50/30-view threshold analysis; Proxy labels including the usefulness proxy table; Define the success metrics including success versus evaluation metrics and the clickbait failure paragraph. Depth: Skip Generation. This section uses predictive ML only; generative outputs are out of scope.
2. [Objectives versus metrics](https://developers.google.com/machine-learning/guides/rules-of-ml) (Rules of Machine Learning - first controls) - Rule 2: First, design and implement metrics; Rule 12: Do not overthink which objective you choose to directly optimize; Rule 13: Choose a simple, observable and attributable metric for your first objective.
3. [Framing checklist and task types](https://github.com/ageron/handson-mlp/blob/main/ml-project-checklist.md) (Hands-On Machine Learning - Chapters 1 and 2) - Frame the problem, items 4 to 7: supervised/unsupervised and online/offline framing, performance measure, alignment with the business objective, minimum performance.
4. [Supervised and unsupervised task vocabulary](https://github.com/ageron/handson-mlp/blob/main/01_the_machine_learning_landscape.ipynb) (Hands-On Machine Learning - Chapters 1 and 2) - Exercise Solutions 4, 5, and 8: regression and classification as the two most common supervised tasks, clustering/visualization/dimensionality-reduction/association as unsupervised tasks, spam detection as supervised.

**Focus**

- Success metrics differ from evaluation metrics. Success is product behavior (feature opened 50 percent more; 20 percent more time on site); evaluation is model arithmetic (accuracy, RMSE, AUC). A better model score that does not move success is not progress.
- Fixed thresholds call for classification, moving thresholds for regression. For a video with 30 views, predictions 28 and 32 both miss by 2 and get the same loss (squared error 4), yet the 30-view cache cutoff sends them to different caches.
- Proxy labels substitute for unmeasurable goals (shared OR liked for usefulness). Each candidate in the table carries a stated failure mode: like-prediction misses users who never click like, popularity is not personalized, click prediction maximizes clickbait, watch time favors long videos.
- Prediction language stays associative: predicts, is associated with. Acting on a prediction can change the outcome, as the clickbait paragraph shows engagement dropping after click-optimized ranking, so causal verbs need an experiment, not a model score.

**Reproduce:** Closed-book, redo the video-caching arithmetic: truth 30 views with predictions 28 and 32 gives squared error 4 both ways but opposite cache decisions at the 30 boundary. Then state the classification alternative (no-cache, cheap-cache, expensive-cache labels) and when regression stays right (thresholds set and moving in app code).

**Traps**

- Calling the objective the metric. The Terminology section separates them: the objective is the one number the algorithm optimizes; metrics are every number you care about. Rule 12 notes they rise together early on, so a lone objective gain later is not proof of system health.
- Treating a proxy as the goal. Liking, sharing, clicking, and watch time each mismeasure usefulness in a different direction; the table assigns one failure mode per proxy.
- Writing causal conclusions from predictive wins. A higher click score does not show the ranking causes satisfaction; the clickbait paragraph shows behavior diverging after the intervention.

**Practice**

- [Google ML Problem Framing: Check Your Understanding boxes](https://developers.google.com/machine-learning/problem-framing/ml-framing) - Proxy labels Check Your Understanding (health-app proxy question) and Define the success metrics Check Your Understanding (fashion-firm ideal outcome versus model goal). Answer both cold, then map each wrong fashion option to the mismatched ideal outcome, goal, output, or metric.

**Stop when:** You answer both Check Your Understanding boxes cold and can redo the 28/32 threshold arithmetic without notes.

<details>
<summary>Self-test</summary>

1. Truth is 30 views; model A predicts 28 and model B predicts 32. Which has lower squared error, and which caches correctly at a 30-view cutoff?
   - Neither has lower error: both miss by 2, so both have squared error 4. B caches (32 clears 30) while A does not, so equal loss hides opposite decisions.
2. The team wants useful recommendations but logs only clicks. Name the proxy and two failure modes from the table.
   - Proxy: predict click or play. Failures: it maximizes clickbait, and popularity prediction is not personalized; like-prediction separately misses most users who never click like.
3. What distinguishes the ML objective from a success metric, per Rules 2, 12, 13 and the weather example?
   - The objective is the single directly optimized number, kept simple, observable, and attributable (for example clicked). Success is product behavior (feature opened 50 percent more); a strong objective score need not move it.
4. Why is the claim that the model proves longer videos are more useful a causal overclaim?
   - Watch-time prediction favors long videos by construction, per the proxy table. Usefulness needs an experiment or policy comparison; the prediction only associates length with watched time under current exposure.

</details>

#### U3. Split design, nested selection and test isolation

**About 4 h** · **Target:** Explain + Implement

Topics: Random, stratified, grouped and temporal splits; Nested selection and final test isolation

The split is the claim about the future. A convenient shuffle that mixes weeks or years with the test set measures memorization, not deployment.

**You can now**

- Explain random, stratified, grouped, temporal, and nested splits and the dependence structure each one protects.
- Derive a split and evaluation policy from the data-generating and deployment process rather than from dataset convenience.
- Build a deterministic grouped and temporal split with no entity or future overlap and evaluate a model on it exactly once.

**Study**

1. [Test-set construction: random, hashed, and stratified splits](https://github.com/ageron/handson-mlp/blob/main/02_end_to_end_machine_learning_project.ipynb) (Hands-On Machine Learning - Chapters 1 and 2) - Chapter 2 notebook, Create a Test Set: shuffle_and_split_data with seed 42, crc32 id-hash split with the longitude/latitude stable-id pattern, train_test_split with random_state 42, the 10.7 percent bad-sample binomial calculation with its simulation check, income_cat binning with pd.cut, StratifiedShuffleSplit, the single stratified train_test_split call, and the Overall/Stratified/Random proportion table. Depth: Use the housing income stratification as the method demo. Your graded split is the chronological Bike rebuild, not housing.
2. [Selection inside validation, test set touched once](https://github.com/ageron/handson-mlp/blob/main/02_end_to_end_machine_learning_project.ipynb) (Hands-On Machine Learning - Chapters 1 and 2) - Chapter 2 notebook, Grid Search and Randomized Search through Evaluate Your System on the Test Set: cross-validated search, best-model error analysis, final test RMSE with the scipy bootstrap 95 percent confidence interval; plus the Chapter 1 Exercise Solutions 16 to 19 on test, validation, and train-dev roles and why tuning on the test set overfits it. Depth: Read the selection-then-final-test order. Do not run the full search here.
3. [Group-aware, time-aware, and single train/test splits](https://scikit-learn.org/stable/modules/cross_validation.html) (scikit-learn - Cross-validation splitters) - 3.1.2.4 Cross-validation iterators for grouped data with 3.1.2.4.1 Group K-fold (groups [1, 1, 1, 2, 2, 2, 3, 3, 3, 3] giving test folds [6, 7, 8, 9], [3, 4, 5], [0, 1, 2]); 3.1.2.5 Using cross-validation iterators to split train and test (GroupShuffleSplit with random_state 7); 3.1.2.6 Cross validation of time series data with 3.1.2.6.1 Time Series Split (n_splits 3 on 6 samples); 3.1.3 A note on shuffling.

**Focus**

- Choose the splitter from the dependence structure. Stratify when a rare subgroup must survive (income_cat); group when rows share an entity (GroupKFold holds each of groups 1, 2, 3 out in turn); go temporal when deployment runs forward in time (TimeSeriesSplit trains [0, 1, 2] tests [3], then expands).
- Stratification needs discrete labels, so regression targets get binned first: pd.cut on median_income into 5 cats, stratify, then drop the bin column before training. The Overall/Stratified/Random proportion table is the oracle.
- Selection lives inside validation and the test set is touched once. The HOML order is cross-validated search, error analysis, then one final test RMSE with a bootstrap interval; the checklist rule is never tweak after measuring generalization error.
- A random split of bike hours leaks the future: neighboring hours share weather and demand. The honest deployment proxy is the chronological cut at 2012-01-01, giving 8645 train rows and 8734 test rows.

**Reproduce:** Closed-book, write the GroupKFold folds for 10 samples with groups [1, 1, 1, 2, 2, 2, 3, 3, 3, 3] (test folds [6, 7, 8, 9], [3, 4, 5], [0, 1, 2]) and the TimeSeriesSplit(n_splits=3) folds on 6 samples (train [0, 1, 2] test [3], then [0, 1, 2, 3] test [4], then [0, 1, 2, 3, 4] test [5]). Then state the bike chronological counts: 8645 train rows before 2012-01-01 and 8734 test rows from that date.

**Traps**

- Shuffling time-ordered rows before splitting. Section 3.1.3 warns that shuffling news-like data overfits near-time similarity; bike hours need the chronological cut, not a shuffle.
- Stratifying on the raw regression target. stratify needs classes, so bin first with income_cat and drop the bin column before training, exactly as the notebook cells do.
- Reusing the test set for selection and reporting it as generalization. Every peek costs the guarantee; fix split identities from the start and let lineage make that mechanical.

**Practice**

- The section mini-project covers this: the chronological Bike split (2011 train, 2012 test) with assertions that no future timestamp and no prohibited group cross the boundary.

**Stop when:** You derive both fold plans from memory and your Bike split script asserts zero future-timestamp and zero group overlap across the boundary.

<details>
<summary>Self-test</summary>

1. Housing data holds few high-income districts. Why does the notebook bin median_income before splitting?
   - train_test_split stratify needs discrete labels, so pd.cut makes 5 income cats and the rare high-income slice keeps its proportion in train and test, verified by the proportion table.
2. What is the 10.7 percent number in Create a Test Set?
   - The binomial probability that a random 1000-person sample at a 51.6 percent female ratio lands below 49 or above 54 percent female. It motivates stratification and is matched by simulation at about 0.108.
3. Bike rows from the same week share weather. Which split answers generalization to next year?
   - The temporal split: train on 2011, test on 2012. Random KFold would place adjacent hours on both sides; GroupKFold by week answers generalization to new weeks instead, which is a different question.
4. Grid search has picked hyperparameters on validation folds. What may you now do with the test set?
   - Evaluate once for the generalization estimate, with an interval. Do not select, tune, or compare on it afterward, or the estimate turns optimistic.

</details>

#### U4. Leakage: target, future, entity, duplicate, preprocessing and feedback

**About 4 h** · **Target:** Explain + Measure

Topics: Target, future, entity, duplicate and preprocessing leakage; Label delay, selection bias and feedback leakage

Leakage is the usual cause of scores that are too good to deploy. Each kind has a different audit, so taxonomy first, then tests.

**You can now**

- Explain target leakage, future leakage, entity overlap, duplicate contamination, preprocessing leakage, label delay, and feedback leakage.
- Diagnose an unexpectedly high score by auditing duplicate entities, time, preprocessing, label construction, selection, and metric code.
- Quantify the effect of repairing one leakage defect while keeping the model and evaluation fixed.

**Study**

1. [Leakage definition, repairs, and the SelectKBest demo](https://scikit-learn.org/stable/common_pitfalls.html) (scikit-learn - Common pitfalls and pipelines) - 12.2 Data leakage with the never-call-fit-on-test rule; 12.2.1 How to avoid data leakage (split first, fit on train, transform both); 12.2.2 Data leakage during pre-processing with the SelectKBest wrong run at 0.76 versus the right run at 0.50 on random labels and the pipeline cross-validation at 0.43 +/- 0.05.
2. [Target construction in the Bike dictionary](https://archive.ics.uci.edu/dataset/275/bike+sharing+dataset) (UCI Bike Sharing Dataset) - Additional Variable Information: casual, registered, and cnt definitions, with cnt the count of total rentals including both casual and registered. Depth: Read the definitions, then verify the identity on the file yourself: casual plus registered equals cnt on every hour.csv row (verified max difference 0 on 17379 rows).
3. [Freshness, export checks, and monitoring](https://developers.google.com/machine-learning/guides/rules-of-ml) (Rules of Machine Learning - first controls) - Rule 8: Know the freshness requirements of your system; Rule 9: Detect problems before exporting models, including the held-out AUC sanity check.
4. [Sampling discipline and production monitoring](https://github.com/ageron/handson-mlp/blob/main/ml-project-checklist.md) (Hands-On Machine Learning - Chapters 1 and 2) - Get the data, item 11 (test set aside, no snooping); Launch: monitoring code, slow degradation and rot, input-quality checks, retraining on fresh data, and the human pipeline for labels.

**Focus**

- Leakage is any use of information unavailable at prediction time (section 12.2). The repair never varies: split first, fit on train only, transform both, preferably inside a Pipeline.
- The SelectKBest demo quantifies it. Selecting on all of 200 by 10000 random features then splitting scores 0.76 against chance near 0.50; selecting on train only scores 0.50 with pipeline cross-validation at 0.43 +/- 0.05. Distance above chance on random labels is the alarm.
- Bike cnt is defined as casual plus registered on every row, so both are target parts, never features. A linear model on the two scores RMSE 0.0 with coefficients [1, 1] and intercept 0; the label-free 12-feature linear baseline on the same chronological split scores 192.3.
- Delay, selection, and feedback are leakage over time and policy: late labels need freshness limits and a human labeling pipeline, selected training rows need the sampling discipline of unit 3, and predictions that reshape future labels need input monitoring and pre-export checks. Production feedback control stays excluded per leaveForLater.

**Reproduce:** Closed-book, re-run the SelectKBest pair (wrong 0.76, right 0.50 on random labels) and the bike identity check (casual plus registered equals cnt on all 17379 rows, leaking linear model RMSE 0.0 with coefficients [1, 1]). State both repairs: fit selectors and scalers on train only inside a Pipeline, and drop casual and registered from cnt features.

**Traps**

- Judging leakage by metric movement alone. Fitting the bike weather scaler on all rows versus train only gives RMSE 200.95 both ways with LinearRegression, because least-squares predictions are unchanged by any per-column rescaling; even Ridge and 10-nearest-neighbors move by under 0.05. The procedure is still broken. Test the procedure, not just the score.
- Calling deduplication a leakage fix by itself. Removing exact duplicates without fixing split ownership still lets entity twins straddle train and test; assert group and entity disjointness after dedup, per unit 3.
- Treating feedback as a modeling bug. When serving decisions select tomorrow labels, no refit breaks the loop; the contract must log exposure and keep an unaffected holdout slice, which the mini-project records as a monitoring exclusion.

**Practice**

- The section mini-project covers this: seeded global-scaling, target-derived-feature, and partition-duplicate defects, each caught by a failing test with the conclusion change reported after repair.

**Stop when:** You reproduce both number pairs (0.76/0.50 and 0.0/192.3) and can name the repair for each of the six leakage kinds without notes.

<details>
<summary>Self-test</summary>

1. SelectKBest on all 200 by 10000 random features then split scores 0.76. Why is that proof of leakage rather than signal?
   - X and y are independent by construction, so chance sits near 0.50: the clean run scores 0.50 and pipeline cross-validation gives 0.43 +/- 0.05. Only the selector seeing test labels explains 0.76.
2. Predicting bike cnt from casual and registered gives RMSE 0.0. Good model?
   - No. cnt is defined as their sum on every row, so the model recites label construction with coefficients [1, 1]. Drop both; the label-free 12-feature linear baseline scores 192.3.
3. Scaling bike weather on all rows versus train only leaves a LinearRegression RMSE at 200.95 both ways. Leak or not?
   - Still a leak in procedure: test rows moved the temp mean from 0.4891 to 0.4970. The score cannot move here, because least-squares predictions are unchanged by any per-column rescaling, so this model is blind to the defect. Repair it anyway; with other models and splits the same habit costs more, as 0.76 versus 0.50 shows.
4. Labels arrive two weeks late and serving prioritizes flagged users. Name the two risks and one guard each.
   - Label delay: evaluation lags reality, so set freshness limits and a human labeling pipeline (checklist Launch, Rule 8). Selection and feedback: training overrepresents flagged users and predictions reshape future labels, so log exposure, keep an unaffected holdout slice, and gate exports with Rule 9 checks.
5. Copying 500 test rows into bike train moves a weather-only decision tree from RMSE 219.4 to 214.1. Small move, so harmless?
   - No. On the 500 copied rows the error falls from 215.3 to 113.7, while the other 8234 test rows barely move (219.6 to 218.7). The copies are under 6 percent of the test set, so the average hides them. Ban cross-partition duplicates with ownership assertions, and score contaminated rows separately when you audit.

</details>

#### U5. Schema, provenance, missingness, duplicate and availability audits

**About 3 h** · **Target:** Implement + Measure

Topics: Schema, types, provenance, missingness and duplicate audits; Categorical unknowns, class prevalence and feature availability

Audits turn data hunches into checked facts. Every leakage repair in this section starts as one failing audit.

**You can now**

- Write tests for schema, duplicates, target-derived features, future timestamps, preprocessing scope, and train/evaluation contamination.
- Measure missingness, duplicate rates, unknown-category rates, and class prevalence per slice, and record per-feature availability at prediction time.
- Preserve a raw snapshot with its data dictionary and provenance before any cleaning.

**Study**

1. [Data inspection and correlation audit pattern](https://github.com/ageron/handson-mlp/blob/main/02_end_to_end_machine_learning_project.ipynb) (Hands-On Machine Learning - Chapters 1 and 2) - Chapter 2 notebook, Take a Quick Look at the Data Structure (head, info, ocean_proximity value_counts, describe, hist) and Looking for Correlations (corr matrix sorted on median_house_value, scatter_matrix, median_income scatter) with Experimenting with Attribute Combinations (rooms_per_house, bedrooms_ratio, people_per_house).
2. [Missing-value audit and the Explore checklist](https://github.com/ageron/handson-mlp/blob/main/02_end_to_end_machine_learning_project.ipynb) (Hands-On Machine Learning - Chapters 1 and 2) - Chapter 2 notebook, Data Cleaning: null-row audit with isnull().any(axis=1), the three options (dropna subset, drop column, median fillna), SimpleImputer on the numeric subset with statistics_ checked against manual medians; plus the checklist Explore the data steps (name, type, percent missing, noise, usefulness, distribution per attribute, target identification, documentation). Depth: Read the audit pattern here. The graded audit runs on Bike, not housing.
3. [Bike dictionary and normalization provenance](https://archive.ics.uci.edu/dataset/275/bike+sharing+dataset) (UCI Bike Sharing Dataset) - Variables Table roles, types, and descriptions; Additional Variable Information normalizations (temp and atemp min/max formulas on the hourly scale, hum divided by 100, windspeed divided by 67); Dataset Information no-missing-values statement; Dataset Files sizes (hour.csv 1.1MB, day.csv 56.2KB, Readme.txt).
4. [Freshness and export checks as availability audits](https://developers.google.com/machine-learning/guides/rules-of-ml) (Rules of Machine Learning - first controls) - Rule 8: Know the freshness requirements of your system; Rule 9: Detect problems before exporting models.

**Focus**

- Audit in fixed order: shape and dtypes first (dteday loads as a string, not a datetime), then missingness (the page reports none and a direct count finds 0 nulls in 17379 hour rows), then keys and duplicates (instant unique, zero duplicated full rows), then time continuity (75 rows do not follow the previous clock hour, so the previous row and the previous hour differ), then ranges, normalizations, prevalence and availability.
- The checklist Explore list is the procedure: name, type, percent missing, noise, usefulness, and distribution per attribute, plus target identification and a sorted correlation pass. Document everything in the notebook.
- Unknowns and prevalence are decided before fitting. In the housing notebook, get_dummies builds whatever columns each frame holds, while the encoder fitted on the training set keeps its five categories; the test value <2H OCEAN, a misspelling of <1H OCEAN, is the unseen one. Bike weathersit takes all four values 1 to 4, but category 4 appears on only 3 of 17379 rows, so a split can easily miss it.
- A column present in the CSV may still be unavailable live. casual and registered are label parts, instant is a row id, and dteday must be parsed into cutoff-respecting parts. Record per-feature availability beside the audit.

**Reproduce:** Closed-book, run the Bike audit from memory: shape (17379, 17), zero nulls, instant unique, zero duplicated rows, dteday string-to-datetime parse, weathersit/holiday/season value sets, the cnt identity check, and the file-versus-page count note (17379 rows against 17389 stated). Emit a one-table dictionary with role, type, and availability per column.

**Traps**

- Trusting info and describe alone. describe skips strings (ocean_proximity needs value_counts) and hides the dteday-as-string problem; check dtypes explicitly.
- Reading normalized columns as raw units. temp 0.24 is not 0.24 C; invert (t-tmin)/(tmax-tmin) with the stated hourly minima and maxima (about 3.3 C for 0.24) before any physical claim.
- Counting the landing page as the audit. The page states 17389 instances with no missing values; verify both against the download (17379 rows, 0 nulls) and record version and date.

**Practice**

- The section mini-project covers this: the full Bike audit suite (schema, types, provenance, missingness, duplicates, unknowns, prevalence, availability) with seeded defects that failing tests must catch.

**Stop when:** Your audit script runs on a fresh download and reproduces the shape, null, duplicate, and identity numbers plus a per-column availability column without edits.

<details>
<summary>Self-test</summary>

1. The imputed housing frame shows no nulls. How do you verify the imputer learned the right values?
   - Compare imputer.statistics_ against the train numeric medians; they must match for the median strategy, and the imputer must be fit on train numerics only.
2. temp reads 0.24 in hour.csv. What is it in Celsius?
   - About 3.3 C: 0.24 times (39 minus -8) plus -8 equals 3.28. Quote the hourly-scale bounds (-8/+39) with the number.
3. get_dummies gives INLAND and NEAR BAY columns on one frame and <2H OCEAN and ISLAND columns on another. What breaks, and what does the notebook's fitted encoder do instead?
   - get_dummies builds columns from whatever values each frame holds, so two (2, 2) frames have disjoint names and misalign. The encoder fitted on the training set keeps its five learned columns; with handle_unknown=ignore the unseen <2H OCEAN becomes an all-zero row, while ISLAND, a known category, gets its own column.
4. Which bike columns are unavailable as hourly-cnt features, and why?
   - casual and registered (label parts: their sum equals cnt on every row), instant (row id), and raw dteday (needs parsing into cutoff-respecting parts); any same-hour aggregate realized after prediction time is out too.

</details>

#### U6. Training-only imputation, scaling, encoding and learned state

**About 3 h** · **Target:** Implement

Topics: Training-only imputation, scaling, encoding and learned state

Preprocessing is where most silent leakage lives. One fitted pipeline object removes the whole class of fit-on-everything bugs.

**You can now**

- Identify which preprocessing statistics may be fit on which partition, and prove point-in-time availability for each feature.
- Build a leakage-safe numeric and categorical pipeline with fitted state, unknown-category behavior, schema tests, and serialization.
- Explain why preprocessing must live inside the split procedure rather than before it.

**Study**

1. [Inconsistent preprocessing and the Pipeline fix](https://scikit-learn.org/stable/common_pitfalls.html) (scikit-learn - Common pitfalls and pipelines) - 12.1 Inconsistent preprocessing with the untransformed-test MSE of 62.80 versus 0.90 after transforming, and the make_pipeline fix; 12.2.1 How to avoid data leakage (split first, fit and fit_transform on train only, transform on both).
2. [Pipeline and ColumnTransformer reference](https://scikit-learn.org/stable/modules/compose.html) (scikit-learn - Common pitfalls and pipelines) - 8.1.1 Pipeline: chaining estimators (convenience, joint parameter selection, safety: same samples train transformers and predictors) with 8.1.1.1 Usage (build, access steps, nested parameters); 8.1.4 ColumnTransformer for heterogeneous data (why preprocess inside scikit-learn: no test statistics in the preprocessors, and preprocessing parameters in the search; per-column transforms; remainder handling).
3. [Numeric and categorical pipelines in the housing notebook](https://github.com/ageron/handson-mlp/blob/main/02_end_to_end_machine_learning_project.ipynb) (Hands-On Machine Learning - Chapters 1 and 2) - Chapter 2 notebook, Transformation Pipelines (num_pipeline with SimpleImputer median plus StandardScaler, ColumnTransformer with num and cat pipelines, make_column_selector variant, get_feature_names_out); Handling Text and Categorical Attributes (OrdinalEncoder versus OneHotEncoder, sparse_output flag, get_dummies mismatch, handle_unknown ignore mapping the unseen <2H OCEAN to an all-zero row); Feature Scaling (MinMaxScaler, StandardScaler).
4. [Custom transformer exercise with an estimator oracle](https://github.com/ageron/handson-mlp/blob/main/02_end_to_end_machine_learning_project.ipynb) (Hands-On Machine Learning - Chapters 1 and 2) - Chapter 2 notebook, Exercise 6: StandardScalerClone from scratch with inverse_transform and feature-name support, checked by check_estimator plus the allclose assertions (centered, uncentered with_mean False, round trip) and feature-name assertions.

**Focus**

- Fit learns state from train only: imputer statistics_, scaler mean_ and scale_, encoder categories_. Transform applies it everywhere. Section 12.1 prices forgetting the second half: test MSE 62.80 versus 0.90.
- Pipelines make the order mechanical: impute, then scale, then encode inside one object fitted once on train, with nested-parameter access for later tuning and ColumnTransformer routing per dtype.
- Unknown categories are a serving fact, not an exception. Default OneHotEncoder raises a ValueError on an unseen value such as <2H OCEAN; handle_unknown=ignore emits an all-zero row, and get_feature_names_out carries the schema into the model.
- Custom transformers must honor the estimator contract: explicit __init__ parameters, fit accepting y, learned state in trailing-underscore attributes, feature names tracked. check_estimator is the conformance oracle.

**Reproduce:** Closed-book, write a ColumnTransformer pipeline (median-impute plus standardize numerics, most-frequent-impute plus one-hot-ignore-unknowns for categoricals), fit on train only, and state the two oracle numbers from the pitfalls synthetic set: test MSE 62.80 untransformed versus 0.90 transformed.

**Traps**

- Calling fit_transform on the full frame before splitting. The convenience call is the classic leak; split first, then fit_transform on train and transform on test.
- Assuming get_dummies generalizes. It silently builds disjoint columns on new categories; only a fitted encoder with a declared unknown policy survives serving.
- Forgetting the sparse default. OneHotEncoder returns sparse output by default (sparse_output True in 1.9); downstream code expecting dense breaks or densifies huge matrices, so declare the flag explicitly.

**Practice**

- [Hands-On ML Chapter 2, Exercise 6: StandardScalerClone](https://github.com/ageron/handson-mlp/blob/main/02_end_to_end_machine_learning_project.ipynb) - Exercise 6 under Exercise solutions: reimplement StandardScalerClone with inverse_transform and feature-name support; oracles are check_estimator plus the four allclose and name assertions. Implement from a blank file in your own repository, then wrap it in a ColumnTransformer and confirm get_feature_names_out flows through.

**Stop when:** check_estimator passes on your transformer and your pipeline reproduces the 62.80 and 0.90 pair, plus all-zero rows for unknown categories.

<details>
<summary>Self-test</summary>

1. Why does the wrong 12.1 run give test MSE 62.80 while the right one gives 0.90?
   - The model trains on scaled features but predicts on unscaled test rows, so it sees a different feature space. Transforming test with the same fitted scaler, or using a Pipeline, restores 0.90.
2. Where must SimpleImputer with median strategy be fit, and how do you check it?
   - On train numerics only. Check imputer.statistics_ against the train column medians, then transform train and test with the same object.
3. The notebook's test frame holds <2H OCEAN, a misspelling of <1H OCEAN. What does handle_unknown=ignore emit, and what does it hide?
   - An all-zero row: none of the known categories. Serving survives, but a data-entry error passes silently, so count unknowns per batch and alert when the rate rises.
4. Your custom transformer takes *args for flexibility. What breaks?
   - Grid search and cloning: scikit-learn requires explicit __init__ parameters for get_params and set_params, so check_estimator fails.

</details>

#### U7. Baselines: constant, frequency, heuristic, last-value and simple learned

**About 3 h** · **Target:** Implement + Measure

Topics: Constant, frequency, heuristic, last-value and simple learned baselines

Baselines decide whether complexity earns its place. Without the naive rungs, every learned score looks like progress.

**You can now**

- Implement at least two naive or heuristic baselines and one simple learned baseline under one fixed evaluation harness.
- Compare baseline performance across relevant slices and state whether model complexity is justified.
- Explain why trivial, heuristic, last-value, frequency, and simple statistical baselines are necessary controls.

**Study**

1. [Heuristics, simple first models, and baseline behavior](https://developers.google.com/machine-learning/guides/rules-of-ml) (Rules of Machine Learning - first controls) - Rule 1: launch without machine learning (a heuristic covers about half the imagined gain); Rule 3: choose machine learning over a complex heuristic; Rule 4: keep the first model simple and get the infrastructure right, with baseline metrics and neutral first launch; Rule 7: turn heuristics into features. Depth: Treat Rule 1 fractions as planning lore, not measured constants. Your ladder numbers replace them.
2. [Train, cross-validate, and compare pattern](https://github.com/ageron/handson-mlp/blob/main/02_end_to_end_machine_learning_project.ipynb) (Hands-On Machine Learning - Chapters 1 and 2) - Chapter 2 notebook, Training and Evaluating on the Training Set (linear predictions versus actuals, train RMSE) and Better Evaluation Using Cross-Validation (cross_val_score with neg_root_mean_squared_error and cv 10 for tree, linear, and forest comparisons, plus the train-versus-validation overfit reading).
3. [Ladder dataset with the target prohibition](https://archive.ics.uci.edu/dataset/275/bike+sharing+dataset) (UCI Bike Sharing Dataset) - hour.csv as the ladder dataset with the chronological 2011/2012 split; Additional Variable Information for the casual/registered prohibition on cnt prediction.

**Focus**

- Order the ladder by information, not cleverness: train-mean constant (RMSE 227.8), train-median (243.8), train-last constant (291.8), previous-hour (121.6), and a linear model on 12 calendar and same-hour weather fields (192.3). All numbers are RMSE on the 2012 test rows with scikit-learn 1.9.1. The weather fields assume a perfect forecast, and yr is 0 on every training row, so its coefficient is 0 and the linear model cannot see the 2012 growth.
- Previous-hour beats the learned linear model (121.6 versus 192.3) because demand is strongly autocorrelated. That is the finding, not a failure: complexity must clear the naive temporal rung. Here previous-hour means the previous row; 75 rows follow a gap in the hours, so state the rule.
- The leaking rung (linear on casual plus registered: RMSE 0.0, coefficients [1, 1], intercept 0) is the control proving the harness catches label construction. Keep it in the report as the excluded row.
- Rule 4 sets the attitude: a neutral first launch that prioritizes infrastructure and baseline behavior over fancy models. Rule 7 says what to do with a good heuristic next: keep its raw value as a feature.

**Reproduce:** Closed-book, rebuild the ladder on the chronological Bike split and quote the numbers within a few RMSE points: mean 227.8, median 243.8, train-last 291.8, previous-hour 121.6, label-free linear 192.3, and the leaking rung at 0.0 with coefficients [1, 1]. State which rung a new model must beat and why.

**Traps**

- Comparing models across different splits or metrics. One fixed harness (same rows, same RMSE, same prohibition) or the comparison is void; retune nothing between rungs.
- Dropping the naive temporal baseline because it feels dumb. Previous-hour at 121.6 is the strongest rung; without it a model at 150 looks like real progress over the mean (227.8) while it still loses to the previous hour.
- Keeping the leaking features to see how well we could do. RMSE 0.0 measures label arithmetic, not demand; the only correct action is exclusion plus a regression test.

**Practice**

- The section mini-project covers this: the full baseline ladder under one fixed harness with the verdict on whether complexity is justified.

**Stop when:** Your ladder script prints all six RMSE numbers matching the card within a few points, and your report states the complexity verdict against prev-hour.

<details>
<summary>Self-test</summary>

1. A new gradient booster scores 180 on the test split. Is the complexity justified?
   - Not yet. It beats the linear rung (192.3) but loses to previous-hour (121.6) by about 58. Give it the lagged count as an input and compare again; report both gaps, not just the win.
2. Why is the train median (243.8) worse than the train mean (227.8) here?
   - Demand grew: the 2012 test mean is 234.7, against 143.8 in 2011. The best constant for RMSE on test is the test mean (208.9), and both train constants sit below it, the median of 109 furthest. The mean is also the squared-error minimizer on train; the median minimizes absolute error.
3. What does the leak rung coefficient vector prove?
   - That cnt is exactly casual plus registered (coefficients [1, 1], intercept 0, RMSE 0.0): the features are the label addends, so the rung is excluded and fenced by test.
4. Rule 1 suggests heuristics reach half the ML gain, yet prev-hour beats linear regression. Contradiction?
   - No. Rule 1 is planning lore and the heuristic here exploits time structure the linear rung lacks. Measured rungs override the adage.

</details>

#### U8. Snapshots, lineage, pipeline serialization and serving parity

**About 3 h** · **Target:** Implement

Topics: Immutable snapshots, split identities, seeds and raw-prediction lineage; Pipeline serialization and training-serving feature parity

Reproducibility is what makes every earlier claim checkable. Without snapshots and parity tests, fixes cannot be told apart from noise.

**You can now**

- Serialize a fitted pipeline and prove reload parity with identical predictions in a fresh process.
- Trace a train/serve feature mismatch to its data contract and add a prevention test.
- Record immutable snapshots, split identities, seeds, and raw-prediction lineage for a full run.

**Study**

1. [Stable split identities and joblib persistence](https://github.com/ageron/handson-mlp/blob/main/02_end_to_end_machine_learning_project.ipynb) (Hands-On Machine Learning - Chapters 1 and 2) - Chapter 2 notebook, Create a Test Set (crc32 id-hash split, longitude/latitude stable-id pattern, random_state 42) and Model persistence using joblib (dump the final model, reload it, predict on new data, with the pickle-versus-joblib note).
2. [Pipeline structure for serialization](https://scikit-learn.org/stable/modules/compose.html) (scikit-learn - Common pitfalls and pipelines) - 8.1.1 Pipeline: chaining estimators (one object holding transformers plus estimator, with named steps access) through 8.1.1.1 Usage.
3. [Infrastructure tests, freshness, and export gates](https://developers.google.com/machine-learning/guides/rules-of-ml) (Rules of Machine Learning - first controls) - Rule 5: Test the infrastructure independently from the machine learning (same score in training and serving, fixed model at serving); Rule 8: freshness requirements; Rule 9: pre-export held-out checks.
4. [Raw files and dictionary to snapshot](https://archive.ics.uci.edu/dataset/275/bike+sharing+dataset) (UCI Bike Sharing Dataset) - Dataset Files (hour.csv, day.csv, Readme.txt) with sizes; Variables Table and Additional Variable Information as the dictionary to store beside the raw snapshot.

**Focus**

- Lineage is mechanical: a raw snapshot (file, hash, row count, download date) with the data dictionary, immutable split identities (the chronological cut at 2012-01-01 reproduces 8645 and 8734 rows and needs no seed), and per-row raw predictions joined back to instant.
- Serialize the fitted pipeline, not the recipe: joblib dump of the exact object with its learned state, reloaded in a fresh process. Verified probe: StandardScaler plus LinearRegression on temp/atemp/hum/windspeed predicts [101.7, 99.1, 72.7, 58.1, 52.2] on the first five 2012 test rows identically before and after the round trip (scikit-learn 1.9.1).
- Parity is Rule 5: the served model must score identically on the same rows as training. Test the feature path with a fixed model before trusting any learner change, and gate exports with Rule 9 checks.
- Seeds are recorded, not tuned: one integer seed threaded through every random split, resample and estimator, stored with the snapshot. Re-runs must reproduce split counts and probe predictions exactly.

**Reproduce:** Closed-book, write the lineage record for the Bike run (source URL, file hash, hour.csv row count 17379, the split rule that sends dates from 2012-01-01 to test, seeds for any random step, pipeline steps with scikit-learn 1.9.1) and run the joblib round trip asserting the identical five-row probe predictions.

**Traps**

- Dumping the recipe instead of the fitted object. Unfitted parameters reload but learned state (means, categories, coefficients) is gone; dump the fitted pipeline and verify with predictions, not file existence.
- Reimplementing transforms at serving time. A second implementation of scaling or encoding drifts silently; serve through the same serialized pipeline object and prove it with the Rule 5 same-score test.
- Mutable snapshots. A dataset page or file can change between downloads, and the page already disagrees with its own file (17389 instances stated, 17379 rows). Keep the stored snapshot with its hash, never re-derive lineage from a fresh download, and version any refresh separately.

**Practice**

- [Hands-On ML Chapter 2: model persistence with joblib](https://github.com/ageron/handson-mlp/blob/main/02_end_to_end_machine_learning_project.ipynb) - Model persistence using joblib: dump the final model, reload it in a fresh session, and predict on new rows. Do it on your Bike pipeline: assert identical predictions on five held-out rows and record the scikit-learn and Python versions with the artifact.

**Stop when:** A fresh process reloads your artifact, reproduces the five-row probe exactly, and your lineage record pins source, rows, split rule, seed, and library versions.

<details>
<summary>Self-test</summary>

1. Why must split identities be stable rather than reshuffled each run?
   - Otherwise test rows migrate into train across runs, voiding every earlier metric and leakage guarantee. A recorded date rule, or recorded ids plus seed for a random split, reproduces the same rows exactly.
2. joblib reload predicts identically on the probe rows. What does that prove, and what does it not prove?
   - It proves serialization fidelity: same object, same features, same result. It does not prove serving parity: live feature values, types, and missingness can still differ, which needs the separate Rule 5 test.
3. The pipeline is reimplemented at serving for speed. What is the first test to demand?
   - The Rule 5 same-score test: fixed model, same rows, train path versus serve path must agree exactly before any learner comparison.
4. A teammate refreshes hour.csv and the row count changes. What breaks, and what is the repair?
   - Every lineage claim (splits, metrics, predictions) loses its referent. Restore work to the stored snapshot and record the refresh as a separate versioned snapshot, never an in-place overwrite.

</details>

### Mini-project: Bike demand contract, split, audits and baseline ladder

**About 10 to 14 hours.** Rebuild the hourly UCI Bike Sharing demand problem in your own repository as a contract-first investigation: a one-page prediction contract, an immutable snapshot with a chronological split, an audit suite, a baseline ladder under one harness, and three seeded leakage defects that failing tests must catch. No model tuning happens until the contract and ladder are frozen.

1. Write the contract for next-hour cnt: unit, prediction time, cutoff, horizon, the action it serves, the cost of over- and under-prediction, and an availability table that marks every hour.csv column available, forecast-only or prohibited. Declare same-hour weather as an oracle-forecast assumption, and prohibit casual and registered, which sum to cnt. If the action changes later demand (rebalancing moves bikes to where riders find them), record the feedback loop as a monitoring exclusion: log exposure and keep an unaffected holdout slice.
2. Store hour.csv with its hash, row count (17379) and download date. Build the chronological split, 2011 to train and 2012 to test (8645 and 8734 rows), with assertions that no test timestamp precedes the last train timestamp and that no prohibited column reaches the feature list.
3. Write the audit suite: schema and dtypes (dteday loads as a string), missingness, keys and duplicates, time continuity (75 rows do not follow the previous clock hour), ranges and normalizations, rare categories (weathersit 4 on 3 rows) and availability. Seed one defect per audit in a copy and show each test fails.
4. Build the baseline ladder in one harness, scored by RMSE on the 2012 rows: train mean, train median, train-last constant, previous row and a label-free linear model on the 12 calendar and same-hour weather fields. Reference values with scikit-learn 1.9.1: 227.8, 243.8, 291.8, 121.6 and 192.3. State the rung a new model must beat and why.
5. Seed three leakage defects: global scaling before the split, the target-derived casual and registered features, and cross-partition duplicates (copy 500 test rows into train). Catch each with a failing test, report the score before and after repair, and score the contaminated rows separately.
6. Wrap preprocessing in a ColumnTransformer pipeline fitted on train only, write the lineage record (source URL, hash, split rule, seeds, library versions), and run a joblib round trip that asserts identical predictions on five probe rows.

**Deliverables**

- contract.md with the availability table, the declared assumptions, the cost statement and the feedback note.
- The data package: snapshot manifest, split builder and audit suite with its seeded-defect tests.
- The ladder report: one table of rungs with RMSE and the verdict on whether complexity is justified.
- The leakage casebook: three defects, each with its failing test, its repair and the conclusion it changed.

**Checks**

- rubric: Self-grade with the rubric below.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Contract | Every column is classified with a reason, and prediction time, cutoff and horizon are stated. | The oracle-forecast assumption is priced: the linear rung is rerun without same-hour weather and the change is reported. |
| Split and audits | The split reproduces 8645 and 8734 rows, and every audit fails on its seeded defect. | One command runs all audits, and a property test shows the split builder never places a test row before a train row. |
| Baseline ladder | All five rungs land within a few RMSE points of the reference under one harness. | The report explains why the previous row wins, and why the median loses to the mean (the 2012 test mean is 234.7 against 143.8 in 2011). |
| Leakage | Three defects are each caught by a failing test, with scores before and after repair. | The casebook shows a defect the score cannot reveal (scaler leakage leaves a least-squares RMSE unchanged) and one that only the separately scored rows expose. |
| Lineage | The lineage record is complete and the joblib round trip passes. | A fresh clone rebuilds every reported number with one command. |

Feeds into: Milestone artifact 1, the contract and leakage pack: the contract, manifest, split builder, audits, the naive baselines and the preserved leakage failure come from here.

### Resource route

- **Primary - Course:** [Hands-On Machine Learning - Chapters 1 and 2](https://github.com/ageron/handson-mlp) - Use notebooks 01 and 02 plus ml-project-checklist.md for framing, data inspection, test-set creation, preprocessing pipelines, cross-validation, error analysis and persistence. Rebuild the workflow on UCI Bike Sharing with a chronological split and prohibit casual and registered when predicting cnt.
- **Required - Reference:** [scikit-learn - Common pitfalls and pipelines](https://scikit-learn.org/stable/common_pitfalls.html) - Read Common Pitfalls sections on inconsistent preprocessing and leakage, then Pipeline and ColumnTransformer. Seed global scaling, a target-derived feature and a partition duplicate, and make tests reject each defect.
- **Support - Reference:** [scikit-learn - Cross-validation splitters](https://scikit-learn.org/stable/modules/cross_validation.html) - Use the group-aware and time-aware splitter sections plus GroupKFold and TimeSeriesSplit. Choose from the dependence structure and assert that no prohibited group or future timestamp crosses the boundary.
- **Support - Application:** [Rules of Machine Learning - first controls](https://developers.google.com/machine-learning/guides/rules-of-ml) - Read Rules 1-5 and 8-9. Turn the existing heuristic into a baseline and test the feature path independently of the learner.
- **Support - Practice:** [UCI Bike Sharing Dataset](https://archive.ics.uci.edu/dataset/275/bike+sharing+dataset) - Use hour.csv as the compact integrated dataset. Preserve a raw snapshot and data dictionary, split chronologically, and document why casual and registered are target proxies for cnt.
- **Support - Application:** [Google ML Problem Framing - framing an ML problem](https://developers.google.com/machine-learning/problem-framing/ml-framing) - Read Identify the output you need through Proxy labels and Define the success metrics, including the video-caching threshold analysis, the proxy-issue table, and both Check Your Understanding boxes.

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

### Study units

#### U1. Least squares: residuals, normal equations and stable solvers

**About 4 h** · **Target:** Derive + Implement

Topics: Linear regression, residuals and squared versus absolute loss; Normal equations, stable solvers and gradient descent

Least squares is the baseline every later model is compared against. Its two failure modes, singular designs and outlier sensitivity, recur in every fitting method after it.

**You can now**

- Derive the normal equations from the squared-error objective and state when the solution is unique.
- Implement least squares three ways (normal equations, SVD least squares, minibatch gradient descent) with a gradient check, and match them on well-conditioned data.
- Explain why squared loss punishes large residuals quadratically and when that sensitivity becomes a liability.

**Study**

1. [Linear regression: model, squared loss, analytic solution and minibatch SGD](https://d2l.ai/chapter_linear-regression/linear-regression.html) (Dive into Deep Learning - linear models slice) - Sections 3.1.1.1 to 3.1.1.4 (model, squared-error loss with the 1/2 factor, analytic solution, minibatch SGD update) and 3.1.3 (Gaussian noise makes squared loss maximum likelihood).
2. [Linear regression from scratch](https://d2l.ai/chapter_linear-regression/linear-regression-scratch.html) (Dive into Deep Learning - linear models slice) - Sections 3.4: Defining the Model, Defining the Loss Function, Defining the Optimization Algorithm, Training. Depth: D2L shows framework tabs only; there is no plain NumPy tab. Implement in NumPy first, as the section use note asks, and read the PyTorch tab only as a differential reference.
3. [Simple and multiple linear regression](https://hastie.su.domains/ISLP/ISLP_website.pdf.download.html) (An Introduction to Statistical Learning with Python) - Chapter 3, Sections 3.1 to 3.2 (pp. 70-90): the RSS objective, least squares coefficient estimates and the multiple-regression setup.
4. [Linear regression lab](https://github.com/intro-stat-learning/ISLP_labs/blob/main/Ch03-linreg-lab.ipynb) (An Introduction to Statistical Learning with Python) - Simple Linear Regression and Multiple Linear Regression sections on the Boston data: fit with statsmodels OLS and read coefficients, standard errors and R-squared.
5. [Ordinary least squares semantics and solver](https://scikit-learn.org/stable/modules/linear_model.html) (scikit-learn - linear models, discriminant analysis and naive Bayes) - Section 1.1.1 including 1.1.1.2: LinearRegression minimizes the residual sum of squares, stores coef_ and intercept_, and solves through the SVD of X at O(n p^2) cost.
6. [Normal equation and batch gradient descent](https://github.com/ageron/handson-mlp/blob/main/04_training_linear_models.ipynb) (Hands-On Machine Learning - classification and linear models) - The Normal Equation section (theta_best with the explicit inverse, then the np.linalg.lstsq and pseudoinverse cross-checks) and Gradient Descent (the batch loop: gradient 2/m X_b'(X_b theta - y), eta 0.1, 1000 epochs from a random start).

**Focus**

- D2L scales its per-example loss by 1/2 while HoML differentiates the plain mean of squares with a 2/m gradient. The minimizer is identical but the largest stable learning rate differs by that constant.
- X'Xw = X'y has a unique solution only when X has full column rank. With duplicate or nearly collinear columns the fitted values stay well determined but the coefficients do not: in the 1e-4 demo below both solvers return slopes near 229 and -228, and only their sum, 1.012, is pinned by the data.
- The course notebooks show inv(X'X)@X'y to teach the formula; sklearn never forms that inverse and solves through the SVD instead.

**Reproduce:** From ||y - Xw||^2, derive X'Xw = X'y on paper. Then build the near-collinear demo in NumPy: default_rng(1), n = 200, x1 standard normal, x2 = x1 + 1e-4 times standard normal noise, an intercept column, y = 3 + 2 x1 - x2 + 0.1 noise, drawn in that order. Show cond(X) = 2.08e4 and cond(X'X) = 4.34e8, its square. The explicit inverse and lstsq agree to about 1e-5, but both return about [3.002, 229.2, -228.2], not [3, 2, -1]. Then rebuild with default_rng(0), n = 60, x2 = x1 + 1e-8 noise and y = 3 + 2 x1 + 0.5 noise: cond(X) = 1.8e8 and cond(X'X) = 3.25e15, and the explicit inverse stops at residual norm 3.8314 while lstsq reaches the minimum, 3.7978.

**Traps**

- Shipping inv(X'X)@X'y as the solver. Forming X'X squares the condition number, so a design with cond(X) near 1e8 makes X'X numerically singular near 1/eps in float64 while lstsq still minimizes the residual.
- Hand-rolling a bias column while the differential test keeps fit_intercept=True. sklearn centers the columns, so your ones column becomes all zeros: it gets coefficient 0 and intercept_ takes the offset. Predictions agree but a coefficient-by-coefficient comparison fails. Drop the column or pass fit_intercept=False.
- Reading the second Deep-ML 15 test as the exact solution. It expects [2.9699, 2.0078], the gradient-descent iterate after 1000 steps at lr 0.05; the exact minimizer is [3, 2]. Zero initialization and the exact update decide it.

**Practice**

- [Deep-ML 15: Linear Regression Using Gradient Descent](https://www.deep-ml.com/problems/15) - Gradient descent on the 1/(2m) mean squared error from zero initialization. Test 1 expects [1, 2]; test 2 pins the 1000-step iterate [2.9699, 2.0078] at lr 0.05 rather than the exact [3, 2]. Pass both tests, then show your lstsq solution agrees with test 1 and explain why it cannot match test 2 exactly.
- [NeetCode ML: Linear Regression Forward and Linear Regression Training](https://neetcode.io/practice/machine-learning) - Math Foundations pair: implement the forward pass, then full training cold. After the section gate, compare the learned weights against your lstsq fit on the same data before moving on.

**Stop when:** Your normal-equation and lstsq fits agree to 1e-8 on well-conditioned data, minibatch SGD with a decaying step lands within 1e-3 of them (a constant step leaves it rattling about 1e-2 away), a float64 gradient check passes, and you can say for each Deep-ML 15 test whether it pins the optimum or the optimization path.

<details>
<summary>Self-test</summary>

1. D2L multiplies its loss by 1/2 and HoML does not. Why is the minimizer unchanged but the stable learning rate different?
   - The constant scales the loss and every gradient without moving the stationary point, so the optimum is identical. A fixed step size moves half as far per step under the 1/2 convention, so its stability limit on eta is twice as large.
2. Two columns of X are identical. What happens to X'X, the coefficients and the predictions?
   - X'X is singular so the coefficients are not unique. The fitted values Xw stay unique as the projection onto the column space, and SVD-based solvers return the minimum-norm coefficient vector.
3. cond(X) is 2.08e4. What is cond(X'X), and at what point does the explicit inverse break down?
   - About 4.34e8, the square of cond(X). The explicit inverse loses all precision once cond(X'X) approaches 1/eps, about 4.5e15 in float64, which needs only cond(X) near 7e7. At 1.8e8 it no longer reaches the least-squares minimum.
4. One label is corrupted upward by 100. Why does the squared-loss fit move far, and which single change to the loss limits the damage?
   - The quadratic penalty lets that one residual dominate the objective. An absolute-error loss grows only linearly with it, so the fit moves far less.

</details>

#### U2. Conditioning, basis expansions, ridge, lasso and elastic net

**About 5 h** · **Target:** Derive + Measure

Topics: Conditioning, feature scale and coefficient instability; Polynomial and interaction bases; Ridge, lasso and elastic net regularization

An unpenalized fit trusts every column equally, so one rescaled feature or one duplicated signal can swing the coefficients wildly. Bases and penalties decide what the model may express before more data can save it.

**You can now**

- Derive the ridge closed form and predict how standardization changes the penalized solution.
- Contrast L1 and L2 penalties on correlated features: selection and sparsity versus shrinkage and stability.
- Measure coefficient paths and validation error across the penalty strength on fixed splits and select it from evidence.

**Study**

1. [Polynomial fitting and model complexity](https://d2l.ai/chapter_linear-regression/generalization.html) (Dive into Deep Learning - linear models slice) - Section 3.6.1.1 Model Complexity, then 3.6.2.1 Polynomial Curve Fitting (with distinct x values, a polynomial whose degree equals the number of examples fits the training set exactly) and Fig. 3.6.1, the underfitting-overfitting curve.
2. [Weight decay and the high-dimensional demo](https://d2l.ai/chapter_linear-regression/weight-decay.html) (Dive into Deep Learning - linear models slice) - Section 3.7: Norms and Weight Decay, then High-Dimensional Linear Regression with d = 200 features on 20 training examples at noise std 0.01.
3. [Polynomial and interaction bases, then ridge, lasso and tuning](https://hastie.su.domains/ISLP/ISLP_website.pdf.download.html) (An Introduction to Statistical Learning with Python) - Chapter 3, Section 3.3.2 (pp. 94-99) for polynomial and interaction extensions; Chapter 6, Sections 6.2.1 to 6.2.3 (pp. 240-252) for ridge, the lasso and tuning-parameter selection.
4. [Regularization lab on the Hitters data](https://github.com/intro-stat-learning/ISLP_labs/blob/main/Ch06-varselect-lab.ipynb) (An Introduction to Statistical Learning with Python) - Ridge Regression and the Lasso sections: solution paths on Hitters Salary with 5-fold cross-validation of the tuning parameter.
5. [Ridge, lasso, elastic net and polynomial objectives](https://scikit-learn.org/stable/modules/linear_model.html) (scikit-learn - linear models, discriminant analysis and naive Bayes) - Sections 1.1.2 (Ridge minimizes RSS plus alpha times squared norm), 1.1.3 (Lasso minimizes 1/(2n) RSS plus alpha times L1 norm, coordinate descent), 1.1.5 (Elastic-Net objective and the correlated-features guidance) and 1.1.16 (PolynomialFeatures basis expansion).
6. [Polynomial regression and regularized linear models](https://github.com/ageron/handson-mlp/blob/main/04_training_linear_models.ipynb) (Hands-On Machine Learning - classification and linear models) - Polynomial Regression, Ridge Regression, Lasso Regression, Elastic Net and Early Stopping sections, including the scale-and-regularization warning in the chapter Q and A.

**Focus**

- Ridge adds alpha ||w||^2 to the raw RSS, while Lasso and ElasticNet add their alpha penalty to RSS/(2n), so alpha = 1 means very different strengths. Compare paths or CV errors, never raw alphas.
- Penalties tax raw coefficient size. A feature with small numeric values, such as kilometers instead of meters, needs a larger weight for the same effect, so it pays more penalty and is shrunk harder. Standardize before penalizing and leave the intercept free.
- Lasso lands on corners: the sklearn guide says it is likely to pick one of several correlated features at random, while elastic net is likely to keep both. D2L's d = 200, n = 20 demo shows weight decay rescuing a fit with more features than samples.

**Reproduce:** Derive w = (X'X + alpha I)^{-1} X'y for centered data. Build the correlated demo: default_rng(2), n = 100, x1 and x2 standard normal, x3 = x1 + 0.1 noise, y = 2 x1 - 3 x2 + standard normal noise, drawn in that order. Show Ridge(alpha=1.0) matches the centered closed form to 1e-14 at [1.33909931, -3.06183881, 0.64520852]. Then show Lasso returns all zeros once alpha reaches max|Xc'yc|/n = 2.74, the x2 entry; just below it only x2 enters (-0.146 at alpha = 2.6). Ridge at any finite alpha keeps every coefficient nonzero here.

**Traps**

- Judging Ridge(alpha=1) against Lasso(alpha=1) as a fair fight. The objectives normalize the loss differently, so match effective shrinkage or validation error instead.
- Fitting the scaler on all the data, or penalizing the intercept. Fit standardization on train only and keep the offset out of the penalty.
- Reading lasso zeros as proof the dropped features carry no signal. Across resamples a correlated rival is selected instead, so report selection stability rather than one mask.

**Practice**

- [D2L 3.7 Exercise 1: lambda sweep on the high-dimensional demo](https://d2l.ai/chapter_linear-regression/weight-decay.html) - Exercises, problem 1: vary lambda and plot training and validation error; then problem 3 for the L1 update equations. Keep the d = 200, n = 20 demo fixed, record where validation error bottoms out, and state the update change the L1 penalty forces.
- [ISLP Lab 6.5.2: Ridge Regression and the Lasso](https://github.com/intro-stat-learning/ISLP_labs/blob/main/Ch06-varselect-lab.ipynb) - Ridge Regression and the Lasso sections on the Hitters Salary data with 5-fold CV selection of the tuning parameter. Compare the selected strengths and explain any disagreement on which coefficients survive.

**Stop when:** Your ridge closed form matches sklearn to 1e-12, your lambda sweep shows validation error falling then rising, and you can explain any lasso-versus-ridge selection disagreement on correlated features.

<details>
<summary>Self-test</summary>

1. Ridge(alpha=1) and Lasso(alpha=1) disagree sharply on standardized data. Is one implementation wrong?
   - No. Ridge adds alpha ||w||^2 to the raw RSS, while Lasso adds alpha ||w||_1 to RSS/(2n), so the same number applies very different pressure. Sweep a path for each and compare by validation error.
2. D2L 3.7 fits d = 200 features on 20 examples. Why does plain least squares break, and what does the L2 term change algebraically?
   - With 200 features and 20 rows, X'X has rank at most 20, so infinitely many weight vectors fit training exactly. Adding alpha I makes X'X + alpha I invertible, so the solution is unique, and it trades some training fit for a smaller norm; as alpha goes to 0 it tends to the minimum-norm interpolant.
3. Two features correlate at 0.999. Lasso keeps one with a large weight while ridge keeps both, shrunken. Why?
   - When x1 and x2 are nearly equal, the loss depends almost only on w1 + w2. For a fixed sum with both weights positive, the L1 norm is the same for every split, so the lasso is nearly indifferent and small differences in the data tip it to a corner with one weight at zero. The L2 norm is smallest at an equal split, so ridge shares the weight.
4. With 10 distinct x values, a degree-9 polynomial fits the training data exactly. Is it the best model?
   - No. Zero training error does not imply low validation error: the exact fit can swing wildly between and beyond the points. That gap is what the underfitting-overfitting curve diagnoses.

</details>

#### U3. Logistic regression and stable binary cross-entropy

**About 4 h** · **Target:** Derive + Implement

Topics: Logistic regression, odds, sigmoid and log likelihood; Stable binary cross-entropy with logits

Logistic regression turns a linear score into a probability claim, and its likelihood is the template for every neural classifier loss later. Getting the stable form right here prevents silent infinities everywhere after.

**You can now**

- Derive the binary log likelihood, its prediction-error-times-input gradient, and the L2-penalized objective from a Gaussian prior.
- Implement binary cross-entropy on logits that stays finite for extreme scores, with a gradient check.
- Explain why there is no closed form, why concavity still guarantees a global optimum, and what C controls in sklearn.

**Study**

1. [Logistic regression: likelihood, gradient and regularization](https://www.cs.cmu.edu/~tom/mlbook/NBayesLogReg.pdf) (Tom Mitchell - Generative and Discriminative Classifiers: Naive Bayes and Logistic Regression) - Sections 3.2 (conditional log likelihood with the gradient-ascent update from zero weights at eta 0.01) and 3.3 (L2-penalized log likelihood, Gaussian-prior MAP reading, penalized gradient rule 26). Depth: Read the likelihood and gradient derivations fully. Section 3.1 writes P(Y = 1|X) = 1/(1 + exp(w0 + sum wi Xi)), the opposite sign convention, and 3.2 flips Y in (24)-(25) to the usual form, so check signs when you compare. Skim 3.1; its Gaussian-to-sigmoid bridge returns in the LDA unit.
2. [The logistic model and maximum likelihood](https://hastie.su.domains/ISLP/ISLP_website.pdf.download.html) (An Introduction to Statistical Learning with Python) - Chapter 4, Sections 4.3.1 to 4.3.3 (pp. 139-141): the logistic model, likelihood (4.5) preferred over nonlinear least squares, and the Default-data arithmetic (balance $2,000 gives 58.6%).
3. [Maximum likelihood and gradient-based fitting](https://d2l.ai/chapter_appendix-mathematics-for-deep-learning/maximum-likelihood.html) (Dive into Deep Learning - linear models slice) - Section 22.7: The Maximum Likelihood Principle, then Numerical Optimization and the Negative Log-Likelihood with its set-up, initialize, descend and check-output worked example.
4. [Binary logistic loss, C semantics and solvers](https://scikit-learn.org/stable/modules/linear_model.html) (scikit-learn - linear models, discriminant analysis and naive Bayes) - Section 1.1.11 with 1.1.11.1 (expit form, averaged binary cross-entropy plus r(w)/(S C); C = inf means no penalty) and 1.1.11.3 (solver-versus-penalty table; lbfgs is the default).
5. [Estimating probabilities and decision boundaries](https://github.com/ageron/handson-mlp/blob/main/04_training_linear_models.ipynb) (Hands-On Machine Learning - classification and linear models) - Estimating Probabilities (iris virginica detector on petal width) and Decision Boundaries (boundary contour with C = 2).

**Focus**

- The gradient is prediction error times input, summed over rows. Mitchell ascends the summed log likelihood from zero weights; sklearn minimizes averaged cross-entropy plus an L2 term (C = 1.0 by default) with lbfgs. Their optima agree only when the penalties match, for example C = np.inf against Mitchell's unpenalized rule.
- sklearn regularizes by default at C = 1.0 on an averaged loss, so its C is not a textbook lambda: smaller C means stronger penalty, and C = inf recovers the unpenalized fit.
- Never exponentiate before logging. In float64 the sigmoid rounds to exactly 1.0 once z passes about 36.7, but to exactly 0 only below about -709.8, so the naive loss for y = 0 is already inf at z = 37, and at z = 36 it returns 36.044 instead of 36.0. The form max(z,0) - z y + log1p(exp(-|z|)) stays exact.

**Reproduce:** Derive the (p - y) x gradient from the binary log likelihood. In float64 show the naive loss returns inf for (z = -800, y = 1) and already for (z = 40, y = 0), while max(z,0) - z y + log1p(exp(-|z|)) returns 800.0 and 40.0. Match your analytic gradient to central differences to 1e-8 on a 3-point demo.

**Traps**

- Equating sklearn C with a textbook lambda. C is inverse strength on an averaged loss, so doubling C halves the penalty; sample and class weights rescale the effective C through the total weight S.
- Trusting probabilities from a near-unpenalized fit on nearly separable data. The likelihood keeps rewarding larger weights, so scores saturate toward exactly 0 and 1 without becoming more accurate.
- Starting gradient ascent from large random weights for symmetry breaking. The objective is concave with one global optimum and Mitchell starts at zero; large starts only waste steps or overflow the first sigmoid.

**Practice**

- [Deep-ML 106: Train Logistic Regression with Gradient Descent](https://www.deep-ml.com/problems/106) - Gradient descent on binary cross-entropy returning coefficients plus 10 per-iteration losses rounded to 4 decimals. Both tests open at 6.9315 = 10 ln 2: the reference prepends a bias column, starts from zero weights, sums (not averages) loss and gradient over the 10 rows, and records the loss before each update. Implement the stable logit form; the naive probability form risks inf on confident rows.
- [NeetCode ML: Sigmoid and ReLU plus Cross-Entropy Loss](https://neetcode.io/practice/machine-learning) - Math Foundations pair: activation values first, then the loss that consumes them. After the section gate, solve cold after Deep-ML 106 and state the input range where each saturates.

**Stop when:** Your logit loss matches central differences, stays finite on the (-800, 1), (40, 0) and (800, 0) probes, and your Deep-ML 106 losses open at 6.9315 and track the reference through all 10 iterations.

<details>
<summary>Self-test</summary>

1. Why does logistic regression need iterative fitting when linear regression has a closed form?
   - The sigmoid makes the log likelihood nonlinear in w with no analytic maximizer. The objective is concave, so gradient ascent still reaches the one global optimum.
2. sklearn at default C = 1.0 disagrees with your zero-penalty NumPy fit. Which one is right?
   - Both solve their stated objectives: sklearn minimizes averaged cross-entropy plus an L2 term at C = 1.0. Set C to inf or a very large value to recover the unpenalized fit.
3. Training loss prints inf on the first epoch for a positive example with logit near -800. What happened, and what is the fix?
   - The sigmoid underflowed to exactly 0 and log(0) is inf. A negative example fails much sooner: at logit 37 the sigmoid rounds to exactly 1 and log(1 - 1) is inf. Score in logits with max(z,0) - z y + log1p(exp(-|z|)) instead of exponentiating first.
4. Recompute ISLP's 58.6% default risk for balance $2,000 from Table 4.1.
   - z = -10.6513 + 0.0055 x 2000 = 0.3487; 1/(1 + exp(-0.3487)) = 0.586. A one-unit balance rise adds 0.0055 to the log odds.

</details>

#### U4. Softmax regression and one-versus-rest

**About 3 h** · **Target:** Derive + Implement

Topics: Softmax regression and multiclass cross-entropy; One-versus-rest classification

Most real decisions choose among more than two outcomes. Softmax generalizes the sigmoid without breaking probability semantics, and one-versus-rest is the fallback every library reaches for when a solver only does binary.

**You can now**

- Derive the softmax from K linear scores, its cross-entropy loss, and the prediction-error-times-input gradient.
- Implement max-subtracted softmax and multiclass cross-entropy that stay finite on extreme logits.
- Contrast joint multinomial fitting with one-versus-rest on parameter counts, calibration and solver limits.

**Study**

1. [Softmax, vectorization caution and cross-entropy loss](https://d2l.ai/chapter_linear-classification/softmax-regression.html) (Dive into Deep Learning - linear models slice) - Section 4.1: The Softmax (ordering preservation, argmax needs no exponentials), Vectorization (row-wise softmax with the overflow-underflow caution), Loss Function with Log-Likelihood and Softmax and Cross-Entropy Loss.
2. [Softmax from scratch, including the instability warning](https://d2l.ai/chapter_linear-classification/softmax-regression-scratch.html) (Dive into Deep Learning - linear models slice) - Section 4.4: The Softmax (naive implementation with the do-not-use-verbatim caution), The Model, The Cross-Entropy Loss, Training, Prediction. Depth: Read the naive softmax as the failure demo. Use the framework softmax with built-in protections for every real fit.
3. [Multinomial logistic regression](https://hastie.su.domains/ISLP/ISLP_website.pdf.download.html) (An Introduction to Statistical Learning with Python) - Chapter 4, Section 4.3.5 (p. 144): the K-class extension (4.13) with log odds linear in x (4.14).
4. [Multiclass logistic form and gradient](https://www.cs.cmu.edu/~tom/mlbook/NBayesLogReg.pdf) (Tom Mitchell - Generative and Discriminative Classifiers: Naive Bayes and Logistic Regression) - Section 3.4 (K - 1 linear functions in equations 27-28, regularized gradient rule 29).
5. [Multinomial geometry, OvR solvers and calibration](https://scikit-learn.org/stable/modules/linear_model.html) (scikit-learn - linear models, discriminant analysis and naive Bayes) - Section 1.1.11.2 (deliberate K-vector overparameterization, non-unique unpenalized solutions) and 1.1.11.3 with its solver table and Solvers' details (liblinear cannot fit a multinomial model, so multiclass use wraps it in OneVsRestClassifier; the multinomial loss is expected to calibrate better than one-versus-rest).
6. [One-versus-rest in practice](https://github.com/ageron/handson-mlp/blob/main/03_classification.ipynb) (Hands-On Machine Learning - classification and linear models) - Multiclass Classification section: the SVC OvO-training note, OneVsRestClassifier with its 10 estimators, and the SGDClassifier multiclass run.

**Focus**

- Softmax preserves order, so argmax needs no exponentials. Probabilities still need the max-subtracted form, because exp(1000) overflows to inf and inf divided by inf is nan.
- sklearn fits K vectors for K classes on purpose, for symmetry under regularization. Without penalty that redundancy makes the solution non-unique, which is one more reason the default L2 matters.
- One-versus-rest trains K binary problems and compares uncalibrated margins, while multinomial optimizes one joint loss. Expect worse-calibrated probabilities from the OvR scheme.

**Reproduce:** Derive the (p_k - y_k) x gradient from the multiclass negative log likelihood. In NumPy show naive softmax of [1000, 1001, 999] returns [nan, nan, nan] while the max-subtracted form returns [0.2447, 0.6652, 0.0900]. Then do the D2L 4.4 exercise in float32, the dtype of D2L's PyTorch code: naive softmax of [-110, -111] returns [nan, nan] because both exponentials underflow to 0, and [-100, -101] gives 0.7297 instead of 0.7311 from subnormal rounding. In float64 both inputs still work; the cliff sits near -745.

**Traps**

- Copying the D2L 4.4 teaching softmax into real code. The page itself warns against verbatim use; framework implementations subtract the row maximum internally.
- Calling OvR margins probabilities. One-versus-rest decision_function scores are not calibrated across the K classifiers; take predict_proba from a joint fit or calibrate afterwards.
- Passing multi_class to LogisticRegression under sklearn 1.9. The parameter is gone and raises TypeError. Multiclass fits are multinomial under the default lbfgs, liblinear raises a ValueError on three or more classes, and one-versus-rest now means wrapping the estimator in OneVsRestClassifier.

**Practice**

- [D2L 4.4 Exercises: the sub-minus-100 softmax fix](https://d2l.ai/chapter_linear-classification/softmax-regression-scratch.html) - Exercise 1: test softmax with an input of 100, then with the largest input below -100, then implement the fix relative to the largest entry. Write the max-subtracted version from a blank file, run both tests in float32 and float64, and match it against the framework softmax on random and extreme logits.
- [HoML 04 Exercise 12: batch gradient descent with early stopping for softmax regression](https://github.com/ageron/handson-mlp/blob/main/04_training_linear_models.ipynb) - Exercise solutions, problem 12: NumPy-only batch gradient descent with early stopping on iris. Reuse your stable loss and stop on validation error, not training error.

**Stop when:** Your max-subtracted softmax matches the framework on random and extreme logits, your multiclass gradient passes a numeric check, and you can state when OvR is forced and what it costs.

<details>
<summary>Self-test</summary>

1. Why can argmax skip the softmax entirely?
   - Softmax is monotone in each logit and preserves their order, so the largest logit is always the most probable class. Computing probabilities still needs the stable form.
2. sklearn fits 3 vectors for 3 classes while Mitchell fits K - 1 = 2 linear functions. Is one of them wrong?
   - No. K vectors deliberately overparameterize for symmetry under regularization, while K - 1 suffices because probabilities sum to one. Without penalty the K-vector solution is not unique.
3. Naive softmax of [1000, 1001, 999] returns nan. Show the exact failure and the fix.
   - Each exponential overflows to inf and inf/inf is nan. Subtract the row maximum first: exp([-1, 0, -2]) over its sum gives [0.2447, 0.6652, 0.0900] with the same argmax.
4. liblinear is your only allowed solver on a 5-class problem. Which scheme, and what do you lose?
   - One-versus-rest: wrap it in OneVsRestClassifier, which fits 5 binary estimators, because in sklearn 1.9 liblinear raises a ValueError on three or more classes. You lose the joint multinomial objective and should expect worse-calibrated probabilities.

</details>

#### U5. Residual, leverage, separation and misspecification diagnostics

**About 3 h** · **Target:** Measure

Topics: Residual, leverage, separation and misspecification diagnostics

A fit that converges is not a fit that is right. Diagnostics separate a broken model from a broken assumption, and separation is the one failure that looks like perfect success.

**You can now**

- Read residual-versus-fitted plots to separate nonlinearity, heteroscedasticity and outliers, and name the repair each prescribes.
- Compute leverages from the hat matrix, flag high-leverage points, and distinguish leverage from influence.
- Detect complete separation in logistic fits from runaway coefficients and saturated probabilities, and repair it with an explicit penalty.

**Study**

1. [Potential problems in the regression model](https://hastie.su.domains/ISLP/ISLP_website.pdf.download.html) (An Introduction to Statistical Learning with Python) - Chapter 3, Section 3.3.3 (pp. 100-108): nonlinearity, correlation of error terms, heteroscedasticity, outliers, high-leverage points and collinearity with the variance inflation factor.
2. [Separation instability of logistic estimates](https://hastie.su.domains/ISLP/ISLP_website.pdf.download.html) (An Introduction to Statistical Learning with Python) - Chapter 4, Section 4.4 opening (p. 146): logistic parameter estimates turn surprisingly unstable under substantial class separation, which motivates the generative alternatives.
3. [Penalty strength as the separation lever](https://scikit-learn.org/stable/modules/linear_model.html) (scikit-learn - linear models, discriminant analysis and naive Bayes) - Section 1.1.11 Binary Case: the penalty enters as r(w)/(S C), so relaxing C toward inf recovers the unpenalized fit whose weights are unbounded under separation.
4. [Learning curves for bias-variance diagnosis](https://github.com/ageron/handson-mlp/blob/main/04_training_linear_models.ipynb) (Hands-On Machine Learning - classification and linear models) - Learning Curves section: sklearn learning_curve with RMSE on the linear fit, then the degree-10 polynomial pipeline, train versus validation error against training-set size.
5. [Error-only confusion views](https://github.com/ageron/handson-mlp/blob/main/03_classification.ipynb) (Hands-On Machine Learning - classification and linear models) - Error Analysis section: row-normalized matrices, then error-only views with sample_weight, normalized by row and by column.

**Focus**

- Leverage measures position in x-space, not wrongness. The x = 10 point in a 0-to-2 design carries leverage 0.98 out of p = 2 while anchoring the slope; residuals measure wrongness, and influence needs both.
- Patterns have signatures. Curvature in residual-versus-fitted means nonlinearity, a funnel means heteroscedasticity, and isolated large standardized residuals mean outliers; each prescribes a different repair.
- Separation shows as coefficients that keep growing as C is relaxed, with probabilities glued to 0 and 1. On x = 0,1,2,3 with y = 0,0,1,1 the slope is 0.96 at C = 1 and 9.31 at C = 1e3. At C = 1e6 lbfgs stops at 16.57 under its default tol = 1e-4 with no warning, while tol = 1e-12 reaches 21.50. The fix is a finite penalty, not more iterations.

**Reproduce:** From a blank file compute hat diagonals on the design [[1,0],[1,1],[1,2],[1,10]] and match leverages [0.4183, 0.3307, 0.2749, 0.9761] summing to p = 2. Then fit LogisticRegression on x = [0,1,2,3] with y = [0,0,1,1] at C = 1, 1e3 and 1e6 with scikit-learn 1.9.1 defaults and match slopes [0.9583], [9.3057] and [16.5719]. Refit C = 1e6 with tol=1e-12 and watch the slope move to 21.4953: under separation the stopping rule, not the data, sets the weights.

**Traps**

- Deleting every high-leverage point. Leverage is not guilt: a far-x point with a small residual anchors the fit. Act on influence, which combines residual and leverage (Cook's distance), not on position alone.
- Reading saturated 0 and 1 probabilities as a great classifier. Under separation the likelihood rewards ever-larger weights, so perfect scores signal an unidentified model rather than a solved problem.
- Raising max_iter or C to force a separated fit to converge. The penalized optimum keeps moving outward as C grows, and under the default tol lbfgs stops early without a ConvergenceWarning, so a quiet fit proves nothing. Keep the penalty finite or collect overlapping cases.

**Practice**

- [HoML 04 Learning Curves: bias-variance diagnosis from error curves](https://github.com/ageron/handson-mlp/blob/main/04_training_linear_models.ipynb) - Learning Curves section: RMSE train and validation curves from learning_curve for the linear fit and the degree-10 polynomial pipeline. Rebuild both curve pairs from a blank script and name which regime, bias or variance dominated, each pair shows.
- [HoML 03 Error Analysis: error-only confusion views](https://github.com/ageron/handson-mlp/blob/main/03_classification.ipynb) - Error Analysis section: row-normalized matrix, then the sample_weight error-only views normalized by row and by column. List the three most confused digit pairs from the error-only views and inspect sample images for each.

**Stop when:** You can name the violated assumption from any residual plot, reproduce the leverage table from a blank file, and catch separation from a C sweep before looking at accuracy.

<details>
<summary>Self-test</summary>

1. Residual-versus-fitted shows a U shape. What is wrong, and what changes?
   - Nonlinearity the linear form cannot express. Add polynomial or interaction terms rather than collecting more data for the same line.
2. The x = 10 point has leverage 0.98 out of p = 2. Should it be deleted?
   - Not on leverage alone. It dominates the slope estimate but a small residual there is informative. Check influence by refitting without it before deciding.
3. Logistic coefficients keep growing as C is relaxed (0.96, 9.31, 16.57 at C = 1, 1e3, 1e6) and the probabilities print as 0 or 1. Diagnose and repair.
   - Complete separation: the maximum likelihood weights are unbounded and only the penalty keeps them finite, so the penalized optimum moves outward roughly in proportion to log C. Keep C finite, confirm the weights hold under a tighter tol, and look for overlapping cases to collect.
4. Standardized residuals fan out as fitted values grow. Name the violation and one valid response.
   - Heteroscedasticity, non-constant error variance. Transform the response, model the variance, or use variance-robust inference; adding polynomial terms does not fix it.

</details>

#### U6. LDA, QDA and generative versus discriminative classifiers

**About 4 h** · **Target:** Derive

Topics: LDA and QDA equations, assumptions and decision boundaries; Generative versus discriminative classification

LDA, QDA, naive Bayes and logistic regression all draw linear-or-quadratic boundaries from different assumptions. Seeing which assumption buys which boundary tells you what breaks first when the data disobeys.

**You can now**

- Derive the LDA discriminant from Gaussian class conditionals with shared covariance and show the boundary is linear.
- Derive the QDA and Gaussian naive Bayes discriminants, and state the exact assumption that turns one into the other.
- Contrast generative and discriminative fitting on parameter counts, small-sample behavior and robustness to violated assumptions.

**Study**

1. [LDA for one and many predictors](https://hastie.su.domains/ISLP/ISLP_website.pdf.download.html) (An Introduction to Statistical Learning with Python) - Chapter 4, Sections 4.4.1 to 4.4.2 (pp. 147-155): Bayes theorem for classification, Gaussian class conditionals, the shared-covariance assumption and the linear discriminant.
2. [QDA and the analytical comparison of classifiers](https://hastie.su.domains/ISLP/ISLP_website.pdf.download.html) (An Introduction to Statistical Learning with Python) - Chapter 4, Section 4.4.3 (p. 156) for QDA, then Section 4.5.1 (pp. 161-164): the linear, quadratic and additive log-odds forms and which method nests inside which.
3. [Generative versus discriminative classifiers](https://www.cs.cmu.edu/~tom/mlbook/NBayesLogReg.pdf) (Tom Mitchell - Generative and Discriminative Classifiers: Naive Bayes and Logistic Regression) - Sections 1 (Bayes-rule learning and the 2(2n - 1) parameter count), 2.1-2.2 (conditional independence and the naive Bayes derivation), 3.1 (Gaussian naive Bayes implies the logistic form) and 4 (discriminative versus generative, asymptotic identity, Ng and Jordan rates).
4. [LDA and QDA formulation and solvers](https://scikit-learn.org/stable/modules/lda_qda.html) (scikit-learn - linear models, discriminant analysis and naive Bayes) - Section 1.2.2 (Bayes rule, Gaussian class conditionals, QDA log-posterior, LDA linear form with coef_ and intercept_, and the QDA-with-diagonal-covariance equals GaussianNB note) and 1.2.5 (svd is the default solver).
5. [LDA and QDA lab on the Smarket data](https://github.com/intro-stat-learning/ISLP_labs/blob/main/Ch04-classification-lab.ipynb) (An Introduction to Statistical Learning with Python) - Linear Discriminant Analysis and Quadratic Discriminant Analysis sections: fits, posterior values and confusion matrices beside the logistic fit.

**Focus**

- LDA log odds are linear in x because the shared covariance cancels every quadratic term; QDA keeps one covariance per class, so its boundary is quadratic with cross terms.
- Gaussian naive Bayes is QDA with diagonal class covariances. If each feature's variance is also shared across classes, it becomes LDA with a diagonal shared covariance (ISLP 4.5.1). Naive Bayes in general, with any per-feature densities, and QDA do not nest: naive Bayes log odds are additive in the features, while QDA's contain products of feature pairs.
- Logistic regression and LDA posit the same linear log-odds form but fit it differently: LDA estimates class Gaussians and priors while logistic maximizes the conditional likelihood. Expect LDA to win when normality holds and logistic when it does not.

**Reproduce:** Write the LDA discriminant delta_k(x) = x' Sigma^{-1} mu_k - mu_k' Sigma^{-1} mu_k / 2 + log pi_k from the Gaussian log posterior. Build the two-Gaussian demo with default_rng(3): 40 standard normal points around [0,0], then 40 around [2,2]. Match sklearn LDA priors [0.5, 0.5], training score 0.95, coefficients [1.927, 2.229] and intercept -4.070.

**Traps**

- Fitting QDA with too few rows per class. Each class covariance comes from that class's rows alone, and with p or fewer rows per class (the class mean uses one) it is singular. Use QDA's reg_param or shrinkage with the eigen solver, or LDA with shrinkage.
- Calling LDA parameter-free. It exposes no tuning knob by default but still estimates K means, a shared covariance and priors, which overfit small samples.
- Assuming discriminative always wins with enough data. Logistic regression often has the lower asymptotic error under misspecification, but per Ng and Jordan naive Bayes approaches its own asymptote in order log n examples versus order n for logistic regression, where n is the number of features. So LDA and naive Bayes often win when training data are scarce.

**Practice**

- [ISLP Lab 4.7.3-4.7.4: LDA and QDA on the Smarket data](https://github.com/intro-stat-learning/ISLP_labs/blob/main/Ch04-classification-lab.ipynb) - Linear Discriminant Analysis and Quadratic Discriminant Analysis sections: fits, posteriors and confusion matrices against the Section 4.7.2 logistic fit. Record where QDA beats LDA and where it loses, and tie each case to the shared-versus-separate covariance assumption.

**Stop when:** You can write both discriminants from the Gaussian log posterior, predict the boundary shape from the covariance assumption, and call the likely winner from data geometry before fitting.

<details>
<summary>Self-test</summary>

1. Write the two-class LDA decision rule and name each estimated quantity.
   - Assign argmax over k of x' Sigma^{-1} mu_k - mu_k' Sigma^{-1} mu_k/2 + log pi_k: class means, one shared covariance and priors. The x-quadratic terms cancel because Sigma is shared, leaving a linear boundary.
2. When does QDA collapse to Gaussian naive Bayes, and when does Gaussian naive Bayes collapse toward LDA?
   - QDA restricted to diagonal class covariances is Gaussian naive Bayes. Gaussian naive Bayes whose per-feature variances are shared across classes is LDA with a diagonal shared covariance. General naive Bayes and QDA do not nest: one is additive, the other has pairwise products.
3. 50 training points, 20 features, roughly Gaussian classes. LDA, QDA or logistic first?
   - LDA, possibly with shrinkage. QDA must estimate two 20-by-20 covariances from about 25 points each, and logistic fits 21 weights discriminatively with higher variance. Revisit logistic if normality is badly violated and more data arrives.
4. State the Ng and Jordan sample-complexity contrast and its practical consequence.
   - Naive Bayes approaches its asymptotic error in order log n training examples and logistic regression needs order n, where n is the number of features, not samples. So naive Bayes often wins on small training sets, while logistic regression, with its usually lower asymptotic error, wins once data are plentiful.

</details>

#### U7. Naive Bayes: event models, smoothing and log-space scoring

**About 3 h** · **Target:** Derive + Implement

Topics: Bernoulli, multinomial and Gaussian naive Bayes; Priors, smoothing, conditional independence and log-space scoring

Naive Bayes is the smallest complete probabilistic classifier: counting, smoothing and log-space scoring in one place. Its failure mode, confident scores from false independence, previews every calibration problem later.

**You can now**

- Derive the naive Bayes decision rule from conditional independence and count its free parameters per event model.
- Implement Bernoulli naive Bayes with Laplace smoothing and log-space scoring, handling unseen values and single-class training data.
- Select the event model (Bernoulli, multinomial, Gaussian) from the feature type and state what each independence assumption ignores.

**Study**

1. [Naive Bayes: independence, smoothing and parameter counts](https://www.cs.cmu.edu/~tom/mlbook/NBayesLogReg.pdf) (Tom Mitchell - Generative and Discriminative Classifiers: Naive Bayes and Logistic Regression) - Sections 2.1-2.3 (conditional independence, the naive Bayes derivation, discrete inputs with the smoothed estimate (7) and Laplace at l = 1, prior smoothing (9), n(J - 1)K plus K - 1 free parameters) and 2.4 (Gaussian naive Bayes with 2nK mean and variance parameters).
2. [Naive Bayes in the generative family](https://hastie.su.domains/ISLP/ISLP_website.pdf.download.html) (An Introduction to Statistical Learning with Python) - Chapter 4, Section 4.4.4 (p. 158): the naive Bayes model beside LDA and QDA.
3. [Naive Bayes on binary MNIST pixels](https://d2l.ai/chapter_appendix-mathematics-for-deep-learning/naive-bayes.html) (Dive into Deep Learning - linear models slice) - Section 22.9: The Probabilistic Model for Classification, The Naive Bayes Classifier, Training on pixels binarized at 128, then Exercises 1 (XOR failure) and 2 (unseen values without smoothing).
4. [Event models, smoothing and estimator limits](https://scikit-learn.org/stable/modules/naive_bayes.html) (scikit-learn - linear models, discriminant analysis and naive Bayes) - Section 1.9 (MAP rule, the bad-estimator warning on predict_proba), 1.9.1 (GaussianNB), 1.9.2 (MultinomialNB smoothing formula, Laplace at alpha = 1 versus Lidstone below 1) and 1.9.4 (BernoulliNB decision rule, explicit penalty on non-occurrence, binarize behavior).
5. [Gaussian naive Bayes lab on Smarket](https://github.com/intro-stat-learning/ISLP_labs/blob/main/Ch04-classification-lab.ipynb) (An Introduction to Statistical Learning with Python) - Naive Bayes section: GaussianNB fit on Smarket with classes_ and class_prior_ readouts.

**Focus**

- Smoothing is a MAP estimate under a Dirichlet prior, not a hack. Mitchell's (count + l)/(total + lJ) at l = 1 is Laplace, and BernoulliNB's alpha = 1.0 is the same add-one per value; without it one unseen value zeroes the whole product.
- Bernoulli penalizes absent indicator features while multinomial ignores absent counts. That is why occurrence vectors can beat count vectors on short documents, and why the two models are not interchangeable.
- Score in log space always. A product of 1100 halves is exactly 0.0 in float64 while the log sum stays finite at -762.46; argmax needs only the sums.

**Reproduce:** Derive the MAP rule argmax_y P(y) prod_i P(x_i|y) from conditional independence. From a blank file implement Bernoulli naive Bayes with alpha = 1.0: on X = [[1,0],[1,1],[0,0],[0,1]] with y = [1,1,0,0] match sklearn feature_log_prob_ rows [-1.3863, -0.6931] for class 0 and [-0.2877, -0.6931] for class 1, predict [1] for [[1,0]], and return the majority class when trained on one class only.

**Traps**

- Feeding counts to BernoulliNB or magnitudes to a binary model without thought. BernoulliNB binarizes continuous input at binarize = 0.0 by default, silently turning magnitudes into presence flags.
- Multiplying raw probabilities and comparing. Beyond underflow, one unsmoothed zero vetoes the class; sum logs and smooth first.
- Reading predict_proba as calibrated confidence. The guide calls naive Bayes a bad estimator: use the scores to rank, then threshold or calibrate downstream.

**Practice**

- [Deep-ML 140: Bernoulli Naive Bayes Classifier](https://www.deep-ml.com/problems/140) - NaiveBayes class with forward (Laplace smoothing at 1.0) and predict in log space; tests check a 5-row fit and a symmetric single-feature case, and the spec requires single-class training data to work. Match sklearn BernoulliNB on the same inputs before submitting.
- [ISLP Lab 4.7.5: Naive Bayes on the Smarket data](https://github.com/intro-stat-learning/ISLP_labs/blob/main/Ch04-classification-lab.ipynb) - Naive Bayes section: GaussianNB fit with classes_ and class_prior_ readouts beside the LDA and QDA fits. Compare its confusion matrix with the LDA one and attribute the differences to the diagonal-covariance assumption.

**Stop when:** Your Bernoulli implementation matches sklearn feature_log_prob_ to 1e-8, survives unseen values and single-class fits, and you can choose the event model from the feature type alone.

<details>
<summary>Self-test</summary>

1. A test word never appeared in training. What happens with and without smoothing?
   - Without smoothing its likelihood is 0 and the whole class product is 0 regardless of other evidence. With Laplace alpha = 1 it contributes a small nonzero factor that rarely decides the argmax alone.
2. When does Bernoulli beat multinomial on text, and why?
   - With occurrence vectors on short documents: Bernoulli explicitly penalizes the non-occurrence of indicator words while multinomial ignores absent counts. sklearn advises evaluating both when time permits.
3. Write the smoothed discrete likelihood and name its prior.
   - (count + l)/(class total + lJ): the MAP estimate under a symmetric Dirichlet prior with parameters l + 1, equivalently the posterior mean under parameters l; l = 1 is Laplace. Priors smooth the same way with lK in the denominator.
4. XOR data with labels [0,1,1,0]. Does naive Bayes succeed, and which assumption fails?
   - No. Each feature alone is uninformative about the label, so conditional independence destroys the interaction. Allowing explicit dependence between the inputs fixes it.

</details>

#### U8. Probability estimates, class priors and asymmetric thresholds

**About 2 h** · **Target:** Derive + Measure

Topics: Probability estimates, class priors and asymmetric thresholds

A probability is not a decision. The same fitted scores need different thresholds under different costs and different priors, and 0.5 is a cost claim most projects never stated.

**You can now**

- Derive the cost-optimal threshold from class probabilities and misclassification costs, and show why 0.5 is only optimal for symmetric costs.
- Adjust decisions for changed class priors without refitting, through the prior-odds correction.
- Measure precision-recall and ROC tradeoffs on fixed validation data and select a threshold from stated costs.

**Study**

1. [Precision-recall tradeoff and ROC thresholds](https://github.com/ageron/handson-mlp/blob/main/03_classification.ipynb) (Hands-On Machine Learning - classification and linear models) - Precision/Recall Trade-off section (precision_recall_curve on the MNIST 5-detector, the threshold-3000 demo, idx_for_90_precision) and The ROC Curve section with the 90%-precision operating point.
2. [Predicted probabilities and dummy encoding](https://hastie.su.domains/ISLP/ISLP_website.pdf.download.html) (An Introduction to Statistical Learning with Python) - Chapter 4, Section 4.3.3 (pp. 141-142): probabilities computed from fitted coefficients with the balance arithmetic, plus dummy variables for qualitative predictors.
3. [Default threshold, weights and calibration limits](https://scikit-learn.org/stable/modules/linear_model.html) (scikit-learn - linear models, discriminant analysis and naive Bayes) - Section 1.1.11 introduction (predicted probability becomes a classifier at a threshold, by default 0.5), Binary Case (sample and class weights rescale the effective C through S) and Solvers details (joint multinomial loss calibrates better than OvR).
4. [Priors inside the discriminant scores](https://scikit-learn.org/stable/modules/lda_qda.html) (scikit-learn - linear models, discriminant analysis and naive Bayes) - Section 1.2.2 (posteriors combine class conditionals with P(y = k); LDA adds log P(y = k) to the discriminant) and 1.2.4 (shrinkage as the small-sample stabilizer for those estimates).

**Focus**

- sklearn predicts the positive class at 0.5 by default. That bakes in equal costs and matched priors; any asymmetric cost matrix moves the optimal threshold to C_FP/(C_FP + C_FN).
- Naive Bayes scores rank well but estimate badly, and OvR margins are not calibrated across classifiers. Thresholding an uncalibrated score encodes its bias as policy.
- Priors shift without refitting: multiply the posterior odds by the new-over-old prior-odds ratio. Thresholds move with prevalence even when the feature evidence stays fixed.

**Reproduce:** Derive t = C_FP/(C_FP + C_FN) from predicting 1 exactly when p times C_FN exceeds (1 - p) times C_FP, and show costs of 1 and 9 give t = 0.1. From a blank script recompute precisions, recalls and thresholds with precision_recall_curve on binary scores and implement the first-index rule that finds the 90%-precision threshold.

**Traps**

- Tuning the threshold on the test set. Thresholds are fitted parameters: select on validation, report once on test, or the reported precision is optimistic.
- Comparing thresholds across models with different score scales. A 0.3 cutoff on calibrated probabilities means something different from 3000 on raw margins; compare at matched precision or recall, not matched knob values.
- Keeping 0.5 after reweighting classes. Class and sample weights change the score scale and the effective penalty, so retune the threshold after any weighting change.

**Practice**

- [HoML 03 Precision/Recall Trade-off: the 90%-precision threshold](https://github.com/ageron/handson-mlp/blob/main/03_classification.ipynb) - Precision/Recall Trade-off section: the precision-recall-versus-threshold plot, idx_for_90_precision, and the ROC point for that threshold. Rebuild the curve and both threshold picks from a blank script; then move the threshold to the cost-optimal point for a stated 1:9 cost ratio and report the precision-recall change.
- [NeetCode ML: full linear-model closing drill](https://neetcode.io/practice/machine-learning) - Math Foundations six: Gradient Descent, Sigmoid and ReLU, Softmax, Cross-Entropy Loss, Linear Regression Forward, Linear Regression Training. After the section gate, solve all six cold. Repeat only failed items from a blank file with changed values.

**Stop when:** You can derive the cost-optimal threshold, move it correctly under a stated prior shift, and replicate the 90%-precision procedure on new scores without touching the test set.

<details>
<summary>Self-test</summary>

1. False negatives cost 9 times false positives. Which threshold, and why not 0.5?
   - t = 1/(1 + 9) = 0.1: predict positive whenever p exceeds 0.1. The 0.5 default assumes equal costs and would miss cheap-to-catch positives.
2. Deployment prevalence of positives halves with the same feature evidence. How do the optimal decisions change without refitting?
   - Posterior odds are the likelihood ratio times the prior odds, so every case's posterior odds are multiplied by the new-over-old prior-odds ratio, about one half when positives are rare. Fewer cases clear any fixed threshold; recompute posteriors with the new priors, or move the threshold equivalently, instead of reusing the old cutoff.
3. Two detectors both report 90% precision, one at margin 3000 and one at probability 0.42. Which threshold is better?
   - The knobs are incomparable across scales. Compare recall at matched precision, or expected cost, on the same validation data.
4. The guide warns naive Bayes is a bad estimator. What breaks if its raw scores are thresholded at 0.5?
   - Ranking can be good while false independence pushes absolute scores to extremes, so 0.5 lands in the wrong place. Set the threshold from measured precision and recall, or calibrate first.

</details>

### Mini-project: Linear and probabilistic models from scratch, with two failure diagnoses

**About 10 to 14 hours.** Implement least squares, ridge, logistic regression and one naive Bayes variant in NumPy in your own repository, prove each against scikit-learn and finite differences, then diagnose one numerical failure and one assumption failure on changed datasets you construct.

1. Implement least squares three ways: normal equations, an SVD-based solve and minibatch gradient descent with a decaying step. Pass a float64 gradient check and match LinearRegression, handling the intercept the same way on both sides.
2. Add ridge with the centered closed form and a penalty path. Match Ridge to 1e-12 and report validation error across alpha on a fixed split.
3. Implement logistic regression on logits with the stable loss max(z,0) - z y + log1p(exp(-|z|)) and an L2 penalty. Pass a gradient check, then match LogisticRegression on its own objective (C times the summed loss plus half the squared norm) with tol tightened.
4. Implement Bernoulli or multinomial naive Bayes with Laplace smoothing in log space. Match scikit-learn's feature_log_prob_ to 1e-8 and handle unseen values and single-class training data.
5. Numerical failure: build a changed dataset that breaks one naive path, such as a near-collinear design for the normal equations, logits past 37 for a naive y = 0 loss, or a separable set under a relaxed C. Show the failure, the measurement that discriminates its cause, the repair and a regression test.
6. Assumption failure: build a dataset that violates one model assumption, such as XOR-labeled binary features for naive Bayes, heteroscedastic noise for least squares, or non-Gaussian classes for LDA. Show the diagnostic that reveals it and the response, validated on held-out data.
7. Turn one fitted logistic model into a decision: derive the cost-optimal threshold for stated costs, apply it on validation, and move it for a stated prevalence change without refitting.

**Deliverables**

- The NumPy package: least squares (three solvers), ridge, logistic regression and naive Bayes.
- The test suite: scikit-learn differential tests, finite-difference checks and the extreme-input probes.
- Derivation notes: normal equations, the ridge closed form, the logistic gradient and the smoothed MAP rule.
- Two failure reports, numerical and assumption, each with diagnostic, repair and regression test.

**Checks**

- external-tests: [Deep-ML 15, 106 and 140](https://www.deep-ml.com/problems). Free problems with public tests. Pass them after your local tests do; each card states what the tests pin, such as the 1000-step iterate in 15 and the summed loss in 106.
- rubric: Self-grade with the rubric below.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Correctness against oracles | Each implementation matches its scikit-learn counterpart within a stated tolerance. | Property tests vary seeds, shapes and penalties, and every analytic gradient matches central differences in float64. |
| Numerical stability | The logit loss stays finite on the (-800, 1), (40, 0) and (800, 0) probes, and ill-conditioned designs use an SVD-based solve. | The notes show where each naive form breaks, such as the sigmoid rounding to 1.0 near z = 36.7, and why the stable form is exact. |
| Numerical failure diagnosis | One failure is reproduced, explained, repaired and guarded by a test. | The discriminating measurement rules out a rival cause, for example a tighter tol showing that lbfgs stopped early rather than converged. |
| Assumption failure | One violated assumption is shown with a diagnostic and a response. | The response is validated on held-out data and the report states what it still cannot fix. |
| Decision | The threshold follows from stated costs and is chosen on validation data. | The prevalence adjustment is derived from prior odds and checked against a refit on resampled data. |

Feeds into: Milestone artifact 2, the mechanisms suite: the regularized linear or logistic model and naive Bayes come from here. The failure reports feed the decision dossier.

### Resource route

- **Primary - Theory:** [An Introduction to Statistical Learning with Python](https://www.statlearning.com/) - Use Chapters 3, 4 and 6 with their Python labs as the first pass: least squares and its diagnostics, logistic regression, LDA, QDA and naive Bayes, basis expansion and regularization paths.
- **Required - Implementation:** [Dive into Deep Learning - linear models slice](https://d2l.ai/) - Use 3.1, 3.4, 3.6, 3.7, 4.1, 4.4, 22.7 and 22.9 for linear regression, generalization, weight decay, softmax, maximum likelihood and naive Bayes. Implement with NumPy first and use the PyTorch versions only as a differential reference.
- **Reference - Reference:** [scikit-learn - linear models, discriminant analysis and naive Bayes](https://scikit-learn.org/stable/supervised_learning.html) - Use the official Linear Models, LDA and QDA, and Naive Bayes guides to verify estimator semantics and selected edge cases after the independent implementation works.
- **Support - Implementation:** [Hands-On Machine Learning - classification and linear models](https://github.com/ageron/handson-mlp) - Use notebooks 03 and 04 for classification diagnostics, linear and polynomial regression, regularization and logistic regression. Recreate the target mechanism independently before inspecting worked exercise code.
- **Support - Practice:** [NeetCode ML - linear-model closing drill](https://neetcode.io/practice/machine-learning) - After the section gate, solve Gradient Descent, Sigmoid and ReLU, Softmax, Cross-Entropy Loss, Linear Regression Forward and Linear Regression Training cold. Repeat only failed items from a blank file with changed values.
- **Support - Practice:** [Deep-ML - linear and probabilistic model problems](https://www.deep-ml.com/problems) - Use 15 Linear Regression Using Gradient Descent, 106 Train Logistic Regression with Gradient Descent and 140 Bernoulli Naive Bayes Classifier as unit checks after the local implementation passes. Their tests were read in review; each card states what they pin. The local implementation remains the evidence.
- **Required - Theory:** [Tom Mitchell - Generative and Discriminative Classifiers: Naive Bayes and Logistic Regression](https://www.cs.cmu.edu/~tom/mlbook/NBayesLogReg.pdf) - Read Sections 2 (naive Bayes, the smoothed estimates (7) and (9), parameter counts), 3 (Gaussian naive Bayes implies the logistic form, gradient ascent, the L2 penalty, the K-class rules) and 4 (generative versus discriminative, Ng and Jordan rates). This is the CS446 reading for Lectures 6-8; rework each derivation on a hand-sized dataset.

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

### Study units

#### U1. CART: split objectives, impurity, stopping and pruning

**About 5 h** · **Target:** Derive + Implement

Topics: CART classification and regression split objectives; Gini, entropy, information gain and variance reduction; Stopping, pruning and deterministic split ties

Trees decide by recursive splits, so every later ensemble inherits their split logic, their variance and their failure modes. If you cannot score a split by hand, forest and boosting diagnostics stay magic.

**You can now**

- Compute weighted Gini, entropy and variance reduction for a candidate split by hand and name the winning split.
- Implement a CART-style best-split scan with a stated tie rule, stopping conditions and leaf predictions, and differential-test it against sklearn on small data.
- Predict how max_depth, min_samples_split and ccp_alpha change bias, variance and tree size.

**Study**

1. [HoML Chapter 5: growing and regularizing trees](https://github.com/ageron/handson-mlp/blob/main/05_decision_trees.ipynb) (Hands-On Machine Learning - nonlinear classical models) - Training and Visualizing a Decision Tree, Making Predictions, Estimating Class Probabilities, Regularization Hyperparameters, Regression, Sensitivity to axis orientation, Decision Trees Have High Variance.
2. [sklearn decision trees: split search, criteria and complexity](https://scikit-learn.org/stable/modules/tree.html#mathematical-formulation) (scikit-learn - neighbors, SVMs, trees and ensembles) - 1.10.7 Mathematical formulation with 1.10.7.1 Classification criteria and 1.10.7.2 Regression criteria; 1.10.4 Complexity for fit and predict cost.
3. [sklearn decision trees: CART scope, tips and pruning](https://scikit-learn.org/stable/modules/tree.html#minimal-cost-complexity-pruning) (scikit-learn - neighbors, SVMs, trees and ensembles) - 1.10.6 CART versus ID3 and C4.5 (binary splits, no categorical support); 1.10.5 Tips on practical use; 1.10.9 Minimal Cost-Complexity Pruning with the weakest-link rule and ccp_alpha.
4. [ISLP Chapter 8: regression and classification trees](https://hastie.su.domains/ISLP/ISLP_website.pdf.download.html) (ISLP - tree-based methods and support vector machines) - Sections 8.1.1 and 8.1.2 (pp. 331 to 341): recursive binary splitting, Gini versus entropy similarity, and classification error reserved for pruning.

**Focus**

- Split quality is the weighted child impurity G = (nL/n) H(L) + (nR/n) H(R). The parent impurity is the same for every candidate at a node, so minimizing G is the same as maximizing the impurity decrease.
- sklearn tries midpoints between sorted distinct values with greedy exhaustive search, while Deep-ML 138 scores the raw values: the same four points yield threshold 3.0 under sklearn and 2.5 in problem 138.
- Gini and entropy are numerically close and either works for growing; ISLP reserves the classification error rate for pruning toward accuracy.
- ccp_alpha penalizes leaf count and prunes the weakest link first, which produces the nested candidate path that cross-validation then selects from.

**Reproduce:** By hand on ordered labels A, B, A, A, A: parent Gini 0.32, split after the 2nd instance gives 2/5 times 0.5 + 3/5 times 0 = 0.2, split after the 1st gives 0.3. Then implement a midpoint scan with first-in-scan tie wins and match sklearn threshold 1.5 on X = [0, 1, 2, 3] with y = [0, 0, 1, 1] at max_depth = 1.

**Traps**

- Equal impurity does not mean a unique split. With two identical feature columns, sklearn picks feature 1 under seeds 0 and 1 but feature 0 under seed 42, so your scanner must define first-wins and test it.
- A child can be less pure than its parent: the A, B child has Gini 0.5 against the parent 0.32. Only the weighted sum has to decrease.
- HoML Chapter 5 never sets criterion, so every tree there is Gini. Request entropy explicitly, and remember the 138-versus-sklearn threshold convention before comparing answers.

**Practice**

- [Deep-ML 138: Find the Best Gini-Based Split for a Binary Decision Tree](https://www.deep-ml.com/problems/138) - Implement find_best_split(X, y); the visible tests check (0, 2.5) on the 4-point split and (0, 1) on the all-pure tie. The visible tests pin thresholds to sorted unique values (2.5, not the sklearn midpoint 3.0) with first minimum in feature-then-value order winning. Implement that convention, not sklearn midpoints.
- [Deep-ML 20: Decision Tree Learning](https://www.deep-ml.com/problems/20) - Implement learn_decision_tree(examples, attributes, target_attr); the visible tests check the two-attribute PlayTennis tree and a single-attribute tree. Splits use entropy with information gain, values in sorted order, first attribute on ties and alphabetical leaf on ties.

**Stop when:** Your hand table gives 0.32, 0.2 and 0.3, your scanner matches sklearn on two small sets, and both Deep-ML problems pass.

<details>
<summary>Self-test</summary>

1. A node holds 3 positives and 1 negative. What are its Gini impurity and its entropy in bits?
   - Gini = 1 - 0.75^2 - 0.25^2 = 0.375. Entropy = -(0.75 log2 0.75 + 0.25 log2 0.25) = 0.311 + 0.5 = 0.811 bits.
2. Why does ISLP call the error rate weak for growing but prefer it for pruning?
   - Growing needs sensitivity to purity shifts that leave the majority label unchanged. Pruning selects the final tree for accuracy, which is exactly what the error rate measures.
3. The same data and code give different trees under a new random_state. Is that a bug?
   - No. Tied splits can resolve differently across seeds, as the identical-feature test shows. Fix the seed for reproducibility and define your own deterministic tie rule.
4. One leaf holds one vote for each of three classes. What does sklearn predict and with what probabilities?
   - It predicts classes_[0], the lowest index, with probabilities [1/3, 1/3, 1/3]. Argmax takes the first maximum.

</details>

#### U2. Bagging, random forests and out-of-bag estimates

**About 3 h** · **Target:** Explain + Measure

Topics: Bagging, bootstrap samples and variance reduction; Random forests, feature subsampling and out-of-bag estimates

Single trees have high variance: the same algorithm learns visibly different models from the same data. Bagging plus feature subsampling is the standard fix, and out-of-bag scoring gives a nearly free error estimate.

**You can now**

- Explain why bagging cuts variance for deep trees and why the error stabilizes as the tree count grows instead of overfitting.
- Explain how random feature subsets decorrelate trees and how max_features trades correlation against strength.
- Measure out-of-bag error against held-out error and read n_estimators, max_features and oob_score settings in sklearn.

**Study**

1. [HoML Chapter 6: voting, bagging and forests](https://github.com/ageron/handson-mlp/blob/main/06_ensemble_learning_and_random_forests.ipynb) (Hands-On Machine Learning - nonlinear classical models) - Voting Classifiers, Bagging and Pasting in Scikit-Learn, Out-of-Bag evaluation with the exp(-1) cells, Random Forests, Extra-Trees.
2. [ISLP Chapter 8: bagging, forests and the ensemble summary](https://hastie.su.domains/ISLP/ISLP_website.pdf.download.html) (ISLP - tree-based methods and support vector machines) - Sections 8.2.1, 8.2.2 and 8.2.5 (pp. 343 to 347, and 353): bootstrap aggregation, OOB as a valid test-error estimate with around B/3 predictions per point, and m near sqrt(p).
3. [sklearn forests: parameters and parallelization](https://scikit-learn.org/stable/modules/ensemble.html#random-forests-and-other-randomized-tree-ensembles) (scikit-learn - neighbors, SVMs, trees and ensembles) - Random Forests through Parameters (max_features sqrt for classifiers versus 1.0 for regressors, bootstrap True versus ExtraTrees False) and Parallelization with oob_score.
4. [sklearn bagging meta-estimator](https://scikit-learn.org/stable/modules/ensemble.html#bagging) (scikit-learn - neighbors, SVMs, trees and ensembles) - 1.11.3 Bagging: bootstrap versus pasting, max_samples, max_features and oob_score.

**Focus**

- A bootstrap covers about 63.2 percent of unique points since (1 - 1/n)^n tends to 1/e. Each point is predicted by the trees that missed it. On make_moons(2000, noise 0.25, seed 0) with a 25 percent test split, 200 trees give OOB 0.934 against held-out 0.932.
- Bagging helps unstable learners because averaging kills variance while bias stays put. Adding trees stabilizes the error; unlike boosting it has no residual-chasing loop to overfit with.
- Forests force different top splits by sampling m near sqrt(p) predictors per split, which decorrelates trees that would otherwise copy one strong predictor.
- sklearn defaults differ by task: the regressor uses max_features 1.0, which is plain bagging, and ExtraTrees uses bootstrap False with random splits.

**Reproduce:** Derive P(missed) = (1 - 1/n)^n tending to 1/e near 0.368, simulate n = 1000 to see about 63.4 percent unique, then fit RandomForestClassifier(n_estimators=200, oob_score=True, random_state=0) on make_moons(n_samples=2000, noise=0.25, random_state=0) split with test_size=0.25 and random_state=0, and show OOB 0.934 against held-out 0.932.

**Traps**

- Treating OOB as free model selection. Each OOB prediction uses only about a third of the trees, so with few trees it reads pessimistic, and once you tune on it, it is no longer held out. Monitor with it; select with a validation split or cross-validation.
- Soft voting needs predict_proba from every member. A default SVC in sklearn 1.9 has none, and the soft VotingClassifier still fits; the AttributeError appears only at predict time.
- Assuming sqrt features for a regressor silently turns the forest into bagging. Read max_features per estimator instead of quoting the classifier rule.

**Practice**

- [Deep-ML 307: Implement Bagging Classifier from Scratch](https://www.deep-ml.com/problems/307) - Implement bagging_classifier with decision stumps and majority vote; the visible tests check [0 1] with 5 stumps at seed 42 and [0 1 1] with 10 stumps at seed 0. Bootstrap n samples with replacement per stump, minimize stump misclassification error, combine by majority vote. The statement sets no even-vote tie rule, so keep yours explicit and match the visible outputs.

**Stop when:** You derive the 0.368 fraction, your moons OOB lands within about a point of held-out error, and problem 307 passes.

<details>
<summary>Self-test</summary>

1. From n = 200 points, how many land out of bag and how many trees predict each one?
   - About 0.368 times 200 = 74 points are missed per tree, and each point is predicted by the roughly B/3 trees whose samples skipped it.
2. Ten bagged trees give red probabilities 0.1, 0.15, 0.2, 0.2, 0.55, 0.6, 0.6, 0.65, 0.7 and 0.75. What do majority vote and probability averaging predict?
   - Majority vote says red with 6 of 10 above 0.5. Averaging gives 0.45 and says green. The combination rule changes the answer.
3. Is a default RandomForestRegressor closer to a sqrt forest or to bagged trees?
   - Bagged trees, because its max_features default is 1.0. The sqrt default applies to classifiers only.
4. Why does raising B not overfit bagging while it can overfit boosting?
   - Bagging averages fixed-complexity trees fit on resamples, so variance shrinks and bias holds. Boosting keeps fitting residuals, so late trees can chase noise; choose B by validation.

</details>

#### U3. AdaBoost and gradient boosting

**About 5 h** · **Target:** Derive + Implement

Topics: AdaBoost sample weighting and weak learners; Gradient boosting, pseudo-residuals, shrinkage and early stopping

Boosting turns weak rules into strong models by fitting what is left over. The same loop powers the gradient boosting libraries, so its failure modes of noise chasing and late overfitting follow you into production.

**You can now**

- Derive the AdaBoost reweighting step of error rate, learner weight and distribution update, and run one round by hand.
- Derive pseudo-residual fitting for squared and logistic loss and explain shrinkage, interaction depth and early stopping.
- Implement stage-wise boosting around stumps, match sklearn on a toy, and diagnose noise sensitivity and overfitting by iteration count.

**Study**

1. [HoML Chapter 6: AdaBoost and gradient boosting](https://github.com/ageron/handson-mlp/blob/main/06_ensemble_learning_and_random_forests.ipynb) (Hands-On Machine Learning - nonlinear classical models) - AdaBoost with the step-by-step weight update cells, Gradient Boosting with the residual-fitting chain and the learning_rate 1.0 versus 0.05 comparison. Depth: Drop algorithm='SAMME' from the AdaBoost cell: sklearn 1.9 removed the argument and raises TypeError, and SAMME is now the only mode.
2. [ISLP Chapter 8: boosting regression trees](https://hastie.su.domains/ISLP/ISLP_website.pdf.download.html) (ISLP - tree-based methods and support vector machines) - Section 8.2.3 with Algorithm 8.2 and the three tuning parameters B, shrinkage lambda and interaction depth d (pp. 347 to 350).
3. [sklearn AdaBoost usage](https://scikit-learn.org/stable/modules/ensemble.html#adaboost) (scikit-learn - neighbors, SVMs, trees and ensembles) - 1.11.7 AdaBoost with 1.11.7.1 Usage: SAMME for classification, default decision stumps, and n_estimators with learning_rate as the main knobs.
4. [sklearn gradient boosting: loss, shrinkage and subsampling](https://scikit-learn.org/stable/modules/ensemble.html#shrinkage-via-learning-rate) (scikit-learn - neighbors, SVMs, trees and ensembles) - 1.11.1.2.5 Shrinkage via learning rate (learning_rate at or below 0.1 with large n_estimators) and 1.11.1.2.6 Subsampling (subsample 0.5, OOB pessimistic so prefer cross-validation).

**Focus**

- AdaBoost scores the round by the weighted error r, pays the learner alpha = learning_rate times ln((1 - r)/r), multiplies wrong-point weights by exp(alpha) and renormalizes. The hand round gives r = 0.25, alpha = 0.5493 and weights [0.2113, 0.2113, 0.366, 0.2113], matching estimator_weights_.
- Gradient boosting fits each tree to pseudo-residuals, the negative gradients of the loss. For squared loss those are ordinary residuals, and the target mean plus a depth-2 tree fit on the residuals exactly equals a one-tree GBM at learning rate 1.0.
- Shrinkage, depth and count interact: small lambda needs large B with typical values 0.01 or 0.001, depth-1 stumps give additive single-variable terms, and subsample 0.5 adds bagging noise.
- Boosting uses no bootstrap and each tree depends on its predecessors, so B is a genuine overfitting knob. Choose it by validation or early stopping, unlike bagging counts.

**Reproduce:** Run one AdaBoost round by hand on X = [0, 1, 2, 3] with y = [0, 1, 0, 1] and learning_rate 0.5: stump threshold 0.5 (2.5 ties; sklearn picks 0.5), r = 0.25, alpha = 0.5493, new weights [0.2113, 0.2113, 0.366, 0.2113]. Confirm alpha against AdaBoostClassifier estimator_weights_. Then show GradientBoostingRegressor with learning_rate 1.0, one tree and max_depth 2 equals the target mean plus a depth-2 DecisionTreeRegressor fit on the residuals, on 50 points with x uniform on [0, 4) and y = sin(x) plus noise 0.05 at seed 0.

**Traps**

- Copying algorithm='SAMME' from the notebook raises TypeError in sklearn 1.9. The parameter is gone and discrete SAMME is the only behavior.
- AdaBoost pushes weight exponentially onto mistakes, so mislabeled points attract ever more attention. Noisy labels hurt it more than they hurt bagging.
- The learning_rate 1.0 residual demo is didactic. Real runs shrink to 0.1 or below with many more trees, or the residual fit jumps past good solutions.

**Practice**

- [ISLP Chapter 8, Applied exercise 10: boosting on Hitters salary](https://hastie.su.domains/ISLP/ISLP_website.pdf.download.html) - Exercise 10 (p. 366), parts (a) to (g): 1000 trees over a shrinkage range, train and test MSE plots, comparison with Chapters 3 and 6 regressions and with bagging, variable importance. Install the ISLP package for the Hitters data, drop the rows with missing Salary, log-transform salary, use the first 200 rows for training, and report the shrinkage value with the lowest test MSE.

**Stop when:** Your hand round matches sklearn weights, your stump booster reproduces the one-tree GBM identity, and the Hitters sweep shows test MSE dipping then rising with a stated choice of shrinkage and tree count.

<details>
<summary>Self-test</summary>

1. A stump has weighted error 0.25 with learning_rate 0.5. What learner weight does AdaBoost assign, and what happens to a wrong point starting at 0.25?
   - alpha = 0.5 ln(3) = 0.5493. The wrong point goes to 0.25 times exp(0.5493) = 0.433 before renormalization, which is 0.366 after.
2. Why does boosting depth-1 stumps produce an additive model?
   - Each stump splits on one variable, so each term is a function of one variable only. The sum over rounds is a sum of single-variable terms.
3. A GBM with 5000 trees, learning_rate 0.5 and no validation set scores perfectly in training but poorly on new data. What broke and what is the fix?
   - Late trees overfit the residuals. Shrink the learning rate toward 0.1 or below, add row or column subsampling, and pick the iteration count by early stopping on validation.
4. How does boosting reuse data differently from bagging?
   - Bagging fits independent trees on bootstrap copies. Boosting refits the same data with modified weights or residuals, so each tree depends strongly on the ones before it.

</details>

#### U4. XGBoost, LightGBM and CatBoost configuration

**About 2 h** · **Target:** Explain

Topics: XGBoost, LightGBM and CatBoost configuration literacy

Graduating from one API to the family means reading any booster config on sight. The names rhyme across libraries but the defaults do not, and that gap is where silent misconfiguration lives.

**You can now**

- Map depth, learning rate, row and column sampling, L2 and early stopping across XGBoost, LightGBM, CatBoost and sklearn HGBT without mixing up names.
- State the defaults that bite and set one equivalent configuration in each library from memory.

**Study**

1. [XGBoost tree-booster parameters](https://xgboost.readthedocs.io/en/stable/parameter.html#parameters-for-tree-booster) (XGBoost parameters and sklearn estimator interface) - Parameters for Tree Booster: eta default 0.3, max_depth 6, min_child_weight 1, subsample 1, colsample_bytree, bylevel and bynode 1, lambda 1, alpha 0.
2. [XGBoost sklearn interface and early stopping](https://xgboost.readthedocs.io/en/stable/python/sklearn_estimator.html#early-stopping) (XGBoost parameters and sklearn estimator interface) - Early Stopping: XGBClassifier with tree_method hist, early_stopping_rounds with eval_set, best iteration used automatically for prediction.
3. [LightGBM core and control parameters](https://lightgbm.readthedocs.io/en/latest/Parameters.html#learning_rate) (LightGBM parameters) - learning_rate 0.1, num_leaves 31, max_depth -1 for no limit with leaf-wise growth, min_data_in_leaf 20, feature_fraction 1.0, bagging_fraction 1.0 effective only with bagging_freq above 0, lambda_l2 0.0, early stopping by callback or early_stopping_round.
4. [CatBoost common parameters](https://catboost.ai/docs/en/references/training-parameters/common#depth) (CatBoost common parameters and categorical features) - depth 6, learning_rate chosen automatically for Logloss, MultiClass and RMSE and 0.03 otherwise, l2_leaf_reg 3.0, iterations 1000, SymmetricTree grow_policy, subsample 0.8 under the default MVS bootstrap on CPU (Bayesian for multiclass), rsm for columns per split, boosting_type Ordered versus Plain, use_best_model with eval_set, one_hot_max_size 2.
5. [sklearn histogram gradient boosting as the local baseline](https://scikit-learn.org/stable/modules/ensemble.html#histogram-based-gradient-boosting) (scikit-learn - neighbors, SVMs, trees and ensembles) - 1.11.1.1 Histogram-Based Gradient Boosting with Usage: max_iter 100 replaces n_estimators, max_bins 255, max_leaf_nodes 31, early_stopping auto above 10000 rows.
6. [HoML Chapter 6: histogram boosting with native categories](https://github.com/ageron/handson-mlp/blob/main/06_ensemble_learning_and_random_forests.ipynb) (Hands-On Machine Learning - nonlinear classical models) - Cells around HistGradientBoostingRegressor with categorical_features=[0]: binned training with a native categorical slot.

**Focus**

- Learn the name map, in XGBoost, LightGBM and CatBoost order: step size is eta, learning_rate and learning_rate; rows are subsample, bagging_fraction and subsample; columns are colsample_bytree per tree, feature_fraction per tree and rsm per split (alias colsample_bylevel); L2 is lambda, lambda_l2 and l2_leaf_reg.
- Defaults that bite: XGBoost eta 0.3 against LightGBM 0.1, CatBoost 1000 iterations with a rate it picks itself for the common losses, LightGBM bagging off until bagging_freq passes 0, LightGBM growing leaf-wise to num_leaves 31 with no depth limit (max_depth -1), and CatBoost symmetric trees at depth 6.
- Early stopping differs per library: XGBoost takes early_stopping_rounds with eval_set and predicts from the best iteration, LightGBM takes early_stopping_round or the early_stopping callback with a validation set, CatBoost takes eval_set with use_best_model, and HGBT stops by itself only above 10000 rows.
- Categorical handling differs too: CatBoost takes raw categories with ordered target statistics and one-hot encodes only features with at most one_hot_max_size values (2 by default), LightGBM takes integer-coded categorical_feature columns, and XGBoost takes pandas category columns with enable_categorical=True on the hist or approx tree method.

**Reproduce:** Closed-book, write the 200-round learning-rate 0.05 depth-4 row and column 0.8 L2 1.0 early-stopped configuration for all four libraries, then correct every name and default against the docs. Run the HGBT version (max_iter 200, learning_rate 0.05, max_depth 4, l2_regularization 1.0, early_stopping=True, random_state 0) on make_moons(n_samples=2000, noise=0.25, random_state=0): it runs all 200 iterations because its internal validation score is still improving, and scores 0.955 on the data it was fit on (sklearn 1.9.1).

**Traps**

- num_leaves 31 with max_depth 4 cannot grow 31 leaves: depth caps the tree at 16 leaves, so set both consistently instead of copying the default.
- bagging_fraction 0.8 alone changes nothing in LightGBM. Bagging stays off until bagging_freq is set above 0.
- Copying n_estimators 100 into CatBoost without setting the learning rate silently swaps the shrinkage regime, since CatBoost defaults to 1000 iterations with an automatic rate.

**Practice**

- The section mini-project covers this: configured XGBoost, LightGBM and CatBoost runs with early stopping compared under fixed splits in the family-choice defense.

**Stop when:** You write all four configurations from memory with correct names, state each default you overrode, and your HGBT run matches the reference iteration count and accuracy.

<details>
<summary>Self-test</summary>

1. What are the default step sizes in XGBoost, LightGBM and CatBoost?
   - XGBoost eta 0.3 and LightGBM learning_rate 0.1. CatBoost picks the rate automatically for Logloss, MultiClass and RMSE, from the iteration count, and uses 0.03 otherwise.
2. Name the row-sampling parameter in each of the three libraries and any enabling switch.
   - XGBoost subsample; LightGBM bagging_fraction, which needs bagging_freq above 0; CatBoost subsample, 0.8 under the default MVS bootstrap on CPU, while multiclass defaults to the Bayesian bootstrap.
3. Should low-cardinality string columns be one-hot encoded for CatBoost?
   - No. Pass them as categorical features and let ordered target statistics handle them; CatBoost one-hot encodes only features with at most one_hot_max_size values, 2 by default.
4. When does sklearn HGBT stop early without an explicit validation set?
   - With early_stopping auto, which is the default, it reserves validation internally on data above 10000 rows. Smaller data runs the full max_iter unless validation is passed.

</details>

#### U5. k-nearest neighbors, search cost and the curse of dimensionality

**About 3 h** · **Target:** Implement + Measure

Topics: k-nearest neighbors, distance, weighting and feature scale; Neighbor search cost and the curse of dimensionality

kNN is the purest similarity classifier: no training, all geometry. It punishes unscaled features and high dimensions faster than any other family, which makes it the ideal instrument for learning scale discipline.

**You can now**

- Implement brute-force kNN with uniform and distance weights and match sklearn predictions including a distance tie.
- Explain how neighborhood size, weighting and feature scale move bias, variance and cost, and when trees lose to brute force.
- Measure distance concentration and search time as dimension grows and state the scaling policy you would ship.

**Study**

1. [Murphy Chapter 16: KNN and the curse of dimensionality](https://github.com/probml/pml-book/releases/latest/download/book1.pdf) (Probabilistic Machine Learning, Chapter 16: exemplar-based methods) - Sections 16.1 to 16.1.3 (pp. 547 to 550): the KNN decision rule, the curse of dimensionality with the growing-hypercube example, and k-d trees, hashing and approximate search for speed.
2. [sklearn neighbors: classification, regression and weights](https://scikit-learn.org/stable/modules/neighbors.html#nearest-neighbors-classification) (scikit-learn - neighbors, SVMs, trees and ensembles) - 1.6.2 Classification and 1.6.3 Regression: n_neighbors default 5, uniform versus distance weights, and the regressor averaging rule.
3. [sklearn neighbor search algorithms and cost](https://scikit-learn.org/stable/modules/neighbors.html#nearest-neighbor-algorithms) (scikit-learn - neighbors, SVMs, trees and ensembles) - 1.6.4 Nearest Neighbor Algorithms: brute force against K-D and ball trees, the auto-selection rule with leaf_size 30, and when high dimension or sparse input falls back to brute force.

**Focus**

- The vote is a majority under uniform weights and an inverse-distance vote under distance weights. On the toy, query 2.5 has x = 0 and x = 5 tied for third place. sklearn warns that such ties depend on training order: in the given order x = 0 joins, so uniform predicts 0 and distance weights give 1 at probability 0.652; reorder the rows and x = 5 joins, so uniform predicts 1.
- Scale is the model. With an informative feature on [0, 1] (label x0 > 0.5) and a nuisance feature on [0, 1000], 5-NN scores 0.47 unscaled and 0.995 standardized (400 train and 200 test points, seed 0). Standardize inside a Pipeline so test data meets the same transform.
- Distances concentrate fast: for 50 uniform points in the unit cube, the (max - min)/min ratio of pairwise distances falls from 101.9 at d = 2 to 0.13 at d = 1000, so fixed neighborhoods stop being local.
- Trees win at low dimension and lose at high dimension. Timing fit plus 200 queries at k = 5 on n = 20000 uniform points: at d = 5 ball tree takes 0.007 seconds against brute 0.02, while at d = 50 brute takes 0.007 against KD 0.196 (one run on an i9-12900K, sklearn 1.9.1).

**Reproduce:** From a blank file, implement brute-force kNN with uniform and distance weights and match sklearn on X = [0, 1, 2, 5, 6] with y = [0, 0, 1, 1, 1] at query 2.5 and k = 3. Make your tie rule explicit (lower training index wins), then reorder the training rows and show sklearn's uniform answer flip from 0 to 1. Rerun the scaling pair and report 0.47 unscaled against 0.995 standardized.

**Traps**

- Tuning k on train error always picks k = 1. Memorization looks perfect and generalizes worst, so tune k by cross-validation.
- Scaling before the split leaks test ranges into the train transform. Fit the scaler on train only and apply it to test.
- algorithm auto is not a promise of trees. Sparse input, high dimension or k above half of n silently selects brute force, so confirm with timing rather than the parameter name.

**Practice**

- [HoML Chapter 3, Exercise 1: MNIST classifier above 97 percent](https://github.com/ageron/handson-mlp/blob/main/03_classification.ipynb) - Exercise solutions, Exercise 1: grid search KNeighborsClassifier over weights and n_neighbors on MNIST past 97 percent test accuracy. Fit on the standard train split and score the held-out test set. Narrow the grid before running it at full size.

**Stop when:** Your kNN matches sklearn on the toy including the tie, your scaling rerun shows the collapse and the recovery, and the MNIST grid clears 97 percent.

<details>
<summary>Self-test</summary>

1. At query 2.5 with k = 3, which third neighbor joins x = 2 and x = 1, and what does uniform voting predict?
   - x = 0 and x = 5 tie at distance 2.5. In the given order sklearn takes x = 0, so votes are 1, 0, 0 and uniform predicts 0; with the rows reordered it takes x = 5 and predicts 1. A tie at the k-th place makes the answer depend on data order, so state your rule.
2. Why does the unscaled toy score 0.47 while the standardized one scores 0.995?
   - The nuisance feature spans 1000x the informative one, so Euclidean neighborhoods are chosen by noise. Standardizing restores the informative axis.
3. The concentration ratio reads 101.9 at d = 2 and 0.13 at d = 1000. What breaks for kNN?
   - Relative distance contrasts vanish, so the nearest and farthest points sit almost equally far. Fixed-k neighborhoods cover non-local regions and the vote carries little signal.
4. At n = 20000 and d = 50, which search algorithm wins and why?
   - Brute force at 0.007 seconds against 0.196 for KD-tree. Partitioning overhead and dimensionality defeat the trees while blocked matrix distance stays cheap.

</details>

#### U6. Support vector machines: margins, hinge loss and slack

**About 4 h** · **Target:** Derive

Topics: Hard and soft margins, hinge loss, slack and support vectors

The margin turns classification into geometry with a price list: violations cost C, dimensions cost kernels, probabilities cost calibration. Every later kernel and calibration discussion assumes this pricing.

**You can now**

- Derive the hard-margin width 2 over ||w||, the hinge loss and the slack budget, and connect C to margin width and support-vector count.
- Classify any training point as support vector or not from its margin position and read dual coefficients on a toy.
- Defend scaling, C choice and LinearSVC-versus-SVC selection from measurements, and state what SVC probabilities mean in sklearn 1.9.

**Study**

1. [ISLP Chapter 9: maximal margin and support vector classifiers](https://hastie.su.domains/ISLP/ISLP_website.pdf.download.html) (ISLP - tree-based methods and support vector machines) - Sections 9.1 and 9.2 (pp. 367 to 376): hyperplanes, the maximal margin classifier, the non-separable case, and the SVC optimization with C, slack variables and support vectors.
2. [ISLP Chapter 9: multiclass extensions and the hinge loss](https://hastie.su.domains/ISLP/ISLP_website.pdf.download.html) (ISLP - tree-based methods and support vector machines) - Sections 9.4 and 9.5 (pp. 383 to 386): one-versus-one against one-versus-all, and the Loss plus Penalty form with hinge versus logistic loss.
3. [HoML Appendix C: linear and soft-margin SVMs](https://github.com/ageron/handson-mlp/blob/main/Appendix_C_support_vector_machines.ipynb) (Hands-On Machine Learning - nonlinear classical models) - Linear SVM Classification, Soft Margin Classification, Under the hood with the hinge plots, and the LinearSVC versus SVC versus SGDClassifier exercise.
4. [sklearn SVM: classification, imbalance and probabilities](https://scikit-learn.org/stable/modules/svm.html#svm-classification) (scikit-learn - neighbors, SVMs, trees and ensembles) - 1.4.1 Classification with 1.4.1.2 Scores and probabilities and 1.4.1.3 Unbalanced problems. Depth: The probability=True path is deprecated in sklearn 1.9 and warns with FutureWarning toward removal in 1.11. A default SVC has no predict_proba; use CalibratedClassifierCV with SVC and ensemble False for probabilities.
5. [sklearn SVM: tips, complexity and math](https://scikit-learn.org/stable/modules/svm.html#tips-on-practical-use) (scikit-learn - neighbors, SVMs, trees and ensembles) - 1.4.5 Tips on practical use (scale features, C default 1.0, cache_size) with 1.4.4 Complexity and 1.4.7 Mathematical formulation.
6. [ISLP lab: support vector classifier cost demo](https://github.com/intro-stat-learning/ISLP_labs/blob/main/Ch09-svm-lab.ipynb) (ISLP - tree-based methods and support vector machines) - Support Vector Classifier: C 10 versus C 0.1 on the 2D example with wider margin and more support vectors at small C, then grid search selecting C 1 at 0.74 CV accuracy.

**Focus**

- The gutter constraints fix the margin width at 2 over ||w||. The toy gives w = 1, b = 0, width 2.0, support vectors at x = -1 and x = 1 with dual coefficients -0.5 and 0.5. Only points on or inside the margin enter the solution.
- C is the violation budget. On negatives at -2, -1 and 2.4 and positives at 0.5, 1 and 2, C 0.05 gives width 9.756 with all 6 points as support vectors, while C 100 gives width 2.0 with 4. Train accuracy is 5 of 6 at both, because the point at 2.4 breaks linear separability.
- Hinge loss is exactly 0 past the margin, so safe points vanish from the fit. Logistic loss never reaches 0, so every point keeps pulling, which is why only support vectors matter for the SVC.
- Scale before fitting. With features on [0, 1] and [0, 100] and the label x0 + x1/100 > 1, a default RBF SVC scores 0.75 unscaled against 0.97 standardized (200 train and 100 test points, seed 2). SVC defaults to RBF with gamma scale and C 1.0; LinearSVC defaults to squared_hinge and exposes no support vectors.

**Reproduce:** Derive the width 2 over ||w|| from the plus-minus-1 gutter constraints. Solve X = [-2, -1, 1, 2] with y = [0, 0, 1, 1] by hand to w = 1, b = 0 with support vectors at -1 and 1, and confirm with SVC and kernel linear at large C.

**Traps**

- Promising SVC probabilities from older tutorials now warns in sklearn 1.9 and disappears in 1.11. Never ship predict_proba without the calibrator wrapper.
- Reusing a C value between SVC and LinearSVC. LinearSVC uses squared hinge and, through liblinear, also regularizes the intercept, so the same C gives a different model; compare decisions, not parameter values.
- Skipping scaling is the classic SVM bug. Gamma and the margin both assume comparable units, and the mixed-scale example loses 22 points of accuracy without it.

**Practice**

- [Deep-ML 21: Pegasos Kernel SVM Implementation](https://www.deep-ml.com/problems/21) - Implement deterministic pegasos_kernel_svm; the visible tests check ([2.0, 2.0, 6.0, 1.0], 36.2027) for linear and ([1.0, 1.0, 1.0, 1.0], 0.0) for RBF with sigma 0.5. Labels are plus-minus 1. The update rule is in the problem's learn section: follow it literally, updating alpha_i and b in place sample by sample within each iteration (a batch update fails test one), with the RBF kernel exp(-||x - y||^2 / (2 sigma^2)). Note that eta_t lambda is 1 at t = 1, so that step resets every alpha.

**Stop when:** You derive the width, reproduce the toy coefficients, predict the C effect before running, and problem 21 passes.

<details>
<summary>Self-test</summary>

1. For w = [1] and b = 0, what is the margin width and which toy points are support vectors?
   - Width 2.0 with support vectors at x = -1 and x = 1, carrying dual coefficients -0.5 and 0.5.
2. C 0.05 gives width 9.756 with 6 support vectors while C 100 gives width 2.0 with 4. Explain both changes.
   - Small C tolerates violations, so the margin grows wide and every point sits on or inside it. Large C punishes violations, so the margin narrows onto 4 points.
3. A 4-class problem goes to SVC. How many internal classifiers fit, and what does decision_function_shape ovr change?
   - Six one-versus-one pairs fit inside libsvm. The ovr shape only reshapes the output scores, not the fits.
4. A far-correct point contributes what to hinge versus logistic loss, and what follows for sparsity?
   - Exactly 0 to hinge and a small positive amount to logistic. Hinge lets safe points drop out of the solution, leaving support vectors only.

</details>

#### U7. Kernels, bandwidth and kernel matrix cost

**About 3 h** · **Target:** Derive + Measure

Topics: Polynomial and RBF kernels, bandwidth and similarity geometry; Kernel matrix time and memory cost

Kernels buy nonlinearity without paying for explicit features, then charge it back as a dense n-by-n matrix. The same similarity-versus-cost trade returns in every neighbor and attention method.

**You can now**

- Derive the kernel-trick substitution with the polynomial and RBF forms, and predict how degree and gamma move bias and locality.
- Explain the RBF similarity geometry: far points contribute near zero and gamma sets the meaning of far.
- Measure kernel matrix time and memory scaling and state the largest n you would run dense.

**Study**

1. [ISLP Chapter 9: kernels and the radial basis function](https://hastie.su.domains/ISLP/ISLP_website.pdf.download.html) (ISLP - tree-based methods and support vector machines) - Sections 9.3.1 and 9.3.2 (pp. 377 to 382): feature enlargement, the kernel trick with equations 9.18 to 9.23, the polynomial kernel 9.22, the radial kernel 9.24 and gamma locality.
2. [HoML Appendix C: polynomial, similarity and RBF kernels](https://github.com/ageron/handson-mlp/blob/main/Appendix_C_support_vector_machines.ipynb) (Hands-On Machine Learning - nonlinear classical models) - Polynomial Kernel, Similarity Features with the gaussian_rbf gamma 0.3 cells, Gaussian RBF Kernel with the gamma and C grid, Under the hood.
3. [sklearn SVM kernel functions and RBF parameters](https://scikit-learn.org/stable/modules/svm.html#kernel-functions) (scikit-learn - neighbors, SVMs, trees and ensembles) - 1.4.6 Kernel functions with 1.4.6.1 Parameters of the RBF Kernel: C for smoothness against gamma for influence, with exponential grid search over both.
4. [sklearn SVM complexity](https://scikit-learn.org/stable/modules/svm.html#complexity) (scikit-learn - neighbors, SVMs, trees and ensembles) - 1.4.4 Complexity: libsvm quadratic to cubic in n with cache dependence, against near-linear LinearSVC.
5. [ISLP lab: nonlinear support vector machines](https://github.com/intro-stat-learning/ISLP_labs/blob/main/Ch09-svm-lab.ipynb) (ISLP - tree-based methods and support vector machines) - 9.6.2 Support Vector Machine: the radial kernel at gamma 1 and C 1e5 overfitting, then the C and gamma grid choosing C 1 and gamma 0.5; 9.6.3 ROC Curves: the tuned model against gamma 50 on training and test data.

**Focus**

- The trick replaces every inner product with K, so f(x) equals bias plus a sum of alpha_i K(x, x_i) over support vectors only. The RBF form exp(-gamma ||x - z||^2) makes far points contribute near zero, which is what locality means.
- Gamma sets the ruler: large values spike the similarity and overfit, small values smooth everything toward underfit. The HoML grid crosses gamma 0.1 with 5 against C 0.001 with 1000 to show both failures.
- gamma scale equals 1 over (n_features times X.var()), verified exactly against sklearn internals. It is data-dependent, so rescaling silently retunes the kernel.
- The Gram matrix holds n^2 floats: 10000 rows in float64 need 763 MiB. Measured on the reference i9 CPU under sklearn 1.9.1, n = 1000 takes 0.025 seconds and 7.6 MiB while n = 4000 takes 0.171 seconds and 122.1 MiB.

**Reproduce:** Hand-compute the Deep-ML 280 first test with gamma 0.5: exp(-4) = 0.0183 and exp(-1) = 0.3679 give [[1.0, 0.0183], [0.3679, 0.3679]]. Verify against pairwise.rbf_kernel, then time the Gram matrix at n = 1000 and n = 4000 and confirm the 16x memory step.

**Traps**

- sklearn gamma is 1 over 2 sigma^2, not sigma. Porting sigma 0.5 from problem 21 means setting gamma 2.0.
- Kernel methods inherit the scaling requirement twice: distances and gamma both assume comparable units.
- Tiny gamma makes every point similar to every other through a near-constant Gram matrix and underfits. Read the grid, never the default alone.

**Practice**

- [Deep-ML 280: Implement RBF (Gaussian) Kernel Function](https://www.deep-ml.com/problems/280) - Implement rbf_kernel(X1, X2, gamma); the visible tests check the 2x2 gamma 0.5 matrix and the 1x1 gamma 1.0 case at 4 decimals. Use the squared-norm identity with no Python loops. Identical inputs must give exactly 1.0 on the diagonal.

**Stop when:** You reproduce the test matrix by hand, your timings show the quadratic memory step, and problem 280 passes.

<details>
<summary>Self-test</summary>

1. Write the RBF matrix for X1 = [[0, 0], [1, 1]] against X2 = [[0, 0], [2, 2]] at gamma 0.5.
   - Squared distances are 0, 8, 2 and 2, so the matrix is [[1.0, 0.0183], [0.3679, 0.3679]].
2. How much memory does a float64 Gram matrix need at n = 10000, and about how many rows fill 16 GiB?
   - 10000^2 times 8 bytes = 763 MiB. 16 GiB holds about 46000 rows, since 46000^2 times 8 bytes is near 15.8 GiB.
3. Same data, gamma 5 versus gamma 0.1. Which risks overfitting and why?
   - Gamma 5: similarity decays within tiny radii, so each point predicts itself and noise becomes boundary. Gamma 0.1 smooths distant points together and risks underfitting.
4. Why not expand RBF features explicitly instead of using the kernel?
   - The RBF expansion is infinite-dimensional. The kernel evaluates that inner product in closed form from pairwise distances.

</details>

#### U8. Feature importance caveats and class weighting effects

**About 3 h** · **Target:** Explain + Measure

Topics: Feature importance caveats under correlation and cardinality; Class weighting and resampling effects on probability semantics

Importance rankings and weighted losses drive real decisions about features and thresholds. Both silently change meaning under correlation, cardinality and imbalance, so this unit teaches the distrust they deserve.

**You can now**

- Contrast impurity, permutation and gain-based importance and predict when each misleads.
- Measure impurity dilution under correlation and permutation stability across seeds on one dataset.
- Explain how class weighting and resampling move recall, thresholds and probability semantics, and when to recalibrate.

**Study**

1. [sklearn forest feature importance evaluation](https://scikit-learn.org/stable/modules/ensemble.html#feature-importance-evaluation) (scikit-learn - neighbors, SVMs, trees and ensembles) - 1.11.2.5 Feature importance evaluation: mean decrease in impurity, the train-only and high-cardinality flaws, the permutation alternative, and scores summing to 1.0.
2. [HoML Chapter 6: feature importance in practice](https://github.com/ageron/handson-mlp/blob/main/06_ensemble_learning_and_random_forests.ipynb) (Hands-On Machine Learning - nonlinear classical models) - Feature Importance: the iris importance ranking loop and the MNIST pixel importance heatmap.
3. [ISLP Chapter 8: random forests and variable importance](https://hastie.su.domains/ISLP/ISLP_website.pdf.download.html) (ISLP - tree-based methods and support vector machines) - Section 8.2.1, Variable Importance Measures with Figure 8.9 (pp. 345 to 346): mean-decrease-Gini importance; then Section 8.2.2 (pp. 346 to 347): the decorrelation rationale with m near sqrt(p).
4. [sklearn SVM unbalanced problems](https://scikit-learn.org/stable/modules/svm.html#unbalanced-problems) (scikit-learn - neighbors, SVMs, trees and ensembles) - 1.4.1.3 Unbalanced problems: class_weight multipliers including the balanced mode.
5. [HoML Chapter 3: precision and recall tradeoff](https://github.com/ageron/handson-mlp/blob/main/03_classification.ipynb) (Hands-On Machine Learning - nonlinear classical models) - Precision/Recall Trade-off: retuning the decision threshold with precision_score and recall_score instead of trusting 0.5.

**Focus**

- Impurity importance multiplies split impurity decrease by sample fraction, averages over trees and normalizes to 1. It is computed on train statistics and favors many-unique-value features, so treat it as a hypothesis, not a verdict.
- Correlated features break both rankings. With x0 uniform, a near-copy x1 = x0 plus 0.01 noise, a noise column and the label x0 > 0.5, a 200-tree forest splits impurity importance 0.498 and 0.498, while held-out permutation gives x0 0.511 and x1 0.0. Every tree needs an x0 split to finish the boundary, so x0 rescues points that a shuffled x1 misroutes but not the reverse. Yet x1 alone still scores 0.995: zero permutation importance does not mean useless.
- class_weight balanced multiplies by n over (2 times class count), here [0.546, 5.957] at 8.5 percent prevalence (two standard-normal features, label x0 + x1 + 0.5 noise > 2, n 4000, 30 percent test split, seed 0). Recall rises 0.64 to 0.95 while mean predicted probability doubles from 0.082 to 0.171 against a true rate of 0.086: weighting buys recall with miscalibration.
- After weighting or resampling, 0.5 is no longer the neutral threshold. Retune it on held-out data or recalibrate before shipping decisions.

**Reproduce:** Rerun the twin-plus-noise demo (2000 points, seed 0, 30 percent test split, 200 trees at seed 0) and report impurity [0.498, 0.498, 0.004] with permutation [0.511, 0.0, 0.0] at spread 0.017 on held-out data; then drop x0 and show x1 alone scores 0.995. Rerun the 8.5-percent-prevalence logistic pair and report the recall gain with the doubled mean probability.

**Traps**

- feature_importances_ sums to 1.0, so ranks are relative: dropping a feature redistributes its mass and reshuffles the rest.
- Permutation on train rewards overfit. Run it on held-out data with several repeats and report the spread, not just the mean.
- Resampling to 50/50 then deciding at 0.5 exports the sampler prior. Keep original priors, recalibrate, or move the threshold explicitly.

**Practice**

- [HoML Chapter 6: importance versus permutation reconstruction](https://github.com/ageron/handson-mlp/blob/main/06_ensemble_learning_and_random_forests.ipynb) - Feature Importance section: rerun the iris RandomForestClassifier ranking loop, then add permutation_importance on held-out data with 10 repeats. Explain one disagreement between the two rankings from correlation or cardinality. Skip the MNIST heatmap; the iris contrast is the exercise.

**Stop when:** Your demo matches the reference impurity and permutation split, your weighting rerun shows the recall gain with the calibration cost, and you can state the threshold policy for a weighted model.

<details>
<summary>Self-test</summary>

1. Twins read 0.498 and 0.498 in impurity but 0.511 and 0.0 in permutation. What happened?
   - Trees split interchangeably on either twin, so impurity mass halves across them. The label is exactly x0 > 0.5, so every tree also needs an x0 split near the boundary: shuffling x0 breaks those splits, while x0 repairs anything a shuffled x1 misroutes. Permutation measures loss given the other features, not usefulness alone; x1 by itself scores 0.995.
2. What multipliers does class_weight balanced assign at 8.5 percent prevalence, and from what formula?
   - About [0.546, 5.957] from n_samples over (n_classes times class count). The minority multiplier is roughly the inverse prevalence ratio.
3. After weighting, mean predicted probability doubles while true prevalence stays fixed. Did accuracy necessarily improve, and what must change before deciding at 0.5?
   - Not necessarily. The weighted loss trades precision and calibration for recall, so accuracy can fall. Retune the threshold on held-out data or recalibrate the scores first.
4. A noise feature reads 0.004 impurity against 0.0 permutation. Keep or drop it?
   - Neither on one number: 0.004 of a normalized train-only score against exactly 0.0 held-out permutation says it contributes nothing measurable. Drop it only after the ablated model holds its score.

</details>

### Mini-project: Tree core, one neighbor or kernel mechanism, and a family-choice defense

**About 12 to 16 hours.** Implement a deterministic CART core with one ensemble and one neighbor or kernel mechanism in NumPy in your own repository, test them against hand cases and scikit-learn, configure the boosting libraries on one fixed split, and defend a family choice from geometry, uncertainty, interpretability, fit cost and prediction cost.

1. Build the CART core: Gini and entropy impurity, an exhaustive split scan with a stated threshold and tie rule, growth limits (max_depth, min_samples_leaf) and prediction. Match hand cases, then DecisionTreeClassifier predictions on tie-free data with matching limits.
2. Prune by cost complexity: take the alpha path and choose alpha by cross-validation on the training split only.
3. Add bagging or a random forest over your core. Show validation error and its spread over seeds against the number of trees, next to a single tree.
4. Add one neighbor or kernel mechanism: kNN with a stated tie rule and a scaled-versus-unscaled test, a Pegasos kernel SVM, or an RBF kernel matrix with a positive semidefinite check. Compare predictions with KNeighborsClassifier or SVC on a fixed split.
5. On one fixed tabular split, configure HistGradientBoosting and XGBoost, LightGBM and CatBoost from their parameter pages with early stopping on a validation split. State each library's categorical handling and record the best iteration, validation score, fit time and predict time.
6. Add a random high-cardinality column and compare impurity (MDI) importance with permutation importance on held-out data.
7. Defend a family choice: compare a tree, an ensemble, a boosting model, kNN and an SVM on the same split with paired uncertainty on the validation metric, plus calibration, interpretability, fit cost and prediction cost. Name the condition that would reverse the choice.

**Deliverables**

- The tree package: impurity, split search, growth limits, pruning and the ensemble, with tests.
- The neighbor or kernel mechanism with its differential tests.
- The family-choice dossier: one comparison table with paired uncertainty and costs, the boosting-library runs, the importance comparison, the decision and its tripwire.

**Checks**

- external-tests: [Deep-ML 138, 20, 307, 21 and 280](https://www.deep-ml.com/problems). Free problems with public tests. Pass the ones matching your mechanisms after your local tests do; the cards state each convention the tests pin, such as raw-value thresholds in 138 and in-place per-sample updates in 21.
- rubric: Self-grade with the rubric below.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Tree core correctness | Impurity and split search match hand cases, and predictions match scikit-learn on tie-free data. | Property tests cover ties under a documented rule, and depth and leaf limits reproduce scikit-learn's node counts. |
| Ensemble | The ensemble lowers validation error or its spread over seeds compared with one tree. | An out-of-bag estimate tracks a held-out estimate, and the report explains any gap. |
| Neighbor or kernel mechanism | Predictions match scikit-learn on a fixed split. | Tests cover feature scaling and a tie or degenerate-kernel case. |
| Boosting configuration | HistGradientBoosting and at least one of XGBoost, LightGBM or CatBoost run with early stopping and stated categorical handling. | All three external libraries run, and the report explains the learning-rate and iteration tradeoff from the recorded best iterations. |
| Family-choice defense | One table reports the metric with paired uncertainty, fit time and predict time for each family. | The choice survives a small change in the best score, and the report names the condition that would reverse it. |

Feeds into: Milestone artifact 2, the mechanisms suite: the deterministic tree core, the ensemble and the kNN or kernel model come from here. The family-choice comparison feeds the decision dossier.

### Resource route

- **Primary - Implementation:** [Hands-On Machine Learning - nonlinear classical models](https://github.com/ageron/handson-mlp) - Use notebooks 03, 05, 06 and Appendix C as the first pass through performance measures, trees, ensembles and SVMs. Vary depth, estimators, learning rate, k, C and RBF width under fixed splits.
- **Reference - Reference:** [scikit-learn - neighbors, SVMs, trees and ensembles](https://scikit-learn.org/stable/supervised_learning.html) - Check official estimator constraints, complexity, preprocessing needs, missing-value behavior and probability caveats. Do not use library calls as the mechanism implementation.
- **Required - Theory:** [ISLP - tree-based methods and support vector machines](https://www.statlearning.com/) - Use Chapters 8 and 9 with their Python labs for the statistical account of trees, bagging, random forests, boosting and SVMs that the notebooks leave implicit, and for model-choice and feature-importance arguments.
- **Support - Practice:** [Deep-ML - tree, ensemble and kernel problems](https://www.deep-ml.com/problems) - Use 138 Best Gini-Based Split, 20 Decision Tree Learning, 307 Bagging Classifier, 21 Pegasos Kernel SVM and 280 RBF Kernel as unit checks after the local implementation passes. Their tests were read in review; each card states what they pin, including tie and update-order conventions.
- **Support - Theory:** [Probabilistic Machine Learning, Chapter 16: exemplar-based methods](https://github.com/probml/pml-book/releases/latest/download/book1.pdf) - Read Sections 16.1 to 16.1.3 for the KNN decision rule, the curse of dimensionality with the growing-hypercube example, and the speed section on k-d trees, hashing and approximate search.
- **Reference - Reference:** [XGBoost parameters and sklearn estimator interface](https://xgboost.readthedocs.io/en/stable/parameter.html#parameters-for-tree-booster) - Read the tree-booster parameter list for eta, depth, sampling and regularization names and defaults, and the sklearn page for early stopping with eval_set.
- **Reference - Reference:** [LightGBM parameters](https://lightgbm.readthedocs.io/en/latest/Parameters.html#learning_rate) - Read learning_rate, num_leaves, max_depth, min_data_in_leaf, feature_fraction, bagging_fraction with bagging_freq, lambda_l2 and early stopping defaults.
- **Reference - Reference:** [CatBoost common parameters and categorical features](https://catboost.ai/docs/en/references/training-parameters/common#depth) - Read iterations, learning_rate, l2_leaf_reg, depth, grow_policy, subsample, rsm, boosting_type, use_best_model and one_hot_max_size defaults, plus native categorical handling.

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

### Study units

#### U1. Numeric transforms and categorical encoding

**About 4 h** · **Target:** Implement

Topics: Numeric transforms, scaling, clipping and missingness indicators; Categorical encoding, unknown categories and sparse features

Every estimator downstream sees the transformed geometry, not the raw table. A scaler fit on the wrong rows or an encoder that errors on new categories breaks serving before any model runs.

**You can now**

- Build a leakage-safe numeric and categorical preprocessing path with fitted state, unknown-category behavior and schema tests.
- Choose scaling, clipping and imputation for skewed, heavy-tailed and missing features and state what each choice hides.
- Keep sparse categorical output sparse through the pipeline and densify only where the estimator requires it.

**Study**

1. [End-to-end preprocessing: cleaning, encoding and scaling](https://github.com/ageron/handson-mlp/blob/main/02_end_to_end_machine_learning_project.ipynb) (Hands-On Machine Learning - dimensionality reduction and unsupervised learning) - Prepare the Data for Machine Learning Algorithms: Data Cleaning with SimpleImputer median and most_frequent; Handling Text and Categorical Attributes with OneHotEncoder and the sparse_output note; Feature Scaling with MinMaxScaler, StandardScaler, log transform and percentile flattening; outlier dropping with IsolationForest. Depth: Stop before Custom Transformers. Ratio, RBF-similarity and cluster-similarity features belong to the next unit.
2. [Scaling, encoding and sparse behavior](https://scikit-learn.org/stable/modules/preprocessing.html) (scikit-learn - preprocessing data) - 8.3.1 standardization with the with_mean=False sparse rule and MaxAbsScaler; 8.3.1.3 RobustScaler for outlier-heavy features; 8.3.4 OneHotEncoder handle_unknown ignore versus error, infrequent handling and sparse_output.
3. [Missing-value strategies and indicators](https://scikit-learn.org/stable/modules/impute.html) (scikit-learn - imputation of missing values) - 8.4.2 univariate median and most_frequent strategies; 8.4.6 Marking imputed values: MissingIndicator, or add_indicator=True on the imputer, to keep a missingness flag beside the imputed value; 8.4.7 which estimators accept NaN directly.

**Focus**

- Fit every statistic on training rows only, then transform the rest. Refitting on evaluation rows leaks their distribution into the features.
- OneHotEncoder with handle_unknown=ignore writes a new category as all zeros; with handle_unknown=error it raises. Pick one before serving.
- StandardScaler centers, so it densifies sparse input unless with_mean=False. MaxAbsScaler preserves sparsity.
- A missingness indicator keeps the fact of missingness after imputation fills the value. Dropping the flag assumes missingness carries no signal.

**Reproduce:** Closed-book, build a two-column pipeline on five training rows: median-impute and standardize a numeric column, one-hot encode a categorical column with handle_unknown=ignore. Transform two new rows, one with an unseen category and one with a missing number, and write the exact output rows including the all-zeros encoding.

**Traps**

- Fitting the imputer or scaler on the full data before splitting. Validation scores then reuse evaluation statistics.
- Setting sparse_output=False on a high-cardinality encoder inside a pipeline. Memory grows with rows times categories; keep sparse until an estimator needs dense.
- Reading the percentile-flattened income as deleting outliers. It remaps tails to fixed bins; the IsolationForest drop in the same notebook is a separate commented-out choice.

**Practice**

- [Hands-On Machine Learning Ch2 Exercise 6: StandardScalerClone](https://github.com/ageron/handson-mlp/blob/main/02_end_to_end_machine_learning_project.ipynb) - Exercise solutions, Exercise 6: re-implement StandardScalerClone with inverse_transform, feature_names_in_ and get_feature_names_out, then check_estimator. Implement in your own repository. check_estimator must pass and inverse_transform must round-trip within floating-point tolerance.

**Stop when:** Your clone passes check_estimator, round-trips five rows through fit_transform and inverse_transform, and your pipeline transforms unseen categories and missing values without refitting.

<details>
<summary>Self-test</summary>

1. A scaler fit on all 10,000 rows gives mean 5.2; fit on the 8,000 training rows gives 5.0. Which one goes into the pipeline, and why?
   - The training-only 5.0. The full-data mean carries evaluation rows into every transformed training value.
2. OneHotEncoder(handle_unknown=ignore) trained on [a, b] sees [c]. What row does it emit, and what does inverse_transform return for it?
   - It emits [0, 0]. inverse_transform maps all zeros back to None when no category was dropped. Verified with scikit-learn 1.9.
3. Why does StandardScaler on a CSR matrix raise unless with_mean=False?
   - Centering subtracts the mean from every entry including stored zeros, which would densify the matrix. With with_mean=False only scaling applies and sparsity survives.
4. When does an imputed column need a companion indicator column?
   - When missingness itself predicts the target, for example sensors that fail under load. The indicator keeps that signal after the value is filled.

</details>

#### U2. Interactions, feature selection and fit-state serialization

**About 4 h** · **Target:** Implement

Topics: Interactions and feature selection inside the split boundary; Fit-state serialization and sparse-to-dense hazards

Features built outside the pipeline leak across splits and drift from serving code. One saved fitted object is the only representation that both training and serving run.

**You can now**

- Assemble numeric, categorical and interaction features in one ColumnTransformer with declared remainder behavior.
- Run feature selection inside the split boundary and report the threshold with its validation effect.
- Serialize the fitted pipeline with joblib and reload it to identical predictions, including unknown categories.

**Study**

1. [Interactions, custom transformers and pipelines](https://github.com/ageron/handson-mlp/blob/main/02_end_to_end_machine_learning_project.ipynb) (Hands-On Machine Learning - dimensionality reduction and unsupervised learning) - Experimenting with Attribute Combinations for ratio features; Custom Transformers with StandardScalerClone, RBF similarity and ClusterSimilarity on latitude and longitude; Transformation Pipelines with num_pipeline, cat_pipeline using handle_unknown=ignore, and the full ColumnTransformer. Depth: Skim the KNN-regressor transformer variant in Exercise 4; keep the ClusterSimilarity pattern and the pipeline assembly.
2. [Pipeline and ColumnTransformer contracts](https://scikit-learn.org/stable/modules/compose.html) (scikit-learn - pipelines and composite estimators) - 8.1.1 Pipeline fit and transform chaining with the no-leakage rule and transformer caching; 8.1.4 ColumnTransformer for heterogeneous columns with remainder drop and fitted feature names.
3. [Selection and persistence](https://github.com/ageron/handson-mlp/blob/main/02_end_to_end_machine_learning_project.ipynb) (Hands-On Machine Learning - dimensionality reduction and unsupervised learning) - Exercise 3 SelectFromModel with threshold=0.005 in the preparation pipeline; Model persistence using joblib with the production-script pattern. Depth: Treat the 0.005 threshold as a starting point, not an optimum: the notebook reports no gain there. Skip Exercises 1, 2 and 4 here.

**Focus**

- Selection inside the pipeline is fit on training folds only. Selecting on all rows before cross-validation picks features with evaluation help.
- ColumnTransformer drops unlisted columns by default under remainder=drop. Name every kept column or set remainder explicitly.
- ClusterSimilarity and ratio features are fit state too: their centers and medians come from training rows and must serialize with the pipeline.
- joblib saves the fitted object, not the build script. Reload in a fresh process and compare predictions before trusting the artifact.

**Reproduce:** Closed-book, sketch a ColumnTransformer with a median-plus-scaler numeric path and a most-frequent-plus-one-hot categorical path, state the remainder behavior, and write the three-line joblib save, load and predict-parity check.

**Traps**

- Calling fit_transform on the test set with the same pipeline object. It refits every statistic on evaluation data; call transform only.
- Tuning the SelectFromModel threshold on the test score. The notebook run at 0.005 shows no gain; tune it under cross-validation or hold it fixed.
- Saving the model but rebuilding preprocessing by hand in serving. Any median, category list or cluster center that differs silently shifts every prediction.

**Practice**

- [Hands-On Machine Learning Ch2 Exercise 3: SelectFromModel pipeline](https://github.com/ageron/handson-mlp/blob/main/02_end_to_end_machine_learning_project.ipynb) - Exercise solutions, Exercise 3: add SelectFromModel after the preparation pipeline and evaluate. Sweep the threshold under cross-validation starting from 0.005, and keep the fitted pipeline plus the threshold in the saved artifact.
- [Hands-On Machine Learning Ch2 Exercise 5: preparation search](https://github.com/ageron/handson-mlp/blob/main/02_end_to_end_machine_learning_project.ipynb) - Exercise solutions, Exercise 5: explore preparation options with RandomizedSearchCV. Run on a small subsample. Record which preparation choice moves the validation score and keep the search inside the training split.

**Stop when:** A fresh process loads your joblib pipeline, reproduces training predictions exactly, transforms unseen categories without refitting, and your threshold choice cites a cross-validated number.

<details>
<summary>Self-test</summary>

1. Where does SelectFromModel sit relative to the cross-validation split, and what breaks if it sits outside?
   - Inside, fit on training folds only. Outside, the selector sees evaluation labels and the error estimate turns optimistic.
2. A new column appears in serving data. What does ColumnTransformer do with it?
   - It ignores it. The column list, including the remainder, is fixed at fit, so the new column is dropped even under remainder=passthrough. That is silent, so add a schema test that fails on unexpected columns.
3. A joblib reload matches old predictions, but new-category rows differ from training time. Is the artifact broken?
   - Not necessarily. handle_unknown=ignore maps new categories to all zeros by design. The parity check is identical predictions on fixed rows plus the declared unknown policy.

</details>

#### U3. PCA via SVD: directions, explained variance and sign ambiguity

**About 5 h** · **Target:** Derive + Implement

Topics: Centered PCA, SVD and principal directions; Explained variance, reconstruction error and component choice; PCA sign ambiguity and invariant tests

PCA is the baseline representation for wide tabular data and the preprocessing step inside the clustering and anomaly cards. Its signs are arbitrary, so any test that hard-codes them is wrong.

**You can now**

- Derive PCA projection, explained variance and reconstruction error from the SVD of the centered matrix.
- Implement PCA from a blank file and match scikit-learn up to sign flips and component order.
- Choose the component count from cumulative explained variance and reconstruction cost, and write tests invariant to sign.

**Study**

1. [PCA from SVD to model selection](https://github.com/ageron/handson-mlp/blob/main/07_dimensionality_reduction.ipynb) (Hands-On Machine Learning - dimensionality reduction and unsupervised learning) - PCA through Choosing the Right Number of Dimensions: manual SVD of X_centered as U S Vt, Using Scikit-Learn, Explained Variance Ratio, the cumsum rule for the component count; PCA for Compression; Randomized PCA with svd_solver and Incremental PCA. Depth: Skip Random Projection, LLE and Extra Material Kernel PCA. They return in the visualization unit or later work.
2. [PCA orientation and solvers](https://scikit-learn.org/stable/modules/decomposition.html) (scikit-learn - decomposition, clustering and outlier detection) - 2.5.1 PCA: centering without scaling, components_ orientation and the whiten option; 2.5.1.3 randomized SVD cost and the inexact inverse_transform note; 2.5.1.2 IncrementalPCA partial_fit behavior.
3. [PCA lab with scaling and sign](https://github.com/intro-stat-learning/ISLP_labs/blob/main/Ch12-unsup-lab.ipynb) (ISLP - Unsupervised Learning) - Principal Components Analysis on USArrests: scaling before PCA, scores via transform, the biplot with its y-axis reflection note, standard deviations and PVE with the scree plot.

**Focus**

- PCA centers but does not scale. Features in larger units dominate the first components; standardize first when units differ.
- Component variance is s_j squared over n-1; the ratio divides by the total. Randomized solvers approximate both.
- Component signs are arbitrary: flipping a component with its scores leaves every reconstruction unchanged. Tests must use absolute values or reconstruction error.
- The cumsum rule at 0.95 is a budget, not an optimum. Downstream error and cost decide the count.

**Reproduce:** Closed-book, center [[1,2],[3,4],[5,6]], run the SVD, and report first component [0.7071, 0.7071], singular value 4 and explained ratio 1.0. Then state the sign-flip invariant and the reconstruction from one component.

**Traps**

- Hard-coding component signs from one run. Sign conventions differ across libraries, solvers and versions; assert with abs or compare reconstructions.
- Calling PCA(n_components=0.95) a fixed dimension. It selects whatever count reaches 95 percent on the fitted data; refitting on new data can change the width.
- Using randomized-solver inverse_transform as exact. The docs note it is not the exact inverse of transform even with whiten=False.

**Practice**

- [Deep-ML 19: Principal Component Analysis Implementation](https://www.deep-ml.com/problems/19) - Problem 19: implement pca(X, k) with standardization, covariance, eigh and the stated sign rule. The two tests check k=1 components [[0.7071],[0.7071]] and [[0.7071],[-0.7071]] on small matrices. Match the sign rule exactly: the first element with absolute value above 1e-10 is made positive.

**Stop when:** Your blank-file PCA matches sklearn components up to sign and explained variance to 1e-6 on two datasets, and your tests still pass after negating any component.

<details>
<summary>Self-test</summary>

1. Why do [[1,2],[3,4],[5,6]] yield ratio 1.0 on one component?
   - Centered rows are multiples of [1,1], so the matrix has rank one. The single singular value 4 carries all variance. Verified with NumPy: s=[4,0].
2. Two runs give components [0.7,0.7] and [-0.7,-0.7] with mirrored scores. Which one is wrong?
   - Neither. A joint sign flip of a component with its scores preserves projections and reconstructions; only mixed or unmirrored comparisons fail.
3. Two features have variances 1 and 10000. What happens without scaling, and what changes with it?
   - Without scaling the first component follows the large-variance feature almost entirely. Standardizing puts both on equal footing; do it when units are arbitrary.
4. Randomized PCA reports slightly different ratios on each seed. Is that a bug?
   - No, it is an approximation. Fix the seed for reproducibility and use the exact solver when exact ratios matter.

</details>

#### U4. k-means: objective, initialization, empty clusters and instability

**About 4 h** · **Target:** Derive + Implement

Topics: k-means objective, assignment, update and initialization; Empty clusters, inertia and seed instability

k-means is the first clustering mechanism and the initializer inside Gaussian mixtures. Its objective only descends, never to a global promise, so seeds and k decide the answer.

**You can now**

- Derive the assignment and centroid updates and show each step cannot increase the inertia.
- Implement Lloyd iterations from a blank file with k-means++ seeding and a fixed iteration cap.
- Diagnose empty clusters, seed instability and k choice with inertia, silhouette and repeated runs.

**Study**

1. [k-means mechanics and k search](https://github.com/ageron/handson-mlp/blob/main/08_unsupervised_learning.ipynb) (Hands-On Machine Learning - dimensionality reduction and unsupervised learning) - K-Means through Finding the optimal number of clusters: blob demo, the max_iter assignment and update walk, Inertia, Multiple Initializations with the n_init auto rule, k-means++ seeding, elbow plot and silhouette_score with the silhouette diagram. Depth: Skim Accelerated K-Means and Mini-Batch K-Means; keep the max_iter walk and the k-search plots.
2. [k-means objective and cluster evaluation](https://scikit-learn.org/stable/modules/clustering.html) (scikit-learn - decomposition, clustering and outlier detection) - 2.3.2 K-means: inertia objective, local minima with repeated initializations, k-means++ default; 2.3.11 cluster evaluation: silhouette coefficient s=(b-a)/max(a,b) with its convex-cluster bias and the adjusted Rand index correcting for chance.
3. [k-means on simulated data](https://github.com/intro-stat-learning/ISLP_labs/blob/main/Ch12-unsup-lab.ipynb) (ISLP - Unsupervised Learning) - K-Means Clustering: K=2 separation on the simulated 50-point data with random_state, K=3 splitting behavior, and inertia_ as within-cluster sum of squares. Depth: The lab says the n_init default is 10; that predates scikit-learn 1.4. The default is now auto, one run under k-means++, which is why the lab passes n_init=20 explicitly.

**Focus**

- Each assignment step and each mean update cannot increase the inertia, so Lloyd iterations converge, usually to a local minimum. Restarts pick among minima.
- Since version 1.4 the default n_init=auto runs once under k-means++ and ten times under random init. One k-means++ run is not ten restarts.
- Inertia always falls as k grows. Read k from elbows, silhouette and repeated-seed stability, never from one inertia value.
- Empty clusters happen when a center loses every point. Know the repair: re-seed, drop, or error.

**Reproduce:** Closed-book, run one Lloyd round on [[0,0],[0,1],[5,0],[5,1]] from centers [[0,0],[5,1]]: labels [0,0,1,1], new centers [[0,0.5],[5,0.5]], inertia 2.0 down to 1.0. State why the next round cannot raise it.

**Traps**

- Comparing inertia across different k or seeds as quality. Inertia is comparable only for fixed data, fixed k and best-of-restarts.
- Assuming n_init=10 always. Under the default k-means++ the auto default is a single run; set n_init=10 explicitly when stability matters.
- Requesting more clusters than samples. scikit-learn 1.9 raises an error for n_samples=3 with n_clusters=5; it does not return empty clusters silently.

**Practice**

- [Deep-ML 17: K-Means Clustering](https://www.deep-ml.com/problems/17) - Problem 17: implement k_means_clustering(points, k, initial_centroids, max_iterations) returning centroids rounded to 4 decimals. The tests check exact centroids on a 2D two-group set and a 3D set from fixed starts. Re-derive one update by hand first, then match.

**Stop when:** Your implementation reproduces the hand round exactly, matches both Deep-ML centroid sets, and reports inertia spread across ten seeds for your k.

<details>
<summary>Self-test</summary>

1. Why do Lloyd iterations terminate?
   - Assignments are finite and the inertia never increases: neither the assignment step nor the mean update can raise the objective, so the loop ends at a fixed assignment or max_iter.
2. Two seeds give inertia 120 and 95 at k=5. Which clustering wins on the objective, and what stays unknown?
   - The 95 run wins on inertia. Whether either is near the global optimum or the right k stays unknown; check silhouette and seed spread.
3. A center gets no points in one iteration. Name two sound repairs.
   - Re-seed it at a far point such as the highest-inertia contributor, or drop it and continue with k-1. Either way record the event.
4. Silhouette prefers k=2 on two stretched blobs while the task needs subgroups. What do you do?
   - Keep the task k and justify it downstream. Silhouette rewards convex separation; it does not know the use.

</details>

#### U5. Gaussian mixtures and EM

**About 3 h** · **Target:** Derive

Topics: Gaussian mixtures, responsibilities and EM intuition

Mixtures turn distance into probability: overlapping groups get graded membership plus density scores that the anomaly unit spends.

**You can now**

- Explain responsibilities as posterior component membership and the EM loop as alternating E and M steps.
- Derive the 1D M-step updates for means, variances and weights from weighted maximum likelihood.
- Select the component count with BIC or AIC and state why a plain GaussianMixture always uses every component.

**Study**

1. [Mixture fits, covariances and component count](https://github.com/ageron/handson-mlp/blob/main/08_unsupervised_learning.ipynb) (Hands-On Machine Learning - dimensionality reduction and unsupervised learning) - Gaussian Mixtures: EM-fitted weights, means and covariances on the three-ellipsoid data with the covariance_type full, tied, spherical and diag comparison; Selecting the Number of Clusters with the BIC and AIC formulas and the minimum at k=3. Depth: Skim Bayesian Gaussian Mixture Models; variational inference is later work. Keep the BIC and AIC minimum plot.
2. [EM estimation, init and failure modes](https://scikit-learn.org/stable/modules/mixture.html) (scikit-learn - decomposition, clustering and outlier detection) - 2.1.1 Gaussian Mixture: EM E-step and M-step description, covariance options, the singularity and always-uses-all-components cons, and the BIC asymptotic note; Choice of the Initialization method with the k-means default.

**Focus**

- Responsibilities are posteriors that sum to one per point. The M-step refits each Gaussian to responsibility-weighted data.
- Likelihood rises every EM round but only to a local optimum. Starts matter; the sklearn default starts from k-means.
- Full covariance needs d(d+1)/2 parameters per component. Few points per component invite singular covariances; reg_covar (1e-6 by default) adds to the diagonal to keep them invertible.
- BIC penalizes parameters with log(m) times p. It recovers the true count only asymptotically under a true mixture; on real data it is a guide, not proof.

**Reproduce:** Closed-book, write the 1D E-step responsibility formula and the M-step updates for mean, variance with MLE denominator, and weight. Run the K=1 case on [2,4,6]: mean 4.0 and variance 8/3=2.6667.

**Traps**

- Dividing the M-step variance by n-1. Mixture MLE divides by the responsibility sum, which is n for K=1, giving 2.6667 on [2,4,6], not 4.0.
- Reading converged likelihood as a global optimum. Different starts converge differently; report spread, not one run.
- Trusting the BIC minimum as truth on misspecified data. The docs note asymptotic recovery needs data truly drawn from a mixture.

**Practice**

- [Deep-ML 341: Gaussian Mixture Model with EM Algorithm](https://www.deep-ml.com/problems/341) - Problem 341: implement fit_gmm_1d with E and M steps for n_iterations, rounding means, variances and weights to 4 decimals. Test one checks the K=1 closed form with means [4.0], variances [2.6667] and weights [1.0]; test two checks a symmetric K=2 case stays at means [0.5, 9.5] with variances [0.25, 0.25]. Derive both by hand first.

**Stop when:** You derive the K=1 numbers by hand, pass both Deep-ML tests, and can predict how tied versus full covariance changes the parameter count.

<details>
<summary>Self-test</summary>

1. What does responsibility 0.9 of point x under component 2 mean?
   - Posterior membership: under current parameters the probability is 0.9 that component 2 generated x. It is not a hard label.
2. K=1 EM on [2,4,6] gives variance 2.6667. Derive it.
   - Mean 4.0; squared deviations 4+0+4=8; MLE divides by 3. The unbiased 4.0 answers a different question.
3. Weights converge to [0.99, 0.01] on two overlapping groups. What do you conclude?
   - One component explains nearly everything. Try K=1, check BIC, and consider that the small component fits outliers.
4. Full covariance on 50 points in 10 dimensions with K=5. What breaks?
   - Each full covariance needs 55 parameters from about 10 effective points. Expect singularities; use tied or diag, regularize, or cut K.

</details>

#### U6. DBSCAN, agglomerative clustering and cluster validation

**About 4 h** · **Target:** Explain + Measure

Topics: DBSCAN and agglomerative clustering geometry; Cluster stability, usefulness and internal-metric limits

Real groups are rarely spheres. Density and merge views find moons and hierarchies that k-means smears, but their knobs decide the answer.

**You can now**

- Explain DBSCAN core, border and noise labels from eps and min_samples and linkage choices in agglomerative clustering.
- Measure eps sensitivity, linkage disagreement and seed and sample stability on one dataset.
- State what silhouette and Rand indices can and cannot justify for non-convex clusters.

**Study**

1. [DBSCAN contrast and agglomerative example](https://github.com/ageron/handson-mlp/blob/main/08_unsupervised_learning.ipynb) (Hands-On Machine Learning - dimensionality reduction and unsupervised learning) - DBSCAN: make_moons(1000, noise=0.05) at eps=0.05 (7 clusters, many points labeled -1) versus eps=0.2 (two clusters, no noise), core_sample_indices_, components_, and KNN on the cores with a 0.2 distance cutoff to label new points; Other Clustering Algorithms: AgglomerativeClustering with complete linkage on [0,2,5,8.5]. Depth: Skim the Spectral Clustering bonus code; keep the eps contrast and the linkage example.
2. [Density, linkage and metric limits](https://scikit-learn.org/stable/modules/clustering.html) (scikit-learn - decomposition, clustering and outlier detection) - 2.3.7 DBSCAN: dense definition from eps and min_samples, core, border and outlier rules, the eps-must-be-tuned warning with all-noise and merged-cluster failures; 2.3.6 hierarchical clustering: Ward, complete, average and single linkage with the uneven-size guidance; 2.3.11 metrics: silhouette formula with its convex-cluster bias and the adjusted Rand index correcting for chance.

**Focus**

- eps sets the neighborhood radius and min_samples the density floor. On the notebook moons, eps=0.05 breaks the two moons into 7 clusters and labels 7.7 percent as noise, while 0.2 finds the two moons with no noise; always sweep eps.
- Linkage defines merge distance: single follows chains, complete compacts, Ward prefers equal-variance merges. On [0,2,5,8.5] single splits off 8.5 while complete pairs neighbors.
- DBSCAN labels new points only by extra machinery: the notebook trains KNN on cores. The clusterer itself has no predict.
- Silhouette rewards dense convex separation and can punish correct density shapes. Pair it with stability and downstream checks.

**Reproduce:** Closed-book, hand-run DBSCAN with eps=2.0 and min_samples=2 on [[1,1],[1.5,1.5],[2,1],[8,8],[8.5,8.5],[9,8]]: two core groups [0,0,0,1,1,1] with no noise. Then move one point to [100,100] and show it becomes -1.

**Traps**

- Leaving eps at 0.5 on unscaled features. eps lives in feature units; scale first or the radius is meaningless.
- Calling -1 a detected anomaly set. It means not dense enough under this eps; nearby eps values relabel it.
- Reporting silhouette alone on moons. On the notebook moons a k-means split scores 0.49 and the true moon labels 0.33; the docs warn that silhouette favors convex clusters.

**Practice**

- [Deep-ML 259: Implement DBSCAN Clustering Algorithm](https://www.deep-ml.com/problems/259) - Problem 259: implement dbscan(X, eps, min_samples) with Euclidean distance and -1 noise labels. Test one checks [0 0 0 1 1 1] on two triplets; test two checks the far point becomes -1. Count the point itself toward min_samples, as scikit-learn does; with min_samples=2 test two needs that, or the pair [8,8], [8.5,8.5] turns into noise. Expand clusters from core points only.

**Stop when:** Your implementation matches both Deep-ML label vectors, your eps sweep on moons shows the noise-to-merged transition, and two linkages disagree on record with reasons.

<details>
<summary>Self-test</summary>

1. On the notebook moons, eps=0.05 gives 7 clusters and 7.7 percent noise, while eps=0.2 gives two clean moons. What went wrong at 0.05, and what does the -1 label mean?
   - The radius is too small for the sampling density. A core needs min_samples points within eps, counting itself, so sparse stretches of each moon lose their cores and the moons fragment. A -1 point is within eps of no core: not dense enough under these settings, which is not the same as anomalous.
2. Single linkage gives [0,0,0,1] and complete gives [1,1,0,0] on [0,2,5,8.5]. Which is right?
   - Both follow their definitions: single chains through small gaps, complete caps the largest within-cluster distance. The task decides which grouping is useful.
3. On the notebook moons, KMeans(2) scores silhouette 0.49 and the true moon labels score 0.33. Which clustering is better?
   - The true moons. Silhouette rewards compact convex groups, so it ranks the wrong spherical split higher. Use stability, adjusted Rand against any known structure, and downstream checks.
4. Two DBSCAN runs with close eps values disagree on 5 percent of labels. What do you report?
   - The disagreement rate and which points flip, usually borders. Stability is evidence; one label vector is not.

</details>

#### U7. Outlier and novelty detection, thresholds and representation

**About 3 h** · **Target:** Explain + Measure

Topics: Outlier versus novelty detection and threshold policy; Representation dependence of anomaly scores

Anomaly scores spend budgets: each alert costs review time. A threshold without a policy and a score without a representation note cannot be operated.

**You can now**

- Separate outlier detection on dirty training data from novelty detection on clean training data with new points.
- Set thresholds from contamination policy or score percentiles and report the implied alert rate.
- Show that every anomaly score depends on representation: scaling, PCA width and kernel change the ranking.

**Study**

1. [Density thresholds and representation-dependent anomalies](https://github.com/ageron/handson-mlp/blob/main/08_unsupervised_learning.ipynb) (Hands-On Machine Learning - dimensionality reduction and unsupervised learning) - Anomaly Detection Using Gaussian Mixtures: the 2 percent density rule via percentile on score_samples; Exercises 12 and 13: GMM on PCA-reduced Olivetti faces with sampling and rotated, flipped and darkened anomaly checks, plus the PCA reconstruction-error detector.
2. [Novelty versus outlier contract and detectors](https://scikit-learn.org/stable/modules/outlier_detection.html) (scikit-learn - decomposition, clustering and outlier detection) - 2.7 Novelty and Outlier Detection: outlier versus novelty definitions, contamination, offset_, decision_function sign and predict labels; 2.7.2 novelty prediction on new data; 2.7.3 EllipticEnvelope robust covariance, IsolationForest path lengths and LOF local density with its fit_predict-only default; 2.7.4 novelty detection with LOF (novelty=True).

**Focus**

- Outlier methods fit on polluted data; novelty methods fit on clean data and judge new points. LOF with novelty=False has no predict for new data; refit with novelty=True.
- contamination sets the score cutoff as a percentile through offset_. It declares the alert rate; it does not discover it.
- IsolationForest isolates with random feature splits; anomalies need fewer splits. In the paper's score, near 1 means anomaly, well below 0.5 means normal, and all scores near 0.5 mean no distinct anomaly; scikit-learn's score_samples returns the negative. Trees stop at depth ceil(log2(n)) for n samples per tree.
- Rescale or re-encode and the ranking changes: LOF neighborhoods, elliptic envelopes and GMM densities all live in the given coordinates.

**Reproduce:** Closed-book, fit IsolationForest with contamination=0.25 and random_state=42 on [[0],[0.1],[0.2],[10.0]]: predict gives [1,1,1,-1] with only the last decision_function negative. State the implied alert rate and why the cutoff is a policy.

**Traps**

- Tuning contamination until the known incident appears, then reporting the hit as detection. The threshold was fit to the answer; hold it fixed or cross-check on other windows.
- Calling LOF fit_predict on a deployment batch. With novelty=False the batch is judged against itself, not against clean history, and predict does not exist. Fit on clean data with novelty=True, then call predict on new points.
- Comparing raw score_samples across models or scalings. Scores are model-and-coordinate specific; compare ranks or calibrated alert rates.

**Practice**

- [Deep-ML 367: Implement Isolation Forest for Anomaly Detection](https://www.deep-ml.com/problems/367) - Problem 367: implement isolation_forest(X, n_trees, sample_size, random_state) with random feature and uniform-split trees, depth cap ceil(log2(sample_size)) and BST-normalized scores. The tests check rounded score vectors on a 5-point set with one outlier at random_state=42 and a tight cluster at random_state=123. They match only the learn section's recipe taken literally: np.random.seed, legacy np.random calls, and c(n) = 2(ln(n-1) + 0.5772156649) - 2(n-1)/n for every leaf size above 1, so c(2) is about 0.154. The paper and scikit-learn set c(2) = 1, which fails these vectors; note that difference rather than treating it as a bug.

**Stop when:** You match both Deep-ML score vectors, reproduce the [1,1,1,-1] contamination demo, and can flip a detector between outlier and novelty setups with the right predict calls.

<details>
<summary>Self-test</summary>

1. Training data is clean and the task judges next week points. Outlier or novelty setup?
   - Novelty: fit on clean history and predict new points. An outlier setup would fit the polluted batch including the points under test.
2. contamination=0.25 on 100 training points. How many train alerts, and what does offset_ do?
   - About 25: offset_ is the score percentile implementing that rate. It does not estimate the true anomaly fraction.
3. Standardizing a skewed sensor channel shuffles LOF rankings. Is that a bug?
   - No. LOF compares local densities in the given units; rescaling rewrites every neighborhood. Record scaling as part of the detector.
4. A GMM 2 percent rule flags a new batch at 9 percent. What do you report?
   - The flag rate rose from 2 to 9 percent, 4.5 times, under a fixed threshold. Report the shift with counts and slices before touching the threshold.

</details>

#### U8. t-SNE and UMAP as guarded exploratory views

**About 2 h** · **Target:** Explain

Topics: t-SNE and UMAP for guarded exploratory visualization

Embeddings are maps for the eyes, not measurements. Unlabeled shapes become false findings unless every knob is recorded and every shape is re-tested.

**You can now**

- Explain what t-SNE preserves in local neighborhoods and what it distorts in global distances, densities and cluster sizes.
- Run t-SNE and UMAP with fixed seeds, scaled input and recorded perplexity, n_neighbors and min_dist.
- Refuse semantic claims from embedding shapes without stability and downstream checks.

**Study**

1. [t-SNE runs and method comparison](https://github.com/ageron/handson-mlp/blob/main/07_dimensionality_reduction.ipynb) (Hands-On Machine Learning - dimensionality reduction and unsupervised learning) - LLE section with the Swiss-roll TSNE comparison using init random and learning_rate auto; Exercise 10: t-SNE on the first 5,000 MNIST digits with digit and class-image scatterplots, then the PCA, LLE and MDS comparison. Depth: Keep the exercise small: 5,000 points as written, not the full 70,000. The notebook warns that its MDS cells take 10 to 30 minutes; skip them or run on a subsample. Skip the Kernel PCA extra material.
2. [t-SNE behavior and practical tips](https://scikit-learn.org/stable/modules/manifold.html) (scikit-learn - decomposition, clustering and outlier detection) - 2.2.9 t-SNE: local-structure focus, KL non-convexity with seed dependence, global-structure warning, PCA init mitigation, Barnes-Hut limits, perplexity and learning-rate guidance; 2.2.10 practical tips: scale features first and reconstruction error for dimension choice.
3. [UMAP usage and parameters](https://umap-learn.readthedocs.io/en/latest/basic_usage.html) (UMAP - basic usage and parameters) - Penguin data: StandardScaler before fit_transform; Digits data: fit with random_state=42, then transform on the same data, which equals embedding_. Depth: Stay in 2D exploratory views. Skip the Bokeh hover plot.
4. [UMAP parameters](https://umap-learn.readthedocs.io/en/latest/parameters.html) (UMAP - basic usage and parameters) - n_neighbors: the local versus global tradeoff; min_dist: how tightly points pack. Depth: Skip the n_components and metric sections.

**Focus**

- t-SNE minimizes KL between neighborhood probabilities; the objective is non-convex, so seeds differ. Record the seed and try more than one.
- Perplexity sets the effective neighbor count; n_neighbors trades local detail for global shape; min_dist packs or spreads the plot. None of them is a cluster count.
- sklearn TSNE has no transform for new points; UMAP has transform. Refitting t-SNE on each new batch rebuilds the map.
- Sizes, gaps and densities on the plot are layout artifacts until stability runs and labels say otherwise.

**Reproduce:** Closed-book, list the guarded recipe: scale, fix the seed, record perplexity or n_neighbors with min_dist, run two seeds, and state two invalid readings: cluster size as population and gap width as distance.

**Traps**

- Clustering the 2D embedding and reporting the groups as found structure. The map distorts distances; validate in the original space.
- Reading big gaps as big separations. min_dist and perplexity set the spread; change them and gaps move.
- Fitting t-SNE once and shipping the picture. One seed is one local minimum; rerun and keep only stable shapes.

**Practice**

- [Hands-On Machine Learning Ch7 Exercise 10: t-SNE comparison](https://github.com/ageron/handson-mlp/blob/main/07_dimensionality_reduction.ipynb) - Exercise solutions, Exercise 10: t-SNE on the first 5,000 MNIST images with digit scatterplots, then the PCA, LLE and MDS comparison. Fix random_state, record perplexity and learning_rate, rerun with a second seed, and write which shapes persist before any interpretation. Skip the slow MDS cells or subsample first.

**Stop when:** Two seeded runs agree on the shapes you describe, every knob is recorded, and you can name two invalid readings of the plot.

<details>
<summary>Self-test</summary>

1. Two t-SNE seeds show different island counts on the same data. Which map is right?
   - Neither yet. Rerun several seeds, keep shapes that persist, and check them with labels or clustering in the original space.
2. Why scale before t-SNE or UMAP?
   - Both use neighbor distances. An unscaled large-unit feature decides every neighborhood; StandardScaler puts features on shared footing.
3. UMAP transform embeds new digits but sklearn TSNE cannot. Why?
   - UMAP keeps the fitted model and its transform places new points into the existing embedding. scikit-learn's TSNE has fit_transform but no transform, so new points need a refit that rebuilds the whole map.
4. A UMAP plot shows one class as three islands. Claim: three subtypes. Allowed?
   - As a hypothesis only. Islands can come from n_neighbors, min_dist and seed choices; test with stability runs and independent evidence.

</details>

### Mini-project: Feature pipeline, PCA and clustering with invariant-aware tests

**About 10 to 14 hours.** Build a train-only feature pipeline, implement PCA and k-means in NumPy with tests that respect sign and label-permutation invariance, then decide from stability and downstream evidence what the components, clusters or anomaly scores do and do not justify.

1. Build a ColumnTransformer pipeline with imputation plus missingness indicators, scaling and one-hot encoding with handle_unknown, fitted on train only. Add a schema test that fails on unexpected columns, and count unknown categories per batch.
2. Implement PCA through the SVD of the centered data: components, explained variance ratio, projection and reconstruction. Compare with scikit-learn PCA through sign-invariant quantities.
3. Implement k-means with k-means++ initialization. Test that inertia never rises across iterations, and compare with KMeans from the same initial centers through the adjusted Rand index, which ignores label order.
4. Add one more method with its own failure mode: a DBSCAN eps sweep on moons, or a Gaussian mixture with its covariance type and reg_covar stated.
5. Measure stability: rerun clustering over seeds and bootstrap resamples and report the adjusted Rand distribution. Choose k from stability and silhouette together, noting silhouette's bias toward convex clusters.
6. Test downstream value: feed the components or cluster ids to a supervised model on a fixed split and report the paired change.
7. Fit an anomaly detector on clean data (IsolationForest, or LOF with novelty=True), set the threshold from a stated flag-rate budget, and report the flag rate on a shifted batch with counts and slices.

**Deliverables**

- The pipeline package with its fit-state and schema tests.
- PCA and k-means implementations with sign- and permutation-invariant tests.
- The evidence report: stability distributions, the choice of k, the downstream effect, the anomaly threshold and a closing paragraph on what the results do and do not justify.

**Checks**

- external-tests: [Deep-ML 17, 19, 341, 259 and 367](https://www.deep-ml.com/problems). Free problems with public tests. Pass the ones matching your mechanisms after your local tests do; note the sign rule in 19 and the path-length convention the 367 tests require.
- rubric: Self-grade with the rubric below.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Fit state | All learned state comes from train only, and a schema test catches unexpected columns. | Unknown categories are counted per batch with an alert rule, and indicator columns survive get_feature_names_out. |
| PCA | Components and explained variance match scikit-learn up to sign. | Tests assert only sign-invariant quantities, and they pass across solvers. |
| Clustering | k-means matches scikit-learn from the same initial centers (adjusted Rand index 1 on separated blobs), and inertia never rises. | Tests are label-permutation invariant, and the second method's failure mode is shown and explained. |
| Stability and claims | Stability over seeds and resamples is reported with the chosen k. | A downstream test shows whether the clusters or components help, and the report states what they do not justify. |
| Anomaly threshold | The threshold follows from a stated flag budget on clean data. | The flag-rate change on the shifted batch is reported with counts and slices before any threshold change. |

Feeds into: Milestone artifact 2, the mechanisms suite: PCA and k-means come from here. The stability evidence feeds the decision dossier.

### Resource route

- **Primary - Course:** [Hands-On Machine Learning - dimensionality reduction and unsupervised learning](https://github.com/ageron/handson-mlp) - Use notebooks 07 and 08 for PCA, k-means, DBSCAN, agglomerative clustering, Gaussian mixtures and anomaly detection. Stop before extended semi-supervised and face-data projects.
- **Reference - Reference:** [scikit-learn - decomposition, clustering and outlier detection](https://scikit-learn.org/stable/unsupervised_learning.html) - Check decomposition orientation and solver behavior, cluster API semantics, and the distinction between novelty and outlier detection after the independent tests pass.
- **Required - Theory:** [ISLP - Unsupervised Learning](https://www.statlearning.com/) - Use Chapter 12 and its Python lab for the PCA derivations (12.2, including the low-rank approximation view and proportion of variance explained) and k-means (12.4.1), plus stability and interpretation limits, beside the notebook route.
- **Support - Practice:** [Deep-ML - unsupervised problems](https://www.deep-ml.com/problems) - Use 17 K-Means Clustering, 19 PCA, 341 Gaussian Mixture Model with EM, 259 DBSCAN and 367 Isolation Forest as unit checks after the local implementation passes. Their tests were read in review; each card states what they pin, including the 367 path-length convention.
- **Reference - Reference:** [scikit-learn - preprocessing data](https://scikit-learn.org/stable/modules/preprocessing.html) - Read 8.3.1 standardization with the sparse with_mean=False rule, 8.3.1.3 scaling data with outliers, and 8.3.4 categorical encoding with handle_unknown, infrequent and sparse_output behavior. Apply after the HOML notebook build works.
- **Reference - Reference:** [scikit-learn - pipelines and composite estimators](https://scikit-learn.org/stable/modules/compose.html) - Read 8.1.1 Pipeline chaining with the no-leakage rule and transformer caching, and 8.1.4 ColumnTransformer for heterogeneous columns with remainder and fitted-state behavior. Use it to assemble and serialize the feature-selection pipeline.
- **Reference - Reference:** [scikit-learn - imputation of missing values](https://scikit-learn.org/stable/modules/impute.html) - Read 8.4.2 univariate median and most_frequent strategies, 8.4.6 Marking imputed values with MissingIndicator or add_indicator=True for missingness flags, and 8.4.7 estimators that accept NaN directly. Decide impute-only versus impute-plus-indicator per column.
- **Reference - Reference:** [UMAP - basic usage and parameters](https://umap-learn.readthedocs.io/en/latest/basic_usage.html) - Work the Penguin scaling and fit_transform section and the Digits fit and transform section, then read the parameters page for the n_neighbors local-global tradeoff and min_dist packing. Stay in 2D exploratory views with fixed seeds.

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

### Study units

#### U1. Holdout, cross-validation and resampling by the right unit

**About 3 h** · **Target:** Implement

Topics: Holdout, cross-validation, nested selection and final test isolation; Group and temporal resampling with the correct sampling unit

A validation score that guided model choice is optimistic. The sampling unit decides what the error bars mean at deployment.

**You can now**

- Choose K-fold, stratified, group or time-series resampling from the deployment dependence structure and name the sampling unit.
- Run nested selection so the reported score never guided the choice it evaluates.
- Keep preprocessing inside the resampling loop so no test information leaks into fitting.

**Study**

1. [Cross-validation: computing metrics and choosing iterators](https://scikit-learn.org/stable/modules/cross_validation.html) (scikit-learn - model selection and evaluation route) - Sections 3.1.1 (cross_validate versus cross_val_score, the Data transformation with held-out data note, 3.1.1.2 cross_val_predict and its warning) and 3.1.2 (K-fold, Stratified K-fold, Group K-fold, TimeSeriesSplit).
2. [Nested versus non-nested cross-validation on iris](https://scikit-learn.org/stable/auto_examples/model_selection/plot_nested_cross_validation_iris.html) (scikit-learn - model selection and evaluation route) - Whole example: inner GridSearchCV over C and gamma, outer cross_val_score; the non-nested best_score_ is optimistic next to the nested mean.
3. [ISLP Chapter 5 lab: validation-set, LOOCV and k-fold errors](https://github.com/intro-stat-learning/ISLP_labs/blob/main/Ch05-resample-lab.ipynb) (ISLP - resampling and multiple testing) - The Validation Set Approach (linear/quadratic/cubic MSE triple 23.62, 18.76, 18.80 on Auto) and Cross-Validation (LOOCV MSE 24.23, then the 10-fold KFold comparison). Depth: Skim the bootstrap half. It belongs to the uncertainty unit.

**Focus**

- An integer cv in cross_val_score means StratifiedKFold when the estimator is a classifier and y is binary or multiclass, and plain KFold otherwise, unshuffled in both cases.
- cross_val_predict returns one out-of-fold prediction per row for inspection and stacking, but its pooled score is not a generalization estimate.
- GroupKFold keeps whole groups out of training together; TimeSeriesSplit only ever tests on the future. The deployment unit picks the splitter.
- Every fitted transform (scaling, imputation, selection) must sit inside a Pipeline under CV, or test statistics shape the training features.

**Reproduce:** Closed-book, write the nested loop for an RBF SVC over C in {1, 10, 100} and gamma in {0.01, 0.1} on iris, with KFold(4, shuffle=True) inner (random_state=0) and outer (random_state=1) splits, and state which number is honest. Reference run: nested mean 0.9468 against non-nested best_score_ 0.9603. One trial is noisy: the docs example averages 30 trials and finds a mean gap of only 0.0076 (std 0.0078).

**Traps**

- Reporting GridSearchCV.best_score_ as model performance. It was maximized over the same folds, so the nested mean is the honest estimate.
- Splitting rows when the deployment unit is a group or a time block. Shared patients, users or days across train and test inflate the score.
- Fitting the scaler or selector on all data before cross_val_score. Wrap it in a Pipeline so each fold fits transforms on its train split only.

**Practice**

- [ISLP Ch05 lab: validation-set and cross-validation errors](https://github.com/intro-stat-learning/ISLP_labs/blob/main/Ch05-resample-lab.ipynb) - Reproduce the linear/quadratic/cubic validation MSE triple and the LOOCV estimate 24.23 on Auto, then the 10-fold comparison. Match the printed numbers before trusting your own splitter on grouped or temporal data.

**Stop when:** You reproduce the nested versus non-nested gap on iris, and you can name the sampling unit and the nested structure for a grouped or temporal problem without notes.

<details>
<summary>Self-test</summary>

1. When does an integer cv in cross_val_score stratify?
   - When the estimator is a classifier and y is binary or multiclass, it uses StratifiedKFold; otherwise plain KFold. Neither shuffles unless asked.
2. You select C by CV and report the best CV score. What is wrong?
   - Selection consumed the same scores, so the maximum is optimistic. Re-estimate with an outer loop (nested CV) or a sealed held-out set.
3. Each patient contributes several rows. Why is plain KFold wrong, and what replaces it?
   - Rows from one patient land on both sides and leak identity. Split by patient with GroupKFold or LeaveOneGroupOut.
4. Why must scaling sit inside the CV loop?
   - A scaler fit on all data lets test statistics shape training features. Each fold must fit the transform on its train split only.

</details>

#### U2. Regression error and confusion-matrix metrics

**About 3 h** · **Target:** Derive

Topics: MAE, RMSE and decision-weighted regression error; Confusion matrix, precision, recall and F1

Accuracy and RMSE hide the errors that cost money. The matrix and the averaging rule decide what a single number means.

**You can now**

- Derive MAE, RMSE, R2 and MAPE from residuals and state which error each one punishes.
- Reconstruct precision, recall, F1 and support from a confusion matrix and choose macro, micro or weighted averaging deliberately.
- Match the regression loss to the decision cost, including quantile (pinball) and relative-error losses.

**Study**

1. [Classification metrics: confusion matrix, report, precision and recall](https://scikit-learn.org/stable/modules/model_evaluation.html) (scikit-learn - model selection and evaluation route) - Sections 3.4.4.6 (confusion matrix rows are true classes, ravel order tn fp fn tp, normalize modes), 3.4.4.7 (classification report with support) and 3.4.4.9 (precision, recall, F measures and averaging rules). Depth: Skip top-k accuracy, kappa, Hamming and Jaccard unless your problem needs them.
2. [Regression metrics including decision-weighted losses](https://scikit-learn.org/stable/modules/model_evaluation.html) (scikit-learn - model selection and evaluation route) - Sections 3.4.6.1 (R2, including the constant-mean 0.0 and negative cases), 3.4.6.2 and 3.4.6.3 (MAE, MSE, with RMSE via root_mean_squared_error), 3.4.6.5 (MAPE) and 3.4.6.10 (pinball loss). Depth: Skim Poisson, Gamma and Tweedie deviances. Read them fully only for count or skewed-positive targets.

**Focus**

- Rows of confusion_matrix are true classes; ravel gives tn, fp, fn, tp in that order.
- R2 is 1 minus residual over total variance: 0.0 for the mean predictor, negative for worse-than-mean predictions.
- Macro averages classes equally, weighted averages by support, micro pools the counts. On imbalance they disagree, and the choice encodes costs.
- Pinball loss at quantile tau prices over- and under-prediction asymmetrically; MAPE divides by the target, so near-zero targets dominate it.

**Reproduce:** Closed-book, derive F1 as the harmonic mean of precision and recall and R2 as 1 minus SS_res over SS_tot. Compute F1 on y_true [0,0,0,1,1,1,1,1] with y_pred [0,1,0,1,0,1,0,1]: tn, fp, fn, tp is 2, 1, 2, 3, so precision is 0.75, recall is 0.6 and F1 is 0.667. Compute R2 on the guide's regression example, y_true [3, -0.5, 2, 7] with y_pred [2.5, 0.0, 2, 8]: 0.949.

**Traps**

- Reading accuracy on an 80/20 split. The constant classifier scores 0.80, so report balanced accuracy or the full matrix.
- Averaging F1 with the wrong rule. Weighted averaging lets the majority class hide a failing rare class, and micro pools the counts so the rare class barely registers; macro gives it full weight. Name the rule.
- Comparing RMSE across targets with different units or scales. It carries the target unit, so normalize before comparing.

**Practice**

- [scikit-learn worked examples: confusion matrix and classification report](https://scikit-learn.org/stable/modules/model_evaluation.html) - Reproduce the 3.4.4.6 ravel example (2, 1, 2, 3) and the 3.4.4.7 report (accuracy 0.60, macro average F1 0.49) by hand, then match with code. Do both by hand first. The macro average is the check that your averaging rule is right.

**Stop when:** Your hand-computed matrix, report averages and R2 match sklearn on a fresh split, and you can defend the averaging rule from the class costs.

<details>
<summary>Self-test</summary>

1. tn, fp, fn, tp is 2, 1, 2, 3. What are precision, recall and F1?
   - Precision 3/4 = 0.75, recall 3/5 = 0.6, F1 = 2(0.75)(0.6)/1.35 = 0.667.
2. When is R2 negative, and what does that say?
   - When SS_res exceeds SS_tot: the predictions are worse than the constant mean of the scored targets. On held-out data that can happen honestly, through overfitting or shift; in-sample, least squares with an intercept cannot go below 0.
3. Why can macro-F1 and weighted-F1 rank two models differently?
   - Macro weights classes equally so a rare class counts fully; weighted weights by support so the majority dominates. They encode different costs.
4. Your target spans cents to millions. Why is RMSE alone a poor objective?
   - Squared errors on the largest targets dominate it. A relative loss such as MAPE, a quantile loss, or modeling log amounts matches the decision better.

</details>

#### U3. ROC AUC, average precision, log loss and Brier score

**About 3 h** · **Target:** Derive + Measure

Topics: ROC AUC, average precision, log loss and Brier score

Ranking scores compare models across thresholds, but only proper scores judge the probabilities you will later threshold, weight or abstain on.

**You can now**

- Derive ROC AUC as the pairwise ranking probability and average precision as the precision-recall summary.
- Explain why ROC AUC is prevalence-independent while average precision moves with the base rate.
- Compute log loss and Brier score by hand and state what each one punishes beyond ranking.

**Study**

1. [ROC, precision-recall, log loss and Brier score](https://scikit-learn.org/stable/modules/model_evaluation.html) (scikit-learn - model selection and evaluation route) - Sections 3.4.4.15.1 (binary ROC with predict_proba[:, 1] or decision_function; breast-cancer AUC 0.99), 3.4.4.9 (average_precision_score and precision_recall_curve), 3.4.4.12 (log loss) and 3.4.4.18 (Brier score, binary range and calibration note). Depth: Skip multilabel ranking metrics (3.4.5) and DET curves unless your task needs them.

**Focus**

- Pass the positive-class column predict_proba(X)[:, 1] (classes_[1]) or decision_function to roc_auc_score, never hard predictions.
- The docs' 0.99 breast-cancer AUC is a demonstration, not a result: the snippet re-scores its own training data.
- Average precision summarizes the PR curve and falls with prevalence; ROC AUC conditions within each class and does not move.
- Log loss punishes one confident error without bound; Brier stays bounded and mixes calibration with discrimination.

**Reproduce:** Closed-book, compute ROC AUC by pairwise comparison on y [0,0,1,1] with scores [0.1,0.4,0.35,0.8] to get 0.75 (3 of 4 positive-negative pairs ordered), plus log loss 0.47 and Brier 0.16, and list the ROC points (0,0), (0,0.5), (0.5,0.5), (0.5,1), (1,1).

**Traps**

- Feeding predict() labels into roc_auc_score. Hard labels give one elbow and a collapsed AUC; pass scores.
- Quoting the in-sample 0.99 AUC from the docs snippet as model quality. It re-scores training data.
- Treating ROC AUC as a calibration check. A model can rank perfectly while its probabilities are badly miscalibrated.

**Practice**

- [Hand-check ROC, AUC and Brier against sklearn](https://scikit-learn.org/stable/modules/model_evaluation.html) - Match your hand computation on y [0,0,1,1] with scores [0.1,0.4,0.35,0.8] (AUC 0.75, AP 0.833) against roc_auc_score, average_precision_score and brier_score_loss, then reproduce the confusion_matrix_at_thresholds table (tns [2,1,1,0], tps [1,1,2,2]). All three numbers were verified with sklearn 1.9. Recompute AP by hand from the PR points before checking.

**Stop when:** Your hand AUC, AP, log loss and Brier match sklearn to 3 decimals, and you can say which metric moves when prevalence shifts.

<details>
<summary>Self-test</summary>

1. What does AUC 0.75 mean as a pairwise statement on the reproduce example?
   - A random positive outranks a random negative with probability 0.75. Three of the four pairs are correctly ordered; only 0.35 versus 0.4 is flipped.
2. Prevalence drops 10x at fixed score distributions. What happens to ROC AUC and to average precision?
   - ROC AUC is unchanged because it conditions within each class. Precision at fixed recall falls, so average precision drops.
3. Why does log loss explode on one confident error while Brier stays bounded?
   - Log loss takes minus log of the true-class probability, unbounded as it goes to 0. Binary Brier is the squared error of the positive-class probability, at most 1 per item (the guide's halved form of the two-class sum).
4. roc_curve returns thresholds starting at inf. Why is inf not an operating threshold?
   - The first point predicts nothing positive (FPR and TPR both 0). Inf sits above every score; the usable thresholds are the distinct scores.

</details>

#### U4. Calibration curves and Platt or isotonic recalibration

**About 4 h** · **Target:** Implement + Measure

Topics: Calibration curves, slope and intercept at interpretation level; Platt and isotonic calibration on held-out predictions

Thresholds, costs and abstention all read probabilities. An uncalibrated 0.9 is a rumor, not a measurement.

**You can now**

- Read a reliability curve bin by bin and summarize it with ECE without letting one number hide the shape.
- Fit Platt (sigmoid) and isotonic recalibration on held-out predictions and explain their slope, intercept and monotonicity behavior.
- Keep a final test split untouched through fitting, calibration and threshold choice.

**Study**

1. [Probability calibration: curves and the calibrator](https://scikit-learn.org/stable/modules/calibration.html) (scikit-learn - model selection and evaluation route) - Sections 1.16.1 (reliability diagrams via CalibrationDisplay and calibration_curve) and 1.16.2 to 1.16.3 (CalibratedClassifierCV: ensemble averaging versus a single refit, disjoint calibration data). Depth: Skip the multiclass example unless your task has more than two classes.
2. [Sigmoid, isotonic and temperature scaling](https://scikit-learn.org/stable/modules/calibration.html) (scikit-learn - model selection and evaluation route) - Sections 1.16.3.1 (Platt sigmoid: logistic slope and intercept, preserves ranking and AUC), 1.16.3.2 (isotonic: free monotonic steps, stronger past about 1000 points, ties can change AUC) and 1.16.3.4 (temperature scaling).

**Focus**

- Calibrate on predictions the classifier did not train on: CV inside CalibratedClassifierCV, or a disjoint calibration split with FrozenEstimator.
- In sklearn 1.9, cv=None means 5-fold, stratified when y is binary or multiclass, and ensemble='auto' means an averaging ensemble of per-fold pairs unless the estimator is a FrozenEstimator. Posts written before 1.6 show ensemble=True as the default.
- Sigmoid fits a logistic slope and intercept: safe on small samples. Isotonic fits a free step function: stronger on large calibration sets, but flat steps tie scores and can move AUC.
- Lower Brier or log loss does not prove better calibration. Both mix calibration with discrimination, so read the curve.

**Reproduce:** Closed-book, simulate overconfident scores: default_rng(1), n = 4000, p uniform on [0.05, 0.95], y drawn as Bernoulli(p), score s = clip(0.5 + 2.2 (p - 0.5), 0.01, 0.99). Fit a one-feature logistic (Platt) map on the first 2000 rows and score the last 2000: Brier falls from 0.2130 to 0.1892 (slope 2.80, intercept -1.46 on the raw score). Bin the held-out half with sklearn.calibration.calibration_curve at 5 bins: the top bin predicts 0.964 while 0.776 are positive.

**Traps**

- Calibrating on training predictions. Outputs pushed to 0/1 teach the calibrator the wrong map; use CV or a disjoint split.
- Judging calibration by ECE alone. One number averages away the shape; the user guide warns that lower Brier need not mean better calibrated.
- Fitting isotonic on a few hundred points and shipping it. It overfits small calibration sets, so prefer sigmoid there.

**Practice**

- [Deep-ML 260: Calculate Expected Calibration Error (ECE)](https://www.deep-ml.com/problems/260) - Implement expected_calibration_error and pass both public tests ([0,1] with [0.0,1.0] gives 0.0; four 0.8-probability items with two positives give 0.3). Use equal-width bins, put p = 1.0 in the last bin, skip empty bins and weight by bin share. Then apply the same function to your Platt experiment above.

**Stop when:** Your reliability table, ECE function and Platt versus isotonic comparison reproduce on held-out data, and the final test split is still sealed.

<details>
<summary>Self-test</summary>

1. A bin has mean predicted probability 0.8 with 10 of 40 positives, out of 200 items total. What is its ECE contribution?
   - The gap |0.8 - 0.25| = 0.55 weighted by the bin share 40/200 = 0.2, so 0.11.
2. Why does isotonic recalibration risk changing AUC while Platt cannot?
   - Isotonic is stepwise: distinct scores can land on one flat step as ties, which changes ranking. Sigmoid is strictly increasing, so pairwise order survives.
3. What goes wrong if you tune the threshold on the calibration split and report on it too?
   - The threshold overfits that split's noise. Tune on validation or calibration data, then report once on the untouched test split.
4. GaussianNB probabilities pile near 0 and 1. Sigmoid or isotonic, and on what data?
   - With ample held-out data, isotonic corrects the characteristic S-distortion better; with little data use sigmoid. Never fit either on the training predictions.

</details>

#### U5. Cost-sensitive thresholds, imbalance and prevalence change

**About 4 h** · **Target:** Derive + Measure

Topics: Cost-sensitive thresholds and selective prediction; Class imbalance, prevalence change and metric choice

The default 0.5 threshold encodes equal costs that no deployment has. Imbalance and prevalence change move every thresholded metric except the ranking.

**You can now**

- Derive the cost-optimal threshold t = C_FP / (C_FP + C_FN) for calibrated probabilities and set it with FixedThresholdClassifier.
- Tune a threshold with TunedThresholdClassifierCV without letting the tuning data leak into the report.
- Specify a selective (reject-option) rule with a coverage target and report its risk-coverage tradeoff.
- Predict how a prevalence shift moves precision, F1 and the operating threshold while ROC AUC stands still.

**Study**

1. [Tuning the decision threshold for class prediction](https://scikit-learn.org/stable/modules/classification_threshold.html) (scikit-learn - model selection and evaluation route) - Sections 3.3 (0.5 and score-0 defaults), 3.3.1.1 (TunedThresholdClassifierCV, default balanced-accuracy scoring, pos_label via make_scorer), 3.3.1.2 (internal 5-fold CV; cv='prefit' only on fresh validation data) and 3.3.1.4 (FixedThresholdClassifier with FrozenEstimator). Depth: Run the 3.3.1.1 snippet. The page prints 0.88 for the refit model scored on its own training data (0.887 with scikit-learn 1.9.1), against an internal cross-validated best_score_ of 0.86. The gap is in-sample optimism, so trust the 0.86.
2. [Selective classifier, coverage and selective risk](https://www.jmlr.org/papers/v11/el-yaniv10a.html) (El-Yaniv and Wiener - On the Foundations of Noise-free Selective Classification) - Abstract and Section 2, Preliminary Definitions (Definitions 1 and 2: coverage and selective risk, the risk-coverage tradeoff). Depth: Stop before the noise-free learning bounds. The definitions plus your own confidence threshold are the whole assignment.
3. [Precision and recall definitions for the prevalence arithmetic](https://scikit-learn.org/stable/modules/model_evaluation.html) (scikit-learn - model selection and evaluation route) - Section 3.4.4.9 for the binary precision and recall definitions; the prevalence-shift rescaling is derived in Reproduce below.

**Focus**

- Predict positive when p times C_FN exceeds (1-p) times C_FP, so t = C_FP / (C_FP + C_FN). With miss cost 10 and false-alarm cost 1, the threshold is 1/11 = 0.091, not 0.5.
- TunedThresholdClassifierCV moves only the threshold by internal CV. When the vanilla model was fit on the same data with the same seed, predict_proba, and so the ROC and PR curves, are identical before and after.
- The reject rule is a second threshold: abstain when max(p, 1-p) is below 1 minus reject-cost over error-cost, then report risk at the achieved coverage.
- At fixed class-conditional score distributions, a prevalence shift moves precision and F1 but not recall, FPR or ROC AUC. The cost-optimal cutoff on the old scores moves too, because the calibrated probabilities change with the base rate.

**Reproduce:** Closed-book, derive t = C_FP / (C_FP + C_FN) and apply it at 10:1 costs (threshold 0.091). Then build make_classification(n_samples=4000, weights=[0.9, 0.1], class_sep=0.8, random_state=0), split 75/25 stratified with random_state=0, fit LogisticRegression on train and wrap it in FixedThresholdClassifier(FrozenEstimator(model), threshold=t). On the 1000 test rows (105 positives) recall rises from 0.238 at 0.5 to 0.714 at 0.2 and 0.848 at 1/11, while precision falls from 0.581 to 0.446 and 0.302.

**Traps**

- Tuning the threshold on the test set, or with cv='prefit' on training data. The user guide warns explicitly that tuning data must be disjoint from training data.
- Moving the threshold to fix calibration. Thresholds spend probabilities; they cannot repair them. Recalibrate first.
- Reporting selective accuracy without coverage. Accuracy on the retained 60% says nothing beside accuracy on 100%; always pair risk with coverage.

**Practice**

- [scikit-learn cost-sensitive threshold example: German credit](https://scikit-learn.org/stable/auto_examples/model_selection/plot_cost_sensitive_learning.html) - Cost-sensitive learning with constant gains and costs: a bad credit scored as good costs 5 times the reverse. Rebuild the vanilla and tuned HistGradientBoosting models, confirm their predict_proba outputs are identical while their labels differ, and read best_threshold_ (0.03 on the page). Then run the cv="prefit" variant (0.25) and the page's explanation of why it overfits. Derive the threshold the cost matrix implies for calibrated probabilities, 1/(1 + 5) = 1/6 (the page's "1/5 of the cost ratio" wording is loose), and score it on the test split with FixedThresholdClassifier. With scikit-learn 1.9.1 the test gain is -209 at 0.5, -143 tuned and -136 at 1/6. Explain why the tuned cutoff sits so far below 1/6.

**Stop when:** You derive the cost threshold from scratch, reproduce the tuned-versus-vanilla probability agreement, and report a reject rule as a (risk, coverage) pair.

<details>
<summary>Self-test</summary>

1. Miss cost 10, false-alarm cost 1, calibrated p = 0.2. Predict positive or not, and why?
   - Predict positive: the expected miss cost 0.2 times 10 = 2 exceeds the false-alarm cost 0.8 times 1 = 0.8. Equivalently, 0.2 exceeds 1/11.
2. Why do the tuned and vanilla classifiers share ROC curves?
   - Tuning moves only the decision threshold while predict_proba is untouched, so every threshold sweep (ROC, PR) is identical.
3. Reject cost 0.2, error cost 1. When do you abstain?
   - When max(p, 1-p) is below 0.8: the cheapest guess has error probability above the price of abstaining.
4. Prevalence halves at fixed score quality. Which metrics move?
   - Precision and F1 fall; recall, FPR and ROC AUC hold. Any threshold tuned for the old base rate must be re-derived.

</details>

#### U6. Paired bootstrap, permutation tests and multiplicity

**About 4 h** · **Target:** Implement + Measure

Topics: Paired bootstrap intervals, permutation tests and effect sizes; Multiplicity, search history and winner's curse

Two models sharing a test set produce correlated scores. Unpaired uncertainty is wider than honest, and unadjusted selection is optimistic.

**You can now**

- Report a paired bootstrap interval for a model difference with the resampling unit matched to the comparison.
- Run a paired permutation test with the correct permutation type and state its null in words.
- Report an effect size beside every p-value and adjust for multiplicity with the search history on record.

**Study**

1. [The Bootstrap and paired-sample permutation tests](https://docs.scipy.org/doc/scipy/tutorial/stats/resampling.html) (SciPy - Resampling and Monte Carlo methods tutorials) - The notebooks linked from this page: Tutorial 3 (The Bootstrap: scipy.stats.bootstrap with paired=True, BCa and percentile intervals, standard errors) and Tutorial 2b (Paired-Sample Permutation Tests: permutation_test with permutation_type='samples'). Depth: Stay inside Tutorials 2b and 3. The independent-sample and Monte Carlo tutorials solve different comparisons.
2. [ISLP Chapter 5 lab: the bootstrap standard error](https://github.com/intro-stat-learning/ISLP_labs/blob/main/Ch05-resample-lab.ipynb) (ISLP - resampling and multiple testing) - The Bootstrap (Portfolio alpha standard error 0.0912 via boot_SE with B=1000 and seed 0, then the linear-regression coefficient SEs).
3. [ISLP Chapter 13 lab: FWER, FDR and the double-dip](https://github.com/intro-stat-learning/ISLP_labs/blob/main/Ch13-multiple-lab.ipynb) (ISLP - resampling and multiple testing) - Family-Wise Error Rate (Bonferroni rejects only Manager One; Holm rejects Managers One and Three at FWER 0.05; the best-versus-worst paired test at p = 0.038 rises to 0.186 under Tukey's method) and False Discovery Rate (Benjamini-Hochberg on all 2,000 managers).

**Focus**

- Resample pairs, not models: one index stream (paired=True) must score both models, or shared example difficulty becomes noise.
- The paired-difference test is permutation_type='samples' (sign flips within pairs). 'pairings' tests association instead; 'independent' shuffles labels across groups.
- Pairing shrinks intervals. In the reproduce simulation a 4.8-point gap on 500 items has a paired 95% interval about 0.038 wide, against about 0.120 when each model is resampled on its own, which then covers zero.
- Every tuned, selected or re-run comparison spends error budget. Record the search history and report Holm (FWER) or BH (FDR) adjustments beside raw p-values and effect sizes.

**Reproduce:** Closed-book, implement a paired bootstrap for an accuracy difference (one index stream for both models, 9999 resamples, percentile interval) plus a paired permutation test. Simulate shared difficulty: default_rng(0), u uniform on 500 items, model A right when u < 0.70 and model B when u < 0.65, so B's hits are a subset of A's, the strongest pairing. Accuracies are 0.662 and 0.614; expect a paired interval near [0.030, 0.068] against near [-0.010, 0.110] when each model is resampled independently.

**Traps**

- Bootstrapping each model's scores with its own rng stream. Unpaired resampling destroys the pairing and inflates the interval.
- Using permutation_type='pairings' (or 'independent') for a paired model comparison. That tests correlation (or cross-group exchangeability), not the mean paired difference.
- Reporting the winning p-value after many seeds, splits or metrics. In the ISLP Fund lab the best-versus-worst managers, picked after looking, give p = 0.038; Tukey's method over the implied 10 comparisons raises it to 0.186.

**Practice**

- [ISLP Ch05 lab: bootstrap standard errors](https://github.com/intro-stat-learning/ISLP_labs/blob/main/Ch05-resample-lab.ipynb) - Reproduce alpha SE 0.0912 (B=1000, seed 0) and the OLS bootstrap SEs from The Bootstrap
- [ISLP Ch13 lab: Bonferroni, Holm and Benjamini-Hochberg](https://github.com/intro-stat-learning/ISLP_labs/blob/main/Ch13-multiple-lab.ipynb) - Reproduce the Bonferroni and Holm verdicts (only Manager One, then One plus Three at FWER 0.05), the Tukey adjustment from 0.038 to 0.186, and the Benjamini-Hochberg rejections on all 2,000 managers. Run both labs before your own paired comparison, then report it with an effect size and a comparison count.

**Stop when:** Your paired bootstrap and permutation test agree on a model comparison, the interval uses one index stream, and every p-value ships with an effect size and a comparison count.

<details>
<summary>Self-test</summary>

1. Two models share the test set. Why must the bootstrap indices be identical for both?
   - Scores on the same items correlate through item difficulty. Identical indices keep the pairing, so shared difficulty cancels in the difference; independent streams add it as noise.
2. Which permutation_type tests a paired accuracy difference, and what does it shuffle?
   - 'samples': within each pair it swaps the two models' outcomes (sign flips). The null is a zero mean paired difference.
3. Your paired interval is [0.030, 0.068] and the permutation p is 0.0002 from 9999 resamples. What do you report?
   - A 3.0-to-6.8 point gain (observed 4.8) separated from zero, the effect size, the count of comparisons that preceded it, and p below 0.001. With 9999 resamples 0.0002 is the smallest two-sided p the test can return, so it is a floor, not a measurement.
4. After 20 metric looks, one comparison gives p = 0.03. Ship it?
   - No. With 20 looks the family-wise error is near 1 minus 0.97^20 = 0.46. Adjust with Holm or BH, or pre-register the primary comparison, and report the effect size either way.

</details>

#### U7. Learning curves, error taxonomies and slices

**About 3 h** · **Target:** Measure

Topics: Learning curves, error taxonomies and slice support counts

Aggregate scores average away the slice that fails. Curves say whether to buy data; slices say where the model is wrong.

**You can now**

- Read training and validation curves to separate bias (more data will not help) from variance (more data may help).
- Build an error taxonomy with slice support counts and refuse conclusions a slice cannot support.
- Turn the worst supported slice into a testable hypothesis with a follow-up slice.

**Study**

1. [Validation curves and learning curves](https://scikit-learn.org/stable/modules/learning_curve.html) (scikit-learn - model selection and evaluation route) - Sections 3.5.1 (validation_curve and ValidationCurveDisplay: high train with low validation means overfit) and 3.5.2 (learning_curve and LearningCurveDisplay: Naive Bayes flat and low versus SVM converging). Depth: Skip the scalability example. The digits snippet numbers in Reproduce are your check.
2. [Slice, error and data-size requirements](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-2/classical-ml-scientific-investigation.md#core-requirements) (Classical ML Scientific Investigation) - Milestones B (record predictions and errors per item), C (prescribed ablations and learning/data-size probes) and E (subgroup, time and source slices with paired uncertainty and practical significance).

**Focus**

- Both scores low means bias (capacity or features); train high with validation low means variance. Validation above train is rare and usually means the two are measured differently: augmentation or dropout at train time, an easier or tiny validation split, or leakage.
- Never tune on the validation curve's peak and report that peak. The curve diagnoses; a fresh split evaluates.
- Every slice needs its support count beside the rate: 100% error on n=3 is a hint, not a finding.
- Slice by deployment axes (source, time, subgroup), not by the model's own confidence alone, or the taxonomy confirms itself.

**Reproduce:** Closed-book, run learning_curve for LogisticRegression(max_iter=2000) on digits with train_sizes [0.1, 0.5, 1.0] and cv=3 (119, 599 and 1198 training rows) and read the regime. Reference run: train 1.00 at every size, validation 0.823, 0.918, 0.926, so variance at small n with a closing gap. Then tabulate one error slice with support counts.

**Traps**

- Concluding that more data will fix flat converging curves. The Naive Bayes panel shows both scores stuck low: capacity, not data.
- Slicing until a bad slice appears, then reporting it raw. Unplanned slices are multiple comparisons, so pre-register slices or adjust.
- Averaging slice metrics without support weights while claiming deployment impact. Impact is rate times slice share.

**Practice**

- [scikit-learn learning-curve digits check](https://scikit-learn.org/stable/auto_examples/model_selection/plot_learning_curve.html) - Reproduce the Naive Bayes versus SVC learning-curve comparison on digits and state the bias or variance reading for each panel. Match the qualitative pattern (flat low Naive Bayes, converging SVM), not pixel values. Then repeat on your own data with support-counted slices.

**Stop when:** Your curve reading names bias or variance with the numbers that show it, and every slice claim carries n and an interval.

<details>
<summary>Self-test</summary>

1. Train 1.00 with validation 0.82 at small n, then 1.00 with 0.93 at full n. Diagnosis?
   - Variance-dominated with a closing gap: more data helped and the model still memorizes train. Some overfit remains, so try regularization, not just data.
2. Both curves sit flat at 0.70 from 10% to 100% of data. Next step?
   - Bias: capacity or features are the ceiling. More of the same data will not move it, so change the model or the representation.
3. Slice A is 2/3 wrong. Slice B is 40/400 wrong. Which finding is stronger?
   - B: 10% error on n=400 has a tight interval, while 67% on n=3 is noise. Report both with counts and intervals.
4. Why slice by source or time rather than by low model confidence?
   - Confidence slices re-select the model's own failures and cannot show where deployment breaks. Source and time slices test the deployment axes.

</details>

#### U8. Permutation importance and partial dependence

**About 3 h** · **Target:** Measure

Topics: Permutation importance and correlated-feature limits; Partial dependence and noncausal interpretation boundaries

Importance and dependence plots describe what the fitted model leans on, not what causes the outcome. Correlated features make both lie smoothly.

**You can now**

- Compute permutation importance on a held-out set with repeats and report importances with their spread.
- Distrust importance and PDP readings under correlated features and check with clustered or ICE views.
- State PDP and ICE results as model behavior on constructed points, never as causal effects.

**Study**

1. [Permutation feature importance](https://scikit-learn.org/stable/modules/permutation_importance.html) (scikit-learn - model selection and evaluation route) - The diabetes Ridge worked example (s5 0.204, bmi 0.176, bp 0.088, sex 0.056 at n_repeats=30), Section 5.2.2 (impurity/MDI bias toward high-cardinality features) and Section 5.2.3 (correlated features share credit; cluster and keep one per group). Depth: Skip the multicollinear example figures. The breast-cancer warning paragraph carries the point.
2. [Partial dependence and ICE plots](https://scikit-learn.org/stable/modules/partial_dependence.html) (scikit-learn - model selection and evaluation route) - Section 5.1 (PDP marginalizes over complement features; correlated inputs create absurd constructed points), Section 5.1.2 (ICE lines with kind='both' reveal hidden heterogeneity) and Section 5.1.4 (brute versus recursion can disagree under correlation). Depth: Stop before the multi-class dropdown. One binary or regression example is enough.

**Focus**

- Permutation importance is model- and score-relative: shuffle one column, measure the score drop, repeat. Importance is the reference minus the corrupted mean.
- Compute it on held-out data with a decent model. On a bad model low importance means nothing; train versus held-out gaps flag overfit.
- Under correlation, permutation importance splits credit across partners and PDP averages over impossible combinations. Cluster correlated features first and overlay ICE.
- Impurity (MDI) importance favors high-cardinality and numeric features and rewards overfit. Never present it as interchangeable with permutation importance.

**Reproduce:** Closed-book, run the diabetes Ridge permutation snippet (n_repeats=30, random_state=0) and recover the top-4 order with s5 near 0.204. Then plot centered ICE lines for bmi: Ridge is linear, so every line is identical. Refit HistGradientBoostingRegressor(random_state=0) on the same split and its centered ICE lines end anywhere from about 36 to 152; describe where they spread.

**Traps**

- Dropping unimportant correlated features one at a time. Partners cover for each other, so remove the cluster or nothing.
- Reading a PDP slope as raising X raises Y. PDP shows model output on constructed rows with complement values borrowed from other rows; no intervention happened.
- Quoting MDI importances as feature truth. They are computed on training splits during fitting and biased toward fine-grained splitters.

**Practice**

- [scikit-learn permutation importance titanic check](https://scikit-learn.org/stable/auto_examples/inspection/plot_permutation_importance.html) - Reproduce the RandomForest titanic result: random_cat and random_num sit near zero importance while real features stand out, with spread over repeats. Then repeat the diabetes snippet locally and confirm s5 at 0.204 +/- 0.050 before trusting your own run.

**Stop when:** Your permutation ranking matches the docs' diabetes order, and you can show one correlated-feature trap and one PDP-heterogeneity trap on your own model.

<details>
<summary>Self-test</summary>

1. Permutation importance of x1 and x2 (correlation 0.95) is near zero for both, yet dropping both tanks the score. Explain.
   - The fitted model reads the same signal through both columns, so shuffling one leaves the partner carrying most of it and each drop looks small. Removing both removes the signal. Cluster correlated features and judge the cluster.
2. Why must permutation importance run on a held-out set with a decent model?
   - On training data it measures memorization leverage, and on a bad model the reference score is meaningless. Held-out drops measure reliance that generalizes.
3. The temperature PDP falls above 35C but some ICE lines are flat. What do you conclude?
   - The average hides heterogeneity: heat hurts only a subgroup, an interaction. Report the ICE spread, not just the PD line.
4. MDI ranks a 1000-level id column first while permutation ranks it near zero with large spread. Which do you trust?
   - Permutation on held-out data. MDI is biased to high-cardinality splitters and computed in-sample: the id memorizes but does not generalize.

</details>

#### U9. Covariate, label and concept shift, drift and label delay

**About 4 h** · **Target:** Explain + Measure

Topics: Covariate, label and concept shift; Data drift, performance drift and label delay

Test error assumes tomorrow looks like yesterday. Each shift type breaks a different link, so each needs its own detector and response.

**You can now**

- Classify a change as covariate, label or concept shift by naming which distribution moved.
- Build a domain-classifier covariate-shift detector and apply importance weights with the support condition checked.
- Separate data drift from performance drift and design monitoring that survives label delay.

**Study**

1. [D2L Section 4.7: shift types and corrections](https://d2l.ai/chapter_linear-classification/environment-and-distribution-shift.html) (D2L - Environment and Distribution Shift) - Types (covariate: P(y|x) fixed with p(x) moved; label: P(y) moved with P(x|y) fixed; concept: P(y|x) moved), Correction (importance weights beta = p(x)/q(x) via a domain classifier, the label-shift confusion-matrix solve) and Taxonomy (batch versus online deployment). Depth: Skim the anecdotes and fairness sections. Work the math in Correction.
2. [D2L 4.7 Exercises: detector and corrector](https://d2l.ai/chapter_linear-classification/environment-and-distribution-shift.html) (D2L - Environment and Distribution Shift) - Exercises 2 and 3: implement a covariate shift detector (hint: build a classifier) and a covariate shift corrector.
3. [Shift probes, label delay and monitoring design](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-2/classical-ml-scientific-investigation.md#core-requirements) (Classical ML Scientific Investigation) - Milestones C (shift probes) and E (slices with paired uncertainty), failure injection (label delay, shifted prevalence, group overlap) and the monitoring-design stretch goal.

**Focus**

- Name the moving piece: covariate moves p(x), label moves p(y), concept moves P(y|x). The detector and the fix follow the name.
- Covariate correction reweights by beta = p_test(x)/p_train(x), estimated as exp(h(x)) from a train-versus-test logistic domain classifier on equal sample counts (otherwise scale by the count ratio), capped as min(exp(h), c). It needs train support everywhere test reaches.
- Label shift solves mean-test-predictions equals confusion-matrix times new priors. It needs P(x|y) fixed and a validated confusion matrix.
- Data drift without performance drift is a warning, not a failure. With label delay, performance drift stays unobservable until labels land, so monitor input drift and slice volumes meanwhile.

**Reproduce:** Closed-book, simulate a covariate shift on a toy problem (train on one x-range, test shifted), train the domain classifier, compute capped weights beta = min(exp(h), c), and show the weighted error estimate moving toward the test error.

**Traps**

- Correcting with weights where test reaches and train never went. Importance weights cannot invent unseen regions; collect data instead.
- Reading a domain-classifier AUC near 0.5 as no shift. It may be a weak detector, so check slice volumes and the performance series too.
- Waiting for late labels to detect breakage. Design input-drift and volume monitors that fire before labels land.

**Practice**

- [D2L 4.7 Exercises: shift detector and corrector](https://d2l.ai/chapter_linear-classification/environment-and-distribution-shift.html) - Exercises 2 and 3: a domain-classifier covariate-shift detector and an importance-weighted corrector on a controlled synthetic shift. Control the shift yourself (one variable moves) so you know the ground truth the detector must find.

**Stop when:** You classify a new change into covariate, label or concept shift on sight, and your detector plus weighted estimate respond correctly to a synthetic shift you control.

<details>
<summary>Self-test</summary>

1. Cat photos train, cartoon cats test. Which shift, and what stays fixed?
   - Covariate shift: P(y|x), what makes a cat a cat, is fixed while p(x) moved. Reweight or adapt features; the labeling rule stands.
2. Disease prevalence doubles with identical symptoms per disease. Which shift, and what is the fix?
   - Label shift: P(y) moved with P(x|y) fixed. Estimate the new priors with the confusion-matrix solve and reweight by the prior ratio.
3. Spammers keep crafting messages unlike anything seen before, month after month. Which kind of shift, and what helps?
   - Nonstationary, adversarial drift, D2L's spam example. p(x) moves into regions training never covered, and where spam imitates normal mail P(y|x) moves too, so it is not a clean covariate shift. Reweighting cannot help without support; relabel recent data and retrain on a schedule.
4. Input drift alarms fire but held-out accuracy holds. Ship or stop?
   - Neither yet: data drift without performance drift is a warning. Check slice volumes, label-delay horizons and support coverage before changing anything.

</details>

#### U10. Ablations, negative controls, threats to validity and decision memos

**About 3 h** · **Target:** Measure

Topics: Ablations, negative controls and failure injection; Threats to validity and narrow decision memos

A higher score is not evidence until cheaper explanations are ruled out. Ablations and negative controls turn a leaderboard into a finding.

**You can now**

- Design the smallest ablation matrix that separates data, feature, capacity and evaluation explanations.
- Keep a null control (dummy baseline, shuffled-target run) that must fail for the conclusion to mean anything.
- Write a narrow decision memo that survives a small move in the best score.

**Study**

1. [Ablations, failure injection and defense](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-2/classical-ml-scientific-investigation.md#core-requirements) (Classical ML Scientific Investigation) - Milestones C (prescribed ablations under one controlled search budget), D (inject target-proxy, duplicate, future-feature, global-preprocessing and test-tuned-threshold failures; audits must fail at the right boundary; preserve failed runs), E (effects with paired uncertainty and multiplicity) and the Design-defense questions (baseline, metric-threshold match, what each ablation isolated, the largest remaining shift).
2. [Dummy estimators as null controls](https://scikit-learn.org/stable/modules/model_evaluation.html) (scikit-learn - model selection and evaluation route) - Section 3.4.8 (most_frequent, stratified and uniform baselines that ignore the features; the worked example sets the bar the real model must clear).
3. [Common pitfalls: leakage patterns that audits must catch](https://scikit-learn.org/stable/common_pitfalls.html) (scikit-learn - model selection and evaluation route) - Section 12.2 (split-first discipline, scaler-in-pipeline, the SelectKBest-on-all-data pattern scoring 0.76 on random labels versus 0.50 split-first).

**Focus**

- Change one mechanism per cell with data, splits and evaluation frozen. Record every variant and failure, not just the winner.
- Every claim needs a null that must fail: a dummy baseline, a shuffled-target run, or a seeded leak the audit must catch.
- Tune all compared families under one controlled search budget. Unequal tuning is a confound, not a result.
- Write the memo narrow: decision, evidence, uncertainty, threats, and what would change the call. A conclusion that breaks on a 0.005 score move is not a conclusion.

**Reproduce:** Closed-book, reproduce the SelectKBest leakage pattern (0.76 leaked on random labels versus 0.50 split-first), then seed one failure of your choice (global scaling before the split) on a small pipeline and show the split-first pipeline removing it beside a dummy baseline.

**Traps**

- Ablating by removing a component and retuning everything else freely. Retuning confounds the comparison; freeze the budget and the protocol.
- Keeping only the winning run. Without the failed variants and the search history, the winner's curse makes the margin a lie.
- A negative control that passes. If the dummy or shuffled-target run looks good, the evaluation is broken, not the model brilliant.

**Practice**

- [Seeded-leak audit drill (SelectKBest pattern)](https://scikit-learn.org/stable/common_pitfalls.html) - Section 12.2.2: reproduce the leaked 0.76 on random labels, then the split-first 0.50, on your own data with one seeded leak of your choice. Add a dummy-baseline null control and keep the failed run in your log. That log is the memo's appendix.

**Stop when:** A seeded leak fails your audit at the right boundary, every ablation cell carries paired uncertainty, and your memo states the tripwire that would reverse the decision.

<details>
<summary>Self-test</summary>

1. Removing feature set X drops accuracy 0.02 with a paired interval of [-0.01, 0.05]. What do you conclude?
   - Nothing about X yet: the interval covers zero and the effect is noise-sized. Report the null result with its interval instead of claiming X is useless or useful.
2. On a balanced binary task, your shuffled-target control scores 0.76. What is broken?
   - The evaluation leaks: with random labels nothing beats chance, 0.50 here. Audit preprocessing scope, duplicates and target-derived features before any modeling claim.
3. Model A had 3x the tuning budget of model B and wins by 0.01. Decision?
   - No decision: tuning effort confounds family quality. Re-run under one controlled budget with paired uncertainty, then decide.
4. What makes a decision memo narrow?
   - One decision, the exact evidence for it, uncertainty and threats against it, and the pre-stated tripwire (score move, slice failure, shift) that would reverse it.

</details>

### Mini-project: Frozen comparison and decision dossier

**About 12 to 16 hours.** Take two or three candidate models through a frozen protocol on one structured dataset: raw predictions, paired uncertainty, calibration, a threshold policy, slices, one controlled shift study, and a narrow decision that survives a small movement in the best score.

1. Freeze the protocol before any fitting: snapshot, a group- or time-aware split, nested or clean selection, one search budget per family, and a sealed test split.
2. Store per-row predictions for every candidate, and hand-check the central metrics on small cases before trusting library calls.
3. Compare candidates with a paired bootstrap interval and a paired permutation test on the same rows. Report the effect size, the comparison count and a Holm or Benjamini-Hochberg adjustment.
4. Calibrate on data the model did not train on: a reliability table, ECE and a Platt or isotonic map fitted on a disjoint split. If calibration does not matter for the decision, say why.
5. Set the threshold policy on validation: the cost-derived threshold beside TunedThresholdClassifierCV, plus a reject option reported as risk at coverage.
6. Slice errors along deployment axes with support counts and intervals, and read a learning curve to decide whether more data would help.
7. Run one controlled shift: move one variable or the class prior yourself, detect it with a domain classifier or prior re-estimation, and test the response against the ground truth you set.
8. Write the decision memo, then perturb it: replace the best score with the lower end of its paired interval or rerun with another seed, and state whether the decision holds and which tripwire would reverse it. Report the test-set numbers once.

**Deliverables**

- The frozen protocol and the raw prediction store.
- The comparison report: paired uncertainty with multiplicity, calibration, threshold policy, slices and the learning curve.
- The shift study with its known ground truth.
- The decision memo with its tripwire, the perturbation result and the retained negative results.

**Checks**

- external-tests: [Deep-ML 260 Expected Calibration Error](https://www.deep-ml.com/problems). Free problem with public tests. Pass it before you trust your own ECE function.
- rubric: Self-grade with the rubric below.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Frozen protocol | No choice touches the test split, and every reported number traces to stored raw predictions. | A seeded test-tuned threshold is caught by an audit before the report is written. |
| Paired uncertainty | A paired interval and a paired permutation test are reported on the same rows, with an effect size. | The comparison count and the multiplicity adjustment are reported, and an unpaired interval shows what pairing bought. |
| Calibration and threshold | A held-out reliability table and a cost-derived threshold are reported. | Recalibration fitted on disjoint data improves held-out log loss or Brier, and the reject option is reported as a (risk, coverage) pair. |
| Slices and shift | Slices carry support counts and intervals, and one controlled shift is detected. | The shift response is checked against the simulation's ground truth, and its failure region is stated. |
| Decision | The memo states the decision, evidence, uncertainty and threats. | The decision survives the perturbation and names the tripwire that would reverse it. |

Feeds into: Milestone artifact 3, the decision dossier: the frozen comparison, calibration and threshold policy, slices, shift study and negative result come from here.

### Resource route

- **Primary - Course:** [scikit-learn - model selection and evaluation route](https://scikit-learn.org/stable/model_selection.html) - Follow Cross-validation, Hyperparameter tuning, Decision threshold tuning, Metrics and scoring, Probability calibration, Validation curves, Permutation importance and Common Pitfalls. Retain raw predictions and independently hand-check central metrics.
- **Required - Theory:** [ISLP - resampling and multiple testing](https://www.statlearning.com/) - Use Chapter 5 and the relevant selection-history parts of Chapter 13 with their Python labs. Connect resampling to uncertainty and multiplicity without repeating the full statistics stage.
- **Reference - Assessment:** [Classical ML Scientific Investigation](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-2/classical-ml-scientific-investigation.md) - Use Core requirements, architecture constraints, Milestones A-F and failure injection as the standard for end-to-end evidence. The full project remains a later capstone route.
- **Support - Theory:** [D2L - Environment and Distribution Shift](https://d2l.ai/chapter_linear-classification/environment-and-distribution-shift.html) - Read 4.7, then construct one controlled covariate, label and concept shift. Record what changes, which signal detects it and what response the evidence supports.
- **Optional - Practice:** [Deep-ML candidate - evaluation problems](https://www.deep-ml.com/problems) - After the platform admission check, use at most one of 18 K-Fold CV, 260 Expected Calibration Error, 276 ROC, 277 AUC or 840 Stratified K-Fold. Hand-checked local metrics remain the evidence.
- **Reference - Reference:** [SciPy - Resampling and Monte Carlo methods tutorials](https://docs.scipy.org/doc/scipy/tutorial/stats/resampling.html) - Work the notebooks linked from this page: Tutorial 3 (The Bootstrap) with scipy.stats.bootstrap, including paired=True, and Tutorial 2b (Paired-Sample Permutation Tests) with permutation_test and permutation_type='samples'. Keep one resampling index stream across compared models.
- **Reference - Reference:** [El-Yaniv and Wiener - On the Foundations of Noise-free Selective Classification](https://www.jmlr.org/papers/v11/el-yaniv10a.html) - Read the Abstract and Section 2 (Preliminary Definitions: Definitions 1 and 2 for coverage and selective risk) for the risk-coverage tradeoff. Stop before the noise-free learning bounds.

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

**Capstone rubric** (about 8 to 12 hours)

| Criterion | Pass | Strong |
| --- | --- | --- |
| Contract and leakage pack | The section 1 mini-project meets Pass on every criterion. | It meets Strong on leakage and lineage, and one command runs every audit. |
| Classical mechanisms suite | Tested NumPy implementations of a regularized linear or logistic model, naive Bayes, a deterministic tree core with one ensemble, kNN or a small kernel model, PCA and k-means, each checked against an independent oracle. | One test command runs the whole suite, and every mechanism has property tests over seeds and shapes. |
| Decision dossier | The section 5 mini-project meets Pass on every criterion, on the same controlled dataset as the contract pack. | It includes one injected failure from the contract pack and shows the audit catching it before the comparison runs. |
| Rebuild from a clean clone | A README lists the commands that rebuild each artifact. | One script rebuilds every reported number on a laptop CPU, with its run time stated. |
| Honest limits | Each artifact states what its compact dataset and models cannot show. | Each limit names the later stage or track that addresses it. |

