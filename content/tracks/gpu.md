<!-- Generated from content/curriculum.json. Edit the JSON and run npm run content:generate. -->

# 07. Performance & GPU Programming

**Level:** Advanced specialization  
**Scope:** 10 track stages · 236 required topics · 33 optional, depth, or later topics

Predict, profile and optimize AI workloads from one request and one kernel through tensor cores, compilers, inference integration and multi-GPU communication, with correctness, strong baselines and negative regimes preserved.

## Order

GPU-1. Workload Arithmetic and Performance Contracts
GPU-2. GPU Execution, Memory and Code Generation
GPU-3. Measurement, Profiling and Correctness
GPU-4. CUDA Data Movement and Parallel Primitives
GPU-5. GEMM, Tensor Cores and Low Precision
GPU-6. Attention and Transformer Fusion
GPU-7. Triton, CuTe and Compiler Paths
GPU-8. Kernel-to-Inference Integration
GPU-9. Multi-GPU Communication and Distributed Inference Performance
GPU-10. Portability, Benchmark Audit and Performance Research

## GPU-1. Workload Arithmetic and Performance Contracts

**Why:** Optimization starts with a workload and a falsifiable performance model. This stage traces one transformer request from prefill through decode, accounts for operations and bytes, and defines evidence strong enough to distinguish useful speed from a misleading microbenchmark.

### Learn this much

- [ ] One inference request from tokenize and prefill through autoregressive decode _(Required)_
- [ ] Layers, hidden size, heads, key-value heads, sequence lengths, batch and precision _(Required)_
- [ ] Useful operations for projections, MLPs and output layers _(Required)_
- [ ] Prefill and decode attention operations by sequence and head shape _(Required)_
- [ ] Parameter bytes under storage and execution precision _(Required)_
- [ ] Activation, temporary workspace and allocator memory _(Required)_
- [ ] MHA, GQA and MQA key-value bytes per token and request _(Required)_
- [ ] Weight, activation, key-value, workspace and graph memory residency _(Required)_
- [ ] Compute-heavy prefill and bandwidth or latency-sensitive decode regimes _(Required)_
- [ ] Time to first token, time per output token, inter-token and end-to-end latency _(Required)_
- [ ] Tokens per second, requests per second and useful work per device _(Required)_
- [ ] Goodput under per-request latency and correctness requirements _(Required)_
- [ ] Prompt, output, batch, dtype, shape and arrival distributions _(Required)_
- [ ] Cold start, compilation, autotuning, cache warmup and steady state _(Required)_
- [ ] Compute, memory, launch, synchronization, host and communication cost categories _(Required)_
- [ ] Arithmetic intensity and a first roofline estimate _(Required)_
- [ ] Kernel share, Amdahl bound and maximum end-to-end impact _(Required)_
- [ ] Framework, vendor library, compiler and existing engine baselines _(Required)_
- [ ] Numerical correctness, output quality and semantic-equivalence contract _(Required)_
- [ ] Hardware, firmware, driver, toolkit, compiler, library and configuration manifest _(Required)_
- [ ] Claim schema with workload, hardware, baseline, timing boundary and correctness method _(Required)_
- [ ] Prediction, falsifying signals and decision rule declared before profiling _(Required)_
- [ ] Raw trials, traces, counters, code revision and generated report lineage _(Required)_
- [ ] Training-step operation, activation and communication arithmetic _(Optional)_
- [ ] Agentic, voice, video and multimodal serving distributions _(Depth)_
- [ ] Fleet procurement, capacity markets and organization-wide cost planning _(Later)_

### Study units

#### U1. One request through prefill and decode, and the shapes that set its cost

**About 4 h** · **Target:** Explain + Derive

Topics: One inference request from tokenize and prefill through autoregressive decode; Layers, hidden size, heads, key-value heads, sequence lengths, batch and precision

Every later count in this section hangs off one request through these two phases. If the lifecycle is vague, FLOPs, bytes and latency have nothing to attach to.

**You can now**

- Trace one request from tokenized prompt through prefill to the last decode step, naming the tensors produced and reused at each stage.
- Write a shape manifest for a small model (layers, hidden size, heads, key-value heads, sequence lengths, batch, precision) and point at the entries that set its cost.
- Explain why prefill is compute-bound while decode is bandwidth-bound, using TTFT and per-token latency.

**Study**

1. [One request: prefill, decode and what to optimize](https://jax-ml.github.io/scaling-book/inference/) (How to Scale Your Model - Inference) - The Basics of Transformer Inference: What do we actually want to optimize? (TTFT and per-token latency) and A more granular view of the Transformer (linears, attention, everything else).
2. [Prefill and decode inside a serving engine](https://jax-ml.github.io/scaling-book/inference/) (How to Scale Your Model - Inference) - Designing an Effective Inference Engine: Continuous batching, with its orchestration of prefill and generate steps.
3. [Prefill and decode with the KV-cache](https://arxiv.org/html/2407.07000v2) (Etalon) - Section 2.1, LLM Inference Process.

**Focus**

- Prefill processes the whole prompt at once and writes one key-value pair per prompt token per layer; decode reads the full cache back for each new token and appends one pair.
- TTFT covers scheduling delay plus prompt processing; per-token latency covers one decode step. Offline batch work cares about tokens per second, chat cares about both.
- The manifest entries that move every estimate are layer count, hidden size, head counts with key-value heads, prompt and output lengths, batch size and precision.

**Reproduce:** Closed-book, write the request path for the invented 64-layer model in the inference chapter's Worked Problems ($`D = 4096`$, $`F = 16384`$, $`N = 32`$, $`K = 8`$, $`H = 256`$): total parameters 18.4e9, int8 key-value bytes per token 262,144, and the per-layer append of one $`[K, H]`$ key plus one $`[K, H]`$ value per new token. Derive both numbers from the manifest.

**Traps**

- Treating prefill and decode as one regime. Prefill is a batched parallel pass; decode is serial with cache reads, so one batch size or one roofline cannot cover both.
- Counting tokens without naming prefill versus output tokens. Cost, latency and cache all scale with the two lengths differently.
- Assuming batching speeds up every part. Batching reuses weights across requests, but each request adds its own key-value reads.

**Practice**

- [How to Scale Your Model applied inference Question 4: LLaMA 3 inference from downloaded weights](https://jax-ml.github.io/scaling-book/applied-inference/) - Worked Problems, Question 4, steps 1 to 3 (step 4 optional). Steps 1 to 3 load the weights and count the parameters, run a plain forward pass with greedy sampling, then add a key-value cache, which splits the loop into one prefill pass and one decode step per token. Step 4 (separate prefill and decode servers) is optional, and step 5 (FlashAttention in Pallas) is TPU work that later sections replace. The question assumes JAX on Colab; any framework works. LLaMA 3 8B is about 16 GB in bf16 and fits a 24 GB GPU; on a 6 GB GPU use Llama 3.2 1B (about 2.5 GB in bf16), and count its tied embeddings once. Both downloads are gated: accept the license on Hugging Face and sign in first.

**Stop when:** You derive 18.4e9 parameters and 262,144 int8 key-value bytes per token from the manifest without notes, and your steps 1 to 3 implementation samples coherent tokens through one prefill pass and cached decode steps.

<details>
<summary>Self-test</summary>

1. A 512-token prompt arrives. What does prefill produce, and what does each decode step then read and write?
   - Prefill processes all 512 tokens in parallel, writes 512 key-value pairs per layer and returns first-token logits. Each decode step reads the full cache, samples one token, and appends its pair.
2. Which manifest entries must a shape manifest contain for this section's estimates?
   - Layer count, hidden size, feed-forward size, query and key-value head counts with head dimension, prompt and output lengths, batch size, precision, and later the sharding.
3. Why does batching raise linear-layer efficiency but not remove the decode bottleneck?
   - Batching reuses each weight across requests, but every request adds its own key-value bytes, so cache traffic grows with batch while weight traffic does not.
4. Which latency does a longer prompt directly worsen, TTFT or per-token latency?
   - TTFT, through prompt processing time. Per-token latency is set by one decode step over weights plus cache.

</details>

#### U2. Operation counts for projections, MLPs, output and attention

**About 4 h** · **Target:** Derive

Topics: Useful operations for projections, MLPs and output layers; Prefill and decode attention operations by sequence and head shape

Operation counts are the numerator of every intensity and roofline in this section. A count that mixes prefill with decode, or drops the attention term at long context, corrupts all of them.

**You can now**

- Derive the $`2P`$ per-token dense operations rule from the qkv, output and MLP walks.
- Derive prefill and decode attention operations separately and state when attention rivals the dense count.
- State exactly what a FLOP count omits (softmax, norms, sampling, unembedding) and when the omission stops being safe.

**Study**

1. [Dense walk: 2P operations per token](https://kipply.github.io/blog/transformer-inference-arithmetic/) (Transformer Inference Arithmetic) - flops counting, with the How many flops in a matmul? box in kv cache. Depth: The $`2P`$ count covers the dense weights once per token, in prefill and decode alike. Attention comes on top, and in prefill it grows with the square of prompt length.
2. [Attention operations: prefill versus decode](https://jax-ml.github.io/scaling-book/inference/) (How to Scale Your Model - Inference) - What about attention? (the $`ST/(S+T)`$ intensity derivation) and Theoretical estimates for LLM latency and throughput (Min Step Time with the small-batch quiz).
3. [Key-value cache FLOP savings grow with sequence](https://kipply.github.io/blog/transformer-inference-arithmetic/) (Transformer Inference Arithmetic) - kv cache: the one-sixth saving paragraph and the no-cache quadratic paragraph.

**Focus**

- One matmul through all parameters costs $`2P`$ operations by the $`2mnp`$ rule; the layer walk (qkv, output, MLP) sums to the same within 2%.
- Decode attention per token scales with cached length ($`4SN_{\text{heads}}H`$ per layer for scores plus values); prefill attention scales with prompt length squared.
- Softmax, norms, sampling and the unembedding are $`O(d_{\text{model}})`$ per layer against $`O(d_{\text{model}}^2)`$ dense work; they matter only when the dense term shrinks or a profile says otherwise.
- Use head count times head dimension, not model width, wherever key-value heads differ from query heads.

**Reproduce:** Closed-book, derive decode operations per token for the invented 18.4e9-parameter model at cached length 8192: dense $`2 \times 18.4 \times 10^9 = 3.68 \times 10^{10}`$, attention $`4 \times 8192 \times 32 \times 256 \times 64 = 1.72 \times 10^{10}`$, total about $`5.4 \times 10^{10}`$.

**Traps**

- Taking $`2P`$ per token as the whole prefill cost. Prefill pays the dense term per prompt token plus attention that grows with prompt length squared, so at long prompts the dense count understates the work.
- Writing the attention scale as division by head dimension. The implemented scale is $`1/\sqrt{d_{\text{head}}}`$; the count is unchanged but a kernel you write later must use the root.
- Calling attention free in decode because 2P dominates. At 8192 cached tokens the invented model's attention is nearly half the dense count; recompute the share before dropping it.

**Practice**

- [How to Scale Your Model inference Question 1: parameters and int8 key-value bytes per token](https://jax-ml.github.io/scaling-book/inference/) - Worked Problems, Question 1 (reproduce 18.4e9 parameters and 262,144 bytes per token closed-book before opening the answer)

**Stop when:** You derive the 5.4e10 decode count at length 8192 without notes and reproduce Question 1 exactly.

<details>
<summary>Self-test</summary>

1. How many dense operations does one decode step take for the invented 18.4e9-parameter model?
   - About $`3.68 \times 10^{10}`$, from $`2 \times 18.4 \times 10^9`$.
2. At cached length 8192, what is its decode attention count, and what share is that?
   - $`4 \times 8192 \times 32 \times 256 \times 64 = 1.72 \times 10^{10}`$, nearly half the dense count, so it cannot be dropped there.
3. Why is $`2P`$ per token not the whole cost of a prefill?
   - $`2P`$ counts the dense weights once per token. Prefill also computes attention across all prompt tokens, which grows with prompt length squared, so at long prompts the dense count understates the work.
4. Without a cache, how does per-step work grow with sequence length $`n`$?
   - Each step recomputes keys and values for all $`n`$ tokens: $`2 \times 2 \times n \times L \times d^2`$ operations, or $`n/6`$ of a one-token forward pass, so totals grow quadratically.

</details>

#### U3. Parameter, activation, workspace and KV-cache memory

**About 4 h** · **Target:** Derive

Topics: Parameter bytes under storage and execution precision; Activation, temporary workspace and allocator memory; MHA, GQA and MQA key-value bytes per token and request; Weight, activation, key-value, workspace and graph memory residency

Memory decides the maximum batch before any timing starts. A fit that forgets precision, head grouping or allocator overhead fails at load time, not at arithmetic time.

**You can now**

- Derive parameter bytes under storage versus execution precision for a named model.
- Derive key-value bytes per token and per request for MHA, GQA and MQA from layer, head and precision entries.
- Fit a batch under a capacity bound with an explicit overhead line, and name what the fit ignores (activations, workspace, allocator).

**Study**

1. [LLaMA-2-13B bytes: parameters, activations, key-value cache](https://jax-ml.github.io/scaling-book/inference/) (How to Scale Your Model - Inference) - What about memory? and Modeling throughput and latency for LLaMA 2-13B, including the parameter table and both batch tables. Depth: The tables label memory GiB but divide decimal gigabytes by bytes per second (32.7e9 bytes at 6.56e12 bytes/s gives 4.98 ms). Recompute in bytes and keep GB apart from GiB.
2. [Weights, key-value bytes per token and the capacity fit](https://kipply.github.io/blog/transformer-inference-arithmetic/) (Transformer Inference Arithmetic) - kv cache: the bytes-per-token formula; capacity. Depth: Recompute both byte lines: 52e9 parameters at 2 bytes is 104e9 bytes (about 104 GB), and exact key-value bytes per token are 2,097,152. The article's rounded 0.002 GB per token gives about 28000 tokens on 4 GPUs, not the printed 23000; use your own number with a stated overhead.
3. [Intermediate and workspace bytes](https://kipply.github.io/blog/transformer-inference-arithmetic/) (Transformer Inference Arithmetic) - intermediate memory costs: tensor contractions, statistical normalizations and element-wise operators, with GPU Kernel Fusion.

**Focus**

- Parameters cost bytes-per-value times count under the stored precision; execution precision can differ (int8 weights with bf16 compute) and changes later intensities, not this line.
- Key-value bytes per token are $`2 \times \text{bytes} \times L \times K \times H`$; the $`4 \times L \times d_{\text{model}}`$ shortcut assumes key-value width equals model width and breaks under GQA and MQA.
- Activations are megabytes where the cache is gigabytes at 8k context (80 MB against 6.7 GB in the 13B example), but they still set the workspace and fragmentation overhead you must state.
- Capacity fits subtract weights first, then divide by per-request cache; always add an overhead line for allocator, workspace and graphs instead of absorbing it into rounding.

**Reproduce:** Closed-book, derive the 13B bf16 cache at 8192 context ($`2 \times 2 \times 128 \times 40 \times 40 \times 8192 = 6.7 \times 10^9`$ bytes), then the GQA variant with 8 key-value heads in int8 (81,920 bytes per token), then fit 8192-length requests beside 26 GB of weights on 8 16 GB cards (about 150).

**Traps**

- Reading the inference chapter's tables as GiB. The step times divide decimal gigabytes by bytes per second; recompute in bytes and keep GB apart from GiB.
- Copying the article's 23000-token fit. Its own rounded 0.002 GB per token gives about 28000 (about 26700 with exact bytes); the printed 23000 carries an unstated discount, so publish your own overhead instead.
- Calling activations negligible everywhere. They are negligible beside an 8k cache; at short context with large batch they set the workspace line.

**Practice**

- [How to Scale Your Model inference Question 2: largest batch at 128k context](https://jax-ml.github.io/scaling-book/inference/) - Worked Problems, Question 2, including the $`K = 1`$ variant (reproduce batch 7, about 56 with one key-value head)

**Stop when:** Your closed-book byte lines match 6.7e9, 81,920 and the 150-request fit, and Question 2 reproduces 7 (about 56 with one key-value head).

<details>
<summary>Self-test</summary>

1. How many key-value bytes per token does the invented model ($`L = 64`$, $`K = 8`$, $`H = 256`$) use in bf16?
   - $`2 \times 2 \times 64 \times 8 \times 256 = 524{,}288`$ bytes (about 0.5 MB); in int8 it is 262,144. Full multi-head attention with $`K = 32`$ would need 2,097,152 bytes in bf16.
2. How many per token for a 40-layer, 8 key-value head, 128-dim model in int8?
   - $`2 \times 40 \times 8 \times 128 = 81{,}920`$ bytes (80 kB).
3. Three 40 GB cards hold the 52B weights (104 GB). Can they serve batch 4 at 2048 tokens each?
   - No, though the article says it can. 16 GB remain, and $`16 \times 10^9 / 2{,}097{,}152 \approx 7600`$ tokens fit against $`4 \times 2048 = 8192`$ needed; even the rounded 8000 falls short. Serve batch 3, shorten context, add a card, or shrink the cache.
4. When does the per-token shortcut $`4 \times L \times d_{\text{model}}`$ fail?
   - Whenever key-value width differs from model width: GQA and MQA need the explicit $`K`$ and $`H`$ entries.

</details>

#### U4. Arithmetic intensity, a first roofline and the prefill and decode regimes

**About 5 h** · **Target:** Derive + Measure

Topics: Compute-heavy prefill and bandwidth or latency-sensitive decode regimes; Arithmetic intensity and a first roofline estimate

The roofline turns counts and bytes into a prediction: which side of the ridge each phase sits on, and how much batch it takes to cross. Without it, prefill and decode tuning is guessing.

**You can now**

- Derive arithmetic intensity for a matmul and a decode step, and the batch where each turns compute-bound.
- Place prefill and decode of one model on the same roofline and name the bound on each side.
- Measure a batch crossover on your own GPU with synchronized event timing and reconcile the knee with your measured peak and bandwidth.

**Study**

1. [Roofline, arithmetic intensity and the critical batch](https://jax-ml.github.io/scaling-book/roofline/) (How to Scale Your Model - Inference) - Where Does the Time Go?: Visualizing rooflines and Matrix multiplication; A Few Problems to Work, Questions 1 and 2 (int8 and mixed-precision answers).
2. [Linear and attention bottlenecks: the critical batch and attention intensity](https://jax-ml.github.io/scaling-book/inference/) (How to Scale Your Model - Inference) - Linear operations: what bottlenecks us? (the $`B = 240`$ derivation) and What about attention? (the $`ST/(S+T)`$ derivation).
3. [The 208 ratio and per-stage flop-per-byte limits](https://kipply.github.io/blog/transformer-inference-arithmetic/) (Transformer Inference Arithmetic) - kv cache: Flops vs Memory Boundedness; batch sizes: the qkv/o/w1/w2 table. Depth: The article writes the crossover as $`A_{\text{bw}}/A_f`$; the ratio it computes is peak operations per second over bytes per second, $`(312 \times 10^{12}) / (1.5 \times 10^{12}) = 208`$ FLOP/byte. Its remark that comms latency was still 11% for a 52B model at batch 512 points at an example the article never works; its worked 260B example at batch 512 gives 3 ms of latency against 53 ms, about 6%. Recompute instead of quoting.

**Focus**

- Intensity is operations over bytes moved ($`I = F/Q`$); the ridge is peak operations per second over bytes per second, and the bound is the minimum of the two ceilings.
- A bf16 matmul with batch far below width has intensity near the batch size; the chapter's 240 on TPU v5e and 295 on H100 are the same ratio on different hardware.
- Decode attention sits near $`I \approx 1`$ FLOP/byte at one query token, so batch cannot move it; prefill attention sits near $`I \approx T/2`$.
- Report the lower (max) and upper (sum) bounds; the gap is the overlap assumption, and profiles decide it.

**Reproduce:** Sweep bf16 $`[B, 4096] \times [4096, 4096]`$ matmuls on your GPU with event timing, warmup and interleaved repeats; plot achieved TFLOP/s against $`B`$ and report the knee and the small-batch floor. Measured on an RTX 3050 6 GB with PyTorch 2.14 (SM clock near 1.94 GHz): every $`B`$ from 1 to 16 took 0.24 to 0.29 ms; throughput was 6.5 TFLOP/s at $`B = 64`$, 13.4 at 128, 14.2 at 256, 14.8 at 1024 and 16.0 at 4096; a device-to-device copy reached 151 GB/s. A plateau near 14.5 TFLOP/s over 151 GB/s is about 95 FLOP/byte, and the knee fell between $`B = 64`$ and $`B = 128`$. The floor is one pass over the 33.6 MB weight matrix: 0.22 ms at 151 GB/s. Your numbers will differ; the target is a knee near your own measured ratio.

**Traps**

- Quoting a ridge without naming the precision. int8 weights with bf16 compute halve the critical batch (120 versus 240 on v5e); int8 compute restores it.
- Reading achieved peaks as vendor peaks. Dense H100 bf16 without sparsity is half the headline (9.89e14, not 1.979e15); measure your own plateau.
- Expecting step time to fall with smaller batch below the knee. One full weight pass already costs about 0.22 ms on the RTX 3050 above; batching toward the knee buys throughput, not latency.

**Practice**

- [Roofline Questions 1, 2 and 5: int8, mixed-precision and H100 critical batch](https://jax-ml.github.io/scaling-book/roofline/) - A Few Problems to Work, Questions 1, 2 and 5 (reproduce 240, 120 and 295 before opening the answers)
- [How to Scale Your Model inference Question 3: parameter-load lower bound](https://jax-ml.github.io/scaling-book/inference/) - Worked Problems, Question 3 (reproduce the 1.4 ms bound for 18.4e9 int8 parameters on 16 chips)

**Stop when:** Your sweep shows the knee near your measured peak-over-bandwidth ratio, roofline Questions 1, 2 and 5 reproduce their answers, and you state both bounds for one decode step.

<details>
<summary>Self-test</summary>

1. At what batch does a bf16 matmul turn compute-bound on H100, and why half the headline?
   - About 295 (9.89e14/3.35e12). The headline 1.979e15 needs structured sparsity, so dense math uses half.
2. What is decode attention intensity at one query token against a long cache, and what follows?
   - About 1 FLOP/byte from $`ST/(S+T)`$; it stays memory-bound at any batch, since each request adds its own cache bytes.
3. On TPU v5e, past what prompt length is prefill attention compute-bound?
   - Past about 480 tokens: intensity $`T/2`$ must clear the 240 ridge.
4. State the lower and upper runtime bounds for the roofline int8 matmul question.
   - Lower $`\max(T_{\text{math}}, T_{\text{comms}})`$, upper their sum, with $`T_{\text{math}} = 2BDF/3.94 \times 10^{14}`$ and comms bytes over 8.2e11 per second.

</details>

#### U5. TTFT, TPOT, throughput and goodput

**About 4 h** · **Target:** Explain + Derive + Measure

Topics: Time to first token, time per output token, inter-token and end-to-end latency; Tokens per second, requests per second and useful work per device; Goodput under per-request latency and correctness requirements

Throughput without a latency SLO ranks systems by their averages and hides the stalls users feel. SLO-qualified thinking is what turns a benchmark into a serving decision.

**You can now**

- Define TTFT, TBT, TPOT, normalized latency, capacity and goodput, and state what each hides (scheduling delay, jitter, prompt-length spread).
- Compute fluidity-index for a timestamp trace and derive the fluid token generation rate at a stated SLO.
- Show peak token throughput ranking two systems differently from SLO-qualified rate, using the paper's vLLM versus Sarathi-Serve and Groq numbers.

**Study**

1. [TTFT, TBT, TPOT, normalized latency, capacity and their pitfalls](https://arxiv.org/html/2407.07000v2) (Etalon) - Sections 2.2 and 3.1 with Figures 1 to 3 (the vLLM versus Sarathi-Serve Arxiv-Summarization comparison at 1.5 QPS).
2. [Goodput: the request rate served within the SLO](https://arxiv.org/html/2401.09670v3#S1) (DistServe: Disaggregating Prefill and Decoding for Goodput-optimized LLM Serving) - Section 1 with Figure 1 (per-GPU goodput; a 13B model on one A100 reaches about 1.6 requests per second at 90% SLO attainment).
3. [fluidity-index, fluid rate and the two evaluation recipes](https://arxiv.org/html/2407.07000v2) (Etalon) - Section 4.1 (Algorithm 1, Figure 4) and Section 4.2 (black-box and capacity recipes); Section 5.1 Figure 5 with Section 5.2 Figure 6. Depth: Etalon defines no metric named goodput. Its SLO-qualified rates are the fluid token generation rate and capacity under a fluidity SLO (99% of requests at 0.9 or higher). The text cross-reference to the algorithm is mistyped; read Algorithm 1 itself.
4. [Latency-throughput tradeoff and cost per token](https://jax-ml.github.io/scaling-book/applied-inference/) (How to Scale Your Model - Inference) - What is the LLaMA Serving Story? through Visualizing the Latency Throughput Tradeoff, including the NumPy roofline snippet (`kv_comms_time` with `attn_time` always bandwidth-bound for generate).

**Focus**

- TTFT mixes scheduling delay with prompt processing and grows with prompt length (Figure 1, Yi-34B on 2 H100); never set it as one static SLO across lengths.
- TPOT and normalized latency divide by decode count, so a 10 s stall over a 228-token median moves them by milliseconds; tail TBT sees the stall but not its timing or frequency.
- fluidity-index banks early slack and resets deadlines after a miss (Algorithm 1, Figure 4); the fluid rate is the inverse of the smallest TBT deadline holding 99% of requests at 0.9 or higher.
- Goodput is the highest request rate served while a target share of requests (say 90%) meets the TTFT and TPOT SLOs (DistServe). Etalon's fluid token generation rate and capacity under a fluidity SLO are SLO-qualified rates of the same kind, with the SLO set on every token deadline.

**Reproduce:** Closed-book, score the Section 4 pair at TBT deadline 100 ms: both traces take one TBT miss in 11, while fluidity-index gives 1.0 to the 10 ms system and 10/11 to the 100 ms system. Derive both from Algorithm 1's slack and reset rules.

**Traps**

- Averaging TBT across requests. Means hide per-request stall timing; request-level deadline accounting exists because the CDFs and means disagreed (the P85 versus P99 flip in Figure 3c).
- Fitting the prefill deadline on the wrong system. $`D_p`$ comes from the evaluated system's isolated prefill curve (10 repeats), not from a constant or another engine's curve.
- Reading Figure 5d as raw speed. It plots acceptance against TBT target at a fixed 10% miss line; Groq leads there while trailing on prefill in Figure 5c.

**Practice**

- [Etalon Algorithm 1 on the two Section 4 systems](https://arxiv.org/html/2407.07000v2) - Section 4 motivating example (10 tokens at 10 ms versus 100 ms, 11th at 150 ms) with Algorithm 1 in Section 4.1. Implement Algorithm 1 in your own repository, score both traces at 100 ms deadline (expect 1.0 versus 10/11 against a tied 1/11 TBT miss rate), then apply it to one real timestamp trace with a fitted $`D_p`$.

**Stop when:** Your implementation returns 1.0 and 10/11 on the two traces, and you can read TPOT, tail-TBT and fluid rates off Figures 3b and 5a with the ranking flip explained.

<details>
<summary>Self-test</summary>

1. What two components make up TTFT, and why can a short request show a large one?
   - Scheduling delay plus prompt processing. Queueing behind earlier work inflates TTFT even when the prompt itself is cheap.
2. Why must the prefill deadline $`D_p`$ be a fitted function of prompt length?
   - Prefill grows about quadratically (Figure 1), and the workload spreads 417 median to 1418 p90 tokens; a static target is either slack or impossible.
3. The toy pair has TPOT 22.7 ms versus 104.5 ms, so TPOT separates them. Why is fluidity-index still needed?
   - TPOT separates different means but hides stall structure at equal means: vLLM and Sarathi-Serve tie on TPOT while a 10 s stall wrecks one of them. Fluidity credits early slack and penalizes miss timing.
4. How do the three Figure 5a rates rank Groq, and what does each assume?
   - TPOT inverse gives about 600 tok/s (ignores stalls), tail-TBT inverse about four times less (over-penalizes the tail), fluid rate sits between at the rate holding the 99%/0.9 SLO.

</details>

#### U6. Workload distributions, cold start and steady state

**About 3 h** · **Target:** Explain + Measure

Topics: Prompt, output, batch, dtype, shape and arrival distributions; Cold start, compilation, autotuning, cache warmup and steady state

A model reconciled on one shape at steady state says nothing about serving. Distributions set which shapes matter; cold and warm separation decides which trials count.

**You can now**

- Describe a serving workload by prompt, output, batch, dtype and shape medians plus an arrival note, citing production-style spreads.
- Separate cold cost (compilation, weight load, allocator and autotune warmup) from warm steady state, and state which trials each keeps.
- Record a cold and a warm trace for one workload and show where the section checkpoint's reconciliation starts.

**Study**

1. [Prompt-length spread and day-long load variation](https://arxiv.org/html/2407.07000v2) (Etalon) - Section 4.1 (LMSys-Chat-1M medians 417 and 1418 prefill tokens) with Figure 1; Section 5.1 (hourly runs over 24 hours for traffic variance).
2. [Compilation pipeline: what a cold run pays for](https://jax-ml.github.io/scaling-book/profiling/) (How to Scale Your Model - Inference) - A Thousand-Foot View of the TPU Software Stack (tracing to StableHLO, HLO, LLO and machine code). Depth: The chapter describes the TPU stack (JAX tracing to StableHLO, then XLA). On a GPU the same cold costs come from framework tracing and graph capture, CUDA or Triton compilation, module loading and autotuning. The chapter gives no warmup protocol, so pair it with the next item for the measurement rule.
3. [Cold and warm separation with environment capture](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/gpu-microbenchmark-kernel-suite.md) (GPU Microbenchmark and Kernel Suite) - Architecture constraints (compilation, autotuning, cold and warm results separated); Milestone B (cold, warm and end-to-end invocation recorded separately); Measurement requirements.
4. [Medians, eviction and the prefill-generate ratio](https://jax-ml.github.io/scaling-book/applied-inference/) (How to Scale Your Model - Inference) - Median-length examples (prefill 8192 with decode 512 and 4096), the eviction math and the disaggregated prefill to generate ratio.

**Focus**

- Report medians with spread, not points: 417 versus 1418 prefill tokens at median versus p90, 2k to 32k sliders, 24 hourly runs.
- Cold pays tracing plus staged compilation, weight loading, allocator growth and autotuning; none of it belongs in a steady-state median.
- Prefill length spread punishes whole-batch prefill (padding, blocking); eviction math (96 tokens per step at $`P = 8192`$, $`G = 4096`$, $`B = 32`$) turns medians into capacity.

**Reproduce:** Closed-book, write the workload card for $`P = 4096`$, $`G = 1024`$, $`B = 16`$: sequences finishing per step 1/64, tokens evicted per step 80, and the cold trials (first compile, first load, first autotune) you discard before the warm median.

**Traps**

- Sweeping batch at fixed length and calling it a workload. Prompts spread widely (417 median against 1418 at p90 in LMSys-Chat-1M) and decode lengths vary as much (the applied chapter's examples run 512 and 4096), so fix both axes.
- Warming up with the timed shapes. Autotuning on the benchmark shapes leaks tuning into the measurement; the project schema records autotuning separately from warm trials.
- Keeping the first trial. First compile and allocation can exceed steady state by orders of magnitude; converge warmup first, then record.

**Practice**

- The section mini-project covers this: warmup-convergence behavior in the benchmark harness with separate cold and warm traces.

**Stop when:** Your workload card states medians, spread, arrival assumption and the cold-warm split, and two traces filed under it reconcile warm medians with the roofline within stated uncertainty.

<details>
<summary>Self-test</summary>

1. Which workload spreads does this unit cite, and why medians plus spread?
   - LMSys-Chat-1M 417 median with 1418 p90 prefill tokens, 2k to 32k sliders, hourly runs over 24 hours. Points hide the padding, blocking and queueing that spreads cause.
2. What belongs in cold cost but never in a warm median?
   - Tracing and staged compilation, weight loading, allocator growth and autotuning. Warm trials start after these converge.
3. At $`P = 8192`$, $`G = 4096`$, $`B = 32`$, how many tokens leave the cache per step, and why?
   - 96: $`B/G`$ sequences finish per step, each evicting $`P + G`$ tokens, so $`32 \times 12288 / 4096 = 96`$.
4. Why did Etalon run public APIs hourly for 24 hours instead of once?
   - Traffic and load vary through the day; one run confuses time-of-day effects with system differences.

</details>

#### U7. Cost categories and the Amdahl bound on end-to-end gain

**About 3 h** · **Target:** Derive

Topics: Compute, memory, launch, synchronization, host and communication cost categories; Kernel share, Amdahl bound and maximum end-to-end impact

A kernel speedup is not a system speedup. Shares plus Amdahl decide whether an optimization moves the request or only the profile.

**You can now**

- Split one decode step into compute, memory, launch, synchronization, host and communication categories with an equation per term.
- Derive the Amdahl bound from a measured time share and state the maximum end-to-end gain.
- Predict whether an optimization is worth integrating, using share times speedup against dispatch and synchronization overhead.

**Study**

1. [Compute, memory, comms latency and throughput terms](https://kipply.github.io/blog/transformer-inference-arithmetic/) (Transformer Inference Arithmetic) - latency calculations (small-batch and large-batch equations); model parallelism (the four $`(N-1)d_{\text{model}}/N`$ communications per layer). Depth: The 53 ms large-batch result for the 260B model is the formula value; the 62 ms in the same sentence is a slip.
2. [Share evidence: attention fraction, serial layers, prefill-decode configs](https://proceedings.mlsys.org/paper_files/paper/2023/file/c4be71ab8d24cdfb45e3d06dbfca2780-Paper-mlsys2023.pdf) (Efficiently Scaling Transformer Inference) - Section 4.2 with Figure 8 and Table 1 (attention 8 to 31% of decode); Section 4.3 (serial layers cost 14%); Section 4.4 with Figure 1 and Table 2 (prefill versus decode configurations).
3. [Amdahl's law statement and derivation](https://en.wikipedia.org/wiki/Amdahl%27s_law) (Amdahl's law) - Definition and Derivation (overall speedup from optimized share and its speedup, with the worked share examples).

**Focus**

- Small batch time is weight bytes over bandwidth plus 4 latency messages per layer; large batch adds $`2P`$ operations over peak plus model-width vectors over comms bandwidth; the max assumes parallel compute and comms.
- Shares come from profiles, not assumptions: attention is 8 to 31% of decode in the ESTI slice, intermediates about 10% in the FasterTransformer reconciliation.
- Amdahl bounds latency at fixed workload; growing batch or chips to hide a share is a throughput argument, not a bound violation.

**Reproduce:** Closed-book, bound attention work at 31% share (at most 1.45x end to end) and intermediates at 10% (at most 1.11x), then state which you would optimize for latency and why.

**Traps**

- Multiplying kernel speedup by 100% of time. A $`20\times`$ attention win at 31% share gives $`1/(0.69 + 0.31/20) \approx 1.42\times`$ overall; the unaccelerated 69% dominates.
- Assuming overlap. The article takes the max of comms and compute; without measured overlap the honest bound is the sum.
- Beating the bound by adding hardware. More chips remap the workload and change the shares; the bound holds the workload fixed.

**Practice**

- [Transformer Inference Arithmetic exercises 4 and 10: extra GPUs and large-batch verification](https://kipply.github.io/blog/transformer-inference-arithmetic/) - Exercises 4 (more GPUs than capacity needs, 52B on 8 or 16 versus 4) and 10 (52B on 4 GPUs at batch 256: about 21 ms compute, 4 ms comms). Show every substitution; for exercise 10 use $`d_{\text{model}} = 8192`$ with 64 layers and the 300 GB/s comms figure.

**Stop when:** You bound two shares from memory and verify exercises 4 and 10 with every substitution shown.

<details>
<summary>Self-test</summary>

1. Attention is 31% of decode time and you make it infinitely fast. What is the end-to-end gain?
   - At most $`1/(1-0.31) = 1.45`$x; the remaining 69% is untouched.
2. Intermediates are 10% (2.2 of 22 ms). What is the most a perfect fusion earns?
   - $`1/0.9 = 1.11`$x. Measure before fusing; a 10% share caps every fusion there.
3. When is $`\max(\text{compute}, \text{comms})`$ the wrong bound?
   - When the stack does not overlap them. Then time is closer to the sum; state which you assumed and check a timeline.
4. Why can't more chips push decode latency toward zero?
   - Per-layer comms latency does not shrink with batch, so beyond some chip count it dominates; Amdahl on the serial share says the same from the other side.

</details>

#### U8. Strong baselines and the correctness contract

**About 3 h** · **Target:** Explain

Topics: Framework, vendor library, compiler and existing engine baselines; Numerical correctness, output quality and semantic-equivalence contract

A speedup against a weak baseline, or with unchecked outputs, is marketing. Strong baselines plus a correctness contract are what make a later kernel claim believable.

**You can now**

- Choose a strong baseline (library, compiler or engine) at a matched workload and state why a weaker one would flatter the result.
- Reconcile prediction with measurement by naming each residual (bandwidth efficiency, intermediates, comms, launches) with its size.
- Write the correctness contract for an optimization: independent reference, tolerance policy, fallback path and consumed outputs.

**Study**

1. [Model versus FasterTransformer reconciliation](https://kipply.github.io/blog/transformer-inference-arithmetic/) (Transformer Inference Arithmetic) - comparing against real benchmarks (the 1-GPU 76% and 2-GPU 62% accounting; the prefill shortfall with 72% and 54% skinny-GEMM efficiency). Depth: The benchmark totals cover the context (prefill) time plus 10 generated tokens: $`(283.60 - 63.17)/10 = 22.0`$ ms per token is the 1-GPU run and $`(180.86 - 45.45)/10 = 13.5`$ ms the 2-GPU run. Several intermediate values are rounded loosely (18.5, 20.7 and 9.5 ms); recompute them.
2. [Expected-versus-observed profile checks](https://jax-ml.github.io/scaling-book/profiling/) (How to Scale Your Model - Inference) - Looking at a real(ish) example profile (95.6 ms expected against 96 ms observed; the 128 MB ReduceScatter check).
3. [Reference and fallback contracts](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/gpu-microbenchmark-kernel-suite.md) (GPU Microbenchmark and Kernel Suite) - Architecture constraints (independent references, output consumed before any speed claim, fallback for every custom path); Correctness requirements.

**Focus**

- Predict first in bytes and operations (8.4 ms on 2 GPUs, 16.8 on 1), then account the gap: 90% versus 87% bandwidth, 2.2 versus 2.0 ms intermediates, 1.7 ms unparallelized comms.
- Prefill shortfalls diagnose differently from decode: 72% and 54% of peak on skinny GEMMs is an efficiency finding, not a bandwidth one.
- The reference never shares the target's logic, outputs are consumed before any speed claim, and every custom path keeps a fallback.

**Reproduce:** Closed-book, reconcile the 1-GPU case: $`16.8/0.9 \approx 18.7`$ ms plus 2.2 ms of intermediates gives about 20.9 ms against 22.0 measured, leaving about 1.1 ms of named sub-millisecond residuals (the article rounds to 18.5, 20.7 and 1.4). Then reconcile the 2-GPU case at 87% bandwidth.

**Traps**

- Comparing predictions with the benchmark totals. The 180.86 and 283.60 ms runs include the context time and 10 output tokens; subtract the context and divide by 10 before reconciling per-token steps.
- Fitting constants after the fact. Each residual needs an independent line (profiled bandwidth, counted passes, timed comms); unexplained remainder stays unexplained.
- Skipping output consumption. An unmaterialized or unchecked output can delete the very work you claim to time; the harness constraint exists for this.

**Practice**

- [Transformer Inference Arithmetic: reconcile the FasterTransformer comparison by hand](https://kipply.github.io/blog/transformer-inference-arithmetic/) - comparing against real benchmarks (recompute the article's 18.5 and 20.7 ms at 90% bandwidth, about 18.7 and 20.9, and its 9.5 and 11.7 ms at 87%, about 9.7 and 11.7, then explain the prefill gap from the 72% and 54% efficiencies before reading on)

**Stop when:** Your hand reconciliation lands within a millisecond per case with every residual named, and you can state the baseline and contract for your unit-4 sweep.

<details>
<summary>Self-test</summary>

1. What do the 76% and 62% figures mean, and what closes each gap?
   - Prediction over measurement per token. 1 GPU: 90% bandwidth plus 2.2 ms intermediates closes to about 20.9 of 22.0. 2 GPUs: 87% bandwidth, 2.0 ms intermediates and 1.7 ms comms close to 13.4 of 13.5.
2. Why is the prefill shortfall not a bandwidth finding?
   - Prefill there is compute-bound, yet GEMMs reach only 72% and 54% of peak; skinny shapes underuse the matmul units, matching the cited paper's Figure 14 pattern.
3. Why must the reference avoid sharing the target's logic?
   - A shared bug passes both sides. Independence is what lets agreement mean correctness instead of coincidence.
4. When is an exact match required, and when is a tolerance the contract?
   - Exact where the math is exact (integer counts, layouts); dtype, order and conditioning set the tolerance everywhere else.

</details>

#### U9. Manifests, claim schemas, predictions declared first and artifact lineage

**About 4 h** · **Target:** Explain + Implement

Topics: Hardware, firmware, driver, toolkit, compiler, library and configuration manifest; Claim schema with workload, hardware, baseline, timing boundary and correctness method; Prediction, falsifying signals and decision rule declared before profiling; Raw trials, traces, counters, code revision and generated report lineage

Numbers without manifests and lineage cannot be checked, so they cannot gate later work. The section checkpoint demands a versioned claim with artifacts; this unit builds that file.

**You can now**

- Write a hardware and software manifest that lets a stranger rerun one timing (device, driver, toolkit, clocks and power, config, code revision).
- Declare workload, baseline, timing boundaries, prediction and falsifying signal before profiling, in a fixed claim schema.
- Store raw trials, traces and generated reports with lineage from code revision to number, separating cold, warm and end-to-end invocation.

**Study**

1. [Harness schema, manifest and lineage](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/gpu-microbenchmark-kernel-suite.md) (GPU Microbenchmark and Kernel Suite) - Core requirements (harness fields, raw samples); Architecture constraints (named timing boundaries with cold and warm separated); Measurement requirements (labeled hardware with bytes, operations and uncertainty); Milestones A and B.
2. [Declare the SLO before the sweep](https://arxiv.org/html/2407.07000v2) (Etalon) - Section 4.2 (black-box and capacity recipes); Section 5.2 (the service SLO fixed before the capacity search: 99% of requests below a 10% deadline miss rate at a 25 ms target TBT).

**Focus**

- Name every timing boundary (which event starts and stops each interval); asynchronous launch makes an unnamed boundary meaningless.
- Predictions precede profiles: the SLO is fixed before the load sweep, and a miss moves the claim, not the target.
- Raw samples are kept with environment capture; medians and uncertainty are computed from them, never quoted from a single best run.

**Reproduce:** From memory, write the manifest and claim record for your unit-4 sweep: hardware, driver, toolkit, clocks and power note, workload, baseline, timing boundaries, prediction with falsifying signal, and raw-file lineage.

**Traps**

- Filing the manifest after tuning. Changed configs invalidate recorded trials; resume only under identical configuration.
- Storing summaries instead of trials. A median without raw samples cannot be re-cut when the SLO changes.
- Declaring the prediction after seeing the profile. A bound fitted to its own measurement predicts nothing; residuals explain, constants do not.

**Practice**

- The section mini-project covers this: environment manifest, independent references and raw-trial storage with artifact lineage.

**Stop when:** A stranger can rerun your unit-4 sweep from your manifest and claim alone and land inside your stated uncertainty.

<details>
<summary>Self-test</summary>

1. What must a manifest contain for one GPU timing?
   - Device model and memory, driver, toolkit and compiler versions, clocks and power capture, workload and config, timing boundaries, and the code revision behind the binary.
2. What fields does a performance claim fix before profiling?
   - Workload, hardware, baseline, timing boundaries, correctness method, prediction with a falsifying signal, and the artifact lineage.
3. Why keep raw trials instead of just medians?
   - SLOs change, and re-cutting percentiles plus uncertainty needs the samples; a single best run is not evidence at all.
4. The sweep misses the declared SLO. What changes: the target or the claim?
   - The claim. Moving the target after the fact turns the evaluation into a description of whatever happened.

</details>

#### U10. Training-step operation, activation and communication arithmetic

**About 3 h** · **Target:** Derive

Topics: Training-step operation, activation and communication arithmetic

Inference arithmetic is half the track's modeling. Training steps set the scale of the systems later sections parallelize, and the 6ND plus memory lines are the bridge.

**You can now**

- Derive per-step training operations (about $`6ND`$) from the forward plus backward walks.
- Account parameter, Adam-state and checkpoint-activation bytes for a named config.
- Predict compute-bound versus comms-bound training for a batch and topology from the sharding rule.

**Study**

1. [Training problems: parameters, Adam and activation bytes, step time](https://jax-ml.github.io/scaling-book/training/) (How to Scale Your Model - Training) - Some Problems to Work, Questions 1 to 3 with answers (13B parameters; 130 GB optimizer-state line; 42 TB checkpoint activations at 16M tokens; the 300 ms step with its comms-bound verdict).
2. [Data-parallel and FSDP comms-bound rules](https://jax-ml.github.io/scaling-book/training/) (How to Scale Your Model - Training) - Data Parallelism (10 bytes per parameter with Adam) and Fully-Sharded Data Parallelism (FSDP) (the per-device batch over $`C/W_{\text{ici}}`$ rule with the LLaMA-3 70B 6.3e24 example).

**Focus**

- Forward is about $`2ND`$, backward about $`4ND`$ (weight gradients plus input gradients); the $`6ND`$ total shows directly in the step recomputation.
- Adam in fp32 with bf16 weights costs 10 bytes per parameter (2+4+4); the 13B line is 130 GB before any activation.
- Checkpoint activations scale with batch times layers (42 TB at 16M tokens); batch, not depth alone, forces the sharding choice.
- FSDP and data parallelism stay compute-bound while the per-device batch exceeds the interconnect ratio, 2550 divided by the number of mesh axes on v5p (850 over all three); below it, comms sets the step.

**Reproduce:** Closed-book, derive the Question 3 step: $`6 \times 3 \times 10^6 \times 13 \times 10^9 = 2.34 \times 10^{20}`$ operations at 40% of $`4096 \times 4.6 \times 10^{14}`$ FLOP/s gives about 310 ms (the chapter rounds to 300), and state why pure FSDP is comms-bound there.

**Traps**

- Using $`2ND`$ for a training step. Inference's forward-only count misses the backward's two matmuls per layer; the step is $`6ND`$.
- Forgetting optimizer state in the fit. The two fp32 moments cost 8 bytes against 2 for weights; the bf16 parameters are a fifth of the 130 GB line, not all of it.
- Quoting the chapter's 300 ms as exact. It rounds 310 ms at assumed 40% utilization; your utilization and hardware change the step, not the operation count.

**Practice**

- [Training Problems 2 and 3: Adam and activation bytes with the step-time verdict](https://jax-ml.github.io/scaling-book/training/) - Some Problems to Work, Questions 2 and 3 (recompute the 130 GB line, the 42 TB line at 16M tokens, and the 310 ms step at 40% utilization before opening the answers)

**Stop when:** You derive 6ND, 130 GB, 42 TB and the 310 ms step without notes and call the comms-bound verdict with the batch rule.

<details>
<summary>Self-test</summary>

1. Why $`6ND`$ per training step and not $`2ND`$?
   - Forward costs about $`2ND`$; backward costs about $`4ND`$ (one gradient per weight matrix plus one per input), totaling $`6ND`$, or $`6N`$ per token.
2. How much memory do 13B bf16 parameters with fp32 Adam take, and why?
   - $`(2 + 4 + 4) \times 13 \times 10^9 = 130`$ GB: 2 bytes of weight plus 4 bytes per moment accumulator.
3. What forces sharding at 16M tokens with 3 checkpoints per layer?
   - About 42 TB of checkpoint activations: $`2LB(D + 2F) = 2 \times 40 \times 16 \times 10^6 \times (5120 + 2 \times 13824) \approx 4.2 \times 10^{13}`$ bytes. No single device holds that beside the optimizer state.
4. Why is Question 3 comms-bound under pure FSDP?
   - 3M tokens sit below the 3.48M minimum for 4096 chips ($`850 \times 4096`$), so communication exceeds compute at that batch.

</details>

### Mini-project: Workload arithmetic and a falsifiable claim record for kernellab

**About 10 to 14 hours.** Start the one repository the whole track builds on. Create kernellab with `harness/`, `kernels/cuda/`, `kernels/triton/`, `refs/`, `tests/`, `profiles/`, `reports/` and `manifests/`, then fix one transformer workload, derive its operations and bytes, sweep one batched matmul from floor to plateau, and file a claim record with a prediction and a falsifier before any later kernel is timed. The harness, the manifests and the sweep carry into every later section.

1. Create kernellab with `harness/`, `kernels/cuda/`, `kernels/triton/`, `refs/`, `tests/`, `profiles/`, `reports/` and `manifests/` directories. Write `manifests/env.json` with GPU name, driver, toolkit, PyTorch and CUDA versions, `nvidia-smi -q -d CLOCK` output and the SM clock observed during timing, plus the code revision. Every later run appends its raw trials to `reports/` with the revision that produced them, so any number traces back to code, workload and hardware.
2. Fix one workload card with medians, spread and an arrival note: prompt length, output length, batch, dtype and shape medians plus whether arrivals are closed loop or Poisson. Include the worked card with $`P = 4096`$, $`G = 1024`$ and $`B = 16`$: sequences finishing per step 1/64 and tokens evicted per step 80. State which cold trials are discarded (first compile, first weight load, first autotune) before the warm median is read.
3. Sweep bf16 `[B, 4096] x [4096, 4096]` matmuls on the desktop RTX 3050 6 GB with CUDA events, warmup and interleaved repeats, plus a device-to-device copy at the same sizes. Plot achieved TFLOP/s against $`B`$ and report the knee and the small-batch floor. On the reference card with PyTorch 2.14.1 every $`B`$ from 1 to 16 took 0.24 to 0.29 ms, throughput was 6.5 TFLOP/s at $`B = 64`$, 13.4 at 128, 14.2 at 256, 14.8 at 1024 and 16.0 at 4096, and the copy reached 151.4 GB/s for a plateau ratio near 95 with the knee between 64 and 128. Your numbers will differ; the target is a knee near your own measured peak-over-bandwidth ratio, with raw samples kept.
4. Derive the workload arithmetic closed-book for the invented 18.4e9 parameter model: dense decode work $`2 \times 18.4 \times 10^9 = 3.68 \times 10^{10}`$ operations per token, attention $`4 \times 8192 \times 32 \times 256 \times 64 = 1.72 \times 10^{10}`$ at cached length 8192 for a total near $`5.4 \times 10^{10}`$, int8 key-value bytes per token 262144, and the 13B bf16 cache at 8192 context near $`6.7 \times 10^9`$ bytes with the 81920 byte per token GQA int8 variant. Time the sweep from the previous step against these counts and name the bound on each side of the ridge.
5. Implement Etalon Algorithm 1 in `refs/` and score the two Section 4 traces at 100 ms deadline: both take one TBT miss in 11 while fluidity-index gives 1.0 to the 10 ms system and 10/11 to the 100 ms system. Apply it to one real timestamp trace with a fitted prefill deadline, then bound attention work at 31 percent share (at most 1.45x end to end) and intermediates at 10 percent (at most 1.11x) with the formula $`S = 1/(1-f+f/r)`$, and reconcile the 1-GPU FasterTransformer case as $`16.8/0.9`$ near 18.7 ms plus 2.2 ms of intermediates near 20.9 ms against 22.0 measured.
6. File one claim record in `manifests/` before profiling: workload, hardware, baseline, timing boundary, correctness method, prediction and the falsifying signal that would reject it. Name a strong baseline at matched workload (library, compiler or engine, with precision and flags), keep an independent reference that shares no logic with the timed path, and consume and check outputs before any speed claim. Add the training-step check as a derived extra: $`6 \times 3 \times 10^6 \times 13 \times 10^9`$ operations near 310 ms at the stated peak share, with the comms-bound verdict for pure FSDP stated as a prediction.

**Deliverables**

- kernellab with `harness/`, `kernels/cuda/`, `kernels/triton/`, `refs/`, `tests/`, `profiles/`, `reports/` and `manifests/`, the environment manifest and the workload card with medians, spread and arrival note.
- The bf16 batch sweep with raw interleaved trials, the copy result, the knee and floor, and the ridge calculation from measured peak over measured bandwidth.
- The closed-book arithmetic sheet, the Algorithm 1 scores 1.0 and 10/11, the Amdahl bounds and the 1-GPU reconciliation with named residuals.
- One filed claim record with prediction, falsifier, baseline, boundary and lineage from revision to number.

**Checks**

- rubric: Self-grade with the rubric below.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Arithmetic before timing | The sheet derives dense, attention and byte counts against independent references, and every timed number traces to a manifest, a workload card and raw trials. | Each residual names an independent line (profiled bandwidth, counted passes, timed comms) and leaves unexplained remainder unexplained. |
| Cold and warm separation | Cold trials are discarded by rule, warm medians come from interleaved repeats with raw samples kept, and the knee is compared with the measured ratio. | The report shows a rotating-buffer repeat and states which cache state each run preserves. |
| SLO and bound discipline | Algorithm 1 returns 1.0 and 10/11 on the toy pair, Amdahl bounds are derived before profiling, and the strong baseline is matched in workload, precision and flags. | The write-up shows a case where peak throughput ranks two systems differently from the SLO qualified rate. |

Feeds into: Capstone laboratory: the harness, manifests, workload card, sweep and claim record are its foundation. Later sections add kernels, counters, timelines and integrations inside the same kernellab layout.

### Resource route

- **Primary - Book:** [How to Scale Your Model - Inference](https://jax-ml.github.io/scaling-book/inference/) - Work through the single-request, batching, key-value memory and parallelism arithmetic. Recompute every quantity for the small model and workload used by the track project, keeping symbols, units and assumptions visible.
- **Reference - Reference:** [AI Performance Engineering - Start Here](https://github.com/wafer-ai/gpu-perf-engineering-resources) - A curated, dated index. Its Start Here list names the readings this section already assigns; use the later sections only to find a primary source for a later section, never as the reading itself.
- **Required - Article:** [Transformer Inference Arithmetic](https://kipply.github.io/blog/transformer-inference-arithmetic/) - Reproduce the FLOP, parameter-byte, key-value-byte and communication estimates for dense transformer inference. Compare the formulas with an instrumented framework trace and explain model residuals instead of fitting constants after measurement.
- **Required - Paper:** [Efficiently Scaling Transformer Inference](https://proceedings.mlsys.org/paper_files/paper/2023/file/c4be71ab8d24cdfb45e3d06dbfca2780-Paper-mlsys2023.pdf) - Study the latency, memory and parallelism model. Use the paper to derive a batch and parallelism crossover for your workload, while reserving distributed execution for GPU-9.
- **Support - Paper:** [Etalon](https://arxiv.org/html/2407.07000v2) - Read the latency metric definitions, their pitfalls and fluidity-index. Add TTFT and TPOT SLOs to a small load generator, and show why peak token throughput can rank two systems differently from an SLO-qualified rate.
- **Support - Project:** [GPU Microbenchmark and Kernel Suite](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/gpu-microbenchmark-kernel-suite.md) - Adopt the project harness schema, architecture constraints and hardware tiers now. Implement only the environment manifest, independent references, raw-trial storage and the initial operation and byte models in this stage.
- **Required - Book:** [How to Scale Your Model - Training](https://jax-ml.github.io/scaling-book/training/) - Work Some Problems to Work Questions 1 to 3 for training-step parameters, Adam and activation bytes and step time; read Data Parallelism and Fully-Sharded Data Parallelism for the comms-bound batch rule.
- **Reference - Reference:** [Amdahl's law](https://en.wikipedia.org/wiki/Amdahl%27s_law) - Read Definition and Derivation for the overall-speedup formula with the worked share examples; apply it to kernel time shares at fixed workload.
- **Support - Paper:** [DistServe: Disaggregating Prefill and Decoding for Goodput-optimized LLM Serving](https://arxiv.org/html/2401.09670v3) - Read Section 1 with Figure 1 for per-GPU goodput: the highest request rate served while a target share of requests meets the TTFT and TPOT SLOs.

### Exit checkpoint

Predict operations, useful and allocated bytes, key-value memory, latency regimes and an end-to-end speedup bound for one request, then reconcile the model with a cold and warm trace under a versioned claim and artifact schema.

<details>
<summary>Deliberately left for later</summary>

- Transformer derivations and model architecture study already owned by LLM Foundations
- Fleet procurement and organization-wide inference economics
- Unmeasured vendor peak claims or production-scale throughput claims without the named hardware

</details>

## GPU-2. GPU Execution, Memory and Code Generation

**Why:** Kernel performance follows from how threads, memory transactions and machine instructions map onto a real device. This stage builds the execution model needed to predict coalescing, divergence, resource limits and compilation behavior before using a profiler.

### Learn this much

- [ ] Host, device, kernels and heterogeneous execution boundaries _(Required)_
- [ ] Grids, blocks, threads and multidimensional index mapping _(Required)_
- [ ] Warp formation, active lanes and partial warps _(Required)_
- [ ] Streaming multiprocessors, block scheduling and residency _(Required)_
- [ ] Warp scheduling, dependency latency and latency hiding _(Required)_
- [ ] Occupancy constraints from threads, warps, registers and shared memory _(Required)_
- [ ] Registers, local memory and spill behavior _(Required)_
- [ ] Global memory, L1 and L2 caches and memory transactions _(Required)_
- [ ] Shared memory banks, conflicts, padding and broadcast _(Required)_
- [ ] Constant and read-only cache use cases _(Optional)_
- [ ] Address patterns, alignment, vector width and coalescing _(Required)_
- [ ] Control divergence, predication and reconvergence _(Required)_
- [ ] Warp, block, cluster, device and system synchronization scopes _(Required)_
- [ ] Atomics, memory visibility and ordering vocabulary _(Required)_
- [ ] Launch dimensions, dynamic shared memory and resource validation _(Required)_
- [ ] Compute capability, device properties and feature detection _(Required)_
- [ ] Device allocation, copies and explicit ownership _(Required)_
- [ ] Grid-stride loops, tails, zero sizes and bounds safety _(Required)_
- [ ] CUDA source through host code, device code, PTX and machine code _(Required)_
- [ ] NVCC architecture, code-generation and compatibility flags _(Required)_
- [ ] PTX virtual ISA, address spaces and target features _(Required)_
- [ ] Cubin, fatbinary, SASS, cuobjdump and nvdisasm _(Required)_
- [ ] Tensor shape, stride, dtype, stream and error contracts at a native extension _(Required)_
- [ ] Alignment, aliasing, layout and compiler optimization constraints _(Required)_
- [ ] Architecture capability checks and correct fallback paths _(Required)_
- [ ] TMA, clusters, tensor memory and current architecture features _(Depth)_
- [ ] AMD, TPU and Trainium execution models _(Later)_

### Study units

#### U1. Host, device, kernels, index mapping and explicit device memory

**About 4 h** · **Target:** Explain + Implement

Topics: Host, device, kernels and heterogeneous execution boundaries; Grids, blocks, threads and multidimensional index mapping; Device allocation, copies and explicit ownership

Every kernel starts with a mapping and an ownership boundary. Getting those right lets later experiments change performance without changing the operation.

**You can now**

- Map one- and two-dimensional launches to distinct output elements, including edge threads.
- Implement explicit device allocation, input copies, a kernel launch, result validation and cleanup.
- Explain which work runs on the host and why a successful launch is not evidence of completion.

**Study**

1. [PMPP, 4th edition: kernels, copies and multidimensional mapping](https://shop.elsevier.com/books/programming-massively-parallel-processors/hwu/978-0-323-91231-0) (Programming Massively Parallel Processors, 4th edition - Chapters 2 to 6) - Sections 2.2 to 2.6 and 3.1 to 3.2.
2. [CUDA Programming Guide 13.4.2: explicit memory and error handling](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/intro-to-cuda-cpp.html#explicit-memory-management) (CUDA Programming Guide) - Sections 2.1.3.2, 2.1.4 and 2.1.7.1 to 2.1.7.2.

**Focus**

- A grid contains blocks; each block contains threads. Compute row and column separately, then use the storage layout to form the element offset.
- Allocation and copy sizes are bytes, not element counts. Keep ownership of each allocation on the host and release it on every error path.
- Kernel launch is asynchronous. Check `cudaGetLastError()` after launching and check the completion operation before consuming results.

**Reproduce:** From a blank CUDA C++ program, add 1003 single-precision elements with inputs `a[i] = float(i)` and `b[i] = 1.0f`. Use four blocks of 256 threads, explicit allocation and copies, and a bounds check. All 1003 results must equal `float(i + 1)` exactly; 21 launched threads must perform no memory access. Check every CUDA return value and free all allocations.

**Traps**

- Dereferencing an ordinary `cudaMalloc` device pointer on the CPU. Passing the pointer to a runtime API is not the same as accessing its pointee.
- Using the grid width instead of the tensor row stride to flatten a two-dimensional address.
- Treating a successful launch check as proof that the kernel has finished without an execution error.

**Practice**

- The section mini-project covers this: the `kernellab` explicit-memory vector-add baseline, two-dimensional index map and independent host-reference tests.

**Stop when:** Your vector-add baseline passes lengths 0, 1, 31, 32, 33 and 1003, with zero length handled on the host, and you can draw a rectangular launch's address map without running it.

<details>
<summary>Self-test</summary>

1. Why does the 1003-element launch need a guard even though the grid covers the input?
   - Four blocks contain 1024 threads. The last 21 have indices outside the allocation; covering the input does not make those addresses valid.
2. Does using a two-dimensional grid make the input tensor two-dimensional in memory?
   - No. Launch coordinates and storage layout are separate. The kernel must compute an address from the tensor's actual layout.
3. What must happen before the host checks the output?
   - Kernel writes must complete and the results must be accessible to the host. In this explicit-memory program, check synchronization and the device-to-host copy before reading the host buffer.

</details>

#### U2. Warps, SMs, block residency and latency hiding

**About 4 h** · **Target:** Explain + Derive

Topics: Warp formation, active lanes and partial warps; Streaming multiprocessors, block scheduling and residency; Warp scheduling, dependency latency and latency hiding

A launch describes logical parallelism, not simultaneous execution. Latency hiding depends on ready work at the scheduler, not just the number of threads launched.

**You can now**

- Predict warp membership and inactive positions for multidimensional and nonmultiple-of-32 blocks.
- Distinguish resident, eligible and issuing warps, and explain how scheduling hides dependency latency.
- Explain why a block stays on one SM but its warps do not all execute at once.

**Study**

1. [PMPP, 4th edition: block and warp scheduling](https://shop.elsevier.com/books/programming-massively-parallel-processors/hwu/978-0-323-91231-0) (Programming Massively Parallel Processors, 4th edition - Chapters 2 to 6) - Sections 4.1 to 4.2, 4.4 and 4.6.
2. [MIT 6.S894 Fall 2025 Lab 2: FMA latency and instruction-level parallelism](https://accelerated-computing.academy/fall25/labs/lab2) (MIT 6.S894 Accelerated Computing (Fall 2025) - Lectures 2 to 5 and Labs 2 and 3) - Background: A Closer Look at the Hardware; Part 0 (Prelab): Instruction Latency of an FMA, through Prelab Question 3. Depth: Use the GPU material only. The RTX 4000 Ada scheduler counts and clocks describe the course machine, not your GPU. Stop before Using ILP in a Simple Program.

**Focus**

- Linearize within a block with the x coordinate fastest. Warps never combine threads from different blocks.
- All warps of a block reside on one SM. A normal launch does not promise a particular block-to-SM assignment or block order.
- A resident warp can be stalled. Another eligible warp or independent instructions within the same warp can cover the wait without reducing the instruction's dependency latency.

**Reproduce:** Draw the warp map for `dim3 block(16, 3, 1)`. Warp 0 contains both complete rows with y coordinates 0 and 1; warp 1 contains the 16 threads of row 2 and has 16 unused positions. Two such blocks allocate four warps, not three. Verify the map with a kernel that writes each thread's linear index, warp index and lane index to a separate output slot.

**Traps**

- Counting CUDA cores as simultaneously resident threads. Residency and execution throughput are different limits.
- Assuming one block per SM because the grid has as many blocks as SMs. Correctness cannot depend on that scheduling choice.
- Calling an independent-chain benchmark's elapsed cycles per FMA the latency of a dependent FMA. It measures a different quantity.

**Practice**

- [MIT 6.S894 Fall 2025 Lab 2: FMA prelab Questions 1 to 3](https://github.com/accelerated-computing-class/lab2/blob/main/fma_latency.cu) - Complete `fma_latency`, `fma_latency_interleaved` and `fma_latency_no_interleave`. Build locally with `nvcc -O3 -arch=sm_86 fma_latency.cu -o fma_latency`, not Telerun. Use long dependent chains, consume their results, and inspect SASS for retained FMAs. Reset inputs between variants and use bounded finite values. The starter prints whole-snippet cycles, so divide by the retained FMA count and account for timer overhead. Repeat interleaved trials and report medians, hardware and toolkit; no course latency or speedup is a target. This is an investigative lab, not an autograded correctness suite.

**Stop when:** You predict the two-block warp map correctly and can explain the prelab's dependent-chain and independent-chain measurements using the actual SASS, without claiming a fixed speedup.

<details>
<summary>Self-test</summary>

1. Can the final 16 threads of two 48-thread blocks share one warp?
   - No. Each block independently allocates two warps; the unused positions of its final warp cannot be filled by another block.
2. Why can an SM stall with many resident warps?
   - All those warps may be waiting on dependencies, memory or synchronization, leaving no eligible instruction to issue.
3. Does interleaving independent FMA chains make a dependent FMA finish sooner?
   - No. It exposes independent work during the wait and may improve throughput; the producer-to-consumer dependency latency is unchanged.

</details>

#### U3. Occupancy limits, registers, spills and launch resources

**About 4 h** · **Target:** Derive + Measure

Topics: Occupancy constraints from threads, warps, registers and shared memory; Registers, local memory and spill behavior; Launch dimensions, dynamic shared memory and resource validation

Registers and shared memory can save traffic while reducing residency. Occupancy is a resource bound to reconcile with measurements, not an optimization score.

**You can now**

- Derive resident-block limits from threads, warps, blocks, registers and shared memory.
- Validate a compiled kernel's launch resources with device properties, compiler reports and the occupancy API.
- Sweep block size and resource use, keeping correctness and explaining why higher occupancy need not reduce time.

**Study**

1. [PMPP, 4th edition: resource partitioning](https://shop.elsevier.com/books/programming-massively-parallel-processors/hwu/978-0-323-91231-0) (Programming Massively Parallel Processors, 4th edition - Chapters 2 to 6) - Section 4.7.
2. [CUDA C++ Best Practices Guide 13.4: occupancy and local memory](https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html#occupancy) (CUDA C++ Best Practices Guide) - Sections 10.2.4, 10.2.7.1, 11.1 to 11.4. Depth: Do not adopt Section 11.1's assertion that low occupancy always degrades performance. Section 11.3 itself explains that sufficient instruction-level parallelism can cover latency at low occupancy. Skip historical calculator screenshots.
3. [CUDA Programming Guide 13.4.2: launch and memory resource limits](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/writing-cuda-kernels.html#kernel-launch-and-occupancy) (CUDA Programming Guide) - Sections 2.3.3.2.2 to 2.3.3.4 and 2.3.7.

**Focus**

- Calculate whole resident blocks, then resident warps divided by the SM's warp maximum. Include every resource limit and allocation granularity; a continuous bytes-per-thread estimate is not enough.
- Read `numRegs` and static shared bytes from compiled-kernel attributes. Add dynamic shared bytes supplied at launch; compare the estimate with `cudaOccupancyMaxActiveBlocksPerMultiprocessor`.
- Local memory is thread-private device memory, not an on-chip scratchpad. A local array is not necessarily a spill; inspect the compiler's spill report and final code.
- Compare event-timed, correctness-checked variants with warmup and interleaved repeated trials. If counters are permitted, inspect Nsight Compute's Occupancy section; otherwise report theoretical occupancy and timings separately.

**Reproduce:** Derive TensorTonic's first occupancy example with 100 threads per block, warp size 32, 64 registers per effective thread and 2048 shared bytes per block. The supplied SM limits are 1024 effective threads, 32 warps, 16 blocks, 32768 registers and 49152 shared bytes. Its simplified model allocates four warps and 128 effective threads per block. Registers permit four blocks, hence 16 resident warps and 50% occupancy. Then sweep a compiled vector-add kernel at 128, 256 and 512 threads, with 0, 16384 and 32768 dynamic shared bytes, recording the API's block limit and event-time median rather than predicting a speed ranking.

**Traps**

- Using `sharedMemPerBlock` or `regsPerBlock` as the SM capacity. Per-block legality and per-SM residency are separate checks.
- Forcing a register cap and assuming the reduced register count is a free improvement. Spills or recomputation can erase the residency gain.
- Equating theoretical occupancy with achieved occupancy or the fraction of cycles doing useful work. A small grid or stalled warps can leave the machine underused.

**Practice**

- [TensorTonic: GPU Occupancy Calculator](https://www.tensortonic.com/problems/cs336-l05-gpu-occupancy-calculator) - Implement `gpu_occupancy`; work its three public cases: register-limited, shared-memory-limited and oversized block. This free problem deliberately omits hardware allocation rounding beyond whole warps. Solve that stated model, not an undocumented approximation to an actual SM. The section mini-project covers the compiled-kernel sweep, spill diagnosis and per-block launch validation; compare the real kernel with the CUDA occupancy API.

**Stop when:** Your calculator matches the public examples, and your real-kernel sweep identifies each limiting resource, reconciles API versus hand estimates and retains timings without treating occupancy as speed.

<details>
<summary>Self-test</summary>

1. Why is TensorTonic's first example limited to four blocks rather than eight?
   - Each block uses 8192 registers in the stated model. The 32768-register budget allows four blocks even though thread and warp budgets allow eight.
2. Can a declared local array be implemented in registers?
   - Yes, if the compiler can scalarize its accesses and resources permit. A source declaration does not prove a particular final placement.
3. Why might allocating unused dynamic shared memory change time?
   - It changes residency and possibly the L1/shared-memory carveout without changing useful arithmetic. Those effects can change latency hiding and caching, so this is not a perfectly isolated occupancy-only control.

</details>

#### U4. Global memory, caches, transactions and coalescing

**About 4 h** · **Target:** Derive + Measure

Topics: Global memory, L1 and L2 caches and memory transactions; Address patterns, alignment, vector width and coalescing

Threads that are adjacent in a tensor need not request adjacent bytes. The address pattern of each instruction determines coalescing; caches then determine how much of that traffic reaches device memory.

**You can now**

- Derive the aligned memory sectors touched by each warp instruction, including offsets, strides and access widths.
- Distinguish useful bytes, requested sectors, cache hits and traffic reaching device memory.
- Measure paired access patterns and explain discrepancies between sector predictions and elapsed time.

**Study**

1. [PMPP, 4th edition: coalescing and memory latency](https://shop.elsevier.com/books/programming-massively-parallel-processors/hwu/978-0-323-91231-0) (Programming Massively Parallel Processors, 4th edition - Chapters 2 to 6) - Section 6.1, Figures 6.1 to 6.4; Section 6.2 through Figure 6.8. Depth: Stop before the toy channel assignment in Figure 6.9. Use CUDA's sector model below rather than treating a DRAM burst as the transaction unit of every GPU.
2. [CUDA C++ Best Practices Guide 13.4: aligned, offset and strided accesses](https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html#coalesced-access-to-global-memory) (CUDA C++ Best Practices Guide) - Sections 10.2.1.1 to 10.2.1.4.
3. [CUDA Programming Guide 13.4.2: device caches](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/writing-cuda-kernels.html#caches) (CUDA Programming Guide) - Section 2.3.3.6, Caches.
4. [NVIDIA: vectorized memory access, August 4, 2025](https://developer.nvidia.com/blog/cuda-pro-tip-increase-performance-with-vectorized-memory-access/) (NVIDIA CUDA Pro Tips: grid-stride loops and vectorized memory access) - Opening scalar copy kernel and SASS, then the vector-type and alignment discussion through the aligned `int2` pointer-offset example. Depth: Stop before the structure example and full vector-copy kernels. Their remainder handler relies on a thread whose index can lie outside the launched grid, so it can skip the tail. Treat performance improvements as hypotheses, not guarantees.

**Focus**

- For compute capability 6.0 and later, count distinct aligned 32-byte sectors touched by the active lanes of one instruction. Permuting the same addresses does not change that count.
- Count every byte of a wide access, including sector crossings. A wider instruction may reduce instruction count without reducing useful bytes or aggregate sectors for the same work.
- L1 is local to an SM and L2 is shared across SMs. Requested sectors are not measured DRAM bytes; cache reuse can make the timing penalty smaller than a per-warp sector ratio.
- A base allocation's alignment does not guarantee an offset view's alignment. Validate the address and tail before using `int2` or `int4` loads.

**Reproduce:** For one fully active 32-lane warp, derive the sector counts for four-byte loads from byte addresses $`4\ell`$, $`4\ell+4`$ and $`32\ell`$, where $`0\leq\ell<32`$ and the base address is 32-byte aligned. Obtain 4, 5 and 32 sectors, with unique useful-byte fractions 100%, 80% and 12.5%. Implement a byte-interval union counter and verify the predictions. In `kernellab`, compare bounds-safe offset and stride copy variants with an independent reference and event timings; do not convert those sector ratios directly into speedups.

**Traps**

- Calling a 128-byte cache line one 32-byte sector. TensorTonic's configurable line model and the CUDA sector model use different transaction units.
- Counting only starting addresses for vector accesses. A load can touch several sectors.
- Calling a copy memory-bound from its source alone. Small arrays can be launch-limited, and cache-resident arrays have a different traffic boundary.

**Practice**

- [TensorTonic: Global-Memory Coalescing Counter](https://www.tensortonic.com/problems/cs336-l05-global-memory-coalescing) - Implement `coalescing_analysis`; work the adjacent-word, separated-line and line-crossing public cases. This free problem counts each requested byte once even where lanes overlap, with a default 128-byte line. Solve its stated model, then repeat your own cases with `cache_line_bytes=32` for the CUDA sector analysis. Its line-crossing case is an abstract byte interval, not permission to issue a misaligned typed CUDA load. The section mini-project covers the paired GPU copies and timings.

**Stop when:** Your counter handles overlaps and crossings, the three sector predictions agree with your derivation, and your paired-copy report separates requested sectors from measured time and any unavailable DRAM counters.

<details>
<summary>Self-test</summary>

1. If lanes reverse the order of 32 adjacent four-byte words at an aligned base, does the sector count change?
   - No. The same four sectors are touched; coalescing depends on the address set, not lane order.
2. Why can an offset copy lose less time than its five-versus-four sector ratio suggests?
   - Adjacent warps can reuse overlapping sectors in cache. The per-warp request count is not the total traffic reaching DRAM.
3. A warp loads one consecutive 16-byte object per lane from a 32-byte-aligned base. How many sectors cover its byte range?
   - Sixteen sectors cover 512 bytes. Wider per-lane loads do not make that byte range fit in four sectors.

</details>

#### U5. Shared-memory banks, conflicts, padding and the constant cache

**About 3 h** · **Target:** Derive

Topics: Shared memory banks, conflicts, padding and broadcast; Constant and read-only cache use cases

On-chip storage does not make every access pattern efficient. Bank mapping and the number of distinct constant addresses within a warp matter as much as placement.

**You can now**

- Predict shared-memory bank IDs and conflict degree for scalar word accesses, including broadcasts.
- Derive when padding a row stride removes column-access conflicts.
- Choose between shared memory, constant memory and read-only global loads for a stated access pattern.

**Study**

1. [PMPP, 4th edition: memory types](https://shop.elsevier.com/books/programming-massively-parallel-processors/hwu/978-0-323-91231-0) (Programming Massively Parallel Processors, 4th edition - Chapters 2 to 6) - Section 5.2.
2. [CUDA Programming Guide 13.4.2: banks, broadcast and padding](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/writing-cuda-kernels.html#shared-memory-access-patterns) (CUDA Programming Guide) - Section 2.3.4.2 before the transpose example; Section 2.3.4.2.2, Shared Memory Bank Conflicts, Figures 17 and 18. Depth: Skip the full transpose implementation in 2.3.4.2.1 here. Derive the bank map before implementing a transpose in the primitives section.
3. [CUDA C++ Best Practices Guide 13.4: constant-cache access](https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html#constant-memory) (CUDA C++ Best Practices Guide) - Section 10.2.6.
4. [CUDA Programming Guide 13.4.2: read-only global loads](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/cpp-language-extensions.html#low-level-load-and-store-functions) (CUDA Programming Guide) - Section 5.4.8.3, the `__ldg` description. Depth: Read only the read-only-load contract, not the list of cache-control intrinsics.

**Focus**

- For aligned scalar 32-bit accesses on the 32-bank model, the bank is $`\lfloor a/4\rfloor\bmod32`$, with byte address $`a`$. Count distinct words per bank, not just requesting lanes.
- Same-word reads can broadcast. Different words in the same bank conflict; same-address competing writes are not a safe broadcast-based algorithm.
- A row-major tile with 32 columns gives column accesses a 32-word stride. Padding to 33 columns changes the bank stride to one modulo 32.
- Constant memory favors few distinct addresses per warp. A read-only global pointer is not a `__constant__` allocation, and a read-only cache is not coherent with writes to that data during the kernel.

**Reproduce:** For a full warp of aligned four-byte shared-memory reads, compute banks for word indices $`\ell s`$ at strides $`s\in\{1,2,3,32,33\}`$. Obtain conflict degrees 1, 2, 1, 32 and 1, assuming distinct words and one scalar access per lane. Then replace all addresses with the same word: the reads broadcast with degree 1. Explain why the same calculation does not prove a general bank rule for vector or 64-bit accesses.

**Traps**

- Applying the scalar bank-conflict rule across separate hardware transactions of a wide instruction. Analyze the actual instruction's transaction groups.
- Adding padding without recalculating addresses and shared-memory capacity. A changed stride can fix one access and alter another.
- Choosing constant memory just because the data never changes. Many distinct addresses in one warp serialize constant-cache requests.

**Practice**

- [TensorTonic: Shared-Memory Bank Conflict Analyzer](https://www.tensortonic.com/problems/cs336-l05-shared-memory-bank-conflicts) - Implement `bank_conflict_analysis`; work all three public cases: adjacent words, four-way conflict and same-address broadcast. This free problem counts distinct addresses per bank and returns a degree for each lane. Treat it as a scalar-read model. Add your own full-warp stride and padded-tile cases; the section mini-project covers paired conflicting and conflict-free kernels.

**Stop when:** Your analyzer passes the public examples and your five stride cases, and you can defend a memory-space choice from the warp's addresses without calling all read-only data constant memory.

<details>
<summary>Self-test</summary>

1. Why does word stride 3 avoid conflicts in this 32-bank scalar model?
   - Three is coprime to 32, so multiplication by three modulo 32 visits every bank once across the 32 lanes.
2. Four lanes read byte addresses 0, 128, 256 and 384. Is this a broadcast?
   - No. They read four different words in bank 0, making a four-way conflict in the stated model.
3. Would a small lookup table with one distinct lookup per lane necessarily favor constant memory?
   - No. Constant requests serialize by distinct address within a warp. Read-only global access may be a better hypothesis, which still needs measurement.

</details>

#### U6. Divergence, predication, grid-stride loops and bounds

**About 3 h** · **Target:** Derive + Implement

Topics: Control divergence, predication and reconvergence; Grid-stride loops, tails, zero sizes and bounds safety

Bounds checks are part of correctness, not an optional performance cost. A grid-stride loop decouples coverage from launch size while preserving adjacent-lane addressing within each iteration.

**You can now**

- Predict divergent paths and useful active lanes for a warp, including a partial tail.
- Implement a bounds-safe grid-stride map with zero-size handling and overflow-aware indexing.
- Use generated code to distinguish branches from predicated instructions rather than guessing from source syntax.

**Study**

1. [PMPP, 4th edition: control divergence](https://shop.elsevier.com/books/programming-massively-parallel-processors/hwu/978-0-323-91231-0) (Programming Massively Parallel Processors, 4th edition - Chapters 2 to 6) - Section 4.5.
2. [CUDA C++ Best Practices Guide 13.4: branches and predication](https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html#branching-and-divergence) (CUDA C++ Best Practices Guide) - Sections 13.1 and 13.2.
3. [NVIDIA: flexible kernels with grid-stride loops](https://developer.nvidia.com/blog/cuda-pro-tip-write-flexible-kernels-grid-stride-loops/) (NVIDIA CUDA Pro Tips: grid-stride loops and vectorized memory access) - Monolithic SAXPY kernel, grid-stride SAXPY kernel, Scalability and thread reuse, and Debugging.

**Focus**

- Divergence is within a warp. Different uniform paths in different warps need not serialize each other as divergent paths of one warp do.
- A source `if` may become a branch, a select or predicated instructions. Inspect the final code before describing the machine's control flow.
- A grid-stride loop starts at the global thread index and increments by the total grid thread count. Each element belongs to one residue class, so coverage is complete without overlapping writes.
- Handle an empty input on the host rather than launching a zero-block grid. Promote operands before index multiplication and define a size limit that also prevents loop-increment overflow.

**Reproduce:** Convert the vector-add baseline to a grid-stride loop. For 1003 elements and a one-block, 128-thread launch, thread 0 handles indices 0, 128, 256, 384, 512, 640, 768 and 896; thread 127 handles seven indices ending at 895. Validate every result against the host reference, then repeat with a one-thread launch and lengths 0, 1, 31, 32 and 33. Use the exact integer-valued single-precision inputs from the programming-model unit, so equality is exact here, not a general floating-point promise.

**Traps**

- Using block size alone as the loop stride in a multi-block grid. Blocks then overlap work.
- Removing the tail guard to avoid divergence. Invalid memory access cannot be traded for speed.
- Assuming a serial GPU launch reproduces all CPU floating-point arithmetic bit for bit. Contraction, precision and operation order can still differ.

**Practice**

- The section mini-project covers this: the `kernellab` grid-stride map, odd and empty tails, paired uniform and divergent control kernels, and source-to-SASS control-flow annotations.

**Stop when:** Your grid-stride map passes the stated lengths with both launch sizes, and you predict lane activity for a new predicate before checking its generated control flow.

<details>
<summary>Self-test</summary>

1. Does `threadIdx.x < 32` diverge a block with 128 threads?
   - It gives different paths to different warps, but each warp's predicate is uniform. It is not within-warp divergence for this one-dimensional launch.
2. Why is a grid-stride map complete even when the grid is smaller than the input?
   - Every valid index has a unique remainder modulo the total grid thread count. That thread reaches the index after a finite number of loop increments.
3. Is converting the completed index product to a wide type sufficient to avoid overflow?
   - No. The multiplication can overflow before conversion. Promote an operand before multiplication and also check the maximum supported size and increment.

</details>

#### U7. Synchronization scopes, atomics and memory ordering

**About 4 h** · **Target:** Explain + Derive

Topics: Warp, block, cluster, device and system synchronization scopes; Atomics, memory visibility and ordering vocabulary

An atomic flag is not automatically a publication protocol. Correct coordination needs both a matching scope and an ordering relation for the payload.

**You can now**

- Choose warp, block, cluster or device coordination from the communicating participants.
- Distinguish atomicity, memory ordering and barriers, and derive a release/acquire publication relation.
- Identify a synchronization hazard caused by divergent participation or inter-block scheduling.

**Study**

1. [CUDA Programming Guide 13.4.2: scope and atomic order](https://docs.nvidia.com/cuda/cuda-programming-guide/03-advanced/advanced-kernel-programming.html) (CUDA Programming Guide) - Section 3.2.3 scope table and Section 3.2.4.1.1. Depth: Read the scoped atomic definitions, not the full producer-consumer sample: its shared flag is not initialized. Cluster and grid cooperative programming are later implementation work.
2. [CUDA Programming Guide 13.4.2: barriers and participating lanes](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/cpp-language-extensions.html) (CUDA Programming Guide) - Sections 5.4.4.1 and 5.4.4.2, `__syncthreads` and `__syncwarp` definitions. Depth: Skip the Section 5.4.4.1 example labelled valid behavior: `shared_data[128 - threadIdx.x]` addresses index 128 for thread 0 in a 128-element array.
3. [CUDA Programming Guide 13.4.2: memory model and publication](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/cuda-cpp-memory-model.html) (CUDA Programming Guide) - Sections 5.7.1, 5.7.3 to 5.7.5. Depth: Trace the message-passing ordering, but do not use an inter-block spin wait as a general grid barrier: waiting resident blocks can prevent a producer block from being scheduled.

**Focus**

- Scope identifies which threads an atomic operation can coordinate. Device scope does not turn the operation into a device-wide barrier; system scope has additional type, alignment and platform prerequisites.
- A release store publishes earlier payload writes to a consumer whose acquire load reads that store, provided both operations have sufficient scope. A relaxed atomic update alone orders no unrelated payload.
- A block barrier requires block-uniform participation and orders participating threads' relevant prior accesses. A warp barrier requires a correct participant mask; implicit lockstep is not a synchronization contract.
- Initialization must happen before flag use. Separate correctness of memory ordering from forward progress: an ordered spin loop can still deadlock under an unsuitable launch.

**Reproduce:** Draw and then implement a two-warp, one-block publication test. Thread 0 initializes a shared integer flag to zero; all 64 threads execute a block barrier. Thread 0 writes payload 42 and uses `cuda::atomic_ref<int, cuda::thread_scope_block>` to release-store flag 1. Thread 32 acquire-loads until it sees 1, then writes the payload to an output slot. The host must observe 42 after checked completion. Explain the initialization barrier and release/acquire happens-before path separately; do not move this protocol to arbitrary blocks without a forward-progress argument.

**Traps**

- Putting a block barrier inside a lane-dependent bounds condition. Guard memory operations while keeping required barrier participation uniform.
- Using `volatile` or a memory fence as a substitute for an atomic flag and a matching acquire operation.
- Calling a successful stress test proof of a racy protocol. A missing ordering relation can remain invisible on a particular run.

**Practice**

- The section mini-project covers this: the `kernellab` initialized block-local publication test, shared-memory producer/consumer barriers and a written scope-and-progress audit. Deliberately racy variants are analyzed, not treated as valid timed kernels.

**Stop when:** Your publication test returns 42, and you can trace its initialization, synchronization scope and happens-before relation without relying on observed lockstep.

<details>
<summary>Self-test</summary>

1. Does a relaxed atomic increment publish an unrelated ordinary write?
   - No. It makes the increment atomic at its scope, but supplies no release/acquire relation for the unrelated payload.
2. Can a device-scoped flag safely coordinate host reads on every platform?
   - No. Host coordination needs a supported system-scoped mechanism and compatible memory, or explicit stream completion and transfer.
3. Why can a correctly ordered inter-block spin protocol hang?
   - Waiting blocks can occupy the available residency slots while the producer remains unscheduled. Memory ordering does not guarantee block scheduling or a global barrier.

</details>

#### U8. From CUDA source to PTX, cubin and SASS

**About 5 h** · **Target:** Explain + Measure

Topics: CUDA source through host code, device code, PTX and machine code; NVCC architecture, code-generation and compatibility flags; PTX virtual ISA, address spaces and target features; Cubin, fatbinary, SASS, cuobjdump and nvdisasm

The compiler can remove, fuse, predicate or scalarize the code you intended to measure. Binary inspection makes the experiment about the instructions that actually execute.

**You can now**

- Explain host compilation, PTX generation, offline assembly and driver JIT without calling PTX the final machine code.
- Build and inspect explicit virtual and real architecture targets, recording toolchain and resource use.
- Connect a source-level hypothesis to retained SASS instructions and a correctness-checked timing comparison.

**Study**

1. [CUDA Programming Guide 13.4.2: compiler trajectory and targets](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/nvcc.html) (CUDA Programming Guide) - Sections 2.7.2, 2.7.3.1, 2.7.4.2 and 2.7.4.3.
2. [CUDA Binary Utilities 13.4: resource reports and disassembly](https://docs.nvidia.com/cuda/cuda-binary-utilities/index.html) (CUDA Binary Utilities 13.4) - Sections 1.1 to 1.2, 2.1.1 to 2.1.3, 3.1.1 and 3.1.4. Depth: Use command examples and line correlation only; skip control-flow graph tooling and instruction tables for architectures other than your target.
3. [PTX ISA 9.4: goals, state spaces and module directives](https://docs.nvidia.com/cuda/parallel-thread-execution/index.html) (Parallel Thread Execution ISA) - Sections 1.2 (Goals of PTX), 5.1 to 5.1.7 (state spaces, including `.reg`, `.param`, `.global`, `.local` and `.shared`) and 11.1.1 to 11.1.3 (`.version`, `.target` and `.address_size`). Depth: Read these sections against your own `map.ptx`: with CUDA 13.4, `-arch=compute_86 -ptx` emits `.version 9.4` and `.target sm_86`, kernel arguments in `.param` and virtual `.reg` registers. Skip the instruction reference beyond the loads, stores and FMA your kernel uses.

**Focus**

- A virtual `compute_86` target defines the PTX feature set; real `sm_86` code is assembled machine code. A fat binary can carry several cubins and PTX for eligible JIT fallback.
- Save compiler version, flags, PTX, cubin resource reports and SASS together. `-lineinfo` aids correlation without the optimization changes caused by device debugging with `-G`.
- PTX registers are virtual and do not equal allocated hardware registers. Use `ptxas` reports, kernel attributes and final binary resource information.
- Annotate global loads/stores, bounds handling, FMA instructions and any local loads/stores in the final code. A source expression is not a guaranteed instruction sequence.

**Reproduce:** For the bounded grid-stride map, run `nvcc -O3 -lineinfo -arch=sm_86 -Xptxas=-v map.cu -o map`, `nvcc -O3 -arch=compute_86 -ptx map.cu -o map.ptx`, and `nvcc -O3 -lineinfo -arch=sm_86 -cubin map.cu -o map.cubin`. Inspect with `cuobjdump --dump-sass --dump-resource-usage map` and `nvdisasm --print-line-info map.cubin`. These are the local RTX 3050 targets; choose matching targets on another device. Locate the retained index calculation, tail handling and stores, then validate and event-time the executable. Report actual registers and spills without assuming a fixed allocation or speedup.

**Traps**

- Counting PTX instructions as hardware issue cost. Assembly and JIT can transform them.
- Benchmarking a `-G` build and generalizing its register use or time to the optimized build.
- Inspecting a different architecture image or stale executable from the one measured. Keep artifact identities and commands in the evidence manifest.

**Practice**

- The section mini-project covers this: the `kernellab` source/PTX/cubin/SASS evidence bundle, compiler resource table and one disassembly-backed paired timing hypothesis.

**Stop when:** Your evidence bundle ties the validated executable to its targets, resource report and annotated final instructions, and distinguishes offline cubin execution from possible PTX JIT.

<details>
<summary>Self-test</summary>

1. Does shipping only an `sm_86` cubin guarantee execution on every later GPU?
   - No. Cubin compatibility is constrained; a different major architecture generally needs its own compatible image or eligible PTX fallback.
2. Why might source multiplication plus addition appear as one instruction?
   - The compiler can contract it to an FMA, subject to compilation rules. Inspect SASS and account for the changed rounding when comparing references.
3. Can a kernel with many PTX register names use few physical registers?
   - Yes. Virtual-register lifetimes can share physical registers after optimization and allocation. The final resource report is the relevant count.

</details>

#### U9. Native extension contracts: shapes, strides, aliasing and layout

**About 5 h** · **Target:** Implement

Topics: Tensor shape, stride, dtype, stream and error contracts at a native extension; Alignment, aliasing, layout and compiler optimization constraints

A correct standalone kernel can become incorrect when passed a tensor view or launched on the wrong stream. The wrapper is part of the algorithm's correctness contract.

**You can now**

- Specify and enforce shape, dtype, device, stride, alignment and aliasing preconditions at a native tensor boundary.
- Launch on the input device's current framework stream while preserving tensor ownership and lifetime.
- Test valid views, empty inputs and rejected inputs against an independent framework reference.

**Study**

1. [PyTorch: custom C++ and CUDA operators, January 20, 2026](https://docs.pytorch.org/tutorials/advanced/cpp_custom_ops.html) (PyTorch custom C++/CUDA operators and CUDA semantics) - Setting up the Build System; Defining the custom op and adding backend implementations through the CUDA registration; Testing an operator; Creating mutable operators, schema discussion only. Depth: Choose one API tab compatible with your installation; the non-ABI-stable ATen path is sufficient here. Do not copy the CUDA sample unchanged: it lacks empty-input handling, same-device validation, a device guard and launch-error checks, and narrows the element count to `int`. Skip fake-kernel, autograd and wheel-packaging implementation. Full `opcheck` integration follows after those registrations; it is not a numerical oracle.
2. [PyTorch 2.14: CUDA stream order and allocation lifetime](https://docs.pytorch.org/docs/2.14/notes/cuda.html#cuda-streams) (PyTorch custom C++/CUDA operators and CUDA semantics) - CUDA streams, including the `wait_stream` and `record_stream` examples.
3. [CUDA Programming Guide 13.4.2: restricted pointers and access alignment](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/cpp-language-extensions.html#restrict-pointers) (CUDA Programming Guide) - Section 5.4.1.4, `__restrict__`.
4. [NVIDIA: vector-load alignment](https://developer.nvidia.com/blog/cuda-pro-tip-increase-performance-with-vectorized-memory-access/) (NVIDIA CUDA Pro Tips: grid-stride loops and vectorized memory access) - Vector-type alignment discussion through the aligned `int2` pointer-offset example. Depth: Skip the complete vector-copy kernels with faulty remainder ownership.

**Focus**

- Choose a layout policy: reject unsupported strides, index actual strides, or explicitly normalize inputs with `contiguous()`. Include normalization cost in end-to-end measurements.
- For a simple out-of-place map, accept same-shape float32 CUDA inputs on the same device, allocate a fresh output, and define whether gradients are supported. Do not promise broadcasting or mutation accidentally.
- A view's data pointer includes its storage offset but says nothing about subsequent strides or vector alignment. Validate vector alignment independently and provide a scalar tail or fallback.
- Guard the input device and use its current framework stream, not an assumed default stream. If work crosses streams, execution dependencies and caching-allocator lifetime need separate handling.

**Reproduce:** Build an inference-only out-of-place float32 vector-add extension. Require equal shapes and one CUDA device, explicitly normalize noncontiguous inputs, guard that device, use its current stream and wide grid-stride indices, return an empty output without a zero-block launch, and check launch errors. Compare with `a + b` on lengths 0, 1, 31, 32, 33 and 1003, a transposed two-dimensional view and a contiguous view offset by one element. Reject mismatched shapes, dtypes, devices and gradient-requiring inputs under the stated inference contract. Confirm fresh output storage, unchanged inputs and non-default-stream execution with an explicit dependency before host validation.

**Traps**

- Using `numel()` and a raw pointer as proof of contiguous layout. A transposed tensor has the same element count but different strides.
- Adding `__restrict__` while permitting output-input overlap. The promise must match the actual access and aliasing contract; two read-only inputs aliasing each other is a different case.
- Synchronizing the whole device on every call to hide stream bugs. Preserve asynchronous behavior and synchronize only at the test or measurement boundary.

**Practice**

- The section mini-project covers this: the `kernellab` native vector-add wrapper, explicit inference contract, view/alignment tests, rejection matrix and non-default-stream lifetime checks. Fake-tensor and autograd integration remain later work.

**Stop when:** Your wrapper passes the valid-input reference matrix and rejects unsupported inputs before launch, with documented layout, aliasing, stream and lifetime policies.

<details>
<summary>Self-test</summary>

1. A float32 allocation is aligned to 16 bytes. Is its view starting one element later safe for an `int4` load?
   - No. The four-byte offset breaks 16-byte alignment. Use an aligned path or scalar accesses instead.
2. Does `record_stream` make a consuming stream wait for a producer?
   - No. It tells the allocator about use on another stream. A stream wait or event establishes execution order; lifetime tracking is separate.
3. Does passing `opcheck` prove the arithmetic and gradients are correct?
   - No. It checks registration behavior. Use an independent numerical reference and, when gradients are supported later, separate gradient tests.

</details>

#### U10. Compute capability, feature detection and fallback paths

**About 3 h** · **Target:** Implement

Topics: Compute capability, device properties and feature detection; Architecture capability checks and correct fallback paths

Compilation for a new target does not make a feature available on an older device. A portable library needs an observable decision and a baseline whose correctness does not depend on the optimization.

**You can now**

- Query device and kernel limits and distinguish feature support from launch legality and binary compatibility.
- Implement a deterministic dispatch decision with a validated baseline fallback and an explicit unsupported reason.
- Exercise both dispatch branches without claiming that an unavailable hardware feature was executed.

**Study**

1. [CUDA C++ Best Practices Guide 13.4: availability, errors and compatible builds](https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html#testing-for-cuda-availability) (CUDA C++ Best Practices Guide) - Sections 17.1 to 17.3.
2. [CUDA Programming Guide 13.4.2: queried resource limits](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/writing-cuda-kernels.html#kernel-launch-and-occupancy) (CUDA Programming Guide) - Section 2.3.7, device properties, kernel attributes and occupancy APIs.
3. [CUDA Programming Guide 13.4.2: cubin and PTX compatibility](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/nvcc.html) (CUDA Programming Guide) - Section 2.7.3.1.
4. [CUDA Programming Guide 13.4.2: an architecture-gated feature](https://docs.nvidia.com/cuda/cuda-programming-guide/01-introduction/programming-model.html#thread-block-clusters) (CUDA Programming Guide) - Section 1.2.2.1.1, Thread Block Clusters. Depth: Explain eligibility only. Do not implement a cluster kernel in this unit.

**Focus**

- Check device availability and every query's return status before reading fields. Record compute capability, SM count, thread limits, shared-memory limits and compiled-kernel attributes.
- A capability predicate, per-launch resource check and compatible code image are separate requirements. Device names and toolkit versions are not substitutes for those checks.
- Build dispatch as a pure decision over queried facts and boundary facts, then launch only the selected legal path. Include an override that forces the baseline for differential testing.
- Do not treat all CUDA errors as permission to retry another kernel. Invalid input or a failed execution can require reporting the error rather than continuing in a damaged context.

**Reproduce:** Query `cudaGetDeviceProperties`, `cudaFuncGetAttributes` and the occupancy API for the baseline. Record `clusterLaunch` from the device properties as a feature-eligibility observation, not a cluster execution test. Implement a vector-copy selector requiring 16-byte-aligned pointers, compatible element type, a correctly handled tail and legal launch resources; otherwise choose the scalar grid-stride copy. Unit-test synthetic dispatch facts on the CPU, but launch only paths actually supported by the current device. Compare automatic dispatch and forced baseline on lengths 0, 1, 31, 32, 33 and 1025 and on offset views. Log the selected path and failed precondition. An unavailable device produces an explicit unsupported result, not a fabricated successful GPU run.

**Traps**

- Hard-coding a product-name whitelist. Similar names can have different limits and future devices are unknown to the list.
- Forcing a synthetic supported capability into a real launch. Mocking tests the decision function, not hardware execution.
- Equating PTX forward compatibility with unrestricted driver compatibility. The installed driver must understand the shipped PTX version and support the device.

**Practice**

- The section mini-project covers this: the `kernellab` queried capability manifest, pure dispatch tests, automatic-versus-forced-baseline comparisons and explicit unsupported-feature report. Cluster execution is not required on unsupported hardware.

**Stop when:** Your dispatch report explains every tested selection, both supported copy paths match the reference, and unavailable hardware paths are clearly separated from mocked decision tests.

<details>
<summary>Self-test</summary>

1. Does a legal thread count prove a kernel launch is legal?
   - No. Registers, static plus dynamic shared memory, kernel-specific limits and other launch requirements also matter.
2. How do you test an unavailable optimized branch honestly?
   - Test its decision logic with synthetic facts and report execution as untested on this device. Run the baseline and any genuinely supported optimized paths against the reference.
3. Does a feature-support query prove that the optimized path is faster?
   - No. It proves eligibility for that feature, not performance. Choose a default only after representative correctness-checked measurements.

</details>

### Mini-project: Execution and memory mapping with a PTX and SASS evidence bundle

**About 12 to 16 hours.** Build the execution model inside kernellab: an explicit-memory vector-add baseline, grid-stride tails, a block-local publication test, a source to PTX to SASS bundle with a resource table, a native extension with an explicit contract, and a capability manifest with dispatch and fallback. Hopper and Blackwell features are reading and static audit only on the available hardware.

1. Write `kernels/cuda/map.cu` as an explicit-memory single-precision vector add for 1003 elements with inputs `a[i] = float(i)` and `b[i] = 1.0f`, four blocks of 256 threads, explicit allocation and copies, a bounds check and a checked launch. All 1003 results must equal `float(i + 1)` exactly against an independent host reference, 21 launched threads must do no memory access, every CUDA return value is checked and all allocations are freed. Cover the two-dimensional index map with a kernel that writes each thread linear index, warp index and lane index for `dim3 block(16, 3, 1)`: warp 0 holds rows 0 and 1, warp 1 holds row 2 with 16 unused positions, and two such blocks allocate four warps.
2. Derive before running: sector counts 4, 5 and 32 with useful fractions 100 percent, 80 percent and 12.5 percent for the three 32-lane four-byte patterns from a 32-byte aligned base; bank degrees 1, 2, 1, 32 and 1 for strides 1, 2, 3, 32 and 33 with degree 1 on broadcast; and the simplified occupancy example with 100 threads per block, 64 registers per effective thread and 2048 shared bytes per block giving four warps and 128 effective threads per block, four resident blocks, 16 resident warps and 50 percent occupancy. Check the arithmetic with a byte-interval union counter and a bank enumerator, then on the GPU: time paired coalesced (`4l`), shifted (`4l+4`) and strided (`32l`) copies and a conflicting (stride 32) against padded (stride 33) shared-memory kernel with interleaved events; sweep the compiled vector-add at 128, 256 and 512 threads with 0, 16384 and 32768 dynamic shared bytes through `cudaOccupancyMaxActiveBlocksPerMultiprocessor` (12, 5 and 3 blocks per SM at 128 threads on an RTX 3050 with CUDA 13.4) with `cuobjdump -res-usage` kept; force one spill with `-maxrregcount` and show it in `-Xptxas=-v`; and show a block above `maxThreadsPerBlock` failing with a checked launch error.
3. Convert the baseline to a grid-stride loop. For 1003 elements with one block of 128 threads, thread 0 handles indices 0, 128, 256, 384, 512, 640, 768 and 896 and thread 127 handles seven indices ending at 895; validate every result against the host reference, then repeat with a one-thread launch at lengths 0, 1, 31, 32 and 33. Pair a uniform control kernel with a divergent one, annotate the retained branch, predication and reconvergence in PTX and SASS, and state which timing difference the annotation explains.
4. Draw then implement a two-warp one-block publication test: thread 0 initializes a shared integer flag to zero, all 64 threads reach a block barrier, thread 0 writes payload 42 then release-stores flag 1 with `cuda::atomic_ref<int, cuda::thread_scope_block>`, and thread 32 acquire-loads until it sees 1 then writes the payload to an output slot that the host checks equals 42 after checked completion. Write the scope-and-progress audit separately for the initialization barrier and the release and acquire path. Keep deliberately racy variants as analyzed cases with the missing ordering named, never as timed kernels.
5. Bundle source, PTX, cubin and SASS for the bounded grid-stride map with `nvcc -O3 -lineinfo -arch=sm_86 -Xptxas=-v map.cu -o map`, `nvcc -O3 -arch=compute_86 -ptx map.cu -o map.ptx` and `nvcc -O3 -lineinfo -arch=sm_86 -cubin map.cu -o map.cubin`, inspected with `cuobjdump --dump-sass --dump-resource-usage map` and `nvdisasm --print-line-info map.cubin`. Keep the compiler resource table and test one disassembly-backed paired timing hypothesis with event timing, for example aligned vector copies against scalar tails on odd shapes.
6. Build an inference-only out-of-place float32 vector-add extension that requires equal shapes on one CUDA device, normalizes noncontiguous inputs explicitly, guards the device, uses its current stream with wide grid-stride indices, returns an empty output without a zero-block launch and checks launch errors. Compare with `a + b` at lengths 0, 1, 31, 32, 33 and 1003, a transposed two-dimensional view and a contiguous view offset by one element; reject mismatched shapes, dtypes, devices and gradient-requiring inputs in a rejection matrix, and check lifetime on a non-default stream. Record TMA, cluster and tensor-memory paths as a static audit only.
7. Query `cudaGetDeviceProperties`, `cudaFuncGetAttributes` and the occupancy API into a capability manifest, recording `clusterLaunch` as a feature-eligibility observation without claiming cluster execution. Implement a vector-copy selector that takes a 16-byte aligned path only with compatible type, handled tail and legal launch resources and otherwise takes the scalar grid-stride copy. Test synthetic dispatch facts on the CPU and all three launch branches on the RTX 3050, compare automatic against forced-baseline timing with events, and file an explicit unsupported-feature report for paths the hardware cannot run.

**Deliverables**

- `kernels/cuda/map.cu` with the 1003-element baseline, the two-dimensional index map, grid-stride tails and the host reference tests.
- The derivation sheet with sector, bank and occupancy predictions beside the measured counters, union outputs and `cuobjdump -res-usage` reports.
- The publication test with its audit, the source to SASS bundle with the resource table and one paired timing hypothesis, the native extension with its rejection matrix, and the capability manifest with dispatch tests and the unsupported-feature report.

**Checks**

- rubric: Self-grade with the rubric below.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Mapping correctness | The 1003-element baseline matches the host reference exactly, the warp map is verified by per-thread outputs, and lengths 0, 1, 31, 32 and 33 pass with the empty path avoiding an invalid launch. | A seeded bounds or index defect is kept as a regression that the reference catches. |
| Prediction before measurement | Sector, bank and occupancy derivations are written before the runs and reconciled with measured evidence, with the simplified-model limits stated. | The paired timing hypothesis names the SASS lines it depends on and a signal that would falsify it. |
| Synchronization and dispatch | The publication test shows 42 through the release and acquire path, racy variants name the missing ordering, and the selector tests cover native, forced fallback and forced-below-minimum branches. | The audit separates initialization from publication, and the report marks cluster paths as static audit. |

Feeds into: Capstone laboratory: the baseline, tails, publication test, SASS bundle, extension contract and capability manifest. Later sections time and profile these kernels and reuse the selector.

### Resource route

- **Primary - Book:** [Programming Massively Parallel Processors, 4th edition - Chapters 2 to 6](https://shop.elsevier.com/books/programming-massively-parallel-processors/hwu/978-0-323-91231-0) - Read Chapters 2 to 6: data-parallel kernels, multidimensional grids, compute architecture and scheduling, memory architecture and data locality, and performance considerations. Work the chapter exercises on warps, occupancy, memory and coalescing, and predict three altered launch or address patterns before running them.
- **Required - Course:** [MIT 6.S894 Accelerated Computing (Fall 2025) - Lectures 2 to 5 and Labs 2 and 3](https://accelerated-computing.academy/fall25/lectures) - Use Lecture 2 (Throughput Processors), Lectures 3 and 4 (Memory, Parts 1 and 2) and Lecture 5 with its continuation (scratchpads, bank conflicts, register shuffles, overlap) for why the hardware looks as it does. Do Lab 2 (Massively-Parallel Mandelbrot, with its FMA-latency and warp-scheduler probes) and Lab 3 (Wave Simulation, with its coalesced-load and memory-latency probes) from the public lab repositories, built with nvcc for your own GPU instead of the course service. The labs were written for an RTX 4000 Ada, so recompute any SM count or bandwidth the questions assume.
- **Required - Documentation:** [CUDA Programming Guide](https://docs.nvidia.com/cuda/cuda-programming-guide/) - Read the Basics and Programming Model chapters plus the sections on memory, synchronization, hardware implementation and compute capabilities used by your kernels. Record the toolkit documentation version alongside every claim.
- **Required - Documentation:** [CUDA C++ Best Practices Guide](https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/) - Study Assess, Parallelize, Optimize, Deploy; Getting the Right Answer; memory optimization; execution configuration; instruction optimization; and deployment compatibility. Convert recommendations into hypotheses, not universal rules.
- **Reference - Specification:** [Parallel Thread Execution ISA](https://docs.nvidia.com/cuda/parallel-thread-execution/) - Read the PTX purpose, machine model, state spaces, memory consistency and target directives. Compile two tiny kernels, map source to PTX and SASS, and explain what PTX does and does not guarantee across devices.
- **Support - Lectures:** [GPU MODE Foundations Lectures](https://github.com/gpu-mode/lectures) - Use Lectures 2, 3, 4, 5, 8, 37 and 41 for PMPP review, CUDA setup, architecture, optimization checklists, SASS and documentation reading. Reproduce only the examples that test a prediction from this stage.
- **Support - Practice:** [TensorTonic Language Modeling from Scratch - GPU analysis problems](https://www.tensortonic.com/study-plans/language-modeling-from-scratch) - Solve GPU Occupancy Calculator, Shared-Memory Bank Conflict Analyzer and Global-Memory Coalescing Counter after the matching units, and check each answer against your own derivation.
- **Reference - Reference:** [AI Performance Engineering - GPU Fundamentals](https://github.com/wafer-ai/gpu-perf-engineering-resources) - A curated index. Use Section 1 only to find a CUDA, PTX or architecture source the other entries lack.
- **Required - Article:** [NVIDIA CUDA Pro Tips: grid-stride loops and vectorized memory access](https://developer.nvidia.com/blog/cuda-pro-tip-write-flexible-kernels-grid-stride-loops/) - Read the grid-stride SAXPY loop and its scalability and debugging discussion (April 22, 2013), plus the scalar-copy SASS and vector-type alignment discussion in Increase Performance with Vectorized Memory Access (August 4, 2025). Skip the latter article's full vector-copy kernels: their tail-thread condition can omit remainders. These fill the pool's grid-stride and vector-width coverage gaps.
- **Reference - Documentation:** [CUDA Binary Utilities 13.4](https://docs.nvidia.com/cuda/cuda-binary-utilities/index.html) - Sections 1.1 to 1.2, 2.1.1 to 2.1.3, 3.1.1 and 3.1.4 for cubin extraction, resource reports and line-correlated SASS. The existing compiler and PTX references lack a worked binary-tool workflow.
- **Required - Tutorial:** [PyTorch custom C++/CUDA operators and CUDA semantics](https://docs.pytorch.org/tutorials/advanced/cpp_custom_ops.html) - Custom C++ and CUDA Operators: build system, backend registration, Testing an operator and mutable schema; CUDA semantics 2.14: CUDA streams. These fill the native tensor-boundary gap in the CUDA-only pool. Stop before fake-kernel and autograd implementation; harden the tutorial's CUDA example for empty inputs, same-device checks, device guards, indexing width and launch errors.

### Exit checkpoint

Predict warp membership, addresses, transactions, bank mapping, divergence, occupancy limits and generated-code targets for three unfamiliar kernels, then verify the mapping with device properties, PTX and SASS inspection.

<details>
<summary>Deliberately left for later</summary>

- General C++ ownership, concurrency and CPU performance already owned by Programming and Systems
- Architecture-specific TMA, tensor-memory and cluster programming before portable CUDA fundamentals pass
- Non-NVIDIA accelerator programming until one CUDA execution model is operational

</details>

## GPU-3. Measurement, Profiling and Correctness

**Why:** GPU timing is asynchronous and performance tools perturb the workload. This stage builds a correctness-first harness, combines timelines with kernel counters and roofline models, and requires converging evidence before any optimization claim.

### Learn this much

- [ ] Benchmark question, timed boundary and excluded work _(Required)_
- [ ] Asynchronous launch, implicit synchronization and host timer failure _(Required)_
- [ ] CUDA events, device synchronization and stream-scoped timing _(Required)_
- [ ] Warmup convergence, JIT compilation, autotuning and cache state _(Required)_
- [ ] Allocator pools, L2 and application-cache state _(Required)_
- [ ] Clock, power, thermal and throttling state _(Required)_
- [ ] Process, device, multi-tenant and background-work interference _(Required)_
- [ ] Interleaved variants, randomized order and raw repeated trials _(Required)_
- [ ] Median, tail, variance, uncertainty and practical significance _(Required)_
- [ ] Machine, driver, toolkit, compiler, library, flags and code revision capture _(Required)_
- [ ] Reference implementation independent of target kernel logic _(Required)_
- [ ] Differential and property tests across shapes, strides, dtypes and masks _(Required)_
- [ ] Tolerance from precision, reduction order, conditioning and output use _(Required)_
- [ ] NaN, Inf, overflow, underflow, denorm and extreme-input policy _(Required)_
- [ ] Out-of-bounds and misaligned access diagnosis with memcheck _(Required)_
- [ ] Race, initialization and synchronization diagnostics _(Required)_
- [ ] CPU-GPU timelines, API calls, copies, kernels and synchronization _(Required)_
- [ ] NVTX ranges and trace-to-source correlation _(Required)_
- [ ] Kernel counters, section sets, replay and metric interpretation _(Required)_
- [ ] Useful versus executed operations and useful versus requested or actual bytes _(Required)_
- [ ] Achieved bandwidth, compute throughput and efficiency _(Required)_
- [ ] Arithmetic intensity, roofline bounds and regime transitions _(Required)_
- [ ] Warp stalls, occupancy, register pressure and resource evidence _(Required)_
- [ ] Launch, memory, compute, resource, synchronization, transfer and host bottlenecks _(Required)_
- [ ] Profiler overhead, replay effects and counter multiplexing _(Required)_
- [ ] Kernel speedup, dispatch cost and end-to-end translation _(Required)_
- [ ] Performance regressions and retained no-benefit regimes _(Required)_
- [ ] Cross-device and cross-generation reproducibility _(Optional)_
- [ ] Energy, power caps and performance-per-watt experiments _(Depth)_

### Study units

#### U1. Timed boundaries, asynchronous launch and event timing

**About 4 h** · **Target:** Explain + Measure

Topics: Benchmark question, timed boundary and excluded work; Asynchronous launch, implicit synchronization and host timer failure; CUDA events, device synchronization and stream-scoped timing

A host call can return before its GPU work finishes. A speedup is meaningful only when both variants time the same completed work.

**You can now**

- Define a timed boundary that separates kernel execution, host dispatch, transfers and setup.
- Measure completed work with stream-ordered events and a synchronized host timer.
- Repair a launch-only timing claim and explain any remaining timer disagreement.

**Study**

1. [CS336 Assignment 2: end-to-end benchmarking](https://github.com/stanford-cs336/assignment2-systems/blob/main/cs336_assignment2_systems.pdf) (CS336 Assignment 2 - Section 2.1 Profiling) - Section 2.1.3, End-to-End Benchmarking, and Problem (`benchmarking_script`), parts (a) and (b), pp. 3 to 4.
2. [Companion code: event-timed coalesced copy](https://github.com/cfregly/ai-performance-engineering/blob/b57e4c6a9e261c09ac09208705d040c81b03d35e/code/ch07/optimized_copy_uncoalesced_coalesced.cu) (AI Systems Performance Engineering companion code - Chapters 6 to 8) - Commit b57e4c6: `coalesced_stream`, then `main` from allocation through event destruction. Depth: Read the timing sequence. Do not treat its average over 40 launches as a distribution of individual-call latency.

**Focus**

- Write the benchmark question first: isolated kernel time, completed operator latency, or end-to-end step time. Name every included and excluded cost.
- Record start and stop events on the work's stream, then wait for the stop event before reading elapsed time. Other streams need explicit dependencies.
- For host wall time, complete prior work before starting and included work before stopping. Validation and input generation stay outside a kernel-only interval.
- An event interval can include GPU idle gaps while the host supplies launches. Dividing a batch interval by its launch count measures amortized service time, not a latency percentile.

**Reproduce:** Allocate two seeded 512 by 512 `torch.float32` CUDA matrices. Warm up 10 matrix multiplies, synchronize, then time 20 multiplies with events and with a host timer spanning the same batch and final synchronization. Validate the last output against a CPU double-precision reference. Explain the two boundaries without assuming equal times or a fixed speedup.

**Traps**

- Timing only the return from `torch.matmul` and calling that kernel duration.
- Recording events on the default stream while the measured work runs on another stream.
- Calling `.item()` inside the loop and accidentally including a device-to-host synchronization.

**Practice**

- [CS336 Assignment 2: `benchmarking_script` (a) and (b)](https://github.com/stanford-cs336/assignment2-systems/blob/main/cs336_assignment2_systems.pdf) - Problem (`benchmarking_script`), pp. 3 to 4. Part (b) times the Table 1 sizes at context 512. On a 6 GB GPU use the small model at batch 4 and context 256: one full AdamW step peaked at 2.93 GiB on an RTX 3050 6 GB with PyTorch 2.14, while context 512 needs 4.83 GiB and did not fit beside a desktop session. A 24 GB GPU runs small and medium at context 512. Record every change from the handout, and time forward-only and full training steps separately. These are written deliverables with no public timing tests; add your own correctness checks.

**Stop when:** Your harness reports both completed host latency and event time with explicit boundaries, validates the output, and rejects an unsynchronized launch-only result as a kernel-time claim.

<details>
<summary>Self-test</summary>

1. Why synchronize before starting a host timer as well as after the work?
   - The first wait excludes queued earlier work. The final wait includes completion of the work being measured.
2. Does waiting for a stop event prove all device work has completed?
   - Only work ordered before that event, including explicit dependencies. Unrelated streams can still be running.
3. Why can a batch event interval exceed the sum of kernel durations in a trace?
   - The interval includes time between its event timestamps, including launch-supply gaps and interference. Kernel durations alone exclude those gaps.

</details>

#### U2. Warmup, compilation, allocator and cache state

**About 3 h** · **Target:** Measure

Topics: Warmup convergence, JIT compilation, autotuning and cache state; Allocator pools, L2 and application-cache state

First-use overhead and repeated-buffer reuse answer different questions from steady-state work on changing inputs. Neither should silently enter the other result.

**You can now**

- Separate compilation, autotuning and allocator initialization from warm execution.
- Choose and record an application-relevant cache and buffer-reuse policy.
- Use a bounded warmup rule and retain evidence when steady state does not settle.

**Study**

1. [CUTLASS: warmup and buffer rotation](https://docs.nvidia.com/cutlass/latest/media/docs/cpp/gemm_performance_measurement_methodology_guidelines.html#warm-ups-and-profiling-iterations) (CUTLASS GEMM Performance Measurement Methodology) - Documentation updated September 21, 2026: Benchmark Requirements; Warm-ups and Profiling Iterations; Buffer Rotation. Depth: Do not copy the Blackwell iteration counts. The claim that rotation guarantees DRAM-resident inputs is too strong: replacement, access coverage and persistence affect residency. Treat rotation as an eviction strategy to check, not proof of a cold cache.
2. [Allocator pools versus data caches](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 6 to 8) - Chapter 6, CUDA Programming Refresher: Asynchronous Memory Allocation and Memory Pools.
3. [Harness cold and warm contract](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/gpu-microbenchmark-kernel-suite.md#architecture-constraints) (GPU Microbenchmark and Kernel Suite - Harness and Instrumentation) - Architecture constraints; Milestone B - Instrumentation, compilation/autotuning and cold/warm items.

**Focus**

- A warmed allocator, compiled code cache, tuned configuration, L2 cache and application KV cache are different state. Record them separately.
- Warm every evaluated shape, dtype and specialization. A new shape can trigger compilation or tuning after another shape has settled.
- Inspect warmup batches and clock state with a declared stability rule and a time cap. A fixed count is not evidence of convergence.
- Reuse buffers when reuse represents the application. Rotate preallocated buffers when studying streaming traffic; exclude rotation setup and label unverified residency.

**Reproduce:** From a fresh process, record the first call and subsequent batches for the timing unit's matrix multiply. Repeat with preallocated rotating inputs and with the same inputs reused. Keep the warmup samples and declare which state each run preserves. Do not require a difference: a small workload or unchanged execution path may show none.

**Traps**

- Calling `torch.cuda.empty_cache()` between trials and claiming to have flushed L2. It releases unused allocator cache, not a hardware data cache.
- Putting compilation or input allocation in only one variant's timed boundary.
- Running warmup forever to obtain a preferred timing while hiding thermal drift.

**Practice**

- [CS336 Assignment 2: `benchmarking_script` (c)](https://github.com/stanford-cs336/assignment2-systems/blob/main/cs336_assignment2_systems.pdf) - Problem (`benchmarking_script`), part (c), p. 4. Reuse the model setting from the timing unit. Compare zero, one, two and five warmup steps, then test your bounded stability rule. Keep identical timed boundaries and record allocator and specialization state. The section mini-project adds the rotating-buffer cache experiment.

**Stop when:** You can regenerate separate first-use and warm reports with retained warmup samples, a bounded stability rule, and an explicit allocator and buffer-reuse policy.

<details>
<summary>Self-test</summary>

1. Does a warm model imply every specialization is compiled?
   - No. New shapes, dtypes or guards can create new specializations or trigger tuning.
2. Is repeated-buffer caching always a benchmark defect?
   - No. It is legitimate when the target workload reuses those buffers. It is misleading when presented as streaming DRAM performance.
3. Why keep a first-call result even when reporting warm performance?
   - It exposes startup, compilation and tuning costs that warm timing deliberately excludes. Deployment may pay them.

</details>

#### U3. Clocks, power, interference and environment capture

**About 3 h** · **Target:** Measure

Topics: Clock, power, thermal and throttling state; Process, device, multi-tenant and background-work interference; Machine, driver, toolkit, compiler, library, flags and code revision capture

Boost clocks and other work on the same GPU can change during a benchmark. The environment is part of the result, not an optional appendix.

**You can now**

- Capture hardware, software, build and workload identity alongside raw samples.
- Identify power, thermal, clock and background-work changes that weaken a comparison.
- Measure under a documented isolation policy without assuming an idle process list proves isolation.

**Study**

1. [CUTLASS: environment and data-dependent power](https://docs.nvidia.com/cutlass/latest/media/docs/cpp/gemm_performance_measurement_methodology_guidelines.html#testing-methodology-overview) (CUTLASS GEMM Performance Measurement Methodology) - Documentation updated September 21, 2026: Testing Methodology Overview and Matrix Fill Methodology. Depth: Read fixed-frequency tests as a controlled methodology, not an instruction to change shared-machine clocks. Zero-filled inputs are not a representative default, even with a frequency setting.
2. [Machine and build identity](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/gpu-microbenchmark-kernel-suite.md#measurement-requirements) (GPU Microbenchmark and Kernel Suite - Harness and Instrumentation) - Core requirements, harness item; Failure-injection requirements, thermal/interference run; Measurement requirements; Rubric, Reproducibility.

**Focus**

- Record GPU identity and compute capability, driver, toolkit, framework and compiler versions, flags, code revision, workload seed and precision settings. Driver-supported CUDA and the installed toolkit are not the same version.
- Save sampled clocks, power and temperature with trial timestamps. Missing or unsupported telemetry must be marked unavailable, not zero.
- On a GPU that also drives a desktop or serves other users, run one experiment at a time, keep each short and release allocations on exit. The compositor and other clients still run beside yours, so record what else held the GPU.
- Compare identical input distributions. Fill patterns can change switching activity and power; a fixed power limit does not imply fixed clocks.

**Reproduce:** Attach a machine/build manifest and timestamped clock, power and temperature observations to one short timing run. Record background processes and whether clocks can be controlled without privileges. Repeat the same run later with interleaved variants; explain any state differences without attributing every fluctuation to a single cause.

**Traps**

- Using `nvidia-smi`'s displayed CUDA support level as the compiler version.
- Assuming an idle process list, or an agreement to take turns, rules out the desktop compositor and other GPU clients.
- Deleting slow samples after seeing a thermal or interference event instead of preserving and labeling the affected run.

**Practice**

- The section mini-project covers this: the `kernellab` environment manifest, timestamped machine-state log and interference/isolation audit.

**Stop when:** A retained raw run can be matched to its workload, revision, toolchain, machine-state observations and stated isolation limits without relying on memory.

<details>
<summary>Self-test</summary>

1. Does a fixed power limit make two runs use the same clock?
   - No. Dynamic voltage and frequency control responds to temperature, workload and power demand. Measure clocks during the run.
2. Why is recording only the GPU model insufficient?
   - Driver, compiler, libraries, flags, power state and workload can all change the generated work or its runtime.
3. What can you claim when power telemetry is unavailable?
   - Timing and the state you actually observed. You cannot infer an energy result or rule out power effects from missing readings.

</details>

#### U4. Interleaved trials, raw samples and uncertainty

**About 4 h** · **Target:** Measure

Topics: Interleaved variants, randomized order and raw repeated trials; Median, tail, variance, uncertainty and practical significance

A best timing hides drift and noise. Paired trials make a comparison less dependent on which variant happened to run first.

**You can now**

- Collect paired, interleaved trials with reproducible randomized order and raw samples.
- Report medians, supported tails and uncertainty without treating launches within a batch as independent trials.
- Separate statistical evidence from a practically worthwhile improvement.

**Study**

1. [Harness noise and repeated-trial requirements](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/gpu-microbenchmark-kernel-suite.md#core-requirements) (GPU Microbenchmark and Kernel Suite - Harness and Instrumentation) - Core requirements, harness item; Milestone B - Instrumentation, noise and observer overhead; Milestone E - Measurement / optimization, interleaved raw trials; Measurement requirements.
2. [CS336: repeated timing summary](https://github.com/stanford-cs336/assignment2-systems/blob/main/cs336_assignment2_systems.pdf) (CS336 Assignment 2 - Section 2.1 Profiling) - Section 2.1.3, Problem (`benchmarking_script`), part (b), p. 4. Depth: Use its mean and standard deviation as an initial summary. Ten steps do not establish a reliable p99 or confidence interval under time-correlated drift.

**Focus**

- Make a trial pair use identical inputs and timing boundaries. Randomize the order within each pair with a recorded seed and preserve timestamps.
- Report the estimand: ratio of medians and median paired ratio are different statistics. Keep raw times, not just speedups.
- Resample whole pairs for paired uncertainty. If adjacent pairs drift together, use blocks or repeated sessions rather than an independent-sample bootstrap.
- State sample count, percentile convention and a minimum useful gain before inspecting results. Tail estimates need many independent observations, not many launches inside one interval.

**Reproduce:** Using synthetic paired latencies in milliseconds, baseline `[10, 20, 30]` and candidate `[5, 10, 15]`, compute both medians and each paired speedup. Both summaries give a speedup of 2. Explain why resampling these perfectly proportional pairs can produce zero spread without proving a noise-free hardware result. Then compute the same summaries on retained interleaved GPU samples.

**Traps**

- Running all baseline trials before all candidate trials and confounding the variant with clock drift.
- Treating 1,000 launches in one event interval as 1,000 independent latency samples.
- Reporting a confidence interval without its resampling unit or treating a tiny statistically resolved gain as automatically useful.

**Practice**

- The section mini-project covers this: `kernellab` paired randomized trials, raw samples, drift plots and a documented uncertainty calculation.

**Stop when:** Your report can be regenerated from raw paired trials and states the summary statistic, uncertainty method, dependence limits and minimum practically useful gain.

<details>
<summary>Self-test</summary>

1. Why randomize within a pair rather than always run baseline first?
   - It reduces systematic order effects. Pairing limits slow drift, but randomization does not eliminate carryover or all interference.
2. What is lost when only medians are retained?
   - Tails, outliers, order effects and information needed to recompute uncertainty or change the summary.
3. Does a p99 computed from ten trials give strong tail evidence?
   - No. It is effectively an estimate near the sample maximum, with very poor information about rare slow events.

</details>

#### U5. Independent references and differential and property tests

**About 4 h** · **Target:** Implement

Topics: Reference implementation independent of target kernel logic; Differential and property tests across shapes, strides, dtypes and masks

A faster kernel that computes the wrong operation is not an optimization. Independent references and adversarial properties catch errors that two similar implementations share.

**You can now**

- Build a reference that does not reuse the target's indexing or reduction logic.
- Test supported shapes, strides, dtypes and masks, including boundaries and invalid inputs.
- Gate every performance result on differential and property checks.

**Study**

1. [Independent oracle and adversarial matrix](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/gpu-microbenchmark-kernel-suite.md#architecture-constraints) (GPU Microbenchmark and Kernel Suite - Harness and Instrumentation) - Architecture constraints; Milestone A - Correct baseline; Correctness requirements; Failure-injection requirements.
2. [PyTorch 2.14: test inputs and structural comparison](https://docs.pytorch.org/docs/2.14/testing.html#torch.testing.assert_close) (PyTorch 2.14 numerical accuracy and tensor testing) - `torch.testing.assert_close`: shape, device, dtype, layout and stride checks; `torch.testing.make_tensor`: shape, range and noncontiguous parameters.

**Focus**

- Generate reference results from the specification using a CPU scalar or library path, not the target's address calculations. Use the same represented inputs.
- Include empty, singleton, odd, warp-edge and block-edge sizes; noncontiguous views; supported dtypes; and partial or all-masked rows. Unsupported combinations must reject or fall back explicitly.
- Properties complement an oracle: copies preserve each element, transposing twice restores the input, and finite nonempty softmax rows sum approximately to one. These properties alone do not identify every wrong output.
- Preserve seeds and failing inputs. Check output shape, dtype and required layout as well as values, with tolerances chosen before tuning.

**Reproduce:** Write a copy acceptance test for lengths 0, 1, 31, 32, 33, 255, 256 and 257. Use a stride-two view of a known sequence, then compare every output element with an independently indexed CPU reference at zero tolerance. For nonempty cases, initialize the output to NaN before deliberately omitting its last element and confirm the check fails. Ensure the empty-input path avoids an invalid zero-block launch.

**Traps**

- Sharing a stride calculation between the oracle and candidate, so both make the same indexing mistake.
- Comparing only sums or checksums. Permutations and compensating errors can preserve them.
- Silently making noncontiguous inputs contiguous before testing a path advertised as stride-aware.

**Practice**

- The section mini-project covers this: `kernellab` independent copy/reduction references, adversarial input matrix and seeded tail/stride regressions.

**Stop when:** Your supported-input matrix passes independent full-output checks, and seeded tail and stride defects fail before the harness publishes timing results.

<details>
<summary>Self-test</summary>

1. Can the transpose-twice property prove a transpose implementation is correct?
   - No. Even an identity operation passes it. Compare against an independent transpose reference as well.
2. Why test just above a block boundary?
   - It forces a partial final block and exposes tail guards, skipped elements and out-of-bounds accesses.
3. Should a contiguous-only kernel pass a strided input by ignoring its strides?
   - No. It must reject, use a correct fallback, or perform a declared layout conversion whose cost is included at the operator boundary.

</details>

#### U6. Tolerances and an extreme-value policy

**About 4 h** · **Target:** Derive

Topics: Tolerance from precision, reduction order, conditioning and output use; NaN, Inf, overflow, underflow, denorm and extreme-input policy

Floating-point order changes can be legitimate, but a loose tolerance can conceal a defect. Extreme values need semantic decisions, not a larger error threshold.

**You can now**

- Derive an absolute-plus-relative acceptance rule and justify its scale from precision, reduction order and output use.
- Separate input rounding from accumulation error using a higher-precision reference.
- Declare and test policies for non-finite inputs, masked rows, overflow, underflow and subnormals.

**Study**

1. [CS336: accumulation precision experiment](https://github.com/stanford-cs336/assignment2-systems/blob/main/cs336_assignment2_systems.pdf) (CS336 Assignment 2 - Section 2.1 Profiling) - Section 2.1.5, Problem (`mixed_precision_accumulation`), pp. 7 to 8.
2. [PyTorch 2.14: numerical limits](https://docs.pytorch.org/docs/2.14/notes/numerical_accuracy.html) (PyTorch 2.14 numerical accuracy and tensor testing) - Introduction; Extremal values; Linear algebra - Non-finite values and Extremal values in linalg; TensorFloat-32 on Nvidia Ampere; Reduced Precision Reduction for FP16 and BF16 GEMMs. Depth: The page's slice example compares `A.sum(-1)[0]`, a row sum, with `A[:,0].sum()`, a column sum; the intended pair is `A.sum(-1)[0]` and `A[0].sum()`. Skip the AMD-specific sections.
3. [Finite and non-finite comparison rules](https://docs.pytorch.org/docs/2.14/testing.html#torch.testing.assert_close) (PyTorch 2.14 numerical accuracy and tensor testing) - `torch.testing.assert_close`: closeness inequality, non-finite comparison and `rtol`, `atol`, `equal_nan` parameters.
4. [CUDA 13.4: order and subnormal controls](https://docs.nvidia.com/cuda/floating-point/index.html#compiler-flags) (CUDA 13.4 Floating Point and IEEE 754) - Sections 2.2, Operations and Accuracy; 3.1 to 3.2, dot-product algorithms and comparison; 4.4, Compiler Flags.

**Focus**

- For finite outputs use $`|y-\hat y| \le a+r|\hat y|`$, where $`\hat y`$ is the reference and $`a`$ and $`r`$ are declared absolute and relative tolerances. Near zero, relative error alone is unsuitable.
- Evaluate quantized inputs in higher precision to isolate accumulation error. Comparing with unrounded original inputs adds input-representation error to the result.
- Cancellation and ill-conditioning can amplify relative error. A dtype-only default is not an error bound for arbitrary reduction lengths or applications.
- Test NaN and infinity locations separately. Declare all-masked-row behavior, overflow handling and subnormal preservation or flushing; record precision modes and compiler flags.

**Reproduce:** Run the four CS336 accumulation loops unchanged on CPU. In PyTorch 2.14.1, the FP32 loop gives 10.000133514404297 and the FP16 loop gives 9.953125; both loops with FP16 increments accumulated in FP32 give 10.00213623046875, exactly 1000 times the FP16 value of 0.01 (0.01000213623046875), so all of that error is input rounding. Explain input rounding versus repeated accumulation rounding, then define acceptance and extreme-input policies for your reduction. These are numerical examples, not GPU timing results.

**Traps**

- Increasing tolerance until an omitted element or wrong mask passes.
- Setting `equal_nan=True` and calling unexpected NaNs correct.
- Assuming max-subtracted softmax defines an all-masked row. Subtracting negative infinity from itself produces NaN; the application must specify a separate policy.

**Practice**

- [CS336 Assignment 2: `mixed_precision_accumulation`](https://github.com/stanford-cs336/assignment2-systems/blob/main/cs336_assignment2_systems.pdf) - Problem (`mixed_precision_accumulation`), pp. 7 to 8. Run all four loops and explain each discrepancy from the real-arithmetic sum of 10. This written experiment has no public autograder. The section mini-project adds cancellation, NaN, infinity, overflow, underflow and all-masked policy tests.

**Stop when:** You explain all four accumulation results and defend a predeclared finite-output tolerance plus separate extreme-value policies that reject a seeded wrong-mask or skipped-element defect.

<details>
<summary>Self-test</summary>

1. Why does promoting a rounded FP16 increment to FP32 not recover the original decimal value?
   - Promotion preserves the already rounded value. It improves subsequent accumulation, not the information lost on conversion.
2. Can a finite final mathematical answer guarantee finite intermediate arithmetic?
   - No. Intermediate products, squares or sums can overflow even when a rearranged or higher-precision calculation has a representable final answer.
3. Does a larger relative tolerance repair comparison near a zero reference?
   - No. The relative term vanishes at zero. Use a justified absolute tolerance and investigate cancellation.
4. What does `-ftz=true` change for single-precision CUDA arithmetic?
   - It enables flushing subnormal values to zero in affected operations. Record it as a numerical-semantic choice, not just a performance flag.

</details>

#### U7. Compute Sanitizer: out-of-bounds, races, initialization and synchronization

**About 4 h** · **Target:** Measure

Topics: Out-of-bounds and misaligned access diagnosis with memcheck; Race, initialization and synchronization diagnostics

Differential tests can miss an invalid access or intermittent race. Sanitizers add execution evidence, but each tool checks only a defined class of hazards.

**You can now**

- Choose memcheck, racecheck, initcheck or synccheck for a specific failure hypothesis.
- Reduce a seeded defect to a source-attributed diagnostic and retain a regression test.
- Distinguish a clean supported check from an unsupported or incomplete check.

**Study**

1. [Correctness before performance profiling](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 6 to 8) - Chapter 6, Debugging Functional Correctness with NVIDIA Compute Sanitizer.
2. [Compute Sanitizer 2026.3: tool scope and reports](https://docs.nvidia.com/compute-sanitizer/ComputeSanitizer/#memcheck-tool) (Compute Sanitizer) - Compilation Options; Memcheck Tool - What is Memcheck, Understanding Memcheck Errors and Padding; Racecheck Tool - What is Racecheck and Using Racecheck; Initcheck Tool - Using Initcheck and Initcheck Address Space Selection; Synccheck Tool - Using Synccheck and Understanding Synccheck Reports. Depth: Stop before tensor-core-specific guardrails and advanced barrier APIs. Use the address spaces supported by your installed version; older initcheck versions only cover global memory.

**Focus**

- Build optimized diagnostic binaries with `-lineinfo` and check every CUDA API result. Debug builds can change scheduling and resources, so they are not performance baselines.
- Run memcheck first. Racecheck primarily checks shared-memory hazards; initcheck defaults to global memory; synccheck checks barrier usage the architecture does not support, not general data-race freedom. From compute capability 7.0 a block barrier inside divergent code is not a synccheck error.
- A logical tensor overrun can remain inside an allocation or land in another valid allocation. Allocation padding improves detection; shape and sentinel tests are still necessary.
- Use `--error-exitcode 1` for automation. Keep source line, access type, thread/block coordinates, tool version and the smallest failing input with each regression.

**Reproduce:** In separate tiny CUDA programs, seed a one-past-the-end write, an uninitialized global read and a shared-memory neighbor read without a barrier. Build them for `sm_86` with `-lineinfo` and run memcheck with `--padding 32`, initcheck and racecheck; each reports its defect. For synccheck, seed `__syncwarp(0x0000ffff)` called by all 32 threads of a warp and build it with `-G`: synccheck reports "Barrier error detected. Invalid arguments." An `-O3` build reports nothing, because the compiler removed the barrier (the SASS has no `WARPSYNC`). A `__syncthreads()` reached by half the block is not a synccheck error on compute capability 7.0 and later; run racecheck on it and read the race it reports. All of this was observed with Compute Sanitizer 2026.3 and CUDA 13.4 on an RTX 3050 6 GB. Repair each defect, rerun the tool and the output tests, and bound every run with a timeout.

**Traps**

- Interpreting zero racecheck reports as proof of correct cross-stream or global-memory ordering.
- Treating a skipped kernel, unsupported operation or timed-out run as a clean sanitizer result.
- Adding unconditional device synchronization as a permanent fix instead of expressing the required dependency and lifetime.

**Practice**

- The section mini-project covers this: four minimal `kernellab` defect reproducers, matching sanitizer logs, repairs and regression tests.

**Stop when:** Each supported seeded defect produces the expected class of report, its repair passes the same diagnostic and reference tests, and unsupported or incomplete checks remain explicitly open.

<details>
<summary>Self-test</summary>

1. Why does memcheck precede racecheck or synccheck?
   - Those tools do not replace memory-access checking. Invalid accesses can also make later diagnostics confusing or incomplete.
2. Why might a one-element tensor overrun escape memcheck?
   - It can remain within a larger allocation or enter a neighboring valid allocation. The tool does not know every logical tensor boundary.
3. Does zero reported errors prove all possible inputs and schedules are correct?
   - No. It applies only to executed paths within the tool's supported checks. Independent tests and ordering arguments remain necessary.

</details>

#### U8. CPU-GPU timelines, NVTX ranges and trace-to-source correlation

**About 4 h** · **Target:** Measure

Topics: CPU-GPU timelines, API calls, copies, kernels and synchronization; NVTX ranges and trace-to-source correlation

A kernel profiler cannot explain time spent waiting for the host to launch work. The timeline connects source phases to device activity and exposes hidden boundaries.

**You can now**

- Capture CUDA API, kernel and transfer timelines with source-correlated NVTX ranges.
- Attribute one host gap, transfer or synchronization cost before collecting kernel counters.
- Reconcile timeline intervals with completed wall time without double-counting overlap.

**Study**

1. [System timeline before kernel analysis](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 6 to 8) - Chapter 8, Profiling and Diagnosing GPU Bottlenecks: Nsight Systems Timeline View and Profiling and Tuning the Data Pipeline.
2. [Nsight Systems 2026.3: capture and correlation](https://docs.nvidia.com/nsight-systems/UserGuide/#cuda-trace) (Nsight Systems User Guide) - Preparing Your Application for Profiling - Focused Profiling and Marking and Labeling Regions; CUDA Trace - Basic CUDA trace; NVTX Trace; Reading Your Report in GUI - Timeline Correlation; Profiling from the CLI - CLI Stats Command Switch Options. Depth: Start with CUDA and NVTX tracing only: `--sample=none --cpuctxsw=none` keeps the capture small. Turn on CPU sampling, GPU metric sampling or backtraces only when a question needs them.
3. [CS336: profile a completed model step](https://github.com/stanford-cs336/assignment2-systems/blob/main/cs336_assignment2_systems.pdf) (CS336 Assignment 2 - Section 2.1 Profiling) - Section 2.1.4, Nsight Systems Profiler, and Problem (`nsys_profile`), pp. 4 to 6.

**Focus**

- Label warmup, forward, backward, optimizer and validation phases. CPU NVTX range duration is not automatically the duration of asynchronous GPU work it launched.
- Correlate a kernel to its CUDA API call and enclosing source range. Inspect stream order, copies, dependencies and GPU idle intervals, not just cumulative kernel rankings.
- Busy time is the union of intervals on the chosen device and capture boundary. Summing overlapping kernels can exceed wall time and is not a utilization percentage.
- Compare unprofiled and traced completed wall time. Trace overhead and different capture boundaries can explain discrepancies; a synchronization wait may represent completion of useful work rather than wasted time.

**Reproduce:** Add an NVTX range around the timing unit's matrix-multiply batch and capture a short CUDA/NVTX trace without CPU sampling. Follow one API call to its kernel, identify the final synchronization and compute the union of kernel intervals within the batch. Compare that busy duration, the event interval and completed wall time; label any gap whose cause the trace does not establish.

**Traps**

- Calling a long `cudaDeviceSynchronize` entry pure synchronization overhead when it is waiting for unfinished kernels.
- Calling a device busy because any kernel exists in the trace, without defining the denominator interval.
- Inferring per-SM utilization from kernel start and end timestamps. A device-wide timeline does not reveal how many SMs were active.

**Practice**

- [CS336 Assignment 2: `nsys_profile`](https://github.com/stanford-cs336/assignment2-systems/blob/main/cs336_assignment2_systems.pdf) - Problem (`nsys_profile`), parts (a) to (e), p. 6. The problem asks for two Table 1 sizes and three power-of-two contexts above 128. One full AdamW step at batch 4 peaked at 2.93, 4.83 and 10.74 GiB for the small model at contexts 256, 512 and 1024, and at 8.41 and 13.55 GiB for the medium model at 256 and 512; medium at 1024 did not fit in 24 GB (RTX A5000, PyTorch 2.11). On a 24 GB GPU, profile small and medium at 256 and 512 and small also at 1024. On a 6 GB GPU, profile small training at 256, small forward passes at 512 and 1024 and medium forward passes at 256 and 512, and record the deviation. Keep captures short. These write-up questions have no public autograder.

**Stop when:** Your annotated trace connects a measured phase to source, kernels and dependencies, attributes one observed gap or transfer, and reconciles busy time with event and completed wall intervals.

<details>
<summary>Self-test</summary>

1. Two kernels each run for 5 ms and overlap completely. How much device busy time do they establish?
   - 5 ms, the union of their intervals, not 10 ms. This does not establish full utilization of every SM.
2. Does an NVTX range ending mean the launched kernel has finished?
   - No. A CPU range ends when its host code ends. GPU completion needs synchronization or trace-based correlation.
3. What should you investigate when event time is small but completed step latency is large?
   - Host preparation, dispatch gaps, transfers, allocations, other streams and mismatched boundaries, using the timeline before blaming the kernel.

</details>

#### U9. Kernel counters, section sets, replay and profiler overhead

**About 4 h** · **Target:** Measure

Topics: Kernel counters, section sets, replay and metric interpretation; Profiler overhead, replay effects and counter multiplexing

Counter collection changes execution and can replay work several times. A detailed report is not automatically a faithful measurement of application latency.

**You can now**

- Choose the smallest section or metric set that can falsify a kernel hypothesis.
- Explain replay, cache and clock controls and their impact on comparability.
- Separate unprofiled latency from profiling overhead and record unavailable counters honestly.

**Study**

1. [Nsight Compute 2026.3.1: collection and perturbation](https://docs.nvidia.com/nsight-compute/ProfilingGuide/#metric-collection) (Nsight Compute Profiling Guide) - Sections 2.2.1 to 2.2.3, Sets and Sections, Sections and Rules, and Replay; 2.2.6, Overhead; 2.6.2, Clock Control; 2.6.3, Cache Control. Depth: Read Kernel Replay, Application Replay and Range Replay. Skip the detailed supported-API enumeration and advanced graph profiling until your hypothesis requires them.
2. [Choose a hot kernel after the system trace](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 6 to 8) - Chapter 8, Profiling and Diagnosing GPU Bottlenecks: Nsight Compute and Roofline Analysis and Profiler-Guided Analysis.

**Focus**

- Start from one named kernel and one hypothesis. `LaunchStats` describes launch resources; `MemoryWorkloadAnalysis` tests traffic questions; `ComputeWorkloadAnalysis` tests pipeline use.
- Hardware counters may require multiple passes; software-patched metrics have separate overhead. Kernel replay saves/restores memory, while application replay reruns host setup and requires matching launches.
- Record replay mode, pass count, cache control, clock control, selected kernel and tool version. Default cache flushing can differ from warm application reuse.
- On Linux the driver restricts counters to administrators by default, and `ncu` then fails with `ERR_NVGPUCTRPERM`. On your own machine, run `ncu` with `sudo` or grant access as https://developer.nvidia.com/nvidia-development-tools-solutions-err_nvgpuctrperm-permission-issue-performance-counters describes. Where you cannot, keep the error and use events, timelines, static resource reports and instruction inspection, leaving counter conclusions open.

**Reproduce:** Choose one already-validated copy kernel, list available sections and request only `LaunchStats` and the section needed for your hypothesis. On a permitted device, retain the report, replay settings and pass count, then compare completed process wall time with and without collection. If counters are denied, retain the error and substitute an unprofiled event result plus compiler resource report; do not report an overhead ratio for a failed capture.

**Traps**

- Using elapsed profiler process time as kernel latency or as production end-to-end latency.
- Collecting the full set by default, then diagnosing a noisy short kernel from unrelated metrics.
- Assuming counters from separate passes describe an unchanged concurrent workload when replay serialized or reran it.

**Practice**

- The section mini-project covers this: `kernellab` minimal counter captures, replay/cache metadata and observer-overhead comparison, or an explicit permission-blocked evidence record.

**Stop when:** You have a minimal hypothesis-linked report and separate unprofiled timing, or a documented counter blocker with static/timeline evidence and the remaining counter check marked pending.

<details>
<summary>Self-test</summary>

1. Why might requesting more metrics increase profiling time greatly?
   - Counters cannot all be collected together. Extra passes, memory save/restore, software instrumentation and first-use metric configuration add work.
2. Does restoring global memory restore the original L2 cache state?
   - No. Device memory contents and hardware cache residency are separate state. Record cache control and choose replay appropriate to the experiment.
3. What does a denied counter capture tell you about the kernel's DRAM utilization?
   - Nothing. It is a permissions failure, not a zero measurement. Keep the counter hypothesis open.

</details>

#### U10. Useful work, achieved throughput and roofline placement

**About 4 h** · **Target:** Derive + Measure

Topics: Useful versus executed operations and useful versus requested or actual bytes; Achieved bandwidth, compute throughput and efficiency; Arithmetic intensity, roofline bounds and regime transitions

A throughput number needs an operation and byte definition. A roofline supplies a bound to test, not a diagnosis to infer from position alone.

**You can now**

- Derive useful operations and minimum bytes separately from executed instructions and measured traffic.
- Compute achieved throughput and a roofline bound with consistent units and memory boundaries.
- Place measured points against declared ceilings and explain why a point below a roof does not establish its bottleneck.

**Study**

1. [Operations, traffic and the first GPU roofline](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 6 to 8) - Chapter 6, Roofline Model: Compute-Bound or Memory-Bound Workloads; Chapter 8, Kernel Memory Throughput Versus Peak HBM Memory Bandwidth and Kernel Compute Throughput Versus Peak GPU FLOPS. Depth: Use the model, not the Blackwell peak values, for an Ampere GPU. Low arithmetic intensity identifies the lower roof; it does not prove that measured execution saturates bandwidth.
2. [Original roofline model and additional ceilings](https://www2.eecs.berkeley.edu/Pubs/TechRpts/2008/EECS-2008-134.html) (Roofline: An Insightful Visual Performance Model) - Technical report EECS-2008-134, October 2008 revision: sections 3, The Roofline Model, and 4, Adding Ceilings to the Model, including Figure 1. Depth: Stop before the platform survey and application case studies. Note that the paper defines operational intensity using traffic after cache filtering, between caches and DRAM.
3. [Nsight Compute 2026.3.1: roofline and memory boundaries](https://docs.nvidia.com/nsight-compute/ProfilingGuide/#roofline-charts) (Nsight Compute Profiling Guide) - Section 2.9, Roofline Charts, Overview and Analysis; section 2.10, Memory Chart, Overview. Depth: Match the precision and execution path of the roofline section to the kernel. Keep modeled useful work distinct from profiler operation counters.

**Focus**

- Define useful FLOPs from the operation's mathematical contract. Count a multiply-add as two FLOPs, even if one fused instruction executes it; padding, recomputation and address arithmetic are separate executed work.
- Distinguish useful bytes, requested loads/stores and actual traffic at each memory level. Cache hits, transaction overfetch and repeated reads can make those counts differ.
- With work $`F`$, bytes $`Q`$, elapsed seconds $`t`$, bandwidth ceiling $`B`$ and compute ceiling $`P`$, use $`I=F/Q`$, $`F/t`$, $`Q/t`$, and $`F/t \le \min(P,BI)`$. The ridge is $`P/B`$; the model gives $`t \ge \max(F/P,Q/B)`$.
- State dtype, dense or sparse path, memory level and peak source. Vendor theoretical ceilings and empirically calibrated reference lines are different evidence. Use decimal GB/s consistently, not GiB/s mislabeled as GB/s.

**Reproduce:** For an out-of-place FP32 scaled vector addition with a scalar coefficient held in a register, derive $`F=2n`$ and minimum requested bytes $`Q=12n`$: read two vectors and write one. Thus $`I=1/6`$ FLOP/byte. For a declared streaming, no-reuse DRAM model, derive $`t \ge \max(2n/P,12n/B)`$. Plot your event-timed point with useful FLOPs and modeled bytes explicitly labeled; without traffic counters, do not call $`12n/t`$ measured DRAM bandwidth.

**Traps**

- Dividing useful bytes by time and calling the result actual DRAM throughput when cache reuse or transaction overfetch is unknown.
- Comparing scalar FP32 work with a sparse low-precision tensor-core peak.
- Adding redundant arithmetic to move right on the roofline and claiming more useful work was accomplished.

**Practice**

- The section mini-project covers this: `kernellab` operation/byte models, explicitly sourced or calibrated ceilings and event-timed roofline points with traffic-counter checks where permitted.

**Stop when:** Your plot can be regenerated from declared work, byte and timing definitions, with every ceiling sourced or labeled empirical and every unmeasured traffic count labeled modeled.

<details>
<summary>Self-test</summary>

1. A vector copy has no floating-point arithmetic. Should it have a positive FLOP/s point?
   - No. Report copy bandwidth with a defined read-plus-write byte count. A log-scale FLOP roofline cannot place zero FLOPs directly.
2. Can useful-byte throughput exceed a device's DRAM bandwidth without violating physics?
   - Yes, when cache reuse means useful bytes exceed actual DRAM traffic. The numerator and memory boundary differ.
3. Does a point far below the sloping roof prove a bandwidth bottleneck?
   - No. Launch gaps, insufficient parallelism, dependencies, synchronization or instruction limits may prevent reaching that roof.
4. If a kernel executes padded multiply-adds that do not contribute to the output, do they increase useful FLOPs?
   - No. They increase executed work. Report useful and executed counts separately.

</details>

#### U11. Warp stalls, resource evidence and bottleneck classification

**About 4 h** · **Target:** Measure

Topics: Warp stalls, occupancy, register pressure and resource evidence; Launch, memory, compute, resource, synchronization, transfer and host bottlenecks

A stall name describes a warp state, not necessarily the critical path. A bottleneck claim needs converging evidence and an experiment that could disprove it.

**You can now**

- Predict launch-, memory- and compute-sensitive regimes before collecting profiles.
- Combine scheduler, memory, pipeline and resource evidence rather than diagnosing from one stall percentage.
- Distinguish bandwidth saturation from latency, occupancy, synchronization, transfer and host limits.

**Study**

1. [Resource and bottleneck reasoning](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 6 to 8) - Chapter 8, Analyzing Warp Stall Reasons with Nsight Compute; Inspecting Achieved Occupancy and GPU Utilization; Iteratively Profiling and Determining the Kernel Bottleneck; Profiling and Mitigating Register Pressure. Depth: Do not use the Memory-Related Stalls paragraph's definition of Not Selected as waiting for memory transaction slots. It is incorrect; use NVIDIA's Warp Stall Reasons table. Do not infer bandwidth saturation from a large scoreboard percentage alone.
2. [Nsight Compute 2026.3.1: scheduler states and section evidence](https://docs.nvidia.com/nsight-compute/ProfilingGuide/#warp-stall-reasons) (Nsight Compute Profiling Guide) - Section 2.2.2, Sections and Rules: SchedulerStats, WarpStateStats, SourceCounters, Occupancy, MemoryWorkloadAnalysis and ComputeWorkloadAnalysis; section 2.4.7, Warp Stall Reasons. Depth: Read the long-scoreboard, short-scoreboard, not-selected, barrier and math-pipe-throttle entries. Check availability and definitions on the target architecture before collecting them.
3. [Occupancy API and static-resource example](https://github.com/cfregly/ai-performance-engineering/blob/b57e4c6a9e261c09ac09208705d040c81b03d35e/code/ch08/occupancy_api_example.cu) (AI Systems Performance Engineering companion code - Chapters 6 to 8) - Commit b57e4c6: `exampleKernel`; `main` from `cudaOccupancyMaxPotentialBlockSize` through theoretical occupancy calculation. Depth: Read the resource-query sequence, not its first-ten-elements check as a complete correctness suite. Recompute device limits for Ampere and use ceiling division for warps when a block size is not a multiple of 32.

**Focus**

- Use the timeline first for host gaps, launch supply, transfers and dependencies. Low compute and memory throughput can reflect little work rather than a faulty kernel.
- A long scoreboard indicates a dependency on L1TEX work, not proof of DRAM saturation. Not Selected means an eligible warp lost selection to another warp; it can accompany healthy latency hiding.
- Inspect `SchedulerStats` issue activity before chasing stalls. Corroborate with `MemoryWorkloadAnalysis`, `ComputeWorkloadAnalysis`, resource reports and a controlled size or block-size sweep.
- Use `ptxas` register/spill reports and occupancy API limits as static evidence. Theoretical residency is not measured achieved occupancy or throughput; reducing registers can cause spills and make execution slower.

**Reproduce:** Before running, classify a tiny copy, a streaming copy larger than L2, and a matrix-multiply size sweep as candidate launch-, memory- and compute-sensitive regimes. For each, write one falsifier. Collect interleaved event timings, a timeline and static launch/resource evidence; add the relevant minimal counter sections where permitted. Report confirmed, contradicted or unresolved hypotheses rather than forcing all three labels when the evidence is incomplete.

**Traps**

- Treating high theoretical occupancy as the goal instead of measuring latency and spill costs.
- Calling every long-scoreboard stall DRAM traffic; local spills and cache-served loads can also create dependencies.
- Inferring a universal bottleneck from one small shape or a stall percentage averaged over different source regions.

**Practice**

- The section mini-project covers this: three `kernellab` regime predictions, falsifying sweeps and evidence-backed classifications, with unavailable hardware-counter checks left pending.

**Stop when:** Each of your three regime reports links a predeclared hypothesis to a model, timing, timeline and resource evidence, and clearly separates confirmed conclusions from blocked counter checks.

<details>
<summary>Self-test</summary>

1. Why can many Not Selected warps be harmless?
   - They are eligible to issue, but another warp issued that cycle. The scheduler may be productive; this is not itself a memory dependency.
2. What distinguishes memory latency from saturated DRAM bandwidth?
   - Latency-limited work can wait on dependencies while transferring well below sustainable bandwidth. Saturation requires evidence of high actual traffic throughput, not merely waiting warps.
3. Can the occupancy API establish achieved occupancy?
   - No. It predicts resource-limited residency. Runtime work distribution, tails and stalls require execution evidence.
4. How can you test a launch-overhead hypothesis without counters?
   - Use a short timeline and size/batch sweeps. Look for launch-supply gaps and near-flat small-work latency, while keeping completed timing boundaries consistent.

</details>

#### U12. End-to-end translation, regressions and cross-device reproducibility

**About 4 h** · **Target:** Measure

Topics: Kernel speedup, dispatch cost and end-to-end translation; Performance regressions and retained no-benefit regimes; Cross-device and cross-generation reproducibility

A local kernel improvement may disappear under dispatch, transfers or unchanged work. Integration and retained regressions determine whether the change is useful.

**You can now**

- Predict maximum end-to-end gain from measured kernel share, speedup and added overhead.
- Evaluate the same mechanism over a declared shape/dtype distribution and retain losing regimes.
- Produce a reproducible device-specific result and distinguish a second-device experiment from a portability claim.

**Study**

1. [Integration, negative regimes and reproducibility](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/gpu-microbenchmark-kernel-suite.md#measurement-requirements) (GPU Microbenchmark and Kernel Suite - Harness and Instrumentation) - Architecture constraints; Hardware variants; Milestone B - Instrumentation; Measurement requirements; Design-defense questions 5 and 6; Rubric, Measurement and Reproducibility. Depth: Use the harness and reporting requirements here. The complete kernel suite and final design defense belong to later sections. A second device is optional; do not simulate timings and call them measured portability.
2. [Where model time goes before optimization](https://github.com/stanford-cs336/assignment2-systems/blob/main/cs336_assignment2_systems.pdf) (CS336 Assignment 2 - Section 2.1 Profiling) - Section 2.1, Profiling, opening motivation; section 2.1.4, Problem (`nsys_profile`), parts (a), (b), (d) and (e), p. 6.

**Focus**

- For baseline time $`T`$, replaceable critical-path share $`f`$, local speedup $`s`$ and added non-overlapped overhead $`d`$, predict $`T' = T(1-f+f/s)+d`$. This assumes unchanged remaining work and dependencies; cumulative overlapping kernel time is not a valid share.
- Measure both isolated kernel time and completed invocation time, including validation of shape/dtype/device guards and any layout conversion, dispatch or synchronization required in deployment.
- Declare workload weights and summarize total weighted time, not an unweighted average of speedups. Retain tiny, strided, edge and cold-start cases where the candidate loses.
- A second GPU of the same generation tests another device, not another compute-capability generation. Rebuild, capture its environment and recompute models; with one device, limit the claim to that device and list portability checks not performed.

**Reproduce:** For a synthetic serial workload taking 100 ms, with a replaceable 40 ms kernel accelerated by a factor of 2 and no added overhead, derive 80 ms total time and a speedup of 1.25. Adding 5 ms of dispatch/conversion gives 85 ms and a speedup of about 1.176. Then apply the formula to a retained trace using critical-path share, measure completed invocation latency across your shape matrix, and explain the residual without fitting the share after seeing the answer.

**Traps**

- Using the sum of overlapping kernel durations as a fraction of wall time and applying a serial Amdahl model to it.
- Publishing only shapes used for tuning, or dropping no-benefit and slower regimes from the report.
- Calling the same compute capability a guarantee of identical performance, supported features or library dispatch.

**Practice**

- The section mini-project covers this: the `kernellab` end-to-end bound, invocation-versus-kernel report, retained regressions and device-scoped reproduction manifest.

**Stop when:** Your report compares predicted and measured completed invocation gain over a declared workload matrix, retains a no-benefit or losing case, and states exactly which device/version paths were checked.

<details>
<summary>Self-test</summary>

1. If only 40% of serial runtime is replaceable, what is the ideal speedup limit with zero overhead?
   - As local speedup tends to infinity, the limit is $`1/(1-0.4)=5/3`$, about 1.667. The unchanged 60% remains.
2. Why might a twice-as-fast kernel make an operator slower?
   - Dispatch, conversion, extra allocation or synchronization can cost more than the saved kernel time, especially for small shapes.
3. Does passing correctness on two Ampere devices prove cross-generation portability?
   - No. It checks those devices and configurations. Other generations, compilers and feature paths need their own compatibility and measurement evidence.
4. Why retain a shape where the candidate loses?
   - It constrains the claim and exposes where a fallback or different dispatch choice is needed. It also protects against a misleading aggregate win.

</details>

### Mini-project: Correctness-first harness with timelines, counters and regime evidence

**About 12 to 16 hours.** Harden the kernellab harness: a manifest with machine state, paired interleaved trials with raw samples, independent references over an adversarial matrix, four sanitizer reproducers, minimal counter captures, a roofline point, three classified regimes and an end-to-end bound with retained losses. Counter steps run under `sudo ncu` or record the permission block with counter-free evidence.

1. Extend `manifests/env.json` with a timestamped machine-state log: SM clock, power and temperature from `nvidia-smi -q -d CLOCK,POWER,TEMPERATURE`, background processes, whether clocks can be locked without privilege, and allocator behavior. Run one short timing twice with interleaved variants, attach both logs, and write an interference and isolation audit that explains any state difference without attributing every fluctuation to one cause. Add the rotating-buffer cache experiment: fresh-process first call against rotating preallocated inputs against reused inputs, with warmup samples kept and the preserved state declared for each.
2. Implement paired randomized interleaved trials in `harness/run.py` with a recorded seed, raw per-trial samples, a drift plot and a documented resampling unit with uncertainty. Show the method on synthetic paired latencies baseline `[10, 20, 30]` against candidate `[5, 10, 15]`: both medians and paired speedups give 2, and perfectly proportional pairs can resample with zero spread without proving noise-free hardware. Apply the same summaries to retained interleaved GPU samples from two seeded 512 by 512 `torch.float32` matmuls on the RTX 3050 (10 warmup, 20 timed) with event and synchronized host boundaries and a CPU double-precision check of the last output.
3. Write independent copy and reduction references in `refs/` that share no logic with the kernels. Cover lengths 0, 1, 31, 32, 33, 255, 256 and 257, a stride-two view of a known sequence at zero tolerance with every element compared, and output prefilled with `NaN` so omitting the last element fails; the empty path must avoid an invalid zero-block launch. Keep seeded tail and stride regressions, then add cancellation, `NaN`, infinity, overflow, underflow and all-masked policy tests with a stated tolerance rule. Run the four CS336 accumulation loops unchanged on CPU and explain them: 10.000133514404297 and 9.953125 for the fp32 and fp16 loops, 10.00213623046875 for both fp32-accumulated loops as 1000 times the fp16 value 0.01000213623046875, separating input rounding from accumulation rounding.
4. Seed four minimal reproducers in `kernels/cuda/diag/`: a one-past-the-end write, an uninitialized global read, a shared-memory neighbor read without a barrier, and `__syncwarp(0x0000ffff)` called by all 32 threads of a warp. Build the first three for `sm_86` with `-lineinfo` and run `compute-sanitizer --tool memcheck --padding 32`, initcheck and racecheck so each reports its defect; build the last with `-G` so synccheck reports Barrier error detected with invalid arguments while an `-O3` build reports nothing because the compiler removed the barrier. Keep each log, repair and regression test.
5. Capture one NVTX-annotated `nsys profile --trace=cuda,nvtx --sample=none --cpuctxsw=none` timeline for the matmul batch, follow one API call to its kernel, identify the final synchronization and report the union of kernel intervals beside the event interval and completed wall time. Then take a minimal hypothesis linked `sudo ncu` capture requesting only `LaunchStats` plus one section, recording replay mode, pass count, cache and clock control and observer overhead against unprofiled time. Where counters are denied, keep the `ERR_NVGPUCTRPERM` record and substitute event timing plus `cuobjdump -res-usage` and occupancy API evidence with no overhead ratio claimed.
6. Derive the operation and byte model for out-of-place fp32 scaled vector addition with a register scalar: $`F = 2n`$ and minimum requested bytes $`Q = 12n`$ for intensity $`I = 1/6`$ FLOP/byte, with streaming no-reuse bound $`t`$ above $`\max(2n/P, 12n/B)`$. Place one event-timed point with useful FLOPs and modeled bytes labeled, using sourced or calibrated ceilings, and add traffic-counter checks only where permitted; without counters never call $`12n/t`$ measured DRAM bandwidth.
7. Predeclare three regimes with one falsifier each: a tiny copy as launch sensitive, a streaming copy larger than L2 as bandwidth sensitive, and a GEMM size sweep as compute sensitive. Collect interleaved event timings, a timeline and static launch and resource evidence, adding minimal counter sections only under `sudo ncu` where permitted. Report each hypothesis as confirmed, contradicted or unresolved rather than forcing all three labels when evidence is incomplete.
8. Apply the end-to-end bound $`T_{e} = T(1-f+f/s)+d`$: for a synthetic 100 ms workload with a 40 ms kernel at speedup 2 the total is 80 ms (1.25x), and 85 ms near 1.176x with 5 ms of dispatch and conversion. Apply the same formula with critical-path share to one retained trace, report kernel time beside completed invocation latency across the shape matrix including retained losing shapes, and file a device-scoped reproduction manifest. Include the CS336 memory note as a labeled observation: one full AdamW step on the small model at batch 4 peaked at 2.93 GiB at context 256, 4.83 at 512 and 10.74 at 1024, with medium at 8.41 and 13.55 GiB at 256 and 512 and OOM at 1024 on 24 GB.

**Deliverables**

- The hardened harness with the machine-state log, paired interleaved trials, raw samples, drift plots and the rotating-buffer cache evidence.
- Independent references with the adversarial matrix, seeded tail and stride regressions and the extreme value policy beside the four-loop numerical note.
- Four sanitizer reproducers with logs, repairs and regressions; one `nsys` timeline with NVTX correlation; one minimal `sudo ncu` capture or the permission-block record with counter-free evidence.
- The roofline point with labeled models and ceilings, three regime reports with falsifiers, and the end-to-end bound with losing shapes and the reproduction manifest.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [CS336 Assignment 2 local tests](https://github.com/stanford-cs336/assignment2-systems). Run the `benchmarking_script`, `nsys_profile`, `mixed_precision_accumulation` and `memory_profiling` problems locally on sizes that fit 6 GB.

| Criterion | Pass | Strong |
| --- | --- | --- |
| References and tolerances | Independent references pass the full length matrix and stride-two views at stated tolerance, seeded tail and stride regressions fail on the seeded omission, and extreme inputs follow the written policy. | The four-loop note separates input rounding from accumulation rounding with the exact values quoted. |
| Sanitizers and timelines | Each reproducer reports under its stated tool and flags, the `-G` synccheck case and the `-O3` silence are both kept, and the timeline attributes one host gap or transfer without reaching for counters first. | Regressions are minimal single-defect programs with the exact log line that identifies each defect. |
| Counters and regimes | The `sudo ncu` capture is minimal and hypothesis linked with replay and overhead recorded, or the permission block is kept with event plus `cuobjdump -res-usage` evidence, and each regime carries a falsifier and a verdict of confirmed, contradicted or unresolved. | The roofline labels useful against requested against actual bytes and never claims measured bandwidth without traffic counters. |
| End-to-end honesty | The bound is applied with critical-path share, kernel time sits beside completed invocation latency, losing shapes are retained, and the manifest scopes reproduction to one device. | The report states which invocation costs the kernel win cannot move. |

Feeds into: Capstone laboratory: the harness, references, sanitizer regressions, timelines, counters and regime evidence. Later kernel sections reuse the trial design and the bound.

### Resource route

- **Primary - Book:** [AI Systems Performance Engineering - Chapters 6 to 8](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) - Read Chapters 6 to 8: GPU architecture and occupancy, profiling and tuning memory access, and occupancy, warp efficiency and instruction-level parallelism, with their Nsight Systems, Nsight Compute and roofline workflows. Treat every quoted speedup as a hypothesis for your own hardware.
- **Required - Lab:** [AI Systems Performance Engineering companion code - Chapters 6 to 8](https://github.com/cfregly/ai-performance-engineering/tree/main/code) - Use selected baseline and optimized pairs from `code/ch06`, `code/ch07` and `code/ch08` plus the shared benchmark and verification machinery. Run only hardware-compatible paths, inspect the tests first, retain raw artifacts and document any guard or unavailable feature.
- **Required - Documentation:** [Nsight Systems User Guide](https://docs.nvidia.com/nsight-systems/UserGuide/) - Learn capture, statistics, CUDA API and GPU timeline views, NVTX ranges and report export. Produce one trace that attributes a host gap, transfer or synchronization cost without using the kernel profiler first.
- **Required - Documentation:** [Nsight Compute Profiling Guide](https://docs.nvidia.com/nsight-compute/ProfilingGuide/) - Study the profiling model, replay, metric collection, sections, roofline and source correlation. Collect the smallest counter set that can falsify your bottleneck hypothesis and record profiler overhead.
- **Required - Documentation:** [Compute Sanitizer](https://docs.nvidia.com/compute-sanitizer/ComputeSanitizer/) - Run memcheck plus applicable racecheck, initcheck and synccheck cases against seeded defects. Preserve minimal reproducers and regression tests, and distinguish unsupported checks from a clean result.
- **Required - Paper:** [Roofline: An Insightful Visual Performance Model](https://www2.eecs.berkeley.edu/Pubs/TechRpts/2008/EECS-2008-134.html) - Read the original model and construct one roofline plot with explicit peak assumptions, useful operations and bytes. Add measured points and explain gaps from launch, resource, cache or instruction effects.
- **Support - Methodology:** [CUTLASS GEMM Performance Measurement Methodology](https://docs.nvidia.com/cutlass/latest/media/docs/cpp/gemm_performance_measurement_methodology_guidelines.html) - Apply the environment, clock, warmup, timing, verification and reporting guidance to the benchmark harness. Generalize the method beyond GEMM and document every intentional deviation.
- **Support - Assignment:** [CS336 Assignment 2 - Section 2.1 Profiling](https://github.com/stanford-cs336/assignment2-systems) - Do the `benchmarking_script`, `nsys_profile`, `mixed_precision_accumulation` and `memory_profiling` problems on a model size that fits your GPU instead of the handout's B200 settings. Keep raw timings, traces and memory snapshots.
- **Support - Practice:** [TensorTonic Language Modeling from Scratch - Measure Kernel Timeline Utilization](https://www.tensortonic.com/study-plans/language-modeling-from-scratch) - Solve the timeline-utilization problem after the timeline unit, then repeat the calculation on a trace you captured yourself.
- **Support - Project:** [GPU Microbenchmark and Kernel Suite - Harness and Instrumentation](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/gpu-microbenchmark-kernel-suite.md) - Complete Milestones A and B: correct references, synchronized timing, raw samples, noise characterization, environment capture, operation and byte models, timeline traces and profiler evidence.
- **Reference - Documentation:** [PyTorch 2.14 numerical accuracy and tensor testing](https://docs.pytorch.org/docs/2.14/notes/numerical_accuracy.html) - Read the numerical-accuracy introduction, Extremal values, non-finite inputs and Ampere precision sections, plus the `assert_close` contract and `make_tensor` parameters. These supply current comparison semantics missing from the pool's project checklist.
- **Reference - Documentation:** [CUDA 13.4 Floating Point and IEEE 754](https://docs.nvidia.com/cuda/floating-point/index.html) - Read sections 2.2, 3.1 to 3.2 and 4.4 for reduction order and single-precision flush-to-zero flags. Do not use the historical CPU-has-no-FMA statements as current hardware facts.

### Exit checkpoint

Audit and repair a misleading GPU benchmark, diagnose one correctness defect and classify three kernel regimes using independent references, synchronized raw trials, timelines, counters and a roofline model declared before profiling.

<details>
<summary>Deliberately left for later</summary>

- Large monitoring platforms and fleet-wide telemetry
- Collecting every profiler metric without a falsifiable question
- Cross-generation claims until one device has a complete reproducibility package

</details>

## GPU-4. CUDA Data Movement and Parallel Primitives

**Why:** Transpose, reduction, scan, histogram and softmax expose the recurring constraints behind larger kernels: memory layout, synchronization, work efficiency, atomics, numerical order and asynchronous lifetime.

### Learn this much

- [ ] Elementwise maps and grid-stride coverage _(Required)_
- [ ] Naive matrix transpose and requested memory transactions _(Required)_
- [ ] Shared-memory transpose tiling and coalesced reads and writes _(Required)_
- [ ] Bank-conflict diagnosis and padding or swizzle fixes _(Required)_
- [ ] Alignment-safe vectorized loads and stores _(Required)_
- [ ] Reduction trees, operation count and work efficiency _(Required)_
- [ ] Floating-point non-associativity and reduction tolerances _(Required)_
- [ ] Warp shuffle and warp-level reduction _(Required)_
- [ ] Block reduction, partials, atomics and multi-pass completion _(Required)_
- [ ] Zero, odd, tiny, large and nonmultiple lengths _(Required)_
- [ ] Kogge-Stone scan and work-depth trade-offs _(Required)_
- [ ] Brent-Kung scan and reduced work _(Required)_
- [ ] Decoupled look-back and single-pass scan _(Depth)_
- [ ] Segmented scan and boundary semantics _(Optional)_
- [ ] Histogram atomics, contention and collision distributions _(Required)_
- [ ] Privatization, aggregation and merge costs _(Required)_
- [ ] Predicate, scan and scatter for stream compaction _(Required)_
- [ ] Numerically stable online normalizer and softmax _(Required)_
- [ ] Extreme logits, all-masked rows and empty-row policy _(Required)_
- [ ] Thread coarsening, instruction work and memory reuse _(Required)_
- [ ] Pinned host memory and asynchronous transfers _(Required)_
- [ ] Streams, events, dependency graphs and buffer lifetime _(Required)_
- [ ] Copy and compute overlap with timeline proof _(Required)_
- [ ] CUDA graph capture, replay, update and eager fallback _(Required)_
- [ ] Shape, dtype, layout and device dispatch with validated fallback _(Required)_
- [ ] Race, divergent barrier, partial warp, stale buffer and mask defects _(Required)_
- [ ] GPU sorting and graph primitives _(Later)_

### Study units

#### U1. Elementwise maps, vectorized access and thread coarsening

**About 4 h** · **Target:** Implement

Topics: Elementwise maps and grid-stride coverage; Alignment-safe vectorized loads and stores; Thread coarsening, instruction work and memory reuse

Every later primitive reuses this loop. If the map is wrong on tails or wastes transactions, the reduction, scan and softmax built on it inherit both defects.

**You can now**

- Write a grid-stride elementwise kernel that covers any length, including zero and nonmultiple sizes, with one bounds check.
- Convert scalar loads to alignment-guarded vectorized loads and predict the per-warp transaction change.
- Apply thread coarsening and state where its extra registers and lost parallelism stop paying off.

**Study**

1. [Thread coarsening](https://shop.elsevier.com/books/programming-massively-parallel-processors/hwu/978-0-323-91231-0) (Programming Massively Parallel Processors, 4th edition - Chapters 6 and 9 to 12) - Chapter 6, Section 6.3 (printed p. 138): assigning several elements to each thread; Chapter 10, Section 10.8 (printed p. 228): coarsening against parallelization overhead.
2. [Map pattern and coarsening notes](https://accelerated-computing.academy/fall25/lectures) (MIT 6.S894 Accelerated Computing (Fall 2025) - Lectures 6, 7 and 9 and Lab 7) - Lecture 7, Pattern #1: Map (slide 9); Pattern #3: Reduce (slides 18 to 31), including the thread-coarsening note.
3. [Coalesced access and transaction width](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/writing-cuda-kernels.html) (CUDA C++ Programming Guide (v13.4.2)) - Section 2.3.4.1: 32-byte transactions, the 4-byte word example with four transactions at full utilization, and the 12.5 percent worst case. Depth: Read for the transaction model only. The section's transpose example belongs to the next unit.
4. [Grid-stride loop pattern](https://developer.download.nvidia.com/assets/cuda/files/reduction.pdf) (Optimizing Parallel Reduction in CUDA) - Reduction #7, slides 31 to 33: the grid-stride accumulation loop that adds as many elements as necessary. Depth: Use only for the loop pattern. The reduction sequence belongs to the reduction units.

**Focus**

- A grid-stride loop decouples launch configuration from length: each thread visits `i`, `i + gridDim.x * blockDim.x`, and so on, so every index is covered exactly once for any length including 0.
- One 16-byte vectorized load moves 4 floats per thread and needs 16-byte alignment. Guard with an alignment and divisibility test and keep a scalar tail.
- Coarsening trades fewer blocks and amortized index math for more registers per thread and less parallel slack. PMPP frames it as paying less for parallelism.
- Coalescing is about the warp, not the thread: consecutive threads should touch consecutive words so one 128-byte request fills four 32-byte transactions.

**Reproduce:** From a blank file, write scalar, vectorized (`float4`) and 4-way coarsened saxpy kernels with a grid-stride loop, and predict each variant's per-warp transaction count before running. On 1000003 random floats all three match a CPU reference computed with `fmaf` bit-exactly. `nvcc` contracts `a * x[i] + y[i]` into one fused multiply-add by default, so a CPU reference that multiplies and then adds differs in the last bit: on an RTX 3050 6 GB with CUDA 13.4 it disagreed at 282,894 of the 1,000,003 elements.

**Traps**

- Trusting base-pointer alignment after arithmetic. `cudaMalloc` returns aligned bases, but `p + offset` may not be 16-byte aligned, so check the accessed address at runtime.
- Testing only round sizes. A vectorized loop without a scalar tail silently drops the last $`n \bmod 4`$ elements, so test 1000003, not just 1048576.
- Assuming more coarsening is faster. Past the point where blocks still fill the SMs, extra work per thread only adds register pressure and loses latency hiding.

**Practice**

- The section mini-project covers this: scalar, vectorized and coarsened map variants with grid-stride coverage, an independent CPU reference and odd-size tests.

**Stop when:** All three saxpy variants match an `fmaf` reference exactly on an odd size, and you predict each variant's per-warp transaction count before profiling.

<details>
<summary>Self-test</summary>

1. With 256 blocks of 256 threads and length 1000003, which indices does thread 0 visit?
   - Stride 65536: 0, 65536, up to 983040, which is 16 visits. The next, 1048576, exceeds the length.
2. A float pointer sits at a byte address with remainder 8 modulo 16. Is a `float4` load through it safe?
   - No. Vector loads need 16-byte alignment. Peel a scalar head, take a scalar path, or realign the allocation.
3. One warp loads one consecutive float per thread. How many 32-byte transactions, and at what utilization?
   - 128 bytes in four transactions at full utilization. Every fetched byte is used.
4. Why can 8-way coarsening run slower than 4-way on a short vector?
   - Too few blocks remain to fill the SMs, and each thread holds more live state. Parallel slack is lost after the memory saving is exhausted.

</details>

#### U2. Transpose: coalescing, shared-memory tiles and bank conflicts

**About 5 h** · **Target:** Implement + Measure

Topics: Naive matrix transpose and requested memory transactions; Shared-memory transpose tiling and coalesced reads and writes; Bank-conflict diagnosis and padding or swizzle fixes

Transpose is the smallest kernel where layout decides bandwidth. The tile, barrier and padding pattern repeats in GEMM and attention.

**You can now**

- Predict requested transactions for strided reads and writes of a transpose.
- Implement copy, naive and padded shared-memory tiled transpose with correct odd-shape guards.
- Diagnose a 32-way bank conflict and apply padding, showing measured bandwidth against the copy ceiling.

**Study**

1. [Copy, naive and coalesced transpose](https://developer.nvidia.com/blog/efficient-matrix-transpose-cuda-cc/) (Efficient Matrix Transpose in CUDA C/C++) - Simple Matrix Copy; Naive Matrix Transpose, with the 1024-element (4096-byte) write stride on the 1024x1024 test; Coalesced Transpose Via Shared Memory, with `TILE_DIM=32`, `BLOCK_ROWS=8` and 4 elements per thread. Depth: The M2050 and K20c GB/s numbers are 2013 hardware. Reproduce the ranking on your own GPU, not the values.
2. [Bank conflicts and the padding fix](https://developer.nvidia.com/blog/efficient-matrix-transpose-cuda-cc/) (Efficient Matrix Transpose in CUDA C/C++) - Shared Memory Bank Conflicts through the padded `tile[TILE_DIM][TILE_DIM+1]` variant, including the `copySharedMem` control experiment.
3. [Transpose worked example and padding](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/writing-cuda-kernels.html) (CUDA C++ Programming Guide (v13.4.2)) - Sections 2.3.4.1.1 (naive transpose with uncoalesced writes), 2.3.4.2.1 (shared-memory transpose) and 2.3.4.2.2 (32-way column conflict, fixed by declaring 32x33 shared memory).

**Focus**

- Naive transpose reads coalesced but writes with a stride of the matrix width. On the blog's 1024x1024 test that is 4096 bytes between consecutive threads.
- A `tile[32][32]` of floats read down one column maps every element to the same bank: a 32-way conflict. With `tile[32][33]`, element row $`r`$ of column $`c`$ sits in bank $`(r + c) \bmod 32`$, so a column access is conflict-free.
- The copy kernel is the ceiling: it moves the same twice-the-matrix traffic with ideal access. A transpose near copy bandwidth is done.
- Fewer threads than tile elements (a $`32 \times 8`$ block for a $`32 \times 32`$ tile) amortizes index math, with 4 elements per thread.

**Reproduce:** Rebuild copy, naive and padded-tiled transpose for 4096x4096 fp32 random data and time each with events, median of 11 trials. On an RTX 3050 6 GB with CUDA 13.4 the copy reached 152 GB/s, naive 48 GB/s and tiled 151 GB/s, counting one read and one write per element, and the tiled output matched a CPU transpose exactly, including a 1000x1000 check of the edge guards. Expect the same ranking on your GPU, with tiled near copy.

**Traps**

- Trusting a bandwidth number above the DRAM peak. It usually means the grid covers only part of the matrix or the byte count is wrong, so check coverage first, then compare against the copy kernel.
- Reading the blog's M2050 and K20c GB/s values as targets. Reproduce the ranking of copy, tiled and naive, not decade-old values.
- Swapping block indices without swapping tile offsets writes each tile to the wrong place while staying in bounds. Zeros cannot catch this; an index-pattern input where element equals row times width plus column can.

**Practice**

- [LeetGPU challenge 3: Matrix Transpose](https://leetgpu.com/challenges/matrix-transpose) - Challenge 3: `solve(input, output, rows, cols)` over fp32, with functional cases from 1x1 and 1x4 through 8192x8192 and a performance case of 7000 rows by 6000 columns. Run it on LeetGPU or locally: build your `solve` with `nvcc -shared -Xcompiler -fPIC`, load it with `ctypes`, and check it against `reference_impl` on the cases from `generate_functional_test` and `generate_performance_test` in the challenge's `challenge.py` (public in AlphaGPU/leetgpu-challenges). That file imports `core.challenge_base`, which the repository does not ship; a two-line stub class with `device = "cuda"` is enough. Keep your own source, and add a nonmultiple shape beyond the public cases.

**Stop when:** Your tiled transpose matches the reference on square, tall, wide and odd shapes and reaches at least 0.9 times your measured copy bandwidth on 4096x4096.

<details>
<summary>Self-test</summary>

1. On a 1024x1024 fp32 matrix, what stride separates consecutive threads' writes in the naive transpose?
   - 1024 elements, or 4096 bytes. Each warp's 32 writes land in 32 different segments.
2. A warp reads one column of a `tile[32][32]` float array. Which banks, and what changes with `tile[32][33]`?
   - All 32 requests hit one bank: a 32-way conflict. With the +1 padding, element $`r`$ of column $`c`$ sits in bank $`(r + c) \bmod 32`$, so the 32 requests hit 32 distinct banks.
3. The tiled kernel matches copy bandwidth on square shapes but fails on width 1000. What is the likely cause?
   - Missing bounds guards for nonmultiple dimensions. Guard both the load loop and the store loop, since a partial edge tile underfills both.
4. Why is the copy kernel a better ceiling than the vendor peak bandwidth?
   - Copy moves the same read-plus-write traffic with ideal access on your GPU, clocks and power state. It measures what is achievable here, not a datasheet bound.

</details>

#### U3. Reduction trees, work efficiency and floating-point order

**About 4 h** · **Target:** Derive

Topics: Reduction trees, operation count and work efficiency; Floating-point non-associativity and reduction tolerances

Reduction is where parallelism meets floating-point reality. The fastest tree also sums in a different order, and that order is part of the result.

**You can now**

- Derive the work $`N - 1`$, depth $`\log_2 N`$ and idle-thread fraction of a tree reduction.
- Predict how tree order changes a float32 sum and bound the change with a float64 reference.
- Trace the interleaved-to-sequential addressing fixes and state what each one removes.

**Study**

1. [Reduction trees and a simple kernel](https://shop.elsevier.com/books/programming-massively-parallel-processors/hwu/978-0-323-91231-0) (Programming Massively Parallel Processors, 4th edition - Chapters 6 and 9 to 12) - Chapter 10, Sections 10.1 to 10.3 (printed pp. 211 to 218): reduction trees, operation count and the first shared-memory kernel.
2. [Seven-kernel optimization sequence](https://developer.download.nvidia.com/assets/cuda/files/reduction.pdf) (Optimizing Parallel Reduction in CUDA) - Slide 2 (intent: 7 versions), slides 7 to 28 from interleaved addressing through complete unrolling, and the slide 34 performance table for 4M elements. Depth: The GB/s values are 2008-era hardware. Trace the code changes and treat the table as history, not targets.
3. [Order-dependence scripts](https://github.com/gpu-mode/lectures) (GPU MODE - Reductions and Scans) - Lecture 9 code in `lecture_009/`: `nondeterminism.py` (left-to-right 0.0 versus right-to-left 1e-19 on the same list) and `accuracy.py` (fp32 versus fp16 absorption at 1000.0 plus 1e-3). Depth: Run the scripts to feel order effects. Save the lecture slides for later.

**Focus**

- A tree does $`N - 1`$ adds in $`\lceil \log_2 N \rceil`$ steps. Step $`s`$ does $`N/2^s`$ adds, so half the threads idle after the first step.
- Interleaved addressing diverges warps and pays for modulo; the strided-index form removes divergence but bank-conflicts; sequential addressing is conflict-free.
- Challenge 4's reference accumulates in float64, so an fp32 tree passes at 1e-5 on friendly magnitudes. That proves nothing about ill-conditioned inputs.
- The deck uses `int` throughout, where every tree order is exact. Its sequence needs an FP re-derivation before you copy it into a float kernel.

**Reproduce:** By hand, reduce [6, 2, 7, 4, 5, 8, 3, 1] with a sequential-addressing tree to get 36 with 7 adds in 3 steps. Then show in float32 that $`(10^8 + (-10^8)) + 1 = 1`$ while $`10^8 + ((-10^8) + 1) = 0`$.

**Traps**

- Treating a Challenge 4 pass as an order certificate. The float64 reference plus 1e-5 tolerance absorbs tree-order error on friendly magnitudes, so test cancellation inputs separately.
- Copying the deck's unrolled last warp. It relies on `volatile` shared memory and warps running in lockstep; from Volta on, threads of a warp are scheduled independently, so finish with `__shfl_down_sync` or put `__syncwarp()` between the steps.
- Reading idle threads as inefficiency. Halving active threads each step is still work-efficient at $`N - 1`$ adds; a scheme that keeps every thread busy each step, as Kogge-Stone does for scan, does about $`N \log_2 N`$.

**Practice**

- [LeetGPU challenge 4: Reduction](https://leetgpu.com/challenges/reduction) - Challenge 4: `solve(input, output, N)` fp32 sum checked against `torch.sum(input.double()).float()` at absolute and relative tolerance 1e-5, with functional cases for $`N = 1`$, $`N = 5`$ and a 15M-element input, and a performance case of $`N = 4194304`$. Run it on LeetGPU or locally: build your `solve` with `nvcc -shared -Xcompiler -fPIC`, load it with `ctypes`, and check it against `reference_impl` on the cases from `generate_functional_test` and `generate_performance_test` in the challenge's `challenge.py` (public in AlphaGPU/leetgpu-challenges). That file imports `core.challenge_base`, which the repository does not ship; a two-line stub class with `device = "cuda"` is enough. Pass all functional tests, then add your own cancellation test in the $`10^8`$ style against a float64 reference. The public tests do not check order.

**Stop when:** You hand-trace the 8-element tree, explain what each deck stage removes, and your kernel passes Challenge 4 plus your own cancellation test.

<details>
<summary>Self-test</summary>

1. For 1024 elements, how many adds and how many steps does a tree reduction take?
   - 1023 adds in 10 steps. Each step halves the partials until one remains.
2. Why is the deck's first kernel slow, in two causes?
   - `tid % (2*s)` diverges warps and integer modulo is slow. Later kernels replace it with a strided index and a halving loop.
3. Challenge 4 compares against `torch.sum(input.double()).float()`. What does that reference hide?
   - Summation order error. Any fp32 tree order lands within 1e-5 on the test magnitudes, so order bugs on ill-conditioned inputs escape.
4. Why do $`(10^8 + (-10^8)) + 1`$ and $`10^8 + ((-10^8) + 1)`$ differ in float32?
   - Near $`10^8`$, float32 values are 8 apart, so $`-10^8 + 1`$ rounds back to $`-10^8`$ and the second order returns 0, while the first cancels exactly and then adds 1.

</details>

#### U4. Warp shuffles, block reductions, multi-pass completion and tails

**About 5 h** · **Target:** Implement

Topics: Warp shuffle and warp-level reduction; Block reduction, partials, atomics and multi-pass completion; Zero, odd, tiny, large and nonmultiple lengths

No single block sees the whole vector. This unit turns a block-local tree into a correct whole-array reduction, the completion pattern behind every multi-pass primitive.

**You can now**

- Write a warp shuffle reduction with a correct mask and tail handling.
- Complete a grid reduction with block partials and a second pass, covering lengths 0, 1, odd and huge.
- Measure coarsening-factor trade-offs and keep the factor where gains stop.

**Study**

1. [Divergence, memory and hierarchical reduction](https://shop.elsevier.com/books/programming-massively-parallel-processors/hwu/978-0-323-91231-0) (Programming Massively Parallel Processors, 4th edition - Chapters 6 and 9 to 12) - Chapter 10, Sections 10.4 to 10.7: minimizing control divergence, memory divergence and global accesses, plus hierarchical reduction for arbitrary input length.
2. [Shuffle prelab](https://github.com/accelerated-computing-class/lab7) (MIT 6.S894 Accelerated Computing (Fall 2025) - Lectures 6, 7 and 9 and Lab 7) - Lab 7, Part 0 (`shuffle.cu`): `__shfl_up_sync(0xffffffff, threadIdx.x, 1)` semantics, no wrap-around, and the two 32-integer cumulative-sum kernels with and without shared memory. Depth: Build for your own GPU with `nvcc -arch=sm_86` and recompute any SM count the questions assume. Use only Part 0 here; the scan parts belong to later units.
3. [Warp completion and cascading](https://developer.download.nvidia.com/assets/cuda/files/reduction.pdf) (Optimizing Parallel Reduction in CUDA) - Slides 21 and 22 (unrolling the last warp with `warpReduce`) and slides 31 to 33 (multiple adds per thread with a grid-stride loop). Depth: The deck predates Volta. Its `warpReduce` assumes lockstep warps, so rewrite it with `__shfl_down_sync` before you reuse it.
4. [Coarsened reduction code](https://github.com/gpu-mode/lectures) (GPU MODE - Reductions and Scans) - Lecture 9 code in `lecture_009/reduce_coarsening.cu`: per-thread accumulation with `COARSE_FACTOR` before the block tree.

**Focus**

- `__shfl_down_sync(0xffffffff, v, offset)` requires every lane named in the mask to make the same call, and a lane reading from an inactive lane gets an undefined value. Keep all 32 lanes in the reduction and give out-of-range lanes the identity (0 for a sum).
- Blocks cannot synchronize globally, so write one partial per block and finish with a second kernel launch. The second pass needs its own tail handling for odd partial counts.
- First-add-during-load halves the launched blocks: each thread adds two elements as it loads them, so the first tree level runs during the load. Global reads stay at $`N`$. Cascading extends the idea until occupancy or registers stop the gain.

**Reproduce:** Write a shuffle warp reduction plus a two-pass grid reduction with 4-way coarsening and grid-stride loads. On 1000003 values it matches a float64 reference with relative error below 1e-6, returns 0 for length 0 and returns the single value for length 1.

**Traps**

- Calling `__syncthreads()` inside a divergent branch. The guide calls it invalid or undefined behavior: the block may hang, or on current GPUs run on with a silent race. Keep barriers on uniform control flow.
- Finishing with one global atomic per element instead of one per block. Atomics belong at block granularity; per-element atomics turn completion into contention.
- Testing only multiples of 1024. Tail bugs hide there, so test 1, 31, 32, 33, 1023 and 1000003.

**Practice**

- The section mini-project covers this: shuffle and multi-pass reductions over zero, odd, nonmultiple and large sizes, with coarsening-factor measurements and a retained losing factor.

**Stop when:** Your two-pass reduction matches float64 within 1e-6 relative error on adversarial sizes, and you can state the coarsening factor where your GPU stops gaining.

<details>
<summary>Self-test</summary>

1. Why complete a grid reduction in two passes instead of one global barrier?
   - No grid-wide barrier exists for independently scheduled blocks. One partial per block plus a second launch is the portable completion; single-pass schemes risk deadlock.
2. A tail warp has 20 lanes with data and reduces with a full `0xffffffff` mask. When does this go wrong, and what is the fix?
   - If the other 12 lanes skip the shuffle inside a branch, the call is invalid and may hang. If they have exited, the call is allowed but shuffles that read from them return undefined values. Keep all 32 lanes in the reduction with identity values for the missing elements.
3. A 1,000,003-element reduction uses 256-thread blocks. How many blocks does it launch at coarsening 4 and at coarsening 64, and why can the second be slower on an 18-SM GPU?
   - 977 blocks at 4 and 62 at 64. Compute capability 8.6 holds up to six 256-thread blocks per SM, 108 on 18 SMs, so 62 blocks leave SMs partly idle and too few warps to hide memory latency.
4. What exactly does first-add-during-load halve?
   - The launched blocks and the threads that sit in the shared-memory tree: each thread sums two elements on load. Every element is still read once from global memory.

</details>

#### U5. Kogge-Stone, Brent-Kung and segmented scans

**About 5 h** · **Target:** Derive + Implement

Topics: Kogge-Stone scan and work-depth trade-offs; Brent-Kung scan and reduced work; Segmented scan and boundary semantics

Scan turns per-element predicates into global write positions. Compaction, sort and run-length coding all stand on it.

**You can now**

- Derive Kogge-Stone versus Brent-Kung work and step counts from the algorithm structure.
- Implement exclusive scan for arbitrary lengths with correct identity handling.
- Explain segmented-scan head-flag semantics and the decoupled look-back tile states.

**Study**

1. [Kogge-Stone, work efficiency and Brent-Kung](https://shop.elsevier.com/books/programming-massively-parallel-processors/hwu/978-0-323-91231-0) (Programming Massively Parallel Processors, 4th edition - Chapters 6 and 9 to 12) - Chapter 11, Sections 11.2 to 11.4 (printed pp. 238 to 250): Kogge-Stone, the $`N \log_2 N - (N - 1)`$ versus $`N - 1`$ work argument, and the Brent-Kung up-sweep and down-sweep with its $`2N - 2 - \log_2 N`$ count.
2. [Segmented and single-pass scans](https://shop.elsevier.com/books/programming-massively-parallel-processors/hwu/978-0-323-91231-0) (Programming Massively Parallel Processors, 4th edition - Chapters 6 and 9 to 12) - Section 11.6 (printed p. 253): three-kernel hierarchical scan for long inputs; Section 11.7 (printed p. 256): single-pass motivation with its atomic, fence and barrier deadlock risk. Depth: Read Section 11.7 for the argument only. Do not implement the domino scheme here.
3. [Decoupled look-back protocol](https://research.nvidia.com/sites/default/files/pubs/2016-03_Single-pass-Parallel-Prefix/nvr-2016-002.pdf) (Single-pass Parallel Prefix Scan with Decoupled Look-back) - Sections 4.1 and 4.2: tile states X (invalid), A (aggregate ready) and P (prefix ready), with the look-back, fence and constant-bound properties. Depth: Read for the state machine after two-pass scans pass. Implement a bounded version only if hardware and time allow a fair comparison.
4. [Scan, segmented scan and global strategies](https://accelerated-computing.academy/fall25/lectures) (MIT 6.S894 Accelerated Computing (Fall 2025) - Lectures 6, 7 and 9 and Lab 7) - Lecture 7, Pattern #5: Scan (slides 39 to 67), with scan-and-add versus reduce-then-scan versus decoupled look-back; Lecture 9, Pattern #5.5: Segmented Scan (slides 16 to 28), with head flags and the quicksort use case.
5. [Associative scan implementation](https://github.com/accelerated-computing-class/lab7) (MIT 6.S894 Accelerated Computing (Fall 2025) - Lectures 6, 7 and 9 and Lab 7) - Lab 7, Part 1 (`scan.cu`, `launch_scan`): an inclusive scan templated over an associative operator, tested with `SumOp` and `DebugRangeConcatOp`, no external libraries such as CUB, benchmarked at length $`2^{26}`$ with throughput defined as twice the bytes over time. Depth: Build for your own GPU with `nvcc -arch=sm_86`. Retarget the course goal of 144 GB/s (40 percent of the RTX 4000 Ada 360 GB/s peak) to 40 percent of your measured copy bandwidth.

**Focus**

- Kogge-Stone does $`N \log_2 N - (N - 1)`$ adds (20481 for $`N = 2048`$) in $`\log_2 N`$ steps, while Brent-Kung does $`2N - 2 - \log_2 N`$ (4083) in about twice the steps. That is step efficiency versus work efficiency.
- Exclusive scan seeds with the identity (0 for addition) and each output covers a strict prefix. Inclusive versus exclusive confusion shifts every scatter address by one.
- Segmented scan restarts at head flags. Decoupled look-back tracks three states per tile: X invalid, A aggregate ready, P prefix ready.

**Reproduce:** Hand-run Kogge-Stone exclusive scan on [4, 6, 7, 1, 2, 8, 5, 2] to get [0, 4, 10, 17, 18, 20, 28, 33], then implement block scan plus block-sums scan plus add-back for arbitrary lengths and match `torch.cumsum` on odd sizes.

**Traps**

- Reusing an inclusive scan where an exclusive one is needed shifts every scatter address by one, corrupting output without crashing.
- Testing only powers of two hides the block-sums tail. Test lengths $`2^k \pm 1`$, plus 1 and 0.
- Validating a float kernel against a double scan proves nothing about the kernel's rounding. Test the kernel's own dtype and operator.

**Practice**

- [MIT Lab 7 Part 1: associative scan](https://github.com/accelerated-computing-class/lab7) - Part 1 `launch_scan` in `scan.cu`: pass the `SumOp` and `DebugRangeConcatOp` tests without CUB, then benchmark at length $`2^{26}`$ against the retargeted bandwidth goal. Build with `nvcc -arch=sm_86` (or your GPU's architecture) and run locally; the course runner needs an MIT token. Recompute every SM count, clock and bandwidth the questions assume.
- [LeetGPU challenge 16: Prefix Sum](https://leetgpu.com/challenges/prefix-sum) - Challenge 16: `solve(input, output, N)` inclusive float scan at tolerance 0.01, with functional cases for a single element, an 8-element power of two and a 2025-element random input, and a performance case of $`N = 250000`$. Run it on LeetGPU or locally with the harness from the transpose unit.
- [LeetGPU challenge 70: Segmented Exclusive Prefix Sum](https://leetgpu.com/challenges/segmented-exclusive-prefix-sum) - Challenge 70: `solve(values, flags, output, N)` with `flags[0]` set and the first output of every segment 0.0, and a performance case of $`N = 50000000`$. Attempt only after the required challenges 3, 4, 5, 13 and 16 pass.

**Stop when:** Your scan matches `torch.cumsum` on adversarial sizes, you derive both work counts from scratch, and Lab 7 Part 1 meets the retargeted bandwidth.

<details>
<summary>Self-test</summary>

1. For length 2048, how many adds do Kogge-Stone and Brent-Kung take, against what sequential baseline?
   - 20481 and 4083 against a 2047-add sequential scan. Kogge-Stone is step-efficient, Brent-Kung is work-efficient.
2. When does Kogge-Stone win despite doing more work?
   - At small lengths where everything fits on chip and step count dominates. At large lengths DRAM passes dominate and work efficiency wins.
3. In decoupled look-back, what does a block do when the predecessor state is A versus P?
   - On A it adds the aggregate and keeps looking back; on P it adds the inclusive prefix and stops.
4. Segmented inclusive scan of [3, 1, 7, 0, 4, 1, 6, 3] with head flags [1, 0, 0, 1, 0, 0, 1, 0] gives what?
   - [3, 4, 11, 0, 4, 5, 6, 9]. Segments starting at positions 0, 3 and 6 restart from their own heads.

</details>

#### U6. Histograms, atomic contention and privatization

**About 4 h** · **Target:** Implement + Measure

Topics: Histogram atomics, contention and collision distributions; Privatization, aggregation and merge costs

Histograms are the first primitive where threads collide on the same addresses. Contention, not traffic, sets the ceiling, and privatization is the general escape.

**You can now**

- Predict atomic contention from the bin-count distribution before timing.
- Implement privatized histograms with a correct merge and overflow policy.
- Measure private versus global atomics across uniform and skewed inputs and explain the crossover.

**Study**

1. [Atomics and privatization](https://shop.elsevier.com/books/programming-massively-parallel-processors/hwu/978-0-323-91231-0) (Programming Massively Parallel Processors, 4th edition - Chapters 6 and 9 to 12) - Chapter 9, Sections 9.2 to 9.4 (printed pp. 194 to 202): the basic histogram kernel, atomic latency and throughput, and privatization into per-block copies.
2. [Coarsening, aggregation and exercises](https://shop.elsevier.com/books/programming-massively-parallel-processors/hwu/978-0-323-91231-0) (Programming Massively Parallel Processors, 4th edition - Chapters 6 and 9 to 12) - Sections 9.5 and 9.6 (coarsening and aggregation under heavy contention) with Exercises 1 to 6 (printed p. 209), especially Exercise 6 on 524288 elements over 128 bins with 1024 threads.
3. [Histogram pattern](https://accelerated-computing.academy/fall25/lectures) (MIT 6.S894 Accelerated Computing (Fall 2025) - Lectures 6, 7 and 9 and Lab 7) - Lecture 9, Pattern #6: Histogram (slides 29 to 42): partition-and-increment sketch with atomics, privatization, coarsening and aggregation.

**Focus**

- One global atomic per update serializes on hot bins. With uniform input over $`B`$ bins each bin takes about $`N/B`$ atomics; with skewed input one bin takes nearly N.
- Privatization replicates bins per block in shared memory, which is fast and block-scoped, then merges at a cost of blocks times bins adds. Coarsening into fewer blocks cuts the merge.
- Work PMPP Exercise 6 by hand before coding: it quantifies basic versus privatized versus coarsened update counts on the same input.

**Reproduce:** Implement global-atomic and privatized int32 histograms. On uniform 1M-element input over 256 bins and on input that falls entirely in one bin, both match `torch.bincount` and the privatized version is faster. On an RTX 3050 6 GB, 50M updates took 17.8 ms with global atomics over 256 uniform bins and 27.4 ms into one bin, against 1.3 ms privatized in both cases. State the int32 bin overflow limit (2147483647) and your merge policy above it.

**Traps**

- Merging privatized int32 bins into int32 global bins can overflow while per-block counts look fine. Accumulate the merge in 64-bit or document the length limit.
- Benchmarking only uniform input hides contention. One hot bin serializes global atomics on one address (27.4 against 17.8 ms for 50M updates in the run above), so always include a skewed case.
- Skipping `__syncthreads()` between zeroing, updating and merging races within the block, since later phases read data other threads wrote.

**Practice**

- [LeetGPU challenge 13: Histogramming](https://leetgpu.com/challenges/histogramming) - Challenge 13: `solve(input, histogram, N, num_bins)` over int32, with functional cases from $`N = 5`$ over 3 bins (expecting [2, 2, 1]) through 10000 over 128 bins, and a performance case of $`N = 50000000`$ with 256 bins. Run it on LeetGPU or locally with the harness from the transpose unit. Then add an ungraded skewed-input timing that compares global against privatized atomics.

**Stop when:** Both variants match `torch.bincount` on uniform and skewed inputs, and you predict the faster one from the bin distribution before timing.

<details>
<summary>Self-test</summary>

1. With 50M uniform values over 256 bins, how many atomics hit each bin?
   - About 195312 each. Every bin is equally hot, so global atomics still serialize in groups.
2. All 50M values fall in one bin with global atomics. What happens, and what fixes it?
   - Updates serialize fully on one address. Per-block private bins plus a merge remove the serialization at a merge cost of blocks times bins.
3. Why do the private copies live in shared memory?
   - Lower latency, contention scoped to the block, and no global traffic until the merge. Global privatization would keep the contention domain wide.
4. With 128 blocks and 1024 bins, what does the merge cost, and how does coarsening change it?
   - 131072 adds. Coarsening into fewer blocks cuts the merge proportionally, at the usual occupancy cost.

</details>

#### U7. Stream compaction from predicate, scan and scatter

**About 3 h** · **Target:** Implement

Topics: Predicate, scan and scatter for stream compaction

Compaction is the first complete irregular primitive: data-dependent output positions with no races and no oversized buffers.

**You can now**

- Build predicate, exclusive-scan and scatter stages into one compaction.
- Handle all-false, all-true and empty inputs with exact outputs.
- Explain why scan, not atomics, assigns the write positions.

**Study**

1. [Compaction from scan and scatter](https://accelerated-computing.academy/fall25/lectures) (MIT 6.S894 Accelerated Computing (Fall 2025) - Lectures 6, 7 and 9 and Lab 7) - Lecture 7, Pattern #4: Stream Compaction (slides 32 to 38): predicate array, exclusive scan as scatter addresses, and the return to compaction after the scan pattern.
2. [Split and load-balance search](https://accelerated-computing.academy/fall25/lectures) (MIT 6.S894 Accelerated Computing (Fall 2025) - Lectures 6, 7 and 9 and Lab 7) - Lecture 9, Pattern #4.5: Split (slides 5 to 8) for stable partitioning by scan, and Load-balance Search (slides 9 to 15) for count, scan and scatter expansion.
3. [Run-length compression](https://github.com/accelerated-computing-class/lab7) (MIT 6.S894 Accelerated Computing (Fall 2025) - Lectures 6, 7 and 9 and Lab 7) - Lab 7, Part 2 (`rle_compress.cu`, `launch_rle_compress`): run starts as an implicit predicate plus scan for positions over a 16-million-byte bitmap (`rle_raw.bmp`). Depth: Build for your own GPU with `nvcc -arch=sm_86` and retarget the 1.6 ms course goal to your hardware. Part 3 decompression is extra credit; skip it here.

**Focus**

- Compaction is three steps: predicate $`p_i`$ in 0/1, exclusive scan giving write address $`a_i`$ as the count of kept elements before $`i`$, then order-preserving scatter. The kept total is $`K`$.
- Positions come from the scan, so no two threads claim one slot and no atomic counter serializes. That is the whole point of the construction.
- LeetGPU 72 keeps rejected slots as 0.0 in a full-size output while RLE packs values plus lengths tightly. Both are correct compactions with different contracts, so read the expected layout first.

**Reproduce:** On [-1, 2, 0, 4] produce predicate [0, 1, 0, 1], exclusive scan [0, 0, 1, 1] and output [2, 4, 0, 0] under the Challenge 72 contract. Then implement scan-plus-scatter that matches it on all-positive, all-negative and length-255 non-power-of-two inputs.

**Traps**

- Using an inclusive scan for addresses shifts every write by one slot: slot 0 stays unwritten and the last kept element lands one past the kept total.
- Treating 0.0 as kept. The contract selects strictly positive inputs, so zeros stay out.
- Sizing the output to the kept count before computing it. Read back the total first, or overallocate to the input length and slice.

**Practice**

- [MIT Lab 7 Part 2: run-length compression](https://github.com/accelerated-computing-class/lab7) - Part 2 `launch_rle_compress` in `rle_compress.cu`: scan-built positions for run starts, reusing your Part 1 scan. Build with `nvcc -arch=sm_86` (or your GPU's architecture), run locally, and recompute the timing goal for your GPU; the course runner needs an MIT token.
- [LeetGPU challenge 72: Stream Compaction](https://leetgpu.com/challenges/stream-compaction) - Challenge 72: `solve(A, N, out)` keeping strictly positive values in order, with the rest of `out` left at 0.0, checked exactly, with functional cases for length 1 present and absent plus non-powers of two, and a performance case of $`N = 50000000`$. Attempt only after challenges 3, 4, 5, 13 and 16 pass. Run it on LeetGPU or locally with the harness from the transpose unit.

**Stop when:** Your compactor matches the Challenge 72 contract on edge sizes, and you derive every scatter address from the exclusive scan by hand on the 4-element example.

<details>
<summary>Self-test</summary>

1. Compact [-1, 2, 0, 4] under the Challenge 72 contract. What are the predicate, the exclusive scan, the output and K?
   - Predicate [0, 1, 0, 1], scan [0, 0, 1, 1], output [2, 4, 0, 0], $`K = 2`$. Zeros are rejected and survivors keep order.
2. What do an all-negative input and an empty input produce?
   - An all-zero output with $`K = 0`$, and an empty output with $`K = 0`$. The kernel must still launch and synchronize cleanly.
3. Why not assign positions with one atomic counter?
   - Every kept element would serialize on one address. The scan assigns all positions in parallel with no contention.
4. How do the Challenge 72 and RLE output layouts differ?
   - Challenge 72 pads rejected slots with 0.0 to the full input length; RLE packs kept values plus run lengths tightly. The checker decides which is correct.

</details>

#### U8. Online softmax and its extreme-value policy

**About 4 h** · **Target:** Derive + Implement

Topics: Numerically stable online normalizer and softmax; Extreme logits, all-masked rows and empty-row policy

Softmax is the numerical heart of attention. The online form removes a pass over the logits while staying exact, and its running statistics become tiled-attention state later.

**You can now**

- Derive the running-maximum and normalizer recurrence and its single-pass invariant.
- Implement naive, safe two-pass and online softmax and compare their per-element traffic.
- Define and test the extreme-value and all-masked-row policy.

**Study**

1. [Online normalizer recurrence](https://arxiv.org/abs/1805.02867v2) (Online Normalizer Calculation for Softmax) - Sections 2 and 3 with Algorithms 1 to 3 and Theorem 1 (arXiv:1805.02867v2): naive 3-access softmax, safe 4-access softmax, and the online recurrence with running maximum and rescaled normalizer. Depth: Work the induction behind Theorem 1 by hand. Save Section 4 (top-k fusion) for the attention track.
2. [Parallel form and benchmarks](https://arxiv.org/abs/1805.02867v2) (Online Normalizer Calculation for Softmax) - Section 3.1 (associative pair operator for parallel reduction) and Sections 5 to 6 (1.15x to 1.3x on a V100, fused top-k down to one access per element). Depth: Read the benchmark setup for method. Treat the V100 ratios as historical.

**Focus**

- Subtracting the maximum first is what makes softmax safe: exp of a nonpositive finite value cannot overflow, and the online form keeps that guarantee in one pass.
- The invariant is that the normalizer always matches the current running maximum, rescaled by exp of the old-minus-new maximum at each step. Theorem 1 proves it by induction.
- Traffic per element drops from 4 accesses (safe three-pass) to 3 (online). The win is memory, not FLOPs.
- Row [1, 2, 3, 1000] gives running maximum 1000 with normalizer 1.0 and output [0, 0, 0, 1] up to rounding, while naive exp(1000) overflows to inf.

**Reproduce:** Derive the recurrence from the safe form, hand-run it on [1, 2, 3, 1000], then implement all three versions so they agree within 1e-5 on 500000 uniform (-10, 10) logits, the Challenge 5 perf shape.

**Traps**

- Forgetting to rescale the normalizer when a new maximum arrives. The result looks plausible but is wrong; test with an increasing sequence where every element is a new maximum.
- Assuming the paper covers fully masked rows. It assumes valid rows, so an all-negative-infinity row gives 0/0 (NaN) unless you declare a policy, for example all zeros, and test it.
- Comparing against `torch.softmax` at 1e-7. Order and rounding differ across implementations, so use 1e-5 with the magnitude stated.

**Practice**

- [LeetGPU challenge 5: Softmax](https://leetgpu.com/challenges/softmax) - Challenge 5: `solve(input, output, N)` with max subtraction, with functional cases including the [1000, 1, 2, 3] overflow trap and a single element, and a performance case of $`N = 500000`$. Run it on LeetGPU or locally with the harness from the transpose unit. Pass the public tests, then add your own all-masked-row test with a documented policy. The public tests assume at least one finite logit.

**Stop when:** All three implementations agree within 1e-5 on the perf shape, your hand recurrence matches the code, and the all-masked policy is tested.

<details>
<summary>Self-test</summary>

1. Why does the safe softmax take 3 passes and 4 accesses per element?
   - One read for the maximum, one read for the normalizer, one read plus one write for the output. The online form merges the first two passes into one.
2. What does the rescaling factor do when a new maximum arrives?
   - Old partial sums were normalized by the old maximum, so multiplying by exp of old-minus-new maximum (at most 1) renormalizes them to the new maximum.
3. The paper bounds the running normalizer between which values?
   - Between 1 and the element count. The running maximum also stays within the input range, so neither can overflow.
4. What does an all-negative-infinity row produce without an explicit policy, and what fixes it?
   - Maximum negative infinity, normalizer 0 and 0/0, which is NaN. Declare the empty-row policy (for example a zero vector) and test that row directly.

</details>

#### U9. Pinned memory, streams, events and copy-compute overlap

**About 5 h** · **Target:** Implement + Measure

Topics: Pinned host memory and asynchronous transfers; Streams, events, dependency graphs and buffer lifetime; Copy and compute overlap with timeline proof

Copy-compute overlap is the cheapest speedup in GPU computing and the easiest to fake. Without pinned memory and explicit dependencies the timeline stays sequential.

**You can now**

- Set up pinned host buffers and asynchronous copies with correct stream arguments.
- Build a multi-stream copy and compute pipeline with event dependencies and prove overlap from a timeline.
- Diagnose serialized overlap from trace evidence: pageable memory, default-stream use or dependency errors.

**Study**

1. [Streams and copy-compute overlap](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 11 and 12) - Chapter 11, Overlapping Kernel Execution with CUDA Streams and Using Streams to Overlap Compute with Data Transfers (pinned memory, `cudaMallocHost`, `cudaMemcpyAsync`, two DMA engines), plus Stream-Ordered Memory Allocator.
2. [Default streams and event dependencies](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 11 and 12) - Chapter 11, Legacy Default Stream, Modern Per-Thread Default Stream, Fine-Grained Synchronization with Events and Callbacks, and Using CUDA Events for Cross-Stream Synchronization.
3. [Asynchronous execution reference](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/asynchronous-execution.html) (CUDA C++ Programming Guide (v13.4.2)) - Section 2.5: 2.5.2.3 (async copies need pinned host memory), 2.5.6 (blocking streams versus non-blocking streams and the legacy default stream), 2.5.7 (`cudaStreamWaitEvent`) and 2.5.8 (implicit synchronization).
4. [Streams intuition](https://accelerated-computing.academy/fall25/lectures) (MIT 6.S894 Accelerated Computing (Fall 2025) - Lectures 6, 7 and 9 and Lab 7) - Lecture 6, slides 1 to 9: dedicated DMA engines running parallel to kernels, the implicit barrier, command queues, and one buffer per stream.

**Focus**

- `cudaMemcpyAsync` on pageable host memory degrades to a synchronous staged copy, so overlap starts with `cudaMallocHost`.
- The legacy default stream synchronizes every blocking stream. Create non-blocking streams with `cudaStreamCreateWithFlags` and order cross-stream work with `cudaStreamWaitEvent`, not `cudaDeviceSynchronize`.
- Overlap needs comparable copy and compute phases on different engines. Two kernels that each fill the GPU barely overlap, while a chunked copy and compute pipeline shows in `nsys`.
- Every buffer must outlive its stream work. Free or reuse device and host buffers only after the consuming stream synchronizes.

**Reproduce:** Build a 4-chunk host-to-device plus kernel pipeline on separate streams with `cudaStreamWaitEvent` chaining. Capture with `nsys profile --trace=cuda,nvtx --sample=none --cpuctxsw=none` and show copy and compute overlapping in the timeline, with event math placing overlapped wall time below the sequential sum.

**Traps**

- Timing around launches with a host timer measures launch submission, not work. Bracket with events or synchronize the stream first.
- Reusing a host buffer right after enqueueing its copy corrupts the transfer, because the copy is asynchronous.
- One synchronous `cudaMemcpy` or default-stream kernel inside the pipeline reimposes global ordering and silently deletes the overlap.

**Practice**

- [AI Systems companion code: Chapter 11 stream overlap demos](https://github.com/cfregly/ai-performance-engineering/tree/main/code/ch11) - `streams_overlap_demo.cu`, `event_timing_demo.py` and `stream_overlap_demo.py`: build and run the overlap demo, reproduce one overlap timeline with event timing, and compare the event timing variants. From the `code` directory, `nvcc -O3 -arch=sm_86 ch11/streams_overlap_demo.cu -o streams_overlap_demo` builds the CUDA demo, which reports its sequential and overlapped times; `event_timing_demo.py` runs with PyTorch alone; `stream_overlap_demo.py` imports the shared harness and needs the repository's `requirements.txt`. Ignore the B200 expectation files.

**Stop when:** Your pipeline timeline shows copy and compute overlapping, event math confirms it, and switching back to pageable memory visibly collapses the overlap.

<details>
<summary>Self-test</summary>

1. Why does overlap require pinned host memory?
   - The DMA engine cannot read pageable memory directly, so the driver inserts a synchronous staged copy through a pinned buffer and the transfer no longer overlaps.
2. A default-stream kernel launches between two blocking-stream kernels. What runs concurrently?
   - Nothing. The legacy default stream synchronizes all blocking streams, so all three serialize.
3. What does `cudaStreamWaitEvent` order, exactly?
   - Work enqueued into the waiting stream after the call waits for the event. Work already enqueued in that stream is unaffected.
4. Two 5 ms kernels that each fill the GPU run in different streams. How much overlap, and why?
   - Almost none. Each kernel already occupies every SM, so the second waits for free resources; overlap needs independent engines, such as a copy engine beside the SMs.

</details>

#### U10. CUDA graphs and validated dispatch with fallback

**About 4 h** · **Target:** Implement

Topics: CUDA graph capture, replay, update and eager fallback; Shape, dtype, layout and device dispatch with validated fallback

Graphs remove per-launch CPU overhead for repeated work, but a graph bakes in addresses and shapes. The validation and fallback around it is the actual engineering.

**You can now**

- Capture a stable kernel sequence into a graph and replay it with identical results.
- Update an instantiated graph in place when only parameters change, and re-instantiate when the topology changes or the update is refused.
- Gate dispatch on shape, dtype and device validation with a correct eager fallback.

**Study**

1. [CUDA graphs chapter](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 11 and 12) - Chapter 12, CUDA Graphs (memory pools and pointer stability), Capturing a CUDA Graph with a CUDA Stream (`cudaStreamBeginCapture` to `cudaStreamEndCapture`) and Dynamic Graph Update (parameter changes without recapture). Depth: Skip device-initiated launch beyond the vocabulary; this section launches graphs from the host.
2. [Graphs reference](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/cuda-graphs.html) (CUDA C++ Programming Guide (v13.4.2)) - Sections 4.2.2 (stream capture with cross-stream rules, prohibited operations, instantiation and execution) and 4.2.3 (whole-graph update, per-node update with `cudaGraphExecKernelNodeSetParams`, and the update limitations); Section 2.5.9.2 on the asynchronous execution page is the short introduction. Depth: Read the capture constraints and update rules. Skim conditional nodes; they are not used in this section.
3. [Dispatch and fallback contract](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/gpu-microbenchmark-kernel-suite.md) (GPU Microbenchmark and Kernel Suite - CUDA Core) - Architecture constraints (dispatch never selects an unvalidated path; every custom path has a correct fallback) and Milestone C (correctness-gated dispatch with unseen-shape fallback).

**Focus**

- Capture, instantiate and launch happen once, once and many times. Replay removes most per-launch CPU cost: on an RTX 3050 6 GB with CUDA 13.4, tiny kernels took 0.79 us each inside a graph against 2.67 us launched one by one, so graphs pay when launch overhead is a large share of step time.
- Capture forbids allocation, synchronization, legacy-stream work and shape changes. Preallocate maximum shapes and validate before capturing.
- `cudaGraphExecUpdate` updates an instantiated graph in place when the new capture has the same topology: kernel arguments, pointers and grid sizes may change. A different sequence of nodes fails the update; check the result and the reported node, then destroy and re-instantiate.
- The first launch after instantiation also uploads the graph (`cudaGraphUpload` can do it ahead of time), so warm up before timing: the first replay of an 8-kernel chain took 34 us on the RTX 3050 above, against about 6 us warm.

**Reproduce:** Capture an 8-kernel saxpy chain, replay it 100 times with outputs identical to eager, update a pointer and a length in place with `cudaGraphExecUpdate`, then change the number of kernels so the update fails and you re-instantiate. Report per-kernel launch time eager and in the graph, after warmup.

**Traps**

- Capturing on the legacy default stream is invalid. Use an explicit stream, preferably non-blocking.
- Replaying after freeing and reallocating buffers reads stale addresses. Graphs bake in pointers, so tie buffer lifetime to the executable graph.
- Ignoring the `cudaGraphExecUpdate` return code and launching the stale instance after an incompatible change.

**Practice**

- [AI Systems companion code: Chapter 12 graph demos](https://github.com/cfregly/ai-performance-engineering/tree/main/code/ch12) - `graph_capture_demo.py`, `graph_replay_benchmark.py` and `baseline_cuda_graphs.py`: capture and replay on your GPU with a state-reset test. `graph_capture_demo.py` and `graph_replay_benchmark.py` run with PyTorch alone; `baseline_cuda_graphs.py` imports the shared harness and needs the repository's `requirements.txt`. Add a parameter-update test and a forced re-instantiation fallback test of your own.

**Stop when:** Your graph replays bit-identical results, an in-place update handles parameter changes, and a topology change falls back to re-instantiation correctly.

<details>
<summary>Self-test</summary>

1. When do CUDA graphs help, in one measured rule?
   - When per-launch CPU overhead is a large fraction of kernel time. Tiny kernels took 2.67 us each launched eagerly against 0.79 us inside a graph on an RTX 3050 6 GB; long kernels show no gain.
2. What does an executable graph bake in, and which changes can it take in place?
   - The nodes, their dependencies and every parameter: kernel arguments, pointers and launch dimensions. Parameters, grid sizes included, can be updated in place while the topology is unchanged; a different sequence of nodes needs a new instantiation.
3. Whole-graph update fails on a new input. What is the correct recovery?
   - Destroy the executable graph and recapture plus re-instantiate from the new sequence. The update API names the failing node for the log.
4. Why can random-number generation inside a capture repeat the same values on every replay?
   - A replay reuses the captured arguments, so a generator whose seed or offset is a kernel argument produces the same numbers each time. PyTorch registers its generator with the graph and advances the offset per replay; otherwise generate outside the capture or read the offset from device memory.

</details>

#### U11. Seeded defects: races, divergent barriers, partial warps, stale buffers and masks

**About 3 h** · **Target:** Measure

Topics: Race, divergent barrier, partial warp, stale buffer and mask defects

Primitives fail in ways that look like performance problems. This unit turns the section's bugs into a diagnostic checklist before the mini-project.

**You can now**

- Inject race, divergent-barrier, partial-warp, stale-buffer and mask defects and describe each signature.
- Attribute asynchronous errors with sanitizer, event and timeline evidence instead of blanket synchronization.
- Write regression tests that fail on each defect and pass on the fix.

**Study**

1. [Failure-injection requirements](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/gpu-microbenchmark-kernel-suite.md) (GPU Microbenchmark and Kernel Suite - CUDA Core) - Milestone D and the failure-injection requirements: out-of-bounds, partial-warp, missing synchronization, bank conflict, uncoalesced stride, divergent barrier, stale stream buffer, wrong mask, overflow and tile-edge defects with tooling diagnosis and regressions.
2. [Divergence, completion and single-pass hazards](https://shop.elsevier.com/books/programming-massively-parallel-processors/hwu/978-0-323-91231-0) (Programming Massively Parallel Processors, 4th edition - Chapters 6 and 9 to 12) - Chapter 10, Sections 10.4 (control-divergence hazards) and 10.7 (hierarchical completion); Chapter 11, Section 11.7 (printed p. 256): single-pass atomic, fence and barrier deadlock risk.
3. [Asynchronous error attribution](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/asynchronous-execution.html) (CUDA C++ Programming Guide (v13.4.2)) - Section 2.5.4.2: `cudaGetLastError` versus `cudaPeekAtLastError`, printable error names, and the `CUDA_LAUNCH_BLOCKING=1` trick to serialize launches while debugging.

**Focus**

- Each defect has a signature. Races vary run to run, divergent barriers hang or race silently, partial warps corrupt tails only, stale buffers corrupt after reuse, and wrong masks corrupt masked rows only.
- Attribute first: serialize with `CUDA_LAUNCH_BLOCKING=1` to find the owning kernel, confirm with sanitizer evidence, and never ship a global synchronization as the fix.
- A defect that never fires in tests still ships. Write the adversarial size, skew, reuse and mask cases from the project list as regression tests.

**Reproduce:** Seed all five defects (race, divergent barrier, partial warp, stale buffer, wrong mask) in your section kernels, diagnose each with cited tool evidence, fix each without a global synchronization, and keep the regression tests green.

**Traps**

- Declaring victory after 100 clean trials. A race needs size, block-count and stream-interleaving variation before the claim means anything.
- Sprinkling `cudaDeviceSynchronize` after every call. It hides lifetime bugs and deletes the overlap built in the streams unit, so scope every fix to the owning stream or event.
- Testing only friendly values. Pair each defect test with an adversarial-value twin, since order and mask bugs hide at friendly magnitudes.

**Practice**

- [GPU Microbenchmark and Kernel Suite, Milestone D failure handling](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/gpu-microbenchmark-kernel-suite.md) - Milestone D: inject the access, synchronization, mask, stream and numerical defects; diagnose each with tooling; add regressions; surface asynchronous errors at the owning API boundary

**Stop when:** All five seeded defects are diagnosed with cited tool evidence, fixed without global synchronization, and covered by regression tests.

<details>
<summary>Self-test</summary>

1. A scan hangs only at large lengths. What are the first suspects?
   - A divergent barrier or a global-sync-across-blocks assumption that deadlocks past one wave. Check barrier uniformity and any assumed block execution order.
2. Results are correct on powers of two but wrong at length 1000. What are the suspects?
   - Tail guards in loads, shuffle masks over partial warps, the block-sums tail, or the scan fix-up range. All share the shape of untested remainders.
3. Corruption appears only when two streams run together. What are the suspects?
   - A missing event dependency, buffer reuse before the consumer finishes, or accidental default-stream ordering. All are lifetime and ordering bugs, not kernel bugs.
4. How do you attribute an asynchronous error to its kernel?
   - Synchronize per stream and read the last-error APIs at each boundary, then set `CUDA_LAUNCH_BLOCKING=1` to serialize launches. Fix at the owning boundary.

</details>

### Mini-project: CUDA maps, reductions, transpose and overlap with async proof

**About 12 to 16 hours.** Fill kernellab with the CUDA core: vectorized and coarsened maps, shuffle and two-pass reductions, tiled transpose, scans, privatized histograms, stable softmax, overlapped copies and captured graphs, each checked against an independent reference and timed with events. Keep the local LeetGPU harness and five seeded async defects with tool evidence.

1. Build the local LeetGPU harness in `tests/leetgpu/`: compile each `solve` with `nvcc -shared -Xcompiler -fPIC`, load it with `ctypes`, and check it against `reference_impl` plus the generators from the public `challenge.py` files, with a two-line `core/challenge_base.py` stub setting `device = \"cuda\"` where the helper is needed. Verify the path on challenge 4 before timing anything.
2. Write scalar, `float4` vectorized and 4-way coarsened saxpy kernels with grid-stride loops in `kernels/cuda/map.cu`. Predict per-warp transaction counts first, then check all three on 1000003 random floats bit-exactly against a CPU reference computed with `fmaf`: `nvcc` contracts the multiply-add to one fused operation by default, so a multiply-then-add reference differs in the last bit at 282894 of the 1000003 elements on the reference card. Cover lengths 0 and 1000003 plus odd sizes, with the empty path avoiding an invalid launch.
3. Write a shuffle warp reduction plus a two-pass grid reduction with 4-way coarsening and grid-stride loads. Cover lengths 0, 1, 31, 32, 33, 1023, 1000003 and one large size, pad tail lanes with the identity, return 0 for length 0 and the single value for length 1, and match a float64 reference within relative error 1e-6 on 1000003 values. Sweep the coarsening factor with interleaved event trials and retain one losing factor: with 256 threads the grid needs 977 blocks at factor 4 against 62 at factor 64, while `sm_86` holds 6 such blocks per SM for 108 resident on 18 SMs. Show the hand tree on `[6, 2, 7, 4, 5, 8, 3, 1]` giving 36 in 7 adds and 3 steps, and the float32 order case with `1e8` cancelling to 1 or 0 by grouping.
4. Rebuild copy, naive and padded shared-memory tiled transpose for 4096 by 4096 fp32 random data and time each with events as median of 11 trials counting one read and one write per element. On the reference RTX 3050 the copy reached 152 GB/s, naive 48 GB/s and tiled 151 GB/s with exact match including a 1000 by 1000 edge-guard check; expect the same ranking with tiled near copy on your card. Pass LeetGPU challenge 3 locally across 1 by 1 through 8192 by 8192 cases. Diagnose bank behavior with the enumerator from the previous section and keep the padding fix.
5. Implement block scan plus block-sums scan plus add-back for arbitrary lengths: hand-run Kogge-Stone exclusive scan on `[4, 6, 7, 1, 2, 8, 5, 2]` to `[0, 4, 10, 17, 18, 20, 28, 33]`, match `torch.cumsum` on odd sizes, and build scan-plus-scatter for stream compaction that maps `[-1, 2, 0, 4]` through predicate `[0, 1, 0, 1]` and scan `[0, 0, 1, 1]` to `[2, 4, 0, 0]`. Implement global-atomic and privatized int32 histograms matching `torch.bincount`: on the reference card 50M updates over 256 bins took 17.8 ms global uniform and 27.4 ms into one bin against 1.3 ms privatized in both cases. State the int32 overflow limit 2147483647 with a merge policy, and pass LeetGPU challenges 13, 16 and 72 locally.
6. Derive the online normalizer recurrence from the safe form, hand-run it on `[1, 2, 3, 1000]`, then implement materialized, two-pass and online softmax that agree within 1e-5 on 500000 uniform (-10, 10) logits including the challenge 5 `[1000, 1, 2, 3]` overflow case. Pass LeetGPU challenge 5 locally, then add an all-masked-row test with a documented policy stating the output for empty rows.
7. Build a 4-chunk host-to-device plus kernel pipeline on separate streams with `cudaStreamWaitEvent` chaining, capture with `nsys profile --trace=cuda,nvtx --sample=none --cpuctxsw=none`, and show copy and compute overlapping with event math placing overlapped wall time below the sequential sum. Capture an 8-kernel saxpy chain with CUDA graphs, replay 100 times with outputs identical to eager, update a pointer and a length in place with `cudaGraphExecUpdate`, then change the kernel count so the update fails and re-instantiation is required. Report per-kernel launch time eager and in-graph after warmup: on the reference card tiny kernels took 2.67 us eager against 0.79 us replay with first replay near 34 us. Your medians will differ; replay must not exceed eager on this shape.
8. Seed all five defects in section kernels (race, divergent barrier, partial warp, stale buffer, wrong mask), diagnose each with cited tool evidence without a global synchronization repair, and keep the regression tests green. This is the Milestone D failure handling for the CUDA core.

**Deliverables**

- The local LeetGPU harness with `reference_impl` checks for challenges 3, 4, 5, 13, 16 and 72.
- `kernels/cuda/` maps, reductions, transpose, scans, histograms, compaction and softmax with independent references, odd-size and mask tests and the coarsening sweep with a retained loser.
- The 4-chunk overlap timeline with event math, the 8-kernel graph capture with update and re-instantiation evidence, and five seeded-defect regressions with tool logs.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [LeetGPU primitive challenges run locally against the reference implementation](https://leetgpu.com/challenges/). Run challenges 3, 4, 5, 13, 16 and 72 locally with `nvcc -shared -Xcompiler -fPIC` and `ctypes`; keep raw timings outside the leaderboard.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Oracle agreement | Each kernel matches its independent reference (fmaf CPU map, float64 reduction, CPU transpose, `torch.cumsum`, `torch.bincount`, max-trick softmax) on random and adversarial inputs including 0 and 1000003, and seeded omissions fail. | The map keeps the multiply-then-add variant as a comparison showing the 282894-element last-bit gap. |
| Performance with a loser | Transpose, histogram and coarsening comparisons use interleaved event trials with raw samples, and one losing factor or shape is retained with an explanation. | Block counts and residency (977 against 62, 108 resident) are derived before the sweep. |
| Async proof | The `nsys` timeline shows overlap with event math below the sequential sum, graphs replay identically with update and re-instantiation both demonstrated, and each defect names the tool line that locates it. | Buffer lifetimes are drawn with stream dependencies, and no repair hides behind a global barrier. |

Feeds into: Capstone kernel suite: maps, reductions, transpose, scans, histograms, softmax and the overlap and graph evidence. GEMM, attention and Triton sections reuse the harness and the defect method.

### Resource route

- **Primary - Book:** [Programming Massively Parallel Processors, 4th edition - Chapters 6 and 9 to 12](https://shop.elsevier.com/books/programming-massively-parallel-processors/hwu/978-0-323-91231-0) - Read thread coarsening in Chapter 6, then Chapters 9 (histogram), 10 (reduction), 11 (prefix sum) and 12 (merge, optional). Work the exercises that test work, depth, contention and boundary handling.
- **Required - Book:** [AI Systems Performance Engineering - Chapters 11 and 12](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) - Read Chapter 11 on streams, events, inter-kernel pipelining and stream-ordered allocation, and Chapter 12 on CUDA graphs and dynamic scheduling. Skip device-initiated launch beyond the vocabulary.
- **Required - Lab:** [Efficient Matrix Transpose in CUDA C/C++](https://developer.nvidia.com/blog/efficient-matrix-transpose-cuda-cc/) - Rebuild copy, naive transpose, coalesced transpose and padded shared-memory variants. Update deprecated details for the installed toolkit and compare requested transactions, bank behavior and achieved bandwidth on odd as well as friendly shapes.
- **Required - Lab:** [Optimizing Parallel Reduction in CUDA](https://developer.download.nvidia.com/assets/cuda/files/reduction.pdf) - Implement the optimization sequence from interleaved addressing through sequential addressing, first-add-during-load, unrolling and warp-level completion. Correct outdated assumptions and retain the stage where each optimization stops helping.
- **Depth - Paper:** [Single-pass Parallel Prefix Scan with Decoupled Look-back](https://research.nvidia.com/sites/default/files/pubs/2016-03_Single-pass-Parallel-Prefix/nvr-2016-002.pdf) - Read after two-pass scans pass. Derive the state and progress argument, then implement or inspect a bounded version only if the available hardware and time support meaningful comparison.
- **Required - Paper:** [Online Normalizer Calculation for Softmax](https://arxiv.org/abs/1805.02867v2) - Derive the running maximum and normalizer recurrence, test extreme and all-masked rows, and compare materialized, two-pass and online implementations before using the recurrence inside attention.
- **Required - Practice:** [LeetGPU - CUDA Primitive Challenges](https://leetgpu.com/challenges/) - Solve challenge 3 Matrix Transpose, 4 Reduction, 5 Softmax, 13 Histogramming and 16 Prefix Sum in CUDA. Add 70 Segmented Prefix Sum or 72 Stream Compaction only after the required set. Keep local source, hidden-shape assumptions, hardware, raw timings and correctness evidence outside the leaderboard.
- **Support - Lectures:** [GPU MODE - Reductions and Scans](https://github.com/gpu-mode/lectures) - Use Lectures 9, 20, 21 and 24 after the PMPP implementations. Reproduce one faster scan or reduction idea and show the exact shape and device regime where it changes the bottleneck.
- **Support - Course:** [MIT 6.S894 Accelerated Computing (Fall 2025) - Lectures 6, 7 and 9 and Lab 7](https://accelerated-computing.academy/fall25/lectures) - Use Lecture 6 for host-device copies and streams, and Lectures 7 and 9 for map, stencil, reduce, compaction, scan, segmented scan, histogram and merge. Do Lab 7 (Run-Length Compression, with its scan and shuffle warm-ups) built for your own GPU.
- **Support - Project:** [GPU Microbenchmark and Kernel Suite - CUDA Core](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/gpu-microbenchmark-kernel-suite.md) - Complete the CUDA vector map, reduction, transpose and stable softmax requirements plus seeded access, synchronization, mask, stream and numerical failures. Preserve library and framework baselines.
- **Reference - Reference:** [CUDA C++ Programming Guide (v13.4.2)](https://docs.nvidia.com/cuda/cuda-programming-guide/) - Use Section 2.3.4 for coalesced access, the transpose example and bank-conflict padding; Section 2.5 for streams, events, synchronization and the stream-capture intro; and Section 4.2 for graph creation, update and capture constraints. This is the API reference beside the book chapters.

### Exit checkpoint

Implement and diagnose CUDA transpose, reduction, scan or histogram, and online softmax across adversarial tails and values, then prove a measured data-movement or synchronization improvement with profiler evidence and a retained losing regime.

<details>
<summary>Deliberately left for later</summary>

- A universal primitives library or fastest-on-one-shape leaderboard chase
- Sorting, graph analytics and domain-specific stencil libraries beyond one transfer exercise
- Using global synchronization or relaxed tolerances to hide an incorrect primitive

</details>

## GPU-5. GEMM, Tensor Cores and Low Precision

**Why:** Matrix multiplication is the central case study in co-designing data layout, reuse, instruction choice and asynchronous pipelines. Low precision adds scaling and numerical contracts that must remain visible behind impressive throughput numbers.

### Learn this much

- [ ] M, N, K, batch shapes and useful GEMM operations _(Required)_
- [ ] Naive thread-per-output GEMM and its traffic _(Required)_
- [ ] Shared-memory tiles and global-memory reuse _(Required)_
- [ ] Register tiles, thread coarsening and accumulator ownership _(Required)_
- [ ] CTA, warp and instruction-level hierarchical tiling _(Required)_
- [ ] Coalesced and vectorized matrix tile copies _(Required)_
- [ ] Shared-memory layouts, swizzles and bank conflicts _(Required)_
- [ ] Predication and boundary handling for arbitrary dimensions _(Required)_
- [ ] Registers, shared memory, occupancy and tile-size constraints _(Required)_
- [ ] cuBLAS or framework library baselines and dispatch context _(Required)_
- [ ] Tensor-core matrix multiply-accumulate model _(Required)_
- [ ] WMMA, MMA atoms and CuTe-level abstraction boundaries _(Required)_
- [ ] Operand fragments, layout ownership and accumulator layout _(Required)_
- [ ] Input, product, accumulation and output precision _(Required)_
- [ ] FP16, BF16 and TF32 range, precision and execution _(Required)_
- [ ] E4M3 and E5M2 encoding, range and exceptional values _(Required)_
- [ ] FP4 and microscaling formats with shared scale metadata _(Depth)_
- [ ] Tensor, channel, block and dynamic scale selection _(Required)_
- [ ] Quantization and accumulation error against task tolerances _(Required)_
- [ ] Asynchronous copy, multistage producer-consumer pipeline and barriers _(Required)_
- [ ] Tensor Memory Accelerator descriptors and data movement _(Depth)_
- [ ] Producer and consumer warp specialization _(Required)_
- [ ] Thread-block clusters and distributed shared memory _(Depth)_
- [ ] Persistent, grouped and mixture-of-experts GEMM _(Optional)_
- [ ] Bias, activation, scale and dequantization epilogue fusion _(Required)_
- [ ] Shape-aware tuning, dispatch and unseen-shape fallback _(Required)_
- [ ] Roofline, instruction, resource and end-to-end residual analysis _(Required)_

### Study units

#### U1. GEMM operation counts and the naive kernel's traffic

**About 3 h** · **Target:** Derive

Topics: M, N, K, batch shapes and useful GEMM operations; Naive thread-per-output GEMM and its traffic

A GEMM speed claim needs an operation count and a traffic model before it needs a timer. The naive kernel makes the cost of missing reuse visible.

**You can now**

- Derive useful GEMM operations and compulsory bytes for rectangular and batched shapes.
- Trace a thread-per-output kernel and distinguish requested loads from DRAM traffic.
- Predict how row-major thread mapping changes coalescing without changing the result.

**Study**

1. [Arithmetic intensity before tiling](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 9 and 10) - Chapter 9, opening discussion of arithmetic intensity and Figure 9-1. Depth: Stop before Multilevel Microtiling and Software Prefetching. Treat the roofline as a ceiling, not proof that a kernel reaches either roof.
2. [Naive mapping and coalescing](https://siboehm.com/articles/22/CUDA-MMM#kernel-1-naive-implementation) (How to Optimize a CUDA Matmul Kernel for cuBLAS-like Performance: a Worklog) - Kernel 1: Naive Implementation, including Lower Bounding the Fastest Possible Runtime; Kernel 2: Global Memory Coalescing. Depth: Recalculate for your shape. The article's GEMM epilogue and RTX A6000 numbers are not the contract or measured speed of your kernel.
3. [A concrete naive CUDA kernel](https://github.com/cfregly/ai-performance-engineering/blob/b57e4c6a9e261c09ac09208705d040c81b03d35e/code/ch09/baseline_micro_tiling_matmul.cu) (AI Systems Performance Engineering companion code - Chapters 9 and 10) - `matmul_naive` and `main`, at commit `b57e4c6`. Depth: Read the square-only kernel and event interval. A checksum is not an independent elementwise correctness test.

**Focus**

- Use conventional shapes $`A\in\mathbb{R}^{M\times K}`$, $`B\in\mathbb{R}^{K\times N}`$. Report $`2M N K`$ useful FLOPs for the multiply using the two-FLOP-per-FMA convention; count epilogue work separately.
- For an overwrite-only product with element size $`s`$, compulsory bytes are $`Q_{\min}=s(MK+KN+MN)`$. A nonzero $`\beta`$ in $`C\leftarrow\alpha AB+\beta C`$ adds an old-output read.
- The naive overwrite kernel requests $`2M N K`$ scalar input loads and $`MN`$ stores. Broadcasts, caches and transaction overfetch make that different from measured DRAM bytes.

**Reproduce:** Closed-book, derive the counts for an overwrite-only FP32 product with $`M=64`$, $`N=96`$, $`K=32`$. Get 393216 useful FLOPs, 45056 compulsory bytes, and 1597440 requested bytes for the uncached scalar-load model. For independent batches with no shared operands, multiply each count by the batch count.

**Traps**

- Reporting FLOPs as FLOP/s, or requested bytes as measured bandwidth traffic.
- Assuming a low arithmetic intensity proves a bandwidth bottleneck. Launch overhead, uncoalesced accesses and dependency chains can prevent reaching the bandwidth roof.
- Confusing dimension names across interfaces. LeetGPU Challenge 2 calls the reduction dimension `N`, unlike conventional GEMM notation.

**Practice**

- The section mini-project covers this: the naive `kernellab` GEMM, its shape-to-FLOP calculator, and separate compulsory-byte and requested-load models.

**Stop when:** You derive the rectangular counts without notes and explain one warp's input and output addresses without calling requested bytes DRAM traffic.

<details>
<summary>Self-test</summary>

1. Does an FMA count as one or two FLOPs?
   - Two in the usual GEMM throughput convention: a multiply and an add, despite being one instruction.
2. Why can the naive kernel read much less DRAM than its scalar-load count predicts?
   - Several threads request the same values, and caches or warp broadcasts can service those requests without separate DRAM reads.
3. For an overwrite-only square FP32 product with side $`n`$, what is the compulsory-byte intensity?
   - $`I_{\min}=2n^3/(12n^2)=n/6`$ FLOPs/byte. This assumes each input is read once and the output written once, not that a real kernel achieves it.

</details>

#### U2. Shared-memory tiling and boundary predication

**About 4 h** · **Target:** Implement

Topics: Shared-memory tiles and global-memory reuse; Predication and boundary handling for arbitrary dimensions

Shared memory turns repeated global loads into block-local reuse. Boundary handling is part of the algorithm, not a cleanup after tuning.

**You can now**

- Implement a shared-memory GEMM with arbitrary rectangular dimensions and zero-filled reduction tails.
- Prove tile ownership and the barriers needed before consumption and before overwrite.
- Derive per-tile input reuse and distinguish useful work from padded work.

**Study**

1. [Shared-memory cache blocking](https://siboehm.com/articles/22/CUDA-MMM#kernel-3-shared-memory-cache-blocking) (How to Optimize a CUDA Matmul Kernel for cuBLAS-like Performance: a Worklog) - Kernel 3: Shared Memory Cache-Blocking, through its two-barrier tile loop. Depth: Stop before Occupancy Calculation for Kernel 3. The example omits arbitrary-size checks; add masks rather than copying that restriction into your kernel.
2. [Predicated tile loads](https://github.com/cfregly/ai-performance-engineering/blob/b57e4c6a9e261c09ac09208705d040c81b03d35e/code/ch09/optimized_micro_tiling_matmul.cu) (AI Systems Performance Engineering companion code - Chapters 9 and 10) - `matmul_tiled`, at commit `b57e4c6`. Depth: This is a shared-memory tiled kernel with one output per thread, despite the file's register-tiled description. Extend its square-only interface to rectangular shapes.
3. [Coordinates for edge predicates](https://docs.nvidia.com/cutlass/latest/media/docs/cpp/cute/0y_predication.html) (CuTe GEMM Tutorial) - Predication: What to do when tiling isn't perfect; identity-tensor procedure, GEMM epilogue example and input-load predicates, documentation dated September 21, 2026. Depth: The final input-copy example handles the output dimensions only. Add reduction-tail handling and initialize masked shared-memory slots before using this pattern for arbitrary GEMM.

**Focus**

- For an interior output tile $`B_M\times B_N`$ and reduction tile $`B_K`$, load $`B_K(B_M+B_N)`$ input elements for $`2B_MB_NB_K`$ useful FLOPs. Output traffic is separate.
- Every participating thread reaches `__syncthreads()`, even if its output lies outside the matrix. Predicate loads and stores, not the block's synchronization.
- A masked load must write zero into its shared-memory slot. Leaving a previous tile's value there adds a stale contribution to the reduction.

**Reproduce:** Without copying the source, write a 16 by 16 shared-memory overwrite GEMM. Compare finite integer-valued FP32 inputs against a CPU double-precision product for shapes $`(M,N,K)=(1,1,1),(17,19,23),(32,16,17)`$, using values cycling through -2 to 2. These small integer products are exactly representable. Check every output and run Compute Sanitizer memory, race and synchronization checks.

**Traps**

- Returning an edge thread before a block barrier. It may still own an input needed by an interior output.
- Using just an output mask. Input loads need separate bounds on their row, column and reduction coordinates.
- Removing the second barrier because the output accumulator is private. The shared input buffers are not private.

**Practice**

- The section mini-project covers this: the `kernellab` shared-memory GEMM, independent edge and empty-dimension tests, and sanitizer regressions for tile races.

**Stop when:** Your rectangular kernel passes interior, reduction-tail and output-tail tests, and you can explain both barriers from buffer ownership.

<details>
<summary>Self-test</summary>

1. How often is one interior tile element of $`A`$ reused?
   - Across $`B_N`$ output columns in that block. One tile element of $`B`$ is reused across $`B_M`$ output rows.
2. Why is a barrier needed after computation as well as after loading?
   - It prevents fast threads from overwriting shared inputs for the next tile while slower threads still consume the current tile.
3. What should an overwrite-only product do when the reduction dimension is zero?
   - Write zero to every valid output. Empty output dimensions require no launch. General GEMM must instead honor its epilogue contract.

</details>

#### U3. Register tiles, vectorized tile copies and resource limits

**About 5 h** · **Target:** Implement + Measure

Topics: Register tiles, thread coarsening and accumulator ownership; Coalesced and vectorized matrix tile copies; Registers, shared memory, occupancy and tile-size constraints

Shared-memory tiling still issues many shared loads. Register tiles reuse those operands, but the extra live state can reduce residency or spill.

**You can now**

- Implement per-thread accumulator tiles and coalesced vectorized input copies with a scalar tail path.
- Derive accumulator and shared-memory storage for a proposed tile hierarchy.
- Compare tile choices using event timing, compiler resource reports and generated instructions.

**Study**

1. [Microtiles and resource tradeoffs](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 9 and 10) - Chapter 9, Multilevel Microtiling and Software Prefetching, including Figure 9-2. Depth: Read the global, shared and register hierarchy. Skip unified-memory prefetching and Blackwell TMEM claims for this implementation. In a 32 by 32 product tile, each input element participates in 32 multiplies, not the section's stated 1024.
2. [Register blocking and wide copies](https://siboehm.com/articles/22/CUDA-MMM#kernel-4-1d-blocktiling-for-calculating-multiple-results-per-thread) (How to Optimize a CUDA Matmul Kernel for cuBLAS-like Performance: a Worklog) - Kernels 4, 5 and 6: 1D Blocktiling, 2D Blocktiling and Vectorizing SMEM and GMEM Accesses. Depth: Keep your own edge predicates. Read the SASS examples as evidence for that build, not guarantees about your compiler.
3. [Registers, vectorization and occupancy](https://accelerated-computing.academy/fall25/labs/lab5) (MIT 6.S894 Accelerated Computing (Fall 2025) - Lectures 6 and 8 and Labs 4 to 6) - Lab 5 Part 0: Understanding Occupancy; Part 1 suggestions Hiding Memory Access Latency and Vectorized Loads. Depth: Recompute occupancy from your GPU and compiled kernel. Do not carry over the RTX 4000 Ada clock, bandwidth or timing targets.

**Focus**

- A per-thread $`T_M\times T_N`$ outer-product update loads $`T_M+T_N`$ shared operands per reduction step for $`T_MT_N`$ multiplies. Accumulator storage alone is $`T_MT_N`$ values.
- One shared stage uses $`sB_K(B_M+B_N)`$ bytes before padding. Registers also hold addresses, operands and temporaries; source-level accumulator counts are only a lower bound.
- A `float4` copy needs a 16-byte-aligned address and four valid elements. Row strides and subview offsets can break alignment even when the allocation base is aligned.
- Inspect `ptxas -v` and SASS for registers, spills and wide loads. Query active blocks for the actual launch; lower occupancy can coexist with faster register reuse.

**Reproduce:** Derive a 64 by 64 output tile with reduction width 8 and a 4 by 4 per-thread accumulator tile. It uses 256 threads, 16 accumulator values per thread and 4096 shared-memory bytes for one FP32 stage, excluding padding. Implement that mapping in `kernellab`; check odd shapes with scalar copies before adding aligned vector copies. Compare both variants with interleaved event trials and save their compiler resource reports.

**Traps**

- Casting an unaligned row or a partial tail to `float4*`. Masking only the starting element does not validate the whole vector.
- Counting just accumulators as the kernel's register demand, or treating a local array as guaranteed register storage.
- Claiming register tiling always reduces DRAM bytes. At fixed block tiling it mainly changes shared-to-register reuse and instruction mix.

**Practice**

- The section mini-project covers this: the `kernellab` register-blocked GEMM, aligned-copy dispatch with scalar tails, tile sweep and register/spill evidence.

**Stop when:** Both copy paths pass edge tests, and your tile comparison explains the observed result using reuse and compiled resources rather than occupancy alone.

<details>
<summary>Self-test</summary>

1. For a 4 by 4 per-thread update, how many shared operand values feed how many multiplies?
   - Eight values feed 16 multiplies per reduction step, if each operand is loaded once and reused across the outer product.
2. Why can a larger accumulator tile lose?
   - It increases live registers and may cause spills or reduce active blocks. Fewer output blocks and more edge waste can also reduce useful parallelism.
3. Does a wide load prove coalescing?
   - No. Width describes one thread's instruction. Coalescing depends on the addresses requested by all active lanes and their alignment.

</details>

#### U4. Block, warp and instruction tiling with swizzled shared-memory layouts

**About 4 h** · **Target:** Derive

Topics: CTA, warp and instruction-level hierarchical tiling; Shared-memory layouts, swizzles and bank conflicts

A tile shape does not specify which lane owns each value. Explicit ownership and address maps connect the algorithm to shared-memory transactions and MMA operands.

**You can now**

- Derive block, warp and instruction tiles without conflating copy ownership with compute ownership.
- Enumerate shared-memory addresses and banks for a specified access pattern.
- Explain how padding or a bijective swizzle changes physical placement without changing the product.

**Study**

1. [Independent copy and compute partitions](https://docs.nvidia.com/cutlass/latest/media/docs/cpp/cute/0x_gemm_tutorial.html) (CuTe GEMM Tutorial) - `sgemm_1.cu`: CTA Partitioning through Math partitioning; `sgemm_2.cu`: TiledCopy, TiledMMA and Other changes, documentation dated September 21, 2026. Depth: Draw one thread's logical coordinates before expanding to the whole block. CuTe represents the second operand as $`N\times K`$, not conventional $`K\times N`$.
2. [A concrete swizzled Ampere layout](https://github.com/NVIDIA/cutlass/blob/v4.2.1/examples/cute/tutorial/sgemm_sm80.cu) (CuTe GEMM Tutorial) - `gemm_tn`: `sA`, `sB` and `Swizzle<3,3,3>`; `gemm_device`: `partition_S` and `partition_D` for the copies, `partition_C` and `partition_fragment_A`/`partition_fragment_B` for the MMA, CUTLASS v4.2.1. Depth: Read the half specialization's 128 by 128 by 64 block tile and three shared stages. Its default accumulator is half, not FP32; do not use its timing harness as a correctness oracle.

**Focus**

- Derive which block tile contains an output, which warp computes it, and which instruction and lane own its fragment. Copy threads can use a different partition from compute threads.
- For scalar 32-bit shared accesses on the usual 32-bank mapping, bank index is the word address modulo 32. Different addresses in the same bank can conflict; the same address can broadcast.
- A swizzle permutes offsets; both stores and loads must use the same map. Analyze instruction-sized access groups rather than assuming a scalar bank proof also proves an `ldmatrix` access conflict-free.

**Reproduce:** Enumerate the 32 scalar column-read addresses of a row-major 32 by 32 FP32 shared tile. They hit one bank at 32 distinct words. Padding the stride to 33 words hits all 32 banks. Then enumerate the integer-offset permutation produced by `Swizzle<3,3,3>` on offsets 0 through 511: it maps each offset once and is its own inverse. Keep that bijection proof separate from a bank-conflict claim for a particular instruction.

**Traps**

- Treating a warp tile as a per-thread tile. An MMA instruction distributes its operands and results across participating lanes.
- Changing the shared layout at load time but not at store time.
- Calling every same-bank access a conflict, including same-word broadcasts.

**Practice**

- The section mini-project covers this: the `kernellab` tile-ownership diagram, scalar bank enumerator and one verified shared-layout permutation.

**Stop when:** Your address enumerator verifies both bank examples and the swizzle bijection, and your diagram separates block, warp, instruction and copy ownership.

<details>
<summary>Self-test</summary>

1. Why may copy and compute ownership differ?
   - Copies should follow global-memory and copy-instruction constraints; computation should follow MMA operand ownership. Shared memory connects the two partitions.
2. Does padding change the logical matrix?
   - No. It changes physical stride and allocation size while preserving logical coordinates and values.
3. Does a bijective swizzle prove conflict freedom?
   - No. It proves distinct logical slots do not alias. Conflict freedom also depends on the addresses issued together and the hardware instruction's access grouping.

</details>

#### U5. Tensor-core MMA: WMMA, `mma.sync` fragments and CuTe atoms

**About 5 h** · **Target:** Implement

Topics: Tensor-core matrix multiply-accumulate model; WMMA, MMA atoms and CuTe-level abstraction boundaries; Operand fragments, layout ownership and accumulator layout

Tensor cores compute a collective matrix operation, not independent thread FMAs. Correct lane ownership, conversion and warp participation come before performance tuning.

**You can now**

- Implement one warp-wide TF32 MMA with explicitly converted inputs and FP32 accumulators.
- Distinguish opaque WMMA fragments, documented PTX lane fragments and CuTe MMA atoms.
- Verify fragment ownership with basis products and a nonzero initial accumulator.

**Study**

1. [Tensor-core model and one-instruction exercise](https://accelerated-computing.academy/fall25/labs/lab6) (MIT 6.S894 Accelerated Computing (Fall 2025) - Lectures 6 and 8 and Labs 4 to 6) - Fall 2025 Lab 6 Part 0: Tensor Cores and `exercise_mma.cu`. Depth: Stop before full-matrix optimization. The handout passes raw FP32 bits through integer registers for every operand and relies on implicit truncation. That passes the lab tests on Ampere, but the PTX ISA leaves the TF32 layout implementation-defined and types multiplicands as `.b32` and accumulators as `.f32`, so convert explicitly and use float registers for the accumulators.
2. [WMMA's collective and memory contract](https://docs.nvidia.com/cuda/archive/13.0.0/cuda-c-programming-guide/index.html#warp-matrix-functions) (CUDA 13.0 matrix programming and PTX references) - CUDA 13.0.0 Programming Guide 10.24.1 Description, 10.24.2 Alternate Floating Point and 10.24.7 Example. Depth: Read the FP16-input, FP32-accumulator example and TF32 conversion requirement. Do not infer lane ownership from the fragment array.
3. [Explicit TF32 lane map and conversion](https://docs.nvidia.com/cuda/archive/13.0.0/parallel-thread-execution/index.html#warp-level-matrix-fragment-mma-1688) (CUDA 13.0 matrix programming and PTX references) - PTX ISA 9.0: Matrix Fragments for `mma.m16n8k8`, Multiply-and-Accumulate Instruction `mma` and Data Movement and Conversion Instructions `cvt`. Depth: Use the TF32 diagrams and Ampere-compatible `cvt.rna.tf32.f32`, which rounds nearest with ties away from zero. The nearest-even `cvt.rn.tf32.f32` variant requires `sm_90`. Skip FP64 and sparse variants.
4. [Instruction traits become an MMA atom](https://docs.nvidia.com/cutlass/latest/media/docs/cpp/cute/0t_mma_atom.html) (CuTe GEMM Tutorial) - CuTe MMA Atoms: Operation structs and Traits; TiledMMAs, documentation dated September 21, 2026. Depth: Follow how instruction shape and thread/value layouts define the atom. Compare with your PTX map rather than implementing another complete GEMM.

**Focus**

- WMMA requires uniform warp participation and matching arguments. Fragment element ownership is unspecified; use `store_matrix_sync` before coordinate-dependent epilogues.
- WMMA load/store pointers require 32-byte alignment; leading dimensions require multiples of 8 half elements or 4 float elements, both 16 bytes. A valid allocation base does not validate every subview.
- For `mma.sync.aligned.m16n8k8.row.col.f32.tf32.tf32.f32`, each lane supplies four TF32 bit-pattern values for the first operand, two for the second, and four FP32 accumulator values. Use inline-assembly `r` constraints for multiplicands and `f` constraints for accumulators.
- MMA shape, input representation, accumulator type and output storage are separate parts of the numerical contract. One collective instruction performs 2048 useful FLOPs for this shape.

**Reproduce:** Implement the one-warp 16 by 8 by 8 TF32 product in Lab 6 `exercise_mma.cu`. Explicitly convert each multiplicand with Ampere-compatible `cvt.rna.tf32.f32`, then issue `mma.sync.aligned.m16n8k8.row.col.f32.tf32.tf32.f32`. Run its permutations, basis products, decimal inputs and zero/nonzero accumulator cases against the bundled absolute-error threshold 0.005. Inspect the generated PTX and SASS: on an RTX 3050 with CUDA 13.4, each conversion appears as an `FSETP` finite check plus an integer add of `0x1000` rather than a named convert instruction, and the product as one `HMMA.1688.F32.TF32`; explain each lane's loaded and stored coordinates.

**Traps**

- Passing raw FP32 bit patterns as TF32 operands because the lab tests pass. The PTX ISA leaves the TF32 layout implementation-defined; convert with `cvt.rna.tf32.f32` so the rounding is the one you state.
- Executing a collective MMA or WMMA call in only some lanes, including at an output boundary.
- Using a WMMA fragment's array index as a portable row or column index.

**Practice**

- [MIT 6.S894 Lab 6 Part 0 - `exercise_mma`](https://accelerated-computing.academy/fall25/labs/lab6) - Implement `exercise_mma.cu` for `sm_80` or newer; retain the supplied fragment and numerical tests. Clone the public `accelerated-computing-class/lab6` repository and build locally with `nvcc -O3 -arch=sm_86 exercise_mma.cu -o exercise_mma` instead of the course runner; a correct kernel prints `mma_16x8x8 tests passed`.

**Stop when:** The one-warp exercise passes every supplied case, and you can distinguish PTX ownership from opaque WMMA fragments and identify the emitted tensor instruction.

<details>
<summary>Self-test</summary>

1. What does the final `f32` in the PTX opcode specify?
   - The initial accumulator operand type. The first `f32` specifies the result type; the two `tf32` fields specify multiplicand types.
2. Why test a nonzero initial accumulator?
   - A correct product-only result does not prove accumulator loading and mapping are correct. The instruction computes a product plus that initial matrix.
3. Does FP32 accumulation recover information lost in TF32 conversion?
   - No. It reduces later accumulation error but cannot restore discarded input significand bits.

</details>

#### U6. Asynchronous copies, multistage pipelines and warp specialization

**About 6 h** · **Target:** Explain + Implement

Topics: Asynchronous copy, multistage producer-consumer pipeline and barriers; Producer and consumer warp specialization

Overlapping future loads with current arithmetic can hide latency only if a stage is complete before consumption and no producer overwrites live data.

**You can now**

- Implement an Ampere two-stage global-to-shared copy pipeline with a correct prologue and drain.
- Explain completion, visibility and buffer-reuse dependencies independently.
- Describe Hopper producer-consumer warp specialization without applying its hardware-specific instructions to Ampere.

**Study**

1. [Buffer lifetimes and producer-consumer roles](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 9 and 10) - Chapter 10: Intra-Kernel Pipelining Techniques; Cooperative Tiling and Double-Buffering with the CUDA Pipeline API; Warp Specialization and the Producer-Consumer Model. Depth: Read for the schedule and ownership. Skip cluster, cooperative-grid and Blackwell mechanisms.
2. [Ampere multistage mainloop](https://github.com/NVIDIA/cutlass/blob/v4.2.1/examples/cute/tutorial/sgemm_sm80.cu) (CuTe GEMM Tutorial) - `gemm_device`: async-copy prefetch, `smem_pipe_read`/`smem_pipe_write`, `cp_async_fence` and `cp_async_wait`, CUTLASS v4.2.1. Depth: Trace the three-stage source, then implement a simpler two-stage pipeline in your existing scalar GEMM. Add predicates and zero-fill tails; the tutorial assumes divisible dimensions.
3. [What an async-copy wait guarantees](https://docs.nvidia.com/cuda/archive/13.0.0/parallel-thread-execution/index.html#data-movement-and-conversion-instructions-cp-async) (CUDA 13.0 matrix programming and PTX references) - PTX ISA 9.0: `cp.async`, `cp.async.commit_group` and `cp.async.wait_group`/`cp.async.wait_all`. Depth: Read the `sm_80` requirement, 4/8/16-byte sizes, source-size zero fill and per-thread group completion.
4. [Ampere schedule versus Hopper specialization](https://accelerated-computing.academy/fall25/lectures/slides/Lecture8.pdf) (MIT 6.S894 Accelerated Computing (Fall 2025) - Lectures 6 and 8 and Labs 4 to 6) - Fall 2025 Lecture 8 slides 7-9 and 11-21. Depth: Skip slide 10's arithmetic-intensity formula. Hopper TMA, WGMMA and register redistribution are explanation-only unless matching hardware is available.

**Focus**

- Model each stage as free, filling, ready, consuming and free again. Completion must precede reads, and the last consumer must finish before reuse.
- A `cp.async` wait completes the issuing thread's selected groups; a block barrier coordinates cross-thread consumption. A barrier alone is not an async-copy completion operation.
- Two stages double the one-stage shared allocation before padding. Additional stages consume resources and do not guarantee faster execution.
- Warp specialization assigns copy and compute roles to different warps. Separate role-specific readiness and release signals from a barrier requiring all block threads.

**Reproduce:** Draw and implement a two-buffer schedule for zero, one, two and five reduction tiles: prefetch tile zero when present, complete the current stage, issue the next tile into the free stage, compute, synchronize before reuse, and drain outstanding copies. Use 4-byte Ampere `cp.async.ca` copies (`.cg` takes only 16 bytes) with zero source size for masked FP32 inputs. Test shapes (17,19,0), (17,19,1), (17,19,16), (17,19,17) and (17,19,65) with reduction tile 16 against CPU double products of integers cycling -2 to 2. Run memory, race and synchronization sanitizers, then compare synchronous and pipelined event intervals without assuming a speedup.

**Traps**

- Waiting on the wrong group count in the final iteration and consuming an unfinished stage.
- Reusing a buffer after copy completion but before all computation using it has finished.
- Putting a full-block barrier only in producer or consumer code.

**Practice**

- The section mini-project covers this: the `kernellab` two-stage Ampere GEMM, short-loop and tail regressions, stage-lifetime diagram and synchronous-versus-async comparison.

**Stop when:** All stage-count and tail cases pass correctness and sanitizer checks, and every wait and reuse barrier has a stated ownership dependency.

<details>
<summary>Self-test</summary>

1. Why test fewer reduction tiles than pipeline stages?
   - The prologue must not load nonexistent tiles, and the drain must wait for the groups actually issued rather than a steady-state assumption.
2. Does `cp.async` remove shared-memory synchronization?
   - No. Completion and cross-thread visibility must still be established, and consumers must release storage before overwrite.
3. Why might three stages lose to two?
   - Extra shared memory can reduce resident blocks, while copy latency may already be hidden and extra scheduling can add overhead.

</details>

#### U7. Input, product and accumulation precision across FP16, BF16, TF32 and FP8

**About 4 h** · **Target:** Derive

Topics: Input, product, accumulation and output precision; FP16, BF16 and TF32 range, precision and execution; E4M3 and E5M2 encoding, range and exceptional values

A low-precision GEMM is a sequence of conversions and arithmetic operations. Its storage dtype alone does not determine either the speed or the error.

**You can now**

- Derive format range and spacing for FP16, BF16, TF32, E4M3 and E5M2.
- Separate input conversion, product precision, accumulation and output conversion errors.
- Construct boundary and cancellation tests without assuming FP8 tensor-core support.

**Study**

1. [Mixed-precision arithmetic paths](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 9 and 10) - Chapter 9: Mixed Precision and Utilizing Tensor Cores; TF32 and Automatic Mixed Precision (PyTorch); BF16/FP16, FP8, and FP4 Reduced Precision. Depth: Skip FP4, TMEM and TMA. Treat framework defaults as version-dependent and identify conversion, accumulation and output types explicitly.
2. [Alternate input formats and accumulation](https://docs.nvidia.com/cuda/archive/13.0.0/cuda-c-programming-guide/index.html#alternate-floating-point) (CUDA 13.0 matrix programming and PTX references) - CUDA 13.0.0 Programming Guide 10.24.2 Alternate Floating Point; 10.24.1 template type combinations. Depth: Read BF16 and TF32. Do not mistake TF32 execution precision for a new ordinary memory-storage dtype.
3. [FP8 encodings and conversions](https://www.opencompute.org/documents/ocp-8-bit-floating-point-specification-ofp8-revision-1-1-final-pdf) (OCP 8-bit Floating Point Specification) - OFP8 revision 1.1: section 5.1, Tables 1 and 2, printed page 13; section 5.2 and 5.2.1, printed page 14. Depth: Distinguish the OCP formats from variants with different zero/NaN encodings. Test saturating and non-saturating conversion separately.

**Focus**

- Near one, FP16 and TF32 have spacing $`2^{-10}`$, BF16 $`2^{-7}`$, E4M3 $`2^{-3}`$, and E5M2 $`2^{-2}`$. Range and significand precision are different axes.
- OCP E4M3 has maximum finite 448, minimum normal $`2^{-6}`$, minimum subnormal $`2^{-9}`$, NaN and no infinity. E5M2 has maximum finite 57344, minimum normal $`2^{-14}`$, minimum subnormal $`2^{-16}`$, NaN and infinity.
- Compare an original-input double reference with a double product of converted inputs, then compare that converted-input reference with the actual kernel. The differences isolate input quantization from later arithmetic and output rounding.
- FP32 accumulation cannot prevent overflow during an earlier FP16 input conversion or undo input rounding. Exact product and accumulation behavior is instruction-specific, not implied solely by the output dtype.

**Reproduce:** Decode all 256 OCP FP8 bit patterns from sign, exponent and fraction fields, and verify both format boundary tables. With nearest-even conversion, show that 1.0625 is an E4M3 midpoint rounding to 1, whereas 1.1875 rounds to 1.25. For a dot product, convert the inputs [1.0001, -1] and [1, 1] to FP16 before evaluating in double: the original product is approximately 0.0001, but the converted-input product is zero. Record that as input-conversion error, not accumulation error.

**Traps**

- Assuming E4M3's all-ones exponent always denotes infinity, as it would in many IEEE formats.
- Calling BF16 more accurate than FP16 because it has a wider exponent range.
- Assuming a software FP8 cast means the GPU supports native FP8 matrix multiplication.

**Practice**

- The section mini-project covers this: the `kernellab` format-boundary decoder, midpoint conversion tests and split input-versus-arithmetic error report.

**Stop when:** The enumerated FP8 extrema and midpoint tests match revision 1.1, and your cancellation example distinguishes input loss from accumulation precision.

<details>
<summary>Self-test</summary>

1. Which has finer spacing near one, FP16 or BF16?
   - FP16. Its ten explicit fraction bits give finer spacing than BF16's seven; BF16 has a wider normal exponent range.
2. Can E4M3 represent positive infinity?
   - Not in the OCP E4M3 format. Out-of-range conversion must follow the selected saturation policy; non-saturating overflow produces NaN.
3. Why use both original-input and converted-input references?
   - The first measures total approximation error; the second isolates arithmetic and output error after input conversion.

</details>

#### U8. Scale granularity and quantization error against task tolerances

**About 4 h** · **Target:** Derive + Measure

Topics: Tensor, channel, block and dynamic scale selection; Quantization and accumulation error against task tolerances

Low-precision range becomes useful only with a scaling policy. Its granularity changes both error and where scale factors can be applied in GEMM.

**You can now**

- Derive quantization and reconstruction with an explicit positive scale convention.
- Compare per-tensor, per-channel and reduction-block scales including metadata and tail costs.
- Measure clipping and output error against a predefined numerical tolerance rather than accepting speed alone.

**Study**

1. [Scale convention and representable range](https://docs.nvidia.com/deeplearning/tensorrt/latest/inference-library/quantized-types-schemes.html) (TensorRT quantization schemes and workflows) - Quantization Schemes: INT8, FP8 and Table 14, documentation dated October 5, 2026. Depth: Read symmetric INT8 and E4M3 formulas. Separate these framework-supported schemes from a general affine zero-point exercise.
2. [Granularity and dynamic scale selection](https://docs.nvidia.com/deeplearning/tensorrt/latest/inference-library/quantized-types-workflows.html) (TensorRT quantization schemes and workflows) - Quantization Granularities: numbered per-tensor and per-channel definitions and Block Quantization example; Dynamic Quantization, documentation dated October 5, 2026. Depth: Skip calibration implementation and FP4. In block pseudocode use ceiling division for the number of scales; `ceil(R//B)` loses a partial block.

**Focus**

- Define a reconstruction scale $`s>0`$: symmetric INT8 uses $`q=\operatorname{roundEven}(\operatorname{clip}(x/s,-128,127))`$ and $`\hat{x}=sq`$. FP8 rounds to its nonuniform representable set, not to integers.
- With one scale per row of the first operand and per column of the second, $`\hat{C}_{ij}=s_{A,i}s_{B,j}\sum_k q_{A,ik}q_{B,kj}`$. Scales varying along the reduction require scaled partial sums inside the reduction, not one final factor.
- Specify zero-block handling, scale dtype, nearest-even ties, clipping and nonfinite-input policy. Dynamic scales cost a reduction and metadata traffic; calibration scales can fail on unseen outliers.
- Measure maximum absolute error, relative error only away from zero, normalized Frobenius error and clipping count against an original-input double reference. A converted-input reference tests implementation but does not establish task accuracy.

**Reproduce:** Quantize the two rows [0.01, 0.02, 0.03, 0.04] and [10, 20, 30, 40] to symmetric INT8 using a maximum-magnitude scale divided by 127. A shared scale makes the first row all zeros; separate row scales preserve nonzero values in both rows. Reconstruct, record maximum absolute error and clipping count, then repeat with an unseen value 80 using the previously fixed scale to expose saturation. For reduction length 65 and block size 32, allocate three scales and explicitly test the one-element tail. Choose a positive neutral scale for an all-zero block.

**Traps**

- Multiplying by a forward quantization multiplier when the API expects the inverse reconstruction scale.
- Pulling reduction-block scales outside the full dot product when those scales vary with the reduction block.
- Using LeetGPU Challenge 32's FP32 matmul reference as an arbitrary-range exact integer oracle. Its large products can exceed exact FP32 integer range.

**Practice**

- The section mini-project covers this: the `kernellab` per-tensor/per-channel/block quantization comparison, integer-accumulator reference, scale-tail tests and predeclared error acceptance table.

**Stop when:** Your scale policies pass zero, outlier and partial-block tests, and a numerical acceptance table rejects at least one inaccurate policy regardless of its speed.

<details>
<summary>Self-test</summary>

1. What happens to an all-zero block under amax-based scaling?
   - Naively it produces a zero scale and division by zero. Choose a defined positive scale and emit zero codes.
2. When can scales move to the epilogue?
   - When each output's scale product is constant over its entire reduction. Reduction-dependent scales require scaled partial products.
3. Why is relative error alone a poor gate near cancellation?
   - The reference can be almost zero, making a tiny absolute error produce a huge or undefined relative error. Use an absolute tolerance there.

</details>

#### U9. Epilogue fusion and persistent or grouped GEMM

**About 5 h** · **Target:** Implement

Topics: Persistent, grouped and mixture-of-experts GEMM; Bias, activation, scale and dequantization epilogue fusion

Fusion can remove intermediate traffic, while persistence can amortize scheduling across tiles. Both can lose if resource pressure or scheduling overhead outweighs the saved work.

**You can now**

- Implement bias, scale and ReLU directly in a GEMM epilogue and verify operation order.
- Distinguish batched, grouped and persistent execution schedules.
- Implement an optional bounded persistent tile scheduler and compare the complete fused operation with an unfused baseline.

**Study**

1. [Fusion and long-lived work scheduling](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 9 and 10) - Chapter 9: Kernel Fusion; Chapter 10: Persistent Kernels and Megakernels, Common Workloads for Persistent Kernels. Depth: Implement a bounded GEMM epilogue, not a megakernel or cooperative-grid runtime. Persistence and grouped GEMM are optional extensions after the fused operation passes.
2. [GEMM lifecycle and persistence](https://accelerated-computing.academy/fall25/lectures/slides/Lecture8.pdf) (MIT 6.S894 Accelerated Computing (Fall 2025) - Lectures 6 and 8 and Labs 4 to 6) - Fall 2025 Lecture 8 slides 25-31. Depth: Extract scheduling and prologue/epilogue arguments. Do not implement Hopper-only cluster or warpgroup instructions for this unit.
3. [A coordinate-aware epilogue](https://docs.nvidia.com/cutlass/latest/media/docs/cpp/cute/0y_predication.html) (CuTe GEMM Tutorial) - Predication: GEMM epilogue example and coordinate predicates, documentation dated September 21, 2026. Depth: Reuse output predicates when adding column bias and activation. Ensure the bias index is the logical column, not a fragment-array index.

**Focus**

- Define the fused contract as $`D_{ij}=\max(0,\alpha s_{A,i}s_{B,j}P_{ij}+\beta C_{ij}+b_j)`$, where $`P`$ is the accumulator product. Omit reconstruction factors for unquantized inputs. Apply output conversion only after this epilogue.
- For a separate elementwise epilogue, fusion removes one intermediate write and one intermediate read, or $`2s M N`$ requested bytes. Bias, old-output reads and final-output writes remain; caches can change actual DRAM savings.
- Batched GEMM has a regular family of products; grouped GEMM can vary shapes and pointers. Persistence describes long-lived blocks taking multiple tiles, not a different mathematical operation.
- A bounded persistent scheduler can assign flattened tile IDs with a grid-stride loop. Reset accumulators for every tile, map group boundaries explicitly, and retain a nonpersistent fallback.

**Reproduce:** Add column bias and ReLU to the existing FP32 GEMM for shapes (17,19,23) and (32,16,17). Test positive and negative bias, nonzero old output and zero reduction against an independent CPU double implementation with the same epilogue order. For a 64 by 96 FP32 intermediate, derive 49152 requested bytes removed by fusion. Time GEMM plus separate epilogue versus fused GEMM, including all device work in each interval. Optional: run a grid-stride persistent scheduler over two differently shaped products and verify every output tile is written exactly once.

**Traps**

- Applying activation before bias or reconstruction and thereby changing the operation.
- Reading the old output when the overwrite contract has $`\beta=0`$ and may supply uninitialized storage.
- Assuming persistence guarantees load balance or that grouped GEMM is identical to a uniform strided batch.

**Practice**

- The section mini-project covers this: the `kernellab` bias/ReLU epilogue, complete-operation timing pair and optional two-group persistent tile scheduler with unique-ownership tests.

**Stop when:** The fused epilogue passes edge and operation-order tests, its traffic savings are derived, and the report compares complete fused and unfused operations; optional scheduling has its own ownership check.

<details>
<summary>Self-test</summary>

1. Which traffic does an in-register epilogue remove?
   - The intermediate product's write and subsequent epilogue read. It does not remove required bias, old-output or final-output traffic.
2. Can a persistent block keep the previous tile's accumulator?
   - Not for an independent output tile. Reset it or load the new tile's required initial state before computing.
3. Why can fusion reduce bytes but still lose?
   - Added registers, instructions or shared-memory use can reduce throughput or residency; small intermediates may already stay in cache.

</details>

#### U10. Library baselines, shape-aware dispatch and residual analysis

**About 6 h** · **Target:** Measure

Topics: cuBLAS or framework library baselines and dispatch context; Shape-aware tuning, dispatch and unseen-shape fallback; Roofline, instruction, resource and end-to-end residual analysis

A custom kernel needs a strong, equivalent baseline and evidence for where it wins or loses. Dispatch converts isolated tuning results into a bounded usable implementation.

**You can now**

- Build a correctness-gated cuBLAS or cuBLASLt baseline with matching layout, precision and epilogue semantics.
- Select kernels by shape and contract with a safe fallback for unseen inputs.
- Explain measured time beyond the roofline lower bound using resource, instruction and complete-operation evidence.

**Study**

1. [Library descriptors and candidate timing](https://github.com/cfregly/ai-performance-engineering/blob/b57e4c6a9e261c09ac09208705d040c81b03d35e/code/ch09/optimized_cublaslt_gemm.cu) (AI Systems Performance Engineering companion code - Chapters 9 and 10) - main: matrix layouts, CUBLAS_COMPUTE_32F descriptor, workspace preference, heuristic candidate loop and fallback, at commit b57e4c6. Depth: Extract a small rectangular wrapper. Skip PDL. The file's tensor-core label does not prove tensor execution, and `baseline_cublaslt_gemm.cu` is a naive custom kernel, not the vendor baseline.
2. [Bounded tuning and instruction evidence](https://siboehm.com/articles/22/CUDA-MMM#kernel-9-autotuningi-skipped-kernels-7-and-8-which-i-wrote-while-figuring-out-how-to-best-eliminate-shared-memory-bank-conflicts-they-eliminate-the-conflicts-but-were-overall-still-slower-so-i-wont-cover-them-here) (How to Optimize a CUDA Matmul Kernel for cuBLAS-like Performance: a Worklog) - Kernel 9: Autotuning; Kernel 10: Warptiling. Depth: Use a small candidate set, not the published A6000 timing table as a target. Add held-out shapes and edge-safe fallbacks.
3. [Problem sizes and scheduling](https://accelerated-computing.academy/fall25/labs/lab5) (MIT 6.S894 Accelerated Computing (Fall 2025) - Lectures 6 and 8 and Labs 4 to 6) - Fall 2025 Lab 5 Part 0: Understanding Occupancy; Part 1: Improving Performance; Part 2: Handling More Problem Sizes. Depth: Use the shape and occupancy questions; do not adopt the course GPU's expected times.

**Focus**

- Match operand storage, transpose flags, strides, batch count, input and accumulator types, $`\alpha`$/$`\beta`$, output dtype and epilogue. Include required conversions and separate epilogue kernels when comparing complete operations.
- Use stream events after warmup, interleave candidates, retain distributions and recheck correctness after selection. Record GPU, compiler, driver, library versions, workspace and math mode; timing tuning is separate from steady-state dispatch.
- Key dispatch by shape, layout/alignment, dtype and numerical contract. A tuned aligned kernel is invalid for an unaligned view even if its dimensions match.
- Use $`t_{\mathrm{roof}}=\max(F/P,Q/B)`$ as a lower-bound model under stated compute and traffic assumptions. Positive residual $`t_{\mathrm{measured}}-t_{\mathrm{roof}}`$ is not itself a diagnosis; test launch, tails, issue rate, spills, occupancy and epilogue hypotheses.

**Reproduce:** Compare naive, shared, register-tiled, async and vendor GEMM on (64,96,32), (256,256,256), (16,512,64) and (257,129,65), first with small integer FP32 inputs and then with declared random-input tolerances. Hold out (31,67,33) from tuning and require fallback correctness. For each candidate save useful FLOPs, compulsory-byte model, event distribution, compiled resources and complete-operation latency. Derive the row-major cuBLAS mapping by computing the transposed output with swapped operands and dimensions; verify it on a nonsquare product before timing. Show one losing regime and a falsifiable residual hypothesis, without promising a custom-kernel win.

**Traps**

- Comparing a strict FP32 kernel with an unconstrained TF32 library path while reporting only speed.
- Timing allocation, tuning or host dispatch for one candidate but only device computation for another.
- Naming a bottleneck from roofline position alone or inventing profiler counters when access is denied.

**Practice**

- The section mini-project covers this: the `kernellab` equivalent vendor baseline, bounded tile sweep, shape-contract dispatch table, held-out fallback tests and residual report with best and losing regimes.

**Stop when:** Every dispatched path and held-out fallback passes its numerical contract, and your reproducible comparison identifies a losing regime with evidence or an explicitly untested counter hypothesis.

<details>
<summary>Self-test</summary>

1. Is the first cuBLASLt heuristic guaranteed fastest?
   - No. It proposes eligible candidates; measure them under the same contract and workspace limit, after correctness checks.
2. What does a negative residual suggest?
   - At least one model assumption or measurement is inconsistent: FLOP count, byte model, attainable rates, cache residency or timing scope. It does not prove the hardware exceeded a valid bound.
3. What should dispatch do on an unseen or unsupported layout?
   - Select a validated general kernel or vendor fallback, rather than reusing a specialization whose preconditions are not satisfied.

</details>

### Mini-project: Tiled GEMM to async pipelines with a low-precision error contract

**About 14 to 20 hours.** Grow kernellab through the GEMM ladder on the RTX 3050: naive counts, shared-memory tiles, register blocking, layout swizzles, one warp-level tensor path, a two-stage async pipeline, format boundaries, quantization error and a fused epilogue, all gated against a vendor baseline with held-out fallback. TMA, clusters and FP8 on Hopper are reading and static audit only.

1. Write a naive overwrite-only fp32 GEMM with a shape-to-FLOP calculator and two byte models: compulsory bytes and requested loads for the uncached scalar model. Derive closed-book for $`M = 64`$, $`N = 96`$, $`K = 32`$: 393216 useful FLOPs, 45056 compulsory bytes and 1597440 requested bytes, times batch count for independent batches with no shared operands. Check small integer products exactly against CPU double precision.
2. Write a 16 by 16 shared-memory overwrite GEMM without copying the source. Compare finite integer-valued fp32 inputs cycling -2 to 2 against a CPU double-precision product at shapes (1, 1, 1), (17, 19, 23) and (32, 16, 17) with every output checked, covering edge and empty dimensions. Run Compute Sanitizer memory, race and synchronization checks and keep tile-race regressions.
3. Derive then implement a 64 by 64 output tile with reduction width 8 and a 4 by 4 per-thread accumulator tile: 256 threads, 16 accumulator values per thread and 4096 shared-memory bytes for one fp32 stage excluding padding. Check odd shapes with scalar copies first, then add aligned vector-copy dispatch with scalar tails. Compare both variants with interleaved event trials and save `cuobjdump -res-usage` for each, with register and spill notes. Pass LeetGPU challenges 2 and 22 locally with this kernel; challenge 2 names the reduction dimension `N`.
4. Draw the tile-ownership diagram, then enumerate the 32 scalar column-read addresses of a row-major 32 by 32 fp32 shared tile (one bank at 32 distinct words) and the stride-33 padded case (all 32 banks). Verify the integer-offset permutation of `Swizzle<3, 3, 3>` on offsets 0 through 511 as a bijection that is its own inverse, kept separate from any bank-conflict claim for a particular instruction, and keep one verified shared-layout permutation in the kernel.
5. Implement the one-warp 16 by 8 by 8 TF32 product in MIT 6.S894 Lab 6 `exercise_mma.cu`, built locally with `nvcc -O3 -arch=sm_86`: convert each multiplicand with Ampere-compatible `cvt.rna.tf32.f32`, issue `mma.sync.aligned.m16n8k8.row.col.f32.tf32.tf32.f32`, and run permutations, basis products, decimal inputs and zero and nonzero accumulator cases against absolute error threshold 0.005. Inspect generated PTX and SASS for conversion and tensor instructions and explain each lane loaded and stored coordinates. Record Hopper `wgmma`, `tcgen05` and microscaling paths as a static audit only.
6. Draw and implement a two-buffer schedule for zero, one, two and five reduction tiles: prefetch tile zero when present, complete the current stage, issue the next tile into the free stage, compute, synchronize before reuse and drain outstanding copies. Use 4-byte Ampere `cp.async.ca` copies with zero source size for masked fp32 inputs, keep a stage-lifetime diagram, and test shapes (17, 19, 0), (17, 19, 1), (17, 19, 16), (17, 19, 17) and (17, 19, 65) with reduction tile 16 against CPU double products of integers cycling -2 to 2, with short-loop and tail regressions. Compare synchronous against async with interleaved event trials and run memory, race and synchronization checks.
7. Decode all 256 OCP fp8 bit patterns from sign, exponent and fraction fields and verify both format boundary tables. With nearest-even conversion show 1.0625 as an E4M3 midpoint rounding to 1 while 1.1875 rounds to 1.25. For the dot product of `[1.0001, -1]` with `[1, 1]`, convert inputs to fp16 before evaluating in double: the original product near 0.0001 becomes zero, recorded as input-conversion error rather than accumulation error. Then quantize rows `[0.01, 0.02, 0.03, 0.04]` and `[10, 20, 30, 40]` to symmetric int8 with maximum-magnitude scale over 127: a shared scale zeroes the first row while separate row scales keep both nonzero. Reconstruct with maximum absolute error and clipping count, repeat with unseen value 80 on the fixed scale to show saturation, allocate three scales for reduction length 65 with block size 32 with an explicit one-element tail test, and file a predeclared error acceptance table against an integer-accumulator reference.
8. Add column bias and ReLU to the fp32 GEMM at shapes (17, 19, 23) and (32, 16, 17), testing positive and negative bias, nonzero old output and zero reduction against an independent CPU double implementation with the same epilogue order. Derive 49152 requested bytes removed by fusion for a 64 by 96 fp32 intermediate. Time GEMM plus separate epilogue against fused GEMM with all device work inside each interval, with the optional two-group persistent tile scheduler carrying unique-ownership tests. Compare naive, shared, register-tiled, async and vendor GEMM on (64, 96, 32), (256, 256, 256), (16, 512, 64) and (257, 129, 65) with small integers then declared random-input tolerances, hold out (31, 67, 33) from tuning for fallback correctness, save useful FLOPs, compulsory bytes, event distributions, compiled resources and complete-operation latency per candidate, derive the row-major cuBLAS mapping via transposed output with swapped operands, and report best and losing regimes with residuals.

**Deliverables**

- `kernels/cuda/` GEMM ladder with FLOP and byte models, edge tests, sanitizer regressions and resource reports.
- The tensor path with conversion and MMA evidence, the two-stage pipeline with lifetime diagram and the sync against async comparison.
- The format decoder, quantization comparison with acceptance table, the fused epilogue timing pair and the vendor-baseline sweep with held-out fallback and residual report.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [LeetGPU GEMM challenges run locally against the reference implementation](https://leetgpu.com/challenges/). Run 2 Matrix Multiplication and 22 GEMM locally with matched tolerances; keep shape matrices and losing regimes.
- external-tests: [MIT 6.S894 Lab 6 tensor-core exercise](https://accelerated-computing.academy/fall25/labs/lab6). Build `exercise_mma.cu` locally with `nvcc -O3 -arch=sm_86` and keep the supplied fragment and numerical tests.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Tiling correctness | Each GEMM level matches the CPU double reference on edge and odd shapes, sanitizer checks pass, and the held-out shape passes on the fallback path. | Short-loop and tail cases are kept as regressions that fail on the unguarded kernel. |
| Resource and pipeline evidence | The 256-thread mapping, 4096-byte stage and `cuobjdump -res-usage` reports are kept, the lifetime diagram predicts the synchronization points, and sync against async uses interleaved trials. | Hopper-only paths are marked as static audit with no performance claim. |
| Numerical contract | Format boundaries, midpoint cases and the input against arithmetic split are tested, quantization states scales, tail handling and acceptance limits, and the vendor comparison reports best and losing regimes. | Unseen-value saturation is demonstrated, and the 49152-byte fusion saving is derived before the timing pair rather than asserted from it. |

Feeds into: Capstone kernel suite: the GEMM ladder, pipeline and error contract feed attention, Triton and integration. The vendor baseline and dispatch table carry into the final defense.

### Resource route

- **Primary - Book:** [AI Systems Performance Engineering - Chapters 9 and 10](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) - Read Chapter 9 on arithmetic intensity, tiling and fusion, and Chapter 10 on intra-kernel pipelining, warp specialization and thread-block clusters. Separate what applies to every NVIDIA GPU from what needs Hopper or Blackwell.
- **Required - Lab:** [AI Systems Performance Engineering companion code - Chapters 9 and 10](https://github.com/cfregly/ai-performance-engineering/tree/main/code) - Inspect and run compatible baseline and optimized paths from `code/ch09` and `code/ch10`. Verify whether each path is a custom kernel, compiler selection or library dispatch, then add an independent correctness and timing wrapper.
- **Required - Course:** [MIT 6.S894 Accelerated Computing (Fall 2025) - Lectures 6 and 8 and Labs 4 to 6](https://accelerated-computing.academy/fall25/lectures) - Use Lecture 6 for tensor cores and arithmetic intensity and Lecture 8 (Evolving Ampere to Hopper) for the production GEMM schedule. Do Lab 4 (tiling and reuse), Lab 5 (scheduling and problem sizes) and Lab 6 (tensor cores through inline PTX) built for your own GPU; each harness checks results against bundled test data. Lab 6 needs sm_80 or newer.
- **Support - Article:** [How to Optimize a CUDA Matmul Kernel for cuBLAS-like Performance: a Worklog](https://siboehm.com/articles/22/CUDA-MMM) - Read kernels 1 to 6, 9 and 10 with the companion repository. Its numbers come from an RTX A6000 (Ampere); remeasure on your GPU before comparing your kernels with them.
- **Required - Tutorial:** [CuTe GEMM Tutorial](https://docs.nvidia.com/cutlass/latest/media/docs/cpp/cute/0x_gemm_tutorial.html) - Work through tiling, layouts, copy atoms and MMA atoms. Draw the logical and physical ownership for one tile, then modify a shape or layout and verify both generated mapping and numerical output.
- **Required - Specification:** [OCP 8-bit Floating Point Specification](https://www.opencompute.org/documents/ocp-8-bit-floating-point-specification-ofp8-revision-1-1-final-pdf) - Study E4M3 and E5M2 encodings, exceptional values and conversion behavior. Build value-boundary tests and separate format correctness from the scaling policy chosen by a framework or kernel.
- **Required - Practice:** [LeetGPU - GEMM and Quantized Matmul Challenges](https://leetgpu.com/challenges/) - Solve 2 Matrix Multiplication and 22 GEMM, then choose 30 Batched Matrix Multiplication or 57 FP16 Batched Matmul. Attempt 32 INT8 Quantized Matmul or 81 INT4 Matmul only after scale and accumulator tests pass. Preserve local baselines and shape matrices.
- **Support - Lectures:** [GPU MODE - CUTLASS, Tensor Cores and CuTe](https://github.com/gpu-mode/lectures) - Use Lectures 15, 23, 36, 57, 86, 103 and 114 selectively. Pair each chosen lecture with one implemented layout, instruction or pipeline change and compare it against a vendor-library baseline.
- **Depth - Implementation:** [DeepGEMM](https://github.com/deepseek-ai/DeepGEMM) - After the portable GEMM passes, reconstruct one Hopper FP8 path from source, identify its hardware, layout and scaling assumptions, and test a bounded modification only on supported hardware. Do not generalize repository benchmarks to other shapes or GPUs.
- **Depth - Book:** [Modern GPU Programming for MLSys](https://mlc.ai/modern-gpu-programming-for-mlsys/) - Read the performance, data-layout, tensor-core, TMA, tensor-memory, barrier and GEMM chapters for a Blackwell-depth route. Execute only with sm_100a and the pinned TIRx toolchain; otherwise use it for derivation and code reading.
- **Reference - Documentation:** [CUDA 13.0 matrix programming and PTX references](https://docs.nvidia.com/cuda/archive/13.0.0/cuda-c-programming-guide/index.html#warp-matrix-functions) - Coverage and correctness gap: the pool lacks a precise WMMA contract, and Lab 6 relies on TF32 conversion and register behavior the PTX ISA leaves unspecified. Use Programming Guide 10.24 and PTX ISA 9.0 `mma.m16n8k8` fragments, `mma` and `cvt`, archived with CUDA 13.0.0; also consult `cp.async` completion semantics.
- **Reference - Documentation:** [TensorRT quantization schemes and workflows](https://docs.nvidia.com/deeplearning/tensorrt/latest/inference-library/quantized-types-schemes.html) - Coverage gap: the existing pool does not derive scale granularity and reconstruction conventions precisely. Read INT8/FP8 equations, per-tensor/per-channel/block quantization and dynamic quantization in documentation dated October 5, 2026. Skip engine building and replace the block pseudocode's floor-divided scale count with ceiling division.

### Exit checkpoint

Build a correctness-gated tiled GEMM, explain its hierarchy and low-precision contract, compare it across representative shapes with a strong library baseline, and show profiler evidence for both its best regime and a regime where it loses.

<details>
<summary>Deliberately left for later</summary>

- Blackwell-only TMA, tensor-memory and cluster optimization without matching hardware
- A general GEMM library or unsupported claim of beating cuBLAS
- New low-precision training research beyond format, scaling and inference-kernel correctness

</details>

## GPU-6. Attention and Transformer Fusion

**Why:** Attention combines matrix multiplication, reduction, numerical stability, masks and expensive data movement. This stage derives the IO-aware algorithm, implements a bounded version and connects kernel behavior to prefill, decode and fused transformer operations.

### Learn this much

- [ ] Attention equations, head shapes and tensor layouts _(Required)_
- [ ] Prefill and decode attention shape and reuse regimes _(Required)_
- [ ] Materialized score and probability tensors and HBM traffic _(Required)_
- [ ] Running maximum, normalizer and output rescaling _(Required)_
- [ ] Query, key and value block tiling _(Required)_
- [ ] Causal, padding and arbitrary mask boundaries _(Required)_
- [ ] MHA, GQA and MQA head grouping and data reuse _(Required)_
- [ ] Accumulation, exponentials, rescaling and output tolerance _(Required)_
- [ ] FlashAttention IO complexity and memory hierarchy assumptions _(Required)_
- [ ] FlashAttention-2 work partitioning and occupancy _(Required)_
- [ ] FlashAttention-3 asynchronous movement and overlap _(Depth)_
- [ ] FlashAttention-4 Blackwell schedule and tensor memory _(Depth)_
- [ ] Backward attention state and recomputation _(Optional)_
- [ ] Variable-length and ragged attention _(Required)_
- [ ] Paged and decode attention address mapping _(Required)_
- [ ] Key-value append, gather, layout conversion and cache writes _(Required)_
- [ ] Quantized key-value loads and dequantization _(Optional)_
- [ ] Stable RMSNorm and LayerNorm reduction and fusion _(Required)_
- [ ] Rotary position embedding layout and fusion _(Required)_
- [ ] SwiGLU and MLP fusion boundaries _(Required)_
- [ ] Residual, norm, activation and scale epilogue fusion _(Required)_
- [ ] Compiler, framework and production attention-library baselines _(Required)_
- [ ] Sequence, head, batch, mask, dtype and alignment matrix _(Required)_
- [ ] Kernel gain translated to TTFT, TPOT, memory and goodput _(Required)_
- [ ] Small, decode-heavy, irregular and unsupported losing regimes _(Required)_
- [ ] Sparse and long-context attention algorithms _(Later)_

### Study units

#### U1. Attention shapes, prefill and decode reuse, and materialized traffic

**About 5 h** · **Target:** Derive

Topics: Attention equations, head shapes and tensor layouts; Prefill and decode attention shape and reuse regimes; Materialized score and probability tensors and HBM traffic

The score matrix is often larger than the inputs. Its shape explains what tiling removes and why a prefill schedule need not work well for decode.

**You can now**

- Derive attention shapes and leading matrix-multiply FLOPs for prefill and single-token decode.
- Count score and probability storage separately from reads and writes.
- Explain why decode has less query-side reuse without declaring it bandwidth-bound from shape alone.

**Study**

1. [FlashAttention, arXiv:2205.14135v2](https://arxiv.org/abs/2205.14135v2) (FlashAttention) - Section 2.2, Standard Attention Implementation, and Algorithm 0 (p. 4).
2. [FlashInfer decode shape and layout contract](https://github.com/flashinfer-ai/flashinfer/blob/f2794d5890121e23c032520b57c50f9ea145437d/flashinfer/decode.py) (FlashInfer) - Commit f2794d5, `single_decode_with_kv_cache` docstring: `q`, `k`, `v`, `kv_layout` and `use_tensor_cores` parameters. Depth: Read the parameter contracts only. Do not implement the production dispatch yet.

**Focus**

- For batch size $`B`$, query heads $`H_q`$, query length $`L`$, key length $`S`$ and equal key/value head width $`d`$, scores have shape $`B \times H_q \times L \times S`$. Attention is $`O = \operatorname{softmax}(QK^\top/\sqrt{d})V`$, with softmax over keys.
- Count the two dense matrix products as $`4 B H_q L S d`$ FLOPs, counting each multiply-add as two. Scaling, masking and softmax are additional work. Prefill has many query rows; ordinary decode has one per request.
- Algorithm 0 writes and reads both scores and probabilities. At $`b`$ bytes per intermediate element this is $`4 b B H_q L S`$ requested bytes, not the complete kernel traffic or a hardware-counter measurement.
- Decode can reuse each KV head across grouped query heads, but cannot reuse it across a long query tile. Layout, cache residency and schedule determine whether that reuse is realized.

**Reproduce:** Closed-book, count noncausal MHA with $`B = 1`$, $`H_q = 8`$, $`L = S = 1024`$, $`d = 64`$, and two-byte score, probability and key/value storage. The two intermediates occupy 32 MiB and their write-read traffic is 64 MiB; the two matrix products require $`2{,}147{,}483{,}648`$ FLOPs. For decode with $`L = 1`$ and the same cache, one ideal read of keys and values is 2 MiB. Explain every excluded byte category.

**Traps**

- Calling storage size traffic. A tensor may be read several times, and actual memory transactions can exceed requested bytes.
- Using the paper's unscaled equation as a different model. Its exposition omits the scale; your reference must include the model's scale.
- Assuming the paper's HBM hardware. The same dataflow applies to GPUs with GDDR memory, but bandwidth and on-chip capacity differ.

**Practice**

- [LeetGPU 6: Softmax Attention](https://github.com/AlphaGPU/leetgpu-challenges/blob/9c9dbe55e8d6124f42f0de9b6696290cbcd9670e/challenges/medium/6_softmax_attention/challenge.py) - `reference_impl`, `generate_example_test` and all four cases in `generate_functional_test`. Implement the unchanged `solve` signature in CUDA or Triton. Use the public generators and reference in your own local harness, as in the CUDA primitives section; the repository lacks `core.challenge_base`, and `scripts/run_challenge.py` submits to a service with an API key rather than running locally. Recreate the generated tensors and compare outputs using the challenge's tolerances. The cases include rectangular attention and odd head widths. The section mini-project covers the traffic ledger.

**Stop when:** Your traffic ledger reproduces the counts, and your attention implementation matches every functional case of challenge 6 without claiming a speedup.

<details>
<summary>Self-test</summary>

1. Does avoiding the score matrix remove quadratic prefill arithmetic?
   - No. Dense attention still computes every allowed query-key interaction. Tiling changes storage and data movement, not the leading dense matrix-product count.
2. Why are 32 MiB of intermediates responsible for 64 MiB of requested traffic in this model?
   - Each of the two tensors is written once and read once. This excludes input/output movement, repeated tile loads, masks and workspace.
3. Does a long KV cache prove decode is memory-bound?
   - No. It predicts substantial KV movement. Launches, insufficient parallelism, reductions and address translation may dominate; timing and profiling must distinguish them.

</details>

#### U2. Online softmax state, query and key-value tiling and output tolerance

**About 6 h** · **Target:** Derive + Implement

Topics: Running maximum, normalizer and output rescaling; Query, key and value block tiling; Accumulation, exponentials, rescaling and output tolerance

Online softmax lets a query row consume keys in pieces. Rescaling both the denominator and weighted numerator is what makes those pieces one attention operation.

**You can now**

- Derive the running maximum, normalizer and weighted numerator invariants.
- Implement a tiled forward pass that retains only query-tile state on chip.
- Validate accumulation and rescaling with an independent reference and a stated extreme-value policy.

**Study**

1. [Online Normalizer Calculation, arXiv:1805.02867v2](https://arxiv.org/abs/1805.02867v2) (Online Normalizer Calculation for Softmax) - Section 3, Algorithm 3 and its induction proof; Section 3.1, equations 3 and 4 (pp. 2 to 4). Depth: Stop before Section 4. The proof assumes finite logits; its associativity is a real-arithmetic statement, not bitwise floating-point equivalence.
2. [CS336 Assignment 2: weighted sum and tiled forward](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/cs336_assignment2_systems.pdf) (CS336 Assignment 2 - Section 4 FlashAttention-2 in Triton) - Commit ca8bc81: Section 4.2.1, Example - Weighted Sum, forward pass (pp. 17 to 19); Section 4.2.2, Details of the FlashAttention forward pass and Algorithm 1 (pp. 24 to 25); problem `flash_forward` parts (a) and (b) (pp. 26 to 27). Depth: Read the weighted-sum forward example before attention; defer its backward kernel. Start with the public test sizes, not the B200 sweep. Add bounds checks beyond the handout's power-of-two contract.

**Focus**

- For processed keys, keep $`m = \max_j s_j`$, $`\ell = \sum_j \exp(s_j-m)`$ and $`u = \sum_j \exp(s_j-m)v_j`$. Output is $`u/\ell`$. A rising maximum changes the scale of all old contributions.
- For new tile scores $`T`$, use $`m' = \max(m,\max T)`$, $`a = \exp(m-m')`$, $`\ell' = a\ell + \sum_j \exp(T_j-m')`$ and $`u' = au + \sum_j \exp(T_j-m')v_j`$. Normalize once at the end.
- Keep the query tile and row state while streaming key/value tiles. Accumulate reductions and weighted outputs in `tl.float32`; record dot-product precision and casts separately from output dtype.
- For finite inputs, compare with a dense double-precision reference using absolute and relative error. Handle empty tiles explicitly. Define all-masked rows as zero output and negative-infinite logsumexp, or reject them; reject NaN and infinite unmasked logits unless you implement another policy.

**Reproduce:** Without the source, merge two tiles with logits `torch.tensor([0., 1., 2., 3.], dtype=torch.float64)` and scalar values `torch.tensor([1., 2., 3., 4.], dtype=torch.float64)`, split after the second entry. In PyTorch 2.14.1 the weighted output is approximately 3.492652734585769. Then implement query/key tiling for seed 0 standard-normal inputs of shapes 2 by 17 by 7 and 2 by 19 by 7, with scale $`1/\sqrt{7}`$. Both 4 by 5 and 8 by 8 tiles must match the double-precision dense reference within `rtol=1e-12, atol=1e-12` on CPU.

**Traps**

- Rescaling the denominator but leaving the old weighted numerator unchanged. A later larger maximum then changes the answer.
- Padding keys with zero scores. They still receive probability mass; invalid keys must contribute neither to the normalizer nor the numerator.
- Evaluating a difference of two negative infinities for an empty tile. Branch or use safe neutral-state handling rather than letting NaNs enter the recurrence.

**Practice**

- [CS336 Assignment 2: `flash_forward` (a) and (b)](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/tests/test_attention.py) - Connect both attention classes through `tests/adapters.py`; run `pytest tests/test_attention.py -k "test_flash_forward_pass_pytorch or test_flash_forward_pass_triton[False]"` now, and the full `-k test_flash_forward_pass` after adding causal support in the next unit. First pass the PyTorch case and the noncausal Triton case. The public inputs use batch size 4, sequence length 128 and head width 64, and compare output and saved logsumexp with `rtol=1e-2, atol=1e-2`. They do not check tails or extremes. Add those in `kernellab`; do not reuse the tiled algorithm as its own oracle.

**Stop when:** You derive the two-state merge, pass both noncausal forward tests, and your own partial-tile and extreme-finite tests pass a justified error budget.

<details>
<summary>Self-test</summary>

1. Why can you postpone normalization until the final tile?
   - The numerator and denominator share the same running exponential scale. Their ratio is the normalized weighted sum over all keys processed so far.
2. Is merging tile states associative?
   - For finite logits it is associative in exact real arithmetic: each state summarizes the same weighted exponential sums. Floating-point merge order can change rounding.
3. Does subtracting the maximum solve every extreme-value case?
   - No. It controls exponential overflow for finite scores, but cannot repair overflow in the dot product or define softmax of an all-masked row. Those need separate contracts.

</details>

#### U3. Causal and padding masks and MHA, GQA and MQA grouping

**About 5 h** · **Target:** Implement

Topics: Causal, padding and arbitrary mask boundaries; MHA, GQA and MQA head grouping and data reuse

A fast attention kernel with the wrong mask or head map computes a different model. These bugs often survive square, unpadded tests.

**You can now**

- Implement causal, padding and explicit allowed-entry masks using logical token positions.
- Map query heads to shared KV heads without materializing repeated keys and values.
- Diagnose diagonal-tile, mask-polarity and rectangular decode errors.

**Study**

1. [FlashAttention-2 mask and head-grouping discussion](https://arxiv.org/abs/2307.08691v1) (FlashAttention-2) - Causal masking (p. 6) and Multi-query attention and grouped-query attention (p. 7), unnumbered paragraphs within Section 3.1. Depth: Correct the reversed inequality in Causal masking item 2: a fully allowed tile has every key position no greater than every query position. The rendered v1 page says the opposite.
2. [PyTorch 2.14 SDPA mask and GQA contract](https://docs.pytorch.org/docs/2.14/generated/torch.nn.functional.scaled_dot_product_attention.html) (PyTorch SDPA contracts and integration tutorial) - Equivalent implementation, boolean mask note, GQA constraints, and parameters `attn_mask`, `is_causal` and `enable_gqa`.
3. [FlashInfer packed arbitrary masks](https://github.com/flashinfer-ai/flashinfer/blob/f2794d5890121e23c032520b57c50f9ea145437d/docs/tutorials/kv_layout.rst) (FlashInfer) - Commit f2794d5: Mask Layout (2D Ragged Tensor), through the bit-packing description. Depth: Use the layout description, not its stale `begin_forward` API example. The pinned implementation uses `plan` and `run`.

**Focus**

- Build one allowed-entry predicate from query validity, key validity, request identity, causal positions and any custom mask. Apply it before the maximum and exponential reductions.
- For aligned square self-attention, allowed keys satisfy $`j \le i`$. For a suffix query block with past length $`p`$, the rule is $`j \le p+i`$. Do not infer absolute positions from a tile-local index.
- For divisible head counts, group size is $`g = H_q/H_{kv}`$ and KV head is $`\lfloor h_q/g\rfloor`$. MHA has $`g = 1`$; MQA has one KV head. Cache storage falls with KV heads, but query-head arithmetic remains.
- In SDPA, a boolean `True` means allowed. Its rectangular `is_causal=True` uses upper-left alignment, not automatically the suffix alignment needed by cached decode. Use an explicit mask with `is_causal=False` for the latter.

**Reproduce:** Closed-book, implement a CPU reference for four query heads, two KV heads, two suffix queries and five cached keys, all with width 8. Use seed 0 standard-normal `torch.float64` inputs and query positions 3 and 4. Map heads as `[0, 0, 1, 1]`, mask keys after each query position, and compare with PyTorch 2.14.1 SDPA using `attn_mask` and `enable_gqa=True` at `rtol=1e-12, atol=1e-12`. Change one future value and show that the earlier query's output is unchanged.

**Traps**

- Treating zero-padded keys as masked. Zero logits still receive probability mass, and padded queries also need an output policy.
- Skipping diagonal masking or using strict inequality. A token is allowed to attend to itself in ordinary causal self-attention.
- Using the handout's finite sentinel `-1e6` as a universal mask. It is adequate for its random tests, not arbitrary logits; use negative infinity and explicit all-masked handling.

**Practice**

- [TensorTonic: Causal Grouped-Query Attention](https://www.tensortonic.com/problems/cs336-l03-causal-grouped-query-attention) - Implement `causal_gqa` without repeating key or value heads: query head $`h`$ uses KV head $`\lfloor h/G\rfloor`$, with a causal mask over aligned positions; pass the single-head, multi-query and two-group public cases. A free CPU reference problem. Pass it before the GPU kernel, then add your own suffix-position and all-masked cases, which it does not test.
- [LeetGPU 53: Causal Self-Attention](https://github.com/AlphaGPU/leetgpu-challenges/blob/9c9dbe55e8d6124f42f0de9b6696290cbcd9670e/challenges/hard/53_casual_attention/challenge.py) - `reference_impl`, example and four functional cases; preserve the challenge's `solve` signature. Run equivalent generated cases and reference comparisons in your own local harness, as in challenge 6; the remote helper is not a local grader. Then complete CS336 `flash_forward` (c) and pass both `is_causal` settings of `test_flash_forward_pass_triton`. The section mini-project covers GQA, padding, arbitrary masks, suffix positions and all-masked rows; the public challenge does not.

**Stop when:** The TensorTonic GQA cases, challenge 53 and both CS336 Triton forward settings pass, and your own GQA, suffix-mask, padding and all-masked tests demonstrate the declared semantics.

<details>
<summary>Self-test</summary>

1. When can a causal tile be skipped completely?
   - When its smallest valid key position is greater than its largest valid query position. A fully allowed tile has its largest key position no greater than its smallest query position. Other tiles need elementwise masks.
2. Does four query heads sharing two KV heads halve all attention FLOPs?
   - No. Each query head still has its own scores and weighted output. KV-cache capacity is halved relative to four KV heads; traffic savings depend on reuse.
3. Why is `is_causal=True` dangerous for a one-row cached-decode query in SDPA?
   - Upper-left alignment permits only the first key for that row. If the query is the newest token and all cached keys are valid past tokens, it should attend to the entire cache instead.

</details>

#### U4. FlashAttention IO complexity and FlashAttention-2 work partitioning

**About 4 h** · **Target:** Derive

Topics: FlashAttention IO complexity and memory hierarchy assumptions; FlashAttention-2 work partitioning and occupancy

IO-aware attention is an algorithm plus a schedule. The second paper improves utilization without making dense attention a different mathematical operation.

**You can now**

- Derive the FlashAttention IO bound under its stated two-level memory assumptions.
- Explain query-block parallelism and split-query warp ownership in FlashAttention-2.
- Predict tile resource limits and distinguish grid parallelism from resident occupancy.

**Study**

1. [FlashAttention IO analysis, arXiv:2205.14135v2](https://arxiv.org/abs/2205.14135v2) (FlashAttention) - Section 3.1, Algorithm 1; Section 3.2, Theorem 2 and Proposition 3; Appendix C, Proof of Theorem 2 (pp. 23 to 24). Depth: Skip block-sparse attention. Keep the scope of Proposition 3: it rules out an asymptotic improvement for every memory size in the stated range, not optimality at each fixed size.
2. [FlashAttention-2 schedule, arXiv:2307.08691v1](https://arxiv.org/abs/2307.08691v1) (FlashAttention-2) - Sections 3.1.1, 3.2 and 3.3; Algorithm 1 and Figures 2 and 3 (pp. 5 to 9). Depth: Algorithm 1 line 10 on the rendered v1 page incorrectly inverts the exponential rescaling. Multiply the old numerator by $`\exp(m_{\text{old}}-m_{\text{new}})`$, without an inverse. Use CS336 Algorithm 1 for implementation. Stop before Section 4's hardware-specific results.

**Focus**

- In the original square-attention model, $`M`$ is fast-memory capacity in elements and $`d \le M \le Nd`$. Key/value tiles permit $`\Theta(Nd/M)`$ passes over query/output state, giving $`\Theta(N^2d^2/M)`$ slow-memory element accesses.
- Standard materialization costs $`\Theta(Nd+N^2)`$ accesses in this model. Convert elements to bytes using each buffer's dtype; do not insert a shared-memory byte count directly for $`M`$. At fixed $`M`$ and $`d`$, the FlashAttention IO expression is still quadratic in $`N`$.
- FlashAttention-2 assigns independent query blocks to thread blocks and keeps their state on chip. Within a block, split-query warps own different output rows, avoiding the split-key partial-output combination described in Figure 3.
- A tile needs query, key, value, score and output storage, row statistics and compiler temporaries. Larger tiles can reduce reloads but increase registers, spills and shared memory. More blocks in the grid do not guarantee more resident warps.

**Reproduce:** Closed-book, derive the IO expression by counting key/value tiles and query/output passes. Draw original key-outer and FlashAttention-2 query-outer schedules, marking every slow-memory read/write and the owner of each output row. For square query tiles of 64 rows with sequence length 1024, batch size 1 and eight heads, derive 128 forward thread blocks. Explain why this grid count is not an occupancy measurement.

**Traps**

- Reading 'exact attention' as bitwise equality. The algorithm avoids sparse or low-rank approximation; floating-point order and precision still change outputs.
- Treating the IO theorem as a latency prediction. It omits launch overhead, cache hierarchy, exponentials and hardware scheduling.
- Confusing split-key warp partitioning with decode's split-KV across thread blocks. They split related dimensions but have different owners, workspaces and merge costs.

**Practice**

- The section mini-project covers this: the `kernellab` attention IO ledger, schedule diagrams, tile resource budget and prediction checked against timings and compiled resource reports.

**Stop when:** You derive the IO bound with its assumptions, explain both ownership diagrams, and identify a resource constraint that prevents unlimited tile growth.

<details>
<summary>Self-test</summary>

1. Why does increasing fast-memory capacity lower the modeled IO?
   - Larger key/value tiles fit, so fewer outer tiles require fewer passes over query/output state. This says nothing by itself about the best resident tile on real hardware.
2. What must split-key workers combine that split-query workers need not combine?
   - Contributions to the same output rows. Split-query workers own different rows; split-key workers own different pieces of each row's reduction.
3. Why might extra query blocks fail to help one-row decode?
   - There is only one query row per head, so query tiling creates no substantial new parallelism. Splitting the KV sequence can create work, but needs a stable state merge and extra workspace.

</details>

#### U5. Backward attention state and recomputation

**About 5 h** · **Target:** Derive + Implement

Topics: Backward attention state and recomputation

This optional unit connects inference-style tiling to training. Recomputing scores can save memory, but correctness depends on preserving the forward scale and mask.

**You can now**

- Derive attention input gradients from the rowwise softmax Jacobian.
- Reconstruct probabilities from saved logsumexp rather than a saved probability matrix.
- Implement the optional backward path and check masks, scale and gradient accumulation ownership.

**Study**

1. [FlashAttention backward derivation, arXiv:2205.14135v2](https://arxiv.org/abs/2205.14135v2) (FlashAttention) - Appendix B.2, Memory-efficient backward pass, and Appendix B.4, Algorithms 3 and 4 (pp. 18 to 21). Depth: Use the no-dropout case. Defer random-mask regeneration and a fused GPU backward kernel.
2. [CS336 backward with recomputation](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/cs336_assignment2_systems.pdf) (CS336 Assignment 2 - Section 4 FlashAttention-2 in Triton) - Section 4.2.2, Backward pass with recomputation, equations 13 to 19 (p. 24), and problem `flash_backward` (p. 28). Depth: Implement the requested PyTorch backward and compile it. Stop before optional Section 4.2.3. A dense recomputed backward is a learning step, not a memory-efficient tiled backward.

**Focus**

- With scaled and masked scores $`S`$, save $`L_i = \log\sum_j\exp(S_{ij})`$. Reconstruct allowed probabilities as $`P_{ij} = \exp(S_{ij}-L_i)`$. Logarithm and exponential bases must agree.
- For output cotangent $`G`$, compute $`\mathrm{d}P = GV^\top`$, $`D_i = \sum_a G_{ia}O_{ia}`$ and $`\mathrm{d}S_{ij} = P_{ij}(\mathrm{d}P_{ij}-D_i)`$. Then $`\mathrm{d}V = P^\top G`$, $`\mathrm{d}Q = \mathrm{d}S K/\sqrt{d}`$ and $`\mathrm{d}K = \mathrm{d}S^\top Q/\sqrt{d}`$.
- Saving inputs, output and one statistic per query row avoids saved quadratic probabilities. A dense backward may still allocate quadratic temporary scores and probabilities; tiled recomputation is needed to remove that peak workspace.
- Query-block owners can accumulate query gradients, while key-block owners accumulate key/value gradients. Shared gradient destinations require a reduction or atomics; GQA also sums key/value gradients across query heads in each group.

**Reproduce:** From a blank file, implement the no-dropout gradient equations for seed 0 standard-normal `torch.float64` inputs with batch size 2, 17 queries, 19 keys and width 7, and a random output cotangent generated after those inputs. Compare all three gradients against dense PyTorch 2.14.1 autograd on CPU with `rtol=1e-12, atol=1e-12`. Then add causal masking using absolute positions and confirm masked probabilities and their score gradients are zero.

**Traps**

- Dropping the score scale in query and key gradients. The softmax score derivative is not yet the derivative of the unscaled dot product.
- Using tile-local logsumexp instead of the full row's saved statistic. Reconstructed tile probabilities then normalize independently.
- Advertising the compiled dense backward as FlashAttention's tiled memory guarantee. Compilation alone does not prove which quadratic temporaries disappear.

**Practice**

- [CS336 Assignment 2: `flash_backward`](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/tests/test_attention.py) - `test_flash_backward_pytorch` and both `is_causal` settings of `test_flash_backward_triton`; run `pytest tests/test_attention.py -k test_flash_backward`. Use the adapter name `get_flashattention_autograd_function_triton`; the forward handout abbreviates it incorrectly. The public tests check three input gradients on fixed 128 by 128 attention, not peak memory or GQA. Add double-precision small-case checks and mask regressions in `kernellab`.

**Stop when:** All public backward cases pass, your independent small-case gradient checks pass, and you distinguish saved-state memory from backward peak workspace.

<details>
<summary>Self-test</summary>

1. Why can the row correction be computed from output and its gradient?
   - Expanding the output as a probability-weighted sum of values shows that its dot product with the output cotangent equals the probability-weighted sum of probability cotangents. It is one scalar per query row.
2. Must recomputation make backward slower?
   - No. It adds arithmetic but can remove expensive memory movement. Whether it wins depends on hardware, shape and the actual backward schedule.
3. What happens to a shared KV head's gradients under GQA?
   - Its key and value gradients are sums of contributions from every query head that uses it, not just one head's contribution.

</details>

#### U6. Variable-length, paged and decode attention

**About 5 h** · **Target:** Implement

Topics: Variable-length and ragged attention; Paged and decode attention address mapping

Serving batches contain different lengths and noncontiguous cache pages. Attention must preserve request and token identity while changing storage.

**You can now**

- Implement request-local ragged indexing and logical-token to physical-page translation.
- Build a reduced paged decode path that matches contiguous attention.
- Explain when split-KV parallelism needs a stable merge and extra workspace.

**Study**

1. [FlashInfer ragged and paged layouts](https://github.com/flashinfer-ai/flashinfer/blob/f2794d5890121e23c032520b57c50f9ea145437d/docs/tutorials/kv_layout.rst) (FlashInfer) - Commit f2794d5: Layout: NHD/HND, Ragged Tensor and Page Table Layout, plus the FAQ on cache ownership. Depth: Skip MLA and cascade layouts. Read the data contracts rather than copying older API examples. Empty requests need your own policy; the documented last-page rule assumes at least one page.
2. [Attention states and recursive attention](https://github.com/flashinfer-ai/flashinfer/blob/f2794d5890121e23c032520b57c50f9ea145437d/docs/tutorials/recursive_attention.rst) (FlashInfer) - Commit f2794d5: attention-state definition and binary/n-ary merge equations; Applications, KV Sequence Parallelism. Depth: Apply the merge equations only to disjoint token subsets. Skip shared-prefix performance claims. Use maximum subtraction in the merge, as the text notes but its displayed expression omits.
3. [Paged decode planning and execution contract](https://github.com/flashinfer-ai/flashinfer/blob/f2794d5890121e23c032520b57c50f9ea145437d/flashinfer/decode.py) (FlashInfer) - Commit f2794d5: `BatchDecodeWithPagedKVCacheWrapper` class example, constructor and `plan`/`run` docstrings. Depth: Trace one supported backend's shape, page-table and workspace arguments. Do not implement every backend or assume Hopper/Blackwell paths work on Ampere.

**Focus**

- Ragged data uses prefix offsets; each request has its own query and KV range. A flat index is not a logical token position, and neighboring requests must never attend to each other.
- With page size $`P`$, logical token $`t`$ uses page-table entry $`\lfloor t/P\rfloor`$ and slot $`t \bmod P`$. The page-table entry gives the physical page; it need not equal the logical page number.
- For a nonempty request with $`n_p`$ pages and last-page occupancy $`r`$, valid length is $`(n_p-1)P+r`$, with $`1 \le r \le P`$. Read only valid slots, even if stale data occupies the rest.
- Split-KV decode produces independent states over disjoint key ranges. Merge normalizers and weighted outputs, not equally weighted partial outputs. Extra launches and partial-state workspace can outweigh the added parallelism.

**Reproduce:** From memory, translate a seven-token request with page size 4 and physical page list `[3, 1]`. Its last-page occupancy is 3; token 6 maps to page 1, slot 2. Build a CPU gather oracle, permute the physical allocation while preserving the page table, and verify unchanged dense decode output. Then implement the same mapping in a bounded CUDA or Triton decode kernel with odd lengths and partial pages.

**Traps**

- Using allocated page capacity as sequence length. Unused slots are not keys and may contain another request's old data.
- Averaging split outputs. Each output is already normalized by a different partition's mass; their logsumexp statistics set the merge weights.
- Counting the same prefix in two split states. Merge algebra represents a disjoint partition; overlap double-counts those keys.

**Practice**

- [TensorTonic: Decode Attention with a KV Cache](https://www.tensortonic.com/problems/cs336-l10-kv-cache-decode-step) - Implement `kv_cache_decode_step`: append the new key and value at position $`S`$, attend each query head through its group's KV head over all $`S+1`$ positions, and return the extended caches; pass the existing-cache, uniform two-position and shared-KV-head public cases. Its caches are contiguous. The section mini-project covers the paged path: a `kernellab` ragged/paged decode kernel, a contiguous gather oracle, page-permutation, request-isolation and split-state tests.

**Stop when:** Your reduced decode kernel matches the independent contiguous oracle for permuted pages, unequal request lengths, partial last pages and the chosen empty-request policy.

<details>
<summary>Self-test</summary>

1. If the last page is full, is its occupancy zero?
   - No. It equals the page size. Zero does not encode a full page under the documented nonempty-request contract.
2. Should physical page order affect the attention answer?
   - No, if the page table still maps the same logical tokens and values. Changing logical token positions or masks would affect it. Floating-point reduction order may introduce tolerated rounding differences.
3. Why can splitting the KV sequence help decode when query tiling cannot?
   - It creates more independent thread blocks from a long key sequence despite having only one query row. A second reduction combines their attention states, so the gain must exceed that overhead.

</details>

#### U7. Key-value append, gather, layout conversion and quantized loads

**About 5 h** · **Target:** Implement

Topics: Key-value append, gather, layout conversion and cache writes; Quantized key-value loads and dequantization

Attention can be correct while reading the wrong generation of a cache slot. Cache updates need position, allocation, stream and scale contracts of their own.

**You can now**

- Implement KV append, gather and layout conversion with explicit slot ownership.
- Validate cache writes across page boundaries and preserve untouched entries.
- Explain the optional quantized-load contract and check reconstruction error separately from indexing correctness.

**Study**

1. [FlashInfer page append and logical positions](https://github.com/flashinfer-ai/flashinfer/blob/f2794d5890121e23c032520b57c50f9ea145437d/flashinfer/page.py) (FlashInfer) - Commit f2794d5: `get_batch_indices_positions`, `get_seq_lens` and `append_paged_kv_cache`, including its Example and Note. Depth: Trace the ordinary append operation. Skip MLA and NVFP4 append paths. The caller allocates pages and updates final lengths before append; the append function is not an allocator.
2. [FlashInfer layouts and optional quantized decode scales](https://github.com/flashinfer-ai/flashinfer/blob/f2794d5890121e23c032520b57c50f9ea145437d/flashinfer/decode.py) (FlashInfer) - Commit f2794d5: `single_decode_with_kv_cache`, `kv_layout`, `q_scale`, `k_scale`, `v_scale` docstrings and the scale applications in its implementation. Depth: Inspect FP8 scale semantics, not a promise of FP8 acceleration on your GPU. Use a small software dequantization reference for the optional path; no Blackwell-only packed format is required.

**Focus**

- Append maps each new row to a request and absolute token position. Check allocation, page capacity and bounds before launch. Two writers must not own the same destination slot.
- For each separate cache tensor, `NHD` orders page, token, head, channel; `HND` orders page, head, token, channel. A changed view of strides is not a physical layout conversion. Test gather before and after the actual conversion.
- Initialize unused slots to sentinels, append known rows, gather valid tokens and check that all other slots remain unchanged. Preserve stream ordering and keep storage alive until consumers finish.
- Optional quantized loads must specify format, reconstruction scale and granularity for keys and values. Per-tensor key scale can enter score scaling and per-tensor value scale can enter output scaling; token- or group-varying scales cannot generally be moved outside those reductions.

**Reproduce:** Implement a small append/gather round trip with separate key/value caches, page size 4, two heads of width 3, and a seven-token request on physical pages `[3, 1]`. Fill unused storage with `-99.0`; append increasing integer-valued rows and verify exact gathered values and untouched slots. Convert `NHD` storage to `HND` and repeat. For optional symmetric integer quantization, reconstruct finite unclipped values as $`\hat{x} = s\operatorname{round}(x/s)`$ with positive scale $`s`$, and check the bound $`\lvert\hat{x}-x\rvert \le s/2`$ up to rounding tolerance.

**Traps**

- Appending with old last-page lengths or unallocated next pages. The final page metadata must already describe the destination capacity and length.
- Overwriting shared prefix pages. A serving allocator needs copy-on-write or an ownership rule before mutable append; the kernel cannot infer that from addresses.
- Applying the quantization error bound to clipped outliers. Saturation introduces additional error, and small reconstruction error does not by itself bound attention-output or task-quality error.

**Practice**

- The section mini-project covers this: `kernellab` KV append/gather and layout-conversion kernels, boundary and sentinel tests, stream-order checks and optional dequantized loads against an independent reference.

**Stop when:** Append, gather and conversion preserve token identity across partial and full pages, with untouched-slot and bounds checks; any optional quantized path reports clipping and output error separately.

<details>
<summary>Self-test</summary>

1. How can an append test detect a write that does not affect today's output?
   - Check sentinels in every unowned slot. Otherwise a stray write can remain invisible until that slot is reused or read later.
2. Can one output scale represent independently scaled value tokens?
   - Not in general. Each token contributes with its own scale inside the weighted sum. Only a common value scale can be factored out.
3. Does changing the layout label move the cache data?
   - No. The label tells the consumer how to interpret storage. A physical conversion must rearrange data or produce correctly strided storage that the consumer supports.

</details>

#### U8. Stable RMSNorm and LayerNorm, and RoPE fusion

**About 6 h** · **Target:** Implement

Topics: Stable RMSNorm and LayerNorm reduction and fusion; Rotary position embedding layout and fusion

Normalization and rotation are small kernels with strict numerical and layout contracts. Fusion is useful only when it preserves their order, reduction domain and positions.

**You can now**

- Implement stable forward RMSNorm and LayerNorm with explicit $`\epsilon`$, reduction width and accumulation dtype.
- Implement half-split and interleaved RoPE with correct request positions.
- Choose a legal norm/RoPE fusion boundary and validate it against separate operations.

**Study**

1. [Triton 3.8.0 LayerNorm forward](https://github.com/triton-lang/triton/blob/v3.8.0/python/tutorials/05-layer-norm.py) (Triton 3.8.0 Layer Normalization) - Motivations, `_layer_norm_fwd_fused`, and `LayerNorm.forward` (the autograd wrapper before `test_layer_norm`). Depth: Stop at the forward implementation and supported-width guard. Skip backward, Apex and the automatic benchmark sweep. Do not inherit the tutorial's unmeasured 'faster' claim.
2. [FlashInfer RMSNorm interface](https://github.com/flashinfer-ai/flashinfer/blob/f2794d5890121e23c032520b57c50f9ea145437d/flashinfer/norm/__init__.py) (FlashInfer) - Commit f2794d5: `rmsnorm` docstring and `_rmsnorm_impl` dispatch. Depth: Read ordinary normalization, not quantized or architecture-specific variants. Pass $`\epsilon`$ explicitly when comparing libraries.
3. [FlashInfer RoPE positions and pairing layouts](https://github.com/flashinfer-ai/flashinfer/blob/f2794d5890121e23c032520b57c50f9ea145437d/flashinfer/rope.py) (FlashInfer) - Commit f2794d5: `apply_rope` docstring, especially `indptr`, `offsets`, `rotary_dim` and `interleave`.

**Focus**

- RMSNorm uses $`x/\sqrt{\operatorname{mean}(x^2)+\epsilon}`$ before the learned scale. LayerNorm subtracts the mean and uses population variance, not the sample-variance denominator. Neither is a substitute for the other.
- Promote low-precision inputs before squaring and reducing. Centered variance avoids subtracting nearly equal raw moments. Mask padded lanes out of both reductions and divide by the valid width, not the padded tile width.
- A RoPE pair maps $`(a,b)`$ to $`(a\cos\theta-b\sin\theta, a\sin\theta+b\cos\theta)`$. Half-split pairs corresponding entries from two halves; interleaved pairs adjacent channels. Position offsets and frequency conventions are model parameters.
- A fused head-norm/RoPE kernel must finish the whole head reduction before rotating and storing pairs. Do not move a model's hidden-width pre-norm through its projection, or reorder learned channel scales and rotation. Test fusion against the exact original operation order.

**Reproduce:** Write CPU double-precision references for RMSNorm, centered LayerNorm and half-split RoPE. With input `[3., 3., 3., 3.]`, unit weights, zero LayerNorm bias and `eps=1e-5`, LayerNorm returns zero while RMSNorm does not. For input `[1., 2., 3., 4.]`, rotate half-split pairs by angles 0.3 and 0.7 radians using genuine sine/cosine tables; squared norm is preserved within `rtol=1e-12, atol=1e-12` in PyTorch 2.14.1. Implement the forward GPU kernels and compare fused head-norm then RoPE with the separate reference order.

**Traps**

- Using dtype-dependent default $`\epsilon`$ in one baseline and a fixed value in another. Pass the same explicit $`\epsilon`$ and affine parameters.
- Assuming the challenge's randomly generated `cos` and `sin` tables represent unit rotations. Its tests check the algebraic transform, not trigonometric identity or position generation.
- Squaring large finite values without a range policy. Float32 promotion prevents many half-precision overflows, not every possible float32 overflow; test or reject inputs outside your supported numerical range.

**Practice**

- [LeetGPU 61: Rotary Positional Embedding](https://github.com/AlphaGPU/leetgpu-challenges/blob/9c9dbe55e8d6124f42f0de9b6696290cbcd9670e/challenges/medium/61_rope_embedding/challenge.py) - `reference_impl`, `generate_example_test` and all six cases in `generate_functional_test`. Use your local harness and preserve `solve` as in challenge 6. These are half-split even-width cases with supplied tables, including zero and mixed values. Skip the million-row performance case on a small GPU. The section mini-project covers forward norms, generated positions, interleaved pairing, partial rotary width and fused head-norm/RoPE checks. This is the first of the pool's two selected transformer challenges.

**Stop when:** Challenge 61 passes, both norm kernels match references with explicit $`\epsilon`$ on odd-width and constant rows, and your legal fused path matches the separate operation order across positions and layouts.

<details>
<summary>Self-test</summary>

1. Why can padding zeros corrupt LayerNorm even though their input contribution is zero?
   - They change the denominator if counted as features. After mean subtraction their squared deviations are also nonzero unless explicitly masked.
2. Does norm preservation prove that a RoPE implementation uses the correct layout?
   - No. Rotating the wrong pairs can still preserve norm. Compare the model's pairing layout, frequencies and absolute positions with an independent reference.
3. Can arbitrary learned channel scales commute with RoPE?
   - No. A pair's two scales generally differ, so scaling before rotation and scaling after rotation produce different vectors. Preserve the prescribed order.

</details>

#### U9. SwiGLU MLP and epilogue fusion boundaries

**About 6 h** · **Target:** Implement

Topics: SwiGLU and MLP fusion boundaries; Residual, norm, activation and scale epilogue fusion

Pointwise fusion can remove launches and intermediate traffic. Fusing a complete MLP or normalization into a GEMM is harder because consumers need completed reductions and different data reuse.

**You can now**

- Implement a gated MLP path with the correct projection orientations and activation order.
- Fuse a bounded activation or residual epilogue without changing required outputs or dtype boundaries.
- Derive removed intermediate traffic and explain reduction and resource limits on larger fusion groups.

**Study**

1. [LeetGPU 84: SwiGLU MLP Block specification](https://github.com/AlphaGPU/leetgpu-challenges/blob/9c9dbe55e8d6124f42f0de9b6696290cbcd9670e/challenges/medium/84_swiglu_mlp_block/challenge.py) (LeetGPU - Attention and Transformer Challenges) - Commit 9c9dbe5: `reference_impl`, `get_solve_signature` and `generate_example_test`; inspect `generate_functional_test` before implementing.
2. [FlashInfer residual/RMSNorm mutation contract](https://github.com/flashinfer-ai/flashinfer/blob/f2794d5890121e23c032520b57c50f9ea145437d/flashinfer/norm/__init__.py) (FlashInfer) - Commit f2794d5: `fused_add_rmsnorm` docstring, Step 1, Step 2 and parameter contract. Depth: Read the ordinary fused operation only. Do not enable architecture-specific launch mechanisms or quantized variants for this unit.

**Focus**

- The challenge computes $`A = XW_g`$, $`U = XW_u`$, $`H = \operatorname{SiLU}(A) \odot U`$ and $`Y = HW_d`$. Its weights use input-by-output orientation, unlike the stored weight of PyTorch's linear module.
- A fused pointwise SiLU/multiply kernel can read the two projection outputs and write one hidden tensor. A projection epilogue can remove more traffic only if the needed gate and up results are available to the same owner after their reductions finish.
- Residual addition, affine scaling and activation are pointwise after a completed GEMM result. RMSNorm and LayerNorm require a row reduction across all normalized features; one output tile is generally not the entire row.
- FlashInfer's fused residual/RMSNorm updates the residual buffer to the sum and the input buffer to its normalized version. Preserve both outputs if the model needs them. Include saved residual writes and changed rounding points in a fusion comparison.

**Reproduce:** Closed-book, implement challenge 84's two-row basis-vector example in double precision. The first two columns of both input-by-output projection weights are identity and the other two are zero; the down weight returns the first two hidden features. The output is diagonal with value $`\operatorname{sigmoid}(1)`$ and zero off-diagonal entries. Then draw separate, pointwise-fused and projection-epilogue dataflows, counting each removed intermediate write/read at its actual dtype and naming every required output that remains.

**Traps**

- Computing SiLU of the elementwise gate/up product instead of multiplying the activated gate by the up projection. These are different functions.
- Eliminating a residual write even though the next layer needs the unnormalized residual stream. A removed output is not a legitimate bandwidth saving.
- Assuming fewer launches guarantee a faster MLP. Fusion may duplicate GEMM work, spill registers or reduce occupancy, and the down projection still needs its full reduction.

**Practice**

- [LeetGPU 84: SwiGLU MLP Block](https://github.com/AlphaGPU/leetgpu-challenges/blob/9c9dbe55e8d6124f42f0de9b6696290cbcd9670e/challenges/medium/84_swiglu_mlp_block/challenge.py) - Example and ten `generate_functional_test` cases, using the challenge's `solve` signature and tolerances. Run equivalent public cases in your local harness; reuse your earlier validated GEMM kernels and add one fused SiLU/multiply kernel. Cases include zero input, single rows and non-power-of-two dimensions. Skip the large performance case initially; the functional cases fit a small GPU. Keep a library/compiled MLP as the baseline. The section mini-project covers a residual/scale epilogue and residual/norm mutation tests. This is the second selected transformer challenge; do not add the other candidates as extra required practice.

**Stop when:** All challenge 84 functional cases pass, one bounded fusion matches its independent reference, and your traffic diagram explains why a full-row norm cannot be treated as a pointwise epilogue.

<details>
<summary>Self-test</summary>

1. Why can a pointwise residual epilogue be easier than a norm epilogue?
   - Each completed output element needs only its corresponding residual. Norm needs statistics across the entire normalization row, which may span several output tiles.
2. Does SwiGLU with zero input return zero here?
   - Yes. These projections have no bias, so both branches are zero and the hidden tensor and down projection remain zero. Biased projections would require a different answer.
3. Why can fused and unfused outputs differ even with the same mathematical order?
   - The unfused path may round intermediate tensors to their storage dtype. A fused path can retain a higher-precision value until the final store; compare against an explicit numerical contract, not bitwise equality.

</details>

#### U10. Attention baselines, shape matrices, end-to-end translation and losing regimes

**About 6 h** · **Target:** Measure

Topics: Compiler, framework and production attention-library baselines; Sequence, head, batch, mask, dtype and alignment matrix; Kernel gain translated to TTFT, TPOT, memory and goodput; Small, decode-heavy, irregular and unsupported losing regimes

Beating materialized attention does not establish a useful optimization. A change must survive strong fused baselines and retain correctness at the full workload boundary.

**You can now**

- Benchmark prefill and decode separately against eager, compiled and supported production attention baselines.
- Explain residuals across a shape/dtype/mask/layout matrix and preserve losing or unsupported regimes.
- Translate a local change into full-block and request-level latency, memory and goodput evidence without confusing those boundaries.

**Study**

1. [CS336 compiled and custom attention benchmarks](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/cs336_assignment2_systems.pdf) (CS336 Assignment 2 - Section 4 FlashAttention-2 in Triton) - Problems `pytorch_attention` (p. 16), `torch_compile` (pp. 16 to 17), and `flash_benchmarking` (p. 28). Depth: Replace the B200 sweep with batch size 1, widths 32 and 64, and sequence lengths 128, 256, 512 and 1024 on a 6 GB GPU. On a 24 GB GPU, grow the sequence range only after budgeting reference intermediates and backward workspace. Keep allocation failures in the report rather than forcing them.
2. [PyTorch SDPA dispatch and full-module comparison](https://docs.pytorch.org/tutorials/intermediate/scaled_dot_product_attention_tutorial.html) (PyTorch SDPA contracts and integration tutorial) - Documentation read 2026-10-13: Explicit Dispatcher Control, Hardware dependence, Causal Self Attention and Using SDPA with `torch.compile`. Depth: Shrink the tutorial's large tensors before running. Correct `CausalSelfAttention.forward`: evaluation disables dropout, not causality. Preserve `self.is_causal` in evaluation for full-sequence causal attention. Use PyTorch 2.14's API contract rather than treating the tutorial's backend list as exhaustive. Skip NestedTensor.
3. [Request latency boundaries and load patterns](https://docs.vllm.ai/en/v0.31.0/benchmarking/cli/#understanding-the-latency-metrics) (vLLM serving latency and goodput definitions) - vLLM v0.31.0: Understanding the Latency Metrics and Load Pattern Configuration. Depth: Read the metric and workload definitions only. Do not run the large-model serving examples in this unit.
4. [Goodput service-level objectives](https://docs.vllm.ai/en/v0.31.0/cli/bench/serve/) (vLLM serving latency and goodput definitions) - vLLM v0.31.0: Arguments, the descriptions of goodput service-level objectives, request rate and maximum concurrency. Depth: Use the definitions, not a required CLI run. Full production-engine integration belongs to the next section.

**Focus**

- Compare the dense correctness oracle, eager SDPA, compiled full block and a supported pinned FlashInfer path separately. Record the actual selected backend, its workspace and any fallback. Failure to support a case is not a zero-latency result.
- Start with prefill and one-row decode, then vary batch, sequence, head width, GQA ratio, causal/padding/custom masks, dtype, strides and tile alignment. Include tiny, odd-length and irregular cases; hold some shapes out from tuning.
- Warm up compilation and allocator state outside steady-state trials. Interleave variants, retain raw samples and report medians with uncertainty. Profile separate runs; use timelines and compiled resource reports to explain losses rather than infer a bottleneck from achieved bandwidth alone.
- Translate local latency using the changed critical-path share. Request TTFT includes more than prefill attention; TPOT excludes the first token and averages remaining request time. Define goodput as successful requests meeting predeclared latency objectives per unit observation time, with the same tokenizer, outputs and arrival workload.

**Reproduce:** Derive the serial fixed-workload bound $`S_{\text{end}} = 1/(1-f+f/r)`$, where $`f`$ is the baseline time share of the replaced operation and $`r`$ its local speedup, with all other work unchanged. A hypothetical 20% share and twofold local speedup give $`S_{\text{end}} = 1/0.9`$, approximately 1.111, not twofold. Then substitute measured full-block shares and compare the prediction with your bounded prefill/decode runner. Label runner TTFT/TPOT separately from HTTP endpoint metrics.

**Traps**

- Benchmarking against only an unfused dense reference. It is an oracle and explanatory baseline, not the strongest performance competitor.
- Calling a block's event duration TTFT or goodput. Request metrics need request boundaries, output validation, a workload and service-level objectives.
- Improving tokens per second by changing output length, prefix-cache state or quality. Keep those controls fixed, report cache state, and count only validated requests as successful.

**Practice**

- [CS336 Assignment 2: `flash_benchmarking`](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/cs336_assignment2_systems.pdf) - Problem `flash_benchmarking` (p. 28), using the reduced sweep above. Gate each variant on the public attention tests and your own edge tests before timing. Use only forward timings if you skipped the optional backward unit, and say so. Add eager SDPA and the compiled full-block baseline rather than only the handout's materialized PyTorch baseline. The section mini-project covers the expanded shape matrix, supported FlashInfer comparison or documented compatibility blocker, full-runner integration, request-metric translation and a retained losing regime.

**Stop when:** Your report links correctness tests, raw trials, selected backends and profiles to one full-runner comparison and one losing regime, with TTFT/TPOT and goodput boundaries stated. If no end-to-end gain survives strong baselines, mark that section gate outstanding instead of inventing a gain.

<details>
<summary>Self-test</summary>

1. Can reducing peak attention workspace increase serving capacity without reducing one request's latency?
   - Yes. It can allow a larger batch or more cached requests. That is a separate capacity experiment; it does not establish lower latency at the original fixed workload.
2. Why can mean inter-token latency differ from mean request TPOT?
   - They weight observations differently, and one streamed output can bundle several tokens. TPOT amortizes each request's post-first-token duration over its remaining tokens; inter-output gaps are separate observations.
3. A custom kernel loses on tiny decode. Is that evidence the implementation is wrong?
   - Not by itself. Launch, merge or dispatch overhead may exceed useful work. First validate correctness, then keep the losing case and choose a measured fallback.
4. What should you do if a strong baseline wins every tested regime?
   - Report the negative result and keep that baseline as dispatch. Do not claim the section's end-to-end gain gate passed; identify a narrower measured bottleneck or leave that gate outstanding.

</details>

### Mini-project: IO-aware attention with paged decode and fused transformer paths

**About 14 to 20 hours.** Implement bounded attention inside kernellab on the RTX 3050: traffic counts, tiled online softmax, causal and grouped masks, an IO ledger with a tile budget, an optional backward, a ragged and paged decode path with KV append and gather, fused norm and MLP epilogues and a baseline sweep that keeps a losing regime. All sizes fit 6 GB; FlashAttention-3 and Blackwell paths are reading only.

1. Count noncausal MHA closed-book for $`B = 1`$, eight query heads, $`L = S = 1024`$, width 64 and two-byte score, probability and key/value storage: 32 MiB for the two intermediates, 64 MiB write-read traffic and 2147483648 FLOPs for the two products, with every excluded byte category named; for decode with $`L = 1`$ one ideal key and value read is 2 MiB. Implement LeetGPU challenge 6 in the local harness against `reference_impl` with the public generators.
2. Merge two tiles with logits `[0., 1., 2., 3.]` and values `[1., 2., 3., 4.]` split after the second entry for weighted output near 3.492652734585769 in float64. Implement query and key tiling for seed 0 standard-normal inputs of shapes 2 by 17 by 7 and 2 by 19 by 7 at scale $`1/\sqrt{7}`$, with 4 by 5 and 8 by 8 tiles each matching the double-precision dense reference within stated tolerance. Gate the CS336 `flash_forward` PyTorch and noncausal Triton cases on these tests before timing.
3. Build a CPU reference for four query heads, two KV heads, two suffix queries and five cached keys of width 8 with seed 0 standard-normal float64 inputs at query positions 3 and 4, head map `[0, 0, 1, 1]`, keys masked after each query position, compared with SDPA using `attn_mask` and `enable_gqa=True` at `rtol=1e-12, atol=1e-12`. Change one future value and show the earlier query output is unchanged. Pass TensorTonic `causal_gqa`, LeetGPU challenge 53 and the CS336 causal `flash_forward` cases locally.
4. Write the attention IO ledger with schedule diagrams for key-outer and FlashAttention-2 query-outer forms, marking every slow-memory read and write and the owner of each output row, plus a tile resource budget from `cuobjdump -res-usage` and the occupancy API. For square query tiles of 64 rows at sequence 1024, batch 1 and eight heads derive 128 forward thread blocks and state why the grid count is not an occupancy measurement. Check the prediction against interleaved timings and compiled resource reports.
5. Implement no-dropout gradients from a blank file for seed 0 standard-normal float64 inputs with batch 2, 17 queries, 19 keys and width 7 and a random output cotangent, matching dense autograd at `rtol=1e-12, atol=1e-12` for all three gradients, then add causal masking with absolute positions and confirm masked probabilities and score gradients are zero. Pass the CS336 `flash_backward` PyTorch and Triton cases. Mark this step optional if only forward timings are reported, and say so.
6. Pass TensorTonic `kv_cache_decode_step` on contiguous caches, then build a ragged and paged decode path with a contiguous gather oracle: translate a seven-token request with page size 4 and physical pages `[3, 1]` (last-page occupancy 3, token 6 on page 1 slot 2), permute the physical allocation while preserving the page table for unchanged dense output, and check request isolation and split-state behavior with odd lengths and partial pages in a bounded CUDA or Triton kernel. Add KV append and gather with separate key and value caches on the same pages, `-99.0` in unused storage, increasing integer rows verified exactly with untouched slots checked, `NHD` to `HND` conversion repeated, stream-order checks kept, and optional symmetric dequantized loads as `xhat = s*round(x/s)` with positive scale checked against an independent reference.
7. Write CPU double-precision references for RMSNorm, centered LayerNorm and half-split RoPE: with input `[3., 3., 3., 3.]`, unit weights, zero bias and `eps=1e-5` LayerNorm returns zero while RMSNorm does not; with input `[1., 2., 3., 4.]` rotated by 0.3 and 0.7 radians squared norm is preserved within `rtol=1e-12, atol=1e-12`. Implement the forward GPU kernels, compare fused head-norm then RoPE against separate execution, and pass LeetGPU challenge 61 locally. Implement challenge 84 with its two-row basis-vector example giving a diagonal output with `sigmoid(1)` on the diagonal and zeros elsewhere, draw separate against pointwise-fused against projection-epilogue dataflows counting each removed intermediate write and read at its dtype, and pass its ten functional cases locally.
8. Gate every variant on the public attention tests plus edge tests before timing, then run a bounded prefill and decode sweep with eager SDPA and a compiled baseline using interleaved event trials. Derive the serial bound $`S = 1/(1-f+f/r)`$ for share $`f`$ and local speedup $`r`$: 20 percent share at twofold local speedup gives near 1.111 rather than twofold. Substitute measured full-block shares, compare the prediction with the runner, label runner TTFT and TPOT separately from endpoint metrics, and retain one small, decode-heavy or irregular losing regime.

**Deliverables**

- `kernels/cuda/` and `kernels/triton/` attention with traffic counts, tiled softmax, masks, IO ledger and tile budget, and the optional backward with gradient checks.
- The ragged and paged decode path with gather oracle, permutation and isolation tests, plus KV append, layout conversion and stream-order checks.
- Fused norm, RoPE and MLP paths with double-precision references and the baseline sweep with the serial bound and a retained losing regime.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [LeetGPU attention challenges run locally against the reference implementation](https://leetgpu.com/challenges/). Run 6 Softmax Attention, 53 Causal Attention, 61 RoPE and 84 SwiGLU MLP Block locally; keep tests beyond the hosted score.
- external-tests: [CS336 Assignment 2 attention tests](https://github.com/stanford-cs336/assignment2-systems). Run the `tests/test_attention.py` `flash_forward` and `flash_backward` cases plus `flash_benchmarking` on sizes that fit 6 GB.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Tiled correctness | Tiled softmax, causal and grouped masks and paged gather each match dense double or SDPA references at stated tolerance, future-value and permutation tests pass, and empty and partial tiles follow the written policy. | The 3.492652734585769 merge and the 128-block derivation are reproduced closed-book. |
| Fusion honesty | Fused norm, RoPE and MLP paths match separate execution within tolerance, removed traffic is counted at its dtype, and norm preservation is checked. | Dataflow diagrams name every buffer that fusion removes and one it cannot. |
| Regime evidence | Variants are gated before timing, the serial bound is applied with measured shares, runner metrics are kept apart from endpoint metrics, and a losing regime is retained with an explanation. | The report states when the library or compiler path is preferred. |

Feeds into: Capstone kernel suite and integration: attention, paged decode, KV kernels and fused paths feed the endpoint. The IO ledger and losing regimes feed the final workload-weighted report.

### Resource route

- **Primary - Paper:** [FlashAttention](https://arxiv.org/abs/2205.14135) - Read the IO-awareness argument, exact attention algorithm and complexity analysis. Derive the online state and block dataflow, then implement a reduced forward kernel or trace a trusted implementation across at least causal and noncausal cases.
- **Required - Paper:** [FlashAttention-2](https://arxiv.org/abs/2307.08691) - Study reduced non-matmul work, sequence parallelism and warp work partitioning. Compare the schedule with the first paper and predict which shapes benefit before checking measurements.
- **Required - Paper:** [Online Normalizer Calculation for Softmax](https://arxiv.org/abs/1805.02867) - Re-derive the recurrence inside tiled attention and prove rescaling correctness. Add extreme-logit, all-masked, odd-head and partial-tile tests before any performance comparison.
- **Required - Assignment:** [CS336 Assignment 2 - Section 4 FlashAttention-2 in Triton](https://github.com/stanford-cs336/assignment2-systems) - Do the weighted-sum warm-up, then `flash_forward` (a PyTorch tiled version and the Triton kernel) and `flash_backward` against `tests/test_attention.py`. Run `flash_benchmarking` on sizes that fit your GPU instead of the handout's B200 sweep.
- **Support - Practice:** [TensorTonic Language Modeling from Scratch - Blockwise Online Softmax](https://www.tensortonic.com/study-plans/language-modeling-from-scratch) - Solve it before the tiled attention kernel as a check on the rescaling recurrence.
- **Required - Practice:** [LeetGPU - Attention and Transformer Challenges](https://leetgpu.com/challenges/) - Solve 6 Softmax Attention and 12 Multi-Head Attention or 53 Causal Attention. Then choose two of 50 RMS Normalization, 54 SwiGLU, 61 RoPE, 80 Grouped Query Attention, 83 Fused Residual Add RMS Norm and 84 SwiGLU MLP Block. Keep correctness tests beyond the hosted score.
- **Support - Implementation:** [FlashInfer](https://github.com/flashinfer-ai/flashinfer) - Inspect the attention, sampling and serving-kernel interfaces. Reconstruct one dispatch path and compare its layout and workspace contracts with your reduced kernel instead of copying the optimized implementation.
- **Support - Lectures:** [GPU MODE - Attention and Fused Kernels](https://github.com/gpu-mode/lectures) - Use Lectures 12, 13, 18, 36 and 40 for FlashAttention, Ring Attention, fusion, FlashAttention-3 and FlashInfer. Reproduce one schedule or fusion idea under the stage shape matrix and a strong baseline.
- **Depth - Paper:** [FlashAttention-3](https://arxiv.org/abs/2407.08608) - Study Hopper-specific asynchronous execution and low-precision design after the portable kernel. Implement only with the required architecture, and separate algorithmic from hardware-specific gains.
- **Depth - Book:** [Modern GPU Programming for MLSys - Flash Attention 4](https://mlc.ai/modern-gpu-programming-for-mlsys/) - Read the complete Blackwell attention chapter, including two MMAs, online softmax, causal masking and GQA. Run it only on compatible sm_100a hardware with the pinned TIRx stack; otherwise use the code for architecture reconstruction.
- **Reference - Documentation:** [PyTorch SDPA contracts and integration tutorial](https://docs.pytorch.org/docs/2.14/generated/torch.nn.functional.scaled_dot_product_attention.html) - The PyTorch 2.14 SDPA API page gives mask polarity, rectangular causal alignment, GQA and backend limitations. The SDPA tutorial (https://docs.pytorch.org/tutorials/intermediate/scaled_dot_product_attention_tutorial.html, read 2026-10-13) gives Explicit Dispatcher Control, Causal Self Attention, Using SDPA with `torch.compile` and Using SDPA with `attn_bias` subclasses. Correct the tutorial's evaluation-time causal flag before integration.
- **Required - Tutorial:** [Triton 3.8.0 Layer Normalization](https://github.com/triton-lang/triton/blob/v3.8.0/python/tutorials/05-layer-norm.py) - Motivations and `_layer_norm_fwd_fused` in tutorial 05, pinned to v3.8.0. Study centered variance, float32 reductions, valid-column masks and the forward wrapper's supported-width guard. Defer backward and the benchmark sweep.
- **Reference - Documentation:** [vLLM serving latency and goodput definitions](https://docs.vllm.ai/en/v0.31.0/benchmarking/cli/#understanding-the-latency-metrics) - vLLM v0.31.0: Benchmark CLI, Understanding the Latency Metrics and Load Pattern Configuration; serving benchmark CLI, goodput service-level objectives. Use definitions to translate kernel evidence into request metrics, not as a required serving-engine installation.

### Exit checkpoint

Derive and implement or reconstruct IO-aware attention with stable online softmax, causal and edge-tile correctness, then explain prefill and decode performance across a shape matrix and show one end-to-end gain plus one losing regime.

<details>
<summary>Deliberately left for later</summary>

- Full sparse-attention and long-context algorithm research
- FlashAttention-3 or FlashAttention-4 implementation without the matching architecture
- A complete production attention library outside the active integration bottleneck

</details>

## GPU-7. Triton, CuTe and Compiler Paths

**Why:** Modern kernel work spans CUDA, tile languages, template libraries and graph compilers. This stage implements the same mechanisms through multiple abstraction levels, inspects lowering and makes autotuning, dispatch and fallback correctness explicit.

### Learn this much

- [ ] Triton blocked-program and SPMD execution model _(Required)_
- [ ] Program IDs, logical tiles and launch grids _(Required)_
- [ ] Pointer, stride, block pointer and layout arithmetic _(Required)_
- [ ] Masked loads and stores with safe boundary behavior _(Required)_
- [ ] Triton reductions and numerical order _(Required)_
- [ ] Dot operations, input precision and accumulator behavior _(Required)_
- [ ] Compile-time meta-parameters and specialization _(Required)_
- [ ] Autotune configuration, keys, pruning and cache identity _(Required)_
- [ ] Correctness-gated candidates and invalid configuration rejection _(Required)_
- [ ] Compile, autotune, cold-cache and warm-cache accounting _(Required)_
- [ ] Registers, shared memory, occupancy and generated-code inspection _(Required)_
- [ ] Interpreter, assertions, sanitizer limits and minimal reproducers _(Required)_
- [ ] Matched CUDA and Triton implementations of the same kernel _(Required)_
- [ ] Frontend, IR, lowering, LLVM, PTX and machine-code trajectory _(Required)_
- [ ] Framework graph capture, fusion and generated-kernel boundaries _(Required)_
- [ ] Graph breaks, guards, recompilation and dynamic-shape behavior _(Required)_
- [ ] Custom operator registration, stream semantics and autograd contracts _(Required)_
- [ ] CUTLASS device, kernel, collective, tiled MMA and atom hierarchy _(Required)_
- [ ] CuTe layouts, coordinates, composition and logical division _(Required)_
- [ ] Copy and MMA atoms, tiled copies and tiled MMAs _(Required)_
- [ ] Pipeline stages, barriers and producer-consumer ownership _(Required)_
- [ ] CUDA Tile IR programming model and compiler-owned tiling _(Depth)_
- [ ] Pallas, ROCm and NKI programming-model comparison _(Optional)_
- [ ] Device, dtype, shape and layout dispatch with fallback _(Required)_
- [ ] Compiler-version, generated-code and performance regression tests _(Required)_
- [ ] Compiler pass or backend extension _(Later)_

### Study units

#### U1. Triton programs, program IDs, pointers and masks

**About 4 h** · **Target:** Implement

Topics: Triton blocked-program and SPMD execution model; Program IDs, logical tiles and launch grids; Pointer, stride, block pointer and layout arithmetic; Masked loads and stores with safe boundary behavior

Every later Triton kernel reuses this mapping. A wrong program ID or an unmasked tail corrupts memory silently, so the discipline starts here.

**You can now**

- Map a 1D tensor operation to Triton program IDs, block offsets, masks and memory transactions.
- Implement a masked Triton map kernel that is correct for non-multiple shapes and matches a PyTorch reference where the arithmetic is exact.
- Explain how one Triton program maps to one CUDA thread block and how the compiler splits block work across threads.

**Study**

1. [Vector Addition: Compute Kernel](https://triton-lang.org/main/getting-started/tutorials/01-vector-add.html) (Triton Programming Guide and Tutorials) - Compute Kernel: `tl.program_id`, `tl.arange`, masked `tl.load` and `tl.store`; helper `add` with the grid function over `meta['BLOCK_SIZE']` and `BLOCK_SIZE=1024`; correctness check with `size = 98432`.
2. [Vector Addition: Benchmark](https://triton-lang.org/main/getting-started/tutorials/01-vector-add.html) (Triton Programming Guide and Tutorials) - Benchmark: `triton.testing.do_bench` with quantiles and the GB/s helper over `3 * numel * element_size` bytes. Depth: Read it as a timing pattern, not as a number to reproduce. Valid timing discipline comes from the measurement section.
3. [Triton Programming Model](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapter 14) - Chapter 14, Writing Custom Kernels with OpenAI Triton through Triton Programming Model: `tl.constexpr` block sizes, the grid function, and one program per CUDA thread block. Depth: Stop before Accessing Shared Memory in Triton. Descriptors and pipelined copies belong to the atoms unit.

**Focus**

- One Triton program handles one block. `tl.program_id(axis=0)` selects it and `tl.arange` builds its lane indices.
- `BLOCK_SIZE` is a `tl.constexpr`, so each value compiles its own specialization. The grid function reads it from `meta` so the launch grid always matches the value in use, including one an autotuner picks.
- The mask guards both loads and the store. Masked-out load lanes yield `other` and must never reach the output.
- Pointer arithmetic stays in elements (`x_ptr + offsets`), never in bytes.

**Reproduce:** Closed-book, write `add_kernel` and its grid function for $`N = 1000`$ with $`\text{BLOCK} = 1024`$. State the grid `(1,)` from `triton.cdiv`, and predict a maximum absolute difference of 0.0 against `x + y`, as measured on an RTX 3050 6 GB with CUDA 13.4 and Triton 3.8.0 for $`N = 1000`$, $`1024`$ and $`98432`$.

**Traps**

- Using a non-power-of-two `BLOCK_SIZE`. Each block must hold a power-of-two number of elements, so pad the row and mask the tail.
- Closing over a Python `BLOCK_SIZE` in the grid instead of reading `meta['BLOCK_SIZE']`. The grid then disagrees with the kernel whenever the launch or an autotuner uses another block size, and blocks go missing or overlap.
- Masking the loads but not the store. Dead lanes then write out of bounds on the final partial block.

**Practice**

- [TensorTonic: Masked Triton GELU Kernel](https://www.tensortonic.com/problems/cs336-l06-triton-masked-gelu) - Implement masked tanh-approximate GELU for contiguous CUDA tensors with partial final blocks. Rerun with your own non-multiple shapes and at least two dtypes, and compare against `torch.nn.functional.gelu` with the matching approximation.

**Stop when:** Your GELU kernel matches the reference on partial-block shapes, and you can state the grid, mask and `other` policy for any $`N`$ without notes.

<details>
<summary>Self-test</summary>

1. Why does the grid function take `meta` instead of a fixed block size?
   - The same source specializes per `BLOCK_SIZE` value. Reading `meta['BLOCK_SIZE']` keeps the grid correct for every compiled variant.
2. For $`N = 1000`$ and $`\text{BLOCK} = 1024`$, which lanes are masked and what do their loads return?
   - Lanes 1000 to 1023 are masked. Their loads return `other` and their stores are skipped, so only the first 1000 outputs are written.
3. One program covers 1024 elements. How many threads run it?
   - That is a compiler decision, controlled by `num_warps`, not by `BLOCK_SIZE`. The program maps to one CUDA thread block.
4. Why is `x_ptr + offsets` correct without multiplying by 4 for float32?
   - Triton pointer arithmetic is in elements of the pointed-to type, so the element size is implicit.

</details>

#### U2. Triton reductions and dot-product precision

**About 3 h** · **Target:** Implement

Topics: Triton reductions and numerical order; Dot operations, input precision and accumulator behavior

Softmax and matmul carry the two numerical contracts of this section: exact tails for reductions and stated precision for products.

**You can now**

- Implement row reductions with `tl.max` and `tl.sum` over axis 0, with tail policies that keep each reduction exact.
- Explain why `tl.dot` accumulates in fp32 and when its default tf32 input precision changes the result.
- Predict fused versus unfused traffic for a rowwise softmax from element counts.

**Study**

1. [Fused Softmax: kernel and test](https://triton-lang.org/main/getting-started/tutorials/02-fused-softmax.html) (Triton Programming Guide and Tutorials) - Motivations: the 5MN plus 2M read and 3MN plus 2M write count; Compute Kernel: row loop with `tl.num_programs`, `BLOCK_SIZE` as the next power of two, `other=-float('inf')`, `tl.max` and `tl.sum` over axis 0; Unit Test with the 1823 by 781 matrix.
2. [Matrix Multiplication: accumulator and test](https://triton-lang.org/main/getting-started/tutorials/03-matrix-multiplication.html) (Triton Programming Guide and Tutorials) - Final Result: fp32 `accumulator`, `tl.dot` per K block, cast to fp16 at the epilogue; Unit Test: 512 by 512 fp16 comparison with `atol=1e-2`.
3. [`tl.dot` input precision](https://triton-lang.org/main/python-api/triton.language.html) (Triton Programming Guide and Tutorials) - `tl.dot`: `input_precision` default `tf32` for f32 inputs on tensor-core hardware, with `ieee` for full fp32 inputs (still rounded at every step, so not exact).

**Focus**

- Reductions run over axis 0 of a block. The max tail uses minus infinity while a sum tail uses 0, and swapping them corrupts the result.
- The fused traffic claim is $`(8MN + 4M)/(2MN)`$, about 4 for wide rows. Check the element counts before quoting the speedup.
- Matmul accumulates in fp32 and casts once. The cast position, not just the input dtype, sets the error.
- The matmul tutorial compares fp16 outputs at `atol=1e-2`, set by fp16 inputs and the final cast. The softmax tutorial uses the `torch.allclose` defaults; `tl.exp` is fast but approximate, so state your softmax tolerance separately.

**Reproduce:** On a 64 by 64 fp32 product of standard normal matrices with seed 0, a `tl.dot` loop with `input_precision='tf32'` gives a maximum absolute error of 0.0237 against fp64, while `'ieee'` gives 7.6e-06. Measured on an RTX 3050 6 GB with CUDA 13.4 and Triton 3.8.0. Reproduce the gap direction and explain why tf32 input truncation, not accumulation order, dominates it.

**Traps**

- Passing `other=0.0` to a row-max load. Masked lanes then cap the maximum at 0 and break all-negative rows.
- Comparing fp16 matmul output with default tolerances. Use the tutorial `atol=1e-2` and justify it from input precision.
- Assuming `tl.dot` on fp32 inputs matches fp32 math. The default tf32 path truncates inputs, so set `input_precision='ieee'` when the test needs full fp32 inputs, and still compare with a tolerance.

**Practice**

- [TensorTonic: Tiled Triton Row Sum](https://www.tensortonic.com/problems/cs336-l06-triton-tiled-row-sum) - Tiled row reduction for strided CUDA tensors with fixed-width tiles and float32 sums
- [TensorTonic: Triton Row-Wise Softmax](https://www.tensortonic.com/problems/cs336-l06-triton-row-softmax) - Stable rowwise softmax for padded rows and partial tiles in float32, float16 and bfloat16. Rerun both with non-multiple widths including a 781-wide row, and compare fp16 and bfloat16 outputs against fp32 with a stated tolerance.

**Stop when:** Both problems pass, and you can state each reduction tail value and the dot precision behind every reported error.

<details>
<summary>Self-test</summary>

1. A row holds `[-3.0, -1.0]` with a block of 4 and a max-load `other=0.0`. What breaks?
   - The max becomes 0.0 instead of -1.0, so every output is wrong. Max tails need minus infinity.
2. Naive softmax moves $`8MN + 4M`$ elements and fused moves $`2MN`$. What is the claimed speedup for large $`N`$?
   - About 4. The $`4M`$ term vanishes next to $`8MN`$ as $`N`$ grows.
3. Why does the matmul tutorial accumulate in fp32 and cast at the end?
   - Each K block adds its rounding once in fp32. Casting inputs or partial sums earlier compounds the error, while the final cast costs one rounding.
4. Your fp32 Triton matmul differs from fp64 by 0.02. Is that a bug?
   - Not necessarily with default precision: tf32 input truncation alone explains errors of that size on a 64-wide reduction. Rerun with `'ieee'` before debugging indexing.

</details>

#### U3. Specialization, autotuning and compile-cost accounting

**About 5 h** · **Target:** Implement + Measure

Topics: Compile-time meta-parameters and specialization; Autotune configuration, keys, pruning and cache identity; Correctness-gated candidates and invalid configuration rejection; Compile, autotune, cold-cache and warm-cache accounting

Autotuning buys speed once and charges compile time on every new shape. Without a key and a gate, it silently serves the wrong fast kernel.

**You can now**

- Design an autotune space of block sizes, warp counts and stages with a key that separates every varying shape.
- Gate every candidate on a correctness check before timing, and reject invalid configurations.
- Separate cold compile and autotune time from warm steady-state time in every reported number.

**Study**

1. [Matrix Multiplication: tuning and cache reuse](https://triton-lang.org/main/getting-started/tutorials/03-matrix-multiplication.html) (Triton Programming Guide and Tutorials) - L2 Cache Optimizations: grouped pid mapping with `GROUP_SIZE_M`; Final Result: `get_cuda_autotune_config` block sizes with `num_stages` and `num_warps`, and `@triton.autotune` with `key=['M', 'N', 'K']`.
2. [Autotuning and compile cost](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapter 14) - Chapter 14, Autotuning with TorchInductor and Autotuning Triton Kernels: per-kernel config cache, representative warmup inputs, and `max-autotune` compile cost.
3. [PA2 Part 1: grid search and local testing](https://github.com/hao-ai-lab/cse-dsc291-s26-pa/tree/main/pa2) (UCSD CSE 291A/DSC 291 (Spring 2026) PA2 Part 1 - Triton matmul, add and ReLU) - Part 1, sections 1.1 to 1.6: tile assignment through grid search over `BLOCK_M`, `BLOCK_N`, `BLOCK_K`, `num_warps` and `num_stages`; Part 1 Testing with `python student_local_test.py student_kernel.py`. Depth: The remote grader needs a course token. Replace its speedup score with your own interleaved timing against the PyTorch reference on your GPU.

**Focus**

- The key must list every launch-varying value. A missing dimension reuses a fast config for the wrong shape.
- Candidates are correctness-gated: a config that fails the reference never reaches timing.
- First-call cost mixes compilation, autotuning and execution. Only warm calls measure the kernel.
- Tune on a representative workload, not on the final benchmark shapes.

**Reproduce:** Time `torch.compile(lambda x, y: torch.relu(x + y) * 2)` on 1024 by 1024 fp32 tensors, host-timed with synchronization: with PyTorch 2.14.1 and an empty Inductor cache on an RTX 3050 6 GB with CUDA 13.4, the first call took about 1.2 to 1.9 s and warm calls about 0.1 ms. State which interval pays for compilation and what a warm Inductor cache changes, then run the matmul tutorial autotuned kernel twice on one shape and show the second launch skips benchmarking.

**Traps**

- Benchmarking candidates without warmup. Compile time then votes for the smallest tile, not the fastest kernel.
- One config for all shapes. A tall-skinny winner can lose on square shapes, and the key exists to stop that.
- Treating the course grader number as portable. Retime the submitted `KERNEL_CONFIGS` on your own GPU before claiming anything.

**Practice**

- [UCSD CSE 291A PA2 Part 1: Triton matmul-add-ReLU](https://github.com/hao-ai-lab/cse-dsc291-s26-pa/tree/main/pa2) - Implement `matmul_add_relu_kernel_fp16` for the fused add-plus-ReLU epilogue with fp16 inputs and output and an fp32 accumulator, plus 1 to 5 `KERNEL_CONFIGS`; pass `student_local_test.py` with 512-wide correctness and 2048-wide timing. The remote grader needs a course token, so replace its speedup score with your own interleaved timing against the PyTorch reference on your GPU.

**Stop when:** Your configs pass the local correctness and timing tests, and every reported number names its key, its warmup, and whether the cache was cold or warm.

<details>
<summary>Self-test</summary>

1. Two shapes share $`M`$ and $`N`$ but differ in $`K`$, and the key is `['M', 'N']`. What goes wrong?
   - The second shape reuses the first shape winner without benchmarking. $`K`$ changes tile reuse, so it belongs in the key.
2. A candidate is twice as fast but fails the reference at `ATOL=0.15`. Keep it?
   - No. Correctness gates timing, so a fast wrong kernel is rejected.
3. A cold call takes seconds and warm calls take under a millisecond. Which part is the kernel?
   - The warm calls. The cold call pays compilation and autotuning once per key.
4. Why tune on production-like shapes instead of the evaluation set?
   - Tuning on the evaluation set overfits the selection. Unseen shapes then pay for a config chosen for another distribution.

</details>

#### U4. Generated code, resources and debugging Triton kernels

**About 3 h** · **Target:** Measure

Topics: Registers, shared memory, occupancy and generated-code inspection; Interpreter, assertions, sanitizer limits and minimal reproducers

A slow or wrong Triton kernel is a compiler artifact until you read it. Resource reports and IR dumps turn guessing into evidence.

**You can now**

- Inspect a compiled Triton kernel for registers, shared memory and the full IR-to-cubin trajectory.
- Debug a failing Triton kernel with the interpreter, device asserts and compute-sanitizer, and state what each tool cannot see.
- Build a minimal reproducer that isolates a Triton defect from the surrounding program.

**Study**

1. [Debugging Triton](https://triton-lang.org/main/programming-guide/chapter-3/debugging.html) (Triton Programming Guide and Tutorials) - Using Triton's Debugging Operations: `static_print`, `static_assert`, `device_print`, `device_assert`, with `device_assert` active only when `TRITON_DEBUG=1`; Using the Interpreter with `TRITON_INTERPRET=1`, including Limitations on bfloat16 and indirect access; Using Third-party Tools with `compute-sanitizer`.
2. [GPU MODE Lecture 29: Triton internals and artifacts](https://github.com/gpu-mode/lectures/tree/main/lecture_029) (GPU MODE - Triton, CuTe and Machine Code) - `presentation.md`: NVCC toolchain (`nvcc` to PTX to `ptxas` to SASS), Triton Compilation through TTIR, TTGIR, LLIR, PTX and cubin, the JIT handle `asm` keys, and `MLIR_ENABLE_DUMP=1` for per-pass IR; `vector_add.py`: `compiled_kernel.asm` keys with `get_sass`.
3. [Fused Softmax: occupancy from a warmup compile](https://triton-lang.org/main/getting-started/tutorials/02-fused-softmax.html) (Triton Programming Guide and Tutorials) - Compute Kernel helper `softmax`: pre-compile with `warmup`, then read `n_regs` and `metadata.shared` to derive occupancy from register and shared-memory limits.
4. [Debugging generated compiler code](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapter 14) - Chapter 14, Performance Hints and Debugging Generated Code: `TORCH_LOGS`, `TORCH_COMPILE_DEBUG=1` and the dumped FX graph, Inductor IR and Triton code.

**Focus**

- The `asm` dict holds `source`, `ttir`, `ttgir`, `llir`, `ptx` and `cubin`. Each stage answers a different question about the final machine code.
- `n_regs` and `metadata.shared` set resource ceilings before any profiler runs. Compare them against the launch before blaming the algorithm.
- The interpreter runs programs sequentially on CPU with NumPy semantics. It exposes indexing bugs but not races or occupancy effects.
- `compute-sanitizer` checks races and out-of-bounds on hardware, where the interpreter cannot help.

**Reproduce:** Launch the vector-add kernel with $`\text{BLOCK} = 1024`$ on Triton 3.8.0 and read the handle: `n_regs` 26, shared 0, target `sm_86`, `asm` keys `source`, `ttir`, `ttgir`, `llir`, `ptx` and `cubin`, and a PTX header with `.version 8.8`, `.target sm_86` and `.reqntid 128`. Measured on an RTX 3050 6 GB with CUDA 13.4.

**Traps**

- Adding `device_assert` and seeing nothing. It executes only when `TRITON_DEBUG=1` is set.
- Trusting interpreter timing or race behavior. Sequential CPU simulation cannot show either; rerun on hardware with `compute-sanitizer` for those.
- Reading `n_regs` from a `warmup` call with one grid and assuming it covers all configs. Any `tl.constexpr` change recompiles and can change resources.

**Practice**

- [GPU MODE Lecture 29 `vector_add.py` codegen inspection](https://github.com/gpu-mode/lectures/tree/main/lecture_029) - Run `vector_add.py` far enough to print `compiled_kernel.asm.keys()`, dump the `ttgir` and `ptx`, and rerun with `MLIR_ENABLE_DUMP=1`; then run the same launch under `compute-sanitizer`. Do this on your own GPU with a short launch. Keep each sanitizer run small and never leave a process holding GPU memory.

**Stop when:** You can name the IR stage behind any PTX or SASS observation, and your minimal reproducer fails identically on hardware and under the sanitizer.

<details>
<summary>Self-test</summary>

1. Which `asm` key holds the PTX, and which holds the final machine code?
   - `ptx` holds the PTX and `cubin` holds the final machine code. `ttir`, `ttgir` and `llir` are the compiler stages above them.
2. A kernel reports high `n_regs` and zero shared memory. What limits occupancy first?
   - Registers. Divide the SM register file by registers per thread times threads per block, and compare against the block limit before touching shared memory.
3. Your kernel fails only on hardware but passes with `TRITON_INTERPRET=1`. What class of bug is likely?
   - A race, an out-of-bounds access masked by NumPy semantics, or a resource effect. Reproduce under `compute-sanitizer` with a minimal launch.
4. Why does the interpreter refuse bfloat16 tensors?
   - It has no bfloat16 operation support. Cast with `tl.cast` to float32 for the interpreter run, then re-verify on hardware.

</details>

#### U5. Matched CUDA and Triton kernels and the lowering path

**About 5 h** · **Target:** Explain + Implement

Topics: Matched CUDA and Triton implementations of the same kernel; Frontend, IR, lowering, LLVM, PTX and machine-code trajectory

Two kernels that pass the same tests can still differ in precision, resources and shipped machine code. Parity work makes the difference visible.

**You can now**

- Implement matched CUDA and Triton kernels for one operation and test them against the same reference and tolerances.
- Trace both kernels from source through PTX to SASS and state which device code actually ships.
- Explain where the Triton lowering diverges from handwritten CUDA: tiling, precision defaults and launch setup.

**Study**

1. [GPU MODE Lecture 29: compilation trajectories](https://github.com/gpu-mode/lectures/tree/main/lecture_029) (GPU MODE - Triton, CuTe and Machine Code) - `presentation.md`: Device Code Processing with `cicc` to PTX and `ptxas` to SASS, then Triton Compilation from the DSL through TTIR, TTGIR, LLIR, PTX and cubin with the cache layout.
2. [CUDA Binary Utilities](https://docs.nvidia.com/cuda/cuda-binary-utilities/) (PTX ISA and CUDA Binary Utilities) - Sections 1.2 (cuobjdump against nvdisasm inputs), 2.1.1 (dumping SASS, ELF and PTX), 2.1.2 (listing embedded binaries) and 2.1.3 (resource usage with `-res-usage`).
3. [Triton lowering to PTX](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapter 14) - Chapter 14, Triton Programming Model: Triton converts the program to PTX with each program using a single CUDA thread block, and vectorizes arithmetic and memory operations.

**Focus**

- `cuobjdump` accepts cubins and host binaries while `nvdisasm` accepts only cubins with richer output. Pick the tool by input, not habit.
- `-res-usage` reports registers and shared memory per function. Match those numbers against the Triton handle before comparing speed.
- A fat binary can carry several architectures. List embedded binaries before claiming which SASS runs.
- Triton `tl.dot` defaults to tf32 on fp32 inputs while a naive CUDA kernel stays in fp32. Parity tests must pin precision on both sides.

**Reproduce:** Compile a vector-add `.cu` with `nvcc -arch=sm_86 -cubin` and run `cuobjdump -sass` plus `cuobjdump -res-usage`. Show the guarded prologue (`S2R`, `IMAD`, `ISETP`, guarded `EXIT`, `LDG.E` loads) and the resource line `REG:12` with `SHARED:0`. Measured with CUDA 13.4 for compute capability 8.6.

**Traps**

- Comparing PTX `.target` strings and calling it a performance result. PTX is virtual; only the SASS for your architecture executes.
- Forgetting `cuobjdump -lelf` on a shipped binary. The running code may come from a different embedded arch than the one you inspected.
- Attributing a Triton-versus-CUDA gap to tiling when one side used tf32 and the other used fp32. Fix `input_precision` first.

**Practice**

- [LeetGPU 1 Vector Addition in Triton with a CUDA twin](https://leetgpu.com/challenges/vector-addition) - Public `challenge.py` at `challenges/easy/1_vector_add/challenge.py`: `torch.add` reference with `atol=1e-05`, `rtol=1e-05`, free tier. Write matched CUDA and Triton kernels in your own repository and pass the example plus the scalar-tail and non-power-of-two functional tests, on LeetGPU or locally against `reference_impl` from `challenge.py` as in the CUDA primitives section (a Triton `solve` takes the tensors directly). Then compare `cuobjdump -res-usage` reports for both.
- [LeetGPU 2 Matrix Multiplication in Triton with a CUDA twin](https://leetgpu.com/challenges/matrix-multiplication) - Public `challenge.py` at `challenges/easy/2_matrix_multiplication/challenge.py`: `torch.matmul` reference with `atol=0.0001`, `rtol=0.0001`, free tier. Pin `input_precision` on the Triton side and the accumulation on the CUDA side before any timing, and keep the losing shapes in your report.

**Stop when:** Both twins pass the same tests, and you can point at the PTX and SASS lines plus the resource reports that explain their gap.

<details>
<summary>Self-test</summary>

1. When do you reach for `nvdisasm` instead of `cuobjdump`?
   - When the input is already a cubin and you want control-flow graphs, register liveness or source correlation, which `cuobjdump` does not provide.
2. Your binary runs slower than the SASS you inspected suggests. What do you check?
   - Which embedded binary actually loads, with `-lelf` and the driver architecture. The inspected SASS may belong to another arch.
3. The Triton kernel is faster than your CUDA kernel on fp32 matmul. What is the first suspect?
   - Precision: Triton `tl.dot` defaults to tf32 inputs while the CUDA kernel accumulates true fp32. Re-run with `input_precision='ieee'` before crediting tiling.
4. What does `REG:12 SHARED:0` tell you about the vector-add kernel?
   - It uses 12 registers per thread and no shared memory, so occupancy is set by registers and block limits, not by shared memory.

</details>

#### U6. `torch.compile` capture, fusion, graph breaks and recompilation

**About 4 h** · **Target:** Measure

Topics: Framework graph capture, fusion and generated-kernel boundaries; Graph breaks, guards, recompilation and dynamic-shape behavior

Framework compilation decides fusion boundaries for you until it silently gives up. Breaks and guards are where its speedups go missing.

**You can now**

- Trace one operation from `torch.compile` capture through FX graph and generated Triton code to the running kernel.
- Diagnose graph breaks and recompilations with `explain` and `TORCH_LOGS`, and repair the common cases.
- Predict how dynamic shapes change guards, recompilation and CUDA-graph recording.

**Study**

1. [Compiler pipeline: Dynamo, AOT Autograd, Inductor](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapter 14) - Chapter 14, PyTorch Compiler Deep Dive through TorchInductor Backend Code Generation: bytecode capture, joint forward-backward graph, PrimTorch IR with about 250 primitives, and Inductor code generation with autotuning and CUDA graphs.
2. [Graph breaks, recompiles and dynamic shapes](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapter 14) - Chapter 14, Explaining and Minimizing Graph Breaks (`torch._dynamo.explain`, `allow_in_graph`, `torch.where` masking, `torch.cond` limits), Minimize Graph Recompilations (`TORCH_LOGS=graph_breaks,recompiles,guards`, `mark_dynamic`, `eager_on_recompile`), and Dynamic Shapes and Variable Sequence Lengths (symbolic shapes and guards). Depth: The book says `dynamic=True` disables CUDA graphs. In PyTorch 2.14.1 it does not: with `mode='reduce-overhead'` Inductor records one CUDA graph per distinct size and warns after 8 (`torch._inductor.config.triton.cudagraph_dynamic_shape_warn_limit`).
3. [Compiler debugging scripts](https://github.com/cfregly/ai-performance-engineering/tree/main/code) (AI Systems Performance Engineering companion code - Chapters 9, 10, 13 and 14) - `code/ch14/inspect_compiled_code.py` for dumping the compiled SimpleLLMBlock kernels; `code/ch14/baseline_graph_break_control_flow.py` against `optimized_graph_break_control_flow.py` for the Python-branch break; `code/ch14/recompilation_demo.py` (in the repository since late August 2026) for guard-driven recompiles.

**Focus**

- Dynamo captures straight-line tensor code and breaks on data-dependent Python control flow, falling back to eager for that region.
- Every compiled graph carries guards on shapes, dtypes and devices. A failing guard recompiles, so changing values look like slow code.
- `dynamic=True` compiles one graph for many shapes, but `reduce-overhead` mode still records a CUDA graph per distinct size, so graph memory and recording cost grow with the shape count. Prefer `mark_dynamic` on the dims that truly vary, and bucket sizes when graphs matter.
- Inductor fuses and autotunes over the captured graph only. Code outside the graph keeps its launch overhead whatever the mode says.

**Reproduce:** Run `torch._dynamo.explain` on a function with a Python `if` over `y.sum() > 0` and on its `torch.where` rewrite, with PyTorch 2.14. The first reports Graph Count 2 with Break Count 1 (generic jump); the second reports Graph Count 1 with Break Count 0. Quote both reports from your own run.

**Traps**

- Reading one slow iteration as a slow kernel. The first iterations pay capture and compile; compare warm steady state only.
- Closing over a changing Python constant such as a seed or timestamp. Every new value fails a guard and recompiles.
- Setting `dynamic=True` and expecting one CUDA graph. Each distinct size records its own graph under `reduce-overhead`; bucket the sizes or mark only the dim that varies.

**Practice**

- [AI Systems ch14: graph-break and recompile inspection](https://github.com/cfregly/ai-performance-engineering/tree/main/code) - Run `code/ch14/inspect_compiled_code.py` to dump the SimpleLLMBlock graphs and Triton code, then `code/ch14/recompilation_demo.py`; compare `explain` output for `baseline_graph_break_control_flow.py` against the optimized version. Run the scripts on your own GPU with small shapes. Report graph counts, break reasons and which guard each recompile names.

**Stop when:** You can predict the graph count of a small function before running `explain`, and name the guard behind any recompile you trigger.

<details>
<summary>Self-test</summary>

1. What does `explain` report for a data-dependent Python `if` on a tensor sum?
   - Two graphs with one break: the region before the branch, a generic-jump break reason, and the region after it.
2. Iterations stay slow long after warmup. Which log separates breaks from recompiles?
   - `TORCH_LOGS=graph_breaks,recompiles,guards`. Breaks cut graphs short; recompiles show which guard keeps failing.
3. With `dynamic=True` and `mode='reduce-overhead'`, what happens when 20 distinct batch sizes arrive?
   - One compiled graph serves them all, but Inductor records a separate CUDA graph for each size and warns after 8 by default. Bucket the sizes so a few graphs cover the traffic.
4. When does `eager_on_recompile` beat fixing the guard?
   - When shapes vary irreducibly and each recompile costs more than it saves. It caps recompiles by falling back to eager.

</details>

#### U7. Custom operators, stream semantics and autograd contracts

**About 3 h** · **Target:** Implement

Topics: Custom operator registration, stream semantics and autograd contracts

An invisible custom op cuts every framework graph it touches. Registration plus a tested backward keeps the fast path composable.

**You can now**

- Register a Triton kernel as a PyTorch custom op that `torch.compile` can see through instead of breaking on.
- Implement a fused forward plus backward with saved tensors, stream-safe launches and a correct fallback.
- State the autograd contract your op keeps: what it saves, what it differentiates, and what higher-order use it refuses.

**Study**

1. [Layer Normalization: backward pass and wrapper](https://triton-lang.org/main/getting-started/tutorials/05-layer-norm.html) (Triton Programming Guide and Tutorials) - Backward pass: the `dx` formula with `c1` and `c2` constants, two-stage `dw` and `db` reduction with `Lock`, `Count` and `tl.debug_barrier`; Benchmark: the `LayerNorm` `autograd.Function` with `save_for_backward`, `GROUP_SIZE_M` heuristics and `test_layer_norm(1151, 8192, torch.float16)`.
2. [Custom Triton ops in PyTorch](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapter 14) - Chapter 14, Registering Custom Kernels with PyTorch (`torch.library.triton_op` with autograd and fake-tensor support) and Debugging Compiler Phases (unknown custom ops force graph breaks).

**Focus**

- The backward needs saved `x`, `w`, `mean` and `rstd` plus the launch config. Missing state cannot be recomputed from `dy` alone.
- `dw` and `db` reduce across rows through grouped buffers with locks. The grouping is an implementation choice, not math.
- Registration declares mutation and schema so Dynamo and Inductor can reason about the op. An unregistered op is opaque and breaks the graph.
- Kernel launches must stay on the current CUDA stream with no hidden synchronization, or composition with streams and graphs breaks.

**Reproduce:** Closed-book, derive the LayerNorm vector-Jacobian product: $`dx = (\text{wdy} - (\text{xhat} \cdot c1 + c2)) \cdot \text{rstd}`$ with $`c1 = \mathrm{mean}(\text{xhat} \cdot \text{wdy})`$ and $`c2 = \mathrm{mean}(\text{wdy})`$, where $`\text{wdy} = w \cdot dy`$ and $`\text{xhat} = (x - \mathrm{mean}) \cdot \text{rstd}`$. State which means run over the row.

**Traps**

- Allocating locks wrong. The tutorial uses `torch.zeros(2 * GROUP_SIZE_M, dtype=torch.int32)` for locks plus counts; any other shape or dtype breaks the protocol.
- Promising double backward. The tutorial backward supports first-order gradients only; state that limit instead of letting a caller discover it.
- Synchronizing inside the op for timing or debugging and shipping it. The hidden sync serializes every stream composition around the op.

**Practice**

- [Triton LayerNorm tutorial: forward-backward acceptance](https://triton-lang.org/main/getting-started/tutorials/05-layer-norm.html) - Run `test_layer_norm(1151, 8192, torch.float16)` for forward, `dx`, `dw` and `db` agreement, then `bench_layer_norm` with `mode='backward'`. Implement in your own repository. Keep the lock protocol and both reduction stages, and record the higher-order limitation in your tests.

**Stop when:** Your op passes the tutorial acceptance test, stays on-stream under composition, and `explain` shows no new break where it runs.

<details>
<summary>Self-test</summary>

1. Why does the backward save `mean` and `rstd` instead of recomputing them?
   - Recomputation repeats two full passes over `x` and risks a different rounding. Saved statistics keep forward and backward consistent.
2. What do the `GROUP_SIZE_M` buffers change about the `dw` result?
   - Nothing mathematically: they partition the row reduction across buffers that a second kernel sums. Only performance and memory change.
3. What happens to `torch.compile` when it meets an unregistered custom CUDA op?
   - Dynamo cannot reason about it, so it emits a graph break and runs that region eagerly, keeping the Python overhead the compile was meant to remove.
4. Which stream must a custom op launch on, and why?
   - The current stream from `torch.cuda.current_stream`. Any other choice breaks event dependencies that callers built around the op.

</details>

#### U8. The CUTLASS hierarchy and CuTe layout algebra

**About 5 h** · **Target:** Derive

Topics: CUTLASS device, kernel, collective, tiled MMA and atom hierarchy; CuTe layouts, coordinates, composition and logical division

CuTe layouts are the vocabulary that CUTLASS, Triton and Tile IR all translate into. Reading them turns template errors into indexing facts.

**You can now**

- Read a CUTLASS 3.x GEMM from device down to atoms through layouts, strides and tiles.
- Evaluate CuTe layouts as functions: shape, stride, index mapping, size and cosize.
- Partition global, shared and register tiles across CTAs and threads with `local_tile` and `local_partition`.

**Study**

1. [CUTLASS 3.0 design](https://docs.nvidia.com/cutlass/latest/media/docs/cpp/cutlass_3x_design.html) (CUTLASS 3.x Design and CuTe Layout Algebra) - CUTLASS 3.0 design goals, A new Conceptual GEMM Hierarchy (layers detached from hardware generations), Adoption of CuTe Layout and Tensors, and Reducing the number of named types and iterator concepts.
2. [CuTe GEMM tutorial: tensors, tiles and partitions](https://docs.nvidia.com/cutlass/latest/media/docs/cpp/cute/0x_gemm_tutorial.html) (CUTLASS 3.x Design and CuTe Layout Algebra) - High-level interface (problem shape, CTA tiler, strides); The Full Tensors with `(M,K)`, `(N,K)`, `(M,N)` modes and the M-major, N-major, K-major table; CTA Partitioning with `local_tile` over `zipped_divide`; SMEM tensors with `cosize` allocation; Copy partitioning and Math partitioning with `local_partition`. Depth: Work through `sgemm_1.cu` only. Leave `sgemm_2.cu` atoms, the SM70/SM80 pipelines and GETT for the atoms unit.
3. [GPU MODE Lecture 103: CuTe layout algebra](https://github.com/gpu-mode/lectures/tree/main/lecture_103) (GPU MODE - Triton, CuTe and Machine Code) - Slides on layout definitions, composition and the composition algorithm.

**Focus**

- A layout is a function from logical coordinates to offsets. `size` measures the domain and `cosize` the codomain, and allocation uses `cosize`.
- CuTe stores B as `(N,K)`, not `(K,N)`. Both inputs reduce over their second mode, so read every stride pair against that convention.
- Majorness names the stride-1 mode: M-major, N-major or K-major. It replaces the BLAS transposed and non-transposed flags.
- `local_tile` slices the rest mode to give each CTA its tile; `local_partition` slices the tile mode to give each thread its share.

**Reproduce:** Closed-book, give the byte-free element address of $`A(i,j)`$ for layout $`(M,K):(1,\text{ldA})`$, then compute the `cosize` of the padded shared-memory layout with shape $`(128,8)`$ and stride $`(1,129)`$: maximum offset $`127 + 7 \times 129 = 1030`$, so `cosize` 1031. State why allocation needs 1031 elements and not 1024.

**Traps**

- Reading B strides as `(K,N)`. Under the `(N,K)` convention the reduction mode sits second in both inputs, and every partition assumes it.
- Using `size` for the shared allocation. Padded layouts have `cosize` larger than `size`, and allocating `size` overflows the padding.
- Treating NT and TN labels as layout facts. They describe BLAS calling convention; only the inspected layout tells you the stride-1 mode.

**Practice**

- The section mini-project covers this: reconstruct one GEMM configuration down to layouts, copy atoms and MMA atoms, and compare it with the equivalent Triton blocked program.

**Stop when:** You can hand-evaluate any static layout in the tutorial to addresses and partition coordinates, and defend each CTA and thread tile against the code.

<details>
<summary>Self-test</summary>

1. For layout $`(M,K):(1,\text{ldA})`$, which index runs over contiguous elements?
   - The $`M`$ index $`i`$: address $`i + j \times \text{ldA}`$ advances by 1 per row step, so the matrix is M-major.
2. What breaks if the shared allocation uses `size` for the padded $`(128,8)`$, $`(1,129)`$ layout?
   - Seven elements of padding per column go unallocated. Writes to padded offsets land out of bounds even though every logical index is in range.
3. What do `local_tile` and `local_partition` each slice, and what mode does each leave behind?
   - `local_tile` slices the rest mode with the CTA coordinate and leaves the tile modes plus the K rest index, giving `(BLK_M,BLK_K,k)` so the CTA can loop over its K tiles. `local_partition` slices the tile mode with the thread index and leaves the rest mode, giving each thread its elements repeated across the tile.
4. A kernel is labeled TN for both inputs. What are the two layouts?
   - Both K-major: A is $`(M,K):(\text{ldA},1)`$ and B is $`(N,K):(\text{ldB},1)`$. Confirm by inspecting the layouts, not the label.

</details>

#### U9. CuTe copy and MMA atoms, tiled MMAs and pipelines

**About 4 h** · **Target:** Explain

Topics: Copy and MMA atoms, tiled copies and tiled MMAs; Pipeline stages, barriers and producer-consumer ownership

Atoms separate what moves data from what computes on it. Pipelines then overlap the two, and every overlap bug is an ownership bug.

**You can now**

- Select copy and MMA atoms for a GEMM tile and explain what each atom fixes: instruction, types and partitioning.
- Build tiled copies and tiled MMAs from atoms and connect each partition to its tensor fragment.
- Reason about pipeline stages, barriers and producer-consumer ownership in an async mainloop.

**Study**

1. [CuTe GEMM tutorial: atoms and pipelined mainloops](https://docs.nvidia.com/cutlass/latest/media/docs/cpp/cute/0x_gemm_tutorial.html) (CUTLASS 3.x Design and CuTe Layout Algebra) - Mainloop with `copy`, `cp_async_fence`, `cp_async_wait` and `__syncthreads`; TiledCopy with `Copy_Atom`, `partition_S`, `partition_D` and `make_fragment_like`; TiledMMA with `UniversalFMA`, `partition_A`, `partition_B`, `partition_C` and `make_fragment_C`; Other changes with padded shared layouts; `sgemm_sm80.cu` for the async Ampere pipeline.
2. [Warp specialization and software pipelining](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapter 14) - Chapter 14, Warp Specialization with Triton (`warp_specialize=True` on `tl.range`; the book's `num_consumer_groups` and `num_buffers_warp_spec` config keys are rejected by `triton.Config` in Triton 3.8.0) and Software Pipelining and Double Buffering with Triton (prefetch-next then compute-current with the commit-then-wait handshake, `num_stages` against occupancy).
3. [Persistent matmul](https://triton-lang.org/main/getting-started/tutorials/09-persistent-matmul.html) (Triton Programming Guide and Tutorials) - Persistent versus naive kernel structure with `@triton.autotune` configs and `proton.scope` benchmark regions. Depth: Study the persistent structure and the config tables. Skip the CLC variants, which need compute capability 10.0, and run only configurations that fit your GPU.

**Focus**

- An atom binds one instruction to fixed types. `UniversalCopy` with `uint128_t` demands vectorizable fragments or the build fails statically.
- `partition_S` and `partition_D` can differ across source and destination. The fragment names record which partitioning each tensor uses.
- The first MMA mode holds one instruction worth of elements. Its size varies per atom and per tensor, so read it off the atom.
- Overlap needs the current tile to stay live while the next tile prefetches. Overwriting it lets the compiler reorder copies past uses and silently serializes the loop.

**Reproduce:** Closed-book, write the tutorial mainloop order for one K tile: `copy` with the thread partitions, `cp_async_fence`, `cp_async_wait`, `__syncthreads`, `gemm` on the MMA partitions, `__syncthreads`. State what each barrier waits for.

**Traps**

- The book handshake names `tl.commit` and `tl.wait`, which do not exist in Triton 3.8.0. The real overlap mechanism is the pipelined `tl.range` with `num_stages` over descriptor loads, so treat those two names as author pseudocode.
- Adding stages for free. Each extra stage costs shared memory and can cut occupancy below the point where overlap pays.
- Copying the 16 by 16 UniversalFMA tiling numbers onto a tensor-core MMA. Real MMAs have their own thread coverage and fragment shapes.

**Practice**

- [TensorTonic: Fused Tiled Matmul and ReLU](https://www.tensortonic.com/problems/cs336-l06-triton-matmul-relu) - Fused tiled matrix multiplication and ReLU for strided float16 or bfloat16 CUDA inputs and preallocated outputs. Map your kernel to the atom picture first: which loads are the copy stage, where the MMA equivalent accumulates in fp32, and where the ReLU epilogue fuses. Rerun with non-multiple M, N and K.

**Stop when:** You can label every fragment in your fused kernel as a copy or MMA partition, and your pipeline keeps overlap under a stage count you justify from occupancy.

<details>
<summary>Self-test</summary>

1. The `TiledCopy` uses `UniversalCopy` over `uint128_t` for fp32 data. How many elements per thread must the partition deliver?
   - Four: 128 bits hold four fp32 values. A partition that cannot vectorize to that width fails at compile time.
2. What does `thr_mma.make_fragment_C` allocate, and why not `make_tensor_like`?
   - Accumulator fragments shaped by the MMA partitioning, which need not match the global tile layout element for element. The MMA view, not the tensor view, sets the shape.
3. The pipelined loop is no faster than the naive one, but profiles show copies and math serialized. What is the first suspect?
   - The current tile reference dies before its consumer runs, so the compiler hoists the next copy past the current use. Keep the current tile live across the swap.
4. When does warp specialization beat simply adding stages?
   - On long K loops where dedicated producer and consumer warps keep memory and math busy together. Short loops cannot amortize the partition.

</details>

#### U10. Other programming models, dispatch with fallback and compiler regression tests

**About 4 h** · **Target:** Implement

Topics: Pallas, ROCm and NKI programming-model comparison; Device, dtype, shape and layout dispatch with fallback; Compiler-version, generated-code and performance regression tests

A kernel that wins on one stack and breaks on the next is a demo. Dispatch plus regression tests turn it into infrastructure.

**You can now**

- Compare Triton, Pallas, cuTile (Tile IR) and the CuTe DSL on mapping, scheduling and effort for one kernel.
- Build device, dtype, shape and layout dispatch with a tested fallback for every unvalidated path.
- Write compiler-version, generated-code and performance regression tests that fail on real drift.

**Study**

1. [Higher-level kernel languages](https://accelerated-computing.academy/fall25/lectures/slides/Lecture10.pdf) (MIT 6.S894 Lecture 10 - Domain Languages and Accelerators) - Lecture 10, Higher-level kernel languages slides: Triton blocked matmul with `tl.program_id` and pointer arithmetic, the Pallas block-reference form (`pl.BlockSpec`, `pallas_call`), and the Triton against CUDA against SASS effort-performance ordering with cuTile and the CuTe DSL.
2. [Tile IR programming model](https://docs.nvidia.com/cuda/tile-ir/latest/sections/prog_model.html) (CUDA Tile IR Programming Model) - Section 3 through 3.1.2: tile kernels, tile-blocks as the unit of execution, and how tile programming differs from SIMT thread mapping. Depth: Read the model and inspect the official repository. Implement a parity kernel only if your toolchain supports it, and record the compiler-version constraint.
3. [Binary checks for dispatch and regressions](https://docs.nvidia.com/cuda/cuda-binary-utilities/) (PTX ISA and CUDA Binary Utilities) - Sections 2.1.2 (listing embedded binaries to confirm the shipped arch) and 2.1.3 (resource usage to pin down register and shared-memory drift across versions).

**Focus**

- Triton maps programs explicitly to blocks and schedules inside blocks automatically. Pallas names programs with its own IDs and indexes block references declared with `pl.BlockSpec` instead of raw pointers, and Tile IR abstracts the thread mapping into the compiler.
- Dispatch keys on device, dtype, shape and layout together. Any untested combination must route to the validated fallback, never to the fast path.
- Pin the compiler and library versions in every regression test. A Triton or CUDA update can change tiling, precision defaults and resource use.
- Keep negative results: shapes where the custom kernel loses to the library decide the dispatch boundary.

**Reproduce:** Closed-book, write a dispatch sketch for a softmax kernel: fast Triton path for contiguous fp32 rows under 8192 columns, library fallback otherwise, plus a regression test that fails when `cuobjdump -res-usage` registers change across a compiler update. State the fallback condition first.

**Traps**

- Dispatching on shape alone. A new dtype or a non-contiguous layout can take the fast path into unvalidated code.
- Testing only the winning shapes. Regressions hide on the shapes you stopped running, so keep a held-out shape set.
- Treating Pallas or Tile IR snippets as runnable practice here. Without their toolchains they are reading for the comparison, not implementations.

**Practice**

- [LeetGPU 5 Softmax in Triton with dispatch and fallback](https://leetgpu.com/challenges/softmax) - Public `challenge.py` at `challenges/medium/5_softmax/challenge.py`: max-trick reference with `atol=1e-05`, `rtol=1e-05`, free tier. Wrap your kernel in device, dtype, shape and contiguity dispatch with a `torch.softmax` fallback, and add a version-pinned regression test over held-out shapes including non-multiples. Run it on LeetGPU or locally against `reference_impl` from `challenge.py`.

**Stop when:** Your dispatch routes every held-out shape, dtype and layout to a tested path, and a compiler update fails loudly instead of silently.

<details>
<summary>Self-test</summary>

1. What is the essential mapping difference between the Triton and Pallas matmul forms?
   - Triton names programs with `tl.program_id` and builds raw pointers with strides. Pallas names programs with its own IDs and indexes block references declared with `pl.BlockSpec` instead of pointers.
2. A new GPU generation doubles shared memory. Does your dispatch change?
   - Only after measurement: re-run the shape matrix, confirm the pipeline still wins within resources, and update the boundary. New hardware does not move it by itself.
3. What must a compiler regression test record besides pass or fail?
   - Compiler and library versions, the shipped arch from the embedded binaries, resource usage, tolerances, and the raw timings with warmup stated.
4. When is the library path the right production choice over your faster kernel?
   - When dispatch cannot cover the shape, dtype, layout or arch mix, when maintenance owns the risk, or when the measured end-to-end gain vanishes outside the benchmark.

</details>

### Mini-project: Matched CUDA and Triton paths with lowering and dispatch gates

**About 12 to 16 hours.** Implement the same mechanisms in CUDA and Triton inside kernellab: blocked programs, reductions and dot precision, autotuning with correctness gates, codegen inspection, lowering evidence, graph boundaries, a custom op, one CuTe GEMM reconstruction and versioned dispatch with fallback.

1. Write Triton `add_kernel` with its grid function for $`N = 1000`$ and `BLOCK = 1024`: grid `(1,)` from `triton.cdiv` and maximum absolute difference 0.0 against `x + y` at $`N = 1000`$, 1024 and 98432 on the RTX 3050 with CUDA 13.4 and Triton 3.8.0. Add a masked tanh-approximate GELU for contiguous CUDA tensors with partial final blocks, rerun on non-multiple shapes and two dtypes against `torch.nn.functional.gelu` with the matching approximation.
2. Implement tiled Triton row sums for strided CUDA tensors with fixed-width tiles and float32 sums, and stable row-wise softmax for padded rows and partial tiles in fp32, fp16 and bf16, rerunning both on a 781-wide row and comparing fp16 and bf16 against fp32 at stated tolerance. On a 64 by 64 fp32 product of seed 0 standard-normal matrices show a `tl.dot` loop with `input_precision=tf32` near 0.0237 maximum absolute error against fp64 while `ieee` gives near 7.6e-06, and explain why tf32 input truncation rather than accumulation order dominates.
3. Implement the CSE 291A PA2 Part 1 fused matmul-add-ReLU with fp16 inputs and output and an fp32 accumulator and its configuration search, tested with `student_local_test.py` on the RTX 3050 and timed with your own interleaved harness against the PyTorch reference. Time `torch.compile(lambda x, y: torch.relu(x + y) * 2)` on 1024 by 1024 fp32 tensors with synchronization: first call near 1.2 to 1.9 s with an empty Inductor cache and warm calls near 0.1 ms on PyTorch 2.14.1. Show the second autotuned launch skipping benchmarking, and record that `triton.Config` rejects `num_consumer_groups` on 3.8.0.
4. Launch the Triton vector-add kernel with `BLOCK = 1024` on 3.8.0 and read the handle: `n_regs` 26, shared 0, target `sm_86`, `asm` keys `source`, `ttir`, `ttgir`, `llir`, `ptx` and `cubin`, and a PTX header with `.version 8.8`, `.target sm_86` and `.reqntid 128`. Dump `ttgir` and `ptx` for one kernel, run the GPU MODE Lecture 29 `vector_add.py` inspection far enough to print `compiled_kernel.asm.keys()`, and document interpreter, assertion and sanitizer limits with one minimal reproducer each.
5. Write matched CUDA and Triton twins for LeetGPU challenges 1 and 2 in kernellab and pass the example plus scalar-tail and non-power-of-two functional tests locally against `reference_impl`, pinning `input_precision` on the Triton side and accumulation on the CUDA side before any timing and keeping losing shapes. Compile one vector-add `.cu` with `nvcc -arch=sm_86 -cubin` and show the guarded prologue with `S2R`, `IMAD`, `ISETP`, guarded `EXIT` and `LDG.E` loads plus resource line `REG:12` with `SHARED:0` from `cuobjdump -sass` and `cuobjdump -res-usage`. Run `torch._dynamo.explain` on a Python `if` over `y.sum() > 0` (Graph Count 2, Break Count 1) and on its `torch.where` rewrite (Graph Count 1, Break Count 0) on PyTorch 2.14.
6. Trace one framework operation from graph capture through generated GPU code: run the ch14 inspection and recompilation scripts on small shapes, reporting graph counts, break reasons and which guard each recompile names, with `dynamic=True` plus reduce-overhead behavior (one graph per size, warning limit 8) recorded from your own run. Register a Triton LayerNorm with forward, `dx`, `dw` and `db` agreement at `test_layer_norm(1151, 8192, torch.float16)`, keep the lock protocol and both reduction stages, derive the vector-Jacobian product with row means, and record the higher-order limitation in tests.
7. Reconstruct one GEMM configuration down to layouts, copy atoms and MMA atoms: give the element address of `A(i, j)` for layout `(M, K):(1, ldA)`, compute `cosize` 1031 for the padded shared layout with shape `(128, 8)` and stride `(1, 129)` from maximum offset 1030, and compare the blocked Triton program with the equivalent CuTe mapping stage by stage. Write the tutorial mainloop order (`copy`, `cp_async_fence`, `cp_async_wait`, `__syncthreads`, `gemm`, `__syncthreads`) with what each barrier waits for, and map a fused tiled matmul plus ReLU (non-multiple `M`, `N`, `K`) to copy stage, fp32 MMA accumulation and fused epilogue.
8. Wrap a Triton softmax (LeetGPU challenge 5) in device, dtype, shape and contiguity dispatch with a `torch.softmax` fallback: fast path for contiguous fp32 rows under 8192 columns, library fallback otherwise. Add a version-pinned regression test over held-out non-multiple shapes that fails when `cuobjdump -res-usage` registers change across a compiler update. Record CUDA Tile IR as reading only on this toolchain.

**Deliverables**

- Matched CUDA and Triton kernels with shared tests, precision pins and losing shapes.
- Autotune evidence with `student_local_test.py` results, cold against warm compile timings, codegen dumps with `n_regs` 26 and `.reqntid 128`, and the dynamo break reports.
- The CuTe GEMM reconstruction beside the Triton blocked program, the custom LayerNorm op, and versioned dispatch with fallback and the register-change regression.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [LeetGPU CUDA and Triton parity set run locally](https://leetgpu.com/challenges/). Re-solve one primitive, one GEMM and one transformer challenge in Triton with matched CUDA twins locally against `reference_impl`.
- external-tests: [CSE 291A PA2 Part 1 local tests](https://github.com/hao-ai-lab/cse-dsc291-s26-pa/tree/main/pa2). Run `student_local_test.py` locally; replace the remote speedup score with interleaved timing against PyTorch.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Parity with pins | CUDA and Triton twins pass identical tests including tails and non-powers of two, precision is pinned before timing, and losing shapes are kept. | The `REG:12` and `SHARED:0` lines are quoted from your own build. |
| Autotune and lowering honesty | The second autotuned launch skips benchmarking, cold against warm compile costs are separated, dynamo break counts are quoted from your own run, and generated PTX and SASS assumptions are checked. | Guards that trigger recompiles are named per case. |
| Reconstruction and dispatch | The CuTe reconstruction reaches layouts, copy atoms and MMA atoms with `cosize` 1031 derived, and the dispatch test covers native, forced fallback and register-change branches with fallback correctness. | The LayerNorm VJP is derived with row means stated and the higher-order limit is tested. |

Feeds into: Capstone suite and integration: matched paths, autotune gates, lowering evidence and dispatch with fallback feed the endpoint and the final portability defense.

### Resource route

- **Primary - Tutorial:** [Triton Programming Guide and Tutorials](https://triton-lang.org/main/getting-started/tutorials/) - Complete the vector add, fused softmax, matrix multiplication, LayerNorm and fused-attention tutorials that run on your hardware. For each, add adversarial tails, independent references, cold and warm timing, resource inspection and a correct fallback.
- **Required - Assignment:** [UCSD CSE 291A/DSC 291 (Spring 2026) PA2 Part 1 - Triton matmul, add and ReLU](https://github.com/hao-ai-lab/cse-dsc291-s26-pa/tree/main/pa2) - Implement the fused kernel and its configuration search, and test with `student_local_test.py` on your own GPU. The remote grader needs a course token, so replace its speedup score with your own interleaved timing against the PyTorch reference.
- **Support - Practice:** [TensorTonic Language Modeling from Scratch - Triton problems](https://www.tensortonic.com/study-plans/language-modeling-from-scratch) - Solve Masked Triton GELU Kernel, Tiled Triton Row Sum, Triton Row-Wise Softmax and Fused Tiled Matmul and ReLU, and rerun each with your own adversarial shapes.
- **Required - Book:** [AI Systems Performance Engineering - Chapter 14](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) - Read Chapter 14 on the PyTorch compiler, OpenAI Triton and XLA backends. Trace one framework operation from graph capture through generated GPU code, and identify graph breaks and specialization guards.
- **Support - Lab:** [AI Systems Performance Engineering companion code - Chapters 9, 10, 13 and 14](https://github.com/cfregly/ai-performance-engineering/tree/main/code) - Use `code/ch09`, `code/ch10`, `code/ch13` and `code/ch14` selectively for Triton, warp specialization, persistent kernels and compiler comparisons. Strip local compatibility shims when diagnosing upstream failures and record every guard in the measurement context.
- **Required - Documentation:** [CUTLASS 3.x Design and CuTe Layout Algebra](https://docs.nvidia.com/cutlass/latest/media/docs/cpp/cutlass_3x_design.html) - Study the collective and kernel hierarchy, then the CuTe layout algebra guide. Reconstruct one GEMM configuration down to layouts, copy atoms and MMA atoms and compare it with the equivalent Triton blocked program.
- **Required - Practice:** [LeetGPU - CUDA and Triton Parity Set](https://leetgpu.com/challenges/) - Re-solve one primitive, one GEMM and one transformer challenge from GPU-4 through GPU-6 in Triton. Compare CUDA, Triton, compiler and library paths on identical tests and hardware; leaderboard rank does not replace local raw evidence.
- **Support - Lectures:** [GPU MODE - Triton, CuTe and Machine Code](https://github.com/gpu-mode/lectures) - Use Lectures 14, 15, 29, 37, 57, 86, 103, 104 and 114 selectively. Assign one lecture to each actual implementation question rather than watching the collection linearly.
- **Reference - Specification:** [PTX ISA and CUDA Binary Utilities](https://docs.nvidia.com/cuda/cuda-binary-utilities/) - Inspect generated PTX and SASS for the matched CUDA and Triton kernels. Check instruction, memory-space and target assumptions in the versioned ISA and use binary tools to confirm which device code ships.
- **Depth - Documentation:** [CUDA Tile IR Programming Model](https://docs.nvidia.com/cuda/tile-ir/latest/sections/prog_model.html) - Read the programming model and inspect the official repository after CUDA, Triton and CuTe mappings are clear. Implement one tiny parity kernel only if the toolchain supports it and record compiler-version constraints.
- **Depth - Book:** [Modern GPU Programming for MLSys - TIRx](https://mlc.ai/modern-gpu-programming-for-mlsys/) - Use Parts II and III plus the compiler reference as a Blackwell-specific comparison of layouts, dispatch, TMA pipelines and persistent scheduling. Do not make TIRx a required dependency for the portable track.
- **Support - Lectures:** [MIT 6.S894 Lecture 10 - Domain Languages and Accelerators](https://accelerated-computing.academy/fall25/lectures/slides/Lecture10.pdf) - Use the Higher-level kernel languages slides comparing Triton, Pallas, cuTile (Tile IR) and the CuTe DSL on mapping, effort and performance for the programming-model comparison. Do not use the TPU lab.

### Exit checkpoint

Implement the same nontrivial kernel in CUDA and Triton, reconstruct the lowering and resource behavior, correctness-gate autotuning and dispatch, and preserve compiler or library fallback across unseen shapes and one version change.

<details>
<summary>Deliberately left for later</summary>

- Collecting DSLs without a shared kernel and evidence contract
- Writing a complete compiler backend before generated-code inspection and dispatch are reliable
- Blackwell-only TIRx or CUDA Tile work when the required toolchain is unavailable

</details>

## GPU-8. Kernel-to-Inference Integration

**Why:** A fast isolated kernel matters only when the engine actually dispatches it and the request-level bottleneck moves. This stage integrates one custom path, traces scheduling and memory interactions, and measures TTFT, TPOT, goodput, memory and output quality together.

### Learn this much

- [ ] Framework operator, dispatcher, backend and kernel selection path _(Required)_
- [ ] PyTorch profiler, NVTX and CPU-GPU trace correlation _(Required)_
- [ ] Operator graph, fusion groups and generated kernels _(Required)_
- [ ] Launch overhead, CUDA graphs, bucketing and eager fallback _(Required)_
- [ ] Queue, prefill, decode, sample and completion lifecycle at performance depth _(Required)_
- [ ] Continuous batching effects on kernel shapes and occupancy _(Required)_
- [ ] Key-value allocation, paging, fragmentation and address mapping _(Required)_
- [ ] Prefix reuse, cache identity and kernel shape changes _(Required)_
- [ ] Chunked prefill, decode interference and kernel scheduling _(Required)_
- [ ] Weight, activation and key-value quantized kernel dispatch _(Required)_
- [ ] Speculative decoding verification cost and batch shape _(Required)_
- [ ] Structured decoding masks, CPU interaction and kernel gaps _(Required)_
- [ ] Fair scheduling and heterogeneous request sizes _(Required)_
- [ ] Long-context prefill and memory-capacity regimes _(Required)_
- [ ] Multimodal encoder and decoder co-execution _(Optional)_
- [ ] Custom operator build, registration, stream and lifetime contracts _(Required)_
- [ ] Workspace, metadata, layout, graph and capture-safe kernel interface _(Required)_
- [ ] vLLM, SGLang and FlashInfer component boundaries _(Required)_
- [ ] Token, distribution or task-quality equivalence after optimization _(Required)_
- [ ] Endpoint-derived shape and arrival distribution _(Required)_
- [ ] TTFT, TPOT, memory, throughput and goodput measurement _(Required)_
- [ ] Production engine and vendor-library baseline _(Required)_
- [ ] Attribution from kernel change to request-level effect _(Required)_
- [ ] Dispatch overhead, graph misses and workload-weighted losing regimes _(Required)_
- [ ] Versioned regression gate, fallback and rollback _(Required)_
- [ ] Complete scheduler, cache and serving-platform implementation _(Later)_

### Study units

#### U1. Operator dispatch, trace correlation and fusion groups

**About 4 h** · **Target:** Measure

Topics: Framework operator, dispatcher, backend and kernel selection path; PyTorch profiler, NVTX and CPU-GPU trace correlation; Operator graph, fusion groups and generated kernels

A faster kernel changes nothing when the framework dispatches a different path. The trace shows which path ran and where time actually went.

**You can now**

- Trace one framework operator from dispatcher through backend to executed kernels and name each boundary.
- Capture correlated PyTorch-profiler and NVTX timelines and attribute one host gap before reading kernel counters.
- Identify one fusion group and state which launches and materializations it removes.

**Study**

1. [PyTorch profiler, NVTX and Nsight timelines](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 13, 15 and 16) - Chapter 13, NVTX Markers and Profiling Tools; Profiling PyTorch to Identify Bottlenecks: Using PyTorch Profiler; System Profiling with Nsight Systems and NVTX Timelines.
2. [Exact profiler and range call contracts](https://docs.pytorch.org/docs/2.14/profiler.html) (PyTorch 2.14 Profiler) - Overview example with `activities`, `schedule` and `on_trace_ready`; API reference for `torch.profiler.profile` parameters `activities`, `record_shapes` and `with_stack`, `torch.profiler.record_function` and `export_chrome_trace`.
3. [Whole-graph versus regional compile boundary](https://github.com/cfregly/ai-performance-engineering/blob/b57e4c6a9e261c09ac09208705d040c81b03d35e/code/ch13/baseline_regional_compile.py) (AI Systems Performance Engineering companion code - Chapters 12 to 16) - `TinyTransformerBlock` and `BaselineFullGraphCompileBenchmark` in `baseline_regional_compile.py` versus `RegionalMLP` with `compile_mlp` and `OptimizedRegionalCompileBenchmark` in `optimized_regional_compile.py`.

**Focus**

- Follow one `aten` operator to its CUDA API call and kernel in both the profiler table and the `nsys` timeline. Name the dispatcher, backend, launch and kernel boundaries.
- Label each phase with `torch.profiler.record_function` and `torch.cuda.nvtx.range`. A CPU range ending does not prove its GPU work finished.
- Compare the whole-block and MLP-only compile pair: regional compile keeps dynamic-shape regions eager to avoid recompilation while fusing the compute-heavy subgraph.

**Reproduce:** Without notes, profile a 1024 by 1024 `torch.float32` CUDA matrix multiply wrapped in `torch.profiler.record_function("mm")` and `torch.cuda.nvtx.range("mm")`. Capture a short `nsys profile --trace=cuda,nvtx --sample=none --cpuctxsw=none` trace, follow one `aten::mm` entry to its kernel, and reconcile profiler CUDA time with the union of kernel intervals and completed wall time.

**Traps**

- Reading profiler CUDA time as kernel latency when CUPTI is unavailable. The table then falls back to legacy timing without a device trace.
- Treating `record_shapes=True` or `with_stack=True` as free. Both add overhead and hold tensor references during capture.
- Calling a fused graph faster without checking which materialization it removed. Count launches and intermediates before and after.

**Practice**

- [Companion code ch13: whole-graph versus regional compile trace](https://github.com/cfregly/ai-performance-engineering/blob/b57e4c6a9e261c09ac09208705d040c81b03d35e/code/ch13/optimized_regional_compile.py) - Run `python -m cli.aisp bench run --targets ch13:regional_compile --profile minimal` (plain `python -m ch13.compare` runs every pair in the chapter), then capture profiler and `nsys` traces for both variants and attribute one dispatch or fusion difference. Keep runs short on a 6 GB GPU. No public autograder checks the trace; retain both traces and your boundary notes.

**Stop when:** Your trace connects one operator to source, API call and kernel, attributes one host gap, and names the fusion boundary with its removed launches.

<details>
<summary>Self-test</summary>

1. Does the end of an NVTX range prove the kernel it launched has finished?
   - No. The range ends when host code ends. GPU completion needs event synchronization or trace correlation.
2. Two kernels each run 5 ms fully overlapped. What device busy time do they establish?
   - 5 ms, the union of their intervals. Summing them to 10 ms double-counts overlap.
3. Why does the regional-compile pair keep attention and LayerNorm eager?
   - Those regions carry dynamic shapes and masks that would trigger recompilation. Fusing only the MLP keeps the gain without the recompile cost.
4. Profiler shows one `aten::add` but the timeline shows no kernel. What is the most likely cause?
   - The op ran on the CPU (a CPU tensor or scalar path), or the CUDA activity was not captured: no `ProfilerActivity.CUDA`, CUPTI unavailable, or the kernel fell outside the capture window. Check the device and the profiler activities before blaming the kernel.

</details>

#### U2. Launch overhead, CUDA graphs, bucketing and graph misses

**About 4 h** · **Target:** Measure

Topics: Launch overhead, CUDA graphs, bucketing and eager fallback; Dispatch overhead, graph misses and workload-weighted losing regimes

Small decode steps are often launch-bound, not kernel-bound. Graphs remove the host overhead only for stable shapes with a tested fallback.

**You can now**

- Measure per-launch overhead with interleaved event trials and report medians, not best runs.
- Capture and replay a stable kernel sequence in a CUDA graph with static buffers and an eager fallback.
- Name one bucketing or graph-miss regime where graphs lose and show the measured crossover.

**Study**

1. [Capture, replay and graph best practice](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 13, 15 and 16) - Chapter 13, Reducing Kernel Launch Overhead with CUDA Graphs: Capturing a CUDA Graph and Preallocating Memory; Replaying the Graph; Best Practices for CUDA Graphs. Depth: The book says any allocation during capture fails. In PyTorch 2.14.1, `torch.cuda.graph` serves capture-time allocations from the graph's private memory pool; host synchronization such as `torch.cuda.synchronize()` or `.item()` is what fails. Preallocate static buffers anyway so addresses and memory stay predictable.
2. [Eager launches versus graph replay](https://github.com/cfregly/ai-performance-engineering/blob/b57e4c6a9e261c09ac09208705d040c81b03d35e/code/ch12/baseline_cuda_graphs.py) (AI Systems Performance Engineering companion code - Chapters 12 to 16) - `BaselineCudaGraphsBenchmark` in `baseline_cuda_graphs.py` versus `OptimizedCudaGraphsBenchmark` in `optimized_cuda_graphs.py` (`N = 1024`, 32000 iterations); diagnostic in `graph_replay_benchmark.py`.
3. [Piece graphs and shape bucketing](https://github.com/cfregly/ai-performance-engineering/blob/b57e4c6a9e261c09ac09208705d040c81b03d35e/code/ch16/baseline_piece_graphs.py) (AI Systems Performance Engineering companion code - Chapters 12 to 16) - `BaselinePieceGraphsBenchmark` in `baseline_piece_graphs.py` versus `OptimizedPieceGraphsBenchmark` in `optimized_piece_graphs.py` with `RegionalPieceGraph` in `piece_graphs_model.py`.

**Focus**

- Name the timed boundary before comparing: per-launch overhead, captured replay, or end-to-end step. Keep warmup, capture and steady-state replay in separate intervals.
- Capture on a side stream with static input buffers. Tensors allocated during capture come from the graph's private pool and keep fixed addresses, so copy new inputs into the captured buffers; any shape change after capture needs a new graph or bucket.
- Bucket one graph per stable shape and keep an eager fallback. A replay on an unseen shape silently computes the wrong geometry or fails to launch.

**Reproduce:** Time 200 eager launches of a 1024-element vector add against 200 `graph.replay()` calls with CUDA events, interleaved in pairs with a recorded seed, and report both medians. On an RTX 3050 6 GB with PyTorch 2.14.1 and driver 595.99, six runs of 41 interleaved pairs gave eager medians from 2.4 to 13.5 us per launch and replay medians from 1.8 to 7.2 us as host load changed; replay was 1.4 to 1.9 times faster in every run. Record host load with your medians; replay must not exceed eager on this shape, and any shape change needs recapture.

**Traps**

- Synchronizing with the host inside the capture region, through `torch.cuda.synchronize()` or a value read back with `.item()`. The capture fails, so move such checks before capture or into the replayed outputs.
- Timing capture or warmup inside the steady-state interval and calling that replay latency.
- Keeping one graph for all shapes. Unseen geometry replays stale work; bucket explicitly and test the fallback.

**Practice**

- [Companion code ch12: CUDA-graph capture and replay pair](https://github.com/cfregly/ai-performance-engineering/blob/b57e4c6a9e261c09ac09208705d040c81b03d35e/code/ch12/baseline_cuda_graphs.py) - Run `python -m cli.aisp bench run --targets ch12:cuda_graphs --profile minimal` (plain `python -m ch12.compare` runs every pair in the chapter) and the standalone `graph_replay_benchmark.py` diagnostic; then capture one stable 32-step sequence and compare interleaved eager versus replay medians with a fallback path. Needs CUDA. Keep each run short. No public autograder checks the graph; retain event medians, capture logs and the fallback test.

**Stop when:** You report interleaved eager and replay medians with explicit boundaries, a passing fallback test, and one measured losing regime.

<details>
<summary>Self-test</summary>

1. What does graph replay remove from a stable sequence?
   - It removes per-launch host overhead and idle gaps between kernels. It does not shorten the kernels themselves.
2. Why does a shape change after capture need recapture?
   - The replay reuses captured addresses and launch geometry. A new shape needs a new capture or bucket; otherwise the run reads stale buffers or fails.
3. Name one regime where CUDA graphs lose.
   - When capture, bucket lookup, or replay setup exceeds the saved launch overhead, or when misses force frequent fallback. Small stable batches win; ragged dynamic shapes lose.

</details>

#### U3. Request lifecycle, continuous batching and the kernel shapes it creates

**About 4 h** · **Target:** Explain + Measure

Topics: Queue, prefill, decode, sample and completion lifecycle at performance depth; Continuous batching effects on kernel shapes and occupancy; Fair scheduling and heterogeneous request sizes

Serving performance comes from the live request mix, not one kernel shape. The lifecycle decides which kernels run at which width every iteration.

**You can now**

- Explain the queue, prefill, decode, sample and completion lifecycle at performance depth.
- Predict how continuous batching changes live batch size, kernel shapes and occupancy for a stated arrival mix.
- Measure one fair-scheduling effect with heterogeneous request sizes.

**Study**

1. [Dynamic, continuous and scheduled batching](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 13, 15 and 16) - Chapter 16, Dynamic Batching; Continuous Batching; Continuous Scheduling.
2. [Iteration-level scheduling mechanism](https://www.usenix.org/system/files/osdi22-yu.pdf) (Orca (OSDI 2022)) - Sections 3 to 4, iteration-level scheduling and selective batching with Algorithm 1 and Figures 2 to 5.
3. [Static draining versus dynamic insert](https://github.com/cfregly/ai-performance-engineering/blob/b57e4c6a9e261c09ac09208705d040c81b03d35e/code/ch15/baseline_continuous_batching.py) (AI Systems Performance Engineering companion code - Chapters 12 to 16) - `BaselineContinuousBatchingBenchmark` with `dynamic=False` in `baseline_continuous_batching.py` versus `dynamic=True` in `optimized_continuous_batching.py` on `ContinuousBatchingBase`.

**Focus**

- A request moves through queue, prefill, decode steps, sampling and completion. Continuous batching refills finished slots every iteration instead of waiting for the longest sequence.
- Selective batching splits the work: linear and norm layers batch broadly while attention runs per request with its own KV. Kernel shapes therefore track the live mix, not the configured maximum.
- Heterogeneous lengths set occupancy and latency: one long prefill can stall short decodes in the same iteration, which fair scheduling and token budgets bound.

**Reproduce:** Closed-book, work a four-request mix with decode lengths 10, 10, 10 and 100 under static batching versus continuous batching. Show static batching holds all slots until length 100 while continuous batching frees three slots at length 10, and state which kernel dimensions shrink when the live batch drops from 4 to 1.

**Traps**

- Calling any batching continuous because requests share a server. Only per-iteration refill with independent completion counts.
- Assuming live batch size equals configured maximum. Finished slots empty the kernels below their configured width.
- Reading higher throughput as lower latency for every request. Batching can delay a single request while raising aggregate tokens per second.

**Practice**

- [Companion code ch15: continuous batching pair](https://github.com/cfregly/ai-performance-engineering/blob/b57e4c6a9e261c09ac09208705d040c81b03d35e/code/ch15/baseline_continuous_batching.py) - Run `python -m cli.aisp bench run --targets ch15:continuous_batching --profile minimal` (plain `python -m ch15.compare` runs every pair in the chapter); compare padded static draining against dynamic insert-on-completion on one arrival mix and report tokens per second and queue wait. Single-GPU run is enough. No public autograder scores the schedule; retain the arrival mix, both throughputs and the kernel-shape notes.

**Stop when:** You can walk one request through every lifecycle stage and show measured throughput and queue-wait differences for static versus continuous draining on one mix.

<details>
<summary>Self-test</summary>

1. What makes batching continuous rather than static?
   - Per-iteration membership: finished requests leave and waiting ones join every token step, without waiting for the longest sequence.
2. Why do linear layers and attention see different batch shapes in one iteration?
   - They batch across requests while attention needs per-request KV and masks. The batched layers see the live batch width; attention sees per-request sequence state.
3. How does one long request hurt short ones in a shared iteration?
   - A long prefill occupies the iteration and delays short decodes sharing it. Token budgets and scheduling priorities bound that stall.

</details>

#### U4. Paged KV allocation and prefix reuse at kernel level

**About 4 h** · **Target:** Explain + Derive

Topics: Key-value allocation, paging, fragmentation and address mapping; Prefix reuse, cache identity and kernel shape changes

KV memory sets how many requests fit and which prefixes skip compute. Block tables and reuse identity decide both.

**You can now**

- Derive block-table translation, slot waste and per-token KV bytes for a stated model and block size.
- Explain prefix-reuse cache identity, including what the hash covers and why partial blocks miss.
- Quantify fragmentation and memory-capacity effects on one engine run.

**Study**

1. [Blocks, manager and scheduling interaction](https://arxiv.org/html/2309.06180v1) (PagedAttention and vLLM) - Sections 4.1 to 4.2, PagedAttention and KV Cache Manager with Figures 5 to 7; Section 4.5, Scheduling and Preemption.
2. [Radix tree reuse and cache-aware scheduling](https://arxiv.org/html/2312.07104v2) (SGLang) - Section 3, Efficient KV Cache Reuse with RadixAttention, with Figure 3; Appendix A.2, Algorithm 1 cache-aware scheduling pseudocode.
3. [Allocation, pooling and radix reuse lab](https://github.com/cfregly/ai-performance-engineering/blob/b57e4c6a9e261c09ac09208705d040c81b03d35e/code/ch15/baseline_kv_cache_management.py) (AI Systems Performance Engineering companion code - Chapters 12 to 16) - `BaselineKVCacheManagementBenchmark` in `baseline_kv_cache_management.py` versus `OptimizedKVCacheManagementBenchmark` in `optimized_kv_cache_management.py`; `RadixTree` and `KVCache` in `ch16/radix_attention_example.py`.

**Focus**

- A logical token position maps through a block table to a physical block. Blocks are fixed-size pages, so a 40-token sequence with block size 16 occupies three size-16 blocks holding 16, 16 and 8 tokens, with 8 wasted slots.
- Only full blocks enter the reuse cache under a hash of parent hash plus block tokens plus extras such as image hashes. A partial final block never hits.
- Sharing is reference-counted with LRU eviction. Freeing appends tail blocks first because they hash more context and are less likely to be reused.

**Reproduce:** Closed-book, derive per-token KV bytes as $`2 \times L \times H_{\text{kv}} \times D \times B`$ with $`L`$ layers, $`H_{\text{kv}}`$ KV heads, $`D`$ head dim and $`B`$ bytes per value. For $`L = 32`$, $`H_{\text{kv}} = 8`$, $`D = 128`$, FP16, get 131072 bytes (128 KiB) per token. Then place a 40-token sequence in block size 16 and report 3 blocks with 8 wasted slots.

**Traps**

- Counting cached bytes as free memory. Shared blocks are live for every referencing request until all release them.
- Expecting reuse for a shared prefix shorter than one block. Nothing is cached until a full block completes.
- Treating the block hash as the tokens alone. Parent context and extras are part of identity; dropping them causes wrong reuse.

**Practice**

- [Companion code ch15 and ch16: KV management and radix reuse](https://github.com/cfregly/ai-performance-engineering/blob/b57e4c6a9e261c09ac09208705d040c81b03d35e/code/ch15/baseline_kv_cache_management.py) - Run `python -m cli.aisp bench run --targets ch15:kv_cache_management --profile minimal` (plain `python -m ch15.compare` runs every pair in the chapter) and `ch16/radix_attention_example.py`; show a shared-prefix hit against a miss with block tables and hit counters retained. Single-GPU run is enough. No public autograder checks reuse; retain block tables, hit rates and the capacity notes.

**Stop when:** You derive block placement, waste and KV bytes for an unseen shape and predict hit or miss for a stated prefix pair.

<details>
<summary>Self-test</summary>

1. Why does fixed-size paging beat one contiguous reservation per request?
   - It avoids external fragmentation from variable-length reservations. Waste is bounded to one partial block per sequence instead of one oversized reservation.
2. Two requests share 10 tokens with block size 16. Why is there no reuse?
   - Only full blocks are hashed and cached. The partial tail has no stable identity until it fills.
3. What does a vLLM prefix-cache hash cover beyond token IDs?
   - Parent hash plus block tokens plus extras such as LoRA IDs, image hashes or cache salts. Same text with a different image or salt hashes differently.

</details>

#### U5. Chunked prefill, decode interference and long-context regimes

**About 3 h** · **Target:** Measure

Topics: Chunked prefill, decode interference and kernel scheduling; Long-context prefill and memory-capacity regimes

Long prompts stall every decode sharing the iteration. Chunking and placement bound that stall without changing the attention bill.

**You can now**

- Explain chunked prefill, decode interference and the token-budget rule.
- Predict per-iteration latency and KV-transfer cost for a stated chunk size and live batch.
- Identify the long-context regime where chunking or disaggregation stops paying.

**Study**

1. [Chunked scheduling and interference](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 13, 15 and 16) - Chapter 16, Stall-Free Scheduling (Chunked Prefill); Chapter 15, Prefill-Decode Interference and Impact on Latency (TTFT) and Throughput (TPOT).
2. [Stall-free batching mechanism](https://arxiv.org/html/2403.02310v3) (Sarathi-Serve) - Sections 4.1 to 4.3, chunked-prefills, stall-free batching with Algorithm 3, and token-budget selection; Figure 9, coalescing cost.
3. [Staged versus peer KV handoff](https://github.com/cfregly/ai-performance-engineering/blob/b57e4c6a9e261c09ac09208705d040c81b03d35e/code/ch15/baseline_prefill_decode_disagg.py) (AI Systems Performance Engineering companion code - Chapters 12 to 16) - `HostStagedPrefillDecodeDisaggBenchmark` and `PeerPrefillDecodeDisaggBenchmark`, both defined in `prefill_decode_disagg_common.py` and instantiated in `baseline_prefill_decode_disagg.py` and `optimized_prefill_decode_disagg.py`.

**Focus**

- Chunked prefill splits a long prompt into fixed-size chunks that join decode iterations. Total attention work is unchanged; per-iteration latency is bounded by the token budget.
- Stall-free batching never pauses decodes to admit a prefill. The scheduler picks a chunk size that fits the token budget alongside live decodes.
- Long-context prefill is compute-bound with large activation memory while decode stays memory-bound. Placement and KV-transfer cost decide whether disaggregation pays.

**Reproduce:** Closed-book, chunk a 20000-token prompt into 5000-token chunks alongside 8 live decodes with a stated token budget. Show 4 chunks, state which decodes share each iteration, and explain why total attention work is unchanged while the worst per-iteration latency falls.

**Traps**

- Calling chunked prefill cheaper in total FLOPs. It bounds latency per iteration; the attention bill stays the same.
- Measuring TTFT on an empty server and promising it under load. Interference appears only with live decodes sharing iterations.
- Ignoring KV-handoff cost in a disaggregation win. Transfer and scheduling can exceed the stall saved.

**Practice**

- [Companion code ch15: disaggregated prefill-decode pair](https://github.com/cfregly/ai-performance-engineering/blob/b57e4c6a9e261c09ac09208705d040c81b03d35e/code/ch15/baseline_prefill_decode_disagg.py) - Run `python -m cli.aisp bench run --targets ch15:prefill_decode_disagg --profile minimal` (plain `python -m ch15.compare` runs every pair in the chapter); compare `HostStagedPrefillDecodeDisaggBenchmark` against `PeerPrefillDecodeDisaggBenchmark` on one prompt length and live batch, and report TTFT, TPOT and handoff cost. Single-GPU emulation is enough. No public autograder scores the handoff; retain the length, batch, TTFT, TPOT and transfer notes.

**Stop when:** You can set a chunk size and token budget for a stated mix and defend the choice with measured TTFT and TPOT.

<details>
<summary>Self-test</summary>

1. Does chunking reduce total prefill FLOPs?
   - No. The same query-key pairs are scored; they are spread across iterations so one iteration never carries the full prefill.
2. What is prefill-decode interference?
   - It stalls latency-sensitive decodes behind one long compute-bound prefill, raising time per output token. Chunking bounds that stall.
3. When does disaggregation stop paying?
   - When transfer plus scheduling overhead exceeds the interference saved, or when the live batch is too small to fill the freed iterations.

</details>

#### U6. Quantized dispatch, speculative verification and structured-decoding gaps

**About 5 h** · **Target:** Explain + Measure

Topics: Weight, activation and key-value quantized kernel dispatch; Speculative decoding verification cost and batch shape; Structured decoding masks, CPU interaction and kernel gaps

These three paths change what the engine executes every step. Each wins only inside its acceptance, error and schema regime.

**You can now**

- Explain quantized dispatch, speculative acceptance and structured-mask costs with their batch-shape effects.
- Measure one quantized, one speculative and one guided path against exact-match and quality gates.
- Name the batch shape or schema where each path stops paying.

**Study**

1. [Quantization, dequant fusion and constrained decoding](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 13, 15 and 16) - Chapter 16, Quantization Approaches for Real-Time Inference: Reducing Precision from FP16 to FP8 and FP4; Weight-Only Quantization (GPTQ, AWQ); Fusing Quantization-Dequantization Steps into the Execution Graph; Chapter 15, Constrained Decoding Performance Implications.
2. [Verification cost model](https://proceedings.mlr.press/v202/leviathan23a/leviathan23a.pdf) (Fast Inference from Transformers via Speculative Decoding) - Sections 2 to 3, draft-verify-accept loop, acceptance rule, resampling distribution and walltime-versus-operations analysis. The paper names $`p`$ the target and $`q`$ the draft distribution; this unit and LeetGPU 87 swap the letters, so its rule reads $`\alpha = \min(1, q/p)`$ with $`p`$ the draft.
3. [Mask reuse and weight-only quantization labs](https://github.com/cfregly/ai-performance-engineering/blob/b57e4c6a9e261c09ac09208705d040c81b03d35e/code/ch15/baseline_guided_decoding.py) (AI Systems Performance Engineering companion code - Chapters 12 to 16) - `GuidedDecodingBenchmark` (defined in `guided_decoding_common.py`) with `reuse_gpu_mask=False` in `baseline_guided_decoding.py` versus `reuse_gpu_mask=True` in `optimized_guided_decoding.py`; `ch16/baseline_awq_gptq_smoothquant.py` versus `ch16/optimized_awq_gptq_smoothquant_awq.py`.

**Focus**

- Quantized dispatch changes scales, granularity and accumulation, not just storage. Per-token scales dequantize as $`K_{\text{float}}[h, s, d] = K_{\text{int8}}[h, s, d] \times k_{\text{scale}}[h, s]`$; verify error against task tolerance, not just kernel error.
- Speculative verification accepts draft token $`t`$ with probability $`\alpha = \min(1, q/p)`$, where $`p`$ is the draft probability and $`q`$ the target probability. Rejection resamples from the normalized positive part of $`q - p`$ and ends that sequence's accepted run.
- Structured decoding pays for masks and host interaction every step. A GPU-resident reused mask removes the per-step rebuild; measure its cost per schema, not as a constant.

**Reproduce:** Closed-book, verify the LeetGPU 87 worked example: draft `[1, 2, 0]` with the given draft and target probabilities and uniform samples `[0.50, 0.70, 0.30, 0.90]`. Accept position 0 ($`\alpha = 0.50/0.60 = 0.83`$, $`0.50 < 0.83`$), reject position 1 ($`\alpha = 0.20/0.50 = 0.40`$, $`0.70 > 0.40`$), resample token 3 from normalized `[0.667, 0, 0, 0.333]`, and emit `[1, 3, 0, 0]`.

**Traps**

- Reading a high acceptance rate as a speedup. Verification adds a full batched forward; low acceptance wastes it.
- Comparing quantized and dense paths by kernel time alone. Scale, granularity and accumulation change error; gate by task quality.
- Treating structured decoding as free once correct. Mask builds and host round trips scale with schema complexity and batch width.

**Practice**

- [LeetGPU 87 Speculative Decoding Verification](https://leetgpu.com/challenges/speculative-decoding-verification) - Challenge 87 in `challenges/medium/87_speculative_decoding_verification/challenge.py`: implement `solve` and pass the accept-all, reject-first and mixed functional tests plus the `B = 64`, `T = 8`, `V = 32768` performance test. Run it on LeetGPU or locally against `reference_impl` from `challenge.py` as in the CUDA primitives section. Keep correctness tests beyond the hosted score.
- [LeetGPU 96 INT8 KV Cache Attention](https://leetgpu.com/challenges/int8-kv-cache-attention) - Challenge 96 in `challenges/medium/96_int8_kv_cache_attention/challenge.py`: implement `solve` with per-token dequantization and `1 / sqrt(head_dim)` scaling; check the `num_heads = 1`, `seq_len = 3`, `head_dim = 4` example giving `[5.00, 6.00, 7.00, 8.00]`. Run it on LeetGPU or locally against `reference_impl` from `challenge.py` as in the CUDA primitives section. Test adversarial scales and sequence tails locally.

**Stop when:** You report measured acceptance length, quantized error and mask overhead on one batch shape plus the regime where each path loses.

<details>
<summary>Self-test</summary>

1. What does lossless speculative decoding guarantee?
   - It preserves the target distribution up to floating-point limits: accepted drafts follow it and resamples come from the adjusted difference. Greedy equality tests check the implementation, not the proof.
2. Why does speculative decoding depend on batch shape?
   - Batch width changes arithmetic intensity and memory traffic per step. Verification adds a batched target forward that pays only when acceptance is high enough at that width.
3. Where does guided-decoding overhead come from?
   - A per-step CPU mask rebuild plus host interaction. Reusing a GPU-resident mask removes the rebuild; the book reports that complex grammars or small batches can still cost double-digit percent.

</details>

#### U7. Multimodal encoder and decoder co-execution

**About 2 h** · **Target:** Explain

Topics: Multimodal encoder and decoder co-execution

Images enter as embedding runs inside a text request. Their encoding and hashing decide both batch geometry and reuse safety.

**You can now**

- Explain encoder and decoder co-execution and how encoder batches change decode geometry.
- State the multimodal prefix-hash rule and one false-sharing failure it prevents.

**Study**

1. [Multimodal throughput and reuse evidence](https://arxiv.org/html/2312.07104v2) (SGLang) - Section 6.2 with Table 2: throughput for LLaVA-v1.5-7B images on one A10G 24 GB and LLaVA-NeXT-34B video on one 80 GB A100 (Appendix C), and the RadixAttention hit rates reported from deployment.
2. [Multimodal block-hash rule](https://docs.vllm.ai/en/v0.31.0/design/prefix_caching/) (vLLM Documentation - Automatic Prefix Caching) - Automatic Prefix Caching (vLLM v0.31.0), hashing example with multi-modality inputs: placeholder runs, per-block image-hash extras, block size 16 with 41 placeholders.

**Focus**

- The encoder runs once per image or segment while the decoder steps per token. Co-execution shares the scheduler, KV pool and batch slots, so encoder work changes decode batch geometry.
- Image regions become placeholder token runs replaced by embeddings at prefill. Prefix identity must hash the image content, not just the placeholder IDs, or different images falsely share KV.
- Read Table 2 as a throughput comparison against the stated Transformers baseline on the stated GPUs, not as a universal speedup. The 52.4 and 74.1 percent hit rates come from a month of deployment, for LLaVA-NeXT-34B and the Vicuna-33B chat model, not from Table 2's runs.

**Reproduce:** Without notes, sketch one image-plus-text request through prefill and two decode steps: mark where the image encoder runs, which token range the embeddings replace, and which blocks are hashable for reuse when a second request shares the text but not the image.

**Traps**

- Batching images as if they were text tokens. Encoder capacity, placeholder expansion and embedding replacement follow different rules.
- Hashing only placeholder IDs. Different images then share KV and corrupt output.
- Reading a multimodal throughput table without its baseline, bench and hit rate. All three set the result.

**Practice**

- The section mini-project covers this: encoder-batch versus decoder-only timing and a multimodal prefix-hash identity check in your integrated endpoint.

**Stop when:** You can place encoder work on the lifecycle diagram and defend the prefix-hash rule for a shared-text, different-image pair.

<details>
<summary>Self-test</summary>

1. Where does encoder work sit in the request lifecycle?
   - It runs once per image input and feeds embeddings into prefill, while the decoder then steps token by token. Its batch slots and KV-pool share affect live decode geometry.
2. Do identical placeholder runs imply reusable KV?
   - No. Placeholders are identical token IDs; the block hash must include the image hash so different images map to different KV.
3. Does the multimodal throughput table promise a general speedup?
   - No. It compares stated model pairs on stated benches with stated hit rates. Different images, batch mixes or baselines change it.

</details>

#### U8. Integrating a custom operator with vLLM, SGLang and FlashInfer

**About 5 h** · **Target:** Implement

Topics: Custom operator build, registration, stream and lifetime contracts; Workspace, metadata, layout, graph and capture-safe kernel interface; vLLM, SGLang and FlashInfer component boundaries

Engines keep the scheduler and memory; kernels win only behind a stable interface with registration, workspace and fallback contracts.

**You can now**

- Build and register one custom operator with stream, lifetime and fallback contracts.
- Meet a workspace, metadata, layout and capture-safe kernel interface for one paged operation.
- Compare vLLM, SGLang and FlashInfer component boundaries for that operation.

**Study**

1. [Serving-kernel wrapper contract](https://docs.flashinfer.ai/api/attention.html) (FlashInfer) - FlashInfer 0.7.1 documentation, `BatchDecodeWithPagedKVCacheWrapper`: constructor with `float_workspace_buffer` and `kv_layout`, `plan` with `indptr`, `indices` and `last_page_len`, `run` with `q` and `paged_kv_cache`, `workspace_size` and `reset_workspace_buffer`; `use_cuda_graph` buffer rules.
2. [Plan-run and custom-op registration path](https://github.com/flashinfer-ai/flashinfer/blob/f2794d5890121e23c032520b57c50f9ea145437d/flashinfer/decode.py) (FlashInfer) - `BatchDecodeWithPagedKVCacheWrapper.plan` and `run` in `flashinfer/decode.py`; `get_batch_decode_module` with `register_custom_op` and `register_fake_op` in the same file.
3. [Alternative runtime architecture](https://arxiv.org/html/2312.07104v2) (SGLang) - Section 2, programming model with `gen` and `fork`; Section 3, RadixAttention reuse with cache-aware scheduling as the alternative component boundary.

**Focus**

- Caller-owned workspace comes first: allocate the 128 MB float buffer aligned to 16 bytes, call `plan` with `indptr`, `indices` and `last_page_len`, then reuse the plan across layers with `run`. `plan` never runs inside a graph or `torch.compile`.
- A graph-safe wrapper (`use_cuda_graph=True`) fixes the batch size and keeps metadata in caller-provided `indptr`, `indices` and `last_page_len` buffers sized for the largest page count. Re-plan outside capture to update their contents; a different batch size needs a new wrapper.
- Register the custom op with a fake implementation for shape inference, keep execution on the current PyTorch stream, and keep an eager fallback that passes the same differential tests.

**Reproduce:** Without notes, register the fused residual-add plus RMSNorm as a custom op with a fake shape rule, allocate the FlashInfer decode workspace, `plan` a batch of 7 requests in `NHD` layout with `page_size = 16`, and `run` one layer. State which buffers must stay stable for graph capture and which eager fallback runs on an unsupported dtype.

**Traps**

- Calling `plan` inside a captured graph. Planning copies metadata on the host; only `run` with stable bindings captures.
- Forgetting workspace alignment or zero-initialization on first use. Split-KV scratch then reads garbage.
- Shipping the fast path without a fallback. Unsupported dtypes, layouts or shapes must route to a tested eager path.

**Practice**

- [LeetGPU 83 Fused Residual Add RMS Norm, integrated locally](https://leetgpu.com/challenges/fused-residual-add-and-rms-norm) - Challenge 83 in `challenges/medium/83_fused_residual_add_rms_norm/challenge.py`: implement `solve`, pass the hosted tests, then wrap it as a `torch.library.custom_op` with a fake implementation and an eager fallback and integrate it into one small endpoint step with differential tests. Run it on LeetGPU or locally against `reference_impl` from `challenge.py` as in the CUDA primitives section. Do not stop at the hosted score: the local integration with fallback is the deliverable.

**Stop when:** Your op passes differential tests through both the custom path and the eager fallback, with a pinned plan-run interface and a stated unsupported-shape policy.

<details>
<summary>Self-test</summary>

1. Why does a custom op need a fake implementation?
   - Shape inference, compilation and autotuning need output metadata without launching kernels. The fake implementation supplies it; without it capture and compilation fail.
2. What is fixed once a graph-safe decode wrapper is created?
   - The batch size and the caller-provided `indptr`, `indices` and `last_page_len` buffers, plus the workspace binding. A plan with another batch size raises; re-planning rewrites those buffers in place, so captured `run` calls keep reading stable addresses.
3. Where does a custom kernel sit relative to vLLM, SGLang and FlashInfer?
   - vLLM owns scheduling plus paged blocks, SGLang owns radix reuse plus program-level caching, FlashInfer owns the attention and sampling kernels. Your op replaces one kernel behind a stable plan-run boundary, not a scheduler.

</details>

#### U9. Token, distribution and task-quality equivalence

**About 3 h** · **Target:** Measure

Topics: Token, distribution or task-quality equivalence after optimization

Every inference optimization is a correctness claim first. Equivalence at token, distribution and task levels decides whether a speedup ships.

**You can now**

- Define token, distribution and task-quality equivalence with predeclared tolerances.
- Run a perplexity evaluation with fixed windows, stride and dtype and report the difference.
- Gate one optimization on all three equivalence levels.

**Study**

1. [Correctness-first debugging gate](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 13, 15 and 16) - Chapter 16, Profiling, Debugging, and Tuning Inference Performance: Debugging Correctness Issues.
2. [Perplexity evaluator contract](https://github.com/cfregly/ai-performance-engineering/blob/b57e4c6a9e261c09ac09208705d040c81b03d35e/code/ch16/perplexity_eval.py) (AI Systems Performance Engineering companion code - Chapters 12 to 16) - `load_tokens` with space-separated integers; `parse_args` with `tokens`, `--seq-len`, `--stride`, `--dtype` and `--fp8-mode`; `GPTConfig` and `GPTModel` scoring.
3. [Exact-match sampler fast path](https://github.com/cfregly/ai-performance-engineering/blob/b57e4c6a9e261c09ac09208705d040c81b03d35e/code/ch15/baseline_greedy_sampler.py) (AI Systems Performance Engineering companion code - Chapters 12 to 16) - `GreedySamplerBenchmark` (defined in `greedy_sampler_common.py`) with `materialize_probabilities=True` in `baseline_greedy_sampler.py` versus `False` in `optimized_greedy_sampler.py`.

**Focus**

- Token equivalence is exact ID match under a stated sampling policy. Greedy `argmax` on logits equals `argmax` on probabilities, so the sampler fast path must match exactly.
- Distribution equivalence is a measured distance: perplexity difference near noise on a fixed token window plus a KL or logprob check where sampling matters. One perplexity number without windows, stride and dtype is not a gate.
- Task equivalence is a product spot-check on a small eval slice. Quantization and speculative paths pass only when all three levels agree within predeclared tolerances.

**Reproduce:** Closed-book, prove greedy equivalence on a 50000-token vocabulary with a fixed seed: `argmax` of logits equals `argmax` of `softmax` of the same logits, so skipping probability materialization is exact. Then state the perplexity formula $`\text{PPL} = \exp(\text{mean NLL})`$ and which windows, stride and dtype your gate fixes.

**Traps**

- Accepting `equal_nan=True` style looseness as correctness. Unexpected NaNs must fail the gate, not pass it quietly.
- Widening tolerance until a wrong-mask variant passes. Tolerances are predeclared from precision and use, not fitted to results.
- Testing quality on the data the optimization was tuned on. Fix the eval tokens before measuring the difference.

**Practice**

- [Companion code ch16: perplexity evaluation gate](https://github.com/cfregly/ai-performance-engineering/blob/b57e4c6a9e261c09ac09208705d040c81b03d35e/code/ch16/perplexity_eval.py) - Run `perplexity_eval.py` with `tokens`, `--seq-len`, `--stride`, `--dtype` and `--fp8-mode` on a fixed token file before and after one optimization; report perplexity difference with windows and dtype retained. CPU or single-GPU run is enough. No public autograder scores the difference; retain the token file, windows, stride, dtype and both perplexities.

**Stop when:** One optimization carries a written equivalence report with exact-match, perplexity-difference and task spot-check results against predeclared tolerances.

<details>
<summary>Self-test</summary>

1. Does a small perplexity difference alone prove an optimization is safe?
   - No. It can hide distribution shifts that sampling exposes and task regressions that perplexity misses. All three levels need tolerances.
2. What does the greedy-sampler fast path save, and why is it exact?
   - It removes the full-vocabulary softmax and probability buffer from greedy decode. Softmax is monotone, so `argmax` is unchanged; only logits close enough to round to equal probabilities could pick a different index.
3. What must a perplexity comparison fix?
   - Fixed token file, window length, stride, dtype and conversion mode. Changing any of them between runs invalidates the comparison.

</details>

#### U10. Endpoint workloads, request metrics, baselines and attribution

**About 5 h** · **Target:** Measure

Topics: Endpoint-derived shape and arrival distribution; TTFT, TPOT, memory, throughput and goodput measurement; Production engine and vendor-library baseline; Attribution from kernel change to request-level effect

Endpoints are judged by TTFT, TPOT, memory and goodput on a real mix. Attribution connects one kernel change to those numbers without overclaiming.

**You can now**

- Derive KV-capacity and latency floors for a stated model and GPU.
- Measure TTFT, TPOT, memory, throughput and goodput on a fixed arrival distribution against strong baselines.
- Attribute a kernel change to request-level effect with shares and explain the residual.

**Study**

1. [KV, capacity and latency floors](https://kipp.ly/p/transformer-inference-arithmetic) (Transformer Inference Arithmetic) - kv cache per-token bytes with `k` and `v` across layers, heads and bytes per value; capacity from weights plus KV; latency calculations for memory-bound versus compute-bound floors; batch sizes and flops counting.
2. [Inference profiling and utilization trade-offs](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 13, 15 and 16) - Chapter 16, Profiling, Debugging, and Tuning Inference Performance; Profiling with Nsight Systems and Nsight Compute; Maximizing GPU Utilization and Throughput Versus Latency Trade-Offs.
3. [Load test and profiling harness](https://github.com/cfregly/ai-performance-engineering/blob/b57e4c6a9e261c09ac09208705d040c81b03d35e/code/ch16/inference_server_load_test.py) (AI Systems Performance Engineering companion code - Chapters 12 to 16) - `CompletionRecord`, `run_load_test` with `target_qps`, warmup phase and percentile summaries in `inference_server_load_test.py`; `MonitoringSystem`, `DynamicBatcher` and `PrefixCache` in `inference_profiling.py`.

**Focus**

- Derive floors before measuring: per-token KV bytes, weight-resident capacity, and memory-bound versus compute-bound latency. A measurement that beats its floor has a boundary error.
- Fix the workload first: shape and arrival distribution, TTFT and TPOT SLOs, memory budget and goodput definition. Goodput counts only requests meeting the SLOs.
- Attribute with shares: a kernel speedup $`s`$ on fraction $`f`$ of step time gives at most $`1 / ((1 - f) + f / s)`$ end-to-end. Baselines are the production engine and the vendor library, not eager alone.

**Reproduce:** Closed-book, derive capacity for an 8-billion-parameter FP16 model on an 80 GB A100: weights occupy about 16 GB, leaving roughly 64 GB of the 80 GB budget for KV and workspace. At 131072 bytes per token (32 layers, 8 KV heads, 128 head dim, FP16), that budget holds roughly 490000 tokens (524288 per 64 GiB) before any workspace; subtract your workspace reservation first and state your GB/GiB convention. Then show how a 10 percent kernel win on a 30 percent step share gives at most about 3 percent end-to-end.

**Traps**

- Quoting a friendly-shape kernel speedup as an endpoint win. Request mix, queueing and uncovered shares dilute it.
- Averaging TTFT and TPOT across different lengths and SLOs. Report per-slice percentiles on a fixed distribution.
- Keeping only summary speedups. Retain raw samples, workload, revision and machine state or the result cannot be audited.

**Practice**

- [Companion code ch16: inference load test with baselines](https://github.com/cfregly/ai-performance-engineering/blob/b57e4c6a9e261c09ac09208705d040c81b03d35e/code/ch16/inference_server_load_test.py) - Run `inference_server_load_test.py` with `--duration`, `--target-qps` and `--output-json`; compare one custom path against the production-engine and vendor-library baselines on TTFT p50 and p99, TPOT, memory and goodput with `CompletionRecord` fields retained. Keep captures short. Multi-GPU flags exist but single-GPU runs are enough. No public autograder scores the endpoint; retain arrival mix, baselines and raw samples.

**Stop when:** Your endpoint report shows TTFT, TPOT, memory and goodput on a fixed mix against strong baselines, with the kernel-to-request attribution reconciled to a timeline.

<details>
<summary>Self-test</summary>

1. What do TTFT and TPOT measure?
   - Time to first token (prefill plus scheduling) and time per output token after the first (steady decode cadence). E2E adds queueing and completion.
2. Why can throughput rise while goodput falls?
   - Throughput counts all tokens; goodput counts only requests meeting latency SLOs. A faster engine with more SLO misses can raise one and lower the other.
3. What makes an engine baseline weak?
   - It compares against a weak reference instead of the engine and library the team would actually run. The gap overstates the shippable win.
4. Does a kernel speedup times its profile share equal the endpoint win?
   - No. Divide only after checking the floor: the win must fit inside the helped share, and the residual needs a timeline or counter cause.

</details>

#### U11. Versioned regression gates, fallback and rollback

**About 2 h** · **Target:** Implement

Topics: Versioned regression gate, fallback and rollback

An integrated kernel needs a gate that catches regressions and a rollback that restores service. Otherwise the first bad revision ships.

**You can now**

- Implement a versioned regression gate with fallback and rollback for one integrated path.
- Distinguish a real regression from noise with raw samples and uncertainty.

**Study**

1. [CI gates and production monitoring](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 13, 15 and 16) - Chapter 13, Continuous Integration and Performance Benchmarking; Chapter 16, Monitoring System Metrics and Counters.
2. [Versioned expectations harness](https://github.com/cfregly/ai-performance-engineering/blob/b57e4c6a9e261c09ac09208705d040c81b03d35e/code/ch16/compare.py) (AI Systems Performance Engineering companion code - Chapters 12 to 16) - `expectations_2x_b200.json` and `expectations_b200.json` in the chapter directories, refreshed with `--update-expectations`; `BenchmarkConfig` with iterations and warmup in `compare.py`; validity profiles in chapter READMEs. Depth: The shipped expectations are B200 and GB200 numbers. Record your own baseline on your GPU before gating, and never refresh it to absorb a regression.

**Focus**

- Version every gate: code revision, model and tokenizer identity, config, hardware and toolchain, workload seed and tolerances. A gate without versions cannot roll back.
- Gate on correctness and quality first, then on TTFT, TPOT, memory and goodput with uncertainty. A statistically resolved but practically useless gain stays out.
- Keep fallback automatic and rollback one command: unsupported shapes route to the eager path, and a failed gate restores the last passing revision with its data.

**Reproduce:** Without notes, write the gate contract for your integrated kernel: versioned inputs, correctness plus quality checks, TTFT and TPOT budgets with sample counts, fallback trigger and rollback command. Then seed one wrong-mask defect and show the gate failing before timing is read.

**Traps**

- Gating only on mean latency. Tails, memory and quality regress first; gate them with their own budgets.
- Updating expectations to match a regression. Expectations change only after validating new hardware or a declared policy change.
- Testing rollback without a drill. An untested restore command fails when it is needed.

**Practice**

- The section mini-project covers this: `kernellab` versioned regression gate with fallback routing, rollback drill and retained raw samples.

**Stop when:** A seeded defect trips the gate, fallback serves correctly, and one rollback command restores the last passing revision with evidence retained.

<details>
<summary>Self-test</summary>

1. What versions does a regression gate pin?
   - Code and model versions, config, hardware and toolchain, workload and seed, tolerances and budgets. Without them a rerun is a different experiment.
2. Does routing to fallback forgive a regression?
   - No. Fallback keeps serving correct while the gate stays red and the rollback restores the last passing revision. Silent fallback without a gate hides the regression.
3. When does a timing difference count as a regression?
   - Only with raw samples, sample counts and an uncertainty method that respects pairing and drift. A best-run comparison proves nothing.

</details>

### Mini-project: One custom path running in a real inference endpoint

**About 12 to 16 hours.** Integrate one validated CUDA or Triton path into a real operator or small endpoint inside kernellab: trace dispatch to the kernel, prove launch and graph behavior, measure paged KV and chunked prefill, cover quantized, speculative and structured paths, check multimodal co-execution, and gate releases with fallback and rollback. All endpoint sizes fit 6 GB.

1. Profile a 1024 by 1024 `torch.float32` CUDA matmul wrapped in `torch.profiler.record_function(\"mm\")` and `torch.cuda.nvtx.range(\"mm\")`, capture a short `nsys profile --trace=cuda,nvtx --sample=none --cpuctxsw=none` trace, follow one `aten::mm` entry to its kernel, and reconcile profiler CUDA time with the union of kernel intervals and completed wall time. Run the ch13 whole-graph against regional compile pair with `python -m cli.aisp bench run --targets ch13:regional_compile --profile minimal` and attribute which boundary each variant moves.
2. Time 200 eager launches of a 1024-element vector add against 200 `graph.replay()` calls with CUDA events interleaved in pairs under a recorded seed and report both medians. On an RTX 3050 with PyTorch 2.14.1, six runs of 41 interleaved pairs gave eager medians from 2.4 to 13.5 us and replay medians from 1.8 to 7.2 us as host load changed, replay 1.4 to 1.9 times faster each run; record host load with yours, and replay must not exceed eager on this shape, with recapture required after any shape change. Capture one stable 32-step sequence, keep capture logs, and test eager fallback on an unsupported path.
3. Work a four-request mix with decode lengths 10, 10, 10 and 100: static batching holds all slots until length 100 while continuous batching frees three slots at length 10; state which kernel dimensions shrink when live batch drops from 4 to 1. Derive per-token KV bytes as $`2 \times L \times H_{kv} \times D \times B`$: for 32 layers, 8 KV heads, 128 head dim and fp16 the result is 131072 bytes (128 KiB) per token. Place a 40-token sequence in block size 16 for 3 blocks with 8 wasted slots, and keep block tables and hit rates from the KV management and radix reuse runs.
4. Chunk a 20000-token prompt into 5000-token chunks beside 8 live decodes with a stated token budget: 4 chunks with named sharing per iteration, total attention work unchanged and worst per-iteration latency lower. Verify the LeetGPU challenge 87 worked example closed-book (draft `[1, 2, 0]` with given probabilities and samples `[0.50, 0.70, 0.30, 0.90]`: accept position 0 near 0.83, reject position 1 near 0.40, resample from `[0.667, 0, 0, 0.333]` to emit `[1, 3, 0, 0]`), pass challenges 87 and 96 locally with adversarial scales and tails, and run the disaggregated prefill and decode comparison with TTFT, TPOT and transfer notes.
5. Sketch one image-plus-text request through prefill and two decode steps: mark where the image encoder runs, which token range its embeddings replace, and which blocks are hashable for reuse when a second request shares text but not the image. Time encoder-batch against decoder-only execution in the integrated endpoint and add a multimodal prefix-hash identity check that reuses only matching prefixes.
6. Register the fused residual-add plus RMSNorm (LeetGPU challenge 83) as a custom op with a fake shape rule, allocate the FlashInfer decode workspace, plan a batch of 7 requests in `NHD` layout with `page_size = 16` and run one layer, stating which buffers must stay stable for graph capture and which eager fallback runs on an unsupported dtype. Derive endpoint capacity for an 8-billion-parameter fp16 model on an 80 GB A100: weights near 16 GB leave near 64 GB for KV and workspace, near 490000 tokens at 131072 bytes per token (524288 per 64 GiB) before workspace, then subtract the workspace reservation under a stated GB and GiB convention. Show a 10 percent kernel win on a 30 percent step share giving at most near 3 percent end to end, and compare one custom path against production engine and vendor-library baselines with a load test over a stated arrival mix.
7. Prove greedy equivalence on a 50000-token vocabulary with a fixed seed (`argmax` of logits equals `argmax` of their softmax, so skipping materialization is exact unless logits round to equal probabilities), then fix windows, stride and dtype and gate quality with perplexity $`\text{PPL} = \exp(\text{mean NLL})`$ on a fixed token file before and after the change. Write the versioned gate contract (versioned inputs, correctness plus quality checks, TTFT and TPOT budgets with sample counts, fallback trigger and rollback command), seed one wrong-mask defect to show the gate failing before timing is read, then drill rollback with raw samples retained.

**Deliverables**

- Dispatch and launch evidence: the `aten::mm` to kernel trace, the 200-launch eager against replay medians with capture logs, and the batching and KV derivations with block tables.
- The integrated custom op with workspace plan, capacity math, baseline load test and the multimodal timing with prefix-hash check.
- The quality gate with fixed token file and perplexity reports, plus the versioned regression gate with a seeded failing defect, fallback routing and rollback drill.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [LeetGPU inference kernels run locally](https://leetgpu.com/challenges/). Pass 83 Fused Residual Add RMS Norm, 87 Speculative Decoding Verification and 96 INT8 KV Cache Attention locally; integrate one result with fallback.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Dispatch proof | The trace follows one operator entry to its kernel with reconciled times, eager against replay medians come from interleaved trials with recapture rules, and batching and KV derivations match the runs. | Block tables show which reuse actually happened. |
| Integration with quality | The custom op runs in the endpoint with stable buffers named, capacity math states conventions and workspace, baselines are production-grade, and greedy and perplexity gates pass on a fixed token file. | The 10 percent on 30 percent bound is applied with measured shares. |
| Gates and rollback | The versioned gate fails on the seeded wrong-mask defect before timing, fallback routes correctly, and rollback is drilled with raw samples retained. | The multimodal check reuses only matching prefixes and never the image blocks. |

Feeds into: Capstone integration: the endpoint, workspace plan, quality gate and regression gate with rollback become the system-level evidence. Communication and portability sections build on its shapes.

### Resource route

- **Primary - Book:** [AI Systems Performance Engineering - Chapters 13, 15 and 16](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) - Read Chapter 13 on profiling and tuning PyTorch, Chapter 15 on inference parallelism, decoding and routing, and Chapter 16 on profiling and debugging inference. Keep Chapters 17 to 19 for GPU-9 and depth.
- **Required - Lab:** [AI Systems Performance Engineering companion code - Chapters 12 to 16](https://github.com/cfregly/ai-performance-engineering/tree/main/code) - Use compatible examples from `code/ch12` through `code/ch16`. Trace whether each optimized path changes a kernel, graph, compiler choice, scheduler or library dispatch, then integrate one bounded custom path into a realistic operator or small endpoint.
- **Reference - Reference:** [AI Performance Engineering - Inference Engines](https://github.com/wafer-ai/gpu-perf-engineering-resources) - A curated index. Use Section 4 only to find the introducing paper and implementation for the mechanism your measurement points to.
- **Required - Paper:** [PagedAttention and vLLM](https://arxiv.org/html/2309.06180v1) - Study block-based key-value allocation, sharing and scheduling interaction. Trace logical token positions to physical blocks in one engine run and quantify fragmentation and memory-capacity effects.
- **Support - Paper:** [SGLang](https://arxiv.org/html/2312.07104v2) - Read the runtime and RadixAttention design, then inspect the repository path for one kernel or prefix-reuse interaction. Use it as an alternative architecture in the integration defense.
- **Required - Practice:** [LeetGPU - Inference Kernel Set](https://leetgpu.com/challenges/) - Choose three bottleneck-matched challenges from 74 GPT-2 Block, 83 Fused Residual Add RMS Norm, 84 SwiGLU MLP Block, 87 Speculative Decoding Verification, 93 Llama Transformer Block and 96 INT8 KV Cache Attention. Integrate one result locally rather than stopping at the hosted submission.
- **Support - Implementation:** [FlashInfer](https://github.com/flashinfer-ai/flashinfer) - Use the repository as the serving-kernel baseline and interface reference. Reconstruct workspace planning, layouts, dispatch and stream behavior for one selected operation before comparing your path.
- **Support - Project:** [GPU Microbenchmark and Kernel Suite - Integration](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/gpu-microbenchmark-kernel-suite.md) - Complete the real tensor or model-operation integration, dispatch and fallback requirements. Report compilation and invocation overhead, workload frequency, correctness or quality and the end-to-end no-benefit regime.
- **Reference - Documentation:** [PyTorch 2.14 Profiler](https://docs.pytorch.org/docs/2.14/profiler.html) - Read the Overview example plus the API reference for `torch.profiler.profile` (`activities`, `schedule`, `on_trace_ready`, `record_shapes`, `with_stack`), `torch.profiler.record_function` and `export_chrome_trace`. Use it for exact profiler and NVTX-range call contracts missing from the book.
- **Support - Paper:** [Orca (OSDI 2022)](https://www.usenix.org/system/files/osdi22-yu.pdf) - Read Sections 3 to 4 for iteration-level scheduling and selective batching, and Section 6 for the engine microbenchmark and end-to-end latency-throughput method. Use it as the continuous-batching mechanism behind the book summary.
- **Support - Paper:** [Sarathi-Serve](https://arxiv.org/html/2403.02310v3) - Read Sections 3 to 4 for chunked-prefill stall-free batching and token-budget selection, and Section 5 for capacity and overhead method. Use it as the chunked-prefill mechanism behind the book summary.
- **Support - Paper:** [Fast Inference from Transformers via Speculative Decoding](https://proceedings.mlr.press/v202/leviathan23a/leviathan23a.pdf) - Read Sections 2 to 3 for the draft-verify-accept loop, the acceptance rule and the walltime-versus-operations analysis. Use it for the verification cost model behind the engine guides.
- **Reference - Documentation:** [vLLM Documentation - Automatic Prefix Caching](https://docs.vllm.ai/en/v0.31.0/design/prefix_caching/) - Read Automatic Prefix Caching (vLLM v0.31.0) for hash-based block reuse, full-block caching, reverse-order freeing and the multimodal hashing example. Use it for engine behavior the papers do not version.
- **Reference - Article:** [Transformer Inference Arithmetic](https://kipp.ly/p/transformer-inference-arithmetic) - Read kv cache, capacity, latency calculations, batch sizes and flops counting for per-token KV bytes, weight-capacity arithmetic and memory-bound versus compute-bound latency floors. Use it to derive endpoint bounds before measuring.

### Exit checkpoint

Integrate one custom CUDA or Triton path into a real operator or small inference endpoint, prove dispatch and rollback, and show request-level TTFT, TPOT, memory, goodput and quality effects across the real shape distribution.

<details>
<summary>Deliberately left for later</summary>

- Reimplementing the full scheduler, key-value manager or production serving platform already owned by the Inference track
- Every quantization, speculative decoding and long-context method in the resource index
- Endpoint speed claims inferred from an isolated friendly-shape kernel

</details>

## GPU-9. Multi-GPU Communication and Distributed Inference Performance

**Why:** Beyond one GPU, topology, collective algorithms, transfer paths and load balance determine whether kernel gains survive. This stage models communication, profiles overlap and studies distributed inference mechanisms without duplicating full training or serving-platform ownership.

### Learn this much

- [ ] PCIe, NVLink, NVSwitch and intra-node topology _(Required)_
- [ ] NICs, RDMA, InfiniBand or Ethernet and scale-out topology _(Required)_
- [ ] Directional bandwidth, latency, contention and topology assumptions _(Required)_
- [ ] Rank, group, shape, dtype and ordering contracts _(Required)_
- [ ] Latency-bandwidth cost model and message-size crossover _(Required)_
- [ ] Ring and tree all-reduce algorithms _(Required)_
- [ ] All-gather and reduce-scatter communication volume _(Required)_
- [ ] All-to-all and mixture-of-experts dispatch traffic _(Required)_
- [ ] NCCL algorithms, protocols, channels and topology selection _(Required)_
- [ ] Rank, tensor, expert and process placement on fast links _(Required)_
- [ ] Compute-communication overlap and exposed communication _(Required)_
- [ ] Communication streams, events and buffer lifetime _(Required)_
- [ ] Rank-aligned timelines, collective sequence and straggler attribution _(Required)_
- [ ] Link congestion, shared-fabric interference and tail behavior _(Required)_
- [ ] Mixture-of-experts dispatch, combine and communication kernels _(Required)_
- [ ] Token skew, hot experts and load-balanced placement _(Required)_
- [ ] Prefill and decode disaggregation as a performance mechanism _(Required)_
- [ ] Key-value transfer bytes, bandwidth, latency and crossover _(Required)_
- [ ] NIXL and connector data-path identity _(Required)_
- [ ] DistServe, Splitwise and Mooncake architectural trade-offs _(Required)_
- [ ] Collective timeout, partial failure, retry and invalid measurement _(Required)_
- [ ] Single-node and multi-node bandwidth, latency, clocks and raw-result contract _(Required)_
- [ ] Analytical and CPU simulation when multiple GPUs are unavailable _(Required)_
- [ ] Custom collective, NVSHMEM or fused communication-compute kernel _(Depth)_
- [ ] Training parallel strategy and fault-tolerant pipeline ownership _(Later)_
- [ ] Cluster scheduler and production fleet orchestration _(Later)_

### Study units

#### U1. Interconnects and topology: PCIe, NVLink, NVSwitch and RDMA

**About 4 h** · **Target:** Explain + Measure

Topics: PCIe, NVLink, NVSwitch and intra-node topology; NICs, RDMA, InfiniBand or Ethernet and scale-out topology; Directional bandwidth, latency, contention and topology assumptions

Every collective time in this section is bytes divided by the slowest link on its path plus latency. A wrong topology picture makes every later model wrong.

**You can now**

- Explain how PCIe, NVLink and NVSwitch paths differ in bandwidth, latency and CPU involvement, and where RDMA removes the CPU from the path.
- Predict which hop bounds a stated exchange from a topology dump, and state the directional bandwidth assumption behind the prediction.
- Detect a silent fallback from GPUDirect RDMA to TCP sockets from logs and module checks.

**Study**

1. [Scale-up fabric: NVLink and NVSwitch](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 4, 15, 17 and 18) - Chapter 2, NVLink and NVSwitch.
2. [RDMA, NICs and multinode connectivity](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 4, 15, 17 and 18) - Chapter 4, High-Speed, Low-Overhead Data Transfers with RDMA; Tuning Multinode Connectivity; Multinode Communication Pitfalls.
3. [Topology detection and peer access](https://docs.nvidia.com/deeplearning/nccl/archives/nccl_2323/user-guide/docs/troubleshooting/gpu_troubleshooting.html#topology-detection) (NCCL) - Topology detection and GPU-to-GPU communication: confirm peer access before trusting any bandwidth number.
4. [Recording the topology NCCL saw](https://docs.nvidia.com/deeplearning/nccl/archives/nccl_2323/user-guide/docs/env.html#nccl-topo-dump-file) (NCCL) - NCCL_TOPO_DUMP_FILE and NCCL_TOPO_FILE: dump the detected graph with every measurement.

**Focus**

- Bandwidth numbers are directional unless stated otherwise. An 800 Gb/s NIC is 100 GB/s of line rate in one direction before headers and congestion, and a Gen4 x16 link is about 32 GB/s per direction from lane arithmetic.
- The book's hierarchy example (two NVLink pairs joined by PCIe) reduces on the fast pairs first so the slow link carries only a fraction of the data. Sketch which exchange crosses PCIe before running anything.
- GPUDirect RDMA lets the NIC read and write GPU memory without CPU copies. A container without InfiniBand devices or with mismatched GIDs silently falls back to TCP sockets, which run far below the RDMA rate on the same fabric. Confirm `NET/IB` rather than sockets in the log before quoting any rate.
- A Blackwell GPU advertises about 1.8 TB/s of NVLink aggregate across 18 links, which is bidirectional aggregate or 900 GB/s per direction. Per-direction phrasing of 100 GB/s per link contradicts that aggregate; use the aggregate and halve it.

**Reproduce:** From a blank page, sketch the four-GPU hierarchy example (GPUs 0-1 on one NVLink pair, 2-3 on another, PCIe between pairs) and state which exchange crosses the slow link and why it carries only a fraction of the data. Then capture `nvidia-smi topo -m` on your hardware and label each GPU pair with its path.

**Traps**

- Quoting 1.8 TB/s as per-direction NVLink bandwidth. It is bidirectional aggregate; per-direction peaks are half that, and sustained rates are lower under imbalance.
- Assuming x16 width. A link negotiated at x8 has half the bandwidth of the same generation at x16, and links drop to a lower generation when idle. Read both under load with `nvidia-smi --query-gpu=pcie.link.gen.current,pcie.link.width.current --format=csv`; an RTX 3050 6 GB desktop board reported Gen4 x8 under a copy load and Gen1 when idle.
- Trusting a bandwidth number while the path fell back to TCP. Check `NCCL_DEBUG=INFO` for `NET/IB` versus sockets and `lsmod | grep nvidia_peermem` for the peer-memory module.

**Practice**

- [AI Systems companion code ch04: PCIe staging and topology bring-up probes](https://github.com/cfregly/ai-performance-engineering/blob/b57e4c6a9e261c09ac09208705d040c81b03d35e/code/ch04/baseline_pcie_staging.py) - Run `baseline_pcie_staging.py` with its optimized pair plus `nccl_benchmark.py` on compatible single-host paths; record `nvidia-smi topo -m` and `NCCL_TOPO_DUMP_FILE`. Mark NVLink-only and multi-GPU-only paths as explicit blockers with the dump attached; do not report fallback timings as link rates.

**Stop when:** Your sketch predicts the slow hop before you run, the dump confirms the path, and you can state every quoted rate as per-direction or bidirectional with its assumption.

<details>
<summary>Self-test</summary>

1. GPUs 0-1 share NVLink, 2-3 share NVLink, and only PCIe joins the pairs. Where does a hierarchical all-reduce put most bytes?
   - On the two NVLink pairs first, then one exchange across PCIe per pair, then redistribution inside each pair. The slow link handles a fraction of the data rather than every byte.
2. What line rate in GB/s does an 800 Gb/s link imply, and why is it not a measurement?
   - 800 divided by 8 is 100 GB/s of line rate. Headers, encoding, congestion and software overheads sit below it, so sustained goodput needs a measurement.
3. Which two checks expose a silent RDMA-to-TCP fallback?
   - `NCCL_DEBUG=INFO` showing socket transport instead of `NET/IB` paths, and a missing peer-memory module under `lsmod | grep nvidia_peermem`. Either one invalidates the RDMA bandwidth assumption.
4. A Gen4 x16 link is quoted at 64 GB/s. Is that per direction?
   - No. Lane arithmetic gives about 32 GB/s per direction (16 lanes at 16 GT/s with 128b/130b encoding). 64 GB/s is the bidirectional sum.

</details>

#### U2. Collective contracts and the latency-bandwidth cost model

**About 4 h** · **Target:** Derive

Topics: Rank, group, shape, dtype and ordering contracts; Latency-bandwidth cost model and message-size crossover

Volume tells you the bytes on the wire and latency tells you the floor for small messages. Without both terms you cannot say whether a collective is latency-bound or bandwidth-bound.

**You can now**

- State the NCCL contract for each collective: same count and datatype on every rank, rank-ordered outputs, and root as a rank rather than a device.
- Derive per-rank volume and $`\alpha`$-$`\beta`$ time for all-gather, reduce-scatter and ring all-reduce, and predict the latency-bandwidth crossover for a stated size.

**Study**

1. [Collective contracts](https://docs.nvidia.com/deeplearning/nccl/archives/nccl_2323/user-guide/docs/usage/collectives.html) (NCCL) - AllReduce, AllGather, ReduceScatter and AlltoAll: every rank passes the same count and datatype; AllGather orders output by rank; Reduce followed by Broadcast equals AllReduce; ReduceScatter followed by AllGather equals AllReduce.
2. [Volume reasoning without latency](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/cs336_assignment2_systems.pdf) (CS336 Assignment 2 - Section 8.1 Communication Primitives) - Section 8.1 Communication Primitives (pp. 40 to 41): ring all-gather and ring reduce-scatter at $`(N-1)/N \times S/W`$ seconds, ring all-reduce as their sum, and Problem (`alternate_ring_all_reduce`).
3. [Size-dependent selection knobs](https://docs.nvidia.com/deeplearning/nccl/archives/nccl_2323/user-guide/docs/env.html#nccl-algo) (NCCL) - NCCL_ALGO with Ring, Tree, CollNet variants, NVLS, NVLSTree and PAT plus per-collective syntax; NCCL_PROTO with LL, LL128 and Simple; the tuner picks the small-versus-large crossover by size and topology (the old `NCCL_LL_THRESHOLD` and `NCCL_TREE_THRESHOLD` were removed in NCCL 2.5).

**Focus**

- The contract is strict: mismatched counts, datatypes or call order across ranks is undefined behaviour including hangs, not a checked error. Root arguments name ranks, so a remapped rank-to-device layout changes which device is root.
- CS336 sizes its model with per-device egress $`W`$ and no latency term, so $`(N-1)/N \times S/W`$ is exact only for large messages. Add the latency term for small ones: $`T(n) = \alpha + \beta n`$ with $`\beta = 1/B`$.
- The crossover $`n^* = \alpha B`$ separates the regimes. With $`\alpha = 10`$ microseconds and $`B = 100`$ GB/s the crossover sits at 1 MB: below it startup dominates, above it bytes dominate.
- Small messages favour low-latency protocols (LL, LL128) and, at larger rank counts, tree; large messages favour ring with Simple. NCCL's tuner chooses per size and topology because one setting cannot win at both ends.

**Reproduce:** Closed-book, derive ring all-reduce time as reduce-scatter plus all-gather: $`T = 2(N-1)\alpha + 2S(N-1)/(NB)`$. Then compute the crossover size where the latency and bandwidth terms are equal for a stated $`\alpha`$ and $`B`$.

**Traps**

- Reading the CS336 volume as a complete time model. It drops $`\alpha`$, so it underpredicts small messages by orders of magnitude; that gap is exactly what LL/LL128 and tree selection address.
- Assuming the alternate ring algorithm from the CS336 problem is competitive. It sends full $`S`$ per step for $`(N-1)S/W`$ seconds, a factor of about $`N/2`$ worse than the chunked ring; chunking is what buys the saving.
- Treating bus bandwidth and algorithm bandwidth as the same number. The fit must use bytes on the wire per rank, not $`S`$, or the fitted $`\beta`$ is wrong by the volume factor.

**Practice**

- [TensorTonic: Simulate Distributed Collectives](https://www.tensortonic.com/problems/cs336-l07-simulate-collectives) - Implement `simulate_collectives` for `all_gather`, `all_reduce`, `reduce_scatter` and `all_to_all` over rank-ordered tensors: rank-ordered concatenation, elementwise sums, equal contiguous chunks and source-ordered blocks
- [TensorTonic: Calculate Collective Effective Bandwidth](https://www.tensortonic.com/problems/cs336-l07-collective-bandwidth) - Implement `collective_bandwidth`: modeled bytes per rank $`A = cS(R-1)/R`$ with $`c = 2`$ for all-reduce and 1 otherwise, divided by the duration. The problem calls the ring wire bytes `algorithm_bytes`. nccl-tests reserves algorithm bandwidth for $`S/t`$ and calls the wire-corrected rate bus bandwidth, so name the convention whenever you compare the two.

**Stop when:** You derive the ring all-reduce time and the crossover without notes, and both TensorTonic problems agree with your hand computation.

<details>
<summary>Self-test</summary>

1. What does the alternate ring all-reduce cost, and why?
   - $`(N-1)S/W`$ seconds. Each of the $`N-1`$ steps transmits a full size-$`S`$ buffer instead of a size-$`S/N`$ chunk, so no $`1/N`$ factor appears.
2. With $`\alpha = 10`$ microseconds and $`B = 100`$ GB/s, where is the crossover?
   - $`n^* = \alpha B = 10^{-5} \times 10^{11} = 10^6`$ bytes, or 1 MB. Messages far below 1 MB are latency-bound; far above are bandwidth-bound.
3. Why must every rank pass the same count and datatype?
   - The collective is one matched operation across ranks. A mismatch breaks the pairing the implementation assumes, which the NCCL page defines as undefined behaviour including hangs and data corruption.
4. All-gather output differs across two runs with identical inputs. What changed?
   - The rank-to-device mapping. AllGather orders output by rank index, so remapping ranks permutes which device's block lands where.
5. Which algorithm and protocol should a 16 KB and a 400 MB all-reduce end up with, and why?
   - A low-latency protocol (LL or LL128), with tree at larger rank counts, for 16 KB, because startup dominates; ring with Simple for 400 MB, because balanced links dominate. The tuner makes this choice per size, so override it only with a measured reason.

</details>

#### U3. Ring and tree all-reduce, all-gather and reduce-scatter volume

**About 6 h** · **Target:** Derive + Implement

Topics: Ring and tree all-reduce algorithms; All-gather and reduce-scatter communication volume

Data-parallel sync and tensor-parallel shards are these three collectives in different orders. The volume derivation decides the design; the MPI build makes the steps concrete without needing eight GPUs.

**You can now**

- Derive step counts and per-rank bytes for ring and tree all-reduce, all-gather and reduce-scatter, and state which regime each algorithm wins.
- Implement all-reduce and all-to-all from point-to-point calls with correctness and timing checks against the library versions.
- Decompose tensor-parallel forward and backward communication into all-gather, all-reduce and reduce-scatter pieces.

**Study**

1. [Ring constructions and the alternate algorithm](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/cs336_assignment2_systems.pdf) (CS336 Assignment 2 - Section 8.1 Communication Primitives) - Section 8.1 Communication Primitives (pp. 40 to 41): ring all-gather chunk passing, ring reduce-scatter with partial sums, all-reduce as their composition, and Problem (`alternate_ring_all_reduce`).
2. [NCCL ring, tree, CollNet and PAT](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 4, 15, 17 and 18) - Chapter 4, NCCL Communication Algorithms: Ring bandwidth-optimality at $`2 \times`$ data size over ranks per link, Tree in $`O(\log N)`$ steps for small messages, CollNet leader hierarchy, PAT hybrid.
3. [Collectives from point-to-point MPI](https://github.com/hao-ai-lab/cse-dsc291-s26-pa/tree/main/pa2) (UCSD CSE 291A/DSC 291 (Spring 2026) PA2 Part 2 - Tensor Parallel Communication) - Sections 2.0 and 2.1: `mpi-test.py` `allreduce`, `allgather`, `reduce_scatter` and `split` cases, then `myAllreduce` and `myAlltoall` in `mpi_wrapper/comm.py` from `Send`, `Recv` and `Sendrecv` only.
4. [Point-to-point building blocks](https://docs.nvidia.com/deeplearning/nccl/archives/nccl_2323/user-guide/docs/usage/p2p.html) (NCCL) - Two-sided communication: `ncclSend` and `ncclRecv` pairs compose ring steps; ordering across ranks follows the same matched-call discipline as collectives.

**Focus**

- Ring all-reduce moves $`2S(N-1)/N`$ bytes per rank in $`2(N-1)`$ steps: bandwidth-optimal because every link carries the same share. Tree all-reduce finishes in $`O(\log N)`$ steps but leaves leaf links idle, so it wins small messages and loses large ones.
- All-to-all is personalized, not a reduction: each rank sends a distinct chunk to every other rank. Reusing an all-reduce where an all-to-all belongs silently sums data that should stay separate.
- Reduce-scatter followed by all-gather equals all-reduce, and each half costs $`S(N-1)/N`$ per rank. Read any tensor-parallel layer as one of these halves: gather shards before shared compute, reduce partial outputs after sharded compute.
- The PA2 restriction (no library collectives inside myAllreduce and myAlltoall) is the point: ring steps from Send and Recv expose the $`N-1`$ round structure that the volume formulas summarize.

**Reproduce:** Closed-book, derive per-rank bytes and step counts for ring all-gather, ring reduce-scatter, ring all-reduce and the alternate algorithm for general $`N`$ and $`S`$, then evaluate each at $`N = 4`$ and $`S = 1`$ GB and state the winner and its margin.

**Traps**

- Counting steps instead of bytes for large messages. Ring takes more steps than tree yet wins large transfers because balanced links dominate; step count alone picks tree everywhere.
- Assuming tree links share load like ring links. Leaves send once upward and then wait, so quoting ring volume for a tree run overstates the link rate the measurement should show.
- Calling `myAlltoall` with a reduction operator. All-to-all permutes blocks between ranks; applying `MIN`, `SUM` or `MAX` semantics to it corrupts every expert or shard assignment downstream.

**Practice**

- [UCSD CSE 291A PA2 Part 2: Tensor Parallel Communication, Sections 2.1 to 2.5](https://github.com/hao-ai-lab/cse-dsc291-s26-pa/tree/main/pa2) - Section 2.1 `myAllreduce` and `myAlltoall` in `mpi_wrapper/comm.py` checked by `mpirun -n 8 python mpi-test.py --test_case myallreduce` and `mpirun -n 8 python mpi-test.py --test_case myalltoall`; Sections 2.2 to 2.5 `split_data`, `get_info` and naive forward/backward collects checked by `tests/test_data_split.py`, `tests/test_get_info.py`, `tests/test_transformer_forward.py` and `tests/test_transformer_backward.py`. CPU-only with Open MPI and mpi4py in a throwaway venv; record the discussion2-1.txt timing comparison against the library versions. The remote grader needs a course token, so the local cases are the gate.
- [TensorTonic: Synchronize Data-Parallel Gradients](https://www.tensortonic.com/problems/cs336-l07-data-parallel-gradient-sync) - Implement `data_parallel_gradient_sync`: average each parameter's gradient across ranks (a missing gradient counts as zero) and apply one SGD step to every replica; then state the ring all-reduce volume that sync moves
- [TensorTonic: Reconstruct a Column-Parallel MLP Layer](https://www.tensortonic.com/problems/cs336-l07-column-parallel-mlp) - Implement `column_parallel_mlp`: each rank computes $`XW_r + b_r`$ on its column shard and the outputs concatenate in rank order, the step an all-gather performs; then state where a following row-parallel layer needs an all-reduce

**Stop when:** Your hand volumes match the PA2 timing ratios up to the expected constant, the local MPI cases pass, and you can place each PA2 collect call as a ring half without notes.

<details>
<summary>Self-test</summary>

1. At $`N = 4`$ and $`S = 1`$ GB, what does each rank send in ring all-reduce versus the alternate algorithm?
   - Ring: $`2 \times 1 \times 3/4 = 1.5`$ GB per rank. Alternate: $`(4-1) \times 1 = 3`$ GB per rank, twice as much, because it ships full buffers instead of chunks.
2. Why does tree all-reduce beat ring at 16 KB but lose at 400 MB?
   - At 16 KB the $`O(\log N)`$ steps against $`O(N)`$ dominate and tree starts fewer transfers. At 400 MB bytes dominate and ring keeps every link busy while tree leaves sit idle.
3. A tensor-parallel row needs full input on each rank from shards. Which collective, and what does each rank hold after?
   - All-gather: each rank starts with its input slice and ends with the full tensor ordered by rank, matching the PA2 `naive_collect_forward_input` exercise.
4. Each rank holds a same-shaped partial output that must be summed everywhere. Which collective?
   - All-reduce with SUM, matching `naive_collect_forward_output` over the `fc_o` input-dimension shards.
5. When is CollNet the right answer rather than plain ring or tree?
   - Across groups joined by slower links with reduction-capable fabric: ring or tree inside each fast group, then leader ranks exchange across groups so the slow fabric carries fewer rounds.

</details>

#### U4. NCCL algorithms, protocols, channels and rank placement

**About 4 h** · **Target:** Explain + Measure

Topics: NCCL algorithms, protocols, channels and topology selection; Rank, tensor, expert and process placement on fast links

NCCL usually picks well, but small-message stalls and cross-socket surprises come from its defaults meeting your topology. This unit teaches when to trust auto-selection and which knob fixes each failure.

**You can now**

- Explain how NCCL picks Ring, Tree, NVLS, NVLSTree, CollNet and PAT by message size and topology, and what LL, LL128 and Simple change about a transfer.
- Select algorithm, protocol and channel settings for a stated workload, and place ranks and shards so fast links carry the most bytes.

**Study**

1. [Algorithm and protocol selection](https://docs.nvidia.com/deeplearning/nccl/archives/nccl_2323/user-guide/docs/env.html#nccl-algo) (NCCL) - `NCCL_ALGO` with Ring, Tree, CollNet variants, NVLS, NVLSTree and PAT plus per-collective syntax; `NCCL_PROTO` with LL, LL128 and Simple; set before communicator creation.
2. [Topology-aware selection in practice](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 4, 15, 17 and 18) - Chapter 4, Topology Awareness in NCCL; NCCL Communication Algorithms: messages in the tens of MB favour tree, large messages favour ring, NVLSTree enables NVLink SHARP offload.
3. [How NCCL works under the hood](https://github.com/gpu-mode/lectures/tree/main/lecture_017) (GPU MODE - Collective Communication) - Lecture 17, GPU Collective Communication (NCCL): what NCCL is, why data-parallel training needs it, and how it moves data; `ddp_simple.py` and `ddp_example.py`.
4. [Topology bring-up benchmark](https://github.com/cfregly/ai-performance-engineering/blob/b57e4c6a9e261c09ac09208705d040c81b03d35e/code/ch04/nccl_benchmark.py) (AI Systems Performance Engineering companion code - Chapters 4, 15 and 17) - `nccl_benchmark.py` with `baseline_nvlink_topology_aware.py`: naive versus topology-aware placement on the same collective.

**Focus**

- Channels split one collective across parallel rings, one CUDA block per channel. Size them with `NCCL_MIN_CTAS` and `NCCL_MAX_CTAS` from the versioned env page for your NCCL; older guides name NCHANNELS variables that your version may not read.
- Protocols trade startup against throughput: LL and LL128 cut small-message latency while Simple wins large transfers. Pair them with the algorithm (a low-latency protocol, with tree at larger rank counts, for small messages; ring with Simple for large) rather than setting one knob.
- Overrides apply before `ncclCommInitRank` and read as research or troubleshooting tools, not production defaults. Quote the NCCL version with every override because algorithm and default changes land per release.
- Placement keeps tensor-parallel exchanges inside one NVSwitch domain and reduces across fast pairs before touching slow links. Rank order decides AllGather layout and root identity, so placement and mapping are one decision.

**Reproduce:** Without notes, state the selection matrix (small messages to a low-latency protocol (LL or LL128) with Tree at larger rank counts, large messages to Ring with Simple, NVSwitch-local reductions to NVLS or NVLSTree) plus the two rules: overrides precede communicator creation, and rank order fixes output layout and root identity.

**Traps**

- Setting NCCL_ALGO after the communicator exists and concluding selection does nothing. The tuner reads it at init time; a late export only affects the next communicator.
- Copying `NCCL_MIN_NCHANNELS` from an old guide into a new NCCL. Read the env page for the installed version and set the CTAS pair it documents, then confirm with the topology dump that channels changed.
- Forcing Ring with Simple for every size because ring is bandwidth-optimal. Optimality is about bytes per link; at small sizes startup dominates. On two RTX A5000s joined by PCIe, Ring with Simple took 23 us for an 8-byte all-reduce against 8 us for NCCL's default choice.

**Practice**

- [nccl-tests `all_reduce_perf` algorithm and protocol sweep](https://github.com/NVIDIA/nccl-tests/tree/afd59abab774a6a4b492eb344bd0c845a0b7bb4d) - Run `build/all_reduce_perf -b 8 -e 256M -f 2 -g 2` on the two-GPU workstation under Tree, Ring and default `NCCL_ALGO` with LL128 and Simple protocols. Record the NCCL version and `NCCL_TOPO_DUMP_FILE` with every number, and predict the winners before running. On two RTX A5000s joined across sockets by PCIe (no NVLink), with NCCL 2.27.5 and CUDA 12.6, an 8-byte all-reduce took about 8 us with LL, 16 to 17 us with LL128 and 23 us with Simple under either algorithm, so with two ranks the protocol mattered and ring against tree did not. At 256 MB, Ring with Simple took 19.9 ms (13.5 GB/s bus bandwidth), the same as the default, against 21.9 ms for Tree with Simple and 30 to 81 ms for the LL protocols. Explain any difference on your hardware.

**Stop when:** Your predicted winner matches the bounded sweep at both ends of the size range, and every override you keep is version-pinned with a measured reason.

<details>
<summary>Self-test</summary>

1. An 8-GPU all-reduce of 16 KB is slow under Ring with Simple. What do you change?
   - Remove the override first: the tuner picks a low-latency protocol for small sizes. If you must force a setting, try LL or LL128 with Tree; the message is latency-dominated, so startup and step count beat balanced links.
2. What does adding channels do, and what limits it?
   - It stripes the collective across parallel rings with one CUDA block per channel, raising link use. Limits are SM occupancy for those blocks and the CTAS bounds for the installed NCCL version.
3. Where do NVLS and NVLSTree apply?
   - Inside an NVSwitch domain, where NVLink SHARP can offload the reduction instead of circulating every byte through SMs. Outside such a domain they do not apply.
4. Two runs of the same script place the broadcast root on different GPUs. What changed?
   - The rank-to-device mapping. The root argument names a rank, so the same root rank lands on a different device after remapping.

</details>

#### U5. Compute-communication overlap and communication streams

**About 4 h** · **Target:** Measure

Topics: Compute-communication overlap and exposed communication; Communication streams, events and buffer lifetime

Overlap is where data-parallel scaling comes from: buckets reduce while later layers still compute. A missing dependency or a stray sync turns it back into serial time.

**You can now**

- Diagnose serialized or non-overlapping communication from a timeline, naming the dependency that serializes it.
- Measure exposed communication with streams and events, and attribute the remaining tail to bucketing, ordering or hardware.

**Study**

1. [Overlap, streams and bucket tuning](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 4, 15, 17 and 18) - Chapter 4, Overlapping Communication and Computation (Pipelining); Asynchronous Execution with Streams; Reducing Communication Frequency and Volume; Achieving Maximal Overlap in Practice.
2. [Stream semantics and grouped launches](https://docs.nvidia.com/deeplearning/nccl/archives/nccl_2323/user-guide/docs/usage/streams.html) (NCCL) - CUDA Stream Semantics: collectives enqueue asynchronously to the calling stream; order across streams needs events; group calls under `ncclGroupStart` and `ncclGroupEnd`.
3. [Overlapped versus serial data-parallel paths](https://github.com/cfregly/ai-performance-engineering/blob/b57e4c6a9e261c09ac09208705d040c81b03d35e/code/ch04/ddp_overlap.py) (AI Systems Performance Engineering companion code - Chapters 4, 15 and 17) - `ddp_overlap.py` against `ddp_no_overlap.py`: bucketed reduction while compute continues, with the exposed tail isolated.

**Focus**

- Overlap needs two things: a dedicated communication stream with correct event dependencies, and ready compute to cover each bucket. Streams alone create no parallelism; backprop order supplies the covering work as each bucket fills.
- Bucket size trades launch count against exposure. The default 25 MB bucket launches reductions as soon as buckets fill, and only the tail (roughly the last bucket) stays exposed when compute covers the rest.
- Larger buckets delay the first launch and enlarge the exposed tail; smaller buckets add launch overhead. Gradient accumulation divides all-reduce frequency by the accumulation count before any overlap tuning matters.
- Host-side sync on the critical path (value reads, prints, logging, device synchronize) forces the very serialization overlap removes. Profile first, then delete the sync, then retune buckets.

**Reproduce:** Closed-book, derive exposed time for $`B = 4`$ equal buckets with per-bucket communication $`c`$ and covering compute $`t`$ where $`t \ge c`$: total exposed time is about $`c`$ (the last bucket), not $`4c`$. State which dependency the proof assumes.

**Traps**

- Launching communication and compute on two streams with no dependency and calling it overlap. Without event ordering the consumer can read a buffer the collective has not finished, and without covering work the timeline just shows two serial kernels.
- Tuning bucket size while a logging `.item()` sits in the loop. The sync dominates the exposed time, so every bucket measurement is really a measurement of the logging.
- Expecting overlap to help when communication dwarfs compute. Overlap hides the smaller side; a bandwidth-bound collective with tiny covering compute stays exposed almost in full.

**Practice**

- [AI Systems companion code ch04: overlapped versus non-overlapped DDP](https://github.com/cfregly/ai-performance-engineering/blob/b57e4c6a9e261c09ac09208705d040c81b03d35e/code/ch04/ddp_overlap.py) - Run `ddp_overlap.py` against `ddp_no_overlap.py` with `torchrun` on the two-GPU workstation and attribute the difference with a rank timeline. Targets that fail fast with SKIPPED: on unsupported hosts are blockers, not results; record the topology dump with the run.

**Stop when:** Your timeline shows concurrent communication and compute with matching outputs, and you can name the bucket or dependency behind every exposed millisecond.

<details>
<summary>Self-test</summary>

1. Which stream runs an NCCL collective, and how do other streams wait for it?
   - The calling stream the collective was enqueued to. Other streams wait through recorded events, not through host synchronization.
2. Why does only the last bucket stay exposed when compute covers communication?
   - Each earlier bucket reduces while later layers still compute. The last bucket has no later compute left to hide behind, so its communication time remains.
3. What timeline pattern proves overlap rather than fast kernels?
   - Communication and compute ranges concurrent on different streams with end-to-end time below their sum, plus identical outputs to the serial run.
4. Gradient accumulation over 4 minibatches changes what before overlap is tuned?
   - It cuts all-reduce frequency by 4x, shrinking total communication first. Overlap tuning then applies to a smaller remaining cost.

</details>

#### U6. Rank-aligned timelines, stragglers, congestion and partial failure

**About 4 h** · **Target:** Measure

Topics: Rank-aligned timelines, collective sequence and straggler attribution; Link congestion, shared-fabric interference and tail behavior; Collective timeout, partial failure, retry and invalid measurement

Multi-rank runs fail as one unit: the slowest rank sets collective time and one mismatched call hangs all ranks. Aligned timelines are the only evidence that separates a slow peer from a slow fabric.

**You can now**

- Attribute a slow collective to a straggler, congestion, CPU affinity or an ordering failure from rank-aligned timeline evidence.
- Apply timeout, abort and retry contracts correctly, and mark the measurements a partial failure invalidates.

**Study**

1. [NCCL failure modes and debugging](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 4, 15, 17 and 18) - Chapter 4, Multinode Communication Pitfalls; NCCL Communicator Lifecycle and Environment Gotchas; Profiling and Debugging NCCL.
2. [Logging and subsystem filters](https://docs.nvidia.com/deeplearning/nccl/archives/nccl_2323/user-guide/docs/troubleshooting/logging.html) (NCCL) - Logging levels with NCCL_DEBUG and filtering by subsystem (GRAPH, COLL, NET, TUNING): separate init hangs from network faults from performance issues.
3. [Performance and affinity triage](https://docs.nvidia.com/deeplearning/nccl/archives/nccl_2323/user-guide/docs/troubleshooting/performance_and_tuning.html) (NCCL) - Intra-node versus inter-node issues with CPU and memory affinity: pin NIC handling to the NUMA node beside the NIC and GPU before blaming the fabric.
4. [Straggler injection demo](https://github.com/cfregly/ai-performance-engineering/blob/b57e4c6a9e261c09ac09208705d040c81b03d35e/code/ch04/barrier_straggler_multigpu.py) (AI Systems Performance Engineering companion code - Chapters 4, 15 and 17) - `barrier_straggler_multigpu.py`: one slow rank stretches the collective; inspect how barrier timings isolate it. Depth: Inspect on the two-GPU workstation as an illustration. Full straggler statistics need more ranks; the section mini-project runs them.

**Focus**

- Correlate the same collective sequence across ranks: matching start-order with one late rank is a straggler, while all ranks slow together with switch counters rising is congestion. A barrier probe before the collective separates the two.
- Collective mismatch (different counts, datatypes or call order on some rank) hangs rather than errors. Check the matched-call contract before the network whenever all ranks stall at the same call.
- InfiniBand patience has a number: `NCCL_IB_TIMEOUT` 20 means about 4.3 seconds per attempt and 7 retries total about 30 seconds before a network error. Set timeouts from that product, not from habit.
- In NCCL, asynchronous errors surface by polling `ncclCommGetAsyncError`, and recovery goes through `ncclCommAbort` rather than reusing a suspect communicator; PyTorch wraps this behind `TORCH_NCCL_ASYNC_ERROR_HANDLING`. Timings collected across an abort are invalid results, not slow results.

**Reproduce:** From per-rank collective durations, name the straggler rank and compute the waiting time it imposes on the fastest rank. Then state the barrier experiment that confirms the attribution and the abort procedure that invalidates the run.

**Traps**

- Averaging rank times into one number. The mean hides the straggler that sets collective time; report per-rank durations with the max identified.
- Blaming the fabric for an affinity fault. Unpinned NIC handling on the wrong NUMA node reproduces congestion-like symptoms with healthy links; the tuning page lists affinity before fabric claims.
- Retrying on a suspect communicator after a fault. Abort it and rebuild; a reused communicator can hang the retry and convert one failure into a full-job stall.

**Practice**

- The section mini-project covers this: rank-aligned timelines, injected straggler and partial-failure runs, and congestion-versus-affinity attribution.

**Stop when:** Given any slow-collective timeline you name straggler, congestion, affinity or mismatch with the confirming experiment, and no invalid post-abort timing survives in your results.

<details>
<summary>Self-test</summary>

1. Seven ranks finish a collective in 4 ms and one takes 40 ms. Straggler or congestion?
   - Straggler. Congestion slows ranks together with fabric counters rising; one late rank with the rest aligned points at that peer, confirmed by a barrier probe that shows the same skew without data movement.
2. What does `NCCL_DEBUG_SUBSYS=GRAPH` show that `WARN` alone does not?
   - The detected topology graph and the ring and tree paths NCCL built. Algorithm and protocol choice is the TUNING subsystem, so enable both: WARN reports the failure, GRAPH and TUNING explain the plan behind it.
3. How long does NCCL wait on InfiniBand before raising a network error at defaults?
   - About 30 seconds: timeout 20 gives about 4.3 seconds per attempt times 7 retries. Change either variable deliberately and record both.
4. All ranks hang inside the same all-reduce with healthy links. What do you check first?
   - The matched-call contract: same count, datatype and call sequence on every rank. A mismatch hangs all ranks at that call with nothing wrong in the fabric.

</details>

#### U7. All-to-all and MoE dispatch, combine and load balance

**About 5 h** · **Target:** Derive

Topics: All-to-all and mixture-of-experts dispatch traffic; Mixture-of-experts dispatch, combine and communication kernels; Token skew, hot experts and load-balanced placement

Expert parallelism replaces one big all-reduce with two all-to-alls per layer whose sizes follow routing, not ranks. Skew, not peak links, usually sets MoE step time.

**You can now**

- Derive all-to-all dispatch and combine bytes with capacity needs for a stated mixture-of-experts shape.
- Predict hot-expert imbalance effects on step time, and defend replication, capacity or rebalancing against measured per-expert counts.

**Study**

1. [Expert parallelism and routing](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 4, 15, 17 and 18) - Chapter 15, Expert Parallelism; Dynamic Routing Strategies for MoE Inference with Expert Communication Optimization and Load Balancing, Capacity Factor, and Expert Replication.
2. [AlltoAll semantics for dispatch](https://docs.nvidia.com/deeplearning/nccl/archives/nccl_2323/user-guide/docs/usage/collectives.html#alltoall) (NCCL) - AlltoAll: each rank sends a distinct block to every rank with no reduction; dispatch and combine each move the full routed activation set.
3. [Dispatch and combine paths](https://github.com/deepseek-ai/DeepEP/tree/93eb6eb238127e96c6d7a4a625a6dad158348509) (DeepEP) - README Interfaces and examples with `dispatch` and `combine` through one `EPBuffer`; `do_cpu_sync` `True` for exact training and prefill sizes, `False` for GPU-side decode counts; NVLink inside a node with RDMA and IB between nodes. Depth: Reading and derivation only. DeepEP needs Hopper GPUs with multi-GPU RDMA; do not run it on Ampere hardware.
4. [MoE dispatch and routing benchmarks](https://github.com/cfregly/ai-performance-engineering/blob/b57e4c6a9e261c09ac09208705d040c81b03d35e/code/ch15/baseline_moe_dispatch.py) (AI Systems Performance Engineering companion code - Chapters 4, 15 and 17) - `baseline_moe_dispatch.py` with `optimized_moe_dispatch.py`; `baseline_moe_routing_topology_aware.py` with its optimized pair.

**Focus**

- One MoE layer pays dispatch plus combine: about $`2 \times T \times k \times h`$ elements times bytes per element for $`T`$ tokens, top-$`k`$ routing and hidden size $`h`$. Both halves are all-to-all; neither is a reduction.
- Capacity per expert is $`c \times T \times k / E`$ for capacity factor $`c`$ over $`E`$ experts. Factors around 1.2 to 1.5 with top-2 gating are the book's starting point; overflow routes to second-choice experts and drops or spills only under a stated policy.
- Uniform routing is a modelling convenience, not a measurement. Hot experts stretch the step while cold ranks wait, so per-expert token counts are mandatory evidence before any placement claim.
- DeepEP V2 unified the low-latency and high-throughput paths into one `EPBuffer` interface switched by `do_cpu_sync`, and V2.5 removed V1 and its NVSHMEM backend. Older guides describing two separate modes no longer match the repository.

**Reproduce:** Closed-book, derive per-layer dispatch and combine bytes for stated $`T`$, $`k`$, $`h`$, dtype and expert count, plus per-expert capacity at a stated factor. Evaluate at $`T = 4096`$, $`k = 2`$, $`h = 4096`$, FP16 and $`E = 8`$, then show how one expert taking twice its share changes the max.

**Traps**

- Sizing the fabric for average load. The step follows the hottest expert, so average-based provisioning underbuys the link and the buffer the hot rank needs.
- Treating dispatch as an all-reduce. Summing routed activations corrupts every expert input; dispatch permutes blocks and combine returns them, with the routing metadata as part of the contract.
- Running DeepEP paths on the workstation's Ampere GPUs. The kernels assume Hopper with NVLink and RDMA; on other hardware the failure is a wrong-hardware error, not a tuning problem.

**Practice**

- The section mini-project covers this: MoE dispatch and combine volume, the capacity-factor policy, and hot-expert measurement with a rebalancing decision.

**Stop when:** Your hand dispatch, combine and capacity numbers match a worked example, and you can name the hot expert and the fix from per-expert counts alone.

<details>
<summary>Self-test</summary>

1. What are the dispatch bytes at $`T = 4096`$, $`k = 2`$, $`h = 4096`$ in FP16?
   - $`4096 \times 2 \times 4096 \times 2 = 67{,}108{,}864`$ bytes, about 67 MB decimal or 64 MiB. Combine moves the same amount back.
2. With $`E = 8`$ experts and capacity factor 1.25, what is each expert's token cap?
   - $`1.25 \times 4096 \times 2 / 8 = 1280`$ tokens. Tokens above the cap follow the overflow policy instead of the assigned expert.
3. One expert receives twice its average share. What happens to step time?
   - Its all-to-all peers and its compute stretch while other ranks wait at the next dependency. Step time follows the hot expert, so the fix is replication, rebalancing or a higher cap with measured counts.
4. Combine needs which metadata from dispatch?
   - The routing decisions: which token went to which expert. Without them combine cannot return each output to its source token.

</details>

#### U8. Prefill-decode disaggregation and KV transfer

**About 5 h** · **Target:** Derive + Explain

Topics: Prefill and decode disaggregation as a performance mechanism; Key-value transfer bytes, bandwidth, latency and crossover; NIXL and connector data-path identity; DistServe, Splitwise and Mooncake architectural trade-offs

Prefill is compute-bound and decode is memory-bound, so colocation forces one phase to wait for the other. Disaggregation removes the interference at the price of one KV transfer per request.

**You can now**

- Derive KV transfer bytes and transfer time for a stated model and sequence length, and call the disaggregation crossover against colocated interference.
- Contrast DistServe, Splitwise and Mooncake placement, hardware and scheduling choices for a stated TTFT and TPOT SLO.
- Explain the NIXL connector path from memory registration through metadata exchange to transfer completion.

**Study**

1. [Disaggregation, interference and goodput](https://arxiv.org/html/2401.09670v3) (DistServe) - Sections 2.3 (prefill-decoding interference and why chunked prefill cannot remove it), 3.1 to 3.3 (phase analysis with the 512-token OPT-66B transfer sizing), and 4.1 to 4.2 (high and low node-affinity placement); read arXiv:2401.09670v3.
2. [Disaggregated pools, KV sizing and hardware split](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 4, 15, 17 and 18) - Chapter 17, Why Prefill-Decode Disaggregation? with Disaggregated Prefill and Decode Cluster Pools; Chapter 18, Fast KV Cache Transfer Between Prefill and Decode with Connector and Data Path Design and Compute-Optimized Versus Memory-Optimized Hardware.
3. [Transfer API and backends](https://github.com/ai-dynamo/nixl/tree/ee4bddbbccfc80afe5bcea8e86727055fc908667) (NVIDIA Inference Xfer Library) - `docs/nixl.md` Design and Example procedure: `create_agent`, `register_memory`, metadata exchange, then `create_xfer_req`, `post_transfer_request` and `get_xfer_status`; `docs/BackendGuide.md` for the backend side (`registerMem`, `prepXfer`, `postXfer`, `checkXfer`) and how the agent picks a backend by memory type. Depth: Inspect the API and run only supported single-host transports. Multi-node RDMA paths need hardware you do not have here.
4. [Phase-specific machines](https://www.microsoft.com/en-us/research/publication/splitwise-efficient-generative-llm-inference-using-phase-splitting/) (Splitwise: Efficient Generative LLM Inference Using Phase Splitting) - arXiv:2311.18677v2 (ISCA 2024): phase characterization with homogeneous and heterogeneous cluster designs: up to 1.4x higher throughput at 20 percent lower cost, or 2.35x more throughput under the same power and cost.
5. [KVCache-centric disaggregation](https://www.usenix.org/conference/fast25/presentation/qin) (Mooncake: Trading More Storage for Less Computation) - KVCache-centric architecture with the global cache, transfer engine, prefill scheduling and early rejection: 59 to 498 percent higher effective capacity on the paper's traces.

**Focus**

- Goodput is the maximum request rate served within both TTFT and TPOT at a stated attainment such as 90 percent. DistServe reports up to 7.4x more requests and 12.6x tighter SLOs on its workloads; treat both as paper-specific, not portable speedups.
- KV bytes per token are $`2 \times L \times H_{\text{kv}} \times d \times b`$ for $`L`$ layers, $`H_{\text{kv}}`$ key-value heads, head dim $`d`$ and $`b`$ bytes per element. The short form without dtype and grouped-query heads undercounts grouped models by the head ratio.
- A 40-layer, 40-head, dim-128 FP16 model holds about 0.82 MB per token, or 3.36 GB decimal for 4096 tokens. At 100 GB/s that transfer takes about 34 ms; disaggregation wins only when the removed interference exceeds it.
- Move KV in slabs, not blocks: coalesce 16-token paged blocks into roughly 128-token payloads per RDMA write, overlap the transfer with decode compute, and keep first-token logits off the transfer path.

**Reproduce:** Closed-book, compute per-token and per-request KV bytes for a stated layer count, key-value heads, head dim, dtype and sequence length, convert to transfer time at two stated link rates, and call whether disaggregation wins given stated TTFT and TPOT slack.

**Traps**

- Quoting the paper's 1.13GB transfer without recomputing. The byte count behind it is about 1.2e9 bytes (1.13 GiB scale) for 512 tokens on OPT-66B; recompute from the formula and label GB versus GiB before sizing any link.
- Trusting a rule of thumb for KV size. Llama-2-70B (80 layers, 8 KV heads, head dim 128) holds about 0.33 MB per token in FP16, or 1.34 GB for 4096 tokens; with all 64 heads as KV it would hold 2.6 MB per token. Size from the formula with the stated heads and dtype, and size the transfer buffer from that result plus headers.
- Believing chunked prefill removes interference. It trades TPOT relief for extra prefill work with quadratic KV reloads across chunks; only separate pools remove the coupling.

**Practice**

- [AI Systems companion code ch15: single-GPU KV handoff and cache math](https://github.com/cfregly/ai-performance-engineering/blob/b57e4c6a9e261c09ac09208705d040c81b03d35e/code/ch15/baseline_single_gpu_kv_handoff.py) - Run `baseline_single_gpu_kv_handoff.py` against `optimized_single_gpu_kv_handoff.py` with `kv_cache_management_math.py`; compute the transfer crossover for your sequence lengths. Single-host paths only. Multi-GPU disaggregated pairs need two GPUs, so record them as blockers with the topology dump.

**Stop when:** Your hand KV sizing matches the math script, your crossover calls the measured handoff correctly, and you can defend the DistServe, Splitwise and Mooncake choice for one stated SLO.

<details>
<summary>Self-test</summary>

1. What are the KV bytes for 4096 tokens on a 40-layer, 40-head, dim-128 FP16 model?
   - $`2 \times 40 \times 40 \times 128 \times 2 = 819{,}200`$ bytes per token, about 0.82 MB, times 4096 is about 3.36 GB decimal. Transfer time is that divided by the effective link rate.
2. At 10 rps with 1.2 GB per request, what link does the transfer need?
   - 12 GB/s, or about 96 Gbps before overheads. That is why link sizing matters: a 100 Gb/s link saturates while an 800 Gb/s link stays comfortable.
3. What distinguishes Splitwise placement from DistServe placement?
   - Splitwise assigns phases to different machine types (compute-optimized prefill, memory-optimized decode, including heterogeneous mixes), while DistServe co-optimizes GPU counts and parallelism per phase for goodput under TTFT and TPOT.
4. What does Mooncake add beyond separating prefill and decode pools?
   - A KVCache-centric global cache that reuses stored KV across requests plus SLO-aware scheduling with early rejection when a request cannot meet its objectives.
5. When does NCCL serve the transfer and when does NIXL?
   - NCCL for many-to-many synchronized collectives such as gradient or activation reductions; NIXL for one-to-one asynchronous KV moves that are polled for completion. NCCL send and receive can carry KV, but the book notes many deployments prefer NIXL or UCX for lower tail latency and better overlap.

</details>

#### U9. Communication measurement contracts and analytical or CPU simulation

**About 4 h** · **Target:** Implement + Measure

Topics: Single-node and multi-node bandwidth, latency, clocks and raw-result contract; Analytical and CPU simulation when multiple GPUs are unavailable

One timed all-reduce proves nothing: clocks drift, fabrics are shared and algorithm bandwidth is not link rate. The contract makes a communication number reproducible; simulation keeps work moving when ranks are missing.

**You can now**

- Run a bandwidth and latency sweep contract with topology, clocks, warmup and raw trials recorded, and fit the latency-bandwidth model to it.
- Build an analytical or CPU simulation of a collective or transfer path, and label exactly what it cannot prove without ranks.

**Study**

1. [Sweep harness and the two bandwidths](https://github.com/NVIDIA/nccl/blob/12df1a11afad322be5a204a2db890161cbf8131d/README.md) (NCCL) - README Tests section: clone nccl-tests and run `build/all_reduce_perf -b 8 -e 256M -f 2 -g <ngpus>`; report algorithm bandwidth beside bus bandwidth with the topology dump.
2. [Bandwidth contract and expectations](https://github.com/cfregly/ai-performance-engineering/blob/b57e4c6a9e261c09ac09208705d040c81b03d35e/code/ch04/bandwidth_benchmark_suite_multigpu.py) (AI Systems Performance Engineering companion code - Chapters 4, 15 and 17) - The `bandwidth_benchmark_suite` files with expectations JSON: preflight checks, clock capture, warmup separation and raw-trial storage through the harness.
3. [Tuning and logging discipline](https://docs.nvidia.com/deeplearning/nccl/archives/nccl_2323/user-guide/docs/troubleshooting/performance_and_tuning.html) (NCCL) - Intra-node versus inter-node triage with CPU and memory affinity; confirm `NET/IB` paths under `NCCL_DEBUG=INFO` before quoting any rate.
4. [Single-host simulation stand-ins](https://github.com/cfregly/ai-performance-engineering/blob/b57e4c6a9e261c09ac09208705d040c81b03d35e/code/ch15/placement_sim.py) (AI Systems Performance Engineering companion code - Chapters 4, 15 and 17) - `placement_sim.py` with `disaggregated_inference_single_common.py`: analytical placement and single-host transfer projection when ranks are unavailable.

**Focus**

- Record the full contract with every sweep: message sizes, ranks, topology dump, NCCL version, clocks with power and thermal state, warmup, interleaved repeated trials with raw samples, and medians. Boost clocks drift with temperature, so one best timing is not evidence.
- Fit $`\alpha`$ and $`\beta`$ to wire bytes per rank (for ring all-reduce $`2S(N-1)/N`$), never to $`S`$. Predict one held-out size and report the error; a fit that cannot predict is a description, not a model.
- Algorithm bandwidth is $`S`$ over time; bus bandwidth corrects for the collective's wire factor. Quote both with the factor stated, and never present either as the link rate without the correction.
- Simulation (analytical projection, `placement_sim`, single-host handoff, CPU MPI from the earlier unit) proves indexing, volumes and crossover logic. It cannot prove contention, stragglers, affinity or failure behaviour; label those as unmeasured.

**Reproduce:** From three sweep points, fit $`\alpha`$ and $`\beta`$ by hand, predict the time at a fourth held-out size, and state the hardware, toolkit and clock setup the fit depends on.

**Traps**

- Quoting bus bandwidth as achieved link rate. The correction factor runs the other way: back out wire bytes first, then compare against the directional peak with contention noted.
- Benchmarking once at a cold clock and keeping the best run. Interleave repeated trials across configurations and report medians with spread; drift between first and last trial is a finding, not noise to delete.
- Publishing cluster-scale numbers from one workstation. Numbers for hardware without ranks are derivations with stated assumptions or cited vendor peaks for named hardware, never measurements.

**Practice**

- [nccl-tests `all_reduce_perf` bounded sweep with latency-bandwidth fit](https://github.com/NVIDIA/nccl-tests/tree/afd59abab774a6a4b492eb344bd0c845a0b7bb4d) - Run `build/all_reduce_perf -b 8 -e 256M -f 2 -g 2` on the two-GPU workstation; record the topology dump, NCCL version and clocks; fit the latency-bandwidth model and predict one held-out size. Single-GPU hosts run the ch04 single-host bandwidth baseline with the analytical projection instead and label it simulation.

**Stop when:** Your sweep predicts the held-out size within your stated error with the full contract attached, and every simulated number is labelled with what ranks would change.

<details>
<summary>Self-test</summary>

1. A sweep reports algorithm bandwidth 60 GB/s for an 8-rank ring all-reduce. What was the per-rank wire rate?
   - Wire bytes per rank are $`2S \times 7/8 = 1.75S`$, so the wire rate is $`1.75 \times 60 = 105`$ GB/s of bytes on the wire per rank. Compare that, not 60, against the directional peak.
2. Why interleave trials across configurations instead of running each once?
   - Clocks, temperature and shared-fabric load drift over minutes. Interleaving spreads the drift across configurations so medians compare states fairly; single runs compare different machines in effect.
3. What does `NCCL_DEBUG=INFO` confirm before a rate is quotable?
   - That the intended transport is active: NET/IB paths for RDMA rather than socket fallback, the topology NCCL detected, and the algorithm and protocol selected.
4. What can a single-host analytical simulation establish, and what can it not?
   - It establishes volumes, crossover logic, placement feasibility and indexing correctness. It cannot establish contention, straggler tails, affinity effects or failure handling, which need ranks.

</details>

### Mini-project: Two-GPU collectives, overlap and disaggregation on the workstation

**About 10 to 14 hours.** Move kernellab onto the workstation with two RTX A5000 24 GB GPUs over PCIe without NVLink: model collectives, sweep message sizes, prove overlap, align rank timelines under injected faults, measure expert skew and test the disaggregation crossover. Single-GPU analytical runs are labeled simulation, never link rates.

1. Capture `nvidia-smi topo -m` on the workstation and label each GPU pair with its path. Sketch the four-GPU hierarchy example (GPUs 0 and 1 on one NVLink pair, 2 and 3 on another, PCIe between pairs) and state which exchange crosses the slow link and why it carries only a fraction of the data. Run the ch04 PCIe staging pair plus `nccl_benchmark.py` on compatible single-host paths, recording topology dumps; mark NVLink-only and multi-GPU-only paths as explicit blockers with the dump attached rather than reporting fallback timings as link rates.
2. Derive ring all-reduce time as reduce-scatter plus all-gather: $`T = 2(N-1)\alpha + 2S(N-1)/(NB)`$, with the crossover size where latency and bandwidth terms are equal for stated $`\alpha`$ and $`B`$. Derive per-rank bytes and step counts for ring all-gather, reduce-scatter, all-reduce and the alternate algorithm for general $`N`$ and $`S`$, evaluating each at $`N = 4`$ and $`S = 1`$ GB with the winner and margin named. Build `myAllreduce` and `myAlltoall` from point-to-point calls and the naive model-parallel forward and backward communication in `mpi_wrapper/comm.py`, checked by `mpirun -n 8 python mpi-test.py --test_case` cases plus the pytest files on CPU with Open MPI and `mpi4py`, with the timing comparison against library versions kept. Solve the TensorTonic collective, bandwidth, gradient-average and column-parallel MLP problems after the matching units.
3. Build nccl-tests against the NCCL that PyTorch ships (`make CUDA_HOME=... NCCL_HOME=...`) and run `build/all_reduce_perf -b 8 -e 256M -f 2 -g 2` on the two A5000 GPUs under Ring, Tree and the default with `NCCL_PROTO` set to LL, LL128 and Simple, recording the NCCL version and topology dump with every number. Predict first, then compare: on two A5000s joined across sockets by PCIe with NCCL 2.27.5, an 8-byte all-reduce took about 8 us with LL, 16 to 17 us with LL128 and 23 us with Simple under either algorithm, and at 256 MB Ring with Simple took 19.9 ms (13.5 GB/s bus bandwidth), the same as the default. State the two rules that overrides precede communicator creation and rank order fixes output layout and root identity.
4. Derive exposed time for $`B = 4`$ equal buckets with per-bucket communication $`c`$ and covering compute $`t`$ where $`t`$ covers $`c`$: total exposed time near $`c`$ for the last bucket rather than $`4c`$, stating the dependency the proof assumes. Run `ddp_overlap.py` against `ddp_no_overlap.py` with `torchrun` on the two A5000 GPUs and attribute the difference with rank-aligned timelines.
5. Collect rank-aligned timelines for one collective, name the straggler rank from per-rank durations and compute the waiting time imposed on the fastest rank. Confirm the attribution with a barrier experiment, then inject a straggler and a partial failure, record the abort procedure that invalidates the affected run, and separate congestion against affinity with a placement swap. Use the two A5000 GPUs for every fault run.
6. Derive per-layer dispatch and combine bytes for stated $`T`$, $`k`$, $`h`$, dtype and expert count plus per-expert capacity at a stated factor. Evaluate at $`T = 4096`$, $`k = 2`$, $`h = 4096`$, fp16 and $`E = 8`$, then show how one expert taking twice its share changes the maximum. Measure hot-expert behavior on the two A5000 GPUs, apply the capacity-factor policy, and record the rebalancing decision with its predicted effect.
7. Compute per-token and per-request KV bytes for a stated layer count, KV heads, head dim, dtype and sequence length, convert to transfer time at two stated link rates, and call whether disaggregation wins given stated TTFT and TPOT slack. Run the single-GPU KV handoff pair with cache math on compatible paths, recording multi-GPU disaggregated pairs as blockers with topology dumps where hardware blocks execution. Fit $`\alpha`$ and $`\beta`$ by hand from three `all_reduce_perf` sweep points, predict a fourth held-out size, and state the hardware, toolkit and clock setup the fit depends on.

**Deliverables**

- Topology dumps with labeled paths, the collective derivations with the crossover, and the CPU MPI checks with library timing comparisons.
- The NCCL sweep with version and dump per number, the overlap attribution with rank-aligned timelines, and the straggler and partial-failure runs with abort records.
- The MoE volume and hot-expert decision, the disaggregation crossover with transfer math, and the latency-bandwidth fit with a held-out prediction.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [CSE 291A PA2 Part 2 local MPI tests](https://github.com/hao-ai-lab/cse-dsc291-s26-pa/tree/main/pa2). Run the `mpi-test.py` cases and pytest files on CPU with Open MPI and `mpi4py`; keep the `discussion2-1.txt` timing comparison.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Model before link claims | Ring derivations give bytes and steps with the crossover stated, the NCCL sweep names version and topology per number, and single-host analytical runs are labeled simulation. | The four-GPU sketch names which exchange crosses the slow link and why. |
| Overlap and straggler proof | The four-bucket exposed-time derivation states its dependency, DDP overlap is attributed from aligned timelines, and the straggler rank with waiting time is confirmed by a barrier experiment. | The partial-failure run names the abort procedure that invalidates it. |
| Skew and crossover decisions | MoE dispatch and combine volumes with the capacity policy and hot-expert measurement support the rebalancing decision, and the KV crossover calls disaggregation against stated slack with transfer math. | The held-out size prediction is checked against measurement with the setup stated. |

Feeds into: Capstone communication: the NCCL sweep, overlap proof, straggler analysis, MoE decision and disaggregation crossover. The final report reuses the topology dumps and the fitted model.

### Resource route

- **Primary - Book:** [AI Systems Performance Engineering - Chapters 4, 15, 17 and 18](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) - Read Chapter 4 on distributed networking communication, the parallelism parts of Chapter 15, and Chapters 17 and 18 on disaggregated prefill and decode and KV-cache transfer. Re-derive every volume and crossover for the hardware you actually have.
- **Support - Lab:** [AI Systems Performance Engineering companion code - Chapters 4, 15 and 17](https://github.com/cfregly/ai-performance-engineering/tree/main/code) - Use compatible examples from `code/ch04`, `code/ch15` and `code/ch17` for NCCL, topology, overlap and disaggregated inference. Run preflight checks, lock and record clocks through the harness, and mark unsupported transport or topology paths as explicit blockers.
- **Reference - Reference:** [AI Performance Engineering - Distributed Inference](https://github.com/wafer-ai/gpu-perf-engineering-resources) - A curated index. Use Section 5 only to find primary papers for a communication mechanism you are measuring.
- **Required - Implementation:** [NCCL](https://github.com/NVIDIA/nccl) - Study the collective API, communicator and topology behavior, then run a bounded nccl-tests message-size sweep when multiple GPUs are available. Correlate algorithm bandwidth, bus bandwidth and rank timelines with the $`\alpha`$-$`\beta`$ model.
- **Required - Assignment:** [UCSD CSE 291A/DSC 291 (Spring 2026) PA2 Part 2 - Tensor Parallel Communication](https://github.com/hao-ai-lab/cse-dsc291-s26-pa/tree/main/pa2) - Build all-reduce and all-to-all from point-to-point MPI calls (Section 2.1), then the data split, layer initialization and naive model-parallel forward and backward communication (Sections 2.2 to 2.5) against the provided `mpi-test.py` cases and pytest files. It runs on CPU processes with Open MPI and `mpi4py`.
- **Support - Assignment:** [CS336 Assignment 2 - Section 8.1 Communication Primitives](https://github.com/stanford-cs336/assignment2-systems) - Work `alternate_ring_all_reduce` and the communication-volume reasoning in Section 8.1 as a written check on your cost model.
- **Support - Practice:** [TensorTonic Language Modeling from Scratch - collective problems](https://www.tensortonic.com/study-plans/language-modeling-from-scratch) - Solve Simulate Distributed Collectives, Calculate Collective Effective Bandwidth, Synchronize Data-Parallel Gradients and Reconstruct a Column-Parallel MLP Layer after the collective units.
- **Support - Lectures:** [GPU MODE - Collective Communication](https://github.com/gpu-mode/lectures) - Use Lectures 17, 67, 70 and 78 for NCCL, NVSHMEM, fault-tolerant collectives and multi-GPU Triton. Implement or inspect one communication mechanism only after the volume and topology model is written.
- **Required - Paper:** [DistServe](https://arxiv.org/html/2401.09670v3) - Study prefill-decode interference, phase-specific parallelism and goodput optimization. Build a small simulator or measured two-pool experiment and test the key-value transfer crossover rather than reproducing the complete serving system.
- **Support - Implementation:** [NVIDIA Inference Xfer Library](https://github.com/ai-dynamo/nixl) - Inspect memory registration, transfer backends and metadata APIs as the state-movement layer for disaggregation. Run only supported local transports and compare measured transfer setup and steady-state cost with the model.
- **Depth - Implementation:** [DeepEP](https://github.com/deepseek-ai/DeepEP) - Reconstruct expert dispatch and combine paths, low-latency versus high-throughput modes and hardware assumptions. Test a small supported path only after a standard collective baseline and load-skew model exist.
- **Support - Paper:** [Splitwise: Efficient Generative LLM Inference Using Phase Splitting](https://www.microsoft.com/en-us/research/publication/splitwise-efficient-generative-llm-inference-using-phase-splitting/) - Read arXiv:2311.18677v2 (ISCA 2024) for the phase characterization and the homogeneous and heterogeneous cluster designs. Test the throughput, cost and power claims as hardware-specific results, and compare its placement with DistServe on your workload.
- **Support - Paper:** [Mooncake: Trading More Storage for Less Computation](https://www.usenix.org/conference/fast25/presentation/qin) - Study the KVCache-centric disaggregated architecture, the global cache with its transfer engine, and the prefill scheduling with early rejection. Test the effective-capacity claims as trace-specific results.

### Exit checkpoint

Model and measure one collective or key-value transfer path across message sizes and topology, align multi-rank traces, quantify exposed communication or disaggregation crossover, and retain a single-GPU analytical route when hardware blocks execution.

<details>
<summary>Deliberately left for later</summary>

- Full distributed-training strategy, sharding and checkpointing already owned by Distributed Training
- Full serving scheduler, request identity and production disaggregation already owned by Inference
- Custom transport, collective or multi-node claims without the required hardware and topology evidence

</details>

## GPU-10. Portability, Benchmark Audit and Performance Research

**Why:** The final stage turns isolated optimizations into defensible engineering. It audits benchmark validity, handles architecture and compiler change, modifies a real kernel or compiler path, and reports workload-weighted gains, losses and portability limits.

### Learn this much

- [ ] Architecture brief, tuning guide, ISA and counter documentation as separate evidence _(Required)_
- [ ] Hopper, Blackwell and later NVIDIA capability differences _(Required)_
- [ ] AMD CDNA, ROCm counters and implementation vocabulary _(Optional)_
- [ ] TPU hardware model and Pallas kernel vocabulary _(Depth)_
- [ ] Trainium architecture and NKI kernel vocabulary _(Depth)_
- [ ] Device, compiler, library and feature capability matrix _(Required)_
- [ ] Correct fallback, unsupported-path errors and compatibility tests _(Required)_
- [ ] Vendor peak numbers as analytical bounds, not measurements _(Required)_
- [ ] Offline, server, single-stream and interactive scenario boundaries _(Required)_
- [ ] MLPerf scenario, load-generation and result-boundary vocabulary _(Required)_
- [ ] Endpoint goodput under latency and correctness constraints _(Required)_
- [ ] Production-like arrival, length and burst distributions _(Required)_
- [ ] Timing, baseline, workload, correctness and cherry-picking audit _(Required)_
- [ ] Baseline parity in precision, algorithm, compiler flags and allowed libraries _(Required)_
- [ ] KernelBench task, correctness and speedup contract _(Required)_
- [ ] Hardened correctness, baseline parity and evaluator coverage _(Required)_
- [ ] Hardware speed-of-light bound and attainable efficiency _(Required)_
- [ ] AI-generated kernel reward hacking, undefined behavior and narrow tests _(Required)_
- [ ] Held-out shapes, values, devices and compiler versions _(Required)_
- [ ] Reconstruction of a real kernel, compiler or communication dispatch path _(Required)_
- [ ] One bounded change with a predeclared mechanism hypothesis _(Required)_
- [ ] Correctness, performance, dispatch, fallback and rollback protection _(Required)_
- [ ] Clean build, environment lock and independent reproduction _(Required)_
- [ ] Claim-to-code, raw result, trace, counter and report links _(Required)_
- [ ] Workload-weighted endpoint or training-step impact _(Required)_
- [ ] Negative result, losing regime and portability limit _(Required)_
- [ ] Defense against stronger baselines, alternate explanations and maintenance cost _(Required)_
- [ ] AI-assisted kernel generation and adaptive runtime tuning _(Depth)_
- [ ] Unshipped hardware and unreproduced frontier claims _(Later)_

### Study units

#### U1. Architecture documents, generation differences and vendor peaks as bounds

**About 4 h** · **Target:** Explain

Topics: Architecture brief, tuning guide, ISA and counter documentation as separate evidence; Hopper, Blackwell and later NVIDIA capability differences; Vendor peak numbers as analytical bounds, not measurements

A peak number is a ceiling, not a result. Reading the right document tells you whether a claim is even possible before you spend a day measuring it.

**You can now**

- Explain which document answers which question: brief for system architecture, tuning guide for optimization, ISA for instructions, counter docs for measurement.
- Contrast Ampere, Hopper and Blackwell on Tensor-Core formats, TMA, thread-block clusters and memory using the compute-capability tables.
- Derive a vendor-peak bound from per-SM throughput times SM count times clock, and label every assumption that makes it a bound rather than a measurement.

**Study**

1. [Compute Capabilities: feature and specification tables](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/compute-capabilities.html) (CUDA Toolkit and Architecture Tuning Guides) - Section 5.1.3 (CUDA 13.4.2 documentation): read the 8.x column of Table 29 and the 8.6 columns of Tables 30 to 33 against the 9.0 and 10.x columns for Tensor-Core dtypes, TMA, thread-block clusters and shared memory; Section 5.1.1 for the runtime query triplet.
2. [Arithmetic instruction throughputs as peak sources](https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html#arithmetic-instructions-throughput-native-arithmetic-instructions) (CUDA Toolkit and Architecture Tuning Guides) - Section 12.1.1, Table 5: the 8.6/8.9 column for 32-bit floating-point add, multiply and multiply-add (128 results per clock per multiprocessor); the note that throughputs are per multiprocessor and max theoretical.
3. [Hardware generations and the number-as-hypothesis rule](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 2, 19 and 20 and the Appendix checklist) - Chapter 2, AI System Hardware Overview: The CPU and GPU Superchip, NVIDIA GPU Tensor Cores and Transformer Engine, and A Glimpse into the Future.
4. [Current-hardware map and Source Policy](https://github.com/wafer-ai/gpu-perf-engineering-resources) (AI Performance Engineering - Hardware, Frontier and Source Policy) - Section 6, Current hardware: follow one architecture entry to its ISA or tuning guide; Source Policy: vendor peak numbers are not performance measurements, and performance claims need hardware, workload, precision, baseline and correctness method. Depth: Use the list only to find primary documentation. Do not cite the list itself for numbers.

**Focus**

- Brief, tuning guide, ISA and counter documents answer different questions. A peak in a brief is an upper bound; only a counter on your GPU is a measurement.
- Capability tables group columns by compute-capability number (8.x or 8.6, 9.0, 10.x), not by marketing name. Section 5.1.2 states that features introduced with an architecture are intended to stay available on later ones, which is why a Yes spans every column after its introduction; architecture-specific features are the exception.
- Table throughputs are per multiprocessor and max theoretical, achievable only with specific instruction sequences. Multiply by SM count and clock, and count one multiply-add result as two operations.
- Relative to Ampere, Hopper adds TMA, thread-block clusters, FP8 Tensor-Core input (also on Ada, 8.9) and fourth-generation NVLink; Blackwell adds fifth-generation NVLink and Blackwell-only matrix instructions. New columns add features; old guarantees stay.

**Reproduce:** Closed-book, derive the FP32 peak and the memory bandwidth bound for an 18-SM `sm_86` card. Table 5 gives $`18 \times 128 \times 2 \times f`$ FLOP/s at SM clock $`f`$: $`6.8 \times 10^{12}`$ at the 1470 MHz reference boost and $`9.7 \times 10^{12}`$ at the 2100 MHz maximum that `nvidia-smi -q -d CLOCK` reports for the RTX 3050 6 GB. The 96-bit bus at 14e9 transfers/s gives $`12 \times 14 \times 10^{9} = 168 \times 10^{9}`$ bytes/s. Place the ridge point (about 40 FLOP/byte at the reference boost, 58 at the maximum) and name the clock your bound assumes: under load GPU Boost ran this card near 1.94 GHz, above its reference boost.

**Traps**

- Quoting a Table 29 Yes as performance. Availability is not speed; a Yes in the 8.x and 9.0 columns can hide an order of magnitude.
- Mixing GB with GiB when checking a bandwidth bound. The 168 GB/s datasheet figure is decimal gigabytes; divide measured bytes by time in the same unit.
- Reading a B200 or H100 number as your result. A peak from another GPU bounds nothing on yours; re-derive with your SM count from `prop.multiProcessorCount` and your clock.

**Practice**

- The section mini-project covers this: the per-kernel peak-bound table and ridge-point placement behind the Milestone E regime predictions.

**Stop when:** You can derive both peaks and the ridge point for your GPU from the tables without notes, and you reject a cross-GPU peak comparison on sight.

<details>
<summary>Self-test</summary>

1. Your GPU reports compute capability 8.6. Does it have an FP8 Tensor-Core input path?
   - No. The 8.6 column of the Tensor-Core dtype table shows no FP8 input; FP8 appears in later columns. An FP8 claim for this card needs a fallback path, not a peak quote.
2. Derive the FP32 peak of an 18-SM `sm_86` card from Table 5, and say which clock the bound should use.
   - Table 5 gives 128 multiply-add results per clock per multiprocessor for 8.6 and 8.9, and each counts as two operations: $`18 \times 128 \times 2 \times 1470 \times 10^{6} \approx 6.8 \times 10^{12}`$ FLOP/s at the 1470 MHz reference boost. That clock is typical, not a ceiling, so a bound uses the highest clock the card runs (2100 MHz on the RTX 3050 6 GB, $`9.7 \times 10^{12}`$) and names it.
3. Show the datasheet bandwidth arithmetic for the 6 GB card and state the unit.
   - A 96-bit bus carries 12 bytes per transfer at 14e9 transfers/s, so $`12 \times 14 \times 10^{9} = 168 \times 10^{9}`$ bytes/s, decimal GB/s. Compare against measured bytes per second in the same unit.
4. A post reports 3 TB/s on a newer GPU and claims your kernel should reach half of it. What is wrong?
   - A peak from another GPU is not your bound. Your card is bounded by 168 GB/s, so half of 3 TB/s is unachievable there; the comparison needs your hardware, your workload and your measured counters.

</details>

#### U2. AMD CDNA and ROCm vocabulary

**About 2 h** · **Target:** Explain

Topics: AMD CDNA, ROCm counters and implementation vocabulary

Portability starts with names. A bound, a fallback or a profile means nothing if compute unit, wavefront and shared memory are confused across vendors.

**You can now**

- Map CUDA terms for compute, threading, on-chip memory, matrix units and profiling to their AMD CDNA and ROCm counterparts at vocabulary depth.
- Distinguish the CDNA datacenter line from the RDNA graphics line and place Composable Kernel, AITER and HipKittens in the right software layer.

**Study**

1. [Lecture 10: taxonomy beyond NVIDIA](https://accelerated-computing.academy/fall25/lectures) (MIT 6.S894 Accelerated Computing (Fall 2025) - Lecture 10) - Lecture 10 slides 6 to 8: GPUs beyond NVIDIA (AMD RDNA versus CDNA) and programming non-NVIDIA GPUs; slides 9 to 11 and 17: higher-level kernel languages, the Triton matmul listing and Pallas as contrast.
2. [Other hardware stacks and the AMD hardware shelf](https://github.com/wafer-ai/gpu-perf-engineering-resources) (AI Performance Engineering - Hardware, Frontier and Source Policy) - Other hardware stacks: ROCm Composable Kernel, ROCm AITER, HipKittens, Pallas design and NKI programming model entries; Section 6, AMD: CDNA 4 whitepaper, CDNA 4 instruction set and MI350 performance counters. Depth: Use these entries as a map to official AMD documentation. Do not cite the list itself for architecture facts.
3. [Composable Kernel programming model](https://github.com/ROCm/composable_kernel) (ROCm Composable Kernel) - Repository `README`: the tile-based programming model, Tensor Coordinate Transformation and the four CK layers (Templated Tile Operators down to Client API); one tiled operator example from the supported-operations lists.

**Focus**

- CDNA is the datacenter compute line; RDNA is the graphics line. An inference kernel targets CDNA vocabulary, never gaming numbers.
- Composable Kernel describes kernels through composable tiles, layouts and pipelines in HIP C++; AITER ships ready inference operators; HipKittens is a tile abstraction. Match the layer before comparing terms.
- AMD counter names follow hardware blocks: compute unit, shader pipe interpolator, texture cache per pipe and per channel. Read the MI350 counter families as a vocabulary list, not as values.
- Pallas is a Triton-like DSL and the JAX kernel model for GPU and TPU backends; NKI is the tile-level model for NeuronCore. Both are separate programming models, not CUDA ports; note where each runs and stop there.

**Reproduce:** From memory, write the CUDA-to-AMD term map for compute unit, thread group, on-chip memory, matrix unit, profiler and kernel language with one-line roles each, and state which AMD line each targets.

**Traps**

- Treating HIP as CUDA with renamed calls. Grid and block structure carry over, but wavefront size, occupancy rules and shuffle semantics need per-architecture checks against AMD documentation.
- Reading an MI350 counter as portable. Counter definitions are per architecture; a CDNA 4 compute-unit counter means nothing on NVIDIA hardware or on older CDNA.
- Citing RDNA gaming throughput for a CDNA inference bound. Different lines, different memory systems, different peaks.

**Practice**

- The section mini-project covers this: the dispatch and fallback defense names the AMD (CDNA and HIP) counterpart of each dispatched path.

**Stop when:** You can name the CDNA line, the three AMD code layers and two counter families without notes, and explain why none of it executes on your NVIDIA card.

<details>
<summary>Self-test</summary>

1. Which AMD line targets datacenter inference, and which two repositories supply its tiling primitives and inference operators?
   - CDNA. Composable Kernel supplies tiling, layout and operator primitives; AITER supplies inference and transformer operator implementations.
2. What does HipKittens add over writing HIP directly?
   - A tile abstraction for AMD GPUs: decomposition and layout handled above raw threads, comparable in role to Triton or CuTe on NVIDIA.
3. Name two MI350 counter families and the block each watches.
   - Compute unit counters watch the compute units; texture cache per pipe and per channel counters watch the cache hierarchy. Command processor and shader pipe interpolator counters cover dispatch and scheduling.
4. Where does Pallas run, and what is it?
   - Pallas is a Triton-like DSL and the JAX kernel model for GPU and TPU backends. It is a separate programming model, not a CUDA port.

</details>

#### U3. Capability matrices, fallback and compatibility tests

**About 3 h** · **Target:** Implement

Topics: Device, compiler, library and feature capability matrix; Correct fallback, unsupported-path errors and compatibility tests

A kernel without a capability contract fails at someone else's machine, not at your desk. The matrix decides before launch; the fallback keeps older hardware working.

**You can now**

- Build a capability matrix for your kernels: minimum compute capability, required features and the runtime query that detects each.
- Implement dispatch with a correct portable fallback and an explicit error on unsupported paths, tested on every branch.
- Explain PTX compatibility and fatbin contents: what runs where, what JIT-compiles at load, and what fails.

**Study**

1. [Runtime capability queries and feature targets](https://docs.nvidia.com/cuda/cuda-programming-guide/05-appendices/compute-capabilities.html) (CUDA Toolkit and Architecture Tuning Guides) - Section 5.1.1: the runtime query triplet (`cudaDeviceGetAttribute` with `cudaDevAttrComputeCapabilityMajor`, the driver query and the NVML query); Section 5.1.2: architecture-specific versus family-specific features and compiler targets (baseline, family and arch-only).
2. [Binary compatibility, PTX compatibility and JIT compilation](https://docs.nvidia.com/cuda/cuda-programming-guide/01-introduction/cuda-platform.html) (CUDA Toolkit and Architecture Tuning Guides) - Section 1.3.4, Cubins and Fatbins, with Binary Compatibility, PTX Compatibility and Just-in-Time Compilation (CUDA 13.4.2 documentation): what a fatbin carries, what compiles at load, and what fails on newer hardware.
3. [Dispatch and fallback contract](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/gpu-microbenchmark-kernel-suite.md) (GPU Microbenchmark and Kernel Suite - Final Evaluation) - Architecture constraints: dispatch never selects an unvalidated shape, dtype or device path, and every custom path has a correct fallback; Milestone F: defend the dispatch, fallback and maintenance choice for each kernel family.

**Focus**

- Query at runtime, branch on the answer, and test both sides. The check and the fallback are one unit; an untested fallback is a second implementation with zero evidence.
- Family targets run across the family; arch-only targets run on one architecture. Code built only for an arch-only target such as `sm_100a` loads on that architecture alone, and every other GPU fails at load with no kernel image unless the fatbin carries another target.
- PTX in the fatbin is the forward-compatibility path. A cubin runs on later minor versions of its major version; without PTX it fails on a newer major version instead of JIT-compiling at load.
- An unsupported path must error loudly at the owning API boundary with the capability and feature named, never silently run a wrong kernel.

**Reproduce:** From a blank file, write the capability query plus dispatch for a kernel with a newer-architecture-only path and a portable fallback: correct results on `sm_86` hardware, the fallback selected when the feature query is forced off, an explicit error when forced below the portable minimum, and tests covering all three branches.

**Traps**

- Compiling only with `-arch=sm_86` and calling it portable. That flag emits one `sm_86` cubin plus `compute_86` PTX: newer GPUs JIT-compile the PTX, older ones have nothing they can run, and native code on newer GPUs needs their own cubins.
- Checking the driver version instead of the device capability. The device answers through the attribute query; the driver version does not know the chip.
- Reading the marketing architecture name in code. Code branches on the numeric capability the query returns, not on Ampere or Hopper as strings.

**Practice**

- The section mini-project covers this: the Milestone F dispatch and fallback defense with every branch tested.

**Stop when:** Your dispatch matrix passes on your GPU, selects the fallback when the feature query is forced off, and errors loudly when forced below the minimum.

<details>
<summary>Self-test</summary>

1. What does `cudaDevAttrComputeCapabilityMajor` return on the RTX 3050 6 GB, and which call reads it?
   - 8, read with `cudaDeviceGetAttribute` for the device. The minor attribute returns 6; branch on the pair, not on the card name.
2. Your kernel needs thread-block clusters. Which table gives the minimum capability, and what must the fallback do?
   - The feature-support table in Section 5.1.3. The fallback runs a non-cluster path or returns an explicit unsupported error, selected by the runtime query, with both branches tested.
3. A fatbin holds only an `sm_90` cubin and no PTX. What happens on `sm_86` and on `sm_100` hardware?
   - Neither can use that cubin, and with no PTX there is nothing to JIT-compile at load. Ship per-architecture cubins plus PTX, or restrict the matrix honestly.
4. Why must the unsupported-path error name the capability and the feature?
   - So a report distinguishes a missing feature from a wrong dispatch, and the matrix gains a row without guessing which check failed.

</details>

#### U4. Benchmark scenarios, MLPerf boundaries and endpoint goodput

**About 4 h** · **Target:** Explain + Measure

Topics: Offline, server, single-stream and interactive scenario boundaries; MLPerf scenario, load-generation and result-boundary vocabulary; Endpoint goodput under latency and correctness constraints; Production-like arrival, length and burst distributions

A benchmark number without a scenario is noise. The scenario fixes the load, the metric and the boundary; goodput adds the latency SLO that makes throughput worth having.

**You can now**

- Distinguish offline, server, single-stream and interactive scenarios by load pattern and metric.
- State MLPerf load-generation and result-boundary rules: divisions, availability states and what each reported row certifies.
- Define endpoint goodput under TTFT and TPOT latency SLOs and explain why a mean-latency number cannot replace it.
- Describe the arrival, length and burst properties a workload must preserve to stay credible.

**Study**

1. [Endpoints benchmark: curve, points and dimensions](https://mlcommons.org/benchmarks/endpoints/) (MLPerf Endpoints) - The MLPerf LoadStairs Visual: the four dimensions concurrency, interactivity, System TPS and TTFT P90; Technical detail: 7 to 32 points, at least 600 seconds per point, same model, endpoint and software stack (page read 2026-10-13).
2. [Inference rules: scenarios, divisions and availability](https://github.com/mlcommons/inference_policies/blob/master/inference_rules.adoc) (MLPerf Endpoints) - Section 4 scenarios (Single-Stream, Multi-Stream, Server, Offline) with the required-scenario examples, and the Closed and Open divisions (commit d3eba2f); the Available, Preview and RDI categories are defined in the general submission rules, https://github.com/mlcommons/policies/blob/master/submission_rules.adoc (Preview Systems and Research, Development, or Internal Systems). Depth: Read the scenario definitions and reporting rules reached from the datacenter page. Do not quote latency numbers from the marketing page; they live in the rules.
3. [TTFT and TPOT pitfalls and the fluidity-index](https://arxiv.org/html/2407.07000v2) (Etalon - holistic evaluation for LLM inference) - Section 2.2, Performance Metrics for LLM Inference: TTFT and TPOT definitions and why each misleads alone; Section 4.1, fluidity-index: per-token deadlines with reset after a miss, and capacity reported subject to SLOs.
4. [Goodput: the request rate served within the SLO](https://arxiv.org/html/2401.09670v3#S1) (DistServe: Disaggregating Prefill and Decoding for Goodput-optimized LLM Serving) - Section 1 with Figure 1: per-GPU goodput is the highest request rate served while the TTFT and TPOT SLOs hold for a target share of requests (90% in the example).
5. [Serving benchmarks as a trace-property map](https://github.com/wafer-ai/gpu-perf-engineering-resources) (AI Performance Engineering - Hardware, Frontier and Source Policy) - Serving benchmarks subsection: Etalon, ServeGen, BurstGPT and MLPerf Endpoints entries; read it as a map to production-trace properties such as burstiness, then open the primary link for any property you borrow.

**Focus**

- Endpoints sweeps concurrency into a Pareto curve with concurrency fixed per point. One point at one load is not an Endpoints result.
- Closed division means the same model, apples to apples; Open allows different models or retraining. Availability states mark review status, not quality.
- TTFT measures arrival to first token and TPOT averages per output token, so neither sees jitter or stalls (the fluidity-index adds per-token deadlines). Goodput is the highest request rate at which a target share of requests (say 90%) meets both SLOs; a mean latency at one load cannot stand in for it, because the SLO is a percentile and fails first in the tail.
- A credible workload preserves arrival burst and length mix from production traces. Synthetic Poisson load is a starting assumption, not evidence.

**Reproduce:** Without notes, sketch the Endpoints curve axes, state the point-count and duration rules, define TTFT and TPOT, and write the fluidity deadline $`D_{i} = D_{p} + i \times D_{d}`$ with the reset rule.

**Traps**

- Comparing System TPS across different concurrency or SLO points. Throughput without its latency constraint is unbounded and meaningless.
- Treating a 600-second point as steady state without warmup separation. Cold start inflates the tail; the rules fix duration, not warmup.
- Calling a Poisson arrival trace production-like. BurstGPT exists because real traffic bursts; check burstiness before borrowing a number.

**Practice**

- The section mini-project covers this: the workload and result-boundary discipline (fixed stack, reported boundaries, workload frequency) in the full shape matrix.

**Stop when:** You can place any serving number into scenario, division, availability and SLO constraints, and say which constraint is missing when one is.

<details>
<summary>Self-test</summary>

1. What four numbers does one Endpoints curve point report, and what varies across points?
   - System TPS, interactivity, TTFT P90 and concurrency. Concurrency is fixed per point and swept across points, 7 to 32 points of at least 600 seconds each.
2. Closed versus Open division: what changes?
   - Closed requires the same model, so systems compare apples to apples. Open permits different models or retraining, so it compares approaches rather than systems.
3. Why can mean TPOT hide a bad experience that the fluidity-index catches?
   - TPOT averages over all output tokens, so one long stall disappears into the mean. Per-token deadlines with reset-on-miss count the stall as experienced without multiplying one stall into many misses.
4. A vendor reports Server-scenario throughput. Name two boundary facts you check before comparing it.
   - The division and availability state, which fix what the row certifies and its review status; and that model, endpoint and software stack match across compared rows.

</details>

#### U5. Auditing benchmarks: timing, baselines, parity and cherry-picking

**About 4 h** · **Target:** Measure

Topics: Timing, baseline, workload, correctness and cherry-picking audit; Baseline parity in precision, algorithm, compiler flags and allowed libraries

Most reported speedups measure the baseline handicap, not the kernel merit. Parity first; speedup second.

**You can now**

- Audit a GPU benchmark for timing, baseline, workload, correctness and cherry-picking flaws, and repair each with a named control.
- Establish baseline parity in precision, algorithm, compiler flags and allowed libraries before claiming any speedup.
- Apply the Appendix checklist as an audit list and record every deviation beside the number it affects.

**Study**

1. [The Appendix checklist as an audit list](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 2, 19 and 20 and the Appendix checklist) - Appendix, AI Systems Performance Checklist: Performance Tuning and Cost Optimization Mindset; Reproducibility and Documentation Best Practices; Performance Profiling, Debugging, and Monitoring.
2. [What an unaudited benchmark reports](https://arxiv.org/html/2607.16241v1) (KernelBench-Verified) - Section 1 flaws: the FP32 baseline without the TF32 Tensor-Core path and the uniform positive-only tests; Section 2.2 TF32 baseline configuration; Section 3 headline results with the best model at 0.88x pooled across levels against 1.43x naive.
3. [Milestone F audit and measurement requirements](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/gpu-microbenchmark-kernel-suite.md) (GPU Microbenchmark and Kernel Suite - Final Evaluation) - Milestone F: audit a deliberately misleading benchmark and correct every flaw; Measurement requirements: retain warmup and raw samples, report medians with variance, and explicitly label measured hardware.

**Focus**

- Parity means same precision, same algorithm, same flags, same libraries. At Level 2 of the Verified study, enabling TF32 in the baseline alone moved the best model from 1.67x to 0.88x, and the hidden suite took it to 0.85x.
- Uniform positive-only inputs hide sign, overflow and underflow paths. The audit adds negated, scaled-up and scaled-down distributions.
- Hidden distributions gate correctness only; speed is always timed on the original distribution. Mixing the two mixes coverage with performance.
- Keep the naive number beside the audited number. The gap between 1.43x and 0.88x is the finding, not an embarrassment.

**Reproduce:** Take any fast-kernel claim and write the five-line audit: timing boundary, baseline precision and flags, input distributions, held-out status, cherry-picking check. Apply it from memory to the 374x ReLU case.

**Traps**

- TF32 only changes precision, not rankings. It moved the headline from 1.43x to 0.88x with no model left above 1x.
- A passing test suite means correct. The old suite passed the ReLU identity shortcut at 374x; coverage across distributions decides, not trial count.
- Faster on the benchmark means faster in production. Shapes, values and hardware were fixed; held-out behavior is a separate claim with separate tests.

**Practice**

- The section mini-project covers this: the Milestone F audit of a deliberately misleading benchmark with every flaw corrected.

**Stop when:** You can run the five-line audit on an unfamiliar benchmark and name which parity fix moves its headline most.

<details>
<summary>Self-test</summary>

1. A custom kernel reports 1.4x over a PyTorch FP32 baseline on matmul-heavy tasks. Name the first parity check and the expected effect.
   - Enable the TF32 Tensor-Core path in the baseline with `torch.set_float32_matmul_precision('high')`. The Verified study found TF32 alone accelerates such baselines over 1.5x on about a quarter of problems, which can erase the claimed speedup.
2. Tests use only `torch.rand` inputs. Which three input variations does the hardened suite add, and what does each catch?
   - Scale by 3.0 to catch overflow, scale by 0.01 to catch underflow and near-zero paths, and negate to catch sign-dependent paths like the ReLU shortcut.
3. Why does the Verified protocol time only the original distribution?
   - Hidden distributions are a correctness gate. Timing on them would mix numerical-path coverage with speed; any kernel failing one distribution is excluded from the aggregates instead.
4. Aggregate Correct Speedup is a geometric mean over correct kernels. Why geometric, and where do failed kernels go?
   - Speedups are ratios, so the geometric mean keeps a 2x and a 0.5x symmetric where an arithmetic mean would not. Failed kernels leave the mean and count toward Correctness instead.

</details>

#### U6. KernelBench, hardened evaluators and reward hacking

**About 4 h** · **Target:** Explain + Measure

Topics: KernelBench task, correctness and speedup contract; Hardened correctness, baseline parity and evaluator coverage; AI-generated kernel reward hacking, undefined behavior and narrow tests

AI-generated kernels optimize the evaluator, not the hardware. The contract decides what counts; hardening decides what survives.

**You can now**

- State the KernelBench task contract: levels, correctness trials, timing trials and the `fast_p` metric.
- Explain the Verified hardening: TF32 baseline, four-distribution hidden suite, memory metric and degenerate exclusions.
- Classify reward hacks by mechanism and name the test that catches each.

**Study**

1. [Task contract, metrics and the ReLU shortcut](https://arxiv.org/html/2607.16241v1) (KernelBench-Verified) - Section 2.1 problem set and models (250 problems across Levels 1 to 3); Section 2.5 Metrics (Correctness, Correct Speedup, Fast@1, memory efficiency); Appendix H.1: the ReLU identity shortcut on Level 1 problem 19.
2. [Running one problem and reading `EVAL.md`](https://github.com/ScalingIntelligence/KernelBench) (KernelBench - benchmark toolkit and task suite) - README at commit 423217d: Task Description (Levels 1 to 4), Evaluation Methodology with `scripts/run_and_check.py` for one sample, Overall Benchmark Metric (`fast_p`); `EVAL.md` for benchmarking guidance.
3. [Hardening and residual hacks](https://arxiv.org/html/2607.16241v1) (KernelBench-Verified) - Sections 2.2 to 2.4: TF32 baseline, the four-distribution hidden suite and memory profiling; Section 3 with Figure 1 and Tables 1 to 2: none above 1x after hardening; Appendix L.3 case studies: wrong-broadcast-axis hinge loss and early-termination cumprod. Depth: Read the two case studies for mechanism. Skim the remaining appendices; do not chase the full leaderboard.

**Focus**

- Levels 1, 2 and 3 mean single ops, fused chains and full models. In the toolkit README, `fast_p` counts kernels both correct and faster than threshold $`p`$, and `fast_0` is correctness alone; the paper reports `Fast@1`.
- The ReLU shortcut passed because every test input was non-negative. The fix is negated inputs, not more trials of the same distribution.
- Wrong-axis and early-exit hacks survive value variation but break on distribution shift or sustained inputs. The judge audit flagged 6 of 453 survivors, with 4 genuine hacks.
- Degenerate constant-zero references were excluded, not fixed. Some problems cannot measure speedup, and the honest move is exclusion.

**Reproduce:** From memory, write the KernelBench contract (levels, trials, `fast_p`), the four hidden distributions with their scales, and the ReLU-hack mechanism plus its catching test.

**Traps**

- More random tests equal stronger evaluation. The old suite ran many trials of one distribution; strength comes from distinct distributions, not count.
- A kernel faster on every tested shape generalizes. Shapes were fixed and shape specialization is declared legitimate; values are the held-out axis.
- Memory efficiency follows speed. In the Verified study, 28% of the best model's correctly generated kernels raised peak memory; measure both or the tradeoff hides.

**Practice**

- [KernelBench Level 1: one problem with `run_and_check.py`](https://github.com/ScalingIntelligence/KernelBench) - `scripts/run_and_check.py` usage 2 (commit 423217d): `ref_origin=kernelbench level=1 problem_id=<id> kernel_src_path=<your kernel file> eval_mode=local` on one Level 1 problem, with `gpu_arch` set to `["Ampere"]`. The script takes an architecture family name (`Ampere` for compute capability 8.6), not `sm_86`. Start from the example kernels in `src/kernelbench/prompts`, run one problem only, then add one negated-input trial in the style of the hidden D4 distribution and report what changes. Do not chase the aggregate score.

**Stop when:** You can state the contract, the hardening and three hack mechanisms from memory, and your one-problem run reports correctness plus speedup with the extra negated trial.

<details>
<summary>Self-test</summary>

1. What does `fast_1` count, exactly?
   - The fraction of tasks whose kernel is both correct and faster than the PyTorch baseline, a speedup above 1. `fast_0` is correctness alone.
2. How did the ReLU identity shortcut reach 374x, and which distribution catches it?
   - Every test input came from `torch.rand`, uniform and non-negative, so returning the input unchanged passed; a shape guard limited the trick to the benchmark shape. Negated inputs fail it with maximum error 1.0.
3. Why did the hinge-loss wrong-axis kernel pass all four hidden distributions?
   - Over 32768 by 32768 independent inputs the mean error stays under tolerance by the law of large numbers despite the wrong axis. Only a judge checking the axis, or a non-identical layout, catches it.
4. A fused GroupNorm kernel is fast but numerically unstable. Which hardening catches it, and why did the original suite miss it?
   - The scaled distributions: times 3.0 stresses overflow and times 0.01 stresses underflow and near-zero paths. The original uniform small-positive inputs never touched those paths.

</details>

#### U7. Speed-of-light bounds and held-out evaluation

**About 3 h** · **Target:** Derive + Measure

Topics: Hardware speed-of-light bound and attainable efficiency; Held-out shapes, values, devices and compiler versions

A bound turns a timing into a verdict: near the ceiling means done, far means look again. Held-out tests stop the bound from describing one friendly shape.

**You can now**

- Derive a speed-of-light bound for a kernel from operation and byte counts over vendor peaks, with every assumption stated.
- Compute SOL-score style efficiency against baseline and bound, and explain what 0.5 and 1.0 mean.
- Design held-out shape, value, device and compiler-version tests that a speed claim must survive.

**Study**

1. [SOL-score and benchmark configuration](https://github.com/nvidia/sol-execbench) (SOL-ExecBench) - `README` at commit a9fa080: the SOL-score definition in `src/sol_execbench/sol_score.py` (0.5 at the optimized baseline, 1.0 at the SOLAR roofline); `bench_config.example.json` (10 warmup runs, 50 iterations); official evaluation on B200 with SM clocks locked at 1500 MHz and about 5 percent run variance.
2. [Workload tolerances and the RMSNorm example](https://github.com/nvidia/sol-execbench/blob/main/docs/workload.md) (SOL-ExecBench) - Per-workload tolerances with the bind-axes-to-shapes scheme; timing runs only after correctness passes; reference timing stays off by default.
3. [Regime prediction and hardware labeling](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/gpu-microbenchmark-kernel-suite.md) (GPU Microbenchmark and Kernel Suite - Final Evaluation) - Milestone E: predict compute, bandwidth, launch and resource regimes and compare variants with interleaved raw trials; Measurement requirements: explicitly label measured hardware.

**Focus**

- The SOL-score anchors 0.5 at the optimized baseline and 1.0 at the SOLAR roofline. A score of 0.5 is not half of peak; it means equal to the baseline.
- The bound needs operation count, byte count and peaks from the same GPU. A B200 SOLAR number bounds nothing on an RTX 3050; re-derive with your peaks.
- Reference timing is off by default because the reference can exceed an hour and dominate evaluation. Time the kernel only after it passes correctness.
- Held-out means new shapes, values, devices and compiler versions. The harness binds axes to many workloads but fixes device and stack; the rest is your test matrix.

**Reproduce:** Closed-book, derive the speed-of-light bound for RMSNorm at one workload shape (operations and bytes over peaks), compute its SOL-score from a measured time, and list the four held-out axes with what each would break.

**Traps**

- A tighter bound is always better. A bound with unstated assumptions (missing traffic, assumed clocks) misleads more than a loose honest one.
- One workload row proves the bound. Batch 1 and batch 14509 differ by four orders of magnitude; the bound must hold across rows.
- Beating the bound means a breakthrough. It means the bound missed traffic or the timer missed work; recheck both before celebrating.

**Practice**

- [SOL-ExecBench RMSNorm example: hand-derived bound](https://github.com/nvidia/sol-execbench/blob/main/examples/cuda_cpp/rmsnorm/definition.json) - `definition.json` with `workload.jsonl` and `reference.py`: hand-derive traffic and operations for one workload row and divide by your GPU peaks. Read-only on a non-B200 GPU: derive the bound by hand and state which SOLAR assumptions you cannot reproduce. Do not claim an official SOL-score.

**Stop when:** Your hand bound, your SOL-score computation and your held-out list agree with the docs, and you can state which assumption each number depends on.

<details>
<summary>Self-test</summary>

1. Write the SOL-score formula and evaluate it at the baseline time and at the bound.
   - With kernel time $`T_{k}`$, baseline time $`T_{b}`$ and bound $`T_{\text{SOL}}`$, $`S = 1/(1 + (T_{k} - T_{\text{SOL}})/(T_{b} - T_{\text{SOL}}))`$. At $`T_{k} = T_{b}`$, $`S = 0.5`$; at $`T_{k} = T_{\text{SOL}}`$, $`S = 1.0`$.
2. Your kernel takes twice the baseline time. Where does its SOL-score land, and what does that tell you?
   - Below 0.5: the gap ratio exceeds 1, so $`S = 1/(1 + r)`$ with $`r > 1`$. It is slower than the baseline regardless of its distance to the roofline.
3. Which four held-out axes must a speed claim survive, and which does the SOL harness fix?
   - Shapes, values, devices and compiler versions. The harness varies shapes and values across workloads but fixes the device and the software stack.
4. Why is reference timing disabled by default?
   - The reference can be dramatically slower, over an hour, and would dominate evaluation time. Enable `benchmark_reference` only when the speedup factor itself is needed.

</details>

#### U8. Reconstructing a real kernel path and making one bounded change

**About 5 h** · **Target:** Implement

Topics: Reconstruction of a real kernel, compiler or communication dispatch path; One bounded change with a predeclared mechanism hypothesis

Research starts where the library ends: one real path, fully traced, with one change whose effect was predicted before it was measured.

**You can now**

- Reconstruct a compiled operation from graph through IR, schedule and generated kernel to runtime dispatch and hardware profile.
- Make one bounded change with a predeclared mechanism hypothesis and full correctness coverage.
- State the architecture, shape and version limits of the change without universal speedup claims.

**Study**

1. [Kernel benchmarking appendix as the trace template](https://mlc.ai/modern-gpu-programming-for-mlsys/appendix/benchmarking_gpu_kernels.html) (Modern GPU Programming for MLSys) - Timing boundary, GPU-time versus end-to-end, benchmark-condition consistency, and the worked BF16 GEMM baseline with the Proton to Nsight Systems to Nsight Compute chain. Depth: On `sm_86` hardware, Hopper-and-later constructs (thread-block clusters, TMA) and Blackwell-only ones (`tcgen05`, TMEM) are reading: produce the static mechanism audit and leave performance claims open.
2. [Adaptive kernel selection as the claim source](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 2, 19 and 20 and the Appendix checklist) - Chapter 19: Kernel Autotuning for Transformer Self-Attention and MLP Paths; Dynamic Shared-Memory Allocation and Occupancy-Aware Kernel Selection; Runtime Kernel Performance Improvements and Hot-Swappable Implementations.
3. [Milestone C implementation contract](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/gpu-microbenchmark-kernel-suite.md) (GPU Microbenchmark and Kernel Suite - Final Evaluation) - Milestone C: complete the kernels or document a hardware or toolchain blocker while completing the real available path; Milestone E: report shapes where added resources or overhead regress performance.

**Focus**

- Trace first, change second: graph, IR, schedule, generated kernel, dispatch, profile. An untraced change is a guess with a diff attached.
- One change, one hypothesis, stated beforehand: tile size, pipeline depth or layout, with predicted bytes, launches and resources.
- Blackwell-only constructs do not run on `sm_86`. The audit names them and the fallback, and measures only what the hardware runs.
- Correctness coverage spans shapes, dtypes, boundaries and numerics before any timing. Timing an uncovered kernel measures a bug.

**Reproduce:** Draw the full graph-to-hardware path of your chosen kernel with bytes, launches and resources at each link, then write the one-change hypothesis with the profiler signal that would falsify it.

**Traps**

- Porting a Blackwell GEMM to Ampere by renaming intrinsics. Blackwell matrix and memory constructs have no `sm_86` equivalent; the path needs redesign, not renaming.
- Changing two things and crediting one. Tile and pipeline depth interact through shared memory; vary one and hold the other.
- Profiling the tuned shape only. Autotuned tiles overfit the tuning set; evaluation shapes must differ from tuning shapes.

**Practice**

- The section mini-project covers this: the Milestone C kernel with its traced path and one bounded, predeclared change.

**Stop when:** Your traced path predicts the profile within stated uncertainty, and your one change lands inside its predicted interval on unseen shapes.

<details>
<summary>Self-test</summary>

1. List the links of the reconstruction chain in order.
   - Graph, IR and schedule, generated kernel, runtime dispatch, hardware profile, plus the mechanism hypothesis linking predicted bytes, launches and resources to the profile.
2. Your change halves shared-memory use per block. Which two profiler signals confirm or falsify the predicted gain?
   - Active warps or occupancy rising where shared memory limited residency, and the timeline showing the predicted launch or byte change. If neither moves, the bottleneck was elsewhere.
3. Why must tuning and evaluation shapes differ?
   - Autotuning selects for the tuning set, so reporting on it measures selection rather than the kernel. Unseen shapes test whether the choice generalizes.
4. The appendix flushes a large buffer before each measured call. What breaks if you compare against a run that does not?
   - Cache state differs: warm-cache hits inflate the no-flush run. The policy must match across implementations or the comparison measures the cache, not the kernel.

</details>

#### U9. Protection, clean reproduction and claim-to-artifact links

**About 4 h** · **Target:** Implement

Topics: Correctness, performance, dispatch, fallback and rollback protection; Clean build, environment lock and independent reproduction; Claim-to-code, raw result, trace, counter and report links

A result without a reproduction package is a story. Clean build, locked environment and linked artifacts turn it into evidence someone else can check.

**You can now**

- Reproduce a result from a clean build with a locked environment and an independent rerun.
- Link every claim to code, raw results, traces and reports with no hand-copied numbers.
- Install correctness, performance, dispatch, fallback and rollback protection that each fails loudly.

**Study**

1. [Reproducibility practices from the checklist](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 2, 19 and 20 and the Appendix checklist) - Appendix: Reproducibility and Documentation Best Practices; Performance Profiling, Debugging, and Monitoring.
2. [Measurement discipline behind the links](https://mlc.ai/modern-gpu-programming-for-mlsys/appendix/benchmarking_gpu_kernels.html) (Modern GPU Programming for MLSys) - Separate Measurement from Diagnosis; Verify Correctness Before Timing; Define the Timing Boundary; Keep Benchmark Conditions Consistent; Convert Latency to Throughput.
3. [Clean-build regeneration and raw samples](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/gpu-microbenchmark-kernel-suite.md) (GPU Microbenchmark and Kernel Suite - Final Evaluation) - Milestone F: run the full shape matrix from clean build, regenerate tables, and explain model residuals; Measurement requirements: retain warmup and raw samples with medians and variance, and explicitly label measured hardware.

**Focus**

- Clean means rebuilding from versioned sources into an empty state. A rebuild that reuses the old build tree proves nothing about reproducibility.
- Every table cell links to raw samples plus environment: GPU, clocks, toolkit, driver and commit. Numbers in prose are quotes of linked artifacts, never copies.
- Protection is fivefold: correctness, performance, dispatch, fallback, rollback. Each has a test that fails loudly when its defect is injected.
- State the run variance you observed on your hardware and its cause. For scale, SOL-ExecBench expects about 5 percent on B200 evaluation workers with locked clocks, and up to 10 percent for submissions that launch many small kernels.

**Reproduce:** From memory, write the reproduction checklist (clean build, locked environment, full matrix, raw samples, claim links, five protections) and apply it to one of your kernels.

**Traps**

- Pinning versions in the report but not in the build. A documented toolkit beside a different actual binary invalidates the whole package.
- Keeping only means. Raw samples with medians show the variance a mean hides; the harness must retain them.
- Testing rollback by reading the code. Rollback is a run: trigger the fallback path and measure it, or it stays untested.

**Practice**

- The section mini-project covers this: the Milestone F clean-build regeneration with raw samples, claim links and all five protections.

**Stop when:** A clean directory regenerates your tables from your package, and every protection test fails when its defect is injected.

<details>
<summary>Self-test</summary>

1. What must a clean reproduction rebuild, and what must it refuse to reuse?
   - Everything from versioned sources (code, environment, data) into an empty state. No reused build trees, caches or warm artifacts.
2. A table reports 105.2 us for a GEMM-plus-ReLU baseline. What must back that cell?
   - Raw samples with median, min and max, the timing boundary, GPU, clock, toolkit, driver and commit identity, plus warmup and cache policy and the trace. The appendix worked example shows the form.
3. Your optimization regresses one shape. Which protection catches it, and what happens next?
   - The performance-regression gate over the full shape matrix fails loudly, and dispatch falls back or rolls back to the validated path for that shape.
4. Your kernel launches hundreds of tiny grids and its run-to-run variance is twice your other kernels. What do you report?
   - The observed variance with its cause named: CPU launch and scheduling overhead, which SOL-ExecBench also singles out for many-small-kernel submissions (up to 10 percent there). Report the spread from raw samples, not a hoped-for figure.

</details>

#### U10. Workload-weighted impact, negative results and the design defense

**About 4 h** · **Target:** Measure + Explain

Topics: Workload-weighted endpoint or training-step impact; Negative result, losing regime and portability limit; Defense against stronger baselines, alternate explanations and maintenance cost

A kernel speedup is not a result until the workload feels it. Impact, losses and the defense decide whether the change ships.

**You can now**

- Compute workload-weighted end-to-end impact from kernel share and speedup, with the attainable bound stated first.
- Report negative results and losing regimes with the same rigor as wins, and keep them in the tables.
- Defend the design against stronger baselines, alternate explanations and maintenance cost.

**Study**

1. [Workload-weighted report and design defense](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/gpu-microbenchmark-kernel-suite.md) (GPU Microbenchmark and Kernel Suite - Final Evaluation) - Deliverables: workload-weighted comparison report including negative results; Design-defense questions: why the custom kernel loses on some shapes, and when a library or compiler path is preferred.
2. [What honest aggregates look like](https://arxiv.org/html/2607.16241v1) (KernelBench-Verified) - Section 3 with Figure 1 and Tables 1 to 2: 0.88x pooled against 1.43x naive with none above 1x, and the memory-speedup tradeoff (28% of the best model's correct kernels raise peak memory); Appendix F, BF16 Evaluation, with Table 5 and Figure 4: the BF16 control reversing the Level 2 verdict.
3. [Pass condition for the final defense](https://github.com/saisandeshk/Roadmap-Final/blob/main/checkpoints/performance-gpu-programming.md) (Performance Engineering and GPU Programming Checkpoint) - Pass condition: the end-to-end result and negative regimes explained quantitatively, surviving strong library and compiler baselines.

**Focus**

- Weight by workload frequency before celebrating. A 3x win on 10 percent of runtime is about 7 percent end to end; the bound comes first and the integration must match it.
- Publish losing rows with the same precision as wins. A table without losses is a selection, and it cannot define the dispatch boundary.
- Strong baselines include precision-enabled libraries and compiler paths. The BF16 control turned 0.85x into 1.63x, which reframes every FP32-only claim.
- Maintenance cost belongs in the defense. A small win that only its author can debug loses to the library path.

**Reproduce:** Closed-book, compute the end-to-end bound for two share and speedup pairs, sketch the workload-weighted table with one losing row kept, and write the three-question defense (stronger baseline, alternate explanation, maintenance cost).

**Traps**

- Fastest-on-one-shape as the headline. The shape matrix is the result; the best cell is a footnote.
- Counting a precision reduction as kernel speedup. A TF32, BF16 or FP8 change is a precision choice; report it separately with quality evidence.
- Hiding memory cost. Speed with more memory is a tradeoff, not a win; report both, as the memory-speedup scatter does.

**Practice**

- The section mini-project covers this: the Milestone E and F workload-weighted report with negative results and the design defense.

**Stop when:** Your report headline is workload-weighted, its tables keep losses, and it survives the three skeptical questions against the strongest baseline you could configure.

<details>
<summary>Self-test</summary>

1. Your kernel is 3x faster on a path that takes 10 percent of runtime. What is the end-to-end gain?
   - $`1/(0.9 + 0.1/3) \approx 1.07`$: about 7 percent. State the bound first; the measured integration must then match it within uncertainty.
2. Why keep a shape where the library wins?
   - It defines the dispatch boundary and the fallback. Without it the report cannot say when to use the custom path, and the defense cannot answer when the library is preferred.
3. The BF16 control reverses an FP32 conclusion. What does that teach about baseline choice?
   - Match the precision the production stack actually runs. An FP32-only comparison handicaps the baseline when deployment uses Tensor-Core paths.
4. Name the three skeptical questions your defense must answer.
   - Is there a stronger baseline (precision-enabled library or compiler path)? Is there an alternate explanation (shapes, cache, clocks, cherry-picking)? What do maintenance and portability cost?

</details>

### Mini-project: Portability audit with a clean reproduction and a losing regime

**About 10 to 14 hours.** Close kernellab as defensible engineering on the RTX 3050: a per-kernel peak table with named clocks, an AMD dispatch defense, a three-branch fallback gate, scenario discipline, a repaired misleading benchmark, a read-only KernelBench and SOL check, one reconstructed production path with a bounded change, a clean rebuild and a workload-weighted report that keeps a loss.

1. Build a per-kernel peak-bound table that names its clock: fp32 $`18 \times 128 \times 2 \times f`$ gives $`6.8 \times 10^{12}`$ at the 1470 MHz reference boost and $`9.7 \times 10^{12}`$ at the 2100 MHz maximum reported by `nvidia-smi -q -d CLOCK` on the RTX 3050 6 GB, with 168 GB/s from $`12 \times 14 \times 10^9`$ on the 96-bit bus for ridge points near 40 and 58 FLOP/byte. Place each kernel behind its Milestone E regime prediction with the falsifier that would reject it.
2. Write the dispatch and fallback defense so each dispatched path names its AMD CDNA and HIP counterpart with one-line roles, then implement the capability query plus dispatch with three tested branches on `sm_86`: native path when the feature query passes, portable fallback when forced off with correct results, and an explicit error when forced below the portable minimum.
3. Fix the stack for the full shape matrix, report timing boundaries, baseline precision and flags, input distributions, held-out status and workload frequency per shape. Audit a deliberately misleading benchmark with the five-line check (timing boundary, baseline parity, distributions, held-out status, cherry-picking) and correct every flaw, including TF32 parity: the audit must show matched precision before any speedup is kept. Sketch the Endpoints curve axes with point-count and duration rules and the fluidity deadline $`D_{i} = D_{p} + i \times D_{d}`$ with its reset rule.
4. Run one KernelBench Level 1 problem with `scripts/run_and_check.py` usage 2 at commit 423217d with `gpu_arch` set to `Ampere` for capability 8.6, starting from the example kernels in `src/kernelbench/prompts`, then add one negated test that a reward-hacked kernel fails. Write the KernelBench contract from memory (levels, trials, `fast_p`, the four hidden distributions with scales, the ReLU-hack mechanism with its catching test). Derive the SOL-ExecBench RMSNorm speed-of-light bound by hand for one workload row with operations and bytes over peaks, compute its SOL-score from a measured time, list the four held-out axes with what each would break, and state which SOLAR assumptions cannot be reproduced without a B200 as read-only.
5. Trace one Milestone C kernel through graph, IR, kernel, dispatch and profile with bytes, launches and resources at each link. Write one bounded change with a predeclared mechanism hypothesis and the profiler signal that would falsify it, then test it on unseen shapes with correctness gates held.
6. Regenerate the full shape matrix from a clean checkout with a locked environment, raw samples and claim-to-artifact links for every table entry. Exercise all five protections, each with an injected-defect test that the protection catches (for example an unsupported dtype reaching the fast path, a tuned shape leaking into the held-out set, or a changed register allocation slipping past the version pin).
7. Compute the end-to-end bound for two share and speedup pairs, build the workload-weighted table with one losing row kept, and write the three-question defense: a stronger baseline that could overturn the claim, an alternate explanation for the gain, and the maintenance cost of keeping the path. State the dispatch and fallback choice per kernel family from the clean reproduction.

**Deliverables**

- The peak-bound table with named clocks and ridge points beside Milestone E predictions, and the AMD dispatch defense with the three-branch fallback tests.
- The scenario-fixed shape matrix with boundaries and frequency, the five-line audit with the repaired misleading benchmark, and the KernelBench plus SOL hand-bound notes.
- The reconstructed production path with its bounded change, the clean-build regeneration with claim links and five protection tests, and the workload-weighted report with a losing row and the three-question defense.

**Checks**

- rubric: Self-grade with the rubric below.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Bounds and fallback | Peaks name clocks with the ridge derived, each dispatched path names its AMD counterpart, and all three fallback branches are tested with correct results or the explicit error. | The table states which Hopper and Blackwell features remain static audit. |
| Audit honesty | The shape matrix fixes the stack with boundaries and frequency stated, the misleading benchmark is repaired on all five lines with TF32 parity shown, and KernelBench and SOL limits are stated as read-only where hardware blocks execution. | Held-out shapes and values are named with what each would break. |
| Reproduction and judgment | The clean checkout regenerates tables with raw samples and claim links, each protection has an injected-defect test, and the weighted report keeps a losing row with the three-question defense. | The per-family dispatch choice names its maintenance cost. |

Feeds into: Capstone defense: the peak table, audit, reconstruction, clean reproduction and weighted report with the losing regime are the final evidence package.

### Resource route

- **Primary - Book:** [AI Systems Performance Engineering - Chapters 2, 19 and 20 and the Appendix checklist](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) - Read Chapter 2 for hardware generations, Chapters 19 and 20 on adaptive engine optimization and AI-assisted optimization, and use the Appendix checklist as an audit list for the final project. Treat every performance number as a hypothesis requiring your own evidence.
- **Reference - Reference:** [AI Performance Engineering - Hardware, Frontier and Source Policy](https://github.com/wafer-ai/gpu-perf-engineering-resources) - A dated map of current hardware and frontier work. Apply its Source Policy to every final claim, and use the hardware and frontier sections only to find primary documentation.
- **Required - Project:** [GPU Microbenchmark and Kernel Suite - Final Evaluation](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/gpu-microbenchmark-kernel-suite.md) - Complete Milestones C through F: CUDA and Triton kernel suite, failure injection, model-versus-profile reconciliation, strong baselines, real integration, full shape matrix, dispatch and fallback defense, clean reproduction and negative results.
- **Support - Assessment:** [Performance Engineering and GPU Programming Checkpoint](https://github.com/saisandeshk/Roadmap-Final/blob/main/checkpoints/performance-gpu-programming.md) - Use the checkpoint as the final adversarial assessment after the source-derived route. Pass the real kernel, compiler or communication modification and end-to-end evidence clauses; ignore its ordering where it conflicts with this track.
- **Required - Benchmark:** [KernelBench-Verified](https://arxiv.org/html/2607.16241) - Study the evaluator hardening and baseline-parity failures found in the original benchmark. Run a very small task slice or port its adversarial testing ideas into the project evaluator; do not optimize for aggregate benchmark score.
- **Support - Benchmark:** [SOL-ExecBench](https://github.com/nvidia/sol-execbench) - Inspect how correctness and performance are compared with a hardware speed-of-light model. Apply one attainable-efficiency analysis to a project kernel and explain missing hardware or model assumptions.
- **Support - Benchmark:** [MLPerf Endpoints](https://mlcommons.org/benchmarks/endpoints/) - Read the endpoint-level scenario and load-generation rules. Borrow the workload and result-boundary discipline for the integrated benchmark without claiming an official MLPerf result.
- **Reference - Documentation:** [CUDA Toolkit and Architecture Tuning Guides](https://docs.nvidia.com/cuda/) - Use the current toolkit root, release notes and the tuning guide matching the measured GPU. Pin the document and toolkit versions, verify capability checks and rerun any claim affected by compiler or architecture change.
- **Support - Course:** [MIT 6.S894 Accelerated Computing (Fall 2025) - Lecture 10](https://accelerated-computing.academy/fall25/lectures) - Use Lecture 10 (Accelerated Computing Beyond NVIDIA and CUDA) for AMD GPUs, TPUs, NPUs and higher-level kernel languages as portability vocabulary.
- **Depth - Book:** [Modern GPU Programming for MLSys](https://mlc.ai/modern-gpu-programming-for-mlsys/) - Use the Blackwell GEMM and Flash Attention path as a real architecture-specific reconstruction target if compatible hardware is available. Otherwise produce a static mechanism audit and leave all performance claims open.
- **Support - Benchmark:** [KernelBench - benchmark toolkit and task suite](https://github.com/ScalingIntelligence/KernelBench) - Clone the repository and check one Level 1 problem with `scripts/run_and_check.py` in local mode; read `EVAL.md` for the correctness and timing guidance. Do not chase the aggregate score.
- **Support - Reference:** [Etalon - holistic evaluation for LLM inference](https://arxiv.org/html/2407.07000v2) - Read Section 2.2 for TTFT and TPOT pitfalls, then the fluidity-index design (Section 4.1) for deadline-based, SLO-qualified capacity.
- **Support - Reference:** [ROCm Composable Kernel](https://github.com/ROCm/composable_kernel) - Read the repository `README` for the tile-based programming model, Tensor Coordinate Transformation and the four CK layers; open one tiled operator and map each CUDA term to its CK counterpart.
- **Support - Paper:** [DistServe: Disaggregating Prefill and Decoding for Goodput-optimized LLM Serving](https://arxiv.org/html/2401.09670v3) - Read Section 1 with Figure 1 for per-GPU goodput: the highest request rate served while a target share of requests meets the TTFT and TPOT SLOs.

### Exit checkpoint

Reconstruct and modify one real kernel, compiler or communication path, pass hardened correctness and held-out workload tests, validate a performance model, show workload-weighted end-to-end impact, and defend negative regimes, fallback and portability limits from a clean reproduction.

<details>
<summary>Deliberately left for later</summary>

- Unshipped hardware, vendor roadmap claims and unreproduced AI-kernel leaderboards
- A universal compiler, kernel library or cross-vendor backend
- Production rollout beyond the available hardware and independently reproduced evidence

</details>

## Track milestone

### Kernel-to-System Performance Laboratory

Carry one transformer operation and one realistic inference workload through a single evidence repository, from arithmetic and benchmark design through CUDA and Triton kernels, compiler and engine integration, communication analysis and a final architecture-aware extension.

- A correctness-first performance laboratory with hardware and software manifests, independent framework or CPU references, synchronized cold and warm benchmarks, raw interleaved trials, operation and byte models, roofline analysis, Nsight timelines and counters, sanitizer regressions and a repaired misleading benchmark.
- A CUDA and Triton kernel suite containing data movement, reduction or scan, stable softmax, tiled GEMM and one attention or fused transformer path; LeetGPU challenge evidence; adversarial shape, stride, dtype, mask, numerical and asynchronous tests; strong library and compiler baselines; autotuning, dispatch and correct fallback; and retained losing regimes.
- A real kernel-to-inference or communication integration with TTFT, TPOT, memory, goodput and quality evidence; one reconstructed and modified production kernel, compiler or collective path; held-out and portability tests; a clean reproduction package; claim-to-artifact links; a workload-weighted gain; and an honest negative result.

**Capstone rubric** (about 14 to 20 hours)

| Criterion | Pass | Strong |
| --- | --- | --- |
| Correctness-first laboratory | The harness carries hardware and software manifests, independent framework or CPU references, synchronized cold and warm benchmarks, raw interleaved trials, operation and byte models, roofline analysis, Nsight timelines and counters, sanitizer regressions and one repaired misleading benchmark, with one command rebuilding the evidence from a clean checkout. | Each claim links to raw samples and states clocks, boundaries and what was left untested. |
| CUDA and Triton kernel suite | Data movement, reduction or scan, stable softmax, tiled GEMM and one attention or fused transformer path run in CUDA and Triton with LeetGPU evidence, adversarial shape, stride, dtype, mask, numerical and async tests, strong library and compiler baselines, autotuning with correctness gates, dispatch with correct fallback and retained losing regimes. | Every custom path has a tested fallback and a version-pinned regression. |
| Kernel-to-system integration | One reconstructed and modified production kernel, compiler or collective path carries TTFT, TPOT, memory, goodput and quality evidence with workload-weighted gain, held-out and portability tests and an honest negative result with its regime explained quantitatively. | The report defends dispatch and maintenance choice per family against a stronger baseline. |
| Reproducibility and judgment | A clean checkout regenerates every table from locked code with raw samples and claim-to-artifact links, every protection has an injected-defect test, and multi-GPU numbers carry topology dumps with the NCCL version. | The workload-weighted report keeps losing rows and states which Hopper and Blackwell paths remain static audit. |

