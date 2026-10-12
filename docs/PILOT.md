# Stage 07 pilot: study units, projects and labs

The pilot rebuilds one stage, Stage 07 LLM Foundations, to test a way of turning the atlas from a reading list into a route someone can study from day to day and prove they learned. If it works, the other stages follow the same pattern.

## What changed

Before the pilot, a section was a list of topics plus a pool of resources with use notes. That told the learner what exists, but not what to open today, how far to go, or how to know they were done.

Now each section has:

- **Study units.** One card for each 2 to 6 hours of work, 35 in all. A card states its target level (explain, derive, implement or measure, taken from the Roadmap-Final M2 to M4 levels) and its outcomes, then:
  - why it matters, and which unit or track it leads to;
  - what to open, in order, with a verified locator (section, page, notebook cell or timestamp) and a depth note only where the learner should stop early or skip part of it;
  - what to focus on, one result to reproduce closed-book, and the common traps;
  - named practice: a course test file, a notebook exercise or a platform problem, never just "the course";
  - a self-test with hidden answers;
  - a "stop when" condition, which is what the Pass box means.
- **A mini-project.** One per section. All five build up a single learner repository across the stage, and each is checked by the CS336 Assignment 1 public tests where they exist, an atlas lab for the gaps, and a pass/strong rubric.
- **A capstone rubric.** It covers the existing stage milestone, the Tokenizer-to-Cached-Generation Evidence Pack, which the mini-projects assemble.
- **An atlas lab.** `labs/llm-foundations` is a trial pytest harness in the CS336 adapter style. It checks what the public tests do not reach, such as packing masks, GQA head mapping, RoPE offsets, resume equivalence and KV-cache equivalence.

The site shows the units in place of the flat topic list for any section that has them. A "Next up" button opens the first unit not yet passed, and a link of the form `#unit-<id>` opens one unit directly. Progress counts units, and the Markdown reading copy in `content/stages/llm-foundations.md` includes everything.

## Decisions taken with the learner

- A card is a study guide with locators, not textbook prose. The atlas points into the best public material and adds only the guidance around it.
- Depth is controlled twice: a target level per unit, and depth notes per link only where needed.
- New material is searched for only when a unit fails the fit check (coverage, depth, practice, currency, access, time fit), with one bounded search pass. That added five resources across 35 units.
- Hours are illustrative. Nothing tracks time.
- The site stays public, so it links only public resources. Deep-ML's free labs qualify; its Premium projects do not, even where they match well (its "LLM Inference Mechanics" project mirrors the section 5 mini-project).
- Every mini-project and the capstone have rubrics. Harnesses were a trial, to be kept only if they earn their cost (see the verdict below).

## How the content was made

The work split across models, and every card was reviewed against its sources before merging.

| Section | Writer | Wall time | Review findings |
|---|---|---|---|
| 1 Tokenization, corpus identity and packed data | Codex (gpt-6.1-sol, medium) | 12 min | None needed. It found an arithmetic error in the Hugging Face Unigram example and steered learners around it. |
| 2 Decoder transformer mechanics | Codex (gpt-6.1-sol, medium) | 12 min | None needed. It found that a popular notebook's GQA expansion interleaves KV heads, unlike PyTorch's grouping, and taught the difference. |
| 3 Causal training and generation | Muse Spark 1.3 (xhigh) | 7 min | One conceptual error: the shuffled-label control. Three weaker items: a test-internals recall question, an overgeneralized warmup claim, and a vague answer on sampling order. |
| 4 Evaluation and model arithmetic | Muse Spark 1.3 (xhigh) | 9 min | One conceptual error: comparing perplexity across tokenizers on the same text. Two smaller fixes: the 12LD^2 estimate versus Llama 2 70B's real size, and a rounding slip. |
| 5 KV cache, prefill and decode | Muse Spark 1.3 (xhigh) | 7 min | Two conceptual errors: bitwise-equal logits from a cache, and a notebook's speculative-decoding formula that drops a token. Two smaller ones: GB versus GiB in one place, and a launch-overhead claim. |

All five writers verified locators well: every page, section and test name that was spot-checked matched the source. The difference was judgment. Codex made no conceptual errors in two sections. Muse Spark made one or two per section, each plausible on first reading and caught only by checking the claim against first principles. Muse Spark's usage is nearly unlimited, so the cheap route is Muse Spark drafts plus a mandatory review. The review cost about 10 minutes per section.

## Cost log

Codex usage is read from the account's limit counters before and after each step. Muse Spark runs on a plan with near-unlimited usage, so it is not metered here.

| Step | Writer | Wall time | Codex 5-hour window | Codex weekly |
|---|---|---|---|---|
| Cards, sections 1 and 2 (14 units) | Codex | 12 min, in parallel | +13% | +2% |
| Cards, sections 3 to 5 (21 units) | Muse Spark | 7 to 9 min each, in parallel | none | none |
| Lab harness: 125 tests, references, 21 mutants, CI | Codex | 30 min | +20% | +3% |
| Schema, site, mini-projects, capstone, review and integration | Claude (orchestrator) | the rest of one working session | none | none |
| **Pilot total** | | one working session | **33% of one window** | **5%** |

The weekly Codex budget stood at 17% when the pilot was done, so on these numbers the remaining six core stages would fit in the current week even if every one had Codex-written cards.

## Harness verdict

**Keep the harness, but only where it can earn its place.**

The lab cost about 20% of one Codex window and 30 minutes, plus about 15 minutes of review. In return:

- 125 tests that run in about 3 seconds on a laptop CPU and skip cleanly until the learner connects each section.
- A mutant audit: 21 realistic bugs, each a single wrong line such as cyclic GQA grouping, RoPE positions restarting at zero, unshifted labels, a resume that drops optimizer state, MACs counted as FLOPs, or a decode step that recomputes the prefix. Every one fails at least one test.
- Checks the CS336 public tests do not reach. One example is a known-entropy Markov corpus: validation loss must approach its entropy rate, and a loss below it exposes leaking labels. Another proves a KV cache changes cost, not logits.

Rubrics stay everywhere: they judge reports, explanations and evidence, which tests cannot. On the next stages, build a harness only when two conditions hold:

1. No public autograded suite already covers the work.
2. The contract can be stated as a few pure functions with exact answers.

Otherwise use the rubric alone. The verdict is provisional until the learner has actually used the lab: a harness that is annoying to connect costs more than its tests save.

## Scaling plan

1. **Study first.** The learner works through some of Stage 07, ideally one full section with its mini-project, and notes what helped and what got in the way: card length, locator precision, self-test difficulty, hour estimates, lab setup. Change the format before scaling, not after.
2. **Per stage**, in this order:
   - Claude groups the topics into unit skeletons (about 20 minutes).
   - Muse Spark drafts each section's cards in parallel, using the brief in the pilot's worker setup.
   - Claude reviews every claim (about 10 minutes per section) and writes the mini-projects and the capstone rubric.
   - Codex builds a lab only when the verdict above says so.
   On pilot numbers, a stage costs part of one session of orchestration and 0 to 20% of one Codex window.
3. **Order:** the core stages the learner will reach next, then the tracks they choose. The tracks hold 77 sections, about as many as the whole core, so do them on demand rather than all at once.
4. **Keep the sources honest.** The pilot found errors in popular public sources: wrong arithmetic in the Hugging Face course's Unigram example, an expected-token formula that drops a token in two Modern LLM notebook exercises, and a notebook calling the SwiGLU gate a probability. The cards route around each one. Re-check fast-moving sources when a stage is revisited.
