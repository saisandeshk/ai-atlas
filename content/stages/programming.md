<!-- Generated from content/curriculum.json. Edit the JSON and run npm run content:generate. -->

# 02. Programming & Software Engineering

**Level:** Foundational  
**Scope:** 5 sections · 84 required topics · 8 optional, depth, or later topics

Build reliable Python programs, explicit interfaces, reproducible tests, bounded concurrent services and safe native extensions.

## Order

01. Python Execution Model
02. Interfaces, Data & APIs
03. Testing, Debugging & Reproducibility
04. Concurrency, Profiling & Operations
05. C & C++ Systems Literacy

## 01. Python Execution Model

**Why:** Later ML code is still Python code. Precise reasoning about objects, imports, cleanup and package boundaries prevents silent state errors that framework knowledge cannot repair.

### Learn this much

- [ ] Name binding, object identity and equality _(Required)_
- [ ] Mutability, aliasing and visible state changes _(Required)_
- [ ] Shallow and deep copying, hashability and dictionary key contracts _(Required)_
- [ ] Argument binding, evaluation time and mutable defaults _(Required)_
- [ ] Lexical scope, closures and captured state _(Required)_
- [ ] Attribute lookup, class and instance state, and method binding _(Required)_
- [ ] Core object protocols and deliberate dunder methods _(Required)_
- [ ] Dataclasses, default factories, equality, ordering and frozen state _(Required)_
- [ ] Iterable and iterator protocols, exhaustion and repeated iteration _(Required)_
- [ ] Generators, lazy pipelines, send and cleanup behavior _(Required)_
- [ ] Decorators, wrappers, metadata and parameterized decorators _(Required)_
- [ ] Context managers, ownership and deterministic cleanup _(Required)_
- [ ] Exception hierarchies, chaining, cleanup and actionable messages _(Required)_
- [ ] Type hints, unions, generics, protocols and narrowing _(Required)_
- [ ] Modules, packages, import resolution and module caching _(Required)_
- [ ] Virtual environments, dependencies and editable installs _(Required)_
- [ ] Src-layout packaging, pyproject metadata and console entry points _(Required)_
- [ ] Reference counts, cycle collection and weak references _(Optional)_
- [ ] Custom descriptors and metaclass internals _(Depth)_

### Study units

#### U1. Names, identity, mutability, copying and hashability

**About 4 h** · **Target:** Explain + Measure

Topics: Name binding, object identity and equality; Mutability, aliasing and visible state changes; Shallow and deep copying, hashability and dictionary key contracts

Almost every silent data bug is shared mutable state. This unit makes aliasing visible before frameworks add more of it.

**You can now**

- Explain name binding, identity and equality using a novel nested-object example, and state when CPython may reuse an immutable object.
- Predict visible mutations for aliases, shallow copies and deep copies of a nested structure.
- State the dictionary and set key contract, including why a tuple holding a list is unhashable and why NaN lookups fail.

**Study**

1. [Shallow and deep copying](https://github.com/stas00/python-cookbook/blob/master/content/README.md#copying-shallow-vs-deep) (Stas' Python Cookbook - selected path) - Lists: Copying (shallow vs deep), including the `listB = listA` warning.
2. [Tuples, sets and dictionaries](https://github.com/stas00/python-cookbook/blob/master/content/README.md#tuples) (Stas' Python Cookbook - selected path) - Tuples, Sets and Dictionaries: construction, mutation, `frozenset`, key rules and insertion order.
3. [Objects, values and types](https://docs.python.org/3/reference/datamodel.html#objects-values-and-types) (Python language reference) - Section 3.1: identity, type and value; mutable versus immutable; the `a = 1`; `b = 1` reuse rule.
4. [Default equality and hashing](https://docs.python.org/3/reference/datamodel.html#object.__hash__) (Python language reference) - `object.__eq__` and `object.__hash__`: default identity equality; defining `__eq__` without `__hash__` removes hashing.

**Focus**

- Assignment binds a name to an object. `is` tests identity and `==` tests value; CPython reuses small immutable objects, but the reference says reuse may or may not happen, so never branch on it.
- Two names can own one mutable object. A shallow copy shares every nested object; only a deep copy duplicates them. Copying an immutable such as a `tuple` or `str` may return the same object.
- A key must stay hashable and equal for its lifetime in the container. A `tuple` is hashable only when all its items are; NaN never equals itself, so a fresh NaN misses a stored NaN key.
- The cookbook says tuples are hashable because they are immutable. That shortcut is wrong for tuples that hold mutables; `hash((1, [2]))` raises `TypeError`.

**Reproduce:** Closed-book, predict `a`, `c` and `d` after `a = [[0]]`; `b = a`; `c = copy.copy(a)`; `d = copy.deepcopy(a)`; `b[0].append(1)`. Then quote the measured copy costs: shallow about 3 us and deep about 1.4 ms per copy of a 2000 by 10 nested list on CPython 3.14.4 default build, 12th Gen Intel Core i9-12900K, `timeit.repeat` best of 5.

**Traps**

- Comparing values with `is`. Constant folding makes `257 is 257` true inside one compilation unit, and CPython warns (`SyntaxWarning`) on `is` with a literal, so `is` proves nothing about equality.
- `dict.fromkeys(keys, [])` shares one list across all keys; appending through one key shows up under every key.
- Reading `d[float('nan')]` after storing under another NaN. Lookup needs equality with the stored key, and NaN never equals NaN.

**Practice**

- The section mini-project covers this: diagnosing and fixing the seeded aliasing defect with a regression test.

**Stop when:** You predict the alias, copy and NaN cases without running them, and your copy-cost numbers match a fresh `timeit` run.

<details>
<summary>Self-test</summary>

1. After `a = [1, [2]]`; `b = a`; `c = copy.copy(a)`; `b.append(3)`; `b[1].append(4)`, what are `a` and `c`?
   - `a` is `[1, [2, 4], 3]` because `b` names the same list. `c` is `[1, [2, 4]]`: its outer list was copied before the append, but it shares the inner list.
2. Why does `hash((1, 2))` work while `hash((1, [2]))` raises `TypeError`?
   - Tuple hashing needs every item hashable. A `list` is unhashable, so the `tuple` is unhashable despite being immutable.
3. `d = {}`; `k = float('nan')`; `d[k] = 1`. Why does `d[float('nan')]` raise `KeyError`?
   - Lookup compares by hash then equality, and NaN never equals NaN, so the fresh key never matches the stored one.
4. Give a case where `x is y` holds but `x == y` is `False`.
   - `x = y = float('nan')`. Identity holds and equality is `False`. Apart from pathological `__eq__` definitions, identity implies equality.

</details>

#### U2. Argument binding, scope and closures

**About 3 h** · **Target:** Explain

Topics: Argument binding, evaluation time and mutable defaults; Lexical scope, closures and captured state

Mutable defaults and late-bound closures leak state between calls. Call semantics decide exactly what a caller can observe.

**You can now**

- Explain positional, keyword, default, `*args`, `**kwargs`, positional-only and keyword-only binding, including when defaults are evaluated.
- Explain block scope, `global` and `nonlocal`, and closure capture with the late-binding rule.
- Predict `UnboundLocalError` and shared-mutable-default behavior in unseen code.

**Study**

1. [Argument binding forms](https://github.com/stas00/python-cookbook/blob/master/content/README.md#arguments-positional-keyword-defaults-argskwargs) (Stas' Python Cookbook - selected path) - Functions: Arguments (positional, keyword, defaults, `*args`/`**kwargs`, positional-only and keyword-only); the mutable-default bad/good pair.
2. [Call by assignment](https://github.com/stas00/python-cookbook/blob/master/content/README.md#pass-by-object-reference) (Stas' Python Cookbook - selected path) - Functions: Pass-by-object-reference (mutating a mutable argument versus rebinding a name).
3. [Closures and late binding](https://github.com/stas00/python-cookbook/blob/master/content/README.md#closures) (Stas' Python Cookbook - selected path) - Functions: Closures (the `nonlocal` counter); the late-binding trap with the default-argument bind.
4. [Binding and resolution of names](https://docs.python.org/3/reference/executionmodel.html#binding-of-names) (Python language reference) - Sections 4.2.1 and 4.2.2: binding constructs, block-wide locals, `UnboundLocalError`, `global` and `nonlocal`, the class-block scope rule.
5. [Default Arguments](https://algomaster.io/learn/python/default-arguments) (AlgoMaster Python - structured revision) - The Default Arguments lesson and Exercise: Default Arguments; recall after the cookbook pass.
6. [Closures](https://algomaster.io/learn/python/closures) (AlgoMaster Python - structured revision) - The Closures lesson and Exercise: Closures; predict each output before checking.

**Focus**

- Defaults evaluate once at function definition time. The `None` sentinel plus a fresh list inside the body is the standard fix.
- Arguments pass by assignment: rebinding a parameter is invisible to the caller, while mutating a mutable argument is visible.
- Closures capture variables, not values. Loop closures share the final value; a default argument binds the current one.
- A name bound anywhere in a block is local everywhere in it. Reading it before assignment raises `UnboundLocalError`; `global` and `nonlocal` redirect the binding.

**Reproduce:** Closed-book, write `make_funcs` returning three closures over `range(3)` so each returns its own index, plus a `nonlocal` counter starting at 0. State that the naive loop version returns `[2, 2, 2]` on CPython 3.14.4.

**Traps**

- Believing closures snapshot values. They read the live cell at call time.
- Using `+=` on a `global` without a `global` statement. Augmented assignment binds, so the name goes local and the read fails.
- Treating every parameter before `*` as positional-only. Only parameters before `/` are; `c` in `def g(a, b, /, c, *, d)` still accepts keywords.

**Practice**

- [AlgoMaster Python: Exercise: Default Arguments](https://algomaster.io/learn/python/default-arguments-exercise) - Exercises 1 to 5, especially Exercise 4: Avoid a Shared List Default and Exercise 5: Distinguish Omitted From `None`. Do it after the cookbook pass; write the `None`-sentinel fix from memory.
- [AlgoMaster Python: Exercise: Closures](https://algomaster.io/learn/python/closures-exercise) - Exercises 1 to 5, especially Exercise 3: Inspect Captured Closure Cells, Exercise 4: Update Captured State with Nonlocal and Exercise 5: Avoid Late Binding in a Loop. Predict each closure output on paper before checking.

**Stop when:** You fix a mutable-default and a late-binding bug on first reading, and your `make_funcs` returns `[0, 1, 2]`.

<details>
<summary>Self-test</summary>

1. `def f(x, acc=[]): acc.append(x); return acc`. What do `f(1)` and `f(2)` return, and what is the fix?
   - `f(1)` is `[1]` and `f(2)` is `[1, 2]`: one list is shared across calls. Default to `None` and build a fresh list in the body.
2. What does `[fn() for fn in [lambda: i for i in range(3)]]` give, and why?
   - `[2, 2, 2]`. Each closure reads the same cell `i`, which holds 2 after the loop.
3. `x = 10` at module level. `def f(): print(x); x = 1`. What does `f()` do?
   - It raises `UnboundLocalError`. The assignment makes `x` local for the whole block, so the print reads an unbound local.
4. In `def g(a, b, /, c, *, d)`, which parameters can be passed by keyword?
   - `c` and `d`. `a` and `b` are positional-only and raise `TypeError` when passed by keyword.

</details>

#### U3. Attribute lookup, object protocols and dataclasses

**About 5 h** · **Target:** Explain + Implement

Topics: Attribute lookup, class and instance state, and method binding; Core object protocols and deliberate dunder methods; Dataclasses, default factories, equality, ordering and frozen state

Config and record objects cross every boundary in later stages. Lookup, equality and default rules decide what breaks silently.

**You can now**

- Trace attribute lookup through data descriptors, the instance dictionary, non-data descriptors and the MRO without running code.
- Implement a class with deliberate dunders and state the equality and hashing consequences.
- Build a validated frozen dataclass with safe defaults, serialization and malformed-input tests.

**Study**

1. [Special methods](https://github.com/stas00/python-cookbook/blob/master/content/README.md#dunder-special-methods) (Stas' Python Cookbook - selected path) - Classes and Objects: Dunder (special) methods with the `Vector` example; `__repr__` for developers and `__str__` for users.
2. [Attribute access and delegation](https://github.com/stas00/python-cookbook/blob/master/content/README.md#dynamic-attributes-and-delegation) (Stas' Python Cookbook - selected path) - Classes and Objects: Dynamic attributes and delegation; `__getattr__` runs only after normal lookup fails. Depth: Skip the Null-object/Dummy classes subsection. A catch-all `__getattr__` hides typos and works against this unit's explicitness goal.
3. [Special method lookup and attribute access](https://docs.python.org/3/reference/datamodel.html#special-method-lookup) (Python language reference) - Section 3.3.13 Special method lookup (implicit calls bypass the instance) and 3.3.2 Customizing attribute access (`__getattribute__` versus `__getattr__`).
4. [The `@dataclass` decorator and fields](https://docs.python.org/3/library/dataclasses.html#dataclasses.dataclass) (dataclasses - data classes) - The `@dataclass` parameters (`eq`, `order`, `frozen`, `slots`), `field()` with `default_factory`, Frozen instances and Post-init processing.
5. [Dataclass helpers](https://docs.python.org/3/library/dataclasses.html#dataclasses.asdict) (dataclasses - data classes) - `asdict`, `astuple` and `replace` for serialization and copy-with-change.
6. [Dunder Methods](https://algomaster.io/learn/python/dunder-methods) (AlgoMaster Python - structured revision) - The Dunder Methods lesson and its exercise for recall.
7. [Data Classes](https://algomaster.io/learn/python/dataclasses) (AlgoMaster Python - structured revision) - The Data Classes lesson and Exercise: Data Classes after the cookbook pass.

**Focus**

- Lookup order is data descriptors, then the instance dictionary, then non-data descriptors and class attributes. Implicit dunder calls use the type only, so an instance `__len__` attribute never changes `len(obj)`.
- `object.__eq__` is identity by default. Defining `__eq__` without `__hash__` sets `__hash__` to `None` and the instances become unhashable.
- Dataclass mutable defaults raise `ValueError` at class creation; `field(default_factory=list)` gives each instance its own list.
- The cookbook writes `Config(frozen=True)`. That call is wrong and raises `TypeError`; `frozen` belongs on the decorator as `@dataclass(frozen=True)`.

**Reproduce:** Closed-book, write a frozen slotted dataclass with two validated fields, `__post_init__` checks, an `asdict` round trip and a `replace()` change. State why its instances are hashable and which line breaks if `frozen` is removed.

**Traps**

- Setting an instance `__len__` to change `len()`. Implicit lookup skips the instance dictionary.
- Expecting `<` on a default dataclass to work. `order` defaults to `False`, so `P(1) < P(2)` raises `TypeError`.
- Sharing state through a plain `list` default. The decorator rejects it with `ValueError`; read that error as protection.

**Practice**

- [AlgoMaster Python: Exercise: Data Classes](https://algomaster.io/learn/python/dataclasses-exercise) - Exercises 1 to 5, especially Exercise 2: Compare Products by Field Values and Exercise 4: Give Each Cart Its Own Item List. Use for recall; the frozen dataclass in Reproduce is the implement-depth check.

**Stop when:** Your frozen dataclass validates, serializes and round-trips, and you can trace a lookup and an equality case without running code.

<details>
<summary>Self-test</summary>

1. A data descriptor, an instance entry and a plain class attribute all define `x`. Which does `obj.x` return?
   - The data descriptor wins. Instance lookup only beats non-data descriptors and plain class attributes.
2. A class defines `__eq__` but no `__hash__`. What does `hash(instance)` do?
   - It raises `TypeError`. Defining `__eq__` sets `__hash__` to `None` unless `__hash__` is also defined.
3. What happens at class creation for `tags: list = []` inside `@dataclass`, and what is the fix?
   - `ValueError`: mutable default is not allowed. Use `tags: list = field(default_factory=list)`.
4. Why does removing `frozen=True` from a hashed dataclass break set membership?
   - Instances become unhashable because `eq` without `frozen` sets `__hash__` to `None`. Mutable hashed instances are worse: edits strand them in the wrong bucket.

</details>

#### U4. Iterators, generators and lazy pipelines

**About 4 h** · **Target:** Explain + Implement

Topics: Iterable and iterator protocols, exhaustion and repeated iteration; Generators, lazy pipelines, send and cleanup behavior

Data work streams. Single-pass exhaustion and silent re-iteration bugs are the usual pipeline failures.

**You can now**

- Implement a reusable iterator with tests for exhaustion, repeated iteration and invalid input.
- Implement a lazy generator pipeline and compare it with the eager version on peak memory, time and correctness.
- Predict generator cleanup on `close`, `throw` and deallocation, and PEP 479 `StopIteration` handling.

**Study**

1. [Comprehension forms and itertools](https://github.com/stas00/python-cookbook/blob/master/content/README.md#comprehensions-iterators-and-itertools) (Stas' Python Cookbook - selected path) - Comprehensions, Iterators and itertools: `list`/`dict`/`set`/`generator` forms; the essential itertools (`chain`, `islice`, `groupby` on sorted input); `zip` `strict=True` and `zip_longest`.
2. [Generators and yield](https://github.com/stas00/python-cookbook/blob/master/content/README.md#generators-and-yield) (Stas' Python Cookbook - selected path) - Generators and `yield`: the `read_big` line pipeline, infinite integers, `yield from` in `flatten()`.
3. [Generator functions and container protocols](https://docs.python.org/3/reference/datamodel.html#generator-functions) (Python language reference) - Section 3.2.8.3 Generator functions (calling returns an iterator; the body runs on first `next`) and 3.3.7 Emulating container types (`__len__`, `__iter__`, `__getitem__`, `__contains__`).
4. [Custom Iterators](https://algomaster.io/learn/python/custom-iterators) (AlgoMaster Python - structured revision) - The Custom Iterators lesson and its exercise; write `__iter__` and `__next__` from memory first.
5. [Generators](https://algomaster.io/learn/python/generators) (AlgoMaster Python - structured revision) - The Generators lesson and Exercise: Generators; then the `yield` Statement lesson for `send` and `return` values.

**Focus**

- An iterable makes fresh iterators; an iterator is consumed once. `iter()` on a `list` gives a new object each time, while a generator is its own single-pass iterator.
- Generators suspend at `yield` and resume after it. `send()` delivers a value to the paused `yield` expression; a `return` value becomes `StopIteration.value`; `close()` raises `GeneratorExit` inside.
- Raising `StopIteration` inside a generator body is a `RuntimeError` since Python 3.7 by PEP 479; use `return` to stop.
- Lazy wins memory only when nothing materializes. One `list()` call in the middle removes the gain; measure peak with `tracemalloc` on the same workload.

**Reproduce:** Closed-book, implement a repeatable `Range` iterable and a single-pass variant; assert the second `list()` pass is full for the first and empty for the second. Then run the eager versus lazy comparison: `list` of 1M squares peaks near 40 MB while the genexpr sum peaks under 1 KiB with equal results, measured with `tracemalloc` on CPython 3.14.4 default build, 12th Gen Intel Core i9-12900K.

**Traps**

- Re-iterating an exhausted generator and expecting fresh data. The second pass is empty with no error.
- An accidental `StopIteration` inside a generator body. It surfaces as `RuntimeError`, not a quiet stop.
- `itertools.groupby` across unsorted input. It groups consecutive items only; sort first or accept split groups.

**Practice**

- [AlgoMaster Python: Exercise: Custom Iterators](https://algomaster.io/learn/python/custom-iterators-exercise) - Exercises 1 to 5, especially Exercise 2: Reusable Product Catalog Iterator and Exercise 5: Independent Iterators That Skip Closed Tickets. Implement `__iter__` and `__next__` in your own file before checking.
- [AlgoMaster Python: Exercise: Generators](https://algomaster.io/learn/python/generators-exercise) - Exercises 1 to 5, especially Exercise 3: Consume a Generator Once and Exercise 5: Flatten Nested Lists Lazily. Add exhaustion and second-pass assertions the exercise does not ask for.

**Stop when:** Your iterator passes exhaustion, repeat and invalid-input tests, and your pipeline matches the memory numbers with equal outputs.

<details>
<summary>Self-test</summary>

1. How do you test whether an object is an iterable or an iterator?
   - Call `iter()` twice: a `list` gives two distinct working iterators, while a generator returns itself. `list()` on an exhausted generator is `[]`.
2. A generator yields 1 then raises `StopIteration('x')`. What does the caller see?
   - `RuntimeError` by PEP 479, not `StopIteration`. End a generator with `return`, optionally with a value.
3. How does a caller read a value returned by a generator, and how does it send one in?
   - `return 'done'` surfaces as `StopIteration.value` on exhaustion. `send(v)` resumes the paused `yield` expression with `v`; prime with `next()` first.
4. The lazy pipeline uses the same peak memory as the eager one. What is the first suspect?
   - Something materializes: a `list()`, `sorted()`, `len()` or reuse of the data downstream. Find the allocating line with `tracemalloc`.

</details>

#### U5. Decorators, wrappers and parameterized decorators

**About 3 h** · **Target:** Implement

Topics: Decorators, wrappers, metadata and parameterized decorators

Retry, timing, caching and registration later are all decorators. A wrapper that drops metadata corrupts help, test ids and error messages.

**You can now**

- Implement a behavior-preserving wrapper with `functools.wraps` and forwarded `*args`/`**kwargs`.
- Implement a parameterized decorator factory with its own state, such as `retry` with a budget.
- Predict metadata loss, double-application and unhashable-argument failures in wrappers.

**Study**

1. [Decorators](https://github.com/stas00/python-cookbook/blob/master/content/README.md#decorators) (Stas' Python Cookbook - selected path) - Functions: Decorators (the timed wrapper with `functools.wraps`); the no-op fallback pattern for optional dependencies.
2. [functools: partial, caching, reduce](https://github.com/stas00/python-cookbook/blob/master/content/README.md#functools-partial-caching-reduce) (Stas' Python Cookbook - selected path) - functools: `partial`, `lru_cache` and cache bounds, `reduce`; cache keys need hashable arguments.
3. [Decorators](https://algomaster.io/learn/python/decorators) (AlgoMaster Python - structured revision) - The Decorators lesson and Exercise: Decorators; write the wrapper from memory first.
4. [functools Module](https://algomaster.io/learn/python/functools-module) (AlgoMaster Python - structured revision) - The functools Module lesson: compare `wraps`, `lru_cache` and `partial` behavior after the cookbook pass.

**Focus**

- A decorator replaces the function object. Without `@wraps` the name, docstring and signature come from the wrapper; with it, `__wrapped__` points back.
- A decorator with arguments is three levels: the factory call, then the decorator, then the wrapper. State which level each argument belongs to.
- `lru_cache` and cache key on all arguments. Unhashable arguments raise `TypeError`; an unbounded cache grows one entry per distinct call.
- Wrappers must forward `*args` and `**kwargs` untouched, including `self` for methods; returning the inner result keeps the return contract.

**Reproduce:** Closed-book, write `retry(times)` that preserves `__name__` and reruns on `ValueError`, and show three attempts ending in success plus `lru_cache` raising `TypeError` on a `list` argument (both verified on CPython 3.14.4).

**Traps**

- Forgetting `@wraps` on a wrapper. Test ids and help show wrapper and failures get harder to trace.
- Writing `@retry` without the factory call. The function lands in the `times` parameter, the name is bound to the inner decorator, and the first call wraps its argument instead of running.
- Caching a function of large or unhashable inputs. Memory grows silently or the first call raises TypeError.

**Practice**

- [AlgoMaster Python: Exercise: Decorators](https://algomaster.io/learn/python/decorators-exercise) - Exercises 1 to 5, especially Exercise 2: Preserve Metadata with `wraps`, Exercise 4: Trace Stacked Decorators and Exercise 5: Retry a Failing Function. Implement the `retry` factory in your own file first, then add an `lru_cache` variant of one answer and state its key policy.

**Stop when:** Your `retry` wrapper preserves metadata, retries the seeded failure, and you can name the cache key policy for any wrapper.

<details>
<summary>Self-test</summary>

1. What breaks when `@wraps` is missing from a wrapper?
   - `__name__`, `__doc__` and the signature come from the wrapper, and `__wrapped__` is absent. Debuggers, help and pytest ids show wrapper.
2. Why does a cached function fail on `f([1, 2])`?
   - Cache keys need hashing and `list` is unhashable, so the call raises `TypeError` before the body runs.
3. Sketch the three levels of `@retry(3)` and what each receives.
   - `retry(3)` returns the decorator; the decorator receives the function; the wrapper receives the call arguments and loops.
4. A timed decorator swallows the return value. Which contract breaks, and what is the one-line fix?
   - Callers get `None` instead of the result. Return `fn(*args, **kwargs)` from the wrapper, through `try`/`finally` for timing.

</details>

#### U6. Context managers, exceptions and deterministic cleanup

**About 4 h** · **Target:** Implement

Topics: Context managers, ownership and deterministic cleanup; Exception hierarchies, chaining, cleanup and actionable messages

Deterministic cleanup separates scripts from services. Tracebacks are the primary diagnostic; the hierarchy decides their quality.

**You can now**

- Implement a resource-owning context manager in class and `@contextmanager` forms, with cleanup proven on success and exception paths.
- Derive the cleanup sequence for nested managers with failing handlers.
- Design a small exception hierarchy that preserves cause and maps to actionable command-line errors.

**Study**

1. [Context managers](https://github.com/stas00/python-cookbook/blob/master/content/README.md#context-managers) (Stas' Python Cookbook - selected path) - Classes and Objects: Context managers (the `@contextmanager` `opened()` pattern with `try`/`finally`); `nullcontext` for conditional `with` blocks.
2. [Exceptions and error handling](https://github.com/stas00/python-cookbook/blob/master/content/README.md#exceptions-and-error-handling) (Stas' Python Cookbook - selected path) - Raising and catching (`try`/`except`/`else`/`finally`); Re-raising and chaining (`raise` `from`, `from None`); Custom exceptions; Good habits.
3. [The try statement](https://docs.python.org/3/reference/compound_stmts.html#the-try-statement) (Python language reference) - Section 8.4 with 8.4.2 `except*`: groups split across clauses; `else` runs only without exceptions; `finally` always runs.
4. [The with statement](https://docs.python.org/3/reference/compound_stmts.html#the-with-statement) (Python language reference) - Section 8.5: `__enter__` and `__exit__` protocol; a true `__exit__` return suppresses the exception.
5. [Exception Chaining](https://algomaster.io/learn/python/exception-chaining) (AlgoMaster Python - structured revision) - The Exception Chaining lesson and its exercise; trace `__cause__` versus `__context__`.
6. [Context Managers](https://algomaster.io/learn/python/context-managers) (AlgoMaster Python - structured revision) - The Context Managers lesson and Exercise: Context Managers; then the `with` Statement lesson.

**Focus**

- Exceptions in the `with` body are thrown into the `@contextmanager` generator at the `yield` point; the `finally` clause still runs before propagation.
- `__exit__` returning true suppresses; anything falsy re-raises. Swallowing by accident hides the failure the caller must see.
- `raise New from e` keeps the cause; `from None` hides context deliberately. A bare `raise` re-raises the same exception with its traceback.
- `ExceptionGroup` splits across `except*` clauses since Python 3.11: handled members are removed and the rest keeps propagating.

**Reproduce:** Closed-book, write a `@contextmanager` owning a temp file plus a two-level `ConfigError` hierarchy with a CLI exit-code map. Prove the file closes on an inner `ValueError` and that the mapped error keeps its `__cause__`.

**Traps**

- A bare `except`: swallows `KeyboardInterrupt` and `SystemExit`. Catch `Exception` at broadest, and re-raise what you do not handle.
- An exception raised in `finally` or in `__exit__` replaces the in-flight one. Keep cleanup paths total and narrow.
- Catching an `ExceptionGroup` with `except` instead of `except*`. Plain `except` matches the whole group object and never the members.

**Practice**

- [AlgoMaster Python: Exercise: Context Managers](https://algomaster.io/learn/python/context-managers-exercise) - Exercises 1 to 5, especially Exercise 3: Close a File After an Exception and Exercise 5: Build a Generator Context Manager. Then prove cleanup on the exception path in your own file.
- [AlgoMaster Python: Exercise: Exception Chaining](https://algomaster.io/learn/python/exception-chaining-exercise) - Exercises 1 to 5: implicit context, `raise` `from` a cause, `from None`, the two traceback bridge sentences, and a cause that differs from the context. Draw the `__cause__` chain for each answer.

**Stop when:** Your manager closes the resource on success, exception and inner-raise paths, and your hierarchy maps each failure to one actionable message with its cause intact.

<details>
<summary>Self-test</summary>

1. Where does an exception raised in a `with` body surface inside a `@contextmanager` generator?
   - At the `yield` point, as if the `yield` raised it. `try`/`finally` around the `yield` runs cleanup, then the exception propagates unless caught.
2. What is the difference between `raise E from e`, `raise E from None` and bare `raise`?
   - `from e` sets `__cause__` and shows both tracebacks; `from None` suppresses the context; bare `raise` re-raises the active exception unchanged.
3. `except* ValueError` handles half an `ExceptionGroup`. What happens to the rest?
   - The remaining members propagate as a group. `except*` subtracts matches; unmatched members keep traveling.
4. When does the `else` clause of `try` run, and what is it for?
   - Only when no exception occurred. It separates code that must not be protected from the risky block, so its own failures stay distinct.

</details>

#### U7. Type hints, generics, protocols and narrowing

**About 3 h** · **Target:** Explain + Implement

Topics: Type hints, unions, generics, protocols and narrowing

Typed boundaries are the foundation of the next section. Hints are documentation the machine checks.

**You can now**

- Write PEP 695 generics and type aliases, and explain deferred annotation evaluation on Python 3.14.
- Define a `Protocol` and contrast structural with nominal subtyping, including `runtime_checkable` limits.
- Narrow unions with `isinstance` and `assert_type`, and pass mypy clean on a typed module.

**Study**

1. [Type parameter lists](https://docs.python.org/3/reference/compound_stmts.html#type-parameter-lists) (Python language reference) - Sections 8.10 to 8.10.3: generic functions, classes and aliases since Python 3.12 by PEP 695; bounds, constraints and defaults.
2. [Annotation scopes and lazy evaluation](https://docs.python.org/3/reference/executionmodel.html#annotation-scopes) (Python language reference) - Sections 4.2.3 and 4.2.4: annotation scopes; lazy evaluation since 3.12, extended to all annotations in 3.14 by PEP 649 and PEP 749.
3. [Protocols](https://docs.python.org/3/library/typing.html#protocols) (typing - type hints and protocols) - Protocols: structural subtyping; `runtime_checkable` limits (`isinstance` checks presence only).
4. [Generics](https://docs.python.org/3/library/typing.html#generics) (typing - type hints and protocols) - Generics: `TypeVar`-based generics for reading older code; write new code with the PEP 695 syntax above.
5. [Checked narrowing](https://docs.python.org/3/library/typing.html#typing.assert_type) (typing - type hints and protocols) - `assert_type`: ask the checker to prove a narrowed type at a program point.
6. [mypy Type Checker](https://algomaster.io/learn/python/mypy) (AlgoMaster Python - structured revision) - The mypy Type Checker lesson and its exercise; verify every syntax claim against the 3.14 sections above, since older examples may predate PEP 695.

**Focus**

- Annotations are lazily evaluated since 3.14 by PEP 649: `def f(x: 1/0)` defines fine and fails only when `__annotations__` is read. `get_type_hints` evaluates them in the right scope.
- PEP 695 in 3.12 puts type parameters in brackets: `def first[T](xs: list[T]) -> T`. Read old `TypeVar` code; write the new syntax.
- A `Protocol` defines structure, not lineage. `isinstance` against a non-`runtime_checkable` `Protocol` raises `TypeError`; a `runtime_checkable` check tests member presence only.
- Narrowing proves a type at a point: `isinstance` branches plus `assert_type` as the checkable claim. `isinstance` with a parameterized generic raises `TypeError`.

**Reproduce:** Closed-book, type a generic `first()` plus a small `Protocol` and a narrowing function over `int | str`; run mypy 2.4.0 clean. Show that `def f(x: 1/0)` defines without error on 3.14 and raises only on annotation access.

**Traps**

- Checking with `isinstance(x, list[int])`. Parameterized generics are not valid `isinstance` targets.
- Treating a `runtime_checkable` `Protocol` as a full interface check. It verifies member presence, never signatures or semantics.
- Assuming annotations run at `def` time. On 3.14 a `ZeroDivisionError` inside an annotation waits until someone reads it, which delays import-time failures.

**Practice**

- [AlgoMaster Python: Exercise: mypy Type Checker](https://algomaster.io/learn/python/mypy-exercise) - Exercises 1 to 4: exposing annotations, a `NewType` call, counting error codes and a `pyproject.toml` `mypy` section. Run the same checks locally with mypy 2.4.0 from the section interpreter.

**Stop when:** Your typed module passes mypy clean, your `Protocol` accepts an unrelated matching class, and you can state exactly when each annotation evaluates.

<details>
<summary>Self-test</summary>

1. `def f(x: 1/0) -> None: pass` runs without error on 3.14. When does it fail, and which PEP changed this?
   - It fails when `__annotations__` is read, through the lazy `__annotate__` hook. PEP 649 made annotations lazily evaluated in 3.14.
2. What does `isinstance([], list[int])` do, and what should you write instead?
   - It raises `TypeError`: parameterized generics are not valid `isinstance` targets. Check `isinstance(x, list)` and narrow items separately, or use `assert_type` for the static claim.
3. `class P(Protocol): def m(self) -> int`. What does `isinstance(obj, P)` do without `@runtime_checkable`?
   - It raises `TypeError`. Structural checks need `@runtime_checkable`, which then checks member presence only.
4. Rewrite `class Box(Generic[T])` with 3.12 syntax and state the minimum version.
   - `class Box[T]: ...` needs Python 3.12 or later by PEP 695.

</details>

#### U8. Imports, virtual environments and src-layout packaging

**About 4 h** · **Target:** Explain + Implement

Topics: Modules, packages, import resolution and module caching; Virtual environments, dependencies and editable installs; Src-layout packaging, pyproject metadata and console entry points

The checkpoint builds and installs a package. Import evidence is also how every environment bug gets diagnosed.

**You can now**

- Explain module caching, path resolution and package boundaries, including script versus `-m` execution.
- Diagnose import shadowing and environment mismatch from `sys.path` and `sys.modules` evidence.
- Build and install a typed src-layout package from a blank directory with a console entry point, verified in a clean environment.

**Study**

1. [Import search path](https://github.com/stas00/python-cookbook/blob/master/content/README.md#syspath--where-imports-come-from) (Stas' Python Cookbook - selected path) - Modules and Imports: `sys.path` order; computing paths from `__file__`; `PYTHONPATH`.
2. [Module cache and dynamic import](https://github.com/stas00/python-cookbook/blob/master/content/README.md#inspecting-and-reloading-modules) (Stas' Python Cookbook - selected path) - Inspecting and reloading modules (the `sys.modules` cache; `reload` keeps old objects) and Dynamic import with `importlib`.
3. [The module cache and packages](https://docs.python.org/3/reference/import.html#the-module-cache) (Python language reference) - Section 5.3.1 The module cache (one execution per process); 5.2 Packages (regular versus namespace); 5.7 relative imports.
4. [Searching and __main__](https://docs.python.org/3/reference/import.html#searching) (Python language reference) - Section 5.3 Searching with 5.5 Path Based Finder; 5.8 `__main__` (script versus `-m` path and the double-execution trap).
5. [Environment variables and argparse](https://github.com/stas00/python-cookbook/blob/master/content/README.md#environment-variables) (Stas' Python Cookbook - selected path) - Environment Variables and Program Arguments: `environ` handling; the `argparse` CLI shape; replaying the exact command line.
6. [Versions and virtual environments](https://github.com/stas00/python-cookbook/blob/master/content/README.md#versions-and-dependencies) (Stas' Python Cookbook - selected path) - Versions and Dependencies: `sys.version_info` checks, `importlib.metadata` versions, `venv` creation and activation.
7. [Creating the package files](https://packaging.python.org/en/latest/tutorials/packaging-projects/) (Packaging Python Projects) - Creating the package files (the `src` layout tree) through Configuring metadata; choose the `setuptools` backend.
8. [Building and installing locally](https://packaging.python.org/en/latest/tutorials/packaging-projects/) (Packaging Python Projects) - Generating distribution archives (one build produces sdist and wheel) and Installing your newly uploaded package. Depth: Skip Uploading the distribution archives; do not publish to TestPyPI. Install from `dist/` into a clean `venv` instead (verified with a `setuptools`-backend build and a clean-environment wheel install).

**Focus**

- Importing executes the module once per process and caches it in `sys.modules`. A second import binds the same object; `reload()` re-executes but old objects keep old classes.
- `sys.path[0]` differs by launch: a script prepends its own directory while `-m` prepends the current directory. The same file run as a script and imported as a module executes twice, as `__main__` and under its real name.
- Regular packages need `__init__.py`; namespace packages merge path portions without one. Relative imports need package context and fail in bare scripts.
- Editable installs register the project in the environment; path hacks only fake it. The passing test is a clean-environment install with no `sys.path` edits.

**Reproduce:** From a blank directory, create a src-layout package named `atlas_demo` with an `add()` function and an `atlas-demo` entry point; build the sdist and wheel; install the wheel in a clean environment and run the entry point to print 5 with no `sys.path` edits.

**Traps**

- Running tests from the package directory and importing the local tree by accident. The clean-environment install test exists to catch exactly this.
- Two copies of one module: tests `import pkg.mod` while a script already ran it as `__main__`. State lives in two places and singletons split.
- Using `pip freeze` for requirements. It captures the whole environment; record direct dependencies and verify with the clean install.

**Practice**

- [AlgoMaster Python: Exercise: Packages](https://algomaster.io/learn/python/packages-exercise) - Exercises 1 to 5, especially Exercise 3: Re-export a Flat Package API and Exercise 4: Use Relative Imports in a Subpackage. Do it after building the tutorial package; compare its layout with yours.
- [AlgoMaster Python: Exercise: Virtual Environments](https://algomaster.io/learn/python/virtual-environments-exercise) - Exercises 1 to 5, especially Exercise 2: Read `pyvenv.cfg` Settings and Exercise 5: Audit a Venv Against Requirements. Create the clean install-test venv from memory.

**Stop when:** Your entry point runs from a clean environment, and you can name `sys.path[0]` and the cached module for any launch.

<details>
<summary>Self-test</summary>

1. `import pkg.mod` runs twice in one process. How many executions happen, and how do you prove it?
   - One. The second import rebinds from `sys.modules`; the new name is `sys.modules['pkg.mod']`.
2. Why does `python sub/show.py` differ from `python -m sub.show` in `sys.path[0]`?
   - The script prepends its own directory; `-m` prepends the current directory. Imports resolve differently from each.
3. A script imports its sibling fine but fails after moving to a `src` layout. What changed?
   - The sibling is no longer on `sys.path` and implicit siblings are gone. Install the package or run from a layout that puts `src` on the path; do not hand-edit `sys.path` as the fix.
4. What distinguishes an editable install from a `PYTHONPATH` hack?
   - The editable install registers package metadata and entry points in the environment; `PYTHONPATH` only shadows imports and leaves every other machine broken.

</details>

#### U9. Reference counts, cycle collection and weak references

**About 2 h** · **Target:** Explain + Measure

Topics: Reference counts, cycle collection and weak references

Caches and listeners hold objects past their welcome. Lifetime reasoning decides between a leak and a dangling callback.

**You can now**

- Explain reference counting and cycle collection, and predict when each frees an object.
- Use weak references for caches and callbacks without creating ownership bugs.
- Measure collection behavior with `gc.collect`, `gc.get_count` and `sys.getrefcount` on a diagnosed case.

**Study**

1. [Objects and garbage collection](https://docs.python.org/3/reference/datamodel.html#objects-values-and-types) (Python language reference) - Section 3.1: refcounting with delayed cycle detection; never depend on immediate finalization; close files explicitly.
2. [The cycle collector](https://docs.python.org/3/library/gc.html#gc.collect) (gc - cycle garbage collector) - `collect`, `get_count`, `get_threshold`, `garbage` and `disable`/`enable`. Depth: The generations changed within 3.14: 3.14.0 to 3.14.4 run an incremental collector (`gc.get_threshold()` reads `(2000, 10, 0)` on 3.14.4), and the docs record that 3.14.5 restores the three 3.13 generations. Read `gc.get_threshold()` on your interpreter before reasoning about generations.
3. [Weak references](https://docs.python.org/3/library/weakref.html#weak-reference-objects) (weakref - weak references) - Weak-reference objects with callbacks; which types refuse weakrefs; the `WeakValueDictionary` pattern.
4. [Finding leaks](https://github.com/stas00/python-cookbook/blob/master/content/README.md#finding-leaks) (Stas' Python Cookbook - selected path) - Profiling CPU and Memory: Finding leaks (`gc.collect`, `gc.garbage`) with the refcounting one-liner; `tracemalloc` above it for sizing.

**Focus**

- CPython frees by refcount immediately and collects cycles later. A self-referencing object with `__del__` is still collected since Python 3.4 by PEP 442.
- `sys.getrefcount` counts its own argument, and CPython 3.14 borrows references when it loads locals, so one fresh object reads 2 at module level and 1 inside a function. The docs promise nothing beyond 0 or 1; compare readings taken in one context, never absolutes.
- `weakref.ref` fails on `list` and `dict` instances (subclasses can opt in), on `tuple` and `int`, and on slotted classes without `__weakref__`; sets and frozensets support it. Caches want `WeakValueDictionary`, not manual callback books.
- `gc.garbage` holds objects the collector refused; an empty list after `gc.collect()` proves the run happened, not that nothing leaked.

**Reproduce:** Closed-book, build a two-object cycle with a `__del__` method and a `weakref` callback, delete both names, and, with `gc.disable()` first, show that nothing runs until `gc.collect()`, which fires the callback and both `__del__` methods. Then show `sys.getrefcount` on a fresh object reads 2 at module level and 1 inside a function on CPython 3.14.4.

**Traps**

- Depending on `__del__` timing. Collection order is unspecified, so close resources explicitly.
- Caching instances in a plain `dict`. The cache owns them forever; `WeakValueDictionary` or explicit eviction bounds it.
- Reading `gc.garbage` as the leak list. It holds objects the collector refused; ordinary leaks never appear there.

**Practice**

- The section mini-project covers this: lifetime reasoning behind the seeded cleanup defect, with a cycle-collection probe as the regression test.

**Stop when:** Your cycle probe frees on collect, your weakref callback fires, and you can state which reference keeps any object alive.

<details>
<summary>Self-test</summary>

1. `a = []`; `b = [a]`; `a.append(b)`; `del a, b`. When is the memory freed?
   - At the next cycle collection, not at `del`. Refcounts stay positive through the cycle; `gc.collect()` reclaims both.
2. `sys.getrefcount(x)` reads 2 for a fresh object at module level but 1 inside a function. Why?
   - The argument adds a temporary reference, but 3.14 loads locals as borrowed references, so the function call adds none. Only deltas taken in the same context mean anything.
3. `weakref.ref([1, 2, 3])` raises `TypeError`. Why?
   - `list` does not support weak references (a subclass of `list` does). Hold weakref-able objects instead, or use `WeakValueDictionary` for caches.
4. A slotted class cannot be weak-referenced. What is missing?
   - `__weakref__` in `__slots__`. Without that slot the type has no weak-reference support.

</details>

### Mini-project: Installable taskrunner package with a typed registry and two seeded defects

**About 8 to 12 hours.** Build the installable task runner package the later projects extend, with a typed task registry, a lazy run log and deterministic cleanup. Two seeded defects, one aliasing and one lifetime, train evidence-first diagnosis with a regression test for each.

1. Scaffold a src-layout package with `uv init`, build its wheel with `uv build`, install the wheel into a fresh environment and run its console entry point outside the repository, showing the installed copy is imported.
2. Model tasks as a frozen slotted dataclass validated in `__post_init__`, registered by a decorator that rejects duplicates, and checked against the AlgoMaster Python Data Classes and Decorators exercises, with `mypy --strict` clean.
3. Stream the JSON Lines run log through a generator and build the summary from generator expressions, then predict which peak grows with file size and compare peaks with `tracemalloc` against a list-building version.
4. Give each run a directory through a context manager that writes a marker and closes the log on every path, map failures to a small chained exception hierarchy, and test every path.
5. Seed an aliasing defect where a shallow copy shares nested run parameters across runs, write the regression test first, watch it fail, then fix it and explain why the chosen copy strategy removes the sharing.
6. Seed a cleanup defect where a stored bound method keeps a cycle alive, diagnose it with a `weakref` probe and the collector, then fix it so the regression test passes with the collector disabled.

**Deliverables**

- The `taskrunner` repository: src-layout package, wheel, and a `README` with install and import evidence.
- Tests for validation, registration, laziness, cleanup and causes, with `mypy --strict` clean.
- Two defect write-ups with failing and passing regression output, diagnosis evidence and the laziness peak comparison.

**Checks**

- rubric: Self-grade with the rubric below.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Installable package | The wheel installs into a fresh environment and the entry point runs outside the repository. | A test asserts the imported package is the installed copy, and the `README` rebuilds it from a clean checkout. |
| Typed model | `TaskSpec` rejects bad values and round-trips, duplicates are rejected, and `mypy --strict` is clean. | Decorated tasks keep their own type, and the write-up shows the rejected `Protocol` typing and why. |
| Resources and laziness | Cleanup and markers hold on every path with causes chained, and the learner's tests cover each path. | The peak comparison shows the generator holding flat while the list version grows, as predicted. |
| Seeded defects | Both regression tests fail on the seeded code and pass after the fix. | Each write-up names the shared reference or cycle behind the bug and why the fix removes it. |

Feeds into: The installable typed package, its entry point and the run log that the service and pipeline write; the lifetime write-up seeds the evidence-first debugging report.

### Resource route

- **Primary - Course:** [Stas' Python Cookbook - selected path](https://github.com/stas00/python-cookbook/blob/master/content/README.md) - Run Part I on dictionaries, iteration, functions, closures, decorators, classes and context managers; Part II on modules, files, paths, environment and arguments; and Part IV on versions, dependencies, packaging and code quality. Finish by building one src-layout package from a blank directory.
- **Required - Reference:** [Python language reference](https://docs.python.org/3/reference/index.html) - Check Data model, Execution model, Import system and Exceptions whenever a claim depends on Python semantics. These pages are the authority when the course and a runtime observation disagree.
- **Required - Implementation:** [Packaging Python Projects](https://packaging.python.org/en/latest/tutorials/packaging-projects/) - Follow the packaging tutorial once from a blank directory, using a src layout, pyproject.toml, an isolated build and a clean-environment installation test.
- **Support - Practice:** [AlgoMaster Python - structured revision](https://algomaster.io/learn/python/course-roadmap) - Use Functions, Modules and Packages, OOP, Advanced OOP, Exception Handling, Iterators and Generators, Type Hints and Annotations only after the cookbook pass. Open it for recall practice or a diagnosed weak mechanism, not as a second complete course.
- **Reference - Reference:** [dataclasses - data classes](https://docs.python.org/3/library/dataclasses.html) - Read the `@dataclass` parameters (`eq`, `order`, `frozen`, `slots`), `field()` with `default_factory`, frozen instances, post-init processing, `replace`, `asdict` and `astuple`. Use for the validated frozen dataclass in attributes-protocols-dataclasses.
- **Reference - Reference:** [typing - type hints and protocols](https://docs.python.org/3/library/typing.html) - Read Protocols for structural typing and `runtime_checkable` limits, Generics for `TypeVar` generics, and `assert_type` for narrowing checks. Use for the `Protocol` and narrowing parts of type-hints-protocols; PEP 695 syntax itself is in the language reference.
- **Reference - Reference:** [gc - cycle garbage collector](https://docs.python.org/3/library/gc.html) - Read the cycle collector interface: `collect`, `get_count`, `garbage` and `disable`/`enable`. Use for the cycle-collection and measurement parts of refcounting-gc-weakrefs.
- **Reference - Reference:** [weakref - weak references](https://docs.python.org/3/library/weakref.html) - Read weak-reference objects (`ref` callbacks, `proxy` objects) and the `WeakValueDictionary` example. Use for the weak-reference part of refcounting-gc-weakrefs.

### Exit checkpoint

Build and install a typed src-layout package from a blank directory, then trace and repair one seeded aliasing, cleanup or import defect without trial-and-error edits.

<details>
<summary>Deliberately left for later</summary>

- Metaclass frameworks and custom import hooks
- CPython interpreter implementation details beyond a diagnosed need
- Supporting multiple packaging backends

</details>

## 02. Interfaces, Data & APIs

**Why:** Research and production systems fail at boundaries. Typed contracts, explicit schemas and idempotent interfaces keep malformed data and retries from becoming silent corruption.

### Learn this much

- [ ] Nominal and structural typing, generics and protocols _(Required)_
- [ ] Runtime validation and trusted versus untrusted boundaries _(Required)_
- [ ] Typed configuration, precedence, secrets and unknown fields _(Required)_
- [ ] JSON, JSONL and CSV encoding, null and numeric semantics _(Required)_
- [ ] Schema versions, compatibility and explicit migrations _(Required)_
- [ ] Bounded-memory ingestion and malformed-row quarantine _(Required)_
- [ ] Columnar layout, Arrow and Parquet basics _(Required)_
- [ ] Tables, keys, constraints and normalized relationships _(Required)_
- [ ] Joins, aggregation, CTEs and window functions _(Required)_
- [ ] Transactions, isolation anomalies and concurrency-sensitive invariants _(Required)_
- [ ] Indexes, selectivity, cardinality and query plans _(Required)_
- [ ] Backward-compatible migration, mixed versions and rollback _(Required)_
- [ ] Domain, service, transport and persistence boundaries _(Required)_
- [ ] Command-line inputs, output streams, exit codes and errors _(Required)_
- [ ] HTTP methods, validation, status codes, pagination and streaming _(Required)_
- [ ] Idempotency keys, duplicate replay and side-effect ownership _(Required)_
- [ ] ORM identity maps, lazy loading and transaction boundaries _(Optional)_
- [ ] Distributed transactions and sagas _(Later)_

### Study units

#### U1. Typed interfaces, runtime validation and configuration

**About 4 h** · **Target:** Explain + Implement

Topics: Nominal and structural typing, generics and protocols; Runtime validation and trusted versus untrusted boundaries; Typed configuration, precedence, secrets and unknown fields

Every later service in this section stands on this boundary. Untyped inputs and untyped configuration turn typos into silent corruption. Typed contracts with explicit validation move those failures to the edge where they are loud.

**You can now**

- Compare nominal and structural typing, generics with bounded TypeVars and variance, and justify where dynamic values are quarantined at the boundary.
- Define a typed public API with protocols and generics that keeps persistence and transport types out of domain logic.
- Build validated input models and typed settings with explicit unknown-field and precedence behavior, and diagnose one silent-corruption path.

**Study**

1. [Pydantic Models: basic usage, data conversion and extra data](https://pydantic.dev/docs/validation/latest/concepts/models/#basic-model-usage) (Official docs typed-service build path) - Basic model usage including Model methods and properties (`model_validate`, `model_dump`); Data conversion; Extra data (`ignore`, `forbid`, `allow`); Validating data, including Creating models without validation.
2. [Pydantic Validators](https://pydantic.dev/docs/validation/latest/concepts/validators/#field-validators) (Official docs typed-service build path) - Field validators (`after`, `before`, `plain` and `wrap`, in the annotated and decorator patterns); Model validators; Raising validation errors.
3. [Pydantic Fields: constraints and strict fields](https://pydantic.dev/docs/validation/latest/concepts/fields/#field-constraints) (Official docs typed-service build path) - Field constraints; Strict fields.
4. [Pydantic Strict Mode](https://pydantic.dev/docs/validation/latest/concepts/strict_mode/) (Official docs typed-service build path) - As a validation parameter; At the field level, including the `Strict()` metadata class; As a configuration value.
5. [Pydantic Settings Management: names, dotenv and priority](https://pydantic.dev/docs/validation/latest/concepts/pydantic_settings/#usage) (Official docs typed-service build path) - Usage (`env_prefix`, `validation_alias`); Environment variable names with Unknown environment variables; Parsing environment variable values; Dotenv (`.env`) support, including undefined dotenv keys raising under the default `extra` `forbid`; Field value priority.
6. [Interfaces and Protocols](https://algomaster.io/learn/python/interfaces-protocols) (AlgoMaster Python - interfaces, generics and data files) - Structural vs Nominal Typing; Defining a `Protocol`; `@runtime_checkable`: Adding `isinstance` Support; Generic Protocols; Dependency Injection Contracts.
7. [Generic Types](https://algomaster.io/learn/python/generic-types) (AlgoMaster Python - interfaces, generics and data files) - `TypeVar` Basics; Generic Classes with `Generic[T]`; Bounded TypeVars; Variance: Why `list[Product]` Isn't `list[Item]`; Putting It Together: A Generic Service Layer.

**Focus**

- `Protocol` defines a static duck-typing boundary. Nominal inheritance is checked by name, structural compatibility by shape. Use `Protocol` for dependencies the domain calls but does not own.
- Validate at the trust boundary with `model_validate` and `model_validate_json`. `model_construct` skips validation and is only for already-trusted data.
- The default `extra` behavior ignores unknown fields, which silently drops data. Boundary models that must reject drift use `extra` `forbid`, and `strict` mode rejects coercions such as `'3'` to `3`.
- Settings precedence is init kwargs, then environment, then dotenv, then defaults. Unknown environment names are ignored, so a misspelled variable silently keeps the default, but an undefined key in the dotenv file raises under the default `extra` `forbid`.

**Reproduce:** Closed-book, define a `Protocol` plus a generic service, a boundary model with `extra` `forbid` and a `StrictInt` field, and settings with a prefix. Show that `model_validate` coerces `'3'` in lax mode but `strict` rejects it with `int_type`, that an `extra` field raises `extra_forbidden`, and that init beats env beats default.

**Traps**

- `runtime_checkable` `isinstance` checks method presence only, not signatures. A sender with the wrong signature passes `isinstance` and fails later; keep static checking as the real gate.
- `parse_obj`, `.dict`, `.json` and `@validator` still run, so old tutorials look current. In Pydantic 2.14 they are deprecated shims whose `DeprecationWarning` stays hidden outside `__main__`, and some v1 calls now fail: `.json(indent=2)` raises `TypeError`. Use `model_validate`, `model_dump`, `model_dump_json` and `field_validator`.
- Expecting `extra` `forbid` to catch a misspelled environment variable. Unmatched environment names never reach validation (only undefined dotenv keys raise), so test precedence with a wrong-name variable and watch the default survive.

**Practice**

- [AlgoMaster Exercise: Interfaces and Protocols](https://algomaster.io/learn/python/interfaces-protocols-exercise) - Exercises 1 to 5 on the exercise page, with the lesson sections Structural vs Nominal Typing and Dependency Injection Contracts. Complete the set for recall, then add a self-built check: a strict boundary model with forbid-extra rejects extra fields and wrong types, and settings precedence init beats env beats default holds.

**Stop when:** You define a `Protocol` plus generic service without transport imports, validate good, malformed and extra-field payloads with v2 calls only, and demonstrate init beats env beats default with a misspelled variable keeping the default.

<details>
<summary>Self-test</summary>

1. A field `x: int` receives `'123'` in lax mode and under `strict` `True`. What happens in each?
   - Lax coerces to `123`. Strict raises with type `int_type`. Verified on Pydantic 2.14 with CPython 3.14.
2. A payload carries an `extra` key `y`. How do default and `extra` `forbid` models differ?
   - Default ignores `y` and dumps without it. Forbid raises `extra_forbidden` at `('y',)`.
3. What are the v2 replacements for `parse_obj` and `.dict`, and why do the old names matter?
   - `model_validate` and `model_dump`. The old names still run as deprecated shims that forward to the v2 methods, so legacy code looks current until v3 removes them, and some v1 signatures already fail: `.json(indent=2)` raises `TypeError`. Verified on Pydantic 2.14.1.
4. Init passes port 9000, env sets 8080, default is 8000. Which wins, and what if the env name is misspelled?
   - Init wins with 9000. A misspelled name is ignored and the default 8000 applies. Verified with pydantic-settings on CPython 3.14.

</details>

#### U2. JSON, JSONL, CSV, columnar formats and bounded ingestion

**About 4 h** · **Target:** Implement

Topics: JSON, JSONL and CSV encoding, null and numeric semantics; Bounded-memory ingestion and malformed-row quarantine; Columnar layout, Arrow and Parquet basics

Ingestion is where outside bytes become inside facts. Unbounded reads, lenient parsing and lossy conversions turn one bad row into silent data loss. Explicit formats with quarantine keep the bad row visible and the good rows intact.

**You can now**

- Implement bounded-memory ingestion for JSONL and CSV with malformed-row quarantine and deterministic normalized output.
- Convert normalized records to Parquet with pyarrow and test types, nulls, ordering and column projection.
- Defend the format choice for one interchange case against a credible alternative, including null and numeric semantics.

**Study**

1. [Serialization: JSON, JSON Lines and `gzip`](https://github.com/stas00/python-cookbook/blob/master/content/README.md#json) (Stas' Python Cookbook - data and interfaces) - JSON: `dumps` and `loads` options, the JSON Lines write and read pattern and the `DataclassEncoder`; `gzip`: the text-mode `open` pattern. Depth: The cookbook reads JSON Lines into a list with a comprehension. For bounded memory, iterate the file and parse one line at a time. Skip XML and Archives here.
2. [CSV and the `pickle` warning](https://github.com/stas00/python-cookbook/blob/master/content/README.md#csv) (Stas' Python Cookbook - data and interfaces) - CSV: always the `csv` module, files opened with `newline` set to the empty string, `csv.reader`, `DictReader` and `csv.writer`. Pickle: Never unpickle untrusted data, it can execute arbitrary code.
3. [Working with JSON: JSON Lines and error handling](https://algomaster.io/learn/python/json-files) (AlgoMaster Python - interfaces, generics and data files) - JSON Lines: One Record Per Line; Handling Errors: `JSONDecodeError`; JSON Types vs Python Types including the `null` to `None` row.
4. [Working with CSV: `newline`, readers and dialects](https://algomaster.io/learn/python/csv-files) (AlgoMaster Python - interfaces, generics and data files) - Why Not Just Split on Commas; Why You Always Need `newline` set to the empty string; `csv.DictReader` and `csv.DictWriter`; Quoting Constants.
5. [Reading and Writing Single Files](https://arrow.apache.org/docs/python/parquet.html#reading-and-writing-single-files) (PyArrow Parquet read and write docs) - Reading and Writing Single Files (`write_table`, `read_table`, the `columns` argument for subset reads); Finer-grained Reading and Writing (`ParquetFile`); Inspecting the Parquet File Metadata; Data Type Handling.

**Focus**

- Row formats (JSON, JSONL, CSV) stream one record at a time. Parquet is columnar: a column-subset read skips the rest of the file.
- Open CSV files with `newline` set to the empty string and let the `csv` module own line endings. Otherwise `newline` translation rewrites line breaks inside quoted fields, and Windows writes gain blank rows.
- Parse one JSONL line at a time and quarantine `JSONDecodeError` with its line number, or one truncated line kills the whole file.
- `NaN` and `Infinity` are Python extensions, not valid JSON. In Arrow, `NaN` is a float value and `None` is `null`: a table built with `from_pylist` or `from_pydict` keeps both through Parquet, while pandas folds them together (`from_pandas` writes `NaN` as `null`, `to_pandas` reads `null` as `NaN`).

**Reproduce:** Closed-book, stream a mixed input with good rows, a truncated JSON line, and a quoted CSV field holding a comma and a newline, into quarantined normalized output in bounded memory. Convert it to Parquet with `Table.from_pylist` and assert schema types, `None` nulls preserved, `NaN` distinct from `null`, and a column-subset read.

**Traps**

- Splitting CSV on commas. Quoted commas, doubled quotes and embedded newlines need the `csv` module; the cookbook states this as a rule.
- Round-tripping through pandas. `from_pandas` writes `NaN` as `null` and `to_pandas` reads `null` back as `NaN`, so a missing value and a failed computation become the same thing. Build the Arrow table with `from_pylist` or `from_pydict` and assert `null_count`.
- `list(reader)` or `json.load` on a large file. Materializing the whole input removes the memory bound; iterate and write incrementally.

**Practice**

- [PyArrow Parquet docs: single-file read and write round trip](https://arrow.apache.org/docs/python/parquet.html#reading-and-writing-single-files) - Reading and Writing Single Files: the `write_table` and `read_table` round trip with a `columns` subset read. The docs build their table with `from_pandas`, which turns `NaN` into `null`. Build yours from the quarantined records with `from_pylist`, then assert schema, `null_count`, a `NaN` that survives, ordering and the projected `columns`.

**Stop when:** A mixed good and malformed JSONL and CSV input streams to quarantined normalized output without materializing the file, and the Parquet round trip asserts types, nulls and ordering.

<details>
<summary>Self-test</summary>

1. What does `json.loads('NaN')` return, and is it valid JSON?
   - Python returns `nan`, but `NaN` is not valid JSON. Guard reads with `parse_constant` and write with `allow_nan` `False`. Verified on CPython 3.14.
2. Why open CSV files with `newline` set to the empty string?
   - The `csv` module does its own line-ending handling. Without it, a quoted field holding \r\n reads back as \n, and on Windows every written row gains an extra \r that shows up as blank rows. Verified on CPython 3.14.
3. How do you bound memory on a large JSONL file with bad lines?
   - Iterate lines, parse one record at a time, and quarantine each `JSONDecodeError` with its line number. Never load the whole file.
4. After a Parquet round trip, what happens to `None` and `NaN`?
   - With a table built by `from_pylist`, `None` stays `null` and `NaN` stays `NaN` (`null_count` `1`), and a `columns` subset read works. Through pandas they merge: `from_pandas` writes `NaN` as `null`, and `to_pandas` reads `null` as `NaN`. Verified with pyarrow 26 and pandas 3.0 on CPython 3.14.

</details>

#### U3. Schema versions, compatibility and migrations

**About 4 h** · **Target:** Explain + Implement

Topics: Schema versions, compatibility and explicit migrations; Backward-compatible migration, mixed versions and rollback

Schemas change while old readers are still running. An additive field with a default keeps both directions working, while a rename without a transition breaks one side silently. Version policy plus a tested downgrade makes evolution boring.

**You can now**

- Derive the valid states of a versioned record across validation, quarantine, normalization and persistence.
- Design a backward-compatible schema change with explicit mixed-version behavior and a tested rollback.
- Classify DDL changes as compatible or breaking, and run a paired upgrade and downgrade on a scratch database.

**Study**

1. [Pydantic Extra data as a version policy](https://pydantic.dev/docs/validation/latest/concepts/models/#extra-data) (Official docs typed-service build path) - Extra data (`ignore`, `forbid`, `allow`): old readers drop, keep or reject fields added by newer writers, set through `model_config`.
2. [Pydantic Default values](https://pydantic.dev/docs/validation/latest/concepts/fields/#default-values) (Official docs typed-service build path) - Default values and Validate default values: a new field with a default lets old payloads validate against the new model.
3. [Tutorial: migration scripts, running migrations, downgrading](https://alembic.sqlalchemy.org/en/latest/tutorial.html#create-a-migration-script) (Alembic tutorial - migration scripts and downgrading) - Create a Migration Script (`revision`, `down_revision`, `upgrade`, `downgrade`); Running our First Migration and Running our Second Migration (`upgrade head`); Getting Information (`history --verbose`); Downgrading (`downgrade base`).
4. [Creating and Modifying Tables](https://algomaster.io/learn/sql-interview/creating-and-modifying-tables) (AlgoMaster SQL - selected route) - Constraints in DDL (primary and foreign keys, `UNIQUE`, `CHECK`, `DEFAULT`); `ALTER TABLE` (adding and dropping columns, changing types, adding constraints); `DROP TABLE`, `TRUNCATE` and `DELETE`.

**Focus**

- Additive changes (a new optional field, a new table) keep old readers working. Renames, type narrows and new required fields break one direction until every reader upgrades.
- Every migration ships `upgrade` and `downgrade` together, and `downgrade` is executed, not just written. An empty `downgrade` makes rollback untested.
- Alembic orders by `down_revision` chains, not file names. `history --verbose` shows the chain and `current` shows where the database stands.
- Old payloads must validate against new models with defaults filling new fields, and new payloads must not crash old readers; the `extra` policy decides whether unknowns drop, stay or raise.

**Reproduce:** Closed-book, evolve a v1 record model to v2 with one optional field: validate a v1 payload against v2 and a v2 payload against v1, stating what fills and what drops. Then write one Alembic revision with `upgrade` and `downgrade` and run `upgrade head`, `downgrade base`, `upgrade head` on a scratch database.

**Traps**

- `extra` `forbid` on a versioned reader. It rejects payloads from newer writers on unknown fields; versioned boundaries usually `ignore` or `allow` and stage the unknowns.
- A new required field with existing rows. Old writers cannot supply it, and bulk backfill needs a default or a two-step migration.
- Renaming a column while mixed versions read it. Old readers query the old name, so expand (add new, dual-write, migrate readers) before contracting (drop old).

**Practice**

- [Alembic tutorial: first migration, second migration, `downgrade` round trip](https://alembic.sqlalchemy.org/en/latest/tutorial.html) - Running our First Migration; Running our Second Migration; Downgrading. Run on a scratch PostgreSQL 18 database (a throwaway `postgres:18` container works). Assert `alembic current` and `history --verbose` show a clean chain, and that reads succeed after each step.

**Stop when:** Both validation directions pass with stated fill and drop behavior, three DDL changes are classified with reasons, and `head` to `base` to `head` succeeds on a scratch database.

<details>
<summary>Self-test</summary>

1. A v2 model adds `nickname` with a default. Does a v1 payload validate, and does a v1 model accept a v2 payload under default settings?
   - Yes to both: the default fills `nickname`, and default `extra` `ignore` drops it on the old reader. Verified on Pydantic 2.14.
2. What orders two Alembic revisions, and how do you inspect the chain?
   - `down_revision` links order them, not filenames. `history --verbose` shows parents and `current` shows the database position.
3. Name one DDL change that is safe under mixed versions and one that must wait.
   - Adding a nullable column is safe. Renaming or dropping a column in use must wait until all readers upgrade.
4. Why run `downgrade base` and then `upgrade head` when testing?
   - It executes the rollback path and proves re-upgrade reaches the same schema. An unwritten or unrun `downgrade` is an untested promise.

</details>

#### U4. Relational modeling, joins, aggregation and window functions

**About 6 h** · **Target:** Implement

Topics: Tables, keys, constraints and normalized relationships; Joins, aggregation, CTEs and window functions

ML features and labels come from joins and aggregations. A misplaced `WHERE` turns an outer join inner, and a `GROUP BY` at the wrong grain duplicates or drops rows. Predicting counts before running is the skill that prevents silent training-data corruption.

**You can now**

- Design a normalized schema with primary, foreign, `unique` and `check` constraints, and state which anomaly each normalization move fixes.
- Predict row counts and duplicate behavior of multi-join queries before executing, including `LEFT JOIN` with `WHERE` and junction fan-out.
- Write aggregation with `HAVING`, CTEs and window functions, and distinguish window row identity from `GROUP BY` collapsing.

**Study**

1. [The Relational Model](https://algomaster.io/learn/sql-interview/relational-model) (AlgoMaster SQL - selected route) - `NULL`: The Missing Value Problem (`NULL` Comparisons, Three-Valued Logic, `NULL` in Practice); Relationships Between Tables (one-to-many, many-to-many, self-referencing).
2. [Keys and Constraints](https://algomaster.io/learn/sql-interview/keys-and-constraints) (AlgoMaster SQL - selected route) - Primary Keys; Natural vs Surrogate Keys; Foreign Keys with `ON DELETE`; Composite Keys; Column Constraints (`UNIQUE`, `NOT NULL`, `CHECK`, `DEFAULT`).
3. [Normalization](https://algomaster.io/learn/sql-interview/normalization) (AlgoMaster SQL - selected route) - The Problem: Data Anomalies (update, insert, delete); First, Second and Third Normal Form with The Practical Test for 3NF; Boyce-Codd Normal Form; The Quick Test.
4. [Entity-Relationship Modeling](https://algomaster.io/learn/sql-interview/entity-relationship-modeling) (AlgoMaster SQL - selected route) - Cardinality: Many-to-Many (Extra Attributes on Junction Tables, Querying Through Junction Tables); From ER Diagram to Schema, Steps 1 to 5 and Common Translation Mistakes.
5. [Introduction to Joins](https://algomaster.io/learn/sql-interview/introduction-to-joins) (AlgoMaster SQL - selected route) - Join Types Overview; Choosing the Right Join Type; Joining More Than Two Tables.
6. [`LEFT JOIN`](https://algomaster.io/learn/sql-interview/left-join) (AlgoMaster SQL - selected route) - Finding Unmatched Rows; `ON` vs `WHERE`: The Critical Difference; Common Patterns: Counting with Zeros and Default Values with `COALESCE`.
7. [`GROUP BY` and `HAVING`](https://algomaster.io/learn/sql-interview/group-by-and-having) (AlgoMaster SQL - selected route) - The `SELECT` Rule with MySQL's Relaxed `GROUP BY`; `HAVING`: Filtering Groups; `WHERE` vs `HAVING`; SQL Execution Order with `GROUP BY` and `HAVING`; `GROUP BY` with Joins: What Gets Grouped.
8. [Common Table Expressions](https://algomaster.io/learn/sql-interview/common-table-expressions) (AlgoMaster SQL - selected route) - CTE Syntax; Multiple CTEs; CTEs vs Subqueries vs Derived Tables; Materialization Behavior.
9. [Introduction to Window Functions](https://algomaster.io/learn/sql-interview/introduction-to-window-functions) (AlgoMaster SQL - selected route) - Window Functions vs `GROUP BY`; `PARTITION BY`; Combining `PARTITION BY` and `ORDER BY`; Default Frame Behavior.
10. [`ROW_NUMBER`](https://algomaster.io/learn/sql-interview/row-number) (AlgoMaster SQL - selected route) - Deduplication with `ROW_NUMBER`; Top-$`N`$ Per Group; `ROW_NUMBER` vs `RANK` vs `DENSE_RANK`.

**Focus**

- `NULL` never equals anything, not even `NULL`. Use `IS NULL` and `IS NOT NULL`; `COUNT(column)` skips nulls while `COUNT(*)` does not.
- `ON` filters before the outer join adds its nulls, `WHERE` filters after. A `WHERE` condition on the right table silently converts `LEFT JOIN` to `INNER JOIN`.
- `GROUP BY` grain decides counts: aggregate at the wrong grain and rows duplicate or vanish. `HAVING` filters groups after aggregation, `WHERE` filters rows before.
- Window functions keep row identity while `GROUP BY` collapses rows. `ROW_NUMBER` with `PARTITION BY` gives top-$`N`$ per group without losing the row.

**Reproduce:** Closed-book, on artists, tracks and streams tables: return every track with its stream count including zeros, per-artist totals with `HAVING`, and the top track per artist with `ROW_NUMBER`. Predict each row count before running.

**Traps**

- Selecting non-grouped columns under `GROUP BY`. PostgreSQL rejects them (`SQLSTATE 42803`) unless the table's primary key is grouped, while SQLite and relaxed-mode MySQL return a value from some row of the group; list exactly the grain.
- A surrogate primary key preventing logical duplicates. It does not; only a `UNIQUE` constraint on the natural key does.
- `COUNT(*)` when you mean `COUNT(column)`. The first counts null-extended outer-join rows, the second skips the nulls.

**Practice**

- [AlgoMaster Exercise - `LEFT JOIN`](https://algomaster.io/learn/sql-interview/left-join-exercise) - Exercise 1: every track title with stream count, zeros included, ordered by `stream_count` then title. Predict the zero-count rows before running.
- [AlgoMaster Exercise - `GROUP BY` and `HAVING`](https://algomaster.io/learn/sql-interview/group-by-and-having-exercise) - Exercise 2: one row per `album_id` with `track_count` and `total_seconds`. Add a `HAVING` variant that keeps only albums with more than two tracks.

**Stop when:** Your schema rejects a duplicate-email insert and a negative amount, and your join, `HAVING` and `ROW_NUMBER` queries return the predicted counts including zeros.

<details>
<summary>Self-test</summary>

1. Tracks `LEFT JOIN` streams with `WHERE` `streams.played_at > X`. Which tracks survive?
   - Only streamed tracks matching the filter: the `WHERE` removes null-extended rows and the join behaves inner. Move the filter to `ON` to keep all tracks.
2. 5 artists and 12 tracks, each track with one artist. How many rows does the inner join return, and what changes with a junction table?
   - 12 rows: each track matches exactly one artist. A many-to-many junction fans out: one track on two playlists yields two rows. Verified on PostgreSQL 18.6 with these sizes.
3. When do you use `HAVING` instead of `WHERE`?
   - To filter on aggregates after grouping, for example `COUNT(*) > 2`. `WHERE` cannot see aggregates.
4. How does `ROW_NUMBER` top-1 per group differ from `GROUP BY` with `max`?
   - `ROW_NUMBER` keeps the whole row including title and other columns. `GROUP BY` with `max` returns only the grouped columns plus the maximum.

</details>

#### U5. Transactions, isolation anomalies and ORM boundaries

**About 5 h** · **Target:** Explain + Measure

Topics: Transactions, isolation anomalies and concurrency-sensitive invariants; ORM identity maps, lazy loading and transaction boundaries

Concurrent writers share your tables. Without explicit transactions and a chosen isolation level, a retry or a second writer turns an invariant into a suggestion. The database prevents what you ask it to prevent, and nothing more.

**You can now**

- Explain commit, rollback, savepoints and the PostgreSQL isolation anomaly table, including where PostgreSQL exceeds the standard.
- Demonstrate one isolation anomaly or prevented anomaly on the live database at a named isolation level with the interleaving written out.
- Draw the ORM transaction boundary with `Session`, identity map and eager loading, and fix one $`N+1`$ with `selectinload`.

**Study**

1. [What Is a Transaction](https://algomaster.io/learn/sql-interview/what-is-a-transaction) (AlgoMaster SQL - selected route) - `BEGIN`, `COMMIT`, and `ROLLBACK`; Auto-Commit Mode; `SAVEPOINT` and Partial Rollback; Common Mistakes (Forgetting to `COMMIT` or `ROLLBACK`, Long-Running Transactions).
2. [ACID Properties](https://algomaster.io/learn/sql-interview/acid-properties) (AlgoMaster SQL - selected route) - Atomicity; Consistency; Isolation; Durability with Write-Ahead Logging (WAL) and What Durability Does Not Cover.
3. [PostgreSQL 3.4 Transactions](https://www.postgresql.org/docs/current/tutorial-transactions.html) (PostgreSQL transactions and EXPLAIN) - The bank transfer wrapped in `BEGIN` and `COMMIT`, then the `SAVEPOINT` and `ROLLBACK TO` example.
4. [Isolation Levels](https://algomaster.io/learn/sql-interview/isolation-levels) (AlgoMaster SQL - selected route) - Read Phenomena; The Four Isolation Levels; PostgreSQL vs MySQL Defaults; Choosing the Right Level.
5. [PostgreSQL 13.2 Transaction Isolation](https://www.postgresql.org/docs/current/transaction-iso.html) (PostgreSQL transactions and EXPLAIN) - Table 13.1 Transaction Isolation Levels (`READ UNCOMMITTED` behaves as `READ COMMITTED`, and `REPEATABLE READ` allows no phantom reads); 13.2.2 Repeatable Read Isolation Level (the snapshot taken at the first non-transaction-control statement, and `could not serialize access due to concurrent update`).
6. [Locking Mechanisms](https://algomaster.io/learn/sql-interview/locking-mechanisms) (AlgoMaster SQL - selected route) - Lock Granularity: Row-Level vs Table-Level; Explicit Row Locking: `SELECT FOR UPDATE`; `NOWAIT` and `SKIP LOCKED`; Pessimistic vs Optimistic Locking.
7. [Deadlocks](https://algomaster.io/learn/sql-interview/deadlocks) (AlgoMaster SQL - selected route) - How Deadlocks Form; Deadlock Detection (PostgreSQL); Prevention: Consistent Lock Ordering.
8. [MVCC](https://algomaster.io/learn/sql-interview/mvcc) (AlgoMaster SQL - selected route) - PostgreSQL's Approach: Heap-Based MVCC (`xmin` and `xmax`, Row Visibility Rules, Dead Tuples and `VACUUM`); Snapshots and Isolation Levels; Why MVCC Doesn't Prevent Lost Updates.
9. [SQLAlchemy `Session` Basics](https://docs.sqlalchemy.org/en/21/orm/session_basics.html#what-does-the-session-do) (SQLAlchemy 2.1 documentation - select, Session and eager loading) - What does the `Session` do?; Framing out a `begin` / `commit` / `rollback` block; Flushing; Expiring / Refreshing; Is the `Session` a cache?
10. [SQLAlchemy Relationship Loading Techniques](https://docs.sqlalchemy.org/en/21/orm/queryguide/relationships.html#lazy-loading) (SQLAlchemy 2.1 documentation - select, Session and eager loading) - Lazy Loading and Preventing unwanted lazy loads using `raiseload`; Joined Eager Loading; Select IN loading; What Kind of Loading to Use?

**Focus**

- PostgreSQL has three real levels: `READ UNCOMMITTED` behaves as `READ COMMITTED`, and `REPEATABLE READ` blocks phantom reads, which is stronger than the standard requires.
- `REPEATABLE READ` takes its snapshot at the first non-transaction-control statement. An `UPDATE` of a row that another transaction changed and committed since then raises `could not serialize access` (`SQLSTATE 40001`), and the application retries the whole transaction.
- The `Session` is the ORM transaction boundary plus an identity map: one object per primary key. Touching lazy relationships after commit issues new SELECTs or fails outside a session.
- `SAVEPOINT` discards part of a transaction while keeping the rest. Forgetting `COMMIT` leaves an idle transaction that holds locks and bloats the database.

**Reproduce:** Closed-book, run the two-session interleaving on PostgreSQL 18: session A begins `REPEATABLE READ` and reads balance 100; session B updates to 200 and commits; session A re-reads (still 100), commits, and reads 200. State the isolation level, the anomaly prevented, and the retry rule.

**Traps**

- `REPEATABLE READ` equals serializable. It does not: serialization anomalies are still possible, and only `SERIALIZABLE` plus retry logic on `SQLSTATE 40001` prevents them.
- No retry loop on serialization failures. Concurrent writers make these routine, not exceptional; abort and rerun the whole transaction.
- Touching relationships after session close is free. Lazy loading fires one `SELECT` per parent ($`N+1`$) inside a session and fails outside it; use `selectinload` or `joinedload` and guard with `raiseload`.

**Practice**

- [PostgreSQL tutorial transactions: bank transfer with savepoints](https://www.postgresql.org/docs/current/tutorial-transactions.html) - Section 3.4: the transfer with `BEGIN`, `COMMIT` and `ROLLBACK` plus the savepoint example. Replay on a scratch PostgreSQL 18 database (a throwaway `postgres:18` container works): wrap a three-statement transfer with one bad statement, roll back, and show balances unchanged. Then run the reproduce interleaving, record both reads, and have session A update the row to see the `40001` error.

**Stop when:** The transfer rollback leaves balances unchanged, the `REPEATABLE READ` interleaving prints 100 then 200 and an update in session A raises `40001`, and the $`N+1`$ conversion shows $`N+1`$ statements before and 2 after.

<details>
<summary>Self-test</summary>

1. In the reproduce interleaving, what does session A read second, and why?
   - 100. `REPEATABLE READ` holds the snapshot from the first statement of the transaction. After commit it reads 200. Verified on PostgreSQL 18.6.
2. Which cells of Table 13.1 differ between the SQL standard and PostgreSQL?
   - PostgreSQL `READ UNCOMMITTED` behaves as `READ COMMITTED`, and `REPEATABLE READ` has no phantom reads. Both guarantees are stronger than the standard minimums.
3. A `REPEATABLE READ` update raises `could not serialize access due to concurrent update`. What does the application do?
   - Roll back and retry the whole transaction from the beginning. The retried transaction sees the committed change in its new snapshot.
4. Loading $`N`$ parents then touching children issues how many statements under lazy loading, and after `selectinload`?
   - $`N+1`$ under lazy loading. With `selectinload`, one for the parents plus one `IN` query per 500 parent keys: 2 for 10 parents, 4 for 1200. Verified on SQLAlchemy 2.1.4.

</details>

#### U6. Indexes, selectivity and query plans

**About 4 h** · **Target:** Explain + Measure

Topics: Indexes, selectivity, cardinality and query plans

A missing index turns a lookup into a full scan, and a wrong index taxes writes without helping reads. Plans show what the database actually does, and selectivity decides which design wins on your data.

**You can now**

- Explain B-tree versus sequential access, selectivity, and leftmost-prefix, partial and covering index choices.
- Read `EXPLAIN` and `EXPLAIN ANALYZE` plans, compare estimated and actual rows, and name the scan and join strategy.
- Measure two index designs on controlled data and explain the selectivity-dependent result with table size and `ANALYZE` state.

**Study**

1. [How Indexes Work](https://algomaster.io/learn/sql-interview/how-indexes-work) (AlgoMaster SQL - selected route) - How Databases Find Rows Without an Index; B-Tree Indexes (equality, range, sorted output); Hash Indexes; Index Overhead: The Trade-offs; Selectivity: When Indexes Actually Help; Common Mistakes.
2. [Composite, Partial and Covering Indexes](https://algomaster.io/learn/sql-interview/composite-partial-covering-indexes) (AlgoMaster SQL - selected route) - Composite Indexes (The Leftmost Prefix Rule, Column Order Guidelines); Partial Indexes; Covering Indexes with `INCLUDE`; skim `GIN` and `GiST` Indexes.
3. [`EXPLAIN` and Execution Plans](https://algomaster.io/learn/sql-interview/explain-and-execution-plans) (AlgoMaster SQL - selected route) - `EXPLAIN` vs `EXPLAIN ANALYZE`; Reading a Plan: Cost Fields; Scan Types (sequential, index, index only, bitmap); Join Strategies; Identifying Bottlenecks.
4. [Query Optimization and Anti-Patterns](https://algomaster.io/learn/sql-interview/query-optimization-anti-patterns) (AlgoMaster SQL - selected route) - Anti-Patterns 1 to 4: Functions on Indexed Columns, Implicit Type Conversions, `SELECT *` in Production, `OR` Conditions That Prevent Index Usage; Anti-Pattern 6: The $`N+1`$ Query Problem.
5. [PostgreSQL 14.1 Using `EXPLAIN`](https://www.postgresql.org/docs/current/using-explain.html#USING-EXPLAIN-BASICS) (PostgreSQL transactions and EXPLAIN) - 14.1.1 `EXPLAIN` Basics: the sequential-scan cost as pages times `seq_page_cost` plus rows times `cpu_tuple_cost`, plus `cpu_operator_cost` per row for a `WHERE` check; 14.1.2 `EXPLAIN ANALYZE`; 14.1.3 Caveats.

**Focus**

- High-selectivity equality predicates gain most. Low-selectivity filters and tiny tables stay on sequential scans, and every index taxes writes.
- Equality columns come before range columns in composite indexes, and only the leftmost prefix is usable. A range column first wastes the rest.
- `EXPLAIN` shows estimates and planner costs. `EXPLAIN ANALYZE` executes and shows actual rows, loops, buffers and timing. Costs are planner units, not milliseconds.
- Plans depend on statistics. State table size and `ANALYZE` state with every claim, and distrust toy-table plans.

**Reproduce:** Closed-book, on a 5000-row ANALYZEd table of 32 pages with default cost settings: derive the sequential-scan cost for one equality filter from pages and rows before running `EXPLAIN`, add an index on the filter column, and compare `EXPLAIN (ANALYZE, BUFFERS)` when the matching rows are scattered across the table and when they are clustered.

**Traps**

- Cost numbers are milliseconds. They are abstract planner units; only the `EXPLAIN ANALYZE` `Execution Time` is measured, on your hardware and cache state.
- Wrapping an indexed column in a function. The predicate becomes unsargable and the plan falls back to a scan; rewrite the predicate or index the expression.
- One index per column. Leftmost-prefix rules, `OR` conditions and implicit type conversions defeat single-column indexes; check the plan, not the schema.

**Practice**

- [Measured plan improvement on a scratch database](https://www.postgresql.org/docs/current/using-explain.html#USING-EXPLAIN-ANALYZE) - 14.1.2 `EXPLAIN ANALYZE`: before and after plans with `BUFFERS` for a selective filter plus a join from your service schema. Use a scratch PostgreSQL 18 database (a throwaway `postgres:18` container works) and a table over 1000 rows, run `ANALYZE`, and record pages, row counts, both plans, `Heap Blocks` and both execution times. Fix one anti-pattern from the lesson (function-wrapped column or SELECT star) and show the plan change.

**Stop when:** You show before and after `EXPLAIN ANALYZE` with table size and `ANALYZE` state, explain why the selective case improved, and name one case on the same tables where the index does not help.

<details>
<summary>Self-test</summary>

1. A 5000-row ANALYZEd table of 32 pages filters `user_id = 7` with 100 matches. Where does the sequential scan's cost of 94.50 come from, and what does an index on `user_id` change?
   - 32 pages times 1.0 plus 5000 rows times (0.01 + 0.0025) = 94.50. With the matches scattered over every page, the plan becomes a bitmap heap scan (cost 5.06 to 38.31) that still reads all 32 heap pages; with them clustered it is an index scan touching 4 buffers. Measured on PostgreSQL 18.6 with default costs.
2. A filter has equality on `status` and a range on `created_at`. How do you order the composite index?
   - Equality first, then range: `(status, created_at)`. Range first wastes the second column under the leftmost rule.
3. `EXPLAIN` estimates 10 rows but `ANALYZE` shows 4500 actual. What do you do first?
   - Run `ANALYZE` and re-check. Stale or missing statistics is the first suspect before rewriting the query.
4. Why can an index slow a workload down?
   - Every write maintains each index, and unused or duplicate indexes cost storage and write amplification without speeding any read.

</details>

#### U7. Layer boundaries and command-line contracts

**About 3 h** · **Target:** Implement

Topics: Domain, service, transport and persistence boundaries; Command-line inputs, output streams, exit codes and errors

Providers change and transports multiply. When the domain depends on interfaces instead of concrete clients, a database or notifier swap stays local. When CLI and HTTP share one service layer, one fix covers both surfaces.

**You can now**

- Split a service into domain, repository and notifier owners with dependency inversion, and swap fakes without touching the service.
- Expose one service layer through a CLI with typed arguments, `stdout` data, `stderr` errors and nonzero exit on failure.
- Keep transport and persistence types out of the domain core across both surfaces.

**Study**

1. [Interfaces](https://algomaster.io/learn/lld/interfaces) (AlgoMaster Low-Level Design - one rehearsal) - 1. What is an Interface?; 2. Key Properties of Interfaces; 4. Practical Example: Notification Service.
2. [Dependency Inversion Principle](https://algomaster.io/learn/lld/dip) (AlgoMaster Low-Level Design - one rehearsal) - 1. The Problem: A Tightly Coupled EmailService (Why Switching Providers Is Painful); 3. Applying DIP, steps 1 to 4; 4. Common Pitfalls While Applying DIP, especially No Actual Injection.
3. [Bigger Applications: `APIRouter` layering](https://fastapi.tiangolo.com/tutorial/bigger-applications/#apirouter) (FastAPI tutorial) - `APIRouter`; Dependencies; Include an `APIRouter` with a custom prefix, tags, responses, and dependencies. Routers stay thin and the service owns the rules.
4. [`argparse` and `subprocess` conventions](https://github.com/stas00/python-cookbook/blob/master/content/README.md#argparse--the-built-in-cli-parser) (Stas' Python Cookbook - data and interfaces) - The `argparse` built-in CLI parser block (positionals, flags, `type`, `nargs`, `choices`); Replaying the exact command line; then Subprocess and Shell Integration for `returncode`, `stdout` and `stderr`. Depth: Skip the click, typer and fire pointers and the signal-handling block.

**Focus**

- The domain service takes repository and notifier interfaces in its constructor. Constructing concrete clients inside the service welds the boundary shut.
- One sentence per class without and. A class that validates, prices, stores and notifies is four classes wearing one name.
- `argparse` types and `choices` validate at the edge, and a bad argument already exits `2` with usage on `stderr`. Keep the same rule for domain failures: `stdout` carries data, `stderr` carries diagnostics, and failure exits nonzero with `stdout` left clean.
- CLI and HTTP handlers call the same service function and map the same domain errors to the same outcomes.

**Reproduce:** Closed-book, split an order processor into service, inventory and notifier with injected fakes, and drive it from a CLI: show a successful order on `stdout` with exit `0`, and a bad choice plus missing input on `stderr` with nonzero exit.

**Traps**

- Business rules migrating into route handlers or CLI commands. Two surfaces then disagree; keep rules in the service and handlers thin.
- Data mixed with logs on `stdout`. Pipes and files capture `stdout`, so diagnostics go to `stderr` or downstream parsing breaks.
- Exit code always `0`. A failed command that reports success poisons scripts and supervision; assert nonzero on every failure path.

**Practice**

- [AlgoMaster Refactor Order Processing](https://algomaster.io/practice/low-level-design/refactor-order-processing) - Full problem: keep the public API (`placeOrder`, `stockOf`, `orderCount`, `confirmations`) while moving stock into `InventoryManager` and confirmation history into `NotificationService`, both injectable through the `OrderProcessor` constructor; rejected orders leave stock, order IDs and `confirmations` untouched. Solve it from the Python starter, then reuse the split in your service: one test swaps both collaborators for fakes without editing `OrderProcessor`.

**Stop when:** The service file imports no concrete adapter, the CLI drives success and two failure modes with correct streams and exits, and the fakes swap without service edits.

<details>
<summary>Self-test</summary>

1. How do you swap the database for a fake without touching the service?
   - The service depends on a repository interface and receives it by construction. The test constructs the service with the fake.
2. Where do `stdout` and `stderr` go in a correct CLI, and what exits nonzero?
   - Data on `stdout`, diagnostics on `stderr`. Every failure path exits nonzero with `stdout` clean.
3. A route handler starts checking stock levels directly. What broke?
   - The layer boundary: stock rules belong to the service and repository, and the handler should call the service and map its errors.

</details>

#### U8. HTTP APIs, pagination, streaming and idempotency

**About 5 h** · **Target:** Explain + Implement

Topics: HTTP methods, validation, status codes, pagination and streaming; Idempotency keys, duplicate replay and side-effect ownership

Retries are normal and duplicates are corruption. Validation plus status codes make failures legible, pagination bounds the response, and idempotency keys make a retried request safe to repeat.

**You can now**

- Expose the service over HTTP with request validation, response filtering, correct status codes and typed errors.
- Ship capped `limit`-`offset` pagination and one streaming endpoint with bounded pages.
- Implement idempotency keys so retried POSTs return the stored response with a single side effect, and mismatched replays error.

**Study**

1. [Request Body](https://fastapi.tiangolo.com/tutorial/body/#create-your-data-model) (FastAPI tutorial) - Create your data model; Declare it as a parameter; Results; Use the model.
2. [Handling Errors](https://fastapi.tiangolo.com/tutorial/handling-errors/#use-httpexception) (FastAPI tutorial) - Use `HTTPException`; Install custom exception handlers; Override request validation exceptions.
3. [Response Model](https://fastapi.tiangolo.com/tutorial/response-model/#return-the-same-input-data) (FastAPI tutorial) - Return the same input data (the leak); Add an output model; Return Type and Data Filtering.
4. [Response Status Code](https://fastapi.tiangolo.com/tutorial/response-status-code/#changing-the-default) (FastAPI tutorial) - Changing the default, with `201` for creates; Shortcut to remember the names.
5. [Query Parameters: `skip` and `limit`](https://fastapi.tiangolo.com/tutorial/query-params/#defaults) (FastAPI tutorial) - Defaults: `skip` `0`, `limit` `10` and the slice.
6. [Numeric validations for a page cap](https://fastapi.tiangolo.com/tutorial/path-params-numeric-validations/#number-validations-greater-than-and-less-than-or-equal) (FastAPI tutorial) - Number validations: greater than and less than or equal (`ge` and `le` work the same on `Query`, which is how `limit` gets a cap).
7. [Stream JSON Lines](https://fastapi.tiangolo.com/tutorial/stream-json-lines/#stream-json-lines-with-fastapi) (FastAPI tutorial) - Stream JSON Lines with FastAPI: yield items from a function returning `AsyncIterable[Item]` (added in FastAPI 0.134.0); Non-async path operation functions; No Return Type.
8. [Idempotent requests](https://docs.stripe.com/api/idempotent_requests) (Stripe idempotent requests) - `Idempotency-Key` header with V4 UUID keys up to 255 characters; for API v1 the status code and body are saved once endpoint execution begins and replayed on retry, including `500`s, while validation failures and concurrent conflicts save nothing; parameter-mismatch errors; keys on `POST`, never `GET` or `DELETE`; keys pruned after at least 24 hours.

**Focus**

- One Pydantic model per request, one output model per response. Invalid bodies fail with `422` before any business logic runs.
- The output model strips secrets: returning the input model leaks fields. Create returns `201`, unknown ids return `404` with the `detail` envelope.
- Defaults alone do not bound a page: a client can still send `limit=1000000`. Cap it with `Query(le=...)` so oversized requests fail with `422`. Streams yield items under a declared `AsyncIterable[Item]` return type so validation and docs still apply.
- The idempotency ledger stores, per key, the endpoint, a hash of the params and the saved response. A replay with the same hash returns the saved response; the same key with a different hash errors. Keys belong on `POST`: `GET` and `DELETE` are idempotent by definition.

**Reproduce:** Closed-book, build a create endpoint with an output model, a capped paged list and an `idempotency-key` ledger: show `201` with secrets stripped, `422` on a bad body and on an oversized `limit`, `404` on an unknown id, a bounded page slice, and a double `POST` with one key producing one stored object.

**Traps**

- Returning the input model. Extra fields and secrets serialize to the client; a separate output model filters them, verified with `TestClient` on FastAPI 0.143.
- Same idempotency key with new params silently accepted. Compare params and return a conflict, or a retry becomes an overwrite.
- Check-then-insert on the ledger. Two concurrent first attempts both miss the lookup and both run the side effect; claim the key with a unique insert first, and answer a concurrent duplicate with a retryable conflict.

**Practice**

- [FastAPI tutorial Testing: extended example](https://fastapi.tiangolo.com/tutorial/testing/#testing-extended-example) - Testing extended example: extended app file plus extended testing file, Run it. In that style, write replay, mismatch and oversized-limit tests for your keyed endpoint plus a pagination slice test, swapping the key store with `app.dependency_overrides` (Advanced User Guide: Testing Dependencies with Overrides).

**Stop when:** `TestClient` shows `201` filtered, `422` on a bad body and an oversized `limit`, the `404` `detail` envelope, a bounded page, and a keyed double `POST` with one side effect plus a mismatch conflict.

<details>
<summary>Self-test</summary>

1. A `POST` body misses a required field. What status, and when does business logic run?
   - `422` from validation. Business logic never runs. Verified with `TestClient` on FastAPI 0.143.
2. A client `POST`s twice with the same key after a network timeout. How many objects exist and what does the second response carry?
   - One object. The second response replays the saved status code and body. Stripe saves once endpoint execution begins, so a saved `500` replays too, while a request that failed validation saves nothing and can be retried.
3. The same key arrives with different params. What happens?
   - The server errors on the mismatch instead of applying the second params.
4. `GET /items` would return 100000 rows. What breaks and what is the fix?
   - Memory, latency and client parsing break. Page with `skip` and `limit` and cap `limit` with `Query(le=...)`: a default alone does not stop `limit=1000000`. Or stream JSON Lines with a declared iterable type. Verified on FastAPI 0.143.

</details>

### Mini-project: One run service behind a CLI and an HTTP API, on PostgreSQL

**About 12 to 16 hours.** Turn `taskrunner` into a service with one service layer behind a CLI and an HTTP API on PostgreSQL. Version the payload, migrate the schema both ways, and prove transaction, isolation and idempotency behavior with tests.

1. Write `RunService` against a `RunStore` protocol with an in-memory fake for unit tests, validate the boundary model strictly, and test configuration precedence with the AlgoMaster Interfaces and Protocols exercise as reference.
2. Add a batch import that streams JSON Lines or CSV, quarantines malformed rows with line numbers, and writes accepted rows to Parquet with round-trip type and null checks.
3. Migrate the schema with Alembic through an upgrade, downgrade and re-upgrade round trip on a scratch database, and test the versioned payload in both directions following the Alembic tutorial downgrade round trip.
4. Debit credits and insert the run in one transaction with a rollback test, then reproduce a serialization anomaly under `REPEATABLE READ` with a bounded retry, following the PostgreSQL transactions tutorial.
5. Predict each read query's row count before running it, then compare the listed filter's plan before and after adding its index and name one query the index does not help, using the AlgoMaster `LEFT JOIN` and `GROUP BY` exercises as reference.
6. Serve the same service through a CLI and a FastAPI app over the untouched service layer, testing the status-code contract, the capped page and store swapping with the FastAPI tutorial Testing extended example.
7. Make submission idempotent with an `Idempotency-Key` ledger claimed in the same transaction as the debit, and prove a replay stores one run while a mismatched body is rejected.

**Deliverables**

- The service package: `RunService`, the fake and PostgreSQL stores, the CLI and the FastAPI app.
- Alembic revisions with the round-trip transcript and both-directions payload tests.
- Transaction, isolation, idempotency and import tests with quarantine file, plans and predictions.

**Checks**

- rubric: Self-grade with the rubric below.

| Criterion | Pass | Strong |
| --- | --- | --- |
| One service layer | The CLI and HTTP paths call the same service, the service module stays transport-free, and both stores pass the suite. | One parametrized suite runs every service test against the fake and the PostgreSQL store. |
| Boundaries and evolution | Malformed, extra-field and cross-version payloads are rejected with field-level errors, and the migration round trip succeeds. | The write-up classifies each schema change as additive or breaking and names which old clients keep working. |
| Transaction behavior | The failed debit leaves credits and run count unchanged, and the anomaly test retries to the correct balance. | The retry loop is also tested with an injected serialization failure and stops clearly at its limit. |
| HTTP contract and idempotency | Created, validation-error, not-found and capped-page behavior hold, and a keyed double submission stores one run. | A same-key different-body request is rejected, and a replay returns the stored response unchanged. |
| Data evidence | The import quarantines malformed rows with line numbers without loading the whole file, and each query matches its predicted count. | The plan comparison states table size and buffers, and explains the query the index does not help. |

Feeds into: The typed installable service through CLI and HTTP with schema, migration, transaction and idempotency tests; its database becomes the readiness check in operations.

### Resource route

- **Primary - Course:** [Official docs typed-service build path](https://pydantic.dev/docs/validation/latest/concepts/models/) - Build one record service in this order: structural protocols and generics; Pydantic models, validators, strict mode, serialization and settings; FastAPI request bodies, dependencies, errors and tests; then PostgreSQL transactions and EXPLAIN. Replay valid, malformed, duplicate and previous-schema requests through CLI and HTTP.
- **Required - Course:** [AlgoMaster SQL - selected route](https://algomaster.io/learn/sql-interview/course-roadmap) - Study SQL Foundations, Querying Data, Joins, Subqueries and CTEs, Window Functions, DDL, DML and Views, Performance Optimization, Transactions and Concurrency, and Data Modeling. Stop when the service queries and transaction tests pass.
- **Required - Reference:** [PostgreSQL transactions and EXPLAIN](https://www.postgresql.org/docs/current/tutorial-transactions.html) - Use the transaction tutorial and EXPLAIN guide to demonstrate commit, rollback, one isolation anomaly or prevented anomaly, and a measured plan improvement on the database actually used.
- **Support - Implementation:** [FastAPI tutorial](https://fastapi.tiangolo.com/tutorial/) - Use Request Body, Dependencies, Handling Errors and Testing to expose the same service layer through HTTP. Keep framework models outside the domain core and preserve the same error semantics as the CLI.
- **Support - Practice:** [AlgoMaster Low-Level Design - one rehearsal](https://algomaster.io/learn/lld/course-roadmap) - Use one fitting design prompt to rehearse interface contracts, dependency direction and failure ownership. Treat the review as feedback, then verify behavior with your own tests.
- **Support - Reference:** [Stas' Python Cookbook - data and interfaces](https://github.com/stas00/python-cookbook/blob/master/content/README.md) - Use Serialization and Deserialization plus Environment and Arguments for focused implementation help. Compare JSON, JSONL, CSV and compressed data, and never use pickle for untrusted interchange.
- **Support - Course:** [AlgoMaster Python - interfaces, generics and data files](https://algomaster.io/learn/python/course-roadmap) - Use Interfaces and Protocols plus Generic Types for structural typing, and Working with JSON plus Working with CSV for JSONL, error handling, `newline` and `DictReader` behavior. Lesson quizzes check recall; implementation is verified with your own scripts.
- **Reference - Reference:** [SQLAlchemy 2.1 documentation - select, Session and eager loading](https://docs.sqlalchemy.org/en/21/tutorial/index.html) - Use the `select()` tutorial for 2.x query style, `Session` basics for the transaction boundary and identity map, and relationship loading for lazy versus `selectinload` versus `joinedload` plus `raiseload`. Use `select()` style and `Session.execute` or `Session.scalars` only, never the legacy `Query` API.
- **Support - Reference:** [Alembic tutorial - migration scripts and downgrading](https://alembic.sqlalchemy.org/en/latest/tutorial.html) - Use Create a Migration Script, Running our First and Second Migration, Getting Information and Downgrading to run a paired `upgrade` and `downgrade` round trip on a scratch database.
- **Support - Reference:** [PyArrow Parquet read and write docs](https://arrow.apache.org/docs/python/parquet.html) - Use Reading and Writing Single Files plus `Table` `from_pydict` and `from_pylist` to convert normalized records to Parquet and test types, nulls, column projection and schema.
- **Support - Reference:** [Stripe idempotent requests](https://docs.stripe.com/api/idempotent_requests) - Use the `Idempotency-Key` header contract, stored-response replay, parameter-mismatch errors and `POST`-only scope to implement keyed replay for one endpoint.

### Exit checkpoint

Expose one typed service through CLI and HTTP, ingest malformed and old-version records safely, and defend the schema, transaction and idempotency boundaries.

<details>
<summary>Deliberately left for later</summary>

- Large web frameworks and frontend development
- Distributed databases and cross-service transactions
- ORM-specific architecture beyond one small comparison

</details>

## 03. Testing, Debugging & Reproducibility

**Why:** Correctness claims need an independent oracle and failures need evidence. This section turns testing, source control and environment capture into one repeatable investigation discipline.

### Learn this much

- [ ] Unit, contract, integration, end-to-end and performance tests _(Required)_
- [ ] Requirements, invariants, independent oracles and boundary cases _(Required)_
- [ ] Fixtures, fakes, stubs, mocks and integration risk _(Required)_
- [ ] Property, metamorphic and differential testing _(Required)_
- [ ] Regression tests and targeted failure injection _(Required)_
- [ ] Randomness, time, concurrency, external state and flaky tests _(Required)_
- [ ] Generated cases, shrinking and durable failure replay _(Required)_
- [ ] Debugger, logs, traces and minimum distinguishing observations _(Required)_
- [ ] Competing hypotheses, evidence and root-cause notes _(Required)_
- [ ] Shell quoting, streams, exit status, signals and partial output _(Required)_
- [ ] Permissions, environment, processes, file descriptors and logs _(Required)_
- [ ] Commits, branches, merges, rebases and detached state _(Required)_
- [ ] Bisect, reflog and preservation-first recovery _(Required)_
- [ ] SSH trust, keys, forwarding and durable tmux sessions _(Required)_
- [ ] Dependency locks, clean environments and repeatable builds _(Required)_
- [ ] Data identity, configuration, seeds, manifests and checksums _(Required)_
- [ ] Type, lint, test, build and installation gates _(Required)_
- [ ] Hermetic builds and reproducible-build guarantees _(Depth)_

### Study units

#### U1. Test levels, oracles, boundary cases and test doubles

**About 4 h** · **Target:** Explain + Implement

Topics: Unit, contract, integration, end-to-end and performance tests; Requirements, invariants, independent oracles and boundary cases; Fixtures, fakes, stubs, mocks and integration risk

Most ML bugs hide at component boundaries, not inside one function. The test level decides which failures you can see, and the oracle decides whether the test checks anything at all.

**You can now**

- Distinguish unit, contract, integration, end-to-end and performance tests by the failure each can detect.
- Turn a requirement into an invariant, an independent oracle, representative examples and boundary cases.
- Build a pytest suite with fixtures, parametrization and test doubles that has no order dependence.

**Study**

1. [Code Quality: Testing and code coverage](https://missing.csail.mit.edu/2026/code-quality/#testing) (The Missing Semester of Your CS Education) - Testing: unit, integration and functional tests, test-driven development, regression tests, property-based tests and mocks; Code coverage.
2. [pytest Get Started](https://docs.pytest.org/en/stable/getting-started.html) (pytest documentation) - Install pytest through Request a unique temporary directory for functional tests: first test, exceptions, classes and `approx`.
3. [pytest fixtures: scope and teardown](https://docs.pytest.org/en/stable/how-to/fixtures.html) (pytest documentation) - Requesting fixtures; Scope: sharing fixtures across classes, modules, packages or session; Teardown/Cleanup (AKA Fixture finalization).
4. [pytest monkeypatch and mocks](https://docs.pytest.org/en/stable/how-to/monkeypatch.html) (pytest documentation) - Monkeypatching functions; Monkeypatching returned objects: building mock classes; Monkeypatching environment variables; Monkeypatching dictionaries.
5. [pytest and unittest recipes](https://github.com/stas00/python-cookbook/blob/master/content/README.md#testing-with-pytest-and-unittest) (Stas' Python Cookbook - debugging and testing) - Testing with pytest and unittest: pytest basics, Fixtures with `tmp_path`, `capsys`, `monkeypatch` and `caplog`, and Capturing output.
6. [Mocking](https://algomaster.io/learn/python/mocking) (AlgoMaster Python - mocking) - `Mock` vs `MagicMock`; `patch`: Decorator, Context Manager, and Manual; The "Where to Patch" Gotcha; `autospec` and `create_autospec`; Over-Mocking: The Brittleness Trap.

**Focus**

- Each level detects a different failure: unit tests catch logic errors in one function, contract tests catch seam drift, integration tests catch wiring errors, end-to-end tests catch requirement misses.
- An oracle must be independent of the code under test: a reimplementation, the standard library, a known value or a metamorphic relation. Asserting code output against itself proves nothing.
- Boundary cases carry the failures: empty input, single element, duplicates, limits and malformed rows. Parametrize them explicitly.
- Function scope is the default for a reason: shared mutable fixtures create order dependence. Use `yield` fixtures for teardown and `monkeypatch` for automatic undo.

**Reproduce:** From a blank directory, write a small parsing module and a pytest file with one boundary test parametrized over three cases, one `yield` fixture using `tmp_path`, and one monkeypatched environment test. Run pytest and get 5 passed in about 0.3 s on a 12th Gen Intel Core i9-12900K with Python 3.14.4 and pytest 9.1.1.

**Traps**

- Mocking the unit you should be testing. Mock at the seam you do not own, such as network, clock or filesystem, and keep one contract test that touches the real dependency.
- Module- or session-scoped mutable fixtures. Tests pass alone and fail together; keep shared fixtures immutable or hand out fresh copies from a factory.
- Reading 100 percent line coverage as correctness. Coverage shows which lines ran, not which requirements were checked, so the lecture warns against over-indexing on it.

**Practice**

- [Missing Semester Code Quality: unit test plus coverage report](https://missing.csail.mit.edu/2026/code-quality/#exercises) - Exercises, item 2: write a unit test for a project, generate an HTML coverage report and inspect uncovered lines. Apply it to the parsing module from Reproduce and add one boundary test for each uncovered line the report shows.

**Stop when:** Your five-test suite passes, every test also passes alone by node id, and you can name the oracle and the boundary behind each assertion.

<details>
<summary>Self-test</summary>

1. A function returns correct values but writes rows the loader cannot read. Which test level catches this?
   - An integration or contract test at the writer and loader seam. A unit test of either side alone passes.
2. Why is asserting your sort equals your second sort implementation weak, and what is stronger?
   - Both can share your misunderstanding. A stronger oracle is independent: the standard library `sorted`, a fixed fixture, or a property such as the output being ordered.
3. Two tests share a module-scoped dict fixture and pass alone but fail together. What is wrong?
   - One test mutates shared state the other reads. Make the fixture function-scoped or return a fresh copy per test.
4. `monkeypatch.setenv` in one test seems to change a later test. Where is the leak?
   - Not in `os.environ`: pytest undoes every `monkeypatch` change at teardown. Either a test wrote to `os.environ` directly, or code cached the value while the patch was active, such as a module-level setting or an `lru_cache`.
5. `mod.py` does `from json import dumps`. A test patches `json.dumps`, yet `mod.run` still calls the real one. Why?
   - `patch` replaces a name where it is looked up. `mod` bound its own name `dumps` at import, so `patch` `mod.dumps` instead. Verified with `unittest.mock` on CPython 3.14.

</details>

#### U2. Property, metamorphic and differential testing with shrinking

**About 4 h** · **Target:** Implement

Topics: Property, metamorphic and differential testing; Generated cases, shrinking and durable failure replay

Examples check the inputs you thought of. Properties check the inputs you did not, and shrinking hands you the smallest case that breaks your claim.

**You can now**

- State a property, metamorphic relation or differential oracle for a small function and encode it with Hypothesis strategies.
- Read a shrunk counterexample and turn it into a minimal permanent regression case.
- Replay persisted failures from the example database and pin them with `@example` instead of opaque blobs.

**Study**

1. [Hypothesis quickstart](https://hypothesis.readthedocs.io/en/latest/quickstart.html) (Hypothesis documentation) - Install Hypothesis through Write your first test; Running in a test suite; the `max_examples` default of 100; Filtering inside a test.
2. [Hypothesis strategies reference](https://hypothesis.readthedocs.io/en/latest/reference/strategies.html) (Hypothesis documentation) - Primitives; Numeric (`integers`); Strings (`text`); Collections (`lists`); Combinators.
3. [Hypothesis test settings](https://hypothesis.readthedocs.io/en/latest/tutorial/settings.html) (Hypothesis documentation) - Changing the number of test cases; Changing settings across your test suite with profiles.
4. [Replaying failed Hypothesis tests](https://hypothesis.readthedocs.io/en/latest/tutorial/replaying-failures.html) (Hypothesis documentation) - The Hypothesis database; Using `@example` to run a specific input; Replaying test cases with `@reproduce_failure`; Prefer `@example` over the database for correctness.

**Focus**

- A property relates many inputs to expected structure: ordered output, round trips, idempotence. A metamorphic relation compares outputs across related inputs; a differential test compares two implementations on the same inputs.
- Given the same drawn data, the test must behave the same way. Randomness, clocks and global state inside the test break shrinking and replay, and Hypothesis reports the test as flaky.
- Shrinking minimizes the failing case automatically. The report shows the minimal input, not the first one found.
- The database replays past failures before generating new ones. Pin durable cases with `@example`; a `@reproduce_failure` blob is opaque and version-fragile, so convert it promptly.

**Reproduce:** Run a `@given(st.integers(min_value=0))` test asserting $`n < 50`$ with `max_examples=200`: it fails and reports $`n=50`$, the minimal failure, in well under a second on a 12th Gen Intel Core i9-12900K with Python 3.14.4 and Hypothesis 6.169.0. Run it again and it replays $`n=50`$ from the `.hypothesis` database. Add `derandomize=True`, delete `.hypothesis`, rerun, and see the database stay empty. Then assert `sorted(sorted(xs)) == sorted(xs)` over `st.lists(st.integers())` and count 200 examples.

**Traps**

- Skipping unwanted inputs with a plain `if` and `return` inside the test. Those examples count as passes, so coverage shrinks silently; constrain the strategy or call `assume`, and expect the `filter_too_much` health check when most inputs are rejected.
- Keeping a `@reproduce_failure` blob as the regression test. It is opaque and may stop replaying after upgrades, so rewrite it as `@example`.
- Calling a nondeterministic property suite green. A flaky failure poisons the database, so fix determinism first.

**Practice**

- [Hypothesis quickstart failing test](https://hypothesis.readthedocs.io/en/latest/quickstart.html) - Running in a test suite: the `assert` $`n < 50`$ example. Run it, read the shrunk $`n=50`$ report, then convert the case to `@example`.
- [Hypothesis rule-based state machines: DatabaseComparison](https://hypothesis.readthedocs.io/en/latest/stateful.html) - Rule-based state machines: the `DatabaseComparison` example with `add_key`, `save`, `delete` and `values_agree`. Rebuild it against a `dict`-backed store of your own and run at least 50 examples.

**Stop when:** Your property suite fails on a seeded bug with a one-line minimal case, and every durable failure exists as `@example` with the database replay passing.

<details>
<summary>Self-test</summary>

1. Hypothesis tried a large integer first but reports $`n=50`$. Why?
   - Shrinking. After finding a failure it searches for the smallest input that still fails, so the report shows the minimal case.
2. When should a failing case live in @example rather than the database?
   - For every durable regression. The database is a local directory that can go stale across versions, and `derandomize=True`, which the built-in `ci` profile sets, turns it off, while `@example` runs on every machine in the explicit phase.
3. Give a round-trip property for a serializer plus parser, and a metamorphic relation for a sort.
   - Round trip: `parse(serialize(tree))` equals `tree` for every generated tree. Metamorphic: `sorted(xs + ys)` equals `sorted(ys + xs)`, relating two runs without knowing the right answer.
4. A property test fails only on some runs of identical code. What must you check?
   - Determinism of draws plus outcome: unmanaged randomness, time, filesystem or global state. Only that sequence needs to be deterministic.

</details>

#### U3. Regression tests, failure injection and flaky tests

**About 3 h** · **Target:** Implement + Measure

Topics: Regression tests and targeted failure injection; Randomness, time, concurrency, external state and flaky tests

A fixed bug returns unless a test pins it. A flaky test teaches the team to ignore red builds, which hides the next real failure.

**You can now**

- Write a regression test that fails on the old code and passes on the fix, and mark known-bad behavior with `strict` `xfail`.
- Inject a targeted fault, such as a full disk or a failing dependency, and show the suite catching it.
- Measure a flake rate, isolate its randomness, time, concurrency or state source, and quarantine deliberately instead of rerunning blindly.

**Study**

1. [pytest skip and xfail](https://docs.pytest.org/en/stable/how-to/skipping.html) (pytest documentation) - Skipping test functions and `skipif`; `XFail` with `condition`, `reason`, `raises`, `run` and `strict` parameters; Skip/`xfail` with `parametrize`.
2. [pytest flaky tests explanation](https://docs.pytest.org/en/stable/explanation/flaky.html) (pytest documentation) - Why flaky tests are a problem; Potential root causes: system state, overly strict assertion and thread safety; Other general strategies: split up test suites and quarantine.
3. [Hypothesis flaky failures](https://hypothesis.readthedocs.io/en/latest/tutorial/flaky.html) (Hypothesis documentation) - Common sources of flakiness; Types of flakiness: Flaky failure and Flaky strategy definition.
4. [Reproducing resource issues](https://github.com/stas00/the-art-of-debugging/blob/master/methodology/README.md#watching-and-reproducing-resource-issues) (The Art of Debugging) - Watching and reproducing resource issues: Running out of resources, Emulating an almost full disk partition and Emulating running out of CPU memory.

**Focus**

- A regression test names the defect: it fails before the fix and passes after. Write it before the fix when you can.
- `xfail` with `strict=True` turns an unexpected pass into a failure, so fixed bugs announce themselves. Unstrict `xfail` as permanent quarantine is dangerous; the pytest guide says so.
- Flakiness means uncontrolled state: randomness, clocks, threads, leftover files or test order. Parallel runs and randomized ordering expose order dependence.
- Rerun plugins and quarantines mitigate; they do not fix. Isolate the source first, then control it, quarantine it with an owner, or delete the test.

**Reproduce:** Write `assert random.random() < 0.5` and run it 10 times: expect about half to fail (5 failed and 5 passed in the reference run, about 0.07 s per run on a 12th Gen Intel Core i9-12900K with Python 3.14.4 and pytest 9.1.1). Seed it with `random.seed(1)` (first draw 0.134) for 5 passes in 5 runs, then `random.seed(0)` (first draw 0.844) for 5 failures: seeding makes the outcome deterministic, not correct. Then mark a known failure `xfail(strict=True)`, fix the code, and watch the suite fail on `XPASS` until you remove the mark.

**Traps**

- Rerunning the suite until green and merging. The team learns to distrust failures, so quarantine with a ticket instead.
- `xfail` without `strict` on a fixed bug. The suite stays green while the mark silently goes stale.
- Wall-clock sleeps as synchronization. Load makes them flaky, so wait on events or poll with deadlines instead.

**Practice**

- [Missing Semester run-until-failure script with command argument](https://missing.csail.mit.edu/2026/course-shell/#exercises) - Exercises, item 12: modify the lecture flaky-test script to accept the test command as an argument. Point it at your flaky test and capture the first failing log; then fix the flake and retire the loop.

**Stop when:** You can quote the flake rate before and after your fix, the regression test fails on the old code, and no test needs a rerun to pass.

<details>
<summary>Self-test</summary>

1. A test fails one run in twenty. What is the first measurement, and what comes after?
   - The flake rate over repeated runs, then isolation: seed randomness, fix clocks, serialize threads, clean state, and run the test alone versus in the suite.
2. When is `strict` `xfail` the right tool?
   - A known bug with a test: the suite stays green while it fails and goes red with `XPASS` when fixed, which forces removal of the mark.
3. A test passes alone but fails under parallel workers. What does that suggest?
   - Order dependence or shared state: a previous test leaves data behind, or the test needs data another test creates.
4. Why does `pytest.approx` belong in a flake fix for float asserts?
   - Exact float equality is an overly strict assertion: tiny representation differences fail otherwise identical runs. `approx` compares within tolerance.

</details>

#### U4. Debuggers, logs, traces and competing hypotheses

**About 3 h** · **Target:** Measure

Topics: Debugger, logs, traces and minimum distinguishing observations; Competing hypotheses, evidence and root-cause notes

Editing before observing creates new bugs while the old one hides. A short hypothesis log plus one distinguishing observation usually beats an hour of guessing.

**You can now**

- Rank competing root-cause hypotheses and pick the observation that distinguishes them before editing code.
- Drive `pdb`, `logging`, `strace` and sanitizer output to locate a defect with tool evidence.
- Shrink a failure to a minimal reproducer and pin it with a regression test.

**Study**

1. [Debugging and Profiling: the Debugging half](https://missing.csail.mit.edu/2026/debugging-profiling/#debugging) (The Missing Semester of Your CS Education) - Debugging: Printf Debugging and Logging; Debuggers with the `gdb` command list; Record-Replay Debugging with `rr` reverse commands; System Call Tracing with `strace` flags; Memory Debugging with sanitizer compile flags. Depth: Skim Profiling, Timing through Benchmarking. That half belongs to a later section; stop at the Exercises under Debugging.
2. [Fast debugging methodology](https://github.com/stas00/the-art-of-debugging/blob/master/methodology/README.md#core-principles) (The Art of Debugging) - Core principles: quick iterations with small payload, real versus random versus synthetic data; Atomic debug cycles; Finding the cause: editing the right file, bisecting revisions.
3. [Debugging Python programs](https://github.com/stas00/the-art-of-debugging/blob/master/python/README.md#choosing-the-right-approach) (The Art of Debugging) - Choosing the right approach; Running the code you think you are running; Interactive debugging including `pdb` attach and embed; Diagnosing hangs with `py-spy`.
4. [Debugger and logging recipes](https://github.com/stas00/python-cookbook/blob/master/content/README.md#debugging) (Stas' Python Cookbook - debugging and testing) - Debugging: The interactive debugger command list; Printing, Logging and Output Control: the `logging` block, prefer it over `print` for real programs.

**Focus**

- Write two or three competing hypotheses first, each with the single observation that would kill it. Run the cheapest distinguishing observation before changing code.
- Confirm you run the code you edit: check the module path for installed copies shadowing the repo. Every later observation misleads otherwise.
- Match the tool to the question: `breakpoint` for state, `logging` for history, `strace -f -e trace=file` for missing files, `strace -f -p PID` for a hang, AddressSanitizer for memory corruption, `rr reverse-continue` for Heisenbugs.
- On Python 3.14, `python -m pdb -p PID` attaches to a running process. Under Ubuntu's default `ptrace_scope` of 1 it fails on a process that is not its descendant (`Failed to find the PyRuntime section`) unless run with `sudo`; `py-spy dump` needs the same permission.

**Reproduce:** Seed an off-by-one in a function you tested in the first unit. Write three competing hypotheses with their killing observations in a log file. Confirm the import path, set one `breakpoint`, read the distinguishing variable, fix, and add the regression test. End state: the log shows each rejected hypothesis with its evidence, and the suite is green.

**Traps**

- Debugging the wrong copy: an installed package shadows your edited repo file. Check the module path before trusting any observation.
- Trusting an observer that changes timing. Prints, `strace` and `rr`'s single-core recording all perturb a race; keep instrumentation cheap and in memory, and use `rr record --chaos` to provoke the failing schedule.
- Declaring victory without a regression test. The next refactor reintroduces the same defect silently.

**Practice**

- [Missing Semester merge-sort debugger exercise](https://missing.csail.mit.edu/2026/debugging-profiling/#debugging-1) - Exercises under Debugging, item 1: implement the buggy merge sort, find the bug with a debugger and fix it. Keep a hypothesis log with at least two competing hypotheses before you set the first `breakpoint`.
- [Missing Semester sanitizer and strace exercises](https://missing.csail.mit.edu/2026/debugging-profiling/#debugging-1) - Exercises under Debugging, items 3 and 4: the `uaf.c` AddressSanitizer report and the `strace` file listing. Compile with `gcc -fsanitize=address -g` as the lecture shows and quote the faulting line.

**Stop when:** A seeded defect you have never seen takes under an hour from log entry to green regression test, with tool output quoted for every rejected hypothesis.

<details>
<summary>Self-test</summary>

1. Two hypotheses: wrong constant versus wrong index. What is one distinguishing observation?
   - Break at the indexing line and read the index and the constant. One read kills one hypothesis.
2. A program hangs on startup with no output. Which tool first, and with what flags?
   - `strace -f -p PID`, or rerun it under `strace -f`. The last system call shows where it blocks, such as a read on a socket or pipe, a connect, or a futex wait. Add `-e trace=file` to see missing files (`ENOENT`) on the way.
3. Why convert prints to log statements after the fix?
   - Logs keep severity, destination and history for the next similar bug. Removed prints lose the evidence path; the lecture recommends this explicitly.
4. rr records a passing run of a race bug. What now?
   - Record again until a failing run is captured: `rr` serializes scheduling, so intermittent races may need several attempts. Then replay deterministically with reverse debugging.

</details>

#### U5. Shell streams, exit status, signals, processes and permissions

**About 4 h** · **Target:** Explain + Implement

Topics: Shell quoting, streams, exit status, signals and partial output; Permissions, environment, processes, file descriptors and logs

Every experiment runs through a shell. An unquoted path or a swallowed exit code turns a clean failure into silent corruption.

**You can now**

- Write a fail-fast script that quotes paths, validates inputs, propagates exit status and cleans up on signals.
- Diagnose a failed process from exit status, streams, permissions, environment and signal behavior.
- Explain quoting, redirection, pipelines, job control and partial-output recovery without trial and error.

**Study**

1. [Course shell: language, streams and strict mode](https://missing.csail.mit.edu/2026/course-shell/#the-shell-language-bash) (The Missing Semester of Your CS Education) - The shell language (bash): quoting, redirections, pipes, command substitution, shebang, `set -euo pipefail` and the run-until-failure script; Exercises on streams, exit status, scripts and permissions.
2. [Command-line environment: streams, status and signals](https://missing.csail.mit.edu/2026/command-line-environment/#arguments) (The Missing Semester of Your CS Education) - Arguments; Streams; Environment variables; Return codes; Signals; Exercises under Return Codes and Signals and Job Control.
3. [Bash execution control and background logs](https://github.com/stas00/the-art-of-debugging/blob/master/unix/README.md#controlling-script-execution) (The Art of Debugging) - Bash: Controlling script execution (trace with `-x`, abort on failures inside the script and in the pipeline, abort on undefined variables, temporarily turning off `set` commands); `nohup`.

**Focus**

- Quote every expansion and keep globs unquoted only when intended. Single quotes preserve literally; double quotes allow expansion.
- Use `set -euo pipefail`, `trap` cleanup on `EXIT`, and make `INT` and `TERM` exit (130 and 143) so the `EXIT` trap runs. Without `pipefail`, `false | true` exits 0 and the failure vanishes.
- Streams are separate contracts: `stdout` carries data, `stderr` carries diagnostics, the exit code carries the outcome. Redirect and check each one deliberately.
- Background jobs report through `$!`, `wait` and `kill`. Partial output stays recoverable when each stage writes its own log.

**Reproduce:** Write `check-and-run.sh` with a shebang, `set -euo pipefail`, a quoted `$1` filename check with `test -f`, a temp file removed by `trap` on `EXIT`, traps that exit 130 on `INT` and 143 on `TERM`, a sleep run as `sleep & wait $!`, and separate `stdout` and `stderr` logs. Show that `false | true` exits 1 under `pipefail` and 0 without it on GNU bash 5.3.9, and that `kill -TERM` ends the script at once with exit code 143 and the temp file gone. Then drop the exit traps and watch `TERM` wait for the `sleep` and exit 0.

**Traps**

- `set -e` does not fire inside `if` conditions, `&&` lists, or pipelines without `pipefail`. Test failure handling explicitly instead of assuming strictness.
- Unquoted variables and command substitutions split on spaces. Filenames with spaces become several arguments, so quote or use arrays.
- A cleanup trap on `TERM` that does not exit. Bash runs it only after the foreground command finishes, then resumes the script, which can exit 0; `trap` `EXIT` for cleanup, exit from the `INT` and `TERM` traps, and `wait` on background work so the signal lands at once.

**Practice**

- [Missing Semester course-shell stream and status exercises](https://missing.csail.mit.edu/2026/course-shell/#exercises) - Exercises, items 5, 6, 8 and 9: split `stdout` and `stderr`, the `$?` one-liner, `check.sh` and `chmod +x`
- [Missing Semester command-line return-code exercise](https://missing.csail.mit.edu/2026/command-line-environment/#return-codes-1) - Exercises under Return Codes: the run-until-failure script. Reuse your fail-fast header and `trap` in it.

**Stop when:** Your script handles a filename with spaces, reports the right exit code for missing input, and leaves no temp files after `SIGTERM`.

<details>
<summary>Self-test</summary>

1. `false | true; echo $?` prints what with and without `pipefail`?
   - 1 with `pipefail`, 0 without. The pipeline status is the last command unless `pipefail` propagates the failure.
2. Why must `cd` be a shell builtin?
   - A child process cannot change its parent working directory, so `cd` must run in the shell itself.
3. A script cleans up on Ctrl-C but not on `kill -9`. Why?
   - `SIGKILL` cannot be caught or ignored. Traps handle `INT` and `TERM` but never `KILL`, so temp files must tolerate it.
4. Output still appears after `cmd 2>/dev/null`. What happened?
   - Usually the text is on `stdout`, not `stderr`. Otherwise another pipeline stage printed it, or the program writes to `/dev/tty` directly, as password prompts do.

</details>

#### U6. Git history, merges, rebases, bisect and recovery

**About 4 h** · **Target:** Explain + Implement

Topics: Commits, branches, merges, rebases and detached state; Bisect, reflog and preservation-first recovery

History is the experiment log of the code. Bisect finds which change broke behavior, and `reflog` makes almost every Git mistake reversible.

**You can now**

- Explain commits, branches, merges, rebases and detached state using the snapshot graph.
- Isolate a regression with `bisect run` from an automated failing test.
- Recover a displaced commit with `reflog` without discarding unrelated work.

**Study**

1. [Version control and Git data model](https://missing.csail.mit.edu/2026/version-control/#gits-data-model) (The Missing Semester of Your CS Education) - Git data model: Snapshots, Modeling history, Objects and content-addressing, References; Staging area; Basics, Branching and merging; Advanced Git; the `recipe.txt` merge-conflict exercise.
2. [Pro Git: basic branching and merging](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging) (Pro Git) - Basic Branching; Basic Merging; Basic Merge Conflicts.
3. [Pro Git: rebasing](https://git-scm.com/book/en/v2/Git-Branching-Rebasing) (Pro Git) - The basic rebase flow; More Interesting Rebases with `--onto`; The Perils of Rebasing; Rebase vs. Merge.
4. [Pro Git: debugging with Git](https://git-scm.com/book/en/v2/Git-Tools-Debugging-with-Git) (Pro Git) - `bisect start`, `bad`, `good` and `run` with `test-error.sh`; `blame -L` for line-level attribution.
5. [Pro Git: undoing things](https://git-scm.com/book/en/v2/Git-Basics-Undoing-Things) (Pro Git) - Undoing Things: Unstaging a Staged File; Unmodifying a Modified File; Undoing things with `git restore`.
6. [Pro Git: data recovery](https://git-scm.com/book/en/v2/Git-Internals-Maintenance-and-Data-Recovery) (Pro Git) - Maintenance and Data Recovery: Data Recovery (`reflog`, `git log -g`, `fsck --full` for dangling commits).

**Focus**

- A commit is a snapshot plus parents, and a branch is a movable pointer. Merge preserves both parents; rebase rewrites commits onto a new base.
- Rebase only local, unpushed work. Rebasing pushed history forces everyone downstream to repair, which the book states as the rule.
- Bisect needs a monotonic test: nonzero exit on bad, zero on good, plus one known-good and one known-bad commit. `git bisect run` automates the search in logarithmic steps.
- Recovery is preservation-first: stash or branch current state before any destructive command. Uncommitted work is invisible to `reflog`, and unreachable entries expire after 30 days by default.

**Reproduce:** Build a 7-commit repo with a regression introduced in commit 6 and a `test.sh` that exits 1 on the bad line. Run `git bisect start`, `bad`, `good` `HEAD~6` and run `./test.sh`: it tests commits 4, 6 and 5 and reports commit 6 as the first bad commit. Then delete a branch tip and recover it with `git reflog` plus `git branch recovered <sha>`. Observed with git 2.51.0.

**Traps**

- Destructive commands before saving state. Uncommitted work never reaches the `reflog`, so stash or commit before `reset --hard` or `clean`.
- Bisecting with a flaky or non-monotonic test. The search converges on the wrong commit, so stabilize the test first.
- Rebasing a shared branch then force-pushing. Use merge, or rebase only with coordination, and never rewrite pushed history silently.

**Practice**

- [Missing Semester class-website history exercise](https://missing.csail.mit.edu/2026/version-control/#exercises) - Exercises, item 2: clone the class website, graph the history and find who last modified `README.md`
- [Missing Semester `recipe.txt` merge-conflict exercise](https://missing.csail.mit.edu/2026/version-control/#exercises) - Exercises, item 8: two branches editing `recipe.txt`, merge, resolve the markers and graph the result

**Stop when:** Your bisect finds the seeded culprit without manual checkouts, and your recovered branch matches the displaced tip sha.

<details>
<summary>Self-test</summary>

1. Merge versus rebase for a finished feature branch: what differs in the graph?
   - Merge adds a merge commit with two parents and preserves branch history. Rebase replays the branch commits onto the main tip as new hashes with a linear history.
2. `git bisect run` reports the wrong culprit. Name two causes.
   - A flaky non-monotonic test, or a bad and good labeling error. Uncommitted changes skewing some checkouts is a third.
3. You deleted a branch yesterday and need its tip. What is the exact recovery?
   - `git reflog`, find the tip sha, then `git branch recovered <sha>`. It works while the `reflog` entry survives expiry.
4. In detached `HEAD` state, what does committing do, and what is the risk?
   - The commit exists but no branch points at it. Switching away strands it except in the `reflog`, so create a branch to keep it.

</details>

#### U7. SSH trust, keys, forwarding and tmux sessions

**About 2 h** · **Target:** Implement

Topics: SSH trust, keys, forwarding and durable tmux sessions

Remote machines do the heavy work. Keys plus tmux turn a fragile connection into a durable session with no password typed twice.

**You can now**

- Create `ed25519` keys, configure hosts, copy keys and disable password authentication.
- Forward a remote port to localhost and run it in the background without secrets in logs.
- Run a task in a named tmux session that survives disconnects and reattach cleanly.

**Study**

1. [Command-line environment: remote machines](https://missing.csail.mit.edu/2026/command-line-environment/#remote-machines) (The Missing Semester of Your CS Education) - Remote Machines: ssh invocation, key generation with `ssh-keygen -a 100 -t ed25519`, `ssh-copy-id`, `~/.ssh/config` entries and `LocalForward`; Exercises under Remote Machines (SSH).
2. [Command-line environment: terminal multiplexers](https://missing.csail.mit.edu/2026/command-line-environment/#terminal-multiplexers) (The Missing Semester of Your CS Education) - Terminal Multiplexers: tmux sessions, detaching and reattaching, windows and panes; Exercises under Terminal Multiplexers.

**Focus**

- Host trust and user trust are different files: `known_hosts` authenticates the server, `authorized_keys` authenticates you. Read first-connection prompts instead of reflex-typing yes.
- One key per client, passphrase protected, loaded in the agent. The private key never leaves the client; copy the `.pub` with `ssh-copy-id`.
- `LocalForward` exposes a remote port locally, and `-N -f` backgrounds the tunnel. Never paste tokens or keys into commands that land in shell history or logs.
- tmux owns the session, not the correctness. Name sessions, detach with the prefix plus d, reattach with `tmux a -t`. A host reboot or a killed tmux server still ends the session.

**Reproduce:** Generate `ssh-keygen -a 100 -t ed25519 demokey` and get `demokey` plus `demokey.pub`. Add a `Host vm` entry with `HostName`, `User` and `IdentityFile`, then verify with `ssh -G vm` that `hostname`, `user`, `port` and `identityfile` resolve (observed with OpenSSH 10.2). Then run `tmux new -d -s atlas`, `tmux ls`, detach, reattach and `kill-session` (observed with tmux 3.6a).

**Traps**

- Agent forwarding to untrusted hosts. A root user on the remote can use your agent, so forward only where needed and prefer `ProxyJump`.
- Leaving password authentication enabled. Keys plus disabled passwords close brute force; the exercises walk through `sshd_config`.
- Treating tmux as supervision. It survives disconnects, not reboots or out-of-memory kills; real services need a supervisor.

**Practice**

- [Missing Semester SSH exercise chain](https://missing.csail.mit.edu/2026/command-line-environment/#remote-machines-ssh) - Exercises under Remote Machines (SSH), items 1 to 5 and 7: key pair, `Host vm` config, `ssh-copy-id`, a webserver on 8888 reached at `localhost:9999`, `PasswordAuthentication off`, and `-N -f` background forwarding
- [Missing Semester tmux tutorial exercise](https://missing.csail.mit.edu/2026/command-line-environment/#terminal-multiplexers-1) - Exercises under Terminal Multiplexers: follow the linked tmux tutorial, then customize `tmux.conf`

**Stop when:** You reach the remote with no password prompt, the forwarded port serves locally, and a reattached session shows the task log intact after a disconnect.

<details>
<summary>Self-test</summary>

1. `known_hosts` versus `authorized_keys`: who trusts whom?
   - `known_hosts` on the client records server keys, so the client trusts the server. `authorized_keys` on the server records client keys, so the server trusts the client.
2. What does `LocalForward 9999 localhost:8888` in `Host vm` do?
   - Connections to local port 9999 travel through the SSH link to `vm` and emerge as connections to its `localhost:8888`.
3. SSH drops mid-run inside tmux. What survives?
   - The tmux server and its processes keep running. Reattach to see the output intact. Anything outside tmux got `SIGHUP` unless started with `nohup`.
4. Why is `ssh -N -f` useful for forwarding, and what do the flags do?
   - `-N` runs no remote command and `-f` backgrounds after authentication: a quiet tunnel with no shell.

</details>

#### U8. Dependency locks, run manifests and quality gates

**About 4 h** · **Target:** Implement

Topics: Dependency locks, clean environments and repeatable builds; Data identity, configuration, seeds, manifests and checksums; Type, lint, test, build and installation gates

A result that needs your laptop to reproduce is a rumor. Locks plus manifests plus gates make the same code produce the same result on another machine.

**You can now**

- Lock an application with `uv lock` and reproduce the environment with `uv sync --locked`.
- Record code, configuration, data identity, seeds and output checksums in a run manifest.
- Wire format, lint, typecheck, test, build and clean-install gates with `pre-commit` and CI.

**Study**

1. [Packaging and shipping code](https://missing.csail.mit.edu/2026/shipping-code/#dependencies--environments) (The Missing Semester of Your CS Education) - Dependencies and Environments with `venv` and uv; Artifacts and Packaging with `pyproject.toml` and `uv build`; Releases and Versioning with pins versus ranges; Reproducibility with `uv lock`, lockfile contents, hermetic Nix and Bazel, Dependabot and rollback; Configuration.
2. [Code Quality: gates and automation](https://missing.csail.mit.edu/2026/code-quality/#formatting) (The Missing Semester of Your CS Education) - Formatting; Linting; Pre-commit hooks; Continuous integration with matrices and badges; Command runners.
3. [Versions, environments and packaging recipes](https://github.com/stas00/python-cookbook/blob/master/content/README.md#versions-and-dependencies) (Stas' Python Cookbook - debugging and testing) - Versions and Dependencies: Querying installed package versions and Virtual environments; Packaging and Requirements: Modern packaging with `pyproject.toml`.

**Focus**

- Applications pin, libraries range. `uv.lock` records exact versions with hashes, and CI enforces it with `uv sync --locked`.
- A manifest names everything the run needs: commit sha, config, data checksum, seed, environment lock and output hash. Diff the manifest, not memories.
- Gates run in order of cost: format, lint, typecheck, fast tests, build, clean-environment install. Pre-commit runs the cheap ones locally; CI runs all of them.
- Hermetic builds pin the toolchain too, for bit-identical artifacts. Reach for Nix or Bazel only when lockfiles plus containers still diverge.

**Reproduce:** Run `uv init` plus `uv lock` on a fresh package and get a `uv.lock` opening with `version = 1` and `revision = 3` (uv 0.11.32). Add a dependency to `pyproject.toml` without relocking and compare `uv sync --locked`, which errors, with plain `uv sync`, which rewrites the lock. Create a `venv`, diff `printenv` before and after, and see `VIRTUAL_ENV` and `VIRTUAL_ENV_PROMPT` appear with python resolving inside the `venv`.

**Traps**

- Committing the `venv` or syncing without `--locked` in CI. Plain `uv sync` quietly re-locks when `pyproject.toml` changed, so CI tests versions nobody committed; `--locked` fails on the stale lock.
- Pinning `==` in a reusable library. Your pin becomes every downstream conflict, so range the library and pin the app.
- CI that tests the working tree but never installs the built wheel. Packaging bugs ship green, so add a clean-install smoke step.

**Practice**

- [Missing Semester environment and lockfile exercises](https://missing.csail.mit.edu/2026/shipping-code/#exercises) - Exercises, items 1 and 2: `printenv` diff across `venv` activation; package with `pyproject.toml` plus lockfile inspection
- [Missing Semester formatter, linter and CI exercises](https://missing.csail.mit.edu/2026/code-quality/#exercises) - Exercises, items 1 and 3: formatter plus linter with pre-commit hooks; CI on every push with an intentional breakage. Break the build on purpose once and confirm CI catches it before review.

**Stop when:** A clean checkout runs one command to a green gate, `uv sync --locked` reproduces the environment per the lock hashes, and the run manifest explains any output change.

<details>
<summary>Self-test</summary>

1. `uv.lock` exists but CI runs `uv sync` without `--locked`. What breaks?
   - Nothing while `pyproject.toml` and `uv.lock` agree: uv installs the locked versions. When someone edits `pyproject.toml` without relocking, plain `uv sync` re-resolves and rewrites the lock in CI, while `--locked` exits with an error. Verified with uv 0.11.32.
2. Why does the lecture recommend ranges for libraries and pins for apps?
   - Libraries compose with other dependencies, so strict pins conflict. Apps are final consumers, so exact pins give every run identical inputs.
3. A manifest lists code sha, config, data checksum, seed, lockfile hash and output hash. Identical code gives a different output: where do you look?
   - The config, data, seed and environment entries. The manifest turns same code with different results into a named diff.
4. Pre-commit passes but CI fails on lint. What usually differs?
   - Versions or scope: hooks pinned differently from CI, or CI checks files the hooks skip. Pin the same tool versions in both.

</details>

### Mini-project: Test, debug and pin the taskrunner

**About 8 to 12 hours.** Make the task runner's correctness and environment reproducible with oracle-based tests and a property that finds a seeded defect. Keep an evidence-first debugging log and a locked environment whose runs write a manifest.

1. Test `params_hash` against boundary cases and `plan` against an independent edge-by-edge oracle that also rejects cyclic input, running each test alone, with the Missing Semester code-quality unit test as reference.
2. Seed an order-dependent hashing defect, write the Hypothesis property over same-items different-order inputs that finds it following the Hypothesis quickstart shrinking pattern, pin the shrunk case with `@example`, then fix the canonical form.
3. Seed order-dependent output that makes a test fail across fresh processes using the Missing Semester run-until-failure script, show a fixed seed only repeats the outcome, then fix the ordering and record failure counts before and after.
4. Seed an off-by-one in a CLI output path and, before touching the code, log competing hypotheses with the observation that would kill each following the Missing Semester merge-sort debugger exercise, then fix it with quoted tool output beside each rejection.
5. Rebuild a regression from history on a branch with a status-coded check script, locate it with `git bisect run` following the Missing Semester version-control history exercises, and delete and recover a branch tip through `git reflog`.
6. Write a fail-fast shell entry with quoted arguments, a trapped temporary directory and separate logs checked against the Missing Semester course-shell stream and status exercises, and show it exits cleanly on `TERM` with no leftovers.
7. Lock the environment, gate on sync plus tests plus typecheck, write a run manifest with commit, config, inputs, seed and outputs, and pass the gate over SSH inside tmux following the Missing Semester SSH, tmux and lockfile exercises.

**Deliverables**

- The test suite: oracle and boundary tests, the property with its pinned case, and the flaky test's counts before and after.
- The debugging log with hypotheses and quoted evidence, and the `bisect` transcript naming the first bad commit.
- The shell wrapper transcripts, the lockfile, the one-command gate, two manifests with their diff and the remote transcript.

**Checks**

- rubric: Self-grade with the rubric below.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Independent oracles | Each test names its oracle, the plan is checked edge by edge, and every test passes alone. | Each oracle stays independent of the code under test, and a deliberate mutation makes a test fail. |
| Properties and flakiness | The property finds the order defect, the shrunk case is pinned, and the flaky test is fixed with counts before and after. | The write-up explains why the shrunk case is minimal and why a pinned seed would hide the flake. |
| Evidence-first diagnosis | The log rejects at least two hypotheses with quoted tool output, and `bisect` names the seeded commit unaided. | Each hypothesis states its killing observation first, and the regression test fails on the found commit. |
| Locked reproducibility | A clean checkout reaches a green gate, the wrapper exits as specified with no leftovers, and every run writes a manifest. | Two manifests explain an output difference field by field, and the gate also passes on the remote host. |

Feeds into: The clean-checkout gate, the shell wrapper and the run manifest the runbook relies on, plus the debugging log as the model evidence-first report.

### Resource route

- **Primary - Course:** [The Missing Semester of Your CS Education](https://missing.csail.mit.edu/2026/) - Complete the 2026 lectures on the shell, command-line environment, development tools, debugging and profiling, Git, packaging and shipping code, and code quality. Apply every exercise to the same stage project.
- **Required - Implementation:** [pytest documentation](https://docs.pytest.org/en/stable/) - Use Get Started, fixtures, parametrization, monkeypatch, caplog and temporary paths to build behavior and failure-path tests without order dependence.
- **Required - Practice:** [Hypothesis documentation](https://hypothesis.readthedocs.io/en/latest/) - Follow the Quick start and property-based testing guides, then generate operation histories and retain the minimized example for one real defect.
- **Support - Practice:** [The Art of Debugging](https://github.com/stas00/the-art-of-debugging) - Use the Unix, Python and compiled-code sections during a real seeded defect. Follow the evidence and tiny-reproducer workflow rather than reading the unfinished book front to back.
- **Support - Reference:** [Pro Git](https://git-scm.com/book/en/v2) - Use Chapters 2-3 and the sections on debugging, internals and recovery while constructing a history for bisect and recovering a deliberately displaced commit.
- **Support - Reference:** [Stas' Python Cookbook - debugging and testing](https://github.com/stas00/python-cookbook/blob/master/content/README.md) - Use Part III and the packaging sections for debugger, traceback, pytest, logging, profiling and clean-environment recipes.
- **Support - Course:** [AlgoMaster Python - mocking](https://algomaster.io/learn/python/course-roadmap) - Use the Mocking lesson for `unittest.mock`: `Mock` versus `MagicMock`, `patch` targets, `autospec` and the over-mocking trap. The pytest docs remain the reference for fixtures and `monkeypatch`.

### Exit checkpoint

Resolve one unfamiliar seeded defect with a hypothesis log and regression test, then rebuild and reproduce the result from a clean checkout and recover one displaced Git commit.

<details>
<summary>Deliberately left for later</summary>

- Organization-wide CI platform administration
- Formal verification systems
- Reproducible builds across every operating system

</details>

## 04. Concurrency, Profiling & Operations

**Why:** A fast happy path is not an operable system. Bounded work, cancellation, profiles and observable failure behavior are the foundations for later training and serving systems.

### Learn this much

- [ ] CPU-bound, I/O-bound, stateful and cancellation-sensitive work _(Required)_
- [ ] Threads, processes and asynchronous tasks _(Required)_
- [ ] Python GIL implications and extension-code release boundaries _(Required)_
- [ ] Locks, semaphores, conditions, events and queues _(Required)_
- [ ] Race, deadlock, livelock, starvation and lost wakeups _(Required)_
- [ ] Task ownership, task groups, cancellation and cleanup _(Required)_
- [ ] Timeouts, deadlines, retry budgets, jitter and idempotency _(Required)_
- [ ] Bounded queues, admission control, backpressure and load shedding _(Required)_
- [ ] Signals, graceful shutdown and partial-work disposition _(Required)_
- [ ] Sampling versus instrumentation and wall versus CPU time _(Required)_
- [ ] CPU profiles, allocation traces, RSS and memory retention _(Required)_
- [ ] Warmup, repeated trials, workload control and raw results _(Required)_
- [ ] Structured logs, correlation IDs and secret redaction _(Required)_
- [ ] Low-cardinality metrics, latency distributions and queue depth _(Required)_
- [ ] Trace context, spans and cross-boundary latency _(Required)_
- [ ] Readiness, liveness and dependency health _(Required)_
- [ ] Container builds, non-root execution, limits and signals _(Required)_
- [ ] Process supervision and diagnosis runbooks _(Required)_
- [ ] eBPF and kernel-level production tracing _(Depth)_

### Study units

#### U1. Work types, threads, processes, async tasks and the GIL

**About 5 h** · **Target:** Explain + Measure

Topics: CPU-bound, I/O-bound, stateful and cancellation-sensitive work; Threads, processes and asynchronous tasks; Python GIL implications and extension-code release boundaries

Concurrency overlaps work; it does not automatically make that work parallel. A workload and build-specific experiment is a better design input than a blanket claim about Python threads.

**You can now**

- Choose threads, processes or async tasks from CPU work, I/O waits, shared state and cancellation needs.
- Measure CPU-bound thread scaling on default and free-threaded CPython 3.14 builds without assuming their GIL state.
- Identify a blocking call that prevents other event-loop tasks from progressing.

**Study**

1. [Concurrency models and Python workload choices](https://algomaster.io/learn/concurrency-interview/concurrency-models) (AlgoMaster Concurrency) - Concurrency Models; then Threading vs Multiprocessing, Key Differences and When to Use Threading/Multiprocessing; Asyncio Fundamentals, The Event Loop and Common async/await Mistakes. Depth: Use the models as a first pass. Check build-specific GIL and process-start claims against the 3.14 references below.
2. [Free-threaded CPython is a separate build](https://docs.python.org/3.14/howto/free-threading-python.html) (Python concurrency documentation) - Identifying free-threaded Python; The global interpreter lock in free-threaded Python; Thread safety; Performance characteristics.
3. [Process startup is part of the experiment](https://docs.python.org/3.14/library/multiprocessing.html#contexts-and-start-methods) (Python concurrency documentation) - Contexts and start methods: `spawn`, `fork` and `forkserver`, including the 3.14 default changes and safe importing of the main module.

**Focus**

- Default CPython 3.14 has a GIL. Pure Python CPU loops do not gain multicore parallelism from its threads; I/O waits and native code that releases the GIL are different cases.
- Free-threaded builds can execute Python threads in parallel. Record `sys.version`, `sysconfig.get_config_var('Py_GIL_DISABLED')` and `sys._is_gil_enabled()` after imports; an unsupported extension can re-enable the GIL.
- Async tasks share an event-loop thread and yield cooperatively. A synchronous CPU loop or `time.sleep` inside a task stalls that loop.
- Processes isolate state but pay startup and serialization costs. In 3.14 `fork` is no longer the default anywhere: Linux and other POSIX platforms default to `forkserver`, while macOS and Windows use `spawn`. Select and report the context explicitly.

**Reproduce:** From a blank file, sum integers with a Python for-loop for four equal jobs of 5,000,000 iterations. Assert each result equals `n*(n-1)//2`. Compare serial, four threads and four spawned processes on both CPython 3.14 builds. Use one warm-up and five measured trials per mode, include pool startup and save raw times, CPU, full version and GIL state. A reference run on Intel Core i9-12900K gave median seconds serial/threads/processes of 0.304/0.321/0.153 on 3.14.4 default and 0.315/0.088/0.156 on 3.14.6 free-threaded with GIL disabled. These are observations, not required speedups. Also schedule a heartbeat around a synchronous blocking call, then replace it with an awaited nonblocking operation and explain the missing versus advancing heartbeat.

**Traps**

- Treating a free-threaded executable name as proof that the GIL stayed disabled after imports.
- Replacing the loop with `sum(range(n))` and calling it the same pure Python workload, or comparing different total work across worker counts.
- Calling `asyncio.to_thread` a CPU-parallelism guarantee on the default build. It keeps blocking I/O off the loop but does not remove the GIL.

**Practice**

- The section mini-project covers this: matched-work concurrency comparisons and an event-loop blocking fault in the bounded worker pipeline.

**Stop when:** You have correctness-checked raw timings from both builds and can justify a model for CPU work, blocking I/O and cancellation-sensitive work without claiming a universal speedup.

<details>
<summary>Self-test</summary>

1. Which model fits many socket waits with little CPU work?
   - Async tasks fit when the client APIs are nonblocking. Threads fit blocking clients. Bound either model's in-flight work.
2. Why might processes lose on tiny jobs?
   - Startup, serialization and communication can cost more than the CPU work they parallelize.
3. Does no GIL mean no need for locks?
   - No. Internal container protection does not make a multi-step application invariant atomic.
4. Do these two build measurements isolate the cost of removing the GIL?
   - No. Patch versions and compilers differ too. Compare scaling within each build; do not attribute every cross-build timing difference to the GIL.

</details>

#### U2. Synchronization primitives and concurrency hazards

**About 6 h** · **Target:** Explain + Implement

Topics: Locks, semaphores, conditions, events and queues; Race, deadlock, livelock, starvation and lost wakeups

Correct shared-state code needs both safety and progress. A lucky stress run proves neither; force the interleaving that breaks the invariant.

**You can now**

- Protect a compound invariant with a lock and coordinate a bounded queue with condition predicates.
- Reproduce a lost update and a deadlock with controlled interleavings, then remove their causes.
- Distinguish deadlock, livelock, starvation and lost notification from slow useful work.

**Study**

1. [Locks, permits and progress failures](https://algomaster.io/learn/concurrency-interview/mutex) (AlgoMaster Concurrency) - Mutex; Semaphores; Condition Variables; Deadlock; Livelock; Starvation; Lost Signal. Depth: Read the mechanism and failure examples, not every language implementation. Use Python's `Condition` contract for the implementation.
2. [`Condition` predicates under one lock](https://docs.python.org/3.14/library/threading.html#condition-objects) (Python concurrency documentation) - `Condition` objects: producer-consumer example, `wait`, `wait_for`, `notify` and `notify_all`; `Semaphore` objects.
3. [Design Thread-Safe Blocking Queue](https://algomaster.io/learn/concurrency-interview/design-thread-safe-blocking-queue) (AlgoMaster Concurrency) - Problem Statement, Required Operations, Concurrency Challenges and Approach 1: Single Lock with Conditions. Depth: Stop before Approach 2. Python locks do not promise the fair-lock starvation guarantee shown in the analysis table.

**Focus**

- A lock protects an invariant across all its reads and writes. A semaphore counts admission permits; it does not by itself protect the buffer mutation.
- Check the predicate under the condition's lock and `wait` in a loop. `wait` releases that lock while sleeping and reacquires it before returning; `notify` does not release it.
- Remove circular lock acquisition with a global lock order. Livelock changes state without useful progress; starvation denies one participant progress while others advance.
- Use barriers and events to control test schedules. A timeout detects a stuck test; it does not identify the underlying wait cycle.

**Reproduce:** Force two threads to read the same counter before either writes using a `Barrier(2)` between read and write. After both `join`, assert 1 instead of the intended 2 on both default and free-threaded builds. Remove that barrier from the critical section, lock the full read-modify-write and assert 2. In a separate test, give two threads opposite first locks, synchronize them at a barrier and use timed second acquisitions to demonstrate the wait cycle without leaving hung threads. Then use one global lock order and assert both finish.

**Traps**

- Waiting while holding an unrelated lock needed by the notifier. `Condition.wait` releases only its own lock.
- Putting the test barrier inside the repaired critical section. The first thread then waits for a second thread that cannot enter.
- Assuming mutex or condition wakeups are FIFO. Python gives no general starvation-freedom guarantee.

**Practice**

- [AlgoMaster: Design Thread-Safe Blocking Queue](https://algomaster.io/learn/concurrency-interview/design-thread-safe-blocking-queue) - Problem Statement: `put`, `take`, `offer`, `poll`, `peek` and `size`; Approach 1: Single Lock with Conditions. Implement the single-lock design in Python. Test capacity one, blocked producer and consumer, FIFO order and unique item delivery with events rather than sleeps. Do not claim Java-style thread interruption or fair-lock guarantees for Python.

**Stop when:** Your controlled tests expose the lost update and wait cycle, the repairs pass, and the blocking queue preserves its capacity and delivery invariants with multiple producers and consumers.

<details>
<summary>Self-test</summary>

1. Why use `while` rather than `if` around `Condition.wait`?
   - A wakeup does not reserve the resource. Another participant may consume it before this thread reacquires the lock.
2. Does `notify` preserve a message for a future waiter?
   - No. Persistent state is the predicate; check and update it under the same lock used by `wait`.
3. When can `empty` and `full` semaphore counts sum to less than capacity?
   - After a producer or consumer acquires a permit but before it releases the opposite permit. Reserved in-flight permits are missing from that sum.
4. What does a fixed lock order prevent, and what does it not promise?
   - It prevents a circular wait among those locks if all paths obey it. It does not guarantee fairness, bounded latency or freedom from other waits.

</details>

#### U3. Task ownership, cancellation, timeouts and retries

**About 6 h** · **Target:** Implement

Topics: Task ownership, task groups, cancellation and cleanup; Timeouts, deadlines, retry budgets, jitter and idempotency

A task that outlives its caller still consumes capacity. A retry that ignores ownership, deadlines or side effects can turn one transient failure into overload or duplicate work.

**You can now**

- Own related tasks with `TaskGroup` and propagate cancellation after bounded cleanup.
- Implement a monotonic end-to-end deadline with classified failures, capped backoff, jitter and a retry budget.
- Reject unsafe retries when a timeout leaves a side effect's outcome unknown.

**Study**

1. [Async task lifecycle first pass](https://algomaster.io/learn/concurrency-interview/python-asyncio-fundamentals) (AlgoMaster Concurrency) - Error Handling: `TaskGroup` for Structured Concurrency (Python 3.11+); Cancellation; Timeout with `asyncio.timeout` (Python 3.11+). Depth: Use the 3.14 reference below for exact failure and cancellation semantics, not older `gather`-based ownership patterns.
2. [CPython 3.14 task ownership and deadlines](https://docs.python.org/3.14/library/asyncio-task.html#task-groups) (Python concurrency documentation) - Task cancellation; Task groups and version-change notes; Timeouts: `timeout` and `timeout_at`; Running in threads: `to_thread`.
3. [Retries are additional load](https://builder.aws.com/content/3EumjoZascWd1oZiEgL8ORlv3qE/timeouts-retries-and-backoff-with-jitter) (Timeouts, retries, and backoff with jitter) - Timeouts; Retries and backoff; Jitter. Depth: The five-layer example's 243 is $`3^5`$ total attempts. Its phrase 'three retries' is inconsistent with that arithmetic; four attempts per layer would give $`4^5 = 1024`$.

**Focus**

- `TaskGroup` awaits owned children on exit. A non-cancellation child failure cancels siblings and groups ordinary errors; one child's `CancelledError` alone does not fail the group. Clean up in `finally` and normally re-raise cancellation.
- `TaskGroup` and `timeout` arrived in 3.11. In 3.13 `TaskGroup` improved simultaneous cancellation/count handling and closes coroutines submitted while inactive; in 3.14 `create_task` forwards all `kwargs`, including `eager_start`. Do not depend on accidental task-start ordering.
- Set one deadline with `loop.time()` and `timeout_at`. Queue waits, attempts and backoff spend the same budget. Catch `TimeoutError` outside the `timeout` context; cancellation is cooperative, not a hard real-time stop.
- Retry only classified transient failures and idempotent operations. Pick one retry owner, cap total attempts and aggregate retry load, and inject `clock`, `random` and `sleep` functions for deterministic policy tests.

**Reproduce:** Build an event-gated `TaskGroup`: one child waits indefinitely with a `finally` marker, another waits for it to start then raises `ValueError`. Assert the sibling is cancelled, cleanup ran and `except* ValueError` receives the failure. Separately assert a child raising `CancelledError` leaves a successful sibling intact, and an expired `timeout` around an `await` becomes `TimeoutError` outside the context. Add a fake dependency that fails twice then succeeds: three total attempts and full-jitter delays in `[0, min(cap, base*2**k)]`. Inject `random` and `sleep` to check the bounds without wall-clock assertions. Test permanent failure, exhausted budget, expired deadline and cancellation during backoff with no later attempt.

**Traps**

- Catching `BaseException` in a retry loop and thereby retrying `CancelledError`. Cancellation is not a transient dependency failure.
- Giving every attempt a fresh end-to-end timeout. This silently lets retries exceed the caller's deadline.
- Assuming cancellation of a `to_thread` `await` stops an already-running thread or rolls back a remote side effect. Use cooperative worker stop signals and an explicit unknown-outcome policy.

**Practice**

- The section mini-project covers this: `TaskGroup`-owned workers, request deadlines, classified retry budgets, jitter and cancellation cleanup against a fault-injected dependency.

**Stop when:** Your tests show no child left running after group exit and no retry after cancellation, permanent failure, exhausted budget or deadline expiry; duplicate delivery has an explicit idempotency policy.

<details>
<summary>Self-test</summary>

1. What differs between `TaskGroup` and `gather` on an ordinary child failure?
   - `TaskGroup` cancels and awaits siblings before reporting grouped errors. Default `gather` propagates the first error without automatically cancelling its other awaitables.
2. Where do you catch `asyncio.timeout`'s `TimeoutError`?
   - Outside its `async with` block. Inside, expiry is delivered through cancellation of the current task.
3. Three total attempts at each of five retrying layers yield what worst-case leaf load?
   - $`3^5 = 243`$ leaf attempts for one original request. Three retries plus the initial attempt would instead yield $`4^5 = 1024`$.
4. Does a timed-out write prove the server did not commit it?
   - No. Its outcome may be unknown. Retry only with a valid idempotency contract or reconcile the result first.

</details>

#### U4. Backpressure, load shedding and graceful shutdown

**About 5 h** · **Target:** Implement

Topics: Bounded queues, admission control, backpressure and load shedding; Signals, graceful shutdown and partial-work disposition

A queue turns a capacity mismatch into waiting and memory use. Bounding only the queue is not enough if unlimited producers or retry tasks accumulate outside it.

**You can now**

- Implement bounded admission with an explicit wait, reject or shed policy under overload.
- Account for queued, executing and externally waiting work when setting memory and downstream budgets.
- Stop admission, drain accepted work within a deadline and report unfinished work on forced shutdown.

**Study**

1. [Bounded Buffer](https://algomaster.io/learn/concurrency-interview/bounded-buffer) (AlgoMaster Concurrency) - Problem Statement; Synchronization Challenges; Solution 2: Semaphore-Based Solution; Solution 3: Monitor-Based Solution (Condition Variables). Depth: Skip the Key Insight assertion that `empty.count + full.count` always equals capacity. It omits permits reserved by in-flight producers and consumers. Do not copy starvation-free claims into Python.
2. [Bounded queues and drain accounting](https://docs.python.org/3.14/library/asyncio-queue.html#asyncio.Queue) (Python concurrency documentation) - `Queue`: `maxsize`, `put`, `put_nowait`, `get`, `task_done`, `join` and `shutdown`, including `immediate` `shutdown` warning and `QueueShutDown`.
3. [Protect useful capacity during overload](https://sre.google/sre-book/handling-overload/) (Site Reliability Engineering - overload and troubleshooting) - The Pitfalls of Queries per Second; Client-Side Throttling; Utilization Signals; Handling Overload Errors, Deciding to Retry; Conclusions. Depth: Use the local admission and retry-budget principles. Skip Google-specific datacenter balancing and quota infrastructure.
4. [Deliver termination to the event loop](https://docs.python.org/3.14/library/asyncio-eventloop.html#unix-signals) (Python concurrency documentation) - Unix signals: `loop.add_signal_handler` and `loop.remove_signal_handler`; main-thread requirement.

**Focus**

- For $`W`$ workers taking one item each and queue capacity $`Q`$, admitted unfinished items are at most $`W + Q`$ only if there are no extra prefetches, detached retries or unbounded admission waiters. Bound payload bytes as well as item count.
- If arrival rate exceeds service rate, excess work must wait elsewhere or be rejected. A semaphore limits simultaneous work, not starts per second; rate limits and retry budgets protect a different constraint.
- `Queue.shutdown` arrived in 3.13. Graceful shutdown rejects puts, wakes blocked putters and lets existing items drain. Call `task_done` once per successful `get` after recording the item's outcome; `join` tracks unfinished accounting, not business success.
- On `SIGTERM` stop admission first, drain within a monotonic deadline, then cancel and await workers and report unfinished IDs. Immediate shutdown discards queued items; it is an abort policy, not a successful drain.

**Reproduce:** Make a two-worker pipeline with `Queue(maxsize=2)`, event-gated consumers and `put_nowait` admission. Hold two items in workers and two in the queue, assert four admitted unfinished items and reject the fifth with `QueueFull`. Stop admission using `shutdown()`, release consumers, `await` `join` and assert all four accepted IDs have recorded terminal outcomes. Verify a blocked putter wakes with `QueueShutDown`. Repeat with `shutdown(immediate=True)`: queued items are discarded and `join` can return without those items being processed. Add a drain deadline and report abandoned IDs rather than labelling that run successful.

**Traps**

- Creating one producer task per arrival before awaiting a bounded `put`. The queue is bounded but waiting tasks and their payloads are not.
- Calling `task_done` before recording success, failure or abandonment. `join` can then hide silent loss.
- Treating `immediate` `shutdown` as proof of completed work. In-flight items still need accounting, and discarded queued items were not processed.

**Practice**

- [AlgoMaster: Bounded Buffer](https://algomaster.io/learn/concurrency-interview/bounded-buffer) - Problem Statement, The Rules and The Goal; Solution 3: Monitor-Based Solution (Condition Variables). Solve the bounded producer-consumer contract before reading the solution. Then adapt it to the async mini-project and add overload rejection, outcome accounting and shutdown tests. The semaphore-count shortcut noted above is not an invariant during operations.

**Stop when:** Your event-gated overload test respects the four-item bound, rejects excess work, drains accepted IDs with explicit outcomes, and distinguishes forced abandonment from successful completion.

<details>
<summary>Self-test</summary>

1. What changes when $`\lambda`$ exceeds $`\mu`$ for a sustained interval?
   - Without rejection, backlog grows roughly at $`\lambda - \mu`$ items per second while capacity stays fixed. A bounded queue moves that pressure to admission.
2. Is `Queue(maxsize=0)` a zero-capacity rendezvous?
   - No. In asyncio it is unbounded. Use a positive capacity and a separate admission policy.
3. Does `join` prove every accepted item succeeded?
   - No. It proves the unfinished-item count reached zero. Your outcome ledger must distinguish success, failure and abandonment.
4. Can a concurrency semaphore enforce ten calls per second?
   - No. Fast calls can reuse permits many times per second. A time-based rate limiter controls starts; a semaphore controls simultaneous calls.

</details>

#### U5. Profiling CPU and memory, and benchmarking honestly

**About 6 h** · **Target:** Measure

Topics: Sampling versus instrumentation and wall versus CPU time; CPU profiles, allocation traces, RSS and memory retention; Warmup, repeated trials, workload control and raw results

Profiles locate expensive work; benchmarks test whether changing it helps. Mixing the two can turn profiler overhead, hidden queueing or a changed workload into an apparent improvement.

**You can now**

- Choose sampling, call instrumentation or allocation tracing to test a concrete bottleneck hypothesis.
- Distinguish CPU cost, transient allocation peaks and retained Python memory from waiting and process RSS.
- Build a correctness-checked benchmark with warm-up, repeated trials and raw results, then justify one optimization and a regime where it does not help.

**Study**

1. [High Performance Python, 3rd edition: targeted profiling](https://www.oreilly.com/library/view/high-performance-python/9781098165956/) (High Performance Python, 3rd edition) - Chapter 2: Profiling Efficiently (pp. 28-29), Using the `cProfile` Module (pp. 41-45), Using `memory_profiler` to Diagnose Memory Usage (pp. 53-60), Introspecting an Existing Process with PySpy (pp. 63-64), Unit Testing During Optimization to Maintain Correctness (pp. 73-76), Strategies to Profile Your Code Successfully (p. 77). Depth: Learn tool selection and output interpretation. Do not install every profiler or assume the book's tool versions support both 3.14 builds; execute the stdlib reproduction below.
2. [Call profiles are not benchmarks](https://docs.python.org/3.14/library/profile.html) (Python concurrency documentation) - Introduction to the profilers; Instant User's Manual: `tottime` and `cumtime`; What Is Deterministic Profiling?
3. [Temporary peaks versus retained allocations](https://docs.python.org/3.14/library/tracemalloc.html) (Python concurrency documentation) - Examples: Compute differences; Record the current and peak size of all traced memory blocks; API: `get_traced_memory`, `reset_peak` and `Snapshot.compare_to`.
4. [Measuring the right thing, with less noise](https://en.algorithmica.org/hpc/profiling/noise/) (Algorithmica - Getting Accurate Results) - Getting Accurate Results: Measuring the Right Thing; Reducing Noise. Depth: The examples are C++. Carry over the checks, not the code: a fixed input distribution, latency versus throughput, warm-up, frequency scaling, pinning and treating small differences as an A/B test.

**Focus**

- Sampling estimates where observed stacks spend time and can miss short events. Instrumentation records calls but perturbs execution. Choose a supported tool and timer for the hypothesis, not the prettiest report.
- `cProfile` `tottime` excludes callees; `cumtime` includes them. Suspended async work and worker processes need separate interpretation; a request's wall time is not its CPU time.
- `tracemalloc` sees traced Python allocations, not all native buffers or RSS. Compare snapshots after the same lifecycle stage for retention; reset the peak for transient allocations and record process memory separately.
- Benchmark without profilers under matched input and offered load. Save correctness checks, hardware, Python build, worker count, start method, warm-up, all trials, throughput, latency distribution, rejection rate and queue depth. Include queue wait in end-to-end latency.

**Reproduce:** Write `sum(list(range(n)))` and `sum(range(n))` for `n = 100_000` and check both against `n*(n-1)//2`. Profile the materialized version with `cProfile`, then measure traced current and peak memory for each in fresh tracing sessions. The list version should have a larger temporary peak; do not require particular bytes or speedups. Retain 1,000 `bytearray(1024)` objects, compare snapshots before and after, clear the retaining list, collect garbage and compare again. Then benchmark both sum variants without tracing at small and larger `n`, with one warm-up and five trials each, saving CPU and full Python version/build with raw times. Explain an optimization's supported workload region rather than extrapolating to a service.

**Traps**

- Timing task creation instead of awaiting completion, or hiding admission delay by starting the latency clock only after enqueue.
- Calling high RSS a Python-object leak. Allocator retention and native memory can keep RSS high after traced allocations fall.
- Reporting the fastest trial, changing total work, or benchmarking with `cProfile` or `tracemalloc` enabled.

**Practice**

- The section mini-project covers this: CPU and retention diagnosis plus a controlled before/after pipeline benchmark with one justified improvement and one rejected optimization.

**Stop when:** You can identify the materialization peak and retention site from evidence, preserve the result oracle, and present raw unprofiled trials with a workload-limited conclusion rather than a single best time.

<details>
<summary>Self-test</summary>

1. What does a high `cumtime` but low `tottime` suggest?
   - The function's callees account for much of its observed cost. Inspect those callees before rewriting the wrapper.
2. Can a snapshot after a function returns reveal its freed temporary list?
   - Not as a live allocation. Use peak tracing during the function for temporary memory and snapshots for allocations still retained.
3. Why can low CPU usage coexist with high request latency?
   - The request may wait in a queue, on a lock, for I/O or for a downstream service. CPU profiles alone do not distinguish all those waits.
4. Why keep failures and rejections in a concurrency benchmark?
   - A design can appear faster by dropping slow work. Compare completed throughput, end-to-end latency and failure rate at the same offered load.

</details>

#### U6. Structured logs, metrics and traces

**About 5 h** · **Target:** Implement

Topics: Structured logs, correlation IDs and secret redaction; Low-cardinality metrics, latency distributions and queue depth; Trace context, spans and cross-boundary latency

A profile explains where code spends resources; telemetry explains which requests and failures are affected. Correlation should make a fault diagnosable without turning every request ID into a metric series.

**You can now**

- Add structured event logs, low-cardinality counters and latency histograms to a bounded service.
- Preserve trace context through async workers and link request logs to the relevant span.
- Locate a seeded dependency failure using telemetry while excluding credentials and request payloads.

**Study**

1. [Instrument one request, not a whole platform](https://opentelemetry.io/docs/languages/python/instrumentation/) (OpenTelemetry Python instrumentation) - Setup; Traces: Creating spans, Creating nested spans, Get the current span, Set span status, Record exceptions in spans, Change the default propagation format; Metrics: Creating and using synchronous instruments; Logs; Semantic convention stability. Depth: Use local or in-memory exporters and pin the SDK version. The Logs API/SDK is under development; structured Python logging plus explicit trace/span fields is sufficient. Do not build a Collector deployment.
2. [Metric attribute sets have a budget](https://opentelemetry.io/docs/specs/otel/metrics/sdk/#cardinality-limits) (OpenTelemetry Python instrumentation) - Cardinality limits: Configuration, Overflow attribute, Synchronous instrument cardinality limits and Asynchronous instrument cardinality limits. Depth: Understand limits and overflow, not SDK internals. Keep the application's label space bounded even when an SDK limit exists.
3. [Minimize sensitive telemetry at the source](https://opentelemetry.io/docs/security/handling-sensitive-data/) (OpenTelemetry Python instrumentation) - Your responsibility; Data minimization; Protecting sensitive data; Risk and limitations of hashing for anonymization.

**Focus**

- Log event name, request ID, trace ID, span ID, outcome class and elapsed time as fields. Allowlist fields before serialization; exception messages and URLs can contain secrets too.
- Use counters for completed, failed, rejected and retried work; a histogram for latency; and a gauge for current queue depth. Route templates and bounded error classes are labels; raw paths, user IDs and request IDs are not.
- Create child spans while the intended parent context is active. New asyncio tasks copy current context at creation; a long-lived queue worker needs the producer's context carried with each item rather than assumed ambient context.
- Trace IDs join per-request evidence but do not describe aggregate health. Sampling may omit a request's trace; keep useful error logs and metrics even when no exported trace is available.

**Reproduce:** Instrument a request span with a dependency child span created in an owned async task. Capture spans and structured logs locally, and record a request counter and duration histogram labelled only by route template and outcome. Run 100 distinct request IDs with one seeded dependency failure. Assert child parent IDs and trace IDs agree, logs carry the active span identity, and each metric has only the two expected attribute sets: `ok` and `error`. Pass a dummy authorization secret and assert it appears nowhere in exported logs, spans or metrics. Mark the dependency span `ERROR` and locate that request from the signals, without new `print` statements.

**Traps**

- Putting `trace_id` or `request_id` on every metric. Correlation then creates unbounded attribute sets instead of a useful aggregate.
- Assuming the context of a task created at startup follows every item it later dequeues. Propagate the item's context explicitly.
- Treating hashed user IDs as safe anonymization or recording full exception payloads before redaction. Predictable hashes can be reversed by enumeration.

**Practice**

- The section mini-project covers this: structured request logs, bounded-label metrics, per-item trace propagation, secret exclusion and diagnosis of a seeded pipeline fault.

**Stop when:** You can find the seeded failure by request and trace identity, verify parentage and the bounded metric attribute sets, and prove the dummy secret is absent from every exported signal.

<details>
<summary>Self-test</summary>

1. Why can two bounded labels still create many metric series?
   - Distinct combinations multiply. Budget the full attribute-set space, not each label in isolation.
2. Does `record_exception` automatically express your handled failure policy?
   - No. It records an exception event. Set span status deliberately when a handled failure makes the operation unsuccessful.
3. Which signal reveals queue pressure without looking up a particular request?
   - A queue-depth gauge together with admission rejection, retry and latency metrics. Logs and traces explain individual cases.
4. How should a queue worker recover a producer's trace context?
   - Carry the context with the item and attach it while processing, detaching in `finally`. Task-creation context alone is not per-item propagation.

</details>

#### U7. Health checks, containers, supervision and runbooks

**About 6 h** · **Target:** Implement

Topics: Readiness, liveness and dependency health; Container builds, non-root execution, limits and signals; Process supervision and diagnosis runbooks

A running process is not necessarily ready to serve, and restarting it is not always a repair. Health and supervision need distinct contracts backed by an operator's recovery checks.

**You can now**

- Separate readiness, liveness and startup checks so a dependency outage does not cause a restart storm.
- Package a non-root service with pinned inputs, validated runtime configuration, explicit resource limits and a tested termination path.
- Write and exercise a runbook for latency, memory growth, worker death, invalid configuration and dependency recovery.

**Study**

1. [Three health questions with different actions](https://kubernetes.io/docs/concepts/workloads/pods/probes/) (Liveness, Readiness, and Startup Probes) - Liveness probe; Readiness probe; Startup probe. Depth: Read only the contracts and failure actions. Implement local endpoints; cluster orchestration stays outside this section.
2. [Containerize a Python service](https://docs.docker.com/guides/python/#containerize-a-python-application) (Docker guides) - Containerize a Python application: Create the Docker assets, `Dockerfile` and `.dockerignore` examples; Run the application. Depth: Stop before Use containers for Python development. Adapt only the packaging to your service. The sample uses Python 3.12 and an authenticated DHI registry; use an official Python 3.14 image pinned by digest instead, with explicit `USER` and exec-form `CMD` as below. No registry login or database is needed.
3. [Reproducible inputs and a non-root entrypoint](https://docs.docker.com/build/building/best-practices/) (Docker guides) - Pin base image versions; Exclude with `.dockerignore`; `Dockerfile` instructions: `CMD`, `ENV`, `ENTRYPOINT` and `USER`.
4. [Resource limits and supervision](https://docs.docker.com/engine/containers/resource_constraints/) (Docker guides) - Memory: Limit a container's access to memory, `--memory` and `--memory-swap`; CPU: `--cpus`; then Start containers automatically, Use a restart policy and Restart policy details. Depth: Use https://docs.docker.com/engine/containers/start-containers-automatically/ for the restart-policy reading. Do not disable the OOM killer or configure privileged scheduling.
5. [A runbook tests hypotheses and verifies recovery](https://sre.google/sre-book/effective-troubleshooting/) (Site Reliability Engineering - overload and troubleshooting) - Triage; Examine; Diagnose; Test and Treat; Making Troubleshooting Easier. Depth: Skip Case Study and Negative Results Are Magic. Use the named method sections to write commands and expected observations for your small service, not an organization-wide incident process.

**Focus**

- Readiness controls admission; liveness asks whether restarting can restore progress. Startup checks protect slow initialization. A required dependency may make readiness fail while the process remains live; do not wire every dependency failure to liveness.
- Validate typed runtime configuration before becoming ready. Keep secrets outside source, build context and image layers, and redact diagnostics. Pin base-image digests and dependencies, with an explicit update policy.
- Use non-root `USER` and exec-form `CMD` so the application receives termination signals. Set CPU and memory limits at runtime; CPU quota can throttle, and memory exhaustion can kill the process before it cleans up.
- A plain Docker restart policy reacts to process exit, not an unhealthy flag. Choose one supervisor, cap failure restarts where appropriate and record exit/OOM evidence. A runbook names symptom, safe test, expected observation, mitigation, rollback and recovery gate.

**Reproduce:** Containerize a small health-enabled version of the pipeline on CPython 3.14 with a pinned base digest, non-root `USER` and exec-form `CMD`. Run with `--cpus=1 --memory=128m --memory-swap=128m` and inspect both configured limits and cgroup values. Validate startup configuration before readiness. Inject a required-dependency outage: readiness fails, liveness stays healthy and recovery restores readiness without a restart. Send `SIGTERM` with accepted work in flight: readiness drops, new work is rejected and recorded work drains before the stop deadline. In a separate run, force a nonzero process exit and verify a bounded `on-failure` policy restarts it. Capture exit status and restart count, then follow your runbook to confirm recovery.

**Traps**

- Using dependency reachability as liveness. Restarting every replica during a shared outage adds load and loses useful local state.
- Deleting a secret in a later `Dockerfile` layer. The earlier layer still contains it; prevent it from entering the image at all.
- Assuming Docker `HEALTHCHECK` removes traffic or `on-failure` repairs an unhealthy but running process. Those actions need a separate consumer of the health signal.

**Practice**

- The section mini-project covers this: health contracts, non-root bounded container execution, configuration validation, `SIGTERM` drain, supervised failure recovery and an exercised operational runbook.

**Stop when:** The container checks demonstrate non-root identity, enforced limits, dependency recovery without restarts, graceful `SIGTERM` handling and bounded crash recovery; another reader can execute the runbook and confirm its recovery gate.

<details>
<summary>Self-test</summary>

1. What does a failed readiness probe do in Kubernetes?
   - It marks the Pod unready for Service traffic. It does not itself restart the container. Liveness failures trigger restarts after configured tolerances.
2. Why distinguish a startup check from liveness?
   - A startup probe gates readiness and liveness probing until initialization succeeds, avoiding premature restart decisions.
3. Does `--cpus=1` reserve a dedicated physical core?
   - No. It limits available CPU time through quota. Placement and contention are separate constraints.
4. Why check `OOMKilled` as well as an exit code such as 137?
   - An exit code alone does not identify the cause of `SIGKILL`. Runtime OOM evidence and memory metrics help distinguish limit exhaustion from an external kill.

</details>

### Mini-project: Bounded async worker pipeline with overload, cancellation, telemetry and a container runbook

**About 12 to 16 hours.** Give the task runner an execution engine: a bounded async pipeline with deadlines, retries, telemetry and a container runbook. Profile it honestly and make every failure visible through signals another reader can follow.

1. Compare matched CPU work across serial, thread and process modes on the available Python builds, including a free-threaded one where available, then show an event-loop blocking fault and its move off the loop.
2. Build the bounded pipeline with `TaskGroup` workers that rejects excess work, drains on shutdown and reports abandoned work instead of success when the drain expires, following the AlgoMaster Bounded Buffer problem.
3. Run each task under a monotonic deadline with classified retries, jittered backoff and cancellation cleanup, tested against a fault-injected dependency that fails then succeeds.
4. Profile a large batch for the hot spot and retained memory, fix one cause, then benchmark the improvement without the profiler and record one rejected optimization with its numbers.
5. Instrument runs with spans, queue-wait children, JSON logs and bounded-label counters, exclude secrets from every signal, and locate one seeded failure from the signals alone.
6. Ship a non-root bounded container with liveness and readiness gates, exercise the dependency outage and `SIGTERM` drain, and write a runbook a second reader follows to recovery.

**Deliverables**

- The pipeline with overload, shutdown, deadline, retry and cancellation tests plus the executor timings.
- A profiling note with the hot spot, the retention fix, the benchmark and the rejected optimization.
- Telemetry tests, the container definition and the exercised runbook with outage and drain transcripts.

**Checks**

- rubric: Self-grade with the rubric below.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Bounded concurrency | The overload test rejects excess work, and every accepted run ends recorded or is reported abandoned. | Executor choices cite the matched-work timings, and the blocking fault shows the stalled and advancing heartbeat. |
| Failure handling | No retry follows permanent failure, an exhausted budget, an expired deadline or cancellation, and no worker outlives its owner. | Backoff bounds are tested without wall-clock waits, and an idempotency note covers already-applied retries. |
| Performance evidence | The hot spot and retention site come from profiler output, and the kept improvement has unprofiled trials. | The note states the workload region where the gain holds and why the rejected optimization lost. |
| Failure telemetry | Parent and trace ids agree across the queue, metrics carry only bounded labels, and secrets appear in no signal. | The seeded failure is traced from a metric to a span to a log line without added prints. |
| Container operations | The container runs non-root under its limits, survives the outage without a restart, and drains on `SIGTERM`. | A second reader followed the runbook to recovery, and the steps they found unclear were fixed. |

Feeds into: The bounded pipeline with backpressure, cancellation and telemetry, the injected outage and the clean-checkout runbook for the capstone.

### Resource route

- **Primary - Course:** [AlgoMaster Concurrency](https://algomaster.io/learn/concurrency-interview/course-roadmap) - Study Concurrency 101; the Python units on threads, the GIL, multiprocessing, asyncio and concurrent.futures; synchronization primitives; concurrency challenges; locking strategies; and concurrency patterns. Then solve Bounded Buffer, Thread-Safe Blocking Queue, Thread-Safe Rate Limiter and Task Scheduler with Dependencies.
- **Required - Reference:** [Python concurrency documentation](https://docs.python.org/3/library/concurrency.html) - Use asyncio task groups, cancellation, queues and timeouts; concurrent.futures; multiprocessing; threading; and signal documentation to verify lifecycle and failure behavior.
- **Required - Implementation:** [High Performance Python, 3rd edition](https://www.oreilly.com/library/view/high-performance-python/9781098165956/) - Read Chapter 2 Profiling to Find Bottlenecks, Chapter 9 Asynchronous I/O, Chapter 10 The multiprocessing Module and Chapter 12 Using Less RAM, and use the companion code (https://github.com/mynameisfiber/high_performance_python_3e) as experiment starting points. Change the workloads and measure the regimes where concurrency helps, loses or only moves the bottleneck.
- **Support - Theory:** [Operating Systems: Three Easy Pieces - concurrency](https://pages.cs.wisc.edu/~remzi/OSTEP/) - Read Chapters 26-33, from threads through event-based concurrency, for locks, condition variables, semaphores, concurrency bugs and event loops. Do selected homework only for a weak mechanism.
- **Support - Implementation:** [Docker guides](https://docs.docker.com/guides/python/) - Use the Python container guide and build best practices to run as non-root, pin dependencies, handle signals and test CPU and memory limits.
- **Support - Operations:** [OpenTelemetry Python instrumentation](https://opentelemetry.io/docs/languages/python/instrumentation/) - Manually instrument one request so its structured logs, one low-cardinality metric and one trace share a correlation identity. Use the telemetry to locate one seeded fault.
- **Support - Reference:** [Algorithmica - Getting Accurate Results](https://en.algorithmica.org/hpc/profiling/noise/) - Use Measuring the Right Thing and Reducing Noise for benchmark design: input distribution, latency versus throughput, warm-up, frequency scaling and pinning. The examples are C++; the checks transfer to Python.
- **Required - Operations:** [Timeouts, retries, and backoff with jitter](https://builder.aws.com/content/3EumjoZascWd1oZiEgL8ORlv3qE/timeouts-retries-and-backoff-with-jitter) - Read Timeouts, Retries and backoff, and Jitter for deadline scope, idempotency, one retry owner and bounded retry load. Interpret the five-layer example as three total attempts per layer, not three retries plus the initial attempt.
- **Required - Operations:** [Site Reliability Engineering - overload and troubleshooting](https://sre.google/sre-book/handling-overload/) - Read Chapter 21, The Pitfalls of Queries per Second, Client-Side Throttling, Utilization Signals, Handling Overload Errors and Conclusions. Read Chapter 12, Triage, Examine, Diagnose, Test and Treat, and Making Troubleshooting Easier for a service runbook. Skip datacenter load-balancing implementation details.
- **Required - Reference:** [Liveness, Readiness, and Startup Probes](https://kubernetes.io/docs/concepts/workloads/pods/probes/) - Read Liveness probe, Readiness probe and Startup probe for the different health decisions and failure actions. Apply the contracts to a local service; do not install Kubernetes or configure a cluster.

### Exit checkpoint

Run a bounded worker pipeline through overload, cancellation and worker failure, then use profiles, logs and metrics to justify one measured improvement and one rejected optimization.

<details>
<summary>Deliberately left for later</summary>

- Cluster orchestration and service meshes
- Kernel tracing beyond a concrete diagnosis
- Organization-scale observability platforms

</details>

## 05. C & C++ Systems Literacy

**Why:** GPU kernels, runtimes and Python extensions cross native boundaries. You need enough layout, lifetime and build fluency to make a safe bounded change and understand the resulting machine behavior.

### Learn this much

- [ ] Preprocess, compile, assemble, link, load and symbols _(Required)_
- [ ] Warnings, debug symbols, optimization and ABI compatibility _(Required)_
- [ ] Integer representation, conversions and overflow _(Required)_
- [ ] Pointers, references, arrays and explicit spans _(Required)_
- [ ] Struct and class layout, padding, alignment and strides _(Required)_
- [ ] Stack and heap storage duration and allocation _(Required)_
- [ ] RAII, ownership and smart pointers _(Required)_
- [ ] Copy, move and object lifetime through exceptions _(Required)_
- [ ] Templates and generic code at reading depth _(Required)_
- [ ] Container, iterator and invalidation contracts _(Required)_
- [ ] Out-of-bounds, lifetime, uninitialized access and undefined behavior _(Required)_
- [ ] Compiler diagnostics, sanitizers and debugger evidence _(Required)_
- [ ] Threads, data races, memory ordering and atomics at literacy depth _(Required)_
- [ ] Contiguous layout, locality, array of structures and structure of arrays _(Required)_
- [ ] Python/native dtype, shape, stride, ownership, GIL and error contracts _(Required)_
- [ ] Repeatable CMake configure, build and test targets _(Required)_
- [ ] C linkage and stable foreign-function boundaries _(Optional)_
- [ ] Advanced template metaprogramming _(Later)_

### Study units

#### U1. Compiling, linking, loading, ABI and C linkage

**About 4 h** · **Target:** Explain

Topics: Preprocess, compile, assemble, link, load and symbols; Warnings, debug symbols, optimization and ABI compatibility; C linkage and stable foreign-function boundaries

A native extension can compile successfully yet fail to link or import. Separating these stages lets you repair the boundary rather than change unrelated source code.

**You can now**

- Trace a source file through preprocessing, compilation, assembly, linking and loading, naming each artifact.
- Diagnose a missing declaration, missing definition or missing shared library at the responsible stage.
- Explain which ABI and ownership agreements a C-linkage boundary still needs.

**Study**

1. [Compilation Process](https://algomaster.io/learn/cpp/compilation-process) (AlgoMaster C++) - Recap of the Pipeline; Stage 1 through Stage 4; Putting It Together: A Two-File Build; Mapping Errors to Stages. Depth: Use the artifacts and error examples. Do not adopt the lesson's unmeasured optimization speedup ranges or its mention of trigraph translation: trigraphs were removed in C++17.
2. [Language linkage](https://en.cppreference.com/cpp/language/language_linkage#Explanation) (cppreference) - Explanation and Notes, including the `__cplusplus` conditional header example. Depth: Skip compiler-specific function-type overload disputes.
3. [Cross-compiler interfaces](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#ri-abi) (C++ Core Guidelines) - I.26: If you want a cross-compiler ABI, use a C-style subset.
4. [Linux dynamic linker/loader](https://man7.org/linux/man-pages/man8/ld.so.8.html#DESCRIPTION) (`ld.so`: dynamic linker/loader) - DESCRIPTION, including dependency search order and Dynamic string tokens; ENVIRONMENT entry `LD_DEBUG`. Depth: Stop before legacy hardware-capability directories and auditing.

**Focus**

- A declaration lets a translation unit type-check a call. A definition supplies the implementation; an object file can still contain unresolved symbols.
- Use `-Wall` `-Wextra` `-Wpedantic` and `-g` for development. Compare `-O0` and `-O2` artifacts without treating optimization as a correctness fix or a promised speedup.
- ABI covers calling conventions, representation and binary compatibility. extern C linkage does not make STL objects, exceptions or allocators portable across arbitrary binaries.
- The Linux loader searches for shared objects at runtime. A link-time `-L` directory is not automatically a runtime search path.

**Reproduce:** With g++ 15.2, `-std=c++20 -O0 -g` on Linux x86-64, define `extern "C" int inc(int x) { return x + 1; }` in one translation unit and declare it in another whose main returns `inc(41) == 42 ? 0 : 1`. Produce preprocessed text with `-E`, assembly with `-S` and objects with `-c`. Inspect `nm`: the defining object has `T inc` and the caller `U inc`. Linking only the caller fails with undefined reference to `inc`; linking both objects succeeds and exits zero. Compare `-O2` assembly, recording the flags rather than promising specific instructions.

**Traps**

- Including a header is not the same as linking the implementation that its declarations require.
- An unmangled C symbol is not a complete stable ABI. Agree on widths, buffer lengths, ownership, error codes and compatible platform conventions.
- Debug symbols and optimization are independent choices. Optimized code can have debug information while some source variables are optimized out.

**Practice**

- The section mini-project covers this: document the native component's build artifacts and ABI, and diagnose one missing-symbol or runtime-library failure.

**Stop when:** You reproduce the two-object link and correctly classify a missing header, unresolved symbol and missing runtime library, with a written C-boundary ownership contract.

<details>
<summary>Self-test</summary>

1. Why can `-c` succeed when a called function has no definition?
   - The declaration suffices for compilation. The object records an unresolved symbol for the linker to resolve.
2. An executable links but reports a missing `.so` when started. Which stage needs investigation?
   - Loading. Inspect the dependency name and runtime search paths, not just the source include path.
3. Does extern C make a function returning `std::vector<int>` safe for an arbitrary C caller?
   - No. It changes language linkage, not the vector representation, C type system or allocator ownership contract.

</details>

#### U2. Integer representation, pointers, references and spans

**About 4 h** · **Target:** Explain + Implement

Topics: Integer representation, conversions and overflow; Pointers, references, arrays and explicit spans

Native interfaces pass addresses and counts rather than Python objects. A correct value in the wrong integer type or a pointer without its extent can cross that boundary unsafely.

**You can now**

- Explain integer widths, signed and unsigned conversions, and the difference between representation and overflow rules.
- Read pointer and reference code without losing the array bounds or the referent's lifetime.
- Implement a span-based operation with explicit bounds and empty-input tests.

**Study**

1. [Integer representation and data models](https://en.cppreference.com/cpp/language/types) (cppreference) - Integral types: Standard integer types and Character types; Range of values; Data models. Depth: Skip floating-point tables and C++26 reflection. Use the C++20 rules.
2. [Integer promotions and conversions](https://en.cppreference.com/cpp/language/implicit_conversion#Integral_promotion) (cppreference) - Integral promotion and Numeric conversions: Integral conversions.
3. [Pointer Arithmetic](https://algomaster.io/learn/cpp/pointer-arithmetic) (AlgoMaster C++) - The Setup: What Pointer Arithmetic Means through The Rules: One Past the End and Undefined Behavior.
4. [References Basics](https://algomaster.io/learn/cpp/references) (AlgoMaster C++) - What a Reference Is through References as Return Values; Common Mistakes. Depth: Use the local-reference and dangling-return examples. The named-local rule of thumb is not the full set of temporary-lifetime extension rules.
5. [`std::span`](https://en.cppreference.com/cpp/container/span) (cppreference) - Opening contract; Member functions: Element access, Observers and Subviews; Notes and Example. Depth: Use the C++20 interface. `span::at` is C++26, so write an explicit bounds check for this unit.

**Focus**

- C++20 requires two's-complement signed representation, but signed arithmetic overflow is still undefined. Unsigned arithmetic wraps modulo 2 to the type's bit width.
- Conversions and promotions happen before arithmetic and comparisons. Narrow unsigned operands can promote to `int`, so inspect the expression type, not only the declared variable type.
- Pointer arithmetic advances by elements within an array, including its one-past position. That position may be compared but not dereferenced.
- A reference aliases an object; assignment through it does not rebind it. A span carries a contiguous extent but neither owns storage nor checks `operator[]` in C++20.

**Reproduce:** Using g++ 15.2 with `-std=c++20 -O0 -g`, write a function taking `std::span<int>` that doubles its elements. `int a[]{2,4,6}` becomes `{4,8,12}`; an empty span performs no writes. Write a separate checked accessor that throws `std::out_of_range` when `i >= size()`, and test `i == 3` on that array. Predict and check that `numeric_limits<unsigned>::max() + 1u` is zero and that `int n = -1` compared as `n < 1u` is false. Do not execute signed overflow to infer a wraparound rule: its behavior is undefined and no particular output is guaranteed.

**Traps**

- Replacing a pointer with a span does not extend the underlying array's lifetime.
- Treating `sizeof(pointer)` as the number of bytes in the pointed-to array.
- Checking for signed overflow after the overflowing expression has already been evaluated. Check the operands before arithmetic.

**Practice**

- [AlgoMaster Exercise: Pointer Arithmetic](https://algomaster.io/learn/cpp/pointer-arithmetic-exercise) - Exercises 1 to 5: offsets, prefix and postfix movement, a one-past-end sum, two-pointer reversal and a three-reversal rotation over one-past-end ranges. Write the valid pointer range before each loop. Then port Exercise 3 to `std::span` with an explicit bounds check and an empty-input test.

**Stop when:** Your span operation and checked accessor pass the boundary tests, and you can explain the conversions and lifetime of every pointer or reference they use.

<details>
<summary>Self-test</summary>

1. Does two's-complement representation guarantee signed wraparound in C++20?
   - No. Representation and arithmetic semantics are separate; signed arithmetic overflow remains undefined.
2. Can a one-past pointer be used as an end sentinel? Can it be read through?
   - It can be compared with pointers into that array. It cannot be dereferenced.
3. A function returns a span over a local array. Is its length enough to make it safe?
   - No. The local array dies on return, so the span dangles even though it retains the old extent.
4. Why does `-1 < 1u` evaluate to false?
   - The `int` operand converts to `unsigned int` under the usual arithmetic conversions. `-1` becomes the maximum `unsigned int` value.

</details>

#### U3. Struct layout, alignment, strides and locality

**About 5 h** · **Target:** Derive + Measure

Topics: Struct and class layout, padding, alignment and strides; Contiguous layout, locality, array of structures and structure of arrays

A dtype or stride mismatch changes which bytes native code reads. The same layout choices also decide how much useful data each memory access brings into the computation.

**You can now**

- Compute field offsets, padding and array strides for a measured native layout.
- Derive a byte offset from a base address, index, stride and field offset.
- Compare AoS and SoA for a controlled access pattern without assuming either layout must be faster.

**Study**

1. [Objects, representation and alignment](https://en.cppreference.com/cpp/language/object#Alignment) (cppreference) - Object representation and value representation; Size; Alignment, including the `S` and `X` examples. Depth: Skip implicit object creation and polymorphic layout. Use simple standard-layout structs for offset checks.
2. [Predictable memory access](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#rper-access) (C++ Core Guidelines) - Per.19: Access memory predictably, including the two matrix traversal orders.
3. [AoS and SoA trade-offs](https://www.intel.com/content/www/us/en/developer/articles/technical/memory-layout-transformations.html) (Memory Layout Transformations) - Overview; Topics; AOS Form (Array of Structs); SOA Form (Struct of Arrays). Depth: Read the layouts, not the Intel-specific array-notation syntax. Stop before AOSOA and the LIBOR example. Treat performance statements as hypotheses for your own access pattern.
4. [When AoS wins: whole-record access](https://en.algorithmica.org/hpc/cpu-cache/aos-soa/) (Algorithmica - AoS and SoA) - AoS and SoA: Experiment. Depth: Read the Experiment section only; the associativity and huge-page effects after it are beyond this unit. Its pointer chase reads every field of a randomly chosen record, the opposite of the Reproduce's single-field scan.

**Focus**

- `sizeof` includes padding. Alignment constrains legal object addresses, and trailing padding keeps successive array elements suitably aligned.
- For a standard-layout record array, a field's byte offset is `index * sizeof(record) + offsetof(record, field)`. For a strided view, use the supplied byte strides instead.
- AoS groups fields of one record; SoA groups one field across records. Field-wise scans and whole-record access can favor different layouts.
- Keep allocation, initialization and layout conversion outside a kernel-only timing. Preserve results so the compiler cannot discard the work, and do not infer cache misses from wall time alone.

**Reproduce:** On Linux x86-64 with g++ 15.2, `-std=c++20 -O0`, define `struct Row { char tag; std::int32_t count; char flag; };` print `offsetof` for all fields, `sizeof` and `alignof`. The observed values are offsets 0, 4, 8, size 12 and alignment 4. Thus `rows[2].flag` is at byte offset 2 * 12 + 8 = 32 from a three-element array's base. These are observations for that toolchain, not universal layout constants. Then compare summing `x` in `vector<Point>` where `Point` has `uint64_t` `x`,`y`,`z` against a separate `vector<uint64_t>` `x`: initialize both with `x[i] = i % 100`, use 1,048,576 records, g++ 15.2 `-std=c++20 -O2`, one warmup and seven timed scans per layout in alternating order, and consume each checksum. On your machine, record all timings and their medians with the CPU model, `sizeof(Point)` and allocated bytes. Python is not involved. Both checksums must be 51,903,600; no speed ranking is promised.

**Traps**

- Summing member sizes misses internal and trailing padding. Packing a struct is not a free optimization and can create unaligned accesses.
- Assuming an array of pointers stores the pointed-to objects contiguously.
- Declaring SoA faster from one timing, or comparing different data, access patterns or conversion costs.

**Practice**

- The section mini-project covers this: document field offsets and strides, then preserve a controlled AoS/SoA comparison with equal checksums and a reproducible measurement setup.

**Stop when:** Your offset predictions match the measured layout, both scan checksums match, and your seven-repeat report separates measured timings from untested cache explanations.

<details>
<summary>Self-test</summary>

1. Why can `sizeof(Row)` exceed the sum of its members' sizes?
   - Padding aligns members and successive array elements. The exact amount depends on the implementation and ABI.
2. A view has byte strides `(40, 8)`. What is the offset of element `[2,3]`?
   - 2 * 40 + 3 * 8 = 104 bytes from that view's base, assuming the indices are valid.
3. Why might SoA help a scan that reads only `x`, but not a workload consuming every field of scattered records?
   - SoA puts successive `x` values together. Scattered whole-record access instead benefits from keeping each record's fields close, as AoS does. Measure the actual workload.

</details>

#### U4. Storage duration, RAII, smart pointers and move semantics

**About 6 h** · **Target:** Explain + Implement

Topics: Stack and heap storage duration and allocation; RAII, ownership and smart pointers; Copy, move and object lifetime through exceptions

A buffer can be correctly indexed and still be dead. RAII makes cleanup follow ownership, including failure paths that are easy to miss with manual deletion.

**You can now**

- Distinguish storage duration from the lifetime and ownership of an object in that storage.
- Predict destruction and resource release through normal returns and caught exceptions.
- Implement an owning buffer with independent-copy, ownership-transfer and checked-access tests.

**Study**

1. [Stack vs Heap](https://algomaster.io/learn/cpp/stack-vs-heap) (AlgoMaster C++) - The Stack: Automatic and LIFO; The Heap: Dynamic and Manual; When to Use the Stack vs the Heap. Depth: Skip address-region diagrams and Performance Differences. Automatic and dynamic storage duration are language concepts, not guarantees about placement or allocation speed.
2. [RAII Pattern](https://algomaster.io/learn/cpp/raii) (AlgoMaster C++) - The Core Idea through Hand-Rolled Cleanup vs RAII Under Exceptions; A Note on the Rule of Three; Almost Always RAII.
3. [Exclusive ownership](https://algomaster.io/learn/cpp/unique-ptr) (AlgoMaster C++) - Constructing a `unique_ptr`; Move-Only Semantics; The Common Operations; Arrays with `unique_ptr<T[]>`.
4. [Shared ownership and observers](https://algomaster.io/learn/cpp/shared-ptr) (AlgoMaster C++) - When Shared Ownership Actually Makes Sense; The Control Block; Thread Safety, Precisely; What This Chapter Does Not Cover.
5. [Copy and move contracts](https://algomaster.io/learn/cpp/move-constructor) (AlgoMaster C++) - The Move Constructor Signature through When the Compiler Generates a Move Constructor; A Complete Example: Cart with Move and Copy. Depth: Skip the introductory claim that return-by-value necessarily copies and Exercise 7's unconditional `noexcept` rule. Copy elision can remove transfers, and `vector` can move a noncopyable element even if its move may throw.
6. [RAII and special members](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#rr-raii) (C++ Core Guidelines) - R.1: Manage resources automatically using resource handles and RAII; C.20: If you can avoid defining default operations, do; C.21: If you define or delete any copy, move, or destructor function, define or delete them all.

**Focus**

- An automatic smart-pointer handle can own a dynamically allocated object. The handle and the allocation have separate lifetimes.
- Scope exit and exception unwinding destroy fully constructed automatic objects in reverse construction order. A constructor that throws does not run that object's destructor, but already constructed members and bases are unwound.
- Prefer `vector` and the Rule of Zero for ordinary buffers. If you manage a raw resource, state copy and move contracts for constructors and assignment, and leave the moved-from object safe to destroy.
- `unique_ptr` expresses exclusive ownership. `shared_ptr` shares ownership, not synchronization of the pointee; `weak_ptr` observes without forming a strong ownership cycle.

**Reproduce:** With g++ 15.2 `-std=c++20 -O0 -g`, construct two local logging guards `A` then `B` inside a `try` block and throw `std::runtime_error` to an outer `catch`. Print only names from destructors and `'catch'` from the handler: the sequence is `B` `A` `catch`. Separately move `make_unique<int>(7)` into a second `unique_ptr` and assert the first is null and the second holds 7. Implement a `vector`-backed `Buffer` with a deep-copy contract, a custom move that resets the source to an empty state, and access that throws `std::out_of_range` for `i >= size()`. Check copy independence, move construction, move assignment, self-assignment, empty access and a caught exception after allocation. Keep the checks active in optimized builds; do not rely only on `assert` when `NDEBUG` is set.

**Traps**

- `std::move` is a cast that enables move overloads. It does not itself transfer resources; moving from a `const` object can select a copy.
- A `shared_ptr` reference count does not collect strong cycles or protect mutable data from concurrent access.
- RAII is not a promise of cleanup after process termination, `std::abort` or every uncaught exception. Test ordinary scope exit and caught unwinding.

**Practice**

- [AlgoMaster Exercise: RAII](https://algomaster.io/learn/cpp/raii-exercise) - Exercises 1 to 5: scoped release, closing on every return path, unlocking during unwinding, rolling back an uncommitted transaction and restoring a global setting after an exception. Predict the printed acquire and release order before running each one.
- [AlgoMaster Exercise: Copy-and-Swap Idiom](https://algomaster.io/learn/cpp/copy-swap-idiom-exercise) - Exercises 2 to 4: deep copy for copy-swap assignment, one by-value operator for copy and move, and leaving the target unchanged when copying throws. Carry the deep-copy and failed-copy checks into the owning `Buffer` tests.

**Stop when:** You predict the guard destruction trace and your buffer tests demonstrate independent copies, an explicitly empty moved-from state and cleanup through a caught exception.

<details>
<summary>Self-test</summary>

1. A constructor acquires two resources but the second acquisition throws. How should the first be protected?
   - Place it in an already constructed RAII member or local guard. That guard is destroyed during unwinding even though the enclosing object's destructor does not run.
2. Does copying a raw owning pointer produce an independent buffer?
   - No. It copies the address. Either duplicate the storage explicitly, prohibit copying, or use a value-owning member such as vector.
3. After moving a `unique_ptr` into another, which one owns the object?
   - The destination owns it; the source is null. This specific guarantee is stronger than assuming all moved-from types are empty.
4. Must a return-by-value function always call a copy or move constructor?
   - No. Copy elision can avoid both. C++17 guarantees elision for certain prvalue cases; named return value optimization is permitted but not generally mandatory.

</details>

#### U5. Templates, containers and iterator invalidation

**About 4 h** · **Target:** Explain

Topics: Templates and generic code at reading depth; Container, iterator and invalidation contracts

Native APIs commonly expose templates and STL types. Reading their contracts is enough to make bounded changes without learning advanced metaprogramming.

**You can now**

- Read a function or class template and identify its type arguments and required operations.
- Explain container choice using contiguity, access complexity and iterator stability.
- Determine which handles survive a vector mutation without dereferencing invalid ones.

**Study**

1. [Function Templates](https://algomaster.io/learn/cpp/function-templates) (AlgoMaster C++) - Anatomy of a Function Template; Template Argument Deduction; Explicit Template Arguments; Implicit vs Explicit Instantiation. Depth: Stop at reading instantiation syntax. Distinct instantiations are not a guarantee of distinct emitted machine-code bodies.
2. [Class Templates](https://algomaster.io/learn/cpp/class-templates) (AlgoMaster C++) - Declaring a Class Template; Multiple Type Parameters; Member Functions: In-Class vs Out-of-Class; Member Type Aliases; Nested Types and the typename Keyword. Depth: Skip member templates, friend templates and metaprogramming.
3. [`std::vector`](https://algomaster.io/learn/cpp/vector) (AlgoMaster C++) - Memory Layout: Contiguous Storage; Size vs Capacity; Removing Elements; Accessing Elements; `reserve`, `shrink_to_fit`, `resize`; Iterator Invalidation; Complexity Summary.
4. [Iterators](https://algomaster.io/learn/cpp/iterators-basics) (AlgoMaster C++) - The Generalised Pointer through `const_iterator` and Read-Only Access; Iterator Invalidation. Depth: Skip reverse, insert and stream adapters for this pass.
5. [Container contracts](https://en.cppreference.com/cpp/container#Iterator_invalidation) (cppreference) - Sequence containers; Associative containers; Unordered associative containers; Iterator invalidation table.
6. [Vector invalidation](https://en.cppreference.com/cpp/container/vector#Iterator_invalidation) (cppreference) - Iterator invalidation table, particularly `reserve`, `push_back`, `insert` and `erase`.

**Focus**

- A template describes compile-time generic code. Identify the operations its body needs from `T`, and read the first diagnostic referring to your instantiation before the library backtrace.
- `vector<T>` is contiguous for ordinary `T`, but `vector<bool>` is a special case. `list` provides different stability guarantees; unordered containers can invalidate iterators on rehash while preserving references to elements.
- `reserve` changes capacity, not size. Existing elements remain valid after `reserve` only when no reallocation occurs.
- Without reallocation, `push_back` still invalidates the old end iterator; `erase` invalidates handles at and after the erased position. Use the iterator returned by `erase` to continue traversal.

**Reproduce:** With g++ 15.2 `-std=c++20 -O0 -g`, write `template<class T> T twice(T x) { return x + x; }`. Check `twice(3) == 6` and `twice(2.5) == 5.0`, and explain why a type without a suitable `+` cannot instantiate the body. For `vector<int>{1,2,3}`, `erase` `begin()+1` and check the resulting values `{1,3}` and that the returned iterator points to 3. Predict the invalidated handles before running. Force reallocation using `reserve(capacity()+1)`, then reacquire all handles without comparing or dereferencing the old ones.

**Traps**

- An iterator is not necessarily a pointer or random-access. Algorithms impose iterator-category requirements.
- Capacity is allocated space, not a range of constructed elements that `operator[]` may access.
- A sanitizer's silence does not make an invalidated iterator valid. Its address may still lie in allocated memory.

**Practice**

- [AlgoMaster Exercise: Iterators Basics](https://algomaster.io/learn/cpp/iterators-basics-exercise) - Exercises 1 to 5, ending with Exercise 5: Refresh an Iterator After Vector Insert. Before Exercise 5, write which handles the `insert` may invalidate per the cppreference table, then reacquire them.
- [AlgoMaster Exercise: Function Templates](https://algomaster.io/learn/cpp/function-templates-exercise) - Exercises 1 to 4: one and two type parameters, an explicit return-type argument, and overload choice. For each template, list the operations its body needs from each type argument.

**Stop when:** You explain `twice`'s type requirements and the vector erasure result, and correctly classify handles after `reserve`, `push_back`, `insert`, `erase` and unordered-container rehash.

<details>
<summary>Self-test</summary>

1. A vector has spare capacity. Does `push_back` preserve every iterator?
   - No. Existing element iterators survive without reallocation, but the old past-the-end iterator is invalidated.
2. After `reserve(100)` on an empty vector, can you write `v[0]`?
   - No. Its size is still zero. Use `resize` or `insert` an element first.
3. Why can a template definition in a `.cpp` file produce a link failure for a caller in another translation unit?
   - The caller may need the definition to instantiate its argument types. Put the definition where it is visible or supply the needed explicit instantiation in a linked translation unit.
4. Why use `it = v.erase(it)` rather than `++it` after erasure?
   - The erased iterator is invalid. `erase` returns a valid iterator to the following element, or the new end.

</details>

#### U6. Undefined behavior, sanitizers and debugger evidence

**About 4 h** · **Target:** Measure

Topics: Out-of-bounds, lifetime, uninitialized access and undefined behavior; Compiler diagnostics, sanitizers and debugger evidence

Undefined behavior has no promised result, including a crash. Tool evidence helps locate a violated contract without turning one observed output into a language rule.

**You can now**

- Identify bounds, lifetime, double-free, uninitialized-read and overflow hazards in C++20 code.
- Build with warnings, debug symbols, ASan and UBSan, then interpret a report's failing access and lifetime history.
- Locate a failure in a debugger, repair its root cause and preserve a regression test.

**Study**

1. [Undefined behavior](https://en.cppreference.com/cpp/language/ub) (cppreference) - Explanation; UB and optimization: Signed overflow, Access out of bounds and Uninitialized scalar. Depth: Use the C++20 rules. Do not mistake displayed assembly for guaranteed behavior; the C++26 erroneous-behavior distinction is outside this unit.
2. [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html#usage) (Clang AddressSanitizer and UndefinedBehaviorSanitizer) - Introduction; Usage and `example_UseAfterFree.cc`; Symbolizing the Reports; Additional Checks: Stack Use After Return and Memory leak detection; Limitations.
3. [UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html#usage) (Clang AddressSanitizer and UndefinedBehaviorSanitizer) - Introduction; Usage; Available checks, including `signed-integer-overflow` and the `undefined` group; Stack traces and report symbolization. Depth: Skip runtime suppression, minimal runtime and newer overflow-behavior attributes.
4. [Debugger backtraces](https://sourceware.org/gdb/current/onlinedocs/gdb.html/Backtrace.html) (GDB manual: Backtraces) - 8.2 Backtraces: `bt`, `-full`, frame numbering and optimized-out arguments. Depth: Skip frame filters and backtrace formatting options.

**Focus**

- Bounds and lifetime are separate contracts. A stale pointer may still point inside mapped memory; reading it remains invalid.
- ASan reports memory-access violations with allocation and deallocation stacks. UBSan checks selected undefined operations, including signed overflow; the default `undefined` group is not a check for every possible defect.
- Preserve the command, compiler version, input and first report. Repair the invalid lifetime or index calculation rather than suppressing the report.
- A debugger gives frames and state, not proof that a program has defined behavior. A clean dynamic-tool run covers only executed paths and enabled checks.

**Reproduce:** Run LLVM's `example_UseAfterFree.cc` with no extra arguments, using clang++ 21.1 `-std=c++20 -O1 -g -fsanitize=address,undefined -fno-omit-frame-pointer`. Preserve the report: the checked run reports '`AddressSanitizer: heap-use-after-free`' and '`READ of size 4`', with the allocation, `delete[]` and subsequent read identified. The unsanitized program has undefined behavior and no particular output is guaranteed. Repair it using initialized owned storage that remains alive until after the read, and rerun with the same flags. In a separate program, add `argc` to `numeric_limits<int>::max()`: the same diagnostic build reports "`signed integer overflow: 2147483647 + 1 cannot be represented in type 'int'`" on this Linux x86-64 toolchain. A default recoverable UBSan report need not produce a nonzero exit; use `-fno-sanitize-recover=undefined` for a failing test target. On a repaired `-O0 -g` build, run `gdb`, `break main`, `run` and `bt` to connect the source location to its frame.

**Traps**

- ASan and UBSan do not generally detect uninitialized-value use. MemorySanitizer is a separate tool, not part of `-fsanitize=address,undefined`.
- A data race is outside ASan/UBSan's usual checks. ThreadSanitizer requires a separate build and cannot be combined with AddressSanitizer.
- A successful exit is not enough: UBSan can recover after reporting a violation, and an unexecuted bad path remains unchecked.

**Practice**

- [AlgoMaster Exercise: Memory Leaks](https://algomaster.io/learn/cpp/memory-leaks-exercise) - Exercises 1 to 5: a single heap id, an early-return path, an exception path with `unique_ptr`, a partially loaded vector and a linked list. Build each unfixed starter with `clang++ -fsanitize=address -g` and keep the LeakSanitizer report before repairing it; the fixed build must report nothing.

**Stop when:** You explain the failing access from its report, preserve a regression that fails on the seeded defect and passes after repair, and name what the enabled tools still cannot prove.

<details>
<summary>Self-test</summary>

1. A use-after-free program prints the expected value. Is the read valid?
   - No. Its object lifetime ended. Undefined behavior guarantees no particular output, including apparent success.
2. What evidence distinguishes an invalid index from a freed-buffer access?
   - The report's access location and region bounds, plus allocation and deallocation history. Use that history to check the bounds and lifetime independently.
3. Why can a UBSan-instrumented test exit zero despite a signed-overflow report?
   - Many checks recover by default. Configure non-recovery when a violation must fail the test process.
4. Does a clean ASan/UBSan run prove there are no uninitialized reads or data races?
   - No. These tools do not generally cover those defect classes, nor paths that did not execute.

</details>

#### U7. Threads, data races, memory ordering and atomics

**About 4 h** · **Target:** Explain

Topics: Threads, data races, memory ordering and atomics at literacy depth

Native threads can access the same storage without Python's protections. Atomicity, visibility and thread lifetime must be explicit before a compute loop can safely run concurrently.

**You can now**

- Identify a data race and distinguish it from a race-free but incorrect sequence of atomic operations.
- Explain how mutexes, atomic read-modify-write and release/acquire publication provide different guarantees.
- Trace thread ownership and the lifetime of captured data through joining and detachment.

**Study**

1. [Threads Basics](https://algomaster.io/learn/cpp/threads) (AlgoMaster C++) - What `std::thread` Actually Is; Four Ways to Construct a Thread; Passing Arguments: By Value, By Reference, By Move; A Word on Destroying a Live Thread. Depth: Skip overhead estimates and timed-task examples. Correct the lesson's shorthand: a completed but unjoined `std::thread` is still joinable, and its destructor still terminates the process.
2. [Atomic Operations](https://algomaster.io/learn/cpp/atomic-operations) (AlgoMaster C++) - Why a Plain `int` Isn't Safe; Enter `std::atomic<T>`; Core Operations; Atomic vs Mutex: When to Use Which. Depth: Use the race example only to identify undefined behavior, not to predict lost updates or instruction counts. Skip CAS algorithms, lock-free reclamation, timing estimates and assembly claims. Atomics can use internal locks; an uncontended mutex need not make a system call.
3. [Memory ordering](https://en.cppreference.com/cpp/atomic/memory_order#Explanation) (cppreference) - Constants; Explanation: Relaxed ordering, Release-Acquire ordering, Sequentially-consistent ordering and Relationship with volatile. Depth: Read the C++20 rules and the publication example. Skip consume ordering and the full formal model.
4. [Avoid data races](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#rconc-races) (C++ Core Guidelines) - CP.2: Avoid data races, including concurrent mutation of the same buffer.

**Focus**

- Conflicting accesses in different threads, at least one non-atomic and with no happens-before ordering, can form a data race. A data race is undefined behavior, not a promise of a particular wrong count.
- Atomic load followed by atomic store is not one atomic increment. Use `fetch_add` for that operation; use a mutex to protect a multi-field invariant.
- Relaxed atomic operations preserve atomicity and per-object modification order, not publication of unrelated data. A release store read by an acquire load can publish preceding writes.
- `join` waits for completion and establishes synchronization with that completion. Detachment removes the join handle; it does not extend the lifetime of referenced objects.

**Reproduce:** With g++ 15.2 `-std=c++20 -O0 -g -pthread`, start two threads, each performing 1,000 `fetch_add(1, memory_order_relaxed)` operations on `atomic<int>{0}`; `join` both and check the final count is 2,000. Explain why joining makes the final read appropriate even with relaxed increments. Separately initialize `int payload = 0` and `atomic<bool> ready{false}`; one writer sets `payload = 42` then stores `ready = true` with release, and one reader spins on an acquire load until `true` before reading `payload`. Check it reads 42, and draw the synchronizes-with and happens-before chain. Keep it a one-shot protocol with one writer. Do not run a relaxed-flag version to infer a result: the unprotected payload access would have undefined behavior and no particular output is guaranteed.

**Traps**

- `volatile` is not inter-thread synchronization and does not turn `++` into an atomic operation.
- Separate atomic fields do not automatically preserve a relationship between those fields.
- Sleep is not a substitute for `join` or publication. Elapsed time establishes no happens-before relationship.

**Practice**

- [AlgoMaster Exercise: Atomic Operations](https://algomaster.io/learn/cpp/atomic-operations-exercise) - Exercise 2: Count Sales Across Threads; Exercise 4: Keep the Lowest Score with Compare Exchange; Exercise 5: Publish Data with Acquire and Release. For Exercise 5, draw the release-acquire edge that makes the plain payload read race-free.
- [AlgoMaster Exercise: Joining and Detaching Threads](https://algomaster.io/learn/cpp/joining-detaching-exercise) - Exercises 1 to 5, especially Exercise 4: Join in an RAII Destructor During an Exception and Exercise 5: Join a Thread Group During Stack Unwinding. State who owns each thread handle and when its joinability ends.

**Stop when:** You reproduce the counter and one-shot publication checks, draw the payload's happens-before chain, and distinguish data races from incorrect but atomic update sequences.

<details>
<summary>Self-test</summary>

1. Two threads use `counter.store(counter.load() + 1)`. Is that equivalent to `fetch_add(1)`?
   - No. The load and store are separate atomic operations, so both threads can read the same old value and overwrite each other's update. This is a logical race without a data race on the atomic itself.
2. When does an acquire load publish the writer's earlier payload writes to the reader?
   - When it reads the value from the corresponding release operation, or an applicable release sequence. Merely choosing acquire is not enough.
3. The worker has returned, but its `std::thread` has not been joined or detached. Can you destroy that thread object?
   - Its destructor calls `std::terminate` because it is still joinable. Completion alone does not clear joinability.
4. Why not use relaxed publication for a non-atomic payload?
   - The relaxed flag does not order the payload write before the reader's access. Without another synchronization edge, the conflicting accesses form a data race.

</details>

#### U8. Python and native code: dtype, stride, ownership and GIL contracts

**About 5 h** · **Target:** Explain

Topics: Python/native dtype, shape, stride, ownership, GIL and error contracts

An array's Python type does not specify its memory contract. The extension must agree with Python about representation, lifetime and errors before it can safely compute on raw storage.

**You can now**

- Explain a native function's dtype, byte order, rank, shape, stride and alignment requirements.
- Distinguish copying input or output from borrowing storage, and identify which object keeps borrowed storage alive.
- Explain exception translation and which parts of a call may run without the GIL on default CPython.

**Study**

1. [First steps](https://pybind11.readthedocs.io/en/stable/basics.html) (pybind11 documentation) - Header and namespace conventions; Creating bindings for a simple function; Compiling the test cases; Keyword arguments. Depth: Use pybind11 3.1 and your Python 3.14 development headers; skip exporting variables and unrelated C++11 syntax repair.
2. [NumPy and buffer contracts](https://pybind11.readthedocs.io/en/stable/advanced/pycpp/numpy.html) (pybind11 documentation) - Buffer protocol; Arrays; Direct access; Memory view. Depth: Skip Eigen and vectorizing functions. Do not copy the `Matrix` ownership sketch or the `add_arrays` raw-pointer loop unchanged: `Matrix` omits cleanup, and `add_arrays` accepts strided input but indexes it as contiguous. Use RAII storage and either validated contiguous input or stride-aware access.
3. [Conversion and return policies](https://pybind11.readthedocs.io/en/stable/advanced/functions.html#return-value-policies) (pybind11 documentation) - Return value policies; Additional call policies: Keep alive; Non-converting arguments. Depth: Read ownership policies, not the crash wording as a guaranteed outcome of undefined behavior.
4. [GIL and free-threading contracts](https://pybind11.readthedocs.io/en/stable/advanced/misc.html#global-interpreter-lock-gil) (pybind11 documentation) - Global Interpreter Lock (GIL); Common Sources Of Global Interpreter Lock Errors; Free-threading support. Depth: Apply GIL-held wording to the default build. Free-threaded Python was introduced in 3.13 and became supported in 3.14; the page's experimental wording is not the current CPython 3.14 status. Stop before sub-interpreter implementation.
5. [Exception translation](https://pybind11.readthedocs.io/en/stable/advanced/exceptions.html#built-in-c-to-python-exception-translation) (pybind11 documentation) - Built-in C++ to Python exception translation table; Handling exceptions from Python in C++. Depth: Skip custom translators and unraisable exceptions for this first binding.

**Focus**

- `py::array_t<double>` permits conversion by default; it does not mean no-copy or contiguous. For a strict 1-D native-endian `float64` contract, use `py::array_t<double, py::array::c_style>` with `py::arg(...).noconvert()`, check rank and alignment, and reject unsupported input explicitly.
- Buffer strides are signed byte distances. A reversed view can have a negative stride; pointer indexing is valid only when the accepted layout supports it. `unchecked<N>` handles strides but trusts your index bounds and the storage's continued validity.
- Returning newly allocated NumPy-owned storage makes ownership explicit. A borrowed pointer instead needs an owner that stays alive and a no-reallocation contract; a reference return policy alone does not make dangling memory safe.
- On default CPython 3.14, pybind11 does not implicitly release the GIL. Validate and acquire views while holding it, release only around native work, and reacquire before Python operations or reference-count changes. `mod_gil_not_used` promises thread safety; it does not provide it.

**Reproduce:** Against default CPython 3.14.4, NumPy 2.5.4 and pybind11 3.1, with g++ 15.2 `-std=c++20 -O0 -g`, bind a 1-D `float64` sum using `py::array_t<double, py::array::c_style>` and `.noconvert()`. Reject `ndim != 1` with `py::value_error` and a data pointer not aligned to `alignof(double)` with `py::value_error`; obtain `unchecked<1>()` before a scoped GIL release around the sum loop. Keep the input object alive and require no concurrent mutation. `np.arange(6, dtype=np.float64)` returns 15.0 and empty `float64` input returns 0.0. `float32` input, a list, `a[::2]` and `a[::-1]` raise `TypeError`; `a.reshape(2,3)` raises `ValueError`. Return a separately allocated `py::array_t<double>` copy in a second function, and test that it does not share memory with the input and survives deletion of the input. Also reject an unaligned contiguous `float64` array constructed over a byte buffer with offset 1. Explain the owner and GIL state at each point rather than claiming a speedup.

**Traps**

- Releasing the GIL does not prevent another caller from mutating the same NumPy storage. Require exclusive access or copy before release.
- A C-contiguous array is not necessarily aligned. Check alignment before dereferencing it as `double` storage.
- C++ exceptions can translate to Python exceptions; memory corruption and undefined behavior cannot reliably be contained that way.

**Practice**

- The section mini-project covers this: expose the native function with dtype, shape, stride, alignment, ownership, GIL and exception contracts, and test accepted and rejected arrays plus output lifetime.

**Stop when:** Your strict-binding and independent-output tests pass, and you can explain each accepted or rejected input, the live storage owner and every GIL transition.

<details>
<summary>Self-test</summary>

1. Does `py::array_t<double>` by itself guarantee a zero-copy contiguous `float64` argument?
   - No. Its default `forcecast` can convert input, and it permits strided arrays. Specify and test the layout and conversion policy.
2. Why is `a[::2]` unsafe for an unchecked raw `double*` loop using `ptr[i]`?
   - The logical stride skips storage elements, but `ptr[i]` advances by one `double`. Use actual strides or reject that layout.
3. What keeps a returned borrowed view valid?
   - A live owner of the backing allocation and a contract that prevents its deletion, resizing or reallocation while the view is used. A raw address alone provides neither.
4. May a `gil_scoped_release` region create or destroy Python wrapper objects on the default build?
   - Not safely without reacquiring the GIL for those operations. Their constructors, destructors or copies can access Python state and reference counts.
5. What does declaring `mod_gil_not_used` mean for a free-threaded build?
   - The extension promises that its code is thread-safe without the GIL. It must be built for that interpreter; the tag supplies no synchronization for shared user data.

</details>

#### U9. Repeatable CMake builds and test targets

**About 5 h** · **Target:** Implement

Topics: Repeatable CMake configure, build and test targets

A safe native change must survive a clean build, not just a working terminal session. Target-based builds keep dependencies and diagnostic options attached to the code that needs them.

**You can now**

- Describe a library, executable and native test as CMake targets with explicit usage requirements.
- Configure independent debug, optimized and sanitizer builds and inspect their actual compile and link commands.
- Run registered tests from a fresh build tree and install the intended artifact without installing test executables.

**Study**

1. [Targets, libraries and linking](https://cmake.org/cmake/help/v4.2/guide/tutorial/Getting%20Started%20with%20CMake.html) (CMake tutorial) - Step 1: Background; Exercise 1 - Building an Executable; Exercise 2 - Building a Library; Exercise 3 - Linking Together Libraries and Executables. Depth: Use the tutorial source archive linked from the v4.2 tutorial index. Stop before Exercise 4 if your project does not need subdirectories.
2. [Target features, warnings and link options](https://cmake.org/cmake/help/v4.2/guide/tutorial/In-Depth%20CMake%20Target%20Commands.html) (CMake tutorial) - Step 4: Background; Exercise 1 - Features and Definitions; Exercise 2 - Compile and Link Options. Depth: Read the scoped-command examples. Skip vendor-library import and precompiled headers; apply the commands to your own targets rather than completing all preceding steps.
3. [Testing and CTest](https://cmake.org/cmake/help/v4.2/guide/tutorial/Testing%20and%20CTest.html#exercise-1-adding-tests) (CMake tutorial) - Step 8: Background and Exercise 1 - Adding Tests, all seven completion markers, including `TestMathFunctions` and the four registered operations.
4. [Install the intended artifacts](https://cmake.org/cmake/help/v4.2/guide/tutorial/Installation%20Commands%20and%20Concepts.html#exercise-1-installing-artifacts) (CMake tutorial) - Step 9: Background and Exercise 1 - Installing Artifacts. Depth: Use install(TARGETS) and a local install prefix. Stop before exporting targets and version files.

**Focus**

- Model dependencies with `target_link_libraries` and target-scoped sources, includes and features. `PRIVATE` affects the target, `INTERFACE` its consumers, and `PUBLIC` both.
- `target_compile_features(... cxx_std_20)` specifies at least C++20, not necessarily an exact `-std=c++20` flag. Record verbose build commands and disable language extensions when strict standard mode is intended.
- For single-config generators such as Unix Makefiles, configure `CMAKE_BUILD_TYPE` in separate trees. For multi-config generators, choose `--config` at build time and `-C` for CTest.
- CTest runs registered commands; it does not automatically build them. Sanitizer instrumentation needs compile options and runtime linkage on the executable, and release tests must not disappear under `NDEBUG`.

**Reproduce:** Using CMake 4.2 with the Unix Makefiles generator, create a small library target, an executable linked to it and a separate test executable returning nonzero on failed checks. Set a C++20 requirement and register the test with `enable_testing()` and `add_test(NAME native COMMAND native_tests)`. Configure with `cmake -S . -B build-debug -G 'Unix Makefiles' -DCMAKE_CXX_COMPILER=g++ -DCMAKE_BUILD_TYPE=Debug`, build with `cmake --build build-debug --verbose`, and run `ctest --test-dir build-debug --output-on-failure`. Repeat in a new `build-release` tree with `Release`. Inspect the commands for g++ 15.2, language mode and optimization rather than assuming exact preset flags. Add an opt-in sanitizer configuration that applies `-fsanitize=address,undefined` to compilation and final linking, plus `-fno-sanitize-recover=undefined` and `-fno-omit-frame-pointer` to compilation; verify it in a new clang++ 21.1 build tree. Finally use `install(TARGETS)` for the executable and `cmake --install build-release --prefix install-stage`, and check that tests are not installed. A deliberately false test condition must make CTest fail in both `Debug` and `Release`.

**Traps**

- Changing the compiler inside an existing cached tree is not equivalent to a fresh configure. Use a new build directory for a different toolchain.
- Passing sanitizer flags only when compiling can leave the final link without its runtime libraries.
- No tests found is not evidence that tests passed. Check discovery and use explicit failure checks that survive optimized builds.

**Practice**

- [CMake Tutorial: Building and linking targets](https://cmake.org/cmake/help/v4.2/guide/tutorial/Getting%20Started%20with%20CMake.html) - Step 1, Exercises 1 through 3: Building an Executable, Building a Library, Linking Together Libraries and Executables. Complete the target declarations and link the provided program. Then carry the same target structure into the section mini-project.
- [CMake Tutorial: Adding Tests](https://cmake.org/cmake/help/v4.2/guide/tutorial/Testing%20and%20CTest.html#exercise-1-adding-tests) - Step 8, Exercise 1, all seven completion markers; register `TestMathFunctions` for `add`, `mul`, `sqrt` and `sub`. Start from the supplied `Step8` directory, which includes earlier solutions. Its public executable checks one fixed example per operation and reports failure via its exit code; it is not a broad numerical test suite. Run all four with CTest, then add your own boundary cases in the mini-project.

**Stop when:** The named tutorial targets and four tests work, your own clean debug, release and sanitizer trees run the registered regression, an injected test failure is detected in Debug and Release, and installation excludes tests.

<details>
<summary>Self-test</summary>

1. A library's public header uses `std::span`. Should its C++20 requirement be `PRIVATE` or `PUBLIC`?
   - `PUBLIC`, because both the library and consumers compiling that header need the feature.
2. Why can CTest fail to run a newly registered executable?
   - The target may not have been built. Configure registers the test; build creates its executable; CTest runs it.
3. Does `CMAKE_BUILD_TYPE=Release` select the configuration for every generator?
   - No. Multi-config generators select it with `--config` when building and `-C` when running CTest.
4. Why can an `assert`-only regression pass in `Release` despite a defect?
   - `NDEBUG` can remove the assertions entirely. Use test checks that report failure independently of `assert`.

</details>

### Mini-project: Native run-duration histogram with a strict pybind11 binding and a sanitizer-backed repair

**About 12 to 16 hours.** Move the run-duration histogram into C++ behind a strict Python boundary. Build it with CMake in debug, release and sanitizer trees, test it against NumPy, and follow one sanitizer report from evidence to regression test.

1. Write the histogram core over spans with an owning `Histogram` class, and test copy independence, moves and bounds errors in a native test executable, using the AlgoMaster RAII and Copy-and-Swap Idiom exercises as reference.
2. Seed an off-by-one that overflows the bins, capture the sanitizer report in a sanitizer build tree, repair it, connect the report to the frame with `gdb`, and keep the input as a regression test.
3. Test the histogram against `numpy.histogram` on random values and on values at and beside every edge, then adopt NumPy's edge rule or document and test your own.
4. Bind the core with pybind11 under dtype, shape, stride, alignment, ownership, exception and GIL contracts, and test every accepted and rejected input plus output lifetime.
5. Build debug, release and sanitizer trees with CMake following the CMake Tutorial building and testing steps and register the native tests with CTest, then document the exported symbols and linked libraries and diagnose one link or loader failure from its message.
6. Document the record layout from measured offsets, compare array-of-struct and struct-of-array scans with equal checksums, and split one call across threads with private bins merged after `join`, alongside a shared atomic-bin variant.

**Deliverables**

- The native component: core library, owning `Histogram`, native tests, extension module and CMake trees.
- The sanitizer write-up with the preserved report, the `gdb` session and the regression test.
- Binding and oracle tests plus a boundary note with symbols, libraries, the diagnosed failure and the layout comparison.

**Checks**

- rubric: Self-grade with the rubric below.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Oracle agreement | The binding agrees with `numpy.histogram` on random data and at every edge, or a documented edge rule is tested instead. | Edge cases come from a generator, and a naive index version is kept as a comparison that fails. |
| Strict boundary | Wrong dtype, lists, strided, reversed and multi-dimensional inputs are rejected with the stated exception types, and the result outlives the input. | The binding names the owner of every buffer and the GIL state at each point. |
| Sanitizer repair | The report is preserved and explained, and the regression fails on the seeded code and passes after the repair. | The write-up names what the sanitizers cannot prove here, such as a wrong but in-bounds bin. |
| Build and ABI | Debug, release and sanitizer trees build from scratch, CTest catches a false check, and one failure is diagnosed from its message. | The note says which upgrades force a rebuild of the extension and why. |
| Layout evidence | Predicted offsets match the measured ones, both layouts agree, and raw timings are kept. | The report separates the measured difference from cache explanations it did not test. |

Feeds into: The Python-native histogram, its sanitizer-backed repair and the evidence-first debugging report for the capstone.

### Resource route

- **Primary - Course:** [AlgoMaster C++](https://algomaster.io/learn/cpp/course-roadmap) - Use the sections on compilation, pointers and references, memory, RAII and smart pointers, copy and move, STL containers, templates, errors, concurrency and paired exercises. Skip competitive-programming breadth already covered in Algorithms.
- **Required - Reference:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines) - Use the Philosophy, Interfaces, Resource management, Expressions, Containers and concurrency rule groups to review ownership and safety decisions in the native component.
- **Support - Reference:** [cppreference](https://en.cppreference.com/w/cpp.html) - Consult language lifetime, object model, value categories, memory model, atomics, containers and iterator invalidation while reading or modifying code.
- **Required - Implementation:** [Clang AddressSanitizer and UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html) - Compile seeded memory defects with AddressSanitizer and UndefinedBehaviorSanitizer, preserve the reports, repair the root cause and keep regression tests.
- **Required - Implementation:** [pybind11 documentation](https://pybind11.readthedocs.io/en/stable/basics.html) - Follow First steps and NumPy support to expose one small native function with explicit shape, dtype, stride, ownership, GIL and exception behavior.
- **Support - Implementation:** [CMake tutorial](https://cmake.org/cmake/help/latest/guide/tutorial/index.html) - Use the introductory steps for targets, libraries, testing and install rules. Produce one clean debug build and one optimized build without copied one-off commands.
- **Support - Application:** [Algorithmica - AoS and SoA](https://en.algorithmica.org/hpc/cpu-cache/aos-soa/) - Read the AoS and SoA experiment for a measured case where keeping each record together wins, the counterpart to a single-field scan.
- **Support - Reference:** [`ld.so`: dynamic linker/loader](https://man7.org/linux/man-pages/man8/ld.so.8.html) - Read DESCRIPTION, Dynamic string tokens and `LD_DEBUG` to distinguish link-time symbols from runtime shared-library discovery on Linux.
- **Support - Reference:** [Memory Layout Transformations](https://www.intel.com/content/www/us/en/developer/articles/technical/memory-layout-transformations.html) - Read Overview and Topics through AOS Form and SOA Form for field-wise access and locality trade-offs. Skip Intel array-notation syntax and the LIBOR example.
- **Support - Reference:** [GDB manual: Backtraces](https://sourceware.org/gdb/current/onlinedocs/gdb.html/Backtrace.html) - Use section 8.2 for frame numbers, `bt`, `bt -full` and optimized-out arguments when inspecting a native failure.

### Exit checkpoint

Build a tiny Python-callable C++ component, explain its layout and ownership, and repair one seeded lifetime or bounds error from sanitizer evidence in a clean build.

<details>
<summary>Deliberately left for later</summary>

- Advanced template metaprogramming and compiler construction
- Large native application architecture
- Lock-free data structures beyond literacy

</details>

## Stage milestone

### Reproducible Task Runner

Review the stage through three artifacts of the taskrunner built in the section mini-projects. Keep them in one repository so each artifact strengthens the same system instead of becoming a separate project.

- Package and interface - typed installable service through CLI and HTTP, with schema and transaction tests
- Failure and operations - bounded concurrency, backpressure, cancellation, telemetry, one injected failure and a clean-checkout runbook
- Native and diagnosis - one Python-native function, a sanitizer-backed repair and one evidence-first debugging report

**Capstone rubric** (about 10 to 14 hours)

| Criterion | Pass | Strong |
| --- | --- | --- |
| Package and interface | From a clean checkout, one command builds the wheel and runs the CLI and HTTP service over one service layer, with schema, migration, transaction and idempotency tests green. | The same service suite runs against the fake and the PostgreSQL store, and the `README` states every tool and service version behind the evidence. |
| Failure and operations | The pipeline rejects excess work, cancels and drains cleanly, and the injected outage is diagnosed from signals and recovered through the runbook. | Someone other than the author recovered using only the runbook, and the gaps they found were fixed. |
| Native and diagnosis | The duration report calls the native histogram through the strict binding, its repair has a regression test, and one debugging report records hypotheses, evidence and the fix. | The debugging report covers a defect the author did not plant, with quoted tool output for each rejected hypothesis. |
| Reproducibility | Every run writes a manifest, and the gate passes from a clean checkout in one command. | Two runs from different commits are explained field by field from their manifests, and the gate also passes on a second host. |
| Evidence | Every performance or behavior claim in the `README` has raw data with the Python build, compiler and CPU. | Each claim states the workload or input region it covers and what was not tested. |

