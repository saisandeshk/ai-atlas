<!-- Generated from content/curriculum.json. Edit the JSON and run npm run content:generate. -->

# 08. Reinforcement Learning

**Level:** Advanced  
**Scope:** 12 track stages · 308 required topics · 30 optional, depth, or later topics

Move through three explicit modules: compact classical control foundations, deeper neural policy and value learning, and an extensive language-model RL route covering feedback, preference objectives, online optimization, reasoning, agents and scalable evaluation.

## Order

RL-1. Classical RL I: MDPs, Bellman Equations and Planning
RL-2. Classical RL II: Sampling, Temporal Difference and Control
RL-3. Deep RL I: Function Approximation and Stability
RL-4. Deep RL II: Policy Gradients, Actor-Critic, GAE and PPO
RL-5. Deep RL III: Exploration, Continuous Control and Empirical Method
RL-6. Deep RL IV: Imitation, Offline RL and Off-Policy Evaluation
RL-7. Deep RL V: Model-Based RL and World Models
RL-8. LLM RL I: Language Models as Policies
RL-9. LLM RL II: Preferences, Reward Models and Verifiers
RL-10. LLM RL III: Direct Preference Optimization
RL-11. LLM RL IV: Online Policy Optimization
RL-12. LLM RL V: Reasoning, Agents and Scalable Training

## RL-1. Classical RL I: MDPs, Bellman Equations and Planning

**Why:** Classical RL supplies the exact objects that every later deep or language-policy method approximates. This stage makes the environment contract, value definitions and planning oracles executable so later learning curves can be checked against something stronger than apparent reward improvement.

### Learn this much

- [ ] Sequential decisions versus supervised prediction and contextual bandits _(Required)_
- [ ] Agent, environment and interaction boundary _(Required)_
- [ ] State, observation and the Markov property _(Required)_
- [ ] Action spaces, transition kernels and reward functions _(Required)_
- [ ] Trajectories, episodes and continuing tasks _(Required)_
- [ ] Finite and infinite horizons _(Required)_
- [ ] Discounting, termination and truncation as separate semantics _(Required)_
- [ ] Deterministic and stochastic policies _(Required)_
- [ ] Returns and reward-to-go _(Required)_
- [ ] State values, action values and advantages _(Required)_
- [ ] Bellman expectation equations for policies _(Required)_
- [ ] Bellman optimality equations _(Required)_
- [ ] Matrix form of finite policy evaluation _(Required)_
- [ ] Exact policy evaluation and iterative policy evaluation _(Required)_
- [ ] Policy improvement and greedy policy construction _(Required)_
- [ ] Policy iteration _(Required)_
- [ ] Value iteration _(Required)_
- [ ] Finite-horizon backward induction _(Required)_
- [ ] Generalized policy iteration _(Required)_
- [ ] Bellman operators, contraction intuition and fixed points _(Required)_
- [ ] Residual-aware stopping criteria and policy versus value convergence _(Required)_
- [ ] Synchronous and asynchronous update order _(Required)_
- [ ] Tie handling, unreachable states and terminal-state conventions _(Required)_
- [ ] Reward timing, reward shaping and unintended optimal policies _(Required)_
- [ ] MDP formulation with state sufficiency, action authority and evaluation policy _(Required)_
- [ ] Belief states and finite POMDP planning _(Depth)_
- [ ] Large state-space approximate planning _(Later)_

### Resource route

- **Primary - Course:** [Stanford CS234 Winter 2026 - Foundations and Planning](https://web.stanford.edu/class/cs234/modules.html) - Study Lecture Modules 1 and 2: Introduction to Reinforcement Learning and Tabular MDP Planning. Work the public Assignment 1 planning portions independently, without copying or publishing course solutions, and map every symbol to the track MDP implementation.
- **Required - Book:** [Reinforcement Learning: An Introduction - Chapters 3 and 4](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) - Study Chapters 3 and 4 for finite MDPs, Bellman equations, dynamic programming, policy iteration and value iteration. Re-derive the gridworld examples and write exact tests for stochastic transitions, terminals, ties and stopping error.
- **Required - Documentation:** [Gymnasium - Time Limits and Episode Semantics](https://gymnasium.farama.org/tutorials/gymnasium_basics/handling_time_limits/) - Read the environment API and time-limit handling material. Build a wrapper test that distinguishes termination from truncation and proves which cases bootstrap before using any third-party environment.
- **Support - Tutorial:** [Hands-on Modern RL - Chapters 2 and 3](https://walkinglabs.github.io/hands-on-modern-rl/en/) - Use Chapters 2 and 3 for the MDP, policy, value and Bellman code experiments. Pin the page date or repository commit, reproduce one value experiment and check all equations against Sutton and Barto or Stanford before adopting them.
- **Required - Project:** [Reinforcement Learning Control Laboratory - Planning Core](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/reinforcement-learning-control-laboratory.md) - Complete Milestone A planning requirements: an explicit finite MDP, exact policy evaluation, value iteration, policy iteration, simulator agreement and seeded reward, transition, terminal and tie defects.

### Exit checkpoint

Formulate an unfamiliar finite decision process, derive both Bellman equations, implement policy and value iteration, and make exact values, simulation estimates and stopping error agree while exposing one plausible reward or terminal bug.

<details>
<summary>Deliberately left for later</summary>

- Deep function approximation before exact tabular oracles pass
- General POMDP solvers and large-scale approximate planning
- Application-specific environment engineering beyond one explicit MDP contract

</details>

## RL-2. Classical RL II: Sampling, Temporal Difference and Control

**Why:** When a transition model is unavailable, values and policies must be learned from sampled experience. This stage derives every target from a fixed trajectory, separates on-policy from off-policy claims and makes coverage, support and terminal semantics visible.

### Learn this much

- [ ] Model-free prediction and control _(Required)_
- [ ] First-visit and every-visit Monte Carlo estimation _(Required)_
- [ ] Incremental means and constant-step-size tracking _(Required)_
- [ ] Temporal-difference error and TD(0) _(Required)_
- [ ] Bootstrapping and bias-variance trade-offs _(Required)_
- [ ] n-step returns and return-target boundaries _(Required)_
- [ ] Eligibility traces and forward-backward view _(Depth)_
- [ ] On-policy and off-policy learning _(Required)_
- [ ] Behavior policies and target policies _(Required)_
- [ ] Trajectory and per-decision importance sampling _(Required)_
- [ ] Ordinary and weighted importance estimators _(Required)_
- [ ] Support, coverage and effective sample size _(Required)_
- [ ] SARSA control _(Required)_
- [ ] Expected SARSA control _(Required)_
- [ ] Q-learning control _(Required)_
- [ ] Epsilon-greedy behavior and exploration schedules _(Required)_
- [ ] Learning-rate schedules and visitation conditions _(Required)_
- [ ] Terminal versus truncated bootstrapping _(Required)_
- [ ] Reward, action, next-state and discount alignment _(Required)_
- [ ] Fixed-trajectory update oracles _(Required)_
- [ ] State-action visitation and coverage diagnostics _(Required)_
- [ ] Monte Carlo and TD bias, variance and sample efficiency _(Required)_
- [ ] Risky-policy differences between SARSA and Q-learning _(Required)_
- [ ] Trajectory schemas with environment, policy, seed and version identity _(Required)_
- [ ] Multiple random seeds and independent evaluation streams _(Required)_
- [ ] Average-reward continuing-task theory _(Optional)_
- [ ] General off-policy convergence proofs _(Later)_

### Resource route

- **Primary - Book:** [Reinforcement Learning: An Introduction - Chapters 5 to 7](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) - Study Chapters 5, 6 and 7 for Monte Carlo, TD, n-step methods, importance sampling, SARSA, expected SARSA and Q-learning. Implement each update from fixed hand-calculated trajectories before training an agent.
- **Required - Course:** [Stanford CS234 Winter 2026 - Policy Evaluation and Q-Learning](https://web.stanford.edu/class/cs234/modules.html) - Study Lecture Modules 3 and 4 and the relevant independent Assignment 1 and 2 questions. Use the course treatment to state model-access, convergence, coverage and function-approximation assumptions for each update.
- **Support - Tutorial:** [Hands-on Modern RL - Chapter 4 Classical Methods](https://walkinglabs.github.io/hands-on-modern-rl/en/) - Use Chapter 4 sections on dynamic programming, Monte Carlo, TD, policy sampling and reward design as a code companion. Rebuild the algorithms in the shared track schema and retain a case where a reward choice changes the learned behavior.
- **Reference - Documentation:** [Gymnasium Core API](https://gymnasium.farama.org/api/env/) - Use reset, step, seeding and wrapper documentation only as the behavior authority for the installed environment version. Test observation, reward, terminated, truncated and info fields at the boundary.
- **Required - Project:** [Reinforcement Learning Control Laboratory - Tabular Control](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/reinforcement-learning-control-laboratory.md) - Complete the MC, SARSA and Q-learning requirements with exact trajectory updates, stochastic and exploration-sensitive environments, visitation logs, matched interaction budgets and seeded alignment and bootstrap defects.

### Exit checkpoint

Implement Monte Carlo prediction, TD(0), SARSA and Q-learning from blank files, match fixed-trajectory updates, and explain a multi-seed on-policy versus off-policy result using coverage, target and terminal evidence.

<details>
<summary>Deliberately left for later</summary>

- Neural approximation until every tabular target passes a hand oracle
- Large benchmark suites or leaderboard reward targets
- Off-policy conclusions where behavior support and estimator variance are unknown

</details>

## RL-3. Deep RL I: Function Approximation and Stability

**Why:** Deep RL replaces tables with learned representations, which introduces moving targets and feedback loops. This stage makes semi-gradient assumptions, replay state, target networks and the deadly triad observable before larger policies hide an unstable update.

### Learn this much

- [ ] Value-function approximation and generalization across states _(Required)_
- [ ] Linear features, state aggregation and projected solutions _(Required)_
- [ ] Semi-gradient TD updates _(Required)_
- [ ] Mean-squared value error and Bellman-error distinctions _(Required)_
- [ ] On-policy prediction with function approximation _(Required)_
- [ ] Off-policy bootstrapping with function approximation _(Required)_
- [ ] The deadly triad: approximation, bootstrapping and off-policy data _(Required)_
- [ ] Baird-style divergence mechanism and controlled reproduction _(Required)_
- [ ] Neural action-value functions _(Required)_
- [ ] Replay-buffer ownership, capacity and sampling semantics _(Required)_
- [ ] Transition immutability and replay aliasing _(Required)_
- [ ] Replay age, policy drift and nonstationary data _(Required)_
- [ ] Target networks and hard update intervals _(Required)_
- [ ] Polyak target updates _(Required)_
- [ ] DQN targets, action gathering and gradient detachment _(Required)_
- [ ] Reward clipping, observation scaling and optimization effects _(Required)_
- [ ] Q scale, target scale, TD-error and gradient diagnostics _(Required)_
- [ ] Target lag, replay ratio and update-to-data ratio _(Required)_
- [ ] Maximization bias and double estimators _(Required)_
- [ ] Fixed-batch differential tests for DQN updates _(Required)_
- [ ] Checkpointing model, optimizer, replay and random state _(Required)_
- [ ] Training and evaluation exploration separation _(Required)_
- [ ] Dueling networks _(Optional)_
- [ ] Prioritized experience replay and correction weights _(Depth)_
- [ ] Distributional value learning _(Depth)_
- [ ] General nonlinear off-policy convergence theory _(Later)_

### Resource route

- **Primary - Course:** [Stanford CS224R Spring 2026 - Q-Learning and Off-Policy Methods](https://cs224r.stanford.edu/) - Study the Off-Policy Actor Critic and Q-learning lectures, the Q-learning extra section and the applicable Homework 2 fixed-update work. Reimplement the core update independently and follow Stanford honor-code restrictions for course materials.
- **Required - Paper:** [Playing Atari with Deep Reinforcement Learning](https://arxiv.org/abs/1312.5602) - Read the algorithm, replay and target-network design plus experimental protocol. Reproduce DQN on a small discrete environment, then ablate replay and target networks rather than attempting an Atari score reproduction.
- **Required - Paper:** [Deep Reinforcement Learning with Double Q-Learning](https://arxiv.org/abs/1509.06461) - Derive the action-selection and action-evaluation split, construct a noisy maximization example and compare DQN with Double DQN using identical samples and tuning budgets.
- **Support - Implementation:** [CleanRL DQN](https://docs.cleanrl.dev/rl-algorithms/dqn/) - Read the single-file DQN implementation and documented benchmark details after the blank-file update passes. Trace replay, target, seeding, termination and evaluation semantics, then compare one local run without copying the implementation.
- **Support - Tutorial:** [Hands-on Modern RL - Chapter 5 DQN](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter07_dqn/from-q-to-dqn) - Use Sections 5.1 through 5.4 for Q-learning to DQN, improvements, distributional vocabulary and a bounded LunarLander exercise. Pin the source revision and treat score claims as hypotheses requiring local seed and version evidence.
- **Required - Project:** [Reinforcement Learning Control Laboratory - Deep Value Core](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/reinforcement-learning-control-laboratory.md) - Implement DQN and Double DQN with replay and target state, fixed-batch target tests, checkpoint and resume, overestimation evidence and injected online-target, detach, action-gather and replay defects.

### Exit checkpoint

Reproduce a controlled deadly-triad failure, implement DQN and Double DQN with fixed-batch oracles, and explain stability across seeds using replay, target, value-scale and gradient evidence rather than final return alone.

<details>
<summary>Deliberately left for later</summary>

- Every published DQN extension or an Atari leaderboard campaign
- Continuous-control actor-critic methods before value-update state is explicit
- Claims that a stable learning curve proves a correct target or replay implementation

</details>

## RL-4. Deep RL II: Policy Gradients, Actor-Critic, GAE and PPO

**Why:** Policy optimization is the direct ancestor of modern language-model RL. This stage derives the estimator, proves what a baseline changes, implements actor-critic and GAE, and treats PPO clipping as a specific objective rather than a guarantee of safe updates.

### Learn this much

- [ ] Trajectory objectives and expected return _(Required)_
- [ ] Likelihood-ratio and score-function identities _(Required)_
- [ ] Policy-gradient theorem at working depth _(Required)_
- [ ] REINFORCE and Monte Carlo policy gradients _(Required)_
- [ ] Causality and reward-to-go _(Required)_
- [ ] Constant and state-dependent baselines _(Required)_
- [ ] Baseline unbiasedness and variance reduction _(Required)_
- [ ] Learned value baselines and critic targets _(Required)_
- [ ] Actor-critic data and update dependencies _(Required)_
- [ ] One-step and n-step advantage estimates _(Required)_
- [ ] Generalized Advantage Estimation _(Required)_
- [ ] Gamma and lambda bias-variance behavior _(Required)_
- [ ] Entropy regularization and exploration effects _(Required)_
- [ ] Old and new policy log probabilities _(Required)_
- [ ] Importance probability ratios and direction _(Required)_
- [ ] PPO clipped surrogate with advantage-sign cases _(Required)_
- [ ] Approximate KL as a diagnostic and stop signal _(Required)_
- [ ] Clip fraction, ratio and policy-update diagnostics _(Required)_
- [ ] Value loss, value clipping and loss coefficients _(Required)_
- [ ] Advantage centering, scaling and minibatch leakage _(Required)_
- [ ] Multiple epochs and induced off-policy drift _(Required)_
- [ ] Categorical and Gaussian action distributions _(Required)_
- [ ] Tanh-squashed actions and log-probability correction _(Required)_
- [ ] Vectorized rollouts and policy-version identity _(Required)_
- [ ] Fixed-trajectory loss, ratio, GAE and gradient tests _(Required)_
- [ ] Policy collapse, critic failure and stale-log-prob diagnosis _(Required)_
- [ ] Multi-seed return, entropy, KL and sample-efficiency evaluation _(Required)_
- [ ] Trust-region optimization and natural gradients _(Depth)_
- [ ] Full monotonic-improvement proofs _(Later)_

### Resource route

- **Primary - Course:** [Stanford CS224R Spring 2026 - Policy Gradients and Actor-Critic](https://cs224r.stanford.edu/) - Study the Policy Gradients and Actor-Critic lectures and Homework 2 sections on online RL. Derive each estimator first, implement it independently, and use fixed trajectories plus a small continuous-control task.
- **Required - Book:** [Reinforcement Learning: An Introduction - Chapter 13](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) - Study the policy-gradient theorem, REINFORCE, baselines and actor-critic sections. Derive the gradient and baseline result in the notation used by the shared trajectory schema.
- **Required - Paper:** [Proximal Policy Optimization Algorithms](https://arxiv.org/abs/1707.06347) - Read the clipped objective, implementation variants and experiments. Build hand cases for positive and negative advantages, compare clipped and unclipped losses and show that clipping alone does not enforce a hard KL bound.
- **Required - Paper:** [High-Dimensional Continuous Control Using Generalized Advantage Estimation](https://arxiv.org/abs/1506.02438) - Derive GAE from TD residuals, implement backward recursion with terminal and truncation masks and sweep gamma and lambda on fixed trajectories before training.
- **Support - Implementation:** [CleanRL PPO](https://docs.cleanrl.dev/rl-algorithms/ppo/) - Use the single-file implementation and implementation-details notes as a post-implementation audit. Trace rollout shapes, advantage calculation, minibatch epochs, ratios, clipping, value loss, entropy, seeding and environment semantics.
- **Support - Tutorial:** [Hands-on Modern RL - Chapters 6 to 8](https://walkinglabs.github.io/hands-on-modern-rl/en/) - Use the REINFORCE, actor-critic and PPO chapters for hands-on CartPole, Pendulum or BipedalWalker experiments. Complete Sections 6.4, 6.5, 7.4, 8.2, 8.3 and 8.4 selectively and pin the source revision.
- **Required - Project:** [Reinforcement Learning Control Laboratory - Policy Core](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/reinforcement-learning-control-laboratory.md) - Complete REINFORCE with baseline, actor-critic, GAE and PPO requirements. Match hand-computed log probabilities, advantages, ratios and clipped losses and diagnose stale-policy, ratio, GAE and evaluation leakage defects.

### Exit checkpoint

Derive REINFORCE and baseline unbiasedness, match actor-critic, GAE and PPO losses on fixed trajectories, and train a small policy across seeds while diagnosing two induced ratio, value, entropy or policy-version failures.

<details>
<summary>Deliberately left for later</summary>

- Treating PPO clipping as a trust-region or monotonic-improvement guarantee
- Large continuous-control benchmark sweeps before fixed-trajectory tests pass
- Language-model policy optimization until token and sequence contracts are introduced

</details>

## RL-5. Deep RL III: Exploration, Continuous Control and Empirical Method

**Why:** RL results change with exploration, environment wrappers, tuning effort and random seeds. This stage adds continuous-control and goal-conditioned mechanisms while building an evaluation protocol that can separate algorithmic gains from extra information, samples or compute.

### Learn this much

- [ ] Exploration and exploitation as a data-collection problem _(Required)_
- [ ] Undirected epsilon and entropy-based exploration _(Required)_
- [ ] Optimism and upper-confidence vocabulary _(Required)_
- [ ] Count, pseudocount and intrinsic-reward vocabulary _(Required)_
- [ ] Curiosity and representation-dependent novelty _(Required)_
- [ ] Sparse, delayed and deceptive reward environments _(Required)_
- [ ] State-action visitation and success coverage _(Required)_
- [ ] Exploration bonuses versus reward shaping _(Required)_
- [ ] Privileged information and unfair exploration comparisons _(Required)_
- [ ] Continuous action spaces and control constraints _(Required)_
- [ ] Deterministic policy gradients and DDPG vocabulary _(Required)_
- [ ] Twin critics, delayed updates and TD3 vocabulary _(Required)_
- [ ] Maximum-entropy RL and Soft Actor-Critic _(Required)_
- [ ] Automatic entropy-temperature tuning _(Required)_
- [ ] Goal-conditioned policies and relabeling _(Required)_
- [ ] Hindsight Experience Replay _(Required)_
- [ ] Partial observability and recurrent policy vocabulary _(Required)_
- [ ] Environment, wrapper and dependency version identity _(Required)_
- [ ] Action repeat, observation normalization and reward transformation _(Required)_
- [ ] Training versus deterministic or stochastic evaluation policy _(Required)_
- [ ] Seed, episode and environment as uncertainty units _(Required)_
- [ ] Interquartile mean, performance profiles and stratified bootstrap _(Required)_
- [ ] Matched environment-step, update, wall-time and compute budgets _(Required)_
- [ ] Hyperparameter tuning budget and final-evaluation isolation _(Required)_
- [ ] Checkpoint selection and all-attempt retention _(Required)_
- [ ] Vectorized-environment throughput and correlation _(Required)_
- [ ] Generalization across seeds, starts, dynamics and observation shifts _(Required)_
- [ ] Multi-agent and hierarchical exploration _(Depth)_
- [ ] Robotics sim-to-real validation _(Later)_

### Resource route

- **Primary - Course:** [Stanford CS234 Winter 2026 - Data-Efficient RL and Exploration](https://web.stanford.edu/class/cs234/modules.html) - Study Lecture Modules 8 through 12 on data-efficient RL, bandits, strategic data gathering, exploration and MCTS. Rebuild one exploration comparison with matched information, interaction, update and tuning budgets.
- **Required - Course:** [Stanford CS224R Spring 2026 - Off-Policy and Goal-Conditioned RL](https://cs224r.stanford.edu/) - Study the Off-Policy Actor Critic, Multi-Task and Goal-Conditioned RL lectures and their DDPG, HER and related readings. Implement one continuous-control baseline and one goal relabeling test on a small task.
- **Required - Paper:** [Soft Actor-Critic](https://arxiv.org/abs/1801.01290) - Read the maximum-entropy objective, actor and critic targets and temperature treatment. Implement or audit a compact SAC path and compare sample efficiency and wall time with PPO under a matched protocol.
- **Required - Paper:** [Deep Reinforcement Learning at the Edge of the Statistical Precipice](https://arxiv.org/abs/2108.13264) - Study the failure of common point estimates and small-seed comparisons. Report interval estimates, aggregate-score sensitivity and performance profiles with the underlying per-run data retained.
- **Support - Implementation:** [rliable](https://github.com/google-research/rliable) - Use the official repository to compute interquartile means, stratified bootstrap intervals and performance profiles for the track experiments. Verify the input run/task axes and keep plots reproducible from raw run records.
- **Support - Tutorial:** [Hands-on Modern RL - Chapters 9 and 12](https://walkinglabs.github.io/hands-on-modern-rl/en/) - Use Chapter 9 for DDPG, TD3 and SAC and Chapter 12 only for one intrinsic, multi-agent or hierarchical extension. Pin the revision and retain a case where the added exploration or continuous-control method loses.

### Exit checkpoint

Run one continuous-control and one exploration-sensitive comparison under matched samples, compute and tuning, then defend the conclusion with raw multi-seed records, robust aggregates, visitation evidence and a retained losing or unstable regime.

<details>
<summary>Deliberately left for later</summary>

- Robotics hardware and sim-to-real claims without physical evaluation
- Algorithm rankings based on a single seed or selected checkpoint
- Exploration gains that use extra interactions, privileged state or hidden reward shaping

</details>

## RL-6. Deep RL IV: Imitation, Offline RL and Off-Policy Evaluation

**Why:** Offline data removes the ability to repair coverage mistakes through interaction. This stage exposes covariate shift, support mismatch and estimator variance, establishes behavior cloning as a strong baseline and limits claims to what the logged policy and data can identify.

### Learn this much

- [ ] Demonstrations and behavior cloning _(Required)_
- [ ] Behavior-cloning likelihood and action distributions _(Required)_
- [ ] Covariate shift and compounding imitation error _(Required)_
- [ ] Interactive data aggregation and DAgger vocabulary _(Required)_
- [ ] Inverse reinforcement learning and reward-learning boundary _(Required)_
- [ ] GAIL and occupancy-matching vocabulary _(Required)_
- [ ] Offline transition datasets and behavior-policy identity _(Required)_
- [ ] Dataset coverage, support and action gaps _(Required)_
- [ ] Offline distribution shift and extrapolation error _(Required)_
- [ ] Pessimism and conservative value estimation _(Required)_
- [ ] Conservative Q-Learning vocabulary _(Required)_
- [ ] Implicit Q-Learning expectile and advantage weighting _(Required)_
- [ ] Advantage-weighted actor update vocabulary _(Required)_
- [ ] Decision Transformer and sequence-modeling view _(Optional)_
- [ ] Online fine-tuning after offline initialization _(Required)_
- [ ] Off-policy evaluation target and logging policies _(Required)_
- [ ] Trajectory and per-decision importance sampling for evaluation _(Required)_
- [ ] Weight clipping, normalization and effective sample size _(Required)_
- [ ] Direct, model-based and doubly robust estimator vocabulary _(Required)_
- [ ] Fitted Q Evaluation vocabulary _(Required)_
- [ ] Unsupported actions and impossible counterfactuals _(Required)_
- [ ] Offline model selection without online feedback _(Required)_
- [ ] Dataset quality, diversity and coverage sweeps _(Required)_
- [ ] Action and observation normalization consistency _(Required)_
- [ ] Policy abstention, fallback and data-collection triggers _(Required)_
- [ ] Online ground truth reserved for estimator audit _(Required)_
- [ ] Full offline-RL theory and minimax guarantees _(Depth)_
- [ ] High-stakes deployment from observational logs alone _(Later)_

### Resource route

- **Primary - Course:** [Stanford CS224R Spring 2026 - Imitation and Offline RL](https://cs224r.stanford.edu/) - Study the Imitation Learning and Offline RL lectures. Complete Homework 1 and Homework 3 concepts independently: behavior cloning, covariate shift, AWAC and IQL on a small dataset with held-out environment access used only for audit.
- **Required - Paper:** [Offline Reinforcement Learning: Tutorial, Review and Perspectives](https://arxiv.org/abs/2005.01643) - Study the problem definition, distribution-shift failure, policy constraints, uncertainty and model-based/model-free taxonomy. Use it to state which offline assumptions each implementation relies on.
- **Required - Paper:** [Implicit Q-Learning](https://arxiv.org/abs/2110.06169) - Derive the expectile value loss, Q target and advantage-weighted policy update. Implement fixed-batch loss tests and compare IQL with behavior cloning across dataset quality and coverage.
- **Support - Paper:** [DAgger](https://proceedings.mlr.press/v15/ross11a.html) - Read the no-regret reduction and interactive data-aggregation loop. Demonstrate compounding error in a controlled imitation task, then show exactly what additional expert queries change.
- **Support - Tutorial:** [Hands-on Modern RL - Chapters 10 and 11](https://walkinglabs.github.io/hands-on-modern-rl/en/) - Use Chapter 10 for offline data and distribution shift and Chapter 11 for behavior cloning, inverse RL and meta-RL connections. Implement only one bounded offline and one imitation experiment and pin the revision.
- **Support - Project:** [Reinforcement Learning Control Laboratory - Offline Stretch](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/reinforcement-learning-control-laboratory.md) - Add the project offline-data stretch only after online control passes. Calibrate importance or fitted-value estimates against simulator truth and expose one support-mismatch failure before hiding online access.

### Exit checkpoint

Build behavior-cloning and IQL-style baselines on a versioned dataset, expose a coverage failure, and show what an off-policy estimate can and cannot establish using weight, support and effective-sample-size diagnostics.

<details>
<summary>Deliberately left for later</summary>

- Selecting policies on hidden online returns while calling the study offline
- Deployment claims for unsupported actions or unlogged interventions
- A broad imitation, inverse-RL or offline-algorithm survey without one falsifiable data-support question

</details>

## RL-7. Deep RL V: Model-Based RL and World Models

**Why:** A learned dynamics model can improve data efficiency or create a new surface for exploitation. This stage connects prediction error to decisions, varies planning horizon and uncertainty, and requires a model-free baseline before complexity is justified.

### Learn this much

- [ ] Known versus learned transition and reward models _(Required)_
- [ ] System identification and data collection _(Required)_
- [ ] One-step and multi-step prediction objectives _(Required)_
- [ ] Open-loop rollout and closed-loop replanning _(Required)_
- [ ] Model Predictive Control _(Required)_
- [ ] Random shooting and cross-entropy method planning _(Required)_
- [ ] Dyna-style real and imagined experience _(Required)_
- [ ] Model ensembles and epistemic uncertainty _(Required)_
- [ ] Aleatoric uncertainty and stochastic dynamics _(Required)_
- [ ] Uncertainty penalties and pessimistic planning _(Required)_
- [ ] Compounding model error over horizon _(Required)_
- [ ] Decision-relevant versus average prediction error _(Required)_
- [ ] Policy-induced distribution shift _(Required)_
- [ ] Model exploitation and adversarial plans _(Required)_
- [ ] Rollout horizon and model-bias trade-offs _(Required)_
- [ ] Model-Based Policy Optimization _(Required)_
- [ ] Latent-state dynamics and representation learning _(Required)_
- [ ] World-model policy learning vocabulary _(Required)_
- [ ] Dreamer-style latent imagination _(Depth)_
- [ ] Monte Carlo Tree Search _(Optional)_
- [ ] Planner, model, reward and policy error attribution _(Required)_
- [ ] Known-dynamics oracle and simple-controller baseline _(Required)_
- [ ] Model-free baseline under matched real interactions _(Required)_
- [ ] Imagined versus real sample and compute accounting _(Required)_
- [ ] One-step, multi-step, uncertainty and control evaluation _(Required)_
- [ ] Data aggregation after policy distribution changes _(Required)_
- [ ] Fallback and replanning under uncertainty _(Required)_
- [ ] High-dimensional generative world-model research _(Later)_

### Resource route

- **Primary - Course:** [Stanford CS224R Spring 2026 - Model-Based RL](https://cs224r.stanford.edu/) - Study the Model-Based RL lecture and its Model-Based Policy Optimization reading. Implement a small dynamics model and MPC or short-horizon planner, then measure how prediction, uncertainty and control change with horizon.
- **Required - Paper:** [When to Trust Your Model: Model-Based Policy Optimization](https://arxiv.org/abs/1906.08253) - Study the model-error analysis and short model-rollout design. Reproduce a reduced real-plus-imagined-data comparison and retain the horizon where model bias reverses the gain.
- **Depth - Paper:** [Mastering Diverse Domains through World Models](https://arxiv.org/abs/2301.04104) - Read DreamerV3 only after the small explicit dynamics and planning path passes. Trace representation, latent dynamics, imagination and actor-critic state, but do not make a large benchmark reproduction part of the exit gate.
- **Support - Tutorial:** [Hands-on Modern RL - Model-Based and World-Model Sections](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter11_continuous_control/model-based) - Use Sections 9.3 and 9.4 for model-based RL, search and world models. Reproduce one small planner or model-error visualization, pin the revision and verify algorithm claims against the original paper.
- **Support - Project:** [Reinforcement Learning Control Laboratory - Model-Based Stretch](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/reinforcement-learning-control-laboratory.md) - Add a learned-dynamics stretch with a known-dynamics sanity case, prediction and planning tests, horizon sweeps, model-exploitation failure and matched model-free comparison.

### Exit checkpoint

Build a small learned-dynamics controller that passes a known-model oracle, induce compounding error or model exploitation, and defend whether it beats a simpler model-free or controller baseline under matched real samples and compute.

<details>
<summary>Deliberately left for later</summary>

- A foundation-scale generative world model before small decision-relevant errors are understood
- Sim-to-real or safety-critical control claims without real-world validation
- Planning improvements that use privileged simulator state or extra real interactions

</details>

## RL-8. LLM RL I: Language Models as Policies

**Why:** Language-model RL inherits policy-gradient mathematics but changes the action space, trajectory boundary and systems state. This stage maps prompts, tokens, completions and turns into explicit RL objects and proves sequence log-probability, masking, version and sampling contracts before optimizing a reward.

### Learn this much

- [ ] Prompt distribution, context and task instance as initial state _(Required)_
- [ ] Tokens as actions and autoregressive policy factorization _(Required)_
- [ ] Completion, conversation and tool episode as trajectory choices _(Required)_
- [ ] Contextual-bandit versus token-MDP versus environment-MDP formulations _(Required)_
- [ ] Hidden user, evaluator and environment state limitations _(Required)_
- [ ] Prompt, completion, padding, EOS and truncation masks _(Required)_
- [ ] Per-token and sequence log probabilities _(Required)_
- [ ] Summed, mean and length-normalized sequence scores _(Required)_
- [ ] Sequence, terminal, token and step-level rewards _(Required)_
- [ ] Reward placement and return propagation _(Required)_
- [ ] Policy, reference, critic, reward model and verifier roles _(Required)_
- [ ] SFT as behavior initialization and behavior cloning _(Required)_
- [ ] Base, SFT, reference and trainable policy identity _(Required)_
- [ ] On-policy, off-policy and replayed language trajectories _(Required)_
- [ ] Sampling temperature, top-p, top-k and generation policy identity _(Required)_
- [ ] Greedy, sampling, best-of-N, rejection and search as distinct inference policies _(Required)_
- [ ] Policy, tokenizer, template, reward, verifier and RNG version binding _(Required)_
- [ ] Immutable rollout records and old log probabilities _(Required)_
- [ ] Valid, invalid, refused, timed-out and truncated outcomes _(Required)_
- [ ] Token-level entropy and sequence-level diversity _(Required)_
- [ ] Forward and reverse KL direction vocabulary _(Required)_
- [ ] Reference-policy KL estimators and approximation limits _(Required)_
- [ ] Fixed-sequence log-probability and mask oracles _(Required)_
- [ ] Sampling, training and evaluation prompt separation _(Required)_
- [ ] Rollout tokens, verifier calls, latency and compute accounting _(Required)_
- [ ] Learned policy change versus inference-time selection _(Required)_
- [ ] Multi-turn tool environment and delayed credit _(Depth)_
- [ ] Transformer architecture and SFT mechanics already owned by LLM tracks _(Later)_

### Resource route

- **Primary - Book:** [RLHF Book - Introduction, Training Overview and Instruction Tuning](https://rlhfbook.com/) - Study Chapters 1, 3 and 4 plus Appendix A definitions. Map every RLHF component into the track trajectory schema, then implement assistant-only sequence log probabilities and completion masks against hand examples. Use the versioned public web edition.
- **Required - Course:** [RLHF Book Course - Lectures 0 and 1](https://rlhfbook.com/course) - Watch Lecture 0 for language-model and KL prerequisites and Lecture 1 for the post-training overview. Produce a component and state-ownership diagram tied to executable tests, not a second set of general notes.
- **Required - Paper:** [Training Language Models to Follow Instructions with Human Feedback](https://arxiv.org/abs/2203.02155) - Study the demonstration, comparison, reward-model and PPO pipeline plus evaluation design. Reconstruct the data and policy dependencies and state which results cannot be inferred from the paper at small scale.
- **Support - Project:** [Stanford CS224R 2026 LLM RL Default Project](https://cs224r.stanford.edu/material/CS224R_Default_Project_Guidelines.pdf) - Read Sections 1.1 through 1.4 for the Countdown task, distinct SFT, preference and verifier datasets, objective boundaries and evaluation. Use it as a design specification and write independent code; do not submit, copy or publish Stanford course solutions.
- **Support - Tutorial:** [Hands-on Modern RL - Chapter 13 RLHF Pipeline](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter15_rlhf/base-model-to-assistant) - Use Sections 13.1, 13.2, 13.4 and 13.9 for the base-to-assistant route and PPO-RLHF loop. Pin the repository commit, audit masks and log probabilities independently and defer scale engineering to RL-12.
- **Required - Project:** [LLM Post-Training Laboratory - Baseline and State Contract](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-3/llm-post-training-laboratory.md) - Build or reuse the laboratory frozen base, SFT and evaluation baseline plus immutable tokenizer, template, model, policy and rollout manifests. Complete fixed log-probability, mask and state-identity tests only in this stage.

### Exit checkpoint

Given a language or tool task, define the state, action, trajectory and reward boundary, then make masked sequence log probabilities, generation-policy metadata and immutable policy-versioned rollouts pass hand-computed tests.

<details>
<summary>Deliberately left for later</summary>

- Retraining a tokenizer, transformer or general SFT pipeline already owned by LLM Research
- Calling best-of-N or search a learned RL improvement without a matched control
- Multi-turn agent training before the single-completion trajectory and version contract passes

</details>

## RL-9. LLM RL II: Preferences, Reward Models and Verifiers

**Why:** RL optimizes the signal it receives, so feedback construction is part of the algorithm. This stage distinguishes subjective preference, learned proxy reward and executable verification, then attacks each signal before it can become the sole training or release metric.

### Learn this much

- [ ] Demonstrations, comparisons, rankings, ratings and critiques as distinct feedback _(Required)_
- [ ] Prompt sampling and policy-dependent response collection _(Required)_
- [ ] Annotator population, rubric and target-preference definition _(Required)_
- [ ] Pairwise preference triples and listwise comparisons _(Required)_
- [ ] Bradley-Terry preference likelihood _(Required)_
- [ ] Reward differences, additive identifiability and scale limits _(Required)_
- [ ] Pairwise reward-model architecture and training loss _(Required)_
- [ ] Reward-model held-out ranking accuracy _(Required)_
- [ ] Calibration, margins and disagreement slices _(Required)_
- [ ] Outcome reward models _(Required)_
- [ ] Process reward models and step boundaries _(Required)_
- [ ] Generative reward models and judge rationales _(Required)_
- [ ] Executable, rule-based and formal verifiers _(Required)_
- [ ] Verifier completeness, soundness and parser boundaries _(Required)_
- [ ] False-positive and false-negative verifier tests _(Required)_
- [ ] Format, verbosity, style and response-length shortcuts _(Required)_
- [ ] Reward distribution shift as the policy changes _(Required)_
- [ ] Reward overoptimization and proxy regression _(Required)_
- [ ] Active feedback collection and uncertain comparisons _(Required)_
- [ ] AI feedback, constitutions and rubric-conditioned labels _(Required)_
- [ ] Judge position, identity, self-preference and correlated-error bias _(Required)_
- [ ] Multiple reward components and scalarization policy _(Required)_
- [ ] Preference, reward and verifier version lineage _(Required)_
- [ ] Train reward versus independent task, human and safety evaluation _(Required)_
- [ ] Adversarial completions and hidden verifier tests _(Required)_
- [ ] Reward governance, rollback and collection stop rules _(Required)_
- [ ] Sensitive human-subject data collection _(Later)_
- [ ] Learned process supervision at frontier scale _(Depth)_

### Resource route

- **Primary - Book:** [RLHF Book - Reward Models, Preferences and Evaluation](https://rlhfbook.com/) - Study Chapters 5, 10, 11, 14 and 16. Implement the pairwise reward loss, compare outcome, process and generative reward roles, and build an adversarial feedback audit covering preference bias, reward shift and overoptimization.
- **Required - Course:** [RLHF Book Course - Lecture 2](https://rlhfbook.com/course) - Use Lecture 2 for instruction tuning, reward models and rejection sampling. Reproduce the reward-data-to-score path and keep rejection sampling as a non-RL selection baseline for later online optimization.
- **Required - Paper:** [Deep Reinforcement Learning from Human Preferences](https://arxiv.org/abs/1706.03741) - Study the preference-query, reward-learning and policy-optimization loop. Reproduce a tiny preference model or simulator and measure how label noise or policy shift changes reward accuracy and control quality.
- **Support - Paper:** [Constitutional AI: Harmlessness from AI Feedback](https://arxiv.org/abs/2212.08073) - Study supervised self-critique, AI preference feedback and RL from AI feedback. Implement a bounded rubric-conditioned comparison exercise and test judge correlation and principle ambiguity rather than reproducing the full pipeline.
- **Support - Course:** [Stanford CS224R 2026 - Reward Learning](https://cs224r.stanford.edu/) - Study the Reward Learning lecture and Homework 3 reward-learning portions. Use fixed chosen and rejected examples and a hidden adversarial split; follow course honor-code restrictions and write independent implementations.
- **Support - Tutorial:** [Hands-on Modern RL - RLHF Evaluation and Process Rewards](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter20_prm_search/outcome-vs-process) - Use Sections 13.3, 13.6, 13.7 and 17.1 through 17.4 plus Chapter 25 as an implementation map for AI feedback, hacking, process rewards and verifier tests. Pin the revision and check claims against original sources.
- **Required - Project:** [LLM Post-Training Laboratory - Reward and Adversarial Evaluation](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-3/llm-post-training-laboratory.md) - Complete the pairwise reward model, held-out and calibration analysis, deterministic verifier, judge-bias audit, reward-hacking probes and the required case where proxy reward improves while independent behavior worsens.

### Exit checkpoint

Train or simulate a preference reward model and build an executable verifier, then expose one policy-shift, length, format or judge shortcut and prove why training reward cannot be the sole model-selection criterion.

<details>
<summary>Deliberately left for later</summary>

- Collecting sensitive preferences without governance, consent and data controls
- Treating pairwise accuracy or verifier pass rate as complete behavioral evaluation
- Process-reward or model-judge scale claims without independent adversarial review

</details>

## RL-10. LLM RL III: Direct Preference Optimization

**Why:** Direct preference methods use an offline comparison dataset and a reference policy rather than fresh reward-guided rollouts. This stage derives that relationship precisely, implements sequence-level objectives and separates genuine preference learning from data support, formatting and length artifacts.

### Learn this much

- [ ] KL-regularized reward-maximization objective _(Required)_
- [ ] Optimal policy form under a reference policy _(Required)_
- [ ] Implicit reward reparameterization from policy ratios _(Required)_
- [ ] Bradley-Terry substitution and DPO derivation _(Required)_
- [ ] Chosen and rejected sequence log probabilities _(Required)_
- [ ] Policy and frozen reference log-ratio margins _(Required)_
- [ ] DPO logistic loss and beta _(Required)_
- [ ] Gradient weighting for easy, hard and mislabeled pairs _(Required)_
- [ ] Completion-only masks and prompt cancellation _(Required)_
- [ ] Summed versus length-normalized log probabilities _(Required)_
- [ ] Chosen-rejected order, sign and label invariants _(Required)_
- [ ] Reference-policy identity and drift _(Required)_
- [ ] Preference-dataset policy and support mismatch _(Required)_
- [ ] Offline objective versus online RL distinction _(Required)_
- [ ] SFT, preferred-fine-tuning and no-reference baselines _(Required)_
- [ ] IPO and preference-model misspecification _(Required)_
- [ ] Label smoothing and conservative DPO vocabulary _(Required)_
- [ ] KTO, ORPO and unpaired-feedback vocabulary _(Optional)_
- [ ] Online and iterative DPO variants _(Depth)_
- [ ] Margin, reward, KL, entropy, length and validity diagnostics _(Required)_
- [ ] Fixed-batch loss, gradient and invariance tests _(Required)_
- [ ] Tokenizer, chat-template and truncation consistency _(Required)_
- [ ] Preference accuracy versus downstream behavior _(Required)_
- [ ] Overoptimization as beta, epochs or data reuse increase _(Required)_
- [ ] Held-out prompt and annotator slices _(Required)_
- [ ] Compute-matched rejection and SFT controls _(Required)_
- [ ] External task, safety and style evaluation _(Required)_
- [ ] Exhaustive catalog of direct-alignment variants _(Later)_

### Resource route

- **Primary - Book:** [RLHF Book - Direct Alignment](https://rlhfbook.com/) - Study Chapter 8 and the direct-alignment code. Re-derive DPO from the KL-regularized objective, implement sequence log-ratio losses from blank tensors and test chosen-rejected swaps, prompt masking, reference drift and length normalization.
- **Required - Paper:** [Direct Preference Optimization](https://arxiv.org/abs/2305.18290) - Read the complete derivation, objective and experiments. State the preference-model and reference assumptions, then compare a scratch DPO update with SFT and rejection-style baselines on a held-out slice.
- **Required - Paper:** [A General Theoretical Paradigm to Understand Learning from Human Preferences](https://arxiv.org/abs/2310.12036) - Study the preference-model misspecification argument and IPO objective. Use one synthetic preference problem to compare DPO and IPO behavior as noise, margin and data reuse change.
- **Support - Course:** [Stanford CS224R 2026 - LLM Preference Optimization](https://cs224r.stanford.edu/) - Study the LLM Preference Optimization lecture and the IPO portion of the Default Project specification. Implement independently, preserve the reference policy and follow course material restrictions.
- **Support - Documentation:** [TRL DPO Trainer](https://huggingface.co/docs/trl/dpo_trainer) - After the scratch loss passes, inspect the current DPOTrainer data contract and options. Differential-test one tiny batch against the local objective and record library version, loss type, beta, padding, truncation and reference behavior.
- **Support - Tutorial:** [Hands-on Modern RL - Chapter 14 DPO](https://walkinglabs.github.io/hands-on-modern-rl/en/) - Use Sections 14.1, 14.2 and 14.4 for a bounded hands-on DPO experiment and metrics. Pin the revision, replace any opaque trainer-only step with a checked local loss and retain a beta or length regime where quality worsens.
- **Required - Project:** [LLM Post-Training Laboratory - Direct Preference Objective](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-3/llm-post-training-laboratory.md) - Complete the DPO-style objective with exact sequence log probabilities, frozen reference identity, fixed loss and gradient tests, common raw evaluation records, support analysis and reward, length, style and judge-hacking probes.

### Exit checkpoint

Derive and implement DPO from sequence log probabilities, pass sign, masking, reference and gradient oracles, and show with held-out evaluation how beta, length, label noise or dataset support can reverse an apparent preference gain.

<details>
<summary>Deliberately left for later</summary>

- Calling an offline pairwise objective on-policy reinforcement learning
- A survey of every preference-loss variant without a hypothesis that distinguishes one
- Model selection on the same preferences used to tune beta, epochs or checkpoints

</details>

## RL-11. LLM RL IV: Online Policy Optimization

**Why:** Online LLM RL samples from a changing policy, scores trajectories and updates from sparse, noisy or verifiable rewards. This stage transfers REINFORCE, PPO, RLOO and group-relative estimators into token space while making masks, policy lag, normalization and compute-matched controls testable.

### Learn this much

- [ ] On-policy prompt sampling and completion generation _(Required)_
- [ ] Sequence policy gradient for autoregressive trajectories _(Required)_
- [ ] Sparse terminal reward and per-token loss assignment _(Required)_
- [ ] REINFORCE estimator in token space _(Required)_
- [ ] Value-function critic and PPO-style RLHF _(Required)_
- [ ] Leave-one-out baselines and RLOO _(Required)_
- [ ] Grouped sampling and group-relative advantages _(Required)_
- [ ] GRPO objective and critic-free trade-offs _(Required)_
- [ ] All-equal, all-correct and all-wrong group behavior _(Required)_
- [ ] Within-prompt versus batch reward normalization _(Required)_
- [ ] Reward scaling, whitening and cross-prompt comparability _(Required)_
- [ ] Old-policy and current-policy token log probabilities _(Required)_
- [ ] Per-token importance ratios and sequence dependence _(Required)_
- [ ] Clipping and token, sequence or group loss aggregation _(Required)_
- [ ] Reference-policy KL penalties and estimators _(Required)_
- [ ] Reward placement, masks and truncated completions _(Required)_
- [ ] Length normalization, verbosity incentives and response boundaries _(Required)_
- [ ] Multiple gradient steps and off-policy drift _(Required)_
- [ ] Rollout freshness, policy lag and importance correction _(Required)_
- [ ] Critic memory and variance versus group sampling cost _(Required)_
- [ ] Entropy collapse, KL spikes and mode contraction _(Required)_
- [ ] Invalid output, verifier failure and zero-signal groups _(Required)_
- [ ] Prompt balancing, difficulty curricula and reward sparsity _(Required)_
- [ ] Fixed-rollout estimator, ratio, clipping and gradient tests _(Required)_
- [ ] SFT, DPO, rejection sampling and best-of-N controls _(Required)_
- [ ] Matched generated tokens, verifier calls, updates and wall time _(Required)_
- [ ] Reward, external quality, KL, entropy, length and validity traces _(Required)_
- [ ] DAPO, GSPO and newer stabilizing variants _(Depth)_
- [ ] Frontier-scale online RL convergence claims _(Later)_

### Resource route

- **Primary - Book:** [RLHF Book - Policy Gradients and Regularization](https://rlhfbook.com/) - Study Chapter 6 completely and Chapter 15 on KL and regularization. Implement REINFORCE, PPO-style, RLOO and GRPO fixed-rollout losses from the chapter equations, then verify masks, ratios, group baselines and one-gradient-step simplifications.
- **Required - Course:** [RLHF Book Course - Lectures 3 and 4](https://rlhfbook.com/course) - Use Lecture 3 for policy-gradient motivation and math and Lecture 4 for code, loss aggregation, asynchronous training and engineering. Reproduce the loss on a tiny frozen rollout before using any trainer library.
- **Required - Paper:** [Back to Basics: REINFORCE Style Optimization for Learning from Human Feedback](https://arxiv.org/abs/2402.14740) - Study the RLOO estimator, baseline construction and system simplifications. Compare RLOO with a value-baseline or grouped estimator under matched completions and reward calls.
- **Required - Paper:** [DeepSeekMath - GRPO](https://arxiv.org/abs/2402.03300) - Study the GRPO method and group-relative advantage construction, not the unrelated pretraining details. Implement all-equal and mixed-reward group tests and separate algorithmic changes from additional sampling.
- **Support - Documentation:** [TRL GRPO Trainer](https://huggingface.co/docs/trl/grpo_trainer) - After scratch estimator tests pass, inspect the current GRPOTrainer processing class, reward-function, generation, loss and logging contracts. Differential-test one batch and record version-dependent defaults explicitly.
- **Support - Tutorial:** [Hands-on Modern RL - Chapter 15 GRPO and RLVR](https://walkinglabs.github.io/hands-on-modern-rl/en/) - Use Sections 15.1 through 15.5 for GRPO, R1-style training, reward construction and environments. Run only a small verifier task, pin the revision and preserve zero-variance, length-hacking and invalid-output cases.
- **Support - Implementation:** [RLHF Book Code - Policy Gradients](https://github.com/natolambert/rlhf-book/tree/main/code) - Use the public code/policy_gradients package as a differential reference after the hand implementation passes. Trace every tensor to prompt, completion and policy version and extend the tests with stale-log-prob and mask defects.
- **Required - Project:** [LLM Post-Training Laboratory - Online RL](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-3/llm-post-training-laboratory.md) - Complete one PPO-style, RLOO or verifiable group-relative update with immutable rollouts, fixed tests, bounded queues, SFT and direct-preference controls, reward-hacking probes and all failed or filtered samples retained.

### Exit checkpoint

Implement and hand-check one value-based and one critic-free language-policy estimator, run a tiny verifiable online study, and show whether its gain survives matched SFT, direct-preference, rejection or best-of-N controls and reward-hacking tests.

<details>
<summary>Deliberately left for later</summary>

- Chasing a frontier reasoning score without matched sampling and verifier budgets
- Adding current algorithm acronyms before the base estimator and policy-version tests pass
- Distributed throughput optimization before single-device objective correctness is complete

</details>

## RL-12. LLM RL V: Reasoning, Agents and Scalable Training

**Why:** The final module extends the trajectory from one completion to reasoning and tool interaction, then studies the actor, verifier and learner system that produces training data. It requires controls that distinguish learned improvement from search, longer traces, reward loopholes, stale policies and extra compute.

### Learn this much

- [ ] Reinforcement learning with verifiable rewards _(Required)_
- [ ] Math, code and structured-output task environments _(Required)_
- [ ] Executable verifier isolation and adversarial hidden tests _(Required)_
- [ ] Outcome rewards and sparse terminal credit _(Required)_
- [ ] Process rewards and step-level credit assignment _(Required)_
- [ ] Reasoning traces, hidden reasoning and observable answers _(Required)_
- [ ] Inference-time search, self-consistency and answer aggregation _(Required)_
- [ ] Train-time learning versus test-time compute _(Required)_
- [ ] Rejection fine-tuning and rollout distillation _(Required)_
- [ ] On-policy teacher-student distillation vocabulary _(Required)_
- [ ] Reasoning length, budget control and invalid traces _(Required)_
- [ ] Multi-turn state, observations and tool-call actions _(Required)_
- [ ] Environment transitions, tool results and terminal conditions _(Required)_
- [ ] Trajectory-level rewards and delayed credit for agents _(Required)_
- [ ] Sandbox, reset, deterministic replay and side-effect boundaries _(Required)_
- [ ] Tool-error, timeout, retry and duplicate-action semantics _(Required)_
- [ ] Actor, rollout worker, reward or verifier and learner roles _(Required)_
- [ ] Synchronous versus asynchronous rollout-update loops _(Required)_
- [ ] Policy broadcast, rollout policy version and staleness _(Required)_
- [ ] Colocated versus disaggregated generation and training _(Required)_
- [ ] Generation batching, backpressure and learner starvation _(Required)_
- [ ] Checkpoint, rollout, optimizer and sampler recovery _(Required)_
- [ ] Retry deduplication and failed-rollout accounting _(Required)_
- [ ] Prompt curriculum, filtering and evolving data distributions _(Required)_
- [ ] Rollout tokens per second, verifier throughput and update utilization _(Required)_
- [ ] Sample, inference, training and total compute accounting _(Required)_
- [ ] Independent reasoning, capability, safety and agent evaluation _(Required)_
- [ ] Reward hacking, specification gaming and held-out environment shifts _(Required)_
- [ ] Clean reproduction and prespecified objective, reward or system extension _(Required)_
- [ ] Multi-agent self-play and automated curriculum generation _(Depth)_
- [ ] Multimodal, embodied and production agent training _(Later)_

### Resource route

- **Primary - Book:** [RLHF Book - Reasoning, Synthetic Data, Tools and Evaluation](https://rlhfbook.com/) - Study Chapters 7, 12, 13, 14 and 16. Build a claim map separating RLVR learning, inference-time search, on-policy distillation, tool trajectories, reward overoptimization and independent evaluation.
- **Required - Course:** [RLHF Book Course - Lectures 5 to 7](https://rlhfbook.com/course) - Use Lecture 5 for RLVR and reasoning, Lecture 6 to retain the direct-preference control and Lecture 7 for synthetic data, on-policy distillation, AI feedback and rubrics. Tie every mechanism to a distinct data and compute budget.
- **Required - Paper:** [DeepSeek-R1 Technical Report](https://arxiv.org/abs/2501.12948) - Study the R1-Zero and R1 training pipeline, reward design, observed behaviors and limitations. Reproduce only a reduced verifier-driven question and test whether longer sampling or selection explains the observed gain.
- **Required - Project:** [Stanford CS224R 2026 LLM RL Default Project - Extension](https://cs224r.stanford.edu/material/CS224R_Default_Project_Guidelines.pdf) - Use the specification sections on SFT, IPO, RLOO, evaluation and one extension such as off-policy sampling, test-time inference, exploration, self-play or tool reasoning. Build independent code on a distinct task and respect all course restrictions.
- **Support - Tutorial:** [Hands-on Modern RL - Reasoning, Agentic RL and Safety](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter22_agentic/build-agentic-training-system) - Use Chapters 16 through 19 and 25 selectively: one reasoning/search control, one multi-turn tool environment, the from-scratch agentic trainer exercise and the reward-hacking evaluation chapter. Pin a commit and skip under-construction or unverifiable claims.
- **Support - Implementation:** [veRL](https://github.com/volcengine/verl) - Inspect the official hybrid-controller architecture, worker roles, supported algorithms and examples after single-device losses pass. Trace one rollout from generation through reward and update, record policy lag and run only hardware-compatible examples.
- **Required - Project:** [LLM Post-Training Laboratory - Final Integration](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-3/llm-post-training-laboratory.md) - Finish the bounded rollout and verification queue, reasoning or tool extension, independent clean and adversarial evaluation, reward-hacking postmortem, policy-lag and throughput records, clean reproduction and one prespecified negative or positive result.
- **Support - Assessment:** [Reinforcement Learning Checkpoint](https://github.com/saisandeshk/Roadmap-Final/blob/main/checkpoints/reinforcement-learning.md) - Take the checkpoint closed-note after the integrated project. Pass the estimator and state reconstruction, unseen failure diagnosis, matched-budget comparison, external evaluation and research-readiness clauses.

### Exit checkpoint

Complete a small reasoning or tool-use RL study with versioned trajectories and a reproducible rollout-update path, then defend a learned-policy claim against search, length, verifier, staleness and compute explanations using independent evaluation and a retained negative result.

<details>
<summary>Deliberately left for later</summary>

- Production agent runtime, tool security and deployment ownership already assigned to AI Engineering
- General multi-GPU sharding, checkpointing and fleet operation already assigned to Distributed Training
- Frontier-scale capability, safety or alignment claims from a reduced local experiment

</details>

## Track milestone

### Sequential Learning and Language-Policy Laboratory

Carry one evidence schema from an exact finite MDP through neural value and policy optimization into a small language or tool environment, preserving objectives, sampled data, policy versions, failures, budgets and independent evaluation at every transition.

- A classical-control core with an explicit MDP, exact planning oracles, Monte Carlo and TD control, fixed-trajectory tests, termination and truncation semantics, visitation and support diagnostics, and one minimized reward or bootstrap failure.
- A deep-RL laboratory with DQN or Double DQN, actor-critic and PPO, one exploration or continuous-control study, one offline or model-based study, complete replay and rollout state, robust multi-seed reporting, matched sample and compute budgets, ablations and retained unstable runs.
- A small LLM-RL evidence pack with immutable model, policy, reference, reward, verifier and trajectory versions; scratch preference and online-policy objectives; SFT, DPO or rejection and search controls; reasoning or tool-use integration; reward-hacking attacks; policy-lag and system metrics; independent capability and safety evaluation; clean reproduction; and one prespecified extension with an honest negative regime.

