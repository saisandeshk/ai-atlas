# Curriculum authoring contract

This contract keeps the Field Guide finite as it grows. It applies to every core stage and specialization track.

## Stage and section boundary

- Use the order and competency intent from `Roadmap-Final`.
- A stage may contain several sections, but each section must describe one coherent learning job.
- List the smallest complete set of topics needed to pass the checkpoint. Do not convert a textbook table of contents into the topic list.
- Mark a topic `required`, `optional`, `depth`, or `later`. Depth and Later never count as unfinished core work.
- State what is deliberately excluded so stopping feels legitimate.

## Resource selection

- Give every section exactly one `primary` resource. It supplies the coherent first pass.
- Add a `required` companion only when the primary route has a named gap.
- Use `reference` for derivation or API lookup, `support` for distinct practice or application, `optional` for prerequisite repair or intuition, and `depth` for work outside the exit gate.
- Keep several excellent resources when they perform different jobs. Remove resources that repeat the same job in the same modality.
- Name exact chapters, lectures, exercises, notebooks, or documentation pages in `use`. Never leave “take this course” as the assignment.
- Prefer official course pages, author-hosted books, primary papers, and framework documentation. Record useful local access without duplicating an existing official resource family.

## Resource intake and mapping

- Treat Resource-Survey, the Brave tabs catalog, paid libraries, and future discoveries as candidate pools. They do not define the learning order.
- Normalize every saved page into a resource family before selection. A course homepage, chapter, dashboard, pricing page, and changelog from one provider are not separate resources.
- Preserve useful subpage URLs as precise `use` targets under the family. Drop account pages, editor views, search sessions, personal chat links, release boards, and unrelated saves.
- Assign a practice platform only through named problems, collections, study plans, or projects. Never ask the learner to “do Deep-ML,” “finish AlgoMaster,” or clear an entire problem bank.
- Select practice by competency and gate. Prefer a small ordered set that exercises the exact implementation, debugging, explanation, or performance behavior being tested.
- Keep multiple high-quality resources when they serve distinct jobs such as theory, structured course, implementation practice, reference, or assessment. Do not keep two resources only because both score highly.
- Record access accurately as free, paid, mixed, account-required, or unverified. If important content needs authentication, inspect it with the user's active session before assigning it as required.
- Treat survey scores as evidence about resource quality, not as an automatic selection rule. A lower-ranked focused resource may be the best checkpoint tool for one competency.

## Authoring cadence

- Author core stages in pairs and advanced tracks one at a time, following the user's current review cadence.
- Before writing a batch, reconcile only the resource families relevant to the current stages or track and inspect any new or access-sensitive candidates.
- Complete the topic scope, exclusions, resource mapping, section checkpoints, and milestone before presenting the batch for review.
- Do not begin the next batch or track until the user reviews the current work and checks the remaining usage budget.

## Evidence and progress

- `Learned` means the learner can explain the idea and its assumptions.
- `Practised` means the learner has solved or implemented something without copying the route.
- `Passed` means the learner has met the section checkpoint under a small variation or failure case.
- Checking Practised also checks Learned. Checking Passed also checks Learned and Practised. Reversing an earlier state clears dependent states.
- Each section gets one short checkpoint. Each stage gets one small integrated milestone with concrete deliverables.

## Publishing a content change

1. Edit `content/curriculum.json`.
2. Run `npm run content:generate`.
3. Review the generated stage or track Markdown for human readability.
4. Run `npm run lint && npm run build`.
5. Check Guided route, Whole map, and Tracks in the browser at desktop and compact widths.

## Writing style

- Use hyphens. Do not use em dashes or en dashes in authored content or visible interface text.
