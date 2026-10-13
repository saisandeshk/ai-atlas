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
- [ ] Big $`O`$, $`\Theta`$ and $`\Omega`$ with stated variables _(Required)_
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

### Study units

#### U1. Cost models, asymptotic notation and cases

**About 4 h** · **Target:** Explain + Derive

Topics: Input size, operation model and resource budget; Big $`O`$, $`\Theta`$ and $`\Omega`$ with stated variables; Worst, average, expected and output-sensitive cost

Every later choice in this stage starts by reading the constraint line. A wrong budget rejects a working algorithm before it is written, or accepts one that cannot finish.

**You can now**

- Translate an input bound into a cost budget: state which complexity classes fit $`n`$ up to 5000, $`10^5`$ and $`10^9`$.
- Define Big-O, Big-Omega and Big-Theta with quantifiers, and prove a polynomial bound such as $`100x^2 = O(x^2)`$ from the definition.
- Derive time and auxiliary-space bounds for nested and input-dependent loops, naming the variable each bound is in.

**Study**

1. [Computational complexity and Big-O](https://dsa.handbook.academy/curriculum/foundations/complexity-big-o/) (DSA Handbook - Foundations and linear patterns) - What complexity actually means; How to read a complexity bound (the five notations); The hierarchy you will meet with the input-size table; Space-time tradeoffs.
2. [Mathematics for Computer Science, Chapter 13, Section 13.7](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/mit6_042js15_textbook.pdf) (MIT 6.042J - asymptotics and invariants) - Section 13.7 Asymptotic Notation (printed pp. 528 to 549): 13.7.1 Little O, 13.7.2 Big O with Definitions 13.7.5 and 13.7.9 plus Proposition 13.7.10 ($`100x^2 = O(x^2)`$), 13.7.3 $`\Theta`$ with Definition 13.7.13, 13.7.4 Pitfalls, 13.7.5 $`\Omega`$ with Definitions 13.7.15 and 13.7.16.
3. [Complexity Models](https://en.algorithmica.org/hpc/complexity) (Algorithmica - memory and data layout) - Classical Complexity Theory and Asymptotic Complexity: the instruction-count model and where it breaks (clock speeds and instruction latencies).
4. [Programming Languages and constant factors](https://en.algorithmica.org/hpc/complexity/languages) (Algorithmica - memory and data layout) - Interpreted languages, Compiled Languages and Takeaway: the pure-Python versus C versus OpenBLAS matrix-multiply comparison. Depth: Read for the constant-factor warning only. Algorithmica's timings are C++ measurements; do not carry any crossover point to Python without your own `timeit` run.

**Focus**

- Constraints are budgets: $`n`$ up to 10 admits $`O(n!)`$ brute force, $`n`$ up to $`10^5`$ admits $`O(n \log n)`$ or better, and a value $`n`$ up to $`10^9`$ admits only $`O(\sqrt{n})`$, $`O(\log n)`$, a closed form or a lookup.
- The equality in $`f(n) = O(g(n))`$ is one-way: $`n = O(n^2)`$ holds and the reverse is nonsense.
- Worst case is the default reading of complexity; average, expected and amortized each need their own argument, supplied by later units.
- Constants are invisible in the notation: the handbook plans Python at about $`10^7`$ simple ops per second against $`10^8`$ for compiled languages.

**Reproduce:** Without notes, write the $`c`$-and-$`n_0`$ definitions of $`O`$, $`\Omega`$ and $`\Theta`$ and prove $`100x^2 = O(x^2)`$. Then time both Two Sum variants at $`n = 2000`$ with seed 0 and an absent target in Python 3.13: expect the brute force at about 0.05 s per run against the hashmap at about 0.1 ms per run, a ratio of several hundred, on a 12th Gen Intel Core i9-12900K.

**Traps**

- Reading Big-O as an exact operation count. It bounds growth up to a constant, and the constant decides close races.
- Quoting the handbook's operations-per-second rates, its $`n = 50`$ sort crossover or its ten-to-thirty-second estimate for scanning $`10^9`$ items as measured facts. They are rough compiled-language planning numbers; time your own code with `timeit` before repeating them.
- Calling one fast observed run an average case. A single input is one sample; an average needs a stated distribution.

**Practice**

- [LeetCode 1: Two Sum](https://leetcode.com/problems/two-sum/) - Implement the $`O(n^2)`$ brute-force double loop and the $`O(n)`$ complement hashmap. Time both with `timeit` at $`n = 2000`$, seed 0, target absent: expect about 0.05 s per brute run against about 0.1 ms per hash run. State both bounds with the named variable $`n`$. After submitting, read the handbook hash-maps section LC 1: value-to-index map for the lookup-then-insert order that avoids matching an element with itself on inputs like `[3, 3]`.

**Stop when:** You prove a polynomial $`\Theta`$ bound from the definitions without notes, and your Two Sum timing shows the predicted gap with both bounds stated.

<details>
<summary>Self-test</summary>

1. Prove $`100x^2 = O(x^2)`$ from the definition.
   - Take $`c = 100`$ and $`x_0 = 1`$. For all $`x \ge 1`$, $`0 \le 100x^2 \le 100 \cdot x^2`$. This is Proposition 13.7.10.
2. $`n = O(n^2)`$ is true. Is $`n^2 = O(n)`$?
   - No. For every fixed $`c`$, $`n^2 > c \cdot n`$ once $`n > c`$, so no constant works. The equality reads one way only.
3. A problem allows $`n`$ up to $`10^9`$ on a one-second budget. Why is a linear scan rejected before coding?
   - At the planning rate of about $`10^8`$ simple operations per second for compiled code, $`10^9`$ steps take about 10 s, and Python at about $`10^7`$ per second needs over a minute. An input that large is usually one number, not an array, so $`O(\sqrt{n})`$ (about $`3 \times 10^4`$ steps), $`O(\log n)`$, a closed form or a lookup fits.
4. A dynamic-array push is $`O(1)`$ amortized. Does that bound the slowest single push?
   - No. The push that triggers a resize copies every element, which is $`O(n)`$. Amortized averages over the sequence; latency-critical code cannot use the average.

</details>

#### U2. Aggregate, accounting and potential amortized analysis

**About 4 h** · **Target:** Derive

Topics: Aggregate, accounting and amortized reasoning; Potential-function amortized proofs

Appends, queue transfers and table resizes all hide rare expensive steps inside cheap sequences. Without amortization you either over-reject a fine structure or ship a latency spike.

**You can now**

- Distinguish worst-case-per-operation from amortized cost over a sequence, and name which one a latency-critical loop needs.
- Derive the $`b/(b-1)`$ per-push bound for geometric growth from the series, and compute copy totals for $`b = 2`$ and $`b = 1.125`$.
- Prove binary-counter and dynamic-array bounds by the summation, taxation and potential methods, including the $`\Phi = 2\mathrm{num} - \mathrm{capacity}`$ derivation.

**Study**

1. [Amortised analysis (inside Computational complexity and Big-O)](https://dsa.handbook.academy/curriculum/foundations/complexity-big-o/) (DSA Handbook - Foundations and linear patterns) - Amortised analysis: the aggregate, banker and potential methods on the dynamic-array example, plus the hard-real-time caveat. Depth: Read only this section; the rest of the chapter belongs to the previous unit.
2. [Dynamic array internals](https://dsa.handbook.academy/curriculum/linear-data-structures/dynamic-array-internals/) (DSA Handbook - Foundations and linear patterns) - The proof in one paragraph (geometric series to $`b/(b-1)`$); How fast capacity actually grows (the 1000-push copy counts for $`b = 2`$ and $`b = 1.125`$); Five libraries (the CPython 1.125 row with the `listobject.c` formula and the python-dev history); What happens on the way down (shrink hysteresis); the Python-doubles and front-insertion warnings.
3. [Lecture 9: Amortized Analysis, Sections 9.1 to 9.3](https://jeffe.cs.illinois.edu/teaching/algorithms/notes/09-amortize.pdf) (Algorithms lecture notes - amortized analysis and hashing) - 9.1 Incrementing a Binary Counter; 9.2 Counting from 0 to $`n`$ with 9.2.1 Summation, 9.2.2 Taxation, 9.2.3 Charging and 9.2.4 Potential (amortized cost 2 per increment); 9.3 Incrementing and Decrementing (the double-binary counter); 9.5 Generalities and Warnings. Depth: Skip 9.4 Gray Codes; it is depth material for later. 9.5 is one page on why one structure can have several valid sets of amortized bounds.

**Focus**

- Every method answers one question: total cost of the sequence divided by its length. Summation counts flips, taxation banks credit, potential tracks $`\Phi`$.
- The proof needs geometric growth: with factor $`b`$ the copies sum to at most $`n/(b-1)`$; arithmetic growth collapses to $`\Theta(n)`$ per push.
- CPython grows lists by about 1.125x after the small-list steps 0, 4, 8, 16: about nine moves per push, the highest constant in the table, chosen to bound peak RAM.
- Shrinking needs hysteresis (shrink at a quarter full, not a half) or alternating push and pop replays the resize forever.

**Reproduce:** Without notes, derive the amortized bound both ways: the copy series summing to at most $`n/(b-1)`$, and the potential $`\Phi = 2\mathrm{num} - \mathrm{capacity}`$ with the resize case $`(k+1) + (2-k) = 3`$. Then append 200 ints to a list in Python 3.13.14 and confirm with `sys.getsizeof` that capacity steps land at lengths 1, 5, 9, 17, 25 and 33.

**Traps**

- Amortized $`O(1)`$ does not bound the single slowest push; the resize push copies everything.
- Python lists do not double. The formula is `(newsize + (newsize >> 3) + 6) & ~3` after the 0, 4, 8 start.
- Halving on pop breaks the bound; only the quarter rule (or no shrinking) keeps it.

**Practice**

- [LeetCode 232: Implement Queue using Stacks](https://leetcode.com/problems/implement-queue-using-stacks/) - Implement the two-stack lazy transfer. In your solution note, prove each element moves at most twice, so the amortized cost per operation is $`O(1)`$. Judge with the Example sequence `push` 1, `push` 2, `peek`, `pop`, `empty`. After submitting, read the handbook queues-deques section Why the patterns chapters teach the rest for the lazy-transfer argument.

**Stop when:** You derive the resize-push bound from $`\Phi`$ without notes, and your queue solution states its amortized argument next to the transfer code.

<details>
<summary>Self-test</summary>

1. Derive the amortized cost per push for growth factor 2.
   - Resizes copy $`1 + 2 + 4 + \cdots + n/2 = n - 1`$ elements; plus $`n`$ slot writes the sequence costs $`2n - 1`$, so at most 2 per push. The potential method with $`\Phi = 2\mathrm{num} - \mathrm{capacity}`$ gives the looser constant 3; both are $`O(1)`$.
2. In the potential proof, why is the resize push amortized 3 and not $`k+1`$?
   - Actual cost $`k+1`$ plus the $`\Phi`$ change. Before the push the table is full so $`\Phi = 2k - k = k`$; after, $`\mathrm{num} = k+1`$ and $`\mathrm{cap} = 2k`$ so $`\Phi = 2`$. The change is $`2-k`$ and the amortized cost is $`(k+1) + (2-k) = 3`$.
3. How many bit flips do $`n`$ binary-counter increments from zero perform, exactly?
   - $`2n`$ minus the number of 1 bits in $`n`$. Bit $`i`$ flips every $`2^i`$ iterations, so it flips $`\operatorname{floor}(n/2^i)`$ times.
4. Push then pop alternately at the half-full boundary with a halving shrink policy. What breaks?
   - Every operation triggers a full resize, so $`n`$ operations cost $`\Theta(n^2)`$. Shrink only at a quarter full.

</details>

#### U3. Loop invariants, brute-force oracles and differential tests

**About 4 h** · **Target:** Derive + Implement

Topics: Loop invariants, initialization, maintenance and termination; Brute-force oracles and randomized differential tests

Stating the invariant first turns debugging into checking. A brute-force oracle plus shrinking turns a wrong program into a minimal counterexample.

**You can now**

- State a loop invariant with initialization, maintenance and termination before coding, following the state-machine pattern.
- Write a Hypothesis differential test that compares an optimized linear routine against a brute-force oracle with controlled seeds.
- Read a shrunken failing input back to the violated invariant.

**Study**

1. [Mathematics for Computer Science, Chapter 5, Section 5.4](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/mit6_042js15_textbook.pdf) (MIT 6.042J - asymptotics and invariants) - 5.4.1 States and Transitions; 5.4.2 Invariant for a Diagonally-Moving Robot with Lemma 5.4.1 and Theorem 5.4.2; 5.4.3 The Invariant Principle with Definitions 5.4.4 and 5.4.5. Depth: Skim 5.4.4 Die Hard as a second example; skip 5.4.5 Fast Exponentiation.
2. [Hypothesis Quickstart](https://hypothesis.readthedocs.io/en/latest/quickstart.html) (Hypothesis documentation - Quickstart and stateful testing) - Write your first test (`@given` with integers and lists strategies); Running in a test suite; Combining Hypothesis with pytest. Depth: Skip the database and shrinking-internals pages; shrinking behavior is used here, not studied.
3. [Hypothesis: Configuring test settings](https://hypothesis.readthedocs.io/en/latest/tutorial/settings.html) (Hypothesis documentation - Quickstart and stateful testing) - Configuring a single test (`@settings` with `max_examples`) and the commonly used settings, where `derandomize` makes runs deterministic.
4. [Hypothesis stateful testing](https://hypothesis.readthedocs.io/en/latest/stateful.html) (Hypothesis documentation - Quickstart and stateful testing) - Rule-based state machines: `rule`, `precondition` and `invariant`; `run_state_machine_as_test`. Depth: Read the rules-and-invariants shape only; full stateful harnesses arrive with Design HashMap in the hash-table unit.
5. [Sliding window: fixed size (invariant-in-code example)](https://dsa.handbook.academy/curriculum/pointers-window-prefix/sliding-window-fixed/) (DSA Handbook - Foundations and linear patterns) - The pattern (build-first-window then slide) and the four primitives table. Depth: Read only the pattern and primitives as the invariant written in code; the full chapter belongs to the two-pointer unit.

**Focus**

- An invariant has three obligations: true at the start, preserved by each step, and strong enough to imply the answer at the end.
- The oracle must be too simple to share the bug: brute force against optimized, with independent code paths.
- `derandomize` (or a fixed seed) makes the run replayable; shrinking then minimizes the failure, which you map back to the invariant clause.
- State the invariant in one sentence before the loop; the window primitives show the shape.

**Reproduce:** Write `test_window.py` comparing the sliding-window max-average against the $`O(nk)`$ brute-force oracle with Hypothesis lists of ints in `[-100, 100]` of length 1 to 30 and $`k`$ drawn from 1 to `len(nums)`, `max_examples=200`, `derandomize=True`. Run under pytest in Python 3.13 with Hypothesis 6.169.0 and pytest 9.1.1: expect 1 passed. Then break the slide step once (drop the minus term) and confirm the test fails on a shrunken input.

**Traps**

- Testing the optimized code against itself by reusing its helper in the oracle. The oracle shares the bug and everything passes.
- Random tests without seed control: a failure you cannot replay is a rumor, not a regression test.
- Showing maintenance without checking that the invariant implies the postcondition at termination.

**Practice**

- [LeetCode 643: Maximum Average Subarray I](https://leetcode.com/problems/maximum-average-subarray-i/) - Solve with the build-first-window slide. Commit a Hypothesis differential test against the $`O(nk)`$ brute force alongside the solution; judge with the worked example `nums = [2, 1, 5, 1, 3, 2, 1, 4]`, $`k = 3`$. After submitting, re-read the handbook sliding-window-fixed worked example and check your trace emits the same running maxima.

**Stop when:** Your committed test replays deterministically, catches the seeded minus-term bug, and you can point at the invariant line the shrunken input breaks.

<details>
<summary>Self-test</summary>

1. State the Invariant Principle in one sentence.
   - If a predicate holds initially and every transition preserves it, it holds in all reachable states (Definitions 5.4.4 and 5.4.5).
2. Why does the max-average oracle use the $`O(nk)`$ double loop instead of a second window implementation?
   - The double loop recomputes each window from scratch, so it cannot share an off-by-one in the slide update. Independence is what makes disagreement evidence.
3. Hypothesis reports a failing input of length 24. What do you do before touching the code?
   - Let it shrink, replay the minimal case with `derandomize`, and identify which invariant clause the minimal input violates.
4. Write the invariant for the fixed-size window slide.
   - Before each step, $`s`$ equals the sum of the current $`k`$ elements. Each step emits the current window and advances by exactly one, so at termination every window was emitted.

</details>

#### U4. Arrays, strings, locality and linked structures

**About 5 h** · **Target:** Explain + Implement

Topics: Arrays, strings, contiguous layout and locality; Singly and doubly linked structures and pointer invariants

Arrays and linked nodes are the two physical layouts everything else composes. Index discipline and pointer discipline learned here prevent the off-by-one and aliasing bugs of every later unit.

**You can now**

- Implement in-place array routines (compaction, back-merge, rotation) with exact index bounds.
- Implement singly linked insert, delete and traversal with a sentinel, and state the pointer invariant.
- Explain list over-allocation and string-builder costs from CPython behavior and your own measurements, and separate Python locality from C++ cache numbers.

**Study**

1. [Arrays: static, dynamic, multi-dimensional](https://dsa.handbook.academy/curriculum/linear-data-structures/arrays/) (DSA Handbook - Foundations and linear patterns) - What an array actually is; The cost model you can quote in an interview; Three problems, three techniques (LC 88 back-merge, LC 27 two-pointer compaction, LC 189 three-reverse rotation).
2. [Strings: encoding, immutability, builders](https://dsa.handbook.academy/curriculum/linear-data-structures/strings/) (DSA Handbook - Foundations and linear patterns) - The $`O(n^2)`$ concatenation trap with the refcount-1 in-place note; the parts-plus-join builder idiom. Depth: The chapter's 2.2x figure is a CPython 3.11 micro-benchmark. Rerun the comparison on 3.13 yourself (see Reproduce) instead of quoting it.
3. [Linked list fundamentals](https://dsa.handbook.academy/curriculum/linked-lists/linked-list-fundamentals/) (DSA Handbook - Foundations and linear patterns) - The four pointer primitives; The sentinel; Designing the list: LC 707 (`get`, `addAtHead`, `addAtTail`, `addAtIndex`, `deleteAtIndex`); When the design changes (doubly-linked insert).
4. [CPython list over-allocation](https://github.com/python/cpython/blob/main/Objects/listobject.c) (CPython source - list and dict objects) - `list_resize`: the `(newsize + (newsize >> 3) + 6) & ~3` formula with the growth-pattern comment (0, 4, 8, 16, 24, 32, 40, 52, 64, 76, ...). Depth: Read the function and its comment only; the rest of the file is later.
5. [Cache Lines](https://en.algorithmica.org/hpc/cpu-cache/cache-lines) (Algorithmica - memory and data layout) - 64-byte cache lines and the strided-loop demonstration (stride 1 against stride 16). Depth: These are C++ measurements on contiguous arrays. Do not quote them for Python lists; your Reproduce shows why.
6. [External Memory Model](https://en.algorithmica.org/hpc/external-memory/model) (Algorithmica - memory and data layout) - Cache-Aware Model and Array Scan: why a scan is the cheapest access pattern. Depth: Read for the model only; the numbers are C++ measurements.

**Focus**

- In-place means bounded extra space with exact bounds: merge from the back, compact with a write pointer, rotate with three reverses.
- The sentinel (dummy head) removes the empty-head special case; every rewiring snapshots `next` before clobbering.
- CPython lists over-allocate geometrically (about 1.125x) but store pointers: consecutive elements are separate heap objects, so stride effects differ from C arrays.
- Unaliased local string accumulation grows in place on CPython 3.13 and runs near `join` speed; one extra reference to the running string restores the quadratic copying.

**Reproduce:** Build `parts = [str(i) for i in range(30000)]` and time three functions on Python 3.13.14 (12th Gen Intel Core i9-12900K): `s = s + p` in a loop where `s` is the only reference (about 0.5 ms), the same loop with `t = s` taken before each concatenation (about 0.09 s, quadratic copying), and `''.join(parts)` (about 0.1 ms). The aliased loop is over 100x slower. Then, without notes, implement remove-element compaction plus sentinel-based insert-after and delete-after.

**Traps**

- Iterating to capacity instead of length, and front insertion or `pop(0)` in a loop: growth amortizes the tail only, so $`n`$ front inserts cost $`\Theta(n^2)`$.
- Quoting the handbook's 2.2x concat figure or Algorithmica's stride numbers as your Python behavior. Both were measured elsewhere; rerun on 3.13.
- Rewiring `curr.next` before saving it: the rest of the list is gone.

**Practice**

- [LeetCode 27: Remove Element](https://leetcode.com/problems/remove-element/) - Implement the read/write two-pointer compaction in place with $`O(1)`$ extra memory. State the write-pointer invariant in a comment. After submitting, compare against the handbook arrays section LC 27: Remove Element, the two-pointer compaction.
- [LeetCode 707: Design Linked List](https://leetcode.com/problems/design-linked-list/) - Implement `get`, `addAtHead`, `addAtTail`, `addAtIndex` and `deleteAtIndex` with a sentinel node. Test empty-list, head and tail-index cases. After submitting, compare against the handbook linked-list-fundamentals sections The sentinel and Designing the list: LC 707.

**Stop when:** Both solutions are accepted, your concat rerun reproduces the 100x gap, and you can draw the pointer state before and after each rewiring.

<details>
<summary>Self-test</summary>

1. Why does Merge Sorted Array merge from the back?
   - The tail of the destination is free buffer. Writing forwards would overwrite unmerged elements; writing backwards only touches buffer cells or already-placed cells.
2. Argue the three-reverse rotation correct.
   - Reversing everything puts each element at its rotated mirror position; reversing the first $`k`$ and the rest then fixes each segment's internal order.
3. `getsizeof` steps land at lengths 1, 5, 9 and 17. What capacities are those?
   - With a 56-byte header and 8 bytes per slot, 88, 120, 184 and 248 bytes mean 4, 8, 16 and 24 slots, matching the 0, 4, 8, 16, 24 pattern.
4. Consecutive list elements sit 32 bytes apart by `id()`. Why does the stride-16 demo not apply?
   - The list stores pointers; elements are separate heap objects. Striding the list still chases pointers, unlike striding a C array of inline values.

</details>

#### U5. Hash tables: collisions, load factor, resizing and tombstones

**About 4 h** · **Target:** Explain + Implement

Topics: Hashing, collisions, load factor, resizing and tombstones

Hash maps are the default index, counter and cache. Their average is excellent and their worst case is a security incident; both follow from the load factor.

**You can now**

- Explain chaining and open-addressing costs in the load factor, including the $`1/(1-\alpha)`$ blowup.
- Implement a hash table that resizes at a stated load factor, with deletion that preserves lookup.
- Predict adversarial degradation and name the defense (randomized hashing).

**Study**

1. [Hash maps and hash sets](https://dsa.handbook.academy/curriculum/linear-data-structures/hash-maps/) (DSA Handbook - Foundations and linear patterns) - What invariant the average-case bound depends on ($`\Theta(1+\alpha)`$); LC 1 value-to-index; LC 49 signature keys; LC 242 counters; What it actually costs (the double-plus-rehash resize contract).
2. [Hash collisions and the load factor](https://dsa.handbook.academy/curriculum/linear-data-structures/hash-collisions/) (DSA Handbook - Foundations and linear patterns) - Two strategies, one contract; What it costs to grow; When the contract breaks: LC 128 in two complexities; How the 28C3 attack worked, and what fixed it (SipHash, PEP 456); A second example: LC 380's pointer-redirection trick. Depth: Treat the CPython probing recurrence as a reading guide for the source item below, not as a substitute for it.
3. [Lecture 5: Hash Tables, Sections 5.1 to 5.5 and 5.8 to 5.10](https://jeffe.cs.illinois.edu/teaching/algorithms/notes/05-hashing.pdf) (Algorithms lecture notes - amortized analysis and hashing) - 5.2 The Importance of Being Random; 5.3 universal and near-universal definitions; 5.4 Chaining (expected $`O(1+\alpha)`$); 5.5 multiplicative hashing with Theorems 1 and 2; 5.8 Open Addressing (expected at most $`1/(1-\alpha)`$); 5.9 Linear and Binary Probing. Depth: Read the statements of 5.6 Balls and Bins and 5.7 Perfect Hashing; skip their proofs.
4. [CPython dict internals](https://github.com/python/cpython/blob/main/Objects/dictobject.c) (CPython source - list and dict objects) - `USABLE_FRACTION` (currently two-thirds) with its definition comment; the perturbation-probing comment (`j = (5*j) + 1 + perturb`); `dummy` (tombstone) entries on deletion. Depth: Find the three definitions; do not read the whole file.

**Focus**

- $`\alpha = n/m`$ governs everything: chaining $`\Theta(1+\alpha)`$, open addressing $`1/(1-\alpha)`$; CPython resizes past $`2/3`$.
- Resize doubles and rehashes every entry: an $`O(n)`$ event, amortized $`O(1)`$ by the unit-2 argument.
- Deletion must leave a tombstone: marking the slot empty would cut probe chains and lose keys.
- Deterministic string hashing is attackable (the 2011 HashDoS); Python seeds SipHash per interpreter (PEP 456).

**Reproduce:** Insert ints 0 to 49 into an empty `dict` on Python 3.13.14, recording `sys.getsizeof` after each insert. The first insert allocates the 8-slot table; assert the later size steps at $`n`$ = 6, 11, 22 and 43, confirming the two-thirds rule. Then delete two keys and assert the byte size and the remaining key order are unchanged.

**Traps**

- Reading insertion order as sorted order; dicts remember arrival, not rank.
- Checking the map after storing on Two Sum style lookup: store-then-check matches an element with itself on inputs like `[3, 3]`.
- Assuming worst-case $`O(1)`$: adversarial keys drive any fixed hash to $`O(n)`$ chains.

**Practice**

- [LeetCode 706: Design HashMap](https://leetcode.com/problems/design-hashmap/) - Attempt cold with hidden tags. Implement `put`, `get` and `remove` with chaining or open addressing plus a load-factor resize. Add randomized `put`/`get`/`remove` histories checked against a `dict` oracle. Judge with the Example operation sequence. After submitting, read the AlgoMaster Design HashMap write-up (https://algomaster.io/learn/dsa/design-hashmap) and the handbook hash-collisions chapter for the resize contract.

**Stop when:** Your resize script asserts the 6/11/22/43 steps, and your `HashMap` passes 200 randomized histories against the `dict` oracle.

<details>
<summary>Self-test</summary>

1. Derive the expected cost of a chained lookup.
   - The key hashes to a uniform bucket plus a scan of its chain of expected length $`\alpha`$: $`O(1) + O(\alpha)`$.
2. Why does CPython resize at the 6th insert into an 8-slot table?
   - The usable fraction is $`2/3`$: $`8 \times 2/3 = 5.33`$, so the 6th insert exceeds it and doubles the table.
3. What breaks if deletion marks the slot empty instead of dummy?
   - Later keys that probed past the deleted slot become unreachable: their chain is cut and lookup wrongly reports absent.
4. State universal hashing in one line and why it helps.
   - Draw the hash function at random from a family where each colliding pair has probability at most $`1/m`$. The adversary cannot fix a bad input set in advance.

</details>

#### U6. Stacks, queues, deques and monotone structures

**About 5 h** · **Target:** Implement

Topics: Stacks, queues, circular buffers and deques; Monotone stacks and deques

Stacks suspend work until its context arrives; queues order it fairly. Their monotone variants turn quadratic scans into single passes across parsing, scheduling and windows.

**You can now**

- Implement stack, queue, deque and circular buffer from the contracts with $`O(1)`$ bounds.
- Derive the $`2n`$ push/pop bound for monotone stacks and deques and state the maintained order.
- Diagnose empty-structure, order and expiry defects (values versus indices).

**Study**

1. [Stacks and the call stack analogy](https://dsa.handbook.academy/curriculum/linear-data-structures/stacks/) (DSA Handbook - Foundations and linear patterns) - The LIFO contract; The call stack is the same data structure; LC 20 the deferred-match validator; What it actually costs (`push` amortized $`O(1)`$, LC 20 $`O(n)`$ time and space).
2. [Queues, deques, and circular buffers](https://dsa.handbook.academy/curriculum/linear-data-structures/queues-deques/) (DSA Handbook - Foundations and linear patterns) - The FIFO contract; The deque adds the back end; The circular buffer fixes the capacity; Why the patterns chapters teach the rest (LC 232 amortized queue); What it actually costs (`list.pop(0)` $`O(n)`$ against `deque` $`O(1)`$).
3. [Monotonic stack](https://dsa.handbook.academy/curriculum/stack-queue-patterns/monotonic-stack/) (DSA Handbook - Foundations and linear patterns) - The pattern (pop-while-violating then push); Why the work stays linear ($`2n`$ aggregate); Worked example LC 739 on `[73, 74, 75, 71, 69, 72, 76, 73]`; Largest rectangle: the sentinel-pop trick; Two pitfalls (indices, not values).
4. [Monotonic deque](https://dsa.handbook.academy/curriculum/stack-queue-patterns/monotonic-deque/) (DSA Handbook - Foundations and linear patterns) - The invariant (decreasing indices, front is the $`\operatorname{argmax}`$); The pattern (drop-front, pop-tail, push, emit); Worked example LC 239 on `[1, 3, -1, -3, 5, 3, 6, 7]` with $`k = 3`$; What it actually costs. Depth: The cost table lists the max-heap with lazy deletion as $`O(n \log k)`$ beside $`O(n)`$ space. The space column is right: stale entries stay buried, so the heap can hold $`n`$ entries and its worst case is $`O(n \log n)`$.

**Focus**

- Each index enters and leaves once: at most $`2n`$ stack ops and at most $`2n`$ deque ops. That is the whole linearity proof.
- Monotone structures store indices: values cannot report expiry.
- Deque order per slide: drop the expired front, pop smaller backs, push, emit the front.
- Python `list` is the stack and `collections.deque` is the queue. Swapped roles cost $`O(n)`$ per op at the wrong end.

**Reproduce:** From a blank file, implement sliding-window maximum with a monotone deque: on `[1, 3, -1, -3, 5, 3, 6, 7]` with $`k = 3`$ output `[3, 3, 5, 5, 6, 7]`. Differential-test it against the $`O(nk)`$ brute force with Hypothesis (lengths up to 50, $`k`$ up to 10, `derandomize`, `max_examples=200`) in Python 3.13: expect 1 passed.

**Traps**

- Storing values instead of indices: equal values from different positions become indistinguishable and expiry breaks.
- Emitting before pushing or popping the wrong end: the order is drop-front, pop-back, push, emit.
- `list.pop(0)` as a queue (about 45x slower than `deque` per drain at $`n = 20000`$ on the stated CPU and Python 3.13.14), and recursion past the default limit of 1000 frames, which raises `RecursionError` instead of growing.

**Practice**

- [LeetCode 20: Valid Parentheses](https://leetcode.com/problems/valid-parentheses/) - Implement the deferred-match validator with the terminal empty check. Judge with the Examples `()`, `()[]{}` and `([)]`. After submitting, compare against the handbook stacks section LC 20: the deferred-match validator.
- [LeetCode 739: Daily Temperatures](https://leetcode.com/problems/daily-temperatures/) - Implement the pop-while-smaller template storing indices. Judge with the Examples `[73, 74, 75, 71, 69, 72, 76, 73]` and `[30, 40, 50, 60]`. After submitting, compare your trace against the handbook monotonic-stack worked example on the same input.
- [LeetCode 239: Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/) - Attempt cold with hidden tags. Implement the monotone deque and judge with the Example `[1, 3, -1, -3, 5, 3, 6, 7]`, $`k = 3`$ giving `[3, 3, 5, 5, 6, 7]`. After submitting, read the AlgoMaster Sliding Window Maximum write-up (https://algomaster.io/learn/dsa/sliding-window-maximum) and the handbook monotonic-deque cost table.

**Stop when:** All three are accepted and your deque emits the worked trace exactly, with the $`2n`$ argument written beside it.

<details>
<summary>Self-test</summary>

1. Prove the monotone stack is $`O(n)`$.
   - Each element is pushed once and popped at most once, so the whole run performs at most $`2n`$ stack operations (aggregate method).
2. Argue the two-stack queue is amortized $`O(1)`$.
   - Each element moves from inbox to outbox at most once, so $`n`$ operations move at most $`2n`$ elements.
3. Why must the deque hold indices?
   - Expiry compares positions against $`i-k+1`$. Values alone cannot tell a live equal from an expired one.
4. What does the heap alternative cost on sliding maximum, and when does the deque win?
   - With lazy deletion, $`O(n \log n)`$ in the worst case: on increasing input no stale entry ever reaches the top, so the heap grows to $`n`$ entries. A heap or balanced tree with real deletion gets $`O(n \log k)`$. The deque's $`O(n)`$ beats both, and the gap grows with $`k`$.

</details>

#### U7. Two pointers and sliding windows

**About 5 h** · **Target:** Derive + Implement

Topics: Two-pointer invariants and ordering assumptions; Fixed and variable windows and monotonicity

Two pointers and windows replace nested loops with single passes wherever order or monotonicity lets one pointer's move settle another's. Recognizing the precondition is the skill.

**You can now**

- State the ordering or monotonicity precondition before moving a pointer.
- Implement opposite-ends, same-direction, fixed and variable windows with shrink triggers.
- Construct the negative-numbers counterexample that breaks shrinking windows.

**Study**

1. [Two pointers: opposite ends](https://dsa.handbook.academy/curriculum/pointers-window-prefix/two-pointers-opposite/) (DSA Handbook - Foundations and linear patterns) - Why the proof actually works - the shorter-wall case analysis; The four primitives; Worked example LC 11 on `[1, 8, 6, 2, 5, 4, 8, 3, 7]`; Worked example LC 15 with the three duplicate-skips; What it actually costs.
2. [Two pointers: same direction](https://dsa.handbook.academy/curriculum/pointers-window-prefix/two-pointers-same-direction/) (DSA Handbook - Foundations and linear patterns) - The four primitives (seed, scan, keep, commit); Worked example LC 26 on `[1, 1, 2, 2, 3]`; When the pattern bends (tail-fill LC 283, three-way partition LC 75, backward merge LC 88).
3. [Sliding window: fixed size](https://dsa.handbook.academy/curriculum/pointers-window-prefix/sliding-window-fixed/) (DSA Handbook - Foundations and linear patterns) - The pattern (build-first-window then slide); The four primitives; Worked example LC 643 on `[2, 1, 5, 1, 3, 2, 1, 4]` with `k = 3`; Frequency-map slide with the matched counter (LC 567).
4. [Sliding window: variable size](https://dsa.handbook.academy/curriculum/pointers-window-prefix/sliding-window-variable/) (DSA Handbook - Foundations and linear patterns) - The pattern (expand right, shrink while broken); The four primitives plus the shrink trigger; Worked example LC 3 on `pwwkew`; Last-index jump; `have == required` for LC 76.

**Focus**

- Opposite ends needs sortedness or an equivalent extremum argument; the shorter-wall move is proved by case analysis.
- Variable windows need a monotone shrink trigger: all-nonnegative numbers for sums, distinctness for longest-substring.
- Last-index jumps and matched counters keep $`O(1)`$ per step; rescanning the window on each slide is the $`O(nk)`$ trap.
- Negatives break shrinking: the fix is prefix sums, next unit.

**Reproduce:** From a blank file, implement longest-substring with the last-seen jump and differential-test it against the $`O(n^2)`$ brute force on alphabet `abc` up to length 12 (`derandomize`, `max_examples=300`) in Python 3.13: expect 1 passed. Then exhibit `[1, -1, 1, 1]` seeking the shortest subarray with sum at least 2: the shrink loop reports length 4 and misses the tail `[1, 1]` of length 2.

**Traps**

- Forgetting to sort for opposite-ends moves, or sorting when the original indices are the answer.
- Half-open confusion: an inclusive $`[l, r]`$ window changes the shrink condition and the length formula versus $`[l, r)`$.
- Counters with stale zero entries: membership tests see dead keys unless counts are deleted or a have-counter is maintained.

**Practice**

- [LeetCode 167: Two Sum II - Input Array Is Sorted](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/) - Implement the opposite-ends move with the sortedness precondition stated in a comment. Judge with the Examples `[2, 7, 11, 15]` target 9 and `[2, 3, 4]` target 6. After submitting, compare against the handbook two-pointers-opposite section The four primitives.
- [LeetCode 3: Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/) - Attempt cold with hidden tags. Implement the variable window with last-seen jumps. Judge with the Examples `abcabcbb`, `bbbbb` and `pwwkew`. After submitting, read the AlgoMaster Longest Substring write-up (https://algomaster.io/learn/dsa/longest-substring-without-repeating-characters) and the handbook variable-window worked example on pwwkew.

**Stop when:** Both are accepted cold with the invariant stated first, and your negatives trace shows exactly which shrink step discards the optimum.

<details>
<summary>Self-test</summary>

1. Prove the Container move: why advance the shorter wall?
   - Area is width times the shorter wall. Moving the taller wall cannot raise the minimum and shrinks the width; only moving the shorter wall can find a taller bound. Case analysis over where the optimum sits.
2. Why does the Two Sum II move rule fail on unsorted input?
   - The rule (sum too small: advance left) assumes everything left of right is no larger. Unsorted input breaks the ordering the rule reads.
3. Trace the negatives counterexample `[1, -1, 1, 1]` with target sum at least 2.
   - Running sums are 1, 0, 1, 2. The shrink loop first fires at the last element and reports length 4. Dropping the leading 1 leaves sum 1, so the loop stops before it drops the -1, which would raise the sum back to 2 at length 2. Shrinking assumes that removing an element never raises the sum, and a negative element breaks that.
4. Why do the three 3Sum duplicate skips matter?
   - Without skipping equal outer values and equal left and right values, each duplicate occurrence re-emits the same triple: correct values with wrong multiplicity and wasted output.

</details>

#### U8. Prefix sums, difference arrays and prefix plus hash

**About 4 h** · **Target:** Implement

Topics: Prefix sums, difference arrays and prefix plus hash

Precomputation trades linear space for constant queries, and the prefix-plus-hash reduction is the template for turning a range condition into a lookup across counting problems.

**You can now**

- Build prefix and difference arrays and answer range queries in $`O(1)`$.
- Reduce subarray counting to prefix-frequency lookup with the seed-first rule.
- Choose windows versus prefix-plus-hash from the sign of the numbers.

**Study**

1. [Prefix sums and difference arrays](https://dsa.handbook.academy/curriculum/pointers-window-prefix/prefix-sums/) (DSA Handbook - Foundations and linear patterns) - The pattern (build $`\mathrm{prefix}[n+1]`$ once, query in $`O(1)`$); Worked example LC 303; What it costs (1D and 2D builds and queries, difference-array updates); 2D prefix sums: inclusion-exclusion on four corners; Difference arrays: the inverse direction.
2. [The prefix-sum + hash-map combo](https://dsa.handbook.academy/curriculum/pointers-window-prefix/prefix-sum-hash/) (DSA Handbook - Foundations and linear patterns) - Why sliding window fails on negatives, in one trace (`[1, -1, 1, 1]`); The reduction ($`\mathrm{prefix}[l] = \mathrm{prefix}[r+1] - k`$); The pattern with the `{0: 1}` seed; Worked example LC 560 on `[1, 1, 1]` with $`k = 2`$; When the pattern bends (modulo LC 974, first-seen LC 525).

**Focus**

- The prefix array has $`n+1`$ entries with $`P[0] = 0`$: a range sum is $`P[r+1]-P[l]`$, with no special case.
- Counting needs the seed `{0: 1}`: subarrays starting at index 0 would otherwise be missed.
- Difference arrays mark $`+v`$ at $`l`$ and $`-v`$ at $`r+1`$; one prefix pass materializes the array, and a second prefix over it answers queries.
- Python's `%` already normalizes negatives for positive $`k`$; the `((x%k)+k)%k` form is for C++ and Java ports.

**Reproduce:** By hand on `[1, 1, 1]` with $`k = 2`$: seed `{0: 1}`; running prefixes 1, 2, 3 need -1, 0, 1 with counts 0, 1, 1, totaling 2. Then implement range-add via difference marks plus range-sum queries, differential-tested against naive loops ($`n`$ up to 20, up to 10 updates, `derandomize`) in Python 3.13: expect 1 passed.

**Traps**

- Off-by-one: $`P`$ has $`n+1`$ entries and the query is $`P[r+1]-P[l]`$.
- Missing seed `{0: 1}`: every valid prefix starting at index 0 vanishes.
- Using a window on possibly-negative inputs; reach for prefix-plus-hash instead.

**Practice**

- [LeetCode 303: Range Sum Query - Immutable](https://leetcode.com/problems/range-sum-query-immutable/) - Build the $`n+1`$ prefix once and answer each `sumRange` in $`O(1)`$. Judge with the Example array `[-2, 0, 3, -5, 2, -1]`. After submitting, compare against the handbook prefix-sums worked example LC 303.
- [LeetCode 560: Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k/) - Implement the prefix-frequency reduction with the `{0: 1}` seed. Judge with the Examples `[1, 1, 1]` $`k = 2`$ giving 2, and `[1, 2, 3]` $`k = 3`$ giving 2. After submitting, compare your trace against the handbook prefix-sum-hash worked example on [1, 1, 1].

**Stop when:** Both are accepted, your hand trace totals 2, and you can state the window-versus-prefix choice rule from the sign of the input.

<details>
<summary>Self-test</summary>

1. Derive the 2D range-sum formula.
   - $`P[i+1][j+1] - P[i][j+1] - P[i+1][j] + P[i][j]`$: subtract the top and left rectangles, add back the doubly-subtracted corner.
2. Why does the difference marking work?
   - Telescoping: position x accumulates all marks at indices up to x, exactly the updates covering x. A second prefix over the materialized array answers sums.
3. Where does the `{0: 1}` seed enter the LC 560 trace?
   - Prefix 2 needs 0, which never appears as a running total. The seed supplies its count of 1.
4. Modulo keys with negative running sums in Python?
   - `key = running % k` works directly since Python floors to non-negative for positive $`k`$. Ports to C++ or Java need the double-mod form.

</details>

### Mini-project: Hash map, two tag-hidden linear problems and a shrunk wrong solution

**About 8 to 12 hours.** In your own repository, build an open-addressing hash map and check it against `dict` with randomized operation histories, solve two tag-hidden linear-structure problems with each invariant written before the code, and let Hypothesis expose and minimize a plausible wrong solution.

1. Implement a linear-probing hash map with `get`, `put`, `delete` by tombstone, and resizing at a load factor you state. Write its invariant (every stored key is reachable from its home slot without crossing an empty slot) and the amortized cost of `put` from the doubling argument.
2. Write a Hypothesis rule-based state machine that runs `put`, `get`, `delete` and `len` against a `dict` oracle, with an `invariant` method that checks the probe invariant and the load factor after every step. Draw some keys as multiples of the capacity so probe chains and tombstones are exercised.
3. Seed two defects in copies: `delete` that empties the slot instead of leaving a tombstone, and `resize` that copies slots by index instead of reinserting. Show the state machine fails on each, and keep the shrunk histories as regression tests.
4. Solve LC 1248 Count Number of Nice Subarrays without reading its tags. Write the invariant first (a running count of odd numbers and a map of prefix counts seeded with `{0: 1}`), state $`O(n)`$ time and space, check the three examples (2, 0 and 16), and differential-test against an $`O(n^2)`$ brute force.
5. Solve LC 862 Shortest Subarray with Sum at Least K without reading its tags. First write the plausible two-pointer window that shrinks while the sum is at least $`k`$, and let Hypothesis find and shrink a failing input against brute force (expect something as small as `[-1, 1]` with $`k = 1`$, where the window answers -1 instead of 1). State the assumption negative numbers break, then solve with prefix sums and a monotone deque, writing its invariant (the deque holds indices with increasing prefix sums).
6. Measure probes per successful lookup at load factors 0.5 and 0.75 for three key distributions: sequential ints, random 62-bit ints and multiples of the capacity. Predict each row first. Random keys should land near the linear-probing estimate $`(1 + 1/(1 - a))/2`$, 1.5 and 2.5; explain why sequential ints take one probe and capacity multiples take about $`n/2`$.

**Deliverables**

- The hash map module with its invariant and cost notes, the state machine and the two seeded-defect histories.
- Solutions to LC 1248 and LC 862 with the invariant and bound above the code, brute-force differential tests and the shrunk window counterexample.
- A probe-count table for three key distributions at two load factors, with predictions beside the measurements.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [LeetCode 1248: Count Number of Nice Subarrays](https://leetcode.com/problems/count-number-of-nice-subarrays/). Submit after your own differential test passes.
- external-tests: [LeetCode 862: Shortest Subarray with Sum at Least K](https://leetcode.com/problems/shortest-subarray-with-sum-at-least-k/). Submit the deque solution, not the window.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Hash map correctness | The state machine runs 200 derandomized histories against `dict`, including colliding keys, and both seeded defects fail with shrunk histories. | Each shrunk history is a few readable steps, is kept as a regression test, and the invariant method names the property it broke. |
| Invariants before code | Both solutions carry the invariant and the time and space bound above the code, written before submitting. | The invariants are also asserted in a debug mode that the random tests switch on. |
| Wrong solution exposed | Hypothesis finds and shrinks a failing input for the window, and the write-up states the broken assumption: removing an element never raises the sum. | A property test restricted to nonnegative inputs shows the same window is correct there. |
| Measurement | The probe table covers three key distributions at two load factors, and the random-key rows are compared with the linear-probing estimate. | Predictions are written before measuring, and a timing against `dict` states the Python version and CPU and explains the gap. |

Feeds into: Capstone correctness library: the hash map and its state machine. Failure evidence: the two seeded hash-map defects and the shrunk window counterexample.

### Resource route

- **Primary - Course:** [DSA Handbook - Foundations and linear patterns](https://dsa.handbook.academy/curriculum/) - Study Part 0, Part 1, Part 3 and Part 4 in order, plus the Part 5 Linked-list fundamentals chapter. Use the routing-rule pages for arrays versus lists, map choice, stack versus queue, two pointers, sliding windows and prefix methods before seeing solved code.
- **Required - Practice:** [AlgoMaster DSA - linear structures slice](https://algomaster.io/learn/dsa/course-roadmap) - Attempt Design HashMap, Longest Substring Without Repeating Characters and Sliding Window Maximum cold. Hide tags, state the invariant first, and add randomized operation histories to Design HashMap.
- **Support - Theory:** [MIT 6.042J - asymptotics and invariants](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/pages/readings/) - Use the asymptotics, state-machine invariants and proof-method readings when a cost or correctness argument is weak. Solve only the matching problems.
- **Support - Theory:** [Algorithms lecture notes - amortized analysis and hashing](https://jeffe.cs.illinois.edu/teaching/algorithms/#notes) - Use note 9 Amortized Analysis for the summation, taxation, charging and potential-function proofs, and note 5 Hashing for chaining, universal hashing and open-addressing analysis, when the handbook treatment is too brief for a proof.
- **Support - Application:** [Algorithmica - memory and data layout](https://en.algorithmica.org/hpc/) - Read the memory hierarchy, cache and complexity-model chapters, then measure one contiguous-versus-linked and one hash-versus-ordered workload crossover.
- **Optional - Assessment:** [NeetCode - unseen linear problems](https://neetcode.io/practice) - Use only for two tag-hidden transfer problems after the AlgoMaster slice. Do not start another full roadmap or watch a solution before the attempt is complete.
- **Support - Reference:** [Hypothesis documentation - Quickstart and stateful testing](https://hypothesis.readthedocs.io/en/latest/) - Follow Quickstart for `@given` strategies and the pytest combination, Configuring test settings for `max_examples` and `derandomize`, then Rule-based state machines (`rule`, `precondition`, `invariant`, `run_state_machine_as_test`) for randomized operation histories against `dict` and `deque` oracles.
- **Reference - Reference:** [CPython source - list and dict objects](https://github.com/python/cpython) - Read `list_resize` in `Objects/listobject.c` for the growth formula and pattern comment, and the `USABLE_FRACTION` definition, perturbation-probing comment and dummy-entry handling in `Objects/dictobject.c`. Read the cited functions and comments only.

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

### Study units

#### U1. Sorting contracts, lower bounds and merge sort

**About 5 h** · **Target:** Derive + Implement

Topics: Sorting stability, in-place behavior and comparator contracts; Comparison lower bounds and non-comparison assumptions; Stable merge sort and divide-combine reasoning

Sorting is the first place an ordering invariant pays off, and the lower bound tells you when to stop tuning comparisons and change the input assumptions instead.

**You can now**

- State the sorting contract (stability, in-place behavior, comparator rules) and pick merge sort, quicksort or heap sort from the binding constraint.
- Prove the comparison-sorting lower bound with a decision-tree argument and explain why counting and radix sorts escape it.
- Implement stable top-down merge sort with a shared auxiliary buffer and check it against `sorted` with randomized differential tests.

**Study**

1. [Comparison sorts I: insertion sort and merge sort](https://dsa.handbook.academy/curriculum/search-sort/comparison-sorts-1/) (DSA Handbook - search, trees and heaps) - Algorithm A: insertion sort; Algorithm B: merge sort; Why the merge step gives you $`\Theta(n \log n)`$; The stability table; Worked example: merge sort on `[5, 2, 4, 7, 1, 3, 2, 6]`; Pitfalls.
2. [Quicksort vs mergesort vs heapsort, picking your sort](https://dsa.handbook.academy/patterns/quicksort-vs-mergesort-vs-heapsort/) (DSA Handbook Patterns - quicksort vs mergesort vs heapsort) - The decision; Algorithms compared; Side-by-side; Common misconceptions.
3. [Erickson Chapter 1: Mergesort](https://jeffe.cs.illinois.edu/teaching/algorithms/book/Algorithms-JeffE.pdf) (Algorithms) - Section 1.4 Mergesort (pp. 26 to 28), including Lemma 1.1 (Merge), Theorem 1.2 (MergeSort) and the recurrence analysis.
4. [Lecture Note 12: Lower Bounds, decision trees and sorting](https://jeffe.cs.illinois.edu/teaching/algorithms/notes/12-lowerbounds.pdf) (Algorithms) - Sections 12.2 Decision Trees, 12.3 Information Theory, 12.4 But wait a second... and 12.5 Sorting.
5. [Linear-time sorts: counting, radix, bucket](https://dsa.handbook.academy/curriculum/search-sort/linear-sorts/) (DSA Handbook - search, trees and heaps) - Three preconditions, three algorithms; Counting sort. Depth: Skim LSD radix sort and Bucket sort for their preconditions only (fixed-width keys; near-uniform keys). Only counting sort is implemented here.

**Focus**

- Stability means equal keys keep their input order. Merge sort is stable because the merge emits the left run on ties (`<=`, not `<`). Quicksort and heap sort are not stable.
- The merge recurrence $`T(n) = 2T(n/2) + \Theta(n)`$ gives $`\Theta(n \log n)`$ in the best, average and worst case. The shared buffer costs $`\Theta(n)`$ extra space plus $`\Theta(\log n)`$ stack; the already-sorted short-circuit recovers $`\Theta(n)`$ on sorted input.
- The lower bound counts leaves: $`n`$ distinct keys admit $`n!`$ permutations, so a decision tree needs height at least $`\lg(n!)`$, which is $`\Omega(n \log n)`$ by Stirling. It binds only comparison sorts on general input; counting sort never compares and needs bounded integer keys instead.
- Equal asymptotics do not mean equal speed in Python. On a 12th Gen Intel Core i9-12900K with Python 3.13.14, a pure-Python merge sort on 20,000 random ints took 0.018 s against 0.0017 s for `list.sort`, about 10x. State the CPU and version with every timing you report.

**Reproduce:** From a blank file, implement top-down merge sort with one shared auxiliary buffer, midpoint `lo + (hi - lo)//2`, `<=` in the merge, and the already-sorted short-circuit. On `[5, 2, 4, 7, 1, 3, 2, 6]` it must return `[1, 2, 2, 3, 4, 5, 6, 7]`. Stability check: `[(5, 'a'), (3, 'b'), (5, 'c')]` must come back `[(3, 'b'), (5, 'a'), (5, 'c')]`. Then run a Hypothesis differential test against `sorted` on 300 lists up to length 60 with seed 0.

**Traps**

- Using `<` instead of `<=` in the merge. Ties taken from the right run break stability silently while every sortedness test still passes.
- Allocating a fresh auxiliary list in every merge call. Allocate once at the top; per-call allocation adds a hidden linear factor at each of the $`\log n`$ levels.
- Reading the lower bound as a ban on fast sorting. It bans fast comparison sorting on general input; bounded keys (counting) or fixed-width keys (radix) change the model and the bound does not apply.

**Practice**

- [LeetCode 912: Sort an Array](https://leetcode.com/problems/sort-an-array/) - Solve with your merge sort; example inputs `[5,2,3,1]` and `[5,1,1,2,0,0]`. Attempt before reading solutions. After submitting, read the AlgoMaster write-up for Sort an Array (https://algomaster.io/learn/dsa/sort-an-array) and compare its approach with yours.
- [LeetCode 88: Merge Sorted Array](https://leetcode.com/problems/merge-sorted-array/) - Merge in place from the end with $`O(1)`$ extra space; example inputs `([1,2,3,0,0,0], 3, [2,5,6], 3)` and `([0], 0, [1], 1)`. This is the merge step under a no-buffer constraint. After submitting, read the AlgoMaster write-up for Merge Sorted Array (https://algomaster.io/learn/dsa/merge-sorted-array).

**Stop when:** Your merge sort returns the sorted handbook example, keeps equal-key order, passes 300 Hypothesis cases against `sorted`, and you can state the decision-tree bound and the counting-sort precondition without notes.

<details>
<summary>Self-test</summary>

1. Prove that any comparison sort needs $`\Omega(n \log n)`$ comparisons in the worst case.
   - Model the sort as a decision tree: each internal node is one comparison and each leaf is one output permutation. Sorting $`n`$ distinct keys needs at least $`n!`$ leaves. A binary tree with $`L`$ leaves has height at least $`\lg L`$, so the height is at least $`\lg(n!)`$. By Stirling, $`n! > (n/e)^n`$, so $`\lg(n!) > n \lg n - n \lg e = \Omega(n \log n)`$.
2. Why does counting sort not contradict that bound?
   - The bound counts comparisons on general input. Counting sort never compares keys; it indexes by key value, which needs bounded integer keys with $`k = O(n)`$ for linear time. Change the assumption and the bound does not apply.
3. Is Python's `list.sort` stable, and how do you check from a REPL?
   - Yes, it is Timsort and stable. Check `sorted([(5, 'a'), (3, 'b'), (5, 'c')], key=lambda p: p[0])`: the two 5s keep the order (`'a'`) before (`'c'`).
4. Why does merge sort cost $`\Theta(n \log n)`$ even on already-sorted input without the short-circuit?
   - Every level still visits all $`n`$ elements to merge, and there are about $`\log_2 n`$ levels regardless of order. The short-circuit only skips the merge work when the two runs are already ordered, which recovers $`\Theta(n)`$ on sorted input.

</details>

#### U2. Partitioning, quicksort, quickselect and top-k

**About 5 h** · **Target:** Derive + Implement

Topics: Partition invariants, quicksort and adversarial pivots; Selection, quickselect and top-k trade-offs

Partitioning is the one primitive behind quicksort, quickselect and three-way color sorts. Its invariant decides whether equal keys cost linear or quadratic time.

**You can now**

- State the Lomuto partition invariant and maintain it while coding, including the duplicate-key behavior.
- Implement randomized quicksort and iterative quickselect with differential tests, and show they degenerate without a random pivot or three-way partition on adversarial input.
- Pick between a heap, quickselect and full sort for a top-k task from streaming, sorted-output and mutation constraints.

**Study**

1. [Comparison sorts II: quicksort, partition, and the production hybrids](https://dsa.handbook.academy/curriculum/search-sort/comparison-sorts-2/) (DSA Handbook - search, trees and heaps) - Algorithm A: quicksort with median-of-three Lomuto partition; Why the obvious version explodes on sorted input; The teaching reference; Worked example: median-of-three Lomuto on `[5,2,4,7,1,3,2,6]`; Cost; Pitfalls.
2. [Erickson Chapter 1: Quicksort](https://jeffe.cs.illinois.edu/teaching/algorithms/book/Algorithms-JeffE.pdf) (Algorithms) - Section 1.5 Quicksort (pp. 29 to 31), including the Lomuto Partition pseudocode and the pivot-rank recurrence.
3. [Quickselect: linear-time selection](https://dsa.handbook.academy/curriculum/search-sort/quickselect/) (DSA Handbook - search, trees and heaps) - The primitive: partition; The trick: recurse on one side; Random pivot is non-negotiable; Worked example: LC 215 on `[3,2,1,5,6,4]`, `k=2`; Quickselect or heap?; Pitfalls. Depth: Read Why expected linear works for the recurrence shape only; its expectation proof belongs to algorithms/decomposition-greedy-randomness/randomized-algorithms. Skim Why nobody ships median-of-medians for the verdict; the deterministic proof belongs to algorithms/decomposition-greedy-randomness/divide-conquer-recurrences.
4. [Erickson Chapter 1: Quickselect and good pivots](https://jeffe.cs.illinois.edu/teaching/algorithms/book/Algorithms-JeffE.pdf) (Algorithms) - Section 1.8 Linear-Time Selection (pp. 35 to 36), Quickselect and Good pivots. Depth: Stop before the Analysis on pp. 37 to 38; the median-of-medians proof belongs to algorithms/decomposition-greedy-randomness/divide-conquer-recurrences.
5. [Quickselect vs heap for top-K](https://dsa.handbook.academy/patterns/quickselect-vs-heap-top-k/) (DSA Handbook Patterns - quickselect vs heap for top-K) - The decision; Algorithms compared; Side-by-side; Common misconceptions.

**Focus**

- Lomuto invariant: at every scan step, `arr[lo..i]` holds elements <= pivot, `arr[i+1..j-1]` holds elements > pivot, and `arr[j..hi-1]` is unexamined. The final swap puts the pivot at its final sorted index. Median-of-three places the pivot at `arr[hi]`; that placement is part of the contract.
- With the handbook's `<=` in the scan, keys equal to the pivot join the left band; Erickson's strict `<` sends them right. Either way all-equal input puts every key on one side, so Lomuto degenerates to $`\Theta(n^2)`$ even with a random pivot. Three-way (Dutch flag) partition groups equal keys in one pass and recovers $`\Theta(n)`$.
- Random pivot is the correctness fix, not an optimization: a fixed last-element pivot is $`\Theta(n^2)`$ on sorted input. Judges include large sorted and duplicate-heavy arrays, so test both yourself.
- Top-k routing: a stream or tiny $`k`$ favors a size-k heap ($`O(n \log k)`$ time, $`O(k)`$ space, no mutation); a whole array in memory with unsorted output favors quickselect (expected $`O(n)`$); sorted output adds $`O(k \log k)`$. In CPython, `heapq.nlargest` runs in C: on a 12th Gen Intel Core i9-12900K with Python 3.13.14 it took about 1.3 ms against about 6 ms for an in-place pure-Python quickselect on 100,000 ints with $`k = 100`$, so count comparisons and wall-clock time separately.

**Reproduce:** From a blank file, implement Lomuto partition with a random pivot swap and iterative quickselect for kth largest. Assert the post-condition on every partition call (pivot at its final index, everything left of it `<=` pivot, everything right of it `>` pivot). `quickselect([3,2,1,5,6,4], 2)` must return 5. Run a Hypothesis differential test against `sorted` on 300 lists up to length 40, including sorted and all-equal inputs, then add a three-way partition and time both on 10,000 equal keys.

**Traps**

- Converting $`k`$ wrong: kth largest wants target index $`n-k`$, kth smallest wants $`k-1`$. For $`n=6`$, $`k=2`$, the target index is 4.
- Quickselect mutates the caller's array. Copy at the boundary when the caller needs the input intact.
- Recursing into the wrong side after partition. The pivot sits at its final sorted position; only the side containing the target index is read again. The rest is partitioned, not sorted.

**Practice**

- [LeetCode 215: Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/) - Solve with iterative quickselect, a random pivot and a three-way partition; example inputs `([3,2,1,5,6,4], 2)` and `([3,2,3,1,2,4,5,5,6], 4)`. Include sorted-input and all-duplicate tests of 100,000 elements before submitting. After submitting, read the AlgoMaster write-up for Kth Largest Element in an Array (https://algomaster.io/learn/dsa/kth-largest-element-in-an-array).
- [LeetCode 347: Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/) - Hash the counts first, then select top $`k`$; example inputs `([1,1,1,2,2,3], 2)` and `([1], 1)`. Solve it twice: once with a size-k heap, once with quickselect on `(count, value)` pairs, and state which you would ship for a stream. After submitting, read the AlgoMaster write-up for Top K Frequent Elements (https://algomaster.io/learn/dsa/top-k-frequent-elements).

**Stop when:** Your quickselect returns 5 on the handbook example, survives sorted and all-equal inputs, passes 300 differential cases, and you can route a new top-k task to heap, quickselect or full sort from its streaming and output constraints.

<details>
<summary>Self-test</summary>

1. State the Lomuto invariant and what the final swap establishes.
   - During the scan, `arr[lo..i]` holds elements <= pivot, `arr[i+1..j-1]` holds elements > pivot, and `arr[j..hi-1]` is unexamined. The final swap moves the pivot just past the `<=` band, so it sits at its final sorted index with everything left <= it and everything right > it.
2. Why does Lomuto with a random pivot still go quadratic on all-equal input, and what fixes it?
   - Every key equal to the pivot lands on one side (left with `<=`, right with `<`), so each partition removes only the pivot and $`T(n) = T(n-1) + \Theta(n) = \Theta(n^2)`$. Three-way partition groups all pivot-equal keys in one pass, so the recursion skips them and the cost is $`\Theta(n)`$.
3. When does a size-k heap beat quickselect for top-k, and when does it lose asymptotically?
   - The heap wins when the input streams (quickselect needs random access to the whole array) or when $`O(k)`$ space without mutation matters. At $`k = n/2`$ the heap costs $`O(n \log n)`$ and loses its edge while quickselect stays expected $`O(n)`$. Sorted output adds $`O(k \log k)`$ on top of either.
4. What does introselect change about quickselect's worst case?
   - It watches the recursion depth and switches to a guaranteed method past about $`2 \lg n`$ levels: median-of-medians in Musser's design, which keeps the worst case linear, or heap selection in libstdc++'s `nth_element`, which caps it at $`O(n \log n)`$. The median-of-medians proof belongs to algorithms/decomposition-greedy-randomness/divide-conquer-recurrences.

</details>

#### U3. Binary search: intervals, bounds and feasibility predicates

**About 5 h** · **Target:** Derive + Implement

Topics: Binary-search interval conventions and termination; Lower bound, upper bound and duplicate handling; Binary search on a monotone feasibility predicate

Binary search fails in production through boundary bugs, not through asymptotics. One invariant derives every variant, and the same invariant searches answer spaces that are not arrays at all.

**You can now**

- Prove the binary-search loop invariant and derive safe boundary updates for lower-bound, upper-bound and first-true variants.
- Implement exact-match, lower-bound, upper-bound and answer-space search from the invariant, with differential tests against `bisect`.
- Turn a monotone feasibility predicate into `lo`/`hi` bounds with cost $`O(F \log W)`$, and defend why monotonicity (not sortedness) is the requirement.

**Study**

1. [Binary search: the canonical version](https://dsa.handbook.academy/curriculum/search-sort/binary-search-canonical/) (DSA Handbook - search, trees and heaps) - Pick the template from the question, not the input; Template A: exact-match on a closed interval; Template B: lower-bound on a half-open interval; Template C: predicate-driven leftmost; The off-by-one death zone.
2. [Binary search variants: `lower_bound`, `upper_bound`, peaks, and rotated arrays](https://dsa.handbook.academy/curriculum/search-sort/binary-search-variants/) (DSA Handbook - search, trees and heaps) - Variant 1: `lower_bound` and `upper_bound` on duplicates; Variant 4: binary search on the answer; Pitfalls. Depth: Skim Variants 2, 3 and 5 (rotated arrays, peaks, cross-array partition) for recognition only; they are not implemented here.
3. [Lecture Note 12: the dictionary lower bound](https://jeffe.cs.illinois.edu/teaching/algorithms/notes/12-lowerbounds.pdf) (Algorithms) - Section 12.3 Information Theory. Depth: Read only the dictionary lower-bound argument (Omega(log n) queries); the sorting sections belong to the merge-sort unit.
4. [Algorithmica: Binary Search](https://en.algorithmica.org/hpc/data-structures/binary-search/) (Algorithmica - search and sorting performance) - Binary Search (The Bottleneck); Removing Branches. Depth: Read for the branch-prediction and cache explanation only. Every speedup number there (2.5x to 3x branchless on small arrays, about 2x Eytzinger against `std::lower_bound`) is a C++ measurement with Clang 10 on Zen 2; do not transfer any crossover point to Python.

**Focus**

- Closed `[lo,hi]` pairs with `while lo <= hi` and `hi=mid-1`; half-open `[lo,hi)` pairs with `while lo < hi` and `hi=mid`. Mixing the pairs is the non-termination bug.
- `lower_bound` keeps equality right with `nums[mid] < target`; `upper_bound` keeps equality left with `nums[mid] <= target`. Their difference counts duplicates.
- Answer-space search is Template C with a monotone predicate: feasibility must hold above (or below) a threshold with no gaps. Cost is $`O(F \log W)`$ for predicate cost $`F`$ and width $`W`$.
- Algorithmica's C++ numbers explain why equal-asymptotic searches cross over (an unpredictable branch costs 10 to 15 cycles, a cache miss up to 300), but Python's interpreter overhead moves every crossover. Verify bounds against `bisect`, not against ported constants.

**Reproduce:** From a blank file, implement `lower_bound`, `upper_bound` and a first-true search on `[lo,hi)`. On `[1,2,2,2,3]` with target 2, return 1 and 4. Reproduce Koko: piles `[3,6,7,11]` with `h=8` must return 4. Run a Hypothesis differential test of both bounds against `bisect_left` and `bisect_right` on 300 sorted lists up to length 30.

**Traps**

- Returning `lo` for every template. The upper-bound twin and Template A need their own return values; derive each from the invariant instead of memorizing one.
- Writing `lo=mid` or `hi=mid` in Template A after a miss. The closed interval needs `mid+1` and `mid-1` to shrink; the half-open forms are the ones that keep `mid`.
- Searching on a predicate that is not monotone. Prove `hours(k)` is nonincreasing in $`k`$ (or your predicate's direction) before trusting the loop; a gap in feasibility silently returns a wrong answer.

**Practice**

- [LeetCode 875: Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas/) - Solve with a monotone `hours` predicate on `[1, max(piles)]`; example piles `[3,6,7,11]` with `h=8` expects 4. Attempt cold: state the predicate and its monotonicity before coding. After submitting, read the AlgoMaster write-up for Koko Eating Bananas (https://algomaster.io/learn/dsa/koko-eating-bananas).
- [LeetCode 34: Find First and Last Position of Element in Sorted Array](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/) - Two bound searches; example inputs `([5,7,7,8,8,10], 8)` expects `[3,4]` and `([5,7,7,8,8,10], 6)` expects `[-1,-1]`. Cover the empty array and the absent target without extra branches. After submitting, read the AlgoMaster write-up for Find First and Last Position of Element in Sorted Array (https://algomaster.io/learn/dsa/find-first-and-last-position-of-element-in-sorted-array).

**Stop when:** Your three searches match `bisect` on 300 random cases, Koko returns 4, and you can write any bound variant from its invariant without trial edits.

<details>
<summary>Self-test</summary>

1. Prove Template B terminates with lo at the lower bound.
   - Invariant: every index `j < lo` has `nums[j] < target` and every index `k >= hi` has `nums[k] >= target`. Each iteration replaces `[lo,hi)` with a strictly smaller interval that preserves the invariant, since `mid` sits strictly inside `while lo < hi`. The width reaches zero, so `lo == hi`, and the invariant says every index below `lo` is < target and every index from `lo` on is >= target (`lo = n` when none is), so `lo` is the lower bound.
2. On `[1,2,2,2,3]`, what do exact-match search, `lower_bound` and `upper_bound` return for target 2, and why?
   - Exact match returns some index in `{1,2,3}`. `lower_bound` returns 1 because the strict comparison keeps equality right; `upper_bound` returns 4 because the non-strict comparison keeps equality left. The duplicate count is $`4 - 1 = 3`$.
3. Why is binary search correct on the Koko predicate when speeds are not stored in an array?
   - `hours(k)` is nonincreasing in $`k`$: a faster speed never needs more hours. That monotonicity is the only requirement; the loop searches the predicate, not a sorted array. Each probe scans $`n`$ piles, so the cost is $`O(n \log \max(\text{piles}))`$.
4. A colleague ports Algorithmica's branchless binary search to Python expecting 2.5x. What do you tell them?
   - The 2.5x to 3x number is Algorithmica's C++ measurement (Clang 10, Zen 2) on small arrays. Python's per-iteration interpreter overhead dominates and removes the branch-prediction effect, so the constant does not transfer. Measure with `timeit` on the real workload instead.

</details>

#### U4. Tree representation and traversals

**About 4 h** · **Target:** Implement

Topics: Tree nodes, parent state, recursion and iterative stacks; Preorder, inorder, postorder and level-order traversal

Every tree algorithm is a traversal with extra state. The traversal order decides which questions a single pass can answer.

**You can now**

- Represent binary trees with node objects and array layouts, and convert between them.
- Implement recursive and iterative preorder, inorder, postorder and level-order traversals with differential tests.
- Diagnose recursion-depth, null-marker and queue-shape defects on skewed, empty and single-node trees.

**Study**

1. [Binary tree fundamentals](https://dsa.handbook.academy/curriculum/trees-heaps/binary-tree-fundamentals/) (DSA Handbook - search, trees and heaps) - What a binary tree is; Three shape restrictions worth naming; Two ways to store a tree in memory; The post-order recursion template; Recursion depth on skewed inputs.
2. [Tree traversals: pre, in, post](https://dsa.handbook.academy/curriculum/trees-heaps/tree-traversals/) (DSA Handbook - search, trees and heaps) - The five-line skeleton; The canonical tree; Iterative inorder via explicit stack; Iterative pre and post via explicit stack; Building a tree from two of its traversals; Pitfalls that bite. Depth: Skim the LC 297 worked example for the null-marker rule only; the full codec is not implemented here.
3. [Level-order traversal: BFS on trees](https://dsa.handbook.academy/curriculum/trees-heaps/level-order-traversal/) (DSA Handbook - search, trees and heaps) - The trigger; The pattern; What changes between the variants; Two pitfalls that bite.

**Focus**

- Height convention used here: `height(null) = 0` and a leaf has height 1 (nodes on the path). The AVL chapter switches to edges; never mix the two conventions in one argument.
- Iterative inorder keeps every ancestor whose left subtree is done but whose value is unemitted; after emitting, move to `cur.right`, not `None`.
- Level order needs the `level_size = len(queue)` snapshot taken once per level. Reading the queue length inside the inner loop merges levels.
- CPython's default recursion limit is 1000 (check with `sys.getrecursionlimit`), so a recursive traversal fails on a skewed tree of a few thousand nodes while a balanced tree of 100,000 nodes (depth about 17) is fine. The iterative forms have no such cap.

**Reproduce:** From a blank file, implement iterative inorder and level-order with the snapshot line. On the chapter's canonical tree (preorder `[1,2,4,5,3,6]`, inorder `[4,2,5,1,3,6]`), return inorder `[4,2,5,1,3,6]` and level order `[[1],[2,3],[4,5,6]]`. Check both against recursive versions on 200 random BSTs up to 25 nodes with fixed seeds, plus empty, single-node and skewed inputs.

**Traps**

- Pushing the left child before the right in iterative preorder. Push right first so the left child pops next.
- Serializing without `null` markers. Preorder `[2,1]` fits two different trees; markers disambiguate.
- Using `list.pop(0)` as the BFS queue. Each pop costs $`O(n)`$, which makes level order $`O(n^2)`$; use `collections.deque`.

**Practice**

- [LeetCode 94: Binary Tree Inorder Traversal](https://leetcode.com/problems/binary-tree-inorder-traversal/) - Solve recursively, then iteratively with an explicit stack; the follow-up asks for the iterative form. After submitting, read the AlgoMaster write-up for Binary Tree Inorder Traversal (https://algomaster.io/learn/dsa/binary-tree-inorder-traversal).
- [LeetCode 102: Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/) - Group output by level with the snapshot line; example tree `[3,9,20,null,null,15,7]` expects `[[3],[9,20],[15,7]]`. After submitting, read the AlgoMaster write-up for Binary Tree Level Order Traversal (https://algomaster.io/learn/dsa/binary-tree-level-order-traversal).

**Stop when:** Both iterative traversals match their recursive twins on 200 random trees, you reproduce the canonical orders from memory, and empty, single-node and skewed inputs all pass.

<details>
<summary>Self-test</summary>

1. Why does inorder traversal of a BST emit sorted keys?
   - Inorder visits the left subtree, then the node, then the right subtree. Every key left of a node is smaller and every key right of it is larger, so induction on the tree gives ascending order. This needs the BST invariant and is false for general binary trees.
2. What breaks if the inner level-order loop reads `len(queue)` on every check instead of snapshotting?
   - Children appended during the level change the bound mid-level, so the loop consumes the next level too and the boundaries merge. The snapshot fixes the count before any appends happen.
3. Preorder `[1,2]` and postorder `[2,1]` fit more than one tree. Show the ambiguity and the fix.
   - Both fit root 1 with a single child 2 on either side; the one-child direction is undetermined. Null markers (or an inorder sequence, which needs distinct keys) fix the shape.
4. A recursive inorder fails on a skewed tree of 5,000 nodes but works on a balanced tree of 100,000. Why?
   - Stack use follows depth, not size: skewed depth is $`n-1 = 4{,}999`$ against the default limit of 1000, while balanced depth is about 17. The fix is the iterative form, or a deliberate limit raise.

</details>

#### U5. Binary search trees, balance and augmented trees

**About 5 h** · **Target:** Explain + Implement

Topics: Binary-search-tree ordering, duplicates and deletion; Balanced-tree vocabulary and worst-case guarantees; Ranks, order statistics and augmented trees

BSTs turn sorted search dynamic, but only balance keeps it logarithmic. Augmented trees reuse the same skeleton to answer rank and range questions.

**You can now**

- Explain the BST ordering invariant and why child-only checks accept invalid trees.
- Implement `search`, `insert`, `delete` in all three cases, and bounded validation, with edge tests for duplicates and sentinels.
- Explain AVL balance, rotations and the Fibonacci height bound, read red-black guarantees at survey level, and implement an augmented range-sum structure with differential tests.

**Study**

1. [Binary search trees](https://dsa.handbook.academy/curriculum/trees-heaps/binary-search-trees/) (DSA Handbook - search, trees and heaps) - What BST actually constrains; Search; Insert; Delete: the case readers get wrong; Validate; Inorder as a sorted iterator; What it actually costs.
2. [AVL trees and rotations](https://dsa.handbook.academy/curriculum/trees-heaps/avl-rotations/) (DSA Handbook - search, trees and heaps) - What an AVL tree actually promises; Four cases, decided by two questions; The single rotations: LL and RR; The double rotations: LR and RL; Why height stays small: the Fibonacci proof. Depth: Derive the four cases on fresh 3-node inserts on paper; full AVL insert and delete code is not required, since the chapter ships no reference solution.
3. [Red-black trees: an overview](https://dsa.handbook.academy/curriculum/trees-heaps/red-black-overview/) (DSA Handbook - search, trees and heaps) - What a red-black tree is; The height bound, in one inequality; Choosing the library type; AVL versus red-black, in one paragraph. Depth: Survey level only: keep the bound, the library mapping and the one-sentence trade-off. Do not implement fixups; the chapter explicitly declines to teach them.
4. [Segment trees](https://dsa.handbook.academy/curriculum/trees-heaps/segment-tree/) (DSA Handbook - search, trees and heaps) - Locating this pattern; What is stored, and where; Build; Point update; Range query; Why query is $`O(\log n)`$. Depth: Stop before When the structure bends (lazy propagation and dynamic trees are later work). Implement point update with sum only; LC 307 is not assigned.

**Focus**

- Bounded validation passes `(lo,hi)` down and checks `lo < val < hi` strictly. The tree `[5,4,6,null,null,3,7]` passes every child-only check, yet node 3 sits in the right subtree of 5 and fails the inherited bound.
- Hibbard deletion copies the inorder successor's value, then deletes the successor, which has at most one child. Never rewire the successor object into the deleted slot; that loses the left subtree.
- AVL dispatch asks two questions: which side is heavy (sign of the balance factor) and outer versus inner (sign agreement). Same sign rotates once; opposite signs rotate twice. Insert needs $`O(1)`$ rotations because the subtree height returns to its old value.
- Segment-tree query visits at most four vertices per level because only the two boundary vertices split; interior vertices exit on exact match. The min/max clipping plus the empty-range guard is what makes that proof work.

**Reproduce:** From a blank file, implement BST insert, bounded validation and Hibbard delete. Insert `[5,3,8,1,4,7,9]` and assert inorder `[1,3,4,5,7,8,9]`; assert validation rejects `[5,4,6,null,null,3,7]` and LeetCode's `[5,1,4,null,null,3,6]`; delete 5 and assert inorder `[1,3,4,7,8,9]` with validation true. Implement a segment tree with point update and range sum: on `[1,3,5,7,9,11,13,15]`, update index 3 to 6 and assert `sumRange(2,5)` is 31. Differential-test the segment tree against brute force on random arrays up to length 50.

**Traps**

- Using `int` sentinels (`INT_MIN`, `INT_MAX`) as initial bounds. A key equal to the sentinel breaks the check; use infinities, boxed nullable bounds or a wider type.
- Deleting by rewiring instead of value copy, or forgetting to delete the successor copy afterwards. Both corrupt the ordering or duplicate a key.
- Counting segment-tree vertices as $`2n-1`$ and allocating $`2n`$. When $`n`$ is not a power of two the implicit layout overflows; allocate $`4n`$.

**Practice**

- [LeetCode 98: Validate Binary Search Tree](https://leetcode.com/problems/validate-binary-search-tree/) - Validate with `(lo,hi)` bounds; failing cases `[5,1,4,null,null,3,6]` from the problem and `[5,4,6,null,null,3,7]`, which passes child-only checks. Attempt cold with tags hidden: state the ordering invariant before coding. After submitting, read the AlgoMaster write-up for Validate Binary Search Tree (https://algomaster.io/learn/dsa/validate-binary-search-tree). Transfer check: solve one unseen tree problem on NeetCode (for example LC 105 Construct Binary Tree from Preorder and Inorder Traversal, https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/) with solutions closed.
- [LeetCode 230: Kth Smallest Element in a BST](https://leetcode.com/problems/kth-smallest-element-in-a-bst/) - Early-exit inorder counting to $`k`$; follow-up asks for better than $`O(n)`$ memory. After submitting, read the AlgoMaster write-up for Kth Smallest Element in a BST (https://algomaster.io/learn/dsa/kth-smallest-element-in-a-bst).

**Stop when:** Delete and validation behave on the handbook cases, the segment tree matches brute force on random arrays, and you can derive all four AVL cases plus the height bound on a fresh insert.

<details>
<summary>Self-test</summary>

1. Show a tree that passes child-only BST checks but is not a BST, and state the check that rejects it.
   - In `[5,4,6,null,null,3,7]`, every parent is correctly ordered against its own children, but node 3 sits in the right subtree of 5. Bounded validation rejects it: node 3 inherits `lo=5` and fails `5 < 3`.
2. Why does Hibbard deletion of a two-child node always terminate?
   - It copies the inorder successor's value and recurses into the right subtree for the successor. The successor is the leftmost node there, so it has no left child and the recursion lands in the zero-child or right-only case at once.
3. Derive the AVL height bound from the Fibonacci recurrence.
   - A height-h AVL tree is smallest when its subtrees are minimal with heights $`h-1`$ and $`h-2`$, giving $`T(h) = T(h-1) + T(h-2) + 1`$ with $`T(0)=0`$ and $`T(1)=1`$. That solves to $`F(h+2)-1`$ nodes, so $`n \ge F(h+2)-1`$ forces $`h \le 1.44 \log_2(n+2)`$: about 44 percent worse than perfectly balanced.
4. Why is a segment-tree range query $`O(\log n)`$ rather than $`O(n)`$?
   - At each level only the leftmost and rightmost visited vertices can straddle the query boundary and split; interior vertices match exactly and stop. That caps each level at four vertices over $`O(\log n)`$ levels, with the empty-range guard absorbing the half-empty splits.

</details>

#### U6. Heaps and priority queues

**About 4 h** · **Target:** Derive + Implement

Topics: Heap order, bottom-up construction and mutable priorities

Heaps buy priority operations in logarithmic time with plain array storage. The linear build and the two-heap median are the two derivations that recur everywhere else.

**You can now**

- Derive why bottom-up heap construction is linear while repeated insertion is $`\Theta(n \log n)`$.
- Implement sift-up, sift-down, Floyd build, `push`, `pop` and `replace` with invariant tests, using `heapq` only as an oracle.
- Implement the two-heap streaming median and defend its size and ordering invariants.

**Study**

1. [Heaps and priority queues](https://dsa.handbook.academy/curriculum/trees-heaps/heaps-priority-queues/) (DSA Handbook - search, trees and heaps) - What a heap actually is; The two primitives; The full operation table; Building a heap in linear time; Worked example: LC 295; Where readers go wrong. Depth: Skim the LC 215 and LC 23 worked examples; kth-largest belongs to the quickselect unit and k-way merge is not assigned.
2. [Two-heap median archetypes: when one heap is not enough](https://dsa.handbook.academy/patterns/two-heap-median-archetypes/) (DSA Handbook Patterns - two-heap median archetypes) - Streaming median (two-heap balance invariant); Variants side-by-side. Depth: Skip sliding-window median and the sketch survey; only the append-only variant is implemented here.

**Focus**

- Most nodes are leaves with short subtrees: level $`h`$ holds about $`n/2^{h+1}`$ nodes at $`O(h)`$ sift cost each, and the series $`(n/2)`$ times sum $`h/2^h`$ converges to $`O(n)`$. Repeated insertion instead pays $`\log 1 + \ldots + \log n = \log(n!))`$, which is $`\Theta(n \log n)`$.
- Floyd starts at `n//2 - 1`, the last internal node, and moves right to left so every sift-down sees valid child heaps. That order is the `MAX-HEAPIFY` precondition; building by sift-up throws the linear bound away.
- Two-heap invariants: `0 <= len(lower) - len(upper) <= 1` with the extra element in lower, and `max(lower) <= min(upper)`. Push-then-rotate maintains both with $`O(\log n)`$ per insert and $`O(1)`$ per query.
- `heapq` is min-heap only and `heapify` runs in documented $`O(\operatorname{len}(\text{heap}))`$ time. Max-heap idioms negate keys, and payloads need a tiebreak slot (the LC 23 tuple trick) so equal priorities never compare task objects.

**Reproduce:** From a blank file, implement Floyd max-heap build plus `push` and `pop`. With `random.seed(0)` and `random.sample(range(10**6), 2000)`, assert the result is a valid max-heap holding the same multiset, and count comparisons (at most $`2n = 4000`$). Implement `MedianFinder` with the push-then-rotate rule: after `add(1)` and `add(2)` the median is 1.5; after `add(3)` it is 2.0. Differential-test both against `heapq` and brute-force medians on random streams.

**Traps**

- Calling sift-down on a node whose children are not heaps yet. The child-heaps precondition is load-bearing; Floyd's right-to-left order is what establishes it.
- Rebalancing the two heaps in the wrong order. Push to lower, move its top to upper, then rotate back only if upper outgrew lower; skipping the last step breaks the size invariant on even totals.
- Averaging the two middle values with `//` instead of `/`. Floor division truncates the even-case median (1.5 becomes 1).

**Practice**

- [LeetCode 703: Kth Largest Element in a Stream](https://leetcode.com/problems/kth-largest-element-in-a-stream/) - Size-`k` min-heap with `heapreplace`; include `k=1` and duplicate-heavy streams. After submitting, read the AlgoMaster write-up for Kth Largest Element in a Stream (https://algomaster.io/learn/dsa/kth-largest-element-in-a-stream).
- [LeetCode 295: Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream/) - Two-heap `MedianFinder`; example sequence `add(1)`, `add(2)`, `findMedian` expects 1.5, then `add(3)`, `findMedian` expects 2.0. Attempt cold. After submitting, read the AlgoMaster write-up for Find Median from Data Stream (https://algomaster.io/learn/dsa/find-median-from-data-stream).

**Stop when:** Floyd build holds heap order with at most 2n comparisons on the 2000-element seed-0 input, the median matches brute force on random streams, and you can state both invariants plus the linear-build series without notes.

<details>
<summary>Self-test</summary>

1. Prove Floyd's build is $`O(n)`$.
   - Nodes at height $`h`$ number about $`n/2^{h+1}`$ and each costs at most $`h`$ sift steps. The total is at most $`(n/2)`$ times the sum of $`h/2^h`$ over all $`h`$, and that series converges to 2, giving at most about $`n`$ sift steps and $`2n`$ comparisons. Naive repeated insertion instead pays $`\log 1 + \ldots + \log n = \log(n!)`$, which is $`\Theta(n \log n)`$ by Stirling.
2. Why must the build loop start at `n//2 - 1` and go down?
   - Indices `[n//2, n)` are leaves, which are trivially valid single-element heaps, so `n//2 - 1` is the last internal node. Descending guarantees both children are already valid heaps when a node is sifted, which is the sift-down precondition.
3. State both two-heap invariants and compute the median for odd and even totals.
   - Size: lower holds at most one element more than upper, never fewer. Ordering: every lower key is at most every upper key. Odd total: the median is lower's root. Even total: the average of the two roots.
4. `heapq` has no max-heap. How do you store `(priority, task)` pairs, and what breaks on ties?
   - Push `(-priority, index, task)` with a tiebreak counter: negation flips the order and the counter keeps task objects uncompared. Without it, equal priorities fall through to comparing tasks, which raises `TypeError` for unordered types.

</details>

#### U7. Tries and prefix lookup

**About 3 h** · **Target:** Implement

Topics: Trie representation, prefix lookup and memory cost

Tries trade key storage for shared prefixes. Prefix enumeration and constrained search are awkward in hash maps and slow in sorted sets.

**You can now**

- Explain trie representation, prefix lookup cost and memory cost, and when a trie beats hashing.
- Implement a trie with `insert`, `search`, `startsWith` and wildcard search, tested on empty strings, duplicates and shared prefixes.
- Route a prefix problem to a trie, a hash map or a sorted set from its query shape.

**Study**

1. [Tries](https://dsa.handbook.academy/curriculum/trees-heaps/tries/) (DSA Handbook - search, trees and heaps) - What's in the structure; What `is_end` is and is not; Choosing the children container; LC 211: wildcards and a tree-shaped walk; What it actually costs. Depth: Skim LC 212 (the trie as prune oracle) and Pattern variants worth knowing for recognition; only LC 208 and 211 are implemented here.

**Focus**

- `search` checks `is_end`; `startsWith` does not. After inserting `car` and `card`, the node for `car` is terminal and still has a `d` child: terminal and leaf are orthogonal.
- Lookup costs $`O(L)`$ in the key length with one step per character, the same factor a hash pays to read the key. The trie wins on prefix queries (list every word under `ca`), which hashing cannot enumerate without scanning the table.
- The children container sets the constants: a 26-array is $`O(1)`$ per step but wastes nulls (the chapter estimates about 20 MB per 100k nodes); `dict` children handle Unicode and sparse alphabets.
- Wildcard `'.'` tries every non-null child by DFS. LC 211 allows at most 2 dots, so the fan-out caps at $`26^2 = 676`$ paths; with many dots, scanning the stored words of the query's length is the simpler bound.

**Reproduce:** From a blank file, implement a trie with `dict` children. Insert `apple` and `app`; assert `search(app)` is `True`, `search(appl)` is `False` and `startsWith(app)` is `True`. Add wildcard search; assert `wildcard('.pp')` is `True` and `wildcard('b..')` is `False`. Differential-test `search` and `startsWith` against a Python `set` oracle on random word lists including empty strings and duplicates.

**Traps**

- Pasting `search` into `startsWith`. The shared walk must skip the `is_end` check for prefix queries.
- Sizing the children array for lowercase only, then indexing `ord('A') - ord('a') = -32`. Dict children or explicit alphabet checks avoid the silent negative index.
- Running one DFS per word on a board instead of one DFS guided by the trie. The trie prunes every word sharing an impossible prefix at once.

**Practice**

- [LeetCode 208: Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree/) - Trie with insert, search and startsWith over lowercase words; example sequence in the problem statement. Test the empty string, duplicate inserts and the car/card shared-prefix case. After submitting, read the AlgoMaster write-up for Implement Trie (https://algomaster.io/learn/dsa/implement-trie-prefix-tree).
- [LeetCode 211: Design Add and Search Words Data Structure](https://leetcode.com/problems/design-add-and-search-words-data-structure/) - Wildcard `'.'` search over the same trie; the dot matches any single letter. Implement the dot as DFS over non-null children. After submitting, read the AlgoMaster write-up for Design Add and Search Words Data Structure (https://algomaster.io/learn/dsa/design-add-and-search-words-data-structure).

**Stop when:** Insert, `search`, `startsWith` and wildcard search match a `set` oracle on random word lists with empties and duplicates, and you can defend trie versus hash map versus sorted set for a new prefix task.

<details>
<summary>Self-test</summary>

1. After inserting `car` and `card`, is the node for `car` a leaf? Is it terminal?
   - Terminal but not a leaf: `is_end` is `True` and it still has the `d` child. The two flags are independent.
2. Why can a hash map not answer 'list every word starting with ca' efficiently?
   - Hashes destroy prefix locality: matching words scatter across buckets, so enumeration scans the whole table. A trie walks to `ca` once, then enumerates only that subtree.
3. What is the worst-case cost of wildcard search with $`k`$ dots over alphabet size $`R`$?
   - $`O(R^k)`$ trie paths, since each dot fans out to every non-null child. LC 211 stays feasible by capping queries at 2 dots ($`26^2 = 676`$). With many dots, grouping words by length and scanning the group costs $`O(N L)`$ for $`N`$ words of length $`L`$ and is the safer bound.
4. When does a sorted set beat a trie for prefix queries?
   - On memory and simplicity for a single range: bisecting `'ca'` to `'cb'` answers one prefix query with no per-node overhead. Tries win when many prefix walks share structure or when per-character steps with wildcards are needed.

</details>

#### U8. Interval ordering, merging and sweep lines

**About 4 h** · **Target:** Implement

Topics: Interval ordering, merging and sweep reasoning

Intervals turn sorting into scheduling. One sort plus one left-to-right walk answers merging, insertion and concurrency when the running state matches the question's verb.

**You can now**

- State the interval-merging invariant and implement `merge` and `insert` with edge tests for touching endpoints and containment.
- Implement event sweeps with an explicit tie-break and defend the ends-before-starts versus starts-before-ends choice from the interval convention.
- Solve unseen interval problems by reading the verb (collapse, insert, concurrency) and picking the matching running state.

**Study**

1. [Merge intervals archetypes](https://dsa.handbook.academy/patterns/merge-intervals-archetypes/) (DSA Handbook Patterns - merge intervals archetypes) - The decision; Variants (Merge overlapping, Insert interval); Three signature problems (LC 56, LC 57); Common misconceptions. Depth: Read the Meeting-rooms-II archetype too; practise it on AlgoMaster below.
2. [Sweep line archetypes](https://dsa.handbook.academy/patterns/sweep-line-archetypes/) (DSA Handbook Patterns - sweep line archetypes) - The decision; Variants (1D event sweep); Variants side-by-side. Depth: Read only the 1D event sweep variant; skyline and rectangle area are recognition only.

**Focus**

- Sort by start, walk left to right, keep one running merged interval; the overlap test is `s <= last.end` under LC 56's closed intervals. Sorting dominates at $`O(n \log n)`$ with $`O(n)`$ output.
- Insert skips the sort: the input is already sorted and non-overlapping, so one pass splices the before part, the widened overlap and the after part in $`O(n)`$. Re-sorting throws the precondition away for an extra $`\log`$ factor.
- The sweep tie-break follows the convention: half-open `[s,e)` processes ends before starts; closed `[s,e]` flips it. On `[[7,10],[10,11]]`, ends-first counts 1 (correct for half-open) while starts-first double-counts the boundary.
- The verb picks the state: collapse asks for a running interval, a new range asks for a widened `newInterval`, concurrency asks for a min-heap of end times or a `+1`/`-1` balance counter.

**Reproduce:** From a blank file, implement merge and insert. Merge `[[1,3],[2,6],[8,10],[15,18]]` must give `[[1,6],[8,10],[15,18]]`, and touching `[1,3]`,`[3,5]` must merge to `[[1,5]]`. Insert `[2,5]` into `[[1,3],[6,9]]` must give `[[1,5],[6,9]]`. Implement the `+1`/`-1` event sweep with ends-before-starts; on `[[0,30],[5,10],[15,20]]` it must report maximum concurrency 2. Differential-test merge against a brute-force pairwise-collapse loop on random interval lists.

**Traps**

- Merging with `<` instead of `<=` on closed intervals. Touching endpoints `[1,3]`,`[3,5]` overlap under LC 56's convention and must merge.
- Using the sweep's $`O(N \log N)`$ default as a law. Bounded coordinate ranges admit a difference array at $`O(N + R)`$; the sort is the default, not the law.
- Keeping the whole active set when a scalar suffices. Event counting needs one balance counter, not a heap; match the structure to what the question asks at each $`x`$.

**Practice**

- [LeetCode 57: Insert Interval](https://leetcode.com/problems/insert-interval/) - Three-phase splice without sorting; example `([[1,3],[6,9]], [2,5])` expects `[[1,5],[6,9]]`. After submitting, read the AlgoMaster write-up for Insert Interval (https://algomaster.io/learn/dsa/insert-interval).
- [AlgoMaster: Meeting Rooms II](https://algomaster.io/learn/dsa/meeting-rooms-ii) - Read only Understanding the Problem and its Key Constraints, then solve twice: the `+1`/`-1` event sweep with ends before starts, and a min-heap of end times. Test both against a brute-force count at every start time on random meetings, including back-to-back `[7, 10]`, `[10, 11]`. After both pass, read Approaches 2 and 3 (min-heap, and two sorted arrays) and compare their tie rules with yours.
- [LeetCode 56: Merge Intervals](https://leetcode.com/problems/merge-intervals/) - Sort by start plus running merge; example `[[1,3],[2,6],[8,10],[15,18]]` expects `[[1,6],[8,10],[15,18]]`. Use only if interval modeling is still weak after the pattern pages; state the overlap convention before coding. After submitting, read the AlgoMaster write-up for Merge Intervals (https://algomaster.io/learn/dsa/merge-intervals). Transfer check: solve one unseen heap-or-interval problem on NeetCode (for example LC 435 Non-overlapping Intervals, https://leetcode.com/problems/non-overlapping-intervals/) with solutions closed.

**Stop when:** Merge and insert match the handbook examples, the sweep reports concurrency 2 on the worked input, merge survives a brute-force differential test, and you route a new interval task from its verb.

<details>
<summary>Self-test</summary>

1. Prove the merge walk never splits two overlapping intervals.
   - Sorted by start, the walk keeps the running interval with the maximum end so far. Any interval with start <= running end overlaps it and widens it further; an interval with start > running end overlaps nothing later either, since later starts are even larger. Each emission is therefore maximal.
2. Why is insert $`O(n)`$ while merge is $`O(n \log n)`$?
   - Insert's input is sorted and non-overlapping, so one linear splice (before, widened overlap, after) suffices. Merge must establish the order first, and comparison sorting costs $`O(n \log n)`$.
3. Under the half-open convention, why do ends sort before starts at equal coordinates?
   - At $`x=10`$, `[7,10)` has already ended while `[10,11)` begins; processing the `-1` first keeps the count at 1. Starts-first would briefly count 2 and double-count the shared boundary.
4. What changes if intervals arrive as an unbounded stream?
   - If meetings arrive in start order, a min-heap of active end times (pop while top <= start) processes them online in $`O(n \log n)`$ time with $`O(n)`$ state. If they arrive in arbitrary order, no single pass works: keep an ordered map of `+1`/`-1` events, or a segment tree over bounded coordinates, and update the maximum as events land.

</details>

### Mini-project: Mutable-priority heap, a derived boundary and a room scheduler

**About 10 to 14 hours.** Build an indexed heap with `update` and `remove`, derive one binary-search-on-the-answer boundary from its predicate before running examples, and solve an unseen tree problem and a two-heap scheduling problem with adversarial tests and a worst-case defense.

1. Implement an indexed min-heap with `push`, `pop`, `peek`, `update(item, priority)` and `remove(item)`, backed by a position map. Write both invariants (heap order on the array, and `pos[item]` equals the item's index) and the cost of each operation.
2. Test it with a Hypothesis rule-based state machine against a `dict` oracle that answers the minimum by scanning, checking both invariants after every step. Seed one defect, such as an update that only sifts down or a swap that forgets the position map, and keep the shrunk history.
3. Solve LC 1011 Capacity To Ship Packages Within D Days without reading its tags. Write the predicate `feasible(c)`, prove it monotone, set `lo = max(weights)` and `hi = sum(weights)`, and derive the loop condition and updates from the invariant (`feasible(hi)` holds, everything below `lo` fails) before running any example. The examples answer 15, 6 and 3.
4. Solve LC 236 Lowest Common Ancestor of a Binary Tree recursively, then defend the worst case: a path-shaped tree of $`10^5`$ nodes exceeds CPython's default recursion limit of 1000, so add an iterative version with a parent map and test both against an ancestor-set oracle on random trees.
5. Solve LC 2402 Meeting Rooms III with two heaps, free rooms by number and busy rooms by end time and number. Write adversarial tests for chained delays, equal end times and a meeting that starts exactly when a room frees, and compare against a brute-force simulator on small random inputs. The examples answer 0 and 1.
6. Write the worst-case notes: the $`O(m \log m + m \log n)`$ bound for LC 2402, and why delayed end times can reach about $`5 \times 10^{10}`$ with one room, which overflows 32-bit integers in a fixed-width language.

**Deliverables**

- The indexed heap module with invariants, cost notes, the state machine and the seeded-defect history.
- The LC 1011 boundary derivation, written before code, with the monotonicity proof.
- LC 236 and LC 2402 solutions with adversarial and differential tests and the worst-case notes.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [LeetCode 1011: Capacity To Ship Packages Within D Days](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/). Submit once; the derivation should make the first submission pass.
- external-tests: [LeetCode 236: Lowest Common Ancestor of a Binary Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/). Submit the iterative version.
- external-tests: [LeetCode 2402: Meeting Rooms III](https://leetcode.com/problems/meeting-rooms-iii/). Submit after the simulator agrees.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Indexed heap | The state machine passes with both invariants checked after every step, and the seeded defect fails with a shrunk history. | Update and remove are tested on the root and the last slot, and swap counts on random histories stay within the stated logarithmic bounds. |
| Boundary derivation | The invariant and updates are written before any example runs, and all three examples pass on the first run. | A property test checks that the answer is the smallest feasible capacity: `feasible(answer)` holds and `feasible(answer - 1)` fails. |
| Tree worst case | Both versions agree with the oracle, and the iterative version handles the $`10^5`$-node path. | The write-up shows the recursive failure on the deep tree and states the $`O(h)`$ space of each version. |
| Scheduler | LC 2402 is accepted, and the brute-force simulator agrees on random small inputs with ties and back-to-back meetings. | The tie rules are stated as invariants of the two heaps, and the overflow note names the largest end time the constraints allow. |

Feeds into: Capstone correctness library: the mutable-priority heap. Failure evidence: its seeded defect. The room scheduler is a first scheduler artifact for the milestone.

### Resource route

- **Primary - Course:** [DSA Handbook - search, trees and heaps](https://dsa.handbook.academy/curriculum/) - Study Part 2 Search and Sort, Part 5 Linked Lists, and Part 6 Trees and Heaps. Include canonical and answer-space binary search, comparison and linear-time sorts, quickselect, sentinels, cycles, heaps, BSTs, balanced-tree vocabulary, tries and segment trees.
- **Required - Practice:** [AlgoMaster DSA - ordered structures slice](https://algomaster.io/learn/dsa/course-roadmap) - Attempt Koko Eating Bananas, Validate Binary Search Tree and Find Median from Data Stream cold. Use Merge Intervals only if interval modeling remains weak, and include duplicate-heavy and skewed inputs.
- **Support - Application:** [Algorithmica - search and sorting performance](https://en.algorithmica.org/hpc/) - Use the binary-search, sorting, branch prediction and cache chapters to explain why two algorithms with the same asymptotic bound cross over on real workloads.
- **Reference - Theory:** [Algorithms](https://jeffe.cs.illinois.edu/teaching/algorithms/) - Use Chapter 1 (mergesort, quicksort, recursion trees and linear-time selection) when deriving merge, partition and selection algorithms, and lecture note 12 Lower Bounds for the comparison-sorting decision-tree argument. This is the proof reference when the handbook explanation is too brief.
- **Optional - Assessment:** [NeetCode - unseen ordered problems](https://neetcode.io/practice) - Use one unseen tree problem and one heap or interval problem as the final transfer check, with solution material closed until submission.
- **Support - Support:** [DSA Handbook Patterns - quicksort vs mergesort vs heapsort](https://dsa.handbook.academy/patterns/quicksort-vs-mergesort-vs-heapsort/) - Use The decision, Algorithms compared and Side-by-side to pick a comparison sort from the binding constraint; problem details stay with their units.
- **Support - Support:** [DSA Handbook Patterns - quickselect vs heap for top-K](https://dsa.handbook.academy/patterns/quickselect-vs-heap-top-k/) - Use The decision through Side-by-side for the streaming, sorted-output and mutation routing; problem details stay with their units.
- **Support - Support:** [DSA Handbook Patterns - two-heap median archetypes](https://dsa.handbook.academy/patterns/two-heap-median-archetypes/) - Use Streaming median and Variants side-by-side for the two-heap invariants; skip sliding-window median and sketches.
- **Support - Support:** [DSA Handbook Patterns - merge intervals archetypes](https://dsa.handbook.academy/patterns/merge-intervals-archetypes/) - Use The decision, Variants and the LC 56 and LC 57 signature problems for merge and insert implementation, and the Meeting Rooms II archetype for the min-heap form.
- **Support - Support:** [DSA Handbook Patterns - sweep line archetypes](https://dsa.handbook.academy/patterns/sweep-line-archetypes/) - Use The decision and the 1D event sweep variant for `+1`/`-1` concurrency counting with explicit tie-breaks; skyline and rectangle area are recognition only.

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

### Study units

#### U1. Graph modeling, representations and state graphs

**About 4 h** · **Target:** Explain + Implement

Topics: Vertices, edges, direction, weights and problem-state modeling; Adjacency lists, matrices, edge lists and implicit graphs; Product-state and time-expanded graphs

Every later unit consumes a graph. A wrong model, such as marking a vertex visited when the state is a word or a cell-plus-keys pair, passes small tests and fails the hidden ones.

**You can now**

- Compare adjacency lists, adjacency matrices, edge lists and implicit neighbor functions by build cost, query cost and memory, and pick the default for sparse traversal.
- Explain directed versus undirected storage, weighted cell shapes and dense-integer versus string vertex IDs.
- Explain when a product-state or time-expanded graph is needed instead of marking the original vertex visited.

**Study**

1. [Graph representation](https://dsa.handbook.academy/curriculum/graphs/graph-representation/) (DSA Handbook - graphs) - The three representations; Picking the right one; What it actually costs; The variants you will meet (Directed vs undirected, Weighted vs unweighted, Vertex IDs: dense integers vs strings, Implicit graphs, In-edges as easily as out-edges).
2. [Basic Graph Algorithms, Chapter 5](https://jeffe.cs.illinois.edu/teaching/algorithms/book/05-graphs.pdf) (Algorithms - graph chapters) - Sections 5.2 Basic Definitions, 5.3 Representations and Examples, 5.4 Data Structures (adjacency lists, adjacency matrices and their comparison), 5.5 Whatever-First Search and 5.7 Graph Reductions: Flood Fill (printed pp. 190-207).
3. [Breadth-first search: state-space BFS section only](https://dsa.handbook.academy/curriculum/graphs/bfs/) (DSA Handbook - graphs) - When the pattern bends: State-space BFS (LC 127, LC 752). Depth: Read only that section here. The queue mechanics belong to the BFS unit.

**Focus**

- Default to the adjacency list on sparse graphs: at $`n = 10^{5}`$ the chapter's arithmetic gives about 1.6 MB for the list against about $`10^{10}`$ matrix cells. Take the matrix only under $`n \le 500`$ with heavy edge tests, and keep the raw edge list for Kruskal and Bellman-Ford.
- An undirected edge is two adjacency entries; a directed edge is one. The directed flag belongs in the constructor, not in the traversal.
- An implicit graph is a neighbor function, not a table: four lines of grid arithmetic or one-letter word mutations replace a 10,000-vertex grid build.
- When the state carries more than the vertex (a word, a lock combination, keys held), the visited mark must sit on the state. Marking the bare vertex merges distinct states.

**Reproduce:** From a blank file with the course Python (3.13.14), build the undirected adjacency list for $`n = 5`$ and edges `[(0,1),(0,2),(1,3),(2,3),(3,4)]`, assert `adj[3] == [1,2,4]`, then BFS from 0 and report distances `{0:0, 1:1, 2:1, 3:2, 4:3}`. Then write `grid_neighbors(r, c, rows, cols)` yielding the four in-bounds neighbors, and state in one sentence why Word Ladder nodes are words rather than positions.

**Traps**

- Forgetting the second push for undirected edges: BFS reaches one side of an edge but not the other, and reports disconnected on a connected input.
- Building an adjacency list for an edge-centric algorithm: Kruskal sorts the input edge list and Bellman-Ford scans it; neither queries neighbors of one vertex, so the build is pure overhead.
- Marking the vertex instead of the state: two paths reaching the same cell with different keys collapse into one visited bit, and the second path is wrongly pruned.

**Practice**

- [LeetCode 1971: Find if Path Exists in Graph](https://leetcode.com/problems/find-if-path-exists-in-graph/) - Examples 1 and 2 ($`n = 3`$ triangle with source 0 and destination 2; two-component graph with source 0 and destination 5). Build the adjacency list from the edge list, then traverse. Attempt before reading the DSA Handbook 8.0 worked solution, which is the after-attempt reference for the build-then-traverse contract.
- [LeetCode 127: Word Ladder](https://leetcode.com/problems/word-ladder/) - Example 1 (begin hit, end cog, six-word list; expected ladder length 5). Model first: nodes are words, edges are one-letter mutations. BFS over the implicit graph. After-attempt reference is the State-space BFS section of DSA Handbook 8.1.

**Stop when:** Your blank-file script prints `adj[3] == [1,2,4]` with the distance table above, and you can name the nodes, edges and visited key of a new narrative before writing code.

<details>
<summary>Self-test</summary>

1. List, matrix or edge list for BFS on a sparse graph with $`n = 10^{5}`$, and why?
   - Adjacency list. Traversal costs $`\Theta(V + E)`$ on the list against $`\Theta(V^2)`$ on the matrix, and the matrix needs about $`10^{10}`$ cells at that scale.
2. LC 1557 answers with an in-degree array and no adjacency list. What is the general lesson?
   - Store the minimum structure the algorithm consumes. In-degree-zero detection needs counts, not neighbors.
3. Two searches reach grid cell `(2,2)`, one holding key A and one holding nothing. One visited bit on `(2,2)`: what breaks?
   - The second arrival is skipped although its future differs: the doors it can open are not the same. The visited key must be `(cell, keys)`.
4. Why do Kruskal and Bellman-Ford take the edge list as is?
   - They consume edges in bulk order (by weight, or all of them per pass) and never query the neighbors of one vertex.

</details>

#### U2. BFS, unweighted shortest paths and connected components

**About 4 h** · **Target:** Derive + Implement

Topics: BFS frontier invariant and unweighted shortest paths; Connected components and reachability

BFS is the shortest-path algorithm for uniform cost and the reachability engine for grids. The visited timing, not the queue, is what keeps it linear.

**You can now**

- Prove BFS returns unweighted shortest paths from the layer invariant, and derive the $`\Theta(V + E)`$ bound from visited-at-enqueue.
- Implement single-source and multi-source BFS on explicit and grid graphs, with the depth convention stated per problem.
- Turn any traversal into component counting or measuring with an outer scan, on grids and on adjacency matrices.

**Study**

1. [Breadth-first search](https://dsa.handbook.academy/curriculum/graphs/bfs/) (DSA Handbook - graphs) - The contract; Why graphs need a visited set when trees don't; The canonical implementation (LC 994); Walking minutes 0 to 3; Multi-source BFS; Two pitfalls that bite. Depth: Skip the 0-1 BFS subsection; it returns in the weighted-shortest-paths unit.
2. [Connected components and flood fill](https://dsa.handbook.academy/curriculum/graphs/connected-components/) (DSA Handbook - graphs) - Why the obvious approach is half an algorithm; The pattern (LC 200); The graph-shape-agnostic reveal: LC 547; Measuring instead of counting: LC 695. Depth: Skip the Union-Find subsection and LC 305; online components belong to the union-find unit.
3. [Whatever-First Search and disconnected graphs](https://jeffe.cs.illinois.edu/teaching/algorithms/book/05-graphs.pdf) (Algorithms - graph chapters) - Sections 5.5 Whatever-First Search and 5.6 Important Variants: the queue variant, disconnected graphs and directed graphs (printed pp. 199-205).
4. [Unweighted shortest paths by BFS](https://jeffe.cs.illinois.edu/teaching/algorithms/book/08-sssp.pdf) (Algorithms - graph chapters) - Chapter 8, Section 8.4 Unweighted Graphs: Breadth-First Search with the FIFO queue and layer analysis (printed pp. 278-281).

**Focus**

- Mark visited at enqueue, on the same line as the push. Marking at dequeue lets several queued neighbors push the same vertex, so the queue holds up to $`E`$ entries, and without a skip-on-pop check each duplicate is expanded again, up to $`\Theta(V \times E)`$ work on dense graphs.
- The FIFO invariant: the queue always holds vertices at most two consecutive distances from the sources. Draining a full layer before the next is what makes first discovery shortest.
- Multi-source BFS seeds every source at depth 0 in one pre-scan, equivalent to a virtual super-source with zero-weight edges. One run replaces one BFS per source.
- Counting is an outer scan wrapped around the traversal: every unvisited land cell starts one flood. Minutes count edges traversed; binary-matrix path length counts cells, so it adds one.

**Reproduce:** From a blank file with the course Python (3.13.14), run multi-source BFS on `[[2,1,1],[1,1,0],[0,1,1]]` and return 4; on `[[2,1,1],[0,1,1],[1,0,1]]` return -1; on a grid with no fresh cells return 0. State the input size ($`3 \times 3`$) and that the answer counts edges, not cells.

**Traps**

- `list.pop(0)` as a queue: each pop shifts the remaining elements, so at 20,000 queued cells one pop costs about 1.9 us against about 11 ns for `deque.popleft` (measured on 12th Gen i9-12900K, Python 3.13.14). Always import `deque`.
- A single-source loop over sources for a multi-source question: $`n`$ runs give $`n`$ single-source distances, not the parallel-frontier minimum the problem asks for.
- Cell-versus-edge counting: LC 994 returns the depth of the last rotted cell while LC 1091 returns depth plus one for the cell-inclusive path. Trace a 3-cell line by hand before submitting.

**Practice**

- [LeetCode 200: Number of Islands](https://leetcode.com/problems/number-of-islands/) - Examples 1 and 2 (answers 1 and 3 on the two listed grids). Attempt cold per the AlgoMaster pool note. After-attempt reference is DSA Handbook 8.3 (LC 200 pattern and LC 547 reveal). Implement iterative BFS: recursive DFS on a $`300 \times 300`$ all-land grid recurses about 90,000 deep against the default limit of 1000.
- [LeetCode 994: Rotting Oranges](https://leetcode.com/problems/rotting-oranges/) - The three listed examples (`[[2,1,1],[1,1,0],[0,1,1]]` answers 4; the walled-off grid answers -1; `[[0,2]]` answers 0 because no fresh orange remains). After-attempt reference is the DSA Handbook 8.1 canonical implementation. State whether you used depth-tagged or layer-counted minutes and keep one style.

**Stop when:** Your blank-file BFS prints 4, -1 and 0 on the three reproduce grids, and you solve LC 200 and LC 994 without changing queue style mid-function.

<details>
<summary>Self-test</summary>

1. Prove BFS first discovery is shortest.
   - Induction on layers: sources are distance 0, and the queue dequeues every distance-$`d`$ vertex before any distance-$`(d + 1)`$ vertex is discovered, since discovery appends to the back. So the first edge reaching $`v`$ comes from a distance-$`(\operatorname{dist}(v) - 1)`$ vertex along a shortest path, and no shorter path can exist or $`v`$ would have been discovered earlier.
2. Why does the super-source argument preserve the bound?
   - The virtual source adds one vertex and one zero-weight edge per real source, scanned once in the seed pass. Total work stays $`\Theta(V + E)`$.
3. A diamond $`A \to B`$, $`A \to C`$, $`B \to D`$, $`C \to D`$ with visited marked at dequeue: what happens?
   - $`B`$ and $`C`$ both see $`D`$ unmarked before $`D`$ is dequeued, so $`D`$ is pushed twice. If the pop skips marked vertices, the answer is still right but the queue carries duplicates; if it does not, $`D`$ is expanded twice. Marking at enqueue pushes $`D`$ once.
4. LC 547 reads an $`n \times n`$ matrix but runs the same template as LC 200. What changes?
   - Only the neighbor function: neighbors of $`i`$ are columns $`j`$ with `isConnected[i][j] == 1`. Cost becomes $`\Theta(n^2)`$ because every matrix cell is read.

</details>

#### U3. DFS, cycle detection and bipartite testing

**About 4 h** · **Target:** Derive + Implement

Topics: DFS state, timestamps and recursive versus iterative traversal; Cycle detection in directed and undirected graphs; Bipartite testing and two-color invariants

DFS supplies the recursion structure BFS cannot: finish times, edge classification and back-edge witnesses. Cycles and two-coloring are its first two customers.

**You can now**

- Implement recursive and iterative DFS with pre-order, post-order and on-stack hooks, and derive the $`\Theta(V + E)`$ bound.
- Detect directed cycles with three-color DFS and undirected cycles with parent-tracking DFS, and exhibit the false positive each wrong pairing produces.
- Test bipartiteness with two-color BFS or DFS and explain the odd-cycle obstruction.

**Study**

1. [Depth-first search](https://dsa.handbook.academy/curriculum/graphs/dfs/) (DSA Handbook - graphs) - The recursive form; Three flavors: pre-order, post-order, on-stack; Worked example: LC 130 Surrounded Regions; Two pitfalls that bite.
2. [Cycle detection in graphs](https://dsa.handbook.academy/curriculum/graphs/cycle-detection-graphs/) (DSA Handbook - graphs) - Why the obvious approach reports cycles that are not there (diamond); The other half: undirected graphs need a parent argument; Worked example: LC 1361. Depth: Skim the Floyd tortoise-and-hare pointer; it belongs to linked lists, not graphs.
3. [Bipartite check](https://dsa.handbook.academy/curriculum/graphs/bipartite-check/) (DSA Handbook - graphs) - Why the obvious approach wastes most of its work; The pattern (LC 785); Worked example on a 4-cycle and a triangle.
4. [Depth-first search through cycle detection](https://jeffe.cs.illinois.edu/teaching/algorithms/book/06-dfs.pdf) (Algorithms - graph chapters) - Sections 6.1 Preorder and Postorder (with Classifying Vertices and Edges) and 6.2 Detecting Cycles (printed pp. 227-232).

**Focus**

- Mark before recursing, on entry. Recursing first lets the neighbor immediately recurse back, which loops until `RecursionError`.
- `GRAY` means on the current stack; `BLACK` means finished. The diamond edge into a `BLACK` vertex is a benign forward edge; only a `GRAY` neighbor is a back edge and a cycle witness.
- Undirected DFS needs one boolean plus the `parent` argument: the neighbor you arrived from does not count. Three colors are unnecessary there because undirected DFS has no forward or cross edges.
- Bipartite colors are 1 and -1 with 0 for unvisited, flipped by negation across each edge, inside an outer loop over components. A same-color edge is the odd-cycle witness.

**Reproduce:** From a blank file with the course Python (3.13.14), run three-color DFS on the diamond `[(0,1),(0,2),(1,3),(2,3)]` and report no cycle, and on `[(0,1),(1,2),(2,0)]` report a cycle. Then run two-color BFS on `[[1,3],[0,2],[1,3],[0,2]]` (`True`) and on `[[1,2],[0,2],[0,1]]` (`False`).

**Traps**

- Two-color directed DFS: the diamond reports a cycle because one visited bit conflates on-stack with finished. The fix is the third color, not a second visited set.
- Parentless undirected DFS: a single edge reports a cycle because each endpoint sees the other as visited. The fix is the `parent` argument, not more colors.
- Recursive DFS on deep grids or chains: CPython caps the stack at 1000 frames by default (check with `sys.getrecursionlimit`), so a snake region or a 2000-chain crashes. Set the limit explicitly or ship the iterative form.

**Practice**

- [LeetCode 130: Surrounded Regions](https://leetcode.com/problems/surrounded-regions/) - The two listed examples ($`4 \times 4`$ board with two interior O cells flipping; single-cell board). Pre-order DFS from every border O, marking first and recursing second. After-attempt reference is the DSA Handbook 8.2 worked example.
- [LeetCode 785: Is Graph Bipartite?](https://leetcode.com/problems/is-graph-bipartite/) - Examples 1 (triangle inside, `False`) and 2 (4-cycle, `True`). Two-color BFS with the outer component loop. After-attempt reference is the DSA Handbook 8.7 worked example.

**Stop when:** Your blank-file script prints the four reproduce verdicts (no cycle, cycle, `True`, `False`), and LC 130 plus LC 785 pass with the visited discipline stated up front.

<details>
<summary>Self-test</summary>

1. Prove a directed graph is acyclic iff DFS finds no back edge.
   - If a back edge $`(u, v)`$ exists, $`v`$ is an ancestor of $`u`$, so the tree path from $`v`$ to $`u`$ plus the edge closes a cycle. Conversely, if a cycle exists, let $`v`$ be its first vertex DFS discovers. Every other cycle vertex is still white then, so each becomes a descendant of $`v`$, and the cycle edge from $`v`$'s predecessor $`u`$ back to $`v`$ reaches $`v`$ while $`v`$ is still GRAY: a back edge.
2. Prove a graph is bipartite iff it has no odd cycle.
   - If 2-colored, any cycle alternates colors and must return to its start color after an even number of steps, so all cycles are even. If no odd cycle exists, BFS two-coloring never assigns the same color to both ends of an edge: a conflict would close an odd cycle through the BFS tree, contradiction.
3. Why does the bipartite outer loop cost nothing on connected graphs?
   - Every later start is already colored, so each trips the `continue` immediately: $`O(V)`$ checks total. Skipping the loop misses odd cycles hiding in unvisited components.
4. LC 130 floods from the border instead of testing each region. Why is the inversion sound?
   - Border-connected regions are exactly the ones to keep; DFS marks all of them, so every unmarked O is surrounded by construction. Testing from inside cannot see the border without the same outward walk.

</details>

#### U4. Topological ordering and strongly connected components

**About 4 h** · **Target:** Derive + Implement

Topics: Topological ordering and dependency cycles; Strongly connected components

Dependency order is the scheduling primitive: builds, courses, task graphs. The same DFS skeleton that orders a DAG also carves directed graphs into strongly connected components.

**You can now**

- Implement Kahn's algorithm and DFS post-order topological sort, each with its cycle witness, and derive the $`\Theta(V + E)`$ bound.
- Prove post-order-then-reverse is a topological order from the finish-time invariant.
- Implement Kosaraju's strongly connected components and explain the reverse-graph second pass.

**Study**

1. [Topological sort: Kahn's algorithm](https://dsa.handbook.academy/curriculum/graphs/topological-sort-kahn/) (DSA Handbook - graphs) - What Kahn's actually does; The algorithm (LC 207); Worked example on the 6-course catalog; Reverse-graph Kahn for safe nodes (LC 802).
2. [Topological sort: DFS post-order reverse](https://dsa.handbook.academy/curriculum/graphs/topological-sort-dfs/) (DSA Handbook - graphs) - Why two colors are not enough; The algorithm; Walking the canonical DAG; Why post-order, then reverse, is correct; Picking between Kahn and DFS.
3. [Topological sort and strong components](https://jeffe.cs.illinois.edu/teaching/algorithms/book/06-dfs.pdf) (Algorithms - graph chapters) - Section 6.3 Topological Sort with Implicit Topological Sort; Sections 6.5 Strong Connectivity and 6.6 Strong Components in Linear Time, Kosaraju and Sharir's algorithm (printed pp. 232-234 and 237-244; Tarjan's algorithm is optional).

**Focus**

- Pin the edge convention in a comment: `[a,b]` means $`b`$ is the prerequisite, so the edge is $`b \to a`$. Inverting it turns DAGs into cycles.
- Kahn detects the cycle only at termination: emitted count equal to $`V`$ means DAG, fewer means the leftovers sit on cycles. No early return inside the loop.
- DFS emits each vertex after all successors finish, so finish times decrease along every edge; reversing puts producers first. A `GRAY` successor aborts with a cycle.
- Kosaraju finishes SCCs in topological order on the first pass, then walks the reversed graph from the latest-finishing component, which cannot escape its own SCC.

**Reproduce:** From a blank file with the course Python (3.13.14), run Kahn on $`n = 6`$ with `[[1,0],[2,0],[3,1],[3,2],[4,2],[5,3],[5,4]]` and emit a valid order such as `[0,1,2,3,4,5]` (check every $`b`$ precedes its $`a`$); on `[[1,0],[0,1]]` emit 0 of 2 and report a cycle. Then run Kosaraju on `[(0,1),(1,2),(2,0),(2,3),(3,4)]` and report components `[0,0,0,1,2]`.

**Traps**

- Counting indegrees from one edge collection and decrementing from another, such as a deduplicated set against the raw list with duplicate prerequisites: counts go negative or never reach zero. Count and decrement from the same list, and enqueue exactly when a count reaches 0.
- Returning the post-order list unreversed: it holds consumers before producers, the exact opposite of the graded order.
- Running DFS from vertex 0 only: cycles in other weakly connected components are missed. The outer white-check loop is mandatory, as is the `GRAY`-to-`BLACK` flip on exit.

**Practice**

- [LeetCode 210: Course Schedule II](https://leetcode.com/problems/course-schedule-ii/) - Examples 1 to 3 (2 courses `[[1,0]]`; 4 courses `[[1,0],[2,0],[3,1],[3,2]]`; single course with no prerequisites). Attempt cold per the AlgoMaster pool note, in either Kahn or DFS framing, then implement the other framing and compare orders. After-attempt reference is DSA Handbook 8.4 (Kahn) and 8.5 (post-order).
- [LeetCode 802: Find Eventual Safe States](https://leetcode.com/problems/find-eventual-safe-states/) - The two listed examples (7-node graph with two safe terminals; 5-node graph). Reverse-graph Kahn from terminal vertices, or three-color DFS; state which witness you report. After-attempt reference is the reverse-graph section of DSA Handbook 8.4.

**Stop when:** Your blank-file script prints a valid 6-course order, the 0-of-2 cycle verdict and the `[0,0,0,1,2]` component labels, and you can defend the Kahn-versus-DFS choice on operational grounds (iteration and lex order versus post-order computation).

<details>
<summary>Self-test</summary>

1. Prove post-order-then-reverse is a topological order.
   - When DFS exits $`u`$, its loop has returned from every successor, so each successor finished earlier: $`\operatorname{finish}[v] < \operatorname{finish}[u]`$ for every edge $`(u, v)`$. Reversing finish-time order therefore places $`u`$ before $`v`$ on every edge, which is the topological property.
2. Prove leftover vertices after Kahn imply a cycle.
   - Every leftover vertex still has indegree at least one inside the leftover subgraph. Follow any predecessor chain; with finitely many vertices some vertex repeats, and the repeated segment is a directed cycle.
3. Why does Kosaraju's second pass stay inside one SCC?
   - First-pass finish times order SCCs topologically: if SCC $`A`$ reaches SCC $`B`$, $`A`$ finishes later. Processing latest-first on the reversed graph starts each walk in a sink SCC of the reversed graph, whose reachable set is exactly its own SCC.
4. Kahn and DFS report different valid orders on the same DAG. Is one wrong?
   - No. Topological orders are plural: the handbook's 6-node DAG admits several. Kahn breaks ties by queue order, DFS by recursion shape; both respect every edge.

</details>

#### U5. Union-find with path compression and union by rank

**About 3 h** · **Target:** Implement

Topics: Union-find, path compression and union by rank or size

Connectivity queries that interleave with edge insertions defeat repeated traversal: each BFS costs a full scan while each union-find operation costs effectively constant time.

**You can now**

- Implement union-find with path compression and union by rank or size, and state the amortized inverse-Ackermann bound with its source.
- Identify when union-find cannot help: deletions, directed reachability and queries that need paths, not just connectivity.
- Choose the online union-find framing over one-shot BFS or DFS when edges arrive interleaved with queries.

**Study**

1. [Union-Find: parent forests, path compression, and union by rank](https://dsa.handbook.academy/curriculum/graphs/union-find/) (DSA Handbook - graphs) - The forest, the find, the union; Two heuristics that change the bound; Putting it all together (LC 684); LC 990: equality and inequality, two passes. Depth: Skim LC 685's directed case-split on first pass; return after the MST unit if directed redundancy still bites.
2. [Disjoint Sets, Lecture Note 11](https://jeffe.cs.illinois.edu/teaching/algorithms/notes/11-unionfind.pdf) (Algorithms - graph chapters) - 11.1 Reversed Trees (union by depth or rank, and the size-at-least-2-to-the-rank property); 11.3 Path Compression; 11.6 The Ackermann Function and its Inverse for the bound. Skim 11.2 Shallow Threaded Trees.

**Focus**

- Compare `find(x)` with `find(y)`, never `parent[x]` with `parent[y]`: cousins share a root through a chain while their immediate parents differ.
- Rank is an upper bound on height, not the height: compression shrinks trees without lowering ranks, and the size-at-least-2-to-the-rank property is what the log bound leans on.
- Count components as the set of `find(i)` over all $`i`$, never as the set of `parent` entries: stale intermediate pointers undercount.
- Process all equalities before any inequality (LC 990): input order lies, because a later union can connect an earlier checked pair.

**Reproduce:** From a blank file with the course Python (3.13.14), process `[[1,2],[1,3],[2,3]]` and return `[2,3]` as the first redundant edge. Then union the chain 0-1 through 6-7 in order with union by rank and report maximum depth 1.

**Traps**

- Rank without compression, or compression without rank: the adversarial chain `union(0,1)`, `union(1,2)`, ... builds depth $`n`$ when attachment is one-sided, and compression never fires before the first `find`.
- Recursive `find` on production-size chains: fine at LC 684 scale ($`n \le 1000`$), but the recursive form costs a frame per hop. Ship the iterative two-pass form past $`10^{5}`$ elements.
- String keys without make-set: integer constructors pre-fill every root, but email-keyed maps need an explicit make on first sighting or `find` raises `KeyError`.

**Practice**

- [LeetCode 684: Redundant Connection](https://leetcode.com/problems/redundant-connection/) - Examples 1 (`[[1,2],[1,3],[2,3]]` answers `[2,3]`) and 2 (five-edge graph). The first `union` returning `False` is the answer. After-attempt reference is the DSA Handbook 8.8 worked example and trace.
- [LeetCode 990: Satisfiability of Equality Equations](https://leetcode.com/problems/satisfiability-of-equality-equations/) - The two listed examples (`a==b` with `b!=a` answers `False`; the satisfiable set answers `True`). Two passes: unions first, inequality checks second. After-attempt reference is the LC 990 section of DSA Handbook 8.8.

**Stop when:** Your blank-file DSU prints `[2,3]` on the redundant input with max chain depth 1, and LC 684 plus LC 990 pass with roots compared, never parents.

<details>
<summary>Self-test</summary>

1. Derive the $`O(\log n)`$ bound for union by rank alone.
   - A rank-$`r`$ root has at least $`2^r`$ descendants (equal-rank merges double the set), so a tree on $`n`$ nodes has rank at most $`\log_2 n`$, and find walks at most that many parent pointers.
2. Why do two passes decide LC 990 correctly?
   - Pass one builds every equivalence class the equalities force. Pass two checks each inequality against the final partition: any same-set inequality contradicts the input, and no order dependence remains because all unions precede all checks.
3. Give two queries union-find cannot answer.
   - Deletions (parent pointers only merge; splitting needs a rebuild) and directed reachability or path queries (roots record connectivity, not direction or routes).
4. What does $`\alpha(n) \le 4`$ mean in practice?
   - Tarjan's bound says $`m`$ operations cost $`O(m \times \alpha(n))`$; $`\alpha`$ stays at most 4 for any storable $`n`$, so every operation is effectively constant, and the 1979 lower bound says no pointer-machine structure beats it.

</details>

#### U6. Dijkstra, Bellman-Ford and negative cycles

**About 5 h** · **Target:** Derive + Implement

Topics: Dijkstra relaxation, stale priorities and nonnegative weights; Negative edges, Bellman-Ford and negative-cycle detection

Nonneg weights buy a heap-ordered greedy; negative edges or hop budgets need repeated relaxation instead. Picking by weight profile, not by habit, is the whole unit.

**You can now**

- Implement lazy-deletion Dijkstra on heapq, state the stale-entry check, and name the nonneg-weight assumption it depends on.
- Prove the settle-once invariant from nonnegativity, and exhibit the wrong answer a settled variant locks in with one negative edge.
- Implement Bellman-Ford with $`V - 1`$ passes, $`V`$th-pass negative-cycle detection and the snapshot variant for $`K`$-edge budgets.

**Study**

1. [Dijkstra's shortest-path algorithm](https://dsa.handbook.academy/curriculum/graphs/dijkstra/) (DSA Handbook - graphs) - The operations: pop, lazy-skip, relax, settle; Lazy deletion: pushing duplicates instead of decrease-key; Worked example with the two stale-skip events.
2. [Bellman-Ford and negative cycles](https://dsa.handbook.academy/curriculum/graphs/bellman-ford/) (DSA Handbook - graphs) - The algorithm, in three pieces; Why V minus 1 is the right number; Bellman-Ford with a budget: LC 787 with the snapshot line; Detecting a negative cycle. Depth: Skim SPFA as a practical mention only; vanilla Bellman-Ford is the expected interview answer.
3. [Shortest Paths, Chapter 8](https://jeffe.cs.illinois.edu/teaching/algorithms/book/08-sssp.pdf) (Algorithms - graph chapters) - 8.1 Shortest Path Trees, 8.2 Negative Edges and 8.3 The Only SSSP Algorithm; 8.5 Directed Acyclic Graphs; 8.6 Best-First: Dijkstra's Algorithm with No Negative Edges; 8.7 Relax ALL the Edges: Bellman-Ford (printed pp. 274-296).

**Focus**

- heapq has no decrease-key (check `hasattr` on the course Python: `False`), so this card uses the lazy-deletion variant: push a fresh entry per relaxation and skip with `if d > dist[u]: continue`. Count the skips; the handbook graph produces exactly 2.
- Settle-once holds only for nonneg weights: every undiscovered alternative path must leave through an unsettled vertex of distance at least $`d`$, so adding nonneg remainders cannot beat $`d`$. One negative edge breaks the argument and the code stays silent.
- Bellman-Ford's pass $`i`$ is correct for paths of at most $`i`$ edges by induction, and simple paths use at most $`V - 1`$ edges. The $`V`$th pass is the detector, not bookkeeping: any relaxation there proves a reachable negative cycle.
- $`K`$-edge budgets read from the previous pass: `snapshot = dist[:]` each round. Reading live `dist` chains two edges in one pass and silently spends budget twice.

**Reproduce:** From a blank file with the course Python (3.13.14): Dijkstra on the 6-node handbook graph (source 0) returns `[0,7,9,20,20,11]` with exactly 2 stale skips (7 pushes, 8 pops). A settle-once variant on edges `[(0,1,6),(0,2,7),(2,3,-3),(3,1,-2)]` locks `dist[1]` at 6 while Bellman-Ford reports the true 2. LC 787's sample ($`n = 4`$, $`k = 1`$) returns 700 with the `snapshot` line and the wrong 400 without it.

**Traps**

- Negative input to Dijkstra: no exception, no warning, wrong distances. Scan weights for negatives first; one negative edge reroutes to Bellman-Ford.
- $`K`$ stops means $`K + 1`$ edges: a direct flight is 0 stops and 1 edge. Running $`K`$ passes under-relaxes by one hop.
- Missing `INF` guard before `dist[u] + w`: in Java and C++ `INT_MAX` plus `w` wraps negative and relaxes the unreachable. Gate on `dist[u] != INF`; Python with float inf is exempt but keep the guard for portability.

**Practice**

- [LeetCode 743: Network Delay Time](https://leetcode.com/problems/network-delay-time/) - The three listed examples (times `[[2,1,1],[2,3,1],[3,4,1]]` with $`n = 4`$ and $`k = 2`$; single edge; unreachable node). Attempt cold per the AlgoMaster pool note. Lazy-deletion heap with the stale check; answer is max dist or -1. After-attempt reference is DSA Handbook 8.9.
- [LeetCode 787: Cheapest Flights Within K Stops](https://leetcode.com/problems/cheapest-flights-within-k-stops/) - Sample ($`n = 4`$, five flights, `src` 0, `dst` 3, $`k = 1`$ answers 700). Bellman-Ford with $`K + 1`$ snapshot passes, not Dijkstra: the hop constraint breaks settle-once. After-attempt reference is DSA Handbook 8.10.

**Stop when:** Your blank-file script prints `[0,7,9,20,20,11]` with 2 stale skips, the 6-versus-2 negative-edge gap and the 700-versus-400 snapshot gap, and both LeetCode problems pass with the assumption stated before the import.

<details>
<summary>Self-test</summary>

1. Prove the settle-once claim.
   - Let $`u`$ pop with the smallest tentative distance $`d`$. Take any source-to-$`u`$ path and let $`y`$ be its first vertex outside the settled set. Its predecessor $`x`$ was settled with an exact distance (induction) and relaxed $`(x, y)`$, so the prefix up to $`y`$ costs at least $`\operatorname{dist}[x] + w(x, y) \ge \operatorname{dist}[y]`$, and $`\operatorname{dist}[y] \ge d`$ because $`u`$ popped first. The rest of the path adds nonnegative weight, so no path beats $`d`$ and $`\operatorname{dist}[u]`$ is final.
2. Prove $`V - 1`$ passes suffice for Bellman-Ford.
   - Induction: pass 1 fixes all one-edge shortest paths from direct relaxations; if pass $`i - 1`$ fixed all paths of at most $`i - 1`$ edges, pass $`i`$ extends each by one scanned edge. Simple shortest paths repeat no vertex, hence use at most $`V - 1`$ edges.
3. Why does the no-snapshot LC 787 code return 400 instead of 700?
   - Without the `snapshot` the first pass already chains edges: `(0,1)` sets `dist[1] = 100`, then `(1,2)` reads it and sets `dist[2] = 200`, then `(2,3)` sets `dist[3] = 400`, three edges against a two-edge budget. The `snapshot` makes every pass extend only the previous pass's distances.
4. When is 0-1 BFS the right call over Dijkstra?
   - All weights in $`\{{0, 1\}}`$: push front on 0-cost, back on 1-cost relaxations. The `deque` front always holds minimum tentative distance, so each operation is $`O(1)`$ and total is $`\Theta(V + E)`$ instead of heap-logged.

</details>

#### U7. Minimum spanning trees with Kruskal and Prim

**About 4 h** · **Target:** Derive + Implement

Topics: Minimum spanning trees with Kruskal and Prim

Minimum connection cost is the canonical greedy-with-proof: one theorem justifies two algorithms, and the input shape picks between them.

**You can now**

- Implement Kruskal with sorted edges plus union-find and lazy Prim with a frontier heap, stating each stale-entry rule.
- Prove accepted edges are safe with the cut-property exchange argument, and rejected edges with the cycle property.
- Choose Kruskal for explicit edge lists and Prim (dense $`O(V^2)`$ or heap) for dense or implicit graphs.

**Study**

1. [Minimum spanning tree: Kruskal's algorithm](https://dsa.handbook.academy/curriculum/graphs/mst-kruskal/) (DSA Handbook - graphs) - The pattern (LC 1584); Why it works: the cut property; Worked example on the canonical 7-vertex graph (weight 31); Variants: virtual source node. Depth: Skim LC 1489's Kruskal-twice-per-edge on first pass; edge classification is stretch.
2. [Minimum spanning trees: Prim's algorithm](https://dsa.handbook.academy/curriculum/graphs/mst-prim/) (DSA Handbook - graphs) - The pattern with the `in_mst` skip; When the graph is implicit: LC 1584; Dense Prim from $`O(n^2 \log n)`$ to $`O(n^2)`$; Kruskal vs Prim: the decision table.
3. [Minimum Spanning Trees, Chapter 7](https://jeffe.cs.illinois.edu/teaching/algorithms/book/07-mst.pdf) (Algorithms - graph chapters) - 7.1 Distinct Edge Weights; 7.2 The Only Minimum Spanning Tree Algorithm (safe and useless edges); 7.3 Boruvka's Algorithm; 7.4 Jarnik's ("Prim's") Algorithm; 7.5 Kruskal's Algorithm (printed pp. 257-268).

**Focus**

- Kruskal's guard is `union`: accept iff endpoints sit in different components, stop at $`n - 1`$ edges. The sort dominates at $`O(E \log E)`$; the DSU loop is effectively linear.
- Lazy Prim pushes `(weight, vertex)` pairs and skips with `if in_mst[u]: continue`. The heap holds duplicates; the eager decrease-key variant needs an indexed heap no standard library ships.
- Prim cumulates nothing: pushing distance-from-start plus edge weight builds a shortest-path tree, not an MST. Dijkstra cumulates, Prim does not.
- Every MST has the same total weight, and distinct weights also make the edge set unique. With ties, as in LC 1584, Kruskal and Prim may pick different edges but must report the same total.

**Reproduce:** From a blank file with the course Python (3.13.14), run Kruskal and dense Prim on `[[0,0],[2,2],[3,10],[5,2],[7,0]]`; both return 20. State the input size ($`n = 5`$, complete graph of 10 Manhattan edges) and which variant each function is.

**Traps**

- Early break on disconnected input: stopping is valid only when $`n - 1`$ accepts happen. Otherwise walk every edge and `return -1` when accepts fall short.
- Integer totals in Java and C++: LC 1584 edge weights reach $`4 \times 10^{6}`$ and 999 of them sum past `INT_MAX`. Accumulate in `long` or `long long`; Python integers are exempt.
- Forgetting either DSU heuristic: one-sided chains push finds to $`O(n)`$ before compression ever fires. Ship path halving with union by rank as in the handbook reference.

**Practice**

- [LeetCode 1584: Min Cost to Connect All Points](https://leetcode.com/problems/min-cost-to-connect-all-points/) - The five-point example (answer 20) and the two-point example. Implement both Kruskal and Prim in one file and assert equal totals. Manhattan weights tie, so the chosen edges may differ, but a different total means a bug. After-attempt reference is DSA Handbook 8.11 and 8.12.

**Stop when:** Your blank-file script prints 20 from both functions on the five-point input, and you can state the Kruskal-versus-Prim choice for an edge list, a dense matrix and a point set without hedging.

<details>
<summary>Self-test</summary>

1. Prove the cut property by exchange.
   - Let $`e`$ be the lightest edge across cut $`(S, V - S)`$ and $`T^{*}`$ an MST missing $`e`$. Adding $`e`$ creates a cycle with another crossing edge $`e'`$ of weight at least $`w(e)`$. Swapping $`e'`$ for $`e`$ keeps a spanning tree of no greater weight, so some MST contains $`e`$.
2. Why is a rejected Kruskal edge safe to drop?
   - Its endpoints already connect through accepted edges, each processed earlier hence no heavier. The closed cycle's other edges are all at most as heavy, so the rejected edge is a heaviest edge of that cycle and no MST needs it.
3. Why does dense Prim beat heap Prim on LC 1584?
   - The complete graph materializes about 500,000 edges at $`n = 1000`$; heap Prim pays $`O(n^2 \log n)`$ on them while dense Prim scans `min_edge` arrays for $`O(n^2)`$ with no heap and no stale entries.
4. Kruskal and Prim report different totals on the same input. What follows?
   - A bug: all minimum spanning trees share one total weight, so two correct runs agree on it even when tied weights let them choose different edges. Check the stale skip, the union guard and the weight function.

</details>

#### U8. Graph certificates and exhaustive small-graph validation

**About 3 h** · **Target:** Implement + Measure

Topics: Path, ordering and spanning-tree certificates; Exhaustive small-graph and differential validation

An algorithm without an independent checker is a rumor. Certificates turn outputs into checkable claims, and generated-graph tests turn examples into evidence.

**You can now**

- Write $`O(V + E)`$ checkers for claimed paths, orders and trees that use only the input plus the output.
- Build Hypothesis strategies that generate sparse, dense, disconnected, cyclic and weighted small graphs, and compare against Floyd-Warshall or exhaustive references.
- Measure adjacency representations on matched workloads with timeit, reporting CPU, Python version and setup instead of quoting ratios.

**Study**

1. [Hypothesis quickstart](https://hypothesis.readthedocs.io/en/latest/quickstart.html) (Hypothesis - generated graph tests) - Write your first test (`@given` with strategies); Dependent generation (`@composite` `ordered_pairs`); Combining Hypothesis with pytest.
2. [Custom strategies with @composite](https://hypothesis.readthedocs.io/en/latest/tutorial/custom-strategies.html) (Hypothesis - generated graph tests) - Writing helper functions; Combining `@composite` with parameters; Dependent generation with `@composite`.
3. [Strategies reference: collections](https://hypothesis.readthedocs.io/en/latest/reference/strategies.html) (Hypothesis - generated graph tests) - Collections (`lists`), `sampled_from` and composite entries used to build edge lists and weight draws.
4. [Floyd-Warshall as the oracle](https://jeffe.cs.illinois.edu/teaching/algorithms/book/09-apsp.pdf) (Algorithms - graph chapters) - Section 9.8 (Kleene-Roy-)Floyd-Warshall(-Ingerman): the triple loop over intermediate vertices (printed p. 318).

**Focus**

- A certificate is checked by different code than the solver: re-walk parent pointers for distances, scan every edge against a claimed topological order, recount components. $`O(V + E)`$ checkers, no shared helpers.
- Generate edge lists with `@composite` (draw $`n`$, draw $`m`$, draw weighted pairs), dedupe parallel edges explicitly, and cover disconnected and cyclic shapes: the default random graph is connected-ish and hides the interesting failures.
- Compare on the same instance: Dijkstra against Floyd-Warshall's row, Kruskal against Prim and against brute force at $`n \le 8`$. Cross-instance numbers prove nothing.
- Report measurements with setup: BFS on a seeded $`n = 3000`$ sparse graph takes about 0.3 ms over the list against about 97 ms over the matrix on 12th Gen i9-12900K with Python 3.13.14. Re-run it; the direction is the claim, not the ratio, and the gap is CPython row-scan overhead, not a portable constant.

**Reproduce:** From a blank file with the course Python (Hypothesis 6.169.0): a `@composite` small-graph strategy ($`n \le 7`$, `derandomize=True`) comparing Dijkstra against Floyd-Warshall on nonneg weights passes 100 examples with zero disagreements. Separately, timeit on a seeded $`n = 3000`$, 9,000-edge sparse graph shows BFS over the adjacency list at about 0.3 ms against about 97 ms over the matrix. Quote both numbers with CPU and Python version.

**Traps**

- Oracle and solver sharing code: two Dijkstra implementations sharing the `relax` helper agree even when both are wrong. The oracle must be an independent formulation (triple loop, exhaustive search).
- Connected-only generation: strategies drawing $`m \ge n - 1`$ edges rarely emit isolated vertices, so component and unreachable handling goes untested. Force sparse and empty draws.
- Quoting the 300x ratio as a constant: it measures CPython-level matrix row scans on one CPU, not an algorithmic invariant. C++ crossover points never transfer without a local measurement.

**Practice**

- [LeetCode 417: Pacific Atlantic Water Flow](https://leetcode.com/problems/pacific-atlantic-water-flow/) - The $`5 \times 5`$ example and the single-cell example. Solve unseen with tags hidden, per the NeetCode pool note: grade the model (which cells are nodes), the assumption (flow direction reversed from borders), the certificate (each claimed cell re-walked downhill to both oceans) and the tests. After-attempt reference is DSA Handbook 8.2 (DFS-from-boundary ladder).
- [LeetCode 1091: Shortest Path in Binary Matrix](https://leetcode.com/problems/shortest-path-in-binary-matrix/) - The three listed examples (diagonal path, blocked grid, single cell). Same unseen discipline: model (8-directional grid graph), assumption (unweighted, so BFS), certificate (re-walked path of the claimed length). After-attempt reference is DSA Handbook 8.1 (LC 1091 ladder entry).

**Stop when:** Your differential test passes 100 derandomized examples with zero disagreements, your timeit re-run shows the list beating the matrix by two orders of magnitude on the same seeded graph, and both unseen problems ship with a checker, not just an answer.

<details>
<summary>Self-test</summary>

1. What makes a checker independent?
   - It reads only the input and the claimed output, runs a different algorithm than the solver (edge scan, pointer re-walk), and costs $`O(V + E)`$. Shared helpers or re-running the solver prove nothing.
2. Why is Floyd-Warshall a valid oracle for Dijkstra tests?
   - It is a three-line triple loop over intermediate vertices with no heap, no settle logic and no stale entries: obviously correct by a separate argument, so agreement isolates Dijkstra's invariant rather than re-testing one implementation twice. Restrict weights to nonneg for the comparison.
3. A shrunk Hypothesis failure shows a 3-vertex graph. What do you do?
   - Keep it as a regression test, read off the violated assumption (disconnected input, parallel edges, self-loop), fix the solver or state the precondition, and re-run the full strategy.
4. Why must comparisons share the instance?
   - Graph shape, density and weight scale all move runtimes and even outputs; different instances confound the comparison. Same seed, same edge list, both algorithms, then compare.

</details>

#### U9. Flow and matching at recognition depth

**About 2 h** · **Target:** Explain

Topics: Flow and matching at recognition depth

Flows and matchings are recognition vocabulary at this stage: routing, assignment and cut problems recur across ML systems, and naming the reduction correctly is the transferable skill.

**You can now**

- State the max-flow min-cut theorem and explain how an equal-value cut certifies a claimed maximum flow.
- Reduce bipartite matching to max flow with a source, a sink and unit capacities, and read a matching back from the flow.
- Recognize flow-shaped problems (capacities, bottlenecks, conflict-free assignment) and name what a full implementation would still need.

**Study**

1. [Maximum Flows and Minimum Cuts, Chapter 10](https://jeffe.cs.illinois.edu/teaching/algorithms/book/10-maxflow.pdf) (Algorithms - graph chapters) - 10.1 Flows, 10.2 Cuts, 10.3 The Maxflow-Mincut Theorem and 10.4 Ford and Fulkerson's augmenting-path algorithm (printed pp. 328-336).
2. [Flow applications including bipartite matching, Chapter 11](https://jeffe.cs.illinois.edu/teaching/algorithms/book/11-maxflowapps.pdf) (Algorithms - graph chapters) - 11.1 Edge-Disjoint Paths and 11.3 Bipartite Matching with the source-sink unit-capacity reduction (printed pp. 353-357). Depth: Read the reductions and state the constructions; skip implementing Dinic or push-relabel here.

**Focus**

- Recognition signals: capacities on edges plus a bottleneck question means flow; two-sided assignment with conflicts (left set, right set, allowed pairs) means bipartite matching.
- The certificate is the cut: a flow of value $`F`$ with a cut of capacity $`F`$ is maximum by the theorem. Always exhibit both.
- Bipartite matching is flow with unit capacities: source to left, allowed edges left to right, right to sink; integer flow of value $`k`$ is a matching of size $`k`$.
- Explicit non-goals: residual-graph implementation at scale, Dinic or push-relabel, general (non-bipartite) matching and spectral methods stay in the section's leave-for-later list.

**Reproduce:** From a blank file with the course Python (3.13.14), run Edmonds-Karp on $`n = 4`$ with capacities `[(0,1,3),(0,2,2),(1,2,1),(1,3,2),(2,3,3)]` from 0 to 3 and report max flow 5. Exhibit the certifying cut ($`\{0\}`$ versus $`\{1, 2, 3\}`$) with capacity 3 + 2 = 5.

**Traps**

- Augmenting without residual backward edges: the greedy path choice gets stuck below maximum because it cannot undo earlier flow. Backward edges with residual capacity are the algorithm, not an optimization.
- Confusing bipartite check with bipartite matching: two-coloring decides a partition exists; matching finds the largest conflict-free edge set given one. LC 785 does not solve LC 1349.
- Undirected edges as single arcs: an undirected edge of capacity `c` becomes two opposite arcs of capacity `c`. One arc forbids flow in the other direction and can silently lower the maximum.

**Practice**

- [LeetCode 1349: Maximum Students Taking Exam](https://leetcode.com/problems/maximum-students-taking-exam/) - The three listed examples (mixed boards with blocked seats). Recognition framing only: state the column-parity reduction to bipartite matching, solve with a simple augmenting-path matcher, and verify against brute force on $`2 \times 3`$ boards. Do not implement Dinic. After-attempt reference is Erickson Section 11.3.

**Stop when:** Your blank-file script prints max flow 5 with the capacity-5 cut, and you can reduce a new assignment narrative to source-sink-unit capacities or explain why it is not a flow problem.

<details>
<summary>Self-test</summary>

1. State the max-flow min-cut theorem and its use as a certificate.
   - The value of a maximum $`s`$-$`t`$ flow equals the capacity of a minimum $`s`$-$`t`$ cut. A flow of value $`F`$ plus a cut of capacity $`F`$ proves optimality without trusting the solver: no flow can exceed any cut's capacity.
2. Give the bipartite-matching-to-flow reduction exactly.
   - Source $`s`$ to each left vertex capacity 1, each allowed left-right pair capacity 1, each right vertex to sink $`t`$ capacity 1. Integer max flow of value $`k`$ saturates $`k`$ disjoint pairs: a matching of size $`k`$, and every matching yields such a flow.
3. Why does LC 1349 admit a matching model?
   - Color seats by column parity. Every conflict (left, right, upper-left, upper-right) joins an even column to an odd one, so the conflict graph is bipartite. The answer is a maximum independent set of free seats, which on a bipartite graph equals the number of free seats minus a maximum matching (Konig's theorem). A checkerboard coloring fails: diagonal neighbors share a color.
4. What stays deliberately excluded, and why can you stop?
   - Dinic, push-relabel, general-graph matching and spectral methods: the section checkpoint needs recognition plus a small checked construction, and the section's leave-for-later list names the rest.

</details>

### Mini-project: Union-find, two narratives as graphs and a refuted method

**About 10 to 14 hours.** Build a tested union-find, turn two unfamiliar narratives into graphs with algorithms that return certificates, and reject one plausible method with a minimized counterexample.

1. Implement union-find with union by rank and path compression. State the invariants (`parent` pointers form a forest, and a root of rank $`r`$ has at least $`2^r`$ members) and the amortized cost. Test it with a Hypothesis state machine against a component-labeling oracle that runs BFS over the unions so far, asserting the rank-size invariant after every step.
2. Narrative 1, AlgoMaster Alien Dictionary (https://algomaster.io/learn/dsa/alien-dictionary): model letters as vertices and first-difference pairs as edges, and treat a longer word before its own prefix as invalid. Return a certificate: for an order, a check that every extracted edge points forward; for an empty answer, the cycle or the bad prefix pair.
3. Test the dictionary solver on generated inputs: draw a random alphabet order, generate words, sort them by that order, and check the output against the extracted edges, since several orders can be valid. Add cyclic and bad-prefix cases.
4. Narrative 2, LC 1631 Path With Minimum Effort: write the model (cells, edges weighted by height difference, path cost the maximum edge) before code, and solve it with a Dijkstra variant. Return the path and a cut certificate: the cells reachable using only edges below the answer do not include the target. The examples answer 2, 1 and 0.
5. Solve LC 1631 a second way with your union-find (add edges in increasing weight until the corners connect) and assert both methods agree on random grids.
6. Refute a right-and-down-only DP for LC 1631. It already answers 1 on the third example, whose answer is 0. Let Hypothesis against an exhaustive path search shrink a smaller counterexample (expect 6 cells, since every path in a $`2 \times 2`$ grid is monotone), and state the assumption that fails.

**Deliverables**

- The union-find module with invariants, cost notes and the state machine.
- The Alien Dictionary solver with its certificate checker and generated tests.
- Two LC 1631 solutions with the cut certificate, the agreement test and the refutation write-up.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [LeetCode 1631: Path With Minimum Effort](https://leetcode.com/problems/path-with-minimum-effort/). Submit both methods. Alien Dictionary has no free judge, so its checker and generated tests are the check.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Union-find | The state machine agrees with the component oracle, and the rank-size invariant holds after every step. | Tree heights are measured with and without path compression on an adversarial union order and compared with the $`\log n`$ bound. |
| Modeling | Each narrative has a written model (vertices, edges, weights, the question asked) before code. | The write-up names one modeling alternative that fails and why. |
| Certificates | Every answer ships with a checker that validates it without trusting the solver. | The checker catches a seeded solver bug that the examples miss. |
| Refutation | The right-and-down DP is refuted with a minimized counterexample from the exhaustive search. | The write-up states the failed assumption (some optimal path moves up or left) and why a shortest-path method repairs it. |

Feeds into: Capstone correctness library: union-find and one graph routine, the LC 1631 Dijkstra variant with its certificate. Failure evidence: the refuted method.

### Resource route

- **Primary - Course:** [DSA Handbook - graphs](https://dsa.handbook.academy/curriculum/graphs/) - Study all of Part 8 in order. For each algorithm, write the representation, invariant, forbidden input assumptions and independently checkable output before reading the implementation.
- **Required - Practice:** [AlgoMaster DSA - graph slice](https://algomaster.io/learn/dsa/course-roadmap) - Attempt Number of Islands, Course Schedule II and Network Delay Time cold. They cover traversal, dependency modeling and weighted shortest paths; add one narrative problem only if graph modeling remains weak.
- **Required - Theory:** [Algorithms - graph chapters](https://jeffe.cs.illinois.edu/teaching/algorithms/) - Use the basic graph, depth-first search, minimum spanning tree, shortest path and flow chapters, and lecture note 11 Disjoint Sets for union-find, for correctness proofs and counterexamples to tempting wrong algorithms.
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

### Study units

#### U1. Recursion contracts, backtracking and sound pruning

**About 4 h** · **Target:** Implement

Topics: Recursive state, base cases and return contracts; Choice, unchoice and complete search; Sound pruning rules and duplicate choices

Backtracking is the baseline every smarter search must beat. If the contract is vague, pruning looks like an optimization instead of what it is: a claim that the cut branches hold no solution.

**You can now**

- State the contract of a recursive enumeration: the state carried, the base case, and what each call hands back to its parent.
- Implement choose, recurse, unchoose from a blank file with push-pop symmetry and snapshot-by-value, so every complete candidate is visited exactly once.
- Add a sound prune and a duplicate-skip rule, with tests that fail when the bound cuts a valid candidate or the skip misses one.

**Study**

1. [The recursion mental model](https://dsa.handbook.academy/curriculum/foundations/recursion-mental-model/) (DSA Handbook - recursion, backtracking and greedy) - The three parts; Worked example: tracing `factorial(4)`; Variants you'll meet; Common pitfalls. Depth: Read for the contract shape only. Cost analysis returns in the next unit.
2. [The backtracking template](https://dsa.handbook.academy/curriculum/recursion-backtracking/backtracking-template/) (DSA Handbook - recursion, backtracking and greedy) - What backtracking is, exactly; The three operations; The four levers; Walking LC 17 on digits 23; What it actually costs. Depth: Use LC 17 as the chassis demo. Pruning detail comes from the N-Queens item below.
3. [Subsets, combinations, permutations](https://dsa.handbook.academy/curriculum/recursion-backtracking/subsets-combinations-permutations/) (DSA Handbook - recursion, backtracking and greedy) - Subsets (LC 78); Permutations (LC 46); Combination Sum (LC 39); When duplicates show up: LC 90 and LC 47, including the warning that the two skip predicates are not interchangeable.
4. [N-Queens: pruning and constraint propagation](https://dsa.handbook.academy/curriculum/recursion-backtracking/n-queens/) (DSA Handbook - recursion, backtracking and greedy) - The pattern; Worked example $`n = 4`$; The bitmask shift, in detail; What it actually costs.
5. [Backtracking, Chapter 2](https://jeffe.cs.illinois.edu/teaching/algorithms/book/02-backtracking.pdf) (Algorithms - recursion, backtracking and greedy) - 2.1 N Queens (printed pp. 71-74) and 2.4 The General Pattern (printed pp. 79-80).

**Focus**

- The path is identical at entry and exit: every push has a matching pop in the same scope, and every snapshot copies the `path` instead of storing the live list.
- The start-index chassis (subsets, combinations) and the used-mask chassis (permutations) take different duplicate-skip predicates. Sorting comes first in both, and the two predicates are not interchangeable.
- A prune is a claim, not a speedup: the cut branch provably holds no solution, as with a negative remaining target over positive candidates or an attacked queen square. Bitmask state passed by value needs no undo step.
- Output size sets the floor: subsets cost $`\Theta(n \cdot 2^n)`$, permutations cost $`\Theta(n \cdot n!)`$, and LC 46 stays small because $`n!`$ explodes.

**Reproduce:** From a blank file in Python 3.13.14, implement subsets and bitmask N-Queens. `subsets([1, 2, 3])` returns 8 subsets; N-Queens counts are 2 for $`n = 4`$ and 92 for $`n = 8`$. Add a pytest file that checks every reported subset against the input set and every queen board for shared columns and diagonals.

**Traps**

- Appending the live `path` instead of a copy. Every snapshot aliases one list, later pushes mutate all of them, and the result finishes as copies of an empty `path`.
- Skipping the unchoose half on one exit path, such as an early return that pops but forgets to clear `used[i]`. Keep push and pop adjacent in the same scope so no exit can split them.
- An unproved prune that keeps sample tests green, such as a `break` on the first too-large candidate when the candidates were never sorted. Prove each cut, and test it against the unpruned search. Deep recursion is a separate problem: CPython stops at about 1000 frames, and raising the limit hides a depth bug instead of bounding it.

**Practice**

- [LeetCode 51: N-Queens](https://leetcode.com/problems/n-queens/) - Attempt cold. Example $`n = 4`$ returns 2 solutions; $`n = 1`$ returns 1 solution. After submitting, read the DSA Handbook N-Queens chapter for the bitmask form and the AlgoMaster N-Queens lesson (https://algomaster.io/learn/dsa/n-queens), and compare your prune counts with the chapter cascade.

**Stop when:** N-Queens is accepted from a cold attempt, and your own tests catch a removed copy, a removed unchoose step, and an unsound prune.

<details>
<summary>Self-test</summary>

1. Why must the result store `path.copy()` rather than `path`?
   - `path` keeps mutating after the snapshot. Storing the reference makes every entry reflect the final empty `path` instead of the candidate at snapshot time.
2. What does the plain LC 78 algorithm emit on `[1, 2, 2]`, and what is the fix?
   - Eight subsets with a duplicated `[2]` and a duplicated `[1, 2]`. Sort first, then skip with `i` greater than `start` and `nums[i]` equal to `nums[i-1]`, which keeps exactly one canonical index sequence per distinct multiset.
3. Permutations run but return too few orderings. Which line is missing?
   - The unchoose half: `used[i]` set back to `False` alongside `path.pop()`. Without it the invariant `sum(used)` equal to `len(path)` breaks and sibling branches never revisit the element.
4. What makes a prune sound?
   - A proof that no cut branch holds a solution, for example remaining target below zero with positive candidates, or a queen square under attack. Samples alone cannot show this.

</details>

#### U2. Divide and conquer, recurrences and partition-based selection

**About 5 h** · **Target:** Derive + Implement

Topics: Divide, solve and combine structure; Recursion trees and common cost recurrences; Partition-based selection and pivot behavior

Divide and conquer sets the price of every recursive algorithm you will write. Selection shows the same recurrence idea deciding between linear and quadratic time.

**You can now**

- Solve $`T(n) = 2T(n/2) + n`$, $`T(n) = T(n/2) + n`$, and $`T(n) = T(n-1) + 1`$ with recursion trees, stating depth, per-level cost and leaf count.
- Explain why floors and ceilings change the answer by at most a constant factor, and when an unbalanced split breaks the tree bound.
- Implement deterministic linear-time selection by median of medians and check it against a sorted oracle with pytest on small shuffled inputs.
- State the quickselect recurrence and its quadratic worst case, and point to the partition unit for the invariant and to the randomized unit for the expected cost.

**Study**

1. [Recursion, Chapter 1](https://jeffe.cs.illinois.edu/teaching/algorithms/book/01-recursion.pdf) (Algorithms - recursion, backtracking and greedy) - 1.4 Mergesort, 1.5 Quicksort, 1.6 The Pattern and 1.7 Recursion Trees (printed pp. 26-35), then 1.8 Linear-Time Selection: Quickselect, Good pivots and Analysis (printed pp. 35-40). Depth: Skip Fast Multiplication and Exponentiation here. They return with dynamic programming and number theory.
2. [Recursion patterns: linear, tree, and divide-and-conquer](https://dsa.handbook.academy/curriculum/recursion-backtracking/recursion-patterns/) (DSA Handbook - recursion, backtracking and greedy) - What "shape of the recursion" means; Linear: one self-call per frame; Tree: two self-calls per frame; Divide-and-conquer: split, recurse, combine; What it actually costs. Depth: Use it as the shape vocabulary for the tree accounting in Erickson. Memoization detail belongs to the dynamic programming stage.

**Focus**

- Tree accounting has three numbers: depth, cost per level, and leaf count. $`T(n) = 2T(n/2) + n`$ with $`T(1) = 1`$ gives depth 10 and 11264 at $`n = 1024`$, checked with a five-line evaluator.
- One-sided recursion is a path, not a tree: $`T(n) = T(n/2) + n`$ sums to $`\Theta(n)`$, while $`T(n) = T(n-1) + 1`$ sums to $`\Theta(n^2)`$. Dropping the combine cost changes the answer.
- Groups of five guarantee a pivot that discards a fixed fraction on both sides, giving $`T(n)`$ below $`T(n/5) + T(7n/10) + O(n)`$, which sums to linear because 1/5 plus 7/10 is below 1.
- Fixed-pivot quickselect on sorted input recurses on $`n - 1`$ each level and is quadratic. The randomness or the median of medians is doing the work, not the partition loop.

**Reproduce:** Closed book, solve $`T(n) = 2T(n/2) + n`$ with $`T(1) = 1`$ by tree: depth 10, per-level cost 1024, total 11264 at $`n = 1024`$, confirmed with a short evaluator. Then, in Python 3.13.14, implement median-of-medians select with groups of five and check it against `sorted(xs)[k]` with pytest on 300 seeded lists of length 1 to 60 with duplicates. Finally count comparisons for first-element-pivot quickselect ($`n - 1`$ per partition) on sorted `range(1000)` with $`k = 999`$: 499500, which is $`n(n - 1)/2`$.

**Traps**

- Reading $`T(n) = T(n/2) + n`$ as $`n \log n`$. Halving with linear combine is a geometric series summing below $`2n`$; the log appears only when both halves are solved.
- Applying tree intuition to unbalanced splits without checking: $`T(n) = T(3n/4) + T(n/4) + n`$ is still $`n \log n`$, but $`T(n) = T(n-1) + n`$ is quadratic.
- Quoting linear quickselect without naming the pivot policy. First-element pivot on sorted input is the quadratic case, and this unit proves the recurrence rather than the partition code.

**Practice**

- [LeetCode 493: Reverse Pairs](https://leetcode.com/problems/reverse-pairs/) - Attempt cold with merge-sort counting. Examples: `[1, 3, 2, 3, 1]` returns 2; `[2, 4, 3, 5, 1]` returns 3. Write the recurrence your code satisfies, then differentially test against the $`O(n^2)`$ double loop on 200 seeded arrays up to length 40, including negatives and values near $`2^{31}`$. After submitting, read the AlgoMaster Reverse Pairs lesson (https://algomaster.io/learn/dsa/reverse-pairs) and compare where the count is taken relative to the merge.
- [LeetCode 215: Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/) - Resubmit with your deterministic median-of-medians select, with no random pivot. Examples: `[3, 2, 1, 5, 6, 4]` with $`k = 2`$ returns 5; `[3, 2, 3, 1, 2, 4, 5, 5, 6]` with $`k = 4`$ returns 4. The partition unit solved this problem with random pivots; this pass checks the median-of-medians code on the judge's sorted and duplicate-heavy tests.

**Stop when:** You derive the three recurrences without notes, Reverse Pairs is accepted, and your median-of-medians select matches `sorted` on every small test and is accepted on LC 215.

<details>
<summary>Self-test</summary>

1. Solve $`T(n) = T(n/2) + n`$ with $`T(1) = 1`$.
   - $`\Theta(n)`$. Level costs are $`n`$, $`n/2`$, $`n/4`$ and so on, summing below $`2n`$. The recursion is a single path, so there is no leaf multiplicity.
2. Give the quickselect worst case: input, pivot rule, and comparison count.
   - Sorted input with a first-element pivot and the largest element as the target. Every partition splits into 0 and $`n - 1`$, so comparisons total $`n(n - 1)/2`$: 499500 for $`n = 1000`$. A middle target is still quadratic, about $`3n^2/8`$.
3. Why is median-of-medians linear?
   - Its recurrence is $`T(n)`$ below $`T(n/5) + T(7n/10) + O(n)`$. The subproblem fractions sum to 9/10, below 1, so the level costs form a convergent geometric series.
4. What does this unit own that the partition unit does not, and vice versa?
   - This unit owns recurrence analysis and deterministic median of medians. The partition unit owns the partition invariant, the quickselect implementation, adversarial pivots, and the top-k tradeoff.

</details>

#### U3. Greedy choice, optimal substructure and exchange arguments

**About 4 h** · **Target:** Derive

Topics: Greedy-choice property and optimal substructure; Exchange, staying-ahead and cut arguments

Greedy is the shortest path from idea to code and the easiest place to be confidently wrong. The proof is the algorithm, so write it before the loop.

**You can now**

- State the greedy-choice property and optimal substructure of a new problem in one paragraph each, before writing any loop.
- Prove a greedy rule with an exchange argument that preserves feasibility and never worsens the objective.
- Prove a greedy rule with a staying-ahead invariant that compares the greedy prefix against every optimal prefix.

**Study**

1. [Greedy thinking: when local choices win, and when they do not](https://dsa.handbook.academy/curriculum/greedy/greedy-thinking/) (DSA Handbook - recursion, backtracking and greedy) - When greedy is provably correct: The exchange argument; Greedy stays ahead; A working example: Partition Labels. Depth: Use the Where greedy fails section as a preview of the next unit. Counterexample drills live there.
2. [Huffman encoding](https://dsa.handbook.academy/curriculum/greedy/huffman-encoding/) (DSA Handbook - recursion, backtracking and greedy) - The algorithm; Watching it run; Why Huffman codes are optimal prefix codes: the sibling exchange and the optimal-substructure step.
3. [Greedy Algorithms, Chapter 4](https://jeffe.cs.illinois.edu/teaching/algorithms/book/04-greedy.pdf) (Algorithms - recursion, backtracking and greedy) - 4.1 Storing Files on Tape for the first exchange argument, 4.3 General Pattern for the exchange template, and 4.4 Huffman Codes (printed pp. 159-170). Depth: Erickson proves everything by exchange; take stays-ahead from the handbook. Skip 4.5 Stable Matching.

**Focus**

- Exchange has a fixed shape: take an optimal solution, swap its first differing choice for the greedy one, show validity kept and the objective not worse, then induct on the rest.
- Staying-ahead has a different shape: the greedy frontier dominates every optimal prefix at each step, as with Jump Game max reach. Pick the template that matches the state you can compare.
- Optimal substructure must hold after the greedy choice. In Huffman coding, merging the two least frequent symbols leaves a smaller instance whose optimum sits inside the full optimum through the weight recurrence.
- Partition Labels is the stays-ahead drill: last occurrence table, extend the part end, cut at $`i = \text{end}`$, in $`O(n)`$ time and $`O(1)`$ extra space.

**Reproduce:** From a blank file in Python 3.13.14, implement Partition Labels from its invariant and run it on `ababcbacadefegdehijhklij` to get `[9, 7, 8]`. Closed book, write the Huffman exchange step: swapping a least frequent symbol into a deepest sibling leaf changes total cost by at most zero.

**Traps**

- Proving by example. Passing samples shows the code runs; only the exchange or staying-ahead step shows no optimal solution beats it.
- An exchange that breaks feasibility. Swapping must keep the prefix-free sibling structure in Huffman coding and disjointness in scheduling, or the transformed optimum is not a valid candidate.
- Staying ahead on a measure that does not imply the objective. Largest-coin-first on coins `[1, 3, 4]` with target 6 leads on amount covered after one coin (4 against 3), yet needs 3 coins ($`4 + 1 + 1`$) against the optimal 2 ($`3 + 3`$).

**Practice**

- [LeetCode 134: Gas Station](https://leetcode.com/problems/gas-station/) - Attempt cold. Example `gas` `[1, 2, 3, 4, 5]` with `cost` `[3, 4, 5, 1, 2]` returns 3; `gas` `[2, 3, 4]` with `cost` `[3, 4, 3]` returns minus 1. After submitting, read the DSA Handbook Jump games and gas station chapter (Claims 1 and 2) and the AlgoMaster Gas Station lesson (https://algomaster.io/learn/dsa/gas-station), and restate your loop invariant in their terms.

**Stop when:** Gas Station is accepted from a cold attempt, and you can write the Huffman exchange step and the total-surplus argument without notes.

<details>
<summary>Self-test</summary>

1. When do you reach for exchange, and when for staying-ahead?
   - Exchange fits when any optimum can be rewritten choice by choice into greedy form. Staying-ahead fits when greedy maintains a frontier, such as reach or coverage, that dominates every optimal prefix at each step.
2. State the Huffman exchange computation.
   - Let $`x`$ be a least frequent symbol and $`b`$ a deepest leaf. Swapping their positions changes weighted path length by $`(\text{freq}[b] - \text{freq}[x]) \times (\text{depth}[x] - \text{depth}[b])`$, which is at most zero since $`\text{freq}[b]`$ is at least $`\text{freq}[x]`$ and $`\text{depth}[x]`$ is at most $`\text{depth}[b]`$. Repeat until the two least frequent symbols are deepest siblings.
3. Why does $`\text{total gas} - \text{total cost}`$ at least zero guarantee a valid start?
   - Start after the station where cumulative surplus hits its minimum. Every partial sum from there stays nonnegative, so the tank never empties over the full circuit.
4. What optimal-substructure claim does Huffman coding need after the greedy merge?
   - Merging the two least frequent symbols into one parent leaves a smaller coding instance, and an optimal tree for the smaller instance extends to an optimal tree for the original through the weight recurrence.

</details>

#### U4. Greedy counterexamples and interval scheduling

**About 4 h** · **Target:** Derive + Implement

Topics: Minimal counterexamples to plausible greedy rules; Interval, scheduling and covering problems

Interval scheduling is the rare greedy proof you can carry in your head. Counterexamples are the tool that stops the wrong greedy rule before it ships.

**You can now**

- Construct a minimal counterexample that separates two plausible greedy rules on the same problem.
- Prove earliest-finish interval scheduling with the exchange argument and state its $`O(n \log n)`$ time and $`O(1)`$ extra space.
- Implement earliest-finish from the comparator contract and differentially test it against brute force on small inputs with pytest.

**Study**

1. [Interval scheduling: the comparator is the algorithm](https://dsa.handbook.academy/curriculum/greedy/interval-scheduling/) (DSA Handbook - recursion, backtracking and greedy) - Why the obvious approach finds the wrong answer; Why sort-by-end is optimal; Worked example: LC 435 on `[[1,2], [2,3], [3,4], [1,3]]`; Sort-by-start, fold while overlapping (LC 56).
2. [Greedy thinking: the failure half](https://dsa.handbook.academy/curriculum/greedy/greedy-thinking/) (DSA Handbook - recursion, backtracking and greedy) - Where greedy fails, with coins `[1, 3, 4]` and the decision rule. Depth: Read only the failure section and the decision rule. The proof templates were covered in the previous unit.
3. [Scheduling Classes, Section 4.2](https://jeffe.cs.illinois.edu/teaching/algorithms/book/04-greedy.pdf) (Algorithms - recursion, backtracking and greedy) - 4.2 Scheduling Classes (printed pp. 161-164): the earliest-finish rule and its exchange argument.

**Focus**

- The comparator is the algorithm: sort by end time, keep an interval exactly when its $`\text{start}`$ is at least the $`\text{current end}`$. Touching intervals are allowed in LC 435.
- The exchange step replaces the optimal first interval with the earliest-finishing one: it ends no later, so the rest stays disjoint, and induction finishes the proof.
- Sort-by-start fails on nesting: `[[1, 100], [2, 3], [3, 4]]` keeps the long interval and removes 2, while the optimum keeps the two short ones and removes 1.
- LC 435 and LC 56 differ at the boundary: LC 435 treats touching intervals as disjoint (overlap means $`\text{start} < \text{end}`$), while LC 56 merges them ($`\text{start} \le \text{end}`$, then extend with `max`). Pasting one boundary into the other is the standard bug.

**Reproduce:** From a blank file in Python 3.13.14, implement earliest-finish: `[[1, 2], [2, 3], [3, 4], [1, 3]]` returns 1 removal. A pytest loop over 500 small instances from `random.Random(7)` agrees with the brute-force maximum on all 500 cases.

**Traps**

- Sorting by start or by duration. Start order fails on nesting (`[[1, 100], [2, 3], [3, 4]]`); shortest-first fails when a short interval straddles two disjoint ones (`[[1, 5], [4, 7], [6, 10]]` keeps 1 against 2). Friendly samples pass both, so the test family needs both shapes.
- Treating touching intervals as overlapping in LC 435. `[[1, 4], [4, 5]]` removes nothing under LC 435 but merges under LC 56; the two problems also sort differently, by end and by start.
- Trusting sample tests for a greedy rule. Shrink each candidate rule against the others until the smallest input where they disagree, and check nested and touching cases first.

**Practice**

- [LeetCode 435: Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals/) - Examples: `[[1, 2], [2, 3], [3, 4], [1, 3]]` returns 1; `[[1, 2], [1, 2], [1, 2]]` returns 2. After submitting, read the DSA Handbook interval-scheduling chapter and the AlgoMaster Non-overlapping Intervals lesson (https://algomaster.io/learn/dsa/non-overlapping-intervals), and confirm your sort key and boundary match theirs.

**Stop when:** LC 435 is accepted, and your differential test plus a nested-interval case both pass.

<details>
<summary>Self-test</summary>

1. Give the earliest-finish exchange step in one move.
   - Let $`g_1`$ be the earliest-finishing interval and $`o_1`$ the first interval of an optimal set. $`o_1`$ ends no earlier than $`g_1`$, so replacing $`o_1`$ with $`g_1`$ keeps the set disjoint and no smaller; induct on the rest.
2. Give the minimal counterexample to sort-by-start for maximum non-overlapping intervals.
   - `[[1, 100], [2, 3], [3, 4]]`. Start order keeps `[1, 100]` and removes 2. The optimum keeps `[2, 3]` and `[3, 4]` and removes 1.
3. What does `[[1, 4], [4, 5]]` give under LC 435 and under LC 56?
   - LC 435 removes 0 because touching is allowed. LC 56 merges to `[1, 5]`. The overlap tests differ only at equality.
4. How do you hunt a counterexample to a new greedy rule?
   - Shrink to the smallest input where two candidate rules disagree, trying nested, touching, and equal-endpoint cases first. A rule that survives only sorted samples is not proved.

</details>

#### U5. Randomized correctness, expected cost and selection

**About 4 h** · **Target:** Derive + Implement

Topics: Randomized correctness, expected cost and reproducible seeds; Randomized selection and hashing behavior; High-probability and concentration bounds

Random pivots turn a quadratic worst case into linear expected time. The guarantee only means something if you can say what is expected, over what randomness, and with what tail.

**You can now**

- Distinguish Las Vegas from Monte Carlo algorithms and state what is random in each: running time versus answer.
- Derive linear expected cost for randomized selection with indicator variables or a good-pivot recurrence, naming the exact comparison event counted.
- Separate expected cost from high-probability guarantees, and write the seed and trial contract that makes an empirical check reproducible.

**Study**

1. [Nuts and Bolts: randomized analysis method](https://jeffe.cs.illinois.edu/teaching/algorithms/notes/02-nutsbolts.pdf) (Algorithms lecture notes - randomized algorithms) - 2.2 Deterministic vs. Randomized Algorithms, 2.3 Back to Nuts and Bolts and 2.4 Finding All Matches; 2.6 Recursive Analysis (the good-pivot bound) and 2.7 Iterative Analysis (indicator variables); Exercise 5 on QuickSelect. Depth: Exercise 4, reservoir sampling, belongs to the next unit. Skip 2.8 Masochistic Analysis.
2. [Tail Inequalities: expected versus high-probability](https://jeffe.cs.illinois.edu/teaching/algorithms/notes/04-chernoff.pdf) (Algorithms lecture notes - randomized algorithms) - 4.1 Markov's Inequality, 4.3 Chebyshev's Inequality, 4.5 Chernoff Bounds, and 4.7 to 4.8 Back to Treaps as the expected-versus-high-probability example.
3. [Expectation, linearity, and deviation bounds](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/pages/readings/) (MIT 6.042J - probability and randomized algorithms) - Session 32: Chapter 18.4 Great Expectations and 18.5 Linearity of Expectation. Session 33: Chapter 19.1 Markov's Theorem, 19.2 Chebyshev's Theorem and 19.3 Properties of Variance.

**Focus**

- Las Vegas: the answer is always right and the running time is random, as with random-pivot quickselect and rejection sampling. Monte Carlo: the running time is fixed and the answer may be wrong with bounded probability, as with Miller-Rabin. Fisher-Yates and reservoir sampling fit neither: they run in fixed time and their job is to produce a distribution.
- Linearity of expectation needs no independence, so indicator variables over pivot comparisons sum directly to the expected count.
- This unit owns the expected-cost derivation for random pivots. Deterministic median of medians lives in the previous unit and partition code lives in the partition unit.
- Expected cost is a mean; high-probability bounds tail risk through Markov, Chebyshev, or Chernoff. Treap depth is the worked example of the stronger claim.

**Reproduce:** In Python 3.13.14, simulate `rand10` from `rand7` with a `random.Random(0).randint(1, 7)` stub over 20,000 calls: mean `rand7` calls 2.459 against theory $`2 \times 49/40 = 2.45`$. Then sum the pair indicators $`2/(\max(j, k) - \min(i, k) + 1)`$ for the median of 1000 elements ($`k = 500`$): 3336.3 expected comparisons. Run random-pivot quickselect ($`n - 1`$ comparisons per partition) on shuffled `range(1000)` for 2000 seeded trials: the mean lands within about 50 of 3336, while single runs spread with a standard deviation near 980. Record sizes, seed, trials and theory with each run.

**Traps**

- Reading expected $`O(n)`$ as fast on every run. The tail exists, so report trial counts and seeds, and never promise a single-run bound from an expectation.
- Unseeded RNG inside tests. The suite passes until it does not; seed `random.Random` explicitly and record the seed with the expected output.
- Modulo bias in hand-rolled reduction: mapping two `rand7` calls mod 10 favors some digits because 49 outcomes do not split evenly, so rejection keeps 1 to 40 and redraws 41 to 49.

**Practice**

- [LeetCode 470: Implement Rand10() Using Rand7()](https://leetcode.com/problems/implement-rand10-using-rand7/) - The examples call `rand10` 1, 2 and 3 times. Test with a seeded `rand7` stub and count mean `rand7` calls over 20,000 calls, expecting about 2.45. After submitting, read the DSA Handbook randomized-algorithms rejection section, which works the 2.45 figure from $`2 \times 49/40`$.
- [Erickson lecture note 2, Exercise 5: QuickSelect analysis](https://jeffe.cs.illinois.edu/teaching/algorithms/notes/02-nutsbolts.pdf) - Parts (a) to (d): expected-time recurrence, comparison probability, subarray probability, and linear expected time for any $`n`$ and $`k`$. Paper analysis, not judged code. Check part (b) against your pair-indicator sum from the reproduce step; the partition implementation belongs to the partition unit.

**Stop when:** LC 470 is accepted with a seeded stub test, and you can derive the 2.45 figure and the linear quickselect bound without notes.

<details>
<summary>Self-test</summary>

1. Is quickselect Las Vegas or Monte Carlo, and what is random about it?
   - Las Vegas. It always returns the correct $`k`$th element; only the number of comparisons varies with the random pivot choices.
2. Why does linearity of expectation apply to quickselect comparison indicators?
   - Expectation of a sum equals the sum of expectations with no independence requirement, so dependent comparison events still sum directly.
3. What is the difference between expected treap depth and depth with high probability?
   - Expected depth is a mean over random priorities. The high-probability bound says all but a tiny fraction of runs stay within $`O(\log n)`$, which needs a tail inequality rather than linearity alone.
4. What must an empirical check of a randomized claim record?
   - Input sizes, seed, trial count, theory value, and tolerance. For example: 20000 trials at seed 0 give 2.459 `rand7` calls per `rand10` against theory 2.45.

</details>

#### U6. Reservoir sampling, unbiased shuffling and empirical checks

**About 4 h** · **Target:** Implement + Measure

Topics: Reservoir sampling and bounded-memory streams; Unbiased shuffling and distribution checks; Empirical probability checks and tolerance choice

Streams do not fit in memory and shuffles must be uniform, not merely random-looking. The proof is one induction; the check is a seeded experiment you can rerun.

**You can now**

- Implement reservoir sampling and prove each position is kept with the claimed probability by induction.
- Implement Fisher-Yates and show every permutation is equally likely by counting $`n!`$ paths.
- Test a sampler empirically with fixed seeds, trial counts, and tolerances, using pytest and Hypothesis for property and uniformity checks.

**Study**

1. [Randomized algorithms: Fisher-Yates, reservoir, rejection](https://dsa.handbook.academy/curriculum/recursion-backtracking/randomized-algorithms/) (DSA Handbook - recursion, backtracking and greedy) - Fisher-Yates shuffle in linear time; Reservoir sampling with the equal-probability induction; Pitfalls: naive swap, Sattolo cycles, modulo bias, 32-bit PRNG limits.
2. [Discrete Probability: shuffles](https://jeffe.cs.illinois.edu/teaching/algorithms/notes/01-random.pdf) (Algorithms lecture notes - randomized algorithms) - 1.6 Random Permutations (DrawLots, FisherYates, SelectionShuffle and InsertionShuffle); Exercise 10(a), NaiveShuffle on $`n = 3`$. Depth: Exercise 11, QuickShuffle, is optional depth.
3. [Nuts and Bolts, Exercise 4: stream sampling](https://jeffe.cs.illinois.edu/teaching/algorithms/notes/02-nutsbolts.pdf) (Algorithms lecture notes - randomized algorithms) - Exercise 4(a) and 4(b): one and $`k`$ uniform samples from a stream in $`O(1)`$ and $`O(k)`$ space without knowing its length.
4. [Sampling estimation](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/pages/readings/) (MIT 6.042J - probability and randomized algorithms) - Session 34: Chapter 19.4 Estimation by Random Sampling and 19.5 Confidence versus Probability.

**Focus**

- Reservoir induction: with one slot, the old item survives with probability $`(i - 1)/i`$, so each of the first $`i`$ items is kept with $`1/(i - 1) \times (i - 1)/i = 1/i`$.
- Fisher-Yates has exactly $`n!`$ equally likely paths. CPython `random.Random.shuffle` on 3.13.14 loops backwards with `_randbelow`, checked with `inspect` against the installed source.
- Naive swap-with-any-index has $`n^n`$ paths over $`n!`$ permutations and is biased; the rand-below-i variant (Sattolo) yields only single cycles; a 32-bit seed cannot reach all $`52!`$ orders.
- Empirical contract: sizes, seed, trials, tolerance. `random.Random(0).shuffle` on 4 items, 4800 times, gives counts from 172 to 220 against 200 expected and a chi-square statistic of 22.6, under the 0.001 critical value of 49.7 at 23 degrees of freedom. The naive swap-with-any-index shuffle scores 126.7.

**Reproduce:** In Python 3.13.14 with Hypothesis 6.169.0 and pytest 9.1.1, implement reservoir sampling (Algorithm R: for `i >= k` draw `j = rng.randrange(i + 1)` and replace slot `j` when `j < k`). With $`k = 5`$ over `range(100)` and `random.Random(0)` it returns `[63, 1, 2, 50, 34]`. Over seeds 0 to 3999 on `range(50)`, item 0 is kept with fraction 0.0985 against theory 0.1. Write a pytest file with a Hypothesis permutation-preservation property for your Fisher-Yates and the seeded chi-square check above; expect 2 passed.

**Traps**

- An off-by-one in the replacement range silently biases late items. The seeded fraction-kept check against $`1/i`$ catches it; eyeballing a few samples does not.
- Shuffling with a random comparator, or by sorting on random keys from a small range. A random comparator is inconsistent, so the result depends on the sort algorithm; tied keys keep input order under a stable sort. Distinct random float keys are uniform but cost $`O(n \log n)`$; Fisher-Yates is $`O(n)`$.
- Unseeded empirical tests that flake. Seed every RNG, record trials and tolerance, and rerun the exact command before claiming uniformity.

**Practice**

- [LeetCode 382: Linked List Random Node](https://leetcode.com/problems/linked-list-random-node/) - Calls `Solution` then `getRandom` repeatedly on `[1, 2, 3]`. Implement with reservoir sampling at $`k = 1`$ in $`O(1)`$ extra space. After submitting, reread the DSA Handbook reservoir section and check your replacement probability against its induction.
- [LeetCode 384: Shuffle an Array](https://leetcode.com/problems/shuffle-an-array/) - Calls `Solution`, `shuffle`, `reset`, `shuffle` on `[1, 2, 3]`. Implement Fisher-Yates and test uniformity over fixed seeds. After submitting, compare with the DSA Handbook Fisher-Yates section and its naive-shuffle counterexample.

**Stop when:** Both problems are accepted, and your seeded reservoir and chi-square checks reproduce the stated numbers.

<details>
<summary>Self-test</summary>

1. Prove the reservoir induction step for one slot.
   - Assume each of the first $`i - 1`$ items is kept with $`1/(i - 1)`$. Item $`i`$ is kept with $`1/i`$, and each old item survives with $`(i - 1)/i`$, giving $`1/(i - 1) \times (i - 1)/i = 1/i`$.
2. Why is swapping each position with any of $`n`$ indices biased for $`n = 3`$?
   - It has $`3^3 = 27`$ paths over 6 permutations, and 27 is not divisible by 6, so some permutations must get more paths than others.
3. What does the Sattolo variant generate?
   - Only single $`n`$-cycles: each position swaps with a strictly earlier index, so fixed points and short cycles never appear.
4. Your shuffle gives a chi-square of 22.6 over 24 permutations from 4800 trials. What does that show?
   - The counts are consistent with uniform: 23 degrees of freedom expect a statistic near 23, and the 0.001 critical value is 49.7. It does not prove uniformity; it fails to detect bias at this sample size, while the naive shuffle's 126.7 is detected.

</details>

### Mini-project: A proved greedy, a pruned search and a seeded sampler check

**About 8 to 12 hours.** Prove one greedy rule and refute a tempting alternative before coding, implement a backtracking search whose prunes are each sound, and verify a weighted sampler with a seeded statistical test.

1. LC 1029 Two City Scheduling, without reading its tags: before coding, state the rule (sort by $`\text{cost to A} - \text{cost to B}`$ and send the first half to $`A`$) and prove it with an exchange argument. The examples answer 110 and 1859.
2. Refute the alternative that sends each person to their cheaper city, in order of their smaller cost, until a city fills. Search with brute force over all splits; two people suffice: `[[1, 1], [1, 2]]` costs 3 against the optimal 2.
3. LC 698 Partition to $`K`$ Equal Sum Subsets: backtrack over buckets with prunes stated as claims: sort in decreasing order, fail at once when a number exceeds the target, and skip a bucket whose current sum equals one already tried at this level. Prove the last prune sound by symmetry. The examples answer `true` and `false`.
4. Differential-test the pruned search against the unpruned one on random small inputs and report node counts with and without each prune. Then remove the backtracking over buckets (place each number in the first bucket that fits) and let the test find a counterexample; `[4, 3, 3, 2, 2, 2]` with $`k = 2`$ is one.
5. LC 528 Random Pick with Weight: prefix sums and a binary search. With `random.Random(0)` and `weights` `[1, 3, 5, 1]`, draw 20,000 picks and compute a chi-square statistic against the weights: 3 degrees of freedom, 0.001 critical value 16.27. With `randint(1, total)` and `bisect_left` the statistic is about 4.9.
6. Plant the off-by-one (`bisect_right` on the same 1-based draw) and show the test catches it: every count shifts, and index 4 appears although only 0 to 3 exist. Make the check a pytest that passes for seeds 0 to 19 on the correct sampler and fails on the planted one.

**Deliverables**

- The LC 1029 exchange proof, written before code, with the refuted rule and its counterexample.
- The LC 698 pruned search with soundness claims, node counts and the caught unsound variant.
- The LC 528 sampler with its seeded chi-square test and the planted off-by-one.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [LeetCode 1029: Two City Scheduling](https://leetcode.com/problems/two-city-scheduling/). Submit after the proof is written.
- external-tests: [LeetCode 698: Partition to $`K`$ Equal Sum Subsets](https://leetcode.com/problems/partition-to-k-equal-sum-subsets/). Submit the pruned search.
- external-tests: [LeetCode 528: Random Pick with Weight](https://leetcode.com/problems/random-pick-with-weight/). The judge checks the distribution loosely; your chi-square test is the real check.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Greedy proof | The exchange argument is written before code, LC 1029 is accepted, and the refuted rule has a minimized counterexample. | The proof handles ties, and the write-up explains what information the refuted order ignores. |
| Pruned search | Every prune has a one-line soundness claim, and the pruned and unpruned searches agree on random inputs. | Node counts per prune are reported, and the differential test catches the first-fit variant. |
| Randomized check | The chi-square test states seed, trials, statistic and critical value, and the planted off-by-one fails it. | The pytest passes for seeds 0 to 19 on the correct sampler (the statistic stays far below 16.27) and fails on the planted one for every seed. |

Feeds into: Capstone failure evidence: the refuted greedy, the first-fit variant and the off-by-one sampler. Transfer: LC 1029 solved cold with its proof.

### Resource route

- **Primary - Course:** [DSA Handbook - recursion, backtracking and greedy](https://dsa.handbook.academy/curriculum/) - Study Part 7, Part 10 and the relevant foundations on recursion and probability. Write the state definition or greedy claim before opening code.
- **Required - Practice:** [AlgoMaster DSA - decomposition and greedy slice](https://algomaster.io/learn/dsa/course-roadmap) - Attempt N-Queens and Gas Station cold, then implement reservoir sampling and test its output distribution over fixed-seed trials. Add another judged problem only for a diagnosed weakness.
- **Required - Theory:** [Algorithms - recursion, backtracking and greedy](https://jeffe.cs.illinois.edu/teaching/algorithms/) - Use the recursion, backtracking, divide-and-conquer and greedy chapters for recurrence derivations, proof templates and counterexamples.
- **Support - Theory:** [MIT 6.042J - probability and randomized algorithms](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/pages/readings/) - Use the probability, expectation and concentration readings to derive sampling probabilities and distinguish expected from high-probability guarantees.
- **Support - Theory:** [Algorithms lecture notes - randomized algorithms](https://jeffe.cs.illinois.edu/teaching/algorithms/#notes) - Use note 1 Discrete Probability, note 2 Nuts and Bolts (randomized quicksort, with QuickSelect in its exercises), note 4 Tail Inequalities and note 5 Hashing to derive expected costs, separate expected from high-probability guarantees, and analyze hashing behavior.

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

### Study units

#### U1. Dynamic programming states, transitions and base cases

**About 3 h** · **Target:** Derive

Topics: State sufficiency and overlapping subproblems; Optimal substructure and transition completeness; Base cases, invalid states and initialization

Every later card asks for the state first. If the state misses information the future needs, no memo or loop order can fix it.

**You can now**

- Write the state, recurrence, base cases and evaluation order for an unseen optimization problem before coding.
- Explain why optimal substructure and overlapping subproblems are both needed, using a negative example.
- Prove a recurrence considers every feasible optimum and never admits an invalid solution.

**Study**

1. [Smart recursion first, tables second](https://jeffe.cs.illinois.edu/teaching/algorithms/book/03-dynprog.pdf) (Algorithms - dynamic programming) - Section 3.4, The Pattern: Smart Recursion (pp. 105-107): specification plus solution, then subproblems, dependencies and evaluation order.
2. [Text segmentation recurrence](https://jeffe.cs.illinois.edu/teaching/algorithms/book/03-dynprog.pdf) (Algorithms - dynamic programming) - Section 3.3 (p. 105): $`\operatorname{Splittable}(i)`$ recurrence with base $`\operatorname{Splittable}(n+1) = \text{True}`$ and $`O(n^2)`$ `IsWord` calls.
3. [Optimal substructure by contradiction](https://jeffe.cs.illinois.edu/teaching/algorithms/book/03-dynprog.pdf) (Algorithms - dynamic programming) - Section 3.7 Edit Distance, Recursive Structure (pp. 111-112): remove the last column of an optimal alignment, and the rest is optimal for the prefixes, proved by contradiction.
4. [The two conditions with a negative example](https://dsa.handbook.academy/curriculum/dynamic-programming/dp-recursion-to-memo/) (DSA Handbook - dynamic programming) - What dynamic programming actually is: optimal substructure plus overlapping subproblems, with merge sort as the negative example. Depth: The opening says naive `fib(43)` makes about 433 million calls; that is $`F(43)`$, the return value. Erickson Section 3.1 gives the call count $`2F(n+1) - 1`$, about 1.4 billion for $`n = 43`$.

**Focus**

- A state is sufficient when the future depends only on the state, never on how it was reached. $`\operatorname{Splittable}(i)`$ needs only the suffix start $`i`$.
- Optimal substructure is a claim about subproblems: removing the last column of an optimal alignment leaves an optimal alignment of the shorter prefixes.
- Base cases define the empty input. $`\operatorname{Splittable}(n+1) = \text{True}`$ and $`\operatorname{Edit}(0, j) = j`$ are load-bearing, not boilerplate.
- Merge sort has optimal substructure without overlapping subproblems, so a memo never hits. Both conditions must hold.

**Reproduce:** Closed-book, write the $`\operatorname{Splittable}`$ recurrence with its base case, then run it in Python 3.13 on $`A = \text{ARTISTOIL}`$ ($`n = 9`$) with the word set ARTIST, OIL, ART, IS, TOIL: it returns `True`. Change OR to a sum to count segmentations: 2 (ARTIST.OIL and ART.IS.TOIL).

**Traps**

- Adding a state dimension for safety. Extra dimensions multiply the table for no gain; keep the smallest sufficient state.
- A state that forgets a constraint the future needs. On a circle of houses (LC 213), $`\text{dp}`$ over the index alone can rob both the first and the last house; run the line twice, without the first house and without the last, or add "first house robbed" to the state.
- Writing the table before the recurrence. Without a one-sentence English specification of the subproblem you cannot tell a wrong recurrence from a wrong loop order.

**Practice**

- [LeetCode 70 - Climbing Stairs](https://leetcode.com/problems/climbing-stairs/) - Solve $`n = 2`$ (answer 2) and $`n = 5`$ (answer 8) by hand from $`\text{ways}[n] = \text{ways}[n-1] + \text{ways}[n-2]`$ with $`\text{ways}[0] = \text{ways}[1] = 1`$, then submit. Write the state, transition and base cases on paper first. After submitting, compare with the DSA Handbook dp-1d Climbing Stairs section.
- [LeetCode 198 - House Robber](https://leetcode.com/problems/house-robber/) - Derive $`\text{dp}[i] = \max(\text{dp}[i-1], \text{dp}[i-2] + \text{nums}[i])`$ and test `[2,1,1,2]` (answer 4) before submitting. The alternating parity pick returns 3 on `[2,1,1,2]` and is wrong. After submitting, read the AlgoMaster House Robber lesson (https://algomaster.io/learn/dsa/house-robber).

**Stop when:** You write state, recurrence, base cases and order for Climbing Stairs and House Robber without notes, and can show why the parity-greedy pick fails on `[2,1,1,2]`.

<details>
<summary>Self-test</summary>

1. Why is $`\operatorname{Splittable}(n+1) = \text{True}`$ the correct base case?
   - An empty suffix needs no words, so it segments trivially. The recurrence checks $`\operatorname{SplitTable}[j+1]`$ for $`j = n`$, which reads exactly this cell.
2. Merge sort splits, recurses and combines. Why is it not dynamic programming?
   - Its halves share no subproblems, so a memo never hits. Optimal substructure alone does not make DP; overlapping subproblems must also hold.
3. How does the edit-distance proof show three predecessors are enough?
   - By contradiction on the last alignment column: it must be an insertion, a deletion or a substitution. If the remaining prefixes had a shorter edit sequence, gluing the last column back would shorten the whole, contradicting optimality.
4. Your recurrence passes the samples but you cannot state its subproblem in one English sentence. What do you do?
   - Stop and write the specification first. Without it a wrong recurrence and a wrong loop order look identical in the test output.

</details>

#### U2. Memoization, tabulation and dependency order

**About 3 h** · **Target:** Implement

Topics: Dependency order and topological evaluation; Memoized recursion and state identity; Bottom-up tabulation and iteration order

Memoized recursion dies near depth 1000 in CPython. Tabulation with an explicit order is the form that survives production-sized inputs.

**You can now**

- Implement memoized and tabulated forms of one recurrence and show they compute the same values.
- Read dependencies off a recurrence and state the evaluation order before writing the loop.
- Predict when memoized recursion hits the Python recursion limit and switch to tabulation.

**Study**

1. [Fibonacci from naive recursion to iteration](https://jeffe.cs.illinois.edu/teaching/algorithms/book/03-dynprog.pdf) (Algorithms - dynamic programming) - Section 3.1 (pp. 97-102): `RecFibo`, the $`T(n) = 2F(n+1) - 1`$ call-count argument, `MemFibo`, `IterFibo` and `IterFibo2`. Depth: Skip Section 3.2, the matrix-squaring speedup (p. 103), until the limits unit.
2. [The four-step conversion to a table](https://dsa.handbook.academy/curriculum/dynamic-programming/dp-bottom-up-tabulation/) (DSA Handbook - dynamic programming) - The four-step conversion: dependency DAG, topological order, loop, array; Tracing the table fill on $`n = 8`$.
3. [The default 1000-frame limit](https://docs.python.org/3/library/sys.html#sys.setrecursionlimit) (Python sys: recursion limit) - `sys.getrecursionlimit` and `sys.setrecursionlimit`: the limit guards the C stack, and the highest safe value is platform-dependent. Check the current value with `sys.getrecursionlimit()` (1000 on CPython 3.13).

**Focus**

- Memoization visits states lazily in recursion order; tabulation visits them eagerly in an order you choose. Both compute the same values.
- The dependency DAG must be acyclic. For $`\operatorname{fib}(i)`$ the edges run to smaller indices, so increasing $`i`$ is a valid topological order.
- A Python frame per index means depth-$`n`$ recursion needs a limit above $`n`$. Set it once at module top level, never per function.
- State count times per-state work gives total time: $`O(n)`$ states at $`O(1)`$ each is $`O(n)`$ for Fibonacci.

**Reproduce:** Closed-book in Python 3.13, write memoized and tabulated `fib`. Both give $`\operatorname{fib}(25) = 75025`$. At the default limit of 1000, $`\operatorname{fib}(2500)`$ raises `RecursionError`; with the limit raised once to 10000 the memoized form returns a 523-digit integer, and the tabulated form returns the same digits. Assert the two results are equal.

**Traps**

- Reusing one global memo across calls for state that is not absolute. Stale entries from the previous call return wrong answers; build a fresh memo per call.
- Returning a mutable object from a memoized function and letting the caller mutate it. Later cache hits return the mutated object.
- Copying a top-down recurrence into a bottom-up loop without flipping the direction. A left-to-right loop reading $`\text{dp}[i+1]`$ reads uninitialized cells.

**Practice**

- [LeetCode 509 - Fibonacci Number](https://leetcode.com/problems/fibonacci-number/) - Implement memoized and tabulated forms; check $`n = 2, 3, 4`$ (answers 1, 2, 3), then submit. Compare both forms on $`n = 30`$. After submitting, use the DSA Handbook dp-recursion-to-memo ladder as the reference.
- [LeetCode 1137 - N-th Tribonacci Number](https://leetcode.com/problems/n-th-tribonacci-number/) - Extend the window to three predecessors; check $`n = 4`$ (answer 4) and $`n = 25`$ (answer 1389537), then submit. Carry three rolling values in the tabulated form. After submitting, compare with the DSA Handbook fixed look-back section.

**Stop when:** Both forms agree on $`\operatorname{fib}(25) = 75025`$ from a blank file, and you can state the order and the limit behavior without notes.

<details>
<summary>Self-test</summary>

1. $`\operatorname{fib}(2500)`$ under the default limit: what happens and why?
   - `RecursionError`. The chain runs 2500 frames deep before the first base case returns, and the default limit is 1000. The cache cannot help because no call has returned yet.
2. When is tabulation better than memoization if both are $`O(n)`$?
   - When the topological order is obvious and the input is deep or call overhead matters. Tabulation has no recursion stack and pays one index per step instead of one frame per state.
3. Your bottom-up loop reads $`\text{dp}[i+1]`$ left to right and returns garbage. What went wrong?
   - The loop order violates the dependency direction. Either iterate right to left or rewrite the recurrence so it reads already-filled cells.
4. Why must a memoized function be pure?
   - The cache swaps recomputation for lookup. If the result depends on hidden mutable state, the stored value is stale for the next call and the answer changes.

</details>

#### U3. Solution reconstruction and rolling state

**About 3 h** · **Target:** Implement

Topics: Solution reconstruction and independently checkable outputs; Rolling state and dependency-preserving compression

An optimum without a witness cannot be checked. Compression that deletes the decisions trades checkability for memory.

**You can now**

- Reconstruct an optimal witness by walking parent pointers back from the answer cell.
- Decide whether rolling compression preserves dependencies and reconstruction, and state what is lost.
- Implement length-only rolling rows and full-table recovery without mixing the two.

**Study**

1. [Backtracking the LCS table](https://dsa.handbook.academy/curriculum/dynamic-programming/lcs/) (DSA Handbook - dynamic programming) - Recovering the actual subsequence: backtrack from $`(m, n)`$ with one tie-break used in both passes; $`O(\min(m, n))`$ space via row reuse.
2. [Rolling compression and its cost](https://dsa.handbook.academy/curriculum/dynamic-programming/dp-bottom-up-tabulation/) (DSA Handbook - dynamic programming) - Rolling-pair compression: from $`O(n)`$ to $`O(1)`$ space, including the warning that compression makes traceback impossible.
3. [Linear-space recovery by splitting](https://jeffe.cs.illinois.edu/teaching/algorithms/notes/D-faster-dynprog.pdf) (Erickson lecture note D - Advanced Dynamic Programming) - Section D.1, Saving Space: Divide and Conquer: forward-backward split with the Half table to recover the edit sequence in $`O(m + n)`$ space.

**Focus**

- Fill and backtrack must share one tie-break. Mixed comparators walk a path the fill never scored.
- A rolling row keeps only the previous row, so the parent chain is gone. Length-only compression and reconstruction exclude each other without a Hirschberg split.
- Backtrack cost is $`O(m + n)`$: every step decrements $`i`$, $`j`$, or both, so no cell is revisited.

**Reproduce:** Closed-book in Python 3.13: fill the LCS table for ABCBDAB vs BDCAB ($`7 \times 5`$) and backtrack to length 4: up-on-ties gives BCAB and left-on-ties gives BDAB, both valid. Then run the rolling length-only form on the same pair and confirm 4.

**Traps**

- Keeping one row and then trying to backtrack through it. Old rows are gone; recovery needs the full table or a Hirschberg split.
- Using strict greater-than in the fill and greater-or-equal in the backtrack. Either comparator is fine alone; mixing them walks an unscored path.
- Reading `text1[i]` instead of `text1[i-1]` inside a 1-indexed table. The one-character test `(a, a)` raises `IndexError` at $`i = 1`$ and exposes the shift.

**Practice**

- [LeetCode 583 - Delete Operation for Two Strings](https://leetcode.com/problems/delete-operation-for-two-strings/) - Reduce to LCS with $`\text{answer} = m + n - 2k`$; check $`(\text{sea}, \text{eat}) = 2`$ and $`(\text{leetcode}, \text{etco}) = 4`$, then submit. After submitting, compare with the DSA Handbook lcs reduction section for LC 583.

**Stop when:** Your backtrack returns length 4 plus a valid witness on the textbook pair, and your rolling form agrees on the length.

<details>
<summary>Self-test</summary>

1. Why does the rolling LCS return the length but not the string?
   - The backtrack walks rows in reverse, and the rolling form discarded every row but the last two. The parent pointers lived in the discarded rows.
2. Two valid LCS strings exist for one input. Is that a bug?
   - No. Ties in $`\max(\text{up}, \text{left})`$ admit several optimal paths. Any one of them is a correct LCS; enumerating all is a different, exponential-output problem.
3. What does the Hirschberg split add over rolling rows?
   - The witness in linear space. Rolling rows give the length in $`O(\min(m, n))`$ space; the midpoint split recurses on both halves to also recover the sequence in $`O(m + n)`$ space at a constant time factor.
4. House Robber rolling pair: can you still name the robbed houses?
   - No. The pair kept values, not decisions. Keep a boolean choice array or the full `dp` column to reconstruct the set.

</details>

#### U4. Sequence and string dynamic programming

**About 4 h** · **Target:** Derive + Implement

Topics: Sequence and string dynamic programming

One 2D table shape carries LCS, edit distance and their reductions. The mismatch branch decides which problem you solved.

**You can now**

- Derive the state, recurrence, base cases and order for prefix-pair and single-index sequence problems.
- Implement LCS, edit distance and quadratic LIS from blank files with differential tests.
- Tell subsequence, substring and edit variants apart by their mismatch branch.

**Study**

1. [Two LIS recurrences](https://jeffe.cs.illinois.edu/teaching/algorithms/book/03-dynprog.pdf) (Algorithms - dynamic programming) - Section 3.6 (pp. 109-110): First Recurrence: Is This Next? ($`\operatorname{LISbigger}`$, two indices) and Second Recurrence: What's Next? ($`\operatorname{LISfirst}`$, one index, filled in decreasing order).
2. [Edit distance recurrence and table](https://jeffe.cs.illinois.edu/teaching/algorithms/book/03-dynprog.pdf) (Algorithms - dynamic programming) - Section 3.7 (pp. 111-114): $`\operatorname{Edit}(i, j)`$ three-way recurrence, row-major order, and the ALGORITHM vs ALTRUISTIC table with distance 6.
3. [Quadratic LIS with recovery](https://dsa.handbook.academy/curriculum/dynamic-programming/lis-quadratic/) (DSA Handbook - dynamic programming) - The $`O(n^2)`$ LIS: per-index $`\text{dp}[i]`$ as $`\max`$ over smaller predecessors, with parent-pointer recovery and the counting variants.
4. [Prefix decisions with validity gates](https://dsa.handbook.academy/curriculum/dynamic-programming/dp-decode-word-break/) (DSA Handbook - dynamic programming) - The recurrence, written once: $`\text{dp}[i]`$ for the prefix `s[:i]`, a count of decodings for LC 91 Decode Ways and an OR over valid splits for LC 139 Word Break; Why $`\text{dp}[0] = \text{True}`$, in one trace.

**Focus**

- $`\operatorname{LISfirst}`$ runs on one index because starting here needs only later starts; $`\operatorname{LISbigger}`$ needs two indices because skipping is relative to a threshold.
- Edit distance has three predecessors because the last column has three shapes. LCS mismatch only skips one side, which is an up or left step.
- Subsequence inherits $`\max(\text{up}, \text{left})`$ on mismatch; substring resets to 0. On ABCBDAB and BDCAB the answers are 4 and 2.
- Decode Ways and Word Break share one skeleton: $`\text{dp}[i]`$ combines the valid splits that end at $`i`$, a sum for Decode Ways and an OR for Word Break, each gated by a validity predicate.

**Reproduce:** Closed-book in Python 3.13: $`\operatorname{LCS}(\text{abcde}, \text{ace}) = 3`$, $`\operatorname{edit}(\text{horse}, \text{ros}) = 3`$, $`\operatorname{edit}(\text{ALGORITHM}, \text{ALTRUISTIC}) = 6`$ and $`\operatorname{LIS}([10,9,2,5,3,7,101,18]) = 4`$. Then differentially test all three against brute force with Hypothesis on strings over $`\{\text{a}, \text{b}, \text{c}\}`$ and lists of length at most 8.

**Traps**

- Running LCS code on a longest-common-substring ask. Same table shape, different mismatch branch; the corner cell is not the substring answer.
- Forgetting $`\text{max-empty} = 0`$ in $`\operatorname{LISfirst}`$. Then $`\operatorname{LISfirst}(n)`$ needs a special base case instead of falling out of the recurrence.
- Counting 06 as one decoding in Decode Ways. A leading zero is invalid; gate 0 and out-of-range pairs to zero.

**Practice**

- [LeetCode 1143 - Longest Common Subsequence](https://leetcode.com/problems/longest-common-subsequence/) - Attempt cold. Check $`(\text{abcde}, \text{ace}) = 3`$, $`(\text{abc}, \text{abc}) = 3`$, $`(\text{abc}, \text{def}) = 0`$, then submit. Attempt cold: write state, transition, base case and order first. After submitting, read the AlgoMaster Longest Common Subsequence lesson (https://algomaster.io/learn/dsa/longest-common-subsequence).
- [LeetCode 300 - Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence/) - Check $`[10,9,2,5,3,7,101,18] = 4`$ and $`[7,7,7,7,7,7,7] = 1`$, then submit. After submitting, compare with the DSA Handbook lis-quadratic page, including the strict-increase gate.

**Stop when:** The reproduce numbers come out of a blank file, the brute-force differential tests pass, and you can call the mismatch branch for subsequence versus substring without notes.

<details>
<summary>Self-test</summary>

1. State the $`\operatorname{LISfirst}`$ recurrence and why decreasing order works.
   - $`\operatorname{LISfirst}(i) = 1 + \max`$ of $`\operatorname{LISfirst}(j)`$ over $`j > i`$ with $`A[j] > A[i]`$, with $`\text{max-empty} = 0`$. Entry $`i`$ reads only entries $`j > i`$, so filling $`i`$ from $`n`$ down keeps every read on a computed cell.
2. Why does edit distance need the diagonal predecessor while LCS mismatch does not?
   - Substitution consumes one character from each string in a single column, which is exactly the diagonal step with cost $`[A[i] \ne B[j]]`$. LCS mismatch only skips a character from one side, which is an up or left step.
3. Word Break on `catsandog` with `[cats, dog, sand, and, cat]`: what does $`\text{dp}`$ say and why?
   - `False`. No valid split covers the string: the $`\text{dp}[i]`$ OR over splits finds no chain of dictionary words reaching position 9.
4. When do you prefer the two-index $`\operatorname{LISbigger}`$ over $`\operatorname{LISfirst}`$?
   - Rarely for code; $`\operatorname{LISfirst}`$ is shorter and $`O(n)`$ space. $`\operatorname{LISbigger}`$ earns its keep only when the threshold value matters per state, and both are $`O(n^2)`$ time.

</details>

#### U5. Grid, path and interval dynamic programming

**About 4 h** · **Target:** Derive + Implement

Topics: Grid, path and interval dynamic programming

Iteration direction follows the dependency direction. Survival predicates read successors, so the loop runs backward.

**You can now**

- Derive forward fills for counting and min-sum grids and backward fills for survival predicates.
- Derive interval recurrences that try the last operation in $`[l, r]`$ and fill by increasing length.
- Implement both families with brute-force differential tests on small grids and intervals.

**Study**

1. [Forward fills and the backward twist](https://dsa.handbook.academy/curriculum/dynamic-programming/grid-dp/) (DSA Handbook - dynamic programming) - The pattern on LC 62 ($`3 \times 7`$ worked example, answer 28) and The twist on LC 174 (backward recurrence with the $`\max(\ldots, 1)`$ clamp and reversed loops).
2. [Interval DP with the last operation](https://dsa.handbook.academy/curriculum/dynamic-programming/interval-dp/) (DSA Handbook - dynamic programming) - The pattern: $`\text{dp}[l][r]`$ tries the LAST operation in the range; Worked example: $`\text{nums} = [3, 1, 5, 8]`$; What CLRS calls matrix-chain multiplication. Depth: The chapter labels LC 1039 as Matrix Chain Multiplication; on LeetCode it is Minimum Score Triangulation of Polygon, which has the same interval shape.
3. [Interval order on optimal search trees](https://jeffe.cs.illinois.edu/teaching/algorithms/book/03-dynprog.pdf) (Algorithms - dynamic programming) - Section 3.9 (pp. 117-119): $`\operatorname{OptCost}(i, k)`$ interval recurrence and its three valid evaluation orders: by diagonal, row by row from the bottom up, and column by column from left to right.

**Focus**

- Forward DP fails Dungeon Game because HP-needed-at-entry depends on the suffix, not the prefix. Backward state $`\text{dp}[i][j]`$ is HP needed on entering $`(i, j)`$.
- The $`\max(\ldots, 1)`$ clamp is the survival predicate per cell, not a guard. Dropping it admits zero-HP entries the knight cannot use.
- Interval cells depend on strictly shorter intervals, so length-ascending fill is the order. Any single direction that respects shorter-first works.

**Reproduce:** Closed-book in Python 3.13: `unique_paths(3, 7) = 28`, `min_path_sum([[1,3,1],[1,5,1],[4,2,1]]) = 7`, `dungeon([[-2,-3,3],[-5,-10,1],[10,30,-5]]) = 7`, `burst([3,1,5,8]) = 167`. State the grid sizes and all four expected outputs.

**Traps**

- Copying the LC 64 idea into Dungeon Game: maximize the path sum, then read the HP it needs. On the problem's own example the max-sum path (down, down, right, right; sum 28) needs 8 HP, but right, right, down, down needs 7.
- Continuing the LC 63 base row past the first obstacle. Cells past a top-row wall are unreachable; the base loop must `break`, not `continue`.
- Filling interval tables row-major left to right. Cell $`(l, r)`$ reads $`(l, k)`$ and $`(k+1, r)`$, which a plain row-major pass may not have written; iterate by length.

**Practice**

- [LeetCode 62 - Unique Paths](https://leetcode.com/problems/unique-paths/) - Check that a 3 by 7 grid gives 28 paths and a 3 by 2 grid gives 3, then submit. Fill row-major and state the read set above the loop. After submitting, compare with the DSA Handbook grid-dp LC 62 section.
- [LeetCode 174 - Dungeon Game](https://leetcode.com/problems/dungeon-game/) - Check `[[-2,-3,3],[-5,-10,1],[10,30,-5]] = 7` and `[[0]] = 1`, then submit. Iterate backward with the clamp. After submitting, compare with the DSA Handbook grid-dp LC 174 section and the AlgoMaster Dungeon Game lesson (https://algomaster.io/learn/dsa/dungeon-game).

**Stop when:** The four reproduce numbers come out of a blank file, and you can state each recurrence read set and loop direction.

<details>
<summary>Self-test</summary>

1. Why does Dungeon Game iterate bottom-right to top-left?
   - $`\text{dp}[i][j]`$ reads $`\text{dp}[i+1][j]`$ and $`\text{dp}[i][j+1]`$. Reversed row-major order keeps both reads on computed cells; forward order reads sentinels.
2. Unique Paths $`3 \times 7`$ is 28. Name the closed form and when it breaks.
   - $`C(m+n-2, m-1) = C(8, 2) = 28`$. It breaks with obstacles, weights or backward predicates; the DP survives all three.
3. Why does Burst Balloons try the last burst in $`[l, r]`$ instead of the first?
   - Bursting $`k`$ first changes the neighbors of the rest, so subintervals are not independent. Bursting $`k`$ last fixes its neighbors to the interval boundaries, which splits $`[l, r]`$ into independent $`[l, k-1]`$ and $`[k+1, r]`$.
4. A forward fill keeps, per cell, the smallest starting HP needed so far. Why can it fail?
   - A predecessor that needed less HP so far may arrive with less HP left, and one number cannot keep both. On `[[-2,-1,-1],[-3,-1,0],[2,0,-3]]` the forward fill answers 8 while the backward fill gives 7.

</details>

#### U6. Tree dynamic programming

**About 3 h** · **Target:** Derive + Implement

Topics: Tree dynamic programming

On trees the dependency graph is the input. One post-order pass gives linear time; the only design work is the per-node state.

**You can now**

- Derive per-node state that carries every choice the parent must reason about.
- Implement post-order helpers that return tuples or split return-vs-global quantities.
- Handle skewed trees within the recursion limit or with an explicit stack.

**Study**

1. [Maximum independent set on trees](https://jeffe.cs.illinois.edu/teaching/algorithms/book/03-dynprog.pdf) (Algorithms - dynamic programming) - Section 3.10 (pp. 120-122): $`\operatorname{MIS}(v)`$ recurrence over children and grandchildren, memoization into the tree, post-order evaluation, and the $`\operatorname{MISyes}/\operatorname{MISno}`$ mutual recurrence.
2. [Tuple state and the return-vs-global split](https://dsa.handbook.academy/curriculum/dynamic-programming/tree-dp/) (DSA Handbook - dynamic programming) - Two-state DP: the $`(\text{rob}, \text{skip})`$ tuple on LC 337; The dual-quantity split, with negative values in play, on LC 124 with the $`\max(\text{child\_gain}, 0)`$ clamp.
3. [The linear precursor](https://dsa.handbook.academy/curriculum/dynamic-programming/dp-1d/) (DSA Handbook - dynamic programming) - House robber (LC 198): the take-or-skip prototype that LC 337 lifts onto trees, with the `[2,1,1,2]` parity-greedy counterexample.

**Focus**

- Single-number returns fail House Robber III because the parent needs both worlds. Return $`(\text{rob\_this}, \text{skip\_this})`$ and let the parent pick per scenario.
- LC 124 returns the straight-down chain but compares the bent path globally. Returning the bent path builds two-bend shapes that are not paths.
- Each node is visited once with $`O(1)`$ local work, so time is $`O(n)`$. Space is the recursion stack $`O(h)`$, which is $`n`$ on skewed input.

**Reproduce:** Closed-book in Python 3.13 with the limit raised once at module top level: `rob` on level-order `[3,2,3,null,3,null,1] = 7` and on `[3,4,5,1,3,null,1] = 9`. State both level-order inputs and both expected outputs.

**Traps**

- Keeping the default limit of 1000 for deep trees. LC 337 allows $`10^4`$ nodes and LC 124 allows $`3 \times 10^4`$, so a skewed tree raises `RecursionError`; raise the limit once at module top level or use an explicit stack.
- Initializing the LC 124 global to 0. All-negative trees then return 0 for an empty path; start at negative infinity so the root comparison fires.
- Recomputing grandchildren per node instead of returning both states. The tuple memoizes both worlds in one pass; without it the recursion revisits subtrees.

**Practice**

- [LeetCode 337 - House Robber III](https://leetcode.com/problems/house-robber-iii/) - Attempt cold. Check `[3,2,3,null,3,null,1] = 7` and `[3,4,5,1,3,null,1] = 9`, then submit. Attempt cold: return the $`(\text{rob}, \text{skip})`$ tuple from the helper. After submitting, read the AlgoMaster House Robber III lesson (https://algomaster.io/learn/dsa/house-robber-iii).

**Stop when:** Both reproduce trees return 7 and 9 from a blank file, and you can state what each helper slot means to its parent.

<details>
<summary>Self-test</summary>

1. Write the House Robber III recurrence.
   - $`\text{rob\_this}(v) = \text{val}(v) + \text{skip}(\text{left}) + \text{skip}(\text{right})`$; $`\text{skip\_this}(v) = \max(\text{rob}, \text{skip})`$ of each child, summed. Answer $`\max(\text{rob}, \text{skip})`$ at the root.
2. Why is the empty-subtree identity $`(0, 0)`$?
   - An empty subtree contributes no income and imposes no obligation, so both slots add zero to the parent sums.
3. LC 124: which quantity travels up and why?
   - The straight-down chain $`\text{val} + \max(\text{left\_gain}, \text{right\_gain})`$. The parent can only extend a linear chain; a bent path extended further would bend twice.
4. How does $`\operatorname{MISyes}/\operatorname{MISno}`$ relate to the $`(\text{rob}, \text{skip})`$ tuple?
   - It is the same pattern: $`\operatorname{MISyes}(v) = 1 + \sum \operatorname{MISno}(\text{children})`$ is $`\text{rob\_this}`$, and $`\operatorname{MISno}(v) = \sum \max(\text{yes}, \text{no})`$ is $`\text{skip\_this}`$.

</details>

#### U7. Knapsack, subset and bitmask dynamic programming

**About 4 h** · **Target:** Derive + Implement

Topics: Knapsack, subset and bitmask state

One table shape answers min-coins, counting and feasibility. The loop direction decides whether an item is reusable.

**You can now**

- Derive take-or-skip recurrences with the correct inner-loop direction for $`0/1`$ versus unbounded choice.
- Reduce subset-sum and counting variants to one knapsack table.
- Encode small-set state as bitmasks and bound the $`2^n`$ state cost.

**Study**

1. [$`0/1`$ knapsack and the backward inner loop](https://dsa.handbook.academy/curriculum/dynamic-programming/knapsack-01/) (DSA Handbook - dynamic programming) - The 1D table fill; Why the inner loop sweeps right-to-left; Worked example: LC 416 on `[1, 5, 11, 5]`; Reformulations: when the problem doesn't say "knapsack" (LC 494, 1049, 474).
2. [Unbounded knapsack and the reversed loop](https://dsa.handbook.academy/curriculum/dynamic-programming/knapsack-unbounded/) (DSA Handbook - dynamic programming) - What changes from $`0/1`$ knapsack; The mechanics: filling $`\text{dp}[a]`$ left to right; Counting unordered combinations: LC 518; Counting ordered sequences: LC 377.
3. [Bitmask state for small sets](https://dsa.handbook.academy/curriculum/dynamic-programming/bitmask-dp/) (DSA Handbook - dynamic programming) - The pattern; Worked example: LC 847 on a 3-node line; What it actually costs; Permutation / assignment: position is `popcount(mask)` (LC 526).
4. [Subset Sum and the Nadiria change problem](https://jeffe.cs.illinois.edu/teaching/algorithms/book/03-dynprog.pdf) (Algorithms - dynamic programming) - Section 3.8 (pp. 116-117): $`\operatorname{SS}(i, t)`$ recurrence with the $`O(nT)`$ table, and Exercise 1 Nadiria change (p. 123): greedy failure first, then recurrence, then DP.

**Focus**

- $`0/1`$ sweeps capacity right to left so item $`i`$ cannot fund itself in the same pass. Unbounded sweeps left to right so $`\text{dp}[a-c]`$ already includes item $`i`$.
- Subset Sum $`O(nT)`$ is pseudopolynomial: $`T`$ is a value, not the input size. Tabulation loses to backtracking when $`T`$ dwarfs $`2^n`$.
- Bitmask state costs $`2^n`$ subsets times $`n`$ transitions. It fits only small ground sets; that boundary is the content, not a footnote.

**Reproduce:** Closed-book in Python 3.13: `coin_change([1,2,5], 11) = 3`, `coin_change_ii(5, [1,2,5]) = 4`, `can_partition([1,5,11,5]) = True` and `can_partition([1,2,3,5]) = False`. Also show largest-first greedy on `([1,3,4], 6)` gives 3 coins versus optimal 2. State the amounts and all five expected outputs.

**Traps**

- Sweeping $`0/1`$ capacity left to right. Item $`i`$ then reuses its own update and the $`0/1`$ table silently becomes unbounded.
- Reading min-coins -1 as zero ways. Coin Change returns -1 when unreachable; Coin Change II returns 0 ways. Different families, different sentinels.
- Applying bitmask DP past $`n = 20`$ without counting. $`2^{20}`$ rows times $`n`$ columns already exceeds ten million cells; state the bound first.

**Practice**

- [LeetCode 322 - Coin Change](https://leetcode.com/problems/coin-change/) - Attempt cold. Check `([1,2,5], 11) = 3`, `([2], 3) = -1` and `([1], 0) = 0`, then submit. Attempt cold: write the reuse direction before coding. After submitting, read the AlgoMaster Coin Change lesson (https://algomaster.io/learn/dsa/coin-change).
- [LeetCode 416 - Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum/) - Check `[1,5,11,5] = True` and `[1,2,3,5] = False`, then submit. Reduce to subset sum with target $`\text{total}/2`$. After submitting, compare with the DSA Handbook knapsack-01 reformulation section.

**Stop when:** The five reproduce numbers come out of a blank file, and you can state each loop direction and why.

<details>
<summary>Self-test</summary>

1. Why does the $`0/1`$ inner loop run right to left?
   - Left to right lets $`\text{dp}[a]`$ read $`\text{dp}[a-c]`$ written in the same item pass, reusing item $`i`$. Right to left keeps every read on the previous item row.
2. Coins `[1,3,4]`, amount 6: what does largest-first greedy give and why is it wrong?
   - $`4+1+1 = 3`$ coins. Optimal is $`3+3 = 2`$. Greedy commits to 4 without comparing the two-coin completion; only the recurrence compares all last-coin choices.
3. Subset Sum runs $`O(nT)`$. Why is that not polynomial?
   - $`T`$ measures a value in the input, which takes $`\log T`$ bits to write. The bound is polynomial in the numeric value but exponential in the input length.
4. When is bitmask state the only state that fits?
   - When feasibility depends on exactly which items are used, not just how many or how much. Assignment and visit-all paths need the subset identity itself.

</details>

#### U8. Recurrence proofs and differential validation

**About 3 h** · **Target:** Derive + Measure

Topics: Inductive recurrence proofs and loop invariants; Exhaustive small-instance and differential validation

Samples pass and proofs fail. A differential harness plus a minimized counterexample is what catches a wrong recurrence.

**You can now**

- Prove a recurrence by induction with the invariant, exchange step or cut property stated, not restated.
- Build a Hypothesis harness that compares memoized, tabulated and brute-force results on small inputs.
- Shrink a failure to a minimal counterexample and map it to the violated claim.

**Study**

1. [The proof checklist and a model argument](https://jeffe.cs.illinois.edu/teaching/algorithms/book/03-dynprog.pdf) (Algorithms - dynamic programming) - Section 3.4 (pp. 105-107), the step checklist that ends "you have to prove that each of these steps is correct"; Section 3.7 Recursive Structure (pp. 111-112) as the model optimal-substructure argument.
2. [First property test with pytest](https://hypothesis.readthedocs.io/en/latest/quickstart.html) (Hypothesis - exhaustive and differential DP tests) - Write your first test and Combining Hypothesis with pytest.
3. [Strategies for small instances](https://hypothesis.readthedocs.io/en/latest/reference/strategies.html) (Hypothesis - exhaustive and differential DP tests) - Strategies Reference: Numeric (integers) and Collections (lists) for generating small valid instances.
4. [Replaying shrunken failures](https://hypothesis.readthedocs.io/en/latest/tutorial/replaying-failures.html) (Hypothesis - exhaustive and differential DP tests) - The Hypothesis database; Using `@example` to run a specific input; Prefer `@example` over the database for correctness.

**Focus**

- A proof names the invariant and the step: last-column cases for edit distance, shorter-interval reads for OBST, both worlds for tree tuples.
- The harness generates small valid inputs, runs three implementations, and keeps the shrunk failure. Brute force is the oracle, not a fourth opinion.
- Derandomize the settings for the reproduce run so the example count and seed replay exactly.

**Reproduce:** In Python 3.13 with Hypothesis 6.169 and pytest: `@given` lists of ints 0-9 with length at most 8, `max_examples = 200`, `derandomize = True`. Compare memoized, tabulated and brute-force House Robber on every example: all 200 pass. Then plant the alternating-parity variant: Hypothesis shrinks the failure to `[1,0,0,1]` with parity 1 versus optimal 2.

**Traps**

- Testing only on statement samples. The parity variant passes both LC 198 examples (`[1,2,3,1]` and `[2,7,9,3,1]`) and fails first on `[1,0,0,1]`; generate, do not hand-pick.
- Comparing two optimized forms with no brute-force oracle. Agreement proves consistency, not correctness; the exhaustive baseline is the check.
- Generating invalid instances such as negative coins or empty grids. Constrain generation to valid inputs or failures indict the generator, not the recurrence.

**Practice**

- The section mini-project covers this: a Hypothesis differential harness over memoized, tabulated and brute-force forms with retained shrunk failures and one repaired recurrence.

**Stop when:** Your harness passes 200 derandomized examples on the correct code and exhibits a minimized counterexample on the planted bug.

<details>
<summary>Self-test</summary>

1. What does the edit-distance contradiction actually establish?
   - That removing the last column of an optimal alignment leaves an optimal alignment of the prefixes. With the three possible last-column shapes, the three-way min considers every optimum, and each option it considers is a valid alignment.
2. Why three implementations instead of two?
   - Memoized and tabulated share the recurrence, so a wrong recurrence passes their comparison. Brute force derives from the definition, so it disagrees exactly when the recurrence is wrong.
3. Hypothesis shrinks a failure to `[1,0,0,1]`. What do you do?
   - Pin it with `@example([1, 0, 0, 1])` so it runs on every test run, then map it to the claim: the alternating pick returns 1, while taking both ends and skipping the middle returns 2, which indicts the parity assumption.
4. A proof says by optimal substructure, the recurrence holds. What is missing?
   - The argument itself: which cases exhaust the optimum, why the tail is optimal for the subproblem, and why no invalid solution is admitted.

</details>

#### U9. Dynamic programming as shortest paths, formulations and limits

**About 4 h** · **Target:** Explain + Derive

Topics: Dynamic programming as a DAG or shortest-path problem; Scheduling, caching, batching and allocation formulations; Exact, heuristic and approximate boundaries

DP transfers to batching, caching and allocation. The skill is recognizing the state there, plus knowing when the state space is too large for exact methods.

**You can now**

- Reformulate a scheduling, batching, caching or allocation narrative as DP or shortest path on a DAG.
- State when exact optimization is infeasible and bound the heuristic or relaxation you use instead.
- Reject tempting greedy or insufficient-state proposals with concrete counterexamples.

**Study**

1. [Coin change as the allocation family](https://dsa.handbook.academy/curriculum/dynamic-programming/knapsack-unbounded/) (DSA Handbook - dynamic programming) - How minimum coins, count of ways and minimum cost share one recurrence: the allocation family with the reuse direction. Depth: Reread for the allocation framing only; the loop mechanics belong to the knapsack unit.
2. [DP on an implicit DAG](https://dsa.handbook.academy/curriculum/dynamic-programming/grid-dp/) (DSA Handbook - dynamic programming) - Strict-increase predicate: the implicit DAG and DFS-with-memo (LC 329); monotone moves make the cell graph acyclic.
3. [Greed is stupid without a proof](https://jeffe.cs.illinois.edu/teaching/algorithms/book/03-dynprog.pdf) (Algorithms - dynamic programming) - Section 3.5 (pp. 107-108): Warning: Greed is Stupid, with the shortest-prefix text-segmentation counterexample.
4. [When exact scheduling is infeasible](https://jeffe.cs.illinois.edu/teaching/algorithms/notes/J-approx.pdf) (Erickson lecture note J - Approximation Algorithms) - Section J.1, Load Balancing: NP-hardness by reduction from Partition, `GreedyLoadBalance`, and Theorem J.1 with its factor-2 proof.

**Focus**

- DP works on the cell graph because monotone moves or a strict predicate make it acyclic. Arbitrary four-directional movement is not DP.
- Coin change is allocation: amount is the budget, denominations are unit costs, and the inner-loop direction is the reuse policy.
- Partition makes exact load balancing NP-hard, so the greedy 2-approximation with its stated bound is the honest answer at scale.

**Reproduce:** In Python 3.13: longest-prefix-greedy Word Break returns `False` on $`s = \text{abcd}`$ with dict `[ab, abc, cd]` while tabulated DP returns `True`. `GreedyLoadBalance` on jobs `[5,5,4,4,3,3,3]` with $`m = 2`$ gives makespan 15 against optimal 14, inside the factor-2 bound. State both inputs and all three expected outputs.

**Traps**

- Calling the greedy 2-approximation optimal. The bound is a worst-case factor, not an equality claim; 15 versus 14 on the demo inputs shows the gap.
- Modeling allocation without stating the reuse policy. One loop direction means each unit once; the other means unlimited reuse. Name it.
- Running memoized DFS on a cyclic move graph. With four-directional moves and no strict predicate, a call can reach a cell still on the stack, and the memo caches a value computed from an unfinished one. Prove the graph acyclic first, or switch to a shortest-path algorithm.

**Practice**

- [LeetCode 1235 - Maximum Profit in Job Scheduling](https://leetcode.com/problems/maximum-profit-in-job-scheduling/) - Solve tag-hidden. Example 1 returns 120 and example 2 returns 150. First show that earliest-finish greedy keeps 90 on example 1, then sort by end time and write $`\text{dp}`$ over jobs with a binary search for the last compatible job. Write the state and the take-or-skip recurrence before coding. After submitting, read the AlgoMaster Maximum Profit in Job Scheduling lesson (https://algomaster.io/learn/dsa/maximum-profit-in-job-scheduling).
- [LeetCode 139 - Word Break](https://leetcode.com/problems/word-break/) - Solve tag-hidden. Check `(leetcode, [leet, code]) = True` and `(catsandog, [cats, dog, sand, and, cat]) = False`, then submit. Exhibit the `abcd` longest-prefix failure in your notes. After submitting, compare with the DSA Handbook decode-word-break page and the AlgoMaster Word Break lesson (https://algomaster.io/learn/dsa/word-break).

**Stop when:** Both tag-hidden solutions are accepted, and you can exhibit the earliest-finish and longest-prefix counterexamples plus the exact-versus-approximate boundary without notes.

<details>
<summary>Self-test</summary>

1. Word Break `abcd` with `[ab, abc, cd]`: why does longest-prefix greedy fail?
   - It takes `abc` first and strands `d`. The valid split `ab + cd` needs the shorter first piece; only the OR-over-splits recurrence compares both.
2. Why is load balancing NP-hard, in one reduction?
   - Partition reduces to two-machine makespan: the jobs split evenly iff some assignment reaches $`\text{total}/2`$. Exact optimization at scale is infeasible, which is why the greedy bound matters.
3. State the greedy load-balance bound with its two observations.
   - Makespan at most twice optimal. $`\operatorname{OPT}`$ covers the longest job and the average load; the last job on the bottleneck machine adds at most one $`\operatorname{OPT}`$ to a below-$`\operatorname{OPT}`$ base.
4. A batching problem has $`10^6`$ jobs and 64 machines. Exact DP or greedy?
   - Greedy with the stated bound, then measure. Load balancing is NP-hard, so exact search over assignments is infeasible at this size; `GreedyLoadBalance` is within a factor of 2, and sorting the jobs longest-first tightens the bound.

</details>

### Mini-project: Two tag-hidden schedules with witnesses and a repaired recurrence

**About 10 to 14 hours.** Derive two scheduling dynamic programs from blank files, return a witness from each, and use a Hypothesis differential harness to shrink, pin and repair a subtly wrong recurrence.

1. LC 983 Minimum Cost For Tickets, without reading its tags: write the English specification of the subproblem, the recurrence, the base case and the evaluation order before code. Return the cost and a witness, the passes bought with their start days. The examples answer 11 and 17.
2. Build the harness: Hypothesis generates small day sets and costs; compare memoized, tabulated and brute-force answers (enumerate every purchase plan) with `derandomize=True`, and check that the witness covers every travel day and costs exactly the reported total.
3. Plant the off-by-one recurrence in which a 7-day pass bought on day $`d`$ covers $`d`$ through $`d + 7`$ and a 30-day pass $`d`$ through $`d + 30`$. Let Hypothesis shrink a failure (expect two travel days 7 apart, such as days `[1, 8]` with costs `[1, 1, 2]`, where the bug reports 1 against the true 2), pin it with `@example`, and repair the recurrence.
4. LC 1335 Minimum Difficulty of a Job Schedule, without reading its tags: $`\text{dp}`$ over (first unscheduled job, days left), returning the cut points as a witness. The examples answer 7, -1 and 3. Differential-test against brute force over all cut positions on small inputs.
5. Prove both recurrences by induction: name the case split (the pass bought on the first uncovered travel day; the first day's block of jobs), why the state is sufficient, and why no invalid schedule is admitted.
6. Write a transfer note for each problem: the smallest sufficient state and one smaller state that fails, with a counterexample.

**Deliverables**

- Both solutions with specifications, witnesses and an independent witness checker.
- The Hypothesis harness with the pinned failure, the planted recurrence and its repair.
- The proofs and transfer notes for both problems.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [LeetCode 983: Minimum Cost For Tickets](https://leetcode.com/problems/minimum-cost-for-tickets/). Submit the repaired recurrence.
- external-tests: [LeetCode 1335: Minimum Difficulty of a Job Schedule](https://leetcode.com/problems/minimum-difficulty-of-a-job-schedule/). Submit after the brute-force comparison passes.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Formulation | Specification, recurrence, base cases and order are written before code for both problems. | Each transfer note refutes a smaller state with a concrete counterexample. |
| Witnesses | Both solutions return witnesses that an independent checker validates. | The witness checker runs inside the Hypothesis harness on every example. |
| Harness and repair | Memoized, tabulated and brute-force answers agree on 200 derandomized examples; the planted recurrence fails, its shrunk input is pinned with `@example`, and the repair passes. | The write-up maps the shrunk input to the exact claim the planted recurrence made. |
| Proof | One recurrence is proved by induction with its case split named. | Both are proved, including why no invalid schedule is admitted. |

Feeds into: Capstone correctness library: one reconstructing DP. Failure evidence: the planted recurrence and its repair. Transfer: two tag-hidden scheduling problems.

### Resource route

- **Primary - Course:** [DSA Handbook - dynamic programming](https://dsa.handbook.academy/curriculum/dynamic-programming/) - Study Part 9 in order from state and recurrence through sequence, grid, tree and bitmask families. For every example, close the page and reconstruct the state, transition and evaluation order.
- **Required - Practice:** [AlgoMaster DSA - dynamic programming slice](https://algomaster.io/learn/dsa/course-roadmap) - Attempt Coin Change, Longest Common Subsequence and House Robber III cold. Write the state, transition, base case and evaluation order first; compare against brute force on small inputs and reconstruct a witness when available.
- **Required - Theory:** [Algorithms - dynamic programming](https://jeffe.cs.illinois.edu/teaching/algorithms/) - Use the dynamic-programming chapter to derive states and recurrences from first principles and to separate DP from greedy reasoning and shortest paths.
- **Support - Practice:** [Hypothesis - exhaustive and differential DP tests](https://hypothesis.readthedocs.io/en/latest/) - Generate small valid instances, compare memoized, tabulated and exhaustive results, and retain shrunk failures for wrong state, base case, order and compression defects.
- **Optional - Assessment:** [NeetCode - unseen mixed problems](https://neetcode.io/practice) - Use two tag-hidden mixed problems as the final transfer test. One must require rejecting a tempting greedy or insufficient-state solution with a counterexample.
- **Reference - Reference:** [Python sys: recursion limit](https://docs.python.org/3/library/sys.html#sys.setrecursionlimit) - Read `sys.getrecursionlimit` and `sys.setrecursionlimit`: the limit guards the C stack and its safe maximum is platform-dependent. Check the default with `getrecursionlimit` (1000 on CPython 3.13), raise it once for memoized DP, or switch to tabulation for deep inputs.
- **Reference - Theory:** [Erickson lecture note D - Advanced Dynamic Programming](https://jeffe.cs.illinois.edu/teaching/algorithms/notes/D-faster-dynprog.pdf) - Read Section D.1 (Saving Space: Divide and Conquer) for the Hirschberg Half-table split that recovers an optimal edit sequence in $`O(m + n)`$ space.
- **Reference - Theory:** [Erickson lecture note J - Approximation Algorithms](https://jeffe.cs.illinois.edu/teaching/algorithms/notes/J-approx.pdf) - Read Section J.1 (Load Balancing) for the Partition reduction that makes exact scheduling NP-hard, the `GreedyLoadBalance` heuristic, and Theorem J.1 with its factor-2 proof.

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

**Capstone rubric** (about 8 to 12 hours)

| Criterion | Pass | Strong |
| --- | --- | --- |
| Correctness library | A hash map, a mutable-priority heap, union-find, one graph routine and one reconstructing DP, each with its invariant, a complexity note and a test against an independent oracle, all run by one command. | Each structure has a stateful or property test over operation histories, and every invariant is also asserted in a debug mode. |
| Failure evidence | At least two seeded defects, each with the generated history or adversarial case that exposed it, the minimized failure and the repair. | Every minimized failure is kept as a regression test and mapped to the invariant it broke. |
| Transfer | One unfamiliar problem solved cold, with the invariant and bound written before code: a tag-hidden problem from the mini-projects or a new free LeetCode problem. | The cold solve records a rejected first idea and the counterexample that killed it. |
| Measurement | One benchmark connects asymptotic behavior, input distribution and memory locality, such as the hash map's probes across key distributions, or a NumPy gather through a shuffled index against a sequential one at sizes below and above the cache. | Predictions are written before measuring, and the benchmark shows the working-set effect: on a 12th Gen Intel Core i9-12900K with NumPy 2.5.4, a shuffled gather is about 1.8 times slower than a sequential one at 10^5 elements and about 5 times slower at 10^7. |
| Rebuild | A README lists the commands that rerun every test and benchmark. | One command reruns everything, with the Python version and CPU stated. |

