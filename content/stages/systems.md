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

### Study units

#### U1. Instruction pipelines, branches and SIMD

**About 4 h** · **Target:** Explain

Topics: Instructions, dependencies, pipelines and branch behavior vocabulary; SIMD lanes, scalar work and vectorization limits

Assume Programming's layout-alignment-locality and profiling-benchmarking units. Here the mechanism is instruction execution: dependencies, speculation and SIMD determine which work can overlap before the kernel or storage enters the picture.

**You can now**

- Explain pipeline overlap, instruction dependencies and branch recovery without equating clock cycles with instructions.
- Identify SIMD lanes, loop tails and a loop-carried dependency in compiler output.
- Separate a compiler's vectorization decision from evidence of a runtime speedup.

**Study**

1. [Pipelining & Performance](https://www.cs.cornell.edu/courses/cs3410/2025fa/notes/pipelining.html#pipelining) (CS 3410: Pipelining & Performance) - Iron Law of Processor Performance; Pipelined Processors; Performance of Pipelined Processors; Latency vs. Throughput; Hazards. Depth: Use the ideal five-stage calculation and the control-hazard example. Do not transfer its CPI or stage count to the i9, or follow the textbook pointer into full processor design.
2. [Loop vectorization and its limits](https://llvm.org/docs/Vectorizers.html#the-loop-vectorizer) (Auto-Vectorization in LLVM) - Usage; Diagnostics; Features: Loops with unknown trip count, Runtime Checks of Pointers, Reductions, If Conversion and Partial unrolling during vectorization. Depth: Stop before Epilogue Vectorization. Skip historical Performance charts; they are not measurements of your machine.

**Focus**

- Pipeline overlap improves throughput, not necessarily the latency of one instruction. Dependencies limit overlap; a wrong branch prediction discards speculative work.
- Instruction count, CPI and clock period all enter execution time. Out-of-order execution schedules ready work but must preserve architectural behavior.
- SIMD widens independent operations. Tails, alias checks, calls and recurrences constrain the generated loop; unrolling is not itself SIMD.
- If conversion can replace branches. Inspect the executable before calling an input-order timing difference a branch-prediction effect.

**Reproduce:** From a blank C file, write noinline bump(uint32_t *a, unsigned n) with a[i] += 1u for i=0..n-1, and noinline chain with a[i] += a[i-1] for i=1..n-1. In main initialize 1031 elements to i, call bump, sum into uint64_t and print it, then call chain and print a[1030]. Compile with clang -O3 -march=x86-64-v3 -Rpass=loop-vectorize -Rpass-missed=loop-vectorize, and again with -fno-vectorize -fno-slp-vectorize. Run both with taskset -c 2. Both print 531996 twice. On Clang 21.1.8, bump vectorizes with eight uint32_t lanes and chain does not; confirm packed additions and the scalar tail with objdump -d. This is a correctness and instruction observation, not a timing claim.

**Traps**

- Counting SIMD lanes as a promised speedup. Loads, stores, dependencies and loop overhead still consume resources.
- Using signed overflow or floating-point reassociation as an exact correctness oracle. Use unsigned arithmetic here; floating-point reductions need a stated error criterion.
- Timing a loop the compiler folded away, or attributing branch misses to source-level if statements that became branchless code.

**Practice**

- The section mini-project covers this: a correctness-checked scalar/vectorized kernel, dependency and branch variants, saved assembly, and pinned repeated measurements with compiler flags and warm-up state.

**Stop when:** Both builds agree on the checksum and recurrence endpoint, and you can mark the vector lanes, scalar tail and dependency in the executable without promising a speedup.

<details>
<summary>Self-test</summary>

1. In an ideal five-stage pipeline with no stalls, how many cycles complete ten instructions?
   - Four fill cycles plus ten completions: 14 cycles. This is a model, not a measurement of the host CPU.
2. Why does chain not have the same independent lanes as bump?
   - Iteration i needs the value written by iteration i-1. A simple widening would read the wrong predecessor; a different algorithm such as a parallel scan is needed.
3. Does a vectorization remark prove the vector loop ran for a particular call?
   - No. A small length, tail or runtime alias check can select a scalar path. Inspect the call's inputs and generated control flow.
4. Can a predictable branch be cheaper than computing both arms?
   - Yes. Prediction can avoid unnecessary work. Which version wins depends on the generated code and workload and must be measured.

</details>

#### U2. Caches, working sets, bandwidth and NUMA

**About 4 h** · **Target:** Explain + Measure

Topics: Cache lines, hierarchy, locality, coherence and false sharing; Working sets, memory bandwidth, latency and storage hierarchy; NUMA placement and local versus remote memory vocabulary

Assume Programming's layout-alignment-locality unit, including its AoS/SoA experiment. This unit moves to cache ownership, working-set regimes and physical placement rather than repeating that layout comparison.

**You can now**

- Explain cache-line fills, coherence and false sharing separately from language-level synchronization.
- Measure a traversal-order change with a fixed working set and a correctness oracle.
- Estimate useful bytes and line traffic with units, and distinguish bandwidth from dependent-load latency.
- Explain CPU affinity and NUMA page placement without claiming remote-memory measurements on a one-node host.

**Study**

1. [The Memory Hierarchy and Why Latency Matters](https://algomaster.io/learn/operating-systems/the-memory-hierarchy) (AlgoMaster: hardware and container storage companions) - CPU Caches through Memory Capacity vs. Memory Speed; A Simple Locality Experiment. Depth: Correct the experiment before running it: as printed, its static matrix is never written, and gcc 15.2 at -O2 removes both loops (both totals 0, both times 0.000000 s). Initialize every element to (row+column)&255 and declare the matrix volatile so both access orders remain. This measures scalar volatile traversal, not optimized application bandwidth.
2. [Coherence and false sharing](https://algomaster.io/learn/operating-systems/memory-ordering-and-false-sharing) (AlgoMaster: hardware and container storage companions) - Cache Coherence vs. Memory Consistency; False Sharing: Independent Data, Shared Cache Line; True Sharing and False Sharing; Separating Frequently Written Data. Depth: Leave atomics and the multicore benchmark to the concurrency section. A single-core-pinned run cannot demonstrate lines bouncing between cores.
3. [NUMA placement vocabulary](https://algomaster.io/learn/operating-systems/huge-pages-numa-and-aslr) (AlgoMaster: hardware and container storage companions) - NUMA: Memory Locality through NUMA Problems in Backend Services. Depth: Inspect topology only. On a one-node machine, skip commands requiring node 1 and do not report a local/remote timing ratio.

**Focus**

- Read cpu2/cache/index*/{level,type,size,coherency_line_size,shared_cpu_list} under /sys/devices/system/cpu and run lscpu before estimating line traffic. Aggregate lscpu cache sizes are not per-core capacities.
- A stream can overlap independent misses and use bandwidth; a pointer chain waits for each next address and exposes latency. Useful bytes/time is not automatically DRAM traffic/time.
- Coherence coordinates writes to locations. It does not establish the language's cross-location publication order; false sharing is independent writers sharing one line.
- Working-set fit, conflicts, prefetch, translation and frequency all affect a curve. CPU pinning does not relocate pages; NUMA distance values are not measured nanoseconds.

**Reproduce:** Rebuild the corrected A Simple Locality Experiment from memory: a static volatile int matrix[4096][4096], initialized to (r+c)&255 before timing, with row-first and column-first sums into long long and CLOCK_MONOTONIC around each traversal. Build with gcc -O2 -Wall -Wextra and run taskset -c 2 ./locality five times. Each traversal sums to 2139095040; the array is 64 MiB when sizeof(int)==4, so it cannot stay resident in a 30 MiB last-level cache. Predict the ratio before timing: on an i9-12900K with Linux 7.0 and gcc 15.2, five pinned runs gave 8.1 to 8.2 ms row-first and 80 to 87 ms column-first. Record yours with kernel, CPU and GCC version, derive line utilization from the inspected line size, then explain why TLB behavior and volatile loads keep this from being a pure DRAM-bandwidth benchmark.

**Traps**

- Turning a slower strided run into a cache-miss count. Timing alone cannot separate cache, TLB, prefetch and instruction effects.
- Using perf c2c or system-wide counters without the permission they need. With kernel.perf_event_paranoid at 2, keep counters to your own pinned process and user-space cycles and instructions; on hybrid Intel CPUs cpu_core and cpu_atom are separate PMUs.
- Reporting NUMA remote latency from a one-node machine. There is no second memory node to measure.

**Practice**

- The section mini-project covers this: working-set and stride sweeps across inspected cache capacities, a dependent pointer chase versus a stream, matched checksums, pinned five-repeat raw timings, and a topology note explicitly excluding remote NUMA claims.

**Stop when:** Both traversal checksums agree, your evidence records topology and cache state, and you can explain useful-byte traffic, latency versus bandwidth and a hypothetical false-sharing layout without treating timing as causal proof.

<details>
<summary>Self-test</summary>

1. For an aligned array of four-byte integers and an inspected 64-byte line, how much of each line does a stride-16 pass use?
   - One integer, or 4/64 = 1/16 of the line, before any later reuse. This is useful-byte utilization, not a measured memory-traffic multiplier.
2. Why can two race-free counters still contend in hardware?
   - Separate counters can share one cache line. Writes on different cores repeatedly require ownership of that line even though neither counter has multiple writers.
3. Does a working set smaller than cache capacity guarantee hits?
   - No. Conflicts, competing code/data and other users of shared cache can evict lines; compulsory fills still occur.
4. What can numactl --hardware establish on a one-node host?
   - Visible CPUs, node membership and node capacity. It cannot supply an observed remote-memory penalty.

</details>

#### U3. Processes, system calls, fork, exec and scheduling

**About 4 h** · **Target:** Explain + Implement

Topics: Programs, processes, system calls and user versus kernel mode; Fork, exec, wait, scheduling states and context switches

Assume Programming's shell-processes-environment unit and its exit-status and trap exercises. Here you trace the kernel process model, not shell syntax, and make the launcher own every child it creates.

**You can now**

- Trace fork, exec and wait while identifying kernel-owned state and preserved process identity.
- Distinguish a privilege-mode transition from a scheduler context switch.
- Implement child launch and status collection with an explicit exec-failure path.
- Predict ready, running and blocked transitions under a stated scheduling model.

**Study**

1. [The process and its API](https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-api.pdf) (Operating Systems: Three Easy Pieces - selected foundations) - Chapter 4, Sections 4.1 to 4.5 (Processes, linked from the book contents); Chapter 5, Sections 5.1 to 5.4, including Figures 5.1 to 5.4. Depth: Read the redirection example for the fork/exec boundary; leave descriptor details to the next unit.
2. [Protected execution and scheduling](https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-mechanisms.pdf) (Operating Systems: Three Easy Pieces - selected foundations) - Chapter 6, Sections 6.1 to 6.3; Chapter 7, Sections 7.1 to 7.2 and 7.6 to 7.8 (CPU Scheduling, linked from the book contents). Depth: Treat round robin as a model, not Linux's normal scheduler. A context switch can disturb cache/TLB locality; it does not necessarily flush every cache or every tagged TLB entry.
3. [Linux process launch and switching](https://algomaster.io/learn/operating-systems/fork-exec-wait-exit) (AlgoMaster Operating Systems - selected observation route) - What exec Replaces and What It Preserves; Encoded Wait Status; Handling an Interrupted Wait; Multithreaded fork Considerations; Failure Handling by Operation. Depth: Then use Context Switching, Mode Switches vs. Context Switches and Blocking, Preemption, and the State Model. Do not benchmark switch cost yet.
4. [Xv6 utilities: the exec task](https://pdos.csail.mit.edu/6.1810/2025/labs/util.html) (MIT 6.1810 - selected xv6 process and memory labs) - exec: adding -exec cmd to find; hints on fork, exec and wait. Depth: Read and sketch the lifecycle only. Running xv6 needs the RISC-V toolchain and QEMU from the course tools page, which this unit does not require; leave full util-lab completion to a course environment.
5. [One xv6 syscall task: sandbox mask](https://pdos.csail.mit.edu/6.1810/2025/labs/syscall.html) (MIT 6.1810 - selected xv6 process and memory labs) - Sandbox a command; interpose(mask, path), fork inheritance and grade-lab-syscall sandbox_mask. Depth: Sketch the stub, syscall number, dispatch and per-process mask ownership. Fall 2025 uses interpose, not the older trace task. Implementing it and running the sandbox_mask test need the xv6 toolchain and are optional here; skip allowed pathnames and Attack xv6.

**Focus**

- Fork creates a child with a different PID; successful exec replaces its address space while retaining its PID. Wait consumes an owned child's termination record.
- System calls enter controlled kernel code. A call can return in the same task without any switch to another task; blocking or preemption can cause scheduling.
- Ready is not running, and blocked is not merely low CPU usage. Linux's R status includes running and runnable tasks.
- Response time and turnaround time answer different questions. A policy comparison needs arrivals, CPU bursts, I/O durations and switch assumptions.

**Reproduce:** Write a single-threaded Python launcher using os.fork, os.execl and os.waitpid. In the child, os.write its PID before exec; execute /bin/sh with arguments -c 'echo "after exec pid=$$"; exit 7'. The parent waits for that PID and decodes WIFEXITED/WEXITSTATUS. Repeat with /atlas-missing-executable, catching OSError in the child and calling os._exit(127). Run taskset -c 2 strace -f -e trace=process -- python3 -I launcher.py (CPython 3.14.4). Match the pre/post-exec PID; verify normal exit 7 and launch failure 127. These are program-selected codes, not a universal exec-error encoding. Keep the trace showing process creation, execve and wait4; Linux's fork wrapper may use clone.

**Traps**

- Expecting the parent to run first after fork, or treating a sleep as a synchronization guarantee.
- Returning through normal Python cleanup after a failed child exec. Use os._exit for this post-fork failure path and collect the result in the parent.
- Extending this single-threaded fork pattern to a multithreaded runtime. Copied locks can remain owned by threads that no longer exist in the child.

**Practice**

- [OSTEP process-run.py: CPU/I/O state prediction](https://github.com/remzi-arpacidusseau/ostep-homework/tree/master/cpu-intro) - README Overview and process-run.py; use -s 1 and -s 2 with -l 5:50,5:100 -L 5. Predict the full trace before adding -c -p. Compare SWITCH_ON_IO with SWITCH_ON_END and IO_RUN_LATER with IO_RUN_IMMEDIATE. The answer flag is the simulator's oracle, not a Linux scheduler test. Save one matching launcher trace for the section evidence pack.

**Stop when:** Your launcher reaps both success and exec-failure children, and your two-seed simulator predictions distinguish blocked time from ready time and a mode switch from a task switch.

<details>
<summary>Self-test</summary>

1. Does successful exec return zero to the old program?
   - No. It does not return. Only failure returns to the old image; the kernel keeps the process identity but installs a new program image.
2. What must happen after a blocked child's I/O completes before it executes again?
   - It becomes runnable and the scheduler must select it. Completion does not imply immediate execution.
3. Is every system call a context switch?
   - No. It changes privilege mode, but another task need not run. A blocked call can lead to a context switch.
4. Can the raw wait status be compared directly with exit code 7?
   - No. First test normal exit with WIFEXITED and then decode WEXITSTATUS. Signaled termination has a different interpretation.

</details>

#### U4. File descriptors, pipes, signals and process lifecycle

**About 4 h** · **Target:** Implement

Topics: File descriptors, open-file state, pipes and redirection; Signals, exit status, zombies, orphans and lifecycle ownership

Assume Programming's shell-processes-environment unit, including signal exit conventions. This unit exposes descriptor references, pipe endpoint counts and child status records that make shell pipelines and process supervisors work.

**You can now**

- Implement a parent-child pipe with deliberate redirection, closure and reaping on each path.
- Predict shared open-file offsets and close-on-exec behavior across dup, fork and exec.
- Diagnose a retained pipe writer or zombie from kernel state rather than from a timeout alone.
- Distinguish signal notification, delivery, termination and status collection.

**Study**

1. [Descriptor entries versus open descriptions](https://algomaster.io/learn/operating-systems/file-descriptors) (AlgoMaster Operating Systems - selected observation route) - The Three-Level Model through Descriptor Flags vs. File Status Flags; Observing Descriptors Through /proc; Demonstrating Shared and Independent Offsets.
2. [Signals and child ownership](https://algomaster.io/learn/operating-systems/signals) (AlgoMaster Operating Systems - selected observation route) - The Signal Lifecycle; Dispositions: Default, Ignore, or Catch; Why Handlers Must Be Tiny; Interrupted System Calls and EINTR; Signal Masks and Pending Signals; SIGCHLD: Notification, Not Reaping. Depth: Then read Zombies and Orphans: What Exactly Is a Zombie?, Reaping Without Blocking, What Is an Orphan? and Subreapers and Process Supervisors. Leave multithreaded signal coordination to concurrency.
3. [Wait status and child states](https://man7.org/linux/man-pages/man2/wait.2.html) (Linux proc and strace references) - DESCRIPTION: wait() and waitpid(), status macros, waitid() and WNOWAIT; NOTES on zombies.
4. [Offsets shared through fork and dup](https://pages.cs.wisc.edu/~remzi/OSTEP/file-intro.pdf) (Operating Systems: Three Easy Pieces - selected foundations) - Chapter 39, Sections 39.4 to 39.6, especially Shared File Table Entries: fork() And dup().

**Focus**

- A descriptor entry holds its own close-on-exec flag; the open file description holds the shared offset and status flags. A repeated open creates independent open state.
- After dup2, close unused pipe endpoints in both processes. EOF requires an empty pipe and no remaining write references; parent exit is not the definition of EOF.
- Signals have dispositions and per-thread masks. SIGCHLD can coalesce; drain waitable children rather than counting notifications.
- A zombie has already released its user memory and descriptors. An orphan changes parent; Linux can adopt it through a subreaper rather than the host PID 1.

**Reproduce:** Write a Python parent with two os.pipe pairs. Fork one child, dup2 its request-read end onto fd 0 and response-write end onto fd 1, close all original endpoints and execl /bin/cat. In the parent close the child-only ends, write b'abc\n' with a partial-write loop, close the request writer, read the response until EOF and waitpid the child. Assert exactly b'abc\n' and normal exit 0. Run strace -f -e trace=process,pipe,pipe2,dup2,read,write,close -- python3 -I pipes.py. In a separate empty pipe, set the reader nonblocking: retaining the writer gives BlockingIOError, closing the last writer gives b''. Finally fork a child that sets SIGTERM to SIG_DFL, announces readiness through a pipe and waits; signal it only after readiness. Use waitid with WEXITED|WNOWAIT to observe /proc/<pid>/status state Z, then waitpid and verify WIFSIGNALED with WTERMSIG==SIGTERM. Use no sleep as an ordering guarantee.

**Traps**

- Keeping a spare write descriptor open and waiting for EOF forever. Inheritance and duplication both retain references.
- Assuming Python's newly created descriptors survive exec. They are non-inheritable by default; deliberate dup2 onto standard I/O is inheritable unless requested otherwise.
- Calling arbitrary logging or allocation from a native signal handler, or assuming shell status 128+signal is the raw wait status.

**Practice**

- The section mini-project covers this: a supervised pipe worker with a descriptor ownership diagram, deliberate leaked-writer regression test, signal termination, zombie observation, and guaranteed closure and reaping on success and failure.

**Stop when:** The pipe round trip passes, your nonblocking leak test distinguishes EAGAIN from EOF, and your signal test observes then reaps the zombie with a correctly decoded wait status.

<details>
<summary>Self-test</summary>

1. A child reads through an inherited regular-file descriptor. Does the parent's offset advance?
   - Yes, if both entries still refer to the same inherited open file description. Separate open calls would have independent offsets.
2. The producer exited, but an unrelated child inherited its pipe writer. Will an empty pipe return EOF?
   - No. A write reference still exists. A blocking reader waits and a nonblocking reader reports EAGAIN until the last writer closes.
3. Why does one SIGCHLD handler invocation not imply one terminated child?
   - Standard signals can coalesce and SIGCHLD can report other child state changes. Reap in a loop with waitpid(-1, ..., WNOHANG), handling the documented return cases.
4. Can SIGKILL remove a zombie's retained status record?
   - No. It is already terminated. Its parent or adopter must collect the record; signal delivery is not reaping.

</details>

#### U5. Virtual memory, page tables, TLBs, page faults and mmap

**About 6 h** · **Target:** Explain + Measure

Topics: Virtual addresses, address translation, pages and page tables; TLBs, page faults, copy-on-write and memory mapping

Assume Programming's integers-pointers-spans and ownership-raii-move units. A valid pointer is a virtual address, not a promise of residency or a cheap access. Connect translation to kernel allocation, copy-on-write and file-backed I/O before interpreting memory totals.

**You can now**

- Translate a virtual address with a stated page size, PTE validity and permissions.
- Explain a hardware TLB miss, a recoverable page fault and an invalid access as distinct paths.
- Measure first-touch versus repeated-touch fault deltas and verify private copy-on-write semantics.
- Choose private versus shared mappings and identify alignment, lifetime and truncation hazards.

**Study**

1. [Paging, translation caches and faults](https://pages.cs.wisc.edu/~remzi/OSTEP/vm-paging.pdf) (Operating Systems: Three Easy Pieces - selected foundations) - Chapter 18, Sections 18.1 to 18.4; Chapter 19, Sections 19.1 to 19.5; Chapter 20, Section 20.3; Chapter 21, Sections 21.2 to 21.5 (other chapters linked from the book contents). Depth: Keep the models' address widths explicit. Chapter 21's swapped-page example is not every Linux fault: demand-zero, cached-file and copy-on-write faults need no storage read. Skip replacement-policy derivations beyond the short simulator practice.
2. [Linux fault classification and private writes](https://algomaster.io/learn/operating-systems/page-faults) (AlgoMaster Operating Systems - selected observation route) - Minor and Major Page Faults; TLB Miss, Minor Fault, and Major Fault; Measuring Page Faults on Linux.
3. [Copy-on-write after fork](https://algomaster.io/learn/operating-systems/copy-on-write) (AlgoMaster Operating Systems - selected observation route) - Initial CoW Setup; The Write-Fault Path; Frame Reference Counts; What Is Shared After fork().
4. [Mapping semantics](https://algomaster.io/learn/operating-systems/mmap-and-memory-mapped-files) (AlgoMaster Operating Systems - selected observation route) - On-Demand Residency of File Pages through Mapping Lifetime and File Descriptors; Visibility vs. Durability; mmap() Versus read().
5. [mmap API contract](https://man7.org/linux/man-pages/man2/mmap.2.html) (Linux proc and strace references) - DESCRIPTION: offset, MAP_SHARED, MAP_PRIVATE and MAP_ANONYMOUS; ERRORS: SIGBUS; NOTES on fork and file size. Depth: Ignore MAP_FIXED, DAX and explicit huge-page tuning. Keep ownership of mappings separate from ownership of descriptors.
6. [Page-table inspection and ugetpid design](https://pdos.csail.mit.edu/6.1810/2025/labs/pgtbl.html) (MIT 6.1810 - selected xv6 process and memory labs) - Inspect a user-process page table; Speed up system calls. Depth: Explain the handout's entries and sketch the read-only USYSCALL lifecycle. Running the lab needs the xv6 RISC-V toolchain and QEMU; stop before Print a page table and Use superpages.

**Focus**

- Translation changes the frame number, not the offset. PTE permissions, the virtual region's policy and residency determine whether access proceeds or faults.
- The x86 hardware walks page tables on a TLB miss; the kernel resolves faults. A TLB miss is not necessarily a page fault or a storage access.
- Private writable pages can share frames after fork until a write fault. A sole owner may regain write permission without copying; shared mappings have different semantics.
- File mappings use the page cache. Closing the descriptor does not unmap them, and MAP_PRIVATE is not a guaranteed snapshot against external file changes.

**Reproduce:** Write a Python script that gets SC_PAGE_SIZE, creates a 16*1024*1024-byte anonymous mapping with explicit MAP_PRIVATE|MAP_ANONYMOUS and applies MADV_NOHUGEPAGE. Snapshot resource.getrusage(RUSAGE_SELF).ru_minflt and ru_majflt immediately before and after writing byte value 1 at range(0, length, page_size); repeat the same pass on the same mapping. Run three fresh processes with taskset -c 2 python3 -I faults.py (CPython 3.14.4), recording CPU, kernel and all deltas. Predict first-touch minor faults on the scale length/page_size: three reference runs on Linux 7.0 gave exactly 4096 minor and 0 major faults on the first pass and 0 on the second. Then fork, have the child set byte 0 to 2 and exit, reap it and assert the parent's byte remains 1. Close the mapping. State that this tests private semantics, not the number of physical copies or storage latency.

**Traps**

- Using Python's default anonymous mmap sharing mode and expecting private copy-on-write. Pass MAP_PRIVATE explicitly.
- Counting one fault per base page without checking huge-page policy, readahead, reclamation or counter scope.
- Treating successful mmap as prefaulting all bytes, or accessing a mapped file after unsafe truncation.

**Practice**

- [OSTEP paging-linear-translate.py: valid and invalid translations](https://github.com/remzi-arpacidusseau/ostep-homework/tree/master/vm-paging) - README Overview; -s 1 and -s 2 with -a 16k -p 64k -P 4k -n 5 -v. Write VPN, offset, validity and physical address for every generated address before adding -c. The valid-bit model is simplified, not Linux's full fault handler.
- [OSTEP paging-policy.py: a bounded resident set](https://github.com/remzi-arpacidusseau/ostep-homework/tree/master/vm-beyondphys-policy) - README Overview; -s 1 and -s 2 with -n 10 -C 3 -m 5 -p LRU. Predict hit/miss and each eviction before adding -c, then compare FIFO on the same traces. Stop at working-set pressure; do not infer Linux reclaim policy from this simulator. The section mini-project should retain the first-touch and private-write evidence.

**Stop when:** You solve both two-seed translation and residency exercises, classify your first/repeated-touch counters without confusing faults with TLB misses, and pass the parent/child private-write assertion.

<details>
<summary>Self-test</summary>

1. With 4096-byte pages, VA 0x12345 and a valid VPN-to-frame mapping 18 -> 7, what is the physical byte address?
   - VPN is 0x12 = 18, offset is 0x345 = 837, and PA is 7*4096+837 = 29509 = 0x7345, provided the access permissions allow it.
2. How large is a linear table for a full 32-bit virtual space with 4 KiB pages and four-byte PTEs?
   - 2^20 entries times four bytes = 4 MiB. This excludes extra metadata and is not a claim about the host's multi-level x86-64 tables.
3. Can a resident file page cause a minor fault?
   - Yes. The page can be in the page cache while this process still lacks a usable PTE. Installing the mapping needs no storage read.
4. Does flushing a private file mapping publish its private writes into the file?
   - No. MAP_PRIVATE writes belong to private copies. A shared writable mapping or explicit file writes are needed to change the backing file.

</details>

#### U6. Resident size, virtual size and allocator retention

**About 3 h** · **Target:** Measure

Topics: Resident size, virtual size, allocator behavior and retention

Assume Programming's profiling-benchmarking unit; Python object-allocation profiles are background, not an RSS oracle. This unit follows native allocation into kernel mappings and distinguishes a leak from reusable retained capacity.

**You can now**

- Measure live requested bytes, virtual size, RSS and PSS as different quantities.
- Diagnose retained allocator capacity using staged allocate/free/reuse observations.
- Separate current residency, peak residency and cgroup-wide accounting.

**Study**

1. [Library allocation versus OS mappings](https://pages.cs.wisc.edu/~remzi/OSTEP/vm-api.pdf) (Operating Systems: Three Easy Pieces - selected foundations) - Chapter 14, Sections 14.1 to 14.3 and 14.5. Depth: Assume ownership and invalid-free rules from Programming. Focus on why malloc/free are library calls and brk/mmap are kernel interfaces.
2. [Allocator retention](https://algomaster.io/learn/operating-systems/how-malloc-works) (AlgoMaster Operating Systems - selected observation route) - malloc() as a Library Function; Arenas and Chunks; What free() Does; Coalescing Adjacent Free Chunks; Obtaining Memory from the Operating System; Why free() May Not Reduce Process Memory; Multiple Arenas and Thread Caches; Observing malloc() with strace.
3. [VSZ, RSS, PSS, and What They Mean](https://algomaster.io/learn/operating-systems/memory-metrics) (AlgoMaster Operating Systems - selected observation route) - VSZ: Virtual Size through Comparing the Four Metrics; Reading Memory Metrics on Linux; A Hands-On Allocation Experiment; Why free() May Not Reduce RSS; Measurement Pitfalls.
4. [Mapping-level memory accounting](https://man7.org/linux/man-pages/man5/proc_pid_smaps.5.html) (Linux proc and strace references) - DESCRIPTION: Size, Rss, Pss, private/shared fields, KernelPageSize, MMUPageSize and AnonHugePages.

**Focus**

- Track requested live payload independently of allocator metadata, rounding and free chunks. The kernel accounts mappings and pages, not each application allocation.
- RSS counts shared pages fully in each process; PSS apportions them. Neither is identical to the hot working set or a cgroup's charged memory.
- Free returns an object to the allocator. Reuse can consume retained chunks without reducing RSS first; live neighbors can prevent returning a whole arena region.
- Use smaps_rollup for detailed current totals and VmSize for mapped virtual size. ru_maxrss and VmHWM are peaks and cannot show a current-memory decrease.

**Reproduce:** Build a C allocation probe with gcc -O2 -Wall -Wextra. At baseline and after each stage, read /proc/self/status VmSize and /proc/self/smaps_rollup Rss, Pss and private fields. Allocate 8192 blocks of 8192 bytes, checking every malloc; write through a volatile unsigned-char pointer once per sysconf(_SC_PAGESIZE) and at the last byte. Free even-index blocks while keeping odd ones live, reallocate those same-size blocks and touch them, then free all blocks. Print live requested payload at each stage: 0, 64 MiB, 32 MiB, 64 MiB, 0. Run three fresh processes pinned with taskset -c 2 and record CPU, kernel, GCC and glibc versions, raw snapshots and which pages were touched. Explain the observed retention or release; do not require RSS to equal payload or return exactly to baseline. A diagnostic strace -e trace=brk,mmap,munmap run can locate kernel mapping changes but is not a timing run.

**Traps**

- Calling retained free chunks a leak from one RSS snapshot. Show live ownership and bounded reuse before diagnosing growth.
- Reading an uninitialized or freed block to force residency. Write while it is live and never dereference it after free.
- Adding worker RSS values as physical usage, or interpreting a peak as current memory.

**Practice**

- The section mini-project covers this: staged live-byte and smaps accounting, repeated allocate/free/reuse cycles, one sparse mapping, and a diagnosis distinguishing retained capacity, shared pages and unbounded ownership growth.

**Stop when:** Your staged probe reports all five live-payload totals and current snapshots, and you explain retained or released pages without equating free, unmap, current RSS and peak RSS.

<details>
<summary>Self-test</summary>

1. Does malloc success prove every page has physical backing already?
   - No. Address-space reservation and allocator bookkeeping can succeed before first-touch backing is supplied. Overcommit and later resource pressure can still cause failure.
2. In a toy model, two processes each map 8 MiB private and the same 4 MiB shared resident pages. What are RSS and PSS per process?
   - RSS is 12 MiB each; PSS is 8+4/2 = 10 MiB each. Their represented physical footprint is 20 MiB, not the 24 MiB RSS sum.
3. Why might freeing alternate chunks leave residency high?
   - Live chunks can pin the surrounding arena pages or prevent region release, and the allocator can retain free chunks. The exact behavior depends on allocator policy and layout.
4. Can a stable peak RSS prove stable current memory after freeing?
   - No. Peaks do not fall. Compare current snapshots and ownership over repeated workload cycles.

</details>

#### U7. Files, page cache, fsync, atomic rename and durability

**About 5 h** · **Target:** Explain + Implement

Topics: Files, directories, permissions and filesystem metadata; Application buffering, page cache, flush, fsync and atomic rename; Acknowledged, written, flushed and durable state boundaries

Assume Programming's data-formats-ingestion and context-managers-exceptions units and their round-trip and cleanup exercises. A correct byte format is only the starting point: here you own publication, permissions, persistence boundaries and evidence after failure.

**You can now**

- Explain names, inodes, open files and directory permissions as separate filesystem state.
- Implement same-filesystem atomic replacement with checked file and directory synchronization.
- Distinguish accepted bytes, visible bytes, ordered writes and durability under a stated storage contract.
- Detect metadata inconsistency and payload corruption without mistaking detection for recovery.

**Study**

1. [Names, metadata and crash consistency](https://pages.cs.wisc.edu/~remzi/OSTEP/file-intro.pdf) (Operating Systems: Three Easy Pieces - selected foundations) - Chapter 39, Sections 39.1 and 39.7 to 39.16; Chapter 40, Sections 40.3 to 40.4 and 40.6 to 40.7; Chapter 42, Sections 42.1 to 42.3 (other chapters linked from the book contents). Depth: Draw directory entries, inodes and allocation bitmaps; then the data/inode/bitmap crash cases and journal commit boundary. Do not implement a filesystem.
2. [Integrity and its limits](https://pages.cs.wisc.edu/~remzi/OSTEP/file-integrity.pdf) (Operating Systems: Three Easy Pieces - selected foundations) - Chapter 45, Sections 45.3 to 45.7. Depth: Use checksum placement, misdirected/lost writes and scrubbing to separate corruption detection from redundancy-based repair.
3. [Durability and fsync](https://algomaster.io/learn/operating-systems/durability-and-fsync) (AlgoMaster Operating Systems - selected observation route) - Accepted, Visible, Ordered, and Durable; File Durability vs. Name Durability; Durable Atomic File Replacement. Depth: Pair with https://algomaster.io/learn/operating-systems/crash-consistency: Process Crashes vs. Machine Crashes; Metadata Consistency vs. File-Content Guarantees; Safe File Replacement as a Protocol. Keep device flush contracts and synchronization errors explicit.
4. [File and directory synchronization contracts](https://man7.org/linux/man-pages/man2/fsync.2.html) (Linux proc and strace references) - DESCRIPTION: fsync, fdatasync and directory entries; ERRORS; rename(2), DESCRIPTION: replacement, open descriptors and cross-filesystem failure. Depth: Use https://man7.org/linux/man-pages/man2/rename.2.html for the second contract. Atomic name replacement is not a power-loss guarantee.

**Focus**

- A directory maps names to inodes. Unlink removes a name; an open reference can keep data alive. Rename does not retarget existing open descriptors. Directory search permission governs traversal; directory write/search permission governs name changes, subject to sticky-bit and other policy.
- A language flush sends buffered bytes toward the kernel. Successful write can leave dirty page-cache pages; background writeback is not an application commit record.
- Set the new file's intended permissions before publication. Flush the language buffer, fsync the file, rename within the destination directory and fsync that directory before acknowledging durable publication under the filesystem/device contract.
- Journaling can preserve filesystem metadata consistency without preserving an application's multi-record invariant. A checksum detects some damage but supplies neither atomicity nor a missing good copy.

**Reproduce:** In a private temporary directory, create state containing b'old\n' and keep a reader open. Use tempfile.mkstemp in that same directory; fchmod its descriptor to 0o600, wrap it with os.fdopen(..., 'wb'), write b'new\n'*1024, flush and os.fsync before closing it. Call os.replace(temp, state), open the directory with O_RDONLY|O_DIRECTORY and fsync that descriptor before closing it. Reopen state and compare its SHA-256 with the intended payload; assert the retained reader still reads b'old\n' and the published mode is 0600. Run it with TMPDIR set to a directory on a disk-backed filesystem (check with findmnt -T; /tmp is tmpfs on many systems and never reaches a disk): TMPDIR="$PWD" taskset -c 2 strace -o publish.trace -e trace=openat,write,fsync,rename,renameat,renameat2,close,fchmod -- python3 -I publish.py. Identify the payload write, file fsync, successful rename and directory fsync in order. Check each exception and clean only your temporary files. Record filesystem/mount, kernel, Python and strace versions. This probe verifies visibility and syscall ordering, not recovered state after power loss.

**Traps**

- Calling close or Python flush a durability barrier, or ignoring a late fsync error and still reporting success.
- Creating the temporary file on another filesystem, where rename can fail with EXDEV, or forgetting directory synchronization after publication.
- Claiming a process kill simulates loss of the kernel page cache, or claiming a successful trace proves the drive honors its flush contract.

**Practice**

- [OSTEP fsck.py: metadata invariants](https://github.com/remzi-arpacidusseau/ostep-homework/tree/master/file-journaling) - README Overview; -s 1 -S 1 and -s 2 -S 2 with default sizes. Before -c, traverse directory references and compare inode types, bitmaps and link counts. Identify inconsistent state, not necessarily a unique historical cause. The seed-2 answer diagnostic reverses the type-change wording; compare the initial and final inode arrays rather than trusting that sentence.
- [OSTEP checksum.py: additive, XOR and Fletcher checksums](https://github.com/remzi-arpacidusseau/ostep-homework/tree/master/file-integrity) - README Overview; -s 1 -d 4 and -s 2 -d 4. Compute all three results before -c, using the script's modulo-255 Fletcher sums. Try -D 1,2 and -D 2,1 to expose order sensitivity. The README length example mistakenly uses -D; -d is length and -D is explicit data. Retain your publication trace in the section mini-project.

**Stop when:** The replacement checksum, old-descriptor assertion and mode check pass, your trace shows both synchronization scopes, and you solve both two-seed simulator exercises without claiming power-loss recovery.

<details>
<summary>Self-test</summary>

1. After replacement, why can an old reader still see the old payload?
   - Its open file description still references the old inode. New path lookup finds the replacement inode; rename changes the namespace, not existing open references.
2. Why synchronize the parent directory after fsync of the new file?
   - The file barrier covers its data and required metadata, not necessarily persistence of the directory entry naming it. The directory barrier covers publication under the supported filesystem contract.
3. Does a metadata journal guarantee an application never reads a torn record?
   - No. Filesystem consistency and application consistency differ. Use a record/publication protocol with validation and a stated recovery policy.
4. Can an additive byte checksum distinguish [1,2] from [2,1]?
   - No. Both sum to 3 modulo 256. A checksum has collision limits, and even a stronger digest cannot reconstruct lost bytes.

</details>

#### U8. I/O access patterns and storage devices

**About 4 h** · **Target:** Measure

Topics: Sequential, random, strided, buffered and memory-mapped I/O; RAID, SSD and device scheduling vocabulary

Assume Programming's data-formats-ingestion and profiling-benchmarking units. Keep parsing out of the timed region. This unit owns the access path and cache-state controls, not a second serialization throughput benchmark.

**You can now**

- Compare sequential, seeded-random and strided reads under explicitly matched warm-cache conditions.
- Explain buffered versus mapped I/O work and report the correct byte denominator for each measurement.
- Explain HDD positioning, SSD translation/garbage collection, NVMe queues and RAID failure boundaries without inferring device behavior from cache-hit timings.

**Study**

1. [Device service mechanisms](https://pages.cs.wisc.edu/~remzi/OSTEP/file-devices.pdf) (Operating Systems: Three Easy Pieces - selected foundations) - Chapter 36, Sections 36.3 to 36.5 and 36.7. Depth: Draw polling, interrupts and DMA ownership. DMA moves bytes without a CPU copy loop; it does not eliminate setup, completion or coherence work.
2. [The Page Cache and Write-Back](https://algomaster.io/learn/operating-systems/the-page-cache) (AlgoMaster Operating Systems - selected observation route) - The Cached Read Path; Read-ahead; The Shared Cache for Memory-Mapped Files; Write-Back: Moving Dirty Data Toward Storage. Depth: Relate mmap faults to the shared file cache. A warm read can still pay syscall, copy, translation and interpreter costs.
3. [Storage Hardware](https://algomaster.io/learn/operating-systems/storage-hardware) (AlgoMaster: hardware and container storage companions) - Hard Disk Drives; Solid-State Drives; NVMe Exposure of SSD Parallelism. Depth: Use seek/rotation/transfer, FTL, erase blocks, garbage collection and write amplification as vocabulary. No cold-device or endurance benchmark is required.
4. [RAID Fundamentals](https://algomaster.io/learn/operating-systems/raid) (AlgoMaster: hardware and container storage companions) - Comparing the Common Levels; Data-Integrity Limits of RAID; RAID vs. Backups. Depth: Optional device repair reading only. Distinguish capacity and disk-failure tolerance from corruption, deletion and independent backup recovery.

**Focus**

- Buffered read copies cache bytes into user buffers. Mmap installs mappings and faults as needed; reading one byte per block does less user-level copying than reading every block into a buffer.
- Prewarm the whole file before each variant. Warm page-cache state is not a promise of warm CPU caches or installed mmap PTEs; fsync and reopening do not evict cached pages. Never drop global caches on a shared host.
- HDD access combines positioning and transfer. SSD random access avoids mechanical seeks but still depends on queues, flash layout, controller policy and garbage collection.
- RAID is not a backup. Corruption, application deletion and correlated failures can affect every replica or parity set; usable capacity and tolerated disk losses depend on the level.

**Reproduce:** Create a private 16 MiB file of 4096 blocks, each 4096 bytes; fill block i with byte i%256, flush and fsync outside timing. Prepare orders range(4096), a copy shuffled by random.Random(7), and [(j*17)%4096 for j in range(4096)]; assert each visits every block once. Before every trial, read the full file in 1 MiB chunks to prewarm the page cache. Time with perf_counter_ns: os.pread(fd,4096,i*4096)[0] over each order; a fresh read-only mmap over each order reading mapping[i*4096]; and buffered f.read(4096)[0] in sequential order after seek(0). Include mapping creation/close in its timed scope. Sum sampled bytes; every result must equal 522240. Run five trials of every variant with TMPDIR on a disk-backed filesystem (findmnt -T; /tmp is often tmpfs): TMPDIR="$PWD" taskset -c 2 python3 -I io.py with CPython 3.14.4. Record all raw times, filesystem/mount, CPU, kernel and Python versions, block size, order, prewarm and scope. Pread/buffered return 16 MiB per pass, while mmap explicitly samples only 4096 bytes and incurs page-level access. Do not call their timing ratio a device-bandwidth speedup or require a winning order.

**Traps**

- Labeling the mmap sampled-byte loop a full 16 MiB copy, or dividing every variant by file size and calling the result physical-device bandwidth.
- Comparing one cold first variant with warm later variants, or keeping a mapping warm for one case while charging setup to another.
- Applying an HDD scheduling model or optional RAID capacity equation as a measured property of your SSD.

**Practice**

- [OSTEP disk.py: HDD positioning and scheduling](https://github.com/remzi-arpacidusseau/ostep-homework/tree/master/file-disks) - README Overview; -s 1 and -s 2 with -A 5,-1,0 -p FIFO, then -p SATF. Use the README's starting head position and default seek/rotation geometry. Predict request order and seek/rotation/transfer totals before -c. Keep units as simulator time units, not host milliseconds. The warm-cache experiment supplies the section mini-project's observation rather than validating this HDD model on an SSD.

**Stop when:** All five-repeat checksums agree, each timing states cache condition and work scope, and both two-seed disk predictions separate positioning from transfer without a host-device speed claim.

<details>
<summary>Self-test</summary>

1. Why does stride 17 visit all 4096 block indices?
   - 17 and 4096 are coprime. Multiplication by 17 modulo 4096 is a permutation, so the pass covers each block exactly once.
2. What is the sampled checksum for the file?
   - There are 16 repeats of bytes 0 through 255: 16*(255*256/2) = 522240. The file length is 4096*4096 = 16777216 bytes = 16 MiB.
3. Does a faster warm-cache random pass show that random SSD reads beat sequential reads?
   - No. It measures this application's warm-cache path, including syscall/copy or mapping costs. No device read or throughput claim follows without device-level evidence and cache controls.
4. For four equal D-byte disks, what are ideal usable RAID 0, 5 and 6 capacities?
   - 4D, 3D and 2D respectively, ignoring metadata. They tolerate zero, one and two disk failures in the ideal level model; none protects against all corruption or deletion.

</details>

#### U9. Namespaces, cgroups and container boundaries

**About 5 h** · **Target:** Explain + Implement

Topics: Namespaces, cgroups, mounts, users and container resource limits; Container images, layers, signals, shutdown and filesystem boundaries

Assume Programming's health-containers-runbooks unit, including non-root packaging, readiness, shutdown and restart exercises. Here you inspect the kernel views and accounting behind those runtime settings, and deliberately diagnose one contained OOM rather than rebuild the health-service exercise.

**You can now**

- Inspect namespace views, credentials, mounts and effective cgroup limits for one bounded container.
- Reproduce a cgroup memory-limit failure and retain runtime evidence before removing the container.
- Explain PID 1 signal/reaping duties and distinguish CPU throttling, OOM, failed task creation and full storage.
- Trace image layers, copy-up and mounted data to their visibility and lifetime boundaries.

**Study**

1. [Linux Namespaces](https://algomaster.io/learn/operating-systems/namespaces) (AlgoMaster Operating Systems - selected observation route) - Namespace Views vs. Physical Reality; Mount Namespaces; PID Namespaces; User Namespaces; Cgroup Namespaces; Inspecting a Container's Namespaces; Separation Limits of Namespaces. Depth: Inspect actual membership. Do not assume all namespace identifiers differ, that namespace root is host root, or that namespaces create resource budgets.
2. [Control Groups](https://algomaster.io/learn/operating-systems/cgroups) (AlgoMaster Operating Systems - selected observation route) - The Unified Cgroup v2 Tree; The Cgroup Hierarchy; Hard CPU Bandwidth Boundaries from Quotas; CPU Placement with Cpuset; Memory Accounting; Meanings of Cgroup Memory Boundaries; Limiting Process and Thread Creation. Depth: Read status through the runtime-created cgroup. Do not write policy into a system-owned hierarchy or enable privileged scheduling.
3. [PID 1 and Signal Handling](https://algomaster.io/learn/operating-systems/pid-1-and-signal-handling) (AlgoMaster Operating Systems - selected observation route) - Special Signal Behavior of PID 1; Signals to PID 1 vs. Broadcasts; Using exec in an Entrypoint Script; Direct Execution: Signal Routing vs. Handling; Child-Reaping Responsibilities of PID 1; When to Use a Minimal Init Process.
4. [Container Resource Failures](https://algomaster.io/learn/operating-systems/container-resource-failures) (AlgoMaster Operating Systems - selected observation route) - Failure Shapes Across Resource Limits; Finding the Effective Boundary; Reading Memory Events as Evidence; Exit Code 137 vs. OOM Proof; Capturing Evidence Before the Container Disappears. Depth: Classify delay, failed operation, death and platform eviction separately. A live PID 1 does not prove every worker survived.
5. [Container File Systems](https://algomaster.io/learn/operating-systems/container-file-systems) (AlgoMaster: hardware and container storage companions) - What an Image Contains; Immutable Image Layers; The OverlayFS Model; Writing Causes Copy-Up; Markers for Lower-Layer File Deletion; The Container Writable Layer; Persistent Data Outside the Instance Layer; Image Paths Hidden by Mounts. Depth: Explain manifests/configuration/layer diffs and the OverlayFS model without assuming every runtime uses that driver. Stop before driver tuning.

**Focus**

- Namespaces scope lookup and visibility while sharing the kernel. Cgroup namespaces scope the hierarchy view, not budgets. A non-root UID and user-namespace mapping are different facts; inspect uid_map and actual membership rather than infer authority from whoami.
- CPU quota limits aggregate time, cpuset limits eligible CPUs and weight affects contested sharing. Memory charges include cache and kernel work, not merely application heap or summed RSS.
- Exec-form startup routes the stop signal to the intended program but does not install its handler. PID 1 must handle expected signals and reap children or delegate to a suitable init; SIGKILL offers no cleanup path.
- Copy-up creates a writable version; whiteouts hide lower files without erasing old layer bytes. Mounts can hide image paths; volumes, bind mounts and tmpfs have different lifetimes. Keep exit reason, limits and event deltas before teardown; a replacement instance's counters cannot explain the old failure.

**Reproduce:** Use the official python:3.14-slim image pinned by digest (python@sha256:a2b82f3c48559aa0a8446d9af49826b6e2b2016f4cd2afabfe6013ec53729170), or another official Python image whose digest you record. Write an OOM probe that prints getpid/getuid and /sys/fs/cgroup/{memory.max,memory.swap.max,cpu.max,memory.events}, prints READY with flush, then waits for /tmp/go before retaining newly allocated 8 MiB bytearrays in a list indefinitely. Start it with docker run -d --network=none --user=65534:65534 --cpuset-cpus=2 --cpus=0.5 --memory=64m --memory-swap=64m IMAGE python -I -u PROBE, using a read-only bind-mounted probe or equivalent -c code. Save its returned container ID; do not use --rm. After READY, record docker version, image digest, docker inspect limits, host PID and docker logs. Compare readlink /proc/self/ns/{pid,mnt,net,uts,user,cgroup} outside with docker exec CID readlink /proc/1/ns/TYPE and read uid_map. Host /proc/<pid>/ns access may be denied; the exec view is a documented fallback, not permission bypass. On a cgroup v2 host the probe prints memory.max 67108864, memory.swap.max 0 and cpu.max '50000 100000'. Run docker exec CID touch /tmp/go, then docker wait CID and docker inspect --format 'exit={{.State.ExitCode}} oom={{.State.OOMKilled}}' CID. Verify exit=137 and oom=true before docker rm CID; preserve full state/logs and use exact-ID cleanup on failure. This is one bounded OOM observation, not a throughput experiment or proof of graceful shutdown. No Kubernetes cluster action is required.

**Traps**

- Using --rm and losing stopped-container evidence, or treating 137 alone as OOM proof. An unhealthy flag does not itself trigger a plain Docker restart; Kubernetes readiness, liveness and eviction are separate actions.
- Calling --cpus=0.5 a core reservation or assuming taskset on the Docker client pins the container. Set --cpuset-cpus=2 for the workload.
- Calling an image-layer deletion secret erasure, a container stop volume deletion, or a persistent volume an automatic durability guarantee.

**Practice**

- The section mini-project covers this: one retained and inspected container OOM, namespace/credential and mount diagrams, configured versus effective limits, an explanation of PID 1 duties, and an orchestrator checklist separating exit-driven restart, readiness, liveness, eviction and volume lifecycle. Reuse Programming's shutdown evidence instead of repeating its service exercise.

**Stop when:** You retain exit=137 plus OOMKilled=true before cleanup, explain the effective no-swap and CPU policies, and map namespace, credential, storage and supervisor boundaries without claiming a private kernel or untested shutdown behavior.

<details>
<summary>Self-test</summary>

1. With cpu.max='50000 100000', how fast can two simultaneous busy threads spend the quota?
   - In the ideal model, 25 ms of wall time consumes 50 ms aggregate CPU time. Quota replenishes per period; actual scheduling and affinity can prevent that parallel execution.
2. Why does --memory=64m --memory-swap=64m give zero allowed swap in this run?
   - Docker's memory-swap value is the total memory-plus-swap budget. Equal totals leave no swap budget; the cgroup-v2 memory.swap.max observation is 0.
3. Does a different mount namespace imply different stored bytes?
   - No. Different mount trees can deliberately reach the same underlying file through bind mounts or shared filesystems. Views and storage ownership are separate.
4. How should CPU exhaustion, PID exhaustion and memory OOM differ?
   - CPU quota usually delays runnable work; pids.max rejects new processes or threads; unreclaimable pressure at memory.max can kill a selected task. Capture policy and matching counter deltas rather than diagnose from host idle capacity.

</details>

#### U10. Binary logic and machine language with Nand2Tetris

**About 8 h** · **Target:** Implement

Topics: Binary logic and machine-language repair through two Nand2Tetris projects

This is optional repair, not a second systems curriculum. Assume Programming's integers-pointers-spans and compile-link-abi units. First derive XOR's four rows and trace @7; D=A; @3; M=D; @3; D=M; @END; D;JEQ. If both are correct without notes, skip this unit; otherwise repair logic and machine execution through Projects 1 and 4 only.

**You can now**

- Derive basic Boolean gates from Nand and verify every input row.
- Trace Hack A/D registers, addressed RAM and conditional jumps separately.
- Implement and test the two selected projects only when the binary/instruction entry check reveals a gap.

**Study**

1. [Project 1: Boolean Logic](https://www.nand2tetris.org/project01) (Nand2Tetris - Projects 1 and 4 only) - Objective; Chips; Contract; Resources; Tips. Depth: Use the primitive Nand and supplied interfaces/tests to implement the listed gates. Stop before Project 2; built-in primitive behavior is a logical contract, not transistor timing.
2. [Project 4: Machine Language](https://www.nand2tetris.org/project04) (Nand2Tetris - Projects 1 and 4 only) - Objective; Programs: Mult.asm and Fill.asm; Contract; Resources; Proposed Implementation. Depth: Use the linked Chapter 4 machine-language specification for A/C instructions and memory map. Mult assumes nonnegative inputs and product below 32768. Do not add assembler, CPU or compiler projects.
3. [Official simulator access](https://www.nand2tetris.org/software) (Nand2Tetris - Projects 1 and 4 only) - Online IDE; official link to https://nand2tetris.github.io/web-ide/chip/. Depth: Use the online chip and CPU tools, or the desktop suite, which needs Java. The truth-table and interpreter checks below do not replace the supplied .tst/.cmp tests.

**Focus**

- Nand is false only when both inputs are true. Check each truth table independently of HDL wiring. Bus gates act bitwise; mux/demux routes values rather than adding them. Keep widths and pin directions explicit.
- An A instruction loads A. In a C instruction, M refers to RAM addressed by A, while D and A are registers. Loading an address is not dereferencing it.
- Mult uses repeated addition with a loop invariant; Fill repeatedly examines the keyboard and updates screen words. Neither task models a host CPU pipeline or operating system.
- Use entry-check failure to justify this detour. Exit as soon as the selected official tests and explanation pass; do not follow the full hardware/software sequence.

**Reproduce:** Closed book, define n(a,b)=1-(a&b) for bits. Derive Not=n(a,a), And=n(n(a,b),n(a,b)), Or=n(n(a,a),n(b,b)); for XOR set t=n(a,b), then n(n(a,t),n(b,t)). Enumerate all four (a,b) pairs in a small Python oracle and assert agreement with bitwise not/and/or/xor. Then write Mult.asm: clear R2, copy R1 into a count variable; at LOOP exit to END when count is zero, otherwise add R0 into R2, decrement count and jump to LOOP; END jumps to itself. Trace (R0,R1)=(0,7),(6,7),(1,0),(181,181), expecting R2=0,42,0,32761 with R0/R1 preserved. Check those traces with a small interpreter of your own covering exactly the used A/C instructions, including 16-bit arithmetic and label addresses; run taskset -c 2 python3 -I logic-oracle.py. State that this is a subset oracle you wrote, not the official simulator. For actual project completion, run the named official tests in practice and retain their results; no official simulator run is claimed here.

**Traps**

- Confusing @7; D=A with @7; D=M. One copies the constant address, the other reads RAM[7].
- Treating repeated addition as a signed-overflow-safe general multiplier. Stay within the stated Project 4 input contract.
- Calling your own oracle an official .tst/.cmp pass, or turning an optional repair into all twelve projects.

**Practice**

- [Nand2Tetris Project 1: the supplied gate test suite](https://www.nand2tetris.org/project01) - Chips and Contract; supplied .tst and .cmp for Not through DMux8Way, excluding primitive Nand. Implement the listed scalar/bus logic, mux and demux chips in HDL. Run each supplied test and save comparisons. Only undertake this repair if the entry check failed.
- [Nand2Tetris Project 4: Mult.asm and Fill.asm](https://www.nand2tetris.org/project04) - Programs: Mult.tst; Fill.tst (interactive, no compare file); FillAutomatic.tst and FillAutomatic.cmp; Contract. Test Mult within its stated bounds, then Fill with keyboard released and pressed in the CPU emulator. Use the automatic comparison plus the interactive screen check; save which tool and tests actually ran. Skip all intervening and subsequent projects.

**Stop when:** Either both entry checks pass and you skip the repair, or the selected Project 1 gate comparisons and Project 4 multiplication/screen tests pass and you can explain register, memory and branch effects without notes.

<details>
<summary>Self-test</summary>

1. What are XOR outputs for (0,0),(0,1),(1,0),(1,1)?
   - 0,1,1,0. The four-Nand construction uses t=Nand(a,b), then Nand(Nand(a,t),Nand(b,t)).
2. After the entry-check instructions, what are A, D and RAM[3], and is JEQ taken?
   - A holds the END label's ROM address, D is 7 and RAM[3] is 7. JEQ is not taken because D is not zero. END's numeric address depends on the complete program.
3. What invariant proves the repeated-addition loop?
   - After k additions, R2=k*R0 and count=original R1-k. At count zero, R2=R0*original R1. The stated bounds keep the result within the nonnegative Hack contract.
4. Why does Fill keep polling the keyboard after painting the screen?
   - The input can change. The program must repeatedly choose black or white and repaint; one keyboard read or one screen write cannot implement the continuing contract.

</details>

### Mini-project: Mechanisms laboratory: a kernel, a process tree, a file and a container, each with a check

**About 12 to 16 hours.** Start the one repository the whole stage builds on with its mechanisms laboratory: small C and Python experiments that each print a correctness check and keep their raw output beside the environment that produced it. Cover a vectorized kernel, a locality sweep, a supervised pipe worker, staged memory accounting, an atomic file publication and a retained container OOM. The publication helper and the supervisor carry into the service slice.

1. Create the repository with lab/, kv/ and dossier/ directories. Every lab experiment is one make target that writes its raw output and an environment file: lscpu, lscpu -e, uname -r, compiler and glibc versions (ldd --version), python3 -VV and the CPUs it was pinned to. Read the core map before pinning and choose one logical CPU per physical performance core, since SMT siblings share a core (on an i9-12900K, CPUs 0 and 1 are one core). Timed targets run one warm-up and at least five timed repeats and keep every raw time.
2. Keep the bump and chain kernels with their 531996 checks and add a branch variant that sums only the odd elements, over random and over sorted input. Build each with -O3 -march=x86-64-v3 and again with -fno-vectorize -fno-slp-vectorize, save objdump -d for every build, and check in the saved assembly whether the compiler kept the branch or turned it into a select or a vector blend before attributing any time difference to branch prediction. Time all variants pinned, with flags, warm-up and repeats in the table.
3. Extend the corrected locality experiment (2139095040 per traversal) into two sweeps. The working-set sweep runs from 16 KiB to 256 MiB, doubling, with a dependent pointer chase over a random cyclic permutation and a sequential stream over the same buffer; the stride sweep walks one 64 MiB buffer at strides from 4 bytes to 4 KiB. Read cache sizes and the line size from /sys/devices/system/cpu/cpuN/cache before predicting where the chase slows, and make both loops print checksums that a Python oracle reproduces. Keep five pinned repeats per point and a topology note: one NUMA node in lscpu means no remote-NUMA claim.
4. Write lab/supervise.py. Keep the launcher trace from the processes unit (fork, execve and wait4 in strace -f, exit 7 and launch failure 127), then run a worker that talks to the parent over two pipes, and draw the descriptor ownership diagram before coding. Seed a leaked writer: a forked Python worker that runs without exec keeps every inherited descriptor, so if it keeps its copy of the request write end it never sees EOF and the parent times out waiting for the response. The regression test fails on the seeded worker and passes once the worker closes that end. Terminate a ready worker with SIGTERM, observe state Z with waitid and WNOWAIT, reap it and decode WTERMSIG, and make every exit path, including an exception in the parent, close its descriptors and reap.
5. Keep the virtual-memory evidence: 4096 minor faults on the first write pass over a 16 MiB mapping of 4 KiB pages and 0 on the second, and a forked child's private write that leaves the parent's byte at 1. Extend the allocation probe to five allocate, free-even, reuse and free-all cycles, printing live requested payload beside VmSize and smaps_rollup Rss, Pss and private fields at every stage. Add one sparse mapping: 1 GiB anonymous with MADV_NOHUGEPAGE (with transparent huge pages set to always, each touch could fault a whole 2 MiB page), one byte touched per 2 MiB; Rss grows by about 2 MiB while VmSize grows by 1 GiB. Write the diagnosis: which retained memory is reusable allocator capacity, which is shared, and what pattern would show unbounded ownership growth instead.
6. Turn the publication experiment into lab/publish.py: publish_atomic(path, data) writes a temporary file in the target directory, fsyncs it, renames it over the target and fsyncs the directory, raising if any step fails. Keep its strace on a disk-backed filesystem (check with findmnt -T) showing the payload write, file fsync, rename and directory fsync in that order, and test that a failure injected at each step leaves the old file intact and that a reader holding the old file still reads the old bytes. Keep the warm-cache pread, mmap and buffered comparison (522240 for every variant) with five raw trials and the filesystem named, labeled as page-cache reads, not device latency.
7. Run the OOM probe in python:3.14-slim pinned by digest with --memory=64m --memory-swap=64m --cpus=0.5 --cpuset-cpus=2 and no --rm. Retain exit=137 and OOMKilled=true from docker inspect, the memory.events counts and the logs before docker rm. Compare configured limits from docker inspect with the effective ones the probe printed (memory.max 67108864, memory.swap.max 0, cpu.max 50000 100000 on a cgroup v2 host). Draw the namespace and credential diagram from readlink /proc/1/ns/* and uid_map and the mount diagram (image layers, the read-only bind mount, tmpfs). Write which PID 1 duties your Programming stage's shutdown evidence already shows and which it does not, and an orchestrator checklist separating exit-driven restart, readiness, liveness, eviction and volume lifecycle.
8. Add the logic-machine oracle (the NAND-derived gates and the Mult.asm interpreter with R2 = 0, 42, 0 and 32761) to the lab, and give the whole lab one make check that rebuilds every experiment from a clean clone and asserts its correctness check before any timing is read.

**Deliverables**

- The lab/ directory: one make target per experiment, raw outputs, environment files and a make check that asserts every correctness check (kernel sums, locality checksums, pipe round trip, payload totals, publication digest, logic oracle).
- The kernel, locality and I/O tables with pinned raw repeats, flags, saved assembly, cache sizes, the filesystem and the topology note.
- lab/supervise.py with its descriptor diagram, the leaked-writer regression and the zombie and reaping tests.
- The memory diagnosis and the container report: retained OOM evidence, configured versus effective limits, namespace, credential and mount diagrams, PID 1 duties and the orchestrator checklist.

**Checks**

- rubric: Self-grade with the rubric below.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Correctness before timing | Every experiment prints a check that make check asserts, and make check passes from a clean clone. | Each timing table names the oracle it was checked against and a defect that oracle would catch. |
| Measurement discipline | Every number carries the CPU, kernel, compiler or Python version, flags, pinning, warm-up and repeats, and raw times are kept. | Kernel and locality differences are explained from saved assembly and inspected cache sizes, and the write-up lists the effects it did not test, such as frequency scaling, TLB reach and prefetching. |
| Processes and descriptors | The leaked-writer regression fails on the seeded worker and passes after the fix, the signal test observes Z and decodes WTERMSIG, and every path reaps. | The descriptor diagram predicts the close calls seen in strace, and an injected parent exception still leaves no zombie and no open pipe. |
| Memory and files | The staged probe reports every live-payload total with current snapshots, the sparse mapping shows VmSize and Rss apart, and the publication strace shows write, fsync, rename and directory fsync in order. | The diagnosis separates allocator retention from growth using the five-cycle data, and the injected publication failures each leave the old file intact. |
| Container boundary | exit=137 and OOMKilled=true are retained with memory.events before cleanup, and configured and effective limits match or the difference is explained. | The orchestrator checklist names, for each action, the signal that triggers it and the evidence that would show it happened. |

Feeds into: Capstone mechanisms laboratory: every experiment here is part of it. Service slice: publish_atomic publishes the store manifest, and the supervisor starts, signals and reaps the service in fault tests.

### Resource route

- **Primary - Theory:** [Operating Systems: Three Easy Pieces - selected foundations](https://pages.cs.wisc.edu/~remzi/OSTEP/) - Read Chapters 4-7, 13-15, 18-21, 36, 39-40, 42 and 45. Work from process state to address translation, devices, files, journaling and integrity. For every chapter, draw the owned state and one failure boundary instead of collecting summaries.
- **Required - Course:** [MIT 6.1810 - selected xv6 process and memory labs](https://pdos.csail.mit.edu/6.1810/2025/schedule.html) - Use Fall 2025 Lectures 1, 3-6, 8 and 10-11. Complete the util lab, one syscall task, and the page-table inspection plus ugetpid task from pgtbl. Add cow only if copy-on-write remains unclear. Keep all work in your own course checkout and stop before the full xv6 sequence.
- **Required - Practice:** [OSTEP homework - process, paging, disk and integrity simulators](https://pages.cs.wisc.edu/~remzi/OSTEP/Homework/homework.html) - Solve process-run.py, paging-linear-translate.py, paging-policy.py, disk.py, fsck.py and checksum.py for at least two seeds each before using the answer flag. Then reproduce one prediction using strace, /proc or a small local program.
- **Support - Revision:** [AlgoMaster Operating Systems - selected observation route](https://algomaster.io/learn/operating-systems/course-roadmap) - After OSTEP, use the matching lessons as a second explanation and recall check: fork, exec, wait, and exit; Zombies and Orphans; Signals; Context Switching; The Process Address Space; Paging; The TLB: Hits, Misses, and Invalidation; Page Faults; Copy-on-Write; mmap and Memory-Mapped Files; How malloc Works; VSZ, RSS, PSS, and What They Mean; File Descriptors; The Page Cache and Write-Back; Durability and fsync; Crash Consistency; Linux Namespaces; Control Groups; PID 1 and Signal Handling; Container Resource Failures; and the Investigating lessons. Treat quizzes as recall checks and keep your own traces as evidence.
- **Support - Reference:** [Linux proc and strace references](https://man7.org/linux/man-pages/man5/proc.5.html) - Use proc(5), getrusage(2), mmap(2), fsync(2), rename(2), wait(2) and signal(7) while tracing a parent-child pipe, page faults, file publication and a resource-limit failure. Record exact commands and raw observations.
- **Optional - Repair:** [Nand2Tetris - Projects 1 and 4 only](https://www.nand2tetris.org/course) - Use Project 1 for Boolean logic and Project 4 for machine-language execution only if the binary or instruction-level entry check fails. Do not take the full course as a second systems curriculum.
- **Support - Theory:** [CS 3410: Pipelining & Performance](https://www.cs.cornell.edu/courses/cs3410/2025fa/notes/pipelining.html) - Use Iron Law of Processor Performance, Pipelined Processors, Performance of Pipelined Processors, Latency vs. Throughput and Hazards. Treat the five-stage machine as a model, not the host CPU.
- **Support - Reference:** [Auto-Vectorization in LLVM](https://llvm.org/docs/Vectorizers.html) - Use Loop Vectorizer Usage, Diagnostics, unknown trip counts, pointer checks, reductions, if conversion and partial unrolling. Skip the historical performance charts and compiler implementation work.
- **Support - Revision:** [AlgoMaster: hardware and container storage companions](https://algomaster.io/learn/operating-systems/course-roadmap) - Use The Memory Hierarchy and Why Latency Matters; Memory Ordering, Barriers, and False Sharing (coherence and false-sharing headings only); Huge Pages, NUMA, and ASLR (NUMA headings only); Storage Hardware; RAID Fundamentals (comparison and backup boundaries); and Container File Systems. These fill hardware and image-layer gaps outside the pool's selected OS revision lessons.

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

### Study units

#### U1. Threads, interleavings and memory consistency

**About 3 h** · **Target:** Explain

Topics: Threads versus processes and shared versus isolated state; Scheduling, interleavings, preemption and critical sections; Atomicity, visibility, ordering and memory consistency vocabulary

Programming's asyncio queues and TaskGroup assume threads and tasks already exist. This unit goes one level down to the mechanism they rest on: preemptive scheduling of threads over shared memory. It assumes programming/concurrency-profiling-operations concurrency-models-gil as background and does not re-teach async tasks.

**You can now**

- Explain how threads share an address space while processes isolate state, and what that sharing exposes to scheduling.
- Enumerate the legal interleavings of a two-thread increment and name the schedules that lose an update.
- Define atomicity, visibility and ordering, and state which guarantees a lock supplies beyond mutual exclusion.

**Study**

1. [Threads: shared state and uncontrolled scheduling](https://pages.cs.wisc.edu/~remzi/OSTEP/threads-intro.pdf) (Operating Systems: Three Easy Pieces - concurrency) - Sections 26.1 to 26.5: why threads share state, the shared-data example, uncontrolled scheduling and the wish for atomicity.
2. [Thread API: creation, joining and build flags](https://pages.cs.wisc.edu/~remzi/OSTEP/threads-api.pdf) (Operating Systems: Three Easy Pieces - concurrency) - Sections 27.1, 27.2 and 27.5, including the build line gcc -o main main.c -Wall -pthread.
3. [Processes vs Threads](https://algomaster.io/learn/concurrency-interview/processes-vs-threads) (AlgoMaster Concurrency lessons) - What is a Process? and What is a Thread?: shared address space against isolated state.
4. [Race Conditions and Critical Sections](https://algomaster.io/learn/concurrency-interview/race-conditions-and-critical-sections) (AlgoMaster Concurrency lessons) - The Shared Counter Problem; Why count++ Is Not One Step; What is a Race Condition; Race Condition vs Data Race.

**Focus**

- Threads of one process share code, heap, globals and file descriptors; each thread keeps its own registers, stack and program counter. A process boundary isolates memory, a thread boundary does not.
- count++ compiles to load, add and store. Any preemption or parallel execution between those steps can discard one thread's update. The compiler may also collapse the whole loop at -O2; the races unit measures that case.
- Atomicity means no visible intermediate state. Visibility means a write becomes observable to another thread. Ordering constrains which orders are observable. A mutex supplies all three for its critical section; a bare flag supplies none.

**Reproduce:** Closed-book, write the read, add and write table for two threads incrementing a shared counter from 5. Show one schedule that ends at 6 and state what each thread read. Then state, from the brute-force count, how many of the 20 legal orders of the six steps end at 6 and how many end at 7.

**Traps**

- One run's exact total proves nothing. Optimization level, core placement and timing decide what you see; ThreadSanitizer decides whether a race exists.
- Threads and processes do not differ only in creation cost. The defining difference is shared against isolated address space and what must be synchronized as a result.
- Atomicity, visibility and ordering are three distinct guarantees. Making a flag visible does not make a read-modify-write atomic.

**Practice**

- [OSTEP Chapter 26 simulation: loop.s, looping-race-nolock.s and wait-for-me.s](https://github.com/remzi-arpacidusseau/ostep-homework/tree/master/threads-intro) - threads-intro folder: run x86.py on loop.s, looping-race-nolock.s and wait-for-me.s and answer the chapter's homework questions 1 to 10, including the critical-section question 6. Predict each trace on paper first, then check it with the -c flag.

**Stop when:** You can write the 5-to-6 table from memory, explain the 18-to-2 split, and predict the simulator traces for all ten chapter questions before checking them.

<details>
<summary>Self-test</summary>

1. Two threads each run read, add, write on a counter holding 5. Which final values are possible, and how do the 20 legal orders split?
   - 6 or 7. 18 orders end at 6: every order where both threads read 5 before either writes 6. Only the 2 fully serial orders end at 7. Count verified by enumerating all linear extensions of the two read-add-write chains.
2. What state do threads share after pthread_create, and what stays private?
   - Shared: the address space (code, heap, globals) and file descriptors. Private: registers, stack, program counter and thread-local storage.
3. Why does OSTEP Section 27.5 put -pthread on the build line?
   - It sets the compiler defines for threaded code and links the threads library. Since glibc 2.34 the pthread functions live in libc, so a build without it often links anyway; -pthread remains the portable form.
4. A learner says visibility follows from atomicity. What is the counterexample?
   - An aligned int flag never tears, yet a loop reading it with a plain load may be compiled to read it once and spin forever. A relaxed atomic flag does become visible, but does not carry the data written before it; that needs release on the writer and acquire on the reader.

</details>

#### U2. Mutexes, condition variables, semaphores and barriers

**About 4 h** · **Target:** Explain + Implement

Topics: Mutex ownership, lock granularity and lock ordering; Condition variables, predicates, waits and notifications; Semaphores, barriers and read-write locks

Programming's synchronization-hazards unit showed a lock-order deadlock and a blocking queue in Python. This unit rebuilds the same primitives from C pthreads down to the futex, so blocking, ownership and wakeup have a mechanism, not just an API. It assumes that unit as background and never reuses its TaskGroup demo.

**You can now**

- Explain mutex ownership, blocking against spinning, and how a futex keeps the uncontended path in user space.
- Implement a correct producer-consumer queue with one mutex and while-loop waits, and show the if version failing.
- Choose semaphores, barriers and read-write locks for ordering, rendezvous and read-mostly sharing.

**Study**

1. [Locks: idea, pthread API and evaluation](https://pages.cs.wisc.edu/~remzi/OSTEP/threads-locks.pdf) (Operating Systems: Three Easy Pieces - concurrency) - Sections 28.1, 28.2 and 28.4: the basic idea, pthread locks, and the mutual-exclusion, fairness and performance criteria.
2. [Condition variables and the bounded buffer](https://pages.cs.wisc.edu/~remzi/OSTEP/threads-cv.pdf) (Operating Systems: Three Easy Pieces - concurrency) - Sections 30.1 and 30.2 with Figure 30.9: Mesa semantics, the stolen signal, and why the woken thread re-checks.
3. [Semaphores: definition, ordering and the bounded buffer](https://pages.cs.wisc.edu/~remzi/OSTEP/threads-sema.pdf) (Operating Systems: Three Easy Pieces - concurrency) - Sections 31.1 to 31.5: binary against counting semaphores, ordering, the semaphore bounded buffer and reader-writer locks.
4. [Mutex](https://algomaster.io/learn/concurrency-interview/mutex) (AlgoMaster Concurrency lessons) - How Mutex Works; Key Operations; Performance Considerations. Depth: Treat its 10 ns to 100 us cost table as trend only; measured numbers come from the contention unit.
5. [Condition Variables](https://algomaster.io/learn/concurrency-interview/condition-variables) (AlgoMaster Concurrency lessons) - What is a Condition Variable; How Condition Variables Work; Why use the Mutex.
6. [Barriers and Latches](https://algomaster.io/learn/concurrency-interview/barriers-and-latches) (AlgoMaster Concurrency lessons) - How Barriers Work; Implementing Barriers and Latches.
7. [pthread and futex contracts](https://man7.org/linux/man-pages/man3/pthread_mutex_lock.3.html) (Linux man-pages: pthreads and futex) - pthread_mutex_lock page for blocking acquire and ownership; pthread_cond_wait page for atomic release-and-wait and spurious wakeups; futex(2) for FUTEX_WAIT_PRIVATE and FUTEX_WAKE_PRIVATE.

**Focus**

- A mutex has an owner: the thread that locks must unlock. A semaphore has no owner: any thread may post. Mixing the two disciplines causes lost wakeups and double releases.
- pthread_cond_wait atomically releases the mutex and sleeps, and holds the mutex again on return. A signal is a hint, not a handoff: Mesa semantics plus spurious wakeups force the while loop.
- Uncontended pthread mutexes stay in user space: 1000 lock and unlock pairs issue zero futex calls under strace -f -c (glibc 2.43, Linux 7.0). A blocked lock issues FUTEX_WAIT_PRIVATE and the unlock wakes it with FUTEX_WAKE_PRIVATE.
- One condition variable per predicate: producers wait for not-full, consumers for not-empty. A single CV with if lets a stolen signal consume from an empty buffer, exactly Figure 30.9.

**Reproduce:** From a blank file, write the lost-wakeup demo in C with gcc 15.2 -O2 -pthread: signal with no waiter, then wait, and show the consumer blocks until a second signal and prints ready=2. Convert the wait to while (ready == 0) and show the consumer prints ready=1 with a -fsanitize=thread build reporting no races. State the compiler, flags and sanitizer with the result.

**Traps**

- A signal with no waiter is not queued. If the predicate changed before the wait, the signal is gone; only the while loop over shared state is correct.
- Holding a lock across a slow call serializes every contender, but moving the check out of the lock reintroduces check-then-act. Keep exactly the state transition inside.
- Published cost tables are trends, not measurements. On an i9-12900K an uncontended lock plus increment cost about 10.5 ns per op and four threads on four cores about 41 to 48 ns; the contention unit shows how those were measured.

**Practice**

- [OSTEP condition-variable homework: break and repair the bounded buffer](https://github.com/remzi-arpacidusseau/ostep-homework/tree/master/threads-cv) - threads-cv folder: build with make, run ./main-two-cvs-if -l 50 -m 1 -p 1 -c 2 (ten of ten reference runs stopped with error: tried to get an empty buffer), then ./main-two-cvs-while with the same flags, which drains all 50 items. gcc 15.2 builds the folder with warnings only. Use -v to watch the buffer while it fails.
- [OSTEP semaphore skeletons: rendezvous and barrier](https://github.com/remzi-arpacidusseau/ostep-homework/tree/master/threads-sema) - threads-sema folder: fill rendezvous.c, then barrier.c; each child prints its before line before either prints its after line. Build each with gcc -pthread; common_threads.h in the folder wraps the calls with error checks.

**Stop when:** The if version fails on demand, the while version drains every configuration you try, and you can state the futex evidence for blocked against uncontended locking.

<details>
<summary>Self-test</summary>

1. What does pthread_cond_wait do with the mutex, step by step?
   - It atomically releases the mutex and sleeps. On wakeup it reacquires the mutex before returning, so the woken thread holds the mutex when wait returns.
2. Two consumers share a buffer of one slot with if instead of while. Walk the failure.
   - Consumer Tc1 waits on empty. The producer fills the slot and signals Tc1. Before Tc1 runs, Tc2 consumes the item. Tc1 resumes past the if and gets from an empty buffer; the homework program prints error: tried to get an empty buffer.
3. When does a pthread mutex enter the kernel?
   - Only on contention: to block in FUTEX_WAIT_PRIVATE or to wake a waiter with FUTEX_WAKE_PRIVATE. Uncontended acquire and release are user-space atomics; 1000 pairs showed zero futex calls.
4. Why must the locker be the unlocker for a mutex, while any thread may post a semaphore?
   - Ownership lets the implementation track the holder for handoff and error checking. A semaphore is a counter with no holder, so release-by-other is the intended use, as in producer-posts while consumer-waits.

</details>

#### U3. Atomic operations, compare-and-swap and memory ordering

**About 3 h** · **Target:** Explain

Topics: Atomic operations and compare-and-swap vocabulary; Relaxed memory ordering beyond working vocabulary

Locks serialize contenders through the kernel; atomics let threads detect conflicts and retry in user space. This is the vocabulary behind every lock-free claim the later storage units make. It assumes programming/native-systems-literacy native-threads-atomics as background and takes it to the hardware primitive and the ordering contract.

**You can now**

- Explain compare-and-swap as one atomic hardware step, and write the retry loop that makes it a lock-free update.
- Use weak against strong compare-exchange correctly, and state where spurious failure is allowed.
- State what relaxed ordering does and does not guarantee, and when a counter needs nothing stronger.

**Study**

1. [Test-and-set, compare-and-swap and fetch-and-add](https://pages.cs.wisc.edu/~remzi/OSTEP/threads-locks.pdf) (Operating Systems: Three Easy Pieces - concurrency) - Sections 28.7 and 28.9 to 28.11: spin locks from test-and-set, the CAS primitive and fetch-and-add.
2. [Compare-And-Swap (CAS)](https://algomaster.io/learn/concurrency-interview/compare-and-swap) (AlgoMaster Concurrency lessons) - What is Compare-and-Swap; Hardware-Level Implementation (CMPXCHG); The CAS Loop Pattern; Weak vs Strong CAS.
3. [Atomic Operations](https://algomaster.io/learn/concurrency-interview/atomic-operations) (AlgoMaster Concurrency lessons) - What are Atomic Operations; Memory Ordering; Producer-Consumer Flag. Depth: Read for vocabulary; the C11 reference below is the contract.
4. [C11 compare-exchange and memory orders](https://en.cppreference.com/c/atomic/atomic_compare_exchange) (cppreference: C atomic operations) - Success and failure semantics with the expected-pointer update rule; then read the linked memory_order page for the six orderings and what relaxed permits.
5. [__atomic builtins for the reproduce step](https://gcc.gnu.org/onlinedocs/gcc/_005f_005fatomic-Builtins.html) (GCC __atomic builtins) - __atomic_compare_exchange and __atomic_load: the expected-pointer update and the __ATOMIC_RELAXED constant.

**Focus**

- CAS compares and swaps as one hardware step (x86 CMPXCHG). Everything else, the loop, the backoff, the ABA guard, is software around it.
- C11 atomic_compare_exchange writes the observed value into expected on failure. Ignoring that update turns a retry loop into an infinite loop or a lost update.
- Weak compare-exchange may fail spuriously; use it only inside a retry loop. Strong is for one-shot attempts whose failure the caller treats as a definitive answer.
- Relaxed orders one location only; it does not order other memory or publish safely. A bare counter needs no more; a flag that publishes data needs release and acquire.

**Reproduce:** From a blank file, write the 4-thread CAS-loop counter in C with gcc 15.2 -O2 -pthread (relaxed order, weak compare-exchange): 4 times 500000 increments must total exactly 2000000, and a -fsanitize=thread build must report no races. Then replace the loop body with a plain count++ and show TSan reporting the race even when the total prints correctly. State the compiler, flags and sanitizer with the result.

**Traps**

- A CAS success is not a lock. Two CAS loops on different locations compose no atomicity; multi-location updates still need one critical section.
- Spinning is not free. Under extreme contention the retry storm can cost more than blocking; the contention unit measures the crossover.
- A lock-backed compareAndSet helper demonstrates the loop shape only; it adds no lock-freedom. Name which layer actually retries without blocking.

**Practice**

- [AlgoMaster: Design an Atomic Maximum With Compare-and-Swap](https://algomaster.io/practice/concurrency/design-atomic-maximum-with-compare-and-swap) - Implement updateAndGet as a compare-and-swap retry loop; the judge runs up to 50000 concurrent calls and requires a monotone maximum that never loses a completed proposal. Do not use a ready-made atomic max; the statement forbids it.

**Stop when:** Your CAS counter totals exactly 2000000 under TSan, the atomic-max judge passes, and you can defend weak-against-strong and relaxed-against-publish choices without notes.

<details>
<summary>Self-test</summary>

1. Why does the CAS loop re-read after failure instead of retrying the same expected value?
   - Failure means another thread changed the location, so the saved expected value is stale. C11 writes the observed value into expected, so the next attempt compares against current state.
2. When is weak compare-exchange correct, and when must it be strong?
   - Weak inside a retry loop, where a spurious failure costs one more iteration. Strong for a one-shot attempt whose failure the caller treats as a definitive answer.
3. A relaxed atomic counter is exact under TSan. Does relaxed also publish a message written before the increment?
   - No. Relaxed orders that one location only. Publication needs release on the writer and acquire on the reader.
4. Where does the ABA problem bite, and why does the counter escape it?
   - ABA bites when a location returns to an old value between a thread's read and its CAS, so the swap succeeds on changed history, for example recycled stack nodes. The counter escapes it because addition commutes: only the value matters, not its history.

</details>

#### U4. Data races, lost updates and lost wakeups

**About 3 h** · **Target:** Explain + Measure

Topics: Data races, race conditions and lost updates; Lost wakeups and condition synchronization defects

Programming's synchronization-hazards unit showed a lost update behind a barrier and a lock-order deadlock in Python. Here the same defects move to C pthreads, where a data race is undefined behavior and only the sanitizer or a controlled schedule counts as evidence. It assumes that unit as background and never reuses its barrier demo.

**You can now**

- Separate a data race (unsynchronized access, undefined behavior in C) from a race condition (order-dependent wrong result) with an example of each.
- Reproduce a lost update and a lost wakeup on demand, and show the sanitizer report that convicts the first.
- Measure a racy counter across repeated runs and explain why no single run states the rule.

**Study**

1. [Non-deadlock bugs](https://pages.cs.wisc.edu/~remzi/OSTEP/threads-bugs.pdf) (Operating Systems: Three Easy Pieces - concurrency) - Sections 32.1 and 32.2: atomicity violations and order violations with the before and after code.
2. [Race Conditions and Critical Sections](https://algomaster.io/learn/concurrency-interview/race-conditions-and-critical-sections) (AlgoMaster Concurrency lessons) - Common Race Condition Patterns (read-modify-write, check-then-act, combining thread-safe operations); Race Condition vs Data Race.
3. [Lost Signal / Wakeup](https://algomaster.io/learn/concurrency-interview/lost-signal) (AlgoMaster Concurrency lessons) - What is a Lost Signal; Common Scenarios That Cause Lost Signals; How to Prevent Lost Signals. Depth: Read the scenarios; the while-loop proof is the locks unit.
4. [Spurious Wakeup](https://algomaster.io/learn/concurrency-interview/spurious-wakeups) (AlgoMaster Concurrency lessons) - What is a Spurious Wakeup; Why Spurious Wakeups Exist; Correct Handling Patterns.
5. [Spurious wakeups in the cond contract](https://man7.org/linux/man-pages/man3/pthread_cond_wait.3p.html) (Linux man-pages: pthreads and futex) - pthread_cond_wait page: spurious wakeups and why the predicate must be re-checked.

**Focus**

- A data race is a property of two accesses; a race condition is a property of an outcome. The synchronized-map get-then-put has no data race and still loses updates.
- gcc 15.2 -O2 compiles a plain-global increment loop into one addq $2000000 per thread, so the classic demo printed the exact total of 4000000 in five of five runs on an i9-12900K with Linux 7.0. The race is still there: TSan reports a read and write on global count in the same build.
- volatile restores per-iteration accesses, so the demo loses updates again (twelve runs landed between 2.0 and 2.32 million, never 4000000), but volatile adds no atomicity or ordering. It is a measurement harness, not a fix.
- A condition signal with no waiter is lost, and a wait may return spuriously. Both force the same discipline: wait in a while loop over shared state.

**Reproduce:** Build the plain-global counter (2 threads times 2000000) with gcc 15.2 -O2 -pthread: record five runs printing 4000000, then rebuild with -fsanitize=thread and keep the data-race report naming global count. Then build the volatile variant and record six runs, none reaching 4000000. State CPU, kernel, compiler, flags, repeat counts and warm caches with every number.

**Traps**

- An exact total is not a proof. Optimization level, core placement and timing move the number; only TSan or a forced schedule settles existence.
- Removing the data race does not remove the race condition. Locking each map access still loses the get-then-put update; the sequence needs one critical section.
- Sleep-timed reproduction is not deterministic. A passing sleep-timed run can miss the schedule; barriers and sleep-string shims force it.

**Practice**

- [OSTEP thread API homework: main-race under ThreadSanitizer, plus signal ordering](https://github.com/remzi-arpacidusseau/ostep-homework/tree/master/threads-api) - threads-api folder: build main-race.c with gcc -g -pthread -fsanitize=thread and keep the race report; then compare main-signal.c with main-signal-cv.c. The README uses valgrind's helgrind; ThreadSanitizer, built into gcc and clang, reports the same race. Answer the README questions with whichever detector you have.

**Stop when:** You can produce a wrong total, a TSan report and a lost signal on demand, and explain why each proves something different.

<details>
<summary>Self-test</summary>

1. The plain counter prints 4000000 five times and TSan reports a race. Which result is the finding?
   - The TSan report. The total is one schedule plus one optimization; the race exists on every run regardless of the printed number.
2. Can a TSan-clean program still have a race condition? Give the example.
   - Yes. Individually locked get and put on a shared map compose a lost update with no unsynchronized access. Zero data races do not imply a correct sequence.
3. Why is volatile the wrong fix for the racy counter?
   - It restores per-iteration memory traffic so updates interleave visibly, but concurrent read-modify-write stays a data race: still undefined behavior and still lost updates, now merely observable.
4. A signal sent before any waiter is lost. Which two mechanisms prevent the loss?
   - A predicate re-checked in a while loop, so a thread sleeps only while the state says so; and designs where the state change itself is observable, such as sequence counters or close flags, rather than the bare signal.

</details>

#### U5. Deadlock, livelock, starvation and priority inversion

**About 3 h** · **Target:** Derive + Explain

Topics: Deadlock conditions, wait-for graphs and lock-order proofs; Livelock, starvation, fairness and priority inversion vocabulary

Programming's hazards unit staged a lock-order deadlock in Python. This unit proves why order works: wait-for graphs, the four conditions and the three standard preventions, each run and timed. It assumes that unit as background and replaces its single demo with a proof.

**You can now**

- State the four Coffman conditions and break one deliberately in code.
- Draw a wait-for graph for a two-lock program and prove whether deadlock is possible.
- Separate deadlock, livelock, starvation and priority inversion by the evidence each leaves.

**Study**

1. [Deadlock bugs and their prevention](https://pages.cs.wisc.edu/~remzi/OSTEP/threads-bugs.pdf) (Operating Systems: Three Easy Pieces - concurrency) - Section 32.3: the four conditions, attacking circular wait with a total order, hold-and-wait and try-and-back-off.
2. [Dining philosophers](https://pages.cs.wisc.edu/~remzi/OSTEP/threads-sema.pdf) (Operating Systems: Three Easy Pieces - concurrency) - Section 31.6: the cyclic solution that deadlocks and the total-order repair.
3. [Deadlock](https://algomaster.io/learn/concurrency-interview/deadlock) (AlgoMaster Concurrency lessons) - Coffman's Four Conditions; How to Prevent Deadlock: lock ordering, try-lock with timeout, all-or-nothing acquisition.
4. [Livelock](https://algomaster.io/learn/concurrency-interview/livelock) (AlgoMaster Concurrency lessons) - Why Livelock Happens; Backoff Strategies; How to Prevent Livelock.
5. [Starvation](https://algomaster.io/learn/concurrency-interview/starvation) (AlgoMaster Concurrency lessons) - Why Starvation Happens; Fair vs Unfair Locks; How to Prevent Starvation. Depth: Read the fairness cases; the ticket lock that fixes spin-lock unfairness is OSTEP 28.11 in the atomics unit.
6. [Priority Inversion](https://algomaster.io/learn/concurrency-interview/priority-inversion) (AlgoMaster Concurrency lessons) - The Classic Scenario; Case Study: Mars Pathfinder (1997); Solutions to Priority Inversion. Depth: OSTEP has no priority-inversion locator; this lesson is the vocabulary source.

**Focus**

- Deadlock needs all four conditions at once. The prevention you can prove is a global lock order: it deletes the wait-for cycle structurally, not statistically.
- Draw threads waiting on locks as directed edges; a cycle means deadlock is possible, and no cycle means it is impossible for that state. The two-mutex opposite-order program has a two-node cycle by construction.
- Try-and-back-off breaks hold-and-wait but can livelock: six runs of vector-try-wait retried 0.8 to 3.1 million times each. Backoff calms the storm; ordering removes it.
- Starvation is unfair scheduling over time with no cycle and no progress for one thread. Priority inversion is a low-priority holder blocking a high-priority waiter, as in the lesson's Mars Pathfinder case. Livelock is active retry with no progress.

**Reproduce:** Build the two-mutex opposite-order program with a pthread barrier forcing the overlap (gcc 15.2 -O2 -pthread): show it hangs past a 5 s timeout (four of four reference runs on an i9-12900K with Linux 7.0). Draw its two-node wait-for cycle. Then impose one global order (always A before B) and show both threads print and exit 0. State compiler, flags, timeout and repeats.

**Traps**

- A timeout does not prove deadlock. A hang with spinning CPU suggests livelock; a silent hang with futex-blocked threads (gdb shows __lll_lock_wait) suggests deadlock. Inspect thread state before naming it.
- Lock ordering must cover every path, including callbacks and repeated keys. The executor practice fails if equal keys lock twice on a non-reentrant mutex.
- POSIX offers PTHREAD_PRIO_INHERIT, and Linux implements it with priority-inheritance futexes, but it only matters when threads run under real-time scheduling. Check the scheduling policy before claiming the inversion fix.

**Practice**

- [OSTEP deadlock homework: hang it, then fix it](https://github.com/remzi-arpacidusseau/ostep-homework/tree/master/threads-bugs) - threads-bugs folder: make, then ./vector-deadlock -d -l 5000 -n 2 hangs (four of four reference runs, killed by a 5 s timeout); ./vector-global-order with the same flags finishes. Then read vector-try-wait.c and vector-avoid-hold-and-wait.c to name which condition each breaks.
- [AlgoMaster: Design a Deadlock-Free Two-Key Executor](https://algomaster.io/practice/concurrency/design-deadlock-free-two-key-executor) - execute() acquires distinct keys in global order and a repeated key once; the judge runs opposite-order pairs such as (1, 3) and (3, 1) with disjoint pairs allowed to overlap. A throwing callback must still release both locks and propagate the failure.

**Stop when:** You force the hang, draw its cycle, repair it twice (order and try-release), and pass the executor judge.

<details>
<summary>Self-test</summary>

1. T1 holds A and wants B; T2 holds B and wants A. Draw the graph and name the broken condition for each standard fix.
   - Cycle T1 to B to T2 to A to T1, so deadlock is possible. A global order breaks circular wait; try-and-release breaks hold-and-wait; timeouts break no-preemption.
2. How do you tell deadlock from livelock from the outside?
   - Deadlock: threads blocked (futex waits, gdb __lll_lock_wait), near-zero CPU. Livelock: threads running and retrying, high CPU, no progress. Starvation: others progress while one thread does not.
3. Why does acquiring the smaller key first prevent deadlock for any pair order?
   - Every thread acquires in the same global order, so each wait edge runs from a lower-numbered held lock toward a higher-numbered wanted lock. Edges strictly ascend in key id, so no cycle can form.
4. What goes wrong if execute(1, 1) locks key 1 twice?
   - A non-reentrant mutex deadlocks on the second acquire by the same thread. The problem statement requires acquiring a repeated key once.

</details>

#### U6. Bounded queues, admission and backpressure

**About 4 h** · **Target:** Implement

Topics: Bounded queues and producer-consumer invariants; Admission, backpressure, load shedding and overload propagation

Programming's backpressure unit built admission with asyncio.Queue. This unit rebuilds it in C with explicit invariants, close states and a measured drain, which is the piece the fault-tested service slice reuses. It assumes that unit as background and never reuses its queue demo.

**You can now**

- Implement a bounded producer-consumer queue with two condition variables and state its full and empty invariants.
- Add close semantics that drain admitted items, reject late puts and wake every waiter.
- Derive queued-memory and worst-wait bounds from capacity, item size, service rate and worker count.

**Study**

1. [Producer and consumer with condition variables](https://pages.cs.wisc.edu/~remzi/OSTEP/threads-cv.pdf) (Operating Systems: Three Easy Pieces - concurrency) - Section 30.2 with the two-condition-variable while version as the reference implementation.
2. [Bounded buffer with semaphores, plus throttling](https://pages.cs.wisc.edu/~remzi/OSTEP/threads-sema.pdf) (Operating Systems: Three Easy Pieces - concurrency) - Sections 31.4 and 31.7: counting semaphores as fill and empty counts, and thread throttling as admission.
3. [Concurrent queues](https://pages.cs.wisc.edu/~remzi/OSTEP/threads-locks-usage.pdf) (Operating Systems: Three Easy Pieces - concurrency) - Section 29.3: the concurrent queue structure and where the locks live.
4. [Producer-Consumer Pattern](https://algomaster.io/learn/concurrency-interview/producer-consumer-pattern) (AlgoMaster Concurrency lessons) - Core Components; Implementation; When to Use / When Not to Use.
5. [Bounded Buffer](https://algomaster.io/learn/concurrency-interview/bounded-buffer) (AlgoMaster Concurrency lessons) - Solution 2: Semaphore-Based Solution; Solution 3: Monitor-Based Solution; Solution Comparison. Depth: Compare the two solutions; skip the naive busy-waiting variant except as a failure example.
6. [Design Thread-Safe Blocking Queue](https://algomaster.io/learn/concurrency-interview/design-thread-safe-blocking-queue) (AlgoMaster Concurrency lessons) - Approach 1: Single Lock with Conditions; Approach 2: Two-Lock Queue; Solution Comparison.

**Focus**

- Two predicates, two condition variables: not-full for producers, not-empty for consumers. One CV forces broadcast-on-every-op or risks a stolen signal.
- Capacity bounds memory and wait: max queued bytes equal capacity times item size, and a newly admitted item waits at most capacity divided by aggregate service rate, plus one service time. State units with every bound.
- Close is a state, not a signal: CLOSED rejects puts, preserves admitted items in FIFO order and wakes all waiters. A bare broadcast without the flag re-sleeps or loses items.
- Admission control turns overload into explicit rejection: the rate limiter allows at most limit permits per aligned window, with lookup, reset, check and increment as one atomic operation.

**Reproduce:** From a blank file, write the closable bounded queue in C with gcc 15.2 -O2 -pthread (capacity 4): 2 producers times 5000 items with 2 consumers must drain exactly 10000 over three runs, post-close put must return -1, take on the drained closed queue must return -1, and the -fsanitize=thread build must be clean. State CPU, kernel, compiler, flags and repeats.

**Traps**

- notify_one against notify_all is a correctness choice under close: waking one consumer while producers also wait can stall shutdown. Broadcast on close.
- Window edges admit bursts: a fixed-window limiter allows limit permits at the end of one window and limit more at the start of the next. Name the factor of 2 before claiming smoothness.
- An unbounded queue plus a slow consumer is a memory leak with a polite name. Bound the queue or bound the wait; bound both when the slice demands it.

**Practice**

- [AlgoMaster: Design a Closable Bounded Queue](https://algomaster.io/practice/concurrency/design-closable-bounded-queue) - put, take and close with the five stated rules (drain in FIFO order, blocked puts fail, takes report no-item when drained); the judge runs concurrent producers, consumers and closers. Your C queue is the reference; now satisfy the judge's in-browser contract.
- [AlgoMaster: Design Thread-Safe Rate Limiter](https://algomaster.io/practice/concurrency/design-thread-safe-rate-limiter) - Fixed aligned windows with at most limit permits per client per window; window lookup, reset, check and increment as one atomic operation under the judge's logical clock. Use the supplied logical clock, never the system clock.

**Stop when:** Your C queue drains 10000 of 10000 under TSan, both judges pass, and you can derive the memory and wait bounds for a new capacity.

<details>
<summary>Self-test</summary>

1. Why two condition variables instead of one?
   - Producers and consumers wait for different predicates. With one CV a producer signal can wake another producer, which re-sleeps while consumers stay asleep. At close, broadcast wakes everyone and each re-checks its own predicate.
2. Capacity 1000, 8-byte items, 2 workers each serving 50000 items/s. Bound the queued memory and the worst wait of an admitted item.
   - Memory: 1000 times 8 = 8000 bytes plus bookkeeping. Wait: at most 1000 items ahead drain at 100000/s, about 10 ms, plus one 20 us service time.
3. Close arrives with 3 items queued and 1 producer blocked in put. What must happen?
   - The blocked put wakes and fails without adding. The 3 items drain in FIFO order. Takes after drain report closed, and later puts fail immediately.
4. Why must the window check, reset, limit check and increment be one atomic operation?
   - Otherwise two threads in the same window both observe a count below limit and both consume the last permit, admitting limit plus 1.

</details>

#### U7. Cancellation, deadlines and shutdown state machines

**About 3 h** · **Target:** Implement

Topics: Cancellation, deadlines, timeouts and error propagation; Drain, abort and graceful shutdown state machines

Programming's cancellation unit built TaskGroup deadlines and full-jitter retries in Python. This unit implements the lower half: pthread cancellation points, timed waits as deadlines, and the OPEN, CLOSING, CLOSED machine the service slice shuts down with. It assumes that unit as background; no asyncio is reused.

**You can now**

- Separate cancellation (a request), deadlines (a bound) and shutdown (a state machine), and say which primitive serves each.
- Implement drain-or-abort shutdown with a timed wait, a close broadcast and a join, with no leaked thread.
- Propagate the first error to the joiner without losing admitted work in drain mode.

**Study**

1. [End-of-stream shutdown in the producer and consumer code](https://github.com/remzi-arpacidusseau/ostep-homework/tree/master/threads-cv) (OSTEP concurrency homework and code) - threads-cv folder, main-common.c: main() inserts end-of-stream markers after producers finish and consumers exit on END_OF_STREAM; watch the drain with -v. Depth: Use the EOS pattern only. The sleep-string schedule forcing is the locks unit; do not repeat that practice here.
2. [pthread cancellation and deadline waits](https://man7.org/linux/man-pages/man3/pthread_cancel.3.html) (Linux man-pages: pthreads and futex) - pthread_cancel page: deferred cancellation and cancellation points; pthread_cond_timedwait page: absolute deadlines and ETIMEDOUT with predicate re-check.
3. [Thread Pool Pattern](https://algomaster.io/learn/concurrency-interview/thread-pool-pattern) (AlgoMaster Concurrency lessons) - Core Components; Implementation; When to Use / When Not to Use.

**Focus**

- Cancellation is a request the target observes at defined points. A deadline is a bound the waiter enforces with a timed wait plus re-check. Shutdown is a state machine all threads observe. One primitive cannot serve all three.
- Timed waits take absolute time and return ETIMEDOUT without changing state. Recompute the predicate and the remaining budget after every return; repeated relative sleeps drift.
- Drain keeps admitted work and refuses new work; abort discards and reports. Set the CLOSING flag under the mutex first, then broadcast, then join to prove no thread was left behind.
- pthread_cancel acts only at cancellation points and skips cleanup without handlers. Prefer a close flag plus broadcast; reserve cancel for threads blocked where no flag is checked.

**Reproduce:** From a blank file, write the OPEN, CLOSING, CLOSED drain demo in C with gcc 15.2 -O2 -pthread: one worker, 3 admitted items, close-while-working, 200 ms timed waits. Three runs must print done=3 pending=0 state=2 with admit-after-close=0, and the -fsanitize=thread build must be clean.

**Traps**

- Double close, double join and post-close admission must each be defined, not merely unlikely. Test all three.
- Broadcast before setting the flag wakes threads that re-sleep. Set the flag first, then broadcast, with both under the mutex.
- A bare sleep is not a deadline. Without the predicate loop, an early wakeup exits shutdown while work remains, and a late one reports a drain that never happened.

**Practice**

- [AlgoMaster: Design Deferred Callback Executor](https://algomaster.io/practice/concurrency/design-deferred-callback-executor) - schedule() plus runNext() with deadline ordering; a waiter for a future task wakes when an earlier deadline arrives; callbacks run outside the lock; waits use blocking primitives, never busy-waiting. The judge covers deadlines; your C drain demo covers close and join.

**Stop when:** Your drain demo passes three runs under TSan, the deferred-executor judge passes, and you can place every primitive on the cancel, deadline and shutdown map.

<details>
<summary>Self-test</summary>

1. What is the difference between cancelling a thread and shutting down a queue?
   - Cancellation asks one thread to stop at its next cancellation point. Shutdown moves shared state through CLOSING to CLOSED so every thread drains or aborts and the joiner observes completion.
2. Why does the timed wait use an absolute deadline, and what must follow ETIMEDOUT?
   - Absolute time does not drift across repeated waits. After ETIMEDOUT, re-check the predicate and the state: the timeout alone changes nothing.
3. Close sets CLOSING and broadcasts. Why must a woken worker re-check instead of exiting?
   - Drain mode still owns admitted items; only an empty queue in CLOSING moves to CLOSED. Exiting on wakeup abandons work.
4. Where does the first worker error go?
   - Into shared state under the mutex or a joined return value, read by the joiner after all threads exit. Printing from the worker is not propagation.

</details>

#### U8. Deterministic schedules, stress tests and contention

**About 4 h** · **Target:** Implement + Measure

Topics: Deterministic schedule shims and randomized stress tests; Contention, locality, throughput, tail latency and fairness

Passing once is not passing. This unit makes timing failures reproducible on a hybrid CPU with performance and efficiency cores: deterministic shims for the schedule you fear, stress for the ones you did not imagine, and pinned measurements that survive review.

**You can now**

- Build a barrier-forced schedule shim that turns an intermittent interleaving deterministic.
- Stress a mutex-protected structure with randomized threads and report throughput, correctness and retry counts.
- Compare lock strategies under matched contention with per-op costs, stating pinning, repeats and cache state.

**Study**

1. [Concurrent counters, queues and tables](https://pages.cs.wisc.edu/~remzi/OSTEP/threads-locks-usage.pdf) (Operating Systems: Three Easy Pieces - concurrency) - Section 29.1: single, fine-grained and approximate counters with the throughput figure; Section 29.3 for the queue.
2. [Evaluating locks and two-phase blocking](https://pages.cs.wisc.edu/~remzi/OSTEP/threads-locks.pdf) (Operating Systems: Three Easy Pieces - concurrency) - Section 28.4: the no-contention against contended performance cases and fairness; Section 28.16: two-phase spin-then-block.
3. [Locking lecture: the allocator contention story](https://pdos.csail.mit.edu/6.1810/2025/lec/l-lockv2.txt) (MIT 6.1810 - locks and parallelism) - Locking lecture notes: the kfree lost-page case study without locks and the per-CPU freelist remedy.
4. [Lock lab contention counters](https://pdos.csail.mit.edu/6.1810/2025/labs/lock.html) (MIT 6.1810 - locks and parallelism) - Memory allocator half: kalloctest #test-and-set tables before and after per-CPU freelists. Depth: Read the printed counter tables only. Building xv6 needs a RISC-V toolchain and QEMU, which this unit does not use.
5. [Coarse-grained vs Fine-grained Locking](https://algomaster.io/learn/concurrency-interview/coarse-vs-fine-grained-locking) (AlgoMaster Concurrency lessons) - What is Lock Granularity; Trade-offs Comparison; When to Use Each Approach.

**Focus**

- Deterministic shims (barriers, sleep strings, condition gates) choose the schedule; stress (many threads, many iterations, varied seeds) samples it. Shim to reproduce, stress to discover.
- Pin with taskset and name the cores: unpinned runs migrate across performance and efficiency cores and smear the numbers. On the i9-12900K reference, logical CPUs 0 and 1 are one physical core (lscpu -e), so four threads pin to 0,2,4,6; taskset -c 0-3 would put them on two cores.
- Report per-op cost, not just totals: 8M mutex increments take 0.084 s solo (10.5 ns per op) and 0.33 to 0.38 s with 4 threads on four P-cores (41 to 48 ns per op) on an i9-12900K with Linux 7.0 and gcc 15.2 -O2 -pthread, three invocations of 1 warm-up plus 5 timed runs, warm caches. Same work, about 4 to 4.5 times the per-op cost.
- Fairness is a separate axis from throughput: OSTEP 28.4 names it, plain spin locks lack it, and try-back-off buys progress at 0.8 to 3.1 million retries per vector-try-wait run.

**Reproduce:** Write the mutex-against-atomic counter from a blank file with gcc 15.2 -O2 -pthread: 8M increments in four configs (1 thread; 4 threads unpinned; 4 threads on four physical cores; 8 threads on eight physical cores; find the core map with lscpu -e, on the reference CPU taskset -c 0,2,4,6 and 0,2,4,6,8,10,12,14), 1 warm-up plus 5 timed runs each, repeated in three invocations. The reference shape: solo mutex 0.084 s, solo atomic 0.029 s, 4-thread mutex 0.33 to 0.38 s, exact totals every run. State CPU, kernel, compiler, flags, pinning, repeats and cache state.

**Traps**

- Averages hide the spread. Report the range across repeats (six try-wait runs took 0.11 to 0.28 s); a single mean claims a precision the runs do not support.
- Oversubscription measures the scheduler, not the lock. Keep threads at or below the pinned cores when comparing strategies.
- Stress without an oracle proves nothing. Assert exact totals (mutex, CAS) or exact retry accounting (the try-wait Retries line) on every run.

**Practice**

- [OSTEP deadlock homework: timing three lock strategies](https://github.com/remzi-arpacidusseau/ostep-homework/tree/master/threads-bugs) - threads-bugs folder: run ./vector-global-order, ./vector-try-wait and ./vector-avoid-hold-and-wait with -d -l 200000 -n 2 -t, three runs each; reference on an i9-12900K with Linux 7.0: about 0.04 s, 0.11 to 0.28 s with 0.8 to 3.1 million retries, and 0.07 to 0.09 s. Quote ranges, not means. If kernel.perf_event_paranoid is 2 on your machine, count user-space events of your own processes only.

**Stop when:** Your counter table matches the stated shape, the three vector timings reproduce in range, and every number you quote carries its setup.

<details>
<summary>Self-test</summary>

1. What is the difference between a schedule shim and a stress test?
   - A shim forces one chosen interleaving (barrier, sleep string) to reproduce a known failure deterministically. Stress samples many unknown interleavings to discover new failures, and needs an independent correctness oracle.
2. Your unpinned 4-thread mutex numbers move by 10% between invocations. What does pinning fix, and what not?
   - Pinning fixes placement: which cores, performance or efficiency, and whether two threads share one core through SMT. It does not remove frequency scaling or background load, so report the spread across invocations. The reference machine has one NUMA node, so no remote-memory effect is claimed.
3. Try-wait is correct but retries about a million times or more per run. What does that number tell you?
   - Each retry is a failed acquisition plus another attempt: livelock-shaped waste that ordering avoids. Correctness passed; efficiency did not.
4. Why 1 warmup plus 5 timed runs instead of a single run?
   - Warmup faults pages and warms caches and branch predictors. Repeats expose run-to-run spread from scheduling and frequency scaling.

</details>

#### U9. Event loops, work stealing and structured concurrency

**About 2 h** · **Target:** Explain

Topics: Event loops, work stealing and structured concurrency

Not every concurrent system needs a thread per connection. This unit closes the section with the alternative the later networking and server designs assume: structure work so completion, not preemption, drives progress.

**You can now**

- Explain the event loop: one thread, nonblocking event sources, select, and handlers that must never block.
- Contrast event loops, thread pools and work stealing, and state when each fits.

**Study**

1. [Event-based concurrency](https://pages.cs.wisc.edu/~remzi/OSTEP/threads-events.pdf) (Operating Systems: Three Easy Pieces - concurrency) - Sections 33.1 to 33.3: the event loop and select; Sections 33.5 to 33.8: blocking calls, async I/O and state management.
2. [Concurrency Models](https://algomaster.io/learn/concurrency-interview/concurrency-models) (AlgoMaster Concurrency lessons) - Model 2: The Event Loop; Comparing the Models; Choosing a Model. Depth: Read the event-loop model against OSTEP 33; skim the actor and channel models as vocabulary only.
3. [Thread Pool Pattern](https://algomaster.io/learn/concurrency-interview/thread-pool-pattern) (AlgoMaster Concurrency lessons) - Core Components; When to Use / When Not to Use.

**Focus**

- An event loop removes preemption inside handlers, not concurrency from the system: a blocking call stalls every connection, so Sections 33.5 and 33.6 demand nonblocking or async I/O.
- State moves from stacks to explicit records (Section 33.7): harder to write, easier to bound. No locks does not mean no state machine.
- Thread pools bound threads and queue the rest; work stealing balances queues across workers. All three still need this section's admission, deadline and shutdown contracts.

**Reproduce:** With CPython 3.14.4, register one end of socket.socketpair() with selectors.DefaultSelector, send b"one" then b"two" from the other end, and read with recv(2) in the handler: the loop receives [b"on", b"et", b"wo"] and joins them to b"onetwo" with no threads. Then state, closed-book, the two OSTEP problems with events (blocking system calls, state management) and the remedy for the first.

**Traps**

- Event-driven does not mean faster. It removes lock overhead and per-connection thread stacks but adds state-machine complexity; throughput still depends on handler cost.
- Readiness is not admission. select() reports ready file descriptors; the loop must still bound handler time and queue growth, or one ready source starves the rest.
- Structured concurrency (tasks with a defined lifetime and a join) is not fire-and-forget threads. A pool whose workers outlive their owner leaks the shutdown this section just built.

**Practice**

- [AlgoMaster: Design Task Scheduler with Dependencies](https://algomaster.io/practice/concurrency/design-task-scheduler-with-dependencies) - workerCount fixed workers with independent tasks running concurrently; cycle check returns false with no callback run; ready queue plus indegree accounting; the judge runs up to 10000 tasks and 100000 edges. Reuse your drain discipline: every worker must exit and execute() must join them.

**Stop when:** You can run the selector demo, name the two OSTEP event problems from memory, and place event loops, pools and work stealing on one trade-off map.

<details>
<summary>Self-test</summary>

1. Why can one blocking read stall a thousand connections on an event loop?
   - One thread runs all handlers. A handler that blocks keeps the loop from polling, so ready events for every other connection wait.
2. What replaces the call stack for tracking progress across events?
   - Explicit per-connection state records updated by each handler. OSTEP 33.7 names state management as the hard part of events.
3. When does this section prefer a bounded thread pool over an event loop?
   - When handlers do CPU work or call blocking APIs that cannot be made async. The pool bounds threads while the queue bounds waiting work.

</details>

### Mini-project: Bounded admission and clean shutdown for the service slice, with forced schedules

**About 10 to 14 hours.** Port the closable bounded queue and the OPEN, CLOSING, CLOSED drain into the Python worker pool that will run the service slice. Force one safety failure and one liveness failure with deterministic schedule shims, repair both, then drive the pool through saturation and show that held work stays bounded, expired work never starts and the pool recovers.

1. Keep the C programs from the units in lab/concurrency: the racy and ThreadSanitizer-clean counters, the lost-wakeup demo, the deadlock and its ordered repair, the closable bounded queue (2 producers of 5000 items and 2 consumers drain exactly 10000, put after close and take after drain return -1) and the drain demo (done=3 pending=0 state=2, admit-after-close=0). make check rebuilds them with and without -fsanitize=thread and asserts their outputs.
2. In kv/pool.py write the Python equivalent on threading.Condition: a ClosableQueue(capacity) whose put never blocks and returns False when full or closed, whose take waits in a while loop and returns None once closed and drained, and a WorkerPool with states OPEN, CLOSING and CLOSED. close() stops admission, lets workers finish admitted jobs within a drain deadline, then cancels what is left and reports the counts. Port the C queue's cases as tests: capacity 4, 2 x 5000 puts retried until accepted, every item taken exactly once, puts after close rejected.
3. Give every job a request ID and an absolute deadline on time.monotonic(). A worker checks the deadline when it takes a job and drops an expired job without starting its effect, counting it as cancelled; a running job checks a cancellation flag between steps. Test that a job whose deadline passes while it is queued never runs.
4. Force a safety failure with a shim. The handler deduplicates by request ID with check-then-act (if rid not in done: apply, then done.add(rid)). Put a threading.Barrier(2) between the check and the effect and submit the same request twice: both threads pass the check and a +5 credit applies twice (10 on CPython 3.14.4). Repair it by claiming the ID under a lock before the effect (IN_PROGRESS, then DONE), keep the shim in the test, and assert the effect applies once.
5. Force a liveness failure the same way: one path takes the index lock then the log lock, the other takes them in the opposite order, with a barrier after each first acquisition; both threads are still alive after a 2 s join timeout. Repair it with one global order (index before log) and give the barrier a timeout: after the fix the forced schedule is unreachable, so the barrier breaks instead of the test hanging, and both threads finish. Run each forced test 20 times, then add a seeded stress test with random sleeps and an exact oracle (final credits and the number of applied request IDs).
6. Predict capacity as workers divided by service time, then drive the pool past it: for example 4 workers that sleep 10 ms per job (about 400 jobs per second) at offered rates of 200, 400 and 800 per second. Record offered, accepted, rejected, cancelled and completed counts, queue length sampled every 10 ms and latency percentiles from raw samples. Queue length never exceeds capacity, so held jobs stay bounded by capacity plus workers at every rate, and accepted plus rejected equals offered. After the flood stops, show the queue draining and latency returning to its idle value.
7. Close the pool in the middle of a flood: admission stops at once, and admitted jobs finish within the drain deadline or are cancelled and counted, so admitted equals done plus cancelled. Wire close() to SIGTERM in a small server process started by lab/supervise.py and test the signal path end to end.
8. Compare one contention choice in Python: a single lock around the dedup state against a per-key lock table, pinned to physical cores with taskset, one warm-up and five repeats, exact totals asserted on every run. Name the Python build: in the default build the GIL lets only one thread run Python bytecode at a time, so the comparison measures lock handoff and waiting, not parallel speedup.

**Deliverables**

- kv/pool.py and its tests: exactly-once take, rejection when full or closed, deadline cancellation and drain counts.
- The two forced-schedule tests (double effect, lock-order deadlock), each failing on the seeded code and passing after the repair, plus the seeded stress test and its oracle.
- The saturation table at three offered rates and after recovery, with the capacity prediction, and the SIGTERM drain report.
- The C programs in lab/concurrency, rebuilt and asserted by make check with and without ThreadSanitizer.

**Checks**

- rubric: Self-grade with the rubric below.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Forced failures | Each shim reproduces its failure in all 20 runs, and each repair passes 20 runs with the shim still in place. | The write-up says why the stress test alone might miss each failure, with its seed count and observed miss rate. |
| Bounded work | Queue length never exceeds capacity, put never blocks the caller, and accepted plus rejected equals offered at every rate. | The capacity prediction is written before the sweep, and the measured knee is explained against it. |
| Cancellation and shutdown | Expired jobs never start, close() stops admission at once, and admitted equals done plus cancelled after SIGTERM. | A job that raises halfway is counted, and its effect is shown to be either complete or absent, never half applied. |
| Evidence | Every timing names the Python build, CPU, pinning, warm-up and repeats, and the C programs pass under ThreadSanitizer. | The contention comparison states what the GIL build can and cannot show and keeps raw times. |

Feeds into: Capstone service slice: the pool is its bounded admission, cancellation and shutdown path. Mechanisms laboratory: the C programs and forced schedules are its controlled concurrency failure and bounded queue.

### Resource route

- **Primary - Theory:** [Operating Systems: Three Easy Pieces - concurrency](https://pages.cs.wisc.edu/~remzi/OSTEP/) - Read Chapters 26-33 in order: threads, thread API, locks, locked data structures, condition variables, semaphores, bugs and event-based concurrency. Write the safety and liveness invariant before reading each worked pattern.
- **Required - Practice:** [OSTEP concurrency homework and code](https://github.com/remzi-arpacidusseau/ostep-homework) - Use x86.py and the main, vector, condition-variable and semaphore exercises to enumerate schedules. Preserve one lost update, one deadlock and one lost wakeup as minimized tests, then repair each invariant.
- **Required - Practice:** [AlgoMaster Concurrency - four bounded contracts](https://algomaster.io/practice/concurrency) - Attempt Design a Closable Bounded Queue, Design Thread-Safe Rate Limiter, Design a Deadlock-Free Two-Key Executor, Design an Atomic Maximum With Compare-and-Swap, Design Deferred Callback Executor and Design Task Scheduler with Dependencies. For each, add a changed input, a deterministic failure schedule and an independent stress test outside the platform.
- **Depth - Course:** [MIT 6.1810 - locks and parallelism](https://pdos.csail.mit.edu/6.1810/2025/labs/lock.html) - Use Lectures 12-14 and one lock-lab exercise only after the user-space bounded queue passes. Measure the contention change and explain the invariant preserved by the revised locking scheme.
- **Support - Course:** [AlgoMaster Concurrency lessons](https://algomaster.io/learn/concurrency-interview/course-roadmap) - Use the named lessons only: Processes vs Threads, Race Conditions and Critical Sections, Mutex, Condition Variables, Compare-And-Swap, Atomic Operations, Semaphores, Producer-Consumer Pattern, Bounded Buffer, Design Thread-Safe Blocking Queue, Barriers and Latches, Read-Write Locks, Coarse-grained vs Fine-grained Locking, Deadlock, Livelock, Starvation, Priority Inversion, Lost Signal/Wakeup, Spurious Wakeup, Concurrency Models and Thread Pool Pattern. Each unit names its lessons; read no other chapter for this section.
- **Reference - Reference:** [Linux man-pages: pthreads and futex](https://man7.org/linux/man-pages/) - Look up the exact pthread mutex, condition variable, barrier, cancellation and timed-wait contracts plus futex(2) and pthreads(7). Read the stated pages; do not browse the whole manual.
- **Reference - Reference:** [cppreference: C atomic operations](https://en.cppreference.com/c/atomic/atomic_compare_exchange) - Read atomic_compare_exchange for success and failure semantics and the expected-pointer update rule, and memory_order for the six orderings and what relaxed permits. Stop before lock-free-property macros.
- **Reference - Reference:** [GCC __atomic builtins](https://gcc.gnu.org/onlinedocs/gcc/_005f_005fatomic-Builtins.html) - Read __atomic_compare_exchange, __atomic_load and __atomic_store for the expected-pointer update rule and the __ATOMIC_RELAXED constant used by the CAS reproduce step.
- **Support - Book:** [The Little Book of Semaphores](https://greenteapress.com/wp/semaphores/) - Use the rendezvous, barrier and reader-writer puzzles as extra semaphore practice after OSTEP Chapter 31. Skip the Python event material; this section works in C with pthreads.

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

### Study units

#### U1. Network layers, addressing, routing and DNS

**About 3 h** · **Target:** Explain

Topics: Network layers as an explanatory model; IP addresses, ports, routing and DNS lookup

Every later diagnosis in this section starts by asking which layer broke. Layers do not exist on the wire; they are a debugging vocabulary, and DNS plus routing are the two lookups every connection performs first.

**You can now**

- Use the OSI 7-layer and TCP/IP 4-layer models to place a failure at the right layer, and state where each model misleads.
- Trace a DNS lookup from stub resolver through root, TLD and authoritative server, and apply the TTL expiry rule.
- Read a host routing-table entry and predict the next hop with longest-prefix match.

**Study**

1. [The OSI 7-layer model](https://algomaster.io/learn/computer-networks/osi-7-layer-model) (AlgoMaster Networks - pcap and concurrent server labs) - The Seven Layers at a Glance; Encapsulation Across the Stack; Using OSI to Diagnose a Failure; Where the Model Has Limits.
2. [The TCP/IP 4-layer model](https://algomaster.io/learn/computer-networks/tcp-ip-4-layer-model) (AlgoMaster Networks - pcap and concurrent server labs) - The Four Layers; Mapping TCP/IP to OSI; A Complete Request in TCP/IP Terms; Boundaries in Modern Protocols.
3. [Layering, IP and routing in Beej's Network Concepts](https://beej.us/guide/bgnet0/html/) (Beej's Guide to Network Concepts - TCP and UDP path) - Chapter 4, The Layered Network Model (Sections 4.3 and 4.4); Chapter 18, IP Routing (Sections 18.2 to 18.5).
4. [DNS hierarchy and debugging](https://algomaster.io/learn/computer-networks/dns-hierarchy) (AlgoMaster Networks - pcap and concurrent server labs) - Domains and Zones Are Different; Following the Chain of Authority; Practical Implications for Engineers; then Debugging DNS with dig and nslookup: The Basic dig Command, Walk the Delegation with +trace, Diagnose Cache and TTL Behavior. Depth: Use https://algomaster.io/learn/computer-networks/debugging-dns for the dig sections; skip DNSSEC detail.

**Focus**

- OSI layers are an explanatory model. The wire carries frames, packets and segments; nothing is tagged with a layer number.
- DNS resolution is a chain of referrals with per-record TTLs. A cached answer is valid while now is earlier than stored time plus TTL; reading it does not refresh it.
- Routing is longest-prefix match on the destination, per packet, per hop. The default route is only the shortest prefix that matches.
- Sending adds transport, internet and link headers around application data in that order; receiving strips them in reverse.

**Reproduce:** Run dig +short example.com twice and compare the answer sets. Then closed-book, write the cold-lookup chain (stub to recursive to root to TLD to authoritative) and evaluate the TTL rule on store(api.example, 192.0.2.10, TTL 10, t=100): resolve at t=109 hits, at t=110 misses.

**Traps**

- Treating OSI as seven things a packet passes through in code. Implementations merge and skip layers; TLS, for example, sits between transport use and the application.
- Reading a DNS TTL as a freshness guarantee. It bounds staleness; an authoritative change still waits out the TTL at every cache.
- Inferring network meaning from dotted quads or old class letters. Only the prefix length defines the network part.

**Practice**

- [AlgoMaster: Implement a DNS TTL Cache](https://algomaster.io/practice/system-design/implement-a-dns-ttl-cache) - store and resolve with TTL expiry (now < t + d), case-insensitive names, cached NXDOMAIN. Do not refresh expiry on resolve; the 109-hit 110-miss boundary in Reproduce is the first case to pass.

**Stop when:** You place a refused connection, an NXDOMAIN and a wrong route at the right layer on the first guess, and your TTL cache passes the 109-hit 110-miss boundary.

<details>
<summary>Self-test</summary>

1. A record stored at t=100 with TTL 10 is resolved at t=110. Hit or miss, and why?
   - Miss. It is valid only while now < 100 + 10, and resolving does not refresh the expiry.
2. Entries cover 10.0.0.0/8 and 10.1.2.0/24. Which carries a packet for 10.1.2.9?
   - 10.1.2.0/24. Longest-prefix match wins; the /24 is more specific than the /8.
3. Why can two applications on one host share one IP address without conflict?
   - The transport port number separates them. The IP address names the host; the port names the socket endpoint.
4. A capture shows HTTP inside TLS inside TCP inside IPv4 inside Ethernet. Which layering claim does this support?
   - Encapsulation order only. It shows headers wrapped around data; it does not prove a seven-layer implementation.

</details>

#### U2. TCP and UDP transport behavior

**About 4 h** · **Target:** Explain + Measure

Topics: TCP connection setup, byte streams and flow control intuition; UDP datagrams and loss, duplicate and reorder behavior; Congestion-control mechanics and packet-capture analysis depth

Sockets expose streams, not messages. Misreading TCP as a message protocol causes every framing bug in the next unit, and confusing flow control with congestion control misdirects tuning.

**You can now**

- Explain the TCP service contract: reliable ordered duplicate-suppressed byte stream, setup cost, and what an ACK does not promise.
- Contrast UDP datagrams with TCP streams and choose between them from loss, ordering and latency needs.
- Read zero-window, retransmission and congestion evidence in a capture and name the limiting mechanism.

**Study**

1. [TCP versus UDP contracts](https://algomaster.io/learn/computer-networks/tcp-vs-udp) (AlgoMaster Networks - pcap and concurrent server labs) - TCP's Service Contract (reliable, ordered, duplicate suppression, byte stream); UDP's Service Contract; Message Size Matters.
2. [The TCP three-way handshake](https://algomaster.io/learn/computer-networks/tcp-three-way-handshake) (AlgoMaster Networks - pcap and concurrent server labs) - Step 1 through Step 3; Sequence Number Arithmetic; Why Three Messages Are Necessary; Listening Queues and Server Load.
3. [Reliability and flow control](https://algomaster.io/learn/computer-networks/reliability-acks-retransmission) (AlgoMaster Networks - pcap and concurrent server labs) - Reliability Is Defined Over Bytes; An ACK Is Not an Application Receipt; Gaps and Duplicate ACKs; Retransmission Timeout; then Flow Control and the Sliding Window: Receive Buffers and Application Reads, Zero Window, Diagnosing a Flow-Control Stall. Depth: Use https://algomaster.io/learn/computer-networks/flow-control-sliding-window for the flow-control sections.
4. [TCP and UDP path in Beej's Network Concepts](https://beej.us/guide/bgnet0/html/) (Beej's Guide to Network Concepts - TCP and UDP path) - Chapter 14, TCP (Sections 14.4.1, 14.4.2 and 14.6); Chapter 15, UDP (Sections 15.4, 15.6 and 15.7).
5. [A real zero-window stall](https://algomaster.io/learn/computer-networks/reading-a-real-pcap) (AlgoMaster Networks - pcap and concurrent server labs) - Turn the Stream into a Timeline; Inspect the Edges of the Gap (zero-window evidence); the host-correlation conclusion. Depth: Follow the phase method and the window evidence. The audit-pipe root cause is one example of host correlation, not a pattern to memorize.
6. [Congestion control vocabulary (optional topic)](https://algomaster.io/learn/computer-networks/congestion-control) (AlgoMaster Networks - pcap and concurrent server labs) - Flow Control and Congestion Control Solve Different Problems; Slow Start; Congestion Avoidance and AIMD. Depth: Vocabulary only for the optional topic. No measurement required; stop before the variant comparison.

**Focus**

- TCP numbers bytes, not messages. The ACK advances over the contiguous prefix; a gap stalls acknowledgment even when later bytes arrived.
- An ACK means the peer kernel holds the bytes. It does not mean the application read or acted on them.
- Flow control (receiver window) and congestion control (sender network estimate) are independent limits; the sender obeys the smaller.
- UDP preserves message boundaries and promises nothing else. Loss, duplication and reordering are normal and must be handled above it.

**Reproduce:** Closed-book, write the three handshake messages with initial sequence numbers (client c, server s) and the ACK numbers c+1 and s+1. Then, on loopback with CPython 3.14.4, run a server thread that accepts and closes, and time 100 create_connection plus close calls after 10 warm-up ones; then time 200 round trips of a 4-byte length-prefixed echo (TCP_NODELAY, 20 warm-up) at 64 bytes and 64 KiB. Pinned to two performance cores with taskset -c 2,4 on an i9-12900K with Linux 7.0, three runs gave connect plus close medians of 12 to 16 us, a 64 B echo p50 of about 9 us and a 64 KiB p50 of about 29 us; unpinned runs that landed on efficiency cores were up to about twice as slow. Record yours with the same setup and say which cores ran it.

**Traps**

- Calling a retransmission proof of packet loss. Delayed ACKs, reordering and spurious timeouts cause retransmissions on healthy paths.
- Expecting close to deliver pending application work. A graceful FIN ends the byte stream; it says nothing about processed requests.
- Treating UDP as TCP without acknowledgments. Without sequence numbers and reassembly above it, duplicates and reordering reach the application.

**Practice**

- [AlgoMaster: Reassemble TCP Segments](https://algomaster.io/practice/system-design/reassemble-tcp-segments) - nextExpected over out-of-order overlapping [seq, length] intervals under the contiguous-prefix rule. The gap example ([[0,3],[5,2]] returns 3) is the ACK rule in code; overlapping intervals must not double-count.

**Stop when:** You classify a stall as receiver-window, loss-recovery or endpoint silence from window and ACK evidence, and your reassembler returns 3 and 5 on the two worked examples.

<details>
<summary>Self-test</summary>

1. Segments [0,3) and [5,7) arrived. Which byte does the receiver ACK next?
   - Byte 3. The ACK covers only the contiguous prefix from 0; bytes 5 and 6 wait behind the gap at 3 and 4.
2. The client advertised a zero window for five seconds, then the transfer resumed with no retransmissions. Where was the stall?
   - At the receiving endpoint: its buffer stayed full because the application stopped reading. The network and server were waiting on window updates.
3. Why does a fresh TCP connection cost at least one round trip before data flows?
   - SYN, SYN-ACK and ACK must synchronize sequence numbers and open state on both ends; data normally starts after the exchange.
4. Two identical datagrams arrive over UDP. Did the network duplicate one, or did the sender retransmit?
   - UDP alone cannot tell. Both look identical; only an application sequence number distinguishes a duplicate from a retry.

</details>

#### U3. TLS and HTTP versions

**About 3 h** · **Target:** Explain

Topics: TLS identity, confidentiality and integrity vocabulary; HTTP request-response and connection reuse vocabulary; HTTP/2, HTTP/3 and QUIC vocabulary

The RPCs in this section run over TLS and HTTP. Misattributing a TLS failure to the application wastes every later debugging step, and version choice decides connection reuse.

**You can now**

- Explain what TLS authenticates, what it encrypts, and what stays visible on the wire.
- Read a TLS 1.3 handshake through ClientHello, certificate, CertificateVerify, Finished and ALPN.
- Contrast the HTTP/1.1, HTTP/2 and HTTP/3 wire mappings and state which head-of-line blocking each removes.

**Study**

1. [TLS handshake step by step](https://algomaster.io/learn/computer-networks/tls-handshake) (AlgoMaster Networks - pcap and concurrent server labs) - Step 1 ClientHello through Step 8 Finished; TLS Messages, Records, and TCP Segments; A Worked Handshake Trace. Depth: Skip Session Resumption and 0-RTT detail on first pass; return for the replay warning before the idempotency unit.
2. [Inspecting and diagnosing TLS](https://algomaster.io/learn/computer-networks/tls-handshake) (AlgoMaster Networks - pcap and concurrent server labs) - Inspecting a Real Handshake (s_client, curl timing); Diagnosing Handshake Failures (phase order); Operating and Measuring TLS. Depth: Run the s_client and curl commands yourself; treat the metric list as vocabulary.
3. [HTTP versions compared](https://algomaster.io/learn/computer-networks/http-1-vs-2-vs-3) (AlgoMaster Networks - pcap and concurrent server labs) - One Set of Semantics; HTTP/1.1 text messages; HTTP/2 multiplexed streams; HTTP/3 over QUIC; Three Forms of Head-of-Line Blocking; How a Client Selects a Version.
4. [Minimal HTTP exchange vocabulary](https://beej.us/guide/bgnet0/html/) (Beej's Guide to Network Concepts - TCP and UDP path) - Chapter 5, Section 5.3 (HTTP Summary) only. Depth: Read Section 5.3 only. The chapter 5 client and server projects belong to the sockets and HTTP practice in later units.

**Focus**

- ServerHello proves nothing about identity. Authentication is the certificate chain plus CertificateVerify plus Finished checked against the handshake transcript.
- TLS 1.3 with ephemeral keys gives forward secrecy: a stolen long-term key does not decrypt recorded sessions.
- ALPN negotiates the application protocol inside TLS. A compatible handshake can still fail with no_application_protocol.
- The HTTP versions share semantics and differ on the wire: ordered text messages, multiplexed streams over one TCP connection, streams over QUIC. HTTP/2 removes HTTP-level head-of-line blocking but keeps TCP's; HTTP/3 keeps it only within one stream.

**Reproduce:** Run curl -w with time_namelookup, time_connect, time_appconnect, time_starttransfer and http_version against https://example.com/ three times, and note your curl and TLS library versions and whether DNS was warm. State which interval is DNS, which is TCP, which adds TLS, and why three requests from one place cannot characterize the service.

**Traps**

- Believing the certificate encrypts the data. Ephemeral key exchange protects records; the certificate only authenticates.
- Expecting TLS to hide everything. Server name, record sizes and timing stay visible; that is why session key logs are secrets.
- Calling HTTP/3 faster by definition. It removes TCP head-of-line blocking and can resume faster; path, server and loss still decide.

**Practice**

- [Beej's Network Concepts: Project HTTP Client and Server](https://beej.us/guide/bgnet0/html/) - Chapter 5, Sections 5.1 to 5.5: build the client against a local server; Section 5.6 hints for partial data and status codes. Keep the server on loopback; the point is a correct request-response exchange, not deployment.

**Stop when:** You sort a failed HTTPS request into before-TLS, negotiation, identity, client-auth or ALPN phases, and can say which HTTP version fits a new endpoint and why.

<details>
<summary>Self-test</summary>

1. A capture shows ClientHello, ServerHello, then opaque records. Can you read the HTTP path?
   - No. Everything after ServerHello is encrypted in TLS 1.3. Endpoints, ports, timing and sizes remain; the path needs endpoint logs or key material.
2. time_appconnect minus time_connect is 25 ms. What does that interval contain?
   - Roughly the TLS handshake after TCP connected: certificate, key exchange and Finished plus their round trips. It is cumulative and approximate.
3. Which head-of-line blocking does HTTP/2 keep?
   - TCP-level blocking. One lost TCP segment stalls every multiplexed stream on that connection; HTTP/3 moves recovery to per-stream QUIC.
4. The server presents a valid certificate for another hostname. Does the handshake succeed?
   - No for a correct client. Every signature can verify, but the name check fails, so the client aborts with a certificate alert instead of sending application data.

</details>

#### U4. Sockets, partial reads and writes, and message framing

**About 5 h** · **Target:** Implement

Topics: Socket lifecycle, address resolution and blocking behavior; Partial reads, partial writes and coalesced messages; Length-prefixed framing, limits and malformed input

TCP hands you a byte stream; messages are your construction. This unit builds the framing layer the fault-tested service slice reuses.

**You can now**

- Implement a length-prefixed framed protocol that survives partial reads, partial writes and coalesced arrivals.
- Derive framing state for partial, coalesced, oversized, truncated and malformed input.
- Enforce size limits and version checks, and close cleanly on protocol errors.

**Study**

1. [Stream sockets client and server](https://beej.us/guide/bgnet/html/) (Beej's Guide to Network Programming - sockets to multiplexing) - Section 5.7 (send and recv); Sections 6.1 and 6.2 (simple stream server and client); build the pair first.
2. [Partial sends and shutdown](https://beej.us/guide/bgnet/html/) (Beej's Guide to Network Programming - sockets to multiplexing) - Section 7.4 (Handling Partial sends); Section 5.9 (close and shutdown). Depth: Use shutdown for the half-close direction vocabulary only; full drain behavior belongs to the connections unit.
3. [Stream parsing and the word server](https://beej.us/guide/bgnet0/html/) (Beej's Guide to Network Concepts - TCP and UDP path) - Section 11.2 (Processing a Stream into Packets); Section 11.3.1 (multiple sentences at once); Chapter 13 (The Word Server: get_next_word_packet and extract_word).
4. [Framed TCP sockets in Python](https://algomaster.io/learn/computer-networks/tcp-socket-programming) (AlgoMaster Networks - pcap and concurrent server labs) - Why One recv() or read() Is Not Enough; Python: Reading and Writing Framed Messages; Closing and End-of-Stream; Timeouts Bound Waiting.
5. [A production-shaped echo protocol](https://algomaster.io/learn/computer-networks/concurrent-tcp-server) (AlgoMaster Networks - pcap and concurrent server labs) - The Persistent Echo Protocol (4-byte big-endian length prefix, 64 KiB limit); Concurrency Boundaries; Admission Before Task Creation. Depth: Adopt the length prefix, size limit and 30-second frame deadline. Leave the Java port and the load client for the latency unit.

**Focus**

- Every recv can return one byte, one frame, several frames, or anything between. The parser keeps explicit state: bytes still needed for the header, then bytes still needed for the payload.
- sendall is a loop, not a guarantee. A raw send can write fewer bytes; the remainder must be retried, not dropped.
- Limits come before parsing: check the declared length against the maximum before allocating or reading the payload.
- A version or length violation is a protocol error. Reply if the protocol allows, then close. Never resynchronize by scanning payload bytes for a magic value.

**Reproduce:** With CPython 3.14.4 on loopback, send two frames of a 4-byte length prefix plus 10 bytes back-to-back (28 wire bytes), wait until both sends have landed, then read with recv(5): exactly 6 calls return all bytes. Repeat with one recv(4096): a single call returns all 28 bytes, both frames coalesced. Then feed your framer the same bytes split at every offset and check it yields the same two messages each time.

**Traps**

- Assuming one send equals one recv. Coalescing and splitting are normal; the 28-byte two-frame burst routinely arrives in one recv on loopback.
- Growing the buffer from the declared length without a cap. A corrupt 4 GB prefix becomes a memory-exhaustion attack; validate first.
- Treating a clean FIN mid-frame as a complete message. A peer that began a frame and closed sent a truncated message: a protocol error, not a short message.

**Practice**

- [Beej's Network Concepts: Project The Word Server](https://beej.us/guide/bgnet0/html/) - Chapter 13: implement get_next_word_packet and extract_word against the word-packet format. A stream-to-packet parser with the same state shape as your length-prefixed framer.

**Stop when:** Your framer passes partial, coalesced, oversized, truncated and garbage-prefix cases, and a peer that closes mid-frame yields a protocol error, never a short message.

<details>
<summary>Self-test</summary>

1. recv(5) returned 3 bytes of a 4-byte header, then the next recv returns 0 bytes. What happened and what does the framer do?
   - The peer closed mid-frame. The framer reports a truncation protocol error; the 3 bytes are not a message.
2. The length prefix says 100 bytes but only 60 arrived and there was no FIN. What does the framer do?
   - It waits with the receive deadline running. A partial payload is state (40 bytes still needed), not an error, until the deadline or close.
3. Why check the length against 64 KiB before reading the payload?
   - To bound allocation and read work from untrusted bytes. Reading first lets a bogus prefix force a huge allocation.
4. Two frames arrive in one recv. Does the application need two reads?
   - No. The framer consumes both from the buffered bytes and delivers two messages; read count and message count are unrelated.

</details>

#### U5. RPC schemas, versions, errors and trace context

**About 3 h** · **Target:** Explain + Implement

Topics: Serialization, schemas, protocol versions and error taxonomy; Request IDs, correlation and end-to-end trace context

Schemas and status codes are the contract clients program against; trace context is how you debug it. It builds on the Programming OpenTelemetry unit (programming/concurrency-profiling-operations/logs-metrics-traces), which covered spans and bounded labels; here the wire format is the mechanism.

**You can now**

- Define an RPC schema with field identity, presence rules and safe evolution (add, never reuse).
- Separate transport status from RPC status when reading errors.
- Propagate W3C trace context across hops and keep correlation IDs intact.

**Study**

1. [Schemas and service dataflow](https://dataintensive.net/) (Designing Data-Intensive Applications, 2nd edition - Chapter 5) - Chapter 5, Formats for Encoding Data (printed pp. 163 to 177) for schema merits and compatibility; Dataflow Through Services: REST and RPC (printed pp. 180 to 186) for version coexistence. Depth: Read the two sections only, not the whole chapter. Follow the idempotence pointer to Chapter 12 later, in the streams section.
2. [MIT 6.5840 Lecture 2: RPC structure](https://pdos.csail.mit.edu/6.824/notes/l-rpc.txt) (MIT 6.5840 - RPC, threads and fault vocabulary) - The Remote Procedure Call (RPC) section to the end: the message diagram, the kv.go example and the RPC failure questions. Depth: Read the RPC half only; the threading and crawler half is assumed from the concurrency stage.
3. [Schemas, status and evolution in gRPC](https://algomaster.io/learn/computer-networks/grpc-and-protobuf) (AlgoMaster Networks - pcap and concurrent server labs) - Protocol Buffers as a Schema; Presence and Default Values; Evolving a Protobuf Contract Safely; The Five-Byte gRPC Message Prefix; HTTP Status Is Not RPC Status; gRPC Status Codes.
4. [The status list](https://grpc.io/docs/guides/status-codes/) (gRPC Status Codes) - Full list of Status codes, including DEADLINE_EXCEEDED, UNAVAILABLE, and the codes never generated by the library.
5. [Traceparent and tracestate](https://www.w3.org/TR/trace-context/) (W3C Trace Context) - Section 3.2 (traceparent format and examples); Sections 3.4 to 3.5 (legal mutations when forwarding).

**Focus**

- Wire identity is the field number, not the name. In the binary encoding, renaming tag 2 is compatible; changing 2 to 4 deletes a field and creates another. JSON mappings use names, so a rename breaks them.
- proto3 scalars conflate absent with default. Use optional, oneof or message fields when the distinction changes behavior.
- HTTP 200 with a nonzero grpc-status is an RPC failure. Monitors that check only HTTP status report success while every call fails.
- Forwarding a trace means sending traceparent with a new parent-id and preserving tracestate order; a hop that regenerates the trace-id splits the trace.

**Reproduce:** Closed-book, parse 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01 into version 00, 16-byte trace-id, 8-byte parent-id and sampled flag, and state the legal forwarding mutations (new parent-id, optional sampled change, restart, downgrade). Then add a request-id field to your framed protocol and show it echoed unchanged in the response.

**Traps**

- Reusing a deleted field number for a new type. Old binaries parse the new bytes as the old type; use a fresh number.
- Hiding errors inside OK responses. Clients, retry policies and metrics can only reason about errors carried in status.
- Putting secrets or high-cardinality values into trace context. traceparent and tracestate propagate to every downstream service, and the spec forbids personally identifying data there.

**Practice**

- [AlgoMaster: Audit Correlation ID Propagation](https://algomaster.io/practice/system-design/audit-correlation-id-propagation) - brokenHops and firstBrokenHop over receive-forward chains; regenerated IDs break the boundary rule. A later hop that preserves a regenerated ID is not itself broken; only the regenerating hop is.
- [AlgoMaster: Calculate Trace Span Exclusive Time](https://algomaster.io/practice/system-design/calculate-trace-span-exclusive-time) - Exclusive time as duration minus the union of direct-child intervals; ties break by smaller ID. Subtract the union [10,80), not the sum of overlapping children.

**Stop when:** You evolve a schema without breaking an old reader, classify an RPC failure by its status code, and trace one request across two hops without dropping its ID.

<details>
<summary>Self-test</summary>

1. Field 2 changes from string to int32 with the same number. Wire-compatible?
   - No. A string travels length-delimited and an int32 as a varint, so old readers cannot decode it as their string; most runtimes keep it as an unknown field and the value is lost to them. Add a new field number instead.
2. A proxy returns HTTP 200 for an RPC that failed with grpc-status 14. What should the dashboard show?
   - An RPC failure with UNAVAILABLE. Transport success and RPC outcome are separate channels.
3. A service forwards traceparent byte-identical and appends its tracestate entry. Correct?
   - No. It must set parent-id to its own current operation ID; byte-identical forwarding claims the downstream work is the same span. New tracestate entries go first, not last.
4. Why must the server application stop its own work when gRPC signals cancellation for deadline?
   - The runtime only signals; spawned database calls and child RPCs keep running and consuming resources until the application stops them.

</details>

#### U6. Deadlines, retries and idempotency across RPC

**About 4 h** · **Target:** Derive + Implement

Topics: Deadlines, timeouts, backoff, jitter and retry budgets; Idempotency keys, duplicate suppression and ambiguous side effects

A timeout tells the client nothing about the server. This unit turns that ambiguity into a protocol: bounded retries plus keys that make repeats safe. It assumes the Programming retry-budget and idempotency-ledger units (programming/concurrency-profiling-operations/cancellation-timeouts-retries, programming/interfaces-data-apis/http-apis-idempotency) and moves them from HTTP handlers onto the RPC wire.

**You can now**

- Derive a retry budget and the worst-case attempt amplification across layered retries.
- Propagate an absolute deadline across hops without extending it.
- Implement idempotency keys with a durable state machine and state exactly when an outcome is unknown.

**Study**

1. [MIT 6.5840 Lecture 2: RPC failure ambiguity](https://pdos.csail.mit.edu/6.824/notes/l-rpc.txt) (MIT 6.5840 - RPC, threads and fault vocabulary) - RPC problem: what to do about failures (the client does not know if the server saw the request); best-effort RPC; at-most-once; the two-Put reordering example.
2. [Retries, backoff and budgets](https://algomaster.io/learn/computer-networks/retries-and-backoff) (AlgoMaster Networks - pcap and concurrent server labs) - Timeouts and Ambiguous Outcomes; Full Jitter; Fleet-Wide Retry Budget; Avoid Retry Amplification Across Layers; A Deadline-Aware Retry Loop.
3. [Idempotency keys and durable execution](https://algomaster.io/learn/computer-networks/idempotency) (AlgoMaster Networks - pcap and concurrent server labs) - Idempotency Keys Identify One Logical Operation; Define the Key Contract (scope, fingerprint, replay, retention); The Server Needs a Durable State Machine; Atomicity Closes the Crash Window.
4. [Deadlines and propagation](https://grpc.io/docs/guides/deadlines/) (gRPC Deadlines guide) - Overview (deadline versus timeout); Deadlines on the Client; Deadline Propagation (remaining-time forwarding, clock-skew shielding).
5. [gRPC deadlines, cancellation and retries](https://algomaster.io/learn/computer-networks/grpc-and-protobuf) (AlgoMaster Networks - pcap and concurrent server labs) - Deadlines, Cancellation, and Retries: realistic deadlines, application-owned cancellation, retry only safe-to-repeat operations.

**Focus**

- Every timeout hides three possible server states: never saw it, executed and failed to reply, executed and reply lost. Retry design starts by listing all three.
- Deadlines are absolute points in time; timeouts are durations. Propagate the remaining time, never a fresh full timeout, or downstream work outlives the caller.
- A retry budget bounds attempts per operation and per fleet. Unbounded per-hop retries multiply across layers into a retry storm.
- Idempotency keys need a durable state machine (received, in-progress, completed) with atomic transitions; memory-only dedup forgets across restarts.

**Reproduce:** Closed-book, propagate startTime 0 and client timeout 100 through processing times [10,20,5] with local bounds [80,100,10]: hop deadlines [90,90,45]. Then run the deterministic proxy on loopback (CPython 3.14.4): 200 ms injected delay with a 100 ms client deadline records a client timeout although the server processed the request; the duplicate proxy leaves a second frame waiting on the connection. Reference run on kernel 7.0.0-38-generic, i9-12900K confirmed both rows.

**Traps**

- Retrying on DEADLINE_EXCEEDED without an idempotency key. The first attempt may have completed; the retry repeats the side effect.
- Resetting a full timeout at each hop. Three hops with fresh 2 s timeouts let downstream work run until about 6 s, 4 s after a 2 s caller has given up.
- Treating at-most-once as safety. Never resending avoids duplicates but turns every lost reply into a user-visible failure; choose the semantics per operation.

**Practice**

- [AlgoMaster: Propagate a gRPC Deadline](https://algomaster.io/practice/system-design/propagate-a-grpc-deadline) - propagate with remaining-time bounds, parent cap, and -1 past the inherited deadline. The [90,90,45] hand derivation in Reproduce is the first case; the exact-deadline case returns -1.
- [AlgoMaster: Build an Idempotent Consumer](https://algomaster.io/practice/system-design/build-an-idempotent-consumer) - process returns true on first delivery, false on duplicates, without resetting recorded IDs. Extend it with an IN_PROGRESS state and a restart to reach the unit's durable contract.

**Stop when:** You derive hop deadlines and a layered retry budget by hand, and your keyed server produces one effect for any number of duplicate deliveries including a restart.

<details>
<summary>Self-test</summary>

1. The client timeout fires at 100 ms; the server log shows the write committed at 150 ms. What does the client know?
   - Nothing about the outcome. The timeout only proves the reply did not arrive in time; the effect may have happened, and only a keyed status check can resolve it.
2. Two layers each retry up to 3 times on failure. What is the worst-case attempt count for one user request?
   - Up to 16: the outer layer makes 1 initial attempt plus 3 retries, and each of the 4 can trigger up to 4 inner attempts. Layered retries multiply.
3. Why does gRPC convert a deadline to a remaining-time timeout before forwarding?
   - Server clocks may disagree. Sending a duration shields propagation from clock skew; sending an absolute timestamp does not.
4. A duplicate arrives while the first attempt is still IN_PROGRESS. What does the state machine do?
   - It never starts the effect a second time. It waits for the first attempt within its own deadline, returns a documented in-progress response, or returns an operation the client can poll; the stored result is replayed once it exists.

</details>

#### U7. Connection shutdown, pools and latency decomposition

**About 4 h** · **Target:** Explain + Measure

Topics: Cancellation, half-close and graceful connection shutdown; Connection pools, server queues and load-balancing vocabulary; Client, network, queue, handler and dependency latency

Setup cost decides reuse policy; shutdown order decides deploy safety. It assumes the Programming container health and SIGTERM-drain unit (programming/concurrency-profiling-operations/health-containers-runbooks); here the mechanism is sockets, accept queues, pools and load-balancer coordination.

**You can now**

- Explain half-close, TIME-WAIT and CLOSE-WAIT ownership, and the graceful shutdown order.
- Size a connection pool from concurrency with Little's Law and key pools by security boundary.
- Decompose client latency into DNS, connect, TLS, queue, handler and dependency parts from client, server and trace evidence.

**Study**

1. [TCP termination and half-close](https://algomaster.io/learn/computer-networks/tcp-connection-termination) (AlgoMaster Networks - pcap and concurrent server labs) - The Normal Four-Segment Close; Understanding TIME-WAIT; Understanding CLOSE-WAIT; Half-Close at the Socket API; Abrupt Termination with RST.
2. [listen backlog, accept, close and shutdown](https://beej.us/guide/bgnet/html/) (Beej's Guide to Network Programming - sockets to multiplexing) - Section 5.5 (listen and the backlog); Section 5.6 (accept); Section 5.9 (close and shutdown).
3. [Connection pooling and keep-alive](https://algomaster.io/learn/computer-networks/connection-pooling) (AlgoMaster Networks - pcap and concurrent server labs) - How a Pool Handles a Request; Pool Keys Protect Routing and Security Boundaries; Size the Pool from Concurrency; Separate the Timeout Boundaries; Stale Connections Cannot Be Eliminated Completely.
4. [Graceful shutdown and draining](https://algomaster.io/learn/computer-networks/graceful-shutdown) (AlgoMaster Networks - pcap and concurrent server labs) - A Shutdown State Machine; The Order of Operations Matters; Budget the Grace Period; Testing Shutdown Under Load.
5. [Where latency comes from](https://algomaster.io/learn/computer-networks/where-latency-comes-from) (AlgoMaster Networks - pcap and concurrent server labs) - The Four Per-Hop Delays; Protocol Round Trips Add Latency; Measuring an HTTP Latency Breakdown; Interpreting Common Network Measurements.
6. [A latency decomposition worked example](https://algomaster.io/learn/computer-networks/reading-a-real-pcap) (AlgoMaster Networks - pcap and concurrent server labs) - Turn the Stream into a Timeline; Inspect the Edges of the Gap. Depth: Read as a decomposition method: phase table first, then edges of the dominant gap. You already studied its flow-control mechanism in the transport unit.

**Focus**

- Each direction closes independently. shutdown for writing sends FIN while the read side stays open; close with unread data still queued can reset the connection.
- TIME-WAIT belongs to the active closer and lasts twice the maximum segment lifetime; a lingering CLOSE-WAIT means the application never closed, which is a leak, not a TCP quirk.
- Pool size follows offered concurrency: arrival rate times hold time, plus headroom. Pool keys must include every security boundary (host, TLS identity, credentials), never just the IP.
- One client number never decomposes itself. DNS, connect, TLS, queue, handler and dependency times come from different instruments; subtract only compatible timestamps.

**Reproduce:** Derive the pool size closed-book: 600 requests/s times 50 ms mean hold gives 30 busy connections, so 20 cannot sustain the average and exactly 30 leaves no burst headroom. Then split one HTTPS request to https://example.com/ into DNS, connect, TLS and first-byte intervals with curl -w, three times, and report the numbers with your curl and TLS library versions and warm or cold DNS.

**Traps**

- Reusing a connection across hostnames that resolve to one IP. Certificates and authorization attach to names, not addresses.
- Treating starttransfer minus appconnect as server time. It still includes request travel, queueing and first-byte return.
- Draining by closing the listener only. In-flight requests, keep-alive connections and load-balancer caches need explicit propagation, a grace budget and a forced-stop step.

**Practice**

- [AlgoMaster: Design a Connection Pool Queue](https://algomaster.io/practice/system-design/design-a-connection-pool-queue) - acquire and release with FIFO waiter handoff; a release hands directly to the oldest waiter. The release-to-waiter handoff is the bounded-admission behavior your pool needs.

**Stop when:** You size a pool from rate and hold time, place a CLOSE-WAIT leak and a zero-window stall from evidence, and write the shutdown order for a pooled service.

<details>
<summary>Self-test</summary>

1. ss shows many sockets in CLOSE-WAIT. Whose bug is it?
   - The local application's. The peer closed its side; the local end never closed its socket, so the state persists.
2. A pool holds 20 HTTP/1.1 connections at 600 requests/s with 50 ms holds. What happens?
   - Waiters accumulate without bound. The pool sustains about 400 requests/s; the excess queues, and latency and memory grow.
3. Why must a pool discard a connection that received Connection: close?
   - The server will not accept another exchange on it. Lending it out guarantees the next borrower fails.
4. A pcap shows a 5 s gap with zero-window advertisements and no retransmissions. Which latency component grew?
   - None of the network components. An endpoint stall at the receiver inflated total time; DNS, connect and TLS phases were already complete.

</details>

#### U8. Deterministic network fault injection

**About 3 h** · **Target:** Implement + Measure

Topics: Deterministic delay, disconnect, duplicate and restart injection

Robustness claims are predictions until a fault schedule runs. This unit builds the harness the milestone's fault-tested service slice depends on, with the deterministic schedules of systems/concurrency-bounded-work/schedule-testing-contention.

**You can now**

- Implement a deterministic proxy that injects delay, duplicate, drop and restart faults on a framed protocol.
- Measure timeout, duplicate and disconnect behavior and state the resulting delivery guarantee precisely.
- Write the fault matrix the section mini-project will execute.

**Study**

1. [Replicated Log and Stream Processor: protocol slice](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-2/replicated-log-stream-processor.md) (Replicated Log and Stream Processor - protocol slice) - The deterministic network fault list (delay, duplicate, disconnect, restart and companions); the protocol requirements for the single-node framed service; the delivery-contract questions. Depth: Use only the fault list and the single-node protocol slice. Replication and consensus stay in the later project.
2. [Failure modes and unknown outcomes](https://algomaster.io/learn/computer-networks/failure-modes-and-partitions) (AlgoMaster Networks - pcap and concurrent server labs) - A Network Call Has Several Failure Points; Timeouts Turn Unbounded Waiting into a Decision; Known Failure, Known Success, and Unknown Outcome.
3. [Observable overload and failure behavior](https://algomaster.io/learn/computer-networks/concurrent-tcp-server) (AlgoMaster Networks - pcap and concurrent server labs) - Overload Behavior Is Observable; Failure Behavior; Common Failure Patterns. Depth: Read for the failure-injection checklist; you already implemented the server contract in the sockets unit.

**Focus**

- Deterministic means seeded and scripted: same fault schedule, same interleaving, same verdict. Random chaos finds bugs; only replayable schedules prove fixes.
- Inject above TCP when testing the protocol (duplicate frames, truncated writes, slow reads) and at the connection level when testing the path (delay, drop, restart).
- Each fault has an expected client observation: delay past deadline gives timeout with unknown outcome; duplicate gives one effect under keys; drop gives disconnect with unknown outcome.
- Restart is two faults at once: in-flight requests resolve as unknown, and post-restart state must reconcile pre-restart keys by policy.

**Reproduce:** Run the three-case proxy matrix on loopback (CPython 3.14.4): 200 ms injected delay with a 100 ms client deadline records timeout; duplicate delivery leaves a second frame waiting on the connection; response drop records disconnect. Extend the script with a restart case and record all four rows with the fault parameters beside each verdict. Reference run on Linux x86-64 kernel 7.0.0-38-generic, i9-12900K confirmed the first three rows.

**Traps**

- Counting a passed clean-path test as fault coverage. Timeouts, duplicates and restarts exercise different code than the happy path.
- Driving fault timing from wall-clock sleeps with tight deadlines. Slow machines flake; script explicit fault steps with generous margins.
- Logging faults only at the injector. Verdicts need client observation, server state and the schedule in one record, or failures cannot be replayed.

**Practice**

- The section mini-project covers this: the full fault matrix (partial, coalesced, oversized, malformed, timeout, duplicate, disconnect, restart) against the versioned framed service, with replayable schedules and verdict records.

**Stop when:** Your proxy replays a scripted fault schedule, every row records fault parameters with client observation and server state, and you can state the exact delivery guarantee in one sentence.

<details>
<summary>Self-test</summary>

1. The delay fault fires but the client still reports success. Is the test wrong?
   - Either the deadline exceeds the injected delay or the client has no deadline. A fault test must assert the client observation, not just run the injector.
2. Why must the duplicate test read twice?
   - The first read succeeds in both correct and buggy servers. Only the second read shows whether a duplicate arrived, and the effect log shows whether it executed twice.
3. The server restarts between request receipt and response. What may the client conclude?
   - Only that the outcome is unknown. The effect may or may not have committed; resolution needs a keyed status query after reconnect.

</details>

### Mini-project: A versioned framed key-value service with request identity, deadlines and a fault matrix

**About 12 to 16 hours.** Put the service slice on the network: a TCP key-value service with a length-prefixed frame, a versioned payload, request IDs and trace context, deadline propagation and idempotent writes, running its work through the pool from the concurrency section. Then build a deterministic fault proxy and pass the full fault matrix with a verdict for every case.

1. Define the wire format in kv/protocol.py: a 4-byte big-endian length followed by a UTF-8 JSON payload of at most 64 KiB, with a 30 s deadline for receiving a whole frame. The payload carries v (protocol version), id (request ID), op (put, get or delete), key, value, idem (an idempotency key for writes), deadline_ms (the caller's remaining budget) and traceparent. Write the framer as a pure function over a byte buffer and test it with two frames split at every offset, recv(5) reads, an oversized length, a zero length and a frame cut off by close.
2. Serve it with threads that only read frames and admit work: every decoded request goes into the WorkerPool, a full queue answers at once with an overloaded error, and each response echoes id and keeps the trace-id with a new parent-id. An unknown version gets a typed error naming the supported versions, and unknown payload fields are ignored so a newer client can still talk to an older server.
3. Propagate deadlines without comparing clocks across processes: the client sends its remaining budget, the server turns it into an absolute deadline on its own monotonic clock at arrival, and anything it calls gets only what remains. Check the AlgoMaster case in a test ([10,20,5] with bounds [80,100,10] gives [90,90,45]), and show with the proxy below that a 200 ms delay against a 100 ms client deadline gives a client timeout although the server did the work.
4. Make writes idempotent: an idempotency table keyed by (client, idem) holds IN_PROGRESS or DONE, the stored response and a hash of the request body. A duplicate of a DONE write replays the stored response, a duplicate during IN_PROGRESS never starts the effect again and gets an in-progress error the client may retry, and the same key with a different body is rejected. Client retries use capped exponential backoff with full jitter, only for errors the protocol marks retryable, and stop at the caller's deadline.
5. Write kv/client.py with a connection pool sized by Little's Law from your target rate and measured hold time (600 requests per second at 50 ms is 30 connections busy on average, so 30 leaves no headroom), a per-request deadline and request IDs generated by the client. Test pool exhaustion: a caller waiting for a connection gives up at its deadline instead of queuing forever.
6. Write a fault proxy between client and server driven by a schedule file: a seed plus, per connection and frame number, one action (pass, delay ms, drop request, drop response, duplicate, split into 1-byte writes, coalesce with the next frame, truncate and close, corrupt the length). It logs every action it takes, and the same schedule must produce a byte-identical action log on every run.
7. Pass the fault matrix: partial (1-byte writes), coalesced, oversized, malformed, timeout, duplicate, disconnect and server restart. For each case write a verdict row with the fault parameters, the client observation (result, error or timeout), the server state (applied writes and idempotency entries) and whether the effect is known applied, known not applied, unknown or safely repeated. Duplicated and retried writes must leave exactly one applied effect. State lives in memory until the next section, so keep the restart row as the open durability gap and rerun it there.
8. Capture one put with tcpdump -i lo (capturing needs root or CAP_NET_RAW), or run the server in a container and attach a netshoot container to its network namespace (--network container:NAME --cap-add NET_ADMIN --cap-add NET_RAW). Label the handshake, the length prefix, the payload bytes and the close, and keep the capture with the write-up.

**Deliverables**

- kv/protocol.py, kv/server.py and kv/client.py with framer, version, deadline, idempotency, retry and pool tests.
- The fault proxy, its schedule format and action logs showing that a replayed schedule is byte-identical.
- The fault matrix: eight cases with fault parameters, client observation, server state and verdict, and the restart row marked as the open durability gap.
- One labeled packet capture of a put.

**Checks**

- rubric: Self-grade with the rubric below.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Framing | The framer returns the same messages for every split offset and rejects oversized, zero-length and truncated frames with typed errors. | A property test over random payloads and random splits backs the offset tests. |
| Identity and deadlines | Responses echo id and trace context, budgets shrink hop by hop on monotonic clocks, and expired work never starts. | A test shows a request whose budget runs out in the queue is dropped by the pool, and the client sees a deadline error, not a late success. |
| Idempotency and retries | Duplicates of DONE writes replay, duplicates during IN_PROGRESS never start a second effect, and a reused key with a different body is rejected. | Retries are jittered, stop at the deadline and back off on the overloaded error, and a seeded test counts the attempts. |
| Fault matrix | All eight cases have verdict rows, replayed schedules give byte-identical action logs, and duplicated or retried writes apply once. | Every unknown outcome names the probe that would resolve it, such as a read by idempotency key. |

Feeds into: Capstone service slice: the versioned framed RPC, request identity, deadlines, retries and the deterministic network faults. Dossier: the fault matrix is part of its failure evidence.

### Resource route

- **Primary - Course:** [Beej's Guide to Network Programming - sockets to multiplexing](https://beej.us/guide/bgnet/html/) - Read What is a socket?, IP addresses and data structures, Client-server background, System calls or bust, Client-server examples, Slightly advanced techniques and sendall. Build the simple TCP pair first, then replace delimiter assumptions with a bounded length-prefixed protocol.
- **Required - Theory:** [Beej's Guide to Network Concepts - TCP and UDP path](https://beej.us/guide/bgnet0/html/) - Read the OS and sockets, protocol layering, IP, UDP and TCP chapters alongside packet captures from your own client and server. Use it to explain transport behavior rather than memorize layer names.
- **Required - Practice:** [AlgoMaster Networks - pcap and concurrent server labs](https://algomaster.io/learn/computer-networks/course-roadmap) - Use Reading a Packet Capture: A Real Bug and Building a Concurrent TCP Echo Server after the Beej implementation. Reproduce one packet-level observation and one admission, deadline or shutdown behavior in your independently written service.
- **Support - Theory:** [MIT 6.5840 - RPC, threads and fault vocabulary](https://pdos.csail.mit.edu/6.824/schedule.html) - Read the introductory RPC and threads material plus the lab guidance. Use it to enumerate timeout ambiguity and duplicate effects. Stop before Raft and the full lab sequence.
- **Support - Project:** [Replicated Log and Stream Processor - protocol slice](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-2/replicated-log-stream-processor.md) - Use only the protocol requirements, deterministic network fault matrix and delivery-contract questions. Build the single-node framed service now; keep replication and consensus for the later project.
- **Required - Theory:** [Designing Data-Intensive Applications, 2nd edition - Chapter 5](https://dataintensive.net/) - Read Formats for Encoding Data (printed pp. 163 to 177) for schema merits and compatibility, and Dataflow Through Services: REST and RPC (printed pp. 180 to 186) for service dataflow, version coexistence and the idempotence pointer.
- **Reference - Reference:** [gRPC Deadlines guide](https://grpc.io/docs/guides/deadlines/) - Read Overview, Deadlines on the Client and Deadline Propagation for absolute deadlines, remaining-time forwarding and clock-skew shielding.
- **Reference - Reference:** [gRPC Status Codes](https://grpc.io/docs/guides/status-codes/) - Read the full status list, including DEADLINE_EXCEEDED, UNAVAILABLE and the codes never generated by the library, for the error taxonomy.
- **Reference - Reference:** [W3C Trace Context](https://www.w3.org/TR/trace-context/) - Read Section 3.2 for the traceparent format and Sections 3.4 to 3.5 for the legal traceparent and tracestate mutations when forwarding.

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

### Study units

#### U1. Relational model, relational algebra and SQL joins

**About 3 h** · **Target:** Explain + Implement

Topics: Relational tables, tuples, keys and constraints; Relational algebra and SQL selection, projection and joins

Assume Programming's relational-sql-queries unit. Here the job is the semantic contract an optimizer must preserve, including duplicates, constraints and null-extended rows, not another join tutorial.

**You can now**

- Translate selection, projection and an inner equijoin into an operator tree, preserving SQL multiplicities.
- Specify keys, foreign keys and row constraints for a normalized state schema.
- Prove one filter-pushdown rewrite and give a counterexample to an unsafe outer-join rewrite.

**Study**

1. [Lecture 1: Relational Model & Algebra](https://15445.courses.cs.cmu.edu/fall2025/notes/01-relationalmodel.pdf) (CMU 15-445/645 - database and storage core) - Sections 4-6, Relational Model, DMLs and Relational Algebra, pp. 3-5. Depth: Use the operator definitions. The set-union example on p. 4 uses UNION ALL, which preserves duplicates; use UNION for set union. Keep set and bag semantics separate.
2. [PostgreSQL 18: Constraints](https://www.postgresql.org/docs/18/ddl-constraints.html) (PostgreSQL - EXPLAIN and transaction isolation lab) - Sections 5.5.1-5.5.5: CHECK, NOT NULL, UNIQUE, primary keys and foreign keys.

**Focus**

- Classical projection removes duplicates; ordinary SQL SELECT does not. A rewrite must preserve the requested multiplicity, not just the distinct values.
- An inner-join filter referring only to one input can move below that join. A WHERE filter on an outer join's nullable side can remove unmatched rows.
- A foreign key constrains references, not join multiplicity. CHECK(value > 0) alone permits NULL in PostgreSQL.

**Reproduce:** Section setup: start docker run -d --rm --name atlas-pg-sys4 -e POSTGRES_PASSWORD=atlas -p 127.0.0.1:55444:5432 postgres:18. Connect to postgresql://postgres:atlas@127.0.0.1:55444/postgres, or use docker exec -i atlas-pg-sys4 psql -X -U postgres. Stop it with docker stop atlas-pg-sys4 after the section. In a fresh database create parent(id int PRIMARY KEY) and child(id int PRIMARY KEY, parent_id int NOT NULL REFERENCES parent(id), value int NOT NULL CHECK(value>0)). Insert parents (1),(2) and children (1,1,10),(2,1,20),(3,2,30). Draw the operator tree for SELECT p.id FROM parent p JOIN child c ON p.id=c.parent_id WHERE c.value>=20; then move the filter into a child subquery and compare ordered results: both return 1,2. Without the value filter, COUNT(*) of the join is 3 but counting parents with EXISTS is 2. Test rejection of a duplicate child id, parent_id=3, NULL parent_id and value=0 in separate statements.

**Traps**

- Adding DISTINCT to hide a faulty join. It changes semantics and may conceal a missing key predicate.
- Moving a right-side predicate from ON to WHERE in a LEFT JOIN and expecting unmatched left rows to survive.

**Practice**

- The section mini-project covers this: normalized metadata tables, database-enforced constraints, and bag-aware equivalence tests for one join rewrite.

**Stop when:** Both operator trees return the same ordered multiset, all four invalid inserts fail, and an unmatched-parent fixture demonstrates why the outer-join rewrite is unsafe.

<details>
<summary>Self-test</summary>

1. Why does the unfiltered join have three rows but EXISTS find only two parents?
   - Parent 1 has two matching children. The join emits both pairs; EXISTS is a yes/no test for each parent.
2. Can projecting away a primary key create duplicate SQL rows?
   - Yes. Distinct tuples can have the same remaining attributes, and SELECT preserves both unless DISTINCT is requested.
3. Does CHECK(value > 0) reject NULL?
   - No. CHECK accepts true or unknown. Add NOT NULL if missing values violate the invariant.

</details>

#### U2. Aggregations, windows, nulls and point-in-time snapshots

**About 3 h** · **Target:** Implement

Topics: Aggregations, windows, null behavior and boundary tests; Point-in-time snapshots and feature availability

Assume Programming's relational-sql-queries and transactions-isolation units. A consistent engine snapshot is not the same as a historically available feature set; this unit makes the two contracts explicit.

**You can now**

- Test aggregation and window frames against ties, nulls, empty inputs and cutoff boundaries.
- Construct feature rows using both event time and availability time without future leakage.
- Preserve an immutable, ordered query result and its provenance for a point-in-time dataset.

**Study**

1. [Lecture 2: Modern SQL](https://15445.courses.cs.cmu.edu/fall2025/notes/02-modernsql.pdf) (CMU 15-445/645 - database and storage core) - Section 4, Aggregates, pp. 1-3.
2. [PostgreSQL 18: Window Functions](https://www.postgresql.org/docs/18/functions-window.html) (PostgreSQL - EXPLAIN and transaction isolation lab) - Section 9.22, Table 9.67 and the paragraphs on peers, default frames and whole-partition aggregation.
3. [Point-in-time joins](https://docs.feast.dev/getting-started/concepts/point-in-time-joins) (Point-in-time joins) - Point-in-time joins, including the TTL rule, then Retrieving features as of the event time. Depth: Read the semantics only. Do not install Feast; express event and availability predicates explicitly in PostgreSQL.

**Focus**

- GROUP BY collapses rows; a window preserves them. COUNT(*) counts rows, COUNT(value) excludes nulls, and SUM over no non-null values returns NULL.
- An ordered window's default frame includes peers through the current peer group. Use an explicit ROWS frame and a unique tie-breaker for a row-by-row prefix.
- For an as-served feature, require event_at <= cutoff and available_at <= cutoff before choosing the newest eligible row. Availability must mean when serving could actually use it.
- An MVCC snapshot gives a consistent current extraction. Persist its ordered result, query, cutoff and content digest; a snapshot identifier alone cannot reproduce it indefinitely.

**Reproduce:** Use the section PostgreSQL setup. Create feature(id int PRIMARY KEY, entity int, event_at int, available_at int, value int) and insert (1,1,8,9,10),(2,1,9,12,99). At cutoff 10, filter entity=1, event_at<=10 and available_at<=10, then ORDER BY event_at DESC, available_at DESC, id DESC LIMIT 1: get 10, not 99. Separately use VALUES (1,8,10),(2,8,20) as (id,event_at,value): SUM(value) OVER(ORDER BY event_at) returns 30,30, while ORDER BY event_at,id ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW returns 10,30. On one NULL::int row, COUNT(*),COUNT(value),SUM(value) is 1,0,NULL. Export the eligible rows with an explicit ORDER BY inside one read-only REPEATABLE READ transaction; record the SQL, cutoff and SHA-256 of the export. Recheck the saved bytes after changing the live table.

**Traps**

- Ranking before filtering availability. A late newer row can win and then remove an entity whose older eligible feature should have been used.
- Treating event-time correctness as availability correctness. A later backfill can have an old event timestamp.
- Using a timestamp alone to break ties, or expecting last_value with the default frame to return the partition's final value.

**Practice**

- The section mini-project covers this: null, tie and exact-cutoff tests, late backfills, and an immutable point-in-time export with query and digest provenance.

**Stop when:** The three fixtures match the stated results and the saved export remains verifiable after a live-table backfill.

<details>
<summary>Self-test</summary>

1. Why are both default-frame prefix sums 30 in the tie fixture?
   - Both rows are peers on event_at. Each default frame includes the entire peer group.
2. Does a row at event_at=9, available_at=12 belong to an as-served snapshot at 10?
   - No. It occurred before the cutoff but was unavailable then.
3. Does a stable MVCC snapshot prevent historical leakage?
   - No. It stabilizes which current row versions are read, not when their feature values became available historically.

</details>

#### U3. Pages, buffer pools and storage layouts

**About 4 h** · **Target:** Explain

Topics: Pages, records, buffer pools and storage managers; Row, column and log-structured layout trade-offs

Assume Programming's layout-alignment-locality unit. Database layout adds page indirection, eviction and write ordering to CPU locality; those mechanisms explain work that SQL syntax cannot show.

**You can now**

- Trace a record through page identifiers, slots and buffer frames.
- Explain pinning, dirty-page eviction and the distinction between transaction locks and internal latches.
- Choose row, column or log-structured layout for point updates, projections and scans.

**Study**

1. [Lecture 3: Database Storage I](https://15445.courses.cs.cmu.edu/fall2025/notes/03-storage1.pdf) (CMU 15-445/645 - database and storage core) - Sections 4 and 6-11: disk-oriented overview, files, pages, heap, page layout, record IDs and tuple layout, pp. 2-5. Depth: Do not adopt section 7's unconditional hardware-page atomic-write guarantee. Atomicity under power loss depends on the device and I/O contract, not the page's size alone.
2. [Lecture 4: Memory & Disk Management](https://15445.courses.cs.cmu.edu/fall2025/notes/04-bufferpool.pdf) (CMU 15-445/645 - database and storage core) - Sections 2-5: Buffer Pool, OS versus DBMS, replacement policies, and Disk I/O and OS Cache, pp. 2-5.
3. [Lectures 5 and 6: layouts](https://15445.courses.cs.cmu.edu/fall2025/schedule.html) (CMU 15-445/645 - database and storage core) - Lecture 5 notes, sections 2-4, pp. 1-3; Lecture 6 notes, sections 1-2, pp. 1-2: workloads and storage models. Depth: Stop before Lecture 6's compression algorithms.
4. [PostgreSQL 18: Database Page Layout](https://www.postgresql.org/docs/18/storage-page-layout.html) (PostgreSQL - EXPLAIN and transaction isolation lab) - Section 66.6, Tables 66.2-66.3 and the item-identifier paragraphs; stop before 66.6.1.

**Focus**

- A page ID identifies stored data; a frame identifies a current memory copy. A slot can remain stable while its tuple moves within a page.
- A pin prevents eviction, not concurrent mutation. A latch protects the buffer manager's data structures; transaction isolation is a different job.
- A dirty victim needs successful writeback before reuse. If all frames are pinned, the manager must wait or reject rather than evict a live pointer.
- Row stores favor whole-record access; column stores can avoid unrelated columns; log layouts defer consolidation. None makes all workloads cheaper.

**Reproduce:** Closed-book, trace a two-frame model: A has pin_count=1 and dirty=false; B has pin_count=0 and dirty=true. Request C. B is the only possible victim; write B successfully, remove its page-to-frame mapping, then read C and install its mapping. Repeat with both frames pinned: no victim is legal. Draw a slotted page whose slot keeps its index while its tuple moves during compaction. In the section PostgreSQL container run SHOW block_size; the tested PostgreSQL 18.6 build returned 8192 bytes. Use the reported value, not an assumed OS page size, to label the database-page drawing.

**Traps**

- Treating an unpinned dirty page as immediately reusable. A failed writeback must not destroy its only current copy.
- Equating the DBMS buffer pool with the kernel page cache, or equating pinning with locking.
- Assuming a page-sized write is atomic across a power cut. Torn writes remain part of the failure model.

**Practice**

- The section mini-project covers this: a page/frame trace with pin exhaustion and failed-writeback cases, plus a layout choice for the append-only store and its read workload.

**Stop when:** You draw both eviction traces without violating a pin or losing dirty data, and justify a layout for one point-update and one projection-heavy workload.

<details>
<summary>Self-test</summary>

1. Why can a slot reference survive movement of tuple bytes within a page?
   - The slot is an indirection entry. Updating its offset preserves the page-and-slot reference.
2. Why cannot C replace A in the two-frame trace?
   - A is pinned. A caller may still hold a pointer to its contents.
3. Does selecting two columns from a wide row store read only those two columns from storage?
   - Not generally. The engine fetches pages containing whole tuples, although indexes or other access paths can change the work.

</details>

#### U4. Hash indexes, B-trees, selectivity and range scans

**About 3 h** · **Target:** Explain + Derive

Topics: Hash indexes, B-trees, selectivity and range scans

Assume Programming's indexes-query-plans unit and its scattered-versus-clustered comparison. Here you derive the structure underneath a probe and range scan rather than repeat the sequential-scan cost experiment.

**You can now**

- Derive B+tree fan-out, leaf capacity and lookup depth from an explicit page format.
- Trace a leaf split and distinguish copied leaf separators from promoted internal separators.
- Choose hash or ordered indexing for equality, ranges and a stated selectivity.

**Study**

1. [Lecture 7: Hash Tables](https://15445.courses.cs.cmu.edu/fall2025/notes/07-hashtables.pdf) (CMU 15-445/645 - database and storage core) - Sections 2-5: hash tables, hash functions, static and dynamic hashing, pp. 1-4.
2. [Lecture 8: Indexes & Filters I](https://15445.courses.cs.cmu.edu/fall2025/notes/08-indexes1.pdf) (CMU 15-445/645 - database and storage core) - Sections 1-2, Indexes and B+Tree, pp. 1-3; section 3.1, Node Size, p. 4; section 4.5, Bulk Insert, pp. 6-7. Depth: Use the B+tree structure and split rules, not the notes' broad claims about specific engines. Composite-index access is engine-dependent; do not infer a selective probe from an arbitrary non-leading predicate.
3. [DDIA, second edition: index trade-offs](https://dataintensive.net/) (Designing Data-Intensive Applications, 2nd edition - storage and transactions) - Chapter 4, B-Trees, printed pp. 125-128, then Multicolumn and Secondary Indexes and Storing Values Within the Index, pp. 132-133.

**Focus**

- An internal node with f children needs f pointers but only f-1 separator keys. Leaves store entries and links for ordered traversal.
- A range scan descends once to its first leaf, then follows leaf links. Fetching table tuples is additional work unless the index contains the required data and visibility can be established.
- Hashing supports exact-key lookup but gives no key order. Collisions need key comparison; resizing and overflow are part of the storage cost.
- Selectivity is the fraction of rows matching a predicate, not a promise that an index wins. Page occupancy, heap fetches, ordering and cache state also matter.

**Reproduce:** Derive a deliberately simplified, fully packed B+tree with 4096-byte pages, a 64-byte header including sibling-link space, 16-byte keys and 8-byte pointers or record IDs. Internal capacity obeys 64+8f+16(f-1)<=4096, so f=168. Leaf capacity is floor((4096-64)/24)=168. For 1,000,000 unique entries, ceil(1000000/168)=5953 leaves, ceil(5953/168)=36 parents and one root: three index-page visits per uncached point lookup, excluding heap access. This is a model, not PostgreSQL's format or a measured I/O count. Then draw a separate tiny tree with at most three keys per leaf: insert 1,2,3,4, split it into [1,2] and [3,4], and copy separator 3 into the root while retaining 3 in the leaf.

**Traps**

- Using f separator keys for f children, or applying full-occupancy height as a worst-case bound.
- Counting an index lookup as the complete query cost when result tuples require heap fetches.
- Deleting the promoted separator from a leaf split. B+tree data entries remain in leaves.

**Practice**

- The section mini-project covers this: rebuildable key-to-offset indexing, point and range fixtures, and a page-capacity derivation contrasting an ordered index with the in-memory hash index.

**Stop when:** You derive all three tree levels, draw the split without losing an entry, and account separately for index pages, leaf scanning and heap fetches.

<details>
<summary>Self-test</summary>

1. Why is fan-out 168 rather than 169 in the model?
   - 169 children need 64+169*8+168*16=4104 bytes. 168 children need 4080 bytes and fit.
2. Does halving occupancy necessarily add a level?
   - No. Recompute leaf and parent counts with the new capacities; height changes only when the next level can no longer cover them.
3. Why cannot a hash index answer a key interval by walking adjacent buckets?
   - Bucket placement follows a hash, not key order. Adjacent keys need not occupy adjacent buckets.

</details>

#### U5. Sorting, join algorithms and query plans

**About 6 h** · **Target:** Derive + Measure

Topics: Sorting, join algorithms and aggregation execution; Query plans, logical work, physical work and cost drivers

Assume Programming's indexes-query-plans unit. The next step is explaining join algorithms, blocking operators and repeated work inside the engine, not deriving another sequential scan or repeating its index-locality lab.

**You can now**

- Derive nested-loop, external-sort and partitioned-hash work with explicit buffer and spill assumptions.
- Read join, sort and aggregation nodes as a physical execution tree.
- Compare equivalent plans using actual rows, loops and buffer accesses without confusing cache reads with device I/O.

**Study**

1. [Lecture 11: Sorting & Aggregation Algorithms](https://15445.courses.cs.cmu.edu/fall2025/notes/11-sorting.pdf) (CMU 15-445/645 - database and storage core) - Sections 1-3, pp. 1-3: plans, external merge sort and sorted versus hashed aggregation.
2. [Lecture 12: Joins Algorithms](https://15445.courses.cs.cmu.edu/fall2025/notes/12-joins.pdf) (CMU 15-445/645 - database and storage core) - Sections 2-5, pp. 1-4: join output, nested loops, sort-merge and hash joins. Depth: Stop before section 6's hypothetical timing comparison. Use page-transfer models with their assumptions; those examples are not measurements on your machine.
3. [Planning: equivalence and statistics](https://15445.courses.cs.cmu.edu/fall2025/schedule.html) (CMU 15-445/645 - database and storage core) - Lecture 15 notes, sections 2 and 4-6, pp. 1-4; Lecture 16 notes, sections 2-3, pp. 1-5. Depth: Skip the enumeration algorithms. Focus on logical rewrites, cardinality estimates and cost assumptions.
4. [PostgreSQL 18: Using EXPLAIN](https://www.postgresql.org/docs/18/using-explain.html) (PostgreSQL - EXPLAIN and transaction isolation lab) - 14.1.1 join examples; 14.1.2 actual rows, loops, sort/hash statistics and BUFFERS; 14.1.3 Caveats.

**Focus**

- Block nested loops rescan the inner input per outer chunk; an indexed nested loop probes per outer tuple. A hash join builds a table and checks collisions; skew can force extra spill passes.
- External sorting forms runs then merges them. Sorting and hashing can both implement GROUP BY; hashing need not produce key order.
- Estimated cost is not milliseconds. Actual rows are per-loop averages; parent costs and buffer totals include children, so summing the whole tree double-counts work.
- A shared-buffer read can be served by the OS cache. Report logical accesses and observed buffer misses separately from physical device work; stock EXPLAIN does not prove cold NVMe reads.

**Reproduce:** First derive block nested-loop cost M+ceil(M/(B-2))*N for M=1000 outer pages, N=500 inner pages and B=102 frames: 6000 input-page transfers. One-level Grace hash join costs 3*(M+N)=4500 if partitions fit, with uniform partitioning, no extra pass and output writes excluded. Then use the section PostgreSQL setup: CREATE TABLE r AS SELECT i AS k FROM generate_series(1,1000) i; CREATE TABLE s AS SELECT i%1000+1 AS k FROM generate_series(1,10000) i; CREATE INDEX ON s(k); ANALYZE r; ANALYZE s. Set jit=off, max_parallel_workers_per_gather=0 and work_mem='4MB'. For SELECT count(*) FROM r JOIN s USING(k), save EXPLAIN (ANALYZE,BUFFERS,TIMING OFF,SUMMARY OFF) with exactly one of enable_hashjoin, enable_mergejoin, enable_nestloop on and the other two off. Each query counts 10000 joined pairs. Record the chosen operators, per-loop rows, loops, shared hits/reads and any spills; flags discourage alternatives, so inspect rather than assume. Run each plan once to warm it, then save three repetitions. Record lscpu, uname -r, SELECT version(), psql --version and all settings; report cache state as warmed, not guaranteed cold. No timing or memory value is a target.

**Traps**

- Calling the hash formula universal. Recursive partitioning, skew, cached input and output materialization change the cost.
- Calling an Index Only Scan heap-free without checking Heap Fetches and visibility state.
- Reading a merge input's emitted row count as distinct base rows. Duplicate-key rescans can emit the same row repeatedly.

**Practice**

- The section mini-project covers this: a join/filter/aggregation evidence table, one justified index change, boundary-result tests, and warm-cache plan comparisons with recorded data sizes, statistics, settings and versions.

**Stop when:** All three executions return the same count, your evidence reconciles rows with loops, and you explain a plan difference without asserting an unmeasured speedup or device-read count.

<details>
<summary>Self-test</summary>

1. Where do the three reads/writes in 3*(M+N) come from?
   - Read both inputs and write their partitions, then read those partitions for build/probe. This excludes result writes and assumes no repartitioning.
2. An inner node reports actual rows=10, loops=1000. How many rows did it emit in total?
   - 10000, subject to display rounding. The row count is an average per loop.
3. Why can smaller work_mem increase physical work without changing the result?
   - A sort or hash operation may spill and perform extra transfers. Its logical semantics remain the same.
4. For 1000 pages and 102 sort buffers, how many passes does materialized external merge sort need?
   - Two: form ceil(1000/102)=10 runs, then merge them using at most 101 inputs. Reading and writing every page each pass costs 4000 transfers; a pipelined final output can change that accounting.

</details>

#### U6. Transactions and isolation anomalies

**About 4 h** · **Target:** Explain

Topics: Transactions, atomicity, consistency, isolation and durability; Dirty reads, nonrepeatable reads, phantoms and write skew

Assume Programming's transactions-isolation unit and its REPEATABLE READ update-conflict retry. Here disjoint writes violate a shared invariant, and the engine must track read/write dependencies rather than merely conflicting row updates.

**You can now**

- Separate atomicity, application invariants, isolation and stable-storage durability.
- Classify dirty reads, nonrepeatable reads, phantoms and write skew by transaction histories.
- Explain why PostgreSQL SERIALIZABLE prevents a write-skew commit history and why aborted work must not escape.

**Study**

1. [DDIA, second edition: ACID and write skew](https://dataintensive.net/) (Designing Data-Intensive Applications, 2nd edition - storage and transactions) - Chapter 8, The Meaning of ACID, printed pp. 279-283; Write Skew and Phantoms, pp. 303-308.
2. [PostgreSQL 18: Transaction Isolation](https://www.postgresql.org/docs/18/transaction-iso.html) (PostgreSQL - EXPLAIN and transaction isolation lab) - Table 13.1 and sections 13.2.1-13.2.3, particularly the Serializable example, read/write dependencies and SQLSTATE 40001. Depth: Use the level definitions and SSI mechanism. Do not repeat Programming's concurrent-update REPEATABLE READ lab.

**Focus**

- Consistency in ACID means preserving specified invariants. It is not the same term as replica consistency, and the engine cannot invent the application's business rule.
- Write skew needs no common written row: decisions can depend on rows another transaction changes. A stable snapshot alone does not rule it out.
- PostgreSQL maps READ UNCOMMITTED to READ COMMITTED and prevents phantoms at REPEATABLE READ, but only SERIALIZABLE rules out serialization anomalies.
- SSI tracks read/write dependencies using nonblocking predicate locks. It may abort at a statement or commit; do not publish effects before a successful commit.

**Reproduce:** Use two interactive psql sessions in the section PostgreSQL container, adding -v VERBOSITY=verbose to the psql command. Create duty(id int PRIMARY KEY,on_call boolean NOT NULL); insert (1,true),(2,true). The rule is at least one doctor remains on call; an application may leave only after reading a count greater than 1. In A and B: BEGIN ISOLATION LEVEL SERIALIZABLE; SELECT count(*) FROM duty WHERE on_call; both must read 2 before either writes. A executes UPDATE duty SET on_call=false WHERE id=1; B executes the same for id=2. Commit A, then B. In the tested PostgreSQL 18.6 schedule, A committed and B's COMMIT reported 40001, leaving count 1. Record the actual failing operation; do not assume the same victim for a different schedule. Restart the failed transaction from BEGIN, re-read the count and decline the leave request at 1. On paper, allowing both original writes to commit gives count 0; neither serial order could permit both requests.

**Traps**

- Protecting each doctor row separately and assuming the cross-row invariant is protected.
- Calling a 40001 an engine failure. Aborting an unsafe history is the promised isolation behavior.
- Retrying only COMMIT or sending an external success message before commit. Neither preserves the transaction's decision boundary.

**Practice**

- The section mini-project covers this: a barrier-driven SERIALIZABLE write-skew test, full-transaction restart with invariant recheck, and evidence that aborted effects do not escape.

**Stop when:** Your recorded schedule has only one successful leave, includes the 40001 and failing operation, and explains why a fresh recheck rejects the other request.

<details>
<summary>Self-test</summary>

1. Why is this not a lost update?
   - The transactions update different rows. Neither overwrites the other's update; their decisions conflict through the shared count.
2. What would the second request see in either serial order?
   - One doctor remains, so it must refuse to leave. This is why two successful leave requests cannot be serialized.
3. Would a row CHECK constraint enforce at least one doctor on call?
   - No. That rule spans rows; ordinary PostgreSQL CHECK constraints are not a cross-row concurrency protocol.
4. Does SSI predicate locking block the other reader or writer?
   - Its SIRead locks track dependencies rather than blocking. Ordinary write locks can still block independently.

</details>

#### U7. Two-phase locking, timestamp ordering and MVCC

**About 5 h** · **Target:** Explain + Derive

Topics: Locking, two-phase locking and deadlock behavior; Timestamp ordering and MVCC vocabulary; Serializable isolation proofs

Assume Programming's transactions-isolation and synchronization-hazards units. The new job is proving histories and tracing tuple visibility, not another barrier lost update or application lock-order deadlock.

**You can now**

- Derive a conflict graph and distinguish it from a waits-for graph.
- Explain growing/shrinking lock phases, strict locking, predicate protection and deadlock handling.
- Trace PostgreSQL tuple versions using xmin, xmax, transaction status and snapshots without treating XIDs as timestamps.
- Explain timestamp ordering as an enforced serialization order, separate from MVCC storage.

**Study**

1. [Lectures 17, 18 and 20: histories, locks and versions](https://15445.courses.cs.cmu.edu/fall2025/schedule.html) (CMU 15-445/645 - database and storage core) - Lecture 17 notes, section 6, Conflict Serializability, p. 4; Lecture 18 notes, sections 1-4, pp. 1-4; Lecture 20 notes, sections 1-3, pp. 1-3. Depth: In Lecture 18 section 2, skip the sentence claiming strict 2PL reintroduces dirty reads and cascading aborts. Holding exclusive locks to commit prevents both; rigorous 2PL also holds shared locks. The fixed-object conflict-graph theorem needs predicate protection when rows can be inserted.
2. [Lecture 19: Timestamp Ordering Concurrency Control](https://15445.courses.cs.cmu.edu/fall2025/notes/19-timestampordering.pdf) (CMU Lecture 19: Timestamp Ordering Concurrency Control) - Section 1, Timestamp Ordering Concurrency Control, p. 1. Depth: Stop before the OCC validation algorithm; only timestamp-ordering vocabulary is required here.
3. [DDIA, second edition: predicate protection and SSI](https://dataintensive.net/) (Designing Data-Intensive Applications, 2nd edition - storage and transactions) - Chapter 8, Two-Phase Locking through Serializable Snapshot Isolation, printed pp. 313-322. Depth: Use the mechanism comparison. SSI does not abort on every stale read; it detects dangerous dependency combinations, and ordinary write locks remain.
4. [PostgreSQL 18: System Columns](https://www.postgresql.org/docs/18/ddl-system-columns.html) (PostgreSQL - EXPLAIN and transaction isolation lab) - Section 5.6: xmin, xmax and ctid.
5. [PostgreSQL 18: Snapshot functions](https://www.postgresql.org/docs/18/functions-info.html) (PostgreSQL - EXPLAIN and transaction isolation lab) - Section 9.27.8, Transaction ID and Snapshot Information Functions: pg_current_snapshot and the xmin:xmax:xip_list snapshot representation.

**Focus**

- Basic 2PL acquires no new locks after its first release. Strict 2PL retains exclusive locks until commit/abort; rigorous 2PL retains shared locks too. Locking existing rows alone does not protect absent matches.
- A precedence graph orders conflicting operations on fixed objects; a waits-for graph records blocked lock requests. A serializable history can still encounter a lock deadlock.
- MVCC is version storage plus visibility rules, not an isolation level. Tuple xmin/xmax need transaction status, snapshot membership and special-case handling; a nonzero xmax does not prove a row is invisible.
- Timestamp ordering enforces a chosen serial order, often using a logical counter. PostgreSQL XIDs are neither wall-clock times nor commit-order counters; long-lived snapshots can prevent reclamation.

**Reproduce:** Derive the fixed-object schedule R1(A),R2(B),W1(B),W2(A): R2(B) precedes W1(B), giving T2->T1; R1(A) precedes W2(A), giving T1->T2. The cycle rules out conflict serializability. If a timestamp protocol chose TS(T1)<TS(T2), it could not accept the T2->T1 dependency. Then use the section PostgreSQL setup: create visibility(id int PRIMARY KEY,v int), insert (1,10). Session A: BEGIN; UPDATE visibility SET v=20 WHERE id=1; leave it uncommitted. Session B, in default READ COMMITTED: SELECT v,xmin,xmax,ctid FROM visibility; SELECT pg_current_snapshot(); it sees the old value 10 although its xmax is nonzero in this simple update. Record A's in-progress XID and explain the snapshot bounds; equality of the snapshot's xmin and xmax bounds is possible. Commit A, then rerun B's SELECT: value 20 comes from a new tuple version with a different xmin and ctid. Exact XIDs and offsets are not targets. Draw visibility before and after commit without relying on numeric XID comparison alone.

**Traps**

- Calling two-phase locking two-phase commit. One is a concurrency protocol; the other coordinates atomic commit across participants.
- Assuming strict 2PL is deadlock-free, or applying a fixed-item graph proof to a predicate without accounting for inserts.
- Using xmin or ctid as a durable application identity. XIDs wrap and physical row locations can change.

**Practice**

- The section mini-project covers this: annotate the anomaly's dependency graph, trace committed and uncommitted tuple visibility, and distinguish transaction waits from buffer latches in the evidence dossier.

**Stop when:** You derive both graph edges and explain the two observed tuple versions, including why a nonzero xmax did not hide the old row.

<details>
<summary>Self-test</summary>

1. Why is the old value visible in B while A updates it?
   - A's replacement version is uncommitted. B's statement snapshot still sees the committed old version; the old version's deletion by A is not yet effective for B.
2. Can basic 2PL permit dirty reads?
   - Yes. Releasing an exclusive lock before commit can expose an uncommitted write. Strict 2PL holds that lock until commit or abort.
3. Why must a serializable lock protocol protect gaps or predicates?
   - New matching rows can change a read's result even though none of its existing rows was overwritten.
4. Does the graph cycle prove every MVCC history is invalid?
   - No. The fixed-object single-version conflict graph theorem has stated assumptions. MVCC serialization analysis must account for which versions were read and their dependencies.

</details>

#### U8. Write-ahead logging, recovery, checksums and durability

**About 6 h** · **Target:** Explain + Implement

Topics: Write-ahead logging, log sequence and recovery order; Checksums, torn tails, snapshots and atomic metadata replacement; Acknowledgement, page-cache flush and stable durability boundaries

Build on Systems' files-fsync-durability unit rather than repeat its rename experiment. The new mechanism is recovery of logical state and its index after interruption, with a precise acknowledgment and corruption contract.

**You can now**

- Trace WAL-before-page and commit-before-ack ordering using log sequence numbers.
- Implement bounded, checksummed append records and deterministic recovery of complete prefixes.
- Specify snapshot publication, directory durability and a safe log-retention boundary.
- Diagnose torn tails, corruption and lost acknowledged writes without treating process death as a power-loss test.

**Study**

1. [Lecture 21: Database Logging](https://15445.courses.cs.cmu.edu/fall2025/notes/21-logging.pdf) (CMU 15-445/645 - database and storage core) - Sections 1-2, pp. 1-2, and sections 6-7, pp. 4-6: buffer policies, WAL and logging schemes. Depth: Skip section 5: SQLite did not replace rollback journals after 2010; WAL is optional. Skip section 8's blanket checkpoint-pruning claim; use the recovery metadata in Lecture 22 to determine needed log history.
2. [Lecture 22: Database Crash Recovery](https://15445.courses.cs.cmu.edu/fall2025/notes/22-recovery.pdf) (CMU 15-445/645 - database and storage core) - Sections 1-5, pp. 1-6: LSNs, execution, checkpoints and ARIES recovery. Depth: Trace analysis, redo and undo; do not implement ARIES. Redo can start before the checkpoint at the minimum recLSN. In Figure 4, follow the text's largest-lastLSN reverse undo rule, not the caption's 'oldest' starting point. PostgreSQL's MVCC/WAL recovery is not a literal implementation of this generic undo protocol.
3. [OSTEP: crash consistency](https://pages.cs.wisc.edu/~remzi/OSTEP/file-journaling.pdf) (Operating Systems: Three Easy Pieces - persistence and integrity) - Chapter 42, section 42.3, Journaling (or Write-Ahead Logging). Depth: Use write ordering and corruption detection for your own append-only store. Skip filesystem simulation and performance exercises.
4. [OSTEP: data integrity](https://pages.cs.wisc.edu/~remzi/OSTEP/file-integrity.pdf) (Operating Systems: Three Easy Pieces - persistence and integrity) - Chapter 45, sections 45.3-45.6, Detecting Corruption, Using Checksums, Misdirected Writes and Lost Writes.
5. [PostgreSQL 18: Write-Ahead Logging](https://www.postgresql.org/docs/18/wal-intro.html) (PostgreSQL - EXPLAIN and transaction isolation lab) - Section 28.3, WAL-before-data, REDO and group commit.
6. [SQLite: rollback journal versus WAL mode](https://sqlite.org/wal.html) (SQLite Write-Ahead Logging) - Sections 1, Overview, and 3, Activating And Configuring WAL Mode. Depth: Inspect the default using one connection. Do not run a multi-connection WAL exercise on an old bundled SQLite build.

**Focus**

- Before flushing a dirty page, durable WAL must cover its pageLSN. Before acknowledging a durable commit, durable WAL must cover its commit record; data pages can follow later.
- ARIES repeats history, including loser updates, then undoes losers. A single-writer append-only store can instead replay complete committed records into a rebuildable index; its recovery protocol is smaller.
- A checksum detects many corruptions, not intent, lost whole records or adversarial changes. Bound lengths before allocating; distinguish incomplete EOF from a complete frame with a bad checksum.
- For a snapshot at log offset K, flush the new snapshot, durably publish its name, flush a new manifest, atomically replace the old manifest and fsync its directory. Retain the old generation and required log until publication is durable.

**Reproduce:** With CPython 3.14.4 (python3 -I), print sqlite3.sqlite_version and inspect PRAGMA journal_mode on a fresh on-disk database with one connection: the tested SQLite 3.46.1 returned delete, not wal. Then implement a single-writer log with struct.pack('>II',length,crc) followed by payload; length is the payload byte count, capped at 1024, and crc is zlib.crc32(struct.pack('>I',length)+payload). Use payloads b'a=1', b'b=2', b'a=3'. Each frame is 11 bytes. Append all bytes with short-write handling and fsync before acknowledging; for a newly created log, fsync its parent directory too. Rebuild the latest-key index by scanning validated frames. Test every byte-prefix truncation from 0 through 33: recover exactly the complete prefix and return its ending offset, giving 34 cases. Incomplete EOF is an uncommitted tail under this model; a complete frame with a bad CRC or an excessive length is an error, not silently discarded. Flip byte 9 in the complete log and require a corruption error. The full log gives a=3,b=2, and rebuilding twice gives the same state. Finally draw crashes before and after durable manifest publication: recovery must select a complete old or new generation and retain the log needed by that generation. These are deterministic fault-model tests, not evidence of surviving a real power cut.

**Traps**

- Acknowledging after write returns, but before fsync succeeds. Kernel page-cache acceptance is not stable-storage durability.
- Deleting the old log as soon as a snapshot file exists. Its contents and the selecting manifest must both be durably published first.
- Silently truncating any bad checksum as a torn tail. That can hide corruption or destroy acknowledged state; fail closed unless the recovery contract independently proves the suffix was uncommitted.

**Practice**

- The section mini-project covers this: checksummed append-only state, a rebuildable offset index, every short-write and publication boundary, fsync-error handling, torn-tail versus corruption policy, snapshot/manifest recovery and an acknowledged-prefix oracle.

**Stop when:** All 34 prefix cases match the independent prefix oracle, the corruption case fails closed, replay is idempotent, and the publication trace never selects an incomplete generation or drops its required log.

<details>
<summary>Self-test</summary>

1. What is illegal about flushing a page at pageLSN=80 when durable WAL ends at 70?
   - A crash could leave the changed page without the recovery record needed to explain it. Flush WAL through 80 first.
2. Can a committed transaction survive while its data pages are still dirty in memory?
   - Yes, if durable log records are sufficient to redo its committed effects and the engine's durability settings guarantee that log boundary.
3. Can a record checksum detect deletion of the entire final valid frame?
   - No. The remaining frames still validate. An independent expected boundary or acknowledgment record is needed to detect that loss.
4. Why does SIGKILL not establish power-loss durability?
   - It kills a process but leaves the kernel and its dirty page cache alive. The data can persist after process death without having been durable before it.

</details>

#### U9. Record evolution, amplification and LSM trees

**About 4 h** · **Target:** Explain

Topics: Schema and encoding evolution for stored records; Read, write, space and compaction amplification vocabulary; LSM compaction mechanics and bloom filters

Assume Programming's schema-evolution-migrations unit. Stored encodings outlive deployed code, and compaction rewrites persistent history; this unit goes below Alembic into record compatibility and storage-engine amplification.

**You can now**

- Specify old/new reader and writer compatibility for stored records, including defaults and unknown fields.
- Explain memtable flush, sorted-run compaction, tombstones and Bloom-filter lookup decisions.
- Account for read, write and temporary-space amplification at a named storage layer.

**Study**

1. [DDIA, second edition: log-structured storage](https://dataintensive.net/) (Designing Data-Intensive Applications, 2nd edition - storage and transactions) - Chapter 4, Log-Structured Storage, printed pp. 118-124, including SSTables, Bloom filters and compaction strategies; Comparing B-Trees and LSM-Trees, pp. 129-132.
2. [DDIA, second edition: encoding and evolution](https://dataintensive.net/) (Designing Data-Intensive Applications, 2nd edition - storage and transactions) - Chapter 5, Formats for Encoding Data and JSON, XML, and Binary Variants, printed pp. 163-168; Field tags and schema evolution, p. 171; Dataflow Through Databases, pp. 178-179. Depth: Use compatibility and field-identity rules. Skip byte-by-byte format comparisons and RPC; no protobuf or Avro installation is required.
3. [Lecture 9: Bloom filters](https://15445.courses.cs.cmu.edu/fall2025/notes/09-indexes2.pdf) (CMU 15-445/645 - database and storage core) - Sections 1-2, Index vs. Filters and Bloom filter, pp. 1-2. Depth: Stop before Skip List. LSM mechanics and Bloom filters are the optional topic's bounded extension, not a full storage engine.

**Focus**

- Backward compatibility is new readers accepting old records; forward compatibility is old readers accepting new records. Unknown-field preservation matters when old code reads, modifies and writes a new record.
- An LSM writes to a memtable and durability log, flushes sorted immutable runs, then merges runs by key and recency. A tombstone cannot be dropped while an older value can still be reached or a supported snapshot needs it.
- Write amplification needs a byte or operation denominator and a layer boundary. Count log writes, flushes and compaction separately; engine bytes are not flash-controller bytes.
- Bloom filters can rule out a missing key, but a positive answer still needs lookup. The no-false-negative property assumes correct construction and publication with the matching run; ordinary membership filters do not answer arbitrary intervals.

**Reproduce:** Closed-book, merge old sorted run [(1,1),(2,1),(3,1)] and newer run [(1,2),(2,2),(4,1)], where each pair is (key,value), and keep the newer duplicate: [(1,2),(2,2),(3,1),(4,1)]. Encode each pair using struct.pack('>QQ',key,value), exactly 16 bytes. Count only run-file writes: the two initial runs total 96 bytes and compaction writes 64, so total writes/input update bytes is 160/96=5/3. Keeping both inputs until output publication uses 160/64=2.5 times the compacted live-record bytes. These are exact model byte counts, excluding WAL, manifests, filters, filesystem blocks and device GC, not measured device amplification. Then specify a JSON record v1 with key and value, and a compatible v2 that adds optional expires_at defaulting to null. Test all four old/new writer-reader combinations in Python; the old reader must preserve unknown fields if it rewrites records, and the new reader must fill the absent default. Changing value from an integer to an object is a separate breaking change, not the optional-field case.

**Traps**

- Reporting only memtable ingestion bytes as LSM write amplification. Deferred flush and compaction still consume writes.
- Deleting tombstones before considering older runs and active snapshots, allowing old values to reappear.
- Dropping unknown fields on an old reader's rewrite, or reusing a retired binary field tag for a different meaning.

**Practice**

- The section mini-project covers this: versioned record decoding, a four-way compatibility matrix, crash-safe compaction publication, tombstone-retention tests, and separate logical byte counters for append, flush and rewrite work.

**Stop when:** Your merged state and byte accounting match the model, all compatibility cases include rewrite checks, and you can explain when tombstones and input runs remain necessary.

<details>
<summary>Self-test</summary>

1. Why is the compaction model's write amplification 5/3 rather than 64/96?
   - The numerator includes both initial run writes and the compaction output: 96+64. Counting only the output omits the initial writes.
2. Why can temporary space exceed final live data even though compaction removes duplicates?
   - Old input runs must coexist with the new output until safe publication and reader release. The final output is smaller, but the peak includes both.
3. Can a correct Bloom filter's positive answer establish that a value exists?
   - No. Other keys may have set all queried bits. Lookup must verify the key and handle versions or tombstones.
4. Does successfully reading a v2 record with old code prove a safe rolling upgrade?
   - No. Check new readers on old records, old readers on new records, defaults, and rewrites that preserve unknown fields; rollback may encounter data written by the new version.

</details>

### Mini-project: Durable state for the service slice and a PostgreSQL catalog with transaction evidence

**About 14 to 20 hours.** Make the service slice durable: a checksummed append-only log with a rebuildable index, crash recovery at every publication boundary, compaction with versioned records and an acknowledged-prefix oracle. Beside it, keep the service's tenant and credential metadata in PostgreSQL 18 and produce the dossier's SQL evidence: constraints, a join rewrite, a point-in-time export, a query-plan change, a write-skew test and an MVCC visibility trace.

1. Store every write in kv/store.py as a frame: struct.pack(">II", length, crc) plus the payload, with crc = zlib.crc32 of the packed length and the payload, as in the WAL unit; the payload is a versioned record (v, tenant, key, value or tombstone, idem). Append with a short-write loop and fsync before the server acknowledges, and fsync the directory when a log file is created. If fsync fails, stop accepting writes and acknowledge nothing more: a later fsync can succeed without the lost pages having reached the disk. Recovery scans validated frames; an incomplete tail is truncated as never acknowledged, and a complete frame with a bad CRC or an oversized length is corruption that stops recovery with an error.
2. Rebuild the index from the log at start: a dict from key to the offset of its newest record for point reads and a sorted key list (bisect) for range reads. Test point, missing-key, range-boundary and tombstone fixtures against a dict oracle replayed from the same records. In the README, derive with the unit's model what an ordered on-disk index over 1,000,000 keys would need (fanout 168: 5953 leaves, 36 parents and a root, three page visits per uncached lookup) and why the in-memory hash index needs no pages but must be rebuilt on every start.
3. Test every boundary against an acknowledged-prefix oracle. Run numbered writes in a child process and crash it with os._exit at each injected point (mid-payload, after write before fsync, after fsync before the acknowledgement, after the acknowledgement), and truncate a log at every byte offset (for the unit's three 11-byte frames, offsets 0 to 33: 34 cases). After each recovery, the state must equal the oracle replay of a prefix of the attempted writes that contains every acknowledged one, and a flipped payload byte must raise a corruption error. Call these process-exit and truncation tests, not power-loss tests. Rerun the fault matrix's restart row: it now passes.
4. Compact by writing a new generation that keeps the newest record per key, tombstones included, publish a manifest naming the live generation with lab/publish.py, and delete the old generation only after the manifest is durable. Crash before, during and after publication and show recovery always opens a complete old or new generation. Drop a tombstone only when no older generation or retained snapshot could still hold the key, and keep a test showing the deleted key coming back when it is dropped early. Count logical bytes separately for appends, flushes and compaction rewrites; the unit's toy runs give 160/96 = 5/3.
5. Version the record: v1 holds key and value, v2 adds an optional expires_at that defaults to null. Test all four writer and reader combinations; an old reader that rewrites a v2 record during compaction must keep the field it does not know. Treat a change to the type of value as a new field, not as v2.
6. Model a buffer pool in front of the read path: four frames with pin counts, dirty bits and a clock or LRU victim choice. Test the two hard cases: with every frame pinned there is no victim and the request fails with a typed error, and a failed write-back of a dirty victim keeps its mapping and dirty bit and surfaces the error. Choose the layout for this store's reads (point gets by key, short range scans) and say why a row-oriented log fits and when a columnar copy would.
7. In postgres:18, create the catalog: tenant, credential (tenant, role, active, expires_at), segment (generation, path, sha256, published_at) and usage (tenant, event_at, available_at, puts), with keys, NOT NULL and CHECK constraints doing the validation, and test each rejection. Rewrite one join with its filter moved into a subquery and test bag equivalence (EXCEPT ALL both ways is empty), plus COUNT of a join against EXISTS. Export the as-served usage rows at a cutoff (event_at and available_at at or before it, ties broken by a unique key), with tests for NULL puts, tied event times and rows exactly at the cutoff, inside a read-only REPEATABLE READ transaction, store the SQL, cutoff and SHA-256, backfill a late row and show the saved export still verifies.
8. For one catalog query that joins, filters and aggregates, save EXPLAIN (ANALYZE, BUFFERS) before and after one index change, with data sizes, ANALYZE state, settings and versions, labeled as warm cache, and boundary tests (empty result, one row, ties) giving the same answers both ways. Reproduce write skew on the rule that every tenant keeps an active admin credential: two SERIALIZABLE transactions, held at a barrier until both have counted 2, each deactivate a different admin, and one fails with 40001 (on PostgreSQL 18.6 the second COMMIT failed). Show its update never became visible, restart it from BEGIN, recheck the rule and refuse. Show in pg_stat_activity that a blocked row update waits with wait_event_type Lock and wait_event transactionid, a transaction wait rather than a buffer latch (LWLock), and trace xmin, xmax and ctid of one row before and after an update commits.

**Deliverables**

- kv/store.py: checksummed log, index rebuild, compaction with manifest publication and versioned records, with the crash, truncation, corruption, tombstone and compatibility tests.
- The acknowledged-prefix report: every injected boundary, the recovered prefix and the acknowledged writes it contains.
- dossier/sql/: the catalog schema, constraint tests, join equivalence, the point-in-time export with its digest, the plan comparison and the write-skew and visibility transcripts.
- The buffer pool model with its tests and the layout note.

**Checks**

- rubric: Self-grade with the rubric below.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Durability contract | No write is acknowledged before fsync, a failed fsync stops writes, and the oracle passes at every injected boundary and truncation offset. | The README states what the tests cover (process exit, truncation, bit flips) and what they cannot (power loss, lying caches, lost or misdirected writes). |
| Recovery and compaction | Recovery opens a complete old or new generation after a crash at every publication step, and deleted keys stay deleted. | The early tombstone drop is kept as a regression test, and the byte counters separate append, flush and rewrite work. |
| Index and compatibility | The rebuilt index agrees with the oracle on point, range and tombstone fixtures, and all four version combinations pass. | The page-capacity derivation and buffer pool tests explain what an on-disk ordered index would add. |
| SQL evidence | Constraints reject bad rows, the join rewrite is bag-equivalent, the export verifies after a backfill, and the plan comparison records sizes, settings and versions. | The plan change is explained from actual rows, loops and buffers, not from timing alone. |
| Transactions | The write-skew test produces 40001, the retry refuses the second deactivation, and the visibility trace shows the old and new tuple versions. | The dossier draws the read-write dependency cycle and separates the lock wait from a latch with quoted pg_stat_activity output. |

Feeds into: Capstone service slice: checksummed append-only state, crash recovery and the transaction invariant. Dossier: the SQL, query-plan and transaction evidence.

### Resource route

- **Primary - Course:** [CMU 15-445/645 - database and storage core](https://15445.courses.cs.cmu.edu/fall2025/schedule.html) - Use Fall 2025 Lectures 1-9, 11-18 and 20-22 with their notes: relational model, SQL, storage, buffer pools, layouts, indexes, execution, planning, concurrency, MVCC, logging and recovery. Complete the matching SQL, Storage, Indexes and Filters, Transactions and Recovery homeworks before considering a BusTub project.
- **Required - Practice:** [PostgreSQL - EXPLAIN and transaction isolation lab](https://www.postgresql.org/docs/current/transaction-iso.html) - Create one normalized schema, joins, an aggregation and a window query. Compare EXPLAIN ANALYZE before and after one justified index. In two sessions, reproduce one documented isolation anomaly and prevent it with a stated database or application invariant.
- **Reference - Theory:** [Designing Data-Intensive Applications, 2nd edition - storage and transactions](https://dataintensive.net/) - Read only the sections on data models and query languages, storage and retrieval, encoding and evolution, and transactions that answer a live design question from the CMU route. Write one comparison table covering layout, index, isolation and recovery trade-offs.
- **Support - Theory:** [Operating Systems: Three Easy Pieces - persistence and integrity](https://pages.cs.wisc.edu/~remzi/OSTEP/) - Use Chapters 36, 39-45 to trace devices, filesystem structures, journaling, log-structured storage, flash and integrity. Apply the crash sequence to your own append-only store rather than repeating the SYS-1 file experiment.
- **Depth - Practice:** [CMU 15-445 - one reduced BusTub project slice](https://15445.courses.cs.cmu.edu/fall2025/assignments.html) - If a C++ database implementation is the chosen depth lane, complete Project 1 Buffer Pool Manager or Project 2 Database Index, not both during the first pass. Follow the course publication rules and keep code private. The blank-file append-only store remains the core checkpoint.
- **Reference - Documentation:** [Point-in-time joins](https://docs.feast.dev/getting-started/concepts/point-in-time-joins) - Read Point-in-time joins and Retrieving features as of the event time. Separate event-time eligibility from actual feature availability; implement the predicates in SQL, not a Feast installation.
- **Reference - Course:** [CMU Lecture 19: Timestamp Ordering Concurrency Control](https://15445.courses.cs.cmu.edu/fall2025/notes/19-timestampordering.pdf) - Section 1 only, p. 1: timestamp order as a chosen serialization order. The section pool omits Lecture 19; this fills the timestamp-ordering vocabulary gap without assigning all of OCC.
- **Reference - Documentation:** [SQLite Write-Ahead Logging](https://sqlite.org/wal.html) - Sections 1 and 3 only: rollback journaling remains the default and WAL is an opt-in mode. Correct the dated SQLite statement in CMU Lecture 21; inspect the bundled engine without running concurrent WAL writers.

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

### Study units

#### U1. Partial failure, clocks and event ordering

**About 5 h** · **Target:** Explain + Derive

Topics: Partial failure and unreliable timing assumptions; Physical clocks, logical clocks and event ordering

Assume Programming's cancellation-timeouts-retries unit. Here the question is what the caller can know after a timeout, and which event orders remain defensible when clocks disagree.

**You can now**

- Explain why a timeout cannot distinguish a lost request, a paused node and a lost reply.
- Assign physical and logical timestamps to a message history and identify causal and concurrent events.
- Choose a local clock for elapsed time without treating it as a cross-machine ordering oracle.

**Study**

1. [DDIA, 2nd edition: uncertain outcomes and physical clocks](https://dataintensive.net/) (Designing Data-Intensive Applications, 2nd edition - distributed data path) - Chapter 9, Faults and Partial Failures and Unreliable Networks through Timeouts and Unbounded Delays, pp. 346 to 354; Unreliable Clocks through Timestamps for ordering events, pp. 358 to 364.
2. [DDIA, 2nd edition: causal order and logical clocks](https://dataintensive.net/) (Designing Data-Intensive Applications, 2nd edition - distributed data path) - Chapter 6, The happens-before relation and concurrency, pp. 238 to 239, and Version vectors, p. 242; Chapter 10, Logical Clocks, pp. 420 to 422.

**Focus**

- A timeout is an observation of silence, not proof of non-execution. Preserve an unknown outcome in the history.
- Use monotonic time for local durations. Wall-clock readings can disagree across nodes; local monotonic readings have no shared epoch.
- Happens-before follows process order, send-to-receive edges and transitivity. A smaller Lamport timestamp does not prove a causal dependency.
- Distinguish scalar clocks that order events from vectors that can expose concurrency. Neither provides consensus or elapsed seconds.

**Reproduce:** Closed-book, trace five events in this order: A sends m to B; C performs an unrelated local event; B receives m; B sends a reply to A; A receives it. Start all counters at zero, increment on each local/send event, and set a receive counter to max(local, received)+1. Get counters 1, 1, 2, 3, 4. Label the A-to-B-to-A chain and C's concurrent event. Use (counter, node ID) to break ties, but do not infer causality from that tie-break. Then draw two executions with the same caller history: P invokes write(x,1) and times out; in one the request is dropped, in the other S applies it and the reply is dropped. Check the clocks and indistinguishability by hand; the numbers are logical counters, not measured time.

**Traps**

- Comparing monotonic clock values from two hosts as if they were UTC timestamps.
- Treating timestamp order as a proof of causality or as evidence that an acknowledged write is durable.
- Interpreting a timeout as permission to repeat an externally visible effect without checking its identity.

**Practice**

- [Gossip Glomers Challenge 1: Echo](https://fly.io/dist-sys/1/) - Specification; Installing Maelstrom; Running our node in Maelstrom with the one-node echo workload. First build the JSON-line node harness and correlate replies with in_reply_to; Unique ID Generation and Broadcast reuse it. It is protocol setup, not a new socket-framing exercise. Maelstrom needs OpenJDK, Graphviz and gnuplot, and the challenges were tested against Maelstrom 0.2.3; a JDK container such as eclipse-temurin:21 avoids a host Java install. Nodes can be written in Python; the tutorial's Go code needs a Go toolchain.
- [Gossip Glomers Challenge 2: Unique ID Generation](https://fly.io/dist-sys/2/) - Specification, RPC generate, and Evaluation with the unique-ids workload. After Echo, implement IDs without assuming synchronized clocks, with the same Maelstrom setup. Explain why (node ID, counter) needs persistent counters or fresh incarnation IDs if restarts are added; the challenge does not crash nodes. Its workload tests uniqueness and total availability under partitions, not monotonicity or fencing.

**Stop when:** You recover the five counters without the source, distinguish the two timeout executions, and defend your ID scheme's uniqueness and restart assumptions.

<details>
<summary>Self-test</summary>

1. Can the caller tell a dropped request from a dropped reply after a timeout?
   - Not from silence alone. The operation may have executed, so its outcome is unknown.
2. If L(a) < L(b), must a happen before b?
   - No. Causal order implies increasing Lamport counters, but unrelated events can also have different counters.
3. What do vectors (2,1) and (1,2) tell you?
   - Neither dominates the other componentwise. Under the vector algorithm's causal tracking assumptions, the represented events are concurrent.
4. Does a monotonic clock make an expired lease safe?
   - No. A process can pause or a request can be delayed after a lease check. The receiving resource must enforce ownership.

</details>

#### U2. Replication, quorums and consensus vocabulary

**About 4 h** · **Target:** Explain + Derive

Topics: Replication leaders, followers, lag and failover vocabulary; Quorums, intersection assumptions and stale membership counterexamples; Consensus and failure-detector vocabulary

Copies alone do not define which writes survive or which reads are fresh. Quorum arithmetic becomes useful only when membership, persisted acknowledgements and version comparison are explicit.

**You can now**

- Trace replication lag and acknowledged-write loss during asynchronous failover.
- Derive quorum intersection and construct a stale-membership counterexample.
- Separate consensus safety properties from termination assumptions and failure-detector suspicions.

**Study**

1. [DDIA, 2nd edition: leaders, lag and quorum limits](https://dataintensive.net/) (Designing Data-Intensive Applications, 2nd edition - distributed data path) - Chapter 6, Single-Leader Replication and Synchronous Versus Asynchronous Replication, pp. 198 to 201; Handling Node Outages, pp. 204 to 206; Problems with Replication Lag, p. 209; Leaderless Replication through Understanding the limitations of quorum consistency, pp. 229 to 234.
2. [DDIA, 2nd edition: failure detection and consensus contract](https://dataintensive.net/) (Designing Data-Intensive Applications, 2nd edition - distributed data path) - Chapter 9, Fault Detection and Timeouts and Unbounded Delays, pp. 351 to 354; Chapter 10, Consensus, pp. 425 to 429, through the single-value consensus properties. Depth: Stop before Compare-and-set as consensus. Learn agreement, integrity, validity and conditional termination, not a Raft implementation. Timeouts alone do not guarantee termination in a fully asynchronous execution; practical progress needs additional assumptions such as eventual synchrony.

**Focus**

- State whether an acknowledgement means receipt, persistence or application at each replica. Asynchronous failover can discard acknowledged writes that never reached the promoted follower.
- For a fixed replica universe of size n, |W intersect R| is at least w+r-n. This proves overlap, not a complete linearizability protocol.
- Membership changes, forgotten acknowledged data, concurrent writes and faulty timestamp resolution can break the freshness argument.
- Consensus agreement, integrity and validity are safety properties. Progress requires the protocol's fault and timing assumptions; a timeout supplies suspicion, not knowledge.

**Reproduce:** By hand derive |W intersect R| >= w+r-n from |W union R| <= n. In Python 3.14, enumerate all size-three subsets of ABCDE and all 100 write/read pairs; the minimum intersection is one. Now construct this explicit history with initial x=0 everywhere: event 1, P invokes write(x,1) using old membership ABC; event 2, A and B persist 1 and P receives OK; event 3, Q invokes read(x) using new membership CDE, before state transfer; event 4, D and E reply 0 and Q returns 0. Both configurations have n=3,w=2,r=2, but W={A,B} and R={D,E} do not intersect. Check by hand that this violates linearizability: the completed write precedes the stale read. State why a coordinated membership transition is missing.

**Traps**

- Adding quorum sizes across different membership views as though they were subsets of one universe.
- Calling a majority vote consensus without a protocol that preserves earlier decisions across leaders and restarts.
- Calling leader receipt durable on a follower, or assuming replication replaces a backup.

**Practice**

- The section mini-project covers this: replica lag, persisted acknowledgements, node loss and a stale-membership history, with configuration IDs recorded in every operation.

**Stop when:** You derive the intersection bound and explain exactly why the two-majority history violates linearizability without contradicting the bound.

<details>
<summary>Self-test</summary>

1. For n=5,w=3,r=3, what overlap is guaranteed?
   - At least one replica, provided both sets belong to the same five-member configuration.
2. Does w+r>n alone prove linearizability?
   - No. It proves set intersection. Version ordering, concurrent operations, read behavior, persistence and membership transitions still need a correct protocol.
3. What happens if an asynchronous leader acknowledges a write, dies, and a follower without it is promoted?
   - The acknowledged write can be lost from the surviving history. Local persistence on the old leader does not guarantee survival of that failover.
4. Must a consensus group keep deciding during a permanent partition?
   - Not unconditionally. Safety must be preserved, while termination depends on reachable participants and the protocol's timing assumptions.

</details>

#### U3. Consistency models and conflict resolution

**About 4 h** · **Target:** Explain

Topics: Strong, eventual, causal and session consistency vocabulary; Linearizability versus serializability vocabulary; Conflicts, last-write-wins limits and application resolution

Assume Programming's transactions-isolation unit. This unit moves from database transaction interleavings to client-visible replica histories, where convergence and freshness are different contracts.

**You can now**

- Classify explicit histories under linearizable, causal, eventual and session contracts.
- Distinguish serializable transactions from real-time ordered single-object operations.
- Explain what last-write-wins discards and choose an application merge that preserves the required intent.

**Study**

1. [DDIA, 2nd edition: consistency definitions and conflict intent](https://dataintensive.net/) (Designing Data-Intensive Applications, 2nd edition - distributed data path) - Chapter 6, Problems with Replication Lag, pp. 209 to 214; Dealing with Conflicting Writes, pp. 222 to 228; Chapter 10, Linearizability and What Makes a System Linearizable?, pp. 402 to 408, including Linearizability Versus Serializability.
2. [Consistency Models: bounded definition review](https://algomaster.io/learn/system-design/consistency-models) (AlgoMaster System Design - distributed fundamentals slice) - Sections 3.1 Linearizability, 3.3 Serializability and Strict Serializability, 4.1 Eventual Consistency, 4.2 Causal Consistency, and 5 Client-Centric Consistency Models. Depth: Use after DDIA to label your histories. Skip the product-choice tables and quiz; do not treat the consistency spectrum as a total ordering of all guarantees.

**Focus**

- A linearization is a legal sequential object history that respects response-before-invocation order. Overlapping operations need not follow invocation order.
- Serializability orders whole transactions but does not by itself require real-time order. Strict serializability adds it; per-object linearizability alone does not make a multi-object transaction atomic.
- Eventual convergence needs propagation and a resolution policy. Read-your-writes and monotonic reads are session guarantees; causal consistency also preserves dependencies across clients.
- LWW converges with a deterministic total timestamp order, but discards acknowledged updates. Sibling merge must preserve application meaning, especially deletion.

**Reproduce:** Closed-book, check these register histories by hand, initially x=0 with no other writes. H1: P1 invokes write(x,1) at event 1 and receives OK at 2; P2 invokes read(x) at 3 and receives 0 at 4. It is not linearizable; if each operation is its own transaction, serializability alone permits the order read, write. H2: P1 invokes write(x,1) at 1 and receives OK at 4; P2 invokes read(x) at 2 and receives 0 at 3. It is linearizable in the order read, write. Separately, simulate two concurrent writes (timestamp=100,node=A,value=red) and (90,B,blue), comparing (timestamp,node): both arrival orders converge to red and discard blue. Merge cart siblings {book} and {dvd} by union after each device removed the other item from {book,dvd}; both deleted items reappear. Explain why convergence is not preservation of intent. Event numbers and timestamps are synthetic, not elapsed-time measurements.

**Traps**

- Using the phrase strong consistency without specifying the object, operations and real-time requirement.
- Claiming eventual convergence bounds lag or guarantees durability.
- Assuming set union correctly handles removals, or that LWW's greatest timestamp identifies the physically latest write.

**Practice**

- The section mini-project covers this: classify permitted and rejected histories, reproduce LWW data loss, and test an application conflict policy including removals.

**Stop when:** You give legal orders for H2 and the merely serializable H1, reject H1 under linearizability, and explain a convergent merge that still violates application intent.

<details>
<summary>Self-test</summary>

1. May a read overlapping a write return the old value?
   - Yes, if a legal linearization places it before the write. Other completed observations can constrain that order.
2. While write(1) is pending, read A returns 1; after A completes, read B returns 0. Is that linearizable if no other write exists?
   - No. A forces the write before A, real time forces A before B, and then B must read 1.
3. Does read-your-writes imply all users see the newest value?
   - No. It constrains the writer's session, not arbitrary readers.
4. P writes a post; Q reads it and writes a reply; R sees the reply but not the post. Which model rejects this?
   - Causal consistency rejects visibility of the dependent reply without its causal predecessor. Eventual consistency alone does not reject a temporary lagging view.

</details>

#### U4. Partitioning, hot keys, rebalancing and stale writers

**About 3 h** · **Target:** Explain

Topics: Partition keys, hashing, ranges, hot keys and skew; Rebalancing, ownership epochs and stale writers

Moving bytes does not transfer exclusive ownership by itself. Partition placement, request routing and stale-writer rejection must agree before a rebalanced shard can safely accept effects.

**You can now**

- Explain how range and hash partition keys trade scan locality against load distribution.
- Derive key movement and request skew for an explicit partition change.
- Trace a stale-owner write and explain what resource-enforced epochs do and do not prevent.

**Study**

1. [DDIA, 2nd edition: partition placement and routing](https://dataintensive.net/) (Designing Data-Intensive Applications, 2nd edition - distributed data path) - Chapter 7, Sharding by Key Range through Operations: Automatic Versus Manual Rebalancing, pp. 256 to 265; Request Routing, pp. 265 to 267.
2. [DDIA, 2nd edition: enforcing ownership at the resource](https://dataintensive.net/) (Designing Data-Intensive Applications, 2nd edition - distributed data path) - Chapter 9, Distributed Locks and Leases, including Fencing off zombies and delayed requests and Fencing with multiple replicas, pp. 373 to 376.

**Focus**

- A partition key determines colocation. Range partitioning supports nearby-key scans but can concentrate timestamp writes; hashing spreads distinct keys, not repeated requests for one key.
- Separate keys-to-shards from shards-to-nodes. Fixed virtual shards avoid remapping every key when the node count changes.
- Routing metadata can be stale during transfer. Record an ownership epoch and decide when the new owner and receiving resource have installed it.
- A resource that remembers the greatest accepted fencing token rejects lower tokens only after learning the newer one. Persist that fence with the protected mutation; equal-token retries still need operation deduplication.

**Reproduce:** By hand or in Python 3.14, use integer keys 0 through 11 and the toy hash h(k)=k. Changing node assignment from k%3 to k%4 moves nine keys. Instead keep 12 fixed shards, initially owned by shard%3, and move only shards 3,7,11 to new node 3: three keys move and each node owns three keys. For a separate workload of 90 requests for key 0 and one for each key 1 through 11, k%3 gives request counts [93,4,4]. Then trace writes at one shared resource with initial maximum token 7: A writes (token 7,x=old) and receives OK; B installs token 8 and writes x=new; delayed A writes (7,x=old) and is rejected. Remove the token check and A overwrites new. Also test A arriving before the resource sees token 8: a greatest-seen-token check still accepts 7. Check these counts and orders directly, not as a benchmark; issuance of token 8 elsewhere is not instantaneous revocation at this resource.

**Traps**

- Using Python's process-randomized string hash as a persistent partition function.
- Assuming balanced key counts imply balanced request load or that hashing can split a single hot key.
- Checking a lease only at the sender. Pauses and delayed requests can outlive that check; fencing is resource enforcement, not a clock trick or an exactly-once mechanism.

**Practice**

- The section mini-project covers this: partition movement and hot-key counts, ownership transfer, persistent resource-side fencing, and delayed stale writes before and after the new epoch is installed.

**Stop when:** You reproduce both movement counts and the skew, then explain why the stale write is rejected only after the receiving resource installs the new fence.

<details>
<summary>Self-test</summary>

1. Why does adding nodes not fix one overloaded partition key?
   - If all requests for that key remain on one shard, its load stays concentrated. Splitting the logical key requires application aggregation or another workload-specific design.
2. What is stable when a fixed shard is moved to a new node?
   - The key-to-shard mapping. Shard-to-node placement and routing metadata change.
3. Has issuing token 8 revoked token 7 at every resource?
   - No. A greatest-seen-token resource must first install or observe 8, and all protected resources must enforce the fence.
4. Can token 8 be used for two duplicate increments?
   - Yes, if equal tokens are accepted. Fencing blocks stale owners, not duplicate operations from the current owner. Deduplication needs an operation identity and atomic effect boundary.

</details>

#### U5. Durable logs, delivery guarantees and idempotent consumers

**About 4 h** · **Target:** Explain + Implement

Topics: Durable logs, offsets, acknowledgements and replay; At-most-once, at-least-once and scoped effectively-once effects; Idempotent consumers and transactional effect boundaries

Assume Programming's http-apis-idempotency and transactions-isolation units. Here the mechanism is a retained log and a consumer checkpoint: deduplicating a request is not enough if its effect and progress can disagree after a crash.

**You can now**

- Trace append, acknowledgement, effect and offset boundaries under consumer failure.
- Implement a replaying consumer with an atomic database effect-and-offset boundary.
- State an effectively-once effect contract without extending it to external systems.

**Study**

1. [DDIA, 2nd edition: retained logs and consumer recovery](https://dataintensive.net/) (Designing Data-Intensive Applications, 2nd edition - distributed data path) - Chapter 12, Log-Based Message Brokers through Consumer offsets, pp. 495 to 498; Fault Tolerance, including Atomic commit revisited and Idempotence, pp. 526 to 528.
2. [Kafka 4.3 design: delivery and transaction scope](https://kafka.apache.org/43/design/design/#message-delivery-semantics) (Apache Kafka documentation - design) - Persistence; The Consumer > Consumer Position; Message Delivery Semantics; Using Transactions. Depth: Use Persistence for the append-to-page-cache mechanism, not its hardware-specific performance numbers. Use classic consumer groups for this model, not share groups. Do not install Kafka for this unit.

**Focus**

- Define the checkpoint as the next offset to process, scoped by consumer group and partition. Reading does not delete a retained log record; replay is limited by retention.
- Offset-before-effect can skip work after a crash; effect-before-offset can repeat it. A transport acknowledgement, append acknowledgement and consumer progress commit are different boundaries.
- For a single in-order consumer, store effect and next offset atomically in the same database. Concurrent owners require fencing or transactional serialization as well.
- Kafka transactions can couple Kafka output records with input offsets. External email, payments or another database do not join that transaction merely because the producer is idempotent.

**Reproduce:** Write a small program with Python 3.14's sqlite3 module; Kafka is not needed. Model one retained input partition as the immutable record (offset 0, delta +5), with database tables effect(total=0) and progress(pos=0), where pos is the next offset. Use a fresh on-disk database per case, journal_mode=DELETE and synchronous=FULL. In a child process, inject os._exit(9) after committing pos=1 but before the effect; reopening gives (total,pos)=(0,1), so restart skips the effect. Inject exit after committing the increment but before pos: reopening gives (5,0), and normal replay gives (10,1). Finally put both updates in BEGIN IMMEDIATE/COMMIT: exit before COMMIT reopens at (0,0), exit after COMMIT at (5,1), and restart from the stored pos ends at (5,1) in both cases. Close and reopen connections, replay only offset >= pos, and assert all four outcomes. These are process-exit tests with CPython 3.14.4 and SQLite 3.46.1, not a power-loss durability claim. Extend the model to two independent groups with separate progress; neither group advances the other's checkpoint.

**Traps**

- Recording deduplication metadata separately from the protected effect. A crash between them can lose or duplicate work.
- Committing past a failed record when later records finish first. A single offset represents a contiguous processed prefix, not an arbitrary set of completed tasks.
- Equating append into the page cache with stable storage, or a process-exit test with proof against power failure.

**Practice**

- The section mini-project covers this: a checksummed retained log, independent group/partition checkpoints, replay after each crash boundary, and atomic effect-plus-progress or deduplication metadata. Keep external effects outside the claimed transaction scope.

**Stop when:** Your child-process tests reproduce the skip and duplicate, both transactional cases recover to total 5, and your contract names the effect store, offset scope and excluded external effects.

<details>
<summary>Self-test</summary>

1. Why does effect-before-offset produce a duplicate after a crash?
   - The durable effect survives, but the old checkpoint instructs the replacement consumer to repeat the same record.
2. Is setting a value always an idempotent substitute for incrementing?
   - Not generally. Replaying an older set can overwrite newer state. Ordering, version checks or transactional deduplication must protect the intended effect.
3. What identifies one consumed record in a partitioned log?
   - The log or topic identity, partition and offset. Offset alone is not globally unique, and effect deduplication must also have the right consumer/application scope.
4. Does atomic database effect-and-offset commit make an email exactly once?
   - No. The email service is outside that transaction. It needs a cooperating idempotency boundary or another explicit delivery contract.

</details>

#### U6. Consumer lag, watermarks and state rebuild

**About 5 h** · **Target:** Explain + Implement

Topics: Consumer lag, backlogs, dead letters and poison records; Event time, processing time, watermarks and late data; Snapshots, compaction and state rebuild from a log

Assume Programming's backpressure-graceful-shutdown unit. This unit moves beyond queue admission to persisted backlog and event-time state, where replay must recover the right data rather than merely restart a worker.

**You can now**

- Diagnose offset lag, retention gaps and poison-record stalls without confusing them with event-time lateness.
- Implement a window policy with explicit watermark and late-data rules.
- Rebuild state from a matching snapshot and log suffix, and explain when compaction preserves state but loses history.

**Study**

1. [DDIA, 2nd edition: backlog, snapshots and event time](https://dataintensive.net/) (Designing Data-Intensive Applications, 2nd edition - distributed data path) - Chapter 12, dead letter queues on p. 495; Consumer offsets through When consumers cannot keep up with producers, pp. 498 to 499; Initial snapshot and Log compaction, pp. 504 to 506; CDC versus event sourcing, pp. 507 to 508; Reasoning About Time, pp. 518 to 522; Microbatching and checkpointing, p. 527.
2. [Kafka 4.3 design: what compaction retains](https://kafka.apache.org/43/design/design/#log-compaction) (Apache Kafka documentation - design) - Log Compaction Basics and What guarantees does log compaction provide?. Depth: Read offset stability, holes and tombstone retention. Skip cleaner tuning and the diagrams' throughput claims; model compaction in Python instead of deploying Kafka.

**Focus**

- For a dense toy log, offset lag is end-next-offset minus the consumer's next offset. Compaction holes mean that distance is not generally a count of remaining records; neither metric is event-time lateness.
- A poison record can block a partition indefinitely. A durable dead-letter handoff must preserve identity, reason and replay policy; advancing progress changes the main stream's completeness contract.
- A watermark is a progress claim or estimate with assumptions, not proof that no delayed event exists. State the input scope, idle-input policy and handling of events below it.
- A snapshot needs the exact log position that its state represents. Latest-value compaction works for replacement updates, not arbitrary increment events; tombstone expiry can invalidate rebuilding an old nonempty snapshot.

**Reproduce:** In Python 3.14, feed event timestamps [2,12,4] in that arrival order, using width-10 half-open tumbling windows, initial watermark -infinity, and watermark=max timestamp seen minus 3 after each arrival. Before updating the watermark, send any timestamp strictly below the previous watermark to a late side output. Get one event in [0,10), one in [10,20), late output [4], and final watermark 9. This is a declared toy lateness policy, not a measured clock bound. Separately replay replacement records (offset,key,value): (0,a,1),(1,b,2),(2,a,3),(3,b,null),(4,c,4), where null deletes. Snapshot after offset 2 is {a:3,b:2} with next offset 3; snapshot plus suffix and full replay both yield {a:3,c:4}. Compact by retaining the highest-offset record per key, including b's tombstone and original offsets, and rebuild the same final state from empty. Use exact dictionary assertions. Explain why deleting b's tombstone before replaying into the old snapshot leaves b incorrectly present, and why latest-only compaction of two increment(+1) events loses one increment.

**Traps**

- Publishing a watermark from the fastest input while ignoring a slower active input. A multi-input policy must account for each input's progress and explicitly handle idleness.
- Skipping a poison record without durably recording the dead-letter decision, or claiming the main output is still complete after the skip.
- Renumbering compacted offsets, replaying from the snapshot's last applied offset instead of its next offset, or rebuilding old state after its required log suffix was deleted.

**Practice**

- The section mini-project covers this: offset and event-time progress, bounded retry and durable dead-letter handling, late-data tests, consistent snapshot positions, retained tombstones and rebuild equivalence after node loss.

**Stop when:** Your window and rebuild assertions pass, and you can give separate counterexamples for an unsafe watermark, an expired tombstone and compaction of increment events.

<details>
<summary>Self-test</summary>

1. In a dense log with end-next-offset 100 and committed next offset 70, what is offset lag?
   - 30 offset positions. It is not 30 seconds, and in a compacted log it need not mean 30 retained records.
2. Does watermark 9 mean an event timestamped 4 cannot arrive?
   - No. The toy policy predicts progress from observed timestamps; a delayed event may still arrive and must follow the declared late-data rule.
3. When should replay start for the snapshot after offset 2?
   - At next offset 3. Reapplying offset 2 could duplicate a non-idempotent effect even if this replacement-only example masks the mistake.
4. Can latest-value compaction preserve both a balance and its transaction audit history?
   - It can preserve the current balance if records replace the full value. Discarded earlier records cannot supply the full audit history; increment-only events also cannot be compacted that way.

</details>

#### U7. Distributed histories and deterministic failure simulation

**About 6 h** · **Target:** Implement + Measure

Topics: Distributed histories, safety violations and liveness stalls; Deterministic network and node-failure simulation

Assume Programming's debugging-hypotheses and synchronization-hazards units. Here the scheduler controls network and persistence boundaries rather than local thread races, and the evidence is a client history checked against a named distributed contract.

**You can now**

- Implement a deterministic scheduler for delayed, dropped and duplicate messages and crash-recovery transitions.
- Check a small register history against an independent sequential specification.
- Count stale responses and progress events under controlled faults, preserving a repeatable counterexample trace.
- Distinguish a finite liveness stall from a demonstrated safety violation.

**Study**

1. [DDIA, 2nd edition: models, safety and controlled failures](https://dataintensive.net/) (Designing Data-Intensive Applications, 2nd edition - distributed data path) - Chapter 9, System Model and Reality, pp. 380 to 383; Formal Methods and Randomized Testing through Deterministic simulation testing, pp. 384 to 387; Chapter 10, What Makes a System Linearizable?, pp. 404 to 408. Depth: Use application-level deterministic scheduling and a tiny exhaustive checker. Stop before runtime-level simulation; full model checking and consensus proofs are later work.
2. [Gossip Glomers: broadcast contracts](https://fly.io/dist-sys/3a/) (Gossip Glomers - Echo, Unique ID and Broadcast) - Challenge 3a, Specification for broadcast, read and topology; Evaluation. Depth: Read the protocol contract before coding. Challenge 3a is single-node; its success says nothing about partitions or process-crash durability.

**Focus**

- Record process, operation ID, object, input, result and ordered invocation/response events. Internal logs alone do not specify what clients observed.
- A register checker enumerates legal sequential orders constrained by completed-before-invoked edges. Treat pending timed-out writes as potentially executed, not automatically absent.
- Control scheduling, clock reads, randomness, iteration order and I/O completions. A random seed alone does not make an uncontrolled concurrent program deterministic.
- Separate durable state from volatile state on restart. A bad completed read is a finite safety witness; no progress during a bounded observation interval is a stall, not proof of permanent nontermination.

**Reproduce:** Write a Python 3.14 event scheduler with explicit integer ticks, a stable insertion-order tie-break, durable registers L=F=0, and a partition that initially drops L-to-F replication. Run this schedule: tick 1 P1 invokes write(x,1), L persists 1; 2 P1 receives OK; 3 P2 invokes a read served by F; 4 P2 receives 0; 5 F crashes, losing only volatile state; 6 F restarts with durable 0; 7 heal the link; 8 deliver a repair assigning F=1; 9 deliver that repair again; 10 P2 invokes another read from F; 11 it returns 1. Preserve the client events as JSON. A closed-book checker enumerating complete-operation permutations, enforcing response-before-invocation edges and the register rule, must reject the first read under linearizability. Fix this specific schedule by routing reads to the reachable, unchanged L; responses become [1,1] rather than [0,1]. Repeat each version three times and assert byte-identical traces within each version. Count stale responses, not wall-clock latency. These are synthetic logical ticks, not network timings. Add a pending read that waits during a partition, then completes after repair; report the bounded wait as a liveness stall, not a safety violation or proof of nontermination.

**Traps**

- Checking replicas against one another instead of checking the observed history against an independent object specification.
- Dropping timed-out operations from a safety history. Their effects may be visible to later completed reads.
- Calling an in-memory model a crash-durability test, or claiming a single passing fault schedule proves all executions correct.

**Practice**

- [Gossip Glomers Challenge 3a: Single-Node Broadcast](https://fly.io/dist-sys/3a/) - Implement broadcast, read and topology; use the Evaluation command's one-node broadcast workload. Reuse the Echo protocol harness and Maelstrom setup from Challenge 1, not a copied broadcast solution. Preserve protocol histories. The section mini-project adds explicit process-loss and persistence tests outside Maelstrom's failure model.
- [Gossip Glomers Challenge 3b: Multi-Node Broadcast (optional extension)](https://fly.io/dist-sys/3b/) - Specification and Evaluation with five nodes, no network partitions. Attempt only after writing delivery, duplicate and partition assumptions and passing 3a. Stop at 3b; do not infer partition tolerance from this workload or continue into the later challenges as foundation work.

**Stop when:** The checker rejects the stale-read trace and accepts the reachable-leader repair, repeated schedules have identical traces, and your dossier separates the synthetic safety witness, the bounded progress stall and your broadcast challenge results.

<details>
<summary>Self-test</summary>

1. Why is the first read a safety violation rather than just a slow follower?
   - The write completed before the read began. With no intervening write, returning 0 cannot fit a real-time-respecting register order, regardless of why the follower lagged.
2. If a read has not completed by tick 100, is linearizability violated?
   - Not by that fact alone. It shows a bounded progress stall. Linearizability is a safety property and does not require operations to complete.
3. A write times out, then a read returns its value. Must the history be rejected?
   - No. The pending write may have taken effect. A checker must consider a completion or placement of it consistent with the observed completed operations.
4. Does Challenge 3b test network partitions?
   - No. It uses multiple nodes without partitions. A partition-resilience claim needs separate failure evidence; 3a and 3b also do not intentionally crash node processes.

</details>

#### U8. MapReduce execution and data-local scheduling

**About 2 h** · **Target:** Explain

Topics: MapReduce execution and data-local scheduling

This optional unit connects local process and RPC mechanisms to a distributed batch execution model. It is a scheduling and failure vocabulary bridge, not an invitation to implement Raft or a production batch engine.

**You can now**

- Trace map, partition, shuffle, group and reduce stages for a small batch job.
- Explain local-input scheduling, lost intermediate output and retried task attempts.
- Separate duplicate computation from duplicate publication of output.

**Study**

1. [DDIA, 2nd edition: batch scheduling and MapReduce](https://dataintensive.net/) (Designing Data-Intensive Applications, 2nd edition - distributed data path) - Chapter 11, DFS data-local execution on p. 461; Distributed Job Orchestration through Handling faults, pp. 461 to 466; MapReduce, pp. 466 to 467; Shuffling Data, pp. 469 to 470. Depth: Skip resource-allocation algorithm derivations and Dataflow Engines. Stop after Figure 11-1's task/shard explanation on p. 470; joins and full batch-framework implementation are outside this gate.

**Focus**

- Map tasks read input shards. The shuffle routes equal keys to one reducer and groups their values; it is not a random permutation.
- Locality means scheduling computation near a replica of its input in a colocated storage/compute design. Object-store separation and resource availability can make remote execution appropriate.
- Retries may run the same logical task more than once. Attempt outputs must remain private until one successful attempt is selected for publication.
- Lost local intermediate files require recomputation or another surviving copy. Deterministic tasks over immutable inputs support replay; arbitrary external side effects do not become safe automatically.

**Reproduce:** Closed-book, trace word count for two input shards, 'a b a' and 'b c'. Emit (word,1), route a and c to reducer 0 and b to reducer 1, group by word and sum: a=2,b=2,c=1. Place each map on a node holding its input replica, then fail the first map's node after it produces private intermediate output but before publication. Retry from an unchanged surviving input replica and publish only the accepted attempt for each logical map task. A Python Counter oracle gives the same counts. If you instead publish both first-map attempts, the wrong result is a=4,b=3,c=1. Label which bytes are input replicas, local intermediate output and published final output. This is a trace and counter model, not a measured locality speedup.

**Traps**

- Publishing every successful attempt as new logical work. Retrying a task does not authorize double-counting its output.
- Treating shuffle as randomization or assuming map placement eliminates the reducer's network traffic.
- Claiming data-local scheduling is always faster without accounting for load, storage architecture and a measured workload.

**Practice**

- The section mini-project covers this: an optional two-map batch trace over the retained log, a failed attempt with private output, and a retry checked against a sequential word-count oracle. No distributed batch engine is required.

**Stop when:** You trace both reducers, explain the retry's correct and double-published counts, and identify when locality is available without claiming a speedup.

<details>
<summary>Self-test</summary>

1. Why must equal keys meet at the same reducer?
   - That reducer needs the full group to compute the job's per-key result. Partitioning by a different identity can split the group and produce incomplete results.
2. Does a map retry violate effectively-once output?
   - Not if only one successful attempt's output is published for each logical task. Computation can repeat while visible output remains equivalent to one execution.
3. Can the scheduler prefer a nonlocal node?
   - Yes. A local node may be unavailable or overloaded, and disaggregated object storage may not offer colocated compute at all.
4. What breaks replay if a mapper sends an email for every input record?
   - Attempt-output selection cannot retract an external email. Retrying may send it again unless that external effect has its own cooperating idempotency boundary.

</details>

### Mini-project: Deterministic replication and stream-replay simulation over the service log

**About 14 to 20 hours.** Simulate the service slice replicated and consumed, in one process with logical ticks: a leader and followers with configuration IDs, ownership transfer with fencing, and a consumer group that replays the log into derived state. Drive it through lag, duplicates, a stale read, an ownership change, replay and node loss, then defend the contract with one history it permits and one it rejects.

1. Write kv/sim/scheduler.py: an event loop over integer ticks with a stable insertion-order tie-break and one seeded random source owned by the scheduler. A schedule delivers, delays, drops or duplicates messages, and crashes nodes, which lose volatile state, keep what they persisted and can restart. Every run writes the client history (process, operation ID, object, input, invocation tick, response tick, result) as JSON, and the same seed must give a byte-identical history three times.
2. Model three replicas of the service log. The leader acknowledges according to a declared mode, after its own fsync or after a majority has persisted, and every operation records the configuration ID it used. Reproduce asynchronous-failover loss (the leader acknowledges, dies, and a follower without the write is promoted) and the unit's stale-membership read (write through A, B, C; read through C, D, E before state transfer returns 0). Then show that majority persistence with a membership change that blocks reads in the new configuration until state transfer completes keeps the acknowledged write in the same schedules.
3. Write kv/sim/check.py: a brute-force linearizability checker for one register over small histories that enumerates orders respecting response-before-invocation and treats a timed-out write as possibly applied. It must reject the unit's H1 and the stale-follower read, and accept H2 and the leader-read repair. Add checks for read-your-writes and monotonic reads, and classify every history you produce as linearizable, session consistent only, or neither.
4. Add a multi-writer mode with last-write-wins on (timestamp, node) and reproduce the lost update: two concurrent writes converge to one value in both arrival orders, and the other acknowledged write is gone. Write an application merge for a set with removals (tombstoned elements or an observed-remove set) and test the unit's cart case: removed items stay removed, where plain union brings them back.
5. Partition keys over 12 fixed shards owned by nodes. Move shards 3, 7 and 11 to a new node (three keys move, where remapping k%3 to k%4 moves nine) and count requests per node under a hot key (90 requests for key 0 give [93, 4, 4] over three nodes). Transfer ownership with a fencing token persisted at the log resource with the mutation: a delayed write from the old owner with token 7 is rejected after the resource has seen token 8 and accepted before. Keep both schedules, and the overwrite when the check is removed.
6. Treat each replica log as a retained partition and write a consumer group that applies records to derived state in SQLite, storing the next offset in the same transaction, one checkpoint per group and partition. Crash it at each boundary (offset before effect, effect before offset, inside and after the transaction) and show only the atomic version matches a sequential oracle; two groups keep independent checkpoints. Mark an external effect (an email stub) as outside the transaction and give it its own idempotency key.
7. Add event time: records carry event_at, the watermark is the maximum seen minus a declared lateness, windows are width-10 tumbling, and late events go to a side output (with lateness 3, the unit's [2, 12, 4] gives late [4] and watermark 9). Retry a poison record a bounded number of times, then move it to a durable dead-letter table with its offset, reason and replay policy, and mark the window output incomplete. Report offset lag (end offset minus the group's next offset) apart from event-time lateness. Snapshot with the next offset, compact keeping tombstones, kill the consumer node and show snapshot plus suffix equals full replay; then show an expired tombstone bringing back a deleted key.
8. Run one scenario through lag, a duplicate, a stale read, an ownership change, a replay and a node loss, and write the contract on one page: what an acknowledgement means, which consistency reads get in each mode, the consumer's delivery guarantee and what is excluded. Give one history it permits and one it rejects, each checked by kv/sim/check.py. Optionally trace a two-map word count over the log with one failed attempt kept private and a retry checked against a Counter oracle (a=2, b=2, c=1; a=4, b=3, c=1 if both attempts publish).

**Deliverables**

- kv/sim/: scheduler, replicas, fencing, consumer and stream state, with tests that replay every seeded scenario byte for byte.
- kv/sim/check.py with the linearizability and session checks and their fixtures (H1, H2, stale read, repair).
- The scenario histories as JSON and the one-page contract with its permitted and rejected history.
- The consumer crash-boundary table and the stream-state tests: late data, dead letters, snapshot plus suffix and tombstone expiry.

**Checks**

- rubric: Self-grade with the rubric below.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Determinism | The same seed gives byte-identical histories, and every fault comes from the schedule, not from wall-clock timing. | A failing scenario found by a random seed is cut down by hand to a short schedule kept as a regression. |
| Replication and membership | Asynchronous-failover loss and the stale-membership read are reproduced with configuration IDs on every operation, and the repaired mode keeps the acknowledged write. | The write-up separates quorum intersection, persisted acknowledgements and membership coordination as three distinct requirements. |
| Checker | The checker rejects H1 and the stale read, accepts H2 and the repair, and treats timed-out writes as possibly applied. | Every produced history is classified, and one fixture is accepted only because a pending write may have taken effect. |
| Ownership and replay | Fencing rejects the delayed write once the resource has seen the new token, and only the atomic consumer matches the oracle at every crash boundary. | The dead-letter path and the tombstone-expiry failure each state which completeness claim they change. |
| Contract | The one-page contract names the acknowledgement meaning, read consistency, delivery guarantee and exclusions, with one permitted and one rejected history. | Every claim in the contract points to the scenario and test that support it. |

Feeds into: Capstone service slice: the offset invariant and the deterministic process faults. Dossier: the distributed history with its permitted and rejected cases.

### Resource route

- **Primary - Theory:** [Designing Data-Intensive Applications, 2nd edition - distributed data path](https://dataintensive.net/) - Read the selected chapters on replication, partitioning, distributed-system trouble, consistency and consensus, batch processing and stream processing. For each guarantee, write its assumptions, a confirming history and one counterexample outside the boundary.
- **Required - Practice:** [Gossip Glomers - Echo, Unique ID and Broadcast](https://fly.io/dist-sys/) - Complete Challenge 1 Echo, Challenge 2 Unique ID Generation and Challenge 3a Single-Node Broadcast. Add 3b Multi-Node Broadcast only after writing the delivery, duplicate and partition assumptions. Preserve protocol histories rather than relying on a success banner.
- **Support - Course:** [MIT 6.5840 - MapReduce, RPC and consistency bridge](https://pdos.csail.mit.edu/6.824/schedule.html) - Use the introductory MapReduce, RPC, GFS and consistency lectures after the local RPC and store gates. The MapReduce lab is optional. Do not begin Raft or sharded KV as foundation work.
- **Support - Reference:** [Apache Kafka documentation - design](https://kafka.apache.org/43/design/design/) - Read Persistence, The Consumer (Consumer Position), Message Delivery Semantics, Using Transactions, Replication and Log Compaction for a concrete log: offsets, consumer positions, the at-most-once, at-least-once and exactly-once boundaries, in-sync replicas and compaction guarantees. Map each guarantee onto your own log before trusting it.
- **Optional - Practice:** [Building Distributed Systems from Scratch - one challenge path](https://builddistributedsystem.com/tracks) - Choose one messaging, durable-log or partitioning challenge that matches a failed checkpoint. State the model, failures and evidence independently because interactive grading behavior has not been verified.
- **Support - Revision:** [AlgoMaster System Design - distributed fundamentals slice](https://algomaster.io/learn/system-design/course-introduction) - Use Database Replication, Consistency Models, Logical Clocks, Vector Clocks, Network Partitions, Split Brain Problem, Leader Election, Database Partitioning, Consistent Hashing, Delivery Semantics, Dead Letter Queues, Idempotency, Two-Phase Commit (2PC), Outbox Pattern and Streaming Engines as bounded review after DDIA. Attempt only the exercise that matches your implemented history, then challenge its assumptions with a node-loss, delay or duplicate case.

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

### Study units

#### U1. Metrics, logs, traces, correlation and cardinality

**About 3 h** · **Target:** Explain

Topics: Metrics, structured logs, traces and events; Request correlation, trace context and causal limits; Metric cardinality, labels, aggregation and sampling

The Programming stage already instrumented a pipeline with OpenTelemetry, bounded labels and secret exclusion in its logs-metrics-traces unit, taken here as assumed background. This unit turns that telemetry into evidence: SLOs, saturation readings and incident diagnosis all read the same signals, so the signals must be cheap, bounded and joinable before any decision uses them.

**You can now**

- Explain what each of metrics, structured logs, traces and events records, and which questions each answers.
- Connect the signals of one request through a propagated request identifier, and state where correlation stops proving causation.
- Predict the stored series count from a label set, and replace an unbounded label with a bounded design plus sampling.

**Study**

1. [Monitoring definitions and black-box versus white-box](https://sre.google/sre-book/monitoring-distributed-systems/) (Google Site Reliability Engineering - selected core chapters) - Definitions (white-box versus black-box monitoring); Black-Box Versus White-Box; Symptoms Versus Causes.
2. [The four golden signals and tail instrumentation](https://sre.google/sre-book/monitoring-distributed-systems/) (Google Site Reliability Engineering - selected core chapters) - The Four Golden Signals (latency, traffic, errors, saturation); Worrying About Your Tail: histogram buckets 0 to 10 ms, 10 to 30 ms, 30 to 100 ms and up by factors near 3; Choosing an Appropriate Resolution for Measurements. Depth: Read the bucket example as the instrumentation contract. Skip the Bigtable and Gmail case studies; they return in the incidents unit.
3. [Monitoring data sources and purposeful metrics](https://sre.google/workbook/monitoring/) (Google SRE Workbook - SLO, load, incident and canary exercises) - Sources of Monitoring Data (Move information from logs to metrics); Metrics with Purpose (Dependencies; Saturation; Status of Served Traffic; Implementing Purposeful Metrics).
4. [Labels, vectors and series cost](https://sre.google/sre-book/practical-alerting/) (Google Site Reliability Engineering - selected core chapters) - Storage in the Time-Series Arena (about 24 bytes per data point; 1 million series for 12 hours at 1-minute intervals in under 17 GB RAM); Labels and Vectors (labelset, variable expression, vectors).
5. [Signals: traces, metrics, logs and baggage](https://opentelemetry.io/docs/concepts/signals/) (OpenTelemetry Python - metrics, logs and traces) - Signals: Traces (path of a request); Metrics (measurement at runtime); Logs (recording of an event); Baggage (context passed between signals).
6. [Python manual instrumentation: tracer, spans, attributes and metrics](https://opentelemetry.io/docs/languages/python/instrumentation/) (OpenTelemetry Python - metrics, logs and traces) - Traces (Acquire Tracer; Creating spans; Add attributes to a span); Metrics (Creating and using synchronous instruments).
7. [Sampling: head versus tail](https://opentelemetry.io/docs/concepts/sampling/) (OpenTelemetry Python - metrics, logs and traces) - Terminology (sampled versus not sampled); Head Sampling (decision from trace ID before the outcome); Tail Sampling (error and latency criteria; stateful operating cost).

**Focus**

- White-box metrics expose internals and imminent failure; black-box checks prove user-visible symptoms. Page on symptoms, debug with causes.
- One label-value combination is one stored series. At 3 services x 5 endpoints x 3 codes x 4 instances the metric holds 180 series; adding a 200,000-value user label takes it to 9,000,000.
- Head sampling decides from the trace ID before the outcome is known, so it cannot keep every error. Tail sampling waits for completed spans and pays stateful cost.
- Keep what the Programming unit enforced: bounded label values, no secrets in attributes, and raw records retained behind every aggregate.

**Reproduce:** Closed-book, compute the series count for labels service (3 values), endpoint (5), status (3) and instance (4): 180. Add user_id with 200,000 values: 9,000,000. State which label breaks the budget and give the bounded replacement: drop user_id from the metric and keep it on sampled traces only.

**Traps**

- Treating a shared request ID as proof of causation. Sampling, retries and shared queues break the causal reading; the ID joins evidence, it does not assign blame.
- Putting request IDs, user IDs or tokens in metric labels. Each new value mints new series, and secrets in labels leak into every backend that stores them.
- Averaging per-service p99 values and reading the result as the fleet p99. Merge histogram bucket counts or pool raw samples, then take the percentile.

**Practice**

- The section mini-project covers this: the instrumented request path (request ID, queue wait, handler time, storage time, status, bounded labels) with local export, raw record retention and an enforced cardinality budget.

**Stop when:** You compute both series counts without notes, join one request across a metric, a log line and two spans by ID, and can name the label you would refuse.

<details>
<summary>Self-test</summary>

1. When should a page come from black-box rather than white-box monitoring?
   - When the condition is already user-visible and urgent. White-box predicts or explains; black-box proves the symptom. Every page stays urgent, actionable and needing intelligence.
2. A metric has labels with 3, 5, 3 and 4 values. How many series? What happens when a 200,000-value label is added?
   - 180 series; then 9,000,000. Collection, storage and query cost scale with series count, so the unbounded label must move to sampled traces or logs.
3. Why can head sampling miss every error in a release?
   - Its decision uses the trace ID before the outcome exists. Keeping all errors needs tail sampling, which waits for completed spans and pays stateful cost.
4. Two services report p99 values. Can you average them into a combined p99?
   - No. The average of two quantiles is not the quantile of the pooled data. Merge their histograms or retained raw samples, with sample sizes, and compute it again.

</details>

#### U2. Latency distributions, throughput and saturation

**About 3 h** · **Target:** Explain + Measure

Topics: Latency distributions, p50, p95, p99 and tail interpretation; Throughput, goodput, errors, utilization and saturation

Every SLO and capacity number later in this section reads a latency distribution. Assumed background: the Programming profiling-benchmarking unit, which built benchmark harnesses; this unit makes their output honest, with distributions first and one-number summaries never.

**You can now**

- Define latency, throughput, goodput, utilization and saturation, and separate queue wait from service time.
- Report p50, p95 and p99 from raw samples with the sample size, and explain what the mean hides.
- Measure a load sweep on your machine and name the saturated resource with its utilization.

**Study**

1. [Latency, traffic, errors and saturation](https://sre.google/sre-book/monitoring-distributed-systems/) (Google Site Reliability Engineering - selected core chapters) - The Four Golden Signals (latency of success versus failure; traffic; errors by policy; saturation with the 99th percentile over one minute as early signal).
2. [Aggregation hides tails](https://sre.google/sre-book/service-level-objectives/) (Google Site Reliability Engineering - selected core chapters) - Aggregation (burst averaging example; percentile bands in Figure 4-1); A Note on Statistical Fallacies (mean versus median under skew).
3. [Mean versus tail](https://sre.google/sre-book/monitoring-distributed-systems/) (Google Site Reliability Engineering - selected core chapters) - Worrying About Your Tail: 100 ms mean at 1,000 rps with 1% of requests at 5 seconds; exponential histogram buckets.
4. [Saturation and served-traffic metrics](https://sre.google/workbook/monitoring/) (Google SRE Workbook - SLO, load, incident and canary exercises) - Metrics with Purpose (Saturation: track every resource, hard limits and degradation thresholds; Status of Served Traffic: break down by status and quota denial).

**Focus**

- Latency is a distribution. The SRE example (mean 100 ms, 1% at 5 s) and the Figure 4-1 bands show why one mean plus one threshold cannot describe user experience.
- Goodput counts useful completions; throughput counts all completions; errors by policy can turn slow successes into failures. Saturation is the fraction of the most constrained resource, and most systems degrade before 100%.
- Separate service time from queue wait in every measurement. Utilization explains which one dominates.
- Percentiles need raw samples and n. Report n with the value, never a bare p99.

**Reproduce:** With CPython 3.14.4's random module and random.seed(7), draw 5000 samples: if random.random() < 0.02 take max(1, random.gauss(400, 80)), else max(1, random.gauss(40, 8)), in ms. With nearest-rank percentiles (rank ceil(p x n / 100)) you should get mean 48.19 ms, p50 40.16 ms, p95 55.16 ms, p99 421.05 ms and max 627.33 ms. Count the samples above 200 ms (108) and above 400 ms (60), and explain why a dashboard showing mean 48 ms and p95 55 ms shows none of them.

**Traps**

- Averaging percentiles from shards or windows. Shards with different traffic and tails give an average of p99s that is no request population's p99; pool the samples or merge histogram counts first.
- Mixing failed-request latency into success latency, or dropping it. Fast 500s flatter the mean while slow errors are worse than fast ones; track both.
- Reading 60% average utilization as headroom. The saturated resource is the most constrained one; queue wait grows on its utilization, not the average.

**Practice**

- The section mini-project covers this: a load sweep through saturation on the learner's service reporting p50, p95 and p99 from retained raw samples with n, plus throughput, goodput, queue depth, utilization, errors and recovery.

**Stop when:** Your script prints the five stated numbers, and you can explain the hidden 2% tail and name the saturation signal you would alert on.

<details>
<summary>Self-test</summary>

1. In that run, mean is 48 ms and p95 is 55 ms over 5000 requests. How many requests are slower than 200 ms?
   - 108, about 2%, and 60 of them are above 400 ms. Only the p99 (421 ms) hints at them. Count from the samples; the mean and p95 cannot tell you.
2. Clients send 100 new requests/s. 10% fail on the first try and are retried once, and every retry succeeds. Offered load, throughput and goodput?
   - Offered load and throughput are 110 attempts/s (100 successes plus 10 failures); goodput is 100 successful requests/s. Retries add 10% load without adding goodput.
3. Utilization reads 85% but latency is flat. Saturated?
   - Not necessarily. Saturation is about the most constrained resource and its queue. Check queue wait, queue depth, the 99th percentile trend and per-resource utilization.
4. Why exponential histogram buckets?
   - Latency spans orders of magnitude. Buckets growing by about 3x (0-10, 10-30, 30-100, 100-300 ms) resolve both the 40 ms body and the 400 ms tail without storing every sample.

</details>

#### U3. SLIs, SLOs, error budgets and recovery objectives

**About 3 h** · **Target:** Derive

Topics: Availability, durability, SLI, SLO and error budget; Recovery point, recovery time and backup freshness

SLOs turn monitoring into decisions: ship or freeze, page or ticket. Readiness and liveness from the Programming health-containers-runbooks unit, taken as assumed background, become SLI inputs here, and the error budget prices every later choice about load, rollout and incidents.

**You can now**

- Derive an error budget from an SLO and window, and convert it into allowed failures and minutes.
- Combine component availabilities for series and parallel topologies, stating the independence assumption.
- Specify RPO and RTO for a store, and check backup freshness against the RPO.

**Study**

1. [SLIs, SLOs, SLAs and error budgets](https://sre.google/sre-book/service-level-objectives/) (Google Site Reliability Engineering - selected core chapters) - Service Level Terminology (Indicators; Objectives, with The Global Chubby Planned Outage; Agreements); Indicators in Practice (availability as yield; durability); Aggregation; Objectives in Practice (Defining Objectives with 90%, 99% and 99.9% bands; error budget paragraph).
2. [Choosing targets and setting expectations](https://sre.google/sre-book/service-level-objectives/) (Google Site Reliability Engineering - selected core chapters) - Choosing Targets (do not pick from current performance; as few SLOs as possible); SLOs Set Expectations (safety margin; do not overachieve).
3. [Risk and the motivation for error budgets](https://sre.google/sre-book/embracing-risk/) (Google Site Reliability Engineering - selected core chapters) - Measuring Service Risk; Motivation for Error Budgets; Forming Your Error Budget.
4. [SLI ratios and the worked API example](https://sre.google/workbook/implementing-slos/) (Google SRE Workbook - SLO, load, incident and canary exercises) - What to Measure: Using SLIs (good events over total events); A Worked Example (API 97% availability, 90% under 450 ms, 99% under 900 ms; 109,897-error budget); Choosing an Appropriate Time Window (four-week rolling).
5. [Error budget policy and decisions](https://sre.google/workbook/implementing-slos/) (Google SRE Workbook - SLO, load, incident and canary exercises) - Establishing an Error Budget Policy; Documenting the SLO and Error Budget Policy; Decision Making Using SLOs and Error Budgets (single release consuming 13% of budget).
6. [Burn-rate alert shapes](https://sre.google/workbook/alerting-on-slos/) (Google SRE Workbook - SLO, load, incident and canary exercises) - Ways to Alert on Significant Events (Alert on Burn Rate; Multiwindow, Multi-Burn-Rate Alerts). Depth: Read for alert-shape vocabulary only. Alert implementation belongs to the incidents unit.

**Focus**

- SLI is good events over total events; SLO is the target; the error budget is 100% minus the SLO times the window event count.
- A 99.9% SLO over 30 days allows 43.2 minutes of full outage; over 3 million requests it allows 3,000 errors. The same budget reads both ways.
- Series availability multiplies (0.999 x 0.995 = 0.99401) only for independent failures. Shared power, zones or deploys break the multiplication.
- RPO bounds data loss (backup freshness); RTO bounds downtime (restore plus failover). MTBF 720 h with MTTR 1 h gives 0.99861, and holding 0.999 needs MTTR at most 0.72072 h.

**Reproduce:** Closed-book, derive the 30-day 99.9% budget (30 x 24 x 60 x 0.001 = 43.2 minutes), the series product 0.999 x 0.995 = 0.99401 with independence stated, and the MTBF/MTTR pair 720/721 = 0.99861 with maximum MTTR 720 x 0.001/0.999 = 0.72072 h. Then state the RPO check a restore drill must pass: the newest restorable record is no older than the RPO.

**Traps**

- A 100% SLO. Change itself is the top outage source, so 100% forbids deploys and leaves no room to improve.
- Setting the SLO from current performance. It locks in heroic effort or hides user pain; start loose and tighten with evidence.
- Quoting availability without the window and without independence. 99.9% over a week is 10.1 minutes, not 43.2.

**Practice**

- [AlgoMaster: Calculate System Availability](https://algomaster.io/practice/system-design/calculate-system-availability) - AvailabilityCalculator.calculate: series product versus parallel 1-minus-product-of-failures, rounded to 5 places. Attempt only after your own series and parallel estimates. Compare the platform answer with the independence assumption written down.
- [AlgoMaster: Plan Reliability Recovery Targets](https://algomaster.io/practice/system-design/plan-reliability-recovery-targets) - availability (MTBF/(MTBF+MTTR)), maximumMttr and meetsTarget on unrounded availability. Attempt only after your own MTBF and MTTR numbers. Check meetsTarget against the unrounded value, not the rounded one.

**Stop when:** You derive all four numbers without notes and can defend one SLO choice with its window, budget and policy action.

<details>
<summary>Self-test</summary>

1. 3 million requests in 4 weeks at 99.9% availability: budget? One outage caused 1500 errors: share?
   - 3,000 errors; the outage spent 50% of the budget.
2. Two replicas at 0.99 each share one rack power feed. Combined availability?
   - Not 0.9999. Parallel math assumes independent failures; the shared feed fails both at once, so the pair is no better than the feed itself.
3. RPO is 1 hour and the last verified backup is 90 minutes old. Pass?
   - No. Freshness exceeds RPO, so restore would lose up to 90 minutes. Take and verify a new backup.
4. A burn-rate alert fires while the window SLO dashboard is green. What does that mean?
   - Budget is being consumed fast relative to the window. The multiwindow alert predicts exhaustion before the window average moves.

</details>

#### U4. Little's Law, capacity and queueing approximations

**About 4 h** · **Target:** Derive

Topics: Arrival rate, service time, concurrency and Little's Law; Capacity for requests, bytes, storage, memory and bandwidth; Basic queueing-model approximations and uncertainty ranges

Admission bounds and queue sizes from the Programming backpressure-graceful-shutdown unit, taken as assumed background, need numbers. This unit derives them: arrival rate times time in system is the queue you must bound.

**You can now**

- State Little's Law with units and its stability assumption, and solve for any one of arrival rate, concurrency and time in system.
- Derive capacity, utilization and headroom for requests, bytes, storage, memory and bandwidth from a stated workload.
- Apply an M/M/1 or M/D/1 approximation with its assumptions written down, and report the uncertainty range.

**Study**

1. [M/M/1 stability and closed forms](https://en.wikipedia.org/wiki/M/M/1_queue) (M/M/1 queue - model definition and stationary analysis) - Model definition (Poisson arrivals, exponential service, single server, infinite buffer, FIFO); Stationary analysis (stability lambda < mu, rho = lambda/mu); Average number of customers in the system (L = rho/(1 - rho)); Response time (W = 1/(mu - lambda) via Little's Law). Depth: Use the closed forms as approximations only. Your service is not proven Poisson or exponential; the simulation in Reproduce is the check.
2. [Capacity in resources, not queries](https://sre.google/sre-book/handling-overload/) (Google Site Reliability Engineering - selected core chapters) - The Pitfalls of 'Queries per Second' (cost per request varies; model capacity directly in CPU time and memory).
3. [Conservative capacity and scaling bounds](https://sre.google/workbook/managing-load/) (Google SRE Workbook - SLO, load, incident and canary exercises) - Autoscaling (Configuring Conservatively: stay far from bottlenecks, spare capacity for overload and redundancy; Setting Constraints: minimum and maximum bounds); Avoiding Overloading Backends.

**Focus**

- L = lambda W needs matching units: (requests/s) x s = requests. It holds for long-run averages in a stable system; it predicts nothing about tails.
- Utilization rho = lambda/mu governs the wait. At rho 0.5, 0.8 and 0.95 the M/D/1 mean wait is 0.5x, 2x and 9.5x the service time; a seeded 60 s simulation at 10 ms service measured 4.86, 19.97 and 80.87 ms against theory 5, 20 and 95 ms.
- Capacity is per resource. The bottleneck is the smallest capacity-over-work ratio: 12000/1, 5000/2 and 20000/0.5 give 2500 rps at the database.
- Approximations carry ranges. M/M/1 assumes Poisson arrivals and exponential service; burstier arrivals or heavier-tailed service widen the real wait. Report the assumption beside the number.

**Reproduce:** Simulate a single FIFO server with CPython 3.14.4: random.seed(11), Poisson arrivals at 80/s from random.expovariate for 60 s, deterministic 10 ms service. The mean queue wait should be 20.475 ms against M/D/1 theory rho x S / (2 x (1 - rho)) = 20.000 ms, so the mean time in system is 30.475 ms and Little's Law gives L = 80 x 0.030475 = 2.44. Check the law directly: the time-average number in system over 5 to 55 s is 2.52, against lambda W 2.49 for the arrivals in that window. Then size servers: 0.8 average busy, so one server runs at rho 0.8 and two at 0.4.

**Traps**

- Applying L = lambda W to percentiles or to a draining queue. It relates long-run averages in a stable system only.
- Quoting lambda without a window. Poisson bursts exceed the average; size the bound for the peak window, not the daily mean.
- Treating the M/M/1 number as measured. It is a prediction under strong assumptions; the simulation or load run is the check.

**Practice**

- [AlgoMaster: Solve Little's Law](https://algomaster.io/practice/system-design/solve-littles-law) - LittlesLawCalculator.solve: detect the -1 argument and rearrange L = lambda W, rounded to 5 places (examples: 100 rps x 0.05 s = 5; 5/0.05 = 100 rps). Attempt only after your own three-way derivations. Keep units attached: throughput in requests/s, latency in seconds.
- [AlgoMaster: Analyze Capacity Bottlenecks](https://algomaster.io/practice/system-design/analyze-capacity-bottlenecks) - maxThroughput (minimum of capacity/work ratios) and bottleneck (name of the smallest ratio; alphabetical on ties). Attempt only after your own per-resource ratios. Select the bottleneck from unrounded ratios.

**Stop when:** You solve all three Little's Law directions without notes and can size one server count from a stated workload with the model assumptions listed.

<details>
<summary>Self-test</summary>

1. 100 rps with 50 ms in system: average concurrency?
   - 5 requests (100 x 0.05). Units: (requests/s) x s = requests.
2. Single server at rho 0.95: mean wait as a multiple of service time?
   - M/D/1 gives rho/(2 x (1 - rho)) = 9.5x; M/M/1 gives rho/(1 - rho) = 19x. State which model you used.
3. Capacities 12000/1, 5000/2 and 20000/0.5 per request: max throughput and bottleneck?
   - 2500 rps at the database (5000/2), the smallest ratio.
4. The simulation gives 80.87 ms at rho 0.95 against theory 95 ms. Contradiction?
   - No. Near rho 1 the queue relaxes slowly and the run starts empty, so a 60 s run reads low. Lengthen it, drop a warm-up, repeat with several seeds and report the spread beside the theory.

</details>

#### U5. Queue bounds, first saturation and open-loop load

**About 3 h** · **Target:** Measure

Topics: Queue bounds, first saturation point and bottleneck migration; Open-loop load and coordinated-omission vocabulary

Capacity math predicts; load proves. Assumed background: the Programming profiling-benchmarking unit, which measured one client at a time. This unit drives offered load on a schedule, which is the only way to see queueing before users do.

**You can now**

- Run an open-loop generator and a closed-loop driver against the same slow server and explain the different latency pictures.
- Find the first saturation point of your service and name the bottleneck that migrates as load rises.
- Retain raw load records and report percentiles from samples with n.

**Study**

1. [Coordinated omission and latency correction](https://www.youtube.com/watch?v=lJ8ydIuPFeU) (Gil Tene - How NOT to Measure Latency (talk)) - Full talk: closed-loop testers that wait for each reply, missing samples under queueing, and the correction concept of recording intended send time. Depth: Watch for the vocabulary and the correction idea. Do not adopt wrk, hey or ab; write the small Python generator in Reproduce instead.
2. [Load, autoscaling and the shedding case study](https://sre.google/workbook/managing-load/) (Google SRE Workbook - SLO, load, incident and canary exercises) - Autoscaling (Handling Unhealthy Machines; Configuring Conservatively); Combining Strategies to Manage Load; Case Study 2: When Load Shedding Attacks.
3. [Queue signals of saturation](https://sre.google/sre-book/monitoring-distributed-systems/) (Google Site Reliability Engineering - selected core chapters) - The Four Golden Signals (Saturation: 99th percentile over one minute as early signal); Choosing an Appropriate Resolution for Measurements.

**Focus**

- Open-loop sends on a schedule whether or not replies returned; closed-loop waits for each reply. Past the knee, closed-loop self-throttles and reports flat latency while the queue explodes.
- Seeded simulation (CPython 3.14.4, seed 21, 10 ms service, 500 ms stall every 200th request, 30 s): capacity is about 80.3 rps. Open loop at 60, 80 and 90 rps gives mean 96.3, 341.1 and 1843.1 ms and p99 502.8, 759.1 and 3727.5 ms, and the 90 rps numbers keep growing with run length. Closed loop with 5 clients gives mean 62.1 ms at 80.5 completed rps. Same server, different stories.
- The first saturation point is where queue wait passes service time and goodput stops rising with offered load. Past it the bottleneck migrates: server CPU, then queue memory, then the dependency.
- Keep every raw sample. Percentiles come from the retained records with n; the generator log is part of the evidence.

**Reproduce:** Write a small open-loop generator with CPython 3.14.4 (random.seed(21), Poisson schedule via random.expovariate, latency counted from the intended send time, one FIFO server with 10 ms service and a 500 ms stall on every 200th request, 30 s) and confirm the 80 rps row: mean 341.1 ms, p50 341.1 ms, p95 649.5 ms, p99 759.1 ms with nearest-rank percentiles. Then run the closed-loop twin (5 clients, next request on completion: mean 62.1 ms, p99 540.0 ms, 80.5 completed rps) and state which run to trust for tail latency and why.

**Traps**

- Tuning the closed loop until latency looks good. Fewer clients or think time hides the queue; the offered load is no longer the stated load.
- Reading server-side latency only. Queue wait before the handler is user-visible latency; instrument arrival-to-start separately.
- Calling the knee at 100% CPU. The first bottleneck is whatever queue grows first: threads, connections, memory or the dependency.

**Practice**

- The section mini-project covers this: an open-loop sweep of the learner's service through the predicted knee with retained raw records, measured p50, p95 and p99 with n, queue depth, utilization, errors and recovery, reconciled against the Little's Law prediction.

**Stop when:** Both generators run from your file, their latency pictures disagree as stated, and you can point at the knee with the bottleneck named.

<details>
<summary>Self-test</summary>

1. Open-loop p99 is 759 ms and closed-loop p99 is 540 ms on the same server. Which is honest?
   - Open-loop. Closed-loop skips the requests it never sent; the missing samples are the omitted coordination.
2. Throughput rises with offered load, then flattens while p95 climbs. What happened?
   - First saturation: the bottleneck server reached rho near 1. Extra offered load becomes queue wait and errors, not completions.
3. Why record intended send time, not just start and end?
   - A request that should have gone out earlier was already waiting from the user's point of view. Measuring from the intended send time keeps that wait; measuring from the actual send drops it.

</details>

#### U6. Retry budgets, circuit breaking and load shedding

**About 3 h** · **Target:** Explain + Derive

Topics: Deadlines, retry budgets, circuit breaking and amplification; Admission control, load shedding and graceful degradation

Assumed background: the Programming cancellation-timeouts-retries unit (deadlines, retry budgets, full jitter) and backpressure-graceful-shutdown unit (admission and drain), plus idempotent retries across RPC from the networking units. This unit prices them: amplification math sets the budget, and shedding decides who survives.

**You can now**

- Derive worst-case retry amplification across layers and set a retry budget that caps it.
- Explain adaptive throttling, criticality and load shedding, and place each at client, server or both.
- Propagate deadlines and cancellation so a shed request stops work at every layer.

**Study**

1. [Throttling, quotas and overload errors](https://sre.google/sre-book/handling-overload/) (Google Site Reliability Engineering - selected core chapters) - Per-Customer Limits; Client-Side Throttling (adaptive throttling, requests = 2 x accepts cutoff, local rejection); Criticality; Utilization Signals; Handling Overload Errors (Deciding to Retry).
2. [Shedding, retries and deadlines](https://sre.google/sre-book/addressing-cascading-failures/) (Google Site Reliability Engineering - selected core chapters) - Queue Management; Load Shedding and Graceful Degradation; Retries; Latency and Deadlines (Picking a deadline; Deadline propagation; Cancellation propagation; Bimodal latency).
3. [Slow starts and cascading tests](https://sre.google/sre-book/addressing-cascading-failures/) (Google Site Reliability Engineering - selected core chapters) - Slow Startup and Cold Caching; Testing for Cascading Failures (Test Until Failure and Beyond). Depth: Read once for vocabulary. The fault harness itself runs in the incidents unit.

**Focus**

- Retries multiply per layer: 2 retries at each of 3 layers turn 1 user request into at most 27 backend attempts. Budgets cap attempts per request or per window, with jitter to de-synchronize them.
- Adaptive throttling decides at the client from local accept and reject history (cutoff at requests = 2 x accepts); per-customer quotas keep one bad customer from spending the whole backend.
- Shed early and cheaply: reject above the bound before doing work, serve degraded answers while possible, and propagate deadlines plus cancellation so shed work actually stops.
- Bimodal latency (fast rejects mixed with slow successes) is the signature of a shedding or partially overloaded path. Average it and you see neither mode.

**Reproduce:** Closed-book, derive the 27x worst case above ((1 + 2)^3). Then set a budget for a service at 1000 rps that caps retries at 5% of requests (50 retry rps) with per-customer shares, and state where the breaker opens (client, server, or both) and what the fallback serves.

**Traps**

- Retrying on a saturated server. The retry adds queue wait for everyone; back off with jitter and count retries against the budget.
- Shedding at the server only. Rejected requests still cost parsing, TLS and queue; client-side throttling stops them before the wire.
- A deadline without propagation. Each layer waits out its own timeout, and the user waits for the sum.

**Practice**

- The section mini-project covers this: bounded admission, a per-customer retry budget with jitter, client-side throttle, a breaker with fallback, and propagated deadlines with cancellation in the learner's service slice, each demonstrated under injected overload.

**Stop when:** You derive the 27x case and defend one budget (rate, shares, breaker placement, fallback) against a retry storm you inject.

<details>
<summary>Self-test</summary>

1. 3 layers with 1 retry each: worst-case attempts per user request?
   - 8 (2^3). Retries compose multiplicatively across layers.
2. The backend spends as much CPU rejecting as serving. What changes?
   - Lower the adaptive multiplier toward 1.1 and throttle at the client. Server-side rejection alone still overloads the backend.
3. p50 falls while p99 climbs during overload. Explain.
   - Bimodal path: cheap rejects pull the median down while queued successes stretch the tail. Report both modes, not the mean.
4. When is a degraded answer better than an error?
   - When it is cheaper to compute and still useful (stale copy, partial corpus). Under extreme overload, shed to errors rather than collapse.

</details>

#### U7. Failure domains, correctness signals and safe rollout

**About 4 h** · **Target:** Explain

Topics: Failure domains and simultaneous-failure reasoning; Health, readiness and domain-specific correctness signals; Canary, rollback, version and migration tests

Container readiness, liveness and SIGTERM drains from the Programming health-containers-runbooks unit, taken as assumed background, tell you a process runs. This unit asks whether it serves correctly, and whether one rollout or one zone loss takes everything with it.

**You can now**

- Map replicas to failure domains and name the single points the replica count hides.
- Walk two simultaneous failures and state preserved and violated invariants.
- Run a canary with population, duration, representative metrics and rollback rule, and read its result.
- Separate health and readiness from domain-specific correctness signals.

**Study**

1. [Canary process and metric selection](https://sre.google/workbook/canarying-releases/) (Google SRE Workbook - SLO, load, incident and canary exercises) - Requirements of a Canary Process; Choosing a Canary Population and Duration; Selecting and Evaluating Metrics (Metrics Should Indicate Problems; Metrics Should Be Representative and Attributable; Before/After Evaluation Is Risky); Requirements on Monitoring Data (split canary from control; metric intervals within canary duration).
2. [Canary isolation and gradual stages](https://sre.google/workbook/canarying-releases/) (Google SRE Workbook - SLO, load, incident and canary exercises) - Dependencies and Isolation (shared backends couple canary and control; check absolute SLOs); Use a Gradual Canary for Better Metric Selection; Related Concepts (Blue/Green Deployment).
3. [Reliability test vocabulary](https://sre.google/sre-book/testing-reliability/) (Google Site Reliability Engineering - selected core chapters) - Stress test; Canary test; Production Probes. Depth: Read the three test definitions only. Full disaster testing returns in the incidents unit.
4. [What triggers cascading failure](https://sre.google/sre-book/addressing-cascading-failures/) (Google Site Reliability Engineering - selected core chapters) - Triggering Conditions for Cascading Failures (Process Death; Process Updates; New Rollouts; Organic Growth); Testing for Cascading Failures (Test Until Failure and Beyond).

**Focus**

- Replicas in one zone are one failure. API across two zones survives; a database with both copies in us-east-1a does not. Count zones per component, not replicas.
- Safe quorums need R + W > N and 2 x W > N. N=5, R=3, W=3 holds; N=4, R=2, W=2 lets two disjoint halves both take writes.
- Canary metrics must indicate user-visible problems and attribute to the change: reuse SLIs, prefer crash and failure signals in the small first stage, split canary from control in monitoring, and distrust before/after comparisons across time.
- Health says the process answers; correctness signals say the answers are right. A serving-but-wrong version passes readiness and needs a domain check (output quality, freshness watermark, reconciliation count).

**Reproduce:** Closed-book, map components api (zones a, b), db (a, a) and cache (c): at-risk components are db and cache (under two zones), and the dead set after zone a fails is db. Then take a five-replica store with N=5, R=3, W=3 spread 2, 2 and 1 over zones a, b and c: walk zone-a loss plus a bad canary on 5% of traffic, and state what still serves reads and writes and what the canary metrics must show before rollback.

**Traps**

- Counting two replicas as redundancy. Same zone, same deploy, same config or same dependency is one domain.
- Promoting a canary on aggregate error rate. A 5% canary at 20% errors reads as 1% overall; split canary versus control first.
- Splitting blame evenly between canary and control. Shared backends couple them, so also check absolute SLOs, not just the A/B gap.

**Practice**

- [AlgoMaster: Audit Failure Domains](https://algomaster.io/practice/system-design/audit-failure-domains) - atRiskComponents (under two distinct zones) and unavailableAfter (every replica in the failed zone), sorted without duplicates. Attempt only after your own zone map. Two replicas in one zone still share that zone.
- [AlgoMaster: Simulate Partition Quorums](https://algomaster.io/practice/system-design/simulate-partition-quorums) - partitionStatus (READ_WRITE, READ_ONLY, WRITE_ONLY, UNAVAILABLE) and hasSafeQuorums (R + W > N and 2W > N). Attempt only after your own quorum arithmetic. A reachable majority is not a safe quorum.

**Stop when:** You map zones, quorums and canary result without notes and can state which simultaneous pair your design survives.

<details>
<summary>Self-test</summary>

1. db replicas live in a and a; cache has one copy in c. At-risk? Dead after a fails?
   - At-risk: db and cache (each under two zones). Dead after a fails: db only.
2. N=4, R=2, W=2: safe quorums?
   - No. R+W and 2W equal N instead of exceeding it, so disjoint halves can both take writes.
3. Canary errors are flat but p95 is up 10%. Promote?
   - Not on error rate alone. Latency SLIs indicate user-visible harm; hold or roll back per the metric policy, then check attribution.
4. Readiness passes but answers are wrong. What is missing?
   - A domain correctness signal: sampled output checks, a freshness watermark or a reconciliation count, alerted like an SLI.

</details>

#### U8. Backups, runbooks, incident timelines and postmortems

**About 3 h** · **Target:** Implement

Topics: Backup, restore, runbooks and incident timelines; Postmortems, regression guards and prevention actions

All earlier evidence pays off here. Assumed background: hypothesis-driven debugging from the Programming testing-debugging-reproducibility units. This unit turns it into team procedure: timelines, roles, runbooks and postmortems.

**You can now**

- Work a timeline from telemetry and state detection, diagnosis, mitigation and recovery times.
- Execute a runbook for process death, dependency outage, bad rollout, corrupt state and overload, and verify restore against RPO and RTO.
- Write a blameless postmortem with owned action items and one regression guard.

**Study**

1. [Troubleshooting method](https://sre.google/sre-book/effective-troubleshooting/) (Google Site Reliability Engineering - selected core chapters) - Triage; Examine (Logging); Diagnose (Simplify and reduce; Ask what, where and why); Test and Treat; Negative Results Are Magic.
2. [Incident response roles and drills](https://sre.google/workbook/incident-response/) (Google SRE Workbook - SLO, load, incident and canary exercises) - Incident Management at Google (Incident Command System; Main Roles in Incident Response); Putting Best Practices into Practice (Prepare Beforehand; Drills).
3. [Postmortem culture](https://sre.google/workbook/postmortem-culture/) (Google SRE Workbook - SLO, load, incident and canary exercises) - Bad Postmortem versus Good Postmortem (satellite diskerase: context, blamelessness, concrete action items with owners); Organizational Incentives (Reward action item closeout).
4. [Disaster testing discipline](https://sre.google/sre-book/testing-reliability/) (Google Site Reliability Engineering - selected core chapters) - Testing Disaster. Depth: Read for restore-verification discipline only: backups count when a drill restores them inside RPO and RTO.
5. [Runbook and artifact evidence](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/python-experimental-systems-kit.md) (Python Experimental Systems Kit - measurement slice) - Failure-injection requirements (worker crash and hang, corrupt partial run, incompatible resume); Measurement requirements (distributions, queue occupancy, failed and retried work); Milestone F (reviewer-seeded unseen failure diagnosed from artifacts); short runbook for interrupted, hung or corrupt runs.

**Focus**

- Timelines carry times, not adjectives: detected at, diagnosed at, mitigated at, recovered at, plus measured RTO and RPO loss counted from the newest restorable record.
- Runbooks are tested procedures with owners: one each for process death, dependency outage, bad rollout, corrupt state and capacity exhaustion, each ending in a verified restore.
- Good postmortems are blameless, prompt and owned: context, mechanism, action items with owners and dates, and one regression guard that fails if the bug returns.
- Negative results are evidence. A ruled-out cause with its test stays in the timeline so the next responder does not repeat it.

**Reproduce:** Seed one fault in your service (kill a worker mid-run, corrupt one record, or deploy the bad version behind your canary split), work it with your runbook, and produce a timeline with detection, diagnosis, mitigation and recovery times, measured RTO and counted RPO loss, plus one merged regression test. There are no fixed numbers: yours are the evidence.

**Traps**

- Declaring recovery at mitigation. Recovery is verified restore plus SLO compliance over the window, not the moment the alert clears.
- Writing the postmortem as verdict. Blame ends inquiry; mechanism plus owned actions prevent recurrence.
- Trusting untested backups. An unverified backup is a hope; restore drills against RPO and RTO are the practice.

**Practice**

- The section mini-project covers this: one injected incident worked end to end (timeline, runbook execution, verified restore with measured RTO and counted RPO loss), a blameless postmortem with owned actions, and one merged regression guard.

**Stop when:** Your timeline, runbook run, restore drill and postmortem exist as artifacts, and the regression test fails on the re-seeded fault.

<details>
<summary>Self-test</summary>

1. The alert clears 10 minutes after the fix but p99 stays high for an hour. Recovered at 10 minutes?
   - No. Recovery needs restored SLO compliance; the tail shows continued user impact or a second fault.
2. Two responders each fixed something but the timeline shows one fix. Problem?
   - Yes. The timeline must record every action with times, or the next incident repeats the hidden work and misattributes the cure.
3. A restore drill recovers everything but the last 90 minutes with RPO 1 hour. Pass?
   - No. Loss exceeds RPO; shorten the backup interval or narrow the loss window, then re-drill.
4. Action item reads improve monitoring with no owner. Accept?
   - No. Owned, dated and verifiable, plus a regression guard; otherwise it never closes.

</details>

#### U9. Unit cost, headroom and simpler designs

**About 2 h** · **Target:** Derive

Topics: Unit cost, headroom and simpler design alternatives

Reliability without cost is a wish. This unit turns the saturation and capacity numbers into a provisioning choice the team can afford, and keeps the simpler design on the table.

**You can now**

- Derive per-request unit cost in the constrained resource and the provisioned headroom for a stated workload.
- Defend the design against a 10x workload change with numbers: scale, shed, degrade or simplify.
- Compare against a simpler alternative and name what the complexity buys.

**Study**

1. [Risk tolerance and the cost of reliability](https://sre.google/sre-book/embracing-risk/) (Google Site Reliability Engineering - selected core chapters) - Risk Tolerance of Services (Target level of availability; Cost); Identifying the Risk Tolerance of Infrastructure Services.
2. [Spare capacity and scaling limits](https://sre.google/workbook/managing-load/) (Google SRE Workbook - SLO, load, incident and canary exercises) - Autoscaling (Configuring Conservatively: spare capacity for overload and redundancy; Setting Constraints: minimum and maximum bounds, quota).
3. [Simplicity defense](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/python-experimental-systems-kit.md) (Python Experimental Systems Kit - measurement slice) - Design-defense questions (When should this remain a script instead of this package). Depth: Use the one question as the simpler-alternative test for your design. The full kit returns in later stages.

**Focus**

- Unit cost is per useful request in the constrained resource: 10 ms service time is 0.01 CPU-s per request, so 80 rps costs 0.8 CPU and 95 goodput rps costs 0.95 CPU.
- Headroom is provisioned over expected peak at a utilization target: 0.8 CPU at a 0.7 target provisions about 1.14 CPUs, with autoscale bounds and kill switches capping the bill when the model breaks.
- 10x (800 rps) is 8 CPU-seconds of work per second, so about 11.4 CPUs at the same 0.7 target, or shedding, degrading or removing work. Amdahl bounds splitting one request or job across CPUs: 90% parallel on 4 CPUs gives 3.08x, not 4x.
- The simpler alternative (one process, no cache, fewer moving parts) wins unless the complex design names the failure or cost it removes.

**Reproduce:** Closed-book, derive from 10 ms service and 80 rps: 0.8 CPU used, about 1.14 CPUs provisioned at a 0.7 target. Show the 10x table (800 rps is 8 CPUs busy, about 11.4 provisioned at 0.7, or shed, degrade or simplify), and the Amdahl check for parallelizing one job: 1/(0.1 + 0.9/4) = 3.07692.

**Traps**

- Pricing peak capacity at 100% utilization. Queue math forbids it; buy the headroom or buy the queue.
- Counting hosts instead of the constrained resource. Cost follows CPU-s, bytes stored and bytes moved per request, not box count.
- Letting experiment capacity become permanent. Time-box canary and load-test capacity and remove it in the rollback plan.

**Practice**

- [AlgoMaster: Calculate Amdahl's Law Speedup](https://algomaster.io/practice/system-design/calculate-amdahls-law-speedup) - AmdahlSpeedupCalculator.speedup: 1/((1 - parallelFraction) + parallelFraction/processors), rounded to 5 places (examples: 0.9 on 4 gives 3.07692). Attempt only after your own serial-fraction estimate. Compare the platform answer with the scale-out limit in your 10x defense.

**Stop when:** You derive unit cost, headroom and the 10x table without notes and can defend the simpler alternative against your design with numbers.

<details>
<summary>Self-test</summary>

1. 80 rps at 10 ms service with target rho 0.7: provision?
   - 0.8/0.7 = about 1.14 CPUs. Round up to whole CPUs, set the autoscale minimum and bound the maximum.
2. Amdahl with 0.9 parallel on 4 CPUs: speedup? What does it say about 10x load?
   - 3.07692, and never above 10x with any CPU count. That caps speeding up one job. Serving 10x more independent requests needs 10x the CPU-seconds, or less work per request, shedding or degradation.
3. A simpler single-process design handles 3x but not 10x. Keep the complex one?
   - Only with numbers: name the load where simplicity breaks, price both, and show what the complexity removes (failure domain, cost or toil).

</details>

### Mini-project: Telemetry, a load sweep through the knee, overload control and one incident

**About 12 to 16 hours.** Make the service slice measurable and keep it upright past its capacity: instrument the request path, predict the knee from measured service time, sweep through it with an open-loop generator, add overload controls, then inject one incident, recover from the runbook and write the postmortem. The SLO, capacity and 10x plan go into the dossier.

1. Instrument every request with request ID, trace context, queue wait, handler time, storage time (write plus fsync), status and bounded labels (operation, status class, protocol version). Write telemetry to JSON Lines files: one raw record per request kept for the whole run, plus counters and fixed-bucket latency histograms (for example 1, 3, 10, 30 ms and so on to 3 s). Enforce a cardinality budget in a test: the product of label value counts must stay under your declared limit, so adding a client ID label fails it; client IDs live on sampled trace records only.
2. Predict before measuring. From the mean service time S measured at one worker, capacity is at most workers / S, and lower if fsync calls serialize on the one log file; batching acknowledgements behind one fsync (group commit) raises it. Write the predicted knee and the queue length Little's Law gives at 50%, 80% and 95% of that capacity.
3. Write an open-loop generator: a seeded Poisson schedule computed in advance, latency measured from the intended send time, every raw record kept. Sweep at least five offered rates from well below to past the predicted knee, drop a warm-up and repeat each rate three times. Report p50, p95 and p99 from raw samples with n, throughput, goodput, queue depth, utilization and errors, check L = lambda W against sampled queue depth, and measure recovery time after the overload stops. Run the closed-loop twin at one rate and explain why it hides the tail.
4. Write the SLO: an availability SLI (good over valid requests) and a latency SLI (the fraction under a threshold), a 30-day target with its budget (99.9% allows 43.2 minutes), the alert you would page on and the failure domains the single node shares (disk, host, power). Derive capacity at a 0.7 utilization target now and at 10x load, and what you would shed, degrade or remove instead of only adding machines.
5. Add overload controls and show each one under the same injected overload, with goodput and p99 with and without it: bounded admission with an overloaded error, client-side adaptive throttling from the client's own request and accept counts (K = 2 as in the SRE book), a per-client retry budget (the unit uses 5% of requests) with jittered backoff, a breaker on the store call whose fallback serves cached reads marked stale, and deadline propagation with cancellation.
6. Add a version flag and a canary split: send a declared fraction of requests to the new version, compare its error rate and p99 with the stable version over the same window, and roll back automatically when either crosses its threshold. Test the rollback with a deliberately slow version.
7. Inject one incident whose cause a script picks from a seeded list, so you do not know it in advance: a corrupted log record, slow fsync from a container started with --device-write-bps, or a bad canary. Work it from the telemetry and the runbook: a timeline with detection, diagnosis, mitigation and recovery times, a restore from the last verified backup with measured RTO and counted RPO loss (writes acknowledged after the backup), a blameless postmortem with owned actions and one merged regression guard.

**Deliverables**

- The instrumented service with telemetry files, the cardinality test and a script that renders percentiles and queue depth from the raw records.
- The load sweep: prediction, raw records, the table at every rate, the Little's Law check and the closed-loop comparison.
- The overload-control and canary experiments, each with numbers with and without the control.
- The SLO and capacity page and the incident package: timeline, runbook, restore evidence with RTO and RPO, postmortem and regression guard.

**Checks**

- rubric: Self-grade with the rubric below.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Telemetry | Every request has a raw record with request ID, queue wait, handler and storage time and status, and the cardinality test fails on an unbounded label. | Percentiles come only from raw samples or merged histogram counts, never from averaged percentiles, and the report says which. |
| Load and capacity | The knee was predicted before the sweep, and the sweep reports percentiles with n, goodput, queue depth and utilization at every rate with the Little's Law check. | The measured knee is explained against the prediction, including any fsync serialization the prediction missed. |
| Overload | Each control is shown under the same injected overload, with goodput and p99 with and without it. | The retry budget and throttle are shown stopping a retry storm that the plain retrying client starts. |
| Incident | The incident has a timeline, a runbook-driven recovery, measured RTO, counted RPO loss and a merged regression guard. | The postmortem is blameless with owned, dated actions, and the runbook was followed cold by someone else or by you a day later. |
| SLO and planning | The SLO, error budget, alert and 10x plan are written with the arithmetic shown. | The plan names the failure domains the single node shares and what the SLO cannot promise because of them. |

Feeds into: Capstone dossier: the SLO and capacity estimate against load and the telemetry-based incident. Service slice: bounded admission, deadlines and overload controls under test.

### Resource route

- **Primary - Course:** [Google Site Reliability Engineering - selected core chapters](https://sre.google/sre-book/table-of-contents/) - Read Chapters 3, 4, 6, 10, 12, 17, 19-22: risk, SLOs, monitoring, alerting, troubleshooting, reliability tests, load balancing, overload and cascading failure. Apply every concept to the same bounded RPC and store rather than inventing separate examples.
- **Required - Practice:** [Google SRE Workbook - SLO, load, incident and canary exercises](https://sre.google/workbook/table-of-contents/) - Use Chapters 2, 4, 9-11, 12, 14, 16 and 17. Define one SLO, estimate capacity, load through saturation, canary a changed version, roll it back, and write one evidence-based incident timeline.
- **Required - Reference:** [OpenTelemetry Python - metrics, logs and traces](https://opentelemetry.io/docs/languages/python/) - Instrument request ID, queue wait, handler time, storage time, status and bounded labels. Export locally, retain raw load records and verify that instrumentation does not hide the bottleneck or create unbounded cardinality.
- **Support - Practice:** [AlgoMaster System Design - quantitative and failure drills](https://algomaster.io/practice/system-design) - Use Solve Little's Law, Calculate System Availability, Plan Reliability Recovery Targets, Calculate Amdahl's Law Speedup, Analyze Capacity Bottlenecks, Simulate Partition Quorums and Audit Failure Domains only after producing your own estimates. Compare the platform answer with measured service behavior.
- **Support - Project:** [Python Experimental Systems Kit - measurement slice](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/python-experimental-systems-kit.md) - Use its artifact, bounded-pipeline, failure-injection, profiling and reproducibility requirements as the evidence checklist. Reuse the current service instead of building the full project again.
- **Support - Reference:** [Gil Tene - How NOT to Measure Latency (talk)](https://www.youtube.com/watch?v=lJ8ydIuPFeU) - Use for coordinated-omission vocabulary only: closed-loop testers that wait for each reply, the missing samples under queueing, and the correction concept of recording intended send time. Do not adopt wrk, hey or ab; write the small Python generator in the saturation unit instead.
- **Reference - Reference:** [M/M/1 queue - model definition and stationary analysis](https://en.wikipedia.org/wiki/M/M/1_queue) - Read Model definition (Poisson arrivals, exponential service, single server, infinite buffer, FIFO) and Stationary analysis (stability lambda < mu, rho = lambda/mu, L = rho/(1 - rho), response time 1/(mu - lambda) via Little's Law). Use the closed forms as approximations with assumptions stated, checked by your own simulation.

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

### Study units

#### U1. Security goals, trust boundaries and threat models

**About 3 h** · **Target:** Explain

Topics: Confidentiality, integrity, availability and accountability; Assets, adversaries, attack surfaces and trust boundaries; Threat models, abuse cases and residual risk

Every later unit assumes a written threat model. Without named assets and boundaries, least privilege and audit have nothing to attach to.

**You can now**

- State confidentiality, integrity, availability and accountability (every action traceable to an identity through audit) for one service, and say which one the design trades away under pressure.
- Draw assets, entry points, data flows and trust boundaries for a small RPC store.
- Write abuse cases for unauthorized mutation, cross-tenant reads and restore paths, and mark each as tested or residual risk.

**Study**

1. [Confidentiality, integrity and availability](https://google.github.io/building-secure-and-reliable-systems/raw/ch01.html) (Building Secure and Reliable Systems - selected design route) - Chapter 1, Confidentiality, Integrity, Availability: the Confidentiality, Integrity and Availability sections, plus Reliability Versus Security design considerations.
2. [Adversaries, profiles and methods](https://google.github.io/building-secure-and-reliable-systems/raw/ch02.html) (Building Secure and Reliable Systems - selected design route) - Chapter 2, Understanding Adversaries: Attacker Motivations, Attacker Profiles from Hobbyists through Insiders, Attacker Methods (Threat Intelligence, Cyber Kill Chains, TTPs), Risk Assessment Considerations.
3. [System model, threat identification and mitigations](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html) (OWASP Threat Modeling Cheat Sheet) - System Modeling; Threat Identification with Choosing a Threat Modeling Technique; Response and Mitigations; Review and Validation.

**Focus**

- Security controls can block recovery: in the Chapter 1 password-manager story, the safe combination sat in the offline password manager it was meant to unlock. Model recovery and on-call paths with the same care as attacks.
- Adversary profiles set the budget: hobbyists through nation-states plus insiders. Defenses aim to raise attacker cost, not to stop every profile.
- The system model comes first: trust boundaries, data flows, data stores, processes and external entities, then technique choice.
- Each abuse case ends as a test or an explicit residual risk. Unowned risks are the failure, not the attack.

**Reproduce:** Closed-book, sketch the trust-boundary diagram of a single-tenant key-value RPC service, list its assets and two adversary profiles, and write three abuse cases (unauthorized write, cross-tenant read, restore from backup), each ending in a test or a residual-risk sentence.

**Traps**

- Treating uptime as the whole goal. Redundancy that serves stale or wrong-tenant data keeps the service up while breaking integrity and confidentiality.
- Modeling only external attackers. Chapter 2 treats insiders, who already hold access, as an adversary profile, and the password-manager outage needed no attacker at all.
- Collecting threats without mitigations or owners. The OWASP process continues into Response and Mitigations, then Review and Validation; a list of threats is not a threat model.

**Practice**

- The section mini-project covers this: trust-boundary diagram, abuse cases and a residual-risk statement for the RPC store and its migration path.

**Stop when:** You can draw the boundary, name the adversaries, and close every abuse case as tested or accepted risk without reopening the books.

<details>
<summary>Self-test</summary>

1. A service stays up during an incident but serves one tenant's records to another. Which goals failed and which held?
   - Confidentiality and integrity failed; availability held. Uptime alone says nothing about the other two.
2. Why does Chapter 2 advise making yourself a more expensive target even against well-funded attackers?
   - Some attackers are economically motivated. Raising cost can remove the incentive even when perfect defense is impossible.
3. What must the OWASP system model make clear before threat identification starts?
   - Trust boundaries, data flows, data stores, processes and the external entities that interact with the system. These are the likely attack points that STRIDE prompts are applied to.
4. An abuse case has no test and no owner. What is it?
   - An unowned residual risk by default. Write it down as accepted risk or turn it into a test.

</details>

#### U2. Identity, authorization, least privilege and secrets

**About 4 h** · **Target:** Explain

Topics: Identity, authentication and authorization; Least privilege, scoped credentials and secure defaults; Secrets, rotation, encryption and key-lifecycle vocabulary

The threat model names who may cross each boundary. This unit builds the gates: identities for every caller including services, least-privilege defaults, and secrets handling that the password-manager story warns about.

**You can now**

- Separate identity, authentication and authorization, and place each check in a layered service call.
- Apply least privilege with small functional APIs, scoped credentials and breakglass, and state the audit cost of each exception.
- Describe secret rotation and key-lifecycle vocabulary, and say where process or container isolation stops protecting secrets.

**Study**

1. [Least privilege, risk-ranked access and breakglass](https://google.github.io/building-secure-and-reliable-systems/raw/ch05.html) (Building Secure and Reliable Systems - selected design route) - Chapter 5, Design for Least Privilege: Concepts and Terminology (Least Privilege, Zero Trust Networking, Zero Touch); Classifying Access Based on Risk; Best Practices (Small Functional APIs, Breakglass, Auditing); A Policy Framework for Authentication and Authorization Decisions.
2. [Identities, authentication, access control and boundaries](https://google.github.io/building-secure-and-reliable-systems/raw/ch06.html) (Building Secure and Reliable Systems - selected design route) - Chapter 6, Design for Understandability: Understandable Identities, Authentication, and Access Control (Identities; Authentication and transport security; Access control); Security Boundaries (Small TCBs and strong security boundaries).
3. [Authentication, access control and cryptography vocabulary](https://pages.cs.wisc.edu/~remzi/OSTEP/) (OSTEP - introductory security chapters) - Chapters 53 Intro Security, 54 Authentication, 55 Access Control and 56 Cryptography (the security chapter PDFs in the book table): credential, authorization-decision and key-lifecycle vocabulary. Depth: Use for vocabulary only. Connect process and container isolation back to the threat model and state where those boundaries do not protect the system.
4. [Secrets handling failure story](https://google.github.io/building-secure-and-reliable-systems/raw/ch01.html) (Building Secure and Reliable Systems - selected design route) - Chapter 1, On Passwords and Power Drills: the HSM smart-card restart failure and the safe combination stored in the offline password manager.

**Focus**

- Identity covers services and hardware, not only humans: the snapshot and quota call chain in Chapter 6 needs a credential at every hop.
- Small functional APIs are the auditing advantage: breakglass sessions and direct credential handouts cannot produce granular trails.
- Credentials assert identity through a protocol (password, X.509 certificate, OAuth2 token). Authorization is a separate policy decision.
- Rotation is measured work: Chapter 8 advises measuring key rotation cycles, and Chapter 9 covers rotating signing keys under rollback.

**Reproduce:** Closed-book, write the authentication and authorization policy for a two-service chain (frontend calls backend calls store): name each identity, credential type and check, scope one credential to a single operation, and describe the breakglass path plus what its audit record can and cannot show.

**Traps**

- Storing the recovery secret inside the system it recovers. The safe combination lived in the offline password manager.
- Treating authentication as authorization. A valid credential identifies the caller; the policy still decides the operation.
- Assuming containers add access control. Namespaces and cgroups isolate processes and resources; they do not authenticate callers or scope credentials.

**Practice**

- The section mini-project covers this: authenticated service boundaries, scoped credentials with expiry, and audit tests that reject over-scoped and expired credentials.

**Stop when:** You can place every identity, credential, policy check and audit point on the call chain and defend the breakglass scope from memory.

<details>
<summary>Self-test</summary>

1. A service presents a valid token for a snapshot operation it was never granted. Which check failed?
   - Authorization. Authentication succeeded; the policy decision for that operation is a separate step.
2. Why do small functional APIs improve auditing more than any log format?
   - Each call is one granular action with its parameters, so the log states exactly what happened. A broad interactive session log cannot.
3. An on-call engineer uses breakglass during an outage. What must happen after?
   - The exceptional access is audited and reviewed, and the temporary grant expires or is revoked. Breakglass is exceptional by design.
4. Where do container boundaries stop helping with secrets?
   - At identity and access: a secret mounted into the container is visible to every process that can read it. Scoping and rotation still apply inside.

</details>

#### U3. Tenant isolation, input validation and injection

**About 4 h** · **Target:** Explain + Implement

Topics: Tenant identity, isolation and cross-tenant failure paths; Input validation, injection, path and deserialization hazards

Assumes the Programming units on relational SQL queries and idempotent HTTP APIs as background. This unit takes their endpoint into the storage engine and the wire format, where one missing tenant predicate or one pickle load leaks or corrupts another tenant's data.

**You can now**

- Scope every data path by tenant identity and reject cross-tenant reads through normal, retry and cache paths.
- Replace string-built queries with parameterized queries and type-level SQL boundaries, and validate inputs with allowlists.
- Refuse native deserialization of untrusted bytes and use pure-data formats with signed envelopes where needed.

**Study**

1. [Framework enforcement, SQL injection and XSS types](https://google.github.io/building-secure-and-reliable-systems/raw/ch12.html) (Building Secure and Reliable Systems - selected design route) - Chapter 12, Writing Code: Frameworks to Enforce Security and Reliability (Example Framework for RPC Backends); SQL Injection Vulnerabilities: TrustedSqlString, from the password-reset concatenation example through bound parameters and prepared statements; Preventing XSS: SafeHtml.
2. [Security boundaries, blast radius and data isolation](https://google.github.io/building-secure-and-reliable-systems/raw/ch08.html) (Building Secure and Reliable Systems - selected design route) - Chapter 8, Design for Resilience: Controlling the Blast Radius (Role Separation, Location Separation with Isolation of trust and Isolation of confidentiality); Failure Domains and Redundancies (Failure Domains with Data isolation).
3. [Allowlist validation and parsing discipline](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html) (OWASP Input Validation Cheat Sheet) - Input Validation Strategies (Allowlist vs Denylist); Implementing Input Validation (Parse Safely, Then Validate; Validate Structured Data); Common Pitfalls (client-only checks, trusting internal sources, denylisting, logging rejected input verbatim).
4. [Safe deserialization rules](https://cheatsheetseries.owasp.org/cheatsheets/Deserialization_Cheat_Sheet.html) (OWASP Deserialization Cheat Sheet) - Python Clear-box Review (pickle.load and pickle.loads, unsafe PyYAML loaders, jsonpickle.decode); Language-Agnostic Methods (Using Alternative Data Formats, Only Deserialize Signed Data).

**Focus**

- Tenant identity is an authorization input, not a request field: the query predicate comes from the authenticated context, never from the body.
- Parameterization plus type boundaries: bound parameters separate code from data, and TrustedSqlString-style types make mixing impossible by construction.
- Validate the representation that is used: decode once per protocol, then allowlist syntax and semantics. Denylists and client-only checks do not hold.
- Native formats execute: pickle, unsafe YAML and type-driven JSON decoders run code at load time, so untrusted bytes get pure-data formats only.

**Reproduce:** In a scratch SQLite database with two tenants, run a tenant filter built by string interpolation with the value acme' OR '1'='1 and show it returns both tenants' rows; then run the parameterized tenant-scoped query and show it returns only the caller tenant's single row. Then show pickle.loads executing a planted reduce call while json.loads of the same fields returns plain data.

**Traps**

- Adding tenant checks on the main path but not on retry, cache-fill or restore paths. Every path that reads or writes tenant data needs the predicate and a test.
- Checking a deserialized object after loading it. Execution can happen during load, so the type test comes too late.
- Validating before the final decode. A downstream decode can change meaning after the check passed.

**Practice**

- The section mini-project covers this: tenant-scoped queries across normal, retry, cache and restore paths, plus injection and deserialization tests with fixed fixtures.

**Stop when:** Your scratch demo shows the bypass and the fix, and you can name every path where the tenant predicate must appear.

<details>
<summary>Self-test</summary>

1. The tenant id arrives both in the auth token and the JSON body, and they disagree. Which one scopes the query?
   - The auth token. The body is untrusted input; the predicate uses the authenticated context.
2. Why is a guideline to use prepared statements weaker than a TrustedSqlString-style type?
   - Guidelines need every developer and reviewer to comply every time. The type makes untrusted SQL construction impossible by construction.
3. A cache fills a missed entry with another tenant's row and serves it on retry. Which boundary failed?
   - Tenant isolation on the cache-fill path. Every data path carries the tenant predicate, not only the primary query.
4. Untrusted YAML arrives. Which loader, and why?
   - A safe loader that builds only plain data and blocks custom constructors, because unsafe loaders instantiate arbitrary objects.

</details>

#### U4. Audit records, fail-open versus fail-closed and supply chain

**About 3 h** · **Target:** Explain

Topics: Audit records, redaction and sensitive telemetry; Fail-open versus fail-closed behavior; Dependency and software-supply-chain risk vocabulary

Assumes the Programming unit on logs, metrics and traces (bounded labels, secret exclusion, OpenTelemetry) as background. This unit adds the audit contract around it: tamper-evident records, explicit failure defaults, and build-to-deploy provenance.

**You can now**

- Write audit records that state who did what with which parameters, and redact secrets before they reach telemetry.
- Choose fail-closed versus fail-open per operation, and defend the default when policy or time data is missing.
- Name the supply-chain control points from code review to provenance-checked deployment, and the adversary each one stops.

**Study**

1. [Collecting auditable records](https://google.github.io/building-secure-and-reliable-systems/raw/ch05.html) (Building Secure and Reliable Systems - selected design route) - Chapter 5, Best Practices: Auditing (Collecting good audit logs, Choosing an auditor); Graceful Failure and Breakglass Mechanisms.
2. [Failing safe versus failing secure](https://google.github.io/building-secure-and-reliable-systems/raw/ch08.html) (Building Secure and Reliable Systems - selected design route) - Chapter 8, Automate Responsibly: Failing safe versus failing secure (allow-all versus deny-all default ACLs when integrity is unverified).
3. [Revocation, failing open and intended state](https://google.github.io/building-secure-and-reliable-systems/raw/ch09.html) (Building Secure and Reliable Systems - selected design route) - Chapter 9, Design Principles for Recovery: Use an Explicit Revocation Mechanism (centralized revocation service, Failing open with the time-service outage example, Revoking credentials at scale); Know Your Intended State, Down to the Bytes.
4. [Supply-chain threat model and provenance](https://google.github.io/building-secure-and-reliable-systems/raw/ch14.html) (Building Secure and Reliable Systems - selected design route) - Chapter 14, Deploying Code: Threat Model (benign insiders, malicious insiders, compromised accounts); Best Practices (Require Code Reviews, Verify Artifacts, Not Just People); Advanced Mitigation Strategies (Binary Provenance, Provenance-Based Deployment Policies); Deployment Choke Points. Depth: Read for control points and vocabulary, not build-system implementation.

**Focus**

- Audit the useful parameters: small APIs make each record one granular action, while broad sessions cannot be audited meaningfully.
- Failing open trades lockout risk for attacker reuse: a revocation service that accepts stale credentials during a time-service outage revalidates revoked keys.
- Prefer cached revocation data with best-known state over timeout-and-allow. State which clock or freshness assumption each choice keeps.
- Verify artifacts, not people: reviews, tests, provenance and deployment choke points each stop a different supply-chain adversary.

**Reproduce:** Build a three-event hash-chained audit log in scratch code: show a redaction rule keeping a login token out of the chain, tamper with one record and show verification failing, and show an authorize stub denying when the policy is unloaded and allowing the same call when it is loaded.

**Traps**

- Logging secrets to make audit complete. Completeness never justifies credentials in logs; record the key id and the decision instead.
- Assuming fail-open is the reliable choice everywhere. Chapter 8 says security-critical operations should not fail open, because a denial of service alone would then weaken security; revocation keeps last-known-good data instead.
- Trusting build-time checks while deployments bypass them. Controls must reject artifacts that skip the chain.

**Practice**

- The section mini-project covers this: audit tests for unauthorized and cross-tenant attempts, plus backup and restore verification with integrity checks.

**Stop when:** You can defend the fail-open versus fail-closed default of each gate and trace one artifact from review to provenanced deployment.

<details>
<summary>Self-test</summary>

1. The certificate validity database cannot reach the time service. Why is accept-on-timeout dangerous?
   - Revoked certificates read as valid for the whole outage, and a cheap DoS on the time service extends it. Cache revocation data instead.
2. What must an audit record of a grant contain, and what must it never contain?
   - Actor, action, scope and parameters such as key id; never the secret itself.
3. A binary reaches production without passing CI. Which control failed?
   - The deployment choke point. Build checks cannot help if deployment accepts unprovenanced artifacts.
4. ACLs fail to load. What default does a reliability-first design assume, what does a security-first design assume, and which wins for a security-critical operation?
   - Allow all versus deny all. Security-critical operations should not fail open; they may degrade to a lower-cost component that applies stronger controls, not weaker ones.

</details>

#### U5. Membership inference, extraction, inversion and poisoning

**About 4 h** · **Target:** Explain + Measure

Topics: Membership inference, model extraction and inversion; Data poisoning, backdoors and training-serving exfiltration

Models exposed as endpoints leak through their outputs. This unit measures how much, with a control, before the next unit spends a privacy budget to stop it.

**You can now**

- Threat-model membership inference, extraction, inversion and poisoning for one model endpoint, and separate privacy loss from integrity loss.
- Run a loss-threshold membership attack with a non-overfit control and report AUC with sample sizes.
- Describe backdoor poisoning under a weak threat model and state the serving-side exfiltration path it opens.

**Study**

1. [Threat models, membership inference and extraction](https://dcai.csail.mit.edu/2023/data-privacy-security) (Data Privacy and Security (MIT Data-Centric AI)) - Defining security: security goals and threat models (Image prediction API, Patient risk prediction model); Membership inference attacks (Shadow training Steps 1 to 3; Metrics-based attacks: correctness, loss, confidence, entropy); Data extraction attacks (sampling plus perplexity ranking); Evaluating defenses (Kerckhoffs's principle).
2. [Aggregate disclosure attacks](https://docs.opendp.org/en/v0.15.1/theory/attacks/differencing.html) (OpenDP theory - one bounded privacy mechanism) - Differencing Attack notebook (reconstructing one income from two means); continue to the Membership and Reconstruction notebooks from the Attacks index. Depth: Read as aggregate-query attacks that motivate noise, not as model attacks. The model attacks are the lecture's sections above.
3. [Privacy-attack taxonomy and threat model](https://arxiv.org/abs/2007.07646) (A Survey of Privacy Attacks in Machine Learning) - Attack taxonomy and threat model (adversarial knowledge, assets under attack); causes of privacy leaks; defenses overview and open problems. Depth: Survey, not a textbook: read the taxonomy and one attack family end to end, and skip the per-paper catalog.
4. [Backdoor poisoning result](https://arxiv.org/abs/1712.05526) (Targeted Backdoor Attacks on Deep Learning Systems Using Data Poisoning) - Threat model (no model or training-set knowledge, small poisoning fraction, stealthy key) and evaluation (about 50 poisoning samples, above 90 percent attack success). Depth: Read the threat model and results; skip the optimization details. Defensive and conceptual only: study the poisoning pattern, never deploy a backdoor.

**Focus**

- Fix goal, access and knowledge first: the image-API and hospital examples change what black-box versus white-box even means.
- Cheap metrics beat shadow models for the demo: correctness, loss, confidence and entropy all read the same overfitting gap.
- Extraction is sampling plus membership ranking: perplexity selects the memorized sequences out of many samples.
- Empirical defenses are claims until attacked: Kerckhoffs-style evaluation tries to break the defense before trusting it.

**Reproduce:** With CPython 3.14.4, scikit-learn 1.9.1 and NumPy 2.5.4, draw 500 points from a 20-dimensional standard normal with uniform random 0/1 labels (default_rng(0)); the first 60 are members, the other 440 nonmembers. Fit a StandardScaler on the members, then train an unregularized MLP (hidden layers 128 and 64, alpha 0, max_iter 5000, random_state 0) and a LogisticRegression control with C=1e-4. Score each point by minus its loss on the true label (probability clipped at 1e-15). The memorizer gives AUC 0.865 (train accuracy 1.000, mean member loss 0.003, nonmember 2.185); the control gives 0.584 (train accuracy 0.533). Across seeds 0 to 4 the ranges are 0.865 to 0.948 and 0.556 to 0.602.

**Traps**

- Reporting attack AUC without the control. Even the near-chance control scores 0.556 to 0.602, so the gap, not the level, is the evidence.
- Reading the lecture's correctness-attack intuition as written. Its text swaps train and test: the model classifies most of its training data correctly and a smaller fraction of unseen data, and the attack exploits that gap.
- Treating a weakened attack demo as protection. Regularization and output rounding only narrow the gap until a stronger attack is tried.

**Practice**

- [MIT Data-Centric AI: Lab - Membership Inference notebook](https://github.com/dcai-course/dcai-lab/blob/master/membership_inference/Lab%20-%20Membership%20Inference.ipynb) - Lab - Membership Inference notebook: black-box membership inference against a given prediction function. Do the loss-threshold variant first with a control model, then try one stronger variant. Report AUC with member and nonmember counts.

**Stop when:** You can run the attack with its control, quote both AUCs with sample sizes, and threat-model one endpoint across all four attack families.

<details>
<summary>Self-test</summary>

1. What does a loss-threshold attack output, and how is the threshold picked?
   - Member when the point loss is below tau. Tau can come from published train-loss statistics; the demo avoids picking one by reporting threshold-free AUC.
2. Why does extraction rank samples by perplexity?
   - Memorized sequences get high predicted probability token by token, hence low perplexity. Sampling proposes candidates; ranking selects likely members.
3. A defense drops the attack AUC from 0.9 to 0.6. Is the leak fixed?
   - Not shown. A new attack or more queries can reopen it; only a budgeted guarantee bounds all attacks in the threat model.
4. How do poisoning and inversion differ in what they break?
   - Poisoning breaks integrity by planting behavior through training data; inversion breaks privacy by recovering inputs through outputs.

</details>

#### U6. Differential privacy: adjacency, sensitivity, noise and composition

**About 5 h** · **Target:** Derive + Implement

Topics: Differential privacy adjacency and unit of privacy; Sensitivity, clipping, epsilon, delta and calibrated noise; Composition, subsampling intuition and accounting inputs; Privacy utility trade-offs and unprotected system boundaries

The only privacy claim in this stage with a proof. Everything outside the stated mechanism, adjacency and budget keeps no promise.

**You can now**

- Define adjacency, unit of privacy, sensitivity and the (epsilon, delta) guarantee for one aggregate.
- Build a clamped Laplace release, derive its epsilon from sensitivity over scale, and compose two releases.
- Measure utility loss against the true aggregate and list every component outside the guarantee.

**Study**

1. [Adjacency, sensitivity and privacy maps](https://docs.opendp.org/en/v0.16.0/api/user-guide/framework-api/a-framework-to-understand-dp.html) (OpenDP theory - one bounded privacy mechanism) - A Framework to Understand DP: Distance Between Datasets - Adjacency (symmetric distance); Definition of Privacy; Distance Between Aggregates - Sensitivity (clamped sum); Stability Maps and Privacy Maps (chained Laplace sum with epsilon 0.48).
2. [Clamp, sum and Laplace chaining in code](https://docs.opendp.org/en/v0.16.0/api/user-guide/framework-api/dp-with-opendp.html) (OpenDP theory - one bounded privacy mechanism) - Differential Privacy with OpenDP: The Laplace Mechanism; Transformation Example: Sum; Transformation Example: Clamp; Chaining (clamp, bounded sum and Laplace composed with the privacy map); Retrospective. Depth: Run the examples with OpenDP 0.16.0, the version these pages document. make_sequential_composition groups releases under one budget.
3. [Accuracy limits of noisy releases](https://docs.opendp.org/en/v0.15.1/theory/accuracy-pitfalls.html) (OpenDP theory - one bounded privacy mechanism) - Accuracy: Pitfalls and Edge Cases: Accuracy vs Confidence Intervals; What is D (preprocessing and resize effects on the guarantee target).
4. [The (epsilon, delta) definition and DP-SGD](https://dcai.csail.mit.edu/2023/data-privacy-security) (Data Privacy and Security (MIT Data-Centric AI)) - Towards a solution: differential privacy (the (epsilon, delta) inequality over adjacent datasets; DP-SGD as the training analogue; parameter-setting and utility challenges).

**Focus**

- Adjacency is the whole promise: symmetric distance 1 means adding or removing one record, and multi-row contributors scale the bound by k.
- Clamping sets sensitivity before noise means anything: with bounds (0, 10) one record moves the sum by at most 10, so Laplace scale 10 buys epsilon about 1.
- Chaining multiplies the reasoning: the clamp map fed into the noise map gives the release map, and sequential composition adds epsilons across releases.
- Accuracy utilities bound noise error only: the guarantee covers the release minus the true aggregate, never the sample minus the population.

**Reproduce:** With OpenDP 0.16.0 (contrib enabled) on CPython 3.14.4, chain clamp to (0, 10), sum and Laplace scale 10 over float vectors under symmetric distance. map(1) returns 1.000000009313226: the sum reports sensitivity 10.00000009313226 to cover float rounding, and the Laplace map alone turns 10 into exactly 1.0. Draw 200 values uniform on [0, 10] with NumPy default_rng(7) (true clamped sum 1005.9) and make 2000 releases. OpenDP draws noise from its own unseeded generator, so the mean absolute error changes per run: three runs gave 9.79, 9.96 and 10.03 against the Laplace mean absolute deviation of 10 (standard error about 0.22). Then derive that two such releases compose to epsilon about 2.0.

**Traps**

- Quoting epsilon without adjacency, bounds and delta. The number is meaningless until the unit of privacy and the clamp are stated.
- Reading accuracy output as a confidence interval for the population. It covers noise around this dataset aggregate only.
- Assuming the guarantee covers the pipeline. Ingestion, bounds choice, budget accounting and the served model sit outside unless each is modeled.

**Practice**

- The section mini-project covers this: one clipped and noised aggregate with stated adjacency, epsilon and delta inputs, measured utility and a residual-risk statement.

**Stop when:** You can derive epsilon from bounds and scale, quote measured error with its setup, and name everything the guarantee excludes.

<details>
<summary>Self-test</summary>

1. Bounds are (0, 10) and one person contributes one row. What is the clamped-sum sensitivity?
   - 10. Removing or adding one clamped record changes the sum by at most the clamp range.
2. Scale is 10 and sensitivity is 10. What epsilon, and what changes with scale 5?
   - About 1.0. Scale 5 doubles it to about 2.0 and halves the noise: epsilon equals sensitivity divided by scale.
3. Two epsilon-1.0 releases run on the same data. What is the pair budget?
   - About 2.0 by basic sequential composition. Each release spends separately against the same adjacency.
4. Delta is 0 for this Laplace release. What does delta allow in general?
   - An additive slack in the guarantee, informally a small probability that the epsilon bound does not hold, as with the Gaussian mechanism. Pure Laplace keeps delta at 0.

</details>

#### U7. Compatibility, rollback and revocation during changes

**About 3 h** · **Target:** Explain

Topics: Schema and protocol compatibility during migration; Canary, rollback, backup, restore and revocation under auth changes

Assumes the Programming units on schema migrations with Alembic and idempotency-key ledgers as background. This unit adds the failure-aware half: rollback that does not revive vulnerabilities, revocation that works during outages, and restores that keep tenant boundaries.

**You can now**

- State compatibility rules for schema and protocol changes, and gate rollout on explicit version signals.
- Plan canary, rollback and backup-restore so a bad release or a revoked credential cannot strand the system.
- Carry tenant isolation, audit and privacy accounting across migration and restore paths.

**Study**

1. [Change speeds and architecture for change](https://google.github.io/building-secure-and-reliable-systems/raw/ch07.html) (Building Secure and Reliable Systems - selected design route) - Chapter 7, Design for a Changing Landscape: Types of Security Changes; Architecture Decisions to Make Changes Easier (Keep Dependencies Up to Date, Release Frequently); Different Changes: Short-Term Change (Shellshock), Medium-Term Change (FIDO keys), Long-Term Change (HTTPS).
2. [Rollback trade-offs and revocation](https://google.github.io/building-secure-and-reliable-systems/raw/ch09.html) (Building Secure and Reliable Systems - selected design route) - Chapter 9, Design Principles for Recovery: Rollbacks Represent a Tradeoff (Deny lists, Minimum Acceptable Security Version Numbers, Rotating signing keys); Use an Explicit Revocation Mechanism (Handling emergencies directly, Revoking credentials at scale); Know Your Intended State, Down to the Bytes.
3. [Deployment policy and breakglass](https://google.github.io/building-secure-and-reliable-systems/raw/ch14.html) (Building Secure and Reliable Systems - selected design route) - Chapter 14, Deploying Code: Provenance-Based Deployment Policies (Implementing policy decisions); Post-Deployment Verification; Practical Advice (Take It One Step at a Time, Include a Deployment Breakglass).

**Focus**

- Different changes move at different speeds: zero-days, posture improvements and external demands each get their own timeline and test budget.
- Rollback trades reliability against security: minimum version numbers, deny lists and key rotation stop a rollback from reviving holes.
- Revocation must work while hurt: cached revocation lists beat fail-open timeouts, and emergencies go through the same list mechanism, not hand-edited key files or a rarely used emergency list.
- Know the intended bytes: host, firmware and data state are declared before migration so verification has something to compare.

**Reproduce:** Closed-book, write the migration plan for a versioned RPC store: a compatibility table for one schema change, canary and rollback triggers, a revocation step that works with the time service down, and a restore check that re-verifies tenant predicates and the DP accounting inputs.

**Traps**

- Rolling back to a version with a known hole to fix an outage. Minimum acceptable versions exist for exactly this moment.
- Depending on accurate time during revocation. Clocks are an external dependency; cached revocation data removes it.
- Migrating privacy bounds or budgets silently. Bounds, epsilon and delta inputs and the spent budget are versioned configuration and state, not code constants.

**Practice**

- The section mini-project covers this: canary and rollback drill, backup-restore verification, and a revocation check under a failed dependency.

**Stop when:** You can walk a schema change from canary through rollback or revoke without dropping isolation, audit or budget accounting.

<details>
<summary>Self-test</summary>

1. A rollback fixes availability but revives a patched injection. What control should have stopped it?
   - A minimum acceptable security version number. Rollback targets below it are refused even in an outage.
2. Why does the book prefer cached revocation lists over fail-open on timeout?
   - Cached lists keep the best-known deny state without a live dependency. Fail-open revalidates revoked credentials for the whole outage.
3. What does a canary buy that a fast full rollout does not?
   - A bounded blast radius: production signals from a small slice before full exposure. A fast rollout can be right for an actively exploited zero-day, but it gives up that check.
4. A restore brings back last month's tenant table. What must the restore check?
   - Tenant predicates, credential validity and accounting inputs against current versions. Restored data must not widen access or budgets.

</details>

### Mini-project: Threat model, least-privilege tests, a privacy-bounded aggregate and a safe migration

**About 12 to 16 hours.** Set the trust boundary of the service slice and test it: a threat model of the store and its migration path, scoped credentials with expiry, tenant isolation on every path, a hash-chained audit log, verified backups, one differentially private aggregate with its limits stated, and a canary migration with rollback and revocation under a failed dependency.

1. Draw the system model: client, proxy, server, store, catalog, backups and the migration job, with trust boundaries, data flows, data stores, processes and external entities. List the assets and two adversary profiles, one an insider with backup access. Write abuse cases for unauthorized mutation, cross-tenant reads, stale credentials, sensitive logs and restore or migration paths; each ends in a test or an explicit residual-risk sentence.
2. Authenticate every request with a credential issued per client: a token carrying tenant, scopes (read, write, admin) and expiry, signed with HMAC-SHA256 under a server key. The issuer refuses scopes the client's policy does not allow, and the server checks the signature with hmac.compare_digest, the expiry on its own clock with a declared skew allowance, and the scope for the operation. Tests reject missing, forged, expired, out-of-scope and wrong-tenant credentials, and admin operations need a separate, logged credential.
3. Make the tenant part of every key and query, taken from the authenticated credential and never from a request field: the store prefixes keys by tenant, idempotency keys are scoped by tenant and client, and catalog queries are parameterized and tenant-scoped. Test cross-tenant reads and writes on the normal path, the retry path (a retried write whose idempotency key matches another tenant's must not replay that tenant's response), the stale-read fallback and the restore path. Keep the injection fixture (acme' OR '1'='1 returns both tenants when interpolated, one row when parameterized) and a test that the protocol never unpickles input.
4. Write security events (authentication failures, scope denials, cross-tenant attempts, admin actions) to a hash-chained audit log in which each record holds the hash of the previous one and tokens are redacted before hashing. Test that every rejected attempt from the previous steps leaves exactly one audit record and that editing or deleting a record fails verification. When the authorization policy cannot load, deny, and write down what that costs in availability.
5. Back up the store and catalog with a manifest of SHA-256 digests, restore into a fresh directory and database, and verify digests, the record count from the log, tenant predicates and the audit chain before serving. Test that a corrupted backup is refused.
6. Release one differentially private aggregate from the usage data, such as total writes per day across tenants with each tenant's daily count clamped. With OpenDP 0.16.0, state the privacy unit and adjacency (one tenant-day added or removed), clamp bounds, sensitivity, noise scale, epsilon, delta and the budget spent across releases, kept in a ledger that blocks a release over budget. OpenDP noise is not seeded, so measure utility over at least 1000 releases in several runs and report the spread. Write the residual-risk statement: values lost to clamping, releases beyond the budget, and data outside the privacy unit.
7. Migrate the record format from v1 to v2 behind a canary: read both versions, write v2 only for the canary fraction, compare error rate and p99, and roll back with v1 readers still able to read every record written. Practise the rollback once on purpose. Then revoke a credential while the issuer is down: the server keeps enforcing its cached revocation list instead of failing open, and a test shows the revoked token rejected during the outage.

**Deliverables**

- dossier/security/: the threat model diagram, assets, adversaries, abuse cases and residual risks.
- The credential, tenant-isolation, injection, deserialization and audit tests, passing, with the failing output each was written against.
- The backup and restore verification script with a refused corrupted backup.
- The private release: code, parameters, budget ledger, utility measurements and the residual-risk statement.
- The migration drill: canary numbers, the rollback and the revocation test under a failed dependency.

**Checks**

- rubric: Self-grade with the rubric below.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Threat model | Every abuse case ends in a passing test or a residual-risk sentence, and the model covers backup, restore and migration paths. | The insider case names what the audit log can and cannot show about it. |
| Least privilege | Missing, forged, expired, out-of-scope and wrong-tenant credentials are rejected by tests, and the admin path is separate and logged. | Tenant scope comes from the credential on every path, with tests for the retry, cache and restore paths as well as the normal one. |
| Integrity | The audit chain detects an edited or deleted record, tokens are redacted, and a corrupted backup is refused before serving. | Restore verification checks tenant predicates and the audit chain, not only file digests. |
| Privacy | The release states unit, adjacency, clamp, sensitivity, epsilon, delta and spent budget, with measured utility. | The residual-risk statement names concrete cases outside the guarantee, and the ledger blocks an over-budget release. |
| Safe evolution | The canary migration ran with a rollback that left every record readable, and revocation held while the issuer was down. | The drill has a timeline, and the rollback fired from metrics rather than by hand. |

Feeds into: Capstone dossier: the threat model, least-privilege tests, safe migration and rollback, and the bounded private aggregate with its limits.

### Resource route

- **Primary - Course:** [Building Secure and Reliable Systems - selected design route](https://google.github.io/building-secure-and-reliable-systems/raw/toc.html) - Read Chapters 1, 2, 4-9 and 12-14: adversaries, trade-offs, least privilege, understandability, changing landscapes, resilience, recovery, code, tests and deployment. Apply the chapter questions to the same RPC, store, tenant and migration boundary.
- **Required - Theory:** [OpenDP theory - one bounded privacy mechanism](https://docs.opendp.org/en/v0.15.1/theory/index.html) - Read A Framework to Understand DP and Differential Privacy with OpenDP (in the 0.16.0 user guide, Framework API), then Accuracy: Pitfalls and Edge Cases and the Differencing, Membership and Reconstruction attack notebooks. Define one privacy unit, clamp an aggregate, add calibrated noise, record epsilon and delta inputs, measure utility and list everything outside the guarantee.
- **Required - Reference:** [OWASP Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html) - Model trust boundaries, data flows, data stores, processes and external entities, and list the assets they carry. Write misuse cases for unauthorized mutation, cross-tenant reads, stale credentials, sensitive logs and restore or migration paths, then turn each into a test or explicit residual risk.
- **Support - Theory:** [OSTEP - introductory security chapters](https://pages.cs.wisc.edu/~remzi/OSTEP/) - Use Chapters 53-56 for introductory security, authentication, access control and cryptography vocabulary. Connect process and container isolation to the threat model and state where those boundaries do not protect the system.
- **Support - Assessment:** [Systems Foundations Checkpoint - security and privacy slice](https://github.com/saisandeshk/Roadmap-Final/blob/main/checkpoints/systems-foundations.md) - Use only the tenant-access, privacy aggregate, abuse, migration, backup and residual-risk requirements as the final assessment. A toy privacy mechanism is evidence for its stated aggregate, not a claim that the service or model is private.
- **Support - Course:** [Data Privacy and Security (MIT Data-Centric AI)](https://dcai.csail.mit.edu/2023/data-privacy-security) - Read the threat-model examples, shadow-training and metrics-based membership attacks, extraction by sampling plus perplexity ranking, empirical-defense evaluation, and the (epsilon, delta) definition with DP-SGD.
- **Support - Theory:** [A Survey of Privacy Attacks in Machine Learning](https://arxiv.org/abs/2007.07646) - Use the attack taxonomy and threat model (adversarial knowledge, assets under attack) plus the causes of leaks and the defenses overview; skip the per-paper catalog.
- **Support - Theory:** [Targeted Backdoor Attacks on Deep Learning Systems Using Data Poisoning](https://arxiv.org/abs/1712.05526) - Read the weak threat model (no model or training-set knowledge, about 50 poisoning samples) and the reported result of above 90 percent attack success; skip the optimization details.
- **Support - Reference:** [OWASP Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html) - Apply allowlist validation, parse-safely-then-validate, structured-data rules, and the common pitfalls (client-only checks, trusted internal sources, denylisting, logging rejected input).
- **Support - Reference:** [OWASP Deserialization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Deserialization_Cheat_Sheet.html) - Apply the Python clear-box rules (pickle, unsafe YAML loaders, jsonpickle) and the language-agnostic methods (pure-data formats, signed data).

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

**Capstone rubric** (about 10 to 14 hours)

| Criterion | Pass | Strong |
| --- | --- | --- |
| Mechanisms laboratory | make check rebuilds every lab experiment from a clean clone and asserts its check; the process, page, file durability, bounded queue, concurrency failure and container limit cases each keep raw output and environment. | Each timing claim names its oracle, pinning and repeats, and says what it did not test. |
| Fault-tested service slice | One command runs the service tests: framing and the fault matrix, deadlines, retries and idempotency, bounded admission and drain, and crash recovery against the acknowledged-prefix oracle, all with replayable schedules. | The restart row of the fault matrix passes on durable state, and a schedule found by a random seed is kept as a regression. |
| Invariants under failure | The active-admin transaction rule and the atomic effect-plus-offset rule each hold under injected failures, with a seeded failing version kept beside each. | The README states the failure model each invariant was tested under and what lies outside it. |
| Distributed contract | The dossier's distributed history has one permitted and one rejected case checked by the checker, with configuration IDs and fencing tokens recorded. | Every sentence of the contract points to the scenario that supports it. |
| Operations | The SLO, the predicted and measured knee and the 10x plan agree or the difference is explained, and the incident has measured RTO, counted RPO, a postmortem and a regression guard. | The 10x plan says what would be shed or degraded and why, with the arithmetic. |
| Trust and privacy | The threat model, least-privilege and tenant tests, the migration drill and the private release with its limits are in the dossier, and their tests pass. | The residual-risk statements are specific enough for a reviewer to write the missing test. |

