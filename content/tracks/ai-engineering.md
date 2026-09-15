<!-- Generated from content/curriculum.json. Edit the JSON and run npm run content:generate. -->

# 03. AI Engineering & Agentic Systems

**Level:** Advanced specialization  
**Scope:** 8 track stages · 151 required topics · 27 optional, depth, or later topics

Build dependable AI products around probabilistic models: typed model and tool contracts, evaluation, permission-aware retrieval, durable workflows, bounded agents, deterministic security controls, and measured production operations.

## Order

AI-1. Model and Context Contracts
AI-2. Evaluation and Trace-Driven Development
AI-3. Retrieval and Grounded Generation
AI-4. Tools and Durable State
AI-5. Bounded Agents and Memory
AI-6. Application Security and Human Control
AI-7. Operations, Routing and Economics
AI-8. Production Integration and Extension

## AI-1. Model and Context Contracts

**Why:** A model call is an unreliable dependency with probabilistic behavior. This stage makes requests, streams, refusals, context selection, privacy and failure behavior typed, versioned and replayable before any retrieval or agent loop is added.

### Learn this much

- [ ] Model capability, context construction, orchestration and product policy as separate owners _(Required)_
- [ ] Message roles, instruction precedence and untrusted data boundaries _(Required)_
- [ ] Provider, model, snapshot, template and schema identity _(Required)_
- [ ] Sampling controls, context budget, output budget, latency deadline and cost ceiling _(Required)_
- [ ] Structured output and tool-request contracts with strict schema validation _(Required)_
- [ ] Streaming event state machines, partial output and incremental validation _(Required)_
- [ ] Refusal, stop, truncation and finish-reason classification _(Required)_
- [ ] Normalized transport, rate-limit, timeout, schema and model-behavior errors _(Required)_
- [ ] Bounded retry, backoff, deadlines, cancellation and retry safety _(Required)_
- [ ] Provider and local-model adapters behind one narrow interface _(Required)_
- [ ] Prompt templates, examples, changelogs and rollback _(Required)_
- [ ] Authorized context sources, provenance and version linkage _(Required)_
- [ ] Context selection, ordering, relevance and instruction collision _(Required)_
- [ ] Token accounting, explicit truncation policy and lost-information tests _(Required)_
- [ ] Conversation state, compaction, stale turns and state reconstruction _(Required)_
- [ ] Redaction, retention, tenant scope and sensitive trace handling _(Required)_
- [ ] Deterministic fake models for success, refusal, invalid schema, timeout and partial streams _(Required)_
- [ ] Replayable request, response and context manifests with secrets removed _(Required)_
- [ ] Locked-evaluation comparison of interface and context variants _(Required)_
- [ ] Prompt-prefix caching and cache-safe context layout _(Optional)_
- [ ] Provider-specific event, schema and compatibility edge cases _(Depth)_
- [ ] Multimodal context and real-time interaction contracts _(Later)_

### Resource route

- **Primary - Book:** [AI Agents in Depth](https://github.com/bojieli/ai-agent-book/blob/main/docs/en/README.md) - Read Chapter 1, especially the agent, workflow, harness and guardrail distinctions, then Chapter 2 on API messages, the tool loop, production prompts, injection, dynamic context, compression and isolation. Implement the chapter ideas behind your own typed gateway instead of adopting a framework abstraction.
- **Required - Handbook:** [AI Engineering Handbook](https://ai-eng.handbook.academy/curriculum/) - Study Part 2 Working with Model APIs and Part 5 Context Engineering. Cover calling models, streaming, structured outputs, function tools, errors, retries, fallbacks, model choice, gateways, prompt caching, context assembly and context compression. Skip the transformer overview already owned by LLM Foundations.
- **Required - Article:** [Effective Context Engineering for AI Agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) - Study context as a finite resource, just-in-time retrieval, compaction, note taking and context isolation. Convert the advice into explicit selection and truncation policies, then test where each policy loses decisive information.
- **Support - Course:** [AlgoMaster AI Engineering](https://algomaster.io/learn/ai-engineering/course-roadmap) - Use the selected LLM API, prompting, context-window, structured-output and function-calling lessons from the authenticated course. Treat them as the application-oriented first implementation pass and keep the stricter versioning, replay and chaos checks in this stage.
- **Support - Reference:** [The Hitchhiker's Guide to Agentic AI](https://arxiv.org/abs/2606.24937) - Use Chapter 18, especially the harness, context, tool, state and error-recovery sections, to audit the gateway boundary after it works. This is a reference slice, not a cover-to-cover assignment.
- **Reference - Specification:** [JSON Schema Learn](https://json-schema.org/learn/getting-started-step-by-step) - Use the step-by-step schema guide and referenced specification while designing request, structured-output and tool schemas. Test additional properties, unions, nullability, evolution and invalid payloads instead of relying on provider examples alone.

### Exit checkpoint

Build a typed model gateway and versioned context compiler, then replay success, refusal, malformed output, partial stream, timeout, cancellation and version-drift cases while tracing every retained token to an authorized source.

<details>
<summary>Deliberately left for later</summary>

- Transformer internals, tokenization and decoding mechanisms already owned by LLM Foundations
- Exhaustive mastery of every provider SDK and proprietary event format
- Multimodal streaming, voice interaction and very-long-context infrastructure

</details>

## AI-2. Evaluation and Trace-Driven Development

**Why:** Probabilistic systems need task success defined before iteration. This stage builds a versioned harness that separates component failures, records complete trials, calibrates imperfect graders and turns evidence into release decisions.

### Learn this much

- [ ] Task contracts, environment outcomes and observable success criteria _(Required)_
- [ ] Evaluation items, repeated trials, transcripts, traces and final environment state _(Required)_
- [ ] Golden sets, representative sampling and real failure traces _(Required)_
- [ ] Long-tail, adversarial, unanswerable, unauthorized and recovery slices _(Required)_
- [ ] Component, trajectory and end-to-end evaluation boundaries _(Required)_
- [ ] Exact checks, schema checks, executable verifiers and state-based graders _(Required)_
- [ ] Rubric and pairwise model judges with explicit failure assumptions _(Required)_
- [ ] Human review, adjudication and reviewer agreement _(Required)_
- [ ] Judge position, length, style, identity and verbosity bias _(Required)_
- [ ] Automated grader calibration against deterministic or human subsets _(Required)_
- [ ] Repeated trials, variance, pass-at-k misuse and uncertainty _(Required)_
- [ ] Dataset, grader, harness, prompt and model versioning _(Required)_
- [ ] Item-level inputs, outputs, tool calls, outcomes, scores and failure labels _(Required)_
- [ ] Failure taxonomy and model, context, retrieval, tool, state or grader attribution _(Required)_
- [ ] Baseline variance, minimum meaningful change and regression thresholds _(Required)_
- [ ] Primary quality outcome with safety, latency, cost and schema guardrails _(Required)_
- [ ] Seeded bad variants that test whether the suite detects regressions _(Required)_
- [ ] Continuous evaluation, release gates and rollback decisions _(Required)_
- [ ] Online outcomes, feedback collection and distribution shift _(Optional)_
- [ ] Stateful simulated users and controllable task environments _(Optional)_
- [ ] Benchmark leakage, evaluator overfitting and saturation _(Depth)_
- [ ] Novel judge training, benchmark leadership and evaluator research _(Later)_

### Resource route

- **Primary - Course:** [AlgoMaster AI Engineering - Evaluation Units](https://algomaster.io/learn/ai-engineering/agent-evaluation-and-testing) - Complete Evaluating RAG Systems and Agent Evaluation and Testing. Build the trajectory schema, adversarial items, versioned scorecard and CI gate described there. Add repeated trials, grader calibration and seeded bad variants required by this stage.
- **Required - Book:** [AI Agents in Depth - Chapter 7](https://github.com/bojieli/ai-agent-book/blob/main/docs/en/README.md) - Read Chapter 7 on environments, datasets, judges, statistical significance, observability, ablations, A/B tests, feature flags, prompt sensitivity, privacy-aware analytics and simulation. Use the companion experiments selectively to test your own harness.
- **Required - Article:** [Demystifying Evals for AI Agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) - Study the task, trial, grader, transcript, outcome, harness and suite distinctions. Apply the guidance on multiple graders, environment state, repeated trials and failure analysis to one multi-step task.
- **Support - Handbook:** [AI Engineering Handbook - Evaluation](https://ai-eng.handbook.academy/curriculum/) - Study Part 4 Evaluation Fundamentals and the evaluation, judge, regression, online testing, tracing and feedback chapters in Part 8. Use its taxonomies to check coverage, while keeping raw item-level artifacts as the source of truth.
- **Reference - Toolkit:** [Inspect AI](https://inspect.aisi.org.uk/) - Read the task, dataset, solver, scorer, model and log documentation. Either implement one small suite in Inspect or map your independent harness to the same contracts; do not make toolkit fluency the checkpoint.
- **Depth - Benchmark:** [tau-bench](https://github.com/sierra-research/tau-bench) - Inspect the task environment, policy constraints and state-based grading after your smaller harness passes. Reuse at most a bounded task slice to study policy following and multi-turn variance; do not chase leaderboard scores.
- **Support - Assessment:** [AI Engineering and Agentic Systems Checkpoint](https://github.com/saisandeshk/Roadmap-Final/blob/main/checkpoints/ai-engineering-agentic-systems.md) - Use only the evaluation and debugging clauses as an adversarial checklist. Reserve the M5 integrated pass condition for AI-8.

### Exit checkpoint

Build a versioned evaluation harness that detects at least three seeded bad system variants, calibrates automated graders on a trusted subset, preserves item-level traces and makes one release or rollback decision with uncertainty and guardrails.

<details>
<summary>Deliberately left for later</summary>

- General statistics and experiment design already owned by Classical ML and Applied Science
- Large public benchmark operations and leaderboard optimization
- Training new evaluator models or solving evaluator research as a separate agenda

</details>

## AI-3. Retrieval and Grounded Generation

**Why:** Retrieval only helps when evidence identity, permissions, freshness and answer attribution survive every pipeline stage. This stage builds a controlled system where relevance, citation, abstention and leakage can be measured separately.

### Learn this much

- [ ] No-retrieval baseline and evidence that retrieval is necessary _(Required)_
- [ ] Corpus, source, document, version and chunk identities _(Required)_
- [ ] Acquisition, parsing, layout, tables and metadata preservation _(Required)_
- [ ] Chunking policy, overlap, boundary choices and source lineage _(Required)_
- [ ] Embedding model, normalization, dimensions, version and drift _(Required)_
- [ ] Sparse and dense retrieval with matched candidate budgets _(Required)_
- [ ] Hybrid fusion and interpretable score combination _(Required)_
- [ ] Tenant and user filters enforced before context assembly _(Required)_
- [ ] Query rewriting, decomposition and failure amplification _(Optional)_
- [ ] Cross-encoder or model reranking with latency and recall trade-offs _(Required)_
- [ ] Context selection, ordering, deduplication and token budgets _(Required)_
- [ ] Stable claim-to-chunk citation mapping and source display _(Required)_
- [ ] Grounded generation contracts and unsupported-claim detection _(Required)_
- [ ] Unanswerable detection, abstention and calibrated fallback _(Required)_
- [ ] Freshness, update, deletion propagation and index rollback _(Required)_
- [ ] Cache keys, index versions and stale-result prevention _(Required)_
- [ ] Recall, precision, MRR, NDCG and answer-bearing evidence _(Required)_
- [ ] Citation precision, citation recall, groundedness and answer correctness _(Required)_
- [ ] Parse, chunk, retrieve, filter, rerank, context, generation and citation attribution _(Required)_
- [ ] Poisoned documents, indirect prompt injection and untrusted retrieved instructions _(Required)_
- [ ] Cross-tenant leakage and stale-permission adversarial tests _(Required)_
- [ ] Agentic retrieval and iterative evidence gathering _(Depth)_
- [ ] Distributed vector databases and web-scale ingestion _(Later)_

### Resource route

- **Primary - Handbook:** [AI Engineering Handbook - Retrieval](https://ai-eng.handbook.academy/curriculum/) - Complete Part 6 Retrieval: parsing and chunking, embeddings and vector search, hybrid search and reranking, query understanding, citations, advanced retrieval, retrieval evaluation and production RAG. Implement each stage on one controlled corpus before adding abstractions.
- **Required - Book:** [AI Agents in Depth - Knowledge Base](https://github.com/bojieli/ai-agent-book/blob/main/docs/en/README.md) - Read Chapter 3 sections on RAG, chunking, dense and sparse retrieval, hybrid search, structured knowledge, updates, agentic retrieval and contextual retrieval. Keep the memory sections for AI-5.
- **Required - Project:** [Evidence-Grounded Retrieval System](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-2/evidence-grounded-retrieval-system.md) - Implement the bounded two-tenant route first: versioned ingestion, lexical and dense retrieval, hybrid fusion, ACL filters, reranking, citations, abstention, update and deletion, stage metrics and poisoned-content tests. Treat web-scale and connector breadth as later work.
- **Support - Course:** [AlgoMaster - Evaluating RAG Systems](https://algomaster.io/learn/ai-engineering/evaluating-rag-systems) - Complete the authenticated RAG evaluation unit, including retrieval metrics, answer metrics, evaluation-set construction, RAGAS and regression scorecards. Recompute the key metrics in your own harness and retain item-level evidence.
- **Support - Reference:** [The Hitchhiker's Guide to Agentic AI - Chapter 16](https://arxiv.org/abs/2606.24937) - Use Chapter 16 for a breadth audit of retrieval, chunking, advanced and agentic RAG, evaluation and production concerns. Select only sections that close a named gap in the implementation.
- **Reference - Documentation:** [Sentence Transformers Retrieve and Re-Rank](https://www.sbert.net/examples/sentence_transformer/applications/retrieve_rerank/README.html) - Implement the documented bi-encoder retrieval plus cross-encoder reranking pattern on the controlled corpus. Measure recall before reranking and ranking quality, latency and cost after reranking.
- **Support - Case study:** [Enterprise RAG and Perplexity AI Search Case Studies](https://github.com/handbook-academy/engineering-handbook/blob/main/content/hld/part-8-case-studies/31-enterprise-rag.md) - Read the Enterprise RAG case study as the main architecture review and compare it with the Perplexity AI Search case. Identify where tenant policy, freshness, citation, latency and evaluation belong, then defend what your bounded project deliberately omits.
- **Depth - Paper:** [BEIR: A Heterogeneous Benchmark for Zero-shot Evaluation of Information Retrieval Models](https://arxiv.org/abs/2104.08663) - Read the benchmark design and heterogeneous-dataset results after the controlled corpus passes. Use one small dataset only if it tests transfer of a chosen retrieval claim; do not reproduce the full benchmark.

### Exit checkpoint

On a versioned two-tenant corpus, prove permission-safe sparse, dense and hybrid retrieval; measured reranking; grounded citations; abstention; update and deletion behavior; and stagewise failure attribution under poisoned and stale content.

<details>
<summary>Deliberately left for later</summary>

- General search-engine design and distributed index internals owned by systems tracks
- Knowledge-graph platforms, multimodal retrieval and frontier learned retrieval
- Web-scale connectors, crawling and production data-platform operations

</details>

## AI-4. Tools and Durable State

**Why:** A model may propose an action, but deterministic application code must own authority, state and effects. This stage makes tools typed and workflows recoverable across retries, approvals, crashes and ambiguous outcomes.

### Learn this much

- [ ] Model proposal versus deterministic authorization and execution _(Required)_
- [ ] Typed tool arguments, results, errors and schema evolution _(Required)_
- [ ] Tool names, descriptions, parameter fidelity and discoverability _(Required)_
- [ ] Argument normalization plus result and output validation _(Required)_
- [ ] Read-only, reversible, compensable and irreversible effects _(Required)_
- [ ] User, tenant, resource and action capability checks at execution time _(Required)_
- [ ] Explicit workflow states, events, transitions and invariants _(Required)_
- [ ] Durable intent and outcome records around side effects _(Required)_
- [ ] Operation identity, idempotency keys and duplicate delivery _(Required)_
- [ ] Timeout ambiguity, unknown outcomes and reconciliation _(Required)_
- [ ] Retry budgets, backoff, cancellation and dead-letter handling _(Required)_
- [ ] Checkpoints, resume cursors and deterministic replay _(Required)_
- [ ] Compensation and saga semantics for multi-step effects _(Required)_
- [ ] Leases, fencing and stale-worker exclusion _(Required)_
- [ ] Human approval as durable state with expiry and scope _(Required)_
- [ ] Append-only audit events and state reconstruction _(Required)_
- [ ] Kill points before and after persistence and external effects _(Required)_
- [ ] Deterministic fake tools with delay, duplicate, partial and ambiguous failures _(Required)_
- [ ] MCP host, client, server and capability negotiation _(Required)_
- [ ] MCP tools, resources, prompts, tasks and trust boundaries _(Optional)_
- [ ] Queue and event-triggered workflow integration _(Optional)_
- [ ] Workflow-engine storage and event-log internals _(Depth)_
- [ ] Consensus and multi-region durable execution _(Later)_

### Resource route

- **Primary - Project:** [Durable Tool-Using Workflow](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-2/durable-tool-using-workflow.md) - Build the reduced core through typed tools, one approval, one simulated irreversible effect, one compensable effect, capability policy, idempotency, durable intent and outcome, bounded execution and replay. Run kill tests around every persistence and effect boundary before adding an agent loop.
- **Required - Book:** [AI Agents in Depth - Tools and Asynchronous Interaction](https://github.com/bojieli/ai-agent-book/blob/main/docs/en/README.md) - Read Chapter 4 on tool design, schema fidelity, discovery, MCP and execution tools, plus the relevant asynchronous interaction and error-recovery sections of Chapter 6. Translate framework examples into explicit state and effect contracts.
- **Required - Specification:** [Model Context Protocol Specification 2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28) - Read the architecture, lifecycle, authorization and server-feature sections for tools, resources and prompts. Implement one small local server or protocol adapter, validate capability negotiation and keep application authorization outside the protocol description.
- **Support - Documentation:** [LangGraph Persistence and Interrupts](https://docs.langchain.com/oss/python/langgraph/persistence) - Study persistence, checkpointers, stores, interrupts, resume and replay. Reproduce the node-restart behavior around an interrupt and make every preceding side effect idempotent. Use the framework only after the independent state machine is understood.
- **Support - Handbook:** [AI Engineering Handbook - Agent Engineering](https://ai-eng.handbook.academy/curriculum/) - Study the Part 7 chapters on tool design, MCP and security, human review and long-running agents. Use them to audit user-facing workflow behavior and failure paths after the durable core works.
- **Support - Reference:** [The Hitchhiker's Guide to Agentic AI - Harness and MCP](https://arxiv.org/abs/2606.24937) - Use Chapter 18 sections 18.4 through 18.7 for tool, orchestration, state and recovery coverage, then Chapter 22 for MCP vocabulary and security caveats. Skip A2A and multi-agent material until AI-5 depth work.

### Exit checkpoint

Run a kill-and-replay matrix before and after every simulated effect, replay duplicate events without duplicate irreversible actions, and prove every tool call is typed, authorized, bounded, resumable or explicitly ambiguous, and auditable.

<details>
<summary>Deliberately left for later</summary>

- Consensus, replication and transaction internals already owned by Distributed Systems
- Real irreversible external actions while learning recovery semantics
- Building a general-purpose workflow engine or MCP platform

</details>

## AI-5. Bounded Agents and Memory

**Why:** Autonomy is justified only when model judgment improves outcomes enough to pay for a larger failure surface. This stage compares a bounded agent with simpler workflows while making plans, budgets, termination and memory semantics inspectable.

### Learn this much

- [ ] Workflow versus agent choice from task uncertainty and control needs _(Required)_
- [ ] Plan, act, observe, verify, replan and terminate loop _(Required)_
- [ ] Reactive, router, plan-then-execute, evaluator-optimizer and deliberative patterns _(Required)_
- [ ] Explicit states, transitions, invariants and stop reasons _(Required)_
- [ ] Hard step, token, time, cost, retry, context and side-effect budgets _(Required)_
- [ ] Termination conditions, progress measures and loop detection _(Required)_
- [ ] Tool selection, observation grounding and stale-result handling _(Required)_
- [ ] Planning, tool choice, execution and outcome evaluation as separate layers _(Required)_
- [ ] Goal, capability, context, plan, tool, state, memory and evaluator failures _(Required)_
- [ ] Deterministic and routed baselines over identical tasks and tools _(Required)_
- [ ] Working context, checkpoint state, durable memory and external knowledge _(Required)_
- [ ] Memory write policy, provenance, timestamp, scope and confidence _(Required)_
- [ ] Memory retrieval, conflict, staleness, correction and supersession _(Required)_
- [ ] Authorization, tenant boundaries and non-authoritative memory _(Required)_
- [ ] Retention, deletion and audit semantics _(Required)_
- [ ] Memory utility, privacy, poisoning and harm evaluation _(Required)_
- [ ] Sandbox, approval, escalation, cancellation and operator intervention _(Required)_
- [ ] One bounded coordinator-worker delegation with shared artifact contracts _(Optional)_
- [ ] Multi-agent topologies, shared state and coordination failure _(Depth)_
- [ ] Agent-to-agent interoperability and identity _(Depth)_
- [ ] Computer-use and GUI agents _(Later)_
- [ ] Agentic reinforcement learning and learned orchestration _(Later)_

### Resource route

- **Primary - Book:** [AI Agents in Depth](https://github.com/bojieli/ai-agent-book/blob/main/docs/en/README.md) - Revisit Chapter 1 for workflow versus autonomous agent boundaries, use Chapter 3 for user memory, selected Chapter 5 examples for long-horizon coding behavior, Chapter 9 for continual evolution and Chapter 10 for when multi-agent coordination helps or fails. Implement only one bounded loop before any delegation.
- **Required - Article:** [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents) - Study augmented models, prompt chaining, routing, parallelization, orchestrator-worker and evaluator-optimizer patterns, then the autonomous-agent section. Select the simplest pattern that meets the task and document why additional autonomy is or is not justified.
- **Required - Handbook:** [AI Engineering Handbook - Agent Engineering](https://ai-eng.handbook.academy/curriculum/) - Complete the workflow-versus-agent, workflow-pattern, agent-loop, memory/state, long-running agent and framework-choice chapters in Part 7. Treat multi-agent architectures as optional until a single-agent baseline is measured.
- **Support - Reference:** [The Hitchhiker's Guide to Agentic AI - Memory and Agent Patterns](https://arxiv.org/abs/2606.24937) - Use Chapters 17 through 20 for memory, harness, loop engineering and agent patterns. Use Chapters 23 through 25 only for a bounded skills, A2A or multi-agent depth comparison, not for required framework breadth.
- **Support - Course:** [AlgoMaster AI Engineering - Agents](https://algomaster.io/learn/ai-engineering/course-roadmap) - Complete selected tool-use, MCP, agent, architecture and agent-testing lessons. Rebuild one loop without a framework and compare it with one framework implementation under identical tasks, budgets and failure cases.
- **Support - Lab:** [No Magic - ReAct and Memory](https://github.com/no-magic-ai/no-magic/tree/main/04-agents) - Read the agent README, then trace microreact.py and micromemory.py to make state, action selection, observations and memory mechanics concrete. Use these compact scripts for mechanism inspection, not as evidence of a production LLM agent.
- **Optional - Documentation:** [LangGraph Workflows and Agents](https://docs.langchain.com/oss/python/langgraph/workflows-agents) - Implement one state graph only after the independent loop and durable-state tests pass. Inspect state transitions, reducers, checkpoint identity and traces rather than copying a prebuilt agent template.
- **Depth - Case study:** [How We Built Our Multi-Agent Research System](https://www.anthropic.com/engineering/multi-agent-research-system) - Read after the single-agent comparison. Extract the parallelization assumptions, token cost, delegation contracts and evaluator strategy, then test one small coordinator-worker variant only if your workload has independent search branches.

### Exit checkpoint

Compare deterministic, routed and bounded-agent paths on the same tasks and tools; prove hard termination and authority limits; evaluate memory utility and poisoning; then defend whether the added autonomy earns its quality, latency, cost and failure burden.

<details>
<summary>Deliberately left for later</summary>

- Unbounded autonomous systems and broad framework collection
- Multi-agent systems unless a measured single-agent bottleneck justifies delegation
- Computer-use agents, autonomous organizations and agentic RL research

</details>

## AI-6. Application Security and Human Control

**Why:** Model output, retrieved text, tool results and memory are all untrusted at a security boundary. This stage places deterministic authority outside the model, tests adaptive exploit chains and preserves meaningful human control for consequential actions.

### Learn this much

- [ ] Assets, actors, entry points, trust transitions, threats and residual consequences _(Required)_
- [ ] Direct prompt injection and instruction hierarchy attacks _(Required)_
- [ ] Indirect injection through retrieved content, files, web pages and tool output _(Required)_
- [ ] Instruction and data separation limits _(Required)_
- [ ] Secret, context, memory and cross-tenant data exfiltration _(Required)_
- [ ] Confused-deputy behavior, identity propagation and privilege abuse _(Required)_
- [ ] Excessive agency, unsafe delegation and unexpected action chains _(Required)_
- [ ] Least privilege, capability allowlists and resource-scoped authorization _(Required)_
- [ ] Tenant and user authorization independent of model output _(Required)_
- [ ] Filesystem, process, network, secret and resource isolation _(Required)_
- [ ] Untrusted tool results, output injection and display or execution boundaries _(Required)_
- [ ] Memory poisoning, stale authority and correction _(Required)_
- [ ] Model, tool, MCP server, skill and dependency supply-chain trust _(Required)_
- [ ] Content policy versus action policy and deterministic enforcement _(Required)_
- [ ] Confirmation based on impact, reversibility, uncertainty and authority _(Required)_
- [ ] Abstention, human escalation, approval expiry and cancellation _(Required)_
- [ ] Security events, redacted audit records and incident reconstruction _(Required)_
- [ ] Kill switches, containment, revocation and rollback _(Required)_
- [ ] Adaptive, encoded, multi-turn and compromised-tool attack suites _(Required)_
- [ ] Attack success, useful-task success, refusal and intervention trade-offs _(Required)_
- [ ] Model extraction and membership-style endpoint attacks _(Depth)_
- [ ] Formal privacy guarantees and sensitive-model release analysis _(Later)_
- [ ] Frontier dangerous-capability evaluation and release certification _(Later)_

### Resource route

- **Primary - Security guide:** [OWASP Top 10 for Agentic Applications 2026](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/) - Study all ten risks, then map the relevant ones to assets, trust transitions and controls in the track project. Implement and test the prompt injection, tool abuse, identity, memory, excessive-agency and cascading-failure controls; record residual risk rather than treating the list as certification.
- **Required - Course:** [AlgoMaster - Agent Sandboxing and Security](https://algomaster.io/learn/ai-engineering/agent-sandboxing-and-security) - Complete the authenticated defense-in-depth unit covering capability checks, network isolation, audit logs and kill switches. Reproduce the controls in the local workflow and attack them with stale permission, indirect injection and compromised-tool cases.
- **Required - Risk framework:** [NIST AI 600-1 Generative AI Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence) - Read the risk overview and selected Govern, Map, Measure and Manage actions relevant to data, human oversight, testing, incident response and third-party dependencies. Create a compact risk register linked to concrete controls and evidence.
- **Reference - Specification:** [MCP Security Best Practices](https://modelcontextprotocol.io/specification/2026-07-28/basic/security_best_practices) - Read the current security best-practices and authorization sections. Test confused-deputy, token handling, server trust, capability disclosure and user-consent boundaries in the small MCP integration from AI-4.
- **Support - Book:** [AI Agents in Depth - Security Slices](https://github.com/bojieli/ai-agent-book/blob/main/docs/en/README.md) - Use Chapter 1 guardrails, Chapter 2 prompt-injection material, Chapter 4 tool security and the coding-agent security section in Chapter 5. Convert design advice into executable attack fixtures and external authorization checks.
- **Support - Reference:** [The Hitchhiker's Guide to Agentic AI - Security Slices](https://arxiv.org/abs/2606.24937) - Use the security and production parts of Chapters 18, 22 and 24 for a breadth audit of harness, MCP and A2A threats. Select only controls that apply to the bounded system and verify them independently.
- **Support - Case study:** [LLM Safety and Guardrails](https://github.com/handbook-academy/engineering-handbook/blob/main/content/hld/part-9-ai-ml-system-design/08-llm-safety-guardrails.md) - Read the AI/ML system-design safety chapter and the content-moderation case study. Distinguish content classification from authorization and side-effect safety, then add the missing trust boundaries to your architecture.
- **Support - Project:** [Durable Tool-Using Workflow - Security Gate](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-2/durable-tool-using-workflow.md) - Complete the project authority, confirmation, sandbox, audit and adversarial requirements. Prove the model cannot grant permissions and that denied or ambiguous actions remain recoverable.

### Exit checkpoint

Threat-model and red-team the integrated system across retrieval, context, tools and memory; prove model text cannot grant authority; execute confirmation, escalation, containment and audit reconstruction for a high-impact scenario; and report utility loss plus residual risk.

<details>
<summary>Deliberately left for later</summary>

- Formal privacy, model extraction and inference research owned by LLM and security depth work
- Frontier dangerous-capability evaluations and organization-wide release certification
- Real secrets, unrestricted networks or consequential external actions during attack practice

</details>

## AI-7. Operations, Routing and Economics

**Why:** An AI system can be correct in a demo and fail under traffic, provider changes, retry storms, stale caches or silent quality drift. This stage operates quality, latency, reliability and cost as one measured product frontier.

### Learn this much

- [ ] End-to-end quality, latency, token, cost, retry and escalation budgets _(Required)_
- [ ] Accepted-quality goodput instead of raw request throughput _(Required)_
- [ ] Model, retrieval, tool, workflow, safety and human-intervention trace schema _(Required)_
- [ ] Trace redaction, sampling, tenant scope and retention _(Required)_
- [ ] Continuous quality signals, delayed outcomes and silent regression detection _(Required)_
- [ ] Exact cache identity across tenant, model, prompt, schema, policy and data versions _(Required)_
- [ ] Semantic cache thresholds, false hits, privacy and utility _(Required)_
- [ ] Freshness, invalidation, stampede and outage behavior _(Required)_
- [ ] Policy-driven routing by quality, latency, cost, privacy and capacity _(Required)_
- [ ] Fallback, hedging, correlated failure and quality degradation _(Required)_
- [ ] Rate limits, queues, admission control and backpressure _(Required)_
- [ ] Retry and fallback amplification under partial outages _(Required)_
- [ ] Priority-aware load shedding and degraded modes _(Required)_
- [ ] Streaming, batching and tail-latency trade-offs _(Optional)_
- [ ] Task-level SLOs, error budgets and dependency budgets _(Required)_
- [ ] Canary, shadow, release comparison and rollback _(Required)_
- [ ] Prompt, model, tool-schema and retrieval-index lifecycle _(Required)_
- [ ] Per-request accounting, quotas, spend caps and anomaly detection _(Required)_
- [ ] Load through saturation, outage injection and recovery measurement _(Required)_
- [ ] Quality-latency-cost-reliability frontier across workload slices _(Required)_
- [ ] Optimization failures and negative results from workload or quality effects _(Required)_
- [ ] Inference kernels, continuous batching and GPU serving internals _(Later)_
- [ ] Multi-region model fleet and organization-wide AI platform operations _(Later)_

### Resource route

- **Primary - Course:** [AlgoMaster AI Engineering - Production Units](https://algomaster.io/learn/ai-engineering/course-roadmap) - Complete selected application architecture, deployment, optimization, caching, routing, observability and cost lessons. For every recommendation, run one measured workload or fault case and retain the external evidence.
- **Required - Handbook:** [AI Engineering Handbook - Production AI](https://ai-eng.handbook.academy/curriculum/) - Study Part 8 tracing and monitoring, then Part 10 Production AI and the relevant Part 11 product-engineering chapters. Implement routing, fallback, caching, rollout, rollback, monitoring and spend controls against the same locked evaluation suite.
- **Required - Specification:** [OpenTelemetry GenAI Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/) - Use the current GenAI span, event and metric conventions for model calls, retrieval, tool execution, agent invocation and token usage. Record stable IDs and versions, redact sensitive input, and document any experimental fields you adopt.
- **Support - Case study:** [LLM Evaluation, Observability and Cost Design](https://github.com/handbook-academy/engineering-handbook/blob/main/content/hld/part-9-ai-ml-system-design/05-llm-evaluation-observability.md) - Read the LLM Evaluation and Observability chapter, then the LLM Cost Optimization chapter. Use the capacity and cost equations as hypotheses, validate them against your workload and record where system behavior differs.
- **Support - Case study:** [Semantic Cache and Model Router Case Studies](https://github.com/handbook-academy/engineering-handbook/blob/main/content/hld/part-8-case-studies/37-model-router-gateway.md) - Read both case studies and reconstruct their cache keys, routing policies, failure modes, SLOs and rollback paths. Implement only the smallest cache and router needed for a three-policy comparison.
- **Support - Book:** [Google SRE Books](https://sre.google/books/) - Read selected chapters on SLOs, error budgets, monitoring distributed systems, overload, cascading failures, canarying and incident response. Apply the mechanisms to task success and accepted-quality goodput rather than reproducing general SRE study.
- **Support - Course:** [Full Stack Deep Learning - LLM Bootcamp](https://fullstackdeeplearning.com/llm-bootcamp/spring-2023/) - Use selected lectures on LLMOps, deployment, monitoring, user feedback and product iteration. Compare its production workflow with your versioned evaluation and release gate; skip model-training content already owned by the LLM Research track.
- **Optional - Course:** [Made With ML](https://madewithml.com/) - Use selected testing, reproducibility, serving and monitoring lessons only where the AI Handbook leaves an implementation gap. Translate general ML production patterns to prompts, retrieval indexes, tool schemas and evaluation versions.

### Exit checkpoint

Load-test the system through saturation and a provider outage, recover from a bad prompt or model release, and produce a privacy-safe trace-backed quality-latency-cost-reliability frontier with one robust improvement and one failed optimization.

<details>
<summary>Deliberately left for later</summary>

- Inference kernels, GPU serving and distributed model-serving internals owned by the Inference track
- General observability and capacity foundations already owned by Systems
- Multi-region fleets, organization-wide FinOps and a general AI gateway platform

</details>

## AI-8. Production Integration and Extension

**Why:** The final stage combines contracts, evidence, retrieval, durable effects, bounded autonomy, security and operations in one production-like system. Mastery requires reconstructing unfamiliar code, making a consequential change and defending both positive and negative evidence.

### Learn this much

- [ ] End-to-end request, control-plane and data-plane architecture _(Required)_
- [ ] Ownership and lifecycle of prompts, models, indexes, schemas, state, memory, policy and evaluations _(Required)_
- [ ] Identity, authorization and trust transitions across every component _(Required)_
- [ ] Workflow state, external effects, retries, approvals and recovery path _(Required)_
- [ ] Offline evaluation, production signals, release gates and rollback path _(Required)_
- [ ] Reconstructing an unfamiliar AI application from code, configuration and traces _(Required)_
- [ ] Capacity, cost, failure and privacy-risk models for a stated workload _(Required)_
- [ ] A bounded modification with a falsifiable product and reliability hypothesis _(Required)_
- [ ] Contract, integration, migration and backward-compatibility tests _(Required)_
- [ ] Adversarial, crash, outage, stale-policy and rollback tests _(Required)_
- [ ] Secret-free replay of model, retrieval, tool and state behavior _(Required)_
- [ ] Controlled system change with task, safety, latency, cost and human outcomes _(Required)_
- [ ] Validation of one capacity, cost or reliability prediction _(Required)_
- [ ] Simpler workflow and two alternative architecture decompositions _(Required)_
- [ ] Ten-times load, stricter privacy and dependency-failure design variations _(Required)_
- [ ] Honest negative result, unresolved ambiguity and residual risk _(Required)_
- [ ] Tested extension to evaluation, retrieval, reliability, control or operations _(Required)_
- [ ] Clean-environment reproduction and claim-to-artifact evidence _(Required)_
- [ ] Bounded multimodal or voice extension _(Optional)_
- [ ] Research-scale agent platform and novel framework ownership _(Later)_

### Resource route

- **Primary - Assessment:** [AI Engineering and Agentic Systems Checkpoint](https://github.com/saisandeshk/Roadmap-Final/blob/main/checkpoints/ai-engineering-agentic-systems.md) - Execute the complete checkpoint now: explain ownership, derive budgets and contracts, pass versioned evaluation, prove tenant isolation and replay safety, red-team the system, measure the joint frontier, then reconstruct and modify a production-like application.
- **Required - Project:** [Evidence-Grounded Retrieval System](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-2/evidence-grounded-retrieval-system.md) - Complete any deferred project clauses needed for production-grade evidence: clean rebuild, corpus and index rollback, permission proofs, adversarial content, stage metrics, a defended non-retrieval baseline and an honest negative result.
- **Required - Project:** [Durable Tool-Using Workflow](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-2/durable-tool-using-workflow.md) - Complete the full project evidence, including crash-window replay, approval and authorization, ambiguous outcomes, bounded agent comparison, fault injection, recovery runbook and clean reproduction. Delegation remains optional and must show measured value.
- **Required - Case study:** [AI Product Architecture Case Studies](https://github.com/handbook-academy/engineering-handbook/tree/main/content/hld/part-8-case-studies) - Reconstruct the ChatGPT, Enterprise RAG, Coding Agent, Perplexity Search, Voice Agent, Content Moderation, Semantic Cache and Model Router cases from files 30 through 37. Select two relevant architectures, identify hidden assumptions and defend your design against them.
- **Support - Reference:** [AI and ML System Design Handbook](https://github.com/handbook-academy/engineering-handbook/tree/main/content/hld/part-9-ai-ml-system-design) - Use Part 9 chapters 0 through 8 as the architecture reference for serving, RAG, vector search, agents, evaluation, LLMOps, cost and safety. Trace the integrated project against the chapters and record every material omission.
- **Support - Book:** [AI Agents in Depth - Integration Review](https://github.com/bojieli/ai-agent-book/blob/main/docs/en/README.md) - Use Chapters 5 through 7 and 9 as a final review of long-running applications, interaction, evaluation and continual improvement. Select one real experiment or architectural mechanism to reproduce and modify with stronger failure evidence.
- **Support - Reference:** [The Hitchhiker's Guide to Agentic AI - Production](https://arxiv.org/abs/2606.24937) - Use Chapters 26 and 27 to audit framework, testing, observability, deployment, user interface and human-control concerns. Assign only the sections relevant to the chosen product and verify claims against official documentation.
- **Support - Handbook:** [AI Engineering Handbook - AI Product Engineering](https://ai-eng.handbook.academy/curriculum/) - Use Part 11 to connect evaluation and system evidence to product decisions, feedback and iteration. Finish with a decision memo that distinguishes model capability, orchestration, retrieval, tool, evaluator and user-experience effects.

### Exit checkpoint

Pass the full Roadmap-Final checkpoint with one production-like integrated system, a tested real-code modification, clean replay, a validated capacity or risk prediction, adversarial and rollback evidence, simpler alternatives, residual risk and an honest negative result.

<details>
<summary>Deliberately left for later</summary>

- Operating at real-user scale before the controlled system and evidence package are complete
- Foundation-model training, inference-engine internals and general distributed-platform ownership
- Broad multimodal, computer-use or multi-agent expansion without a measured product need

</details>

## Track milestone

### Grounded Durable Agent Reliability Laboratory

Carry one bounded user workflow through the entire track in a single repository and evidence chain. The system must answer from a permissioned corpus, propose and execute controlled actions through durable state, use only justified autonomy, survive attacks and failures, and support a defensible production change.

- A contract and evidence spine with a typed model gateway, versioned context compiler, controlled two-tenant corpus, no-retrieval and retrieval baselines, deterministic model and tool substitutes, a versioned evaluator, privacy-aware trace schema, manifests and seeded regression variants.
- A grounded durable agent with permission-aware retrieval, citations and abstention, typed tools, deterministic capability policy, durable intent and outcome records, approval, idempotency, crash replay, a bounded plan-act-observe loop, a memory policy and deterministic-versus-agentic comparison.
- A defense and operations dossier with adaptive attack and fault campaigns, load, outage, cache and routing tests, canary and rollback runbooks, a quality-latency-cost-reliability-security frontier, one tested real-code extension, clean reproduction, negative evidence and a skeptical architecture defense.

