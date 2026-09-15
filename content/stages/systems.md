<!-- Generated from content/curriculum.json. Edit the JSON and run npm run content:generate. -->

# 06. Systems Foundations

**Level:** Core  
**Scope:** 7 sections · 125 required topics · 26 optional, depth, or later topics

Trace state across processes and machines, bound concurrent work, recover durable data, and reason quantitatively about failure, reliability and trust.

## Order

01. Machine, Process, Memory & I/O Foundations
02. Concurrency, Scheduling & Bounded Work
03. Networks, Sockets & RPC Contracts
04. Databases, Transactions & Durable Storage
05. Distributed State, Replication & Streams
06. Observability, Reliability & Quantitative Design
07. Security, Privacy & Safe Evolution

## 01. Machine, Process, Memory & I/O Foundations

**Why:** Systems stop feeling mysterious when CPU work, kernel-owned process state, translated memory and persistent I/O can be traced as one concrete path. This first section builds that path before adding concurrency or a network.

### Learn this much

- [ ] Instructions, dependencies, pipelines and branch behavior vocabulary _(Required)_
- [ ] SIMD lanes, scalar work and vectorization limits _(Required)_
- [ ] Cache lines, hierarchy, locality, coherence and false sharing _(Required)_
- [ ] Working sets, memory bandwidth, latency and storage hierarchy _(Required)_
- [ ] NUMA placement and local versus remote memory vocabulary _(Required)_
- [ ] Programs, processes, system calls and user versus kernel mode _(Required)_
- [ ] Fork, exec, wait, scheduling states and context switches _(Required)_
- [ ] File descriptors, open-file state, pipes and redirection _(Required)_
- [ ] Signals, exit status, zombies, orphans and lifecycle ownership _(Required)_
- [ ] Virtual addresses, address translation, pages and page tables _(Required)_
- [ ] TLBs, page faults, copy-on-write and memory mapping _(Required)_
- [ ] Resident size, virtual size, allocator behavior and retention _(Required)_
- [ ] Files, directories, permissions and filesystem metadata _(Required)_
- [ ] Application buffering, page cache, flush, fsync and atomic rename _(Required)_
- [ ] Sequential, random, strided, buffered and memory-mapped I/O _(Required)_
- [ ] Acknowledged, written, flushed and durable state boundaries _(Required)_
- [ ] Namespaces, cgroups, mounts, users and container resource limits _(Required)_
- [ ] Container images, layers, signals, shutdown and filesystem boundaries _(Required)_
- [ ] RAID, SSD and device scheduling vocabulary _(Optional)_
- [ ] Binary logic and machine-language repair through two Nand2Tetris projects _(Optional)_
- [ ] Kernel scheduler or filesystem implementation _(Later)_
- [ ] eBPF programs and production kernel tracing _(Later)_

### Resource route

- **Primary - Theory:** [Operating Systems: Three Easy Pieces - selected foundations](https://pages.cs.wisc.edu/~remzi/OSTEP/) - Read Chapters 4-7, 13-15, 18-21, 36, 39-40, 42 and 45. Work from process state to address translation, devices, files, journaling and integrity. For every chapter, draw the owned state and one failure boundary instead of collecting summaries.
- **Required - Course:** [MIT 6.1810 - selected xv6 process and memory labs](https://pdos.csail.mit.edu/6.1810/2025/schedule.html) - Use Fall 2025 Lectures 1, 3-6, 8 and 10-11. Complete the util lab, one syscall task, and the page-table inspection plus ugetpid task from pgtbl. Add cow only if copy-on-write remains unclear. Keep all work in your own course checkout and stop before the full xv6 sequence.
- **Required - Practice:** [OSTEP homework - process, paging, disk and integrity simulators](https://pages.cs.wisc.edu/~remzi/OSTEP/Homework/homework.html) - Solve process-run.py, paging-linear-translate.py, paging-policy.py, disk.py, fsck.py and checksum.py for at least two seeds each before using the answer flag. Then reproduce one prediction using strace, /proc or a small local program.
- **Support - Revision:** [AlgoMaster Operating Systems - selected observation route](https://algomaster.io/learn/operating-systems/course-roadmap) - Use the process and memory units plus How malloc works, The TLB and Page faults after OSTEP. Finish with the filesystem, containers and observability units that explain your own experiment. Treat quizzes as recall checks and retain external traces as evidence.
- **Support - Reference:** [Linux proc and strace references](https://man7.org/linux/man-pages/man5/proc.5.html) - Use proc(5), getrusage(2), mmap(2), fsync(2), rename(2), wait(2) and signal(7) while tracing a parent-child pipe, page faults, file publication and a resource-limit failure. Record exact commands and raw observations.
- **Optional - Repair:** [Nand2Tetris - Projects 1 and 4 only](https://www.nand2tetris.org/course) - Use Project 1 for Boolean logic and Project 4 for machine-language execution only if the binary or instruction-level entry check fails. Do not take the full course as a second systems curriculum.

### Exit checkpoint

Trace a process from creation to exit and a checksummed file from application write to recovered state. Show one page-fault observation, one descriptor or signal transition, one container resource-limit failure and one measured locality change.

<details>
<summary>Deliberately left for later</summary>

- Writing a complete kernel or filesystem
- Advanced CPU microarchitecture and kernel tracing
- GPU profiling, CUDA and AI performance engineering

</details>

## 02. Concurrency, Scheduling & Bounded Work

**Why:** Concurrency is useful only when safety, liveness, ownership and capacity remain explicit. This section makes timing failures reproducible and overload behavior finite before those problems cross a network.

### Learn this much

- [ ] Threads versus processes and shared versus isolated state _(Required)_
- [ ] Scheduling, interleavings, preemption and critical sections _(Required)_
- [ ] Atomicity, visibility, ordering and memory consistency vocabulary _(Required)_
- [ ] Mutex ownership, lock granularity and lock ordering _(Required)_
- [ ] Condition variables, predicates, waits and notifications _(Required)_
- [ ] Semaphores, barriers and read-write locks _(Required)_
- [ ] Atomic operations and compare-and-swap vocabulary _(Required)_
- [ ] Data races, race conditions and lost updates _(Required)_
- [ ] Lost wakeups and condition synchronization defects _(Required)_
- [ ] Deadlock conditions, wait-for graphs and lock-order proofs _(Required)_
- [ ] Livelock, starvation, fairness and priority inversion vocabulary _(Required)_
- [ ] Bounded queues and producer-consumer invariants _(Required)_
- [ ] Admission, backpressure, load shedding and overload propagation _(Required)_
- [ ] Cancellation, deadlines, timeouts and error propagation _(Required)_
- [ ] Drain, abort and graceful shutdown state machines _(Required)_
- [ ] Deterministic schedule shims and randomized stress tests _(Required)_
- [ ] Contention, locality, throughput, tail latency and fairness _(Required)_
- [ ] Event loops, work stealing and structured concurrency _(Optional)_
- [ ] Relaxed memory ordering beyond working vocabulary _(Optional)_
- [ ] Lock-free queue implementation and formal concurrency verification _(Depth)_

### Resource route

- **Primary - Theory:** [Operating Systems: Three Easy Pieces - concurrency](https://pages.cs.wisc.edu/~remzi/OSTEP/) - Read Chapters 26-33 in order: threads, thread API, locks, locked data structures, condition variables, semaphores, bugs and event-based concurrency. Write the safety and liveness invariant before reading each worked pattern.
- **Required - Practice:** [OSTEP concurrency homework and code](https://pages.cs.wisc.edu/~remzi/OSTEP/Homework/homework.html) - Use x86.py and the main, vector, condition-variable and semaphore exercises to enumerate schedules. Preserve one lost update, one deadlock and one lost wakeup as minimized tests, then repair each invariant.
- **Required - Practice:** [AlgoMaster Concurrency - four bounded contracts](https://algomaster.io/practice/concurrency) - Attempt Bounded Buffer, Design Thread-Safe Blocking Queue, Design Thread-Safe Rate Limiter and Design Task Scheduler with Dependencies. For each, add a changed input, a deterministic failure schedule and an independent stress test outside the platform.
- **Depth - Course:** [MIT 6.1810 - locks and parallelism](https://pdos.csail.mit.edu/6.1810/2025/labs/lock.html) - Use Lectures 12-14 and one lock-lab exercise only after the user-space bounded queue passes. Measure the contention change and explain the invariant preserved by the revised locking scheme.

### Exit checkpoint

Force a safety failure and a liveness failure with a deterministic schedule, repair both, then drive a bounded worker queue through saturation while preserving cancellation, finite memory and predictable recovery.

<details>
<summary>Deliberately left for later</summary>

- Production lock-free data structures
- Formal verification of concurrent algorithms
- Distributed coordination and collective communication

</details>

## 03. Networks, Sockets & RPC Contracts

**Why:** A network turns local calls into partial and ambiguous outcomes. This section builds byte-stream discipline, bounded retry behavior and an observable request contract before adding replicated state.

### Learn this much

- [ ] Network layers as an explanatory model _(Required)_
- [ ] IP addresses, ports, routing and DNS lookup _(Required)_
- [ ] TCP connection setup, byte streams and flow control intuition _(Required)_
- [ ] UDP datagrams and loss, duplicate and reorder behavior _(Required)_
- [ ] TLS identity, confidentiality and integrity vocabulary _(Required)_
- [ ] Socket lifecycle, address resolution and blocking behavior _(Required)_
- [ ] Partial reads, partial writes and coalesced messages _(Required)_
- [ ] Length-prefixed framing, limits and malformed input _(Required)_
- [ ] HTTP request-response and connection reuse vocabulary _(Required)_
- [ ] Serialization, schemas, protocol versions and error taxonomy _(Required)_
- [ ] Request IDs, correlation and end-to-end trace context _(Required)_
- [ ] Deadlines, timeouts, backoff, jitter and retry budgets _(Required)_
- [ ] Idempotency keys, duplicate suppression and ambiguous side effects _(Required)_
- [ ] Cancellation, half-close and graceful connection shutdown _(Required)_
- [ ] Connection pools, server queues and load-balancing vocabulary _(Required)_
- [ ] Client, network, queue, handler and dependency latency _(Required)_
- [ ] Deterministic delay, disconnect, duplicate and restart injection _(Required)_
- [ ] Congestion-control mechanics and packet-capture analysis depth _(Optional)_
- [ ] HTTP/2, HTTP/3 and QUIC vocabulary _(Optional)_
- [ ] Custom transports, service meshes and production TLS operations _(Later)_
- [ ] Kernel-bypass and high-performance networking _(Later)_

### Resource route

- **Primary - Course:** [Beej's Guide to Network Programming - sockets to multiplexing](https://beej.us/guide/bgnet/html/) - Read What is a socket?, IP addresses and data structures, Client-server background, System calls or bust, Client-server examples, Slightly advanced techniques and sendall. Build the simple TCP pair first, then replace delimiter assumptions with a bounded length-prefixed protocol.
- **Required - Theory:** [Beej's Guide to Network Concepts - TCP and UDP path](https://beej.us/guide/bgnet0/html/) - Read the OS and sockets, protocol layering, IP, UDP and TCP chapters alongside packet captures from your own client and server. Use it to explain transport behavior rather than memorize layer names.
- **Required - Practice:** [AlgoMaster Networks - pcap and concurrent server labs](https://algomaster.io/learn/computer-networks/course-roadmap) - Use Reading a Real PCAP and Concurrent TCP Server after the Beej implementation. Reproduce one packet-level observation and one admission, deadline or shutdown behavior in your independently written service.
- **Support - Theory:** [MIT 6.5840 - RPC, threads and fault vocabulary](https://pdos.csail.mit.edu/6.824/schedule.html) - Read the introductory RPC and threads material plus the lab guidance. Use it to enumerate timeout ambiguity and duplicate effects. Stop before Raft and the full lab sequence.
- **Support - Project:** [Replicated Log and Stream Processor - protocol slice](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-2/replicated-log-stream-processor.md) - Use only the protocol requirements, deterministic network fault matrix and delivery-contract questions. Build the single-node framed service now; keep replication and consensus for the later project.

### Exit checkpoint

Pass partial, coalesced, oversized, malformed, timeout, duplicate, disconnect and restart cases against a versioned framed service. State exactly when a side effect is known, unknown, prevented or safely repeated.

<details>
<summary>Deliberately left for later</summary>

- Raft and replicated protocol implementation
- Service meshes, QUIC internals and fleet routing
- Kernel-bypass or RDMA networking

</details>

## 04. Databases, Transactions & Durable Storage

**Why:** ML data, feature state and checkpoints depend on relational correctness and crash semantics. This section connects queries to physical work and acknowledged writes to recoverable state.

### Learn this much

- [ ] Relational tables, tuples, keys and constraints _(Required)_
- [ ] Relational algebra and SQL selection, projection and joins _(Required)_
- [ ] Aggregations, windows, null behavior and boundary tests _(Required)_
- [ ] Point-in-time snapshots and feature availability _(Required)_
- [ ] Pages, records, buffer pools and storage managers _(Required)_
- [ ] Row, column and log-structured layout trade-offs _(Required)_
- [ ] Hash indexes, B-trees, selectivity and range scans _(Required)_
- [ ] Sorting, join algorithms and aggregation execution _(Required)_
- [ ] Query plans, logical work, physical work and cost drivers _(Required)_
- [ ] Transactions, atomicity, consistency, isolation and durability _(Required)_
- [ ] Dirty reads, nonrepeatable reads, phantoms and write skew _(Required)_
- [ ] Locking, two-phase locking and deadlock behavior _(Required)_
- [ ] Timestamp ordering and MVCC vocabulary _(Required)_
- [ ] Write-ahead logging, log sequence and recovery order _(Required)_
- [ ] Checksums, torn tails, snapshots and atomic metadata replacement _(Required)_
- [ ] Acknowledgement, page-cache flush and stable durability boundaries _(Required)_
- [ ] Schema and encoding evolution for stored records _(Required)_
- [ ] Read, write, space and compaction amplification vocabulary _(Required)_
- [ ] LSM compaction mechanics and bloom filters _(Optional)_
- [ ] Serializable isolation proofs _(Optional)_
- [ ] Full database management system implementation _(Later)_
- [ ] Cross-region databases and distributed transactions _(Later)_

### Resource route

- **Primary - Course:** [CMU 15-445/645 - database and storage core](https://15445.courses.cs.cmu.edu/fall2025/schedule.html) - Use Fall 2025 Lectures 1-9, 11-18 and 20-22 with their notes: relational model, SQL, storage, buffer pools, layouts, indexes, execution, planning, concurrency, MVCC, logging and recovery. Complete the matching SQL, Storage, Indexes and Filters, Transactions and Recovery homeworks before considering a BusTub project.
- **Required - Practice:** [PostgreSQL - EXPLAIN and transaction isolation lab](https://www.postgresql.org/docs/current/transaction-iso.html) - Create one normalized schema, joins, an aggregation and a window query. Compare EXPLAIN ANALYZE before and after one justified index. In two sessions, reproduce one documented isolation anomaly and prevent it with a stated database or application invariant.
- **Reference - Theory:** [Designing Data-Intensive Applications, 2nd edition - storage and transactions](https://dataintensive.net/) - Read only the sections on data models and query languages, storage and retrieval, encoding and evolution, and transactions that answer a live design question from the CMU route. Write one comparison table covering layout, index, isolation and recovery trade-offs.
- **Support - Theory:** [Operating Systems: Three Easy Pieces - persistence and integrity](https://pages.cs.wisc.edu/~remzi/OSTEP/) - Use Chapters 36, 39-45 to trace devices, filesystem structures, journaling, log-structured storage, flash and integrity. Apply the crash sequence to your own append-only store rather than repeating the SYS-1 file experiment.
- **Depth - Practice:** [CMU 15-445 - one reduced BusTub project slice](https://15445.courses.cs.cmu.edu/fall2025/assignments.html) - If a C++ database implementation is the chosen depth lane, complete Project 1 Buffer Pool Manager or Project 2 Database Index, not both during the first pass. Follow the course publication rules and keep code private. The blank-file append-only store remains the core checkpoint.

### Exit checkpoint

Recover a checksummed append-only store after crashes at every publish boundary, reproduce and prevent one transaction anomaly, and explain one query-plan change with measured logical and physical work.

<details>
<summary>Deliberately left for later</summary>

- Completing every BusTub project
- Advanced query optimization and database research systems
- Distributed transactions and production storage fleets

</details>

## 05. Distributed State, Replication & Streams

**Why:** Once state crosses machines, time, failure and delivery guarantees become part of the data model. This section builds precise vocabulary and small simulations without turning the foundation into a full consensus course.

### Learn this much

- [ ] Partial failure and unreliable timing assumptions _(Required)_
- [ ] Physical clocks, logical clocks and event ordering _(Required)_
- [ ] Replication leaders, followers, lag and failover vocabulary _(Required)_
- [ ] Quorums, intersection assumptions and stale membership counterexamples _(Required)_
- [ ] Strong, eventual, causal and session consistency vocabulary _(Required)_
- [ ] Linearizability versus serializability vocabulary _(Required)_
- [ ] Partition keys, hashing, ranges, hot keys and skew _(Required)_
- [ ] Rebalancing, ownership epochs and stale writers _(Required)_
- [ ] Conflicts, last-write-wins limits and application resolution _(Required)_
- [ ] Durable logs, offsets, acknowledgements and replay _(Required)_
- [ ] At-most-once, at-least-once and scoped effectively-once effects _(Required)_
- [ ] Idempotent consumers and transactional effect boundaries _(Required)_
- [ ] Consumer lag, backlogs, dead letters and poison records _(Required)_
- [ ] Event time, processing time, watermarks and late data _(Required)_
- [ ] Snapshots, compaction and state rebuild from a log _(Required)_
- [ ] Distributed histories, safety violations and liveness stalls _(Required)_
- [ ] Deterministic network and node-failure simulation _(Required)_
- [ ] MapReduce execution and data-local scheduling _(Optional)_
- [ ] Consensus and failure-detector vocabulary _(Optional)_
- [ ] Raft implementation and proof _(Later)_
- [ ] Sharded replicated key-value stores and cross-region systems _(Later)_

### Resource route

- **Primary - Theory:** [Designing Data-Intensive Applications, 2nd edition - distributed data path](https://dataintensive.net/) - Read the selected chapters on replication, partitioning, distributed-system trouble, consistency and consensus, batch processing and stream processing. For each guarantee, write its assumptions, a confirming history and one counterexample outside the boundary.
- **Required - Practice:** [Gossip Glomers - Echo, Unique ID and Broadcast](https://fly.io/dist-sys/) - Complete Challenge 1 Echo, Challenge 2 Unique ID Generation and Challenge 3a Single-Node Broadcast. Add 3b Multi-Node Broadcast only after writing the delivery, duplicate and partition assumptions. Preserve protocol histories rather than relying on a success banner.
- **Support - Course:** [MIT 6.5840 - MapReduce, RPC and consistency bridge](https://pdos.csail.mit.edu/6.824/schedule.html) - Use the introductory MapReduce, RPC, GFS and consistency lectures after the local RPC and store gates. The MapReduce lab is optional. Do not begin Raft or sharded KV as foundation work.
- **Optional - Practice:** [Building Distributed Systems from Scratch - one challenge path](https://builddistributedsystem.com/tracks) - Choose one messaging, durable-log or partitioning challenge that matches a failed checkpoint. State the model, failures and evidence independently because interactive grading behavior has not been verified.
- **Support - Revision:** [AlgoMaster System Design - distributed fundamentals slice](https://algomaster.io/learn/system-design/course-introduction) - Use the replication, quorum, partitioning, messaging, transaction and idempotency units as bounded review. Attempt only the exercise that matches your implemented history, then challenge its assumptions with a node-loss, delay or duplicate case.

### Exit checkpoint

Run a deterministic replication or durable-stream simulation through lag, duplicate, stale read, ownership change, replay and node loss. Defend the exact consistency, durability and delivery contract with one history that it permits and one it rejects.

<details>
<summary>Deliberately left for later</summary>

- Full Raft, Paxos or consensus implementation
- Sharded replicated databases
- Production stream-processing frameworks and cross-region operation

</details>

## 06. Observability, Reliability & Quantitative Design

**Why:** A system becomes operable when its requirements, load, bottlenecks and recovery behavior are measurable. This section turns the earlier service into evidence for capacity and reliability decisions.

### Learn this much

- [ ] Metrics, structured logs, traces and events _(Required)_
- [ ] Request correlation, trace context and causal limits _(Required)_
- [ ] Metric cardinality, labels, aggregation and sampling _(Required)_
- [ ] Latency distributions, p50, p95, p99 and tail interpretation _(Required)_
- [ ] Throughput, goodput, errors, utilization and saturation _(Required)_
- [ ] Availability, durability, SLI, SLO and error budget _(Required)_
- [ ] Recovery point, recovery time and backup freshness _(Required)_
- [ ] Arrival rate, service time, concurrency and Little's Law _(Required)_
- [ ] Capacity for requests, bytes, storage, memory and bandwidth _(Required)_
- [ ] Queue bounds, first saturation point and bottleneck migration _(Required)_
- [ ] Open-loop load and coordinated-omission vocabulary _(Required)_
- [ ] Deadlines, retry budgets, circuit breaking and amplification _(Required)_
- [ ] Admission control, load shedding and graceful degradation _(Required)_
- [ ] Failure domains and simultaneous-failure reasoning _(Required)_
- [ ] Health, readiness and domain-specific correctness signals _(Required)_
- [ ] Canary, rollback, version and migration tests _(Required)_
- [ ] Backup, restore, runbooks and incident timelines _(Required)_
- [ ] Postmortems, regression guards and prevention actions _(Required)_
- [ ] Unit cost, headroom and simpler design alternatives _(Required)_
- [ ] Basic queueing-model approximations and uncertainty ranges _(Optional)_
- [ ] Fleet-wide SRE organization and vendor-specific platforms _(Later)_
- [ ] Formal queueing networks and global capacity optimization _(Later)_

### Resource route

- **Primary - Course:** [Google Site Reliability Engineering - selected core chapters](https://sre.google/sre-book/table-of-contents/) - Read Chapters 3, 4, 6, 10, 12, 17, 19-22: risk, SLOs, monitoring, alerting, troubleshooting, reliability tests, load balancing, overload and cascading failure. Apply every concept to the same bounded RPC and store rather than inventing separate examples.
- **Required - Practice:** [Google SRE Workbook - SLO, load, incident and canary exercises](https://sre.google/workbook/table-of-contents/) - Use Chapters 2, 4, 9-11, 12, 14, 16 and 17. Define one SLO, estimate capacity, load through saturation, canary a changed version, roll it back, and write one evidence-based incident timeline.
- **Required - Reference:** [OpenTelemetry Python - metrics, logs and traces](https://opentelemetry.io/docs/languages/python/) - Instrument request ID, queue wait, handler time, storage time, status and bounded labels. Export locally, retain raw load records and verify that instrumentation does not hide the bottleneck or create unbounded cardinality.
- **Support - Practice:** [AlgoMaster System Design - quantitative and failure drills](https://algomaster.io/practice/system-design) - Use the exercises on Little's Law, availability, recovery objectives, Amdahl's Law, capacity bottlenecks, quorum simulation and failure-domain audits only after producing your own estimates. Compare the platform answer with measured service behavior.
- **Support - Project:** [Python Experimental Systems Kit - measurement slice](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/python-experimental-systems-kit.md) - Use its artifact, bounded-pipeline, failure-injection, profiling and reproducibility requirements as the evidence checklist. Reuse the current service instead of building the full project again.

### Exit checkpoint

Predict the first saturation point, then run the service through it and explain p50, p95, p99, goodput, queue depth, utilization, errors and recovery. Diagnose one injected incident from telemetry and defend the SLO, capacity and rollback plan under a 10x workload change.

<details>
<summary>Deliberately left for later</summary>

- Cloud-specific observability products
- Kubernetes, Terraform and production deployment operations
- Fleet-level capacity management and organization design

</details>

## 07. Security, Privacy & Safe Evolution

**Why:** Availability does not protect data, tenants or model behavior. This final section sets a concrete trust boundary, tests least privilege, and keeps privacy claims limited to the mechanism actually implemented.

### Learn this much

- [ ] Confidentiality, integrity, availability and accountability _(Required)_
- [ ] Assets, adversaries, attack surfaces and trust boundaries _(Required)_
- [ ] Threat models, abuse cases and residual risk _(Required)_
- [ ] Identity, authentication and authorization _(Required)_
- [ ] Least privilege, scoped credentials and secure defaults _(Required)_
- [ ] Secrets, rotation, encryption and key-lifecycle vocabulary _(Required)_
- [ ] Tenant identity, isolation and cross-tenant failure paths _(Required)_
- [ ] Input validation, injection, path and deserialization hazards _(Required)_
- [ ] Audit records, redaction and sensitive telemetry _(Required)_
- [ ] Fail-open versus fail-closed behavior _(Required)_
- [ ] Dependency and software-supply-chain risk vocabulary _(Required)_
- [ ] Membership inference, model extraction and inversion _(Required)_
- [ ] Data poisoning, backdoors and training-serving exfiltration _(Required)_
- [ ] Differential privacy adjacency and unit of privacy _(Required)_
- [ ] Sensitivity, clipping, epsilon, delta and calibrated noise _(Required)_
- [ ] Composition, subsampling intuition and accounting inputs _(Required)_
- [ ] Privacy utility trade-offs and unprotected system boundaries _(Required)_
- [ ] Schema and protocol compatibility during migration _(Required)_
- [ ] Canary, rollback, backup, restore and revocation under auth changes _(Required)_
- [ ] Private deep learning and advanced composition proofs _(Depth)_
- [ ] Formal access-control verification and sophisticated adversarial ML _(Depth)_
- [ ] Production identity platforms and compliance programs _(Later)_
- [ ] Organization-wide security operations and incident response _(Later)_

### Resource route

- **Primary - Course:** [Building Secure and Reliable Systems - selected design route](https://google.github.io/building-secure-and-reliable-systems/raw/toc.html) - Read Chapters 1, 2, 4-9 and 12-14: adversaries, trade-offs, least privilege, understandability, changing landscapes, resilience, recovery, code, tests and deployment. Apply the chapter questions to the same RPC, store, tenant and migration boundary.
- **Required - Theory:** [OpenDP theory - one bounded privacy mechanism](https://docs.opendp.org/en/stable/theory/index.html) - Read A Framework to Understand DP, Differential Privacy with OpenDP, Accuracy Pitfalls and Edge Cases, Membership and Reconstruction. Define one privacy unit, clamp an aggregate, add calibrated noise, record epsilon and delta inputs, measure utility and list everything outside the guarantee.
- **Required - Reference:** [OWASP Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html) - Inventory assets, entry points, data flows and trust boundaries. Write misuse cases for unauthorized mutation, cross-tenant reads, stale credentials, sensitive logs and restore or migration paths, then turn each into a test or explicit residual risk.
- **Support - Theory:** [OSTEP - introductory security chapters](https://pages.cs.wisc.edu/~remzi/OSTEP/) - Use Chapters 53-56 for introductory security, authentication, access control and cryptography vocabulary. Connect process and container isolation to the threat model and state where those boundaries do not protect the system.
- **Support - Assessment:** [Systems Foundations Checkpoint - security and privacy slice](https://github.com/saisandeshk/Roadmap-Final/blob/main/checkpoints/systems-foundations.md) - Use only the tenant-access, privacy aggregate, abuse, migration, backup and residual-risk requirements as the final assessment. A toy privacy mechanism is evidence for its stated aggregate, not a claim that the service or model is private.

### Exit checkpoint

Reject unauthorized and cross-tenant operations across normal, retry, cache, restore and migration paths. Demonstrate one clipped and noised aggregate with explicit accounting inputs, measured utility and a correct residual-risk statement.

<details>
<summary>Deliberately left for later</summary>

- Production cryptographic protocol design
- Private model training and advanced privacy accounting
- Compliance certification and enterprise identity platforms

</details>

## Stage milestone

### Systems Mechanisms & Failure Evidence Pack

Use one small Linux repository and one evolving local service. The three artifacts prove mechanism fluency, bounded behavior and quantitative judgment without requiring a cloud platform, a production database or a consensus implementation.

- Local mechanisms laboratory - process and signal trace, page and locality observations, file durability experiment, bounded queue, controlled concurrency failure, container resource-limit case, raw commands and reproducible measurements
- Fault-tested service slice - versioned framed RPC, request identity, deadlines, retries, cancellation, bounded admission, checksummed append-only state, crash recovery, one transaction or offset invariant and deterministic network, process and storage faults
- Systems evidence dossier - SQL and query-plan example, distributed history, SLO and capacity estimate versus load, telemetry-based incident, threat model, least-privilege tests, safe migration or rollback and one bounded private aggregate with guarantee limits

