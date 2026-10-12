# Stage 07: LLM Foundations lab

Finish the Stanford CS336 Assignment 1 public tests named by the curriculum
cards first. They check BPE, transformer primitives, AdamW, data loading and
checkpointing. This lab adds checks for the gaps between those primitives.
Build each mini-project in your own repository, then connect it here.

## Connect and run

Install [uv](https://docs.astral.sh/uv/), then from this directory:

```sh
uv sync --locked
uv run pytest -q
uv run pytest tests/test_s1_data.py
```

Edit `adapters.py`: replace a function's `raise NotImplementedError(...)` with
an import/call to your implementation. Read its docstring for shapes, dtypes,
edge cases and the shared `LabConfig` architecture. Put your repository on
`PYTHONPATH`, or install it into the uv environment with `uv pip install -e
/path/to/your/repo`. Do not copy the reference to pass the tests.

Unconnected adapters skip with `adapter not connected`. All stubs initially
skip; connecting only one section is fine. A skipped test is unfinished, not a
pass. A missing function, import error or other exception is a failure, not a
skip. To use a differently named adapter module:

```sh
ATLAS_LAB_IMPL=my_adapters uv run pytest -q
```

## What earns each section's tests

| Section | Checks | Mistakes caught |
| --- | --- | --- |
| s1: corpus data | EOS packing, one-token overlap, exact shift, document loss/attention masks, NFC/whitespace dedup, exact shingle Jaccard, contamination | Interior token drops, missing EOS, cross-document supervision/attention, non-normalized duplicates, incorrect thresholds and 12-vs-13-gram overlap |
| s2: decoder | Explicit MHA/GQA/MQA head-loop oracle, causal offsets, RoPE norms/relative dots/slices, model shape/causality/batch independence/seed/parameter count | Cyclic instead of contiguous KV groups, future-token leakage, reset or wrong-pair RoPE, incorrect weight tying or projections |
| s3: training | Brute-force temperature/top-k/top-p probabilities, independent Markov validation CE near known entropy, exact checkpoint resume | Dropped nucleus crossing token, missing renormalization, wrong temperature order, unshifted/leaked labels, lost optimizer or data RNG state |
| s4: evaluation | Test-owned module parameter/FLOP counts, AdamW byte breakdown, deterministic bootstrap/width/coverage, paired differences | MACs mistaken for FLOPs, missing norm/gradient storage, score quantiles mistaken for mean uncertainty, unpaired resampling |
| s5: cache | Twelve-token cached/uncached greedy equivalence, multi-token chunk prefill, lengths 1/7/11, batch 3, actual KV bytes, counted decode cost | Reset RoPE positions, wrong chunk causal offset, storing query instead of KV heads, recomputing the prefix |

All data is generated locally. Tests run on CPU, seed their randomness and
enable deterministic PyTorch algorithms. No test-time network or model downloads.
PyTorch comes from the explicit CPU-wheel index in `pyproject.toml`.

The default model is two layers, width 32, four query heads and two KV heads;
tests also exercise MHA, MQA and tied embeddings. FLOPs count only matmuls,
using `2*m*n*k`, including dense full-square attention with no causal savings.
AdamW bytes include parameters, gradients and both moments at equal precision.

### Training and checkpoint interoperability

`run_training` fixes the LR schedule, batch size, clipping and AdamW
hyperparameters in its docstring. The schedule horizon is 200 global steps,
not the requested call length, so a split run has the same schedule. The
entropy test trains 180 steps and evaluates independent next-token labels;
allowed validation CE is `[H - 0.05, H + 0.35)` in natural-log units.

Save a state dict under the checkpoint's `model` key, loadable by your own
`make_model`. Other checkpoint keys/layouts are yours, but restore optimizer,
global step, schedule and RNG streams on resume. Only load checkpoints you
created; PyTorch pickle checkpoints from strangers are unsafe.

KV cache representation is opaque. The reference allocates exact used length.
If yours preallocates, document full-`context_length` allocation in your adapter;
the byte test allows that rule, but no other hidden padding or expanded heads.
`cache_nbytes` reports allocated K/V storage, not just a tensor view's logical
element count. It excludes token history and other metadata.

## Harness validation and spoilers

**Spoiler warning: `reference/` contains complete solutions.** Use it only for
checking the harness or after finishing your own implementation.

```sh
ATLAS_LAB_IMPL=reference uv run pytest -q
uv run python check_mutants.py
```

Each module in `mutants/` overrides exactly one adapter with a plausible bug.
The checker runs the whole suite once per mutant and prints failing test names
(parameter cases grouped). A survivor, import/setup error, timeout or unexpected
skip fails the checker; an infrastructure error never counts as catching a bug.
This is a trial harness: tests stay only if they catch real mistakes at fair cost.

## Runtime

Initial CPU reference measurements: s1 1.11s, s2 3.62s, s3 2.04s,
s4 1.34s, s5 1.24s (pytest elapsed times, including startup for each run).
The final verification report records fresh wall-clock times and total runtime.
The budget is under 90 seconds for the full reference run and under 45 seconds
for s3. The 21-mutant audit deliberately runs 21 full suites and takes longer.
