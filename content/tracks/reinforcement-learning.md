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

### Study units

#### U1. Sequential decisions, contextual bandits and the agent-environment boundary

**About 3 h** · **Target:** Explain

Topics: Sequential decisions versus supervised prediction and contextual bandits; Agent, environment and interaction boundary

Supervised learning predicts a label for a fixed input. RL chooses actions that change what happens next. If the boundary is drawn in the wrong place, later values optimize the wrong loop.

**You can now**

- Explain how supervised prediction, contextual bandits and full RL differ in whether actions change future situations.
- Draw the agent-environment loop and name what belongs to the agent and what belongs to the environment.
- Decide whether a new task is a bandit, a contextual bandit or a sequential MDP and state what information the policy may use.

**Study**

1. [Lecture 1 sequential decisions and agent-environment loop](https://web.stanford.edu/class/cs234/slides/lecture1pre.pdf) (Stanford CS234 Winter 2026 - Foundations and Planning) - Sequential Decision Process: Agent and the World through Types of Sequential Decision Processes (slides 34 to 38 in the footer), with History (slide 35) and Markov Assumption (slide 36) for context.
2. [Agent-environment interface](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) (Reinforcement Learning: An Introduction (2nd ed.) - Chapters 3 and 4) - Chapter 3, Section 3.1, The Agent-Environment Interface, Figure 3.1 and trajectory (3.1) with dynamics (3.2) and (3.3), printed pp. 47 to 49. The authors post the full text free at incompleteideas.net.
3. [Associative search as contextual bandits](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) (Reinforcement Learning: An Introduction (2nd ed.) - Chapter 2 bandits) - Chapter 2, Section 2.9, Associative Search (Contextual Bandits), with Exercise 2.10, printed p. 41. The authors post the full text free at incompleteideas.net.
4. [Two slot machines and three policies](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter03_mdp/bandit#two-slot-machines) (Hands-on Modern RL - MDPs, Values and Bellman Equations) - Two Slot Machines and Three Policies, Three Outcomes with the 60 percent and 40 percent machines and expected rewards 0.2 and minus 0.2 (page read 2026-10-14).

**Focus**

- Supervised learning uses fixed input-output pairs. RL uses trial and error with delayed consequences. Bandits remove state change to isolate exploration.
- The agent selects $`A_t`$ from $`S_t`$. The environment returns $`R_{t+1}`$ and $`S_{t+1}`$. Everything outside the agent is the environment.
- Contextual bandits add a context that selects the payoff table, but actions still affect only immediate reward. Full RL lets actions change the next situation.

**Reproduce:** Closed-book, draw the loop with $`S_t`$, $`A_t`$, $`R_{t+1}`$ and $`S_{t+1}`$ and compute expected per-pull rewards for 60 percent and 40 percent machines with plus 1 and minus 1 rewards, then totals for uniform random and always-A over 100 rounds: 0.2 and minus 0.2 per pull, 0 and 20 in total.

**Traps**

- Treating a contextual bandit as full RL and adding discounting and bootstrapping where no next state exists.
- Drawing the boundary so the agent owns the reward function or the physics. The environment owns dynamics and reward. The agent owns the policy and value estimates.
- Assuming greedy action selection solves exploration. With 10 pulls each on 60 versus 40, about 0.128 of experiments rank the worse arm first, so exploitation inherits estimation error.

**Practice**

- [Sutton and Barto Exercises 3.1 to 3.3: MDP framing drills](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) - Exercises 3.1, 3.2 and 3.3, printed p. 51; write three tasks, test MDP adequacy and action-definition effects. Do on paper before the formulation unit. Keep one example where the Markov state is debatable. The authors post the full text free at incompleteideas.net.

**Stop when:** You draw the loop from memory, classify three new tasks as bandit, contextual bandit or MDP, and compute the two expected totals without notes.

<details>
<summary>Self-test</summary>

1. When is a task a contextual bandit rather than full RL?
   - When a context selects the payoff table but the action affects only immediate reward and not the next situation. Full RL lets actions change the next state.
2. Who owns what in Sutton Figure 3.1?
   - The agent owns the policy and value estimates. The environment owns the dynamics $`p`$ and the reward. State and reward pass from environment to agent. Action passes back.
3. What are the expected totals for uniform random and always-A over 100 rounds on the 60 versus 40 machines?
   - Uniform random gives 0 per round and 0 in total. Always-A gives 0.2 per round and 20 in total.
4. Why can 10 pulls each still pick the worse machine?
   - Small-sample noise can reverse the order. About 0.128 of experiments give more wins to B than to A, so committing to the observed winner locks in the mistake.

</details>

#### U2. States, observations, the Markov property, transition kernels and rewards

**About 4 h** · **Target:** Explain + Derive

Topics: State, observation and the Markov property; Action spaces, transition kernels and reward functions

Values condition on state. If the state omits history the learner needs, Bellman updates average over different situations as if they were one.

**You can now**

- Explain the Markov property with $`p(S_{t+1} \mid S_t, A_t) = p(S_{t+1} \mid H_t, A_t)`$ and give a non-Markov observation example.
- Write the dynamics $`p(s', r \mid s, a)`$ and derive $`p(s' \mid s, a)`$, $`r(s, a)`$ and $`r(s, a, s')`$ by marginalization.
- Distinguish state, observation and history and state what must be added to restore Markov structure.

**Study**

1. [Dynamics, Markov property and derived quantities](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) (Reinforcement Learning: An Introduction (2nd ed.) - Chapters 3 and 4) - Chapter 3, Section 3.1 dynamics (3.2) to (3.6), Markov property and state requirement, printed pp. 47 to 49. The authors post the full text free at incompleteideas.net.
2. [History, Markov assumption and Mars Rover model](https://web.stanford.edu/class/cs234/slides/lecture1pre.pdf) (Stanford CS234 Winter 2026 - Foundations and Planning) - History, Markov Assumption and Why Markov is Popular (slides 35 to 37); Mars Rover MDP Model with $`p`$ and $`r`$ definitions (slides 39 to 40).
3. [MDP tuple with bandit, CartPole and LLM table](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter03_mdp/mdp#the-mdp-tuple-state-action-and-environment) (Hands-on Modern RL - MDPs, Values and Bellman Equations) - The MDP Tuple: State, Action, and Environment with the bandit, CartPole and LLM table and the CartPole 4D state example (page read 2026-10-14).

**Focus**

- Markov means the future is independent of the past given the present. History $`H_t`$ collapses to $`S_t`$.
- The four-argument $`p(s', r \mid s, a)`$ sums to 1 over $`s'`$ and $`r`$ for each $`s`$ and $`a`$. Other quantities come from summing out $`r`$ or $`s'`$.
- Observation is what the agent receives. State is what determines what happens next. If $`S_t = O_t`$ is insufficient, augment with history, velocity, time remaining or belief.

**Reproduce:** Closed-book, write $`p(s' \mid s, a)`$ and $`r(s, a)`$ from $`p(s', r \mid s, a)`$ and show the normalization sums to 1. Use a toy where one action gives $`(s'_1, r=1)`$ with 0.7 and $`(s'_2, r=0)`$ with 0.3, so $`p(s'_1 \mid s, a) = 0.7`$ and $`r(s, a) = 0.7`$.

**Traps**

- Calling an observation a Markov state because it looks complete. CartPole angle without angular velocity is the standard counterexample on the Hands-on page.
- Normalizing $`p`$ over the wrong axis. Sum over $`s'`$ and $`r`$, not over $`s`$ and $`a`$.
- Treating deterministic physics as a known model. Unknown $`P`$ is the usual case. Planning assumes known $`P`$ only as a baseline.

**Practice**

- [Sutton and Barto Exercise 3.4: recycling robot dynamics table](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) - Exercise 3.4, printed p. 53; write the $`p(s', r \mid s, a)`$ table analogous to Example 3.3. The authors post the full text free at incompleteideas.net. Check that each $`s`$ and $`a`$ row sums to 1 and that your derived $`p(s' \mid s, a)`$ matches (3.4).

**Stop when:** You derive the three derived quantities from a new $`p`$ table without notes and spot one non-Markov observation with its fix.

<details>
<summary>Self-test</summary>

1. State the Markov property in one equation.
   - The state $`S_t`$ is Markov when $`p(S_{t+1} \mid S_t, A_t) = p(S_{t+1} \mid H_t, A_t)`$. The future depends on history only through the present state and action.
2. How do you get $`r(s, a)`$ from $`p(s', r \mid s, a)`$?
   - Weight each reward by its probability and sum out the next state: $`r(s, a) = \sum_{s', r} r p(s', r \mid s, a)`$.
3. Why is angle-only CartPole not Markov?
   - The same angle with different angular velocities leads to different next angles. Add velocity to restore the property.
4. How is a bandit an MDP?
   - It has a single state. The transition always returns to that state. Actions affect only immediate reward.

</details>

#### U3. Trajectories, episodes, horizons, discounting, termination and truncation

**About 4 h** · **Target:** Explain + Implement

Topics: Trajectories, episodes and continuing tasks; Finite and infinite horizons; Discounting, termination and truncation as separate semantics

Every later target multiplies by $`(1 - \text{terminated})`$. One wrong flag turns a time limit into a terminal value and poisons all values.

**You can now**

- Explain episodic, continuing, finite-horizon and infinite-horizon tasks and where $`H`$ and $`\gamma`$ belong.
- Distinguish termination with no bootstrap from truncation with bootstrap and implement the correct target.
- Run a Gymnasium time-limit check that proves which flag bootstraps on the installed release.

**Study**

1. [Returns, episodes and unified notation](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) (Reinforcement Learning: An Introduction (2nd ed.) - Chapters 3 and 4) - Chapter 3, Sections 3.3 Returns and Episodes and 3.4 Unified Notation for Episodic and Continuing Tasks, returns (3.7) to (3.11) with Exercises 3.8 and 3.9, printed pp. 54 to 57. The authors post the full text free at incompleteideas.net.
2. [Handling Time Limits: termination versus truncation](https://gymnasium.farama.org/tutorials/gymnasium_basics/handling_time_limits/) (Gymnasium - Time Limits and Episode Semantics) - Termination, Truncation, Importance in learning code and Solution; the correct target uses $`(1 - \text{terminated})`$ (page read 2026-10-14).
3. [Vector autoreset modes](https://farama.org/Vector-Autoreset-Mode) (Gymnasium - Time Limits and Episode Semantics) - Next-Step Mode as default with `make_vec`, Same-Step Mode with `final_obs` and Disabled Mode (page read 2026-10-14). The page does not state the autoreset step's reward; check it on your Gymnasium version as in Reproduce.
4. [Assignment 1 horizon questions](https://web.stanford.edu/class/cs234/assignments/a1/CS234_A1_Questions.pdf) (Stanford CS234 Winter 2026 - Foundations and Planning) - Section 1, Effect of Effective Horizon, parts (a) to (d), pp. 1 to 2; inventory MDP with horizon $`H`$ versus discount $`\gamma`$. Depth: Answer on paper. Do not start the RiverSwim code here.

**Focus**

- Episodic tasks end in terminal states. Continuing tasks have no terminal. Finite-horizon tasks stop after $`H`$ steps even without a terminal.
- Termination means $`V = 0`$ after. Truncation means keep $`\gamma V(S')`$. Code must use $`(1 - \text{terminated})`$, not $`(1 - \text{done})`$.
- In Gymnasium 1.4.0 a single `Env` needs manual `reset` after done. `SyncVectorEnv` with default `NEXT_STEP` returns the true final first, then a fake autoreset step with reward 0 and both flags false. Never store that step as a transition.

**Reproduce:** With `gymnasium.make("CartPole-v1", max_episode_steps=5)` and `env.reset(seed=0)`, show step 5 ends with `terminated=False` and `truncated=True`. With a 2-env `SyncVectorEnv` show step 5 has reward 1 with truncation true, then step 6 has reward 0 with both flags false.

**Traps**

- Using `done = terminated or truncated` to cut the bootstrap. Truncation must still bootstrap.
- Storing the `NEXT_STEP` autoreset transition. Its observation is the reset state and its reward is 0. It is not a transition.
- Adding remaining time to the observation for external truncation. The tutorial reserves that fix for finite-horizon inherent limits.

**Practice**

- [Stanford CS234 Assignment 1, Section 1: horizon versus discount](https://web.stanford.edu/class/cs234/assignments/a1/CS234_A1_Questions.pdf) - Section 1, parts (a) to (d), pp. 1 to 2; inventory starting at state 3 with horizon $`H`$ and discount $`\gamma`$. Answer on paper. Then confirm the flag behavior with the CartPole checks in Reproduce. The section mini-project covers seeded terminal defects.

**Stop when:** Your single-env and vector checks print the flags above, and you can state the bootstrap rule without notes.

<details>
<summary>Self-test</summary>

1. With $`\gamma = 0.5`$ and rewards 1, 2, 6, 3, 2 over 5 steps, what are $`G_0`$ to $`G_5`$?
   - $`G_5 = 0`$, $`G_4 = 2`$, $`G_3 = 4`$, $`G_2 = 8`$, $`G_1 = 6`$, $`G_0 = 4`$. Work backward from $`G_t = R_{t+1} + \gamma G_{t+1}`$.
2. With $`\gamma = 0.9`$ and reward 2 then infinite 7s, what are $`G_1`$ and $`G_0`$?
   - $`G_1 = 70`$ from $`7/(1-0.9)`$. $`G_0 = 65`$ from $`2 + 0.9 \times 70`$.
3. What is the correct one-step value target at termination versus truncation?
   - At termination use $`r`$. At truncation use $`r + \gamma V(S')`$. In code use `vf_target = rew + gamma * (1 - terminated) * vf_next_state`.
4. What does the vector step after done return under the default mode?
   - Reward 0 with both flags false and the reset observation. Skip it in buffers and losses.

</details>

#### U4. Policies, returns, reward-to-go, values and advantages

**About 4 h** · **Target:** Derive

Topics: Deterministic and stochastic policies; Returns and reward-to-go; State values, action values and advantages

Advantages and baselines later subtract $`V`$ from $`Q`$. If the identity is shaky, every policy-gradient baseline looks like magic.

**You can now**

- Compute returns $`G_t`$ and reward-to-go from a trajectory with correct discount exponents.
- Derive $`V_\pi`$, $`Q_\pi`$ and $`A_\pi`$ and the identity $`V_\pi(s) = \sum_a \pi(a \mid s) Q_\pi(s, a)`$.
- Explain deterministic versus stochastic policies and where $`\pi(a \mid s)`$ belongs in expectations.

**Study**

1. [Policies, returns and value definitions](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) (Reinforcement Learning: An Introduction (2nd ed.) - Chapters 3 and 4) - Chapter 3, Section 3.3 returns (3.7) to (3.11) and Section 3.5 Policies and Value Functions with $`v_\pi`$ (3.12), $`q_\pi`$ (3.13) and Exercises 3.12 and 3.13, printed pp. 54 to 58. The authors post the full text free at incompleteideas.net.
2. [Policies, returns and the V-Q identity](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter03_mdp/policy-value#the-relationship-between-v-and-q) (Hands-on Modern RL - MDPs, Values and Bellman Equations) - Policies and Decision Rules with the CartPole 4D example, Returns and Trajectory Evaluation with the three-step 2.71 return, and The Relationship Between V and Q with the 0.25 and 0.75 example giving 100 plus the corridor 0.81, 0.90 and 1.00 example (page read 2026-10-14). The 0.7 and 0.3 example giving 8.2 is on the value-bellman page under Derivation.
3. [MDP policies and state-action values](https://web.stanford.edu/class/cs234/slides/lecture2pre.pdf) (Stanford CS234 Winter 2026 - Foundations and Planning) - MDP Policies with deterministic versus stochastic $`\pi(a \mid s)`$ (slide 10) and State-Action Value Q with $`Q^\pi(s, a)`$ definition (slide 20).

**Focus**

- $`G_t = R_{t+1} + \gamma R_{t+2} + \cdots`$ with exponents counting from $`t`$. Reward-to-go excludes past rewards.
- $`V_\pi(s) = \mathbb{E}_\pi[G_t \mid S_t = s]`$, $`Q_\pi(s, a) = \mathbb{E}_\pi[G_t \mid S_t = s, A_t = a]`$ and $`A_\pi = Q_\pi - V_\pi`$. The state value averages action values under $`\pi`$.
- Deterministic $`a = \pi(s)`$ is a degenerate stochastic policy. Expectations still sum over $`\pi(a \mid s)`$.

**Reproduce:** Closed-book, compute $`G_0 = 3.439`$ for rewards 1, 1, 1, 1 with $`\gamma = 0.9`$, then $`V = 8.2`$ from $`Q`$ values 10 and 4 with weights 0.7 and 0.3, then corridor values 1.00, 0.90 and 0.81 with $`\gamma = 0.9`$ and terminal reward 1.

**Traps**

- Including past rewards in reward-to-go. $`G_t`$ starts at $`R_{t+1}`$.
- Treating $`V`$ as a property of the state alone. The same state under different $`\pi`$ has different $`V`$.
- Averaging $`Q`$ with the wrong weights. Use $`\pi(a \mid s)`$, not uniform weights, unless the policy is uniform.

**Practice**

- [Sutton and Barto Exercises 3.12 and 3.13: V-Q identities](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) - Exercises 3.12 and 3.13, printed p. 58; write $`v_\pi`$ in terms of $`q_\pi`$ and $`\pi`$, then $`q_\pi`$ in terms of $`v_\pi`$ and $`p`$. The authors post the full text free at incompleteideas.net. Derive on paper first. Check against the Hands-on 8.2 example.

**Stop when:** You compute returns, $`V`$, $`Q`$ and $`A`$ on a new three-step trajectory without notes and state the averaging identity correctly.

<details>
<summary>Self-test</summary>

1. What is $`G_0`$ for four rewards of 1 with $`\gamma = 0.9`$?
   - $`1 + 0.9 + 0.81 + 0.729 = 3.439`$. Each later reward gains one more power of $`\gamma`$.
2. How do you get $`V`$ from $`Q`$ when $`\pi`$ picks right with 0.7 and left with 0.3 and the action values are 10 and 4?
   - $`V = 0.7 \times 10 + 0.3 \times 4 = 8.2`$. The state value is the policy-weighted average.
3. In the corridor $`S_0 \to S_1 \to S_2 \to`$ terminal with reward 1 on entering the terminal and $`\gamma = 0.9`$, what are $`V(S_2)`$, $`V(S_1)`$ and $`V(S_0)`$?
   - 1.00, 0.90 and 0.81. Each extra step back from the terminal multiplies by 0.9.
4. What is the advantage of an action with $`Q = 10`$ in a state with $`V = 8.2`$?
   - $`A = 10 - 8.2 = 1.8`$. Positive means better than the policy average.

</details>

#### U5. Bellman expectation and optimality equations

**About 4 h** · **Target:** Derive

Topics: Bellman expectation equations for policies; Bellman optimality equations

Planning iterates these equations. If the derivation is shaky, policy evaluation and value iteration look like arbitrary updates.

**You can now**

- Derive Bellman expectation equations for $`V_\pi`$ and $`Q_\pi`$ from $`G_t = R_{t+1} + \gamma G_{t+1}`$.
- Derive Bellman optimality equations for $`V_*`$ and $`Q_*`$ and state where maximum replaces expectation.
- Explain why $`\mathbb{E}[G_{t+1} \mid S_t = s] = V(S_{t+1})`$ is wrong and what the correct marginalization gives.

**Study**

1. [Bellman expectation and optimality](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) (Reinforcement Learning: An Introduction (2nd ed.) - Chapters 3 and 4) - Chapter 3, Sections 3.5 Policies and Value Functions and 3.6 Optimal Policies and Optimal Value Functions, equations (3.12) to (3.19), printed pp. 58 to 66. The authors post the full text free at incompleteideas.net.
2. [Bellman derivation with the wrong-equality warning](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter03_mdp/value-bellman#derivation) (Hands-on Modern RL - MDPs, Values and Bellman Equations) - Derivation with the warning that direct equality is wrong and the three-tool marginalization, plus Matrix Form with $`(I - \gamma P)^{-1} r`$ (page read 2026-10-14).
3. [Optimality with the two-step numbers](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter03_mdp/value-bellman#bellman-optimality-equation) (Hands-on Modern RL - MDPs, Values and Bellman Equations) - Bellman Optimality Equation with the two-step example giving 8 for right and 4 for left, so $`V_* = 8`$ (page read 2026-10-14).
4. [Bellman equation and backup operator](https://web.stanford.edu/class/cs234/slides/lecture2pre.pdf) (Stanford CS234 Winter 2026 - Foundations and Planning) - Bellman Equation and Bellman Backup Operators with $`V^\pi`$ and $`BV`$ definitions (slide 33).

**Focus**

- Expectation equations average over $`\pi`$ and $`p`$. Optimality equations maximize over $`a`$.
- The recursion comes from $`G_t = R_{t+1} + \gamma G_{t+1}`$ plus Markov conditioning, not from intuition.
- The $`V`$ and $`Q`$ forms imply each other through $`V_\pi(s) = \sum_a \pi(a \mid s) Q_\pi(s, a)`$.

**Reproduce:** Closed-book, derive both expectation equations from the return recursion on a two-action toy, then compute the Hands-on two-step case with optimal futures 8 and 4 to get $`V_* = 8`$ and $`Q_*`$ values 8 and 4.

**Traps**

- Writing $`\mathbb{E}[G_{t+1} \mid S_t] = V(S_{t+1})`$. The left side averages over next states. The right side is still random. The correct form sums $`p(s' \mid s) V(s')`$.
- Putting maximum inside the transition expectation. Maximum is over actions. Expectation over next states remains.
- Assuming the optimal policy is unique. $`V_*`$ is unique. Several $`\pi_*`$ can tie, as the gambler family later shows.

**Practice**

- [Sutton and Barto Exercises 3.14 and 3.17: Bellman checks](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) - Exercise 3.14 on Figure 3.2, printed p. 60, and Exercise 3.17 on action-value Bellman, printed p. 61. The authors post the full text free at incompleteideas.net. Verify numerically that (3.14) holds for each state in the figure before moving to evaluation.

**Stop when:** You derive both expectation forms and both optimality forms without notes and can point to where maximum replaces averaging.

<details>
<summary>Self-test</summary>

1. What are the Bellman expectation equations for $`V_\pi`$ and $`Q_\pi`$?
   - $`V_\pi(s) = \sum_a \pi(a \mid s) [r(s, a) + \gamma \sum_{s'} p(s' \mid s, a) V_\pi(s')]`$. $`Q_\pi(s, a) = r(s, a) + \gamma \sum_{s'} p(s' \mid s, a) V_\pi(s')`$.
2. What changes for $`V_*`$ and $`Q_*`$?
   - Policy averaging becomes maximization: $`V_*(s) = \max_a [r(s, a) + \gamma \sum_{s'} p(s' \mid s, a) V_*(s')]`$.
3. Why is the direct equality for the leftover return wrong?
   - The left side is already averaged given $`S_t`$. The right side still depends on the random $`S_{t+1}`$. Put it inside the same conditional expectation and marginalize over $`S_{t+1}`$.
4. In the Hands-on two-step example with optimal futures 8 and 4, what are $`Q_*`$ and $`V_*`$?
   - Right gives 8 and left gives 4, so $`V_* = 8`$ by taking the maximum.

</details>

#### U6. Matrix-form and iterative policy evaluation

**About 4 h** · **Target:** Derive + Implement

Topics: Matrix form of finite policy evaluation; Exact policy evaluation and iterative policy evaluation

Exact values are the oracle for every later sampler. If iteration and solve disagree, the bug is in the model, not in sampling noise.

**You can now**

- Solve $`v = r + \gamma P v`$ as $`v = (I - \gamma P)^{-1} r`$ for a small finite policy and state the cubic cost.
- Implement synchronous iterative evaluation with maximum absolute difference stopping and match the linear solve.
- Reproduce Example 4.1 Figure 4.1 sweeps and Exercise 4.1 action values.

**Study**

1. [Iterative policy evaluation and gridworld](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) (Reinforcement Learning: An Introduction (2nd ed.) - Chapters 3 and 4) - Chapter 4, Section 4.1 Policy Evaluation with (4.3) to (4.5) and the two-array versus in-place note, Example 4.1 and Figure 4.1 with Exercises 4.1 to 4.3, printed pp. 74 to 76. The authors post the full text free at incompleteideas.net.
2. [Matrix form of the Bellman equation](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter03_mdp/value-bellman#matrix-form) (Hands-on Modern RL - MDPs, Values and Bellman Equations) - Matrix Form with $`v = r + \gamma P v`$ and $`(I - \gamma P)^{-1} r`$ and the cubic-cost remark (page read 2026-10-14).
3. [Three-state Bellman verification script](https://github.com/walkinglabs/hands-on-modern-rl/blob/9231babb3b4dfb985017d5c43d96c60c0c2c7654/code/chapter03_mdp/bellman_equation_verify.py) (Hands-on Modern RL - MDPs, Values and Bellman Equations) - 3-state MDP definition with uniform random policy and manual versus iterative comparison giving 8.714450, 6.817661 and 9.214450.
4. [Iterative evaluation updates](https://web.stanford.edu/class/cs234/slides/lecture2pre.pdf) (Stanford CS234 Winter 2026 - Foundations and Planning) - Iterative Algorithm for Computing Value of a MRP (slide 7) and MDP Policy Evaluation, Iterative Algorithm with the Bellman backup note (slide 12).

**Focus**

- Matrix solve is exact but cubic in $`|S|`$. Iteration costs about $`O(|S|^2)`$ per sweep with a known model and no inversion.
- Two-array synchronous evaluation reads $`V_k`$ for all successors. In-place reuses new values within the sweep.
- Terminal value stays 0. Reward is counted on entry, not inside the terminal state.

**Reproduce:** On the Hands-on 3-state MDP with uniform random policy and $`\gamma = 0.9`$, solve to get 8.714450, 6.817661 and 9.214450 and match iteration to 1e-6. Then reproduce Example 4.1 sweep 1 to sweep 3 tables and Exercise 4.1 answers minus 1 and minus 15.

**Traps**

- Inverting $`(I - \gamma P)`$ with $`\gamma = 1`$ in episodic tasks without absorbing handling. The inverse may not exist. Iteration with proper terminals still works.
- Forgetting $`V(\text{terminal}) = 0`$ and bootstrapping from the terminal state.
- Comparing iteration after one sweep to the exact solve and calling the gap a bug. Check the residual, not the first sweep.

**Practice**

- [Stanford CS234 Assignment 1, Section 4(a) to 4(b): Bellman backup and policy evaluation](https://web.stanford.edu/class/cs234/assignments/a1/code.zip) - `bellman_backup` for one state-action pair and `policy_evaluation` in `vi_and_pi.py` on RiverSwim with NumPy only. Implement from a blank file. Check your evaluation against the linear solve on a 2-state toy before running RiverSwim. The section mini-project covers full agreement on your own MDP.

**Stop when:** Your iteration matches the linear solve on the 3-state MDP and your Example 4.1 tables match Figure 4.1 through sweep 3.

<details>
<summary>Self-test</summary>

1. What is the cost of the exact solve versus one evaluation sweep?
   - Exact solve needs matrix inversion at about $`O(|S|^3)`$. One sweep costs about $`O(|S|^2)`$ for a fixed policy with a known model.
2. What are Exercise 4.1 answers for $`q_\pi(11, \text{down})`$ and $`q_\pi(7, \text{down})`$?
   - Down from 11 enters the terminal with reward minus 1, so minus 1. Down from 7 reaches 11 with value minus 14, so minus 1 plus minus 14 gives minus 15.
3. Why does the book mention two arrays?
   - Synchronous evaluation must read the old table for every successor. Reusing new values inside the sweep is a different in-place order.
4. What are the Hands-on 3-state values under the uniform policy?
   - 8.714450, 6.817661 and 9.214450 for the three states. Manual solve and iteration agree.

</details>

#### U7. Policy improvement, policy iteration and generalized policy iteration

**About 4 h** · **Target:** Derive + Implement

Topics: Policy improvement and greedy policy construction; Policy iteration; Generalized policy iteration

Policy iteration finds the optimal policy in few outer loops. If improvement uses stale values, it can stall short of optimal.

**You can now**

- Prove improvement from $`q_\pi(s, \pi'(s)) \ge v_\pi(s)`$ to $`v_{\pi'} \ge v_\pi`$.
- Implement policy iteration that evaluates to tolerance and then improves greedily until the policy is stable.
- Explain generalized policy iteration as evaluation and improvement truncated anywhere in between.

**Study**

1. [Improvement, iteration and GPI](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) (Reinforcement Learning: An Introduction (2nd ed.) - Chapters 3 and 4) - Chapter 4, Section 4.2 Policy Improvement with (4.6) to (4.9) and ties note, Section 4.3 Policy Iteration with the boxed algorithm, Section 4.6 Generalized Policy Iteration, printed pp. 76 to 86. The authors post the full text free at incompleteideas.net.
2. [Policy iteration and Bellman fixed points](https://web.stanford.edu/class/cs234/slides/lecture2pre.pdf) (Stanford CS234 Winter 2026 - Foundations and Planning) - MDP Policy Iteration (slide 19, repeated on slide 22) and Policy Iteration as Bellman Operations with fixed point $`V^\pi = B^\pi B^\pi \cdots B^\pi V`$ (slides 35 to 36).
3. [Greedy policy from action values](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter03_mdp/value-q#from-to-a-policy-greedy-choice) (Hands-on Modern RL - MDPs, Values and Bellman Equations) - From Q to a Policy with the greedy rule $`\pi(s) = \arg\max_a Q(s, a)`$ (page read 2026-10-14).

**Focus**

- Improvement needs $`Q_\pi`$, not $`V_\pi`$ alone. Greedy means $`\arg\max_a Q`$.
- If the greedy policy equals the old policy everywhere, values satisfy optimality and both are optimal.
- Generalized policy iteration truncates evaluation. Value iteration truncates to one sweep.

**Reproduce:** From a blank file, run policy iteration on RiverSwim WEAK with $`\gamma = 0.99`$ and tolerance 0.001 to get left-most 30.328 and right-most 36.859 with an all-R policy, matching value iteration within 0.001.

**Traps**

- Stopping evaluation after fixed sweeps and calling it policy iteration. Run to tolerance or track the GPI error.
- Breaking ties differently each sweep and reporting non-convergence. Exercise 4.4 warns that switching among equally good policies never terminates. Fix the tie rule.
- Improving the policy in place during the sweep. Use $`V_\pi`$ of the old policy for every state in that improvement.

**Practice**

- [Deep-ML 467: Policy Iteration for MDPs](https://www.deep-ml.com/problems/467) - Two tests with $`\gamma = 0.9`$: 2-state MDP expects `([1, 1], [11.0, 10.0])`; 3-state chain expects `([1, 1, 1], [18.1, 19.0, 20.0])`. Implement from a blank file first and use Deep-ML as a closed-book check. The section mini-project covers RiverSwim policy versus value agreement.

**Stop when:** Your policy iteration matches the RiverSwim sanity values and your greedy policy stops changing under a fixed tie rule.

<details>
<summary>Self-test</summary>

1. What condition triggers the improvement theorem?
   - When $`q_\pi(s, \pi'(s)) \ge v_\pi(s)`$ for all $`s`$, then $`v_{\pi'}(s) \ge v_\pi(s)`$ for all $`s`$, with strict gain where the first inequality is strict.
2. Why must policy iteration converge in finite MDPs?
   - There are finitely many deterministic policies. Each outer loop strictly improves unless already optimal, so it cannot cycle forever.
3. What is the Exercise 4.4 bug?
   - The boxed loop can switch forever among equally good policies. Stop only when the policy is stable under a fixed tie rule.
4. Where does generalized policy iteration sit?
   - Anywhere between full evaluation plus greedy improvement and one-sweep value iteration. Both processes compete and constrain each other.

</details>

#### U8. Value iteration and finite-horizon backward induction

**About 4 h** · **Target:** Implement

Topics: Value iteration; Finite-horizon backward induction

Value iteration is the exact baseline for later sampling. Backward induction shows finite-horizon optima depend on steps remaining.

**You can now**

- Implement value iteration with the maximum backup and extract the greedy policy.
- Implement finite-horizon backward induction with time-dependent values and explain why a stationary policy fails there.
- Reproduce the gambler Figure 4.3 shape and the Hands-on GridWorld 7-sweep convergence.

**Study**

1. [Value iteration and the gambler](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) (Reinforcement Learning: An Introduction (2nd ed.) - Chapters 3 and 4) - Chapter 4, Section 4.4 Value Iteration with the boxed algorithm, Example 4.3 Gambler's Problem with Figure 4.3 for $`p_h = 0.4`$ and Exercises 4.8 to 4.10, printed pp. 82 to 84. The authors post the full text free at incompleteideas.net.
2. [Value iteration and finite-horizon policies](https://web.stanford.edu/class/cs234/slides/lecture2pre.pdf) (Stanford CS234 Winter 2026 - Foundations and Planning) - Value Iteration with $`\|V_{k+1} - V_k\|_\infty \le \epsilon`$ (slide 34) and Value Iteration for Finite Horizon H with $`V_k`$ and $`\pi_k`$ (slide 43) plus Question: Finite Horizon Policies on stationary failure (slides 47 to 48).
3. [GridWorld value iteration experiment](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter03_mdp/value-experiment#_3-3-3-value-iteration-reading-the-environment-rules) (Hands-on Modern RL - MDPs, Values and Bellman Equations) - Value Iteration: Reading the Environment Rules with synchronous `values` versus `updated` code, 7-sweep convergence and $`V^*(0,0) = 0.728537`$, plus Terminal Rewards Are Computed Upon Entry (page read 2026-10-14).

**Focus**

- Value iteration uses maximum over actions, not an average under $`\pi`$. One synchronous sweep spreads the goal reward by one layer.
- Finite-horizon values depend on $`k`$ steps to go. An infinite-horizon stationary policy need not be optimal for finite $`H`$.
- Gambler ties mean the optimal policy is not unique. Any tie split among maximum actions stays optimal.

**Reproduce:** Run `python code/chapter03_mdp/gridworld_q_learning.py --output-dir output/value-experiment` on CPU to print 7 sweeps and 0.728537, then show the 6-step shortest path with $`\gamma = 0.95`$ and step penalty 0.01 gives the same number.

**Traps**

- Extracting a policy from $`V_k`$ before convergence and expecting infinite-horizon optimal behavior. Lecture 2 asks whether intermediate policies improve monotonically. They need not.
- Treating finite-horizon $`V_k`$ as stationary. $`V_k`$ means optimal with $`k`$ decisions left.
- Ignoring gambler ties and claiming one optimal policy. The book asks for the whole family in Example 4.3.

**Practice**

- [Deep-ML 157: Bellman update for value iteration](https://www.deep-ml.com/problems/157) - Two tests on small MDPs: first expects `[1., 1.]` with `gamma=0.9`; second expects `[6., 0.]` with `gamma=0.5`
- [Deep-ML 164: Gambler value iteration](https://www.deep-ml.com/problems/164) - Two tests: `ph=0.4` expects `V[50]=0.4` and stake 50; `ph=0.25` expects `V[80]=0.4534` and stake 5. Implement both from a blank file first and use Deep-ML as closed-book checks. The section mini-project covers RiverSwim value versus policy agreement.

**Stop when:** Your value iteration prints the 7-sweep GridWorld result and your gambler run matches the two Deep-ML spot values.

<details>
<summary>Self-test</summary>

1. Why does the GridWorld need 7 sweeps for a 6-step path?
   - Six sweeps carry the goal reward to the start. The seventh sweep finds no change and proves convergence.
2. What are the gambler values at capital 50 for $`p_h = 0.4`$?
   - $`V(50) = 0.4`$ with stake 50. Betting everything wins with probability 0.4 and reaches 100 at once.
3. Is the finite-horizon optimal policy stationary?
   - No. With one step left the best action maximizes immediate reward. With many steps left it can invest for later. The policy depends on steps remaining.
4. What update separates value iteration from policy evaluation?
   - Value iteration applies maximum over actions in every sweep. Policy evaluation averages under the fixed policy.

</details>

#### U9. Bellman operators, contraction, fixed points and residual-aware stopping

**About 4 h** · **Target:** Derive + Measure

Topics: Bellman operators, contraction intuition and fixed points; Residual-aware stopping criteria and policy versus value convergence

Stopping on sweeps wastes work or leaves error. Residual over $`1-\gamma`$ tells how far values and the greedy policy can still be from optimal.

**You can now**

- Define $`B`$ and $`B_\pi`$ and state the fixed points $`V_* = B V_*`$ and $`V_\pi = B_\pi V_\pi`$.
- Prove contraction $`\|B V - B V'\|_\infty \le \gamma \|V - V'\|_\infty`$ for $`\gamma < 1`$ and state the unique fixed point implication.
- Derive the residual bound $`\|V - V_*\| \le \|B V - V\|/(1-\gamma)`$ and choose tolerance from target error, not fixed sweeps.

**Study**

1. [Contraction and convergence](https://web.stanford.edu/class/cs234/slides/lecture2pre.pdf) (Stanford CS234 Winter 2026 - Foundations and Planning) - Contraction Operator (slide 38), Will Value Iteration Converge (slide 39) and Proof: Bellman Backup is a Contraction (slides 40 to 41).
2. [Bellman residuals and policy bounds](https://web.stanford.edu/class/cs234/assignments/a1/CS234_A1_Questions.pdf) (Stanford CS234 Winter 2026 - Foundations and Planning) - Section 3, Bellman Residuals and performance bounds, parts (a) to (f) with the $`2\epsilon/(1-\gamma)`$ bound, pp. 4 to 5, plus part (i) with the tighter $`\epsilon/(1-\gamma)`$ bound under $`V_* \le V`$, p. 5.
3. [Stopping with maximum difference](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) (Reinforcement Learning: An Introduction (2nd ed.) - Chapters 3 and 4) - Chapter 4, Section 4.1 stopping with maximum absolute difference below $`\theta`$ and Section 4.4 loop until $`\|V_{k+1} - V_k\|_\infty \le \epsilon`$, printed pp. 74 and 104. The authors post the full text free at incompleteideas.net.

**Focus**

- $`B`$ maximizes over actions. $`B_\pi`$ averages under $`\pi`$. Both contract in maximum norm by $`\gamma`$.
- Residual $`\epsilon`$ bounds value error by $`\epsilon/(1-\gamma)`$ and greedy-policy loss by $`2\epsilon/(1-\gamma)`$, tighter to $`\epsilon/(1-\gamma)`$ when $`V_* \le V`$.
- Policy can stabilize before values converge. Values can keep moving after the policy is optimal. Track both.

**Reproduce:** Closed-book, prove $`B_\pi`$ contraction in maximum norm in four lines, then compute that $`\epsilon = 0.001`$ with $`\gamma = 0.99`$ allows value error up to 0.1 and policy loss up to 0.2.

**Traps**

- Stopping when the policy stops changing and reporting values as converged. Values may still be far. The residual controls values.
- Using a mean residual to claim a maximum bound. Maximum error needs the maximum norm.
- Expecting contraction with $`\gamma = 1`$. The proof needs $`\gamma < 1`$ or absorption with probability 1.

**Practice**

- [Stanford CS234 Assignment 1, Section 3(d) to 3(f): residual to policy loss](https://web.stanford.edu/class/cs234/assignments/a1/CS234_A1_Questions.pdf) - Section 3, parts (d) to (f), p. 5; Bellman error magnitude to $`\|V - V^\pi\|`$ and $`\|V - V_*\|`$ bounds. Prove on paper. Then set your RiverSwim tolerance from a target value error using $`1-\gamma`$. The section mini-project covers stopping-error agreement.

**Stop when:** You prove contraction without notes and convert any residual into value and policy bounds correctly.

<details>
<summary>Self-test</summary>

1. What are the fixed points of $`B`$ and $`B_\pi`$?
   - $`V_* = B V_*`$ and $`V_\pi = B_\pi V_\pi`$. Policy evaluation iterates $`B_\pi`$ to its fixed point.
2. Why is the fixed point unique?
   - A contraction can have at most one fixed point. If two existed, applying the operator would shrink their distance, which is impossible unless it is zero.
3. What error do $`\epsilon = 0.001`$ and $`\gamma = 0.99`$ allow?
   - Value error up to 0.1 from $`0.001/0.01`$. Greedy-policy loss up to 0.2 from $`0.002/0.01`$.
4. Does value initialization change the limit?
   - No for the limit under contraction. Yes for sweep count. Lecture 2 lists this as out-of-class practice.

</details>

#### U10. Synchronous and asynchronous sweeps, ties, unreachable states and terminal conventions

**About 3 h** · **Target:** Implement

Topics: Synchronous and asynchronous update order; Tie handling, unreachable states and terminal-state conventions

Two correct implementations can differ for sweeps before they agree. Unstable ties and terminal leaks explain most planning mismatches.

**You can now**

- Implement synchronous two-array and asynchronous in-place sweeps and state order dependence.
- Break ties with a stable rule and keep all maximum actions where the task needs the full optimal set.
- Enforce terminal conventions with $`V(\text{terminal}) = 0`$ and reward on entry, and keep unreachable states out of stopping.

**Study**

1. [Asynchronous DP, ties and unreachable states](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) (Reinforcement Learning: An Introduction (2nd ed.) - Chapters 3 and 4) - Chapter 4, Section 4.5 Asynchronous Dynamic Programming, printed pp. 85 to 86; Figure 4.1 bottom-right with multiple arrows for ties, printed p. 77; Exercise 4.2 on added state 15, printed p. 76, and Exercise 4.4 on tie switching, printed p. 82. The authors post the full text free at incompleteideas.net.
2. [Synchronous code and terminal entry](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter03_mdp/value-experiment#how-far-one-sweep-can-propagate-information) (Hands-on Modern RL - MDPs, Values and Bellman Equations) - How Far One Sweep Can Propagate Information with `values` versus `updated` code, and Terminal Rewards Are Computed Upon Entry with `transition` returning 0 after terminal (page read 2026-10-14).
3. [Terminal bootstrap rule](https://gymnasium.farama.org/tutorials/gymnasium_basics/handling_time_limits/) (Gymnasium - Time Limits and Episode Semantics) - Solution with `vf_target = rew + gamma * (1 - terminated) * vf_next_state`; terminal cuts the bootstrap (page read 2026-10-14). Depth: Use only the terminal line here. Truncation was covered in the horizons unit.

**Focus**

- Synchronous reads $`V_k`$ for all successors. In-place reads the latest values, so order changes the path but not the fixed point when every state keeps getting updated.
- Ties admit any split among maximum actions. Switching among equally good policies each sweep looks like non-convergence. Fix the rule and log the full set where needed.
- Terminals have no successor value. Unreachable states keep their initialization until swept. Exclude them from stopping or prove they are swept.

**Reproduce:** From a blank file, run synchronous sweeps on the Example 4.1 random policy to match Figure 4.1 $`k = 1`$ to $`k = 3`$ tables, then run in-place sweeps to the same fixed point by a different path, then show that naive tie switching can oscillate while first-max stabilizes, as Exercise 4.4 warns.

**Traps**

- Comparing one synchronous sweep to many in-place updates. Compare fixed points and residuals, not sweep counts.
- Storing a terminal bootstrap. The transition into the goal already carries the reward. The terminal state contributes 0 after.
- Letting an unreachable state set the maximum difference. Mask to reachable states or sweep all states.

**Practice**

- [Sutton and Barto Exercises 4.2 and 4.4: unreachable states and tie stability](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) - Exercise 4.2 on state 15, printed p. 76, and Exercise 4.4 on fixing tie switching, printed p. 82. The authors post the full text free at incompleteideas.net. Code both sweep orders. Show first-max stabilizes while naive switching can oscillate. The section mini-project covers seeded tie and terminal defects.

**Stop when:** Your synchronous sweeps match Figure 4.1 through $`k = 3`$, your in-place run reaches the same fixed point, ties are stable, and terminals contribute 0 after entry.

<details>
<summary>Self-test</summary>

1. What is the difference between synchronous and in-place updates in (4.5)?
   - Synchronous computes the whole new table from the old table. In-place reuses new values for states already updated in this sweep.
2. What does Figure 4.1 show with multiple arrows?
   - Several actions tie for maximum in (4.9). Any split among them is greedy. The implementation must pick a stable rule.
3. What is Exercise 4.2 testing with state 15?
   - Whether added states are reachable and how their values follow from outgoing transitions. Unreachable states do not affect others until the dynamics link them.
4. What value follows a terminal transition?
   - Reward on entry plus 0 after. Never add $`\gamma V(\text{terminal})`$ as if the terminal had future return.

</details>

#### U11. Reward timing, shaping, unintended optima and MDP formulation

**About 4 h** · **Target:** Explain + Implement

Topics: Reward timing, reward shaping and unintended optimal policies; MDP formulation with state sufficiency, action authority and evaluation policy

Reward and formulation are the task. No planner fixes a proxy that rewards the wrong behaviour.

**You can now**

- Explain reward timing, shaping with $`F(s, a, s') = \gamma \Phi(s') - \Phi(s)`$ and why arbitrary shaping changes the optimal policy.
- Give a reward-hacking example where the proxy optimum differs from the intended behaviour.
- Formulate an MDP with state sufficiency, action authority, horizon, observability and evaluation policy.

**Study**

1. [Goals, rewards and the reward hypothesis](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) (Reinforcement Learning: An Introduction (2nd ed.) - Chapters 3 and 4) - Chapter 3, Section 3.2 Goals and Rewards with the reward hypothesis, printed pp. 53 to 54. The authors post the full text free at incompleteideas.net.
2. [Reward shaping and misspecification](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter03_mdp/reward-design#reward-shaping) (Hands-on Modern RL - MDPs, Values and Bellman Equations) - Reward Shaping with potential-based form and the distance potential numbers, and Reward Misspecification with Coast Runners and Noisy-TV (page read 2026-10-14).
3. [Reward hacking proxy](https://web.stanford.edu/class/cs234/assignments/a1/CS234_A1_Questions.pdf) (Stanford CS234 Winter 2026 - Foundations and Planning) - Assignment 1, Section 2, Reward Hacking with the park versus merge proxy and part (b) alternate reward design, p. 3.
4. [AI Tutor formulation exercise](https://web.stanford.edu/class/cs234/slides/lecture1pre.pdf) (Stanford CS234 Winter 2026 - Foundations and Planning) - Refresher Exercise: AI Tutor as a Decision Process with the state, action, reward and dynamics question and which items the agent will learn to give (slides 28 to 29).

**Focus**

- Reward defines the task. Value is always value under that reward. Changing reward changes $`V_*`$ and $`\pi_*`$.
- Potential shaping preserves the optimal set. Other shaping such as a positive per-step bonus without a time limit can make looping optimal when $`\gamma`$ is 1 or close to it.
- Formulation must state what makes the state Markov, what actions control, how episodes end, what $`\gamma`$ and $`H`$ mean and how the evaluation policy differs from behaviour.

**Reproduce:** On one grid with $`\gamma = 1`$, as in the Hands-on Rule C numbers, compare sparse terminal-only reward with a positive per-step bonus and no time limit to show looping beats finishing. Then replace the bonus with $`\Phi = -\text{distance}`$ shaping and show the optimal set is unchanged.

**Traps**

- Treating discount or horizon as implementation detail. Assignment 1 Section 1 shows they change the optimal inventory policy.
- Adding an alive bonus to speed learning and keeping it for evaluation. The bonus becomes part of the task.
- Evaluating with the exploratory behaviour policy. Fix a separate evaluation policy with its own seeds before claiming an optimal policy.

**Practice**

- The section mini-project covers this: MDP contract with state sufficiency, action authority, reward components, termination, discount and evaluation policy, plus one seeded reward or terminal defect.

**Stop when:** You can turn one ambiguous task into two competing MDPs, predict how their optimal policies differ, and name the evaluation policy for each.

<details>
<summary>Self-test</summary>

1. What is the potential-based shaping form?
   - $`F(s, a, s') = \gamma \Phi(s') - \Phi(s)`$. It adds a state-potential difference without changing the optimal set.
2. Why does the Hands-on Rule C grid loop?
   - Each step pays positive reward with no time limit and no discount, so longer paths collect more. Looping near the goal beats finishing quickly.
3. Why does the Assignment 1 car park instead of merging?
   - The proxy maximizes mean velocity. Merging adds a slow car and lowers the mean. Parking avoids the penalty while the true goal wants short commutes.
4. What must an MDP formulation state?
   - State sufficiency for Markov structure, action authority, reward components and timing, termination and truncation, $`\gamma`$ and $`H`$, observability limits and the evaluation policy.

</details>

### Mini-project: Exact planning oracles for small finite MDPs

**About 10 to 14 hours.** Build the `policylab` foundation: versioned transition records, small finite MDPs and exact planning oracles that later samplers and networks must match. The project turns Bellman equations into tested code with seeded defects, so every later learning claim has an exact reference.

1. Create `policylab` with `schema/`, `envs/`, `oracles/`, `tabular/`, `deep/`, `offline/`, `mbrl/`, `llm/`, `agents/`, `systems/`, `eval/`, `ledger/`, `faults/`, `tests/` and `reports/`, and record one versioned transition schema plus a small finite MDP with known dynamics in `envs/`.
2. Implement matrix-form exact evaluation and synchronous iterative evaluation in `oracles/`, prove their agreement on your MDP, and run the same oracle through the Stanford CS234 Assignment 1 `bellman_backup` and `policy_evaluation` functions on RiverSwim.
3. Implement policy iteration and value iteration with a fixed tie rule, check policy against value agreement on RiverSwim, pass Deep-ML 467, Deep-ML 157 and Deep-ML 164, and set the stopping tolerance from the residual over $`1 - \gamma`$ rather than a fixed sweep count.
4. Seed tie-switching, unreachable-state and terminal-bootstrap defects in `faults/`, show each failing test before its repair, and prove truncation still bootstraps while true termination cuts the target.
5. Write the MDP contract with state sufficiency, action authority, reward components, termination, discount and evaluation policy, then seed one reward or terminal defect and keep a reward-hacking probe where the proxy optimum differs from the intended behavior.
6. Evaluate the greedy policy on several held-out seed streams with no training exploration, keep per-seed raw records in `ledger/` and `reports/`, and state what the optimal-policy claim does and does not establish.

**Deliverables**

- The `policylab` layout with the versioned schema, finite MDPs and exact planning oracles.
- Tests: oracle agreement, RiverSwim policy and value match, residual stopping and seeded defect regressions.
- The MDP contract with the evaluation policy, hacking probe and multi-seed greedy evaluation report.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [Deep-ML 467: Policy Iteration for MDPs](https://www.deep-ml.com/problems/467). Pass closed-book first; use as the policy iteration agreement check.
- external-tests: [Deep-ML 157: Bellman Update for Value Iteration](https://www.deep-ml.com/problems/157). Pass closed-book first; use as the value iteration backup check.
- external-tests: [Deep-ML 164: Gambler Value Iteration](https://www.deep-ml.com/problems/164). Match the spot values; use it as the episodic, undiscounted value-iteration check.
- external-tests: [Stanford CS234 Assignment 1 starter code](https://web.stanford.edu/class/cs234/assignments/a1/code.zip). Run Bellman backup and policy evaluation on RiverSwim from NumPy only.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Oracle agreement | Iterative evaluation matches the matrix solve on your MDP, and policy and value iteration agree on RiverSwim. | Agreement holds under several sweep orders and tie rules, with the residual bound predicting the remaining error. |
| Stopping discipline | Tolerance comes from the residual bound, and values and policy convergence are reported separately. | A premature stop is shown to leave value error while the policy looks stable, or the reverse. |
| Defect regressions | Each seeded tie, terminal and reward defect fails before its repair and passes after. | One defect survives a naive fix and needs a second repair with its own regression test. |
| Formulation honesty | The contract names the evaluation policy, and the hacking probe shows the proxy optimum missing the intent. | Two competing formulations predict different optimal policies, and evaluation separates them. |

Feeds into: Exact MDPs, versioned records, planning oracles and defect discipline feed sampling, deep value and policy projects and the capstone classical core.

### Resource route

- **Primary - Course:** [Stanford CS234 Winter 2026 - Foundations and Planning](https://web.stanford.edu/class/cs234/modules.html) - Study Lecture 1 (`lecture1pre.pdf` and `lecture1post.pdf`) and Lecture 2 on tabular MDP planning (`lecture2pre.pdf` and `lecture2post.pdf` under https://web.stanford.edu/class/cs234/slides/). Work Assignment 1 independently: the written MDP, horizon and Bellman-operator questions and the `vi_and_pi.py` planning code on RiverSwim (NumPy only). Do not copy or publish course solutions.
- **Required - Book:** [Reinforcement Learning: An Introduction (2nd ed.) - Chapters 3 and 4](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) - The authors post the full second edition free at incompleteideas.net; cite the printed page numbers. Study Chapter 3 (Sections 3.1 to 3.7, finite MDPs, returns, Bellman equations and optimality) and Chapter 4 (Sections 4.1 to 4.7, policy evaluation, improvement, policy and value iteration, asynchronous DP and GPI). Reproduce Example 4.1 and Figure 4.1 exactly, then Example 4.3 (the gambler), and write exact tests for stochastic transitions, terminals, ties and stopping error.
- **Required - Documentation:** [Gymnasium - Time Limits and Episode Semantics](https://gymnasium.farama.org/tutorials/gymnasium_basics/handling_time_limits/) - Read the termination, truncation and "importance in learning code" sections, then the vector autoreset note at https://farama.org/Vector-Autoreset-Mode (next-step autoreset is the default in Gymnasium 1.x). Build a wrapper test that distinguishes termination from truncation and proves which cases bootstrap before using any third-party environment.
- **Support - Tutorial:** [Hands-on Modern RL - MDPs, Values and Bellman Equations](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter03_mdp/value-bellman) - Use the value and Bellman page and the value experiment page (`code/chapter03_mdp/bellman_equation_verify.py` and `gridworld_q_learning.py` run on CPU in seconds) as a code companion. Check every equation against Sutton and Barto before adopting it. Pin commit 9231bab of walkinglabs/hands-on-modern-rl; its `code/chapterNN` folders do not follow the site chapter numbers.
- **Support - Practice:** [Deep-ML - Planning Problems](https://www.deep-ml.com/problems/157) - Use named problems as closed-book checks after your own implementation passes: 157 (Bellman equation for value iteration), 164 (the gambler's problem by value iteration) and 467 (policy iteration). Read each problem's tests before trusting its statement.
- **Required - Project:** [Reinforcement Learning Control Laboratory - Planning Core](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/reinforcement-learning-control-laboratory.md) - Complete Milestone A planning requirements: an explicit finite MDP, exact policy evaluation, value iteration, policy iteration, simulator agreement and seeded reward, transition, terminal and tie defects.
- **Reference - Reference:** [Reinforcement Learning: An Introduction (2nd ed.) - Chapter 2 bandits](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) - Read Section 2.9, Associative Search (Contextual Bandits), printed p. 41, with Exercise 2.10 as the context versus no-context check. Use only this section from Chapter 2.

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

### Study units

#### U1. Model-free prediction and first-visit and every-visit Monte Carlo

**About 4 h** · **Target:** Derive + Implement

Topics: Model-free prediction and control; First-visit and every-visit Monte Carlo estimation

Without a transition model, complete episode returns are the only exact target available. Monte Carlo turns those returns into value estimates and sets the baseline every TD method is compared against.

**You can now**

- Derive first-visit and every-visit Monte Carlo return averages for a fixed policy from sampled episodes.
- Implement first-visit Monte Carlo prediction from a blank file and match exact return averages on fixed episodes.
- Explain why first-visit averages are unbiased through the law of large numbers and why every-visit averages need more care.

**Study**

1. [Monte Carlo prediction and action values](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) (Reinforcement Learning: An Introduction (2nd ed.) - Chapters 2, 5, 6 and 7) - Chapter 5, Sections 5.1 and 5.2, with the first-visit MC prediction box and Example 5.1 on blackjack (printed pp. 91 to 96). Depth: The linked page is the publisher page; the authors post the full text free at incompleteideas.net. In this unit read only Sections 5.1 and 5.2; control and off-policy sections belong to later units.
2. [Tabular policy evaluation](https://web.stanford.edu/class/cs234/slides/lecture3pre.pdf) (Stanford CS234 Winter 2026 - Policy Evaluation and Q-Learning) - Lecture 3, Monte Carlo (MC) Policy Evaluation through Monte Carlo (MC) Policy Evaluation Summary (slides 10 to 29): first-visit, every-visit and incremental MC, and the bias, variance and consistency properties. Depth: Follow the policy-evaluation framing; leave TD and control material for later units.
3. [DP, MC and TD as three ways to edit one table](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter03_mdp/dp-mc-td) (Hands-on Modern RL - Dynamic Programming, Monte Carlo and TD) - Section Monte Carlo with the corridor trajectory and the every-visit update table (page read 2026-10-14). Depth: Read as a worked comparison, not as the update contract. Keep the Sutton box as the contract.

**Focus**

- Model-free means no $`P(s' \mid s, a)`$ or $`R(s, a)`$ table is used. The target $`G_t`$ comes from a sampled episode, with $`G_t = R_{t+1} + \gamma R_{t+2} + \cdots`$.
- First-visit averages the return after the first visit to $`s`$ in each episode. Every-visit averages all visits. The boxed algorithm implements first-visit; every-visit drops the earlier-occurrence check.
- Monte Carlo waits for termination, so it applies to episodic tasks only. No update happens step by step.
- Each first-visit return is an independent unbiased sample of $`v_{\pi}(s)`$, so the average converges by the law of large numbers with standard deviation falling as $`1/\sqrt{n}`$.

**Reproduce:** From a blank file, implement first-visit Monte Carlo prediction and run it on `[[(0, 1.0), (1, 1.0), (2, 1.0)]]` with `gamma=1.0` to get `[3.0, 2.0, 1.0]`, then on `[[(0, 1.0), (1, 1.0), (0, 1.0), (2, 0.0)]]` to get `[3.0, 2.0, 0.0]`. State which visit each return belongs to.

**Traps**

- Averaging all visits while calling the result first-visit. A repeated state in one episode contributes once under first-visit and every time under every-visit.
- Updating before the episode ends. The return $`G_t`$ is not known until termination, so an intermediate average uses an incomplete sum.
- Reading the blackjack figure as exact values. Figure 5.1 after 500,000 games is a close approximation, and usable-ace states stay noisier because they are visited less often.

**Practice**

- [Deep-ML 272: First-Visit Monte Carlo Prediction](https://www.deep-ml.com/problems/272) - Implement `first_visit_mc_prediction`; the two public tests check `[3.0, 2.0, 1.0]` on a clean episode and `[3.0, 2.0, 0.0]` when state 0 repeats. Do it closed-book after your own implementation passes fixed returns. The tests only check these two episodes, so also test a two-episode average with a second seed.

**Stop when:** Your blank-file implementation matches both Deep-ML 272 public tests, and you can state from memory which visits each method averages and why the target needs termination.

<details>
<summary>Self-test</summary>

1. Why does Monte Carlo prediction require episodic tasks?
   - Its target is the complete return, which is only known at termination. Without a terminal step there is no $`G_t`$ to average.
2. One episode yields state rewards 1, 1, 1, 0 across visits to states 0, 1, 0, 2. What does each method record for state 0?
   - First-visit records one return, 3. Every-visit records two returns, 3 and 1.
3. Why is the first-visit average unbiased for $`v_{\pi}(s)`$?
   - Each first-visit return is an independent sample of $`v_{\pi}(s)`$ with finite variance, so its expectation equals $`v_{\pi}(s)`$ and the average converges to it.
4. How do the error bars shrink with more first visits?
   - The standard deviation of the average falls as $`1/\sqrt{n}`$ with $`n`$ first visits.

</details>

#### U2. Incremental means, constant step sizes and learning-rate conditions

**About 3 h** · **Target:** Derive

Topics: Incremental means and constant-step-size tracking; Learning-rate schedules and visitation conditions

Every tabular update in this section is an incremental average in disguise. The step-size choice decides whether old bias dies out or new samples keep overwriting the past.

**You can now**

- Derive the incremental mean update and the constant step-size update from the averaging definition.
- State the step-size convergence conditions and explain which part tracking violates and why.
- Predict how initialization bias decays under decreasing versus constant step sizes.

**Study**

1. [Incremental and tracking updates](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) (Reinforcement Learning: An Introduction (2nd ed.) - Chapters 2, 5, 6 and 7) - Chapter 2, Sections 2.4 and 2.5, equations (2.3) to (2.7) with Exercises 2.4 and 2.5 (printed pp. 30 to 33). Depth: Skip the bandit testbed and action-selection sections; read only the update rules and the step-size discussion.
2. [Constant step-size arithmetic in the corridor tables](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter03_mdp/dp-mc-td) (Hands-on Modern RL - Dynamic Programming, Monte Carlo and TD) - The MC and TD worked tables, which both move old values toward targets with $`\alpha = 0.5`$ (page read 2026-10-14). Depth: Read the tables as arithmetic examples of constant step sizes, not as converged values.

**Focus**

- The general template is $`Q_{n+1} = Q_n + \alpha_n(R_n - Q_n)`$ from (2.4). The sample mean uses $`\alpha_n = 1/n`$; tracking uses constant $`\alpha`$ from (2.5).
- Constant $`\alpha`$ gives recent rewards exponentially more weight, $`(1 - \alpha)^{n-i}`$, so the initial bias decays but old samples are discounted forever.
- Convergence needs $`\sum_n \alpha_n = \infty`$ with $`\sum_n \alpha_n^2 < \infty`$ from (2.7). Constant $`\alpha`$ fails the second sum, which is why it tracks drift instead of converging.
- Visitation gates learning: rarely visited pairs take fewer steps, so their estimates move slower at any shared $`\alpha`$.

**Reproduce:** Starting from $`Q_1 = 0`$ with rewards $`1, 2, 3`$ in order and $`\alpha = 0.5`$, apply $`Q_{n+1} = Q_n + \alpha(R_n - Q_n)`$ three times and get $`Q_4 = 2.125`$. Expand the weights as in (2.6) and show the weight on $`R_3`$ is $`0.5`$ while the weight on $`R_1`$ is $`0.125`$. Confirm the decreasing step-size mean gives exactly $`2`$.

**Traps**

- Using $`\alpha = 1`$ everywhere because it removes bias fastest. It also removes all memory, so one noisy reward decides the estimate.
- Assuming constant $`\alpha`$ converges because early bias decays. The bias from $`Q_1`$ decays as $`(1 - \alpha)^n`$, but the variance never settles since every new sample keeps weight $`\alpha`$.
- Treating unvisited pairs as learned. No visit means no update at that step size; a shared schedule does not teach pairs the behavior policy never tries.

**Practice**

- The section mini-project covers this: constant versus decreasing step-size comparisons with matched interaction budgets and visitation logs.

**Stop when:** You derive (2.4) to (2.7) closed-book, reproduce the 2.125 weighting by hand, and can predict which schedule tracks a drift and which converges.

<details>
<summary>Self-test</summary>

1. Rewards arrive as 10 then 0 with $`Q_1 = 0`$ and constant $`\alpha = 0.5`$. What is $`Q_3`$?
   - $`Q_2 = 5`$, then $`Q_3 = 5 + 0.5(0 - 5) = 2.5`$. The first reward keeps weight $`0.25`$.
2. Which convergence sum does constant $`\alpha`$ violate?
   - The squares sum: $`\sum_n \alpha^2`$ diverges for constant $`\alpha`$, so noise never averages out. The plain sum $`\sum_n \alpha_n = \infty`$ still holds.
3. Why does $`\alpha_n = 1/n`$ converge slowly in practice?
   - Later samples get weight $`1/n`$, so after many visits each new return barely moves the estimate even when the policy has changed.
4. A pair is visited once in 10,000 steps. What does a shared step size imply?
   - Its estimate took one step from initialization. Visit counts gate learning; the schedule cannot compensate for missing coverage.

</details>

#### U3. TD error, TD(0), bootstrapping and Monte Carlo versus TD bias and variance

**About 5 h** · **Target:** Derive + Measure

Topics: Temporal-difference error and TD(0); Bootstrapping and bias-variance trade-offs; Monte Carlo and TD bias, variance and sample efficiency

TD learns from every step instead of every episode. That single change buys sample efficiency at the price of bootstrapping bias, and the rest of the section reuses the same error.

**You can now**

- Derive the TD(0) update and the TD error from the Bellman expectation equation.
- Explain bootstrapping and why it trades lower variance for bias while $`V`$ is wrong.
- Compare Monte Carlo and TD(0) on sample efficiency and bias using the random-walk evidence.

**Study**

1. [TD prediction and its advantages](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) (Reinforcement Learning: An Introduction (2nd ed.) - Chapters 2, 5, 6 and 7) - Chapter 6, Sections 6.1 and 6.2, equations (6.1), (6.2) and (6.5), with Example 6.2 on the random walk (printed pp. 119 to 126). Depth: Read Example 6.2 for the bias-variance comparison only; batch updating in Section 6.3 belongs to later study, not this unit.
2. [TD(0) inside tabular policy evaluation](https://web.stanford.edu/class/cs234/slides/lecture3pre.pdf) (Stanford CS234 Winter 2026 - Policy Evaluation and Q-Learning) - Lecture 3, Temporal Difference Learning through Summary: Temporal Difference Learning (slides 31 to 40), with the worked TD example (slides 35 to 36). Depth: Use the lecture's TD update framing; leave Q-learning to Lecture 4.
3. [Online TD updates on one trajectory](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter03_mdp/dp-mc-td) (Hands-on Modern RL - Dynamic Programming, Monte Carlo and TD) - Section Temporal Difference with the step-by-step corridor table that reuses updated values mid-episode (page read 2026-10-14). Depth: Treat the corridor numbers as one sampled trajectory, not as converged values.

**Focus**

- The TD error $`\delta_t = R_{t+1} + \gamma V(S_{t+1}) - V(S_t)`$ from (6.5) is the gap between the one-step target and the old estimate. TD(0) from (6.2) moves $`V(S_t)`$ by $`\alpha \delta_t`$.
- TD(0) replaces the unknown tail $`G_{t+1}`$ with the current estimate $`V(S_{t+1})`$. That substitution is bootstrapping: an estimate updates another estimate.
- Monte Carlo is unbiased with high variance and waits for termination. TD(0) has lower variance, learns online each step, but is biased until the successor estimates are accurate. Example 6.2 finds TD consistently ahead of constant-$`\alpha`$ Monte Carlo on RMS error for the step sizes it tries; Exercise 6.4 asks whether a wider range would change that.
- The corridor TD table reads already-updated cells mid-episode, so later steps build on earlier corrections. That reuse is the online mechanism, not a bookkeeping error.

**Reproduce:** Closed-book, compute the TD error for $`V(s) = 5`$, $`R_{t+1} = 1`$, $`V(S_{t+1}) = 10`$ and $`\gamma = 0.9`$ with no termination to get $`\delta_t = 5`$, and for $`V(s) = 8`$, $`R_{t+1} = 10`$ at termination to get $`\delta_t = 2`$. Then update $`V(s) = 5`$ with $`\alpha = 0.1`$ and $`\delta_t = 5`$ to get $`5.5`$.

**Traps**

- Calling TD(0) unbiased because it uses a real reward. The reward is real but $`V(S_{t+1})`$ is an estimate, so the target inherits its error.
- Zeroing the bootstrap on any episode end. Termination sets the beyond-end value to zero; truncation must keep bootstrapping. The alignment unit makes this exact.
- Comparing single-seed learning curves as proof. Example 6.2 averages many runs; one seed can favor either method.

**Practice**

- [Deep-ML 257: Compute Temporal Difference Error](https://www.deep-ml.com/problems/257) - Implement `compute_td_error`; the public tests check `5.0` for the continuing case and `2.0` for the `done` case. The `done` test passes `v_s_prime` 0.0 and expects the bootstrap dropped. Also test your own one-step value update against the 5.5 hand value.

**Stop when:** You derive the TD(0) update from the Bellman equation without notes, reproduce both TD errors and the 5.5 update, and can explain the bias-variance trade against Monte Carlo.

<details>
<summary>Self-test</summary>

1. What are the Monte Carlo and TD(0) targets for the same transition?
   - Monte Carlo uses the full sampled return $`G_t`$. TD(0) uses $`R_{t+1} + \gamma V(S_{t+1})`$.
2. Why does TD(0) learn before termination?
   - Its target needs only one reward and the next state's current estimate, so it updates each step instead of waiting for $`G_t`$.
3. A learner zeroes the bootstrap at a time limit. What breaks?
   - The value loses the future return beyond the limit. Time limits truncate; only true termination zeroes the bootstrap.
4. When does TD(0) beat Monte Carlo on the random walk?
   - In Example 6.2, TD(0) stays below constant-$`\alpha`$ Monte Carlo on RMS error over the first 100 episodes for every step size shown. The ranking depends on step sizes, so compare each method at its best $`\alpha`$.

</details>

#### U4. n-step returns, target boundaries and fixed-trajectory update oracles

**About 4 h** · **Target:** Derive + Implement

Topics: n-step returns and return-target boundaries; Fixed-trajectory update oracles

One-step and full-episode targets are two ends of one spectrum. n-step returns fill the middle, and fixed-trajectory oracles make every later update testable without running an agent.

**You can now**

- Derive n-step returns with their TD, Sarsa and off-policy update forms for a fixed trajectory.
- State the target boundary rule: zero-pad at termination and bootstrap only inside the trajectory.
- Implement fixed-trajectory update oracles that match hand-computed n-step targets exactly.

**Study**

1. [n-step TD, n-step Sarsa and n-step off-policy updates](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) (Reinforcement Learning: An Introduction (2nd ed.) - Chapters 2, 5, 6 and 7) - Chapter 7, Sections 7.1 to 7.3, equations (7.1) to (7.5) with Figures 7.1 to 7.3, ending before starred Section 7.4 (printed pp. 142 to 150). Depth: Stop before starred Section 7.4. Eligibility traces stay out; this unit ends at n-step oracles.
2. [Fixed-trajectory checks in the control laboratory](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/reinforcement-learning-control-laboratory.md) (Reinforcement Learning Control Laboratory - Tabular Control) - Milestone A and Correctness requirements: exact and fixed-trajectory update checks. Depth: Read for what an oracle must check, not for DQN or policy-gradient material.

**Focus**

- The n-step return $`G_{t:t+n} = R_{t+1} + \cdots + \gamma^{n-1}R_{t+n} + \gamma^n V_{t+n-1}(S_{t+n})`$ sums $`n`$ real rewards then bootstraps. At $`n = 1`$ it is TD(0); as $`n`$ grows it approaches Monte Carlo.
- If $`t + n`$ reaches termination, missing terms are zero and no bootstrap is added. The boundary sits at $`T`$, not at a fixed $`n`$.
- The error-reduction bound (7.3) says the worst-case error contracts by $`\gamma^n`$: longer $`n`$ trusts the current $`V`$ less.
- An oracle takes an explicit trajectory and returns the exact target. It never steps an environment, so failures in it are update bugs, not sampling noise.

**Reproduce:** From a blank file, take one episode of single-reward steps from zero values with `gamma=0.9` and `alpha=0.1`. Show `n=1` gives `[0.1, 0.1, 0.1]` and `n=2` gives `[0.19, 0.19, 0.1]`, with the `n=2` target at the first state equal to `1.9`.

**Traps**

- Shifting the reward index by one. $`R_{t+1}`$ follows $`S_t`$; pairing $`R_t`$ with $`S_t`$ corrupts every n-step sum.
- Bootstrapping past termination. Once the episode ends at $`T`$, the target is the zero-padded sum, never plus $`\gamma^n V`$.
- Testing updates through a live agent. Environment noise then masks off-by-one errors that a fixed trajectory would expose exactly.

**Practice**

- [Deep-ML 273: n-Step TD Prediction](https://www.deep-ml.com/problems/273) - Implement `n_step_td_prediction`; the public tests check `[0.1, 0.1, 0.1]` for `n=1` and `[0.19, 0.19, 0.1]` for `n=2`. Match the 1.9 hand target first. The tests use single episodes from zero values, so add your own two-episode and terminal-boundary cases.

**Stop when:** Your oracle matches both Deep-ML 273 tests and your hand-derived 1.9 target, and you can state the termination boundary without notes.

<details>
<summary>Self-test</summary>

1. Write $`G_{t:t+2}`$ in full.
   - $`G_{t:t+2} = R_{t+1} + \gamma R_{t+2} + \gamma^2 V(S_{t+2})`$, or the zero-padded sum when the episode ends first.
2. Why can no real algorithm use $`G_{t:t+n}`$ at time $`t+1`$?
   - It needs rewards and states up to $`t+n`$, which have not happened yet. The update for $`S_t`$ waits until time $`t+n`$.
3. What does (7.3) promise when the current values are already exact?
   - Nothing beyond exactness: if the worst error is zero, the n-step expectation is exact for every $`n`$.
4. An oracle and a live run disagree. Which do you trust?
   - The oracle, after checking its hand computation. It removes sampling noise, so a mismatch points at the live update or its boundary handling.

</details>

#### U5. On-policy and off-policy learning with behavior and target policies

**About 3 h** · **Target:** Explain

Topics: On-policy and off-policy learning; Behavior policies and target policies

Every off-policy claim stands or falls on one distinction: which policy generated the data and which policy the update improves. Mixing them up silently redefines the result.

**You can now**

- Explain behavior versus target policies and which policy each tabular update evaluates.
- Explain why Q-learning is off-policy while Sarsa with matched sampling is on-policy.
- State the coverage requirement that any behavior policy must satisfy.

**Study**

1. [Control without exploring starts and the behavior-target setup](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) (Reinforcement Learning: An Introduction (2nd ed.) - Chapters 2, 5, 6 and 7) - Chapter 5, Sections 5.4 and 5.5: $`\epsilon`$-soft control and the behavior-target setup with the coverage assumption (printed pp. 100 to 109). Depth: Read for the policy definitions and the coverage rule; leave the ratio algebra to the next unit.
2. [Sarsa and Q-learning policy roles](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) (Reinforcement Learning: An Introduction (2nd ed.) - Chapters 2, 5, 6 and 7) - Chapter 6, Sections 6.4 and 6.5: the Sarsa box and the Q-learning box with rule (6.8) (printed pp. 129 to 132). Depth: Compare what each box learns versus what generates its data; leave Expected Sarsa and maximization bias to later units.
3. [On-policy versus off-policy framing](https://web.stanford.edu/class/cs234/slides/lecture4pre.pdf) (Stanford CS234 Winter 2026 - Policy Evaluation and Q-Learning) - Lecture 4, On and Off-Policy Learning (slide 34), with Q-learning as the off-policy case (slide 35). Depth: Use the framing only; the derivations live in Sutton.

**Focus**

- The behavior policy $`b`$ generates actions. The target policy $`\pi`$ is the one being evaluated or improved. On-policy means $`b = \pi`$; off-policy means they differ.
- Sarsa backs up $`Q(S_{t+1}, A_{t+1})`$ with the action actually taken, so it evaluates the behavior policy. Q-learning backs up $`\max_a Q(S_{t+1}, a)`$ regardless of the next action, so it directly approximates $`q_*`$.
- Coverage requires $`\pi(a \mid s) > 0`$ to imply $`b(a \mid s) > 0`$. Without it some target actions never appear and no weight can repair the gap.

**Reproduce:** Closed-book, classify Sarsa, Q-learning and Expected Sarsa as on-policy or off-policy under behavior policy $`b`$, and write the coverage condition. Then give a two-action case where $`\pi`$ picks the unsupported action and state the conclusion: nothing about that action.

**Traps**

- Calling Q-learning on-policy because one policy object acts and updates. The target uses the max, not the behavior action, so the learned values are off-policy even with a single actor.
- Assuming greedy behavior is safe for Sarsa. Without exploration Sarsa stops updating unvisited pairs and can lock onto a suboptimal policy.
- Believing more off-policy data always helps. Data from $`b`$ without coverage of $`\pi`$ adds no information about the missing actions.

**Practice**

- The section mini-project covers this: behavior-target labeling on exploration-sensitive trajectories with a coverage-failure case.

**Stop when:** You classify each update's learned policy without notes and can spot a coverage failure in a behavior log.

<details>
<summary>Self-test</summary>

1. Why is Q-learning off-policy even when actions come from its own $`\epsilon`$-greedy policy?
   - Its target uses the maximum over next actions, not the action the behavior policy will take. It learns about the greedy policy while behaving $`\epsilon`$-greedy.
2. Suppose action selection is fully greedy with identical initialization and tie-breaking. Do Sarsa and Q-learning behave identically?
   - Almost, but not exactly. Sarsa picks $`A_{t+1}`$ before updating $`Q(S_t, A_t)`$, while Q-learning picks its next action after the update, so when $`S_{t+1} = S_t`$ the update can change which action is greedy and the two runs diverge. Exercise 6.12 asks exactly this.
3. Behavior never tries action up in some state. What can off-policy learning say about it?
   - Nothing. Coverage fails, so no trajectory carries information about that pair.
4. Which policy's values does on-policy Monte Carlo control improve?
   - The $`\epsilon`$-soft behavior policy it samples from, per Section 5.4. Optimality comes only as exploration decays.

</details>

#### U6. Trajectory and per-decision importance sampling, ordinary and weighted estimators

**About 4 h** · **Target:** Derive + Implement

Topics: Trajectory and per-decision importance sampling; Ordinary and weighted importance estimators

Off-policy data has the wrong action probabilities. Importance ratios reweight it back, and the choice of estimator decides whether variance or bias dominates.

**You can now**

- Derive trajectory importance ratios and the per-decision form that drops irrelevant future factors.
- Implement ordinary and weighted importance-sampling estimators on fixed trajectories.
- Explain why ordinary sampling is unbiased with high variance while weighted sampling trades bias for lower variance.

**Study**

1. [Off-policy prediction via importance sampling](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) (Reinforcement Learning: An Introduction (2nd ed.) - Chapters 2, 5, 6 and 7) - Chapter 5, Section 5.5, equations (5.3) to (5.6) with Examples 5.4 and 5.5 and Figures 5.3 and 5.4 (printed pp. 103 to 109). Depth: Read the ordinary-versus-weighted comparison closely; leave incremental implementation to Section 5.6.
2. [Per-decision importance sampling](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) (Reinforcement Learning: An Introduction (2nd ed.) - Starred Sections 5.8 and 5.9 and Chapter 10 Sections 10.3 to 10.5) - Starred Section 5.9 on per-decision importance sampling, equations (5.11) to (5.14) (printed pp. 114 to 115). Depth: Read only the per-decision expectation argument; skip discounting-aware Section 5.8 unless the discounted case needs it.

**Focus**

- The trajectory ratio $`\rho_{t:T-1} = \prod_{k=t}^{T-1} \frac{\pi(A_k \mid S_k)}{b(A_k \mid S_k)}`$ corrects the whole-trajectory probability. Its expectation under $`b`$ is $`1`$.
- Ordinary sampling averages $`\rho G`$ and is unbiased. Weighted sampling divides by the summed ratios; it is biased but its variance stays controlled and no single return takes weight above $`1`$.
- Per-decision sampling scales each reward $`R_{t+k}`$ only by ratios up to $`t+k-1`$. Later factors have expectation $`1`$ given the reward, so dropping them keeps the expectation and cuts variance.
- Example 5.5 shows ordinary sampling failing to settle after millions of episodes on a looping MDP while weighted sampling converges. Long products are the mechanism.

**Reproduce:** Closed-book, take two trajectories with returns $`G = 2`$ and $`G = 0`$ and ratios $`\rho = 2`$ and $`\rho = 0.5`$. Compute the ordinary estimate as $`(2 \times 2 + 0.5 \times 0)/2 = 2`$ and the weighted estimate as $`4/2.5 = 1.6`$.

**Traps**

- Multiplying ratios past the reward they correct. The per-decision argument shows those factors add variance with no change in expectation.
- Normalizing the weighted estimator by the episode count instead of the summed weights. Equation (5.6) divides by the weight sum; dividing by $`n`$ rebuilds the ordinary estimator's scale.
- Trusting ordinary sampling on looping trajectories. Example 5.5 is the warning: a few huge ratios dominate the average.

**Practice**

- The section mini-project covers this: ordinary and weighted estimates on fixed trajectories with a coverage-failure case.

**Stop when:** You derive both estimators and the per-decision reduction without notes and reproduce the 2 versus 1.6 hand case.

<details>
<summary>Self-test</summary>

1. What is $`\rho_{t:T-1}`$ when $`\pi = b`$?
   - Every factor is 1, so the product is 1 and both estimators reduce to plain Monte Carlo.
2. Why does weighted sampling have lower variance than ordinary sampling?
   - It divides by the observed weight sum, so the largest weight on any return is 1. Ordinary sampling lets rare huge ratios scale returns without bound.
3. A reward at $`t+1`$ is scaled by ratios up to $`T-1`$. Which factors can go?
   - All factors after $`t`$. Their conditional expectation is $`1`$, so per-decision estimation drops them.
4. The behavior policy never takes an action the target takes. What happens to the ratio?
   - It divides by zero. Coverage fails before any estimator runs; see the previous unit.

</details>

#### U7. Support, coverage, effective sample size and visitation diagnostics

**About 3 h** · **Target:** Measure

Topics: Support, coverage and effective sample size; State-action visitation and coverage diagnostics

Averages over data the policy never visits are guesses, not estimates. Support checks and visitation logs tell the difference before training burns time.

**You can now**

- Compute effective sample size from importance weights and state when it signals collapse.
- Log state-action visitation from fixed trajectories and name uncovered pairs.
- Explain why no estimator or extra training fixes missing support.

**Study**

1. [Coverage and weight variance](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) (Reinforcement Learning: An Introduction (2nd ed.) - Chapters 2, 5, 6 and 7) - Chapter 5, Sections 5.5 and 5.7: the coverage assumption on the behavior policy and the weighted-estimator variance discussion with Example 5.5 (printed pp. 103 to 111). Depth: Read for support and variance only; control algorithms belong to other units.
2. [Loggable step fields](https://gymnasium.farama.org/api/env/) (Gymnasium Core API) - Env `step` returning `terminated` and `truncated` with `info`, and `reset` with `seed`: log `observation`, `action`, `reward`, `terminated` and `truncated` each step (Gymnasium 1.4.0; page read 2026-10-14).
3. [Visitation instrumentation in the control laboratory](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/reinforcement-learning-control-laboratory.md) (Reinforcement Learning Control Laboratory - Tabular Control) - Milestone B and Measurement requirements: visitation records with per-seed raw curves.

**Focus**

- Support means $`b(a \mid s) > 0`$ wherever $`\pi(a \mid s) > 0`$. Effective sample size $`\text{ESS} = (\sum_i w_i)^2 / \sum_i w_i^2`$ drops toward $`1`$ when one weight dominates and equals $`n`$ for equal weights.
- Visitation counts come from logged trajectories, not from $`Q`$ magnitudes. A large $`Q`$ on an unvisited pair is initialization, not knowledge.
- Coverage is a property of the data-collection policy and the logging code. Changing the estimator cannot create visits that never happened.

**Reproduce:** From a blank file, take weights `[2.0, 0.5, 0.5, 1.0]` and compute $`\text{ESS} = 16/5.5 \approx 2.91`$ against $`n = 4`$, then flag a state-action pair with zero visits as uncovered in a small visitation table.

**Traps**

- Reporting raw episode counts as coverage. Ten thousand episodes that avoid a pair still leave it uncovered.
- Averaging effective sample size across mismatched policies. Weights from different $`b`$ versions are not one sample; version the behavior policy first.
- Reading $`\text{ESS} = n`$ as success. Equal weights with tiny $`n`$ still leave large standard errors.

**Practice**

- The section mini-project covers this: visitation logs, effective-sample-size curves and a planted coverage-failure case.

**Stop when:** You compute effective sample size on a weight vector without notes, produce a visitation table that names uncovered pairs, and refuse an estimate with missing support.

<details>
<summary>Self-test</summary>

1. Weights are all equal. What is the effective sample size?
   - $`\text{ESS} = n`$. Each sample carries full weight.
2. One weight is 100 and ninety-nine are near zero. What does the size say?
   - About 1. The average is effectively one trajectory.
3. A pair has zero visits but a high $`Q`$. What do you report?
   - Uncovered. The value is initialization, not evidence.
4. Can weighted sampling fix zero support?
   - No. Its ratio needs $`b > 0`$; missing support means the estimand is unidentified from this data.

</details>

#### U8. SARSA and Expected SARSA control

**About 4 h** · **Target:** Derive + Implement

Topics: SARSA control; Expected SARSA control

These are the two on-policy TD control updates. They turn evaluation into improvement while staying on the behavior policy's data.

**You can now**

- Derive the Sarsa and Expected Sarsa targets and state which policy each evaluates.
- Implement both updates from a blank file and match fixed-trajectory values exactly.
- Explain when Expected Sarsa reduces variance relative to Sarsa and when it matches Q-learning.

**Study**

1. [Sarsa and Expected Sarsa](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) (Reinforcement Learning: An Introduction (2nd ed.) - Chapters 2, 5, 6 and 7) - Chapter 6, Sections 6.4 and 6.6, rules (6.7) and (6.9) with the Sarsa box and equation (6.9) (printed pp. 129 to 133). Depth: Skip Section 6.5 Q-learning and Section 6.7 maximization bias here.
2. [On-policy TD control](https://web.stanford.edu/class/cs234/slides/lecture4pre.pdf) (Stanford CS234 Winter 2026 - Policy Evaluation and Q-Learning) - Lecture 4, Model-free Policy Iteration with TD Methods (slide 33) and the SARSA update under Properties of TD-Style Tabular Control (slide 38). Depth: Use the lecture's control framing; the update contracts live in Sutton.

**Focus**

- Sarsa's target $`R_{t+1} + \gamma Q(S_{t+1}, A_{t+1})`$ uses the action actually taken next. It evaluates the behavior policy, including its exploration.
- Expected Sarsa replaces the sampled $`Q(S_{t+1}, A_{t+1})`$ with $`\sum_a \pi(a \mid S_{t+1}) Q(S_{t+1}, a)`$. Same expectation, less variance from random next actions.
- With a greedy target policy the expectation becomes the max, so Expected Sarsa matches the Q-learning target while keeping the Sarsa update schema.

**Reproduce:** Closed-book, load `Q = [[1.0, 2.0], [3.0, 4.0]]` and process the transition `(0, 0, 1.0, 1, False)` with `alpha=0.1`, `gamma=0.9` and `epsilon=0.1`. Show the expected next value is $`0.05 \times 3.0 + 0.95 \times 4.0 = 3.95`$ and the updated value is $`Q(0, 0) = 1.3555`$.

**Traps**

- Using the max in the Sarsa target. That turns it into Q-learning and silently changes the evaluated policy.
- Computing the expectation under $`b`$ instead of $`\pi`$. Expected Sarsa averages with target-policy probabilities.
- Forgetting the terminal mask in Expected Sarsa. At termination the expectation term drops out just like any bootstrap.

**Practice**

- [Deep-ML 175: SARSA](https://www.deep-ml.com/problems/175) - Run `sarsa_update` on the deterministic chains; the public tests check `Q('A', 'go') = 0.5000`, `Q('B', 'go') = 1.0000`, `Q('C', 'go') = 1.5000` and the three-start-state case. Greedy ties break toward the first action, as the second test shows. Match the chain by hand first.
- [Deep-ML 476: Expected SARSA](https://www.deep-ml.com/problems/476) - Process single-transition episodes with `expected_sarsa`; the public tests check `1.3555` for the continuing case and `2.5` for the terminal case. Derive the 3.95 expectation before running. The tests cover one transition each, so add a multi-step episode of your own.

**Stop when:** Both Deep-ML suites pass unmodified, and you can write both targets and their evaluated policies from memory.

<details>
<summary>Self-test</summary>

1. Write both targets.
   - Sarsa: $`R_{t+1} + \gamma Q(S_{t+1}, A_{t+1})`$. Expected Sarsa: $`R_{t+1} + \gamma \sum_a \pi(a \mid S_{t+1}) Q(S_{t+1}, a)`$.
2. Why does Expected Sarsa have lower variance than Sarsa at fixed $`\alpha`$?
   - It averages over next-action randomness analytically instead of sampling one $`A_{t+1}`$.
3. Behavior turns fully greedy with a greedy target. What happens to the three targets?
   - Expected Sarsa's target becomes the Q-learning max exactly. Sarsa's sampled next action is greedy too, but it is chosen before the update, so when $`S_{t+1} = S_t`$ the update can change the greedy action and Sarsa can still differ from Q-learning (Exercise 6.12).
4. A learner updates $`Q(S_t, A_t)`$ with the action from two steps later. What broke?
   - Action alignment. The target must use the action at $`t+1`$, not a later one; stale next actions bias control.

</details>

#### U9. Q-learning and $`\epsilon`$-greedy exploration schedules

**About 4 h** · **Target:** Implement

Topics: Q-learning control; Epsilon-greedy behavior and exploration schedules

Q-learning learns optimal values from exploratory data. The max target separates what is learned from how data is collected, and $`\epsilon`$ schedules decide whether every pair gets visited.

**You can now**

- Implement Q-learning with $`\epsilon`$-greedy behavior and match fixed updates exactly.
- Derive $`\epsilon`$-greedy action probabilities and design a decay schedule that keeps visiting all pairs.
- Explain why Q-learning converges toward optimal values while its behavior stays exploratory.

**Study**

1. [Q-learning and $`\epsilon`$-greedy behavior](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) (Reinforcement Learning: An Introduction (2nd ed.) - Chapters 2, 5, 6 and 7) - Chapter 6, Sections 6.4 and 6.5, rule (6.8) with the Q-learning box (printed pp. 129 to 132). Depth: Focus on the max target and $`\epsilon`$-greedy behavior; leave Expected Sarsa to the previous unit.
2. [Q-learning convergence and coverage](https://web.stanford.edu/class/cs234/slides/lecture4pre.pdf) (Stanford CS234 Winter 2026 - Policy Evaluation and Q-Learning) - Lecture 4, $`\epsilon`$-greedy policies and their improvement (slides 19 to 21), GLIE (slides 29 to 30), Q-learning with $`\epsilon`$-greedy exploration (slides 35 to 36) and Convergence Properties of Q-Learning with the Robbins-Monro step-size conditions (slide 37). Depth: Use the assumption statements; the function-approximation half of the lecture belongs to the next section.
3. [$`\epsilon`$-greedy as a seed-sensitive choice](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter03_mdp/bandit) (Hands-on Modern RL - Dynamic Programming, Monte Carlo and TD) - Section 2.1 on exploration and exploitation with the bandit comparison (page read 2026-10-14). Depth: Read the method ranking as seed-dependent and compare across seeds; one run proves nothing.

**Focus**

- Q-learning's target $`R_{t+1} + \gamma \max_a Q(S_{t+1}, a)`$ assumes the greedy action next, whatever $`A_{t+1}`$ was. Convergence needs all pairs visited repeatedly plus standard step-size conditions.
- $`\epsilon`$-greedy picks the greedy action with probability $`1 - \epsilon + \epsilon/|\mathcal{A}|`$ and each other action with $`\epsilon/|\mathcal{A}|`$. With $`\epsilon = 0.1`$ and two actions that is $`0.95`$ and $`0.05`$.
- Decay $`\epsilon`$ toward zero for asymptotic optimality, but keep it high enough early that coverage precedes exploitation. The cliff unit shows what happens otherwise.

**Reproduce:** From a blank file, process a single-action chain ending at a terminal state with rewards `1.0`, `2.0` and `3.0` using `alpha=0.5` and `gamma=0.9` from zero values to get `Q('A', 'go') = 0.5000`, `Q('B', 'go') = 1.0000` and `Q('C', 'go') = 1.5000`. State why the max changes nothing on this chain.

**Traps**

- Decaying $`\epsilon`$ to zero before values settle. Behavior turns greedy around bad values and coverage ends early.
- Copying action indices across libraries. Deep-ML 518 orders the four moves up, down, left, right while Gymnasium orders them up, right, down, left. Index by name, not by number.
- Reading online return as the learned policy's value. Under $`\epsilon`$-greedy behavior, online returns include exploration steps; evaluate the greedy policy separately.

**Practice**

- [Deep-ML 133: Q-Learning](https://www.deep-ml.com/problems/133) - Implement `q_learning` on the given `P` and `R` matrices; the public tests call `np.random.seed(42)` and compare small learned Q-tables. The tests pin stochastic outcomes, so match the update and the $`\epsilon`$-greedy sampling order exactly, then re-run with two more seeds of your own.

**Stop when:** Deep-ML 133 passes, your chain values match by hand, and you can write $`\epsilon`$-greedy probabilities for any $`\epsilon`$ without notes.

<details>
<summary>Self-test</summary>

1. With $`\epsilon = 0.2`$ and four actions, what is the greedy-action probability?
   - $`1 - 0.2 + 0.2/4 = 0.85`$. Each other action gets $`0.05`$.
2. Why can Q-learning learn $`q_*`$ from random behavior?
   - Its target bootstraps the max, so updates point at the optimal values whenever all pairs keep being visited, regardless of which policy visits them.
3. Greedy actions tie. How should ties break?
   - Deterministically and documented, for example lowest index. Deep-ML relies on `np.argmax` returning index 0.
4. Online average improves while the greedy policy is unchanged. What happened?
   - Exploration artifacts or luck. Report the greedy policy's return on separate evaluation seeds.

</details>

#### U10. SARSA versus Q-learning on risky paths, with multiple seeds and independent evaluation

**About 4 h** · **Target:** Measure

Topics: Risky-policy differences between SARSA and Q-learning; Multiple random seeds and independent evaluation streams

This is the on-policy versus off-policy split made visible. Identical exploration produces different policies because each update prices risk differently.

**You can now**

- Explain why Sarsa learns the safe path and Q-learning learns the cliff edge under shared $`\epsilon`$-greedy behavior.
- Run a multi-seed cliff comparison with independent evaluation streams and report spread, not one run.
- Attribute the performance gap to update-distribution effects, not to tuning.

**Study**

1. [Cliff walking: on-policy versus off-policy under risk](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) (Reinforcement Learning: An Introduction (2nd ed.) - Chapters 2, 5, 6 and 7) - Chapter 6, Example 6.6 with its episode-reward graph (printed pp. 131 to 133). Depth: Read the online-performance explanation closely: Q-learning learns optimal values but falls in more often during training.
2. [CliffWalking environment contract](https://gymnasium.farama.org/environments/toy_text/cliff_walking/) (Gymnasium Core API) - Environment description: start state, goal state, cliff penalty with return to start, and the four-action movement set (Gymnasium 1.4.0; page read 2026-10-14). Depth: Use the installed release behavior you check by running it; the page text is the contract, not the dynamics proof.
3. [Matched budgets for the comparison](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/reinforcement-learning-control-laboratory.md) (Reinforcement Learning Control Laboratory - Tabular Control) - Measurement requirements: matched interaction budgets with per-seed raw curves.

**Focus**

- Sarsa prices the exploration it actually does: its updates include the $`\epsilon`$-greedy falls, so the safe path wins. Q-learning prices the max, so the cliff edge wins on values while behavior still falls.
- Online episode return mixes learning and exploration. Compare greedy-policy evaluation streams on held-out seeds, averaged over many runs as in Figure 6.3.
- Use the same $`\epsilon`$, the same $`\alpha`$ and the same seeds for both algorithms. Otherwise the gap may come from tuning, not from the update.

**Reproduce:** From a blank file, build the 4 by 12 cliff grid with start `(3, 0)`, goal `(3, 11)`, cliff cells `(3, 1)` to `(3, 10)`, reward `-1` per step and `-100` on cliff entry with return to start. Verify single transitions: stepping into the cliff returns the start with `-100`, and reaching the goal ends the episode.

**Traps**

- Judging by learned values alone. The Q-learning values sit closer to optimal while its online return is worse; report both.
- Running one seed each. Cliff falls are rare events; single runs move the averages by ten points or more. Keep every seed.
- Correcting the Gymnasium page number for Example 6.6. Its page 132 matches the second-edition printed page; cite the example number anyway, since printings and PDF page counts differ.

**Practice**

- [Deep-ML 518: Cliff Walking Sarsa versus Q-Learning](https://www.deep-ml.com/problems/518) - Implement `cliff_walking_comparison`; the public tests call it with `num_episodes=500`, `alpha=0.5`, `gamma=1.0`, `epsilon=0.1`, `seed=42` and expect `(-37.1, -59.7)`, then with `num_episodes=200` and `seed=0` and expect `(-53.7, -63.1)`. Each algorithm uses its own `RandomState` at the given seed, episodes cap at 1000 steps, and ties use `np.argmax`. Treat the pinned averages as regression values for your implementation, not as targets: re-run with more seeds and report the spread.

**Stop when:** Your grid passes the single-transition checks, your multi-seed comparison shows the safer Sarsa path against the optimal Q-learning values, and you can explain the gap without appealing to tuning.

<details>
<summary>Self-test</summary>

1. Both algorithms use identical $`\epsilon`$-greedy behavior. Why do their paths differ?
   - Their targets differ. Sarsa backs up the exploratory action including falls; Q-learning backs up the max, which ignores the fall risk during learning.
2. The Q-learning sum of rewards per episode is worse although its values are more optimal. Explain.
   - Online returns count exploration falls. The values describe the greedy policy; the behavior policy keeps stepping off the edge.
3. What happens as $`\epsilon`$ decays to zero for both?
   - Both converge toward the optimal policy. The book states this at the end of Example 6.6.
4. A comparison tunes $`\epsilon`$ separately per algorithm and declares a winner. What is wrong?
   - The tuning budget differs, so the gap may come from exploration, not the update. Match budgets and report seeds.

</details>

#### U11. Terminal versus truncated bootstrapping and reward, action, next-state and discount alignment

**About 4 h** · **Target:** Implement

Topics: Terminal versus truncated bootstrapping; Reward, action, next-state and discount alignment

One wrong zero at a time limit corrupts every value upstream. Termination and truncation look identical in a done flag but demand opposite bootstraps.

**You can now**

- Implement terminal versus truncated bootstrapping: zero beyond termination, keep $`V(S')`$ on truncation.
- Align reward, action, next state and discount indices on fixed trajectories.
- Detect autoreset and done-flag bugs that store fake transitions.

**Study**

1. [Terminated versus truncated step API](https://gymnasium.farama.org/api/env/) (Gymnasium Core API) - Env `step` returning separate `terminated` and `truncated` flags with `info`, and `reset` with `seed`, including the version 0.26 done-flag split (Gymnasium 1.4.0; page read 2026-10-14).
2. [Terminal values in the control boxes](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) (Reinforcement Learning: An Introduction (2nd ed.) - Chapters 2, 5, 6 and 7) - The Sarsa and Q-learning boxes with $`Q(\text{terminal}, \cdot) = 0`$ and episodes ending at terminal states (printed pp. 129 to 132). Depth: Read for the terminal convention only; control targets live in earlier units.
3. [Vector autoreset mode](https://farama.org/Vector-Autoreset-Mode) (Gymnasium Core API) - Next-step autoreset: the step that ends an episode returns the true final observation, and the next step returns the reset observation (page read 2026-10-14). Depth: Run the installed release to confirm the mode, then never store the autoreset step as a transition.

**Focus**

- Termination ends the MDP: the target is $`R_{t+1}`$ with no bootstrap. Truncation ends the data: the target keeps $`\gamma V(S')`$ with $`S'`$ the final observation from the truncating step, never the reset observation from the autoreset step.
- Index rule: $`R_{t+1}`$ and $`S_{t+1}`$ belong to $`(S_t, A_t)`$. The discount $`\gamma`$ multiplies the next state's value, never the reward.
- Vector next-step autoreset returns the true final observation with flags set, then ignores the next action and returns the reset observation with zero reward. That autoreset step is not a transition and must not be stored.

**Reproduce:** Closed-book, write both targets for $`R_{t+1} = 1`$, $`V(S_{t+1}) = 7`$ and $`\gamma = 0.9`$: termination gives $`1`$ and truncation gives $`1 + 0.9 \times 7 = 7.3`$. Then run `CliffWalking-v1` with `reset(seed=0)` and confirm `step` returns separate `terminated` and `truncated` flags.

**Traps**

- Collapsing both flags into one done. A time-limit done with zero bootstrap undervalues every state near the limit.
- Bootstrapping from the autoreset observation with the ignored action's reward. The reset step carries reward 0 and no flags; storing it trains on a fake transition.
- Off-by-one discount exponents. The first reward after $`S_t`$ is undiscounted; $`\gamma`$ starts applying at the next state's value.

**Practice**

- The section mini-project covers this: seeded alignment and bootstrap defects with terminal-versus-truncated tests.

**Stop when:** You write both targets from memory, your buffer test rejects autoreset steps, and a shifted-index defect fails loudly.

<details>
<summary>Self-test</summary>

1. Time limit hits with value $`7`$ ahead. What is the target?
   - Keep bootstrapping: $`R + \gamma \times 7`$. The limit is truncation, not termination.
2. Goal reached with final reward 1. What is the target?
   - Exactly 1. Termination zeroes everything beyond.
3. A buffer stores the autoreset step as one transition. Why is it fake?
   - Its action was ignored and its observation is a fresh reset. It is not a transition from $`s`$.
4. Reward indices shift by one in the buffer. Which updates break first?
   - All n-step and TD targets: every $`R_{t+k}`$ pairs with the wrong state.

</details>

#### U12. Trajectory schemas with environment, policy, seed and version identity

**About 3 h** · **Target:** Implement

Topics: Trajectory schemas with environment, policy, seed and version identity

RL results change with seeds and versions. Without identity on each record, no comparison is reproducible and no defect is attributable.

**You can now**

- Define a trajectory record that binds environment, policy, seed and versions to every transition.
- Separate training and evaluation streams with distinct seeds and no shared exploration.
- Validate records: reject missing identity fields before any update runs.

**Study**

1. [Seeding, spec identity and step fields](https://gymnasium.farama.org/api/env/) (Gymnasium Core API) - `reset` with `seed` called once after construction, the `spec` version identity, and the `terminated`, `truncated` and `info` step fields (Gymnasium 1.4.0; page read 2026-10-14).
2. [Shared schema in the control laboratory](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/reinforcement-learning-control-laboratory.md) (Reinforcement Learning Control Laboratory - Tabular Control) - Core requirements and Architecture constraints: one shared transition and trajectory schema with policy and environment version.

**Focus**

- Each record carries environment id and version, policy id and version, seed, step index, $`(s, a, r, s')`$, flags and versions. Analysis joins on identity, never on row order.
- Evaluation uses distinct seed streams and no training exploration unless the comparison states it. Shared streams leak training noise into evaluation.
- Wrappers must not change rewards or termination silently. If a wrapper alters either, its version changes and old records stop mixing with new ones.

**Reproduce:** From a blank file, emit one JSON record for a `CliffWalking-v1` step with environment version, policy id, seed, `terminated`, `truncated` and reward, then show a loader accepting it and rejecting the same record with the seed deleted.

**Traps**

- Reseeding every episode identically. The same seed replays the same trajectory; streams need distinct seeds drawn from one master seed.
- Storing only the environment id. Library versions change dynamics and autoreset behavior, so the version is part of identity.
- Letting evaluation share the training RNG. Exploration settings then leak across the boundary the schema was built to enforce.

**Practice**

- The section mini-project covers this: the shared trajectory schema with versioned environment and policy identity.

**Stop when:** Your loader round-trips a versioned record, rejects identity gaps, and your evaluation streams run on seeds the trainer never used.

<details>
<summary>Self-test</summary>

1. Two runs differ only in library version. Comparable?
   - Not directly. Version is part of identity; re-run or analyze separately.
2. What breaks if the seed is missing from records?
   - Attribution. A strange trajectory cannot be replayed or tied to its stream.
3. A wrapper clips rewards but keeps the old version. Acceptable?
   - No. Silent reward changes invalidate every comparison; version the wrapper and segregate records.

</details>

#### U13. Average-reward formulation for continuing tasks

**About 3 h** · **Target:** Derive

Topics: Average-reward continuing-task theory

In a continuing task with function approximation, discounting stops being a well-defined objective: averaged over the on-policy distribution it ranks policies exactly as average reward does, and discounted methods lose the policy improvement guarantee. Average reward names the steady rate a never-ending controller earns.

**You can now**

- Define average reward $`r(\pi)`$ and differential returns for continuing tasks.
- Derive differential TD errors and state why values hold only up to an additive offset.
- Compute the average reward of the three-state ring and explain its differential differences.

**Study**

1. [Average reward and differential values](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) (Reinforcement Learning: An Introduction (2nd ed.) - Starred Sections 5.8 and 5.9 and Chapter 10 Sections 10.3 to 10.5) - Chapter 10, Sections 10.3 to 10.5, equations (10.6), (10.7) and (10.9) to (10.11) with Exercises 10.6 and 10.7 (printed pp. 249 to 255). Depth: Read the average-reward definition, differential returns and Exercise 10.7 closely; skim the access-control example and the discounting discussion as context.

**Focus**

- Average reward $`r(\pi)`$ is the mean reward per step under $`\pi`$ from (10.6) and (10.7). Policies order by $`r(\pi)`$, and all maximal policies count as optimal.
- Differential returns subtract $`r(\pi)`$ per step: $`G_t = (R_{t+1} - r(\pi)) + (R_{t+2} - r(\pi)) + \cdots`$. Differential Bellman equations drop $`\gamma`$ and center rewards.
- Adding one constant to every differential value leaves the equations and TD errors unchanged, so algorithms converge up to an offset.

**Reproduce:** Closed-book, take the deterministic ring $`A \to B \to C \to A`$ with reward $`1`$ on arrival in $`A`$ and $`0`$ elsewhere. Show the average reward is $`1/3`$, then show the differential differences satisfy $`v(C) - v(B) = 1/3`$ and $`v(B) - v(A) = 1/3`$ up to a shared offset.

**Traps**

- Treating $`\gamma`$ as part of the continuing control problem. Averaged over the on-policy distribution, discounted value equals $`r(\pi)/(1-\gamma)`$, so $`\gamma`$ cannot change the ranking, and discounted algorithms with function approximation do not optimize that average (Section 10.4).
- Pinning absolute differential values. Only differences are identified; demand the offset-free comparison.
- Using the raw differential sum on periodic tasks. The plain infinite sum need not converge; Exercise 10.6 motivates the repaired definition (10.13).

**Practice**

- [Sutton and Barto Exercise 10.7: three-state ring average reward](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) - Exercise 10.7: compute the average reward and the differential values of the ring under (10.13). Check the 1/3 rate and the 1/3 gaps against your own derivation. The absolute level is free; the gaps are not.

**Stop when:** You define $`r(\pi)`$ and the differential TD errors without notes and reproduce the ring's $`1/3`$ rate with its value gaps.

<details>
<summary>Self-test</summary>

1. What does Section 10.4 show about discounting in continuing tasks?
   - Averaged over the on-policy distribution, discounted value is $`r(\pi)/(1-\gamma)`$, so every $`\gamma`$ ranks policies like average reward. With function approximation the policy improvement theorem is lost, so discounted algorithms carry no guarantee of optimizing that average.
2. What is $`r(\pi)`$ for the ring with one reward of 1 per three steps?
   - $`1/3`$ per step.
3. Differential values come out spaced by $`1/3`$ up to an offset. Which part matters?
   - Pairwise gaps of $`1/3`$. Shifting every value by one constant changes nothing in the equations.
4. The differential Sarsa box updates the average reward with $`\delta_t`$. Why not with the raw reward gap alone?
   - With the differential values right, $`\delta_t`$ is 0 at every step on the Exercise 10.7 ring, while $`R_{t+1} - \bar{R}`$ keeps cycling through 2/3, -1/3 and -1/3. The $`\delta_t`$ error gives the steadier average-reward estimate (Exercise 10.8).

</details>

### Mini-project: Tabular sampling with exact trajectory oracles

**About 12 to 16 hours.** Extend `policylab` with tabular Monte Carlo and TD control checked against fixed-trajectory oracles, plus behavior and target policy bookkeeping with support diagnostics. Every update is tested without environment noise before any multi-seed comparison runs.

1. Add `tabular/` samplers that emit the shared trajectory record with environment, policy, seed and version identity, and reject records with missing identity before any update runs; evaluate only on held-out seed streams.
2. Build fixed-trajectory oracles for returns, one-step and multi-step targets that cut the bootstrap at termination and keep it at truncation, pass Deep-ML 272, Deep-ML 257 and Deep-ML 273, and catch seeded alignment and bootstrap defects.
3. Implement Sarsa, Expected Sarsa and Q-learning from explicit batches with no hidden environment calls, pass Deep-ML 175, Deep-ML 476 and Deep-ML 133, and label behavior against target policies on exploration-sensitive trajectories including a coverage failure.
4. Compute ordinary, weighted and per-decision importance estimates on fixed trajectories, track effective sample size curves and visitation logs that name uncovered pairs, and refuse estimates where support is missing.
5. Compare constant against decreasing step sizes under matched interaction budgets with visitation logs, and show which schedule tracks drift and which converges.
6. Run the Sarsa against Q-learning cliff comparison across several seeds with independent evaluation streams and matched budgets, pass Deep-ML 518, and derive the average-reward ring rate with its value gaps.

**Deliverables**

- Tabular samplers with the versioned trajectory schema and fixed-trajectory update oracles.
- Tests: return and target boundaries, control updates, importance estimates, support refusal and seeded defects.
- Matched-budget step-size and cliff comparisons with per-seed raw curves and the ring derivation.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [Deep-ML 272: First-Visit Monte Carlo Prediction](https://www.deep-ml.com/problems/272). Pass closed-book first; then add a two-episode average of your own.
- external-tests: [Deep-ML 257: Compute Temporal Difference Error](https://www.deep-ml.com/problems/257). Pass closed-book first; also test your own one-step value update.
- external-tests: [Deep-ML 273: n-Step TD Prediction](https://www.deep-ml.com/problems/273). Match the hand target first; add terminal-boundary cases of your own.
- external-tests: [Deep-ML 175: SARSA](https://www.deep-ml.com/problems/175). Match the chain by hand first; ties break toward the first action.
- external-tests: [Deep-ML 476: Expected SARSA](https://www.deep-ml.com/problems/476). Derive the expectation first; add a multi-step episode of your own.
- external-tests: [Deep-ML 133: Q-Learning](https://www.deep-ml.com/problems/133). Match the update and sampling order exactly; re-run on more seeds.
- external-tests: [Deep-ML 518: Cliff Walking Sarsa versus Q-Learning](https://www.deep-ml.com/problems/518). Treat pinned averages as regression values; report spread over more seeds.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Update oracles | Fixed-trajectory returns and targets match hand computation, and every seeded alignment defect fails loudly. | A live-run mismatch is traced to the update rather than blamed on sampling noise. |
| Policy labeling | Behavior and target policies are labeled on every trajectory, and the coverage failure refuses estimation. | The cliff gap is attributed to update distribution rather than tuning. |
| Support diagnostics | Visitation logs name uncovered pairs and effective sample size curves mark collapse. | A planted zero-support pair is caught before any estimator runs. |
| Budget honesty | Comparisons use matched budgets with all seeds retained and evaluation on separate streams. | A best-seed claim is shown to reverse under the full seed set. |

Feeds into: Tabular oracles, trajectory identity and support diagnostics feed deep value, policy, offline and language-policy projects and the capstone classical core.

### Resource route

- **Primary - Book:** [Reinforcement Learning: An Introduction (2nd ed.) - Chapters 2, 5, 6 and 7](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) - The authors post the full second edition free at incompleteideas.net; cite the printed page numbers. Study Sections 2.4 and 2.5 (incremental and constant step-size estimates), Chapter 5 without the starred sections (Monte Carlo prediction and control, ordinary and weighted importance sampling), Chapter 6 Sections 6.1 to 6.7 (TD(0), Sarsa, Q-learning, Expected Sarsa, maximization bias) and Chapter 7 Sections 7.1 to 7.3 (n-step methods). Reproduce Example 5.4 (off-policy blackjack), Example 6.2 (random walk) and Example 6.6 (cliff walking), and implement each update from fixed hand-calculated trajectories before training an agent.
- **Required - Course:** [Stanford CS234 Winter 2026 - Policy Evaluation and Q-Learning](https://web.stanford.edu/class/cs234/modules.html) - Study Lecture 3 (tabular policy evaluation) and Lecture 4 (Q-learning) slides and the relevant independent Assignment 1 and 2 written questions. Use the course treatment to state model-access, convergence, coverage and function-approximation assumptions for each update.
- **Support - Tutorial:** [Hands-on Modern RL - Dynamic Programming, Monte Carlo and TD](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter03_mdp/dp-mc-td) - Use the DP, MC and TD page and the bandit script as a code companion. Rebuild the algorithms in the shared track schema, and keep the bandit comparison as a seed-sensitivity case: which method wins changes with the seed. Pin commit 9231bab of walkinglabs/hands-on-modern-rl; its `code/chapterNN` folders do not follow the site chapter numbers.
- **Reference - Documentation:** [Gymnasium Core API](https://gymnasium.farama.org/api/env/) - Use the reset, step, seeding and wrapper documentation as the behavior authority for the installed environment version: `reset(seed=...)` seeds once, `step` returns `terminated` and `truncated`, and vector environments autoreset on the next step by default. Test observation, reward, terminated, truncated and info fields at the boundary.
- **Support - Practice:** [Deep-ML - Tabular Prediction and Control Problems](https://www.deep-ml.com/problems/133) - Use named problems as closed-book checks after your own implementation passes: 272 (first-visit Monte Carlo), 257 (TD error), 273 (n-step TD), 175 (SARSA), 476 (Expected SARSA), 133 (Q-learning) and 518 (cliff walking, SARSA versus Q-learning). Read each problem's tests before trusting its statement.
- **Required - Project:** [Reinforcement Learning Control Laboratory - Tabular Control](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/reinforcement-learning-control-laboratory.md) - Complete the MC, SARSA and Q-learning requirements with exact trajectory updates, stochastic and exploration-sensitive environments, visitation logs, matched interaction budgets and seeded alignment and bootstrap defects.
- **Support - Book:** [Reinforcement Learning: An Introduction (2nd ed.) - Starred Sections 5.8 and 5.9 and Chapter 10 Sections 10.3 to 10.5](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) - Study starred Section 5.9 on per-decision importance sampling only for the per-decision estimator, and Chapter 10 Sections 10.3 to 10.5 on average reward and differential values only for the continuing-task unit. Cite printed pages; the authors post the full text free at incompleteideas.net.

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

### Study units

#### U1. Value-function approximation, linear features and state aggregation

**About 4 h** · **Target:** Explain + Derive

Topics: Value-function approximation and generalization across states; Linear features, state aggregation and projected solutions

Tables cannot cover large or continuous state spaces. Linear approximation is the first generalizer, and its error measure and sampling assumptions decide whether every later deep update is stable.

**You can now**

- Explain why value prediction with shared weights generalizes across states, and what it can no longer represent.
- Derive the stochastic-gradient update for the mean-squared value error and state the distribution it assumes.
- Predict how state aggregation biases each group's value toward its most visited members.

**Study**

1. [Approximation as supervised examples and the value error](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) (Reinforcement Learning: An Introduction (2nd ed.) - Chapters 9 and 11) - Sections 9.1 and 9.2, printed pp. 198-199: the update-as-example view (each update is one pair $`s \to u`$) and the mean-squared value error $`\text{VE}(w) = \sum_s \mu(s)[v_{\pi}(s) - \hat{v}(s, w)]^2`$ as Eq. 9.1. Depth: The authors post the full text free at incompleteideas.net. Read the sections there and cite the printed pages above.
2. [Linear methods, state aggregation and the random-walk demo](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) (Reinforcement Learning: An Introduction (2nd ed.) - Chapters 9 and 11) - Sections 9.4 and 9.5, printed pp. 203-210: $`\hat{v}(s, w) = w^\top x(s)`$ with gradient $`\nabla \hat{v}(s, w) = x(s)`$, Example 9.1 and Figure 9.1 (1000-state random walk, 10 groups of 100 states).
3. [Fitted value iteration and the curse of dimensionality](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-7.pdf) (Berkeley CS 185/285 Deep Reinforcement Learning (Spring 2026) - Value-Based RL and Q-Learning in Practice) - Lecture 7 (Value-Based RL), Part 3, slides 10 to 14: fitted value iteration, the curse of dimensionality, and fitted Q-iteration as the sample-based bridge.

**Focus**

- Each tabular update is one supervised example $`s \to u`$. Approximation shares the correction across states through the weight vector $`w`$.
- The error measure weights states by the visitation distribution $`\mu`$. An unweighted fit optimizes a different objective than on-policy performance.
- In the linear case the gradient is the feature vector itself, so one update moves every state that shares features.
- Figure 9.1 shows the consequence: each aggregation group learns one constant, pulled toward its most visited members, with abrupt boundaries between groups.

**Reproduce:** Closed-book, derive the linear stochastic-gradient update from $`\text{VE}`$ and explain why the leftmost groups in Figure 9.1 sit above the unweighted mean of their members' true values.

**Traps**

- Minimizing error on a uniform state sample instead of under $`\mu`$. A uniform sweep is already off-policy training, which the next units show can diverge.
- Reading more features as strictly better. Under on-policy linear gradients they approach the value error minimum, but under bootstrapping or off-policy data that guarantee lapses.
- Blaming the step size for a representation limit. No choice of $`\alpha`$ lets a coarse aggregation represent $`v_{\pi}`$ inside a group.

**Practice**

- [Sutton and Barto Chapter 9: Exercises 9.7 and 9.8](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) - Printed p. 237: derive the learning algorithm for a semi-linear logistic unit from Eq. 9.7 with no gradient notation, then repeat the derivation with cross-entropy loss

**Stop when:** You derive the linear update without notes and predict the direction of the aggregation bias for a skewed visitation before opening Figure 9.1.

<details>
<summary>Self-test</summary>

1. Why does the book call each update $`s \to u`$ a training example?
   - Each update names an input state and a desired output target, exactly the interface a supervised approximator expects. The reinforcement learning part is how $`u`$ is constructed.
2. Two states share all features. What happens when one of them is updated?
   - Both estimates move together, because the update changes the shared $`w`$. The gradient $`\nabla \hat{v} = x(s)`$ is identical for both states.
3. In Figure 9.1, why do the leftmost group values sit above their members' unweighted mean?
   - Right members of those groups carry far larger $`\mu`$ weight (state 100 outweighs state 1 more than threefold), so the group constant fits them more closely.
4. Does the value error optimum change when visitation changes?
   - Yes. $`\text{VE}`$ weights by $`\mu`$, so a new visitation distribution defines a new objective with generally a new best $`w`$.

</details>

#### U2. Semi-gradient TD, on-policy prediction and value error versus Bellman error

**About 5 h** · **Target:** Derive + Implement

Topics: Semi-gradient TD updates; Mean-squared value error and Bellman-error distinctions; On-policy prediction with function approximation

Every deep value update is a semi-gradient step. If you cannot say which term is dropped, target-network and detachment bugs stay invisible.

**You can now**

- Derive the semi-gradient TD(0) update and name the gradient term it drops.
- Explain why a Monte Carlo target gives a true gradient while a bootstrapped target does not.
- Compute value error and Bellman error on a small example and state which one samples can estimate.

**Study**

1. [Stochastic gradients, gradient Monte Carlo and semi-gradient TD(0)](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) (Reinforcement Learning: An Introduction (2nd ed.) - Chapters 9 and 11) - Section 9.3, printed pp. 200-203: Eqs. 9.4 to 9.7, the gradient Monte Carlo box, and the semi-gradient TD(0) box with $`U_t = R_{t+1} + \gamma \hat{v}(S_{t+1}, w)`$. The key sentence is that these methods account for the effect on the estimate but ignore the effect on the target.
2. [Why the Bellman error is not learnable](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) (Reinforcement Learning: An Introduction (2nd ed.) - Chapters 9 and 11) - Section 11.6, printed pp. 274-275: the learnability argument and the two-MRP example with identical features but different Bellman error. The double-sampling requirement is in Section 11.5, printed p. 272.

**Focus**

- A true gradient needs the target independent of $`w`$. Bootstrapped targets depend on $`w_t`$, so the step from Eq. 9.4 to Eq. 9.5 is invalid and only part of the gradient is used.
- Gradient Monte Carlo converges to a local value error optimum under standard step-size conditions. Semi-gradient TD(0) converges in the linear on-policy case, but that does not make it true gradient descent.
- The value error needs the true $`v_{\pi}`$. The Bellman error squares an expectation, so estimating it needs two independent next-state samples; one sample used twice biases it.
- On-policy prediction means states arrive under the target policy's $`\mu`$. Change the sampling distribution and the fixed point moves.

**Reproduce:** Closed-book, compute one linear semi-gradient TD(0) step with features $`x = [1, 0]`$, weights $`w = [0.5, 0.5]`$, reward $`r = 1`$, a terminal next state, $`\gamma = 0.9`$ and $`\alpha = 0.1`$: show $`\delta = 0.5`$ and the new $`w = [0.55, 0.5]`$. Then state which gradient term was ignored.

**Traps**

- Calling TD(0) a gradient method on the value error. The target-dependence term is dropped in every update.
- Reading zero TD error as zero value error. Zero TD error marks the TD fixed point, which generally differs from the value error minimum.
- Trusting a small single-sample Bellman residual. Without double sampling the estimate is biased, and minimizing it can prefer the wrong function.

**Practice**

- [Deep-ML 530: Linear Value Function Approximation with Semi-Gradient TD(0)](https://www.deep-ml.com/problems/530) - Implement `linear_td0_approximation`. The tests check a one-step terminal update (weights `[0.1, 0.0]`) and a two-step episode (weights `[0.1, 0.2]`). Do it closed-book after the hand computation passes. The tests check exact weight vectors.

**Stop when:** Your hand update matches Deep-ML 530 exactly, and for any target you can state whether its gradient is true or semi.

<details>
<summary>Self-test</summary>

1. Which step of the SGD derivation fails for bootstrapped targets?
   - From Eq. 9.4 to Eq. 9.5. Moving the gradient inside the square requires the target to be independent of $`w`$, but bootstrapped targets depend on $`w_t`$.
2. In Reproduce, what changes if the transition is non-terminal with $`\hat{v}(s') = 2.0`$?
   - $`\delta = 1 + 0.9 \times 2.0 - 0.5 = 2.3`$. The update adds $`0.1 \times 2.3 \times [1, 0] = [0.23, 0]`$, giving $`w = [0.73, 0.5]`$.
3. Why does the Bellman error need two independent next-state samples?
   - Its square contains an expectation inside the square. Reusing one sample for both factors correlates them and biases the estimate.
4. Linear on-policy TD(0) converges, yet the book still calls it semi-gradient. Why?
   - Convergence in that restricted case does not make it true gradient descent. The term from the target's dependence on $`w`$ is still dropped.

</details>

#### U3. Off-policy bootstrapping, the deadly triad and Baird's counterexample

**About 5 h** · **Target:** Derive + Measure

Topics: Off-policy bootstrapping with function approximation; The deadly triad: approximation, bootstrapping and off-policy data; Baird-style divergence mechanism and controlled reproduction

This is the cheapest divergence in reinforcement learning: zero reward with an exactly representable truth. Replay buffers and target networks exist because of this failure.

**You can now**

- Work through Baird's counterexample and name the update direction that causes instability.
- State the three triad elements and why any two alone avoid this failure.
- Run a controlled divergence demonstration with a stable comparator and keep the divergent trajectory.

**Study**

1. [Off-policy divergence and Baird's counterexample](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) (Reinforcement Learning: An Introduction (2nd ed.) - Chapters 9 and 11) - Section 11.2, printed pp. 260-263: the two-state $`w`$ versus $`2w`$ warm-up (unstable whenever $`\gamma > 0.5`$), the seven-state Baird setup, Figure 11.1, and Figure 11.2 (semi-gradient TD on the left, semi-gradient DP on the right, both diverging from initial weights $`(1, 1, 1, 1, 1, 1, 10, 1)`$ with $`\alpha = 0.01`$).
2. [The deadly triad](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) (Reinforcement Learning: An Introduction (2nd ed.) - Chapters 9 and 11) - Section 11.3, printed pp. 264-265: the three-element definition (function approximation, bootstrapping, off-policy training), why uniform dynamic-programming sweeps count as off-policy, and Exercise 11.3 (semi-gradient Q-learning on Baird's counterexample).

**Focus**

- In the warm-up, each visit multiplies $`w`$ by $`1 + \alpha(2\gamma - 1)`$. Instability needs only $`\gamma > 0.5`$, for every positive step size.
- Baird's truth is all zeros and is exactly representable with linearly independent features, yet off-policy semi-gradient TD(0) diverges for any $`\alpha > 0`$. Representability never implied stability.
- Uniform dynamic-programming sweeps are off-policy here: uniform updates differ from the target policy's concentration on the seventh state.
- The on-policy distribution keeps the promise of future reward payable. Off-policy lets a promise be made, then forgotten after an action the target policy never takes.

**Reproduce:** From the book's initial weights $`(1, 1, 1, 1, 1, 1, 10, 1)`$ (norm about 10.34) with $`\alpha = 0.01`$ and $`\gamma = 0.99`$, sample a uniform state each step and take the dashed action with probability $`6/7`$ ($`\rho = 0`$) or the solid action with probability $`1/7`$ ($`\rho = 7`$). Run 1000 off-policy semi-gradient TD(0) steps on CPU for five seeds and show the norm reaches the hundreds on every seed, with the exact values varying by seed. Then run the on-policy twin, a trajectory that always takes the solid action and so settles on the seventh state, and show its norm stays near 10. Uniform states with solid actions are not that twin: the uniform update distribution is still off-policy and diverges.

**Traps**

- Blaming reward or representation. Baird has zero reward everywhere and an exact, linearly independent representation.
- Shrinking the step size as a fix. A smaller $`\alpha`$ only slows the blowup because the per-update factor still exceeds 1.
- Trusting expected (dynamic-programming) updates as safe. Figure 11.2 shows semi-gradient DP diverging too; only the on-policy distribution change stabilizes.

**Practice**

- [Deep-ML 557: Baird's Counterexample, Off-Policy TD Divergence](https://www.deep-ml.com/problems/557) - Implement `bairds_counterexample`. The tests check the no-update identity on an empty update list and one semi-gradient step from the book's initial weights

**Stop when:** Your own script diverges from the book's start while the on-policy twin stays bounded, and Deep-ML 557 passes.

<details>
<summary>Self-test</summary>

1. In the warm-up with $`\gamma = 0.9`$ and $`\alpha = 0.1`$, what is the per-update multiplier?
   - $`1 + 0.1 \times (2 \times 0.9 - 1) = 1.08`$. Each visit grows $`w`$ by about 8 percent.
2. Why is uniform dynamic programming off-policy training in this example?
   - Its update distribution is uniform over states while the target policy concentrates on the seventh state. The triad's off-policy leg is about distributions, not about sampling noise.
3. The true values are all zero and exactly representable. Why is divergence not a contradiction?
   - Representability does not imply stability. Under the wrong update distribution the semi-gradient direction at $`w = 0`$ points away from it.
4. Which single triad leg would you remove to keep bootstrapping and approximation?
   - Train on-policy, so ratios are 1 and visitation matches the target policy. Removing bootstrapping (Monte Carlo targets) is the alternative, at steep sample cost.

</details>

#### U4. Neural action-value functions and replay-buffer semantics

**About 4 h** · **Target:** Implement

Topics: Neural action-value functions; Replay-buffer ownership, capacity and sampling semantics

Replay and frozen targets turn an unstable neural Q-learner into something trainable. This unit builds the running baseline that every later unit instruments.

**You can now**

- Implement a Q-network, a replay buffer and the DQN loss from a blank file.
- Explain why replay breaks correlation and why targets use frozen parameters.
- Train CartPole on CPU and separate training exploration from greedy evaluation.

**Study**

1. [Why tables break and why naive networks fail](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter07_dqn/from-q-to-dqn#where-q-tables-break) (Hands-on Modern RL - From Q-Learning to DQN) - Sections Where Q-Tables Break through Why the Naive Replacement Still Fails: the bin-counting blowup, correlated samples, and moving targets (page read 2026-10-14). Depth: The TD-target formula on this page omits the terminal mask. Take the masked form from the next item.
2. [Q-network, loss and replay](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter07_dqn/dqn-components#q-network-and-loss) (Hands-on Modern RL - From Q-Learning to DQN) - Q-Network and Loss through Experience Replay: the masked loss $`L(\theta) = \mathbb{E}[(r + \gamma(1 - d)\max_{a'}Q(s', a'; \theta^{-}) - Q(s, a; \theta))^2]`$, the symbol-by-symbol table, and the five-tuple buffer (page read 2026-10-14).
3. [Target network and training loop](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter07_dqn/dqn-components#target-network) (Hands-on Modern RL - From Q-Learning to DQN) - Target Network through Learning vs. Inference: periodic hard copies, exploratory collection in the training loop, and greedy evaluation with $`\epsilon = 0.0`$ (page read 2026-10-14).
4. [Deep Q-learning with experience replay](https://arxiv.org/abs/1312.5602) (Playing Atari with Deep Reinforcement Learning) - Algorithm 1 and Section 4 in arXiv:1312.5602v1 (the three replay advantages: data efficiency, decorrelation, behavior averaging). Read Section 5 as reported Atari protocol, not as reproduction targets. Note this version has no target network: targets use the previous iterate.

**Focus**

- One forward pass outputs every discrete-action value, and `argmax` selects among them. Continuous actions need a different method entirely.
- The loss compares the prediction selected by `gather` against a target built under `torch.no_grad()` from the frozen network. Gradients must touch only the prediction.
- The workshop paper fixes targets with the previous iterate, not a periodic copy. The frozen-network copy used in code is the later stabilization of the same idea.
- Training explores while evaluation acts greedy. A test score measured with exploration mixes luck with learning.

**Reproduce:** Closed-book, trace one update on a batch of two with $`\gamma = 0.99`$: a non-terminal transition with $`r = 1`$, max next-Q 3.0 and current Q 2.0, plus a terminal transition with $`r = -1`$ and current Q 0.5. Show targets 3.97 and -1.0 with mean squared error 3.06545.

**Traps**

- Copying the first page's target verbatim. It omits the terminal mask, so terminal transitions bootstrap phantom future value.
- Reusing the online network for targets. That reintroduces the moving-target loop the frozen network exists to slow.
- Judging training by episode return alone. The paper's Section 5.1 shows return is noisy under shifting visitation, so track average predicted Q on a fixed state set too.

**Practice**

- [Hands-on Modern RL: CartPole DQN (`code/chapter04_dqn/dqn_cartpole.py`)](https://github.com/walkinglabs/hands-on-modern-rl/blob/9231bab/code/chapter04_dqn/dqn_cartpole.py) - Train CartPole on CPU per the file's training loop, then evaluate with `epsilon=0.0`. The file's `update` already shows `gather`, `torch.no_grad()` targets, the terminal mask and gradient clipping. Keep this run. Later units add diagnostics, defect tests and checkpoints to it, and the section mini-project extends it with replay and target state.
- [Deep-ML 537: Experience Replay Implementation](https://www.deep-ml.com/problems/537) - Implement the `ReplayBuffer` class. The tests check size tracking, circular overwrite at capacity, and that a full sample after overwrite returns only the newest three

**Stop when:** Your blank-file DQN trains CartPole on CPU, greedy evaluation beats the training average, and the two-transition hand loss matches to four decimals.

<details>
<summary>Self-test</summary>

1. Why output all action values at once instead of one value per forward pass?
   - One pass plus `argmax` scores every discrete action. Per-action passes would multiply inference cost by the action count.
2. What does `gather` do in the update?
   - It selects, for each batch row, the Q-value of the action actually taken, so the loss touches only visited state-action pairs.
3. The workshop target uses the previous iterate. What breaks if targets use freshly updated weights every step?
   - Prediction and target share parameters, so each update moves the label it just chased. The loss has no fixed label inside the step.
4. A CartPole agent scores 500 in testing but 200 in training. Is it broken?
   - No. Training mixes random exploratory actions while the test is greedy. Compare greedy with greedy.

</details>

#### U5. Transition immutability, replay aliasing, replay age and policy drift

**About 3 h** · **Target:** Explain + Implement

Topics: Transition immutability and replay aliasing; Replay age, policy drift and nonstationary data

A replay buffer is a dataset with an expiration date. One stored fake transition or a diet of ancient data silently changes the objective.

**You can now**

- State what a stored transition must contain and why stored fields are never edited in place.
- Explain replay age and policy drift: old transitions come from worse policies.
- Detect an autoreset artifact and a stale-data slowdown in your own buffer.

**Study**

1. [What a stored transition contains](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter07_dqn/dqn-components#experience-replay) (Hands-on Modern RL - From Q-Learning to DQN) - Experience Replay: the five-tuple table, the capacity range ($`10^4`$ to $`10^6`$), and the stale-experience warning for oversized buffers (page read 2026-10-14).
2. [Termination, truncation and the autoreset step](https://gymnasium.farama.org/tutorials/gymnasium_basics/handling_time_limits/) (Gymnasium - Time Limits and Vector Autoreset) - Termination, Truncation, Importance in learning code, and Solution (page read 2026-10-14). The autoreset behavior is on https://farama.org/Vector-Autoreset-Mode, not this page: in a vector environment under the default next-step autoreset of Gymnasium 1.x, the step after an episode ends returns reward 0 with both flags false (measured in Reproduce). That output is not a transition and must not be stored.
3. [What version-skewed storage code looks like](https://github.com/vwxyzjn/cleanrl/blob/fe8d8a03c41a7ef5b523e2e354bd01c363e786bb/cleanrl/dqn.py) (CleanRL DQN) - Lines 176 to 187 of `dqn.py` at commit fe8d8a0: the `final_info` logging branch and the `final_observation` storage fix. CleanRL pins `gymnasium==0.29.1`, where those keys exist. On Gymnasium 1.x they are gone, so the logging branch never fires and the storage line raises `KeyError` at the first truncation.

**Focus**

- A transition is an immutable record. Overwriting a stored next-state (for example with a reset observation) rewrites history, and every reuse of that row learns from a fabricated pair.
- Termination cuts bootstrapping through $`(1 - d) = 0`$. Truncation keeps it. Storing both the same way undervalues every state near a time limit.
- Capacity sets the age distribution, not just memory. Too small loses diversity; too large preserves data from long-obsolete policies that drags current values.
- CleanRL `dqn.py` expects same-step info keys, so on Gymnasium 1.x it logs no episode returns and crashes at truncation. Pin `gymnasium==0.29.1` or patch those lines.

**Reproduce:** On Gymnasium 1.4.0, wrap `CartPole-v1` with `max_episode_steps=5` in a one-environment `SyncVectorEnv` (default next-step autoreset) and reset with `seed=0`. Show steps 0 to 4 returning reward 1.0 with truncation at step 4, and the next step returning reward 0.0 with both flags false. State which of the six outputs is storable: only the first five. A single unvectorized environment never autoresets, so the handshake appears only in the vector env.

**Traps**

- Treating the autoreset output as a transition. Reward 0 with cleared flags is the reset handshake, not experience.
- Quoting capacity without interaction rate. A million stored transitions from a random early policy is mostly drift, not diversity.
- Assuming more replay is always more stable. Stale data from a far worse policy can anchor values away from the current policy's truth.

**Practice**

- The section mini-project covers this: replay corruption and stale-data defects with fixed-batch oracles that expose fabricated transitions.

**Stop when:** You can name the producing policy, episode and environment version for any buffer row, and your autoreset probe drops the fake transition.

<details>
<summary>Self-test</summary>

1. The vector env returns reward 0.0 with both flags false right after an episode ended. Store it?
   - No. That is the next-step autoreset output: a fresh observation with a dummy reward, not a transition the policy experienced.
2. A stored transition's next-state is later overwritten with the reset observation. What breaks?
   - Its TD target bootstraps from an unrelated state. Every sample reusing that row learns from a fabricated pair.
3. The buffer holds a million transitions but the policy improved sharply 50k steps ago. Concern?
   - Most samples come from the old policy. Gradients optimize a stale distribution and can slow or drag the new policy's values.
4. CleanRL `dqn.py` prints `SPS` but no episodic returns on your install. First check?
   - The Gymnasium version. On 1.x the `final_info` branch never fires, so confirm the version before touching the algorithm.

</details>

#### U6. Hard and Polyak target updates, target lag, replay ratio and update-to-data ratio

**About 4 h** · **Target:** Explain + Measure

Topics: Target networks and hard update intervals; Polyak target updates; Target lag, replay ratio and update-to-data ratio

The target network sets how fast the label may move. Too fresh chases its tail, too stale teaches yesterday's values, and too many updates per sample overfits the buffer.

**You can now**

- Explain hard copies versus Polyak averaging and compute one Polyak step by hand.
- Define target lag, replay ratio and update-to-data ratio, and predict what raising each does.
- Measure stability across target frequencies on CartPole with matched step budgets.

**Study**

1. [Target networks: why labels must move slowly](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-8.pdf) (Berkeley CS 185/285 Deep Reinforcement Learning (Spring 2026) - Value-Based RL and Q-Learning in Practice) - Lecture 8 (Q-Learning in Practice), Part 1, slides 2 to 8: the moving-target problem, no gradient through the target, hard copies every 10,000 steps, and the Polyak-averaging alternative.
2. [The three-process view and the update-to-data ratio](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-8.pdf) (Berkeley CS 185/285 Deep Reinforcement Learning (Spring 2026) - Value-Based RL and Q-Learning in Practice) - Lecture 8, Part 2, slides 9 to 13: data collection, target updates and regression as three processes, the update-to-data ratio (written "update-to-date" on slide 12), and the overfitting warning for too-high values.
3. [One concrete operating point](https://docs.cleanrl.dev/rl-algorithms/dqn/) (CleanRL DQN) - The `dqn.py` experiment command (target network frequency 500) and the implementation note that target updates are Polyak updates with a default tau of 1.0, which is a full hard copy (page read 2026-10-14). The same defaults (`target_network_frequency = 500`, `tau = 1.0`) sit at lines 57 and 59 of `dqn.py`.
4. [Freezing targets as the DQN fix](https://cs224r.stanford.edu/slides/06_cs224r_qlearning_2026.pdf) (Stanford CS224R Spring 2026 - Q-Learning and Off-Policy Methods) - Lecture 06 (Q-learning), slides 16 and 17: the lecture plan and freezing target parameters with periodic updates (the DQN algorithm).

**Focus**

- A hard copy sets $`\theta^{-} \leftarrow \theta`$ every $`N`$ steps and holds labels fixed between copies. Polyak sets $`\theta^{-} \leftarrow \tau\theta + (1 - \tau)\theta^{-}`$ every update. With $`\tau = 1.0`$ the Polyak form is a hard copy.
- The lecture's 10,000-step period and CleanRL's 500-step default are different operating points, not conflicting truths. The right lag depends on update frequency and task speed.
- Replay ratio (update-to-data ratio) is gradient updates per environment step. Raising it learns faster per sample but costs compute and can overfit buffer noise.
- Fitted Q-iteration is the extreme of many updates per collection round; online Q-learning is the other. DQN sits between them.

**Reproduce:** Closed-book, compute one Polyak step with $`\tau = 0.005`$, $`\theta = 2.0`$ and $`\theta^{-} = 1.0`$: show 1.005. Then state what $`\tau = 1.0`$ does to the same formula.

**Traps**

- Reading small $`\tau`$ as slow learning. It means slow label movement; per-sample learning can still be fast through the update ratio.
- Copying targets every step for freshness. That deletes the stabilization the target network exists for.
- Comparing two update ratios by episode count. Episodes hide the compute and data difference; match environment steps and report wall time.

**Practice**

- [Berkeley CS285 Homework 3: DQN on CartPole](https://github.com/berkeleydeeprlcourse/homework_spring2026/tree/59e40fc035374fd9b29195a4c3bef02690b515b5/hw3) - The blocks marked Section 2.4 in `hw3/src/agents/dqn_agent.py` with `hw3/experiments/dqn/cartpole.yaml` (CartPole-v1, `target_update_period: 1000`, 100k steps). Sweep the target period at matched step budgets. Run it in the homework's own `uv sync` environment (Python 3.10, `gym==0.25.2`, `numpy<2.0.0`) or port it to Gymnasium. Keep the sweep curves. The section mini-project reuses target-lag evidence with the same matched-budget discipline.

**Stop when:** You predict the direction of a lag change and an update-ratio change before running, and a matched-step CartPole sweep confirms both.

<details>
<summary>Self-test</summary>

1. CleanRL sets `tau=1.0` yet calls it a Polyak update. Contradiction?
   - No. The update has Polyak form, and with $`\tau = 1.0`$ it copies fully, which equals a hard update every `target_network_frequency` steps.
2. You raise the update ratio from 1 to 8 with episodes matched and declare victory. What is wrong?
   - Environment steps and compute differ eightfold. Match the interaction budget and report wall time before claiming efficiency.
3. Values look stale with targets copied every 10,000 steps. First knob?
   - Shorten the target period while watching TD-error variance. Fresher labels track faster but move more.
4. Why does the lecture warn that too high an update ratio overfits?
   - Repeated updates on the same buffer rows fit sampling noise and a stale distribution instead of the task.

</details>

#### U7. DQN targets, action gathering, gradient detachment and fixed-batch tests

**About 4 h** · **Target:** Derive + Implement

Topics: DQN targets, action gathering and gradient detachment; Fixed-batch differential tests for DQN updates

Three one-line bugs (online net in the target, a missing terminal mask, a wrong gather index) each train something, just not DQN. Frozen-batch tests catch all three in seconds on CPU.

**You can now**

- Derive the masked DQN target and implement gathering plus no-gradient target computation.
- Explain what detaching the target removes from the computation graph.
- Write fixed-batch differential tests that catch online-target swaps, missing masks and wrong gathers.

**Study**

1. [The update method line by line](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter07_dqn/dqn-components#define-the-loss-function-and-parameter-update) (Hands-on Modern RL - From Q-Learning to DQN) - The `update` method: `gather` for the taken action, `torch.no_grad()` around the masked target, mean squared error, and `clip_grad_norm_` with `max_norm=10` (page read 2026-10-14).
2. [The mask authority](https://gymnasium.farama.org/tutorials/gymnasium_basics/handling_time_limits/) (Gymnasium - Time Limits and Vector Autoreset) - Importance in learning code and Solution (page read 2026-10-14): bootstrap on truncation, cut on termination, with target `vf_target = rew + gamma * (1 - terminated) * vf_next_state`.
3. [The single-file update to test against](https://github.com/vwxyzjn/cleanrl/blob/fe8d8a03c41a7ef5b523e2e354bd01c363e786bb/cleanrl/dqn.py) (CleanRL DQN) - The ALGO LOGIC block at commit fe8d8a0 (lines 197 to 218): `with torch.no_grad()` target with `.max(dim=1)`, `.gather(1, ...)` prediction, mean squared error, and the Polyak-form target copy.

**Focus**

- The mask multiplies by $`(1 - d)`$ with $`d`$ as terminated only. Truncation keeps the bootstrap; the tutorial's Solution section is explicit.
- Detachment makes targets constants: gradients flow only through $`Q(s, a; \theta)`$. Without it, backpropagation also pulls the label.
- `gather` on stored actions selects visited pairs; `max` over next-state values selects the bootstrap action. Swapping them trains the wrong pairing.
- Frozen batches with frozen nets give bit-reproducible targets. Any mismatch after a code change is a bug, not noise.

**Reproduce:** Closed-book, compute the two-transition hand targets from the replay unit (3.97 and -1.0, mean squared error 3.06545) and write the frozen-batch assertion your update must satisfy to four decimals.

**Traps**

- Masking with terminated-or-truncated. Time-limit states lose their bootstrap and their values collapse near the cutoff.
- Detaching the prediction instead of the target. No gradient then reaches $`Q(s, a; \theta)`$, so the online net never learns from the loss. The target expression is the constant and the prediction is the only gradient path.
- Testing with live sampling. Randomness hides systematic target bugs; freeze the batch first, then test.

**Practice**

- The section mini-project covers this: fixed-batch DQN target tests with injected online-target, detach, action-gather and replay defects.

**Stop when:** Your frozen-batch test fails on each of the three injected bugs and passes on the clean update, all on CPU.

<details>
<summary>Self-test</summary>

1. Your mask uses terminated-or-truncated. Which states lose value and why?
   - States near the time limit. Their targets drop the bootstrap term, so values ignore everything past the cutoff although the task continues.
2. Loss falls on live samples but the policy stays random. What is the next test?
   - Freeze one batch with hand targets. A falling live loss can come from shrinking target scale while the policy stays poor.
3. What exactly changes when `torch.no_grad()` is removed from the target?
   - The target joins the computation graph. With a separate target net whose parameters are outside the optimizer, `backward` only fills unused gradients on those parameters, wasting memory and compute. If the target is computed with the online net, as in a no-copy implementation, `backward` also moves the label toward the prediction and the update chases its own label.
4. The gather uses `argmax` over current Q instead of stored actions. What does the loss train?
   - Values of greedy actions rather than visited pairs. Off-policy data is misread as on-policy greedy data.

</details>

#### U8. Reward clipping, observation scaling and Q, TD-error and gradient diagnostics

**About 4 h** · **Target:** Measure

Topics: Reward clipping, observation scaling and optimization effects; Q scale, target scale, TD-error and gradient diagnostics

Scale decides what the optimizer sees. Clipped rewards stabilize gradients but blind the agent to magnitudes, and unscaled inputs slow or break learning.

**You can now**

- Explain what reward clipping changes about the optimal policy and the optimizer.
- Read Q scale, TD-error spread and gradient norms as run-health signals.
- Diagnose a run from curves alone: stale, overestimating or clipped-blind.

**Study**

1. [Reward clipping and the evaluation protocol](https://arxiv.org/abs/1312.5602) (Playing Atari with Deep Reinforcement Learning) - Section 5 in arXiv:1312.5602v1 (training-only clipping of positive rewards to +1 and negative rewards to -1, with the stated cost that the agent cannot tell magnitudes apart) and Section 5.1 (noisy episode return versus smooth average predicted Q on a fixed random-policy state set).
2. [Practical stabilization tips](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-8.pdf) (Berkeley CS 185/285 Deep Reinforcement Learning (Spring 2026) - Value-Based RL and Q-Learning in Practice) - Lecture 8, slides 21 and 22: test on easy tasks first, large replay buffers, $`\epsilon`$ schedules, gradient clipping or Huber loss, Double Q-learning, and multiple seeds.
3. [Loss, clipping and evaluation in code](https://github.com/walkinglabs/hands-on-modern-rl/blob/9231bab/code/chapter04_dqn/dqn_cartpole.py) (Hands-on Modern RL - From Q-Learning to DQN) - The `update` loss lines (mean squared error with `clip_grad_norm_` at `max_norm=10`) and the greedy evaluation with `epsilon=0.0`. Note the file stores terminated only, which is the correct mask.

**Focus**

- Clipping maps every positive reward to +1, so one learning rate works across games. The price is explicit in the paper: magnitudes above 1 become indistinguishable.
- The paper's remedy for noisy evaluation is a fixed state set from a random policy with average predicted max-Q. Return is noisy because small weight changes swing which states the policy visits, so smooth Q with noisy return means the values are improving while behavior still shifts.
- Early runs can look random for a while. Impatient restarts destroy the multi-seed evidence the comparison needs.
- CartPole needs no clipping or scaling. The diagnostic habit (Q mean, TD loss, gradient norm) transfers to tasks that do.

**Reproduce:** Closed-book, map the rewards 5.0, -0.2 and 0.0 through the paper's training clip, and state which two signals the fixed-state average-Q plot separates. Answers: 1, -1 and 0; it separates value-estimate progress from behavior and visitation noise.

**Traps**

- Calling clipping a pure rescale. It requantizes: a bonus of 10 and a bonus of 1000 train identically, which can change the optimal policy.
- Reading raw episode return as the learning signal during heavy exploration. The policy visits new states as it learns, so return confounds behavior with values.
- Copying Atari preprocessing onto CartPole and expecting paper curves. Scale choices are task-specific, not portable defaults.

**Practice**

- [Hands-on Modern RL: CartPole DQN diagnostics run](https://github.com/walkinglabs/hands-on-modern-rl/blob/9231bab/code/chapter04_dqn/dqn_cartpole.py) - Extend the file's training loop to log Q-value mean, TD loss and gradient norm each update, and plot episode return against average predicted Q on a fixed state set. Keep both curves. The section mini-project reuses them as stability evidence alongside the fixed-batch tests.

**Stop when:** Your run reports the clipping policy, fixed-set average Q and episode return side by side, and you can name which curve moved first and why.

<details>
<summary>Self-test</summary>

1. A game pays 10 or 1000 for two bonuses. What does the clipped agent learn to prefer?
   - Neither systematically. Both train as +1, so the agent cannot learn the magnitude difference. That is the stated cost of clipping.
2. Average Q rises smoothly while episode return thrashes. Verdict?
   - Keep training. Values improve on the fixed set while small weight changes still swing which states the policy visits. The paper's Section 5.1 names exactly this split.
3. Gradients explode after removing gradient clipping. What do you check before restoring it?
   - Target and reward scale first. A huge TD error from a wrong mask or unclipped magnitudes is the cause; clipping would only hide it.
4. Two identical-code CartPole runs differ by 200 return. Next step?
   - Run more seeds before changing code. Runs are very inconsistent between seeds, so one pair proves nothing.

</details>

#### U9. Maximization bias, double estimators and dueling networks

**About 4 h** · **Target:** Derive + Implement

Topics: Maximization bias and double estimators; Dueling networks

The max operator prefers noise. Double estimation removes the preference without new data, and dueling separates state goodness from action choice.

**You can now**

- Derive the double-estimator split and show the bias it removes on a noisy example.
- Implement double DQN as a two-line target change evaluated on identical samples.
- Write the dueling aggregation and explain what the mean subtraction identifies.

**Study**

1. [Overestimation and the double target](https://arxiv.org/abs/1509.06461) (Deep Reinforcement Learning with Double Q-Learning) - Overoptimism due to estimation errors (Theorem 1 and Figure 1: errors of any source push the max upward, and in practice more actions mean more overestimation) and the $`Y_t^{\text{DoubleDQN}}`$ target in the Double DQN section of arXiv:1509.06461v3, whose sections are unnumbered: select with online weights, evaluate with target weights. Read the Atari table as the paper's reported numbers.
2. [Overestimation plots and double Q in lecture form](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-8.pdf) (Berkeley CS 185/285 Deep Reinforcement Learning (Spring 2026) - Value-Based RL and Q-Learning in Practice) - Lecture 8, Part 3, slides 14 to 20: Q-accuracy plots, overestimation, Double Q-learning in practice, and generalized double Q-learning.
3. [Dueling aggregation and identifiability](https://arxiv.org/abs/1511.06581) (Dueling Network Architectures for Deep Reinforcement Learning) - Section 3 in arXiv:1511.06581v3, Equations 7 to 9: the unidentifiable naive sum, the max-subtracted form, and the mean-subtracted form used in practice. Section 4.1 (corridor policy evaluation) shows where the structure helps.
4. [Both improvements in code](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter07_dqn/dqn-family#double-dqn) (Hands-on Modern RL - From Q-Learning to DQN) - Double DQN (the selection versus evaluation split with its PyTorch snippet) and Dueling DQN (value and advantage streams with mean recombination) (page read 2026-10-14).

**Focus**

- The max over noisy estimates is biased upward: $`\mathbb{E}[\max_a \hat{Q}] \ge \max_a \mathbb{E}[\hat{Q}]`$. Double DQN selects with online weights and evaluates with target weights.
- The code change is two lines (`argmax` on one net, `gather` on the other). Compare against vanilla on identical samples and budgets, or the comparison is void.
- The naive sum $`Q = V + A`$ is unidentifiable: a constant shift cancels. Max-subtraction pins the best action's advantage at zero; the mean form used in practice stabilizes by moving only with the mean.
- Dueling helps where state value dominates action differences. It does not fix overestimation; that is the double split's job.

**Reproduce:** Closed-book, compute the double target for online next-values $`[1.0, 2.5, 2.0]`$, target next-values $`[0.0, 1.0, 5.0]`$, $`r = 0`$, $`\gamma = 0.99`$ and no termination: show 0.99 against a vanilla 4.95. Then show two independent uniform noise draws over $`[-0.5, 0.5]`$ give $`\mathbb{E}[\max] = 1/6 \approx 0.17`$ above the true zero.

**Traps**

- Writing the reverse split, selecting with the target net and evaluating with the online net. It is still decoupled, but the label now depends on the weights being trained, so it must be detached and it moves every step. The paper evaluates on the frozen net.
- Reading the dueling value stream as the state value under naive-sum semantics. Only the max form makes $`V`$ estimate the best action's value; the mean form is off by a constant.
- Crediting double for a win on different samples, seeds or tuning. The paper's same-protocol discipline is load-bearing.

**Practice**

- [Deep-ML 477: Double Q-Learning Algorithm](https://www.deep-ml.com/problems/477) - Implement `double_q_learning`. The tests check alternating-table updates: the first experience moves `Q1` and the second moves `Q2`. Then compare double against your vanilla DQN on identical samples. The section mini-project keeps the overestimation evidence.
- [Berkeley CS285 Homework 3: LunarLander with Double DQN](https://github.com/berkeleydeeprlcourse/homework_spring2026/tree/59e40fc035374fd9b29195a4c3bef02690b515b5/hw3) - The double-Q block marked Section 2.5 in `hw3/src/agents/dqn_agent.py` with `hw3/experiments/dqn/lunarlander.yaml` (LunarLander-v2, `use_double_q: true`, 500k steps). Start from the CartPole config first, since LunarLander takes much longer on your GPU or CPU. The homework environment needs the `swig` system package for `gym[box2d]`; ported to Gymnasium 1.x, the id becomes `LunarLander-v3` and needs the `box2d` extra

**Stop when:** Deep-ML 477 passes, your hand double target matches, and a double-versus-vanilla comparison on identical samples shows the bias gap.

<details>
<summary>Self-test</summary>

1. Online ranks action 2 best while the target values action 3 highest. Which number enters the double target?
   - The target net's value for action 2. Selection is online and evaluation is target; the highest target value is never touched.
2. Why does the bias grow with more actions?
   - More draws raise the expected maximum of the noise. The max has more chances to catch an upward error.
3. Add 5 to $`V`$ and subtract 5 from every $`A`$ under the naive sum. What changes?
   - Nothing in $`Q`$: the shift cancels, which is the unidentifiability. Under the mean form the same shift moves $`Q`$ by 5, so the decomposition is pinned.
4. Dueling speeds up LunarLander hovering but overestimation persists. Expected?
   - Yes. Dueling restructures credit between state and actions; it does not remove max bias. Add the double split for that.

</details>

#### U10. Checkpointing model, optimizer, replay and RNG, and separating evaluation exploration

**About 3 h** · **Target:** Implement

Topics: Checkpointing model, optimizer, replay and random state; Training and evaluation exploration separation

A checkpoint without replay or RNG state resumes a different experiment. Evaluation that still explores measures luck, not learning.

**You can now**

- List the full resume state: model, optimizer, replay, RNG streams and counters.
- Separate training exploration from evaluation and hold the evaluation protocol fixed.
- Interrupt and resume a run with identical continuation.

**Study**

1. [Training versus inference modes](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter07_dqn/dqn-components#learning-vs-inference-two-modes-of-the-same-network) (Hands-on Modern RL - From Q-Learning to DQN) - The Learning versus Inference comparison: exploratory collection with replay and target updates during training, pure greedy action with no updates during evaluation (page read 2026-10-14).
2. [What a model-only checkpoint omits](https://github.com/vwxyzjn/cleanrl/blob/fe8d8a03c41a7ef5b523e2e354bd01c363e786bb/cleanrl/dqn.py) (CleanRL DQN) - The save line at commit fe8d8a0 (line 223, `torch.save` of the Q-network state dict only). Fine for publishing a policy, but with no optimizer, replay or RNG state it cannot resume training identically.
3. [Seeding and deterministic evaluation](https://gymnasium.farama.org/api/env/#gymnasium.Env.reset) (Gymnasium - Env.reset and seeding) - The `Env.reset` entry and its `seed` parameter (page read 2026-10-14): an integer seed resets `np_random`, while `seed=None` on an existing generator continues it. Fix environment, policy, seed set and episode count for evaluation; keep training-time randomness out.

**Focus**

- Resume state means parameters, optimizer state, replay contents and cursor, every RNG stream, and the step and exploration-schedule positions. Missing one piece continues a different trajectory.
- Both reference scripts persist the model only. That publishes a policy but does not resume an experiment.
- Evaluation fixes the policy to greedy, the seed set, the episode count and the environment version. Training $`\epsilon`$ and wrapper changes must not leak in.
- The checkpoint must record the same identity fields the trajectory schema demands: environment, policy, seed and code versions.

**Reproduce:** Write the checkpoint dictionary keys for a CartPole DQN (parameters, optimizer, replay contents and cursor, Python, NumPy and Torch RNG states, global step, $`\epsilon`$ position), interrupt a run at an episode boundary (or also save the environment state), and show the resumed loss trajectory matches the uninterrupted one.

**Traps**

- Equating a saved model with reproducibility. Weights without optimizer, replay and RNG state restart the trajectory elsewhere.
- Evaluating with training $`\epsilon`$ for fairness. Shared noise still inflates variance and can flip close rankings; report greedy scores and training curves separately.
- Re-seeding evaluation environments per checkpoint. Sampling differences then masquerade as policy differences.

**Practice**

- The section mini-project covers this: checkpoint and resume with interruption equivalence, plus stale-target and evaluation-leakage defects.

**Stop when:** An interrupted and resumed run continues the identical loss trajectory, and every reported score comes from the fixed greedy protocol.

<details>
<summary>Self-test</summary>

1. A resumed run from a model-only checkpoint diverges from the original curve. Bug?
   - Not necessarily. Optimizer momentum, replay contents and RNG streams restarted fresh, so the trajectory differs by construction. Persist full state or record the difference.
2. Evaluation uses $`\epsilon = 0.05`$ like training. What is the cost?
   - Random actions contaminate the score. Small-sample comparisons then measure exploration luck instead of policy quality.
3. Which RNG streams must a CPU CartPole checkpoint capture?
   - Python `random`, NumPy and Torch generators, plus the environment's `np_random` and the action space's own generator: action sampling, buffer sampling, initialization and environment stochasticity each draw from one.
4. The environment version bumps mid-project. Keep the old checkpoints?
   - Keep them but re-evaluate under the new version with fixed seeds. Never mix returns across versions in one curve.

</details>

### Mini-project: Stable neural value learning with frozen targets

**About 10 to 14 hours.** Build the `policylab` deep value laboratory: a CartPole DQN baseline with replay and frozen targets, fixed-batch defect tests, overestimation evidence and full checkpoint resume. The run keeps raw curves and failures so later policy work inherits honest diagnostics.

1. Reproduce off-policy semi-gradient divergence from the book start across a seed set beside its bounded solid-action on-policy twin, and pass Deep-ML 530 and Deep-ML 557 on CPU.
2. Extend the Hands-on Modern RL CartPole DQN in `deep/` with explicit replay and target state, pass Deep-ML 537, and separate exploratory training from greedy evaluation on held-out seeds.
3. Write frozen-batch DQN target tests that catch an online-target swap, a missing detach, a wrong gather and a replay corruption each, plus a vector autoreset probe that drops the reset handshake instead of storing it.
4. Sweep target lag under matched step budgets following Berkeley CS285 Homework 3, compare double against vanilla targets on identical samples passing Deep-ML 477, and keep Q scale, TD-error spread and gradient norm curves.
5. Checkpoint parameters, optimizer, replay contents and every RNG stream at an episode boundary, prove interruption equivalence against an uninterrupted run, and catch stale-target and evaluation-leakage defects.
6. Train CartPole across several seeds at a stated interaction budget on CPU, regenerate every chart from per-seed raw records including failures, and report stability with uncertainty rather than a best score.

**Deliverables**

- The `deep/` DQN laboratory with replay, frozen targets and full checkpoints.
- Tests: frozen-batch target defects, replay corruption, autoreset handling and resume equivalence.
- Lag sweep, double estimator comparison and diagnostics with multi-seed raw records and retained failures.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [Deep-ML 530: Linear Value Function Approximation with Semi-Gradient TD](https://www.deep-ml.com/problems/530). Pass after the hand computation; the tests check exact weight vectors.
- external-tests: [Deep-ML 557: Baird Counterexample Off-Policy TD Divergence](https://www.deep-ml.com/problems/557). Implement the counterexample step; keep your own diverging script too.
- external-tests: [Deep-ML 537: Experience Replay Implementation](https://www.deep-ml.com/problems/537). Check size tracking and circular overwrite before wiring the buffer.
- external-tests: [Deep-ML 477: Double Q-Learning Algorithm](https://www.deep-ml.com/problems/477). Pass the alternating-table updates; then compare against vanilla DQN.
- external-tests: [Berkeley CS285 Homework 3 DQN](https://github.com/berkeleydeeprlcourse/homework_spring2026/tree/59e40fc035374fd9b29195a4c3bef02690b515b5/hw3). Sweep target lag at matched budgets; port or run in its own environment.
- external-tests: [Hands-on Modern RL CartPole DQN script](https://github.com/walkinglabs/hands-on-modern-rl/blob/9231bab/code/chapter04_dqn/dqn_cartpole.py). Extend the training loop; keep greedy evaluation separate from exploration.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Divergence honesty | Baird diverges on every seed while the solid-action twin stays bounded, and twins differ only in distribution. | A slowed step size is shown to delay rather than remove the blowup. |
| Target correctness | Frozen-batch tests fail on each injected target, detach, gather and replay defect. | A live-sample loss drop is exposed as scale shrinkage by the frozen batch. |
| Resume equivalence | Interrupted resume continues the identical loss trajectory with full state restored. | Dropping each checkpoint piece in turn shows which resume check then fails. |
| Stability evidence | Lag sweep and double comparison use matched budgets with all seeds and failures retained. | A losing configuration is kept and explains the operating point choice. |

Feeds into: Tested DQN machinery, replay discipline and checkpointing feed actor-critic, PPO, offline, model-based and capstone deep-RL evidence.

### Resource route

- **Primary - Course:** [Berkeley CS 185/285 Deep Reinforcement Learning (Spring 2026) - Value-Based RL and Q-Learning in Practice](https://rail.eecs.berkeley.edu/deeprlcourse/) - Slides are public at https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-N.pdf; current videos are not, and the public Fall 2023 playlist numbers lectures differently. Study Lecture 7 (value-based RL) and Lecture 8 (Q-learning in practice: replay, target networks, double Q-learning). Work the DQN part of Homework 3 (`src/agents/dqn_agent.py`, CartPole then LunarLander with double DQN) on CPU or one small GPU; the Atari run is optional. The homework pins `gym==0.25.2`, which fails on NumPy 2, so port it to Gymnasium (`terminated` and `truncated`) or pin `numpy<2` in its own environment, and turn off its forced WandB logging. 
- **Required - Book:** [Reinforcement Learning: An Introduction (2nd ed.) - Chapters 9 and 11](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) - The authors post the full second edition free at incompleteideas.net; cite the printed page numbers. Study Sections 9.1 to 9.4 (value error, semi-gradient TD, linear methods) and Sections 11.1 to 11.3 and 11.6 (off-policy divergence, the deadly triad, why the Bellman error is not learnable). Reproduce Baird's counterexample (Section 11.2, Figure 11.1) and show the weights diverge under off-policy semi-gradient TD.
- **Support - Course:** [Stanford CS224R Spring 2026 - Q-Learning and Off-Policy Methods](https://cs224r.stanford.edu/) - Use Lecture 06 (Q-learning) and the TA Q-learning tutorial (`material/CS224R_Tutotial_Max.pdf`) as a second derivation of fitted Q-iteration, targets and overestimation. Its homeworks run on cloud GPUs; follow the Stanford honor code for course materials.
- **Required - Paper:** [Playing Atari with Deep Reinforcement Learning](https://arxiv.org/abs/1312.5602) - Read the algorithm, replay and target-network design plus experimental protocol. Reproduce DQN on a small discrete environment, then ablate replay and target networks rather than attempting an Atari score reproduction.
- **Required - Paper:** [Deep Reinforcement Learning with Double Q-Learning](https://arxiv.org/abs/1509.06461) - Derive the action-selection and action-evaluation split, construct a noisy maximization example and compare DQN with Double DQN using identical samples and tuning budgets.
- **Support - Paper:** [Dueling Network Architectures for Deep Reinforcement Learning](https://arxiv.org/abs/1511.06581) - Read the dueling architecture and its aggregation equations (the mean-subtracted form). Implement it as an optional head and test that the value and advantage streams are identifiable only up to the stated constraint.
- **Support - Implementation:** [CleanRL DQN](https://docs.cleanrl.dev/rl-algorithms/dqn/) - Read the single-file DQN implementation and documented benchmark details after the blank-file update passes. Trace replay, target, seeding, termination and evaluation semantics. The script expects the `final_info` and `final_observation` keys of older Gymnasium releases; on Gymnasium 1.x (next-step autoreset) it logs no episode returns and raises `KeyError` at truncation, so run it in an environment with `gymnasium==0.29.1` or patch those lines and say so.
- **Support - Tutorial:** [Hands-on Modern RL - From Q-Learning to DQN](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter07_dqn/dqn-components) - Use Sections 5.1 to 5.4, with the masked target $`r + \gamma (1 - d) \max_{a'} Q(s', a')`$ on the components page (the formula on the first page omits the terminal mask). `code/chapter04_dqn/dqn_cartpole.py` trains CartPole on CPU in about two minutes. Treat score claims as hypotheses requiring local seed and version evidence. Pin commit 9231bab of walkinglabs/hands-on-modern-rl; its `code/chapterNN` folders do not follow the site chapter numbers.
- **Support - Practice:** [Deep-ML - Function Approximation and DQN Problems](https://www.deep-ml.com/problems/557) - Use named problems as closed-book checks after your own implementation passes: 530 (semi-gradient TD(0)), 556 (deadly-triad instability), 557 (Baird's counterexample), 537 (experience replay) and 477 (double Q-learning). Read each problem's tests before trusting its statement.
- **Required - Project:** [Reinforcement Learning Control Laboratory - Deep Value Core](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/reinforcement-learning-control-laboratory.md) - Implement DQN and Double DQN with replay and target state, fixed-batch target tests, checkpoint and resume, overestimation evidence and injected online-target, detach, action-gather and replay defects.
- **Reference - Reference:** [Gymnasium - Time Limits and Vector Autoreset](https://gymnasium.farama.org/tutorials/gymnasium_basics/handling_time_limits/) - Read Termination, Truncation, Importance in learning code and Solution in the time-limits tutorial, plus the vector autoreset note at https://farama.org/Vector-Autoreset-Mode. Next-step autoreset is the default for Gymnasium 1.x vector environments; on Gymnasium 1.4.0 the step after an episode ends returns reward 0 with both flags false and is not a transition.
- **Reference - Reference:** [Gymnasium - Env.reset and seeding](https://gymnasium.farama.org/api/env/#gymnasium.Env.reset) - Read the `Env.reset` entry for the seeding contract: an integer seed resets the environment PRNG `np_random`, and a later `reset` with `seed=None` continues it, so seed once right after creation.

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
- [ ] $`\gamma`$ and $`\lambda`$ bias-variance behavior _(Required)_
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

### Study units

#### U1. Trajectory objectives and the likelihood-ratio identity

**About 4 h** · **Target:** Derive

Topics: Trajectory objectives and expected return; Likelihood-ratio and score-function identities

The environment need not be differentiable to optimize a stochastic policy. This identity supplies the gradient used by REINFORCE and later language-policy updates.

**You can now**

- Factor a trajectory likelihood and identify which factors depend on policy parameters.
- Derive the score-function estimator from expected return, with its support and differentiation assumptions.
- Check the estimator against an exactly enumerated policy objective.

**Study**

1. [CS 185/285 Lecture 5: Policy Gradients](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-5.pdf) (Berkeley CS 185/285 Deep Reinforcement Learning (Spring 2026) - Policy Gradients, Actor-Critic and Advanced Policy Gradients) - Slides 3 to 7: objective, trajectory factorization, direct differentiation and the sampled gradient.
2. [Part 3: Intro to Policy Optimization](https://spinningup.openai.com/en/latest/spinningup/rl_intro3.html#deriving-the-simplest-policy-gradient) (Spinning Up - Intro to Policy Optimization and PPO) - Deriving the Simplest Policy Gradient, facts 1 to 5 and Derivation for Basic Policy Gradient. Depth: Stop before Implementing the Simplest Policy Gradient.

**Focus**

- Use the trajectory contract from Trajectories, episodes, horizons, discounting, termination and truncation. Include the initial-state law, each policy factor and each transition factor.
- For a fixed environment and parameter-independent reward, only policy factors contribute to the trajectory score. Differentiability, fixed support and a valid interchange of derivative and expectation are assumptions, not consequences of sampling.
- The score has mean zero: $`\mathbb{E}_{\tau\sim p_\theta}[\nabla_\theta\log p_\theta(\tau)]=0`$. Multiplying it by return creates the learning signal.

**Reproduce:** Closed-book, derive $`\nabla_\theta J=\mathbb{E}[R(\tau)\sum_t\nabla_\theta\log\pi_\theta(a_t\mid s_t)]`$. Check a one-step Bernoulli policy with $`p=\operatorname{sigmoid}(\theta)=1/4`$, reward 2 for action 1 and -1 for action 0: $`J=3p-1=-1/4`$ and $`dJ/d\theta=3p(1-p)=9/16`$. Enumerate both actions and recover the same gradient from their scores.

**Traps**

- Differentiating a sampled reward as if the sampled action were a differentiable path through the environment. The score-function estimator differentiates the sampling law instead.
- Dropping a reward or transition derivative when those functions actually share policy parameters. The displayed estimator assumes they do not.
- Summing action probabilities rather than log probabilities along a trajectory. Independent conditional factors multiply; their logs add.

**Practice**

- The section mini-project covers this: the policylab exact-enumeration policy-gradient oracle.

**Stop when:** You derive the trajectory score without notes and match the one-step gradient by direct differentiation and exact enumeration.

<details>
<summary>Self-test</summary>

1. Why can an unknown transition model disappear from the score?
   - Its log derivative is zero when the transition law has no policy parameters. Its effect remains in the sampled state distribution and rewards.
2. What changes if the return explicitly depends on policy parameters?
   - Add $`\mathbb{E}[\nabla_\theta R_\theta(\tau)]`$ to the likelihood-ratio term, under the same differentiation assumptions.
3. Does an action-dependent reward require a differentiable reward function?
   - No. Dependence on a sampled action is already handled by the trajectory likelihood. Explicit dependence on policy parameters is a separate issue.

</details>

#### U2. The policy-gradient theorem and REINFORCE

**About 4 h** · **Target:** Derive + Implement

Topics: Policy-gradient theorem at working depth; REINFORCE and Monte Carlo policy gradients

The theorem explains why sampled action scores suffice even though the policy changes future state visits. REINFORCE is the first complete implementation of that result.

**You can now**

- Derive the policy-gradient theorem using state visitation and conditional action values.
- Implement a REINFORCE update with explicit discounting, trajectory reduction and detached return weights.
- Match the expected update to exact enumeration and a finite difference.

**Study**

1. [CS 185/285 Lecture 5: Policy Gradients](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-5.pdf) (Berkeley CS 185/285 Deep Reinforcement Learning (Spring 2026) - Policy Gradients, Actor-Critic and Advanced Policy Gradients) - Slide 7, REINFORCE, and slides 20 to 23, automatic differentiation and practical implementation.
2. [Sutton and Barto: theorem and REINFORCE](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) (Reinforcement Learning: An Introduction (2nd ed.) - Chapter 13) - Chapter 13, Section 13.2, The Policy Gradient Theorem, and Section 13.3, REINFORCE: Monte Carlo Policy Gradient; printed pp. 324 to 329, including the proof box and REINFORCE algorithm box. Depth: The authors post the full text free on their Incomplete Ideas website. Use the section titles if your printing has different page labels. Leave the short-corridor training comparison for the baseline unit.

**Focus**

- Unroll the Bellman derivative into visitation-weighted action-value terms. The theorem avoids an explicit derivative of the state distribution; it does not assume that distribution is fixed.
- For $`J=\mathbb{E}[\sum_{t=0}^{T-1}\gamma^t r_{t+1}]`$, a trajectory-sum estimator uses $`\gamma^t G_t`$, where $`G_t=\sum_{k=t}^{T-1}\gamma^{k-t}r_{k+1}`$. Uniform timestep sampling without this outer factor is a different weighting convention.
- Use Stable softmax, cross-entropy and loss reductions rather than rebuilding softmax. Minimize the negative weighted log probability, hold return weights fixed, sum within episodes and average over episodes.

**Reproduce:** On CPU, enumerate the four trajectories of two independent Bernoulli actions with separate logits initially zero. Let the rewards be $`r_1=a_0`$, $`r_2=2a_1`$ and $`\gamma=1/2`$. Then $`J=p_0+p_1`$, so its logit gradient is $`(1/4,1/4)`$. Implement the negative episode-sum log-probability loss using detached reward-to-go and outer discount weights. Probability-weight its four gradients and get $`(-1/4,-1/4)`$; check the objective with centered differences in `float64`.

**Traps**

- Calling an arbitrary timestep mean the exact episodic gradient. Episode length and the reduction convention affect weighting.
- Applying the optimizer before recomputing the batch's action log probabilities, then describing that gradient as on-policy REINFORCE.
- Using the policy pseudo-loss as the return metric. Its value is not an estimate of expected return.

**Practice**

- The section mini-project covers this: policylab REINFORCE with an exact expected-gradient check and fresh-trajectory updates.

**Stop when:** Your enumerated loss gradients match the objective gradient with the sign reversed, and your derivation states the visitation, discount and reduction conventions.

<details>
<summary>Self-test</summary>

1. Does the theorem say state visitation is independent of the policy?
   - No. It reorganizes the full derivative into an expectation over policy-dependent visits.
2. Why is return treated as fixed when differentiating the sampled loss?
   - The score-function derivation already accounts for how the policy changes the trajectory law. Differentiating the weight would add a different term.
3. In the two-step example, what happens if the outer discount weight is omitted?
   - The expected ascent gradient for the second logit becomes $`1/2`$, not $`1/4`$. The first component remains $`1/4`$.

</details>

#### U3. Reward-to-go, baselines, unbiasedness and variance reduction

**About 4 h** · **Target:** Derive + Measure

Topics: Causality and reward-to-go; Constant and state-dependent baselines; Baseline unbiasedness and variance reduction

A noisy but unbiased gradient and a biased gradient need different repairs. Baselines offer a controlled way to change noise without changing the population target, when their assumptions hold.

**You can now**

- Prove the reward-to-go causality result and conditional baseline unbiasedness.
- Distinguish fixed, state-dependent and action-dependent baselines, including a baseline fitted on the same samples.
- Measure estimator variance against an exact small-problem expectation.

**Study**

1. [CS 185/285 Lecture 5: variance reduction](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-5.pdf) (Berkeley CS 185/285 Deep Reinforcement Learning (Spring 2026) - Policy Gradients, Actor-Critic and Advanced Policy Gradients) - Slides 16 to 18: gradient noise, Baselines and Causality. Depth: Slide 17's zero-mean proof applies to a baseline independent of the scored action. Its same-batch mean-return suggestion has finite-sample dependence; test that case separately.
2. [Causality and the expected score lemma](https://spinningup.openai.com/en/latest/spinningup/rl_intro3.html#expected-grad-log-prob-lemma) (Spinning Up - Intro to Policy Optimization and PPO) - Expected Grad-Log-Prob Lemma, Don't Let the Past Distract You, and Baselines in Policy Gradients. Depth: Skip the intervening implementation walkthrough; do not install the retired environment stack.
3. [Sutton and Barto: baseline comparison](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) (Reinforcement Learning: An Introduction (2nd ed.) - Chapter 13) - Chapter 13, Section 13.4, REINFORCE with Baseline, printed pp. 329 to 331; revisit Example 13.1, Short corridor with switched actions, on p. 323. Depth: The authors post the full text free on their Incomplete Ideas website. Read the comparison as evidence from the book's setup, not a guaranteed learning-speed improvement.

**Focus**

- Condition on the history before the action. Earlier rewards are fixed under this conditioning and multiply a zero-mean action score, so they can be removed.
- For a fixed baseline, $`\mathbb{E}[b(s)\nabla_\theta\log\pi_\theta(a\mid s)\mid s]=0`$. A state-only input does not ensure independence if fitting used that same action's return.
- Variance reduction is not automatic. For a scalar score $`z`$, the variance-minimizing constant baseline is $`\mathbb{E}[Rz^2]/\mathbb{E}[z^2]`$, when the denominator is positive. It need not equal mean return.

**Reproduce:** Reuse the one-step Bernoulli policy with $`p=1/4`$ and rewards 2 and -1. Enumerate $`g=(R-b)(a-p)`$. All fixed baselines have mean $`9/16`$. With $`b=0`$, variance is $`75/256`$; with the value baseline $`b=-1/4`$, it is $`27/64`$; with $`b=5/4`$, it is zero. Verify these population quantities on CPU by probability-weighting both actions, not by comparing unrelated Monte Carlo runs.

**Traps**

- Claiming every value baseline reduces variance. The exact example shows one that increases it.
- Subtracting each episode's own return as its baseline. That removes the entire learning signal, not just noise.
- Using `detach()` as an independence proof. It blocks an autograd path but does not remove statistical dependence on the sampled action.

**Practice**

- The section mini-project covers this: policylab baseline and reward-to-go comparisons with exact expectations, shared samples and the short-corridor baseline ablation.

**Stop when:** You prove causality and baseline unbiasedness, reproduce all three exact variances, and explain why same-batch centering needs a separate finite-sample check.

<details>
<summary>Self-test</summary>

1. May a baseline depend on the current state?
   - Yes, provided it is conditionally independent of the current action. The score has conditional mean zero at that state.
2. For independent one-step samples, what happens if every sample subtracts the batch mean return that includes itself?
   - With batch size $`N`$, the expected sample-mean estimator is $`(1-1/N)\nabla J`$. The self contribution creates bias; a leave-one-out mean avoids that dependence.
3. Why can past rewards be dropped even when past and future rewards are correlated?
   - Conditional on the pre-action history, each past reward is fixed and the current score has mean zero. Independence of past and future rewards is unnecessary.
4. What should a variance comparison hold fixed?
   - The policy, environment, objective, estimator reduction and sampled trajectories. Change only the weighting or baseline, and check expectation against an oracle.

</details>

#### U4. Learned value baselines, critic targets and actor-critic dependencies

**About 4 h** · **Target:** Derive + Implement

Topics: Learned value baselines and critic targets; Actor-critic data and update dependencies

A critic gives credit before an episode ends, but its errors can enter the actor's learning signal. The update order and the target's policy identity are part of the algorithm.

**You can now**

- Explain why a learned Monte Carlo baseline and a bootstrapped actor-critic have different bias sources.
- Derive one-step critic targets and actor weights with separate termination and trajectory-boundary semantics.
- Implement actor and critic updates with explicit target snapshots and gradient ownership.

**Study**

1. [CS 185/285 Lecture 6: Actor-Critic](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-6.pdf) (Berkeley CS 185/285 Deep Reinforcement Learning (Spring 2026) - Policy Gradients, Actor-Critic and Advanced Policy Gradients) - Slides 4 to 6, 8 to 12, 16 to 17 and 21 to 22: value fitting, bootstrap targets, batch and online actor-critic, critics versus baselines. Depth: Do not adopt the variance labels as universal guarantees. Stop before off-policy actor-critic; that belongs to the continuous-control section.
2. [Sutton and Barto: actor-critic distinction](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) (Reinforcement Learning: An Introduction (2nd ed.) - Chapter 13) - Chapter 13, Section 13.5, Actor-Critic Methods, printed pp. 331 to 332; the One-step Actor-Critic (episodic) box. Depth: The authors post the full text free on their Incomplete Ideas website. Skip the eligibility-trace algorithm box.
3. [Homework 2: baseline update dependencies](https://github.com/berkeleydeeprlcourse/homework_spring2026/blob/59e40fc/hw2/src/agents/pg_agent.py) (Berkeley CS 185/285 Deep Reinforcement Learning (Spring 2026) - Policy Gradients, Actor-Critic and Advanced Policy Gradients) - `PGAgent.update`, steps 1 to 4, and `_estimate_advantage`, the baseline branch. Depth: Read the starter as an update-order audit, not runnable completed code. Its Gym and WandB setup needs porting; implement the update in policylab instead.

**Focus**

- Use TD error, TD(0), bootstrapping and Monte Carlo versus TD bias and variance as the earlier result. The new question is how that target weights an action score.
- For a snapshot critic, $`y_t=r_{t+1}+\gamma(1-d_t)V_{\text{old}}(s_{t+1})`$ and $`\hat A_t=y_t-V_{\text{old}}(s_t)`$, where $`d_t`$ marks true termination. A truncation needs the final pre-reset observation's value.
- Freeze actor weights and critic regression targets for the specified update. Detach the actor's advantage and the bootstrap target; a shared encoder may still receive the separately declared value-loss gradient.
- A fixed imperfect baseline subtracted from full returns preserves the score expectation. An imperfect next-state value inside a return target can create action-dependent bias.

**Reproduce:** Closed-book, write one actor-critic update with separate actor and critic parameters. For reward 1, $`\gamma=0.9`$, current value 0.5 and next value 2, get target 2.8 and advantage 2.3. True termination gives target 1 and advantage 0.5; external truncation keeps 2.8 and 2.3 using the final observation. On CPU, backpropagate the actor loss and check that only actor parameters receive gradients; backpropagate the detached-target squared value loss separately.

**Traps**

- Refitting the critic and silently recomputing actor weights partway through the same update. That changes the declared estimator.
- Treating the baseline network as a critic merely because it is learned. Bootstrapping the action assessment is the relevant distinction here.
- Bootstrapping from a reset observation at truncation. That credits the old action with the next episode's value.

**Practice**

- The section mini-project covers this: policylab learned baselines and one-step actor-critic, with target, boundary and gradient-ownership tests.

**Stop when:** Your update matches all three boundary cases, target tensors receive no gradient, and you can draw the actor, critic and rollout dependency graph.

<details>
<summary>Self-test</summary>

1. Can a perfect value function make the one-step TD residual an unbiased advantage estimate?
   - Yes. Conditional on the state and action, the expected reward plus discounted next-state value equals the action value, so subtracting the state value yields advantage.
2. What bias can an imperfect next-state value introduce?
   - Its expected bootstrap error can depend on the current action through the transition law. It therefore need not vanish when multiplied by the action score.
3. Does detaching the advantage forbid a shared actor-critic encoder?
   - No. It prevents the policy-loss gradient from flowing through the advantage calculation. The encoder can still receive gradients through policy logits and the separate value loss.

</details>

#### U5. n-step advantages, Generalized Advantage Estimation and the $`\gamma`$-$`\lambda`$ trade-off

**About 5 h** · **Target:** Derive + Implement

Topics: One-step and n-step advantage estimates; Generalized Advantage Estimation; $`\gamma`$ and $`\lambda`$ bias-variance behavior

GAE controls how much future sampled reward enters the actor weight. Fixed trajectories expose its indexing and boundary bugs before any learning curve can hide them.

**You can now**

- Derive n-step advantages and GAE as a weighted sum of TD residuals.
- Implement the backward recursion with separate bootstrap and trace-continuation masks.
- Explain the discount and trace-decay endpoints relative to a stated policy-gradient objective.

**Study**

1. [CS 185/285 Lecture 6: longer-horizon advantages](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-6.pdf) (Berkeley CS 185/285 Deep Reinforcement Learning (Spring 2026) - Policy Gradients, Actor-Critic and Advanced Policy Gradients) - Slides 23 to 25: n-step returns, Generalized Advantage Estimation and the policy update.
2. [GAE paper: estimator derivation](https://arxiv.org/abs/1506.02438v6) (High-Dimensional Continuous Control Using Generalized Advantage Estimation) - arXiv:1506.02438v6, Section 2, Preliminaries, and Section 3, Advantage Function Estimation, pp. 2 to 5; Equations 14 to 18. Depth: Stop before Section 4. The paper starts from an undiscounted objective and introduces discounting as an approximation; do not silently identify its discounted gradient approximation with every discounted-objective convention.
3. [Homework 2: GAE starter contract](https://github.com/berkeleydeeprlcourse/homework_spring2026/blob/59e40fc/hw2/src/agents/pg_agent.py) (Berkeley CS 185/285 Deep Reinforcement Learning (Spring 2026) - Policy Gradients, Actor-Critic and Advanced Policy Gradients) - `_estimate_advantage`, the `gae_lambda` branch and reverse loop. Depth: The dummy final value and single `terminals` boundary marker are not enough for externally truncated rollouts. Carry final observations and two masks in your own implementation.

**Focus**

- Build on n-step returns, target boundaries and fixed-trajectory update oracles. Subtract the current value from each n-step return, then telescope the TD residual sum.
- Use $`\delta_t=r_{t+1}+\gamma(1-d_t)V(s_{t+1})-V(s_t)`$ and $`\hat A_t=\delta_t+\gamma\lambda c_t\hat A_{t+1}`$. The bootstrap mask excludes true termination; the continuation mask excludes any episode reset and the end of the available segment.
- At $`\lambda=0`$, use one TD residual. At $`\lambda=1`$, a complete terminal episode telescopes to discounted return minus baseline; a nonterminal segment still contains its final bootstrap value.
- Changing $`\gamma`$ changes the discounted value target, or biases an undiscounted-gradient approximation. Changing $`\lambda`$ changes estimator reliance on the critic, not the underlying discounted value function. Lower variance is a tendency, not a theorem for every trajectory law.

**Reproduce:** Closed-book, implement both an explicit TD-residual sum and a backward recursion on CPU. Use rewards $`(1,2,3)`$, values $`(0.5,1,1.5,0)`$, true termination after the third reward, $`\gamma=0.9`$ and $`\lambda=0.8`$. Residuals are $`(1.4,2.35,1.5)`$ and advantages are $`(3.8696,3.43,1.5)`$. With $`\lambda=0`$, recover the residuals; with $`\lambda=1`$, recover $`(4.73,3.7,1.5)`$. Require absolute agreement within $`10^{-10}`$ in `float64`, then add a truncated segment with a nonzero final value.

**Traps**

- Cutting both bootstrap and trace at truncation. Cut the trace across reset, but retain the final observation's bootstrap.
- Calling the finite-segment trace-decay endpoint pure Monte Carlo while it still bootstraps an estimated tail.
- Flattening time and environment axes before the recursion and letting one environment's residual enter another's advantage.

**Practice**

- The section mini-project covers this: policylab GAE endpoint, termination, truncation and vector-lane oracles, followed by a matched trace-decay ablation.

**Stop when:** Both GAE implementations match the fixed cases and a nonterminal cut, and changing a reward in one vector lane cannot change another lane's advantages.

<details>
<summary>Self-test</summary>

1. Why do the intermediate value terms cancel when trace decay is 1?
   - Each discounted next-state value cancels the following residual's discounted current-state value. The initial negative value and any final bootstrap remain.
2. Does a correct critic eliminate the usual bootstrapping bias for shorter traces?
   - For the stated discounted advantage target, yes in conditional expectation. Discounting relative to an undiscounted objective and finite-sample effects are separate issues.
3. Which mask applies when an episode ends because of an external time limit?
   - Keep the bootstrap from the true final observation, but set trace continuation to zero so the next reset episode contributes nothing.
4. At a nonterminal rollout cut, should the value of the next observation be zero?
   - No. Use its critic value for the last residual; only the unavailable future residual sum is cut.

</details>

#### U6. Categorical, Gaussian and tanh-squashed policies and entropy regularization

**About 5 h** · **Target:** Derive + Implement

Topics: Entropy regularization and exploration effects; Categorical and Gaussian action distributions; Tanh-squashed actions and log-probability correction

The action passed to the environment and the action whose density enters the update must have a declared relationship. A wrong density can leave training apparently functional while the gradient and PPO ratios are wrong.

**You can now**

- Implement categorical and diagonal Gaussian policy log probabilities with correct event reductions.
- Derive the tanh-squashed density and explain why clipping samples is not the same distribution.
- Add entropy regularization with the correct loss sign and distinguish base Gaussian from transformed entropy.

**Study**

1. [Sutton and Barto: stochastic policy parameterizations](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) (Reinforcement Learning: An Introduction (2nd ed.) - Chapter 13) - Chapter 13, Section 13.1, Policy Approximation and its Advantages, printed pp. 322 to 324, and Section 13.7, Policy Parameterization for Continuous Actions, pp. 335 to 336. Depth: The authors post the full text free on their Incomplete Ideas website. Focus on policy parameterization; the underlying distributions and transformations are already covered in Common distribution families and transformations.
2. [PPO continuous-action distribution audit](https://iclr-blog-track.github.io/2022/03/25/ppo-implementation-details/#9-details-for-continuous-action-domains-eg-mujoco) (The 37 Implementation Details of Proximal Policy Optimization) - 9 details for continuous action domains: state-independent log standard deviation, independent action components, and Handling of action clipping to valid range and storage. Depth: Stop before Normalization of Observation. The checklist uses latent Gaussian samples followed by clipping, not a tanh-transformed density.
3. [The tanh change-of-variables correction](https://arxiv.org/abs/1801.01290v2) (Soft Actor-Critic: action-bound density correction) - arXiv:1801.01290v2, Appendix C, Enforcing Action Bounds, Equations 20 and 21.
4. [PPO entropy term](https://arxiv.org/abs/1707.06347v2) (Proximal Policy Optimization Algorithms) - arXiv:1707.06347v2, Section 5, Algorithm, Equation 9 and its entropy-bonus explanation. Depth: Read only the combined objective here; the PPO surrogate comes next.

**Focus**

- Reuse the stable log-softmax and loss-gradient results. A categorical policy produces one log probability per sampled action; independent Gaussian components require a sum across action coordinates, not across the batch.
- For $`a=\tanh u`$, $`\log\pi(a\mid s)=\log\mu(u\mid s)-\sum_i\log(1-\tanh^2 u_i)`$. An additional affine scaling of action bounds adds its log-Jacobian correction too.
- Retain the pre-squash action for stable likelihood evaluation near saturation. Clipping is noninvertible and creates boundary masses; do not apply the tanh Jacobian to it.
- Minimizing a loss with $`-c_H H`$, for positive $`c_H`$, encourages entropy. Transformed entropy is $`H(a)=H(u)+\mathbb{E}[\log|\det(da/du)|]`$, not merely the Gaussian's analytic entropy. Entropy alone does not guarantee useful state coverage.

**Reproduce:** On CPU with `float64`, derive the scalar Gaussian log-density derivatives at fixed action $`u=0.5`$, mean 0 and standard deviation 1: the mean derivative is 0.5 and the log-standard-deviation derivative is -0.75. Squashing gives $`a=\tanh(0.5)\approx0.462117`$ and corrected log density about -0.803710. Implement the correction and match `torch.distributions.TransformedDistribution` with `torch.distributions.TanhTransform(cache_size=1)` to absolute tolerance $`10^{-10}`$.

**Traps**

- Keeping a reparameterized sample's gradient path while applying a score-function loss. Hold the sampled action fixed when differentiating its log density.
- Evaluating a Gaussian density at the clipped environment action while claiming it is the latent-action score. Store the actual latent sample if using that formulation.
- Assuming larger Gaussian standard deviation always means larger bounded-action entropy. Saturation can concentrate transformed actions near the bounds.

**Practice**

- The section mini-project covers this: policylab categorical and continuous-action density, event-shape, entropy-sign and squashing tests.

**Stop when:** Your fixed-action Gaussian gradients and squashed log density match the analytic checks, and your batched policies return one log probability per action vector.

<details>
<summary>Self-test</summary>

1. Why sum diagonal Gaussian component log probabilities?
   - Their joint density is the product of component densities. Taking its log turns the product into a sum and gives one scalar per action vector.
2. Can a continuous action density exceed 1?
   - Yes. A density is not a point probability; its integral over the action support must be 1.
3. Can the tanh correction cancel in a PPO ratio?
   - Yes, for the same action and the same parameter-independent invertible transform under both policies. It still matters for absolute log densities and transformed entropy.
4. Which entropy sign encourages exploration in a minimized loss?
   - Subtract a positive coefficient times entropy. Adding it would encourage lower entropy.

</details>

#### U7. Old and new log probabilities, importance ratios and the PPO clipped surrogate

**About 5 h** · **Target:** Derive + Implement

Topics: Old and new policy log probabilities; Importance probability ratios and direction; PPO clipped surrogate with advantage-sign cases

PPO changes the policy-gradient objective so one rollout batch can support several updates. Its clipping is sign-dependent and must be tested as an objective, not treated as a safety guarantee.

**You can now**

- Compute new-over-old action-density ratios from frozen rollout log probabilities.
- Derive the PPO clipped surrogate and its active gradient branch for each advantage sign.
- Implement a minimized clipped loss and verify it on fixed actions before training.

**Study**

1. [CS 185/285 Lecture 9: policy gradients with reused data](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-9.pdf) (Berkeley CS 185/285 Deep Reinforcement Learning (Spring 2026) - Policy Gradients, Actor-Critic and Advanced Policy Gradients) - Lecture 9, Off-Policy Policy Gradient, slides 7 to 10 and 13 to 16: importance sampling, the first-order approximation and clipped weights. Depth: Distinguish the lecture's approximations from the precise clipped surrogate in the paper. Do not infer exact state-distribution correction from an action ratio.
2. [PPO clipped surrogate](https://arxiv.org/abs/1707.06347v2) (Proximal Policy Optimization Algorithms) - arXiv:1707.06347v2, Section 3, Clipped Surrogate Objective, Equations 6 and 7 and Figure 1, p. 3.
3. [PPO: both advantage signs](https://spinningup.openai.com/en/latest/algorithms/ppo.html#key-equations) (Spinning Up - Intro to Policy Optimization and PPO) - Key Equations: PPO-Clip, Advantage is positive, Advantage is negative, and the KL early-stopping caveat. Depth: Stop before Exploration vs. Exploitation; do not install its implementation.

**Focus**

- Recompute the new policy's log density at the stored observation and stored action. Keep the old density from the behavior-policy snapshot: $`\rho_t=\exp(\log\pi_{\text{new}}(a_t\mid s_t)-\log\pi_{\text{old}}(a_t\mid s_t))`$.
- Maximize $`\min(\rho_t A_t,\operatorname{clip}(\rho_t,1-\epsilon,1+\epsilon)A_t)`$. For positive advantage the upper side saturates; for negative advantage the lower side saturates. Movement in the harmful direction is still penalized.
- Minimization requires the negative surrogate, equivalently the maximum of the two negated branches. Old log probabilities and advantages are fixed, while new log probabilities retain their gradient.
- The surrogate is a lower bound on the unclipped sampled surrogate, not a general lower bound on true policy return. It does not enforce an actual ratio or KL constraint.

**Reproduce:** With $`\epsilon=0.2`$, enumerate four samples with $`(\rho,A)=(0.6,2),(1.4,2),(0.6,-2),(1.4,-2)`$. The maximized per-sample surrogates are $`(1.2,2.4,-1.6,-2.8)`$; the negative batch mean is 0.2. On CPU in `float64`, differentiate that loss with respect to the four ratios and get $`(-0.5,0,0,0.5)`$. Check centered differences away from the clipping boundaries.

**Traps**

- Putting the old policy on top of the ratio. That reverses the intended correction and clipping cases.
- Resampling actions when computing new log probabilities. The ratio must compare densities of the same stored action.
- Clamping the ratio and using only that branch. PPO takes a minimum with the unclipped surrogate so harmful changes retain a gradient.

**Practice**

- [Deep-ML 485: PPO Clipped Surrogate Loss with Clip Diagnostics](https://www.deep-ml.com/problems/485) - Implement `ppo_clip_loss` and run the two public cases. The cases check a batch with all ratios inside the clip interval and a batch with both ratios outside, returning loss and clip fraction. They do not test gradients or a hard KL bound; the statement's claim that clipping prevents excessive deviation is not a guarantee. The section mini-project adds sign-case and gradient regressions.

**Stop when:** You reproduce all four surrogate and gradient cases, pass the two named practice cases, and explain why ratio clipping is not a hard policy constraint.

<details>
<summary>Self-test</summary>

1. What ratio should an unchanged policy produce?
   - One, up to numerical tolerance, when observation processing, action representation and density evaluation are unchanged.
2. Does a ratio above the upper clip boundary always have zero policy-loss gradient?
   - No. It is flat for positive advantage, but a negative advantage retains the unclipped harmful-change gradient.
3. What happens at zero advantage?
   - That sample's policy-surrogate term and its gradient are zero. Value and entropy terms may still update parameters.
4. Does the per-action ratio correct the new policy's state visitation distribution?
   - No. PPO optimizes a surrogate over old-policy states. Large updates can make this approximation poor.

</details>

#### U8. Approximate KL, clip fraction and multiple-epoch off-policy drift

**About 4 h** · **Target:** Measure

Topics: Approximate KL as a diagnostic and stop signal; Clip fraction, ratio and policy-update diagnostics; Multiple epochs and induced off-policy drift

A clipped objective can remain flat while the policy keeps moving. KL and ratio traces reveal that movement, but their aggregation and stop timing determine what they actually protect.

**You can now**

- Measure old-to-new KL and ratio diagnostics with their sampling distribution stated.
- Distinguish ratios outside the clip interval from samples on a flat surrogate branch.
- Track policy drift across minibatch epochs and implement a declared KL stopping rule.

**Study**

1. [CS 185/285 Lecture 10: KL and clipping](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-10.pdf) (Berkeley CS 185/285 Deep Reinforcement Learning (Spring 2026) - Policy Gradients, Actor-Critic and Advanced Policy Gradients) - Lecture 10, Advanced Policy Gradient, slides 21 to 22, sampled KL-penalized objective, and slide 32, clipping as a heuristic approximation. Depth: Skip the natural-gradient and monotonic-improvement derivations; they are outside the section gate.
2. [CleanRL: ratio diagnostics and epoch stop](https://github.com/vwxyzjn/cleanrl/blob/fe8d8a03c41a7ef5b523e2e354bd01c363e786bb/cleanrl/ppo.py#L241-L293) (CleanRL PPO) - `ppo.py`, lines 241 to 258 and 292 to 293: minibatch epochs, `old_approx_kl`, `approx_kl`, `clipfracs` and `target_kl`. Depth: Read the stop timing carefully: this code checks the last minibatch estimate after the epoch. It does not recompute a full-rollout post-update KL.
3. [PPO diagnostic checklist](https://iclr-blog-track.github.io/2022/03/25/ppo-implementation-details/#13-core-implementation-details) (The 37 Implementation Details of Proximal Policy Optimization) - 13 core implementation details, Debug variables; then 4 auxiliary implementation details, Early Stopping. Depth: The prose calls clip fraction the fraction triggering clipping. In the code it counts all out-of-interval ratios, including the harmful-direction cases that remain active.

**Focus**

- For old-policy actions and common support, $`\mathbb{E}[-\log\rho]=D_{\mathrm{KL}}(\pi_{\text{old}}\|\pi_{\text{new}})`$. The control-variate estimate $`\mathbb{E}[\rho-1-\log\rho]`$ has the same expectation because $`\mathbb{E}[\rho]=1`$. A sampled mean is not the exact KL.
- The sample mean of negative log ratio can be negative. The ratio-minus-log expression is nonnegative per sample in exact arithmetic, but neither estimator supplies a hard worst-state bound.
- Track log-ratio quantiles, the out-of-interval fraction and the advantage-sign-aware flat-branch fraction separately. Clip fraction alone cannot tell whether the policy loss has saturated.
- Several epochs reuse old states, actions and advantages while the learner changes. Freeze the denominator throughout and specify whether the stop signal is minibatch or full-rollout, pre-update or post-update. Early stopping does not undo an update already taken.

**Reproduce:** Enumerate a two-action state with old probabilities $`(0.5,0.5)`$, advantages $`(1,-1)`$ and $`\epsilon=0.2`$. Compare new probabilities $`(0.9,0.1)`$ and $`(0.999,0.001)`$. Both have clip fraction 1 and maximized clipped surrogate 0.2, but exact old-to-new KL is about 0.510826 and 2.761231 nats. Probability-weight the two KL estimators and verify agreement with the exact KL within $`10^{-10}`$ in `float64`. Then keep the old probabilities frozen while varying the new policy toward a deterministic action.

**Traps**

- Refreshing old log probabilities after each minibatch. Ratios then hide cumulative rollout-policy drift.
- Reporting a final minibatch's KL as the whole update's KL. Recompute over the frozen rollout if that is the stated diagnostic.
- Treating a stop threshold as a constraint. Sampling error, missed states and an already-completed optimizer step can all permit larger changes.

**Practice**

- The section mini-project covers this: policylab per-epoch ratio and KL traces, a declared full-rollout stopping rule and a matched update-epoch ablation.

**Stop when:** You exhibit equal clipped objectives with different KL, distinguish both clip diagnostics, and your epoch trace preserves one behavior-policy denominator.

<details>
<summary>Self-test</summary>

1. Which KL direction does averaging negative log ratio over old-policy actions estimate?
   - Old-to-new KL, averaged over the chosen old-policy state sample. Swapping the action sampling law changes the interpretation.
2. Does a high clip fraction imply most sample gradients are zero?
   - No. Only favorable-direction out-of-range cases have a flat clipped policy branch. Harmful-direction cases keep an active gradient.
3. Why can parameters still change after many policy-surrogate samples saturate?
   - Other samples, shared value or entropy terms, and optimizer state can move them. Saturation of individual terms is not a parameter constraint.
4. What happens to old-to-new KL if the new probability of an old-supported action tends to zero?
   - It diverges, even when that sample's favorable negative-advantage PPO branch is already flat.

</details>

#### U9. Value loss, value clipping, loss coefficients and advantage normalization

**About 3 h** · **Target:** Implement

Topics: Value loss, value clipping and loss coefficients; Advantage centering, scaling and minibatch leakage

Two agents with the same PPO surrogate can take different updates because of value clipping, normalization and loss coefficients. These choices need explicit tests and ablations, not a claim that defaults are optimal.

**You can now**

- Implement squared and pessimistically clipped value losses using frozen rollout targets and old values.
- State the sign, scale and parameter ownership of policy, value and entropy losses.
- Test how advantage centering and scaling depend on minibatch composition and standard-deviation convention.

**Study**

1. [PPO combined actor, value and entropy objective](https://arxiv.org/abs/1707.06347v2) (Proximal Policy Optimization Algorithms) - arXiv:1707.06347v2, Section 5, Equation 9 and the squared-error value-loss definition. Depth: Do not attribute value clipping or advantage normalization to Equation 9; those are implementation choices in the companion code.
2. [CleanRL: loss assembly and normalization](https://github.com/vwxyzjn/cleanrl/blob/fe8d8a03c41a7ef5b523e2e354bd01c363e786bb/cleanrl/ppo.py#L260-L290) (CleanRL PPO) - `ppo.py`, lines 260 to 290: minibatch normalization, clipped value loss, entropy, loss coefficients and optimizer step.
3. [PPO normalization and value-loss audit](https://iclr-blog-track.github.io/2022/03/25/ppo-implementation-details/#13-core-implementation-details) (The 37 Implementation Details of Proximal Policy Optimization) - 13 core implementation details: Normalization of Advantages, Value Function Loss Clipping, Overall Loss and Entropy Bonus, and Global Gradient Clipping. Depth: Use Schedules, gradient accumulation and clipping for the earlier global-norm result; focus here on which losses feed that norm.

**Focus**

- The rollout return target is frozen, often $`\hat A+V_{\text{old}}`$. Normalize actor advantages separately; do not substitute normalized advantages into the critic's target.
- Value clipping compares the raw squared error with the squared error at $`V_{\text{old}}+\operatorname{clip}(V_{\text{new}}-V_{\text{old}},-\epsilon_V,\epsilon_V)`$, taking the maximum. It is not clipping the target or enforcing a hard bound on value changes.
- Centering can change an advantage's sign and therefore its PPO clipping branch. Per-minibatch centering gives a sample different weights in different shuffles; this finite-sample coupling is not evidence of new experience.
- Record the normalization scope, standard-deviation correction and small-denominator handling. CleanRL uses `std()` with the default sample correction; singleton minibatches require an explicit policy rather than a silent nonfinite weight.

**Reproduce:** On CPU in `float64`, use old value 0, new value 1, return target 2 and value-clip width 0.2. The half-scaled unclipped loss is 0.5; the maximum-based clipped loss is 1.62 and has zero derivative with respect to the new value at this point. Next center advantages $`(1,3)`$: population-standard-deviation scaling gives $`(-1,1)`$, while sample-standard-deviation scaling gives $`(-1/\sqrt{2},1/\sqrt{2})`$. Implement both conventions and keep the critic target unchanged.

**Traps**

- Using a minimum for value clipping because the policy surrogate uses a minimum. The pessimistic squared-error loss uses a maximum.
- Allowing gradients into old values or return targets. That lets the target move to accommodate the current prediction.
- Comparing loss coefficients without recording sum, mean and half-squared-error conventions. Those change the effective gradient scale.

**Practice**

- The section mini-project covers this: policylab value-clipping gradients, normalization-scope regressions and a matched value-loss or normalization ablation.

**Stop when:** Your loss reproduces the flat value-clipping case and both normalization conventions, and changing normalization cannot mutate the frozen return target.

<details>
<summary>Self-test</summary>

1. Why does the reproduced clipped value loss have zero gradient?
   - The larger error comes from the clamped value, which is constant in this region. The unclipped branch is smaller and therefore inactive.
2. Does centering preserve every sample's PPO clipping branch?
   - No. A small positive advantage can become negative after subtracting the batch mean, which reverses the favorable clipping direction.
3. Does multiplying advantages by a positive constant change their signs?
   - No. It scales the policy-surrogate gradient but not the value or entropy losses. It is not generally equivalent to scaling the whole optimizer's learning rate.
4. Should a normalized advantage be used to reconstruct the return target?
   - No. Normalization changes the actor weight's units and offset. Use the original advantage plus the frozen old value for that target.

</details>

#### U10. Vectorized rollouts, policy-version identity and fixed-trajectory tests

**About 5 h** · **Target:** Implement

Topics: Vectorized rollouts and policy-version identity; Fixed-trajectory loss, ratio, GAE and gradient tests

PPO depends on the identity of the policy that generated each action. Vectorization must preserve that identity and the trajectory boundary, not just produce correctly shaped tensors.

**You can now**

- Implement a vector rollout buffer with immutable behavior-policy identity and explicit valid-transition masks.
- Handle reset-only steps, final observations and nonterminal segment cuts without cross-episode advantage leakage.
- Test log probabilities, GAE, ratios, clipped losses and gradients against independent fixed-batch oracles.

**Study**

1. [CleanRL: rollout storage and flattening](https://github.com/vwxyzjn/cleanrl/blob/fe8d8a03c41a7ef5b523e2e354bd01c363e786bb/cleanrl/ppo.py#L170-L239) (CleanRL PPO) - `ppo.py`, lines 170 to 239: storage setup, collection, GAE and batch flattening. Depth: Audit rather than copy its boundary handling. It merges termination and truncation, cuts both bootstraps, and assumes episode information under `final_info`. With Gymnasium 1.4.0 next-step autoreset, reset-only steps also need masking; pinning 0.29.1 alone does not repair truncated targets.
2. [Farama: vector autoreset contract](https://farama.org/Vector-Autoreset-Mode) (Gymnasium vector autoreset modes) - Next-Step Mode, Same-Step Mode and Disabled Mode (page read 2026-10-14). Depth: Use the mode descriptions, not the example loops as finished PPO collectors. In Disabled Mode, remember that `reset()` returns observations and information as a pair.
3. [Gymnasium: SyncVectorEnv API](https://gymnasium.farama.org/api/vector/sync_vector_env/) (Gymnasium vector autoreset modes) - SyncVectorEnv constructor, `reset()` and `step()` documentation; checked against Gymnasium 1.4.0 (page read 2026-10-14).
4. [Control Laboratory: update and identity tests](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/reinforcement-learning-control-laboratory.md) (Reinforcement Learning Control Laboratory - Policy Core) - Architecture constraints; Milestone C, Main implementation; Milestone D, Failure handling; Correctness requirements.

**Focus**

- Extend Trajectory schemas with environment, policy, seed and version identity. Store behavior log probabilities, critic values, observations, actions, rewards, both ending flags, final bootstrap observations and a policy-version identifier.
- Keep time and environment axes until GAE is complete. Flatten every field with the same ordering and exclude reset-only entries from policy, critic, entropy and metric reductions.
- In Gymnasium 1.4.0 next-step mode, the ending step returns the final observation. The following step ignores that lane's action and returns a reset observation with zero reward and false ending flags; it is not experience from that action.
- Separate rollout snapshots from learner state. Re-evaluate stored actions under the unchanged snapshot before the first update; ratios should be 1 within tolerance. Use independent residual sums and finite differences away from clipping kinks as test oracles.

**Reproduce:** On CPU with Gymnasium 1.4.0, run `import gymnasium as gym` and `import numpy`, then construct `envs = gym.vector.SyncVectorEnv([lambda: gym.make('CartPole-v1', max_episode_steps=1)])` and call `envs.reset(seed=0)`. Step with `envs.step(numpy.array([0]))`, then `envs.step(numpy.array([1]))`. The first call has lane reward 1, termination false and truncation true; the second has lane reward 0 and both flags false. Store only the first as a valid transition and call `envs.close()`. Add a second lane with a different time limit and check that masking and GAE remain lane-local.

**Traps**

- Storing a reset-only vector step as if its sampled action caused the reset. It creates a fake transition and changes the denominator of loss means.
- Recording a policy version without binding observation normalization and action transforms to it. Those can change log probabilities even with unchanged network weights.
- Checking only scalar loss equality. Ratio inversion, broadcasting or target detachment defects can require per-sample and gradient tests to expose.

**Practice**

- The section mini-project covers this: policylab immutable vector rollouts, identity-ratio checks, lane-local GAE and fixed-batch loss and gradient regressions.

**Stop when:** Your collector excludes reset-only entries, preserves final bootstrap observations and policy identity, and passes independent per-sample, shape and gradient tests.

<details>
<summary>Self-test</summary>

1. Why are two ending masks still needed with a valid-transition mask?
   - Validity excludes reset-only records. Termination determines whether to bootstrap; episode boundaries determine whether the advantage trace may continue. They answer different questions.
2. Can a vector step contain both real transitions and reset-only entries?
   - Yes. Lanes end independently, so validity must be tracked per lane, not with one batch-wide flag.
3. How do you test that flattening preserves the record?
   - Give every time-lane pair a unique label and check that all flattened fields preserve the same label order. Then recover the original axes.
4. What must stay fixed during a finite-difference policy-loss check?
   - Observations, actions, old log probabilities, advantages and transforms. Perturb only current policy parameters, and avoid nondifferentiable clip boundaries.

</details>

#### U11. Policy collapse, critic failure, stale log probabilities and multi-seed evaluation

**About 6 h** · **Target:** Measure

Topics: Policy collapse, critic failure and stale-log-prob diagnosis; Multi-seed return, entropy, KL and sample-efficiency evaluation

Improving reward does not establish a correct PPO implementation. A defensible result must survive fixed-batch failures, independent evaluation and the seed distribution.

**You can now**

- Diagnose stale denominators, entropy collapse and critic defects from stored rollouts before inspecting the offending code.
- Evaluate a small policy across prespecified training seeds with separate evaluation streams and complete diagnostic traces.
- Report interaction efficiency, wall time, uncertainty and failed runs without selecting the best seed.

**Study**

1. [PPO debugging and reproducibility recommendations](https://iclr-blog-track.github.io/2022/03/25/ppo-implementation-details/#recommendations) (The 37 Implementation Details of Proximal Policy Optimization) - Recommendations: Seed everything, Check if $`\text{ratio}=1`$, Check KL divergence, Check other metrics, Enumerate implementation details used, Release locked source code and Track experiments. Depth: Skip the Breakout score rule and do not use the article's typical KL value as a universal threshold. Match a reference only when its environment and implementation setup match yours.
2. [CleanRL: what the logged metrics actually measure](https://docs.cleanrl.dev/rl-algorithms/ppo/#explanation-of-the-logged-metrics) (CleanRL PPO) - `ppo.py`, Explanation of the logged metrics (page read 2026-10-14). Depth: Cross-check aggregation against the pinned code below. Its last minibatch losses are not full-rollout means, and clip fraction counts out-of-interval ratios rather than only flat objective branches.
3. [CleanRL: explained variance and metric writes](https://github.com/vwxyzjn/cleanrl/blob/fe8d8a03c41a7ef5b523e2e354bd01c363e786bb/cleanrl/ppo.py#L295-L309) (CleanRL PPO) - `ppo.py`, lines 295 to 309: old-value explained variance, final-minibatch losses, averaged clip fractions and steps per second.
4. [Control Laboratory: failure and evaluation evidence](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/reinforcement-learning-control-laboratory.md) (Reinforcement Learning Control Laboratory - Policy Core) - Milestone D, Failure handling; Milestone E, Measurement / optimization; Milestone F, Final evaluation; Measurement requirements.

**Focus**

- Start with invariants: unchanged-policy ratios, reward/action alignment, target detachment and boundary masks. Rising KL, falling entropy or poor value fit are symptoms, not unique diagnoses.
- Compare critic predictions with frozen targets using residuals and squared error as well as explained variance. Explained variance can miss a constant prediction offset and is undefined when target variance is zero.
- On CPU, use your tested policylab PPO on `CartPole-v1` with Gymnasium 1.4.0. Prespecify five training seeds and 100000 valid environment transitions per seed; record hyperparameters, versions and all attempts. This is an experiment budget, not a return target.
- Evaluate frozen checkpoints on separate seed streams, with the action rule declared as sampling or argmax. Plot per-training-seed returns and entropy, KL, value error, ratio and gradient diagnostics against interactions and wall time. Treat the training run, not its many evaluation episodes, as the unit for across-run uncertainty.

**Reproduce:** Build two fixed-batch defects on CPU. For old probabilities $`(0.5,0.5)`$ and new probabilities $`(0.8,0.2)`$, correct ratios are $`(1.6,0.4)`$ and exact old-to-new KL is about 0.223144 nats; replacing the denominator with the current policy falsely gives ratios $`(1,1)`$. Separately, use value targets $`(1,3)`$ and predictions $`(11,13)`$: mean squared error is 100 while explained variance is 1. Write regressions that detect both defects without a learning curve.

**Traps**

- Calling low entropy policy collapse without checking the task and evaluation policy. A useful deterministic policy can have low entropy; poor independent return and lost action support supply the failure evidence.
- Reporting only successful runs or the best checkpoint chosen on final evaluation seeds. Keep failures and separate tuning, checkpoint selection and final evaluation.
- Treating training episode returns or a lower pseudo-loss as proof of generalization. Evaluate a frozen policy independently and keep evaluation out of the update data.

**Practice**

- The section mini-project covers this: policylab multi-seed PPO evidence, independent checkpoint evaluation and two induced ratio, critic or entropy failure postmortems.

**Stop when:** You detect both fixed-batch defects and retain a complete multi-seed evaluation report with two diagnosed induced failures, raw curves and no best-seed claim.

<details>
<summary>Self-test</summary>

1. Ratios remain exactly 1 after several optimizer steps. Is that reassuring?
   - Not by itself. The actor may not have moved, but the old log probabilities may also have been refreshed incorrectly. Recompute against the immutable behavior snapshot.
2. Why can explained variance equal 1 for a poor critic?
   - It uses the variance of residuals, which ignores a constant offset. Predictions shifted uniformly from the targets have zero residual variance but nonzero squared error.
3. Can many evaluation episodes from one trained model replace multiple training seeds?
   - No. They estimate that model's evaluation variability, not variability caused by training randomness.
4. What does an entropy-coefficient ablation need for fair attribution?
   - The same environment, seed set, interaction budget, evaluation policy and tuning budget, with all attempts retained. Keep unrelated algorithm choices fixed.

</details>

### Mini-project: Actor-critic and PPO with versioned rollouts

**About 12 to 16 hours.** Build the `policylab` policy laboratory: exact gradient oracles, actor-critic with GAE, and PPO with immutable vector rollouts and full loss tests. Multi-seed CartPole evidence with induced failure postmortems closes the project before language-policy work begins.

1. Build the exact-enumeration policy-gradient oracle in `deep/` and a REINFORCE update whose expected gradient matches enumeration and finite differences, trained only on fresh trajectories.
2. Compare full-return, reward-to-go and baseline weightings on shared samples against exact expectations, and ablate the baseline on the short corridor.
3. Add learned baselines and one-step actor-critic with frozen targets, separate termination from truncation bootstrapping, and prove actor gradients never flow through detached advantages or targets.
4. Implement GAE by backward recursion with per-lane masks and endpoint oracles for termination, truncation and segment cuts, then test categorical and Gaussian densities with the squashing correction and entropy sign, and ablate trace decay at a matched budget.
5. Pass Deep-ML 485, add sign-case and gradient regressions for the clipped surrogate, and test value clipping and normalization scope without letting normalized advantages mutate frozen return targets, with a matched normalization ablation.
6. Collect immutable vector rollouts with behavior-policy identity and per-lane validity masks, verify unit ratios before the first update, and trace ratios with KL across epochs under a declared full-rollout stopping rule, plus a matched update-epoch ablation.
7. Run multi-seed PPO evidence on CPU with independent checkpoint evaluation on separate streams, and write postmortems for two induced ratio, critic or entropy failures diagnosed from stored rollouts.

**Deliverables**

- Policy-gradient and GAE oracles with density, entropy and rollout identity tests.
- PPO losses with sign-case, clipping, normalization and stopping regressions.
- Multi-seed evidence with raw traces, two failure postmortems and the matched ablations.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [Deep-ML 485: PPO Clipped Surrogate Loss](https://www.deep-ml.com/problems/485). Pass both public cases; add sign-case and gradient regressions.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Gradient oracles | Expected REINFORCE gradients match enumeration, and GAE advantages match their endpoint oracles with per-lane boundaries intact. | A cross-lane leak is injected and caught by the lane oracle. |
| Loss honesty | Clipped, value and entropy losses pass sign-case and gradient tests with frozen targets. | A normalization-scope defect is shown to flip a clipping branch and is pinned by regression. |
| Drift control | Per-epoch ratio and KL traces preserve one denominator under a declared stopping rule. | Equal clipped objectives with different KL are exhibited on fixed batches. |
| Evaluation honesty | Multi-seed evidence uses separate streams with failures retained and no best-seed claim. | Two induced failures are diagnosed from rollouts before code inspection. |

Feeds into: Policy oracles, GAE and versioned PPO rollouts feed exploration, offline, model-based and language-policy projects and capstone policy evidence.

### Resource route

- **Primary - Course:** [Berkeley CS 185/285 Deep Reinforcement Learning (Spring 2026) - Policy Gradients, Actor-Critic and Advanced Policy Gradients](https://rail.eecs.berkeley.edu/deeprlcourse/) - Slides are public at https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-N.pdf; current videos are not, and the public Fall 2023 playlist numbers lectures differently. Study Lectures 5 (policy gradients), 6 (actor-critic), 9 and 10 (advanced policy gradients). Work Homework 2 (`src/agents/pg_agent.py`: return estimators, reward-to-go, a neural baseline and a GAE $`\lambda`$ sweep); its runs take seconds to minutes on a laptop CPU. The homework pins `gym==0.25.2`, which fails on NumPy 2, so port it to Gymnasium (`terminated` and `truncated`) or pin `numpy<2` in its own environment, and turn off its forced WandB logging. 
- **Support - Course:** [Stanford CS224R Spring 2026 - Policy Gradients and Actor-Critic](https://cs224r.stanford.edu/) - Use Lectures 03 (policy gradients) and 04 (actor-critic) as a second derivation, and the Homework 2 PPO handout for its exact GAE recursion and its note that several epochs on one batch is not strictly on-policy. Its runs need cloud GPUs, and its actor is a truncated normal, not a tanh-squashed Gaussian. Follow the Stanford honor code for course materials.
- **Required - Book:** [Reinforcement Learning: An Introduction (2nd ed.) - Chapter 13](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) - The authors post the full second edition free at incompleteideas.net; cite the printed page numbers. Study Sections 13.1 to 13.5 and 13.7: the policy-gradient theorem, REINFORCE, REINFORCE with baseline, actor-critic and Gaussian policies. Reproduce Example 13.1 (the short corridor) with and without a baseline, and derive the gradient and baseline result in the notation of the shared trajectory schema.
- **Required - Paper:** [Proximal Policy Optimization Algorithms](https://arxiv.org/abs/1707.06347) - Read the clipped objective, implementation variants and experiments. Build hand cases for positive and negative advantages, compare clipped and unclipped losses and show that clipping alone does not enforce a hard KL bound.
- **Required - Paper:** [High-Dimensional Continuous Control Using Generalized Advantage Estimation](https://arxiv.org/abs/1506.02438) - Derive GAE from TD residuals, implement backward recursion with terminal and truncation masks and sweep $`\gamma`$ and $`\lambda`$ on fixed trajectories before training.
- **Required - Guide:** [The 37 Implementation Details of Proximal Policy Optimization](https://iclr-blog-track.github.io/2022/03/25/ppo-implementation-details/) - Use the core and continuous-action details as an audit checklist for your PPO: vectorized environments, advantage normalization, value clipping, entropy, global gradient clipping, learning-rate annealing and observation and reward normalization. For each detail you adopt, show its effect with an ablation on your own task.
- **Support - Reference:** [Spinning Up - Intro to Policy Optimization and PPO](https://spinningup.openai.com/en/latest/spinningup/rl_intro3.html) - Read Part 3 (Intro to Policy Optimization: the simplest policy gradient, reward-to-go, the expected grad-log-prob lemma, baselines) and the PPO page's background, which states that the clipped objective has no hard KL bound. Do not install its code: it needs TensorFlow 1, MPI and the retired Gym stack.
- **Support - Implementation:** [CleanRL PPO](https://docs.cleanrl.dev/rl-algorithms/ppo/) - Use the single-file implementation and implementation-details notes as a post-implementation audit. Trace rollout shapes, advantage calculation, minibatch epochs, ratios, clipping, value loss, entropy, seeding and environment semantics. Like the DQN script it reads `final_info`, which Gymnasium 1.x next-step autoreset no longer provides; pin `gymnasium==0.29.1` or patch the episode logging.
- **Support - Tutorial:** [Hands-on Modern RL - REINFORCE, Actor-Critic and PPO](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter10_ppo/ppo-math) - Use the REINFORCE page, the actor-critic chapter and the PPO and GAE pages for worked numbers: the three advantage-sign cases and the five-step GAE table. `code/chapter05_policy_gradient/reinforce_cartpole.py` and `code/chapter07_ppo/ppo_from_scratch.py` run on CPU in minutes. Audit completion masks against the Gymnasium docs (its GAE helper cuts the bootstrap on truncation) and do not adopt its KL sketch as a reference. Pin commit 9231bab of walkinglabs/hands-on-modern-rl; its `code/chapterNN` folders do not follow the site chapter numbers.
- **Support - Practice:** [Deep-ML - Policy-Gradient Problems](https://www.deep-ml.com/problems/485) - Use named problems as closed-book checks after your own implementation passes: 481 (REINFORCE with baseline), 482 (one-step actor-critic), 485 (PPO clipped surrogate with clip diagnostics) and 487 (GAE with episode boundaries). Read each problem's tests before trusting its statement.
- **Required - Project:** [Reinforcement Learning Control Laboratory - Policy Core](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/reinforcement-learning-control-laboratory.md) - Complete REINFORCE with baseline, actor-critic, GAE and PPO requirements. Match hand-computed log probabilities, advantages, ratios and clipped losses and diagnose stale-policy, ratio, GAE and evaluation leakage defects.
- **Reference - Paper:** [Soft Actor-Critic: action-bound density correction](https://arxiv.org/abs/1801.01290v2) - Appendix C, Enforcing Action Bounds, Equations 20 and 21 in arXiv:1801.01290v2. Supplies the change-of-variables derivation missing from the pool's action-clipping checklist; do not study SAC training here.
- **Reference - Documentation:** [Gymnasium vector autoreset modes](https://farama.org/Vector-Autoreset-Mode) - Read Next-Step Mode, Same-Step Mode and Disabled Mode in the official autoreset explainer, then SyncVectorEnv's reset and step API. Check against Gymnasium 1.4.0; pages read 2026-10-14. Supplies current rollout semantics missing from the older PPO examples.

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
- [ ] Undirected $`\epsilon`$ and entropy-based exploration _(Required)_
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

### Study units

#### U1. Exploration as data collection: $`\epsilon`$, entropy and optimism

**About 4 h** · **Target:** Explain

Topics: Exploration and exploitation as a data-collection problem; Undirected $`\epsilon`$ and entropy-based exploration; Optimism and upper-confidence vocabulary

Every deep RL update eats data the current policy collected. If collection never visits the good regions, no update rule can recover them.

**You can now**

- Explain exploration as a data-collection choice and contrast directed optimism with undirected $`\epsilon`$-greedy and entropy noise.
- State the UCB selection rule and the regret criterion, and predict when $`\epsilon`$-greedy suffers linear regret.
- Name what an exploration bonus adds to a value target and what has to be tuned about it.

**Study**

1. [CS234 Lectures 9 and 10: bandits, regret and UCB](https://web.stanford.edu/class/cs234/slides/lecture9pre.pdf) (Stanford CS234 Winter 2026 - Bandits and Exploration) - Lecture 9: bandit setting, regret as opportunity loss with counts and gaps, and the optimism-under-uncertainty versus Thompson-sampling approaches.
2. [CS234 Lecture 10: UCB regret bound](https://web.stanford.edu/class/cs234/slides/lecture10post.pdf) (Stanford CS234 Winter 2026 - Bandits and Exploration) - Lecture 10 post-class: UCB1 algorithm, the regret-bound sketch around Theorem 7.1, and the move to Thompson sampling and Bayesian regret.
3. [Berkeley CS 285 Lecture 19: the exploration problem and optimistic deep RL](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-19.pdf) (Berkeley CS 185/285 Deep Reinforcement Learning (Spring 2026) - Exploration and Off-Policy Actor-Critic) - Lecture 19, Part 1: the exploration problem with Montezuma's Revenge and the exploitation-versus-exploration definitions; Part 2: optimistic exploration in deep RL with the UCB exploration bonus and bonus-weight tuning.

**Focus**

- Regret is cumulative opportunity loss written through gaps and visit counts, so minimizing regret and maximizing reward are the same objective stated two ways.
- UCB picks $`\operatorname{argmax}_a Q_t(a) + c \sqrt{\ln t / N_t(a)}`$: the second term is uncertainty, not noise, and it shrinks as $`N_t(a)`$ grows.
- An $`\epsilon`$-greedy policy explores indiscriminately while optimism prefers actions that are nearly greedy or highly uncertain; that is why fixed $`\epsilon`$ can keep paying linear regret.
- In deep RL the bonus is added to the reward or value target, which makes the bonus weight a tuning parameter that changes the learned policy.

**Reproduce:** Closed-book, write regret as total opportunity loss and the UCB rule with all symbols defined. For $`Q = [0.9, 0.8]`$, $`N = [100, 2]`$, $`t = 102`$ and $`c = 1`$, compute UCB values 1.115 and 2.321 and pick arm 2 despite its lower mean, then explain why $`\epsilon`$-greedy with fixed $`\epsilon > 0`$ keeps linear regret.

**Traps**

- Reading UCB as mean plus noise. The bonus is a deterministic function of $`t`$ and $`N_t(a)`$; the randomness sits in the estimated means.
- Assuming more exploration is always safer. A fixed bonus weight can drown the task reward, so the weight is part of the comparison, not a free setting.
- Judging exploration by one training curve. Regret and coverage statements need counts and seeds, not a single run that happened to stumble onto reward.

**Practice**

- The section mini-project covers this: an $`\epsilon`$-greedy versus UCB comparison on a small bandit and grid task with matched interaction budgets, reporting counts, gaps and regret across seeds.

**Stop when:** You compute the UCB pick by hand, explain the linear-regret case for fixed $`\epsilon`$, and state what a bonus weight changes in a deep RL target.

<details>
<summary>Self-test</summary>

1. Two arms have means 0.9 and 0.8 with counts 100 and 2 after 102 pulls and c = 1. Which arm does UCB pick and why?
   - Arm 2. Its UCB is about 2.321 against about 1.115 for arm 1, so uncertainty outweighs the lower mean.
2. Why can $`\epsilon`$-greedy with fixed $`\epsilon`$ have linear regret while UCB has sublinear regret?
   - Fixed $`\epsilon`$ keeps pulling suboptimal arms a constant fraction of the time, so regret grows with t. UCB shrinks exploration of an arm as its count grows, so suboptimal pulls grow sublinearly.
3. What does the bonus weight control when a UCB-style bonus is added to a deep RL target?
   - How much the update prefers uncertain states over high-value states. Too large and the agent chases novelty instead of the task; too small and the bonus changes nothing.
4. An agent scores highly once after random play. Does that show its exploration method works?
   - No. One lucky trajectory shows reachability, not a method. Compare visit counts, success rates and regret across seeds under matched budgets.

</details>

#### U2. Counts, pseudocounts, curiosity and intrinsic rewards versus shaping

**About 4 h** · **Target:** Explain + Implement

Topics: Count, pseudocount and intrinsic-reward vocabulary; Curiosity and representation-dependent novelty; Exploration bonuses versus reward shaping

Sparse tasks give no gradient until the first success. Intrinsic rewards manufacture a signal from novelty, but the same signal can trap the agent in front of noise.

**You can now**

- Explain counts, pseudocounts and prediction-error novelty, and when each bonus stays informative.
- Derive the total-reward mix of extrinsic and intrinsic reward and show how $`\beta`$ changes the objective.
- Implement a tabular count bonus and an RND-style predictor error on a small task without counting the bonus as task reward.

**Study**

1. [Berkeley CS 285 Lecture 19: counts, pseudocounts and bonus forms](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-19.pdf) (Berkeley CS 185/285 Deep Reinforcement Learning (Spring 2026) - Exploration and Off-Policy Actor-Critic) - Lecture 19, Part 2: the trouble with counts, fitting generative models, pseudocounts after Bellemare et al., bonus forms UCB, MBIE-EB and BEB, and heuristic counts via errors after Burda et al.
2. [RND: prediction error against a fixed random target](https://arxiv.org/abs/1810.12894) (Exploration by Random Network Distillation) - arXiv:1810.12894v1 Sections 1 to 3: fixed random target network with trained predictor, prediction error as intrinsic reward with the MNIST toy and Montezuma Figure 1; Section 2.3: separate extrinsic and intrinsic value heads and episodic versus non-episodic intrinsic return.
3. [Pseudocounts from a density model](https://arxiv.org/abs/1606.01868) (Unifying Count-Based Exploration and Intrinsic Motivation) - arXiv:1606.01868v2 Sections 2 to 3: density model over states, learning-positive Definition 1, prediction gain and Theorem 1 relating pseudocounts to information gain, and the bonus built on the pseudocount form.
4. [Hands-on Modern RL 12.1: ICM and RND concepts](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter14_exploration_marl_hierarchical/intrinsic-motivation-exploration) (Hands-on Modern RL - DDPG, TD3, SAC and Intrinsic Motivation) - Sections 1 to 3.1: sparse-reward motivation with total-reward mix, ICM state-prediction error with inverse and forward models, RND target and predictor with its intrinsic reward, and the ICM versus RND comparison (page read 2026-10-14). Depth: Concepts only. The UCB line on this page drops the square root, so use the CS234 form with the root. Treat the 10-18 Montezuma probability and the Atari score claims as unverified author reports, not targets.

**Focus**

- Total reward is $`r^{\text{total}}_t = r^{\text{ext}}_t + \beta r^{\text{int}}_t`$: with extrinsic 0, intrinsic 0.4 and $`\beta = 0.1`$, the update sees 0.04, and changing $`\beta`$ changes the optimum.
- A usable bonus is computable from visited data and exhaustible: visited states must decay toward zero bonus or the agent farms novelty forever.
- Pseudocounts generalize tabular counts through a density model, while RND skips densities and uses error against a frozen random target.
- RND trains two value heads because extrinsic and intrinsic returns have different horizons: episodic task return versus non-episodic novelty return.

**Reproduce:** Closed-book, write the total-reward mix, the ICM reward as half squared feature-prediction error, and the RND reward as squared predictor-minus-target error. Compute the 0.04 example above and explain the noisy-TV failure: ICM error never decays on unpredictable noise while the RND target has bounded complexity.

**Traps**

- Counting the bonus as task performance. Success rates and task returns must use extrinsic reward only; the bonus is training signal.
- Trusting novelty from a representation without checking it. A bonus depends on features or densities, so a new encoder can flip which states look novel.
- Treating episodic and non-episodic novelty as interchangeable. RND Section 2.3 makes intrinsic return non-episodic because an episodic one drops to zero at game over and makes the agent overly risk averse, and it keeps extrinsic return episodic so the agent cannot farm an early reward by restarting. Two value heads combine the two streams.

**Practice**

- The section mini-project covers this: a tabular count bonus versus its pseudocount form on a small grid, plus an RND predictor-error bonus with extrinsic-only scoring and a noisy distractor cell.

**Stop when:** You compute the mixed-reward example by hand, derive when each bonus decays, and keep bonus and task reward in separate columns of your results.

<details>
<summary>Self-test</summary>

1. Extrinsic reward is 0, intrinsic reward is 0.4 and $`\beta = 0.1`$. What update signal does the agent see, and what happens as $`\beta`$ grows?
   - It sees 0.04. Larger $`\beta`$ pushes the policy toward novelty and away from the task optimum; the bonus weight is part of the objective.
2. Why does ICM get stuck on a noisy TV while RND is more robust?
   - ICM rewards forward-model error, which stays high on unpredictable noise. RND rewards error against a fixed finite-complexity target, so the error is bounded and decays with visits.
3. Why does RND fit two value heads instead of one mixed return?
   - Extrinsic return is episodic and intrinsic return is non-episodic with its own scale and horizon. One head would mix incompatible targets; two heads keep each bootstrap correct.
4. A density model assigns high likelihood to a new state. What does its pseudocount say?
   - High pseudocount, hence low bonus. The state looks familiar to the model whether or not a tabular count ever saw it, which is exactly the representation dependence to check.

</details>

#### U3. Sparse, delayed and deceptive rewards, success coverage and unfair comparisons

**About 4 h** · **Target:** Measure

Topics: Sparse, delayed and deceptive reward environments; State-action visitation and success coverage; Privileged information and unfair exploration comparisons

Hard tasks punish the wrong measurement. An agent can improve reward while never covering the goal, and a comparison can favor the method that secretly saw more.

**You can now**

- Distinguish sparse, delayed and deceptive rewards and predict which one misleads a shaped-reward fix.
- Measure state-action visitation and success coverage with an explicit distance or threshold rule.
- Spot unfair exploration comparisons that hide extra interactions, privileged state or tuned bonuses.

**Study**

1. [Hands-on Modern RL 12.1 Section 1: why sparse rewards need intrinsic motivation](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter14_exploration_marl_hierarchical/intrinsic-motivation-exploration) (Hands-on Modern RL - DDPG, TD3, SAC and Intrinsic Motivation) - Section 1: hard-exploration games, the total-reward mix with $`\beta`$, and the computable plus exhaustible requirements for an intrinsic reward (page read 2026-10-14). Depth: Concepts only. Treat the Montezuma probability claim as illustration; your evidence comes from measured visitation, not the quoted number.
2. [HER: sparse binary rewards and the shaped-reward failure](https://arxiv.org/abs/1707.01495) (Hindsight Experience Replay) - arXiv:1707.01495v3 Sections 4.2 to 4.4 with Figures 3 to 5: DDPG with and without HER on pushing, sliding and pick-and-place over 5 seeds with the 7 cm and 20 cm success rule, and the failure of every shaped reward tried.
3. [CS234 Lecture 12: PAC, MBIE-EB and generalization](https://web.stanford.edu/class/cs234/slides/lecture12pre.pdf) (Stanford CS234 Winter 2026 - Bandits and Exploration) - Lecture 12: PAC framework for MDPs, MBIE-EB with its exploration bonus, and the generalization slides where raw counts fail when each state appears once and bonus terms are computed at visit time.

**Focus**

- HER uses binary sparse reward $`r = -[\lvert g - s \rvert > \epsilon]`$: 0 within a fixed tolerance and -1 elsewhere. Its reported success rule is a separate explicit distance at the end of the episode, such as 7 cm for pushing.
- Deceptive means the shaped signal points away from the goal: HER Section 4.4 shows shaped rewards failing everywhere while sparse plus relabeling succeeds.
- Coverage is measured over visited states and achieved goals, not over reward collected; a high-reward run can still cover almost nothing.
- Fair comparisons match interactions, updates, information access and tuning: HER reports 5 seeds with standard-deviation bands and tunes its count-based baseline over a stated grid.

**Reproduce:** Closed-book, write the HER binary reward and the pushing success rule, then sketch a visitation table for a small grid that separates success rate from state coverage. Explain in two sentences why the shaped rewards in HER Section 4.4 failed: they optimize distance while success is a threshold, and they penalize the touching behavior exploration needs.

**Traps**

- Replacing coverage with return. An agent can raise return by exploiting a nearby reward while the goal region stays unvisited.
- Accepting a tuned baseline at face value. HER footnote 6 tunes its count baseline over $`\alpha`$ and $`\beta`$ grids; an untuned baseline comparison proves nothing.
- Calling a task sparse when it is deceptive. Sparse needs more visits; deceptive needs a different signal, and extra visits to the wrong region make things worse.

**Practice**

- The section mini-project covers this: visitation and success-coverage logs on a sparse task, a shaped-versus-sparse comparison with the success rule fixed, and a fairness checklist covering steps, information and tuning.

**Stop when:** You report visitation and thresholded success separately from return, and you can reject an exploration win that hides extra steps, state or tuning.

<details>
<summary>Self-test</summary>

1. An agent doubles its episode return but visits the same 5 percent of states. Has exploration improved?
   - Not shown. Return measures exploitation of visited regions; exploration needs visitation or success-coverage numbers over the state or goal space.
2. Why did shaped distance rewards fail on the HER manipulation tasks while sparse binary rewards with HER succeeded?
   - The shaped rewards optimize distance while success is a radius threshold, and they penalize imprecise touching, which teaches the agent not to touch the box. Sparse reward plus relabeling keeps the true objective and densifies signal honestly.
3. Method A beats method B but used twice the environment steps and a tuned bonus. What do you demand before accepting the win?
   - A rematch with matched steps, updates, information access and tuning budgets, plus per-run records and coverage numbers, not just mean return.
4. Each state appears once in a large task. Why do raw counts stop helping?
   - Every count stays near zero so every bonus looks the same. Novelty then needs generalization through densities, features or predictor error, with the representation dependence stated.

</details>

#### U4. Continuous actions, deterministic policy gradients, DDPG and TD3

**About 5 h** · **Target:** Derive + Implement

Topics: Continuous action spaces and control constraints; Deterministic policy gradients and DDPG vocabulary; Twin critics, delayed updates and TD3 vocabulary

Robot joints and steering take continuous values where DQN-style argmax is impossible. DDPG learns an approximate maximizer, and TD3 fixes the overestimation that otherwise feeds on itself.

**You can now**

- Derive the deterministic policy gradient as a chain of policy Jacobian and critic action-gradient.
- Explain the TD3 target with twin-critic min, delayed actor updates and smoothed target actions.
- Implement a DDPG-style update with replay and soft targets, then ablate the twin-critic min on a small continuous task.

**Study**

1. [Hands-on Modern RL 9.1: deterministic policy gradients and DDPG](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter11_continuous_control/ddpg) (Hands-on Modern RL - DDPG, TD3, SAC and Intrinsic Motivation) - Sections The Fundamental Difficulty of Continuous Actions through DDPG: argmax by enumeration fails for continuous actions, the DPG chain-rule form, DDPG actor, critic, replay and soft target updates with $`\tau = 0.005`$ and Gaussian exploration noise, and Three Weaknesses of DDPG (page read 2026-10-14). Depth: Vocabulary and code sketch only. The displayed DDPG target equation drops the terminal mask (the page's code sketch keeps `(1 - dones)`); take the mask from the TD3 paper target and always multiply the bootstrap by not-terminated.
2. [Hands-on Modern RL 9.2 TD3 part: twin critics, delay and smoothing](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter11_continuous_control/td3-sac) (Hands-on Modern RL - DDPG, TD3, SAC and Intrinsic Motivation) - Section Stability Improvements for DDPG: twin Q-networks with the min target, delayed actor and target updates every d = 2 steps, and target smoothing noise 0.2 clipped to 0.5 (page read 2026-10-14). Depth: Use the paper for exact equations. The HalfCheetah curves and score claims on this page are author-reported; do not use them as targets.
3. [TD3: clipped double Q, delayed updates and target smoothing](https://arxiv.org/abs/1802.09477) (Addressing Function Approximation Error in Actor-Critic Methods (TD3)) - arXiv:1802.09477v3 Sections 4 to 5: overestimation measurement with Figure 2, clipped double Q target Equation 10 as the min of two critics, delayed policy updates in Section 5.2 and target smoothing in Section 5.3; Section 6.2 ablation of the three parts.

**Focus**

- Continuous argmax is the whole problem: DQN enumerates actions, so a seven-joint torque vector needs a learned maximizer instead.
- The DPG form $`\nabla_\theta J = \mathbb{E}[\nabla_\theta \mu_\theta(s) \nabla_a Q(s, a)]`$ needs states only, no action average, which is why DDPG can learn off-policy from a noisy behavior policy.
- TD3 takes $`y = r + \gamma \min_i Q_i(s', \tilde{a})`$ with $`\tilde{a}`$ the smoothed target action: the min trades overestimation for underestimation, which the policy does not propagate.
- Delay and smoothing serve the critic: the actor waits $`d = 2`$ critic steps before following its gradients, and noise around the target action smooths sharp critic bumps.

**Reproduce:** Closed-book, derive the DPG chain rule from the stochastic form and write the TD3 target with all symbols. For $`r = 1.0`$, $`\gamma = 0.99`$, next-critic values 10.0 and 12.0 and no termination, compute 10.9 and state the delay and smoothing defaults.

**Traps**

- Dropping the terminal mask because a paper equation shows none. Paper targets abbreviate; your code multiplies the bootstrap by $`(1 - d)`$ with $`d`$ the terminated flag, and truncation still bootstraps.
- Reading the min as unbiased. Clipped double Q underestimates by design; underestimated actions are simply not followed, while overestimated ones would be chased.
- Keeping Ornstein-Uhlenbeck noise because the DDPG paper used it. Later work finds plain Gaussian noise works at least as well on common benchmarks; tune the scale instead of the process.

**Practice**

- [Berkeley CS 285 HW3: clipped double-Q ablation on Hopper-v4](https://github.com/berkeleydeeprlcourse/homework_spring2026/blob/59e40fc/hw3/src/agents/sac_agent.py) - HW3 Section 3.6, Stabilizing Target Values, with `experiments/sac/hopper_singleq.yaml` versus `hopper_clipq.yaml`; handout https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw3.pdf. Port the repo to Gymnasium with terminated and truncated handling or pin `numpy<2` in its own environment, and turn off its forced WandB logging. Each Hopper config runs 500000 environment steps, which the handout counts as cheap enough to run locally on your GPU; report both configs with matched seeds.

**Stop when:** You derive the DPG chain rule, compute the TD3 target by hand, and defend the min, delay and smoothing choices from matched single-versus-clipped runs.

<details>
<summary>Self-test</summary>

1. Why can DQN not act in a continuous torque space without modification?
   - Its decision rule needs argmax over actions. Enumeration works for two buttons and fails for infinitely many torque vectors, so it needs an approximate maximizer such as an actor or stochastic optimization.
2. Next-critic values are 10 and 12 with reward 1 and $`\gamma = 0.99`$ and no termination. What is the TD3 target?
   - 10.9. The min picks 10, giving 1 + 0.99 times 10.
3. What breaks if the actor updates every critic step instead of with delay?
   - The actor follows an inaccurate critic early, collects worse data, and the coupled error grows. Delay gives the critic more updates before its gradients steer the actor.
4. A run reports high Q values but poor returns. Which TD3 mechanism addresses this and how do you confirm it?
   - Clipped double Q. Compare single versus clipped-double runs on matched seeds and check whether the min lowers the value estimates while returns hold or improve.

</details>

#### U5. Maximum-entropy RL, Soft Actor-Critic and temperature tuning

**About 5 h** · **Target:** Derive + Implement

Topics: Maximum-entropy RL and Soft Actor-Critic; Automatic entropy-temperature tuning

Deterministic actors explore only through added noise. SAC folds exploration into the objective with entropy, then tunes its own temperature instead of asking you to guess it.

**You can now**

- Derive the maximum-entropy objective and its soft Bellman backup with the temperature weight.
- Explain automatic temperature tuning as a dual update against a target entropy.
- Implement or audit a compact SAC loop and compare it with TD3 under matched samples and tuning.

**Study**

1. [SAC Algorithms and Applications: max-entropy objective and auto-tuning](https://arxiv.org/abs/1812.05905) (Soft Actor-Critic Algorithms and Applications) - arXiv:1812.05905v2 Section 3: maximum-entropy objective with temperature $`\alpha`$; Section 4: soft Bellman backup and soft policy iteration; Section 5: entropy-constrained formulation with the dual update for $`\alpha`$ and Algorithm 1; Sections 6 to 7: fixed versus automatically tuned temperature runs.
2. [CS224R Lecture 05: practical SAC against PPO](https://cs224r.stanford.edu/slides/05_cs224r_offpolicy_actor_critic_2026.pdf) (Stanford CS224R Spring 2026 - Off-Policy and Goal-Conditioned RL) - Lecture 05 Off-Policy Actor Critic: practical SAC algorithm, replay-buffer data efficiency against PPO stability and tuning, and the PPO versus SAC table including Markov reliance.
3. [Hands-on Modern RL 9.2 SAC part: max-entropy vocabulary](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter11_continuous_control/td3-sac) (Hands-on Modern RL - DDPG, TD3, SAC and Intrinsic Motivation) - Sections Maximum-Entropy RL through Advantages of SAC: max-entropy objective, soft Bellman backup, Gaussian reparameterization, automatic temperature tuning with target entropy -|A|, and the DDPG/TD3/SAC table (page read 2026-10-14). Depth: Vocabulary only. The temperature code sketch uses a confusing sign convention, so implement the dual update from the paper Section 5. Treat the table and curves as author reports.
4. [Berkeley CS 285 HW3: SAC with entropy bonus and auto-tuning](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw3.pdf) (Berkeley CS 185/285 Deep Reinforcement Learning (Spring 2026) - Exploration and Off-Policy Actor-Critic) - HW3 Section 3: SAC in `src/agents/sac_agent.py` with `src/scripts/run_sac.py` and `experiments/sac/` configs; Section 3.3 entropy bonus with the entropy sanity check near $`\log 2`$; Section 3.4 reparameterized actor with the `InvertedPendulum-v4` return close to 1000; Section 3.5 auto-tuned temperature against the Section 3.4 fixed run. Depth: The handout writes the temperature as $`\beta`$ until Section 3.5 introduces the dual variable $`\alpha`$.

**Focus**

- The objective adds entropy: $`J = \mathbb{E}[\sum_t \gamma^t (r_t + \alpha H(\pi(\cdot \mid s_t)))]`$, and $`\alpha \to 0`$ recovers the standard return objective.
- The soft backup replaces the hard max with a soft maximum over actions, which keeps several good actions probable instead of collapsing to one.
- Auto-tuning solves a constrained problem: keep expected entropy above $`\bar{H}`$ while maximizing return, with $`\alpha`$ as the dual variable and $`\bar{H} = -\lvert A \rvert`$ as default.
- SAC wins on sample efficiency through replay and pays in tuning and stability: CS224R states the trade against PPO explicitly, including heavier Markov reliance.

**Reproduce:** Closed-book, write the max-entropy objective, the soft backup, and the dual temperature update with target entropy. For a two-action uniform policy, entropy is $`\ln 2 \approx 0.693`$; with $`r = 1`$ and $`\alpha = 0.1`$ the augmented reward is 1.0693.

**Traps**

- Citing the first SAC paper for temperature tuning. The 2018 version uses fixed temperature; automatic tuning arrives in the 2019 applications version Section 5, which the pool points at.
- Reading entropy as pure exploration noise. It regularizes the objective and smooths Q, so removing it changes the optimum, not just the samples.
- Expecting auto-tuning to beat a tuned fixed temperature. HW3 notes the HalfCheetah default is already well tuned, so the win is robustness on new tasks, not a higher score there.

**Practice**

- [Berkeley CS 285 HW3: SAC sanity and auto-temperature on InvertedPendulum-v4](https://github.com/berkeleydeeprlcourse/homework_spring2026/blob/59e40fc/hw3/src/agents/sac_agent.py) - HW3 Sections 3.3 to 3.5: `sanity_invertedpendulum.yaml` then `sanity_invertedpendulum_autotune.yaml`; optional HalfCheetah fixed versus autotune with `halfcheetah.yaml` and `halfcheetah_autotune.yaml`; handout https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw3.pdf. Port to Gymnasium or pin `numpy<2` with WandB disabled. InvertedPendulum sanity fits CPU or one small GPU and should return close to 1000 within the configs' 50000 steps; HalfCheetah needs hours on a GPU, so treat it as optional.

**Stop when:** You derive the max-entropy update and temperature dual by hand, and your InvertedPendulum runs show the sanity return with fixed and auto-tuned temperatures logged.

<details>
<summary>Self-test</summary>

1. What does the temperature $`\alpha`$ weight, and what happens at $`\alpha`$ near zero?
   - The entropy term against reward. Near zero the objective recovers standard expected return and the policy can collapse to a single action.
2. A two-action policy is uniform with reward 1 and $`\alpha = 0.1`$. What augmented reward does SAC optimize?
   - About 1.0693, since entropy ln 2 is about 0.693 and 1 + 0.1 times 0.693 is 1.0693.
3. Entropy keeps falling below target during training. Which way should $`\alpha`$ move and why?
   - Up. $`\alpha`$ is the dual variable on the entropy constraint, so low entropy raises $`\alpha`$ to price randomness back in.
4. SAC beats PPO on samples but PPO is picked for a new robot task. What justifies that choice?
   - Stability and tuning cost. SAC is more sample efficient but harder to tune and leans harder on the Markov assumption; PPO trades samples for plug-and-play stability.

</details>

#### U6. Goal-conditioned policies, hindsight relabeling and partial observability

**About 5 h** · **Target:** Explain + Implement

Topics: Goal-conditioned policies and relabeling; Hindsight Experience Replay; Partial observability and recurrent policy vocabulary

Sparse goal tasks give almost no successes to learn from. Relabeling turns every failure into a success for the goal actually reached, which densifies reward without inventing signal.

**You can now**

- Explain goal-conditioned policies and hindsight relabeling with recomputed rewards.
- Compare final, future, episode and random relabeling strategies and state when each wins.
- Describe partial observability and the history-as-state remedy, and state what stays at vocabulary depth here.

**Study**

1. [CS224R Lecture 12: multi-task and goal-conditioned relabeling](https://cs224r.stanford.edu/slides/12_cs224r_mtrl_gcrl_2026.pdf) (Stanford CS224R Spring 2026 - Off-Policy and Goal-Conditioned RL) - Lecture 12: goal-conditioned setup with the goal as state, the hindsight relabeling loop that stores relabeled data with recomputed rewards, the dynamics-consistency condition across goals, and the future, final and episode strategy question.
2. [HER: relabeling strategies and ablations](https://arxiv.org/abs/1707.01495) (Hindsight Experience Replay) - arXiv:1707.01495v3 Section 3: goal-conditioned setup with the bit-flipping environment and Algorithm 1 relabeling with recomputed rewards; Section 4.5 with Figure 6: final, future, episode and random strategies with future $`k = 4`$ or $`k = 8`$ best.
3. [SB3 tips: Markov assumption and history remedy](https://stable-baselines3.readthedocs.io/en/master/guide/rl_tips.html) (Stable-Baselines3 RL Tips and Tricks) - Tips and Tricks when creating a custom environment: do not break the Markov assumption and supply observation history under delay, plus separate timeout truncation handling (page read 2026-10-14). Depth: Vocabulary only for partial observability. Recurrent policies stay at vocabulary depth in this section; no pool homework trains one.

**Focus**

- A relabeled transition is $`(s \Vert g', a, r', s' \Vert g')`$ with $`r' = r(s, a, g')`$: the goal is substituted and the reward is recomputed, never copied from the original goal.
- Relabeling needs an off-policy algorithm because replayed data comes from a different goal and an older policy than the current one.
- Future relabeling with $`k = 4`$ or $`k = 8`$ goals per transition wins because goals just after the transition stay reachable and informative; random goals from anywhere usually do not.
- Partial observability means the observation alone is not Markov; stacking history restores information but does not guarantee a Markov state, and recurrent policies are only vocabulary here.

**Reproduce:** Closed-book, write one relabeled transition with its recomputed binary reward for a two-step episode. State the four HER strategies and why future with k = 4 wins, plus the dynamics-consistency condition for relabeling across goals.

**Traps**

- Copying the original reward onto the relabeled goal. The reward function runs again under the substituted goal; a failure for the commanded goal is often a success worth 0 for the achieved one.
- Relabeling across tasks with different dynamics. CS224R allows relabeling only where dynamics stay consistent; otherwise the stored transition describes an impossible world.
- Claiming recurrent-policy skill from this section. The pool has no recurrent homework, so history stacking is a baseline and recurrence stays vocabulary.

**Practice**

- The section mini-project covers this: a goal relabeling test on a small sparse-reward task that checks substituted goals with recomputed rewards across final and future strategies, plus a history-stacking baseline on a delayed-observation variant.

**Stop when:** You write a correct relabeled transition with its recomputed reward, rank the four strategies from evidence, and state the history remedy with its limits.

<details>
<summary>Self-test</summary>

1. An episode aimed at goal g ends at state sT. What exactly is stored for a relabeled goal g' = sT?
   - Transitions $`(s \Vert g', a, r', s' \Vert g')`$ with $`r' = r(s, a, g')`$. The transition that reaches sT earns 0 under the binary reward where the original goal gave -1; earlier transitions earn 0 only if they were already within tolerance of g'.
2. Why does HER require an off-policy algorithm?
   - Relabeled transitions come from a different goal and an older behavior policy than the current target policy, so an on-policy update would use the wrong distribution.
3. Which relabeling strategy wins in HER ablations and why?
   - Future with k = 4 or 8. Goals observed just after the transition are reachable and informative; final is good but weaker, episode is mixed, and random is worst.
4. Observations arrive with a one-step delay. What is the first fix and what does it not guarantee?
   - Supply observation history as input. It restores information but does not guarantee a Markov state or match a learned recurrent policy.

</details>

#### U7. Environment, wrapper and version identity, action repeat and normalization

**About 4 h** · **Target:** Implement

Topics: Environment, wrapper and dependency version identity; Action repeat, observation normalization and reward transformation

Wrappers silently change the task: rescaled actions, normalized observations and resolved timeouts all alter what the numbers mean. Identity first, ranking second.

**You can now**

- Record environment, wrapper and dependency versions so a run can be rebuilt exactly.
- Separate termination from truncation and bootstrap only the truncated case.
- Apply action repeat, observation normalization and reward transforms as declared wrappers, never silent edits.

**Study**

1. [Gymnasium time limits: termination versus truncation](https://gymnasium.farama.org/tutorials/gymnasium_basics/handling_time_limits/) (Gymnasium documentation: API, time limits, vector envs and wrappers) - Sections Termination, Truncation and Importance in learning code: terminal states end the MDP while truncation stops it externally, with the rule that termination cuts the bootstrap and truncation keeps it (page read 2026-10-14).
2. [Gymnasium API: Env contract, vector envs and wrappers](https://gymnasium.farama.org/api/env/) (Gymnasium documentation: API, time limits, vector envs and wrappers) - Env `reset` returning obs and info with seed handling and `step` returning obs, reward, terminated, truncated and info. The vector and wrapper pages in the API sidebar cover `SyncVectorEnv` and `AsyncVectorEnv` with `NEXT_STEP` autoreset and the wrappers `TimeLimit`, `RecordEpisodeStatistics`, `ClipAction` and `NormalizeObservation` (page read 2026-10-14).
3. [SB3 tips: custom environments and wrapper hygiene](https://stable-baselines3.readthedocs.io/en/master/guide/rl_tips.html) (Stable-Baselines3 RL Tips and Tricks) - Tips and Tricks when creating a custom environment: normalize observations and rescale continuous actions to [-1, 1], verify with `check_env`, handle timeout truncation separately, and the evaluation warning that wrappers change measured rewards and lengths (page read 2026-10-14).

**Focus**

- `terminated` ends the MDP and `truncated` stops it from outside, and only truncation bootstraps the next value.
- Vector envs default to `NEXT_STEP` autoreset: the done step returns the true final transition, then the next step ignores its action and returns the reset observation with reward 0 and both flags false.
- Gaussian policies start centered at 0 with unit width, so unnormalized action spaces harm learning silently; rescale to $`[-1, 1]`$ inside the recorded wrapper.
- Every wrapper that touches reward, length or observation is part of the env identity: `TimeLimit` length, action repeat, normalization stats and reward transforms all get versioned.

**Reproduce:** Closed-book, write the five-tuple step contract and the bootstrap rule for each end flag. For a 2-env vector run with max steps 5, state which step returns the true final transition and why the following autoreset step with reward 0 must never be stored as a transition.

**Traps**

- Reading `final_observation` on Gymnasium 1.x. Version 1.0 removed that key: same-step mode now writes `final_obs` and `final_info`, and the default next-step mode writes neither, so CleanRL-era code that needs `final_observation` raises `KeyError` at truncation.
- Storing the autoreset step as experience. Its action was ignored and its reward is 0 by construction, so training on it teaches a fake transition.
- Comparing across different wrapper stacks. A normalized versus raw observation run or a different TimeLimit length is a different environment, not a better algorithm.

**Practice**

- The section mini-project covers this: an environment and wrapper manifest with versions, a termination-versus-truncation bootstrap test, and a wrapper-difference control that shows a ranking flip.

**Stop when:** Your manifest rebuilds an env bit-identically, your bootstrap test passes for both end flags, and no comparison you report mixes wrapper stacks.

<details>
<summary>Self-test</summary>

1. An episode ends at the TimeLimit with no terminal state. Do you bootstrap the value target?
   - Yes. Truncation stops the MDP externally, so the value beyond the boundary still matters. Only true termination cuts the bootstrap.
2. A vector step returns done flags true and the next step returns reward 0 with flags false. What happened?
   - NEXT_STEP autoreset. The done step carried the true final transition; the next step reset the sub-env and ignored its action. Do not store the reset step as a transition.
3. Old code reads `infos["final_observation"]` on Gymnasium 1.4 and crashes at truncation. Why?
   - Gymnasium 1.0 removed that key. Same-step mode writes `final_obs` and `final_info` instead, and the installed default, next-step mode, writes neither because the final observation arrives on the done step itself. Port the code to the mode it runs in.
4. Two SAC runs differ only in that one normalizes observations. Can you rank the algorithms from them?
   - No. Normalization changes the task interface, so the runs measure different setups. Match the full wrapper stack first, then compare.

</details>

#### U8. Evaluation policies and seeds, episodes and environments as uncertainty units

**About 3 h** · **Target:** Explain + Measure

Topics: Training versus deterministic or stochastic evaluation policy; Seed, episode and environment as uncertainty units

Training noise makes every policy look better on its own rollout data. Honest evaluation needs a clean policy, a clean env and enough runs to see the spread.

**You can now**

- Separate the noisy training policy from the evaluation policy with its own env and seed stream.
- Name seeds, episodes and environments as distinct uncertainty units and say what each one varies.
- Explain why point estimates from a few runs mislead and what replaces them.

**Study**

1. [SB3 tips: how to evaluate an RL algorithm](https://stable-baselines3.readthedocs.io/en/master/guide/rl_tips.html) (Stable-Baselines3 RL Tips and Tricks) - How to evaluate an RL algorithm: separate test env with `EvalCallback` over 5 to 20 episodes, `deterministic=True` predict for stochastic policies, several seeds for quantitative results, and the wrapper warning with the `Monitor` note (page read 2026-10-14).
2. [Precipice paper: why point estimates fail](https://arxiv.org/abs/2108.13264) (Deep Reinforcement Learning at the Edge of the Statistical Precipice) - arXiv:2108.13264v4 Sections 1 to 3: unreliable point estimates, the Atari 100k case study with median uncertainty even at 50 runs, and the call for interval estimates over point scores.

**Focus**

- Evaluate on a separate test env, never on training rollouts: training actions carry exploration noise, so training return understates or misstates the policy.
- Deterministic eval usually scores higher for stochastic policies but it is a different policy; report which mode produced each number.
- Seeds vary initialization and sampling, episodes vary trajectory noise under one policy, and environments vary the task itself: resampling the wrong unit answers the wrong question.
- Training curves proxy progress but underestimate the agent; periodic clean evaluation with $`n`$ between 5 and 20 episodes is the estimate to trust.

**Reproduce:** Closed-book, write the evaluation protocol: separate test env, `EvalCallback` cadence, deterministic flag stated, several seeds, wrapper-matched. Explain in two sentences why a median over 3 runs can still mislead, using the precipice case study.

**Traps**

- Evaluating without a Monitor wrapper and quoting the numbers. SB3 warns unwrapped eval envs misreport lengths and rewards; the warning is the lesson.
- Mixing stochastic and deterministic eval numbers across methods. Pick one mode per comparison or report both with labels.
- Treating episodes as seeds. More episodes shrink trajectory noise for one policy; only more seeds show sensitivity to initialization and sampling luck.

**Practice**

- The section mini-project covers this: a versioned eval harness with separate seed streams, deterministic and stochastic eval modes, and per-run records that feed the IQM unit.

**Stop when:** Your eval harness runs a labeled deterministic protocol on a separate env across seeds, and you can explain what each uncertainty unit varies.

<details>
<summary>Self-test</summary>

1. Why must evaluation use a separate test env instead of training rollouts?
   - Training rollouts use exploration noise and evolving behavior, so their returns do not estimate any fixed policy. A separate env with a fixed eval policy measures what the agent actually learned.
2. Deterministic eval scores higher than stochastic eval on the same weights. Which number do you report?
   - The one matching your claim, labeled. Deterministic mode is a different policy; report the mode with the number and keep it fixed across methods.
3. Three seeds give means 100, 200 and 900. What is wrong with reporting the mean?
   - One lucky run dominates and the spread is hidden. Report per-run records with a robust aggregate and interval, and keep the outlier in the data.
4. What changes when you add episodes versus adding seeds?
   - Episodes reduce trajectory noise for fixed policies; seeds reveal sensitivity to initialization and sampling. They are different uncertainty units.

</details>

#### U9. Interquartile mean, performance profiles and stratified bootstrap intervals

**About 3 h** · **Target:** Derive + Measure

Topics: Interquartile mean, performance profiles and stratified bootstrap

A few lucky runs can make any method look best. IQM plus profiles plus stratified intervals show the whole distribution instead of the luckiest point.

**You can now**

- Compute the interquartile mean as a 25 percent trimmed mean across all runs.
- Read and build performance profiles as score distributions over thresholds.
- Report stratified bootstrap intervals with the correct resampling unit and CI layout.

**Study**

1. [Precipice paper: stratified bootstrap, profiles and IQM](https://arxiv.org/abs/2108.13264) (Deep Reinforcement Learning at the Edge of the Statistical Precipice) - arXiv:2108.13264v4 Section 4.1: stratified bootstrap resampling runs independently per task; Section 4.2: performance profiles as run-score distributions over thresholds with bootstrap bands; Section 4.3: IQM as the 25 percent trimmed mean with Figures 6 to 7.
2. [rliable: `aggregate_iqm`, interval estimates and profiles](https://github.com/google-research/rliable) (rliable) - `rliable/metrics.py`: `aggregate_iqm` with `trim_mean` `proportiontocut=0.25` and `probability_of_improvement`; `rliable/library.py`: `get_interval_estimates` returning point estimates then interval arrays of shape (2, ...) with row 0 lower and row 1 upper, and `create_performance_profile` over `tau_list` with `use_score_distribution`.

**Focus**

- IQM discards the bottom and top 25 percent of all runs and means the rest: for scores 0 to 7 it is 3.5, the mean of 2, 3, 4 and 5.
- A profile value at $`\tau`$ is the fraction of runs scoring above $`\tau`$; higher curves are better and crossing curves mean the ranking depends on the threshold.
- Stratified bootstrap resamples runs independently within each task, which respects the runs-times-tasks structure instead of pooling everything.
- Report the aggregate with its interval and keep the per-run data: the interval is the result, not decoration on a point estimate.

**Reproduce:** Closed-book, compute IQM of 0 to 7 as 3.5 and a profile value for a tiny score set at one threshold. Write the rliable call to `get_interval_estimates` from memory, unpacking as point then interval with a seed, and state the CI row layout.

**Traps**

- Unpacking the interval call backwards. It returns point estimates first and intervals second; the docstring example also writes `metrics.aggregate_IQM`, which does not exist, so call `metrics.aggregate_iqm` exactly.
- Reading CI rows swapped. Row 0 is the lower bound and row 1 the upper; swapped rows print nonsense like (0.449, 0.445).
- Averaging task means before profiling. Score distributions across all runs carry less uncertainty than average-score distributions; the library defaults to score distributions for this reason.

**Practice**

- [rliable test suite: metrics and library tests](https://github.com/google-research/rliable/blob/3ccd9f4dea577a04d3d2b557f259aac08badbd81/tests/rliable/library_test.py) - `tests/rliable/metrics_test.py` `test_aggregate_metrics` and `tests/rliable/library_test.py` `test_stratified_bootstrap`, `test_performance_profiles` and `test_improvement_probability_cis`; then compute IQM, profiles and stratified intervals on your own run records. Runs on CPU. Install with `pandas<3`, because `arch` fails to import under pandas 3; the named tests pass with pandas 2.2.3 on Python 3.13 and pandas 2.3.3 on Python 3.14 (checked 2026-10-14). Unpack as point then interval; row 0 is lower, row 1 upper.

**Stop when:** The rliable tests pass and your own run records produce an IQM with interval plus a profile with bands, all regenerated from retained per-run data.

<details>
<summary>Self-test</summary>

1. Scores 0 to 7 across runs. What is the IQM?
   - 3.5. Drop the bottom two and top two values 0, 1, 6, 7 and mean the remaining 2, 3, 4, 5.
2. A profile shows 0.1 for A and 0.5 for B at threshold 0.6. What does that say?
   - Half of B runs beat 0.6 against a tenth of A runs. It compares full distributions at that threshold, not just centers.
3. Why resample runs independently per task instead of pooling all scores?
   - Tasks have different scales and difficulties. Stratification keeps each task represented and stops an easy task from dominating the interval.
4. Two curves cross in a performance profile. Which method is better?
   - Neither uniformly. Each wins on some threshold range; report IQM with intervals plus the profiles instead of picking one threshold.

</details>

#### U10. Matched interaction and compute budgets, tuning budgets and final-evaluation isolation

**About 4 h** · **Target:** Measure

Topics: Matched environment-step, update, wall-time and compute budgets; Hyperparameter tuning budget and final-evaluation isolation

Unequal tuning or hidden compute decides more comparisons than ideas do. Matched budgets plus isolated finals separate the algorithm from the effort behind it.

**You can now**

- Fix matched environment-step, update, wall-time and compute budgets before comparing two methods.
- Give every method the same tuning budget and keep final evaluation isolated from tuning.
- Explain why code-level choices such as normalization can beat algorithm choice under sloppy protocols.

**Study**

1. [What Matters in On-Policy RL: budgets and code-level choices](https://arxiv.org/abs/2006.05990) (What Matters in On-Policy Reinforcement Learning? A Large-Scale Empirical Study) - arXiv:2006.05990v1 Sections 2 to 3 with Appendix B: numbered design choices C1 and following, observation and value normalization with clipping, advantage estimation and training setup sweeps. Section 2 scores each configuration by the median of 3 seeds and compares choices by the 95th percentile over sampled configurations, roughly a random search over 20 configurations; use it to fix one tuning budget for every method.
2. [Precipice paper: isolation and per-run retention](https://arxiv.org/abs/2108.13264) (Deep Reinforcement Learning at the Edge of the Statistical Precipice) - arXiv:2108.13264v4 Appendix A.4 on non-standard maximum-based protocols and Section 4 recommendations: isolate final evaluation from selection and retain per-run data behind every aggregate.
3. [SB3 tips: zoo hyperparameters and tuning practice](https://stable-baselines3.readthedocs.io/en/master/guide/rl_tips.html) (Stable-Baselines3 RL Tips and Tricks) - General advice: take tuned hyperparameters from the RL zoo, run automatic hyperparameter optimization for new problems, raise the training budget for better performance, and expect seed variance across several runs (page read 2026-10-14).

**Focus**

- A budget has four counters: environment steps, gradient updates, wall time and compute; matching one while freeing the others still rigs the race.
- Tuning budget covers configs tried, seeds per config and selection rule; the final number comes from held-out seeds after selection, never from the tuning table.
- Normalization and setup choices move results as much as algorithm swaps: observation normalization is close to mandatory, value normalization helps on some tasks and hurts on Walker2d, and per-minibatch advantage normalization barely matters.
- Score each config by its median over seeds, as What Matters does over 3 seeds, and compare choices under one fixed tuning budget; a single best cell measures search luck plus method.

**Reproduce:** Closed-book, write a four-counter budget table for a two-method comparison with a fixed tuning allowance per method and an isolated final seed set. Explain why scoring each config by its median over seeds under a fixed tuning budget beats scoring by the best cell.

**Traps**

- Tuning the new method and borrowing defaults for the baseline. What Matters finds settings such as $`\gamma`$ and value normalization need per-environment tuning, so each side gets the same search or the comparison is void.
- Reporting tuned wall time against untuned sample counts. Faster code with more updates is a compute win, not an algorithmic one, unless updates and time are both matched.
- Peeking at the test seeds during tuning. Selection on final seeds leaks them into training; lock tuning seeds, then evaluate once on fresh ones.

**Practice**

- The section mini-project covers this: a two-method comparison with a written four-counter budget, one tuning allowance per method, median-over-seeds scoring, and an isolated final seed set.

**Stop when:** Your comparison sheet shows four matched counters, one tuning budget per method, median-over-seeds scoring and a fresh final seed set with no peeking.

<details>
<summary>Self-test</summary>

1. Method A uses 1M steps and 100 updates while B uses 1M steps and 1000 updates. Matched?
   - No. Environment steps match but updates, wall time and compute do not. Match all four counters or label the difference as the treatment.
2. You try 20 configs for your method and 1 for the baseline, then compare best cells. What is wrong?
   - Search effort differs and best-cell scoring rewards luck. Fix one config budget per method, score each config by its median over seeds, and evaluate the picked configs on fresh seeds.
3. Observation normalization lifts both methods equally. Keep it or drop it for fairness?
   - Keep it matched on both sides and record it. Fairness means identical setup budgets, not removing a shared win.
4. When may final seeds be inspected?
   - Once, after all tuning and selection freeze. Any earlier look turns them into tuning seeds and a new isolated set is needed.

</details>

#### U11. Checkpoint selection, all-attempt retention and vectorized-environment throughput

**About 3 h** · **Target:** Measure

Topics: Checkpoint selection and all-attempt retention; Vectorized-environment throughput and correlation

Best-checkpoint tables and silent throughput tricks both inflate wins. Retention plus correct vector handling keeps speed and selection honest.

**You can now**

- State a checkpoint rule in advance and retain every attempt including failures.
- Run vectorized envs without training on autoreset artifacts or correlated illusions.
- Report throughput with the hardware and version named so steps per second means something.

**Study**

1. [Precipice paper: maximum-based protocols and retention](https://arxiv.org/abs/2108.13264) (Deep Reinforcement Learning at the Edge of the Statistical Precipice) - arXiv:2108.13264v4 Appendix A.4 on non-standard evaluation protocols involving maximum values: report final or fixed-checkpoint performance with all attempts retained instead of column maxima.
2. [Gymnasium vector envs and autoreset modes](https://gymnasium.farama.org/api/vector/) (Gymnasium documentation: API, time limits, vector envs and wrappers) - Autoreset paragraph and the `step()` note: next-step autoreset is the default, recorded in `metadata["autoreset_mode"]`, and a sub-environment resets on the step after it ends. The page does not state the reset step's reward or flags; on Gymnasium 1.4.0 it returns reward 0 with both flags false, so check your version and never store that step as a transition (page read 2026-10-14).
3. [SB3 tips: parallel training and throughput pointers](https://stable-baselines3.readthedocs.io/en/master/guide/rl_tips.html) (Stable-Baselines3 RL Tips and Tricks) - Which algorithm should I use: lean to A2C and derivatives when wall time matters with vectorized envs, plus the SBX faster-training pointer and the separate-test-env rule for throughput claims (page read 2026-10-14). Depth: Pointers only. Speedup factors are author reports on their setups; your number is steps per second on your machine with versions named.

**Focus**

- Fix the checkpoint rule before training: final weights, fixed cadence, or a validation protocol, and keep every run including crashes and divergences.
- Column maxima over checkpoints or seeds measure selection luck; profiles and IQM over retained runs measure the method.
- Vector envs raise throughput but batch steps share one policy version, so samples correlate; more envs is not more seeds.
- The autoreset step is overhead, not data: with NEXT_STEP it carries reward 0 and a reset observation for an ignored action.

**Reproduce:** Closed-book, write a checkpoint rule with a retention list, then sketch the two-step done-then-autoreset sequence with rewards and flags. Explain why doubling envs does not double independent evidence.

**Traps**

- Reporting the best checkpoint per seed as the method score. That selects luck per column; report the fixed rule and show the full profile.
- Deleting failed runs as broken setups. Failures carry information about stability and tuning cost; retention is the unit standard.
- Quoting steps per second without versions or hardware. Throughput needs env, vector mode, library versions and machine before it compares.

**Practice**

- The section mini-project covers this: a fixed checkpoint rule with all attempts retained, vectorized collection with autoreset handling, and a throughput note naming hardware and versions.

**Stop when:** Every run you started is retained under a fixed checkpoint rule, and your vector logs separate true transitions from autoreset overhead.

<details>
<summary>Self-test</summary>

1. Three seeds peak at episodes 100, 500 and 900. You report the three peaks as the result. What is wrong?
   - Each peak selects luck independently. Report a fixed checkpoint rule across seeds with all runs retained, plus profiles over the full data.
2. A vector run shows reward 0 with cleared flags right after a done step. Data or overhead?
   - Overhead. That is the NEXT_STEP autoreset returning the reset observation for an ignored action. Never store it as a transition.
3. 16 envs collect 16 times the steps per second. Do you have 16 times the evidence?
   - No. Steps share one policy version and correlate, and env count is not seed count. Throughput rises while independent evidence grows slower.

</details>

#### U12. Generalization across seeds, starts, dynamics and observation shifts

**About 3 h** · **Target:** Measure

Topics: Generalization across seeds, starts, dynamics and observation shifts

Training-env wins often die on the next seed, start or sensor. A shift battery turns a demo into a claim about what actually transferred.

**You can now**

- Test a policy across seeds, start states, dynamics changes and observation shifts with one factor varied at a time.
- Distinguish a learned improvement from simulation-only or representation-only luck.
- State the deployment boundary: where the evidence stops and retraining triggers start.

**Study**

1. [CS234 Lecture 12: generalization and optimism](https://web.stanford.edu/class/cs234/slides/lecture12pre.pdf) (Stanford CS234 Winter 2026 - Bandits and Exploration) - Lecture 12 generalization slides: optimism with large state and action spaces, Thompson sampling over representations, and the limits where generalization helps or fails.
2. [Precipice paper: re-evaluation across benchmarks](https://arxiv.org/abs/2108.13264) (Deep Reinforcement Learning at the Edge of the Statistical Precipice) - arXiv:2108.13264v4 Section 5: re-evaluated benchmark results across tasks with robust aggregates, showing how rankings move when tasks and runs change.
3. [SB3 tips: simulation limits and custom-env robustness](https://stable-baselines3.readthedocs.io/en/master/guide/rl_tips.html) (Stable-Baselines3 RL Tips and Tricks) - Current Limitations of RL: sample inefficiency with simulation-only successes such as the ANYmal example, plus the custom-environment advice on Markov structure and timeout handling (page read 2026-10-14). Depth: Use the sim-to-real gap as a caution with one controlled shift test locally; no hardware claims belong in this section.

**Focus**

- Vary one factor at a time: new seeds, new starts, perturbed dynamics, then observation shifts such as noise or delay.
- Simulation success is not transfer evidence: the ANYmal-style result trains in simulation and tests in reality, and this section stops at controlled local shifts.
- Rankings move across tasks, so a method that wins one env needs profiles and IQM across the battery before any general claim.
- Write the boundary down: which shifts were tested, which failed, and which observation change triggers retraining rather than trust.

**Reproduce:** Closed-book, sketch a four-row shift battery with the factor, the control, and the metric per row. Explain why a single-env win plus a sim-only video does not establish generalization.

**Traps**

- Varying everything at once. A joint shift that fails says nothing about which factor broke; isolate seeds, starts, dynamics and observations separately.
- Treating representation generalization as policy generalization. An encoder that survives pixel noise has not shown robustness to dynamics or start changes.
- Promising sim-to-real transfer from local shifts. Controlled perturbations bound local robustness; hardware needs its own evaluation outside this section.

**Practice**

- The section mini-project covers this: a four-factor shift battery with isolated factors, retained failures, and a written deployment boundary with retraining triggers.

**Stop when:** Your shift battery varies one factor per row with failures kept, and you can state exactly where the transfer claim stops.

<details>
<summary>Self-test</summary>

1. A policy wins on 5 training seeds but fails on 5 fresh seeds. What failed?
   - Seed generalization. The method overfit initialization and sampling luck; report intervals over more seeds instead of the training five.
2. The same policy fails from new starts but passes new seeds. What does that isolate?
   - Start-state coverage, not optimizer luck. The fix is broader start distributions or exploration, not more seeds on the same starts.
3. Pixel noise is added and performance holds, so the team claims dynamics robustness. Valid?
   - No. Observation robustness does not imply dynamics robustness. Test dynamics perturbations separately before that claim.
4. What belongs in the deployment boundary statement?
   - Tested shifts with results, untested shifts named as such, failure cases kept, and the observation or dynamics change that triggers retraining.

</details>

### Mini-project: Exploration bonuses with honest multi-seed evaluation

**About 12 to 16 hours.** Extend `policylab` with exploration bonuses and a hardened evaluation harness over small bandit, grid and sparse-goal tasks. Compare optimistic, count-based and predictor-error methods under matched budgets with robust aggregates. Every claim keeps per-run records, tuning isolation and a shift battery behind it.

1. Build small bandit and grid tasks in `envs/` with an `oracles/` regret reference, then compare $`\epsilon`$-greedy against UCB under matched interaction budgets, reporting counts, gaps and regret across seeds.
2. Add a tabular count bonus and its pseudocount form plus an RND-style predictor-error bonus in `deep/`, checking each against a hand-derived reward mix and scoring extrinsic reward only with a noisy distractor cell present.
3. Log visitation and success coverage on a sparse task in `eval/`, compare shaped against sparse rewards with the success rule fixed, and complete a fairness checklist covering interaction counts, information access and tuning effort.
4. Test goal relabeling on a small sparse-reward task with substituted goals and recomputed rewards across final and future strategies, and add a history-stacking baseline on a delayed-observation variant.
5. Record a versioned environment and wrapper manifest in `envs/`, prove termination-versus-truncation bootstrapping with a dedicated test, and keep a wrapper-difference control that flips a ranking.
6. Build a versioned `eval/` harness with separate seed streams and deterministic plus stochastic modes, retain every attempt under a fixed checkpoint rule, mask vector autoreset steps, write a throughput note naming hardware and versions, and pass the rliable tests before reporting robust aggregates.
7. Compare two methods under a written four-counter budget in `ledger/` with one tuning allowance each, median-over-seeds scoring and an isolated final seed set, then run a four-factor shift battery with failures retained and a deployment boundary naming retraining triggers.

**Deliverables**

- Bonus and relabeling suite in `envs/`, `deep/` and `oracles/` with manifests and bootstrap tests.
- Versioned `eval/` harness with per-run records, rliable aggregates and the throughput note.
- Matched-budget comparison, shift battery and deployment boundary with all failures retained.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [rliable test suite: metrics and library tests](https://github.com/google-research/rliable/blob/3ccd9f4dea577a04d3d2b557f259aac08badbd81/tests/rliable/library_test.py). Pass the named tests on CPU, then compute aggregates on retained run records.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Optimism comparison | $`\epsilon`$-greedy and UCB runs share matched budgets with counts, gaps and regret across seeds, and manifests rebuild the tasks. | A wrapper-difference control flips a ranking, and the bootstrap test separates termination from truncation. |
| Bonus discipline | Count, pseudocount and predictor-error bonuses match hand-derived mixes, and task scores use extrinsic reward only. | A noisy distractor cell shows the bonus decaying with visits while extrinsic success stays reported apart. |
| Coverage honesty | Visitation and success coverage sit beside return, the shaped-versus-sparse run fixes its success rule, and relabeling recomputes rewards. | Future and final relabeling are ranked from evidence, and the history baseline names what recurrence would still add. |
| Robust reporting | The harness keeps per-run records with isolated finals, rliable aggregates carry intervals, and every attempt is retained. | Profiles with bands plus a shift battery defend the boundary, with retraining triggers written down. |

Feeds into: `deep/` bonuses, `envs/` tasks, `eval/` harness and `ledger/` budgets feed offline, model-based and language-policy projects and the capstone.

### Resource route

- **Primary - Course:** [Berkeley CS 185/285 Deep Reinforcement Learning (Spring 2026) - Exploration and Off-Policy Actor-Critic](https://rail.eecs.berkeley.edu/deeprlcourse/) - Slides are public at https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-N.pdf; current videos are not, and the public Fall 2023 playlist numbers lectures differently. Study Lecture 19 (exploration) and Lecture 23 (advanced exploration), and the SAC part of Homework 3 (`src/agents/sac_agent.py` on InvertedPendulum and Hopper; HalfCheetah needs hours on a GPU). The homework pins `gym==0.25.2`, which fails on NumPy 2, so port it to Gymnasium (`terminated` and `truncated`) or pin `numpy<2` in its own environment, and turn off its forced WandB logging. 
- **Required - Course:** [Stanford CS234 Winter 2026 - Bandits and Exploration](https://web.stanford.edu/class/cs234/modules.html) - Study Lectures 9 to 12 (bandits, optimism and upper confidence bounds, exploration in MDPs). Rebuild one exploration comparison with matched information, interaction, update and tuning budgets.
- **Required - Course:** [Stanford CS224R Spring 2026 - Off-Policy and Goal-Conditioned RL](https://cs224r.stanford.edu/) - Study Lecture 05 (off-policy actor-critic) and Lecture 12 (multi-task and goal-conditioned RL) and their DDPG and HER readings. Implement one goal relabeling test on a small task.
- **Required - Paper:** [Soft Actor-Critic Algorithms and Applications](https://arxiv.org/abs/1812.05905) - Read the maximum-entropy objective, the soft policy iteration and the actor and critic targets, then the automatic temperature adjustment (this version adds it; the first SAC paper used a fixed temperature). Implement or audit a compact SAC path and compare sample efficiency and wall time with PPO under a matched protocol.
- **Required - Paper:** [Addressing Function Approximation Error in Actor-Critic Methods (TD3)](https://arxiv.org/abs/1802.09477) - Read the overestimation analysis for actor-critic methods, clipped double Q-learning, delayed policy updates and target policy smoothing. Ablate one of the three changes on a small continuous task with matched seeds.
- **Required - Paper:** [Hindsight Experience Replay](https://arxiv.org/abs/1707.01495) - Read the goal-conditioned setup and the relabeling strategies (final, future, episode). Implement relabeling on a sparse-reward bit-flipping or goal task and test that relabeled transitions carry the substituted goal and its recomputed reward.
- **Support - Paper:** [Exploration by Random Network Distillation](https://arxiv.org/abs/1810.12894) - Read the prediction-error bonus, the separate intrinsic and extrinsic value heads and the non-episodic intrinsic return. Use it to explain why a novelty bonus depends on the representation and how it can reward noise.
- **Support - Paper:** [Unifying Count-Based Exploration and Intrinsic Motivation](https://arxiv.org/abs/1606.01868) - Read the pseudocount derivation from a density model and the exploration bonus built on it. Compare a tabular count bonus with its pseudocount form on a small grid.
- **Required - Paper:** [Deep Reinforcement Learning at the Edge of the Statistical Precipice](https://arxiv.org/abs/2108.13264) - Study the failure of common point estimates and small-seed comparisons. Report interval estimates, aggregate-score sensitivity and performance profiles with the underlying per-run data retained.
- **Support - Paper:** [What Matters in On-Policy Reinforcement Learning? A Large-Scale Empirical Study](https://arxiv.org/abs/2006.05990) - Read the experimental protocol and the recommendations on normalization, initialization and hyperparameter sensitivity. Use it to set a tuning budget that is the same for every method you compare.
- **Support - Implementation:** [rliable](https://github.com/google-research/rliable) - Use the official repository to compute interquartile means, stratified bootstrap intervals and performance profiles for the track experiments. Verify the input run and task axes and keep plots reproducible from raw run records; check the pandas version it needs in your environment.
- **Support - Tutorial:** [Hands-on Modern RL - DDPG, TD3, SAC and Intrinsic Motivation](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter11_continuous_control/td3-sac) - Use the DDPG and TD3 and SAC pages for vocabulary and the intrinsic-motivation page for concepts only. Its displayed TD3 target omits the terminal mask (the code has it), its SAC chart is author-reported, and its multi-agent demo does not learn; do not use those as practice. Pin commit 9231bab of walkinglabs/hands-on-modern-rl; its `code/chapterNN` folders do not follow the site chapter numbers.
- **Reference - Reference:** [Gymnasium documentation: API, time limits, vector envs and wrappers](https://gymnasium.farama.org/) - Use the Env API page for the reset and step contract, the handling-time-limits tutorial for termination versus truncation bootstrapping, the vector env pages for SyncVectorEnv and AsyncVectorEnv autoreset modes, and the wrappers table for RecordEpisodeStatistics, ClipAction, NormalizeObservation and TimeLimit.
- **Reference - Reference:** [Stable-Baselines3 RL Tips and Tricks](https://stable-baselines3.readthedocs.io/en/master/guide/rl_tips.html) - Use How to evaluate an RL algorithm for separate test envs, EvalCallback and deterministic eval; Which algorithm should I use for the discrete/continuous/goal picker and HER pointer; the custom-environment section for Markov, normalization and TimeLimit handling; and the seed-variance and RL-zoo tuning advice. Treat SOTA and speedup claims as pointers, not targets.

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

### Study units

#### U1. Demonstrations, behavior cloning and action likelihoods

**About 4 h** · **Target:** Derive + Implement

Topics: Demonstrations and behavior cloning; Behavior-cloning likelihood and action distributions

Behavior cloning is the baseline every offline method must beat. It needs no reward and no interaction, so its failure modes set the terms for everything later in this section.

**You can now**

- Derive the behavior-cloning likelihood for discrete and continuous actions and implement it from a blank file.
- Choose an action distribution (logits, Gaussian parameters, or an expressive generative head) and defend the choice on multimodal data.
- Build a demonstration baseline with recorded data identity that later offline methods must beat.

**Study**

1. [Lecture 2: Behavioral Cloning, from MLE to the BC algorithm](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-2.pdf) (Berkeley CS 185/285 Deep Reinforcement Learning (Spring 2026) - Imitation and Offline RL) - Part 1, maximum likelihood as supervised learning (PDF pp. 2-8); Part 2, demonstration trajectories and the ALVINN behavior-cloning algorithm (PDF pp. 9-12).
2. [The behavior-cloning objective](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter13_imitation_meta_rl/bc-dagger#_1-1-the-behavior-cloning-objective) (Hands-on Modern RL - Offline RL and Imitation Concepts) - Section 1.1: discrete cross-entropy versus continuous MSE and negative log-likelihood, with the worked p = 0.7 versus p = 0.95 loss example (page read 2026-10-14).
3. [Lecture 02: expressive policy distributions](https://cs224r.stanford.edu/slides/02_cs224r_imitation_2026.pdf) (Stanford CS224R Spring 2026 - Imitation and Offline RL) - PDF pp. 6-21: the mean-of-modes failure of regression, generative policy heads, diffusion and flow matching, action chunking, and the unimodal versus multimodal summary. Depth: Stop before PDF p. 23. Compounding errors and DAgger belong to the next unit.
4. [Lecture 3: action distributions for imitation](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-3.pdf) (Berkeley CS 185/285 Deep Reinforcement Learning (Spring 2026) - Imitation and Offline RL) - PDF pp. 9-16: autoregressive discretization, expressive continuous distributions, flow matching, and action chunking.

**Focus**

- Behavior cloning is maximum likelihood on expert pairs. Discrete actions use logits with cross-entropy; continuous actions use distribution parameters with MSE or negative log-likelihood.
- A single number pins the loss scale: $`-\log 0.7 = 0.357`$ versus $`-\log 0.95 = 0.051`$. Recompute both before trusting any training curve.
- An MSE head predicts the conditional mean. On multimodal demonstrations (two experts, two modes) the mean can be an action no expert took.
- Stanford Homework 1 fixes the control interface: policies predict a chunk of $`20`$ future targets and execute the first $`10`$ before replanning. The loss averages over the chunk; control uses only its head.

**Reproduce:** Closed-book, derive the categorical behavior-cloning gradient from the log policy term, evaluate the two NLL values above, and state which part of a Stanford Homework 1 action chunk the loss sees and which part the rollout executes.

**Traps**

- Reading a falling validation loss as a working policy. Likelihood is measured under the expert state distribution; closed-loop return is measured under the learner's own distribution, and the two can disagree sharply.
- Fitting MSE to multimodal demonstrations and shipping the mean action. Check the action histogram first; a mean between two modes is a new, untested behavior.
- Tuning the chunk length as if it were only a loss detail. It also sets the open-loop execution horizon, so it changes the control problem, not just the gradient.

**Practice**

- [Berkeley CS 285 Homework 1: Imitation Learning (MSE and flow-matching policies)](https://github.com/berkeleydeeprlcourse/homework_spring2026/tree/main/hw1) - Implement `MSEPolicy` and `FlowMatchingPolicy` in `src/hw1_imitation/model.py` plus the loop in `src/hw1_imitation/train.py`; pass thresholds are reward 0.5 (MSE) and 0.7 (flow). Handout: https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw1.pdf. Runs on CPU. Needs a free WandB login. Compare the unimodal MSE policy against the expressive flow policy on multimodal data.

**Stop when:** Your hand NLL values match Python, and your HW1 MSE policy reaches the 0.5 reward threshold with the dataset identity recorded.

<details>
<summary>Self-test</summary>

1. Write the behavior-cloning objective and name the loss for discrete and for continuous unimodal actions.
   - Maximize the expected log probability of expert actions under the data. Discrete: cross-entropy over logits. Continuous unimodal: MSE or Gaussian negative log-likelihood over distribution parameters.
2. A policy assigns probability 0.7 to the expert action on one state and 0.95 on another. What is each negative log-likelihood?
   - 0.357 and 0.051. Higher expert probability means lower loss, and the scale is logarithmic, not linear.
3. Two demonstrators pass an obstacle on opposite sides. What does an MSE behavior-cloning policy do at the obstacle, and why is it wrong?
   - It predicts the mean action, straight at the obstacle, which neither demonstrator took. The fix is an expressive multimodal head such as a mixture, diffusion, or flow-matching policy.
4. Stanford Homework 1 uses an action chunk of 20 with 10 executed steps. What does the policy output, and what does the rollout use?
   - It outputs 20 future target positions and executes the first 10 open-loop before re-querying the policy. This receding-horizon control separates the loss horizon from the execution horizon.

</details>

#### U2. Covariate shift, compounding imitation error and DAgger

**About 4 h** · **Target:** Derive + Implement

Topics: Covariate shift and compounding imitation error; Interactive data aggregation and DAgger vocabulary

A 1 percent mistake rate sounds safe until the horizon multiplies it. This unit makes the horizon dependence quantitative and shows what only an interactive expert can fix.

**You can now**

- Derive the quadratic compounding bound for offline imitation and the linear bound with interactive queries.
- Run the DAgger loop (roll out learner, label visited states with the expert, aggregate, retrain) and state exactly what the extra queries change.
- Tell covariate shift apart from causal confusion and from fixed-dataset offline limits.

**Study**

1. [Lecture 2: how bad covariate shift can be, then DAgger](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-2.pdf) (Berkeley CS 185/285 Deep Reinforcement Learning (Spring 2026) - Imitation and Offline RL) - Part 4, the mistake analysis with the quadratic horizon dependence (PDF pp. 23-32); Part 5, DAgger dataset aggregation and the common-variant question (PDF pp. 33-38).
2. [DAgger: the reduction and the aggregation loop](https://proceedings.mlr.press/v15/ross11a.html) (DAgger) - Sections 1-3: the supervised T-squared mistake argument, forward training with Theorem 2.2, SMILe mixing, and the Section 3 dataset-aggregation loop that trains a stationary deterministic policy.
3. [Lecture 02: compounding errors and interventions](https://cs224r.stanford.edu/slides/02_cs224r_imitation_2026.pdf) (Stanford CS224R Spring 2026 - Imitation and Offline RL) - PDF pp. 23-26: the covariate-shift diagram, the corrective-data loop (dataset aggregation), and human-gated DAgger. Depth: Use pp. 7-22 only as background from the previous unit. The examinable material here is pp. 23-26.
4. [Why cloning errors compound, and the DAgger fix](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter13_imitation_meta_rl/bc-dagger#_2-why-behavior-cloning-errors-compound) (Hands-on Modern RL - Offline RL and Imitation Concepts) - Sections 2 and 3: the error-rate table (1 percent error at horizons 10, 50, 100, 1000) and the mixing schedule with expert relabeling of policy-visited states (page read 2026-10-14).

**Focus**

- The arithmetic first: at 1 percent error per step, clean-run probability is $`0.99^{10} = 0.90`$ but $`0.99^{100} = 0.37`$ and $`0.99^{1000} = 0.00004`$. Recompute all three.
- The bound behind it: offline cloning pays up to $`O(T^2 \epsilon)`$, because one off-distribution step can cost the rest of the horizon; labeling the learner's own visited states cuts it to $`O(T \epsilon)`$.
- DAgger aggregates policy-visited states with expert labels and retrains on the union. The load-bearing ingredient is the expert label on the learner's distribution, not the extra states alone.
- DAgger needs an interactive expert, so it does not apply to a fixed offline dataset. Causal confusion is a separate failure: Berkeley Lecture 3 asks whether history or DAgger mitigates it, citing de Haan et al., who find that more input information can make cloning worse and resolve it with targeted interventions.

**Reproduce:** Closed-book, compute the three clean-run probabilities above, state both bounds with the one-step-leaves-distribution intuition, and write the four DAgger steps (roll out learner, query expert on visited states, aggregate, retrain).

**Traps**

- Believing more clean demonstrations remove the quadratic term. They shrink the per-step rate but the horizon dependence stays; recoveries in the data (the Lecture 2 paradox) can help more than extra clean runs.
- Running the common intervention variant (the human takes over at some step and only the takeover data is stored) and quoting the DAgger guarantee. Labels then cover the takeover states and what the human drives afterwards, not every state the learner visits; Lecture 2 poses exactly this question.
- Treating DAgger as an offline algorithm. It needs an interactive expert during training; with only a fixed dataset you are back in the offline regime of the next units.

**Practice**

- [Stanford CS224R Homework 1, Problem 3: DAgger on Flappy Bird](https://cs224r.stanford.edu/material/hw1/CS224R_2026_Homework_1.pdf) - Problem 3: implement `DeterministicExpert.act`, rollout, and relabel in `dagger.py`, retrain with the Problem 1 regression objective, and submit `dagger_hard.txt` against `bc_reg_hard.txt`. Runs on CPU or Colab. Compare hard-mode success before and after aggregation, and state what the expert queries added. Follow the Stanford honor code; generative-model code is banned for this homework.

**Stop when:** Your hand probabilities match Python, and your DAgger run beats your Problem 1 cloning run on hard mode with the query difference written down.

<details>
<summary>Self-test</summary>

1. At 1 percent per-step error, what fraction of length-100 runs stays clean, and why does length-1000 collapse?
   - 0.37 for length 100; 0.00004 for length 1000. Clean probability decays exponentially as 0.99^T, so long horizons need a far smaller per-step rate.
2. State the offline cloning bound and the DAgger bound, and the intuition for the gap.
   - Offline: $`O(T^2 \epsilon)`$; interactive: $`O(T \epsilon)`$. Offline, one mistake can leave the training distribution and cost $`O(T)`$ more mistakes, and there are $`T`$ chances to leave; on-policy labels remove the distribution mismatch.
3. What exactly is added to the dataset at each DAgger iteration?
   - States visited by the current learner policy, each labeled with the expert's action, appended to all previous data. The next policy mimics the expert on the whole aggregate.
4. Demonstrations show braking whenever the dashboard brake indicator is lit, because braking turns it on. Why can a cloned policy brake at the wrong time, and why is this not covariate shift?
   - The indicator is an effect of braking that predicts the expert action almost perfectly, so the policy can key on it instead of the road: causal confusion. More data from the same distribution keeps cue and action together; de Haan et al. resolve it with targeted interventions, environment interaction or expert queries, and compare against DAgger, so do not assume aggregation alone fixes it.

</details>

#### U3. Inverse RL, the reward-learning boundary, GAIL and occupancy matching

**About 4 h** · **Target:** Explain

Topics: Inverse reinforcement learning and reward-learning boundary; GAIL and occupancy-matching vocabulary

Some tasks have demonstrations but no reward function. This unit draws the boundary: what reward learning can identify, and what occupancy matching settles for instead.

**You can now**

- Explain why demonstrations underdetermine the reward and where maximum-entropy IRL pays for its answer.
- State GAIL as occupancy matching (Jensen-Shannon via the discriminator game) and what it recovers instead of a reward.
- Say what GAIL needs that behavior cloning does not, and read its discriminator signs correctly.

**Study**

1. [Inverse RL and GAIL](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter13_imitation_meta_rl/irl-gail#_3-using-gail-to-match-occupancy-distributions-directly) (Hands-on Modern RL - Offline RL and Imitation Concepts) - Sections 1 and 2: the inverse-RL setting, the maximum-entropy distribution over trajectories, and why the partition function is intractable; Section 3: the discriminator-policy alternation and the occupancy-ratio optimum (page read 2026-10-14). Depth: Use the page for the setting and the game structure. Take proposition numbers and the saddle objective from the paper below, not from this pre-reading.
2. [GAIL: occupancy matching and the discriminator game](https://arxiv.org/abs/1606.03476) (Generative Adversarial Imitation Learning) - Sections 3-5 of arXiv:1606.03476v1: the occupancy measure with Propositions 3.1 and 3.2, the Jensen-Shannon matching objective with Equations 15-18, and Algorithm 1 with the TRPO policy step.
3. [Comparing BC, DAgger, and GAIL](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter13_imitation_meta_rl/bc-dagger#_4-comparing-bc-dagger-and-gail) (Hands-on Modern RL - Offline RL and Imitation Concepts) - Section 4: interaction, label, and reward requirements side by side (page read 2026-10-14).

**Focus**

- Inverse RL is underspecified: many rewards, including zero, rationalize the same demonstrations. Maximum entropy selects the trajectory distribution proportional to exponentiated return, but its partition function sums over all trajectories and is intractable.
- GAIL stops asking for a reward and matches occupancy measures instead: the policy whose state-action visitation minimizes Jensen-Shannon divergence to the expert's. What it recovers is a policy, not a transferable reward.
- The paper's saddle (Equation 16) puts the log discriminator term on learner samples and the log one-minus term on expert samples, with policy cost equal to log discriminator output. Other sources flip this labeling, so check which expectation gets which term before reading any discriminator value.
- The 2016 TRPO policy step inside Algorithm 1 is dated machinery. Learn the objective and the alternation; a modern implementation would use a newer policy optimizer.

**Reproduce:** Closed-book, write the occupancy measure, the Equation 16 saddle with each term labeled by its sampling policy, and the one-line reason IRL cannot promise a unique reward.

**Traps**

- Reading a discriminator output of 0.8 as expert-like without checking the labeling. Under the paper's Equation 16, the log term sits on learner samples, so a high value means looks-like-learner; flipped labelings mean the opposite.
- Calling GAIL an offline algorithm. It samples fresh learner trajectories every iteration (Algorithm 1, line 3), so it needs environment interaction that fixed-dataset methods do not have.
- Expecting the learned discriminator to serve as a reward for new tasks. It is a local cost tied to this expert and this training run, not an identified reward function.

**Practice**

- The section mini-project covers this: a discriminator-versus-occupancy check that trains a classifier on expert-versus-learner pairs from logged data, reports its optimum under the stated labeling, and states the online rollouts GAIL would still need beyond the offline data.

**Stop when:** You can write the occupancy definition and the saddle from memory with correct term labels, and state in one sentence each what IRL cannot identify and what interaction GAIL requires.

<details>
<summary>Self-test</summary>

1. Why can inverse RL never promise the true reward, even with infinite demonstrations?
   - Demonstrations constrain behavior, not reward: many rewards produce the same optimal policy. Maximum entropy picks one by an entropy criterion, and its partition function is intractable, so approximations choose further.
2. In the paper's Equation 16, which samples does the log discriminator term average over, and what does a high discriminator value mean?
   - Learner-policy samples average the log term; expert samples average the log one-minus term. High means the pair looks like the learner under this labeling, the reverse of pages that put the expert under the log term.
3. What does GAIL need that behavior cloning does not, and what does it recover instead of a reward?
   - Environment interaction for fresh learner rollouts plus expert samples each iteration. It recovers an imitator policy whose occupancy matches the expert's, not a reward function.
4. Is the TRPO step load-bearing for the GAIL idea?
   - No. The idea is the occupancy-matching objective and the discriminator game. TRPO is the 2016 optimizer; the objective survives a change of policy optimizer.

</details>

#### U4. Offline datasets, behavior-policy identity, coverage and quality sweeps

**About 4 h** · **Target:** Measure

Topics: Offline transition datasets and behavior-policy identity; Dataset coverage, support and action gaps; Dataset quality, diversity and coverage sweeps

Offline data cannot be repaired by interaction. Coverage and identity decide what any later algorithm is allowed to conclude, so this unit builds the dataset discipline first.

**You can now**

- Record behavior-policy identity (dataset id, version, collection policy) with every offline result.
- Diagnose coverage and support gaps, including counterfactual queries the data cannot answer.
- Run quality, diversity, and coverage sweeps that compare cloning against an offline RL method with online truth reserved for audit.

**Study**

1. [What offline RL is and why it is hard](https://arxiv.org/abs/2005.01643) (Offline Reinforcement Learning: Tutorial, Review and Perspectives) - Sections 2.2 and 2.4 of arXiv:2005.01643v3: the offline problem statement with the behavior policy, then distributional shift named as the fundamental challenge.
2. [Lecture 17: counterfactual queries and the SAC overestimation demo](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-17.pdf) (Berkeley CS 185/285 Deep Reinforcement Learning (Spring 2026) - Imitation and Offline RL) - PDF pp. 10-11: training data versus what the policy wants to do, with unseen actions as the counterfactual question; PDF p. 17: the soft actor-critic demo where predicted values exceed achieved returns on a log scale; PDF p. 18: why online sampling error becomes worse offline.
3. [Minari dataset standards and one versioned dataset](https://minari.farama.org/content/dataset_standards/) (Minari Offline Datasets) - Dataset Standards: episode and step data, spaces, and versioning; then open one hosted set such as https://minari.farama.org/datasets/mujoco/invertedpendulum/expert-v0/ and record its id, version, episode and step counts, and action bounds (pages read 2026-10-14).
4. [Lecture 07: the offline process and the behavior policy](https://cs224r.stanford.edu/slides/07_cs224r_offline_rl_2026.pdf) (Stanford CS224R Spring 2026 - Imitation and Offline RL) - PDF pp. 7-9: training on a static dataset sampled from an unknown behavior policy that may mix human, scripted, and prior-RL sources. Depth: Read pp. 7-9 only here. Stitching and the method ideas belong to later units.

**Focus**

- The behavior policy may be a mixture (human plus scripted plus prior runs) and is often unknown. Record the dataset id and version with every result; a result without them is not reproducible.
- A counterfactual query asks the value of an action never taken in that state. Online methods answer by trying it; offline methods must flag it, constrain around it, or admit they cannot answer.
- Expert data is narrow by construction. Medium or diverse data often trains better offline policies because coverage and stitching matter more than demonstration quality.
- Design sweeps as dataset variant by algorithm: at least two dataset types (for example expert versus medium) crossed with cloning versus one offline RL method, with online returns reserved for audit only.

**Reproduce:** Closed-book, fetch one Minari dataset record and write down its id, version, episode and step counts, and action bounds; then sketch the variant-by-algorithm sweep table with the audit-only column marked.

**Traps**

- Equating more transitions with more coverage. Ten million steps from one deterministic policy cover one thin manifold; diversity of behavior is the coverage, not the row count.
- Downloading a dataset without its version and calling the experiment reproducible. Hosted sets are versioned because their contents change; the id alone does not pin the bytes.
- Tuning on online returns and calling the study offline. Online ground truth audits estimators after selection; the moment it guides a choice, the offline claim is void.

**Practice**

- [Minari tutorial: behavioral cloning with PyTorch](https://minari.farama.org/tutorials/using_datasets/behavioral_cloning/) - Run the tutorial end to end on CPU: train the PPO expert, collect `cartpole/expert-v0` with `DataCollector`, then clone it; keep the dataset id, `algorithm_name` and Minari version with the trained policy and report them alongside the return (page read 2026-10-14). Small CartPole run on CPU; the expert step needs `rl_zoo3` and Stable-Baselines3. As written, the loop hands `(batch, time, action)` logits to `CrossEntropyLoss`, which reads dimension 1, time, as the class axis: flatten logits to `(-1, 2)` with class-index targets before trusting the loss, and drop `render_mode="human"` on a headless machine. Treat the tutorial as the dataset-handling drill: collection, identity fields, episode iteration, baseline.

**Stop when:** You can state one dataset's full identity from memory of your run, point to its support gaps, and show a sweep table with the audit column untouched.

<details>
<summary>Self-test</summary>

1. What four facts must accompany every offline result, and why?
   - Dataset id, dataset version, behavior-policy description, and environment version. Without them nobody can tell what distribution the numbers came from or reproduce the bytes.
2. Why can medium-quality diverse data beat expert data for offline RL?
   - Expert data concentrates on one narrow behavior, so new policies quickly leave its support. Diverse data covers more states and actions, which lets stitching and conservative methods compose better-than-demonstrator behavior.
3. What is a counterfactual query, and what did the Lecture 17 soft actor-critic demo show about it?
   - Asking whether an unseen action is good without data to check. The demo showed predicted Q-values massively above achieved returns on a log scale: the policy asked, the data could not answer, and the values were wrong.
4. What belongs in the audit-only column of your sweep table?
   - Online returns computed after all selection is finished, used only to judge estimators and methods. Nothing in that column may change a hyperparameter or a choice.

</details>

#### U5. Extrapolation error, pessimism and Conservative Q-Learning

**About 5 h** · **Target:** Derive + Implement

Topics: Offline distribution shift and extrapolation error; Pessimism and conservative value estimation; Conservative Q-Learning vocabulary

Standard backups query actions the data never saw and believe the answer. Pessimism is the fix that keeps offline values honest, and CQL is its cleanest expression.

**You can now**

- Locate where extrapolation error enters a Bellman backup and demonstrate it with a fixed-batch query.
- Derive the Conservative Q-Learning regularizer and the lower-bound claims behind it.
- Sweep the conservatism weight and show lowered out-of-data values with in-data values held.

**Study**

1. [Shift in dynamic programming, uncertainty, and CQL](https://arxiv.org/abs/2005.01643) (Offline Reinforcement Learning: Tutorial, Review and Perspectives) - Sections 4.2 through 4.5 of arXiv:2005.01643v3: distributional shift inside Bellman backups, policy constraints, uncertainty-based conservative estimates, and the CQL penalty as conservatism without explicit uncertainty.
2. [CQL: the regularizer and the lower bounds](https://arxiv.org/abs/2006.04779) (Conservative Q-Learning for Offline Reinforcement Learning) - Sections 1-3 of arXiv:2006.04779v3: Equations 1 and 2 with Theorems 3.1 (pointwise lower bound under support conditions) and 3.2 (tighter expected-value bound that is not pointwise); Section 3.2: the CQL(H) log-sum-exp variant (Equation 4), with Section 4 for the practical algorithm.
3. [Lecture 18: Conservative Q-Learning slides](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-18.pdf) (Berkeley CS 185/285 Deep Reinforcement Learning (Spring 2026) - Imitation and Offline RL) - PDF pp. 17-21: pushing down large Q-values while pushing up in-data pairs, with the policy-constraint versus pessimism framing from PDF p. 2. Depth: Use pp. 17-21 only here. IQL (pp. 11-15) and offline-to-online (pp. 22-24) belong to other units.
4. [CQL against BCQ and IQL](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter12_offline_rl/offline-data-distribution-shift#_2-2-cql-lowering-the-value-of-actions-outside-the-dataset) (Hands-on Modern RL - Offline RL and Imitation Concepts) - Sections 2.2 and 2.4: the log-sum-exp soft maximum over all actions, the in-data restoration term, the penalty gap, and the method comparison table (page read 2026-10-14).

**Focus**

- Extrapolation error enters at the max: a Q-learning backup queries values at actions the dataset never paired with that state, and the maximizer seeks out exactly the overestimated ones.
- CQL adds a penalty with two opposing terms: push down a soft maximum over all actions and push up the pairs actually observed. The gap between them is the conservatism; the paper's theory turns it into a lower bound.
- A concrete gap: in-data value $`5`$ with one unseen action at $`8`$ gives a soft maximum of $`8.05`$ and a pre-weight gap of $`3.05`$. Recompute both numbers; the weight in front sets the strength.
- The two theorems differ in scope: Equation 1 gives a pointwise lower bound when the pushed-down distribution stays inside behavior support; Equation 2 gives a tighter bound on expected policy value that does not hold pointwise.

**Reproduce:** Closed-book, write the CQL(H) objective (Bellman error plus the weighted soft-maximum minus in-data term), compute the 8.05 and 3.05 values above, and implement the fixed-batch regularizer showing out-of-data values falling while in-data values hold.

**Traps**

- Quoting the lower bound for arbitrary actions. The pointwise claim needs the support condition of Theorem 3.1; the Equation 2 form bounds expected value only, and neither survives truly unsupported queries.
- Setting the conservatism weight once and forgetting it. The paper trades performance against conservatism through this weight and notes that the weight needed for the lower bound falls as data grows; sweep it, do not copy it.
- Assuming conservatism is free at deployment time. Pushed-down values cause the initial unlearning dip when online fine-tuning starts; that measurement belongs to the sequence-models unit.

**Practice**

- The section mini-project covers this: a fixed-batch CQL regularizer test that lowers Q-values on actions the dataset does not contain while holding in-data values, plus a conservatism-weight sweep with the tradeoff written down.

**Stop when:** You derive the regularizer from memory, reproduce the 8.05 gap on paper, and can state which theorem covers which claim without hedging.

<details>
<summary>Self-test</summary>

1. Where exactly does extrapolation error enter a Q-learning backup?
   - At the maximization (or argmax-action query) over next actions: it evaluates the Q-function at actions the dataset never paired with that state, and maximization selects the most overestimated one.
2. In-data value 5, one unseen action valued 8. What are the soft maximum and the penalty gap?
   - Soft maximum 8.05, gap 3.05 before the weight. The soft maximum is dominated by the unseen 8, which is exactly the overestimation the penalty must suppress.
3. Contrast the two CQL theorems in one sentence each.
   - Theorem 3.1: iterating the Equation 1 update lower-bounds the true Q pointwise when the penalty distribution stays in behavior support. Theorem 3.2: the Equation 2 form gives a tighter bound on expected policy value but not a pointwise bound.
4. What should happen to the conservatism weight as the dataset grows toward infinite coverage?
   - The weight needed for the lower bound shrinks: the paper notes that as $`|\mathcal{D}(s, a)|`$ grows the required weight decreases, so in the limit of infinite data an extremely small weight suffices.

</details>

#### U6. Implicit Q-Learning expectiles and advantage-weighted actor updates

**About 4 h** · **Target:** Derive + Implement

Topics: Implicit Q-Learning expectile and advantage weighting; Advantage-weighted actor update vocabulary

IQL learns multi-step values without ever asking the Q-function about unseen actions. It is the method that makes the no-OOD-query idea concrete and testable on a fixed batch.

**You can now**

- Derive the expectile value loss, the Q target, and the advantage-weighted policy update from the IQL paper.
- Explain why the separate value function avoids both out-of-data queries and lucky-transition bias.
- Compare IQL with cloning across dataset quality and coverage, sweeping the expectile.

**Study**

1. [IQL: expectiles, the Q backup, and policy extraction](https://arxiv.org/abs/2110.06169) (Implicit Q-Learning) - Sections 4.1-4.3 of arXiv:2110.06169v1: expectile regression with Figure 1, the value loss and Q loss, the advantage-weighted extraction with Algorithm 1; Section 5.1: one-step improvement versus multi-step IQL.
2. [Lecture 07: advantage weighting to expectile IQL](https://cs224r.stanford.edu/slides/07_cs224r_offline_rl_2026.pdf) (Stanford CS224R Spring 2026 - Imitation and Offline RL) - PDF pp. 20-21: full advantage-weighted regression; PDF p. 25: the expectile loss with its worked plot; PDF p. 26: the three IQL losses with the Homework 3 pointer. Depth: Watch the notation: the slides write the expectile weight as a small value below 0.5 where the paper and the homework write it above 0.5. They are complements of each other; the traps below pin this down.
3. [Lecture 18: implicit constraints to IQL](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-18.pdf) (Berkeley CS 185/285 Deep Reinforcement Learning (Spring 2026) - Imitation and Offline RL) - PDF pp. 9-10: advantage-weighted regression and the AWAC update; PDF pp. 11-15: avoiding all out-of-distribution actions in the Q update with the expectile value function.
4. [IQL and how it differs from AWAC](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter12_offline_rl/offline-data-distribution-shift#_2-3-iql-avoiding-explicit-evaluation-of-out-of-dataset-actions) (Hands-on Modern RL - Offline RL and Imitation Concepts) - Sections 2.3, 3.2, and 3.3: the expectile backup through next-state values instead of maximized Q, and the AWAC-versus-IQL advantage comparison (page read 2026-10-14).

**Focus**

- The three losses use dataset actions only: an expectile value loss that estimates an upper envelope over in-support actions, a mean-squared Q loss backed up through next-state values, and an advantage-weighted cloning loss for the policy.
- The separate value function does two jobs at once: it never queries unseen actions, and it averages out transition luck, because a high target from a lucky next state does not move the action-envelope estimate the way a directly fitted maximum would.
- The expectile parameter is a sweep, not a constant: 0.5 recovers the mean and higher values reach further toward the in-support maximum. The homework compares 0.2 against 0.9 on the U-maze for exactly this reason.
- AWAC and IQL share the weighted-cloning policy form but estimate advantage differently: AWAC backs advantages through a standard Q backup that still queries next actions sampled from the current policy, while IQL backs them through the expectile value with no out-of-data query.

**Reproduce:** Closed-book, write all three IQL losses, compute the 0.9 expectile of the values 0, 0, and 10 (8.18, above the mean 3.33), and show on a fixed batch that no loss term evaluates an action outside the dataset.

**Traps**

- Mixing up the expectile conventions. The paper and both homeworks write the upper expectile above 0.5 (0.9 beats 0.2 for reaching good values); the Stanford slides write the same loss with the complement below 0.5. Convert before comparing numbers across sources.
- Treating the expectile as a maximum. It approaches the in-support maximum as the parameter tends to 1 but stays an expectile of dataset values at any fixed setting; it never invents out-of-support actions.
- Reading small inverse temperature as aggressive. In the extraction loss, small temperature behaves like plain cloning and large temperature reaches for the Q maximum; the direction is the reverse of a penalty weight.

**Practice**

- [Stanford CS224R Homework 3, Questions 1-2: AWAC and IQL on AntMaze](https://cs224r.stanford.edu/material/hw3/CS224R_2026_Homework_3.pdf) - Question 1: AWAC implementation and comparison; Question 2: `cs224r/critics/iql_critic.py` and `cs224r/agents/iql_agent.py` with the expectile sweep over 0.2 and 0.9 on `antmaze-umaze-v0`, then the better setting on `antmaze-medium-diverse-v0`. Full runs need Modal GPUs (about 1 hour per U-maze run, 1.5 hours for medium). Implement the three losses locally first with fixed-batch tests that assert no out-of-data query, and treat full sweeps as optional.

**Stop when:** Your hand expectile matches code, your fixed-batch losses never touch an unseen action, and you can predict which expectile wins on a new maze and why.

<details>
<summary>Self-test</summary>

1. Compute the 0.9 expectile of values 0, 0, and 10, and compare with the mean.
   - 8.18, above the mean 3.33. The minimizer weights the above-estimate squared error at 0.9 and the below-estimate part at 0.1, pulling the estimate toward the high in-support value.
2. Why does IQL fit a separate value function instead of taking expectiles of Q targets directly?
   - A high Q target can come from a lucky transition into a good state rather than a good action. The separate value function takes the expectile over actions only, while the Q backup averages over transition stochasticity.
3. Where does AWAC still query out-of-distribution actions while IQL does not?
   - AWAC's advantage comes from a standard Bellman backup that samples next actions from the current policy, which may be unseen. IQL's backup goes through the expectile of dataset values at the next state, using dataset actions only.
4. What does the extraction loss become as the inverse temperature goes to zero?
   - Plain behavior cloning: all advantage weights tend to 1, so every dataset action is imitated equally regardless of value.
5. A run with expectile 0.2 underperforms 0.9 on the U-maze. What does that tell you, in one sentence?
   - The task needs multi-step improvement toward good in-support values, which the near-mean estimate cannot provide; the higher expectile reaches further up the dataset's value envelope.

</details>

#### U7. The sequence-modeling view and online fine-tuning after offline initialization

**About 4 h** · **Target:** Explain + Measure

Topics: Decision Transformer and sequence-modeling view; Online fine-tuning after offline initialization

Offline training ends and interaction resumes. This unit decides whether the offline initialization helps or gets unlearned first, and where sequence copying stops being reinforcement learning.

**You can now**

- Explain the sequence-modeling view (return-conditioned action prediction) and its stitching limit.
- State the calibration condition that prevents initial unlearning when online fine-tuning starts.
- Measure the first online episodes after offline initialization with and without the calibration fix.

**Study**

1. [Offline RL through sequence modeling](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter12_offline_rl/sequence-modeling#_1-training-decision-transformer-with-a-target-return) (Hands-on Modern RL - Offline RL and Imitation Concepts) - Sections 1.1-1.5: return-to-go conditioning, supervised action prediction, the inference loop that decrements the target return, why the method can work, and its limitations including stitching (page read 2026-10-14).
2. [Lecture 07: stitching and the imitation baselines](https://cs224r.stanford.edu/slides/07_cs224r_offline_rl_2026.pdf) (Stanford CS224R Spring 2026 - Imitation and Offline RL) - PDF pp. 11-12: the stitching diagram (good segments recombined into a better whole); PDF p. 17: filtered imitation that copies only good trajectories; PDF p. 28: the summary listing filtered and weighted imitation as baselines, with trajectory stitching as the improvement over imitation.
3. [Cal-QL: calibration against the initial dip](https://arxiv.org/abs/2303.05479) (Cal-QL: Calibrated Offline RL Pre-Training for Efficient Online Fine-Tuning) - Sections 1 and 4.1 of arXiv:2303.05479v4: the initial unlearning diagnosis for conservative methods; Section 4.2 with Definition 4.1 (calibration of the learned values against a reference policy); Section 7: the fine-tuning experiments that measure the first online episodes.
4. [Lecture 18: the offline-to-online problem](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-18.pdf) (Berkeley CS 185/285 Deep Reinforcement Learning (Spring 2026) - Imitation and Offline RL) - PDF pp. 22-25: offline pretraining followed by fast online fine-tuning, the CQL recovery period wasted regaining offline performance, and why one algorithm that does both phases well is hard to find.

**Focus**

- A Decision Transformer is supervised learning on triples: condition on a target return, predict the action, then subtract the observed reward from the target at the next step. No Bellman backup ever combines two different trajectories.
- Stitching is the test sequence models fail: one dataset segment runs from start to middle, another from middle to goal, and only multi-step dynamic programming returns the full route. Copying whole trajectories, however filtered, cannot invent the combination.
- Calibration is a one-sided guard, not accuracy: expected learned values must sit above the reference policy's values on dataset states. Conservative pretraining violates it by pushing learned-policy values too far down, so online updates spend their first episodes unlearning.
- The measurement that matters is the return curve of the first online episodes with and without the calibration fix, not the asymptotic return after both converge.

**Reproduce:** Closed-book, write the return-conditioned inference loop (set target, act, subtract reward, repeat) and the calibration inequality, then sketch the two-segment stitching diagram and mark which methods cross the gap.

**Traps**

- Conditioning on a high target return and calling the result optimal. An unreachable target pushes the model into trajectory regions it never saw; sequence models copy statistics, they do not optimize.
- Assuming fine-tuning can only help. Conservative initialization starts below the behavior it already had, so early online training first recovers lost performance; skipping the first-episode measurement hides exactly this cost.
- Reading calibration as value accuracy. It bounds learned values from below against a reference; a calibrated function can still be far from the true values everywhere.

**Practice**

- [Stanford CS224R Homework 3, Question 3: the stitching study](https://cs224r.stanford.edu/material/hw3/CS224R_2026_Homework_3.pdf) - Question 3: IQL versus Filtered BC on the PointMass task with suboptimal data; report which method improves over the dataset behavior and explain the gap in terms of value estimation. Runs on Modal, about 15 minutes for IQL and 10 for Filtered BC. Read the data-construction part first, predict the winner from the stitching argument, then run.

**Stop when:** You can run the inference loop and the calibration inequality from memory, predict a stitching outcome before seeing numbers, and plot a fine-tuning dip with its cause labeled.

<details>
<summary>Self-test</summary>

1. Write the Decision Transformer inference loop in three steps.
   - Set a target return and condition the policy on it with the history; execute the predicted action and observe the reward; subtract the reward from the remaining target and repeat until the episode ends.
2. Why can filtered cloning plus a high target still fail the stitching diagram?
   - Filtering copies only good whole trajectories, and no dataset trajectory contains the combined route. Without a Bellman backup joining the segments at the shared middle, the combination is never constructed.
3. State the calibration condition and what breaks when it fails.
   - Expected learned values under the learned policy must exceed the reference policy's values on dataset states. When conservative pretraining pushes them below, online updates first unlearn the initialization before improving it.
4. What is the load-bearing measurement when comparing a calibrated against an uncalibrated fine-tuning run?
   - Returns over the first online episodes: whether the dip appears, how deep it is, and how many episodes recalibration costs, before any asymptotic comparison.

</details>

#### U8. Off-policy evaluation targets, importance sampling, weight clipping and effective sample size

**About 5 h** · **Target:** Derive + Implement

Topics: Off-policy evaluation target and logging policies; Trajectory and per-decision importance sampling for evaluation; Weight clipping, normalization and effective sample size

Evaluation without interaction stands or falls on the weights. This unit makes every estimator earn its number against a known truth, with the diagnostics that expose a one-trajectory estimate.

**You can now**

- Derive trajectory and per-decision importance-sampling estimators with their support assumptions.
- Implement ordinary, weighted, and per-decision estimates on logged trajectories with a known true value.
- Report weight diagnostics (distribution, clipping bias, effective sample size) instead of a bare point estimate.

**Study**

1. [Off-policy evaluation via importance sampling](https://arxiv.org/abs/2005.01643) (Offline Reinforcement Learning: Tutorial, Review and Perspectives) - Section 3.1 of arXiv:2005.01643v3: the trajectory estimator with its weight product, the per-decision form that drops future weights per reward, and the weighted (self-normalized) variants with their bias-variance tradeoff.
2. [DOPE: the behavior-agnostic protocol and step-wise IS](https://arxiv.org/abs/2103.16596) (Benchmarks for Deep Off-Policy Evaluation) - Sections 2 and 3.2 of arXiv:2103.16596v1: evaluation without logged propensities (behavior policy estimated where required) and the split between point-error and ranking metrics; Section 5.1: the IS baseline, self-normalized step-wise importance sampling.
3. [Importance-sampling families before the robust upgrade](https://arxiv.org/abs/1511.03722) (Doubly Robust Off-policy Value Evaluation for Reinforcement Learning) - Section 3.2 of arXiv:1511.03722v3: the ordinary and weighted estimator review that the doubly robust form builds on. Depth: Read Section 3.2 only here. The doubly robust estimator itself belongs to the next unit.

**Focus**

- The evaluation target is the return of a fixed target policy under logged trajectories from a behavior policy. Every estimator here reweights the same logged rewards; they differ only in which weights multiply which reward.
- Per-decision weights drop future ratios per reward because a reward cannot depend on later actions. Expectation is unchanged while per-trajectory values change, which is a variance reduction, not a bias fix.
- Self-normalized (weighted) estimators divide by the weight sum: lower variance, but biased at finite samples and only consistent. Ordinary estimators are unbiased but can ride on a handful of huge weights.
- Effective sample size compresses the weight vector into one number: squared weight sum over sum of squared weights. One dominant weight out of four trajectories gives about 1, and the estimate is then one trajectory wearing a disguise.

**Reproduce:** Closed-book, on four logged two-step trajectories with uniform behavior and an always-first-action target (step-one reward 1; step-two reward 1 after the first action and 0 after the second), compute the ordinary estimate (2.0), the per-decision estimate (2.0 via different per-trajectory values), and the effective sample size (1 of 4).

**Traps**

- Calling the weighted estimator unbiased because it matched truth once. It is biased at finite samples by construction; matching truth on one dataset is luck, and the bias points toward the behavior policy.
- Clipping weights and keeping the unbiasedness claim. Clipping caps variance by adding bias: the clipped weights undercount exactly the trajectories the target policy favors most. Report the clip level and the bias direction instead of hiding them.
- Estimating the behavior policy from the same logs and proceeding as if propensities were known. Estimation error enters every weight, and thinly logged actions hide the largest errors.

**Practice**

- The section mini-project covers this: ordinary, weighted, and per-decision estimates on logged trajectories from a small MDP with a computable true value, with weight-distribution plots, clipping comparisons, and effective-sample-size diagnostics calibrated against simulator truth.

**Stop when:** Your hand estimates match code on the four-trajectory case, and you refuse to report any IS number without its weight diagnostics attached.

<details>
<summary>Self-test</summary>

1. Which estimator is unbiased: ordinary or self-normalized? What does the other buy?
   - Ordinary is unbiased under support. Self-normalized buys lower variance at the price of finite-sample bias toward the behavior policy; it is consistent, not unbiased.
2. In the four-trajectory reproduce case, ordinary and per-decision means agree at 2.0. What differs, and why keep both?
   - Per-trajectory values differ (6 versus 8 on the best trajectory) while the mean matches. Per-decision removes future-weight noise per reward, so its variance across datasets is usually lower.
3. Weights are 4, 0, 0, 0. What are the ordinary estimate, the self-normalized estimate, and the effective sample size?
   - Both estimates equal the first trajectory's return (ordinary mean 4 times return over 4; self-normalized return over weight sum 4). Effective sample size is 1 of 4: a single-trajectory estimate.
4. The logging system stored no propensities. What changes in the IS pipeline?
   - Fit a behavior-policy model first and use estimated ratios, following the behavior-agnostic protocol. Every weight now carries model error, so support diagnostics matter more, not less.

</details>

#### U9. Direct, model-based, doubly robust and Fitted Q Evaluation estimators

**About 4 h** · **Target:** Derive + Implement

Topics: Direct, model-based and doubly robust estimator vocabulary; Fitted Q Evaluation vocabulary

Weights alone are too noisy and models alone are too trusting. This unit combines them, then measures estimators the way they are actually used: to rank and select policies.

**You can now**

- Derive the doubly robust estimator as model plus importance-weighted residual, with its either-side correctness condition.
- Implement Fitted Q Evaluation as iterated supervised regression and compare it with IS estimates against a known truth.
- Judge estimators by rank correlation and selection regret, not by one point error.

**Study**

1. [The doubly robust estimator and its variance analysis](https://arxiv.org/abs/1511.03722) (Doubly Robust Off-policy Value Evaluation for Reinforcement Learning) - Sections 1-3 of arXiv:1511.03722v3: the bandit estimator with Equation 8, the sequential extension, unbiasedness when either the behavior policy is known or the model is correct, and the variance analysis.
2. [FQE inside constrained batch policy learning](https://arxiv.org/abs/1903.08738) (Batch Policy Learning under Constraints (Fitted Q Evaluation)) - Algorithm 3 of arXiv:1903.08738v1: the iterated target with supervised regression per round; read with the surrounding section on the three estimator families (importance weighting, direct methods, doubly robust).
3. [DOPE: ranking metrics and the method comparison](https://arxiv.org/abs/2103.16596) (Benchmarks for Deep Off-Policy Evaluation) - Sections 3.2 and 4-5 of arXiv:2103.16596v1: absolute error versus rank correlation and selection regret, the FQE, DR, and IS implementations compared, and Figure 7 with the reported scatter of estimate against ground truth.

**Focus**

- Doubly robust adds an importance-weighted residual onto a model prediction: when the model is right the residual averages out, and when the weights are right the residual fixes the model. Either side being correct keeps the estimate unbiased; neither side rescues missing support.
- FQE never touches a weight: it regresses a Q-function onto targets built with the target policy's own actions, round after round. Its error is Bellman error plus function-approximation error plus coverage error, compounded over iterations.
- The three families trade differently: weighting is unbiased but noisy, direct methods are quiet but biased by model error, and doubly robust inherits the better side per state when at least one side is right.
- Selection needs ordering, not accuracy: a biased estimator that ranks policies correctly selects well with a bad point error, while an unbiased but noisy one can pick a loser. The benchmark reports both, and the ranking metrics decide.

**Reproduce:** Closed-book, write the bandit doubly robust form and the FQE target, then evaluate one logged bandit pair with ratio 2, reward 1, and a model that predicts reward 0.6 for every action: model alone 0.6, IS alone 2.0, doubly robust 1.4.

**Traps**

- Claiming double robustness against bad models and bad coverage at once. The guarantee needs one correct side; an unsupported action breaks the weight side and an unverifiable region breaks the model side together.
- Iterating FQE many rounds to squeeze the regression loss. Each round fits the previous round's errors too, so late iterations can compound model bias; monitor selection metrics across rounds, not just training loss.
- Reporting the smallest absolute error as the best selector. Rank correlation and regret measure the selection job; a low-error estimator that inverts two close policies fails it.

**Practice**

- The section mini-project covers this: FQE on logged data compared with importance-sampling estimates against the simulator truth, plus a doubly robust estimate on the same logs, judged by absolute error, rank correlation, and selection regret.

**Stop when:** Your hand doubly robust number matches code, your FQE loop beats IS on ranking while you can still name its bias source, and every estimator you report carries all three metrics.

<details>
<summary>Self-test</summary>

1. When is the doubly robust estimator unbiased?
   - When either the behavior policy (hence the weights) is known or the model is correct. One correct side suffices; both wrong means no guarantee. With both sides estimated, the paper's claim is asymptotic: either correctly specified side gives consistency.
2. Ratio 2, reward 1, model value 0.6. What do the model, IS, and doubly robust estimates give?
   - Model 0.6, IS 2.0, doubly robust 0.6 + 2(1 - 0.6) = 1.4. The residual correction pulls the model toward the weighted evidence without inheriting its full variance.
3. Write the FQE target for one transition.
   - Immediate cost plus discounted next value under the evaluated policy's own action, regressed with supervised learning each round until the iteration budget runs out.
4. Two estimators: A has half the absolute error of B but ranks the top two policies backwards. Which selects better?
   - B, if its ranking is right: selection pays regret on the chosen policy, and the inverted top pair is exactly what regret punishes. Report rank correlation and regret alongside error.

</details>

#### U10. Unsupported actions, impossible counterfactuals and offline model selection

**About 3 h** · **Target:** Explain + Measure

Topics: Unsupported actions and impossible counterfactuals; Offline model selection without online feedback

The most expensive offline mistake is a confident claim about an action nobody ever took. This unit makes unsupported mean unsupported, and selection honest.

**You can now**

- Prove a counterfactual impossible from support alone, before any estimator runs.
- Select policies with rank correlation and regret on held-out logged data, never on hidden online returns.
- State what an offline study can and cannot establish about deployment.

**Study**

1. [Lecture 17: the counterfactual question](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-17.pdf) (Berkeley CS 185/285 Deep Reinforcement Learning (Spring 2026) - Imitation and Offline RL) - PDF pp. 10-11: training data versus what the policy wants to do, and why unseen actions have no honest offline answer.
2. [DOPE: selection protocol with reserved ground truth](https://arxiv.org/abs/2103.16596) (Benchmarks for Deep Off-Policy Evaluation) - Sections 3.1-3.2 of arXiv:2103.16596v1: task properties that stress coverage, the policy pools with values from at least 1000 episodes each, and rank correlation plus regret as the selection metrics.
3. [Evaluation and benchmarks without online access](https://arxiv.org/abs/2005.01643) (Offline Reinforcement Learning: Tutorial, Review and Perspectives) - Section 6.1 of arXiv:2005.01643v3: how offline work should be evaluated and benchmarked, read as the constraints your selection procedure must satisfy.

**Focus**

- Support is a yes-or-no question per state and action: if the logging policy never takes an action there, its importance weight is undefined, not large. No estimator, robust or fitted, manufactures the missing outcome.
- Thin support is the quantitative sibling: weights exist but concentrate on a few trajectories, so estimates inherit their noise. Report the concentration; the previous unit's diagnostics are the evidence.
- Offline model selection ranks candidates on held-out logged data with rank correlation and regret. Online returns, including benchmark ground-truth values, audit the procedure after the fact and must never guide a choice.
- An offline study establishes ordering among supported candidates and bounds under stated assumptions. Deployment safety for unsupported regions is out of scope here; the next unit builds the guards.

**Reproduce:** Closed-book, construct a one-state two-action log where the second action never appears, show the target policy that always takes it has an undefined weight, and write the candidate-by-estimator selection table with rank correlation left for the mini-project to fill.

**Traps**

- Smoothing the behavior-policy estimate to fix zero support. Adding $`\epsilon`$ mass makes the weights finite, but no logged sample ever took that action, so its outcome still never enters the estimate; the number is silently biased, not identified.
- Tuning on the benchmark's ground-truth returns while calling the study offline. Reserved truth that guides selection is just online tuning with extra steps; keep it sealed until the audit.
- Presenting the selected policy as deployment-safe. Selection picks the best-supported candidate; unsupported regions remain unidentified and need the fallback machinery of the next unit.

**Practice**

- The section mini-project covers this: one exposed support-mismatch failure with the undefined weight written out, plus candidate selection by rank correlation and regret with online returns sealed until the audit.

**Stop when:** You can exhibit an undefined weight on demand, run a sealed selection procedure, and state in writing what your study does not establish.

<details>
<summary>Self-test</summary>

1. What distinguishes an impossible counterfactual from a hard one?
   - Zero support makes the weight undefined, so no weighting estimator exists; thin support gives huge but finite weights, so estimates exist with variance the diagnostics must show.
2. Why rank correlation instead of absolute error for selecting among three candidates?
   - Selection needs the right order and the right winner. An estimator with larger point errors that orders all three correctly has zero selection regret; error alone cannot see that.
3. The benchmark ships ground-truth values from 1000-plus episodes. When may you open them?
   - After selection is frozen, to audit the estimators and the procedure. Opening them earlier turns the study into online selection wearing an offline label.
4. Your estimator ranks every candidate correctly but every point estimate is 30 percent low. Deploy?
   - Selection succeeded but the level is unknown, so any threshold-based safety claim still fails. Ranking does not certify absolute performance.

</details>

#### U11. Normalization consistency, abstention and fallback, and online audit of estimators

**About 4 h** · **Target:** Implement + Measure

Topics: Action and observation normalization consistency; Policy abstention, fallback and data-collection triggers; Online ground truth reserved for estimator audit

Offline work ends in a deployment decision, not a leaderboard number. This unit turns support limits into running guards: consistent preprocessing, abstention with fallback, and an audit that cannot leak into selection.

**You can now**

- Apply one frozen normalization from logged data through deployment, with its version recorded.
- Define a support-based abstention rule with a fallback policy and a data-collection trigger.
- Run an online audit of the section estimators against simulator truth after selection is frozen.

**Study**

1. [Minari dataset standards and basic usage](https://minari.farama.org/content/dataset_standards/) (Minari Offline Datasets) - Dataset Standards: observation and action spaces, episode and step records, and versioned dataset ids; Basic Usage (https://minari.farama.org/content/basic_usage/): iterating episodes with their recorded spaces (pages read 2026-10-14). Depth: Read the standards as a contract your pipeline must satisfy: the spaces and version you train against are the spaces and version you deploy against.
2. [Homework 1: the normalized interface](https://cs224r.stanford.edu/material/hw1/CS224R_2026_Homework_1.pdf) (Stanford CS224R Spring 2026 - Imitation and Offline RL) - Environment section: 4-D normalized observations with the target position action in [0, 1]; Problems 1 and 3: the same interface under cloning and under DAgger aggregation.
3. [Control Laboratory: the offline-data stretch](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/reinforcement-learning-control-laboratory.md) (Reinforcement Learning Control Laboratory - Offline Stretch) - Stretch goals: add offline data with off-policy estimates calibrated against simulator truth.

**Focus**

- Fit every normalization statistic once on the logged data, freeze it, and apply the identical transform at deployment. Refitting on deployment batches or normalizing splits separately silently moves the support boundary your earlier diagnostics certified.
- Abstention needs a numeric rule: a support or density test on the state-action pair that routes failures to a fallback policy (for example the cloning baseline on supported regions) and logs the event as a data-collection trigger.
- The fallback policy is itself a claim that needs support evidence: it is only safer where its own training distribution covers the abstention region, so characterize its coverage too instead of assuming safety.
- Online ground truth audits estimators after selection is frozen. The audit compares importance and fitted-value estimates against simulator returns on held-out policies; nothing it reveals may change a choice.

**Reproduce:** Closed-book, write the three-part deployment checklist (frozen normalization with version, abstention rule with fallback and trigger, sealed audit table), then run it on your Flappy Bird or CartPole policy with one unsupported region demonstrated.

**Traps**

- Normalizing with running deployment statistics. The transform becomes a function of the deployment stream, so training and deployment see different mappings and the support test certifies nothing.
- Treating abstention rate as a safety metric by itself. A policy that abstains everywhere is useless and one that never abstains may be blind; report abstention with fallback return and trigger counts.
- Auditing on the selection policies and stopping. The audit must include held-out policies the estimators never saw during selection, or it measures memory instead of generalization.

**Practice**

- [Minari tutorial: PointMaze D4RL dataset creation](https://minari.farama.org/tutorials/dataset_creation/point_maze_dataset/) - Recreate the maze dataset pipeline on CPU: waypoint planner, controller with action noise, the truncation callback that splits continuing episodes, and dataset creation with id, algorithm name, code permalink, and author recorded. CPU-scale; needs Gymnasium-Robotics with MuJoCo. Treat it as the collection-trigger drill: a versioned dataset built by a known controller, with the identity fields your audit trail will later require.

**Stop when:** Your pipeline applies one frozen normalization end to end, abstains on a demonstrated unsupported region with fallback and trigger logs, and your audit table separates selection policies from held-out ones.

<details>
<summary>Self-test</summary>

1. Why must normalization statistics be frozen from the logged data?
   - The policy and every support diagnostic were certified under one fixed mapping. A refitted mapping moves states across the certified boundary, so earlier coverage claims no longer apply to the deployed inputs.
2. State a complete abstention rule in one sentence each for test, fallback, and trigger.
   - Test: route to fallback when the pair's support score falls below the threshold set on held-out logged data. Fallback: execute the cloning baseline restricted to supported regions. Trigger: log the event with state, score, and version for the next collection round.
3. What may the online audit change?
   - Nothing about selection. It scores the frozen estimators against simulator truth and records where they fail; any change it suggests belongs to a new documented study round.
4. The fallback is plain behavior cloning. Is the deployed system now safe?
   - Only where cloning itself has support evidence. The fallback needs its own coverage characterization over the abstention region; outside that, the system must escalate or stop, not silently proceed.

</details>

### Mini-project: Offline imitation and calibrated off-policy evaluation

**About 10 to 14 hours.** Extend `policylab` with an `offline/` laboratory over versioned logged datasets: cloning baselines, conservative values and a full off-policy evaluation suite. Calibrate every estimator against simulator truth and seal online returns until the audit. Support gaps become explicit abstention rules, not silent extrapolation.

1. Log expert and learner trajectories from a small MDP with exact values in `oracles/` into versioned `offline/` datasets with behavior-policy identity and coverage counts, and fit a behavior-cloning baseline that every later estimator and policy is compared against.
2. Train an expert-versus-learner classifier on the logged pairs, check its optimum under the stated labeling against the occupancy ratio, and name the online rollouts GAIL would still need.
3. Add a fixed-batch CQL regularizer test that lowers values on actions missing from the data while holding in-data values, then sweep the conservatism weight and write down the performance tradeoff.
4. Compute ordinary, weighted and per-decision estimates on logged trajectories with a known true value, keeping weight-distribution plots, clipping comparisons and effective-sample-size diagnostics calibrated against simulator truth.
5. Run FQE on the same logs beside importance-sampling estimates, add a doubly robust estimate, and judge all three by absolute error, rank correlation and selection regret against simulator truth.
6. Expose one support-mismatch failure with its undefined weight written out, select candidates by rank correlation and regret with online returns sealed, then audit on held-out policies with frozen normalization, fallback and trigger logs.

**Deliverables**

- `offline/` datasets with behavior identity, coverage diagnostics and the discriminator-versus-occupancy check.
- CQL, importance-sampling, FQE and doubly robust estimates with sweeps and diagnostics against simulator truth.
- Sealed selection with rank and regret metrics, the audit table, and the abstention rule with fallback.

**Checks**

- rubric: Self-grade with the rubric below.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Pessimism tests | The fixed-batch CQL test lowers unseen-action values while in-data values hold, and the weight sweep records the tradeoff. | A matched cloning baseline shows where conservatism wins and where coverage alone decides. |
| Weight honesty | All three importance-sampling estimates carry weight plots, clipping comparisons and sample-size diagnostics against truth. | A clipped-versus-unclipped pair shows the bias direction, and one dominant weight is called out as a single-trajectory estimate. |
| Estimator ranking | FQE, importance-sampling and doubly robust estimates report error, rank correlation and regret on the same logs. | A ranking flip between error and regret is kept as evidence that selection needs ordering, not accuracy. |
| Sealed selection | The undefined-weight exhibit is written out, selection uses sealed returns, and the audit covers held-out policies. | The abstention rule routes unsupported pairs to fallback with trigger logs, and normalization stays frozen throughout. |

Feeds into: `offline/` datasets, estimators and sealed-selection discipline feed model-based calibration, language-policy evaluation and the capstone.

### Resource route

- **Primary - Course:** [Stanford CS224R Spring 2026 - Imitation and Offline RL](https://cs224r.stanford.edu/) - Study Lecture 02 (imitation: behavior cloning, covariate shift, DAgger) and Lecture 07 (offline RL). Homework 1 (behavior cloning, flow matching and DAgger on a small Flappy Bird environment) runs on CPU; Homework 3 (AWAC, IQL and a stitching study) runs on cloud GPUs, so read it for the losses. Follow the Stanford honor code for course materials.
- **Required - Course:** [Berkeley CS 185/285 Deep Reinforcement Learning (Spring 2026) - Imitation and Offline RL](https://rail.eecs.berkeley.edu/deeprlcourse/) - Slides are public at https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-N.pdf; current videos are not, and the public Fall 2023 playlist numbers lectures differently. Study Lectures 2 and 3 (behavioral cloning) and Lectures 17 and 18 (offline RL). Homework 1 (MSE and flow-matching action-chunk policies) runs on a laptop CPU; Homework 5 (SAC+BC, IQL and FQL on OGBench) needs a GPU, so debug on the smallest task and treat full 1M-step sweeps as optional.
- **Required - Paper:** [Offline Reinforcement Learning: Tutorial, Review and Perspectives](https://arxiv.org/abs/2005.01643) - Study the problem definition, distribution-shift failure, policy constraints, uncertainty and model-based/model-free taxonomy. Use it to state which offline assumptions each implementation relies on.
- **Required - Paper:** [Implicit Q-Learning](https://arxiv.org/abs/2110.06169) - Derive the expectile value loss, Q target and advantage-weighted policy update. Implement fixed-batch loss tests and compare IQL with behavior cloning across dataset quality and coverage.
- **Support - Paper:** [Conservative Q-Learning for Offline Reinforcement Learning](https://arxiv.org/abs/2006.04779) - Read the conservative regularizer and the lower-bound argument. Implement the regularizer on a fixed batch and show how it lowers Q-values on actions the dataset does not contain.
- **Support - Paper:** [DAgger](https://proceedings.mlr.press/v15/ross11a.html) - Read the no-regret reduction and interactive data-aggregation loop. Demonstrate compounding error in a controlled imitation task, then show exactly what additional expert queries change.
- **Support - Paper:** [Generative Adversarial Imitation Learning](https://arxiv.org/abs/1606.03476) - Read the occupancy-measure view of imitation and the discriminator-as-reward construction. State what GAIL needs that behavior cloning does not (environment interaction) and what it recovers instead of a reward.
- **Support - Paper:** [Cal-QL: Calibrated Offline RL Pre-Training for Efficient Online Fine-Tuning](https://arxiv.org/abs/2303.05479) - Read why conservative values cause an initial dip when online fine-tuning starts and how calibration bounds the values. Measure the first online episodes after offline training with and without the fix.
- **Support - Paper:** [Doubly Robust Off-policy Value Evaluation for Reinforcement Learning](https://arxiv.org/abs/1511.03722) - Read the per-decision importance-sampling estimator, the doubly robust form and its variance analysis. Implement ordinary, weighted and doubly robust estimates on logged trajectories from a small MDP whose true value you can compute.
- **Support - Paper:** [Batch Policy Learning under Constraints (Fitted Q Evaluation)](https://arxiv.org/abs/1903.08738) - Read the Fitted Q Evaluation algorithm and its role inside the constrained learner. Implement FQE on your logged data and compare it with the importance-sampling estimates against the true value.
- **Support - Paper:** [Benchmarks for Deep Off-Policy Evaluation](https://arxiv.org/abs/2103.16596) - Read the evaluation protocol and the metrics for estimator quality and offline model selection (rank correlation, regret of the selected policy). Use them to judge your estimators instead of one point error.
- **Support - Documentation:** [Minari Offline Datasets](https://minari.farama.org/) - Use Minari as the dataset source for offline experiments: it serves Gymnasium-native datasets that download without login (start with a small MuJoCo set such as `mujoco/invertedpendulum/expert-v0`). Record the dataset id and version with every result.
- **Support - Tutorial:** [Hands-on Modern RL - Offline RL and Imitation Concepts](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter12_offline_rl/offline-data-distribution-shift) - Use the offline data and distribution-shift page and the imitation chapter as pre-reading for BCQ, CQL, IQL, behavior cloning, DAgger and GAIL. They have no runnable offline or imitation scripts and no off-policy evaluation. Pin commit 9231bab of walkinglabs/hands-on-modern-rl; its `code/chapterNN` folders do not follow the site chapter numbers.
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

### Study units

#### U1. Known versus learned models, system identification and data collection

**About 4 h** · **Target:** Explain + Implement

Topics: Known versus learned transition and reward models; System identification and data collection

Every later planning step trusts a model. This unit fixes what the model is, how it is fitted, and which data earns that trust.

**You can now**

- Distinguish a known transition and reward model from a learned one, and state which data each claim rests on.
- Fit a one-step dynamics and reward model by supervised regression on fixed interaction data, and report held-out one-step error with the collecting policy named.
- Explain why a model fitted under one policy degrades under another, using data coverage.

**Study**

1. [Lecture 15: Model-Based RL Part 1, Parts 1 and 2](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-15.pdf) (Berkeley CS 185/285 Deep Reinforcement Learning (Spring 2026) - Model-Based RL) - Part 1 (Can we learn a simulator: the notional learned-simulator loop) and Part 2 (Distributional shift in model-based RL: this policy matters, trust regions, confident places).
2. [Lecture 11: Model-Based RL, data and model slides](https://cs224r.stanford.edu/slides/11_cs224r_mbrl_2026.pdf) (Stanford CS224R Spring 2026 - Model-Based RL) - Slides 5 to 10: data coverage with D, learning the simulator by maximizing log likelihood, domain dependence.
3. [Chapter 8, Section 8.1: Models and Planning](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) (Reinforcement Learning: An Introduction (2nd ed.) - Chapter 8) - Section 8.1, printed pp. 159 to 160: distribution versus sample models, and what planning may assume. Depth: Read for vocabulary only. The authors post the full text free at incompleteideas.net; the URL above is the publisher page.

**Focus**

- A known model is given by the environment (rules, kinematics). A learned model is a supervised fit on transitions collected by some policy, and its promises end where that data ends.
- The reward model is learned too. MBPO fits $`p_{\theta}(s'|s,a)`$ and $`r`$ together by maximum likelihood on the environment dataset.
- System identification is regression, not control. Fit first, report held-out one-step error, and only then plan.

**Reproduce:** From a blank file, with `np.random.default_rng(seed)`, draw 200 states $`s \sim U(-0.5, 0.5)`$, then 200 actions $`a \sim N(0, 0.5^2)`$, then 200 noise values $`N(0, 0.05^2)`$, and set $`s' = 0.9 s + a`$ plus the noise. Fit $`s' = w_1 s + w_2 a`$ by least squares with no intercept. Over seeds 0 to 9 the weights land within about 0.03 of $`(0.9, 1)`$ and the training MSE sits near the noise variance 0.0025 (0.0022 to 0.0028). Then report the MSE on 200 fresh transitions from the same policy before any planning claim. Run on CPU.

**Traps**

- Calling simulator access a learned model. A planner that queries privileged state has no sampling error, so its success says nothing about learning.
- Reporting training error only. A dynamics fit can memorize its training transitions and still drift off distribution; held-out error under the collecting policy is the minimum report.
- Assuming the reward function is known. If the reward is fitted, its error enters every plan exactly like dynamics error.

**Practice**

- The section mini-project covers this: known-dynamics sanity case and one-step prediction tests.

**Stop when:** You can fit a one-step model on fixed data, quote its held-out error with the collecting policy named, and say which states would break it.

<details>
<summary>Self-test</summary>

1. What distinguishes a known model from a learned one in one sentence?
   - A known model is given independently of data, while a learned model is a supervised fit on transitions collected by some policy and is only trustworthy near that data.
2. Why must the collecting policy be named alongside a one-step error?
   - The error is measured under that policy's state distribution. A new policy visits new states where the same model can be far worse.
3. A model predicts well on average but the planner fails. Name two suspects before blaming the optimizer.
   - The planner visits states outside the training distribution, or the failures concentrate in decision-relevant regions that average error hides.
4. Does MBPO assume a known reward function?
   - No. It learns the reward together with the dynamics by maximum likelihood on the environment dataset.

</details>

#### U2. One-step and multi-step prediction, open-loop rollout and Model Predictive Control

**About 5 h** · **Target:** Derive + Implement

Topics: One-step and multi-step prediction objectives; Open-loop rollout and closed-loop replanning; Model Predictive Control

A model is used by rolling it forward. This unit turns prediction into decisions, and shows why replanning beats blind execution.

**You can now**

- Derive a finite-horizon planning objective with a terminal value, and state how its return depends on model and reward error.
- Implement open-loop rollout and closed-loop replanning on a small system, and show where they disagree under noise.
- Run Model Predictive Control (execute the first action, replan) and explain why the horizon is not the task horizon.

**Study**

1. [Lecture 11: Model-Based RL, planning slides](https://cs224r.stanford.edu/slides/11_cs224r_mbrl_2026.pdf) (Stanford CS224R Spring 2026 - Model-Based RL) - Slides 21 to 27: Planning V1 (open loop), receding-horizon replanning, Planning V2 with terminal value, full planning algorithm.
2. [Lecture 16: Model-Based RL Part 2, Part 1](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-16.pdf) (Berkeley CS 185/285 Deep Reinforcement Learning (Spring 2026) - Model-Based RL) - Part 1 (Planning with models: deterministic, stochastic open-loop and closed-loop cases, open-loop versus closed-loop terminology).
3. [Chapter 8, Section 8.8: Planning at Decision Time](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) (Reinforcement Learning: An Introduction (2nd ed.) - Chapter 8) - Section 8.8, printed p. 180: background planning versus decision-time planning. Depth: Read for the distinction only. The authors post the full text free at incompleteideas.net; the URL above is the publisher page.
4. [PETS, Algorithm 1 (MPC loop)](https://arxiv.org/abs/1805.12114) (Deep Reinforcement Learning in a Handful of Trials using Probabilistic Dynamics Models (PETS)) - arXiv:1805.12114v2, Section 6, Algorithm 1: sample action sequences with CEM, propagate particles, execute only the first action. Depth: Read the control loop only, not the ensemble training in Sections 4 and 5.

**Focus**

- Open loop commits to a whole action sequence from $`s_t`$. Closed loop replans after each observation, so feedback corrects prediction error while it is still small.
- Planning V2 adds a terminal value $`\hat{V}(\hat{s}_{t+H+1})`$ to the reward sum over $`H`$ steps. Without it a short horizon is myopic; with a bad one it inherits value error.
- MPC executes only the first planned action. The planning horizon $`H`$ is a compute knob, not the task horizon.

**Reproduce:** Closed-book, write the objective over $`H`$ steps $`\sum_{t'=t}^{t+H} r(\hat{s}_{t'}, a_{t'}) + \hat{V}(\hat{s}_{t+H+1})`$ from the current state ($`H + 1`$ reward terms, as slide 26 writes it), then implement receding-horizon control on a deterministic 1D toy and hand-check one 3-step rollout value before executing the first action.

**Traps**

- Executing the full planned sequence in a stochastic system. The later actions were optimized for predicted states, not for the states that occur.
- Setting the planning horizon from the task horizon. A short horizon with a terminal value solves long tasks; a task-length horizon with model error solves none.
- Dropping the terminal value and calling short-horizon control optimal. It is optimal for the truncated problem, which need not match the task.

**Practice**

- The section mini-project covers this: prediction tests and planning tests with a known-dynamics sanity case.

**Stop when:** You can derive the finite-horizon objective with its terminal value, and your receding-horizon loop matches a hand rollout on a deterministic toy.

<details>
<summary>Self-test</summary>

1. What is the operational difference between open-loop and closed-loop use of the same model?
   - Open loop executes the planned sequence without new observations. Closed loop executes the first action, observes the next state, and replans, so feedback corrects drift.
2. Why does Planning V2 add a terminal value after the horizon?
   - The finite sum alone ignores everything after step $`H`$, which makes short-horizon plans myopic. The terminal value estimates the missing tail.
3. A planner with $`H = 5`$ controls a 500-step task well. Does that contradict the task horizon?
   - No. The horizon bounds each lookahead, not the episode. Replanning every step chains short lookaheads across the full task.
4. In PETS Algorithm 1, how many planned actions are executed per control step?
   - One: the first action of the best CEM sequence. The rest are discarded and planning restarts at the next state.

</details>

#### U3. Random shooting and cross-entropy planning against a known-dynamics oracle

**About 4 h** · **Target:** Implement

Topics: Random shooting and cross-entropy method planning; Known-dynamics oracle and simple-controller baseline

Planning bugs and modeling errors look identical downstream. An oracle planner isolates the first, so later failures belong to the model.

**You can now**

- Implement random shooting against a known-dynamics oracle and report its best return with the sample budget stated.
- Implement the cross-entropy method (sample, elite refit, repeat) and show it beating shooting on equal samples.
- Defend the oracle-plus-simple-controller as the baseline every learned-model result must beat.

**Study**

1. [Lecture 16: Model-Based RL Part 2, shooting and CEM slides](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-16.pdf) (Berkeley CS 185/285 Deep Reinforcement Learning (Spring 2026) - Model-Based RL) - Part 1 (Planning with models: random shooting as guess and check, CEM with a Gaussian, CMA-ES pointer, MCTS and trajectory-optimization pointers).
2. [PETS, CEM versus random shooting](https://arxiv.org/abs/1805.12114) (Deep Reinforcement Learning in a Handful of Trials using Probabilistic Dynamics Models (PETS)) - arXiv:1805.12114v2, Sections 5 to 6 with Appendix A.8: CEM with 5 iterations of 500 samples (2500 in total) against random shooting with 2500 samples on the true half-cheetah simulator, so the optimizers are compared without model error (Figure A.11), and the horizon note (Figure A.8).
3. [Lecture 11: Model-Based RL, planning example slide](https://cs224r.stanford.edu/slides/11_cs224r_mbrl_2026.pdf) (Stanford CS224R Spring 2026 - Model-Based RL) - Slide 28: Nagabandi et al. 2019 (ensemble of 3 nets, short-horizon shaped reward, iterative CEM, 30-trajectory alternation).

**Focus**

- Random shooting samples $`N`$ sequences and keeps the best. CEM fits the next Gaussian to the elite fraction and repeats, so later samples concentrate where returns were high.
- The comparison is only fair on equal model queries. CEM with 5 iterations of 500 samples (2500 in total) beats shooting with 2500 samples because it reallocates them, not because it uses more.
- The oracle uses true dynamics. Its return is the planner ceiling: a learned model that scores below a simple controller on the oracle has a planning problem, not a modeling problem.

**Reproduce:** From a blank file with one `np.random.default_rng(0)` stream, plan $`s' = s + a`$ with reward $`-(s')^2 - 0.01 a^2`$ from $`s_0 = 2`$ over $`H = 3`$ with actions in $`[-1, 1]`$. Draw 200 uniform sequences for random shooting: the best scores -1.4964 at $`[-0.810, -0.990, -0.354]`$. Continue the same stream for CEM from mean 0 and standard deviation 1: each iteration draws 200 Gaussian sequences clipped to $`[-1, 1]`$, keeps the top 20 percent, and refits the mean and per-step standard deviation to them. The mean return of the elites is -2.4868, -1.2234 and -1.0640 across 3 iterations, against an optimum of about -1.02 near $`[-1, -0.99, 0]`$. CEM spent 600 samples, so rerun shooting with 600 before claiming a win on equal samples. Run on CPU.

**Traps**

- Refitting CEM to all samples instead of the elites. The mean then barely moves and the method degrades to shooting with extra steps.
- Letting the elite fraction collapse the variance to zero in one iteration. Keep a small variance floor so later iterations can still search.
- Presenting the oracle return as a model-based result. It used no learning; it is the baseline, not the achievement.

**Practice**

- The section mini-project covers this: known-dynamics sanity case with planning tests before any learned model.

**Stop when:** Your shooting and CEM implementations match the four seed-0 numbers, and you can state the oracle return as the planner ceiling for your later model.

<details>
<summary>Self-test</summary>

1. Why does CEM beat random shooting on the same total sample budget?
   - It spends later samples near the best sequences found so far by refitting the sampling distribution to the elites, while shooting spreads every sample over the initial broad distribution.
2. What does PETS Figure A.11 establish, exactly?
   - On the true half-cheetah simulator, CEM with 5 iterations of 500 samples (2500 in total) plans significantly better than random shooting with 2500 samples. It is the paper's planning comparison on the paper's setup, not a learner target.
3. Your learned-model planner scores below random shooting on the true dynamics. What is broken?
   - The planner or its budget, not the model: the oracle test removes modeling error, so the gap must come from planning.
4. Should the executed action be the first element of the CEM mean or the full mean sequence?
   - Under MPC, only the first action, followed by replanning. Executing the full sequence is open loop and forfeits feedback.

</details>

#### U4. Dyna-style imagined experience and imagined versus real accounting

**About 4 h** · **Target:** Implement + Measure

Topics: Dyna-style real and imagined experience; Imagined versus real sample and compute accounting

Dyna is the oldest recipe for turning a model into data. Its loop and its accounting rules recur in every modern imagined-data method.

**You can now**

- Implement tabular Dyna-Q from its boxed steps, including the planning-sampling rule for states and actions.
- Reproduce the Dyna maze rank order (more planning steps reach near-optimal behavior in fewer episodes) as the book reports it.
- Account imagined and real updates separately, and state the sample budget both ways.

**Study**

1. [Chapter 8, Section 8.2: Dyna](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) (Reinforcement Learning: An Introduction (2nd ed.) - Chapter 8) - Section 8.2, printed pp. 161 to 165: Figure 8.1 (Dyna architecture), the Tabular Dyna-Q box (printed p. 164), Example 8.1 with Figures 8.2 and 8.3. Depth: Steps (d), (e) and (f) of the box are the implementation contract. The authors post the full text free at incompleteideas.net; the URL above is the publisher page.
2. [Lecture 16: Model-Based RL Part 2, Dyna slides](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-16.pdf) (Berkeley CS 185/285 Deep Reinforcement Learning (Spring 2026) - Model-Based RL) - Part 2 (Policy learning with models: the Dyna box slide and the general Dyna-style recipe slide).
3. [Lecture 11: Model-Based RL, Dyna slide](https://cs224r.stanford.edu/slides/11_cs224r_mbrl_2026.pdf) (Stanford CS224R Spring 2026 - Model-Based RL) - Slides 11 to 12: the 4-step MBPO loop labeled as the algorithm called Dyna.

**Focus**

- Direct RL, model learning and planning run the same update. Step (d) learns from real experience, step (f) replays the identical Q-learning update on imagined experience.
- Planning samples a random previously observed state and a random action previously taken there, then queries the stored model. Unseen pairs are never sampled because the model has no entry for them.
- With $`n = 0`$ the agent is plain one-step Q-learning. The book reports about 25 episodes to near-optimal behavior for $`n = 0`$, 5 for $`n = 5`$, and 3 for $`n = 50`$: rank order on the book's maze, not a learner target.

**Reproduce:** From a blank file, implement steps (a) to (f) of the Tabular Dyna-Q box on a small deterministic chain with $`\gamma = 0.95`$. Hand-compute one direct update and one planning update for the same transition, and show your code produces both numbers exactly.

**Traps**

- Counting imagined updates as environment samples. Report real steps and imagined updates as two numbers; the sample-efficiency claim divides by the first.
- Filling unseen model entries with zeros or defaults. The box samples only previously observed pairs; invented entries silently teach invented dynamics.
- Keeping the overwrite model of step (e) in a stochastic or changing world. One stored outcome per pair then teaches noise as fact; Exercise 8.5 asks exactly for this failure.

**Practice**

- [Sutton and Barto, Exercise 8.1 (Dyna versus multi-step methods)](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) - Exercise 8.1, printed p. 166: argue whether a Chapter 7 multi-step method could match Dyna on the maze
- [Sutton and Barto, Exercise 8.4 (programming: bonus in selection only)](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) - Exercise 8.4 (programming), printed p. 168: test putting the exploration bonus only in action selection on a gridworld

**Stop when:** Your box implementation matches both hand updates, and you can quote any Dyna result with real steps and imagined updates stated separately.

<details>
<summary>Self-test</summary>

1. What does Dyna-Q with $`n = 0`$ reduce to, and why?
   - One-step tabular Q-learning. Steps (e) and (f) are omitted, leaving acting plus the direct update in step (d).
2. State the planning-sampling rule of step (f) precisely.
   - Draw a random previously observed state and a random action previously taken in it, look up the stored reward and next state, and apply the Q-learning update.
3. Why did larger $`n`$ reach near-optimal behavior in fewer episodes on the Dyna maze?
   - Each real step funds $`n`$ extra Q-learning updates on simulated experience, so values propagate to the start far earlier. The cost moves to compute, not samples.
4. What changes in Dyna-Q+ when the world changes, in one sentence?
   - Planning updates add a bonus $`r + \kappa\sqrt{\tau}`$ that grows with time since the pair was last tried for real, so the agent retests stale transitions.

</details>

#### U5. Model ensembles, epistemic and aleatoric uncertainty and pessimistic planning

**About 5 h** · **Target:** Derive + Implement

Topics: Model ensembles and epistemic uncertainty; Aleatoric uncertainty and stochastic dynamics; Uncertainty penalties and pessimistic planning

A single deterministic model is confidently wrong off data. Uncertainty tells the planner where the model ends and guessing begins.

**You can now**

- Define epistemic versus aleatoric uncertainty, and say which shrinks with more data.
- Derive the Gaussian negative log-likelihood for a probabilistic dynamics model and the ensemble disagreement statistic.
- Implement a small ensemble, show members disagreeing away from data, and apply an uncertainty penalty in planning.

**Study**

1. [Lecture 15: Model-Based RL Part 1, Part 3](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-15.pdf) (Berkeley CS 185/285 Deep Reinforcement Learning (Spring 2026) - Model-Based RL) - Part 3 (Uncertainty-aware neural networks: output entropy is not enough, aleatoric versus epistemic uncertainty, bootstrap ensembles, SGD plus initialization usually suffices).
2. [PETS, uncertainty model and trajectory sampling](https://arxiv.org/abs/1805.12114) (Deep Reinforcement Learning in a Handful of Trials using Probabilistic Dynamics Models (PETS)) - arXiv:1805.12114v2, Section 4 (probabilistic ensemble: each member outputs a Gaussian) and Section 5.1 (trajectory sampling: TS1 resamples a bootstrap for each particle every time step, TS$`\infty`$ keeps one bootstrap per particle for the whole trial). Depth: The Hands-on model-based page calls the one-member-per-rollout scheme TS1; in the paper that scheme is TS$`\infty`$.
3. [Lecture 11: Model-Based RL, ensemble slide](https://cs224r.stanford.edu/slides/11_cs224r_mbrl_2026.pdf) (Stanford CS224R Spring 2026 - Model-Based RL) - Slide 17: partial rollouts from real states plus an ensemble whose errors average out.

**Focus**

- Aleatoric uncertainty is noise in the world and stays with infinite data. Epistemic uncertainty is ignorance of the parameters and shrinks where data covers the region.
- Each PETS member outputs a Gaussian mean and diagonal variance for $`(s', r)`$. Disagreement of means across members estimates the epistemic part; the predicted variances carry the aleatoric part.
- Pessimism penalizes or constrains plans by uncertainty. Expected value under a high-variance prediction can look fine while the pessimistic value is very low.

**Reproduce:** From a blank file, build 3 fixed one-step predictors $`f_1(x) = x`$, $`f_2(x) = x + 0.1 x^2`$ and $`f_3(x) = x - 0.1 x^2`$, which agree at the training input $`x = 0`$ and diverge away from it. With the population standard deviation (`np.std` with `ddof=0`), the disagreement at $`x = 0.0`$, $`1.0`$ and $`3.0`$ is 0.0000, 0.0816 and 0.7348: reproduce all three on CPU, then derive the diagonal-Gaussian negative log-likelihood your probabilistic member would minimize.

**Traps**

- Training every member on identical data with an identical seed. Without initialization or batch diversity the members agree everywhere and the disagreement statistic is theater.
- Reading predictive variance as model uncertainty. An output variance can encode pure environment noise; epistemic doubt needs member disagreement or a posterior.
- Planning on the ensemble mean as if it were a real dynamics. The mean of plausible models is itself an artificial environment; PETS propagates particles through sampled members instead (TS1 resamples every step, TS$`\infty`$ once per trial).

**Practice**

- The section mini-project covers this: ensemble-disagreement checks and a model-exploitation failure with an uncertainty penalty.

**Stop when:** You reproduce the three disagreement numbers, derive the Gaussian loss, and can point at a state where your ensemble disagrees and say what the planner must do there.

<details>
<summary>Self-test</summary>

1. Which uncertainty shrinks with more data, and which does not?
   - Epistemic uncertainty shrinks as data covers the region. Aleatoric uncertainty is inherent environment stochasticity and remains with infinite data.
2. Why is output entropy alone not enough for model uncertainty?
   - It conflates the two kinds: a model can be certain about a noisy world (high aleatoric, low epistemic) or uncertain about a deterministic one (low aleatoric, high epistemic).
3. How do TS1 and TS$`\infty`$ differ, and what does keeping one member per particle buy?
   - TS1 resamples each particle's bootstrap every time step; TS$`\infty`$ keeps it for the whole trial. Holding the member fixed respects time-invariant dynamics and makes the uncertainties separable: variance within one member is aleatoric, variance across members is epistemic. The paper notes TS1 softly restricts trajectory multimodality.
4. What does a pessimistic penalty change about the chosen plan?
   - It downweights plans whose predicted return has high uncertainty, steering away from regions where the model may be exploited even when the mean looks good.

</details>

#### U6. Compounding error, decision-relevant error and model exploitation

**About 4 h** · **Target:** Measure

Topics: Compounding model error over horizon; Decision-relevant versus average prediction error; Model exploitation and adversarial plans

Small one-step errors become large trajectory errors, and optimizers seek exactly the states where the model is wrong. This unit makes both effects measurable.

**You can now**

- Bound compounding one-step error over a horizon under a Lipschitz assumption, and name the three regimes.
- Distinguish average prediction error from decision-relevant error with a slice the average hides.
- Induce model exploitation on a small task: a plan that scores well in the model and fails in the system.

**Study**

1. [Model-Based RL: error recursion](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter11_continuous_control/model-based#a-key-limitation-of-dyna) (Hands-on Modern RL - Model-Based and World-Model Sections) - A Key Limitation of Dyna: the recursion $`e_{t+1} \le L e_t + \epsilon`$ with the three regimes (page read 2026-10-14). Depth: Recompute the numbers yourself: with $`L = 1.01`$ and $`\epsilon = 0.01`$ the exact bounds are 0.01, 0.051, 0.220 and 1.705 at 1, 5, 20 and 100 steps, so the page's 2.7 at 100 steps (which quotes $`1.01^{100}`$) is a slip. Its "about $`1174\epsilon`$" for $`L = 1.1`$ and $`T = 50`$ also drops the $`-1`$: the sum is $`1163.9\epsilon`$, or 11.6391 at $`\epsilon = 0.01`$.
2. [Chapter 8, Section 8.3: When the Model Is Wrong](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) (Reinforcement Learning: An Introduction (2nd ed.) - Chapter 8) - Section 8.3, printed pp. 166 to 168: optimistic errors self-correct, pessimistic ones hide; Examples 8.2 and 8.3 with Figures 8.4 and 8.5. Depth: Read for the exploitation mechanism. The authors post the full text free at incompleteideas.net; the URL above is the publisher page.
3. [MBPO: compounding error and long rollouts](https://arxiv.org/abs/1906.08253) (When to Trust Your Model: Model-Based Policy Optimization) - arXiv:1906.08253v3, Sections 4.2 and 6.2 with Figure 3: full rollouts compound error, 200-step rollouts underperform short ones, 500-step rollouts fail.

**Focus**

- With one-step error at most $`\epsilon`$ and Lipschitz constant $`L`$, the bound after $`T`$ steps is the geometric sum $`\epsilon \sum_{i=0}^{T-1} L^i`$: convergent for $`L < 1`$, linear for $`L = 1`$, exponential for $`L > 1`$.
- Average error weights states by the training distribution. The planner weights them by predicted return, so it migrates to low-data high-reward fantasies the average never sees.
- Optimistic model errors self-correct (the plan visits and refutes them). Pessimistic or hidden errors persist: the shortcut maze agent never discovers the path it believes is blocked.

**Reproduce:** From a blank file with $`\epsilon = 0.01`$, compute the recursion $`e_{t+1} = L e_t + \epsilon`$ from $`e_0 = 0`$. Match 0.0995, 0.50 and 11.6391 at $`T = 50`$ for $`L = 0.9`$, $`1.0`$ and $`1.1`$, and 0.0100, 0.0510, 0.2202 and 1.7048 at $`T = 1`$, $`5`$, $`20`$ and $`100`$ for $`L = 1.01`$. Run on CPU and match all seven numbers.

**Traps**

- Quoting $`1.01^{100} \approx 2.7`$ as the 100-step bound. That is the growth factor, not the accumulated error; the geometric sum is 1.7048 at $`\epsilon = 0.01`$.
- Treating one-step validation MSE as control quality. A model can halve its MSE while its planner gets worse if the remaining error sits on the optimal path.
- Testing exploitation with the planner's own imagined returns. Score every candidate plan in the real system (or oracle); imagined scores are the suspect, not the judge.

**Practice**

- [Sutton and Barto, Exercises 8.2 and 8.3 (blocking and shortcut mazes)](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) - Exercises 8.2 and 8.3, printed pp. 167 to 168: explain the Dyna-Q+ phase behavior on Figures 8.4 and 8.5

**Stop when:** You match all seven bound numbers from memory of the method, and can construct a plan that exploits a stipulated model error on demand.

<details>
<summary>Self-test</summary>

1. State the three compounding regimes and the $`T = 50`$, $`\epsilon = 0.01`$ bounds.
   - Convergent ($`L = 0.9`$): 0.0995. Linear ($`L = 1`$): 0.50. Exponential ($`L = 1.1`$): 11.6391.
2. Why can average error fall while control gets worse?
   - Average error weights by training visitation. The planner shifts visitation toward states with high predicted return and thin data, where error can be large despite a good average.
3. Why did the blocking-maze agent recover but the shortcut-maze agent not?
   - The blocking error was optimistic: the plan tried the phantom path and observed the wall. The shortcut error was pessimistic: the plan avoided the believed-blocked region, so it never collected the refuting observation.
4. What is the minimal demonstration of model exploitation?
   - A plan whose imagined return exceeds its real return by a margin that grows with optimization pressure, with the gap reproduced across seeds.

</details>

#### U7. Policy-induced shift, data aggregation and fallback replanning

**About 4 h** · **Target:** Explain + Implement

Topics: Policy-induced distribution shift; Data aggregation after policy distribution changes; Fallback and replanning under uncertainty

A model is fitted to yesterday's policy and used by tomorrow's. Without aggregation and fallback, each improvement walks further off the data.

**You can now**

- Explain policy-induced shift: why improving the policy invalidates the model that suggested the improvement.
- Implement a data-aggregation loop (collect under the new policy, refit, repeat) and show error falling on the new distribution.
- Define a fallback rule: when uncertainty is high, shorten the horizon, replan sooner, or hand control back.

**Study**

1. [Lecture 15: Model-Based RL Part 1, Part 2](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-15.pdf) (Berkeley CS 185/285 Deep Reinforcement Learning (Spring 2026) - Model-Based RL) - Part 2 (Distributional shift in model-based RL: do not change the policy too much, stick to confident places, pessimism penalty).
2. [Lecture 11: Model-Based RL, distribution-shift slides](https://cs224r.stanford.edu/slides/11_cs224r_mbrl_2026.pdf) (Stanford CS224R Spring 2026 - Model-Based RL) - Slides 13 to 17: data distribution mismatch under the updated policy, partial trajectories from all states in the data, horizon plot from MBPO.
3. [MBPO: model generalization under policy shift](https://arxiv.org/abs/1906.08253) (When to Trust Your Model: Model-Based Policy Optimization) - arXiv:1906.08253v3, Section 4.3 with Figure 1: model error rises with policy KL, and more data from the collecting policy flattens the rise.

**Focus**

- Shift is mechanical: the planner optimizes $`\eta`$ under $`p_{\theta}`$, the resulting policy visits new states, and $`p_{\theta}`$ was never fitted there. Improvement creates its own invalidation.
- Aggregation answers with fresh real data: run the new policy in the system, append the transitions, refit. Imitation has the same loop under the name DAgger, except here the system (not an expert) labels the new states.
- Fallback is a predeclared rule, not a feeling: above an uncertainty threshold, shorten $`H`$, replan every step, or refuse the imagined plan and collect real data.

**Reproduce:** From a blank file with `np.random.default_rng(seed)`, let the true system bend slightly: $`s' = 0.9 s + a + 0.02 s^2`$ plus $`N(0, 0.05^2)`$ noise, with actions $`a \sim N(0, 0.5^2)`$. Fit $`s' = w_1 s + w_2 a`$ on 200 transitions with $`s \sim U(-0.5, 0.5)`$; its held-out MSE stays near the noise variance 0.0025. Test it on 200 transitions from a policy living at $`s \sim U(4.5, 5.5)`$: over seeds 0 to 9 the MSE jumps to 0.13 to 0.30. Append 200 real far transitions, refit, and test on fresh far data: the MSE falls to about 0.003, while near-data error rises only slightly. Run on CPU.

**Traps**

- Refitting on imagined rollouts. The model teaching itself confirms its own errors; only real transitions from the new policy fix the shift.
- Constraining the policy so tightly to the data that it cannot improve. The trust region must bind the step, not freeze it; aggregation (not a smaller step) is what permits progress.
- Replanning without a compute budget. Closed-loop control at every step costs a full planning run per step; state the replanning rate alongside the horizon.

**Practice**

- The section mini-project covers this: the data-aggregation loop and fallback-replanning tests under uncertainty.

**Stop when:** You reproduce the before and after MSE ranges and can state your aggregation and fallback rules before running any planner.

<details>
<summary>Self-test</summary>

1. Why does a better policy mean a worse model, without any bug?
   - The model was fitted under the old policy's visitation. The better policy visits new states where the fit is untested, so error rises with the policy change.
2. What does Figure 1 of MBPO add beyond that qualitative story?
   - Two measured facts: model error grows with policy KL, and models trained on more collecting-policy data both start lower and rise more slowly. Data volume buys generalization, not just fit.
3. How does model-based aggregation differ from DAgger?
   - Both collect under the new policy and retrain. DAgger queries an expert for the right action; here the system supplies the true next state and reward, with no expert needed.
4. State a concrete fallback rule for an MPC controller.
   - If ensemble disagreement at the current state exceeds a fixed threshold, halve the horizon and replan next step; past a second threshold, execute a safe default action and log a real transition.

</details>

#### U8. Model-Based Policy Optimization and the rollout-horizon trade-off

**About 4 h** · **Target:** Derive + Implement

Topics: Rollout horizon and model-bias trade-offs; Model-Based Policy Optimization

MBPO is the disciplined form of imagined data: short rollouts from real states, so the model is only asked for what it can answer.

**You can now**

- Derive the branched-rollout bound's trade-off between a term decaying in $`k`$ and one growing in $`k`$, and explain why only the measured model error under the new policy makes a nonzero $`k`$ optimal.
- Implement MBPO-style branched rollouts: sample a real state from the buffer, roll $`k`$ model steps under the current policy, store the transitions.
- Sweep the rollout horizon $`k`$ and retain the value where model bias reverses the gain, with a matched model-free control.

**Study**

1. [MBPO: bound, algorithm and horizon evidence](https://arxiv.org/abs/1906.08253) (When to Trust Your Model: Model-Based Policy Optimization) - arXiv:1906.08253v3, Section 4.1 (Theorem 4.1, monotonic improvement with model bias), Section 4.2 (Theorem 4.2, branched rollouts), Section 4.3 with Figure 1 and Theorem 4.3 (model error under the updated policy), Section 5 with Algorithm 2 (ensemble, SAC, k-step rollouts from buffer states), Section 6.2 with Figure 3 (Hopper schedule, single-step baseline, no-model control).
2. [Lecture 11: Model-Based RL, MBPO slides](https://cs224r.stanford.edu/slides/11_cs224r_mbrl_2026.pdf) (Stanford CS224R Spring 2026 - Model-Based RL) - Slides 11 to 18: the Dyna-to-MBPO algorithm, distribution mismatch, partial rollouts from all data states, ensemble error averaging.
3. [Lecture 16: Model-Based RL Part 2, short-rollout slides](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-16.pdf) (Berkeley CS 185/285 Deep Reinforcement Learning (Spring 2026) - Model-Based RL) - Part 2 (Policy learning with models: the curse of long rollouts, short rollouts from real states, MBA, MVE and MBPO).

**Focus**

- A branched rollout starts from a real buffer state and runs $`k`$ model steps. Short $`k`$ keeps every query near data; the buffer (not the model) supplies coverage of later task stages.
- Theorem 4.2 bounds true return by branched return minus a term that decays exponentially in $`k`$ and one that grows linearly in $`k`$. Taken literally its constants put the best $`k`$ at 0, no model at all. Section 4.3 measures that model error grows slowly with policy shift, and Theorem 4.3, written with that error, has its optimum at $`k > 0`$ when the error is low enough.
- The paper's numbers are the paper's results: Hopper's best schedule rises from $`k = 1`$ to 15, fixed $`k = 1`$ keeps most of the gain, 200-step rollouts underperform, 500-step rollouts fail, and Ant at 300k steps matches SAC at 3M. Reproduce the design on your task, not these returns.

**Reproduce:** Closed-book, state Algorithm 2 lines 6 to 8 in your own words (sample $`s_t`$ from the environment dataset, perform a model rollout of $`k`$ steps under the current policy, add the transitions to the model dataset), then implement that sampler against a scripted buffer and verify every stored transition carries its branch-start state.

**Traps**

- Branching from the initial-state distribution. That re-entangles model horizon with task horizon and reintroduces the compounding the method was built to avoid.
- Raising gradient updates per sample without model data. Figure 3 runs that control (G): it learns slightly faster but never matches MBPO, so the model (not the update count) earns the gain.
- Tuning $`k`$ on test return and reporting the best. Sweep $`k`$ on a fixed protocol, keep the full curve including the value where bias reverses the gain, and report spread across seeds.

**Practice**

- The section mini-project covers this: horizon sweeps with the bias-reversal point retained, and a matched model-free comparison.

**Stop when:** You can implement the branched sampler from memory and defend a horizon choice with a full sweep curve, not a best point.

<details>
<summary>Self-test</summary>

1. Why do branched rollouts see all task stages despite being short?
   - Branch starts are sampled from every stage of real trajectories in the buffer. Each rollout is short, but the set of starts covers the task.
2. Does Theorem 4.2 by itself argue for a short but nonzero $`k`$?
   - No. It has one term decaying exponentially in $`k`$ and one growing linearly, but with its constants the bound is maximized at $`k = 0`$. The case for short nonzero rollouts is Theorem 4.3, which replaces the pessimistic model error with the measured error under the new policy (Figure 1).
3. What does the no-model (G) control in Figure 3 rule out?
   - That MBPO wins merely by taking more gradient steps per environment sample. SAC with the same high update ratio improves slightly but does not match MBPO.
4. Why is SAC swappable inside Algorithm 2?
   - The policy optimizer trains on the mixed real-plus-model dataset. Any off-policy method that consumes that dataset fits the same slot.

</details>

#### U9. Latent-state dynamics and world-model policy learning

**About 4 h** · **Target:** Explain

Topics: Latent-state dynamics and representation learning; World-model policy learning vocabulary

Pixels are too high-dimensional to roll forward directly. A compact latent dynamics turns image control into a plannable problem.

**You can now**

- Explain the latent world-model factorization: encoder posterior, dynamics prior, decoder, and reward predictor.
- State why the recurrent model state is Markovian while a single observation need not be.
- Trace the Dreamer loop: encode real sequences, imagine trajectories, train actor-critic on imagination.

**Study**

1. [Lecture 16: Model-Based RL Part 2, latent-model slides](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-16.pdf) (Berkeley CS 185/285 Deep Reinforcement Learning (Spring 2026) - Model-Based RL) - Part 3 (Representing the model: latent state-space models, prior versus encoder versus decoder, single-step encoder limits, actor-critic with learned representations).
2. [DreamerV3: world model and behavior learning](https://arxiv.org/abs/2301.04104) (Mastering Diverse Domains through World Models) - arXiv:2301.04104v2, Learning algorithm section with Figure 3 (RSSM encoder, recurrent state and stochastic representation, actor-critic from imagined trajectories) and Figure 1 (fixed hyperparameters across 150 plus tasks, Minecraft diamonds).
3. [Search and World Models: Dreamer V3](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter11_continuous_control/search-world-models#dreamer-v3-and-a-new-generation-of-world-models) (Hands-on Modern RL - Model-Based and World-Model Sections) - Dreamer V3 and a New Generation of World Models: RSSM sketch, actor-critic in imagination, generality claims (page read 2026-10-14). Depth: Use as a concept map only. Its code sketches are teaching illustrations, and benchmark claims (150 plus tasks, outperforming SAC and PPO) are the paper's results, not learner targets; no large reproduction belongs in the exit gate.

**Focus**

- The model has four learnable maps: posterior $`q(z|h,x)`$ infers the stochastic state from the observation, prior $`p(z|h)`$ predicts it without the observation, the decoder reconstructs inputs from $`(h,z)`$, and predictors emit reward and continuation flags.
- Training matches prior to posterior (KL with free bits) while the decoder keeps representations informative. The pair $`s = (h, z)`$ is the Markovian imagination state even when one image is not.
- The actor-critic never sees real transitions directly: it trains on trajectories dreamed from replayed states. Representation quality therefore bounds policy quality.

**Reproduce:** Closed-book, write the four maps with their inputs and outputs, the two KL losses (dynamics and representation, each clipped at 1 nat of free bits), and the three Dreamer networks (world model, critic, actor) with what each consumes and produces. Then explain in two sentences why the decoder exists.

**Traps**

- Planning or dreaming on raw pixels. The whole point is that dynamics live in the compact state; pixel prediction is a training signal, not the planning space.
- Using a deterministic single-step encoder and calling it a world model. Without a stochastic state and a prior to match, imagination collapses to the mean trajectory.
- Reading representation loss as task progress. It measures predictability of the latent state, not reward; a tidy model of a useless representation still fails.

**Practice**

- The section mini-project covers this: latent-dynamics prediction tests on an encoded state, at small scale.

**Stop when:** You can write the four maps, both KL losses and the dream loop from memory, and explain what each part would break if removed.

<details>
<summary>Self-test</summary>

1. What do the prior and posterior each condition on, and why must both exist?
   - The posterior conditions on history and the current observation; the prior on history alone. Imagination has no future observations, so it must roll the prior; training matches the prior to the better-informed posterior.
2. Why is $`(h, z)`$ Markovian when one observation is not?
   - The recurrent state summarizes the observation history and the stochastic state captures residual uncertainty, so the next pair depends only on the current pair and action by construction.
3. What breaks if the decoder is removed?
   - Nothing forces representations to carry observation content. The dynamics losses alone admit trivially predictable but uninformative states.
4. What do free bits do in one sentence?
   - Each KL loss becomes $`\max(1, \text{KL})`$, so once a term is below 1 nat it stops pulling and learning focuses on the prediction loss.

</details>

#### U10. Monte Carlo Tree Search

**About 3 h** · **Target:** Implement

Topics: Monte Carlo Tree Search

MCTS focuses simulation where earlier simulations looked promising. It is the planner behind the game-playing results and the template for search with learned models.

**You can now**

- Implement the four MCTS steps (selection, expansion, simulation, backup) with a tree policy and a rollout policy.
- Apply UCB selection inside the tree by hand on a fixed visit-count case.
- State when MCTS is the right planner: a fast simulatable model with time for many rollouts per move.

**Study**

1. [Chapter 8, Section 8.11: Monte Carlo Tree Search](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) (Reinforcement Learning: An Introduction (2nd ed.) - Chapter 8) - Section 8.11, printed pp. 185 to 187: rollout-algorithm base, the four steps with Figure 8.10, UCB tree policy, final action by value or visit count. Depth: Implement the basic four-step version. The authors post the full text free at incompleteideas.net; the URL above is the publisher page.
2. [Search and World Models: AlphaZero loop](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter11_continuous_control/search-world-models#alphazero-and-the-full-realization-of-search-with-learning) (Hands-on Modern RL - Model-Based and World-Model Sections) - The Core AlphaZero Loop with the PUCT formula and Self-Play Training (page read 2026-10-14). Depth: Use for the neural plus search vocabulary only. Simulation counts and match results (800 simulations, Stockfish, Go) are author-reported history, not runnable targets.
3. [Lecture 11: Model-Based RL, game-planning slide](https://cs224r.stanford.edu/slides/11_cs224r_mbrl_2026.pdf) (Stanford CS224R Spring 2026 - Model-Based RL) - Slide 29: AlphaGo (known rules, 1 to 40 move horizon with terminal value, policy narrows the search, value trained by Monte Carlo regression).

**Focus**

- MCTS is a rollout algorithm with memory. Selection and expansion grow a tree over the promising prefix; simulation completes episodes with the rollout policy; backup updates only the tree edges the tree policy traversed.
- Inside the tree, actions come from a UCB-style tree policy balancing value and visit counts. Beyond the tree, actions come from the (possibly random) rollout policy, and those states save nothing.
- The delivered action is a function of root statistics (best value or most visits), and the next move reruns the whole process from the new state, optionally keeping the surviving subtree.

**Reproduce:** From a blank file, implement selection, expansion, simulation and backup on tic-tac-toe or a small gridworld with a known model. Separately, hand-compute UCB with $`c = \sqrt{2}`$ at a node with 10 visits and children $`(n=7, Q=0.9)`$ and $`(n=3, Q=0.6)`$: scores 1.7111 and 1.8390, so selection picks the less-visited child despite its lower value. Match both numbers.

**Traps**

- Backing up values into states visited only by the rollout policy. Only tree edges traversed by the tree policy are updated; rollout states beyond the tree save nothing.
- Applying UCB to unvisited actions. With $`n = 0`$ the bonus divides by zero; expand untried actions first instead of scoring them.
- Picking the final action by noisy value when visit counts disagree. The book offers the most-visited root action as the choice that avoids selecting outliers.

**Practice**

- The section mini-project covers this: planning tests with a simulation budget stated per move.

**Stop when:** Your four-step implementation runs on a small game, your hand UCB numbers match, and you can state the per-move simulation budget your result rests on.

<details>
<summary>Self-test</summary>

1. Why is MCTS called a rollout algorithm with memory?
   - Each iteration runs a rollout-style simulation from the current state, but the tree accumulates value estimates across iterations and steers later simulations toward promising prefixes.
2. In the hand case above, why does selection pick the child with fewer visits?
   - Its UCB score 1.8390 exceeds 1.7111: the larger exploration bonus for 3 visits against 7 outweighs the 0.3 value gap, which is exactly the intended explore-exploit trade.
3. What do the policy and value networks contribute in AlphaZero's MCTS?
   - The policy prior narrows search width toward promising actions and the value network evaluates leaves directly, cutting the depth the search must reach.
4. When is MCTS the wrong planner for a learned model?
   - When one model step is slow or the budget allows few simulations per move: MCTS needs fast multistep simulation and many rollouts to focus the tree.

</details>

#### U11. Planner, model, reward and policy error attribution with matched model-free baselines

**About 4 h** · **Target:** Measure

Topics: Planner, model, reward and policy error attribution; Model-free baseline under matched real interactions; One-step, multi-step, uncertainty and control evaluation

A model-based win can come from the planner, the tuning, or extra samples rather than the model. This unit makes the win honest.

**You can now**

- Design swap experiments that isolate planner, model, reward and policy error on a fixed task.
- Run a model-free baseline under matched real interactions and compute, and report spread across seeds, not one run.
- Defend whether the learned model earns its complexity at the section exit gate.

**Study**

1. [MBPO: design evaluation controls](https://arxiv.org/abs/1906.08253) (When to Trust Your Model: Model-Based Policy Optimization) - arXiv:1906.08253v3, Section 6.2 with Figure 3: the no-model high-update control and the value-expansion comparison beside the rollout-length sweep.
2. [Lecture 11: Model-Based RL, summary slides](https://cs224r.stanford.edu/slides/11_cs224r_mbrl_2026.pdf) (Stanford CS224R Spring 2026 - Model-Based RL) - Slides 30 to 34: summary (short rollouts, ensembles), when to use model-based RL, other model kinds.
3. [Lecture 15: Model-Based RL Part 1, cost slides](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-15.pdf) (Berkeley CS 185/285 Deep Reinforcement Learning (Spring 2026) - Model-Based RL) - Part 1 (Can we learn a simulator: compute cost of big models, planning on pixels is hard, simpler models can plan better).

**Focus**

- Attribute by swapping one part at a time: oracle dynamics with the learned planner isolates planner error; the learned model with oracle actions probes decision-relevant error; a fitted reward against the true reward isolates reward error.
- Match on real interactions and compute: imagined transitions cost nothing to collect, so budgets count environment steps plus wall-clock planning time, with seeds, environment version and evaluation policy fixed.
- Keep every run, including the horizons that failed. The bias-reversal point from the MBPO unit is evidence; a best-horizon report is selection.

**Reproduce:** From a blank file, write the attribution plan for your task as a table: rows for planner, model, reward and policy swaps, each naming the frozen parts, the metric (one-step error, multi-step error, uncertainty calibration, control return), and the matched budget. Then run the model-free control (same real steps, same seeds) and fill the return column with means and spread.

**Traps**

- Counting imagined samples as real interaction. Sample efficiency divides by environment steps; imagined data belongs in the compute column.
- Comparing wall time across different planners on different hardware. Fix the machine or report planning queries per move, not seconds across setups.
- Letting the model baseline see privileged state. If the oracle test uses true simulator internals that the learner never observes, the comparison is void.

**Practice**

- The section mini-project covers this: matched model-free comparison with per-run records, including failures.

**Stop when:** Your attribution table is filled with matched numbers and spread, and you can state the operating range where the model earns its keep.

<details>
<summary>Self-test</summary>

1. How do you isolate planner error from model error?
   - Run the same planner on oracle dynamics. Remaining failure is planning (horizon, budget, optimizer), since modeling error is zero by construction.
2. What must a model-free baseline match, exactly?
   - Real environment steps, compute budget, seeds, environment and wrapper versions, tuning effort, and the evaluation policy. Matched means all of them.
3. Why keep failed horizons in the report?
   - They show where model bias reverses the gain and bound the honest operating range. Dropping them turns a trade-off curve into a selected point.
4. When is the added complexity justified at the exit gate?
   - When the learned-dynamics controller passes the oracle sanity case, survives an induced exploitation or compounding failure with a diagnosis, and beats the matched baseline by a margin that survives seeds.

</details>

### Mini-project: Learned dynamics with honest planning attribution

**About 10 to 14 hours.** Extend `policylab` with an `mbrl/` laboratory: fitted dynamics, ensembles, short-horizon rollouts and search planners over small systems. Prove the planner on a known-dynamics oracle before trusting any learned model. Attribute every win to model, planner or budget with matched model-free controls.

1. Prove the planner first on a known-dynamics sanity case in `mbrl/`: one-step prediction tests, open-loop against closed-loop replanning, random shooting versus CEM on equal model queries, and a simple-controller baseline as the ceiling.
2. Fit an ensemble of probabilistic dynamics models, check member disagreement away from data, derive the Gaussian loss it minimizes, and show one induced exploitation plan that scores well imagined but fails in the system, then contain it with an uncertainty penalty.
3. Run a data-aggregation loop that collects real transitions under the new policy and refits, showing error falling on the new distribution, and fix a fallback rule that shortens the horizon or hands back control past an uncertainty threshold.
4. Implement branched rollouts that start from real buffer states and run short model steps under the current policy with imagined and real updates accounted apart, then sweep the horizon and keep the point where model bias reverses the gain beside a matched model-free control.
5. Add latent-dynamics prediction tests on an encoded state at small scale, then implement tree search with its four steps and state the simulation budget behind every per-move decision.
6. Attribute results with swap experiments that isolate planner, model, reward and policy error, and run the matched model-free baseline with per-run records and failures kept, stating the operating range where the model earns its keep.

**Deliverables**

- `mbrl/` dynamics, ensembles and planners with oracle-first prediction and planning tests.
- Horizon sweeps with the bias-reversal point, aggregation evidence and latent prediction tests.
- Attribution table with matched model-free controls and per-run records including failures.

**Checks**

- rubric: Self-grade with the rubric below.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Oracle-first planning | Shooting and CEM match hand rollouts on the sanity case with equal queries, and the simple controller sets the ceiling. | A planning-below-oracle result is diagnosed as a planner fault, never charged to the model. |
| Uncertainty honesty | Ensemble disagreement grows away from data, and the exploitation plan shows an imagined-versus-real gap across seeds. | The penalty contains the exploit on a rerun, with member diversity evidence ruling out single-seed agreement. |
| Horizon discipline | Branched rollouts carry their branch starts, the sweep keeps the reversal point, and imagined updates never count as samples. | Aggregation lowers new-distribution error on refit, and the fallback rule fires on a demonstrated uncertain state. |
| Fair attribution | Swap experiments isolate each error source, and the matched baseline shares steps, compute, seeds and versions. | Failed horizons stay in the report, and the operating range names where the model stops earning its keep. |

Feeds into: `mbrl/` models, planners and attribution evidence feed agent sandboxes, language-policy rollouts and the capstone.

### Resource route

- **Primary - Course:** [Berkeley CS 185/285 Deep Reinforcement Learning (Spring 2026) - Model-Based RL](https://rail.eecs.berkeley.edu/deeprlcourse/) - Slides are public at https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-N.pdf; current videos are not, and the public Fall 2023 playlist numbers lectures differently. Study Lectures 15 and 16 (model-based RL: learned dynamics, open-loop and closed-loop planning, random shooting and CEM, MPC, model-based policy learning). There is no model-based homework, so build the planner yourself on a small environment with known dynamics first.
- **Required - Book:** [Reinforcement Learning: An Introduction (2nd ed.) - Chapter 8](https://mitpress.mit.edu/9780262352703/reinforcement-learning/) - The authors post the full second edition free at incompleteideas.net; cite the printed page numbers. Study Sections 8.1 to 8.3 (models, Dyna-Q, when the model is wrong) and Sections 8.8 to 8.11 (decision-time planning, rollout algorithms and Monte Carlo Tree Search). Reproduce the Dyna-Q versus Dyna-Q+ ranking on the blocking or shortcut maze.
- **Support - Course:** [Stanford CS224R Spring 2026 - Model-Based RL](https://cs224r.stanford.edu/) - Use Lecture 11 (model-based RL) and its MBPO reading as a second treatment of model error, uncertainty and short model rollouts.
- **Required - Paper:** [When to Trust Your Model: Model-Based Policy Optimization](https://arxiv.org/abs/1906.08253) - Study the model-error analysis and short model-rollout design. Reproduce a reduced real-plus-imagined-data comparison and retain the horizon where model bias reverses the gain.
- **Support - Paper:** [Deep Reinforcement Learning in a Handful of Trials using Probabilistic Dynamics Models (PETS)](https://arxiv.org/abs/1805.12114) - Read the split between aleatoric uncertainty (probabilistic networks) and epistemic uncertainty (ensembles) and the trajectory-sampling planner. Implement an ensemble on a small task and show where the members disagree.
- **Depth - Paper:** [Mastering Diverse Domains through World Models](https://arxiv.org/abs/2301.04104) - Read DreamerV3 only after the small explicit dynamics and planning path passes. Trace representation, latent dynamics, imagination and actor-critic state, but do not make a large benchmark reproduction part of the exit gate.
- **Support - Tutorial:** [Hands-on Modern RL - Model-Based and World-Model Sections](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter11_continuous_control/model-based) - Use Sections 9.3 and 9.4 as concept maps for model-based RL, search and world models. No runnable dynamics or planner script exists, so reproduce its error-recursion numbers by hand and verify algorithm claims against the original papers. Pin commit 9231bab of walkinglabs/hands-on-modern-rl; its `code/chapterNN` folders do not follow the site chapter numbers.
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

### Study units

#### U1. Prompts as initial states, tokens as actions and trajectory choices

**About 4 h** · **Target:** Explain

Topics: Prompt distribution, context and task instance as initial state; Tokens as actions and autoregressive policy factorization; Completion, conversation and tool episode as trajectory choices

Every later estimator sums over these objects. A vague boundary attaches masks, rewards and KL terms to the wrong tokens.

**You can now**

- Map a prompt, a completion and optional further turns onto an initial state, actions and a trajectory with an explicit episode boundary.
- Write the factorized trajectory probability for a completion, marking which factors come from the policy and which are deterministic.
- Choose a completion, conversation or tool episode for a task and state what the choice changes about rewards and evaluation.

**Study**

1. [Trajectory distribution and the three RLHF changes](https://rlhfbook.com/c/03-training-overview) (RLHF Book - Introduction, Training Overview and Instruction Tuning) - Problem Formulation (trajectory Equation 1 and the Thermostat example) through Manipulating the Standard RL Setup: the three changes from standard RL, with Table 1.
2. [Language models as an MDP](https://rlhfbook.com/teach/course/lec0-prereq-review/slides.pdf) (RLHF Book Course - Lectures 0 and 1) - Slides 27 and 28 of 31: the MDP-to-LM table (state as prompt plus tokens so far, deterministic append transition, terminal reward, $`\gamma = 1`$) and the autoregressive factorization.
3. [Generation as an MDP](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter15_rlhf/base-model-to-assistant) (Hands-on Modern RL - Chapter 13 RLHF Pipeline) - Rewriting Generation as an MDP: the MDP-to-generation table with the deterministic-transition and late-reward paragraphs (page read 2026-10-14). Depth: Stop before A Minimal Probe. The probe compares base models, which is not this unit.
4. [One-step versus token-level formulation](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-14.pdf) (Berkeley CS 185/285 Deep Reinforcement Learning (Spring 2026) - LLM RL) - Slides 20 and 21 of 51: A basic formulation (one-step RL on prompt and completion) and An equivalent formulation (token view for intermediate rewards and value baselines).

**Focus**

- The prompt distribution is the initial-state distribution. In single-turn RLHF the completion does not produce the next prompt, so there is no environment transition between episodes.
- The transition inside a completion is deterministic appending: given state $`(x, y_{<t})`$ and action $`y_t`$, the next state is $`(x, y_{<t+1})`$ with probability 1.
- Completion, conversation and tool episode are modeling choices, not facts. Each choice moves the episode boundary and decides which tokens can earn reward.
- The policy is the whole autoregressive factorization $`\pi_\theta(y \mid x) = \prod_t \pi_\theta(y_t \mid x, y_{<t})`$, not one response-level draw.

**Reproduce:** Closed-book, write $`p_\pi(\tau)`$ for a prompt $`x`$ and a 3-token completion. Expand the product over the 3 steps, mark each transition factor as 1, and state which factors the policy supplies.

**Traps**

- Treating the next training prompt as caused by the previous completion. Single-turn sampling draws each prompt fresh from the dataset.
- Calling the prompt a state while letting the tokenizer or chat template differ between sampling and scoring. The state includes the exact token string.
- Confusing episode end with truncation. EOS ends the trajectory; a length cap cuts it, and the two need different reward handling.

**Practice**

- The section mini-project covers this: the state, action, trajectory and reward boundary for your task, checked against hand-computed trajectory probabilities.

**Stop when:** You can draw the boundary for a new task (states, actions, episode end) and expand its trajectory probability without notes.

<details>
<summary>Self-test</summary>

1. In single-turn RLHF, what is the initial-state distribution and what are the transition dynamics between episodes?
   - The prompt dataset is the initial-state distribution. There are no transitions between episodes: each prompt is sampled fresh and the previous completion does not affect it.
2. Why is the token-append transition deterministic, and what does that remove from the trajectory probability?
   - Appending the chosen token always yields the same next context, so every $`p(s_{t+1} \mid s_t, a_t)`$ factor equals 1. Only the initial-prompt factor and the policy factors remain.
3. A task needs two tool calls before the answer. What changes if the episode is one completion versus the full tool interaction?
   - A one-completion episode ends at the first EOS and cannot assign credit to tool results. The full-interaction episode keeps tool outputs inside the trajectory so later tokens can condition on them and rewards can reflect the whole attempt.
4. Where does the discount factor go in the single-turn objective, and why?
   - It is set to $`\gamma = 1`$. There is one response-level reward rather than a stream of per-step rewards, so there is no horizon to discount over. A $`\gamma < 1`$ in the token view would discount the outcome by completion length and favor shorter answers.

</details>

#### U2. Bandit, token-MDP and environment-MDP formulations and hidden state

**About 3 h** · **Target:** Explain

Topics: Contextual-bandit versus token-MDP versus environment-MDP formulations; Hidden user, evaluator and environment state limitations

The optimizer you can use follows from the formulation. Bandit methods cannot do token credit assignment, and token methods cannot see hidden state.

**You can now**

- Contrast the contextual-bandit, token-MDP and environment-MDP formulations of one language task, naming what each treats as state, action and reward.
- State where the token-MDP view helps (intermediate rewards, value baselines) and where it breaks (hidden user, evaluator and environment state).
- Explain why single-turn RLHF is usually cast as a bandit problem and what must change for multi-turn tool tasks.

**Study**

1. [Bandit framing of single-turn RLHF](https://rlhfbook.com/c/03-training-overview) (RLHF Book - Introduction, Training Overview and Instruction Tuning) - Manipulating the Standard RL Setup, point 2 (no state transitions) and point 3 (single-step bandit structure with $`\gamma = 1`$), with Table 1.
2. [Classical RL versus RLHF versus RLVR](https://rlhfbook.com/teach/course/lec1-chap1-3/slides.pdf) (RLHF Book Course - Lectures 0 and 1) - Slides 32 and 55 of 70: Classical RL vs. RLHF (response-level bandit-style reward, KL penalty) and the Classical/RLHF/RLVR comparison table (transitions, granularity, challenge).
3. [POMDP view and partial observability](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-14.pdf) (Berkeley CS 185/285 Deep Reinforcement Learning (Spring 2026) - LLM RL) - Slide 14 of 51 (Language models like POMDP solvers) and slides 41 and 42 of 51 (Part 5 bonus: Beyond MDPs with non-Markov observations, then information-gathering actions under Partially observed MDPs can be weird).

**Focus**

- Bandit: state is the prompt, action is the whole completion, reward is response-level. Token-MDP: state is prompt plus prefix, action is the next token. Environment-MDP adds tool or user turns as transitions.
- The token view pays off exactly when there are intermediate rewards or value baselines; with a single terminal reward it collapses back to the bandit objective.
- Token strings are fully observed but the task state is not: user intent, evaluator criteria and tool side effects stay hidden, so the problem is partially observed even with a perfect context window.

**Reproduce:** From memory, fill a three-column table (bandit, token-MDP, environment-MDP) for a math-answer task: state, action, reward timing and one algorithm each formulation permits.

**Traps**

- Reading fully observed token context as a fully observed state. The context is observed; the intent behind the prompt and the grader's rubric are not.
- Treating $`\gamma = 1`$ as a theorem. It is the convention for response-level rewards; per-step KL penalties and multi-turn rewards can need discounting again.
- Carrying the no-transitions claim into tool tasks. Once tool outputs condition later tokens, transitions exist and the bandit analysis no longer applies.

**Practice**

- The section mini-project covers this: write the formulation choice for your task with the hidden-state list, and show which optimizer the choice permits.

**Stop when:** You can defend bandit versus token versus environment framing for a new task, including what is hidden and which methods the framing rules out.

<details>
<summary>Self-test</summary>

1. Why does the token-MDP view add nothing over the bandit view when the reward is a single terminal score and there is no critic?
   - With $`\gamma = 1`$ and one terminal reward, every token shares the same return, so per-token advantages are all equal to the response-level advantage. The gradient matches the bandit gradient.
2. Name one hidden state in a code-repair task with a test-suite verifier.
   - The contents of the hidden tests. The policy sees the prompt and its own code but not the tests the verifier will run, so identical contexts can have different true rewards.
3. A chat task scores only the final answer after three user turns. Which formulation fits, and why not the bandit?
   - The environment-MDP (or multi-turn token-MDP). Later prompts depend on earlier answers through the user, so transitions exist and early turns need credit for steering the conversation.

</details>

#### U3. Prompt, completion, padding and EOS masks and sequence log probabilities

**About 5 h** · **Target:** Derive + Implement

Topics: Prompt, completion, padding, EOS and truncation masks; Per-token and sequence log probabilities; Summed, mean and length-normalized sequence scores

The policy gradient is a masked sum of per-token terms. One wrong mask position silently trains on prompts or padding.

**You can now**

- Derive shifted per-token log probabilities and the masked sequence sum from a logits tensor.
- Implement prompt, completion, padding and EOS masking that gives prompt positions exactly zero weight.
- Predict how summed, mean and length-normalized scores rank two completions of different lengths.

**Study**

1. [Prompt masking and multi-turn masking](https://rlhfbook.com/c/04-instruction-tuning) (RLHF Book - Introduction, Training Overview and Instruction Tuning) - Implementation Details: the Prompt masking bullet (loss on responses only) and the Multi-turn masking bullet (final-turn-only versus mask-user-turns-only, with the unrolling rule).
2. [Loss aggregation and completion masks](https://rlhfbook.com/c/06-policy-gradients) (RLHF Book - Introduction, Training Overview and Instruction Tuning) - Implementation, Loss Aggregation Tradeoffs: the three strategies with Equations 45 to 47 (per sequence, per token and fixed length), plus the `completion_mask` note that prompt tokens are masked out.
3. [Gather and sum to sequence log probabilities](https://rlhfbook.com/c/15-regularization) (RLHF Book - Introduction, Training Overview and Instruction Tuning) - Implementation Example, Steps 1 to 5: generate, one forward pass, `log_softmax`, gather of generated tokens, sum to sequence log probabilities with `kl_approx`. Depth: Skip the `kl_full` line. It passes log probabilities as the target with `log_target` left False, so it returns NaN in torch 2.14.
4. [Token probabilities to log probabilities](https://www.manning.com/books/build-a-reasoning-model-from-scratch) (Build a Reasoning Model (From Scratch) - Chapters 2 to 5) - Chapter 5, Sections 5.4 to 5.5, pp. 146 to 161: token probability scores, then From token probability scores to log probabilities (sequence likelihood as the product of per-token terms).

**Focus**

- Shift first: position $`t`$ logits score token $`t+1`$. Gather the log probability of the actual next token, then mask, then sum. Any other order mixes prompt prediction into the score.
- Three masks do different jobs: the prompt mask removes conditioning text from the loss, the padding mask removes batch filler, and EOS handling decides whether the stop token itself is scored.
- Summed scores grow (more negative) with length; mean scores divide by completion length; fixed-length scores divide by a constant. The choice reweights short versus long completions like a learning-rate change.
- This unit builds on llm-foundations/tokenization-corpus-data/packing-and-loss-masks: packed SFT rows needed attention and loss masks, and rollouts need the same split with completion-only loss.

**Reproduce:** Closed-book, from logits rows `[1.0, 0.0, 2.0, -1.0]`, `[0.5, 1.5, -0.5, 0.0]`, `[2.0, 1.0, 0.0, -2.0]` with target ids `[2, 0, 3]`, derive per-token log probabilities `[-0.4402, -1.5460, -4.4197]`, sequence sum `-6.4059` and mean `-2.1353`.

**Traps**

- Training on prompt tokens. The model then learns to predict user queries, which is exactly what prompt masking exists to prevent.
- Averaging over the padded length. Padding positions contribute zero loss but a wrong denominator shrinks every gradient.
- Dropping the EOS token from the sum without deciding to. The stop decision is policy behavior; excluding it changes which sequences score well.

**Practice**

- [RLHF Book Chapter 6: masked aggregation script](https://rlhfbook.com/c/06-policy-gradients) - Implementation, Loss Aggregation Tradeoffs: run the `masked_mean` and `masked_sum` script on the 4-token and 7-token masks and match the printed `masked_mean`, `masked_sum` and token-level results. Then repeat on your own rollout-shaped tensors. The section mini-project tests the same masks on your rollout records.

**Stop when:** Your mask code reproduces the hand-derived sum and mean on a padded batch, and you can predict the ranking flip between summed and mean scores.

<details>
<summary>Self-test</summary>

1. Why must the gather use the generated token ids rather than the argmax of the logits?
   - The sequence score is the log probability the policy assigned to what was actually generated. Scoring the argmax instead measures a different sequence and breaks the ratio and KL identities that consume these log probabilities.
2. Two completions have identical per-token log probabilities but lengths 4 and 8. How do summed and mean scores compare them?
   - The summed score of the longer one is about twice as negative, so it ranks worse. The mean scores are equal. Summing penalizes length; averaging ignores it.
3. A batch has completions of lengths 4 and 7 in rows of width 7. What does per-sequence versus per-token normalization weight?
   - Per-sequence gives each completion equal total weight, so short-sequence tokens get larger gradients. Per-token gives each completion token equal weight, so the longer completion dominates. The book prints 2.0 and 2.0 versus 1.1429 and 2.0 for the worked example.
4. Where does the prompt mask end and the completion mask begin when the template adds a trailing assistant header?
   - At the first token the policy generated. Template tokens, including the assistant header, are conditioning context and stay masked; only generated tokens enter the loss.

</details>

#### U4. Sequence, token and step rewards, reward placement and return propagation

**About 4 h** · **Target:** Derive

Topics: Sequence, terminal, token and step-level rewards; Reward placement and return propagation

Credit assignment is where language RL differs most from SFT. Placement decides which tokens the gradient reinforces.

**You can now**

- Place a terminal outcome reward, per-step KL penalties and optional step rewards onto token positions.
- Derive per-token returns from that placement with $`\gamma = 1`$ by hand.
- Distinguish EOS-terminated from truncated completions in reward assignment.

**Study**

1. [Response-level rewards and no discounting](https://rlhfbook.com/c/03-training-overview) (RLHF Book - Introduction, Training Overview and Instruction Tuning) - Manipulating the Standard RL Setup, point 3 (response-level attribution over token sequences) with the rewritten objective Equation 10 using $`\gamma = 1`$.
2. [Per-token rewards with the outcome at EOS](https://rlhfbook.com/c/06-policy-gradients) (RLHF Book - Introduction, Training Overview and Instruction Tuning) - The PPO critic header comment: rewards as (B, L) post-KL per-token tensors where the EOS row includes the outcome, with `done_mask` and $`\gamma`$ often 1.0 for LM RLHF.
3. [Token reward with the reward-model score at the end](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter15_rlhf/ppo-rlhf-loop) (Hands-on Modern RL - Chapter 13 RLHF Pipeline) - The token-reward equation (per-step KL at every t, reward-model score only at t = T) with the Every preceding token versus Final EOS token box (page read 2026-10-14).
4. [Sparse and delayed rewards](https://rlhfbook.com/teach/course/lec0-prereq-review/slides.pdf) (RLHF Book Course - Lectures 0 and 1) - Slide 28 of 31: one scalar at the end of the response (sparse, delayed, no token-level target) as the motivation for policy gradients.

**Focus**

- Standard placement: every token gets $`-\beta(\log \pi_\theta - \log \pi_{\text{ref}})`$, and only the EOS position additionally gets the outcome score. The critic then spreads the total across tokens.
- With $`\gamma = 1`$, the return at token $`t`$ is the plain sum of later per-token rewards. Any $`\gamma < 1`$ discounts the terminal outcome and changes the optimum, not just the variance.
- Truncated completions never emitted EOS, so their outcome score is missing. Score only EOS-terminated generations with the reward model and penalize overlong ones instead.

**Reproduce:** Closed-book, for a 4-token completion with per-step KL `[0.1, 0.2, 0.1, 0.4]`, $`\beta = 0.05`$, terminal score 1.3 and $`\gamma = 1`$, derive per-token rewards `[-0.005, -0.01, -0.005, 1.28]` and returns `[1.26, 1.265, 1.275, 1.28]`.

**Traps**

- Discounting a terminal reward with $`\gamma < 1`$ out of habit. Earlier tokens then see a smaller return than later ones for no horizon reason.
- Feeding truncated generations to the reward model. The model scores an unfinished answer out of distribution; cap length and penalize truncation instead.
- Reading the per-step KL as environment reward. It depends on the policy that sampled the batch, so it is computed from the rollout-time log probabilities for each new batch and never carried over to data from another policy version.

**Practice**

- The section mini-project covers this: per-token reward placement with EOS versus truncated handling, and recorded KL, reward and return traces.

**Stop when:** You can propagate a terminal score plus per-step KL into per-token returns by hand and defend the truncation rule.

<details>
<summary>Self-test</summary>

1. In Reproduce, why is the first return 1.26 and not 1.3?
   - It sums all four per-token rewards: the terminal 1.3 minus the KL at EOS (0.02) minus the three earlier KL penalties (0.005, 0.01, 0.005). With $`\gamma = 1`$, every later penalty reaches the first token.
2. The policy hits the 4-token cap without emitting EOS, and the reward model would score the text 1.3. Where does the 1.3 go?
   - Nowhere. A capped generation has no EOS outcome, so under the placement the book describes it gets no reward-model score. It keeps its per-step KL terms and takes the too-long penalty.
3. What breaks if the EOS position gets the outcome score but the EOS token is excluded from the completion mask?
   - The outcome still enters returns through the critic, but the stop token itself gets no gradient. The policy never learns when to stop, and lengths drift.

</details>

#### U5. Policy, reference, critic, reward and verifier roles, and SFT as initialization

**About 4 h** · **Target:** Explain

Topics: Policy, reference, critic, reward model and verifier roles; SFT as behavior initialization and behavior cloning; Base, SFT, reference and trainable policy identity

Swapping two roles (reference versus policy, critic versus reward) compiles fine and trains the wrong objective.

**You can now**

- Assign each tensor in an RLHF step to exactly one of policy, reference, critic, reward model or verifier.
- Explain SFT as behavior-cloned initialization and why RL starts from it rather than the base model.
- Track base, SFT, reference and trainable-policy identity across stages, naming what is frozen.

**Study**

1. [Three steps and the recipe walkthrough](https://rlhfbook.com/c/01-introduction) (RLHF Book - Introduction, Training Overview and Instruction Tuning) - RLHF in Three Steps and Walkthrough of an RLHF Recipe: SFT foundation, reward model as scalar signal, RL stage shifting parameters toward good tokens.
2. [Four collaborating roles](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter15_rlhf/ppo-rlhf-loop) (Hands-on Modern RL - Chapter 13 RLHF Pipeline) - The four-role table (Actor/policy, frozen SFT Reference, Reward, Critic) with The Role of the Reference Model (page read 2026-10-14).
3. [SFT initialization and the KL coefficient](https://arxiv.org/abs/2203.02155) (Training Language Models to Follow Instructions with Human Feedback) - Section 3.5 (demonstration, comparison, PPO steps) with Appendix C.4 of arXiv:2203.02155v1: RL policies initialize from SFT, the KL reward uses the same SFT model, $`\beta = 0.02`$, 256k episodes over about 31k prompts.
4. [SFT objective and checkpoint reuse](https://cs224r.stanford.edu/material/CS224R_Default_Project_Guidelines.pdf) (Stanford CS224R 2026 LLM RL Default Project) - Sections 1.2.5 and 1.3.1 (pp. 6 and 7): dataset roles, the completion-only SFT objective eq. 6, and the official SFT checkpoint for later stages. Depth: Read as a design specification. The course action items are not your assignment.

**Focus**

- Policy acts and learns. Reference is a frozen copy that only scores drift. Reward model (or verifier) scores outcomes and never supplies gradients directly. Critic predicts values to cut variance and is the only role that may need training alongside the policy.
- SFT is behavior cloning on demonstrations: same next-token loss as pretraining, loss on completions only. It installs the assistant format that RL then refines.
- Identity is a chain: base model, SFT checkpoint, reference frozen from SFT, policy initialized from SFT. After the first RL step the policy is no longer the reference.
- This sharpens the earlier behavior-cloning unit (reinforcement-learning/deep-imitation-offline-ope/behavior-cloning-likelihood): SFT inherits its compounding-shift limits, which is why on-policy RL stages follow.

**Reproduce:** Closed-book, draw the five-role diagram for InstructGPT-style PPO: which checkpoint initializes which, which stay frozen, where $`\beta = 0.02`$ enters, and where the 31k prompts flow.

**Traps**

- Letting the reference track the policy. The KL term then measures drift from a moving target and stops constraining anything.
- Starting RL from the base model. Without the SFT format prior, sampling wastes budget on non-answers and the reward signal drowns in format noise.
- Merging the critic and the reward model. The reward model is frozen outside the update; the critic is trained inside it, costs memory, and needs its own targets.

**Practice**

- The section mini-project covers this: a frozen base, SFT and evaluation baseline with recorded checkpoint identity for every later stage.

**Stop when:** You can label every model call in an RL step with its role, checkpoint and frozen-or-trainable status.

<details>
<summary>Self-test</summary>

1. Which roles need gradients in PPO-style RLHF, and which are frozen?
   - Policy and critic train. Reference and reward model are frozen. The verifier is fixed code or a fixed model outside training entirely.
2. Why does InstructGPT compute the KL reward against the SFT model rather than the base model?
   - The SFT model is the optimization start point with the assistant format. KL against it preserves that format while reward chasing; KL against base would permit forgetting instruction following.
3. SFT and the start of RL share an objective on completions. What changes at the RL stage?
   - SFT imitates fixed demonstrations per token. RL samples its own completions and reinforces them by outcome score, so the data distribution follows the policy instead of the demonstration set.
4. Where does the value network initialize, and why does the choice matter?
   - Commonly from the reward model (InstructGPT and Tulu 3) or from the SFT checkpoint with a fresh value head. A random start delays convergence because early value predictions, and hence advantages, are noise.

</details>

#### U6. On-policy, off-policy and replayed language data, and sampling and inference policies

**About 4 h** · **Target:** Explain + Implement

Topics: On-policy, off-policy and replayed language trajectories; Sampling temperature, top-p, top-k and generation policy identity; Greedy, sampling, best-of-N, rejection and search as distinct inference policies

Sampling settings are part of the policy. Unrecorded temperature or an unnamed rerank step invalidates every ratio and KL downstream.

**You can now**

- Classify a language rollout as on-policy, off-policy or replayed, and state which estimators each class permits.
- Implement temperature scaling and top-p filtering on a logits vector and predict their effect on diversity.
- Distinguish greedy, sampling, best-of-N, rejection and search as inference policies, and separate all of them from a learned policy change.

**Study**

1. [Temperature, top-p and self-consistency](https://www.manning.com/books/build-a-reasoning-model-from-scratch) (Build a Reasoning Model (From Scratch) - Chapters 2 to 5) - Chapter 4, Sections 4.4 to 4.6, pp. 103 to 135: temperature rescaling with Listing 4.8 `generate_text_temp_stream_cache`, the top-p filter with the 10-token toy in Listing 4.9, and self-consistency.
2. [Rejection sampling and best-of-N](https://rlhfbook.com/c/09-rejection-sampling) (RLHF Book - Introduction, Training Overview and Instruction Tuning) - Training Process Step by Step (temperature, top-p, completions per prompt, then SFT on selected completions) and Related: Best-of-N Sampling.
3. [On-policy vocabulary](https://rlhfbook.com/c/appendix-a-definitions) (RLHF Book - Introduction, Training Overview and Instruction Tuning) - Reinforcement Learning, On-policy: the strict sense (data from exactly the current agent) and the preference-tuning sense (generations from that edition of the model).

**Focus**

- Temperature divides logits before softmax; top-p keeps the smallest set whose cumulative probability reaches $`p`$. Both change the distribution, so both belong in the generation-policy record.
- Greedy is temperature 0 (argmax). Sampling draws once per prompt. Best-of-N draws $`N`$ and keeps the top scorer. Rejection fine-tunes on filtered draws. Search explores multiple paths with a selection rule. Only the fine-tuning and RL variants change weights.
- On-policy needs the exact current parameters and sampler. Anything else (older checkpoint, different temperature, another model, replayed text) is off-policy and needs ratios or must stay out of the gradient.
- This extends llm-foundations/causal-training-generation/decoding-policies: the decoding rules are the same, but here each setting defines the behavior policy for an estimator.

**Reproduce:** Closed-book, on toy logits `[-0.7, -3.0, 0.1, -1.2, 2.0, -1.0, -0.5, -2.0, 0.3, 1.5]` at temperature 1.0 with top-p 0.9, derive the kept set `{4, 9, 8, 2, 6}` from cumulative probabilities `[0.4538, 0.7290, 0.8119, 0.8798, 0.9170]`, and name the greedy token (index 4).

**Traps**

- Logging the model version but not the sampler. A temperature or top-p change without new stored log probabilities turns on-policy data off-policy silently.
- Reporting best-of-N accuracy as policy quality. Selection over N draws inflates scores without changing any weight; the baseline to beat is matched sampling budget, not greedy decoding.
- Reusing old generations as if they were fresh. Replayed text is off-policy for the current parameters even when nothing else changed.

**Practice**

- [Build a Reasoning Model, Exercise 4.2: temperature and top-p on MATH-500](https://www.manning.com/books/build-a-reasoning-model-from-scratch) - Exercise 4.2 at the end of Chapter 4: extend `evaluate_math500_stream` with temperature and top-p at 0.9 and compare against the base run. Run on CPU with Qwen3-0.6B per the book hardware note. Record the sampler settings beside the accuracy.
- [Build a Reasoning Model, Exercise 4.3: self-consistency on MATH-500](https://www.manning.com/books/build-a-reasoning-model-from-scratch) - Exercise 4.3 at the end of Chapter 4: self-consistency with sample size 3 at temperature and top-p 0.9. Report accuracy per draw versus majority-vote accuracy to separate selection from learning.

**Stop when:** You can implement temperature plus top-p from a blank file, predict the kept set on the toy logits, and classify any rollout batch by policy freshness.

<details>
<summary>Self-test</summary>

1. Why does raising temperature increase diversity but never change the argmax?
   - Temperature above 1 flattens the softmax, so lower-ranked tokens get sampled more often. Dividing every logit by the same positive temperature keeps their order, so the argmax never moves.
2. Self-consistency with 3 samples at temperature and top-p 0.9 beats greedy on MATH-500. Is that a learned improvement?
   - No. It is selection (majority vote over 3 draws) with more inference compute. A learned claim needs a weight update and a matched-compute baseline.
3. Data was sampled with top-p 0.9 but the stored log probabilities were recomputed with full softmax. What breaks?
   - The stored probabilities describe a different distribution from the sampler, so ratios and KL terms are wrong. Store the log probabilities from the sampling pass itself.
4. When is data from last week's checkpoint on-policy?
   - Never for the current parameters under the strict sense. Under the loose preference-tuning sense it counts as that edition's on-policy data, but it is off-policy for any gradient on today's policy.

</details>

#### U7. Version binding, immutable rollout records and outcome classes

**About 4 h** · **Target:** Implement

Topics: Policy, tokenizer, template, reward, verifier and RNG version binding; Immutable rollout records and old log probabilities; Valid, invalid, refused, timed-out and truncated outcomes

Stale or version-mismatched rollouts are the quietest failure in LLM RL. Records make freshness checkable instead of assumed.

**You can now**

- Bind policy, tokenizer, template, reward, verifier and RNG versions to every rollout record.
- Implement immutable rollout storage where old log probabilities are written once at sampling time.
- Classify rollouts into valid, invalid, refused, timed-out and truncated outcomes without dropping any.

**Study**

1. [Version binding and immutable rollouts](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-3/llm-post-training-laboratory.md) (LLM Post-Training Laboratory - Baseline and State Contract) - Architecture constraints (every record binds prompt, template, tokenizer, model, reference, reward, verifier and policy versions; rollouts immutable; old log probabilities never recomputed) with Correctness requirements.
2. [Experience record fields](https://github.com/natolambert/rlhf-book/blob/1042143366d73ff654727e4d18a1d3a21209c3a3/code/policy_gradients/buffer.py) (KL Estimators - Schulman's Note and the RLHF Book Code) - The Experience dataclass: `sequence_ids`, `attention_mask`, `action_mask`, advantages, `log_probs_old` from the rollout policy, `log_probs_ref`, `values_old`, and the rewards TensorDict (total, correctness, format, penalty, binary).
3. [Behavior versus target log probabilities](https://cs224r.stanford.edu/material/CS224R_Default_Project_Guidelines.pdf) (Stanford CS224R 2026 LLM RL Default Project) - Section 1.3.3, Importance Weighting (p. 8): vLLM sampling versus Hugging Face update paths can yield different token log probabilities, so the update treats sampling as a behavior policy with per-sample importance weights. Depth: Read as a design specification. The course action items are not your assignment.
4. [Truncation practice](https://rlhfbook.com/c/06-policy-gradients) (RLHF Book - Introduction, Training Overview and Instruction Tuning) - Implementation opening paragraphs: hard generation cap, reward-model scoring only on the `eos_token`, and a penalty for generating too long.

**Focus**

- Write the sampler's log probabilities at sampling time and never recompute them from a newer policy. A trainer-stack recomputation at the same weights is a second, different number (numerics differ); keep both if the update uses both, as the CS224R spec does with its behavior-policy weights.
- Bind versions, not just names: policy checkpoint, tokenizer, chat template, reward or verifier build, and RNG seed. Any one of them can change the distribution.
- Every rollout lands in exactly one outcome class (valid, invalid, refused, timed-out, truncated) and stays counted. These five labels operationalize the lab rule that failed and filtered rollouts remain counted with explicit reasons. Dropping failures changes the estimand toward easy prompts.
- Separate the attention mask (valid tokens) from the action mask (generated tokens supervised by the loss), as the Experience record does.

**Reproduce:** From a blank file, implement a rollout record with all version fields plus stored old log probabilities, then write a test that mutates the policy and asserts the stored values are unchanged and still equal the sampling-time values.

**Traps**

- Refreshing stored log probabilities with the policy being updated, mid-epoch. The ratio becomes 1 everywhere and clipping never binds, hiding all off-policy drift.
- Deleting timed-out or refused rollouts. Timeouts correlate with hard prompts, so deletion biases returns upward; keep them with their outcome label.
- Mixing sampling stacks without recording which produced each log probability. vLLM and Transformers numerics differ, so the mismatch looks like policy drift.

**Practice**

- The section mini-project covers this: immutable versioned rollout records with old log probabilities, outcome classes and a stored-versus-recomputed test.

**Stop when:** Your records carry every version, survive a policy update unchanged, and account for all five outcome classes with none dropped.

<details>
<summary>Self-test</summary>

1. Why must old log probabilities be stored rather than recomputed, even with the same checkpoint?
   - Recomputation may use a different code path, dtype or kernel with different numerics, and after any update the checkpoint itself differs. The stored values are the ones the sampler actually used.
2. A rollout timed out after 200 tool calls with no answer. Which class, and does it enter the gradient?
   - Timed-out. It stays in the records with its penalty reward and enters accounting; whether it enters the gradient depends on the declared rule, but it must never vanish silently.
3. The tokenizer version changed between sampling and a later audit. Which records are still comparable?
   - Only records sharing the full version binding. Token ids from different tokenizers are different objects, so log probabilities and masks do not transfer.
4. What distinguishes the attention mask from the action mask in the Experience record?
   - The attention mask marks valid (non-padding) tokens for the forward pass. The action mask marks generated tokens that enter the loss; prompt tokens are valid but masked from supervision.

</details>

#### U8. Token entropy, sequence diversity, KL direction and KL estimators

**About 5 h** · **Target:** Derive + Measure

Topics: Token-level entropy and sequence-level diversity; Forward and reverse KL direction vocabulary; Reference-policy KL estimators and approximation limits

KL and entropy traces are the early warning for collapse and drift. The wrong direction or estimator makes the warning point backwards.

**You can now**

- Derive token entropy and the reverse-KL penalty from their expectations, and state the sampling distribution each needs.
- Compute the k1, k2 and k3 estimators on hand log probabilities and state the bias, sign and variance of each.
- Measure token entropy and sequence diversity separately and name the estimator behind every reported KL number.

**Study**

1. [KL, entropy and the Monte Carlo estimators](https://rlhfbook.com/teach/course/lec0-prereq-review/slides.pdf) (RLHF Book Course - Lectures 0 and 1) - Slides 23 and 24 of 31: cross-entropy as entropy plus KL, the Monte Carlo KL with the log-ratio integrand, the high-variance k1, and the low-variance non-negative k3 with r as reference over policy.
2. [Three estimators in code](https://github.com/natolambert/rlhf-book/blob/1042143366d73ff654727e4d18a1d3a21209c3a3/code/policy_gradients/loss.py) (KL Estimators - Schulman's Note and the RLHF Book Code) - `approx_kl1`, `approx_kl2` and `approx_kl3` with `masked_mean`, read against Schulman's note Approximating KL Divergence linked at the top of the file; `approx_kl1` returns the negated log ratio (expectation negative KL), `approx_kl3` uses the reciprocal ratio (policy over reference), and `approx_kl2` is symmetric under swapping the two policies.
3. [Reverse KL and the implementation example](https://rlhfbook.com/c/15-regularization) (RLHF Book - Introduction, Training Overview and Instruction Tuning) - KL Divergence in RL Optimization (reverse KL to the reference, Equation 4 over samples from the trained model) with Implementation Example Steps 1 to 5 and `kl_approx`. Depth: Use `kl_approx` only. Skip the `kl_full` line: it returns NaN in torch 2.14.
4. [Correct k3 reference](https://huggingface.co/docs/trl/v1.15.0/en/grpo_trainer) (TRL GRPO Trainer - KL estimation and loss) - Estimating the KL divergence: the k3 formula with the reference-over-policy ratio, with the default KL-coefficient note beside it.

**Focus**

- The RLHF penalty is reverse KL $`\mathcal{D}_{\text{KL}}(\pi_\theta \| \pi_{\text{ref}})`$: samples come from the trained policy. It penalizes most where the new policy puts mass the reference calls unlikely. Forward KL is the distillation direction.
- k1 (mean log ratio) is unbiased but noisy and negative on single samples. k2 (half squared log ratio) is non-negative with small bias near the reference. k3 (mean $`r - 1 - \log r`$ with $`r = \pi_{\text{ref}}/\pi_\theta`$) is unbiased and non-negative.
- The book code estimators do not match the slide: `approx_kl1` estimates negative KL and `approx_kl3` uses the reciprocal ratio, so its expectation misses exact KL (0.0247 versus 0.0253 on the hand example). Report traces with the slide and TRL form.
- Token entropy (expected per-position spread) is not sequence diversity (spread across completions). A peaked-per-token policy can still repeat one answer; measure both.

**Reproduce:** Closed-book, for sampled policy `q = [0.5, 0.3, 0.2]` against reference `p = [0.4, 0.4, 0.2]`, derive exact KL 0.0253, Schulman k1 mean 0.0253, the book code `approx_kl1` mean of negative 0.0253, mean k2 of 0.0249, code-k3 mean of 0.0247, and true-k3 mean of 0.0253. State which estimators agree with the exact value.

**Traps**

- Reading a negative k1 sample as negative divergence. Single-sample k1 can be negative; only its expectation estimates KL.
- Copying `approx_kl1` or `approx_kl3` as the reported KL. One has the wrong sign and the other the wrong ratio; both disagree with the exact value on the hand example.
- Calling low token entropy high diversity or vice versa. Entropy averages per-position uncertainty under one policy; diversity compares whole completions, for example by distinct n-grams or vote spread.

**Practice**

- [Hands-on Modern RL 13.9: hand-calculate one token KL penalty](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter15_rlhf/ppo-rlhf-loop) - Hand-calculate one token's KL penalty: actor log probability negative 1.2, reference negative 1.6, $`\beta = 0.05`$ giving negative 0.02 with reward-model score 1.3 at EOS (page read 2026-10-14). Then recompute the same token with the k3 form and state which estimator each of your traces uses. The section mini-project records the same diagnostics on your rollouts.

**Stop when:** You reproduce all five hand numbers, can derive each estimator expectation, and every KL you report names its estimator and direction.

<details>
<summary>Self-test</summary>

1. Why does reverse KL suit the RLHF penalty better than forward KL?
   - Reverse KL averages under the trained policy and punishes mass where the reference is thin, which is exactly drift into unseen regions. Forward KL averages under the reference and punishes missing reference modes, which suits distillation, not drift control.
2. On the hand example, which estimators match exact KL in expectation, and what are the other two?
   - Schulman k1 (0.0253) and true k3 (0.0253) match. k2 gives 0.0249 (small bias), the book code `approx_kl1` gives negative 0.0253 (negated) and `approx_kl3` gives 0.0247 (reciprocal-ratio bias).
3. A trace shows KL near zero but outputs are near-identical across prompts. What happened?
   - The policy collapsed while staying near the reference on average, or diversity was never measured. KL to the reference does not measure spread across completions; add a diversity metric.
4. Beta is 0.0 in the TRL default noted in the study. What does the KL term do then?
   - Nothing, and there is no trace either: with `beta=0.0` TRL does not load the reference model, so no reference KL is computed or logged. Drift is unconstrained, so load a reference separately or log another drift signal.

</details>

#### U9. Fixed-sequence log-probability and mask oracles and prompt separation

**About 4 h** · **Target:** Implement

Topics: Fixed-sequence log-probability and mask oracles; Sampling, training and evaluation prompt separation

Oracles catch mask and scoring bugs before they become training runs. Split discipline keeps evaluation honest.

**You can now**

- Implement a fixed-sequence oracle that checks gathered log probabilities and masks against hand values.
- Separate sampling, training and evaluation prompts with dedup and split ownership.
- Detect tokenizer or template mismatch between sampling and scoring from oracle failures.

**Study**

1. [Generate versus forward oracle pattern](https://rlhfbook.com/c/15-regularization) (RLHF Book - Introduction, Training Overview and Instruction Tuning) - Implementation Example, Steps 1 to 5: `generate()` sampling versus `forward()` scoring on the same tokens, with gather and sum as the oracle pattern.
2. [Minimal generation function and model loading](https://www.manning.com/books/build-a-reasoning-model-from-scratch) (Build a Reasoning Model (From Scratch) - Chapters 2 to 5) - Chapter 2, Sections 2.4 to 2.7, pp. 25 to 45: input preparation, loading Qwen3-0.6B, the sequential generation process and the minimal generation function.
3. [Prompt selection and reuse risk](https://rlhfbook.com/c/09-rejection-sampling) (RLHF Book - Introduction, Training Overview and Instruction Tuning) - Training Process Step by Step, step 0 (prompt selection; reusing every SFT prompt risks overfitting) with Generating Completions (N completions per prompt).
4. [Prompt filtering and dedup at scale](https://arxiv.org/abs/2203.02155) (Training Language Models to Follow Instructions with Human Feedback) - Appendix C.4 of arXiv:2203.02155v1: 256k episodes over about 31k unique prompts after PII filtering and common-prefix dedup, batch size 512 with minibatch 64.

**Focus**

- The oracle fixes token ids once, runs policy and reference forwards, and asserts gathered per-token log probabilities, masks and sums against hand values. Same ids in, exact numbers out.
- Sampling, training and evaluation prompts are disjoint sets with recorded ownership. Prefix dedup matters because shared prefixes leak across the split even when full prompts differ.
- Format evaluation prompts with the identical template and tokenizer as training. The Stanford project formats conversation context consistently for this reason; a mismatch voids the comparison.
- This mirrors llm-foundations/tokenization-corpus-data/packing-and-loss-masks split discipline: split ownership is fixed before fitting or packing, and the same rule holds before sampling.

**Reproduce:** From a blank file, build a fixed oracle on 5 token ids with a 2-row logits fixture: assert the gathered log probabilities, the prompt-zeroed mask and the sequence sum, then flip one template token and show the oracle failing.

**Traps**

- Evaluating on sampling prompts and reporting the score as generalization. Resampled familiar prompts measure memory plus selection, not new-task behavior.
- Deduping on full strings only. InstructGPT dedups on common prefixes because near-duplicate prompts leak just as well.
- Unrolling multi-turn data into overlapping windows that include future turns. Each training example must exclude turns after the supervised one.

**Practice**

- The section mini-project covers this: fixed log-probability, mask and state-identity tests with sampling, training and evaluation prompt separation.

**Stop when:** Your oracle passes on fixed ids, fails on a template change, and no prompt id appears in two splits.

<details>
<summary>Self-test</summary>

1. What does the fixed-sequence oracle pin down that a loss-going-down check does not?
   - Exact per-token log probabilities, exact mask positions and the exact sum on fixed ids. A falling loss is consistent with scoring the wrong tokens.
2. Why is prefix dedup needed on top of exact-match dedup?
   - Prompts sharing a long prefix put nearly identical contexts in both splits. The model then completes a memorized continuation rather than solving the task.
3. Sampling used template version A and evaluation uses version B with one extra header token. What breaks?
   - Token positions shift by one, so masks, gathered log probabilities and any position-sensitive reward attach to the wrong tokens. The oracle fails until versions match.

</details>

#### U10. Rollout compute accounting and learned change versus inference-time selection

**About 4 h** · **Target:** Measure

Topics: Rollout tokens, verifier calls, latency and compute accounting; Learned policy change versus inference-time selection

More samples almost always score higher. Without accounting, selection looks like learning and papers look like your results.

**You can now**

- Account rollout tokens, verifier calls, latency and compute for a sampling run in a budget table.
- Separate learned policy change from inference-time selection (best-of-N, self-consistency, search) at matched compute.
- State which reported numbers are your measurements and which are paper setups you cite.

**Study**

1. [Test-time versus training-time scaling](https://rlhfbook.com/teach/course/lec1-chap1-3/slides.pdf) (RLHF Book Course - Lectures 0 and 1) - Slides 54 and 55 of 70 (verifiable rewards and the Classical/RLHF/RLVR table) with slides 57 to 59 of 70 (the o1-preview scaling plot, o1 test-time scaling and o1 training-time scaling).
2. [Elicitation and frontier compute numbers](https://rlhfbook.com/c/01-introduction) (RLHF Book - Introduction, Training Overview and Instruction Tuning) - An Intuition for Post-Training: the elicitation theory with the DeepSeek R1 numbers (147K H800 GPU hours RL against 2.8M pretraining) and the Olmo 3.1 run (4 weeks on 200 GPUs).
3. [Rejection sampling as selection baseline](https://rlhfbook.com/c/09-rejection-sampling) (RLHF Book - Introduction, Training Overview and Instruction Tuning) - Training Process Step by Step (generate, score, fine-tune on selected completions) and Related: Best-of-N Sampling: selection without weight updates.
4. [Measurement contract](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-3/llm-post-training-laboratory.md) (LLM Post-Training Laboratory - Baseline and State Contract) - Milestones B and E with Measurement requirements: tokens per second, rollout and update queues, invalid and failure counts, and matched or disclosed budgets.

**Focus**

- Count everything selection spends: prompt plus completion tokens per draw, number of draws, verifier or reward calls, and latency. Verifier calls are compute too.
- Learned change moves weights and persists across prompts; selection spends compute per prompt and vanishes with it. Compare them only at matched total sampling budget.
- Do the accounting on pre-generated rollouts on CPU first. A live update loop comes second and stays conditional on your GPU.
- Frontier GPU-hour figures are the paper's setup on the paper's hardware. Cite them with the setup named; your table holds your measurements.

**Reproduce:** From a blank sheet, table one run: 20 prompts, 4 rollouts each, 128 completion tokens per rollout. Derive 10,240 rollout tokens, 80 verifier calls for outcome scoring, and per-prompt cost of 512 tokens plus 4 calls, then state the best-of-N baseline that costs the same.

**Traps**

- Comparing a best-of-4 policy against a greedy baseline and calling the gap learning. The gap is selection over 4 draws; the fair baseline samples 4 too.
- Omitting verifier cost from the budget. A verifier call per rollout can dominate short completions and flips which method is cheaper.
- Presenting DeepSeek or Olmo GPU hours as your plan. Those figures bound what is possible at frontier scale; your evidence is your measured tokens, calls and latency.

**Practice**

- The section mini-project covers this: raw token, verifier-call, latency and compute records with matched-budget controls and preserved failed runs.

**Stop when:** Your budget table accounts every token and verifier call, and every claimed improvement names the matched-compute selection baseline it beat.

<details>
<summary>Self-test</summary>

1. Why must the best-of-N baseline match the RL method's total draws rather than its greedy output?
   - Best-of-N gains come from taking the max over draws. Matching draws equalizes the selection advantage, so any remaining gap must come from the policy itself.
2. A run reports higher reward with 4 times the rollouts and no baseline. What is missing?
   - A matched-compute control: the same budget spent on best-of-N or self-consistency with the starting policy. Without it, sampling explains the gain.
3. Where do verifier calls appear in the budget table, and why separately from tokens?
   - As calls per rollout beside token counts. They scale with draws rather than length, use different hardware, and can dominate short-completion costs.
4. Self-consistency over 3 samples beats one RL-finetuned greedy decode. Which do you ship?
   - Neither on that evidence alone. The comparison mixes 3 draws against 1; rerun both at matched draws, then weigh persistent weight change against per-prompt selection cost.

</details>

### Mini-project: Token-policy rollouts with versioned trajectory contracts

**About 10 to 14 hours.** Extend `policylab` with an `llm/` trajectory laboratory on a tiny CPU text policy: boundaries, masks, rewards, roles and immutable rollout records. Prove scoring against fixed oracles before any update, and account every token and verifier call. Move to a small decoder only if your GPU fits it.

1. Fix the state, action, trajectory and reward boundary for one small task in `llm/`, check it against hand-computed trajectory probabilities, then write the bandit, token or environment formulation with its hidden-state list and the optimizer it permits.
2. Implement prompt, completion, padding and EOS masks on the rollout records, run the RLHF Book masked-aggregation script on them, then place per-token rewards with the outcome at EOS, propagate returns, and log KL, reward and return traces with truncation handled apart.
3. Freeze a base model, train a small SFT baseline and score both on a frozen evaluation set in `llm/`, assign every tensor to policy, reference, critic, reward or verifier, and record checkpoint identity with frozen-or-trainable status for every later stage.
4. Store immutable versioned rollout records in `llm/` with old log probabilities written once, all five outcome classes counted, and sampling, training and evaluation prompts separated with dedup, then prove a stored-versus-recomputed test and a fixed log-probability and mask oracle.
5. Recompute the companion token KL hand calculation on the rollout traces, then record token entropy, sequence diversity and reference KL with the estimator and direction named on every number.
6. Account raw tokens, verifier calls, latency and compute for each sampling run in `ledger/`, compare the SFT change against best-of-N and self-consistency at matched budgets, and preserve failed runs with explicit reasons.

**Deliverables**

- Tiny text policy with boundary, formulation, masks and reward placement proved on fixed oracles.
- Immutable versioned rollout records with prompt splits, outcome classes and KL, compute and latency traces.
- Frozen base, SFT and evaluation baselines with checkpoint identity and matched-budget selection controls.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [RLHF Book Chapter 6: masked aggregation script](https://rlhfbook.com/c/06-policy-gradients). Run the aggregation script on rollout-shaped tensors; keep mask-sum evidence.
- external-tests: [Hands-on Modern RL 13.9: hand-calculate one token KL penalty](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter15_rlhf/ppo-rlhf-loop). Recompute the hand penalty on rollout traces; name the estimator.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Mask correctness | The aggregation script passes on rollout records, prompt positions carry zero weight, and EOS handling is decided and tested. | A template-shift probe fails the oracle as designed, and per-sequence versus per-token weighting is defended. |
| Reward placement | Per-token rewards put KL at every position with the outcome at EOS only, returns propagate by hand, and truncation takes no outcome score. | Recorded KL, reward and return traces reconcile position by position on a held-out rollout. |
| Version binding | Every record binds policy, tokenizer, template, reward, verifier and RNG versions, stored log probabilities survive updates, and no outcome class is dropped. | Sampling, training and evaluation splits share no prompt id, and prefix dedup evidence is kept. |
| Compute honesty | The ledger counts tokens, verifier calls, latency and compute, learned change is compared with matched selection, and failures stay counted. | A small-decoder run, only if your GPU fits it, is reported apart with its own budget table. |

Feeds into: `llm/` records, oracles and baselines feed preference, online-policy and reasoning-agent projects and the capstone.

### Resource route

- **Primary - Book:** [RLHF Book - Introduction, Training Overview and Instruction Tuning](https://rlhfbook.com/c/01-introduction.html) - Study Chapter 1 (introduction), Chapter 3 (training overview: problem formulation and canonical recipes), Chapter 4 (instruction tuning: chat templates and implementation details) and Appendix A (definitions) at https://rlhfbook.com/c/. Map every RLHF component into the track trajectory schema, then implement assistant-only sequence log probabilities and completion masks against hand examples.
- **Required - Course:** [RLHF Book Course - Lectures 0 and 1](https://rlhfbook.com/course) - Watch Lecture 0 (the ML foundations of post-training, including KL) and Lecture 1 (overview of Chapters 1 to 3), with slides under https://rlhfbook.com/teach/course/. Produce a component and state-ownership diagram tied to executable tests, not a second set of general notes.
- **Required - Paper:** [Training Language Models to Follow Instructions with Human Feedback](https://arxiv.org/abs/2203.02155) - Study the demonstration, comparison, reward-model and PPO pipeline plus evaluation design. Reconstruct the data and policy dependencies and state which results cannot be inferred from the paper at small scale.
- **Required - Guide:** [KL Estimators - Schulman's Note and the RLHF Book Code](https://github.com/natolambert/rlhf-book/blob/1042143366d73ff654727e4d18a1d3a21209c3a3/code/policy_gradients/loss.py) - Read John Schulman's note "Approximating KL Divergence" (on joschu.net, linked from the code) for the three Monte Carlo estimators $`k_1`$, $`k_2`$, $`k_3`$ and their bias and variance, then the `approx_kl1`, `approx_kl2` and `approx_kl3` functions in this file at commit 1042143. Compute all three on sampled tokens from two small policies whose exact KL you know, and say which one each library you use reports.
- **Support - Course:** [Berkeley CS 185/285 Deep Reinforcement Learning (Spring 2026) - LLM RL](https://rail.eecs.berkeley.edu/deeprlcourse/) - Slides are public at https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-N.pdf; current videos are not, and the public Fall 2023 playlist numbers lectures differently. Study Lecture 14 (LLM RL) for the language-model-as-policy formulation and how it maps onto the policy-gradient lectures.
- **Support - Book:** [Build a Reasoning Model (From Scratch) - Chapters 2 to 5](https://www.manning.com/books/build-a-reasoning-model-from-scratch) - Use Chapter 2 (loading Qwen3 0.6B and a minimal generation function), Chapter 4 (temperature, top-p and self-consistency) and Chapter 5 (token probabilities to log probabilities and sequence scores) as a code companion for log-probability, mask and inference-policy oracles. Chapters 2 to 5 run on a CPU.
- **Support - Project:** [Stanford CS224R 2026 LLM RL Default Project](https://cs224r.stanford.edu/material/CS224R_Default_Project_Guidelines.pdf) - Read Sections 1.1 through 1.4 for the Countdown task, distinct SFT, preference and verifier datasets, objective boundaries and evaluation. Use it as a design specification and write independent code; do not submit, copy or publish Stanford course solutions.
- **Support - Tutorial:** [Hands-on Modern RL - Chapter 13 RLHF Pipeline](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter15_rlhf/base-model-to-assistant) - Use the base-model-to-assistant page and the PPO-RLHF loop page for the pipeline and the token-level ratio, clip and KL order of operations. Its KL sketch is the simple log-ratio difference; audit masks and log probabilities independently and defer scale engineering to RL-12. Pin commit 9231bab of walkinglabs/hands-on-modern-rl; its `code/chapterNN` folders do not follow the site chapter numbers.
- **Required - Project:** [LLM Post-Training Laboratory - Baseline and State Contract](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-3/llm-post-training-laboratory.md) - Build or reuse the laboratory frozen base, SFT and evaluation baseline plus immutable tokenizer, template, model, policy and rollout manifests. Complete fixed log-probability, mask and state-identity tests only in this stage.
- **Reference - Reference:** [TRL GRPO Trainer - KL estimation and loss](https://huggingface.co/docs/trl/v1.15.0/en/grpo_trainer) - Read Estimating the KL divergence for the k3 formula with the reference-over-policy ratio, and the default KL-coefficient note. Use it as the correct-ratio reference beside the RLHF Book code estimators.

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

### Study units

#### U1. Feedback types, policy-dependent collection and target-preference definition

**About 4 h** · **Target:** Explain

Topics: Demonstrations, comparisons, rankings, ratings and critiques as distinct feedback; Prompt sampling and policy-dependent response collection; Annotator population, rubric and target-preference definition

Every reward model inherits the feedback it was fed. Vague target preferences and off-policy pairs mistarget all later optimization, no matter how good the loss is.

**You can now**

- Explain how demonstrations, comparisons, rankings, ratings and critiques differ as training signals and which pipeline stage each one feeds.
- Explain why preference pairs should come from the current model family and what breaks when collection is off-policy.
- Define a target preference for a task: whose judgments count, under which rubric, and how ties and disagreement are handled.

**Study**

1. [Preference data collection practices](https://rlhfbook.com/c/11-preference-data) (RLHF Book - Reward Models, Preferences and Evaluation) - Collecting Preference Data (on-policy data and the chosen answer as relatively better); Interfaces; Rankings vs Ratings with the 5-point and 8-point Likert scales; Multiturn Data; Structured Preference Data; Sourcing and Contracts; Bias: Things to Watch Out For; Open Questions in RLHF Preference Data.
2. [Why preferences replace correctness](https://rlhfbook.com/c/10-preferences) (RLHF Book - Reward Models, Preferences and Evaluation) - When Preference Replaces Correctness (the goldfish poem pair); Complexity of Optimizing Preferences (preference drift, aggregation limits).
3. [Preference elicitation and query selection](https://arxiv.org/abs/1706.03741) (Deep Reinforcement Learning from Human Preferences) - arXiv:1706.03741v4, Sections 2.2.2 to 2.2.4 (segment-pair elicitation, reward fitting, query selection) and Section 3 (Atari and robotics results).
4. [Lecture 8 on preferences and preference data](https://rlhfbook.com/teach/course/lec8-chap10-11-preferences/slides.pdf) (RLHF Book Course - Lectures 2, 8 and 9) - Lecture 8: On Preferences and Preference Data (Chapters 10 and 11); full lecture video on the course page https://rlhfbook.com/course.

**Focus**

- On-policy means pairs drawn from the current model family. Different models have different generation patterns, so pooled third-party completions miss the regions the policy will actually visit.
- The chosen answer is better relative to the shown alternatives, not globally correct. All compared completions can be correct, or all incorrect, and the pair still teaches.
- A Likert integer records a ranking between shown responses, which differs from a rating of one response alone. An even scale such as the 8-point form removes ties, and the result is still binarized for reward training.
- Multiturn collection continues from the chosen answer, unrolls every turn into its own prompt, and masks all previous turns from the loss. Structured domains build pairs automatically but the constraint must stay inside the prompt.

**Reproduce:** Closed-book, write a one-paragraph target-preference definition for a summarization task: feedback types used, prompt sampling, annotator population, rubric axes, and the tie and disagreement policy. State why the pairs must come from the current model family.

**Traps**

- Reading chosen as correct. A preference pair orders two outputs; correctness needs a verifier, which arrives in a later unit.
- Treating on-policy as the exact current checkpoint. The book uses it softly for the current model family, which is stricter than pooled data but looser than per-update sampling.
- Assuming vendor data matches downstream users. Professional labeling settings, interfaces and repetition shift preferences, so audit transfer instead of assuming it.

**Practice**

- [Hands-on Modern RL 13.4 Exercises: SFT and preference items for one prompt](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter15_rlhf/standard-rlhf-pipeline) - Exercises, item 1: design an `sft_item` and a `preference_item` for the same prompt (page read 2026-10-14). Runs on CPU. State the target preference, the rubric and the tie policy alongside the two records.

**Stop when:** You can state the target preference, the feedback-type mix and the collection plan for a new task, and your paired records pass the page exercise without leaking evaluation prompts.

<details>
<summary>Self-test</summary>

1. Why should preference pairs come from the current model family rather than a pool of popular third-party outputs?
   - Each model family has its own generation patterns. Training on pooled outputs teaches distinctions in regions the policy never visits and misses the regions it will visit, so optimization pressure lands in the wrong place.
2. What does the 8-point Likert scale remove, and what happens to its labels at training time?
   - Its even scale removes the tie option. The labels are still reduced to a binary chosen and rejected signal for reward-model training.
3. Can a well-labeled pair teach anything when both completions are factually correct?
   - Yes. The label records which response is clearer, safer or more helpful relative to the other, and the reward model learns that ordering.
4. How is multiturn preference data turned into training prompts?
   - Each turn becomes one prompt that continues from the chosen answer, and every previous turn is masked from the loss so only the judged turn teaches.

</details>

#### U2. Preference triples, Bradley-Terry likelihood and reward identifiability

**About 4 h** · **Target:** Derive

Topics: Pairwise preference triples and listwise comparisons; Bradley-Terry preference likelihood; Reward differences, additive identifiability and scale limits

The reward model learns differences, not absolute quality. Misreading its scores as calibrated quality breaks every later claim about margins, scales and KL penalties.

**You can now**

- Derive the Bradley-Terry sigmoid form from exponential strengths and the pairwise negative log-likelihood loss.
- Explain additive identifiability: only reward differences matter, while scale changes the preference probabilities.
- State how margin terms, per-prompt grouping and K-wise Plackett-Luce extend the pairwise loss, and when K equal to 2 reduces to Bradley-Terry.

**Study**

1. [Bradley-Terry training and loss forms](https://rlhfbook.com/c/05-reward-models) (RLHF Book - Reward Models, Preferences and Evaluation) - Training a Bradley-Terry Reward Model: exponential strengths, the sigmoid form, the log-before-average derivation, the log-sigmoid and softplus losses and their equivalence by $`\Delta`$ substitution.
2. [Margin, per-prompt grouping and K-wise extensions](https://rlhfbook.com/c/05-reward-models) (RLHF Book - Reward Models, Preferences and Evaluation) - Other Reward Model Variants: Preference Margin Loss with margin m, Balancing Multiple Comparisons Per Prompt with grouped averaging, K-Wise Loss Function with the Plackett-Luce ranking probability.
3. [BT loss implementation line](https://github.com/natolambert/rlhf-book/blob/1042143366d73ff654727e4d18a1d3a21209c3a3/code/reward_models/train_preference_rm.py) (RLHF Book - Reward Models, Preferences and Evaluation) - Pairwise loss `loss = -F.logsigmoid(r_chosen - r_rejected).mean()` inside `PreferenceRewardModel` in `train_preference_rm.py`; the chapter Implementation Example writes the same line with `rewards_chosen` and `rewards_rejected`.
4. [Reward learning lecture with the preference-query reading](https://cs224r.stanford.edu/slides/08_cs224r_reward_learning_2026.pdf) (Stanford CS224R 2026 - Reward Learning) - Lecture 08: Reward Learning on the course timeline https://cs224r.stanford.edu/ (Week 4) with the Christiano et al. preference paper as its listed reading.

**Focus**

- Preference probability depends only on the score difference. With $`\Delta = r_{\text{c}} - r_{\text{r}}`$, the model is $`P(y_c \succ y_r \mid x) = \sigma(\Delta)`$ and the per-example loss is $`\mathcal{L} = -\log \sigma(\Delta)`$.
- Maximum likelihood takes the logarithm before averaging over the dataset. Maximizing expected probability is not the same objective as maximizing expected log-probability.
- Adding one constant to every reward leaves every pairwise probability unchanged, but multiplying rewards by $`c > 1`$ pushes every probability away from 0.5 and $`c < 1`$ pulls it toward 0.5. Only the additive constant is unidentified; the data pin down the scale.
- A margin $`m`$ demands that the difference clear a threshold, per-prompt grouping stops many-completion prompts from dominating, and the K-wise product over a full ranking collapses to the pairwise form when $`K = 2`$.

**Reproduce:** Closed-book, derive the sigmoid form from the exponential ratio, then compute the loss for scores 2.0 versus 0.5 as 0.2014 and for equal scores as 0.6931. Show that adding 10 to both scores changes nothing.

**Traps**

- Averaging probabilities instead of log-probabilities. The book derivations keep the log inside the dataset expectation for the maximum-likelihood reason.
- Reading a reward of 5 as good in absolute terms. Scores from two runs share no scale, so only differences within one model and data distribution order outputs.
- Treating K-wise ranking as a different model family at K equal to 2. The product has one factor left and equals the pairwise probability.

**Practice**

- The section mini-project covers this: fixed-batch Bradley-Terry loss, gradient and sign tests against hand calculations, including margin and grouped variants.

**Stop when:** You derive the loss from the exponential form without notes and predict how additive shifts, rescaling and margins move the loss before running code.

<details>
<summary>Self-test</summary>

1. Show that adding a constant to every reward changes no pairwise probability.
   - Each numerator and denominator gains the same factor $`e^c`$, which cancels, so only the difference $`\Delta`$ enters $`\sigma(\Delta)`$.
2. What loss does a tied pair produce, and why?
   - With $`\Delta = 0`$, $`\sigma(0) = 0.5`$ and $`-\log 0.5 = 0.6931`$. The model is maximally uncertain.
3. Why must the logarithm come before the dataset average?
   - Maximum likelihood maximizes the expected log-probability of the observed choices. Averaging probabilities first defines a different, incorrect objective.
4. A margin of 3 applies to a pair whose reward difference is 1. What is the loss?
   - The margin loss is $`-\log \sigma(1 - 3) = -\log \sigma(-2) = 2.1269`$. The margin requires the difference to clear 3, so a difference of 1 is penalized heavily.

</details>

#### U3. Reward-model loss, held-out ranking accuracy, calibration and slices

**About 5 h** · **Target:** Implement + Measure

Topics: Pairwise reward-model architecture and training loss; Reward-model held-out ranking accuracy; Calibration, margins and disagreement slices

A reward model that orders pairs well can still fail policy optimization through tiny margins, shifted scales or length bias. Training and evaluation must measure all three before any policy update.

**You can now**

- Implement the pairwise loss with a last-token scalar head and train one epoch on a tiny preference set on CPU first.
- Measure held-out pairwise accuracy, mean and median margin and reward-length correlation on prompt-split data.
- Distinguish ranking accuracy from score calibration, using Maximum likelihood and MAP estimation and the calibration and ranking units you already did.

**Study**

1. [Reward-model architecture, training and first full protocol](https://rlhfbook.com/c/05-reward-models) (RLHF Book - Reward Models, Preferences and Evaluation) - The Default Reward Model Architecture (last-token scalar head); Implementation Example (`BradleyTerryRewardModel` with last non-padding hidden state); one-epoch training practice; Suggested Experiments item 1 (train a Bradley-Terry model on UltraFeedback with `reward_models/configs/preference_rm.yaml`).
2. [Reward-model data splits, scale and acceptance checks](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter15_rlhf/standard-rlhf-pipeline) (Hands-on Modern RL - RLHF Evaluation and Process Rewards) - Step 2: Data Splitting By Prompt (`split_by_prompt`); Reward Scale (`RewardNormalizer` on a fixed calibration set); What to Look At (`rm_eval_metrics` with accuracy, margins and length correlation); Adversarial Testing stress cases (page read 2026-10-14).
3. [First large-scale comparison-trained reward model](https://arxiv.org/abs/2009.01325) (Learning to Summarize from Human Feedback) - arXiv:2009.01325v3, Sections 1 to 3 (comparison collection, reward training, policy optimization) and the human-evaluation protocol with the length analysis.
4. [Reward-model metrics and their course targets](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter15_rlhf/evaluation) (Hands-on Modern RL - RLHF Evaluation and Process Rewards) - Per-Stage Metrics: pairwise accuracy with a typical 65 to 75 percent course target (annotators agree only about 80 percent), reward margin, and a reward-length correlation above 0.5 in absolute value as a length-hacking signal (page read 2026-10-14). Depth: Treat the targets as course guardrails for small runs, not constants that transfer across rubrics.

**Focus**

- Read the loss as maximum likelihood over chosen and rejected pairs, as in Maximum likelihood and MAP estimation. The head reads the last non-padding hidden state and one scalar leaves the model per sequence.
- Split by prompt, never by pair. Pairs from one prompt scattered across train and held-out sets share prompts and responses, which inflates accuracy.
- Report accuracy with the margin distribution and the reward-length correlation. Tiny margins give PPO a weak noisy signal even at acceptable accuracy, and strong length correlation means the data taught longer-is-better.
- Fix the reward scale on a calibration set before policy training. Batch statistics drift with the actor, while scores such as 2 versus 1 and 20 versus 10 order identically but drive PPO differently.

**Reproduce:** Closed-book, score four fixed pairs with chosen rewards `[2.0, 0.2, 1.0, 0.0]` and rejected rewards `[0.5, 0.1, 1.5, -0.5]`: margins `[1.5, 0.1, -0.5, 0.5]`, accuracy 0.75, mean margin 0.4 and mean loss 0.5735. Then state the split, scale and slice checks that must pass before PPO.

**Traps**

- Chasing 100 percent held-out accuracy. Humans disagree on many pairs: on a subset of its summarization comparisons, Stiennon et al. measured labeler-researcher agreement at 77 percent and researcher-researcher agreement at 73 percent. Near-perfect accuracy on human labels points to a leaky split or overfitting.
- Reading large margins as calibration. A large gap can come from overfitting, and ranking accuracy never promises calibrated probabilities; use Calibration curves and Platt or isotonic recalibration and ROC AUC, average precision, log loss and Brier score where probabilities matter.
- Training past one or two epochs by default. Preference sets are small relative to backbone size, so validation accuracy usually peaks early and then drops.

**Practice**

- [Hands-on Modern RL 13.4: prompt split, normalizer and RM metrics on tiny local pairs](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter15_rlhf/standard-rlhf-pipeline) - Run `split_by_prompt`, `RewardNormalizer` and `rm_eval_metrics` on a few hand-written pairs, then run the Adversarial Testing stress cases (page read 2026-10-14). Runs on CPU. Report accuracy, mean and median margin and length correlation, plus which stress case outscores a correct terse answer.
- [RLHF Book Suggested Experiment 1: train a Bradley-Terry model on UltraFeedback](https://github.com/natolambert/rlhf-book/blob/1042143366d73ff654727e4d18a1d3a21209c3a3/code/reward_models/train_preference_rm.py) - `uv run python -m reward_models.train_preference_rm --config reward_models/configs/preference_rm.yaml` on a copy of the YAML with `samples` and `model_id` lowered first. Plan on your GPU: the YAML defaults to `device: cuda`, a 0.6B backbone and W&B logging, so set `use_wandb: false` in the copied YAML for an offline run. Watch the chosen and rejected margin in the logs before any policy training.

**Stop when:** Your tiny CPU run reports accuracy, margins and length correlation on a prompt split, and you can reject a high-accuracy model for collapsed margins or length bias with numbers.

<details>
<summary>Self-test</summary>

1. Why must the held-out split separate prompts rather than pairs?
   - Pairs from one prompt share the prompt and often share responses. Splitting pairs leaks both sides of the distribution into training, while a prompt split tests generalization to unseen prompts.
2. Accuracy is 0.90 but the median margin is 0.05. Should PPO start?
   - No. Ordering without separation gives a weak noisy reward signal. Inspect the margin distribution, check for overfitting, and fix the data before optimizing.
3. Reward-length correlation is 0.8 on held-out pairs. What caused it and what is the fix?
   - Chosen responses are systematically longer, so the model learned longer-is-better. Add rejected long-filler pairs against concise chosen answers and retrain, as the data-flywheel fix describes.
4. Two reward models output (2, 1) and (20, 10) on the same pair. Do they agree, and does PPO behave the same?
   - They order the pair identically but drive PPO differently: the small scale is drowned by the KL penalty and the large scale dominates it. Normalize on a fixed calibration set first.

</details>

#### U4. Outcome, process and generative reward models

**About 4 h** · **Target:** Explain

Topics: Outcome reward models; Process reward models and step boundaries; Generative reward models and judge rationales

One terminal score cannot say which step failed. Choosing outcome, process or generative feedback decides where credit lands and what annotation bill you pay.

**You can now**

- Explain what outcome, process and generative reward models predict, which tokens or steps carry labels, and how scores aggregate.
- Explain sparse terminal credit versus step credit with the discounted-return arithmetic.
- State when step supervision is worth its annotation cost and what a step boundary must define before labeling.

**Study**

1. [Outcome, process and generative reward models](https://rlhfbook.com/c/05-reward-models) (RLHF Book - Reward Models, Preferences and Evaluation) - Outcome Reward Models (per-token outcome loss and the sequence cross-entropy form); Process Reward Models (per-step loss, separator labels, 3-class head); Comparing Reward Model Types with the summary table and the ORM versus value-function distinction; Inference Across Reward Model Types (aggregation choices); Generative Reward Modeling (judge prompt, temperature 0 practice).
2. [Process versus outcome supervision on MATH](https://arxiv.org/abs/2305.20050) (Let's Verify Step by Step) - arXiv:2305.20050v1, Sections 1 to 3 (outcome versus process supervision, active learning) with the MATH comparison and the released PRM800K step labels.
3. [Outcome versus process rewards with hand recomputation](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter20_prm_search/outcome-vs-process) (Hands-on Modern RL - RLHF Evaluation and Process Rewards) - Sections 1 to 4: sparse-reward masking, discounted return with $`\gamma = 0.9`$, GAE and token-level loss limits, ORM and PRM definitions with aggregation, and the three-condition test for needing process reward (page read 2026-10-14). Depth: Recompute the discounted weights by hand and check them against the page: $`0.9^8 \approx 0.43`$ for the first step, then 0.66, 0.73 and 0.90 for the later steps it names.

**Focus**

- An outcome model broadcasts one binary outcome label to every completion token and trains binary cross-entropy there. A process model trains only at step boundaries, such as separator tokens, with correct, neutral and incorrect classes.
- With only a final reward of 1 and $`\gamma = 0.9`$ over nine steps, early steps get weights down to $`0.9^8 \approx 0.43`$. Distance discounting punishes early assumptions even when they determine everything downstream.
- Aggregation is a decision, not a default. Outcome scores aggregate by mean, minimum or product, and process scores aggregate over steps by mean, minimum or late-weighted sums.
- A pairwise model trained on correct versus incorrect pairs is still a Bradley-Terry contrastive model. An outcome model needs independently labeled sequences without same-prompt pairing.

**Reproduce:** Closed-book, write the per-token outcome loss and the per-step process loss from memory, state which positions carry labels in each, and compute the nine-step discounted weights for a final reward of 1 with discount 0.9.

**Traps**

- Reading outcome per-token outputs as step-correctness scores. Every token repeats the outcome label, so reasoning errors that still reach the right answer are reinforced, not flagged.
- Treating token-level policy losses as process supervision. Per-token weighting still starts from one terminal signal with no independent judge of each step.
- Buying step labels before defining steps. Equation transforms, code edit-compile-test cycles and tool calls are stable boundaries; token counts are not.

**Practice**

- [Hands-on Modern RL 17.1: discounted-return hand recomputation](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter20_prm_search/outcome-vs-process) - Section 2.1 with $`\gamma = 0.9`$ over the nine-step proof: recompute every step weight and state which step the distance rule undervalues most (page read 2026-10-14). Runs on CPU. The first step should come out near 0.43 and the erroneous sixth step near 0.73.
- [RLHF Book Suggested Experiment 2: outcome versus process supervision](https://github.com/natolambert/rlhf-book/blob/1042143366d73ff654727e4d18a1d3a21209c3a3/code/reward_models/train_orm.py) - Run `uv run python -m reward_models.train_orm --config reward_models/configs/orm.yaml` and `uv run python -m reward_models.train_prm --samples 500 --epochs 2`, then state which model scores final answers and which scores intermediate steps. Needs your GPU. For an offline run set `use_wandb: false` in a copied `orm.yaml` and run `uv run python -m reward_models.train_prm --samples 500 --epochs 2 --no-wandb`. Compare what each trained head can score: final-answer correctness versus step correctness.

**Stop when:** You can label any new supervision scheme as outcome, process or generative, write its loss and label positions, and defend or reject step labels for a new task with the three-condition test.

<details>
<summary>Self-test</summary>

1. How do outcome models and value functions differ if both emit per-token numbers?
   - Outcome models predict the probability of final correctness from fixed offline labels broadcast to every token. Value functions predict remaining return, usually from on-policy rollouts, and serve as baselines in advantages.
2. A proof reaches the right conclusion through a wrong step 6. What does outcome-only training reinforce?
   - Everything: the correct prefix, the wrong step and the conclusion share one terminal reward, so the error is reinforced alongside the good reasoning.
3. When is process reward worth its annotation cost?
   - When steps have stable meaning, intermediate errors propagate and waste budget, and the step judge is more reliable than the generator. Short answers with cheap resampling usually fail this test.
4. What did the step-by-step paper report on MATH, and under which setup?
   - Process supervision beat outcome supervision on MATH problems with 78 percent solved on a representative test subset, using the paper's candidate generation and best-of-n reranking setup with 800,000 released step labels. It is the paper's result on its setup, not a transferable constant.

</details>

#### U5. Executable verifiers, completeness, soundness and verifier error tests

**About 5 h** · **Target:** Implement + Measure

Topics: Executable, rule-based and formal verifiers; Verifier completeness, soundness and parser boundaries; False-positive and false-negative verifier tests

Verifiable tasks replace noisy human scores with exact checks, but every verifier has a parser boundary. Policy optimization finds that boundary fast, so tests must cover it first.

**You can now**

- Implement a deterministic verifier with explicit parser boundaries and report completeness and soundness separately.
- Build false-positive and false-negative verifier tests, including equivalent-answer and format-deviation cases.
- State what a verifier cannot establish and which failures need hidden tests outside training.

**Study**

1. [Verifiable rewards with a runnable verifier](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter18_grpo/rlvr) (Hands-on Modern RL - RLHF Evaluation and Process Rewards) - Section 15.3.2 (determinism, correctness and efficiency; parser boundary cases); Section 15.3.4 (extract, grade and reward functions with `extract_boxed_answer` and `reward_rlvr`); Gap from Production Implementations; Section Summary (page read 2026-10-14).
2. [Step boundaries and formal checking vocabulary](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter20_prm_search/outcome-vs-process) (Hands-on Modern RL - RLHF Evaluation and Process Rewards) - Section 1.3 (step boundaries must be decided before scoring) and Section 4.1 (discriminative, generative and formal feedback with Lean and Coq proof checkers) (page read 2026-10-14).
3. [Deterministic verifier with hidden adversarial tests](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-3/llm-post-training-laboratory.md) (LLM Post-Training Laboratory - Reward and Adversarial Evaluation) - Core requirements and Architecture constraints (deterministic verifier, version binding, immutable rollouts); Milestones C and D (verifier tests, loophole injection, proxy-improves-behavior-worsens case).

**Focus**

- A usable verifier promises three properties: determinism on identical inputs, correctness against true answer quality, and speed that never bottlenecks training. Correctness is the subtle one.
- Completeness accepts correct answers and soundness rejects wrong ones. Report both rates, because a strict parser can be sound yet incomplete and a lenient matcher the reverse.
- Parser boundaries decide rewards as much as math does. Boxed-answer extraction, numeric tolerance and symbolic equivalence each accept and reject different equivalent forms.
- Verifiers cover only checkable slices. Math, code tests and formal proofs qualify; politeness, creativity and safety do not, and training tests must stay separate from hidden release tests.

**Reproduce:** Closed-book, write boxed-answer extraction plus grading with string and tolerance comparison, then list four test cases: a correct answer, a wrong answer, a right answer in the wrong format, and an equivalent form such as a fraction versus a decimal.

**Traps**

- Counting a missing box as a math failure. The page's boxed-only extractor returns no answer and reward 0, which trains format compliance, not reasoning; fix the parser contract or teach format separately.
- Equating string equality with answer equivalence. Fractions, decimals, factored and expanded forms need tolerance or symbolic checks, or correct answers fail.
- Shipping one verifier as complete evaluation. Visible tests leak into training incentives, so release needs hidden tests the policy never optimized against.

**Practice**

- [Hands-on Modern RL 15.3: runnable RLVR verifier with error tests](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter18_grpo/rlvr) - Run `code/chapter09_grpo_rlvr/rule_based_reward.py` at commit 9231bab without any model and compare its extraction (boxed answer, then answer phrases, then the last number) with the page's boxed-only `extract_boxed_answer`. Then add false-negative cases (equivalent forms such as 1/2 versus 0.5, format deviations) and false-positive cases (a wrong number the fallback picks up, tolerance edges) (page read 2026-10-14). Runs on CPU. Record completeness and soundness separately for both extractors; keep the training cases and the hidden cases in different files.

**Stop when:** Your verifier passes hidden equivalent-answer and format-deviation cases with separate completeness and soundness rates, and you can name what it cannot check.

<details>
<summary>Self-test</summary>

1. What do completeness and soundness measure for a verifier?
   - Completeness is the rate at which correct answers pass; soundness is the rate at which wrong answers fail. A verifier can be perfect on one and poor on the other.
2. The model derives the right number but omits the boxed format and gets 0. Is the math wrong?
   - Not necessarily. The parser boundary rejected it before grading. The reward conflates format and math, so either widen the parser or train format as its own objective.
3. What separates the minimal classroom verifier from a production math verifier?
   - Production adds symbolic equivalence checks, LaTeX parsing and multiple accepted formats where the minimal version uses string matching plus float tolerance.
4. What must accompany every verifier score at release?
   - Held-out problems plus adversarial and hidden tests with version binding. Training reward is never the sole release metric.

</details>

#### U6. Length and style shortcuts, reward shift and overoptimization

**About 4 h** · **Target:** Explain + Measure

Topics: Format, verbosity, style and response-length shortcuts; Reward distribution shift as the policy changes; Reward overoptimization and proxy regression

Optimizing a learned reward exploits its blind spots by design. Without a proxy-versus-behavior check, rising reward reads as progress while the product gets worse.

**You can now**

- Explain proxy-versus-gold overoptimization: train reward rises while true quality peaks then falls with KL distance, with different curves for RL and best-of-n.
- Measure length, template and format shortcuts with reward-length correlation and phrase-frequency checks.
- Distinguish overoptimization from overfitting and state the rollback rule when proxy and behavior diverge.

**Study**

1. [Overoptimization, proxy objectives and qualitative failure signs](https://rlhfbook.com/c/14-over-optimization) (RLHF Book - Reward Models, Preferences and Evaluation) - Managing Proxy Objectives (Goodhart, proxy versus true objective, verbosity and rare-token exploits); Over-Refusal and Too Much RLHF; Quantitative Over-Optimization (KL distance axis, train and test reward-model split); Misalignment and the Role of RLHF (sycophancy).
2. [Proxy-versus-gold scaling curves](https://arxiv.org/abs/2210.10760) (Scaling Laws for Reward Model Overoptimization) - arXiv:2210.10760v1, Sections 1 to 4 (gold-standard reward as the human stand-in, proxy training, best-of-n and RL curves against KL distance, effects of data and parameters) and Section 3.6 (Effect of KL Penalty).
3. [Reward-hacking detection and controlled experiment](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter15_rlhf/evaluation) (Hands-on Modern RL - RLHF Evaluation and Process Rewards) - Reward Hacking Specialized Checks (`reward_hacking_signals` with length correlation and phrase counts); Reward Hacking Controlled Experiment (`flawed_reward`, hand calculation, anomaly curves); Reward hacking diagnosis flow; Training-Time Monitoring checkpoint table (page read 2026-10-14). Depth: Recompute the worked win rates with ties as half-wins and run `flawed_reward` on the two strings yourself. The page example table divides by wins plus losses only, and its printed reward totals do not match character-length scoring, but the ordering verdict (verbose beats concise) is what you must reproduce.
4. [Data biases that become shortcuts](https://rlhfbook.com/c/11-preference-data) (RLHF Book - Reward Models, Preferences and Evaluation) - Bias: Things to Watch Out For (verbosity, formatting habits, sycophancy and prefix bias).

**Focus**

- Overoptimization differs from overfitting. Overfitting degrades the same task on held-out data; overoptimization improves the proxy while the true goal peaks then falls, so plot quality against KL distance, not just steps.
- In the paper setup, gold score follows different functional forms in KL distance for RL and best-of-n, with RL spending far more KL, while gold against proxy score looks similar for both. A fixed gold model stands in for humans, so label the curves synthetic overoptimization evidence, never human results.
- Length bias is load-bearing evidence, not folklore. On TL;DR, length explains about a third of the gap between the 6.7B human-feedback and supervised models in the summarization work, and in a train and test reward-model split the book shows, test reward stops following train reward as optimization continues.
- Fixes combine data, rubric and constraints. Penalizing length alone treats a symptom; the durable fix feeds bad cases back as rejected pairs, retrains the reward model and holds the KL constraint.

**Reproduce:** Closed-book, sketch train-reward rising while gold quality rises then falls against KL distance for RL and best-of-n, then run the flawed length-plus-format reward on one concise and one verbose answer and show the verbose one wins.

**Traps**

- Reading the page win-rate table as ties-count-half. Its rows divide wins by wins plus losses, so recompute as wins plus half ties over all outcomes before quoting a rate.
- Trusting printed flawed-reward totals exactly. Character-length scoring on the page strings gives larger totals than printed, but both rank the verbose empty answer above the concise accurate one; run the function.
- Calling the KL penalty a fix by itself. The book says a higher penalty reduces overoptimization at a given KL distance but needs more steps, and in the Gao et al. RL setup the penalty left the gold versus KL frontier unchanged, acting like early stopping. Either way it is a brake, not a repair of the reward model.

**Practice**

- [Hands-on Modern RL 13.6: flawed-reward hacking experiment](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter15_rlhf/evaluation) - Run the full Reward Hacking Controlled Experiment: score both worked answers with `flawed_reward`, log reward, length, distinct n-grams and KL across steps, then apply the multi-dimensional `safer_reward` fix (page read 2026-10-14). Runs on CPU. Keep every run including the hacked regime; the table shape matters more than any single number.

**Stop when:** You can run the flawed-reward experiment, read the reward, length and diversity curves together, and issue a rollback with the data fix instead of tuning the penalty alone.

<details>
<summary>Self-test</summary>

1. How does overoptimization differ from overfitting?
   - Overfitting memorizes training examples so the same task degrades on held-out data. Overoptimization genuinely improves the proxy while the true goal degrades, because the metric itself diverges from the goal.
2. What does the gold-versus-proxy setup establish, and what are its limits?
   - A fixed gold model stands in for humans while a proxy trains on its labels; optimizing the proxy traces different curve forms for RL and best-of-n against KL distance. It models human feedback synthetically, so it cannot set human constants.
3. Reward correlates 0.8 with length and mean length tripled while reward rose. What is the call?
   - Length hacking. Roll back, add concise-chosen versus long-filler-rejected pairs, retrain the reward model, and require the length correlation and manual review to pass before resuming.
4. Why is a length penalty alone an incomplete fix?
   - It suppresses one exploit without repairing the reward model or the rubric. The policy shifts to the next blind spot such as templates or confident jargon, so pair the penalty with flywheel data and KL control.

</details>

#### U7. Active collection, AI feedback and constitutions, and judge bias

**About 4 h** · **Target:** Explain + Measure

Topics: Active feedback collection and uncertain comparisons; AI feedback, constitutions and rubric-conditioned labels; Judge position, identity, self-preference and correlated-error bias

AI judges scale labeling but share blind spots with the policy they train. Unmeasured judge bias becomes policy bias within one flywheel turn.

**You can now**

- Explain active collection: uncertain and disagreement comparisons first, with recollection as the policy shifts.
- Run a rubric-conditioned AI-feedback comparison and measure position, length, identity and self-preference bias with order swaps and human spot checks.
- State what correlated judge error implies for training on judge labels.

**Study**

1. [Supervised self-critique and RL from AI feedback](https://arxiv.org/abs/2212.08073) (Constitutional AI: Harmlessness from AI Feedback) - arXiv:2212.08073v1, Sections 3 and 4 with Figure 1 (self-critique and revision, then preference modeling and RL from AI feedback) and Appendix C (principles for each stage).
2. [Active learning for step supervision](https://arxiv.org/abs/2305.20050) (Let's Verify Step by Step) - arXiv:2305.20050v1, Section 4.2 (Active Learning: in the small-scale synthetic setup, labeling convincing wrong-answer samples is estimated at about 2.6 times more data efficient than uniform labeling).
3. [Disagreement queries and online collection](https://arxiv.org/abs/1706.03741) (Deep Reinforcement Learning from Human Preferences) - arXiv:1706.03741v4, Section 2.2.4 (Selecting Queries by ensemble disagreement, which the authors call a crude approximation) and Section 3.3 (Ablation Studies: random queries, no ensemble and no online queries, where reward fitted only on early queries led to behavior the true reward rejects).
4. [Generative judges and their failure modes](https://rlhfbook.com/c/05-reward-models) (RLHF Book - Reward Models, Preferences and Evaluation) - Generative Reward Modeling (judge prompt with position and length instructions, verdict format, temperature 0 practice) and Further Reading on judge-training work.
5. [Pairwise judge evaluation with bias controls](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter15_rlhf/evaluation) (Hands-on Modern RL - RLHF Evaluation and Process Rewards) - Preference Evaluation (judge prompt, order randomization, recorded reasoning, human spot checks); LLM-as-Judge bias table (position, length, formatting, self, over-safety); Statistical significance (`bootstrap_win_rate_ci` with ties as half-wins) (page read 2026-10-14).

**Focus**

- Label uncertain and disagreement comparisons first, but measure the selector: Lightman et al. estimate about 2.6 times better label efficiency for step labels, while Christiano et al. found disagreement queries hurt some tasks. Recollect as the policy moves, since reward fitted only on early queries misses where the policy goes.
- A constitution bounds AI feedback but never specifies it exactly. The paper says its principles were chosen in a fairly ad hoc way for research, so every rubric-conditioned run needs human calibration on a sample.
- Judge with temperature 0, randomized A and B order with recorded seeds, saved reasoning and a fixed evaluation set. Verdicts without reasoning and seeds cannot be audited later.
- Correlated error is the core risk: judge and policy share blind spots, so training on judge labels amplifies them. Anchor the flywheel with an external reward model or human review that the current judge cannot move.

**Reproduce:** Closed-book, write the pairwise judge prompt with order randomization and a JSON verdict, then score five outcomes with 3 wins, 1 tie and 1 loss as 0.7 with ties as half-wins. State the swap test that detects position bias.

**Traps**

- Judging with sampling temperature above 0. Rating variance then contaminates every comparison; the book practice fixes temperature at 0 for judge calls.
- Treating one strong judge as ground truth. Self-preference and style bias need multi-judge or human audit, and the fixed set must survive judge changes.
- Reading a constitution as executable law. Ambiguous principles produce ambiguous labels, so test principle edge cases instead of assuming coverage.

**Practice**

- [Hands-on Modern RL 13.6: order-swapped pairwise judge audit](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter15_rlhf/evaluation) - Run the Preference Evaluation pairwise prompt on a few answer pairs in both orders, compute win rate with `bootstrap_win_rate_ci`, and fill the judge-bias table rows for position, length and self bias (page read 2026-10-14). Runs on CPU. Keep the reasoning, order seeds and human-checked flags with every record.

**Stop when:** Your judge audit shows position-swap stability, a length-bias readout and a human-checked sample, and you can state which labels the current judge cannot be trusted to produce.

<details>
<summary>Self-test</summary>

1. Why prioritize uncertain comparisons, and what forces recollection?
   - Uncertain and disagreement pairs carry the most information per label. The policy distribution shifts under optimization, so yesterday's informative pairs go stale where the policy now samples.
2. How do you test a judge for position bias?
   - Swap A and B with a fresh recorded seed and rerun. If verdicts follow the position rather than the content, randomize order per prompt and store the seed with every record.
3. How do you check self-preference in a judge?
   - Compare its verdicts against other judges and against human review on a sampled subset. A judge that favors its own style needs its weight reduced or its rubric rewritten.
4. Can AI feedback fully replace human labels?
   - No. Scale labeling with AI judges and calibrate direction with humans: spot checks, a fixed evaluation set and an external anchor, so the flywheel cannot merely appease the current judge.

</details>

#### U8. Multiple reward components, scalarization and version lineage

**About 3 h** · **Target:** Implement

Topics: Multiple reward components and scalarization policy; Preference, reward and verifier version lineage

One scalar hides competing goals. Explicit weights plus version binding turn which trade-off shipped into an auditable fact rather than a memory.

**You can now**

- Implement a multi-component reward with explicit scalarization weights plus length and repetition penalties.
- Bind preference, reward and verifier versions to every rollout and evaluation record with an atomic manifest.
- State the rollback rule when any component shifts.

**Study**

1. [Hybrid rewards and experiment artifacts](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter15_rlhf/standard-rlhf-pipeline) (Hands-on Modern RL - RLHF Evaluation and Process Rewards) - The Spectrum of Rewards (hybrid `Rmix` with format, length and correctness weights); Minimal Experiment Directory (data, models and reports layout); quality gates for the data flywheel (page read 2026-10-14).
2. [Multi-dimensional fix and bad-case flywheel](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter15_rlhf/evaluation) (Hands-on Modern RL - RLHF Evaluation and Process Rewards) - Multi-dimensional reward fix (`safer_reward` with 0.40 helpfulness, 0.35 correctness, 0.15 format and two 0.05 penalties); The Data Flywheel (bad-case tags such as `length_hack` and `template_hack`) (page read 2026-10-14). Depth: Treat the printed weights as one worked choice to implement and vary, not as standard constants.
3. [Version binding and instrumentation requirements](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-3/llm-post-training-laboratory.md) (LLM Post-Training Laboratory - Reward and Adversarial Evaluation) - Architecture constraints (every record binds prompt, template, model, reference, reward, verifier and policy versions); Milestone B (instrumentation) and Milestone C (reward and preference implementation).

**Focus**

- Scalarization weights are policy, so record them with the run. Helpfulness, correctness and format get positive weights while repetition and excess length get explicit penalties, and length is a penalty term, never a reward.
- Normalize each component on a fixed calibration set. Current-batch statistics drift with the actor and hide which component moved.
- Group pairwise updates per prompt. Prompts with 9 completions yield 36 pairs against 6 from 4 completions, so ungrouped averaging lets heavy prompts dominate.
- A manifest publishes only complete validated artifacts: ordered paths, checksums, counts, versions and RNG state. Failed and filtered rollouts stay counted with explicit reasons, and changed configs reject resume.

**Reproduce:** Closed-book, write a hybrid reward with separate helpfulness, correctness, format, repetition and length terms plus a manifest listing data, model, tokenizer, template, reward, verifier and policy versions for one run.

**Traps**

- Adding a component without versioning it. An unrecorded weight change is an irreproducible experiment, since no later audit can recover the trade-off.
- Normalizing rewards on the current batch. The scale then chases the actor distribution and every debug comparison becomes meaningless.
- Silently dropping failed rollouts. Deletion changes the estimand, so count failures with reasons in the manifest.

**Practice**

- [Hands-on Modern RL 13.6: scalarized reward with manifest](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter15_rlhf/evaluation) - Implement `safer_reward` on your own answers, vary each weight once, and record a manifest with component versions, checksums and failure counts (page read 2026-10-14). Runs on CPU. Show that a weight change moves the ranking, and that the manifest alone reproduces which trade-off shipped.

**Stop when:** Your scalarized reward plus manifest reproduces which trade-off shipped, survives a weight change and a checker bug, and rejects resume under a changed config.

<details>
<summary>Self-test</summary>

1. Why must reward normalization use a fixed calibration set?
   - Batch statistics move with the policy, so the same behavior scores differently across steps. A fixed set holds the scale still and exposes which component actually shifted.
2. One prompt yields 9 completions and another yields 4. What goes wrong with naive pair averaging?
   - The first prompt contributes 36 pairs against 6 from the second and dominates the update. Average pairs within each prompt so each prompt contributes one grouped update.
3. What must a run manifest contain to support rollback?
   - Data, tokenizer, template, model, reference, reward, verifier and policy versions with ordered paths, checksums, counts and RNG state, covering only complete validated artifacts.
4. A format checker ships a bug mid-run. What is the governance call?
   - Roll back to the last manifest whose acceptance checks passed, quarantine the affected rollouts, and require the predeclared stop rule before resuming with the fixed checker.

</details>

#### U9. Independent evaluation, adversarial tests and reward governance

**About 4 h** · **Target:** Measure

Topics: Train reward versus independent task, human and safety evaluation; Adversarial completions and hidden verifier tests; Reward governance, rollback and collection stop rules

Training reward always votes for itself. Release needs independent evidence plus written rules for when evidence forces a rollback or stops collection.

**You can now**

- Separate train reward from independent task, human and safety evaluation with a frozen regression set and blinded review.
- Build adversarial completions and hidden verifier tests that the policy never trains on.
- Write governance rules: ship thresholds, rollback triggers and collection stop rules.

**Study**

1. [Evaluation eras, unreliability and contamination](https://rlhfbook.com/c/16-evaluation) (RLHF Book - Reward Models, Preferences and Evaluation) - Why Many External Evaluation Comparisons Are Unreliable (prompt, sampling and inference-budget sensitivity); How Labs Actually Use Evaluations Internally; Contamination (n-gram overlap probes, UltraFeedback, Evol-CodeAlpaca, NuminaMath and WildChat overlaps, perturbation limits).
2. [Three-layer evaluation with acceptance and monitoring](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter15_rlhf/evaluation) (Hands-on Modern RL - RLHF Evaluation and Process Rewards) - A Three-Layer Evaluation Stack; Per-Stage Metrics; Training-Time Monitoring checkpoint table; Minimum Acceptance Criteria; Manual Review rubric (page read 2026-10-14). Depth: Use the acceptance numbers as course guardrails to implement and tighten, not as industry standards.
3. [Frozen blinded evaluation with reproduction](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-3/llm-post-training-laboratory.md) (LLM Post-Training Laboratory - Reward and Adversarial Evaluation) - Milestone F (frozen policies, blinded clean, adversarial and shift evaluation, clean-state reproduction, prespecified extension) and Measurement requirements (paired and seed uncertainty with all attempts preserved).

**Focus**

- Answer three questions together, building on Task contracts and automatic metrics: users prefer it, capabilities did not regress, and the reward was not fooled. Benchmarks, preference and manual review each catch what the others miss.
- Freeze prompts, decoding and order. Win rates compare only under identical judges, prompts and settings, and small samples need intervals plus manual review of key claims.
- Treat contamination probes as bounded evidence, building on Contamination and memorization. Overlap search misses paraphrases and format shifts, and perturbed-variant variance suggests format training without proving contamination.
- Write the stop rules before training: ship thresholds, rollback triggers and collection halts. A checkpoint with rising reward, falling regression scores and growing length is a rollback, not a debate.

**Reproduce:** Closed-book, read one monitoring row with reward, KL, length, distinct n-grams, regression score and win rate, issue a ship or rollback call with reasons, and write the collection stop rule for length-hack recurrence.

**Traps**

- Quoting verifier pass rate as complete evaluation. Verifiers cover checkable slices only; safety, honesty and open-ended quality need independent human and task evidence.
- Comparing win rates across different judges or prompts. Rates are comparable only under matched prompts, judges, decoding and item sets.
- Reading a clean overlap probe as proof of clean data. Probes miss transformed content while boilerplate triggers false matches, so review matches and bound the claim.

**Practice**

- [Hands-on Modern RL 13.6 Exercises: regression set and win-rate arithmetic](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter15_rlhf/evaluation) - Exercises 1 and 2: design a 30-prompt regression set across format, reasoning, factual, safety and quality slices, then compute win rates with ties as half-wins (page read 2026-10-14). Runs on CPU. Freeze the set, seeds and decoding before scoring; report sample sizes with every rate.

**Stop when:** You can freeze a regression set, score a checkpoint row against written thresholds, and issue a rollback with the adversarial evidence that forced it.

<details>
<summary>Self-test</summary>

1. Which three questions must release evaluation answer at once?
   - The model is more aligned with preferences, general and specialized capabilities did not regress, and high-reward responses are truly high quality rather than hacked.
2. A checkpoint shows reward 0.45, KL 0.18, mean length 330, distinct-4 0.51, regression 0.70 and win rate 49 percent against SFT. Ship or roll back?
   - Roll back. Reward rose while the regression set fell, length grew, diversity collapsed and the win rate sits below half, which matches the suspected-hacking row pattern.
3. What are the limits of an n-gram contamination probe?
   - It misses paraphrased, translated and reformatted reuse while flagging common boilerplate. High variance on perturbed variants indicates format sensitivity, not proven contamination.
4. State a minimal governance bar for an RLHF-versus-SFT comparison.
   - The Hands-on course guardrails: preference win rate above 55 percent with a manual explanation, regression at 95 percent of SFT or better, mean length within 1.3 times SFT, no repetition surge and no safety regression; anything worse rolls back into the flywheel.

</details>

### Mini-project: Preference rewards, verifiers and hacking evidence

**About 10 to 14 hours.** Build preference rewards and executable verifiers in `policylab`, then show how each can be gamed. The hacking battery and versioned lineage feed every later language-policy update and the capstone evidence pack.

1. Implement fixed-batch Bradley-Terry loss with gradients in `llm/` and check loss, gradient signs and margins against hand calculations, including margin and per-prompt grouped variants, keeping the oracle scripts in `tests/`.
2. Write a target-preference definition for one task, collect small on-policy pairs, train a tiny CPU reward model with a last-token head, and report prompt-split accuracy with margins and length correlation plus a fixed calibration scale.
3. Score fixed completions with outcome, process and generative heads in `llm/`, recompute discounted returns by hand, and compare aggregation choices against the Hands-on Modern RL outcome-versus-process page, keeping token evidence.
4. Build a deterministic verifier with explicit parser boundaries in `llm/`, score fixed answers with both the boxed-only extractor and the fallback extractor, and report completeness and soundness separately with hidden tests retained.
5. Run the Hands-on Modern RL flawed-reward experiment on your own concise and verbose answers, log reward with length and diversity traces, then audit a pairwise judge with order swaps and human spot checks for position and length bias.
6. Combine the heads into one scalarized reward with versioned weights in `llm/`, bind every record in `schema/` and `ledger/`, and freeze a regression set in `eval/` with written ship and rollback rules that a rising-reward and falling-quality row must trigger.

**Deliverables**

- The `llm/` reward and verifier package with loss, scoring and extraction oracles.
- Hacking and judge audits with curves, bias tables and retained failures.
- Version manifests, frozen regression set and governance rules in `eval/`.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [RLHF Book preference reward trainer at pinned commit](https://github.com/natolambert/rlhf-book/blob/1042143366d73ff654727e4d18a1d3a21209c3a3/code/reward_models/train_preference_rm.py). Run offline with remote logging disabled; compare margin behavior first.
- external-tests: [Hands-on Modern RL standard RLHF pipeline](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter15_rlhf/standard-rlhf-pipeline). Run prompt split, normalizer and metric helpers on tiny pairs.
- external-tests: [Hands-on Modern RL RLVR verifier](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter18_grpo/rlvr). Compare boxed-only against fallback extraction on fixed answers.
- external-tests: [Hands-on Modern RL reward evaluation](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter15_rlhf/evaluation). Run flawed-reward and judge-bias checks; keep every run.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Loss correctness | Fixed-batch loss, gradients and signs match hand calculations including margin and grouped variants. | Deliberate sign, margin and grouping bugs each fail a named test. |
| Verifier honesty | Completeness and soundness are reported separately for both extractors with hidden tests retained. | An equivalent-answer case passes under one parser rule and fails under the other, with the boundary named. |
| Hacking evidence | A hacked regime with rising reward and falling quality is retained with length and judge-bias readouts. | The rollback names the data fix and the rerun shows the signal cleared. |
| Lineage and governance | Every record carries reward and verifier versions and the frozen set has written ship and rollback rules. | A mid-run version change is rejected by the manifest test and starts a new study. |

Feeds into: Reward, verifier and hacking artifacts feed preference and online updates plus the capstone evidence pack.

### Resource route

- **Primary - Book:** [RLHF Book - Reward Models, Preferences and Evaluation](https://rlhfbook.com/c/05-reward-models.html) - Study Chapter 5 (reward modeling: Bradley-Terry loss, outcome, process and generative reward models), Chapters 10 and 11 (preferences and preference data), Chapter 14 (over-optimization) and Chapter 16 (evaluation). Implement the pairwise reward loss, compare outcome, process and generative reward roles, and build an adversarial feedback audit covering preference bias, reward shift and overoptimization.
- **Required - Course:** [RLHF Book Course - Lectures 2, 8 and 9](https://rlhfbook.com/course) - Use Lecture 2 (instruction tuning, reward models and rejection sampling), Lecture 8 (preferences and preference data) and Lecture 9 (over-optimization). Reproduce the reward-data-to-score path and keep rejection sampling as a non-RL selection baseline for later online optimization.
- **Required - Paper:** [Deep Reinforcement Learning from Human Preferences](https://arxiv.org/abs/1706.03741) - Study the preference-query, reward-learning and policy-optimization loop. Reproduce a tiny preference model or simulator and measure how label noise or policy shift changes reward accuracy and control quality.
- **Required - Paper:** [Scaling Laws for Reward Model Overoptimization](https://arxiv.org/abs/2210.10760) - Read the gold-reward setup and the proxy-versus-gold curves for best-of-$`n`$ and RL as the KL distance grows. Reproduce the shape at toy scale: a small proxy reward model, a known gold reward and best-of-$`n`$ selection.
- **Support - Paper:** [Learning to Summarize from Human Feedback](https://arxiv.org/abs/2009.01325) - Read the reward-model and policy-training protocol, the KL penalty and the length analysis. Use it as the first full example of a reward model trained on comparisons and then optimized against.
- **Support - Paper:** [Let's Verify Step by Step](https://arxiv.org/abs/2305.20050) - Read how process supervision labels steps, how the process reward model scores a solution and how outcome and process supervision compare under best-of-$`n`$ selection. Define step boundaries for your own task before training any process scorer.
- **Support - Paper:** [Constitutional AI: Harmlessness from AI Feedback](https://arxiv.org/abs/2212.08073) - Study supervised self-critique, AI preference feedback and RL from AI feedback. Implement a bounded rubric-conditioned comparison exercise and test judge correlation and principle ambiguity rather than reproducing the full pipeline.
- **Support - Course:** [Stanford CS224R 2026 - Reward Learning](https://cs224r.stanford.edu/) - Study Lecture 08 (reward learning, `slides/08_cs224r_reward_learning_2026.pdf`) with its Christiano et al. reading, and Section 1.2 of the default project guidelines for preference and verifier datasets. Use fixed chosen and rejected examples and a hidden adversarial split; write independent implementations.
- **Support - Tutorial:** [Hands-on Modern RL - RLHF Evaluation and Process Rewards](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter20_prm_search/outcome-vs-process) - Use the outcome-versus-process page (its discounted ORM and PRM returns are worth recomputing by hand) and the process-reward and search chapter as an implementation map for verifier tests. Check claims against the original sources. Pin commit 9231bab of walkinglabs/hands-on-modern-rl; its `code/chapterNN` folders do not follow the site chapter numbers.
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
- [ ] DPO logistic loss and $`\beta`$ _(Required)_
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
- [ ] Overoptimization as $`\beta`$, epochs or data reuse increase _(Required)_
- [ ] Held-out prompt and annotator slices _(Required)_
- [ ] Compute-matched rejection and SFT controls _(Required)_
- [ ] External task, safety and style evaluation _(Required)_
- [ ] Exhaustive catalog of direct-alignment variants _(Later)_

### Study units

#### U1. The KL-regularized objective and its optimal policy

**About 4 h** · **Target:** Derive

Topics: KL-regularized reward-maximization objective; Optimal policy form under a reference policy

DPO starts with a reward-maximization problem, not a classification trick. Its closed-form solution tells you which reference and support assumptions the later loss inherits.

**You can now**

- Derive the optimal completion distribution for a fixed reward and reference policy.
- Explain how KL direction, reference support and the regularization coefficient constrain that solution.

**Study**

1. [The RLHF Book: the optimal RLHF solution](https://rlhfbook.com/c/08-direct-alignment#dpo-derivation) (RLHF Book - Direct Alignment) - Chapter 8, DPO Derivation: Deriving the Optimal RLHF Solution (page read 2026-10-14). Depth: Stop before Deriving DPO Objectives for BT Models. Track maximizers, not equality of the objective values after sign changes and division by the regularization coefficient.
2. [DPO: optimal-policy derivation](https://arxiv.org/abs/2305.18290v3) (Direct Preference Optimization) - arXiv:2305.18290v3, Section 3 equation 3, Section 4 equation 4 and Appendix A.1.

**Focus**

- For each prompt, maximize expected reward minus $`\beta D_{\mathrm{KL}}(\pi\|\pi_{\mathrm{ref}})`$, with $`\beta>0`$. The expectation defining KL is under the policy being optimized.
- The solution is $`\pi^*(y\mid x)=\pi_{\mathrm{ref}}(y\mid x)\exp(r(x,y)/\beta)/Z(x)`$. Require a finite partition function and optimize on reference support.
- Reuse Entropy, cross-entropy, KL divergence and mutual information and Constraints, KKT conditions and proximal methods. Here the new step is rewriting the reward objective as $`\beta\log Z(x)-\beta D_{\mathrm{KL}}(\pi\|\pi^*)`$.

**Reproduce:** Closed-book, derive the solution by normalization and certify it with the KL rewrite. For one prompt and two completions, take reference probabilities $`(1/4,3/4)`$, rewards $`(\log 3,0)`$ and $`\beta=1`$. Obtain $`Z=3/2`$, $`\pi^*=(1/2,1/2)`$ and optimal objective $`\log(3/2)`$. Check in CPU PyTorch with `torch.float64`, natural logs and absolute tolerance $`10^{-12}`$; no sampling or model is needed.

**Traps**

- Reversing KL. A reference-to-policy penalty yields a different optimization problem.
- Reading the penalty coefficient as a hard KL budget. A finite-data DPO run does not attain a prescribed divergence simply by setting it.
- Giving positive mass to a completion with zero reference probability. Its policy-to-reference KL is infinite.

**Practice**

- [TensorTonic: Score a KL-Regularized Policy Batch](https://www.tensortonic.com/problems/cs336-l15-kl-regularized-policy-objective) - Language Modeling from Scratch: `kl_regularized_policy_objective`; all three public cases. The free problem checks positive sampled divergence, a mixed masked batch and a fully masked response. It scores supplied log probabilities; it does not prove the optimal-policy formula or estimate KL from arbitrary offline preferences.

**Stop when:** You derive and certify the two-completion optimum unaided and pass the named problem without clamping negative sampled divergences.

<details>
<summary>Self-test</summary>

1. Why does the partition function not change while optimizing the policy?
   - The reward, reference and regularization coefficient are fixed. The partition function depends on these and the prompt, not on the candidate policy.
2. What happens as the regularization coefficient grows without bound for bounded rewards?
   - The exponential reward tilt approaches one, and the optimum approaches the reference distribution.
3. Can a single sampled log-ratio be negative although KL is nonnegative?
   - Yes. Nonnegativity holds for the expectation under the policy, not for each completion's log-ratio.

</details>

#### U2. Implicit rewards from policy ratios and the DPO derivation

**About 4 h** · **Target:** Derive

Topics: Implicit reward reparameterization from policy ratios; Bradley-Terry substitution and DPO derivation

The partition function is intractable, but comparisons at the same prompt remove it. Knowing exactly why it cancels prevents using the derivation for mismatched prompts or treating finite-data fitting as an optimality guarantee.

**You can now**

- Derive DPO by substituting policy-ratio rewards into a Bradley-Terry likelihood.
- State the reward-identifiability, preference-model and coverage assumptions behind the substitution.

**Study**

1. [The RLHF Book: Bradley-Terry substitution](https://rlhfbook.com/c/08-direct-alignment#dpo-derivation) (RLHF Book - Direct Alignment) - Chapter 8, DPO Derivation: Deriving DPO Objectives for BT Models (page read 2026-10-14). Depth: Stop before Deriving the BT DPO Gradient.
2. [DPO: reparameterization and reward equivalence](https://arxiv.org/abs/2305.18290v3) (Direct Preference Optimization) - arXiv:2305.18290v3, Section 4 equations 5 to 7, Section 5.1 Definition 1 and Lemmas 1 to 2, Appendix A.2.
3. [Stanford CS224R Lecture 09: DPO in four steps](https://cs224r.stanford.edu/slides/09_cs224r_rlhf_2026.pdf) (Stanford CS224R 2026 - LLM Preference Optimization) - PDF pages 43 to 45 (printed slide numbers 74 to 76): Can we simplify RLHF?, the closed-form optimum rearranged into a reward, and the Bradley-Terry loss on reward differences where the partition term cancels. Depth: The slides write the reference as $`p^{PT}`$. Use them to check your derivation, not as a substitute for the paper's assumptions.

**Focus**

- Inversion gives $`r(x,y)=\beta\log(\pi^*(y\mid x)/\pi_{\mathrm{ref}}(y\mid x))+\beta\log Z(x)`$. Keep the additive term until taking a same-prompt reward difference.
- Bradley-Terry uses $`P(y_c\succ y_r\mid x)=\sigma(r(x,y_c)-r(x,y_r))`$. Substitute first, then take the dataset mean negative log likelihood.
- The implicit log-ratio reward is one representative of a prompt-dependent reward equivalence class. Fitting it needs preference coverage and a suitable policy family; the algebra alone supplies neither.

**Reproduce:** Derive the likelihood and DPO loss without notes. Reuse the previous unit's two-completion setup: reference $`(1/4,3/4)`$, optimum $`(1/2,1/2)`$, $`\beta=1`$. The two log-ratio rewards differ by $`\log 3`$, so Bradley-Terry predicts preference probability $`3/4`$. Add 7 to both original rewards and show that the normalized optimal policy and preference probability are unchanged, although the partition function changes.

**Traps**

- Dropping the partition term while claiming an absolute reward identity. It cancels in comparisons, not in the original reward equality.
- Comparing completions from different prompts. Their partition constants need not agree.
- Equating a finite empirical loss minimum with recovery of human preferences on unseen completions. The derivation is not a coverage or generalization theorem.

**Practice**

- The section mini-project covers this: the DPO derivation in `policylab`, with a same-prompt reward-shift oracle and an explicit list of preference and reference assumptions.

**Stop when:** You reconstruct the loss from the regularized objective, recover the three-quarter preference probability, and explain both the cancellation and its assumptions.

<details>
<summary>Self-test</summary>

1. Which reward transformations preserve the Bradley-Terry probabilities?
   - Adding any function of the prompt to every completion reward. Multiplying rewards by a non-unit scale generally changes preference probabilities.
2. Does the DPO derivation require training a separate reward network?
   - No. It parameterizes the preference likelihood using policy-to-reference log ratios. The policy thereby supplies an implicit reward.
3. Why is same-prompt cancellation insufficient to justify arbitrary preference labels?
   - Cancellation is algebraic. The likelihood still assumes Bradley-Terry-style reward differences; contradictory, cyclic or population-mixed preferences may not admit that model.

</details>

#### U3. Chosen and rejected log probabilities, reference log-ratio margins and the DPO loss

**About 5 h** · **Target:** Derive + Implement

Topics: Chosen and rejected sequence log probabilities; Policy and frozen reference log-ratio margins; DPO logistic loss and $`\beta`$

A plausible loss curve can hide a reversed reference ratio or the wrong reduction. A fixed log-probability example gives you an oracle before any language-model update.

**You can now**

- Implement stable, pair-averaged DPO from four completion log-probability tensors.
- Distinguish the raw policy gap, reference-adjusted margin and scaled reward margin.
- Explain the regularization coefficient without assuming it fixes realized KL.

**Study**

1. [The RLHF Book: DPO loss implementation](https://rlhfbook.com/c/08-direct-alignment#implementation-details) (RLHF Book - Direct Alignment) - Chapter 8, Implementation Details: log-probability gaps, `losses` and detached rewards (page read 2026-10-14). Depth: Use the code block. Do not adopt the following 'KL divergence is static' claim: finite gradient steps do not solve the objective exactly or set realized KL. Reference precomputation saves workload-dependent memory, not a guaranteed 50%.
2. [DPO differential reference](https://github.com/natolambert/rlhf-book/blob/1042143366d73ff654727e4d18a1d3a21209c3a3/code/direct_alignment/loss.py#L57-L135) (RLHF Book - Direct Alignment) - `DPOLoss.forward`: difference of log ratios, stable loss and pair mean.

**Focus**

- Let $`m=(\ell_c-\ell_r)-(\ell_{\mathrm{ref},c}-\ell_{\mathrm{ref},r})`$ and $`z=\beta m`$. A pair contributes $`-\log\sigma(z)`$; average over pairs, not completion tokens.
- Use summed conditional completion log probabilities. The next unit checks gradient signs; Completion masks, length normalization and chat-template consistency checks how those sums are assembled.
- Evaluate negative log-sigmoid directly, using `torch.nn.functional.logsigmoid`, rather than multiplying token probabilities or taking the log of an already saturated sigmoid.
- For fixed rewards, larger $`\beta`$ keeps the optimal policy closer to reference. In a fixed empirical DPO batch it also rescales logits and gradients; neither statement guarantees monotonic measured KL during training.

**Reproduce:** On CPU, use PyTorch `torch.float64` leaf tensors for policy chosen and rejected log probabilities `[-1.0]` and `[-2.0]`, fixed reference tensors `[-1.5]` and `[-1.5]`, and $`\beta=0.5`$. Derive $`m=1`$, $`z=0.5`$, chosen reward 0.25, rejected reward -0.25 and loss 0.4740769841801067. Implement the loss from blank tensors and match `DPOLoss` to absolute tolerance $`10^{-12}`$. Repeat at logits -1000 and 1000 and require finite losses and gradients.

**Traps**

- Subtracting the chosen reference score but adding the rejected policy score. Write both chosen-minus-rejected gaps before subtracting the reference gap.
- Detaching the policy log probabilities along with logging rewards. Only the logging path should lose its policy gradient.
- Assuming positive adjusted margin means the chosen completion has greater raw probability. The reference gap can reverse the raw ordering.

**Practice**

- [TensorTonic: Implement the DPO Loss](https://www.tensortonic.com/problems/cs336-l15-direct-preference-optimization-loss) - Language Modeling from Scratch: `direct_preference_optimization_loss`; all three public cases. The free public cases cover positive and mixed margins and a zero margin with smoothing. Return the requested tensors, including strict reward-ranking accuracy where ties are incorrect. Add your own autograd and extreme-logit tests; the public cases do not establish them.

**Stop when:** Your scratch loss matches the numeric oracle and the book implementation, remains finite at extreme logits and passes the three public cases.

<details>
<summary>Self-test</summary>

1. What is the loss when policy and reference score every completion identically?
   - Each adjusted margin is zero, so each pair's loss is $`\log 2`$, irrespective of its length or raw likelihood gap.
2. Why not multiply token probabilities first?
   - The product underflows for long sequences. Sum token log probabilities and keep the preference loss in a stable log-domain form.
3. Does setting the regularization coefficient to zero recover SFT?
   - No. DPO logits become zero, the loss is constant $`\log 2`$, and its policy gradient vanishes.

</details>

#### U4. DPO gradient weighting and chosen-rejected order invariants

**About 4 h** · **Target:** Derive + Implement

Topics: Gradient weighting for easy, hard and mislabeled pairs; Chosen-rejected order, sign and label invariants

A correct scalar loss is not enough if labels, signs or gradients are wrong. These invariants isolate such failures without relying on a training curve.

**You can now**

- Derive the margin-dependent DPO gradient and verify it with autograd.
- Test chosen-rejected swaps, label inversion and pair-order invariance.
- Explain why hard or mislabeled pairs can dominate update pressure.

**Study**

1. [The RLHF Book: DPO gradient derivation](https://rlhfbook.com/c/08-direct-alignment#dpo-derivation) (RLHF Book - Direct Alignment) - Chapter 8, DPO Derivation: Deriving the BT DPO Gradient (page read 2026-10-14).
2. [DPO: update weighting](https://arxiv.org/abs/2305.18290v3) (Direct Preference Optimization) - arXiv:2305.18290v3, Section 4, What does the DPO update do?

**Focus**

- For unscaled adjusted margin $`m`$, $`\partial L/\partial m=-\beta\sigma(-\beta m)`$. Thus the chosen and rejected log-probability partial derivatives have equal magnitudes and opposite signs.
- Easy positive margins reduce this scalar weight. Hard negative margins increase it toward $`\beta`$, including confidently contradicted labels that may be wrong.
- Swapping chosen and rejected in both policy and reference negates $`z`$. With a fixed winner label, $`L(-z)-L(z)=z`$. Swapping candidate positions and inverting a binary target preserves binary cross-entropy.
- These are partial derivatives of supplied log probabilities. Shared model parameters couple completions, so a parameter update need not increase every chosen completion's absolute probability.

**Reproduce:** Derive the gradient closed-book. On CPU in PyTorch `torch.float64`, use unscaled margins `[-2.0, 0.0, 2.0]`, $`\beta=0.5`$, and sum the three pair losses. The margin derivatives are approximately -0.36552928931500245, -0.25 and -0.13447071068499755. Match the analytic derivative with autograd and `torch.autograd.gradcheck`. For the preceding unit's single pair, recover chosen and rejected log-probability gradients -0.18877033439907273 and 0.18877033439907273, then verify swap and batch-permutation invariants to absolute tolerance $`10^{-12}`$.

**Traps**

- Swapping only policy completions. Their reference scores must travel with their completion identities.
- Checking the gradient of a mean against a derivative for a sum. A pair-averaged loss divides each pair contribution by batch size.
- Calling gradient weighting a label-noise detector. A hard pair can be informative or mislabeled; its large weight does not distinguish those cases.

**Practice**

- [TensorTonic: Canonicalize Pairwise Preference Data](https://www.tensortonic.com/problems/cs336-l15-canonical-preference-pairs) - Language Modeling from Scratch: `canonical_preference_pairs`; all three public cases. The free public cases check all three pairs in a three-candidate strict ranking, unsorted input and preservation of two prompt records. They do not check ties, duplicate records or gradients. The section mini-project covers the analytic gradient and swap regression tests.

**Stop when:** You pass the canonicalization cases and your own gradient, swap and batch-order tests, and explain why a mislabeled hard pair receives a large weight.

<details>
<summary>Self-test</summary>

1. At zero adjusted margin, what are the chosen and rejected partial derivatives?
   - For one pair they are $`-\beta/2`$ and $`+\beta/2`$. Gradient descent therefore favors increasing the chosen-minus-rejected log-probability gap.
2. Does a chosen-rejected swap preserve the loss?
   - Not with a fixed winner target. It negates the logit and changes the loss by the original logit. Inverting the binary target as well preserves the represented comparison.
3. Why might both completion probabilities fall even with correct gradient signs?
   - The partial derivatives treat their log probabilities as separate inputs. A normalized model with shared parameters and other batch examples couples their changes and can move mass to other completions.

</details>

#### U5. Completion masks, length normalization and chat-template consistency

**About 4 h** · **Target:** Implement

Topics: Completion-only masks and prompt cancellation; Summed versus length-normalized log probabilities; Tokenizer, chat-template and truncation consistency

DPO operates on conditional completion probabilities. Reuse The next-token objective: shifts, masks and perplexity and From documents to training examples: packing and loss masks; the new work is preserving that contract across four scores and two response lengths.

**You can now**

- Implement shifted completion-only sequence scoring with explicit EOS and padding rules.
- Demonstrate that replacing token sums with token means changes the preference objective.
- Audit prompt-token identity, chat templates and truncation before comparing policy and reference scores.

**Study**

1. [Sequence scoring helper](https://github.com/natolambert/rlhf-book/blob/1042143366d73ff654727e4d18a1d3a21209c3a3/code/direct_alignment/loss.py#L19-L54) (RLHF Book - Direct Alignment) - `compute_logprobs`: shifted logits, labels and mask; `average_log_prob` branches. Depth: Pass a completion loss mask, not just the attention mask described in the docstring. Keep prompt tokens visible as context. Reject empty scored completions rather than letting the clamped mean denominator hide them.
2. [TRL 1.15.0: data and preprocessing contract](https://huggingface.co/docs/trl/v1.15.0/en/dpo_trainer#expected-dataset-type-and-format) (TRL DPO Trainer) - Expected dataset type and format; Preprocessing and tokenization; DPOConfig parameters `max_length` and `truncation_mode`. Depth: Inspect the data contract only. Do not run the full quick start or assume its truncation matches the book's collator.
3. [SimPO: changing the sequence score](https://arxiv.org/abs/2405.14734v3) (SimPO: Simple Preference Optimization with a Reference-Free Reward) - arXiv:2405.14734v3, Section 2.2 equations 3 to 4.

**Focus**

- For each completion, sum $`\log\pi(y_t\mid x,y_{<t})`$ over scored target positions. Shift the completion mask with the labels exactly once.
- A common prompt's joint log probability cancels algebraically in a same-prompt difference. Different templates, token boundaries or per-response prompt truncation invalidate that argument; compare actual prompt token IDs.
- Token means are not sequence log probabilities. Unequal lengths change the adjusted margin and the gradient weighting, even when both policy and reference are normalized consistently.
- Declare whether EOS is scored, where completion starts, how padding is excluded and what overlength pairs lose. Inspect rendered text and token IDs for both branches; do not silently train after truncation removes the preferred distinction.

**Reproduce:** On CPU with PyTorch `torch.float64`, use zero logits of shape `(1, 4, 2)`, token IDs `[[0, 1, 0, 1]]` and an unshifted completion mask `[[0, 0, 1, 1]]`. Derive the shifted selected targets, score $`-2\log 2`$, and mean $`-\log 2`$. Match `compute_logprobs` to absolute tolerance $`10^{-12}`$. Only scoring-logit positions 1 and 2 receive gradients. Give the rejected branch one scored token: with identical policy and reference, adjusted margin stays zero although the raw policy gap is $`-\log 2`$. Then test an actual template's completion boundary and an overlength pair in your scorer.

**Traps**

- Removing prompt tokens from attention to achieve completion-only loss. They remain necessary conditioning context.
- Masking by token ID when padding reuses EOS. That can remove real EOS targets; mask by position and sequence ownership instead.
- Comparing separately tokenized prompt lengths without checking the full sequence prefix. Tokenization at a text boundary can change IDs.

**Practice**

- The section mini-project covers this: `policylab` completion-scoring oracles for shifts, unequal lengths, EOS-as-padding, templates, empty responses and truncation, with token-level evidence for each policy-reference pair.

**Stop when:** Your scorer passes the fixed-logit oracle and boundary tests, and you can exhibit an unequal-length pair whose adjusted margin changes under token means.

<details>
<summary>Self-test</summary>

1. Can changing prompt input tokens change a completion-only loss?
   - Yes. Prompt targets are excluded, but prompt inputs still condition completion predictions. Only masked-out output logits are free to change without affecting the score; changing any input token can still move the scored completion logits.
2. Why does replacing sums by means not simply rescale the whole batch?
   - Chosen and rejected lengths can differ within a pair and across pairs. Each score then gets a different divisor.
3. What should happen if truncation leaves no scored completion tokens?
   - Reject or explicitly classify the record as invalid and count it. A zero sum or clamped denominator is not a meaningful preference example.

</details>

#### U6. Reference identity and drift, and preference-data support mismatch

**About 3 h** · **Target:** Explain

Topics: Reference-policy identity and drift; Preference-dataset policy and support mismatch

The reference is part of the objective, not just an extra model in memory. Meanwhile, nonzero token probabilities do not mean the preference dataset covers what the trained policy will generate.

**You can now**

- Explain why a frozen reference checkpoint and reproducible score provenance define the DPO objective.
- Distinguish zero reference support from poor practical coverage in an offline preference dataset.
- Explain why data generated by another policy can leave deployment behavior unconstrained.

**Study**

1. [The RLHF Book: policy-dependent preference data](https://rlhfbook.com/c/08-direct-alignment#daas-with-synthetic-preference-data) (RLHF Book - Direct Alignment) - Chapter 8, DAAs with Synthetic Preference Data (page read 2026-10-14). Depth: Read the contrast between matching the generating policy and learning from chosen-rejected differences. Treat these as empirical data-design findings, not a theorem that one collection policy always wins.
2. [DPO: reference initialization and support](https://arxiv.org/abs/2305.18290v3) (Direct Preference Optimization) - arXiv:2305.18290v3, Section 4, DPO outline; Appendix A.6, full-support assumption in the proof of Theorem 1.
3. [TRL 1.15.0: reference behavior](https://huggingface.co/docs/trl/v1.15.0/en/dpo_trainer#trl.DPOConfig) (TRL DPO Trainer) - DPOTrainer parameter `ref_model`; DPOConfig parameters `precompute_ref_log_probs`, `sync_ref_model` and `disable_dropout`.

**Focus**

- Bind reference scores to checkpoint or adapter identity, tokenizer, template, exact token IDs, completion mask and truncation rule. A score keyed only by prompt text is insufficient.
- Keep reference parameters outside the optimizer and score deterministically. Precomputed scores remain valid only while both reference identity and preprocessing stay fixed.
- With $`\pi_{\mathrm{ref}}(y\mid x)=0`$, a positive policy probability gives infinite policy-to-reference KL. With a full-softmax model, the common problem is instead tiny probability and absent or unrepresentative comparisons.
- Audit generating-policy and annotator provenance, prompt families and chosen-rejected likelihood and length distributions. A rising margin on collected pairs does not constrain all unobserved responses.

**Reproduce:** Draw the provenance chain for one preference pair and explain which artifacts invalidate precomputed scores. Use policy log probabilities -1 and -2, reference log probabilities -1.5 and -1.5, and $`\beta=0.5`$. Changing only the reference scores to -1 and -2 moves the loss from 0.4740769841801067 to $`\log 2`$ although the policy did not change. Explain why replacing the reference by a freshly detached copy of the policy resets margins but does not make policy gradients vanish.

**Traps**

- Calling a reference frozen because its outputs are detached. Its parameters or adapters can still drift if shared with the policy or updated elsewhere.
- Confusing reference support with dataset support. Full token support does not supply missing comparisons.
- Enabling `sync_ref_model=True` while describing the experiment as fixed-reference DPO. Reference synchronization changes the training procedure.

**Practice**

- The section mini-project covers this: a reference-score manifest, a deliberate reference-drift failure and a preference-data support audit in `policylab`.

**Stop when:** You explain the reference-only loss change, identify every score-invalidating artifact and distinguish formal support failure from missing preference coverage.

<details>
<summary>Self-test</summary>

1. Does reusing cached scores survive a changed chat template?
   - Not automatically. The tokenized event or context may change. Recompute after verifying the new input and mask identities.
2. Why can two identical checkpoints produce nonzero measured margins at initialization?
   - Stochastic scoring, differing precision or preprocessing can produce different scores. Disable stochastic layers and compare identical tokenized inputs before attributing the difference to learning.
3. Must all preference responses come from the reference policy?
   - No. The finite-data likelihood can be evaluated on other policies' responses where scores exist. Its usefulness still depends on coverage, labels and generalization to the policy's generated responses.

</details>

#### U7. Offline versus online objectives, and SFT and no-reference baselines

**About 3 h** · **Target:** Explain + Measure

Topics: Offline objective versus online RL distinction; SFT, preferred-fine-tuning and no-reference baselines

A gain over an untouched model does not establish the value of preference optimization. Simple controls can reveal that preferred-response exposure or a changed sequence score explains it.

**You can now**

- Separate offline preference fitting from an online reward-guided policy update.
- Specify SFT, preferred-only fine-tuning and a no-reference preference baseline on shared data.
- Design a small comparison that isolates reference removal from length normalization and margin changes.

**Study**

1. [The RLHF Book: offline versus online data](https://rlhfbook.com/c/08-direct-alignment#daas-vs.-rl-online-vs.-offline-data) (RLHF Book - Direct Alignment) - Chapter 8, DAAs vs. RL: Online vs. Offline Data (page read 2026-10-14). Depth: Read the mechanism distinction. Do not generalize the cited model-scale comparisons into a universal ranking of algorithms.
2. [DPO: preferred-only and selection baselines](https://arxiv.org/abs/2305.18290v3) (Direct Preference Optimization) - arXiv:2305.18290v3, Section 6, Tasks, Evaluation and Methods.
3. [SimPO: no-reference objective](https://arxiv.org/abs/2405.14734v3) (SimPO: Simple Preference Optimization with a Reference-Free Reward) - arXiv:2405.14734v3, Sections 2.2 to 2.3, equations 3 to 6.

**Focus**

- Offline DPO differentiates a likelihood over fixed comparisons. Online policy gradients use newly sampled actions and reward feedback. Collecting on-policy pairs once does not make all subsequent offline epochs on-policy updates.
- Keep an untouched SFT checkpoint and a preferred-only fine-tuning control initialized from it. The latter receives the same chosen responses but no explicit rejected-response comparison or frozen-reference term.
- A reference-free raw-gap loss, $`-\log\sigma(\beta(\ell_c-\ell_r))`$, is a useful ablation. It is not full SimPO, whose scores are token means and whose logit includes a target margin.
- For SimPO use $`z=\beta(\bar\ell_c-\bar\ell_r)-\gamma`$. Record whether an implementation's margin parameter is $`\gamma`$ or $`\gamma/\beta`$; otherwise comparisons silently change two scales.

**Reproduce:** Write a comparison table for untouched SFT, preferred-only SFT, DPO, a raw-gap no-reference ablation and SimPO: data consumed, score aggregation, reference, generated training samples and evaluation sampling. In CPU PyTorch `torch.float64`, check SimPO on mean log probabilities -1 and -2 with $`\beta=2`$ and final logit offset $`\gamma=0.5`$: $`z=1.5`$, loss 0.2014132779827524. The book's `SimPOLoss` takes $`\gamma/\beta`$ instead, so pass `gamma=0.25` there for the same $`z`$; with `gamma=0.5` it computes $`z=1`$ and loss 0.3132616875182229. Keep the raw-gap ablation separate rather than labeling every no-reference loss SimPO.

**Traps**

- Attributing a gain to reference removal while also switching from sums to means, adding a margin and retuning learning rate.
- Calling preferred-only fine-tuning a fair control after giving it fewer chosen-response exposures or no tuning budget.
- Confusing best-of-many selection with a learned policy update. Selection changes the inference procedure without changing policy parameters.

**Practice**

- The section mini-project covers this: a shared-data baseline table and small SFT, DPO and no-reference comparison in `policylab`, separating score normalization from reference removal.

**Stop when:** Your comparison table specifies every data and score difference, the SimPO oracle passes, and your baseline results disclose training exposure and tuning budgets.

<details>
<summary>Self-test</summary>

1. Does DPO need freshly generated completions for each gradient step?
   - No. Standard offline DPO reuses a fixed preference dataset. Iterative data recollection is a separate procedure.
2. Why retain both the original SFT checkpoint and preferred-only fine-tuning?
   - The original measures change from initialization; preferred-only fine-tuning controls for additional training on chosen responses. They answer different questions.
3. Is replacing the reference by zero log scores an unchanged KL-regularized objective?
   - No. It removes the learned reference anchor. On a finite action space it resembles a uniform-reference comparison, but it does not retain the original reference or its induced regularization.

</details>

#### U8. IPO, label smoothing, conservative DPO and unpaired-feedback variants

**About 5 h** · **Target:** Derive

Topics: IPO and preference-model misspecification; Label smoothing and conservative DPO vocabulary; KTO, ORPO and unpaired-feedback vocabulary

Loss variants matter when they change an assumption you can test. IPO and label smoothing expose finite-margin behavior; KTO and ORPO clarify that feedback format and reference use are separate choices.

**You can now**

- Derive the sampled IPO squared-margin objective and explain its departure from Bradley-Terry modeling.
- Derive smoothed DPO and distinguish its label-noise convention from unbiased noise correction.
- State which feedback KTO and ORPO consume without treating them as interchangeable DPO settings.

**Study**

1. [IPO: bounded preference transformation and sampled loss](https://arxiv.org/abs/2310.12036v2) (A General Theoretical Paradigm to Understand Learning from Human Preferences) - arXiv:2310.12036v2, Section 4.2; Section 5 equation 8; Sections 5.1 to 5.2 through equation 17 and Algorithm 1. Depth: Follow the symmetry argument yielding the half-inverse-regularization target. Skip the uniqueness proof on the first pass; do not skip the sampling assumptions.
2. [Stanford CS224R project: DPO and IPO side by side](https://cs224r.stanford.edu/material/CS224R_Default_Project_Guidelines.pdf) (Stanford CS224R 2026 - LLM Preference Optimization) - Section 1.3.2, Preference Optimization (IPO), pp. 7 to 8: the implicit reward (eq. 7), the DPO loss (eq. 8) and the IPO squared loss toward $`(2\beta)^{-1}`$ (eq. 9). Depth: Read as a design specification. The course action items are not your assignment.
3. [Smoothed DPO and ORPO code](https://github.com/natolambert/rlhf-book/blob/1042143366d73ff654727e4d18a1d3a21209c3a3/code/direct_alignment/loss.py) (RLHF Book - Direct Alignment) - `DPOLoss.forward` smoothing expression; optional `ORPOLoss` docstring and `forward`. Depth: Use the executed smoothing expression, not its comment that replaces a sum of log-sigmoids by the log of their sum. That step is invalid. The book chapter's IPO bullet also assigns the logit transform to IPO; the original paper uses the identity transform.
4. [TRL 1.15.0: loss conventions](https://github.com/huggingface/trl/blob/v1.15.0/trl/trainer/dpo_trainer.py#L1359-L1407) (TRL DPO Trainer) - `_compute_loss`: `sigmoid`, `ipo` and `robust` branches. Depth: In this release `sigmoid` does not apply `label_smoothing`; use the explicit smoothed objective for cDPO. `robust` subtracts a flipped-label term and is not cDPO. IPO divides each score by completion length here, unlike a raw sequence-sum oracle.
5. [Optional: KTO feedback and reference point](https://arxiv.org/abs/2402.01306v5) (KTO: Model Alignment as Prospect Theoretic Optimization) - arXiv:2402.01306v5, Section 4.1, Derivation, equation 8, KL Estimate and Data. Depth: Vocabulary and one fixed-log-probability calculation only. Do not reproduce model-scale experiments.

**Focus**

- For adjusted log-ratio gap $`m`$, sampled IPO minimizes $`(m-1/(2\tau))^2`$. The IPO paper's $`\tau`$ corresponds to DPO's $`\beta`$. Its identity preference transform is not the Bradley-Terry logit transform.
- Smoothed DPO uses $`-(1-\epsilon)\log\sigma(z)-\epsilon\log\sigma(-z)`$. For $`0<\epsilon<1/2`$, its single-pair optimum is $`z=\log((1-\epsilon)/\epsilon)`$, unlike hard-label DPO's unbounded preferred logit.
- Conservative DPO often names this smoothing convention. It is neither a calibrated estimate of each label's correctness nor the separate unbiased label-flip correction called robust DPO.
- Optional: KTO needs individually desirable or undesirable responses and a reference point, not matched winner-loser pairs. ORPO still uses paired responses and combines chosen-response likelihood with a reference-free odds-ratio term.

**Reproduce:** Derive IPO equation 17 by combining a labeled pair with its reverse and completing the square. For $`\tau=0.5`$, its target adjusted margin is 1. Derive the smoothed-logistic stationary point: with $`\epsilon=0.1`$, $`z=\log 9`$. Verify both stationary derivatives in CPU PyTorch `torch.float64` to absolute tolerance $`10^{-12}`$. Optional: evaluate KTO equation 8 on one desirable log ratio 1 and one undesirable log ratio -1 with unit weights, $`\beta=1`$ and a fixed zero reference point; average their equal losses, rather than summing class means.

**Traps**

- Comparing IPO and DPO by raw loss magnitude. Squared margin error and negative log likelihood have different scales and minima.
- Assuming finite target margins guarantee robustness on arbitrary data. IPO still depends on sampling, score normalization, coverage and optimization.
- Converting 'wins against this alternative' into 'globally desirable' without a labeling policy. Pairwise winners need not meet an absolute acceptability threshold.

**Practice**

- The section mini-project covers this: a CPU synthetic preference comparison of DPO and IPO under controlled noise and data reuse, plus smoothed-loss stationary-point tests in `policylab`.

**Stop when:** You derive both finite-margin targets, verify their derivatives and explain the feedback and reference requirements of the optional variants without adding a variant survey.

<details>
<summary>Self-test</summary>

1. Why can hard-label DPO overfit a separable pair for any fixed positive regularization coefficient?
   - Its empirical logistic loss keeps decreasing as the preferred adjusted log-ratio gap grows. There is no finite single-pair minimum; the coefficient rescales that gap rather than imposing a hard KL cap.
2. What happens above IPO's target margin?
   - The squared-loss derivative becomes positive, so descent reduces the margin. Hard-label DPO continues to favor increasing it.
3. At smoothing one half, where is the optimal logit?
   - Zero. The soft target expresses indifference, so either positive or negative confidence increases the loss.
4. Does KTO dispense with a reference model because its feedback is unpaired?
   - No. Its default loss still uses policy-to-reference log ratios and a reference point. Unpaired feedback and reference-free optimization are different properties.

</details>

#### U9. DPO margin, reward, KL and length diagnostics and fixed-batch tests

**About 4 h** · **Target:** Implement + Measure

Topics: Margin, reward, KL, entropy, length and validity diagnostics; Fixed-batch loss, gradient and invariance tests

Preference accuracy is one training signal, not an evaluation suite. Diagnostics must separate objective correctness from movement in the policy's generated behavior.

**You can now**

- Build fixed-batch tests for DPO loss, gradients, masking and reference invariants.
- Measure margins, both completion likelihoods, generated-policy KL, entropy, length and validity with explicit sampling units.
- Differential-test the scratch objective while recording the trainer's version and loss conventions.

**Study**

1. [TRL 1.15.0: logged metrics and exact loss path](https://huggingface.co/docs/trl/v1.15.0/en/dpo_trainer#logged-metrics) (TRL DPO Trainer) - Logged metrics; follow the DPOTrainer source link to `_compute_loss` for completion sums, loss branches and strict reward accuracy. Depth: Use standard sigmoid DPO for the differential test. Despite its documentation's SimPO attribution, this release's `sigmoid_norm` branch retains reference-adjusted scores and has no target-margin offset; it is not the complete SimPO baseline.
2. [DPO metrics: what the curves omit](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter17_dpo/metrics#reward-margin) (Hands-on Modern RL - Chapter 14 DPO) - Reward Margin, Reward Accuracy, and Chosen Reward vs Rejected Reward (page read 2026-10-14). Depth: Skip the illustrative training logs and healthy-range targets. With identical deterministic policy and reference scores, strict reward accuracy is zero because all rewards tie; the page's near one half figure is for similar but untied scores at initialization.
3. [Post-training laboratory: instrumentation and tests](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-3/llm-post-training-laboratory.md#milestone-b--instrumentation) (LLM Post-Training Laboratory - Direct Preference Objective) - Milestone B - Instrumentation; Correctness requirements; Failure-injection requirements; Hardware variants. Depth: Apply these to the DPO evidence pack only. No rollout service, distributed training or online objective is required here.

**Focus**

- Log raw chosen and rejected sequence log probabilities, both reference-adjusted rewards, unscaled margins and scaled margins. Record pair weighting and tie treatment rather than conflating ranking with token prediction accuracy.
- An offline pair's log-ratio is not policy KL. Estimate policy-to-reference KL on policy-sampled completions with declared decoding and stopping, or compute it exactly in a finite response space. Log its units as nats per sequence or nats per token.
- Teacher-forced token entropy on preference contexts is different from entropy on generated contexts. Keep both context source and token reduction with the metric; report generated lengths and invalid or truncated outputs separately.
- Test scalar values, analytic and numerical gradients, pair swaps, batch permutations, prompt-score cancellation, padding and frozen-reference identity. Use a tolerance appropriate to the dtype, not bitwise equality across execution paths.

**Reproduce:** Assemble the previous fixed-tensor loss, gradient and mask oracles into one CPU test suite. Compare your loss and policy-input gradients with the book's `DPOLoss` at the pinned commit using `torch.float64` and absolute tolerance $`10^{-12}`$. Add equal policy-reference scores, duplicated batches and extreme logits: initialization loss is $`\log 2`$, strict reward accuracy is zero, and duplicating a batch preserves its mean loss. Inspect the TRL 1.15.0 sigmoid branch against that formula. With room on your GPU, also differential-test one tiny-model batch through `DPOTrainer`; use about 0.1 to 0.6 billion parameters, short completions and a frozen reference. Record dtype-specific discrepancies, padding, truncation, loss type, version and $`\beta`$, rather than expecting the float64 tensor tolerance from mixed-precision model scores.

**Traps**

- Calling a rising implicit reward a reward-model or verifier improvement. It is computed from the policy being trained.
- Using preference-data log-ratio means as generated-policy KL or interpreting their negative values as an implementation failure.
- Requiring a CPU language-model run through TRL 1.15.0's fused trainer path. Keep CPU tensor and scorer tests independent; use the optional trainer comparison on your GPU.

**Practice**

- The section mini-project covers this: the `policylab` DPO regression suite, differential loss and gradient checks, diagnostic records and deliberate mask, sign and reference failures.

**Stop when:** Your CPU oracles pass, deliberate sign, mask and reference bugs fail, and every diagnostic declares its sampling distribution, units and reduction.

<details>
<summary>Self-test</summary>

1. At identical policy and reference scores, do chosen and rejected completions receive zero policy gradients?
   - No. Their reward difference is zero, but the logistic loss has nonzero derivative there. Detached reference scores do not cancel policy derivatives.
2. Why log both likelihoods if margin and accuracy already improve?
   - Both completion probabilities can fall while the rejected one falls faster. Margin-only logs hide that displacement.
3. Can sequence KL and token-averaged KL be compared as the same quantity?
   - No. They use different units and length weighting. State the reduction and compare like with like.

</details>

#### U10. Preference accuracy versus behavior, overoptimization and held-out slices

**About 4 h** · **Target:** Measure

Topics: Preference accuracy versus downstream behavior; Overoptimization as $`\beta`$, epochs or data reuse increase; Held-out prompt and annotator slices

DPO can rank the recorded pair better while moving probability into unmeasured behavior. Held-out generations and slices are needed to tell a useful update from proxy overoptimization.

**You can now**

- Exhibit a preference-margin improvement accompanied by worse independent behavior.
- Measure sensitivity to regularization, epochs, label noise and data reuse without selecting on final evaluation.
- Report prompt-group and annotator slices with provenance and uncertainty.

**Study**

1. [The RLHF Book: preference displacement](https://rlhfbook.com/c/08-direct-alignment#numerical-concerns-weaknesses-and-alternatives) (RLHF Book - Direct Alignment) - Chapter 8, Numerical Concerns, Weaknesses, and Alternatives: preference-displacement figure and discussion; Suggested Experiments, item 4, Change the data before changing the loss (page read 2026-10-14). Depth: Read the displacement discussion, not the variant catalog. A probability decrease for both recorded completions is possible, not a necessary outcome of every update. Use only the bounded data-change idea from item 4.
2. [IPO paper: weak regularization and overfitting](https://arxiv.org/abs/2310.12036v2) (A General Theoretical Paradigm to Understand Learning from Human Preferences) - arXiv:2310.12036v2, Section 4.2, Weak Regularisation and Overfitting; Sections 5.3 to 5.4, two-action and sampled-preference examples.
3. [Post-training laboratory: held-out behavior evidence](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-3/llm-post-training-laboratory.md#core-requirements) (LLM Post-Training Laboratory - Direct Preference Objective) - Core requirements: immutable preference data with split and annotator provenance, independent metrics and adversarial set; Milestones D to F. Depth: Use prompt-group splits and annotator slices for the DPO study. If annotator identities are absent, report that limitation rather than inventing an annotator holdout.

**Focus**

- Separate training pair accuracy, held-out pair accuracy and independently scored generated responses. The first two evaluate implicit reward ranking; neither measures the full policy distribution's task performance.
- Split by prompt or duplicate group before creating pairs. Keep tuning prompts separate from a final held-out set. Where identities exist, distinguish a held-out annotator test from a per-annotator slice on seen annotators.
- Prespecify a small $`\beta`$, epoch or reuse sweep, with a controlled noise condition. Larger $`\beta`$ does not inherently mean more overoptimization: for a fixed reward it strengthens regularization, while empirical training also changes gradient scales and fit.
- Keep every checkpoint, failed run and length or style slice. Pair comparisons by prompt and estimate uncertainty over independent prompt groups and training seeds, not individual correlated pairs.

**Reproduce:** Construct an exact finite-response counterexample on CPU. For one prompt and responses chosen, rejected and unobserved, let the reference and initial policy be $`(0.4,0.3,0.3)`$. Change only the policy to $`(0.2,0.1,0.7)`$, keeping $`\beta=1`$. Pair loss falls from $`\log 2`$ to $`\log(5/3)`$, about 0.5108256237659907, and strict pair accuracy rises from 0 to 1. Define independent task reward as 1 for the chosen response and 0 for the others: expected task reward falls from 0.4 to 0.2. Verify the probability sums, margin $`\log(3/2)`$ and losses with `torch.float64` to absolute tolerance $`10^{-12}`$. This is a constructed policy change, not a claim about a particular optimizer trajectory. Then use the mini-project's bounded sensitivity study to look for the same diagnostic pattern on held-out prompts.

**Traps**

- Counting many pairs from one prompt as independent evaluation observations. Pair expansion does not create new prompts.
- Selecting the best epoch or regularization value on the reported final test prompts. That set has become tuning data.
- Treating length-controlled judgment as proof of safety or task correctness. It addresses one confound, not every evaluator shortcut.

**Practice**

- The section mini-project covers this: `policylab` sensitivity to regularization, reuse or label noise, with held-out prompt and available annotator slices, raw generations and a retained proxy-versus-behavior failure.

**Stop when:** You reproduce the exact proxy-behavior reversal and report the bounded study's held-out slices, uncertainty and negative or null results without final-set selection.

<details>
<summary>Self-test</summary>

1. Where did the probability mass go in the counterexample?
   - Both recorded completion probabilities fell; the unobserved response gained their lost mass. The pairwise loss constrains their ratio, not their combined probability.
2. Does a higher held-out pair accuracy establish a better generative policy?
   - No. It establishes better ranking on those comparisons. Generated task quality, validity, diversity and safety need separate evaluation.
3. What can a fixed-coefficient DPO loss do on repeatedly reused, perfectly separable labels?
   - It can keep pushing the preferred adjusted logit upward without a finite empirical optimum. Early stopping or other regularization is additional to choosing a coefficient.
4. What evidence supports generalization to new annotators?
   - An identified annotator group excluded from training and tuning, with adequate prompt coverage and reported uncertainty. A source label or anonymous dataset split alone does not establish this.

</details>

#### U11. Compute-matched rejection and SFT controls and external evaluation

**About 3 h** · **Target:** Measure

Topics: Compute-matched rejection and SFT controls; External task, safety and style evaluation

An objective comparison is only credible when extra chosen examples, candidate sampling and judge calls cannot explain the gain. This unit turns the diagnostic study into an auditable behavior claim.

**You can now**

- Compare DPO with preferred-only SFT, rejection fine-tuning and inference-time selection under matched or disclosed budgets.
- Evaluate held-out task behavior, safety and style independently of training preferences.
- Defend the smallest improvement claim supported by raw outputs, uncertainty and negative evidence.

**Study**

1. [DPO: controls and external judgments](https://arxiv.org/abs/2305.18290v3) (Direct Preference Optimization) - arXiv:2305.18290v3, Section 6, Evaluation and Methods; Sections 6.1 and 6.4. Depth: Read the baseline definitions, reward-KL frontier and human-versus-judge comparison. The paper's model-scale results are not local targets, and its best-of-many comparison does not by itself establish compute-matched superiority.
2. [Post-training laboratory: comparison and final evaluation](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-3/llm-post-training-laboratory.md#milestone-e--measurement--optimization) (LLM Post-Training Laboratory - Direct Preference Objective) - Milestones E and F; Measurement requirements; Design-defense questions 2 to 6; Out of scope. Depth: Evaluate only the section's small DPO and control policies. Use pre-generated responses and a finite-response policy on CPU when model adaptation is impractical; limit conclusions to that reduced setting.

**Focus**

- Distinguish rejection fine-tuning, which trains on selected candidates, from best-of-many, which selects at inference without updating parameters. Include untouched SFT and preferred-only fine-tuning so selection and extra supervised exposure are visible.
- Share initialization, prompt splits, candidate pool where applicable, decoding and final evaluation. Track generation tokens, scoring calls, reference scoring, update tokens, tuning attempts and wall time separately; equal optimizer steps do not equal compute.
- Use a task-specific executable check where possible, a separate safety set and style or verbosity slices. For subjective judgments, blind model identities, counterbalance answer order and audit a human-reviewed sample for position and length bias.
- Freeze the evaluator and selection rule before final testing. Keep raw outputs and failures with prompt, policy, decoding and evaluator identity so every score and exclusion can be recomputed.

**Reproduce:** From the bounded study's raw records, rebuild a comparison ledger without using its summary metrics. Account for all candidates generated for rejection fine-tuning or best-of-many, including discarded and invalid outputs, and all reference and evaluator calls. Recompute paired held-out task outcomes and length, style and safety slices for the frozen SFT, preferred-only and DPO policies. Report uncertainty at the prompt-group level and disclose training-seed coverage. State separately whether the evidence supports learned change, inference-time selection or neither; retain a result where preference improvement fails an external check.

**Traps**

- Charging a selection baseline only for its winning response. Discarded candidates and their scores are part of its cost.
- Calling a judge independent because it was not trained during this experiment. It may still share training-label biases or have been used for model selection.
- Calling a small adversarial set a safety certification, or a finite-response demonstration evidence of model-scale alignment.

**Practice**

- The section mini-project covers this: the `policylab` compute and data ledger, rejection and SFT controls, frozen external task, safety and style evaluation, and a raw-record-backed conclusion with negative evidence.

**Stop when:** A reader can recompute your held-out comparisons and full candidate costs from raw records, and your conclusion distinguishes learned behavior from selection, length and evaluator effects.

<details>
<summary>Self-test</summary>

1. What does a best-of-many gain over single-sample SFT establish?
   - A gain from the larger inference-time candidate budget and selection rule. It does not establish a learned parameter change.
2. Why are equal training steps insufficient for compute matching?
   - Methods process different numbers and lengths of sequences and may require reference forwards, candidate generation and scoring. Count those costs and disclose what remains unmatched.
3. A DPO model wins more judge comparisons only when it is more verbose. What can you claim?
   - An improvement under that judge and length distribution. A general quality claim needs length or style controls and independent task or human evidence.
4. What if the independent evaluation finds no improvement?
   - Retain the null or negative result, its uncertainty and the proxy gains. It bounds the claim and can identify a data, objective or evaluator failure without inventing success.

</details>

### Mini-project: Direct preference optimization with controlled comparisons

**About 12 to 16 hours.** Derive and test DPO from scratch in `policylab`, then separate real preference gains from scoring, reference and selection effects. The checked loss, baselines and ledgers feed online-policy training and the capstone evidence pack.

1. Derive the KL-regularized optimum and DPO loss in `llm/` from policy ratios, verify the same-prompt reward-shift oracle against hand algebra, list preference and reference assumptions, and pass the free TensorTonic KL-regularized policy objective cases.
2. Build completion scoring in `llm/` with shifted masks and explicit EOS, padding, empty and truncation rules, show token evidence for each policy-reference pair, and pass the free TensorTonic DPO loss and canonical-pair cases plus your own gradient and swap tests.
3. Bind reference scores to checkpoint, tokenizer, template and mask identity in `schema/`, inject a deliberate reference-drift failure, audit support gaps, and differential-test loss and gradients against the pinned RLHF Book `DPOLoss` with mask, sign and reference regressions and diagnostic records in `tests/`.
4. Compare small SFT, DPO and no-reference runs on shared data in `llm/`, separating score normalization from reference removal, then contrast DPO with IPO on synthetic CPU preferences under noise and reuse with smoothed-loss stationary-point checks.
5. Run a bounded sensitivity study over regularization, epochs, reuse or label noise, report held-out prompt and annotator slices with raw generations, and retain one proxy-versus-behavior failure where pair accuracy rises while independent behavior falls.
6. Compare DPO with SFT, rejection and best-of-N controls from a CPU text policy under a stated budget, keep ledgers in `ledger/`, and defend the frozen task, safety and style verdict with negative evidence across seeds, moving to a decoder only if your GPU fits it.

**Deliverables**

- The `llm/` DPO package with derivation, scoring oracles and regression tests.
- Baseline, variant and sensitivity tables with raw generations and failures.
- Compute and data ledgers with the frozen evaluation and defended claim.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [TensorTonic: Score a KL-Regularized Policy Batch](https://www.tensortonic.com/problems/cs336-l15-kl-regularized-policy-objective). Pass all three public cases before trusting the optimum derivation.
- external-tests: [TensorTonic: Implement the DPO Loss](https://www.tensortonic.com/problems/cs336-l15-direct-preference-optimization-loss). Pass positive, mixed and zero-margin cases; add extreme-logit tests.
- external-tests: [TensorTonic: Canonicalize Pairwise Preference Data](https://www.tensortonic.com/problems/cs336-l15-canonical-preference-pairs). Pass ranking and order cases; add tie and duplicate handling.
- external-tests: [RLHF Book DPOLoss at pinned commit](https://github.com/natolambert/rlhf-book/blob/1042143366d73ff654727e4d18a1d3a21209c3a3/code/direct_alignment/loss.py#L57-L135). Differential-test loss and gradients on fixed log probabilities.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Derivation honesty | The shift oracle matches hand algebra and every preference and reference assumption is listed. | A cross-prompt comparison is shown to break cancellation with a failing test. |
| Scoring correctness | Masks, lengths, templates and truncation pass oracles with token evidence and gradient checks. | A means-versus-sums pair flips the margin and the test names the changed objective. |
| Attribution discipline | Baselines, IPO comparison and sensitivity slices separate objective, data and evaluator effects. | A retained failure shows pair gains with flat or falling behavior and its cause. |
| Ledger completeness | Budgets, candidates, calls and seeds reconcile from raw records with negative evidence kept. | An independent rerun rebuilds every table from raw records alone. |

Feeds into: Checked DPO objectives, controls and ledgers feed online RL and the capstone evidence pack.

### Resource route

- **Primary - Book:** [RLHF Book - Direct Alignment](https://rlhfbook.com/c/08-direct-alignment.html) - Study Chapter 8 (DPO, its derivation, numerical concerns and online versus offline data) and the `code/direct_alignment` package at natolambert/rlhf-book at commit 1042143 (DPO, IPO, KTO and APO are validated there; its SimPO and ORPO runs are marked noisy). Re-derive DPO from the KL-regularized objective, implement sequence log-ratio losses from blank tensors and test chosen-rejected swaps, prompt masking, reference drift and length normalization.
- **Required - Paper:** [Direct Preference Optimization](https://arxiv.org/abs/2305.18290) - Read the complete derivation, objective and experiments. State the preference-model and reference assumptions, then compare a scratch DPO update with SFT and rejection-style baselines on a held-out slice.
- **Required - Paper:** [A General Theoretical Paradigm to Understand Learning from Human Preferences](https://arxiv.org/abs/2310.12036) - Study the preference-model misspecification argument and IPO objective. Use one synthetic preference problem to compare DPO and IPO behavior as noise, margin and data reuse change.
- **Support - Paper:** [KTO: Model Alignment as Prospect Theoretic Optimization](https://arxiv.org/abs/2402.01306) - Read the unpaired-feedback setting and the KTO loss with its reference point. State what data KTO needs that DPO does not, and test its loss on fixed log probabilities.
- **Support - Paper:** [SimPO: Simple Preference Optimization with a Reference-Free Reward](https://arxiv.org/abs/2405.14734) - Read the length-normalized, reference-free reward and the target margin. Use it as the no-reference baseline and compare its length behavior with summed-log-probability DPO.
- **Required - Course:** [Stanford CS224R 2026 - LLM Preference Optimization](https://cs224r.stanford.edu/) - Study Lecture 09 (RL for LLMs: preference optimization, `slides/09_cs224r_rlhf_2026.pdf`) and Section 1.3.2 (IPO) of the default project guidelines. Implement independently, preserve the reference policy and follow course material restrictions.
- **Support - Documentation:** [TRL DPO Trainer](https://huggingface.co/docs/trl/v1.15.0/en/dpo_trainer) - After the scratch loss passes, inspect the DPOTrainer data contract and options for TRL 1.15.0. Differential-test one tiny batch against the local objective and record library version, loss type, $`\beta`$, padding, truncation and reference behavior.
- **Support - Practice:** [TensorTonic - DPO and Preference Problems](https://www.tensortonic.com/problems/cs336-l15-direct-preference-optimization-loss) - Solve Implement the DPO Loss (`cs336-l15-direct-preference-optimization-loss`), Canonicalize Pairwise Preference Data (`cs336-l15-canonical-preference-pairs`) and Score a KL-Regularized Policy Batch (`cs336-l15-kl-regularized-policy-objective`), free problems in the Language Modeling from Scratch plan, as closed-book checks after your own loss passes.
- **Support - Tutorial:** [Hands-on Modern RL - Chapter 14 DPO](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter17_dpo/dpo-objective-derivation) - Use the DPO derivation page and the hands-on page for a bounded DPO experiment and metrics. Its displayed loss is the per-pair summand (average it over the dataset), and its implicit reward is exact only at the KL-regularized optimum; its training logs are illustrative. Replace any opaque trainer-only step with a checked local loss and retain a $`\beta`$ or length regime where quality worsens. Pin commit 9231bab of walkinglabs/hands-on-modern-rl; its `code/chapterNN` folders do not follow the site chapter numbers.
- **Required - Project:** [LLM Post-Training Laboratory - Direct Preference Objective](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-3/llm-post-training-laboratory.md) - Complete the DPO-style objective with exact sequence log probabilities, frozen reference identity, fixed loss and gradient tests, common raw evaluation records, support analysis and reward, length, style and judge-hacking probes.

### Exit checkpoint

Derive and implement DPO from sequence log probabilities, pass sign, masking, reference and gradient oracles, and show with held-out evaluation how $`\beta`$, length, label noise or dataset support can reverse an apparent preference gain.

<details>
<summary>Deliberately left for later</summary>

- Calling an offline pairwise objective on-policy reinforcement learning
- A survey of every preference-loss variant without a hypothesis that distinguishes one
- Model selection on the same preferences used to tune $`\beta`$, epochs or checkpoints

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

### Study units

#### U1. On-policy generation and the sequence policy gradient

**About 4 h** · **Target:** Derive

Topics: On-policy prompt sampling and completion generation; Sequence policy gradient for autoregressive trajectories

The sequence objective is familiar REINFORCE, but generation now owns the sampling distribution. A correct loss on text drawn from a different decoding policy is not an on-policy estimator.

**You can now**

- Derive the sequence policy gradient from the autoregressive factorization with a fixed prompt distribution.
- Identify the distribution that actually generated a completion and the log probabilities its update requires.

**Study**

1. [RLHF Book: sequence policy gradient](https://rlhfbook.com/c/06-policy-gradients#deriving-the-policy-gradient) (RLHF Book - Policy Gradients and Regularization) - Chapter 6, The Role of Reinforcement Learning in RLHF and Deriving the Policy Gradient, equations 9 to 18 (page read 2026-10-14).
2. [Lecture 3: RL Motivation and Math](https://rlhfbook.com/teach/course/lec3-chap6-p1/) (RLHF Book Course - Lectures 3 and 4) - Slides 20 to 28: differentiating the expectation, trajectory factorization and the token-log-probability sum. Depth: Build on the earlier likelihood-ratio identity and Decoding policies: from greedy to nucleus sampling. Skip the classical RL review before slide 20.

**Focus**

- For a fixed prompt distribution and parameter-independent reward, $`\nabla_\theta J = \mathbb{E}[R(x,y)\sum_t \nabla_\theta \log \pi_\theta(y_t\mid x,y_{<t})]`$. Include the sampled stopping action when EOS ends the response.
- The prompt distribution and deterministic append transition have zero parameter derivative. The completion distribution does not.
- Temperature and truncation change the policy, not just its presentation. Start with untruncated categorical sampling at temperature 1; otherwise define and score the transformed policy explicitly.

**Reproduce:** Closed-book, enumerate a two-token binary policy with independent tokens, each with probability $`p`$ of 1, and reward 1 only for two ones. Derive $`J(p)=p^2`$ and recover $`dJ/dp=2p`$ from the expected score-function estimator. At $`p=1/2`$, both give 1. This oracle needs only CPU arithmetic.

**Traps**

- Backpropagating the mean of frozen verifier scores. It has no path to policy parameters; the score-function loss supplies that path.
- Calling a completion on-policy because its model weights match. Top-p filtering, temperature, dropout and numerical backend differences can still change its distribution.

**Practice**

- The section mini-project covers this: the sequence-gradient oracle and the generation-policy contract in policylab's rollout collector.

**Stop when:** Your enumeration matches the analytic derivative for several probabilities, and you can name the sampler and scoring distribution for every rollout.

<details>
<summary>Self-test</summary>

1. Why is there no explicit trajectory probability multiplying each sampled gradient?
   - Sampling already weights trajectories by their probability. Multiplying by that probability again estimates a different expectation.
2. Does the sequence gradient require gradients through sampled token IDs?
   - No. Hold the sampled IDs fixed and differentiate their log probabilities under the policy.
3. Can raw model log probabilities describe nucleus sampling exactly?
   - No. The sampler removes tokens and renormalizes the retained probabilities. Raw log probabilities omit that transformation and its support restriction.

</details>

#### U2. Terminal rewards, per-token loss assignment and token-space REINFORCE

**About 4 h** · **Target:** Derive + Implement

Topics: Sparse terminal reward and per-token loss assignment; REINFORCE estimator in token space

A terminal score must reach the whole completion, not just its last token. The loss reduction decides whether you optimize expected sequence reward or a length-reweighted surrogate.

**You can now**

- Derive why an undiscounted terminal reward weights every generated token in REINFORCE.
- Implement a completion-summed loss with detached rewards and test its token gradients.

**Study**

1. [RLHF Book: REINFORCE in token space](https://rlhfbook.com/c/06-policy-gradients#reinforce) (RLHF Book - Policy Gradients and Regularization) - Chapter 6, REINFORCE, then Implementation: Policy-Gradient Basics and Related: MDP vs. Bandit Framing (page read 2026-10-14).
2. [Lecture 4: summed token log probabilities](https://rlhfbook.com/teach/course/lec4-chap6-p2/) (RLHF Book Course - Lectures 3 and 4) - Slides 8 to 12: log-probability shift, gather, completion sum and REINFORCE loss. Depth: Use a fixed or previously fitted baseline first. Slide 12's current-batch mean includes each sample's own reward; it is not an action-independent baseline. The RLOO unit checks that distinction.

**Focus**

- With terminal reward only and $`\gamma=1`$, every completion token has return $`R`$. Broadcasting this return is not a claim that each token independently caused the outcome.
- Use $`L=-B^{-1}\sum_i A_i\sum_t m_{i,t}\log\pi_\theta(y_{i,t}\mid x_i,y_{i,<t})`$. A variable per-response token mean changes the weighting.
- Build on Masks, sequence log probabilities and Log-probability oracles and prompt separation. Rewards, baselines and sampled IDs are fixed; selected current log probabilities carry gradients.

**Reproduce:** On CPU, use `torch.float64` selected log probabilities `[[-1., -2., -9.], [-3., -8., -7.]]`, completion masks `[[1., 1., 0.], [1., 0., 0.]]` and detached advantages `[2., -1.]`. Sum tokens, average the two sequence losses and obtain loss 1.5. Gradients with respect to selected log probabilities are `[[-1., -1., 0.], [0.5, 0., 0.]]` within floating-point tolerance.

**Traps**

- Putting the loss only on EOS because the reward arrived there. Reward placement and gradient assignment are different operations.
- Replacing the token sum with a token mean without naming the changed objective. Variable response lengths make this more than a fixed learning-rate rescaling.
- Reading a lower frozen-rollout loss as better generation. Only fresh, independently scored outputs establish behavior change.

**Practice**

- The section mini-project covers this: policylab's terminal-reward REINFORCE loss, hand gradients and padding-invariance tests.

**Stop when:** Your loss and selected-log-probability gradients match the fixed example, and you can explain why a variable-length token mean is a different weighting.

<details>
<summary>Self-test</summary>

1. Does repeating the terminal return across tokens count the reward several times?
   - No. It weights separate terms in the derivative of the sequence log probability. Do not also repeat the terminal reward in the reward-to-go calculation.
2. What changes if terminal reward is discounted?
   - Returns depend on the distance to termination. Derive the discounted objective and its score-function weights explicitly rather than broadcasting an undiscounted score.
3. Why must changing finite padding log probabilities leave the loss unchanged?
   - Padding is not a sampled action. The completion mask removes it from both the loss and its selected-log-probability gradient.

</details>

#### U3. PPO-style RLHF with a value critic, and critic cost versus group sampling

**About 5 h** · **Target:** Explain + Derive

Topics: Value-function critic and PPO-style RLHF; Critic memory and variance versus group sampling cost

A critic can exploit prefix information that a sequence baseline cannot. It also adds learned state and another failure mode; removing it trades that burden for sibling sampling, not free variance reduction.

**You can now**

- Derive prefix-value targets and token advantages for PPO-style RLHF with terminal rewards and KL shaping.
- Explain the separate actor and critic losses and which rollout quantities stay fixed.
- Compare critic state and fitting cost with extra group generation and verifier calls under a common budget.

**Study**

1. [RLHF Book: language PPO and value targets](https://rlhfbook.com/c/06-policy-gradients#value-functions-and-ppo) (RLHF Book - Policy Gradients and Regularization) - Chapter 6, Value Functions and PPO, Example: PPO, and Generalized Advantage Estimation (GAE) (page read 2026-10-14). Depth: Reuse the earlier GAE and PPO derivations. Concentrate on completion boundaries, KL-shaped returns and critic targets; use rollout-time values for actor advantages.
2. [Lecture 4: PPO implementation and its cost](https://rlhfbook.com/teach/course/lec4-chap6-p2/) (RLHF Book Course - Lectures 3 and 4) - Slides 16 to 28, 30 and 35: rollout tensors, targets, critic clipping, initialization and resident model state. Depth: Slide 27's claim that a prediction close to the target is unaffected by value clipping is not general: the maximum can select the larger clipped error. Check both branches.

**Focus**

- The critic scores the prefix before the action, not the completed answer. Its target includes future outcome reward and future KL-shaped token rewards.
- Freeze old values, returns and actor advantages during batch reuse. Keep unwhitened advantages for constructing critic targets; whitening actor weights must not alter those targets.
- Build the state ledger using GPU memory: allocated, reserved, peak and memory models. A separate critic needs parameters, gradients, optimizer state and activations; a shared value head changes the ledger and couples the losses.
- Compare variance on the same task and sampling budget. A critic is not guaranteed to reduce it, and group baselines require extra generated tokens and scoring calls. TRL 1.15.0 has no `PPOTrainer`; this path is a scratch estimator.

**Reproduce:** For a completed three-token response, use rewards `[0., 0., 2.]`, rollout-time prefix values `[0.5, 1., 1.5]`, zero terminal bootstrap and $`\gamma=\lambda=1`$. Recover advantages `[1.5, 1., 0.5]` and value targets `[2., 2., 2.]`. Then hand-check optional critic clipping with old value 0, current value 1, target 1 and clip width 0.2: the maximum of the two half-squared errors is 0.32, not zero.

**Traps**

- Using the critic's newly fitted values to recompute advantages after every minibatch. The actor's fixed surrogate then changes underneath the optimizer.
- Assuming every PPO implementation holds four independent full models. A verifier can replace the reward model, backbones can be shared and frozen models can be offloaded.
- Adding a separate KL loss after already shaping the reward with the same penalty. That changes the objective and may double its influence.

**Practice**

- The section mini-project covers this: the value-based fixed-rollout estimator, critic-target oracle and critic-versus-group cost ledger.

**Stop when:** Your three-token advantages and targets match the oracle, both critic-clipping branches are explained, and your cost ledger includes generation as well as model state.

<details>
<summary>Self-test</summary>

1. Why can advantages differ across tokens when there is only one terminal reward?
   - Prefix values differ, and GAE combines different TD residuals. KL shaping can also introduce intermediate token rewards.
2. Can an inaccurate fixed baseline bias terminal-return REINFORCE?
   - Not if it depends only on the pre-action state and its gradient is excluded. Bootstrapped targets from an inaccurate critic can introduce bias; these are different mechanisms.
3. Does the critic predict the verifier score alone?
   - It predicts the specified future return. With KL shaping, that includes future KL penalties as well as the outcome score.

</details>

#### U4. Leave-one-out baselines and RLOO

**About 3 h** · **Target:** Derive + Implement

Topics: Leave-one-out baselines and RLOO

RLOO uses sibling completions as a prompt-specific baseline. Excluding the current reward is the part that preserves the expected REINFORCE gradient.

**You can now**

- Derive the leave-one-out baseline's conditional independence and unbiased score-function estimator.
- Implement prompt-grouped RLOO and distinguish it from centering by a mean that includes the current reward.

**Study**

1. [RLHF Book: RLOO algebra](https://rlhfbook.com/c/06-policy-gradients#reinforce-leave-one-out-rloo) (RLHF Book - Policy Gradients and Regularization) - Chapter 6, REINFORCE Leave One Out (RLOO), equations 25 to 27 (page read 2026-10-14).
2. [Back to Basics: sequence REINFORCE and RLOO](https://arxiv.org/html/2402.14740v2#S2.SS3) (Back to Basics: REINFORCE Style Optimization for Learning from Human Feedback) - arXiv:2402.14740v2, Sections 2.2 and 2.3, printed pp. 5 to 6: sequence estimator, moving-average baseline and the unnumbered RLOO estimator. Depth: Stop before Section 2.4. The paper's model-scale comparisons are evidence for its setup, not a guarantee that RLOO beats PPO on your task.

**Focus**

- For $`K>1`$ independent completions of one prompt, $`b_i=(K-1)^{-1}\sum_{j\ne i}R_j`$. Conditional on the prompt, sibling rewards do not depend on the current sampled completion.
- The identity $`A_i=\frac{K}{K-1}(R_i-\bar R)`$ makes the finite-sample correction explicit. Centering alone shrinks the expected raw-reward gradient by $`(K-1)/K`$ under the same independence assumptions.
- Keep siblings grouped by prompt identity, not their position after shuffling. Treat KL-shaped rewards as fixed score-function weights; do not differentiate through the baseline.

**Reproduce:** For one prompt with rewards `[0., 1., 2.]`, obtain leave-one-out baselines `[1.5, 1., 0.5]` and advantages `[-1.5, 0., 1.5]`. Enumerate all pairs of independent binary completions with success probability $`p=1/2`$, reward equal to the sampled bit and score $`\partial_p\log\pi`$. The expected two-sample RLOO estimate is 1; centering by the inclusive mean gives 0.5. Verify by exact enumeration on CPU, not a Monte Carlo run.

**Traps**

- Using the whole minibatch as the sibling group. Prompt difficulty then contaminates the intended per-prompt baseline.
- Generating siblings by dependent selection and still invoking the independent-sample proof. Best-of-N winners and sampling without replacement need a different analysis.
- Using a singleton group. Its leave-one-out denominator is zero; reject it or choose a separately specified baseline.

**Practice**

- The section mini-project covers this: policylab's RLOO baseline, prompt-regrouping tests and exact expected-gradient comparison.

**Stop when:** Your leave-one-out and inclusive-mean estimates match the enumeration, and shuffling complete rollout records preserves prompt-specific advantages.

<details>
<summary>Self-test</summary>

1. Is detaching an inclusive batch mean enough to make it action-independent?
   - No. Detachment removes an autodiff path, not statistical dependence on the current sampled reward.
2. Why does the baseline term have zero expectation?
   - Condition on the prompt and the independent siblings. Their baseline is fixed while the current completion's expected score is zero.
3. Does RLOO need a learned value model?
   - No. It uses extra completions and reward calls to estimate the baseline. Those calls still belong in the cost budget.

</details>

#### U5. Grouped sampling, group-relative advantages, GRPO and degenerate groups

**About 5 h** · **Target:** Derive + Implement

Topics: Grouped sampling and group-relative advantages; GRPO objective and critic-free trade-offs; All-equal, all-correct and all-wrong group behavior

GRPO replaces a fitted critic with comparisons between sibling completions. Its useful signal depends on reward differences within a prompt, not just on average success.

**You can now**

- Derive outcome-supervised group advantages and identify their differences from RLOO.
- Implement a critic-free clipped loss that handles mixed and all-equal reward groups.

**Study**

1. [RLHF Book: GRPO](https://rlhfbook.com/c/06-policy-gradients#group-relative-policy-optimization-grpo) (RLHF Book - Policy Gradients and Regularization) - Chapter 6, Group Relative Policy Optimization (GRPO), equations 33 to 38 (page read 2026-10-14).
2. [DeepSeekMath: original outcome-supervised GRPO](https://arxiv.org/html/2402.03300v3#S4.SS1) (DeepSeekMath - GRPO) - arXiv:2402.03300v3, Sections 4.1.1 and 4.1.2, equations 3 and 4, Figure 4 and the unnumbered outcome-advantage formula. Depth: Stop before process supervision in Section 4.1.3. Keep the original token ratios and per-response means separate from later trainer defaults.

**Focus**

- For outcome rewards, broadcast $`A_i=(R_i-\bar R)/(s_R+\delta)`$ to completion tokens. Specify population or sample standard deviation, a positive stabilizer and a minimum group size.
- Group centering, standard-deviation scaling, ratio clipping, KL placement and aggregation are separate choices. The algorithm name alone does not specify your loss.
- All-equal rewards give zero outcome advantages with a finite denominator. All-correct and all-wrong binary groups share that property, but require different data decisions. An explicit KL term can still supply gradients.
- The original method removes the critic and GAE. It does not remove sibling generation, verification or the need to test loss gradients.

**Reproduce:** On CPU, normalize rewards `[1., 1., 0., 0.]` with population standard deviation and stabilizer `1e-4`. Obtain advantages approximately `[0.99980004, 0.99980004, -0.99980004, -0.99980004]`. Repeat with sample standard deviation and the same `1e-4` stabilizer: magnitudes become approximately 0.86587543. All-zero and all-one groups must give finite zero advantages. Reject a singleton before computing a sample standard deviation.

**Traps**

- Treating normalized inclusive centering as the unbiased RLOO estimator. The random denominator adds another dependence on the sampled group.
- Adding a stabilizer after division. It cannot repair a zero denominator or an already undefined singleton sample standard deviation.
- Calling all-correct groups proof of generalization. The held-out prompt distribution may still fail.

**Practice**

- [Normalize GRPO Group Advantages](https://www.tensortonic.com/problems/cs336-l16-grpo-group-advantages) - Language Modeling from Scratch plan, Normalize GRPO Group Advantages: statement, function signature and public examples. The problem uses population standard deviation. The section mini-project also tests sample-standard-deviation parity and degenerate groups.

**Stop when:** Your mixed and all-equal groups match the specified convention, and you can list every choice needed to turn those advantages into a loss.

<details>
<summary>Self-test</summary>

1. Does zero mean advantage imply zero policy gradient?
   - No. Different completions have different score vectors. Their weighted gradients need not cancel.
2. Does an all-wrong binary group identify the least wrong completion?
   - No. Equal verifier rewards give no relative outcome information. Use a specified richer reward or change sampling, not an invented ranking.
3. Why do NumPy and PyTorch ports sometimes disagree?
   - Their default standard-deviation corrections differ. Specify the convention and stabilizer in both implementations.

</details>

#### U6. Within-prompt and batch normalization, reward scaling and comparability

**About 3 h** · **Target:** Derive + Measure

Topics: Within-prompt versus batch reward normalization; Reward scaling, whitening and cross-prompt comparability

Normalization is part of the estimator, not just numerical housekeeping. It can erase reward-scale differences or make one prompt's update depend on unrelated prompts.

**You can now**

- Derive how prompt-level and batch-level scaling reweight a fixed reward batch.
- Measure advantage and gradient changes under reward shifts, rescaling and batch-composition changes.

**Study**

1. [Dr. GRPO: question-level weighting](https://arxiv.org/html/2503.20783v2#S3.SS1) (Understanding R1-Zero-Like Training: A Critical Perspective (Dr. GRPO)) - arXiv:2503.20783v2, Sections 3.1 and 3.2: Question-level difficulty bias, Figure 4 and removal of standard-deviation scaling. Depth: Study the weighting argument, not the large-model experiment. Inclusive centering remains a scaled RLOO estimator; removing standard-deviation scaling alone does not make it exactly unbiased.
2. [TRL 1.15.0: group and batch reward scaling](https://huggingface.co/docs/trl/v1.15.0/en/grpo_trainer#computing-the-advantage) (TRL GRPO Trainer) - Computing the advantage and `GRPOConfig`'s `scale_rewards` parameter. Depth: Inspect only group, batch and disabled scaling. Batch scaling retains per-group centering; it is not global reward centering.

**Focus**

- Separate the scope of the mean from the scope of the standard deviation. Per-group centering with one batch scale differs from centering all rewards together.
- With no stabilizer and nonzero variance, a positive affine reward transform leaves group z-scores unchanged. A stabilizer breaks exact scale invariance; a negative multiplier reverses signs.
- For binary rewards with population success fraction $`p`$, the group standard deviation is $`\sqrt{p(1-p)}`$. Rare successes and rare failures get large relative weights; exactly equal groups still have zero centered reward.
- Measure selected-log-probability gradient norms as well as advantages. Whitening token advantages can weight long completions more in its statistics. Keep raw rewards and external quality for cross-run comparison.

**Reproduce:** On CPU, use two prompt groups `[0., 2.]` and `[10., 14.]`. With population statistics and no stabilizer, group centering gives `[-1., 1.]` and `[-2., 2.]`; group scaling makes both `[-1., 1.]`. Per-group centering with the population batch standard deviation instead divides those centered values by `sqrt(32.75)`; TRL 1.15.0's `scale_rewards="batch"` divides by the sample batch standard deviation plus `1e-4`, about 6.608. Show that shifting only the second group leaves group z-scores unchanged but changes this batch scale. Use fixed token masks and score vectors to compare the resulting gradient weights.

**Traps**

- Comparing normalized training rewards across changing prompt mixtures as though they were absolute quality scores.
- Claiming standard-deviation division always reduces variance. It changes relative weighting and can amplify noisy low-variance groups.
- Whitening rewards, then whitening advantages again without recording both transformations.

**Practice**

- The section mini-project covers this: policylab's normalization ablation on fixed prompt groups, reward transforms and matched gradient reductions.

**Stop when:** Your two-group oracle matches all three scaling choices, and the report separates raw reward, normalized advantage and external quality.

<details>
<summary>Self-test</summary>

1. Does batch scaling erase the within-prompt baseline?
   - Not in TRL's batch mode. It subtracts the group mean and uses a batch-level standard deviation.
2. What does doubling raw reward do without standard-deviation scaling?
   - It doubles centered outcome weights. If the KL coefficient stays fixed, the reward-to-KL balance changes too.
3. Is a prompt's reward offset necessarily comparable with another prompt's offset?
   - No. A preference-trained reward can have prompt-dependent offsets. Global centering may mix those offsets into the baseline.

</details>

#### U7. Token log probabilities, importance ratios, clipping and loss aggregation

**About 5 h** · **Target:** Derive + Implement

Topics: Old-policy and current-policy token log probabilities; Per-token importance ratios and sequence dependence; Clipping and token, sequence or group loss aggregation

A correct ratio can still feed the wrong estimator. Token clipping and loss reduction control different parts of the update and must be tested separately.

**You can now**

- Implement detached old-policy token ratios and the sign-dependent clipped surrogate.
- Derive the distinction between token surrogates and exact sequence importance weights.
- Compare sequence means, token means and constant-denominator reductions on one frozen batch.

**Study**

1. [RLHF Book: token ratios and loss reductions](https://rlhfbook.com/c/06-policy-gradients#loss-aggregation-tradeoffs) (RLHF Book - Policy Gradients and Regularization) - Chapter 6, Proximal Policy Optimization (PPO), Understanding the PPO Objective, and Loss Aggregation Tradeoffs (page read 2026-10-14). Depth: Reuse the earlier PPO clipping derivation. Clipping is a surrogate plateau, not a hard constraint on the updated policy. Compare reductions with identical token terms; the chapter's comparison script computes `masked_mean_token_level` on `ratio` alone, without the advantages its other two reductions use.
2. [DAPO: asymmetric clipping and token aggregation](https://arxiv.org/html/2503.14476v2#S3.SS3) (DAPO: An Open-Source LLM Reinforcement Learning System at Scale) - arXiv:2503.14476v2, Sections 3.1 and 3.3, equations 10 and 12. Depth: Read the equations and weighting argument only. The paper's probability bounds describe clipping plateaus, not guaranteed bounds after an optimizer step.

**Focus**

- Compute $`\rho_{i,t}=\exp(\ell_{i,t}^{\text{current}}-\ell_{i,t}^{\text{old}})`$ on identical sampled tokens and prefixes. Old log probabilities and advantages stay detached.
- Maximize $`\min(\rho A,\operatorname{clip}(\rho,1-\epsilon,1+\epsilon)A)`$. A positive advantage plateaus above the upper bound; a negative advantage plateaus below the lower bound. Other out-of-range cases still have gradients.
- Exact trajectory reweighting uses $`\prod_t\rho_t`$. A token ratio leaves the old prefix distribution in place; token PPO is a local surrogate, not exact off-policy correction of terminal sequence reward.
- Name the denominator: response length then response mean, total valid tokens, or a fixed batch-size times generation limit. If group sizes vary, specify whether prompts or completions get equal weight. Accumulated token sums need a shared denominator to match a full-batch token mean.

**Reproduce:** On CPU in `torch.float64`, use ratios `[0.5, 1.5, 0.5, 1.5]`, detached advantages `[2., 2., -2., -2.]` and clip width 0.2. The maximized terms are `[1., 2.4, -1.6, -3.]`; the negative mean loss is 0.3 and its gradients with respect to current selected log probabilities are `[-0.25, 0., 0., 0.75]`. Separately reduce token terms `[1., 1., 1., 1., 10.]` and `[1., 1., 1., 1., 1., 1., 1., 1., 1., 10.]`: sequence mean 2.35, token mean 2.2, constant denominator 20 gives 1.65.

**Traps**

- Clamping the ratio and discarding the minimum. This incorrectly removes corrective gradients on the wrong side of the interval.
- Using reference log probabilities as old log probabilities. The reference anchor need not have generated the rollout.
- Averaging token means from unequal minibatches. It does not recover the full-batch token mean unless token counts are equal or correctly weighted.

**Practice**

- [Compute a Clipped GRPO Surrogate](https://www.tensortonic.com/problems/cs336-l16-clipped-grpo-surrogate) - Language Modeling from Scratch plan, Compute a Clipped GRPO Surrogate: statement and public examples. The problem reports out-of-range ratios, not the sign-dependent active plateau fraction. The section mini-project adds autodiff checks and unequal-length aggregation tests.

**Stop when:** Both advantage signs match hand values and gradients, all three reductions match the frozen terms, and your minibatch reduction matches its stated full-batch objective.

<details>
<summary>Self-test</summary>

1. Can every token ratio be inside the clip interval while the sequence ratio is outside?
   - Yes. Two ratios of 1.1 multiply to 1.21, outside an interval with upper bound 1.2.
2. Does a clipped token have no influence on any parameter update?
   - Its active clipped outcome term has zero derivative away from a boundary. Other tokens, KL and shared parameters can still move its probability.
3. Does TRL's dapo loss type select the complete DAPO recipe?
   - No. It selects a reduction. Reward scaling, clipping bounds, KL and sampling need separate configuration.

</details>

#### U8. Reference KL penalties, masks, truncated completions and length incentives

**About 4 h** · **Target:** Implement + Measure

Topics: Reference-policy KL penalties and estimators; Reward placement, masks and truncated completions; Length normalization, verbosity incentives and response boundaries

The reference penalty and response boundary are part of the objective. A plausible scalar KL or loss can hide a reversed ratio, a missing stopping action or an uncounted truncated output.

**You can now**

- Implement a reference-KL estimator with an explicit sampling distribution and reduction.
- Test EOS, padding and length-limit boundaries without silently treating truncation as a completed answer.
- Measure how masks, reward placement and normalization alter length incentives.

**Study**

1. [RLHF Book: reference KL](https://rlhfbook.com/c/15-regularization#implementation-example) (RLHF Book - Policy Gradients and Regularization) - Chapter 15, KL Divergence in RL Optimization, Reference Model to Generations and Implementation Example, equations 2 to 4 (page read 2026-10-14). Depth: Stop before Other Tools to Control Optimization. The example passes two log tensors to `F.kl_div` without `log_target=True`; correct that and define the token reduction. Its sequence sum also needs a completion mask.
2. [DAPO: truncated samples and length shaping](https://arxiv.org/html/2503.14476v2#S3.SS4) (DAPO: An Open-Source LLM Reinforcement Learning System at Scale) - arXiv:2503.14476v2, Section 3.4, Overlong Filtering and Soft Overlong Punishment, equation 13.
3. [TRL 1.15.0: KL and truncation configuration](https://huggingface.co/docs/trl/v1.15.0/en/grpo_trainer) (TRL GRPO Trainer) - Estimating the KL divergence, Loss Types, and `GRPOConfig`'s `beta`, `mask_truncated_completions` and `use_bias_correction_kl` parameters. Depth: Inspect these contracts only. A sampled KL value and its fixed-rollout gradient are different checks; record any correction for old-policy sampling.

**Focus**

- Build on Token entropy, sequence diversity, KL direction and KL estimators. Write $`D_{\mathrm{KL}}(\pi_\theta\|\pi_{\text{ref}})`$ instead of relying on forward or reverse labels. For current-policy samples with shared support, $`d=\log\pi_\theta-\log\pi_{\text{ref}}`$ and $`\exp(-d)+d-1`$ have the same KL expectation.
- A detached rollout log-ratio can shape rewards; an explicit current-policy KL term has its own gradient. Neither estimator's value identity alone proves that fixed-old-sample autodiff equals the exact sequence-KL gradient.
- Include sampled EOS when optimizing complete-sequence likelihood. Mask prompt tokens and post-EOS padding. A length-limit stop has no sampled EOS; retain its reason and choose a specified reward, bootstrap or loss-exclusion policy.
- Per-token KL means and sequence KL sums have different length weighting. Dropping truncated losses changes the training population; log their rewards, lengths and cost even when their loss is masked. Measure length by correctness and validity, not just its overall mean.

**Reproduce:** On CPU, enumerate a one-token policy `[0.75, 0.25]` and reference `[0.5, 0.5]`. Both the policy-weighted log ratio and the policy-weighted `exp(-d) + d - 1` give approximately 0.13081204 nats. Confirm with `torch.nn.functional.kl_div(reference.log(), policy.log(), reduction="sum", log_target=True)`. Then test completion records for immediate EOS, EOS followed by padding and length-limit truncation: only sampled actions enter the sequence likelihood, finite padding changes do not alter loss or gradients, and truncation remains a separate outcome.

**Traps**

- Using `exp(d) - d - 1` on policy samples as the same KL oracle. The probability ratio is reversed.
- Interpreting a negative sampled log ratio as impossible KL. Individual log ratios can be negative; the exact expectation is nonnegative.
- Discarding long failures, then reporting success only over the remaining outputs. That changes the evaluation denominator.

**Practice**

- [Compare Sequence and Token Length Normalization](https://www.tensortonic.com/problems/cs336-l16-grpo-length-normalization-audit) - Language Modeling from Scratch plan, Compare Sequence and Token Length Normalization: statement and public examples. The section mini-project extends this reduction check with reference-KL enumeration and EOS, padding and truncation cases.

**Stop when:** Your enumerated KL matches the corrected library call, boundary tests pass, and every excluded completion remains visible in the cost and outcome ledger.

<details>
<summary>Self-test</summary>

1. Does a format-valid truncated answer necessarily have a terminal outcome reward?
   - Only if the task contract scores that prefix as a valid answer. A generation cap alone does not establish completion or correctness.
2. What if the policy places mass where the reference probability is zero?
   - The policy-to-reference KL is infinite. Epsilon floors change that quantity and must not be hidden as exact KL.
3. Does turning off the KL loss make reference-drift monitoring unnecessary?
   - No. Loss regularization and diagnostic measurement are separate choices. TRL does not log its KL metric when `beta` is zero, so add an independent diagnostic if needed.

</details>

#### U9. Multiple gradient steps, off-policy drift, rollout freshness and policy lag

**About 4 h** · **Target:** Explain + Measure

Topics: Multiple gradient steps and off-policy drift; Rollout freshness, policy lag and importance correction

Freshness is a property of the policy and rollout record, not the wall clock alone. Rewriting old log probabilities can make a stale batch look perfectly on-policy.

**You can now**

- Explain when batch reuse, minibatch updates and sampler lag make rollouts off-policy.
- Measure ratio drift and effective sample size while preserving immutable behavior-policy log probabilities.

**Study**

1. [RLHF Book: asynchronous rollouts and correction](https://rlhfbook.com/c/06-policy-gradients#asynchronous-rl-systems) (RLHF Book - Policy Gradients and Regularization) - Chapter 6, Asynchronous RL Systems and Truncated Importance Sampling, Figures 8 and 9 and equations 48 to 50 (page read 2026-10-14). Depth: Read the roles and log-probability ledger, not distributed deployment. A token correction does not fully correct the prefix distribution, and a cap introduces bias whose size is not guaranteed small.
2. [Lecture 4: minibatch drift](https://rlhfbook.com/teach/course/lec4-chap6-p2/) (RLHF Book Course - Lectures 3 and 4) - Slides 19 to 25: stored versus recomputed quantities and multiple epochs or minibatches. Depth: Use the first-step argument, not slide 25's approximate six-epoch cutoff as a universal limit. Drift depends on update size, sampler and data.

**Focus**

- Freeze behavior weights and sampler settings during collection. Keep behavior log probabilities, old-checkpoint learner log probabilities and current learner log probabilities distinct when backends differ.
- The first gradient evaluation has ratios 1 only when the actual behavior and current scoring policy match. Later minibatches can already be stale within the first epoch; gradient accumulation without intermediate steps does not create this parameter drift.
- Log version lag, elapsed age, ratio quantiles, active clipping fraction and sequence-weight effective sample size. Reuse Support, coverage, effective sample size and visitation diagnostics; token ratios alone miss compounded sequence drift.
- A fixed sampler-to-old-learner correction and the current-to-old-learner ratio address different mismatches. Truncating correction weights trades bias for stability. Bound queue age and refill attempts before considering a distributed system.

**Reproduce:** On CPU, take a frozen one-token batch containing one example of each action from behavior policy `[0.5, 0.5]`. Score it under current policy `[0.8, 0.2]`: ratios are `[1.6, 0.4]`, empirical effective sample size is approximately 1.47058824 of 2, and exact current-to-behavior KL is approximately 0.19274476 nats. Overwriting old scores with current scores falsely returns `[1., 1.]` and effective sample size 2. Inject that overwrite and require a version-binding test to catch it.

**Traps**

- Treating one epoch as one optimizer step. Updates between minibatches can activate clipping within that epoch.
- Refreshing old scores from newer weights to avoid large ratios. This erases the behavior distribution rather than correcting it.
- Assuming matching version labels guarantees matching probabilities. Decoding transforms and backend numerics still need a parity check.

**Practice**

- The section mini-project covers this: policylab's immutable rollout versions, stale-score injection and CPU queue-age simulation.

**Stop when:** The overwrite defect fails a test, the finite-policy drift metrics match, and the reuse policy names both its age limit and behavior-score provenance.

<details>
<summary>Self-test</summary>

1. Which policy belongs in an exact sequence importance denominator?
   - The distribution that actually sampled that sequence, including its decoding transformation and support.
2. Why record both elapsed age and version lag?
   - Many updates can occur quickly, or none can occur during a long delay. The two measurements reveal different causes of staleness.
3. Can importance weights recover actions excluded by top-p sampling?
   - No. Missing behavior support cannot be recovered by reweighting the observed samples.

</details>

#### U10. Entropy collapse, KL spikes, invalid outputs, zero-signal groups and prompt balancing

**About 4 h** · **Target:** Measure

Topics: Entropy collapse, KL spikes and mode contraction; Invalid output, verifier failure and zero-signal groups; Prompt balancing, difficulty curricula and reward sparsity

Zero-signal groups can mean mastery, failure or a broken verifier. A higher retained-batch reward cannot distinguish them, especially after prompt filtering.

**You can now**

- Measure entropy, KL, validity and zero-signal groups by prompt and outcome class.
- Distinguish verifier failures, reward sparsity and policy contraction before changing sampling or curricula.

**Study**

1. [DAPO: entropy, dynamic sampling and training diagnostics](https://arxiv.org/html/2503.14476v2#S3.SS2) (DAPO: An Open-Source LLM Reinforcement Learning System at Scale) - arXiv:2503.14476v2, Sections 3.1, 3.2 and 4.3, Figures 2, 3 and 7. Depth: Study failure mechanisms and recorded metrics only. Dynamic sampling changes the retained prompt distribution; do not transfer the paper's wall-time conclusions to your small run.
2. [TRL 1.15.0: diagnostic definitions](https://huggingface.co/docs/trl/v1.15.0/en/grpo_trainer#logged-metrics) (TRL GRPO Trainer) - Logged metrics: `entropy`, `reward`, `reward_std`, `frac_reward_zero_std`, `completions/clipped_ratio` (the truncated-completion fraction) and the `clip_ratio/low_mean`, `clip_ratio/high_mean` and `clip_ratio/region_mean` metrics. Depth: Read metric definitions only. Zero reward standard deviation says nothing by itself about textual diversity or verifier correctness.
3. [Post-Training Laboratory: failure evidence](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-3/llm-post-training-laboratory.md) (LLM Post-Training Laboratory - Online RL) - Architecture constraints, Milestone D - Failure handling, and Failure-injection requirements. Depth: Use only the online-policy and verifier failures here. The full laboratory is a later integration, not this card's assignment.

**Focus**

- Reuse verifier soundness and outcome-class tests. Separate correct, incorrect, malformed, truncated and verifier-error records. A verifier timeout is missing evidence, not automatically a wrong answer.
- Read token entropy alongside duplicate completions, distinct answers, reference KL, behavior-policy drift, length and held-out quality. Changing visited prefixes can change the mean entropy; use a fixed diagnostic prefix set as well.
- For independent binary outcomes with success probability $`p`$ and group size $`G`$, mixed-group probability is $`1-p^G-(1-p)^G`$. Rejecting equal groups favors intermediate success probabilities and consumes attempts even when no update follows.
- Log original and retained prompt mixtures, all-correct and all-wrong fractions, acceptance rate and generation or verifier cost. Set a refill cap and a no-update fallback. Tune difficulty or sampling on validation evidence, not final evaluation.

**Reproduce:** On CPU, enumerate four independent binary rewards. Mixed-group probability is 0.875 at success probability 0.5 and 0.3438 at success probability 0.1. Check the formula against the enumeration. Then replay records with equal rewards but distinct texts, identical texts, malformed outputs and verifier errors. Require separate diagnostic flags: equal reward is not itself entropy collapse, and verifier failure is not evidence of task failure.

**Traps**

- Calling all-correct and all-wrong groups the same failure because both have zero advantage. Their evaluation outcomes are opposite.
- Increasing temperature to fix a verifier outage. Sampling cannot repair missing or incorrect labels.
- Using an unbounded refill loop when every prompt has equal rewards. It can spend the whole budget without taking a step.

**Practice**

- The section mini-project covers this: policylab's zero-signal and verifier-failure replay, prompt-slice diagnostics and bounded refill accounting.

**Stop when:** Your diagnostics separate each replayed failure class, mixed-group enumeration matches, and the refill cap preserves all attempted prompts and their costs.

<details>
<summary>Self-test</summary>

1. Does zero reward variance imply identical completions?
   - No. Different completions can receive the same binary or saturated reward. Measure output diversity separately.
2. Why can higher entropy be bad?
   - It may reflect incoherent or repetitive generation rather than useful exploration. Check independent quality and validity.
3. What should a KL spike trigger before a hyperparameter change?
   - Check policy and reference identity, masks, log-probability direction, numerical health and sampler parity. Then inspect fresh outputs and update size.

</details>

#### U11. Fixed-rollout estimator, ratio, clipping and gradient tests

**About 3 h** · **Target:** Implement

Topics: Fixed-rollout estimator, ratio, clipping and gradient tests

A training curve is a weak loss test. Frozen rollouts let you isolate sign, detachment, mask and version errors before generation adds noise.

**You can now**

- Build independent scalar-value and gradient oracles for value-based and critic-free losses.
- Differential-test a pinned implementation only after matching its masks, normalization and KL convention.

**Study**

1. [RLHF Book: fixed loss implementations](https://rlhfbook.com/c/06-policy-gradients#example-grpo) (RLHF Book - Policy Gradients and Regularization) - Chapter 6, Example: PPO and Example: GRPO, then Suggested Experiments (page read 2026-10-14). Depth: Use the loss equations as references for your own fixtures. Match each reduction explicitly and keep rollout-time advantages fixed.
2. [Pinned policy-gradient losses: differential reference](https://raw.githubusercontent.com/natolambert/rlhf-book/1042143366d73ff654727e4d18a1d3a21209c3a3/code/policy_gradients/loss.py) (RLHF Book Code - Policy Gradients) - Commit 1042143, `masked_mean`, `ReinforceLoss`, `PPOLoss`, `GRPOLoss`, `DAPOLoss` and `approx_kl1`/`approx_kl3`. Depth: Compare outcome losses with KL disabled first. `ReinforceLoss` uses a per-response token mean, not the sequence sum taught earlier. For policy-sampled policy-to-reference KL, `approx_kl1` has the opposite sign and `approx_kl3` the reversed ratio; do not adopt them as independent KL oracles.

**Focus**

- Reuse the earlier hand fixtures. Test selected-log-probability gradients before model-parameter gradients, then check a tiny differentiable categorical policy against exact enumeration.
- At an identical behavior checkpoint, the differentiable ratio is numerically 1 but has derivative 1 with respect to current log probability. Replacing it with a literal constant kills the gradient. With matching weights and reduction, its first-step outcome gradient equals REINFORCE's, not necessarily its scalar loss.
- Check padding invariance, prompt exclusion, EOS inclusion, reward detachment, group permutation, fixed old scores, clipping for both signs and finite all-equal groups. Reject invalid empty masks and singleton groups according to the loss contract.
- Use float64 CPU arithmetic and finite differences away from clipping kinks. Then add a framework differential test with explicit TRL 1.15.0 settings; its default token-mean reduction and zero KL coefficient do not reproduce original GRPO.

**Reproduce:** On CPU, let current selected log probability be a scalar leaf initialized to -1, old log probability be its detached clone, and detached advantage be 2. The negative clipped surrogate at ratio 1 has value -2 and derivative -2 with respect to the current log probability. The negative log-probability REINFORCE loss has value 2 and the same derivative -2. Show that a literal ratio of 1 has no current-log-probability gradient, while `exp(logp - logp.detach())` does. Extend this test with the earlier clipping, RLOO, normalization and KL fixtures.

**Traps**

- Checking only scalar equality. Detached current scores can reproduce the same loss while giving no policy gradient.
- Differential-testing two implementations that share the same helper bug. Keep hand arithmetic or exact enumeration independent.
- Using an empty-mask denominator guard to silently accept invalid data. A finite zero loss is not evidence of a valid rollout.

**Practice**

- The section mini-project covers this: policylab's value-based and critic-free estimator suites, first-step gradient equivalence and deliberate ratio, mask and version defects.

**Stop when:** Hand and autodiff values and gradients agree, every injected defect fails a named test, and library differences are explained by explicit contracts rather than hidden defaults.

<details>
<summary>Self-test</summary>

1. Why can a zero centered loss still have nonzero gradients?
   - Centered advantages can sum to zero while weighting different score vectors. Scalar cancellation does not imply gradient cancellation.
2. Should old scores receive gradients during batch reuse?
   - No. They define the fixed behavior denominator. Only the current policy scores are differentiated in that ratio.
3. What must be matched before a library loss is a useful differential reference?
   - Selected tokens, masks, old scores, advantages, clipping bounds, KL estimator and sampling assumptions, and all reduction denominators.

</details>

#### U12. SFT, DPO, rejection and best-of-N controls, matched budgets and training traces

**About 6 h** · **Target:** Measure

Topics: SFT, DPO, rejection sampling and best-of-N controls; Matched generated tokens, verifier calls, updates and wall time; Reward, external quality, KL, entropy, length and validity traces

Online RL can spend much more sampling compute than its controls. The evidence must distinguish learned behavior from extra candidates, a permissive verifier or a changed evaluation denominator.

**You can now**

- Compare a small online policy update with SFT, DPO, rejection fine-tuning and inference-time selection controls.
- Account for generated tokens, verifier calls, updates and wall time, including failed and filtered attempts.
- Interpret reward and independent quality traces with KL, entropy, length, validity and prompt-level uncertainty.

**Study**

1. [DeepSeekMath: controls and sampling versus improvement](https://arxiv.org/html/2402.03300v3#S5.SS2) (DeepSeekMath - GRPO) - arXiv:2402.03300v3, Sections 5.2.1 and 5.2.2, Table 10 and Figures 5 and 7. Depth: Read the control definitions and evaluation distinction only. These comparisons do not establish an algorithm ranking under your budgets; DPO is a preference objective, not an on-policy policy-gradient estimator.
2. [Post-Training Laboratory: matched evidence](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-3/llm-post-training-laboratory.md) (LLM Post-Training Laboratory - Online RL) - Hardware variants, Milestones B, E and F, Measurement requirements and Design-defense questions. Depth: Apply these standards to the section's reduced-scale online study, not the entire laboratory. Reuse earlier SFT, DPO, verifier and evaluation components.
3. [TRL 1.15.0: trace definitions](https://huggingface.co/docs/trl/v1.15.0/en/grpo_trainer#logged-metrics) (TRL GRPO Trainer) - Logged metrics: `num_tokens`, `step_time`, `reward`, `entropy`, `kl`, completion length and clipping metrics. Depth: Use definitions, not the eight-GPU Quick start. `num_tokens` includes prompts and completions, and `kl` is logged only when `beta` is nonzero; add separate generated-token and verifier-call counters.

**Focus**

- Use a tiny CPU text policy and short verifiable completions first. If your GPU fits weights, optimizer state, activations and generation buffers, repeat with a small decoder or adapter. Frozen rollouts establish loss correctness, not online behavior improvement.
- Start controls from the same checkpoint and prompt split. SFT imitates specified targets; DPO uses scored pairs; rejection fine-tuning imitates accepted samples; best-of-N selects without updating weights. Name the selector available at deployment and any oracle-only upper bound.
- Reuse Matched interaction and compute budgets, tuning budgets and final-evaluation isolation. Match a prespecified main budget axis and disclose the others; equal updates do not imply equal tokens or compute. Count collection, retries, rejected groups, verification, training and evaluation separately.
- Plot raw reward, independent quality, reference KL, token entropy, length, validity and signal coverage against both consumed budget and update count. Evaluate fresh held-out outputs at common decoding settings and selection budgets. Pair by prompt and report seed spread or prompt-level uncertainty; preserve failures and reward-hacking probes.

**Reproduce:** Audit a CPU fixture with three prompts, four generated completions per prompt and completion lengths `[5, 6, 7, 8]` for each prompt. Score every completion once and retain six for training. The collection ledger must still show 78 generated tokens, 12 verifier calls and 12 attempted completions, with six retained. Use that accounting rule in the mini-project's bounded online study. Compare fresh held-out outputs before and after training with the named controls; report a gain, no detectable gain or a regression without requiring a particular score.

**Traps**

- Calling a best-of-N gain a learned policy improvement. Selection changes the delivered answer without changing model weights.
- Building DPO pairs with extra uncounted generations or charging only the accepted samples in rejection fine-tuning.
- Choosing checkpoints or reward parameters on the final held-out score. The final evaluation then becomes tuning data.

**Practice**

- The section mini-project covers this: policylab's tiny online update, matched SFT and direct-preference controls, rejection and best-of-N comparison, complete traces and reward-hacking evidence pack.

**Stop when:** The cost fixture balances, controls disclose every budget axis, and fresh independent evaluation supports a hardware-scoped conclusion with failed attempts and uncertainty retained.

<details>
<summary>Self-test</summary>

1. What would support learned improvement rather than extra inference compute?
   - Fresh outputs from the updated policy outperform the starting policy at the same decoding and selection budget on independent held-out evaluation. Matched training controls strengthen attribution.
2. Is rising training reward with flat external quality a successful result?
   - It shows proxy fitting, not established behavior improvement. Inspect hacking, validity, length and evaluation uncertainty.
3. Must every control consume identical wall time and token counts?
   - Usually that is infeasible. Choose the main matching axis in advance, disclose all costs and compare quality-cost trade-offs rather than claiming universal superiority.

</details>

### Mini-project: Online policy optimization with versioned rollouts

**About 14 to 18 hours.** Build critic-based and critic-free policy updates on frozen rollouts in `policylab`, prove freshness handling, then run a tiny online study with matched controls. The versioned collector and traces feed reasoning agents and the capstone evidence pack.

1. Build the rollout collector in `llm/` with an exact sequence-gradient oracle and a written generation-policy contract, implement terminal-reward REINFORCE with detached rewards, and prove padding invariance with hand-gradient tests in `tests/`.
2. Implement the value-based fixed-rollout estimator with a critic-target oracle in `llm/`, compare critic state and fitting cost against group sampling in `ledger/`, and check RLOO baselines with prompt-regrouping tests and exact expected-gradient enumeration.
3. Normalize fixed prompt groups with both standard-deviation conventions in `llm/`, handle degenerate and singleton groups explicitly, and ablate reward transforms with matched gradient reductions, passing the free TensorTonic group-advantage cases.
4. Implement detached token ratios with sign-dependent clipping in `llm/`, check first-step equivalence with REINFORCE by autodiff, compare sequence, token and constant-denominator reductions on unequal lengths, and enumerate reference KL with EOS, padding and truncation tests, passing the free TensorTonic surrogate and length-normalization cases.
5. Assemble value-based and critic-free estimator suites on frozen rollouts in `tests/`, inject ratio, mask and version defects that must fail, freeze behavior scores in `schema/`, and simulate queue age on CPU with stale-score injection and drift traces.
6. Replay zero-signal and verifier-failure batches with prompt-slice diagnostics, separate mastery from breakage and contraction, and enforce a bounded refill cap with all attempts and costs retained in `ledger/`.
7. Run a CPU online update with matched SFT, direct-preference, rejection and best-of-N controls under a stated budget, and defend held-out quality with reward, KL, entropy, length and validity traces plus a reward-hacking pack across seeds, moving to a decoder only if your GPU fits it.

**Deliverables**

- The `llm/` rollout and estimator package with oracles and regression tests.
- Normalization, clipping and freshness studies with drift and slice evidence.
- Bounded online study with matched controls, traces and hacking pack.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [TensorTonic: Normalize GRPO Group Advantages](https://www.tensortonic.com/problems/cs336-l16-grpo-group-advantages). Pass population cases; add sample-convention and degenerate tests.
- external-tests: [TensorTonic: Compute a Clipped GRPO Surrogate](https://www.tensortonic.com/problems/cs336-l16-clipped-grpo-surrogate). Pass public cases; add autodiff and aggregation checks.
- external-tests: [TensorTonic: Compare Sequence and Token Length Normalization](https://www.tensortonic.com/problems/cs336-l16-grpo-length-normalization-audit). Pass reduction cases; add KL and boundary extensions.
- external-tests: [RLHF Book policy-gradient losses at pinned commit](https://raw.githubusercontent.com/natolambert/rlhf-book/1042143366d73ff654727e4d18a1d3a21209c3a3/code/policy_gradients/loss.py). Differential-test fixed rollouts with KL disabled first.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Estimator correctness | Frozen-rollout losses and gradients match hand oracles with ratio, mask and version defects caught. | A constant-ratio defect passes loss equality yet fails the gradient check. |
| Freshness honesty | Behavior scores stay immutable and stale-score injection fails with drift metrics recorded. | A queue-age simulation names the reuse limit where correction breaks down. |
| Signal diagnosis | Zero-signal and verifier-failure replays carry distinct flags with bounded refill accounting. | A verifier outage is shown to survive sampling fixes and routes to a data repair. |
| Control discipline | Budgets reconcile across tokens, calls and updates with negative evidence retained across seeds. | The verdict separates learned change from selection, length and evaluator effects. |

Feeds into: Versioned rollouts, estimators and traces feed reasoning agents, systems and the capstone.

### Resource route

- **Primary - Book:** [RLHF Book - Policy Gradients and Regularization](https://rlhfbook.com/c/06-policy-gradients.html) - Study Chapter 6 completely (REINFORCE, RLOO, PPO, GRPO, GSPO, CISPO, loss aggregation, asynchronous systems, truncated importance sampling) and Chapter 15 on KL and regularization. Implement REINFORCE, PPO-style, RLOO and GRPO fixed-rollout losses from the chapter equations, then verify masks, ratios, group baselines and one-gradient-step simplifications.
- **Required - Course:** [RLHF Book Course - Lectures 3 and 4](https://rlhfbook.com/course) - Use Lecture 3 (RL motivation and math, Chapter 6 part 1) and Lecture 4 (RL implementation and practice, Chapter 6 part 2: loss aggregation, asynchronous training). Reproduce the loss on a tiny frozen rollout before using any trainer library.
- **Required - Paper:** [Back to Basics: REINFORCE Style Optimization for Learning from Human Feedback](https://arxiv.org/abs/2402.14740) - Study the RLOO estimator, baseline construction and system simplifications. Compare RLOO with a value-baseline or grouped estimator under matched completions and reward calls.
- **Required - Paper:** [DeepSeekMath - GRPO](https://arxiv.org/abs/2402.03300) - Study the GRPO method and group-relative advantage construction, not the unrelated pretraining details. Implement all-equal and mixed-reward group tests and separate algorithmic changes from additional sampling.
- **Required - Course:** [Berkeley CS 185/285 Deep Reinforcement Learning (Spring 2026) - LLM RL Lecture and Homework 4](https://github.com/berkeleydeeprlcourse/homework_spring2026) - Slides are public at https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-N.pdf; current videos are not, and the public Fall 2023 playlist numbers lectures differently. Study Lecture 14 (LLM RL) and the Homework 4 handout: log probabilities, minibatching, advantage normalization, GR-REINFORCE and GRPO on a format task and a math task, plus a GRPO hyperparameter study. It is configured for H100 GPUs on Modal (about 8 GPU hours), so port the code paths to a tiny model on your GPU or run them on pre-generated rollouts.
- **Support - Paper:** [DAPO: An Open-Source LLM Reinforcement Learning System at Scale](https://arxiv.org/abs/2503.14476) - Read Sections 2 and 3: decoupled clipping bounds, dynamic sampling that drops all-equal groups, the token-level loss and overlong reward shaping, and the removal of the KL term. Compare its token-level aggregation with GRPO's per-sequence mean on a fixed group.
- **Support - Paper:** [Understanding R1-Zero-Like Training: A Critical Perspective (Dr. GRPO)](https://arxiv.org/abs/2503.20783) - Read Section 3: the response-length bias of per-sequence normalization and the question-difficulty bias of dividing by the group standard deviation. DAPO keeps the standard deviation that Dr. GRPO removes, so treat the choice as open and test both on a fixed group.
- **Support - Book:** [Build a Reasoning Model (From Scratch) - Chapters 6 and 7](https://www.manning.com/books/build-a-reasoning-model-from-scratch) - Use Chapter 6 (rollouts, rewards, group advantages, sequence log probabilities and the GRPO loss on Qwen3 0.6B) and Chapter 7 (metrics, clipped ratios, the KL term and a format reward) as the smallest runnable GRPO loop. Listing 6.13 is the unclipped loss; the clipped and KL versions come in Chapter 7. Its advantages use the unbiased `torch.std`.
- **Support - Documentation:** [TRL GRPO Trainer](https://huggingface.co/docs/trl/v1.15.0/en/grpo_trainer) - After scratch estimator tests pass, inspect the GRPOTrainer for TRL 1.15.0: its reward-function, generation, loss and logging contracts. Its defaults changed across releases (`loss_type="dapo"` and `beta=0.0` in 1.15.0), so differential-test one batch and record every default you rely on.
- **Support - Practice:** [TensorTonic - GRPO Problems](https://www.tensortonic.com/problems/cs336-l16-grpo-group-advantages) - Solve Normalize GRPO Group Advantages (`cs336-l16-grpo-group-advantages`), Compute a Clipped GRPO Surrogate (`cs336-l16-clipped-grpo-surrogate`) and Compare Sequence and Token Length Normalization (`cs336-l16-grpo-length-normalization-audit`), free problems in the Language Modeling from Scratch plan, as closed-book checks after your own estimator passes.
- **Support - Tutorial:** [Hands-on Modern RL - Chapter 15 GRPO and RLVR](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter18_grpo/grpo-practice-and-mechanism) - Use the GRPO practice and mechanism page and the RLVR page: its group-normalization demo and rule-based reward script run on CPU in seconds. Its TRL examples pin TRL 0.24, whose defaults differ from current releases. Run only a small verifier task and preserve zero-variance, length-hacking and invalid-output cases. Pin commit 9231bab of walkinglabs/hands-on-modern-rl; its `code/chapterNN` folders do not follow the site chapter numbers.
- **Support - Implementation:** [RLHF Book Code - Policy Gradients](https://github.com/natolambert/rlhf-book/tree/1042143366d73ff654727e4d18a1d3a21209c3a3/code) - Use the `code/policy_gradients` package at natolambert/rlhf-book at commit 1042143 as a differential reference after the hand implementation passes (`loss.py` holds the masked means, the GRPO and PPO losses and the $`k_1`$, $`k_2`$, $`k_3`$ KL estimators). Trace every tensor to prompt, completion and policy version and extend the tests with stale-log-prob and mask defects.
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

### Study units

#### U1. Reinforcement learning with verifiable rewards and math, code and structured tasks

**About 4 h** · **Target:** Explain + Implement

Topics: Reinforcement learning with verifiable rewards; Math, code and structured-output task environments

Verifiable tasks let RL train on correctness instead of preference. The reward is code, so its gating and format rules decide what the policy learns.

**You can now**

- Explain why RLVR replaces a learned reward model with a verification function on math, code and structured tasks, and state what the verifier checks.
- Build a boxed-answer and unit-test reward on fixed completions, with all-pass gating and a stated partial-credit rule.
- Compute group-relative advantages from fixed rollout rewards with a stated standard-deviation convention.

**Study**

1. [RLVR and verifiable task rewards](https://rlhfbook.com/c/07-reasoning) (RLHF Book - Reasoning, Synthetic Data, Tools and Evaluation) - The Role of RLVR: verification-function loop, math prime-sum with boxed 77 check and fib unit-test gating with all-pass to 1 else 0 plus a partial-credit variant; RL Training vs Inference-Time Scaling for the train-versus-test compute boundary; Common Practices: offline difficulty filtering with 16 samples and a 20 to 80 percent band (page read 2026-10-14).
2. [MATH subset and the RLVR reward function](https://www.manning.com/books/build-a-reasoning-model-from-scratch) (Build a Reasoning Model (From Scratch) - Chapters 3, 6 and 8) - Chapter 6, Sections 6.1.2, 6.4 and 6.6, printed pp.185-200: 12k MATH training split with MATH-500 excluded, `sample_response` rollouts, `reward_rlvr` with `fallback=None` so boxed format is required. Depth: Run the verifier and reward on CPU with short prompts first. Use your GPU for the GRPO loop with a small group and short completions.
3. [Tulu 3 RLVR stage](https://arxiv.org/abs/2411.15124) (Tulu 3: Pushing Frontiers in Open Language Model Post-Training) - Section 6, RLVR Recipe and Analyses, arXiv:2411.15124v5: SFT then DPO then RLVR with verifiable math and constraint rewards; read the recipe and infrastructure, not the 8B and 70B numbers as targets.

**Focus**

- RLVR pays 1 on verified correct else 0, with all-pass gating for tests. Partial credit is a different estimand, so state which rule is used.
- Boxed format is part of the reward when `fallback=None`. Track format and correctness rewards as separate terms.
- The MATH-500 exclusion prevents train-test leakage. A verifier does not fix contaminated data.
- RLVR revisits the same prompts for hundreds of epochs while SFT uses 1 or 2. Length growth is a side effect, not proof of reasoning.

**Reproduce:** From a blank file, score 5 fixed math completions with boxed extraction plus `grade_answer` and 3 fixed code completions with all-pass unit-test gating. Then compute advantages for rewards `[1.0, 1.0, 0.0, 0.0]` with mean subtraction and unbiased `torch.std` plus `1e-4` to get `[0.8659, 0.8659, -0.8659, -0.8659]`.

**Traps**

- Treating a longer trace as a better trace. Length rises under RLVR by default, so check correctness per token budget.
- Taking the first boxed answer or a number-regex fallback as correct. The book takes the last boxed answer and requires the box when `fallback=None`.
- Porting Listing 6.8 to NumPy with default `ddof=0` and expecting 0.8659. NumPy gives about 1.0 (0.9998 with the same `1e-4`) because the book uses unbiased `torch.std`.

**Practice**

- [Build a Reasoning Model: verifier and RLVR reward on Qwen3 0.6B](https://www.manning.com/books/build-a-reasoning-model-from-scratch) - Chapter 3, Sections 3.4 to 3.7 with Listing 3.11 cases; Chapter 6, Listings 6.6 to 6.8; run the verifier on CPU, then the MATH-subset rollout on your GPU with a small group and short completions. Match the Listing 3.11 grades exactly before running rollouts. Keep MATH-500 held out.

**Stop when:** Your verifier matches Listing 3.11 on every case, your gating and fallback choices are written down, and your hand advantages match the 0.8659 values.

<details>
<summary>Self-test</summary>

1. A fib solution passes 2 of 3 asserts under all-pass gating. What reward does it get?
   - 0. Only all-pass gives 1. Proportional credit is a separate rule with its own gradient.
2. Why does the book set `fallback=None` in `reward_rlvr`?
   - A correct number outside a box then scores 0. Format compliance becomes part of the reward.
3. Compute advantages for rewards `[1.0, 1.0, 0.0, 0.0]` with unbiased standard deviation plus `1e-4`.
   - Mean 0.5 and standard deviation about 0.5774 give `[0.8659, 0.8659, -0.8659, -0.8659]`.
4. Why does RLVR run hundreds of epochs over the same prompts while SFT uses 1 or 2?
   - RLVR reinforces rare correct behaviors into robust ones by revisiting. SFT matches completions. Gains must still be checked on held-out prompts.

</details>

#### U2. Verifier isolation, hidden tests and sparse outcome credit

**About 4 h** · **Target:** Implement

Topics: Executable verifier isolation and adversarial hidden tests; Outcome rewards and sparse terminal credit

The policy optimizes exactly what the verifier pays for. Isolation and scoring rules decide whether higher reward means solved or means gamed.

**You can now**

- Separate visible verifier tests from hidden tests and state what each set can and cannot prove.
- Implement all-pass gating and partial credit on fixed code outputs and show how the rule changes the update.
- Explain sparse terminal credit with a discounted-return example and why the final score cannot name the first error.

**Study**

1. [Boxed extraction, normalization and grading](https://www.manning.com/books/build-a-reasoning-model-from-scratch) (Build a Reasoning Model (From Scratch) - Chapters 3, 6 and 8) - Chapter 3, Sections 3.1 and 3.4 to 3.7, printed pp.58-80: `get_last_boxed` last-box rule, `normalize_text` with `LATEX_FIXES`, SymPy `equality_check` on the simplified difference, `grade_answer` with `split_into_parts`; the tuple case `(14/3,2/3)` versus `(14/3,4/6)` needs the split.
2. [R1-Zero rule-based rewards](https://arxiv.org/abs/2501.12948) (DeepSeek-R1 Technical Report) - Sections 2 and 3, arXiv:2501.12948v2: R1-Zero rule-based accuracy plus format rewards and language-consistency rewards for math, code and logic; read the pipeline as a claim map, not as a run target.
3. [Countdown verifier datasets and scoring](https://cs224r.stanford.edu/material/CS224R_Default_Project_Guidelines.pdf) (Stanford CS224R 2026 LLM RL Default Project - Extension) - Section 1.2.4 verifier-based datasets for RLOO only, Section 1.3.3 rule-based verifier reward, Section 1.4 evaluation with `evaluation/countdown.py` checking format plus arithmetic with multiple samples per prompt and average score plus pass at K.

**Focus**

- The verifier runs outside the policy with frozen tests. Visible tests teach format while hidden tests decide the score.
- All-pass gating pays 1 only when every assert passes. Partial credit pays a per-test share on the same outputs.
- Terminal credit gives one reward to the whole trace. Discounted return with $`G_t = \gamma^{T-t}`$ shrinks early weight with distance, which misattributes early defining errors.
- Format rewards stabilize parsing but can be hacked into fluent wrong answers. Track format and accuracy separately.

**Reproduce:** From a blank file, score 3 fixed code outputs under all-pass gating and under proportional partial credit and show one case where they disagree. Then compute returns for $`r_T = 1`$ with $`\gamma = 0.9`$ at 8, 4, 3 and 1 steps from the end to get 0.43, 0.66, 0.73 and 0.90.

**Traps**

- Letting the policy read verifier code or hidden tests during training. That turns evaluation into training data.
- Averaging format and accuracy into one scalar. A format fix can mask an accuracy drop.
- Treating discounted return as error location. It weights by distance, not by responsibility.

**Practice**

- [Stanford CS224R Default Project: Countdown verifier](https://cs224r.stanford.edu/material/CS224R_Default_Project_Guidelines.pdf) - Section 1.2.4 verifier-based datasets and Section 1.4 evaluation with `evaluation/countdown.py`; implement the format-plus-arithmetic check on fixed completions before any training. Use the public starter as study material under the course honor code. Do not publish solutions. Keep the Qwen2.5-0.5B base fixed.

**Stop when:** Your two scoring rules disagree on a planted partial solution, your hidden set catches it, and your hand returns match 0.43, 0.66, 0.73 and 0.90.

<details>
<summary>Self-test</summary>

1. A solution passes 2 of 3 asserts. What do all-pass and proportional rules pay?
   - 0 and about 0.67. Same outputs give different updates.
2. Why keep hidden tests the policy never sees?
   - Visible tests teach format while hidden tests check generalization. A policy that saw them could memorize answers.
3. With only $`r_T = 1`$ and $`\gamma = 0.9`$, what credit does a step 8 positions back get?
   - About 0.43. That is distance discounting, not causal credit.
4. A trace ends right but step 6 has a missing square. What does the outcome reward reinforce?
   - The whole trace including step 6. That is the sparse-credit problem.

</details>

#### U3. Process rewards, step credit and reasoning traces versus observable answers

**About 4 h** · **Target:** Explain

Topics: Process rewards and step-level credit assignment; Reasoning traces, hidden reasoning and observable answers

One final score cannot say which step failed. Step feedback helps only when steps have stable meaning and errors propagate.

**You can now**

- Contrast outcome and process rewards by input, data format and training signal, and state when steps are worth the cost.
- Explain why hidden thinking tokens are not evidence of reasoning, and name the observable check that would support a claim.
- Describe how PRM scores enter training per step without becoming per-token correctness labels.

**Study**

1. [Outcome versus process rewards](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter20_prm_search/outcome-vs-process) (Hands-on Modern RL - Reasoning, Agentic RL and Safety) - Sections 1 to 4: square-root-of-2 nine-step proof with the step-6 missing square scored 1, $`\text{ORM}(q,o)`$ versus $`\text{PRM}(q,o,i)`$ with final-correctness versus step-correctness data, discounted return with $`\gamma = 0.9`$ giving 0.43, 0.66, 0.73 and 0.90, and the three checks for buying PRM (page read 2026-10-14).
2. [Reasoning research before large RLVR runs](https://rlhfbook.com/c/07-reasoning) (RLHF Book - Reasoning, Synthetic Data, Tools and Evaluation) - Reasoning Research Before OpenAI o1 or DeepSeek R1: STaR and TRICE ground-truth loops, VinePPO with binary GSM8K and MATH rewards, Tulu 3 PPO with binary correctness while keeping broad scores; R1-Zero rule-based accuracy plus format rewards (page read 2026-10-14).
3. [Format rewards and think tokens](https://www.manning.com/books/build-a-reasoning-model-from-scratch) (Build a Reasoning Model (From Scratch) - Chapters 3, 6 and 8) - Chapter 7, Section 7.6, printed pp.256-266: `<think>` format reward, training a model to emit think tokens, and length and format incentives as separate terms.

**Focus**

- ORM maps a prompt plus full response to one scalar. PRM adds a step index and scores that step.
- R1-Zero develops longer self-checking traces from rule-based accuracy plus format rewards alone. Process labels are not required.
- Thinking tokens are sampled text, not observed cognition. Only the extracted answer and its checks carry the claim.
- A PRM score attaches per step or per token group. Sharing a score across tokens in a step is convention, not proof.

**Reproduce:** Closed-book, write $`\text{ORM}(q,o)`$ and $`\text{PRM}(q,o,i)`$ with their data tuples, and retell the square-root-of-2 story: outcome reward 1 for the whole trace despite the step-6 error. Then state the three checks for buying PRM: stable step meaning, propagating errors, and a judge more reliable than the generator.

**Traps**

- Calling a longer thinking trace proof of reasoning. Length and self-check phrases can grow while the answer stays wrong.
- Training on step labels and claiming broad generality. Labels, candidate generator and rerank setup bound the claim.
- Treating a PRM step score as a token correctness certificate. Tokens in one step share the score by convention.

**Practice**

- [Hands-on Modern RL: ORM versus PRM return comparison](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter20_prm_search/outcome-vs-process) - Section 2.1 discounted return with `gamma=0.9` and Section 3 ORM and PRM data formats; recompute the 0.43, 0.66, 0.73 and 0.90 weights by hand and map each token group to its step score. Pin walkinglabs/hands-on-modern-rl at 9231bab. Keep the token counts as scale illustration, not as a selection threshold.

**Stop when:** You can write both reward signatures from memory, retell the step-6 story, and defend a no-PRM decision for short verifiable answers.

<details>
<summary>Self-test</summary>

1. What are the inputs and data rows for ORM versus PRM?
   - ORM takes prompt plus full response with final correctness. PRM adds a step index with step correctness.
2. Why did the square-root-of-2 trace get reward 1 despite the step-6 error?
   - The outcome verifier checks only the conclusion, so the whole trace shares the reward.
3. When is PRM worth its annotation and compute cost?
   - Steps have stable meaning, errors propagate and waste budget, and the step judge beats the generator. Short answers with cheap resampling usually fail this test.
4. Are hidden thinking tokens evidence of how the model reasoned?
   - No. They are generated text. Evidence comes from the extracted answer, verifier checks and held-out behavior.

</details>

#### U4. Inference-time search, self-consistency and train-time versus test-time compute

**About 4 h** · **Target:** Explain + Measure

Topics: Inference-time search, self-consistency and answer aggregation; Train-time learning versus test-time compute

More samples or deeper search raise scores without changing weights. A learning claim must survive a matched inference budget.

**You can now**

- Run greedy, self-consistency and a small search on fixed prompts and report accuracy per token budget.
- Explain why a reasoning gain can come from sampling, search or longer outputs rather than a better policy.
- Design a compute-matched comparison that separates learned behavior from inference-time selection.

**Study**

1. [Inference-time scaling and parallel compute](https://rlhfbook.com/c/07-reasoning) (RLHF Book - Reasoning, Synthetic Data, Tools and Evaluation) - RL Training vs Inference-Time Scaling: repeated sampling with answer extraction, value-guided sampling, and the token-growth correlation warning; Common Practices: parallel test-time compute scaling with majority vote over parallel rollouts (page read 2026-10-14).
2. [Self-consistency over sampled reasoning paths](https://www.manning.com/books/build-a-reasoning-model-from-scratch) (Build a Reasoning Model (From Scratch) - Chapters 3, 6 and 8) - Chapter 4, Section 4.6, printed pp.127-135: sampling diverse completions with temperature and top-p, then majority vote over extracted answers.
3. [Beam search, tree search and answer aggregation](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter20_prm_search/inference-time-search) (Hands-on Modern RL - Reasoning, Agentic RL and Safety) - Sections 2 and 3: fixed-width beam expansion with parallel paths, tree-of-thought backtracking, MCTS selection with `UCB(n)` worked example at parent 100 giving 1.23, 1.25 and 1.96; cost rows from best-of-N with N generations through beam `K` times depth to tree `B^D` (page read 2026-10-14). Depth: Treat the 24-Game GPT-4 percentages as an author-reported illustration, not as your target. Recompute the UCB numbers by hand.

**Focus**

- Self-consistency votes over answers, not over traces. Shared wrong prefixes can win the vote.
- Search reuses prefixes and prunes bad paths early. Best-of-N pays full cost per sample with no reuse.
- Report tokens, verifier calls and latency beside accuracy. A higher score at 10 times the tokens is a budget effect until proven otherwise.
- RLVR training often lengthens outputs by default. Separate length growth from policy improvement.

**Reproduce:** Closed-book, recompute the three UCB values for parent visits 100 with `c = 1.414`: child A with `Q = 0.8` and `N = 50` gives 1.23, child B with 0.7 and 30 gives 1.25, child C with 0.6 and 5 gives 1.96. Then state the cost order: greedy 1 call, best-of-N N calls, beam `K` times depth for one continuation per beam per step (`2K` times depth with the chapter's `expansions=2`), tree `B^D`.

**Traps**

- Comparing a searched score against a greedy baseline and calling the gap learned. Match samples and tokens first.
- Letting the vote see the test labels through prompt tuning. Fix prompts before sampling.
- Reading parallel breadth as free speedup. It shortens waiting time with more hardware but not total compute.

**Practice**

- [Build a Reasoning Model: self-consistency on fixed MATH prompts](https://www.manning.com/books/build-a-reasoning-model-from-scratch) - Chapter 4, Sections 4.4 to 4.6, printed pp.103-135: temperature and top-p sampling plus self-consistency vote; compare greedy against majority vote over 5 samples on 10 fixed prompts with tokens counted. Run on CPU with Qwen3 0.6B and short completions. Report accuracy and total tokens for each method.

**Stop when:** Your UCB recomputation matches 1.23, 1.25 and 1.96, and your greedy-versus-vote table reports accuracy with tokens on the same 10 prompts.

<details>
<summary>Self-test</summary>

1. Why does best-of-N waste compute relative to beam search on shared prefixes?
   - Best-of-N regenerates each sample from scratch. Beam search expands shared prefixes once and scores continuations.
2. Child C has the lowest Q but the highest UCB in Reproduce. Why?
   - Its visit count 5 is small, so the exploration bonus dominates. UCB picks it to reduce uncertainty.
3. A distilled model matches the searched teacher. Is that proof the student reasons?
   - No. It proves the student imitates selected outputs. Test the student greedy on held-out tasks at a fixed token budget.
4. What must a train-versus-test compute comparison fix?
   - Prompts, samples per prompt, tokens per sample, verifier calls and decoding. Then attribute the remaining gap.

</details>

#### U5. Rejection fine-tuning, rollout and on-policy distillation and reasoning-length control

**About 5 h** · **Target:** Explain + Implement

Topics: Rejection fine-tuning and rollout distillation; On-policy teacher-student distillation vocabulary; Reasoning length, budget control and invalid traces

Filtered rollouts teach format and skill without RL. Distillation copies selected behavior, so its filters and length rules are the method.

**You can now**

- Run a generate, filter by correctness and fine-tune loop on fixed rollouts and state how it differs from a policy gradient.
- Contrast offline sequence distillation with on-policy distillation by sampling distribution and KL direction.
- Control reasoning length with budgets and invalid-trace handling, and report length beside accuracy.

**Study**

1. [STaR generate, filter and fine-tune loop](https://arxiv.org/abs/2203.14465) (STaR: Bootstrapping Reasoning With Reasoning) - Sections 2 and 3, arXiv:2203.14465v2: rationale generation filtered by correctness, fine-tuning outer loop, and rationalization by giving the correct answer for failed problems.
2. [From offline to on-policy teacher-student distillation](https://rlhfbook.com/c/12-synthetic-data) (RLHF Book - Reasoning, Synthetic Data, Tools and Evaluation) - The Path to On-Policy, Teacher-Student Distillation: sequence-level distillation with point-mass approximation, offline forward KL versus on-policy reverse KL, exposure bias with $`O(\epsilon L^2)`$ compounding as an analogy (the page calls the discrete-action DAgger bound an analogy, not a guarantee for token-level KL), multi-teacher mixture weights (page read 2026-10-14). Depth: Read the KL direction and sampling-distribution argument. Skip the multi-teacher mixture math on a first pass.
3. [Distilling reasoning into Qwen3 0.6B](https://www.manning.com/books/build-a-reasoning-model-from-scratch) (Build a Reasoning Model (From Scratch) - Chapters 3, 6 and 8) - Chapter 8, Sections 8.2 to 8.7, printed pp.271-295: DeepSeek-R1 teacher traces with `<think>` formatting, filtering 12000 to 6695 at 2048 tokens, train 6670 with val 25, answer-only cross-entropy 1.68; teacher 91.2 percent on MATH-500 (90.6 percent on the 12000-example distill set) versus base 15.2 percent on MATH-500. Depth: Run the 10-example demo on CPU or your GPU first. Use `max_len` 1024 or 512 for the full run on a small GPU.

**Focus**

- STaR filters rollouts by correctness and fine-tunes with cross-entropy. No importance ratio or advantage enters.
- Offline distillation matches the teacher on teacher prefixes with forward KL. On-policy distillation samples student prefixes with reverse KL.
- Answer-only loss trains teacher answer tokens, not prompt tokens. Length filtering at 2048 decides feasibility on small hardware.
- Invalid traces need an explicit policy: drop, finish with 0, or repair. Each choice changes the estimand.

**Reproduce:** Closed-book, write the STaR loop in three lines: generate rationales, keep correct ones, fine-tune. Then state the distillation numbers: 12000 built, 5305 removed at 2048, train 6670 with val 25, answer-only loss 1.68, teacher 90.6 percent on the distill set.

**Traps**

- Calling rejection fine-tuning RL. It has no policy gradient, only filtered supervised updates.
- Sharing a tokenizer assumption silently. Per-token teacher feedback needs matching vocabularies.
- Reporting distilled accuracy without length. A longer student can win by budget, not by skill.

**Practice**

- [Build a Reasoning Model: distillation training loop](https://www.manning.com/books/build-a-reasoning-model-from-scratch) - Chapter 8, Listings 8.4 to 8.7 with `build_examples`, `filter_examples_by_max_len` and `train_distillation`; run the 10-example demo for 2 epochs at `lr=5e-6` with `grad_clip_norm=1.0`, then the filtered full run. As one example, the full run takes about 3 hours and 5 minutes on a DGX Spark and uses roughly 15 GB at length 2048. Halve the length twice on your machine before blaming your GPU.

**Stop when:** Your STaR loop runs on fixed rollouts, your run of the book's distillation code reproduces the 6695 filtered count on the author's data, and every accuracy you report carries its length.

<details>
<summary>Self-test</summary>

1. How does STaR differ from a GRPO update on the same rollouts?
   - STaR keeps correct traces and fine-tunes with cross-entropy. GRPO computes group advantages and takes a policy gradient step with ratios.
2. What changes between offline and on-policy distillation?
   - The sampling distribution and KL direction. Offline uses teacher prefixes with forward KL. On-policy uses student prefixes with reverse KL.
3. Why filter at 2048 tokens and keep val at 25?
   - Length decides memory feasibility: 5305 of 12000 exceed 2048. A tiny val set keeps the loop fast; MATH-500 is the real check.
4. A trace has no boxed answer. What are the three handling options?
   - Drop it, keep it with reward 0, or repair the format. Each changes what the update estimates.

</details>

#### U6. Multi-turn agent state, tool-call actions, transitions and delayed credit

**About 5 h** · **Target:** Explain + Implement

Topics: Multi-turn state, observations and tool-call actions; Environment transitions, tool results and terminal conditions; Trajectory-level rewards and delayed credit for agents

Tool answers arrive over turns, but the reward arrives at the end. The trajectory schema and mask decide what the gradient blames.

**You can now**

- Formulate a tool task as state, tool-call actions, observations and terminal conditions, and mark what the policy controls.
- Implement a multi-turn rollout loop with an action mask that keeps observation tokens out of the loss.
- Explain trajectory-level rewards with delayed credit and why every step shares one outcome by default.

**Study**

1. [Tool use and multi-step tool reasoning](https://rlhfbook.com/c/13-tools) (RLHF Book - Reasoning, Synthetic Data, Tools and Evaluation) - Interweaving Tool Calls in Generation: JSON tool schema with the movie-search example and the fib 50 code-execution trace giving 12586269025; Multistep Tool Reasoning: agent trajectory with single terminal reward; Implementation Details: masking tool outputs from the loss (page read 2026-10-14).
2. [Multi-turn agent training dynamics](https://arxiv.org/abs/2504.20073) (RAGEN: Understanding Self-Evolution in LLM Agents via Multi-Turn Reinforcement Learning) - Sections 3 to 5, arXiv:2504.20073v2: StarPO trajectory formulation, Echo Trap with reward cliffs and gradient spikes, trajectory filtering and critic stabilization.
3. [From-scratch agentic training system](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter22_agentic/build-agentic-training-system) (Hands-on Modern RL - Reasoning, Agentic RL and Safety) - Sections 19.10.4 to 19.10.8: `SandboxEnv` with subprocess plus timeout, `Policy` with per-token ratio plus clip plus KL, `RolloutWorker` chaining generate to execute to observe, `GRPOAgentTrainer` with group advantage and turn-only loss on Qwen2.5-0.5B (page read 2026-10-14). Depth: Runs on CPU as written. Read the production-gap table for vLLM, FSDP and Ray, but do not build them here.

**Focus**

- State holds the prompt plus history. Actions are model tokens. Observations are tool outputs the policy does not control.
- The loss covers action tokens only. Training on observation tokens teaches the model to predict tool content.
- One terminal reward grades the whole trajectory. Credit assignment decides which turns the gradient moves.
- Bound turns with `max_turns` and a finish action. Unbounded loops hang on the first bad tool call.

**Reproduce:** From a blank file, define a 2-turn tool trajectory with prompt, turn contexts, action tokens, one tool observation and a final reward. Mark exactly which tokens enter the loss and show that an unmasked observation term trains the model to emit tool text.

**Traps**

- Averaging the loss over observation tokens. Mask them before any mean.
- Treating a tool error string as a policy mistake. It is an observation; the mistake is the action that caused it.
- Ending the episode on timeout without recording it. Timeouts are terminal data, not missing data.

**Practice**

- [Hands-on Modern RL: agentic training system from scratch](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter22_agentic/build-agentic-training-system) - Sections 19.10.4 to 19.10.8 with `environment.py`, `policy.py`, `rollout_worker.py`, `trainer.py` and `run.py` on Qwen2.5-0.5B-Instruct; complete the action-mask and multi-update extension exercises. Pin walkinglabs/hands-on-modern-rl at 9231bab. The subprocess sandbox is teaching code, not a security boundary.

**Stop when:** Your loop records prompt, turns, observations and terminal reward, your mask test proves observations carry no loss, and a timeout ends an episode cleanly.

<details>
<summary>Self-test</summary>

1. Which tokens enter the loss in a tool trajectory?
   - Model-generated action tokens only. Prompt and tool observations condition later turns but carry no loss.
2. Why is the tool state only partially observed?
   - The model sees history plus tool outputs, not the full environment state. Hidden state must be inferred from observations.
3. A 7-turn task fails at turn 1 but succeeds at turns 2 to 7. What does a trajectory reward do?
   - It scores the whole trajectory once, so the good later turns share the failure unless step credit is added.
4. What stops an agent that keeps calling tools forever?
   - `max_turns` plus a finish action and a timeout that ends the episode with a recorded outcome.

</details>

#### U7. Sandboxes, deterministic replay and tool-error, timeout and retry semantics

**About 4 h** · **Target:** Implement

Topics: Sandbox, reset, deterministic replay and side-effect boundaries; Tool-error, timeout, retry and duplicate-action semantics

Agents run code the model wrote. Without isolation and replay rules, one bad call hangs training or corrupts results.

**You can now**

- Implement a sandbox step with reset, timeout and error observations, and state its side-effect boundary.
- Replay a fixed tool trajectory deterministically from recorded seeds and tool results.
- Define timeout, retry and duplicate-action rules so retried calls cannot double-count reward.

**Study**

1. [Minimal sandbox with timeout](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter22_agentic/build-agentic-training-system) (Hands-on Modern RL - Reasoning, Agentic RL and Safety) - Sections 19.10.3 to 19.10.4: `SandboxEnv` with subprocess plus timeout, `TIMEOUT` ending the episode, unknown actions returning an error observation without ending, outputs truncated to 500 chars, stateless `reset`; minimal executor is not a security boundary (page read 2026-10-14).
2. [Tool-output masking and multi-turn formatting](https://rlhfbook.com/c/13-tools) (RLHF Book - Reasoning, Synthetic Data, Tools and Evaluation) - Implementation Details: masking tool outputs from the loss, splitting turns per tool call, MCP JSON-RPC primitives, chat-template tokenization, reasoning-token continuity choices, schema conformance with constrained decoding (page read 2026-10-14).
3. [Sandboxed code rewards in veRL](https://github.com/verl-project/verl/blob/8718ca30a3f002f93b7c4fd99b9b2506718681bc/docs/examples/sandbox_fusion_example.rst) (veRL) - SandboxFusion example at commit 8718ca3: code reward through a `run_code` endpoint with the prime reward manager; read the path a rollout takes from generation through reward.

**Focus**

- Execute tool code in a separate process with a timeout. Never run it in the training process.
- Record seeds plus tool results per turn. Replay reads the record, never re-executes.
- Retries carry the same call identity. A duplicate execution must not create a second reward event.
- Truncate or paginate tool outputs before they enter context. Long outputs eat the window first.

**Reproduce:** From a blank file, implement `step` with `execute_code` and `finish` plus `reset`, and show that `TIMEOUT` ends the episode, unknown actions return an error observation without ending, and outputs truncate to the last 500 chars.

**Traps**

- Calling subprocess without a timeout. One infinite loop hangs the whole rollout.
- Retrying a timed-out call as a new call. Side effects can run twice while the reward counts once.
- Re-executing tools during replay. Nondeterministic outputs break equivalence with the recorded trajectory.

**Practice**

- The section mini-project covers this: sandbox reset, deterministic replay with seeded tool results, and timeout, retry and duplicate-action accounting.

**Stop when:** Your sandbox ends a planted infinite loop on timeout, replays a recorded trajectory byte-identically, and deduplicates a retried call.

<details>
<summary>Self-test</summary>

1. Why is subprocess plus timeout not a security boundary?
   - It limits wait time in another process but does not isolate files or network. Production needs containers or MicroVMs.
2. A code call times out, then the retry succeeds. How many reward events is that?
   - One, under the original call identity. The timeout observation and the retry result belong to the same attempt.
3. What does deterministic replay need beyond the seed?
   - Recorded tool results per turn. Re-execution can differ, so replay reads the record.
4. Why mask tool outputs from the loss?
   - They are environment text, not model actions. Training on them teaches the model to emit tool content.

</details>

#### U8. Actor, rollout, verifier and learner roles, synchronous and asynchronous loops and staleness

**About 5 h** · **Target:** Explain + Measure

Topics: Actor, rollout worker, reward or verifier and learner roles; Synchronous versus asynchronous rollout-update loops; Policy broadcast, rollout policy version and staleness

Decoupling rollout from training buys throughput but sells freshness. Version stamps decide whether a gradient still describes the current policy.

**You can now**

- Name the actor, rollout, verifier and learner roles and state which state each owns.
- Contrast synchronous and asynchronous rollout-update loops by weight sync, queueing and staleness.
- Measure policy lag on a tiny loop and state when updates stop being on-policy.

**Study**

1. [Hybrid controller and worker roles](https://github.com/verl-project/verl/blob/8718ca30a3f002f93b7c4fd99b9b2506718681bc/docs/hybrid_flow.rst) (veRL) - Single-controller design at commit 8718ca3: controller on one process with generator, actor and critic workers on many; `ActorRolloutRef` managing actor plus rollout plus reference with colocated NCCL reshard; `TrainingWorker` for critic and reward.
2. [Async generation and staleness control](https://github.com/verl-project/verl/blob/8718ca30a3f002f93b7c4fd99b9b2506718681bc/docs/advance/fully_async.md) (veRL) - Fully async design at commit 8718ca3: sample-by-sample rollouter with message queue, `staleness_threshold` 0 for sync and above 0 for async, NCCL parameter sync, rollout log-prob correction with bypass mode.
3. [Distributed RL training and engine mismatch](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter16_llm_rl_industrial/distributed-sync) (Hands-on Modern RL - Reasoning, Agentic RL and Safety) - Behavior policy versus recorded old policy: floating point, kernels and routing make them diverge, the ratio goes wrong, and clipping cannot fix it; 70B full state about 1.22TB versus ZeRO-3 plus checkpointing about 30GB; async LlamaRL and AReaL patterns (page read 2026-10-14). Depth: Read for the mechanism and thresholds. Do not build multi-GPU runs here.

**Focus**

- The controller owns versions and dispatch. Rollout owns generation. The verifier owns scores. The learner owns weights.
- Synchronous loops stamp one version per batch. Async loops mix versions, so each trajectory carries its rollout version.
- Staleness is the gap between rollout weights and learner weights. Past a threshold the data is off-policy.
- Engine mismatch is not staleness. Two engines can disagree on the same version, and no clip fixes that.

**Reproduce:** Closed-book, draw the rollout to reward to update loop with four roles and label where the policy version is stamped, where weights sync, and where staleness enters. Then state the mismatch rule: behavior policy versus recorded old policy makes the ratio wrong, and clipping cannot fix it.

**Traps**

- Treating colocated sync as free. Broadcast and reshard still cost time and need measuring.
- Calling async data on-policy. Mixed versions need importance handling or a freshness bound.
- Recomputing old log probabilities from the newer policy. Old log probabilities are immutable rollout data.

**Practice**

- The section mini-project covers this: actor, rollout, verifier and learner role separation with policy-version stamping and staleness records.

**Stop when:** You can name each role owner from memory and your loop diagram shows version stamps, sync points and the staleness bound.

<details>
<summary>Self-test</summary>

1. Which role owns the reward score?
   - The verifier or reward worker. The learner must not recompute scores from a newer model.
2. What changes between sync and async loops?
   - Weight sync timing and queueing. Sync uses one version per batch; async overlaps generation with updates and mixes versions.
3. What does a staleness threshold of 0 mean?
   - Fully synchronous updates. Above 0 allows bounded async lag with correction.
4. Two engines compute different log probabilities for the same version. Does PPO clipping fix the ratio?
   - No. Clipping limits movement but cannot reconcile probabilities from different engines.

</details>

#### U9. Colocated versus disaggregated generation, batching, backpressure and starvation

**About 4 h** · **Target:** Explain + Measure

Topics: Colocated versus disaggregated generation and training; Generation batching, backpressure and learner starvation

Batching and placement decide throughput. A fast generator with a full queue still starves the learner.

**You can now**

- Contrast colocated and disaggregated generation by memory sharing, weight sync and failure scope.
- Measure batched versus single-example generation in wall time and memory on a tiny workload.
- Explain backpressure and starvation with queue evidence from a rollout-update loop.

**Study**

1. [Batched versus single-example execution](https://www.manning.com/books/build-a-reasoning-model-from-scratch) (Build a Reasoning Model (From Scratch) - Chapters 3, 6 and 8) - Appendix E, Sections E.1 to E.8, printed pp.365-376: latency versus throughput, left padding with attention masks, batched MATH-500 evaluation, batched GRPO rollouts with `rlvr_grpo_original_no_kl_batched.py`, Table E.1 wall-time and memory rows.
2. [Colocated versus disaggregated rollout](https://github.com/verl-project/verl/blob/8718ca30a3f002f93b7c4fd99b9b2506718681bc/docs/advance/one_step_off.md) (veRL) - One-step-off design at commit 8718ca3: colocated hybrid engine sharing GPUs with NCCL reshard versus disaggregated rollout with explicit rollout resources and tensor-by-tensor broadcast; overlapped generation with `GenerationBatchFuture`.
3. [Generation throughput and queue signals](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter16_llm_rl_industrial/distributed-sync) (Hands-on Modern RL - Reasoning, Agentic RL and Safety) - Generation versus memory: PagedAttention with continuous batching and prefix caching, ZeRO stages with checkpointing cost, bottleneck thresholds for rollout share, sync share and communication share (page read 2026-10-14). Depth: Read the thresholds as diagnosis signals. Do not run multi-GPU systems here.

**Focus**

- Colocated shares GPUs and syncs fast with NCCL. Disaggregated separates resources and pays explicit transfer.
- Batching is a throughput optimization, not a universal speedup. Small CPU models can gain little after padding overhead.
- Backpressure means the rollout queue is full and the generator must wait. Starvation means the learner queue is empty.
- Table E.1 shows the pattern on H100 total time: batched MATH-500 cuts 90 to 16 minutes (DGX Spark 174 to 108 minutes) while distillation batching moves only 10 to 9 minutes.

**Reproduce:** Closed-book, state the 70B full-state memory sum at about 1.22TB (16 bytes per parameter for BF16 weights and gradients plus FP32 master weights and Adam moments, plus about 100GB of activations) and the reduction path through ZeRO-3 plus checkpointing to about 30GB per 80GB H100. Then predict which side starves when tool latency dominates generation.

**Traps**

- Expecting batching to speed up every device. Padding and mask bookkeeping can erase the gain on small setups.
- Sizing queues by generator speed alone. Verifier throughput and update time set the sustainable rate.
- Treating disaggregation as pure win. Separate resources add transfer, scheduling and failure scope.

**Practice**

- [Build a Reasoning Model: batched generation and GRPO rollouts](https://www.manning.com/books/build-a-reasoning-model-from-scratch) - Appendix E, Sections E.4 and E.6 with `rlvr_grpo_original_no_kl_batched.py` and `distill_batched.py` (check the repository README for the exact flags); compare single-example versus batched wall time and peak memory on your machine. Start with 2 prompts on CPU or your GPU. Batching targets throughput; record both time and memory.

**Stop when:** Your batched-versus-single table shows time and memory on the same workload, and you can name the bottleneck from queue evidence.

<details>
<summary>Self-test</summary>

1. When does colocated beat disaggregated?
   - Small jobs with fast NCCL reshard and one failure scope. Large or tool-heavy rollouts favor separation.
2. The rollout queue is full while the learner is busy. What is that?
   - Backpressure on the generator. Slow or drop intake; do not grow the queue without bound.
3. The learner queue stays empty while rollouts trickle in. What is that?
   - Learner starvation. Generation or verification is the bottleneck, not the update.
4. On the author's H100, batched evaluation cut 90 to 16 minutes but batched distillation barely moved. Why might that pattern appear, and what profile would confirm it?
   - Evaluation parallelizes independent prompts well. Distillation may already be bound elsewhere, so batching adds padding without removing the bottleneck. A per-stage time and memory profile on your machine would confirm which.

</details>

#### U10. Checkpoint and sampler recovery, retry deduplication and failed-rollout accounting

**About 4 h** · **Target:** Implement

Topics: Checkpoint, rollout, optimizer and sampler recovery; Retry deduplication and failed-rollout accounting

Rollouts fail, time out and retry. Recovery decides whether a restart continues the same study or starts a new one silently.

**You can now**

- Write a recovery record with model, optimizer, sampler and rollout manifest fields and a resume rule.
- Deduplicate retried rollouts by call identity so one attempt counts once.
- Retain every failed rollout with its reason and keep it inside budgets and metrics.

**Study**

1. [Saving and evaluating checkpoints](https://www.manning.com/books/build-a-reasoning-model-from-scratch) (Build a Reasoning Model (From Scratch) - Chapters 3, 6 and 8) - Chapter 6, Section 6.12, printed pp.220-224: loading and evaluating saved model checkpoints after the RLVR loop.
2. [Checkpoint engine and weight sync paths](https://github.com/verl-project/verl/blob/8718ca30a3f002f93b7c4fd99b9b2506718681bc/docs/workers/engine_workers.rst) (veRL) - Engine workers at commit 8718ca3: `ActorRolloutRefWorker` with checkpoint engine, colocated sync through per-tensor NCCL transfer versus disaggregated async send through the checkpoint engine.
3. [Production gaps in fault tolerance](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter22_agentic/build-agentic-training-system) (Hands-on Modern RL - Reasoning, Agentic RL and Safety) - Section 19.10.9 gaps table: minimal version has no fault tolerance; production needs heartbeat monitoring, auto-restart and checkpoint recovery with distributed trajectory storage (page read 2026-10-14).

**Focus**

- Checkpoint model, optimizer, sampler cursor plus RNG, and the rollout manifest together. One alone cannot resume.
- Reject resume under a changed configuration. New prompts, filters or versions start a new study.
- Retries share the original call identity. Deduplicate before scoring and updating.
- Failed rollouts stay counted with reasons: timeout, invalid output, verifier error. Deleting them biases every rate.

**Reproduce:** From a blank file, write the recovery record fields and the resume rule. Then show a retried tool call counted once under its call identity and a failed rollout retained with its reason inside the denominator of every rate.

**Traps**

- Resuming from a model checkpoint while resetting the sampler. Prompts repeat or skip silently.
- Counting a retried success without its failed first attempt. Utilization and reward rates both shift.
- Publishing only complete shards. Unpublished work must be verified or rebuilt before use.

**Practice**

- The section mini-project covers this: checkpoint and sampler recovery with retry deduplication and failed-rollout accounting.

**Stop when:** A killed and resumed run reproduces ordered IDs exactly, a retried call counts once, and every failure carries a reason.

<details>
<summary>Self-test</summary>

1. What must a rollout checkpoint contain?
   - Model and optimizer state, sampler cursor plus RNG, prompt versions, rollout manifest with call identities, and config hash.
2. The config changed after a crash. Resume or restart?
   - Restart as a new study. Resume only under identical configuration.
3. A call times out then succeeds on retry. How is it recorded?
   - One attempt identity with two events: timeout observation plus final result. It counts once in every rate.
4. Why keep failed rollouts in the manifest?
   - Dropping them inflates success and hides verifier and timeout costs. Failures are part of the estimand.

</details>

#### U11. Prompt curricula, rollout and verifier throughput and total compute accounting

**About 4 h** · **Target:** Measure

Topics: Prompt curriculum, filtering and evolving data distributions; Rollout tokens per second, verifier throughput and update utilization; Sample, inference, training and total compute accounting

Curricula decide which prompts teach. Throughput decides which stage binds. Both change the study if they change mid-run.

**You can now**

- Build a prompt curriculum with offline filtering and online scheduling, and version every distribution change.
- Measure rollout tokens per second, verifier throughput and update utilization from a tiny run.
- Account total compute across sampling, inference, verification and training with failed work included.

**Study**

1. [Difficulty filtering and training curricula](https://rlhfbook.com/c/07-reasoning) (RLHF Book - Reasoning, Synthetic Data, Tools and Evaluation) - Common Practices in Training Reasoning Models: offline difficulty filtering with 16 samples and a 20 to 80 percent band; per-batch online filtering with curricula and data schedulers saving harder problems for later (page read 2026-10-14).
2. [Fixed benchmark splits and decoding budgets](https://rail.eecs.berkeley.edu/deeprlcourse/static/misc/llm_rl_default_final_project.pdf) (Berkeley CS 185/285 Deep Reinforcement Learning (Spring 2026) - LLM RL Default Final Project) - Sections 3 and 4: WildChat splits with 4744 train plus 256 test items in each of the prefs and gen splits, 128-prompt public eval, deterministic decoding with temperature 0, token budgets of 700 prompt tokens with 256 generation tokens and 512 scoring tokens, primary win rate versus the frozen base.
3. [Industrial post-training loop and data feedback](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter16_llm_rl_industrial/industrial-post-training) (Hands-on Modern RL - Reasoning, Agentic RL and Safety) - Post-training loop in six stages from target definition through failure feedback; SWE-bench style task conditions with runtime limits; routing each failure back to its cause instead of discarding (page read 2026-10-14).

**Focus**

- Filter offline to prompts the starting model solves sometimes. All-correct and all-wrong groups carry no gradient.
- Version prompts, filters and schedules together. A mid-run curriculum change is a new distribution.
- Utilization is consumed over produced trajectories. Dropped zero-variance groups still cost tokens.
- Total compute sums sampling, inference, verification and training. Failed and filtered work stays in the sum.

**Reproduce:** From fixed numbers with 100 prompts, group size 4 and mean length 512, compute 400 produced rollouts and 204800 produced tokens. With 20 percent all-equal groups dropped, show 320 consumed rollouts, utilization 0.8, and state how the dropped groups change the estimand.

**Traps**

- Filtering on test prompts. The curriculum must never see held-out tasks.
- Counting only consumed tokens. Produced, retried and failed tokens are real cost.
- Tuning the schedule against final evaluation. Freeze the curriculum before the clean run.

**Practice**

- The section mini-project covers this: prompt curriculum with filtering, rollout and verifier throughput, update utilization and total compute accounting.

**Stop when:** Your curriculum versions every change, your utilization divides consumed by produced on the same run, and your compute sum includes failed work.

<details>
<summary>Self-test</summary>

1. Why keep only prompts solved 20 to 80 percent of the time?
   - Groups with no variance give zero advantage and no gradient. The band keeps prompts that still teach.
2. What is update utilization?
   - Consumed trajectories over produced trajectories. Dropped groups lower it while still costing tokens.
3. What enters total compute?
   - Sampling, inference, verification and training tokens plus time, including failed, retried and filtered work.
4. A curriculum changes mid-run. What must happen?
   - Version it as a new distribution with its own records. Do not merge its metrics with the old one.

</details>

#### U12. Independent reasoning, capability, safety and agent evaluation, and reward hacking

**About 4 h** · **Target:** Measure

Topics: Independent reasoning, capability, safety and agent evaluation; Reward hacking, specification gaming and held-out environment shifts

Training reward is a proxy. Independent tasks, held-out shifts and attack tests decide whether the behavior is real.

**You can now**

- Evaluate a reasoning policy with an independent harness kept separate from training rewards and prompts.
- Plant verifier and judge attacks and show which ones the current evaluator accepts.
- Explain a reward-hacking case with training versus held-out evidence and a rollback rule.

**Study**

1. [Over-optimization and proxy failure](https://rlhfbook.com/c/14-over-optimization) (RLHF Book - Reasoning, Synthetic Data, Tools and Evaluation) - Managing Proxy Objectives: Goodhart shape with training reward climbing while downstream peaks and declines, verbosity and sycophancy examples; Quantitative Over-Optimization: train versus test reward split failing near 150K samples with KL distance on the axis (page read 2026-10-14).
2. [Independent evaluation and contamination](https://rlhfbook.com/c/16-evaluation) (RLHF Book - Reasoning, Synthetic Data, Tools and Evaluation) - Why Many External Comparisons Are Unreliable: 0.25 to 1.5 point std at fixed setup with prompt and sampling effects larger; Contamination: 8-gram Tulu 3 overlaps including UltraFeedback with TruthfulQA and NuminaMath with MATH; Agentic Evaluations: harness plus sandbox components (page read 2026-10-14).
3. [Reward-hacking probes and data flywheel](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter15_rlhf/extended-practice) (Hands-on Modern RL - Reasoning, Agentic RL and Safety) - Extended practice with reward-hacking probes through the `flawed_reward` plus `reward_hacking_report` experiment and the failure-to-data flywheel: route each failure back to its cause (page read 2026-10-14).

**Focus**

- Training reward cannot be the release metric. Freeze an independent harness with its own prompts, versions and judges.
- Attack with hardcoded answers, length and style hacks, and leaked tests. Record which attacks score.
- Judge bias (position, length, identity, self-preference) is measured with swapped-order and blinded pairs, not assumed away.
- Contamination is checked with overlap probes plus perturbation sets. A no-hit report is bounded, not proof.

**Reproduce:** From a blank file, plant three attacks on a fixed verifier: a hardcoded answer, a length hack, and a leaked test. Show which the verifier accepts. Then draw the over-optimization shape: training reward climbing while held-out quality peaks and declines.

**Traps**

- Hillclimbing on the public set and reporting it as generalization. Hold out tasks the curriculum never saw.
- Tuning prompts until the score moves, then comparing against untuned baselines. Fix prompts across methods.
- Reading a judge win rate as capability. Blind the judge, swap orders, and keep a human-reviewed sample.

**Practice**

- [Hands-on Modern RL: reward-hacking probe set](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter15_rlhf/extended-practice) - Reward-hacking probes with the `flawed_reward` plus `reward_hacking_report` experiment on fixed completions: length, style and hardcoded-answer attacks with accepted-or-rejected verdicts per attack. Keep one hacked regime with its postmortem for the section mini-project. Pin walkinglabs/hands-on-modern-rl at 9231bab.

**Stop when:** Your probe set accepts at least one planted hack, your held-out shift moves the score, and your report names the rollback rule.

<details>
<summary>Self-test</summary>

1. What is the over-optimization shape?
   - Training reward keeps climbing while held-out quality peaks then declines. The proxy diverged from the goal.
2. Why test on a held-out environment shift, not just held-out prompts?
   - Specification gaming survives prompt splits when the environment stays fixed. Shifts expose hacks tied to tool or task setup.
3. How do you audit a judge for position bias?
   - Swap answer order on the same pairs with blinded identities and compare win rates. A biased judge follows position.
4. An 8-gram probe finds no overlap. Is the model clean?
   - Not proven. Probes miss paraphrases and number changes. Add perturbation sets and report the bound.

</details>

#### U13. Clean reproduction and a prespecified objective, reward or system extension

**About 4 h** · **Target:** Measure

Topics: Clean reproduction and prespecified objective, reward or system extension

A result that needs its own author and machine to appear is not a result. Clean reruns plus one fair extension close the section.

**You can now**

- Reproduce a verifiable RL result from a clean checkout within a stated seed tolerance.
- Prespecify one objective, reward or system extension with its falsification rule before running it.
- Retain the negative or unstable regime and state which assumption failed.

**Study**

1. [Countdown implementation plus extension menu](https://cs224r.stanford.edu/material/CS224R_Default_Project_Guidelines.pdf) (Stanford CS224R 2026 LLM RL Default Project - Extension) - Sections 1.3 to 1.4: SFT with loss on response tokens only, IPO with the SFT model as reference, RLOO with the rule-based verifier, sampling multiple responses per prompt with average score plus pass at K; Section 5 extension menu with off-policy sampling, test-time inference, exploration, self-play and tool reasoning; milestones SFT May 1, IPO plus RLOO May 22, poster June 3, report June 8.
2. [Final integration requirements](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-3/llm-post-training-laboratory.md) (LLM Post-Training Laboratory - Final Integration) - Milestones C, D and F: fixed-rollout plus group edge-case tests, failure injections including stale log probabilities, ratio direction, verifier loopholes and policy lag, frozen blinded clean plus adversarial plus shift evaluation with clean reproduction and one prespecified extension.
3. [RL checkpoint pass clauses](https://github.com/saisandeshk/Roadmap-Final/blob/main/checkpoints/reinforcement-learning.md) (Reinforcement Learning Checkpoint) - Debug and measure plus Pass condition: matched-budget comparison, external evaluation with reward-hacking controls, strong baselines, negative evidence, and sample, compute and system boundaries.

**Focus**

- Clean means a fresh checkout, fixed versions and no tuned prompts. State the seed tolerance before running.
- Prespecify the extension, its baseline and the result that would falsify it. Extensions are graded on method and rigor, not on SOTA.
- Keep the Qwen2.5-0.5B base fixed across SFT, IPO and RLOO. A model change is a new study.
- Retain unstable and failed runs with their records. A missing negative regime is a missing result.

**Reproduce:** From a clean checkout, reproduce the SFT baseline score inside the handout's 5 percent margin for sampling variation. Then prespecify one extension with its baseline, budget and falsification rule before running it.

**Traps**

- Tuning the extension on the test set. Freeze prompts and the harness first.
- Sweeping checkpoints and reporting the best. Fix the selection rule before evaluation.
- Dropping the hacked or collapsed run. The postmortem needs its records.

**Practice**

- [Stanford CS224R Default Project: SFT plus IPO plus RLOO with one extension](https://cs224r.stanford.edu/material/CS224R_Default_Project_Guidelines.pdf) - Sections 1.3 to 1.4 with the SFT, IPO and RLOO implementations and `evaluation/countdown.py`; thresholds 0.25, 0.35 and 0.45 with a 5 percent grading margin for sampling variation, plus average score and pass at K; Section 5 for the one extension. Use the public starter as study material under the course honor code. Do not publish solutions. Run reduced on your GPU with fewer prompts and smaller groups; full runs need cloud credit.

**Stop when:** A clean rerun lands inside the 5 percent margin and your prespecified extension reports its verdict with retained negative evidence.

<details>
<summary>Self-test</summary>

1. What counts as a clean reproduction?
   - Fresh checkout, pinned versions, fixed prompts and decoding, score within the stated sampling margin of the original.
2. What must a prespecified extension name?
   - The change, the baseline it must beat, the matched budget, and the result that would falsify it.
3. The extension underperforms the baseline. What do you keep?
   - Everything: configs, trajectories, metrics and the failed-regime analysis naming which assumption broke.

</details>

### Mini-project: Reasoning agents, rollout systems and reproduction

**About 14 to 20 hours.** Integrate verifiable reasoning, tool use and the rollout system in `policylab`, then prove the behavior with independent evaluation and a clean reproduction. The system, ledgers and extension close the track into the capstone.

1. Build one verifiable math and code task family in `envs/` with an isolated verifier in `llm/`, gate all-pass against partial credit on fixed outputs, hold out hidden tests, and follow the Stanford CS224R Countdown verifier contract before any training.
2. Contrast outcome and step rewards on fixed traces with discounted-return recomputation, compare greedy against self-consistency and small search at matched token budgets, then distill verified traces with explicit length and invalid-trace rules using the reasoning-model book loop.
3. Implement the multi-turn tool loop in `agents/` with action-only masks, run tool calls in a separate process with timeout inside a resettable sandbox, and prove deterministic replay from recorded seeds and tool results with retry deduplication and duplicate-action accounting.
4. Split actor, rollout, verifier and learner roles in `systems/` with policy-version stamps and staleness records, compare single-example against batched generation with time and memory records, and attribute backpressure and starvation from queue evidence.
5. Write checkpoint and sampler recovery with resume rules in `systems/`, deduplicate retries by call identity with every failure retained, then run a versioned prompt curriculum and account rollout and verifier throughput, update utilization and total compute in `ledger/`.
6. Freeze an independent harness in `eval/` with capability, safety and shift slices, attack verifiers and judges with one retained hacked regime and postmortem from the Hands-on Modern RL probe set, then reproduce from a clean checkout and run one prespecified extension keeping the negative regime.

**Deliverables**

- The `agents/` and `systems/` loop with sandbox, roles, recovery and ledgers.
- Reasoning, search and distillation studies with length and budget evidence.
- Independent evaluation, hacking postmortem, reproduction and extension report.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [Stanford CS224R Default Project Guidelines](https://cs224r.stanford.edu/material/CS224R_Default_Project_Guidelines.pdf). Follow the Countdown verifier and SFT plus IPO plus RLOO contracts.
- external-tests: [Build a Reasoning Model book loop](https://www.manning.com/books/build-a-reasoning-model-from-scratch). Match verifier grades before rollouts; count tokens with accuracy.
- external-tests: [Hands-on Modern RL agentic training system](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter22_agentic/build-agentic-training-system). Complete mask and replay exercises on the pinned commit.
- external-tests: [Hands-on Modern RL reward-hacking probes](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter15_rlhf/extended-practice). Keep one hacked regime with verdicts and postmortem.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Reward honesty | Isolated verifier with hidden tests separates format from accuracy and search gains are budget-matched. | A partial-credit rule flips one update and the hidden set catches the gaming. |
| System correctness | Roles, versions, replay, recovery and deduplication pass with failures retained and counted. | A killed run resumes with identical ordering and a retried call counts once. |
| Throughput honesty | The curriculum is versioned, utilization is consumed over produced rollouts, and compute includes failed work. | Queue evidence names the bottleneck and a placement change keeps its losing side. |
| Evaluation judgment | Independent slices, attacks and clean reproduction support a scoped claim with negatives kept. | The extension states its falsifier and names the broken assumption on failure. |

Feeds into: The agent system, ledgers and reproduction become the capstone LLM-RL evidence pack.

### Resource route

- **Primary - Book:** [RLHF Book - Reasoning, Synthetic Data, Tools and Evaluation](https://rlhfbook.com/c/07-reasoning.html) - Study Chapter 7 (reasoning and inference-time scaling), Chapter 12 (synthetic data and on-policy distillation), Chapter 13 (tool use), Chapter 14 (over-optimization) and Chapter 16 (evaluation). Build a claim map separating RLVR learning, inference-time search, on-policy distillation, tool trajectories, reward overoptimization and independent evaluation.
- **Required - Course:** [RLHF Book Course - Lectures 5, 7, 11 and 12](https://rlhfbook.com/course) - Use Lecture 5 (the rise of reasoning models), Lecture 7 (synthetic data and modern post-training), Lecture 11 (tool use and the road to agents) and Lecture 12 (frontier model evaluation). Tie every mechanism to a distinct data and compute budget.
- **Required - Paper:** [DeepSeek-R1 Technical Report](https://arxiv.org/abs/2501.12948) - Read version 2 of the report (January 2026; the Nature 2025 paper is the peer-reviewed version): the R1-Zero and R1 training pipeline, reward design, observed behaviors and limitations. Reproduce only a reduced verifier-driven question and test whether longer sampling or selection explains the observed gain.
- **Support - Book:** [Build a Reasoning Model (From Scratch) - Chapters 3, 6 and 8](https://www.manning.com/books/build-a-reasoning-model-from-scratch) - Use Chapter 3 (a math verifier: boxed-answer extraction, normalization and equivalence checks), Chapter 6 (RLVR with GRPO on a MATH subset) and Chapter 8 (distillation from filtered rollouts) as the smallest verifier-to-distillation path on Qwen3 0.6B.
- **Support - Paper:** [Tulu 3: Pushing Frontiers in Open Language Model Post-Training](https://arxiv.org/abs/2411.15124) - Read the RLVR section: verifiable rewards for math, instruction following and constraints, and how the RLVR stage sits after SFT and DPO. Compare its recipe with R1-Zero on what is rewarded and what is held out.
- **Support - Paper:** [STaR: Bootstrapping Reasoning With Reasoning](https://arxiv.org/abs/2203.14465) - Read the generate, filter by correctness and fine-tune loop and the rationalization step. Use it as the rejection fine-tuning control that an RL method must beat at matched samples.
- **Support - Paper:** [RAGEN: Understanding Self-Evolution in LLM Agents via Multi-Turn Reinforcement Learning](https://arxiv.org/abs/2504.20073) - Read the multi-turn trajectory formulation and the training instabilities it reports for agent RL (collapse into repetitive reasoning). Use it to design the diagnostics for a small multi-turn environment.
- **Required - Project:** [Stanford CS224R 2026 LLM RL Default Project - Extension](https://cs224r.stanford.edu/material/CS224R_Default_Project_Guidelines.pdf) - Use the specification sections on SFT, IPO, RLOO, evaluation and one extension such as off-policy sampling, test-time inference, exploration, self-play or tool reasoning. Build independent code on a distinct task and respect all course restrictions.
- **Support - Project:** [Berkeley CS 185/285 Deep Reinforcement Learning (Spring 2026) - LLM RL Default Final Project](https://rail.eecs.berkeley.edu/deeprlcourse/static/misc/llm_rl_default_final_project.pdf) - Read the default project for open-ended instruction following: offline DPO, IPO and AOT, online GRPO, Dr. GRPO and GSPO, and judge-based win rates against a frozen base. Use it as a second extension menu; its compute assumes cloud GPUs and a paid judge model.
- **Support - Tutorial:** [Hands-on Modern RL - Reasoning, Agentic RL and Safety](https://walkinglabs.github.io/hands-on-modern-rl/en/chapter22_agentic/build-agentic-training-system) - Use the build-an-agentic-training-system page (a from-scratch trainer exercise), one reasoning or search control and the reward-hacking evaluation chapter selectively. Skip the pages that need API keys or several GPUs and the frontier surveys. Pin commit 9231bab of walkinglabs/hands-on-modern-rl; its `code/chapterNN` folders do not follow the site chapter numbers.
- **Support - Implementation:** [veRL](https://github.com/verl-project/verl/tree/8718ca30a3f002f93b7c4fd99b9b2506718681bc) - Inspect the hybrid-controller architecture, worker roles, supported algorithms and examples at commit 8718ca3 after single-device losses pass. Trace one rollout from generation through reward and update, record policy lag and run only hardware-compatible examples.
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

**Capstone rubric** (about 30 to 45 hours)

| Criterion | Pass | Strong |
| --- | --- | --- |
| Classical-control core | Explicit MDP with exact planning oracles, Monte Carlo and TD control passing fixed-trajectory tests, termination and truncation semantics, visitation and support diagnostics, and one minimized reward or bootstrap failure with postmortem. | Sampled control matches the exact planning oracle within a stated tolerance across seeds, and seeded defects fail before the fix and pass after. |
| Deep-RL laboratory | DQN or Double DQN with actor-critic and PPO, one exploration or continuous-control study, one offline or model-based study, complete replay and rollout state, robust multi-seed reporting, matched sample and compute budgets, ablations and retained unstable runs. | Every update matches fixed-batch oracles, ablations isolate one mechanism each, and losing regimes bound the claims. |
| LLM-RL evidence pack | Immutable model, policy, reference, reward, verifier and trajectory versions, scratch preference and online-policy objectives, SFT, DPO or rejection and search controls, reasoning or tool-use integration, reward-hacking attacks, policy-lag and system metrics, and independent capability and safety evaluation. | Every objective matches fixed-rollout oracles before any online run, and attacks, policy-lag and safety slices bound the learned-change claim. |
| Reproducibility and judgment | A clean checkout reproduces the reasoning-agents baseline and rebuilds every table from raw per-run records, the prespecified extension keeps its honest negative regime, and claims state seed, budget and hardware scope. | An independent operator reproduces the dossier, every failure injection has a regression test, and the defense names what to remove if the benefit is weak. |

