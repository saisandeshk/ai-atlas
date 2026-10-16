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

### Study units

#### U1. Request, response and streaming state machines, and textual versus binary encoding

**About 4 h** · **Target:** Explain + Implement

Topics: Request, response and streaming state machines; Textual versus binary encoding trade-offs

Every later guarantee in this track crosses an RPC boundary. If the call states and the encoding contract are vague, retries, versioning and tracing have nothing to attach to.

**You can now**

- Explain the states of a unary call and of each direction of a streaming call, including half-close and cancellation.
- Contrast textual and binary encodings on size, schema dependence and human readability using measured byte counts.
- Implement a unary request-response exchange with structured errors over a byte transport.

**Study**

1. [DDIA 2e Chapter 5: services and encoding sizes](https://dataintensive.net/) (DDIA 2e - Chapter 5 Encoding and Evolution) - Chapter 5, Dataflow Through Services: REST and RPC (pp. 180-186) for service, IDL and rolling-upgrade framing; Formats for Encoding Data (pp. 163-169) for the worked sizes: JSON 81 bytes, binary JSON 66 bytes, Protocol Buffers 33 bytes.
2. [gRPC core concepts: unary and streaming lifecycles](https://grpc.io/docs/what-is-grpc/core-concepts/) (gRPC Guides - Deadlines, Cancellation, Status Codes, Retry and Flow Control) - RPC life cycle: unary call versus server, client and bidirectional streaming; how one request maps to one response or to independent message streams.
3. [Proto3 scalar types and binary wire shape](https://protobuf.dev/programming-guides/proto3/) (Protocol Buffers and Avro - Unknown Fields and Schema Resolution) - Scalar Value Types table and Assigning Field Numbers: field numbers 1 to 15 take one byte on the wire; numbers 19000 to 19999 are reserved.

**Focus**

- A unary call has one terminal state per side. A streaming direction closes independently, so one side can finish sending while still receiving.
- Textual JSON carries field names in every message. Binary schema encodings omit names and rely on shared field numbers or positional schemas, which is where the byte savings come from.
- Services expose only predetermined inputs and outputs, unlike databases with ad hoc queries. The IDL plus the framework owns routing, metrics and auth plumbing, not the business handler.
- Rolling upgrades mean old and new clients and servers coexist. The encoding decision is also a compatibility decision, finished in the next unit.

**Reproduce:** Without notes, draw the unary state machine and each direction of a bidirectional stream, then explain the DDIA byte counts: JSON 81 bytes, binary JSON 66 bytes and Protocol Buffers 33 bytes for the same record, and why the schema lets the binary form drop field names.

**Traps**

- Calling a streaming RPC a single request and response. Each direction has its own open, half-closed and closed states and they change independently.
- Reading compactness as the whole argument for binary encodings. The schema is also documentation and a compatibility contract; size is only one term.
- Assuming field numbers are free metadata. On the wire the number identifies the field, so changing or reusing one changes the meaning of stored bytes.

**Practice**

- [Building Distributed Systems: HE-3 echo service and RP-1 sync RPC with timeout](https://builddistributedsystem.com/tracks/messenger/tasks/task-1-3-echo-service) - HE-3 echo service at /tracks/messenger/tasks/task-1-3-echo-service, then RP-1 sync RPC with timeout at /tracks/messenger/tasks/task-1-2-1-sync-rpc. Tasks are graded in the browser after login, so treat a pass as a drill and keep your local request-response exchange with structured errors as the evidence.

**Stop when:** You can draw both state machines from memory, explain the three DDIA byte counts, and your local unary exchange returns a structured error for unknown methods and malformed payloads.

<details>
<summary>Self-test</summary>

1. A client finishes sending on a bidirectional stream but keeps receiving. Which states changed?
   - Only the client-to-server direction moved to half-closed. The server-to-client direction stays open until the server finishes, and cancellation can still end both.
2. Why is the Protocol Buffers encoding of the DDIA example 33 bytes while JSON needs 81?
   - JSON repeats field names and punctuation in every message. Protocol Buffers replaces each name with a numeric field tag from the shared schema and adds compact type and length bytes, so names never travel with the data.
3. Why do field numbers 1 to 15 cost one byte while higher numbers cost more?
   - The number is encoded on the wire with the type tag. Small numbers fit the short varint form, so frequently set fields should take numbers 1 to 15.
4. Two versions of a service run at once during a rollout. Why must the encoding be compatible across versions?
   - Old clients talk to new servers and new clients talk to old servers until the rollout finishes. An incompatible change corrupts or drops fields on those mixed paths.

</details>

#### U2. Schema fields, defaults, unknown-field preservation and wire compatibility

**About 4 h** · **Target:** Explain + Implement

Topics: Schema fields, defaults and unknown-field preservation; Backward and forward wire compatibility

Rollouts mix old and new binaries for days. A field added carelessly becomes data loss or a privacy leak on the mixed paths.

**You can now**

- Explain proto3 defaults, field-number rules and unknown-field retention, and Avro reader-writer resolution.
- Build a four-version compatibility table and wire fixtures that prove each claim.
- State which changes are safe, which need rollout order, and which are never safe.

**Study**

1. [DDIA 2e Chapter 5: Avro, Protobuf and schema merits](https://dataintensive.net/) (DDIA 2e - Chapter 5 Encoding and Evolution) - Chapter 5, Protocol Buffers (pp. 169-172) with Figure 5-3, Avro (pp. 172-177) with Figures 5-4 to 5-6 on writer and reader schemas, and The Merits of Schemas (p. 177).
2. [Proto3 updating rules and unknown fields](https://protobuf.dev/programming-guides/proto3/) (Protocol Buffers and Avro - Unknown Fields and Schema Resolution) - Updating A Message Type: wire-safe additions, reserved numbers and names, never reuse a number; Unknown Fields: binary parse preserves unknown fields but JSON and text-format round trips lose them.
3. [Avro 1.12.0 schema resolution](https://avro.apache.org/docs/1.12.0/specification/) (Protocol Buffers and Avro - Unknown Fields and Schema Resolution) - Schema Resolution: readers ignore writer-only fields, fill reader-only fields from defaults, int promotes to long, float and double, string to bytes and back; aliases map renamed names.

**Focus**

- The Systems unit on RPC schemas, versions, errors and trace context taught field identity and proto3 presence. Here the new work is what survives a hop between versions: unknown fields, Avro resolution and the four-version fixtures.
- Reserving a deleted number and name is the change, not tidying. Reuse makes old bytes decode under a new meaning.
- Avro carries no field identifiers on the wire, so reader and writer schemas resolve by name and defaults. Protobuf carries tags, so unknown fields can survive a binary proxy hop.
- JSON and text-format conversions are lossy hops for unknown fields even when binary hops preserve them.

**Reproduce:** From a blank file, write a four-version table for one record (add optional field, delete a field with reservation, rename with alias, widen int to long) and produce binary fixtures showing old reads new and new reads old for each row.

**Traps**

- Treating a default value as proof the sender set the field. An absent field also reads as the default, so defaults cannot carry I was explicitly cleared.
- Renumbering fields for neatness. Renumbering deletes and re-adds every field involved and breaks stored data.
- Proxying unknown fields through JSON for debugging and assuming they survive. Binary parsing and serialization and message-level copies such as `CopyFrom` and `MergeFrom` keep them; JSON output and field-by-field copies drop them.

**Practice**

- [Building Distributed Systems: TH-1 typed schema](https://builddistributedsystem.com/tracks/messenger/tasks/task-1-3-1-typed-schema) - TH-1 typed schema: wrap raw messages in validated classes with explicit fields and serialization methods. Tasks are graded in the browser after login, so treat a pass as a drill and keep your four-version binary fixtures and compatibility table as the evidence.

**Stop when:** Your table predicts all four version crossings correctly and your fixtures show unknown-field survival on binary paths and loss on JSON paths.

<details>
<summary>Self-test</summary>

1. An old binary reads new data with one added field. What happens in Protobuf and in Avro?
   - Protobuf keeps the extra field as unknown bytes and ignores it on read, preserving it on binary reserialization. Avro ignores the writer-only field during resolution, but only if the reader has the writer's schema to resolve against.
2. A field is deleted and its number reused for a new string field. What breaks?
   - Old bytes for that number are decoded under the new definition. The proto3 guide lists the outcomes: a parse error at best, otherwise leaked personal data or silent corruption. Reserve the number and the name instead.
3. When is widening int to long safe in Avro, and what is the rollout condition?
   - A reader whose schema says `long` can read data written as `int`, because int promotes to long. The reverse does not resolve: a reader still on `int` fails on data written with a `long` schema, whatever the values. So deploy the `long` reader schema everywhere first, then switch writers.
4. Why does `optional` matter for a boolean that switches behavior when false?
   - Without presence, unset and explicitly false both read as false, so a default rollout silently enables the behavior. Presence separates the two states.

</details>

#### U3. Length-prefixed and delimited framing, partial reads and writes and coalesced messages

**About 4 h** · **Target:** Implement

Topics: Length-prefixed and delimiter-based framing; Partial reads, partial writes and coalesced messages

TCP delivers a byte stream, not messages. Without framing, one send can arrive as two reads or three sends as one read, and the parser reads across message boundaries.

**You can now**

- Implement a length-prefixed framer that reassembles split messages and splits coalesced buffers.
- Explain why one `send` is not one message on a byte stream and where delimiter framing needs escaping.
- Test partial, split-delimiter and coalesced cases with fixed byte fixtures.

**Study**

1. [Beej sections on send, recv and partial sends](https://beej.us/guide/bgnet/) (Beej's Guide to Network Programming) - Section 5.7 send and recv: short sends and `recv` returning 0 on peer close; Section 7.4 Handling Partial send: the `sendall` loop that repeats until all bytes leave; Section 7.6 Son of Data Encapsulation: a length header on each packet so the receiver can find where one message ends.
2. [Avro 1.12.0 message framing](https://avro.apache.org/docs/1.12.0/specification/) (Protocol Buffers and Avro - Unknown Fields and Schema Resolution) - Message Framing: a message is a list of buffers, each a four-byte big-endian length plus bytes, terminated by a zero-length buffer; framing lets large binary objects travel as their own buffers and be copied fewer times.
3. [DDIA 2e Chapter 5: length prefixes in encodings](https://dataintensive.net/) (DDIA 2e - Chapter 5 Encoding and Evolution) - Chapter 5, JSON, XML, and Binary Variants (pp. 165-169): in the MessagePack walk-through on p. 169, a string preceded by its length needs no end marker or escaping.

**Focus**

- A length prefix states the frame size up front, so the receiver buffers exactly that many bytes. A delimiter scans for a terminator, so payload bytes need escaping and a split delimiter needs a carried-over buffer.
- `send` may move fewer bytes than requested and `recv` may return any positive amount up to the buffer size. Loops on both sides, not larger buffers, fix this.
- Coalescing is normal, not a bug: Nagle's algorithm on the sender and buffering in the receiver's kernel join sends. The framer must emit zero, one or several messages per read.
- The Systems unit on sockets, partial reads and writes, and message framing taught the socket calls. Here the new work is the framed parser and its fault fixtures.

**Reproduce:** From a blank file, implement a four-byte big-endian length-prefixed framer with a 1 MiB cap, then feed it a split header, a body in two chunks and two messages in one read, then feed a line-delimited variant a `\r\n` split across reads, and emit exactly the right messages.

**Traps**

- Treating `recv` returning 0 as an empty message. It means the peer closed; a zero-length frame is a separate protocol event such as the Avro terminator.
- Growing the receive buffer to avoid partial reads. The stream can split anywhere, so any read size still needs the reassembly loop.
- Scanning for a delimiter without unescaping. Payload bytes that match the terminator split one message into two corrupt ones.

**Practice**

- The section mini-project covers this: versioned length-prefixed framing with split, coalesced and split-delimiter fixtures in the deterministic harness.

**Stop when:** Your framer passes split-header, split-body, coalesced-pair and split-delimiter fixtures with no leftover bytes and no cross-boundary reads.

<details>
<summary>Self-test</summary>

1. One `send` of 5 bytes arrives as 2 then 3 bytes. What does a correct receiver do?
   - Buffer both chunks against the length prefix and emit the message only when all 5 payload bytes arrive. Partial reads are expected on a stream.
2. Two 5-byte messages arrive in one `recv` of 18 bytes including prefixes. How many messages emerge?
   - Two, with no leftover. The framer consumes two length-plus-payload frames from the 18 bytes: `00000005` plus 5 bytes, twice.
3. Why does a length prefix avoid the escaping problem of delimiter framing?
   - The prefix gives the exact byte count, so payload bytes are never scanned for a terminator. Delimited framing must escape or forbid the terminator inside payloads.
4. A line-delimited parser splits inside `\r\n`. What state must survive across reads?
   - The trailing `\r` and the unfinished line buffer. The next read may start with `\n`, and only the pair terminates the frame.

</details>

#### U4. Message size, allocation and decompression limits, and checksum boundaries

**About 3 h** · **Target:** Implement

Topics: Message size, allocation and decompression limits; Checksums and corruption detection boundaries

One uncapped length field lets a peer force a huge allocation. One unchecked hop lets a bit flip become a wrong applied effect.

**You can now**

- Enforce frame, allocation and decompression caps that reject oversized input before allocating.
- Compute and verify checksums over defined byte ranges and state what each check cannot catch.
- Distinguish accidental-corruption detection from identity and authenticity guarantees.

**Study**

1. [AlgoMaster checksums lesson](https://algomaster.io/learn/system-design/checksums) (AlgoMaster System Design - Selected Networking and API Problems) - Sections 1 to 4 and 7: what a checksum can and cannot tell you; parity, additive checksums, CRC, cryptographic hashes, HMACs and signatures; end-to-end integrity.
2. [Avro schema fingerprints and block checksums](https://avro.apache.org/docs/1.12.0/specification/) (Protocol Buffers and Avro - Unknown Fields and Schema Resolution) - Single-object encoding: marker `C3 01`, then the 8-byte little-endian CRC-64-AVRO fingerprint of the writer schema, which identifies the schema and does not check the payload; Object Container Files, Optional Codecs: each snappy block is followed by a 4-byte big-endian CRC32 of the uncompressed data.

**Focus**

- Check the length before allocating the body, and cap decompressed output independently of compressed input. A small compressed frame can expand by orders of magnitude.
- A checksum answers only whether these bytes match the expected bytes under this algorithm. It says nothing about who produced them or whether they are the latest.
- Cover the bytes that matter with the check you verify: header plus payload, or payload only, must be an explicit contract, and every hop must know which one it checks.
- Simple additive checksums such as the Internet checksum can miss reordered words and errors that cancel; CRCs catch burst errors and bit flips far better. Neither stops a deliberate change: that needs an HMAC or a signature.

**Reproduce:** From a blank file, implement the Internet checksum over 16-bit words with carry folding and complement, and verify `[0x4500, 0x003C, 0x1C46]` gives `40573` and `[0xFFFF, 0x0001]` folds through `0x10000` to `0xFFFE`. Then add a 1 MiB frame cap and a separate decompression cap to your framer.

**Traps**

- Allocating `length` bytes before validating `length`. Validate against the cap first, then allocate, then read the body.
- Using CRC where authenticity is needed. CRC catches accidental damage; it does not stop a forged message, which needs a keyed check.
- Checksumming the wrong range. A header-only check misses payload flips and a payload-only check misses a corrupted length; state the range in the contract.

**Practice**

- [Compute the Internet Checksum](https://algomaster.io/practice/system-design/compute-the-internet-checksum) - Implement `checksum(words)` with carry folding and complement; the judge checks the two worked cases including `40573`. The expected `40573` is correct, but the first example's explanation prints the sum as `0x617E` and its complement as `0x9E81` (`40577`); the words sum to `0x6182`, whose complement `0x9E7D` is `40573`. Then add frame and decompression caps with oversized and corrupt fixtures in your own harness.

**Stop when:** Your checksum matches both worked cases, your framer rejects an over-cap length before allocating and a corrupt payload on verify, and you can state the covered byte range.

<details>
<summary>Self-test</summary>

1. Why fold the carry instead of truncating the sum to 16 bits?
   - The Internet checksum uses ones-complement arithmetic, so overflow wraps around and is added back with carry folding before complementing, as the practice problem's `checksum` steps define.
2. A 10-byte compressed frame claims a 100 MiB body. Which cap fires and when?
   - The decompression cap fires during expansion, not the frame cap. The frame is small on the wire, so only a separate output cap stops the blowup, checked incrementally before the full output is held.
3. A CRC passes but the message is stale. Is the checksum wrong?
   - No. The CRC only proves the bytes are intact. Freshness needs an incarnation, version or timestamp checked by the application.
4. Where does the Avro single-object header put the schema fingerprint, and why?
   - After the `C3 01` marker as 8 bytes, before the object. Readers that store records written under several schemas need the fingerprint to pick the right writer schema for resolution.

</details>

#### U5. Request IDs, client incarnations and idempotency keys

**About 4 h** · **Target:** Explain + Implement

Topics: Request IDs and client incarnation identity; Idempotency keys and side-effect identity

Retries replay requests. Without a key that names the intent, a retried create becomes two resources and a restarted client replays someone else's effect.

**You can now**

- Explain why a message ID alone cannot separate a retry from a new intent after a client restarts.
- Implement first-write-wins execution keyed on caller plus idempotency key with parameter-mismatch rejection.
- State the retention bound on duplicate-suppression state and what happens after it expires.

**Study**

1. [AWS making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/) (AWS Builders' Library - Making Retries Safe with Idempotent APIs) - Caller-provided client request identifier pattern, validation error on same key with different parameters, semantically equivalent retry responses, identifier retained only for a bounded interval.
2. [MIT 6.5840 Lab 2 key/value server and lock](https://pdos.csail.mit.edu/6.824/labs/lab-kvsrv1.html) (MIT 6.5840 - RPC and Threads plus Lab 2 Key/Value Server) - Versioned `Put` with `ErrVersion` and `ErrNoKey`; lock built on `Put` and `Get` with per-client identity from `RandValue(8)`.

**Focus**

- Identity has three parts: which client incarnation sent it, which request of that incarnation, and which side effect the request intends. One UUID for all three conflates them.
- The server stores the key plus the request parameters plus the result. A repeat with the same key and same parameters returns the stored result; the same key with different parameters is a validation error, never a second execution.
- The Systems unit on deadlines, retries and idempotency across RPC built the durable key state machine with atomic transitions. Here the new work is identity across client restarts, parameter-mismatch rejection and the retention bound.
- Retention is bounded by policy such as resource lifetime plus an interval. After expiry, a late duplicate looks new, so callers must handle that window.

**Reproduce:** From a blank file, implement an `execute(key, proposed)` store with first-write-wins semantics, parameter-mismatch rejection and a TTL, and show a retried create returning the first result while a changed-parameter repeat raises a validation error.

**Traps**

- Hashing parameters to invent the key. Two identical creates may be two intents, and two different parameter sets may be one retried intent; only a caller-provided key expresses intent.
- Returning AlreadyExists on a retry and calling it idempotent. The side effect is single, but the caller cannot tell whose resource exists, so default retry loops break.
- Keeping keys forever to be safe. Unbounded state grows without limit and old keys can collide with future intents; bound the interval and document it.

**Practice**

- [Deduplicate Idempotent Requests](https://algomaster.io/practice/system-design/deduplicate-idempotent-requests) - Implement `execute(key, proposedResult)` first-write-wins; the judge replays keys with different proposed results. The judge holds keys for the test lifetime with no expiry. Add a TTL and a parameter-mismatch error in your own store and state what the judge does not establish.
- [Build an Idempotent Consumer](https://algomaster.io/practice/system-design/build-an-idempotent-consumer) - Implement `process(messageId)` returning true once then false on redelivery. Same harness shape. Extend it with caller-plus-key identity and a bounded retention test outside the judge.

**Stop when:** Your store replays the first result on identical retries, rejects changed parameters, expires keys on schedule, and you can name the atomicity boundary.

<details>
<summary>Self-test</summary>

1. A client sends create with key `a`, times out, and retries with key `a` and identical parameters. What must the server return?
   - The stored first result, semantically equivalent to the first response. No second resource is created.
2. The retry reuses key `a` but changes the instance type. What must the server do?
   - Reject with a validation error for parameter mismatch. The key names one intent, so changed parameters signal a different intent, not a retry.
3. Why is a per-message UUID without a client incarnation insufficient after a restart?
   - A client that numbers requests from 1 again after a restart collides with its old numbers, so the server suppresses a new request as a duplicate. A client that lost an unacknowledged request retries it under a fresh ID, so it runs twice. An incarnation number separates old numbering from new, and a key saved with the intent before the first send lets the retry reuse it.
4. Why must key recording and the mutation be one atomic step?
   - A crash between the two leaves either a recorded key with no effect, which wrongly replays as done, or an effect with no key, which wrongly executes twice.

</details>

#### U6. Ambiguous outcomes after timeout and monotonic deadline propagation

**About 3 h** · **Target:** Explain + Implement

Topics: Ambiguous outcomes after timeout or disconnect; Monotonic deadlines and budget propagation

A timeout reports the reply was late, not that the work did not happen. Systems that treat timeout as failure retry blindly and double-apply effects.

**You can now**

- Enumerate the four timeout windows: before receive, during execution, after side effect, during response.
- Explain why a timeout never proves the effect did not happen, and how `ErrMaybe` reports that.
- Propagate a monotonic deadline across hops by converting to remaining timeout at each hop.

**Study**

1. [MIT 6.5840 Lecture 2 RPC failure section](https://pdos.csail.mit.edu/6.824/notes/l-rpc.txt) (MIT 6.5840 - RPC and Threads plus Lab 2 Key/Value Server) - Remote Procedure Call, RPC problem: what to do about failures: client never sees a response and does not know if the server saw the request; best-effort retry and at-most-once discussion with `kv.go`.
2. [MIT 6.5840 Lab 2 unreliable network and ErrMaybe](https://pdos.csail.mit.edu/6.824/labs/lab-kvsrv1.html) (MIT 6.5840 - RPC and Threads plus Lab 2 Key/Value Server) - Key/value server with dropped messages: retry with `time.Sleep(100 * time.Millisecond)` until a reply arrives; return `ErrMaybe` on a retried `Put` that answers `ErrVersion`.
3. [gRPC deadlines guide](https://grpc.io/docs/guides/deadlines/) (gRPC Guides - Deadlines, Cancellation, Status Codes, Retry and Flow Control) - Overview and Deadlines on the Client and Server: always set a deadline, `DEADLINE_EXCEEDED` on the client, `CANCELLED` on the server; Deadline Propagation converts the point in time to a remaining timeout to avoid clock skew.

**Focus**

- Four windows, four different truths: dropped before receive means nothing ran, during execution means unknown progress, after side effect means done but unreported, during response means done with a lost reply. The client sees one event: no reply in time.
- `ErrMaybe` is the honest answer for a retried conditional write that meets a version mismatch. The first attempt may have applied and its success reply was lost, or another client may have moved the version first.
- The Systems units on cancellation, deadlines and shutdown state machines and on deadlines, retries and idempotency across RPC taught timer mechanics and remaining-time propagation. Here the new work is reporting ambiguity to the caller and testing each timeout window against an unreliable network.
- The server handler must check cancellation and stop spawned work. gRPC cancels the call, but it cannot interrupt application code that never checks.

**Reproduce:** Without notes, enumerate the four windows and the correct client conclusion for each, then implement a Clerk that retries until a reply arrives with a 100 ms pause and returns `ErrMaybe` exactly when a retried `Put` meets `ErrVersion`.

**Traps**

- Treating a timeout as a failed effect. A timeout proves only that no reply arrived before the timer; the effect may have completed.
- Returning `ErrVersion` for a retried write. On a first attempt it means not applied, but on a retry it is ambiguous, so the client must report maybe, not no.
- Propagating an absolute timestamp across machines. Clock skew shifts it; propagate the remaining budget computed on a monotonic clock at each hop.

**Practice**

- [MIT 6.5840 Lab 2: Key/Value server with dropped messages](https://pdos.csail.mit.edu/6.824/labs/lab-kvsrv1.html) - Implement `kvsrv1/client.go` retry loop and pass `TestUnreliableNet` plus the lock tests `TestOneClientUnreliable` and `TestManyClientsUnreliable`. Public tests for Spring 2026. Do not publish solutions. Then add a four-window fault log that records which window each injected timeout exercised.

**Stop when:** You can place any timeout in one of the four windows, your Clerk returns `ErrMaybe` exactly on ambiguous retries, and downstream calls always carry the remaining budget.

<details>
<summary>Self-test</summary>

1. A `Put` reply is lost and the retry gets `ErrVersion`. Did the first `Put` run?
   - Unknown. Either the first `Put` applied and its success reply was lost, or another client changed the version first. The Clerk must return `ErrMaybe`.
2. Why is a `Get` safe to retry but a conditional `Put` is not?
   - A `Get` changes no state, so duplicates are harmless. A conditional `Put` changes state once, and a blind retry can apply it twice or hide whose write won.
3. A client sets a 2 s deadline and the server spends 0.5 s before calling downstream. What timeout goes downstream?
   - At most the remaining 1.5 s, recomputed on the monotonic clock. The downstream budget is the original point in time minus elapsed time, never the full 2 s again.
4. The server notices cancellation but keeps computing to reply anyway. What breaks?
   - Wasted work and resource exhaustion under load, plus a reply the client already abandoned. The handler must stop and release, and propagate cancellation to its own downstream calls.

</details>

#### U7. Bounded retries, exponential backoff with jitter and duplicate-suppression state

**About 4 h** · **Target:** Derive + Implement

Topics: Bounded retries across dependency hops; Exponential backoff and randomized jitter; Duplicate suppression state and retention limits

Unbounded per-layer retries turn one slow dependency into hundreds of downstream requests. The bound, the backoff and the dedup store are one design, not three.

**You can now**

- Derive the worst-case request multiplier for retries at every layer of a call chain.
- Implement capped exponential backoff with jitter and a bounded retry budget including a token-bucket throttle.
- Size duplicate-suppression state and its retention from the retry envelope.

**Study**

1. [AWS timeouts, retries and backoff with jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/) (AWS Builders' Library - Timeouts, Retries and Backoff with Jitter) - Retries and backoff: three tries at each of five layers give 243x load, retry at a single point in the stack; token-bucket retry throttle; Jitter: spread periodic and retry timers.
2. [gRPC retry guide](https://grpc.io/docs/guides/retry/) (gRPC Guides - Deadlines, Cancellation, Status Codes, Retry and Flow Control) - Retry configuration: enabled by default with no default policy, no retry once response headers arrive; example `maxAttempts` 4 with `initialBackoff` 0.1s, `maxBackoff` 1s, multiplier 2 and jitter plus or minus 20 percent; `retryThrottling` with `maxTokens` and `tokenRatio`.

**Focus**

- The Systems unit on deadlines, retries and idempotency across RPC derived layered amplification: with $`r`$ tries at each of $`L`$ layers the bottom sees $`r^L`$, so three tries at five layers is $`3^5 = 243`$. Here the new work is the jittered schedule, the token throttle and the size of the dedup store.
- Backoff without jitter still thunders. Independent uniform jitter spreads the retry front so one recovery does not become the next overload spike.
- The throttle is a separate bound from the attempt count: per server, failures consume tokens and successes refund a fraction, and retries pause when tokens fall below half.
- Dedup retention must cover the maximum retry age plus clock and queue delay. A retry older than the store looks new.

**Reproduce:** Closed-book, derive $`3^5 = 243`$ for three tries at five layers, then compute a capped backoff schedule with base 0.1 s, multiplier 2, cap 1.0 s and uniform jitter in $`[0.8, 1.2]`$ applied after the cap: with Python's `random.Random(7)` and one `uniform(0.8, 1.2)` draw per delay, the five delays in ms are 93.0, 172.1, 424.1, 663.2 and 1014.4.

**Traps**

- Retrying at every layer for safety. Each layer multiplies the one below, so bound retries at one layer and let the others fail fast with a clear error.
- Using fixed backoff under overload. Synchronized waiters return together and re-overload the dependency; jitter is the decorrelation, not a nicety.
- Sizing dedup by the happy path. Size by the worst-case retry age times the peak request rate, plus a margin for queues and clock skew.

**Practice**

- [Building Distributed Systems: RP-5 exponential backoff and TH-3 deduplication](https://builddistributedsystem.com/tracks/messenger/tasks/task-1-2-5-exponential-backoff) - RP-5 exponential backoff, then TH-3 deduplication with LRU cache at /tracks/messenger/tasks/task-1-3-3-deduplication. Tasks are graded in the browser after login, so treat a pass as a drill and keep your seeded backoff schedule plus bounded dedup store as the evidence.
- [Classify Retry Outcomes](https://algomaster.io/practice/system-design/classify-retry-outcomes) - Implement `classify(failures, maxRetries)` delivering versus dead-letter routing after the retry budget. The judge checks budget-exhaustion routing only. Add jitter and a token-bucket throttle in your own client and state what the judge does not establish.

**Stop when:** You derive 243 without notes, your seeded schedule matches to the millisecond, and your client pauses retries when tokens run dry while duplicates stay suppressed inside retention.

<details>
<summary>Self-test</summary>

1. Five layers each retry twice more on failure. What is the worst-case downstream multiplier?
   - $`3^5 = 243`$. Each layer triples the load it received, so the bottom sees 243 requests for one top-level call.
2. Why does gRPC refuse to retry after response headers arrive?
   - The call is committed: the server may have produced effects the client has seen. Replaying history after that point can double-apply.
3. With `maxTokens` 10 and `tokenRatio` 0.1, when do retries pause?
   - Each failure removes 1 token and each success adds 0.1. When the count falls below 5, half of the maximum, retries pause until successes refill it.
4. A retry arrives 70 minutes late but dedup retains 60 minutes. What happens?
   - It executes as a new request. Retention bounds the suppression promise, so the contract must name the 60-minute window and callers must handle late duplicates beyond it.

</details>

#### U8. Structured errors, cancellation propagation and streaming flow control

**About 4 h** · **Target:** Explain + Implement

Topics: Structured errors and retry classification; Cancellation propagation and cleanup; Streaming flow control and half-closed connections

A bare timeout string forces every caller to guess. Structured codes plus propagated cancellation turn a failure into an instruction the whole chain can follow.

**You can now**

- Classify errors into retryable, reject-and-fix and never-retry using status codes.
- Propagate cancellation across hops and release handler resources on cancel.
- Explain streaming flow control and the half-closed states that unary calls never show.

**Study**

1. [gRPC status codes](https://grpc.io/docs/guides/status-codes/) (gRPC Guides - Deadlines, Cancellation, Status Codes, Retry and Flow Control) - Full list: `DEADLINE_EXCEEDED` may return even when the operation completed; `UNAVAILABLE` is the transient retryable code; only user code generates `INVALID_ARGUMENT`, `NOT_FOUND`, `ALREADY_EXISTS`, `FAILED_PRECONDITION`, `ABORTED`, `OUT_OF_RANGE` and `DATA_LOSS`.
2. [gRPC cancellation guide](https://grpc.io/docs/guides/cancellation/) (gRPC Guides - Deadlines, Cancellation, Status Codes, Retry and Flow Control) - Deadline expiry and I/O errors trigger cancel; server handlers must poll and stop; outgoing calls auto-cancel in Java, Go and C++ but not Python.
3. [gRPC flow control guide](https://grpc.io/docs/guides/flow-control/) (gRPC Guides - Deadlines, Cancellation, Status Codes, Retry and Flow Control) - Streaming only with framework-managed window; writes wait when the receiver is full; synchronous two-sided bulk writes without reads can deadlock.

**Focus**

- Codes are a contract: `UNAVAILABLE` invites a bounded retry, `FAILED_PRECONDITION` demands a state fix first, `INVALID_ARGUMENT` forbids retrying the same bytes.
- `DEADLINE_EXCEEDED` after a mutation is ambiguous by definition. The code reports lateness, not non-execution, so pair it with an idempotency key.
- Cancellation is cooperative. The library delivers the signal, but a handler that never checks keeps burning CPU and holding locks after the client left.
- Flow control applies to streams, not unary calls. Writes block until the receiver frees window, which is why two sides doing bulk synchronous writes without reads deadlock.

**Reproduce:** Without notes, map five failures (overloaded dependency, bad argument, missing entity, expired deadline after a write, aborted transaction) to codes and retry decisions, then implement a handler that checks cancellation each work chunk and propagates cancel to its downstream call.

**Traps**

- Retrying `INVALID_ARGUMENT` on a timer. The request is bad regardless of system state, so retries only add load; fix the bytes first.
- Assuming cancel kills the handler. The RPC library cannot interrupt application code, so a long loop without checks runs to completion anyway.
- Applying streaming flow-control reasoning to unary calls. Unary calls have no window to manage; their failure modes are deadlines, caps and errors.

**Practice**

- [Building Distributed Systems: RP-3 async callbacks and RP-4 callback reaper](https://builddistributedsystem.com/tracks/messenger/tasks/task-1-2-3-async-rpc) - RP-3 async RPC callbacks, then RP-4 callback reaper at /tracks/messenger/tasks/task-1-2-4-callback-reaper for leaked-call cleanup. Tasks are graded in the browser after login, so treat a pass as a drill and keep your code-mapped errors plus cancellation-propagating handlers as the evidence.

**Stop when:** Your error map routes each code to retry, fix-first or never-retry, and your streaming handler stops within one work chunk of cancellation while propagating it downstream.

<details>
<summary>Self-test</summary>

1. A call fails with `UNAVAILABLE`, then with `FAILED_PRECONDITION`. Which one retries?
   - Only `UNAVAILABLE`, with backoff and a budget. `FAILED_PRECONDITION` needs an explicit state fix such as emptying the directory before any retry.
2. A write returns `DEADLINE_EXCEEDED`. May the client assume it did not apply?
   - No. The guide states this error may return even when the operation completed, for example when the success reply arrived after the timer. Reconcile by key.
3. A Python server spawns a downstream RPC and the client cancels. What must the handler do?
   - Poll the serving context for cancellation, stop work, clean up, and cancel the downstream call explicitly, since Python does not auto-cancel outgoing calls.
4. Client and server both use synchronous reads, and each writes a large burst of stream messages before reading any. What happens?
   - Both block in flow control once windows fill, and neither drains, so they deadlock. At least one side must interleave reads, or use async handlers.

</details>

#### U9. Authentication, authorization, service discovery and gRPC interceptors

**About 4 h** · **Target:** Explain + Implement

Topics: Authentication before application dispatch; Authorization and identity propagation; Service discovery and endpoint generation changes; Production gRPC interceptors and reflection

An RPC that reaches business logic unauthenticated has already failed. Identity, discovery and cross-cutting policy belong in the path before dispatch, not inside each handler.

**You can now**

- Explain channel versus call credentials and why auth runs before application dispatch.
- Propagate caller identity through metadata and enforce per-method authorization in an interceptor.
- Explain discovery staleness and generation changes, and where interceptors stop being the right tool.

**Study**

1. [gRPC authentication guide](https://grpc.io/docs/guides/auth/) (gRPC Guides - Deadlines, Cancellation, Status Codes, Retry and Flow Control) - Supported mechanisms and Credential types: channel credentials such as `SslCredentials` versus call credentials, composite credentials sending a token per call, server-side token verification in an interceptor.
2. [gRPC interceptors guide](https://grpc.io/docs/guides/interceptors/) (gRPC Guides - Deadlines, Cancellation, Status Codes, Retry and Flow Control) - When to Use Interceptors: metadata, logging, fault injection, caching, metrics, policy, server-side auth and authz; client versus server interceptors and order effects.
3. [HLD service discovery and API design](https://github.com/handbook-academy/engineering-handbook/blob/d177ae2b48b4dfebf8ad0ddae51a345b3e17d99e/content/hld/part-2-building-blocks/12-service-discovery-mesh.md) (HLD Handbook - Networking, API Design and Backpressure) - Service Discovery and Service Mesh: DNS with TTL, registry, Kubernetes endpoints, sidecars; plus the API Design Basics chapter for auth, versioning and idempotency-key placement.

**Focus**

- Authenticate the channel, authorize the call. Mutual TLS proves which workload dialed (plain TLS proves only the server), while per-call tokens plus a server interceptor decide which methods that caller may invoke.
- Identity travels in metadata, and the interceptor is the enforcement point. Handlers behind it assume a verified caller and never re-parse tokens.
- Discovery data is stale by design: TTLs, caches and propagation delays mean the client routes on a recent generation, so servers must reject misrouted requests with an explicit error.
- The Systems unit on identity, authorization, least privilege and secrets taught the credential mechanics. Here the new work is the RPC path: credentials to metadata to interceptor to handler.

**Reproduce:** From a blank file, add a server interceptor that verifies a bearer token, attaches the caller ID to the call context, rejects one unauthorized method with `PERMISSION_DENIED`, and logs the decision; then show a stale-endpoint retry against a bumped generation.

**Traps**

- Checking auth inside each handler. Handlers drift, so one forgotten method stays open; enforce once in the interceptor before dispatch.
- Sending call credentials on an insecure channel. Most implementations refuse, and tokens on plaintext are stealable; compose call credentials over TLS channel credentials.
- Treating discovery as exact. Endpoints change under you, so clients must handle wrong-generation redirects and servers must validate ownership on arrival.

**Practice**

- The section mini-project covers this: token-issuing test client, auth interceptor before dispatch, per-method policy table, and stale-discovery generation faults.

**Stop when:** Unauthenticated calls never reach handlers, one policy test denies the right method, and a stale endpoint produces a versioned redirect rather than a silent wrong write.

<details>
<summary>Self-test</summary>

1. Where should token verification live, and why not in each handler?
   - In a server interceptor before dispatch. One path verifies, propagates identity and enforces policy, so handlers cannot forget or disagree.
2. A client uses TLS but no call credentials. What is proven and what is missing?
   - The server identity and channel privacy are proven. Caller identity and per-method permission are missing, so the server must deny protected methods with `UNAUTHENTICATED` or `PERMISSION_DENIED`.
3. Discovery says the shard moved but the client still dials the old owner. What should happen?
   - The old owner rejects with a versioned wrong-target error naming the new generation. The client refreshes discovery and retries once against the new owner.
4. What can interceptors not do?
   - Manage connections, ports or TLS setup. They run per call between application and network, so transport configuration stays outside them.

</details>

#### U10. Connection pools, load balancing, health and HTTP/3 transport behavior

**About 4 h** · **Target:** Explain + Measure

Topics: Connection lifecycle, pooling and pool exhaustion; Load balancing, health and affinity semantics; HTTP/3 and QUIC transport behavior

Pools and balancers decide which server pays for each call. An exhausted pool or a naive balancer turns one slow replica into a system-wide stall.

**You can now**

- Explain pool sizing, checkout timeouts and exhaustion signals, and graceful drain on shutdown.
- Contrast layer-4 versus layer-7 balancing, health checking and the cost of affinity.
- Explain QUIC streams, migration and HTTP/3 mapping at review depth without implementing them.

**Study**

1. [HLD load balancers and networking fundamentals](https://github.com/handbook-academy/engineering-handbook/blob/d177ae2b48b4dfebf8ad0ddae51a345b3e17d99e/content/hld/part-2-building-blocks/00-load-balancers.md) (HLD Handbook - Networking, API Design and Backpressure) - Load Balancers: layer-4 5-tuple versus layer-7 routing, health checks and affinity; plus the Networking Fundamentals chapter for TCP versus UDP and HTTP/1.1 through HTTP/3 head-of-line blocking.
2. [gRPC keepalive guide](https://grpc.io/docs/guides/keepalive/) (gRPC Guides - Deadlines, Cancellation, Status Codes, Retry and Flow Control) - Overview and configuration table: HTTP/2 PING keepalives, client default disabled, server default 2 hours, 20 s timeout, `too_many_pings` GOAWAY on abuse; clients should not set keepalive much below one minute and must agree settings with the service owner.
3. [RFC 9000 QUIC transport behavior](https://www.rfc-editor.org/rfc/rfc9000.html) (RFC 9000 - QUIC Version 1) - Section 2 Streams with independent stream states, Section 4 Flow Control per stream and connection, Section 9 Connection Migration; HTTP/3 mapping in RFC 9114 Sections 3, 6 and 7. Depth: Review only for the optional QUIC topic. Read the cited sections and compare with TCP head-of-line blocking; do not implement QUIC.

**Focus**

- The Systems unit on connection shutdown, pools and latency decomposition sized pools with Little's law. Here the new work is the caller's side under failure: checkout timeouts and exhaustion as a fast explicit error, never an unbounded wait, plus health gating and the balancer's choice.
- Layer-4 balancers forward bytes by 5-tuple; layer-7 balancers parse requests and can route, shed and retry per call. Affinity buys cache warmth and pays with hot replicas.
- Health checking is about the service, keepalive about the connection. A live TCP connection to a sick service still needs a health-gated balancer decision.
- QUIC runs over UDP and does its own loss recovery, usually in a user-space library: independent streams avoid TCP head-of-line blocking, and connection IDs survive address changes via migration.

**Reproduce:** Without notes, contrast L4 versus L7 decisions on one example each, state the keepalive defaults and abuse signal, and explain why one lost TCP packet stalls all HTTP/2 streams while QUIC stalls only the affected stream.

**Traps**

- Sizing pools by server count. Size by arrival rate times hold time plus headroom, with checkout timeouts; an infinite wait on checkout is a distributed deadlock.
- Reading affinity as load balancing. Sticky routing concentrates load and failure, so use it only where cache or state locality pays, with a rebalance path.
- Enabling aggressive keepalive unilaterally. The server treats ping floods as abuse and sends `too_many_pings` GOAWAY; coordinate intervals with owners.

**Practice**

- [Building Distributed Systems: TC-2 pool and TC-3 drain](https://builddistributedsystem.com/tracks/networker) - TC-2 connection pool with backlog, TC-3 graceful shutdown with in-flight drain; both are in the free first three Networker tasks. Tasks are graded in the browser after login, so treat a pass as a drill and keep your pool-exhaustion and drain-timing measurements as the evidence.
- [Design a Least Requests Load Balancer](https://algomaster.io/practice/system-design/design-a-least-requests-load-balancer) - Implement `acquire` least-loaded with smallest-index tie-break and `release` floored at zero. The judge checks routing logic only. Add health gating and an affinity-cost comparison in your own harness.

**Stop when:** You can size a pool from arrival rate and hold time, predict the balancer move for one failure, and state the QUIC stream and migration differences without claiming production QUIC operation.

<details>
<summary>Self-test</summary>

1. Checkout waits grow while server latency is flat. What is exhausted?
   - The client pool, not the server. All connections are checked out, so new calls queue at checkout; surface a fast error and fix sizing or downstream fan-out.
2. Why is a health check not redundant with TCP keepalive?
   - Keepalive proves the connection is alive. Health proves the service behind it can serve; a hung handler on a live connection needs health gating to drain.
3. What do the gRPC keepalive defaults say about who pays?
   - Clients default to disabled and servers to 2-hour intervals with 20 s timeouts. Frequent client pings cost the server, so they need explicit agreement.
4. A client changes Wi-Fi networks mid-download. Why does QUIC survive where TCP restarts?
   - QUIC identifies the connection by ID, not by address tuple, and Section 9 migration revalidates the new path. TCP binds to the tuple, so the new address is a new connection.

</details>

#### U11. Bounded queues, end-to-end backpressure, overload rejection and retry amplification

**About 4 h** · **Target:** Derive + Measure

Topics: Bounded queues and end-to-end backpressure; Overload rejection and retry amplification

An unbounded queue turns overload into unbounded latency and then collapse. Explicit rejection plus a bounded retry budget keeps one slow hop from sinking the stack.

**You can now**

- Derive queue bounds from latency objectives and explain end-to-end versus hop-local backpressure.
- Implement bounded queues with explicit rejection codes and a retry budget that pauses under throttle.
- Measure amplification under overload and compare two shedding policies on one workload.

**Study**

1. [AWS retries: amplification and token-bucket throttle](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/) (AWS Builders' Library - Timeouts, Retries and Backoff with Jitter) - Retries and backoff: the 243x five-layer example, retry at one layer, token-bucket local retry limit; Timeouts: pick from downstream latency percentiles such as p99.9 for a 0.1 percent false-timeout rate.
2. [HLD resilience and rate limiting](https://github.com/handbook-academy/engineering-handbook/blob/d177ae2b48b4dfebf8ad0ddae51a345b3e17d99e/content/hld/part-6-reliability-and-operations/02-resilience-patterns.md) (HLD Handbook - Networking, API Design and Backpressure) - Resilience Patterns: timeouts, retries with backoff and jitter, breakers, bulkheads and the DynamoDB 2015 retry-storm case as a reported example; plus the Rate Limiting chapter for token, leaky, fixed and sliding windows with `429` plus `Retry-After`.

**Focus**

- Bound every queue and name what happens at the bound: drop newest, drop oldest, or reject with `RESOURCE_EXHAUSTED`. An unnamed bound is an unbounded queue with extra steps.
- Hop-local backpressure protects one process; end-to-end backpressure protects the chain. Retry budgets and throttles are the end-to-end half, and they must pause together.
- Rejection is a feature with a code. gRPC `RESOURCE_EXHAUSTED`, or HTTP `429` with `Retry-After`, lets callers back off; silent queueing lets them time out and retry blindly, which amplifies.
- The Systems units on bounded queues, admission and backpressure and on retry budgets, circuit breaking and load shedding taught the primitives. Here the new work is the RPC-wide budget and the measured comparison.

**Reproduce:** Closed-book, derive $`3^5 = 243`$ and the token-pause rule, then run one workload at two overload levels and report offered versus admitted versus rejected versus retried counts with p50 and p99 for each policy.

**Traps**

- Adding capacity to fix a retry storm. Correlated retries saturate the dependency faster than capacity arrives; pause retries first, then scale.
- Breaking the circuit and calling it fixed. Breakers add modal behavior and slow recovery; prefer bounded budgets and throttles with measured half-open probing.
- Returning `UNAVAILABLE` for every overload. Distinguish retryable transient from shed load with `RESOURCE_EXHAUSTED`, so callers do not retry what you just refused to do.

**Practice**

- [Design a Sliding Window Log Rate Limiter](https://algomaster.io/practice/system-design/design-a-sliding-window-log-rate-limiter) - Implement exact sliding-window admission over request timestamps. The judge checks admission logic only. Pair it with the token-bucket problem below and measure both under one bursty workload with rejection counts.
- [Design a Token Bucket Rate Limiter](https://algomaster.io/practice/system-design/design-a-token-bucket-rate-limiter) - Implement refill plus burst admission and compare with the sliding-window policy on the same trace. Report admitted, rejected and retried counts with p50 and p99 on your machine, labeled as one example, not a target.

**Stop when:** Your bounded queue rejects with codes at the bound, retries pause under throttle, and your two-policy comparison names which overload region each policy wins.

<details>
<summary>Self-test</summary>

1. Offered load doubles past saturation with an unbounded queue. What do latency and retries do?
   - Queueing delay grows without bound, timeouts fire, callers retry, and retries add load past saturation. Latency diverges and goodput falls; a bound plus rejection stops this loop.
2. Why retry at one layer instead of every layer?
   - Per-layer retries multiply to $`r^L`$ downstream. One bounded retry point with fail-fast errors elsewhere caps amplification while preserving availability on transient faults.
3. When does the gRPC-style token throttle pause retries?
   - When the per-server token count falls below half of `maxTokens`. Failures decrement by 1 and successes refund `tokenRatio`, so sustained failure pauses retries automatically.
4. A dependency reports p99.9 at 800 ms. Where do you set the timeout and why?
   - Start at the p99.9, 800 ms, which accepts about 0.1 percent false timeouts, then pad for network variance; the HLD chapter's example pads it to 2,000 ms. Too low creates false timeouts and retry storms; too high stops protecting threads and ports. Check the choice with a load test on your machine.

</details>

#### U12. Trace correlation without synchronized clocks and a deterministic faulty network

**About 4 h** · **Target:** Implement

Topics: Trace correlation without synchronized clocks; Deterministic delay, loss, duplication and reordering

Clocks lie across machines, but IDs do not. A deterministic faulty network turns he-said-she-said debugging into a replayable history with a seed.

**You can now**

- Correlate a request across client and server logs using trace and span IDs without comparing timestamps.
- Implement a seeded faulty network with delay, drop, duplicate, reorder, disconnect, corrupt, restart and cancel injection.
- Retain seeds and raw histories so any failure replays exactly.

**Study**

1. [W3C traceparent, tracestate and processing model](https://www.w3.org/TR/trace-context/) (W3C Trace Context) - Section 3.2 traceparent: version, 16-byte trace id, 8-byte parent id and flags with sampled bit; Section 3.3 tracestate vendor pairs; Section 4 processing model for forwarding versus participating.
2. [DSLabs Lab 1 exactly-once RPC](https://github.com/emichael/dslabs/tree/49c4a1f9ed59547501376dd3ccfcdd9c1eb7b427/labs/lab1-clientserver) (DSLabs - Lab 1 Exactly-Once RPC) - README Parts 2 and 3: at-least-once with sequence numbers then exactly-once shim; Resend/Discard versus Tick timer patterns; search tests that print minimal violating traces.

**Focus**

- Correlate by identifiers, order by causality. A `traceparent` like `00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01` links the hops; timestamp comparison across machines proves nothing about order.
- The Systems unit on RPC schemas, versions, errors and trace context taught `traceparent` parsing and the legal forwarding mutations. Here the new work is joining several processes' logs by those IDs, and the rule that the headers never carry sensitive data.
- The network model is a seeded program: per-message delay, drop, duplicate, reorder and corrupt actions plus partition, restart and cancel, all from one retained seed.
- The Systems unit on deterministic network fault injection taught the harness shape. Here the new work is the RPC envelope logging plus the seeded schedule that the rollout matrix will reuse.

**Reproduce:** From a blank file, propagate one trace through two hops with new parent ids and a left-added `tracestate` entry, then replay seed 7 through your faulty network and show the same drop, duplicate and reorder positions twice from the retained log.

**Traps**

- Sorting cross-machine logs by timestamp to find causality. Skew and jumps reorder them; join on trace id and parent id and infer order from send and receive pairs.
- Using `random` without a seed for faults. An unseeded run cannot replay, so the failure is anecdote; retain the seed and the raw history with every run.
- Resetting sequence numbers or timers carelessly. DSLabs search tests require finite, sequential numbering to exhaust the state space; ad hoc numbering explodes it.

**Practice**

- [Building Distributed Systems: TH-2 envelope logger and TH-5 chaos mode](https://builddistributedsystem.com/tracks/messenger/tasks/task-1-3-2-envelope-logger) - TH-2 envelope logger with timestamps, then TH-5 chaos mode with random drops at /tracks/messenger/tasks/task-1-3-5-chaos-mode. Tasks are graded in the browser after login, so treat a pass as a drill and keep your seeded harness with retained histories as the evidence.

**Stop when:** One trace reconstructs across two processes by ID alone, and two runs of the same seed produce byte-identical fault histories.

<details>
<summary>Self-test</summary>

1. Two logs show the server receiving before the client sent, by timestamps. What do you trust?
   - The IDs, not the timestamps. Join on trace id and parent id; the send precedes the receive by causality, and the clock comparison is skew.
2. What must change in `traceparent` at each hop, and what must not?
   - Set a new parent id for the outgoing call, and change the sampled flag only if your sampling decision changed. Keep the trace id unless you deliberately restart the trace, which splits it.
3. A fault run fails once in ten tries. What do you keep to make it deterministic?
   - The seed, the code version, the schedule of faults, and the raw message history. Rerun the same seed to replay the same orderings.
4. When should a proxy modify `tracestate` order?
   - Modified keys move to the left; unmodified pairs keep order. Deleting unknown keys breaks other vendors, so only remove for documented privacy or size reasons.

</details>

#### U13. Versioned framed RPC, a mixed-version test matrix and the rollout contract

**About 5 h** · **Target:** Implement + Measure

Topics: Versioned framed RPC implementation; Mixed-version client and server test matrix; Protocol rollout, rollback and deprecation contract

This is the DS-1 exit gate in code. Everything before it was a part; this unit proves the parts survive each other and a rollout.

**You can now**

- Implement a versioned framed RPC with caps, checks, identities, deadlines and structured errors.
- Pass a mixed-version matrix covering partial I/O, corrupt frames, ambiguity, duplicates, cancel, overload, restart and rollback.
- State the rollout and rollback contract: what may repeat, what never repeats, and how callers detect ambiguity.

**Study**

1. [DDIA 2e Chapter 5 rollout and evolution](https://dataintensive.net/) (DDIA 2e - Chapter 5 Encoding and Evolution) - Chapter 5, Dataflow Through Services (pp. 180-186) for rolling upgrades with mixed versions, and Avro and Protobuf sections (pp. 169-177) for the compatibility rules the matrix checks.
2. [MIT 6.5840 Lab 2 as the mixed-version harness model](https://pdos.csail.mit.edu/6.824/labs/lab-kvsrv1.html) (MIT 6.5840 - RPC and Threads plus Lab 2 Key/Value Server) - Versioned `Put` with `ErrVersion`, `ErrNoKey` and `ErrMaybe` plus lock tests; Spring 2026 suite `TestReliablePut`, `TestUnreliableNet`, `TestOneClientUnreliable`, `TestManyClientsUnreliable`.
3. [Beej partial-send loop for the transport edge](https://beej.us/guide/bgnet/) (Beej's Guide to Network Programming) - Section 7.4 Handling Partial send: `sendall` loop; Section 5.7 for short sends and close semantics applied at the frame boundary.

**Focus**

- Version every layer once: envelope version, schema version and endpoint generation. The matrix crosses old and new on each axis, not just one happy-path pair.
- Rollout order is part of the contract: expand (add, ignore), migrate (dual-write, backfill), contract (remove) with reserved numbers held through rollback.
- The fault list is the section checkpoint: partial I/O, oversized and corrupt frames, timeout ambiguity, duplicate mutation, cancellation, overload, restart and rollback.
- Measure on your machine as labeled examples: latency distributions and throughput over payload and concurrency regimes, plus retry, duplicate and rejection counts. Numbers from papers or vendor docs stay cited with their setups, never as targets.

**Reproduce:** From a blank repository, build the versioned framed RPC with a 1 MiB cap, Internet-checksum frames, idempotency keys, deadlines and an auth interceptor, then pass a matrix of old and new clients against old and new servers over seeded partial, corrupt, duplicate, cancel and restart faults, and publish the compatibility table plus the rollout and rollback steps.

**Traps**

- Testing only new-to-new. Production is mixed for the whole rollout window, so old-to-new and new-to-old with rollback are the cases that corrupt data.
- Removing a field and freeing its number at release time. Rollback resurrects the old binary, which then misreads the reused number; reserve through the rollback horizon.
- Reporting a latency number without its setup. Name versions, workload, concurrency, durability settings, run count and spread, or the number is not comparable.

**Practice**

- [MIT 6.5840 Lab 2: full Key/Value plus lock suite](https://pdos.csail.mit.edu/6.824/labs/lab-kvsrv1.html) - Pass `TestReliablePut`, `TestPutConcurrentReliable`, `TestUnreliableNet` and all lock tests; Spring 2026, Go 1.22 or later. Public study material; never publish solutions. Then extend with size-limit, cancellation and mixed-version faults in your own matrix.
- [DSLabs Lab 1: exactly-once RPC parts 2 and 3](https://github.com/emichael/dslabs/tree/49c4a1f9ed59547501376dd3ccfcdd9c1eb7b427/labs/lab1-clientserver) - Part 2 at-least-once then Part 3 exactly-once shim via `run-tests.py --lab 1 --part 2` and `run-tests.py --lab 1 --part 3`; Java 21. Search tests print minimal violating traces. Compare its ordering coverage with your seeded socket-level matrix and state what each harness misses.

**Stop when:** The full matrix passes on your machine with retained seeds and histories, rollback restores the old version without corruption, and the contract names every repeatable effect.

<details>
<summary>Self-test</summary>

1. What rows does the minimum mixed-version matrix need?
   - Old client with old server, old with new, new with old, and new with new, each under partial I/O, corrupt frames, timeout, duplicate, cancel, overload, restart and rollback faults.
2. Rollback happens one hour after a field removal. What breaks if the number was reused immediately?
   - The rolled-back old binary reads new bytes under the old meaning, or new bytes under the reused meaning corrupt old state. Reservations must outlive the rollback window.
3. A test times out but the effect applied. How does the matrix classify it?
   - Ambiguous, not failed. The caller reconciles by idempotency key and the history records maybe, matching the `ErrMaybe` discipline from Lab 2.
4. What must the rollout contract state about repetition?
   - Exactly which requests or effects may repeat, inside which identity and retention boundary, and how callers detect or tolerate the ambiguous cases.

</details>

### Mini-project: Versioned RPC with replayable faults and bounded work

**About 14 to 20 hours.** Create `loglab`, the reduced data system carried through this track, in your chosen implementation language. Build a versioned framed RPC between processes on your machine, with deterministic correctness gates before timing runs and explicit boundaries for retries, identity and overload.

1. Create `loglab` with `proto/`, `net/`, `clock/`, `member/`, `storage/`, `replica/`, `consensus/`, `shard/`, `txn/`, `stream/`, `ops/`, `spec/`, `history/`, `faults/`, `bench/`, `tests/` and `reports/`. Record unary and streaming state machines in `proto/`; check legal transitions against gRPC lifecycles and retain transition fixtures.
2. Build versioned length-prefixed framing and a delimited comparison parser. Keep split-header, split-body, coalesced and split-delimiter fixtures, pre-allocation and decompression limits, and checksum corruption tests; compare encodings and preserve a schema-evolution compatibility table checked against independent decoders, including unknown-field round trips.
3. Implement caller, incarnation, request and intent identities, atomic effect-plus-dedup transitions, parameter-mismatch rejection and bounded retention. Against a sequential intent model, test timeout windows, restart, remaining monotonic budgets, classified retries, jitter and token throttling; retain histories and a derived retry-amplification bound.
4. Add a token-issuing test client, authenticated channel and pre-dispatch authorization interceptor with a per-method policy table. Compare decisions with independent policy fixtures; inject stale discovery generations and keep denial, identity-propagation and versioned redirect traces proving rejected calls never mutate state.
5. Bound queues and connection checkout, add health-gated balancing, streaming half-close, flow control, cancellation propagation and drain. Check against a resource-ownership model; retain exhaustion and deadlock regressions plus cleanup traces, and explain the TCP versus QUIC transport boundary without implementing QUIC.
6. Cross client, server, schema and endpoint versions under deterministic delay, loss, duplication, reordering, partition, corruption, disconnect, restart and cancel schedules. Join traces by causal IDs, not timestamps; retain replay diffs, minimized failures, rollback verdicts and separate MIT 6.5840 Lab 2 and DSLabs Lab 1 results.
7. After correctness passes, compare shedding policies and affinity under repeated open-loop saturation and recovery runs. Check offered, admitted, rejected, retried and completed counts against raw histories; retain latency distributions, throughput, goodput, queue and pool occupancy, observer overhead, versions and workload descriptions.

**Deliverables**

- The `loglab` layout, versioned protocol, bounded RPC implementation and deterministic network with causal event histories.
- Compatibility fixtures, independent state and policy checks, public-suite results, minimized regressions and rollout, rollback and idempotency contracts.
- A measurement report rebuilt from repeated raw runs, with workload, versions, accounting boundaries and retained policy trade-offs.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [MIT 6.5840 Lab 2: Key/Value server and lock tests](https://pdos.csail.mit.edu/6.824/labs/lab-kvsrv1.html). Keep reliable, unreliable and lock results separately; extend their ambiguity cases in your own matrix. Do not publish course solutions.
- external-tests: [DSLabs Lab 1: at-least-once and exactly-once RPC](https://github.com/emichael/dslabs/tree/49c4a1f9ed59547501376dd3ccfcdd9c1eb7b427/labs/lab1-clientserver). Retain Parts 2 and 3 search-test results; distinguish their sequential-client assumptions from your socket, restart and retention tests.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Wire and evolution | Own framing and corruption tests match fixed byte fixtures; independent decoders confirm schema crossings and unknown-field behavior. Mixed-version rollback retains meaning and rejects incompatible requests. | A planted field-reuse or lossy-proxy defect fails before repair; the minimized crossing remains a regression through rollback. |
| Intent and ambiguity | Own histories match the sequential intent model across timeout windows, restarts, parameter conflicts and expiry. The contract names atomicity and retention limits; public-suite evidence is separate. | A planted non-atomic dedup defect yields a minimized counterexample; delayed retries outside retention explicitly bound the guarantee. |
| Authority and resources | Independent policy fixtures and ownership assertions catch unauthorized dispatch, stale generations, leaks, unbounded checkout and stream deadlock. Cancellation and drain release owned resources without claiming effects were undone. | Failures combined with discovery refresh or cancellation expose a naive fix; repaired transition-level regressions preserve rejection and cleanup evidence. |
| Replay and measurement | Own replay tests reproduce raw histories exactly; causal joins ignore display timestamps. Repeated measurements follow correctness gates and reconcile counters with histories under named workloads and versions. | A minimized fault and a losing policy regime survive the final report; observer overhead and queue-versus-service decomposition bound each performance claim. |

Feeds into: The protocol, bounded RPC, deterministic network, compatibility fixtures and causal histories feed identity, membership, storage, replication and consensus; the capstone inherits their contracts, replay evidence and measurement harness.

### Resource route

- **Primary - Book:** [DDIA 2e - Chapter 5 Encoding and Evolution](https://dataintensive.net/) - Read formats, schema evolution, service RPC, durable workflows and event-driven dataflow. Write a four-version compatibility table and connect each compatibility claim to a wire fixture.
- **Required - Reference:** [gRPC Guides - Deadlines, Cancellation, Status Codes, Retry and Flow Control](https://grpc.io/docs/guides/deadlines/) - Read the deadlines, cancellation, status codes, retry (enabled by default with no default policy; no retry once response headers arrive), keepalive and flow-control guides. Turn each into a rule your own RPC layer follows, and check a claim against grpcio before you rely on it.
- **Required - Reference:** [Protocol Buffers and Avro - Unknown Fields and Schema Resolution](https://protobuf.dev/programming-guides/proto3/) - Read the proto3 guide on field numbers, defaults and unknown fields (kept through binary parsing and reserialization, lost through JSON) and the Avro 1.12.0 schema resolution rules (https://avro.apache.org/docs/1.12.0/specification/). Build round-trip fixtures that show each rule.
- **Support - Practice:** [Building Distributed Systems - The Messenger](https://builddistributedsystem.com/tracks/messenger) - Track 1 is free: do the RPC subtrack (sync RPC with timeout, timeout and retry loop, async callbacks, callback reaper, exponential backoff) and the deduplication task. Tasks are graded in the browser after login, so treat a pass as a drill and keep your local harness as the evidence. 
- **Required - Course:** [MIT 6.5840 - RPC and Threads plus Lab 2 Key/Value Server](https://pdos.csail.mit.edu/6.824/labs/lab-kvsrv1.html) - Read the Lecture 2 notes (`notes/l-rpc.txt` and `notes/kv.go`) on RPC failure and at-most-once execution, then do Lab 2: a versioned `Put` key/value server whose client returns `ErrMaybe` when a retried `Put` may already have run, and a lock built on it. Keep the course tests, then add cancellation, size-limit and mixed-version faults in your own harness.
- **Support - Lab:** [DSLabs - Lab 1 Exactly-Once RPC](https://github.com/emichael/dslabs/tree/49c4a1f9ed59547501376dd3ccfcdd9c1eb7b427/labs/lab1-clientserver) - Labs are Java 21 message-passing state machines tested on an emulated network and by model-checking search tests that print a minimal violating trace; run them with the `run-tests.py` script and its `--lab` and `--part` options. Lab 1 builds an "exactly-once" RPC abstraction for an unreplicated key/value server on a network that drops, duplicates and reorders messages. Use it to check your request identity and duplicate-suppression design against exhaustive orderings.
- **Required - Reference:** [HLD Handbook - Networking, API Design and Backpressure](https://github.com/handbook-academy/engineering-handbook/tree/main/content/hld) - Read only Part 0 networking and API design, then the load balancer, service discovery, rate limiting and reliability chapters needed for the protocol design. Use the diagrams to review boundaries, not as a substitute for fault tests.
- **Required - Reference:** [AWS Builders' Library - Timeouts, Retries and Backoff with Jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/) - Read the whole article for timeout choice, retries at one layer, retry amplification across hops, capped exponential backoff and jitter. Derive the request multiplier for retries at every layer of a call chain before writing your retry policy.
- **Support - Reference:** [AWS Builders' Library - Making Retries Safe with Idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/) - Read the caller-provided client request identifier pattern, the validation error for a repeated identifier with different parameters, the semantically equivalent response to a retry and why the identifier is retained only for a bounded interval. Compare that interval with your own duplicate-suppression state.
- **Optional - Practice:** [Building Distributed Systems - The Networker](https://builddistributedsystem.com/tracks/networker) - Only the first three tasks are free (TCP echo, connection pool and backlog, graceful shutdown and drain). Tasks are graded in the browser after login, so treat a pass as a drill and keep your local harness as the evidence. 
- **Support - Reference:** [Beej's Guide to Network Programming](https://beej.us/guide/bgnet/) - Use the client, server, send, receive, select or poll, and partial-transfer sections when socket behavior is unclear. This is a protocol mechanics reference, not the distributed-systems spine.
- **Optional - Practice:** [AlgoMaster System Design - Selected Networking and API Problems](https://algomaster.io/practice/system-design) - Use the problems on idempotency and retries (Deduplicate Idempotent Requests, Build an Idempotent Consumer, Classify Retry Outcomes), rate limiting (sliding-window log and token bucket), the Least Requests load balancer and the queue visibility timeout. For every solved component, add an external fault test and explain what its simplified judge does not establish.
- **Support - Project:** [Replicated Log and Stream Processor - Protocol Slice](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-2/replicated-log-stream-processor.md) - Create the repository, message schema, request and node identities, deadline and retry contract, deterministic network scheduler and raw event format. Keep this same artifact through DS-9.
- **Reference - Reference:** [RFC 9000 - QUIC Version 1](https://www.rfc-editor.org/rfc/rfc9000.html) - Read Section 2 (streams), Section 4 (flow control) and Section 9 (connection migration) for QUIC transport behavior. No implementation; compare with TCP behavior from the Systems stage.
- **Reference - Reference:** [RFC 9114 - HTTP/3](https://www.rfc-editor.org/rfc/rfc9114.html) - Read Sections 3 (connection setup), 6 (stream mapping) and 7 (framing) for how HTTP semantics map onto QUIC streams.
- **Reference - Reference:** [W3C Trace Context](https://www.w3.org/TR/trace-context/) - Read Section 3.2 (traceparent fields), Section 3.3 (tracestate) and Section 4 (processing model) for trace correlation without synchronized clocks.

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

### Study units

#### U1. Wall and monotonic clocks, drift, skew, backward jumps and synchronization uncertainty

**About 4 h** · **Target:** Explain + Measure

Topics: Wall clock versus monotonic clock; Clock drift, skew and backward jumps; Clock synchronization assumptions and uncertainty

Ordering by wall timestamps is the most common silent-loss bug in this section. Clocks look simple until a step, a pause or a skew window reorders two writes.

**You can now**

- Explain when to use a wall clock and when to use a monotonic clock, and why monotonic readings cannot be compared across nodes.
- Derive drift accumulation from a parts-per-million rate and state skew, backward jumps and NTP error sources for a given setup.
- Treat a clock reading as an interval with stated uncertainty and say what ordering it cannot support.

**Study**

1. [Unreliable clocks](https://dataintensive.net/) (DDIA 2e - Chapter 9 The Trouble with Distributed Systems) - Chapter 9, Unreliable Clocks (p. 358), Monotonic Versus Time-of-Day Clocks (pp. 359-360), Clock Synchronization and Accuracy (pp. 360-361), Relying on Synchronized Clocks with Figure 9-3 (pp. 362-364), Clock readings with a confidence interval (pp. 364-365).
2. [Clock synchronisation and monotonic clocks](https://www.cl.cam.ac.uk/teaching/2122/ConcDisSys/dist-sys-notes.pdf) (Cambridge Concurrent and Distributed Systems Notes (Kleppmann) - Time, Clocks and Ordering) - Section 3.2, Slides 52 to 59: NTP request and response stamps, skew estimate, slew and step thresholds, Java currentTimeMillis versus nanoTime example; Exercise 7.
3. [Why wall-clock time fails](https://github.com/handbook-academy/engineering-handbook/blob/d177ae2b48b4dfebf8ad0ddae51a345b3e17d99e/content/hld/part-3-distributed-systems-theory/04-clocks-and-ordering.md) (HLD Handbook - Clocks, Failure Detection and Consistent Hashing) - Theory, Why wall-clock time fails: quartz drift, NTP skew range, leap-second cases and VM pauses; Common Pitfalls warnings on `ORDER BY created_at` and leap-second timing code. Depth: Use as review after DDIA and the notes. Treat its cloud skew ranges and TrueTime bounds as reported figures from its cited sources, not targets you must reproduce.

**Focus**

- A time-of-day clock reads wall time and can step backward. A monotonic clock measures elapsed time on one node and its absolute value is meaningless elsewhere.
- Drift is a rate error in one clock. Skew is the difference between two clocks at one instant. NTP estimates skew under a symmetric-delay assumption that queueing can break.
- NTP slews below 125 ms by varying the rate up to 500 ppm, steps between 125 ms and 1,000 s by resetting the clock, and panics at or above 1,000 s, leaving the fix to an operator. A step is a backward jump for wall readers.
- A reading is an interval, not a point. DDIA builds this from drift since last sync plus server uncertainty plus round-trip time.

**Reproduce:** Closed-book, derive the book's drift example: at 200 ppm a clock resynced every 30 seconds drifts $`200 \times 10^{-6} \times 30 = 0.006`$ seconds, or 6 ms, and resynced once a day drifts $`200 \times 10^{-6} \times 86{,}400 = 17.28`$ seconds, which the book rounds to 17 seconds. State which resync interval each number assumes.

**Traps**

- Comparing monotonic readings from two nodes. They start from unrelated boot points, so the comparison is meaningless even when each node is correct.
- Using a wall clock for elapsed time. A step or leap second can make the difference negative or inflated; use a monotonic source for intervals.
- Reading a synced timestamp as exact. NTP estimates its own error, but common clock APIs return a point with no error bound, so design the consumer to tolerate the full skew window.

**Practice**

- [Building Distributed Systems Timekeeper PH-1: Read System Clock and Detect Backward Jumps](https://builddistributedsystem.com/tracks/timekeeper/tasks/task-4-1-1-clock-read) - Task PH-1: sample the system clock in a loop and record backward jumps. Keep the jump log. It is the evidence you cite when you claim wall time moved backward on your machine.
- [Building Distributed Systems Timekeeper PH-2: Implement Monotonic Clock Wrapper](https://builddistributedsystem.com/tracks/timekeeper/tasks/task-4-1-2-monotonic-clock) - Task PH-2: wrap the system clock so the result never decreases and state what is lost. State the loss in your own words: the wrapper hides the step but keeps no wall meaning, so it cannot order events across nodes.

**Stop when:** You derive both drift numbers without notes and your wrapper log shows a backward wall step that the monotonic path hides with the loss stated.

<details>
<summary>Self-test</summary>

1. Why can a causally later write get the smaller timestamp even when clock skew is under 3 ms?
   - The skew only has to exceed the real gap between the writes. In DDIA Figure 9-3 the skew is under 3 ms, yet x = 1 is stamped 42.004 s and the later increment 42.003 s, so last-write-wins drops the increment.
2. What is the difference between drift and skew?
   - Drift is one clock running fast or slow over time. Skew is the difference between two clocks read at the same instant.
3. When does NTP slew, step or refuse?
   - Slew below 125 ms by adjusting the rate, step between 125 ms and 1,000 s by resetting the clock, and panic at or above 1,000 s, leaving the fix to an operator.
4. Why is a clock reading better described as an interval?
   - Quartz drift since last sync, server uncertainty and network delay each add error. The true time lies somewhere in the resulting range, and digits below that width carry no meaning.

</details>

#### U2. Happens-before, Lamport clocks and total-order tie breaking

**About 4 h** · **Target:** Derive + Implement

Topics: Happens-before and causal order; Lamport clock update rules; Total-order tie breaking versus causality

Causal order is what a system can know without synchronized clocks. Lamport stamps are the cheapest way to label it, and their limits motivate every later clock in this section.

**You can now**

- Define happens-before from its three rules and decide for event pairs whether one precedes the other or they are concurrent.
- Compute Lamport timestamps for a small message history with rules IR1 and IR2, and state which orders the stamps prove and which they leave open.
- Build the total order with node-id tie breaking and explain why it is causal yet arbitrary on concurrent events.

**Study**

1. [Partial order, logical clocks and the total order](https://lamport.azurewebsites.net/pubs/time-clocks.pdf) (Time, Clocks, and the Ordering of Events in a Distributed System (Lamport, 1978)) - The Partial Ordering (happens-before rules 1 to 3), Logical Clocks (Clock Condition, C1, C2, IR1, IR2) and Ordering the Events Totally with the five-rule mutual-exclusion algorithm. Depth: Skim Anomalous Behavior and Physical Clocks on first pass. They motivate bounded physical clocks, which return in the hybrid clock unit.
2. [Happens-before and Lamport clocks workbook](https://www.cl.cam.ac.uk/teaching/2122/ConcDisSys/dist-sys-notes.pdf) (Cambridge Concurrent and Distributed Systems Notes (Kleppmann) - Time, Clocks and Ordering) - Section 3.3, Slides 60 to 64: message reorder example, physical timestamps against causality, happens-before and concurrency; Section 4.1, Slides 65 to 68: Lamport algorithm, properties and total order; Exercises 8, 10 and 11.

**Focus**

- Happens-before has three rules: same-node order, send before matching receive, and transitivity. Concurrent means no message path either way, not simultaneity.
- IR1 increments the clock between successive events. IR2 attaches the send stamp to the message, and the receiver moves past $`\max(\text{local}, t)`$ and adds one, so the receive itself counts as an event.
- The Clock Condition says $`a \rightarrow b`$ implies $`C(a) < C(b)`$. The converse is false. Distinct events with equal stamps are concurrent when the clock rules hold.
- Order $`(L, N)`$ lexicographically: compare timestamps first and use node IDs only for ties. This extends happens-before but imposes an arbitrary order on concurrent events. Persist the clock or establish a safe recovery epoch before restarting; ordered eventual delivery is an extra assumption of the paper's mutual-exclusion protocol, not of timestamp assignment.

**Reproduce:** Closed-book, write IR1 and IR2, then stamp this history: A has a local event, A sends m to B, B receives m, B has a local event, and C has one local event throughout. Result: A stamps 1 and 2, B stamps 3 and 4, C stamps 1. State that B stamps 3 and 4 prove nothing about C, since C is concurrent with all four.

**Traps**

- Reading $`L(a) < L(b)`$ as proof that a caused b. It only rules out b happening before a; a and b may be concurrent.
- Skipping the plus one on receive. Then successive receives of same-stamped messages stop advancing the clock and C1 breaks.
- Assuming the paper's mutual-exclusion algorithm works over a real network. It assumes every message is eventually received in order, so a real build must add sequence numbers and retransmission.

**Practice**

- [Advance a Lamport Logical Clock](https://algomaster.io/practice/system-design/advance-a-lamport-logical-clock) - Implement `timestamps`: a 0 entry adds 1, a positive entry sets the clock to `max(clock, entry) + 1`; the worked examples map `[0,5,0]` to `[1,6,7]`. This drills the Slide 66 rule exactly. State the rule from memory before you open the page.

**Stop when:** You stamp the reproduce history and the Exercise 10 diagram without notes, and your simulator returns the problem's example outputs with the rule stated from memory.

<details>
<summary>Self-test</summary>

1. A sends m then has a local event; B receives m. Which pairs are ordered and which are concurrent?
   - Send precedes receive and each node's own events are ordered. B's receive is concurrent with A's later local event, since no message connects them.
2. Stamps read $`L(a) = 2`$ and $`L(b) = 5`$. Could a have caused b?
   - Possibly, but not proven. The stamps rule out b happening before a and leave happened-before versus concurrent open.
3. Two events share stamp 3. Are they the same event, ordered, or concurrent?
   - If they are distinct events and the Lamport rules hold, they are concurrent: happens-before would require strictly increasing stamps. Equal stamps alone do not identify an event; the timestamp and node ID together do, assuming no reuse after restart.
4. Why does the total order need node names, and what does it settle for concurrent events?
   - Names make every pair comparable so each event has one place in line. For concurrent events the order is deterministic but arbitrary, while happened-before pairs always keep their order.

</details>

#### U3. Vector clock comparison, concurrency and dotted version vectors

**About 4 h** · **Target:** Derive + Implement

Topics: Vector clock comparison and concurrency; Dotted version vectors

Lamport stamps hide concurrency. Vectors expose it, which is what conflict detection and repair need in later sections.

**You can now**

- Compare two vector timestamps and return before, after, equal or concurrent, with the causal-history reading of the result.
- Run the vector update rules on a message history and explain what entry $`T[i]`$ records about node $`N_i`$.
- State what dotted version vectors change for per-key concurrent writes and when to reach for them.

**Study**

1. [Vector clocks workbook](https://www.cl.cam.ac.uk/teaching/2122/ConcDisSys/dist-sys-notes.pdf) (Cambridge Concurrent and Distributed Systems Notes (Kleppmann) - Time, Clocks and Ordering) - Section 4.1, Slides 69 to 72: vector algorithm, the worked example where C learns A's two events through B, and the comparison rules; Exercises 12 and 13. Depth: Exercise 13 names three event pairs, send(m2) with send(m3), send(m3) with send(m5) and send(m5) with send(m9). Answer each pair from both the Lamport and the vector columns.
2. [Dotted version vectors](https://github.com/handbook-academy/engineering-handbook/blob/d177ae2b48b4dfebf8ad0ddae51a345b3e17d99e/content/hld/part-3-distributed-systems-theory/04-clocks-and-ordering.md) (HLD Handbook - Clocks, Failure Detection and Consistent Hashing) - Theory, Dotted version vectors: server-keyed vectors, one dot per value, and the rule for when clients outnumber servers. Depth: Use as review after the notes. It credits server keys with ending sibling explosion; Riak's own account is that server-keyed vectors kept clocks small and the dots fixed sibling explosion. The deployment story is a reported result, not a setup you reproduce here.

**Focus**

- On an event at node $`N_i`$, increment $`T[i]`$. On send, attach $`T`$. On receive, take the element-wise maximum, then increment $`T[i]`$. Entry $`T[i]`$ counts events of $`N_i`$ observed so far.
- A vector stamps a causal history: event plus everything before it. So $`V(a) < V(b)`$ holds exactly when $`a \rightarrow b`$, equality means the same event, and incomparability means concurrency.
- The worked example shows indirect knowledge: when C receives from B, its A entry jumps to 2 without ever hearing from A, because B already knew.
- Dotted version vectors key the vector on servers, not clients, and tag each value with one dot naming the server event that wrote it. A put subsumes the siblings its context observed, so only truly concurrent siblings survive. Server keys keep the vector small; the dots fix the sibling explosion that plain server-keyed vectors cause.

**Reproduce:** Closed-book, compare $`[2, 2, 0]`$ with $`[0, 0, 1]`$: the first leads in entries 0 and 1, the second in entry 2, so they are concurrent. Then run a receive at process 0 with local $`[1, 0, 0]`$ and message $`[0, 1, 0]`$: the merge is $`[1, 1, 0]`$, plus one for the receive, giving $`[2, 1, 0]`$.

**Traps**

- Treating a smaller vector as an earlier event in wall time. The order is causal inclusion, not time, and concurrent vectors are unordered by definition.
- Merging without the final increment. The receive is a new event at the receiver, and skipping it undercounts the receiver's own entry.
- Reusing vectors across a membership change. Entries are positional per member, so a join or replacement needs a new epoch or a map keyed by member id, not a silent index shift.

**Practice**

- [Compare Two Vector Clocks](https://algomaster.io/practice/system-design/compare-two-vector-clocks) - Implement `compare`: `before` when every entry of `a` is at most `b`'s with one smaller, `after` for the reverse, `equal` for identical, else `concurrent`. Write the four-way rule from memory first, then add your own tests for equal vectors and for vectors that tie in every entry but one.
- [Update a Vector Clock on Receive](https://algomaster.io/practice/system-design/update-a-vector-clock-on-receive) - Implement `update`: element-wise maximum of `local` and `received`, then add 1 at `index`; the first example merges `[1,0,0]` and `[0,1,0]` at process 0 into `[2,1,0]`. Do not modify the inputs. Extend to dotted versions in the section mini-project, where keys carry dots.

**Stop when:** You return the reproduce comparison and merge without notes, and both problems pass with the rules stated from memory.

<details>
<summary>Self-test</summary>

1. Vectors read $`[1, 2, 0]`$ and $`[1, 3, 0]`$. What is their relation, and what does it mean?
   - Before: every entry of the first is at most the second's, with entry 1 smaller. The first event happened before the second.
2. Why does C's A entry become 2 after receiving B's vector, with no message from A?
   - B's vector already recorded two A events, and the element-wise maximum copies that knowledge. Vectors carry transitive history, not just direct contact.
3. Two replicas hold dots $`(s_1, 5)`$ and $`(s_2, 3)`$ for one key with incomparable contexts. Siblings or overwrite?
   - Siblings. Neither context subsumes the other, so the writes are concurrent and both values stay until something resolves them.
4. What breaks if you compare vectors stamped under different member sets?
   - Positions no longer name the same members, so before, after and concurrent verdicts are meaningless. Re-key or re-epoch on membership change.

</details>

#### U4. Hybrid logical clock state, persistence and implementation

**About 4 h** · **Target:** Implement

Topics: Hybrid logical clock state and persistence; Logical or hybrid clock implementation

Vectors cost a slot per node. HLC keeps causality in constant space while staying near wall time, which is what database timestamps use in practice.

**You can now**

- Run the Figure 5 send and receive rules on a short trace and explain what each of $`l`$ and $`c`$ records.
- State the proved bounds on $`l - pt`$ and on $`c`$ with the synchronization assumption each one needs.
- Persist HLC state across restarts and bound NTP steps with the reset and ignore-out-of-bounds rules.

**Study**

1. [HLC algorithm, bounds and resilience](https://cse.buffalo.edu/tech-reports/2014-04.pdf) (Logical Physical Clocks and Consistent Snapshots (Kulkarni et al., 2014)) - Section 3.3 with Figure 5 (send, local and receive rules), Theorems 1 to 4 with Corollaries 1 to 4, Section 3.4 (superposition on NTP), Section 4.1 (reset and ignore rules) and Section 5.1 (AWS c-value table). Depth: Read the paper as version TR 2014-04. Work the naive-algorithm counterexample in Section 3.2 before Figure 5, so the missing plus one reads as the fix.
2. [HLC summary and deployment numbers](https://github.com/handbook-academy/engineering-handbook/blob/d177ae2b48b4dfebf8ad0ddae51a345b3e17d99e/content/hld/part-3-distributed-systems-theory/04-clocks-and-ordering.md) (HLD Handbook - Clocks, Failure Detection and Consistent Hashing) - Theory, Hybrid Logical Clocks: state pair, 64-bit packing and the CockroachDB, YugabyteDB and MongoDB users. Depth: Use as review after the paper. Its one-line receive rule glosses the four cases of Figure 5, so trust the paper for implementation.

**Focus**

- State is $`(l_j, c_j)`$. On a local event or send, $`l_j`$ becomes $`\max(l_j, pt_j)`$; $`c_j`$ increments if $`l_j`$ is unchanged and resets otherwise. On receive, $`l_j`$ becomes $`\max(l_j, l_m, pt_j)`$, and $`c_j`$ follows the four-way rule for which of the three inputs won.
- Comparison is lexicographic. Theorem 1 gives causality one way: happened-before implies a smaller stamp, never the reverse, exactly like Lamport.
- Theorem 2 keeps $`l`$ at or ahead of $`pt`$, and Corollary 1 bounds $`|l - pt|`$ by the synchronization uncertainty $`\epsilon`$. Theorem 4 reads $`c`$ as the length of a same-$`l`$ causal chain, which Corollary 3 bounds further.
- HLC reads but never adjusts the physical clock. Section 4.1 resets $`(l, c)`$ to $`(pt, 0)`$ after a bound violation and ignores out-of-bounds messages, raising an alert. These are recovery actions outside the normal causality proof, not permission to rewind timestamps silently. Section 5.1's counter frequencies belong to its AWS and NTP setup, not yours.

**Reproduce:** Closed-book, run Figure 5 from $`(0, 0)`$: local event at $`pt = 10`$ gives $`(10, 0)`$, another local at $`pt = 10`$ gives $`(10, 1)`$, a receive at $`pt = 10`$ of remote $`(12, 4)`$ gives $`(12, 5)`$, and a local at $`pt = 50`$ gives $`(50, 0)`$. Name which case of the receive rule fires each time.

**Traps**

- Reading $`(l, c)`$ as proof of causality. Even with the paper's clock-error bound, a smaller HLC stamp does not establish happens-before.
- Persisting only $`l`$. If physical time has not advanced, resetting $`c`$ can reuse or rewind a stamp. Persist the pair before exposing it, or reserve a durable range that recovery skips.
- Packing the pair into 64 bits and comparing the packed integer across layouts. Decode to $`(l, c)`$ first, since layouts disagree on the split.

**Practice**

- [Advance a Hybrid Logical Clock](https://algomaster.io/practice/system-design/advance-a-hybrid-logical-clock) - Implement `local` and `receive` per the four-way rule, including unchanged and backward `physicalTime`; the second example resets the counter when physical time strictly wins. The page's rule matches Figure 5. Add persistence of the pair and the reset-and-ignore policy around it in your own harness.

**Stop when:** You hand-run the reproduce trace with the correct receive case each time, and your implementation passes the problem's examples with unchanged and backward physical times.

<details>
<summary>Self-test</summary>

1. A local event sees $`pt = 5`$ with state $`(7, 0)`$. What is the new stamp, and why does it not follow the wall clock down?
   - $`(7, 1)`$. The maximum keeps 7, and the counter records the event at that level, so stamps stay monotonic across the backward step.
2. What do Theorems 2 and 3 together say about a stamp with $`l`$ far ahead of $`pt`$?
   - Some causally prior event saw a physical clock equal to that $`l`$. A large gap means the node learned a fast remote clock, not that its own clock is wrong.
3. Why does the paper bound $`c`$ by chain length rather than by node count in practice?
   - Theorem 4 ties each count to a distinct same-$`l`$ causal predecessor. Long same-millisecond chains are rare, so measured $`c`$ stays in single digits while the node-count bound is loose.
4. An NTP step pushes $`pt`$ an hour forward. What fires, and what is lost?
   - The normal local rule adopts the larger physical time and resets the counter. Other nodes may reject the resulting far-ahead messages under Section 4's guard. A forward jump alone need not violate the local bound, but it breaks the assumed synchronization envelope; the normal cross-node guarantees cannot simply be claimed.

</details>

#### U5. Unique identifiers, incarnation numbers and restart-safe identity

**About 4 h** · **Target:** Explain + Implement

Topics: Unique identifier collision and ordering properties; Node, process and client incarnation identifiers; Restart-safe identity persistence

Every dedup key, fencing check and membership entry names an actor. A reused identity turns an ordinary restart into a split brain.

**You can now**

- Choose an ID scheme, random, wall-clock-ordered or Lamport pair, and state its collision, ordering and coordination costs.
- Assign incarnation numbers so a restarted process never reuses a live identity, and say who may increment them.
- Persist the identity state that makes restart safe, and test the dual-incarnation case.

**Study**

1. [ID generators and Lamport pairs](https://dataintensive.net/) (DDIA 2e - Chapter 9 The Trouble with Distributed Systems) - Chapter 10, ID Generators and Logical Clocks: autoincrement and linearizable single-node IDs, random UUIDs and wall-clock timestamp schemes (pp. 417-419); Lamport (counter, node ID) pairs with the Aaliyah, Bryce and Caleb ordering and Figure 10-9 (pp. 420-421).
2. [Incarnation numbers against false suspicion](https://www.cs.cornell.edu/projects/Quicksilver/public_pdfs/SWIM.pdf) (SWIM: Scalable Weakly-consistent Infection-style Process Group Membership (Das et al., 2002)) - Section 4.2, Suspicion Mechanism: incarnation initialized at join, incremented only by the suspected node itself; Alive refutes older Suspect, but Confirm overrides Alive and Suspect at any incarnation.
3. [Unique IDs under partition](https://fly.io/dist-sys/2) (Gossip Glomers - Unique IDs and Broadcast) - Challenge 2: `generate` with any ID type under partition with total availability; run `./maelstrom test -w unique-ids --bin ~/go/bin/maelstrom-unique-ids --time-limit 30 --rate 1000 --node-count 3 --availability total --nemesis partition` with the binary path pointed at your own node; uniqueness is checked, ordering and monotonicity are not.

**Focus**

- Single-node autoincrement is linearizable: an insert that completes before another begins gets the smaller ID. No distributed scheme in this unit keeps that without coordination.
- Random 128-bit IDs need no communication and give no order. Wall-clock schemes sort roughly but lean on NTP, a shard or random part, and a per-shard sequence for same-millisecond uniqueness.
- A Lamport pair is unique when node IDs are unique, and orders causally but not by wall time. Two nodes that never communicate can hold wildly different counters.
- Only the suspected member increments its SWIM incarnation; a higher Alive refutes older Suspect, but the original paper's Confirm is terminal for that member identity. Separately, persist an ID epoch before using it and advance it durably on restart, so new IDs cannot collide with pre-crash IDs.

**Reproduce:** Closed-book, show the restart hole: node B issues (counter 1..50, node B), crashes without persisting, restarts at counter 0 and reissues counter 1, colliding with a live record. Then fix it: persist an epoch that increments once per restart, so post-restart IDs read (epoch 2, counter 1) and never equal epoch 1 IDs.

**Traps**

- Reading wall-clock ID order as causal order. A fast clock stamps an earlier write above a later one from a slow clock, and one NTP step reorders a single node's IDs.
- Letting another node bump a member's incarnation. Only the member itself increments; anything else lets a node that never heard from the member refute its suspicion.
- Rejoining with the same identity and a reset counter. The group still holds the old incarnation, so rejoin as a new epoch or a new member, never as a silent reset.

**Practice**

- [Gossip Glomers 2: Unique ID Generation](https://fly.io/dist-sys/2) - Run `./maelstrom test -w unique-ids --bin ~/go/bin/maelstrom-unique-ids --time-limit 30 --rate 1000 --node-count 3 --availability total --nemesis partition` with the binary path pointed at your node; keep the run directory. Maelstrom runs local processes over a simulated network, but this challenge does not test restart. The section mini-project covers this: issue IDs, restart with the same durable state, issue more, and check uniqueness across both batches.

**Stop when:** The challenge passes, your separate restart test has no duplicate across both batches, and you can name the durable state that prevents reuse.

<details>
<summary>Self-test</summary>

1. A billion random version-4 IDs are generated. About how likely is one collision?
   - About $`10^{-19}`$. With 122 random bits the birthday term is near $`10^{18}/2^{123}`$, vanishingly small but not zero, and it says nothing about order.
2. Two Snowflake IDs sort correctly. Does the earlier-sorting record causally precede the other?
   - Not proven. Sort order follows wall clocks plus shard and sequence parts; skew or a step can invert it relative to causality.
3. Node X is suspected at incarnation 3, then broadcasts Alive at incarnation 4. A late Suspect for incarnation 3 arrives after. What does the group keep?
   - Alive at 4. The higher incarnation wins, and the stale report for 3 is dropped.
4. Why must the epoch live on stable storage rather than in memory?
   - Memory resets on crash, which replays epoch 1. Stable storage survives, so the next boot provably moves to epoch 2.

</details>

#### U6. Heartbeats, observation windows, detector completeness and accuracy, and suspicion thresholds

**About 4 h** · **Target:** Explain + Derive

Topics: Heartbeats and observation windows; Failure detector completeness and accuracy vocabulary; Fixed versus adaptive suspicion thresholds

Every membership and failover decision starts as a suspicion. This vocabulary decides whether a pause looks like death, before any threshold is tuned.

**You can now**

- Explain what a heartbeat proves and what silence cannot prove, using the observation-window idea.
- State detector completeness against accuracy, and distinguish detection delay from eventual detection.
- Compare fixed thresholds with adaptive ones, and name the workload change that breaks each.

**Study**

1. [Fault detection and timeouts](https://dataintensive.net/) (DDIA 2e - Chapter 9 The Trouble with Distributed Systems) - Chapter 9, Fault Detection (p. 351): explicit crash signals versus timeout guessing; Timeouts and Unbounded Delays (pp. 352-353): the false-positive against detection-delay balance, the 2d+r bound and congestion causes.
2. [Direct and indirect probing](https://www.cs.cornell.edu/projects/Quicksilver/public_pdfs/SWIM.pdf) (SWIM: Scalable Weakly-consistent Infection-style Process Group Membership (Das et al., 2002)) - Section 3.1, SWIM failure detector: one random ping per protocol period, k indirect ping-reqs when the ack misses, and the end-of-period check.
3. [Heartbeat and timeout sizing](https://github.com/handbook-academy/engineering-handbook/blob/d177ae2b48b4dfebf8ad0ddae51a345b3e17d99e/content/hld/part-3-distributed-systems-theory/08-failure-detection.md) (HLD Handbook - Clocks, Failure Detection and Consistent Hashing) - Theory, Heartbeats and timeouts: p99 plus jitter sizing with a 2x to 4x margin, and the reported etcd, Kubernetes, TCP keepalive and Redis Cluster numbers. Depth: Use as review after DDIA and SWIM. Its deployment numbers are reported figures from their sources, not values to copy into your detector.
4. [Election timeouts affect progress, majority affects safety](https://pdos.csail.mit.edu/6.824/notes/l-raft.txt) (MIT 6.5840 - Failure and Paper Discussion Lens) - MIT 6.5840 Spring 2026 Lecture 6 notes: when a peer starts an election, the at-most-one-leader vote rules, and how to choose the election timeout. Depth: Read for the timing lens only: needless elections are slow but safe, and an old leader may still think it leads. Do not start the Raft lab.

**Focus**

- A received heartbeat proves the sender was alive at send time, nothing more. Silence inside one window proves nothing: delay, pause, overload and death look identical until the window closes.
- Completeness concerns eventual suspicion of crashed processes; accuracy concerns avoiding suspicion of correct ones, with strong and eventual variants. Shorter timeouts reduce delay, not improve the eventuality guarantee. Explicit crash notifications can help, but connection refusal proves only that an endpoint rejected the connection, not that the machine died.
- SWIM uses $`k`$ indirect probes after a direct miss to reduce false suspicion from one bad path. Failure of every probe still cannot distinguish an isolated live target from a crashed one.
- Raft shows the split this section keeps: timeouts and heartbeats drive progress (elections, suppression), while majority votes carry safety when the old leader is still talking.

**Reproduce:** Closed-book, derive $`2d + r`$: with reliable delivery taking at most $`d`$ each way and handling taking at most $`r`$, a non-faulty request answers within $`2d + r`$. Later silence means a fault or an assumed bound was violated, not necessarily process death. Explain why unbounded network delay and process pauses remove this inference.

**Traps**

- Treating a missed heartbeat as death. The detector output is suspicion with a threshold, and acting on it needs fencing or a quorum, as later units show.
- Tuning the timeout down to detect faster without costing anything. Faster detection spends accuracy, and false convictions add failover load exactly when the system is slowest.
- Copying a vendor timeout into a different network. A 10x ratio that fits one RTT and jitter budget misfires under another; size from your own p99 plus margin.

**Practice**

- The section mini-project covers this: a configurable heartbeat detector in the deterministic network simulation, with suspicion traces under delay, pause and partition schedules.

**Stop when:** You derive $`2d + r`$ with its two missing bounds from memory, and explain why delay, pause, overload and death remain indistinguishable from silence alone.

<details>
<summary>Self-test</summary>

1. A node misses two heartbeat windows, then answers. Was it dead during the silence?
   - Unknowable from heartbeats alone. Delay, pause, overload or a short crash with recovery all fit; the detector can only report suspicion, not the cause.
2. What do completeness and accuracy each promise, and which one breaks first when load spikes?
   - Completeness promises crashed nodes are eventually suspected; accuracy promises live ones are not. Load spikes break accuracy first, through false suspicion.
3. Why does SWIM probe indirectly before suspecting, instead of suspecting on the first missed ack?
   - A direct miss may be a faulty path rather than a faulty target. If any of k others reaches the target, the initiator learns liveness without a false report.
4. Raft holds an unnecessary election. What breaks: safety or progress?
   - Progress only, for a while. Majority voting still permits at most one leader per term, so the cost is delay, which the notes call slow but safe.

</details>

#### U7. False suspicion, a $`\phi`$ accrual detector and detection-delay measurement

**About 4 h** · **Target:** Implement + Measure

Topics: False suspicion under pause, overload and packet loss; Detection delay and false-suspicion measurement; Phi-accrual failure detector implementation

One fixed timeout forces one tradeoff on every consumer. The $`\phi`$ value separates the suspicion signal from the decision, so each consumer picks its own point on the curve.

**You can now**

- Name the non-death causes of silence, pause, overload and loss bursts, and show one on a heartbeat trace.
- Implement the $`\phi`$ computation over a sliding window and trigger suspicion at a chosen threshold.
- Measure detection delay against false-suspicion rate across thresholds and window sizes on one trace.

**Study**

1. [The $`\phi`$ accrual detector](https://dspace.jaist.ac.jp/dspace/bitstream/10119/4784/1/IS-RR-2004-010.pdf) (The phi Accrual Failure Detector (Hayashibara et al., 2004)) - Report IS-RR-2004-010: Section III-A (monitoring, interpretation and action), Section IV-A Equation 2, Section IV-B Equations 3 and 4 with Figure 4, Section V-A (Switzerland-to-Japan UDP trace and replay), and Sections V-B to V-D, Figures 8 to 10 and Equation 5. Depth: Stop after Experiment 3. Treat Equation 5 as the paper's estimate for a crash immediately after sending a heartbeat, not a universal detection-delay bound.
2. [The $`\phi`$ detector in production](https://github.com/handbook-academy/engineering-handbook/blob/d177ae2b48b4dfebf8ad0ddae51a345b3e17d99e/content/hld/part-3-distributed-systems-theory/08-failure-detection.md) (HLD Handbook - Clocks, Failure Detection and Consistent Hashing) - Theory, $`\phi`$ accrual detectors: the mean-based calculation and The GC-pause guard. Depth: Read only this subsection. Its mean-only calculation corresponds to an exponential tail, not the paper's normal fit. Ignore its claim that jitter alone changes this calculation: equal means give equal values regardless of variance. The guard detects pauses of the observer, not arbitrary remote silence.
3. [Suspicion before conviction](https://www.cs.cornell.edu/projects/Quicksilver/public_pdfs/SWIM.pdf) (SWIM: Scalable Weakly-consistent Infection-style Process Group Membership (Das et al., 2002)) - Section 4.2: the suspicion timeout trades longer detection time for fewer false detections. Depth: Read for the tradeoff sentence only; the full mechanism returns in the gossip and membership units.

**Focus**

- Let $`t`$ be elapsed time since the last received heartbeat. The paper computes $`\phi(t) = -\log_{10} P_{\text{later}}(t)`$ from a normal fit to recent inter-arrival intervals. Each extra unit divides the modeled tail probability by ten; it is not the probability that the peer is dead.
- Keep a sliding window of intervals and their sum and sum of squares to estimate $`\mu`$ and $`\sigma^2`$. Define startup behavior and a positive minimum deviation for identical samples. Use a survival function such as `math.erfc` rather than subtracting a rounded CDF from one.
- Replay the same arrivals for every threshold and window size. Count false-suspicion episodes per unit of live-peer observation time; measure crash-to-suspicion delay on separate injected-crash continuations. Exclude or report warmup consistently, as Section V-A does.
- Remote pause, overload and packet loss can all raise suspicion without a crash. A local-pause guard limits accusations after the observer itself stalls; it cannot guarantee protection from a remote loss burst. Safety still needs an authority protocol and storage-side fencing.

**Reproduce:** Closed-book, compute $`\phi`$ at 120 ms since the last received heartbeat, using a normal model with $`\mu = 100`$ ms and $`\sigma = 5`$ ms. The standardized deviation is $`4`$, the survival probability is about $`3.1671 \times 10^{-5}`$, and $`\phi \approx 4.4993`$. Check in Python 3 with `tail = math.erfc(4 / math.sqrt(2)) / 2` and `phi = -math.log10(tail)` after `import math`. This is 20 ms beyond the mean, not 120 ms beyond it.

**Traps**

- Reading a tail probability as a measured false-suspicion rate. Model mismatch and correlated loss can make observed mistakes much more frequent; even quorum agreement cannot prove physical death.
- Moving a threshold across networks. Threshold 8 means different silence seconds under 100 ms and 1 s heartbeats, so recalibrate the curve per deployment.
- Updating the window during silence. No new interval exists until another heartbeat arrives; a long loss burst contributes one long interval on recovery, not one sample per missed beat.

**Practice**

- The section mini-project covers this: a $`\phi`$ accrual detector over recorded heartbeat traces with pause and burst schedules, reporting detection-delay against false-suspicion curves per threshold with seeds retained.

**Stop when:** You compute the reproduce $`\phi`$ from memory with its assumption stated, and can place any threshold choice on the delay-versus-mistakes curve for your own trace.

<details>
<summary>Self-test</summary>

1. Two applications use thresholds 2 and 8. The signal reaches 5 before a heartbeat arrives. Who suspects, and who may act?
   - Only the threshold-2 application suspects. The threshold-8 application has not crossed its threshold. Neither gains exclusive authority merely from suspicion; actions must obey the application's coordination and fencing rules.
2. Why does the paper replay recorded traces instead of testing detectors live side by side?
   - Replay feeds every detector the identical arrival sequence, so threshold and window differences, not network luck, explain the mistake and delay curves.
3. A two-minute loss burst arrives during calm operation. What does $`\phi`$ report, and what should the deployment do?
   - With a calm fitted window, suspicion rises and can cross the threshold even though the peer is alive. A local-pause guard does not mask network loss, and a deviation floor gives no such guarantee. Failover must remain safe even when this suspicion is wrong.
4. For one fixed fitted distribution, what changes when the threshold rises from 2 to 12? Does Equation 5 impose a round-trip lower bound?
   - The equivalent timeout grows. Equation 5 adds estimated one-way propagation to that timeout for a crash immediately after a send. It is not a round-trip lower bound or a formula for every crash phase.

</details>

#### U8. Gossip dissemination, a gossip membership implementation and convergence measurement

**About 5 h** · **Target:** Derive + Implement + Measure

Topics: Gossip dissemination and epidemic convergence; Gossip membership implementation; Gossip traffic and convergence measurement

Gossip trades immediate agreement for eventual convergence at constant per-node cost. It carries membership, and later repair, without any coordinator.

**You can now**

- Derive per-round growth and rounds-to-cover for a fanout and size, and state the no-duplicate-contact assumption.
- Implement push gossip over a peer list that converges with partitions and heals after them.
- Measure messages per operation and convergence time from a Maelstrom run and compare against the rumor model.

**Study**

1. [Infection-style dissemination](https://www.cs.cornell.edu/projects/Quicksilver/public_pdfs/SWIM.pdf) (SWIM: Scalable Weakly-consistent Infection-style Process Group Membership (Das et al., 2002)) - Section 4.1: piggybacking on ping, ping-req and ack with no extra packets, the bounded buffer, and preferring updates gossiped fewer times.
2. [Broadcast challenges 3a to 3c](https://fly.io/dist-sys/3a) (Gossip Glomers - Unique IDs and Broadcast) - Challenge 3a (single node), 3b (five nodes, no partitions) and 3c (five nodes with the partition nemesis); the checker tests convergence of every value to every node, not order or recency. Depth: Stop at 3c. The 3d and 3e efficiency thresholds belong to their own 25-node setup and are not targets here.

**Focus**

- Each round multiplies the informed set: $`I_{r+1} = \min(n, I_r \times (1 + f))`$ for fanout $`f`$, assuming every contact reaches a new node. Real contacts repeat, so the model is an upper bound on speed.
- SWIM sends no dedicated gossip packets: membership updates ride the failure-detector traffic. Under overload the buffer keeps younger updates, so fresh changes infect a few members first and the rest once the rate quiets.
- Partitions only delay: challenge 3c passes when every value reaches every node by the end of the run, because re-contact after healing carries the backlog.
- Convergence is the whole contract. Gossip promises nothing about recency, order or durability, so a converged read can still be stale.

**Reproduce:** Closed-book, run the rumor model: with $`n = 100`$ and fanout 1 the rounds give 2, 4, 8 and 16, and full cover needs 7 rounds since $`2^7 = 128`$. With $`n = 10`$ and fanout 2 the third round computes 27 and caps at 10.

**Traps**

- Quoting the doubling curve as measured behavior. Duplicate contacts and slow nodes stretch every round, so treat the model as the ceiling and your run as the floor.
- Reading convergence as consistency. Two nodes can converge on different values at different times with no violation; ordering needs the clocks from earlier units.
- Gossiping full state every round. The 3b page calls that impractical; send deltas or digests, and keep per-round bytes bounded as the cluster grows.

**Practice**

- [Gossip Glomers 3a to 3c: Broadcast](https://fly.io/dist-sys/3a) - Run 3a with one node, 3b with five nodes, and 3c with five nodes plus the partition nemesis, at rate 10 for 20 seconds, as `./maelstrom test -w broadcast --bin ~/go/bin/maelstrom-broadcast --node-count 5 --time-limit 20 --rate 10 --nemesis partition` adjusted per challenge; keep every run directory. The command quotes the page's Go binary path; point it at your own binary. Read messages-per-operation and stable latencies from your own 3c results file as a labeled example, and compare convergence rounds with the rumor model.
- [Simulate Gossip Rumor Spread](https://algomaster.io/practice/system-design/simulate-gossip-rumor-spread) - Implement `spread` with `informed = min(n, informed * (1 + fanout))` per round, capping late rounds at `n`; the examples cover doubling and the 27-to-10 cap. Do this before the cluster runs. It fixes the ceiling your measured spread must sit under.

**Stop when:** The rumor examples pass from memory, 3c passes with its run directory kept, and you can explain your measured rounds as model ceiling plus duplicates.

<details>
<summary>Self-test</summary>

1. Fanout 2, ten nodes, one informed. How many rounds to cover all, and what caps the math?
   - Three: 3, 9, then 27 capped at 10. The cap is the cluster size; extra contacts after cover are duplicates.
2. Why does SWIM prefer younger buffer entries when piggyback space runs out?
   - Fresh changes must infect someone quickly or they stall everywhere. Once the injection rate quiets, the backlog still propagates through later rounds.
3. A 3c run converges but one read missed a late write. Bug or expected?
   - Expected. The checker tests convergence by end of run, not recency, so a read may miss a write that had not arrived yet.
4. Your 5-node run converges in 2 seconds. Does gossip guarantee 2-second convergence at 50 nodes?
   - No. Rounds grow slowly but per-round work, duplicates and the partition schedule all change; remeasure on the new setup.

</details>

#### U9. Membership join, leave and replacement, versioned views and stale-view handling

**About 4 h** · **Target:** Explain + Implement

Topics: Membership join, leave and replacement; Membership version and stale-view handling

A membership list is a replicated object with stale readers. Versioning is what stops a healed partition from resurrecting the dead.

**You can now**

- Run join, leave, suspect, alive and failed transitions and say which message overrides which.
- Version membership views and reject stale ones on receipt and before acting.
- Handle replacement: a restarted member rejoins without its old identity hijacking the view.

**Study**

1. [Join, leave and refutation](https://www.cs.cornell.edu/projects/Quicksilver/public_pdfs/SWIM.pdf) (SWIM: Scalable Weakly-consistent Infection-style Process Group Membership (Das et al., 2002)) - Section 3.2 (join through a contact member or coordinator, leave by announcement), Section 4.1 (buffered dissemination), and Section 4.2 (Alive and Suspect incarnation comparisons; terminal Confirm after the suspicion timeout).
2. [The majority rules on death declarations](https://dataintensive.net/) (DDIA 2e - Chapter 9 The Trouble with Distributed Systems) - Chapter 9, The Majority Rules (pp. 372-373): the one-way-listening node, the minute-long pause, and why a quorum must declare death.

**Focus**

- Join needs a contact: a coordinator, a well-known address, or probabilistic replies. Leave is an announcement over unreliable spread, so treat it as a hint and keep probing.
- Suspect is not Failed. A suspected member stays on the list and stays a probe target until the timeout passes with no Alive refutation.
- In original SWIM, Alive at incarnation 4 refutes Suspect at 3, while Suspect overrides Alive at equal incarnation. Confirm overrides both at any incarnation. Do not substitute an incarnation-first rule for terminal failure without explicitly changing the protocol.
- SWIM membership is weakly consistent, not quorum agreement. DDIA's majority rule concerns coordinated authority: a node whose outgoing messages are lost must honor removal from authority. Replacement needs a fresh process identity or an explicit rejoin protocol so old terminal reports cannot evict the replacement.

**Reproduce:** Closed-book, apply original SWIM Section 4.2 to member A: Suspect at incarnation 3, Alive at incarnation 4, then Confirm at incarnation 3. Alive first refutes Suspect, but Confirm removes A despite the higher Alive incarnation. Explain why replacement needs a fresh identity or an explicit rejoin protocol.

**Traps**

- Deleting a failed member immediately. Late refutations and delayed messages then have nowhere to land; keep the recently failed alongside the living, as SWIM does.
- Acting on one reporter's Failed. A partition makes every watcher on one side wrong together; wait for quorum agreement before reassigning work.
- Trusting leave as certain. A lost leave leaves a ghost member, and a lost join leaves a live stranger; both need the probe path as backup.

**Practice**

- The section mini-project covers this: versioned membership views with join, leave and replacement, plus stale-view tests where delayed Suspect, Alive and Confirm messages arrive out of order with seeds retained.

**Stop when:** You apply the reproduce sequence and explain each override using both message type and incarnation, without confusing membership reports with exclusive authority.

<details>
<summary>Self-test</summary>

1. Two watchers send Confirm for A at incarnation 3 while A broadcasts Alive at 4. What does original SWIM keep?
   - A is removed. Section 4.2 makes Confirm override Alive regardless of incarnation. If the watchers had sent only Suspect at 3, Alive at 4 would refute them.
2. A node restarts and rejoins with incarnation 0 while the group holds it failed at incarnation 2. What happens without an epoch?
   - Its reports lose every comparison, and its old identity shadows the new one. It must rejoin under a fresh epoch the group has never seen.
3. Why does the book make the one-way-listening node step down instead of defending itself?
   - It cannot prove its case to anyone: its outgoing path is dead. Only a quorum decision both sides can observe breaks the symmetry.
4. A leave announcement never arrives. How does the group still converge?
   - Probes keep failing, suspicion rises through the normal path, and the member is declared failed by timeout rather than by announcement.

</details>

#### U10. Partitions, asymmetric reachability, split-brain boundaries and correlated failure domains

**About 4 h** · **Target:** Explain

Topics: Network partitions and asymmetric reachability; Split-brain prevention boundaries; Failure domains and correlated faults

A partition turns one cluster into two truths. This unit draws the line the minority must not cross, and names the shared fate that per-node thinking misses.

**You can now**

- Draw two-sided and one-sided partitions with asymmetric reachability, and say what each node may conclude.
- State the split-brain boundary: which side may act under a majority rule, and what the minority must do.
- Map nodes to failure domains and give one correlated fault that a per-node model misses.

**Study**

1. [Knowledge, majorities and system models](https://dataintensive.net/) (DDIA 2e - Chapter 9 The Trouble with Distributed Systems) - Chapter 9, Knowledge, Truth, and Lies (pp. 371-372): guesses from messages and stating the model; The Majority Rules (pp. 372-373): quorum death declarations; System Model and Reality (pp. 380-384): synchronous, partially synchronous and asynchronous timing with crash-stop, crash-recovery, limping and Byzantine nodes.
2. [Partition behavior on a real run](https://fly.io/dist-sys/3c) (Gossip Glomers - Unique IDs and Broadcast) - Challenge 3c: five nodes with the partition nemesis; watch which nodes the checker still converges and which values wait for healing. Depth: Read the run as a partition log, not only a pass. Note what no node could conclude mid-run about the other side.

**Focus**

- A partition is not death: both sides keep running with different knowledge. One-sided reachability is worse, since the cut-off node hears requests it can never answer.
- Under a majority rule of more than half, only a side holding the majority may decide. With five nodes split 3 and 2, the 2 must stop deciding, even while fully healthy.
- The book's model advice: design for partial synchrony with crash recovery, where delays, pauses and drift are usually bounded but sometimes arbitrarily large. Safety must survive the sometimes.
- Failure domains are shared fate: one rack, switch, power feed or zone holds many nodes. The Systems unit on failure domains, correctness signals and safe rollout maps the practice; here learn the correlated cases it assumes, like a deploy or a config pushed everywhere at once.

**Reproduce:** Closed-book, apply the majority rule to five nodes: split 3 and 2 means only the 3 acts; after one more failure leaves 2 and 2, neither side holds 3, so both stop. State the general rule: with $`2f + 1`$ nodes, progress needs $`f + 1`$ on one side.

**Traps**

- Letting both sides serve writes and merge later without a plan. Without CRDTs or a stated conflict rule that is split brain with a nicer name.
- Treating one peer's heartbeat as cluster connectivity. Reachability is pairwise and asymmetric; a green link to one node says nothing about the rest.
- Counting live nodes instead of a fixed membership. A majority is out of all members, not out of the currently reachable ones, or two sides each claim it.

**Practice**

- [Building Distributed Systems Timekeeper PH-3: Simulate Split-Brain Caused by Clock Drift](https://builddistributedsystem.com/tracks/timekeeper/tasks/task-4-1-3-split-brain-lease) - Task PH-3: drive two sides of a partition to claim one lease through skewed clocks. Keep the losing side's log: the observable you want is both sides believing they hold it, which fencing must later refuse.

**Stop when:** You apply the majority rule to any split without notes, and your PH-3 log shows the double-claim your fencing design must refuse.

<details>
<summary>Self-test</summary>

1. Node A hears B, B does not hear A, and both hear C. What can A conclude about B?
   - Only that its own messages to B go unanswered. B may be dead, partitioned one way, or merely slow; A must not declare B dead alone.
2. Seven nodes split 4 and 3. Which side decides, and what must the 3 do?
   - The 4 decides, holding more than half of 7. The 3 serves nothing that needs agreement and waits for healing or reassignment.
3. A rolling config push restarts every node within a minute. Per-node thinking says fine. What is wrong?
   - The restarts correlate: the fault shares one cause and one window. The cluster can lose majority together, which independent-failure math never predicts.
4. Why does the book call partial synchrony with crash recovery the most useful model?
   - It matches reality: timing usually holds but sometimes breaks without bound, and crashed nodes return with stable storage intact. Safety must hold in the bad intervals; only progress may wait them out.

</details>

#### U11. Leases, process pauses, fencing tokens and a lease implementation

**About 5 h** · **Target:** Explain + Implement

Topics: Leases and their timing assumptions; Process pause and lease-expiry hazards; Fencing tokens and generation checks; Lease and fencing implementation

A lease is authority with an expiry date. Pauses forge the date, so the storage layer must check the token, not the clock.

**You can now**

- State the lease contract and the timing assumptions a client-side validity check needs.
- Construct a pause scenario that lets an expired holder write, and show fencing blocking it.
- Implement lease acquire, renew and release with monotonic fencing tokens, tested for expiry, pause and partition cases.

**Study**

1. [Pauses, leases and fencing](https://dataintensive.net/) (DDIA 2e - Chapter 9 The Trouble with Distributed Systems) - Chapter 9, Process Pauses (pp. 366-371): the lease-renewal loop with its two flaws and the pause catalog; Distributed Locks and Leases (pp. 373-377): the HBase zombie, fencing tokens 33 and 34 with Figure 9-6, and fencing across replicas with Figure 9-7.
2. [Fencing tokens and the pause race](https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html) (How to Do Distributed Locking (Kleppmann, 2016)) - Making the lock safe with fencing (tokens 33 and 34 with storage-side rejection); the check-then-write pause race; the Redlock synchrony assumptions. Depth: Treat the Redlock critique as dated to 2016. The lasting lesson is the token rule, not the product verdict.

**Focus**

- A lease grants authority until expiry. A timing-only client needs bounded clock error or drift and a bound on delay from its validity check through the protected operation. Delayed renewal must not extend authority without confirmation. A pause or delayed request can invalidate a client's check; fencing closes that gap at storage.
- The book's loop fails twice: expiry set by one machine is read against another's clock, and a 15-second pause between the validity check and the request lets the lease die mid-act unnoticed.
- Fencing moves enforcement to storage: every grant carries a higher token, here 33 then 34, and storage rejects any write whose token moved backward. The lock service grants; the storage service refuses.
- Tokens must rise across grants and survive failover. DDIA Figure 9-7 separately assumes a fixed leaderless replica set, intersecting read and write quorums, and last-write-wins comparison with the token dominating the timestamp. Only under those rules can a stale write on a missed replica lose at the next quorum read and later be repaired; this is not protection for arbitrary external side effects.

**Reproduce:** Closed-book, walk tokens 33 and 34: client 1 holds 33 and pauses past expiry; client 2 takes 34 and writes; client 1 resumes and writes with 33, which storage rejects as backward. State the storage invariant: the largest token seen wins, and anything lower is refused.

**Traps**

- Renewing early and then pausing. The renewal only proves liveness at renewal time; a pause after it still expires the lease under the holder.
- Releasing or renewing without matching owner and token. Any holder that can release another's lease can steal authority without waiting.
- Generating tokens from a counter that resets on lock-service failover. Tokens must be monotonic across crashes too, or the new service reissues 33 after 34.

**Practice**

- [Implement a Lease Lock with Fencing Tokens](https://algomaster.io/practice/system-design/implement-a-lease-lock-with-fencing-tokens) - Implement `acquire`, `renew` and `release`: a lease at `now` expires at `now + ttl` and is active while `now < expiresAt`, tokens rise by one per grant and are never reused; the examples map Alice and Bob through expiry at time 10 and release at time 8. After it passes, add the storage-side token check the page omits: a write with a backward token must be rejected even from the recorded holder.

**Stop when:** You walk the 33 and 34 case with the invariant stated, and your lock passes the problem's expiry examples plus your own pause-and-stale-write test.

<details>
<summary>Self-test</summary>

1. Why must the fencing check live on the storage service rather than the lock service?
   - The paused holder never contacts the lock service again; it goes straight to storage believing its lease is live. Only storage sees the stale write and can refuse it.
2. Client 1 holds token 33 with 30 seconds left, then pauses 60 seconds. Client 2 holds 34 and writes twice. Client 1 resumes and writes. Which writes survive?
   - Client 2's two writes survive. Client 1's write carries 33 against a seen 34 and is rejected, even though 33 was valid when issued.
3. The lock service crashes and restarts, reissuing token 33 to a new holder while 34 exists. What breaks?
   - Monotonicity breaks: storage has seen 34, so it rejects the legitimate new holder's 33. Token state needs the same durability as the lease.
4. Client 2 reaches only two of three replicas with token 34. Where can client 1's token-33 write still land, and why is that safe?
   - On the missed third replica. It stays safe because reads go to a quorum, which always includes a replica holding 34, and repair then overwrites the stale copy.

</details>

#### U12. Deterministic membership and network simulation

**About 4 h** · **Target:** Implement

Topics: Deterministic membership and network simulation

Simulation is how one machine tests a cluster. Determinism turns a flaky failure into a reproducible case the learner can argue from.

**You can now**

- Build a seeded scheduler with delay, drop, duplicate, reorder, partition and crash faults that replays byte-identical traces.
- Run membership, detector and lease logic inside it against the DS-2 fault slice of the project list.
- Reduce a failing run to a seed plus schedule and retain it as evidence.

**Study**

1. [Deterministic faults and durable histories](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-2/replicated-log-stream-processor.md) (Replicated Log and Stream Processor - Time and Membership Slice) - Architecture constraints (deterministic schedules, durable event histories, timing-free safety tests) with the failure-injection list entries for this section: split brain attempt, clock jump, stale lease and epoch, and dual process incarnation. Depth: Read the DS-2 slice only. The log, stream and transaction entries belong to later sections.
2. [An external behavior contract](https://fly.io/dist-sys/3c) (Gossip Glomers - Unique IDs and Broadcast) - Challenge 3c evaluation: every broadcast value visible on every node after a partitioned run. Depth: Use as the conformance target your simulated broadcast must also satisfy. The Systems unit on distributed histories and deterministic failure simulation built the scheduler itself; extend it here, do not rebuild it.

**Focus**

- Seed everything: topology, delays, drops, duplicates, reorder windows, partition intervals, crash and restart points. A run is its seed plus its schedule, and both are retained.
- Simulate time as an integer tick, never the wall clock. Timers, heartbeats and lease checks read the tick, so reruns cannot drift.
- Check fencing safety after every transition; no stale token may bypass the storage check. Membership convergence is a liveness goal, not a safety invariant, and needs eventual communication and fair scheduling. Simulated-time reads are valid for detector and lease behavior; do not require real-time bounds to establish fencing safety.
- Cover the DS-2 slice: split brain attempt, clock jump, stale lease and epoch, dual incarnation, pause and partition healing. Keep raw message and state traces, then shrink the event schedule while preserving the failure. A numerically smaller seed is not a smaller counterexample.

**Reproduce:** Closed-book, state the determinism contract: same seed plus same schedule gives byte-identical message and state traces on rerun. Demonstrate it by running a three-node partition schedule twice and diffing the two trace files, which must match exactly.

**Traps**

- Seeding the network but reading the wall clock in a timeout. One unseeded time source makes reruns diverge and the diff lie.
- Testing only loss-free schedules. Discovery lives in drops, duplicates, reorder and pause interleavings; the clean run is the smoke test, not the evidence.
- Keeping summaries instead of raw traces. A minimized case needs the full message history, or the next reader cannot replay the verdict.

**Practice**

- The section mini-project covers this: the deterministic membership and network simulation harness with seeded schedules, retained raw traces and one minimized failure case.

**Stop when:** Your rerun diff is empty, the DS-2 fault slice all runs inside the harness, and one minimized case is retained with its seed.

<details>
<summary>Self-test</summary>

1. Two reruns of one seed disagree. Name three unseeded sources that could explain it.
   - Wall-clock reads, an unseeded RNG such as a default hash seed or thread race, and iteration over an unordered set or map. Fix all three before trusting any diff.
2. May a deterministic test read simulated time, and does a convergence check establish safety?
   - Yes. Detector and lease transitions depend on simulated timers, which replay deterministically. Convergence is a liveness property under eventual-delivery assumptions; fencing safety is the separate invariant that stale tokens cannot pass the storage check.
3. A dual-incarnation bug appears once in fifty seeds. What do you keep?
   - The failing seed, the schedule, the raw trace, and the minimized variant. The other forty-nine runs are the coverage note, not the evidence.
4. Your simulated broadcast converges under every partition schedule. Does 3c still add anything?
   - Yes. Maelstrom drives the actual node processes through their JSON input and output with an independent workload and checker. Its network is simulated, not the production TCP stack, so it adds evidence without covering every transport fault.

</details>

### Mini-project: Restart-safe clocks, membership and fenced authority

**About 14 to 20 hours.** Extend `loglab` with clocks, durable actor identities, heartbeat detectors, gossip membership and a fenced lease service. Replay deterministic schedules on your machine before any timing run, keeping membership convergence separate from exclusive authority and naming the assumptions needed for progress.

1. Add injectable wall and monotonic clocks in `clock/`, with skew, drift, jumps and uncertainty intervals. Check Lamport stamps, vector comparisons and per-key dotted versions against an independently constructed happens-before graph and causal event sets; retain concurrency, context-subsumption and member-replacement fixtures.
2. Implement HLC updates and restart-safe IDs with durable clock pairs and identity epochs. Check HLC transitions against the paper's Figure 5 and IDs against a set oracle across restart and dual-incarnation schedules; retain bound-violation alerts and separate Gossip Glomers Unique ID Generation results.
3. Build configurable fixed-threshold and $`\phi`$ accrual detectors in `member/`. Replay recorded arrivals under delay, observer and peer pauses, overload, burst loss and partitions; compare suspicion decisions with independent distribution calculations, defining startup and deviation floors, and retain seeds and ground-truth liveness labels.
4. Implement bounded gossip dissemination using `net/`. Check fixed schedules against a set-union convergence oracle, then pass Gossip Glomers Broadcast through its partition challenge under Maelstrom; retain run directories and explain duplicate contacts relative to the no-repeat rumor-growth model without claiming ordering or durability.
5. Add versioned membership views with join, leave and fresh-identity replacement. Compare reordered Suspect, Alive and Confirm transitions with an independent original-SWIM transition table; retain stale-view and incarnation tests, terminal-report handling and seeds, explicitly separating gossip views from authority configurations.
6. Implement lease acquire, renew and release with owner-token checks and durable resource-side fencing. Against a sequential grant model, test expiry, pauses, delayed renewal, partitions and restart; retain stale writes before and after token installation, the activation boundary and a fixed-configuration majority-authority fixture.
7. Extend campaigns with asymmetric reachability, correlated failures, clock jumps, split-brain attempts and healing; assert fencing after every transition and retain identical replays plus a minimized failure. After correctness gates, compare detector delay against false suspicion across thresholds and windows; report repeated gossip-convergence and traffic measurements.

**Deliverables**

- The `clock/` and `member/` components, deterministic timer integration, restart-safe identity contract and resource-side fencing boundary.
- Causal and transition oracles, replayable fault histories, public-suite results and a minimized regression with seeds and explicit schedules.
- Detector trade-off curves and gossip cost report from retained traces, separating simulated progress from process timings and authority guarantees.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [Gossip Glomers 2: Unique ID Generation](https://fly.io/dist-sys/2). Keep Maelstrom results separately; your restart and dual-incarnation tests establish guarantees this network-only challenge does not check.
- external-tests: [Gossip Glomers 3a to 3c: Broadcast](https://fly.io/dist-sys/3a). Run the single-node, multi-node and partition challenges; retain raw histories without treating their convergence checks as ordering or membership-authority tests.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Causality and identity | Own graph and event-set oracles validate clocks, concurrency and dotted-context replacement. Figure 5 checks validate HLC cases; restart and dual-incarnation tests catch reused identities independently of Maelstrom. | Planted clock-state loss and dot-subsumption defects fail before repair; out-of-envelope resets explicitly delimit the normal causality guarantee. |
| Detector evidence | Own fixed-trace decisions match independent distribution calculations. Curves count live-peer false-suspicion episodes and crash-to-suspicion delay separately, with consistent warmup and retained seeds, versions and arrival traces. | Repeated matched comparisons retain a model-mismatch regime; observer-pause guards are tested without claiming they detect remote pauses or prove death. |
| Membership and authority | Own transition-table tests cover stale reports and replacement; set-union checks establish convergence under stated delivery assumptions. Sequential grant checks and durable resource fences reject backward tokens after activation despite incorrect suspicion. | A planted stale-view or fence-persistence defect yields a minimized regression; traces explain why a pre-installation stale write is not retroactively fenced. |
| Determinism and scope | Own replay diffs are empty for retained schedules; per-transition safety checks precede repeated timing runs with versions and workloads. Reports separate simulated ticks, process measurements, bounded non-progress and conditional convergence. | The minimized counterexample preserves the violated predicate and environmental assumptions; correlated and asymmetric faults expose a gap missed by independent-node campaigns. |

Feeds into: Restart-safe actors, dotted contexts, detector traces, versioned gossip views and fenced-resource fixtures feed replication, consensus, shard ownership and consumer groups; the capstone inherits replayable clock and authority failures with explicit safety and progress assumptions.

### Resource route

- **Primary - Book:** [DDIA 2e - Chapter 9 The Trouble with Distributed Systems](https://dataintensive.net/) - Read clocks, pauses, unreliable networks, partial failures and knowledge limits. For each failure, record what a node observes, what is true globally and what action is safe under that uncertainty.
- **Required - Paper:** [Time, Clocks, and the Ordering of Events in a Distributed System (Lamport, 1978)](https://lamport.azurewebsites.net/pubs/time-clocks.pdf) - Read the partial ordering and logical clocks sections: happens-before, the Clock Condition, rules IR1 and IR2, and the total order. Its ties are broken arbitrarily, so the total order is not causality.
- **Support - Paper:** [Logical Physical Clocks and Consistent Snapshots (Kulkarni et al., 2014)](https://cse.buffalo.edu/tech-reports/2014-04.pdf) - Read the hybrid logical clock algorithm and its bounds; the paper reports the logical counter staying well below its proved bound in practice, so measure your own.
- **Support - Paper:** [SWIM: Scalable Weakly-consistent Infection-style Process Group Membership (Das et al., 2002)](https://www.cs.cornell.edu/projects/quicksilver/public_pdfs/SWIM.pdf) - Read the direct and indirect probing detector, infection-style dissemination, the suspicion mechanism and incarnation numbers. Suspicion timeouts depend on the workload.
- **Support - Paper:** [The phi Accrual Failure Detector (Hayashibara et al., 2004)](https://dspace.jaist.ac.jp/dspace/bitstream/10119/4784/1/IS-RR-2004-010.pdf) - Read how phi is computed from the heartbeat inter-arrival history and how a threshold trades detection time for false suspicion. Its normal approximation misleads under bursty delay, so test with pause traces too.
- **Required - Reference:** [How to Do Distributed Locking (Kleppmann, 2016)](https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html) - Read the process-pause, network-delay and fencing-token sections with DDIA 2e Chapter 9 "Distributed Locks and Leases". Treat the Redlock critique as dated to 2016; the lasting lesson is that the storage service must reject a write that carries an older token.
- **Support - Reference:** [Cambridge Concurrent and Distributed Systems Notes (Kleppmann) - Time, Clocks and Ordering](https://www.cl.cam.ac.uk/teaching/2122/ConcDisSys/dist-sys-notes.pdf) - Use Chapter 3 (physical clocks, NTP and monotonic clocks, happens-before) and Section 4.1 (Lamport and vector clocks with worked examples) as the derivation workbook: work Exercises 7 to 13. Each section marks where its public lecture video starts.
- **Optional - Practice:** [Building Distributed Systems - The Timekeeper](https://builddistributedsystem.com/tracks/timekeeper) - Only the first three tasks are free (clock reads and backward jumps, a monotonic wrapper, a split-brain lease). Tasks are graded in the browser after login, so treat a pass as a drill and keep your local harness as the evidence. 
- **Optional - Practice:** [Building Distributed Systems - The Gossiper](https://builddistributedsystem.com/tracks/gossiper) - Only the first three tasks are free (basic broadcast, tree topology, random gossip). Tasks are graded in the browser after login, so treat a pass as a drill and keep your local harness as the evidence. 
- **Required - Reference:** [HLD Handbook - Clocks, Failure Detection and Consistent Hashing](https://github.com/handbook-academy/engineering-handbook/tree/main/content/hld) - Read Part 3 clocks and ordering, failure detection and consistent hashing. Use its exercises to compare assumptions, then verify claims against your own histories.
- **Required - Practice:** [Gossip Glomers - Unique IDs and Broadcast](https://fly.io/dist-sys/2) - Each challenge runs locally under Maelstrom (v0.2.4; the pages were tested on 0.2.3) with its checker and, where the page says so, the partition nemesis; keep the run directory as the history. Do challenge 2 (unique IDs under partition with total availability) and 3a to 3c (broadcast, then with partitions). A pass shows uniqueness or convergence in that run, not ordering or recency.
- **Support - Course:** [MIT 6.5840 - Failure and Paper Discussion Lens](https://pdos.csail.mit.edu/6.824/schedule.html) - Use the RPC, GFS, Raft and consistency lectures to identify which timing assumptions affect progress and which invariants must not depend on time. Do not start the Raft lab yet.
- **Support - Project:** [Replicated Log and Stream Processor - Time and Membership Slice](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-2/replicated-log-stream-processor.md) - Add incarnation IDs, logical timestamps, gossip membership, suspicion metrics and fenced ownership. Retain seeds and minimized traces for every false-failure or stale-actor case.
- **Support - Practice:** [AlgoMaster System Design practice - clock, gossip and lease drills](https://algomaster.io/practice/system-design) - Use only the named problems: Advance a Lamport Logical Clock, Compare Two Vector Clocks, Update a Vector Clock on Receive, Advance a Hybrid Logical Clock, Simulate Gossip Rumor Spread and Implement a Lease Lock with Fencing Tokens. Each states its function signature and checks small deterministic cases.

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

### Study units

#### U1. Point, range and analytical workloads, OLTP versus OLAP, and records, pages and segments

**About 4 h** · **Target:** Explain

Topics: Workload shape for point, range and analytical access; Records, pages, blocks and segments; OLTP versus OLAP access patterns

Every engine choice later in this section is a bet on workload shape. A point lookup, a range scan and a full-table aggregation stress different parts of the storage stack.

**You can now**

- Classify a workload as point, range or analytical access and state which layout serves each shape.
- Contrast OLTP and OLAP access patterns by rows touched, concurrency and latency target.
- Explain how records pack into pages and how pages group into segments or files.

**Study**

1. [Storage engines for OLTP and analytics](https://dataintensive.net/) (DDIA 2e - Chapter 4 Storage and Retrieval) - Chapter 4, Storage and Retrieval: the chapter introduction and Storage and Indexing for OLTP, printed pp. 115-116, then Data Storage for Analytics, printed pp. 134-136.
2. [CMU 15-445 Fall 2025 storage lectures](https://15445.courses.cs.cmu.edu/fall2025/notes/03-storage1.pdf) (CMU 15-445 - Storage, Index and Recovery Sequence) - Lecture #03: Database Storage I, then Lecture #05: Database Storage II and Lecture #06: Storage Models and Compression. Depth: Use these for pages, heap layout and row versus column models. Leave buffer-pool replacement and B+ tree operations for their own units.
3. [HLD Handbook storage and OLTP versus OLAP](https://github.com/handbook-academy/engineering-handbook/blob/d177ae2b48b4dfebf8ad0ddae51a345b3e17d99e/content/hld/part-4-data-systems/01-oltp-vs-olap.md) (HLD Handbook - Storage Engines and Data Structures) - Workload shapes table and Row vs column layout, with the four-column Alice, Bob and Carol example. Depth: Treat the vendor latency and compression ranges as reported figures, never as targets for your machine.

**Focus**

- Point access touches one to a hundred rows by key. Range access walks keys in order. Analytical access scans millions of rows and aggregates a few columns.
- OLTP means thousands of short transactions per second with 1 to 10 ms targets. OLAP means a few heavy queries with seconds to minutes targets.
- A row store keeps each tuple contiguous for cheap point access. A column store keeps each attribute contiguous so an aggregation reads only the columns it needs.
- Records pack into fixed-size pages, and pages group into segments or files that higher units compact and index.

**Reproduce:** Without notes, fill a decision table for three workloads: key-value point lookups, ordered range scans, and a full-table sum over 3 of 50 columns. Name the layout for each and show that, with equal-width columns, the aggregation reads about 6% of the row-store bytes before compression.

**Traps**

- Calling OLTP and OLAP database brands. They are workload shapes; one product can serve either shape badly.
- Assuming a row store plus an index matches a column store on wide scans. The column store reads fewer bytes by construction.
- Assuming hybrid engines remove the trade-off. A second physical copy with a replication lag replaces it.

**Practice**

- [CMU 15-445 Fall 2025 Homework #2: Slotted Pages and Log-Structured Storage](https://15445.courses.cs.cmu.edu/fall2025/files/hw2-clean.pdf) - Question 1, Slotted Pages and Log-Structured Storage: the slotted-page problems and the log-structured versus slotted-page comparison. Work Question 1 on paper, then check your answers on the course's Gradescope site for non-CMU learners (entry code in the course FAQ). Keep Questions 2 and 3 on storage models and compression for their units.

**Stop when:** You classify a new workload by shape in one minute and defend the layout with a byte-count argument.

<details>
<summary>Self-test</summary>

1. A fact table has 50 equal-width columns and a query sums 3 of them over all rows. About what fraction of the row-store bytes does a column store read?
   - About $`3/50`$, or 6%, before compression. The row store reads every column of every row; the column store reads only the three referenced columns.
2. Why does a point lookup favor a row store while a full-table aggregation favors a column store?
   - The row store keeps one tuple contiguous, so one lookup reads one place. The aggregation touches few columns across many rows, so contiguous columns read fewer bytes.
3. What distinguishes a page from a segment in this section?
   - A page is a fixed-size unit such as 8 KiB that the engine reads and writes. A segment is a larger immutable file of many pages that the log and LSM units write once and later compact.
4. A workload issues thousands of single-row updates per second and one nightly full-table report. Which shape dominates engine choice?
   - The updates dominate. Choose the engine for the sustained write and point-access shape, and serve the report from a separate analytical copy instead of compromising the write path.

</details>

#### U2. Append-only log layout, write-ahead ordering and checksummed records

**About 4 h** · **Target:** Implement

Topics: Append-only log layout; Write-ahead logging order; Checksummed records and metadata

The log is the durability primitive for everything after it. Checkpoints, compaction and recovery all assume an ordered checksummed record stream.

**You can now**

- Implement a length-prefixed append-only log with per-record checksums.
- Explain the write-ahead rule: the log record reaches stable storage before the data it describes.
- State what a checksum detects and which corruptions need more than a checksum.

**Study**

1. [Log-structured storage](https://dataintensive.net/) (DDIA 2e - Chapter 4 Storage and Retrieval) - Chapter 4, Storage and Indexing for OLTP with Log-Structured Storage, printed pp. 115-124: the two-bash-function store on p. 116, the in-memory hash map, SSTables and the LSM overview.
2. [PostgreSQL WAL segments and XLOG records](https://www.interdb.jp/pg/pgsql09/02.html) (The Internals of PostgreSQL - Buffer Manager, WAL and Recovery) - Chapter 9, Sections 9.2 to 9.4: WAL segment files, the internal layout of a WAL segment, and the internal layout of an XLOG record (page read 2026-10-15). Depth: Read for record layout and LSN ordering. Leave checkpoint processing and recovery for the recovery unit.
3. [OSTEP log-structured file system](https://pages.cs.wisc.edu/~remzi/OSTEP/file-lfs.pdf) (Operating Systems: Three Easy Pieces - Crash Consistency and Data Integrity) - Chapter 43, Sections 43.1 and 43.2: the sequential-write motivation and segment writing. Depth: Use it for why all writes become sequential.
4. [OSTEP checksums](https://pages.cs.wisc.edu/~remzi/OSTEP/file-integrity.pdf) (Operating Systems: Three Easy Pieces - Crash Consistency and Data Integrity) - Chapter 45, Sections 45.3 Detecting Corruption: The Checksum and 45.4 Using Checksums. Depth: Read the checksum mechanics only; misdirected and lost writes belong to the torn-writes unit.

**Focus**

- Each record is a length prefix, a payload and a checksum. The reader never trusts a length or payload whose checksum fails.
- Write-ahead means the log record is stable before the change it describes becomes visible. A crash between the two replays the log; a crash before the log leaves nothing to replay.
- A checksum detects random corruption inside a record. It does not detect a record written to the wrong address or a write that never arrived; those need addresses and read-back checks.
- The Systems unit on write-ahead logging, recovery, checksums and durability taught the concept. Here the hours go to record layout and ordering at engine depth.

**Reproduce:** From a blank file, implement `append(rec)` and `scan()` over a file of length-prefixed records with a 4-byte checksum each. `binascii.crc32(b'hello')` must equal `0x3610a686`, and flipping one payload bit must fail the check on rescan.

**Traps**

- Treating the Python `binascii.crc32` demo value as a cross-system constant. It is CRC-32 IEEE; RocksDB and PostgreSQL WAL use CRC-32C with a different polynomial, so the values are not interchangeable.
- Calling a log durable because `write` returned. The bytes may sit in the OS page cache; durability needs the next unit's sync step.
- Letting one file grow forever. Real logs roll fixed-size segments so old data can be reclaimed; later units compact whole segments at a time.

**Practice**

- [Building Distributed Systems TH-1: Implement a Write-Ahead Log](https://builddistributedsystem.com/tracks/logger/tasks/task-10-1-1-wal-impl) - Task TH-1, Implement a Write-Ahead Log: append path with checksum. This is a free drill graded in the browser after login. Treat a pass as a drill and keep your local log implementation as the evidence.

**Stop when:** Your local log round-trips records, rejects a one-bit flip on rescan, and you can state the write-ahead rule in one sentence.

<details>
<summary>Self-test</summary>

1. What three fields does each log record need, and in what order are they written?
   - Length prefix, payload, then checksum over both. The scanner reads the length, then the payload, then verifies the checksum before returning the record.
2. A crash lands between the log append and the in-memory index update. What does recovery do?
   - It rescans the log and rebuilds the index from the records found. The log is the source of truth; the index is derived state.
3. A record has a valid checksum but holds another record's data. Did the checksum fail?
   - No. The checksum proves the bytes arrived intact, not that they belong at this address. Misdirected writes need per-record identity such as a key or offset bound to the checksum.
4. Why does PostgreSQL give every WAL record a monotonically increasing LSN?
   - The LSN orders records across segments, so replay, checkpoints and replication can name a position and agree on what comes before and after it.

</details>

#### U3. Buffered, flushed and durable write states and the fsync contract

**About 4 h** · **Target:** Explain + Measure

Topics: Buffered, flushed and durable write states; fsync and acknowledged-write contract

Replication cannot repair an undefined local ack. A client that hears success must know whether the data survives a process crash, an OS crash or a power loss.

**You can now**

- Distinguish buffered, flushed and durable write states and name which failures each survives.
- State an acknowledgement contract that names the exact sync step behind every ack.
- Measure sync latency on your machine and explain group commit from the numbers.

**Study**

1. [PostgreSQL WAL configuration, internals and reliability](https://www.postgresql.org/docs/18/wal-configuration.html) (PostgreSQL 18 Documentation - WAL Configuration and Internals) - Section 28.5, WAL Configuration: the checkpoint paragraphs including the 5-minute `checkpoint_timeout` and 1 GB `max_wal_size` defaults and the redo-record definition; then Section 28.6, WAL Internals, and Section 28.1, Reliability. Depth: Section 28.1 also documents CRC-32C per WAL record and checksummed data pages with full-page images; read it as the contract statement, not as a tutorial.
2. [OSTEP journaling write ordering](https://pages.cs.wisc.edu/~remzi/OSTEP/file-journaling.pdf) (Operating Systems: Three Easy Pieces - Crash Consistency and Data Integrity) - Chapter 42, Section 42.3: the checkpoint sequence and the side note on forcing writes to disk with barriers, plus the checksum-in-journal fix for batched transaction writes.
3. [fsync contract and error semantics](https://man7.org/linux/man-pages/man2/fsync.2.html) (Linux man-pages: fsync) - DESCRIPTION for `fsync` versus `fdatasync` and the directory-sync requirement for new file names; ERRORS: an `EIO` from write-back may concern data written through any descriptor of the file.
4. [PostgreSQL error handling for a failed flush](https://www.postgresql.org/docs/18/runtime-config-error-handling.html) (PostgreSQL 18 Documentation - WAL Configuration and Internals) - Section 19.14, Error Handling: `data_sync_retry`, why PostgreSQL panics on a failed flush, and why a retried flush can report success after the kernel dropped the data.

**Focus**

- Buffered means visible to the process. Flushed means handed to the OS. Durable means confirmed on stable storage after `fsync` or `fdatasync` returns success.
- Acknowledge only after the sync the contract names. An ack after the bytes reach the OS but before sync survives a process crash, not an OS crash or power loss; an ack while they still sit in the process's buffer survives neither. A renamed or newly created file needs its directory synced too.
- The Systems unit on files, page cache, fsync, atomic rename and durability taught the calls. Here the new material is the ack contract, group commit and measured sync latency.
- A failed `fsync` may leave clean page cache over lost data, so retrying `fsync` is not proof the data landed. Treat the write as uncertain and reconcile from the log.

**Reproduce:** Write down the three states for one Python file append and the failures each survives, with the PostgreSQL checkpoint defaults of 5 minutes and 1 GB beside them. Then time 100 syncs of one small write on your machine with `os.fsync` and report the median and the spread over one run.

**Traps**

- Reading `write` return as durability. It confirms the OS accepted the bytes, not that any disk holds them.
- Syncing once and assuming later writes are covered. Every byte needs its own completed sync before its ack.
- Calling a retry after a failed `fsync` a fix. PostgreSQL's `data_sync_retry` documentation explains why: after a write-back failure the kernel may have dropped the data, so a second `fsync` can report success over lost bytes. Recovery must decide from the log, not from the retry.

**Practice**

- The section mini-project covers this: the acknowledgement contract of your checksummed log with a sync-latency measurement and a crash schedule that separates buffered, flushed and durable acks.

**Stop when:** You can label any ack in your log as buffered, flushed or durable and point at the sync call that justifies it.

<details>
<summary>Self-test</summary>

1. A server acks a write after `write` but before `fsync`, then the OS crashes. Is the data durable?
   - No. The data was buffered and possibly flushed to the OS cache, but never confirmed on stable storage. Only post-sync acks survive an OS crash or power loss.
2. A file is synced but its directory entry is not, then power fails. What can be lost?
   - The name. The file contents may sit on disk while the directory never records the rename or creation, so the file is unreachable after reboot.
3. Why does PostgreSQL batch several commits behind one flush with `commit_delay`?
   - Each flush pays one sync latency. Letting concurrent commits share the leader's sync amortizes that cost across transactions at the price of a small added delay.
4. What does the checkpoint redo record tell crash recovery?
   - The WAL position from which REDO must start. All data-file changes before it are already on disk, so earlier WAL segments can be recycled.

</details>

#### U4. Torn, truncated and reordered writes and crash-consistent metadata publication

**About 4 h** · **Target:** Explain + Implement

Topics: Torn, truncated and reordered write scenarios; Crash-consistent metadata publication

Disks write sectors, not your records. Any multi-sector update can land partially, and only an ordered publication protocol makes the partial state detectable.

**You can now**

- Enumerate crash states for torn, truncated and reordered writes at sector and file granularity.
- Implement atomic metadata publication with write-ahead records, checksums and a synced rename.
- Explain when full-page images are needed and what turns them off safely.

**Study**

1. [OSTEP journaling crash scenarios](https://pages.cs.wisc.edu/~remzi/OSTEP/file-journaling.pdf) (Operating Systems: Three Easy Pieces - Crash Consistency and Data Integrity) - Chapter 42, Section 42.3: the five-block journal transaction, the torn-transaction garbage-block example, and the checksum fix that lets the whole transaction issue at once.
2. [OSTEP misdirected and lost writes](https://pages.cs.wisc.edu/~remzi/OSTEP/file-integrity.pdf) (Operating Systems: Three Easy Pieces - Crash Consistency and Data Integrity) - Chapter 45, Sections 45.5 and 45.6: Misdirected Writes and Lost Writes, with the read-back verification discussion.
3. [PostgreSQL torn pages and full-page images](https://www.postgresql.org/docs/18/wal-reliability.html) (PostgreSQL 18 Documentation - WAL Configuration and Internals) - Section 28.1, Reliability: the sector-tear paragraph with the 8 KiB page over 512-byte sectors, and the full-page-image paragraph including the `full_page_writes` condition.

**Focus**

- A torn write lands some sectors of one page. A truncated write lands a prefix of a multi-block transaction. A reordered write lands a later block before an earlier one.
- Publication is journal first with a transaction-end marker and checksum, then checkpoint to final locations, then a synced rename or manifest swap that flips the visible state at once.
- A matching begin and end marker is not enough when the disk reorders internally. The checksum over the transaction body is what exposes the garbage middle block.
- PostgreSQL writes full page images after each checkpoint because a torn 8 KiB page cannot be repaired from per-tuple WAL records alone. ZFS-like stacks that prevent partial writes may disable it; ordinary stacks must not.

**Reproduce:** On paper, list the crash states for a five-block journal transaction TxB, I, B, Db, TxE: crash before TxE is stable, crash with TxE stable but checkpoint incomplete, and crash after checkpoint. State what recovery replays or discards in each case.

**Traps**

- Assuming an 8 KiB page write is atomic because one call issued it. The drive writes 512-byte sectors, and power can fail between any two of them.
- Treating `rename` as durable without syncing the directory. The new name is visible but not yet crash-safe.
- Disabling `full_page_writes` for speed on a plain filesystem. Without page images, a torn page has no repair source during REDO.

**Practice**

- [Building Distributed Systems TH-2: Implement WAL Recovery on Startup](https://builddistributedsystem.com/tracks/logger/tasks/task-10-1-2-wal-recovery) - Task TH-2, Implement WAL Recovery on Startup: half-written tail handling. This is a free drill graded in the browser after login. Reproduce the torn-tail case in your local log and keep the local crash schedule as evidence.

**Stop when:** You enumerate all three crash outcomes for a journal transaction and your local log discards the torn tail on every injected schedule.

<details>
<summary>Self-test</summary>

1. The journal holds TxB, I, B, garbage and TxE with matching IDs. Is this transaction valid?
   - No. Matching IDs without a body checksum cannot expose a reordered middle block. Recovery must reject it by checksum, not accept it by markers.
2. What distinguishes a truncated transaction from a torn page?
   - Truncation cuts a multi-block transaction short, so the end marker or checksum is missing or wrong. A tear corrupts the middle of one page while its framing looks complete.
3. Why does the publication protocol sync the directory after renaming a new segment file?
   - The rename changes a directory, not the file. Until the directory itself is synced, a crash can lose the name even though the file contents are durable.
4. When is turning off `full_page_writes` safe?
   - Only when the layer below provably prevents partial page writes, such as a copy-on-write filesystem. Otherwise recovery cannot repair torn pages.

</details>

#### U5. Recovery scanning, tail repair and recovery-time measurement

**About 4 h** · **Target:** Implement + Measure

Topics: Recovery scanning and tail repair; Recovery time and data-integrity measurement

Recovery is the read half of the durability contract. Its scan rule decides which prefix of the log is truth after every crash.

**You can now**

- Implement a recovery scan that replays from the last checkpoint and stops at the first invalid record.
- Explain ARIES analysis, redo and undo passes and the page LSN rule in one paragraph each.
- Measure recovery time against log size and state the integrity the scan guarantees.

**Study**

1. [CMU 15-445 Fall 2025 logging and recovery](https://15445.courses.cs.cmu.edu/fall2025/notes/21-logging.pdf) (CMU 15-445 - Storage, Index and Recovery Sequence) - Lecture #21: Database Logging with Lecture #22: Database Recovery, including LSNs, checkpoints and the ARIES recovery phases.
2. [PostgreSQL checkpoint and recovery processing](https://www.interdb.jp/pg/pgsql09/07.html) (The Internals of PostgreSQL - Buffer Manager, WAL and Recovery) - Chapter 9, Sections 9.7 and 9.8: Checkpoint Processing and Database Recovery, with 9.8.2 on LSN comparison and idempotency, read with Section 28.5 on the redo record (page read 2026-10-15).
3. [ARIES restart processing](https://cs.stanford.edu/people/chrismre/cs345/rl/aries.pdf) (ARIES: A Transaction Recovery Method (Mohan et al., 1992)) - Sections 1 and 3 for the repeating-history overview, then Section 6 with 6.1 Analysis, 6.2 Redo and 6.3 Undo. Depth: Read the pass structure and the page LSN rule. Skip physiological logging detail and the 1992 storage taxonomy; the rest is beyond this section.

**Focus**

- Start from the last checkpoint redo record, not from the beginning of time. Everything before the redo point is already on disk, so recovery time grows with replayed bytes and checkpoint frequency trades write cost against recovery time.
- ARIES repeats history first: redo all logged actions to rebuild the crash state, then undo the losers. Redo before undo is the order that makes the result correct.
- A page is redone only when the log record LSN exceeds the page LSN. The comparison is what makes replay idempotent across repeated crashes.
- A corrupt record with nothing valid after it is treated as a torn append and truncated, which is safe only if that record was never acknowledged. A corrupt record with valid records after it may hide acknowledged writes, so stop with a corruption error and keep the evidence; recovering only the prefix is an explicit, lossy choice. Recovery never invents missing records.

**Reproduce:** Given a log with records r1 and r2 checksummed and a torn r3, state the recovered prefix and the index contents after recovery. Then crash partway through recovery, run it again and show the result is identical: in a paged engine the page LSN check makes redo idempotent, and in your log the index is rebuilt from the same valid prefix.

**Traps**

- Replaying from segment zero after every crash. The redo record exists so recovery skips already-checkpointed work.
- Redoing only committed transactions. Repeating history redoes everything including losers, then undoes them; skipping the redo pass breaks the chain the undo pass assumes.
- Skipping over a corrupt middle record to salvage later ones. Only a corrupt tail that was never acknowledged is safely truncatable; a corrupt middle record ends the trustworthy prefix.

**Practice**

- [CMU 15-445 Fall 2025 Homework #6: Recovery](https://15445.courses.cs.cmu.edu/fall2025/files/hw6-clean.pdf) - Recovery homework: ARIES pass and LSN reasoning questions. Work the pass-order and LSN questions on paper, then check your answers on the course's Gradescope site for non-CMU learners (entry code in the course FAQ). Keep your local log replay as the implementation evidence.

**Stop when:** Your log recovers the valid prefix on torn-tail and clean schedules, halts with evidence on a corrupt middle record, and recovery time tracks replayed bytes on your machine.

<details>
<summary>Self-test</summary>

1. What are the three ARIES restart passes in order, and what does each produce?
   - Analysis rebuilds the dirty-page and transaction tables. Redo repeats history to the crash state. Undo rolls back loser transactions with compensation records.
2. A log record has LSN 100 and the page has LSN 100. Does redo apply it?
   - No. Redo applies only when the record LSN exceeds the page LSN. Equal LSNs mean the page already contains the change.
3. Recovery finds a corrupt record in the middle of a segment with valid records after it. What is the safe outcome?
   - Do not skip it, and do not silently truncate there: the later records may be acknowledged writes. Stop with a corruption error and keep the evidence; serving only the prefix before it is an explicit, lossy operator choice.
4. Checkpoints run twice as often. What happens to recovery time and steady-state cost?
   - Recovery replays less log so it finishes faster, but each checkpoint flushes dirty pages and emits full-page images more often, raising steady-state write cost.

</details>

#### U6. In-memory and sparse indexes, and B-tree page and split invariants

**About 4 h** · **Target:** Explain + Implement

Topics: In-memory and sparse indexes; B-tree page and split invariants

Every range query in this track walks an ordered structure. The B-tree invariants are what keep that walk correct after splits and merges.

**You can now**

- Explain when an in-memory index suffices and when a sparse on-disk index pays off.
- State the B-tree page and split invariants and check them after every mutation.
- Derive tree depth from page size and entry size for a stated row count.

**Study**

1. [B-trees](https://dataintensive.net/) (DDIA 2e - Chapter 4 Storage and Retrieval) - Chapter 4, B-Trees, printed pp. 125-128: fixed-size pages, page numbers as disk pointers, and branch versus leaf layout.
2. [CMU 15-445 Fall 2025 index lectures and B+ tree project](https://15445.courses.cs.cmu.edu/fall2025/notes/08-indexes1.pdf) (CMU 15-445 - Storage, Index and Recovery Sequence) - Lecture #08: Indexes and Filters I with Lecture #07: Hash Tables for the hash-index contrast and Lecture #10: Index Concurrency Control for latch crabbing; project page for the B+ tree with the Fall 2025 leaf tombstone buffer. Depth: Use the lectures for page layout and split behavior. Leave optimistic latch crabbing internals for later; the invariant work here is single-threaded correctness.
3. [HLD Handbook B-tree mechanics](https://github.com/handbook-academy/engineering-handbook/blob/d177ae2b48b4dfebf8ad0ddae51a345b3e17d99e/content/hld/part-4-data-systems/00-storage-engines.md) (HLD Handbook - Storage Engines and Data Structures) - B-tree mechanics: fixed pages with InnoDB 16 KiB and PostgreSQL 8 KiB sizes, fanout and depth, page splits, clustered versus heap layout.

**Focus**

- An in-memory hash map from key to log offset is fast but must fit in RAM and rebuilds by scanning the log. A sparse index keeps one entry per page or segment and bounds memory at the cost of one extra page read.
- Every leaf sits at the same depth. Every node except the root holds between the minimum and maximum key count. A split moves half the keys and posts the middle key upward, possibly cascading.
- A 16 KiB page with 200-byte entries holds about 80 children, so a billion-row table needs 5 levels since $`80^4 = 40{,}960{,}000`$. Depth grows logarithmically, not with data size.
- The Systems unit on hash indexes, B-trees, selectivity and range scans taught the structures. Here the new work is checking split and merge invariants in code. InnoDB stores row data in the primary-key leaf while PostgreSQL keeps rows in a heap, so their secondary pointers and vacuum behavior differ.

**Reproduce:** Closed-book, derive depth for $`10^9`$ keys with 16 KiB pages and 200-byte entries: fanout about $`80`$, since $`80^4 = 40{,}960{,}000`$ is too small and $`80^5`$ exceeds $`10^9`$, lookups touch at most 5 pages.

**Traps**

- Counting depth as linear in data size. Each level multiplies capacity by the fanout, so one more level absorbs roughly 80x more keys.
- Assuming every secondary index points at the heap. InnoDB secondary entries store the primary key and need a second traversal.
- Splitting only the leaf. An overflowing internal node splits too, and a root split grows the tree by one level.

**Practice**

- [CMU 15-445 Fall 2025 Project 2: B+ Tree with leaf tombstone buffer](https://15445.courses.cs.cmu.edu/fall2025/project2/) - B+ tree insert, delete and iterator tests including the leaf tombstone buffer behavior across merge, split and redistribute. Configure with `-DCMAKE_CXX_FLAGS="-include cstdint"` under GCC 15 and strip the `DISABLED_` test prefix to run them. Keep scope to single-threaded invariants.

**Stop when:** You derive depth for a new page and entry size without notes and your invariant checker passes splits, merges and redistributes.

<details>
<summary>Self-test</summary>

1. When does a sparse index beat a dense in-memory hash map?
   - When the key count exceeds RAM or restart time matters. The sparse index keeps one entry per page or segment, trading one bounded page read for a small memory footprint and fast rebuild.
2. A leaf with capacity 4 holds keys 1, 2, 3 and 4, and key 5 arrives. What changes?
   - The leaf splits into two leaves with 2 or 3 keys each, the middle key posts to the parent, and all leaves stay at the same depth. A full parent splits recursively.
3. Why do B-tree range scans stay cheap while hash-index range scans do not?
   - B-tree leaves hold keys in sorted order with sibling links, so a range walks forward. A hash index scatters neighboring keys across buckets with no order to walk.
4. PostgreSQL updates a row three times without vacuum. How many heap tuples exist?
   - Four versions until cleanup: the original plus three new ones, the older three dead once the updates commit. Vacuum, or pruning when the page is next read, reclaims them.

</details>

#### U7. LSM levels, memtable flush, SSTables and Bloom filter false positives

**About 4 h** · **Target:** Derive + Implement

Topics: LSM tree levels and sorted runs; Memtable flush and SSTable creation; Bloom filter false positives

Write-heavy stores accept background merge work to keep foreground writes sequential. The Bloom filter is what keeps the resulting multi-level reads affordable.

**You can now**

- Derive the Bloom filter false-positive rate from bits per key and hash count.
- Explain memtable insert, immutable freeze, flush and leveled organization with overlap rules.
- Size a Bloom filter for a stated key count and rate target.

**Study**

1. [LSM trees and SSTables](https://dataintensive.net/) (DDIA 2e - Chapter 4 Storage and Retrieval) - Chapter 4, Log-Structured Storage, printed pp. 118-124: SSTables, memtables, sorted-run merging and the Bloom filter and compaction strategy notes, then Comparing B-Trees and LSM-Trees, printed pp. 129-131. Depth: The Bloom filter and tombstone treatments here are brief; take the sizing math from the HLD sizing page in this unit.
2. [HLD Handbook LSM mechanics and Bloom filters](https://github.com/handbook-academy/engineering-handbook/blob/d177ae2b48b4dfebf8ad0ddae51a345b3e17d99e/content/hld/part-4-data-systems/00-storage-engines.md) (HLD Handbook - Storage Engines and Data Structures) - LSM-tree mechanics with the 64 MB memtable and 10x level growth, then Bloom filters and read optimization with the 10-bits-per-key 1% rule. Depth: Treat the RocksDB defaults as examples that label the mechanism, not as settings to copy blindly.
3. [Bloom filter sizing formula](https://github.com/handbook-academy/engineering-handbook/blob/d177ae2b48b4dfebf8ad0ddae51a345b3e17d99e/content/hld/part-0-prerequisites/02-data-structures-for-systems.md) (HLD Handbook - Storage Engines and Data Structures) - Bloom filters: the bit array mechanism with $`m = -n \ln(p) / (\ln 2)^2`$ and $`k = (m/n) \ln 2`$, the 1% worked sizing and the RocksDB 10-bits-per-key default.

**Focus**

- Writes land in a sorted memtable. A full memtable freezes to immutable, flushes as one sorted SSTable, and a new memtable takes over without blocking the ack path.
- Level 0 files overlap because each is a direct flush. Deeper levels hold non-overlapping sorted runs, so a read checks every L0 file but at most one file per deeper level.
- A Bloom filter has no false negatives and a tunable false-positive rate $`(1 - e^{-kn/m})^k`$. Negatives skip the SSTable; positives still read it. Optimal hash count is $`(m/n) \ln 2`$, so 10 bits per key uses 7 hashes for about 1% and 16 bits per key uses 11 hashes for about 0.05%.
- Bloom filters do not help range scans. A range must open every overlapping run because hashing every key in the range is impractical.

**Reproduce:** Closed-book, derive the rate for $`m/n = 10`$ and $`k = 7`$: $`(1 - e^{-0.7})^7`$ is about $`0.008`$, or 0.8%. Then size 1 million keys at 1%: about 1.2 MB of filter bits with 7 hashes.

**Traps**

- Reading a negative Bloom answer as uncertain. Negative is certain absence; only positive answers are probabilistic.
- Adding hash functions past the optimum to lower the rate. Excess hashes fill the bit array faster and the rate rises again.
- Treating Level 0 as non-overlapping. Overlap is the defining L0 property and the reason reads check every L0 file newest first.

**Practice**

- [CMU 15-445 Fall 2025 Homework #3: Bloom Filter](https://15445.courses.cs.cmu.edu/fall2025/files/hw3-clean.pdf) - Question 4, Bloom Filter: the bit-array walkthrough and the true-or-false Bloom statements. Work the 8-bit example by hand, then check against the published solutions. Keep the B+ tree project for the index unit.

**Stop when:** You derive the rate for a new bits-per-key value without notes and can state which SSTable files a point read touches.

<details>
<summary>Self-test</summary>

1. A memtable fills while a flush is still running. Where does the next write go?
   - Into a new active memtable. The full one is already immutable, so foreground writes never wait for the flush to finish; backpressure only starts if immutable tables pile up.
2. With $`m/n = 10`$ bits per key, which integer $`k`$ minimizes the rate and what is it?
   - About $`10 \ln 2`$, so $`k = 7`$, giving roughly 0.8%. That is the 1% rule quoted for 10 bits per key.
3. A point lookup misses in every Bloom filter. How many SSTable reads happen?
   - None for the skipped files. The filters rule out every level, so the read returns not-found without loading data blocks.
4. Why keep deletes as tombstones instead of removing the key during the flush?
   - Older levels may still hold the key. Removing it only from the new file would resurrect the stale copy on reads; the tombstone must compact through every level that can contain the key.

</details>

#### U8. Compaction policy, tombstones, atomic manifests and segment compaction with atomic swap

**About 5 h** · **Target:** Implement

Topics: Compaction policy and write stalls; Tombstones and resurrection risk; Snapshots and atomic manifest replacement; Segment compaction with atomic swap

An LSM without compaction is an ever-growing pile of overlapping files. Compaction policy decides what stalls, what resurrects and what the disk holds.

**You can now**

- Contrast leveled and tiered compaction on read, write and space amplification.
- Explain tombstone resurrection and the rule that prevents it.
- Implement segment compaction with an atomic manifest swap.

**Study**

1. [HLD Handbook compaction strategies](https://github.com/handbook-academy/engineering-handbook/blob/d177ae2b48b4dfebf8ad0ddae51a345b3e17d99e/content/hld/part-4-data-systems/00-storage-engines.md) (HLD Handbook - Storage Engines and Data Structures) - Compaction strategies: leveled with 10-30x write amplification and 10% space overhead, size-tiered with lower write amplification and about 100% transient space overhead, and time-windowed for TTL data.
2. [SSTable merging and compaction](https://dataintensive.net/) (DDIA 2e - Chapter 4 Storage and Retrieval) - Chapter 4, Log-Structured Storage, printed pp. 118-124: the SSTable merge walkthrough and compaction notes, with the write-stall and backpressure discussion at printed pp. 129-131.
3. [CMU 15-445 Fall 2025 B+ tree tombstone buffer](https://15445.courses.cs.cmu.edu/fall2025/project2/) (CMU 15-445 - Storage, Index and Recovery Sequence) - Project 2: the leaf tombstone buffer with its recency rule across merge, split and redistribute. Depth: Read the tombstone survival rule as the small-scale version of LSM tombstone handling. Leave concurrent latch behavior for later.

**Focus**

- Leveled compaction bounds reads to one file per level and space to about 10% overhead, at 10-30x write amplification. Tiered compaction writes less but reads more and transiently doubles disk use.
- A tombstone is a deletion marker with a sequence number. Dropping it before it meets every older copy resurrects the deleted key on later reads.
- The manifest lists the live files. Compaction writes new files, syncs them, then swaps the manifest atomically; a crash before the swap keeps the old list, never a half-published merge.
- Write stalls are backpressure, not a bug. When compaction cannot keep up with flushes, the engine suspends writes rather than letting overlapping files grow without bound.

**Reproduce:** Merge two sorted runs on paper: L0 holds (a, 1) and a tombstone for b; L1 holds (a, 0) and (c, 3). Newest wins per key, so the output is (a, 1) and (c, 3) with the b tombstone retained because levels below L1 may still hold an older b.

**Traps**

- Deleting a tombstone at the first merge that sees no copy in the files being merged. Deeper levels are unchecked, so the key resurrects.
- Publishing compacted files in place. New files must be complete and synced before the manifest swap names them live.
- Reading a stall as lost throughput to tune away. The stall protects read amplification bounds; removing it trades a latency spike for permanent read debt.

**Practice**

- The section mini-project covers this: segment compaction with an atomic manifest swap plus a tombstone-resurrection fault test.

**Stop when:** Your compaction merges two runs with a tombstone correctly and a crash before the manifest swap loses nothing acknowledged.

<details>
<summary>Self-test</summary>

1. When is a tombstone safe to drop during compaction?
   - Only when the merge covers every level that can hold an older copy of the key, so no stale version survives below the tombstone.
2. A crash lands between writing compacted files and swapping the manifest. What does recovery see?
   - The old manifest and old files. The new files are orphans until the next compaction relists or cleans them; no reader ever saw a half-published merge.
3. Why does leveled compaction amplify writes more than tiered compaction?
   - Each level merge rewrites overlapping data from the next level down. Aggressive re-sorting keeps reads bounded but recopies bytes through every level.
4. Memtable pressure rises while compaction lags. What should the engine do?
   - Apply backpressure and suspend writes until a flush completes. Accepting unbounded L0 overlap trades a short stall for permanently slower reads.

</details>

#### U9. Compression, buffer-pool caching and sequential versus random I/O

**About 4 h** · **Target:** Explain + Measure

Topics: Compression and encoding trade-offs; Caching and buffer-pool behavior; Sequential versus random I/O

Most storage wins come from reading fewer bytes, not faster bytes. Encoding, caching and access pattern decide how many bytes each query moves.

**You can now**

- Explain dictionary, run-length and $`\Delta`$ difference encoding and which column shapes each suits.
- Distinguish buffer-pool hits from misses and state what each costs.
- Measure sequential versus random read patterns on your machine and explain the gap.

**Study**

1. [CMU 15-445 Fall 2025 compression and buffer pool](https://15445.courses.cs.cmu.edu/fall2025/notes/06-storage3.pdf) (CMU 15-445 - Storage, Index and Recovery Sequence) - Lecture #06: Storage Models and Compression, Section 5 Columnar Compression with run-length, bit-packing, bitmap, difference and dictionary schemes, with Lecture #04: Memory Management for buffer-pool structure and replacement. Depth: Use Lecture #06 for encoding schemes and Lecture #04 for pool mechanics. Leave ARC tuning internals for the project code.
2. [PostgreSQL buffer management and dirty-page flushing](https://www.interdb.jp/pg/pgsql08/04.html) (The Internals of PostgreSQL - Buffer Manager, WAL and Recovery) - Chapter 8, Sections 8.4 and 8.6: buffer management mechanisms and dirty-page flushing (page read 2026-10-15). Depth: Read for clock-sweep behavior and flush timing. Skip Section 8.5 on PostgreSQL 18 asynchronous I/O; it is beyond this unit.
3. [Columnar compression and sequential writes](https://dataintensive.net/) (DDIA 2e - Chapter 4 Storage and Retrieval) - Chapter 4, Column-Oriented Storage, printed pp. 136-141 for bitmap encoding, run-length for bitmaps and sorted-column compression, with the sequential-versus-random-writes discussion at printed pp. 129-131.

**Focus**

- Dictionary encoding suits low-cardinality strings. Run-length suits sorted runs. $`\Delta`$ and frame-of-reference suit timestamps and monotonic IDs. Random UUIDs compress poorly under all of them.
- A buffer-pool hit serves from memory with no disk I/O. A miss pays the full device read plus possible eviction and write-back of a dirty victim.
- Sequential access amortizes seek and rotation cost on disks and maximizes prefetch everywhere. Random access pays per-page positioning; NVMe parallelism narrows the gap; your measurement shows how much is left on your machine.
- The Systems units on I/O access patterns and storage devices and on pages, buffer pools and storage layouts taught the mechanisms. Here the new work is encoding detail and measuring your own hit and pattern costs.

**Reproduce:** Compute dictionary savings for 1 million rows over 100 distinct 20-byte strings: a 2,000-byte dictionary plus 1 byte per code is about 1.0 MB against 20 MB raw, roughly 20x. Then measure cached versus cold reads of one 64 MB file on your machine and report both medians and how you made the reads cold, for example `os.posix_fadvise(fd, 0, 0, os.POSIX_FADV_DONTNEED)` on the file before each cold read.

**Traps**

- Claiming compression always speeds queries. It saves I/O but costs CPU; incompressible data pays decode overhead for no byte savings.
- Reading a hot-cache benchmark as device speed. The first cold read after invalidating the page cache is the device number; the rest measure memory.
- Treating SSD random reads as free. They avoid seek physics but still pay per-request addressing and controller limits.

**Practice**

- [CMU 15-445 Fall 2025 Project 1: Buffer Pool Manager](https://15445.courses.cs.cmu.edu/fall2025/project1/) - Buffer pool manager tests including the ARC replacer, disk scheduler and page-guard behavior. Configure with `-DCMAKE_CXX_FLAGS="-include cstdint"` under GCC 15 and strip the `DISABLED_` test prefix to run them.

**Stop when:** You predict the cheaper access for a new column shape and your cached-versus-cold measurement confirms the mechanism.

<details>
<summary>Self-test</summary>

1. Which encoding fits a sorted status column with long runs of equal values?
   - Run-length encoding: each run becomes one value plus a count. Dictionary alone would repeat the same code for every row of the run.
2. A working set fits in the buffer pool, then doubles. What changes at the boundary?
   - Hits turn into misses with eviction churn. Latency jumps from memory speed to device speed plus the write-back cost of dirty victims.
3. Why do LSM flushes and compactions favor sequential I/O?
   - They write whole sorted files at once instead of scattering page overwrites. Sequential streams reach device bandwidth; scattered overwrites pay positioning per page.
4. A benchmark reports 5 GB/s reads from a file that fits in RAM. What does it measure?
   - Page-cache speed, not the device. Size the file above RAM or drop caches between runs to see device behavior.

</details>

#### U10. Read, write and space amplification and their measurement

**About 4 h** · **Target:** Derive + Measure

Topics: Read amplification; Write amplification; Space amplification; Latency, throughput and amplification measurement

Throughput and latency numbers are effects. Amplification ratios are the cause, and they predict how each engine behaves before you benchmark it.

**You can now**

- Define read, write and space amplification as ratios over user bytes.
- Derive page-level write amplification for B-trees and level-driven amplification for LSM trees.
- Measure throughput and latency on your store and explain the result from amplification evidence.

**Study**

1. [HLD Handbook amplification trade-offs](https://github.com/handbook-academy/engineering-handbook/blob/d177ae2b48b4dfebf8ad0ddae51a345b3e17d99e/content/hld/part-4-data-systems/00-storage-engines.md) (HLD Handbook - Storage Engines and Data Structures) - The TL;DR impossibility statement with the B-tree 16-256x and LSM 10-30x write amplification ranges, the B-tree versus LSM write-path diagram, and Trade-offs. Depth: Treat the vendor migration numbers as reported case figures, never as targets. Derive your own ratios in Reproduce.
2. [B-tree versus LSM performance detail](https://dataintensive.net/) (DDIA 2e - Chapter 4 Storage and Retrieval) - Chapter 4, Comparing B-Trees and LSM-Trees, printed pp. 129-131: read paths, Bloom filter limits on ranges, write stalls with backpressure, and sequential versus random writes.

**Focus**

- Write amplification is device bytes per user byte. Read amplification is bytes read per byte requested. Space amplification is disk bytes per live byte.
- A 100-byte update rewriting a 16 KiB page costs about $`164\times`$ at page level before batching. Batching several updates per flush lowers the observed ratio without changing the mechanism.
- Leveled LSM compaction commonly costs 10-30x with about 10% space overhead. Tiered compaction writes less but holds more overlapping runs and transiently doubles disk use.
- You cannot minimize all three at once. Report all three ratios with the workload beside them; a single ratio without workload context proves nothing.

**Reproduce:** Derive page-level write amplification for a 100-byte update in a 16 KiB page: $`16{,}384/100`$, about $`164\times`$. Then size 200,000 writes per second of 200-byte records: 40 MB/s user data, so 10-30x compaction writes 400 MB/s to 1.2 GB/s to the device.

**Traps**

- Quoting one amplification number as the engine constant. Each ratio moves with entry size, batching, level count and workload mix.
- Comparing benchmark numbers across different workloads. Amplification explains the gap only when both sides state entry sizes and read-write mix.
- Crediting Bloom filters for range-query speed. They skip point reads only; ranges still open every overlapping run.

**Practice**

- [HLD Handbook storage-engines exercise: size a 200K writes per second service](https://github.com/handbook-academy/engineering-handbook/blob/d177ae2b48b4dfebf8ad0ddae51a345b3e17d99e/content/hld/part-4-data-systems/00-storage-engines.md) - Exercise: the 200,000 writes per second service with the memtable, block-cache and compaction-strategy solution. Recompute the 40 MB/s bandwidth and the 10-30x device range yourself before opening the solution, then argue the Postgres baseline in your own numbers.

**Stop when:** You derive all three ratios for a new entry size and workload without notes and explain a measured latency from them.

<details>
<summary>Self-test</summary>

1. What are the three amplification ratios as formulas?
   - Write amplification is device write bytes over user write bytes. Read amplification is bytes read over bytes requested. Space amplification is stored bytes over live bytes.
2. A B-tree batches 8 updates of 100 bytes into one 16 KiB page flush. What is the observed write amplification?
   - About $`16{,}384/800`$, or 20x. Batching amortizes the page rewrite across updates; the unbatched page-level cost stays near 164x.
3. An LSM reports 20x write amplification at 40 MB/s ingest. What device bandwidth does compaction consume?
   - About 800 MB/s. The ratio multiplies user bytes into device bytes regardless of which level does the rewriting.
4. Why can two engines with equal write amplification show different p99 read latency?
   - Because read amplification differs. The LSM may check several runs per read while the B-tree touches one page per level, so equal write cost coexists with unequal read cost.

</details>

#### U11. Row versus column layout, columnar files, zone maps and object-storage table metadata

**About 4 h** · **Target:** Explain

Topics: Row versus column layout; Columnar files, zone maps and data skipping; Object-storage table metadata

Analytical copies of transactional data live in object storage as immutable columnar files. Skipping whole files and pages is what makes petabyte scans affordable.

**You can now**

- Explain why analytical queries read fewer bytes from columnar files.
- Describe Parquet row groups, column chunks and footer metadata with the page index.
- Explain how zone maps skip data and how table metadata tracks immutable files.

**Study**

1. [Data storage for analytics](https://dataintensive.net/) (DDIA 2e - Chapter 4 Storage and Retrieval) - Chapter 4, Data Storage for Analytics, printed pp. 134-141: column-oriented storage with the fact-table example, storage and table format with Parquet and Iceberg, and data catalogs.
2. [Parquet file layout and page index](https://parquet.apache.org/docs/file-format/) (Apache Parquet File Format) - File Format: the magic-number, column-chunk, row-group and footer-metadata layout diagram, then the Page Index page with ColumnIndex and OffsetIndex per-page min and max values. Depth: Read layout and page skipping only. Skip thrift field errata and nested-encoding detail; this unit needs the skipping mechanism, not encoder internals.
3. [HLD Handbook OLTP versus OLAP with columnar detail](https://github.com/handbook-academy/engineering-handbook/blob/d177ae2b48b4dfebf8ad0ddae51a345b3e17d99e/content/hld/part-4-data-systems/01-oltp-vs-olap.md) (HLD Handbook - Storage Engines and Data Structures) - Row vs column layout with the byte-count example, then compression tricks and vectorized execution. Depth: Stop at execution internals; query compilation and vectorization are beyond this unit.

**Focus**

- A Parquet file groups rows into row groups and columns into column chunks, with footer metadata naming every chunk location. Readers consult the footer first and fetch only referenced chunks.
- When the writer emits the optional page index, it holds min and max statistics for each page. A predicate skips pages whose range cannot match, which is the zone-map mechanism under its Parquet name.
- Parquet files are immutable once written. A table format tracks which files form a table with schema, snapshots and time travel; a catalog tracks which tables form a database.
- Columnar wins when queries touch few columns across many rows. Point lookups that reassemble full rows across many chunks stay slower than row-store fetches.

**Reproduce:** For a 50-column table with a query over 3 columns, show the scan reads about $`3/50`$ of the row-store bytes before compression, then name which row groups survive a predicate that overlaps only one group's min-max range.

**Traps**

- Treating Parquet files as mutable tables. Files are immutable; inserts and deletes arrive as new files plus table-metadata updates.
- Calling min-max skipping an index lookup. Skipping avoids I/O but still scans the surviving pages; it is not a point-index seek.
- Expecting min-max statistics to skip pages on an unsorted column. When values are spread at random, almost every page range overlaps the predicate, so sort or cluster on the filter column first.

**Practice**

- [HLD Handbook OLTP versus OLAP exercise: split a struggling Postgres service](https://github.com/handbook-academy/engineering-handbook/blob/d177ae2b48b4dfebf8ad0ddae51a345b3e17d99e/content/hld/part-4-data-systems/01-oltp-vs-olap.md) - Exercise: the 500M-row dashboard service with the Postgres plus CDC plus warehouse solution. Recompute the 100 GB raw to 20-30 GB compressed estimate yourself before opening the solution, then name the acceptable lag for your dashboard.

**Stop when:** You sketch the file, page-index and table-metadata layers for a new analytical copy and justify each skipping decision.

<details>
<summary>Self-test</summary>

1. A query filters on a sorted column with per-page min and max values. Which pages are read?
   - Only pages whose min-max range overlaps the predicate. The reader binary-searches ordered ranges or scans unordered ranges and skips the rest.
2. Why does footer-first reading matter for object storage?
   - The footer names every column-chunk offset, so the reader fetches only referenced chunks over range requests instead of downloading whole files.
3. What do a storage format, a table format and a catalog each define?
   - The storage format encodes rows as bytes in files. The table format names which files plus schema form a table with snapshots. The catalog names which tables form a database.
4. A point lookup by key needs the full row. Why might the columnar copy be slower than the row store?
   - It must fetch and stitch one position from every referenced column chunk. The row store reads one contiguous tuple instead.

</details>

#### U12. A crash-safe key-value store with crash and corruption injection and model-based tests

**About 6 h** · **Target:** Implement

Topics: Crash-safe append-only key-value store; Crash injection at every persistence boundary; Corruption injection and terminal failure; Randomized model-based operation tests

This is the section artifact. Every earlier unit lands here: ordered records, sync states, torn tails, scans, indexes, compaction and measured amplification.

**You can now**

- Implement a checksummed append-only key-value store with a declared acknowledgement contract.
- Inject crashes at every persistence boundary and corrupted bytes at every read boundary.
- Test random operation sequences against a dictionary model and fail loudly on divergence.

**Study**

1. [Hypothesis stateful testing](https://hypothesis.readthedocs.io/en/latest/stateful.html) (Hypothesis - Stateful Testing) - Rule-based state machines with `rule`, `invariant`, `Bundle` and `consumes`, including the DatabaseComparison example that tests a store against a `dict` model. Depth: Record the Hypothesis version with every saved failure. The machine proves only the explored interleavings; plant a bug to show it detects the fault class before trusting a pass.
2. [OSTEP data integrity as the corruption spec](https://pages.cs.wisc.edu/~remzi/OSTEP/file-integrity.pdf) (Operating Systems: Three Easy Pieces - Crash Consistency and Data Integrity) - Chapter 45, Sections 45.3 to 45.7: checksums, misdirected writes, lost writes and scrubbing. Depth: Turn each failure mode into one injection point: torn tail, flipped payload bit, misdirected record and lost write.
3. [Build Your Own Redis key-value server as a warm-up](https://build-your-own.org/redis/07_basic_server) (Build Your Own Redis) - Chapter 7, Key-Value Server, with Chapters 8 and 9 for hashtable and serialization behavior. Depth: Use this only for request parsing and in-memory behavior. It defines no acknowledgement or crash contract, so it must not replace your crash-tested store.
4. [Replicated log storage slice as the artifact spec](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-2/replicated-log-stream-processor.md) (Replicated Log and Stream Processor - Storage Slice) - Core requirements on checksummed WAL segments with recovery and atomic metadata publication, plus Milestone A on the local append log with torn and corrupt tail recovery. Depth: Implement the local slice only: segments, indexes, ack states, recovery and atomic metadata. Replication and consensus arrive in later sections.

**Focus**

- Name the ack contract first: which sync backs every success reply. Buffered, flushed and durable acks are separate code paths with separate tests. The Programming units on property, metamorphic and differential testing with shrinking and on regression tests, failure injection and flaky tests taught the tools; here they test a crash contract.
- Inject at every boundary: before and after each append, checksum, flush, index update, manifest swap and ack. A boundary without a crash test is an untested promise.
- Corruption has two outcomes: truncate a corrupt tail that was never acknowledged and continue, or halt on corrupt middle state. Never skip a bad record and keep reading as if the log were whole.
- The `dict` model decides truth for every random sequence. Identical puts, deletes and reads run against both sides; any divergence fails the run with the shrunken sequence kept.

**Reproduce:** From a blank file, build a length-prefixed CRC log with `put`, `get` and `delete` plus an in-memory index, then drive it with a `RuleBasedStateMachine` using `Bundle` keys against a `dict` model. Plant a no-op `delete` bug and show the machine fails; fix it and show the run passes with the seed retained.

**Traps**

- Trusting a green run as proof. The machine covers explored interleavings against your model; an incomplete model or short run hides whole fault classes.
- Fsyncing once per batch but acking per write. Either ack after the shared sync completes or track per-write sync state; mixed accounting loses acknowledged writes.
- Recovering past corruption by skipping. A corrupt tail truncates; corrupt middle state is terminal until an operator or snapshot intervenes.

**Practice**

- The section mini-project covers this: the crash-safe store with injection at every boundary, corruption handling and randomized model-based operation tests.

**Stop when:** Random sequences pass against the model, every injected crash recovers to the ack contract, and corruption either truncates the tail or halts with evidence.

<details>
<summary>Self-test</summary>

1. What must a crash test cover that a normal operation test does not?
   - Every persistence boundary in both orders: crash before and after each append, checksum write, flush, index update, manifest swap and ack, then recovery to the contract state.
2. The model says a key is deleted but the store returns its value. What failed?
   - The implementation diverged from the model on the delete path. Keep the shrunken failing sequence as the regression test and fix the tombstone or index update.
3. Recovery finds a corrupt record with valid records after it. What is the correct behavior?
   - Halt with a terminal corruption error, preserving the evidence. Only a corrupt tail may truncate; skipping middle corruption invents history.
4. Why retain the random seed with every failing sequence?
   - The seed plus the shrunken steps make the failure replayable on any machine. Without them the fault report is an anecdote, not a regression test.

</details>

### Mini-project: Crash-safe segmented storage with defensible acknowledgement boundaries

**About 14 to 20 hours.** Extend `loglab` with a checksummed segmented log and a crash-safe key-value projection in `storage/`. Use independent operation and persistence models to establish recovery before timing anything on your machine, then explain durability, compaction and access costs from retained histories and byte accounting.

1. Define the storage fault model and separate buffered, flushed and durable acknowledgement paths. Build versioned segmented write-ahead records with offsets, bounded lengths and identity-bound checksums; compare scans and key-value operations against independent byte-decoding and dictionary models, retaining record fixtures and state-transition histories.
2. Inject crashes before and after every append, checksum write, flush, sync, index update, manifest publication and acknowledgement, including short, reordered and delayed writes, storage-full and sync errors. Compare recovery with an independent stable-byte model; retain acknowledged-prefix verdicts separating process loss from simulated OS loss.
3. Implement checkpoint-plus-suffix recovery and index rebuild, including crashes during replay. Check against full replay of the trusted record history; retain idempotence, lost-write and misdirected-record tests. Repair only contract-permitted incomplete tails; surface possible acknowledged loss or interior corruption terminally without inventing records.
4. Rebuild hash and sparse indexes, add memtable flushes into sorted runs and Bloom filters. Compare point and range results against full scans, Bloom decisions against exact membership and sizing math; retain split-invariant fixtures and separate CMU B+ Tree single-threaded test results with page-capacity reasoning.
5. Implement projection compaction with retained tombstones, complete synced output files and atomic manifest replacement, including directory sync. Compare recovered live state against uncompacted replay at every publication boundary; retain a planted resurrection failure, its repair and snapshot-retention tests without silently compacting away replayable log records.
6. Choose a layout for point, range and analytical workloads from byte models; contrast columnar skipping with full-scan results and distinguish file, table and catalog metadata. Check compression round trips and buffer ownership on fixed traces; retain separate CMU Buffer Pool Manager results and cache-state protocols.
7. Pass randomized model-based operations and planted-delete regressions, retaining shrunk failures. Then repeat sync-policy, compaction and cache-controlled sequential/random-read comparisons; keep sync/recovery times, latency distributions, throughput, resource use, read/write/space amplification and observer overhead, reconciled with byte ledgers, versions, workloads and cache-state evidence.

**Deliverables**

- The segmented WAL, key-value projection, checkpoint recovery, rebuildable indexes and crash-safe compaction, with acknowledgement and replay-retention contracts.
- Independent dictionary and stable-byte models, exhaustive boundary fault fixtures, shrunk regressions, raw WAL histories and separate public-suite results.
- A repeated measurement dossier with byte ledgers, cache-state evidence, durability limitations and retained policy trade-offs.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [CMU 15-445 Fall 2025 Project 2: B+ Tree](https://15445.courses.cs.cmu.edu/fall2025/project2/). Retain single-threaded insert, delete, iterator and tombstone-buffer results from the unit; your log indexes still need independent full-scan checks.
- external-tests: [CMU 15-445 Fall 2025 Project 1: Buffer Pool Manager](https://15445.courses.cs.cmu.edu/fall2025/project1/). Keep ARC, disk scheduler and page-guard results separately from your store's crash, cache-state and ownership tests.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Acknowledgement and recovery | Own crash tests agree with the independent stable-byte model at every persistence boundary. The acknowledged-prefix contract survives permitted faults; unrepairable corruption halts with evidence rather than fabricated success. | Delayed sync, failed sync and repeated recovery expose naive durability claims; a documented simulation-versus-filesystem boundary limits what process-kill evidence can establish. |
| Projection and indexing | Own dictionary and full-scan checks match randomized operations, rebuilt indexes and sorted runs. Exact membership catches Bloom false negatives; sizing calculations and page invariants have independent fixtures. | A planted delete or index defect produces a shrunk failing sequence, fails before repair and remains a deterministic regression across restart and flush. |
| Publication and deletion | Own boundary tests recover old or new complete manifests and match uncompacted replay. A planted tombstone-resurrection defect fails; snapshot and log-retention contracts name which older versions must remain readable. | Crashes combined with orphan cleanup or retained snapshots expose an unsafe reclamation; repaired tests preserve both live-state correctness and declared replay availability. |
| Cost and scope | Correctness gates precede repeated measurements. Independent byte ledgers reconcile amplification and skipping; reports name versions, workloads, cache preparation and observer overhead, separating logical I/O from device-traffic claims. | Group-commit or compaction comparisons retain a losing regime; recovery time is explained by replayed bytes and sequential-versus-random read costs without claiming a universal winner. |

Feeds into: Segments, offsets, persistence events, checkpoint recovery and acknowledged-prefix oracles feed replication and consensus; manifests, retained-log contracts and corruption fixtures feed stream replay, backup, restore and the capstone's storage-fault evidence.

### Resource route

- **Primary - Course and project:** [CMU 15-445 - Storage, Index and Recovery Sequence](https://15445.courses.cs.cmu.edu/fall2025/schedule.html) - Follow Fall 2025 lectures 3 to 10 and 21 to 22. Do the BusTub projects from tag v20251119-2025fall (https://github.com/cmu-db/bustub/tree/v20251119-2025fall): P1 (ARC replacer, disk scheduler and buffer pool manager) and P2 (B+ tree with a leaf tombstone buffer), with P0 (Count-Min Sketch) as the C++ warm-up. Tests ship with a `DISABLED_` prefix to remove, and GCC 15 needs `-DCMAKE_CXX_FLAGS="-include cstdint"` at configure time. Use the storage and recovery homework for WAL reasoning, and keep C++ scope bounded to storage and recovery.
- **Support - Reference:** [Hypothesis - Stateful Testing](https://hypothesis.readthedocs.io/en/latest/stateful.html) - Use `RuleBasedStateMachine` with rules, bundles and invariants to drive your store and a dictionary model with the same random operation sequences, and check the machine catches a planted bug before trusting a pass.
- **Required - Book:** [DDIA 2e - Chapter 4 Storage and Retrieval](https://dataintensive.net/) - Read "Storage and Indexing for OLTP" (log-structured storage, B-trees, their comparison and secondary indexes) and "Data Storage for Analytics" (column-oriented storage). Its Bloom filter, tombstone and write-ahead log coverage is brief, so take those from OSTEP and The Internals of PostgreSQL. Build a workload decision table, then connect each claim to a measurement from your small store.
- **Optional - Practice:** [Building Distributed Systems - The Logger and Indexes](https://builddistributedsystem.com/tracks/logger) - Only the first three tasks are free (a write-ahead log, its recovery and log segments). Tasks are graded in the browser after login, so treat a pass as a drill and keep your local harness as the evidence. 
- **Required - Reference:** [HLD Handbook - Storage Engines and Data Structures](https://github.com/handbook-academy/engineering-handbook/tree/main/content/hld) - Read Part 0 data structures plus Part 4 storage engines and OLTP versus OLAP. Use its exercises for comparison, while the CMU project and local fault tests remain the implementation evidence.
- **Support - Reference:** [The Internals of PostgreSQL - Buffer Manager, WAL and Recovery](https://www.interdb.jp/pg/) - Read Chapter 1 Sections 1.2 to 1.4 (heap pages and tuples), Chapter 8 (buffer manager and dirty-page flushing) and Chapter 9 Sections 9.1 to 9.8 (WAL segments, XLOG records, checkpoints and recovery). Compare each mechanism with your simplified store. The site is revised often, so note the date you read it.
- **Support - Reference:** [PostgreSQL 18 Documentation - WAL Configuration and Internals](https://www.postgresql.org/docs/18/wal-configuration.html) - Read "WAL Configuration" (checkpoints and the redo point crash recovery starts from), "WAL Internals" and "Reliability" for the official, versioned statement of the write-ahead and durability contract.
- **Required - Book:** [Operating Systems: Three Easy Pieces - Crash Consistency and Data Integrity](https://pages.cs.wisc.edu/~remzi/OSTEP/file-journaling.pdf) - Read Chapter 42 (FSCK and journaling: the crash scenarios, data and metadata journaling and their write order) and Chapter 45 (data integrity: checksums, misdirected and lost writes, scrubbing; https://pages.cs.wisc.edu/~remzi/OSTEP/file-integrity.pdf). Turn each crash scenario into an injection point in your store.
- **Support - Paper:** [ARIES: A Transaction Recovery Method (Mohan et al., 1992)](https://cs.stanford.edu/people/chrismre/cs345/rl/aries.pdf) - Read the introduction, the overview and restart processing (analysis, redo by repeating history, undo) and the page LSN rule. The rest is 1992 storage detail beyond this section.
- **Optional - Practice:** [Build Your Own Redis](https://build-your-own.org/redis/) - Use the persistence and data-structure portions only if a second implementation is needed to cement parsing, indexing or append-log behavior. Do not replace the crash-tested stage artifact with tutorial completion.
- **Support - Project:** [Replicated Log and Stream Processor - Storage Slice](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-2/replicated-log-stream-processor.md) - Implement checksummed segments, indexes, acknowledgement states, recovery, retention and atomic metadata changes. Preserve every crash schedule and corrupted artifact needed to reproduce a failure.
- **Support - Reference:** [Apache Parquet File Format](https://parquet.apache.org/docs/file-format/) - Read the File Format layout (row groups, column chunks, footer metadata) and the Page Index page (ColumnIndex and OffsetIndex with per-page min and max values for page skipping). Use it only for file layout and skipping; it does not cover table metadata or catalogs.
- **Support - Reference:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html) - Read the DESCRIPTION for what `fsync` and `fdatasync` guarantee and the directory-sync requirement for new file names, and the ERRORS section for what an `EIO` from write-back can refer to.

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

### Study units

#### U1. Leader-follower, multi-leader and leaderless replication

**About 4 h** · **Target:** Explain

Topics: Leader-follower replication; Multi-leader replication vocabulary; Leaderless replication vocabulary

The Systems unit on replication, quorums and consensus vocabulary named the pieces. Here the new work is turning each topology into an operation path and finding exactly where writes can diverge.

**You can now**

- Trace a write and its acknowledgement through each of the three replication topologies.
- Choose write authority, read routing and conflict handling for a disconnected client.
- Explain why a coordinator in a leaderless store is not an ordering leader.

**Study**

1. [DDIA, 2nd edition: the three replication architectures](https://dataintensive.net/) (DDIA 2e - Chapter 6 Replication and Chapter 10 Consistency Sections) - Chapter 6, Replication: Single-Leader Replication, pp. 198 to 200; Multi-Leader Replication through Sync Engines and Local-First Software, pp. 215 to 222; Leaderless Replication, pp. 229 to 230. Depth: Review the single-leader path from Systems briefly. Read the multi-leader topology and local-first discussion closely; stop before Dealing with Conflicting Writes.

**Focus**

- Separate write authority from network shape. Several shard leaders are not several leaders for the same key.
- An asynchronously connected multi-leader store can acknowledge conflicting writes independently. It needs both dissemination and a conflict policy.
- A leaderless coordinator gathers replica responses. That role alone does not impose a common write order.
- Loop suppression and dependency ordering are different jobs. Deduplicating a forwarded update does not ensure that its prerequisite has arrived.

**Reproduce:** Draw three local replicas and two clients, with a partition separating one replica from the others. For each topology, trace two writes to the same key and a subsequent read on each side. Mark who may acknowledge, which replicas hold each version, and which read outcomes depend on an as-yet-unspecified conflict or quorum rule. Do not give a topology a consistency label until those rules are stated.

**Traps**

- Calling all-to-all forwarding leaderless when each node independently orders and accepts local writes as a leader.
- Assuming an extra replica improves write availability when the acknowledgement rule still waits for every replica.
- Treating a topology diagram as a durability or freshness contract.

**Practice**

- The section mini-project covers this: configurable write authority and read routing in the local loglab replicated-store model, with topology-specific partition histories.

**Stop when:** Your three path diagrams identify every acknowledgement and divergent version, and you can state which missing policy prevents predicting a read result.

<details>
<summary>Self-test</summary>

1. Does a client contacting only one coordinator imply single-leader replication?
   - No. The coordinator may fan out to interchangeable replicas without assigning a common order. Write authority and ordering, not the client connection count, distinguish the designs.
2. Can a disconnected multi-leader replica accept edits without proving that they preserve a global uniqueness constraint?
   - Yes, but accepting edits independently does not enforce unrestricted global uniqueness. The design needs coordination, preallocated disjoint authority, or an explicit conflict outcome.
3. Why can an insert and a dependent update arrive in the wrong order in an all-to-all topology?
   - They can travel over different links with different delays. Redundant paths do not themselves carry or enforce the dependency.

</details>

#### U2. Synchronous and asynchronous acknowledgement, replication logs, positions and lag

**About 4 h** · **Target:** Explain + Measure

Topics: Synchronous versus asynchronous acknowledgement; Replication logs, positions and lag

The local durability boundary from Storage engines and recovery is only one step in a replicated write. Separate received, persisted and applied positions before claiming what survives a crash or what a follower read can see.

**You can now**

- Specify receipt, persistence and application as separate acknowledgement boundaries.
- Compare statement, physical and logical replication logs for deterministic replay and version coupling.
- Measure position lag without misreporting it as elapsed-time staleness.

**Study**

1. [DDIA, 2nd edition: acknowledgement and log representation](https://dataintensive.net/) (DDIA 2e - Chapter 6 Replication and Chapter 10 Consistency Sections) - Chapter 6, Replication: Synchronous Versus Asynchronous Replication, pp. 200 to 201; Implementation of Replication Logs, pp. 206 to 208; Monitoring staleness, pp. 234 to 235.

**Focus**

- Synchronous says the leader waits for a specified replica event, not that every copy is durable or queryable. Name that event and the replicas required.
- Statement replay needs deterministic inputs and ordering. A physical log couples replicas to storage format; a logical log describes changes at a less storage-specific boundary.
- Compare positions only within the same log lineage and in the same units. Byte positions, record counts and time lag are different metrics.
- A follower can have received or persisted a suffix that it has not applied. Read routing must use the boundary relevant to visibility.

**Reproduce:** In Python 3, model a single ordered log with six records and no failover. Give a follower received, persisted and applied positions of 6, 4 and 2. Assert that its durable backlog relative to the leader's durable position 6 is two records, while its unapplied backlog is four. Crash the follower by clearing volatile state, recover through position 4, then replay the suffix. Keep separate counters rather than a single lag value. These are record positions, not seconds.

**Traps**

- Inferring read visibility from a persistence acknowledgement without waiting for application.
- Subtracting positions across diverged leader histories after failover.
- Reporting zero position lag as zero wall-clock read latency or as proof that no writes were lost.

**Practice**

- The section mini-project covers this: separate receive, persist, apply and acknowledgement events, with record-lag measurements and a crash between receipt and persistence.

**Stop when:** Your trace distinguishes the two-record durable backlog from the four-record unapplied backlog and shows which acknowledgement modes survive the injected crash.

<details>
<summary>Self-test</summary>

1. A follower confirms receipt in memory. Does that confirm survival of its process crash?
   - No. The contract must require stable storage if the acknowledgement is meant to survive that crash. Receipt alone is insufficient.
2. Can two replicas execute the same timestamp-producing statement and diverge?
   - Yes, if each evaluates a nondeterministic time function independently. Replicate its chosen result or otherwise make execution deterministic.
3. Why can a follower be 100 records behind without a known time lag?
   - Record positions do not encode elapsed time. You need write timing and an explicit visibility boundary; the workload may be bursty or idle.

</details>

#### U3. Failover, stale-leader risk and replica rejoin and replacement

**About 4 h** · **Target:** Explain + Implement

Topics: Failover and stale-leader risk; Replica rejoin and replacement

The earlier units on incarnation numbers and on leases and fencing tokens built the identity and authority checks. Here the test is whether those boundaries survive promotion, divergent logs and replica replacement, not whether a timeout elects a leader.

**You can now**

- Construct a failover history that loses an asynchronously acknowledged write.
- Implement a snapshot-position and suffix catch-up path for a replacement replica.
- Reject stale authority and distinguish a returning replica from an empty replacement.

**Study**

1. [DDIA, 2nd edition: bootstrap, catch-up and promotion](https://dataintensive.net/) (DDIA 2e - Chapter 6 Replication and Chapter 10 Consistency Sections) - Chapter 6, Replication: Setting Up New Followers, pp. 201 to 202; Handling Node Outages, pp. 204 to 206; Chapter 10, Consistency and Consensus: Implementing Linearizable Systems, pp. 411 to 413. Depth: Skip the object-storage architecture sidebar on pp. 202 to 203. Read the Chapter 10 passage for stale-leader and lost-write boundaries, not a consensus implementation.

**Focus**

- A snapshot needs an exact position in a particular log lineage. Copying files while writes continue is not a consistent bootstrap procedure.
- A replica missing retained history needs a new snapshot. A replacement must not inherit the old process's acknowledgements merely by reusing its address.
- A timeout supplies suspicion, not exclusive authority. In this model, an explicit controller changes the epoch and the mutation boundary enforces it; distributed election comes later.
- A rejoining old leader may carry an acknowledged but unreplicated suffix. Preserve that evidence before discarding, reconciling or rejecting it according to the contract.

**Reproduce:** Using Python 3 and an explicit controller, acknowledge a write on the old leader while replication is blocked. Promote a follower that lacks it, then read the old value. Record the resulting linearizability violation. Rejoin the old leader with its divergent suffix: block its writes using the current epoch, preserve the discarded suffix in the evidence, and rebuild it from a consistent snapshot plus the new leader's suffix. Repeat bootstrap with an empty replacement and with a gap in retained history; require a fresh snapshot for the gap.

**Traps**

- Treating the largest numeric offset as freshest when two leaders have different log lineages.
- Generating a higher epoch locally without an authority that prevents competing promotions.
- Letting an empty replacement count toward a quorum before transferring the data that earlier acknowledgements depended on.

**Practice**

- The section mini-project covers this: controller-driven promotion, stale-epoch rejection, divergent-leader rejoin and empty-replica snapshot bootstrap in loglab.

**Stop when:** Your tests expose the lost-write history, reject the stale leader, and rebuild both a returning replica and an empty replacement without skipping a log gap.

<details>
<summary>Self-test</summary>

1. Does fencing the old leader recover its lost acknowledged write?
   - No. Fencing prevents future stale-authority effects. It cannot supply data that the promoted follower never received.
2. Why must a snapshot carry its replication-log position?
   - The new replica needs to know exactly where replay begins. Otherwise it may omit updates or apply updates already reflected in the snapshot.
3. A follower requests a suffix that has been deleted. Can it safely skip to the current end?
   - No. That would omit state changes. Transfer a consistent snapshot and then replay the retained suffix belonging to it.

</details>

#### U4. Stale reads, read-your-writes and monotonic read and write guarantees

**About 4 h** · **Target:** Explain + Implement

Topics: Stale reads and monotonicity; Read-your-writes session guarantees; Monotonic reads and writes

The Systems unit on consistency models and conflict resolution classified session histories. Here the new work is the eligibility test, including what happens when no reachable replica contains the session's dependencies.

**You can now**

- Separate read-your-writes, monotonic reads, monotonic writes and writes-follow-reads using histories.
- Implement a session frontier that routes or waits for a sufficiently advanced replica.
- Diagnose a session violation after rerouting or losing client context.

**Study**

1. [DDIA, 2nd edition: replica routing for sessions](https://dataintensive.net/) (DDIA 2e - Chapter 6 Replication and Chapter 10 Consistency Sections) - Chapter 6, Replication: Problems with Replication Lag through Solutions for Replication Lag, pp. 209 to 215. Depth: Use the familiar stale-read examples as routing tests, not a second introduction. Stop before Multi-Leader Replication.
2. [Terry et al. (1994): session contracts and enforcement](https://www.cs.cornell.edu/courses/cs734/2000FA/cached%20papers/SessionGuaranteesPDIS_1.html) (Session Guarantees for Weakly Consistent Replicated Data (Terry et al., 1994)) - Sections 3.1 to 3.4, the four guarantees; Section 4, Providing the guarantees; Section 5, Practical implementation of the guarantees, including Figure 1.

**Focus**

- Read-your-writes requires a read view that includes the session's prior writes, not necessarily their unchanged values after other writes supersede them.
- Monotonic reads tracks previously observed history. Monotonic writes orders the session's writes at replicas; writes-follow-reads carries dependencies from reads into later writes.
- Use an applied log position for a single ordered lineage or a dependency vector for multiple origins. A frontier must describe a complete prefix, not merely the largest event observed.
- The paper's enforcement relies on ordered propagation and session metadata. If no eligible replica is reachable, preserve the guarantee by waiting or failing rather than silently using a stale one.

**Reproduce:** In a Python 3 model of one log lineage, implement a session token storing the greatest required applied position. After the session writes at position 4, offer replicas applied through positions 2 and 5: only the second is eligible for a read-your-writes read. After reading through position 5, reject the first replica for monotonic reads even if the session made no new write. For monotonic writes, delay a second write at a new replica until its first write is included. Preserve the token across rerouting, then erase it deliberately and retain the violating trace.

**Traps**

- Using sticky routing as a complete guarantee when the chosen replica can restart, roll back or be replaced.
- Comparing returned numeric values to test monotonic reads. A later legitimate write may lower the value.
- Confusing the order in which the client sends writes with the order in which every replica exposes them.

**Practice**

- [AlgoMaster: Route Session-Consistent Replica Reads](https://algomaster.io/practice/system-design/route-session-consistent-replica-reads) - `recordWrite`, `advanceReplica` and `routeRead`: a replica is eligible for read-your-writes only when its applied LSN reaches the session's greatest write LSN, with the primary as the fallback. Premium, on a subscription the learner owns. The judge falls back to the primary; your loglab router should also offer waiting or failing, and add monotonic reads and context loss on rerouting.
- [AlgoMaster: Validate Session Consistency](https://algomaster.io/practice/system-design/validate-session-consistency) - `isConsistent` over one session history of per-key versioned reads and writes, checking read-your-writes and monotonic reads. A free warm-up. It tracks a per-key high-water version, not a log prefix, so it cannot express monotonic writes or writes-follow-reads.

**Stop when:** Your session tests reject an ineligible replica after both a write and a read, and distinguish monotonic-write ordering from read-your-writes visibility.

<details>
<summary>Self-test</summary>

1. Can a session satisfy monotonic reads while always reading stale data?
   - Yes. Its observed histories must not move backward, but they need not be globally current.
2. Does read-your-writes alone require a replica serving a later write to include all earlier reads?
   - No. Writes-follow-reads carries those read dependencies into the write. Read-your-writes constrains subsequent reads relative to the session's writes.
3. Why can satisfying a session guarantee reduce availability after a partition?
   - The reachable replicas may lack the required history. Serving them immediately would violate the guarantee, so the operation must wait, fail, or reach an eligible replica.
4. Does a write on a phone automatically enter the browser's session token?
   - No. Cross-device guarantees need a shared or transferred session context. A common user name alone does not transfer dependencies.

</details>

#### U5. Linearizability as a history property and sequential consistency

**About 4 h** · **Target:** Derive

Topics: Linearizability as a history property; Sequential consistency

The Systems unit on consistency models and conflict resolution classified simple stale reads. Here the new work is the history definition that a checker must implement, including why all reads must fit one order rather than each choosing a convenient replica view.

**You can now**

- Derive a legal sequential witness or an ordering contradiction for a register history.
- Distinguish process-order constraints from real-time precedence.
- Explain per-object composition and the treatment of incomplete operations.

**Study**

1. [Herlihy and Wing (1990): definition and locality](https://pdos.csail.mit.edu/6.824/papers/p463-herlihy.pdf) (Linearizability: A Correctness Condition for Concurrent Objects (Herlihy and Wing, 1990)) - Sections 1 through 3.1, printed pp. 463 to 471; concentrate on 2.1 Histories, 2.2 Definition of Linearizability and Theorem 1 in 3.1 Locality. Depth: Stop before Section 3.2. Translate the queue examples into ordering constraints; do not implement a concurrent queue.
2. [Jepsen: sequential consistency](https://jepsen.io/consistency/models/sequential) (Jepsen Consistency Models) - Sequential Consistency and Formally (page read 2026-10-15).
3. [MIT 6.5840 Spring 2026, Lecture 8: Consistency, Linearizability](https://pdos.csail.mit.edu/6.824/notes/l-linearizability.txt) (MIT 6.5840 - Consistency, Linearizability and Replication Papers) - definition: a history through example 6, including the serial register specification. Depth: Answer each history question before reading its discussion. In example 3, the sentence saying no assignment works for example 2 is a numbering typo: example 2 permits the old read; example 3 is the contradictory history.

**Focus**

- Both models need a legal total order that preserves each process's program order. Linearizability also preserves every response-before-invocation edge across processes.
- An incomplete operation can be completed in an extension or omitted when forming the complete history. Never require its effect to be absent just because its client timed out.
- Locality lets linearizable object histories compose. It does not turn separate calls into an atomic multi-object transaction.
- The Systems unit on threads, interleavings and memory consistency taught program order. Do not equate distributed register semantics with a language's relaxed memory model.

**Reproduce:** Start a register at 0, with exactly one write of 1 and one write of 2 by separate clients. Both writes remain pending while reader P reads 1 then 2, and reader Q reads 2 then 1; all four reads complete before either write returns. Derive why no sequentially consistent order exists: P forces the write of 1 before the write of 2, while Q forces the reverse. Then remove Q's reads and give a legal linearization of the remaining history. Separately, consider just a completed write of 1 followed in real time by another client's read of 0, initially 0: explain why sequential consistency can permit that history while linearizability cannot.

**Traps**

- Checking each read independently. A collection of individually plausible reads can have no common legal order.
- Sorting calls by invocation time or server log time and treating that one order as the definition.
- Claiming that a clean finite history proves the implementation linearizable for all executions.

**Practice**

- [Cambridge Concurrent and Distributed Systems: Exercise 20](https://www.cl.cam.ac.uk/teaching/2122/ConcDisSys/dist-sys-notes.pdf) - Michaelmas 2021/22, Section 7.2: Exercise 20 on p. 74 and its execution diagram on p. 75. First draw real-time and value-order edges. Give a witness or contradiction before consulting the Section 7.2 discussion. This is a paper exercise, not an autograded test.

**Stop when:** You solve Exercise 20 with explicit ordering constraints and can separate a sequential-consistency witness from a linearizability witness without relying on server internals.

<details>
<summary>Self-test</summary>

1. Can sequential consistency put a read before another client's already completed write?
   - Yes, if it preserves each process's program order and the register specification. Linearizability additionally enforces the cross-process real-time edge.
2. Why does removing Q make the pending-writes example legal?
   - The order write 1, P's read of 1, write 2, P's read of 2 fits all intervals and the object specification. Q supplied the contradictory order.
3. Is an operation's actual internal execution instant needed to check linearizability?
   - No. The observed history needs some legal order with points inside invocation-response intervals. The witness need not identify the implementation's actual instant.
4. What does the locality theorem not provide for two separately linearizable account registers?
   - It does not make a debit and credit across them one atomic transfer. That requires a specification and mechanism for the combined operation or transaction.

</details>

#### U6. Causal and eventual consistency, convergence and CRDT vocabulary

**About 4 h** · **Target:** Explain

Topics: Causal consistency; Eventual consistency and convergence; State-based and operation-based CRDT vocabulary

Convergence answers whether copies agree after propagation, not whether intermediate observations preserve dependencies. Use a concrete causal+ design to separate those two obligations.

**You can now**

- Reject a causal-visibility violation even when all replicas eventually converge.
- State the propagation and conflict-resolution assumptions behind eventual convergence.
- Distinguish state-based merge from operation-based delivery and their convergence requirements.

**Study**

1. [DDIA, 2nd edition: convergence versus dependency order](https://dataintensive.net/) (DDIA 2e - Chapter 6 Replication and Chapter 10 Consistency Sections) - Chapter 6, Replication: Consistent prefix reads, pp. 213 to 214; Automatic conflict resolution through Conflict-free replicated datatypes and operational transformation, pp. 226 to 228.
2. [Lloyd et al., COPS (SOSP 2011): causal+ and dependency checks](https://www.cs.cmu.edu/~dga/papers/cops-sosp2011.pdf) (Don't Settle for Eventual: Scalable Causal Consistency for Wide-Area Storage with COPS (Lloyd et al., 2011)) - Section 3.1 Definition, Section 3.3 Causal+ in COPS, Sections 4.1 to 4.3, including Figure 6. Depth: Stop before COPS-GT. Track dependency metadata and remote visibility; do not build a multi-datacenter deployment.
3. [Preguica, Baquero and Shapiro (2018): CRDT synchronization vocabulary](https://arxiv.org/abs/1805.06358) (Conflict-free Replicated Data Types (Preguica, Baquero and Shapiro, 2018)) - Synchronization Model, printed pp. 6 to 7, covering state-based and operation-based replication. Depth: Vocabulary only. Defer a full CRDT implementation and proofs to the linked later unit.

**Focus**

- A receiver may need to hold a dependent version until its prerequisites are visible. Delivery order and visibility order need not be identical.
- Causal+ means causal consistency plus convergent conflict handling. COPS's datacenter-local linearizability is an architectural choice, not the definition of causal+.
- State-based CRDTs use inflationary updates and a join on a semilattice; associative, commutative and idempotent merge tolerates reordering and duplicates when state eventually propagates.
- Operation-based CRDTs need reliable effect dissemination and the stated ordering assumptions. Commuting concurrent effectors does not make repeated application of a non-idempotent effect harmless.

**Reproduce:** Draw a post write, another client's read of that post, and that client's reply write. Deliver the reply before the post to a third replica. Show that immediate reply visibility violates causality even if later propagation makes all replicas agree; then add a dependency check that delays visibility. Separately, merge grow-only counter states $`(2,0)`$ and $`(0,3)`$ by componentwise maximum: both orders and a duplicate merge give $`(2,3)`$, whose query is 5. Explain why adding the two whole states repeatedly would double-count.

**Traps**

- Calling eventual convergence a bound on staleness or a guarantee during a permanent partition.
- Assuming every CRDT provides causal reads across independently replicated objects.
- Calling reliable delivery sufficient for an increment effector when duplicates may be applied twice.

**Practice**

- [Gossip Glomers Challenge 4: Grow-Only Counter](https://fly.io/dist-sys/4/) - Specification, Service: seq-kv and Evaluation; three local nodes with the g-counter workload and partition nemesis. Use Go and Maelstrom v0.2.4 on your machine; record the actual installed version. The page was tested on 0.2.3. Start from its stateless counter contract over sequentially consistent storage, not an assumed in-memory CRDT requirement. The checker checks successful final reads against confirmed and possible indeterminate increments; it does not establish intermediate-read linearizability. Keep the run history and add your own dependency-visibility test in loglab.

**Stop when:** Challenge 4 passes its final-count check, you explain its weaker intermediate-read contract, and your post/reply trace distinguishes eventual agreement from causal visibility.

<details>
<summary>Self-test</summary>

1. Can two independent concurrent writes appear in different orders under causal consistency?
   - Yes. Causality alone does not order independent writes. A separate convergence policy determines how conflicting versions are reconciled.
2. Why is componentwise maximum idempotent but repeated addition is not?
   - Taking the maximum with the same component again changes nothing. Adding it again counts that contribution again.
3. Does an operation-based CRDT always require causal delivery?
   - No. Requirements depend on its effectors. Causal delivery plus commuting concurrent effectors is a common sufficient condition; without ordering, all reordered effectors must commute. Duplicate application needs a separate argument.
4. What extra property does causal+ name beyond causal consistency?
   - Convergence through consistent conflict handling. It does not mean linearizability or bounded replication lag.

</details>

#### U7. Availability under partition, quorum intersection and its membership assumptions

**About 5 h** · **Target:** Derive

Topics: Availability under partition; Read and write quorum intersection; Membership assumptions behind quorum arithmetic

The Systems unit on replication, quorums and consensus vocabulary derived set overlap. Here the new work is showing why overlap is not a register protocol, then deriving ABD's version rule and read write-back.

**You can now**

- Derive the fixed-membership intersection bound and identify where its data-retention premise fails.
- Construct a new-then-old read history despite intersecting quorums.
- Derive the partition availability contradiction for a linearizable register.

**Study**

1. [DDIA, 2nd edition: quorum limitations and the read inversion](https://dataintensive.net/) (DDIA 2e - Chapter 6 Replication and Chapter 10 Consistency Sections) - Chapter 6, Replication: Using quorums for reading and writing and Understanding the limitations of quorum consistency, pp. 231 to 234; Chapter 10, Consistency and Consensus: Implementing Linearizable Systems through The Unhelpful CAP Theorem, pp. 411 to 416, especially Figure 10-6. Depth: Stop before Linearizability and network delays. Do not use the incident percentages as workload assumptions.
2. [Gilbert and Lynch (2002): the asynchronous impossibility argument](https://users.ece.cmu.edu/~adrian/731-sp04/readings/GL-cap.pdf) (Brewer's Conjecture and the Feasibility of Consistent, Available, Partition-Tolerant Web Services (Gilbert and Lynch, 2002)) - Sections 2.1 to 2.3; Section 3.1, Theorem 1 and Corollary 1.1; Sections 4.1 to 4.3 under Partially Synchronous Networks. Depth: Follow the partition execution proof, then compare the changed timing assumptions in Section 4. Stop before Section 4.4, Weaker Consistency Conditions.
3. [Cambridge notes: ABD as a quorum protocol](https://www.cl.cam.ac.uk/teaching/2122/ConcDisSys/dist-sys-notes.pdf) (Cambridge Concurrent and Distributed Systems Notes (Kleppmann) - Replication and Linearizability) - Michaelmas 2021/22, Section 7.2, pp. 69 to 73, through Exercise 19. Depth: Use the single-writer register algorithm as the derivation boundary. Do not generalize it to compare-and-set or transactions.

**Focus**

- For one replica universe of size $`N`$, read and write response sets satisfy $`|Q_r \cap Q_w| \ge R + W - N`$. Overlap needs the same membership and retained acknowledged versions.
- A read may reveal a partially propagated write before any write quorum completes. A later read can miss it unless the read protocol stabilizes the version before returning.
- ABD uses ordered versions and a quorum write-back during reads. Set intersection is one part of that argument, not a replacement for it.
- CAP availability requires every request received by a non-failing node eventually to receive the specified operation response, in every fair execution including lossy ones. Errors or timeouts do not satisfy a successful register operation contract.

**Reproduce:** With three fixed replicas initially 0, start a write of 1 that reaches only replica A and remains pending. A read of A and B returns 1; after it completes, a read of B and C returns 0. Derive the linearizability contradiction even though the configured write threshold is three and read threshold is two. Add a synchronous quorum write-back of the greatest ordered version before returning the first read, and show why every later size-two read intersects it. Then reproduce the CAP contradiction: complete a write on one side of a permanent partition and invoke a read on the isolated side, whose observations are indistinguishable from an execution with no write.

**Traps**

- Using quorum arithmetic across old and new memberships without a transition protocol or state transfer.
- Treating a process that restarted without its acknowledged data as the same durable quorum participant.
- Using an observed success fraction as the theorem's universal availability definition.

**Practice**

- [Cambridge Concurrent and Distributed Systems: Exercise 19](https://www.cl.cam.ac.uk/teaching/2122/ConcDisSys/dist-sys-notes.pdf) - Michaelmas 2021/22, Section 7.2, Exercise 19 on p. 73: give pseudocode for ABD. Derive the single-writer algorithm from the stated register contract. Annotate where it waits for quorums and why the read's second phase is necessary. The section mini-project tests the no-write-back counterexample against your checker; the exercise has no public autograder.

**Stop when:** Your ABD pseudocode explains each quorum phase, and you can derive both the pending-write inversion and the partition contradiction without claiming that overlap alone proves linearizability.

<details>
<summary>Self-test</summary>

1. For five fixed replicas with three read and three write responses, what does intersection prove?
   - The response sets share at least one member. It does not alone prove correct version selection, stability across failures, or linearizability.
2. Why does the pending-write inversion violate linearizability even though the write never completed?
   - The first read of 1 forces that write before it in any legal completion. Real time places the second read later, so returning 0 without another write is impossible.
3. Does an arbitrarily long but finite delay alone force a safety violation?
   - No. A linearizable system may wait. The impossibility combines the safety requirement with availability in all permitted executions, including a partition that prevents the needed communication indefinitely.
4. What does synchronous read write-back add to mere read quorum overlap?
   - It places the observed greatest version on a quorum before exposing it, preventing a later intersecting read from missing that version under the algorithm's version and retention rules.

</details>

#### U8. Sloppy quorums, hinted handoff and read repair

**About 4 h** · **Target:** Explain + Implement

Topics: Sloppy quorums and hinted handoff; Read repair

Fallback replicas keep accepting work when home replicas are unreachable, but change the contract behind the quorum calculation. Repair must carry both version metadata and the identity of the replica that missed the write.

**You can now**

- Construct disjoint sloppy response sets despite apparently sufficient read and write thresholds.
- Implement hints with intended-recipient identity and retry-safe handoff.
- Implement version-aware read repair and identify keys it cannot repair without reads.

**Study**

1. [DDIA, 2nd edition: the repair mechanisms and fallback replicas](https://dataintensive.net/) (DDIA 2e - Chapter 6 Replication and Chapter 10 Consistency Sections) - Chapter 6, Replication: Catching up on missed writes, p. 231; Single-Leader Versus Leaderless Replication Performance, pp. 235 to 236.
2. [Dynamo (SOSP 2007): sloppy quorum and hinted handoff](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf) (Dynamo: Amazon's Highly Available Key-value Store (DeCandia et al., 2007)) - Sections 2.1 to 2.3 for the shopping-cart requirements; Sections 4.2 to 4.3 for preference lists and replication; Sections 4.5 to 4.6 for request execution, sloppy quorum and hinted handoff. Depth: Track the per-key home replica set and substitute healthy nodes. Do not implement consistent hashing here; use a fixed preference list.

**Focus**

- Dynamo's sloppy quorum selects healthy nodes from a preference list. Those nodes need not be the fixed home replicas to which a later read goes.
- A hint records the mutation and its intended recipient. Preserve it until the recipient acknowledges the declared handoff boundary; duplicate delivery must be harmless.
- Repair must reconcile versioned values, concurrent siblings and deletions. Never replace a sibling set merely because a replica answered first.
- Read repair repairs accessed data. Handoff repairs retained hints. Neither guarantees that an unread key whose hints were lost will converge.

**Reproduce:** Give a key home replicas A, B and C, with fallbacks D and E. During a partition, acknowledge a write using A and D. Later read B and C while handoff is delayed: both still return the initial value, although both thresholds are two and the home replication factor is three. In Python 3, store a hint on D for B, deliver it twice after healing, and assert that the versioned value is unchanged by duplicate handoff. Then read A and C and repair C using the same reconciliation rule. Leave a second key unread to demonstrate the coverage limit of read repair.

**Traps**

- Counting the same fallback copy twice as two independent home-replica acknowledgements.
- Deleting a hint when its network send returns rather than when the intended recipient confirms the required state.
- Applying an old hint as an unconditional overwrite of a newer value or tombstone.

**Practice**

- The section mini-project covers this: fixed-preference-list sloppy writes, delayed and duplicate hinted handoff, version-aware read repair and an unread-key negative test in loglab.

**Stop when:** Your trace shows disjoint sloppy response sets, duplicate handoff is idempotent, and the unread key remains divergent until a mechanism other than read repair runs.

<details>
<summary>Self-test</summary>

1. Why do the two-response write and read sets in the example not have to intersect?
   - The write uses a fallback outside the three home replicas. Both response sets are not size-two subsets of the same three-node universe.
2. Can read repair by itself fix an unread cold key?
   - No. Its trigger is a read of that data. Another propagation or background comparison mechanism must cover cold keys.
3. A hint and the target contain incomparable version vectors. Which one wins?
   - Neither causally supersedes the other. Preserve both as siblings or apply an explicitly chosen convergent application policy. Arrival order is not causal order.
4. Does successful hinted handoff prove linearizability?
   - No. It moves missing versions after the fact; it cannot erase stale or contradictory reads already returned to clients.

</details>

#### U9. Background anti-entropy and Merkle trees for difference localization

**About 4 h** · **Target:** Derive + Implement

Topics: Background anti-entropy; Merkle trees for difference localization

Repair needs a path that does not depend on client reads or surviving hints. Merkle comparison narrows where to reconcile; it does not choose which conflicting state is correct.

**You can now**

- Derive how a balanced Merkle tree localizes a changed range without transferring every value.
- Implement canonical version-aware hashing and compare its diff result with a full scan.
- Repair cold keys while accounting separately for tree construction, comparison and data transfer.

**Study**

1. [Dynamo (SOSP 2007): range-based replica synchronization](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf) (Dynamo: Amazon's Highly Available Key-value Store (DeCandia et al., 2007)) - Section 4.7, Handling permanent failures: Replica synchronization.
2. [HLD Handbook: Merkle tree construction and repair](https://github.com/handbook-academy/engineering-handbook/blob/d177ae2b48b4dfebf8ad0ddae51a345b3e17d99e/content/hld/part-3-distributed-systems-theory/10-merkle-trees-anti-entropy.md) (HLD Handbook - Consistency, Quorums, Replication and Anti-Entropy) - Theory: The divergence problem, Merkle trees, Full anti-entropy; Common Pitfalls: Thinking read repair alone is enough for cold keys. Depth: Use the tree diagram after Dynamo. Skip deployment settings, numerical capacity examples and the XOR safety claim in Hash choice matters. Collision-resistant leaves do not make XOR position-binding: exchanging two leaves preserves their XOR. Use ordered child concatenation and domain-separated hashing instead.

**Focus**

- Both replicas need the same range boundaries, key ordering, serialization and tree shape. Otherwise matching content may produce different trees.
- Hash keys, causal versions, values and tombstones, not just visible values. Two replicas can answer today's read identically yet differ in future merge behavior.
- For a balanced tree with $`n`$ fixed leaf ranges, one differing leaf needs $`O(\log n)`$ descent comparisons after trees exist. Building the trees still reads and hashes the covered state.
- Equal cryptographic roots are evidence of equal encoded snapshots under a collision assumption. A live tree changing during comparison needs a snapshot or a retry policy.

**Reproduce:** In Python 3, build two SHA-256 binary trees over eight fixed, ordered key slots. Encode each leaf canonically with its key, version and value; use a distinct prefix for leaves and ordered internal-node hashes. Change only slot 5 in the second snapshot. Compare the root, then both child hashes of each differing internal node: the comparison visits seven node pairs and identifies only slot 5. Compare that result with an independent full scan. Reconcile that leaf, rebuild the affected path, and verify matching roots. Repeat with a tombstone-only difference and with identical input serialized from different dictionary insertion orders.

**Traps**

- Hashing an unordered container or concatenating variable-length fields without unambiguous encoding.
- Calling a differing hash proof that the remote value should overwrite the local one.
- Reporting tree-descent cost while excluding a full rebuild on every repair round.

**Practice**

- The section mini-project covers this: background Merkle comparison checked against a full-scan oracle, including cold keys, tombstones and repair-traffic counters in loglab.

**Stop when:** Your tree diff agrees with the full-scan oracle on value and metadata differences, and your cost report separates rebuilding, comparing and transferring data.

<details>
<summary>Self-test</summary>

1. Why does a matching visible value not imply matching repair state?
   - The replicas may retain different causal contexts, siblings or deletion metadata. Those differences can change later conflict resolution and must be covered by the digest.
2. Can Merkle comparison recover a value lost from every replica?
   - No. It compares available states and finds differences. It cannot reconstruct information absent everywhere.
3. What happens when every leaf differs?
   - The traversal may visit the whole tree and transfer all differing ranges. Sparse-difference savings are not a worst-case sublinear guarantee.
4. Why is XOR of child hashes insufficient as a position-binding tree construction?
   - XOR is commutative, so swapping children preserves the parent without finding any hash collision. Ordered, domain-separated hashing commits to the structure instead.

</details>

#### U10. Concurrent write conflicts and last-write-wins clock hazards

**About 3 h** · **Target:** Explain

Topics: Concurrent write conflicts; Last-write-wins clock hazards

The Systems unit on consistency models and conflict resolution showed that last-write-wins can converge while losing an update. Here the new work is the stronger failure: a causally later write can lose too, because a wall-clock timestamp is not a dependency certificate.

**You can now**

- Separate causal conflicts from wall-clock and arrival order.
- Derive which acknowledged update a last-write-wins policy discards under skew.
- Choose between overwriting, retaining siblings and application merge from a stated invariant.

**Study**

1. [DDIA, 2nd edition: discarded writes and explicit conflict resolution](https://dataintensive.net/) (DDIA 2e - Chapter 6 Replication and Chapter 10 Consistency Sections) - Chapter 6, Replication: Dealing with Conflicting Writes, pp. 222 to 229; Detecting Concurrent Writes and The happens-before relation and concurrency, pp. 237 to 239. Depth: Concentrate on Last write wins, Manual conflict resolution and Types of conflict. The CRDT discussion is review; stop before Capturing the happens-before relationship.

**Focus**

- LWW chooses the greatest tag under a deterministic total order, including a tie-break. That makes the choice reproducible, not necessarily physically latest or causally correct.
- Concurrency means neither write depends on the other. Widely separated offline writes can still conflict; closely timed writes may be causally ordered.
- Preserving siblings preserves evidence for resolution, not application invariants automatically. Resolving siblings concurrently can itself create more versions.
- A uniqueness or capacity constraint can span different records. Absence of a same-key overwrite conflict does not establish that the application is correct.

**Reproduce:** Use synthetic wall-clock tags, not elapsed-time measurements. A write of red has tag 120. Another client reads red, then writes blue with tag 110 because its clock is behind. With no other writes, apply a greatest-tag LWW merge in both delivery orders: both end at red, discarding the causally later blue write. Add equal-timestamp writes with different actor IDs and specify a stable tie-break. Finally choose a title-edit policy that may discard one edit and a cart-removal policy that must retain deletion intent; explain why one merge policy need not serve both.

**Traps**

- Calling a total timestamp order a causal order or a proof of linearizability.
- Changing equal-timestamp tie-breaking by replica or arrival order and thereby losing convergence.
- Calling any lost user intent an implementation bug when the documented LWW contract explicitly permits discarding it.

**Practice**

- The section mini-project covers this: clock-skew and equal-tag LWW histories, a preserved losing update, and a comparison with sibling retention or an application merge in loglab.

**Stop when:** You reproduce the causally later losing write and defend whether each observed loss violates the implementation, the claimed contract or only the application's requirements.

<details>
<summary>Self-test</summary>

1. Does the red/blue example require concurrent writes?
   - No. Reading red before writing blue makes blue causally later. Skewed physical tags can still make LWW discard it.
2. Does replacing wall time with a logical clock establish real-time order between independent clients?
   - No. A correctly propagated logical clock respects known causal dependencies. Independent events can be ordered arbitrarily, and real-time recency requires more protocol machinery.
3. If every replica keeps the same complete sibling set, has it resolved the application conflict?
   - Not necessarily. It has converged on the unresolved versions. The application still needs a meaningful resolution or a conflict-aware interface.
4. Can writes to different booking IDs violate the same room's reservation invariant?
   - Yes. Concurrent bookings can overlap even though they change different keys. Per-key conflict detection does not enforce a cross-record constraint.

</details>

#### U11. Version vectors, dotted conflict sets and delete convergence with tombstones

**About 6 h** · **Target:** Derive + Implement

Topics: Version vectors and causal conflict detection; Tombstones and delete convergence; Dotted version-vector conflict sets

The earlier unit on vector clock comparison, concurrency and dotted version vectors taught the comparison rules. Here the new work is attaching them to actual values, sibling replacement and deletion, where losing causal metadata can resurrect data or manufacture conflicts.

**You can now**

- Derive causal dominance and retain incomparable versions as siblings.
- Implement version-aware delete propagation and demonstrate resurrection after unsafe tombstone removal.
- Use per-sibling dots and incoming causal context to avoid false sibling conflicts.

**Study**

1. [DDIA, 2nd edition: versioned siblings](https://dataintensive.net/) (DDIA 2e - Chapter 6 Replication and Chapter 10 Consistency Sections) - Chapter 6, Replication: Capturing the happens-before relationship through Version vectors, pp. 239 to 242, including Figures 6-15 and 6-16.
2. [Dynamo (SOSP 2007): version context and reconciliation](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf) (Dynamo: Amazon's Highly Available Key-value Store (DeCandia et al., 2007)) - Section 4.4, Data Versioning, including Figure 3 and the clock-truncation discussion.
3. [HLD Handbook: deletion metadata and repair coverage](https://github.com/handbook-academy/engineering-handbook/blob/d177ae2b48b4dfebf8ad0ddae51a345b3e17d99e/content/hld/part-3-distributed-systems-theory/10-merkle-trees-anti-entropy.md) (HLD Handbook - Consistency, Quorums, Replication and Anti-Entropy) - Theory: The divergence problem; Common Pitfalls: Repair slower than `gc_grace` causes tombstone resurrection. Depth: Read for the stale-replica resurrection mechanism. Do not adopt a fixed grace duration as a proof that every replica has learned a delete.
4. [Russell Brown (2015): dots identify the siblings an update replaces](https://riak.com/posts/technical/vector-clocks-revisited-part-2-dotted-version-vectors/index.html?p=9929.html) (Vector Clocks Revisited Part 2: Dotted Version Vectors) - Sibling Explosion, What Just Happened?, Dots To The Rescue and Dot The clocks (page read 2026-10-15). Depth: The dotted conflict-set extension is optional. Stop before Further Material; implement the illustrated per-sibling rule, not all of Riak's metadata machinery.

**Focus**

- A vector dominates another when every component is at least as large; strict dominance also needs one larger component. Incomparable versions remain siblings until a policy resolves them.
- A returned context says what the client has observed. Allocating a new server event must not falsely imply that the client observed every sibling the server has seen.
- A tombstone is a versioned delete, not missing data. Repair must propagate it through the same causal comparison and conflict rules as values.
- Safe tombstone reclamation needs evidence that stale data cannot return, including rejoining replicas, replacements and old messages. A timeout alone supplies no such evidence under unbounded disconnection.

**Reproduce:** In Python 3, retain both versions with vectors $`(2,1)`$ and $`(1,2)`$, then let a client observe both and issue an update at the first origin with vector $`(3,2)`$; it supersedes both. Next let an offline replica retain a value at $`(1,0)`$ while another records its delete at $`(2,0)`$. Repair with the tombstone present must keep the deletion; erase both tombstone and causal evidence prematurely and show resurrection under the same merge. For the optional dotted extension, replay the article's Bob, Sue, Rita and Michelle writes: Rita's context covers Bob but not Sue, and Michelle's covers Bob and Sue but not Rita. The final siblings are Rita and Michelle, not all four values.

**Traps**

- Treating a larger sum of vector components as causal dominance.
- Reusing an actor counter after restart or replacement and colliding with an old dot.
- Dropping a tombstone from the Merkle digest or assuming every absent key means an authoritative delete.

**Practice**

- The section mini-project covers this: sibling dominance, versioned deletes, stale-replica resurrection and restart-safe actor identity, with the optional per-sibling dotted replacement test in loglab.

**Stop when:** Your tests retain concurrent siblings, remove causally superseded versions and reproduce then prevent stale-value resurrection; if you take the dotted extension, its final sibling set contains only Rita and Michelle.

<details>
<summary>Self-test</summary>

1. Does $`(4,1)`$ dominate $`(2,3)`$?
   - No. Each is larger in one component, so they are incomparable. A scalar total cannot replace componentwise comparison.
2. Why does a shared object vector lose information about individual siblings?
   - It summarizes all events known at the object, but does not identify which event introduced each value. A dot attached to each sibling lets an incoming context remove only siblings the client observed.
3. Must a concurrent delete always beat a concurrent update?
   - No. That is an explicit application or datatype policy, such as remove-wins or add-wins, not something causal comparison determines. An observed prior value can be deleted causally without resolving every concurrent update.
4. What is lost by truncating version-vector entries without a safe causal argument?
   - Accurate ancestry information. A later version may appear concurrent with an ancestor, creating unnecessary siblings or complicating safe deletion and reconciliation.

</details>

#### U12. Operation history schema, a single-object reference model and a consistency checker

**About 6 h** · **Target:** Implement

Topics: Operation history schema; Single-object reference model; Linearizability or contract checker

The Systems unit on distributed histories and deterministic failure simulation built a first checker. Here the new work is explicit indeterminate operations, validated event pairing and an independent checker comparison.

**You can now**

- Record invocations, responses and indeterminate outcomes without inventing a real-time order.
- Implement a bounded single-register checker against an independent sequential model.
- Return a legal witness, a demonstrated violation or an inconclusive search result with its scope.

**Study**

1. [Herlihy and Wing (1990): incomplete histories](https://pdos.csail.mit.edu/6.824/papers/p463-herlihy.pdf) (Linearizability: A Correctness Condition for Concurrent Objects (Herlihy and Wing, 1990)) - Sections 2.1 to 2.2, printed pp. 467 to 469: histories, complete histories, extension and equivalence. Depth: Revisit only the definitions your checker needs; do not repeat the full paper.
2. [Jepsen: operations, crashes and history representation](https://jepsen.io/consistency/models) (Jepsen Consistency Models) - Fundamental Concepts: Processes, Operations, Invocation & Completion Times, Crashes and Histories (page read 2026-10-15).
3. [Jepsen v0.3.14: outcome encoding and Knossos models](https://github.com/jepsen-io/jepsen/blob/e5c458ad6671846938d11c3ac28db6439f9a822f/doc/tutorial/04-checker.md#L27-L114) (Jepsen Consistency Models) - Tutorial 4, Models and the initial `checker/linearizable` example, lines 27 to 114; read Tutorial 3's outcome rules at https://github.com/jepsen-io/jepsen/blob/e5c458ad6671846938d11c3ac28db6439f9a822f/doc/tutorial/03-client.md#L195-L202. Depth: Use the register model and outcome conventions as an independent reference. Do not provision the tutorial's remote machines; the required work is a local Python checker and Maelstrom's local register oracle.

**Focus**

- Pair events by stable operation identity. Record client, object, function, arguments, result, invocation, completion and outcome; keep replica configuration and epoch as diagnostic metadata.
- Validate the history before checking it: missing or duplicate responses, impossible result shapes and reused identities are input errors, not consistency verdicts.
- Enumerate legal model transitions subject to response-before-invocation edges. For indeterminate writes, consider both omission and a possible completion; a timeout is not a definite failure.
- Use the simulator or a single local observer to establish event order. Unsynchronized server timestamps cannot manufacture precise cross-client real-time edges. Exhaustion of a search budget is inconclusive, not a counterexample.

**Reproduce:** Write a Python 3 checker from the register specification, initially 0. First accept a completed write of 1 followed by a read of 1, and reject the same history when the read returns 0. Next leave a write of 1 pending: a later read of 1 is legal if that write takes effect, but a read of 1 followed by a nonoverlapping read of 0 is illegal with no other writes. Return an actual operation ordering for accepted histories. Cross-check these tiny histories with Knossos's register model; Maelstrom's linearizable key/value workload uses a CAS-register model that also supports compare-and-set. Add a deliberately broken checker that drops every pending write and show that it rejects the legal pending-write case. Keep malformed input and search-budget exhaustion separate from model violations.

**Traps**

- Using the replicated implementation's state or merge function as the supposedly independent sequential oracle.
- Discarding timed-out writes, or marking a transport error as definite non-execution without evidence.
- Calling a single-register verdict transaction isolation, multi-key atomicity or a durability proof.

**Practice**

- The section mini-project covers this: a validated operation-history schema, independent register witness search, pending-write counterexamples and agreement with Knossos on a small fixture corpus in loglab.

**Stop when:** Your checker agrees with the independent oracle on accepted, rejected and indeterminate-write fixtures, returns witnesses for acceptance, and never labels an incomplete search a violation.

<details>
<summary>Self-test</summary>

1. Can a timed-out write precede a later successful read in a legal witness?
   - Yes. Its effect may have happened despite the missing response. The checker may complete that operation consistently with the observed history.
2. Why retain both an operation ID and a logical client identity?
   - The operation ID pairs events and distinguishes attempts; client identity supplies process-order constraints. After an indeterminate operation, a new logical process identity avoids pretending the old process has no outstanding operation.
3. What does an accepted bounded history establish?
   - That this history has a legal witness for the encoded object model and timing constraints. It does not establish correctness for unobserved schedules or a stronger model.
4. If a checker reaches its search limit without finding a witness, may it report a violation?
   - No. Unless the search is complete or another sound argument proves impossibility, the result is inconclusive.

</details>

#### U13. Deterministic replicated-store simulation with partition, failover and repair schedules

**About 6 h** · **Target:** Implement

Topics: Deterministic replicated-store simulation; Partition, failover and repair fault schedules

The Systems unit on distributed histories and deterministic failure simulation built the scheduler; reuse it with the track's RPC and storage boundaries. Here the new work is faithful replicated state, not another generic message-queue simulator.

**You can now**

- Extend the deterministic network harness with replication, persistence, promotion and repair transitions.
- Replay partition, stale-authority, crash/restart and delayed-repair schedules byte for byte.
- Preserve a violating client history and distinguish a contract fix from merely healing replicas.

**Study**

1. [Replicated Log and Stream Processor: replication evidence boundaries](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-2/replicated-log-stream-processor.md) (Replicated Log and Stream Processor - Replication Slice) - Architecture constraints; Milestones B and D; Correctness requirements; Failure-injection requirements. Depth: Apply only the replication, histories, stale-epoch and repair slice to loglab. Defer consensus elections, stream processing, distributed transactions and production-scale operations.
2. [Gossip Glomers: fault-tolerant and efficient broadcast contracts](https://fly.io/dist-sys/3d/) (Gossip Glomers - Broadcast and Grow-Only Counter) - Challenge 3d: Specification, Messages-per-operation, Stable latencies and Evaluation; prerequisite Challenge 3c Specification at https://fly.io/dist-sys/3c/. Depth: Read 3c to identify the missing partition-recovery obligation before optimizing 3d. Maelstrom supplies local processes and a simulated network, not your deterministic crash-durability model.

**Focus**

- Schedule message delivery, timeout, persistence completion, apply and repair as separate transitions. Use stable event ordering and explicit random choices, not uncontrolled wall-clock scheduling.
- Model each link direction separately. A node can receive a request yet fail to return its reply, and a partition is not equivalent to a process crash.
- Retain durable state across restart and clear only volatile state. Reuse the local recovery contract rather than pretending in-memory replication tests storage durability.
- Healing can restore convergence while leaving an earlier linearizability violation intact. Run the history checker over the whole client history, not only post-repair reads.

**Reproduce:** Extend your Python 3 loglab simulator with a controller-selected leader, epoch, durable log, applied state and a repair queue. Partition replication, acknowledge a leader-only write, and serve a stale follower read; then heal and deliver duplicate repair. Replay the same explicit schedule three times and require byte-identical client and transition traces. The full history remains rejected even after the final values match. Compare with a policy that routes the read to the reachable unchanged leader. Add separate schedules for promotion of a lagging follower, a lost acknowledgement, a restarted replica and an unread deleted key; name the contract and outcome for each. Do not claim the controller implements consensus.

**Traps**

- Replaying a seed while leaving timer order, map iteration or I/O completion outside the scheduler's control.
- Counting a partition nemesis as a process-crash or disk-corruption test.
- Deleting the bad prefix of a history after repair and announcing that consistency is restored retroactively.

**Practice**

- [Gossip Glomers Challenge 3d: Efficient Broadcast, Part I](https://fly.io/dist-sys/3d/) - Specification and Evaluation: 25 nodes, 100 ms simulated message latency; repeat with the partition nemesis as the page requests. Continue the Go broadcast implementation you built for Challenges 3a to 3c in the Systems and gossip units, and keep it passing the 3c partition run before you optimize. Use Maelstrom v0.2.4 locally and its Evaluation command; preserve histories and report the page's efficiency checks separately from correctness. The section mini-project supplies deterministic crash, failover and delete schedules that this network-only challenge does not cover.

**Stop when:** The explicit loglab schedules replay identically and retain the violating history, your 3d baseline meets its broadcast and published efficiency checks, and a separate partition run preserves correctness without imposing the fault-free latency budget.

<details>
<summary>Self-test</summary>

1. Which state should survive a simulated process restart?
   - Only state that crossed the declared durable boundary. The simulator must reconstruct volatile state from that state using the recovery rules, not retain it accidentally.
2. Why is a dropped acknowledgement different from a dropped request?
   - The first may leave the effect applied with an uncertain client outcome; the second may prevent execution entirely. Retry and history handling must distinguish knowledge from actual execution.
3. Does a convergent broadcast challenge implement a linearizable register?
   - No. The operation specification and checker are different. Set dissemination and eventual visibility do not establish real-time register semantics or total-order broadcast.
4. What does a finite run with no completed operations demonstrate?
   - A progress stall within that observation interval. It is not by itself a safety counterexample or proof that progress can never resume.

</details>

#### U14. Latency, availability, staleness, conflict, repair traffic and convergence measurement

**About 6 h** · **Target:** Measure

Topics: Latency, availability and staleness measurement; Conflict, repair traffic and convergence measurement

A policy that answers more requests can still return older data or discard conflicts. Report those outcomes together, with the checked contract, so faster successful calls do not hide failed or indefinitely waiting work.

**You can now**

- Measure latency, successful completion fraction, version staleness, conflicts, repair traffic and convergence under declared observation boundaries.
- Compare two replication policies under matched workloads and exogenous fault schedules.
- Preserve a negative trade-off result and distinguish local measurements from simulated logical time.

**Study**

1. [DDIA, 2nd edition: measuring freshness and replication costs](https://dataintensive.net/) (DDIA 2e - Chapter 6 Replication and Chapter 10 Consistency Sections) - Chapter 6, Replication: Monitoring staleness and Single-Leader Versus Leaderless Replication Performance, pp. 234 to 236.
2. [Gossip Glomers: broadcast efficiency metrics](https://fly.io/dist-sys/3d/) (Gossip Glomers - Broadcast and Grow-Only Counter) - Challenge 3d, Messages-per-operation and Stable latencies; Challenge 3e, Specification and Evaluation at https://fly.io/dist-sys/3e/. Depth: Distinguish acknowledgement-to-observed-stability latency from client response latency. Use 3e's budgets only for its stated simulated workload, not as targets for loglab or a production database.
3. [Replicated Log and Stream Processor: measurement dossier](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-2/replicated-log-stream-processor.md) (Replicated Log and Stream Processor - Replication Slice) - Milestone E; Measurement requirements; Design-defense questions. Depth: Use replication latency, lag, repair, failure and acknowledged-loss evidence only. Consumer and checkpoint metrics belong to later sections.

**Focus**

- Report successful-call latency separately from errors, timeouts and outstanding operations. Define the offered logical-operation denominator and observation window; retries are additional work, not new user operations.
- Version staleness needs a known reference frontier in the same ordered lineage. For concurrent siblings there may be no unique latest version; report dependency gaps and conflict sets instead of subtracting arbitrary tags.
- Count unique conflicting versions or keys with siblings using an explicit definition. Count all repair messages and encoded bytes, including retries and metadata, separately from useful payload.
- After healing and stopping writes, define convergence as every intended live replica holding equivalent canonical versioned state. A replica still missing at the observation deadline makes convergence unobserved, not zero.

**Reproduce:** Build a Python 3 metric fixture with ten offered logical operations: eight complete successfully by the observation deadline, one has a definite failure and one remains pending. Report an 80% observed success fraction, while keeping failure and pending counts separate; do not call it CAP availability. In a separate single-writer, no-failover fixture, ten writes complete before three reads begin and no further writes occur. Reads returning states through positions 7, 10 and 8 have version gaps of 3, 0 and 2. Then compare asynchronous follower reads with reads that wait for a required applied frontier in loglab. Match workload, seeds, fault schedule, initial data, persistence boundaries and observation windows. Save full latency distributions, all outcomes, conflict counts, encoded repair bytes and post-heal convergence intervals; retain a case where the stricter policy waits or fails more often.

**Traps**

- Comparing only successful-call p99 while dropping the slowest calls as timeouts.
- Dividing server messages by broadcasts when the reported denominator includes both broadcasts and reads.
- Treating the last observed missing read as the exact instant all replicas converged. Sampling only brackets the visibility transition.

**Practice**

- [Gossip Glomers Challenge 3e: Efficient Broadcast, Part II](https://fly.io/dist-sys/3e/) - Specification and Evaluation, continuing 3d with the same 25-node, 100 ms message-delay workload. Run the Go implementation as local Maelstrom v0.2.4 processes. Compare 3d and 3e designs on the same configured workload, preserving each run's checker outcome, server messages per operation and stable-latency quantiles. The published budgets change both message and latency requirements; do not call one design universally faster. Recheck correctness under partitions. The section mini-project adds the matched consistency, conflict and repair comparison in loglab.

**Stop when:** Your dossier includes the exact metric-fixture results, a 3e baseline meeting its published correctness and efficiency checks, and a matched loglab comparison accounting for unsuccessful work, convergence coverage and one negative trade-off regime.

<details>
<summary>Self-test</summary>

1. How can response latency improve while the system gets less useful?
   - More slow operations may time out or fail and disappear from the success-only latency sample. Report offered load, successful goodput and all outcome counts alongside it.
2. Why is a broadcast stability metric not a client request duration?
   - The challenge measures from broadcast acknowledgement to the last read on any node that still missed the value. It estimates observed dissemination behavior after acknowledgement, not invocation-to-response time.
3. Why must a repair policy be measured after faults stop as well as during them?
   - Healing can release a backlog that competes with foreground work. Recovery traffic and time to convergence are part of the trade-off, not free background work.
4. May you compare staleness counts from one random workload with latency from another and infer a policy trade-off?
   - Not without controlling the workload and fault distributions. Use matched experiments, retain raw histories and repeat across paired seeds; report the spread rather than a single favorable run.

</details>

### Mini-project: Replicated store with checked histories and repair evidence

**About 16 to 22 hours.** Extend `loglab` with configurable replication policies, executable consistency contracts and version-aware repair. Reuse `net/`, `clock/`, `member/` and `storage/` on your machine, keeping controller-driven promotion distinct from consensus and convergence distinct from a legal client history.

1. Build validated operation histories and independent register witness search in `history/`; distinguish sequential consistency from linearizability, pending effects, malformed input and inconclusive search. Compare fixtures with Knossos's register model, retaining witnesses, contradictions and a negative control that drops pending writes.
2. Add configurable write authority, read routing and acknowledgement policies in `replica/`. Replay topology-specific partitions against hand-derived contracts; record receipt, persistence, application, replies and lineage-scoped record lag, including a crash before persistence. Preserve explicit event schedules and independent model verdicts before timing runs.
3. Implement controller-driven promotion, stale-epoch rejection and snapshot-plus-suffix bootstrap. Check divergent-leader rejoin, empty replacements and retention gaps against a single-node replay oracle; preserve lost acknowledged suffixes. Add session frontiers with wait-or-fail routing, monotonic reads and writes, writes-follow-reads and context-loss regressions.
4. Implement dependency visibility, sibling dominance, restart-safe actors and versioned deletes against an event-ancestry oracle. Preserve skewed and equal-tag LWW losses, sibling-policy comparisons and unsafe-reclamation regressions. Retain Gossip Glomers Challenge 4 histories separately from dependency checks; optionally test incoming-context dotted replacement.
5. Implement fixed-membership read write-back and fixed-preference sloppy quorums; check pending-write inversion and disjoint fallback sets with your register checker. Add recipient-aware delayed, duplicate hinted handoff and version-aware read repair; keep an unread-key negative test and distinguish partition stalls from safety violations.
6. Build canonical, ordered, domain-separated Merkle comparison over versioned snapshots, including cold keys and tombstones. Compare differences and repaired state with a full-scan oracle; retain separate rebuild, comparison and transfer counters. Replay deterministic crash, failover, delete and duplicate-repair schedules without erasing earlier history violations.
7. After correctness gates, compare consistency, conflict and repair policies across repeated matched runs on your machine; validate extraction against hand-counted traces. Retain versions, workloads, seeds, latency distributions, outcomes, staleness, conflicts, repair bytes, acknowledged loss and convergence. Keep Gossip Glomers 3d/3e results separate, including negative trade-offs.

**Deliverables**

- The `replica/` implementation with explicit contracts, recovery boundaries and reusable deterministic schedules in `faults/`.
- Validated `history/` fixtures, Knossos comparisons, independent model verdicts and negative-control regressions in `tests/`.
- Raw traces and repeated-run comparisons in `reports/`, separating simulated ordering, measured timing, unsuccessful work and unobserved convergence.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [Knossos register model through Jepsen's pinned checker tutorial](https://github.com/jepsen-io/jepsen/blob/e5c458ad6671846938d11c3ac28db6439f9a822f/doc/tutorial/04-checker.md#L27-L114). Cross-check register fixtures on your machine; retain model versions, outcome translation and verdicts. No remote provisioning is needed.
- external-tests: [Gossip Glomers Challenge 4: Grow-Only Counter](https://fly.io/dist-sys/4/). Retain Maelstrom histories and final-count verdicts; these do not establish causal visibility or intermediate-read linearizability.
- external-tests: [Gossip Glomers Challenge 3d: Efficient Broadcast, Part I](https://fly.io/dist-sys/3d/). Retain broadcast correctness and efficiency results separately from deterministic crash and storage evidence.
- external-tests: [Gossip Glomers Challenge 3e: Efficient Broadcast, Part II](https://fly.io/dist-sys/3e/). Compare matched broadcast workloads and recheck partitions; distinguish observed stability from client response latency.

| Criterion | Pass | Strong |
| --- | --- | --- |
| History oracle independence | Your checker agrees with Knossos on legal, illegal and pending-write fixtures, returns witnesses, and separates invalid input and incomplete search from violations. | A deliberately broken pending-write rule fails its negative control; minimized counterexamples identify the violated ordering edge without inspecting implementation state. |
| Conflict and repair correctness | Your ancestry oracle checks sibling dominance and deletes; full-scan comparison validates Merkle repair. Tests expose LWW loss, resurrection, sloppy nonintersection and the unread-key limitation. | Metadata-only differences, duplicate handoff and restarted actors remain correct; an optional dotted extension removes only siblings covered by the incoming context. |
| Measurement honesty | Hand-counted fixtures validate your extractor before repeated matched runs; raw histories support latency, outcomes, lag, conflict, repair, loss and convergence claims with named versions and workloads. | The comparison preserves a negative regime, separates repair construction from transfer costs and reports pending operations or unobserved convergence rather than inventing completion times. |

Feeds into: Replication contracts, repair state and checked histories feed consensus, partition movement and stream visibility; durable traces, loss boundaries and matched comparisons become the capstone's replication evidence.

### Resource route

- **Primary - Book:** [DDIA 2e - Chapter 6 Replication and Chapter 10 Consistency Sections](https://dataintensive.net/) - Read replication completely, then the consistency-model and linearizability portions of Chapter 10. Convert every named guarantee into allowed and forbidden histories before selecting implementation policy.
- **Required - Paper:** [Linearizability: A Correctness Condition for Concurrent Objects (Herlihy and Wing, 1990)](https://pdos.csail.mit.edu/6.824/papers/p463-herlihy.pdf) - Read through Section 3.1, as MIT 6.5840 assigns: histories, real-time order and the definition every history check in this section tests. Linearizability is per object, which is why it composes.
- **Required - Paper:** [Dynamo: Amazon's Highly Available Key-value Store (DeCandia et al., 2007)](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf) - Read the background and system architecture sections: consistent hashing, replication, vector-clock versioning, sloppy quorums, hinted handoff and Merkle-tree anti-entropy. $`R + W > N`$ alone does not make it linearizable, and its numbers are 2007 production results.
- **Support - Paper:** [Session Guarantees for Weakly Consistent Replicated Data (Terry et al., 1994)](https://www.cs.cornell.edu/courses/cs734/2000FA/cached%20papers/SessionGuaranteesPDIS_1.html) - Read the definitions of read your writes, monotonic reads, writes follow reads and monotonic writes and how each is enforced. They hold per session, not system-wide.
- **Support - Paper:** [Brewer's Conjecture and the Feasibility of Consistent, Available, Partition-Tolerant Web Services (Gilbert and Lynch, 2002)](https://users.ece.cmu.edu/~adrian/731-sp04/readings/GL-cap.pdf) - Read the model and the asynchronous-network theorem, then the partially synchronous discussion. Availability here means every request a non-failing node receives gets a response, in every fair execution, including executions that lose messages.
- **Support - Paper:** [Don't Settle for Eventual: Scalable Causal Consistency for Wide-Area Storage with COPS (Lloyd et al., 2011)](https://www.cs.cmu.edu/~dga/papers/cops-sosp2011.pdf) - Read the causal+ definition and the dependency-tracking mechanism; causal+ adds convergence to causal consistency, so keep the qualifier.
- **Support - Paper:** [Conflict-free Replicated Data Types (Preguica, Baquero and Shapiro, 2018)](https://arxiv.org/abs/1805.06358) - Read it for the state-based and operation-based vocabulary and the delivery assumptions each needs; the implementation belongs to DS-9.
- **Support - Paper:** [Consistency in Non-Transactional Distributed Storage Systems (Viotti and Vukolic, 2016)](https://arxiv.org/abs/1512.00168) - Use it as a map of model names and their relations, then confirm any single definition against its primary source.
- **Required - Course and papers:** [MIT 6.5840 - Consistency, Linearizability and Replication Papers](https://pdos.csail.mit.edu/6.824/schedule.html) - Use Spring 2026 lectures 8, 12 and 13 plus their Linearizability, Spanner and Chain Replication readings. Write one history question per mechanism and answer it before looking at the discussion material.
- **Support - Reference:** [Cambridge Concurrent and Distributed Systems Notes (Kleppmann) - Replication and Linearizability](https://www.cl.cam.ac.uk/teaching/2122/ConcDisSys/dist-sys-notes.pdf) - Use Chapter 5 (quorums and replication with broadcast) and Section 7.2 (linearizability and ABD) as a derivation workbook: work Exercise 19 (ABD pseudocode) and Exercise 20 (is this execution linearizable?) before writing your own checker.
- **Optional - Practice:** [Building Distributed Systems - The Store](https://builddistributedsystem.com/tracks/store) - Only the first three tasks are free (the key/value interface, client routing and read consistency). Tasks are graded in the browser after login, so treat a pass as a drill and keep your local harness as the evidence. 
- **Required - Reference:** [HLD Handbook - Consistency, Quorums, Replication and Anti-Entropy](https://github.com/handbook-academy/engineering-handbook/tree/main/content/hld) - Read Part 1 consistency plus Part 2 replication and Part 3 consistency, quorums, CAP and PACELC, clocks and Merkle trees. Use the chapter exercises as oral review after implementing the histories.
- **Required - Reference:** [Jepsen Consistency Models](https://jepsen.io/consistency/models) - Use the model hierarchy and history definitions to name the exact contract being checked. Check recorded single-register histories with Knossos, which Maelstrom runs for its `lin-kv` workload, and never claim a stronger model than the checker covers.
- **Required - Practice:** [Gossip Glomers - Broadcast and Grow-Only Counter](https://fly.io/dist-sys/3d) - Each challenge runs locally under Maelstrom (v0.2.4; the pages were tested on 0.2.3) with its checker and, where the page says so, the partition nemesis; keep the run directory as the history. Do 3d and 3e (efficient broadcast, with message and latency budgets) and 4 (a grow-only counter over sequentially consistent storage). Explain why convergence alone does not imply linearizability or transaction isolation.
- **Support - Project:** [Replicated Log and Stream Processor - Replication Slice](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-2/replicated-log-stream-processor.md) - Add configurable replication, lag, failover, recorded histories, repair and a checked consistency contract. Preserve one violating history and the fix or narrowed claim.
- **Support - Article:** [Vector Clocks Revisited Part 2: Dotted Version Vectors](https://riak.com/posts/technical/vector-clocks-revisited-part-2-dotted-version-vectors/index.html?p=9929.html) - Read Sibling Explosion through Dot The clocks for the per-sibling dot and incoming-context replacement rule. This fills the implementation gap left by DDIA's brief dotted-vector mention; use the 2015 example, not its product-default statements as current guidance.

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

### Study units

#### U1. State-machine replication and safety versus liveness

**About 3 h** · **Target:** Explain

Topics: State-machine replication model; Safety versus liveness

The Systems unit on replication, quorums and consensus vocabulary named the pieces. Here the contract becomes a ledger of properties that every later Raft transition must preserve, not another survey of replication styles.

**You can now**

- Explain how an agreed command prefix and deterministic execution produce replicated state.
- Separate election safety, log matching and state-machine safety from conditional progress.
- State the crash-recovery, storage and timing assumptions behind your consensus contract.

**Study**

1. [Raft extended paper (20 May 2014): replication contract](https://raft.github.io/raft.pdf) (In Search of an Understandable Consensus Algorithm) - Section 2, Replicated state machines, and Figure 1; Figure 3, Raft guarantees; Section 5.6, Timing and availability. Depth: Read the guarantees as obligations to justify later. Skip the Paxos comparison and the evaluation for now.
2. [MIT 6.5840 Spring 2026 Lab 3: module boundary](https://pdos.csail.mit.edu/6.824/labs/lab-raft1.html) (MIT 6.5840 - Lab 3 Raft) - Introduction, Getting Started and The code, through the description of `labrpc`. Depth: Inspect the interface and public tests. Begin implementation in the election unit; keep course solutions private.

**Focus**

- Replicas at different applied indexes need not have identical current state. Equal initial state and an equal deterministic command prefix imply equal state at that prefix.
- Uncommitted suffixes may differ. State-machine safety forbids different commands being applied at the same index, not temporary differences between whole logs.
- Basic Raft safety assumes correct protocol execution and stable storage across crashes, not bounded message delay. Progress also needs a communicating majority and sufficiently stable timing and leadership.
- A safety counterexample has a finite bad prefix. A bounded interval without commits is evidence of a stall, not a proof of permanent nontermination.

**Reproduce:** Closed-book, draw the client, consensus module, log and state machine from Figure 1. Trace an append through local acceptance, durable replication, commitment, application and reply. Mark which boundaries the Lab 3 interface exposes and which belong to the service. Classify a conflicting applied command as a safety violation and a minority partition with no completed writes as a progress stall.

**Traps**

- Treating `Start()` returning as a successful client write. It starts agreement; it does not promise commitment.
- Putting local randomness or wall-clock reads inside the deterministic application transition instead of agreeing their results as command data.
- Reading the paper's availability summary as an unconditional termination theorem for any network with a connected majority. Timing and competing elections still matter.

**Practice**

- The section mini-project covers this: the `loglab` invariant ledger, fault-model statement and separate acceptance, persistence, commit, apply and reply events.

**Stop when:** Your ledger names a finite witness for each safety property and states the assumptions needed for progress without requiring identical uncommitted logs.

<details>
<summary>Self-test</summary>

1. Two replicas have applied different-length prefixes. Must their current states match?
   - No. Compare state after the same prefix. A lagging replica can be safe while behind.
2. Can a safe log contain different commands at one index on different servers?
   - Yes, in uncommitted suffixes. They must not both become applied decisions at that index.
3. Does a timeout establish that the leader crashed?
   - No. It creates suspicion. Safety must survive false suspicion; progress needs additional timing and communication assumptions.

</details>

#### U2. Terms and epochs, follower, candidate and leader states and randomized election timeouts

**About 6 h** · **Target:** Explain + Implement

Topics: Terms, ballots and monotonic epochs; Follower, candidate and leader states; Randomized election timeouts

The election state machine establishes authority for one term. Randomized timeouts help establish that authority promptly; they do not make conflicting votes safe.

**You can now**

- Implement follower, candidate and leader transitions with monotonic terms.
- Justify at most one elected leader per term using persistent votes and majority intersection.
- Diagnose repeated elections without weakening voting rules.

**Study**

1. [Raft extended paper: election state machine](https://raft.github.io/raft.pdf) (In Search of an Understandable Consensus Algorithm) - Sections 5.1 and 5.2; Figure 2 election state and rules; Figures 4 and 5.
2. [MIT 6.5840 Spring 2026 Lab 3A: leader election](https://pdos.csail.mit.edu/6.824/labs/lab-raft1.html) (MIT 6.5840 - Lab 3 Raft) - Part 3A: leader election, including heartbeat limits and election timeout guidance.

**Focus**

- On an election timeout, increment the term, vote for yourself, reset the randomized election timer and send vote requests. Count distinct voters only for the election still in progress.
- In basic Raft, a higher term in either an RPC request or response makes a candidate or leader update its term and become a follower. A stale response must not resurrect an old election.
- A candidate receiving same-term AppendEntries becomes a follower. A term need not elect any leader, and servers need not observe term changes simultaneously.
- Reset election timers for the Figure 2 events, not every incoming packet. Choose timeout and heartbeat spacing for the lab's limits rather than copying the paper's example milliseconds.

**Reproduce:** From a blank page, trace three followers in term 0. Let one time out, enter term 1, vote for itself and receive a second distinct vote: it becomes leader. Deliver that second vote again: the count must not increase. Then deliver a response carrying term 2: the leader becomes a term-2 follower. Implement this transition trace alongside Lab 3A on your machine.

**Traps**

- Claiming there can never be two servers that think they are leader. The invariant is one elected leader per term, not instant agreement across terms.
- Resetting the timer on a rejected stale vote request, allowing an obsolete sender to suppress progress.
- Reading replies after unlocking and applying them without checking that the role and term still match the RPC's election.

**Practice**

- [MIT 6.5840 Spring 2026 Lab 3A: leader election](https://pdos.csail.mit.edu/6.824/labs/lab-raft1.html) - Part 3A; `TestInitialElection3A`, `TestReElection3A` and `TestManyElections3A`; run `make RUN="-run 3A" raft1` from `src`. Use the public tests locally with Go and the race detector through the supplied Make target. They exercise initial election and elections under disconnection and reconnection, not disk durability. Keep solutions private.

**Stop when:** Lab 3A passes, and your explicit trace ignores a duplicate vote and steps down on a higher-term reply without accepting delayed votes from the old election.

<details>
<summary>Self-test</summary>

1. Why can two different candidates not each win term 7 in a fixed configuration?
   - Their majorities intersect, and the intersecting server cannot vote for both in term 7, including across a restart.
2. Does a candidate step down on same-term AppendEntries?
   - Yes. It recognizes the elected leader for that term. A stale-term AppendEntries is rejected instead.
3. Do identical election timeouts threaten safety or progress?
   - Progress: simultaneous candidates may repeatedly split the vote. Correct majority and one-vote rules still preserve election safety.

</details>

#### U3. The RequestVote freshness rule, split votes, pre-vote and leadership transfer

**About 4 h** · **Target:** Derive + Implement

Topics: RequestVote freshness rule; Split vote and election recovery; Pre-vote and leadership-transfer mechanisms

Election safety alone can elect a server missing committed history. Freshness connects election to log safety; the optional mechanisms address avoidable disruptions rather than replacing that rule.

**You can now**

- Implement the term-first, index-second vote freshness comparison.
- Walk a split vote through a later successful election without double voting.
- Explain what pre-vote and leadership transfer change, and which safety checks they retain.

**Study**

1. [Raft extended paper: election restriction](https://raft.github.io/raft.pdf) (In Search of an Understandable Consensus Algorithm) - Section 5.4.1, Election restriction; Section 5.2 paragraphs on split votes; Figure 2 RequestVote receiver rules.
2. [Ongaro's 2014 thesis: optional election mechanisms](https://web.stanford.edu/~ouster/cgi-bin/papers/OngaroPhD.pdf) (Consensus: Bridging Theory and Practice (Ongaro, 2014)) - Section 3.10, Leadership transfer extension; Section 9.6, Preventing disruptions when a server rejoins the cluster. Depth: Explain both extensions; implementation is optional. Do not implement the thesis's election simulator or reproduce its performance results.
3. [MIT 6.5840 Spring 2026 Lab 3B: election prerequisite](https://pdos.csail.mit.edu/6.824/labs/lab-raft1.html) (MIT 6.5840 - Lab 3 Raft) - Part 3B: log, instruction to implement the Section 5.4.1 election restriction. Depth: Add freshness to the existing election code. Finish replication in the following units.

**Focus**

- Compare `lastLogTerm` first, then `lastLogIndex` only when terms tie. Neither total log length nor the candidate's election term substitutes for its last entry's term.
- Freshness is necessary but not sufficient for granting a vote: the request term and the recorded vote still constrain the decision.
- Pre-vote asks whether a prospective election could win before incrementing the local term. An isolated node cannot repeatedly advance its term just by timing out under this extension.
- Leadership transfer catches up the target, stops accepting new work during transfer and triggers a normal new-term election with `TimeoutNow`. It does not appoint a leader without votes.

**Reproduce:** Closed-book, compare logs by their last entry. A voter ends at index 10 in log term 3. A candidate ending at index 6 in log term 4 passes freshness; one ending at index 20 in log term 2 fails; one ending at index 9 in log term 3 fails. Assume the RPC election term is acceptable and no other vote was cast. Then draw a three-candidate split vote and a later term in which one candidate obtains two distinct votes.

**Traps**

- Granting a vote to a longer log whose last entry has an older term.
- Treating a pre-vote response as a durable vote or changing the current term merely because a prospective term is mentioned.
- Assuming pre-vote cures all membership disruptions or guarantees progress under arbitrary partitions. It addresses a particular rejoining-node disruption.

**Practice**

- [Cambridge Concurrent and Distributed Systems notes: Exercise 18](https://www.cl.cam.ac.uk/teaching/2122/ConcDisSys/dist-sys-notes.pdf) - Exercise 18, end of Section 6: three nodes' Raft logs, parts (a) to (d). Answer part (c) with the freshness rule now; return to part (b) after the commitment unit and part (d) after the repair unit. The notes use their own Raft pseudocode with `commitLength`, so translate to the paper's `commitIndex`. Pre-vote and transfer schedules stay with the section mini-project.

**Stop when:** Your vote handler passes the three freshness cases, your split-vote trace recovers in a later term, and you can explain the optional extensions without treating them as new authority rules.

<details>
<summary>Self-test</summary>

1. A candidate has the same last log term and index as the voter. Is freshness satisfied?
   - Yes. Equality passes freshness, but the voter must still satisfy the term and one-vote rules.
2. Why may a shorter log be more up-to-date?
   - Its last entry can have a newer term. Raft orders by last term before length; commitment safety also relies on the current-term commit restriction.
3. Can leadership transfer succeed if the target cannot obtain a majority?
   - No. The target must win an ordinary election. The proposed transfer aborts if it does not complete, rather than bypassing quorum rules.

</details>

#### U4. The AppendEntries consistency check and the log matching property

**About 6 h** · **Target:** Derive + Implement

Topics: AppendEntries consistency check; Log matching property

AppendEntries establishes a matching prefix, not just receipt of a message. That prefix is the evidence later used to advance commitment safely.

**You can now**

- Derive log matching by induction over successful AppendEntries transitions.
- Implement predecessor checks and idempotent appends for empty and nonempty RPCs.
- Track replication evidence separately from the next position to try.

**Study**

1. [Raft extended paper: prefix agreement](https://raft.github.io/raft.pdf) (In Search of an Understandable Consensus Algorithm) - Section 5.3, Log replication, through the Log Matching Property argument; Figure 2 AppendEntries receiver and leader rules; Figure 6.
2. [MIT 6.5840 Spring 2026 Lab 3B: basic agreement](https://pdos.csail.mit.edu/6.824/labs/lab-raft1.html) (MIT 6.5840 - Lab 3 Raft) - Part 3B: log, from `Start()` and `TestBasicAgree3B` through the election restriction. Depth: First reach basic agreement. Complete the repair and commitment cases in the next two units before claiming all of 3B is finished.

**Focus**

- Reject when `prevLogIndex` is absent or its term differs from `prevLogTerm`. A heartbeat is still AppendEntries and must run this check.
- One leader per term creates at most one command at each index in that term. The predecessor check then extends the identical-prefix property inductively.
- Successful replication proves agreement only through the request's last entry, or its predecessor for an empty request. Extra follower entries beyond that boundary are not evidence of agreement.
- `matchIndex` is confirmed replication evidence; `nextIndex` is a sending cursor that may move backward. Do not count the cursor as a successful acknowledgement.

**Reproduce:** Use 1-based log indexes and an agreed term-0 sentinel at index 0. The follower's entry terms are `[1, 1, 2]`. An RPC with predecessor index 3, predecessor term 3 and no entries must fail without modifying the log. An RPC with predecessor index 2, predecessor term 1 and one term-3 entry at index 3 succeeds and leaves `[1, 1, 3]`. Replay it: the log is unchanged. Explain the induction step without looking at Figure 2.

**Traps**

- Returning success immediately for an empty heartbeat, then letting the leader infer a prefix that was never checked.
- Advancing the follower commit boundary beyond the last index established by this request because the follower happens to have a longer suffix.
- Inferring matching prefixes from equal terms alone, ignoring the index and the protocol assumptions that made the entry unique.

**Practice**

- [MIT 6.5840 Spring 2026 Lab 3B: basic agreement](https://pdos.csail.mit.edu/6.824/labs/lab-raft1.html) - Part 3B; `TestBasicAgree3B`; run `make RUN="-run '^TestBasicAgree3B$'" raft1` from `src`. The public test checks three submitted commands agree at consecutive indexes. Add your own empty-RPC rejection and duplicate-delivery cases; this test alone does not establish log matching for adversarial histories.

**Stop when:** Basic agreement passes, the fixed rejection and duplicate traces match, and your prefix proof explains why the same checks apply to heartbeats.

<details>
<summary>Self-test</summary>

1. Does an empty AppendEntries prove that the whole follower log matches?
   - No. If successful it establishes a matching prefix through its predecessor index, not agreement on an unchecked suffix.
2. What happens when the predecessor index exists but its term differs?
   - Reject the RPC without appending or truncating. Repair follows a later request whose predecessor matches.
3. Why does delivering the same successful append twice not duplicate commands in the log?
   - Entries already present at the same indexes with matching terms are retained. Only missing entries are appended.

</details>

#### U5. Conflict truncation, log repair and slow-follower backtracking

**About 5 h** · **Target:** Implement

Topics: Conflict truncation and repair; Slow follower and backtracking

Leaders inherit followers with missing, extra and conflicting suffixes. Repair must tolerate reordered requests without turning an optimization into a destructive log rewrite.

**You can now**

- Implement first-conflict truncation while retaining matching suffix entries not contradicted by a request.
- Use rejection hints to backtrack by conflicting term rather than one index at a time.
- Diagnose slow catch-up using rejected requests and replication cursors.

**Study**

1. [Raft extended paper: divergent suffix repair](https://raft.github.io/raft.pdf) (In Search of an Understandable Consensus Algorithm) - Section 5.3, follower inconsistencies and `nextIndex` repair, pp. 7 to 8; Figure 7; Figure 2 receiver rules 2 to 4.
2. [MIT 6.5840 Spring 2026 Lab 3B and 3C: backtracking](https://pdos.csail.mit.edu/6.824/labs/lab-raft1.html) (MIT 6.5840 - Lab 3 Raft) - Part 3B: `TestBackup3B`; Part 3C: the `XTerm`, `XIndex`, `XLen` rejection-hint example. Depth: Read only the backtracking guidance from 3C here. Implement persistence in its own unit.

**Focus**

- After a matching predecessor, compare incoming entries in order. Delete the follower suffix only at the first same-index, different-term conflict, then append the remaining incoming entries.
- A short delayed request that matches existing entries must not truncate the follower merely because the request ends earlier than the log.
- If the leader lacks the conflicting term, jump to its first follower index. If it has that term, try after the leader's last entry of that term. A too-short follower needs a separate length hint.
- Tie reply handling to the relevant leader term and request. A delayed rejection must not undo newer confirmed progress or cause an endless backward/forward loop.

**Reproduce:** With 1-based entries and a sentinel at index 0, let the leader's term sequence be `[1, 1, 4, 4]` and the follower's `[1, 1, 2, 2, 2]`. A check at predecessor index 4 fails with conflicting term 2, first index 3. Since the leader lacks term 2, retry from index 3 using predecessor index 2, term 1. The follower becomes `[1, 1, 4, 4]`. Now deliver a shorter matching request ending at index 3: index 4 must remain.

**Traps**

- Truncating to the predecessor on every successful request, including duplicates and empty heartbeats.
- Using a length hint without documenting whether it includes the sentinel; translate it to an absolute next log index.
- Letting one slow follower block replication to all others. Send and track follower work independently.

**Practice**

- [MIT 6.5840 Spring 2026 Lab 3B: fast backup](https://pdos.csail.mit.edu/6.824/labs/lab-raft1.html) - Part 3B; `TestBackup3B`; run `make RUN="-run '^TestBackup3B$'" raft1` from `src`. The test builds long uncommitted suffixes in minority partitions, commits in other majorities, then reconnects all servers for agreement. Keep your own shorter-request regression too. Finish the whole 3B suite after the commitment unit.

**Stop when:** The fixed repair trace retains index 4 after the shorter request, and `TestBackup3B` passes without changing the public tests or the prefix check.

<details>
<summary>Self-test</summary>

1. The leader has the follower's conflicting term. Where does the optimized retry start?
   - Immediately after the leader's last entry in that term. The next predecessor check still decides whether the prefix actually matches.
2. A duplicate request contains no conflict but ends before the follower log. May it delete the tail?
   - No. Ending the request is not evidence of a conflicting entry. Retain the tail until an actual conflict is supplied.
3. Does a rejection-hint optimization change which histories can be committed?
   - No. It changes where the next consistency check starts, not the checks, election restrictions or commitment rules.

</details>

#### U6. Majority commitment, the current-term restriction, committed-entry preservation and leader completeness

**About 5 h** · **Target:** Derive

Topics: Majority quorum commitment; Current-term commit restriction; Committed-entry preservation; Leader completeness

A majority of copies is not a complete Raft commit rule. Figure 8 is the counterexample that connects the voting restriction to committed-entry preservation.

**You can now**

- Construct the counterexample to committing an older-term entry by replica count alone.
- Derive leader completeness from quorum intersection, freshness, log matching and current-term commitment.
- Explain why committing a current-term entry also commits the preceding prefix.

**Study**

1. [Raft extended paper: commitment and safety proof](https://raft.github.io/raft.pdf) (In Search of an Understandable Consensus Algorithm) - Sections 5.4.1 to 5.4.3; Figures 8 and 9; Figure 2 leader commit rule.
2. [MIT 6.5840 Spring 2026 Lab 3B: finish log agreement](https://pdos.csail.mit.edu/6.824/labs/lab-raft1.html) (MIT 6.5840 - Lab 3 Raft) - Part 3B: log, including `TestFailNoAgree3B` and the full 3B test list.

**Focus**

- The leader advances commitment by counting replication only at an index whose entry term equals its current term. Older entries become committed indirectly as part of that prefix.
- Intersection supplies a voter that saw the committed entry; freshness and log matching explain why that voter cannot elect the first later leader missing it. Intersection alone is not the proof.
- Keep each entry's original term during retransmission. A new leader cannot relabel an old entry to evade the current-term restriction.
- A follower learning a larger leader commit index advances only through the prefix established by that AppendEntries. Apply never runs ahead of local commitment.

**Reproduce:** Redraw Figure 8(a) through (d) closed-book, recording each server's log terms and the votes that allow the term-3 log to win after the older entry reached a majority in term 4. Explain why counting that older entry as committed was invalid. Then draw branch (e): a term-4 entry reaches a majority and commits the prefix. Identify the intersecting voter in Figure 9 and explain both last-log-term cases in the contradiction proof.

**Traps**

- Calling any majority-replicated old entry committed. The creator's term and the current leader's term are different cases.
- Assuming a newly elected leader already knows its full committed prefix. Possessing entries and knowing which are committed are separate facts.
- Asserting that the paper's Figure 8 test is a proof. Random leader failures sample related histories; the explicit counterexample and invariant argument still matter.

**Practice**

- [MIT 6.5840 Spring 2026 Lab 3B: complete log suite](https://pdos.csail.mit.edu/6.824/labs/lab-raft1.html) - Part 3B; run `make RUN="-run 3B" raft1` from `src`, including `TestFailNoAgree3B`. The no-agreement case disconnects a majority, checks that a new proposal does not commit, then reconnects and resumes agreement. Crash-recovery and Figure 8 stress testing come with 3C in the next unit.

**Stop when:** You reconstruct both Figure 8 branches and the leader-completeness argument without notes, and all Lab 3B tests pass while minority-only proposals remain uncommitted.

<details>
<summary>Self-test</summary>

1. A term-6 leader has an entry from term 4 on three of five servers. Can that count alone commit it?
   - No. The leader must commit a term-6 entry by majority replication, thereby committing the older prefix indirectly.
2. Why does a committed term-6 entry protect earlier entries in its log?
   - Leader completeness preserves that entry on future leaders, and log matching preserves its entire prefix.
3. Is a lost quorum permission to acknowledge writes locally?
   - No. The leader may accept uncommitted proposals, but cannot acknowledge them as committed under the majority contract.

</details>

#### U7. Ordered exactly-once application, persistent term, vote and log state, and crash and restart

**About 6 h** · **Target:** Implement

Topics: Ordered exactly-once state-machine application; Persistent term, vote and log state; Crash and restart behavior

Crash recovery is part of the consensus proof. A vote forgotten after a restart can invalidate election safety even when every live transition looked correct.

**You can now**

- Persist term, vote and log changes before issuing replies that rely on them.
- Restore application state and its applied boundary consistently across restart.
- Distinguish once-per-index application from deduplication of retried client operations.

**Study**

1. [Raft extended paper: durable protocol state and client retries](https://raft.github.io/raft.pdf) (In Search of an Understandable Consensus Algorithm) - Figure 2 persistent state and application rule; Section 5.5, Follower and candidate crashes; Section 8 client serial numbers and cached responses. Depth: Stop before Section 8 read-only queries; read paths have their own unit.
2. [MIT 6.5840 Spring 2026 Lab 3C: persistence](https://pdos.csail.mit.edu/6.824/labs/lab-raft1.html) (MIT 6.5840 - Lab 3 Raft) - Part 3C: persistence, `persist()`, `readPersist()`, `ReadRaftState()` and `Save()`, and the 3C tests.

**Focus**

- Persist `currentTerm`, `votedFor` and log updates before replying to RPCs that rely on the changes. Reload them before processing new traffic after restart.
- Apply committed entries in increasing index order. Replaying the log into fresh volatile application state is legitimate; reapplying it to already durable effects without a matching applied boundary is not.
- If application state survives restart, its applied index must survive consistently with it. Reuse the crash-consistent publication boundary from the storage section, rather than independently saving two unrelated values.
- The same client operation can occupy several log indexes after retry. Durable client identity, sequence state and cached replies suppress duplicate logical effects inside the replicated application; they do not make an external API call atomic with the log.

**Reproduce:** Draw a voter granting a term-5 vote to one candidate, crashing after the reply, and receiving another candidate's term-5 request after restart. With the saved vote it rejects; without it, a second vote can let two majorities elect different leaders. Then trace an increment committed and applied before a lost client reply. Show why a retry at another log index increments twice without client deduplication, but returns the saved result without another increment when deduplication state and application state recover together.

**Traps**

- Calling Lab 3C a test of disk flush or power-loss behavior. Its `Persister` simulates retained bytes; `loglab` must test the actual durable boundary separately.
- Persisting an applied index before the corresponding application update, or persisting the update but forgetting its applied index.
- Dropping duplicate-suppression state during snapshot or restart, then claiming exactly-once client semantics.

**Practice**

- [MIT 6.5840 Spring 2026 Lab 3C: retained-state recovery](https://pdos.csail.mit.edu/6.824/labs/lab-raft1.html) - Part 3C; `TestPersist13C`, `TestPersist23C`, `TestPersist33C`, `TestFigure83C` and the remaining 3C tests; run `make RUN="-run 3C" raft1` from `src`. The persistence tests crash and restart servers while agreement continues; Figure 8 stress repeatedly crashes leaders and finally asks all servers to agree. Preserve these public results separately from `loglab` storage-crash and client-retry evidence.

**Stop when:** Lab 3C passes with 3A and 3B still passing, and your recovery ledger covers both the vote-before-reply window and the application-state/deduplication boundary.

<details>
<summary>Self-test</summary>

1. Why is saving a granted vote after sending the reply unsafe?
   - A crash in between can erase the vote and permit a second vote in the same term, breaking the intersection argument.
2. Does once-per-index application imply once-per-client-request execution?
   - No. A retried request may appear at another index. The application needs a stable request identity and recovered deduplication state.
3. Can the paper's volatile applied index be reset on restart?
   - Yes if the application is rebuilt from a consistent snapshot or fresh state with the corresponding replay boundary. It is unsafe to replay old effects into retained application state without coordinating that boundary.

</details>

#### U8. Leader partitions, stale messages and fenced locks

**About 4 h** · **Target:** Explain + Implement

Topics: Leader partition and stale messages; Fenced locks and stale-holder rejection

The earlier unit on leases, process pauses and fencing tokens showed why a lease alone cannot protect a resource. Raft protects its log from stale authority; a protected file or service needs its own enforcement, not faith in the client's lease checks.

**You can now**

- Walk an old leader's partition, higher-term replacement and delayed-message rejection.
- Build a fenced lock using committed acquisition order and a resource-side enforcement boundary.
- State precisely when a stale holder loses permission to affect the protected resource.

**Study**

1. [Raft extended paper: obsolete authority](https://raft.github.io/raft.pdf) (In Search of an Understandable Consensus Algorithm) - Section 5.1 term comparison; Figure 2 all-server higher-term rule and stale-term RPC rejection; Section 8 isolated-leader read hazard.
2. [How to do distributed locking (8 February 2016): resource enforcement](https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html) (How to Do Distributed Locking (Kleppmann, 2016) - Fencing Tokens) - Protecting a resource with a lock; Making the lock safe with fencing, including tokens 33 and 34. Depth: Use the pause and fencing derivation. Skip the dated Redlock implementation critique.
3. [DDIA, 2nd edition: consensus-backed coordination](https://dataintensive.net/) (DDIA 2e - Chapter 10 Consistency and Consensus) - Chapter 10, Consistency and Consensus: Using shared logs, pp. 433 to 434; Coordination Services, pp. 437 to 438. Depth: Read the shared-log counter and the coordination-service features, not the intervening protocol survey.

**Focus**

- An old leader can remain unaware of replacement. It cannot commit alone, but a client that already holds a token can still send external requests.
- Issue each acquisition token from committed, applied lock state. An acquisition's log index can distinguish acquisitions within one term; a term alone cannot distinguish successive holders in that term.
- At the protected resource, atomically check the token and update the remembered maximum with the effect. Persist that maximum consistently with the effect across restart.
- A remembered maximum rejects an older token after a higher token has reached the resource, not immediately when a lease expires elsewhere. For revocation before new-owner activation, add an authoritative ownership check or an explicit fencing-installation handshake.

**Reproduce:** Trace the essay's order: holder 1 pauses with token 33; holder 2 acquires token 34 and the resource accepts its write; holder 1 resumes and its token-33 write is rejected. Restart the resource from its durable token and effect state and reject token 33 again. Reverse the two resource arrivals and explain why a maximum-token check alone cannot know that token 34 was granted but has not arrived. Keep the two guarantees separate.

**Traps**

- Returning a token for an uncommitted proposal. Its log position may be overwritten or reused for another command.
- Treating a fencing token as a request-deduplication key. Several authorized writes may share a holder token; retries need their own identity.
- Checking ownership at the client before an external write. A pause or delayed packet can occur after the check.

**Practice**

- The section mini-project covers this: a committed `loglab` lock acquisition, resource-side fencing with durable token state, stale-holder replay and an explicit new-owner activation boundary.

**Stop when:** The delayed old-holder effect fails after higher-token installation and after resource restart, and your contract explicitly covers the gap between grant and resource activation.

<details>
<summary>Self-test</summary>

1. Why is the leader term alone insufficient as a lock-acquisition token?
   - Multiple acquisitions can occur in one leader term. They need distinct ordered tokens, such as their committed acquisition indexes.
2. Must equal-token writes always be rejected?
   - No. A holder may make several writes. Define the equal-token policy and separately deduplicate request IDs; reject tokens older than the installed maximum.
3. Does token 34 being granted instantly make token 33 fail at an uninformed resource?
   - No. The resource must learn the higher token or validate current authority. A local maximum-token check cannot infer an unseen grant.

</details>

#### U9. Snapshot creation, log compaction and snapshot installation

**About 6 h** · **Target:** Implement

Topics: Snapshot creation and log compaction; Snapshot installation

Compaction removes the very entries used by prefix checks and replay. The snapshot must replace both their state and the metadata needed to connect the surviving tail.

**You can now**

- Create a snapshot of an applied committed prefix with its index, term and application recovery state.
- Install snapshots without regressing application state or retaining a conflicting suffix.
- Recover a consistent snapshot and log tail after a crash.

**Study**

1. [Raft extended paper: snapshot boundary](https://raft.github.io/raft.pdf) (In Search of an Understandable Consensus Algorithm) - Section 7, Log compaction; Figures 12 and 13. Depth: Understand chunked installation but implement one whole-snapshot RPC as Lab 3D requires. Incremental compaction and copy-on-write optimization are not required.
2. [MIT 6.5840 Spring 2026 Lab 3D: log compaction](https://pdos.csail.mit.edu/6.824/labs/lab-raft1.html) (MIT 6.5840 - Lab 3 Raft) - Part 3D: log compaction, including `Snapshot()`, `InstallSnapshot`, restart application ordering and `persister.Save()`.

**Focus**

- Snapshot only state through an applied committed index. Keep the last included index and term as the predecessor anchor for the first retained entry.
- Use absolute log indexes after compaction and translate them to local storage offsets in one place. An array offset is no longer the protocol index.
- Retain the suffix after an installed snapshot only if the local entry at its boundary has the same index and term. Do not let a delayed snapshot roll back an already newer applied state.
- Recover snapshot data, boundary metadata, client deduplication state and any configuration consistently. Publish the replacement durably before deleting the recovery data it supersedes.

**Reproduce:** Draw a snapshot through index 5 whose last included term is 2. The next AppendEntries anchor is index 5, term 2 even though entries 1 through 5 are no longer stored as ordinary entries. For installation, compare a follower that has that same boundary and a tail against one whose entry at index 5 has a different term: retain the first tail, discard the conflicting one. Finally trace a delayed snapshot older than the service's applied boundary and show that application state does not move backward.

**Traps**

- Snapshotting the log's last index even though the application has not applied that prefix.
- Saving new boundary metadata with old snapshot contents, producing a recovery image that claims effects it does not contain.
- Passing a missing snapshot to a later persistence update after compaction and thereby losing the saved application prefix.

**Practice**

- [MIT 6.5840 Spring 2026 Lab 3D: snapshots](https://pdos.csail.mit.edu/6.824/labs/lab-raft1.html) - Part 3D; run `make RUN="-run 3D" raft1` from `src`; include `TestSnapshotInstall3D`, `TestSnapshotAllCrash3D` and `TestSnapshotInit3D`. The suite exercises compaction, disconnected or crashed laggards, unreliable delivery and snapshot recovery. The initialization test writes state after restart, crashes again and checks further agreement. Keep earlier lab parts passing too.

**Stop when:** All 3D tests pass with earlier parts intact, and your boundary traces explain retained versus discarded tails and non-regressing application state.

<details>
<summary>Self-test</summary>

1. Why retain the last included term after deleting the prefix?
   - It supplies the predecessor term for consistency checks immediately after the snapshot boundary.
2. May a follower keep an uncommitted tail when the snapshot boundary conflicts?
   - No. That tail is not anchored to the installed prefix and must be discarded. A matching boundary permits retaining the following tail.
3. Does a successful Lab 3D run demonstrate atomic disk publication?
   - No. It exercises the lab's simulated persistence. Actual partial snapshot and publication crashes need the durable-storage tests in `loglab`.

</details>

#### U10. Membership change safety and joint consensus

**About 5 h** · **Target:** Derive + Implement

Topics: Membership change safety; Joint-consensus membership implementation

The earlier quorum arguments assumed one fixed voter universe. Reconfiguration must preserve the argument while servers learn about the change at different times.

**You can now**

- Construct disjoint old and new majorities under an unsafe direct configuration switch.
- Derive the separate-majority predicate for joint elections and commitment.
- Optionally implement a serialized joint-consensus transition with crash and snapshot recovery.

**Study**

1. [Raft extended paper: joint membership transition](https://raft.github.io/raft.pdf) (In Search of an Understandable Consensus Algorithm) - Section 6, Cluster membership changes; Figures 10 and 11.
2. [Ongaro's 2014 thesis: joint-consensus algorithm](https://web.stanford.edu/~ouster/cgi-bin/papers/OngaroPhD.pdf) (Consensus: Bridging Theory and Practice (Ongaro, 2014)) - Section 4.3, Arbitrary configuration changes using joint consensus, including Figure 4.8. Depth: Use this variant consistently for the optional implementation. Do not mix its configuration activation rules with the thesis's single-server variant or a library's different activation rule.

**Focus**

- Joint consensus needs a majority of the old configuration and a majority of the new one, for elections and commitment. A majority of their union is not equivalent.
- In this paper's variant a server uses the latest configuration stored in its log, even before commitment. Commit the joint configuration under both majorities before proposing the new-only configuration.
- Catch up new servers as nonvoters before changing the voter set. A removed leader steps down when the new-only entry commits; it cannot count itself in a configuration that excludes it.
- Serialize configuration changes and preserve configuration state through snapshots and restart. Voter membership is protocol state, not an independently edited discovery list.

**Reproduce:** Take old voters A, B, C and new voters C, D, E. Under a direct switch, A and B form an old majority while D and E form a disjoint new majority. Under joint consensus, A, B, C is a majority of the union but fails the new majority. A, C, D satisfies both. Enumerate the subsets by hand or with Python 3 and verify these verdicts, then trace joint commitment followed by new-only commitment with a leader crash between them.

**Traps**

- Waiting to activate the joint entry until it commits while otherwise following the paper's activate-on-storage algorithm.
- Removing a failed voter locally just to restore a majority. This changes the quorum universe without the required transition.
- Assuming MIT Lab 3 tests membership changes. The handout explicitly excludes Section 6.

**Practice**

- The section mini-project covers this: configuration-aware quorum enumeration and a joint-transition crash trace in `loglab`; optional implementation adds serialized reconfiguration and snapshot/restart tests without changing the fixed-membership core gate.

**Stop when:** Your quorum table rejects the union-majority counterexample and your trace identifies the configuration used at each decision; optional implementation preserves committed entries across the transition crash.

<details>
<summary>Self-test</summary>

1. Why is a majority of the union insufficient for the two three-voter configurations?
   - A, B, C has three of the five union members but only C from the new configuration. Joint consensus requires two from each three-voter set.
2. May the leader propose new-only membership before joint membership commits?
   - Not in this algorithm. Committing the joint entry first establishes the transition needed to rule out independent old-only decisions.
3. Does catching up a new nonvoter increase the current election quorum?
   - No. Replication to a nonvoter does not make it eligible to vote or count toward the current majority.

</details>

#### U11. Linearizable read paths, ReadIndex and lease reads

**About 8 h** · **Target:** Derive + Implement

Topics: Linearizable read paths; ReadIndex and quorum confirmation; Lease reads and clock assumptions

A safe write log does not automatically give safe reads. The read must establish both authority and a sufficiently applied state while it is in flight.

**You can now**

- Derive why a leader-local read can violate linearizability after a partition.
- Implement a ReadIndex path with current-term commitment, fresh quorum confirmation and an application barrier.
- State the clock and leadership-transfer assumptions that lease reads add to safety.

**Study**

1. [Raft extended paper: read-only operations](https://raft.github.io/raft.pdf) (In Search of an Understandable Consensus Algorithm) - Section 8, read-only operations: current-term no-op commitment and heartbeat confirmation.
2. [Ongaro's 2014 thesis: ReadIndex and leases](https://web.stanford.edu/~ouster/cgi-bin/papers/OngaroPhD.pdf) (Consensus: Bridging Theory and Practice (Ongaro, 2014)) - Section 6.4, steps 1 to 5 and follower reads; Section 6.4.1 through the clock-drift warning after Figure 6.3. Depth: Implement quorum-confirmed reads. Derive the lease assumptions only; stop before the sequential-consistency fallback extension.
3. [etcd v3.7: read consistency contract (page read 2026-10-15)](https://etcd.io/docs/v3.7/learning/api_guarantees/) (etcd v3.7 API Guarantees and the etcd-io/raft Library) - KV APIs: Strict serializability, Linearizability and the `serializable` read-mode paragraph. Depth: Use the invocation-to-response definition, not the following claim about the most current value at completion. A concurrent write need not be reflected by the read.

**Focus**

- Logging and committing a read command is a simple baseline. Bypassing the log still requires a committed current-term entry before using the leader's commit boundary.
- Capture `readIndex`, confirm leadership with a new quorum heartbeat round associated with the pending read, then wait until the serving state machine has applied through `readIndex` before querying it.
- Old heartbeat acknowledgements cannot certify a later read. A follower also needs a safe index from the leader and its own application barrier; merely receiving a heartbeat is insufficient.
- Lease reads replace fresh communication with a timing promise. They require bounded relative clock drift, conservative lease accounting and expiry before leadership transfer; pauses and clock behavior must respect that model. Raft write safety alone supplies none of these bounds.

**Reproduce:** Trace a read received after a new leader has committed a write while the old leader remains isolated: an immediate old-leader reply is stale. On the quorum-confirmed path, set the saved read index to 8 and the serving applied index to 6. Even after a fresh quorum confirms the read round, the read waits for application through index 8. Delay an acknowledgement from an earlier round and show it cannot release this barrier. Repeat with a follower as the serving state machine.

**Traps**

- Confusing log possession, commitment knowledge and state-machine application. Each is a separate prerequisite.
- Treating etcd's `serializable` read option as equivalent to its default linearizable reads. It permits stale data.
- Demanding the value latest at response time. Linearizability permits a point anywhere inside the operation interval, so an overlapping write can be ordered after the read.

**Practice**

- [MIT 6.5840 Spring 2026 Lab 4: fault-tolerant key/value service, Parts A and B](https://pdos.csail.mit.edu/6.824/labs/lab-kvraft1.html) - Part A: replicated state machine (`make RUN="-run 4A" rsm1`); Part B: key/value service without snapshots (`make RUN="-run 4B" kvraft1`), including `TestPersistPartitionUnreliableLinearizable4B`; run from `src`. Part A builds the replicated state machine layer on your Lab 3 Raft. Part B enters every `Get` in the log, the simple baseline from Section 8, and its tests check linearizable histories. Keep solutions private. The quorum-confirmed read path with old-round replies and a lagging applied index stays with the section mini-project.

**Stop when:** The isolated old leader cannot return a successful stale linearizable read, and neither old-round acknowledgements nor a lagging applied index can release your read barrier.

<details>
<summary>Self-test</summary>

1. A read's quorum round finished but application is behind its saved index. Can it reply?
   - Not yet. The serving state machine must first apply through the saved read index.
2. Must a read include a write that completed before the read was invoked?
   - Yes, or a later overwriting value. It need not include every write concurrent with the read.
3. Does switching to a monotonic clock alone justify lease reads?
   - No. Monotonicity does not bound relative rates or pauses. The lease proof needs explicit timing bounds and coordination with elections and transfer.

</details>

#### U12. A deterministic message scheduler with seeded random schedules

**About 4 h** · **Target:** Implement

Topics: Deterministic message scheduler; Random schedule generation with seeds

The Systems unit on distributed histories and deterministic failure simulation built the harness; extend it rather than rebuilding a broadcast harness. Consensus needs control of vote durability, log publication and stale replies as well as packet delivery.

**You can now**

- Drive the consensus core using explicit message, timer and persistence-completion events.
- Generate bounded seeded schedules with loss, duplication, reordering, partition and restart.
- Replay an explicit event history independently of subsequent random draws.

**Study**

1. [etcd-io/raft: deterministic core and I/O adapter](https://github.com/etcd-io/raft/blob/638f42739b77572b5708eb0d8a776a272ade71ed/README.md) (etcd v3.7 API Guarantees and the etcd-io/raft Library) - Opening design paragraphs on determinism; Usage, responsibilities after creating a Node and abstract ticks. Depth: Study the separation of protocol, storage and transport. Do not replace your lab implementation with the library or copy its asynchronous I/O optimizations.
2. [DSLabs framework: message and timer transitions](https://github.com/emichael/dslabs/blob/49c4a1f9ed59547501376dd3ccfcdd9c1eb7b427/README.md) (DSLabs - Lab 3 Paxos) - Programming Model; Testing and Model Checking, definition of a successor by one pending message or timer delivery. Depth: Read the execution model, not the Java lab sequence. Port the event boundary to your Python 3 or Go harness.
3. [Replicated Log and Stream Processor: fault-schedule evidence](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-2/replicated-log-stream-processor.md) (Replicated Log and Stream Processor - Consensus Slice) - Architecture constraints; Milestone B - Instrumentation; Milestone D - Failure handling. Depth: Apply these requirements only to the consensus slice of `loglab`, running locally on your machine.

**Focus**

- Make the core a transition function. Its adapter decides when messages arrive, timers fire and writes become durable; completion events must obey the persistence-before-reply contract.
- Keep a stable ordering of enabled events, explicit logical time and owned random generators. A seed cannot control map iteration, goroutine races, wall clocks or external I/O that bypass the scheduler.
- Give events stable IDs and retain their payloads, sender incarnation, term and prerequisites. Save the exact chosen event stream as well as seed, tool version and initial configuration.
- Bound discovery campaigns. After a fault phase, include a healing phase with delivered messages, completed writes and fair timers when testing recovery; an adversarial scheduler can otherwise suppress progress forever.

**Reproduce:** Extend the existing scheduler with a pending durable-write completion. Hold a vote write incomplete and confirm no successful vote reply is emitted; release completion and then permit the reply. Add a script that duplicates a message, delays its copy across a restart, partitions and heals a link. Record every chosen action and resulting core output. Run the same seed and initial state twice under one pinned Python 3 or Go version, then replay the recorded actions with random selection disabled: all three normalized transition traces must match.

**Traps**

- Recording only a seed. Code changes or an extra random draw can change the entire later schedule.
- Deleting every in-flight packet on a process crash without declaring that network model. Delayed pre-crash messages are essential stale-message cases.
- Calling the MIT randomized concurrent test suite deterministic replay. It is useful independent evidence, but the controlled `loglab` event model is a different test layer.

**Practice**

- The section mini-project covers this: the `loglab` deterministic consensus scheduler, seeded fault campaigns, explicit durable-write completions and event-stream replay independent of the seed.

**Stop when:** The vote reply waits for durability, delayed duplicates survive the declared crash model, and seeded rerun plus explicit replay produce identical normalized transition traces.

<details>
<summary>Self-test</summary>

1. Why model storage completion as an event rather than an immediate assignment?
   - It exposes crashes and delays between changing volatile state, making it durable and sending a reply, so the ordering contract can actually be tested.
2. Does replaying the same message sequence suffice if the core reads wall-clock time?
   - No. Time readings can change transitions. Model time explicitly or record and replay every time input.
3. Why add a healing phase to a recovery test?
   - Without eventual delivery, stable participants and fair scheduling, lack of progress may be imposed entirely by the environment rather than a protocol defect.

</details>

#### U13. Invariant checks after every transition and failure-history minimization

**About 5 h** · **Target:** Implement

Topics: Invariant checks after every transition; Failure-history minimization

The Programming unit on property, metamorphic and differential testing with shrinking taught generic shrinking. A consensus failure must retain the causal schedule and violated property, not just a failed final assertion or an opaque random seed.

**You can now**

- Check election, log, commitment and application invariants after every simulated transition.
- Demonstrate that a planted consensus bug is detected by an independent monitor.
- Reduce a violating or non-progressing history while preserving its named predicate and environmental preconditions.

**Study**

1. [Raft extended paper: monitor obligations](https://raft.github.io/raft.pdf) (In Search of an Understandable Consensus Algorithm) - Figure 3, all five properties; Section 5.4.3, safety argument.
2. [DSLabs: invariant search and trace reduction](https://github.com/emichael/dslabs/blob/49c4a1f9ed59547501376dd3ccfcdd9c1eb7b427/README.md) (DSLabs - Lab 3 Paxos) - Testing and Model Checking: successor states, invariants, traces and pruning. Depth: Study bounded exploration and witness production, not a second consensus implementation.
3. [DSLabs: deletion-based trace minimizer](https://github.com/emichael/dslabs/blob/49c4a1f9ed59547501376dd3ccfcdd9c1eb7b427/framework/tst/dslabs/framework/testing/search/TraceMinimizer.java) (DSLabs - Lab 3 Paxos) - `minimizeTrace`, `stateMatches` and `applyEvents`. Depth: Read the repeated deletion and replay pattern. Implement your own reducer around the `loglab` event schema; no Java build is required.

**Focus**

- Maintain historical elected-leader and committed-entry ledgers outside the implementation. Checking only current roles or current logs misses a violation erased by step-down or compaction.
- Check log matching on comparable retained entries and preserve enough oracle prefix data to check across snapshots. Check applied commands against an independent committed-prefix ledger, not the implementation's own commit function.
- Try deleting events, replay from the initial state and keep a deletion only if the same failure predicate survives. Reject invalid replays or explicitly repair dependencies; do not accept an unrelated exception as success.
- For a non-progress witness, preserve a submitted request, a reachable majority, a declared healing suffix and a fixed observation horizon. No commit by that horizon is a bounded predicate, not proof of infinite livelock.

**Reproduce:** Plant a bug that permits a server to vote for a second candidate in the same term. In a three-voter schedule, give each of two candidates its own vote and let the third voter vote for both; the historical election monitor must reject the second majority. Surround the causal steps with unrelated timer and message events. Reduce the trace by deletion and full replay until no single removable event preserves the same violation. Restore the vote rule and preserve the reduced trace as a regression that no longer violates election safety.

**Traps**

- Checking invariants only after the network heals, when conflicting leaders or overwritten entries may no longer be visible.
- Calling a greedy deletion result the globally shortest trace. It is only minimal under the deletion moves and validity policy you tried.
- Shrinking a recovery stall into a schedule with no client request or no fair healing phase, thereby changing the question.

**Practice**

- The section mini-project covers this: per-transition `loglab` invariant monitors, a planted-bug negative control, minimized safety regression and one minimized bounded non-progress history with its assumptions retained.

**Stop when:** The monitor catches the planted double vote, the reduced valid witness replays and fails only with the bug, and a separate reduced stall retains its request, healing assumptions and observation horizon.

<details>
<summary>Self-test</summary>

1. Why record elected leaders historically instead of counting current leader roles?
   - Two different leaders might have been elected in the same term at different moments. A current-role snapshot can hide the earlier election.
2. A reduced trace now fails because a message ID does not exist. Is that a valid smaller consensus failure?
   - No. It is an invalid replay unless the reducer's declared dependency policy repairs it and the original consensus predicate still fails.
3. All sampled schedules pass. What has been established?
   - No monitored violation was found in those bounded schedules under the stated model. This is neither an unbounded proof nor evidence for unmodeled disk or runtime behavior.

</details>

#### U14. Election, commit, recovery, message and snapshot costs and availability versus safety diagnosis

**About 4 h** · **Target:** Measure

Topics: Election, commit and recovery latency measurement; Message and snapshot cost measurement; Availability versus safety diagnosis

A slow consensus group can be waiting safely for a quorum or repeatedly losing leadership. A fast one can still acknowledge unsafe work. Diagnose correctness first, then attribute the costs.

**You can now**

- Measure election, commit, application and recovery intervals with explicit event boundaries.
- Attribute protocol messages, encoded bytes and snapshot creation, transfer and replay costs.
- Diagnose lost progress separately from violated safety using histories and invariant evidence.
- Compare matched fault regimes without turning local timings into universal targets.

**Study**

1. [Raft extended paper: progress and cost mechanisms](https://raft.github.io/raft.pdf) (In Search of an Understandable Consensus Algorithm) - Section 5.6, Timing and availability; Section 7 final two snapshot-performance issues; Section 9.3, Performance, and Figure 16. Depth: Extract the measurement boundaries and workload setup, not the paper's millisecond values as targets.
2. [MIT 6.5840 Spring 2026 Lab 3: cost sanity checks](https://pdos.csail.mit.edu/6.824/labs/lab-raft1.html) (MIT 6.5840 - Lab 3 Raft) - Part 3A explanation of Passed-line counters; Part 3B `TestRPCBytes3B` and `TestCount3B`. Depth: Use the public counters as bounded sanity checks. Inspect the test code before assigning meanings to totals; printed reference timings are not targets for your machine.
3. [Replicated Log and Stream Processor: consensus measurements](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-2/replicated-log-stream-processor.md) (Replicated Log and Stream Processor - Consensus Slice) - Milestones B, D and E; Correctness requirements; Measurement requirements. Depth: Measure only the consensus log and snapshot slice here, not the later stream-processing pipeline.

**Focus**

- Define failure-to-election, request-to-commit, commit-to-apply, request-to-reply and restart-to-catch-up separately. Logical ticks describe simulated ordering; wall-clock time measures the local implementation.
- An established five-voter leader needs itself and two followers for a majority. The critical acknowledgements depend on persistence and network scheduling, not automatically the slowest follower or just one network round trip.
- Count requests and responses separately from client messages, heartbeats, retries and commit notifications. Report encoded bytes as well as counts; snapshot creation, installation, transferred bytes and tail replay are distinct costs.
- Use matched workload, command size, concurrency, voter count, durability mode, snapshot threshold and fault schedule. Record versions, seeds, repeated-run spread, offered work, successful work and timeouts; preserve raw histories and monitor verdicts.

**Reproduce:** Construct a synthetic five-voter timeline in logical ticks, not milliseconds. The leader receives one current-term command at tick 0, persists at tick 1, then sends one append to each follower. Successful durable-replication replies arrive at ticks 3, 5, 9 and 12; no other traffic or failures occur. It can commit at tick 5, applies at tick 6 and replies to the client at tick 7. Count eight protocol messages once all four request/reply pairs finish, excluding the client pair and later commit notification. Compare these distinct intervals, then use the same event boundaries in your local measurement campaign.

**Traps**

- Reporting only successful-operation latency during a partition while omitting blocked or timed-out requests from the availability denominator.
- Reducing election timeouts until one run is fast, then interpreting repeated elections under load as a safety requirement to weaken votes or quorums.
- Calling catch-up complete merely when a leader is elected. A restarted node may still need snapshot installation, tail replication and application.

**Practice**

- The section mini-project covers this: matched local `loglab` baseline, leader-partition, restart/catch-up and snapshot campaigns, with latency distributions, throughput, message/byte costs, timeout counts and invariant-based diagnosis.

**Stop when:** Your dossier reproduces the synthetic counts, labels local timing distributions with their setup and spread, and explains one bounded stall without weakening the safety contract or hiding unsuccessful requests.

<details>
<summary>Self-test</summary>

1. Why does the synthetic command commit at tick 5 rather than tick 12?
   - The leader is already durable and the second follower acknowledgement arrives at tick 5, giving three of five durable copies of a current-term entry. The other two followers are not required for that commitment.
2. A majority is unreachable and no new commands commit. Is that a safety failure?
   - Not by itself. It is expected unavailability under the majority contract. A conflicting application or lost committed entry would be a safety failure.
3. Does adding a voter necessarily increase measured latency?
   - No. It changes quorum size, order statistics and traffic, but the observed effect depends on topology, batching, scheduling and storage. Measure matched configurations rather than assert a universal direction.
4. What should a recovery-stall report include beyond a graph?
   - A replayable history, the bounded non-progress predicate, quorum and timing assumptions, invariant results and the event where progress resumes or its missing prerequisite.

</details>

### Mini-project: Consensus log with durable authority and replayable counterexamples

**About 18 to 24 hours.** Replace `loglab`'s promotion controller with a reduced Raft core in `consensus/`, retaining the existing protocol, storage and history boundaries. Establish timing-free safety before measuring progress on your machine, and keep public lab evidence distinct from actual storage recovery and external-resource fencing.

1. Build the Raft transition core with an invariant ledger, fault model and acceptance, persistence, commit, apply and reply events. Check elections, freshness, prefix matching, backtracking and current-term commitment against the Raft paper and MIT 6.5840 Lab 3A/3B; retain proofs and adversarial traces.
2. Connect durable term, vote and log state to `storage/`; recover application, applied boundary and client deduplication together. Add snapshots with index, term and recoverable state; check against single-node replay. Retain publication-crash, partial-snapshot, stale-install and retry regressions separately from MIT Lab 3C/3D results.
3. Implement quorum-confirmed reads after current-term commitment, with fresh round identity and an application barrier for leader and follower service. Check partitioned old leaders, old-round replies and lagging application with the register oracle; retain histories alongside MIT Lab 4A/4B's logged-read baseline and lease-assumption derivation.
4. Issue committed lock tokens and atomically persist resource fencing with effects; test stale holders across restart and new-owner activation. Independently enumerate joint quorums and trace a transition crash against the paper's activation rules; retain both counterexamples, keeping full reconfiguration optional and the core fixed-membership.
5. Extend `net/` with explicit timer, message and durable-write completions. Check vote-before-reply ordering against the persistence contract; retain seeded loss, duplication, reordering, partition and restart campaigns plus seed-independent event replay. Include healing, split-vote, pre-vote and transfer traces checked against the thesis's rules without requiring optional extensions.
6. Monitor every transition using independent historical election, committed-prefix and application ledgers that survive compaction. Plant a double-vote bug and minimize its safety witness, then minimize a bounded stall preserving its request, reachable majority and healing assumptions; retain replay regressions and classify each predicate separately.
7. After deterministic gates, run repeated matched baseline, leader-partition, restart/catch-up and snapshot campaigns on your machine. Validate counters against hand-counted traces; retain versions, workloads, durability settings, raw histories, invariant verdicts, election/commit/apply/reply distributions, throughput, message/byte costs, snapshot costs, timeouts and incomplete recoveries, distinguishing logical from measured time.

**Deliverables**

- The `consensus/` core, durable adapter, read barriers, fenced-resource fixture and explicit assumption and invariant ledger.
- Public lab results plus independent `history/` checks, storage-crash tests, joint-quorum enumeration and minimized schedules in `faults/` and `tests/`.
- Raw protocol, storage and snapshot traces with repeated matched measurements and bounded-stall diagnosis in `reports/`.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [MIT 6.5840 Spring 2026 Lab 3: Raft, Parts A through D](https://pdos.csail.mit.edu/6.824/labs/lab-raft1.html). Retain election, agreement, simulated persistence and snapshot results; keep course-interface adapters or private Go lab solutions separate from language-independent core evidence.
- external-tests: [MIT 6.5840 Spring 2026 Lab 4: key/value service, Parts A and B](https://pdos.csail.mit.edu/6.824/labs/lab-kvraft1.html). Retain logged-read baseline results; these do not replace your fresh-quorum read-barrier, durable-publication or fencing tests.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Durable replicated safety | Your independent ledgers validate elections, matching prefixes, preserved commitments and ordered application; replay-oracle tests cover storage publication, snapshots and client deduplication beyond the public lab's simulated persistence. | The planted bug fails before repair and passes afterward on the same minimized schedule; historical monitors still detect violations hidden by step-down or compaction. |
| Authority and read boundaries | Your register checker validates read histories despite stale rounds and application lag; resource tests enforce durable fencing after activation. Independent quorum enumeration rejects union-majority shortcuts in the joint-transition trace. | Leader and follower reads share tested barriers; the defense distinguishes grant from resource activation, states lease assumptions, and preserves configuration state in optional reconfiguration recovery tests. |
| Replay and diagnosis | Recorded events replay without random selection; reduced safety and bounded-stall predicates remain distinct. Hand-counted counters validate repeated matched measurements with named versions, workload, timeouts, costs and invariant verdicts. | The stall retains environmental preconditions and an explained missing prerequisite; reports separate simulated time from measured distributions and retain incomplete recovery rather than hiding it. |

Feeds into: Committed log order, read barriers, snapshot recovery and fenced authority feed shard ownership and stream visibility. Replayable counterexamples, joint-quorum arguments and measured recovery costs become capstone correctness and diagnosis evidence.

### Resource route

- **Primary - Course and lab:** [MIT 6.5840 - Lab 3 Raft](https://pdos.csail.mit.edu/6.824/labs/lab-raft1.html) - Complete Spring 2026 Lab 3A to 3D in order with the extended Raft paper, keeping the official tests (`make RUN="-run 3A" raft1` and so on). The labs leave out membership change (Section 6) and lease reads, so those units use the paper. Then add deterministic message schedules, durable crash injection, state-machine invariants and minimized traces in your own harness.
- **Required - Paper:** [In Search of an Understandable Consensus Algorithm](https://raft.github.io/raft.pdf) - Read the extended Raft paper alongside each lab part. Maintain a one-page invariant ledger for election safety, log matching, leader completeness, state-machine safety and membership change.
- **Required - Paper:** [Consensus: Bridging Theory and Practice (Ongaro, 2014)](https://web.stanford.edu/~ouster/cgi-bin/papers/OngaroPhD.pdf) - Use the thesis where the paper and the labs stop: Section 3.10 (leadership transfer), Chapter 4 (single-server membership changes, catching up new servers, removing the leader, disruptive servers, joint consensus), Section 6.4 (ReadIndex and lease-based read-only queries) and Section 9.6 (pre-vote).
- **Support - Paper:** [Paxos Made Simple (Lamport, 2001)](https://lamport.azurewebsites.net/pubs/paxos-simple.pdf) - Read single-decree Paxos (prepare and accept phases, the safety argument) and the closing sketch of a replicated state machine, then map ballots to Raft terms. It is single-decree; a log needs the Multi-Paxos ordering layer.
- **Support - Paper:** [Impossibility of Distributed Consensus with One Faulty Process (Fischer, Lynch and Paterson, 1985)](https://groups.csail.mit.edu/tds/papers/Lynch/jacm85.pdf) - Read the model and the main theorem. It covers deterministic asynchronous consensus with one crash and says nothing against randomized or timeout-based protocols, which is why Raft needs timeouts only for liveness.
- **Support - Paper:** [ZooKeeper: Wait-free Coordination for Internet-scale Systems (Hunt et al., 2010)](https://pdos.csail.mit.edu/6.824/papers/zookeeper.pdf) - Read the ordering guarantees, sessions and the Zab-based implementation, as MIT Lecture 9 does. Writes are linearizable; reads are served locally and may be stale unless preceded by `sync`.
- **Support - Paper:** [The Chubby Lock Service for Loosely-Coupled Distributed Systems (Burrows, 2006)](https://static.googleusercontent.com/media/research.google.com/en//archive/chubby-osdi06.pdf) - Read the design sections on locks, sequencers and lock-delay and the Paxos-backed cell. Its locks are advisory; sequencers are how a resource rejects a stale holder.
- **Support - Reference:** [etcd v3.7 API Guarantees and the etcd-io/raft Library](https://etcd.io/docs/v3.7/learning/api_guarantees/) - Read the API guarantees page (strict serializability and revisions, linearizable versus serializable reads, leases, watch guarantees, uncertain outcomes after a timeout) and the raft library README (https://github.com/etcd-io/raft) for how a production library splits the protocol from storage and network.
- **Support - Reference:** [Cambridge Concurrent and Distributed Systems Notes (Kleppmann) - Consensus and Raft](https://www.cl.cam.ac.uk/teaching/2122/ConcDisSys/dist-sys-notes.pdf) - Use Chapter 6 (consensus, FLP and Raft election, replication and commitment) as a second explanation of the protocol, and work Exercise 18 (three Raft logs) before Lab 3B.
- **Required - Book:** [DDIA 2e - Chapter 10 Consistency and Consensus](https://dataintensive.net/) - Read consensus, total-order broadcast, linearizable storage and coordination sections after the first Raft implementation. Compare abstraction boundaries rather than memorizing protocol names.
- **Optional - Practice:** [Building Distributed Systems - The Elector and The Consensus](https://builddistributedsystem.com/tracks/consensus) - Only the first three tasks of each track are free: in The Elector, node states, heartbeats and randomized timeouts; in The Consensus, log replication, log matching and commitment. Tasks are graded in the browser after login, so treat a pass as a drill and keep your local harness as the evidence. 
- **Support - Reference:** [How to Do Distributed Locking (Kleppmann, 2016) - Fencing Tokens](https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html) - Reread the fencing-token section when you add a lock or lease on top of your log: the term or log index becomes the token, and the resource must reject an older one.
- **Support - Reference:** [HLD Handbook - Consensus Protocols](https://github.com/handbook-academy/engineering-handbook/tree/main/content/hld) - Use Part 3 consensus for visual review of Raft and Multi-Paxos after the invariant ledger is complete. Check any simplified production claim against primary papers or official system documentation.
- **Support - Lab:** [MIT 6.5840 - Lab 4 KV Raft](https://pdos.csail.mit.edu/6.824/labs/lab-kvraft1.html) - Implement the key-value layer only after Raft invariants pass. Focus on client identity, duplicate suppression, snapshot state and request completion across leadership change.
- **Support - Lab:** [DSLabs - Lab 3 Paxos](https://github.com/emichael/dslabs/tree/49c4a1f9ed59547501376dd3ccfcdd9c1eb7b427/labs/lab3-paxos) - Labs are Java 21 message-passing state machines tested on an emulated network and by model-checking search tests that print a minimal violating trace; run them with the `run-tests.py` script and its `--lab` and `--part` options. Lab 3 is a Paxos-replicated service: compare its ballots, quorums and log slots with your Raft terms and indexes, and study how its search tests find and minimize violating schedules.
- **Depth - Course:** [TLA+ Video Course - Transaction Commit and Paxos Commit](https://lamport.azurewebsites.net/video/videos.html) - Watch lectures 5 to 7 (Transaction Commit, Two-Phase Commit, Paxos Commit) only after implementing Raft, check the course corrections page and run TLC on the matching specifications in the TLA+ Examples repository (https://github.com/tlaplus/Examples/tree/6a7b26a31c1a6aeec789b455e9bbfa3b3ad2728f/specifications/transaction_commit). Save the full TLA+ route for DS-9.
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

### Study units

#### U1. Range and hash partitioning

**About 2 h** · **Target:** Explain

Topics: Range partitioning; Hash partitioning

Partitioning decides which machine answers each key. The Systems unit on partitioning, hot keys, rebalancing and stale writers taught range and hash placement, modulo movement and fixed shards. Here the new work is choosing a scheme from two contrasting access patterns and writing the decision down, including compound keys and the growth limit of a fixed shard count.

**You can now**

- Choose range, hash or compound-key partitioning for a stated access pattern from scan fan-out and write spread.
- Explain when a compound key keeps a range scan on one shard under hash partitioning.
- State the fixed-shard-count trade-off between cheap moves, split cost and the growth limit.

**Study**

1. [Sharding by key range and by hash of key](https://dataintensive.net/) (DDIA 2e - Chapters 7 and 8 Sharding and Transactions) - Chapter 7, Sharding of Key-Value Data (pp. 255-262): Sharding by Key Range, Rebalancing key-range sharded data, Sharding by Hash of Key with Figures 7-2 and 7-3, plus Fixed number of shards and Sharding by hash range. Depth: Skim the range and modulo pages you read for the Systems unit; read Sharding by hash range and its compound-key paragraph closely. Stop before Consistent hashing (p. 263); the next unit derives it.
2. [Sharding strategies and choosing a partition key](https://github.com/handbook-academy/engineering-handbook/blob/d177ae2b48b4dfebf8ad0ddae51a345b3e17d99e/content/hld/part-2-building-blocks/06-database-partitioning-sharding.md) (HLD Handbook - Sharding, Distributed Transactions and Idempotency) - Sharding strategies (range, hash, consistent-hash, directory, geographic) and Choosing partition key: high-cardinality, stable keys that appear in queries.
3. [Why one database stops being enough](https://algomaster.io/learn/system-design/sharding) (AlgoMaster System Design - Selected Sharding and Transaction Problems) - The opening: vertical scaling limits, read replicas, and why data is divided across servers. Depth: Use as vocabulary for the sharding decision. The routing math comes from DDIA and the drill below.

**Focus**

- Range partitioning keeps contiguous keys together, so a scan visits only the shards whose ranges overlap it. Sequential keys such as timestamps can concentrate writes on the newest shard.
- Hashing the partition key spreads writes but loses its order, so a range over that key visits every shard. A compound key keeps a range over its later columns on one shard when the query fixes the partition key (DDIA p. 261).
- Mod-N placement couples every key to the node count: adding one node reassigns most keys, as Figure 7-3 shows.
- Fixed shard counts decouple keys from nodes so only whole shards move, but no cluster can use more nodes than shards, and a wrong initial count forces expensive resharding.

**Reproduce:** Closed-book, write a decision table for two access patterns: sensor readings written every second and read as one sensor's last hour, and user profiles read and written by user ID. For range by timestamp, hash of the whole key and a compound key (hash of the sensor ID, then timestamp), give the shards one write touches, the shards one sensor's hour scan touches, and what a split costs. Then route keys 1 to 8 with `key % 3` to get loads `[2, 3, 3]`.

**Traps**

- Hashing the key does not remove skew. It removes correlation between key order and placement; a hot key stays hot on whichever shard owns it.
- More shards are not free. Each shard adds metadata and recovery work; DDIA warns the size must be just right, neither too big nor too small.
- Assuming every range query fans out under hashing. Only a range over the hashed key does; a compound key keeps a range over later columns on one shard when the query fixes the partition key.

**Practice**

- [AlgoMaster Calculate Hash Shard Load](https://algomaster.io/practice/system-design/calculate-hash-shard-load) - Implement `shardLoads(keys, numShards)` routing each key to `key % numShards`. Example 1 ([1, 2, 3, 4, 5, 6, 7, 8], 3) gives `[2, 3, 3]`; Example 2 ([10, 20, 30, 40], 4) gives `[2, 0, 2, 0]`. This drills mod-N routing only. Rings, movement and skew arrive in later units.

**Stop when:** You fill the decision table for both access patterns without notes and can state the growth limit of your fixed shard count.

<details>
<summary>Self-test</summary>

1. Sensor writes keyed by timestamp land on one shard under range partitioning. Why, and what key change spreads them?
   - Time-contiguous keys fall in one range, so the current shard takes all writes. Prefix each timestamp with the sensor ID so ordering is by sensor then time; each sensor then needs its own range scan afterward.
2. Keys 1 to 8 route by `key % 3`. What are the shard loads?
   - Shard 0 holds 3 and 6, shard 1 holds 1, 4 and 7, shard 2 holds 2, 5 and 8, so `[2, 3, 3]`.
3. A 10-node cluster holds 1,000 fixed shards and adds an 11th node. What moves?
   - Only whole shards move from old nodes to the new one until shares even out. No key changes shard; only the shard-to-node assignment changes.
4. Why can a cluster hold fewer nodes than shards but never usefully more?
   - Each node serves whole shards, so a node with no shard serves nothing. Splitting shards to make room is the expensive reshard operation.

</details>

#### U2. Consistent hashing rings, rendezvous hashing and weighted virtual nodes

**About 4 h** · **Target:** Derive + Implement

Topics: Consistent hashing rings; Rendezvous hashing; Virtual nodes and weighted placement

Mod-N placement reshuffles nearly every key on each membership change. Rings and rendezvous move only the keys the new owner takes over, which is what makes adding capacity affordable.

**You can now**

- Derive key movement for a node join and leave under mod-N, ring and rendezvous placement.
- Implement a hash ring with virtual nodes that maps each key to its clockwise owner.
- Size virtual-node counts and weights so uneven machines take proportional shares.

**Study**

1. [The consistent hashing contract in two paragraphs](https://dataintensive.net/) (DDIA 2e - Chapters 7 and 8 Sharding and Transactions) - Chapter 7, Consistent hashing (p. 263): the two properties (roughly equal keys per shard, minimal movement on change) and the pointers to rendezvous and jump hashing. Depth: Read for the definition only. The derivations come from the HLD chapter; DDIA names rendezvous hashing without deriving it.
2. [Rings, virtual nodes, bounded load and rendezvous](https://github.com/handbook-academy/engineering-handbook/blob/d177ae2b48b4dfebf8ad0ddae51a345b3e17d99e/content/hld/part-3-distributed-systems-theory/09-consistent-hashing.md) (HLD Handbook - Sharding, Distributed Transactions and Idempotency) - Why modulo hashing breaks, The hash ring (successor lookup and its join-movement estimate), Virtual nodes ($`V \ge 100`$ guidance, the simulation figure of about 10 percent standard deviation at $`V = 100`$, heterogeneous weights as more entries), Rendezvous/HRW (one score per node, minimal disruption) and the Trade-offs table. Depth: The chapter's $`1/N`$ join estimate is loose: with $`N`$ equal nodes before the join, the new node takes an expected $`1/(N+1)`$ of keys. The 10 percent figure is a reported simulation, not a bound.
3. [The five-server cache problem](https://algomaster.io/learn/system-design/consistent-hashing) (AlgoMaster System Design - Selected Sharding and Transaction Problems) - The problem: five cache servers, one key to one server, and why membership changes must move few profiles. Depth: Use for intuition. The movement math comes from the HLD chapter.

**Focus**

- A ring maps keys and nodes to one circle and each key belongs to the first node clockwise. A join at one ring position steals one arc from its successor, and a node with virtual nodes steals one arc per position; a leave hands each arc to its successor.
- Virtual nodes give each physical node many scattered ring positions. Weight is just more positions per strong machine, for example twice the entries for a weight-2 host.
- Rendezvous scores every node per key and takes the maximum: no ring state, but lookup costs one hash per node, so it fits small clusters.
- Consistent here means key stability, not replica or ACID consistency. Rings balance keys, not requests; a hot key still lands on one owner.

**Reproduce:** Closed-book, show keys 0 to 7 moving 5 records when shards go from 3 to 4 under mod-N, then show why a ring join moves only the stolen arcs (an expected $`1/(N+1)`$ of keys when $`N`$ equal nodes become $`N + 1`$). Price lookups as ring binary search in $`O(\log(V \cdot N))`$ against rendezvous at $`O(N)`$ hashes.

**Traps**

- Treating consistent hashing as a hot-key fix. It bounds movement on membership change; a popular key still lands on one owner.
- Running one ring position per node. With `V = 1` one node can take 3 times its fair share; the chapter suggests `V >= 100` for caches.
- Letting two deciders use different member lists under rendezvous. The same key then maps to different owners, which is a membership problem for the next unit.

**Practice**

- [Building Distributed Systems: consistent hashing for sharding (RA-2)](https://builddistributedsystem.com/tracks/sharder/tasks/task-8-2-consistent-hash) - Place shards on a hash ring, hash each key to a ring position, and take the next shard clockwise. Free browser-graded drill. Keep your own ring with virtual nodes and seeded keys as the evidence.
- [AlgoMaster Count Keys Moved by Resharding](https://algomaster.io/practice/system-design/count-keys-moved-by-resharding) - Implement `keysMoved(keys, oldShards, newShards)`. Example 1 ([0 to 7], 3, 4) gives 5; Example 2 ([10, 20, 30, 40], 4, 5) gives 2. Counts mod-N movement only. Contrast each result with what your ring moves for the same join.

**Stop when:** Your ring routes a seeded key set, a join moves only the new range, and you can price mod-N against ring and rendezvous on movement and lookup.

<details>
<summary>Self-test</summary>

1. Keys 0 to 7 move from 3 to 4 shards under mod-N. How many move, and what would a ring move instead?
   - Five move under mod-N; only 0, 1 and 2 stay. A ring join moves only the keys in the stolen arc, about one new share, and every other key stays put.
2. Two physical nodes of equal capacity own 70 and 30 percent of a ring. What is the fix, what does it cost, and when do weights apply instead?
   - Give each node many scattered virtual nodes and measure the new shares; the chapter's cited simulations report about 10 percent standard deviation at 100 per node, not a bound. The cost is ring memory, one entry per virtual node. Weights, meaning vnode counts in proportion to capacity, are for unequal machines, not for this imbalance.
3. Rendezvous over 5 nodes versus 5,000: what changes per lookup?
   - Five score computations against 5,000. Lookup is linear in node count, so rendezvous fits the small cluster and the ring fits the large one.
4. Two clients hold different member lists under rendezvous. What breaks?
   - The same key maps to different owners, so reads miss and writes split. Both deciders need one current list, which the partition map supplies.

</details>

#### U3. Versioned partition maps, routing and redirects under stale configuration, with movement tests

**About 5 h** · **Target:** Implement

Topics: Partition map versioning; Routing, redirects and stale configuration; Partition-map implementation and movement tests

Hashes name shards; maps own them. A versioned map lets ownership move while requests are in flight, and turns stale caches into retried redirects instead of lost writes.

**You can now**

- Implement a versioned partition map with atomic installation and per-key routing.
- Recover stale clients through redirects and map refresh instead of failed writes.
- Test single ownership and no lost keys across a move, including stale routes and delayed operations.

**Study**

1. [Request routing and who tracks assignments](https://dataintensive.net/) (DDIA 2e - Chapters 7 and 8 Sharding and Transactions) - Chapter 7, Request Routing (pp. 265-267): the three routing approaches, who decides placement, the cutover problem, and Figure 7-8 on ZooKeeper-tracked assignment with the gossip alternative.
2. [Numbered configs with redirect and retry](https://pdos.csail.mit.edu/6.824/labs/lab-shard1.html) (MIT 6.5840 - Distributed Transactions and Lab 5 Sharded KV) - Lab 5 Sharded KV (Spring 2026): the ShardConfig number ordering, the shardkv clerk with Query plus ErrWrongGroup retry, and ChangeConfigTo as FreezeShard, InstallShard and DeleteShard fenced by number.
3. [Partition routing and rebalance contract](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-2/replicated-log-stream-processor.md) (Replicated Log and Stream Processor - Partition and Workflow Slice) - Milestone C: partition routing with reassignment without lost ownership; the stretch goal adds partition rebalance with ownership epochs.

**Focus**

- Every routing decision reads a numbered map version. In Lab 5 a wrong-owner reply carries no number, so the clerk re-queries the controller; your own fixture may also stamp replies with the installed version.
- Wrong-owner contact is a redirect, not an error. The client fetches the new config and retries, as the shardkv clerk does on `ErrWrongGroup`.
- Config numbers order assignments but do not revoke an old owner by themselves. Freeze the source before the destination accepts writes, persist that fence with the shard state, and reject stale migration RPCs.
- Gossip-disseminated maps can split brain with two owners for one shard. Consensus-tracked maps cost more but give one authoritative version.

**Reproduce:** Closed-book, write the routing function: given map version `v` with ranges and a key, return the owner; given a reply stamped `v + 1` (your fixture's choice; Lab 5 sends a bare `ErrWrongGroup`), describe the client refresh and retry. Sketch the three movement states (serving old, migrating, serving new) and say where each request lands.

**Traps**

- Caching the map without its version. The client cannot detect staleness, so correctness rests entirely on servers rejecting keys they no longer own.
- Treating a redirect as failure. `ErrWrongGroup` is the normal path during movement; fetching the config and retrying is correct.
- Dropping in-flight requests at cutover. The new owner serves, but requests already sent to the old owner need forwarding or retry, never silent drops.

**Practice**

- The section mini-project covers this: versioned map routing, stale-route injection, and movement tests with no double ownership.

**Stop when:** Your map routes a seeded key set across a join, a stale client recovers through redirects, and a movement test shows single ownership throughout.

<details>
<summary>Self-test</summary>

1. A client holds map v5 while the shard moved in v6. What tells the client?
   - In Lab 5 the old group replies `ErrWrongGroup`, which carries no config number. The clerk queries the controller for the latest config and retries against the new owner. Your own fixture may also stamp replies with the installed map version.
2. Why must the map version ride on every assignment instead of shipping the shard list alone?
   - Without versions two maps cannot be ordered. Numbers order the maps, but a stale writer is fenced only once its group has frozen the shard or learned the newer number and rejects older work.
3. Gossip versus ZooKeeper for distributing the map: what changes?
   - Gossip is fast but can leave two sides with different owners for one shard. ZooKeeper or etcd gives one authoritative map through consensus.
4. A read arrives at the old owner after cutover. What is correct?
   - Forward it to the new owner or redirect the client there. Never serve stale data as current and never drop the request.

</details>

#### U4. Replication-aware placement, online shard movement and ownership epochs

**About 4 h** · **Target:** Explain + Implement

Topics: Replication-aware placement; Online shard movement; Ownership epochs during rebalance

Moving a shard while clients write to it is where data is lost or doubled. Numbered configs order the moves, and freezing the source before the destination serves keeps exactly one owner accepting writes for each key.

**You can now**

- Place three replicas of each shard in three failure domains so losing any one domain leaves a majority.
- Move a shard by freeze, install and delete under numbered configs while unaffected shards keep serving.
- Recover an interrupted move from stored current and next configurations.

**Study**

1. [Hot spots, splits and who runs rebalancing](https://dataintensive.net/) (DDIA 2e - Chapters 7 and 8 Sharding and Transactions) - Chapter 7, Skewed Workloads and Relieving Hot Spots and Operations: Automatic Versus Manual Rebalancing (pp. 263-265): hot keys, shard splits, automatic versus manual control and the cascading-failure warning.
2. [Replicas on distinct machines and racks](https://algomaster.io/learn/system-design/consistent-hashing) (AlgoMaster System Design - Selected Sharding and Transaction Problems) - Section 12, Replication on the Ring: walk clockwise to distinct physical servers, skip virtual nodes of a machine already used, and spread replicas across racks or zones. Depth: For a majority of three replicas to survive any one domain loss, use three independent failure domains.
3. [Freeze, install, delete with numbered configs](https://pdos.csail.mit.edu/6.824/labs/lab-shard1.html) (MIT 6.5840 - Distributed Transactions and Lab 5 Sharded KV) - Lab 5 Sharded KV (Spring 2026), Parts A and B: ChangeConfigTo as FreezeShard, InstallShard and DeleteShard fenced by config Num, InitController recovery from stored current and next configurations, and the Part D note that cross-shard transactions need two-phase commit with two-phase locking.
4. [Ownership epochs as the movement contract](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-2/replicated-log-stream-processor.md) (Replicated Log and Stream Processor - Partition and Workflow Slice) - The partition rebalance with ownership epochs stretch goal with the correctness rule that stale epochs cannot mutate current ownership.

**Focus**

- Placement is two decisions: which keys form a shard and which failure domains hold its replicas. Correlated failures kill shards stacked on one rack.
- Lab 5 freezes the moving shard before copying, installs it at the destination, deletes the frozen copy and publishes the new configuration. Writes to the moving shard retry during the pause while other shards keep serving; copying while still serving needs a catch-up or forwarding protocol the lab does not supply.
- The config number is an ownership epoch for migration: a group that has seen a higher number rejects shard RPCs carrying older ones. Client Get and Put carry no number, so the frozen or deleted shard state is what turns them away.
- Automatic rebalancing can cascade. A slow node misdiagnosed as dead triggers moves that overload the rest, so DDIA keeps a human in the loop.

**Reproduce:** Closed-book, walk a move of one shard from group 1 to group 2: freeze, state copy, install at the new config number, delete. Show what a write to the moving shard gets during the copy (the frozen source rejects it and the clerk retries) and which number the destination checks on install.

**Traps**

- Deleting the old copy before the new owner serves. A crash between copy and cutover then loses the shard.
- Ordering owners by wall-clock time. Epochs must be monotonic numbers from the controller, never timestamps.
- Moving many shards at once for speed. Parallel moves multiply transfer traffic and stall serving; move, verify, then repeat.

**Practice**

- [MIT 6.5840 Lab 5 Sharded KV, Parts A and B](https://pdos.csail.mit.edu/6.824/labs/lab-shard1.html) - Implement the shardctrler, shardgrp server and clerk in src/shardkv1. Run Part A (`make RUN="-run 5A" shardkv`, from TestInitQuery5A through the join and leave movement tests) and Part B (controller recovery after failure). Optional integrated path if your MIT Labs 2 to 4 already work: complete Parts A and B and keep your solution private. Otherwise the section mini-project covers this: a local freeze, install and delete fixture with controller restart, persisted current and next configs and delayed stale-RPC tests. Part C adds concurrent controller arbitration.

**Stop when:** You move a shard between two local groups under continuous writes, no write lands on two owners, and a killed and restarted controller resumes the move.

<details>
<summary>Self-test</summary>

1. A shard keeps 3 replicas on one rack and the rack switch dies. What happens?
   - The whole shard goes dark despite 3 copies. Put the three replicas in three failure domains so one correlated failure leaves a majority.
2. A client with an old config sends a Put for a moved shard to its old owner. What stops it?
   - The old group froze and then deleted the shard, so it answers `ErrWrongGroup`; the clerk queries the controller and retries at the new owner. Migration RPCs carrying an older config number fail the number check.
3. Why does DDIA warn against fully automatic rebalancing?
   - Moves are expensive and failure detection can be wrong. A slow node suspected dead triggers moves that worsen overload into cascading failure.
4. A controller dies mid-move and a new one starts. What must it recover?
   - The stored current and next configurations, so it completes the interrupted move instead of starting a conflicting one.

</details>

#### U5. Hot keys, load skew and scatter-gather tail latency

**About 4 h** · **Target:** Derive + Measure

Topics: Hot keys and load skew; Scatter-gather tail latency

Uniform hashing balances data, not traffic. One hot key can saturate a shard while the cluster idles, and every cross-shard query waits for the slowest shard.

**You can now**

- Quantify per-shard load from a key distribution and price a hot-key split as write relief against read fan-out.
- Derive scatter-gather latency from per-shard latency distributions, including the tail.
- Measure skew and tails on your machine with fixed seeds and labeled setups.

**Study**

1. [Hot spots and the split-key remedy](https://dataintensive.net/) (DDIA 2e - Chapters 7 and 8 Sharding and Transactions) - Chapter 7, Skewed Workloads and Relieving Hot Spots (pp. 263-264): hot shards and keys, isolating a hot key, the random-digit suffix split with its read and bookkeeping costs.
2. [Why scatter queries amplify tails](https://dataintensive.net/) (DDIA 2e - Chapters 7 and 8 Sharding and Transactions) - Chapter 7, Sharding and Secondary Indexes on local indexes (p. 269): scatter to all shards with tail latency amplification and the scaling limit it sets.

**Focus**

- Skew is about access, not data size. Equal key counts still overload one shard when one key takes most traffic.
- Splitting a hot write key with a random suffix divides writes by the suffix count but multiplies the read fan-out by the same factor.
- With concurrent dispatch, the shard-wait part of scatter-gather latency is the slowest shard's time, plus dispatch and merge. Without added contention, parallel dispatch beats serial calls at every percentile, but waiting for all shards amplifies the tail relative to one shard.
- Read-hot and write-hot keys need different fixes: replicate or cache hot reads, split hot writes.

**Reproduce:** Closed-book, compute loads for keys `[10, 20, 30, 40]` over 4 shards (`[2, 0, 2, 0]`) and name the hot shards. Then take one hot key at 10,000 writes per second, split it across 100 suffix keys, and state the expected write rate per split key with the new read fan-out.

**Traps**

- Adding shards to fix a hot key. The key still hashes to one shard; only splitting or replicating the key helps.
- Averaging shard latencies for scatter-gather. The query waits for the slowest shard, so report the maximum and the tail.
- Splitting every key preemptively. Tracking which keys are split costs more than it saves for cold keys.

**Practice**

- [AlgoMaster Calculate Hash Shard Load, skewed case](https://algomaster.io/practice/system-design/calculate-hash-shard-load) - Example 2 ([10, 20, 30, 40], 4) gives `[2, 0, 2, 0]`. Extend it with a 100-way hot-key split and report per-key writes with read fan-out. This drills load arithmetic only. Tail-latency measurement runs in the skew measurement unit and the mini-project.

**Stop when:** You quantify a skewed distribution by hand and can price a split as write relief against read fan-out and a scatter as tail from the maximum.

<details>
<summary>Self-test</summary>

1. Four shards hold loads `[2, 0, 2, 0]`. Is the cluster balanced?
   - No. Shards 0 and 2 hold everything while 1 and 3 idle. The skew comes from key choice, not data size.
2. A hot key takes 10,000 writes per second and gets a two-digit suffix split. What is the per-key rate and the read cost?
   - About 100 writes per second per split key. Each read now fans out to 100 keys and combines the results.
3. Ten shards each show p99 of 20 ms and a query waits for all ten. What is the scatter-gather p99?
   - Not determined by the p99s alone. If shard times are independent with the same continuous distribution, all ten finish within 20 ms with probability $`0.99^{10} \approx 0.904`$, so the scatter p99 sits near the single-shard p99.9. Perfectly correlated shards would not amplify it at all.
4. A celebrity key is read-hot but rarely written. Split it or replicate it?
   - Replicate or cache it. Splitting relieves writes but multiplies reads, which is exactly the wrong trade here.

</details>

#### U6. Local and global secondary indexes, cross-shard aggregation and CDC-maintained indexes

**About 4 h** · **Target:** Explain

Topics: Local versus global secondary indexes; Cross-shard aggregation and join cost; Change-data-capture driven index maintenance

Sharding by primary key breaks every other access path. Each secondary query either fans out to all shards or maintains a second sharded index that writes must keep in sync.

**You can now**

- Contrast local and global secondary indexes on query fan-out and write cost.
- Price a secondary-index query as postings lookup, network intersection, record fetch and top-K merge.
- Describe CDC-maintained index updates and their staleness window.

**Study**

1. [Local and global secondary indexes](https://dataintensive.net/) (DDIA 2e - Chapters 7 and 8 Sharding and Transactions) - Chapter 7, Sharding and Secondary Indexes (pp. 268-271): local indexes with Figure 7-9, term-partitioned global indexes with Figure 7-10, the write-sync cost and DynamoDB async staleness.
2. [Outbox relay as the index maintenance feed](https://github.com/handbook-academy/engineering-handbook/blob/d177ae2b48b4dfebf8ad0ddae51a345b3e17d99e/content/hld/part-3-distributed-systems-theory/06-distributed-transactions.md) (HLD Handbook - Sharding, Distributed Transactions and Idempotency) - The outbox pattern: one local transaction writes the business row plus the outbox row, Debezium tails the WAL, delivery is at-least-once so consumers stay idempotent.

**Focus**

- Local indexes write with the record but reads by value fan out to all shards. Global indexes answer one term from one shard but every write touches index shards.
- A global index is itself sharded data: term-partitioned postings live apart from the records they point to, so fetching records re-fans out.
- A top-K query fans out, takes each shard's local top K and merges them; the merge is cheap, and the fan-out and slowest shard set the cost. Distributed joins wait for the later unit on distributed dataflow graphs, shuffle and operator parallelism.
- An index maintained asynchronously from CDC can lag the source. Its staleness includes capture, broker, consumer and apply delay, not just relay lag, and convergence assumes changes are retained and applied in order.

**Reproduce:** Closed-book, draw the red-cars postings for two shards under local versus global indexing: where `color:red` lives in each case, which shards a `color = red` query touches, and which shards a record fetch touches.

**Traps**

- Assuming a global index keeps reads single-shard end to end. Postings sit on one index shard, but the records they point to still live on many shards.
- Hand-rolling a value-to-ID map without transactions. Races and partial writes desync it; DDIA warns about exactly this on p. 269.
- Treating CDC-maintained indexes as current. Reads miss everything the index has not yet applied, and relay lag is only one part of that delay.

**Practice**

- [AlgoMaster Merge Cross-Shard Top-K Results](https://algomaster.io/practice/system-design/merge-cross-shard-top-k-results) - Implement `topK(shardScores, k)` over per-shard descending streams with a heap. Example 1 ([[9, 7, 3], [8, 6], [10, 5]], 4) gives `[10, 9, 8, 7]`. Drills the merge side of scatter-gather. It does not move data or measure tails.

**Stop when:** You place postings for both index kinds without notes and can price a cross-shard query as fan-out plus merge.

<details>
<summary>Self-test</summary>

1. A user table is sharded by user ID with a local email index. What does a lookup by email cost?
   - A fan-out to all shards plus a combine, since matching rows may sit on any shard. Cheap writes, expensive secondary reads.
2. A global color index holds `color:red` on index shard 0. Which shards serve the query and the record fetch?
   - One index shard serves the postings. Fetching the red-car records fans out again to every shard that owns those IDs.
3. An AND of two terms living on different index shards has long postings. What is the cost?
   - Shipping postings over the network to intersect them. Short postings are cheap; long ones make the query slow.
4. The index's applied position trails the source by 5 seconds. What may an index read miss?
   - Writes from those 5 seconds. Measure lag at the index's applied position: relay lag alone leaves out broker and apply delay.

</details>

#### U7. ACID boundaries, dirty and nonrepeatable reads, lost updates and write skew

**About 4 h** · **Target:** Explain

Topics: ACID and transaction boundaries; Dirty reads and nonrepeatable reads; Lost updates and write skew

Isolation levels are names for which anomalies they admit. Without the anomaly shapes the names are marketing; with them each level is a testable claim. The Systems unit on transactions and isolation anomalies built the doctor write-skew history under PostgreSQL. Here the new work is Berenson's phenomenon names and what Maelstrom's weak-model checkers can and cannot detect.

**You can now**

- Draw the ACID boundary and say which letter each failure threatens.
- Construct dirty-write, lost-update, read-skew and write-skew histories.
- Classify anomalies with the Berenson P0 to P4, A5A and A5B names and say which ones snapshot isolation still admits.

**Study**

1. [What a transaction promises](https://dataintensive.net/) (DDIA 2e - Chapters 7 and 8 Sharding and Transactions) - Chapter 8, What Exactly Is a Transaction (pp. 278-288): The Meaning of ACID, Single-Object and Multi-Object Operations, Figure 8-1 and the retry caveats just before Weak Isolation Levels.
2. [Weak isolation and the doctor on-call skew](https://dataintensive.net/) (DDIA 2e - Chapters 7 and 8 Sharding and Transactions) - Chapter 8, Weak Isolation Levels (pp. 288-307): Read Committed with dirty reads and writes, Snapshot Isolation with read skew in Figure 8-6, Preventing Lost Updates, and Write Skew and Phantoms with the on-call example in Figure 8-8.
3. [Phenomena P0 to P3 with snapshot anomalies](https://arxiv.org/abs/cs/0701157) (A Critique of ANSI SQL Isolation Levels (Berenson et al., 1995)) - Sections 2 and 3 with Tables 1 to 3 for P0 to P3; Section 4.1 for P4 lost update; Section 4.2 for snapshot isolation, A5A read skew and A5B write skew; Table 4 for which levels admit each. Depth: Cite these definitions, not the SQL-92 prose they correct.
4. [The transfer that must not half-happen](https://algomaster.io/learn/system-design/acid-transactions) (AlgoMaster System Design - Selected Sharding and Transaction Problems) - The bank-transfer motivation and the ACID definitions: atomicity, consistency, isolation, durability.

**Focus**

- ACID consistency means your invariants hold; it says nothing about replicas or timing. Isolation is the concurrency half, atomicity plus durability the failure half.
- Dirty reads see uncommitted data, nonrepeatable reads see committed change between two reads, lost updates merge two writes into one, write skew merges two reads into a broken invariant.
- Write skew generalizes lost update: different transactions updating different objects after reading the same set.
- Retry the whole transaction after a definite abort; a rolled-back transaction left nothing to duplicate. A commit whose acknowledgement timed out has an unknown outcome: check its status or retry with a stable ID and atomic deduplication.

**Reproduce:** Closed-book, write four short histories on two transactions and name each with Berenson's terms: a dirty write (P0), a lost update (P4), read skew (A5A) and write skew (A5B). For each, say whether snapshot isolation forbids it, then check your answers against Table 4.

**Traps**

- Calling snapshot isolation serializable. Oracle sells a level named serializable that is snapshot isolation; it admits write skew.
- Blaming the database for a retry double-apply. A commit that timed out before its ack reruns unless the application dedups.
- Treating phantoms as exotic. Any check-then-insert over usernames or bookings is a phantom risk under snapshot isolation.

**Practice**

- [Gossip Glomers 6a: single-node transactions](https://fly.io/dist-sys/6a) - Serve the `txn-rw-register` workload on one node: `./maelstrom test -w txn-rw-register --bin ~/go/bin/maelstrom-txn --node-count 1 --time-limit 20 --rate 1000 --concurrency 2n --consistency-models read-uncommitted --availability total`
- [Gossip Glomers 6b: read-uncommitted under partition](https://fly.io/dist-sys/6b) - Replicate writes to both nodes and run the base plus the partition case (`--availability total --nemesis partition`). G0 (dirty write) is the only prohibited anomaly. The page states its checker cannot detect G0 anomalies, so a pass here is weaker than its label.
- [Gossip Glomers 6c: read-committed under partition](https://fly.io/dist-sys/6c) - Forbid G1a, G1b and G1c with abort code 30 (`txn-conflict`): `./maelstrom test -w txn-rw-register --bin ~/go/bin/maelstrom-txn --node-count 2 --concurrency 2n --time-limit 20 --rate 1000 --consistency-models read-committed --availability total --nemesis partition`. Retype the command by hand: the page pastes a non-ASCII dash before `--nemesis`.

**Stop when:** You write the four histories from memory, classify each with its Berenson name and say which one snapshot isolation admits.

<details>
<summary>Self-test</summary>

1. One transaction writes x = 3 without committing and another reads x. Which anomaly, and which level admits it?
   - Dirty read (P1). Only read-uncommitted admits it; PostgreSQL has no such mode and behaves as read-committed instead.
2. Aaliyah and Bryce both read 2 on call, both go off call, both commit. Name it and say why snapshot isolation allows it.
   - A5B write skew. Each transaction updated a different object, so no write-write conflict fired and both snapshots looked safe.
3. Two clients read-modify-write one counter and the total rises by 1, not 2. Which anomaly and cheapest fix?
   - Lost update. Use an atomic increment such as `UPDATE counters SET value = value + 1` or a compare-and-set retry loop.
4. A booking app checks for overlaps then inserts, twice concurrently. What breaks?
   - A phantom: both checks pass on empty results, then both inserts land overlapping. Snapshot isolation needs serializable isolation or materialized conflict locks here.

</details>

#### U8. Serializability, strict serializability, two-phase locking and deadlocks

**About 4 h** · **Target:** Derive + Implement

Topics: Serializability and strict serializability; Two-phase locking and deadlocks

Serializability is the contract every weaker level approximates. Two-phase locking buys it with waiting, and deadlocks are the price. The Systems unit on two-phase locking, timestamp ordering and MVCC taught the mechanisms and conflict graphs. Here the new work is a lock manager with predicate protection and deadlock detection, and the real-time order that strict serializability adds.

**You can now**

- Test a history for serializability by finding an equivalent serial order.
- Implement two-phase locking with shared, exclusive and predicate locks.
- Detect a deadlock cycle and resolve it by abort with client retry.

**Study**

1. [Serial execution, 2PL and predicate locks](https://dataintensive.net/) (DDIA 2e - Chapters 7 and 8 Sharding and Transactions) - Chapter 8, Serializability (pp. 308-317): Actual Serial Execution, Two-Phase Locking with shared and exclusive modes and deadlocks, predicate locks for phantoms and materializing conflicts as a last resort.
2. [Serializable orders with strong strict 2PL](https://pdos.csail.mit.edu/6.824/notes/l-2pc.txt) (MIT 6.5840 - Distributed Transactions and Lab 5 Sharded KV) - Lecture 11 (Spring 2026), concurrency-control half: the bank-transfer serializable orders, strong strict two-phase locking rules, the T3/T4 deadlock with timeout and wound-wait resolution.
3. [Row locks and the deadlock example](https://www.postgresql.org/docs/18/explicit-locking.html) (PostgreSQL 18 Documentation - Transaction Isolation and Explicit Locking) - Section 13.3, especially 13.3.2 row-level locks (`FOR UPDATE` and `FOR SHARE`) and 13.3.4 Deadlocks with the two-accounts update cycle.
4. [Serializability versus strict serializability](https://dataintensive.net/) (DDIA 2e - Chapters 7 and 8 Sharding and Transactions) - Chapter 10, the box Linearizability Versus Serializability (pp. 407-408): serializability allows stale reads, linearizability adds recency, and the combination is strict serializability.

**Focus**

- Serializable means some serial order explains all outputs and effects; test it by enumerating orders, as the lecture does. Strict serializability adds real time: a transaction that starts after another commits must follow it in that order.
- Strong strict 2PL acquires before use and holds past commit. Releasing early reopens the interleavings that locks were meant to close.
- Read-write sharing needs two modes: shared for readers, exclusive for writers. Phantoms need predicate locks, not row locks.
- Deadlock needs a cycle. Prevention orders lock acquisition; detection aborts a participant. Either way the client retries.

**Reproduce:** Closed-book, run the lecture bank example with `x = 10` and `y = 10`: `T1` transfers 1 while `T2` audits. List the two serializable outcomes and show two interleavings that are not serializable. Then show the `T3`/`T4` deadlock on `get(x)` and `get(y)` and resolve it by aborting one. Finally give a two-transaction history that is serializable but not strictly serializable.

**Traps**

- Holding locks to end of statement instead of end of transaction. Early release breaks serializability even with correct acquisition.
- Locking rows to stop phantoms. No rows exist yet to lock; the fix is a predicate lock or materialized conflict rows.
- Retrying a deadlock abort in the same order at once. The same cycle can reform; order locks consistently or back off before retry.

**Practice**

- [AlgoMaster Analyze Transaction Serializability](https://algomaster.io/practice/system-design/analyze-transaction-serializability) - Implement `isSerializable` and `serialOrder` through the conflict graph. The `W(x)` then `R(x)` case is serializable with order [1, 2]; the `x: 1 to 2` plus `y: 2 to 1` case is not. Drills conflict-serializability only. The section mini-project covers this: a shared and exclusive lock manager with growing and shrinking phases, predicate or range protection, wait-for-cycle detection with abort, and a real-time-order history test.

**Stop when:** You classify the bank interleavings, build a conflict graph for a new schedule and give a serializable history that strict serializability rejects, all without notes.

<details>
<summary>Self-test</summary>

1. What are the serializable outcomes of the lecture bank example?
   - `T1` then `T2` prints 11 and 9; `T2` then `T1` prints 10 and 10. Any other printed pair is not serializable.
2. `T2` releases `x` after its first read and `T1` runs between the two reads. Result and verdict?
   - `T2` prints 10 and 9, which matches neither serial order. Holding the lock to commit would have blocked `T1`.
3. Two bookings check-then-insert concurrently. Why do row locks not help?
   - The conflicting rows do not exist yet, so there is nothing to lock. The fix is a predicate lock on the search condition or serializable isolation.
4. PostgreSQL detects a deadlock. Which transaction aborts?
   - Unpredictable by design. The application must retry any transaction that fails with a deadlock, not a chosen one.

</details>

#### U9. Timestamp ordering, optimistic concurrency, MVCC and read-only snapshot coordination

**About 4 h** · **Target:** Explain + Implement

Topics: Timestamp ordering and optimistic concurrency; MVCC snapshots and garbage collection; Read-only distributed snapshot coordination

Blocking every reader behind writers stalls read-heavy workloads. Snapshots let reads run lock-free on a consistent past, and optimistic checks move the cost of conflict to commit time.

**You can now**

- Contrast timestamp ordering and optimistic validation with pessimistic locking.
- Decide tuple visibility from snapshots and version chains, and state what the collector may free.
- Serve read-only snapshots across shards at one agreed timestamp, waiting on each shard until its safe time reaches it.

**Study**

1. [Timestamp ordering and multiversioning lectures](https://15445.courses.cs.cmu.edu/fall2025/schedule.html) (CMU 15-445 - Concurrency Control, Logging and Recovery) - Fall 2025 Lectures #19 (Timestamp Ordering Concurrency Control) and #20 (Multi-Version Concurrency Control): basic timestamp ordering, optimistic concurrency and MVCC version storage.
2. [Snapshots, visibility and lost-update prevention](https://www.interdb.jp/pg/pgsql05/) (The Internals of PostgreSQL - Concurrency Control) - Chapter 5, Sections 5.5 to 5.8 (page read 2026-10-15): transaction snapshots, visibility check rules, hint bits and phantoms in repeatable read, and first-updater-wins; Section 5.9 for the SSI dangerous structure. Depth: Lock modes live in the PostgreSQL locking reference from the previous unit, not here.
3. [MVCC chains with optimistic control](https://dataintensive.net/) (DDIA 2e - Chapters 7 and 8 Sharding and Transactions) - Chapter 8 (pp. 295-299): multiversion chains with `inserted_by` and `deleted_by`, visibility and garbage collection; plus Pessimistic versus optimistic concurrency control (pp. 318-319).
4. [Lock-free reads at a safe timestamp](https://static.googleusercontent.com/media/research.google.com/en//archive/spanner-osdi2012.pdf) (Spanner: Google's Globally-Distributed Database (Corbett et al., 2012)) - Sections 4.1.3 (Serving Reads at Timestamp) and 4.2.2 (Read-Only Transactions): the safe-time rule, and read-only transactions that pick one timestamp, may wait for safe time to advance, and take no locks.

**Focus**

- Timestamp ordering stamps operations and rejects late arrivals; optimistic control runs free and validates at commit. In their basic forms, both abort instead of waiting.
- MVCC keeps old versions tagged with writer IDs and a snapshot decides visibility. The collector frees only versions invisible to every active snapshot.
- PostgreSQL repeatable read is snapshot isolation: plain reads never wait for row write locks. A second updater of the same row waits for the first; if the first commits, the second fails with a serialization error and retries the whole transaction.
- A distributed read-only snapshot needs one timestamp valid on all shards. Each shard reading its own latest is not a consistent snapshot.

**Reproduce:** Closed-book, draw two row versions of an account (500 marked deleted by transaction 13, 400 inserted by 13) and decide visibility for a snapshot that started before 13 committed. State when the collector may remove the 500 version.

**Traps**

- Freeing a version that one snapshot still sees. Long-running snapshots pin old versions; the collector cannot free what any snapshot reads.
- Assuming snapshot isolation is serializable. The doctor example commits under snapshots; only SSI checks or locks stop it.
- Reading each shard at its own latest timestamp and calling it consistent. Cross-shard reads need one agreed timestamp.

**Practice**

- [CMU 15-445 Homework 5, Questions 3 and 4](https://15445.courses.cs.cmu.edu/fall2025/files/hw5-clean.pdf) - Question 3 (optimistic concurrency control) and Question 4 (multi-version concurrency control). Project 4 (https://15445.courses.cs.cmu.edu/fall2025/project4/) is optional C++ practice if your earlier BusTub projects already work. The section mini-project covers this: two shards with version selection and reclamation, and one shared read timestamp that waits for each shard's safe time.

**Stop when:** You decide visibility for a version chain from a snapshot and can say which anomalies your snapshot still admits.

<details>
<summary>Self-test</summary>

1. How is an update stored under MVCC?
   - As a delete plus an insert: the old version is marked with the deleter ID and a new version is inserted. Both stay until no snapshot can see the old one.
2. Two snapshot transactions update the same row. What happens?
   - In PostgreSQL repeatable read the second updater waits for the first. If the first commits, the second fails with a concurrent-update serialization error and retries the whole transaction; if the first aborts, the second proceeds.
3. An analytics snapshot stays open for hours. What is the storage effect?
   - It pins every version it can see. The table bloats until the snapshot closes and vacuum frees the dead versions.
4. How does Spanner serve a read-only transaction without locks?
   - It picks one read timestamp for the whole transaction. Each replica serves once its safe time reaches that timestamp, which accounts for applied Paxos writes and unresolved prepared transactions, so reads take no locks but may wait. The result is externally consistent, not stale by design.

</details>

#### U10. Two-phase commit states, durable prepare, coordinator failure and in-doubt recovery

**About 5 h** · **Target:** Derive + Implement

Topics: Two-phase commit states; Participant durable prepare state; Coordinator failure and blocking; In-doubt recovery and presumed outcomes

Atomic commit across shards is the one place where a crash leaves the database unsure of the outcome. The protocol earns its keep not on the happy path but in the exact recovery for each window.

**You can now**

- Walk coordinator and participant states through prepare, commit, abort and every crash window.
- Implement durable prepare and coordinator decision logging with in-doubt recovery.
- Explain why a prepared participant blocks and when manual or heuristic resolution applies.

**Study**

1. [The coordinator and participant exchange](https://dataintensive.net/) (DDIA 2e - Chapters 7 and 8 Sharding and Transactions) - Chapter 8, Two-Phase Commit (pp. 324-328): partial multi-node commit in Figure 8-12, the successful exchange in Figure 8-13, durable prepare and the coordinator decision record on p. 326, and coordinator failure with an in-doubt participant in Figure 8-14.
2. [Blocking, heuristics and XA limits](https://dataintensive.net/) (DDIA 2e - Chapters 7 and 8 Sharding and Transactions) - Chapter 8 (pp. 328-333): coordinator failure with locks held, three-phase commit limits, heuristic decisions as a catastrophic escape hatch, and single-coordinator failure modes. Depth: Read three-phase commit as a caution, not an assignment. This section leaves 3PC for later.
3. [TIDs, tentative writes and forget rules](https://pdos.csail.mit.edu/6.824/notes/l-2pc.txt) (MIT 6.5840 - Distributed Transactions and Lab 5 Sharded KV) - Lecture 11 (Spring 2026), distributed half: transaction IDs on every message, tentative writes, participant disk write before YES, coordinator COMMIT log write, blocking after YES, forget-after-ACK rules, and Raft versus 2PC.

**Focus**

- Prepare is a promise backed by disk. A YES voter must keep enough state across a reboot to obey either COMMIT or ABORT from the coordinator, so tentative writes and lock ownership persist before the vote.
- The commit point is one coordinator disk write. Before it the coordinator may abort, and a recovering coordinator treats an unlogged transaction as aborted; after it, recovery resends COMMIT.
- A YES voter that hears nothing blocks. Commit and abort are both still possible, so guessing either way breaks atomicity.
- 2PC gives atomicity, not availability: every participant must be up. Replicating each role is what adds availability.

**Reproduce:** Closed-book, walk the crash matrix: participant down before durable prepare (it may abort), after durable prepare but before YES is sent (it recovers in doubt and asks), after YES (the same), coordinator down before the commit record (recovery aborts) and after it (recovery resends COMMIT). Show why a prepared participant cannot time out and abort, using one side committed with the other unknown.

**Traps**

- Committing on unilateral timeout after voting YES. The coordinator may have committed elsewhere; timeout-abort splits the outcome.
- Reapplying a duplicate COMMIT without transaction-ID dedup. A recovered participant that forgot must ACK duplicates, not reapply them.
- Calling 2PC highly available because it survives some crashes. It blocks on coordinator loss with locks held; availability needs replicated roles.

**Practice**

- [DSLabs Lab 4 Part 3: transactions over sharded groups](https://github.com/emichael/dslabs/tree/49c4a1f9ed59547501376dd3ccfcdd9c1eb7b427/labs/lab4-shardedstore) - Implement the transactional store with two-phase commit and read/write locking over Paxos groups. Run `run-tests.py --lab 4 --part 3` and read any failing trace before changing code. Optional Java 21 path after the earlier DSLabs labs; it assumes a live majority per group and does not test disk-backed restart. The section mini-project covers this: durable prepare and decision records, a restart at each persistence boundary, and duplicate decisions.
- [Building Distributed Systems: two-phase commit and coordinator failure (TW-1, TW-2)](https://builddistributedsystem.com/tracks/coordinator/tasks/task-9-1-two-phase-commit) - TW-1 PREPARE, vote, COMMIT and ABORT exchange plus TW-2 coordinator logging with recovery from the log. Free browser-graded drills; they do not replace the DSLabs fault tests. TW-3 stays out: three-phase commit is later work.

**Stop when:** You walk every crash window without notes and your fixture recovers correctly from a restart at each persistence boundary.

<details>
<summary>Self-test</summary>

1. A participant votes YES, then crashes before COMMIT arrives. What happens on recovery?
   - It replays prepared state from disk, keeps holding its locks, and asks the coordinator. It commits or aborts on the coordinator answer.
2. The coordinator crashes after logging COMMIT but before sending it out. How does recovery preserve atomicity?
   - It reads its log, finds the COMMIT record, and resends COMMIT to every participant. The decision was already made, so resending is safe.
3. The coordinator log disk is lost entirely. Is there an automatic recovery?
   - No. An administrator must resolve each in-doubt transaction by inspecting participants and applying one outcome everywhere.
4. A participant unilaterally commits an in-doubt transaction during a coordinator outage. Verdict?
   - It breaks the promise system and risks split outcomes. Heuristic decisions are a catastrophic escape hatch, never routine.

</details>

#### U11. Saga orchestration and choreography and compensation semantics

**About 4 h** · **Target:** Explain

Topics: Saga orchestration versus choreography; Compensation semantics and irreversible effects

Cross-service work cannot hold database locks while waiting on other services. Sagas trade atomicity for progress, and the compensations are where the business logic really lives.

**You can now**

- Define a saga as sequenced local transactions with application-defined compensations.
- Contrast orchestration with choreography on visibility and failure handling.
- Name irreversible steps and place them where failure cannot strand them.

**Study**

1. [Sagas with compensating transactions](https://www.cs.cornell.edu/andru/cs711/2002fa/reading/sagas.pdf) (Sagas (Garcia-Molina and Salem, 1987)) - The whole paper: a saga as a sequence of transactions with compensating transactions run in reverse to amend partial execution, forward and backward recovery, and designing around steps that cannot be compensated.
2. [Orchestrated versus choreographed sagas](https://github.com/handbook-academy/engineering-handbook/blob/d177ae2b48b4dfebf8ad0ddae51a345b3e17d99e/content/hld/part-3-distributed-systems-theory/06-distributed-transactions.md) (HLD Handbook - Sharding, Distributed Transactions and Idempotency) - Sagas: orchestrated versus choreographed coordination, the missing isolation guarantee, and when not to use distributed transactions.
3. [Why 2PC fails the checkout](https://algomaster.io/learn/system-design/saga-pattern) (AlgoMaster System Design - Selected Sharding and Transaction Problems) - The e-commerce order example: order, inventory, payment and shipping services, why prepare-and-wait locking fails across them, and what the saga coordinates instead.

**Focus**

- A saga is not a transaction: steps commit independently, so other work sees partial progress. Compensation amends; it never rolls back.
- Orchestration puts the sequence in one controller, which is visible and has one place to fix. Choreography puts it in event reactions, which decouples services but scatters the trace.
- Compensations are application code with their own failures. A non-idempotent or failing compensation leaves the saga half-undone.
- Some effects cannot be physically undone: an email cannot be unsent, though a correction can compensate it in business terms. Put genuinely noncompensatable effects after the fallible compensatable work, define forward recovery past that pivot, and keep unknown outcomes for reconciliation.

**Reproduce:** Closed-book, write an order saga (reserve, charge, ship, notify) with each step compensation, fail at ship, and list the compensation order. State which step is irreversible and where you placed it.

**Traps**

- Compensating in forward order. Undo runs in reverse: the last completed step is compensated first.
- Assuming saga steps are isolated. Concurrent sagas interleave and partial progress is visible; business rules must tolerate it.
- Retrying a failed step forever. Some failures need compensation, not retry; decide per step which path applies.

**Practice**

- [AlgoMaster Build a Saga Compensation Order](https://algomaster.io/practice/system-design/build-a-saga-compensation-order) - Implement `compensationOrder(steps, failAt)` returning completed steps in reverse. Example 1 ([reserve, charge, ship, notify], 2) gives [charge, reserve]; failing at 0 gives empty. Drills compensation ordering only. Failure detection, retries and irreversible steps run in the durable-workflow unit and the mini-project.

**Stop when:** You write a four-step saga with compensations from memory and can argue orchestration versus choreography for it.

<details>
<summary>Self-test</summary>

1. A four-step saga fails at step 3. Which compensations run, in what order?
   - If step 3 definitely failed without a committed effect, compensate step 2 first, then step 1; step 4 never started. If step 3's outcome is unknown, query or replay its stable identity before choosing the recovery path.
2. Where does failure debugging happen under orchestration versus choreography?
   - The saga coordinator logs the sequence centrally. Choreography spreads it across service event logs that must be correlated.
3. Payment is captured, shipment fails, and the refund API is down. What is the saga state?
   - Stuck mid-compensation. The refund needs retry with ownership, plus reconciliation; silent abort would hide taken money.
4. Why can two-phase commit not cover the external payment provider?
   - The provider exposes no prepare-and-wait interface, so it cannot promise to commit later. No global atomic commit is possible.

</details>

#### U12. Transactional outbox and inbox, idempotent steps and the exactly-once effect boundary

**About 4 h** · **Target:** Implement

Topics: Transactional outbox and inbox; Idempotent workflow steps; Exactly-once effect boundary

Dual writes to a database plus a broker fail independently. The outbox turns two systems into one local transaction plus an at-least-once relay, and idempotency turns redelivery into safety.

**You can now**

- Implement the transactional outbox with a relay that is at-least-once by design.
- Make steps idempotent with keys and dedup state, ordered per aggregate by sequence.
- Draw the exactly-once effect boundary for a new workflow.

**Study**

1. [The idempotent receiver without distributed transactions](https://dataintensive.net/) (DDIA 2e - Chapters 7 and 8 Sharding and Transactions) - Chapter 8, Exactly-Once Message Processing Revisited (pp. 334-335): the processed message-ID table, the four-step receiver with its separate cleanup transaction, and the sharded extension.
2. [Outbox with CDC relay](https://github.com/handbook-academy/engineering-handbook/blob/d177ae2b48b4dfebf8ad0ddae51a345b3e17d99e/content/hld/part-3-distributed-systems-theory/06-distributed-transactions.md) (HLD Handbook - Sharding, Distributed Transactions and Idempotency) - The outbox pattern: the dual-write problem, one local transaction for business row plus outbox row, Debezium WAL tailing, at-least-once delivery with idempotent consumers.
3. [Keys, dedup stores and TTL sizing](https://github.com/handbook-academy/engineering-handbook/blob/d177ae2b48b4dfebf8ad0ddae51a345b3e17d99e/content/hld/part-3-distributed-systems-theory/07-idempotency-exactly-once.md) (HLD Handbook - Sharding, Distributed Transactions and Idempotency) - Idempotency fundamentals, the idempotency-key pattern with request fingerprint and replayed responses, and consumer-side dedup (`SET NX`, `ON CONFLICT DO NOTHING`) with TTL sized past the retry window. Depth: Skip the standalone Redis marker recipe: setting the marker before a separate processing step can lose an effect after a crash, and the printed argument order is invalid (the form is `SET key value NX EX seconds`). The dedup row and the effect belong in one transaction, as in DDIA.
4. [Dual writes with safe retries](https://algomaster.io/learn/system-design/outbox-pattern) (AlgoMaster System Design - Selected Sharding and Transaction Problems) - The dual-write problem and the outbox relay with delivery, ordering, retry and cleanup notes, read with the idempotency lesson on safe retries.

**Focus**

- The outbox row commits with the business row or neither commits. The relay may lag or duplicate but never invents events.
- Idempotency keys turn retries into no-ops only when the key insert, the effect and the stored result commit in one transaction; a concurrent duplicate then fails on the unique key. Replay the stored result after commit, and rely on the endpoint's own deduplication for external effects.
- Per-aggregate sequences enforce order: apply only the next sequence, reject duplicates, and park gaps for redelivery.
- Exactly-once covers effects inside the boundary (database plus acknowledged processing). External sends such as email can still duplicate.

**Reproduce:** Closed-book, implement the ordered consumer for `acct-1`: `apply("acct-1", 1, 100)` twice, then `apply("acct-1", 3, 25)` and `apply("acct-1", 2, 50)`. Expect `APPLIED`, `DUPLICATE`, `GAP` and `APPLIED`, with balance 150 and last sequence 2. Redeliver sequence 3 with increment 25 and expect balance 175 and last sequence 3.

**Traps**

- Publishing before committing. A crash between publish and commit emits events for rolled-back work; write the outbox row inside the transaction.
- Deleting the current message ID before the broker acknowledgement is durable. In DDIA's four-step receiver the ID goes in a separate transaction after the acknowledgement; a source that can replay keeps dedup state for its whole replay horizon.
- Calling at-least-once delivery exactly-once processing. Delivery duplicates; only the idempotent boundary makes effects once.

**Practice**

- [AlgoMaster Consume Outbox Events Idempotently and in Order](https://algomaster.io/practice/system-design/consume-outbox-events-idempotently-and-in-order) - Implement `apply`, `balance` and `lastSequence` with `DUPLICATE`, `GAP` and `APPLIED`. The acct-1 sequences from Reproduce are the acceptance cases. Drills consumer logic only. The relay and the processed-ID table run in the mini-project.

**Stop when:** Your consumer passes the duplicate, gap and reorder cases and you can draw the boundary around a new workflow.

<details>
<summary>Self-test</summary>

1. An order service writes the order, then publishes, and crashes between the two. What breaks without an outbox?
   - The order exists but no event ships, so downstream services never reserve or bill. The outbox writes row and event atomically instead.
2. The relay delivers one event twice. What does the consumer do?
   - The second apply sees a sequence at or below the last applied one, returns `DUPLICATE`, and changes nothing.
3. Sequence 5 arrives while the last applied is 3. What is the correct action?
   - Return `GAP` and change nothing. Sequence 4 may still arrive by redelivery; applying 5 now would skip it.
4. A retry resends an email step inside the boundary. What is guaranteed?
   - Nothing. External sends escape the boundary. Send after commit with its own dedup key or accept possible duplicates.

</details>

#### U13. A durable workflow with fault tests and invariant reconciliation

**About 6 h** · **Target:** Implement

Topics: Reconciliation and invariant repair; Durable workflow implementation and fault tests

This builds on the earlier units on saga orchestration and compensation and on the transactional outbox and idempotent steps. Now durable decisions, service-side deduplication and reconciliation must work together when the coordinator dies between an effect and its reply.

**You can now**

- Implement a durable workflow with persisted intent, replayable steps and a reconciler.
- Recover from coordinator death, ambiguous replies, duplicate steps and failed compensation.
- Check terminal business conditions independently of workflow status, and distinguish pending repair from completion.

**Study**

1. [Sagas (SIGMOD 1987): recovery state and the recovery daemon](https://www.cs.cornell.edu/andru/cs711/2002fa/reading/sagas.pdf) (Sagas (Garcia-Molina and Salem, 1987)) - Backward Recovery and Forward Recovery, printed pp. 253-254; Other Errors, pp. 254-255; Section 7, Implementing Sagas on Top of an Existing DBMS, pp. 255-256. Depth: Focus on logged progress, save-points, failed compensation and the daemon's periodic scan. The paper assumes local database transactions; remote effects need the preceding unit's atomic deduplication boundary. Skip parallel sagas.
2. [Ledger reconciliation and failed compensation](https://github.com/handbook-academy/engineering-handbook/blob/d177ae2b48b4dfebf8ad0ddae51a345b3e17d99e/content/hld/part-3-distributed-systems-theory/06-distributed-transactions.md) (HLD Handbook - Sharding, Distributed Transactions and Idempotency) - When you do not need distributed transactions: linked ledger entries and reconciliation; Common Pitfalls: Compensations that do not semantically undo and Forgetting idempotency in saga compensations. Depth: Use only these paragraphs as design review. Reconciliation does not make separate commits atomic, and a timed-out action can still complete later. Do not use the checkout solution's unresolved-payment timeout as permission to close a workflow.
3. [Recovery evidence in loglab](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-2/replicated-log-stream-processor.md) (Replicated Log and Stream Processor - Partition and Workflow Slice) - Architecture constraints; Milestone D - Failure handling; Correctness requirements; Failure-injection requirements. Depth: Apply the durable-history, timeout-after-commit and stale-epoch requirements to the DS-6 workflow slice. Stream checkpoints and the full project's fault campaign come later.

**Focus**

- Persist step intent and stable operation identity before dispatch. Record replies durably; if a reply is missing, query or replay the same identity against an endpoint that commits deduplication and effect atomically.
- Recovery must fence a replaced coordinator and respect the recorded forward or compensating decision. Compensation itself can time out, fail or repeat; retain unresolved work with bounded retries and an escalation owner.
- State safety conditions that hold during pending work separately from terminal conditions. A charge awaiting refund is unresolved, not a completed cancellation; eventual repair assumes the dependency recovers or a manual path succeeds.
- Reconcile service ledgers by business identity, not just workflow status. In local fault tests, pause actors before the independent scan; with live services, validate versions before an idempotent repair so a stale scan cannot reverse newer work.

**Reproduce:** In Python 3 on your machine, implement a local durable order fixture with one item available and price 100 integer currency units. Each service atomically stores its effect and stable operation ID; use separate stores from coordinator state. Reserve the item, charge once, then discard the reply and restart the coordinator from persisted intent. Replaying the charge must leave total charged at 100. Make shipping definitively reject without an effect; persist the compensating decision. Fail the first refund without an effect, then restart and retry with the same refund ID. After refund and release succeed, pause actors and independently read ledgers: charged 100, refunded 100, shipped 0, available 1, reserved 0. Repeat compensation and confirm those values stay unchanged. Before the refund succeeds, the order must remain unresolved, not canceled.

**Traps**

- Treating durable intent as proof that a remote effect happened, or a missing reply as proof that it did not. Only the endpoint's durable result resolves that ambiguity.
- Treating compensation as an alternative to retry safety. Even a compensatable charge must not be duplicated by an ambiguous retry.
- Checking only global totals. One order's missing refund can cancel another order's duplicate refund; reconcile by order and operation identity.

**Practice**

- The section mini-project covers this: durable intent, outbox-fed steps, coordinator-death and duplicate injection, failed compensation and invariant reconciliation.

**Stop when:** Your retained crash trace shows a single charge, an unresolved failed refund and an idempotent completed compensation. An independent per-order check passes after recovery, and an order incorrectly marked canceled without its refund makes it fail.

<details>
<summary>Self-test</summary>

1. A charge committed but its reply and coordinator completion record were lost. What should recovery do?
   - Recover intent, fence the prior coordinator, then query or retry the original charge identity. Atomically persisted endpoint deduplication returns the prior result without another charge. A new identity would be unsafe.
2. The refund dependency stays unavailable. Has the cancellation passed its terminal condition?
   - No. Keep compensation pending with bounded retry and escalation. Safety still forbids duplicate charges or refunds, but eventual cancellation needs recovery of the dependency or an explicit manual resolution.
3. Does a charge with no shipment always prove corruption?
   - No. It may be valid pending work. Check the workflow decision and age, and resolve unknown shipping outcomes before retrying or refunding. A terminal canceled order with an unreconciled net charge violates this fixture's contract.
4. Why can an independent scan report a false mismatch while services are changing?
   - Separate reads may observe different stages of progress. Pause actors for the test oracle, or use a versioned observation and revalidate before repair. A correct global total alone also misses per-order drift.

</details>

#### U14. Skew, movement, abort and recovery measurement

**About 4 h** · **Target:** Measure

Topics: Skew, movement, abort and recovery measurement

A balanced key count can hide an overloaded shard, and a low abort rate can hide a broken isolation boundary. Measure costs together with invariant verdicts so an apparent improvement cannot come from silently dropping work.

**You can now**

- Measure per-shard load, movement traffic and time, abort and compensation rates, duplicates and recovery time.
- Compare partition or workflow policies under matched workloads and fault schedules, with raw histories behind every table.
- Separate exact fixture counts, simulated time and local timing results, including runs that fail to recover.

**Study**

1. [What to measure with which setup](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-2/replicated-log-stream-processor.md) (Replicated Log and Stream Processor - Partition and Workflow Slice) - Milestone B - Instrumentation; Milestone E - Measurement / optimization; Measurement requirements; Reproducibility and Engineering judgment in the rubric. Depth: Apply the instrumentation and open-loop load guidance to partition movement and workflow recovery. Do not build the later stream-processing measurements yet.
2. [Reported figures are not targets](https://github.com/handbook-academy/engineering-handbook/blob/d177ae2b48b4dfebf8ad0ddae51a345b3e17d99e/content/hld/part-3-distributed-systems-theory/09-consistent-hashing.md) (HLD Handbook - Sharding, Distributed Transactions and Idempotency) - Virtual nodes: Practical numbers and Heterogeneous capacity; Bounded-load variant, opening hot-key paragraph; Real-World Example, Vimeo's bounded-load consistent hashing in HAProxy. Depth: Use these as hypotheses to test, not targets. Vnode counts and reported deviations do not guarantee request balance; the Vimeo figures describe its cache workload, not your database. Stop before Trade-offs.

**Focus**

- Separate logical requests, attempts, aborts and successful unique effects. Give each rate a denominator; suppressed duplicate deliveries are not duplicate committed effects. Report invariant violations alongside throughput.
- Measure per-shard keys, bytes and requests separately. Count keys whose owner changes separately from bytes actually copied, including replica transfers, catch-up and retries; timestamp the cutover and record availability and tail latency during movement.
- For recovery, name the start event and the completion predicate. Fault healing, coordinator restart and invariant reconciliation are different clocks; a run still pending at the observation limit has no measured completion time.
- On your machine, compare a baseline and changed policy using the same workload and fault trace, then repeat across seeds. Record versions, offered load, concurrency, key sizes, durability settings, warmup, observation window, run count and spread; a seed alone cannot control OS scheduling.

**Reproduce:** Closed-book, write a Python 3 metric extractor for this fixed synthetic fixture, not a benchmark: requests are `[0]*8 + [1]*2`, routed by `key % 2`; keys 0 through 7 change owners from `key % 3` to `key % 4`; a separate transaction history contains 12 completed attempts, three aborted and nine committed. Assert shard request counts `[8, 2]`, maximum-to-mean request load 1.6, five changed owners and attempt abort fraction 0.25. If faults heal at simulated tick 20 and the first quiescent reconciled terminal state is tick 27, recovery is seven simulated ticks, not seven seconds. Then use the extractor on retained baseline and fault-run histories from loglab; label real durations as local measurements and preserve unresolved runs.

**Traps**

- Reporting only latency of successful requests. Include errors, timeouts, pending work and achieved goodput at the stated offered load; otherwise overload can look faster.
- Treating observed key movement as a universal exact fraction. It depends on the key set, hash, placement and membership change; equal key counts need not mean equal bytes or request rates.
- Reporting zero aborts as a win without checking isolation, or excluding stuck recoveries from the summary. Both can reward a weaker or broken implementation.

**Practice**

- The section mini-project covers this: matched baseline and fault runs for skew, movement, aborts, compensation, duplicate suppression and recovery, with raw histories and invariant verdicts.

**Stop when:** The extractor passes the fixed fixture, and a matched baseline/fault table reports skew, moved keys and bytes, abort and compensation denominators, duplicate effects, latency distributions, availability and completed or pending recovery. Keep three repetitions per setup and explain one cost or negative result without weakening the invariant.

<details>
<summary>Self-test</summary>

1. Does the fixture's five-of-eight movement result predict bytes copied?
   - No. It counts owner changes for those keys and those modulo mappings. Byte cost also depends on record sizes, replica placement, catch-up and retransmission.
2. Three aborts in 12 completed attempts give what abort fraction, and do they prove three failed workflows?
   - The attempt abort fraction is 0.25. They need not be three different workflows, and a retry may eventually commit. Report logical workflow outcomes separately.
3. Can the maximum alone decide whether a latency SLO passed?
   - Only if the SLO is a maximum-latency bound. A percentile SLO needs that percentile over its defined request population and window, with errors and timeouts accounted for.
4. Faults heal, but reconciliation has not finished when observation ends. What recovery time should you report?
   - Report recovery as incomplete at the observation limit, with elapsed time and pending state. Do not invent a completion time or omit the run. Simulated ticks remain separate from measured seconds.

</details>

### Mini-project: Fenced shard movement and recoverable transaction workflows

**About 18 to 24 hours.** Extend `loglab` from a replicated group to versioned shard ownership and durable cross-shard work on your machine. Build reduced isolation, atomic-commit and saga fixtures over the existing log, comparing their guarantees and recovery costs without treating compensation as rollback or routing versions as revocation.

1. Build `shard/` placement for range, hash, weighted virtual-node rings and rendezvous routing. Compare joins, leaves and scans with exhaustive placement and access-pattern oracles; retain key/byte movement and fan-out predictions. Check replica placement against independently enumerated failure-domain losses rather than counting virtual nodes as independent replicas.
2. Implement atomic versioned maps, refresh-and-retry routing and fenced freeze/install/delete movement while unaffected shards serve. Check ownership and retained writes against a sequential oracle across stale routes, delayed migration RPCs and controller restart from durable current/next configurations; retain traces. Optionally run MIT 6.5840 Lab 5A/5B.
3. Build shared/exclusive locking with growing/shrinking phases, commit-held locks, predicate protection and wait-for-cycle aborts in `txn/`. Check anomaly fixtures against Berenson's definitions and transaction results against independent serial-order enumeration, including real-time constraints; retain deadlock, phantom, retry and serializable-but-not-strictly-serializable regressions.
4. Add MVCC version selection, safe reclamation and shared-timestamp reads across shards, waiting for each safe time including unresolved prepares. Check against a version-history oracle; retain pinned-snapshot and lagging-shard regressions. Compare per-shard/global index queries and CDC-fed updates with full scans, preserving postings/fetch/merge costs and staleness evidence.
5. Implement durable prepare, tentative writes, lock recovery and coordinator decisions using the Building Distributed Systems two-phase-commit and coordinator-failure drills as protocol checks. Restart at each persistence boundary and duplicate decisions; compare recovered results with an independent atomic-outcome oracle, preserving in-doubt blocking and timeout-after-commit histories.
6. Build `txn/`'s durable saga with outbox/inbox transactions, ordered relaying and atomic processed-ID/effect storage. Inject coordinator death, ambiguous replies, duplicates and failed compensation; compare paused per-business ledgers with independent invariants. Retain fenced recovery, bounded retries/escalation, irreversible-pivot policy and pending-versus-terminal verdicts.
7. After deterministic gates, run repeated matched baseline/fault comparisons, validating extraction against hand-counted histories. Retain versions, workloads, latency distributions, skew, hot-key split/read-fan-out, scatter-gather tails, moved keys/bytes, cutover availability, abort/compensation denominators, suppressed deliveries versus duplicate effects, goodput, recovery predicates and invariant verdicts; include unresolved and negative regimes.

**Deliverables**

- The `shard/` routing and recoverable movement fixture plus `txn/` isolation, atomic-commit, saga, outbox and inbox implementations.
- Independent placement, version-history, serial-order and business-ledger checks with deterministic crash, stale-owner, deadlock and compensation regressions in `tests/` and `faults/`.
- Raw histories and repeated matched cost reports in `reports/`, with explicit atomic boundaries, irreversible steps, pending work and recovery assumptions.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [MIT 6.5840 Spring 2026 Lab 5 Sharded KV, Parts A and B](https://pdos.csail.mit.edu/6.824/labs/lab-shard1.html). Optional after working Labs 2 through 4; retain movement and controller-recovery results. Your durable movement fixture remains required; keep course solutions private.
- external-tests: [Building Distributed Systems: two-phase commit and coordinator failure, TW-1 and TW-2](https://builddistributedsystem.com/tracks/coordinator/tasks/task-9-1-two-phase-commit). Use the browser-graded protocol drills; retain your own durable restart and duplicate-decision evidence beyond their exchange and logging checks.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Placement and ownership | Your placement oracle checks movement and failure-domain survival; sequential-model tests preserve acknowledged writes and exclusive serving authority across stale routes, movement crashes and controller recovery. | Interrupted transitions resume without silent drops; per-event evidence distinguishes map publication, source fencing and destination activation while unaffected shards continue serving. |
| Isolation and atomicity | Your independent serial-order and version-history oracles validate locking and snapshot fixtures. Atomic-outcome checks cover durable prepare, decisions, recovered locks and duplicate decisions without treating timeout as abort permission. | Negative controls expose phantoms, write skew, premature version reclamation and inconsistent shard snapshots; recovery evidence explains permitted blocking separately from isolation or atomicity violations. |
| Workflow recovery evidence | Your paused per-business ledger oracle catches false terminal status and duplicate effects; outbox/inbox recovery handles ambiguous replies and failed compensation. Hand-counted metrics validate repeated matched runs with named versions and workloads. | Reconciliation preserves unresolved irreversible effects and retry escalation; measured skew, movement, tails, aborts and recovery costs retain negative regimes without weakening invariants or hiding pending work. |

Feeds into: Fenced ownership, recoverable transactions and outbox/inbox boundaries feed partition logs, consumer reassignment, CDC and stream checkpoints. Independent reconciliation, crash histories and matched cost evidence support the capstone's transaction and recovery defense.

### Resource route

- **Primary - Book:** [DDIA 2e - Chapters 7 and 8 Sharding and Transactions](https://dataintensive.net/) - Read both chapters completely. Build a decision table connecting access pattern, partition key, isolation, atomicity, failure and recovery before implementing either the partition map or workflow.
- **Required - Paper:** [A Critique of ANSI SQL Isolation Levels (Berenson et al., 1995)](https://arxiv.org/abs/cs/0701157) - Read the phenomena P0 to P3, the snapshot-isolation anomalies A5A (read skew) and A5B (write skew) and the summary tables. Cite these definitions, not the SQL-92 prose they correct.
- **Support - Paper:** [Weak Consistency: A Generalized Theory and Optimistic Implementations for Distributed Transactions (Adya, 1999)](https://publications.csail.mit.edu/lcs/pubs/pdf/MIT-LCS-TR-786.pdf) - Read the dependency-graph definitions of G0, G1 (a, b and c) and G2 and the levels PL-1 to PL-3 they define. They are the anomalies Elle checks on recorded histories.
- **Support - Paper:** [Serializable Snapshot Isolation in PostgreSQL (Ports and Grittner, 2012)](https://arxiv.org/abs/1208.4179) - Read the dangerous-structure rule (two adjacent read-write antidependencies) from Cahill et al. and how PostgreSQL implements and limits it. False positives abort transactions, so measure abort rates.
- **Required - Paper:** [Sagas (Garcia-Molina and Salem, 1987)](https://www.cs.cornell.edu/andru/cs711/2002fa/reading/sagas.pdf) - Read the whole paper: a saga is a sequence of transactions with compensating transactions, and compensation is application-defined. Name the steps whose effects cannot be compensated.
- **Support - Paper:** [Spanner: Google's Globally-Distributed Database (Corbett et al., 2012)](https://static.googleusercontent.com/media/research.google.com/en//archive/spanner-osdi2012.pdf) - Read TrueTime and the concurrency-control section (timestamps, commit wait, read-write and read-only transactions, two-phase commit over Paxos groups). TrueTime needs clock hardware, so emulate bounded uncertainty in simulation.
- **Support - Paper:** [Large-scale Incremental Processing Using Distributed Transactions and Notifications (Peng and Dabek, 2010)](https://www.usenix.org/legacy/event/osdi10/tech/full_papers/Peng.pdf) - Read the snapshot-isolation transaction protocol over Bigtable (primary lock, timestamp oracle) and notifications. Snapshot isolation still admits write skew.
- **Required - Course and project:** [CMU 15-445 - Concurrency Control, Logging and Recovery](https://15445.courses.cs.cmu.edu/fall2025/schedule.html) - Follow Fall 2025 lectures 17 to 22, the transactions homework and the concurrency-control project where available. Reproduce lost update and write skew outside the project before claiming an isolation level.
- **Required - Reference:** [PostgreSQL 18 Documentation - Transaction Isolation and Explicit Locking](https://www.postgresql.org/docs/18/transaction-iso.html) - Read Section 13.2 (Read Committed, Repeatable Read and Serializable with its serialization failures) and 13.3 (row locks and deadlocks). Reproduce write skew under Repeatable Read and its rejection under Serializable in the `postgres:18` image.
- **Support - Reference:** [The Internals of PostgreSQL - Concurrency Control](https://www.interdb.jp/pg/pgsql05/) - Read Chapter 5 Sections 5.5 to 5.9 (snapshots, visibility rules, preventing lost updates and serializable snapshot isolation) to see one real engine implement the anomalies and isolation levels you reproduce. Note the date you read it.
- **Required - Course and lab:** [MIT 6.5840 - Distributed Transactions and Lab 5 Sharded KV](https://pdos.csail.mit.edu/6.824/labs/lab-shard1.html) - Use lecture 11 and Lab 5 for coordinator failure, shard ownership and migration. Treat the lab as the integrated advanced path; a smaller deterministic partition map is sufficient for the compulsory gate if time is constrained.
- **Support - Lab:** [DSLabs - Lab 4 Sharded Store and Transactions](https://github.com/emichael/dslabs/tree/49c4a1f9ed59547501376dd3ccfcdd9c1eb7b427/labs/lab4-shardedstore) - Labs are Java 21 message-passing state machines tested on an emulated network and by model-checking search tests that print a minimal violating trace; run them with the `run-tests.py` script and its `--lab` and `--part` options. Lab 4 adds a shard master, shard movement and multi-key transactions across groups with two-phase commit and locking (Part 3): use it for the commit protocol across groups, which MIT Lab 5 does not exercise.
- **Support - Practice:** [Gossip Glomers - Totally Available Transactions](https://fly.io/dist-sys/6a) - Each challenge runs locally under Maelstrom (v0.2.4; the pages were tested on 0.2.3) with its checker and, where the page says so, the partition nemesis; keep the run directory as the history. Do 6a to 6c (read-uncommitted, then read-committed transactions under partition). The 6b page says the checker cannot detect G0 anomalies, so a pass is weaker than its label.
- **Optional - Practice:** [Building Distributed Systems - The Sharder and The Coordinator](https://builddistributedsystem.com/tracks/coordinator) - Only the first three tasks of each track are free: in The Sharder, a shard controller, consistent hashing and configuration change; in The Coordinator, two-phase commit, coordinator failure and three-phase commit. Tasks are graded in the browser after login, so treat a pass as a drill and keep your local harness as the evidence. 
- **Required - Reference:** [HLD Handbook - Sharding, Distributed Transactions and Idempotency](https://github.com/handbook-academy/engineering-handbook/tree/main/content/hld) - Read Part 2 database sharding, then Part 3 distributed transactions, idempotency and consistent hashing. Use Part 5 event patterns only for the chosen workflow design.
- **Support - Practice:** [AlgoMaster System Design - Selected Sharding and Transaction Problems](https://algomaster.io/practice/system-design) - Use the sharding, consistent hashing, ACID, saga, idempotency and outbox lessons as vocabulary, and the problems Calculate Hash Shard Load, Count Keys Moved by Resharding, Merge Cross-Shard Top-K Results, Analyze Transaction Serializability, Build a Saga Compensation Order and Consume Outbox Events Idempotently and in Order as drills. The capstone must supply real persistence, fault history and load evidence.
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

### Study units

#### U1. Append-only segmented logs, offsets, sparse indexes, retention and compaction

**About 4 h** · **Target:** Explain + Implement

Topics: Append-only segmented log; Offsets and sparse indexes; Retention versus compaction

Every later contract in this section, from consumer positions to checkpoints, is an offset into a durable log. If the log cannot bound its storage or rebuild its index after a crash, nothing above it holds.

**You can now**

- Explain why a log assigns monotonically increasing offsets per partition and what a consumer offset marks.
- Explain segments, sparse indexes, time and size retention, and log compaction as latest-value-per-key retention.
- Implement an append-only segmented log with a sparse index, retention and recovery that replays from the last valid record.

**Study**

1. [The log as the unifying abstraction](https://www.linkedin.com/blog/engineering/distributed-systems/log-what-every-software-engineer-should-know-about-real-time-datas-unifying) (The Log: What Every Software Engineer Should Know About Real-time Data's Unifying Abstraction (Kreps, 2013)) - Part One: the log as an append-only totally ordered sequence; the state-machine replication principle; tables and changelogs as dual views of the log.
2. [Log-based message brokers, offsets and retention](https://dataintensive.net/) (DDIA 2e - Chapters 11 to 13 Batch and Stream Processing) - Chapter 12, Log-Based Message Brokers: per-partition offsets (pp. 495 to 496); consumer offsets (p. 498); segments, retention and the circular-buffer bound with the 22-hour calculation (pp. 498 to 499).
3. [Log compaction](https://dataintensive.net/) (DDIA 2e - Chapters 11 to 13 Batch and Stream Processing) - Chapter 12, Log compaction (pp. 505 to 506): keep the latest value per key, tombstones for deletes, rebuild derived state with a scan from offset 0.
4. [Kafka design ancestor: segments, offsets, pull consumers](https://notes.stephenholiday.com/Kafka.pdf) (Kafka: a Distributed Messaging System for Log Processing (Kreps, Narkhede and Rao, 2011)) - The log-structured design (segments, offsets, stateless broker, pull consumers) and the final section (replication as future work). Depth: Take durability and replication from the current Kafka 4.3 docs, not this paper. Its producer is fire-and-forget with no delivery guarantee.

**Focus**

- An offset identifies a position in one partition only. It never restarts and is never reused within that partition.
- A segment bounds the unit of deletion, and a sparse index maps sampled offsets to file positions, so lookup stays fast while index memory stays bounded.
- Time and size retention deletes whole segments, so a consumer that falls behind the oldest retained segment misses messages. Compaction instead keeps the latest value per key plus tombstones, so a scan from offset 0 rebuilds current state.
- The book gives a concrete bound: one 20 TB disk written at 250 MB/s fills in about 22 hours, so even at full write bandwidth a single disk holds about a day of messages. Real deployments write well below full bandwidth, so retention reaches days or weeks.

**Reproduce:** Closed-book, derive the 20 TB at 250 MB/s bound (about 22 hours) and sketch the segment layout, sparse index entries, and the scan-from-0 rebuild of a compacted topic with one tombstoned key.

**Traps**

- Treating offsets as global across partitions. Ordering and positions hold within one partition only.
- Expecting compaction to shrink append-only event streams. Without repeated keys nothing is deduplicated.
- Assuming a slow consumer can always catch up. Retention deletes segments, so a lagging offset can point at deleted data.

**Practice**

- [Gossip Glomers 5a: single-node Kafka-style log](https://fly.io/dist-sys/5a) - Implement `send`, `poll`, `commit_offsets` and `list_committed_offsets`; run the Evaluation section's kafka workload on one node with the flags given on the page. The checker catches lost writes and nonmonotonic or skipped offsets. It has no recency requirement, so an acknowledged send need not appear in a poll right away; your own log should still serve it on the next poll.

**Stop when:** You can derive the retention bound, explain what compaction keeps, and your 5a node passes the single-node run with its history retained.

<details>
<summary>Self-test</summary>

1. A topic has 3 partitions and a consumer reads offsets 0 to 99 on each. How many totally ordered sequences is it reading?
   - Three, one per partition. There is no ordering guarantee across partitions.
2. A drive holds 20 TB and ingest runs at 250 MB/s. How long before the oldest segment must be deleted?
   - About 22 hours: $`20 \times 10^{12} / (250 \times 10^{6}) = 80{,}000`$ seconds, which is about 22 hours. Deployments that write below full bandwidth retain days or weeks.
3. A compacted topic holds keys mew, purr and scratch, then a tombstone for purr. What does a scan from offset 0 return?
   - The latest value for mew and scratch, and nothing for purr. The tombstone removes purr during compaction.
4. Why does the Kafka 2011 paper not settle your durability design?
   - Replication is future work in that paper and its producer is fire-and-forget, so broker loss behavior must come from the current 4.3 docs and your own acknowledgement contract.

</details>

#### U2. Partitions, per-partition ordering, replication and high-watermark visibility

**About 4 h** · **Target:** Explain

Topics: Partitions and per-partition ordering; Replication and high-watermark visibility

Partitioning buys throughput by giving up global order, and replication buys survival by hiding uncommitted records. Every routing key and every read after a failover depends on this boundary.

**You can now**

- Explain per-partition ordering and how a partition key routes all events of one entity to the same partition.
- Explain leader, followers and in-sync replicas, and why only committed offsets below the high watermark are visible to consumers.
- State which writes survive a leader loss under `acks=all` with `min.insync.replicas` set, and which are refused instead.

**Study**

1. [Partitions and per-partition ordering](https://dataintensive.net/) (DDIA 2e - Chapters 11 to 13 Batch and Stream Processing) - Chapter 12, Log-Based Message Brokers (pp. 496 to 497): Figure 12-3, offsets within a partition, no ordering across partitions, routing by partition key such as user ID.
2. [Replication, ISR and durability guarantees](https://kafka.apache.org/43/design/design/) (Apache Kafka 4.3 - Design, Log, Rebalance and Transaction Protocols) - Replication; Replicated Logs: Quorums, ISRs, and State Machines; Availability and Durability Guarantees (`acks` with `min.insync.replicas`; committed writes safe while one in-sync replica lives); Unclean leader election.

**Focus**

- A partition is the unit of ordering and of parallelism: more partitions raise throughput but also the number of independent sequences.
- All events that need a fixed relative order must share a partition key. Key by entity ID, not by timestamp.
- Followers pull like consumers, and the leader commits a write only after all in-sync replicas receive it.
- The high watermark marks the end of the committed prefix: consumers read only offsets below it, never up to the log end offset, so uncommitted tail records stay invisible.

**Reproduce:** Closed-book, draw one partition with a leader and two followers, mark the log end offset and the high watermark after a write reaches the leader and one follower, and state which `acks` values would have returned success.

**Traps**

- Reading uncommitted tail records. A record the leader holds but has not committed can vanish in a failover.
- Enabling unclean leader election for availability and still claiming no loss. An out-of-sync replica elected leader drops records the old leader had committed.
- Assuming partition count can be lowered later. Kafka supports only increasing partitions per topic, which changes the key-to-partition mapping.

**Practice**

- The section mini-project covers this: replicated commit with an explicit high watermark and leader-failover tests.

**Stop when:** You can trace a write from leader append through ISR acknowledgement to consumer visibility, and predict the outcome of each failover case above.

<details>
<summary>Self-test</summary>

1. Two requests from one user are handled by different web servers. How do their events keep a fixed relative order?
   - Route both by the user ID as partition key so they land in the same partition, which is totally ordered.
2. A write reaches the leader only. Which `acks` settings report success, and can a consumer read the record?
   - `acks=1` and `acks=0` report success; `acks=all` does not. No consumer can read it yet because it is still above the high watermark.
3. With `min.insync.replicas=2`, one follower lags out of the ISR and then the leader dies. What happens to committed writes and to new `acks=all` writes?
   - Committed writes are safe while one in-sync replica lives. New `acks=all` writes are refused with an error until the ISR recovers; nothing is silently lost.
4. Unclean leader election is enabled, all in-sync replicas die, and an out-of-sync replica is elected. What breaks?
   - Records committed on the dead replicas but missing on the new leader are lost, and consumers can see gaps. Availability is preserved at the cost of the durability contract.

</details>

#### U3. Producer acknowledgements, idempotent sequence state and transactional scope

**About 4 h** · **Target:** Explain + Derive

Topics: Producer acknowledgement choices; Idempotent producer sequence state; Transactional producer scope

Retried requests are certain and ambiguous outcomes are permanent: a timeout never says whether the write landed. Acknowledgements, sequence state and transactions are the three tools that make retries safe.

**You can now**

- Explain `acks` 0, 1 and all as durability versus latency choices gated by `min.insync.replicas`.
- Explain the idempotent producer's per-partition sequence state and what breaks duplicate suppression.
- Derive the atomic scope of a Kafka transaction: which partition writes and offsets commit together, and what stays outside it.

**Study**

1. [Delivery semantics and transactions](https://kafka.apache.org/43/design/design/) (Apache Kafka 4.3 - Design, Log, Rebalance and Transaction Protocols) - Message Delivery Semantics (at-most, at-least and exactly-once; idempotent producer with producer ID and sequence numbers); Using Transactions (offsets atomic with output; `isolation.level=read_committed` with `enable.auto.commit=false` and `transactional.id`).
2. [Server-side transaction defense](https://kafka.apache.org/43/operations/transaction-protocol/) (Apache Kafka 4.3 - Design, Log, Rebalance and Transaction Protocols) - Overview: KIP-890 Transactions Server Side Defense, generally available since 4.0, with a producer epoch bump per transaction. Depth: Read the Overview only. Skip Upgrade and Downgrade and Performance unless you run a multi-version setup.
3. [Atomic commit scope in stream processors](https://dataintensive.net/) (DDIA 2e - Chapters 11 to 13 Batch and Stream Processing) - Chapter 12, Atomic commit revisited (pp. 527 to 528): internal transactions in Dataflow, VoltDB and Kafka; overhead amortized over several input messages per transaction.

**Focus**

- `acks=0` never waits, `acks=1` waits for the leader only, and `acks=all` waits for all current in-sync replicas, further gated by `min.insync.replicas`. Without that gate the ISR can shrink to the leader and `all` means the leader only.
- Idempotence keys each retried batch by producer ID plus per-partition sequence numbers, so a batch the broker already wrote is acknowledged without a second append. It is per partition and holds only while the broker retains that producer's sequence state.
- A transaction commits a set of partition writes plus consumer offsets atomically, readable under `read_committed`. Anything outside Kafka, such as a database write or an email, is not in that atomic scope.
- Timeout ambiguity remains: a producer that times out cannot tell a lost request from a lost reply, so it must retry and let deduplication or the transaction decide.

**Reproduce:** Closed-book, write the `acks` and `min.insync.replicas` settings that lose an acknowledged write when the leader dies, and the settings that refuse the write instead, and state the read rule that hides aborted transactions.

**Traps**

- Calling `acks=all` alone durable. Without `min.insync.replicas` the ISR can shrink to the leader, so `all` means the leader only.
- Expecting transactions to cover external effects. The atomic scope ends at Kafka partition writes plus offsets.
- Using `kafka-console-producer.sh` to test transactions. It cannot run transactions; use client code.

**Practice**

- The section mini-project covers this: producer identity with retry and duplicate tests, including timeout-after-commit cases.

**Stop when:** You can predict the fate of a write for each `acks` value under leader death, and draw the exact boundary of a transaction's atomic scope.

<details>
<summary>Self-test</summary>

1. With `acks=1`, the leader acknowledges a write and dies before replicating it. Is the write lost?
   - Yes. Only the leader held it, so the acknowledgement promised nothing about replication.
2. With `min.insync.replicas=2` and an ISR of just the leader, what does an `acks=all` write return?
   - An error refusing the write until the ISR recovers. The broker rejects instead of silently weakening durability.
3. A batch times out and the producer retries with the same sequence number. The broker already appended it. What happens?
   - The broker detects the duplicate sequence and acknowledges without appending again, so the retry is safe.
4. A transaction writes partitions A and B plus offsets, then aborts. What does a `read_committed` consumer see?
   - Nothing from that transaction: `read_committed` skips its aborted records. The consumer offsets written in the transaction never take effect either, so the input records are read and processed again.

</details>

#### U4. Pull consumers, fetch positions, consumer groups and rebalance protocols

**About 4 h** · **Target:** Explain

Topics: Consumers, pull loops and fetch positions; Consumer groups and ownership; Assignment and rebalance protocols

The consumer group is where ordering meets parallelism: each partition gets exactly one reader, and every membership change moves that reader. Rebalance behavior decides what pauses and what repeats.

**You can now**

- Explain pull with fetch positions and why the broker keeps no per-message acknowledgement state.
- Explain consumer groups, partition ownership and static membership with `group.instance.id`.
- Explain rebalance generations and what pauses or duplicates a rebalance can cause.

**Study**

1. [Consumer groups and coarse-grained load balancing](https://dataintensive.net/) (DDIA 2e - Chapters 11 to 13 Batch and Stream Processing) - Chapter 12, Multiple consumers with Figure 12-1 (pp. 492 to 493): load balancing versus fan-out, consumer groups; Log-Based Message Brokers (p. 497): shard assignment to group members, single-threaded shard consumption, head-of-line blocking.
2. [The consumer: pull, position and static membership](https://kafka.apache.org/43/design/design/) (Apache Kafka 4.3 - Design, Log, Rebalance and Transaction Protocols) - The Consumer (pull and long-poll rationale); Consumer Position (position as one integer offset with rewind support); Static Membership (`group.instance.id` with fenced restarts).
3. [Consumer rebalance protocol](https://kafka.apache.org/43/operations/consumer-rebalance-protocol/) (Apache Kafka 4.3 - Design, Log, Rebalance and Transaction Protocols) - Overview (KIP-848, generally available since 4.0: Consumer versus Classic groups, server-side assignors); Consumer (opt-in with `group.protocol=consumer`); Upgrade and Downgrade. Depth: Read the Overview and Consumer sections only. In 4.3 the Consumer protocol is opt-in; the 5.0 default change is out of scope.

**Focus**

- Consumers pull and track one integer position per partition. The broker never tracks which message each consumer saw, which is why offsets are cheap.
- A group assigns each partition to exactly one member; two groups over one topic give fan-out across groups. Members beyond the partition count sit idle.
- Rebalance moves ownership on join, leave or crash, fenced by generations, with static members keeping partitions across rolling restarts. During the pause nobody reads the moved partitions.
- A member that processed records but did not commit before losing its partitions causes those records to be redelivered to the new owner.

**Reproduce:** Closed-book, trace a 6-partition topic across a 3-member group when one member dies: which partitions move, what the new owners fetch first, and which records repeat.

**Traps**

- Adding more consumers than partitions to raise throughput. Extra members sit idle; raise partitions instead.
- Expecting KIP-848 behavior from default clients. In 4.3 the Consumer protocol needs `group.protocol=consumer`.
- Treating a rebalance as lossless by itself. Ownership moves; which records repeat depends on committed offsets, not on the protocol.

**Practice**

- The section mini-project covers this: consumer-group ownership with kill-and-reassign replay tests.

**Stop when:** You can assign partitions to any group size, predict the redelivery after a member death, and state when no rebalance happens at all.

<details>
<summary>Self-test</summary>

1. Six partitions, four live members, then a fifth member joins. How many members read, and with what split?
   - All five read, split 2, 1, 1, 1 and 1, since each partition has exactly one owner. A member sits idle only when members outnumber partitions.
2. A member has committed position 10 (offsets up to 9 done), processes offsets 10 to 12, then crashes before its next commit, and its partitions move. Where does the new owner start, and what repeats?
   - It resumes at 10, the committed position. Offsets 10 to 12 are delivered and processed a second time.
3. What does `group.instance.id` change on a rolling restart?
   - The restarted process rejoins as the same static member, so if it returns within the session timeout it keeps its partitions and no rebalance moves ownership. Records it processed but had not committed before the restart are still read again.
4. Why do log-based brokers pull instead of pushing?
   - Pull lets each consumer control its rate, batching and replay position, and keeps the broker free of per-consumer acknowledgement state.

</details>

#### U5. Offset commits versus application state and at-most-once, at-least-once and effectively-once delivery

**About 4 h** · **Target:** Derive

Topics: Offset commit versus application state; At-most-once delivery; At-least-once delivery; Effectively-once effect contract

Delivery labels describe where the offset moves relative to the work, not magic in the transport. The same broker gives all three semantics depending on when the consumer commits.

**You can now**

- Derive at-most-once, at-least-once and effectively-once from the order of processing, effect publication and offset commit.
- Enumerate the crash windows between read, state update, output and offset commit, and state the valid recovery for each.
- State an effectively-once effect contract with its atomic boundary and retention bound.

**Study**

1. [Fault tolerance: scope, atomic commit and idempotence](https://dataintensive.net/) (DDIA 2e - Chapters 11 to 13 Batch and Stream Processing) - Chapter 12, Fault Tolerance (pp. 526 to 528): microbatching and checkpointing cover state inside the framework only; Atomic commit revisited (effects plus offsets atomically); Idempotence (offset-keyed writes, determinism and fencing assumptions).
2. [Message delivery semantics](https://kafka.apache.org/43/design/design/) (Apache Kafka 4.3 - Design, Log, Rebalance and Transaction Protocols) - Message Delivery Semantics: at-most, at-least and exactly-once definitions with the producer-timeout ambiguity.
3. [Exactly-once as at-least-once plus idempotence](https://github.com/handbook-academy/engineering-handbook/blob/d177ae2b48b4dfebf8ad0ddae51a345b3e17d99e/content/hld/part-3-distributed-systems-theory/07-idempotency-exactly-once.md) (HLD Handbook - Queues, Streaming, Stream vs Batch and CDC) - The Two Generals framing through the Kafka idempotent and transactional producer sections. Depth: Review after the DDIA items. Treat its deployment numbers as reported figures from their era, not targets.

**Focus**

- Commit-before-process loses on crash, which is at most once. Process-before-commit duplicates on crash, which is at least once. The order of two operations decides the label.
- Effectively-once needs the effect and the offset, or a dedup key, in one atomic boundary: a transaction or an idempotent write keyed by offset.
- Idempotent replay needs deterministic processing, same-order replay, no concurrent writer, and dedup state retained past the retry horizon.
- Storing the triggering offset with the value, as in Storm Trident, turns already-applied detection into a local read.

**Reproduce:** Closed-book, list the four crash windows for read, state update, external write and offset commit, and give the recovery behavior that each commit ordering forces.

**Traps**

- Claiming exactly-once from checkpointing alone. Output that left the processor before the crash cannot be recalled.
- Committing offsets on a timer and calling redelivery impossible. Async commit widens the at-least-once window instead of closing it.
- Keeping dedup keys forever or dropping them early. Unbounded state grows; short retention re-accepts old duplicates past the horizon.

**Practice**

- [AlgoMaster: Build an Idempotent Consumer](https://algomaster.io/practice/system-design/build-an-idempotent-consumer) - `process` returns true once per message ID and false on every redelivery; per-object dedup state. The judge tests one object with no crashes. Add a TTL on the ID set and a crash-restart test in the mini-project to make the retention bound real.
- [AlgoMaster: Deduplicate Idempotent Requests](https://algomaster.io/practice/system-design/deduplicate-idempotent-requests) - `execute` stores the first result per key and replays it on retries; keys are case-sensitive. The judge keeps entries for the object lifetime. Decide the production retention bound separately, since retries past it execute twice.

**Stop when:** You can label any commit ordering with its delivery semantics, draw its crash windows, and state the atomic boundary behind each effectively-once claim.

<details>
<summary>Self-test</summary>

1. A consumer commits position 11, past record 10, then crashes before processing record 10. What happens to record 10?
   - It is lost to the group: the next owner resumes at 11. The commit claimed progress the consumer never made, which is at-most-once behavior.
2. A consumer writes a database row, crashes before committing the offset, and restarts. What does it see, and what prevents a duplicate row?
   - It redelivers the record. Only an idempotent write, such as the offset stored with the row in one atomic boundary, prevents the duplicate.
3. At-least-once delivery plus an idempotent consumer equals what, and with which boundary?
   - Effectively-once effects within the dedup retention bound and inside systems the consumer controls. An external RPC or second database write outside the boundary breaks it.
4. Two processors concurrently write offset-stamped values for the same key. Is the result idempotent?
   - No. Concurrent writers interleave, so the last write need not carry the highest offset. Idempotent replay needs a single writer or fencing.

</details>

#### U6. Retries, poison records, dead letters and bounded backlog

**About 4 h** · **Target:** Explain + Implement

Topics: Retries, poison records and dead letters; Backpressure and bounded backlog

At-least-once delivery retries everything, including the record that will never succeed. Without a dead letter and a bounded backlog, one bad record or one slow consumer stops the whole partition.

**You can now**

- Explain why a poison record stalls a strictly ordered partition and how bounded retries plus a dead-letter queue restore progress.
- Explain the log as a bounded buffer with lag monitoring, and derive how long a backlog takes to drain at spare capacity.
- Implement a retry-with-dead-letter rule and a lag alert against a retention bound.

**Study**

1. [Redelivery, dead letters and slow consumers](https://dataintensive.net/) (DDIA 2e - Chapters 11 to 13 Batch and Stream Processing) - Chapter 12, Acknowledgments and redelivery through dead letter queues (pp. 493 to 495): crash loops under strong ordering, DLQs with operator decision; When consumers cannot keep up with producers (p. 499): bounded buffer, lag monitoring, one slow consumer affects only itself.
2. [Drop, buffer or backpressure](https://dataintensive.net/) (DDIA 2e - Chapters 11 to 13 Batch and Stream Processing) - Chapter 12, Messaging Systems (p. 489): the three overload choices, with Unix pipes and TCP as backpressure examples.
3. [Backlogs, sidelining and upstream backpressure](https://aws.amazon.com/builders-library/avoiding-insurmountable-queue-backlogs/) (AWS Builders' Library - Avoiding Insurmountable Queue Backlogs) - Backlogs (drain at spare capacity, with the multitenant spike example); Amazon's approach (sidelining excess traffic, constant work, pushing backpressure upstream); Measuring availability and latency (message age).

**Focus**

- A poison record under at-least-once redelivery plus strict per-partition order stops the partition. Bound the retries, then move the record to a dead-letter queue, alert, and let an operator decide to drop, fix or replay it.
- A log is a large bounded buffer, not an infinite one. Monitor consumer lag in records and in time, and fix slow consumers before their offsets age past retention.
- Under sustained overload, shed or sideline low-priority work and push backpressure upstream. A backlog drains at spare capacity only, so a short spike can take many hours to clear.
- Alert on arrival and drain rates with queue depth, never on depth alone. Depth without rates cannot say whether the backlog ever drains.

**Reproduce:** Closed-book, write the retry-with-dead-letter decision rule (deliver while failures stay within budget, dead-letter past it) and the lag alert rule (committed offset versus log end offset, checked against retention).

**Traps**

- Retrying a poison record forever. Deterministic failures never succeed, and each retry burns the partition's progress.
- Treating buffering as backpressure. An unbounded queue delays the failure and hides it until the disk fills or retention drops data.
- Replaying a dead letter without a fix. The same record crashes the same code path again unless the code or the record changed.

**Practice**

- [AlgoMaster: Classify Retry Outcomes](https://algomaster.io/practice/system-design/classify-retry-outcomes) - `classify` returns delivered while the failure count stays within budget else dlq, order-preserving, including the zero-budget edge case. The judge tests the routing rule only. Wire it to a dead-letter topic plus a lag alert against retention in the mini-project.

**Stop when:** You can state the retry budget, the dead-letter decision and the drain time for a stated arrival and drain rate, and your consumer alerts before retention drops data.

<details>
<summary>Self-test</summary>

1. A message missing a required JSON key crashes each consumer that reads it. What happens under strong per-partition ordering, and what is the remedy?
   - The partition stalls because the record redelivers forever. Move it to a dead-letter queue after the retry budget, alert, and fix the consumer code or the record before replaying it.
2. Failures are `[0, 2, 3, 1, 4]` with `maxRetries` 2. Which messages are delivered and which go to the dead letter?
   - Delivered, delivered, dead letter, delivered, dead letter. A message is delivered while its failure count stays within budget.
3. A consumer lags past the oldest retained segment. What does it miss, and who else is affected?
   - It misses the deleted messages and must skip ahead. Only that consumer is affected; other consumers keep their own offsets.
4. Arrivals run at twice the drain rate for one hour, then spare capacity is 10 percent of drain. How long to clear the backlog?
   - About 10 hours. The backlog holds one drain-hour of work, and with arrivals continuing it shrinks only by the spare 10 percent, so $`1 / 0.1 = 10`$ hours.

</details>

#### U7. Deterministic replay, schema registries and change data capture

**About 4 h** · **Target:** Explain + Implement

Topics: Replay and deterministic reprocessing; Schema registry and compatibility; Change data capture and source offsets

Derived state is only as trustworthy as its replay: the same log must rebuild the same projection after a bug fix, a new index, or a schema change. Compatibility rules decide which readers survive that replay.

**You can now**

- Explain what makes a replay deterministic and how reprocessing supports schema migration with old and new views side by side.
- Explain backward, forward and full compatibility, and implement per-key version checks with tombstone handling in a CDC projection.
- Implement offset-deduped application of a CDC stream with source offsets tracked for resume.

**Study**

1. [Change data capture and log compaction](https://dataintensive.net/) (DDIA 2e - Chapters 11 to 13 Batch and Stream Processing) - Chapter 12, Change Data Capture (pp. 503 to 504): Debezium source connectors, Kafka Connect, async lag; Initial snapshot (p. 504): snapshot plus log position with DBLog watermarking; Log compaction (pp. 505 to 506): rebuild from offset 0.
2. [Reprocessing for application evolution](https://dataintensive.net/) (DDIA 2e - Chapters 11 to 13 Batch and Stream Processing) - Chapter 13, Reprocessing data for application evolution through Unifying batch and stream processing (pp. 545 to 546): old and new views side by side; replay needs event-time windowing and exactly-once output.
3. [Compatibility types](https://docs.confluent.io/platform/current/schema-registry/fundamentals/schema-evolution.html) (Confluent Schema Registry - Schema Evolution and Compatibility) - Compatibility types: Backward, Forward and Full compatibility with their Transitive variants; the default BACKWARD check. New code reads old data under Backward; old code reads new data under Forward.
4. [Avro schema resolution](https://avro.apache.org/docs/1.12.0/specification/) (Apache Avro 1.12.0 Specification - Schema Resolution) - Schema Resolution: records match by field name, writer-only fields are ignored, reader-only fields are filled from defaults, plus the promotion rules.

**Focus**

- Replay is deterministic only with event-time timestamps and versioned logic. Reprocessing with processing-time windows rewrites history instead of repeating it.
- A CDC consumer keeps source offsets with its projection so a restart resumes without reapplying or skipping. A snapshot plus a log position restarts a new projection the same way.
- Backward compatibility lets new code read old data, Forward lets old code read new data, and Full allows both. Check transitively when many schema versions coexist in the log.
- Avro resolution matches fields by name: unknown writer fields are ignored and missing reader fields come from defaults. Defaults are part of the contract: a field added without a default breaks backward compatibility, since new readers cannot fill it in old data, while old readers simply ignore it.

**Reproduce:** Closed-book, replay a three-event CDC sequence (upsert version 1, delete version 2, late upsert version 1) against a projection and show the late event rejected; then add an optional field under Backward compatibility and state which readers break.

**Traps**

- Replaying without idempotent application. A retried offset applies twice unless the projection dedups by offset or by per-key version.
- Letting a late event resurrect a deleted row. Compare per-key versions and keep tombstones until the retention horizon.
- Adding a required field and calling it backward compatible. Old records carry no value for it; only optional-with-default keeps both directions working.

**Practice**

- [AlgoMaster: Apply Ordered CDC Changes](https://algomaster.io/practice/system-design/apply-ordered-cdc-changes) - `apply` accepts a change only when its version is strictly newer per key; deletes leave tombstones; equal versions are rejected as duplicates. The judge tests one projection with no partitions. Cross-partition ordering and schema checks live in the mini-project.
- [AlgoMaster: Replay CDC into a Materialized View](https://algomaster.io/practice/system-design/replay-cdc-into-a-materialized-view) - `apply` dedups by log offset so retries return false without changing state; `get` returns -1 for absent keys. The judge supplies offsets in log order with repeats. Out-of-order arrivals and snapshot-plus-position restarts are mini-project work.

**Stop when:** You can replay a CDC history with retries, deletes and late events to the same projection state, and defend a schema change under the right compatibility level.

<details>
<summary>Self-test</summary>

1. Apply offset 1 upsert, then offset 1 again, then offset 2 delete. What does each call return, and what does the view hold?
   - True, false, true. The retry changes nothing and the delete removes the key, so the view is empty with size 0.
2. A version 3 delete is followed by a late version 2 upsert for the same key. Accepted or rejected, and why?
   - Rejected. Versions are per key and only strictly newer versions apply, so the tombstone stands and the row is not resurrected.
3. A writer sends fields `a` and `b` while the reader expects only `a`. Then a writer sends only `a` while the reader expects `a` and `b` with a default. What does the reader see?
   - First `a` only, with `b` ignored. Then `a` plus `b` filled from its default.
4. Old and new readers and writers coexist on one topic. Which compatibility level do you require?
   - Full, in its transitive form if versions can skip. Only it lets old code read new data and new code read old data.

</details>

#### U8. Event time versus processing time and tumbling, sliding and session windows

**About 4 h** · **Target:** Explain + Derive

Topics: Event time versus processing time; Tumbling, sliding and session windows

Windows turn an unbounded stream into finite pieces, and the clock behind them decides what each piece means. A redeploy that replays a backlog must not rewrite the measured history.

**You can now**

- Explain event time versus processing time and the artifacts that processing-time windowing invents during backlogs.
- Derive window membership for tumbling, hopping, sliding and session windows on a fixed event sequence.
- State the per-window output rule, including empty windows and the session-gap boundary.

**Study**

1. [What, where, when and how](https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/43864.pdf) (The Dataflow Model (Akidau et al., 2015)) - Section 2: the what, where, when and how questions; event time versus processing time; windows, triggers and accumulation with discard, accumulate and retract modes.
2. [Reasoning about time and window types](https://dataintensive.net/) (DDIA 2e - Chapters 11 to 13 Batch and Stream Processing) - Chapter 12, Reasoning About Time through Types of windows (pp. 518 to 522): event versus processing time, the backlog rate-spike artifact, tumbling, hopping, sliding and session windows with their state costs.
3. [Timely stream processing: notions of time and windowing](https://nightlies.apache.org/flink/flink-docs-release-2.3/docs/concepts/time/) (Apache Flink 2.3 - Event Time, State and Checkpointing) - Notions of Time: Event Time and Processing Time; Event Time and Watermarks; Lateness; Windowing (tumbling, sliding, session and time versus data driven windows).

**Focus**

- Event time comes from the event and never changes; processing time comes from the machine clock. Measuring a replayed backlog by processing time invents a spike the real request rate never had.
- Tumbling assigns each event to exactly one fixed window. Hopping overlaps fixed windows. Sliding holds events that occur within an interval of each other, even across fixed boundaries. Session groups one user's events until an inactivity gap ends the session.
- Two events five minutes apart can share a five-minute sliding window while falling in different tumbling windows. Fixed boundaries and pairwise intervals answer different questions.
- Window state cost follows the buffering need: counters stay constant size, while sliding windows and joins buffer events until the window closes.

**Reproduce:** Closed-book, assign events at 10:03:39 and 10:08:12 to five-minute tumbling windows, five-minute hopping windows with a one-minute hop, five-minute sliding windows and session windows with a 30-minute gap, and state which windows they share.

**Traps**

- Windowing by arrival time and calling it event time. Reprocessing history then answers a different question than live processing did.
- Assuming hopping equals sliding. Hopping has fixed boundaries; sliding is defined by pairwise intervals.
- Leaving the session-gap boundary unstated. Record whether a gap equal to the threshold starts a new session, since systems differ.

**Practice**

- [AlgoMaster: Aggregate Tumbling Windows](https://algomaster.io/practice/system-design/aggregate-tumbling-windows) - Sum values per window index from 0 through the highest touched window, with 0 for empty windows; timestamps need not be sorted. The judge tests the assignment function only, on a subscription the learner owns. Watermarking, lateness and state recovery are mini-project work.
- [AlgoMaster: Assign Events to Session Windows](https://algomaster.io/practice/system-design/assign-events-to-session-windows) - Per-user sessions with the gap-reaches-threshold rule; interleaved users stay independent. Same scope as above: assignment logic here, event-time execution and recovery in the mini-project.

**Stop when:** You can bucket any timestamp by hand under each window type and predict what a backlog replay does to processing-time charts.

<details>
<summary>Self-test</summary>

1. A redeployed processor burns through a one-minute backlog and the per-second request chart spikes. What caused it, and what is the fix?
   - The chart is windowed by processing time, so the backlog compressed into seconds of processing. Window by event time to recover the steady real rate.
2. Two events occur at 10:03:39 and 10:08:12. Which windows do they share: five-minute tumbling, five-minute hopping with a one-minute hop, five-minute sliding, or sessions with a 30-minute gap?
   - The sliding window and the session. They are 4 minutes 33 seconds apart, so some five-minute interval holds both, and the gap is far below 30 minutes. Tumbling windows put them in 10:00 to 10:05 and 10:05 to 10:10. The last one-minute hop holding 10:03:39 is 10:03 to 10:08, which ends before 10:08:12; a 30-second hop would give 10:03:30 to 10:08:30, which holds both.
3. Events for users `[a, a, b, a, b]` arrive at `[0, 4, 5, 10, 11]` with inactivity gap 6, starting a new session when the gap reaches the threshold. What are the session numbers?
   - `[1, 1, 1, 2, 2]`. User a continues at gap 4 and restarts at gap 6; user b starts at 5 and restarts at gap 6. Each user is tracked independently.
4. Events at timestamps 2 and 12 carry values 10 and 5 with window size 5, windows starting at 0. What does the tumbling aggregation return?
   - `[10, 0, 5]`. Window index is integer division $`t / w`$, so the events land in windows 0 and 2, and the empty window 1 reports 0.

</details>

#### U9. Watermarks, idle-source stalls and late-data policy

**About 4 h** · **Target:** Derive + Implement

Topics: Watermarks as progress estimates; Idle sources and watermark stalls; Late-data and update policy

Windows never close by themselves: something must declare the past complete while stragglers still arrive. The watermark is that declaration, and the late-data policy is what keeps it honest.

**You can now**

- Derive an operator's event time as the minimum over its inputs and show how one idle source stalls it.
- Explain watermarks as progress estimates and configure idleness detection plus allowed lateness with a side output.
- Implement a late-data policy (drop with a counter versus update with a correction) inside a retention horizon.

**Study**

1. [Low watermarks and bounded deduplication](https://www.vldb.org/pvldb/vol6/p1033-akidau.pdf) (MillWheel: Fault-Tolerant Stream Processing at Internet Scale (Akidau et al., 2013)) - Low watermarks with the recursive definition over inputs; at-least-once delivery with deduplication and strong productions; the retention bound on what dedup can catch.
2. [Generating watermarks and handling idle sources](https://nightlies.apache.org/flink/flink-docs-release-2.3/docs/dev/datastream/event-time/generating_watermarks/) (Apache Flink 2.3 - Event Time, State and Checkpointing) - Dealing With Idle Sources (the minimum-over-inputs stall with `.withIdleness`); periodic versus punctuated watermark generators; how operators process watermarks.
3. [Allowed lateness and late-data side outputs](https://nightlies.apache.org/flink/flink-docs-release-2.3/docs/dev/datastream/operators/windows/) (Apache Flink 2.3 - Event Time, State and Checkpointing) - Allowed Lateness (default 0 drops events behind the watermark, in-lateness refires via the event-time trigger); getting late data as a side output.
4. [Stragglers and timestamp estimation](https://dataintensive.net/) (DDIA 2e - Chapters 11 to 13 Batch and Stream Processing) - Chapter 12, Handling straggler events and Whose clock are you using (pp. 520 to 521): ignore versus publish a correction; the three timestamps that estimate true event time from an untrusted device clock.

**Focus**

- A watermark of $`t`$ asserts that no more events with timestamp at most $`t`$ should follow. It is a progress estimate, not a promise the transport enforces.
- An operator's event time is the minimum watermark over its inputs, so one idle partition stalls the whole operator unless idleness is declared with `.withIdleness`.
- The late-data policy is explicit: drop with a counter, or update with a correction through accumulate or retract modes. Flink drops events behind the watermark by default, since allowed lateness is 0.
- Deduplication and corrections hold only within retention. A duplicate older than the horizon looks new again, and expired window state cannot be corrected.

**Reproduce:** Closed-book, advance two input watermarks to 5 and a stalled 2, compute the operator watermark, apply idleness detection, then route an event at time 3 under the drop versus update policy.

**Traps**

- Treating watermarks as guarantees. Late events still arrive; the policy decides their fate, not the watermark.
- Taking the maximum over inputs. Progress follows the slowest input, which is the minimum.
- Raising allowed lateness without budgeting state. Buffered events and corrections accumulate until the horizon passes.

**Practice**

- [AlgoMaster: Deduplicate Stream Events with TTL](https://algomaster.io/practice/system-design/deduplicate-stream-events-with-ttl) - Accept within the TTL is rejected; the expiry boundary accepts and replaces the stored time; rejections do not refresh the TTL. A single-process drill that makes the retention horizon concrete, on a subscription the learner owns. Watermark propagation and the drop-versus-update policy are mini-project work.

**Stop when:** You can compute operator watermarks by hand, configure idleness and lateness for a stated policy, and say exactly which late events each choice drops or corrects.

<details>
<summary>Self-test</summary>

1. Two inputs hold watermarks 5 and 2. What is the operator's event time, and what happens to a window ending at 5?
   - Event time 2, the minimum. The window cannot fire yet; the stalled input holds it back until its watermark advances or idleness is declared.
2. Allowed lateness is 0 and an event arrives behind the watermark. What happens to it by default, and where can it go instead?
   - It is dropped. With a side output configured, it is routed there for counting or separate handling instead of vanishing silently.
3. MillWheel redelivers an event first seen a month ago. Does deduplication catch it?
   - Only if the dedup horizon still covers it. Past the retention bound the redelivery looks new and is processed again.
4. A phone buffers events offline for a day, then uploads them. Which timestamp describes the user action, and why is it suspect?
   - The device-clock occurrence time describes the action, but device clocks may be wrong. The server-receive time is accurate yet describes arrival, so the three-timestamp method estimates the offset between them.

</details>

#### U10. Keyed state, checkpoint barriers and the source-state-sink recovery boundary

**About 5 h** · **Target:** Explain + Derive

Topics: Stateful operators and keyed state; Checkpoint barriers and state snapshots; Source-state-sink recovery boundary

State makes streams useful and recovery hard: a restart must bring back the same derived state and the same input position together, or outputs silently double or vanish.

**You can now**

- Explain keyed state partitioning and how rescaling reassigns key groups with their state.
- Derive the barrier snapshotting rule for acyclic graphs and the marker rules it inherits from Chandy and Lamport.
- Derive the source-state-sink recovery boundary: what restores, what rewinds, and which sinks keep exactly-once.

**Study**

1. [Asynchronous barrier snapshots for acyclic graphs](https://arxiv.org/abs/1506.08603) (Lightweight Asynchronous Snapshots for Distributed Dataflows (Carbone et al., 2015)) - The barrier broadcast and snapshot-on-receipt algorithm with its alignment discussion; the acyclic-graph scope. Barriers assume FIFO channels. Depth: Study the acyclic case only. Skip the cyclic extension.
2. [Marker rules and consistent cuts](https://lamport.azurewebsites.net/pubs/chandy.pdf) (Distributed Snapshots: Determining Global States of Distributed Systems (Chandy and Lamport, 1985)) - The marker-sending and marker-receiving rules with the channel-state procedure, and why the recorded state is a consistent cut. Assumes FIFO channels with a spontaneously initiating process.
3. [Keyed state, barriers and recovery](https://nightlies.apache.org/flink/flink-docs-release-2.3/docs/concepts/stateful-stream-processing/) (Apache Flink 2.3 - Event Time, State and Checkpointing) - Keyed State; Checkpointing with Barriers (inline barriers, alignment, async write); Recovery (restore state and rewind sources such as Kafka offsets); Exactly Once versus At Least Once (when alignment skips trade down to duplicates).
4. [Rebuilding state after a failure](https://dataintensive.net/) (DDIA 2e - Chapters 11 to 13 Batch and Stream Processing) - Chapter 12, Fault Tolerance (pp. 526 to 528): Flink state snapshots, Kafka Streams changelog topics with log compaction, and rebuilding short-window state by input replay.

**Focus**

- Barriers flow with the data and separate pre-snapshot from post-snapshot records, so each operator snapshots a consistent cut without stopping the stream.
- Recovery restores operator state from the snapshot and rewinds replayable sources to the checkpointed offsets, then replays the suffix.
- Checkpoint exactly-once covers state and participating sinks only. Skipping alignment replays in-flight records, which non-idempotent sinks see twice.
- Keyed state partitions by key with the operator, so rescaling reassigns key groups together with their state instead of reshuffling records.

**Reproduce:** Closed-book, run barrier snapshotting on a two-operator pipeline with one in-flight record: state which records each snapshot includes, and where the sources rewind on recovery.

**Traps**

- Snapshotting without channel state or FIFO order. An in-flight record belongs to neither snapshot unless barriers order it.
- Restoring state but resuming sources from latest. Post-checkpoint inputs must replay or their effects are lost.
- Claiming exactly-once for a nonparticipating sink. A sink outside the checkpoint boundary repeats on recovery.

**Practice**

- [AlgoMaster: Checkpoint Sidecar Log Delivery](https://algomaster.io/practice/system-design/checkpoint-sidecar-log-delivery) - The checkpoint advances only on acknowledged batches; a failed flush retries the exact batch; duplicate appends are rejected as reserved. A drill for the checkpoint-after-acknowledgement boundary, on a subscription the learner owns. Barrier alignment and state restore are mini-project work.

**Stop when:** You can run a barrier snapshot by hand on a small graph, state the full restore-plus-rewind procedure, and name which sinks keep exactly-once.

<details>
<summary>Self-test</summary>

1. An operator has one input channel. A record is sent on it right after a checkpoint barrier. Which side of the snapshot does the record fall on?
   - The post-snapshot side. The snapshot holds state from pre-barrier records only; after a failure the source rewinds to the barrier position and the record is replayed.
2. A checkpoint restores operator state. What else must restore, and what happens if it does not?
   - The source offsets must rewind to the checkpointed positions. Resuming from latest silently drops every post-checkpoint input.
3. What does skipping barrier alignment trade away, and when is it used?
   - Flink's at-least-once mode skips alignment: it avoids stalling on slow channels under backpressure, but records from fast channels already reach the state before the snapshot and replay on recovery, so it trades exactly-once for progress. Unaligned checkpoints are the other route: the barrier overtakes in-flight records, which are stored in the checkpoint, so exactly-once holds at the cost of larger checkpoints.
4. A Kafka Streams task keeps a local aggregate. How does a replacement task rebuild it without a snapshot copy?
   - It reads the dedicated changelog topic with log compaction, which holds the latest value per key, the same rebuild pattern as CDC from offset 0.

</details>

#### U11. Distributed dataflow graphs, shuffle and operator parallelism

**About 4 h** · **Target:** Explain

Topics: Distributed dataflow graph; Shuffle, partitioning and operator parallelism

Both batch jobs and stream processors are graphs of operators joined by shuffles. The shuffle decides the runtime, and the hot key decides the shuffle.

**You can now**

- Explain a distributed dataflow graph: operators, shuffle edges, key partitioning and operator parallelism.
- Explain why batch tasks retry transparently while stream graphs need checkpoints for the same guarantee.
- Predict the effect of key skew on a shuffle and choose between more partitions, key splitting and pre-aggregation.

**Study**

1. [MapReduce, dataflow engines and shuffling](https://dataintensive.net/) (DDIA 2e - Chapters 11 to 13 Batch and Stream Processing) - Chapter 11, Batch Processing Models (pp. 466 to 470): MapReduce, Dataflow Engines, Shuffling Data with hash partitioning of keys; Distributed Job Orchestration (pp. 461 to 466): task retries with atomic output publication.
2. [Lab 1 MapReduce: coordinator, workers and retries](https://pdos.csail.mit.edu/6.824/labs/lab-mr.html) (MIT 6.5840 - Lab 1 MapReduce) - The coordinator and worker task split with task retry and intermediate output files. Depth: Read the handout for the batch-dataflow contract only. Do not confuse its shared-filesystem setup on one machine with the durable-log contract; completing the lab is optional here.
3. [Stream versus batch review](https://github.com/handbook-academy/engineering-handbook/blob/d177ae2b48b4dfebf8ad0ddae51a345b3e17d99e/content/hld/part-4-data-systems/03-stream-vs-batch.md) (HLD Handbook - Queues, Streaming, Stream vs Batch and CDC) - Event versus processing versus ingestion time, engines comparison, lambda versus kappa. Depth: Review after the DDIA items. Treat its deployment figures as reported examples, not targets.

**Focus**

- A dataflow graph wires operators with shuffle edges: records are repartitioned by key so all records of one key reach the same downstream task.
- The shuffle is the all-to-all bulk transfer, so partition counts and key skew decide the runtime more than per-record speed does.
- Batch tasks retry transparently because inputs are immutable and outputs publish atomically. The visible result matches a failure-free run even though tasks recomputed.
- Dataflow graphs are usually acyclic, so each task's input is fixed by the operators upstream of it and a failed task can recompute from that input. Cycles and arbitrary request patterns between tasks break that reasoning.

**Reproduce:** Closed-book, trace a word count over two mappers and two reducers: hash-partition the keys, name what crosses the shuffle, and state which reducer a hot key overloads.

**Traps**

- Adding reducers to fix a hot key. Every record of one key goes to one reducer, so split the key or pre-aggregate instead.
- Confusing duplicate computation with duplicate publication. Retried tasks recompute, but atomic publication keeps one visible output.
- Reading the shared-filesystem lab as a durability proof. Lab workers share files on one machine; a real log needs the acknowledgement contract from this section.

**Practice**

- [AlgoMaster: Analyze MapReduce Reducer Skew](https://algomaster.io/practice/system-design/analyze-mapreduce-reducer-skew) - Per-reducer load totals and the hottest reducer index from keys and weights. A single-function skew drill on a subscription the learner owns. Full shuffle behavior is lab and mini-project work.

**Stop when:** You can trace keys across a shuffle by hand, name what a hot key does to it, and state why a retried batch task leaves one visible output.

<details>
<summary>Self-test</summary>

1. One key carries half of all records across 100 reducers. How many reducers does it load?
   - One. Hash partitioning sends every record of one key to the same reducer, so the hot key overloads it regardless of reducer count.
2. A map task fails after writing half its intermediate output. What survives, and what reruns?
   - Nothing of its output survives; partial output is discarded. The retried task recomputes from the immutable input and publishes atomically on success.
3. What crosses the network in a shuffle, and what does not?
   - Intermediate records, repartitioned by key, cross to their assigned reducers. Map tasks read their input splits, ideally from local disk, and the final output is written to the distributed filesystem; neither is the shuffle.
4. One word carries 40 percent of all records in a word count. Why do more reducers not help, and what two fixes do?
   - Every record of one key hashes to one reducer, so that reducer still gets 40 percent of the input. A combiner pre-aggregates on the map side, so the hot reducer gets one partial count per mapper; this works because addition is associative and commutative. Key splitting appends a small salt to the hot key, spreads it over several reducers, and merges the partial counts in a second step.

</details>

#### U12. Batch and stream unification, open table formats and incremental views

**About 4 h** · **Target:** Explain

Topics: Batch and stream unification vocabulary; Open table formats, snapshots and atomic metadata; Incremental materialized views and differential dataflow

Streams feed tables and tables seed streams: some brokers' tiered storage already writes Iceberg tables. The metadata swap is the commit point both sides share.

**You can now**

- Explain batch and stream unification: replay, exactly-once output and event-time tools as the three requirements.
- Explain open table snapshots: immutable files plus an atomic metadata-pointer swap as the commit.
- Explain optimistic lakehouse commits and incremental views applied after a durable checkpoint.

**Study**

1. [Unifying batch and stream processing](https://dataintensive.net/) (DDIA 2e - Chapters 11 to 13 Batch and Stream Processing) - Chapter 13, Batch and Stream Processing through Unifying batch and stream processing (pp. 544 to 546): lambda limits with the kappa approach; replay, exactly-once semantics and event-time windowing as the three requirements.
2. [Snapshots, manifests and the metadata swap](https://iceberg.apache.org/spec/) (Apache Iceberg - Table Specification) - Table specification: snapshots with manifest lists and manifests as the read path; table metadata with the atomic metadata-file swap as the commit (page read 2026-10-15).
3. [Transaction log replay and optimistic commits](https://github.com/delta-io/delta/blob/6a62fd86d58eea07a57720a80320b29f1130924e/PROTOCOL.md) (Delta Lake Protocol (pinned commit)) - Transaction log with checkpoints as the reader's replay path; optimistic concurrency with conflict detection on overlapping writes.

**Focus**

- Batch and stream share principles; the difference is bounded versus unbounded input. Unification needs replay through one engine, exactly-once output, and event-time windows.
- An open table is a metadata pointer plus immutable files: readers resolve the pointer to a snapshot, writers stage files then swap the pointer atomically.
- Optimistic commits let writers on disjoint partitions succeed and reject overlapping ones without locks. The check is on read-write overlap, not on wall-clock order.
- An incremental view applies ordered changes after a durable checkpoint and ignores replays at or below it, the same boundary as CDC offset dedup.

**Reproduce:** Closed-book, commit two lakehouse writers from one base version over disjoint and then overlapping partitions and state which commit wins; then replay an ordered change stream across a checkpoint and drop the duplicates.

**Traps**

- Reading table files without the metadata pointer. Listings show staged and superseded files; only the snapshot lists the live set.
- Assuming replay alone gives exactly-once. The atomic metadata swap plus idempotent application decides, not the replay.
- Treating the commit drill as the full protocol. It models partition-overlap conflicts only; real tables check finer read-write predicates.

**Practice**

- [AlgoMaster: Coordinate Optimistic Lakehouse Commits](https://algomaster.io/practice/system-design/coordinate-optimistic-lakehouse-commits) - `commit` succeeds unless a write since the base version overlaps its partitions; `currentVersion` counts committed versions. The judge models partition-overlap conflicts only, on a subscription the learner owns. Predicate-level conflicts are spec reading, not drill work.
- [AlgoMaster: Maintain an Incremental Materialized View](https://algomaster.io/practice/system-design/maintain-an-incremental-materialized-view) - `apply` accepts only sequences above the checkpoint, adds the increment and advances it; the rest are ignored without effect. Same scope as above: checkpoint-gated application here, real snapshot restores in the mini-project.

**Stop when:** You can commit overlapping writers by hand, replay a change stream across a checkpoint without double-applying, and name the metadata swap as the commit point.

<details>
<summary>Self-test</summary>

1. What distinguishes the lambda approach from the kappa approach?
   - Lambda keeps separate batch and speed paths with merged serving. Kappa replays history through the stream engine, which needs replay, exactly-once output and event-time windows.
2. Two writers commit from base version 0, one over partition 1 and one over partition 2. Then a third commits from base 0 over partition 1. Which commits succeed?
   - The first two succeed because their partitions are disjoint. The third is rejected because partition 1 changed since its base version.
3. A view holds checkpoint 2 and receives events with sequences 1, 2 and 3. Which apply?
   - Only sequence 3. Events at or below the checkpoint are duplicates or late deliveries and must be ignored.
4. Why are table data files immutable while the metadata pointer moves?
   - Immutable files give every reader a stable snapshot. Writers never block readers; the atomic pointer swap publishes a new snapshot at once.

</details>

#### U13. A mini partition log with consumer groups and replay

**About 6 h** · **Target:** Implement

Topics: Mini partition-log implementation; Consumer group and replay implementation

This is the section's build: a log you can kill mid-append and a consumer group you can kill mid-commit, both recovering to matching offsets and outputs.

**You can now**

- Implement a checksummed segmented partition log with offsets, an index, retention and recovery that truncates torn tails.
- Implement consumer-group ownership with epochs, committed offsets, kill-and-reassign replay and a retry and dead-letter boundary.

**Study**

1. [The build ancestor to mirror and diverge from](https://notes.stephenholiday.com/Kafka.pdf) (Kafka: a Distributed Messaging System for Log Processing (Kreps, Narkhede and Rao, 2011)) - The log design to mirror (segments, offsets, pull consumers) and the final section to see what to add (replication and durability beyond fire-and-forget).
2. [The segment contract to compare against](https://kafka.apache.org/43/implementation/log/) (Apache Kafka 4.3 - Design, Log, Rebalance and Transaction Protocols) - Writes (serial append with segment roll), Reads (offset lookup with range checks), Deletes (time and size retention over whole segments).
3. [Milestones A to C requirements](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-2/replicated-log-stream-processor.md) (Replicated Log and Stream Processor - Full Data Path) - Milestone A (local checksummed log with recovery), Milestone B (instrumented histories), Milestone C (producer dedup, partition routing, consumer group with replay).

**Focus**

- Appended, flushed, committed, applied and exposed are distinct states. Tests assert each transition separately.
- No wall-clock timestamp decides order; offsets do. Ownership moves with epochs so a stale consumer cannot commit past the new owner.
- Acknowledge only after the record is stable per the declared contract: flushed or replicated, never merely buffered.
- Compare each contract (retention, visibility, commit rule) with the Kafka 4.3 behavior and write down every deliberate difference.

**Reproduce:** From a blank file, rebuild the single-partition log with its index and recovery, then replay a recorded history through a kill-and-reassign test and show matching offsets and outputs.

**Traps**

- Acknowledging before the record is stable. An ack must follow flush or replication per the declared contract, never buffer acceptance.
- Letting two owners commit for one partition. Fence every commit with the ownership epoch.
- Testing only clean shutdown. Kill mid-append, mid-commit and mid-compaction; recovery must truncate the torn tail, never invent records.

**Practice**

- [AlgoMaster: Commit Contiguous Consumer Offsets](https://algomaster.io/practice/system-design/commit-contiguous-consumer-offsets) - The committed offset is the greatest fully acknowledged prefix; out-of-order and repeated acks are safe; partitions stay independent. Drill the contiguous-commit rule here, on a subscription the learner owns. The section mini-project covers the full log with consumer groups, epochs and replay.

**Stop when:** The log survives kills at every boundary with matching offsets, the group reassigns without loss or silent duplication, and every Kafka deviation is written down.

<details>
<summary>Self-test</summary>

1. A crash leaves a half-written record at the segment tail with a failing checksum. What does recovery do?
   - It truncates at the last valid record and exposes nothing partial. The torn tail is discarded, never repaired by guessing.
2. Acks for offsets 0, 2 and 3 arrive but 1 is missing. What is the committed offset?
   - Offset 0 is the end of the fully acknowledged prefix, so in Kafka's convention you store position 1, the next offset to read. The gap at 1 blocks 2 and 3 until it arrives.
3. A fenced-out consumer commits offset 8 after the group moved its partition to a new owner at epoch 7. Accepted?
   - No. The commit carries the old epoch and is rejected. The new owner resumes from the last committed offset.
4. What evidence shows the build preserves its contract rather than passing clean-path tests?
   - Deterministic kill schedules with retained raw histories: kill points at every append, commit and compaction boundary plus a minimized failing history for each bug found.

</details>

#### U14. An event-time processor with checkpoints

**About 5 h** · **Target:** Implement

Topics: Event-time processor and checkpoint implementation

This is where the section's ideas meet: event-time windows, watermarks with a late-data policy, and checkpoint barriers, in one bounded processor that survives a kill.

**You can now**

- Implement tumbling or session windows over event time with an explicit watermark, trigger and accumulation mode.
- Implement checkpoint of offsets plus state with restore that reproduces matching outputs on replay, including one late event.

**Study**

1. [Checkpoint configuration for the build](https://nightlies.apache.org/flink/flink-docs-release-2.3/docs/dev/datastream/fault-tolerance/checkpointing/) (Apache Flink 2.3 - Event Time, State and Checkpointing) - Enabling and Configuring Checkpointing: interval, exactly-once versus at-least-once mode, checkpoint storage.
2. [One trigger and one accumulation mode](https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/43864.pdf) (The Dataflow Model (Akidau et al., 2015)) - Section 2: windows, triggers and accumulation. Implement one trigger and one accumulation mode, not the catalog.
3. [Idle sources in the build](https://nightlies.apache.org/flink/flink-docs-release-2.3/docs/dev/datastream/event-time/generating_watermarks/) (Apache Flink 2.3 - Event Time, State and Checkpointing) - Dealing With Idle Sources with `.withIdleness`: declare idle inputs so one quiet partition cannot stall the processor.

**Focus**

- Checkpoint operator state and source offsets together. Restoring one without the other loses or duplicates.
- One trigger decides when a window fires; one accumulation mode decides what a correction does. Implement both explicitly instead of inheriting framework defaults.
- Bound the state: expire windows and dedup keys by watermark plus allowed lateness, and count what the horizon drops.
- Keep sinks inside the checkpoint boundary or behind an idempotent key. A sink outside it repeats on recovery.

**Reproduce:** From a blank file, build the bounded processor, kill it mid-window, restore from the last checkpoint and show identical window outputs for a fixed event history with one late event.

**Traps**

- Checkpointing state but not offsets. Restore then replays from the wrong position.
- Firing windows on processing time in tests. Deterministic tests advance event time and watermarks by hand.
- Growing window state without expiry. Every window needs a close rule tied to watermark plus lateness.

**Practice**

- [AlgoMaster: Assign Events to Session Windows](https://algomaster.io/practice/system-design/assign-events-to-session-windows) - Per-user sessions with the gap-reaches-threshold rule; interleaved users stay independent. Drill the session assignment the processor needs, on a subscription the learner owns. The section mini-project covers the processor with checkpoints, watermarks and kill tests.

**Stop when:** The processor reproduces identical window outputs across a mid-window kill for a fixed history with retries, one late event and one idle input.

<details>
<summary>Self-test</summary>

1. State is checkpointed but source offsets are not. What happens after restore?
   - Sources replay from the wrong position: already-applied inputs apply again or unapplied inputs are skipped, depending on where reading resumes.
2. What does the trigger decide and what does the accumulation mode decide?
   - The trigger decides when a window fires. The accumulation mode decides what a correction does to prior output: ignore, accumulate or retract.
3. A late event arrives past the horizon under the update policy with expired state. What is the correct output?
   - No correction. Expired state is gone, so the event is counted as dropped-late; updating would need state that no longer exists.
4. How is the kill test deterministic?
   - A fixed event history with scripted watermarks and a scripted kill point, asserting identical outputs before and after restore.

</details>

#### U15. Lag, throughput, recovery and duplicate measurement

**About 4 h** · **Target:** Measure

Topics: Lag, throughput, recovery and duplicate measurement

Contracts without measurements are wishes: lag, duplicates and recovery time are where ordering and effect promises meet reality. Measure them before claiming them.

**You can now**

- Measure end-to-end lag, throughput and backlog drain with the durability, concurrency and batching settings labeled.
- Measure recovery time, duplicate rate and rebalance pause under killed-consumer, replay and late-event faults.

**Study**

1. [Measuring backlogs and drain](https://aws.amazon.com/builders-library/avoiding-insurmountable-queue-backlogs/) (AWS Builders' Library - Avoiding Insurmountable Queue Backlogs) - Measuring availability and latency (message age as the lag signal); Backlogs (drain at spare capacity).
2. [Backpressure metrics](https://nightlies.apache.org/flink/flink-docs-release-2.3/docs/ops/monitoring/back_pressure/) (Apache Flink 2.3 - Event Time, State and Checkpointing) - Back Pressure with Task performance metrics: busy, backpressured and idle time per second as the stall signal.
3. [Lag monitoring on the log](https://dataintensive.net/) (DDIA 2e - Chapters 11 to 13 Batch and Stream Processing) - Chapter 12, When consumers cannot keep up with producers (p. 499): monitor how far a consumer is behind the head of the log and alert before it misses messages.

**Focus**

- Lag is the log end offset minus the committed offset, reported in records and in time. Report both with the workload and durability settings.
- A measured number is a labeled example: versions, concurrency, batching, `acks`, retention and run count travel with it. Unlabeled numbers do not transfer.
- Duplicates are counted end to end across retry, rebalance and replay faults, not per component. Per-component zeros can hide end-to-end doubles.
- Recovery time runs from fault injection to caught-up offsets with matching state, not just to process restart.

**Reproduce:** Run a fixed-rate producer against a bounded consumer, record lag, kill one consumer through a rebalance, and report the lag peak, duplicate count and catch-up time with the full setup label.

**Traps**

- Reporting a mean without the spread. Backlog and rebalance pauses live in the tail, so report the max and the run count.
- Measuring throughput the broker accepted. End-to-end goodput counts effects applied once at the sink.
- Comparing lag across different setups. Batching, `acks` and partition counts change the numbers, so compare only matched runs.

**Practice**

- [Gossip Glomers 5c: Kafka-style log efficiency](https://fly.io/dist-sys/5c) - Run the same two-node kafka command as 5b. The specification asks for significantly fewer messages per operation and fewer compare-and-swap failures on `lin-kv` while every correctness check still passes; the page calls it a looser definition of success. Use it as the efficiency drill. Full lag, throughput and recovery measurement with labeled setups is section mini-project work.

**Stop when:** You can report lag, goodput, duplicates and recovery time for a matched run with the full setup label, and say which comparisons that label permits.

<details>
<summary>Self-test</summary>

1. What two numbers make up a lag report, and what travels with them?
   - Records behind (end offset minus committed offset) and time behind. The workload, versions, concurrency, batching, `acks`, retention and run count travel with them.
2. A consumer is killed at t = 0 s, restarts at t = 2 s, and reaches caught-up offsets with matching state at t = 42 s. What is the recovery time?
   - 42 seconds, from the fault to caught-up offsets with matching state. The 2-second restart is one step inside it.
3. Retries show zero duplicates at the producer and the sink counts doubles after a rebalance. Where is the gap?
   - The consumer redelivered processed-but-uncommitted records to the new owner. Component zeros hid the end-to-end double; count at the sink.
4. What does the 5c efficiency run establish that a 5b run does not?
   - Fewer messages per operation under the same workload and flags. It measures coordination cost, not stronger correctness.

</details>

### Mini-project: Replayable partition logs and checkpointed event-time effects

**About 16 to 22 hours.** Extend `loglab` from partitioned storage and workflows into a bounded log and stream processor. Run local processes on your machine, establishing replay and effect correctness before measuring lag, recovery and overload.

1. Extend `storage/` and `stream/` with segmented partition logs, sparse indexes, retention and compaction. Check recovery against an acknowledged-prefix oracle at append and manifest-publication boundaries, retain corruption verdicts, and pass Gossip Glomers 5a through a separate adapter without claiming it tests disk durability.
2. Connect `replica/` or `consensus/` to an explicit high watermark and durable producer identity, epoch and sequence state. Compare failover, duplicate retries and timeout-after-commit histories with a sequential append model; retain visibility and acknowledgement verdicts with deliberate Kafka contract differences.
3. Implement durable group positions and epoch-fenced reassignment in `stream/`, using the `txn/` effect boundary. Check kill-and-reassign, contiguous commits and each effect-versus-progress crash window against an independent sink ledger; retain dedup TTL expiry and restart tests, explicitly excluding nonparticipating external effects.
4. Build CDC replay with per-partition source positions, per-key versions and retained tombstones. Check out-of-order and cross-partition arrivals, mixed reader-writer schemas and snapshot-plus-position restarts against a full-fold oracle; retain snapshot publication crash tests and state which cross-partition orders the contract excludes.
5. Build a keyed shuffle and event-time window processor with explicit triggers, accumulation, minimum-input watermarks, idleness and drop-versus-correction policies. Compare scripted late-event histories with a batch oracle under the same policy; retain hot-key routing, horizon expiry and bounded-state evidence.
6. Align checkpoint barriers over FIFO logical channels above `net/`, snapshotting offsets, keyed state and the participating sink boundary together. Inject mid-window kills and offset-state mismatches, compare restored replay with uninterrupted oracle outputs, and retain partial-checkpoint rejection plus immutable snapshot-pointer restore tests.
7. Wire bounded retries, durable dead letters, backpressure and retention-lag alerts; first check poison-record and storage-full schedules against a queue model. Then repeat matched open-loop runs and Gossip Glomers 5c, retaining versions, workloads, raw lag, goodput, duplicates, rebalance pauses, checkpoint costs, drain and recovery distributions.

**Deliverables**

- The integrated `stream/` data path with durable producer and group state, bounded windows, dead letters and checkpoint recovery.
- Reference models, deterministic fault schedules and raw histories covering visibility, delivery, CDC, shuffle and snapshot publication.
- A contract and measurement report with Kafka deviations, matched repeated runs, retention bounds and recovery evidence.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [Gossip Glomers 5a: Single-Node Kafka-Style Log](https://fly.io/dist-sys/5a). Keep the Maelstrom history separately; the public workload does not exercise your storage-crash or immediate-visibility contract.
- external-tests: [Gossip Glomers 5c: Efficient Kafka-Style Log](https://fly.io/dist-sys/5c). Retain correctness verdicts and coordination costs for matched runs; public efficiency results do not replace end-to-end recovery measurements.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Log visibility and identity | Your prefix and append-model tests check recovery, committed visibility, failover and retry suppression across producer restart; public histories pass within their narrower scope. | A planted premature acknowledgement or lost producer-state bug fails before repair; a minimized history explains the exact durability or retention boundary. |
| Ownership and effect scope | Your independent sink ledger verifies epoch-fenced reassignment, contiguous positions and crash-window replay. TTL expiry tests bound duplicate suppression, and external effects remain explicitly outside the atomic claim. | Delayed stale commits and timeout-after-effect retries expose a naive implementation; retained regressions distinguish harmless redelivery from duplicated effects. |
| Replay and checkpoint agreement | Full-fold and batch references match CDC and window outputs under declared ordering and lateness policies. Your restore tests catch offset-state mismatch, partial publication and stale tombstone resurrection. | The same logical input rebuilds matching state through both retained-log replay and snapshot-plus-suffix recovery, including skew, idle inputs and late corrections. |
| Bounded operation evidence | Your queue-model tests precede load. Repeated matched runs retain raw lag, goodput, duplicates, checkpoint cost, rebalance, drain and catch-up evidence with versions and settings. | A losing batching or checkpoint policy remains in the report, with causal traces explaining its resource and recovery trade-off rather than a universal performance claim. |

Feeds into: Durable stream state, replay oracles, checkpoints, fault histories and labeled measurements feed operational recovery and governance, formal schedule exploration, and the capstone replicated data path.

### Resource route

- **Primary - Book:** [DDIA 2e - Chapters 11 to 13 Batch and Stream Processing](https://dataintensive.net/) - Read batch processing, stream processing and the streaming-systems philosophy in order. For every guarantee, mark the source position, operator state, output effect and recovery boundary it actually covers.
- **Support - Paper:** [The Log: What Every Software Engineer Should Know About Real-time Data's Unifying Abstraction (Kreps, 2013)](https://www.linkedin.com/blog/engineering/distributed-systems/log-what-every-software-engineer-should-know-about-real-time-datas-unifying) - Read it first as the short concept spine for logs, replicas, data integration and stream processing, before DDIA 2e Chapters 11 to 13.
- **Support - Paper:** [Kafka: a Distributed Messaging System for Log Processing (Kreps, Narkhede and Rao, 2011)](https://notes.stephenholiday.com/Kafka.pdf) - Read it as the design ancestor of your mini log: segments, offsets, pull consumers and consumer groups. Replication is future work in this paper, so take durability from the current docs.
- **Required - Paper:** [The Dataflow Model (Akidau et al., 2015)](https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/43864.pdf) - Read the model section: event time versus processing time, windowing, triggers and accumulation. Implement one trigger and one accumulation mode, not the catalog.
- **Support - Paper:** [MillWheel: Fault-Tolerant Stream Processing at Internet Scale (Akidau et al., 2013)](https://www.vldb.org/pvldb/vol6/p1033-akidau.pdf) - Read low watermarks, persistent state, strong productions and exactly-once delivery by deduplication. The deduplication holds only within its retention bound.
- **Required - Paper:** [Lightweight Asynchronous Snapshots for Distributed Dataflows (Carbone et al., 2015)](https://arxiv.org/abs/1506.08603) - Read the asynchronous barrier snapshotting algorithm for acyclic graphs and its recovery; skip the cyclic extension. Barriers assume FIFO channels.
- **Support - Paper:** [Distributed Snapshots: Determining Global States of Distributed Systems (Chandy and Lamport, 1985)](https://lamport.azurewebsites.net/pubs/chandy.pdf) - Read the marker-sending and marker-receiving rules and why the recorded state is consistent. The algorithm needs FIFO channels.
- **Required - Reference:** [Apache Kafka 4.3 - Design, Log, Rebalance and Transaction Protocols](https://kafka.apache.org/43/design/design/) - Read the 4.3 design page (replication and in-sync replicas, acknowledgements and `min.insync.replicas`, delivery semantics, idempotence and transactions, the consumer, log compaction), the log implementation page, and the consumer rebalance protocol and transaction protocol pages (https://kafka.apache.org/43/operations/). Kafka 4.0 removed ZooKeeper. Run experiments in the `apache/kafka:4.3.1` image and compare each contract with your mini log.
- **Required - Practice:** [Gossip Glomers - Kafka-Style Log](https://fly.io/dist-sys/5a) - Each challenge runs locally under Maelstrom (v0.2.4; the pages were tested on 0.2.3) with its checker and, where the page says so, the partition nemesis; keep the run directory as the history. Do 5a to 5c: `send`, `poll`, `commit_offsets` and `list_committed_offsets` on one node, then two nodes over `lin-kv`, then with fewer messages. The checker catches lost writes and nonmonotonic or skipped offsets; it does not check recency or exactly-once effects.
- **Support - Reference:** [AWS Builders' Library - Avoiding Insurmountable Queue Backlogs](https://aws.amazon.com/builders-library/avoiding-insurmountable-queue-backlogs/) - Read it for how backlogs grow and why they take long to drain, and for backpressure, prioritization, sidelining and constant work. Compare its recovery strategies with the bounded backlog and lag measurements of your consumer.
- **Required - Reference and lab:** [Apache Flink 2.3 - Event Time, State and Checkpointing](https://nightlies.apache.org/flink/flink-docs-release-2.3/docs/concepts/stateful-stream-processing/) - Read the 2.3 concepts pages on time (event time, watermarks, lateness, windowing) and stateful stream processing (keyed state, checkpoint barriers, recovery, unaligned checkpoints, exactly-once versus at-least-once), then the watermark-generation guide on idle sources. Use them to build one bounded local processor; exactly-once covers state and participating sinks only.
- **Support - Reference:** [Confluent Schema Registry - Schema Evolution and Compatibility](https://docs.confluent.io/platform/current/schema-registry/fundamentals/schema-evolution.html) - Use only the compatibility-type definitions (backward, forward, full and their transitive forms) as the vocabulary for your schema checks, with the Avro schema resolution rules as the mechanism.
- **Required - Reference:** [HLD Handbook - Queues, Streaming, Stream vs Batch and CDC](https://github.com/handbook-academy/engineering-handbook/tree/main/content/hld) - Read only Part 2 message queues and pub-sub plus Part 4 stream versus batch and change data capture. Use Part 5 event-driven architecture after the underlying log and replay contract is clear.
- **Support - Lab:** [MIT 6.5840 - Lab 1 MapReduce](https://pdos.csail.mit.edu/6.824/labs/lab-mr.html) - Complete or review the coordinator and worker lab to connect deterministic batch dataflow, task retries and output publication. Do not confuse its shared-filesystem assumptions with the durable log contract.
- **Support - Project:** [Replicated Log and Stream Processor - Full Data Path](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-2/replicated-log-stream-processor.md) - Complete partitioned log, producer identity, consumer ownership, offsets, backpressure, event-time state, checkpoint, replay and sink boundary. Run the required producer, consumer, storage and late-data fault campaign.
- **Reference - Reference:** [Apache Iceberg - Table Specification](https://iceberg.apache.org/spec/) - Read the snapshot, manifest list and manifest sections for the read path, and the table metadata section for the atomic metadata-file swap that commits a snapshot.
- **Reference - Reference:** [Delta Lake Protocol (pinned commit)](https://github.com/delta-io/delta/blob/6a62fd86d58eea07a57720a80320b29f1130924e/PROTOCOL.md) - Read the transaction log replay and checkpoint sections for how readers reconstruct table state, and the concurrency section for the optimistic commit rule.
- **Reference - Reference:** [Apache Avro 1.12.0 Specification - Schema Resolution](https://avro.apache.org/docs/1.12.0/specification/) - Read Schema Resolution only: records match by field name, writer-only fields are ignored, reader-only fields are filled from defaults, plus the promotion rules.

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

### Study units

#### U1. Threat models for clients, services and operators, workload identity and mutual TLS

**About 4 h** · **Target:** Explain + Implement

Topics: Client, service, operator and dependency threat model; Workload identity and mutual authentication

Authorization, tenancy and audit all assume the caller is who it claims to be. A forged or stale identity makes every later check in this section decide on false input.

**You can now**

- Build a threat model across client, network, service, storage, operator, tenant, dependency and artifact boundaries, naming the trust boundary each threat crosses.
- Assign SPIFFE IDs to workloads and explain what each side verifies during mutual TLS with X.509-SVIDs.
- Check JWT time claims with inclusive not-before and exclusive expiration rules, and state what claim checks cannot cover.

**Study**

1. [Threat model method: diagrams, trust boundaries, STRIDE](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html) (OWASP Threat Modeling Cheat Sheet) - System Modeling (data-flow diagrams, trust boundaries, data stores and processes); Threat Identification (the STRIDE table applied to components, data flows and trust boundaries); Response and Mitigations.
2. [mTLS and service identity: Zero Trust, handshake, SPIFFE](https://github.com/handbook-academy/engineering-handbook/blob/d177ae2b48b4dfebf8ad0ddae51a345b3e17d99e/content/hld/part-7-security-at-scale/03-mtls-service-auth.md) (HLD Handbook - Reliability, Operations and Security at Scale) - The Zero Trust model; mTLS handshake mechanics; Certificate lifecycle: issuance, rotation, revocation; SPIFFE and SPIRE. Depth: Skim Service mesh as the practical answer and When mTLS is overkill for tool choice. This unit builds on SPIFFE concepts, not on deploying a mesh.
3. [SPIFFE Workload API: SVIDs, bundles and streaming updates](https://spiffe.io/docs/latest/spiffe-specs/spiffe_workload_api/) (SPIFFE Workload Identity and Workload API) - X.509-SVID Profile: FetchX509SVID and FetchX509Bundles; Stream Responses (every message is a complete update that replaces prior state); Federated Bundles for cross-domain trust (page read 2026-10-15).

**Focus**

- Draw the data-flow diagram first, then apply STRIDE per boundary. A threat without a named crossing is a worry, not a model.
- A SPIFFE ID names a trust domain plus a workload path, for example `spiffe://prod.example/log-writer`. The peer verifies the SVID signature against its trust bundle and then authorizes that ID.
- Workload API responses replace prior state. An empty optional `federated_bundles` map removes previously supplied federated bundles; the local trust-domain bundle must always be present, and loss of all entitlement arrives as `PermissionDenied`. Clients hold the connection open and redial when it drops.
- Caller identification at the endpoint is out-of-band attestation, not a client password. The API itself carries no direct client authentication.

**Reproduce:** Without notes, write `spiffe://` IDs for three loglab processes in one trust domain, then state what each side checks during mutual TLS and what a client must do when its bundle stream delivers an empty optional federated-bundle map.

**Traps**

- Server-authenticated TLS alone does not authenticate the client workload. Use a client certificate or a separate verified application credential; cipher strength does not establish caller identity.
- Merging streamed bundle updates instead of replacing them. A removed bundle that stays trusted is a revoked identity that still authenticates.
- Treating claim checks as token verification. The JWT exercise states it plainly: structure and signature are assumed already verified, and revocation is out of scope.

**Practice**

- [Build Distributed Systems, The Securitor: first three tasks](https://builddistributedsystem.com/tracks/securitor) - First three free tasks of the track, graded in the browser after login. Treat a pass as a drill. The section mini-project covers this: a local mTLS or faithful verification mock that checks certificate validity, the matching trust-domain bundle and an allowed SPIFFE ID, then rejects an unknown domain, an expired SVID and a valid but unauthorized ID during bundle rotation.
- [AlgoMaster: Validate JWT Time Claims](https://algomaster.io/practice/system-design/validate-jwt-time-claims) - `isValid(iat, nbf, exp, now)`; the page tests the inclusive not-before and exclusive expiration boundaries with no clock-skew allowance. The page assumes signature verification already happened. State where signature and revocation checks live in your design.

**Stop when:** Your diagram names every trust boundary with its STRIDE rows, your verification check rejects an unknown trust domain, an expired SVID and a valid but unauthorized ID, and the JWT checks pass including both time boundaries.

<details>
<summary>Self-test</summary>

1. A forged client identity crosses the service boundary. Which STRIDE category is it, and what does it violate?
   - Spoofing, which violates authentication. The fix sits at the trust boundary the forged identity crosses.
2. When would a workload call `FetchX509Bundles` instead of `FetchX509SVID`?
   - When it only needs bundles to validate peers, without obtaining its own SVID and private key. Both RPCs can supply local and federated bundles.
3. A bundle stream delivers a message without the bundle for `spiffe://peer.example`. What must the client do?
   - Unload that bundle. Responses are complete updates, so absence is a redaction, and peers presenting those SVIDs must no longer verify.
4. `isValid` accepts `iat=10, nbf=10, exp=20` at `now=10` but rejects it at `now=20`. Why?
   - Not-before is inclusive (`nbf <= now`) while expiration is exclusive (`now < exp`). At `now=20` the token has expired.

</details>

#### U2. Authorization on every data path, tenant isolation and multi-tenant fault and restore tests

**About 5 h** · **Target:** Explain + Implement

Topics: Authorization at every data path; Tenant isolation and cache boundaries; Multi-tenant fault and restore tests

A correct happy-path check leaks the moment a retry replays a request, a cache serves a shared entry, or a restore replays another tenant's rows. Isolation is a property of every path, not of one middleware.

**You can now**

- Enforce scoped authorization on every data path, including retry, cache, restore and migration paths.
- Isolate tenants with key and predicate discipline, and state which cache entries may be shared across tenants.
- Run multi-tenant fault and restore tests that prove one tenant cannot read or mutate another tenant's state.

**Study**

1. [Least privilege: small APIs, auditing, breakglass](https://google.github.io/building-secure-and-reliable-systems/raw/ch05.html) (Google SRE Books - SLOs, Monitoring, Overload, Cascades, Incidents and Recovery) - Concepts and Terminology (Least Privilege, Zero Trust Networking); Best Practices (Small Functional APIs, Breakglass, Auditing including Collecting good audit logs); Testing and Least Privilege.
2. [Multi-tenancy: isolation levels and noisy neighbors](https://github.com/handbook-academy/engineering-handbook/blob/d177ae2b48b4dfebf8ad0ddae51a345b3e17d99e/content/hld/part-5-architecture-patterns/09-multi-tenancy.md) (HLD Handbook - Reliability, Operations and Security at Scale) - The three isolation levels; Row-level security as defense-in-depth; Noisy-neighbor defenses; Data residency and crypto-shredding. Depth: Read for the isolation spectrum and row-level predicates. Skip the bridge-model case study and per-tenant metering as product detail.
3. [Access models: from ACL to ReBAC](https://github.com/handbook-academy/engineering-handbook/blob/d177ae2b48b4dfebf8ad0ddae51a345b3e17d99e/content/hld/part-7-security-at-scale/00-authn-authz.md) (HLD Handbook - Reliability, Operations and Security at Scale) - AuthZ models: from ACL to ReBAC; Zanzibar and its descendants. Depth: Read for the model vocabulary only. You implement a local RBAC check in Practice, not Zanzibar.

**Focus**

- Derive the tenant predicate from the authenticated identity on each path. A check that runs on ingest but not on restore, retry or cache fill is a second door.
- Small functional APIs make authorization auditable: each endpoint takes the identity it needs and nothing more, with breakglass as the named exception.
- Cache keys carry the tenant, or the entry is provably tenant-free. A shared entry keyed without the tenant is a cross-tenant read.
- Use storage predicates as defense in depth behind endpoint checks. Test both enforcement points, including whether privileged restore roles bypass row-level security; a missing check in either layer must not expose another tenant's rows.

**Reproduce:** Without notes, add a tenant predicate to three loglab reads (fresh read, cache fill, restore replay) and state which shared cache entries remain legal and why.

**Traps**

- Inheritance flows downward only. The RBAC exercise denies a parent a permission granted to its child; a check that walks the wrong direction grants too much.
- Breakglass without audit is a backdoor. The least-privilege chapter pairs every emergency path with logging and review.
- Testing with one tenant. A single-tenant test passes vacuously; isolation needs at least two tenants with overlapping keys.

**Practice**

- [AlgoMaster: Check Effective RBAC Permissions](https://algomaster.io/practice/system-design/check-effective-rbac-permissions) - `hasPermission` with direct bitmasks and parent chains; the page tests downward-only inheritance over acyclic chains. Then add the same check to your loglab reads. The section mini-project covers this: multi-tenant fault and restore tests with overlapping keys.

**Stop when:** Your three loglab reads enforce the same predicate, the RBAC checks pass including the upward-denial case, and a two-tenant test with identical keys shows no cross reads.

<details>
<summary>Self-test</summary>

1. Roles form the chain 2 inherits 1 inherits 0, with direct masks 4, 2 and 1. What is role 2's effective mask, and does it grant permission bit 1?
   - The effective mask is $`4 \mid 2 \mid 1 = 7`$, which contains bit 1, so yes. Inheritance accumulates down the chain.
2. Role 0 requests a permission granted only to role 2. Granted?
   - No. Permissions flow from parent to child, never upward to parents or across to siblings.
3. A restore replays rows with the tenant column intact but skips the endpoint check. Is isolation preserved?
   - Only if the storage layer re-applies the tenant predicate, for example row-level security, and the restore role does not bypass it. Otherwise the restore path skips the only check.
4. Two tenants share a cache entry keyed by query hash without a tenant field. What breaks?
   - Tenant A can read tenant B's result. Either scope the key by tenant or prove the entry holds no tenant data.

</details>

#### U3. Encryption in transit and at rest, secret and key rotation and audit integrity

**About 4 h** · **Target:** Explain + Implement

Topics: Encryption in transit and at rest; Secret and key rotation; Audit event integrity and bounded cardinality

Keys leak and certificates expire. Rotation and audit bounds decide whether that event is a routine overlap or an outage with unbounded telemetry.

**You can now**

- Wrap data keys with key-encrypting keys and compute the blast radius of any compromised key.
- Rotate credentials through a dual-accept overlap without dropping long-lived connections.
- Bound metric cardinality and keep audit events tamper-evident against an independently retained checkpoint.

**Study**

1. [Secrets: envelope encryption, dynamic secrets, rotation](https://github.com/handbook-academy/engineering-handbook/blob/d177ae2b48b4dfebf8ad0ddae51a345b3e17d99e/content/hld/part-7-security-at-scale/04-secrets-management.md) (HLD Handbook - Reliability, Operations and Security at Scale) - Where secrets should not live; Envelope encryption and KMS; Dynamic secrets; Leak detection and response. Depth: Skip Secrets in Kubernetes unless your dossier runs there.
2. [Certificate lifecycle: rotation and revocation](https://github.com/handbook-academy/engineering-handbook/blob/d177ae2b48b4dfebf8ad0ddae51a345b3e17d99e/content/hld/part-7-security-at-scale/03-mtls-service-auth.md) (HLD Handbook - Reliability, Operations and Security at Scale) - Certificate lifecycle: issuance, rotation, revocation. Depth: Read only this section here. The handshake and SPIFFE sections belong to the first unit.
3. [Revocation and key rotation at scale](https://google.github.io/building-secure-and-reliable-systems/raw/ch09.html) (Google SRE Books - SLOs, Monitoring, Overload, Cascades, Incidents and Recovery) - Use an Explicit Revocation Mechanism (Failing open; Revoking credentials at scale); Rotating signing keys. Depth: Read for the revoke-versus-expire trade-off. Skip firmware rollback constraints.
4. [Audit logs that answer questions](https://google.github.io/building-secure-and-reliable-systems/raw/ch05.html) (Google SRE Books - SLOs, Monitoring, Overload, Cascades, Incidents and Recovery) - Best Practices: Auditing, with Collecting good audit logs and Choosing an auditor.

**Focus**

- Compromising a wrapping key exposes its descendants when the attacker also holds the wrapped keys and ciphertext. A plaintext data key can also leak on its own, for example from application memory, without exposing its ancestors or siblings.
- Rotation is overlap, not replacement: introduce the new version, accept both, move new connections first, retire the old only after migration.
- Revocation is explicit or it is absent. Expiration bounds lifetime; only a deny list or a rotated key stops a live credential now.
- Cardinality multiplies. With one series per label combination and every combination present, independent labels with cardinalities 5, 3 and 100 create 1,500 series; in a real audit, count the observed combinations and any per-type series expansion.

**Reproduce:** Without notes, write the rotation states (idle, overlap, migrated, retired) with which versions are accepted and emitted in each, and compute the series count for a 5 by 3 by 100 label set.

**Traps**

- Retiring the old credential at introduction time. Long-lived clients holding it fail until they reconnect; the overlap exists for them.
- Reading fail-open as resilient. The revocation section has nodes enforce their cached revocation list, their last known state, instead of allowing everything when the revocation service is unreachable.
- Counting label values instead of their product. Three small labels easily exceed a series budget together.

**Practice**

- [AlgoMaster: Analyze Encryption-Key Blast Radius](https://algomaster.io/practice/system-design/analyze-encryption-key-blast-radius) - `affectedRecords` returns exposed record indexes in ascending input order; the page tests self-plus-descendant scope. The exercise analyzes key scope only. State where your design holds the wrapped keys and ciphertext it assumes.
- [AlgoMaster: Rotate Credentials Without Downtime](https://algomaster.io/practice/system-design/rotate-credentials-without-downtime) - `beginRotation`, `versionForNewConnections`, `accepts`, `completeRotation`; the page tests that failed operations change no state
- [AlgoMaster: Control Metric Label Cardinality](https://algomaster.io/practice/system-design/control-metric-label-cardinality) - `seriesCount` is the raw product; `labelsToDrop` removes the fewest labels, larger factors first, names returned alphabetically. Counting series does not bound audit volume or prove integrity. The section mini-project covers this: redact audit events, persist them in a tamper-evident chain with an independently retained checkpoint, and test record edits, deletion, truncation and restore against that checkpoint.

**Stop when:** You derive a subtree exposure by hand, your rotation passes the failed-operation cases, a 5 by 3 by 100 label set fits its budget by dropping the right label, and your audit verifier rejects edited and truncated histories against the retained checkpoint.

<details>
<summary>Self-test</summary>

1. Key 1 wraps keys 3 and 4, and records 0 and 1 use those keys. Key 1 is compromised. Which records are exposed?
   - Records 0 and 1. The compromised key exposes itself and its descendants; ancestors, siblings and separate trees stay safe.
2. Root key 0 of a single key tree is compromised. How many of the tree's five records are exposed?
   - All five. The root unwraps every descendant key.
3. `beginRotation` fails while a rotation is already active. What state changed?
   - None. Failed operations change nothing: the pending version stays pending and acceptance is unchanged.
4. Labels with cardinalities 5, 3 and 100 must fit 15 series. Which label goes first?
   - The 100-cardinality label. Removing it leaves $`5 \times 3 = 15`$ series. Drop larger factors first.

</details>

#### U4. SLIs, SLOs, error budgets, telemetry and incident reconstruction

**About 5 h** · **Target:** Explain + Measure

Topics: SLI, SLO and error-budget definitions; Latency, error, saturation and correctness telemetry; Incident reconstruction and runbook execution

Budgets turn reliability arguments into arithmetic, and propagated context turns scattered logs into one causal trace. Both are prerequisites for every measurement later in this section.

**You can now**

- Define SLIs, SLOs and error budgets with explicit windows, and convert budget burn into alert thresholds.
- Emit traces, metrics and logs with W3C context propagation and bounded attributes.
- Reconstruct an incident from stored telemetry without assuming synchronized clocks.

**Study**

1. [Service level objectives: terminology and practice](https://sre.google/sre-book/service-level-objectives/) (Google SRE Books - SLOs, Monitoring, Overload, Cascades, Incidents and Recovery) - Service Level Terminology; Indicators; Objectives; Agreements; Indicators in Practice (Aggregation, A Note on Statistical Fallacies); Objectives in Practice (Defining Objectives, Choosing Targets).
2. [Implementing SLOs: windows and decisions](https://sre.google/workbook/implementing-slos/) (Google SRE Books - SLOs, Monitoring, Overload, Cascades, Incidents and Recovery) - Getting Started; Choosing an Appropriate Time Window; Decision Making Using SLOs and Error Budgets.
3. [Burn-rate alerting](https://sre.google/workbook/alerting-on-slos/) (Google SRE Books - SLOs, Monitoring, Overload, Cascades, Incidents and Recovery) - Alert on Burn Rate; Multiple Burn Rate Alerts; Multiwindow, Multi-Burn-Rate Alerts. Depth: Read for the two-window structure. The Systems unit on SLIs, SLOs, error budgets and recovery objectives already derived the single-window budget; do not redo it.
4. [Monitoring: the four golden signals](https://sre.google/sre-book/monitoring-distributed-systems/) (Google SRE Books - SLOs, Monitoring, Overload, Cascades, Incidents and Recovery) - The Four Golden Signals; Symptoms Versus Causes; Black-Box Versus White-Box. Depth: Read for signal choice and cause-versus-symptom discipline. Leave Google-internal tooling as examples, not setup.
5. [Context propagation: traceparent, inject and extract](https://opentelemetry.io/docs/concepts/context-propagation/) (OpenTelemetry Signals and Semantic Conventions) - Context; Propagation (default W3C TraceContext propagator); the traceparent field order version, trace id, parent id, flags; Inject and extract; Security best practices (Baggage) (page read 2026-10-15).
6. [Gray failure: when the detector disagrees with clients](https://www.microsoft.com/en-us/research/wp-content/uploads/2017/06/paper-1.pdf) (Gray Failure: The Achilles' Heel of Cloud-Scale Systems (Huang et al., 2017)) - Gray versus fail-stop framing; differential observability (Table 1); the stuck handler with a live heartbeat. Depth: Read as failure-model vocabulary for why reconstruction needs several signals. The cases are Microsoft-internal, not reproducible.

**Focus**

- An SLO without a window is not measurable. The Workbook chooses the window before the target, because the same ratio burns differently over 1 hour and 30 days.
- Multiwindow burn-rate alerts require the threshold in both a long and a short window. The long window establishes significant budget consumption; the short window confirms the burn is still active and clears the alert soon after recovery.
- Propagation carries trace id and parent id in `traceparent`. Correlation needs no synchronized clocks, only the carried parent link. A gray fault bounds what one trace proves: the detector may see healthy while clients see sick, so reconstruction needs several signals.
- Baggage is not a secret channel. OpenTelemetry warns against credentials, keys and PII in baggage because it crosses service boundaries and lands in logs.

**Reproduce:** Without notes, compute the 30-day error budget in minutes for a 99.9% SLO on a time-based availability SLI, and the nearest-rank p50, p95 and p99 of `[12, 45, 33, 21, 90, 8, 67, 54, 29, 71]` ms.

**Traps**

- Averaging percentiles across services. A p99 of p99s is not the system p99; aggregate the underlying samples or count budget burn per service.
- Interpolating a nearest-rank percentile. The method returns an observed sample at rank $`\lceil pn/100 \rceil`$, never a value between samples.
- Alerting on every firing evaluation. The alert manager groups by fingerprint and repeats only after the interval; resolution clears the incident.

**Practice**

- [AlgoMaster: Calculate Nearest-Rank Latency Percentiles](https://algomaster.io/practice/system-design/calculate-nearest-rank-latency-percentiles) - `latencyPercentiles` returns `[p50, p95, p99]` by 1-based nearest rank without interpolation and without mutating the input
- [AlgoMaster: Deduplicate Alert Notifications](https://algomaster.io/practice/system-design/deduplicate-alert-notifications) - `notificationStates` groups by fingerprint, repeats only after the interval, and clears on resolution; the page tests that a post-resolution firing notifies fresh. The section mini-project covers this: inject an incident on the instrumented path, reconstruct its causal request and fault history from stored telemetry with deliberately skewed display timestamps, and mark gaps where instrumentation cannot establish order.

**Stop when:** Your budget arithmetic and percentile ranks match the worked numbers, you can set a two-window burn alert plus a `traceparent` instrumented path on loglab, and your incident reconstruction marks every gap in the causal order.

<details>
<summary>Self-test</summary>

1. For a time-based availability SLI, how many minutes of full unavailability exhaust a 99.9% SLO over 30 days?
   - $`0.001 \times 30 \times 24 \times 60 = 43.2`$ minutes. A request-based SLI budgets failed requests instead; converting to minutes needs a traffic assumption.
2. Ten samples sort to `[8, 12, 21, 29, 33, 45, 54, 67, 71, 90]`. What are the nearest-rank p50 and p95?
   - p50 uses rank $`\lceil 50 \times 10 / 100 \rceil = 5`$, value 33. p95 uses rank $`\lceil 9.5 \rceil = 10`$, value 90.
3. Why do burn-rate alerts use two windows instead of one fast window?
   - An alert fires only when both windows exceed the burn threshold. The long window shows the budget is really being consumed; the short window shows the burn is still happening, so the alert clears soon after the errors stop.
4. A downstream log carries the trace id from an incoming `traceparent`. Why does that correlation need no clock sync?
   - Causality comes from the carried parent link, not from comparing timestamps. Display order may still mislead across machines.
5. An alert fires, resolves, then fires again 1 unit later with repeat interval 10. How many notifications?
   - Two. Resolution clears the fingerprint, so the next firing is a new incident, not a repeat.

</details>

#### U5. Capacity headroom, failure reserve, overload detection and load shedding

**About 4 h** · **Target:** Derive + Implement

Topics: Capacity headroom and failure reserve; Overload detection and load shedding

Capacity is the difference between a failure you survive and one you join. Headroom arithmetic plus early shedding keeps one slow dependency from queueing the whole system.

**You can now**

- Derive headroom and failure reserve from workload, replication and recovery costs.
- Detect overload from queue, latency and saturation signals and shed load early with explicit rejection.
- Bound every queue so overload produces backpressure or drops, never unbounded growth.

**Study**

1. [Handling overload: limits and client-side throttling](https://sre.google/sre-book/handling-overload/) (Google SRE Books - SLOs, Monitoring, Overload, Cascades, Incidents and Recovery) - Per-Customer Limits; Client-Side Throttling (Client request rejection probability); Criticality; Utilization Signals; Deciding to Retry. Depth: Read for the throttle-at-the-client argument. Leave datacenter-scale load balancing as background.
2. [Degradation: tiering, shedding, kill switches](https://github.com/handbook-academy/engineering-handbook/blob/d177ae2b48b4dfebf8ad0ddae51a345b3e17d99e/content/hld/part-6-reliability-and-operations/03-graceful-degradation.md) (HLD Handbook - Reliability, Operations and Security at Scale) - Critical-path tiering; Load shedding; Feature flags as kill switches; Cached and static fallbacks.
3. [Capacity: planning math and scaling lag](https://github.com/handbook-academy/engineering-handbook/blob/d177ae2b48b4dfebf8ad0ddae51a345b3e17d99e/content/hld/part-6-reliability-and-operations/04-auto-scaling-capacity.md) (HLD Handbook - Reliability, Operations and Security at Scale) - Picking the right signal; Scaling lag: the hidden enemy; Capacity planning math; The dependencies that do not scale. Depth: Read for the math and the lag warning. Skip the Kubernetes autoscaling family and the Netflix case study unless your dossier runs there.

**Focus**

- Headroom is derived, not chosen. Three equal nodes that must survive one failure sustain at most two thirds of total capacity, because each survivor absorbs half the load.
- Shed at the client before queues build at the server. Server-side queues hide overload until every layer is full at once.
- The Systems unit on Little's Law, capacity and queueing approximations taught $`L = \lambda W`$ for stable long-run averages; it does not bound individual waits. Bound queue length to cap backlog, and bound service delay or enforce deadlines to bound waiting time.
- Autoscaling lags the spike. The scaling-lag section is why a provisioned reserve, not a scaling policy, covers the first minutes.

**Reproduce:** Without notes, derive the three-node tolerate-one bound as a fraction of total capacity, and compute the bottleneck throughput of a stated three-component fixture by hand.

**Traps**

- Reading raw capacity as throughput. A database with 5000 work units per second serves only 2500 requests per second at 2 units each; divide capacity by per-request work and take the smallest ratio.
- Draining before admitting. The buffer simulator admits arrivals first and drains second each interval; reversing the order understates the peak backlog.
- Carrying drain capacity across intervals. Unused drain does not roll over, so idle intervals do not bank future capacity.

**Practice**

- [AlgoMaster: Analyze Capacity Bottlenecks](https://algomaster.io/practice/system-design/analyze-capacity-bottlenecks) - `maxThroughput` is the minimum capacity-per-work ratio within 1e-5; `bottleneck` breaks exact ties alphabetically. The section mini-project covers this: derive capacity separately for foreground requests, replication fan-out, backup, restore and repair, reserve each shared resource for a stated concurrent recovery workload, then compare the predicted bottleneck with an injected node-loss run.
- [AlgoMaster: Simulate Log Pipeline Backpressure](https://algomaster.io/practice/system-design/simulate-log-pipeline-backpressure) - Per interval admit-then-drain order with no drain carryover; the pages test backlog consumption of buffer space

**Stop when:** Your three-node bound, bottleneck arithmetic and one buffer trace all match hand computation, your resource ledger reserves capacity for the stated recovery workload, and your loglab queues reject explicitly past their bounds.

<details>
<summary>Self-test</summary>

1. Three equal nodes of capacity $`C`$ each must keep serving total load $`L`$ after any one node fails. What is the bound on $`L`$?
   - Each survivor takes $`L/2`$, so $`L/2 \le C`$ and $`L \le 2C`$: two thirds of the $`3C`$ total.
2. API, database and cache capacities are 12000, 5000 and 20000 work units per second, with 1, 2 and 0.5 units per request. What is the throughput bound and which component is the bottleneck?
   - The ratios are 12000, 2500 and 40000 requests per second, so the bound is 2500, set by the database at $`5000 / 2`$. Every request uses every component, so the minimum ratio wins.
3. Why does client-side throttling beat server-side queueing during overload?
   - Rejected work at the client never consumes server queues, threads or downstream calls. Server queues only delay the same reckoning while sharing fate across callers.
4. A buffer of capacity 5 holds 2 events. Interval arrivals are 8 with drain 3. How many are dropped, and what remains?
   - 3 fit, so 5 are dropped. Draining 3 of the 5 buffered leaves 2. Arrivals are admitted before draining, and drops are counted per interval.

</details>

#### U6. Retry budgets, circuit breaking, cascading and correlated failure and chaos scenarios

**About 4 h** · **Target:** Explain + Implement

Topics: Retry budgets, circuit breaking and cascading failure; Correlated-failure and chaos scenarios

Retries are load, and load is what the overloaded dependency cannot take. Unbudgeted retries plus a shared fate across callers is how one slow service stops them all.

**You can now**

- Derive worst-case retry amplification across dependency layers and cap it with a budget.
- Implement circuit breaking with half-open probing and bulkhead isolation.
- Distinguish trigger from sustaining cause in a metastable outage and name the chaos scenarios that reproduce each.

**Study**

1. [Cascading failures: overload, retries, deadlines](https://sre.google/sre-book/addressing-cascading-failures/) (Google SRE Books - SLOs, Monitoring, Overload, Cascades, Incidents and Recovery) - Server Overload; Queue Management; Load Shedding and Graceful Degradation; Retries; Latency and Deadlines (Picking a deadline, Deadline propagation, Bimodal latency); Testing for Cascading Failures.
2. [Resilience: timeouts, retries, breakers, bulkheads, jitter](https://github.com/handbook-academy/engineering-handbook/blob/d177ae2b48b4dfebf8ad0ddae51a345b3e17d99e/content/hld/part-6-reliability-and-operations/02-resilience-patterns.md) (HLD Handbook - Reliability, Operations and Security at Scale) - The cascading failure story; Timeouts; Retries; Circuit breakers; Bulkheads; No jitter versus Full Jitter versus Equal Jitter versus Decorrelated Jitter.
3. [Metastable failures: trigger and sustaining effect](https://sigops.org/s/conferences/hotos/2021/papers/hotos21-s11-bronson.pdf) (Metastable Failures in Distributed Systems (Bronson et al., 2021)) - The metastable pattern (vulnerable state, trigger, sustaining effect); Section 2.1 and Figure 2: a 10-second network outage triggers retry amplification while normal offered load is 280 QPS, and retries sustain 560 QPS after connectivity returns; retry storms and cache-miss avalanches as sustaining effects. Depth: Read as incident vocabulary and design prompts (retry budgets, shedding). The 7-page toy model illustrates; it does not predict.
4. [Metastable failures in the wild: incident evidence](https://www.usenix.org/system/files/osdi22-huang-lexiang.pdf) (Metastable Failures in the Wild (Huang et al., 2022)) - Section 1 (22 metastable failures from 11 organizations); Table 1 public-source incident rows; Section 2.2 (retry policies as the most common sustaining effect, in more than half the studied incidents). Depth: Read as a trigger catalog for chaos scenarios. The sample is public reports, not a failure rate; never quote the retry share as universal.

**Focus**

- Amplification multiplies down the stack. One retry at each of four layers turns one user call into $`2^4 = 16`$ attempts; the budget caps attempts, not intentions.
- Equal jitter spreads synchronized retries: for attempts numbered from zero, `temp = min(cap, base * 2**attempt)` and each sleep is `temp / 2` plus a uniform draw from `0` to `temp / 2`, with an independent RNG per client.
- The breaker in the exercise uses timeouts as the probe timer, not as failures: a timeout moves open to half-open, and one trial decides.
- Removing the trigger does not end a metastable outage. In the worked example the network recovers but the retry loop keeps load high; only dropping offered load below the model's stable threshold recovers it, and that toy threshold is not a production target.

**Reproduce:** Without notes, compute worst-case attempts for 1 retry at each of 4 layers, and the first three equal-jitter sleeps for base 1 s, cap 8 s and seed 7 (`random.Random(7)`).

**Traps**

- Counting retries per layer instead of multiplying. 2 retries at each of three layers is $`(1+2)^3 = 27`$ downstream attempts in the Systems unit's example, not 6.
- Treating breaker timeouts as failures. In the simulator a timeout leaves closed-state counts unchanged and only advances open toward half-open.
- Confusing trigger with root cause. The incident study separates what pushed the system into the vulnerable state from the retry loop that held it there.

**Practice**

- [AlgoMaster: Classify Retry Outcomes](https://algomaster.io/practice/system-design/classify-retry-outcomes) - `classify` returns `delivered` for failures within budget and `dlq` beyond it, preserving order without mutating input
- [AlgoMaster: Simulate a Circuit Breaker](https://algomaster.io/practice/system-design/simulate-a-circuit-breaker) - `simulate` reports the state after every event; the page tests threshold opening, timeout-driven half-open trials and trial-failure reopening

**Stop when:** Your amplification product, jitter schedule and breaker trace match hand computation, and your loglab retry policy states its budget as a share of traffic.

<details>
<summary>Self-test</summary>

1. One retry is configured at each of 4 layers. How many attempts can one user call produce?
   - $`2^4 = 16`$. Each layer doubles the attempts of the layer above, so budgets must be set against the product.
2. Equal jitter, base 1 s, cap 8 s, seed 7: what are the first three sleeps?
   - About 0.66 s, 1.15 s and 3.30 s. Each is `temp/2` plus a uniform draw up to `temp/2` with `temp` 1, 2 and 4.
3. Events `failure, failure, timeout, success` with threshold 2: what states does the breaker report?
   - `closed, open, half_open, closed`. The second failure opens it, the timeout starts one trial, and the successful trial closes it.
4. A message fails 3 times with `maxRetries = 2`. Delivered or dead-lettered?
   - Dead-lettered. Delivery needs failures at or below the budget; exactly at the budget still delivers, one more does not.
5. Load returns to normal but the outage persists. What does the metastable model say to do?
   - Break the sustaining loop: shed load, drain the retry backlog, restore cache hit rate. Waiting for the trigger to pass already failed.

</details>

#### U7. Replication versus backup and verified backup and restore

**About 4 h** · **Target:** Explain + Implement

Topics: Replication versus backup; Backup integrity and restore verification

Replicas copy corruption, deletion and schema mistakes within seconds. Only a tested restore path answers the question the incident will ask: what can you bring back, and how do you know.

**You can now**

- Distinguish replication from backup by which failures each survives.
- Take base plus WAL backups and restore them to a stated recovery target, and replay a logical log to a target with winner-only semantics.
- Verify restores by replaying into an isolated target and checking data, not by trusting the backup job's exit code.

**Study**

1. [Base backup and WAL replay](https://www.interdb.jp/pg/pgsql10/01.html) (The Internals of PostgreSQL - Base Backup and Point-in-Time Recovery) - 10.1 Base Backup (`pg_backup_start`, `pg_backup_stop`, `pg_basebackup`, Backup Manifest Files) (page read 2026-10-15).
2. [How point-in-time recovery works](https://www.interdb.jp/pg/pgsql10/02.html) (The Internals of PostgreSQL - Base Backup and Point-in-Time Recovery) - 10.2 How PITR Works (REDO start from the `backup_label`, `restore_command`, `recovery_target_time`, commit versus abort record handling) (page read 2026-10-15).
3. [Where recovery stops and what verification proves](https://www.postgresql.org/docs/18/runtime-config-wal.html) (PostgreSQL 18 Documentation - Recovery Targets, Backup Verification and Rewind) - Section 19.5.6 Recovery Target: `recovery_target_lsn` and `recovery_target_inclusive`; then the `pg_verifybackup` reference (https://www.postgresql.org/docs/18/app-pgverifybackup.html) on what manifest checks cannot cover.
4. [Design for recovery: what you recover from](https://google.github.io/building-secure-and-reliable-systems/raw/ch09.html) (Google SRE Books - SLOs, Monitoring, Overload, Cascades, Incidents and Recovery) - What Are We Recovering From (Random, Accidental, Software and Malicious errors); Design Principles for Recovery (go as quickly as possible, guarded by policy). Depth: Read for the failure categories that backups must cover. The revoke and rollback sections belong to the rotation and migration units.

**Focus**

- Replication answers node death; backup answers data death. A second replica replays the bad delete just as faithfully as the good write.
- In the practice simulator, replay only transactions committed by the inclusive target LSN. PostgreSQL instead redoes physical WAL through the recovery target, and MVCC with transaction status keeps uncommitted effects invisible. Do not equate the two.
- Keep and verify the backup manifest when there is one: it detects missing or changed files. A manifest is not required for full-backup recovery and does not replace an isolated test restore with data checks.
- Design for the incident categories first: random, accidental, software and malicious errors each stress a different part of the restore path.

**Reproduce:** Without notes, write the base-backup plus WAL-archive restore sequence, and state which of two transactions (one committed before the target, one still open at it) leaves effects.

**Traps**

- Promoting a standby and calling it a restore test. Failover exercises replication, not the backup chain; the WAL archive may have been broken for months.
- Replaying past the target. In the exercise, records at the target LSN apply and records after it do not, so a commit at the target makes its transaction a winner. In PostgreSQL, set the target and `recovery_target_inclusive` explicitly.
- Trusting the backup job's success status. Verification means replaying into an isolated target and reading the data back.

**Practice**

- [AlgoMaster: Replay WAL to a Point in Time](https://algomaster.io/practice/system-design/replay-wal-to-a-point-in-time) - `recover` replays winner puts and deletes in increasing LSN order and returns rows sorted by key; the page tests that uncommitted transactions leave no effect. The section mini-project covers this: take a base backup and WAL archive, restore into an isolated target, and verify committed data, tenant predicates and the current deletion policy.

**Stop when:** Your simulator handles the winner set, and an isolated restore from your own backup and WAL passes data and policy checks.

<details>
<summary>Self-test</summary>

1. A bad `DELETE` commits and replicates to all standbys. Does failover recover the rows?
   - No. Replication copies the delete. Only a backup from before the commit, replayed to a point before it, brings the rows back.
2. Transaction 1 commits before the target LSN and transaction 2 is still open at it. Which effects survive recovery?
   - Only transaction 1's. In the simulator, winners need a commit record at or before the target and every operation of the open transaction is ignored. PostgreSQL redoes the physical WAL to the target, and transaction status keeps the open transaction's rows invisible.
3. What does the backup manifest add, and what does it not prove?
   - It lists the backup's files with checksums, so `pg_verifybackup` can detect missing or changed files. It cannot run every check a live server would, so a test restore with data checks is still required.
4. Which incident category does a tested restore address that RAID and replicas do not?
   - Accidental and malicious errors: mistaken or hostile writes that the storage layer and replicas faithfully preserve.

</details>

#### U8. Recovery point and time objectives and disaster-recovery failover and failback

**About 4 h** · **Target:** Derive + Measure

Topics: Recovery point and recovery time objectives; Disaster-recovery failover and failback

Objectives without a derivation are wishes. RPO and RTO decompose into measurable stages, and the timeline history is what lets the old primary rejoin instead of becoming a split brain. The Systems unit on SLIs, SLOs, error budgets and recovery objectives derived series and parallel availability; here the new work is the failover and failback mechanics.

**You can now**

- Derive RPO from archive cadence and shipping lag under stated assumptions, and RTO from detection, decision, restore, verification and switch time.
- Plan failover and failback across timeline forks: fence the old primary, preserve its divergent writes, and rejoin it by rebuild or `pg_rewind`.
- Run a fenced failover and failback drill that records each RTO stage, counts lost acknowledged writes and names both timeline fork points.

**Study**

1. [Timelines: failover forks and rejoining history](https://www.interdb.jp/pg/pgsql10/) (The Internals of PostgreSQL - Base Backup and Point-in-Time Recovery) - 10.3 timelineId and Timeline History File (timelineId, Timeline History File); 10.4 PITR with Timeline History File (page read 2026-10-15). Depth: Read for why promotion forks a timeline and what the history file records. Leave 10.5 Incremental Backup for later.
2. [Rejoining a diverged primary](https://www.postgresql.org/docs/18/app-pgrewind.html) (PostgreSQL 18 Documentation - Recovery Targets, Backup Verification and Rewind) - `pg_rewind`: Description (timeline divergence, the clean-shutdown and `wal_log_hints` or data checksum prerequisites) and the warning on failures while rewinding. Depth: A fresh base backup is the fallback when the prerequisites do not hold.
3. [Recovery principles: speed, time and rollback trade-offs](https://google.github.io/building-secure-and-reliable-systems/raw/ch09.html) (Google SRE Books - SLOs, Monitoring, Overload, Cascades, Incidents and Recovery) - Design Principles for Recovery (Design to Go as Quickly as Possible; Limit Your Dependencies on External Notions of Time; Rollbacks Represent a Tradeoff Between Security and Reliability).

**Focus**

- RPO counts data, RTO counts time. If every WAL segment closes within 15 minutes, ships to durable storage within 5 more, and the base backup plus WAL chain is intact, recoverable data is at most 20 minutes old; measure and alert on each assumption.
- Promotion forks the timeline and the history file records the fork point. The old primary still holds a divergent tail: fence it before promotion, preserve those writes for reconciliation, then rebuild it or run `pg_rewind` before it follows the new timeline.
- Failback is a second failover with the same stages: detect, decide, replay, verify, switch. Skipping verification repeats the original incident in reverse.
- Failback promotes again, so a round trip forks the timeline twice. Record both fork points and the acknowledged writes that asynchronous failover may have lost.

**Reproduce:** Without notes, derive the RPO bound for a 15-minute archive cadence with 5-minute shipping lag and state its assumptions. Then write the failover and failback runbook for one primary and one standby with the fence step, both timeline fork points and the RTO stage each step belongs to.

**Traps**

- Promising zero RPO on asynchronous replication. Only synchronous acknowledgement bounds data loss; async always risks the unsent tail.
- Rejoining the old primary without the timeline history. Two writers on divergent timelines is a split brain wearing a recovery badge.
- Treating a nominal RPO as a promise. A failing archive command stalls shipping while WAL piles up; alert when the newest archived segment ages past the bound.

**Practice**

- The section mini-project covers this: a fenced failover and failback drill on two local PostgreSQL instances or your loglab replicas that records detection, decision, restore, verification and switch times, counts lost acknowledged writes and names both timeline fork points.

**Stop when:** Your RPO derivation states its assumptions, and your failover and failback drill records every RTO stage, counts lost acknowledged writes and names both fork points.

<details>
<summary>Self-test</summary>

1. WAL archives close every 15 minutes and ship within 5 more. What RPO can you state, and on what conditions?
   - At most 20 minutes of writes, provided segments really close on schedule, shipping meets its bound, and the base backup plus WAL chain has no gaps. Restore speed affects RTO, not RPO.
2. Detection takes 2 minutes, the decision 5, restore 30, verification 10 and the switch 1. What is the RTO, and which stage do you shrink first?
   - 48 minutes. Restore dominates, so a faster restore or a warm standby buys the most; skipping verification saves 10 minutes at the risk of repeating the incident.
3. A failover and a later failback both promote a server. How many timeline forks does the round trip create?
   - Two. Each promotion starts a new timeline, and each history file records its own fork point.
4. After failover, the old primary returns with unreplicated writes. What must happen before it rejoins?
   - It stays fenced. Preserve its divergent writes for reconciliation, then rebuild it or run `pg_rewind` with its prerequisites so it follows the new timeline as a standby. It must never write the old timeline again.

</details>

#### U9. Rolling protocol and schema evolution, mixed-version behavior and feature gates

**About 4 h** · **Target:** Explain + Implement

Topics: Rolling protocol and schema evolution; Mixed-version behavior and feature gates

Deploys are mixed-version states, not instants. Every pair of old and new code that can meet must already agree on the wire format, and every subject must land on the same side twice in a row.

**You can now**

- State backward and forward compatibility for each mixed reader and writer pair in a rolling upgrade.
- Roll flags and versions out to a stable slice of subjects with deterministic sticky assignment.
- Gate a cutover on ordered readiness checks with drain accounting and a valid rollback.

**Study**

1. [DDIA 2e Chapter 5: compatibility directions](https://dataintensive.net/) (DDIA 2e - Chapters 2, 5 and 14) - Chapter 5, Encoding and Evolution: backward and forward compatibility definitions (p. 162); Avro reader-writer compatibility (pp. 174-175); Dataflow Through Databases (pp. 178 to 179); Data encoding and evolution for RPC (p. 186).
2. [Deployments: rolling, blue-green, canary, flags](https://github.com/handbook-academy/engineering-handbook/blob/d177ae2b48b4dfebf8ad0ddae51a345b3e17d99e/content/hld/part-6-reliability-and-operations/05-deployment-strategies.md) (HLD Handbook - Reliability, Operations and Security at Scale) - Deploy vs release; Rolling deploys; Blue-green; Canary with automated analysis; Feature flags as the release control plane. Depth: Read for the strategy mechanics. Leave Database migrations and expand-contract to the next unit.

**Focus**

- Name the writer and reader versions in each direction. New-writer with old-reader needs forward compatibility; old-writer with new-reader needs backward compatibility.
- Deploy is not release. A flag separates shipping code from exposing behavior, so a bad release rolls back by flipping the flag, not by redeploying.
- Compute the deterministic bucket from the same subject ID on every request. Fresh random assignment, or changing the hash algorithm, salt or subject identity, can flip users mid-rollout.
- A rolled-back cutover is valid but incomplete: green stays deployed and switchable, and blue retires only after every old connection drains.

**Reproduce:** Without notes, state the compatibility direction each mixed pair needs when a rolling upgrade adds an optional field, and compute bucket and enablement for two user IDs under the sticky hash at 50%.

**Traps**

- Testing only new-to-new pairs. Mixed pairs are the rollout: the old reader that chokes on the new field is the outage.
- Relying on an unspecified built-in hash. For the exercise's printable-ASCII IDs, start with `h = 0` and update `h = (h * 31 + ord(c)) & 0xFFFFFFFF` for each character `c`; the bucket is `h % 100`.
- Retiring blue before drains finish. The cutover auditor keeps blue until green is active and every pre-existing connection has closed.

**Practice**

- [AlgoMaster: Build Sticky Feature-Flag Buckets](https://algomaster.io/practice/system-design/build-sticky-feature-flag-buckets) - `bucket` implements the pinned unsigned 32-bit polynomial hash with `h % 100`; `isEnabled` holds exactly when the bucket is below the rollout percent
- [AlgoMaster: Audit a Blue-Green Cutover](https://algomaster.io/practice/system-design/audit-a-blue-green-cutover) - Readiness gates must precede the switch, each drain closes one blue connection, and a rolled-back trace stays valid but incomplete

**Stop when:** Your mixed-pair table names both directions correctly, bucket math matches the pinned hash, and a cutover trace with gates, drains and a rollback audits clean.

<details>
<summary>Self-test</summary>

1. A rolling upgrade adds an optional field. Which direction does a new-writer with old-reader pair need?
   - Forward compatibility: the old reader must handle data from the newer writer, for example by ignoring the unknown field.
2. Which direction does an old-writer with new-reader pair need?
   - Backward compatibility: the new reader handles older data, supplying a default for the missing field when the encoding requires one.
3. Users land in buckets 40, 17, 9 and 76 at a 50% rollout. Who gets the feature?
   - Buckets 40, 17 and 9. Enablement is `bucket < 50`; bucket 76 waits.
4. A cutover switches to green, then rolls back to blue. Is the trace valid?
   - Valid but incomplete. Rollback to retained blue is legal; completion additionally needs green active with blue retired and drained.

</details>

#### U10. Expand, migrate and contract changes, rollback boundaries and migration tests

**About 5 h** · **Target:** Implement

Topics: Expand, migrate and contract state changes; Rollback boundaries and irreversible transformations; Mixed-version migration and rollback tests

State outlives code, so a deploy that only handles the new shape corrupts the old rows it meets. Expand-contract keeps every intermediate state readable by both versions until no old reader remains.

**You can now**

- Plan an expand, migrate and contract change with a rollback point in each phase.
- Mark irreversible transformations and route them forward instead of rolling back.
- Test mixed-version migration with surge and availability limits plus sticky path routing.

**Study**

1. [Database migrations and expand-contract](https://github.com/handbook-academy/engineering-handbook/blob/d177ae2b48b4dfebf8ad0ddae51a345b3e17d99e/content/hld/part-6-reliability-and-operations/05-deployment-strategies.md) (HLD Handbook - Reliability, Operations and Security at Scale) - Database migrations and expand-contract. Depth: Read this section only here. The rolling, blue-green and canary sections belong to the previous unit.
2. [DDIA 2e Chapter 5: dataflow through databases](https://dataintensive.net/) (DDIA 2e - Chapters 2, 5 and 14) - Chapter 5, Modes of Dataflow: Dataflow Through Databases (pp. 178-179); Event-Driven Architectures (pp. 189-191), especially preserving unknown fields during republishing. Depth: Read for mixed-version dataflow and preserving unknown fields; use the HLD migration section for the phased change itself.
3. [The Migrator: schema and data migration drills](https://builddistributedsystem.com/tracks/migrator) (Building Distributed Systems - The Tracer, The Securitor and The Migrator) - First three free tasks of the track (schema migrations, expand and contract, zero-downtime change), graded in the browser after login. Depth: Treat a pass as a drill. Your evidence is the migration plan and rollback test on your own data.

**Focus**

- During expand and migrate, keep every supported reader and writer compatible and keep both representations equal through an atomic update or a tested reconciliation. Contract ends compatibility with old binaries, so document that rollback boundary.
- Contract only after the last old reader is gone. Dropping a column while one old binary still selects it turns a cleanup into an outage.
- Once the last recoverable original is destroyed by hashing, deletion or lossy recoding, restoring the old shape needs a retained source or backup. A minimum software version stops insecure code rollback; it cannot invert the data transform.
- Rolling replacement respects fleet limits: total instances stay within surge, and available capacity never drops below the unavailability bound.

**Reproduce:** Without notes, write the three-phase plan for a column rename with the rollback point of each phase, and state which phase a hashing transform can never roll back from.

**Traps**

- Migrating before expanding. Backfilling the new column before all writers know it means old writers keep writing the old shape over migrated rows.
- Ignoring `maxUnavailable` when stopping old instances. An old instance may stop whenever the remaining ready count stays at least `desiredReplicas - maxUnavailable`; only with `maxUnavailable = 0` must ready replacement capacity come first.
- Routing by shortest prefix. The strangler router takes the longest matching prefix, and the `/` rule matches everything as the fallback.

**Practice**

- [AlgoMaster: Route a Sticky Strangler Rollout](https://algomaster.io/practice/system-design/route-a-sticky-strangler-rollout) - Longest-prefix match with `/` as catch-all; the pinned hash decides buckets and `bucket < rolloutPercent` routes new. Then apply the same routing to your loglab migration. The section mini-project covers this: mixed-version migration and rollback tests on existing data.
- [AlgoMaster: Audit a Rolling Deployment Trace](https://algomaster.io/practice/system-design/audit-a-rolling-deployment-trace) - Surge and unavailability limits on every event; unknown events violate; a valid partial trace is not complete

**Stop when:** Your three-phase plan names every rollback point, both auditors pass including the partial-trace case, and a hashing transform is marked roll-forward-only.

<details>
<summary>Self-test</summary>

1. Where is the rollback point of the migrate phase?
   - At the dual-shaped state, before contract. Roll readers back only after verifying the old representation holds every acknowledged write; if new writers updated only the new column, switching back loses those writes.
2. A migration hashes raw identifiers into buckets. Why can it not roll back?
   - Hashing is irreversible: the bucket does not determine the identifier. Restoring the old shape needs a retained copy of the originals or a backup; otherwise recovery rolls forward with a fix.
3. Desired 3, surge 1: how many instances may exist at once, and when may an old instance stop?
   - At most 4. An old instance may stop whenever the remaining ready count stays at least `desiredReplicas - maxUnavailable`. With `maxUnavailable = 1` one old instance may stop before any new one is ready; with 0 a ready replacement must come first.
4. Rules exist for `/api` at 30% and `/api/v2` at 100%. A request for `/api/v2/orders` from a bucket-80 subject routes where?
   - New. The longest prefix `/api/v2` wins over `/api`, and 80 is below 100. Percentage 0 always routes legacy, 100 always routes new.

</details>

#### U11. Data classification, retention, residency and privacy-preserving analytics

**About 4 h** · **Target:** Explain

Topics: Data classification and retention; Data residency and jurisdiction mapping; Privacy-preserving analytics mechanisms

Retention and residency are placement constraints on every store this track built. A log, index or backup that cannot say which jurisdictions hold it, for how long, cannot lawfully or safely hold user data.

**You can now**

- Classify data into handling tiers with a retention and deletion mechanism per tier.
- Map each tier to the jurisdictions that may store and process it, with a transfer rule per border crossed.
- Choose a privacy mechanism that matches the question asked, and state what it cannot prove.

**Study**

1. [Residency and erasure: classification, topologies, crypto-shredding](https://github.com/handbook-academy/engineering-handbook/blob/d177ae2b48b4dfebf8ad0ddae51a345b3e17d99e/content/hld/part-7-security-at-scale/06-data-residency-compliance.md) (HLD Handbook - Reliability, Operations and Security at Scale) - Data classification as a distributed-systems problem; Residency topologies; Right-to-erasure and crypto-shredding; Cross-border transfers post-Schrems II; Audit, lineage, and consent.
2. [DDIA 2e Chapter 14: privacy framing](https://dataintensive.net/) (DDIA 2e - Chapters 2, 5 and 14) - Chapter 14, Doing the Right Thing: Privacy and Tracking (pp. 589 to 596). Depth: Read for the consent, retention and governance framing only. The chapter argues policy, not mechanisms; every mechanism claim in this unit comes from the HLD chapters and the Systems differential privacy unit.
3. [Privacy mechanisms: matching primitive to question](https://github.com/handbook-academy/engineering-handbook/blob/d177ae2b48b4dfebf8ad0ddae51a345b3e17d99e/content/hld/part-7-security-at-scale/08-privacy-preserving-systems.md) (HLD Handbook - Reliability, Operations and Security at Scale) - Differential privacy fundamentals; Federated learning and FedAvg; Choosing the right primitive. Depth: Read for the mechanism menu. The Systems unit on differential privacy: adjacency, sensitivity, noise and composition already derived that math; do not redo it, and implement nothing here.

**Focus**

- Classification is a storage contract: each tier names its retention, its residency and the mechanism that deletes it. A tier without a deletion mechanism is indefinite retention.
- Crypto-shredding makes retained ciphertext unreadable only after every usable copy of the decryption keys is destroyed, including cached plaintext keys, key backups and alternate wraps. Plaintext and derived copies need their own erasure.
- Residency topologies place the constraint before the data moves. A backup or index copy in another jurisdiction is a transfer, whatever the primary store promises.
- Mechanisms answer different questions: noise for aggregate release, federation for training without centralizing data. Neither proves a model forgot its training set.

**Reproduce:** Without notes, write a four-tier classification table (tier, retention, residency, deletion mechanism) for loglab data and state the key-destruction condition crypto-shredding depends on.

**Traps**

- Deleting the database row and keeping the backups, indexes and telemetry. Erasure must propagate to every copy the lineage records.
- Quoting a mechanism as a guarantee. Differential privacy bounds a query release; it says nothing about the raw store beside it.
- Treating consent text as residency control. Policies do not place bytes; topologies and transfer rules do.

**Practice**

- The section mini-project covers this: a classification, retention and residency policy table for the dossier's data paths, with the deletion mechanism per tier.

**Stop when:** Your four-tier table names a verifiable deletion mechanism per tier, every cross-border copy has a transfer rule, and you can say which privacy question each mechanism answers.

<details>
<summary>Self-test</summary>

1. A tier keeps raw identifiers for 30 days with per-purpose keys, then destroys the keys while ciphertext remains in cold backup. Is that erasure?
   - Only if every usable copy of those keys is gone, including cached plaintext keys, key backups and alternate wraps, and no plaintext or derived copy survives elsewhere. Ciphertext left in backup does not defeat shredding, and shredding alone does not establish legal compliance.
2. A replica of the primary store runs in a second jurisdiction. What must the residency mapping add?
   - The replica's jurisdiction, the transfer rule covering the border crossed, and matching retention and deletion for the copy. The copy is a transfer even though the application never asked for one.
3. Why does this unit implement no privacy mechanism?
   - Its job is selection and placement: which tier, which jurisdiction, which mechanism. The Systems units already derived the noise math and demonstrated the attacks; repeating them here teaches nothing new.

</details>

#### U12. Deletion propagation, lineage, provenance and reproducible backfills

**About 4 h** · **Target:** Explain + Implement

Topics: Deletion propagation and tombstones; Lineage, provenance and reproducible backfills

Retention tables are promises; propagation keeps them. A delete that stops at the primary while caches, indexes and backfill outputs keep serving the data is erasure theater.

**You can now**

- Propagate deletion past tombstones, caches and derived copies with version watermarks and a durable deletion ledger.
- Record lineage from raw source to derived artifact so every copy is reachable from its origin.
- Rerun backfills deterministically from pinned inputs, code, configuration, dependencies and randomness.

**Study**

1. [Erasure and lineage: crypto-shredding, audit, consent](https://github.com/handbook-academy/engineering-handbook/blob/d177ae2b48b4dfebf8ad0ddae51a345b3e17d99e/content/hld/part-7-security-at-scale/06-data-residency-compliance.md) (HLD Handbook - Reliability, Operations and Security at Scale) - Right-to-erasure and crypto-shredding; Audit, lineage, and consent. Depth: Read for the erasure mechanisms and lineage requirements. Classification and residency topologies belong to the previous unit.

**Focus**

- The Classical ML unit on snapshots, lineage, pipeline serialization and serving parity kept immutable snapshots with per-row lineage, and the LLM Foundations unit on provenance, deduplication and contamination kept raw identity apart from normalized identity. Here the new work is applying both to deletion.
- The exercise's cache watermark rejects stale fills at or below the invalidation version, but a newer fill may be accepted. Subject erasure also needs a durable deletion ledger or generation fence that backfills and restores check.
- Equal-version puts are idempotent and newer versions must clear the watermark. Allow recreating an erased subject only under an explicit authorization policy, and test a stale source that republishes erased data with a fresh version.
- Pin the input snapshot, code, configuration, dependency versions and any randomness or time inputs, and use deterministic ordering. Two reruns must agree under a declared equality policy; if floating-point reductions vary, state and justify a tolerance.

**Reproduce:** Without notes, trace a delete from primary through cache watermark to a backfill output, and state the read result when a delayed put at version 6 meets a tombstone watermark at 8.

**Traps**

- Expiring the key and resetting its version history. The versioned store keeps version history across expiry and deletion, so a recreated key never reuses an old version number.
- Invalidating without a watermark. An event that only removes the cached entry lets an older delayed fill put the data back; the watermark is what makes invalidation idempotent.
- Backfilling from live sources. New arrivals during the rerun change the input; snapshot first, then compute.

**Practice**

- [AlgoMaster: Apply Versioned Invalidation Events](https://algomaster.io/practice/system-design/apply-versioned-invalidation-events) - Per-key invalidation watermarks with stale-event rejection; the page tests that delayed and duplicate events cannot resurrect invalidated data. Then propagate a loglab delete through your own cache watermark. The section mini-project covers this: reproducible backfills from fixed snapshots.
- [AlgoMaster: Build a Versioned TTL Key-Value Store](https://algomaster.io/practice/system-design/build-a-versioned-ttl-key-value-store) - Expiry at exactly `now + ttl` with monotonic versions across expiry and deletion; `compareAndSet` and `remove` act only on live matching versions

**Stop when:** Your delete trace names every copy it touches, watermarked invalidation passes the delayed-fill cases, a fresh-version republish of an erased subject is rejected, and two backfills from pinned inputs agree under your declared equality policy.

<details>
<summary>Self-test</summary>

1. A key holds version 5 with watermark 4, and a delayed fill for version 5 arrives. Accept or reject?
   - Accept as idempotent: it equals the cached version and sits above the watermark. A fill at version 4 or below would be rejected.
2. An invalidation event at version 5 removes the entry, then a delayed put at version 6 arrives. What happens?
   - The cache accepts it as the new live value, since version 6 exceeds the watermark of 5, and a delayed put at version 5 would be rejected. If the event was a subject erasure, the deletion ledger must also reject the fresh fill.
3. A key expires and is recreated. May it reuse version 1?
   - No. Expiration and deletion remove the live entry but keep version history, so the recreated key advances to the next unused version.
4. Two backfills of the same date range disagree. What is the first thing to compare?
   - Input snapshot identity and code version. Different inputs or different code explain different outputs before any logic bug is suspected.

</details>

#### U13. Point-in-time feature joins and online and offline feature equivalence

**About 4 h** · **Target:** Derive + Implement

Topics: Point-in-time feature joins; Online and offline feature equivalence

Training on a feature value the model could not have seen at prediction time is future leakage with infrastructure. The join rule is what keeps offline metrics honest about online behavior.

**You can now**

- Join features to entity rows as of each row's event time with TTL bounds, by hand on a small fixture.
- Exclude backfilled values that were not yet available at prediction time with created-timestamp filtering.
- Test that the online path serves the same values the offline join produced for the same entity and time.

**Study**

1. [Point-in-time joins: entity frames, TTL, created timestamps](https://docs.feast.dev/getting-started/concepts/point-in-time-joins) (Feast Documentation - Point-in-Time Joins and Feature Retrieval) - The entity dataframe and `get_historical_features` call; the TTL backward scan (TTL is relative to each entity timestamp, not to query time); the joined result with its two unjoined rows; Retrieving features as of the event time (`filter_by_created_timestamp`, NULL created timestamps excluded); Feast v0.66-branch documentation (page read 2026-10-15).
2. [Feature retrieval: historical versus online paths](https://docs.feast.dev/getting-started/concepts/feature-retrieval) (Feast Documentation - Point-in-Time Joins and Feature Retrieval) - Event timestamp (upper bound, inclusive; leakage without it); Retrieving historical features; Retrieving online features (`get_online_features` takes entity rows without timestamps); Feature Services (one service per model version) (page read 2026-10-15).

**Focus**

- Each entity timestamp is an upper bound, inclusive. The join takes the latest feature row at or before it, scanning back at most the TTL. This is the mechanical fix for the future leakage in the Classical ML unit on leakage: target, future, entity, duplicate, preprocessing and feedback.
- TTL is relative to each entity timestamp, not to query time. Reproducible results also need a pinned feature-source snapshot and join definition, since later backfills can change a retrieval; filter on availability time to reproduce what could have been served then.
- Corrections and backfills carry a created timestamp. Without the filter flag, a value corrected after prediction time still joins into training.
- Online serving returns the latest value with no timestamp argument. Version the feature definitions both paths use, log the served vector with its materialization state, and compare it with the historical join under the same snapshot, transforms, TTL and availability-time rules.

**Reproduce:** Without notes, with TTL 25, join feature rows `(1, 10, 'a', 10)`, `(1, 20, 'b', 20)`, `(1, 28, 'b2', 40)`, `(1, 35, 'c', 35)` (entity, event time, value, created) to entity rows `(1, 12)`, `(1, 30)`, `(1, 65)`, `(2, 10)` (entity, event time). Then repeat with created-timestamp filtering.

**Traps**

- Joining the latest feature row regardless of the entity time. The `(1, 30)` row must never see the value from event time 35.
- Enabling the created filter with NULL created timestamps. The docs exclude those rows instead of treating them as always available.
- Comparing online output to a retrained offline join after a backfill. Equivalence is checked against the stored training frame, not a fresh recomputation.

**Practice**

- The section mini-project covers this: a reduced feature-store path with point-in-time joins on a hand-checkable fixture, TTL and created-timestamp cases, and an online versus offline equivalence test.

**Stop when:** Your hand join matches the stated answers for both flags, and you can say for any served value which entity time and filter produced it.

<details>
<summary>Self-test</summary>

1. Default join: what does each entity row get?
   - `(1, 12)` gets `'a'`; `(1, 30)` gets `'b2'`; `(1, 65)` gets nothing, since $`65 - 35 = 30 > 25`$; `(2, 10)` gets nothing, since entity 2 has no rows.
2. With created-timestamp filtering, what does `(1, 30)` get, and why?
   - `'b'`. The `'b2'` row was created at 40, after the entity time 30, so it is excluded and the join falls back to the row from event time 20.
3. Why does the TTL miss on `(1, 65)` not depend on when the query runs?
   - TTL measures back from each entity timestamp: $`65 - 35 = 30 > 25`$ whenever the query runs. Query time never enters the join.
4. The online path serves `'c'` for entity 1 while the stored training frame for a `(1, 30)` row holds `'b'`. Is that a serving bug?
   - Not by itself: online serves the latest value and time has passed. Compare the logged online vector with the historical join under the same snapshot, transforms, TTL and availability-time rules; a mismatch there is the bug signal.

</details>

#### U14. Model-registry state, artifact checksums, retrieval-index freshness and dataset version identity

**About 5 h** · **Target:** Explain + Implement

Topics: Model-registry version and promotion state; Artifact and checkpoint checksums; Retrieval-index freshness and rebuild state; Dataset and evaluation version identity

A model version, a dataset path and an index name are pointers, and pointers move. Lineage plus checksums plus watermarks turn them into identities a later audit can resolve.

**You can now**

- Promote and roll back model versions through registry aliases with lineage to the producing run.
- Verify artifacts and checkpoints by checksum before serving or evaluating them.
- Build immutable retrieval-index generations from a recorded input frontier and switch readers between them atomically.
- Give every dataset and evaluation input a content identity independent of its path.

**Study**

1. [Model Registry: versions, lineage, aliases, stages](https://mlflow.org/docs/latest/ml/model-registry/) (MLflow Model Registry Docs) - Why Model Registry (version control, lineage and traceability); Concepts (annotations and descriptions); Model Registry in practice (aliases such as @champion, stages, tags). Depth: Stages are deprecated since MLflow 2.9 (Model Registry Workflows, Migrating from Stages); use aliases and tags. Page read 2026-10-15.
2. [Dataset identity: checksum sidecars and pipeline locks](https://doc.dvc.org/command-reference/add) (DVC Docs - Data Versioning) - `dvc add`, Description and Example: Single file, for `.dvc` content-hash sidecars; for pipeline definition and lock state, the `dvc.yaml` page with its `dvc.lock file` section (https://doc.dvc.org/user-guide/project-structure/dvcyaml-files); for transfer, https://doc.dvc.org/command-reference/push and https://doc.dvc.org/command-reference/pull (page read 2026-10-15).
3. [Serving versions: feature services and materialize refresh](https://docs.feast.dev/getting-started/concepts/feature-retrieval) (Feast Documentation - Point-in-Time Joins and Feature Retrieval) - Feature Services (one service per model version); Retrieving online features; Pre-computed feature vectors (rebuilt on `materialize` and `materialize-incremental`) (page read 2026-10-15). Depth: Read as the serving-state pattern: named feature groups and refreshed vectors. Feast defines no global input-offset snapshot; the build frontier and the generation swap are your own design. The join mechanics belong to the previous unit.

**Focus**

- An alias resolves to a version, and a version resolves to its producing run. Treat registered artifact bytes and run identity as immutable by policy; tags, descriptions and aliases may change under audit.
- Record trusted artifact and dataset-content digests with the code commit, configuration, dependencies, seeds and execution inputs. Read the dataset digest from the `.dvc` output entry, not the hash of the sidecar file; hashes verify inputs, and only a rerun shows reproducibility.
- Say whether your build metadata is a completeness frontier or an exact snapshot boundary. A completeness watermark through offset 1000 guarantees inclusion through it but may allow newer visible writes; only an immutable build capped at offset 1000 with an atomic generation switch excludes later writes. Partitioned inputs need a per-partition frontier.
- DVC tracks content, git tracks the pointer. The small `.dvc` file commits to git while the bytes live in cache or remote; `pull` restores exactly the committed bytes.

**Reproduce:** Without notes, resolve `@champion` before and after a promotion and a rollback, and list what an evaluation rerun must match: artifact and dataset-content digests, code commit, configuration, dependencies and seeds.

**Traps**

- Versioning the pointer file but not fetching the bytes. A `.dvc` sidecar without `pull` reproduces the hash of data you do not have.
- Reading index freshness from wall-clock age. Staleness is measured against the build's input frontier: which writes are included, not how old the files are.
- Confusing copying bytes with promoting a registry version. Move the serving alias to the verified version and keep its producing-run identity; byte-identical copies keep the same content identity.

**Practice**

- [AlgoMaster: Build a Versioned TTL Key-Value Store](https://algomaster.io/practice/system-design/build-a-versioned-ttl-key-value-store) - Monotonic versions per key across expiry and deletion; `compareAndSet` and `remove` act only on live matching versions. Treat versions as append-only registry discipline in miniature. The section mini-project covers this: build immutable retrieval-index generations from an identified dataset and per-partition offset frontier, verify document counts and deletions against an independent reference, publish a generation pointer atomically, and test a crash before and after publication plus rollback to a retained generation.

**Stop when:** You resolve alias moves without touching versions, list every input an evaluation rerun must match, and say for any served read which generation and frontier it came from.

<details>
<summary>Self-test</summary>

1. `@champion` points at v3, then v4 is promoted, then rolled back. What does `@champion` resolve to at each step?
   - v3, then v4, then v3 again. Promotion repoints the alias; rollback repoints it back. Neither step rewrites v3 or v4 or their lineage.
2. An evaluation reruns with the same dataset path but a different `.dvc` hash. Is it the same evaluation?
   - No. Identity is the content hash, not the path. Different bytes mean a different input even under the same filename.
3. An index build records a completeness watermark through offset 1000, and offset 1042 just committed. Which rows may a served query reflect?
   - Every row through offset 1000, and possibly some newer ones: a completeness watermark is a lower bound. Only an immutable generation capped at offset 1000 with an atomic switch excludes offset 1042.
4. A recreated registry key reuses version number 2 after v2 was deleted. What breaks?
   - Lineage: two different artifacts claim one identity, and old references to v2 become ambiguous. Versions are append-only; the versioned store in the deletion unit keeps history across expiry for the same reason.

</details>

#### U15. A load, chaos, backup and restore campaign with capacity, recovery and migration costs

**About 5 h** · **Target:** Measure

Topics: Load, chaos, backup and restore campaign; Capacity, recovery and migration cost measurement

Every unit in this section feeds this campaign. One compound incident, run on schedule and reconstructed from stored evidence, turns the separate mechanisms into an operated system.

**You can now**

- Run a scheduled campaign of load, fault, backup and restore scenarios with named triggers and abort conditions.
- Measure SLO impact, recovery point and time, backlog and cost on every scenario.
- Keep raw histories with evidence labels that separate simulated, local and inferred claims.

**Study**

1. [Chaos: experiment framework and blast radius](https://github.com/handbook-academy/engineering-handbook/blob/d177ae2b48b4dfebf8ad0ddae51a345b3e17d99e/content/hld/part-6-reliability-and-operations/06-chaos-engineering.md) (HLD Handbook - Reliability, Operations and Security at Scale) - The Principles of Chaos; The experiment framework; Failure modes to inject; Blast radius control. Depth: Read for the steady-state, hypothesis and blast-radius structure. Run the experiments on your local processes, not on shared infrastructure.
2. [Error-path testing: why the campaign starts with faults](https://www.usenix.org/system/files/conference/osdi14/osdi14-paper-yuan.pdf) (Simple Testing Can Prevent Most Critical Failures (Yuan et al., 2014)) - Introduction and Table 1: 198 user-reported failures across Cassandra, HBase, HDFS, MapReduce and Redis, 48 of them catastrophic; of those, 92% involved mishandled explicitly signaled non-fatal errors and 58% were detectable by simple tests. Section 3.2 and Table 5: 98% of the sampled failures needed at most 3 nodes. Depth: Read as the priority argument: error paths first, scale later. These are proportions of a 2014 sample, not a bound on your system or a measure of risk your tests remove.
3. [Cascades: testing until failure and incident response](https://sre.google/sre-book/addressing-cascading-failures/) (Google SRE Books - SLOs, Monitoring, Overload, Cascades, Incidents and Recovery) - Testing for Cascading Failures (Test Until Failure and Beyond, Test Popular Clients); Triggering Conditions for Cascading Failures (Process Death, Process Updates, New Rollouts).
4. [Incident corpus: triggers for the scenario list](https://www.usenix.org/system/files/osdi22-huang-lexiang.pdf) (Metastable Failures in the Wild (Huang et al., 2022)) - Table 1 public-source incidents as the trigger catalog (retry, scale-up, power loss rows); Section 1 study scope (22 failures, 11 organizations).

**Focus**

- Every scenario states steady state, trigger, blast-radius bound and abort condition before it runs. A chaos run without an abort condition is an unplanned outage.
- Start with error paths, not scale. In the testing paper's sample most catastrophic failures came from mishandled signaled errors and almost all failures needed at most three nodes; load comes after the handlers are correct.
- Triggers come from the incident corpus: retry storms, bad rollouts, process death, cache loss. Each scenario names which catalog row it replays.
- Cost rows are measured, not estimated: provisioned capacity, recovery time, migration traffic and backlog per scenario, each labeled with the setup that produced it.

**Reproduce:** Without notes, write a chaos-experiment card for loglab (steady-state metric, catalog trigger, blast-radius bound, abort condition) plus the four cost-ledger rows the run must fill.

**Traps**

- Running chaos before error-path tests pass. Random faults on broken handlers produce noise, not signal; the paper's order is unit-testable faults first.
- Quoting incident counts as rates. 22 failures across 11 organizations describe a sample of public reports, not the probability of your next outage.
- Ending the campaign at recovery. The ledger needs cost rows too: capacity held, traffic moved and backlog absorbed, or the next incident cannot be budgeted.

**Practice**

- The section mini-project covers this: the full load, chaos, backup and restore campaign with capacity, recovery and migration cost measurement on loglab.

**Stop when:** Your campaign runs on schedule with experiment cards, abort conditions, reconstructed histories and a filled cost ledger, and every claim carries its evidence label.

<details>
<summary>Self-test</summary>

1. Why does the campaign test error handlers before running load scenarios?
   - In the 2014 sample, 92% of the 48 catastrophic failures involved mishandled explicitly signaled errors and 58% were detectable by simple tests. That motivates testing handlers early; it does not measure how much risk your tests remove.
2. A scenario replays a cache-loss row from the incident catalog. What must its card name?
   - Steady-state hit rate, the loss trigger, the blast-radius bound (which tenants and traffic share), the abort condition, and the recovery and cost rows to measure.
3. Recovery completed but the ledger has no cost rows. Is the scenario done?
   - No. Without capacity, traffic and backlog numbers the run cannot be budgeted or compared, so the campaign objective is unmet.
4. A fault needs 5 nodes to reproduce. Does that contradict the testing paper?
   - No. The paper found that 98% of sampled failures needed at most 3 nodes, not all of them, and its sample already has larger cases. Label the 5-node result by its method: simulated if a simulator produced it, local measured if local processes did.

</details>

### Mini-project: Operate and evolve a governed data path

**About 18 to 24 hours.** Extend `loglab` with the security, recovery and governance records needed to operate its data path. Reuse the stream and transaction fixtures on your machine, proving policy and restore correctness before running a measured incident campaign.

1. Threat-model `loglab` boundaries in `ops/`; implement mTLS or a faithful verifier for validity, matching trust-domain bundles and allowed SPIFFE IDs. During rotation, test unknown domains, expired SVIDs and unauthorized IDs against an independent policy table; retain overlapping-key tenant tests across retry, cache, migration and restore.
2. Persist redacted audit events in a tamper-evident chain; test edits, deletion, truncation and restore against an independently retained checkpoint. Add bounded-cardinality W3C-context telemetry and windowed SLOs; inject an incident with skewed display timestamps, retaining causal reconstruction against the fault schedule and marking unestablished order.
3. Record classification, retention, residency, transfer rules and deletion mechanisms per tier. Check deletion-ledger and cache-watermark propagation against a lineage inventory, including fresh-version resurrection attempts; retain fixed-snapshot backfill agreement and hand-oracle feature joins covering TTL, created timestamps and logged online-versus-offline equivalence under matching materialization state.
4. Build immutable retrieval-index generations from content-identified datasets and per-partition frontiers; check counts and deletions against a full-scan reference. Retain before-and-after publication crash tests and retained-generation rollback; add checksum-gated artifact serving, registry alias promotion and rollback with immutable producing-run lineage.
5. Apply sticky routing and expand-migrate-contract evolution to existing `proto/` and `storage/` data. Check mixed-version reads and writes, reconciled representations, readiness, drain and availability limits against a compatibility matrix; retain rollback tests and mark the irreversible boundary and roll-forward recovery path.
6. Restore base backup and archived WAL in isolation; check committed data, tenancy and current deletion policy against the ledger. After deterministic checks, drill fenced failover/failback; retain divergent tails, both fork points, acknowledged-write loss and detection, decision, restore, verification and switch timings.
7. Model foreground, replication fan-out, backup, restore and repair costs with concurrent recovery reserves. Queue-oracle tests check bounded admission, retry budgets, breakers and bulkheads before repeated open-loop chaos campaigns including backup/restore; retain trigger/abort cards, node-loss bottleneck comparisons, versions, workloads, SLOs, backlog, capacity, recovery and migration costs.

**Deliverables**

- The `ops/` security and governance layer with independent policy, audit, deletion, feature and artifact reference checks.
- Verified backup, failover, failback and mixed-version migration runbooks with rollback boundaries and retained fault histories.
- A production dossier with causal incident reconstruction, resource reservations, repeated campaign records and evidence-labeled cost and recovery claims.

**Checks**

- rubric: Self-grade with the rubric below.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Identity and policy enforcement | Your policy-table tests reject invalid or unauthorized identities during rotation and prevent cross-tenant access on normal, retry, cache, migration and restore paths with overlapping keys. | Negative controls remove endpoint or storage enforcement independently; remaining defenses and audit records demonstrate the exact residual protection and key-compromise scope. |
| Governed derived state | Your lineage inventory, hand join and full-scan reference check deletion, deterministic backfills, feature equivalence and index counts. Publication crashes, alias rollback and artifact corruption have retained tests. | A stale source republishes erased data with a fresh version and is rejected; rollback and restore preserve current deletion policy without rewriting immutable artifact lineage. |
| Recovery and evolution evidence | Your ledger verifies isolated backup restore and both fenced promotions. Forks, divergent tails, acknowledged-write loss and recovery stages are recorded; mixed-version tests check rollback before the declared irreversible boundary. | Broken archive continuity and an incomplete migration trigger explicit refusal or roll-forward recovery, with regression histories showing why a nominally successful job was insufficient. |
| Observable bounded operation | Your audit verifier detects tampering against an external checkpoint. Queue-model checks precede repeated campaigns; causal incident evidence, capacity predictions, recovery reservations and measured cost ledgers retain setup and uncertainty. | The dossier distinguishes incident trigger from sustaining retry load, measures observer overhead, and explains a mistaken bottleneck prediction or losing policy without hiding the raw records. |

Feeds into: Policy checks, verified recovery, migration boundaries, lineage, artifact generations and incident evidence feed the formal extension's compatibility and reproduction tests and the capstone production dossier.

### Resource route

- **Primary - Course and reference:** [HLD Handbook - Reliability, Operations and Security at Scale](https://github.com/handbook-academy/engineering-handbook/tree/main/content/hld) - Read Part 6 observability, SLOs, resilience, overload, deployments, chaos, incidents and health, then Part 7 authentication, mTLS, secrets, tenancy and data governance chapters relevant to the capstone. Skip unrelated case studies.
- **Support - Book:** [DDIA 2e - Chapters 2, 5 and 14](https://dataintensive.net/) - Use Chapter 2 "Describing Performance" for percentile and response-time vocabulary and Chapter 5 for compatibility during rolling upgrades. Chapter 14 is about predictive analytics, privacy and data governance, not operations: read its "Privacy and Tracking" section for the retention and deletion units.
- **Required - Book:** [Google SRE Books - SLOs, Monitoring, Overload, Cascades, Incidents and Recovery](https://sre.google/sre-book/service-level-objectives/) - Read SRE Chapter 4 (service level objectives), 6 (monitoring distributed systems), 21 (handling overload), 22 (addressing cascading failures), 14 (managing incidents) and 15 (postmortem culture); Workbook Chapter 2 (implementing SLOs) and 5 (alerting on SLOs); and Building Secure and Reliable Systems Chapter 5 (least privilege) and 9 (design for recovery). Convert each into one alert, limit, load test or runbook action in the capstone.
- **Support - Paper:** [Metastable Failures in Distributed Systems (Bronson et al., 2021)](https://sigops.org/s/conferences/hotos/2021/papers/hotos21-s11-bronson.pdf) - Read the trigger and sustaining-effect model of metastable failure and the retry and shedding design prompts. Its model illustrates; it does not predict.
- **Support - Paper:** [Metastable Failures in the Wild (Huang et al., 2022)](https://www.usenix.org/system/files/osdi22-huang-lexiang.pdf) - Read the incident study for how retries and load sustain outages after the trigger ends; it is a sample of public reports, not a rate.
- **Support - Paper:** [Simple Testing Can Prevent Most Critical Failures (Yuan et al., 2014)](https://www.usenix.org/system/files/conference/osdi14/osdi14-paper-yuan.pdf) - Read the findings on error-handling code and how few nodes and events reproduce most failures, as the case for testing error paths in your campaign. Its bounds come from one sample of 2014 systems.
- **Support - Paper:** [Gray Failure: The Achilles' Heel of Cloud-Scale Systems (Huang et al., 2017)](https://www.microsoft.com/en-us/research/wp-content/uploads/2017/06/paper-1.pdf) - Read the gray-failure model (differential observability between a detector and its clients) as vocabulary for telemetry and failure detection.
- **Support - Reference:** [The Internals of PostgreSQL - Base Backup and Point-in-Time Recovery](https://www.interdb.jp/pg/pgsql10/) - Read Chapter 10 (base backup, how PITR replays WAL, timelines and incremental backup) as the real-engine model for backup integrity, recovery points and restore verification. Note the date you read it.
- **Optional - Practice:** [Building Distributed Systems - The Tracer, The Securitor and The Migrator](https://builddistributedsystem.com/tracks) - Only the first three tasks of each track are free: in The Tracer, trace-context propagation, span lifecycle and a collector; in The Securitor, JWTs, the OAuth 2 code flow with PKCE and sessions; in The Migrator, schema migrations, expand and contract, and zero-downtime change. Tasks are graded in the browser after login, so treat a pass as a drill and keep your local harness as the evidence. 
- **Support - Standard:** [SPIFFE Workload Identity and Workload API](https://spiffe.io/docs/latest/spiffe-specs/spiffe_workload_api/) - Read the SPIFFE ID, X.509-SVID and trust bundle specifications and the Workload API (`FetchX509SVID`, `FetchX509Bundles`) to design service identity, short-lived credentials and bundle rotation. A local mock is sufficient unless a real SPIRE deployment answers a specific gap.
- **Support - Standard and reference:** [OpenTelemetry Signals and Semantic Conventions](https://opentelemetry.io/docs/concepts/signals/) - Read signals and context propagation (W3C Trace Context `traceparent`, inject and extract, baggage rules), then the semantic conventions (1.44.0) for the RPC and messaging areas with their stability status. Define bounded attributes for request, node, partition, term and offset identities, and never infer global order from display timestamps.
- **Support - Project:** [Replicated Log and Stream Processor - Production Contract](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-2/replicated-log-stream-processor.md) - Add workload identity, tenant checks, audit, SLOs, capacity limits, backup and verified restore, mixed-version migration, rollback and reduced point-in-time ML data paths. Run one compound incident from detection through recovery.
- **Reference - Reference:** [OWASP Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html) - Use System Modeling (data-flow diagrams, trust boundaries, stores and processes), Threat Identification (the STRIDE table applied to components, data flows and trust boundaries) and Response and Mitigations to build the unit threat model.
- **Support - Required:** [Feast Documentation - Point-in-Time Joins and Feature Retrieval](https://docs.feast.dev/getting-started/concepts/point-in-time-joins) - Read Point-in-time joins (entity dataframes, `get_historical_features`, TTL backward scan, `filter_by_created_timestamp`) and Feature retrieval (`event_timestamp` as the inclusive upper bound, `get_online_features` without timestamps, feature services per model version, materialize refresh). Work the join logic on tiny local tables; do not deploy Feast. Page read 2026-10-15 (v0.66-branch documentation).
- **Support - Required:** [MLflow Model Registry Docs](https://mlflow.org/docs/latest/ml/model-registry/) - Read the Model Registry page (registered models, versions, lineage to the producing run, aliases such as @champion, and tags) and the registry tutorial promotion flow. Stages are deprecated since MLflow 2.9; use aliases and tags. Page read 2026-10-15; the versioned docs move, so re-pin the version you read.
- **Support - Required:** [DVC Docs - Data Versioning](https://doc.dvc.org/command-reference/add) - Read `dvc add` (Description and Example: Single file) for `.dvc` content-hash sidecars, the `dvc.yaml` page with its `dvc.lock file` section for pipeline state, and `push` and `pull` for transfer. A local directory remote is enough; do not set up cloud storage. Page read 2026-10-15.
- **Reference - Reference:** [PostgreSQL 18 Documentation - Recovery Targets, Backup Verification and Rewind](https://www.postgresql.org/docs/18/) - Read Section 19.5.6 Recovery Target, the `pg_verifybackup` reference and the `pg_rewind` reference for recovery stopping points, manifest checks and rejoining a diverged primary.

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

### Study units

#### U1. Abstract state-machine specifications: variables, initial state and next-state relation

**About 4 h** · **Target:** Explain + Implement

Topics: Abstract state-machine specification; State variables, initial state and next-state relation

Model checking explores a spec, not code. If you cannot write variables plus Init plus Next, every later check in this section has nothing to run on.

**You can now**

- Write a TLA+ state-machine spec with named state variables, an `Init` predicate and a `Next` action, and state what each variable abstracts away.
- Run TLC on a finite model and report the constant assignment with every result.
- Distinguish the specification from any implementation, and say which details the spec deliberately omits.

**Study**

1. [Lecture 1: Introduction to TLA+](https://lamport.azurewebsites.net/video/intro.html) (TLA+ Video Course) - Full lecture (21:18): what TLA+ is and the state-machine idea behind every later lecture.
2. [Lecture 2: State Machines in TLA+](https://lamport.azurewebsites.net/video/smintla.html) (TLA+ Video Course) - Full lecture (15:40): the first spec; copy each variable, Init and Next definition by hand.
3. [Lecture 3: Resources and Tools](https://lamport.azurewebsites.net/video/video3.html) (TLA+ Video Course) - Full lecture (11:13): install the Toolbox, open a spec, view the pretty-printed version and run TLC. Depth: If the Toolbox demo moves too fast, pause on each click and repeat it on the Die Hard files from Lecture 4 rather than on a spec of your own.
4. [Lecture 4: Die Hard](https://lamport.azurewebsites.net/video/video4.html) (TLA+ Video Course) - Full lecture (19:39): write the water-jugs spec and check it with the parser and TLC. Depth: Read the corrections page at https://lamport.azurewebsites.net/video/corrections.html for lectures 1, 3 and 4 before you run anything.

**Focus**

- A spec is variables plus `Init` plus `Next`. `Init` constrains the starting state; each disjunct of `Next` constrains one step as a relation between unprimed and primed variables.
- An action that never mentions a variable leaves it unconstrained. `UNCHANGED vars` is what keeps the rest of the state still.
- TLC checks a finite model, not the spec in general. Give every declared constant a concrete value, and bound every other source of unbounded state; constant assignments alone need not make the model finite.
- The variables choose the abstraction. The Die Hard variables record jug contents, not jug hardware, pour durations or arm movements.

**Reproduce:** Closed-book, write a two-jug spec skeleton from memory: variables, `Init`, one pour action with primed assignments and `UNCHANGED` where needed, and run TLC to an explicit `No error has been found` result with the bound stated.

**Traps**

- Reading `x' = x + 1` as assignment. It is a constraint on the step; anything the action does not constrain may change arbitrarily.
- Assuming assigned constants make the model finite. An unassigned constant is a configuration error, but unbounded counters and queues still need explicit bounds, and every bound travels with the result.
- Quoting `No error has been found` without the bound. The sentence is only true with the constant assignment attached.

**Practice**

- [TLA+ Video Course Lecture 4: specify the Die Hard jugs and check them with TLC](https://lamport.azurewebsites.net/video/video4.html) - Write the spec from the lecture, run the parser and TLC on it. Keep the first TLC error you hit and its fix. The section mini-project reuses this loop on your own model.

**Stop when:** You write a two-variable toggle spec from memory, TLC reports on it with the bound stated, and you can point to one detail the spec omits on purpose.

<details>
<summary>Self-test</summary>

1. What are the three parts of a TLA+ state-machine spec, and what does each constrain?
   - State variables hold the state. `Init` constrains the starting state. `Next` constrains each step as a relation between the current and the next state, usually run as `Init /\ [][Next]_vars`.
2. An action sets `x' = 1` and never mentions `y`. What values can `y` take in the next state?
   - Any value at all: TLA+ variables have no implicit type. Add `UNCHANGED y` to keep it still, or constrain its next value explicitly.
3. TLC prints `No error has been found` for your jugs spec. What exactly have you established?
   - That the checked properties hold on the explored finite model only. The claim must name the constant assignment, for example the jug capacities and the pour bound.
4. Why does the Die Hard spec record water levels rather than pour events?
   - The variables fix the abstraction level. Levels are what the goal and the pour rule talk about; hardware and timing are deliberately omitted.

</details>

#### U2. Safety invariants, liveness properties and fairness assumptions

**About 4 h** · **Target:** Derive

Topics: Safety invariants; Liveness properties and fairness assumptions

Safety without liveness accepts a system that does nothing; liveness without fairness blames the protocol for a starved scheduler. The alternating-bit protocol is the smallest system where both halves bite.

**You can now**

- Separate a delivery claim into its safety half (nothing bad happens) and its liveness half (something good eventually happens).
- Name the fairness assumption each liveness claim needs, and say which starvation it rules out.
- Predict whether TLC can check a claim on a finite model, and what must be added when it cannot.

**Study**

1. [Lecture 8 part 1: temporal formulas](https://lamport.azurewebsites.net/video/video8a.html) (TLA+ Video Course) - Full part (15:53): temporal formulas and what implementation will mean.
2. [Lecture 9 part 1: the high-level alternating-bit spec](https://lamport.azurewebsites.net/video/video9a.html) (TLA+ Video Course) - Full part (20:51): ABSpec.tla in video9a.zip, with `FairSpec == Spec /\ WF_vars(Next)` and the `Inv` invariant. Depth: Download video9a.zip from the lecture page for ABSpec.tla; read it beside the video, not instead of it.
3. [Lecture 9 part 2: the protocol and its fairness](https://lamport.azurewebsites.net/video/video9b.html) (TLA+ Video Course) - Full part (18:45): AB.tla in video9b.zip, with `Next == ASnd \/ ARcv \/ BSnd \/ BRcv \/ LoseMsg` and `FairSpec` adding `SF_vars(ARcv)`, `SF_vars(BRcv)`, `WF_vars(ASnd)`, `WF_vars(BSnd)`. Depth: Read the lecture 9 part 2 entry on the corrections page (https://lamport.azurewebsites.net/video/corrections.html) for where the Toolbox now sets the state constraint.

**Focus**

- A safety violation has a finite bad prefix. Liveness concerns infinite behaviors; TLC checks it on a finite state graph, and fairness belongs in the spec only when it is a justified assumption of the claim.
- Fairness constrains the scheduler, not the algorithm. `WF_vars(ASnd)` says a persistently enabled send keeps happening; `SF_vars(ARcv)` says a repeatedly enabled receive keeps happening.
- Loss is an action like any other. `LoseMsg` is enabled whenever a queue holds a message, so delivery depends on repeated sends plus fair receives, not on the absence of loss.
- The two specs separate concerns: ABSpec states what delivery means, AB states how retransmission with alternating bits achieves it under fairness.

**Reproduce:** Closed-book, write the AB `Next` disjunction and the four fairness conjuncts of its `FairSpec` from memory, and explain which starvation each conjunct rules out.

**Traps**

- Adding fairness to silence a liveness violation without reading the trace. If the violating behavior is already fair, the protocol is wrong and fairness hides nothing.
- Writing a liveness claim as a state predicate. `BVar = AVar` holds or not at a state; eventual delivery is a claim about the whole behavior.
- Checking liveness with unbounded queues. `AtoB` and `BtoA` grow without bound, so TLC needs a queue-length constraint before it can finish.

**Practice**

- [TLA+ Video Course Lecture 9: check the alternating-bit spec with TLC](https://lamport.azurewebsites.net/video/video9b.html) - Check `TypeOK` on `Spec` with `Data = {d1, d2}` and both queues bounded at 3 (with deadlock checking off, TLC 2.19 finds 480 distinct states at depth 15). Then state a temporal delivery property, predict the starvation that removing one fairness conjunct permits, and check that property on a bounded model whose boundary behavior you have justified. Do the removal as a prediction first, then run. Keep the temporal counterexample if one appears.

**Stop when:** You classify three claims as safety or liveness, attach the fairness each liveness claim needs, and reproduce the AB `Next` plus its four fairness conjuncts without notes.

<details>
<summary>Self-test</summary>

1. Split `every sent value is eventually received, and no value is received twice` into safety and liveness.
   - No-duplicates is safety: one duplicated delivery in a finite prefix violates it. Eventual receipt is liveness: no finite prefix can show a value is never delivered.
2. What does `FairSpec` add over `Spec` in AB.tla, and why?
   - Four fairness conjuncts: strong fairness on the two receives and weak fairness on the two sends. They rule out behaviors where an enabled send or receive is starved forever, which liveness needs.
3. TLC reports a liveness violation whose trace shows the sender never sending. Is the protocol broken?
   - Not shown. The behavior starves `ASnd`; add `WF_vars(ASnd)` first. Only a violation of the fair spec indicts the protocol.
4. Why do the AB model runs need a queue-length bound such as `Len(AtoB) <= 3`?
   - The message queues are unbounded sequences, so the state space is infinite. The bound makes the model finite; results hold only within it.

</details>

#### U3. Implementation versus specification refinement, nondeterminism and environment actions

**About 4 h** · **Target:** Explain

Topics: Implementation versus specification refinement; Nondeterminism and environment actions

Testing compares outputs; refinement compares behaviors. It is the only precise meaning of a protocol implementing a commit abstraction in this section.

**You can now**

- Explain implementation as behavior inclusion: every visible behavior below is a behavior above, with internal steps as stuttering.
- Place nondeterministic choices and environment actions (loss, crash, abort) in the spec, and say what a check omits when they are missing.
- Read a refinement claim such as `TPSpec => TC!TCSpec` and name which variables are hidden.

**Study**

1. [Lecture 8 part 2: how implementation works](https://lamport.azurewebsites.net/video/video8b.html) (TLA+ Video Course) - Full part (12:13): what it means for one specification to implement another.
2. [Lecture 10: refinement mappings](https://lamport.azurewebsites.net/video/video10a.html) (TLA+ Video Course) - Part 1 (19:53): the general meaning of implementation; continue to part 2 at https://lamport.azurewebsites.net/video/video10b.html (21:26) for refinement mappings.
3. [Lecture 15: Verification of distributed systems (IronFleet)](https://pdos.csail.mit.edu/6.824/notes/l-ironfleet.txt) (MIT 6.5840 - Verification Lecture and Final Project) - Refinement through Inductive invariants sections: IronFleet-style refinement, externally visible events, stuttering, transitivity, and why a wrong middle layer proves nothing.

**Focus**

- Refinement is behavior inclusion on visible state. The low-level spec may take internal steps; above, they look like stuttering.
- High-level nondeterminism is implementation freedom. TCommit lets a prepared transaction commit or abort; TwoPhase may always abort and still refine it.
- The environment is part of the model. TwoPhase has `RMChooseToAbort` and spontaneous `TMAbort`; AB has `LoseMsg`. A missing environment action is an unchecked assumption.
- Refinement is transitive but garbage-preserving: the IronFleet lecture shows a wrong protocol layer gets stuck at the next refinement step, not excused by the one below.

**Reproduce:** Closed-book, explain the claim `TPSpec => TC!TCSpec`: what it says, which variables the TCommit side sees (`rmState` only), and why always-abort still refines the abstract commit.

**Traps**

- Proving impl-to-protocol and stopping. The IronFleet lecture's election-restriction question shows the stuck proof appears at the protocol-to-spec step.
- Calling a nondeterministic spec random. Nondeterminism is arbitrary choice explored by the checker, not a distribution the system samples.
- Hiding state the property reads. `tmPrepared` and `msgs` can hide because `TCConsistent` only reads `rmState`; hiding `rmState` itself would void the claim.

**Practice**

- [TLA+ Examples: read the TwoPhase-to-TCommit refinement](https://github.com/tlaplus/Examples/blob/6a7b26a31c1a6aeec789b455e9bbfa3b3ad2728f/specifications/transaction_commit/TwoPhase.tla) - The `TC == INSTANCE TCommit` line and `THEOREM TPSpec => TC!TCSpec`; list which variables each side reads. Pair with the AB `Spec => ABS!Spec` theorem in video9b.zip; both hide channel and protocol state the abstract side never reads.

**Stop when:** You state two refinement claims from memory (TwoPhase-to-TCommit, AB-to-ABSpec), name the hidden variables in each, and place one environment action per spec.

<details>
<summary>Self-test</summary>

1. What does `TPSpec => TC!TCSpec` assert?
   - Every behavior of the TwoPhase commit protocol is a behavior of the abstract Transaction Commit spec: 2PC implements commit, including the `TCConsistent` invariant that no two RMs decide in conflict.
2. TwoPhase refines TCommit. May a conforming implementation abort every transaction?
   - Yes. TCommit's `Decide` permits abort while nothing committed, so always-abort behaviors satisfy the abstract spec. Refinement permits useless but safe implementations.
3. In the IronFleet lecture, where does a wrong protocol layer get caught?
   - At the protocol-to-spec refinement step. Impl-to-protocol may still prove; the wrong middle layer gets stuck against the trusted top spec.
4. Why is the proof untrusted but the specification and the checker trusted?
   - The checker mechanically re-verifies the proof, so a bad proof is caught. Nothing re-verifies the spec, so a wrong spec certifies a wrong system.

</details>

#### U4. Finite model bounds, TLC checking, counterexample traces and a two-phase commit specification

**About 6 h** · **Target:** Implement

Topics: Finite model bounds and state explosion; TLC safety and liveness checking; Counterexample trace interpretation; Two-phase commit specification

A commit protocol is where abstract checking meets the track's core. This safety-only model permits the blocking wait from the earlier unit on two-phase commit states, durable prepare, coordinator failure and in-doubt recovery; coordinator crash, persistence and recovery actions are left out, so add them before making recovery claims.

**You can now**

- Bound a protocol model (managers, values, queue lengths) and run TLC to a stated state count.
- Read a TLC counterexample trace action by action and map each step to the spec action that enabled it.
- Plant a bug, capture the first meaningful violating trace, and fix the spec or the invariant.

**Study**

1. [Lecture 5: Transaction Commit](https://lamport.azurewebsites.net/video/video5.html) (TLA+ Video Course) - Full lecture (24:39): the abstract commit spec TCommit, including `TCConsistent` (no two RMs in conflict) and mathematical functions.
2. [Lecture 6: Two-Phase Commit](https://lamport.azurewebsites.net/video/video6.html) (TLA+ Video Course) - Full lecture (21:22): how commitment is achieved; records in TLA+ and more TLC.
3. [Lecture 7: Paxos Commit](https://lamport.azurewebsites.net/video/video7.html) (TLA+ Video Course) - Full lecture (19:46): a fault-tolerant commit algorithm; set construction and combination operations. Depth: Watch for vocabulary, not for a second implementation. Your checked model in this unit is TwoPhase, not PaxosCommit.
4. [TwoPhase.tla and TCommit.tla with TwoPhase.cfg](https://github.com/tlaplus/Examples/tree/6a7b26a31c1a6aeec789b455e9bbfa3b3ad2728f/specifications/transaction_commit) (TLA+ Examples) - TwoPhase.tla (variables `rmState`, `tmState`, `tmPrepared`, `msgs`; actions `TMRcvPrepared`, `TMCommit`, `TMAbort`, `RMPrepare`, `RMChooseToAbort`, `RMRcvCommitMsg`, `RMRcvAbortMsg`; `TPSpec == TPInit /\ [][TPNext]_<<rmState, tmState, tmPrepared, msgs>>`) with TwoPhase.cfg (`RM = {r1, r2, r3}`, invariant `TPTypeOK`, `SPECIFICATION TPSpec`). Depth: Do not open `specifications/TwoPhase/` elsewhere in the repo: it is a hardware handshake, not transaction commit.

**Focus**

- The header states the scope honestly: safety only, what is allowed. Liveness (what must happen) is not specified, so a run that commits nothing violates nothing.
- Messages are never removed from `msgs`. Receipt is existence in the set, so duplicates are allowed and loss is modeled as never receiving.
- `TMCommit` needs `tmState = init` and `tmPrepared = RM`; `TMAbort` needs only `tmState = init`. A prepared RM has no action of its own that decides, so it waits for a TM message the safety-only spec never forces to arrive: that is the blocking window.
- The unchanged configuration checks `TPTypeOK` for three resource managers. The module also states `THEOREM TPSpec => TC!TCSpec`; to check it, define an alias for `TC!TCSpec` and select that alias as a temporal property in the model.

**Reproduce:** From the Examples directory, run TLC on TwoPhase.cfg unchanged and get `1146 states generated, 288 distinct states found` at depth 11 with `No error has been found`. Then assert a false invariant and read the violating trace to the committing action.

**Traps**

- Assuming assigned constants make the run finite. Missing assignments are configuration errors; assigned constants still leave counters and queues unbounded, so bound them and record every restriction with the result.
- Reading `No error has been found` as proved. It covers three resource managers and the configured invariant only; the file notes a separate six-RM check with 50816 reachable states.
- Confusing `specifications/TwoPhase/` with `specifications/transaction_commit/TwoPhase.tla`. The first is a hardware handshake and its model needs the TLAPS module to parse.

**Practice**

- [TLA+ Examples: check TwoPhase.tla with TLC](https://github.com/tlaplus/Examples/blob/6a7b26a31c1a6aeec789b455e9bbfa3b3ad2728f/specifications/transaction_commit/TwoPhase.tla) - With `TLA2TOOLS` set to your tools jar, run `java -cp "$TLA2TOOLS" tlc2.TLC -workers 1 -config TwoPhase.cfg TwoPhase` from `specifications/transaction_commit/`; with TLC 2.19 expect 1146 generated and 288 distinct states. Then add a false invariant such as `tmState /= "committed"`, keep the first violating trace, and map every step to its action before deleting it.
- [TLA+ Video Course Lecture 6: TwoPhase Commit model](https://lamport.azurewebsites.net/video/video6.html) - Rebuild the lecture's commit model in the Toolbox and check it. Use the lecture for the construction habit; the Examples run above is the exact-numbers check.

**Stop when:** An unchanged Examples run reproduces 288 distinct states, and a planted false invariant yields a trace you can map action by action to the committing step.

<details>
<summary>Self-test</summary>

1. What does `TMCommit` require, and what does `TMAbort` require?
   - Commit needs `tmState = init` and `tmPrepared = RM`, every manager prepared. Abort needs only `tmState = init`: the TM may abort spontaneously at any time before committing.
2. A prepared RM never receives a Commit or Abort message. Which property is violated?
   - None in this spec. It specifies safety only; the blocking wait is allowed. The violation would be against an unstated liveness claim.
3. What does a TLC trace line `State 4: <RMPrepare ...>` tell you?
   - State 4 is the state reached by applying `RMPrepare` to State 3. The source range names that action, and the `/\ var = value` lines below show the resulting state.
4. Your run reports 288 distinct states for three RMs. What changes with six RMs, and what stays the same?
   - The state count grows (the file notes 50816 reachable states); the spec text and the invariant are unchanged. Each bound is its own result.
5. What is `TCConsistent`, and which spec states it?
   - No two RMs in conflicting decisions (`aborted` versus `committed`), stated in TCommit.tla and asserted as `THEOREM TCSpec => [](TCTypeOK /\ TCConsistent)`.

</details>

#### U5. A replicated-log or workflow specification

**About 5 h** · **Target:** Implement

Topics: Replicated-log or workflow specification

The capstone log is the largest thing you will specify in this track. This unit turns the lecture examples into your own log's first checked model.

**You can now**

- Write a state-machine spec of the capstone replicated log: variables for log, epoch, commit index and messages.
- State its safety invariant (committed entries are never replaced) and its liveness assumption (what the network must eventually do).
- Run TLC after every extension and keep the first meaningful counterexample, not just the final passing model.

**Study**

1. [Lectures 5 and 6: the commit-model repertoire](https://lamport.azurewebsites.net/video/video5.html) (TLA+ Video Course) - Lecture 5 (24:39) plus lecture 6 at https://lamport.azurewebsites.net/video/video6.html (21:22): abstract commit, then how 2PC achieves it; reuse their variable discipline (manager state, coordinator state, message set) for log, epoch and commit-index variables.
2. [PaxosCommit.tla for depth](https://github.com/tlaplus/Examples/tree/6a7b26a31c1a6aeec789b455e9bbfa3b3ad2728f/specifications/transaction_commit) (TLA+ Examples) - `PaxosCommit.tla` with its `.cfg`: read how a fault-tolerant commit spec adds ballot state beside the commit state. Depth: Read only. Your checked model here is your own reduced log, not PaxosCommit.
3. [How Amazon Web Services Uses Formal Methods](https://cdn.amazon.science/67/f9/92733d574c11ba1a11bd08bfb8ae/how-amazon-web-services-uses-formal-methods.pdf) (How Amazon Web Services Uses Formal Methods (Newcombe et al., 2015)) - The full paper (CACM 58(4), pp. 66-73): which systems got models, the per-component spec sizes and bug counts in the findings table, and the design-tool framing. Depth: Treat the line counts and bug counts as effort anecdotes from one organization, not productivity benchmarks. Your obligation is TLC bounds on your own model.
4. [Replicated Log and Stream Processor: protocol specification](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-2/replicated-log-stream-processor.md) (Replicated Log and Stream Processor - Final Capstone) - Protocol and state-machine specification and invariants deliverable: the spec contract your model must satisfy.

**Focus**

- Reduce before you specify. Model one partition's log with a fixed manager set first; multi-partition and membership changes are later extensions, each with its own TLC run.
- Committed means what your spec says it means. Name the commit point (majority acknowledgment, leader decision) as an action, not as prose.
- Every extension re-runs TLC. A passing run before the extension says nothing about the model after it.
- Keep the first meaningful counterexample per extension. A trace that changed the spec is evidence; a final green run alone is not.

**Reproduce:** From a blank file, write Init and Next for a single-decree commit with two resource managers, bound it, and run TLC to a stated distinct-state count with `No error has been found`.

**Traps**

- Specifying the whole capstone at once. Start with one partition and a fixed manager set, bound log length, values, epochs and messages too, and report completion and state counts for that exact model rather than promising a runtime.
- Leaving the network's faults unstated. A persistent unordered message set with repeated receipt already represents loss, duplication and reordering, as TwoPhase does; a FIFO queue needs explicit fault actions.
- Polishing away the failing trace. The first counterexample is the unit's main artifact; keep it with the bound that produced it.

**Practice**

- The section mini-project covers this: the protocol and invariant specification of your replicated log, with TLC bounds and retained counterexamples.

**Stop when:** Your reduced log spec checks green at a stated bound, and each extension has its own run plus its first meaningful counterexample on file.

<details>
<summary>Self-test</summary>

1. What belongs in the first version of your log spec?
   - One partition, a fixed manager set, log plus epoch plus commit-index variables, append and commit actions, and the committed-entries-preserved invariant. Everything else is a later extension with its own run.
2. Why run TLC again after every extension?
   - Each extension changes the state space. A green run on the smaller model does not cover the larger one.
3. What does the AWS paper's findings table actually show?
   - Per-component spec sizes (for example an 804-line PlusCal model) beside the bugs each model found (two bugs for that one). It shows models find bugs; it does not set a bugs-per-line rate.
4. Your spec passes with three managers. What may you claim about five?
   - Nothing. A larger bound is a new check; report each bound with its own count.

</details>

#### U6. State-based and operation-based CRDT requirements and one CRDT implementation

**About 5 h** · **Target:** Derive + Implement

Topics: State-based CRDT semilattice requirements; Operation-based CRDT delivery requirements; One state-based or operation-based CRDT implementation

CRDTs give sufficient algebraic and delivery conditions for convergence without consensus. Derive the conditions for the particular type instead of treating one delivery contract as necessary for every design.

**You can now**

- State the state-based convergence conditions (a join-semilattice merge, inflationary updates and eventual dissemination) and a sufficient operation-based contract (reliable delivery, each operation applied once, concurrent operations commuting).
- Prove the operation-based map CRDT converges and sketch its multi-value variant.
- Optionally implement one CRDT (G-Counter or OR-Set) with merge-law and convergence tests.

**Study**

1. [Shapiro et al. 2011, Sections 1 to 3](https://dsf.berkeley.edu/cs286/papers/crdt-tr2011.pdf) (A Comprehensive Study of Convergent and Commutative Replicated Data Types (Shapiro et al., 2011)) - Sections 1 to 3: state-based and operation-based definitions, the join-semilattice merge laws and the delivery conditions, plus one example type for your implementation. Depth: Read one example type only (G-Counter or OR-Set), not the whole catalog.
2. [Section 8.1: collaboration and conflict resolution](https://www.cl.cam.ac.uk/teaching/2122/ConcDisSys/dist-sys-notes.pdf) (Cambridge Concurrent and Distributed Systems Notes (Kleppmann) - CRDTs and Collaboration) - Section 8.1 (pp. 78-81): the operation-based map on Slides 144-145, Exercises 21 and 22 on p. 80, and the state-based map with its merge $`\sqcup`$ and the merge laws on Slides 146-147, p. 81.
3. [HLD Handbook: CRDTs chapter](https://github.com/handbook-academy/engineering-handbook/blob/d177ae2b48b4dfebf8ad0ddae51a345b3e17d99e/content/hld/part-3-distributed-systems-theory/05-crdts.md) (HLD Handbook - CRDTs, Multi-Region and Architecture Trade-offs) - State-based (CvRDT) merge as least upper bound with the G-Counter elementwise-max code, op-based (CmRDT) over causal broadcast with the op-based OR-Set tag diagram, and the tombstone and metadata cost section. Depth: Use the chapter for implementation texture (incremental-state CRDTs, reported Automerge figures). The requirements come from Shapiro and Kleppmann, not from here.

**Focus**

- G-Counter convergence uses a join-semilattice merge, inflationary increments to each replica's own component, stable replica identities and eventual dissemination of every update. Elementwise max is commutative, associative and idempotent, but the laws alone are not the whole argument.
- A common sufficient operation-based contract is reliable causal delivery, each operation applied once, and concurrent operations commuting. Some types, including the notes' timestamped map, tolerate any order and repeats; derive the contract for your type.
- Unique tags decide remove semantics. An OR-Set remove only removes observed tags, so a concurrent add with a fresh tag survives.
- Tombstones and identifiers are the price. Removals keep metadata until late arrivals can no longer resurrect removed state; state the membership and causal-stability assumptions that allow collection, or budget for unbounded retention.

**Reproduce:** Closed-book, merge `{'A': 3}` with `{'B': 2, 'C': 5}` by elementwise max to `{'A': 3, 'B': 2, 'C': 5}` with value $`3 + 2 + 5 = 10`$, and state which merge law covers reorder, merge-of-merges and redelivery.

**Traps**

- Calling a lossy state exchange op-based. State merge recovers from a lost message only because a later exchange carries the same state; operation delivery needs the broadcast guarantees the type requires.
- Reading the HLD op-based section as two delivery modes. It states one requirement: causal order with duplicate suppression so each operation applies once. The transport alone does not give the second half.
- Forgetting the tombstone set in a 2P-Set-style remove. A removed element re-added without fresh identity resurrects or vanishes depending on which replica you ask.

**Practice**

- [Kleppmann notes Exercises 21 and 22: prove the operation-based map converges; sketch the multi-value variant](https://www.cl.cam.ac.uk/teaching/2122/ConcDisSys/dist-sys-notes.pdf) - Section 8.1 (pp. 78-80): Exercise 21 (prove strong eventual consistency from reliable broadcast plus commutativity) and Exercise 22 (multi-value register pseudocode). Write the Exercise 21 proof from the two premises only: every operation reaches every non-crashed replica, and concurrent operations commute.
- [Shapiro report Section 3.1.2: implement the G-Counter with merge-law checks](https://dsf.berkeley.edu/cs286/papers/crdt-tr2011.pdf) - Section 3.1.2, Specification 6 (printed pp. 14-15): increment, value (sum) and elementwise-max merge, with commutativity, associativity and idempotence checks; Section 2.3.1 for the semilattice and dissemination assumptions. Optional implementation. Show a planted bug (for example max replaced by one-sided union) failing exactly one law.

**Stop when:** You prove the map's convergence from Exercise 21's premises without notes and explain both replication styles' assumptions. If you build the optional G-Counter, its merge-law and convergence tests pass and you state its dissemination contract.

<details>
<summary>Self-test</summary>

1. State the three merge laws and the fault each one absorbs.
   - Commutative (reorder), associative (regrouping merges of merges), idempotent (duplication and redelivery). They make merge order and repetition irrelevant; convergence also needs every update to reach every replica eventually.
2. Why does the operation-based map need reliable broadcast while the state-based map works over best-effort broadcast?
   - Repeated state merges are harmless, and a lost message is repaired by a later exchange that carries the same state. The operation-based map needs every operation delivered eventually; its timestamped operations then tolerate reordering and repeats.
3. Two replicas hold `{'A': 3}` and `{'B': 2, 'C': 5}`. What is the merged state and its value?
   - `{'A': 3, 'B': 2, 'C': 5}` with value $`3 + 2 + 5 = 10`$: elementwise max, then the sum.
4. A remove and a concurrent add of `x` race in an OR-Set. Does `x` survive?
   - Yes. The remove carries only observed tags; the concurrent add uses a fresh tag the remove never saw, so the merge keeps the new tagged entry.
5. What does Exercise 22 change relative to the last-writer-wins map?
   - Concurrent updates for a key keep all values (multi-value register semantics) instead of only the greatest timestamp; the reader returns the set.

</details>

#### U7. Property-based state-machine testing with crash and restart, and deterministic schedule replay

**About 4 h** · **Target:** Implement

Topics: Property-based state-machine testing; Deterministic schedule exploration

TLC checks a model; property tests check the code. The Programming unit on property, metamorphic and differential testing with shrinking built a `DatabaseComparison` machine, and the Systems unit on distributed histories and deterministic failure simulation built a seeded fault scheduler. Here the new work is crash and restart with durable versus volatile state, and shrinking a distributed failure.

**You can now**

- Extend a `RuleBasedStateMachine` for your log with crash and restart rules that separate durable from volatile state, checked against a reference model.
- Plant a nontrivial recovery or ownership bug, keep the shrunk failing program, and explain what the shrinker removed.
- Replay a failing schedule from its saved schedule and seed, and state which nondeterminism your harness does not control.

**Study**

1. [Rule-based state machines](https://hypothesis.readthedocs.io/en/latest/stateful.html) (Hypothesis - Stateful Testing) - The `consumes`, `precondition` and `invariant` sections, with the `DatabaseComparison` machine and its shrinking example as review (page read 2026-10-15). Depth: Review the machine you built for the Programming unit; read the sections on `consumes`, preconditions and invariants closely.
2. [Test settings for state machines](https://hypothesis.readthedocs.io/en/latest/stateful.html) (Hypothesis - Stateful Testing) - The `TestCase.settings = settings(max_examples=50, stateful_step_count=100)` example: fewer examples with longer programs when hunting ordering bugs.
3. [Simulation testing section](https://www.foundationdb.org/files/fdb-paper.pdf) (FoundationDB: A Distributed Unbundled Transactional Key Value Store (Zhou et al., 2021)) - The deterministic simulation framework: single-threaded deterministic execution, fault injection and seed replay as the model for your own scheduler. Depth: Read as design to copy at learner scale, not as code to import. A seeded fault injector around ordinary local processes is fault injection, not deterministic simulation, unless your harness controls every source of nondeterminism.
4. [Chapter 9: Formal Methods and Randomized Testing](https://dataintensive.net/) (DDIA 2e - Chapters 9, 10 and 14 Review) - Printed pp. 384-387: property-based testing, fuzzing and deterministic simulation testing as the empirical half beside proofs, and why model and implementation can drift apart.

**Focus**

- `Bundle`s build the universe of values rules share. Generating fresh keys per rule rarely collides; drawing from a bundle forces the overwrites and deletes that find bugs.
- The invariant runs after every step. It compares system against model on the same operation history, so the first failing step is already localized.
- Shrinking deletes what does not matter. The docs' five-step program (new key, new value, save, delete, check) is the minimal story: keep it, it is the regression test.
- A seed replays a run only when the harness controls every source of nondeterminism and the code, inputs and configuration are fixed. Save the generated schedule and the shrunk failing test with the seed.

**Reproduce:** Closed-book, add crash and restart rules to a key-value log machine that keeps durable and volatile state apart, with an invariant that every acknowledged durable write survives restart. Plant a bug that drops an acknowledged write on restart and paste the shrunk failing program.

**Traps**

- Confusing rule assertions with invariants. Use rule assertions for operation-specific results and invariants for properties that hold after every step; both cover only the generated executions, not every interleaving.
- Using `assume` to skip inapplicable states. Sparse assumptions starve the generator; `precondition` filters rules before generation instead.
- Keeping the passing run and deleting the planted-bug demo. The bug demo is what proves the machine can catch its fault class.

**Practice**

- [Hypothesis stateful testing: crash and restart rules for your log harness](https://hypothesis.readthedocs.io/en/latest/stateful.html) - Extend the machine with crash and restart rules using `Bundle`, `consumes`, `precondition` and `invariant`, plant a one-line recovery or ownership bug, and keep the shrunk failing program. Use Hypothesis 6.169.1 and record the version with the trace.
- [FoundationDB paper: sketch your deterministic scheduler](https://www.foundationdb.org/files/fdb-paper.pdf) - Simulation-testing section: implement delay, drop, duplicate, reorder and crash operations behind a fixed seed in your own log harness. Copy the pattern (seeded RNG, replayable schedule), not the system. The scheduler itself is section mini-project infrastructure.

**Stop when:** Your machine passes clean, catches a planted recovery bug with a shrunk program you can explain line by line, and a failing schedule replays from its saved schedule and seed.

<details>
<summary>Self-test</summary>

1. Why do the docs use `Bundle`s for keys and values instead of generating fresh ones per rule?
   - Bundles build a shared universe, so later rules reuse earlier values. Fresh generation rarely collides, which hides the overwrite and delete interactions that find bugs.
2. What does the shrinker output for the planted restart bug, and why keep it?
   - The shortest program that still loses an acknowledged write: the few writes, the crash and the restart that matter. It is the regression test: short, deterministic and readable.
3. When should `stateful_step_count` go up and `max_examples` go down?
   - When hunting ordering bugs that need long setups: longer programs per example, fewer examples overall. The docs' example doubles steps to 100 and halves examples to 50.
4. A seeded schedule fails once and passes on rerun with a new seed. What do you keep?
   - The failing seed, the full generated schedule and the shrunk failing test, with code and configuration versions. A seed alone replays only if the harness controls every source of nondeterminism.

</details>

#### U8. Operation-history normalization and linearizability checker scope

**About 4 h** · **Target:** Implement

Topics: Operation-history normalization; Linearizability checker scope

A checker verdict is only as good as the history it reads. Normalization turns ambiguous client observations into the exact object the model reasons about.

**You can now**

- Record operation histories with invocation and completion times, process ids, function names and return values.
- Normalize client observations into a checker-ready history and run a single-register linearizability check on fixed histories.
- State the checker's scope: what a clean run establishes and what it cannot prove.

**Study**

1. [Consistency Models map: histories and operations](https://jepsen.io/consistency/models) (Jepsen - Consistency Models and Analyses) - Systems, Processes, Operations and Invocation and Completion Times sections: the operation as invoke/ok pairs with function names and values, and the single-object hierarchy (linearizable implies sequential implies causal). Depth: Read the map for vocabulary and the hierarchy arrows. The availability coloring is Jepsen's summary of known results, not a measurement.
2. [Chapter 10: Linearizability](https://dataintensive.net/) (DDIA 2e - Chapters 9, 10 and 14 Review) - Printed pp. 402-410: what makes a system linearizable, the recency guarantee and history classification. Depth: Review only: rebuild from the earlier section on replication, consistency and convergence, and point back to its units by title instead of re-reading at full depth.

**Focus**

- Record ordered invocations with `:ok`, definite `:fail` or indeterminate `:info` outcomes, keeping pending operations and process incarnations. Event order gives precedence without numeric timestamps; never turn an ambiguous timeout into a definite failure.
- Normalization resolves ambiguity before checking: failed and crashed operations become explicit outcomes; retries become separate invocations with their identity preserved.
- This exercise uses Knossos with a single-register model, so its verdict covers that register only. Multi-object checks need an appropriate model and complete transaction observations, in Knossos or a transactional checker such as Elle.
- A clean run is bounded evidence. It says these histories show no violation of this model; it is not a proof of the system.

**Reproduce:** Closed-book, write the two fixed histories (write-then-read returning the written value; write-2-then-read-returning-1) and the expected Knossos verdicts (`valid? true`; `valid? false`).

**Traps**

- Skipping input validation. Check event order, process identities and invocation-completion pairing before calling Knossos; its analysis takes an ordinary event sequence, while Elle's history-object requirement is a different API contract.
- Checking a multi-key workload with a single-register model. The model verdict says nothing about the keys it never saw.
- Presenting a clean run as serializability. A linearizability check on one register cannot establish a multi-object isolation claim.

**Practice**

- [Knossos: check two fixed single-register histories](https://github.com/jepsen-io/knossos) - With `MAELSTROM` set to your Maelstrom 0.2.4 directory, call `knossos.core/analysis` with `(knossos.model/register 0)` and an ordered event vector from a `check.clj` script run by `java -cp "$MAELSTROM/lib/*" clojure.main check.clj`: the write-then-read history (expect `valid? true`) and the stale-read history (expect `valid? false`). Record the Maelstrom version beside both verdicts; describe only what these two histories check.

**Stop when:** Both fixed histories return the predicted verdicts, and you can state the object, the model and the completeness limit of each run in one sentence.

<details>
<summary>Self-test</summary>

1. What four fields does each history entry need, and why?
   - Process, type (`:invoke`, `:ok`, `:fail` or `:info`), function and value. The checker needs per-process order and invocation-completion pairing; `:info` marks an operation that may or may not have taken effect.
2. Write 2 completes, then a read returns 1. What is the verdict under the register model?
   - Invalid, because write 2 completes before the read is invoked and no write intervenes. A read that overlaps the write could legally return the old value, even if it completes later.
3. Why must retries keep their identity through normalization?
   - A retried write that ran twice is one logical operation with two attempts. Dropping the link double-counts effects or hides the duplicate the checker should see.
4. Knossos reports valid on your history. What may you claim?
   - That this history shows no single-register linearizability violation. Not that the system is linearizable, and nothing about other objects or longer histories.

</details>

#### U9. Jepsen generator, client, nemesis and checker roles and a fault and workload coverage matrix

**About 4 h** · **Target:** Explain + Implement

Topics: Jepsen generator, client, nemesis and checker roles; Fault-model and workload coverage matrix

A fault campaign without named roles is a pile of scripts. The four roles turn testing under faults into a repeatable design with a checker verdict per cell.

**You can now**

- Name the four Jepsen roles (generator, client, nemesis, checker) and what each produces or consumes.
- Run an Elle `rw-register` check on two fixed transaction histories and read the anomaly types.
- Draft a fault and workload coverage matrix: faults down one side, workloads across the top, checker per cell.

**Study**

1. [Jepsen framework roles at v0.3.14](https://github.com/jepsen-io/jepsen/tree/v0.3.14/jepsen/src/jepsen) (Jepsen - Consistency Models and Analyses) - `client.clj` (the `Client` protocol), `nemesis.clj` (the `Nemesis` protocol), `checker.clj`, and `generator/interpreter.clj` (interprets pure-generator operations, spawns worker threads, records the history).
2. [Elle: Inferring Isolation Anomalies (Kingsbury and Alvaro)](https://arxiv.org/abs/2003.10554) (Elle: Inferring Isolation Anomalies from Experimental Observations (Kingsbury and Alvaro)) - Abstract and Sections 1-2 (arXiv v1, 23 March 2020): black-box isolation checking from client observations, Adya-style dependency-graph inference, the soundness claim and the completeness requirement on histories. Depth: Elle infers several anomaly classes from a supported workload's observations; predicate anomalies are outside the paper's scope. State the workload, the recoverability assumptions and the checked anomaly set. A clean run is not a proof.

**Focus**

- The generator produces operations; clients execute theirs against the system and the nemesis executes fault operations; the interpreter records both in one history, and the checker reads that history. Histories, not logs, are the handoff.
- Elle infers dependencies from what reads observed. Unique register values reveal some write-read dependencies but rarely a full version order; append-only lists expose more, so workload design is checker design.
- Anomaly types name the violation: `:G1a` is a committed transaction reading a version written by a transaction known to have aborted. An indeterminate write is not an aborted one. Read the type before the graph.
- The matrix is the coverage claim. An empty cell is an untested combination; say so instead of letting the campaign imply it.

**Reproduce:** Closed-book, write the two Elle histories (committed-write-then-read; aborted-write-then-read) and the expected verdicts (`valid? true`; `valid? false` with `:G1a`), and sketch a 3-by-3 fault and workload matrix with a checker per cell.

**Traps**

- Leaving AWT initialization to chance on a headless machine. For a headless run, set `-Djava.awt.headless=true` explicitly; failures without it depend on the environment.
- Passing a plain vector as the history. Elle asserts on a real history object (`jepsen.history/history`); the not-history error is your bug, not a system result.
- Calling `elle.core/check` with bare model options on a hand-built history. It fails with an API error, not a verdict; use the model-specific entry (`elle.rw-register/check`) instead.

**Practice**

- [Elle rw-register check on two fixed histories](https://arxiv.org/abs/2003.10554) - With Elle 0.2.2 from Maelstrom 0.2.4, call `elle.rw-register/check` on `jepsen.history/history` objects for the two fixed histories: committed write then read (expect `valid? true`) and definitely aborted write then read (expect `valid? false` with `:G1a`; other diagnostics vary by version). For a headless run, set `-Djava.awt.headless=true`. Keep both verdicts; the matrix in Reproduce gets one checker per cell from this pattern.

**Stop when:** Both Elle histories return the predicted verdicts with the anomaly type read correctly, and your matrix names a checker for every filled cell and marks the empty ones.

<details>
<summary>Self-test</summary>

1. What does each Jepsen role hand to the next?
   - The generator hands operations to clients and the nemesis; clients run theirs against the system, the nemesis runs fault operations, and the interpreter records both as the history. The checker reads that history, never the live system.
2. What is a `:G1a` anomaly in one sentence?
   - A committed transaction read a version written by a transaction known to have aborted. The fixed history uses a definite `:fail` write followed by a read returning its value; an indeterminate write would not qualify.
3. Why does Elle prefer list-append workloads over read-write registers?
   - Appended lists reveal the order of versions, so Elle can infer far more dependencies. Unique register values reveal which write a read saw, but rarely the full version order.
4. Your matrix has an empty partition-plus-snapshot-isolation cell. What do you report?
   - An untested combination. The campaign covers only filled cells; the empty one is a stated gap, not a pass.

</details>

#### U10. Real-system architecture reconstruction, path tracing and control-plane versus data-plane state

**About 5 h** · **Target:** Explain

Topics: System architecture reconstruction; Protocol, storage and recovery path tracing; Control-plane versus data-plane state

Extension work aims at a system you did not write. Reconstruction turns a paper's boxes into named state and paths, which is the only form you can reason about under faults.

**You can now**

- Reconstruct an unfamiliar subsystem's protocol, storage, replication, consistency, failure, security and operations paths from its paper.
- Trace one request type end to end and name the state each layer keeps.
- Separate control-plane from data-plane state and mark every control-plane dependency on the data path.

**Study**

1. [FoundationDB paper Sections 1 to 3: unbundled architecture](https://www.foundationdb.org/files/fdb-paper.pdf) (FoundationDB: A Distributed Unbundled Transactional Key Value Store (Zhou et al., 2021)) - Sections 1 to 3: unbundled layers over a stateless transaction core, transaction management, replication and recovery with log servers and coarse checkpoints.
2. [Lecture #19: Snowflake and disaggregated storage](https://15721.courses.cs.cmu.edu/spring2024/schedule.html) (CMU 15-721 - Selected Advanced Database Systems Units) - Lecture #19 (System Analysis: Snowflake): the Snowflake elastic warehouse paper and the disaggregated-storage engine paper; trace protocol, storage, replication, consistency, failure and operations paths. Depth: Read one lecture group only (#17-#22 system analyses, here #19). Papers are vocabulary and comparison material; there is no runnable project.
3. [HLD Handbook: disaster recovery and failover planes](https://github.com/handbook-academy/engineering-handbook/blob/d177ae2b48b4dfebf8ad0ddae51a345b3e17d99e/content/hld/part-5-architecture-patterns/08-multi-region-architecture.md) (HLD Handbook - CRDTs, Multi-Region and Architecture Trade-offs) - The RTO and RPO spectrum section (backup-and-restore to active-active with cost tiers) and the failover insight: control-plane-dependent failover is vulnerable to the outage it answers, so prefer data-plane operations. Depth: Treat the RTO and RPO tiers and the cost multipliers as reported figures for reasoning, never as targets for your measurements.

**Focus**

- Reconstruct paths, not boxes. For one request type, follow it through protocol, storage, replication, consistency check, failure handling, security (authentication, authorization, tenant boundaries) and operations tooling.
- Separate control plane from data plane. Membership, failover triggers and config changes are control; reads, writes and replication traffic are data. An outage that breaks the first must not need it to survive.
- Name the state each plane keeps. If failover needs state the outage can destroy, the design has a circular dependency.
- Disaggregation moves the failure boundary. Authoritative data outlives a compute node, so replacement compute reuses shared storage and rebuilds only caches and query state; the shared store is still a failure domain with its own durability and recovery design.

**Reproduce:** Closed-book, sketch the request path of one system paper across protocol, storage, replication, consistency, failure, security and operations layers, marking every control-plane dependency on the data path.

**Traps**

- Drawing boxes without state. An architecture diagram that names no per-component state cannot answer what survives a crash.
- Treating a paper's cluster numbers as your targets. The Snowflake and FoundationDB figures describe their setups; your measurements need your own setup stated.
- Missing the circular dependency: a failover plan that calls the control plane it is failing over from.

**Practice**

- The section mini-project covers this: architecture reconstruction of the system you extend, with protocol, storage, recovery and security paths traced and control-plane versus data-plane state separated.

**Stop when:** You trace one unfamiliar system's request path across all seven layers from the paper, with control-plane dependencies marked and no paper number quoted as your own result.

<details>
<summary>Self-test</summary>

1. What seven paths does a reconstruction trace?
   - Protocol, storage, replication, consistency, failure, security and operations: what a request touches, where state lands, how replicas agree, which contract holds, what breaks it, who may do it and how operators see it.
2. Why must disaster failover prefer data-plane operations?
   - Control-plane operations (launching capacity, changing DNS, promoting replicas) can be impaired by the outage itself, as in the December 2021 AWS event the Handbook cites. Pre-provisioned capacity and pre-configured routing survive it.
3. What does disaggregated storage change about recovery?
   - Authoritative data outlives the compute node, so a replacement reuses shared storage and rebuilds only caches and in-flight query state. Losing the shared store is still its own failure, with its own durability and recovery design.
4. A paper reports sub-second failover. What do you need before citing it?
   - Its setup: cluster size, workload, failure type and what was measured. Without the setup it is a reported figure, not a claim about your system.

</details>

#### U11. Consistency, durability and delivery contract extraction and ML data-plane provenance closure

**About 4 h** · **Target:** Explain

Topics: Consistency, durability and delivery contract extraction; ML data-plane provenance closure

Extension work starts by writing down what the system promises today. An unwritten contract cannot be preserved, and a data plane without provenance cannot be retrained or deleted safely.

**You can now**

- Extract consistency, durability and delivery contracts with each claim's boundary and assumption stated.
- Derive provenance closure for one ML data path: which versioned inputs and transform versions each artifact depends on, and what deletion or retraining invalidates.
- Write the contract down so a history checker could accept or reject histories against it.

**Study**

1. [Chapters 9 and 10 review: uncertainty, consistency and consensus](https://dataintensive.net/) (DDIA 2e - Chapters 9, 10 and 14 Review) - Chapter 9 (printed pp. 345-400) on faults, clocks, leases and system models plus Chapter 10 (printed pp. 401-450) on linearizability, logical clocks and consensus; extract one contract sentence per guarantee with its assumption. Depth: Review only: rebuild from the earlier sections on time, identity, membership and failure; replication, consistency and convergence; and consensus, replicated logs and coordination. Point back to their units by title instead of re-reading at full depth.
2. [Chapter 13: Trust, but Verify](https://dataintensive.net/) (DDIA 2e - Chapters 9, 10 and 14 Review) - Printed p. 575: system models as assumptions, what fsync and memory-corruption assumptions buy, and why unlikely violations matter at scale. Depth: Read the pages around p. 575, not the whole chapter.
3. [HLD Handbook: feature stores and model serving](https://github.com/handbook-academy/engineering-handbook/blob/d177ae2b48b4dfebf8ad0ddae51a345b3e17d99e/content/hld/part-9-ai-ml-system-design/10-feature-stores-model-serving.md) (HLD Handbook - CRDTs, Multi-Region and Architecture Trade-offs) - Point-in-time correctness, the model registry section and the shadow-then-canary rollout: what each promises about versions, freshness and promotion. Depth: Use the chapter's reported numbers (throughput, latency budgets, drift thresholds) as worked-example figures, not as targets.
4. [HLD Handbook: data infrastructure freshness and metadata](https://github.com/handbook-academy/engineering-handbook/blob/d177ae2b48b4dfebf8ad0ddae51a345b3e17d99e/content/hld/part-9-ai-ml-system-design/14-data-infrastructure-for-ai.md) (HLD Handbook - CRDTs, Multi-Region and Architecture Trade-offs) - Freshness (CDC, dirty flag, TTL) and the metadata schema and ACL propagation sections: what freshness promise each mechanism carries.

**Focus**

- A contract names the guarantee, the boundary and the assumption. A bare `linearizable reads` label is not a contract; the path exceptions and the timing assumption beside it make it one.
- Provenance closure means every artifact resolves to versioned inputs plus the transform version. A feature value without its event timestamp and code version is not reproducible.
- Deletion propagates along the same edges as derivation. If training rows derive from raw events, deleting a user means re-deriving every downstream artifact or stating why not.
- Point-in-time correctness is the ML instance: reconstruct features as they were knowable at prediction time. Keep event time and availability time with versioned snapshots, so late arrivals and corrections cannot leak into historical features.

**Reproduce:** Closed-book, write a three-line contract for one store you built earlier (consistency, durability, delivery) with each line's boundary, plus the provenance chain from raw event to trained artifact for one feature.

**Traps**

- Copying a vendor consistency label as the contract. Labels need the path exceptions (stale reads, async replicas) written beside them.
- Recording the transform without its version. Re-running new code over old inputs is a different derivation with the same name.
- Treating the Handbook fraud exercise as a sizing result. Its numbers illustrate the design pressure (label delay); they do not size your pipeline.

**Practice**

- [HLD Handbook: fraud feature-store design exercise](https://github.com/handbook-academy/engineering-handbook/blob/d177ae2b48b4dfebf8ad0ddae51a345b3e17d99e/content/hld/part-9-ai-ml-system-design/10-feature-stores-model-serving.md) - Exercise: the fraud-detection stack (five features across batch and streaming, point-in-time correctness, shadow-then-canary); do it before opening the solution. Cover the solution after: compare its point-in-time mechanism (historical lookup with event time) and its page-worthy metric with yours.

**Stop when:** Your three-line contract for an earlier store names every boundary and assumption, and your one-feature provenance chain resolves to versioned inputs plus transform versions with deletion consequences stated.

<details>
<summary>Self-test</summary>

1. What three parts make one contract line?
   - The guarantee, its boundary (which paths and operations it covers), and the assumption it needs (clocks, quorums, fsync). A line missing any part cannot be checked.
2. Why must a chargeback feature use the transaction timestamp, not the training-job timestamp?
   - Point-in-time correctness: the feature may use only chargebacks known before the transaction, so filter on when each resolution became available, not just its event time. The job timestamp leaks future resolutions into training.
3. A user deletes their raw events. What does provenance closure require?
   - Every derived artifact (features, labels, models, indexes) is identified and re-derived or explicitly excluded, because derivation edges are also deletion edges.
4. DDIA's `Trust, but Verify` calls system models assumptions. What follows for your contract?
   - Each assumption (fsync persists, memory is not corrupted) is a stated risk with a likelihood, not a fact. The contract says what you assume and what would break it.

</details>

#### U12. Geo-replication assumptions, storage disaggregation and a geo-replication design comparison

**About 4 h** · **Target:** Explain + Derive

Topics: Geo-replication latency and failure assumptions; Storage disaggregation trade-offs; One geo-replication design comparison

Your extension will run in one region, but its design must say what breaks across regions. Light speed and residency law are the two constraints no mechanism removes.

**You can now**

- State the cross-region latency terms an acknowledgment contract requires and the failure assumptions (region loss, residency law) for a design.
- Explain storage disaggregation: what moves where, and how recovery and scaling change.
- Compare two geo-replication designs on workload, failure, consistency, cost and evolution as preparation for the three-architecture comparison in the defense unit.

**Study**

1. [HLD Handbook: multi-region architecture](https://github.com/handbook-academy/engineering-handbook/blob/d177ae2b48b4dfebf8ad0ddae51a345b3e17d99e/content/hld/part-5-architecture-patterns/08-multi-region-architecture.md) (HLD Handbook - CRDTs, Multi-Region and Architecture Trade-offs) - Why multi-region (failures, latency, law) with the speed-of-light figures; the RTO and RPO spectrum (backup-and-restore to active-active); active-passive mechanics; active-active with the conflict-resolution spectrum; the global strong-consistency database survey (Spanner, CockroachDB, DynamoDB Global Tables MRSC, Aurora, Cosmos DB); the Cloudflare per-object-singleton alternative. Depth: Treat the outage anecdotes, the RTO and RPO tiers and the cost multipliers as reported figures. Your comparison uses them as inputs, never as your own measured results.
2. [Lecture #19: Snowflake (disaggregated storage)](https://15721.courses.cs.cmu.edu/spring2024/schedule.html) (CMU 15-721 - Selected Advanced Database Systems Units) - Lecture #19 papers: the Snowflake elastic warehouse paper and the disaggregated-storage engine paper; read for what compute and storage separation changes about scaling and recovery. Depth: Same lecture group as the reconstruction unit (#17-#22); one group only. Papers inform the comparison; there is no runnable artifact.

**Focus**

- If the acknowledgment contract requires durable agreement with a remote region, the write waits for that communication. Strong consistency alone does not make every write wait for every region; state the quorum placement and the region-loss guarantee.
- Residency is a legal invariant, not a latency optimization. EU data staying in the EU constrains placement before any performance argument.
- Active-active pays conflict resolution plus metadata; single-leader-per-object pays a per-object throughput bound and a routing dependency. Name which cost your comparison accepts.
- Disaggregation separates scaling from recovery: replacement compute reuses shared storage and rebuilds only caches and query state, while the shared store becomes a failure domain that needs its own durability and recovery design.

**Reproduce:** Closed-book, take a write in Virginia whose acknowledgment contract needs a replica in Singapore: use a stated route round-trip time as the communication term, add protocol and storage costs, and say which part a different quorum placement would remove.

**Traps**

- Comparing designs by feature lists. The comparison dimensions are workload, failure, consistency, cost and evolution; a design that wins all five is misread.
- Quoting Aurora's sub-second lag as a consistency guarantee. The Handbook presents it as a disaster-recovery and local-read feature with typical lag, not as globally consistent.
- Assuming MRSC removes the latency question. AWS documentation read 15 October 2026 requires MRSC to span exactly three supported Regions, as three replicas or two plus a witness, across continents if you like; a write waits for synchronous replication to at least one other Region, which is one latency term, not the whole request.

**Practice**

- [HLD Handbook: multi-region fintech design exercise](https://github.com/handbook-academy/engineering-handbook/blob/d177ae2b48b4dfebf8ad0ddae51a345b3e17d99e/content/hld/part-5-architecture-patterns/08-multi-region-architecture.md) - Exercise: sub-5-minute RTO, sub-second data loss, EU and US residency; pick database and replication model, design failover, estimate the cost difference versus single-region; attempt before the solution. Compare with the solution's jurisdiction sharding and warm standby, but audit its claims: asynchronous lag is not a guaranteed RPO, preconfigured health-based routing differs from control-plane record edits, and query results can carry personal data.

**Stop when:** You state a cross-region write latency from a stated route round trip and quorum placement without notes, and your two-design comparison scores workload, failure, consistency, cost and evolution with losers named per axis.

<details>
<summary>Self-test</summary>

1. A write originates in Virginia and its acknowledgment contract needs a durable replica in Singapore. What sets its latency?
   - The route round trip to Singapore plus protocol and storage costs. The Handbook's 180-200 ms is an illustrative route figure, not a speed-of-light bound or a measurement of your design; a quorum without Singapore would not pay it.
2. What breaks first when EU residency meets a single global database?
   - Placement: EU user rows must live in EU replicas. The fix is jurisdiction sharding (region-pinned partitions), not a faster global commit.
3. Contrast CRDT active-active with per-object singletons on one axis each.
   - Active-active pays metadata and conflict-resolution complexity for zero-coordination writes. Singletons pay a per-object throughput bound and a routing dependency for simple strong-per-object order.
4. What does disaggregation change about adding capacity during a spike?
   - Compute scales without moving authoritative data, and replacement compute rebuilds only caches and query state. The shared store becomes the availability and scaling bottleneck instead.

</details>

#### U13. One bounded real-code contribution with a reference fallback and layered tests

**About 6 h** · **Target:** Implement

Topics: One bounded real-code contribution; Reference fallback and compatibility path; Unit, property, integration and fault tests

The track ends in real code, not in models. A bounded change with a fallback is the difference between a contribution and a rewrite nobody can review.

**You can now**

- Scope one bounded extension to a real or realistic codebase with a hypothesis, a compatibility path and a reference fallback.
- Layer unit, property, integration and fault tests so each layer can fail independently.
- Frame the work in the MIT final-project shape (proposal, code, short write-up, demo) evaluated by the roadmap defense rubric.

**Study**

1. [MIT 6.5840 final project guidance (Spring 2026)](https://pdos.csail.mit.edu/6.824/project.html) (MIT 6.5840 - Verification Lecture and Final Project) - Deliverables (proposal under a page, code plus about 3 pages of write-up, in-class demo), the effort bar (at least Lab 5), and the half-baked ideas list for scope calibration (cross-shard transactions with 2PC, Dynamo-style async replication, geo-replicated storage, CRDT editor). Depth: Course grading and staff review are unavailable to self-study, so the roadmap defense rubric replaces them. Never publish MIT lab solutions; the extension lives in your own repository.
2. [Replicated Log and Stream Processor: bounded extension](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-2/replicated-log-stream-processor.md) (Replicated Log and Stream Processor - Final Capstone) - Architecture constraints, Deliverables and Correctness requirements: the baseline contract and the test layers your contribution must keep passing.
3. [Distributed Systems track: the extension requirement](https://github.com/saisandeshk/Roadmap-Final/blob/main/tracks/distributed-systems-data-infrastructure.md) (Replicated Log and Stream Processor - Final Capstone) - Stage DS-9, the Implement and Design / extend checklists: a bounded protocol, storage, testing or observability extension with compatibility and fault tests. Depth: The checklist names no fallback; state your own safe fallback contract explicitly.

**Focus**

- Bounded means reviewable: one mechanism, one boundary, one hypothesis about what improves. A second mechanism is a second contribution.
- Define when the fallback is safe and which failures it tolerates. After an ambiguous outcome, reconcile or keep the same logical request identity before using the old path, so committed effects are not duplicated and ownership and durability checks still apply.
- Compatibility is tested, not asserted: mixed-version runs, rollback runs and old-data reads belong in the layer that owns them.
- Each test layer answers a different question: units pin the mechanism, properties break ordering assumptions, integration wires the fallback, faults replay the campaign.

**Reproduce:** From the project-page shape, write a one-page proposal for your extension: problem, design, exact compatibility path, fallback trigger, and the four test layers with what each checks.

**Traps**

- Scoping by enthusiasm. The MIT bar is Lab-5-sized; bigger scope with the same evidence is a weaker contribution.
- Testing the fallback path only when it is convenient. The fallback runs under the same fault campaign as the new path, or it is untested code.
- Borrowing credibility from the paper the idea resembles. Your measurements need your setup; the paper's numbers describe its setup.

**Practice**

- The section mini-project covers this: the bounded real-code contribution with reference fallback and layered unit, property, integration and fault tests.

**Stop when:** Your one-page proposal names the mechanism, the compatibility path, the fallback trigger and the four layers, and each layer has a failing-then-passing run on file.

<details>
<summary>Self-test</summary>

1. What four things does the MIT proposal require on under a page?
   - Group members, the problem, how you plan to address it, and what you will specifically design and implement.
2. What makes a fallback a reference fallback rather than a second implementation?
   - It is the pre-existing behavior, kept working and selected under a stated safety rule, with its use recorded. After an ambiguous outcome it reuses the request identity instead of retrying blindly, so it bounds the blast radius of the new path without duplicating effects.
3. Which test layer catches a duplicate-delivery bug in the new path?
   - Property tests with a reference model first (ordering and duplication are their fault class); the fault campaign then replays it under scheduled duplicates.
4. Why does self-study replace staff review with the roadmap defense rubric?
   - Grading and staff feedback need enrollment. The rubric's skeptical defense is the available independent check.

</details>

#### U14. Three ablations, three workload regions and preserved negative results

**About 5 h** · **Target:** Measure

Topics: Three mechanism-isolating ablations; Three informative workload regions; Negative or neutral result preservation

An extension without ablations is a story; with them it is an attribution. Negative results are the boundary markers that keep the next design honest.

**You can now**

- Design three mechanism-isolating ablations that attribute an effect to exactly one mechanism each.
- Select three workload regions that stress different bottlenecks, and state what each region is for.
- Preserve one honest neutral or negative result with its setup, and say what it rules out.

**Study**

1. [Replicated Log and Stream Processor: measurement requirements](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-2/replicated-log-stream-processor.md) (Replicated Log and Stream Processor - Final Capstone) - Measurement requirements: append, commit, apply, consume and end-to-end latency distributions, throughput and goodput, replication and queue lag, duplicates, checkpoint cost, failover and recovery as the menu the three regions sample.
2. [FoundationDB paper Section 5: reporting with setup](https://www.foundationdb.org/files/fdb-paper.pdf) (FoundationDB: A Distributed Unbundled Transactional Key Value Store (Zhou et al., 2021)) - Section 5 performance evaluation: read for how a systems paper reports setup beside numbers, not for the numbers. Depth: Their cluster figures are not your targets. Copy the reporting discipline (versions, workload, concurrency, runs, spread), not the results.
3. [Chapter 2: latency vocabulary](https://dataintensive.net/) (DDIA 2e - Chapters 9, 10 and 14 Review) - Printed pp. 37-42: latency percentiles and response-time distributions for reporting tails honestly.

**Focus**

- One ablation removes one mechanism. If two change together, the difference is unattributed; run the factorial or say which confound remains.
- Regions differ in bottleneck, not just in size. Small-fast, large-slow and fault-dominated loads each exist to stress a different path.
- Ablations run under the same harness and seed discipline as the main result. Different harnesses make differences incomparable.
- The negative result stays in the report with its setup. A mechanism that loses on latency but wins on availability is a trade-off, not a failure to hide.

**Reproduce:** From the capstone measure list, write the three-ablation, three-region plan for your extension on one page: what each ablation removes, which bottleneck each region stresses, and where the negative result will be filed.

**Traps**

- Ablating by disabling the whole subsystem. Removing the mechanism under test plus its scaffolding attributes nothing.
- Picking three regions that all stress throughput. Regions must differ in kind (latency-sensitive, backlog-heavy, fault-dominated), not just in request rate.
- Rerunning until the negative flips. A neutral result under a fixed plan is evidence; a flipped result after plan changes is a new experiment needing its own plan.

**Practice**

- The section mini-project covers this: three mechanism-isolating ablations, three workload regions and the preserved neutral or negative result.

**Stop when:** You execute three mechanism-isolating ablations across three informative workload regions, keep raw histories and setup for each comparison, report uncertainty, and preserve an honest neutral or negative result without changing the plan to hide it.

<details>
<summary>Self-test</summary>

1. What makes an ablation mechanism-isolating?
   - It changes exactly one mechanism between runs under the same harness, seeds and workload, so the measured difference is attributable to that mechanism.
2. Name three workload regions in kind, not size.
   - For example: latency-sensitive small operations, backlog-heavy large transfers, and fault-dominated partition schedules. Each stresses a different bottleneck.
3. Your ablation shows the new mechanism is slower everywhere. What do you do?
   - Keep it as the preserved negative with its setup, and state what it rules out (for example: no latency win in these regions). It bounds where the mechanism helps.
4. Why must ablations share the harness and seeds with the main result?
   - Otherwise setup differences confound the comparison. Same harness and seeds make the only deliberate difference the ablated mechanism.

</details>

#### U15. Raw histories, evidence labels, an independent reproduction package and a skeptical defense

**About 5 h** · **Target:** Measure

Topics: Raw histories and immutable environment manifest; Proved, model-checked, simulated and measured labels; Independent reproduction package; Skeptical architecture and invariant defense

The checkpoint asks for claims labeled by evidence level and reproducible by someone else. This unit turns a pile of runs into a defense that survives expert review.

**You can now**

- Label every claim proved, model-checked within bounds, simulated, locally measured or inferred, with the bound or setup attached.
- Assemble an independent reproduction package: raw histories, environment manifest, seeds, configs and check commands.
- Defend the architecture and the invariant against simpler alternatives, comparing at least three architectures quantitatively under workload, failure, consistency, cost and evolution constraints.

**Study**

1. [How Amazon Web Services Uses Formal Methods: effort framing](https://cdn.amazon.science/67/f9/92733d574c11ba1a11bd08bfb8ae/how-amazon-web-services-uses-formal-methods.pdf) (How Amazon Web Services Uses Formal Methods (Newcombe et al., 2015)) - Effort framing for the defense: model sizes beside bugs found as anecdotes, and the design-tool (not post-hoc proof) framing for why the spec exists. Depth: Anecdotes, not benchmarks. Cite them to explain why industry models designs, never to predict your own effort or bug count.
2. [Chapter 13: Trust, but Verify, revisited](https://dataintensive.net/) (DDIA 2e - Chapters 9, 10 and 14 Review) - Printed p. 575: state which assumption each claim needs and what a violation would look like in practice. Depth: One page only. Each label in your defense inherits one assumption from this page's system-model discussion.
3. [Replicated Log and Stream Processor: defense questions and rubric](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-2/replicated-log-stream-processor.md) (Replicated Log and Stream Processor - Final Capstone) - Design-defense questions (linearization point, losable acknowledged writes, quorum and term safety, effectively-once scope, liveness-only timing, ML-data mapping) and the rubric's reproducibility criterion.
4. [MIT 6.5840 final project: the write-up shape](https://pdos.csail.mit.edu/6.824/project.html) (MIT 6.5840 - Verification Lecture and Final Project) - The document rule (about 3 pages: problem solved, design, implementation) as the shape of the defense document.

**Focus**

- Labels are exact: proved (theorem, assumptions and proof, and whether it is mechanized), model-checked within named bounds, simulated under a named scheduler and faults, locally measured with setup and uncertainty, or inferred from named evidence.
- Raw histories outlive summaries. Keep message, state, WAL and processor traces plus the environment manifest; a plot without its trace is not reproducible.
- The reproduction package runs without you: pinned versions, one command per claim, expected verdicts (not expected numbers) for exact checks.
- The defense answers why-not-simpler for every mechanism. Each ablated alternative from the previous unit is the simpler design you already measured against.

**Reproduce:** Closed-book, label six capstone claims (one per design-defense question) with evidence levels plus bounds or setups, and list the reproduction package contents that back each label.

**Traps**

- Labeling a TLC run proved. Model-checked within bounds is the label; the bound travels with it.
- Shipping the plots without the traces. Summaries illustrate; only raw histories plus manifest plus seeds reproduce.
- Defending against imaginary alternatives. The alternatives are the ablations you ran; cite their measured losses.

**Practice**

- The section mini-project covers this: raw histories with evidence labels, the independent reproduction package, a quantitative comparison of at least three architectures and the skeptical defense.

**Stop when:** Every capstone claim carries a label with its bound or setup, the package reproduces each exact verdict on a second checkout, three architectures are compared quantitatively, and each mechanism has a measured why-not-simpler answer.

<details>
<summary>Self-test</summary>

1. What are the five evidence labels, and what travels with each?
   - Proved (the theorem, its assumptions and the proof, mechanized or not), model-checked (the bound: managers, values, queues, state count), simulated (scheduler, fault set, seeds), measured (machine class, versions, workload, concurrency, runs, spread), inferred (the claims it reasons from).
2. What makes a reproduction package independent?
   - Pinned versions, raw histories, environment manifest, seeds and one command per claim with expected verdicts, runnable without the author present.
3. Under your acknowledgment contract, which acknowledged writes can still be lost?
   - Answer from the contract and the fault model: for example, writes acknowledged when locally durable but not yet replicated are lost if that storage is permanently lost first. A write below the required threshold should not have been acknowledged at all.
4. A reviewer proposes dropping your mechanism for the simpler baseline. How do you answer?
   - With the ablation that already compared them: the measured difference, the regions where each wins, and the preserved negative if the mechanism loses somewhere.

</details>

### Mini-project: Validate a bounded extension and defend its evidence

**About 18 to 24 hours.** Use `loglab` to validate one bounded real-code extension, preserving the working data path as a reference fallback. Connect finite models, replayable failure histories and repeated measurements to a reproduction package that separates checked guarantees from assumptions and local evidence on your machine.

1. Pin the real-system component you will extend and trace protocol, storage, replication, consistency, recovery, security and operations paths against code and documentation. Retain control-plane/data-plane state ownership, extracted contracts and ML provenance closure; contrast quorum and CRDT dissemination assumptions using the earlier convergence proof.
2. Run TLC on the pinned TLA+ Examples TwoPhase specification, then model your `loglab` log in `spec/` with explicit environment actions and a refinement mapping. Check committed-prefix safety and conditional liveness; retain bounds, boundary behavior, fairness assumptions, state counts and each extension's first meaningful counterexample.
3. Extend the deterministic scheduler in `net/` and `faults/` with explicit persistence completions and crash/restart state separation. Use Hypothesis stateful tests against an independent model; plant a recovery or ownership bug, retain its shrunk program and schedule, replay independently of random draws, and state uncontrolled nondeterminism.
4. Build generator, client, nemesis and checker roles around a fault/workload matrix in `history/`. Validate normalization of pending, ambiguous and retried operations against fixed histories using Knossos register and Elle read-write-register checks; retain scoped verdicts, empty coverage cells and minimized safety and bounded non-progress histories.
5. Implement the proposed bounded component change through `loglab`, retaining the reference fallback. Check unit, property, integration and fault layers independently against baseline contracts before timing; retain failing-then-passing regressions, old-data and mixed-version migration tests, rollback drills, and ambiguous-outcome reconciliation with preserved request identity.
6. Predeclare three mechanism-isolating ablations across three bottleneck-distinct workload regions in `bench/`. After correctness gates pass, repeat matched baseline, extension and fallback runs with named versions and workloads; retain raw latency, goodput, resource, checkpoint and recovery records, uncertainty and an honest neutral or negative result.
7. Package raw message, state, WAL and processor histories, pinned environment manifest, seeds, schedules, configurations and per-claim commands in `reports/` for independent reproduction. Label claims proved, model-checked within bounds, simulated, locally measured or inferred; quantitatively defend three architectures across workload, failure, consistency, cost and evolution.

**Deliverables**

- Architecture reconstruction, contracts, provenance closure, bounded log specifications and retained TLC counterexamples in `spec/` and `reports/`.
- The bounded real-code patch, reference fallback, migration and rollback evidence, layered tests and replayable minimized failures.
- Ablation records, workload-region comparisons and the preserved negative result with versions, raw measurements and uncertainty.
- An independently exercised reproduction package and evidence-labeled defense comparing simpler architectures and cross-region assumptions.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [TLA+ Examples: TwoPhase with TLC](https://github.com/tlaplus/Examples/blob/6a7b26a31c1a6aeec789b455e9bbfa3b3ad2728f/specifications/transaction_commit/TwoPhase.tla). Keep public-model results separate from your log model; neither a safety-only specification nor a finite run proves implementation liveness.
- external-tests: [Hypothesis stateful crash and restart tests](https://hypothesis.readthedocs.io/en/latest/stateful.html). Retain the pinned testing version, planted-bug failure, shrunk program and reference-model assertions; generated executions do not exhaust all interleavings.
- external-tests: [Knossos single-register history checks](https://github.com/jepsen-io/knossos). Calibrate on fixed histories and retain the dependency version; do not extend a register verdict to unmodeled objects or transactions.
- external-tests: [Elle read-write-register history checks](https://arxiv.org/abs/2003.10554). Use the section's model-specific API and pinned runtime; report supported anomalies, history completeness and indeterminate outcomes beside each verdict.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Model and code agreement | Your bounded TLC model checks committed-prefix safety with explicit environment and fairness assumptions. Reference-model property tests catch the planted recovery bug and replay its shrunk schedule. | A trace-to-model mapping exposes a missing action or abstraction mismatch; the corrected model and code retain separate regression evidence without claiming a general proof. |
| History and fault coverage | Your normalizer preserves ambiguity and incarnations; Knossos and Elle agree with fixed-history oracles within their scopes. The campaign retains checker verdicts and minimized safety and conditional non-progress examples. | A negative-control checker or normalization defect changes a verdict, and its regression identifies the observation lost rather than merely repairing event formatting. |
| Extension and safe fallback | Your code-and-documentation reconstruction identifies state and contracts. Independently failing test layers verify the bounded change, fallback, old data, mixed versions, migration, rollback and retry identity after ambiguity. | Faults during fallback activation and rollback preserve ownership, effect and durability contracts; provenance identifies which derived artifacts require invalidation or rebuild. |
| Reproduction and design judgment | An independent reader reproduces exact checks from the package. Repeated matched comparisons retain three ablations, three regions, uncertainty and a negative result; three architectures receive quantitative, evidence-labeled comparisons. | The defense separates measured behavior from inferred geo-replication and disaggregation costs, identifies unsupported claims, and uses the retained alternatives to justify removing an unhelpful mechanism. |

Feeds into: The bounded real-code extension, formal and property checks, minimized failures, ablations and independently exercised reproduction package complete the capstone dossier; contracts and regressions also strengthen every earlier `loglab` subsystem.

### Resource route

- **Primary - Course:** [TLA+ Video Course](https://lamport.azurewebsites.net/video/videos.html) - Complete lectures 1 to 10 (lectures 8, 9 and 10 have two parts each) and check the corrections page, while specifying a reduced transaction, workflow or replicated-log model from the capstone. Run TLC after every extension, report the model bounds with every result, and retain the first meaningful counterexample rather than polishing only the final model.
- **Support - Reference:** [TLA+ Examples](https://github.com/tlaplus/Examples/tree/6a7b26a31c1a6aeec789b455e9bbfa3b3ad2728f/specifications/transaction_commit) - Check `specifications/transaction_commit/` (`TCommit.tla`, `TwoPhase.tla`, `PaxosCommit.tla` with their `.cfg` files) with TLC alongside the lectures, and read the Paxos specifications for depth. `specifications/TwoPhase/` is a hardware handshake, not transaction commit.
- **Support - Reference:** [Cambridge Concurrent and Distributed Systems Notes (Kleppmann) - CRDTs and Collaboration](https://www.cl.cam.ac.uk/teaching/2122/ConcDisSys/dist-sys-notes.pdf) - Use Section 8.1 (operation-based and state-based CRDTs, operational transformation) for the CRDT unit, and work Exercise 21 (prove the operation-based map CRDT converges) and Exercise 22 (its multi-value variant).
- **Support - Paper:** [A Comprehensive Study of Convergent and Commutative Replicated Data Types (Shapiro et al., 2011)](https://dsf.berkeley.edu/cs286/papers/crdt-tr2011.pdf) - Read Sections 1 to 3 (state-based and operation-based definitions, the semilattice and delivery conditions) and one example type for your implementation, not the whole catalog.
- **Support - Reference:** [Learn TLA+](https://learntla.com/) - Use the core lessons and the examples as a second explanation when a lecture stalls, and as the PlusCal reference if you write algorithms rather than raw actions.
- **Required - Reference:** [Hypothesis - Stateful Testing](https://hypothesis.readthedocs.io/en/latest/stateful.html) - Use `RuleBasedStateMachine` against a reference model for property-based state-machine tests of your extension, keep the failing seeds and shrunk examples, and plant a bug to show the machine detects it.
- **Required - Course and project:** [MIT 6.5840 - Verification Lecture and Final Project](https://pdos.csail.mit.edu/6.824/schedule.html) - Study the Spring 2026 verification lecture and IronFleet reading, then use the final-project guidance to frame a bounded real-system extension, evaluation and report. Course grading and staff review are unavailable to self-study, so use the roadmap defense rubric.
- **Required - Testing reference:** [Jepsen - Consistency Models and Analyses](https://jepsen.io/consistency/models) - Use the framework's generator, client, nemesis and checker roles to design the campaign, Knossos for single-register linearizability and Elle for transactional anomalies on recorded histories, and the public analyses for fault models. A simplified local checker must declare its object, model and completeness limits.
- **Required - Paper:** [Elle: Inferring Isolation Anomalies from Experimental Observations (Kingsbury and Alvaro)](https://arxiv.org/abs/2003.10554) - Read how Elle infers version orders from list-append and register histories and detects cycles for G0 to G2. It needs complete histories, and a clean run is not a proof of serializability.
- **Support - Paper:** [How Amazon Web Services Uses Formal Methods (Newcombe et al., 2015)](https://cdn.amazon.science/67/f9/92733d574c11ba1a11bd08bfb8ae/how-amazon-web-services-uses-formal-methods.pdf) - Read it for why industrial teams specify designs in TLA+ and which bugs model checking found that testing missed. Its effort figures are anecdotes, not benchmarks.
- **Support - Paper:** [FoundationDB: A Distributed Unbundled Transactional Key Value Store (Zhou et al., 2021)](https://www.foundationdb.org/files/fdb-paper.pdf) - Read the simulation-testing section (deterministic single-threaded simulation, fault injection, seed replay) as the model for your own scheduler, and the architecture for unbundled transactions.
- **Required - Book:** [DDIA 2e - Chapters 9, 10 and 14 Review](https://dataintensive.net/) - Revisit uncertainty, consistency, consensus and responsible system design while extracting the final contract. Use the book to challenge assumptions and alternatives, not to replace executable evidence.
- **Support - Reference:** [HLD Handbook - CRDTs, Multi-Region and Architecture Trade-offs](https://github.com/handbook-academy/engineering-handbook/tree/main/content/hld) - Read the CRDT, multi-region, distributed SQL and relevant case-study chapters only after the formal core passes. Use its design prompts to prepare the final comparison and defense.
- **Depth - Course and papers:** [CMU 15-721 - Selected Advanced Database Systems Units](https://15721.courses.cs.cmu.edu/spring2024/schedule.html) - Select at most one lecture group that informs your extension: #02 and #03 (data formats and encoding), #08 (scheduling and coordination) or #17 to #22 (system analyses such as BigQuery, Databricks, Snowflake, DuckDB and Redshift), with their papers. The course project needs a group, cloud credits and staff sign-off, so there is no runnable self-study project.
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

**Capstone rubric** (about 24 to 36 hours)

| Criterion | Pass | Strong |
| --- | --- | --- |
| Executable distributed foundations | A versioned protocol, deterministic network and storage fault harness, restart-safe identity and time model, checksummed local log and explicit acknowledgement contract have retained replication histories and executable consistency checks against independent references, with timing-free safety gates. | Planted protocol, persistence and identity faults fail before repair. Event-stream replay reproduces minimized counterexamples independently of random draws, and acknowledged-prefix checks distinguish receipt, persistence, commit, application and visibility without relying on wall-clock order. |
| Replicated stream data path | A replicated or consensus-backed partition log integrates ownership epochs, durable producer and consumer state, rebalance, a transaction or saga boundary, event-time processing, checkpoints, backpressure and replay. Independent history and state oracles check minimized safety and conditional liveness failures. | Fault campaigns cover network, identity, clock, storage, snapshot, consumer, sink, schema, overload and hot-partition failures; verdicts link raw traces to contracts, with explicit liveness assumptions and coverage gaps. Snapshot-plus-suffix recovery agrees with full replay. |
| Production dossier and extension | The secured, observable dossier verifies backup and restore. The DS-9 project's bounded real-code extension artifacts cover migration, rollback, three ablations, three workload regions, an honest negative result and formal or property validation; its reproduction package supplies evidence labels. | A blinded fault campaign preserves policy and effect boundaries through restore, migration and fallback. Repeated matched measurements report latency distributions, goodput, lag, resource costs, checkpoint and recovery costs, uncertainty and observer overhead, including losing regimes. |
| Reproducibility and judgment | An independent reader runs the DS-9 reproduction package from a clean checkout, regenerating exact verdicts and tables from raw records. Evidence labels distinguish proof, bounded model checks, simulation, measurements and inference; assumptions and negative results bound every claim. | The skeptical defense quantitatively compares three architectures across workload, failure, consistency, cost and evolution, separates cross-region inference from measurements on your machine, and identifies mechanisms to remove when their benefit is unsupported. |

