<!-- Generated from content/curriculum.json. Edit the JSON and run npm run content:generate. -->

# 06. Distributed Systems & Data Infrastructure

**Level:** Advanced specialization  
**Scope:** 9 track stages · 298 required topics · 43 optional, depth, or later topics

Build dependable data systems from versioned RPC and crash-safe storage through replication, consensus, transactions, streams, security, evolution and formal validation. The route revises the fundamentals, then requires deterministic fault histories and a single integrated subsystem whose guarantees remain precise under failure.

## Order

DS-1. Protocols, RPC and Ambiguous Outcomes
DS-2. Time, Identity, Membership and Failure
DS-3. Storage Engines, Durability and Recovery
DS-4. Replication, Consistency and Convergence
DS-5. Consensus, Replicated Logs and Coordination
DS-6. Partitioning, Transactions and Durable Workflows
DS-7. Durable Logs, Queues and Stream Processing
DS-8. Security, Operations, Evolution and ML Data Contracts
DS-9. Formal Validation and Real-System Extension

## DS-1. Protocols, RPC and Ambiguous Outcomes

**Why:** Every later guarantee crosses a protocol boundary. Framing, compatibility, deadlines and retry semantics must therefore be explicit before replication or consensus can be trusted.

### Learn this much

- [ ] Request, response and streaming state machines _(Required)_
- [ ] Textual versus binary encoding trade-offs _(Required)_
- [ ] Schema fields, defaults and unknown-field preservation _(Required)_
- [ ] Backward and forward wire compatibility _(Required)_
- [ ] Length-prefixed and delimiter-based framing _(Required)_
- [ ] Partial reads, partial writes and coalesced messages _(Required)_
- [ ] Message size, allocation and decompression limits _(Required)_
- [ ] Checksums and corruption detection boundaries _(Required)_
- [ ] Request IDs and client incarnation identity _(Required)_
- [ ] Idempotency keys and side-effect identity _(Required)_
- [ ] Ambiguous outcomes after timeout or disconnect _(Required)_
- [ ] Monotonic deadlines and budget propagation _(Required)_
- [ ] Bounded retries across dependency hops _(Required)_
- [ ] Exponential backoff and randomized jitter _(Required)_
- [ ] Duplicate suppression state and retention limits _(Required)_
- [ ] Structured errors and retry classification _(Required)_
- [ ] Cancellation propagation and cleanup _(Required)_
- [ ] Streaming flow control and half-closed connections _(Required)_
- [ ] Authentication before application dispatch _(Required)_
- [ ] Authorization and identity propagation _(Required)_
- [ ] Service discovery and endpoint generation changes _(Required)_
- [ ] Connection lifecycle, pooling and pool exhaustion _(Required)_
- [ ] Load balancing, health and affinity semantics _(Required)_
- [ ] Bounded queues and end-to-end backpressure _(Required)_
- [ ] Overload rejection and retry amplification _(Required)_
- [ ] Trace correlation without synchronized clocks _(Required)_
- [ ] Deterministic delay, loss, duplication and reordering _(Required)_
- [ ] Versioned framed RPC implementation _(Required)_
- [ ] Mixed-version client and server test matrix _(Required)_
- [ ] Protocol rollout, rollback and deprecation contract _(Required)_
- [ ] Production gRPC interceptors and reflection _(Optional)_
- [ ] HTTP/3 and QUIC transport behavior _(Optional)_
- [ ] Formal protocol grammar and parser fuzzing _(Depth)_
- [ ] Internet-scale service discovery control planes _(Later)_

### Resource route

- **Primary - Practice:** [Building Distributed Systems - The Messenger](https://builddistributedsystem.com/tracks/messenger) - Complete the message envelope, validation, asynchronous handling, RPC timeout, retry, deduplication and observability tasks. Re-run the solutions in one local multi-process harness with deterministic faults because the public challenge interface is practice, not proof of your full protocol contract.
- **Required - Book:** [DDIA 2e - Chapter 5 Encoding and Evolution](https://dataintensive.net/) - Read formats, schema evolution, service RPC, durable workflows and event-driven dataflow. Write a four-version compatibility table and connect each compatibility claim to a wire fixture.
- **Required - Course:** [MIT 6.5840 - RPC and Threads plus Lab 2](https://pdos.csail.mit.edu/6.824/schedule.html) - Use the current Spring 2026 lecture and key-value server lab to practice concurrent RPC handlers, duplicate client requests and ambiguous responses. Preserve the course tests, then add cancellation, size-limit and mixed-version faults required by this stage.
- **Required - Reference:** [HLD Handbook - Networking, API Design and Backpressure](https://github.com/handbook-academy/engineering-handbook/tree/main/content/hld) - Read only Part 0 networking and API design, then the load balancer, service discovery, rate limiting and reliability chapters needed for the protocol design. Use the diagrams to review boundaries, not as a substitute for fault tests.
- **Support - Practice:** [Building Distributed Systems - The Networker](https://builddistributedsystem.com/tracks/networker) - Select the TCP framing, partial I/O and Protobuf or gRPC tasks that expose gaps in your DS-1 implementation. Do not complete unrelated networking challenges merely for coverage.
- **Support - Reference:** [Beej's Guide to Network Programming](https://beej.us/guide/bgnet/) - Use the client, server, send, receive, select or poll, and partial-transfer sections when socket behavior is unclear. This is a protocol mechanics reference, not the distributed-systems spine.
- **Optional - Practice:** [AlgoMaster System Design - Selected Networking and API Problems](https://algomaster.io/practice/system-design) - Use only problems on request IDs, retries, rate limits, load balancing, queues and idempotency. For every solved component, add an external fault test and explain what its simplified judge does not establish.
- **Support - Project:** [Replicated Log and Stream Processor - Protocol Slice](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-2/replicated-log-stream-processor.md) - Create the repository, message schema, request and node identities, deadline and retry contract, deterministic network scheduler and raw event format. Keep this same artifact through DS-9.

### Exit checkpoint

Pass a mixed-version fault matrix covering partial I/O, oversized or corrupt frames, timeout ambiguity, duplicate mutation, cancellation, overload, restart and rollback, then state exactly which effects may repeat.

<details>
<summary>Deliberately left for later</summary>

- Production service-mesh deployment before the local protocol contract passes
- Custom cryptographic protocol design
- Cross-language code generation beyond one compatibility fixture

</details>

## DS-2. Time, Identity, Membership and Failure

**Why:** A timeout is evidence, not proof of death. Logical order, process incarnation and fencing let the system act safely even when clocks, networks and failure detectors disagree.

### Learn this much

- [ ] Wall clock versus monotonic clock _(Required)_
- [ ] Clock drift, skew and backward jumps _(Required)_
- [ ] Clock synchronization assumptions and uncertainty _(Required)_
- [ ] Happens-before and causal order _(Required)_
- [ ] Lamport clock update rules _(Required)_
- [ ] Vector clock comparison and concurrency _(Required)_
- [ ] Hybrid logical clock state and persistence _(Required)_
- [ ] Total-order tie breaking versus causality _(Required)_
- [ ] Unique identifier collision and ordering properties _(Required)_
- [ ] Node, process and client incarnation identifiers _(Required)_
- [ ] Restart-safe identity persistence _(Required)_
- [ ] Heartbeats and observation windows _(Required)_
- [ ] Failure detector completeness and accuracy vocabulary _(Required)_
- [ ] Fixed versus adaptive suspicion thresholds _(Required)_
- [ ] False suspicion under pause, overload and packet loss _(Required)_
- [ ] Gossip dissemination and epidemic convergence _(Required)_
- [ ] Membership join, leave and replacement _(Required)_
- [ ] Membership version and stale-view handling _(Required)_
- [ ] Network partitions and asymmetric reachability _(Required)_
- [ ] Split-brain prevention boundaries _(Required)_
- [ ] Leases and their timing assumptions _(Required)_
- [ ] Process pause and lease-expiry hazards _(Required)_
- [ ] Fencing tokens and generation checks _(Required)_
- [ ] Failure domains and correlated faults _(Required)_
- [ ] Deterministic membership and network simulation _(Required)_
- [ ] Logical or hybrid clock implementation _(Required)_
- [ ] Gossip membership implementation _(Required)_
- [ ] Lease and fencing implementation _(Required)_
- [ ] Detection delay and false-suspicion measurement _(Required)_
- [ ] Gossip traffic and convergence measurement _(Required)_
- [ ] Dotted version vectors _(Optional)_
- [ ] Phi-accrual failure detector implementation _(Optional)_
- [ ] Bounded-clock APIs such as TrueTime _(Depth)_
- [ ] Byzantine and adversarial membership protocols _(Later)_

### Resource route

- **Primary - Book:** [DDIA 2e - Chapter 9 The Trouble with Distributed Systems](https://dataintensive.net/) - Read clocks, pauses, unreliable networks, partial failures and knowledge limits. For each failure, record what a node observes, what is true globally and what action is safe under that uncertainty.
- **Required - Practice:** [Building Distributed Systems - The Identifier and The Timekeeper](https://builddistributedsystem.com/tracks/timekeeper) - Implement unique IDs, Lamport clocks, vector clocks and hybrid logical clocks. Add process restart, concurrent update and clock-jump tests around the public tasks.
- **Required - Practice:** [Building Distributed Systems - The Gossiper](https://builddistributedsystem.com/tracks/gossiper) - Complete topology, dissemination, batching and partition-healing tasks, then add incarnation IDs, adaptive suspicion and reproducible convergence measurements in the capstone simulator.
- **Required - Reference:** [HLD Handbook - Clocks, Failure Detection and Consistent Hashing](https://github.com/handbook-academy/engineering-handbook/tree/main/content/hld) - Read Part 3 clocks and ordering, failure detection and consistent hashing. Use its exercises to compare assumptions, then verify claims against your own histories.
- **Support - Practice:** [Gossip Glomers - Unique IDs, Broadcast and G-Counter](https://fly.io/dist-sys/) - Use the first four Maelstrom challenges for real message histories, partition behavior and convergence. Stop before Kafka-style logs until DS-7.
- **Support - Course:** [MIT 6.5840 - Failure and Paper Discussion Lens](https://pdos.csail.mit.edu/6.824/schedule.html) - Use the RPC, GFS, Raft and consistency lectures to identify which timing assumptions affect progress and which invariants must not depend on time. Do not start the Raft lab yet.
- **Support - Project:** [Replicated Log and Stream Processor - Time and Membership Slice](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-2/replicated-log-stream-processor.md) - Add incarnation IDs, logical timestamps, gossip membership, suspicion metrics and fenced ownership. Retain seeds and minimized traces for every false-failure or stale-actor case.

### Exit checkpoint

Given a fault history, classify known, concurrent and unknowable order, demonstrate membership convergence with measured false-suspicion trade-offs, and prove that a stale actor cannot commit after authority moves.

<details>
<summary>Deliberately left for later</summary>

- Global clock assumptions stronger than the available time service
- Byzantine membership and Sybil resistance
- Fleet-scale gossip tuning before deterministic local convergence passes

</details>

## DS-3. Storage Engines, Durability and Recovery

**Why:** Replication cannot repair an undefined local durability contract. This stage makes acknowledge, persist, recover and detect corruption separate, testable events.

### Learn this much

- [ ] Workload shape for point, range and analytical access _(Required)_
- [ ] Records, pages, blocks and segments _(Required)_
- [ ] Append-only log layout _(Required)_
- [ ] Write-ahead logging order _(Required)_
- [ ] Checksummed records and metadata _(Required)_
- [ ] Buffered, flushed and durable write states _(Required)_
- [ ] fsync and acknowledged-write contract _(Required)_
- [ ] Torn, truncated and reordered write scenarios _(Required)_
- [ ] Crash-consistent metadata publication _(Required)_
- [ ] Recovery scanning and tail repair _(Required)_
- [ ] In-memory and sparse indexes _(Required)_
- [ ] B-tree page and split invariants _(Required)_
- [ ] LSM tree levels and sorted runs _(Required)_
- [ ] Memtable flush and SSTable creation _(Required)_
- [ ] Bloom filter false positives _(Required)_
- [ ] Compaction policy and write stalls _(Required)_
- [ ] Tombstones and resurrection risk _(Required)_
- [ ] Snapshots and atomic manifest replacement _(Required)_
- [ ] Compression and encoding trade-offs _(Required)_
- [ ] Caching and buffer-pool behavior _(Required)_
- [ ] Read amplification _(Required)_
- [ ] Write amplification _(Required)_
- [ ] Space amplification _(Required)_
- [ ] Sequential versus random I/O _(Required)_
- [ ] Row versus column layout _(Required)_
- [ ] OLTP versus OLAP access patterns _(Required)_
- [ ] Crash-safe append-only key-value store _(Required)_
- [ ] Segment compaction with atomic swap _(Required)_
- [ ] Crash injection at every persistence boundary _(Required)_
- [ ] Corruption injection and terminal failure _(Required)_
- [ ] Randomized model-based operation tests _(Required)_
- [ ] Latency, throughput and amplification measurement _(Required)_
- [ ] Recovery time and data-integrity measurement _(Required)_
- [ ] Columnar files, zone maps and data skipping _(Optional)_
- [ ] Object-storage table metadata _(Optional)_
- [ ] Query execution and vectorization internals _(Depth)_
- [ ] Copy-on-write trees and storage disaggregation _(Depth)_
- [ ] Custom filesystem or storage-device implementation _(Later)_

### Resource route

- **Primary - Course and project:** [CMU 15-445 - Storage, Index and Recovery Sequence](https://15445.courses.cs.cmu.edu/fall2025/schedule.html) - Follow Fall 2025 lectures 3 to 10 and 21 to 22. Implement the Buffer Pool Manager and Database Index projects if the archived starter is available, and use the recovery homework or lecture fixtures for WAL reasoning. Keep C++ project scope bounded to storage and recovery.
- **Required - Book:** [DDIA 2e - Chapter 4 Storage and Retrieval](https://dataintensive.net/) - Read log-structured storage, B-trees, indexing, analytical layout and vectorized execution. Build a workload decision table, then connect each claim to a measurement from your small store.
- **Required - Practice:** [Building Distributed Systems - The Logger and Indexes](https://builddistributedsystem.com/tracks/logger) - Complete selected WAL, LSM, B-tree and sparse-index challenges. Add fsync boundaries, torn-write injection and recovery oracles that the focused tasks do not provide together.
- **Required - Reference:** [HLD Handbook - Storage Engines and Data Structures](https://github.com/handbook-academy/engineering-handbook/tree/main/content/hld) - Read Part 0 data structures plus Part 4 storage engines and OLTP versus OLAP. Use its exercises for comparison, while the CMU project and local fault tests remain the implementation evidence.
- **Support - Reference:** [The Internals of PostgreSQL - Storage, WAL and Recovery](https://www.interdb.jp/pg/) - Use only the storage, buffer manager, WAL, recovery and replication chapters to compare your simplified design with a real database. Match claims to the documented PostgreSQL version.
- **Optional - Practice:** [Build Your Own Redis](https://build-your-own.org/redis/) - Use the persistence and data-structure portions only if a second implementation is needed to cement parsing, indexing or append-log behavior. Do not replace the crash-tested stage artifact with tutorial completion.
- **Support - Project:** [Replicated Log and Stream Processor - Storage Slice](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-2/replicated-log-stream-processor.md) - Implement checksummed segments, indexes, acknowledgement states, recovery, retention and atomic metadata changes. Preserve every crash schedule and corrupted artifact needed to reproduce a failure.

### Exit checkpoint

Preserve the declared acknowledgement contract across crashes at every write and compaction boundary, detect or safely recover corrupted state, and explain latency from measured amplification, caching and access patterns.

<details>
<summary>Deliberately left for later</summary>

- A full production database engine
- SSD firmware and filesystem internals beyond the observed durability boundary
- Vector indexing before ordinary storage and recovery invariants pass

</details>

## DS-4. Replication, Consistency and Convergence

**Why:** Copies improve availability only when the read, write, conflict and repair rules are precise. Recorded histories turn vague consistency labels into contracts that can fail a test.

### Learn this much

- [ ] Leader-follower replication _(Required)_
- [ ] Multi-leader replication vocabulary _(Required)_
- [ ] Leaderless replication vocabulary _(Required)_
- [ ] Synchronous versus asynchronous acknowledgement _(Required)_
- [ ] Replication logs, positions and lag _(Required)_
- [ ] Failover and stale-leader risk _(Required)_
- [ ] Stale reads and monotonicity _(Required)_
- [ ] Read-your-writes session guarantees _(Required)_
- [ ] Monotonic reads and writes _(Required)_
- [ ] Linearizability as a history property _(Required)_
- [ ] Sequential consistency _(Required)_
- [ ] Causal consistency _(Required)_
- [ ] Eventual consistency and convergence _(Required)_
- [ ] Availability under partition _(Required)_
- [ ] Read and write quorum intersection _(Required)_
- [ ] Membership assumptions behind quorum arithmetic _(Required)_
- [ ] Sloppy quorums and hinted handoff _(Required)_
- [ ] Read repair _(Required)_
- [ ] Background anti-entropy _(Required)_
- [ ] Merkle trees for difference localization _(Required)_
- [ ] Concurrent write conflicts _(Required)_
- [ ] Last-write-wins clock hazards _(Required)_
- [ ] Version vectors and causal conflict detection _(Required)_
- [ ] Tombstones and delete convergence _(Required)_
- [ ] Replica rejoin and replacement _(Required)_
- [ ] Operation history schema _(Required)_
- [ ] Single-object reference model _(Required)_
- [ ] Linearizability or contract checker _(Required)_
- [ ] Deterministic replicated-store simulation _(Required)_
- [ ] Partition, failover and repair fault schedules _(Required)_
- [ ] Latency, availability and staleness measurement _(Required)_
- [ ] Conflict, repair traffic and convergence measurement _(Required)_
- [ ] State-based and operation-based CRDT vocabulary _(Optional)_
- [ ] Dotted version-vector conflict sets _(Optional)_
- [ ] Strict serializability across multiple objects _(Depth)_
- [ ] Probabilistic bounded-staleness analysis _(Depth)_
- [ ] Global active-active replication rollout _(Later)_

### Resource route

- **Primary - Book:** [DDIA 2e - Chapter 6 Replication and Chapter 10 Consistency Sections](https://dataintensive.net/) - Read replication completely, then the consistency-model and linearizability portions of Chapter 10. Convert every named guarantee into allowed and forbidden histories before selecting implementation policy.
- **Required - Course and papers:** [MIT 6.5840 - Consistency, Linearizability and Replication Papers](https://pdos.csail.mit.edu/6.824/schedule.html) - Use Spring 2026 lectures 8, 12 and 13 plus their Linearizability, Spanner and Chain Replication readings. Write one history question per mechanism and answer it before looking at the discussion material.
- **Required - Practice:** [Building Distributed Systems - The Store](https://builddistributedsystem.com/tracks/store) - Implement client routing, linearizable reads, retry deduplication, snapshots and bounded-staleness follower reads. Add a history checker and membership-change faults outside the platform.
- **Required - Reference:** [HLD Handbook - Consistency, Quorums, Replication and Anti-Entropy](https://github.com/handbook-academy/engineering-handbook/tree/main/content/hld) - Read Part 1 consistency plus Part 2 replication and Part 3 consistency, quorums, CAP and PACELC, clocks and Merkle trees. Use the chapter exercises as oral review after implementing the histories.
- **Support - Reference:** [Jepsen Consistency Models](https://jepsen.io/consistency/models) - Use the model hierarchy and history definitions to name the exact contract being checked. Start with linearizability and strict serializability, and avoid claiming a stronger model than the checker covers.
- **Support - Practice:** [Gossip Glomers - Broadcast and Grow-Only Counter](https://fly.io/dist-sys/) - Use the broadcast and counter workloads to observe convergence, duplicates and partition healing. Explain why convergence alone does not imply linearizability or transaction isolation.
- **Support - Project:** [Replicated Log and Stream Processor - Replication Slice](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-2/replicated-log-stream-processor.md) - Add configurable replication, lag, failover, recorded histories, repair and a checked consistency contract. Preserve one violating history and the fix or narrowed claim.

### Exit checkpoint

State a consistency contract that accepts or rejects recorded histories, reproduce one violation under partition or failover, and defend the measured latency, availability, staleness, conflict and repair trade-off.

<details>
<summary>Deliberately left for later</summary>

- Production database benchmarking without a matched contract and workload
- Universal CAP labels without operation and failure scope
- Geo-replication before local history checking is trustworthy

</details>

## DS-5. Consensus, Replicated Logs and Coordination

**Why:** Consensus is learned through invariants and adversarial schedules. A working happy-path election is insufficient until committed entries survive partitions, restarts, snapshots and leadership changes.

### Learn this much

- [ ] State-machine replication model _(Required)_
- [ ] Safety versus liveness _(Required)_
- [ ] Terms, ballots and monotonic epochs _(Required)_
- [ ] Follower, candidate and leader states _(Required)_
- [ ] Randomized election timeouts _(Required)_
- [ ] RequestVote freshness rule _(Required)_
- [ ] AppendEntries consistency check _(Required)_
- [ ] Log matching property _(Required)_
- [ ] Conflict truncation and repair _(Required)_
- [ ] Majority quorum commitment _(Required)_
- [ ] Current-term commit restriction _(Required)_
- [ ] Committed-entry preservation _(Required)_
- [ ] Ordered exactly-once state-machine application _(Required)_
- [ ] Persistent term, vote and log state _(Required)_
- [ ] Crash and restart behavior _(Required)_
- [ ] Leader completeness _(Required)_
- [ ] Split vote and election recovery _(Required)_
- [ ] Leader partition and stale messages _(Required)_
- [ ] Slow follower and backtracking _(Required)_
- [ ] Snapshot creation and log compaction _(Required)_
- [ ] Snapshot installation _(Required)_
- [ ] Membership change safety _(Required)_
- [ ] Linearizable read paths _(Required)_
- [ ] ReadIndex and quorum confirmation _(Required)_
- [ ] Lease reads and clock assumptions _(Required)_
- [ ] Fenced locks and stale-holder rejection _(Required)_
- [ ] Deterministic message scheduler _(Required)_
- [ ] Random schedule generation with seeds _(Required)_
- [ ] Invariant checks after every transition _(Required)_
- [ ] Failure-history minimization _(Required)_
- [ ] Election, commit and recovery latency measurement _(Required)_
- [ ] Message and snapshot cost measurement _(Required)_
- [ ] Availability versus safety diagnosis _(Required)_
- [ ] Joint-consensus membership implementation _(Optional)_
- [ ] Pre-vote and leadership-transfer mechanisms _(Optional)_
- [ ] Multi-Paxos comparison _(Depth)_
- [ ] Verified consensus proof artifacts _(Depth)_
- [ ] Byzantine fault-tolerant consensus _(Later)_

### Resource route

- **Primary - Course and lab:** [MIT 6.5840 - Lab 3 Raft](https://pdos.csail.mit.edu/6.824/labs/lab-raft1.html) - Complete Spring 2026 Lab 3A to 3D in order with the extended Raft paper. Keep the official tests, then add deterministic message schedules, durable crash injection, state-machine invariants and minimized traces in your own harness.
- **Required - Paper:** [In Search of an Understandable Consensus Algorithm](https://raft.github.io/raft.pdf) - Read the extended Raft paper alongside each lab part. Maintain a one-page invariant ledger for election safety, log matching, leader completeness, state-machine safety and membership change.
- **Required - Book:** [DDIA 2e - Chapter 10 Consistency and Consensus](https://dataintensive.net/) - Read consensus, total-order broadcast, linearizable storage and coordination sections after the first Raft implementation. Compare abstraction boundaries rather than memorizing protocol names.
- **Required - Practice:** [Building Distributed Systems - The Elector and The Consensus](https://builddistributedsystem.com/tracks/consensus) - Use the election, log matching, commitment, application and snapshot challenges as focused drills. The MIT lab and your deterministic harness remain the integrated proof surface.
- **Support - Reference:** [HLD Handbook - Consensus Protocols](https://github.com/handbook-academy/engineering-handbook/tree/main/content/hld) - Use Part 3 consensus for visual review of Raft and Multi-Paxos after the invariant ledger is complete. Check any simplified production claim against primary papers or official system documentation.
- **Support - Lab:** [MIT 6.5840 - Lab 4 KV Raft](https://pdos.csail.mit.edu/6.824/labs/lab-kvraft1.html) - Implement the key-value layer only after Raft invariants pass. Focus on client identity, duplicate suppression, snapshot state and request completion across leadership change.
- **Depth - Course:** [TLA+ Video Course - Transaction Commit and Paxos Commit](https://lamport.azurewebsites.net/video/videos.html) - Watch lectures 5 to 7 only after implementing Raft. Compare the abstract commit specification with the implementation and save the full TLA+ learning route for DS-9.
- **Support - Project:** [Replicated Log and Stream Processor - Consensus Slice](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-2/replicated-log-stream-processor.md) - Add the reduced replicated log, persistence, snapshots and fenced ownership. Preserve a seeded campaign for partition, restart, stale leader, conflicting log and snapshot mismatch.

### Exit checkpoint

Preserve consensus safety across loss, duplication, reordering, partitions, crashes, restarts and snapshots, minimize one non-progress history, and prevent stale clients from committing protected effects.

<details>
<summary>Deliberately left for later</summary>

- Production consensus replacement
- Paxos variants before one protocol's invariants are executable
- Timeout tuning used to mask a safety defect

</details>

## DS-6. Partitioning, Transactions and Durable Workflows

**Why:** Scaling ownership and coordinating effects create different failure windows. This stage connects partition movement, isolation and workflow recovery to an explicit business invariant.

### Learn this much

- [ ] Range partitioning _(Required)_
- [ ] Hash partitioning _(Required)_
- [ ] Consistent hashing rings _(Required)_
- [ ] Rendezvous hashing _(Required)_
- [ ] Virtual nodes and weighted placement _(Required)_
- [ ] Partition map versioning _(Required)_
- [ ] Routing, redirects and stale configuration _(Required)_
- [ ] Replication-aware placement _(Required)_
- [ ] Online shard movement _(Required)_
- [ ] Ownership epochs during rebalance _(Required)_
- [ ] Hot keys and load skew _(Required)_
- [ ] Scatter-gather tail latency _(Required)_
- [ ] Local versus global secondary indexes _(Required)_
- [ ] Cross-shard aggregation and join cost _(Required)_
- [ ] ACID and transaction boundaries _(Required)_
- [ ] Dirty reads and nonrepeatable reads _(Required)_
- [ ] Lost updates and write skew _(Required)_
- [ ] Serializability and strict serializability _(Required)_
- [ ] Two-phase locking and deadlocks _(Required)_
- [ ] Timestamp ordering and optimistic concurrency _(Required)_
- [ ] MVCC snapshots and garbage collection _(Required)_
- [ ] Two-phase commit states _(Required)_
- [ ] Participant durable prepare state _(Required)_
- [ ] Coordinator failure and blocking _(Required)_
- [ ] In-doubt recovery and presumed outcomes _(Required)_
- [ ] Saga orchestration versus choreography _(Required)_
- [ ] Compensation semantics and irreversible effects _(Required)_
- [ ] Transactional outbox and inbox _(Required)_
- [ ] Idempotent workflow steps _(Required)_
- [ ] Exactly-once effect boundary _(Required)_
- [ ] Reconciliation and invariant repair _(Required)_
- [ ] Partition-map implementation and movement tests _(Required)_
- [ ] Durable workflow implementation and fault tests _(Required)_
- [ ] Skew, movement, abort and recovery measurement _(Required)_
- [ ] Change-data-capture driven index maintenance _(Optional)_
- [ ] Read-only distributed snapshot coordination _(Optional)_
- [ ] Externally consistent transactions with bounded clocks _(Depth)_
- [ ] Distributed query planning under skew _(Depth)_
- [ ] Production geo-sharded database operation _(Later)_

### Resource route

- **Primary - Book:** [DDIA 2e - Chapters 7 and 8 Sharding and Transactions](https://dataintensive.net/) - Read both chapters completely. Build a decision table connecting access pattern, partition key, isolation, atomicity, failure and recovery before implementing either the partition map or workflow.
- **Required - Course and project:** [CMU 15-445 - Concurrency Control, Logging and Recovery](https://15445.courses.cs.cmu.edu/fall2025/schedule.html) - Follow Fall 2025 lectures 17 to 22, the transactions homework and the concurrency-control project where available. Reproduce lost update and write skew outside the project before claiming an isolation level.
- **Required - Course and lab:** [MIT 6.5840 - Distributed Transactions and Lab 5 Sharded KV](https://pdos.csail.mit.edu/6.824/labs/lab-shard1.html) - Use lecture 11 and Lab 5 for coordinator failure, shard ownership and migration. Treat the lab as the integrated advanced path; a smaller deterministic partition map is sufficient for the compulsory gate if time is constrained.
- **Required - Practice:** [Building Distributed Systems - The Sharder and The Coordinator](https://builddistributedsystem.com/tracks/coordinator) - Select consistent hashing, configuration change, migration, hot-key, 2PC, coordinator recovery, saga and idempotency tasks. Add a durable history and invariant oracle around the selected challenges.
- **Required - Reference:** [HLD Handbook - Sharding, Distributed Transactions and Idempotency](https://github.com/handbook-academy/engineering-handbook/tree/main/content/hld) - Read Part 2 database sharding, then Part 3 distributed transactions, idempotency and consistent hashing. Use Part 5 event patterns only for the chosen workflow design.
- **Support - Practice:** [AlgoMaster System Design - Selected Sharding and Transaction Problems](https://algomaster.io/practice/system-design) - Use focused problems on consistent hashing, Paxos acceptor, transactions, sagas, outbox and queues as interview drills. The capstone must supply real persistence, fault history and load evidence.
- **Support - Project:** [Replicated Log and Stream Processor - Partition and Workflow Slice](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-2/replicated-log-stream-processor.md) - Add partition routing, ownership epochs, rebalance, one cross-partition invariant and a durable transaction or saga path. Inject stale routes, coordinator death, duplicate steps and failed compensation.

### Exit checkpoint

Rebalance without violating ownership, reproduce and prevent the selected isolation anomaly, and preserve one cross-service invariant through duplicate delivery, partial failure, coordinator death and reconciliation.

<details>
<summary>Deliberately left for later</summary>

- Cross-region distributed SQL deployment
- Three-phase commit as a default production answer
- Global secondary indexes without a clear access and consistency contract

</details>

## DS-7. Durable Logs, Queues and Stream Processing

**Why:** Data infrastructure is a set of ordering, ownership, state and replay contracts. The same event can be durably stored yet still be lost, duplicated or misapplied at an external effect boundary.

### Learn this much

- [ ] Append-only segmented log _(Required)_
- [ ] Offsets and sparse indexes _(Required)_
- [ ] Retention versus compaction _(Required)_
- [ ] Partitions and per-partition ordering _(Required)_
- [ ] Replication and high-watermark visibility _(Required)_
- [ ] Producer acknowledgement choices _(Required)_
- [ ] Idempotent producer sequence state _(Required)_
- [ ] Transactional producer scope _(Required)_
- [ ] Consumers, pull loops and fetch positions _(Required)_
- [ ] Consumer groups and ownership _(Required)_
- [ ] Assignment and rebalance protocols _(Required)_
- [ ] Offset commit versus application state _(Required)_
- [ ] At-most-once delivery _(Required)_
- [ ] At-least-once delivery _(Required)_
- [ ] Effectively-once effect contract _(Required)_
- [ ] Retries, poison records and dead letters _(Required)_
- [ ] Backpressure and bounded backlog _(Required)_
- [ ] Replay and deterministic reprocessing _(Required)_
- [ ] Schema registry and compatibility _(Required)_
- [ ] Change data capture and source offsets _(Required)_
- [ ] Event time versus processing time _(Required)_
- [ ] Tumbling, sliding and session windows _(Required)_
- [ ] Watermarks as progress estimates _(Required)_
- [ ] Idle sources and watermark stalls _(Required)_
- [ ] Late-data and update policy _(Required)_
- [ ] Stateful operators and keyed state _(Required)_
- [ ] Checkpoint barriers and state snapshots _(Required)_
- [ ] Source-state-sink recovery boundary _(Required)_
- [ ] Distributed dataflow graph _(Required)_
- [ ] Shuffle, partitioning and operator parallelism _(Required)_
- [ ] Batch and stream unification vocabulary _(Required)_
- [ ] Mini partition-log implementation _(Required)_
- [ ] Consumer group and replay implementation _(Required)_
- [ ] Event-time processor and checkpoint implementation _(Required)_
- [ ] Lag, throughput, recovery and duplicate measurement _(Required)_
- [ ] Open table formats, snapshots and atomic metadata _(Optional)_
- [ ] Incremental materialized views and differential dataflow _(Optional)_
- [ ] Unaligned checkpoints and barrier alignment _(Depth)_
- [ ] Distributed batch query execution and adaptive scheduling _(Depth)_
- [ ] Multi-region streaming platform operation _(Later)_

### Resource route

- **Primary - Book:** [DDIA 2e - Chapters 11 to 13 Batch and Stream Processing](https://dataintensive.net/) - Read batch processing, stream processing and the streaming-systems philosophy in order. For every guarantee, mark the source position, operator state, output effect and recovery boundary it actually covers.
- **Required - Practice:** [Building Distributed Systems - Mini-Kafka](https://builddistributedsystem.com/projects/mini-kafka) - Build the partition log, leader and high-watermark path, idempotent producer and consumer-group portions. Add late data, state checkpointing and an external-effect oracle in the capstone rather than assuming broker semantics solve them.
- **Required - Reference:** [Apache Kafka - Design and Semantics Documentation](https://kafka.apache.org/documentation/) - Use the current official design, replication, log compaction, producer idempotence, transactions and consumer-group documentation to compare your mini log with real contracts. Pin the documentation version used in notes.
- **Required - Reference and lab:** [Apache Flink - Event Time, State and Checkpointing](https://nightlies.apache.org/flink/flink-docs-stable/docs/concepts/stateful-stream-processing/) - Use official event-time, watermark, state and checkpoint documentation to implement one bounded local processor. Inject idle sources, late events, task failure and sink ambiguity, then inspect the resulting state and outputs.
- **Required - Reference:** [HLD Handbook - Queues, Streaming, Stream vs Batch and CDC](https://github.com/handbook-academy/engineering-handbook/tree/main/content/hld) - Read only Part 2 message queues and pub-sub plus Part 4 stream versus batch and change data capture. Use Part 5 event-driven architecture after the underlying log and replay contract is clear.
- **Support - Lab:** [MIT 6.5840 - Lab 1 MapReduce](https://pdos.csail.mit.edu/6.824/labs/lab-mr.html) - Complete or review the coordinator and worker lab to connect deterministic batch dataflow, task retries and output publication. Do not confuse its shared-filesystem assumptions with the durable log contract.
- **Support - Project:** [Replicated Log and Stream Processor - Full Data Path](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-2/replicated-log-stream-processor.md) - Complete partitioned log, producer identity, consumer ownership, offsets, backpressure, event-time state, checkpoint, replay and sink boundary. Run the required producer, consumer, storage and late-data fault campaign.

### Exit checkpoint

Preserve the stated ordering and effect semantics across producer and consumer retries, rebalance, crash and replay, then recover matching offsets, state and outputs while handling late data under an explicit event-time policy.

<details>
<summary>Deliberately left for later</summary>

- Operating a production Kafka or Flink cluster
- Exactly-once claims that omit the external effect boundary
- A lakehouse platform before log, state and replay contracts pass

</details>

## DS-8. Security, Operations, Evolution and ML Data Contracts

**Why:** A correct algorithm can still fail through identity, overload, restore, migration or stale data. This stage makes security and operations part of the state machine, then connects those contracts to ML data lineage and freshness.

### Learn this much

- [ ] Client, service, operator and dependency threat model _(Required)_
- [ ] Workload identity and mutual authentication _(Required)_
- [ ] Authorization at every data path _(Required)_
- [ ] Tenant isolation and cache boundaries _(Required)_
- [ ] Encryption in transit and at rest _(Required)_
- [ ] Secret and key rotation _(Required)_
- [ ] Audit event integrity and bounded cardinality _(Required)_
- [ ] SLI, SLO and error-budget definitions _(Required)_
- [ ] Latency, error, saturation and correctness telemetry _(Required)_
- [ ] Capacity headroom and failure reserve _(Required)_
- [ ] Overload detection and load shedding _(Required)_
- [ ] Retry budgets, circuit breaking and cascading failure _(Required)_
- [ ] Correlated-failure and chaos scenarios _(Required)_
- [ ] Replication versus backup _(Required)_
- [ ] Recovery point and recovery time objectives _(Required)_
- [ ] Backup integrity and restore verification _(Required)_
- [ ] Disaster-recovery failover and failback _(Required)_
- [ ] Rolling protocol and schema evolution _(Required)_
- [ ] Mixed-version behavior and feature gates _(Required)_
- [ ] Expand, migrate and contract state changes _(Required)_
- [ ] Rollback boundaries and irreversible transformations _(Required)_
- [ ] Data classification and retention _(Required)_
- [ ] Deletion propagation and tombstones _(Required)_
- [ ] Lineage, provenance and reproducible backfills _(Required)_
- [ ] Point-in-time feature joins _(Required)_
- [ ] Online and offline feature equivalence _(Required)_
- [ ] Model-registry version and promotion state _(Required)_
- [ ] Artifact and checkpoint checksums _(Required)_
- [ ] Retrieval-index freshness and rebuild state _(Required)_
- [ ] Dataset and evaluation version identity _(Required)_
- [ ] Multi-tenant fault and restore tests _(Required)_
- [ ] Mixed-version migration and rollback tests _(Required)_
- [ ] Load, chaos, backup and restore campaign _(Required)_
- [ ] Incident reconstruction and runbook execution _(Required)_
- [ ] Capacity, recovery and migration cost measurement _(Required)_
- [ ] Data residency and jurisdiction mapping _(Optional)_
- [ ] Privacy-preserving analytics mechanisms _(Optional)_
- [ ] Multi-region disaster recovery and failback _(Depth)_
- [ ] Supply-chain attestation for data and binaries _(Depth)_
- [ ] Organization-wide identity and governance platform _(Later)_

### Resource route

- **Primary - Course and reference:** [HLD Handbook - Reliability, Operations and Security at Scale](https://github.com/handbook-academy/engineering-handbook/tree/main/content/hld) - Read Part 6 observability, SLOs, resilience, overload, deployments, chaos, incidents and health, then Part 7 authentication, mTLS, secrets, tenancy and data governance chapters relevant to the capstone. Skip unrelated case studies.
- **Required - Book:** [DDIA 2e - Chapters 2, 5 and 14](https://dataintensive.net/) - Use nonfunctional requirements, encoding evolution and Doing the Right Thing to define measurable reliability, safe compatibility, human impact, governance and evidence boundaries for the system.
- **Required - Book:** [Google SRE Books - SLOs, Monitoring, Overload, Cascades and Incidents](https://sre.google/books/) - Read only the SLO, monitoring, handling overload, cascading failures, distributed consensus, incident response and postmortem chapters. Convert each into one alert, limit, load test or runbook action in the capstone.
- **Required - Practice:** [Building Distributed Systems - The Tracer, The Securitor and The Migrator](https://builddistributedsystem.com/tracks) - Select distributed tracing, identity, authorization, secret, migration and rollback tasks that match the stage. Integrate them into the existing subsystem rather than treating isolated task completion as operational evidence.
- **Support - Standard:** [SPIFFE Workload Identity and Workload API](https://spiffe.io/docs/latest/spiffe-specs/spiffe_workload_api/) - Use the concepts and Workload API specification to design service identity, short-lived credentials and trust-bundle rotation. A local mock is sufficient unless a real SPIRE deployment answers a specific gap.
- **Support - Standard and reference:** [OpenTelemetry Signals and Semantic Conventions](https://opentelemetry.io/docs/concepts/signals/) - Define traces, metrics and logs with bounded attributes and stable request, node, partition, term and offset identities. Measure observer overhead and never infer global order from display timestamps.
- **Support - Project:** [Replicated Log and Stream Processor - Production Contract](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-2/replicated-log-stream-processor.md) - Add workload identity, tenant checks, audit, SLOs, capacity limits, backup and verified restore, mixed-version migration, rollback and reduced point-in-time ML data paths. Run one compound incident from detection through recovery.

### Exit checkpoint

Prevent cross-tenant access, survive overload without unbounded queues, restore verified state within the declared objectives, and complete a mixed-version migration and rollback while preserving lineage, freshness and deletion contracts.

<details>
<summary>Deliberately left for later</summary>

- A full Kubernetes or service-mesh platform
- Compliance certification work
- Multi-region active-active operation before local recovery is reliable

</details>

## DS-9. Formal Validation and Real-System Extension

**Why:** The final stage turns implementation experience into defensible engineering. You will specify the invariant, search adversarial histories, modify one real boundary and preserve evidence about where the change loses.

### Learn this much

- [ ] Abstract state-machine specification _(Required)_
- [ ] State variables, initial state and next-state relation _(Required)_
- [ ] Safety invariants _(Required)_
- [ ] Liveness properties and fairness assumptions _(Required)_
- [ ] Implementation versus specification refinement _(Required)_
- [ ] Nondeterminism and environment actions _(Required)_
- [ ] Finite model bounds and state explosion _(Required)_
- [ ] TLC safety and liveness checking _(Required)_
- [ ] Counterexample trace interpretation _(Required)_
- [ ] Two-phase commit specification _(Required)_
- [ ] Replicated-log or workflow specification _(Required)_
- [ ] State-based CRDT semilattice requirements _(Required)_
- [ ] Operation-based CRDT delivery requirements _(Required)_
- [ ] Property-based state-machine testing _(Required)_
- [ ] Deterministic schedule exploration _(Required)_
- [ ] Operation-history normalization _(Required)_
- [ ] Linearizability checker scope _(Required)_
- [ ] Jepsen generator, client, nemesis and checker roles _(Required)_
- [ ] Fault-model and workload coverage matrix _(Required)_
- [ ] System architecture reconstruction _(Required)_
- [ ] Protocol, storage and recovery path tracing _(Required)_
- [ ] Control-plane versus data-plane state _(Required)_
- [ ] Consistency, durability and delivery contract extraction _(Required)_
- [ ] Geo-replication latency and failure assumptions _(Required)_
- [ ] Storage disaggregation trade-offs _(Required)_
- [ ] ML data-plane provenance closure _(Required)_
- [ ] One bounded real-code contribution _(Required)_
- [ ] Reference fallback and compatibility path _(Required)_
- [ ] Unit, property, integration and fault tests _(Required)_
- [ ] Three mechanism-isolating ablations _(Required)_
- [ ] Three informative workload regions _(Required)_
- [ ] Negative or neutral result preservation _(Required)_
- [ ] Raw histories and immutable environment manifest _(Required)_
- [ ] Proved, model-checked, simulated and measured labels _(Required)_
- [ ] Independent reproduction package _(Required)_
- [ ] Skeptical architecture and invariant defense _(Required)_
- [ ] One state-based or operation-based CRDT implementation _(Optional)_
- [ ] One geo-replication design comparison _(Optional)_
- [ ] Refinement mapping between abstract and implementation models _(Depth)_
- [ ] Real open-source contribution and external review _(Depth)_
- [ ] Full mechanized proof or production-scale verification platform _(Later)_

### Resource route

- **Primary - Course:** [TLA+ Video Course](https://lamport.azurewebsites.net/video/videos.html) - Complete lectures 1 to 10 while specifying a reduced transaction, workflow or replicated-log model from the capstone. Run TLC after every extension and retain the first meaningful counterexample rather than polishing only the final model.
- **Required - Course and project:** [MIT 6.5840 - Verification Lecture and Final Project](https://pdos.csail.mit.edu/6.824/schedule.html) - Study the Spring 2026 verification lecture and IronFleet reading, then use the final-project guidance to frame a bounded real-system extension, evaluation and report. Course grading and staff review are unavailable to self-study, so use the roadmap defense rubric.
- **Required - Testing reference:** [Jepsen - Consistency Models and Analyses](https://jepsen.io/consistency/models) - Use its history vocabulary, model definitions and public analyses to design a generator, fault nemesis and checker for the selected contract. A simplified local checker must declare its object, model and completeness limits.
- **Required - Book:** [DDIA 2e - Chapters 9, 10 and 14 Review](https://dataintensive.net/) - Revisit uncertainty, consistency, consensus and responsible system design while extracting the final contract. Use the book to challenge assumptions and alternatives, not to replace executable evidence.
- **Support - Practice:** [Building Distributed Systems - Advanced and Real Systems Tracks](https://builddistributedsystem.com/tracks/advanced) - Choose one CRDT, MapReduce, coordination or advanced protocol task that targets a remaining gap. Integrate its state machine and faults into the capstone instead of starting a second broad project.
- **Support - Reference:** [HLD Handbook - CRDTs, Multi-Region and Architecture Trade-offs](https://github.com/handbook-academy/engineering-handbook/tree/main/content/hld) - Read the CRDT, multi-region, distributed SQL and relevant case-study chapters only after the formal core passes. Use its design prompts to prepare the final comparison and defense.
- **Depth - Course and papers:** [CMU 15-721 - Selected Advanced Database Systems Units](https://15721.courses.cs.cmu.edu/spring2024/schedule.html) - Select at most one unit on data formats, scheduling, execution, lakehouse architecture or an open-source project that directly informs the chosen extension. This course assumes database implementation depth and is not compulsory linear study.
- **Support - Project:** [Replicated Log and Stream Processor - Final Capstone](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-2/replicated-log-stream-processor.md) - Finish the protocol and invariant specification, deterministic fault campaign, bounded real-code extension, fallback, ablations, workload regions, negative result, operations dossier and independent reproduction package.

### Exit checkpoint

Deliver a bounded real-system contribution with an executable invariant or history checker, three ablations, three workload regions, one honest neutral or negative result, fault and rollback evidence, and independently reproducible claims labeled by evidence level.

<details>
<summary>Deliberately left for later</summary>

- A broad rewrite without a reviewable hypothesis
- Unbounded model checking presented as proof
- Production Jepsen or multi-region claims without the exact environment

</details>

## Track milestone

### Replicated Log and Stream Processor

Carry one reduced data system through the entire track. Build correctness and recovery on deterministic local processes, then add one bounded real-system extension whose performance, failure and evidence boundaries can withstand skeptical review.

- A versioned protocol, deterministic network and storage fault harness, restart-safe identity and time model, checksummed local log, explicit acknowledgement contract, replication histories and executable consistency checks.
- A replicated or consensus-backed partition log with ownership epochs, durable producer and consumer state, rebalance, transaction or saga boundary, event-time processing, checkpoints, backpressure, replay and minimized safety and liveness failures.
- A secured and observable production dossier plus one bounded real-code extension with migration and rollback, verified backup and restore, three ablations, three workload regions, an honest negative result, formal or property validation and independent reproduction with evidence labels.

