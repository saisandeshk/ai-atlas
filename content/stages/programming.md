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

### Resource route

- **Primary - Course:** [Stas' Python Cookbook - selected path](https://github.com/stas00/python-cookbook/blob/master/content/README.md) - Run Part I on dictionaries, iteration, functions, closures, decorators, classes and context managers; Part II on modules, files, paths, environment and arguments; and Part IV on versions, dependencies, packaging and code quality. Finish by building one src-layout package from a blank directory.
- **Required - Reference:** [Python language reference](https://docs.python.org/3/reference/index.html) - Check Data model, Execution model, Import system and Exceptions whenever a claim depends on Python semantics. These pages are the authority when the course and a runtime observation disagree.
- **Required - Implementation:** [Packaging Python Projects](https://packaging.python.org/en/latest/tutorials/packaging-projects/) - Follow the packaging tutorial once from a blank directory, using a src layout, pyproject.toml, an isolated build and a clean-environment installation test.
- **Support - Practice:** [AlgoMaster Python - structured revision](https://algomaster.io/learn/python/course-roadmap) - Use Functions, Modules and Packages, OOP, Advanced OOP, Exception Handling, Iterators and Generators, Type Hints and Annotations only after the cookbook pass. Open it for recall practice or a diagnosed weak mechanism, not as a second complete course.

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

### Resource route

- **Primary - Course:** [Official docs typed-service build path](https://docs.pydantic.dev/latest/concepts/models/) - Build one record service in this order: structural protocols and generics; Pydantic models, validators, strict mode, serialization and settings; FastAPI request bodies, dependencies, errors and tests; then PostgreSQL transactions and EXPLAIN. Replay valid, malformed, duplicate and previous-schema requests through CLI and HTTP.
- **Required - Course:** [AlgoMaster SQL - selected route](https://algomaster.io/learn/sql-interview/course-roadmap) - Study SQL Foundations, Querying Data, Joins, Subqueries and CTEs, Window Functions, DDL, DML and Views, Performance Optimization, Transactions and Concurrency, and Data Modeling. Stop when the service queries and transaction tests pass.
- **Required - Reference:** [PostgreSQL transactions and EXPLAIN](https://www.postgresql.org/docs/current/tutorial-transactions.html) - Use the transaction tutorial and EXPLAIN guide to demonstrate commit, rollback, one isolation anomaly or prevented anomaly, and a measured plan improvement on the database actually used.
- **Support - Implementation:** [FastAPI tutorial](https://fastapi.tiangolo.com/tutorial/) - Use Request Body, Dependencies, Handling Errors and Testing to expose the same service layer through HTTP. Keep framework models outside the domain core and preserve the same error semantics as the CLI.
- **Support - Practice:** [AlgoMaster Low-Level Design - one rehearsal](https://algomaster.io/learn/lld/course-roadmap) - Use one fitting design prompt to rehearse interface contracts, dependency direction and failure ownership. Treat the review as feedback, then verify behavior with your own tests.
- **Support - Reference:** [Stas' Python Cookbook - data and interfaces](https://github.com/stas00/python-cookbook/blob/master/content/README.md) - Use Serialization and Deserialization plus Environment and Arguments for focused implementation help. Compare JSON, JSONL, CSV and compressed data, and never use pickle for untrusted interchange.

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

### Resource route

- **Primary - Course:** [The Missing Semester of Your CS Education](https://missing.csail.mit.edu/2026/) - Complete the 2026 lectures on the shell, command-line environment, development tools, debugging and profiling, Git, packaging and shipping code, and code quality. Apply every exercise to the same stage project.
- **Required - Implementation:** [pytest documentation](https://docs.pytest.org/en/stable/) - Use Get Started, fixtures, parametrization, monkeypatch, caplog and temporary paths to build behavior and failure-path tests without order dependence.
- **Required - Practice:** [Hypothesis documentation](https://hypothesis.readthedocs.io/en/latest/) - Follow the Quick start and property-based testing guides, then generate operation histories and retain the minimized example for one real defect.
- **Support - Practice:** [The Art of Debugging](https://github.com/stas00/the-art-of-debugging) - Use the Unix, Python and compiled-code sections during a real seeded defect. Follow the evidence and tiny-reproducer workflow rather than reading the unfinished book front to back.
- **Support - Reference:** [Pro Git](https://git-scm.com/book/en/v2) - Use Chapters 2-3 and the sections on debugging, internals and recovery while constructing a history for bisect and recovering a deliberately displaced commit.
- **Support - Reference:** [Stas' Python Cookbook - debugging and testing](https://github.com/stas00/python-cookbook/blob/master/content/README.md) - Use Part III and the packaging sections for debugger, traceback, pytest, logging, profiling and clean-environment recipes.

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

### Resource route

- **Primary - Course:** [AlgoMaster Concurrency](https://algomaster.io/learn/concurrency-interview/course-roadmap) - Study Concurrency 101; the Python units on threads, the GIL, multiprocessing, asyncio and concurrent.futures; synchronization primitives; concurrency challenges; locking strategies; and concurrency patterns. Then solve Bounded Buffer, Thread-Safe Blocking Queue, Thread-Safe Rate Limiter and Task Scheduler with Dependencies.
- **Required - Reference:** [Python concurrency documentation](https://docs.python.org/3/library/concurrency.html) - Use asyncio task groups, cancellation, queues and timeouts; concurrent.futures; multiprocessing; threading; and signal documentation to verify lifecycle and failure behavior.
- **Required - Implementation:** [High Performance Python, 3rd edition companion code](https://github.com/mynameisfiber/high_performance_python_3e) - Use the profiling, memory, asynchronous I/O and multiprocessing examples as experiment starting points. Change the workloads and measure the regimes where concurrency helps, loses or only moves the bottleneck.
- **Support - Theory:** [Operating Systems: Three Easy Pieces - concurrency](https://pages.cs.wisc.edu/~remzi/OSTEP/) - Read Chapters 26-33, from threads through event-based concurrency, for locks, condition variables, semaphores, concurrency bugs and event loops. Do selected homework only for a weak mechanism.
- **Support - Implementation:** [Docker guides](https://docs.docker.com/guides/python/) - Use the Python container guide and build best practices to run as non-root, pin dependencies, handle signals and test CPU and memory limits.
- **Support - Operations:** [OpenTelemetry Python instrumentation](https://opentelemetry.io/docs/languages/python/instrumentation/) - Manually instrument one request so its structured logs, one low-cardinality metric and one trace share a correlation identity. Use the telemetry to locate one seeded fault.

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

### Resource route

- **Primary - Course:** [AlgoMaster C++](https://algomaster.io/learn/cpp/course-roadmap) - Use the sections on compilation, pointers and references, memory, RAII and smart pointers, copy and move, STL containers, templates, errors, concurrency and paired exercises. Skip competitive-programming breadth already covered in Algorithms.
- **Required - Reference:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines) - Use the Philosophy, Interfaces, Resource management, Expressions, Containers and concurrency rule groups to review ownership and safety decisions in the native component.
- **Support - Reference:** [cppreference](https://en.cppreference.com/w/cpp.html) - Consult language lifetime, object model, value categories, memory model, atomics, containers and iterator invalidation while reading or modifying code.
- **Required - Implementation:** [Clang AddressSanitizer and UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html) - Compile seeded memory defects with AddressSanitizer and UndefinedBehaviorSanitizer, preserve the reports, repair the root cause and keep regression tests.
- **Required - Implementation:** [pybind11 documentation](https://pybind11.readthedocs.io/en/stable/basics.html) - Follow First steps and NumPy support to expose one small native function with explicit shape, dtype, stride, ownership, GIL and exception behavior.
- **Support - Implementation:** [CMake tutorial](https://cmake.org/cmake/help/latest/guide/tutorial/index.html) - Use the introductory steps for targets, libraries, testing and install rules. Produce one clean debug build and one optimized build without copied one-off commands.

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

Review the stage through three small artifacts drawn from the Python Experimental Systems Kit. Keep them in one repository so each artifact strengthens the same system instead of becoming a separate project.

- Package and interface - typed installable service through CLI and HTTP, with schema and transaction tests
- Failure and operations - bounded concurrency, backpressure, cancellation, telemetry, one injected failure and a clean-checkout runbook
- Native and diagnosis - one Python-native function, a sanitizer-backed repair and one evidence-first debugging report

