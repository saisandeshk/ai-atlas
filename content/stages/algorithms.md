<!-- Generated from content/curriculum.json. Edit the JSON and run npm run content:generate. -->

# 03. Algorithms & Data Structures

**Level:** Core  
**Scope:** 5 sections · 77 required topics · 9 optional, depth, or later topics

Choose representations from constraints, derive invariants and proofs, implement reliable algorithms, and test them against adversarial cases.

## Order

01. Complexity & Linear Structures
02. Search, Sorting, Trees & Heaps
03. Graph Modeling & Algorithms
04. Decomposition, Greedy Methods & Randomness
05. Dynamic Programming, Proof & Transfer

## 01. Complexity & Linear Structures

**Why:** The first algorithmic skill is translating constraints into a cost budget and preserving a simple invariant. Arrays, hashing, windows and queues expose these habits with minimal abstraction.

### Learn this much

- [ ] Input size, operation model and resource budget _(Required)_
- [ ] Big O, Theta and Omega with stated variables _(Required)_
- [ ] Worst, average, expected and output-sensitive cost _(Required)_
- [ ] Aggregate, accounting and amortized reasoning _(Required)_
- [ ] Loop invariants, initialization, maintenance and termination _(Required)_
- [ ] Arrays, strings, contiguous layout and locality _(Required)_
- [ ] Singly and doubly linked structures and pointer invariants _(Required)_
- [ ] Hashing, collisions, load factor, resizing and tombstones _(Required)_
- [ ] Stacks, queues, circular buffers and deques _(Required)_
- [ ] Two-pointer invariants and ordering assumptions _(Required)_
- [ ] Fixed and variable windows and monotonicity _(Required)_
- [ ] Prefix sums, difference arrays and prefix plus hash _(Required)_
- [ ] Monotone stacks and deques _(Required)_
- [ ] Brute-force oracles and randomized differential tests _(Required)_
- [ ] Potential-function amortized proofs _(Optional)_
- [ ] Adversarial and cryptographic hashing _(Later)_

### Resource route

- **Primary - Course:** [DSA Handbook - Foundations and linear patterns](https://dsa.handbook.academy/curriculum/) - Study Part 0, Part 1, Part 3 and Part 4 in order. Use the routing-rule pages for arrays versus lists, map choice, stack versus queue, two pointers, sliding windows and prefix methods before seeing solved code.
- **Required - Practice:** [AlgoMaster DSA - linear structures slice](https://algomaster.io/learn/dsa/course-roadmap) - Attempt Design HashMap, Longest Substring Without Repeating Characters and Sliding Window Maximum cold. Hide tags, state the invariant first, and add randomized operation histories to Design HashMap.
- **Support - Theory:** [MIT 6.042J - asymptotics and invariants](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/pages/readings/) - Use the asymptotics, state-machine invariants and proof-method readings when a cost or correctness argument is weak. Solve only the matching problems.
- **Support - Application:** [Algorithmica - memory and data layout](https://en.algorithmica.org/hpc/) - Read the memory hierarchy, cache and complexity-model chapters, then measure one contiguous-versus-linked and one hash-versus-ordered workload crossover.
- **Optional - Assessment:** [NeetCode - unseen linear problems](https://neetcode.io/practice) - Use only for two tag-hidden transfer problems after the AlgoMaster slice. Do not start another full roadmap or watch a solution before the attempt is complete.

### Exit checkpoint

Solve two tag-hidden linear-structure problems, state each invariant before coding, and use randomized tests to expose and minimize one plausible wrong solution.

<details>
<summary>Deliberately left for later</summary>

- Cryptographic and learned hashing
- Persistent and concurrent collections
- Specialized succinct data structures

</details>

## 02. Search, Sorting, Trees & Heaps

**Why:** Ordered structure turns brute force into logarithmic search, efficient selection and hierarchical state. The gain is reliable only when boundaries and representation invariants are explicit.

### Learn this much

- [ ] Sorting stability, in-place behavior and comparator contracts _(Required)_
- [ ] Comparison lower bounds and non-comparison assumptions _(Required)_
- [ ] Stable merge sort and divide-combine reasoning _(Required)_
- [ ] Partition invariants, quicksort and adversarial pivots _(Required)_
- [ ] Binary-search interval conventions and termination _(Required)_
- [ ] Lower bound, upper bound and duplicate handling _(Required)_
- [ ] Binary search on a monotone feasibility predicate _(Required)_
- [ ] Selection, quickselect and top-k trade-offs _(Required)_
- [ ] Tree nodes, parent state, recursion and iterative stacks _(Required)_
- [ ] Preorder, inorder, postorder and level-order traversal _(Required)_
- [ ] Binary-search-tree ordering, duplicates and deletion _(Required)_
- [ ] Balanced-tree vocabulary and worst-case guarantees _(Required)_
- [ ] Heap order, bottom-up construction and mutable priorities _(Required)_
- [ ] Trie representation, prefix lookup and memory cost _(Required)_
- [ ] Interval ordering, merging and sweep reasoning _(Required)_
- [ ] Ranks, order statistics and augmented trees _(Optional)_
- [ ] B-trees, suffix structures and persistent search trees _(Later)_

### Resource route

- **Primary - Course:** [DSA Handbook - search, trees and heaps](https://dsa.handbook.academy/curriculum/) - Study Part 2 Search and Sort, Part 5 Linked Lists, and Part 6 Trees and Heaps. Include canonical and answer-space binary search, comparison and linear-time sorts, quickselect, sentinels, cycles, heaps, BSTs, balanced-tree vocabulary, tries and segment trees.
- **Required - Practice:** [AlgoMaster DSA - ordered structures slice](https://algomaster.io/learn/dsa/course-roadmap) - Attempt Koko Eating Bananas, Validate Binary Search Tree and Find Median from Data Stream cold. Use Merge Intervals only if interval modeling remains weak, and include duplicate-heavy and skewed inputs.
- **Support - Application:** [Algorithmica - search and sorting performance](https://en.algorithmica.org/hpc/) - Use the binary-search, sorting, branch prediction and cache chapters to explain why two algorithms with the same asymptotic bound cross over on real workloads.
- **Reference - Theory:** [Algorithms](https://jeffe.cs.illinois.edu/teaching/algorithms/) - Use the recursion and divide-and-conquer chapters when deriving merge, partition and selection algorithms. This is the proof reference when the handbook explanation is too brief.
- **Optional - Assessment:** [NeetCode - unseen ordered problems](https://neetcode.io/practice) - Use one unseen tree problem and one heap or interval problem as the final transfer check, with solution material closed until submission.

### Exit checkpoint

Derive one binary-search boundary without patching it by examples, then solve one unseen tree and one heap or interval problem with adversarial tests and a worst-case defense.

<details>
<summary>Deliberately left for later</summary>

- Implementing every balanced-tree variant
- External-memory and database index internals
- Advanced suffix trees and compressed indexes

</details>

## 03. Graph Modeling & Algorithms

**Why:** Many scheduling, dependency, routing and state-transition problems are graphs before they are algorithms. Correct modeling and assumption checks matter more than recalling a traversal name.

### Learn this much

- [ ] Vertices, edges, direction, weights and problem-state modeling _(Required)_
- [ ] Adjacency lists, matrices, edge lists and implicit graphs _(Required)_
- [ ] BFS frontier invariant and unweighted shortest paths _(Required)_
- [ ] DFS state, timestamps and recursive versus iterative traversal _(Required)_
- [ ] Connected components and reachability _(Required)_
- [ ] Cycle detection in directed and undirected graphs _(Required)_
- [ ] Bipartite testing and two-color invariants _(Required)_
- [ ] Topological ordering and dependency cycles _(Required)_
- [ ] Strongly connected components _(Required)_
- [ ] Union-find, path compression and union by rank or size _(Required)_
- [ ] Dijkstra relaxation, stale priorities and nonnegative weights _(Required)_
- [ ] Negative edges, Bellman-Ford and negative-cycle detection _(Required)_
- [ ] Minimum spanning trees with Kruskal and Prim _(Required)_
- [ ] Product-state and time-expanded graphs _(Required)_
- [ ] Path, ordering and spanning-tree certificates _(Required)_
- [ ] Exhaustive small-graph and differential validation _(Required)_
- [ ] Flow and matching at recognition depth _(Optional)_
- [ ] Advanced flow, matching and spectral graph algorithms _(Later)_

### Resource route

- **Primary - Course:** [DSA Handbook - graphs](https://dsa.handbook.academy/curriculum/graphs/) - Study all of Part 8 in order. For each algorithm, write the representation, invariant, forbidden input assumptions and independently checkable output before reading the implementation.
- **Required - Practice:** [AlgoMaster DSA - graph slice](https://algomaster.io/learn/dsa/course-roadmap) - Attempt Number of Islands, Course Schedule and Network Delay Time cold. They cover traversal, dependency modeling and weighted shortest paths; add one narrative problem only if graph modeling remains weak.
- **Required - Theory:** [Algorithms - graph chapters](https://jeffe.cs.illinois.edu/teaching/algorithms/) - Use the basic graph, minimum spanning tree, shortest path and flow chapters for correctness proofs and counterexamples to tempting wrong algorithms.
- **Support - Practice:** [Hypothesis - generated graph tests](https://hypothesis.readthedocs.io/en/latest/) - Generate small sparse, dense, disconnected, cyclic, parallel-edge and weighted graphs. Compare optimized results with exhaustive or deliberately simple references and retain shrunk failures.
- **Optional - Assessment:** [NeetCode - unseen graph problems](https://neetcode.io/practice) - Use two unseen story problems without graph tags. Grade the model, assumptions, certificate and tests as well as the final answer.

### Exit checkpoint

Convert two unfamiliar narratives into graphs, implement the selected algorithms with certificates, and reject one wrong method using a minimized counterexample.

<details>
<summary>Deliberately left for later</summary>

- Full maximum-flow and matching implementation families
- Spectral and geometric graph algorithms
- Large-scale graph processing frameworks

</details>

## 04. Decomposition, Greedy Methods & Randomness

**Why:** Hard problems often become manageable by exposing recursive state, proving a local choice, or accepting a controlled probability. Each shortcut needs a proof boundary and an adversarial test.

### Learn this much

- [ ] Recursive state, base cases and return contracts _(Required)_
- [ ] Choice, unchoice and complete search _(Required)_
- [ ] Sound pruning rules and duplicate choices _(Required)_
- [ ] Divide, solve and combine structure _(Required)_
- [ ] Recursion trees and common cost recurrences _(Required)_
- [ ] Partition-based selection and pivot behavior _(Required)_
- [ ] Greedy-choice property and optimal substructure _(Required)_
- [ ] Exchange, staying-ahead and cut arguments _(Required)_
- [ ] Minimal counterexamples to plausible greedy rules _(Required)_
- [ ] Interval, scheduling and covering problems _(Required)_
- [ ] Randomized correctness, expected cost and reproducible seeds _(Required)_
- [ ] Randomized selection and hashing behavior _(Required)_
- [ ] Reservoir sampling and bounded-memory streams _(Required)_
- [ ] Unbiased shuffling and distribution checks _(Required)_
- [ ] Empirical probability checks and tolerance choice _(Required)_
- [ ] High-probability and concentration bounds _(Optional)_
- [ ] Approximation algorithms and competitive analysis _(Later)_

### Resource route

- **Primary - Course:** [DSA Handbook - recursion, backtracking and greedy](https://dsa.handbook.academy/curriculum/) - Study Part 7, Part 10 and the relevant foundations on recursion and probability. Write the state definition or greedy claim before opening code.
- **Required - Practice:** [AlgoMaster DSA - decomposition and greedy slice](https://algomaster.io/learn/dsa/course-roadmap) - Attempt N-Queens and Gas Station cold, then implement reservoir sampling and test its output distribution over fixed-seed trials. Add another judged problem only for a diagnosed weakness.
- **Required - Theory:** [Algorithms - recursion, backtracking and greedy](https://jeffe.cs.illinois.edu/teaching/algorithms/) - Use the recursion, backtracking, divide-and-conquer and greedy chapters for recurrence derivations, proof templates and counterexamples.
- **Support - Theory:** [MIT 6.042J - probability and randomized algorithms](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/pages/readings/) - Use the probability, expectation and concentration readings to derive sampling probabilities and distinguish expected from high-probability guarantees.
- **Support - Application:** [Algorithmica - randomized and practical algorithms](https://en.algorithmica.org/hpc/) - Use selected chapters on hashing, randomization and practical performance to compare theoretical expectations with measured distributions.

### Exit checkpoint

Prove or refute one unseen greedy rule before coding, implement a pruned search with a sound bound, and empirically verify one randomized guarantee with fixed seeds.

<details>
<summary>Deliberately left for later</summary>

- Advanced approximation schemes
- Randomized linear algebra
- Competitive analysis beyond representative examples

</details>

## 05. Dynamic Programming, Proof & Transfer

**Why:** Dynamic programming tests whether a problem state contains exactly the information the future needs. Deriving that state and proving the recurrence transfers directly to batching, caching and resource allocation.

### Learn this much

- [ ] State sufficiency and overlapping subproblems _(Required)_
- [ ] Optimal substructure and transition completeness _(Required)_
- [ ] Base cases, invalid states and initialization _(Required)_
- [ ] Dependency order and topological evaluation _(Required)_
- [ ] Memoized recursion and state identity _(Required)_
- [ ] Bottom-up tabulation and iteration order _(Required)_
- [ ] Solution reconstruction and independently checkable outputs _(Required)_
- [ ] Rolling state and dependency-preserving compression _(Required)_
- [ ] Sequence and string dynamic programming _(Required)_
- [ ] Grid, path and interval dynamic programming _(Required)_
- [ ] Tree dynamic programming _(Required)_
- [ ] Knapsack, subset and bitmask state _(Required)_
- [ ] Inductive recurrence proofs and loop invariants _(Required)_
- [ ] Exhaustive small-instance and differential validation _(Required)_
- [ ] Dynamic programming as a DAG or shortest-path problem _(Required)_
- [ ] Scheduling, caching, batching and allocation formulations _(Required)_
- [ ] Exact, heuristic and approximate boundaries _(Required)_
- [ ] Divide-and-conquer, Knuth and convex-hull DP optimization _(Later)_

### Resource route

- **Primary - Course:** [DSA Handbook - dynamic programming](https://dsa.handbook.academy/curriculum/dynamic-programming/) - Study Part 9 in order from state and recurrence through sequence, grid, tree and bitmask families. For every example, close the page and reconstruct the state, transition and evaluation order.
- **Required - Practice:** [AlgoMaster DSA - dynamic programming slice](https://algomaster.io/learn/dsa/course-roadmap) - Attempt Coin Change, Longest Common Subsequence and House Robber III cold. Write the state, transition, base case and evaluation order first; compare against brute force on small inputs and reconstruct a witness when available.
- **Required - Theory:** [Algorithms - dynamic programming](https://jeffe.cs.illinois.edu/teaching/algorithms/) - Use the dynamic-programming chapter to derive states and recurrences from first principles and to separate DP from greedy reasoning and shortest paths.
- **Support - Practice:** [Hypothesis - exhaustive and differential DP tests](https://hypothesis.readthedocs.io/en/latest/) - Generate small valid instances, compare memoized, tabulated and exhaustive results, and retain shrunk failures for wrong state, base case, order and compression defects.
- **Optional - Assessment:** [NeetCode - unseen mixed problems](https://neetcode.io/practice) - Use two tag-hidden mixed problems as the final transfer test. One must require rejecting a tempting greedy or insufficient-state solution with a counterexample.

### Exit checkpoint

Derive and implement two tag-hidden dynamic programs from blank files, reconstruct a witness, and repair one subtly wrong recurrence using a minimized counterexample.

<details>
<summary>Deliberately left for later</summary>

- Specialized dynamic-programming optimizations
- NP-hardness reductions and advanced approximation
- Competitive-programming trick catalogs

</details>

## Stage milestone

### Scheduler & Stream Algorithms Lab

Review the stage through three small artifacts drawn from the Algorithms and Data Structures Laboratory. Keep the evidence compact enough to inspect, rerun and defend without completing another problem list.

- Correctness library - hash map, mutable-priority heap, union-find, one graph routine and one reconstructing DP, each with an invariant and complexity note
- Failure evidence - generated operation histories, adversarial cases, minimized failures and repairs for at least two seeded defects
- Transfer and measurement - one unfamiliar problem solved cold plus one benchmark connecting asymptotic behavior, input distribution and memory locality

