# Curriculum authoring contract

This contract keeps AI Atlas finite as it grows. It applies to every core stage and specialization track.

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
- Prefer official course pages, author-hosted books, primary papers, and framework documentation. Paid books and subscriptions the learner owns are valid sources: link a book to its official page, cite chapters and sections, and never say where a copy is stored.

## Resource intake and mapping

- Treat Resource-Survey, the Brave tabs catalog, paid libraries, and future discoveries as candidate pools. They do not define the learning order.
- Normalize every saved page into a resource family before selection. A course homepage, chapter, dashboard, pricing page, and changelog from one provider are not separate resources.
- Preserve useful subpage URLs as precise `use` targets under the family. Drop account pages, editor views, search sessions, personal chat links, release boards, and unrelated saves.
- Assign a practice platform only through named problems, collections, study plans, or projects. Never ask the learner to “do Deep-ML,” “finish AlgoMaster,” or clear an entire problem bank.
- Select practice by competency and gate. Prefer a small ordered set that exercises the exact implementation, debugging, explanation, or performance behavior being tested.
- Keep multiple high-quality resources when they serve distinct jobs such as theory, structured course, implementation practice, reference, or assessment. Do not keep two resources only because both score highly.
- Record access accurately as free, paid, mixed, account-required, or unverified. The value is curation data; the site does not display it. If important content needs authentication, inspect it with the user's active session before assigning it as required.
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

## Study units

A section with study units replaces "read these resources for these 20 topics" with an ordered list of cards. Each card is one study unit of about 2 to 6 hours. It tells the learner exactly what to open, how far to go, what to focus on, how to test themselves, and when to stop. The atlas still writes no textbook prose: a card points into the best existing material and adds only the guidance around it.

Units live in `content/units/<route-id>/<section-id>.json`, one file per section, so that parallel authors never edit the same file. `content/units/<route-id>/_route.json` holds the route's capstone rubric. `npm run content:generate` rebuilds `content/units/index.ts`, and the site merges the files into the curriculum at build time.

### Unit rules

- **Grouping.** Group related topics into units that form one learning job. Every required and optional topic of the section belongs to exactly one unit. Later and depth topics stay outside units.
- **Target.** State the depth the unit demands with one or more of `explain`, `derive`, `implement`, and `measure`. They follow the Roadmap-Final mastery levels: explain and derive are M2, implement is M3, and measure covers M4 debugging and measurement.
- **Outcomes.** List two to four "you can now" statements adapted from the Roadmap-Final competencies of the stage. They define the target concretely.
- **Hours.** Give an illustrative whole number of focused hours, including the practice. It is a planning hint, not a tracker.
- **Why and next.** One or two sentences on why the unit matters, and one to three links to the units or later routes that build on it.
- **Study.** Ordered items, each pointing at a resource in the section pool by `resource` ID, with a deep `url` when one exists (a notebook file, a lecture page, a video timestamp, a documentation anchor) and an exact `locator` (sections, cells, slides, minutes). Add a `depth` note only when the learner should stop partway or skip something; otherwise the locator is the depth.
- **Focus.** Two to four points that say what to pay attention to in the material.
- **Reproduce.** The one result to reproduce closed-book: a derivation, an algorithm, or a small program.
- **Traps.** Two or three misconceptions or bugs that the material does not stress.
- **Self-test.** Three to five questions with short, correct answers. They test understanding, not recall of wording.
- **Correct in principle.** Check every focus point, trap, answer and stop condition from first principles, not only against the source. Sources contain errors, and a claim about an experiment or control must say what a correct run would actually show. When a source exercise is wrong, skip it in a `depth` note and say why.
- **Practice.** Named external items: a problem, an assignment part, a notebook exercise, a lab. Never a whole platform or course. A unit may leave practice empty when the section mini-project covers it, and says so.
- **Stop when.** One observable condition for leaving the unit.
- **Fit.** The outcome of the fit check below: `kept`, `added`, or `replaced`, with a one-line note.

### Fit check and resource search

Resource-Survey scores resource quality. The fit check asks whether the located material serves this unit. It fails when:

1. **Coverage:** a required topic of the unit has no locator in the study items.
2. **Depth:** the located material does not reach the unit's target, for example a blog summary for a `derive` unit.
3. **Practice:** neither the unit nor the mini-project gives a named way to practise.
4. **Currency:** a fast-moving topic is taught with material that misses current practice.
5. **Access:** the material cannot be reached, for example behind an institutional login, or it is not on an official host. A paid book or subscription the learner owns passes.
6. **Time fit:** the located part is far longer than the unit needs, with no narrower locator.

Search for new material only after a failure, with a budget of one search pass and a few candidates. A candidate must beat the current material on the failing criterion, be opened to confirm its locator, and enter the section's `addedResources` with a role, priority, access value, and use note. Record the outcome in the unit's `fit`. "Could be slightly better" is not a failure.

### Review

Every unit file is reviewed before it merges: locators are spot-checked against the sources, every number in a reproduce step or answer is recomputed, and every conceptual claim is checked independently. [`docs/PILOT.md`](../docs/PILOT.md) records what the Stage 07 review found.

### Mini-projects and capstones

- Each section with units ends with a mini-project of an evening to a weekend. It exercises the section's units in the learner's own repository, and its pieces feed the route capstone.
- `checks` lists how the work is checked: an existing autograded suite such as a course's public tests, or the rubric alone. Atlas labs are deferred, so where no public suite exists a step asks for the learner's own tests.
- Every mini-project and capstone has a rubric: each criterion states what passing looks like and what strong work looks like. A rubric asks for the learner's own tests against an independent oracle where that applies.
- Steps stay open. Write four to seven steps of one or two sentences, about 30 words each. Each step names what to build, the independent reference it is checked against and the evidence to keep. The learner chooses inputs, shapes, seeds, sizes and tolerances, because choosing them is the skill the project trains. Steps carry no expected values, flag lists or measured results. Named public suites (a course's tests, LeetGPU or TensorTonic problems) anchor the work without solving it. `content/units/deep-learning/pytorch-foundations.project.json` is the model.
- Write for the learner's hardware, not a reference machine: "your GPU", `-arch=native`, a stated capability requirement for any feature that needs one, and a fallback for multi-GPU or newer-architecture work. Measured numbers in units are labeled examples that name the hardware and versions, never targets.

## Publishing a content change

1. Edit `content/curriculum.json`.
2. Run `npm run content:generate`.
3. Review the generated stage or track Markdown for human readability.
4. Run `npm run lint && npm run build`.
5. Check Guided route, Whole map, and Tracks in the browser at desktop and compact widths.

## Writing style

- Use hyphens. Do not use em dashes or en dashes in authored content or visible interface text.
- Write mathematical notation as LaTeX between `\(` and `\)`. The site typesets it with KaTeX, the Markdown reading copies turn it into GitHub's `` $`...`$ `` math, and `content:check` rejects a formula KaTeX cannot parse or an unpaired delimiter. Never use `$` as a delimiter: shell variables and prices use it.

### Math

- **What is math.** Variables used as math objects (including a single `\(k\)` or `\(A\)`), Greek letters, formulas, equations and inequalities, subscripts and superscripts, norms, sums, products and integrals, probabilities and expectations, asymptotic bounds such as `\(O(n \log n)\)`, and matrices stated as mathematical objects.
- **What is not.** Code stays as written: Python, NumPy, PyTorch, SQL and shell expressions, function calls, identifiers such as `np.linalg.svd` or `d_model=512`, file names and paths. So do plain numbers and percentages, units of measure, version numbers, dtypes such as float32, hardware and course names, and section, page or equation numbers in locators.
- **Conventions.** Transpose `A^\top`; norms `\|x\|_2`; `\mathbb{E}[X]`, `\operatorname{Var}(X)`, `P(A \mid B)`; `\log`, `\exp`, `\max`, `\sqrt{x}`; named operators with `\operatorname{rank}`, `\operatorname{softmax}`, `\operatorname{argmax}`; distributions `\mathcal{N}(\mu, \sigma^2)` and `\operatorname{Beta}(a, b)`; `\hat{x}` and `\bar{x}`; `\times` for dimensions and numeric products; scientific notation inside a formula as `10^{-8}`. Write an inline matrix as `\left[\begin{smallmatrix} a & b \\ c & d \end{smallmatrix}\right]`.
- **Keep the sentence outside.** Wrap the smallest complete expression, leave words and sentence punctuation outside the delimiters, and use `\text{}` only for a short label inside a formula.
- **Names inside formulas.** Set a multi-letter identifier upright with `\text{}` (`\text{dp}[i]`, `\text{n\_kv\_heads}`), never as a fake subscript such as `\text{block}_{\text{size}}`. Group thousands as `16{,}384`. Metric names such as p50 and p99 stay plain text, and a word after a number keeps its space inside the label (`100 \text{ rps}`).

### Code

Write code between backticks: `` `torch.zeros(3, 4)` ``. The site sets it in the monospace font, the Markdown reading copies keep it as code, and `content:check` rejects an unpaired backtick.

- **What is code.** Anything the learner would type or read in a program, terminal or config file: function and method calls (`` `x.t()` ``, `` `np.linalg.svd(A, full_matrices=False)` ``), identifiers, attributes and parameters (`` `max_features` ``, `` `requires_grad=True` ``, `` `x.grad` ``), statements and expressions in a language (`` `b = a` ``, `` `n*(n-1)//2` ``, `` `lo <= hi` ``), types (`` `std::span<int>` ``, `` `torch.float32` ``), shell commands and flags (`` `dig +short example.com` ``, `` `-O0 -g` ``), SQL, file names and paths, environment variables, and literal program inputs and outputs such as `` `[5, 2, 4, 7]` `` or `` `'abcde'` ``.
- **What is not.** Product, library, language and course names used as nouns (NumPy, PyTorch, PostgreSQL, CPython 3.14.4, CS336), version numbers, measured values with units, problem titles such as LC 62 Unique Paths, and anything already written as math. A formula about the mathematics is math even when code computes it; the code that computes it is code.
- **Wrap the smallest complete fragment.** Leave sentence punctuation and prose outside. Wrap separate fragments separately, not a whole sentence that mentions several.
- **Never** put an address inside backticks, a backtick inside code, or math inside code. Fields that are identifiers, addresses or commands (`id`, `url`, `resource`, `unit`, `route`, `command`) hold no markup.

### Addresses

Write a web address in prose as the bare `https://` URL, with no angle brackets or backticks. The site turns it into a link, and sentence punctuation after it is left out of the link. An address without the scheme (`algomaster.io/learn/...`) is not linked, and the content check rejects it. Prefer a `study` or `practice` item with its own `url` when the address is the thing to open.
