<!-- Generated from content/curriculum.json. Edit the JSON and run npm run content:generate. -->

# 05. LLM Inference & Serving

**Level:** Advanced specialization  
**Scope:** 9 track stages · 251 required topics · 45 optional, depth, or later topics

Build LLM serving systems from request arithmetic and phase measurement through KV memory, scheduling, kernels, compression, distributed serving and production operation. Every optimization is bounded by a fixed workload, correctness and quality contract, and the final gate requires a tested real-engine contribution with an honest negative result.

## Order

INF-1. Model, Workload and Request Arithmetic
INF-2. Prefill, Decode and Baseline Measurement
INF-3. KV Memory and Prefix Reuse
INF-4. Batching, Scheduling and Admission
INF-5. Inference Kernels and Graph Execution
INF-6. Quantization and Speculative Decoding
INF-7. Distributed and Disaggregated Inference
INF-8. Production Serving and Reliability
INF-9. Capacity, Economics and Engine Extension

## INF-1. Model, Workload and Request Arithmetic

**Why:** Serving decisions start with the model, request distribution and user contract. Exact units and request-state ownership prevent attractive optimizations from solving the wrong bottleneck.

### Learn this much

- [ ] Model, tokenizer, chat template and revision identity _(Required)_
- [ ] Dense, MoE and attention architecture fields that affect serving _(Required)_
- [ ] Parameter count and weight memory by dtype _(Required)_
- [ ] Runtime, workspace, graph and allocator memory categories _(Required)_
- [ ] MHA, GQA, MQA and MLA KV bytes per token _(Required)_
- [ ] Logical versus allocated KV capacity _(Required)_
- [ ] Approximate transformer prefill operations _(Required)_
- [ ] Approximate autoregressive decode operations per token _(Required)_
- [ ] Input and output length distributions _(Required)_
- [ ] Prompt reuse and cache-locality distributions _(Required)_
- [ ] Arrival rate, concurrency and burst shape _(Required)_
- [ ] Open-loop versus closed-loop load _(Required)_
- [ ] Streaming, sampling, stop and timeout contracts _(Required)_
- [ ] TTFT, TPOT, inter-token latency and end-to-end latency _(Required)_
- [ ] Throughput, goodput, rejection and quality acceptance _(Required)_
- [ ] p50, p95 and p99 latency interpretation _(Required)_
- [ ] API, tokenizer, queue, admission and scheduler lifecycle _(Required)_
- [ ] Block manager, model runner, sampler and detokenizer lifecycle _(Required)_
- [ ] Streaming, cancellation, failure and cleanup states _(Required)_
- [ ] Request and resource ownership invariants _(Required)_
- [ ] Offered token rate and completed token rate _(Required)_
- [ ] First-order concurrency, service-time and capacity estimates _(Required)_
- [ ] Immutable workload and environment manifest _(Required)_
- [ ] Deterministic request corpus and replay _(Required)_
- [ ] Validated open-loop and closed-loop load generator _(Required)_
- [ ] Per-request raw event and output retention _(Required)_
- [ ] Multimodal encoder and media-token budgeting _(Optional)_
- [ ] Hybrid attention and state-space cache vocabulary _(Optional)_
- [ ] Energy per accepted token as an additional outcome _(Optional)_
- [ ] Inference-time compute and multi-sample request budgeting _(Depth)_
- [ ] Provider-wide demand forecasting and procurement _(Later)_

### Study units

#### U1. Model identity and the architecture fields that set serving cost

**About 4 h** · **Target:** Explain + Derive

Topics: Model, tokenizer, chat template and revision identity; Dense, MoE and attention architecture fields that affect serving; Hybrid attention and state-space cache vocabulary

Serving numbers mean nothing without the exact model they describe. A changed revision, template or head count moves every later estimate.

**You can now**

- Record the model, tokenizer, chat template and revision that define a serving run, and reject a run whose identity differs.
- Derive parameter count and KV width from architecture fields for dense and MoE models, including query and KV head counts.
- Explain how hybrid attention and state-space layers change what the cache stores.

**Study**

1. [Qwen2.5-0.5B architecture and config](https://www.oreilly.com/library/view/hands-on-llm-serving/9798341621480/) (Hands-On LLM Serving and Optimization - Chapters 2 and 5) - Chapter 2, Decoder-Only Transformer Architecture with the Qwen2.5-0.5B config dump (pp 37-42): hidden 896, layers 24, heads 14, intermediate 4864, vocab 151936, total 494,032,768 params.
2. [LLaMA shapes and MoE parameter walks](https://jax-ml.github.io/scaling-book/inference/) (How to Scale Your Model - Inference) - What about memory? with the LLaMA 2-13B parameter table, and Worked Problems Questions 1 and 5 (invented 64-layer model at 18.4e9 params; MoE total versus activated).
3. [GQA, MLA, CLA, hybrid and state-space vocabulary](https://www.youtube.com/watch?v=fcgPYo3OtV0) (Stanford CS336 - Inference Lecture) - 37:48-43:35 GQA, 43:47-45:47 MLA, 46:01-47:36 CLA, 47:50-50:26 local and hybrid attention, 52:47-1:01:10 SSMs with Mamba and AI21's 52B Mamba-transformer hybrid at 56:43 (named Jamba at 1:03:03). Depth: Watch for vocabulary only. Skip 1:17:37-1:21:22 continuous batching and PagedAttention here; those return in later sections.
4. [Configuration attributes and revision](https://huggingface.co/docs/transformers/main_classes/configuration) (Hugging Face Transformers - model configuration and revision) - `PreTrainedConfig` common attributes `vocab_size`, `hidden_size`, `num_attention_heads`, `num_hidden_layers`; `from_pretrained` `revision` as branch, tag or commit id with default `main`.
5. [Chat templates and generation prompt](https://huggingface.co/docs/transformers/chat_templating) (Hugging Face Transformers - chat templates) - `apply_chat_template` with role and content dicts, Mistral versus Zephyr control-token examples, `add_generation_prompt` for starting an assistant reply.

**Focus**

- Identity is model id plus `revision` plus tokenizer plus chat template plus precision. The saved `config.json` fields set shapes; `revision` pins weights.
- Dense cost follows total params; MoE per-token cost follows activated params. Attention KV width follows KV heads and head dim, not query heads.
- Hybrid layers mix full and local attention; state-space layers keep constant state. Neither takes the full KV formula.
- Template control tokens count as input tokens. The wrong template shifts token IDs, lengths and stop behavior.

**Reproduce:** Closed-book, write the identity card for Qwen2.5-0.5B (hidden 896, layers 24, heads 14, intermediate 4864, vocab 151936, 494,032,768 params) and derive the invented 64-layer model count $`64 \times 4096 \times (3 \times 16384 + 2 \times 256 \times 40) + 4096 \times 32128 = 18{,}385{,}207{,}296`$, about $`18.4 \times 10^9`$.

**Traps**

- Treating the model name as identity. The same name at another `revision`, tokenizer or template gives different token IDs and lengths.
- Reading MoE total params as per-token cost. Only activated experts plus attention run per token; total params set weight bytes.
- Applying the MHA cache formula to GQA, MLA or state-space layers. Use KV heads, latent width or constant state as the layer defines.

**Practice**

- [100 Days of LLM Inference Day 02a: Verify parameter count](https://github.com/elizabetht/100-days-of-inference) - `day02/02-a-whats-inside-a-model.ipynb`, Verify: Reconstruct Parameter Count from SafeTensors shapes (expect 124,439,808 for GPT-2). Sum `wte`, `wpe`, attention, MLP and norm shapes by hand, then compare with the saved header before trusting any config dump.

**Stop when:** Your identity card lists repo, `revision`, tokenizer, template and precision, and your hand-derived 18.4e9 count matches the book answer.

<details>
<summary>Self-test</summary>

1. Two runs use the same model name but different `revision` values. Can their token IDs be compared?
   - No. Weights, tokenizer or template may differ. Record repo id, `revision`, tokenizer and template before comparing any count.
2. A MoE model reports 212e9 total params and 31.2e9 activated. Which sets per-token dense work?
   - Activated params. Total params set weight bytes; per-token dense work follows the activated path plus attention.
3. A layer uses 8 KV heads with head dim 128 in bf16. What is its per-token KV width factor?
   - The width uses KV heads: $`2 \times 8 \times 128`$ values per layer before layer count and bytes. Query head count does not enter.
4. Why does the wrong chat template change serving cost even when the user text is fixed?
   - Control tokens become input tokens. They add prefill tokens, change IDs and can change where generation stops.

</details>

#### U2. Weight memory by dtype and the runtime memory categories

**About 4 h** · **Target:** Derive + Measure

Topics: Parameter count and weight memory by dtype; Runtime, workspace, graph and allocator memory categories

Memory sets the maximum batch before timing starts. A fit that forgets precision, file overhead or allocator reserve fails at load time.

**You can now**

- Derive weight bytes from parameter count and stored bytes per value, keeping stored and execution precision apart.
- Write a runtime budget with weights, KV, activations, workspace, graphs and allocator reserve, and fit a batch under capacity.
- Measure resident weights and reserve on your GPU and name what the estimate omitted.

**Study**

1. [Estimating model size and batch reserve](https://www.oreilly.com/library/view/hands-on-llm-serving/9798341621480/) (Hands-On LLM Serving and Optimization - Chapters 2 and 5) - Chapter 5, Estimating Model Size (pp 172-177): 7B times 2 bytes is 14 GB, `config.json` `torch_dtype`, Table 5-6 precision bytes; Estimating KV Cache Size with Table 5-7 (A10 10 GB left gives 5 theory but 4 served; L40S 34 GB left gives 17 theory but 16 served) and the 2x model-size reserve rule.
2. [LLaMA-2-13B bytes and batch tables](https://jax-ml.github.io/scaling-book/inference/) (How to Scale Your Model - Inference) - What about memory? (bf16 26 GB weights, 80 MB activations versus 6.7 GB cache at 8192 context) and Modeling throughput and latency for LLaMA 2-13B with both batch tables. Depth: The tables label memory GiB but divide decimal gigabytes by bytes per second. Recompute in bytes and keep GB apart from GiB.
3. [Weight bytes and model loading](https://github.com/stas00/ml-engineering/tree/master/inference) (Machine Learning Engineering Open Book - Inference) - Anatomy of Model's Memory Usage, Model Weights: `bytes = bytes_per_param * num_params` with fp32 4 down to 1-bit 0.125 and MXFP8 1.03125, Llama-3.1-8B bf16 16 GB; Speeding up model loading time with pre-sharded weights and prebuilt engines.
4. [Serving arguments that set runtime memory](https://www.oreilly.com/library/view/hands-on-llm-serving/9798341621480/) (Hands-On LLM Serving and Optimization - Chapters 2 and 5) - Chapter 2, Serve the LLM (Qwen) with vLLM (pp 57-59): `LLM` with `swap_space`, `max_model_len`, `block_size`, `max_num_seqs` and `enable_prefix_caching` beside `SamplingParams` (the book also prints `enable_cuda_graph=True` and `max_num_sequences`, which are not vLLM 0.31.0 arguments; use `enforce_eager` and `max_num_seqs`). Depth: Read the argument list as the runtime lines to budget. Tuning them belongs to later sections.

**Focus**

- Weight bytes are count times stored bytes per value. Execution precision can differ, as int8 weights with bf16 compute, and changes intensity later, not this line.
- The file holds more than learned params. GPT-2 holds 137,022,720 values (522.7 MiB in fp32) against 124,439,808 learned params; its 12,582,912 causal-mask values explain the gap.
- Budget weights first, then KV, then activations, workspace, graphs and allocator. The book reserves about twice model size and still serves one less than theory in Table 5-7.
- Activations are megabytes beside gigabytes of cache at long context, but they set the workspace line that stops a theoretical fit from loading.

**Reproduce:** Closed-book, derive 7B fp16 as $`7 \times 10^9 \times 2 = 14 \times 10^9`$ bytes, 8B bf16 as $`16 \times 10^9`$ bytes, 13B bf16 as $`26 \times 10^9`$ bytes, and GPT-2 learned versus file as $`124{,}439{,}808 \times 4 = 497{,}759{,}232`$ bytes against $`137{,}022{,}720 \times 4 = 548{,}090{,}880`$ bytes (522.7 MiB).

**Traps**

- Reading the name as the count. Llama-2-7b is about 7e9 params, and its bin reads about 13 GB against the 14 GB product; publish the exact count.
- Counting tied embeddings twice. Shared input and output matrices contribute once to weight bytes.
- Treating the Table 5-7 quotient as servable. Reserve, workspace, graphs and fragmentation take the last slot; state the overhead line.

**Practice**

- [Hands-On LLM Serving companion: inside the transformer](https://github.com/orca3/llm-model-inference) - ch02/ch2_Inside_the_Mind_of_a_Transformer.ipynb: run `print_module_structure` on Qwen2.5-0.5B and reconcile the summed params with 494,032,768. Sum by matrix before trusting the config total, and record stored versus execution `dtype` for the later intensity unit.

**Stop when:** Your weight lines match 14, 16 and 26 GB plus the GPT-2 file split, and your budget names the reserve that explains the Table 5-7 gap.

<details>
<summary>Self-test</summary>

1. Qwen2.5-0.5B holds 494,032,768 params. What are its bf16 weight bytes?
   - $`494{,}032{,}768 \times 2 = 988{,}065{,}536`$ bytes, about 0.99 GB. Count tied embeddings once.
2. Why does the 7B bin read about 13 GB when the product says 14 GB?
   - The name is rounded and the exact count is smaller. The product with the exact count plus header explains the bin; the name alone does not.
3. A10 holds 24 GB with 14 GB weights and 4096 context at 0.5 MB per token. Why does it serve 4, not 5?
   - $`10 \times 1024 / (0.5 \times 4096) = 5`$ in theory, but activations, workspace and allocator take the last slot. The book serves 4 and keeps the reserve explicit.
4. When do activations stop being negligible?
   - At short context with large batch, where cache per request is small and workspace plus graphs set the limit. At 8192 context they are 80 MB against 6.7 GB cache.

</details>

#### U3. KV bytes per token across MHA, GQA, MQA and MLA, and allocated capacity

**About 4 h** · **Target:** Derive

Topics: MHA, GQA, MQA and MLA KV bytes per token; Logical versus allocated KV capacity

KV decides batch before compute matters. Head grouping moves bytes by 4x to 32x, and allocation waste decides what fits.

**You can now**

- Derive KV bytes per token for MHA, GQA, MQA and MLA from layers, KV heads, head dim and bytes.
- Distinguish logical cache bytes from allocated bytes with pages, waste and reserve, and fit allocated capacity.
- Check the fit against your own worksheet for the same configuration.

**Study**

1. [KV bytes and attention variants](https://github.com/stas00/ml-engineering/tree/master/inference) (Machine Learning Engineering Open Book - Inference) - Anatomy of Model's Memory Usage, KV Caching: bytes per token as dtype times 2 times layers times hidden times KV heads over attention heads; Llama-3.1-8B bf16 GQA at 0.131 MB per token with bs1x1024 at 134 MB and bs128x1024 at 17.2 GB; MHA 4x, MQA 8x less, MLA via DeepSeek-v3.
2. [Cache tables, GQA cuts and paging](https://jax-ml.github.io/scaling-book/inference/) (How to Scale Your Model - Inference) - What about memory? with 13B bf16 6.7 GB at 8192 context; Modeling throughput and latency for LLaMA 2-13B with both batch tables; Tricks for Improving Generation Throughput and Latency for GQA ratio cuts, quant and PagedAttention; Worked Problems Questions 1 and 2. Depth: The batch tables label GiB but divide decimal gigabytes. Recompute in bytes. In Question 2, dropping to one KV head raises the batch from 7 to about 56.
3. [GQA multiplier, fragmentation and two-regime budget](https://inference.tusharamrit.in/modules/kv-cache.html) (LLM Inference: From scratch, one token at a time - Modules 01, 02 and 04) - What is stored with `kv_bytes = 2*n_layers*n_kv_heads*head_dim*seq_len*batch*dtype_bytes`; The GQA multiplier with the 70B MHA versus GQA-8 versus MQA table; Fragmentation with 97.6% waste and 20.4-38.2% useful; The two-regime memory budget with crossover at `batch*seq_len = weight_bytes/kv_per_token`.
4. [KV sizing notebook](https://github.com/elizabetht/100-days-of-inference) (100 Days of LLM Inference - Days 1, 2, 5 and 6) - `day05/kv-cache.ipynb`: Memory Cost with `kv_bytes=2*n_layers*n_embd*seq*bytes`, Benchmark 518 ms to 196 ms at length 200, Try These Experiments for slope versus step and 300 and 500 lengths. Depth: Verify the slope formula against your own GPT-2 run. The notebook's formula uses `n_embd`, which ignores GQA, so its Llama 3 rows overstate KV by the query-to-KV head ratio (4x for 8B, 8x for 70B); recompute them with KV heads at your precision and length.

**Focus**

- KV bytes per token are $`2 \times \text{bytes} \times L \times K \times H`$. The shortcut $`4 \times L \times d_{\text{model}}`$ assumes KV width equals model width and breaks under GQA and MQA.
- Llama-2-7b uses 524,288 bytes per token in fp16; Llama-3.1-8B uses 131,072 bytes in bf16 GQA-8, or 4x with MHA and 8x less with MQA; the invented model uses 262,144 bytes in int8.
- MLA compresses keys and values to a latent vector, as in DeepSeek-v3. It is not fewer heads; use latent width for its bytes.
- Logical bytes are not servable bytes. Pages, `max_model_len` over-allocation, `reserved_memory` and fragmentation decide the fit; a 200-token request in an 8192 reservation wastes 97.6%.

**Reproduce:** Closed-book, derive Llama-2-7b as $`2 \times 32 \times 32 \times 128 \times 2 = 524{,}288`$ bytes, Llama-3.1-8B GQA-8 as $`2 \times 32 \times 8 \times 128 \times 2 = 131{,}072`$ bytes, and the invented model in int8 as $`2 \times 64 \times 8 \times 256 \times 1 = 262{,}144`$ bytes.

**Traps**

- Using query heads for KV bytes. Llama-3.1-8B has 32 query heads but 8 KV heads; using 32 overstates bytes by 4x.
- Treating MLA as a head count. Its saving comes from latent compression, so recompute from latent width.
- Fitting logical bytes. The planner divides $`(M - R - M_{\text{model}})`$ by per-request bytes with reserve $`R`$; omitting $`R`$ or page waste overstates batch.

**Practice**

- [TensorTonic: Plan KV-Cache Capacity](https://www.tensortonic.com/problems/cs336-l10-kv-cache-capacity-planner) - Function `kv_cache_capacity_planner` returning `model_bytes`, `kv_bytes_per_request`, `max_batch_size`, `seconds_per_token`, `tokens_per_second`; public cases check 27-fit, zero-fit when the model exceeds memory, and single-KV-head 18-fit. Derive by hand first with $`M_{\text{model}} = P \times b_p`$, $`M_{\text{request}} = 2 \times L \times S \times H_{\text{kv}} \times D \times b_e`$, $`B`$ as the floor of $`(M - R - M_{\text{model}})/M_{\text{request}}`$ and $`T = (M_{\text{model}} + B \times M_{\text{request}})/W`$. Then check the answer against your own worksheet for the same config.

**Stop when:** Your hand-derived 524,288, 131,072 and 262,144 match, and the planner passes the three public cases.

<details>
<summary>Self-test</summary>

1. What are KV bytes per token for a 40-layer, 8 KV head, 128-dim model in int8?
   - $`2 \times 40 \times 8 \times 128 = 81{,}920`$ bytes.
2. The invented model in bf16 uses what per token, and what would full MHA with 32 KV heads use?
   - 524,288 bytes in bf16 (262,144 in int8). Full MHA at 32 KV heads would use 2,097,152 bytes in bf16.
3. 70B GQA-8 uses 327,680 bytes per token in fp16. What does single-head MQA use?
   - 40,960 bytes, an 8x cut. Capacity grows by about 8x before reserve and waste.
4. Why does a 200-token request waste 97.6% in an 8192 reservation?
   - The reservation holds 8192 times per-token bytes (about 2.5 GiB for 70B) while 200 tokens use 62.5 MiB. Paging and exact reservation remove most of this.

</details>

#### U4. Prefill and decode operation counts per request

**About 3 h** · **Target:** Derive

Topics: Approximate transformer prefill operations; Approximate autoregressive decode operations per token

Operation counts are the numerator of every intensity and bound. A count that mixes prefill with decode corrupts all of them.

**You can now**

- Derive dense operations per token as $`2P`$ from the qkv, output and MLP walk.
- Derive prefill attention and decode attention counts separately and state when attention rivals dense work.
- State what a FLOP count omits and when the omission stops being safe.

**Study**

1. [Dense walk: 2P operations per token](https://kipp.ly/p/transformer-inference-arithmetic) (Transformer Inference Arithmetic) - flops counting with the How many flops in a matmul box in kv cache (qkv, output and MLP sum to about $`2P`$; 52B example at 51.5B). Depth: The $`2P`$ count covers dense weights once per token in prefill and decode alike. Attention comes on top and grows with prompt length in prefill.
2. [Linear and attention operations](https://jax-ml.github.io/scaling-book/inference/) (How to Scale Your Model - Inference) - Linear operations: what bottlenecks us? with $`2*B*D*F`$ per matmul, and What about attention? with $`4*B*S*T*D`$ for scores plus values.
3. [Prefill versus decode work with numbers](https://inference.tusharamrit.in/modules/autoregressive-loop.html) (LLM Inference: From scratch, one token at a time - Modules 01, 02 and 04) - Prefill compute-bound and decode memory-bound with per-token matmul and attention terms (16.1 GFLOP per token for Llama-3-8B); Math by hand at $`S = 2048`$ with 32.9 TFLOP dense plus 2.2 TFLOP attention.
4. [Matmul and attention intensity](https://github.com/elizabetht/100-days-of-inference) (100 Days of LLM Inference - Days 1, 2, 5 and 6) - `day06/ops-byte-ratio.ipynb`: matmul `comp=2MKN` with `mem=(MK+KN+MN)*2`, attention `mem=8N^2+8Nd` with `comp=4N^2d+3N^2`, prefill compute-bound versus decode memory-bound. Depth: Use the count formulas only. The GB10 timings are the author's hardware result, not your target; your target is the crossover and the knee on your GPU in a later section.

**Focus**

- One matmul through all params costs $`2P`$ by the $`2 \times m \times n \times p`$ rule. The qkv, output and MLP walk sums to the same within 2%.
- Decode attention per token scales with cached length; prefill attention scales with prompt length squared. At 8192 cached tokens the invented model adds $`1.72 \times 10^{10}`$ to $`3.68 \times 10^{10}`$ dense.
- Softmax and norms are $`O(d_{\text{model}})`$ per layer, and sampling plus unembedding run once per step, against $`O(d_{\text{model}}^2)`$ dense per layer. They matter only when dense shrinks or a profile says so.
- Attention work uses query heads $`N`$ times head dim $`H`$, because every query head scores its group; KV bytes use KV heads $`K`$ times $`H`$. Neither uses model width where the heads differ from it.

**Reproduce:** Closed-book, derive decode operations per token for the invented 18.4e9-param model at cached length 8192: dense $`2 \times 18.4 \times 10^9 = 3.68 \times 10^{10}`$, attention $`4 \times 8192 \times 32 \times 256 \times 64 = 1.72 \times 10^{10}`$, total about $`5.4 \times 10^{10}`$.

**Traps**

- Taking $`2P`$ per token as the whole prefill cost. Prefill pays dense per prompt token plus attention that grows with prompt length squared; for Llama-3-8B the attention term passes the dense term near 32k.
- Writing the attention scale as division by head dim. The implemented scale is $`1/\sqrt{d_{\text{head}}}`$; the count is unchanged but a later kernel must use the root.
- Calling decode attention free because dense dominates. At 8192 it is nearly half the dense count; recompute the share before dropping it.

**Practice**

- [100 Days of LLM Inference Day 06: ops-byte experiments](https://github.com/elizabetht/100-days-of-inference) - `day06/ops-byte-ratio.ipynb`, Try These Experiments: redo intensity with $`d = 64`$, find the crossover batch with `cuda.get_device_properties`, and the 7B fp16 14GB with 14 GFLOP per token calc. Show every substitution with prefill and decode kept apart. Fix the `matmul_intensity` cell first: a typo (`ompute`) makes its stored batch sweep wrong. Then check the README's batch-64 crossover against the H100 ridge it quotes; this journal is practice, not authority.

**Stop when:** You derive the 5.4e10 decode count at 8192 without notes and complete the $`d = 64`$ redo with the crossover stated.

<details>
<summary>Self-test</summary>

1. How many dense operations does one decode step take for the invented 18.4e9-param model?
   - About $`3.68 \times 10^{10}`$, from $`2 \times 18.4 \times 10^9`$.
2. At cached length 8192, what is its decode attention count and share?
   - $`4 \times 8192 \times 32 \times 256 \times 64 = 1.72 \times 10^{10}`$, nearly half the dense count, so it cannot be dropped there.
3. Why is $`2P`$ per token not the whole cost of a prefill at $`S = 2048`$?
   - $`2P`$ counts dense once per token (32.9 TFLOP for 8B at 2048). Prefill adds about 2.2 TFLOP of attention there, and at longer prompts attention dominates.
4. Without a cache, how does per-step work grow with length $`n`$?
   - Each step reruns the full forward over all $`n`$ tokens (the KV projections alone are about $`n/6`$ of a one-token forward pass), so totals grow quadratically.

</details>

#### U5. Length, reuse and media-token distributions of a workload

**About 4 h** · **Target:** Explain + Measure

Topics: Input and output length distributions; Prompt reuse and cache-locality distributions; Multimodal encoder and media-token budgeting

Averages hide the shapes that set cost. Spread, reuse and image tokens decide which batch, cache and SLO hold.

**You can now**

- Describe a workload by input and output length medians plus spread, not points.
- Describe prompt reuse and cache-locality distributions and state when reuse helps outcomes.
- Budget media tokens for a multimodal input with encoder and longer-context effects.

**Study**

1. [Length spread and day-long variation](https://arxiv.org/html/2407.07000v2) (Etalon: Holistic Performance Evaluation Framework for LLM Inference Systems) - Section 3.1 with Figures 1 and 2 (Yi-34B on 2 H100 prefill versus length; Arxiv-Summarization at 1.5 QPS with 60% over 25 s scheduling and 228 median decode tokens); Section 4.1 (LMSys-Chat-1M 417 median and 1418 p90 prefill tokens; prefill deadline fitted from 10 isolated repeats); Section 5.1 (hourly runs over 24 hours, 256 to 8k prefill with 256 gen).
2. [Prefix reuse and median lengths](https://jax-ml.github.io/scaling-book/inference/) (How to Scale Your Model - Inference) - Designing an Effective Inference Engine: Prefix caching with the dogs and cats example, chat append, few-shot and system prompts, affinity routing, LRU trie and host DRAM.
3. [Cache reuse and fragmentation](https://inference.tusharamrit.in/modules/kv-cache.html) (LLM Inference: From scratch, one token at a time - Modules 01, 02 and 04) - Fragmentation: the waste nobody budgets for with 20.4-38.2% useful; Cache reuse: the free win hiding in chat with 30x TTFT example from 3000 to 100 tokens. Depth: Treat the 30x as the author's workload result, not your target. Your target is the reuse distribution and the TTFT move on your corpus.
4. [Benchmark dimensions and vision tokens](https://www.baseten.co/inference-engineering/) (Inference Engineering) - Sections 4.5 with 4.5.1 for sequence lengths, traffic volume and pattern, request contents and input params; Section 6.1 for vision encoders, about a thousand visual tokens per high-resolution image, and longer prefill, decode and KV effects.

**Focus**

- Report medians with spread: 417 median against 1418 p90 prefill tokens, 256 to 8k sliders, 228 median decode tokens, hourly runs over 24 hours. Points hide padding, blocking and queueing.
- Prefill grows about quadratically, so a static TTFT target is slack for short prompts and impossible for long ones. Fit the prefill deadline from the isolated curve per length.
- Reuse is a distribution with routing and eviction costs. Affinity routing, LRU trie and DRAM decide whether shared prefixes move TTFT and goodput.
- A high-resolution image adds about a thousand visual tokens to prefill and KV. The encoder is small but fragmented runtime support makes engine choice matter.

**Reproduce:** Closed-book, write the workload card with medians 417 and 1418, decode median 228 with spread and $`n`$, a reuse line and an image-token line at 1000 per high-resolution image. Add the steady-state illustration for $`P = 4096`$, $`G = 1024`$, $`B = 16`$, labeled fixed-length only: sequences finishing per step $`16/1024 = 1/64`$, tokens evicted per step $`16 \times 5120/1024 = 80`$.

**Traps**

- Sweeping batch at fixed length and calling it a workload. Prompts spread widely and decode lengths vary as much, so fix both axes.
- Reading hit rate as outcome. Low reuse with lookup, routing, reservation or eviction can lose even at high hit rate; check TTFT and goodput.
- Treating image tokens as free. They are prefill tokens with KV that live for the whole decode; budget them as input length.

**Practice**

- The section mini-project covers this: length, reuse and media-token distributions measured from your retained corpus with medians, spread and n.

**Stop when:** Your workload card states medians, spread, reuse and image-token lines with n, and you can defend the fitted prefill deadline against a static one.

<details>
<summary>Self-test</summary>

1. Which spreads does this unit cite, and why medians plus spread?
   - LMSys-Chat-1M 417 median with 1418 p90 prefill tokens, 256 to 8k sliders, 228 median decode tokens, hourly runs over 24 hours. Points hide the padding, blocking and queueing that spreads cause.
2. Why must the prefill deadline be fitted per length?
   - Prefill grows about quadratically (Figure 1), and scheduling delay mixes with processing. A static target is slack or impossible across 417 to 1418 tokens.
3. At $`P = 8192`$, $`G = 4096`$, $`B = 32`$, how many tokens leave the cache per step?
   - 96: $`32/4096`$ sequences finish per step, each evicting $`P + G = 12288`$, so $`32 \times 12288/4096 = 96`$.
4. When does prefix reuse lose despite hits?
   - When lookup, routing, reservation, eviction or low reuse costs more than recompute. Hit rate alone does not establish TTFT or goodput gain.

</details>

#### U6. Arrival processes, concurrency, bursts and open versus closed load

**About 4 h** · **Target:** Explain + Derive

Topics: Arrival rate, concurrency and burst shape; Open-loop versus closed-loop load

Capacity math predicts; load proves. A closed driver hides the queue that users feel.

**You can now**

- Explain arrival rate, concurrency and burst shape with peak windows stated.
- Derive concurrency from $`L = \lambda W`$ with units and the stability assumption.
- Distinguish open-loop from closed-loop load and state which to trust for tails.

**Study**

1. [Throughput when the loop is serial](https://inference.tusharamrit.in/modules/autoregressive-loop.html) (LLM Inference: From scratch, one token at a time - Modules 01, 02 and 04) - What throughput means when the loop is serial: TTFT, TPOT and ITL, end-to-end, throughput, and `concurrency = arrival_rate * latency`.
2. [Coordinated omission and latency correction](https://www.youtube.com/watch?v=lJ8ydIuPFeU) (Gil Tene - How NOT to Measure Latency (talk)) - Full talk: closed-loop testers that wait for each reply, missing samples under queueing, and the correction concept of recording intended send time. Depth: Watch for vocabulary and the correction idea. Do not adopt `wrk`, `hey` or `ab`; write the small Python generator in the load-generator unit.
3. [Capacity recipe under an SLO](https://arxiv.org/html/2407.07000v2) (Etalon: Holistic Performance Evaluation Framework for LLM Inference Systems) - Section 4.2 Capacity Evaluation with different request loads to max capacity under fluidity-index SLOs; Section 5.2 with vLLM and Sarathi-Serve at 0.6 QPS under a 25 ms TBT SLO.
4. [Traffic volume and pattern](https://www.baseten.co/inference-engineering/) (Inference Engineering) - Sections 4.5 with 4.5.1 for volume and pattern of traffic with jittered traffic to mimic real usage beside sequence lengths and request contents.

**Focus**

- The Systems unit Little's Law, capacity and queueing approximations gives $`L = \lambda W`$ with matching units. Here arrival rate times time in system is the concurrency you must bound.
- $`L = \lambda W`$ holds for long-run averages in a stable system. It predicts nothing about tails; size the bound for the peak window, not the daily mean.
- Open-loop sends on a schedule whether replies returned; closed-loop waits for each reply. Past the knee closed-loop self-throttles and reports flat latency while the queue explodes.
- Keep every raw sample with $`n`$. Percentiles come from retained records; the generator log with intended send times is part of the evidence.

**Reproduce:** Closed-book, solve all three directions: $`100 \text{ rps} \times 0.05 \text{ s} = 5`$ requests, $`5/0.05 = 100`$ rps, $`5/100 = 0.05`$ s. Then state why, on the load-generator unit's simulated slow server, open-loop p99 near 759 ms is honest against closed-loop p99 near 540 ms.

**Traps**

- Applying $`L = \lambda W`$ to percentiles or a draining queue. It relates long-run averages in a stable system only.
- Tuning the closed loop until latency looks good. Fewer clients or think time hides the queue; the offered load is no longer the stated load.
- Reading server-side latency only. Queue wait before the handler is user-visible; instrument arrival-to-start separately.

**Practice**

- The section mini-project covers this: an open-loop sweep through the predicted knee with retained raw records, measured p50, p95 and p99 with n, queue depth and recovery, reconciled against the Little's Law prediction.

**Stop when:** You solve all three Little's Law directions without notes and can point at the knee with the bottleneck named.

<details>
<summary>Self-test</summary>

1. 100 rps with 50 ms in system: average concurrency?
   - 5 requests ($`100 \times 0.05`$). Units: $`(\text{requests}/\text{s}) \times \text{s} = \text{requests}`$.
2. Single server at high utilization: which multiple of service time does mean wait approach?
   - It grows with $`\rho/(1 - \rho)`$ form; state M/D/1 versus M/M/1 before quoting 9.5x versus 19x at 0.95.
3. Open-loop p99 is 759 ms and closed-loop p99 is 540 ms on the same server. Which is honest?
   - Open-loop. Closed-loop skips the requests it never sent; the missing samples are the omitted coordination.
4. Throughput rises with offered load, then flattens while p95 climbs. What happened?
   - First saturation: the bottleneck reached high utilization. Extra offered load becomes queue wait and errors, not completions.

</details>

#### U7. The request contract and its latency metrics

**About 4 h** · **Target:** Explain + Derive

Topics: Streaming, sampling, stop and timeout contracts; TTFT, TPOT, inter-token latency and end-to-end latency; p50, p95 and p99 latency interpretation

Users feel first token, gaps and total; averages hide stalls. The contract decides what counts as done.

**You can now**

- Explain the streaming, sampling, stop and timeout fields that define when a request is done.
- Define TTFT, TPOT, ITL and end-to-end latency with request- versus token-weighted averages.
- Interpret p50, p95 and p99 from raw samples with n, keeping end-to-end apart from inference-only time.

**Study**

1. [TTFT, TPOT, ITL and request versus token weighting](https://handbook.modular.com/llm-inference-basics/llm-inference-metrics/) (LLM Inference Handbook - Key metrics for LLM inference) - TTFT with chatbot under 500 ms and code under 100 ms; Token Generation Time as `E2EL - TTFT` with 2200 minus 80 is 2120 ms; TPOT as `(E2EL - TTFT)/(N - 1)` with 2120/219 is 9.68 ms; Average TPOT request-weighted versus Average ITL token-weighted; Mean, Median and P99.
2. [Sampling, percentiles and benchmark caveats](https://github.com/stas00/ml-engineering/tree/master/inference) (Machine Learning Engineering Open Book - Inference) - Decoding methods with Temperature (`scaled_logits=logits/temperature`, `t==0` uses explicit greedy mode, rank-invariant, Top-K and Top-p effects); Key metrics with TPOT table and Simplified prefill and decode throughput; Percentiles with p50 to p99 and the k6 example; Benchmarks with TTFT as first non-empty chunk and `decode_thr=(output_toks-1)/(last-first)` plus TTFT-is-not-prefill caveats.
3. [Streaming contract with abort](https://www.oreilly.com/library/view/hands-on-llm-serving/9798341621480/) (Hands-On LLM Serving and Optimization - Chapters 2 and 5) - Chapter 2, LLM Streaming Serving Basics (pp 60-61): `llm.generate` blocks, `AsyncLLMEngine` with `SamplingParams(temperature=0.0, max_tokens=100, stop=["\n"])` (the 128-token example with `temperature=0.8` is the earlier blocking call), `engine.generate` with `request_id`, `async for request_output` with `chunk.text`, and `engine.abort(request_id)`.
4. [Percentiles and end-to-end time](https://www.baseten.co/inference-engineering/) (Inference Engineering) - Sections 1.4 to 1.4.2 for TTFT with Perceived versus Total TPS and ITL at 10 ms as 100 TPS; P50, P90, P95 and P99 table with right-skewed Figure 1.5; End-to-End Metrics for inference-only versus end-to-end with network and queue time.

**Focus**

- Streaming returns tokens as generated. Blocking `llm.generate` waits for all; `engine.generate` yields `RequestOutput` chunks; `engine.abort` stops by `request_id`.
- Sampling sets `temperature`, `top_p`, `top_k`, `seed`, `stop` strings and ids, `max_tokens` and `min_tokens`. Zero temperature means greedy via an explicit mode, not division.
- TTFT covers scheduling plus prefill plus transport and queue, not prefill alone. TPOT divides decode time by output count; mean ITL equals TPOT for one request but request-weighted and token-weighted averages differ across requests.
- Percentiles need raw samples with $`n`$. End-to-end includes network and queue; inference-only does not. A fast GPU with slow end-to-end points at infrastructure.

**Reproduce:** Closed-book, score the playground request with E2EL 2200 ms, TTFT 80 ms and 220 output tokens: Token Generation Time $`2200 - 80 = 2120`$ ms and TPOT $`2120/219 = 9.68`$ ms per token. Then state the request-weighted versus token-weighted formulas for two requests with different lengths.

**Traps**

- Treating TTFT as prefill time. It includes transport, queue, scheduling and generation start; a batched chunk is not one token.
- Averaging TPOT across requests as system ITL. Request-weighted treats requests equally; token-weighted lets long responses dominate. Use the first for per-request latency and the second for system streaming speed.
- Setting one static TTFT SLO across lengths. Prefill grows about quadratically; fit per-length targets or split scheduling from processing.

**Practice**

- The section mini-project covers this: per-request queue, first-token, token, completion, cancellation and error records with TTFT, TPOT and ITL derived from retained timestamps.

**Stop when:** You derive 2120 ms and 9.68 ms without notes and can read request- versus token-weighted off two requests with different lengths.

<details>
<summary>Self-test</summary>

1. E2EL is 2200 ms, TTFT is 80 ms, output is 220 tokens. What are Token Generation Time and TPOT?
   - 2120 ms and $`2120/219 = 9.68`$ ms per token. The divisor is output minus one because the first token arrived with TTFT.
2. When do Average TPOT and Average ITL disagree?
   - When output lengths differ. Average TPOT weights requests equally; Average ITL weights by tokens, so long responses dominate the latter.
3. Why is prompt tokens divided by TTFT not prefill throughput?
   - TTFT includes queue, scheduling, transport and generation start. Server instrumentation is needed to isolate prefill; the quotient mixes all of them.
4. What goes wrong with `temperature=0` as division?
   - Division by zero is undefined. Engines use an explicit greedy mode; the rank order is invariant but Top-K probs and Top-p membership still change with temperature above zero.

</details>

#### U8. Throughput, goodput, rejection, quality acceptance and energy per token

**About 3 h** · **Target:** Explain + Derive

Topics: Throughput, goodput, rejection and quality acceptance; Energy per accepted token as an additional outcome

Throughput without an SLO and a quality gate ranks averages and hides stalls and bad outputs. Goodput prices both.

**You can now**

- Distinguish throughput, goodput, rejection and quality acceptance with SLOs stated.
- Derive goodput from a request table with TTFT, TPOT and quality gates.
- Derive energy per accepted token from power, time and accepted outputs.

**Study**

1. [Per-GPU goodput under TTFT and TPOT SLOs](https://arxiv.org/html/2401.09670v3) (DistServe: Disaggregating Prefill and Decoding for Goodput-optimized LLM Serving) - Section 1 with Figure 1: per-GPU goodput as the max request rate within TTFT and TPOT constraints at 90% attainment; 13B model on one A100 at about 1.6 requests per second.
2. [Goodput SLO example](https://handbook.modular.com/llm-inference-basics/llm-inference-metrics/) (LLM Inference Handbook - Key metrics for LLM inference) - Goodput with SLO `TTFT <= 200 ms` and `E2EL <= 3000 ms`: 4 of 6 sample requests meet all SLOs for 67% goodput with per-request TPOT table.
3. [Goodput versus throughput](https://inference.tusharamrit.in/modules/roofline.html) (LLM Inference: From scratch, one token at a time - Modules 01, 02 and 04) - The four metrics with goodput, and the goodput versus throughput check question: batch 256 at 20k tokens per second but TPOT 80 ms against a 50 ms SLO gives zero goodput.
4. [Cost, power and throughput metrics](https://www.oreilly.com/library/view/hands-on-llm-serving/9798341621480/) (Hands-On LLM Serving and Optimization - Chapters 2 and 5) - Chapter 5, Why Optimizing LLM Serving is Important with Cost Efficiency and Table 5-4 hourly cost per chip; GPU power consumption with TDP watts and perf per watt; Chapter 4, Measuring Performance in LLM Serving with Throughput Metrics and Best Practices for Performance Measurement (pp 149-153).

**Focus**

- Throughput counts all tokens; goodput counts only requests meeting TTFT, TPOT and quality gates. Rejected, retried and low-quality outputs add load without goodput.
- Per-GPU goodput is the max rate at the SLO attainment target. The 13B example is the source hardware result on one A100, not your target.
- Quality acceptance needs a stated check on retained outputs. Evals double as varied inputs and as spot checks that speed work did not change outputs.
- Energy per accepted token divides power times time by accepted outputs. Use TDP and measured time with the SLO and quality gate stated; never present vendor speedups as your result.

**Reproduce:** Closed-book, score the 6-request Modular table at `TTFT <= 200` ms and `E2EL <= 3000` ms: 4 of 6 pass for 67% goodput. Then derive energy per accepted token for a 400 W chip serving 4 accepted requests of 200 tokens in 10 s as $`400 \times 10/(4 \times 200) = 5`$ J per accepted token.

**Traps**

- Quoting raw throughput as serving capacity. A 20k tokens per second batch at 80 ms TPOT against a 50 ms SLO has zero goodput.
- Counting retried and rejected work as useful. Retries add offered load; only accepted outputs enter goodput and energy denominators.
- Presenting paper or vendor speedups as your numbers. Quote them only as the source result on the source hardware with the SLO stated.

**Practice**

- The section mini-project covers this: throughput versus goodput with rejection and quality gates, plus energy per accepted token from measured power and time.

**Stop when:** You score 4 of 6 as 67% goodput without notes and can separate throughput, goodput and energy denominators on a new table.

<details>
<summary>Self-test</summary>

1. What is per-GPU goodput in DistServe Section 1?
   - The highest request rate served while the target share meets TTFT and TPOT SLOs. The 13B example reaches about 1.6 requests per second at 90% attainment on one A100.
2. 6 requests, 4 meet TTFT, TPOT and E2E SLOs. What is goodput?
   - 67% (4 of 6). Throughput counts all tokens; goodput counts only SLO-passing requests, with quality accepted.
3. 100 new requests per second with 10% failing once and retried successfully. What are throughput and goodput?
   - Throughput is 110 attempts per second; goodput is 100 successful requests per second. Retries add 10% load without goodput.
4. A 400 W chip serves 800 accepted tokens in 10 s. What is energy per accepted token?
   - $`400 \times 10/800 = 5`$ J per accepted token, at the stated SLO and quality gate. Rejected and unaccepted tokens stay out of the denominator.

</details>

#### U9. One request through the engine, from API to detokenizer

**About 4 h** · **Target:** Explain

Topics: API, tokenizer, queue, admission and scheduler lifecycle; Block manager, model runner, sampler and detokenizer lifecycle

An optimization without a lifecycle map optimizes the wrong stage. Every later queue, cache and kernel claim hangs off this path.

**You can now**

- Trace one request from API through tokenizer, queue, admission and scheduler with owners named.
- Trace it through block manager, model runner, sampler and detokenizer to streaming output.
- Name the measurement points that falsify a bottleneck hypothesis.

**Study**

1. [Engine orchestration and JetStream](https://jax-ml.github.io/scaling-book/inference/) (How to Scale Your Model - Inference) - Designing an Effective Inference Engine: Continuous batching with queue, prefill, generate, cache and stream orchestration; Prefix caching; Let's look at an implementation: JetStream with prefill and generate engines, controller and transfer thread.
2. [Serve, stream and batch with vLLM](https://www.oreilly.com/library/view/hands-on-llm-serving/9798341621480/) (Hands-On LLM Serving and Optimization - Chapters 2 and 5) - Chapter 2, Serve the LLM (Qwen) with vLLM (pp 57-59) with `LLM`, `SamplingParams` and `llm.generate`; LLM Streaming Serving Basics (pp 60-61) with `engine.generate` and `engine.abort`; LLM Batch Serving Basics (pp 61-63) with batched `llm.generate` at 2.2x for 4 prompts.
3. [Tiny engine request path](https://github.com/GeeeekExplorer/nano-vllm/blob/bb823b3e06983d71485a8e1f23715ebd87d98ef8/nanovllm/engine/block_manager.py) (Nano-vLLM tiny serving engine) - `sequence.py` with `SequenceStatus` WAITING, RUNNING and FINISHED plus `block_table`; `scheduler.py` with `waiting` and `running` sets, `schedule`, `preempt` and `postprocess`; `model_runner.py` with `prepare_prefill`, `prepare_decode` and `run`; `llm_engine.py` with `generate`, `add_request` and `tokenizer.decode`.
4. [Batching and online versus offline](https://github.com/stas00/ml-engineering/tree/master/inference) (Machine Learning Engineering Open Book - Inference) - Batching with Static versus Continuous batching; Online vs Offline inference for interactive latency versus batch throughput.

**Focus**

- The GPU unit One request through prefill and decode, and the shapes that set its cost gives tensor shapes; here follow ownership: API to tokenizer to queue to admission to scheduler to block manager to runner to sampler to detokenizer to stream.
- Waiting holds admitted but unscheduled requests; running holds scheduled with blocks. `schedule` moves waiting to running on `can_allocate`; `preempt` returns running to waiting.
- Prefill writes cache for the whole prompt and returns first logits; decode reads full cache, samples one token and appends one pair. `prepare_prefill` and `prepare_decode` build different `block_tables` and slot maps.
- Each handoff is a measurement point: arrival, tokenized, queued, scheduled, prefill done, first token, each decode gap, sampled, streamed and freed. A bottleneck claim must name which gap moved.

**Reproduce:** Closed-book, walk one prompt through the tiny engine: `add_request` creates a WAITING `Sequence`, `schedule` moves it to running after `can_allocate` and `allocate`, `prepare_prefill` then `prepare_decode` run the model, `postprocess` appends tokens until FINISHED, and `tokenizer.decode` renders output. Name the owner that frees blocks.

**Traps**

- Treating `llm.generate` as streaming. It blocks until all outputs finish; only `engine.generate` yields `RequestOutput` chunks during the run.
- Calling the scheduler queue the only queue. Tokenizer, admission, block allocation and detokenizer queues add waits with different owners.
- Skipping the transfer thread in disaggregated paths. Prefill and decode engines plus controller plus transfer each hold state that must be traced.

**Practice**

- [Hands-On LLM Serving companion: LLM execution walkthrough](https://github.com/orca3/llm-model-inference) - `ch02/ch2_Workthrough_LLM_execution.ipynb`: Examples 2-1 and 2-2 token-by-token without and with `past_key_values` and `use_cache`. Run on a small model. Record arrival, prefill, first-token, decode gaps and detokenized output; the cached run stays stable after the first token.

**Stop when:** You walk one request end to end without notes, and your walkthrough run shows cached decode stable after the first token.

<details>
<summary>Self-test</summary>

1. What moves a request from waiting to running in the tiny engine?
   - `schedule` after `can_allocate` succeeds, followed by `allocate` filling `block_table`. Without free blocks it stays waiting or a running request is preempted.
2. What differs between `prepare_prefill` and `prepare_decode`?
   - Prefill builds tables and slot maps for the whole prompt and writes cache; decode maps one new token per sequence against the full cache and appends one pair.
3. Where do TTFT and per-token latency attach on this path?
   - TTFT spans arrival through scheduled prefill to first streamed token. Per-token latency spans one decode step with cache read, sample and stream.
4. Which lifecycle evidence falsifies a queueing versus execution claim?
   - Arrival-to-start versus start-to-done splits with queue depth. Queue growth with flat execution implicates scheduling and load, not the model.

</details>

#### U10. Streaming, cancellation, failure and cleanup states and ownership invariants

**About 4 h** · **Target:** Explain + Implement

Topics: Streaming, cancellation, failure and cleanup states; Request and resource ownership invariants

A cancelled request still owns blocks, streams and sampler state until someone frees them. Leaks and double frees hide there.

**You can now**

- State ownership invariants and cleanup obligations at every request transition, including cancellation and failure.
- Instrument state transitions and resource ownership in a minimal serving path.
- Diagnose lost, duplicated, leaked or double-freed requests from state and resource traces.

**Study**

1. [Streaming and abort](https://www.oreilly.com/library/view/hands-on-llm-serving/9798341621480/) (Hands-On LLM Serving and Optimization - Chapters 2 and 5) - Chapter 2, LLM Streaming Serving Basics (pp 60-61): `engine.generate` with `request_id`, `async for request_output` with `chunk.text`, and `engine.abort(request_id)` for cancellation.
2. [Scheduler and block ownership](https://github.com/GeeeekExplorer/nano-vllm/blob/bb823b3e06983d71485a8e1f23715ebd87d98ef8/nanovllm/engine/block_manager.py) (Nano-vLLM tiny serving engine) - `scheduler.py` with `waiting`, `running`, `preempt` and `postprocess`; `block_manager.py` with `ref_count`, `free_block_ids`, `used_block_ids`, `allocate`, `deallocate` and `can_append`; `sequence.py` with `SequenceStatus` WAITING, RUNNING and FINISHED.
3. [Failure, correctness and trace requirements](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/capstones/llm-inference-systems-laboratory.md) (LLM Inference Systems Laboratory - Workload and Baseline) - Milestone B for correlated events, observer overhead and trace queries over TTFT and every decode gap; Milestone D with Failure-injection requirements for cancellation and disconnect at every phase and every terminal phase; Correctness requirements for KV ownership, refcounts, cleanup and scheduler invariants.

**Focus**

- Cancellation can arrive in queue, prefill, decode or streaming. Abort must stop scheduling, free blocks, close the stream and mark exactly one terminal state.
- One owner per block with `ref_count`; one terminal mark per `request_id`. Freeing asserts zero refs; draining leaves no used blocks and no waiting or running entries.
- Failure, cancellation and timeout differ in trigger but share cleanup. Retries need idempotent handling by `request_id` or they duplicate work.
- Instrument each transition with `request_id`, state, owner and timestamps. Trace queries must explain TTFT and every decode gap without per-token sync overhead.

**Reproduce:** From a blank file, implement a minimal state machine over WAITING, RUNNING, FINISHED, CANCELLED and FAILED with block acquire and release plus abort at each phase. Drive one success, one cancel during decode and one cancel in queue, and assert no leaked blocks and single terminal marks.

**Traps**

- Freeing blocks without removing the request from scheduler sets. The freed blocks get reallocated while the stale entry still schedules.
- Marking terminal twice. Stream close plus scheduler free can emit two completions unless one path owns the mark.
- Retrying a cancelled `request_id` without idempotence. The retry duplicates sampler and stream side effects or loses the cancellation.

**Practice**

- [Hands-On LLM Serving companion: streaming with abort](https://github.com/orca3/llm-model-inference) - `ch02/ch2_Streaming.ipynb` with `ch02/streaming.py`: stream with `engine.generate` and cancel one mid-stream request with `engine.abort(request_id)`. Record request state and block use before and after abort. Assert single terminal output and no held blocks.

**Stop when:** Your state machine passes one success plus two cancels with no leaks and single marks, and your streaming abort run shows freed blocks.

<details>
<summary>Self-test</summary>

1. Where can cancellation arrive, and what must abort do?
   - Queue, prefill, decode or streaming. Stop scheduling, free blocks, close the stream and mark one terminal state.
2. What holds at a clean drain?
   - No used blocks, empty waiting and running sets, and each `request_id` with exactly one terminal mark.
3. How do traces distinguish lost, leaked and double-freed requests?
   - Lost has no terminal mark; leaked has a terminal mark but held blocks; double-freed shows two frees or a refcount assert.
4. Why must retries be idempotent by `request_id`?
   - A retry after cancel or failure must not duplicate sampler, cache or stream effects. The id owns dedup and cleanup.

</details>

#### U11. Offered and completed token rates and first-order capacity

**About 3 h** · **Target:** Derive

Topics: Offered token rate and completed token rate; First-order concurrency, service-time and capacity estimates

First-order rates turn shapes into a capacity number to falsify. Omissions explain the gap to measured goodput.

**You can now**

- Derive offered versus completed token rates with units, keeping requests apart from tokens.
- Derive concurrency, service time and first-order capacity from arrival, lengths and step time.
- State what the first-order estimate omits before comparing with measured goodput.

**Study**

1. [Step time and token rates](https://jax-ml.github.io/scaling-book/inference/) (How to Scale Your Model - Inference) - Theoretical estimates for LLM latency and throughput with Min Step Time, Max Tokens per second and General Step Time plus the small-batch quiz (30B int8 at batch 4 is 2.5 ms and at batch 256 is 21 ms); Modeling throughput and latency for LLaMA 2-13B with both batch tables. Depth: Recompute the tables in bytes. The small-batch quiz assumes perfect overlap; the honest bounds are max for lower and sum for upper.
2. [Small- and large-batch latency](https://kipp.ly/p/transformer-inference-arithmetic) (Transformer Inference Arithmetic) - latency calculations with small-batch 260B on 16 GPUs at 22 ms per token and large-batch 512 at 53 ms with 3 ms comms latency; batch sizes with the 208 crossover. Depth: The 62 ms in the same large-batch sentence is a slip; 53 ms is the formula value. The crossover writes `A_bw/A_f` but computes peak operations over bytes per second.
3. [First-order prefill, decode and batch math](https://inference.tusharamrit.in/modules/autoregressive-loop.html) (LLM Inference: From scratch, one token at a time - Modules 01, 02 and 04) - Math by hand for Llama-3-8B at $`S = 2048`$ with 512 gen (prefill 33.3 ms versus 4.48 ms bytes, decode 4.48 ms, total 2.33 s, batch 64 at about 14,300 tokens per second needing 295 for the ridge).
4. [Offered versus completed load](https://github.com/stas00/ml-engineering/tree/master/inference) (Machine Learning Engineering Open Book - Inference) - Online vs Offline inference for latency versus throughput goals; Key metrics Simplified with prefill throughput as prompt tokens over TTFT and `latency=prompt/prefill_thr+gen/decode_thr`.

**Focus**

- Offered token rate is arrival rate times tokens per request; completed rate is served tokens per second; goodput keeps only SLO and quality passing. Keep requests per second apart from tokens per second.
- Step time floor is $`(M_{\text{model}} + B \times M_{\text{request}})/W`$. Throughput is $`B/T`$, or zero when no request fits.
- Concurrency is $`L = \lambda W`$ with matching units. Capacity is the smallest resource-over-work ratio with the bottleneck named.
- First-order omits tokenization, queueing, length variance, reserve and failed or retried work. Name each before comparing with measured goodput.

**Reproduce:** Closed-book, derive the planner example: $`M_{\text{model}} = 2000`$ bytes, $`M_{\text{request}} = 256`$ bytes, $`B = 27`$, $`T = 0.08912`$ s per batched step and 302.96 tokens per second.

**Traps**

- Mixing requests per second with tokens per second. Multiply by prompt plus output lengths with the distribution stated.
- Reading Max Tokens per second as goodput. It assumes every token passes SLOs and quality; goodput applies both gates.
- Comparing first-order with measured without omissions. Tokenization, queueing, variance, reserve and retries explain why measured sits below the floor.

**Practice**

- [How to Scale Your Model inference Questions 2 and 3](https://jax-ml.github.io/scaling-book/inference/) - Worked Problems, Question 2 (33.5 GB per entry at 128k context, batch 7, about 56 with one KV head) and Question 3 (1.4 ms parameter-load lower bound for 18.4e9 int8 params on 16 chips). Reproduce both closed-book before opening answers. Question 2 tests allocated capacity; Question 3 tests the bandwidth floor that bounds every step time.

**Stop when:** You derive 27 with 0.08912 s and 302.96 tokens per second plus Questions 2 and 3 without notes, and can name the bottleneck with omissions listed.

<details>
<summary>Self-test</summary>

1. What are offered, completed and goodput rates?
   - Offered is arrival times tokens per request; completed is served tokens per second; goodput keeps only SLO and quality passing requests.
2. In Reproduce, why is throughput 302.96 and not 100000/256?
   - Each step also reads the 2000-byte model once. $`T=(2000+27 \times 256)/100000=0.08912`$ s, so $`27/0.08912=302.96`$. Ignoring the model overstates the rate.
3. 30B int8 at batch 4 versus 256: which bound binds each?
   - Batch 4 at 2.5 ms is bandwidth-bound; batch 256 at 21 ms adds compute-bound MLP work. Small batch reads weights; large batch computes them.
4. Measured goodput sits below your first-order capacity. What do you list first?
   - Tokenization, queueing, output-length variance, memory reserve and failed or retried work with sizes, before claiming a new bottleneck.

</details>

#### U12. An immutable workload manifest and deterministic request replay

**About 4 h** · **Target:** Implement

Topics: Immutable workload and environment manifest; Deterministic request corpus and replay

Comparisons without a manifest compare different workloads. Immutability plus replay makes later ablations honest.

**You can now**

- Implement a workload manifest fixing model, prompts, lengths, arrival, reuse, sampling, streaming, timeouts and SLO.
- Implement an environment manifest with engine, config, versions, hardware and checksums.
- Implement deterministic corpus and replay with seeds, IDs and tuning versus final split.

**Study**

1. [Manifest, corpus and tuning versus final](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/capstones/llm-inference-systems-laboratory.md) (LLM Inference Systems Laboratory - Workload and Baseline) - Core requirements for recorded corpus with prompt, output, arrival, tenant, priority, cancellation and cache-locality distributions; Architecture constraints for version binding, distinct tuning and final traces and bounded overload; Deliverables for workload and immutable experiment manifests; Milestone E for tuning and final workload sets.
2. [Replay recipes](https://arxiv.org/html/2407.07000v2) (Etalon: Holistic Performance Evaluation Framework for LLM Inference Systems) - Section 4.2 Evaluation workflow and implementation with black-box recipe over diverse prompt lengths and Capacity Evaluation over request loads; Implementation as a fork of LLMPerf over OpenAI-compatible APIs.
3. [Shadowing, simulation and eval inputs](https://www.baseten.co/inference-engineering/) (Inference Engineering) - Sections 4.5 with 4.5.1 for shadowing production traffic, simulating sequence lengths, traffic volume and pattern, request contents and input params, and eval datasets such as MMLU, gsm8k and HumanEval as varied inputs with output spot checks.

**Focus**

- The GPU unit Manifests, claim schemas, predictions declared first and artifact lineage gives file layout; here fill it with serving fields: model, tokenizer, template, precision, prompts, lengths, arrival, reuse, sampling, streaming, timeouts and SLO.
- Environment pins engine, config, versions, hardware and topology with `hashlib.sha256` checksums. Publish atomically and reject replay under a changed config.
- Corpus rows carry stable request IDs with seeds. Tuning traces tune; final traces evaluate blinded with no shared IDs.
- Replay preserves offered load from intended send times and output semantics from tokenizer through stop and stream. Count alone does not prove replay.

**Reproduce:** From a blank file, write a manifest for a tiny 5-prompt corpus with fixed lengths, Poisson arrivals at seed 7, reuse line, sampling seed, timeouts and SLO plus `hashlib.sha256` checksums. Replay it twice and show identical IDs, outputs and checksums with tuning versus final split and no shared IDs.

**Traps**

- Editing the manifest in place. Publish a new version and keep the old; a moving workload voids past comparisons.
- Tuning on final traces. Even reading them to choose a policy leaks; keep tuning and final distinct with the split enforced.
- Replaying counts without intended times. A closed-loop replay hides overload; preserve the open schedule and output semantics.

**Practice**

- The section mini-project covers this: immutable workload and environment manifests with checksums, deterministic corpus and replay, and tuning versus final split with lineage.

**Stop when:** Two replays of your tiny corpus give identical IDs, outputs and checksums, and changed-config replay is rejected.

<details>
<summary>Self-test</summary>

1. What must the workload manifest fix?
   - Model, tokenizer, template, precision, prompts, length distributions, arrival and concurrency, reuse, sampling, streaming, timeouts and SLO with versions and checksums.
2. Why checksums plus atomic publish?
   - They detect corpus or config drift and stop partial reads. Consumers read only complete artifacts declared in the manifest.
3. Why keep tuning and final traces distinct?
   - Tuning on final data leaks evaluation into design. Final stays blinded until the comparison runs.
4. What does deterministic replay preserve?
   - Offered load from intended send times and output semantics from tokenizer through stop and stream, verified by identical IDs and checksums.

</details>

#### U13. A validated open- and closed-loop load generator with raw records

**About 5 h** · **Target:** Implement + Measure

Topics: Validated open-loop and closed-loop load generator; Per-request raw event and output retention

An unvalidated generator hides overload through coordinated waiting or changed outputs. Validation proves it preserves load and semantics.

**You can now**

- Build open- and closed-loop generators with deterministic requests, streaming and cancellation.
- Validate the generator against a deterministic fake server with known service and overload behavior.
- Retain per-request raw events and outputs with timestamps.

**Study**

1. [Benchmark snippets and tools](https://github.com/stas00/ml-engineering/tree/master/inference) (Machine Learning Engineering Open Book - Inference) - Benchmarks with openai `completions.create` and `stream=True` snippet (`ttft=first-start`, `decode_thr=(output_toks-1)/(last-first)`), TTFT-is-not-prefill caveats, `benchmark_throughput.py`, k6, aiohttp `backend_request_func.py` with vllm#7935 client fix, and the missing max-concurrency note.
2. [Intended send time correction](https://www.youtube.com/watch?v=lJ8ydIuPFeU) (Gil Tene - How NOT to Measure Latency (talk)) - Full talk: intended versus actual send time, missing samples under queueing, and why server-side timing alone drops user-visible wait. Depth: Use the correction concept in your generator. Do not adopt `wrk`, `hey` or `ab`.
3. [Validation and raw retention](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/capstones/llm-inference-systems-laboratory.md) (LLM Inference Systems Laboratory - Workload and Baseline) - Milestone B for raw arrival and completion records, observer overhead and trace queries over TTFT and every decode gap; Milestone E for micro through endpoint open-loop benchmarks on tuning and final sets; Measurement requirements for arrival, queue, service and stream timing with throughput, goodput and quality behavior.
4. [Load tooling and output checks](https://www.baseten.co/inference-engineering/) (Inference Engineering) - Sections 4.5 with 4.5.1 for SGLang Genai-bench, NVIDIA GenAI-Perf and Locust plus eval datasets such as MMLU, gsm8k and HumanEval as varied inputs with spot checks that speed work did not change outputs.

**Focus**

- Open-loop schedules Poisson arrivals via `random.expovariate` from intended send times; closed-loop issues next on completion with fixed clients. Count latency from intended time in both.
- The Systems saturation unit gives the fake server to copy: 10 ms service with a 500 ms stall on every 200th request at seed 21 for 30 s. Validation must separate the modes there before touching a real engine.
- Retain per request: intended and actual arrival, queue start, prefill done, first token, decode gaps, completion with cancellation or error, outputs with usage, sampling params and manifest version. Aggregates alone cannot yield tails.
- Outputs must match a direct run token for token. Eval spot checks catch a fast path that truncates or retunes generation under load.

**Reproduce:** Write a small open-loop generator with `random.seed(21)`, Poisson schedule via `random.expovariate`, latency from intended send time and one FIFO server with 10 ms service plus a 500 ms stall on every 200th request for 30 s. Confirm the 80 rps row (mean 341.1 ms, p50 341.1 ms, p95 649.5 ms, p99 759.1 ms nearest-rank) and the closed-loop twin with 5 clients (mean 62.1 ms, p99 540.0 ms, 80.5 completed rps), and state which run to trust for tails.

**Traps**

- Validating only on a fast server. Without queueing both modes agree; the slow server with overload is what separates them.
- Keeping aggregates without raw records. Percentiles need retained samples with `n`; the generator log is evidence, not scratch.
- Changing outputs to meet load. Truncating `max_tokens` or retuning sampling under pressure breaks semantics; identical outputs plus spot checks prove preservation.

**Practice**

- The section mini-project covers this: a validated open- and closed-loop generator with fake-server checks plus per-request raw events and outputs retained with timestamps.

**Stop when:** Your generator reproduces the 80 rps row and the closed twin, fake-server validation passes with outputs identical, and raw records yield p50, p95 and p99 with n.

<details>
<summary>Self-test</summary>

1. Why validate against a fake server with known service and overload?
   - It isolates generator bugs from engine variance. Known service gives expected means and tails; overload separates open from closed behavior.
2. Same slow server gives open mean 341.1 ms and closed mean 62.1 ms. Which is honest for tails?
   - Open-loop. Closed-loop never sent the queued work, so its 540.0 ms p99 omits the wait that open-loop reports as 759.1 ms.
3. What raw events does each request retain?
   - Intended and actual arrival, queue start, prefill done, first token, decode gaps, completion with cancellation or error, outputs with usage, sampling params and manifest version.
4. How do you prove the generator did not change outputs?
   - Identical token IDs and checksums versus a direct run at the same manifest plus eval spot checks. Any fast path that alters outputs fails validation.

</details>

### Mini-project: Request arithmetic and workload harness for servelab

**About 12 to 16 hours.** Build the `servelab` foundation with an analytical request and memory model, a retained workload corpus with replayable manifests and validated load generators. Trace one request through a minimal reference path and score throughput against goodput for a model that fits your GPU, grounding every later optimization.

1. Create `servelab` with `manifests/`, `workload/`, `model/`, `engine/`, `harness/`, `sim/`, `gateway/`, `tests/` and `reports/`, and record model, tokenizer, template and engine identity in `manifests/` checked against `config.json` with digests kept in `reports/`.
2. Build the analytical planner in `model/` for weight bytes, KV bytes per token and prefill and decode work in $`2P`$ dense form, checked against the TensorTonic capacity planner with derivations kept in `reports/`.
3. Collect a retained corpus in `workload/` with length, reuse and media-token distributions, write immutable workload and environment manifests with digests and a tuning versus final split, and prove deterministic replay preserves order and outputs with lineage kept in `reports/`.
4. Implement open-loop and closed-loop generators in `workload/` validated against a deterministic fake server, reconcile concurrency with $`L = \lambda W`$ and offered against completed rates, keeping raw event logs and outputs in `reports/`.
5. Trace one request through a minimal reference path in `engine/` from API through tokenizer, queue, scheduler and sampler with abort at each phase, checked against the Hands-On companion streaming lab with per-request traces kept in `reports/`.
6. Sweep offered load through saturation with the generators, derive TTFT, TPOT and ITL percentiles with $`n`$ from retained timestamps, track queue depth and recovery, score throughput against goodput with quality and energy per accepted token, and reconcile the knee with the planner estimate keeping the report in `reports/`.

**Deliverables**

- Analytical planner in `model/` with derivations and capacity fits checked against an independent worksheet.
- `workload/` corpus, manifests, replay proof and validated generators with raw event logs.
- `engine/` reference path with lifecycle, abort and per-request traces plus goodput and energy report.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [TensorTonic KV-Cache Capacity Planner](https://www.tensortonic.com/problems/cs336-l10-kv-cache-capacity-planner). Solve first by hand, then check the planner against your worksheet.
- external-tests: [Hands-On LLM Serving companion streaming lab](https://github.com/orca3/llm-model-inference). Run the streaming notebook and reproduce abort behavior with your traces.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Arithmetic planner | Planner derivations match an independent worksheet and the TensorTonic checks with stated conventions. | You sweep prompt and output shapes and show where the first-order estimate breaks with evidence. |
| Workload and replay | Double replay gives identical IDs and outputs, manifests reject changed configs, and raw logs yield percentiles. | Tuning and final traces stay disjoint with lineage, and a second operator reproduces the replay. |
| Reference path | Lifecycle and abort histories show single terminal marks with no held blocks against your ledger. | You inject aborts at every phase and trace each TTFT and gap to queueing or execution with evidence. |

Feeds into: Planner, manifests, corpus, generators and reference traces feed phase, memory and scheduling projects and the capstone baseline.

### Resource route

- **Primary - Theory:** [How to Scale Your Model - Inference](https://jax-ml.github.io/scaling-book/inference/) - Read the complete inference chapter for model, KV, batching, parallelism and capacity arithmetic. Reproduce every equation for one fixed model and workload, then use the public serving companion and book overview to connect the quantities to the request lifecycle.
- **Required - Book:** [Hands-On LLM Serving and Optimization - Chapters 2 and 5](https://www.oreilly.com/library/view/hands-on-llm-serving/9798341621480/) - Read Chapter 2 for the decoder walk-through, the KV cache and the prefill and decode phases, and the Chapter 5 sections that estimate model size and KV-cache size. Run the Chapter 2 companion notebooks on a small model and redo every size estimate for the model you will serve.
- **Required - Theory:** [Transformer Inference Arithmetic](https://kipp.ly/p/transformer-inference-arithmetic) - Re-derive weight bytes, KV bytes per token, prefill work, decode work and arithmetic intensity with explicit units. Replace every example constant with your model configuration and compare the estimates with the book.
- **Support - Course:** [LLM Inference: From scratch, one token at a time - Modules 01, 02 and 04](https://inference.tusharamrit.in/modules/autoregressive-loop.html) - Work the "Math by hand" and checkpoint parts of The Autoregressive Loop, The KV Cache and Metrics and the Roofline. Redo each worked number for your own model before reading the solution.
- **Required - Reference:** [Machine Learning Engineering Open Book - Inference](https://github.com/stas00/ml-engineering/tree/master/inference) - Use inference/README.md for the prefill/decode distinction, memory formulas, MHA/GQA/MQA/MLA comparison and current glossary. Treat unfinished sections as a reference boundary, not as the main course.
- **Reference - Reference:** [LLM Inference Handbook - Key metrics for LLM inference](https://handbook.modular.com/llm-inference-basics/llm-inference-metrics/) - Use the TTFT, TPOT and ITL definitions, and the difference between request-weighted average TPOT and token-weighted average ITL, when you define your own metrics.
- **Support - Course:** [Stanford CS336 - Inference Lecture](https://www.youtube.com/watch?v=fcgPYo3OtV0) - Watch the inference lecture once after the arithmetic reading. Pause to reproduce its model-memory and phase-bottleneck calculations; advanced serving mechanisms are routed to their later stages.
- **Support - Practice:** [100 Days of LLM Inference - Days 1, 2, 5 and 6](https://github.com/elizabetht/100-days-of-inference) - Run only the four named notebooks for request anatomy, model configuration, KV sizing and roofline orientation. Verify every formula independently because this public learning journal is a useful practice supplement, not the authority.
- **Support - Practice:** [TensorTonic Language Modeling from Scratch - Plan KV-Cache Capacity](https://www.tensortonic.com/problems/cs336-l10-kv-cache-capacity-planner) - Solve after the KV-bytes unit, then check the answer against your own worksheet for the same configuration.
- **Reference - Reference:** [AI Performance Engineering - Minimum Mental Model](https://github.com/wafer-ai/gpu-perf-engineering-resources) - A curated, dated index. Use Start Here only to find a primary source the other entries lack.
- **Support - Project:** [LLM Inference Systems Laboratory - Workload and Baseline](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/capstones/llm-inference-systems-laboratory.md) - Start the immutable workload manifest, deterministic fake server, request-state trace and arithmetic planner. Keep this same repository through INF-9 so later comparisons preserve the contract.
- **Reference - Reference:** [Hugging Face Transformers - model configuration and revision](https://huggingface.co/docs/transformers/main_classes/configuration) - Read PreTrainedConfig common attributes (`vocab_size`, `hidden_size`, `num_attention_heads`, `num_hidden_layers`) and `from_pretrained` `revision` (branch, tag or commit id, default `main`). Use the saved `config.json` as the identity record beside the book config dumps.
- **Reference - Reference:** [Hugging Face Transformers - chat templates](https://huggingface.co/docs/transformers/chat_templating) - Read `apply_chat_template` with role and content dicts, the Mistral versus Zephyr control-token examples, and `add_generation_prompt` for starting an assistant reply. Compare the template output token count with the raw prompt count.
- **Support - Paper:** [Etalon: Holistic Performance Evaluation Framework for LLM Inference Systems](https://arxiv.org/html/2407.07000v2) - Read Sections 2.2, 3.1 and 4.1 with Algorithm 1 and Figures 1 to 3 for TTFT, TBT, TPOT, normalized latency, capacity and fluidity-index; Section 4.2 for black-box and capacity recipes; Section 5.1 for hourly runs over 24 hours and LMSys-Chat-1M medians (417 median, 1418 p90 prefill tokens).
- **Support - Paper:** [DistServe: Disaggregating Prefill and Decoding for Goodput-optimized LLM Serving](https://arxiv.org/html/2401.09670v3) - Read Section 1 with Figure 1 for per-GPU goodput: the highest request rate served while a target share of requests meets the TTFT and TPOT SLOs (13B model on one A100 reaches about 1.6 requests per second at 90% attainment).
- **Reference - Reference:** [Nano-vLLM tiny serving engine](https://github.com/GeeeekExplorer/nano-vllm/blob/bb823b3e06983d71485a8e1f23715ebd87d98ef8/nanovllm/engine/block_manager.py) - Read `nanovllm/engine/sequence.py` for request state, `scheduler.py` for waiting and running sets, `block_manager.py` for allocate, append, deallocate and prefix-hash reuse, `model_runner.py` for prefill and decode steps, and `llm_engine.py` for the generate path. Trace one request through these files only; do not adopt the engine for load measurement.
- **Support - Book:** [Inference Engineering](https://www.baseten.co/inference-engineering/) - Read Sections 1.4 to 1.4.2 for TTFT, TPS, percentiles and end-to-end versus inference-only time; Section 4.5 with 4.5.1 for benchmark dimensions, tooling and eval inputs; Section 6.1 for vision encoders, image tokens and longer-context effects.
- **Reference - Reference:** [Gil Tene - How NOT to Measure Latency (talk)](https://www.youtube.com/watch?v=lJ8ydIuPFeU) - Use for coordinated-omission vocabulary only: closed-loop testers that wait for each reply, the missing samples under queueing, and the correction concept of recording intended send time. Do not adopt `wrk`, `hey` or `ab`; write the small Python generator in the load-generator unit instead.

### Exit checkpoint

Trace successful, cancelled, timed-out and failed requests end to end, reconcile model and KV arithmetic with an observed baseline, and prove that the load generator preserves offered load and output semantics.

<details>
<summary>Deliberately left for later</summary>

- Kernel optimization before phase and workload baselines exist
- Fleet procurement and global demand forecasting
- Unsupported performance claims from analytical hardware estimates

</details>

## INF-2. Prefill, Decode and Baseline Measurement

**Why:** Prefill, decode, queueing and host work fail for different reasons. Phase-separated traces and correct asynchronous timing are required before any optimization claim is credible.

### Learn this much

- [ ] Prompt tokenization and request preprocessing _(Required)_
- [ ] Prefill attention and sequence parallelism _(Required)_
- [ ] Autoregressive decode dependency _(Required)_
- [ ] Decode matrix-vector-like shapes _(Required)_
- [ ] Compute-bound, bandwidth-bound and launch-bound regimes _(Required)_
- [ ] Capacity-bound and queue-bound regimes _(Required)_
- [ ] Arithmetic intensity and roofline position _(Required)_
- [ ] Batch size and sequence-shape effects _(Required)_
- [ ] Chunked prefill vocabulary and phase interference _(Required)_
- [ ] Queue, tokenize, schedule and host timing _(Required)_
- [ ] Model, sample, detokenize and stream timing _(Required)_
- [ ] Device synchronization and CUDA event semantics _(Required)_
- [ ] Warmup, compilation and graph-capture state _(Required)_
- [ ] Cold versus warm model and cache state _(Required)_
- [ ] Identical prompt, output-limit and stop contracts _(Required)_
- [ ] Greedy, seeded sampling and distributional comparison _(Required)_
- [ ] Single-request latency baseline _(Required)_
- [ ] Concurrency and request-rate sweeps _(Required)_
- [ ] Length and batch shape matrix _(Required)_
- [ ] Raw request timestamps and decode-gap records _(Required)_
- [ ] GPU memory, utilization and power context _(Required)_
- [ ] Repeated trials, variance and uncertainty _(Required)_
- [ ] Profiler ranges across the request lifecycle _(Required)_
- [ ] Queueing versus execution stall diagnosis _(Required)_
- [ ] Prediction before profile and residual explanation _(Required)_
- [ ] Measurement overhead and observer effects _(Required)_
- [ ] Goodput under explicit TTFT and TPOT targets _(Required)_
- [ ] Batch-invariant kernels and deterministic inference vocabulary _(Optional)_
- [ ] Tokenizer and detokenizer CPU flame graphs _(Optional)_
- [ ] Energy-normalized serving comparisons _(Optional)_
- [ ] Hardware-counter roofline residual analysis _(Depth)_
- [ ] Cross-provider benchmark publication _(Later)_

### Study units

#### U1. Prompt tokenization and preprocessing as request work

**About 3 h** · **Target:** Explain + Measure

Topics: Prompt tokenization and request preprocessing; Tokenizer and detokenizer CPU flame graphs

Tokenization runs on the host before the first device kernel, and detokenization runs between streamed tokens. A slow tokenizer looks exactly like slow prefill or ragged decode in a naive trace.

**You can now**

- Explain where prompt tokenization and detokenization sit in a serving request and why their cost lands in TTFT and streaming gaps.
- Measure tokenizer and detokenizer CPU time with a sampling flame graph and name the hottest functions.
- State the prompt lengths and conditions under which tokenization can be ignored in a baseline.

**Study**

1. [A CPU-bound tokenizer as the bottleneck](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapter 16, profiling and debugging inference) - Profiling, Debugging, and Tuning Inference Performance (pp. 959 to 964): the host-CPU-at-100-percent tokenization example and moving it to a GPU tokenizer or custom kernel. Depth: Read only the host-CPU tokenization example. Leave cache-hit tuning and tiered-cache sizing for the KV sections.
2. [Where tokenization enters TTFT](https://docs.vllm.ai/en/v0.31.0/design/metrics/) (vLLM Metrics Design and Production Metrics) - Frontend Stats Collection: `arrival_time` starts when tokenization begins, and TTFT is measured relative to it.
3. [CPU flame graphs with py-spy](https://github.com/benfred/py-spy) (py-spy - sampling profiler for Python) - README Usage: `py-spy record -o profile.svg -- python myprogram.py` for a flame graph, and `py-spy top` for the live view.

**Focus**

- Tokenization and detokenization are host work inside the request path. Tokenization adds to TTFT and scales with prompt length; detokenization adds to gaps between streamed tokens and scales with output length.
- vLLM starts the TTFT clock when tokenization begins, so tokenizer time is inside TTFT by definition, not beside it.
- A flame graph attributes host time to functions. Look for tokenizer encode and decode calls with regex or Python-loop frames, not device kernels.
- Ignoring tokenization is a stated assumption, not a default. It fails for long prompts, slow tokenizers and per-token detokenization in streaming.

**Reproduce:** Closed-book, draw the request path from arrival through tokenization, queue, prefill, first-token sampling and detokenization, and mark which spans vLLM counts in TTFT. Then profile a local tokenize and detokenize loop with py-spy record and name the two hottest frames.

**Traps**

- Reading TTFT as prefill time. TTFT includes queueing, tokenization, scheduling and host overhead around the prefill kernels.
- Profiling the tokenizer once with a cold import. Import and cache warmup dominate the first call, so profile steady-state calls on your prompt distribution.
- Detokenizing each token independently in analysis code. Streamed text uses incremental detokenization state, so naive per-token decoding can disagree with what the user saw.

**Practice**

- The section mini-project covers this: tokenizer and detokenizer spans in the request lifecycle trace, with a flame-graph attachment for the hottest host frame.

**Stop when:** You can point to the tokenizer span inside a TTFT trace and to the hottest tokenizer frame in your own flame graph, and state the prompt lengths where ignoring it stops being safe.

<details>
<summary>Self-test</summary>

1. Where does vLLM start the TTFT clock?
   - When tokenization begins on the frontend. Tokenizer time is inside TTFT by construction.
2. A flame graph shows most request-wall time in a Python regex function under prefill-heavy load. Is the prefill kernel slow?
   - There is no evidence for that. The host tokenizer or preprocessing is the bottleneck, and the device may be idle waiting for work.
3. When is it safe to ignore tokenization in a baseline?
   - Only when you measured it small against TTFT on your prompts, with the tokenizer, cache state and lengths recorded. Long prompts or per-token detokenization break the assumption.
4. Why launch the process under py-spy record instead of attaching to a running server with a process id?
   - Attaching to a process you did not start usually needs elevated permissions. Launching under py-spy record avoids that restriction.

</details>

#### U2. Prefill parallelism, the decode dependency and decode shapes

**About 4 h** · **Target:** Explain + Derive

Topics: Prefill attention and sequence parallelism; Autoregressive decode dependency; Decode matrix-vector-like shapes

Every phase-separated measurement in this section assumes this split. If you cannot say which work is parallel and which is forced sequential, no TTFT or TPOT number means anything.

**You can now**

- Explain why prefill exposes sequence parallelism while decode is sequential across generated tokens.
- Derive the per-step shapes of a decode step as matrix-vector-like work against a growing KV cache.
- Predict how prompt length and output length move prefill work versus decode steps.

**Study**

1. [Prefill parallelism and the decode dependency](https://proceedings.mlsys.org/paper_files/paper/2023/file/c4be71ab8d24cdfb45e3d06dbfca2780-Paper-mlsys2023.pdf) (Efficiently Scaling Transformer Inference) - Section 2.2, Inference Setup (p. 3): prefill as one forward pass parallel over batch and prompt tokens, decode as sequential forward passes with one new token each.
2. [Why decode cannot parallelize across time](https://proceedings.mlsys.org/paper_files/paper/2023/file/c4be71ab8d24cdfb45e3d06dbfca2780-Paper-mlsys2023.pdf) (Efficiently Scaling Transformer Inference) - Section 2.1 (p. 3): decode cannot batch across the sequence, and KV cache load per generated token grows with context and batch.
3. [Decode shapes: one row at a time](https://www.oreilly.com/library/view/hands-on-llm-serving/9798341621480/) (Hands-On LLM Serving and Optimization - Chapter 5 and the Chapter 4 metrics section) - Applying Arithmetic Intensity Analysis to the LLM Prefill and Decode Phases (pp. 183 to 185): Figure 5-16 with $`M = s`$ for prefill and $`M = 1`$ for decode. Depth: Use the shape argument and the regime verdicts only. Recompute the arithmetic-intensity numbers yourself: the printed formula drops parentheses and understates short-sequence values by about half.

**Focus**

- Treat the Two regimes: prefill and decode unit as read. This unit adds the per-step shapes and the serving measurement consequences.
- Prefill processes all prompt tokens together, so its work grows with prompt length but parallelizes across the sequence. Decode produces one token per step because each token needs the previous one.
- A decode step loads the full weight set plus the whole KV cache to produce one token and append one entry: matrix-vector-like shapes with almost no reuse.
- The KV cache turns quadratic recomputation into linear per-step reads. Without it, each decode step would rescan the full prefix.

**Reproduce:** Closed-book, write the dependency chain for generating four tokens from a prompt, stating what each step reads and appends. Then solve the TensorTonic uniform two-position public case by hand to get output `[[[4]]]`.

**Traps**

- Calling decode compute-bound because the model is large. A decode step loads weights and cache for one token, so size raises the bytes moved, not the reuse.
- Assuming prefill cost repeats per token. Prefill runs once; decode steps each read the cache but never redo the full prompt pass.
- Treating batching as parallelism across time. Batching parallelizes across requests; the output steps of one request stay sequential.

**Practice**

- [TensorTonic: Decode Attention with a KV Cache](https://www.tensortonic.com/problems/cs336-l10-kv-cache-decode-step) - Implement `kv_cache_decode_step`; the public cases check cache extension, uniform two-position attention and two query heads sharing one KV head. Solve the public cases by hand first, then implement. The grouped-query head mapping is the bridge to the attention-variant units.

**Stop when:** You derive the decode-step shapes without notes and your `kv_cache_decode_step` passes all public cases.

<details>
<summary>Self-test</summary>

1. Why can prefill use large matrix multiplies while decode cannot?
   - Prefill holds all prompt tokens at once, so the multiply has $`M = s`$ rows. Decode holds one new token because each token depends on the previous one, so $`M = 1`$.
2. What does one decode step read?
   - The full weight set once plus the KV cache for all cached positions, to produce one token and append one entry.
3. In the TensorTonic public case with query 0 and keys 1 and 2, why is the output 4?
   - Both scores are 0, so the weights are 0.5 and 0.5. Then $`0.5 \times 2 + 0.5 \times 6 = 4`$.
4. A batch holds 8 requests that each generate 50 tokens. How many sequential steps does each request need?
   - 50. Batching does not shorten any single request's dependency chain.

</details>

#### U3. Compute, bandwidth, launch, capacity and queue-bound regimes

**About 5 h** · **Target:** Derive + Measure

Topics: Compute-bound, bandwidth-bound and launch-bound regimes; Capacity-bound and queue-bound regimes; Arithmetic intensity and roofline position

Regime classification is the prediction half of this section's checkpoint. Every later claim about a stall or a speedup is checked against the regime you declared first.

**You can now**

- Derive arithmetic intensity for a matmul and place prefill and decode work on a roofline for your GPU.
- Explain the compute, bandwidth, launch, capacity and queue-bound regimes and how batching moves each boundary.
- Predict the bottleneck for short and long prompts with small and large batches before profiling.

**Study**

1. [Roofline and arithmetic intensity, recomputed](https://www.oreilly.com/library/view/hands-on-llm-serving/9798341621480/) (Hands-On LLM Serving and Optimization - Chapter 5 and the Chapter 4 metrics section) - Boundaries of GPU Compute and Memory Bandwidth (pp. 178 to 180), Arithmetic Intensity in Matrix Multiplications (pp. 181 to 183) and Applying Arithmetic Intensity Analysis to the LLM Prefill and Decode Phases (pp. 183 to 185). Depth: Recompute Table 5-9 and Table 5-10 with the parenthesized formula $`M N K / (M K + K N + M N)`$. The printed formula omits the parentheses and its last denominator term is wrong: at $`h = 4096`$ the correct prefill values are about 62 and 410 for $`s = 64`$ and $`s = 512`$, and the correct decode value is about 1.0, not 0.5. The verdicts are unchanged.
2. [Cost, MFU and the latency trade-off](https://proceedings.mlsys.org/paper_files/paper/2023/file/c4be71ab8d24cdfb45e3d06dbfca2780-Paper-mlsys2023.pdf) (Efficiently Scaling Transformer Inference) - Section 2.1 (p. 3) and Section 4.4 with Tables 2 and 3 (pp. 9 to 10): small batches give low latency at worse MFU and higher cost, and the low-latency versus high-throughput configurations.
3. [Small batches and the launch floor](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapter 16, profiling and debugging inference) - Inference Troubleshooting Recipes with Table 16-1 (pp. 973 to 978): the below-50-percent-SM-utilization small-batch row, which prescribes larger batches and fused kernels before reaching for the profiler.
4. [The saturation knee](https://github.com/patchy631/time-to-first-token) (Time to First Token - Measurement and Load-Testing Sessions) - Week 5: the concurrency sweep at 1, 2 and 4 up to 128, and the knee where throughput saturates while latency degrades.

**Focus**

- Arithmetic intensity is FLOPs per byte moved. The ridge is peak FLOPs per second divided by peak bytes per second, and work below it is bandwidth-bound.
- Prefill intensity grows with sequence length while decode intensity stays near 1 FLOP per byte at any length. At very small shapes time stops falling with bytes: that flat floor is the launch-bound regime.
- Batching raises intensity by reusing each weight load across requests, which moves the bandwidth boundary but never removes the sequential decode chain.
- Capacity-bound means the KV cache does not fit, so the batch or the lengths must shrink. Queue-bound means waiting requests grow while the device stays busy. Diagnose both from KV-cache usage and waiting counts, not from kernel timings or memory used.

**Reproduce:** Closed-book, derive $`\text{AI} = M N K / (M K + K N + M N)`$ for a matmul, evaluate it for $`M = s`$ and $`M = 1`$ at $`h = 4096`$ and $`s = 64`$, and place both points against your GPU's ridge and against 419 FLOPs per byte, the book's L40S example.

**Traps**

- Quoting the book's Table 5-10 decode value of 0.5. The printed denominator is wrong and the correct value is about 1.0. Both sit far below any GPU ridge, so the verdict stands but the number does not.
- Comparing intensities across precisions or tokenizers without restating units. Bytes per element and tokens per request change the numbers, so a ratio without its setup is not comparable.
- Naming a regime from memory used. vLLM preallocates its KV pool, so read `vllm:kv_cache_usage_perc`: near full with preemptions is capacity-bound, a busy device with a growing queue is queue-bound, and an idle device with a growing queue points at admission limits or host overhead.

**Practice**

- [100 Days of Inference Day 06: Ops-Byte Ratio and Roofline](https://github.com/elizabetht/100-days-of-inference/blob/main/day06/ops-byte-ratio.ipynb) - Run the roofline plot and the attention arithmetic-intensity cells for your GPU; reproduce the $`N = 4096`$, $`d = 128`$ example at about 31 ops per byte and sweep batch size to the compute-bound crossover. The notebook's attention accounting follows its book's model. Check it against your matmul derivation rather than treating it as a measured result.

**Stop when:** Your hand-derived intensities match the corrected table values, and your roofline plot puts prefill and decode on opposite sides of the ridge for a long prompt.

<details>
<summary>Self-test</summary>

1. What are the units of arithmetic intensity and of the roofline ridge?
   - FLOPs per byte for intensity. The ridge is peak FLOPs per second divided by peak bytes per second, also FLOPs per byte.
2. At $`h = 4096`$ on the book's L40S ridge of 419, which corrected Table 5-10 prefill values are compute-bound?
   - Only $`s = 4096`$ at about 1365. The corrected 62 at $`s = 64`$ and 410 at $`s = 512`$ are still bandwidth-bound, as is decode at about 1.0.
3. Why does batching move the bandwidth boundary?
   - One weight load serves $`B`$ tokens instead of one, so FLOPs per byte rise with $`B`$ while the sequential steps per request stay fixed.
4. How do you tell capacity-bound from queue-bound without a profiler?
   - Capacity-bound shows KV-cache usage near full with preemptions or a capped running batch. Queue-bound shows waiting requests growing while the device stays busy. Check `vllm:kv_cache_usage_perc` and `vllm:num_requests_waiting`.

</details>

#### U4. Batch size, sequence shape, chunked prefill and phase interference

**About 4 h** · **Target:** Derive + Measure

Topics: Batch size and sequence-shape effects; Chunked prefill vocabulary and phase interference

Batching is the main lever on serving cost, and naive batching taxes decode latency. Chunked prefill exists because one long prompt once stalled every other request on the server.

**You can now**

- Explain how batch size and sequence shape move work between bandwidth-bound and compute-bound execution.
- Explain chunked prefill and how unchunked prefills stall ongoing decodes.
- Predict the interference a long-prompt request inflicts on concurrent decode streams.

**Study**

1. [Chunked prefill and stall-free batching](https://arxiv.org/abs/2403.02310) (Taming Throughput-Latency Tradeoff in LLM Inference with Sarathi-Serve) - Sarathi-Serve arXiv:2403.02310v3, Section 4 Design and Implementation: 4.1 Chunked-prefills, 4.2 Stall-free batching and 4.3 Determining Token Budget; the prefill-prioritizing schedule that stalls ongoing decodes as the negative example. Depth: Skip the pipeline-parallel sections and the Evaluation capacity numbers. Treat the reported capacity gains as the paper's result on its hardware, not as your target.
2. [Batch size moves the bottleneck](https://proceedings.mlsys.org/paper_files/paper/2023/file/c4be71ab8d24cdfb45e3d06dbfca2780-Paper-mlsys2023.pdf) (Efficiently Scaling Transformer Inference) - Section 4.1 with Figures 6 and 7 (p. 8): decode stays on the stationary layout while prefill switches layout by tokens per batch.
3. [Chunked prefill as the preemption fix](https://github.com/patchy631/time-to-first-token) (Time to First Token - Measurement and Load-Testing Sessions) - Week 5 decision point: when TTFT spikes and waiting requests climb before the target concurrency, stop and tune `--max-num-seqs`, `--gpu-memory-utilization` and chunked prefill first.

**Focus**

- A batch mixes prefill tokens and decode tokens in one iteration. Prefill tokens bring large parallel work; decode tokens bring one step each with their full cache reads.
- An unchunked long prefill occupies iterations that ongoing decodes also need, so their inter-token gaps spike. Chunked prefill splits the prompt into near-equal chunks that fit beside decodes.
- The token budget caps prefill tokens per iteration. A smaller budget protects decodes but stretches the new request's TTFT: that trade-off is the whole design.
- Splitting is not free. Each chunk's attention rereads the KV cache of all earlier chunks, and small chunks run at lower GPU utilization; Section 4.3 and the Overhead of chunked-prefills ablation (Section 5.4.1) show the cost.

**Reproduce:** Closed-book, sketch one iteration with a 4000-token prefill joining ten ongoing decodes, then the same arrival under a 512-token chunk budget, and state which requests slow down in each case and why.

**Traps**

- Assuming bigger batches always help both phases. Bigger batches raise throughput but an admitted long prefill still stalls the decodes it shares iterations with.
- Treating the chunk budget as a latency knob for the new request only. The budget sets every concurrent decode's worst gap too.
- Reading the paper's capacity multiples as expected gains. They hold for the paper's models, hardware and tail-latency constraints; your matrix decides yours.

**Practice**

- [Hands-On LLM Serving companion: batching with vLLM](https://github.com/orca3/llm-model-inference/blob/main/ch02/ch2_Batching.ipynb) - Run the cell that times the four listed prompts as one vLLM batch against the same prompts one by one, then add per-request timing yourself; the notebook records only the two totals. The notebook compares batched with one-by-one generation, not chunked prefill. Use it for batch-size effects and read chunking in Sarathi-Serve.

**Stop when:** You can predict, before running, whether a new arrival stalls concurrent decodes at a given chunk budget, and your batching measurements agree.

<details>
<summary>Self-test</summary>

1. Why does one long prompt hurt ongoing decodes under prefill-prioritizing scheduling?
   - Its full prefill occupies whole iterations, so decode steps wait. The waits appear as inter-token gaps on unrelated requests.
2. What does chunked prefill change about that iteration?
   - Only one chunk of the prompt joins each iteration, bounded by the token budget, so decodes keep making progress every iteration.
3. What does a smaller token budget cost?
   - The new request's prefill spreads over more iterations, so its TTFT grows. Decode protection is paid in prefill latency.
4. Decode batch grows from 1 to 32 at fixed lengths. What happens to per-step time and to tokens per second?
   - Per-step time rises sublinearly while weight reuse climbs, so tokens per second rise until the work turns compute-bound or hits capacity.

</details>

#### U5. Decomposing TTFT and decode steps into their components

**About 4 h** · **Target:** Implement + Measure

Topics: Queue, tokenize, schedule and host timing; Model, sample, detokenize and stream timing

A single TTFT number cannot tell queueing from execution. Decomposition is what turns a slow request into a named part you can fix.

**You can now**

- Decompose TTFT and per-token latency into queue, tokenize, schedule, host, model, sample, detokenize and stream parts.
- Implement per-request instrumentation that attributes each part without changing outputs.
- Read a slow request's spans and name the part to fix first.

**Study**

1. [The five intervals behind every request](https://docs.vllm.ai/en/v0.31.0/design/metrics/) (vLLM Metrics Design and Production Metrics) - Engine Core Events with Interval Calculations: QUEUED, SCHEDULED, PREEMPTED and NEW_TOKENS events with the queue, prefill, decode, inference and inter-token intervals; Frontend Stats Collection for `arrival_time` and end-to-end latency.
2. [TTFT, ITL and end-to-end definitions](https://www.oreilly.com/library/view/hands-on-llm-serving/9798341621480/) (Hands-On LLM Serving and Optimization - Chapter 5 and the Chapter 4 metrics section) - Latency Metrics (pp. 150 to 151): Figure 4-9 with TTFT as prefill work, ITL as decode work, and the end-to-end formula over $`N`$ generated tokens. Depth: Use the definitions and the final simplified forms. The printed ITL middle expression with a subtracted detokenization term is garbled; read it as one decode step plus its detokenization.
3. [Bench-side TTFT, ITL and TPOT](https://docs.vllm.ai/en/v0.31.0/benchmarking/cli/#understanding-the-latency-metrics) (vLLM Benchmark CLI (v0.31.0)) - Understanding the Latency Metrics: bench-side TTFT, per-gap ITL and per-request TPOT with the speculative-decoding bundled-tokens example.

**Focus**

- Engine-side intervals and bench-side metrics differ by construction. The engine measures queue, prefill and decode between core events; the bench measures TTFT, gaps and TPOT at the client, including network and streaming.
- ITL records each gap between streamed outputs, while TPOT amortizes one request's decode time over its tokens. They agree when each streamed output holds one token and diverge when one output bundles several tokens.
- Sampling, detokenization and streaming sit after the last model kernel of each step. A ragged gap series with fast kernels points at these parts, not at attention.
- Preemption re-enters the intervals: a preempted request restarts prefill, so its TTFT and decode spans include the repeated work.

**Reproduce:** Closed-book, write the engine events and the five intervals for a request that queue-waits, prefills, decodes three tokens and finishes, then state the bench-side TTFT, the three ITL samples and the TPOT for $`N = 4`$ output tokens.

**Traps**

- Averaging ITL samples across requests with different output lengths and calling it TPOT. Mean of gaps weights long requests more; per-request TPOT weights requests equally.
- Comparing engine prefill time with bench TTFT directly. TTFT adds queueing, tokenization, network and streaming around the engine spans.
- Trusting TPOT for single-token requests. vLLM records zero TPOT when there is at most one output token, and bench statistics exclude those requests.

**Practice**

- The section mini-project covers this: per-request queue, prefill, first-token, decode-step, sampling, streaming and completion spans with one worked slow-request trace.

**Stop when:** Given any slow request, you split its latency into spans from events you instrumented and name the dominant part with evidence.

<details>
<summary>Self-test</summary>

1. A request generates 5 tokens with TTFT 100 ms and end-to-end 180 ms. What is its TPOT, and how many ITL samples does the bench record?
   - TPOT is $`(180 - 100) / (5 - 1) = 20`$ ms per token. The bench records 4 ITL gap samples.
2. With speculative decoding, one streamed output carries three tokens after a 40 ms gap. How do ITL and TPOT treat those tokens?
   - ITL records one 40 ms gap and adds no zero gaps for the bundled tokens. TPOT divides the request's decode time over all three tokens.
3. Queue time dominates a slow TTFT while prefill time is flat. What do you fix first?
   - Admission, scheduling or load, not kernels. The model execution is fine; the request waited.
4. Why can two runs of the same prompt show different TTFT with identical prefill time?
   - TTFT includes queueing, tokenization, scheduling and host overhead, which vary with server state even when the kernels do not.

</details>

#### U6. Device synchronization, warmup, compilation and cold versus warm state

**About 4 h** · **Target:** Explain + Measure

Topics: Device synchronization and CUDA event semantics; Warmup, compilation and graph-capture state; Cold versus warm model and cache state

Asynchronous launch makes naive timers measure submission, not execution. Every timing in this section stands or falls on synchronization and warm state.

**You can now**

- Explain why host timers need device synchronization and what stream-ordered event semantics guarantee.
- Separate warmup, compilation and graph-capture state from steady-state timing.
- Design a cold-versus-warm comparison that fixes model, cache and workload state.

**Study**

1. [Event and stream semantics with phase ranges](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapter 16, profiling and debugging inference) - Profiling with Nsight Systems and Nsight Compute (pp. 969 to 973): per-stream naming, NVTX Prefill and Decode step ranges, and the tightest scope around encode.
2. [Machine-state control before any timing](https://nvidia.github.io/TensorRT-LLM/developer-guide/perf-benchmarking.html) (TensorRT-LLM Benchmarking Guide) - Before Benchmarking: persistence mode with `sudo nvidia-smi -pm 1`, clock reset with `sudo nvidia-smi -rgc`, power limits and boost settings (page read 2026-10-05).
3. [Cache-state control for latency runs](https://docs.vllm.ai/en/v0.31.0/benchmarking/cli/) (vLLM Benchmark CLI (v0.31.0)) - Online Benchmark warning on prefix-cache reuse across repeated runs, with varying the seed, restarting the server or resetting caches between runs.

**Focus**

- Treat the Timed boundaries, asynchronous launch and event timing unit and the Warmup, compilation, allocator and cache state unit as read. This unit applies them to serving runs.
- Kernel launches return before the work finishes. A host timer without synchronization measures queueing into the driver, and only stream-ordered events or a synchronize call bracket the device work.
- First runs include compilation, graph capture, allocator setup and cold caches. Warm every shape you will time, then discard the warmup before recording.
- Cold versus warm is a comparison of stated states: weights resident or not, compilation and graphs captured or not, allocator settled or not, prefix cache empty or populated, clocks settled or not. Name all five before quoting either number.

**Reproduce:** Closed-book, list the five warm states that a first vLLM request passes through before steady state, and write the synchronized timing pattern that brackets one decode step without including queue submission.

**Traps**

- Timing a range that includes the first-ever request and calling it the baseline. Compilation and capture dominate it; it is a startup measurement, not a serving one.
- Reusing prompts across repeated latency runs with prefix caching on. Later runs hit the cache and look faster without any real change.
- Comparing a cold run at settled clocks with a warm run after thermal throttling started. Clocks and temperature are part of the state; record both.

**Practice**

- [Hands-On LLM Serving companion: run Qwen with vLLM versus transformers](https://github.com/orca3/llm-model-inference/blob/main/ch02/ch2_Run_LLM_With_vLLM.ipynb) - Run the vLLM timing cell and the transformers timing cell; add one warmup call before each timer and report steady-state versus first-call latency. The notebook does not warm up or synchronize. Add the warmup run yourself and state which number is cold.

**Stop when:** Your warmed timings are stable across repeats, your cold-versus-warm gap names its five states, and no first-run artifact remains in the baseline.

<details>
<summary>Self-test</summary>

1. Why does an unsynchronized host timer under-report GPU work?
   - Launches are asynchronous, so the timer stops at submission. The device work continues after the host proceeds.
2. What does a stream-ordered event pair guarantee that a host timer does not?
   - It timestamps when the stream reaches each event on the device, so the interval covers the device work enqueued between them, not the host's submission time. It still includes idle gaps if the host enqueues slowly, and other streams can slow the work it brackets.
3. Which states must a warmup cover before a latency baseline?
   - Model weights resident, compilation and graph capture done, allocator settled, caches at their declared state, and clocks settled. Time only after all of them.
4. Two latency runs differ only in that the second reuses the first run's prompts. What explains a faster second run?
   - Prefix-cache hits from the first run's KV blocks, not faster execution. Vary the seed or reset the server for a clean comparison.

</details>

#### U7. Identical output contracts, seeded sampling and distributional comparison

**About 4 h** · **Target:** Explain + Implement

Topics: Identical prompt, output-limit and stop contracts; Greedy, seeded sampling and distributional comparison; Batch-invariant kernels and deterministic inference vocabulary

Comparisons with different outputs compare different amounts of work. Fixed prompts plus fixed sampling are what make two timings comparable at all.

**You can now**

- Fix identical prompts, output limits, stop behavior and cache state before any timing comparison.
- Implement greedy and seeded-sampling comparisons, including a distributional check for sampled outputs.
- Explain why batch invariance and determinism are vocabulary to verify, not guarantees to assume.

**Study**

1. [The sampling contract in one class](https://docs.vllm.ai/en/v0.31.0/api/vllm/sampling_params/) (vLLM SamplingParams API (v0.31.0)) - SamplingParams attributes with defaults: `temperature` at 1.0 with 0 meaning greedy, `seed` at None, `max_tokens` at 16, `ignore_eos` at False, and `stop` with `stop_token_ids`.
2. [Fixed workloads and sampling flags](https://docs.vllm.ai/en/v0.31.0/benchmarking/cli/) (vLLM Benchmark CLI (v0.31.0)) - Running With Sampling Parameters with the temperature, top-p and top-k example.
3. [The fairness checklist](https://github.com/patchy631/time-to-first-token) (Time to First Token - Measurement and Load-Testing Sessions) - Before-you-publish checklist: fixed input and output lengths, p50 with p95 and p99, TTFT and ITL kept separate, pinned versions with exact commands.

**Focus**

- Build on the Proving the cache correct unit: token identity plus a logits tolerance is the correctness gate, and this unit adds the serving comparison contract around it.
- Greedy means `temperature=0` exactly: vLLM clamps any positive value below 1e-2 up to 1e-2. Sampled comparisons run many requests over a fixed list of seeds on both sides and compare output distributions, not single outputs.
- Output limits and stop strings change the amount of work. Fix `max_tokens`, `ignore_eos`, `stop` and `stop_token_ids` identically, or the faster run may simply have generated less.
- Batch sizes, kernel paths and cache states can move outputs and timings. State them in the contract and re-verify identity whenever any of them changes.

**Reproduce:** Closed-book, write the full comparison contract for two engine settings: identical prompts, `SamplingParams(temperature=0)` for the greedy gate and `SamplingParams(temperature=0.8, seed=s)` over a fixed seed list for the sampled check, fixed `max_tokens` and `stop` behavior, and declared cache state. Then show greedy token identity across reruns and distributional agreement across the seed list.

**Traps**

- Assuming the bench seed fixes engine sampling. `vllm bench serve --seed 0` samples the dataset; engine sampling needs its own `seed` in `SamplingParams(temperature=0.8, seed=1)` or the server `vllm serve --seed 1` argument.
- Comparing a run that stopped early on EOS with one that ran to the token limit. Different output counts mean different decode work, not different speed.
- Claiming determinism from one identical rerun. Greedy identity needs repeats across the batch sizes and cache states you will actually compare.

**Practice**

- The section mini-project covers this: the identical-output gate every timing comparison must pass, with fixed prompts, limits, stop behavior, seed and cache state.

**Stop when:** Any two timings you compare share a written contract, greedy reruns are token-identical under it, and sampled reruns agree distributionally.

<details>
<summary>Self-test</summary>

1. Why must `max_tokens` and stop behavior match before comparing TPOT?
   - They set how many decode steps run. A shorter output does fewer steps, so its TPOT can differ without any execution change.
2. How do you compare two sampled configurations without requiring identical tokens?
   - Run many requests per configuration over the same list of seeds and compare output distributions, such as length or score histograms, with identical prompts, limits and cache state.
3. Greedy outputs match at batch size 1 but differ at batch size 8. What broke?
   - The comparison contract. A kernel path, scheduling or cache behavior changed with batch size, so identity must be re-established there, not assumed.
4. What does vLLM do with a small positive temperature below 1e-2?
   - It warns and clamps it up to 1e-2. Use exactly 0 for greedy and a fixed seed for reproducible sampling.

</details>

#### U8. Single-request baselines, concurrency and rate sweeps, and a shape matrix

**About 5 h** · **Target:** Measure

Topics: Single-request latency baseline; Concurrency and request-rate sweeps; Length and batch shape matrix

One prompt at one concurrency is an anecdote. Sweeps over rate and shapes turn it into a baseline that later changes can be tested against.

**You can now**

- Measure a single-request latency baseline with fixed lengths, warmup and raw per-request results.
- Sweep concurrency and request rate through saturation and report the knee, not the collapse.
- Cover a length-by-batch shape matrix with the workload contract fixed in every cell.

**Study**

1. [Phase and endpoint baselines with the bench CLI](https://docs.vllm.ai/en/v0.31.0/benchmarking/cli/) (vLLM Benchmark CLI (v0.31.0)) - Online Benchmark with the vllm bench serve example and its Serving Benchmark Result format; Offline Throughput Benchmark with the vllm bench throughput example; Load Pattern Control Parameters for request-rate, burstiness and max-concurrency.
2. [Sweeps to the knee and past it](https://github.com/patchy631/time-to-first-token) (Time to First Token - Measurement and Load-Testing Sessions) - Week 5: the concurrency sweep at 1, 2 and 4 up to 128 with two-tool cross-checks, the session past 1000 concurrent runs, and the preemption-point decision rule.
3. [Synthetic datasets with fixed shapes](https://nvidia.github.io/TensorRT-LLM/developer-guide/perf-benchmarking.html) (TensorRT-LLM Benchmarking Guide) - Preparing a Dataset with the `task_id`, `prompt` or `input_ids` and `output_tokens` schema, and the `token-norm-dist` synthetic example at input mean 128 with output mean 128 (page read 2026-10-05).

**Focus**

- The single-request cell comes first and stays fixed: one prompt shape, warmed state, identical-output contract, raw per-request results kept.
- Sweep one variable at a time: concurrency with fixed rate, then rate with fixed concurrency. The knee where throughput stops rising while latency degrades is the result; points past preemption are not publishable.
- Every matrix cell fixes input length, output length, batch size, sampling and cache state. A cell that changes two of them explains nothing.
- Keep TTFT and ITL separate in every cell and every sweep. Blended latency hides whether the limit is prefill, decode or queueing.

**Reproduce:** Closed-book, write the sweep plan for your model: the single-request cell, the concurrency ladder, the request-rate ladder, and three shape-matrix cells with every fixed field named. Then run the single-request cell with `vllm bench latency --input-len 32 --output-len 128 --batch-size 1`.

**Traps**

- Measuring at the preemption point and reporting it as capacity. When waiting requests climb and TTFT spikes, stop and tune admission and chunking first.
- Sweeping with uniform synthetic lengths and claiming production coverage. Fixed shapes give comparability, but real distributions still need their own run.
- Changing output length across cells to save time. Shorter outputs do less decode work, so the cells are no longer comparable.

**Practice**

- The section mini-project covers this: the sweep harness with the single-request cell, the concurrency and rate ladders, and the shape matrix with raw results per cell.

**Stop when:** Your matrix reruns cell-for-cell with identical contracts, and you can point to the knee in your own sweep data.

<details>
<summary>Self-test</summary>

1. What makes the single-request baseline a baseline rather than an anecdote?
   - Fixed lengths, warmup, the identical-output contract and retained raw results, so any later change can rerun the same cell.
2. Throughput flattens while p99 climbs steeply with concurrency. Where are you?
   - At the saturation knee. Report the knee; further points measure overload behavior, not serving capacity.
3. Why sweep rate and concurrency separately instead of together?
   - They stress different limits: rate stresses arrivals and queueing, concurrency stresses resident batch and memory. Joint sweeps confound them.
4. What does vllm bench latency fix that vllm bench serve leaves open?
   - Latency runs one fixed batch of fixed input and output lengths for phase timing. Serve replays arrivals over time for endpoint behavior under load.

</details>

#### U9. Raw timestamps, decode gaps, and memory, utilization and power context

**About 3 h** · **Target:** Measure

Topics: Raw request timestamps and decode-gap records; GPU memory, utilization and power context; Energy-normalized serving comparisons

Summaries hide the gaps and stalls that explain tails. Raw records plus resource context are what let you or anyone else re-analyze a run.

**You can now**

- Retain raw per-request timestamps and per-token decode gaps instead of summary statistics.
- Record memory, utilization and power beside every timing run.
- Normalize energy comparisons per accepted token and state what the meter actually measures.

**Study**

1. [Histograms and counters worth keeping](https://docs.vllm.ai/en/v0.31.0/design/metrics/) (vLLM Metrics Design and Production Metrics) - v1 Metrics with the TTFT, inter-token, per-request TPOT, end-to-end, prefill, decode and queue histograms (`vllm:time_to_first_token_seconds`, `vllm:inter_token_latency_seconds`, `vllm:request_time_per_output_token_seconds`, `vllm:e2e_request_latency_seconds`, `vllm:request_prefill_time_seconds`, `vllm:request_decode_time_seconds`, `vllm:request_queue_time_seconds`); Metrics Publishing - Logging with the 5-second summary; Prefix Cache metrics with hits and queries as counters.
2. [Per-request result files](https://docs.vllm.ai/en/v0.31.0/benchmarking/cli/) (vLLM Benchmark CLI (v0.31.0)) - Custom Dataset example with save-result, save-detailed and result-dir; Results Visualization with the timeline and dataset-statistics plots.
3. [Resource context beside every run](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapter 16, profiling and debugging inference) - Monitoring System Metrics and Counters (pp. 964 to 969): the Prometheus and Grafana stack with SM busy, memory used, copy-engine, link throughput, temperature, power and per-node request metrics.
4. [A monitoring bundle you can run](https://github.com/cfregly/ai-performance-engineering/blob/main/code/ch16/monitoring_bundle.py) (AI Systems Performance Engineering companion code - Chapter 16) - `monitoring_bundle.py` writing the Prometheus scrape, recording-rule, alert and Grafana files; `monitoring_config.py` for the TTFT, prefill, decode and KV thresholds. Depth: Use the bundle as scaffolding for your own dashboard. Re-measure every bundled threshold on your device instead of adopting it, and check its metric names against v0.31.0 first: `vllm:time_per_output_token_seconds` and `vllm:gpu_cache_usage_perc` are now `vllm:inter_token_latency_seconds` and `vllm:kv_cache_usage_perc`, and `vllm:cudagraph_mode_info` does not exist.

**Focus**

- Keep arrival, first-token and per-token completion timestamps per request, plus the decode gaps between them. Percentiles are computed from these records, never stored instead of them.
- Resource context means GPU memory used, utilization, copy-engine activity, power and temperature with timestamps aligned to the requests. A timing without its context is not re-analyzable.
- Report memory in stated units with the dtype and configuration beside it. Gigabytes and gibibytes differ by about 7 percent, which exceeds many claimed wins.
- Energy comparisons divide measured joules by accepted tokens under the same quality gate. Name the meter, its sampling interval and whether it covers the host or only the device.

**Reproduce:** Closed-book, list the raw fields one request record needs for full re-analysis: arrival, queue, prefill, per-token and completion timestamps with prompt and output lengths, plus the aligned memory, utilization and power samples.

**Traps**

- Keeping only mean latency and throughput. Means hide gaps, stalls and tails; the per-token record is the evidence.
- Quoting memory without units or dtype. A 14 GB weight total at 2 bytes per parameter is decimal gigabytes; mixing in gibibytes silently moves every capacity claim.
- Comparing energy per token across runs with different output acceptance. Rejected or truncated outputs still cost energy; normalize by accepted tokens.

**Practice**

- The section mini-project covers this: raw arrival and completion records with decode gaps, aligned resource context, and the energy-per-accepted-token accounting.

**Stop when:** A stranger can recompute your percentiles, gaps and energy numbers from your stored records plus stated units and meter boundaries.

<details>
<summary>Self-test</summary>

1. Why keep per-token gaps when you already store TPOT per request?
   - TPOT averages one request's decode time. Gaps show where stalls landed, which requests interfered, and what the tail is made of.
2. A run reports 14 GB model memory. What must accompany that number?
   - The unit convention, the parameter count with bytes per parameter, and the configuration. Without them the number cannot be checked.
3. Two servers report the same tokens per joule. One meter covers the device, the other the whole host. Comparable?
   - No. State the meter boundary and sampling interval first; host power includes work the device meter never sees.
4. Where do prefix-cache hits and queries belong in the raw record?
   - As counters beside the requests, so hit rate is computed per interval. Storing only the rate loses the query volume behind it.

</details>

#### U10. Repeated trials, uncertainty and observer overhead

**About 3 h** · **Target:** Measure

Topics: Repeated trials, variance and uncertainty; Measurement overhead and observer effects

One fast run proves nothing, and a heavy observer changes the result. Trials plus overhead accounting are what make a baseline trustworthy.

**You can now**

- Run repeated interleaved trials and report uncertainty instead of single-shot means.
- Quantify observer overhead from metrics, logging and profiling, and keep it out of the critical path.
- Reuse the validated load generator so arrivals do not change between trials.

**Study**

1. [Repeated sweeps with two-tool cross-checks](https://github.com/patchy631/time-to-first-token) (Time to First Token - Measurement and Load-Testing Sessions) - Week 5 deliverable: the scripted concurrency sweep past 1000 concurrent runs cross-checked by two tools, with p50, p95 and p99 throughout.
2. [Observer overhead and where metrics live](https://docs.vllm.ai/en/v0.31.0/design/metrics/) (vLLM Metrics Design and Production Metrics) - Metrics Collection on moving bookkeeping out of the engine core into the frontend; KV Cache Residency Metrics with sampling keeping the overhead tiny.

**Focus**

- Use the interleaved-trial discipline from the Interleaved trials, raw samples and uncertainty unit: alternate conditions, seed the order, keep raw samples and report uncertainty, not just means.
- Metrics, logging and tracing cost time and memory. Measure with the observer on and off, and sample expensive telemetry instead of recording everything.
- Cross-check with a second tool before believing a number. Two harnesses that agree rule out harness bugs that repeats of one harness never catch.
- Arrivals are part of the trial. Reuse the validated open- and closed-loop load generator so arrivals from `vllm bench serve --request-rate 4 --burstiness 1.0 --seed 0` stay fixed while you vary the engine.

**Reproduce:** Closed-book, design a three-trial interleaved comparison of two chunk budgets: the trial order, the raw samples kept, the uncertainty reported, and the observer-on versus observer-off check.

**Traps**

- Averaging ratios across trials with an arithmetic mean. It is asymmetric, since the mean of A/B is not the inverse of the mean of B/A; report the ratio of aggregates or the geometric mean of per-trial ratios with uncertainty.
- Profiling every trial. Full traces on all repeats inflate overhead and disk use; profile one localized case after trials establish the effect.
- Changing the arrival process between trials. A different burstiness or seed moves queueing, which then masquerades as an engine difference.

**Practice**

- The section mini-project covers this: repeated interleaved trials with raw samples and uncertainty, the two-tool cross-check, and the observer overhead measurement.

**Stop when:** Every number you quote carries its trials, its uncertainty and its observer check, and a second tool agrees.

<details>
<summary>Self-test</summary>

1. Why interleave trials instead of running all of condition A then all of B?
   - Interleaving spreads slow drifts in temperature, clocks and background load across both conditions instead of confounding them with the condition.
2. How do you show the observer did not distort a result?
   - Run the same trials with the observer on and off, or with sampling on and off, and show the effect is unchanged within uncertainty.
3. Two tools disagree on TPOT for the same workload. What first?
   - Check definitions and measurement points: per-gap ITL versus per-request TPOT, client versus engine clocks, and included versus excluded single-token requests.
4. When is a single trial enough?
   - For a correctness gate or a smoke check, never for a performance claim. Claims need repeats with uncertainty.

</details>

#### U11. Profiler ranges across the lifecycle and queueing versus execution stalls

**About 4 h** · **Target:** Measure

Topics: Profiler ranges across the request lifecycle; Queueing versus execution stall diagnosis

Profiles show where time went. Only the queue-versus-execution split says whether to fix scheduling or kernels.

**You can now**

- Place profiler ranges across encode and decode steps and read prefill versus decode work off a systems timeline.
- Distinguish queueing stalls from execution stalls using queue time, phase intervals and scheduler state.
- Explain one failed bottleneck hypothesis from synchronized trace evidence.

**Study**

1. [Timelines with phase ranges](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapter 16, profiling and debugging inference) - Profiling with Nsight Systems and Nsight Compute (pp. 969 to 973): NVTX Prefill and Decode step ranges, per-stream transfer and compute naming, and PC sampling before full tracing in production.
2. [Sequential versus overlapped runtime structure](https://github.com/cfregly/ai-performance-engineering/blob/main/code/ch16/baseline_runtime_scheduler.py) (AI Systems Performance Engineering companion code - Chapter 16) - `baseline_runtime_scheduler.py` with sequential CPU preparation, GPU compute and per-token streaming against `optimized_runtime_scheduler.py`; read the overlap structure under NVTX ranges. Depth: Read the overlap structure, not the milliseconds. The matmul dimensions and the bundled per-architecture expectations are synthetic; re-measure everything on your device.
3. [Queueing versus execution in metric form](https://docs.vllm.ai/en/v0.31.0/design/metrics/) (vLLM Metrics Design and Production Metrics) - Interval Calculations with the queue, prefill, decode and inference intervals; Scheduler Stats with running and waiting counts including waiting by reason.

**Focus**

- Use the CPU-GPU timelines, NVTX ranges and trace-to-source correlation unit for timeline reading: union of busy lanes, not sums, and a CPU range is not device completion. This unit adds the serving stall split.
- Scope ranges to phases: one Prefill range around encode, one Decode range per step. Phase lengths, overlaps and idle gaps on the timeline are the diagnosis.
- A stall with growing queue time and waiting counts is queueing: fix admission, budget or load. A stall inside prefill or decode intervals with the device busy is execution: profile kernels.
- Preemption looks like execution from one angle and queueing from another. Read the preemption events and the restarted prefill spans before naming the cause.

**Reproduce:** Closed-book, annotate a timeline that shows a long TTFT with short prefill kernels: place the NVTX ranges, mark the queue span, and state whether the fix is scheduling or kernels with the evidence quoted.

**Traps**

- Summing busy times across streams and lanes. Overlapping work counts once; the union is the elapsed time.
- Reading a long CPU-side range as slow device work. Host ranges include launch, synchronization and waiting; only device-side evidence classifies execution.
- Profiling in production with full tracing first. Localize with counters and PC sampling, then trace one case.

**Practice**

- The section mini-project covers this: trace queries that explain a request's TTFT and every decode gap from synchronized ranges and scheduler state.

**Stop when:** You can take any slow request, split its stall into queueing versus execution from trace evidence, and kill one wrong hypothesis in writing.

<details>
<summary>Self-test</summary>

1. Prefill kernels take 40 ms inside a 900 ms TTFT with high queue time. Scheduling or kernels?
   - Scheduling. The kernels are a small fraction; the request waited. Fix admission, budget or load.
2. Decode gaps spike exactly when a new long prompt arrives. What confirms interference over a kernel regression?
   - The gaps align with the new prefill's iterations on the timeline while decode kernels are unchanged, and per-step instrumentation shows the waits outside model execution.
3. Why scope NVTX ranges to phases instead of wrapping the whole server loop?
   - Phase ranges separate prefill from decode work on the timeline. One outer range cannot attribute time to either phase.
4. A profile shows all-to-all above 5 ms per iteration on a disaggregated setup. What next?
   - Treat communication as the hypothesis: verify against the timeline and counters, then test overlap or placement changes. Do not tune attention kernels first.

</details>

#### U12. Predictions before profiles, residuals and goodput under latency targets

**About 4 h** · **Target:** Derive + Measure

Topics: Prediction before profile and residual explanation; Goodput under explicit TTFT and TPOT targets

A prediction written after the profile explains everything and predicts nothing. Residuals against a prior prediction are the only honest evidence in this section.

**You can now**

- Write a bottleneck prediction with numbers before profiling, then explain the residual from evidence.
- Measure goodput under explicit TTFT and TPOT targets and report what meets the objectives.
- Preserve one failed prediction with the observation that disproved it.

**Study**

1. [A worked prediction table](https://proceedings.mlsys.org/paper_files/paper/2023/file/c4be71ab8d24cdfb45e3d06dbfca2780-Paper-mlsys2023.pdf) (Efficiently Scaling Transformer Inference) - Section 4.4 with Tables 2 and 3 (pp. 9 to 10): the low-latency versus high-throughput rows as predictions, with cost as chip-seconds per token and MFU as the check.
2. [Goodput from the benchmark result format](https://docs.vllm.ai/en/v0.31.0/benchmarking/cli/) (vLLM Benchmark CLI (v0.31.0)) - Online Benchmark result format with request, output-token and total-token throughput beside mean, median and P99 TTFT, TPOT and ITL; Load Pattern Control Parameters for testing against a target rate.
3. [Prediction-first measurement](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/capstones/llm-inference-systems-laboratory.md) (LLM Inference Systems Laboratory - Instrumentation) - Milestone E: validate the operation, byte, launch, resource, KV, queue and capacity model and quantify residuals; optimize only measured critical-path terms.

**Focus**

- Write the prediction before the profile: the regime, the expected TTFT and TPOT ranges, and the bottleneck with numbers. Date it; postdiction is the failure mode.
- The residual is measured minus predicted with an attributed cause from spans or profiles, such as unmodeled launch overhead, queueing or cache effects.
- Goodput counts only requests meeting the TTFT and TPOT targets. Throughput without targets is not goodput, and a faster engine can have worse goodput under tight targets.
- Keep the failed prediction visible with its disproving observation. The checkpoint requires one, and it is the most portable artifact of the unit.

**Reproduce:** Closed-book, write a prediction for a short-prompt and a long-prompt workload: regime, TTFT and TPOT ranges, and the bottleneck. Then run `vllm bench serve --request-rate 4 --goodput ttft:500 tpot:50` against both, compute the residuals, and attribute each to evidence.

**Traps**

- Tuning the prediction after seeing the profile. A post-fit story has no residual; lock the numbers first.
- Reporting goodput without stating the targets. The same run has different goodput under different objectives, so targets are part of the number.
- Changing workload, cache state or versions between prediction and measurement. Residuals need identical contracts on both sides.

**Practice**

- The section mini-project covers this: the dated prediction, the residual attribution with evidence, and the goodput report under explicit TTFT and TPOT targets.

**Stop when:** You hold a dated prediction, measured residuals with attributed causes, a goodput number with stated targets, and one preserved failure.

<details>
<summary>Self-test</summary>

1. What must a prediction contain to admit a residual?
   - The regime, numeric TTFT and TPOT ranges, and the named bottleneck, written before profiling under a fixed contract.
2. Measured TPOT doubles the prediction while TTFT matches. What class of cause fits?
   - A decode-side miss: interference from concurrent prefills, cache pressure, or unmodeled per-step overhead. Prefill-side causes would move TTFT.
3. Engine A has higher throughput but lower goodput than engine B under strict targets. Consistent?
   - Yes. Goodput counts only requests meeting the targets; A can serve more tokens while missing the objectives more often.
4. Why preserve a failed prediction instead of replacing it with the corrected one?
   - The failure with its disproving observation records a tested boundary of the model. The corrected prediction alone hides what was ruled out.

</details>

### Mini-project: Prefill and decode baseline measurement harness

**About 10 to 14 hours.** Extend `servelab` with phase-separated timing, synchronized device measurement and a sweep harness that keeps raw traces for a model that fits your GPU. Predict bottlenecks before profiling and defend goodput under explicit targets, so later changes have an honest baseline.

1. Instrument per-request spans for tokenize, queue, prefill, first token, decode steps, sampling and streaming in `harness/` with a flame graph of the hottest host frame, checked against vLLM interval definitions with traces kept in `reports/`.
2. Derive decode-step shapes and prefill versus decode work, place both on a roofline for your GPU, and predict interference from an unchunked long prefill, checked with the TensorTonic decode problem and the Hands-On companion batching notebook with plots kept in `reports/`.
3. Time device work with stream-ordered events after warmup and capture, fix identical prompts, limits, stop behavior and cache state, and gate every comparison on greedy identity plus distributional agreement checked against the pinned sampling API with contracts kept in `reports/`.
4. Build the sweep harness in `harness/` with a single-request cell, concurrency and rate ladders and a shape matrix using `vllm bench serve` and `vllm bench latency`, retaining raw arrival and per-token records with aligned memory, utilization and power and the meter boundary in `reports/`.
5. Repeat key cells with interleaved trials reporting uncertainty, cross-check with a second tool, and measure observer cost with profiling on and off, keeping raw samples and overhead notes in `reports/`.
6. Write a dated bottleneck prediction before profiling, explain TTFT and every decode gap from synchronized ranges and scheduler state (`vllm:kv_cache_usage_perc` and `vllm:num_requests_waiting`, not memory used), report goodput under stated targets and preserve one failed prediction in `reports/`.

**Deliverables**

- Phase-separated harness in `harness/` with spans, sweeps and raw per-request records.
- Device-timed baseline with warm-state rules, output contracts and uncertainty plus observer checks.
- Dated predictions, residual attributions, goodput report and one preserved failure with trace queries.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [TensorTonic Decode Attention with KV Cache](https://www.tensortonic.com/problems/cs336-l10-kv-cache-decode-step). Solve by hand first, then pass the public cases in your harness.
- external-tests: [Hands-On LLM Serving companion batching notebook](https://github.com/orca3/llm-model-inference/blob/main/ch02/ch2_Batching.ipynb). Reproduce batched against single timing, then add your own per-request spans.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Span attribution | Spans split queueing from execution for a slow request against vLLM intervals with flame-graph evidence. | Every decode gap maps to scheduler or execution evidence and the hottest host frame is named. |
| Sweep discipline | Single-request, ladder and matrix cells rerun under identical contracts with raw records and uncertainty. | A second tool agrees within uncertainty and observer cost is measured and kept out of the reported medians. |
| Prediction honesty | Dated predictions precede profiles, residuals cite evidence, goodput states targets and one failure remains. | The failed prediction names the disproving observation and revises the regime boundary. |

Feeds into: Sweep harness, raw traces and residual method feed KV, scheduling and kernel projects and the capstone evaluation.

### Resource route

- **Primary - Paper:** [Efficiently Scaling Transformer Inference](https://proceedings.mlsys.org/paper_files/paper/2023/file/c4be71ab8d24cdfb45e3d06dbfca2780-Paper-mlsys2023.pdf) - Read the prefill and decode cost, memory, batching and parallelism sections. Use its models to predict phase bottlenecks before measurement and record which assumptions fail on the selected model, engine and GPU.
- **Required - Book:** [AI Systems Performance Engineering - Chapter 16, profiling and debugging inference](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) - Read the first part of Chapter 16: monitoring system metrics, profiling with Nsight Systems and Nsight Compute, the troubleshooting recipes and debugging correctness. Treat every quoted speedup as a hypothesis for your own hardware.
- **Required - Lab:** [AI Systems Performance Engineering companion code - Chapter 16](https://github.com/cfregly/ai-performance-engineering/tree/main/code/ch16) - Begin with inference_profiling.py, inference_server_load_test.py, monitoring_bundle.py and runtime scheduler instrumentation. Run only hardware-compatible targets, retain raw artifacts and re-measure all bundled expectations on your own device.
- **Required - Book:** [Hands-On LLM Serving and Optimization - Chapter 5 and the Chapter 4 metrics section](https://www.oreilly.com/library/view/hands-on-llm-serving/9798341621480/) - Read Chapter 5 on GPU specifications, model loading and arithmetic intensity in the prefill and decode phases, and "Measuring Performance in LLM Serving" in Chapter 4. Turn each claim into a prediction for one short-prompt and one long-prompt workload.
- **Required - Reference:** [vLLM Metrics Design and Production Metrics](https://docs.vllm.ai/en/v0.31.0/design/metrics/) - Map scheduler and cache events to exported request, queue, TTFT, inter-token and generation metrics. The link is pinned to v0.31.0; check the definitions against the version you install.
- **Required - Reference:** [vLLM Benchmark CLI (v0.31.0)](https://docs.vllm.ai/en/v0.31.0/benchmarking/cli/) - Use `vllm bench latency`, `vllm bench throughput` and `vllm bench serve` for phase and endpoint baselines. Fix the dataset, lengths, request rate, warmup and sampling, and keep the raw per-request results.
- **Support - Reference:** [TensorRT-LLM Benchmarking Guide](https://nvidia.github.io/TensorRT-LLM/developer-guide/perf-benchmarking.html) - Use Before Benchmarking and Online Serving Benchmarking as a reproducibility checklist. Borrow environment capture and startup metrics even if TensorRT-LLM is not the selected engine.
- **Support - Practice:** [Time to First Token - Measurement and Load-Testing Sessions](https://github.com/patchy631/time-to-first-token) - Use only Week 3 and Week 5 as a practical checklist for Prometheus, Grafana and request-rate sweeps. Follow the competency gate rather than its calendar, and replace fixed concurrency goals with your hardware-safe saturation range.
- **Support - Project:** [LLM Inference Systems Laboratory - Instrumentation](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/capstones/llm-inference-systems-laboratory.md) - Complete Milestone B: correlate request, iteration, KV, scheduler, kernel and resource events, quantify observer overhead, and retain raw arrival and completion records.
- **Support - Paper:** [Taming Throughput-Latency Tradeoff in LLM Inference with Sarathi-Serve](https://arxiv.org/abs/2403.02310) - Read arXiv v3, Chunked-prefills and Stall-free batching for the chunked-prefill vocabulary and the prefill-decode interference argument, and Overhead of chunked-prefills for the cost of splitting. Treat the reported capacity gains as the paper's result on its hardware.
- **Support - Tool:** [py-spy - sampling profiler for Python](https://github.com/benfred/py-spy) - Use py-spy record to take CPU flame graphs of tokenizer and detokenizer work, and py-spy top to watch the hot functions live. Launch the profiled process under py-spy.
- **Reference - Reference:** [vLLM SamplingParams API (v0.31.0)](https://docs.vllm.ai/en/v0.31.0/api/vllm/sampling_params/) - Look up `temperature`, `seed`, `max_tokens`, `ignore_eos`, `stop` and `stop_token_ids` defaults when you fix the output contract. The link is pinned to v0.31.0; check the fields against the version you install.

### Exit checkpoint

Produce separate prefill and decode distributions, classify three workload regimes before profiling, and explain one failed bottleneck hypothesis from synchronized traces without changing the correctness or workload contract.

<details>
<summary>Deliberately left for later</summary>

- Tuning engine knobs before the baseline harness passes fake-server checks
- Comparisons with different tokenizers, outputs or cache states
- Fleet-scale conclusions from a single GPU trace

</details>

## INF-3. KV Memory and Prefix Reuse

**Why:** KV state is both the main variable memory budget and a correctness-sensitive shared resource. Paging and prefix reuse must preserve ownership, positions, versions and tenant boundaries under churn.

### Learn this much

- [ ] Per-layer KV tensor layouts _(Required)_
- [ ] MHA, GQA, MQA and MLA cache consequences _(Required)_
- [ ] Logical KV tokens and physical allocation _(Required)_
- [ ] Contiguous versus paged KV storage _(Required)_
- [ ] Block size and block-table address translation _(Required)_
- [ ] Internal and external fragmentation _(Required)_
- [ ] Free lists, allocation and reserve policies _(Required)_
- [ ] Sequence block tables and append semantics _(Required)_
- [ ] Reference counts and copy-on-write _(Required)_
- [ ] Fork, beam and shared-prefix ownership _(Required)_
- [ ] Eviction, recomputation and preemption _(Required)_
- [ ] Cancellation and terminal cleanup _(Required)_
- [ ] Prefix hashing and collision verification _(Required)_
- [ ] Trie and radix longest-prefix lookup _(Required)_
- [ ] Exact token, position and chat-template identity _(Required)_
- [ ] Model, tokenizer, adapter and cache-layout version scope _(Required)_
- [ ] Tenant and privacy scope _(Required)_
- [ ] Cache-aware routing and load balance _(Required)_
- [ ] KV offload to CPU or storage vocabulary _(Required)_
- [ ] KV connectors and transfer metadata _(Required)_
- [ ] Capacity and page-waste derivation _(Required)_
- [ ] Allocator and prefix-index state machines _(Required)_
- [ ] Randomized operation-sequence properties _(Required)_
- [ ] No double allocation, free or stale reference _(Required)_
- [ ] Prefix reuse TTFT and goodput measurement _(Required)_
- [ ] Eviction, fairness and memory-pressure measurement _(Required)_
- [ ] Hit rate versus application outcome _(Required)_
- [ ] KV quantization and compression orientation _(Optional)_
- [ ] Hybrid attention and state-space cache identity _(Optional)_
- [ ] Multimodal embedding and media-cache identity _(Optional)_
- [ ] Tiered distributed KV cache and remote-memory policy _(Depth)_
- [ ] Novel cache-eviction research without a validated baseline _(Later)_

### Study units

#### U1. Per-layer KV layouts and the cache consequences of attention variants

**About 4 h** · **Target:** Explain + Derive

Topics: Per-layer KV tensor layouts; MHA, GQA, MQA and MLA cache consequences; Hybrid attention and state-space cache identity

Building a KV cache and KV memory arithmetic supplied the single-request contract. Serving now needs a shared pool whose layer views, attention variants and state checkpoints remain compatible under reuse.

**You can now**

- Map a serving engine's per-layer cache views to physical storage and distinguish layout from ownership.
- Derive dense and latent cache payloads without expanding shared KV heads in storage.
- Explain why hybrid attention and recurrent layers need different retention and prefix-checkpoint contracts.

**Study**

1. [Nano-vLLM: the pool and its layer views](https://github.com/GeeeekExplorer/nano-vllm/blob/bb823b3e06983d71485a8e1f23715ebd87d98ef8/nanovllm/engine/model_runner.py) (Nano-vLLM - Block Manager and Sequence Lifecycle) - `ModelRunner.allocate_kv_cache`: `block_bytes`, the six-dimensional allocation, and assignment to `k_cache` and `v_cache`. Depth: Trace the single-worker case. Skip startup, distributed communication and graph capture.
2. [Module 06: architectural cache reduction](https://inference.tusharamrit.in/modules/memory-optimization.html#concept-2) (LLM Inference: From scratch, one token at a time - Modules 02 and 06) - MQA to GQA to MLA: attacking the formula itself, including the latent and decoupled RoPE cache diagram. Depth: Stop before weight quantization. Treat reported architecture savings as model-specific, not a serving toggle or a quality guarantee.
3. [vLLM 0.31.0: per-layer state specifications](https://docs.vllm.ai/en/v0.31.0/api/vllm/v1/kv_cache_interface/) (vLLM 0.31.0 - cache specifications and connector lifecycle) - `AttentionSpec`, `MLAAttentionSpec`, `SlidingWindowSpec`, `MambaSpec` and `KVCacheGroupSpec`; inspect their state shapes, page sizes and grouping contracts. Depth: Read these classes only. Skip packed hardware-specific formats and the general layout-construction helpers.

**Focus**

- Nano-vLLM allocates key/value, layer, physical block, token slot, KV head and channel axes. A block ID selects corresponding storage across layers; it does not merge their projections.
- For dense caches, sum per-layer payloads as $`\sum_{\ell} H_{\mathrm{kv},\ell}(d_{k,\ell}+d_{v,\ell})b_\ell`$ bytes per token. MHA, GQA and MQA change stored KV heads, not the number of query heads.
- A conventional MLA cache stores the shared KV latent and the decoupled positional key, not two full per-head tensors. Its payload is $`(d_c+d_r)b`$ per layer per token, before padding or metadata.
- Hybrid layers can retain full history, a bounded window, or recurrent state at a checkpoint. A reusable boundary must provide valid state for every layer type, under the same positions and model version.

**Reproduce:** Closed-book, draw Nano-vLLM's pool and layer views for one worker. For a synthetic two-layer model with 8 query heads, 2 KV heads, equal key/value width 4 and two-byte elements, derive 64 bytes per token across layers. For a separate two-layer MLA model with latent width 6 and positional-key width 2 at the same dtype, derive 32 bytes. Label these payloads, not engine allocations; explain which state a hybrid recurrent layer would add.

**Traps**

- Expanding GQA keys in the persistent cache because queries have more heads. Expansion for computation is not the storage contract.
- Applying the dense key-plus-value formula to an MLA latent or a recurrent state. Count the actual stored representation.
- Reusing a hybrid prefix because the full-attention layers hit. Missing recurrent checkpoints or window state can still make that boundary unusable.

**Practice**

- The section mini-project covers this: `servelab` per-layer state descriptors and byte accounting, with dense, latent and labeled hybrid-state cases.

**Stop when:** Your state descriptors reconcile the two synthetic payloads and reject a reuse boundary with missing layer state, without rebuilding the earlier single-request cache.

<details>
<summary>Self-test</summary>

1. Does sharing one block ID across layers mean that their keys are equal?
   - No. The ID selects different per-layer storage regions. Each layer still has its own projections and cached values.
2. Why is there no extra factor of two in the conventional MLA payload formula?
   - The single latent jointly represents key and value content. Count it once, then add the separately stored positional key.
3. Can a recurrent checkpoint at one prefix boundary stand in for an earlier boundary?
   - Not generally. It summarizes the history at its own boundary. An earlier state needs its own checkpoint or recomputation; recurrent updates need not be invertible.

</details>

#### U2. Logical tokens, paged storage, block size and block tables

**About 4 h** · **Target:** Explain + Derive

Topics: Logical KV tokens and physical allocation; Contiguous versus paged KV storage; Block size and block-table address translation

Variable-length, paged and decode attention supplied the kernel mapping. Here the same mapping becomes an allocator contract that must survive growth, reuse and physical-page permutation.

**You can now**

- Translate logical token positions through a sequence block table into physical KV slots.
- Explain how a contiguous physical pool supports noncontiguous per-request storage.
- Defend block size using tail waste, table overhead and reuse granularity.

**Study**

1. [PagedAttention: storage and translation](https://arxiv.org/html/2309.06180v1#S4.SS1) (Efficient Memory Management for Large Language Model Serving with PagedAttention) - arXiv:2309.06180v1, Sections 4.1 to 4.3, Figures 5 to 7; Section 7.2, Impact of Block Size. Depth: Trace storage and address translation. Use your existing attention oracle rather than the displayed block-softmax equation; retain normalization over valid tokens. Treat the block-size experiments as the paper's workloads, not a universal optimum.
2. [Nano-vLLM: from tables to write locations](https://github.com/GeeeekExplorer/nano-vllm/blob/bb823b3e06983d71485a8e1f23715ebd87d98ef8/nanovllm/engine/model_runner.py) (Nano-vLLM - Block Manager and Sequence Lifecycle) - `prepare_block_tables`, `prepare_prefill` and `prepare_decode`: positions, context lengths and `slot_mapping`. Depth: Read the metadata construction only; no engine launch or kernel rewrite is needed.

**Focus**

- For zero-based token position $`t`$ and block size $`P`$, logical block is $`\lfloor t/P\rfloor`$ and offset is $`t\bmod P`$. The table entry, not the logical block number, selects physical storage.
- The pool itself can be contiguous while each request's blocks are scattered. Paging removes the requirement for a contiguous request-sized allocation, not all contiguous memory.
- Valid length is separate from allocated capacity. A full last page has occupancy equal to the block size, not zero; an empty request needs an explicit convention.
- Smaller pages reduce tail waste and make block-based reuse finer. They also increase table entries and management work. Measure the trade-off rather than assuming the smallest page wins.

**Reproduce:** Closed-book, place a 10-token synthetic request with block size 4 on physical blocks `[5, 1, 7]`. List all token locations: token 9 is block 7, offset 1, flat slot 29. Gather integer token labels on CPU, permute physical blocks while updating the table, and require identical gathered labels. Keep absolute positions unchanged and verify that unused tail slots never appear in the gather.

**Traps**

- Using physical slot numbers as RoPE positions. Relocation must not change logical positions.
- Reading the whole final page. Its unused slots can contain stale values from an earlier owner.
- Expecting bit-identical floating-point attention after changing kernels. Storage relocation preserves the mathematical inputs; reduction-order differences still need the earlier numerical contract.

**Practice**

- The section mini-project covers this: `servelab` block-table translation, valid-length gathers, physical-page permutation and token-position checks.

**Stop when:** Your CPU gather preserves every valid token under physical-page permutation and excludes tail slots, and you can translate an unseen table without source code.

<details>
<summary>Self-test</summary>

1. With block size 4 and table `[5, 1, 7]`, where is token 4?
   - Logical block 1 maps to physical block 1, offset 0, flat slot 4.
2. Does moving a physical block require recomputing positional keys?
   - No, if the values and logical positions are preserved. Moving storage is not moving tokens within the sequence.
3. Why can free space in separate pages admit a request when a contiguous allocator cannot?
   - The page table joins disjoint fixed-size pages into one logical sequence. A contiguous allocator needs one sufficiently large free interval.

</details>

#### U3. Fragmentation, page waste, capacity and KV compression

**About 4 h** · **Target:** Derive

Topics: Internal and external fragmentation; Capacity and page-waste derivation; KV quantization and compression orientation

The KV bytes per token result is already known. The new question is how many physical blocks remain usable after tails, retained prefixes and allocator reserve consume the pool.

**You can now**

- Derive logical payload, allocated slots and page waste for a length distribution.
- Account for reserve and shared physical blocks when predicting admission capacity.
- Distinguish exact storage management from lossy KV quantization or token removal.

**Study**

1. [PagedAttention: the three kinds of waste](https://arxiv.org/html/2309.06180v1#S3.SS1) (Efficient Memory Management for Large Language Model Serving with PagedAttention) - arXiv:2309.06180v1, Section 3.1 with Figure 3; Sections 4.2 to 4.3 for on-demand blocks; Section 7.2 for block-size sensitivity.
2. [Module 06: KV compression and quality](https://inference.tusharamrit.in/modules/memory-optimization.html#concept-4) (LLM Inference: From scratch, one token at a time - Modules 02 and 06) - KV cache quantization, and why K and V want different treatment, then the next concept, Measuring quality honestly. Depth: Read for orientation only. Skip the Code lab and its expected concurrency figures: its paged append mutates length before capacity failure, and the driver ignores that failure. Do not use its utilization as evidence. Treat outlier patterns and quality costs as workload-dependent.

**Focus**

- For independent dense sequences of lengths $`n_i`$, page size $`P`$ and payload $`c`$ bytes per token, allocated bytes are $`cP\sum_i\lceil n_i/P\rceil`$; tail waste is $`c\sum_i(P\lceil n_i/P\rceil-n_i)`$. This excludes metadata and padding.
- A nonempty private sequence wastes at most $`P-1`$ slots in its tail. Mean waste is $`(P-1)/2`$ only if length residues are uniform; block-aligned lengths waste none.
- With sharing, count the union of physical blocks, not the sum of request-table lengths. Partition the pool into pinned, reclaimable cached and uncached free blocks; reserve reduces admission headroom.
- Fixed-size pages avoid external fragmentation within one homogeneous pool. Quantization adds scales, packing and possible padding; dropping attended tokens changes the computation even at unchanged dtype.

**Reproduce:** Derive and check a synthetic CPU ledger with no sharing: lengths `[1, 4, 5, 8]`, block size 4, 64 payload bytes per token, and an eight-block pool with one block reserved. The requests use six blocks, 24 slots and 1536 bytes for 18 tokens of payload; tail waste is six slots or 384 bytes. One additional block is admissible after reserve. Then explain how sharing would change the physical-block count, not the per-token payload formula.

**Traps**

- Calling cached, evictable memory either permanently unavailable or simultaneously free and cached. Use disjoint accounting categories.
- Assuming half a page of waste for every distribution. The length residues determine the mean.
- Equating nominal bit width with allocated bytes or safe quality. Metadata and alignment affect capacity; attention and task checks govern quality.

**Practice**

- The section mini-project covers this: `servelab` contiguous-versus-paged capacity ledgers over length and cancellation churn, with reserve, shared-block and page-size accounting.

**Stop when:** Your derived physical-byte and waste totals match the allocator ledger for aligned, partial and shared cases, with reserve and metadata stated separately.

<details>
<summary>Self-test</summary>

1. What tail waste does an 8-token sequence have with block size 4?
   - None. Both pages are full; a full final page is not an extra empty page.
2. Two requests reference the same two prefix pages. How many physical pages do those references consume?
   - Two, not four. The references still need separate table entries and ownership accounting.
3. Does exact paging justify removing middle-context tokens to fit memory?
   - No. Paging changes addresses without dropping valid keys or values. Removing attended tokens changes attention and needs a separate quality contract.

</details>

#### U4. Free lists, reserve policies, block tables and append

**About 4 h** · **Target:** Implement

Topics: Free lists, allocation and reserve policies; Sequence block tables and append semantics

Key-value append, gather, layout conversion and quantized loads supplied the write kernel. The allocator must now prove that each destination exists and has one writer before that kernel runs.

**You can now**

- Implement a free-list allocator with sequence tables and transactional append.
- Derive additional page demand from committed length and scheduled writes.
- Choose a reserve policy that leaves explicit headroom for running requests.

**Study**

1. [Nano-vLLM: free list, admission and append](https://github.com/GeeeekExplorer/nano-vllm/blob/bb823b3e06983d71485a8e1f23715ebd87d98ef8/nanovllm/engine/block_manager.py) (Nano-vLLM - Block Manager and Sequence Lifecycle) - `Block.reset`, `_allocate_block`, `_deallocate_block`, `can_allocate`, `allocate`, `can_append` and `may_append`. Depth: Trace private allocation first. Keep manager and sequence block sizes consistent. Do not copy the append boundary predicate without tracing when the sampled token enters the sequence.
2. [Nano-vLLM: logical length versus computed state](https://github.com/GeeeekExplorer/nano-vllm/blob/bb823b3e06983d71485a8e1f23715ebd87d98ef8/nanovllm/engine/scheduler.py) (Nano-vLLM - Block Manager and Sequence Lifecycle) - `schedule` prefill/decode branches and `postprocess`; follow `num_cached_tokens`, `num_scheduled_tokens` and `append_token`. Depth: Draw the memory transitions only. Leave scheduling policy comparisons for Batching, Scheduling and Admission.

**Focus**

- For private append of $`a`$ KV tokens to committed length $`n`$, extra pages are $`\lceil(n+a)/P\rceil-\lceil n/P\rceil`$. Validate capacity before changing the committed table or length.
- Nano-vLLM records a sampled token before its KV is computed. Its decode boundary check uses that convention. A token list, computed-KV length and allocated capacity are three different quantities.
- Allocation failure must leave the state unchanged or follow a documented rollback. A successful write publishes the new valid length only after its KV is ready.
- Reserve is a policy, not missing memory. Keep a configurable number of pages outside new-request admission and state which operations may consume it; account for the next batch's growth before dispatch.

**Reproduce:** Implement a CPU private-page allocator from memory. With four pages of four slots and one page reserved from new-request admission, admit a five-token request, append three KV tokens without a new page, then append one with a new page. A further five-token append needs one more page: deny it if this append may not consume reserve, and verify unchanged length 9, table and free list. Release the request and recover all four pages. State your empty-request and duplicate-ID policies.

**Traps**

- Mutating length before checking free capacity. A rejected append can leave the valid length beyond allocated storage.
- Using one-token decode logic for a multi-token append. Chunked prefill can cross several boundaries in one operation.
- Counting reserve twice or silently consuming it. Separate hard capacity from each operation's admission policy.

**Practice**

- The section mini-project covers this: `servelab` private allocator, reserve-aware admission, multi-token append and failure-atomicity tests.

**Stop when:** Private allocate, append and release pass boundary, exhaustion, duplicate-ID and rollback checks against a separate logical-length ledger.

<details>
<summary>Self-test</summary>

1. At committed KV length 5 with block size 4, how many extra pages does a three-token append require?
   - None. It fills the existing second page to length 8. The following one-token append needs a third page.
2. Can allocation succeed even though the newly reserved slots have no valid KV yet?
   - Yes. Capacity can be reserved before computation. Consumers must still use the committed valid length and readiness state.
3. What must a failed append preserve?
   - The committed tokens, valid length, ownership, block table and free-list accounting, unless an explicit rollback contract specifies equivalent restored state.

</details>

#### U5. Reference counts, copy-on-write, fork, beam and shared prefixes

**About 4 h** · **Target:** Implement

Topics: Reference counts and copy-on-write; Fork, beam and shared-prefix ownership

Beyond one cache introduced sharing vocabulary. This unit makes it safe: one request's append or cancellation must not corrupt or release another request's prefix.

**You can now**

- Implement fork and release with reference counts derived from actual owners.
- Implement copy-on-write before modifying a shared partial block.
- Diagnose beam-pruning and fork bugs using an independent unshared token oracle.

**Study**

1. [PagedAttention: fork and copy-on-write](https://arxiv.org/html/2309.06180v1#S4.SS4) (Efficient Memory Management for Large Language Model Serving with PagedAttention) - arXiv:2309.06180v1, Section 4.4, Parallel sampling, Beam search and Shared prefix, with Figures 8 to 10.
2. [Nano-vLLM: immutable prefix ownership](https://github.com/GeeeekExplorer/nano-vllm/blob/bb823b3e06983d71485a8e1f23715ebd87d98ef8/nanovllm/engine/block_manager.py) (Nano-vLLM - Block Manager and Sequence Lifecycle) - `allocate` cached-block branch and `deallocate`; contrast with `may_append`. Depth: This revision shares cached full blocks but has no general fork or copy-on-write operation. Use the paper for that extension, not an invented Nano-vLLM API.

**Focus**

- A fork copies the logical table and increments references to its physical blocks. Count all owners under your chosen convention, including any cache or pending-transfer pins; do not count a duplicated table as duplicated payload.
- Before writing a multiply owned tail, allocate a private block, copy valid state across every layer, redirect only the writer and release its old reference. Publish after the copy is ready.
- A full immutable prefix block needs no copy when append starts a fresh page. A shared partial tail does need protection, even if both branches will write the same token.
- Beam selection can create multiple descendants of one parent and prune other parents. Acquire survivor references before releasing old owners, so a transient zero count cannot recycle a still-needed page.

**Reproduce:** In a CPU model with block size 4, create the five-token sequence `[10, 11, 12, 13, 14]` and fork it once. Both pages initially have two request references. Append `20` to the child: copy its partial tail, leaving the full prefix shared. Require three physical pages, prefix refcount 2 and tail refcounts 1 each; the parent remains length 5. Cancel the child, then the parent, and require all pages free when caching is disabled. Compare both token histories with separately copied Python lists.

**Traps**

- Copying only keys, one layer or the token-ID metadata. Copy-on-write protects the complete stored state used by future attention.
- Assuming an unused slot in a shared page has no owner. Different branches can disagree on the contents and validity of that slot.
- Releasing all old beams before acquiring new beam references. This can recycle a prefix that a survivor still needs.

**Practice**

- The section mini-project covers this: `servelab` fork, partial-tail copy-on-write and beam-pruning histories, checked against unshared token/state copies.

**Stop when:** Forks at partial and full boundaries preserve parent state, reference counts match all owners, and pruning or cancellation restores capacity without invalidating survivors.

<details>
<summary>Self-test</summary>

1. A fork occurs at exactly eight committed tokens with block size 4. Does the next append copy an old page?
   - No. Both old pages are full and immutable; each writing branch allocates a fresh tail page.
2. Does cancelling a child free the shared prefix immediately?
   - No. It releases the child's references. The parent's references still protect the prefix, as would any other pin.
3. Why is one reference count insufficient to prove correct data?
   - It proves ownership only if maintained correctly. A page can have a plausible count yet contain the wrong sequence, generation, layer or position; the token/state oracle checks that separately.

</details>

#### U6. Eviction, recomputation, preemption and terminal cleanup

**About 4 h** · **Target:** Explain + Implement

Topics: Eviction, recomputation and preemption; Cancellation and terminal cleanup

A request can stop owning KV while the prefix cache retains it. Cleanup must distinguish safe reuse from a leak, and preemption must preserve enough history to resume correctly.

**You can now**

- Implement distinct transitions for cache eviction, request preemption and terminal release.
- Resume a preempted request from retained token history without resampling its past.
- Prove cancellation is idempotent and cannot free another owner's state.

**Study**

1. [PagedAttention: recovering preempted state](https://arxiv.org/html/2309.06180v1#S4.SS5) (Efficient Memory Management for Large Language Model Serving with PagedAttention) - arXiv:2309.06180v1, Section 4.5, Scheduling and Preemption; Section 7.3, Comparing Recomputation and Swapping. Depth: Read recomputation and swap as the paper's alternatives, not claims about today's vLLM scheduler defaults.
2. [Nano-vLLM: preempt and finish](https://github.com/GeeeekExplorer/nano-vllm/blob/bb823b3e06983d71485a8e1f23715ebd87d98ef8/nanovllm/engine/scheduler.py) (Nano-vLLM - Block Manager and Sequence Lifecycle) - `preempt` and `postprocess`, including deallocation on end-of-sequence or output limit.
3. [Mini-SGLang: protection and leaf eviction](https://github.com/sgl-project/mini-sglang/blob/9a91cfafe754aa85daee49998176275667eb58f2/python/minisgl/kvcache/radix_cache.py) (Mini-SGLang - Radix Cache and Cache Tests) - `lock_handle`, `evict` and `_collect_leave_nodes_for_evict`; follow protected and evictable sizes. Depth: Trace the state transitions. Add cancellation in your own model; neither small engine is a complete cancellation specification.

**Focus**

- Eviction removes reusable index entries and makes unpinned storage reclaimable. Preemption pauses a live request and releases or moves its KV. Terminal cleanup removes request ownership permanently.
- Recomputation replays the original prompt plus committed generated tokens as inputs. It does not regenerate those tokens or advance the sampling RNG for them.
- A radix leaf may be evictable only when no active handle protects it. Remove descendants before ancestors so remaining prefix paths stay valid.
- Cancellation releases each owner once and invalidates future work for that request generation. Pending readers, writers or transfers must complete or acknowledge cancellation before their blocks can be overwritten.

**Reproduce:** Draw and execute a deterministic CPU history: allocate a request, fork it, cancel one branch twice, preempt the survivor, recompute its committed token history, then finish it. Keep a separate token-list oracle and an ownership ledger after each event. With prefix retention enabled, request references must end at zero while retained blocks remain reclaimable; explicitly evict them and require full pool recovery. Inject a late completion from the cancelled generation and reject it without releasing storage again.

**Traps**

- Calling every retained block a leak. A leak has no valid owner or bounded reclamation path; a cached prefix can legitimately outlive its request.
- Resampling old output during recomputation. The resumed history and sampling state then differ from the original request.
- Treating a duplicate cancellation or late callback as a second release. Guard terminal state and request generation before decrementing references.

**Practice**

- The section mini-project covers this: `servelab` eviction, recompute, cancellation and terminal cleanup histories, including duplicate cancellation and late-event rejection.

**Stop when:** The history preserves surviving tokens, releases each owner exactly once, rejects stale events and recovers the full pool after retained entries are explicitly evicted.

<details>
<summary>Self-test</summary>

1. Can a request be finished while a prefix derived from it remains cached?
   - Yes. Request ownership has ended, but a reusable index can retain reclaimable state. It must remain bounded and evictable when unpinned.
2. Does preemption always reclaim every page in the request table?
   - No. Other requests or pending operations may still pin shared pages. Release this request's references and count only newly reclaimable physical pages.
3. Which past tokens are fed to recomputation after a decode preemption?
   - The prompt and already committed generated tokens, with their original positions and model state contract. Past sampling decisions are retained, not repeated.

</details>

#### U7. Prefix hashing with collision checks and radix longest-prefix lookup

**About 6 h** · **Target:** Implement

Topics: Prefix hashing and collision verification; Trie and radix longest-prefix lookup

Paging chooses where KV lives; a prefix index chooses which existing state a request may reuse. Correct addressing cannot rescue a wrong prefix match.

**You can now**

- Implement block-hash lookup with exact verification of the complete prefix identity.
- Implement trie or radix longest-prefix matching with insertion and edge splitting.
- Force hash collisions and prove they cannot return state from a different context.

**Study**

1. [vLLM 0.31.0: block identity and lookup](https://docs.vllm.ai/en/v0.31.0/design/prefix_caching/) (vLLM Automatic Prefix Caching Design) - Automatic Prefix Caching opening hash-components list and Notes 1 to 2; Data Structure and Block Allocation. Depth: Read the full-block path. SHA-256 makes accidental collisions negligible, not impossible; including tokens in a hash input is not an exact post-hit comparison. Your educational index must verify identity explicitly.
2. [RadixAttention: sequence-level index](https://arxiv.org/html/2312.07104v2#S3) (SGLang: Efficient Execution of Structured Language Model Programs) - arXiv:2312.07104v2, Section 3, RadixAttention, with Figure 3. Depth: Stop before Cache-aware scheduling; policy and outcome measurement come later.
3. [Mini-SGLang: radix insertion and matching](https://github.com/sgl-project/mini-sglang/blob/9a91cfafe754aa85daee49998176275667eb58f2/python/minisgl/kvcache/radix_cache.py) (Mini-SGLang - Radix Cache and Cache Tests) - `RadixTreeNode.split_at`, `RadixPrefixCache.insert_prefix`, `_tree_walk` and `_get_key_fn`; note page-aligned matches.

**Focus**

- A block key includes preceding context, current tokens and scope extras. Identical block tokens after different earlier tokens need not have identical KV.
- Hash equality selects candidates, not a proof. Retain exact immutable keys and verify the whole prefix and scope, or verify an exact parent chain plus current tokens. Comparing only the current block misses ancestor collisions.
- A radix edge holds a token sequence. A partial edge match can split it without copying the underlying KV; values and references must split at the same boundary.
- Longest-prefix matching stops at the first differing token. The paper uses token-sized pages; Mini-SGLang aligns matches to its configured page size. Neither index changes the attention algorithm's causal dependencies.

**Reproduce:** From memory, implement exact prefix matching for cached sequences `[[1, 2], [1, 2, 3], [4]]` and requests `[[1, 2, 9], [4, 5], [5]]`. Match lengths are `[2, 1, 0]`. Rebuild it with compressed radix edges and require the same lengths. For the hash index, deliberately return a constant hash for every key; prefixes `[1, 2, 7, 8]` and `[9, 2, 7, 8]` must not share state for the final block merely because its tokens match. Keep a brute-force token-prefix oracle.

**Traps**

- Treating a strong digest as mathematically collision-free. A finite digest cannot uniquely represent all possible prefixes.
- Checking only the current block after a hash hit. Nano-vLLM's `can_allocate` does this; it is not a complete ancestor-collision defense.
- Returning a matching substring after divergence. Only a leading prefix has the same causal history under ordinary exact reuse.

**Practice**

- [TensorTonic: Find Reusable Prefixes in a KV Trie](https://www.tensortonic.com/problems/cs336-l18-kv-prefix-trie) - Implement `kv_prefix_trie(cached_sequences, requests)`; public cases cover nested/separate branches, a duplicate cached prefix and no shared first token. The free problem checks trie matches and insertion-order node IDs, not KV ownership. Add empty inputs, partial radix edges, forced ancestor collisions and eviction in `servelab`; the section mini-project covers those extensions.

**Stop when:** The named trie cases pass, radix matches agree with the brute-force oracle, and constant-hash histories never return KV from a different prefix.

<details>
<summary>Self-test</summary>

1. Why does hashing only the current block's tokens give incorrect reuse?
   - Its hidden states depend on earlier tokens and positions. The same block text after a different history can have different KV.
2. With a constant hash function, can an exact-key bucket index still be correct?
   - Yes, if it compares full immutable identities inside each bucket and keeps all candidates. Performance degrades, but collisions cannot authorize a wrong match.
3. Why split a radix edge when a new request ends inside it?
   - The split exposes the matched prefix as a node or handle boundary while preserving the old suffix. State ranges and reference protection must remain consistent.

</details>

#### U8. Exact prefix identity, version scope and tenant privacy scope

**About 4 h** · **Target:** Explain

Topics: Exact token, position and chat-template identity; Model, tokenizer, adapter and cache-layout version scope; Tenant and privacy scope; Multimodal embedding and media-cache identity

A prefix hit authorizes use of another request's derived state. Model compatibility and tenant isolation must be explicit rather than inferred from equal text or a low collision probability.

**You can now**

- Explain exact reuse identity across tokens, positions, templates, model versions and adapters.
- Specify a tenant-scoped namespace and invalidation rule that cannot be chosen by an untrusted client.
- Identify why media placeholders and mutable embeddings need identity beyond token IDs.

**Study**

1. [Hands-On LLM Serving and Optimization: prompt structure and tenants](https://www.oreilly.com/library/view/hands-on-llm-serving/9798341621480/) (Hands-On LLM Serving and Optimization - Prefix Caching and Advanced KV Caching) - Chapter 6, Prefix Caching: Best Practices and Scaling Prefix Cache, printed pp. 227 to 230. Depth: Read the formatting and tenant examples. Prefer an authenticated cache namespace over inserting a client-supplied tenant ID into the prompt; prompt changes also change model inputs.
2. [vLLM 0.31.0: multimodal keys and cache isolation](https://docs.vllm.ai/en/v0.31.0/design/prefix_caching/) (vLLM Automatic Prefix Caching Design) - Extra hashes; A hashing example with multi-modality inputs; Cache Isolation for Security.
3. [vLLM 0.31.0: actual extra-key fields](https://docs.vllm.ai/en/v0.31.0/api/vllm/v1/core/kv_cache_utils/#vllm.v1.core.kv_cache_utils.generate_block_hash_extra_keys) (vLLM Automatic Prefix Caching Design) - `generate_block_hash_extra_keys`, `_gen_lora_extra_hash_keys`, `_gen_mm_extra_hash_keys` and `_gen_prompt_embeds_extra_hash_keys`. Depth: Trace these helpers only. The LoRA helper uses adapter name and path, not a checksum of files changed in place; invalidate or change the namespace on such updates.

**Focus**

- Reuse requires the same effective causal inputs, positions, masks and model computation. Template or tokenizer changes can alter the leading token stream even when the displayed text looks unchanged.
- Separate mathematical identity from storage compatibility. Model weights, adapter contents and positional policy affect values; dtype, layout, quantization scales and cache-group conventions affect whether stored bytes can be consumed safely.
- Some fields are bound by the engine instance rather than repeated in each block key. A persistent or transferred cache needs an explicit model/tokenizer/template/adapter/layout version namespace and invalidation path.
- Bind privacy scope to authenticated server-side identity. In vLLM, first-block `cache_salt` propagates through parent hashes. Equal media placeholders are insufficient: processed media and supplied embeddings also affect KV. Freeze input data before hashing.

**Reproduce:** Closed-book, make a hit/miss matrix for one cached token prefix. Change one field at a time: leading token, absolute position, template-produced tokens, model revision, adapter contents, cache layout, tenant namespace and media embedding. Require a miss or a verified conversion for every incompatible case. A sampling-temperature change alone may reuse prompt KV for the same already-fixed tokens, but must not reuse a sampled continuation or RNG state. Execute the matrix as CPU descriptor comparisons in `servelab`.

**Traps**

- Treating `cache_salt` as authentication. An untrusted client must not select another tenant's namespace, and cache isolation is not a complete timing-channel defense.
- Assuming stable adapter names or paths imply stable weights. In-place changes require invalidation or a content-version namespace.
- Reusing prompt embeddings after mutation because token IDs did not change. Cached hashes and KV now describe the old data.

**Practice**

- The section mini-project covers this: `servelab` tenant/version namespaces, invalidation and token-position/media identity matrices, including unauthorized namespace selection.

**Stop when:** Your matrix rejects incompatible or unauthorized reuse and explains which fields are in each key, which are bound by the pool, and which remain request-local.

<details>
<summary>Self-test</summary>

1. Must changing temperature invalidate prompt KV for identical fixed input tokens?
   - Not by itself. Temperature changes sampling after logits, not the deterministic prompt forward pass. Continuations and RNG state remain separate request state.
2. Why do two images with the same placeholder tokens need different cache identities?
   - The placeholders are replaced by different processed embeddings. The effective model inputs differ even though the token IDs match.
3. Why can a model version be absent from a local block hash without making all reuse unsafe?
   - The pool may belong exclusively to one fixed model instance. That binding must be enforced; cross-instance persistence or transfer cannot assume it.

</details>

#### U9. Cache-aware routing, KV offload and connector metadata

**About 3 h** · **Target:** Explain

Topics: Cache-aware routing and load balance; KV offload to CPU or storage vocabulary; KV connectors and transfer metadata

A prefix can be correct but live in the wrong place. Reuse pays only if reaching compatible state costs less than recomputing it, and movement must not outlive its storage owner.

**You can now**

- Explain cache affinity as a routing hint that competes with queueing and load balance.
- Distinguish local prefix reuse, host/storage offload and KV transfer.
- Specify transfer metadata and ownership until load or save completion.

**Study**

1. [RadixAttention: replica affinity and stale routing hints](https://arxiv.org/html/2312.07104v2#A1.SS4) (SGLang: Efficient Execution of Structured Language Model Programs) - arXiv:2312.07104v2, Appendix A.4, Data-Parallel Distributed RadixAttention.
2. [Hands-On LLM Serving and Optimization: offload vocabulary](https://www.oreilly.com/library/view/hands-on-llm-serving/9798341621480/) (Hands-On LLM Serving and Optimization - Prefix Caching and Advanced KV Caching) - Chapter 7, Advanced KV Caching: Self-Hosting LLMs, KV cache offloading, printed pp. 261 to 262; Hands-on LMCache, printed pp. 264 to 266. Depth: Read the hierarchy and cold/warm comparison. Skip the deployment commands, compression, blending and fleet cost claims; this unit needs a local transfer model, not that model size or topology.
3. [vLLM 0.31.0: connector ownership and synchronization](https://docs.vllm.ai/en/v0.31.0/api/vllm/distributed/kv_transfer/kv_connector/v1/base/) (vLLM 0.31.0 - cache specifications and connector lifecycle) - `KVConnectorMetadata`, `KVConnectorHandshakeMetadata`; `KVConnectorBase_V1` methods `get_num_new_matched_tokens`, `update_state_after_alloc`, `start_load_kv`, `wait_for_layer_load`, `wait_for_save` and `request_finished`. Depth: Read these contracts only. The metadata base classes do not prescribe a complete wire schema; design your compatible-state descriptor explicitly.

**Focus**

- Compare predicted queue plus remaining prefill cost, not prefix length alone. A hot replica can have enough queue delay to lose to an idle replica that recomputes.
- Offload retains compatible state on a colder tier; it does not make host or storage bytes GPU-resident. Restore time includes lookup, transfer, synchronization and any conversion, with real destination capacity reserved.
- Transfer metadata needs request generation, exact prefix/position boundary, model and adapter version, tenant authorization, layer/group layout, dtype/scales, valid length and source/destination mapping. A checksum detects corruption, not permission or compatibility.
- Asynchronous save pins source blocks until completion; load must finish before its consumer reads. A cancelled transfer still needs acknowledged cleanup. Routing metadata may be stale, so the destination validates the hit and falls back safely.

**Reproduce:** Use a labeled CPU event simulation, not a fleet measurement. Route one request between a busy prefix-hit replica and an idle miss replica by comparing queue plus service costs; increase only the hit replica's queue until routing changes. Then transfer a small token-labeled state buffer between two CPU stores with a versioned descriptor: reject one stale version, cancel during a pending copy, and keep its source pinned until the copy is acknowledged. Verify byte equality and unchanged logical positions for an accepted transfer.

**Traps**

- Treating a router's hit prediction as authority to use state. The destination must confirm presence, identity, compatibility and authorization.
- Freeing a source page as soon as a save is submitted. A pending copy can then read a recycled generation.
- Assuming a larger cold-tier cache gives a faster decode path. Restoring state and attending to it still consume time and device capacity.

**Practice**

- The section mini-project covers this: `servelab` labeled routing/offload simulation and local descriptor, stale-version, cancellation and deferred-free checks.

**Stop when:** Your local simulation changes routing at the predicted queue crossover, rejects incompatible transfers and preserves source ownership through completion or acknowledged cancellation.

<details>
<summary>Self-test</summary>

1. When should an idle miss replica beat a busy hit replica?
   - When its predicted queue plus recomputation and remaining service is less than the hit replica's queue plus reuse and remaining service, under the same request contract.
2. Is a matching checksum enough to accept transferred KV?
   - No. It can confirm payload integrity but not model compatibility, logical positions, tenant permission or freshness.
3. In the V1 connector contract, what does deferred freeing on `request_finished` require?
   - The engine must retain the request's blocks while asynchronous save/send owns them, and release them when transfer completion is reported. Submission alone is not completion.

</details>

#### U10. Allocator and prefix-index state machines under randomized property tests

**About 5 h** · **Target:** Implement

Topics: Allocator and prefix-index state machines; Randomized operation-sequence properties; No double allocation, free or stale reference

Single-operation tests miss interactions between fork, collision, eviction and cancellation. State-machine tests must explain which earlier transition first broke ownership, not just report a later wrong answer.

**You can now**

- Implement randomized allocator and prefix-index histories against an independent logical-state model.
- Check capacity conservation, exact references, token-position correctness and leak-free cancellation after every operation.
- Shrink a failing history and distinguish a stale-reference bug from an accounting bug.

**Study**

1. [Mini-SGLang: allocator regressions](https://github.com/sgl-project/mini-sglang/blob/9a91cfafe754aa85daee49998176275667eb58f2/tests/core/test_cache_allocate.py) (Mini-SGLang - Radix Cache and Cache Tests) - `TestAllocateEvictPageAlignment`: all six tests, from `test_allocate_after_evict_returns_page_aligned` through `test_check_integrity_passes_after_evict_cycle`.
2. [Mini-SGLang: what the integrity check proves](https://github.com/sgl-project/mini-sglang/blob/9a91cfafe754aa85daee49998176275667eb58f2/python/minisgl/scheduler/cache.py) (Mini-SGLang - Radix Cache and Cache Tests) - `check_integrity`, `_allocate`, `_free` and `_page_to_token`; compare with `RadixPrefixCache.check_integrity` in the radix file read earlier. Depth: The manager check counts free plus indexed pages and checks alignment; the radix integrity method is empty at this commit. These are not proofs of unique ownership or active-request state.
3. [Inference Systems Laboratory: KV evidence contract](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/capstones/llm-inference-systems-laboratory.md) (LLM Inference Systems Laboratory - KV State) - Correctness requirements, KV physical/logical ownership; Failure-injection requirements, prefix fork/collision/eviction and request terminal phases. Depth: Use the KV requirements only. The rest of the track capstone is not this unit's assignment.

**Focus**

- The independent oracle keeps request token lists, scope descriptors and expected ownership, not the implementation's tables or hashes. Recompute expected references from owners after each operation.
- Partition physical pages into disjoint free/reclaimable and pinned sets under one convention. Check unique allocation, nonnegative references, valid table generations, immutable shared prefixes and correct valid-length gathers.
- Generate successful and rejected allocate/append/fork/free/evict/cancel operations. Bias toward page boundaries, tiny pools, repeated terminal events, constant hashes, scope changes and reused physical IDs.
- Record the seed and full event history, then shrink while preserving operation preconditions. Inject deliberate double-free, missing decrement and stale-index mutants; an invariant suite that cannot detect them is incomplete.

**Reproduce:** Build a deterministic CPU stale-reference history: cache a full page, release its request, evict it, reuse that physical page for different tokens, then look up the old prefix. The correct result is a miss. Deliberately omit index invalidation and require the oracle to catch the stale hit. Add randomized histories around this trace, checking invariants after every event and full recovery after all owners and retained entries are removed. Keep a minimized failing trace for each injected mutant.

**Traps**

- Checking only that total counts add up. One missing page and one double allocation can cancel numerically.
- Comparing the implementation with an oracle that reads its block tables. The same mapping bug then appears in both answers.
- Sampling only operations that succeed. Failure, duplicate cleanup and cancellation races are part of the state contract.

**Practice**

- [Mini-SGLang: `TestAllocateEvictPageAlignment`](https://github.com/sgl-project/mini-sglang/blob/9a91cfafe754aa85daee49998176275667eb58f2/tests/core/test_cache_allocate.py) - Port the six named regression contracts to your allocator: post-eviction alignment, consecutive allocation non-overlap, aligned free slots, requested page count, page-to-token expansion and integrity after an eviction cycle. The section mini-project covers the broader `servelab` randomized state machines, independent token/owner oracle, collision/cancellation histories and mutation checks. These deterministic tests alone do not cover them.

**Stop when:** Your allocator passes the six regression contracts and replayable randomized histories, detects the injected lifecycle mutants and returns every physical page after explicit final cleanup.

<details>
<summary>Self-test</summary>

1. Why is nonnegative refcount weaker than exact refcount?
   - A positive extra count leaks capacity; a positive but insufficient count can free state while another owner still needs it. Compare counts with the complete owner ledger.
2. Can a stale table entry be dangerous even when its physical page ID is valid?
   - Yes. The page may have been recycled for a new owner. A generation or equivalent lifecycle check must distinguish the old reference from the current allocation.
3. What makes a shrunk failure useful?
   - It remains a valid operation history, still exposes the same violated contract, and is small enough to identify the first incorrect transition.

</details>

#### U11. Prefix reuse, memory pressure and fairness measured against outcomes

**About 5 h** · **Target:** Measure

Topics: Prefix reuse TTFT and goodput measurement; Eviction, fairness and memory-pressure measurement; Hit rate versus application outcome

A cache-hit counter measures avoided work, not user success. Retaining prefixes or favoring hot requests can improve that counter while reducing admission headroom or delaying other tenants.

**You can now**

- Compare reuse off/on under fixed arrivals, token streams, memory budgets and output contracts.
- Explain TTFT and goodput changes using skipped prefill, lookup, queueing, pressure and eviction traces.
- Retain a benefit region and a high-hit-rate region with no better outcome, including per-tenant fairness evidence.

**Study**

1. [RadixAttention: scheduling, outcomes and ablations](https://arxiv.org/html/2312.07104v2#S6.SS3) (SGLang: Efficient Execution of Structured Language Model Programs) - arXiv:2312.07104v2, Section 3, Cache-aware scheduling and starvation caveat; Sections 6.1 to 6.3, metrics, short/long multi-turn chat and Figure 8 ablations. Depth: Read the cache experiments, not constrained decoding or API speculation. The offline hit-rate theorem is not an online fairness or goodput guarantee; the paper's older baselines are not your current-engine comparison.
2. [Hands-On LLM Serving and Optimization: cold versus retained prefixes](https://www.oreilly.com/library/view/hands-on-llm-serving/9798341621480/) (Hands-On LLM Serving and Optimization - Prefix Caching and Advanced KV Caching) - Chapter 6, Prefix Caching, Use Cases and Best Practices, printed pp. 226 to 228; Chapter 7, Hands-on LMCache, Run benchmarks and Performance analysis, printed pp. 264 to 266. Depth: Use the cold/warm and pressure comparisons as experiment designs. Do not adopt the Chapter 6 claim of almost no drawback as a guarantee, or change prompt order merely to raise hits without rechecking quality.

**Focus**

- Define hit rate as reused prompt tokens divided by eligible prompt tokens and state the denominator. Separate active shared pages from retained evictable pages, and keep cold and warmed trials distinct.
- Use the earlier validated load generator. Define client TTFT as arrival/submission to first nonempty generated output, including queueing; define goodput as quality-accepted requests meeting the declared latency targets per measurement time.
- Reused prefix KV skips its repeated forward computation. New suffix queries and decode steps still attend to valid prefix state, so a token-hit fraction is not a proportional latency reduction.
- Keep cache policy and scheduler order separate in ablations. Record per-request and per-tenant waiting, admission, rejection, eviction and preemption alongside latency tails and memory; longest-prefix-first can starve cold traffic.

**Reproduce:** Replay the same `servelab` manifest with reuse off/on, first using a labeled deterministic CPU model with explicit prefill, decode, lookup and transfer costs. Vary reuse and output length separately, then add pressure and two-tenant skew; retain one benefit region and one high-hit region where lookup, queueing or memory policy prevents better goodput. On your GPU, repeat one bounded pair using a fitting model and the earlier endpoint harness; otherwise retain the simulation and label its timing assumptions. Keep arrivals, prompts, output limits, sampling, quality/SLO rules and pool budget fixed within each pair, with raw request and page traces.

**Traps**

- Using a high hit rate as the optimization target. Long decode, lookup cost or a hot replica's queue can dominate the saved prefill.
- Comparing warm reuse with a cold baseline while also changing arrival rate or output length. Name the cache-state treatment and change only the intended mechanism.
- Hiding cold-tenant rejection or cancellation in aggregate throughput. Count unsuccessful work and report per-tenant outcomes, not only completed hot requests.

**Practice**

- The section mini-project covers this: `servelab` reuse off/on, page-size/reserve and eviction ablations under controlled reuse, pressure and tenant skew, with TTFT, goodput, fairness and a high-hit negative result.

**Stop when:** You can explain a controlled benefit and a high-hit non-improvement from request/page traces, reconcile memory with the allocator ledger and report cold-tenant outcomes without overstating simulated evidence.

<details>
<summary>Self-test</summary>

1. Why can 90 percent prompt-token reuse fail to give a tenfold TTFT improvement?
   - TTFT also includes queueing, tokenization, lookup, remaining attention, sampling and streaming. The remaining suffix still attends to the prefix, and cost need not scale linearly with newly computed tokens.
2. Can retained prefix data reduce capacity without changing physical pool size?
   - Yes, if the policy pins it or reserves too much space for retention. Immediately evictable pages need not reduce hard admission capacity, but reclaiming them still has policy and management costs.
3. What evidence separates reuse benefit from cache-aware scheduling benefit?
   - Hold scheduler order fixed while toggling reuse, then hold reuse fixed while changing order. Preserve the same arrivals and outputs and compare raw waiting and execution traces.
4. When is a high-hit negative result valid evidence?
   - When outputs and workload controls pass, the hit denominator is clear, and traces identify the overhead or remaining bottleneck that prevents better latency or goodput. Simulation must be labeled, not presented as device measurement.

</details>

### Mini-project: Paged KV allocator with prefix reuse

**About 12 to 16 hours.** Extend `engine/` with a paged KV allocator, a prefix index with strict identity and a labeled CPU simulation of routing and offload. Prove ownership under churn and show where reuse helps goodput and where high hits mislead, for a model that fits your GPU.

1. Describe per-layer KV state with byte accounting for dense, latent and hybrid cases in `engine/`, implement block-table translation with valid-length gathers, and prove permutation preserves positions checked against Nano-vLLM allocation views with ledgers kept in `reports/`.
2. Derive contiguous versus paged capacity with reserve and sharing in `engine/`, implement a reserve-aware private allocator with multi-token append and failure atomicity, checked by a separate logical ledger with histories kept in `reports/`.
3. Implement fork with partial-tail copy-on-write and beam-pruning histories checked against unshared copies, then eviction, recompute, cancellation and late-event rejection proving single release with traces kept in `reports/`.
4. Build block-hash lookup with exact verification under forced collisions and a radix longest-prefix index, checked with the TensorTonic trie problem plus a tenant, version and media identity matrix kept in `reports/`.
5. Port the Mini-SGLang allocation regression contracts to `tests/` and run randomized allocator and index histories against an independent oracle, shrinking failures and catching injected mutants with histories kept in `reports/`.
6. Simulate cache-aware routing and offload with versioned descriptors, stale-version rejection, cancellation and deferred free in `sim/` using labeled CPU costs, then measure reuse off and on with ablations showing one benefit and one high-hit non-improvement with fairness evidence in `reports/`, with an optional measured pair on your GPU.

**Deliverables**

- `engine/` paged allocator and prefix index with ownership, collision and scope tests.
- Randomized state-machine suite in `tests/` with shrunk failures and mutant catches.
- Routing and reuse report in `reports/` with benefit, high-hit negative and fairness evidence.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [TensorTonic Find Reusable Prefixes in KV Trie](https://www.tensortonic.com/problems/cs336-l18-kv-prefix-trie). Solve the trie cases by hand first, then extend with collision checks.
- external-tests: [Mini-SGLang allocator regression suite](https://github.com/sgl-project/mini-sglang/blob/9a91cfafe754aa85daee49998176275667eb58f2/tests/core/test_cache_allocate.py). Port the named contracts, then add randomized histories around them.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Ownership safety | Randomized fork, copy-on-write, eviction and cancellation histories match the unshared oracle with exact counts. | Shrunk failures isolate the first bad transition and injected mutants are all caught. |
| Prefix correctness | Constant-hash histories never return foreign state and the identity matrix rejects incompatible reuse. | Partial-edge splits and eviction keep references consistent with brute-force agreement. |
| Reuse honesty | Reuse off and on runs share arrivals and contracts with TTFT, goodput and fairness from traces. | The high-hit negative names its overhead and the routing crossover is predicted before measurement. |

Feeds into: Allocator, index and reuse evidence feed scheduling, distribution and operations projects and the capstone contribution.

### Resource route

- **Primary - Paper:** [Efficient Memory Management for Large Language Model Serving with PagedAttention](https://arxiv.org/abs/2309.06180) - Read the memory-waste motivation, block-table design, sharing and copy-on-write sections, then reproduce the logical-to-physical translation on paper. Separate the paper's reported workloads from results on your engine and hardware.
- **Required - Paper:** [SGLang: Efficient Execution of Structured Language Model Programs](https://arxiv.org/abs/2312.07104) - Study RadixAttention, longest-prefix matching, eviction and cache-aware scheduling. Compare its sequence-level radix index with vLLM's block-level paging instead of treating them as competing names for one mechanism.
- **Required - Book:** [Hands-On LLM Serving and Optimization - Prefix Caching and Advanced KV Caching](https://www.oreilly.com/library/view/hands-on-llm-serving/9798341621480/) - Read "Prefix Caching" in Chapter 6 (RadixAttention, use cases, best practices, scaling the prefix cache) and "Advanced KV Caching" in Chapter 7 (long context, cost and latency, LMCache). Separate exact-reuse mechanisms from capacity extensions such as offload.
- **Support - Book:** [AI Systems Performance Engineering - Chapter 18, tuning KV-cache utilization](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) - Read "Tuning KV Cache Utilization and Management" in Chapter 18 and "Prefix Caching" in Chapter 16. Leave the disaggregated pool and transfer sections for INF-7.
- **Required - Implementation:** [Nano-vLLM - Block Manager and Sequence Lifecycle](https://github.com/GeeeekExplorer/nano-vllm) - Trace nanovllm/engine/block_manager.py, sequence.py, scheduler.py and attention.py. Draw allocate, append, share, preempt and free transitions, then implement randomized allocator tests in your own project before touching production-engine code.
- **Required - Implementation:** [Mini-SGLang - Radix Cache and Cache Tests](https://github.com/sgl-project/mini-sglang) - Read docs/structures.md, the cache allocation code and tests/core/test_cache_allocate.py. Compare exact prefix identity and lifecycle with Nano-vLLM, then add tenant and version fields to your own prefix index.
- **Required - Reference:** [vLLM Automatic Prefix Caching Design](https://docs.vllm.ai/en/v0.31.0/design/prefix_caching/) - Check block hashing, extra hash keys (multimodal inputs, LoRA, cache salt), isolation and eviction against v0.31.0, the version pinned here; cache-key fields change between releases.
- **Support - Reference:** [SGLang documentation - Radix cache eviction and HiCache](https://docs.sglang.io/docs/advanced_features/radix_eviction_policy) - Use the radix eviction policy and session radix cache pages to compare eviction choices with vLLM, and the HiCache design page for a GPU, host and storage hierarchy.
- **Reference - Reference:** [AI Performance Engineering - KV Cache Systems](https://github.com/wafer-ai/gpu-perf-engineering-resources) - A curated index. Use Section 4 only to find a primary KV-cache source the other entries lack.
- **Support - Practice:** [100 Days of LLM Inference - Days 5, 9, 10 and 16](https://github.com/elizabetht/100-days-of-inference) - Use the four notebooks for KV arithmetic, paged allocation, radix reuse and prompt-layout experiments. Re-run conclusions against your own property tests and workload because these notebooks are a supplementary learning journal.
- **Support - Practice:** [TensorTonic Language Modeling from Scratch - Find Reusable Prefixes in a KV Trie](https://www.tensortonic.com/problems/cs336-l18-kv-prefix-trie) - Solve after the prefix-index unit and add the cases its public tests leave out to your own property tests.
- **Support - Course:** [LLM Inference: From scratch, one token at a time - Modules 02 and 06](https://inference.tusharamrit.in/modules/kv-cache.html) - Use The KV Cache for fragmentation and reuse and Memory Optimization for paging, prefix sharing and KV compression. Work the checkpoints before the matching units.
- **Support - Project:** [LLM Inference Systems Laboratory - KV State](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/capstones/llm-inference-systems-laboratory.md) - Implement the paged allocator and prefix index with differential, randomized, cancellation, collision, fork and pressure tests. Retain one reuse workload that improves hit rate but not goodput.
- **Reference - Reference:** [vLLM 0.31.0 - cache specifications and connector lifecycle](https://docs.vllm.ai/en/v0.31.0/api/vllm/v1/kv_cache_interface/) - Read the per-layer attention, MLA and Mamba specifications for hybrid state contracts; read the V1 connector metadata, load synchronization and deferred-free methods for transfer ownership. These fill the pool's hybrid-state and connector-contract gaps, without requiring distributed execution.

### Exit checkpoint

Pass long randomized allocate, append, fork, copy-on-write, evict and cancel histories, reconcile derived capacity with physical state, and show one workload where reuse helps and one where hit rate is misleading.

<details>
<summary>Deliberately left for later</summary>

- Distributed KV transfer before local ownership invariants pass
- Aggressive KV compression before quality and cache tests exist
- Cross-tenant reuse without an explicit isolation contract

</details>

## INF-4. Batching, Scheduling and Admission

**Why:** A serving scheduler decides which users progress, which memory is reserved and what happens under overload. Throughput, latency, fairness and cancellation must be visible in the same policy evaluation.

### Learn this much

- [ ] Static, dynamic and continuous batching _(Required)_
- [ ] Iteration-level token scheduling _(Required)_
- [ ] Waiting, running, preempted and terminal request sets _(Required)_
- [ ] Token budgets and maximum batched tokens _(Required)_
- [ ] Sequence-count and model-runner limits _(Required)_
- [ ] Memory admission and KV reserve _(Required)_
- [ ] Prefill and decode mixing _(Required)_
- [ ] Chunked prefill and decode protection _(Required)_
- [ ] Preemption, recomputation and swap vocabulary _(Required)_
- [ ] Priority classes and deadlines _(Required)_
- [ ] Fairness, starvation and priority inversion _(Required)_
- [ ] Head-of-line blocking and convoy effects _(Required)_
- [ ] Request cancellation and disconnect handling _(Required)_
- [ ] Overload, rejection and load shedding _(Required)_
- [ ] SLO-aware goodput _(Required)_
- [ ] Scheduler state and resource invariants _(Required)_
- [ ] Progress and bounded-wait invariants _(Required)_
- [ ] Continuous-batching simulator _(Required)_
- [ ] Deterministic workload replay _(Required)_
- [ ] Per-request scheduler event traces _(Required)_
- [ ] Long-prefill and decode-heavy workloads _(Required)_
- [ ] Mixed-length and bursty workloads _(Required)_
- [ ] Priority and cancellation workloads _(Required)_
- [ ] Offered-load sweep through saturation _(Required)_
- [ ] Queue growth and recovery analysis _(Required)_
- [ ] Policy ablation and negative regime _(Required)_
- [ ] Real-engine bounded policy change _(Required)_
- [ ] Adapter-affinity and prefix-locality scheduling _(Optional)_
- [ ] Structured-output and grammar-cost scheduling _(Optional)_
- [ ] Multimodal encoder and decoder co-scheduling _(Optional)_
- [ ] Learned or predictive service-time scheduling with safe fallback _(Depth)_
- [ ] Fleet-wide scheduling before single-engine policy evidence _(Later)_

### Study units

#### U1. Static, dynamic and continuous batching and iteration-level scheduling

**About 4 h** · **Target:** Explain

Topics: Static, dynamic and continuous batching; Iteration-level token scheduling

Real request lengths vary by orders of magnitude, so a fixed batch spends most slots idle. Iteration-level refill is the mechanism every later policy in this section assumes.

**You can now**

- Contrast static, dynamic and continuous batching, and name the drain condition each one removes.
- Explain iteration-level scheduling and selective batching at the operation level.
- Explain why a throughput-maximizing batch can harm TTFT, inter-token latency and memory availability.

**Study**

1. [Request batching: static, dynamic and continuous](https://www.oreilly.com/library/view/hands-on-llm-serving/9798341621480/) (Hands-On LLM Serving and Optimization - Chapter 6, batching and scheduling) - Chapter 6, Request Batching and Scheduling-Level Optimizations: Why Do We Need Batching in Real-Time Serving? (p.190) with Fig 6-1 and Fig 6-2 at max batch size 3; Dynamic Batching in Online Inference (p.191) with max batch size, max delay time and the ferry-boat tuning example; Continuous Batching for LLM Online Inference (pp.192-194) with Fig 6-3 idle time and Fig 6-4 in-flight refill.
2. [Batching: static cost, iteration loop and selective batching](https://inference.tusharamrit.in/modules/batching.html) (LLM Inference: From scratch, one token at a time - Module 05) - Concepts 01 and 02 with the utilization arithmetic, the five-step iteration loop and selective batching; Math by hand Part 1 (a) to (d).
3. [Orca iteration-level scheduling and selective batching](https://www.usenix.org/conference/osdi22/presentation/yu) (Orca: A Distributed Serving System for Transformer-Based Generative Models) - Section 3 iteration-level scheduling with Fig 4; Section 3.2 selective batching with Fig 5; Section 4.2 Algorithm 1 iteration-level FCFS with max batch size and `max_tokens` reservation. Depth: Skim the distributed execution in the rest of Section 4. Treat the 36.9x FasterTransformer throughput result as the paper's result on its hardware and workload, not a target.

**Focus**

- Slot utilization under static batching is mean length over max length, so one long request idles every shorter slot until it finishes.
- Dynamic batching bounds assembly wait with a timeout but still drains the whole batch, so variable output lengths still idle slots.
- Iteration-level scheduling admits and evicts at every decode step, which keeps the batch full regardless of length variance.
- Selective batching flattens position-independent operations across sequences into one large matrix multiply and handles attention per sequence, which is what makes mixed-position batches implementable.

**Reproduce:** Closed-book, compute slot utilization for output lengths [20, 35, 40, 60, 80, 120, 200, 900]: 900 iterations, 1455 useful sequence-steps, 20.2%. Then show batch 32 with mean 180 and longest 2000 gives 9%, and explain why growth moves it down: the max reaches further into the tail while the mean stays put.

**Traps**

- Calling continuous batching dynamic batching with a shorter timeout. Dynamic batching still runs each batch to completion; continuous batching changes the scheduling granularity to the iteration, which needs per-sequence KV management.
- Assuming a larger static batch is always better. Utilization falls as batch size grows because the longest of more samples grows while the mean does not, and padding wastes both arithmetic and KV memory.
- Quoting the 36.9x Orca result as expected gain. It compares against FasterTransformer on the paper's GPT-3 175B workload; your simulator should reproduce the direction and rough magnitude, not the number.

**Practice**

- [TensorTonic: Simulate Continuous Decode Batching](https://www.tensortonic.com/problems/cs336-l18-continuous-batching-scheduler) - Implement `continuous_batching_scheduler(requests, kv_capacity)`; public cases `scheduler_public_1`, `scheduler_public_2` and `scheduler_public_parallel_completion`. The public cases check arrival-order admission with skip-if-unfit, the two admission passes, active and finished ordering, and `kv_tokens_in_use` as actual use rather than reserved footprint. Compare its reserve-full-footprint rule with your simulator admission in the simulator unit.

**Stop when:** You reproduce both utilization numbers without notes and can trace which requests enter and leave each iteration on a small arrival timeline.

<details>
<summary>Self-test</summary>

1. A static batch of 8 has output lengths [20, 35, 40, 60, 80, 120, 200, 900]. What is the slot utilization?
   - 20.2%. Useful work is 1455 sequence-steps and capacity is $`8 \times 900 = 7200`$ sequence-steps.
2. The batch grows to 32 with mean length 180 and longest 2000. What happens to utilization and why?
   - It falls to 9%: $`32 \times 180 = 5760`$ useful over $`32 \times 2000 = 64{,}000`$ slots. More samples reach further into the length tail, so the max grows faster than the mean.
3. What scheduling change removes the wait for the longest sequence?
   - Decide every iteration instead of every request: evict each finished sequence and admit a waiting one on the next step, so slots refill without waiting for the batch maximum.
4. Why can the QKV projection batch across sequences at different positions while attention cannot?
   - The projection treats each token as an independent matrix row, so all tokens form one flat batch. Attention must stay within each request, since each sequence has its own KV length and positions.

</details>

#### U2. Waiting, running and preempted sets, token budgets and runner limits

**About 4 h** · **Target:** Explain + Derive

Topics: Waiting, running, preempted and terminal request sets; Token budgets and maximum batched tokens; Sequence-count and model-runner limits

Every iteration must fit both a request-count limit and a token limit. Misreading either knob admits batches that run out of memory or leaves paid capacity idle.

**You can now**

- Name the WAITING, RUNNING, PREEMPTED and terminal request sets and the event that moves a request between them.
- Derive whether a waiting request fits from active KV tokens, its new prefill tokens, decode tokens, batch limits and memory reserve.
- Predict admit, defer or preempt outcomes for a small request mix under stated budgets.

**Study**

1. [Two knobs: max batch size and max batched tokens](https://www.oreilly.com/library/view/hands-on-llm-serving/9798341621480/) (Hands-On LLM Serving and Optimization - Chapter 6, batching and scheduling) - Continuous Batching for LLM Online Inference (pp.194-195): Fig 6-5 relating max batch size, max number of tokens and max model length, with prefill bound by token count and decode by batch size; Example 6-1 `vllm serve Qwen/Qwen2.5-7B-Instruct --max-num-batched-tokens 4096 --max-num-seqs 128`.
2. [Nano-vLLM request sets and budget loop](https://github.com/GeeeekExplorer/nano-vllm/blob/bb823b3e06983d71485a8e1f23715ebd87d98ef8/nanovllm/engine/scheduler.py) (Nano-vLLM - Scheduler, Block Manager and Engine Loop) - `Scheduler.schedule`: the waiting and running deques with `SequenceStatus` in `nanovllm/engine/sequence.py`; the prefill loop over `max_num_seqs` and `max_num_batched_tokens` with chunking for the first sequence only; the decode loop with `can_append`, `may_append` and `preempt`.
3. [vLLM scheduler flags and defaults](https://docs.vllm.ai/en/v0.31.0/cli/serve/) (vLLM v0.31.0 serve CLI and scheduler arguments) - SchedulerConfig arguments: `--max-num-seqs`, `--max-num-batched-tokens`, `--max-num-active-seqs`, `--enable-chunked-prefill`, `--long-prefill-token-threshold` and `--scheduling-policy` with `fcfs` and `priority`.
4. [Orca admission with reservation](https://www.usenix.org/conference/osdi22/presentation/yu) (Orca: A Distributed Serving System for Transformer-Based Generative Models) - Section 4.2 Algorithm 1: `Select` admits at most `max_bs` requests in arrival order and reserves `max_tokens` slots per new request against `n_slots`, which guarantees its future KV fits.

**Focus**

- WAITING holds admitted-but-unscheduled and preempted requests, RUNNING holds scheduled ones, and terminal states end ownership and free blocks. PREEMPTED returns to WAITING, never directly to RUNNING.
- The token budget counts every scheduled token: one per decode sequence plus each prefill chunk. The sequence count caps live requests. A batch must satisfy both at once.
- Nano-vLLM schedules prefill first and returns early when any prefill is scheduled, so decode-only iterations happen only with no schedulable prefill. Only the first waiting sequence may take a partial chunk.
- Conservative admission reserves the full footprint up front, as Orca does with `max_tokens`. Optimistic admission packs tighter and relies on preemption, which the next unit covers.

**Reproduce:** Closed-book, decide admission with chunked prefill off, a token budget of 2048 and at most 8 sequences: 3 running sequences hold 1500 cached tokens and need 3 decode tokens, and two waiting prefills need 1200 and 900 tokens. Admit the 1200-token prefill ($`3 + 1200 = 1203 \le 2048`$) and defer the 900-token one ($`1203 + 900 = 2103 > 2048`$). State both checks in tokens and in sequence count, then say what changes with chunked prefill on (the vLLM default): the 900-token prefill gets an 845-token chunk instead of waiting.

**Traps**

- Treating the two knobs as phase-exclusive. Decode tokens also consume the token budget (one each), and long prefills also consume sequence slots; either limit can bind in any iteration.
- Reading `--max-num-seqs` as the only running cap. When `--max-num-active-seqs` is set, vLLM admits at most that many into RUNNING and parks the rest in deferred waiting; unset, the cap is `max_num_seqs`.
- Copying Example 6-1 values as defaults. Installed v0.31.0 defaults vary by GPU class and context, so derive feasibility from the flags on your engine, not from the book example.

**Practice**

- The section mini-project covers this: token-budget and sequence-count admission with admit, defer and preempt decisions on fixed request mixes.

**Stop when:** You derive admit or defer for a new mix without notes and can name the set each request sits in after every scheduler step.

<details>
<summary>Self-test</summary>

1. What moves a request from RUNNING to PREEMPTED, and where does it go next?
   - Memory pressure during decode admission: the scheduler reclaims its blocks and requeues it at the front of WAITING. It must be rescheduled and recomputed, never resumed in place.
2. A batch holds 4 decode sequences under a 2048-token budget. How many tokens of prefill chunk fit?
   - $`2048 - 4 = 2044`$ tokens. Each decode sequence contributes one token to the budget.
3. Why does Orca reserve `max_tokens` slots for a new request instead of its prompt length?
   - Output length is unknown at admission, so only the request's maximum possible footprint guarantees its future KV fits. The cost is lower admission under uncertain lengths.
4. Nano-vLLM has a schedulable prefill and free decode slots. Does the decode loop run?
   - No. `schedule` returns as soon as any prefill is scheduled, so decode-only iterations run only when no waiting prefill fits.

</details>

#### U3. Memory admission, KV reserve and preemption by recompute or swap

**About 4 h** · **Target:** Explain + Derive

Topics: Memory admission and KV reserve; Preemption, recomputation and swap vocabulary

Token budgets mean nothing if the KV blocks do not exist. Admission bets memory on unknown output lengths, and preemption is how the scheduler collects when the bet loses.

**You can now**

- Explain optimistic versus reserved memory admission and the deadlock each one prevents or risks.
- Contrast recompute and swap preemption and pick the cheaper one from sequence size and interconnect numbers.
- Derive the reserve needed to admit one more request without evicting a running one.

**Study**

1. [Admission bets, swap versus recompute, and the crossover](https://inference.tusharamrit.in/modules/batching.html) (LLM Inference: From scratch, one token at a time - Module 05) - Concept 05: admission control as a bet on unknown lengths; swap cost of moving 2.5 GiB at about 50 GB/s each way against recompute cost of one prefill; short sequences favour recomputation and long ones favour swapping. Depth: The module's 2.5 GiB at about 50 GB/s is about 54 ms each way once GiB is converted to GB; keep the two units apart.
2. [Nano-vLLM recompute preemption walkthrough](https://github.com/GeeeekExplorer/nano-vllm/blob/bb823b3e06983d71485a8e1f23715ebd87d98ef8/nanovllm/engine/scheduler.py) (Nano-vLLM - Scheduler, Block Manager and Engine Loop) - `Scheduler.preempt` with `BlockManager.deallocate` in `nanovllm/engine/block_manager.py`, requeue at the waiting front with `is_prefill` reset; the decode loop evicting from the running tail via `can_append` before `may_append`.
3. [Preemption states and counters in vLLM](https://docs.vllm.ai/en/v0.31.0/design/metrics/) (vLLM v0.31.0 metrics design) - PREEMPTED state with the queue-time and inference-time interval split across preemptions, and the note that swapped-preemption metrics are legacy because v1 preempts by recomputation. The `vllm:num_preemptions` counter and `vllm:request_num_preemptions` histogram are listed on the Production Metrics page, https://docs.vllm.ai/en/v0.31.0/usage/metrics/.
4. [Orca reservation against scheduler deadlock](https://www.usenix.org/conference/osdi22/presentation/yu) (Orca: A Distributed Serving System for Transformer-Based Generative Models) - Section 4.2 around Algorithm 1: reserving `max_tokens` slots per new request so the K/V manager never deadlocks with no space for the next token.

**Focus**

- Admission commits blocks for tokens that do not exist yet. Reserving the maximum bounds the risk and lowers fill; admitting on current length fills tighter and needs a working preemption path.
- Recompute discards KV and re-runs prefill on resume. Swap copies KV to host memory and back. The crossover sits where one prefill costs more than the round trip.
- Nano-vLLM only recomputes: `preempt` frees every block and the request restarts prefill from its tokens. vLLM v1 also preempts by recomputation; swap is gone, so size the reserve for recompute cost, not transfer cost.
- Repeated preemption of the same request signals an undersized reserve or an overpacked batch, not bad luck. Count preemptions per request and treat growth as the alarm.

**Reproduce:** Closed-book, compute the swap round trip for 2.5 GB at 50 GB/s each way: about 50 ms per direction, about 100 ms total. Then state the decision rule: recompute wins when one prefill of the sequence costs less than that round trip, which favours short sequences, and swap wins for long ones where prefill exceeds transfer.

**Traps**

- Assuming swap exists in vLLM v1. The engine removed swap space and preempts by recomputation, so a plan that prices preemption as a PCIe transfer misprices every eviction.
- Pricing preemption as free because tokens are reused. Recompute re-runs the full prefill and re-consumes its token budget, which delays every other waiter.
- Reserving exactly the prompt length. Growth during decode is the risk, so the reserve must cover future tokens or the scheduler must be ready to preempt on the first append that does not fit.

**Practice**

- The section mini-project covers this: KV-reserve admission, recompute preemption with per-request preemption counts, and a workload that forces repeated eviction.

**Stop when:** You price swap against recompute for a sized sequence without notes and can trace blocks from admission through preemption to resume.

<details>
<summary>Self-test</summary>

1. What deadlock does Orca reservation prevent?
   - A pool full of running requests with no free slot for any next token, where no iteration can issue and no request can finish to free space. Reserving the maximum footprint admits only requests whose completion fits.
2. A 2.5 GB sequence faces preemption on a 50 GB/s link. What does swap cost, and when is recompute cheaper?
   - About 50 ms each way, about 100 ms total. Recompute is cheaper when one prefill of that sequence costs less than the round trip.
3. Nano-vLLM preempts a decode sequence. What exactly is freed and what restarts?
   - `deallocate` frees all its blocks and zeroes its cached tokens, and the sequence requeues at the waiting front with `is_prefill` set, so it restarts with prefill from its stored tokens.
4. One request preempts five times while others preempt never. What should you change?
   - The admission policy, not the request. Repeated preemption of the same victim means the reserve is too small or the batch is overpacked; raise the reserve or tighten admission.

</details>

#### U4. Mixing prefill and decode, and chunked prefill to protect decode

**About 4 h** · **Target:** Derive + Measure

Topics: Prefill and decode mixing; Chunked prefill and decode protection

One long prefill can freeze every streaming user for hundreds of milliseconds. Chunking bounds each iteration to a token budget, which protects decode without a separate prefill fleet.

**You can now**

- Derive per-iteration cost with and without chunking for a stated prompt size and decode batch.
- Predict how a chunk budget moves TTFT, worst inter-token latency and total prefill time.
- Measure the chunk-budget tradeoff on your GPU or simulator and name the budget region that holds.

**Study**

1. [Chunked prefill against decode stalls](https://www.oreilly.com/library/view/hands-on-llm-serving/9798341621480/) (Hands-On LLM Serving and Optimization - Chapter 6, batching and scheduling) - Continuous Batching with Chunked Prefill (pp.195-198): Fig 6-6 happy path, Fig 6-7 prefill-priority stall, Fig 6-8 hybrid batching still stalls, Fig 6-9 chunked prefill; the ITL gain against TTFT and prefill-overhead cost; chunk size as part of max batched tokens.
2. [Sarathi-Serve stall-free batching and token budget](https://arxiv.org/abs/2403.02310) (Sarathi-Serve: Tackling Throughput-Latency Tradeoffs in LLM Inference) - Sections 3.2 (arXiv:2403.02310v3) generation stalls with Fig 7; 4.1 chunked-prefills; 4.2 stall-free batching with Algorithm 3, which packs running decodes first, then a partial prefill, then new requests within the token budget; 4.3 token-budget choice from the TBT SLO with tile-quantization and profiling notes. Depth: Skip the pipeline-parallel bubble analysis in Fig 8 and Section 5.3 until the distributed section. Treat Fig 10, Fig 11, Fig 14 and Table 4 numbers as the paper's results on its hardware, not targets.
3. [Stall-free scheduling cost analysis](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 16 and 18, scheduling and admission) - Stall-Free Scheduling (Chunked Prefill) (p.998) with Table 16-5 chunk costs; the $`N(N + 1)/2`$ per-layer-per-head attention analysis (p.1001), which shows chunking smooths latency without reducing total work.
4. [Interference numbers and budget tradeoff](https://inference.tusharamrit.in/modules/batching.html) (LLM Inference: From scratch, one token at a time - Module 05) - Concepts 03 and 04: the four scheduling policies with their costs; the token-budget fill order with decode tokens first; the budget tradeoff table for 256, 2048 and 8192 tokens.

**Focus**

- Prefill-priority gives best TTFT and worst token-stream stability, decode-priority gives smooth streams and starving prefills, chunking bounds every iteration, and disaggregation removes the conflict with separate hardware.
- Each iteration fills decode tokens first because they are cheap and latency-critical, then one prefill chunk with the remainder of the budget, so iteration time stays near constant.
- Chunking changes when attention work runs, not how much: self-attention still performs about $`N(N + 1)/2`$ QK dot products per layer per head. The mixed iteration is nearly free because decode leaves arithmetic capacity unused.
- Small budgets steady the stream but underfeed the GPU and add chunk overhead; large budgets approach unchunked stalls. Sarathi-Serve evaluates 512 to 2048; the vLLM 0.31.0 server default is 2048, or 8192 on GPUs with 70 GiB or more other than A100.

**Reproduce:** Closed-book, price an 8000-token prompt arriving while 32 sequences decode, with the module's Llama-3-8B on H100 model at 70% of 989 TFLOP/s and its bandwidth model: unchunked prefill costs about 186 ms, which is the worst inter-token latency the decoders see. At a 2048-token budget the prefill takes 4 iterations (three 2016-token chunks and a 1952-token tail) of about 47 ms each, total about 188 ms, so worst inter-token latency falls to about 47 ms while TTFT barely moves.

**Traps**

- Saying chunked prefill reduces total attention work. It replays KV reads per chunk and adds launch overhead, so total work is unchanged or slightly higher; the win is bounded iteration time.
- Calling chunking a pure TTFT-for-TPOT trade. The mixed iteration moves the same bytes as a decode-only one while doing far more arithmetic, so both phases beat running separately.
- Setting the smallest budget that fits. Down at 256 tokens the GPU starves and overhead dominates, which the paper's Fig 14 shows as up to about 25% extra prefill cost at chunk 512 against negligible cost at 2048.

**Practice**

- [LLM Inference Module 05 code lab: chunk-budget sweep](https://inference.tusharamrit.in/modules/batching.html) - Code lab: run the budget table for 256, 512, 1024, 2048 and 8192 and record throughput with ITL p50, p99 and max. Expect ITL max to fall sharply as the budget shrinks with ITL p50 nearly flat and a slight throughput dip at 256. Absolute numbers depend on the sampling seed; keep the table for the ablation unit.

**Stop when:** You derive the module's 186 ms stall and the 4-iteration chunked schedule without notes and can defend a budget choice from a measured table.

<details>
<summary>Self-test</summary>

1. Why does one 8000-token prefill stall 32 decoders for about 186 ms?
   - In the module's Llama-3-8B on H100 model, the prefill runs as one compute-bound unit costing $`2 \times 8.03 \times 10^{9} \times 8000`$ FLOP, about 186 ms at 70% of 989 TFLOP/s. The decoders share the same hardware turn by turn, so they emit nothing until it finishes.
2. At a 2048-token budget with 32 decoders, how many iterations does that prefill take and what bounds each one?
   - 4 iterations carrying at most 2016 prefill tokens each: three full chunks and a 1952-token tail. Each iteration is bounded by the budget, so the worst inter-token latency is one chunk cost, about 47 ms, instead of the full 186 ms.
3. Does chunking change the total QK work of the prefill?
   - No. Self-attention still performs about $`N(N + 1)/2`$ dot products per layer per head; chunking only spreads them across iterations. Repeated KV reads add a small overhead.
4. The budget drops from 2048 to 256. What improves and what degrades?
   - Worst inter-token latency improves toward pure decode steps. TTFT stretches over more iterations, throughput dips because 256 tokens underfeed the GPU, and per-chunk overhead grows.

</details>

#### U5. Priorities, deadlines, fairness, starvation and head-of-line blocking

**About 4 h** · **Target:** Explain + Derive

Topics: Priority classes and deadlines; Fairness, starvation and priority inversion; Head-of-line blocking and convoy effects

FCFS treats unequal work equally, so one pasted document can delay every request behind it. Priority fixes that for some users by hurting others, which is why fairness needs an explicit definition.

**You can now**

- Explain priority classes, deadlines, fairness, starvation, priority inversion and head-of-line blocking with scheduler examples.
- Derive the convoy delay a long prompt imposes on short requests behind it under FCFS.
- Define an aging rule that bounds maximum wait without abandoning priority order.

**Study**

1. [Queueing policy, fairness and the starvation trap](https://inference.tusharamrit.in/modules/batching.html) (LLM Inference: From scratch, one token at a time - Module 05) - Concept 05: FCFS against shortest-job-first with unknown output lengths; the priority and fairness discussion with its unclear unit of fairness in requests, tokens or GPU time; the starvation trap of decode-priority policies.
2. [Latency-aware scheduling and tiered quality of service](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 16 and 18, scheduling and admission) - Latency-Aware Scheduling and Dynamic Routing (p.1001) with the six-prompt two-GPU routing example; Quality of Service (p.1147) with `configs/qos.yaml` reserving 10%, 30% and 60% of prefill and decode workers for premium, standard and free tiers.
3. [Iteration-level FCFS and the batch-size tradeoff](https://www.usenix.org/conference/osdi22/presentation/yu) (Orca: A Distributed Serving System for Transformer-Based Generative Models) - Section 4.2 iteration-level FCFS definition: an earlier arrival runs the same or more iterations than a later one; the max batch size knob trading throughput against latency.

**Focus**

- FCFS is fair in arrival order but blind to size, so a long prefill at the head blocks every short request behind it. That convoy is head-of-line blocking in scheduler form.
- The fair unit is a choice, not a fact. One 100k-token request and a thousand 100-token requests consume comparable resources through different shapes, so state whether you equalize requests, tokens or GPU time.
- Any strict priority can starve the bottom class under sustained load, because higher-priority work always exists. Aging raises a waiter's priority with its wait until it must win.
- Reserved capacity shares the machine under contention; it does not promise latency. A premium tier with 10% reserved still queues when its own demand exceeds that share.

**Reproduce:** Closed-book, derive convoy delay under FCFS with the module's Llama-3-8B on H100 model, whose prefill runs at $`R = 692 \times 10^{12} / (2 \times 8.03 \times 10^{9}) \approx 43{,}000 \text{ tokens/s}`$: one 100000-token prompt ahead of ten 100-token prompts adds about $`100000 / 43000 = 2.3 \text{ s}`$ to every short request's TTFT, independent of their size. Then state an aging rule, such as effective priority rising linearly with wait, that bounds any request's wait under continuous decode-priority load.

**Traps**

- Promising that priority lowers latency for everyone. It redistributes wait from one class to another; the total work is unchanged and the bottom class waits longer.
- Reading a reserved fraction as a latency guarantee. `reserved_fraction` splits workers under contention, so a tier still queues past its share and still suffers its own convoys.
- Reaching for shortest-job-first to fix convoys. Output length is unknown at admission and predictions are poor, so exact SJF is unavailable; size-aware admission needs an honest proxy such as prompt length.

**Practice**

- The section mini-project covers this: priority classes with aging, a convoy workload, and a starvation test that fails without the aging rule.

**Stop when:** You derive a convoy delay without notes and can show which workload starves under each policy you studied.

<details>
<summary>Self-test</summary>

1. Why does FCFS produce convoys even though it is fair?
   - It orders by arrival without regard to size. A long prefill at the head occupies the shared hardware while short requests behind it wait, so small jobs pay for work unrelated to their size.
2. What makes priority inversion possible in a serving scheduler?
   - A low-priority request holds a contended resource, such as the running batch or KV blocks, while a high-priority waiter cannot proceed until it releases. The priority order says the waiter matters more, but the resource order serves the holder first.
3. A decode-priority scheduler never idles under load. Why can a new request still starve?
   - There is always more decode work under sustained load, so prefills never win an iteration. Without aging, a request can wait unboundedly while the machine looks fully utilized.
4. Premium reserves 10% of workers. Does a premium request skip queueing?
   - No. The reserve protects premium from free-tier contention, not from premium-tier contention. Past its share it queues like everyone else.

</details>

#### U6. Cancellation, disconnects, overload, rejection and SLO-aware goodput

**About 4 h** · **Target:** Explain + Implement

Topics: Request cancellation and disconnect handling; Overload, rejection and load shedding; SLO-aware goodput

Load always exceeds capacity eventually. Requests that miss their deadline are wasted work, and cancelled requests that leak blocks slowly strangle the server.

**You can now**

- Explain cancellation and client-disconnect handling with cleanup ownership at every request phase.
- Explain early rejection and load shedding as goodput protection under overload.
- Implement an abort path that frees blocks, records a terminal state and keeps goodput accounting honest.

**Study**

1. [Early rejection and fault tolerance](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 16 and 18, scheduling and admission) - Early Rejection (Admission Control) (pp.1144-1147): predicting SLO misses from queue and throughput signals, fail-fast against queue-then-miss, Fig 18-8 instance load on p.1147; the Quality of Service tail (pp.1147-1148) with TTFT and TPOT p99 monitoring and the prefill and decode queue split; Fault Tolerance (p.1148) with decode-node failover via KV pooling.
2. [Mini-SGLang abort path](https://github.com/sgl-project/mini-sglang/blob/9a91cfafe754aa85daee49998176275667eb58f2/python/minisgl/scheduler/prefill.py) (Mini-SGLang - Scheduler and Overlap Scheduling) - `PrefillManager.abort_req` in `python/minisgl/scheduler/prefill.py` with `DecodeManager.abort_req` in `python/minisgl/scheduler/decode.py`, dispatched from `_process_one_msg` in `python/minisgl/scheduler/scheduler.py`; trace where each path frees the request's resources.
3. [vLLM cancellation endpoints](https://docs.vllm.ai/en/v0.31.0/serving/online_serving/) (vLLM v0.31.0 online serving) - `/abort_requests` for all in-flight or listed request ids without pausing the scheduler; the Responses cancel API at `/v1/responses/{response_id}/cancel`. The page does not cover client disconnects, which the v0.31.0 server handles in `with_cancellation`; confirm on your engine that dropping a streaming client stops its tokens and frees its blocks.
4. [Terminal accounting in vLLM metrics](https://docs.vllm.ai/en/v0.31.0/design/metrics/) (vLLM v0.31.0 metrics design) - The queue-time against inference-time split, and TTFT, inter-token and end-to-end latency histograms as the goodput inputs. `vllm:request_success` with its `finished_reason` label (`abort` among the v0.31.0 values) is listed on the Production Metrics page, https://docs.vllm.ai/en/v0.31.0/usage/metrics/.

**Focus**

- Cancel at any phase: waiting removal, prefill-chunk abandonment and decode eviction must all free blocks and mark a terminal state, or the leak accumulates one request at a time.
- A client disconnect is an implicit cancel. The server cannot rely on the client to say goodbye, so streaming endpoints must watch the connection and abort promptly.
- Early rejection protects the accepted load: refusing work that would miss its SLO keeps TTFT and TPOT for the rest, while queueing everything maximizes completions and minimizes goodput.
- Goodput counts only completions that meet the SLO over offered requests. Aborted, rejected and late requests are not throughput, and retried work multiplies load as the systems overload-control unit shows.

**Reproduce:** Closed-book, implement `abort(request_id)` in your simulator: remove the request from whichever set holds it, free its blocks, append a terminal ABORTED record with its phase, and assert no block stays reserved. Then compute goodput for 10 offered requests with 7 on-time completions, 2 late completions and 1 abort: $`7/10 = 0.7`$, not 9/10.

**Traps**

- Deleting the request from the queue and calling it cancelled. Its KV blocks stay reserved until something frees them, so the leak only shows under sustained cancel load.
- Counting retries as new offered load. Client retries multiply the original overload, which is why rejection must pair with retry budgets rather than replace them.
- Averaging latency over completed requests only. Dropped and late requests vanish from that mean while users still waited, so goodput over offered load is the honest denominator.

**Practice**

- The section mini-project covers this: cancellation at every phase with leak checks, overload rejection with retry budgets, and goodput computed over offered load.

**Stop when:** Your abort path passes a cancel-at-every-phase test with zero leaked blocks, and you compute goodput over offered load without notes.

<details>
<summary>Self-test</summary>

1. A decode request disconnects mid-stream. List what the server must do.
   - Abort the in-flight request, free its KV blocks, mark it terminal with an abort reason, and stop scheduling further tokens for it. Anything less leaks memory or burns compute on a gone client.
2. Why does early rejection raise goodput while lowering raw completions?
   - It refuses requests predicted to miss their SLO, so the accepted ones meet TTFT and TPOT targets. Raw completions fall by the rejected count, but SLO-meeting completions over offered load rise.
3. Ten requests are offered: 7 on time, 2 late, 1 aborted. What are throughput and goodput denominators telling you?
   - 9 completions over 10 offered is completion rate, not success. Goodput is 7/10: only on-time completions count, because late outputs already failed the contract.
4. Where does Mini-SGLang route a cancel, and why two paths?
   - Through `_process_one_msg` to `PrefillManager.abort_req` or `DecodeManager.abort_req`. A request can sit in either manager, so the cancel must reach whichever one owns it.

</details>

#### U7. Scheduler state, resource, progress and bounded-wait invariants

**About 4 h** · **Target:** Derive + Implement

Topics: Scheduler state and resource invariants; Progress and bounded-wait invariants

Policies change, but the invariants do not. Every admission, preemption, cancel and finish path must preserve the same ownership and progress rules, or one path corrupts the rest.

**You can now**

- Define state, resource, progress and bounded-wait invariants for a continuous-batching scheduler.
- Derive the no-overcommit admission rule from reserved blocks, running growth and free capacity.
- Implement per-iteration invariant checks that catch leaks, double frees and stalled waiters.

**Study**

1. [Nano-vLLM scheduler as a checkable state machine](https://github.com/GeeeekExplorer/nano-vllm/blob/bb823b3e06983d71485a8e1f23715ebd87d98ef8/nanovllm/engine/scheduler.py) (Nano-vLLM - Scheduler, Block Manager and Engine Loop) - `Scheduler` waiting and running deques with `SequenceStatus` in `nanovllm/engine/sequence.py`; allocate, append, share, preempt and free transitions in `nanovllm/engine/block_manager.py`; `postprocess` finishing with `running.remove` and `deallocate`.
2. [Mini-SGLang scheduler structure and lifecycle](https://github.com/sgl-project/mini-sglang/blob/9a91cfafe754aa85daee49998176275667eb58f2/docs/structures.md) (Mini-SGLang - Scheduler and Overlap Scheduling) - `docs/structures.md` System Architecture with Key Components and the 8-step Data Flow request lifecycle; `Scheduler._schedule_next_batch` with `PrefillManager` and `DecodeManager` in `python/minisgl/scheduler/`. Depth: Read the rank-0 loop only. Skip the multi-GPU broadcast, ZMQ and NCCL parts on one GPU.
3. [Orca reservation and progress properties](https://www.usenix.org/conference/osdi22/presentation/yu) (Orca: A Distributed Serving System for Transformer-Based Generative Models) - Section 4.2 Algorithm 1 reservation of `max_tokens` slots per new request against `n_slots`; the iteration-level FCFS property that an earlier arrival runs the same or more iterations than a later one.

**Focus**

- Ownership: every block is free or referenced by live requests with a matching count, and every RUNNING request holds a non-empty block table. Freeing checks the count; shared prefix blocks survive one holder's release.
- No overcommit: reserved plus running growth fits free capacity before any admit. Reservation is the static form; vLLM's runtime form is the `watermark` headroom and the full-input-length admission check, `scheduler_reserve_full_isl`, in its scheduler configuration.
- Progress: every iteration retires finished requests, frees their blocks and advances at least one waiter or token. Steady completions with a never-served waiter still violate progress.
- Bounded wait: aging or reserved capacity turns FCFS order into a wait bound. State the bound as a number of iterations or requests served, not as good intentions.

**Reproduce:** Closed-book, write `check_invariants` for a Nano-vLLM-style scheduler and run it after every `schedule`, `preempt` and `postprocess` call: reserved plus running blocks fit total blocks, every RUNNING sequence has a non-empty block table, every FINISHED sequence left running with freed blocks, and the longest waiter advances within the stated bound. Show it catching a finish path that forgets `deallocate`.

**Traps**

- Checking invariants only on admission. Preempt, finish and abort paths move the same state, so the check must run after every transition, including the error paths.
- Confusing a positive reference count with exclusive ownership. Shared prefix blocks outlive one holder, so freeing must decrement and test rather than release outright.
- Reading steady throughput as progress. A scheduler can complete easy requests forever while one waiter starves, which throughput hides and the bounded-wait check exposes.

**Practice**

- The section mini-project covers this: per-iteration invariant asserts with randomized admit, preempt, cancel and finish histories, including a seeded leak it must catch.

**Stop when:** Your checks run green on a randomized history and catch an injected missing-free and an injected stuck waiter.

<details>
<summary>Self-test</summary>

1. State the no-overcommit rule in one sentence with its three quantities.
   - Admit only when reserved blocks plus running growth fits free blocks. The three quantities are current reservations, worst-case growth of running requests, and free capacity.
2. A finish path removes the sequence from running but skips `deallocate`. Which check catches it?
   - The ownership check: the finished sequence still holds blocks that no live request references, so they never return to the free list. Held plus free still equals total, so a count check alone misses it.
3. Why must the invariant check run after preemption, not just admission?
   - Preemption moves blocks back to free and the request back to waiting with reset counters. A wrong requeue or a missed counter reset corrupts the same state admission relies on.
4. Throughput is flat at a healthy value but the longest waiter never advances. Which invariant fails?
   - Bounded wait. Progress of completions does not imply progress of every waiter; the wait bound needs its own check with the waiter's age.

</details>

#### U8. A continuous-batching simulator with deterministic replay and event traces

**About 6 h** · **Target:** Implement

Topics: Continuous-batching simulator; Deterministic workload replay; Per-request scheduler event traces

Policies cannot be compared on a live server with random arrivals. A deterministic simulator with event traces turns scheduling opinions into checkable claims before touching a real engine.

**You can now**

- Implement a continuous-batching simulator with admission, token and memory budgets, chunking, preemption, priority, cancellation and overload.
- Replay a fixed workload deterministically and emit per-request state and timing traces.
- Compare two policies from request traces rather than aggregate throughput alone.

**Study**

1. [Nano-vLLM engine loop as the simulation skeleton](https://github.com/GeeeekExplorer/nano-vllm/blob/bb823b3e06983d71485a8e1f23715ebd87d98ef8/nanovllm/engine/llm_engine.py) (Nano-vLLM - Scheduler, Block Manager and Engine Loop) - `LLMEngine.step` in `nanovllm/engine/llm_engine.py`: schedule, model call, postprocess; mirror it as admit, step, complete and free in your simulator, with `Scheduler.schedule`, `preempt` and `postprocess` in `nanovllm/engine/scheduler.py` as the policy surface.
2. [Orca scheduling algorithm as the correctness baseline](https://www.usenix.org/conference/osdi22/presentation/yu) (Orca: A Distributed Serving System for Transformer-Based Generative Models) - Section 4.2 Algorithm 1 with `Select` in arrival order, `max_bs` cap and `max_tokens` reservation; hand-trace one small timeline through it before trusting your simulator on the same input.
3. [Deterministic replay contract](https://www.tensortonic.com/problems/cs336-l18-continuous-batching-scheduler) (TensorTonic Language Modeling from Scratch - Simulate Continuous Decode Batching) - The `continuous_batching_scheduler` statement: arrival-time ordering with input-order tiebreaks, admission before decoding and again after completions release capacity, idle-gap skipping, and recorded step dicts with admitted, active, finished and `kv_tokens_in_use` as actual use.
4. [Mini-SGLang scheduler loop and driver script](https://github.com/sgl-project/mini-sglang/blob/9a91cfafe754aa85daee49998176275667eb58f2/python/minisgl/scheduler/scheduler.py) (Mini-SGLang - Scheduler and Overlap Scheduling) - `Scheduler._schedule_next_batch` with `PrefillManager.schedule_next_batch(prefill_budget)` and overlap against normal loop in `python/minisgl/scheduler/scheduler.py`; the manual end-to-end driver in `tests/core/test_scheduler.py` as a single-prompt loop (it sends one request and drains detokenizer messages; it emits no scheduler traces, so record them in your own simulator).
5. [Scheduler laboratory path](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/capstones/llm-inference-systems-laboratory.md) (LLM Inference Systems Laboratory - Scheduler) - The scheduler and KV checkpoints and the contribution requirement: a recorded corpus with priority and cancellation distributions, no-overcommit and bounded-overload invariants, and one contribution carried through the real engine path with a reference fallback and versioned configuration.

**Focus**

- One loop does everything: admit arrivals, assemble the iteration within budgets, advance one step, retire finished requests and free their state. Every policy is a different admit-and-assemble rule inside that loop.
- Determinism needs a fixed request corpus, a fixed seed and a recorded configuration. Same inputs must yield byte-identical traces, including preemption and cancel events.
- Trace per request, not per batch: arrival, admit, each state move, preemptions, cancel and completion with timestamps. Policy differences hide in request timelines that batch averages erase.
- The simulator proves scheduling logic, not speed. Execution times, kernel shapes, cache reuse and host overhead are modeled coarsely, so every simulated win needs a bounded real-engine check later.

**Reproduce:** Closed-book, hand-simulate requests A with 2 prompt and 2 new tokens and B with 1 prompt and 1 new token at capacity 4 with full-footprint reservation: step 0 admits A, active [A], finished none, 3 tokens in use; step 1 finishes A, admits B, active [B], finished [A], 1 in use; step 2 finishes B with nothing active and 0 in use. Then implement that trace as your simulator's first regression test.

**Traps**

- Iterating over sets or dicts for admission order. Iteration order is not arrival order, so the replay diverges run to run; sort explicitly by arrival time and input order.
- Recording state after the first admission pass. Completions free capacity for a second pass in the same step, so record after the second pass or the trace understates fill.
- Quoting simulator milliseconds as engine results. The cost model is approximate by construction; the simulator ranks policies and the engine decides by how much.

**Practice**

- The section mini-project covers this: the continuous-batching simulator with deterministic replay, per-request event traces, and the hand-simulated regression test above.

**Stop when:** Two runs of your simulator on the fixed corpus produce identical traces, and your hand trace matches the implementation exactly.

<details>
<summary>Self-test</summary>

1. What three inputs must be fixed for a deterministic replay?
   - The request corpus with arrivals and lengths, the random seed, and the full scheduler configuration. Any one of them drifting breaks trace equality.
2. Why record traces per request instead of per batch?
   - Batch aggregates average away who waited, who preempted and who starved. Request timelines show which policy decision caused each delay.
3. Your simulator says policy X beats Y by 30%. What is still unknown?
   - Whether the win transfers: real execution times, kernel shapes, cache reuse and host overhead differ from the model, so X needs a bounded real-engine run before the claim stands.
4. Where does the second admission pass fit in one simulated step?
   - After completions release capacity and before recording. Admit, decode, complete, admit again, then record admitted, active, finished and tokens in use.

</details>

#### U9. Long-prefill, decode-heavy, mixed, bursty, priority and cancellation workloads

**About 4 h** · **Target:** Measure

Topics: Long-prefill and decode-heavy workloads; Mixed-length and bursty workloads; Priority and cancellation workloads

A policy tuned on chat traffic meets a pasted document sooner or later. Adversarial workloads reveal each policy's failure mode while the fix is still cheap.

**You can now**

- Predict queue and phase behavior for long-prefill, decode-heavy, mixed, bursty, priority and cancellation workloads.
- Compare policies on at least three workload distributions with latency, goodput, memory, fairness and error evidence.
- Keep one workload where the preferred policy regresses and explain it from traces.

**Study**

1. [Sarathi-Serve capacity workloads and SLOs](https://arxiv.org/abs/2403.02310) (Sarathi-Serve: Tackling Throughput-Latency Tradeoffs in LLM Inference) - Section 5 (arXiv:2403.02310v3) capacity evaluation: `openchat_sharegpt4` with median prompt 1730 tokens against `arxiv_summarization` with median 7059, under strict and relaxed latency SLOs with Fig 10 and Fig 11; Section 5.4 ablation of chunking and hybrid batching in isolation and combined. Depth: Use the workload shapes and SLO split as your design template. Treat the capacity multiples as the paper's results on its hardware, not targets.
2. [Workload model and extension points](https://inference.tusharamrit.in/modules/batching.html) (LLM Inference: From scratch, one token at a time - Module 05) - Code lab workload model: lognormal prompts and outputs with Poisson arrivals; the follow-up exercises for a KV memory cap with recompute preemption and a priority queue with aging.
3. [Mixed-length workload that motivates refill](https://www.oreilly.com/library/view/hands-on-llm-serving/9798341621480/) (Hands-On LLM Serving and Optimization - Chapter 6, batching and scheduling) - Continuous Batching for LLM Online Inference (pp.192-194): Fig 6-3 uneven lengths causing idle time and Fig 6-4 in-flight refill; reproduce this shape as the first adversarial mix before adding bursts, priorities and cancels.

**Focus**

- Each workload attacks one mechanism: long prefills attack inter-token latency, decode-heavy mixes attack the memory cap, mixed lengths attack convoys, bursts attack the queue, priorities attack starvation, and cancels attack cleanup.
- Freeze the corpus across policies. Same arrivals, same lengths, same seed; only the policy changes, or the comparison measures the workload instead of the scheduler.
- Report tails, fairness and errors beside throughput. The adversarial signal lives in p99, maximum wait, preemption counts and leaked blocks, not in the mean.
- Keep the losing workload in the report. A policy without a documented regression is an untested policy, and the checkpoint requires one.

**Reproduce:** Closed-book, specify a six-request adversarial set: one 8000-token prefill, three short chats, one simultaneous arrival pair, and one request cancelled mid-decode. Predict for unchunked continuous batching: worst inter-token latency near one full prefill cost during the long prefill (about 186 ms in the module's Llama-3-8B on H100 example; recompute it for your model and GPU), the burst pair queues behind the running batch, and the cancel must free its blocks or memory accounting drifts. Then run it and compare prediction against trace.

**Traps**

- Tuning on one friendly workload. Chat-only traffic hides prefill stalls, document-only traffic hides convoys, and steady rates hide bursts; the suite needs all of them.
- Regenerating the workload per policy run. Fresh random draws confound policy effects with sampling noise, so generate once, save the corpus and replay it.
- Averaging the adversarial tail away. A mean over a bursty run can look healthy while every burst request missed its SLO; percentiles and per-request timelines carry the verdict.

**Practice**

- The section mini-project covers this: the long-prefill, decode-heavy, mixed, bursty, priority and cancellation workload suite with frozen corpora and per-policy traces.

**Stop when:** Three frozen workloads rank two policies differently and you explain each ranking from request traces, including one regression.

<details>
<summary>Self-test</summary>

1. Which workload breaks a decode-priority scheduler, and what is the visible symptom?
   - Sustained overload with fresh arrivals. Prefills never win an iteration, so new requests queue unboundedly while decoders look busy; the symptom is growing TTFT with flat token output.
2. Why pair a long-prefill workload with a cancellation workload?
   - Long prefills raise preemption and eviction pressure, which exercises the paths cancels also use. A leak that is invisible at low churn becomes measurable when both run together.
3. Two policies tie on throughput but differ on the bursty workload. What decides?
   - Tail and fairness evidence: p99 and maximum wait during bursts, preemption counts, and whether any burst request starved. Throughput already failed to discriminate.
4. Why must the corpus stay fixed across policies?
   - Otherwise arrival and length differences explain the outcome as well as the policy does. A frozen corpus with a fixed seed isolates the scheduler as the only variable.

</details>

#### U10. Offered-load sweeps through saturation, queue growth and recovery

**About 4 h** · **Target:** Measure

Topics: Offered-load sweep through saturation; Queue growth and recovery analysis

Every capacity number is a saturation story. Without a sweep that crosses the knee, a single load point cannot tell headroom from overload.

**You can now**

- Sweep offered load through saturation with fixed corpus, warmup and repeated trials.
- Report queue growth, admission, shedding, tail behavior and recovery from raw per-request records.
- Separate queueing stalls from execution stalls in the saturated regime.

**Study**

1. [Offered-load sweeps with vLLM bench serve](https://docs.vllm.ai/en/v0.31.0/benchmarking/cli/) (vLLM v0.31.0 benchmark CLI) - `vllm bench serve` with `--request-rate` sweeps across saturation; `vllm bench throughput` and `vllm bench latency` for endpoint and phase baselines; keep the raw per-request results with fixed dataset, lengths, warmup and sampling.
2. [Capacity under strict and relaxed SLOs](https://arxiv.org/abs/2403.02310) (Sarathi-Serve: Tackling Throughput-Latency Tradeoffs in LLM Inference) - Section 5 (arXiv:2403.02310v3): capacity as sustainable load under strict and relaxed latency SLOs with Fig 10 and Fig 11; the finding that baseline schedulers violate the p99 TBT SLO before reaching maximum throughput, so relaxing the target raises capacity.
3. [Inflection point and rejection under load](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 16 and 18, scheduling and admission) - Dynamic Batching (pp.991-992): p50 latency staying flat or dropping with throughput up to an inflection point, with SLO-relative batch-delay sizing; Early Rejection (p.1144) with Fig 18-8 instance load under admission control.

**Focus**

- Drive open-loop with intended-time latency, as the saturation unit in the observability section defines. Closed-loop generation waits for replies and hides the queue you came to measure.
- Saturation has a signature: queue wait passes service time, goodput flattens while offered load climbs, and p99 explodes first. Little's law $`L = \lambda W`$ ties the queue length you see to the wait users feel.
- Recovery is part of the result: after the burst ends, report drain time until the queue empties and latency returns. A system that never drains never recovered.
- Queueing versus execution needs separate evidence. Queue, prefill and decode timestamps per request tell whether the stall sat in WAITING or inside the model step.

**Reproduce:** Closed-book, specify a sweep: double the request rate from clearly below to clearly above capacity on a frozen corpus with warmup and three trials per point. Predict the shape: flat p50 to an inflection, then p99 explosion with goodput plateau while completions keep rising late. Then state the recovery check: stop arrivals, measure drain time to empty queue and baseline latency.

**Traps**

- Calling a closed-loop sweep a saturation test. Self-throttling caps offered load at served load, so the queue never grows past the concurrency limit and the overload an open-loop rate would expose stays hidden.
- Reading capacity off peak throughput without an SLO. Baselines in this unit's papers saturate their latency target first, so the honest capacity is the highest load that still meets TTFT and TPOT.
- Reporting one run per load point. Queueing systems vary run to run near saturation, so single runs confuse noise with the knee; repeat and show the spread.

**Practice**

- The section mini-project covers this: offered-load sweeps through saturation with raw records, queue-growth and recovery analysis, and the stall split.

**Stop when:** Your sweep shows the inflection with error bars and you explain the saturated regime from per-request stamps, including drain time.

<details>
<summary>Self-test</summary>

1. p50 is flat while p99 climbs steeply with load. Saturated or not?
   - Entering saturation. The mean still looks healthy because most requests pass, but the tail shows queueing taking over; push further and goodput flattens.
2. Why must the sweep generator be open-loop?
   - Open-loop arrivals follow the intended schedule regardless of replies, so offered load is independent of served load. Closed-loop waits for replies and throttles itself exactly when the queue forms.
3. How do you tell a queueing stall from an execution stall at high load?
   - Split per-request time into queue, prefill and decode stamps. Growth concentrated in WAITING is queueing; growth inside model steps with a full batch is execution.
4. The burst ends but p99 stays high for a minute. What do you report?
   - The drain time: how long the leftover queue took to empty and latency to return to baseline. Recovery behavior, not just the saturated peak.

</details>

#### U11. Policy ablation, a negative regime and a bounded real-engine change

**About 5 h** · **Target:** Implement + Measure

Topics: Policy ablation and negative regime; Real-engine bounded policy change

A policy that only ever wins in reports is untested. Ablations separate the mechanism from the hype, and a bounded engine change proves the simulator result transfers.

**You can now**

- Isolate one scheduling mechanism with ablations that freeze everything else, including the corpus.
- Preserve a negative regime where the change loses and explain the shifted bottleneck from traces.
- Implement one bounded policy change in a real engine with fallback and regression tests.

**Study**

1. [Sarathi-Serve ablation of chunking and hybrid batching](https://arxiv.org/abs/2403.02310) (Sarathi-Serve: Tackling Throughput-Latency Tradeoffs in LLM Inference) - Section 5.4 (arXiv:2403.02310v3): Fig 14 chunked-prefill overhead against no chunking for Yi-34B, and Table 4 with hybrid-batching-only, chunked-prefills-only and combined TTFT and TBT over 128 requests at token budget 1024.
2. [Continuous-batching baseline against optimized pair](https://github.com/cfregly/ai-performance-engineering/tree/main/code/ch15) (AI Systems Performance Engineering - Continuous Batching Lab) - `baseline_continuous_batching.py` against `optimized_continuous_batching.py` with the shared harness in `compare.py`, run as `python -m ch15.compare` under CPU-safe or single-GPU settings. Depth: Skip the multigpu pair and the disaggregation and MoE targets in this unit. Re-measure on your hardware; the repo's bundled number is its result on its hardware, not your target.
3. [Bounded scheduler change in Nano-vLLM](https://github.com/GeeeekExplorer/nano-vllm) (Nano-vLLM - Scheduler, Block Manager and Engine Loop) - Fork `nanovllm/engine/scheduler.py` with `llm_engine.py` and `block_manager.py`: add event logging that explains every admit, chunk, preempt and finish transition, then implement one bounded admission or chunking change with regression tests.

**Focus**

- Ablate one mechanism at a time with the corpus, seed, budgets and hardware frozen. The paper's three-way split of hybrid-only, chunked-only and combined is the template: each run differs by exactly one rule.
- The negative regime is a deliverable, not an embarrassment. Name the workload where the change loses, show the trace, and explain the shifted bottleneck in overhead, memory pressure or tail cost.
- Bound the engine change to one policy with a reference fallback and a versioned flag. Reviewers must be able to turn it off and get the old behavior with no stale state.
- Diagnose transfer explicitly when the simulator and the engine disagree. Execution times, kernel shapes, cache reuse and host overhead are the usual suspects, and each one is checkable.

**Reproduce:** Closed-book, write the three-run ablation plan for chunked prefill on a frozen mixed corpus: hybrid-batching-only, chunked-prefills-only, and combined. Predict the paper's direction on its hardware: hybrid-only has the lowest TTFT but keeps TBT stalls, chunked-only cuts TBT but stretches TTFT, and combined has the lowest TBT with TTFT between the two (Table 4). Then state your engine-change checklist: one flag, fallback to reference, regression tests, and per-request traces for both positions.

**Traps**

- Sweeping every flag combination instead of isolating mechanisms. Combinatorial tuning attributes nothing; three runs that differ by one rule attribute everything.
- Promoting a simulator win without an engine check. The simulator ranks policies under a coarse cost model, so the bounded engine run is the result, not a formality.
- Dropping the negative regime from the write-up. A missing losing workload reads as an untested boundary, and the section checkpoint explicitly requires one win and one regression.

**Practice**

- [AI Systems Performance Engineering: continuous-batching pair](https://github.com/cfregly/ai-performance-engineering/tree/main/code/ch15) - Run `baseline_continuous_batching.py` against `optimized_continuous_batching.py` through `python -m ch15.compare` under CPU-safe or single-GPU settings. Inspect the shared comparison contract first, re-measure rather than quoting the bundled number, and keep one workload where the optimized path does not win.

**Stop when:** Your ablation attributes a win and a regression to named mechanisms, and your bounded engine change toggles cleanly with regression tests green.

<details>
<summary>Self-test</summary>

1. What makes Table 4 an ablation rather than a benchmark?
   - Same model, hardware, requests and budget across three runs that differ by exactly one mechanism each. The TTFT and TBT movements attribute to hybrid batching and chunking separately and combined.
2. Your chunking change wins in simulation and ties on the real engine. What do you check first?
   - Transfer gaps in order: real iteration times against modeled ones, kernel shapes in mixed batches, prefix-cache hit differences, and host and scheduling overhead per step.
3. What bounds a real-engine policy change?
   - One mechanism behind one flag with a reference fallback, regression tests that pin old behavior, and no stale state when toggled. Anything wider is a rewrite, not an experiment.
4. Why keep tuning traces separate from final traces?
   - Tuning on the final numbers overfits the policy to one corpus and hides variance. Tuning traces choose the setting; fresh final traces with the invariant checks report the result.

</details>

#### U12. Adapter and prefix affinity, grammar cost and multimodal co-scheduling

**About 3 h** · **Target:** Explain

Topics: Adapter-affinity and prefix-locality scheduling; Structured-output and grammar-cost scheduling; Multimodal encoder and decoder co-scheduling

Real batches mix adapters, grammars and images. Each one adds a scheduling dimension beyond tokens and blocks, and ignoring any of them turns a tuned policy into queueing surprises.

**You can now**

- Explain adapter-affinity scheduling from LoRA slot and rank pressure.
- Explain grammar-constrained decoding as per-step scheduling cost that varies with the constraint.
- Explain multimodal encoder and decoder co-scheduling with media-scoped cache reuse.

**Study**

1. [Per-request LoRA serving and slot pressure](https://docs.vllm.ai/en/v0.31.0/features/lora/) (vLLM v0.31.0 LoRA adapters) - Per-request `LoRARequest` served in parallel with base-model and other-adapter requests when `max_loras` allows; server-wide `--lora-modules` with `max_loras` and `max_lora_rank`, including the warning against oversized rank for memory and performance.
2. [Constrained decoding options and backends](https://docs.vllm.ai/en/v0.31.0/features/structured_outputs/) (vLLM v0.31.0 structured outputs) - xgrammar and guidance backends with `--structured-outputs-config.backend`; `choice`, `regex`, `json`, `grammar` and `structural_tag` in `StructuredOutputsParams` with the offline `choice` example.
3. [Multimodal inputs, caching and encoder-side cost](https://docs.vllm.ai/en/v0.31.0/features/multimodal_inputs/) (vLLM v0.31.0 multimodal inputs) - `limit_mm_per_prompt` bounding media per request; Cached Inputs with content hashing and caller-supplied `multi_modal_uuids`, including skipping media on expected cache hits; `--video-pruning-rate` with `--video-pruning-method` as encoder-side scheduling cost.

**Focus**

- Group same-adapter requests together. Mixing adapters is supported up to `max_loras` concurrent adapters, but each active adapter consumes slot and rank-budgeted memory, so affinity scheduling avoids slot churn and oversized-rank waste.
- Grammar cost lands on decode steps: the backend builds a token mask every step, and its cost depends on the compiled constraint. The cited page gives no cost order, so time choice, regex, schema and grammar steps yourself and budget that work with the token budget.
- Media tokens join the prompt token budget, and encoder work must be scheduled before or beside the decode stream. Identical text with different images is a different cache entry: reuse is scoped by media identity through content hashes or UUIDs.
- All three topics are optional extensions of the same rule: schedule the scarce shared state, whether adapter slots, grammar engines or encoder results, rather than only tokens and blocks.

**Reproduce:** Closed-book, schedule with `max_loras` at 2 and three queued adapters: group the two already-active adapters first and state which request waits for a slot. Predict an order of per-step cost for choice, regex, JSON schema and full grammar, and name the timing run that would test it. Then decide cache sharing for two requests with identical text where one pair shares an image UUID and the other uses different images: only the UUID pair shares encoder and prefix-cache work.

**Traps**

- Claiming different adapters cannot batch together. They can up to `max_loras`; affinity is about slot pressure and memory, not correctness, so the failure mode is churn and waste rather than errors.
- Treating grammar constraints as free because outputs look the same length. The constraint engine works every decode step, and wider grammars usually cost more per step than a fixed choice; measure it.
- Expecting prefix hits across different images with matching text. Media identity scopes the entry, so a changed image is a cache miss even when every word matches.

**Practice**

- [TensorTonic: Route Cache-Aware Prefill Requests](https://www.tensortonic.com/problems/cs336-l18-cache-aware-prefill-routing) - Implement `cache_aware_prefill_routing(request_token_counts, cached_prefix_lengths, worker_ids, worker_capacities)`; public cases `routing_public_1`, `routing_public_2` and `routing_public_3`. The public cases check feasibility by full request length against capacity, ranking by longest cached prefix then lowest projected uncached load then greatest remaining capacity then lowest worker id, and -1 when no worker fits.

**Stop when:** You can schedule adapters under slot pressure, order grammar costs and scope media reuse without notes, and your routing solution passes the public cases.

<details>
<summary>Self-test</summary>

1. Three adapters queue with two LoRA slots. What does affinity scheduling do?
   - It groups requests of the two already-active adapters first and holds the third adapter's requests until a slot frees. This avoids loading churn and oversized-rank memory waste.
2. How do you establish the per-step cost of choice, regex, JSON schema and full grammar constraints?
   - Time constrained decode steps for each on your engine and backend with identical prompts and lengths. Expect wider constraints to cost more, but the documentation states no order, so the measurement decides.
3. Two requests share all text but carry different images. Do they share prefix-cache work?
   - No. Cache identity includes the media through content hashes or UUIDs, so different images make different entries even with identical text.
4. A request skips sending its image and provides only a UUID. When does that work?
   - Only when the caller can expect a cache hit for that UUID with caching enabled. The page documents skipping on expected hits, not the miss path, so treat a miss as needing the media and verify the fallback on your engine.

</details>

### Mini-project: Continuous-batching scheduler with collapse and recovery evidence

**About 14 to 20 hours.** Build a deterministic continuous-batching simulator in `sim/` with budgets, preemption, priorities, cancellation and overload handling, and test it against public scheduler cases and frozen adversarial corpora. Carry one bounded policy into a real engine behind a flag and defend the win and the loss from traces.

1. Build the `sim/` continuous-batching simulator with token and sequence budgets, decode-first fill and deterministic replay, and check it against the TensorTonic continuous-batching scheduler cases plus your hand trace as the first regression test.
2. Add KV-reserve admission with recompute preemption to `sim/`, counting preemptions per request, and assert ownership, no-overcommit, progress and bounded-wait invariants after every transition over randomized histories with a seeded leak and a stuck waiter they must catch.
3. Run the Module 05 chunk-budget sweep in `sim/` with decode-first fill, and keep the throughput table with inter-token latency tails that shows where a smaller budget steadies the stream and where it starves the hardware.
4. Add priority classes with an aging rule to `sim/`, prove a convoy workload delays short requests under arrival order, keep a starvation test that fails with aging off, and pass the TensorTonic cache-aware routing cases for the affinity policy.
5. Implement abort at every scheduler phase with leak checks, early rejection with retry budgets, and goodput over offered load; then sweep open-loop load through saturation with repeats, keeping raw records, drain time and the queueing against execution split.
6. Freeze long-prefill, decode-heavy, mixed, bursty, priority and cancellation corpora, compare two policies from per-request traces keeping one regression, then carry one bounded change into a real engine behind a flag with fallback and run the companion continuous-batching pair.

**Deliverables**

- The `sim/` scheduler with replayable traces, invariant checks and the hand-trace regression test.
- Adversarial corpora with per-policy traces, saturation sweeps with drain evidence and the ablation with its losing regime.
- The bounded engine change behind a flag with fallback, cancel and routing tests and the scheduling write-up.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [TensorTonic: Simulate Continuous Decode Batching](https://www.tensortonic.com/problems/cs336-l18-continuous-batching-scheduler). Pass the public scheduler cases in your harness; reconcile reserve rules with your simulator.
- external-tests: [TensorTonic: Route Cache-Aware Prefill Requests](https://www.tensortonic.com/problems/cs336-l18-cache-aware-prefill-routing). Pass the public routing cases; use the ranking as the affinity policy oracle.
- external-tests: [AI Systems Performance Engineering continuous-batching pair](https://github.com/cfregly/ai-performance-engineering/tree/main/code/ch15). Run the baseline against optimized comparison on your hardware; keep one losing workload.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Deterministic replay | Fixed corpus, config and ordering replay to identical per-request traces, and the hand trace matches exactly. | A second policy replays cleanly, and trace diffs attribute every delay to a named scheduler decision. |
| Admission and preemption | Admit, defer and preempt decisions match budget math on fixed mixes, and per-request preemption counts explain eviction churn. | A repeated-eviction workload shows the reserve fix that stops the churn with traces before and after. |
| Overload honesty | Cancel-at-every-phase tests leak no blocks, rejection protects goodput, and sweeps show the knee with drain time. | The queueing against execution split names the saturated bottleneck, and the ablation keeps a losing regime. |
| Fairness and transfer | The starvation test fails with aging off and passes with it on, and the bounded engine change toggles to fallback cleanly. | Routing cases pass, and engine traces explain where the simulator prediction held and where it broke. |

Feeds into: The simulator, corpora, sweeps and bounded change feed the kernels dispatch, distributed routing, production overload handling and the capstone contribution.

### Resource route

- **Primary - Book:** [Hands-On LLM Serving and Optimization - Chapter 6, batching and scheduling](https://www.oreilly.com/library/view/hands-on-llm-serving/9798341621480/) - Read "Request Batching and Scheduling-Level Optimizations" in Chapter 6: dynamic, continuous and chunked-prefill batching. Rebuild each policy in a small event simulator and state the user-visible metric it can improve or harm.
- **Required - Paper:** [Orca: A Distributed Serving System for Transformer-Based Generative Models](https://www.usenix.org/conference/osdi22/presentation/yu) - Study iteration-level scheduling and selective batching, including the workload assumptions. Reproduce one scheduling timeline by hand and use it as the correctness baseline for the simulator.
- **Required - Paper:** [Sarathi-Serve: Tackling Throughput-Latency Tradeoffs in LLM Inference](https://arxiv.org/abs/2403.02310) - Focus on chunked prefills, stall-free batching and the throughput-latency trade-off. Implement a fixed-token chunk policy and preserve a workload where chunking loses to the simpler scheduler.
- **Required - Book:** [AI Systems Performance Engineering - Chapters 16 and 18, scheduling and admission](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) - Read "Dynamic Batching, Scheduling, and Routing" in Chapter 16 and "SLO-Aware Request Management and Fault Tolerance" in Chapter 18 (early rejection, quality of service).
- **Required - Implementation:** [Nano-vLLM - Scheduler, Block Manager and Engine Loop](https://github.com/GeeeekExplorer/nano-vllm) - Trace scheduler.py with llm_engine.py and block_manager.py. Add event logging in your own fork or project, explain every transition, and implement one bounded admission or chunking change with regression tests.
- **Required - Implementation:** [Mini-SGLang - Scheduler and Overlap Scheduling](https://github.com/sgl-project/mini-sglang) - Read docs/structures.md, scheduler implementation and tests/core/test_scheduler.py, then compare overlap scheduling with the Nano-vLLM loop. Use the online benchmark only after fixing the same workload and hardware contract.
- **Support - Lab:** [AI Systems Performance Engineering - Continuous Batching Lab](https://github.com/cfregly/ai-performance-engineering/tree/main/code/ch15) - Run the Chapter 15 baseline and optimized continuous-batching pair under CPU-safe or available-GPU settings. Inspect the shared comparison contract and re-measure rather than quoting bundled deltas.
- **Support - Practice:** [TensorTonic Language Modeling from Scratch - Simulate Continuous Decode Batching](https://www.tensortonic.com/problems/cs336-l18-continuous-batching-scheduler) - Solve after the continuous-batching unit, then compare its admission rule with your own simulator.
- **Support - Course:** [LLM Inference: From scratch, one token at a time - Module 05](https://inference.tusharamrit.in/modules/batching.html) - Work the Batching module's arithmetic and checkpoint before the static and continuous batching units.
- **Support - Project:** [LLM Inference Systems Laboratory - Scheduler](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/capstones/llm-inference-systems-laboratory.md) - Add token and memory admission, chunking, priority, cancellation, overload and fairness to the simulator, then carry one policy through the real engine path with a reference fallback.
- **Reference - Reference:** [vLLM v0.31.0 serve CLI and scheduler arguments](https://docs.vllm.ai/en/v0.31.0/cli/serve/) - Look up scheduler flags and defaults: `--max-num-seqs`, `--max-num-batched-tokens`, `--max-num-active-seqs`, `--enable-chunked-prefill`, `--long-prefill-token-threshold` and `--scheduling-policy`. Runtime defaults vary by GPU class, so check them against the installed v0.31.0 behavior.
- **Reference - Reference:** [vLLM v0.31.0 metrics design](https://docs.vllm.ai/en/v0.31.0/design/metrics/) - Read the WAITING, RUNNING and PREEMPTED request states and the queue, inference, prefill and decode interval definitions. Swapped-preemption metrics are legacy in v1. The exported counters, including `vllm:num_requests_waiting_by_reason` and `vllm:num_preemptions`, are listed on the Production Metrics page, https://docs.vllm.ai/en/v0.31.0/usage/metrics/
- **Support - Support:** [vLLM v0.31.0 benchmark CLI](https://docs.vllm.ai/en/v0.31.0/benchmarking/cli/) - Use `vllm bench serve` with `--request-rate` for offered-load sweeps, and `vllm bench throughput` and `vllm bench latency` for offline endpoint and phase baselines. Fix the dataset, lengths, request rate, warmup and sampling, and keep raw per-request results; do not copy example rates as targets.
- **Reference - Reference:** [vLLM v0.31.0 online serving](https://docs.vllm.ai/en/v0.31.0/serving/online_serving/) - Read the `/abort_requests` endpoint and the Responses cancel API for request cancellation. Verify client-disconnect aborts on your engine; the page does not cover them.
- **Reference - Reference:** [vLLM v0.31.0 LoRA adapters](https://docs.vllm.ai/en/v0.31.0/features/lora/) - Read per-request `LoRARequest` serving, server-wide `--lora-modules` with `max_loras` and `max_lora_rank`, and why adapter-slot pressure rewards grouping same-adapter requests.
- **Reference - Reference:** [vLLM v0.31.0 structured outputs](https://docs.vllm.ai/en/v0.31.0/features/structured_outputs/) - Read the xgrammar and guidance backends, the `choice`, `regex`, `json`, `grammar` and `structural_tag` options in `StructuredOutputsParams`, and the `--structured-outputs-config.backend` flag.
- **Reference - Reference:** [vLLM v0.31.0 multimodal inputs](https://docs.vllm.ai/en/v0.31.0/features/multimodal_inputs/) - Read `limit_mm_per_prompt`, content hashing with `multi_modal_uuids` in Cached Inputs, and the video pruning flags as examples of encoder-side scheduling cost.
- **Support - Practice:** [TensorTonic Language Modeling from Scratch - Route Cache-Aware Prefill Requests](https://www.tensortonic.com/problems/cs336-l18-cache-aware-prefill-routing) - Solve after the affinity unit: assign each request to a feasible worker by longest cached prefix, lowest projected uncached load, greatest remaining capacity, then lowest worker id, with -1 when infeasible.

### Exit checkpoint

Preserve request, memory, progress and fairness invariants under adversarial load, demonstrate one policy win and one regression, and explain both from scheduler traces rather than aggregate throughput.

<details>
<summary>Deliberately left for later</summary>

- Learned scheduling before deterministic baselines and safe fallback
- Combinatorial tuning of every engine flag
- Fleet routing before local admission and overload behavior are correct

</details>

## INF-5. Inference Kernels and Graph Execution

**Why:** Inference uses unusual shapes, changing sequence lengths and repeated small decode steps. A kernel or graph optimization matters only when its numerical contract, dispatch coverage and engine-level effect all hold.

### Learn this much

- [ ] Stable and online softmax _(Required)_
- [ ] Normalization and fused residual paths _(Required)_
- [ ] Prefill attention tensor shapes _(Required)_
- [ ] Decode attention tensor shapes _(Required)_
- [ ] IO-aware attention and FlashAttention _(Required)_
- [ ] Paged and variable-length decode attention _(Required)_
- [ ] GQA grouping and KV address calculation _(Required)_
- [ ] KV append, gather and layout _(Required)_
- [ ] RoPE position and offset handling _(Required)_
- [ ] Sampling and token-selection kernels _(Required)_
- [ ] Structured and guided decoding integration _(Required)_
- [ ] Memory layout, strides and alignment _(Required)_
- [ ] Operator fusion and intermediate traffic _(Required)_
- [ ] Kernel launch and host overhead _(Required)_
- [ ] CUDA streams, events and asynchronous execution _(Required)_
- [ ] CUDA graph capture and replay _(Required)_
- [ ] Static-address and shape constraints _(Required)_
- [ ] Graph buckets, padding and eager fallback _(Required)_
- [ ] Compilation, graph breaks and recompilation _(Required)_
- [ ] Shape, dtype, mask and tolerance contract _(Required)_
- [ ] Independent PyTorch or NumPy oracle _(Required)_
- [ ] Randomized differential tests _(Required)_
- [ ] Warmup and correct device timing _(Required)_
- [ ] FLOP, byte and launch accounting _(Required)_
- [ ] Profiler evidence for bottleneck classification _(Required)_
- [ ] Engine dispatch and fallback integration _(Required)_
- [ ] Kernel-to-endpoint translation _(Required)_
- [ ] Negative end-to-end result preservation _(Required)_
- [ ] FlashDecoding and decode mega-kernel vocabulary _(Optional)_
- [ ] FlashInfer backend selection and custom masks _(Optional)_
- [ ] Batch-invariant reduction kernels _(Optional)_
- [ ] Custom Triton or CUDA serving-critical kernel _(Depth)_
- [ ] Architecture-specific kernel portfolio outside the active bottleneck _(Later)_

### Study units

#### U1. Stable and online softmax, normalization and fused residual paths

**About 3 h** · **Target:** Explain + Implement

Topics: Stable and online softmax; Normalization and fused residual paths

Build on Online softmax state, query and key-value tiling and Stable RMSNorm and LayerNorm, and RoPE fusion. The serving task is preserving residual state and reduction semantics across repeated decode steps, not writing another generic reduction kernel.

**You can now**

- Integrate residual-add plus RMSNorm with explicit mutation, accumulation and $`\epsilon`$ contracts.
- Use online-softmax state to combine disjoint decode partitions without averaging their outputs.
- Test both returned activations and retained residuals against an independent reference.

**Study**

1. [Attention composition, arXiv:2501.01005v1](https://arxiv.org/html/2501.01005v1#S2.SS2) (FlashInfer: Efficient and Customizable Attention Engine for LLM Inference Serving) - Section 2.2, Attention Composition, attention-state definition and binary merge. Depth: Use disjoint key subsets and maximum subtraction when merging. Associativity holds in real arithmetic, not bitwise floating-point arithmetic.
2. [Fused residual mutation contract](https://docs.flashinfer.ai/generated/flashinfer.norm.fused_add_rmsnorm.html) (FlashInfer Documentation) - FlashInfer documentation: Step 1, Step 2 and Parameters of `fused_add_rmsnorm` (page read 2026-10-14, release 0.7.1).
3. [Residual ownership in the model path](https://github.com/sgl-project/mini-sglang/blob/9a91cfafe754aa85daee49998176275667eb58f2/python/minisgl/layers/norm.py) (Mini-SGLang - Kernel, Model Runner and Overlap Boundaries) - `RMSNormFused.forward`, including the absent-residual branch.

**Focus**

- For residual sum $`z=x+r`$, RMSNorm returns $`w\odot z/\sqrt{\operatorname{mean}(z^2)+\epsilon}`$. LayerNorm instead centers the row and uses population variance. Preserve the model's choice.
- The fused API overwrites the residual with the sum and the input with normalized activations. Returning only normalized values loses state needed by the next block.
- For partial attention states, merge unnormalized weights or log-normalizers. Keep the logarithm base consistent and rescale by the larger maximum before exponentiating.
- Specify whether the residual sum is rounded to storage dtype before normalization. Promotion before the sum and promotion only for the reduction are different numerical contracts.

**Reproduce:** Closed-book, implement a CPU double-precision residual/RMSNorm reference with `eps=1e-6`. For input `[1., 2., 3., 4.]`, residual `[4., 3., 2., 1.]` and unit weights, the retained residual is `[5., 5., 5., 5.]`; RMSNorm is approximately one while centered LayerNorm is zero. Check both buffers through two successive calls. Then merge disjoint online-softmax states from your earlier GPU-track implementation and compare with one dense reduction under its declared tolerance.

**Traps**

- Validating activations but forgetting that the residual was overwritten incorrectly.
- Reading aliased input and residual buffers as though they were independent. Reject unsupported overlap before dispatch.
- Initializing an all-masked partition with ordinary subtraction of two negative infinities. Give empty states an explicit identity path.

**Practice**

- The section mini-project covers this: `servelab` residual-state and split-softmax reference checks, including repeated calls and empty partitions.

**Stop when:** Both residual and activation pass independent repeated-call checks, and split-softmax merges match the dense oracle under a stated finite and all-masked policy.

<details>
<summary>Self-test</summary>

1. Why is averaging two partition outputs wrong?
   - Their softmax denominators generally differ. Weight each output by its partition's normalizer before dividing by the combined normalizer.
2. Does finite-logit maximum subtraction make every softmax input safe?
   - No. NaNs, positive infinities and all-masked rows still need a declared policy. A finite nonempty row avoids exponential overflow after subtraction.
3. What must a residual-fusion oracle return?
   - The updated residual and normalized activation, with the intended cast points, $`\epsilon`$, weight and mutation semantics.

</details>

#### U2. Prefill and decode attention shapes and IO-aware attention

**About 4 h** · **Target:** Explain + Derive

Topics: Prefill attention tensor shapes; Decode attention tensor shapes; IO-aware attention and FlashAttention

Attention shapes, prefill and decode reuse, and materialized traffic already supplied the square-attention ledger. Serving adds cached suffixes, mixed request lengths and a shape distribution that can invalidate a single-kernel choice.

**You can now**

- Derive rectangular attention shapes for uncached prefill, cached chunks and ordinary decode.
- Separate query-head arithmetic from KV-head traffic and identify potential GQA reuse.
- Predict when query tiling or split-KV parallelism is worth testing without assuming a bandwidth bottleneck.

**Study**

1. [Serving intensity and tile selection, arXiv:2501.01005v1](https://arxiv.org/html/2501.01005v1#S2.SS1) (FlashInfer: Efficient and Customizable Attention Engine for LLM Inference Serving) - Section 2.1, FlashAttention; Sections 3.2.1 and 3.2.2, data movement and microkernel tile sizes; Appendix A, Head Group Fusion for Grouped-Query Attention. Depth: Use the paper's intensity as an attention-only model. Its statement about batching does not apply to weight reuse in the rest of a transformer.
2. [Forward attention state and work](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/cs336_assignment2_systems.pdf) (CS336 Assignment 2 - FlashAttention and Triton Sections) - Section 4.2.2, Details of the FlashAttention forward pass and Algorithm 1, printed pp. 24 to 25. Depth: Reuse your completed forward implementation. Skip backward and the training benchmark sweep; extend the shape ledger to rectangular cached attention.

**Focus**

- For one request with $`q`$ query tokens, $`s`$ visible KV tokens, $`H_q`$ query heads and head width $`d`$, scores have shape $`H_q\times q\times s`$. Uncached prefill has equal lengths; a cached chunk has more keys than queries; ordinary decode has one query.
- Dense score and value products cost $`4 H_q q s d`$ FLOPs, counting a multiply-add as two. This excludes scaling, masking and softmax; useful causal pairs and executed padded tiles need separate counts.
- An ideal single KV read costs $`2H_{kv}sd b`$ bytes for equal key/value widths and $`b`$ bytes per element. Reusing these bytes across grouped heads is a schedule property, not a consequence of fewer stored heads alone.
- IO-aware attention removes global score/probability materialization. Short queries still offer little query-row reuse; split-KV adds parallelism but needs partial-state storage and reduction.

**Reproduce:** Closed-book, draw a request with 5 cached tokens and a 3-token chunk, four query heads, two KV heads and width 8. Scores are $`4\times3\times8`$; the three query rows allow 6, 7 and 8 keys respectively. Derive 3072 dense-product FLOPs versus 2688 useful causal-product FLOPs, and 512 bytes for one ideal KV read with two-byte storage. Keep query/output bytes, softmax work, metadata and actual reloads outside that KV-only count.

**Traps**

- Using a square or upper-left causal mask for a cached suffix. Its query positions start after the cached prefix.
- Reducing arithmetic by the GQA group size. Query heads still compute distinct scores and outputs.
- Calling a low-intensity attention shape bandwidth-bound without timings and profiler evidence. Launch supply or insufficient parallelism may dominate.

**Practice**

- The section mini-project covers this: `servelab` prefill, cached-chunk and decode shape ledgers, with predictions attached to the measured workload matrix.

**Stop when:** You derive the cached-chunk ledger and mask from absolute positions, then explain a different request mix without confusing useful work, modeled bytes and measured traffic.

<details>
<summary>Self-test</summary>

1. Does batching unrelated decode requests create reuse of each request's KV across query tokens?
   - No. Ordinary decode still has one query per request. Batching adds parallel work and can improve weight reuse elsewhere, but unrelated requests have different KV.
2. Why distinguish useful causal FLOPs from executed FLOPs?
   - A masked tile can still execute dense instructions or padded lanes. A mathematical pair count is not a hardware instruction count.
3. Why can FlashAttention reduce traffic without reducing the attention pair count?
   - It streams tiles and retains row state on chip instead of writing quadratic intermediate matrices. It still evaluates the permitted query-key interactions.

</details>

#### U3. Paged and variable-length decode attention, GQA grouping and KV addressing

**About 4 h** · **Target:** Explain + Implement

Topics: Paged and variable-length decode attention; GQA grouping and KV address calculation; FlashDecoding and decode mega-kernel vocabulary

Build on Variable-length, paged and decode attention. Here the page table must remain correct as a live serving batch changes, and its plan must match the wrapper that actually executes.

**You can now**

- Connect variable request lengths and GQA heads to a paged decode wrapper's metadata.
- Implement a CPU page-gather and head-mapping oracle independent of backend scheduling.
- Explain split-KV, FlashDecoding and decode megakernels as distinct execution choices.

**Study**

1. [Page-table and decode contracts](https://docs.flashinfer.ai/api/attention.html#flashinfer.decode.BatchDecodeWithPagedKVCacheWrapper) (FlashInfer Documentation) - FlashInfer documentation: `BatchDecodeWithPagedKVCacheWrapper`, constructor and `plan`/`run` Parameters and Notes (page read 2026-10-14, release 0.7.1). Depth: Read ordinary paged GQA decode only. The wrapper needs a planned supported shape and dtype; leave architecture-specific backends for reference.
2. [Dynamic split-KV and scheduling, arXiv:2501.01005v1](https://arxiv.org/html/2501.01005v1#S3.SS3) (FlashInfer: Efficient and Customizable Attention Engine for LLM Inference Serving) - Sections 3.1.1 and 3.3.1, including Algorithm 1 and Figure 6; Section 5.1, FlashDecoding discussion.
3. [Decode-kernel vocabulary](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 18 and 19, decode kernels and engine optimizations) - Chapter 18, Optimized Decode Kernels: FlashMLA (DeepSeek), ThunderMLA (Stanford) and FlexDecoding (PyTorch). Depth: Read for vocabulary and fusion boundaries, not quoted speedups or a requirement to run MLA kernels. An attention decode kernel is not the full transformer layer.

**Focus**

- Reuse your earlier page translation: logical position $`t`$ maps through entry $`\lfloor t/P\rfloor`$ and slot $`t\bmod P`$ for page size $`P`$. A request's metadata must exclude another request's pages and the invalid tail.
- For divisible head counts, $`g=H_q/H_{kv}`$ and KV head $`\lfloor h_q/g\rfloor`$. The API requires that divisibility; unsupported mappings must reject or use a documented alternative.
- FlashDecoding splits a long KV range into parallel partial attention states and merges them. A megakernel may fuse scheduling and reduction; neither term implies fusion of every model operator.
- Planning follows live lengths and can be reused across compatible layers in one step. Reusing a plan from a different request order, shape or page mapping can produce plausible but wrong outputs.

**Reproduce:** From a blank file, build a CPU double-precision decode oracle for two requests of lengths 5 and 7, page size 4, physical page lists `[4, 1]` and `[3, 0]`, four query heads, two KV heads and width 8. Generate standard-normal queries, keys and values with seed 0. Gather each request independently, map heads as `[0, 0, 1, 1]` and compare with contiguous attention at `rtol=1e-12, atol=1e-12`. Permute the physical allocation and swap batch order with matching metadata; outputs must follow request identity. Poison unused slots and confirm they cannot affect valid outputs.

**Traps**

- Treating the CSR page offsets as token offsets. Each offset counts page-table entries, not token rows.
- Setting last-page length to zero for a full page. The nonempty-page convention uses the page size.
- Equally averaging split-KV outputs instead of merging their normalizers.

**Practice**

- The section mini-project covers this: `servelab` paged decode checks over request reordering, unequal lengths, GQA groups and poisoned page tails.

**Stop when:** The independent oracle passes reordered and remapped batches, a seeded wrong-page or wrong-head defect fails, and you distinguish split-KV from full-layer fusion.

<details>
<summary>Self-test</summary>

1. With page size 4 and page list `[4, 1]`, where is logical token 4?
   - Physical page 1, slot 0. Logical and physical page numbers need not match.
2. What length does two pages with last-page occupancy 3 represent at page size 4?
   - 7 valid tokens. Only three slots of the final page are readable.
3. Why might split-KV lose on short contexts?
   - Extra partial-state writes, reduction and dispatch can exceed the benefit of added parallelism. Measure the crossover rather than assuming it.

</details>

#### U4. KV append, gather and layout, and RoPE positions and offsets

**About 4 h** · **Target:** Implement

Topics: KV append, gather and layout; RoPE position and offset handling

Key-value append, gather, layout conversion and quantized loads already established the storage primitives. Serving adds a lifecycle: reuse of a physical slot must not reuse the previous request's position or key state.

**You can now**

- Implement append and gather over page boundaries while preserving untouched KV slots.
- Preserve absolute RoPE positions through cached chunks, request compaction and slot reuse.
- Trace where the model rotates keys and where the backend stores them to prevent double rotation.

**Study**

1. [Caller-owned append metadata](https://docs.flashinfer.ai/generated/flashinfer.page.append_paged_kv_cache.html) (FlashInfer Documentation) - FlashInfer documentation: Parameters, Example and Note of `append_paged_kv_cache` (page read 2026-10-14, release 0.7.1).
2. [Rotation before backend dispatch](https://github.com/sgl-project/mini-sglang/blob/9a91cfafe754aa85daee49998176275667eb58f2/python/minisgl/layers/attention.py) (Mini-SGLang - Kernel, Model Runner and Overlap Boundaries) - `AttentionLayer.forward`: projection split, optional head norms, rotation using `ctx.batch.positions`, then attention-backend call.
3. [KV storage and rotation conventions](https://github.com/sgl-project/mini-sglang/blob/9a91cfafe754aa85daee49998176275667eb58f2/python/minisgl/kvcache/mha_pool.py) (Mini-SGLang - Kernel, Model Runner and Overlap Boundaries) - `MHAKVCache.__init__` and `store_kv`; then `RotaryEmbedding.__init__` and `forward` in the linked rotation implementation. Depth: Open https://github.com/sgl-project/mini-sglang/blob/9a91cfafe754aa85daee49998176275667eb58f2/python/minisgl/layers/rotary.py for the second locator. Stop before model-specific scaling branches in `_get_rope`.

**Focus**

- The append API assumes allocation and final page metadata already include the new tokens. Validate capacity before writing; it neither allocates pages nor protects shared-prefix ownership for you.
- Cache addresses and RoPE positions are separate mappings. A compacted batch index, physical page or recycled slot cannot replace a request's logical position.
- Mini-SGLang rotates queries and keys before storing keys; its FlashInfer path uses `pos_encoding_mode="NONE"`. In another integration, inspect this boundary before enabling rotation inside attention.
- Keep the model's pairing, frequency base, scaling and rotary width fixed. Layout conversion changes storage, not those conventions; test full-prefix and chunked execution on the same represented inputs.

**Reproduce:** On CPU, use page size 4 and physical pages `[3, 1]` for a request growing from length 3 to 5. With seed 0 standard-normal double-precision keys and values, rotate new keys at logical positions 3 and 4 using a half-split RoPE reference with width 8 and base 10000. Append across the page boundary, gather and compare with rotating the full five-token prefix once at `rtol=1e-12, atol=1e-12`. Verify every untouched slot exactly. Recycle the pages for a new request beginning at position 0 and repeat; do not inherit the old position offset.

**Traps**

- Using chunk-local positions starting at zero for a suffix that follows a cached prefix.
- Rotating stored keys again on every decode step, or rotating both before append and inside attention.
- Writing into a shared page before the allocator has made the destination private. Kernel correctness cannot repair an ownership violation.

**Practice**

- The section mini-project covers this: `servelab` append/gather and RoPE checks across cached chunks, page boundaries, compaction and cancellation followed by slot reuse.

**Stop when:** Chunked and full-prefix keys agree under the position contract, untouched slots are preserved, and a recycled-slot test detects a deliberately stale offset.

<details>
<summary>Self-test</summary>

1. A request has three cached tokens. What positions belong to its next two tokens?
   - 3 and 4 under zero-based absolute positions, regardless of physical pages or batch order.
2. What metadata does append consume: old lengths or lengths after append?
   - Lengths and page lists after append. All destination space must already be allocated.
3. Is RoPE norm preservation enough to verify positions?
   - No. A rotation at the wrong position also preserves norm. Compare against the correct absolute-position reference and cached/full-prefix outputs.

</details>

#### U5. Sampling and token-selection kernels and guided-decoding integration

**About 4 h** · **Target:** Explain + Implement

Topics: Sampling and token-selection kernels; Structured and guided decoding integration

A token-selection kernel is correct only for the distribution after the request's constraints. Faster selection that reads a stale grammar mask changes the output contract even when logits are unchanged.

**You can now**

- Implement masked greedy and filtered stochastic selection with a declared filter order and tie policy.
- Preserve per-request grammar and random state through changing batch membership.
- Separate mask construction, transfer and token-selection costs at the serving boundary.

**Study**

1. [Fused filtered selection](https://docs.flashinfer.ai/generated/flashinfer.sampling.top_k_top_p_sampling_from_logits.html) (FlashInfer Documentation) - FlashInfer documentation: Parameters `filter_apply_order`, `deterministic`, `generator`, `seed` and `offset`, and the input-dtype Note (page read 2026-10-14, release 0.7.1). Depth: Use the parameter contract, not the sampled IDs printed in the example as a reproducibility target. Leave speculative sampling to the next section.
2. [Greedy and stochastic sampler branches](https://github.com/sgl-project/mini-sglang/blob/9a91cfafe754aa85daee49998176275667eb58f2/python/minisgl/engine/sample.py) (Mini-SGLang - Kernel, Model Runner and Overlap Boundaries) - `Sampler.prepare`, `Sampler.sample` and `sample_impl`.
3. [Constraint configuration and sampler integration](https://docs.vllm.ai/en/v0.31.0/features/structured_outputs/#offline-inference) (vLLM structured outputs (v0.31.0)) - Offline Inference, `StructuredOutputsParams` example, and the opening deprecated-field warning. Depth: For the kernel boundary, also open https://docs.vllm.ai/en/v0.31.0/api/vllm/v1/worker/gpu_model_runner/ and locate `sample_tokens`: grammar bitmask application precedes `_sample`. Skip online-server setup and reasoning-model examples.

**Focus**

- Mask illegal vocabulary entries before selection; normalize only allowed mass. An all-disallowed state must terminate or error explicitly, never silently sample from an invalid row.
- Greedy selection needs no probability materialization. Use a separate greedy branch, not division by zero temperature; state the tie rule and non-finite policy.
- Top-k then top-p renormalizes before its nucleus threshold, while joint filtering uses a different contract. Pin the order, threshold crossing and tie handling before comparing distributions.
- Grammar state and random state belong to requests, not batch slots. A deterministic kernel or equal seed does not guarantee equal IDs across libraries with different random-number consumption.

**Reproduce:** Write a CPU reference for probability vector `[0.6, 0.25, 0.15]` with top-k 2 and top-p 0.7. Top-k-first filtering renormalizes to `[12/17, 5/17, 0]`, so its nucleus retains only token 0; intersecting with the original nucleus, which is this card's CPU reference for `joint` and not a claim about FlashInfer's kernel output, retains tokens 0 and 1. Then forbid token 0 before filtering and show that no legal selection can emit it. Add an all-disallowed error case and a two-request state test that swaps batch slots after each selected token.

**Traps**

- Treating grammar masking as ordinary token-ID filtering without advancing grammar state after the accepted token.
- Replaying captured sampling with an unchanged explicit random offset. Repeated random draws are not independent sampling.
- Calling schema-conforming output factually correct. Syntax constraints do not establish task quality.

**Practice**

- The section mini-project covers this: `servelab` masked-selection oracle, request-local grammar/RNG state tests and separate mask/selection timing.

**Stop when:** You explain the filter-order example, forbid illegal tokens under both selection modes, and preserve each request's constraint state across slot changes and cleanup.

<details>
<summary>Self-test</summary>

1. Why can equal seeds still give different sampled IDs in two implementations?
   - The algorithms can consume random draws differently. Test the filtered distribution, and require token identity only when the random mapping is also fixed.
2. Why not apply a grammar mask after top-k?
   - Top-k may have discarded all legal alternatives. The engine must define and preserve ordering so selection operates on the legal distribution.
3. What should happen when a grammar row allows no token?
   - Handle a declared terminal state or raise an explicit error. Normalizing zero mass or all negative-infinite logits is not a valid sampler.

</details>

#### U6. Memory layout, strides and alignment, and fusion against intermediate traffic

**About 3 h** · **Target:** Derive

Topics: Memory layout, strides and alignment; Operator fusion and intermediate traffic

Build on SwiGLU MLP and epilogue fusion boundaries and the earlier KV layout work. A serving optimization must include conversion and dispatch costs, not just the traffic of a convenient contiguous benchmark.

**You can now**

- Derive physical addresses from strides, storage offsets and element sizes for serving views.
- Count intermediate traffic removed by a legal fusion while retaining required residual outputs.
- Choose a fusion boundary that preserves reduction ownership, cast points and supported layouts.

**Study**

1. [Physical KV layouts](https://docs.flashinfer.ai/tutorials/kv_layout.html#layout-nhd-hnd) (FlashInfer Documentation) - FlashInfer documentation: Layout: NHD/HND and Page Table Layout (page read 2026-10-14, release 0.7.1). Depth: Skip MLA and cascade layouts. Use `plan`/`run` from the current API instead of the tutorial's older `begin_forward` example.
2. [Sparse gathers and fusion, arXiv:2501.01005v1](https://arxiv.org/html/2501.01005v1#S3.SS2) (FlashInfer: Efficient and Customizable Attention Engine for LLM Inference Serving) - Sections 3.2.1 and 3.2.3, data movement and transformation functors; Section 4.3, fused versus unfused RoPE evaluation. Depth: Read Section 4.3 for its comparison boundary, not the source's hardware-specific speedup as an expected result.
3. [Outputs that fusion must retain](https://docs.flashinfer.ai/generated/flashinfer.norm.fused_add_rmsnorm.html) (FlashInfer Documentation) - Step 1 and Step 2 of `fused_add_rmsnorm` (page read 2026-10-14, release 0.7.1).

**Focus**

- With element strides $`s_j`$, storage offset $`o`$ and element size $`b`$, byte address is $`a_0+b(o+\sum_j i_js_j)`$, where $`a_0`$ is the storage base. Alignment depends on the resulting address, not just allocation alignment.
- A transpose view changes strides without moving data. Making it contiguous performs a copy; include that read/write traffic and allocation when deployment needs it.
- For a materialized intermediate with $`n`$ elements of $`b`$ bytes, removing one write and one read saves $`2nb`$ requested bytes. That is not a measurement of DRAM traffic after caches.
- Residual fusion still writes the retained sum and normalized activation. A full-row norm cannot generally be fused into one projection tile without coordinating the row reduction.

**Reproduce:** On CPU, construct `torch.arange(24, dtype=torch.float32).reshape(4, 6)[:, 1::2]`. Derive shape `[4, 3]`, element strides `[6, 2]` and storage offset 1, then verify every element by independent indexing. Explain why this view loses 16-byte base alignment despite an aligned storage allocation. For a hypothetical one-pass residual-add plus norm with both outputs required, derive $`5nb`$ vector bytes for separate add and norm versus $`4nb`$ for fusion: two input reads, two output writes and one eliminated reread. State that weights, statistics, repeated loads and cache effects are excluded.

**Traps**

- Assuming a view's last dimension is contiguous because the original tensor was contiguous.
- Counting a retained residual write as removed traffic. It is part of the output contract.
- Treating fewer launches as proof of lower latency. Larger fusion can increase register pressure, spills or padding.

**Practice**

- The section mini-project covers this: `servelab` stride/alignment dispatch cases and a fusion ledger including conversion and retained-output costs.

**Stop when:** Your address calculation matches the strided view, and your fusion diagram accounts for every required read, write, conversion and reduction boundary.

<details>
<summary>Self-test</summary>

1. Does changing an NHD tensor's layout label create HND storage?
   - No. The consumer needs matching dimensions and strides. A real contiguous conversion moves data; a view may be supported only if the kernel accepts its strides.
2. Why is the fused residual example saving only one vector read?
   - The sum must remain as a residual output. Fusion removes normalization's reread of that sum, but not its write.
3. Can nominal saved bytes predict speedup by themselves?
   - No. Cache filtering, transaction utilization, launch costs and resource changes determine actual time. The ledger gives a hypothesis to measure.

</details>

#### U7. Launch and host overhead, streams, events and asynchronous execution

**About 4 h** · **Target:** Explain + Measure

Topics: Kernel launch and host overhead; CUDA streams, events and asynchronous execution

Pinned memory, streams, events and copy-compute overlap supplied the CUDA mechanics. A serving loop must hide host preparation without exposing unfinished tokens or recycling KV before its consumers finish.

**You can now**

- Separate host scheduling and launch supply from GPU execution on a decode timeline.
- Preserve producer, consumer and host-read ordering with stream events and buffer lifetimes.
- Measure a completed serving step without inserting a device-wide wait after every operator.

**Study**

1. [Host work on the decode critical path](https://haoailab.com/cse291-s26/assets/scribe_notes/may7_scribe.pdf) (UCSD CSE 291A (Spring 2026) - Guest lecture: Engineering vLLM) - May 7, 2026 scribe notes: Sections 4.1, 4.3 and 4.4, CPU overhead, asynchronous scheduling and GPU-native input preparation. Depth: Read the dependencies and preparation boundaries. Do not inherit lecture timing examples or treat all host work as removed by asynchronous scheduling.
2. [Sampled-token copy completion](https://github.com/sgl-project/mini-sglang/blob/9a91cfafe754aa85daee49998176275667eb58f2/python/minisgl/engine/engine.py) (Mini-SGLang - Kernel, Model Runner and Overlap Boundaries) - `ForwardOutput` and `Engine.forward_batch`: active stream, sampling, CPU copy and completion event.
3. [Overlap and safe host consumption](https://github.com/sgl-project/mini-sglang/blob/9a91cfafe754aa85daee49998176275667eb58f2/python/minisgl/scheduler/scheduler.py) (Mini-SGLang - Kernel, Model Runner and Overlap Boundaries) - `overlap_loop`, `normal_loop`, `_process_last_data` and `shutdown`.

**Focus**

- A short GPU step can wait for host launches, scheduler work or input preparation. Locate gaps on the timeline before choosing a faster arithmetic kernel.
- One stream orders its operations; another stream needs an explicit dependency. Event waiting establishes readiness, while retaining storage or recording its use prevents allocator reuse. These are separate obligations.
- A nonblocking copy return is not proof that the CPU tensor is ready or that transfer overlaps compute. Wait for completion before host inspection and verify overlap in the trace.
- Overlap can prepare work for a request that finishes or is cancelled. Discard its output and defer storage reuse until in-flight consumers finish; check this ordering in a deterministic CPU event simulation.

**Reproduce:** On your GPU, prepare a 32-element `torch.float32` vector of ones and a pinned host output. Have a producer stream add one, record a ready event, and a consumer stream wait on it before multiplying by three and copying to the host. Record completion after the copy and wait before reading; every host element must be 6. Keep all buffers alive. Capture a short timeline and identify both dependencies; overlap is an observation, not a requirement. Repeat the ownership sequence in a CPU event simulation where cancellation prevents early slot reuse.

**Traps**

- Timing Python enqueue duration and calling it completed decode latency.
- Replacing an event wait with a global synchronization at every token, thereby changing the overlap being measured.
- Freeing a cancelled request's slots while previously enqueued kernels still read them. Cancellation changes ownership, not completion of GPU work.

**Practice**

- The section mini-project covers this: `servelab` stream/event dependency trace, completed-step timing and cancellation-safe in-flight buffer simulation.

**Stop when:** The two-stream result is correct, the trace shows the required ordering, and cancellation cannot return storage before its final consumer completes.

<details>
<summary>Self-test</summary>

1. Does a stream wait block the host until the producer finishes?
   - No. It orders future work on the waiting stream. A host event synchronization is needed before the CPU consumes unfinished results.
2. Why retain a buffer after adding a cross-stream event dependency?
   - The dependency establishes execution order, not storage lifetime. The allocator must not reuse storage while another stream still uses it.
3. What disproves a host-launch-bound hypothesis?
   - A timeline with sufficient queued GPU work and device execution occupying the critical path, together with no useful improvement when host launch supply is reduced.

</details>

#### U8. CUDA graph capture and replay, static shapes, buckets, padding and fallback

**About 5 h** · **Target:** Explain + Measure

Topics: CUDA graph capture and replay; Static-address and shape constraints; Graph buckets, padding and eager fallback

CUDA graphs and validated dispatch with fallback and Launch overhead, bucketing and graph misses covered generic capture and bucketing. Serving adds mixed batch shapes and attention backends that veto full capture, so one static graph never fits the whole workload.

**You can now**

- Explain full, piecewise and eager dispatch for uniform-decode versus prefill/mixed batches, including the automatic backend-compatibility downgrade.
- Capture and replay a static-shape decode step with bucketed sizes, padded inputs and a counted eager fallback for misses.
- Measure replay against eager with warmup and interleaved medians, and attribute the gap to launch supply rather than faster execution.

**Study**

1. [CUDA Graphs modes and the v1 dispatcher](https://docs.vllm.ai/en/v0.31.0/design/cuda_graphs/) (vLLM CUDA Graphs design (v0.31.0)) - `CUDAGraphMode` (`NONE`, `PIECEWISE`, `FULL`, `FULL_DECODE_ONLY`, `FULL_AND_PIECEWISE`), `CudagraphDispatcher` with `BatchDescriptor`, and CUDA Graphs Compatibility of Attention Backends (the `AttentionCGSupport` table and downgrade). Depth: Read the dispatch design, not the linked pull-request comments as results. Confirm `cudagraph_capture_sizes` defaults in `CompilationConfig` in your installed v0.31.0 source.
2. [Full versus piecewise graphs](https://haoailab.com/cse291-s26/assets/scribe_notes/may7_scribe.pdf) (UCSD CSE 291A (Spring 2026) - Guest lecture: Engineering vLLM) - May 7, 2026 scribe notes: Sections 4.1 (CPU overhead share) and 4.5 (full versus piecewise graphs, the attention-boundary split, Table 1). Depth: Treat the lecture's H100 percentages as its hardware result, not your target. Map its full/piecewise vocabulary onto v0.31.0 runtime modes; capture moved under `CudagraphDispatcher`.
3. [Decode-wrapper capture contract](https://docs.flashinfer.ai/api/attention.html#flashinfer.decode.BatchDecodeWithPagedKVCacheWrapper) (FlashInfer Documentation) - FlashInfer documentation: `BatchDecodeWithPagedKVCacheWrapper` constructor (`use_cuda_graph`, `backend`), `plan`/`run` Parameters and Notes (page read 2026-10-14, release 0.7.1). Depth: `plan` cannot run inside a graph or `torch.compile`; replay needs stable addresses and a planned shape. Read decode only.
4. [Padding policy and overlap](https://nvidia.github.io/TensorRT-LLM/developer-guide/overview.html) (TensorRT-LLM Architecture Overview) - Architecture Overview: Runtime Optimizations, CUDA Graph (padding to the nearest larger captured size) and Overlap Scheduler (page read 2026-10-14). Depth: Read the padding-versus-eager tradeoff and the overlap pipeline. The 22% figure is the page's result on its models and hardware, not your target. Note the page date before treating a path as available.

**Focus**

- A captured graph replays addresses, not values or shapes. New contents in the same static buffers replay correctly; a new batch size needs its bucket's capture or the eager path.
- The vLLM v1 dispatcher searches keys in the order `FULL`, then `PIECEWISE`, then `NONE`. A missing key runs eager. Cascade attention never takes a full graph.
- Most backends support full graphs only for uniform batches, so mixed batches downgrade automatically. Read the resolved runtime mode from logs, not the requested `cudagraph_mode`.
- Padding to a larger captured size executes wasted tokens to avoid a miss. Count padded rows as executed work and keep them out of goodput.

**Reproduce:** On your GPU, capture a two-op static-shape step (`addmm` plus in-place clamp) in `torch.cuda.CUDAGraph` after three warmup runs. Replay matches eager under `torch.testing.assert_close`, and new values written into the same buffers replay to the new expected outputs. Then list your engine's capture sizes, name which batch sizes hit, which pad and which miss to eager, and record interleaved eager/replay medians with the timed boundary stated.

**Traps**

- Reusing a capture after the batch shape changed and reporting the outputs. A stale graph replays stale addresses; recapture or take the eager path.
- Reading the configured `cudagraph_mode` as the executed mode. Downgrade by backend support is silent unless you check the dispatched runtime mode.
- Counting padded tokens as served work. They cost execution time but complete no request.

**Practice**

- The section mini-project covers this: `servelab` graph capture/replay checks with bucket, padding and miss accounting plus state-reset tests.

**Stop when:** Your capture replays identical results at captured shapes, misses fall back with no wrong outputs, and you can name the dispatched runtime mode for a uniform-decode and a mixed batch from the capture-size list.

<details>
<summary>Self-test</summary>

1. Why do new values in the same buffers replay correctly while a new batch size cannot?
   - Replay replays recorded addresses. Same-shape contents sit at the same addresses; a new shape needs different addresses and launches.
2. A batch misses every captured key. What runs?
   - The eager path (the `NONE` runtime mode). Count the miss; silent fallback hides a bucketing defect.
3. The backend table allows FlashInfer full graphs only for single-token uniform decode. What happens to a requested `FULL` mode on mixed batches?
   - It downgrades. Mixed batches cannot use full graphs with that backend, so they take piecewise or eager under the fallback policy.
4. Does graph replay make the matmul itself faster?
   - No. It removes repeated launch supply. The recorded kernels run unchanged; the measured gap is reduced host overhead.

</details>

#### U9. Compilation, graph breaks and recompilation in a serving path

**About 3 h** · **Target:** Measure

Topics: Compilation, graph breaks and recompilation

Graph capture from the previous unit replays only what compilation produced. A forward pass that recompiles per batch shape stalls at the worst moment, so breaks and guards belong in the serving path design.

**You can now**

- Explain graph breaks, guards and recompiles, and where each appears in a serving forward pass.
- Stabilize a bounded compiled path across the workload shape distribution with dynamic shapes or bucketing, and count the remaining recompiles.
- Place an intentional break around the dynamic attention operator instead of forcing full-graph compilation across it.

**Study**

1. [Graph breaks, guards and recompiles](https://docs.pytorch.org/docs/2.14/torch.compiler_troubleshooting.html) (PyTorch compiler troubleshooting guide (2.14)) - Graph break, Guards, Recompilation and Dynamic Shapes, with `TORCH_LOGS` set to `graph_breaks` and `recompiles`.
2. [Intentional breaks at the attention boundary](https://haoailab.com/cse291-s26/assets/scribe_notes/may7_scribe.pdf) (UCSD CSE 291A (Spring 2026) - Guest lecture: Engineering vLLM) - May 7, 2026 scribe notes: Section 4.5, the attention-boundary split with an intentional graph break before and after attention.
3. [Compile validation across bucketed shapes](https://github.com/cfregly/ai-performance-engineering/blob/b57e4c6a9e261c09ac09208705d040c81b03d35e/code/ch18/optimized_cudagraph_bucketing.py) (AI Systems Performance Engineering companion code - Chapter 18) - `run_compile_validation`: `torch.compile` with `dynamic=True`, `mode="reduce-overhead"` and a counting backend over padded bucket shapes. Depth: Read the validation logic, not bundled timings as targets. It runs bucketed shapes only; add your own unbucketed series to compare compile counts. The companion `decode_kernels.py` in the same folder compiles with `fullgraph=False`; `fullgraph=True` raises at the first graph break instead.

**Focus**

- A graph break splits one function into several graphs. `torch._dynamo.explain` reports the graph count with a reason per break, and each graph carries its own shape guards.
- Static guards specialize on sizes. Under `dynamic=False` every new batch size fails the size guard and recompiles; the default recompiles once and marks that size dynamic; `dynamic=True` compiles once (sizes 0 and 1 still specialize), and bucketing caps compiles at one per bucket.
- Inductor may reassociate reductions, so compiled output can differ from eager by a few ULPs. Compare with a tolerance, never with exact equality.
- Attention is the dynamic operator in a serving layer. vLLM splits the graph at attention by default (`splitting_ops`) so the static pieces stay capturable, the lecture's intentional break; the experimental `use_inductor_graph_partition` moves that split into Inductor at ops tagged `cudagraph_unsafe`.

**Reproduce:** On CPU, compile a function that computes `a = torch.relu(x)`, then calls `print("mid", a.shape)`, then returns `(a + 1).sum(-1)`, with `fullgraph=False`, and run `torch._dynamo.explain` on it: predict 2 graphs and 1 break naming builtin `print` before you run (a constant `print` before any traced op does not break). Then compile a reduction with `dynamic=False`, call it at two batch sizes above 1 under `TORCH_LOGS=recompiles`, and observe the size-mismatch guard recompile. Recompiling with `dynamic=True` runs both shapes with no recompile log and matches eager under `torch.testing.assert_close`, not `torch.equal`.

**Traps**

- Setting `fullgraph=True` to remove breaks. It raises on the first untraceable op; remove the op or scope compilation around it instead.
- Asserting compiled output equals eager output exactly. Reduction reassociation changes rounding within tolerance.
- Compiling once and assuming coverage. Every distinct guarded shape recompiles; count recompiles across the serving shape distribution.

**Practice**

- The section mini-project covers this: `servelab` compile, break and recompile logging with fallback and state-reset checks.

**Stop when:** You predict the break count of a small function before running `explain`, remove a shape recompile with bucketing or dynamic shapes, and can point to the intentional-break boundary in the serving path.

<details>
<summary>Self-test</summary>

1. What does `explain` report for the `print` function, and why two graphs?
   - Two graphs and one break naming builtin `print`. The traced ops before and after the untraceable call compile as separate graphs.
2. Why does the second batch size recompile under `dynamic=False`?
   - Guards specialized on the first size. The new size fails the size guard, so Dynamo recompiles for the new shape.
3. Where does an intentional break belong in a serving layer?
   - Around attention. Static MLP and norm regions stay compilable and capturable while the dynamic operator stays eager.
4. Compiled output differs from eager by a few ULPs. Is the compile wrong?
   - Not from that alone. Reassociated reductions round differently. Wrong means exceeding the declared tolerance or failing the oracle matrix.

</details>

#### U10. Kernel contracts, an independent oracle and randomized differential tests

**About 5 h** · **Target:** Implement

Topics: Shape, dtype, mask and tolerance contract; Independent PyTorch or NumPy oracle; Randomized differential tests; Batch-invariant reduction kernels

Independent references and differential and property tests and Tolerances and an extreme-value policy gave the generic method. A serving kernel adds absolute positions, paged gathers and grouped heads, so the oracle must stay independent of the runner's own metadata.

**You can now**

- Write the shape, dtype, stride, mask, position and tolerance contract for one serving kernel path.
- Build an independent double-precision oracle that shares no indexing, mask or reduction code with the candidate.
- Run a randomized differential matrix over shapes, dtypes, layouts and masks that fails seeded defects and honors an extreme-value policy.

**Study**

1. [FlashAttention oracle and public tests](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/tests/test_attention.py) (CS336 Assignment 2 - FlashAttention and Triton Sections) - `_attention_and_lse` (explicit scale, softmax, `logsumexp`), `_make_attn_inputs` (seed 0, batch 4, 128 by 128, width 64), `assert_close` at `rtol=1e-2, atol=1e-2` with the saved-LSE check in `_test_flash_forward_pass`; `test_flash_forward_pass_pytorch` and the parametrized triton cases.
2. [Attention-state merge contract](https://docs.flashinfer.ai/generated/flashinfer.cascade.merge_states.html) (FlashInfer Documentation) - FlashInfer documentation: `merge_states` over `v` of shape `[seq_len, num_states, num_heads, head_dim]` with float32 `s` of shape `[seq_len, num_states, num_heads]`, returning one merged output and logsumexp per head (page read 2026-10-14, release 0.7.1).
3. [Mask and tolerance contracts in the serving harness](https://github.com/cfregly/ai-performance-engineering/blob/b57e4c6a9e261c09ac09208705d040c81b03d35e/code/ch18/paged_attn_split_common.py) (AI Systems Performance Engineering companion code - Chapter 18) - `_build_dense_mask_from_block_table`, `_build_block_mask_from_block_table` with `mask_fn(batch, head, q_idx, kv_idx)`, plus `output_tolerance` and `precision_flags`.

**Focus**

- Share nothing with the candidate. The oracle recomputes positions, masks and reductions from the logical spec; importing the candidate's block table or mask builder makes the test circular.
- Declare tolerances per dtype before running. A double-precision oracle against a float candidate needs stated `rtol` and `atol`; all-masked rows, NaN, infinities and subnormals need explicit policies, not tighter defaults.
- Build every rectangular mask from absolute positions. `is_causal=True` in PyTorch's `scaled_dot_product_attention` and the CS336 reference mask are top-left aligned, which is wrong for a cached suffix, while some kernels align bottom-right; pass an explicit mask instead of trusting a flag.
- Merge split states through their normalizers with `merge_states`. Batch invariance means reordered requests or remapped pages keep per-request outputs identical, which needs a fixed split plan (`fixed_split_size` or `disable_split_kv` in the decode `plan`).

**Reproduce:** From a blank file, write a double-precision oracle for two decode requests (lengths 5 and 7, page size 4, four query heads, two KV heads, width 8, seed 0) with an explicit absolute-position causal mask. Compare an explicit-mask candidate at `rtol=1e-12, atol=1e-12` over contiguous queries and a strided view of the same data. A one-slot value shift and a top-left-mask substitution must both fail the comparison.

**Traps**

- Testing only comfortable shapes. Sample odd lengths, non-multiple-of-tile widths, empty rows and all-masked rows; dispatch fails at the tail.
- Fixing one seed and calling the suite randomized. Vary seeds and shapes per trial and pin one seed for the regression file.
- Tightening the tolerance to chase ULP noise from reduction order. Declare the accumulation contract first; noise inside it is not a defect.

**Practice**

- [CS336 Assignment 2: `test_flash_forward_pass_pytorch`](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/tests/test_attention.py) - Problem (`flash_forward`) (p. 26); wire your implementation through `get_flashattention_autograd_function_pytorch` in `tests/adapters.py` and pass `test_flash_forward_pass_pytorch` (plus the triton cases on your GPU). Implement in your own repository and follow assignment integrity: use concepts, invariants, tests and profiling, not copied solutions. The 1e-2 tolerance is the assignment's contract; your serving matrix keeps its own per-dtype tolerances.

**Stop when:** Your oracle fails the seeded shift and mask defects, passes the full matrix including an all-masked row under a stated policy, and your own implementation passes the CS336 forward tests.

<details>
<summary>Self-test</summary>

1. Why must the oracle avoid the candidate's mask builder?
   - Sharing it tests the kernel against itself. An independent mask from the logical spec is what catches offset defects.
2. What breaks when a cached suffix uses top-left causal?
   - Each query row attends keys up to its chunk-local index instead of its absolute position, dropping valid prefix keys. The absolute-position oracle mismatches on every row.
3. Why merge through normalizers instead of averaging partition outputs?
   - Partitions have different denominators. Weight each output by its normalizer before dividing by the combined one; `merge_states` is that operation.
4. The candidate passes float32 at 1e-2 but fails float64 at 1e-12. Is it broken?
   - Not established. The tolerance must match the dtype and accumulation contract. Restate the contract, then judge.

</details>

#### U11. Device timing, FLOP, byte and launch accounting, and profiler classification

**About 4 h** · **Target:** Derive + Measure

Topics: Warmup and correct device timing; FLOP, byte and launch accounting; Profiler evidence for bottleneck classification

Timed boundaries, asynchronous launch and event timing and Warp stalls, resource evidence and bottleneck classification taught generic timing and classification. Serving adds phase-shaped inputs, short-decode launch pressure and machine-state controls that decide whether a rerun reproduces.

**You can now**

- Time a serving kernel with warmup, device synchronization and repeated trials, reporting medians with the exact timed boundary.
- Derive FLOP, byte and launch counts for the measured shape and place the point against stated ceilings without calling position a bottleneck.
- Confirm or reject the predicted regime with profiler evidence: kernel summaries, NVTX ranges and the counters your GPU exposes.

**Study**

1. [Warmup, synchronization and profiler problems](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/cs336_assignment2_systems.pdf) (CS336 Assignment 2 - FlashAttention and Triton Sections) - Section 2.1.3 with Problem (`benchmarking_script`) (pp. 3 to 4): warmup steps plus `torch.cuda.synchronize` after each step; Section 2.1.4 with Problem (`nsys_profile`) (pp. 4 to 6): GPU Kernel Summary and NVTX ranges. Depth: Use the timing idiom and the profiler problem here; leave the full-model sweep for the baseline section.
2. [Benchmark idiom and the FLOP/byte ledger](https://github.com/cfregly/ai-performance-engineering/tree/b57e4c6a9e261c09ac09208705d040c81b03d35e/code/ch18) (AI Systems Performance Engineering companion code - Chapter 18) - `benchmark_attention` in `flex_attention_native.py` (warmup loop, device synchronize, one `Event` pair around the timed loop reported as a mean per call) and `compute_paged_attention_metrics` in `paged_attn_common.py` (FLOP, byte and roofline ledger). Depth: One event pair yields a mean; record per-iteration events yourself to report medians with spread.
3. [Machine state and benchmark method](https://nvidia.github.io/TensorRT-LLM/developer-guide/perf-benchmarking.html) (TensorRT-LLM Architecture Overview) - TensorRT LLM Benchmarking: Before Benchmarking (persistence mode, clock reset, power limits) and Throughput Benchmarking (page read 2026-10-14). Depth: Apply the machine-state controls or label the run uncontrolled. Leave dataset preparation and LoRA sections for later.

**Focus**

- Declare the timed boundary first: kernel, operator, step or request. Warmup must cover capture and autotune caches; the first iteration after a shape change measures a different regime.
- Report medians over repeated synchronized trials, with spread. Best-of hides the launch-supply variance that serving pays every step.
- Separate useful work from executed work. Padded buckets, masked lanes and reloaded tiles execute without serving; label modeled traffic as modeled and measure DRAM only with counters.
- Pin machine state or label the run uncontrolled. A drifting clock moves every ceiling the point is plotted against.

**Reproduce:** Closed-book, derive the ledger for one step `y = relu(x @ W + b)` with batch 8 and width 64 in float32: 65,536 dense-product FLOPs, and 20,736 ideal bytes fused or 24,832 if the matmul output is written and reread, hence a low-intensity prediction near 3.2 FLOP/byte fused (2.6 unfused) where launch supply dominates wall time at this size. On your GPU, time that step with 20 warmup and 200 synchronized event-timed iterations; report the median with the boundary and setup, then confirm the regime with a timeline or the counters your GPU exposes.

**Traps**

- Timing the enqueue call and reporting it as kernel time. Record events around the work and synchronize before reading.
- Comparing a replay median with an eager median taken under different warmup or synchronization. Interleave the two series instead.
- Placing a modeled-bytes point and reading the bottleneck off its position. Position proposes; stall and counter evidence dispose.

**Practice**

- The section mini-project covers this: `servelab` timing harness with warmup, ledgers, repeated-trial records and profiler ranges.

**Stop when:** Your ledger predicts the regime before you profile, interleaved medians with stated boundaries match the prediction or the profiler explains the mismatch, and a rerun under pinned machine state reproduces the median.

<details>
<summary>Self-test</summary>

1. Why warm up 20 before timing 200?
   - Warmup settles capture, autotune and clocks. Early iterations measure setup, not the steady step.
2. Median or best-of for the report?
   - Median with spread. Best-of hides the variance serving pays; a tail-sensitive SLO needs the distribution.
3. The point sits below the bandwidth ceiling. Is it bandwidth-bound?
   - Not established. Launch, occupancy or latency can dominate below the ceiling. Test with a launch-scaling sweep or stall evidence.
4. Clocks drift mid-sweep. What breaks?
   - Ceilings move, so reruns stop reproducing. Pin machine state per the benchmarking page or label the run uncontrolled.

</details>

#### U12. Engine dispatch and fallback, kernel-to-endpoint translation and negative results

**About 5 h** · **Target:** Implement + Measure

Topics: Engine dispatch and fallback integration; Kernel-to-endpoint translation; Negative end-to-end result preservation; FlashInfer backend selection and custom masks

Attention baselines, shape matrices, end-to-end translation and losing regimes gave the translation formula for generic blocks. Here the runner chooses backends per phase and batch, so translation must survive dispatch, padding and fallback.

**You can now**

- Wire one kernel path into a serving runner with explicit backend selection and a tested eager fallback.
- Translate a measured kernel win into endpoint TTFT, TPOT and goodput with Amdahl shares, or reject the win honestly.
- Preserve the negative result: keep outputs identical, keep the losing regime in the report, and keep the fallback as the shipped behavior where it loses.

**Study**

1. [Backend registry and graph fallback boundary](https://github.com/sgl-project/mini-sglang/blob/9a91cfafe754aa85daee49998176275667eb58f2/python/minisgl/engine/graph.py) (Mini-SGLang - Kernel, Model Runner and Overlap Boundaries) - `GraphRunner.pad_batch`, `can_use_cuda_graph`, `replay` and the `prepare_for_capture`/`prepare_for_replay` backend hooks in `engine/graph.py`; `create_attention_backend` in `attention/__init__.py` implements the registry with a hybrid `prefill,decode` string.
2. [Backend selection and capture limits](https://docs.flashinfer.ai/api/attention.html#flashinfer.decode.BatchDecodeWithPagedKVCacheWrapper) (FlashInfer Documentation) - FlashInfer documentation: the `backend` parameter (`auto`, `fa2`, `fa3`, `trtllm-gen`, `cute-dsl`, `prims-ts`) with automatic selection, `use_cuda_graph` rules, and the constraint that `plan` runs outside capture (page read 2026-10-14, release 0.7.1). Depth: For custom masks also open https://docs.flashinfer.ai/tutorials/kv_layout.html and read Mask Layout (2D Ragged Tensor). Keep `backend="auto"` on stable backends: experimental ones join automatic selection only with `FLASHINFER_ALLOW_EXPERIMENTAL_AUTO_BACKENDS=1` (Experimental APIs and Backends page), and naming one explicitly opts in too.
3. [Decode-kernel dispatch and the eager endpoint baseline](https://github.com/cfregly/ai-performance-engineering/blob/b57e4c6a9e261c09ac09208705d040c81b03d35e/code/ch18/baseline_vllm_v1_integration.py) (AI Systems Performance Engineering companion code - Chapter 18) - `BaselineVLLMV1Integration` (`enforce_eager=True` baseline, `SamplingParams`, `llm.generate`, `mean_latency_ms` and `throughput_tokens_per_sec`); compare with `build_decode_kernel` in `decode_kernels.py` (`prefer_vllm` selects the vLLM path, `prefer_vllm=False` keeps the explicit torch path). Depth: The dispatch file reads `paged_attention_v1` from `vllm._custom_ops`, which vLLM 0.31.0 does not provide; treat it as a dispatch sketch and verify the op name against your engine version. With `prefer_vllm=True` a missing op raises instead of falling back, unlike the tested fallback this unit asks for.

**Focus**

- Dispatch is per phase and batch, not per model. A hybrid `prefill,decode` string can win prefill and lose decode; log the backend per phase before translating.
- Translate with shares, not kernels. For a kernel speedup $`s`$ on a runtime share $`f`$, endpoint speedup is $`S = 1 / ((1 - f) + f / s)`$: a 2x win on a 10% share is barely 1.05x, before padding and fallback shrink the share further.
- A fallback that never fires in testing is untested. Force an unsupported shape, dtype or backend and check outputs plus the miss count.
- Custom masks ride the same dispatch. A mask the backend cannot express must fall back with identical outputs, not silently run unmasked.

**Reproduce:** Closed-book, derive the endpoint translation for a measured 2x kernel win on a 10% share: about 1.05x. Then build a two-backend dispatch matrix (serve path versus explicit torch path) over supported and unsupported shapes with per-phase backend logging; unsupported cases must take the fallback with identical outputs and a counted miss. Run the endpoint comparison under a fixed replayable load and report improvement or honest rejection with outputs preserved.

**Traps**

- Averaging per-kernel speedups into an endpoint claim. Weight by measured shares under the serving shape distribution.
- Testing dispatch only on supported shapes. The fallback path ships too; an untested fallback is a latent outage.
- Dropping the negative result from the report. A documented loss with its regime is section evidence; an unreported one will be rediscovered in production.

**Practice**

- The section mini-project covers this: `servelab` endpoint translation with per-phase dispatch logs, preserved outputs, and a kept negative result.

**Stop when:** One kernel path ships behind dispatch with a tested fallback, the endpoint comparison under replayable load shows a win or a preserved rejection, and every number traces to a logged share.

<details>
<summary>Self-test</summary>

1. A kernel runs 3x faster on half the runtime. What is the endpoint win?
   - About 1.5x: $`1 / (0.5 + 0.5 / 3)`$. Padding and fallback batches shrink the half further.
2. The fallback never triggers in your tests. Done?
   - No. Force unsupported inputs and verify identical outputs plus miss accounting; otherwise the fallback is untested code.
3. Backend A wins decode but loses prefill. Which ships?
   - The workload's phase mix decides. Log per-phase backends, translate each phase, and keep the hybrid or per-phase choice the numbers support.
4. The endpoint shows no win with outputs preserved. Report or retry?
   - Report. A preserved negative result with its regime and shifted bottleneck is the required evidence.

</details>

### Mini-project: Serving kernels with oracles, graphs and endpoint translation

**About 12 to 18 hours.** Build independent CPU oracles for residual, attention, paged KV and sampling paths in `engine/`, with shape ledgers and a timing harness. Capture graphs, log compilation, wire one path through dispatch with fallback, and translate the win or keep the loss.

1. Write double-precision CPU references for fused residual-add plus norm and online-softmax merges in `engine/`, checking retained residuals and activations through repeated calls with empty-partition and overlap policies stated.
2. Derive prefill, cached-chunk and decode shape ledgers with FLOP and byte predictions for your workload matrix, plus stride and alignment dispatch cases with a fusion ledger that keeps conversion and retained-output costs.
3. Build a page-gather and head-mapping oracle independent of backend scheduling, and prove appends across page boundaries with absolute RoPE positions under reorder, remap, compaction, cancellation and slot reuse with poisoned tails.
4. Implement masked greedy and filtered stochastic selection with a declared filter order and tie policy, keep grammar and random state per request across slot changes, time mask work apart from selection, and pass the CS336 forward attention tests.
5. Trace a two-stream producer and consumer dependency with completion events and buffer lifetimes, time completed serving steps with warmup and interleaved medians, and check cancellation-safe buffer reuse in a CPU event simulation with profiler ranges.
6. Capture and replay a static-shape decode step with bucket, padding and miss accounting, log compile breaks with recompile counts and a tested eager fallback, check state reset after both, then translate one kernel win to endpoint TTFT, TPOT and goodput with per-phase dispatch logs, keeping the losing regime.

**Deliverables**

- CPU oracles with shape ledgers, paged-KV lifecycle checks and the sampling oracle with per-request state tests.
- Timing harness with warmup, interleaved medians, profiler ranges and the stream dependency trace.
- Graph and compile evidence with dispatch logs, endpoint translation and the preserved losing regime.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [CS336 Assignment 2 attention tests](https://github.com/stanford-cs336/assignment2-systems/blob/ca8bc81a59b70516f7ebb2da4808daade877c736/tests/test_attention.py). Pass `test_flash_forward_pass_pytorch`, plus the Triton cases on your GPU; keep serving tolerances apart from the assignment contract.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Oracle independence | Oracles share no indexing, mask or reduction code with the candidate, and seeded shift and mask defects fail visibly. | The matrix spans odd lengths, partial pages, empty rows and remapped allocations under stated per-dtype tolerances. |
| Lifecycle correctness | Append, gather, RoPE positions and sampler state survive reorder, compaction and slot reuse with poisoned tails inert. | A stale-offset defect and a grammar-state leak are both caught by the request-identity tests. |
| Honest timing | Medians come from interleaved synchronized trials with stated boundaries, and profiler evidence backs the bottleneck call. | Graph and compile wins translate to endpoint goodput by share math, or the negative result ships with its regime. |

Feeds into: Oracles, timing harness, dispatch logs and translation feed quantized and speculative integration, production gates and the capstone report.

### Resource route

- **Primary - Paper:** [FlashInfer: Efficient and Customizable Attention Engine for LLM Inference Serving](https://arxiv.org/abs/2501.01005) - Read the storage heterogeneity, plan and run separation, load-balanced scheduling, customization, CUDA Graph compatibility and end-to-end evaluation. Use it to connect serving-shaped attention kernels to dynamic workloads and dispatch constraints.
- **Required - Book:** [AI Systems Performance Engineering - Chapters 18 and 19, decode kernels and engine optimizations](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) - Read "Optimized Decode Kernels" in Chapter 18 (FlashMLA, ThunderMLA, FlexDecoding), then the Chapter 19 sections on kernel autotuning, occupancy-aware kernel selection, hot-swappable kernels and CUDA-graph prewarming. Choose one bounded critical path to verify.
- **Required - Lab:** [AI Systems Performance Engineering companion code - Chapter 18](https://github.com/cfregly/ai-performance-engineering/tree/main/code/ch18) - Start with paged_attn_common.py, the dense versus paged layout pair, CUDA graph bucketing and the vLLM integration pair. Run correctness tests first, then a hardware-compatible benchmark with newly captured artifacts.
- **Required - Paper:** [FlashAttention-2: Faster Attention with Better Parallelism and Work Partitioning](https://arxiv.org/abs/2307.08691) - Derive online-softmax state, memory traffic and work partitioning. Implement only a small oracle-backed version or use the CS336 assignment; production kernel tuning belongs to the GPU track.
- **Required - Reference:** [FlashInfer Documentation](https://docs.flashinfer.ai/) - Use the current attention, PageAttention, sampling, JIT and CUDA Graph interfaces while implementing. Pin the version and supported GPU architecture, and validate dispatch and fallback over the real workload shape distribution.
- **Required - Assignment:** [CS336 Assignment 2 - FlashAttention and Triton Sections](https://github.com/stanford-cs336/assignment2-systems) - Complete the relevant derivation, PyTorch reference and Triton sections using your own code. Follow assignment integrity: use external help for concepts, invariants, tests and profiling, not copied solutions or edited answer code.
- **Support - Implementation:** [Mini-SGLang - Kernel, Model Runner and Overlap Boundaries](https://github.com/sgl-project/mini-sglang) - Trace how FlashAttention or FlashInfer, KV layouts, tensor parallel communication and overlap scheduling meet the model runner. Identify the fallback and state-reset boundary before attempting a change.
- **Support - Course:** [UCSD CSE 291A (Spring 2026) - Guest lecture: Engineering vLLM](https://haoailab.com/cse291-s26/assets/scribe_notes/may7_scribe.pdf) - Read the scribe notes, Sections 4 and 5: CPU overhead, the API server and renderer, synchronous and asynchronous engine-core scheduling, GPU-side input preparation, piecewise CUDA graphs and the hybrid kernel strategy.
- **Support - Reference:** [vLLM CUDA Graphs design (v0.31.0)](https://docs.vllm.ai/en/v0.31.0/design/cuda_graphs/) - Use the capture modes, batch-size buckets and piecewise splitting around attention to explain what a graph replay can and cannot include.
- **Support - Course:** [LLM Inference: From scratch, one token at a time - Module 07](https://inference.tusharamrit.in/modules/attention-kernels.html) - Work the Attention Kernels module for the decode-attention memory traffic and the paged-attention gather before the matching units.
- **Reference - Reference:** [AI Performance Engineering - Kernel Optimization, Profiling and Attention](https://github.com/wafer-ai/gpu-perf-engineering-resources) - A curated index. Use Sections 2 and 3 only to find a kernel or profiler source the other entries lack.
- **Support - Reference:** [TensorRT-LLM Architecture Overview](https://nvidia.github.io/TensorRT-LLM/developer-guide/overview.html) - Use the runtime-optimization section to compare graph replay, overlap scheduling and backend dispatch with your selected engine. Record current version and hardware support before treating a path as available.
- **Required - Reference:** [vLLM structured outputs (v0.31.0)](https://docs.vllm.ai/en/v0.31.0/features/structured_outputs/) - Read Offline Inference and the API-field migration warning; trace grammar bitmask application before sampling in the versioned model-runner API.
- **Reference - Reference:** [PyTorch compiler troubleshooting guide (2.14)](https://docs.pytorch.org/docs/2.14/torch.compiler_troubleshooting.html) - Read Graph break, Guards, Recompilation and Dynamic Shapes; run `TORCH_LOGS` set to `graph_breaks` and `recompiles` on a small serving-shaped function.

### Exit checkpoint

Integrate one oracle-backed kernel or graph path, pass the serving shape and dtype matrix, explain its measured hardware bottleneck, and either demonstrate or honestly reject endpoint benefit under replayable load.

<details>
<summary>Deliberately left for later</summary>

- Custom kernels unrelated to the measured serving critical path
- Backward kernels unless the selected inference path needs them
- Hardware claims for architectures that were not measured

</details>

## INF-6. Quantization and Speculative Decoding

**Why:** Low precision and speculative execution change memory, kernels, quality and request state. Both need a correctness contract and measured crossover region, not a nominal bit width or acceptance-rate headline.

### Learn this much

- [ ] Integer and floating-point inference formats _(Required)_
- [ ] Weight-only, weight-activation and KV quantization _(Required)_
- [ ] Symmetric and asymmetric quantization _(Required)_
- [ ] Scale, zero point and representable range _(Required)_
- [ ] Per-tensor, per-channel and group granularity _(Required)_
- [ ] Calibration data and observer selection _(Required)_
- [ ] Outliers and activation smoothing _(Required)_
- [ ] Packing, metadata and alignment overhead _(Required)_
- [ ] Accumulator precision and dequantization _(Required)_
- [ ] Fused dequantization and hardware kernel support _(Required)_
- [ ] Post-training and quantization-aware vocabulary _(Required)_
- [ ] Perplexity, task and slice quality checks _(Required)_
- [ ] Memory, latency and throughput measurement _(Required)_
- [ ] Draft and target model roles _(Required)_
- [ ] Exact speculative acceptance probability _(Required)_
- [ ] Correction distribution after rejection _(Required)_
- [ ] Cache advance, rollback and stop handling _(Required)_
- [ ] Tokenizer and vocabulary compatibility _(Required)_
- [ ] Draft cost, target verification and accepted tokens _(Required)_
- [ ] Speculation speedup and crossover model _(Required)_
- [ ] N-gram, tree and learned-draft vocabulary _(Required)_
- [ ] Medusa, EAGLE and multi-token-head orientation _(Required)_
- [ ] Deterministic distribution simulator _(Required)_
- [ ] Distributional equivalence tests _(Required)_
- [ ] Quantized or speculative engine integration _(Required)_
- [ ] Versioned configuration and safe fallback _(Required)_
- [ ] Benefit and loss regions across batch and length _(Required)_
- [ ] Mixed-precision layer sensitivity search _(Optional)_
- [ ] KV cache quantization under long context _(Optional)_
- [ ] Structured decoding combined with speculation _(Optional)_
- [ ] Custom quantized kernel or learned drafter evaluation _(Depth)_
- [ ] Novel sub-4-bit format without hardware and quality evidence _(Later)_

### Study units

#### U1. Inference number formats and what gets quantized

**About 4 h** · **Target:** Explain + Derive

Topics: Integer and floating-point inference formats; Weight-only, weight-activation and KV quantization

Precision sets the memory floor for every later decision. A plan that confuses nominal bits with served bytes mispredicts capacity by gigabytes.

**You can now**

- Explain how INT8, INT4, FP8 and microscaled FP4 trade dynamic range against storage, and where each sits in a serving path.
- Derive weight memory for a dense model under FP16, INT8 and INT4, and state which tensors the count covers.
- Distinguish weight-only, weight-activation and KV quantization by what gets smaller, what gets faster and what still needs high precision.

**Study**

1. [Quantization: formats and where they help](https://www.oreilly.com/library/view/hands-on-llm-serving/9798341621480/) (Hands-On LLM Serving and Optimization - Quantization (Chapter 6) and Speculative Decoding (Chapter 7)) - Chapter 6, Model Compression: Quantization (printed pp. 206 to 213): Storing numbers with Table 6-1, How does quantization help in model serving with Table 6-2, and Weight-only versus weight-and-activation quantization strategies with the Marlin and Machete kernels. Depth: Skip the hands-on quantization commands and the Qwen walkthrough here; they belong to the measurement unit. Table 6-2 lists the H100 SXM Tensor Core peaks with sparsity (dense rates are half), and its line that 4-bit weights double FLOPS again does not hold for weight-only formats, which compute in 16-bit.
2. [Number formats, range and granularity](https://www.baseten.co/inference-engineering/) (Inference Engineering - Section 5.1, Quantization) - Section 5.1.1, Number Formats: the format table with first architecture, then Precision, Type and Scale factor, then Dynamic range and Granularity.
3. [Day 13: number formats from scratch](https://github.com/elizabetht/100-days-of-inference/blob/main/day13/quantization-number-formats.ipynb) (100 Days of LLM Inference - Days 13, 14 and 15) - Notebook `day13/quantization-number-formats.ipynb`: Part 1 Quantization Math (scale and zero point), Part 2 Memory Savings and Throughput Impact, Part 3 FP8, Part 4 NVFP4.

**Focus**

- INT formats spread levels evenly while FP formats spend bits on exponent range. Activations with outliers therefore usually lose less in FP8 E4M3 than in INT8 under one per-tensor scale.
- W4A16 means 4-bit weights with 16-bit activations. Weight-only quantization shrinks storage and weight traffic but still computes in high precision after dequantization.
- Weight-activation quantization can raise compute throughput, but only where a kernel for the exact pair exists on your GPU. A format without kernel support is storage only.
- KV quantization targets capacity and decode traffic, not prefill FLOPs. Without a quantized attention kernel the values are dequantized back before the dot product.

**Reproduce:** Closed-book, derive that a 7B-parameter model needs 14 GB in FP16, 7 GB in INT8 and 3.5 GB in INT4 for weights alone, then name the two costs the nominal count omits: per-group scales with zero points, and the KV cache.

**Traps**

- Reading H100 FP8 throughput as a portable speedup. FP8 Tensor Cores need compute capability 8.9 or higher (Ada, Hopper and later); on Ampere, vLLM runs FP8 checkpoints as weight-only Marlin, so the W8A8 speedup does not exist there.
- Counting 4 bits per weight. Group scales, zero points and alignment push the served rate above nominal; NVFP4 lands near 4.5 effective bits per weight (an 8-bit scale per 16 values) before its per-tensor global scale.
- Expecting KV quantization to cut prefill time. It cuts capacity and decode traffic; a latency win needs a quantized attention kernel alongside it.

**Practice**

- [100 Days of LLM Inference Day 13: number-format experiments](https://github.com/elizabetht/100-days-of-inference/blob/main/day13/quantization-number-formats.ipynb) - Try These Experiments in `day13/quantization-number-formats.ipynb`: run the FP8, INT8, INT4 and NVFP4 cells and record error per format with the memory model from Reproduce. Treat the notebook numbers as implementation checks on tiny tensors, not as serving evidence.

**Stop when:** You derive the three weight-memory numbers without notes and can say for each of W4A16, W8A8 and FP8 KV which traffic shrinks and which kernel the speedup needs.

<details>
<summary>Self-test</summary>

1. A 7B model needs 14 GB for weights in FP16. What do INT8 and INT4 need, and what is missing from both numbers?
   - 7 GB and 3.5 GB. Both omit scale and zero-point storage, alignment padding, and the KV cache and activations.
2. Why does FP8 E4M3 suit spiky activations better than INT8 at the same width?
   - Its exponent bits give wide dynamic range for outlier magnitudes. INT8 spreads levels evenly, so one scale either saturates on the outlier or crushes small values.
3. A weight-only INT4 model shows slower first-token latency than the FP16 baseline at high concurrency. What mechanism explains it?
   - Weights are dequantized to 16-bit before compute, so prefill arithmetic does not shrink while dequantization overhead is added. Weight-only quantization buys memory and decode bandwidth, not compute.
4. The KV cache is quantized but attention still runs in FP16. What happens each step?
   - Values are dequantized back before the dot product. Capacity falls but arithmetic cost does not; keep this separate from a quantized-attention speedup.

</details>

#### U2. Symmetric and asymmetric quantization, scales, zero points and granularity

**About 4 h** · **Target:** Derive + Implement

Topics: Symmetric and asymmetric quantization; Scale, zero point and representable range; Per-tensor, per-channel and group granularity

Every quantized serving path is this map plus metadata. If you cannot predict what a scale does to small values, calibration and method comparisons stay mysterious.

**You can now**

- Derive symmetric and asymmetric quantize and dequantize maps, with scale, zero point and clipping.
- Compute representable range and worst-case rounding error for a stated width and granularity.
- Implement per-tensor, per-channel and grouped affine quantization on a small tensor and report error per choice.

**Study**

1. [Day 13 Part 1: scale and zero point](https://github.com/elizabetht/100-days-of-inference/blob/main/day13/quantization-number-formats.ipynb) (100 Days of LLM Inference - Days 13, 14 and 15) - Notebook `day13/quantization-number-formats.ipynb`, Part 1 Quantization Math: `quantize_symmetric`, `dequantize_symmetric` and the error `|x - xhat|` cells, with the outliers exercise.
2. [Quantization preliminaries: symmetry, static versus dynamic, granularity](https://arxiv.org/abs/2211.10438) (SmoothQuant: Accurate and Efficient Post-Training Quantization for Large Language Models) - SmoothQuant arXiv:2211.10438v7, Section 2 Preliminaries: symmetric versus asymmetric cases with zero point, static versus dynamic quantization, and per-tensor, per-token, per-channel and group-wise granularity.
3. [Granularity: tensor, channel and block scales](https://www.baseten.co/inference-engineering/) (Inference Engineering - Section 5.1, Quantization) - Section 5.1.1, Number Formats: the Granularity paragraphs (tensor single scale, channel per-vector, block of N values) and the MXFP8, MXFP4 and NVFP4 block sizes.

**Focus**

- Symmetric maps $`x_q = \mathrm{round}(x / s)`$ with $`s = \max|x| / (2^{b-1} - 1)`$ and zero point 0. Asymmetric maps use $`s = (x_{\max} - x_{\min}) / (2^b - 1)`$ with $`z = \mathrm{round}(-x_{\min} / s)`$, rounded and clamped to range.
- One outlier stretches $`s`$ and crushes the bulk: every value below $`s/2`$ rounds to zero. Clipping the range trades saturation error against rounding error.
- Finer granularity lowers error but adds scale storage. Group-128 INT4 with FP16 scale and zero point adds $`(16 + 16) / 128 = 0.25`$ bits per weight.
- Weights normally take per-channel or grouped scales while activations take per-tensor static or per-token dynamic scales, because activation ranges move with the input.

**Reproduce:** From a blank file, implement symmetric and asymmetric INT8 quantize and dequantize. On $`[-3.0, 0.1, 100.0]`$, show one group gives $`s \approx 0.79`$ and maps 0.1 to 0, then split into groups $`[-3.0, 0.1]`$ and $`[100.0]`$ and show 0.1 survives as code 4 with $`s = 3/127`$.

**Traps**

- Leaving the zero point unrounded or unclamped. It must be an integer code in range, not a float; otherwise dequantization shifts every value.
- Quoting nominal width as served width. Scales, zero points and alignment padding are real bytes; state effective bits per value.
- Copying per-channel scales to activations. Activation ranges depend on the input, so static per-channel activation scales go stale while per-token dynamic scales track them.

**Practice**

- [100 Days of LLM Inference Day 13: symmetric pipeline and error](https://github.com/elizabetht/100-days-of-inference/blob/main/day13/quantization-number-formats.ipynb) - Part 1 cells: extend `quantize_symmetric` to an asymmetric variant and to grouped scales, and plot error against groups of 128, 32 and 8 on an outlier tensor. Score error on held-out random tensors, not the tensor you used to pick the range.

**Stop when:** Your blank-file quantizer reproduces the 0.1-to-0 collapse and its grouped fix, and you can state scale, zero point and overhead for any width and group size.

<details>
<summary>Self-test</summary>

1. What are the symmetric INT8 scale and codes for $`\max|x| = 100`$?
   - Scale $`s = 100 / 127 \approx 0.79`$. Then 100 maps to 127 and dequantizes to 100.0, and any value below about 0.39 maps to 0.
2. For range $`[-3, 100]`$ in asymmetric INT8, what are the scale and zero point?
   - Scale $`s = 103 / 255 \approx 0.40`$ and zero point $`z = \mathrm{round}(3 / s) = 7`$. Real zero maps exactly to code 7. The symmetric map also represents zero exactly, at code 0; the asymmetric gain is using the full code range on a skewed interval.
3. Why does one outlier destroy small values under a per-tensor scale?
   - The outlier sets $`s`$, so the step dwarfs small magnitudes. Splitting the range into groups or channels gives the bulk its own smaller step.
4. Group-128 INT4 stores an FP16 scale and an FP16 zero point per group. What is the overhead?
   - $`32 / 128 = 0.25`$ bits per weight, so the served rate is about 4.25 bits per weight before alignment.

</details>

#### U3. Calibration, observers, outliers and activation smoothing

**About 4 h** · **Target:** Derive + Implement

Topics: Calibration data and observer selection; Outliers and activation smoothing

Outliers decide whether activation quantization survives. Calibration picks the range, and smoothing or salient scaling decides which side absorbs the difficulty.

**You can now**

- Run static and dynamic calibration on one linear layer and explain when each range goes stale.
- Derive the SmoothQuant migration $`Y = (X \mathrm{diag}(s)^{-1})(\mathrm{diag}(s) W)`$ and the per-channel factor from activation and weight maxima.
- Contrast activation smoothing with salient-weight scaling on an outlier channel, with error numbers.

**Study**

1. [Outliers, smoothing and the O1 to O3 ladder](https://arxiv.org/abs/2211.10438) (SmoothQuant: Accurate and Efficient Post-Training Quantization for Large Language Models) - SmoothQuant arXiv:2211.10438v7, Section 3 Review of Quantization Difficulty (outliers near 100x, fixed channels), Section 4 SmoothQuant with the migration equation and the $`\alpha = 0.5`$ and $`0.75`$ settings, and Section 5.1 setups (512 Pile sentences, $`\alpha`$ grid search, O1 per-token dynamic versus O2/O3 per-tensor). Depth: Read the O1, O2 and O3 rows as a cost ladder, not as three methods to deploy. Stop before the distributed results.
2. [Salient weights and activation-aware scaling](https://arxiv.org/abs/2306.00978) (AWQ: Activation-Aware Weight Quantization for LLM Compression and Acceleration) - AWQ arXiv:2306.00978v6, Section 3.1 (protecting 1 percent of salient weights, perplexity 43.2 to 13.0) and Section 3.2 (activation-aware scaling search), plus Figure 8 on smaller calibration sets and calibration distribution robustness.
3. [Day 14: GPTQ, AWQ and SmoothQuant cells](https://github.com/elizabetht/100-days-of-inference/blob/main/day14/quantization-gptq-awq-smoothquant.ipynb) (100 Days of LLM Inference - Days 13, 14 and 15) - Notebook `day14/quantization-gptq-awq-smoothquant.ipynb`: AWQ Activation-Aware Weight Quantization (`awq_get_scales`, `awq_quantize`) and SmoothQuant Migration Transform (`smoothquant_calibrate`).
4. [MIT 6.5940 Lecture 13: SmoothQuant and AWQ in lecture form](https://hanlab.mit.edu/courses/2024-fall-65940) (MIT 6.5940 TinyML and Efficient Deep Learning Computing - Quantization Lectures) - Lecture 13 Efficient LLM Deployment slides and video, Quantization part: Weight-Activation Quantization: SmoothQuant, then Weight-Only Quantization: AWQ and TinyChat. Lectures 5 and 6, Quantization Part I and II, cover the fundamentals if you need them.

**Focus**

- Static calibration fixes ranges from sample data and goes stale when the workload shifts; dynamic calibration reads ranges at runtime and costs compute per step. Name which one each scale uses.
- SmoothQuant moves difficulty from activations to weights with a per-channel factor $`s_j = \max|X_j|^\alpha / \max|W_j|^{1-\alpha}`$, fused offline into neighboring layers so inference sees ordinary INT8.
- AWQ scales every weight input channel by $`s = s_X^{\alpha}`$, with $`s_X`$ the mean activation magnitude and $`\alpha`$ grid-searched, so salient channels get the largest factors; the inverse folds into the previous operator. Same form as SmoothQuant, aimed at weight error at W4A16.
- Calibration distribution matters: matched calibration and evaluation data wins, and AWQ reaches good perplexity with a much smaller set than GPTQ-style Hessian methods.

**Reproduce:** On one small linear layer with a planted outlier channel, compute per-channel maxima, apply the SmoothQuant factor with $`\alpha = 0.5`$, and show the activation range collapses while the product $`XW`$ is unchanged up to floating-point tolerance.

**Traps**

- Calibrating on the evaluation set and reporting the error there. Calibration data is fitted state; score quality on held-out prompts.
- Treating smoothing as free accuracy. It shifts quantization difficulty into the weights, so weight error rises; the win is that INT8 weights tolerate it better than INT8 activations tolerate outliers.
- Assuming one $`\alpha`$ fits all models. The paper grid-searches $`\alpha`$ per model family, 0.5 for OPT and BLOOM and 0.75 for GLM-130B, because outlier strength differs.

**Practice**

- [100 Days of LLM Inference Day 14: SmoothQuant and AWQ cells](https://github.com/elizabetht/100-days-of-inference/blob/main/day14/quantization-gptq-awq-smoothquant.ipynb) - Experiments: Try These in `day14/quantization-gptq-awq-smoothquant.ipynb`: run `smoothquant_calibrate` and `awq_get_scales` on a layer with a planted outlier channel and compare output error against naive round-to-nearest. Report error per method on held-out inputs, and state which scales are static and which would need runtime statistics.

**Stop when:** You derive the migration factor from channel maxima, show the unchanged product on one layer, and can say for each scale in your pipeline whether it is static or dynamic and what data fixed it.

<details>
<summary>Self-test</summary>

1. An activation channel peaks at 100 while most peak near 1. What breaks under per-tensor INT8 activation quantization?
   - The single scale stretches to the outlier, so the bulk rounds to a few codes near zero. Per-channel smoothing or per-token dynamic ranges contain the damage.
2. Why is the SmoothQuant transform mathematically equivalent before rounding?
   - It inserts $`\mathrm{diag}(s)^{-1} \mathrm{diag}(s) = I`$ between activation and weight. The product is unchanged; only the rounding that follows sees friendlier ranges.
3. Static activation scales calibrated on chat prompts now serve code. What symptom appears?
   - Clipping or coarse steps on unseen magnitude patterns, hence quality drift. Recalibrate on the serving distribution or switch that tensor to dynamic ranges.
4. How do AWQ and SmoothQuant differ in what they protect?
   - AWQ scales all weight input channels by factors derived from activation magnitudes, largest on the salient ones, protecting weight rounding. SmoothQuant scales down outlier activation channels, protecting activations at some cost to weight error.

</details>

#### U4. Packing overhead, accumulator precision and fused dequantization kernels

**About 4 h** · **Target:** Explain + Derive

Topics: Packing, metadata and alignment overhead; Accumulator precision and dequantization; Fused dequantization and hardware kernel support

Nominal width is not served width, and unpacked weights are not faster weights. The kernel decides whether quantization pays; the packing decides what it costs.

**You can now**

- Compute served bits per weight from code width, group scales, zero points and alignment for one layout.
- Explain why INT8 products accumulate in INT32 and where overflow would first appear.
- Distinguish fused dequantization-free kernels from dequantize-then-compute paths, and check support on your GPU.

**Study**

1. [Packing, fusion and on-the-fly dequantization](https://arxiv.org/abs/2306.00978) (AWQ: Activation-Aware Weight Quantization for LLM Compression and Acceleration) - AWQ arXiv:2306.00978v6, Section 4.2 Deploy AWQ with TinyChat: on-the-fly weight dequantization, SIMD-aware weight packing with the reordered layout figure, and kernel fusion of QKV and position embeddings.
2. [Mixed-precision kernels and quantization hardware notes](https://www.oreilly.com/library/view/hands-on-llm-serving/9798341621480/) (Hands-On LLM Serving and Optimization - Quantization (Chapter 6) and Speculative Decoding (Chapter 7)) - Chapter 6 (printed pp. 211 to 213): the Marlin kernel for Ampere and Machete kernel for Hopper paragraph, the W4A16 with GPTQ or AWQ versus W8A8 table entries, and FP8 Is Not Always Applicable with the E4M3 and E5M2 table. Depth: The FP8 Is Not Always Applicable box names only Hopper and Blackwell; Ada GPUs (compute capability 8.9) also have FP8 Tensor Cores, and the vLLM v0.31.0 table lists FP8 W8A8 for Ada and Hopper.
3. [Fusing dequantization into the execution graph](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 15 and 16, speculation and quantization) - Chapter 16, Quantization Approaches for Real-Time Inference: Fusing Quantization-Dequantization Steps into the Execution Graph, with weight packing and the CUDA and Triton kernel notes.
4. [Day 13 Part 4: microscaled block overhead](https://github.com/elizabetht/100-days-of-inference/blob/main/day13/quantization-number-formats.ipynb) (100 Days of LLM Inference - Days 13, 14 and 15) - Notebook `day13/quantization-number-formats.ipynb`, Part 4 NVFP4: `quantize_nvfp4_block` with block size 16 and the effective-bits accounting.

**Focus**

- Packing reorders sub-byte codes so vector loads stay aligned; the layout in the AWQ figure exists so one instruction feeds many lanes. Count the scale bytes beside the code bytes.
- An INT8 product reaches $`127 \times 127 = 16{,}129`$, and a dot product over thousands of terms overflows INT16 quickly. Accumulate in INT32, then scale once at the end.
- Fused kernels multiply INT4 or FP8 weights against FP16 activations in one pass. Dequantize-then-compute paths pay full high-precision arithmetic plus conversion overhead.
- Hardware support is a table lookup, not a trend. In the vLLM v0.31.0 table FP8 W8A8 needs Ada or Hopper (compute capability 8.9 and up), Marlin covers Turing through Hopper, and GGUF, built for CPU and Apple Silicon runtimes, is listed on GPUs.

**Reproduce:** Closed-book, compute the served rate for group-64 INT4 with one FP16 scale and one INT8 zero point per group, and state the smallest dot-product length at which INT16 accumulation of INT8 products can overflow, with codes in $`[-127, 127]`$.

**Traps**

- Benchmarking unpacked reference code and calling it the quantized result. Without the packed layout and fused kernel the numbers describe dequantization overhead, not the method.
- Accumulating in the quantized width. Saturation looks like a quality regression but is an arithmetic bug; widen the accumulator first.
- Assuming an FP8 model runs anywhere. The weights load but the Tensor Core path is missing, so execution falls back or fails; check the support table before planning a run.

**Practice**

- [100 Days of LLM Inference Day 13: block-scale accounting](https://github.com/elizabetht/100-days-of-inference/blob/main/day13/quantization-number-formats.ipynb) - Part 4 NVFP4 cells: vary the block size in `quantize_nvfp4_block`, measure error and effective bits per weight, and state which block size your error budget allows. Keep the error tensor and the bit accounting in the same table; one without the other proves nothing.

**Stop when:** You compute served bits for any group layout without notes and can say for a stated GPU whether the INT4 and FP8 paths are fused, emulated or absent.

<details>
<summary>Self-test</summary>

1. Group-64 INT4 stores one FP16 scale and one INT8 zero point per group. What is the served rate?
   - $`4 + (16 + 8) / 64 = 4.375`$ bits per weight, before any alignment padding.
2. Why must INT8 products accumulate in INT32?
   - One product already reaches 16,129, and a 4096-term dot product can approach $`6.6 \times 10^7`$, beyond INT16 range. INT32 holds it; scale back after the sum.
3. What distinguishes the Marlin and Machete kernels from a naive dequantize-then-multiply path?
   - They fuse quantized weight access into the matrix multiplication, so low-bit weights meet FP16 activations in one pass without materializing a full-precision copy.
4. NVFP4 reports about 4.5 effective bits. Where does the half bit come from?
   - Each block of 16 values shares an FP8 scale: $`8 / 16 = 0.5`$ bits per value on top of 4 code bits.

</details>

#### U5. Post-training and quantization-aware methods, and quality checks by slice

**About 4 h** · **Target:** Explain + Measure

Topics: Post-training and quantization-aware vocabulary; Perplexity, task and slice quality checks; Mixed-precision layer sensitivity search

A smaller model that fails the quality contract can never ship. Methods differ in what they cost to apply; checks differ in what they can catch.

**You can now**

- Contrast post-training quantization with quantization-aware training by data, pipeline access and accuracy cost.
- Check a quantized model with perplexity, a task benchmark and a workload slice, and state what each check can hide.
- Rank weights, activations, KV cache and attention by quantization sensitivity and defend a mixed-precision sketch.

**Study**

1. [Approaches and quality measurement](https://www.baseten.co/inference-engineering/) (Inference Engineering - Section 5.1, Quantization) - Section 5.1.2, Quantization Approaches: PTQ versus QAT definitions, the two decisions (what parts, what format), and the least-to-most sensitivity ordering from weights to attention; Section 5.1.3, Measuring Quality Impact: perplexity, intelligence benchmarks and custom evals.
2. [Accuracy trade-offs and evaluation tooling](https://www.oreilly.com/library/view/hands-on-llm-serving/9798341621480/) (Hands-On LLM Serving and Optimization - Quantization (Chapter 6) and Speculative Decoding (Chapter 7)) - Chapter 6: Accuracy trade-offs with the GPTQ, AWQ and FP8 minimal-loss results, Quantization-aware training versus PTQ with the comparison table, and the LM Eval code snippet for gsm8k_cot. Depth: Treat the book accuracy figures as the authors result on their models, not as your expected result.
3. [Day 14: comparing GPTQ, AWQ and SmoothQuant](https://github.com/elizabetht/100-days-of-inference/blob/main/day14/quantization-gptq-awq-smoothquant.ipynb) (100 Days of LLM Inference - Days 13, 14 and 15) - Notebook `day14/quantization-gptq-awq-smoothquant.ipynb`: Comparing Quantization Methods and Experiments: Try These, comparing output error of `gptq_quantize_layer`, `awq_quantize` and `smoothquant_calibrate` against naive round-to-nearest.

**Focus**

- PTQ converts finished weights with calibration data only; QAT trains or fine-tunes with fake quantization so weights adapt to the rounding. PTQ is the only option for weights you did not train.
- Perplexity is the cheapest check but the weakest: it scores likelihood on reference text, not task success. Add one task benchmark and one product slice before any ship claim.
- Sensitivity runs weights, then activations, then KV cache, then attention with softmax last. Early and late layers often stay in high precision inside an otherwise quantized model.
- GPTQ compensates rounding with Hessian structure, AWQ protects salient channels, SmoothQuant migrates outlier difficulty. All three report near-FP16 quality at W4A16 or W8A8 on the authors workloads; yours needs its own numbers.

**Reproduce:** Without notes, define PTQ and QAT in one sentence each, list the three quality checks in cheap-to-expensive order, and sketch which of weights, activations, KV cache and attention you quantize first with one line of justification each.

**Traps**

- Reporting pooled perplexity only. Averages hide slice regressions; long context, code and other languages can degrade while prose perplexity barely moves.
- Quoting paper quality as your quality. Published minimal-loss results are the authors models on their evals; calibration and slice differences move them.
- Treating QAT as strictly better. It costs pipeline access and retraining; for many deployments calibrated PTQ meets the bar and ships sooner.

**Practice**

- [100 Days of LLM Inference Day 14: method comparison](https://github.com/elizabetht/100-days-of-inference/blob/main/day14/quantization-gptq-awq-smoothquant.ipynb) - Comparing Quantization Methods and Experiments: Try These: benchmark naive round-to-nearest against `gptq_quantize_layer`, `awq_quantize` and `smoothquant_calibrate` on one layer, reporting error per method. Use a fixed held-out input batch for all four; the calibration inputs must not be the scoring inputs.

**Stop when:** You rank the four components by sensitivity without notes and can say for a stated workload which two quality checks gate the ship decision and why perplexity alone does not.

<details>
<summary>Self-test</summary>

1. When is QAT unavailable no matter how attractive its accuracy looks?
   - When you hold only finished weights without training-pipeline access. PTQ with calibration is then the only route; QAT needs fake quantization during training or fine-tuning.
2. Quantized perplexity rises minimally but the product slice fails. What did the check miss?
   - Perplexity measures likelihood on reference sequences, not task behavior. The slice exercises distributions the reference set underweights; add task and slice evals.
3. Rank weights, activations, KV cache and attention by quantization sensitivity, least first.
   - Linear-layer weights, then activations, then KV cache, then attention with softmax. Errors in attention compound token to token, and KV errors persist across positions.
4. Why might input and output layers stay in high precision?
   - They are more sensitive than middle layers: the input layer shapes every downstream representation and the output layer directly sets token probabilities.

</details>

#### U6. Measuring quantized memory, latency and throughput, including KV quantization

**About 3 h** · **Target:** Measure

Topics: Memory, latency and throughput measurement; KV cache quantization under long context

Quantization without measurement is a smaller file, not a faster service. Memory, latency and quality must be measured together on the workload that pays for them.

**You can now**

- Derive KV bytes per token for a stated attention shape and predict what FP8 KV quantization saves.
- Measure weight and KV memory, TTFT, TPOT and throughput for a quantized path against its unquantized baseline.
- Decide where KV quantization belongs in a long-context plan, with a quantized-attention condition.

**Study**

1. [vLLM quantization support and quantized KV cache](https://docs.vllm.ai/en/v0.31.0/features/quantization/) (vLLM Speculative Decoding and Quantization (v0.31.0)) - Supported Hardware table (AWQ, GPTQ, Marlin, FP8 rows against Volta through Hopper) on the quantization page, then the Quantized KV Cache page: FP8 overview, per-tensor versus per-attention-head scales, the two scale-calibration approaches (default scales and dataset calibration with llm-compressor), and `--kv-cache-dtype-skip-layers`. Depth: Read the pages against installed v0.31.0 only. Both flags named below are v0.31.0 flags; older releases differ. Bundled lab expectations for other GPUs are not your targets.
2. [Quantized serving behavior under concurrency](https://www.oreilly.com/library/view/hands-on-llm-serving/9798341621480/) (Hands-On LLM Serving and Optimization - Quantization (Chapter 6) and Speculative Decoding (Chapter 7)) - Chapter 6: the concurrency charts comparing the original model with GPTQ W4A16 and FP8 W8A8 for TTFT and throughput, and KV cache quantization and attention quantization with the quantized-attention condition; then Chapter 9, Step 6 Benchmark the Quantized Qwen3 Model with vLLM (printed p. 304). Depth: Read the charts as the authors result on their hardware and model. Your unit reproduces the comparison shape, not their numbers.
3. [KV quantization and prefix caching](https://www.baseten.co/inference-engineering/) (Inference Engineering - Section 5.1, Quantization) - Section 5.1.2: the KV cache paragraphs (prefix caching and disaggregation gains, per-token reuse by later tokens).

**Focus**

- KV bytes per token are $`2 L H_{kv} d_h b`$: two for keys and values, times layers, KV heads, head dimension and bytes per element. FP8 halves $`b`$ against FP16; per-head scales add a small metadata term.
- Weight-only methods improve with concurrency differently from W8A8: GPTQ W4A16 still computes in 16-bit, so its TTFT can lag the baseline while FP8 pulls ahead on throughput.
- Check your GPU row in the vLLM hardware table before planning a run. An unsupported path is not a slow path; it is absent.
- KV quantization error persists across positions because every later token reads the stored values. Calibrate on long sequences and keep sensitive layers skippable.

**Reproduce:** Closed-book, derive KV bytes per token for $`L = 32`$, $`H_{kv} = 8`$, $`d_h = 128`$ in FP16, then state the FP8 saving and the maximum context that fits a stated KV budget in each precision.

**Traps**

- Measuring throughput at one concurrency and generalizing. Weight-only and W8A8 cross over as concurrency rises; sweep it.
- Comparing quantized quality without the engine contract. Keep prompts, output limits, sampling and cache state identical or the comparison is void.
- Treating bundled B200 or GB200 expectation files as targets. They are another machine results; your numbers are labeled with your GPU, engine version and settings.

**Practice**

- [AI Systems Performance Engineering companion code Chapter 19: dynamic quantized cache](https://github.com/cfregly/ai-performance-engineering/tree/main/code) - `code/ch19/baseline_dynamic_quantized_cache.py` against `code/ch19/optimized_dynamic_quantized_cache.py`: same steps and footprint in FP32 versus adaptive INT8, INT6 and INT4 refresh, with quality parity required. Run on your GPU and report memory traffic with quality parity; bundled B200 expectations are not targets.

**Stop when:** You derive KV bytes for a new shape without notes and produce a baseline-versus-quantized table with memory, TTFT, TPOT and quality on one fixed workload.

<details>
<summary>Self-test</summary>

1. For $`L = 32`$, $`H_{kv} = 8`$, $`d_h = 128`$, what are KV bytes per token in FP16 and FP8?
   - $`2 \times 32 \times 8 \times 128 \times 2 = 131{,}072`$ bytes in FP16, or 128 KiB, and half that, 64 KiB, in FP8 before scale metadata.
2. Why can GPTQ W4A16 lose on TTFT while winning on memory?
   - Prefill still computes in 16-bit after dequantization, adding conversion cost without compute savings. The win is weight capacity and decode bandwidth, visible under memory pressure.
3. When does FP8 KV cache need a quantized attention kernel to pay?
   - Whenever latency, not just capacity, is the goal. Without it the values are dequantized before the dot product; capacity still improves, arithmetic does not.
4. Which layers would you exempt first from KV quantization, and how?
   - Sliding-window or otherwise sensitive attention layers, via `--kv-cache-dtype-skip-layers` with layer indices or type names.

</details>

#### U7. Draft and target roles, exact acceptance and the correction distribution

**About 5 h** · **Target:** Derive + Implement

Topics: Draft and target model roles; Exact speculative acceptance probability; Correction distribution after rejection

The acceptance rule is what makes speculation free performance instead of a quality trade. A wrong rule still produces plausible text, so only the proof protects you.

**You can now**

- State the draft and target roles and why verification parallelizes while drafting does not.
- Derive the acceptance probability $`\min(1, p(x)/q(x))`$ and the residual distribution, and prove the output matches the target.
- Implement exact speculative sampling on tiny distributions and confirm the empirical distribution equals the target.

**Study**

1. [Acceptance, correction and the exactness proof](https://proceedings.mlr.press/v202/leviathan23a.html) (Fast Inference from Transformers via Speculative Decoding) - Sections 2.1 to 2.3 (overview, standardized and speculative sampling), Algorithm 1 SpeculativeDecodingStep, and Sections 3.1 and 3.2 with Theorem 3.5 and Corollary 3.6 (acceptance rate as expected overlap). Depth: Work the proof yourself before reading the appendix. Skip the distributed and cluster sections.
2. [Module 08: the acceptance rule and its proof](https://inference.tusharamrit.in/modules/speculative-decoding.html) (LLM Inference: From scratch, one token at a time - Module 08) - Concept 02 The acceptance rule, and the proof that nothing changes: the min(1, p/q) rule, the residual formula and the two-case P(emit z) = p(z) derivation, with the naive-rule bias note. Depth: The Concept 02 caveat and the matching Pitfalls answer say that sampling parameters applied to the target only lose exactness. They do not: the proof holds for any $`q`$ the draft actually sampled from, so the output follows the processed target and only acceptance drops. Test it in your simulator.
3. [Day 15: the three-step loop in code](https://github.com/elizabetht/100-days-of-inference/blob/main/day15/speculative-decoding.ipynb) (100 Days of LLM Inference - Days 13, 14 and 15) - Notebook `day15/speculative-decoding.ipynb`: Concept Overview with the accept formula, and the `speculative_decode_step` and `simulate_acceptance_rate` cells.

**Focus**

- The draft proposes $`\gamma`$ tokens autoregressively with distributions $`q`$; the target scores all of them in one causal forward pass, yielding $`p`$ at every position. Verification is parallel because causality makes one pass cover every prefix.
- Accept draft token $`x`$ with probability $`\min(1, p(x)/q(x))`$. On rejection, sample from the residual $`\max(0, p - q)`$ normalized by its sum, which exactly equals the rejection probability.
- The acceptance rate is $`\alpha = \sum \min(p, q)`$, or one minus the total variation distance. It depends only on the two distributions, never on the draft implementation.
- A bad draft costs speed only. The output distribution is the target either way; the naive agree-with-target rule instead biases output toward the draft and looks fine while doing it.

**Reproduce:** Closed-book, prove $`P(\text{emit } z) = p(z)`$ in both cases, then work the four-token pair $`q = [0.5, 0.3, 0.15, 0.05]`$, $`p = [0.3, 0.4, 0.2, 0.1]`$: accepted masses, rejection probability, residual, and $`\alpha`$.

**Traps**

- Sampling the replacement from $`p`$ instead of the residual. That double-counts agreed mass and biases output; the residual is the mass $`p`$ wanted that $`q`$ undersupplied.
- Building the ratio from a $`q`$ the draft did not sample from, such as raw logits when the draft used temperature. Exactness needs the actual draft distribution; processing only the target stays exact but cuts acceptance.
- Reading acceptance as a property of the draft model. It is a property of the pair on a workload: same draft, new domain or higher temperature, new $`\alpha`$.

**Practice**

- [100 Days of LLM Inference Day 15: acceptance simulation](https://github.com/elizabetht/100-days-of-inference/blob/main/day15/speculative-decoding.ipynb) - Cells `speculative_decode_step` and `simulate_acceptance_rate`: reproduce the Perfect, Good, Medium, Poor and Random rows and confirm simulated yield matches the formula within sampling noise. The rows are labeled by mixing weight, not $`\alpha`$, and the step returns no bonus token: compare with $`(1 - \alpha^{\gamma})/(1 - \alpha)`$ using each row's measured mean $`\sum \min(p, q)`$. Keep this simulation separate from engine evidence.

**Stop when:** You prove exactness without notes, work the four-token arithmetic by hand, and your simulator matches the target distribution to sampling noise on arbitrary pairs.

<details>
<summary>Self-test</summary>

1. For the Reproduce pair, what are the accepted masses, the rejection probability and the residual?
   - Accepted masses $`\min(p,q) = [0.3, 0.3, 0.15, 0.05]`$, rejection $`1 - 0.8 = 0.2`$, residual $`[0, 0.1, 0.05, 0.05]/0.2 = [0, 0.5, 0.25, 0.25]`$, and $`\alpha = 0.8`$.
2. Why does sampling the replacement from the residual, not from the target, preserve the distribution?
   - The normalizer of the residual equals the rejection probability, so accepted mass plus residual mass sums to $`p`$ in both the $`p \le q`$ and $`p > q`$ cases.
3. A run accepts 80 percent of draft tokens. What does that number predict, and what does it not predict?
   - It estimates $`\alpha`$, hence expected yield per verification. It does not predict wall-clock speedup, which also needs draft cost, batch effects and rollback overhead.
4. The target applies top-p 0.9 and the draft samples its full distribution. Is the output still exact?
   - Yes, if the ratio uses the distribution the draft actually sampled from: the proof holds for any $`q`$. Acceptance drops, since drafts outside the top-p set are always rejected.

</details>

#### U8. Cache advance, rollback, stop handling and tokenizer compatibility

**About 4 h** · **Target:** Explain + Implement

Topics: Cache advance, rollback and stop handling; Tokenizer and vocabulary compatibility

Acceptance math means nothing if rejected tokens stay in the cache. Rollback and stopping are where exact sampling meets request state.

**You can now**

- Implement cache advance for proposed tokens and exact rollback to the confirmed prefix on rejection.
- Handle stop tokens inside accepted drafts without leaking later tokens into the output or the cache.
- State the tokenizer compatibility contract and the one supported exception, with its sampling limit.

**Study**

1. [Detailed steps: discard and restart](https://www.oreilly.com/library/view/hands-on-llm-serving/9798341621480/) (Hands-On LLM Serving and Optimization - Quantization (Chapter 6) and Speculative Decoding (Chapter 7)) - Chapter 7, Speculative Decoding: Detailed Steps (printed pp. 234 to 235): draft speculation with the 0.6 versus 0.8 and 0.4 acceptance examples, discarding all following draft tokens on rejection, and the Token3 correction restart. Depth: The book states the logical discard; your unit adds the KV entries that must go with it.
2. [Verification divergence and backtracking](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 15 and 16, speculation and quantization) - Chapter 15, Speculative Decoding and Parallel Token Generation Techniques: the draft-verification divergence paragraphs (at least one token kept per round) and the Medusa backtracking note. Depth: Read for the discard-and-correct contract, not for the headline speedup multiples.
3. [vLLM speculation methods and vocabulary handling](https://docs.vllm.ai/en/v0.31.0/features/speculative_decoding/) (vLLM Speculative Decoding and Quantization (v0.31.0)) - Method Selection at a Glance table and the N-gram keys (`prompt_lookup_min`, `prompt_lookup_max`), then Cross-Vocabulary Draft Models (TLI): shared-token constraint with greedy draft sampling only. Depth: The Day 15 note that vLLM V1 supports only n-gram and EAGLE is outdated; the v0.31.0 method list (EAGLE, MTP, draft model, PARD, MLP speculator, n-gram and suffix decoding) supersedes it.
4. [Day 15: end-to-end loop with bonus and stop](https://github.com/elizabetht/100-days-of-inference/blob/main/day15/speculative-decoding.ipynb) (100 Days of LLM Inference - Days 13, 14 and 15) - Notebook `day15/speculative-decoding.ipynb`: End-to-End Three-Step Loop with Real Models (`speculative_decode_real` with the bonus token and the stop-token break). Depth: The loop reruns both models over the full sequence with no KV cache, and it appends the whole accepted run before its stop check, so tokens after an accepted stop token leak into the output.

**Focus**

- Verification writes KV entries for every proposed token. On rejection, truncate the cache to the accepted prefix; the correction or bonus token is emitted now, and its KV is written by the next forward pass. Nothing past the first rejection survives.
- Each round emits at least one token and at most $`\gamma + 1`$. The bonus token comes from $`p`$ at the final position, already computed by verification.
- A stop token inside the accepted prefix ends the sequence there. Later drafts are discarded even if verification accepted them; acceptance never overrides stopping.
- Draft and target share one tokenizer by default. The v0.31.0 cross-vocabulary path constrains drafts to shared tokens and supports greedy draft sampling only.

**Reproduce:** From a blank file, implement a cache as a token list with append and truncate: propose 4 tokens, reject at position 2, and show the cache holds only the accepted token's entry, the output holds that token plus the correction, and nothing else remains.

**Traps**

- Keeping rejected KV entries for speed. Stale entries corrupt every later attention computation silently; truncate to the confirmed prefix first.
- Emitting drafts past a stop token. Verification acceptance is about distribution match, not sequence end; check stopping on the accepted prefix before extending.
- Pairing a draft and target with different tokenizers. vLLM requires a shared vocabulary unless the TLI mapping is on; in your own loop, mismatched ids keep the output exact but collapse acceptance, so a correct output can hide a slowdown.

**Practice**

- [100 Days of LLM Inference Day 15: end-to-end loop](https://github.com/elizabetht/100-days-of-inference/blob/main/day15/speculative-decoding.ipynb) - End-to-End Three-Step Loop cells: add a KV cache to `speculative_decode_real` (a `DynamicCache` trimmed with `crop`, or a token-list stand-in), assert its length equals the accepted length after every round, then repeat with `ngram_propose` drafts scored as one-hot proposals. Add a planted stop-token case and fix the notebook stop check, which appends the whole accepted run first; your rollback assertion is the deliverable.

**Stop when:** Your cache holds entries only for accepted tokens after rejections, stop tokens and all-accepted rounds, under an assertion that fails on any residue, and no token after a stop token reaches the output.

<details>
<summary>Self-test</summary>

1. Four tokens are proposed and the second is rejected. Which KV entries survive?
   - Only the entry for the first, accepted token. Entries for proposals two to four are discarded; the correction sampled at position two is emitted, and its entry is written by the next round's forward pass.
2. All four drafts are accepted. How many tokens does the round emit, and why?
   - Five: the four drafts plus a bonus token sampled from the already-computed target distribution at the final position.
3. An accepted draft contains the stop token at position two of four. What is emitted?
   - The prefix through the stop token. Positions three and four are discarded; the sequence ends regardless of their acceptance.
4. When may draft and target use different vocabularies in vLLM v0.31.0?
   - Only with `use_heterogeneous_vocab` on the `draft_model` method (token-level intersection), which constrains drafts to shared tokens and supports greedy draft sampling only.

</details>

#### U9. Draft cost, verification cost, accepted tokens and the speedup crossover

**About 4 h** · **Target:** Derive

Topics: Draft cost, target verification and accepted tokens; Speculation speedup and crossover model

Acceptance without cost is a headline. The speedup equation decides the draft length, the draft model and whether to speculate at all under load.

**You can now**

- Derive expected tokens per verification from acceptance rate and draft length, including the bonus token.
- Predict speedup from draft cost, verification cost and accepted tokens, and find the break-even boundary.
- Explain why batch size moves the crossover, and where speculation stops paying.

**Study**

1. [Walltime improvement and choosing draft length](https://proceedings.mlr.press/v202/leviathan23a.html) (Fast Inference from Transformers via Speculative Decoding) - Sections 3.3 to 3.5 (walltime improvement, operation counts, choosing $`\gamma`$) with the expected-token equation, the draft-cost ratio and the improvement theorem. Depth: Treat the paper tables as worked examples on the authors hardware, not as your targets.
2. [Module 08: acceptance economics and batching](https://inference.tusharamrit.in/modules/speculative-decoding.html) (LLM Inference: From scratch, one token at a time - Module 08) - Concept 03 Acceptance rate with the yield table and the worked speedup cases at $`\gamma = 4`$, Concept 05 Why speculation stops working at high batch with the batch table, and Math by hand Parts 2 to 4.
3. [Tuning, limits and the concurrency crossover](https://www.oreilly.com/library/view/hands-on-llm-serving/9798341621480/) (Hands-On LLM Serving and Optimization - Quantization (Chapter 6) and Speculative Decoding (Chapter 7)) - Chapter 7: Tuning and Usage (printed pp. 235 to 239: draft-token count between 4 and 8, the falling-acceptance example) and Limitations (printed p. 239: decode-only help, large-batch and long-prefill losses).

**Focus**

- Expected tokens per verification are $`E = (1 - \alpha^{\gamma+1}) / (1 - \alpha)`$. The $`\gamma + 1`$ counts the bonus token; the ceiling as $`\gamma`$ grows is $`1/(1-\alpha)`$.
- Speedup divides yield by round cost: $`E / (\gamma c + 1)`$ with draft cost ratio $`c`$. A bigger draft that raises $`\alpha`$ can still lose if it raises $`c`$ more.
- Acceptance dominates length: at $`\alpha = 0.7`$ and $`\gamma = 4`$, $`E \approx 2.77`$, while pushing $`\gamma`$ to 10 gains little. Tune the draft, not the length.
- Batching consumes the same idle arithmetic verification rides on. Past the ridge point the extra positions cost real time and rejected drafts steal compute from real tokens.

**Reproduce:** Closed-book, compute $`E`$ for $`\alpha = 0.8`$, $`\gamma = 4`$ (about 3.36) and the speedup at $`c = 0.05`$ (about 2.80x), then find a pair with $`\alpha`$ below 0.5 where speculation loses.

**Traps**

- Maximizing acceptance alone. A 7B draft for a 13B target at $`\alpha = 0.8`$, $`c = 0.54`$ and $`\gamma = 2`$ lands near 1.17x; the ratio is the metric.
- Importing a published $`\alpha`$. Acceptance moves with domain, temperature and position; measure it on your workload before sizing $`\gamma`$.
- Enabling speculation at high batch. The free-arithmetic argument assumes memory-bound decode; compute-bound batches turn drafts into a tax.

**Practice**

- [Tushar Module 08 code lab: speedup surface](https://inference.tusharamrit.in/modules/speculative-decoding.html) - Code lab Parts B and C: build the yield and speedup tables, find the optimal $`\gamma`$ per $`\alpha`$ row, and locate the batch size where your ridge calculation crosses. Use your own arithmetic-intensity numbers from the prefill-decode units, not the module H100 example.

**Stop when:** You derive yield and speedup for a new triple without notes and can name the batch regime where your deployment stops speculating and why.

<details>
<summary>Self-test</summary>

1. Why does the yield formula use $`\gamma + 1`$ instead of $`\gamma`$?
   - A fully accepted round also emits the bonus token from the verification pass final position, so the maximum per round is $`\gamma`$ drafts plus one.
2. With $`\alpha = 0.8`$, $`c = 0.05`$ and $`\gamma = 4`$, what is the speedup?
   - $`E \approx 3.36`$ tokens per verification divided by $`4 \times 0.05 + 1 = 1.20`$ cost, about 2.80x.
3. With $`\alpha = 0.4`$ and $`c = 0.30`$ at $`\gamma = 4`$, speculate or not?
   - Not: $`E \approx 1.64`$ against cost 2.20 gives about 0.75x, slower than baseline with identical output.
4. Why does the optimal draft length grow with the acceptance rate?
   - Higher $`\alpha`$ keeps later positions alive, so extra drafts still convert. At low $`\alpha`$ late drafts are usually discarded, adding cost without yield.

</details>

#### U10. N-gram, tree and learned drafters, multi-token heads and structured outputs

**About 3 h** · **Target:** Explain

Topics: N-gram, tree and learned-draft vocabulary; Medusa, EAGLE and multi-token-head orientation; Structured decoding combined with speculation

The drafter is a cost and acceptance choice, not a leaderboard. Repetitive traffic and open prose want different drafters, and the wrong one is slower than none.

**You can now**

- Compare n-gram, tree and learned drafters by extra parameters, training cost and typical strength.
- Explain how Medusa heads, EAGLE feature drafting and tree attention differ in what the draft conditions on.
- State the constraint-matching rule for combining structured decoding with speculation.

**Study**

1. [Module 08: self-speculation survey](https://inference.tusharamrit.in/modules/speculative-decoding.html) (LLM Inference: From scratch, one token at a time - Module 08) - Concept 04 Self-speculation: the method table (draft model, Medusa, EAGLE, n-gram lookup) with extra parameters, training and strength, and the tree-verification attention-mask sketch.
2. [Choosing and tuning drafters](https://www.oreilly.com/library/view/hands-on-llm-serving/9798341621480/) (Hands-On LLM Serving and Optimization - Quantization (Chapter 6) and Speculative Decoding (Chapter 7)) - Chapter 7, Tuning and Usage (printed pp. 235 to 239): Choose an existing small model, Use self-drafting with Medusa heads and EAGLE variants, the N-gram subsection with the n equals 3 example, and Tune the number of draft tokens. Depth: Read the n-gram-first recommendation as a cost argument, not a quality ranking.
3. [Draft-based, self-speculative and multi-token decoding](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 15 and 16, speculation and quantization) - Chapter 15: Two-Model, Draft-Based Speculative Decoding and EAGLE; Single-Model Self-Speculative Decoding; Multitoken Decoding with Medusa's Multiple Heads; and Constrained Decoding Performance Implications (printed p. 943 on) for the grammar-masking cost that speculation must also pay.
4. [vLLM speculation methods at a glance](https://docs.vllm.ai/en/v0.31.0/features/speculative_decoding/) (vLLM Speculative Decoding and Quantization (v0.31.0)) - vLLM Speculation Methods list and Method Selection at a Glance table: which methods gain at low versus high QPS and which need a separate draft model.

**Focus**

- N-gram lookup costs nothing and wins on repetitive text such as code edits, quoted retrieval and fixed schemas. On novel prose it rarely proposes anything usable.
- Medusa attaches independent heads that predict several positions ahead without a second model, verified as a tree. Independence caps accuracy at distance.
- EAGLE autoregresses over the target hidden features with a one-step token shift, so drafts condition on richer state than tokens alone. Later versions add dynamic trees.
- Structured decoding masks the target at every verified position, so output stays exact whatever the draft proposes. Drafts outside the grammar are never accepted (vLLM v0.31.0 trims them to the longest grammar-valid prefix), so mask the draft too or acceptance falls.

**Reproduce:** Without notes, draw the four-row table (draft model, Medusa, EAGLE, n-gram) with extra parameters, training and strength, and explain why tree verification raises the chance that some path accepts.

**Traps**

- Deploying a same-size draft. The draft must be an order of magnitude cheaper or its cost ratio erases the yield; a near-target draft is a second target.
- Expecting Medusa heads to condition on each other. They predict independently from one hidden state, which is exactly the gap EAGLE feature autoregression fills.
- Constraining only the target under structured decoding. Output stays exact, but drafts outside the grammar are always rejected, so acceptance collapses; mask the draft with the same grammar.

**Practice**

- [100 Days of LLM Inference Day 15: n-gram proposer](https://github.com/elizabetht/100-days-of-inference/blob/main/day15/speculative-decoding.ipynb) - N-gram Speculation cells: rewrite `ngram_propose` from its docstring, run `simulate_ngram_speedup` on a repetitive prompt and a novel prompt, and report where the free drafter beats a model drafter. Your two prompts are the workload model; state which traffic each represents before comparing.

**Stop when:** You fill the four-row drafter table without notes and can pick the drafter for a stated workload with a cost and acceptance argument.

<details>
<summary>Self-test</summary>

1. Which drafter do you try first on a retrieval-heavy workload, and why?
   - N-gram lookup. Answers quote retrieved text, so suffix matches propose well at zero parameter and training cost; measure before buying a trained drafter.
2. What information does an EAGLE draft condition on that a Medusa head does not?
   - The target hidden-feature sequence with the token sequence shifted one step, autoregressively. Medusa heads predict each future position independently from one hidden state.
3. How does tree attention verify many candidates in one pass?
   - Each tree node attends only to its ancestors under a masked pass, so one forward pass scores every candidate path and the best accepted path is kept.
4. A grammar constrains the target but the draft proposes freely. What breaks?
   - Exactness survives, because verification samples from the masked target. Acceptance suffers: drafts outside the grammar are always rejected, so speculation wastes work. Mask the draft with the same grammar.

</details>

#### U11. A deterministic distribution simulator and distributional equivalence tests

**About 4 h** · **Target:** Implement

Topics: Deterministic distribution simulator; Distributional equivalence tests

Exactness is a testable claim, not a citation. The simulator is also the harness the section mini-project reuses for rollback and acceptance checks.

**You can now**

- Build a seeded speculative simulator with draft, target, acceptance and residual sampling as separate steps.
- Test output equivalence by exact enumeration on tiny vocabularies and by statistical agreement on larger ones.
- Diagnose biased output by contrasting the exact rule with the naive agree-with-target rule.

**Study**

1. [Module 08 code lab: correctness then economics](https://inference.tusharamrit.in/modules/speculative-decoding.html) (LLM Inference: From scratch, one token at a time - Module 08) - Code lab Part A (`speculative_step` with the residual branch and `naive_step` for contrast, 400,000-sample comparison) and Part B (`speculate_gamma` with the bonus token and the yield table).
2. [Day 15: acceptance simulation rows](https://github.com/elizabetht/100-days-of-inference/blob/main/day15/speculative-decoding.ipynb) (100 Days of LLM Inference - Days 13, 14 and 15) - The `speculative_decode_step` cell with its Perfect, Good, Medium, Poor and Random rows at 4 drafts, and `simulate_acceptance_rate`: per-row yield as a comparison for your simulator. Depth: The rows are labeled by mixing weight, not $`\alpha`$, and count no bonus token, so they follow $`(1 - \alpha^{\gamma})/(1 - \alpha)`$ with each row's mean $`\sum \min(p, q)`$; match them with your bonus token switched off.
3. [Acceptance identity as test oracle](https://proceedings.mlr.press/v202/leviathan23a.html) (Fast Inference from Transformers via Speculative Decoding) - Section 3.2, Corollary 3.6 (acceptance rate equals expected overlap): assert measured acceptance against summed minima on your test distributions.

**Focus**

- Seed everything and fix the distributions first. A deterministic simulator replays the same drafts, uniforms and residuals, so failures reproduce.
- Test at two levels: exact enumeration on vocabularies of 2 to 4 tokens where every path is checkable, and statistical agreement within noise on larger ones.
- Assert the identities, not just the samples: measured acceptance against $`\sum \min(p,q)`$, and residual selection against the normalized positive part of $`p - q`$.
- Keep the naive rule in the suite as a negative control. It must fail visibly; a suite that passes a biased rule proves nothing.

**Reproduce:** From a blank file, implement one-token speculative sampling and show on $`p = [0.3, 0.4, 0.2, 0.1]`$, $`q = [0.5, 0.3, 0.15, 0.05]`$ that 400,000 samples match the target within about 0.002 with acceptance near 0.80, while the naive rule deviates clearly.

**Traps**

- Testing only on aligned distributions. Near-identical draft and target accept almost everything and hide residual bugs; include hostile pairs with small overlap.
- Confusing sampling noise with bias. Size the trial count first: deviations near $`1/\sqrt{N}`$ are noise, systematic gaps an order above it are bugs.
- Dividing by a zero draft probability. Exact sampling never drafts a token with $`q(x) = 0`$, but a test can supply one; the TensorTonic contract accepts it when $`p(x) > 0`$ and rejects it otherwise, so branch before computing $`p/q`$.

**Practice**

- [TensorTonic: Perform Exact Speculative Sampling](https://www.tensortonic.com/problems/cs336-l10-speculative-sampling) - Function `speculative_sampling` with draft tokens, draft and target probabilities and acceptance and residual random values; the three public cases reject at the first position twice and at the second once, checking the replacement each time. This problem verifies proposals without the bonus token and returns accepted count with rejection index; state that contract difference in your solution before generalizing to the full loop.

**Stop when:** Your simulator passes exact enumeration on tiny vocabularies, matches the Day 15 yield rows within noise, fails the naive control, and clears the three public TensorTonic cases.

<details>
<summary>Self-test</summary>

1. Draft [0] with $`q = [0.75, 0.25]`$, $`p = [0.25, 0.75]`$, uniform 0.9, residual uniform 0.5. What is emitted?
   - Acceptance is $`0.25/0.75 \approx 0.33`$, and 0.9 exceeds it, so reject. The residual is $`[0, 1]`$; token 1 is emitted with nothing accepted before it.
2. Drafts [0, 1] with first-position acceptance 0.25 and uniform 0.9, residual uniform 0.4. What is returned, and what is the rejection index?
   - The first proposal is rejected, so nothing is accepted. The residual $`[0, 0.67, 0.33]`$ crosses 0.4 at index 1, so token 1 is emitted with rejection index 0.
3. First proposal accepted, second rejected at residual uniform 0.75 with residual $`[0.67, 0, 0.33]`$. Which tokens result?
   - The first draft token, then token 2 from the residual cumulative crossing 0.75. One accepted, rejection at index 1.
4. Why does the suite need the naive rule as well as the exact rule?
   - It is the negative control: plausible-looking biased output must fail the equivalence tests, proving the suite can catch the most likely implementation bug.

</details>

#### U12. Engine integration, versioned fallback, and benefit and loss regions

**About 5 h** · **Target:** Implement + Measure

Topics: Quantized or speculative engine integration; Versioned configuration and safe fallback; Benefit and loss regions across batch and length

Integration is where paper gains meet serving reality. A path without fallback and without a measured loss region is a demo, not an engine change.

**You can now**

- Integrate one quantized or speculative path into an engine with a versioned configuration and a tested fallback.
- Measure a benefit region and a loss region across batch size and sequence length with quality held fixed.
- Explain each region from format, kernel coverage, acceptance, draft cost or workload evidence.

**Study**

1. [Hands-on speculative decoding and the concurrency crossover](https://www.oreilly.com/library/view/hands-on-llm-serving/9798341621480/) (Hands-On LLM Serving and Optimization - Quantization (Chapter 6) and Speculative Decoding (Chapter 7)) - Chapter 7, Hands-on Speculative Decoding (printed pp. 240 to 242): the four vLLM server setups (vanilla, n-gram, improved n-gram, EAGLE-3) compared at concurrency 1 and 16, with the TTFT versus ITL trade-off discussion. Depth: Reproduce the comparison shape on your model and GPU: n-gram and EAGLE gains at low concurrency fading or reversing at high concurrency. The book numbers are its hardware, not your target.
2. [vLLM speculative configuration schema](https://docs.vllm.ai/en/v0.31.0/features/speculative_decoding/) (vLLM Speculative Decoding and Quantization (v0.31.0)) - `--speculative-config` schema with the common keys (`method`, `model`, `num_speculative_tokens`) and the n-gram keys (`prompt_lookup_min`, `prompt_lookup_max`), plus the lossless-guarantees and per-request acceptance-metrics notes. Depth: For each method you integrate, first write its correctness contract, the engine support it needs, and a predicted winning and losing workload, then run it. The schema keys are v0.31.0 keys; older releases differ.
3. [Chapter 18 speculation sweep tooling](https://github.com/cfregly/ai-performance-engineering/tree/main/code) (AI Systems Performance Engineering companion code - Chapters 16, 18 and 19 labs) - `code/ch18/speculative_decode/spec_config_sweep.py` with `code/ch18/spec_configs`: sweeping speculator configs and emitting acceptance rate, chunk size, throughput, TTFT and TPOT per config. Depth: Use the sweep shape and metric set on your engine; regenerate every number on your hardware. Its config keys (`chunk_size`, `max_spec_tokens`, `fallback_chunk_size`) drive the chapter's own benchmark, not the vLLM speculative config.

**Focus**

- Version the full path: method, model or drafter artifact, quantization format, engine version and every speculation flag. Fallback is a config switch back to the validated baseline, tested before it is needed.
- Map two axes at least: batch size and sequence length. Speculation typically wins small-batch decode and loses large-batch or prefill-heavy load; quantization wins memory-bound shapes and loses where kernels are missing.
- Hold quality fixed across the map with the slice checks from the methods unit. A faster region with failed quality is not a benefit region.
- Attribute each region to a mechanism: acceptance and draft cost, kernel coverage, dequantization overhead, or scheduler interaction. Name the shifted bottleneck on the losing side.

**Reproduce:** From a blank page, write the integration contract for one method: configuration version, fallback trigger, predicted winning workload and predicted losing workload with the mechanism behind each prediction.

**Traps**

- Shipping without exercising fallback. An untested fallback fails exactly when the primary path does; trigger it deliberately under load before relying on it.
- Sweeping one axis. A batch-1 win that reverses at batch 16 is the normal shape, not an anomaly; the map needs both axes plus a long-context point.
- Changing sampling or prompts between configs. Any output difference voids both the quality and the latency comparison; pin the contract first.

**Practice**

- The section mini-project covers this: integrating one quantized or speculative path with versioned configuration, tested fallback, and measured benefit and loss regions across batch and length.

**Stop when:** Your contract predicts a win and a loss region before the run, the measurements confirm the shape with quality held, and fallback flips cleanly under load.

<details>
<summary>Self-test</summary>

1. What belongs in a versioned speculation configuration?
   - Method, drafter artifact and version, target model, engine version, draft length and lookup bounds, sampling parameters, and the fallback revision. Anything missing cannot be rolled back to exactly.
2. N-gram speculation wins at concurrency 1 and loses at 16. What mechanism explains the crossover?
   - At low concurrency verification rides idle arithmetic; at high concurrency the batch already consumes it, so proposing and verifying add cost while acceptance stays the same. The book also names the extra CPU work of proposing.
3. A quantized path is faster but fails the code slice. Is that a benefit region?
   - No. Benefit regions require the quality contract to hold; report it as a loss region with the slice failure as the cause.
4. How do you test fallback before an incident?
   - Flip the config switch under replayable load, confirm outputs match the baseline contract and latency returns to baseline, and keep the evidence with the version.

</details>

### Mini-project: Quantized and speculative paths with measured win regions

**About 12 to 18 hours.** Build blank-file quantization with calibration and method comparisons, plus a seeded speculative simulator with exactness, rollback and drafter evidence. Integrate one path into `engine/` behind a versioned config and map measured benefit and loss regions with quality held.

1. Implement symmetric and asymmetric quantize and dequantize maps with per-tensor, per-channel and grouped scales from a blank file, derive served bits per weight with scale overhead, and run the Day 13 number-format and symmetric-pipeline experiments on outlier tensors.
2. Calibrate static ranges on sample data, apply the SmoothQuant migration and activation-aware scaling on a layer with a planted outlier channel, and compare naive rounding against GPTQ, AWQ and SmoothQuant on held-out inputs with Day 14 cells.
3. Derive served bits for your packing layout with alignment and the accumulator contract, then measure a quantized path against its baseline on your GPU for memory, TTFT, TPOT and throughput beside slice quality, with the Chapter 19 cache pair as a second check.
4. Prove the acceptance rule preserves the target distribution, build a seeded speculative simulator with separate draft, accept and residual steps, match the Day 15 acceptance rows, which omit the bonus token, within noise, fail the naive rule visibly, and pass the TensorTonic speculative-sampling cases.
5. Add KV advance with truncate-to-prefix rollback, stop handling and tokenizer checks to the simulator; build yield and speedup tables with the Module 08 lab to pick draft length and the stop regime; and compare the n-gram proposer on repetitive against novel prompts.
6. Integrate one quantized or speculative path into `engine/` behind a versioned configuration with a tested fallback, then map benefit and loss regions across batch size and sequence length with quality held, attributing each region to acceptance, cost, kernel coverage or scheduler interaction.

**Deliverables**

- Blank-file quantizers with scale proofs, calibration evidence and the method comparison on held-out inputs.
- The speculative simulator with exactness, rollback, stop and TensorTonic evidence plus yield and drafter tables.
- The integrated path with versioned config, fallback drill and the benefit and loss map with quality held.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [TensorTonic: Perform Exact Speculative Sampling](https://www.tensortonic.com/problems/cs336-l10-speculative-sampling). Pass the public sampling cases and state the bonus-token contract difference first.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Quantization maps | Blank-file symmetric and asymmetric maps round-trip on outlier tensors, and served-bits math includes scale overhead. | Grouped scales rescue small values in a shown collapse, and block-size error tables defend the layout choice. |
| Method comparison | Calibration, smoothing and scaled methods beat naive rounding on held-out inputs with static against dynamic ranges named. | A stale-calibration case shows the drift symptom and the recalibration or dynamic-range fix. |
| Speculative exactness | The simulator matches the target within noise, fails the naive control, and rollback leaves entries only for accepted tokens. | Target-only processing and grammar-masked targets stay exact with measured acceptance drops explained. |
| Measured regions | Baseline and integrated paths share prompts, sampling and cache state, and benefit and loss regions carry quality evidence. | Each region names its mechanism and bottleneck shift, and fallback flips under load with baseline outputs restored. |

Feeds into: The integrated path, fallback drill and region map feed the capacity decision, production rollout practice and the capstone evaluation.

### Resource route

- **Primary - Book:** [Hands-On LLM Serving and Optimization - Quantization (Chapter 6) and Speculative Decoding (Chapter 7)](https://www.oreilly.com/library/view/hands-on-llm-serving/9798341621480/) - Read "Model Compression" in Chapter 6 for quantization and "Speculative Decoding" in Chapter 7, with its hands-on example. For each method write its correctness contract, the engine support it needs and a predicted winning and losing workload before running it.
- **Required - Course:** [MIT 6.5940 TinyML and Efficient Deep Learning Computing - Quantization Lectures](https://hanlab.mit.edu/courses/2024-fall-65940) - Use Lectures 5 and 6 for quantization fundamentals and Lecture 13, Efficient LLM Deployment, for SmoothQuant and AWQ with TinyChat. Implement a small affine quantizer and an outlier experiment before using a pre-quantized checkpoint.
- **Required - Paper:** [SmoothQuant: Accurate and Efficient Post-Training Quantization for Large Language Models](https://arxiv.org/abs/2211.10438) - Study activation outliers and the offline smoothing transformation. Reproduce the algebra on one linear layer and compare calibration-sensitive quality with an unmodified reference.
- **Required - Paper:** [AWQ: Activation-Aware Weight Quantization for LLM Compression and Acceleration](https://arxiv.org/abs/2306.00978) - Focus on salient-weight protection, group scaling and the distinction between simulated quality and real kernel speed. Compare one supported AWQ path with the same unquantized workload.
- **Required - Paper:** [Fast Inference from Transformers via Speculative Decoding](https://proceedings.mlr.press/v202/leviathan23a.html) - Derive acceptance and correction probabilities and implement the exact categorical simulator. Prove distributional equality on tiny distributions before adding a model or engine.
- **Support - Book:** [AI Systems Performance Engineering - Chapters 15 and 16, speculation and quantization](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) - Read "Speculative Decoding and Parallel Token Generation Techniques" in Chapter 15 (draft models, EAGLE, self-speculation, Medusa) and "Quantization Approaches for Real-Time Inference" in Chapter 16.
- **Required - Reference:** [vLLM Speculative Decoding and Quantization (v0.31.0)](https://docs.vllm.ai/en/v0.31.0/features/spec_decode/) - Use the speculative decoding page for the supported proposers (draft model, n-gram, EAGLE, MTP) and its losslessness notes, and the quantization page for the hardware support table. Check every method against your GPU's compute capability before planning a run.
- **Required - Lab:** [AI Systems Performance Engineering companion code - Chapters 16, 18 and 19 labs](https://github.com/cfregly/ai-performance-engineering/tree/main/code) - Use Chapter 16 AWQ, GPTQ and SmoothQuant pairs, Chapter 18 speculation sweeps and Chapter 19 dynamic quantized cache. Run one family at a time, require quality or numerical parity, and regenerate results on available hardware.
- **Support - Practice:** [100 Days of LLM Inference - Days 13, 14 and 15](https://github.com/elizabetht/100-days-of-inference) - Use the numeric-format, quantization-algorithm and speculative-decoding notebooks as compact preparation. Keep their synthetic demos separate from production-engine and hardware evidence.
- **Support - Practice:** [TensorTonic Language Modeling from Scratch - Perform Exact Speculative Sampling](https://www.tensortonic.com/problems/cs336-l10-speculative-sampling) - Solve after the acceptance-rule unit, then check your implementation's output distribution against the target by exact enumeration on a tiny vocabulary.
- **Support - Course:** [LLM Inference: From scratch, one token at a time - Module 08](https://inference.tusharamrit.in/modules/speculative-decoding.html) - Work the Speculative Decoding module's acceptance arithmetic and checkpoint before the speedup-model unit.
- **Reference - Reference:** [AI Performance Engineering - Quantization and Speculative Decoding](https://github.com/wafer-ai/gpu-perf-engineering-resources) - A curated index. Use Section 4 only to find a quantization or speculation paper the other entries lack.
- **Support - Book:** [Inference Engineering - Section 5.1, Quantization](https://www.baseten.co/inference-engineering/) - Read 5.1.1 Number Formats for the format table and Precision/Type/Scale-factor with Dynamic range/Granularity, 5.1.2 for PTQ versus QAT and the what-to-quantize decisions, and 5.1.3 for the perplexity, benchmark and custom-eval quality checks.

### Exit checkpoint

Show numerical or task-quality correctness for one quantized path and distributional correctness for exact speculation, then identify a measured win and loss region for each mechanism with safe fallback.

<details>
<summary>Deliberately left for later</summary>

- Benchmarking pre-quantized checkpoints without a quality baseline
- Speculative methods that lack a understood correction contract
- Hardware-specific low-precision claims on unsupported devices

</details>

## INF-7. Distributed and Disaggregated Inference

**Why:** Multiple devices add communication, placement, queue and failure boundaries. A topology is justified only when its added capacity or phase isolation exceeds collective and KV-transfer costs for the declared workload.

### Learn this much

- [ ] Replica or data-parallel serving _(Required)_
- [ ] Tensor-parallel inference shapes and collectives _(Required)_
- [ ] Pipeline-parallel inference stages and bubbles _(Required)_
- [ ] Expert-parallel MoE dispatch and combine _(Required)_
- [ ] Context and sequence parallelism vocabulary _(Required)_
- [ ] Model weights and KV sharding _(Required)_
- [ ] Per-rank memory and local tensor ownership _(Required)_
- [ ] Collective and point-to-point communication volume _(Required)_
- [ ] PCIe, NVLink, NVSwitch and network topology _(Required)_
- [ ] Small-batch latency versus distributed capacity _(Required)_
- [ ] Replica routing and load balancing _(Required)_
- [ ] Cache-aware routing and locality skew _(Required)_
- [ ] Prefill and decode disaggregation _(Required)_
- [ ] Independent phase parallelism and capacity _(Required)_
- [ ] KV transfer size, latency and bandwidth _(Required)_
- [ ] NIXL and KV connector vocabulary _(Required)_
- [ ] Transfer overlap and backpressure _(Required)_
- [ ] Prefill and decode pool placement _(Required)_
- [ ] Heterogeneous GPU and phase assignment _(Required)_
- [ ] Disaggregation break-even model _(Required)_
- [ ] Request identity and KV version across phases _(Required)_
- [ ] Checksums and layout compatibility _(Required)_
- [ ] Cancellation, timeout and retry propagation _(Required)_
- [ ] Worker, rank and transfer failure _(Required)_
- [ ] Duplicate request and stale KV diagnosis _(Required)_
- [ ] Topology and capacity simulator _(Required)_
- [ ] Measured versus simulated evidence labels _(Required)_
- [ ] Goodput, utilization, KV traffic and cost comparison _(Required)_
- [ ] Warm pools and elastic phase resizing _(Optional)_
- [ ] KV offload across HBM, DRAM and storage tiers _(Optional)_
- [ ] Topology-aware MoE expert placement _(Optional)_
- [ ] Dynamic disaggregation and adaptive parallelism _(Depth)_
- [ ] Frontier fleet scale as a completion requirement _(Later)_

### Study units

#### U1. Replica serving and tensor-parallel inference shapes and collectives

**About 4 h** · **Target:** Explain + Derive

Topics: Replica or data-parallel serving; Tensor-parallel inference shapes and collectives

A router distributes requests across replicas; tensor parallelism distributes one request's model work across ranks. Confusing the two gives the wrong capacity estimate and the wrong recovery boundary.

**You can now**

- Distinguish independent serving replicas from ranks cooperating on one forward pass, including their request-level fault domains.
- Derive local MLP and attention projection shapes for a tensor-parallel serving plan.
- Place forward collectives and explain why added memory capacity need not reduce small-batch latency.

**Study**

1. [Replicas versus model shards](https://www.oreilly.com/library/view/hands-on-llm-serving/9798341621480/) (Hands-On LLM Serving and Optimization - Chapter 7, multi-GPU and disaggregation) - Chapter 7, Data Parallelism, printed pp. 243 to 245; Tensor Parallelism and Pipeline Parallelism, printed pp. 245 to 250. Depth: Read the replica and TP paths now. Leave the pipeline decision path for the next unit; do not run the multi-GPU launch snippet.
2. [The paired column and row shards](https://inference.tusharamrit.in/modules/distributed-inference.html#concept-0) (LLM Inference: From scratch, one token at a time - Module 09) - Module 09, Tensor parallelism: split inside the layer - The MLP block and The attention block. Depth: Stop before Communication volume. Two reductions per layer describes this replicated-activation dense forward schedule, not every TP implementation.

**Focus**

- Reuse Collective contracts and the latency-bandwidth cost model. Serving replicas do not synchronize gradients; a replica can itself contain a TP group.
- For input $`X`$ of shape $`T \times h`$, column-shard the first MLP weight of shape $`h \times f`$, then row-shard the second of shape $`f \times h`$. Each local intermediate has shape $`T \times f/n`$ for divisible width and $`n`$ ranks.
- An elementwise activation stays local between these shards. The second projection produces same-shaped partial outputs that sum, not concatenate. Add a replicated output bias once after summation.
- Attention head shards can compute independently before the output projection reduction. KV-head replication and vocabulary-parallel output paths need separate ownership accounting.

**Reproduce:** Closed-book, derive a bias-free two-rank ReLU MLP with input shape $`2 \times 4`$, first weight shape $`4 \times 6`$ and second weight shape $`6 \times 4`$. Give each rank three intermediate features, sum its partial output, and check against the unsharded MLP on CPU using small deterministic `float64` tensors. State a numerical tolerance rather than demanding bitwise equality.

**Traps**

- Counting replicas as additional memory for a single request. Each independent replica needs the full model and its own admitted KV state.
- Calling every column-sharded output an all-reduce. Disjoint output features concatenate; row-sharded dot-product contributions sum.
- Promising a latency speedup from rank count. Smaller kernels, startup costs and dependencies can consume the extra compute or memory bandwidth.

**Practice**

- The section mini-project covers this: servelab's replica and TP plans, local-shape ledger and differential checks against an unsharded forward pass.

**Stop when:** Your paired-shard MLP matches the unsharded reference within the stated tolerance, and your diagram separates replica routing from TP collectives and their fault domains.

<details>
<summary>Self-test</summary>

1. Does inference replica serving require the training gradient all-reduce?
   - No. Independent requests run forward passes against fixed weights. Shared routing or cache metadata is a separate control-plane concern.
2. Why can the first projection's activation remain local?
   - Each rank owns complete values for its output features, and ReLU acts independently on each feature. No partial sum is needed before that activation.
3. What shape does each second-projection partial have in the reproduce example?
   - $`2 \times 4`$. Each rank multiplies a $`2 \times 3`$ intermediate by its $`3 \times 4`$ weight rows; the two partials sum to the full output.
4. Can replicas lower endpoint latency without making the forward pass faster?
   - Yes. Distributing arrivals can reduce queueing. It does not shorten the isolated forward service time on an unchanged replica.

</details>

#### U2. Pipeline bubbles, expert-parallel MoE and context parallelism in serving

**About 5 h** · **Target:** Explain + Derive

Topics: Pipeline-parallel inference stages and bubbles; Expert-parallel MoE dispatch and combine; Context and sequence parallelism vocabulary; Topology-aware MoE expert placement

PP, EP and context parallelism partition different axes. Their serving value depends on available concurrency, expert skew and context length, not just whether the model fits.

**You can now**

- Derive a forward-only pipeline timeline and identify the concurrency and stage balance needed to fill it.
- Map MoE dispatch and combine to serving ranks, preserving the selected experts and routing weights.
- Distinguish layer, expert, head and context-position partitioning, including the communication exact attention still needs.

**Study**

1. [Pipeline and expert serving paths](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 15 and 17, distributed and disaggregated inference) - Chapter 15, Pipeline Parallelism; Expert Parallelism; Dynamic Routing Strategies for MoE Inference - Expert Communication Optimization and Load Balancing, Capacity Factor, and Expert Replication. Depth: Focus on serving dependencies and placement. Do not change the model's chosen experts to fix load: rerouting or dropping expert work changes outputs.
2. [Partitioning cached positions](https://inference.tusharamrit.in/modules/distributed-inference.html#concept-3) (LLM Inference: From scratch, one token at a time - Module 09) - Module 09, Decode context parallelism: shard the cache by position, not by head - The mechanism, one decode step and Why decode specifically. Depth: Stop before the version-specific vLLM constraints and reported benchmark. Use the online-softmax merge from Stable and online softmax, normalization and fused residual paths, not a plain sum of locally normalized attention.
3. [A forward pipeline bubble exercise](https://github.com/elizabetht/100-days-of-inference/blob/b8343f8873b7bdd8bd8739a42aa7557d5644cf48/day17/model-parallelism.ipynb) (100 Days of LLM Inference - Days 12, 17 and 18) - Day 17, Pipeline Parallelism: layer blocks + the bubble; Try These Experiments, item 4, PP bubble break-even. Depth: Only this timeline and exercise. Assume equal forward stage times and independent microbatches; do not import a training backward schedule.

**Focus**

- Reuse All-to-all and MoE dispatch, combine and load balance. In serving, small decode batches can expose startup and hot-expert delay even when the aggregate dispatch byte count is small.
- With $`p`$ equal stages, $`m`$ ready independent microbatches and stage time $`t`$, a transfer-free forward pipeline finishes in $`(m+p-1)t`$. Idle fraction is $`(p-1)/(m+p-1)`$; autoregressive feedback and uneven stage times invalidate that simple schedule.
- Expert placement changes which assignments cross a slow link. Replicating the same expert preserves its function; changing top-k choices or overflow semantics does not automatically preserve model quality.
- Context parallelism partitions positions; TP commonly partitions heads. Exact global attention still incorporates every permitted position using communicated KV blocks or partial softmax statistics. Sequence parallelism can instead mean partitioning intermediate activations around TP - state the axis, not just the acronym.

**Reproduce:** Draw the transfer-free forward timeline for four equal 2 ms stages and eight ready independent microbatches. Recover a 22 ms makespan and idle fraction $`3/11`$. Then add the dependency from the final sampled token to the same request's next decode pass and explain why eight successive tokens of one request cannot fill the pipeline like eight independent microbatches.

**Traps**

- Using a full-training pipeline bubble formula for forward-only inference, or treating future tokens of one request as already available microbatches.
- Placing paired hot experts together without checking compute imbalance. Fewer remote bytes can still leave one rank on the critical path.
- Summing locally normalized attention outputs. Each slice has a different softmax normalizer; exact merging must reweight them.

**Practice**

- [100 Days of Inference, Day 17: PP bubble break-even](https://github.com/elizabetht/100-days-of-inference/blob/b8343f8873b7bdd8bd8739a42aa7557d5644cf48/day17/model-parallelism.ipynb) - Try These Experiments, item 4: find the minimum microbatch count for idle fraction strictly below 10 percent with 4, 8 and 16 stages. Check your integer boundary by enumerating the forward timeline on CPU. The notebook has no public grader; add your own tests. The section mini-project covers expert skew and context-partition accounting.

**Stop when:** Your timeline agrees with the hand makespan and each integer bubble boundary, and you can name the partition axis, communication dependency and serving bottleneck for PP, EP and context parallelism.

<details>
<summary>Self-test</summary>

1. Does PP make four equal stages execute one isolated request simultaneously?
   - No. Its activations traverse all four stages in order. Other independent requests can occupy the remaining stages; the isolated request retains the full dependency chain.
2. Why is an expert replica different from rerouting to another expert?
   - A replica computes the same expert function with the same weights. A different expert generally computes a different function, changing the model output.
3. Do position shards let exact causal attention ignore distant earlier positions?
   - No. Those positions remain legal keys. Their contributions must reach the query through KV exchange or a correctly normalized partial-result merge.
4. What does a slow PP stage do to steady-state capacity?
   - It limits the rate at which microbatches can leave the pipeline. More stages or a low average stage time cannot remove that bottleneck.

</details>

#### U3. Weight and KV sharding and per-rank memory ownership

**About 3 h** · **Target:** Derive

Topics: Model weights and KV sharding; Per-rank memory and local tensor ownership

Aggregate memory is not admission capacity. One rank can run out of KV space while other ranks have free memory, and replicated state can erase an expected sharding gain.

**You can now**

- Derive each rank's weight and KV bytes from the actual layer, head and position ownership rather than dividing everything by device count.
- Explain KV-head replication when TP exceeds the number of KV heads in a head-sharded GQA layout.
- Reject a plan whose busiest rank exceeds memory after runtime buffers, page waste and reserve are included.

**Study**

1. [Head sharding and the GQA ceiling](https://inference.tusharamrit.in/modules/distributed-inference.html#concept-2) (LLM Inference: From scratch, one token at a time - Module 09) - Module 09, What TP degree actually does to your numbers - Weights per GPU and KV cache per GPU stops shrinking at TP-8. Depth: Use the head-ownership argument only. Skip the hardware speed table and Code lab planner: evenly divided weights are an approximation, and its PP latency estimate does not sum the dependent stage service times.
2. [Layer and expert ownership](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 15 and 17, distributed and disaggregated inference) - Chapter 15, Tensor Parallelism, Pipeline Parallelism, Expert Parallelism and Data Parallelism. Depth: Revisit only which weights each rank holds. Carry forward the runtime-memory categories from Weight memory by dtype and the runtime memory categories.

**Focus**

- Reuse Per-layer KV layouts and the cache consequences of attention variants. For ordinary full-attention K and V, a rank owning $`L_r`$ layers, $`H_r`$ KV heads and $`S_r`$ cached positions holds $`2L_rH_rd_h\,b\,S_r`$ logical bytes, where $`d_h`$ is head dimension and $`b`$ is bytes per element.
- PP assigns KV to the ranks that own its layers. Head-sharded TP assigns local KV heads; if there are more TP ranks than KV heads, a supported layout may replicate heads instead of shrinking each cache further.
- EP partitions expert weights, not automatically attention weights or KV. Sum shared, expert, embedding and output weights according to the chosen layout; include replicated tensors explicitly.
- Admission uses the maximum per-rank allocation, including page rounding, workspace, graphs, communication buffers and reserve. Distinguish logical unique KV from physical copies across ranks.

**Reproduce:** Make a per-rank ledger for a synthetic full-attention model with eight layers, two KV heads, head dimension 16, two-byte KV elements and one 128-token sequence. Its unique KV is 131,072 bytes. Under two-way head-sharded TP each rank holds 65,536 bytes; under four-way TP with each KV head replicated twice, each rank still holds 65,536 bytes. Add two-way PP with four layers per stage and recompute local and aggregate physical bytes. Ignore page waste only for this logical-byte exercise.

**Traps**

- Dividing all memory by the product of TP, PP and EP sizes. Only the tensors actually partitioned along those axes get that divisor.
- Treating a head-count ceiling as a universal limit on usable devices. Position sharding can reduce cache further, but requires its own layout and communication contract.
- Checking total free memory instead of each rank's budget. The first exhausted rank can stop the whole serving group.

**Practice**

- The section mini-project covers this: servelab's rank ownership ledger, replicated-head cases and memory-feasibility tests before admitting requests.

**Stop when:** Your ledger reconciles unique and physical KV bytes for TP, PP and their combination, and rejects a plan that fails any local memory budget.

<details>
<summary>Self-test</summary>

1. In the four-way TP example, how many physical KV bytes exist across ranks?
   - 262,144 bytes, twice the unique KV. Each of the two KV heads has two physical copies.
2. Does expert parallelism alone divide dense attention KV by expert count?
   - No. Experts belong to the MoE feed-forward path. Attention KV follows attention layer, head and position ownership.
3. How does two-way PP change each TP rank's KV in this equal-layer example?
   - It halves local KV to 32,768 bytes because each stage owns four of the eight layers. Aggregate physical KV stays unchanged for the same TP replication pattern.
4. Why is weight bytes divided by rank count insufficient to prove a plan fits?
   - Some weights are replicated or unevenly placed, and KV, temporary tensors, communication buffers and runtime reserve also consume local memory.

</details>

#### U4. Communication volume, topology, and small-batch latency against capacity

**About 5 h** · **Target:** Derive

Topics: Collective and point-to-point communication volume; PCIe, NVLink, NVSwitch and network topology; Small-batch latency versus distributed capacity

Serving decode repeatedly pays small collective startup costs. A topology that fits the model can still miss the token-latency target even when its bandwidth-only estimate looks cheap.

**You can now**

- Derive per-decode-step and per-prefill-pass collective and stage-boundary traffic with an explicit per-rank or aggregate convention.
- Map that traffic onto PCIe, NVLink, NVSwitch and network paths, including shared bottleneck links.
- Explain when more ranks provide memory capacity but increase small-batch latency after communication startup and dependencies are included.

**Study**

1. [Serving activation traffic](https://inference.tusharamrit.in/modules/distributed-inference.html#math-lab) (LLM Inference: From scratch, one token at a time - Module 09) - Module 09, Tensor parallelism: split inside the layer - Communication volume; Pipeline parallelism: split across layers - Communication is tiny; Math by hand, Parts 3 and 4. Depth: Do the byte arithmetic, not the supplied hardware time estimates. The page mixes directional and bidirectional link peaks and calls a whole decode batch step's traffic per-token traffic. Use per-step bytes, a declared directional effective bandwidth and the startup term from your GPU communication model.
2. [Placement across links and nodes](https://www.oreilly.com/library/view/hands-on-llm-serving/9798341621480/) (Hands-On LLM Serving and Optimization - Chapter 7, multi-GPU and disaggregation) - Chapter 7, Tensor Parallelism and Pipeline Parallelism, printed pp. 247 to 250, Figures 7-10 and 7-11. Depth: Treat the flowchart as candidate generation, not proof that TP needs NVLink or that a single-device plan always wins. Check the declared SLO and actual topology.

**Focus**

- Reuse Ring and tree all-reduce, all-gather and reduce-scatter volume, Interconnects and topology: PCIe, NVLink, NVSwitch and RDMA, and NCCL algorithms, protocols, channels and rank placement. New work here is multiplying those costs by serving-layer frequency.
- For a replicated-activation dense schedule, message size is $`M = B\,S\,h\,b`$, with batch size $`B`$, processed positions per sequence $`S`$, hidden width $`h`$ and bytes per element $`b`$. Decode has $`S = 1`$; prefill uses its scheduled prompt or chunk length.
- With $`n`$ ranks, ring all-reduce sends $`2(n-1)M/n`$ bytes per rank. Two reductions per layer over $`L`$ layers cost $`2L`$ matched collectives per pass. This is an implementation assumption, not a universal transformer law.
- Use $`2(n-1)\alpha + 2(n-1)M/(nW)`$ for a simple ring model with per-step startup $`\alpha`$ and directional effective bandwidth $`W`$. PP sends one activation per stage boundary and retains the serial stage path. Shared links, uneven ranks and overlap change exposed time.

**Reproduce:** For a synthetic eight-layer dense forward pass with batch size 2, hidden width 64, two-byte activations and four TP ranks, derive the decode message size of 256 bytes and ring egress of 384 bytes per rank per reduction. Two reductions per layer give 6,144 bytes per rank per batch step. Recompute for a 128-position prefill, then compare both startup and bandwidth terms using declared synthetic link parameters. Count PP traffic separately per boundary, not as a ring reduction.

**Traps**

- Calling batch-step wire bytes bytes per output token without dividing by the number of active sequences. A step can generate many tokens, while each request still waits for the complete step.
- Using bidirectional aggregate peak as one rank's send bandwidth, or adding send and receive bytes and comparing them to a one-direction rate.
- Assuming a node count identifies the fabric. TP groups inside one node may cross slow PCIe or socket paths, while some NVLink domains span multiple nodes.

**Practice**

- The section mini-project covers this: servelab's per-layer communication ledger, shared-link model and small-batch latency versus memory-capacity sweep.

**Stop when:** Your byte ledger reconciles per-rank and aggregate traffic, and your synthetic sweep identifies a capacity-feasible TP plan that loses latency after startup is restored.

<details>
<summary>Self-test</summary>

1. What changes when the example processes 128 positions instead of one?
   - The activation message and bandwidth term grow 128-fold. The assumed collective count and each collective's startup term do not. Kernel efficiency and attention cost can also change.
2. Why can a tiny decode message still make TP slow?
   - Many dependent collectives repeatedly pay startup and wait for the slowest participating rank. Dividing only bytes by bandwidth omits those costs.
3. Does PP's smaller traffic prove it has lower isolated-request latency?
   - No. The request still traverses every stage sequentially and pays stage-boundary transfers. Its benefit may instead be model capacity or throughput with enough independent work.
4. What must change in the model when two transfers share one NIC?
   - Their combined offered bytes compete for that NIC's directional capacity. They cannot both receive its full effective bandwidth at the same time.

</details>

#### U5. Replica routing, load balance and cache-locality skew

**About 4 h** · **Target:** Explain + Implement

Topics: Replica routing and load balancing; Cache-aware routing and locality skew

A warm prefix saves prefill work but can attract enough requests to overload its owner. Routing must value the saved work against waiting and capacity, not maximize hits alone.

**You can now**

- Implement a deterministic cache-aware router that checks capacity before applying locality and load tie-breaks.
- Compare load-only and cache-aware decisions under hot-prefix skew, changing reuse and stale worker information.
- Diagnose a higher cache-hit rate that worsens queueing, fairness or SLO-qualified completions.

**Study**

1. [Routing independent serving replicas](https://www.oreilly.com/library/view/hands-on-llm-serving/9798341621480/) (Hands-On LLM Serving and Optimization - Chapter 7, multi-GPU and disaggregation) - Chapter 7, Data Parallelism, printed pp. 244 to 245 - round robin, least connections, latency-based and cache-aware routing.
2. [Balance predicted waiting against cache reuse](https://www.usenix.org/system/files/fast25-qin.pdf) (Mooncake: A KVCache-Centric Disaggregated Architecture for LLM Serving) - FAST 25 paper, Section 4.1 Prefill Global Scheduling and Section 4.2 Cache Load Balancing, printed pp. 161 to 162. Depth: Study the decision rule and hot-cache replication. Leave the cluster experiments and their numerical results out of your local routing claims.
3. [Worker selection at phase boundaries](https://docs.nvidia.com/dynamo/v1.5.1/knowledge-base/concepts/system-architecture/disaggregated-serving) (NVIDIA Dynamo - Disaggregated Serving and KV-Aware Routing) - Dynamo v1.5.1, Efficient KV Transfer - Router Orchestration, steps 1 to 4.

**Focus**

- Build on Exact prefix identity, version scope and tenant privacy scope. A cache overlap score is useful only for compatible, authorized KV; it is not permission to reuse another tenant's state.
- Track full assigned token capacity separately from uncached prefill work. Reuse saves computation but does not make the destination request's complete context disappear.
- The TensorTonic problem prioritizes the longest cached prefix before projected uncached load. Mooncake instead minimizes predicted TTFT including waiting; these are different policies, not equivalent implementations.
- Worker discovery, cache events and load estimates can lag. Revalidate capacity and identity at admission, and keep a fallback for evicted prefixes or unavailable workers.

**Reproduce:** Implement the named TensorTonic rule from a blank file. Check feasibility using full assigned request lengths, then rank by longest prefix, lowest projected uncached load, most remaining capacity and smallest worker ID. Reproduce the public example with request lengths `[10, 8]`, prefix lengths `[[8, 0], [0, 6]]`, worker IDs `[2, 1]` and capacities `[20, 20]`: assignments `[2, 1]` and uncached loads `[2, 2]`. Then construct a queued hot-prefix case where a predicted-TTFT policy deliberately chooses less reuse.

**Traps**

- Using uncached tokens as the memory-admission cost. The public rule admits against the full assigned request length even when most tokens have a prefix hit.
- Interpreting a router's hit estimate as guaranteed resident KV. Eviction or worker restart between selection and admission can invalidate it.
- Improving aggregate TTFT while starving tenants with cold prefixes. Compare waiting and completions by tenant or request class.

**Practice**

- [TensorTonic: Route Cache-Aware Prefill Requests](https://www.tensortonic.com/problems/cs336-l18-cache-aware-prefill-routing) - Implement `cache_aware_prefill_routing(request_token_counts, cached_prefix_lengths, worker_ids, worker_capacities)`. The free public cases check cache-local choices, worker-ID tie-breaking and rejection when no worker fits. Add tests for projected-load and remaining-capacity ties yourself. The section mini-project compares this locality-first rule with load-only and predicted-TTFT routing.

**Stop when:** Your router passes the three public cases and your additional tie-break tests, and your hot-prefix counterexample explains why saved prefill does not guarantee lower waiting or better goodput.

<details>
<summary>Self-test</summary>

1. A six-token request has a four-token cache hit on a worker with capacity five. Is it feasible under the problem's rule?
   - No. Full assigned length, six tokens, exceeds capacity five. The two uncached tokens determine compute load, not feasibility.
2. Why can longest-prefix routing lose to load-only routing?
   - A hot cache owner can have enough waiting work to outweigh the saved prefill. Low reuse or stale cache information can also remove the expected saving.
3. Two workers tie on prefix, projected work and remaining capacity. What breaks the public problem's tie?
   - The smaller worker ID, not the first worker in the input array. Returned loads remain in input-worker order.
4. Does replicating a hot prefix always improve goodput?
   - No. It costs memory and transfer work, can evict useful other prefixes and may not relieve the current compute or queue bottleneck. Test it on the same arrival trace.

</details>

#### U6. Prefill-decode disaggregation and independent phase capacity

**About 4 h** · **Target:** Explain + Derive

Topics: Prefill and decode disaggregation; Independent phase parallelism and capacity

Disaggregation removes one source of phase interference and introduces a new queue and transfer boundary. Pool sizes must follow service demand and SLOs, not just the input-to-output token ratio.

**You can now**

- Trace a request through prefill, KV handoff and decode, locating each queue and duplicated model copy.
- Derive independent phase demand and a bottleneck capacity bound for a declared workload.
- Explain how phase-specific batching and parallelism can improve isolation while stranding capacity in the other pool.

**Study**

1. [The independent phase trade-off](https://arxiv.org/html/2401.09670v3#S3) (DistServe: Disaggregating Prefill and Decoding for Goodput-Optimized LLM Serving) - arXiv:2401.09670v3, Section 2.3 Problems and Opportunities, then Sections 3.1 Analysis for Prefill Instance and 3.2 Analysis for Decoding Instance. Depth: Use the phase and queue models, not the paper's speedups as targets. Its constant-service, Poisson-arrival queue approximation is not a tail-SLO model for arbitrary prompt mixtures.
2. [What each phase pool owns](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) (AI Systems Performance Engineering - Chapters 15 and 17, distributed and disaggregated inference) - Chapter 15, Disaggregated Prefill and Decode Architecture; Chapter 17, Disaggregated Prefill and Decode Cluster Pools. Depth: Read the architecture, memory-management and phase-worker design. Skip deployment snippets and fixed hardware recommendations; use Dynamo v1.5.1 for the current orchestration path.
3. [Where phase separation helps and loses](https://docs.nvidia.com/dynamo/v1.5.1/knowledge-base/concepts/system-architecture/disaggregated-serving) (NVIDIA Dynamo - Disaggregated Serving and KV-Aware Routing) - Dynamo v1.5.1, Performance Characteristics - Prefill saturation, Decode memory tradeoff and Capacity effects of disaggregation.

**Focus**

- Build on Mixing prefill and decode, and chunked prefill to protect decode. Separate pools remove same-device mixed-phase execution, but not queueing, host contention, shared-link contention or decode KV pressure.
- DistServe prefill produces prompt KV and the first sampled token. Follow the first token explicitly: receiving it is not the same event as having KV ready for the next decode step.
- For arrival rate $`\lambda`$, mean prompt length $`\mathbb{E}[I]`$ and mean output length $`\mathbb{E}[O]`$, prompt demand is $`\lambda\mathbb{E}[I]`$. If prefill emits the first token, subsequent decode demand is $`\lambda\mathbb{E}[\max(O-1,0)]`$. Declare that convention before using token/s capacities.
- An idealized fixed-throughput bound is the minimum of each pool's token capacity divided by its per-request token demand. Actual capacity must also satisfy KV admission, transfers, arrivals and latency tails; token rates vary with batch, lengths and cache reuse.

**Reproduce:** Derive a transfer-free synthetic bound for two prefill workers, each assumed to sustain 1,000 prompt tokens/s, and one decode worker assumed to sustain 400 subsequent output tokens/s. Every request has 100 prompt tokens and 21 output tokens, with the first output produced in prefill. Both phase bounds are 20 requests/s. Explain why 20 requests/s is a capacity ceiling, not a safe offered-load target or an SLO guarantee, and identify what happens if only prefill capacity doubles.

**Traps**

- Sizing pool counts from token ratio alone. One prompt token and one decode token need not consume equal service time or memory.
- Treating phase isolation as independent end-to-end latency. The request still depends on both pools and its handoff.
- Removing GPUs from decode to add prefill without accounting for stranded weights and lost decode KV capacity.

**Practice**

- The section mini-project covers this: servelab's separate phase queues, fixed-budget pool-size sweep and first-token versus KV-ready event trace.

**Stop when:** Your request trace names every phase queue and first-token event, and your capacity derivation identifies the limiting phase without treating its ceiling as an SLO-qualified rate.

<details>
<summary>Self-test</summary>

1. In the synthetic example, what is the rate bound after prefill capacity doubles?
   - Still 20 requests/s. Decode must produce 20 subsequent tokens per request from its unchanged 400-token/s capacity.
2. Why must both phase pools hold model weights?
   - Both execute the model's layers, although their parallel layouts may differ. Separating phases does not let the decode pool operate from KV alone without model weights.
3. Why is operation exactly at the ideal rate bound unsafe?
   - Variability, bursts and finite buffers create waiting, and any capacity loss can make the backlog grow. A latency contract needs headroom and a workload-specific queue test.
4. Can higher decode batch size change the phase ratio you should provision?
   - Yes. It changes effective decode throughput, token latency and workspace or KV availability. Recompute the ratio under the chosen operating point.

</details>

#### U7. KV transfer cost, connectors, overlap, backpressure and offload tiers

**About 5 h** · **Target:** Derive + Explain

Topics: KV transfer size, latency and bandwidth; NIXL and KV connector vocabulary; Transfer overlap and backpressure; KV offload across HBM, DRAM and storage tiers

A fast data plane is not a complete handoff. The receiver must have space, layout and identity ready, and the sender must retain buffers until transfer completion makes reuse safe.

**You can now**

- Derive handoff payload and transfer time from KV ownership, transport startup, effective bandwidth and layout work.
- Trace connector control metadata, memory registration, data movement, completion and source-buffer retirement.
- Explain valid overlap and bound in-flight KV with backpressure across HBM, DRAM and storage tiers.

**Study**

1. [Pull handoff and burst buffering](https://arxiv.org/html/2401.09670v3#S4.SS3) (DistServe: Disaggregating Prefill and Decoding for Goodput-Optimized LLM Serving) - arXiv:2401.09670v3, Section 3.3 Practical Problems - Communication overhead; Section 4.3 Online scheduling - Combat burstiness. Depth: Recompute payload from your KV ledger instead of copying the paper's GB-labeled OPT-66B estimate. Pull buffering still needs a bound on retained prefill KV.
2. [Exchange, mapping and completion](https://nvidia.github.io/TensorRT-LLM/developer-guide/kv-transfer.html) (TensorRT-LLM Disaggregated Serving and KV Cache Exchange) - Introduction to KV Cache Transmission, TensorRT-LLM commit cc63e66: Workflow; Key Components - Peer Registrar and Mappers, Page Table and Transfer Agent; Current Limitations (page read 2026-10-14).
3. [Overlap across independent requests](https://nvidia.github.io/TensorRT-LLM/features/disagg-serving.html#overlap-optimization) (TensorRT-LLM Disaggregated Serving and KV Cache Exchange) - Disaggregated Serving, TensorRT-LLM commit cc63e66: KV Cache Exchange - Overlap Optimization and Cache Layout Transformation, Figures 4 and 5 (page read 2026-10-14).
4. [Remote and lower-tier KV](https://www.usenix.org/system/files/fast25-qin.pdf) (Mooncake: A KVCache-Centric Disaggregated Architecture for LLM Serving) - FAST 25 paper, Sections 3.1 Overview and 3.2.1 to 3.2.3 Mooncake Store, printed pp. 158 to 160, Figure 3 and Listing 1. Depth: Read storage ownership, registration and topology-aware transfer. Cluster reproduction is outside this unit; use deterministic tier and link costs in servelab.

**Focus**

- Reuse Prefill-decode disaggregation and KV transfer from the GPU route. Start with unique logical KV bytes, then add physical replication, destination fragments, page padding, transport metadata and any layout-conversion work actually transferred.
- A serialized transfer model is $`t_x = \alpha + K/W + t_{\text{layout}}`$, with payload bytes $`K`$, effective directional bytes/s $`W`$, startup $`\alpha`$ and exposed packing or conversion time. A shared bottleneck link also needs offered byte rate below its capacity for a stable queue.
- The TensorRT-LLM Python workflow separates ZeroMQ control messages from one-sided NIXL writes. Completion requires every expected writer; submission alone does not make destination KV readable or source memory reusable.
- Overlap with other requests differs from layer-wise transfer within one request. The cited Python transceiver currently moves a whole prompt slice after prefill. Offload adds restore latency and pinned or staged memory; HBM, DRAM and SSD capacities are not interchangeable decode-ready capacity.

**Reproduce:** Use the memory unit's 131,072-byte synthetic KV payload with no padding, metadata or layout work. At a synthetic effective bandwidth of 1,000,000 bytes/s and 1 ms startup, derive a 132.072 ms serialized handoff. Draw producer-ready, destination-reserved, submitted and all-writers-complete events. Overlap unrelated request work, but forbid the dependent decode from consuming incomplete KV. Add a finite transfer-buffer limit and show that a stalled receiver eventually backpressures prefill instead of growing retained KV without bound.

**Traps**

- Treating nonblocking submission as transfer completion. Releasing or overwriting a source page can corrupt an in-flight write.
- Subtracting an arbitrary overlap percentage without a dependency timeline or accounting for shared compute, HBM and link contention.
- Assuming a pull protocol eliminates overload. It moves the waiting KV to the sender, whose memory is also finite.

**Practice**

- The section mini-project covers this: servelab's serialized and overlapped transfer timelines, finite handoff credits, slow-receiver backpressure and tier-restore cost comparison.

**Stop when:** Your handoff byte and time ledger agrees with the event trace, no dependent decode reads incomplete KV, and a stalled receiver cannot cause unbounded retained buffers.

<details>
<summary>Self-test</summary>

1. Which event allows a receiver with several source ranks to use the full KV?
   - Successful completion and validation of all expected fragments or writers for that request attempt, followed by the required local visibility and rank agreement. The first completion is insufficient.
2. Does overlap reduce the total KV bytes crossing a link?
   - No. It may reduce exposed latency by scheduling independent work concurrently, but the link still carries the payload and can saturate.
3. Why can an SSD-resident prefix lose to recomputing it?
   - Reading, staging and restoring its bytes can cost more than the saved prefill work for that prefix and workload. Compare complete paths, not cache-hit count.
4. Does a saturated receiver justify freeing sender KV immediately?
   - No. The sender needs explicit bounded retention and rejection or cancellation policy. Its buffers remain owned until writes have completed or can no longer touch them.

</details>

#### U8. Pool placement, heterogeneous GPUs and the disaggregation break-even

**About 5 h** · **Target:** Derive

Topics: Prefill and decode pool placement; Heterogeneous GPU and phase assignment; Disaggregation break-even model; Warm pools and elastic phase resizing

Separating phases is justified only against a comparable colocated plan. A faster phase on a different GPU type can still lose once transfer, queueing, duplicated weights and reserve cost are counted.

**You can now**

- Derive a workload-specific disaggregation break-even that includes both phase queues, exposed transfer and layout work.
- Choose prefill and decode placements from local memory, shared-link capacity, heterogeneous phase service rates and cost.
- Account for ready reserve, startup lag and draining requests when resizing a phase pool.

**Study**

1. [Placement with and without fast cross-node links](https://arxiv.org/html/2401.09670v3#S4) (DistServe: Disaggregating Prefill and Decoding for Goodput-Optimized LLM Serving) - arXiv:2401.09670v3, Sections 4.1 and 4.2, Algorithms 1 and 2; Section 4.3 - Replanning. Depth: Retain the enumeration method and corresponding-layer placement constraint. Do not assume KV overhead is negligible just because a link is called InfiniBand.
2. [Different devices for different phases](https://www.oreilly.com/library/view/hands-on-llm-serving/9798341621480/) (Hands-On LLM Serving and Optimization - Chapter 7, multi-GPU and disaggregation) - Chapter 7, Prefill-Decode Disaggregation - Opening up more hardware options and Enabling independent and asymmetric scaling, printed pp. 252 to 253; When to Use, printed pp. 256 to 257. Depth: Use the hardware comparison to pose a phase-cost hypothesis, not to promise its example assignment meets your workload's SLO.
3. [Resize discoverable phase pools](https://docs.nvidia.com/dynamo/v1.5.1/knowledge-base/concepts/system-architecture/disaggregated-serving) (NVIDIA Dynamo - Disaggregated Serving and KV-Aware Routing) - Dynamo v1.5.1, Runtime-Reconfigurable xPyD; Performance Characteristics - Capacity effects of disaggregation.

**Focus**

- Define a latency comparison before a throughput comparison. With the same work and no overlap, disaggregation reduces a chosen latency only if $`\Delta s + \Delta q + t_x + t_{\text{extra}} < I`$: service change $`\Delta s`$, queue change $`\Delta q`$, transfer $`t_x`$ and extra routing work must be smaller than the colocated interference $`I`$ removed.
- First-token placement changes the critical path. If prefill streams the first token before KV transfer, transfer may appear in the first decode gap rather than TTFT. Compare the declared TTFT and ITL or TPOT contracts separately.
- DistServe's low-node-affinity plan keeps corresponding prefill and decode layer segments together so KV uses fast local links. Different TP layouts can still need shard redistribution and conversion within that placement.
- Heterogeneous assignment uses measured or explicitly synthetic phase service curves, memory and price, not peak FLOP/s alone. Ready warm reserve costs money; a registered worker is not usable until weights, buffers and warmup are ready. Drain active handoffs before removing capacity.

**Reproduce:** For a synthetic handoff-gated latency, assume disaggregation removes 20 ms of colocated interference, leaves intrinsic phase service unchanged, adds 10 ms exposed transfer and 3 ms routing/layout work, and increases total phase waiting by 2 ms. Derive a 5 ms improvement. Change only the additional waiting to 12 ms and derive a 5 ms regression. Then state the extra constraints needed before either result implies higher SLO-qualified goodput at equal device cost.

**Traps**

- Comparing one transfer delay with the sum of stalls over many decoding users. These are different objectives; choose per-request latency, aggregate lost work or goodput and use consistent units.
- Assigning decode to a cheaper GPU without checking KV capacity, supported dtypes, layout compatibility and achievable batch service time.
- Counting a newly launched worker as immediate capacity, or reclaiming a drained worker while an in-flight write can still reach it.

**Practice**

- The section mini-project covers this: servelab's fixed-budget colocated versus phase-pool comparison, heterogeneous service assumptions, warm reserve and startup/drain-aware resize scenario.

**Stop when:** Your placement decision includes a winning and losing regime, identifies the first-token critical path, and charges transfer, queueing, reserve and startup under the same workload and cost budget.

<details>
<summary>Self-test</summary>

1. Why can low offered load favor colocation even on a fast link?
   - There may be little interference to remove. Handoff, extra routing and fragmented phase capacity still cost latency and resources.
2. What does the synthetic regression isolate?
   - Queueing alone reverses the latency decision. Transfer and service are unchanged, so faster transport would not explain that reversal.
3. What capacity counts during a phase-pool resize?
   - Only ready workers able to admit compatible new requests. Starting workers provide no immediate capacity; draining workers retain resources for active requests until safe retirement.
4. Does lower average handoff-gated latency prove better goodput?
   - No. Goodput also depends on tail targets, the completion and quality contract, admission, offered load and equal resource cost. Replay the same workload through both plans.

</details>

#### U9. Request identity, KV versions, checksums and layout compatibility

**About 4 h** · **Target:** Explain + Implement

Topics: Request identity and KV version across phases; Checksums and layout compatibility

A successful transfer can deliver perfectly intact KV for the wrong request or model. Decode needs both byte integrity and a compatible, live request identity before it can publish or consume that state.

**You can now**

- Implement a handoff envelope that binds request attempt, model and KV version, tensor geometry, positions and tenant scope.
- Check serialized payload integrity independently from semantic and layout compatibility.
- Repartition synthetic KV between different phase layouts without losing, duplicating or reordering layer/head/position data.

**Study**

1. [Cross-phase request and layout identity](https://nvidia.github.io/TensorRT-LLM/features/disagg-serving.html#unique-global-request-id) (TensorRT-LLM Disaggregated Serving and KV Cache Exchange) - Disaggregated Serving, TensorRT-LLM commit cc63e66: KV Cache Exchange - Cache Layout Transformation and Unique Global Request ID, Figure 5 (page read 2026-10-14). Depth: Read the need for a shared unique ID, not the snowflake generator as a universal uniqueness guarantee. Node/process identity assignment and restart behavior still need a deployment contract.
2. [Peer mapping and the missing version negotiation](https://nvidia.github.io/TensorRT-LLM/developer-guide/kv-transfer.html#current-limitations) (TensorRT-LLM Disaggregated Serving and KV Cache Exchange) - Introduction to KV Cache Transmission, TensorRT-LLM commit cc63e66: Peer Registrar and Mappers; Page Table; Supporting a New Cache Layout; Current Limitations (page read 2026-10-14). Depth: The page says peer metadata carries no version tag and both sides need the same build and runtime. Your versioned servelab envelope is a protective design exercise, not a claim that this engine negotiates versions.
3. [Digest the declared byte representation](https://docs.python.org/3.14/library/hashlib.html#usage) (Python 3.14 hashlib - byte digests for KV integrity checks) - Usage and Hash Objects: SHA-256 construction, incremental update, digest and hexdigest. Depth: Stop before SHAKE, file hashing, key derivation and BLAKE2. This unit checks accidental corruption, not a security protocol.

**Focus**

- Build on Exact prefix identity, version scope and tenant privacy scope. Bind prompt token IDs, tokenizer/model/adapter revision, positions, cache dtype and format, tenant scope and request attempt to the handoff; a request ID alone cannot prove compatible KV.
- Describe layer, head and token-position ranges plus valid length, page ordering and destination mapping. A producer using head shards and a consumer using layer shards need a redistribution, not merely a byte copy.
- Define a canonical byte order and dtype for the checksum, or explicitly check raw source fragments before conversion. Lossless layout conversion preserves values but may change raw byte ordering; lossy dtype conversion requires its own numerical contract.
- Publish destination KV only after metadata checks, complete payload validation and ownership transition. A matching digest does not establish freshness, authorization or absence of an adversarial substitution.

**Reproduce:** On CPU, build synthetic KV with two layers, three positions, two heads and head dimension four, using successive `float32` values in layer-position-head-feature order. Split by head into two producer fragments, then reconstruct two consumer fragments split by layer and stored in layer-head-position-feature order. Round-trip to the canonical order and require exact value recovery. Digest the canonical bytes with `hashlib.sha256`, flip one payload bit, and reject it before publication. Reject an intact payload with a mismatched model revision or attempt too.

**Traps**

- Using a payload checksum as the cache-identity key. The same bytes can be intact yet belong to a stale attempt or an unauthorized tenant.
- Treating matching tensor shapes as matching layouts. Head-major and token-major buffers can have equal element counts and different meanings.
- Installing a received block table before validating every fragment. A partial transfer then becomes visible to attention.

**Practice**

- The section mini-project covers this: servelab's versioned KV envelope, TP-to-PP mapping oracle, checksum corruption tests and wrong-request/model/tenant/position rejection cases.

**Stop when:** Your lossless mapping round-trip preserves every KV value, and corrupt, incomplete, stale or incompatible envelopes are rejected before destination KV becomes visible.

<details>
<summary>Self-test</summary>

1. An old-model KV payload has the expected checksum. Should decode accept it?
   - No. The digest checks the declared bytes, not the model revision or semantic compatibility. Reject incompatible metadata before using the cache.
2. Should raw digests match after a head-position transpose?
   - Not generally. The byte order changed. Compare in an agreed canonical order, or validate raw fragments separately and check the mapping by value.
3. Why does a retry need an attempt identity as well as a logical request ID?
   - A late callback or payload from the previous attempt must not install state into the new attempt. The attempt identity lets the receiver fence that stale work.
4. Does SHA-256 alone authenticate who produced KV?
   - No. Anyone able to replace both data and digest can supply a new matching pair. Authentication and tenant authorization are separate requirements.

</details>

#### U10. Cancellation, timeout, retry and failure across phases and ranks

**About 5 h** · **Target:** Explain + Implement

Topics: Cancellation, timeout and retry propagation; Worker, rank and transfer failure; Duplicate request and stale KV diagnosis

A client timeout does not stop every rank or an already submitted remote write. Recovery must terminate the logical request while retaining physical buffers until late work can no longer corrupt reused memory.

**You can now**

- Implement cancellation and deadline propagation through router, prefill, transfer and decode ownership states.
- Fence retries and late callbacks so one logical request cannot install stale KV or emit duplicate tokens.
- Diagnose rank death, missing transfer fragments and stale worker discovery from a correlated request and ownership trace.

**Study**

1. [Failure boundaries of an in-flight transfer](https://nvidia.github.io/TensorRT-LLM/developer-guide/kv-transfer.html#current-limitations) (TensorRT-LLM Disaggregated Serving and KV Cache Exchange) - Introduction to KV Cache Transmission, TensorRT-LLM commit cc63e66: Workflow, steps 4 to 6; Current Limitations - submitted operations cannot be aborted (page read 2026-10-14). Depth: The page explicitly leaves ambiguous-failure and cancellation retirement incomplete. Design and test the stronger servelab contract rather than assuming this engine already guarantees it.
2. [Heartbeat, waiting and cleanup budgets](https://docs.sglang.io/docs/advanced_features/pd_disaggregation) (SGLang documentation - PD Disaggregation) - PD Disaggregation: Mooncake - Advanced Configuration - Prefill Server Configuration and Decode Server Configuration (page read 2026-10-14). Depth: Read bootstrap and waiting timeouts, heartbeat health detection and the warning that longer bootstrap timeouts delay cleanup after lost decode connectivity. Skip launch and tuning snippets; model these events on CPU without importing the page's defaults as your SLO.
3. [Disaggregation can propagate failure](https://arxiv.org/html/2401.09670v3#S4.SS3) (DistServe: Disaggregating Prefill and Decoding for Goodput-Optimized LLM Serving) - arXiv:2401.09670v3, Section 4.3 Online scheduling - Preemption and fault tolerance. Depth: This paragraph discusses future work, not an implemented fault-tolerance protocol. Use it to identify dependencies your handoff tests must cover.

**Focus**

- Build on Streaming, cancellation, failure and cleanup states and ownership invariants, and Rank-aligned timelines, stragglers, congestion and partial failure. Add the phase boundary and attempt identity to those existing invariants.
- A logical terminal state is absorbing: no late callback may revive it or emit output. Physical retirement is separate; an in-flight one-sided write may still target quarantined destination memory until completion or safe transport teardown.
- Propagate the remaining end-to-end deadline, not a fresh full timeout at each hop. A heartbeat can mark a worker unavailable; it cannot prove whether the request committed, whether bytes arrived or whether a retry is safe.
- A TP/PP rank failure can invalidate its serving group. Cancel or fail the dependent request, rebuild suspect communication state, and choose recomputation or replay only under a declared streaming contract. Correlate logical request, attempt, worker generation, collective sequence and KV ownership.

**Reproduce:** Write a deterministic CPU handoff state machine. Replay cancellation before prefill, during a submitted write and after KV-ready but before decode publication. In the submitted-write case, mark the request terminal, quarantine both transfer buffers, and retire them only when the simulated write completes. Start a new attempt, deliver an old completion twice, and verify that neither stale KV nor duplicate output appears. Add one missing-rank completion and require bounded failure instead of waiting forever.

**Traps**

- Equating client cancellation with transport abort. Freeing destination pages while a remote write can still arrive turns a cancelled request into another request's corruption.
- Retrying with the same attempt and worker generation after restart. Delayed control messages can then bind old KV to the new allocation.
- Claiming exactly-once generation from deduplicating requests. A client may already have received tokens before failure; replay needs an explicit offset or a visible failed-stream contract.

**Practice**

- The section mini-project covers this: servelab's cancellation and deadline matrix, rank/transfer failures, duplicate delivery, stale-attempt fencing and bounded physical retirement after in-flight writes.

**Stop when:** Each injected fault reaches one logical terminal outcome, late events cannot revive it, and every allocation is either safely retired or explicitly quarantined with a bounded recovery path.

<details>
<summary>Self-test</summary>

1. A transfer completes after its request was cancelled. What should happen?
   - The completion may retire quarantined physical resources, but must not publish KV, resume decode or emit output for the terminal request.
2. Does a failed heartbeat prove a request did no work?
   - No. It indicates failed health communication. Work may have completed and its acknowledgement may be lost, so retries need attempt fencing and an explicit outcome contract.
3. Why can one dead TP rank fail otherwise healthy ranks' requests?
   - Their forward passes depend on matched collectives with that rank. Remaining ranks cannot independently finish the distributed model output.
4. How do you distinguish a stale payload from duplicated delivery of a valid completion?
   - Check attempt, worker generation and KV identity first, then the current transition state. An old attempt is rejected; a repeated completion for an already completed live transition is idempotent and must not double-free or republish.

</details>

#### U11. A topology and capacity simulator, evidence labels and cost comparison

**About 6 h** · **Target:** Implement + Measure

Topics: Topology and capacity simulator; Measured versus simulated evidence labels; Goodput, utilization, KV traffic and cost comparison

A simulator can rank plans only within its assumptions. Plausible latency samples are not measured cluster evidence, and omitted queues or ownership constraints can make an infeasible placement look best.

**You can now**

- Implement deterministic replay with rank memory, phase queues, shared links and bounded KV handoff ownership.
- Label analytical, simulated and measured evidence separately, and validate simulator predictions against independent oracles.
- Compare colocated and disaggregated plans by SLO-qualified goodput, utilization, KV traffic and cost under the same arrivals and resource budget.

**Study**

1. [Audit a lightweight placement model](https://github.com/cfregly/ai-performance-engineering/blob/b57e4c6a9e261c09ac09208705d040c81b03d35e/code/ch15/placement_sim.py) (AI Systems Performance Engineering companion code - Chapters 15 and 17) - PlacementConfig, PlacementMetrics and PlacementSimulator: simulate, _prefill_latency_ms, _decode_latency_ms, _kv_transfer_ms and _allreduce_ms. Depth: Read and exercise the CPU path only. Its returned TTFT excludes its computed prefill collective cost. Its KV formula omits layer/head geometry, and it has no arrival queues or local memory admission. Restore these terms in your model before comparing capacity; its bandwidth names and comments also need an explicit bits/s versus bytes/s and direction convention.
2. [Calibrated service models and placement evidence](https://arxiv.org/html/2401.09670v3#A1) (DistServe: Disaggregating Prefill and Decoding for Goodput-Optimized LLM Serving) - arXiv:2401.09670v3, Appendix A.1 to A.3 Latency Model for LLM Inference; Section 4.1, Simulator building paragraph; Section 6.4 Ablation Studies, Simulator accuracy paragraph and Table 2. Depth: Read how profiling fits phase coefficients and how prediction error is evaluated. Do not reuse its OPT/A100 coefficients or universalize its kernel-bound classifications. A fitted service model still needs queue, topology and memory validation for your workload.

**Focus**

- Build on A continuous-batching simulator with deterministic replay and event traces, and Communication measurement contracts and analytical or CPU simulation. Add rank ownership, topology links, phase transfer credits and attempt-fenced terminal events rather than reimplementing those foundations.
- Replay an immutable arrival trace through equal-budget plans. Log offered, admitted, rejected, failed, retried and completed requests, phase waiting, TTFT, decode gaps and peak per-rank KV. Count one logical completion even when attempts repeat.
- Use a declared observation window and completion policy. Goodput counts only accepted completions meeting the quality and latency contract per elapsed second. Utilization is resource busy time over available time, not a sum of request latencies; cost per good completion includes idle reserve, failed work and retries.
- Label formula results analytical, event-model outputs simulated and actual device observations measured. A CPU simulator's wall-clock runtime is not GPU service latency. If you calibrate on your GPU, record the model, dtype, engine/version and shapes, validate on held-out shapes, and keep multi-device extrapolations simulated.

**Reproduce:** On CPU, replay three requests arriving at 0, 1 and 2 ms through one FIFO synthetic server with fixed 2 ms service, no batching and unlimited memory. Recover completion times 2, 4 and 6 ms and response times 2, 3 and 4 ms. With a response-time SLO of at most 3 ms, a window from 0 to 6 ms including its endpoint, and all outputs accepted, goodput is two completions per 0.006 s and utilization is 100 percent. Repeat with an admission limit of one resident request, counting active plus waiting requests: reject the 1 ms arrival, process completion before arrival at 2 ms, and complete the others at 2 and 4 ms. Keep the same 6 ms window; goodput stays the same while utilization becomes two thirds. Charge both runs the same synthetic server price per elapsed second, including idle time. Then audit the companion model's missing prefill collective and KV geometry against the earlier hand ledgers.

**Traps**

- Calling synthetic percentile outputs measured tail latency. Independent length samples without arrival queues cannot reveal queueing tails or saturation.
- Using the sum of request service times as elapsed benchmark time when requests overlap. Goodput and cost need a common observation window.
- Removing rejected or failed work from the offered-load denominator, counting retries as new successes, or comparing plans with different warm reserve and device cost.

**Practice**

- The section mini-project covers this: servelab's topology and phase-capacity replay, hand-ledger oracles, equal-budget baseline and ablations, saturation and failure traces, and evidence-labeled goodput/utilization/KV-traffic/cost report.

**Stop when:** Your replay matches the hand timelines and resource ledgers, infeasible plans cannot win, and your equal-budget comparison separates simulated predictions from measurements and includes a negative regime.

<details>
<summary>Self-test</summary>

1. Why does the admission-limited replay have the same goodput but lower utilization?
   - Both runs have two SLO-qualified completions in the same 6 ms window. The unlimited run spends 6 ms serving three requests, including one late completion; the limited run serves two requests for 4 ms and rejects the other.
2. Does matching one isolated-request latency validate capacity predictions?
   - No. Capacity also depends on batching, arrivals, shared resources, memory admission and ownership. Validate those constraints and held-out workload mixtures separately.
3. Can a fitted single-GPU service curve make a cross-node comparison measured evidence?
   - No. Only the calibration observations are measured. Unobserved collective, transfer and contention behavior remains analytical or simulated, with its assumptions stated.
4. What should happen when a placement violates one rank's KV budget?
   - Reject the placement or simulate its declared admission, eviction or preemption policy. Do not report its unconstrained latency as feasible capacity.

</details>

### Mini-project: Disaggregated serving with owned handoffs and evidence labels

**About 12 to 16 hours.** Extend `sim/` with sharded, disaggregated and topology-aware serving plans and prove their handoffs preserve identity under faults. The evidence-labeled comparison ranks colocated against phase-separated serving and feeds gateway and capacity work.

1. Extend `sim/` with replica and tensor-parallel shard plans plus a per-rank ownership ledger, and check sharded forwards against an unsharded reference with own tests. Keep the ledger with replicated-head and over-budget rejection cases.
2. Reproduce the Day 17 pipeline bubble timeline on CPU and extend it with expert skew and position-shard accounting, checking boundaries against the notebook experiment. Keep timelines and a case where skew outweighs byte counts.
3. Build a per-layer communication ledger with a shared-link contention model, then sweep small-batch latency against memory capacity to surface a feasible plan that loses after startup. Keep the ledger and the losing plan.
4. Implement deterministic cache-aware routing in `sim/` with stated tie-breaks and compare it against load-only and predicted-waiting policies under skew and stale information, passing the TensorTonic routing problem. Keep traces and a hot-prefix loss.
5. Add separate phase queues with a fixed-budget pool sweep and first-token against KV-ready traces, plus serialized and overlapped handoff timelines with bounded credits, slow-receiver backpressure, tier-restore comparison, heterogeneous service and reserve-aware resize. Keep traces and the break-even decision.
6. Implement a versioned KV envelope with a mapping oracle and checksum plus incompatible-identity rejection, then replay cancellation, rank, transfer and duplicate faults with fencing and bounded retirement through a saturation-tested equal-budget comparison with ablations against hand ledgers. Keep fault traces and a negative regime.

**Deliverables**

- Shard, ownership and communication ledgers with differential checks and the losing latency plan.
- Routing, phase-pool and handoff evidence in `sim/` with traces, break-even decision and fault cases.
- Evidence-labeled comparison in `reports/` with equal-budget goodput, utilization, traffic and cost plus tests.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [TensorTonic cache-aware routing](https://www.tensortonic.com/problems/cs336-l18-cache-aware-prefill-routing). Free public cases for locality, tie-breaks and rejection; add own load tests.
- external-tests: [100 Days Day 17 pipeline bubble](https://github.com/elizabetht/100-days-of-inference/blob/b8343f8873b7bdd8bd8739a42aa7557d5644cf48/day17/model-parallelism.ipynb). Run the bubble break-even item and check boundaries with own timeline enumeration.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Shard and communication | Ownership and communication ledgers reconcile, sharded forwards match the unsharded reference, and the losing latency plan is kept. | A second sharding or topology case is checked, and startup versus bandwidth terms are separated. |
| Routing and disaggregation | The router passes public cases plus own tie tests, and phase-pool traces show queueing, transfer and reserve costs. | A hot-prefix counterexample explains the loss, and resize keeps only ready workers counted. |
| Handoff and evidence | Envelope, fencing and retirement tests pass, and the equal-budget comparison keeps saturation traces and a negative regime. | Hand-ledger replay matches, and goodput, utilization, traffic and cost are labeled by evidence tier. |

Feeds into: `sim/` topology replay, handoff envelope and evidence labels feed `gateway/` isolation and the capstone comparison.

### Resource route

- **Primary - Paper:** [DistServe: Disaggregating Prefill and Decoding for Goodput-Optimized LLM Serving](https://www.usenix.org/conference/osdi24/presentation/zhong-yinmin) - Read the interference model, independent phase parallelism, placement, KV transfer and goodput evaluation. Reuse the break-even method with your workload and topology; do not transfer the paper's speedups to different hardware.
- **Required - Book:** [AI Systems Performance Engineering - Chapters 15 and 17, distributed and disaggregated inference](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/) - Read the disaggregated prefill and decode architecture and the MoE parallelism strategies in Chapter 15, then Chapter 17 on disaggregated pools, routing policies and scalability. Reproduce every communication and KV-transfer estimate for a small declared topology.
- **Required - Lab:** [AI Systems Performance Engineering companion code - Chapters 15 and 17](https://github.com/cfregly/ai-performance-engineering/tree/main/code) - Use the single-device KV-handoff and simulation paths before the multi-GPU pairs. Then choose one disaggregation, routing or MoE target compatible with available hardware and keep bundled results separate from newly captured evidence.
- **Support - Book:** [Hands-On LLM Serving and Optimization - Chapter 7, multi-GPU and disaggregation](https://www.oreilly.com/library/view/hands-on-llm-serving/9798341621480/) - Read "Multi-GPU and Multi-Node Inferencing" (data, tensor, pipeline and expert parallelism) and "Prefill-Decode Disaggregation" (architecture, KV transfer, when to use it) in Chapter 7.
- **Required - Reference:** [NVIDIA Dynamo - Disaggregated Serving and KV-Aware Routing](https://docs.nvidia.com/dynamo/dev/knowledge-base/concepts/system-architecture/disaggregated-serving) - Trace frontend, prefill router, prefill worker, KV transfer, decode routing and decode worker. Record how load, cache overlap, worker discovery and transfer metadata affect placement; implement only a small simulated or available-hardware slice.
- **Required - Reference:** [TensorRT-LLM Disaggregated Serving and KV Cache Exchange](https://nvidia.github.io/TensorRT-LLM/features/disagg-serving.html) - Study the KV exchange abstraction, unique request identity, layout conversion, overlap and fleet-worker model. Use its reproducible benchmark sections only on supported hardware and pin the release.
- **Support - Reference:** [SGLang documentation - PD Disaggregation](https://docs.sglang.io/docs/advanced_features/pd_disaggregation) - Use the transfer backends, router integration, heartbeat, timeout and cleanup behavior as a second engine's view of the same handoff.
- **Support - Paper:** [Mooncake: A KVCache-Centric Disaggregated Architecture for LLM Serving](https://www.usenix.org/conference/fast25/presentation/qin) - Read the KV-centric architecture, transfer engine and scheduling sections to understand remote cache pools. Compare its assumptions with DistServe and your simpler handoff; defer reproduction requiring a large cluster.
- **Support - Practice:** [100 Days of LLM Inference - Days 12, 17 and 18](https://github.com/elizabetht/100-days-of-inference) - Use the Dynamo, model-parallelism and disaggregation notebooks for a compact topology simulator and request-handoff trace. Label notebook outputs as local analytical or simulated evidence unless real devices were used.
- **Support - Practice:** [TensorTonic Language Modeling from Scratch - Route Cache-Aware Prefill Requests](https://www.tensortonic.com/problems/cs336-l18-cache-aware-prefill-routing) - Solve after the routing unit and compare its cost rule with your own placement model.
- **Support - Course:** [LLM Inference: From scratch, one token at a time - Module 09](https://inference.tusharamrit.in/modules/distributed-inference.html) - Work the Distributed Inference module's communication arithmetic before the tensor and pipeline parallel units.
- **Reference - Reference:** [AI Performance Engineering - Distributed Inference](https://github.com/wafer-ai/gpu-perf-engineering-resources) - A curated index. Use Section 5 only to find a distributed-serving paper the other entries lack.
- **Reference - Reference:** [Python 3.14 hashlib - byte digests for KV integrity checks](https://docs.python.org/3.14/library/hashlib.html#usage) - Usage and Hash Objects only: compute and compare a SHA-256 digest over a declared canonical KV payload. Add request/version checks separately; a byte digest is not cache compatibility or authentication.

### Exit checkpoint

Defend single-node, replica, TP, PP, EP or disaggregated choices with a quantitative topology model, preserve request and KV lifecycle through cancellation or failure, and label every result as analytical, simulated, local-process or measured multi-device evidence.

<details>
<summary>Deliberately left for later</summary>

- Large-cluster reproduction before small topology predictions are validated
- Adaptive fleet controllers without a safe static baseline
- Distributed speedup claims that omit KV transfer and queueing

</details>

## INF-8. Production Serving and Reliability

**Why:** A fast model runner is only one component of a service. The production gate covers API semantics, lifecycle, overload, isolation, observability, rollout and recovery while preserving model quality.

### Learn this much

- [ ] Typed OpenAI-compatible request and response schemas _(Required)_
- [ ] Token streaming and backpressure _(Required)_
- [ ] Deadlines, disconnects and cancellation propagation _(Required)_
- [ ] Authentication, quotas and request validation _(Required)_
- [ ] Idempotency and retry boundaries _(Required)_
- [ ] Router and load-balancer responsibilities _(Required)_
- [ ] Token-aware and cache-aware routing _(Required)_
- [ ] Model formats, weight loading and startup phases _(Required)_
- [ ] Warmup, health and readiness _(Required)_
- [ ] Graceful drain and process termination _(Required)_
- [ ] Model, tokenizer, template and configuration compatibility _(Required)_
- [ ] Canary, blue-green and rollback workflows _(Required)_
- [ ] Autoscaling signals and startup lag _(Required)_
- [ ] Failure reserve, degraded-mode headroom and admission response _(Required)_
- [ ] Overload, admission and load shedding _(Required)_
- [ ] Retry budgets and storm prevention _(Required)_
- [ ] Multi-tenant model and cache isolation _(Required)_
- [ ] Prompt, output and trace privacy _(Required)_
- [ ] Per-request logs, metrics and traces _(Required)_
- [ ] Queue, phase, token, cache and scheduler telemetry _(Required)_
- [ ] GPU, CPU, memory and network telemetry _(Required)_
- [ ] Quality, availability, latency and error SLIs _(Required)_
- [ ] SLOs, error budgets and goodput _(Required)_
- [ ] Worker and GPU-process failure injection _(Required)_
- [ ] Dependency delay and cache-degradation injection _(Required)_
- [ ] Bad model or configuration rollout injection _(Required)_
- [ ] Seeded performance and security incident diagnosis _(Required)_
- [ ] Runbooks and first-cause timelines _(Required)_
- [ ] Saturation, recovery and rollback load tests _(Required)_
- [ ] Multi-LoRA adapter residency and affinity routing _(Optional)_
- [ ] Structured-output API and grammar-cache lifecycle _(Optional)_
- [ ] Multimodal media validation and encoder scheduling _(Optional)_
- [ ] Kubernetes Gateway API Inference Extension and llm-d deployment _(Depth)_
- [ ] Multi-region active-active serving and global procurement _(Later)_

### Study units

#### U1. Typed OpenAI-compatible schemas, token streaming and backpressure

**About 4 h** · **Target:** Explain + Implement

Topics: Typed OpenAI-compatible request and response schemas; Token streaming and backpressure; Structured-output API and grammar-cache lifecycle

The API schema and its stream are the product the learner operates. Every SLO, bill and debug session starts at the request fields and the event stream, not inside the model.

**You can now**

- Send a typed chat-completions request to a local engine and parse its SSE stream down to the `[DONE]` terminator.
- Explain where backpressure sits when a client reads slower than decode produces, using per-request queues and `stream_interval`.
- Constrain one endpoint with a JSON-schema structured output and state when a schema change defeats the grammar cache.

**Study**

1. [vLLM OpenAI-Compatible Server](https://docs.vllm.ai/en/v0.31.0/serving/online_serving/openai_compatible_server/) (vLLM Online Serving, Architecture and Production Metrics) - Supported APIs through Extra HTTP Headers: endpoint table, `vllm serve` with `--api-key token-abc123`, `extra_body` with `top_k`, `--enable-request-id-headers` with `x-request-id`, and `X-Vllm-Priority`.
2. [Streaming with batching from scratch](https://www.oreilly.com/library/view/hands-on-llm-serving/9798341621480/) (Hands-On LLM Serving and Optimization - Chapters 3 and 4, serving system design) - Chapter 3, Streaming with Batching (printed pp. 77-82): Table 3-1 batch evolution T0-T3, `/generate_stream` with `media_type="text/event-stream"`, per-prompt `asyncio.Queue` and the `None` finish signal.
3. [vLLM structured outputs](https://docs.vllm.ai/en/v0.31.0/features/structured_outputs/) (vLLM Online Serving, Architecture and Production Metrics) - Online Serving section: `choice`, `regex`, `json` and `grammar` examples through `extra_body`, the `--structured-outputs-config.backend` flag, and the deprecated `guided_json` mapping box.
4. [OpenAI chat streaming contract](https://developers.openai.com/api/reference/resources/chat/subresources/completions/methods/create) (OpenAI API Reference - streaming, auth, rate limits and request IDs) - Create chat completion: the `stream` and `stream_options.include_usage` parameters (the usage chunk arrives before `data: [DONE]`) and the streaming example ending in `data: [DONE]`; the linked Streaming events page for the `chat.completion.chunk` fields `delta` and `finish_reason` (page read 2026-10-14). Depth: Read only the streaming contract. vLLM on your GPU is the implementation under test, not the hosted service.

**Focus**

- The typed contract is `model`, `messages`, sampling fields such as `temperature`, `top_k` and `seed`, plus vLLM extras (`structured_outputs`, `request_id`, `session_id`, `cache_salt`, `priority`) passed through `extra_body`. `suffix` is unsupported and `user` is ignored.
- Each SSE chunk is one `data` line carrying a JSON `delta` object; the stream ends with a bare `[DONE]` data line, not with connection close. With $`N`$ output tokens and `stream_interval` $`= k`$, expect an initial role-only chunk, then about $`1 + \lceil (N - 1)/k \rceil`$ token-bearing chunks plus `[DONE]`, since the first and last tokens are always sent immediately.
- Backpressure lives in per-request queues between the decode loop and the HTTP connection. A slow reader grows queueing and connection time; it does not pause generation or reduce billed tokens.
- A structured-output grammar is compiled per distinct schema and reused on repeat. Rotating schemas per request turns every call into a cold compile; keep a small fixed schema set.

**Reproduce:** Against a local vLLM server, send one chat request with `stream=True` and `max_tokens=8`. Save the raw bytes, list every `data` line, point at the `[DONE]` terminator, and reassemble the assistant text from the `delta` fields only.

**Traps**

- `temperature=0` does not silence reasoning models. A local Qwen3-0.6B with `temperature=0` and `seed=1` still opens with `<think>`; temperature controls sampling, not the thinking trace.
- The server takes default sampling values from the model's `generation_config.json` in its Hugging Face repository. Fields your request sets still win; omitted ones inherit the model creator's values. Pass `--generation-config vllm` to fall back to vLLM's own defaults.
- `guided_json`, `guided_regex`, `guided_choice` and `guided_grammar` were removed in v0.12.0. In v0.31.0 they do not fail: the server ignores them, returns HTTP 200 with unconstrained output and logs a one-time warning. Use `structured_outputs` with `json`, `regex`, `choice` or `grammar`.

**Practice**

- [llm-model-inference ch03: streaming API tests](https://github.com/orca3/llm-model-inference/blob/main/ch03/single_model_llm_serving/tests/test_api.py) - `test_generate_stream` and `test_generate_stream_concurrent` against `/generate_stream`; `test_stream.sh` for the live-server variant. Run with a tiny CPU model. Assert close-terminated JSON `data` lines and concurrent-stream isolation on `/generate_stream`, which sends no `[DONE]` line. Then assert the `[DONE]` terminator on a local vLLM stream of `/v1/chat/completions`.

**Stop when:** Your saved stream parses to `[DONE]`, the deltas reassemble to the full text, and you can name which sampling knobs came from the model repository and which from your request.

<details>
<summary>Self-test</summary>

1. Which endpoints does vLLM's `--api-key` protect?
   - Only paths under `/v1`, `/v2` and `/inference` as documented (the v0.31.0 source also guards `/cohere`). `/health`, `/metrics` and `/invocations` stay unauthenticated, so put the server behind a reverse proxy that enforces auth.
2. How does a client know a stream is finished?
   - It receives a bare `data: [DONE]` line. Connection close alone is ambiguous: it can also mean a dropped connection mid-generation.
3. With 8 output tokens and `stream_interval=3`, about how many data chunks arrive?
   - About $`1 + \lceil 7/3 \rceil = 4`$ token-bearing chunks (tokens 1, 2 to 4, 5 to 7, then 8) after the role-only chunk, then `[DONE]`. The first token and the final chunk go out immediately; the middle ones wait for three new tokens.
4. Why does minting a fresh JSON schema per request hurt structured-output latency?
   - The grammar backend compiles each distinct schema, so a fresh schema misses the compiled-grammar cache on every call. A small fixed schema set reuses compiled grammars.

</details>

#### U2. Deadlines, cancellation, authentication, quotas, validation and idempotency

**About 5 h** · **Target:** Explain + Implement

Topics: Deadlines, disconnects and cancellation propagation; Authentication, quotas and request validation; Idempotency and retry boundaries; Multimodal media validation and encoder scheduling

The engine optimizes tokens, not trust. Auth, quotas, validation, deadlines and idempotency live in the gateway the learner builds around it, and a missing one becomes the incident.

**You can now**

- Put a deadline and cancellation path on a streaming endpoint and prove a disconnected client frees its engine slot.
- Enforce API-key auth, per-key quotas and request validation in front of an engine that authenticates almost nothing by itself.
- Draw the retry boundary with request IDs so a retried call never executes twice, and validate multimodal media before it reaches the encoder.

**Study**

1. [Enterprise public API: auth, rate limiting and ingress](https://www.oreilly.com/library/view/hands-on-llm-serving/9798341621480/) (Hands-On LLM Serving and Optimization - Chapters 3 and 4, serving system design) - Chapter 4, Implementing Public API (printed pp. 127-128): `/v1/chat/completions` with `Depends(require_auth)` and `await rate_limit(tenant)`, JWT bearer or API-key lookup, HPA at 70% CPU with 3 to 15 replicas, Nginx `limit-rps: 50` annotations.
2. [Project 103 auth, rate-limit and streaming middleware](https://github.com/ai-infra-curriculum/ai-infra-engineer-learning/tree/main/projects/project-103-llm-deployment) (AI Infrastructure Engineer Learning - Project 103 LLM Deployment) - `src/api/middleware.py`: `RateLimitMiddleware` token bucket (`requests_per_minute=60`, `burst_size=10`, 429 with `Retry-After: 60`), `APIKeyAuthMiddleware` with public endpoints `/health`, `/docs`, `/openapi.json`; `src/api/streaming.py`: `safe_stream_wrapper` cancellation and error events, `stream_with_heartbeat`.
3. [vLLM request identity and priority headers](https://docs.vllm.ai/en/v0.31.0/serving/online_serving/openai_compatible_server/) (vLLM Online Serving, Architecture and Production Metrics) - Extra HTTP Headers: `--enable-request-id-headers` with caller `x-request-id`, `X-Vllm-Priority` overriding body `priority`; Extra Parameters: `request_id` default `random_uuid` and stable `session_id`.
4. [OpenAI auth, rate limits and client request IDs](https://developers.openai.com/api/reference/overview) (OpenAI API Reference - streaming, auth, rate limits and request IDs) - API Overview: Authentication with bearer credentials and server-side key handling; Debugging requests: `x-request-id` and the `x-ratelimit-*` headers; Supplying your own request ID with `X-Client-Request-Id` (ASCII, at most 512 characters, else 400) (page read 2026-10-14). Depth: Use the header and ID contract only. Quota numbers and hosted rate limits do not transfer to a self-hosted engine.
5. [vLLM multimodal fetch policy and cache identity](https://docs.vllm.ai/en/v0.31.0/features/multimodal_inputs/) (vLLM Multimodal Inputs - media validation, fetch policy and cache identity) - Online Serving for image, video and audio inputs: `--allowed-media-domains` with `VLLM_MEDIA_URL_ALLOW_REDIRECTS=0`, fetch timeouts 5s image / 30s video / 10s audio, `--limit-mm-per-prompt`, `--allowed-local-media-path`, and media `uuid` for cache identity. Depth: Read the Online Serving parts and the security tip only. Skip decoder-backend tuning; encoder scheduling returns in the disaggregation section.

**Focus**

- vLLM's `--api-key` covers only `/v1`, `/v2` and `/inference` (plus `/cohere` in the v0.31.0 source). Quotas, validation, deadlines and idempotency are gateway work: check them before the request enters the scheduler.
- A deadline has three legs: client timeout, gateway timeout and engine cancellation. vLLM aborts a chat or completion request when its HTTP connection closes; background Responses use `/v1/responses/{response_id}/cancel`, and `--tokens-only` or development-mode servers expose `/abort_requests`. A gateway that times out its client but keeps the upstream connection open leaks the KV slot until `max_tokens`.
- Retries are safe only inside an idempotency boundary: caller-supplied `x-request-id` mapped to one engine `request_id`, with a dedupe table that returns the first result. Retry without that key executes twice.
- Media is untrusted input: restrict fetch domains, cap count and size per prompt with `--limit-mm-per-prompt`, enforce fetch timeouts, and give cacheable media stable UUIDs so identical bytes share encoder work.

**Reproduce:** From a blank file, implement a token-bucket limiter keyed by API key (`requests_per_minute=60`, `burst_size=10`) that returns 429 with `Retry-After: 60` and `X-RateLimit-Remaining: 0`. Drain the bucket with 10 quick calls from one key, then show the 11th call rejected without reaching the engine.

**Traps**

- Trusting `--api-key` as full auth. It leaves `/health`, `/metrics` and `/invocations` open; the security note in the server docs says to deploy behind a reverse proxy.
- Retrying a timed-out stream as a new request. The first attempt may still be decoding; without a shared `request_id` the retry doubles cost and can double side effects.
- Fetching arbitrary media URLs server-side. A prompt can point the fetcher at internal hosts; allow-list domains and disable redirect following.

**Practice**

- [Project 103: stubbed API, middleware and streaming tests](https://github.com/ai-infra-curriculum/ai-infra-engineer-learning/blob/main/projects/project-103-llm-deployment/tests/test_api.py) - `TestMiddleware::test_rate_limiting` and `test_authentication`, `TestGenerateEndpoint::test_generate_streaming`; implement `src/api/middleware.py` and `src/api/streaming.py` per their comments until all seven tests pass. The bodies are `pass` stubs with the contract in comments. Implement token-bucket limiting, key auth with public `/health`, and SSE with heartbeat before running the suite.

**Stop when:** An over-limit key gets 429 without engine work, a cancelled stream frees its slot, and a duplicate `x-request-id` returns one stored result.

<details>
<summary>Self-test</summary>

1. A gateway times out its client after 10s, but the engine keeps decoding to `max_tokens=512`. What leaked, and what stops it?
   - The KV-cache and scheduler slots stay held until generation ends. vLLM aborts a request when its HTTP connection closes, so the gateway must close or cancel its upstream call on every timeout (`/v1/responses/{response_id}/cancel` for a background Response).
2. Two identical chat requests arrive with the same caller `x-request-id`. How many engine executions should happen?
   - One. The gateway maps the caller key to a single engine `request_id`, returns the stored result for the duplicate, and only a new key starts new work.
3. Why must media fetch domains be allow-listed even when prompts are authenticated?
   - An authenticated prompt can still embed an internal URL, turning the server fetcher into a proxy into the datacenter network. Allow-listing plus no-redirect policy contains that SSRF path.
4. A video request stalls for 40s before the first token on a healthy GPU. Which serving knob do you check first?
   - The media fetch path: a remote video fetch can run up to its 30s default timeout before prefill starts, so a slow media host looks like slow inference. Check fetch timing before blaming prefill.

</details>

#### U3. Router and load-balancer responsibilities, token- and cache-aware routing

**About 4 h** · **Target:** Explain + Implement

Topics: Router and load-balancer responsibilities; Token-aware and cache-aware routing; Multi-LoRA adapter residency and affinity routing

Round-robin across replicas collapses tail latency on heterogeneous LLM requests. Placement must see tokens, prefixes and adapters, not just connection counts.

**You can now**

- Separate router placement (per-request, model and cache aware) from load balancing (system-level capacity spreading).
- Implement prefix-hash routing with bounded imbalance and a FailOpen fallback for picker failure.
- Route LoRA traffic by adapter residency so adapter swaps stay off the critical path.

**Study**

1. [Load balancing and request routing](https://mlsysbook.ai/vol2/inference/inference.html) (Machine Learning Systems, Volume 2 - Inference at Scale and Serving Fault Tolerance) - Load Balancing and Request Routing: The power of two choices with Algorithm 2 and equation 13, Weighted and adaptive load balancing, Least-connections load balancing, Consistent hashing for stateful routing with Example 1.15, and Health checking and failover with the liveness, readiness and deep levels plus Table 31 cadences (page read 2026-10-14).
2. [Gateway API Inference Extension routing](https://gateway-api-inference-extension.sigs.k8s.io/) (Gateway API Inference Extension) - Introduction: Key Features (model-aware and smart load balancing), API Resources, Request Flow five steps; InferencePool page at /api-types/inferencepool: `vllm-qwen3-32b` example with `endpointPickerRef` and `failureMode: FailOpen`; API Reference at /reference/spec: `EndpointPickerFailureMode` (FailOpen forwards, FailClose drops, default FailClose); Implementer's Guide at /guides/implementers: the EPP callout with the `x-gateway-destination-endpoint` header (page read 2026-10-14).
3. [Day 24 routing, load balancing and queueing notebook](https://github.com/elizabetht/100-days-of-inference/blob/main/day24/routing-load-balancing-queueing.ipynb) (100 Days of LLM Inference - Days 22 to 26) - Part 1 token-aware routing (load CV 0.066 to 0.005 over 1000 requests on 4 replicas), Part 2 cache-aware routing (hit rate 8.8% to 30.7%), Part 3 LoRA-aware routing (804 round-robin swaps against 280 LoRA-aware in the stored run, at 200ms each; the LoRA-aware count shifts by a few tens on rerun because NumPy is not reseeded), Part 5 Little's law table and the 80% utilization rule. Depth: Use the simulator cells as runnable claims, not as production code. Replace the fixed 200ms swap and 90% sharing with your own workload numbers.
4. [vLLM LoRA serving and adapter accounting](https://docs.vllm.ai/en/v0.31.0/serving/online_serving/) (vLLM Online Serving, Architecture and Production Metrics) - Instrumentator APIs, LoRA dynamic loading: `/v1/load_lora_adapter` and `/v1/unload_lora_adapter`, local development only; Metrics APIs: `/metrics`, where the Production Metrics page lists `vllm:lora_requests_info`. Depth: Do not use the dynamic load endpoints outside local development. Production adapter placement belongs in the router.
5. [Router versus load balancer and smart routing](https://www.baseten.co/inference-engineering/) (Inference Engineering - Chapter 7, Production) - Section 7.2.3 (printed pp. 190-191): router as request-level placement versus load balancer as system-level capacity, token-aware and KV-aware routing, LoRA-aware routing, FIFO and priority queues.

**Focus**

- The router answers per request where it should go (model name, prefix overlap, adapter residency, priority). The load balancer answers where it could go (healthy endpoints with headroom). Mixing the two jobs hides placement bugs behind connection counts.
- Two-choice routing cuts the worst queue from $`\Theta(\log R / \log \log R)`$ to $`\Theta(\log \log R)`$ with one extra probe, but only when the work signal matches LLM load: active tokens or KV pressure, not request count.
- Prefix affinity needs the full identity in the hash key: prompt bytes plus model version, tenant scope and cache salt. Hashing raw text alone reuses across versions and tenants.
- The picker is a single point of failure. `FailClose` drops every request when the picker fails; `FailOpen` falls back to gateway-picked endpoints. Choose explicitly per pool.

**Reproduce:** Rerun the day24 Part 1 simulation: 1000 requests with clipped-exponential prompt lengths over 4 replicas. Show round-robin load CV near 0.07, then add token-aware placement and show CV near 0.005 with the same mean.

**Traps**

- Calling round-robin fair on 10-token and 100000-token requests. Equal counts are unequal load; the long request pins its replica while short ones queue elsewhere.
- Leaving the default `FailClose` unexamined. A picker bug then becomes a full outage for that pool; `FailOpen` trades it for unplanned placement.
- Using `/v1/load_lora_adapter` in production. The docs mark it local-development only; live adapter swaps belong in deployment and router affinity, not in request-time calls.

**Practice**

- [100 Days day24: routing experiments 1 and 3](https://github.com/elizabetht/100-days-of-inference/blob/main/day24/routing-load-balancing-queueing.ipynb) - Try These Experiments: 1, consistent-hash ring under rolling restart with 1/N movement; 3, LIFO versus FIFO tails under a 10x burst. Run experiments 1 and 3 in the notebook (experiment 2 is the overload unit's breaker drill), then port the hashing ring to your own gateway sketch with model version and tenant in the key.

**Stop when:** Your simulation shows the CV drop, your hash key names version and tenant, and you can defend FailOpen versus FailClose for one pool.

<details>
<summary>Self-test</summary>

1. Why does token-aware two-choice routing beat least-connections on LLM load?
   - Least-connections counts requests, so one 500-token decode counts the same as one 10-token reply. Token-aware two-choice compares post-admission load in tokens or KV pages, exposing the real remaining work.
2. The endpoint picker crashes under `FailClose`. What do clients see, and what changes under `FailOpen`?
   - Under `FailClose` the gateway drops requests even though replicas are healthy. Under `FailOpen` it forwards to a gateway-picked endpoint, trading smart placement for availability.
3. Two tenants share a system prompt. Why must the prefix-hash key include tenant scope?
   - Otherwise tenant B hits tenant A's cached prefix, leaking prompt bytes through timing and breaking isolation. Salt or scope the key per tenant.
4. LoRA-aware routing cut swaps from 804 to about 280 in the stored run. What does each avoided swap save?
   - One 200ms adapter load off the request path, plus the KV and batch disruption around it. Affinity keeps hot adapters resident instead of churning them.

</details>

#### U4. Weight loading, startup phases, warmup, readiness and graceful drain

**About 4 h** · **Target:** Explain + Measure

Topics: Model formats, weight loading and startup phases; Warmup, health and readiness; Graceful drain and process termination

Autoscaling and rollout math both rest on startup time and honest readiness. A server that reports ready before warmup, or dies with a full queue, voids every downstream guarantee.

**You can now**

- Split a cold start into provision, image, weight-load and warmup phases and name which dominates for a large model.
- Wire liveness, readiness and inference-health probes with thresholds, and state what each gates.
- Drain a server gracefully: stop admission, finish in-flight work, then terminate, without stranding billed requests.

**Study**

1. [Cold starts and health checking](https://mlsysbook.ai/vol2/inference/inference.html) (Machine Learning Systems, Volume 2 - Inference at Scale and Serving Fault Tolerance) - Autoscaling and Global Infrastructure, The cold start problem: equation 14, Table 39 load times by storage tier (SSD versus S3) and Example 1.21 (Llama-70B totaling 420s with a 300s S3 download); Load Balancing and Request Routing, Health checking and failover: the liveness, readiness and deep probe levels, Table 31 cadences and the warmup startup check (page read 2026-10-14).
2. [Containerization and cold starts](https://www.baseten.co/inference-engineering/) (Inference Engineering - Chapter 7, Production) - Section 7.1 (printed pp. 179-183): base images, version pinning, large weights loaded separately; Section 7.2.2 (printed pp. 188-190): the four cold-start factors and the engine-startup trade-off between fast-start engines and compile-heavy ones. Depth: Skip the vendor-specific image advice. Keep the startup-phase split and the pinning rule.
3. [Day 23 cold-start stages and frontier](https://github.com/elizabetht/100-days-of-inference/blob/main/day23/autoscaling-concurrency-cold-starts.ipynb) (100 Days of LLM Inference - Days 22 to 26) - Part 2 `cold_start_stages` table for 70B FP16 (its printed 927s and 102s totals add both the vLLM and the TRT-LLM engine rows, which are alternatives; the vLLM path is 627s versus 72s) and the scale-to-zero frontier table; Try These Experiments 6: time `vllm serve` startup on a small model against the theory.
4. [Project 103 deployment probes](https://github.com/ai-infra-curriculum/ai-infra-engineer-learning/blob/main/projects/project-103-llm-deployment/kubernetes/llm-deployment.yaml) (AI Infrastructure Engineer Learning - Project 103 LLM Deployment) - Container probes: `livenessProbe` on `/health` with `initialDelaySeconds: 300`, `readinessProbe` on `/health` with `initialDelaySeconds: 60`; resource requests with `nvidia.com/gpu: 1`, model-cache PVC and 8Gi `shm` volume.
5. [vLLM health endpoint](https://docs.vllm.ai/en/v0.31.0/serving/online_serving/) (vLLM Online Serving, Architecture and Production Metrics) - Instrumentator APIs, Basic APIs: `/health` health check (the v0.31.0 handler returns 200 while the engine answers and 503 once it is dead).
6. [Day 26 graceful drain](https://github.com/elizabetht/100-days-of-inference/blob/main/day26/zero-downtime-deployment.ipynb) (100 Days of LLM Inference - Days 22 to 26) - Part 4 `GracefulShutdown` with `drain_timeout=60` over 25 active requests, and its lifecycle line: preStop hook, deregister from the load balancer, drain, SIGTERM, then SIGKILL after the grace period. Depth: The class only counts requests. Port the order, not the timings, onto your own server.

**Focus**

- Cold start is $`T_{\text{cold}} = T_{\text{provision}} + T_{\text{load}} + T_{\text{warmup}}`$. For large models $`T_{\text{load}}`$ dominates: 140GB at S3 rates is minutes, and no scheduler tuning removes it.
- Three probe levels answer different questions: liveness (is the process alive), readiness (weights loaded, GPU initialized, warmup done, dependencies up), deep inference health (a known input returns sane output). vLLM serves HTTP only after engine startup, so its `/health` 200 means started and not dead; it checks neither output nor your other dependencies.
- Warmup is real work: dummy generations that compile graphs and fill pools before the first billed request. First-request latency without warmup measures compilation, not serving.
- Drain order matters: fail readiness and deregister so no new traffic arrives, stop admission, finish in-flight work within the timeout, persist what must survive, then terminate. SIGKILL skips every step and strands billed work.

**Reproduce:** Time your local server from process start to its first `/health` 200 and to the first successful deep inference-health probe. Split the total into container, weight-load and warmup phases from the server log, and note that the HTTP port does not answer until engine startup ends.

**Traps**

- Reading `/health` 200 as proof of correct serving. vLLM's check means the engine started and has not died; a deep inference probe and your own dependency checks gate traffic beyond that.
- Copying the Project 103 troubleshooting doc probe path without reading the manifest. The doc text names `/ready` while the deployment YAML probes `/health`; the manifest wins.
- Baking large weights into the container image. That path is obsolete past small models; load hundred-gigabyte weights from near-GPU storage at startup instead.

**Practice**

- [100 Days day23: startup timing experiment](https://github.com/elizabetht/100-days-of-inference/blob/main/day23/autoscaling-concurrency-cold-starts.ipynb) - Try These Experiments 6: time `vllm serve` startup on a small model and reconcile each phase with the `cold_start_stages` table. Record provision, image, weight-load and warmup separately. Then add a deep inference-health probe beside `/health` and state what each one proves.

**Stop when:** Your phase-split timing reconciles with the cold-start equation, and your probes distinguish alive, ready and correctly-inferring states.

<details>
<summary>Self-test</summary>

1. A Llama-70B server cold-starts in 420s. Which phase dominates, and what removes the most time?
   - Weight download at 300s over S3 dominates. Moving weights to in-node NVMe-class storage and shrinking them with quantization removes most of it; scheduler tuning removes almost none.
2. What does each probe level gate, and how often does it run?
   - Liveness gates process restart (10s interval, 5s timeout, 3 failures); readiness gates routing (5s, 3s, 2 failures); deep inference health gates silent corruption with a known input (30s, 10s, 1 failure).
3. Why must warmup finish before the first billed request?
   - The first generations compile graphs and initialize pools, so their latency reflects one-time setup. Billing or SLO-measuring them charges setup cost to the user.
4. A deploy sends SIGKILL to a server with 25 queued requests. What breaks that graceful drain would have saved?
   - In-flight generations lose their KV state and billed tokens, queued requests get no retryable rejection, and the load balancer keeps routing until its own health check notices. Drain deregisters and stops admission first, finishes in-flight work, then terminates.

</details>

#### U5. Compatibility checks, canary and blue-green rollout, and rollback

**About 4 h** · **Target:** Explain + Implement

Topics: Model, tokenizer, template and configuration compatibility; Canary, blue-green and rollback workflows

Most serving outages ship as version skew, not bad weights: a new template, a changed default or a half-rolled fleet. Rollout discipline is the reliability control.

**You can now**

- Write the compatibility checklist (model, tokenizer, chat template, sampling config, engine version) that gates any rollout.
- Run a staged canary with automatic rollback on error and p99 gates.
- Explain when blue-green beats canary and what the extra GPUs cost.

**Study**

1. [Zero-downtime deployment](https://www.baseten.co/inference-engineering/) (Inference Engineering - Chapter 7, Production) - Section 7.4.1 (printed pp. 200 to 201): blue-green with full cutover and its 2x cost, the four-step canary (build, small live slice, monitor or revert, ramp), and the minimum-replica queue warning for the new pool.
2. [Day 26 blue-green, canary and drain notebook](https://github.com/elizabetht/100-days-of-inference/blob/main/day26/zero-downtime-deployment.ipynb) (100 Days of LLM Inference - Days 22 to 26) - Part 1 `BlueGreenDeployment` shifting 10% to 50% to 100%; Part 2 `CanaryDeployment` over `[0.01, 0.05, 0.10, 0.25, 0.50, 1.00]` with gates error below twice 0.005 and p99 below 1.5 times 500ms, Scenario A advancing and Scenario B rolling back at 5% (Scenario B adds Gaussian noise to its nominal p99s, so the stored run prints 397, 417 and 815ms); Part 4 `GracefulShutdown` drain demo.
3. [vLLM template and tokenizer compatibility surfaces](https://docs.vllm.ai/en/v0.31.0/serving/online_serving/) (vLLM Online Serving, Architecture and Production Metrics) - Chat Template: `--chat-template` and `--chat-template-content-format`, with chat requests erroring when no template exists; Tokenize APIs: `/tokenizer_info`; Basic APIs: `/version` for pinning the engine beside the model.
4. [Version synchronization during rollouts](https://mlsysbook.ai/vol2/inference/inference.html) (Machine Learning Systems, Volume 2 - Inference at Scale and Serving Fault Tolerance) - Autoscaling and Global Infrastructure, Global inference infrastructure: the model synchronization and version consistency paragraph (push, pull and hybrid propagation, the brief inconsistency window during rollouts); Global model deployment: each region expansion is a gate that halts the rollout (page read 2026-10-14). Depth: Read the version-sync paragraphs only. Multi-region failover design belongs to the distributed section.

**Focus**

- Compatibility is a tuple: weights, tokenizer, chat template, sampling defaults and engine version. Changing one element without the rest is a new system, and the canary must compare full tuples.
- Canary gates need both errors and tails: the day26 gates (error below twice baseline, p99 below 1.5 times baseline) catch the regression scenario that pure error rates miss.
- The new pool needs real capacity from step one. A canary sized at default minimum replicas queues immediately, and the queue looks like a model regression.
- Blue-green buys instant rollback with a full duplicate fleet held for the overlap window. Canary buys cheap gradual proof across small traffic steps. Pick by blast radius, not by fashion.

**Reproduce:** Rerun the day26 canary scenarios from a blank notebook: the healthy build advances 1% to 100%, while the p99 regression (nominal 820ms, printed 815ms, against a 500ms baseline at the 5% step) rolls back to 0%. Write out both gate evaluations by hand.

**Traps**

- Rolling back weights but not the template. A chat-template change alters every prompt rendering; rollback must restore the full tuple.
- Judging a canary on error rate alone. The day26 Scenario B keeps errors flat while p99 nearly doubles; without the tail gate it promotes.
- Assuming identical latency means identical behavior across a tokenizer change. Token IDs shift under the same text, so compare `/tokenizer_info` and sampled outputs, not just TTFT.

**Practice**

- [100 Days day26: canary scenarios and drain](https://github.com/elizabetht/100-days-of-inference/blob/main/day26/zero-downtime-deployment.ipynb) - Part 2 `CanaryDeployment` Scenarios A and B with the error and p99 gates; Part 4 `GracefulShutdown` with `drain_timeout=60` over 25 requests. Rerun both scenarios, then change one gate at a time and record which change flips Scenario B. Finish by draining the old pool after promotion.

**Stop when:** You can hand-evaluate both canary gates on fresh numbers, and your rollback checklist restores weights, template, config and routing together.

<details>
<summary>Self-test</summary>

1. Scenario B shows p99 820ms at the 5% step against a 500ms baseline with flat errors. Promote or roll back?
   - Roll back to 0%. The p99 gate allows at most 1.5 times 500ms (750ms); 820ms exceeds it even though errors stay under twice baseline.
2. Why is blue-green called unsuited for large inference despite its instant rollback?
   - It needs a full duplicate fleet before traffic cuts over: at 100-GPU scale, another 100 GPUs. Canary plus autoscaling proves the same build with far less extra capacity.
3. A rollout keeps weights fixed but updates the chat template. Which compatibility check fires first?
   - The template-version check: rendered prompts change, so prompt token IDs and behavior shift with identical weights. Pin and canary the template with the weights.
4. When is brief cross-region version inconsistency acceptable?
   - When all regions pin versions, the window is bounded, and no region advances until the prior one holds healthy. Strict workloads pin routing instead of tolerating the window.

</details>

#### U6. Autoscaling signals, startup lag, failure reserve and degraded-mode headroom

**About 4 h** · **Target:** Derive

Topics: Autoscaling signals and startup lag; Failure reserve, degraded-mode headroom and admission response

Replicas arrive minutes after the spike that needs them. Capacity math done before the incident is the only autoscaling that works on GPU cold starts.

**You can now**

- Derive desired replicas from queue depth, latency ratio and Little's law for one declared workload.
- Size warm pools and failure reserve from startup lag and replica availability math.
- Explain why CPU-based autoscaling misfires on LLM serving and which signals replace it.

**Study**

1. [Autoscaling and warm pools](https://mlsysbook.ai/vol2/inference/inference.html) (Machine Learning Systems, Volume 2 - Inference at Scale and Serving Fault Tolerance) - Autoscaling and Global Infrastructure, Scaling dimensions through Scaling response time analysis: Table 38 scaling dimensions, reactive Listing 3 with the queue-depth and P99-ratio desired-replica rules, predictive Listings 4 and 5 with `Target = max(Predicted, Reactive) + Buffer`, Table 43 warm tiers, equation 15 with Table 44 (page read 2026-10-14).
2. [Availability with redundant replicas](https://mlsysbook.ai/vol2/fault_tolerance/fault_tolerance.html) (Machine Learning Systems, Volume 2 - Inference at Scale and Serving Fault Tolerance) - Serving Fault Tolerance, Redundancy and replication, Availability calculations: equation 11 with the 99% to 99.99% worked example and its independence assumption (page read 2026-10-14).
3. [Autoscaling signals and scale-to-zero](https://www.baseten.co/inference-engineering/) (Inference Engineering - Chapter 7, Production) - Section 7.2 (printed pp. 183-186): utilization versus traffic signals and the five autoscaling factors; Section 7.2.1 (printed pp. 186-188): concurrency target matched to batch size; Section 7.2.4 (printed p. 192): scale-to-zero prerequisites; Section 7.2.5 (printed p. 192): per-component scaling with the 10ms in-cluster versus 50ms cross-cluster example.
4. [Day 23 autoscaling simulator](https://github.com/elizabetht/100-days-of-inference/blob/main/day23/autoscaling-concurrency-cold-starts.ipynb) (100 Days of LLM Inference - Days 22 to 26) - Part 1 `simulate_autoscaling` with `min_replicas=2`, `max_replicas=20`, `concurrency_target=5`, `scale_down_delay_sec=300`; the throughput model flattening near batch 299; Try These Experiments 1, 2, 4 and 5 (delay sweep, concurrency sweep, predictive pre-warm, cheapest `min_replicas`). Depth: The README (~90 concurrent) and the notebook cell (230) disagree on Llama-3-8B H100 capacity at 2048 context. Recompute KV bytes per token for your own model and context instead of quoting either number.
5. [Project 103 HPA and scaling guidance](https://github.com/ai-infra-curriculum/ai-infra-engineer-learning/blob/main/projects/project-103-llm-deployment/kubernetes/hpa.yaml) (AI Infrastructure Engineer Learning - Project 103 LLM Deployment) - `hpa.yaml`: `minReplicas: 1`, `maxReplicas: 3`, CPU 70% and memory 80% signals, scale-down stabilization 300s, commented per-second custom metric; `docs/TROUBLESHOOTING.md` section 9: replacing CPU with `vllm:num_requests_waiting` through the Prometheus adapter or KEDA.

**Focus**

- Three replica rules must agree: Little's law $`L = \lambda W`$ for the workload, queue-depth $`\text{Desired} = \lceil \text{Queue}/\text{target} \times \text{Current} \rceil`$ for the backlog, and the P99-ratio rule for SLO defense. When they disagree, the pool is either cold or saturated.
- Response time is $`T_{\text{response}} = T_{\text{detect}} + T_{\text{decide}} + T_{\text{provision}} + T_{\text{warmup}}`$, and provisioning dominates by an order of magnitude. Warm pools buy down the dominant term; faster metrics never will.
- CPU at 70% is the wrong signal for decode-bound serving: a few long prompts fill the KV cache and the GPU while host CPUs idle. Scale on `vllm:num_requests_waiting`, queue depth and TTFT, not on CPU.
- Availability $`A_{\text{system}} = 1 - (1 - A_{\text{single}})^k`$ assumes independent failures. Shared power, networking or a fleet-wide bad config removes the exponent, so failure reserve also needs failure diversity.

**Reproduce:** For arrivals $`\lambda = 30`$ requests/s and service time $`W = 3`$s, Little's law gives $`L = 90`$ in flight. At 5 concurrent requests per replica that is 18 replicas at full load, or 23 under the 80% headroom rule. Then apply the queue-depth rule on 18 current replicas with a mean queue depth of 12 per replica against a target of 10: $`\lceil 12/10 \times 18 \rceil = 22`$. Explain why it differs from 23.

**Traps**

- Shipping the Project 103 default HPA unchanged. CPU and memory signals miss GPU-bound decode pressure; add the waiting-requests custom metric before trusting it.
- Setting a short scale-down delay to save money. It oscillates: replicas leave, the queue rebuilds, cold replicas return. The 300s stabilization window exists for this cycle.
- Putting SLO-critical traffic on spot. Thirty seconds to two minutes of termination notice cannot drain long decodes; keep spot to best-effort classes behind the same drain path.

**Practice**

- [100 Days day23: autoscaling sweeps](https://github.com/elizabetht/100-days-of-inference/blob/main/day23/autoscaling-concurrency-cold-starts.ipynb) - Try These Experiments 1 (sweep `scale_down_delay_sec` over 60 to 900 keeping violations under 5%), 2 (sweep `concurrency_target` 2 to 20 on p50/p99), 4 (predictive 15-minute pre-warm versus reactive) and 5 (cheapest `min_replicas` with p99 cold start under 1s). Run the sweeps in the notebook, then recompute the concurrency bound from your own model's KV bytes per token instead of the notebook's 230.

**Stop when:** Your three replica rules agree on one declared workload, and you can price the warm pool that covers one startup lag.

<details>
<summary>Self-test</summary>

1. Arrivals run 10 requests/s with 3s service time and 5 concurrency per replica. How many replicas at the 80% rule?
   - In flight $`L = 10 \times 3 = 30`$, which needs 6 replicas at full load and $`\lceil 6/0.8 \rceil = 8`$ under the 80% headroom rule.
2. Latency is fine at 70% utilization but p99 explodes at 95%. Why is the ratio not 95/70?
   - Queueing delay grows like $`1/(1 - \rho)`$, not in proportion to $`\rho`$. In an M/M/1 model, mean and p99 response time both rise about sixfold from $`\rho = 0.7`$ to $`\rho = 0.95`$ ($`0.3/0.05 = 6`$), and burstier real arrivals make the tail worse. Size to 70 to 80% utilization.
3. One replica is 99% available (3.65 days down per year). What do two give, and when does the math lie?
   - $`1 - 0.01^2 = 99.99`$%, about 52.6 minutes per year. It lies when failures correlate: shared power, network, zone or a bad fleet-wide rollout fails both together.
4. Traffic is flat but TTFT climbs steadily. Which autoscaling signal fires, and what does it mean?
   - The P99-ratio and waiting-requests signals fire while CPU stays flat. It means per-request work grew (longer prompts, colder cache), not request count; add replicas or shed by work, not by rate.

</details>

#### U7. Overload, admission, load shedding and retry budgets

**About 3 h** · **Target:** Explain + Implement

Topics: Overload, admission and load shedding; Retry budgets and storm prevention

Past saturation every accepted request harms admitted ones. Explicit shedding plus bounded retries turns collapse into degraded but predictable service.

**You can now**

- Admit by work (tokens and KV), not by count: reject at the edge with 429 before the scheduler degrades everyone.
- Shed by priority and deadline so premium survives a 10x burst while batch waits.
- Cap retries with budgets and break circuits so one slow replica stops recruiting the fleet.

**Study**

1. [Load shedding and circuit breakers](https://mlsysbook.ai/vol2/fault_tolerance/fault_tolerance.html) (Machine Learning Systems, Volume 2 - Inference at Scale and Serving Fault Tolerance) - Graceful Degradation, Graceful degradation strategies: Load shedding with priority shedding, admission control at entry and the closed, open and half-open breaker (Figure 30 with 5 failures in 30s and a 60s timeout); Graceful degradation implementation: Listing 1 trigger rules (page read 2026-10-14).
2. [Backpressure under KV pressure](https://mlsysbook.ai/vol2/inference/inference.html) (Machine Learning Systems, Volume 2 - Inference at Scale and Serving Fault Tolerance) - Load Balancing and Request Routing, Circuit breakers and backpressure: backpressure 503s and the three KV-pressure reliefs (page read 2026-10-14).
3. [Day 24 burst queue notebook](https://github.com/elizabetht/100-days-of-inference/blob/main/day24/routing-load-balancing-queueing.ipynb) (100 Days of LLM Inference - Days 22 to 26) - Part 4 `InferenceQueue` with `max_size=150`, premium, standard and batch tiers at 30s, 120s and 600s deadlines, burst of 300 over 30s at 1 req/s drain: 150 dropped-full, 22 expired, premium mean 26.05s against its 30s deadline.
4. [vLLM waiting-queue signals](https://docs.vllm.ai/en/v0.31.0/usage/metrics/) (vLLM Online Serving, Architecture and Production Metrics) - General Metrics: `vllm:num_requests_waiting`, `vllm:num_requests_waiting_by_reason` with `capacity` versus `deferred` labels (LoRA budget, KV transfer, blocked status), and `vllm:num_requests_running`.
5. [Project 103 shed rule](https://github.com/ai-infra-curriculum/ai-infra-engineer-learning/blob/main/projects/project-103-llm-deployment/docs/TROUBLESHOOTING.md) (AI Infrastructure Engineer Learning - Project 103 LLM Deployment) - Section 10: shed load with 429 once `num_requests_waiting` passes N, with `RateLimitMiddleware` keyed by API key returning `Retry-After: 60`.

**Focus**

- Admission control rejects at entry what the engine cannot serve. Shedding inside the engine degrades admitted requests too; edge 429 with `Retry-After` preserves their SLOs and coordinates clients.
- Random drop treats premium and batch as equals. Shed by declared QoS class and deadline: expire overdue work first, protect interactive classes, make batch wait.
- A retry without a budget multiplies a partial failure. Cap retries as a fraction of active traffic and break the circuit (open on repeated failure, single half-open probe) so a slow replica fails fast instead of queueing the fleet.
- `capacity` waiting means add replicas or shed; `deferred` waiting means a transient constraint (LoRA budget, KV transfer, blocked status). Shedding fixes only the first; the second needs investigation.

**Reproduce:** Replay the day24 Part 4 burst from a blank script: 300 requests over 30s into a queue of 150 at 1 req/s drain with the three tier deadlines. Match about 150 dropped-full, 22 expired, and premium mean near 26s inside its 30s deadline.

**Traps**

- Returning 429 without `Retry-After`. Clients retry immediately and the shed load returns as a synchronized second wave.
- Counting requests instead of work at admission. One 100000-token prefill consumes the KV pool that hundreds of short chats would share; admit on tokens and KV, not on count.
- Half-opening the breaker with full traffic. One probe decides recovery; a flood of probes is just the outage again.

**Practice**

- [100 Days day24: burst shed and breaker drill](https://github.com/elizabetht/100-days-of-inference/blob/main/day24/routing-load-balancing-queueing.ipynb) - Part 4 burst replay with tier deadlines; Try These Experiments 2: circuit breaker that stops above queue 10 and drains below 5, measured on tails before and after one slowed replica. Match the drop and expiry counts first, then add a 429-with-Retry-After admission rule and show premium p95 back inside deadline.

**Stop when:** Your burst replay matches the drop and tier means, and a slowed replica trips the breaker instead of growing every queue.

<details>
<summary>Self-test</summary>

1. The queue is full and premium, standard and batch requests wait. Which drops first?
   - Expired and lowest-class work first: batch past its deadline, then standard over deadline, protecting premium inside 30s. Random drop would sacrifice premium equally.
2. What do the three breaker states do?
   - Closed passes requests and counts failures; open fails fast without touching the sick replica; half-open admits one probe, closing on success and reopening on failure.
3. Waiting-by-reason shows `deferred` climbing while `capacity` is flat. Shed harder or investigate?
   - Investigate. Deferred means LoRA budget, KV transfer or blocked status, which shedding does not fix; check adapter load, transfer health and blocked requests.
4. Why must retries carry a budget during a replica slowdown?
   - Each retry re-adds work the sick replica already holds, spreading its queue to healthy replicas. A capped budget plus an open breaker converts the slowdown into fast failures instead of fleet-wide queueing.

</details>

#### U8. Multi-tenant model and cache isolation, and prompt and trace privacy

**About 4 h** · **Target:** Explain

Topics: Multi-tenant model and cache isolation; Prompt, output and trace privacy

Sharing one fleet across tenants without boundaries turns every burst into everyone's incident, and every shared cache into a privacy review.

**You can now**

- Explain the three noisy-neighbor channels (KV memory, network, time-sharing) and which quota stops each.
- Choose quota, priority and bulkhead isolation per tier, and state what each costs.
- Define the prompt, output and trace retention policy: what is logged, salted, billed and deleted.

**Study**

1. [Multi-tenancy and isolation](https://mlsysbook.ai/vol2/inference/inference.html) (Machine Learning Systems, Volume 2 - Inference at Scale and Serving Fault Tolerance) - Multi-Tenancy and Isolation: the noisy-neighbor Example 1.18 with Table 35 (all tenants violated at 22 to 45ms) versus quotas in Example 1.19 with Table 36 (only the burster throttled); Listing 1 quota admission (`max_concurrent_requests`, `max_kv_cache_mb`, `max_qps`, `max_batch_tokens`; its own check reads `quota.max_concurrent`, a mismatch to fix in your port); max-min fairness in token rate; Table 37 priority tiers; the bulkhead Figure 20 with Example 1.20; Listing 2 model-load eviction guard (page read 2026-10-14).
2. [Tenant-aware model selection](https://www.oreilly.com/library/view/hands-on-llm-serving/9798341621480/) (Hands-On LLM Serving and Optimization - Chapters 3 and 4, serving system design) - Chapter 4, Implementing Model Selection (printed pp. 129-130): `choose_endpoint` with canary weight, tenant override `route["tenants"][tenant]["url"]`, and 404 on unknown model.
3. [vLLM prefix-cache salt](https://docs.vllm.ai/en/v0.31.0/serving/online_serving/openai_compatible_server/) (vLLM Online Serving, Architecture and Production Metrics) - Chat and Completions extra parameters: `cache_salt` (up to 1024 characters) salting the prefix cache against prompt guessing in multi-user environments.
4. [Security, compliance and data handling](https://www.baseten.co/inference-engineering/) (Inference Engineering - Chapter 7, Production) - Section 7.3.4 (printed p. 198): the three areas (user data, weights, infrastructure), the rule against storing inputs and outputs without a retention need, and data-residency routing; Section 7.4.3 (printed p. 203): server and audit logs as the observability record.

**Focus**

- Bursts propagate through three channels at once: long sequences swell KV and evict others, large responses saturate egress, and time-sharing adds variance. One quota on request count stops none of them; quota KV megabytes, token rate and concurrency together.
- Isolation is a ladder with explicit costs: quotas throttle the burster, priorities preempt for critical tiers, bulkheads dedicate replicas at idle cost. Soft quotas flex below 50% utilization and harden near 90%.
- Shared prefix state is a cross-tenant channel. Salt the cache per tenant and scope affinity keys by tenant and version, or a timing probe guesses another tenant's prompt.
- Retention is a design choice with a default of least data: log IDs, sizes, latencies and salted hashes for billing and debugging; keep raw prompts and outputs only with a declared need, owner and deletion path.

**Reproduce:** Closed-book, replay the two MLSys tables: ten tenants at 100 QPS each with one bursting to 500. Without quotas every tenant violates at 22 to 45ms; with quotas only the burster is throttled at 120 while the rest hold 10ms. Then list the four per-tenant observability dimensions.

**Traps**

- Treating equal request counts as fair shares. A long summarization tenant consumes the KV pool of many short-chat tenants; fairness is denominated in token-generation rate, not request count.
- Sharing one prefix cache across tenants for hit rate. Hits across tenants leak prompt bytes through timing; salt per tenant and accept the lower shared hit rate.
- Logging prompts to make debugging easy. The debug value is real and so is the breach surface; hash or drop raw text and keep the request ID as the join key.

**Practice**

- The section mini-project covers this: per-tenant quota admission from the MLSys quota listing, a salted-cache isolation test proving no cross-tenant prefix hit, and a cross-tenant key attack drill with first-cause evidence.

**Stop when:** You can replay both burst tables from memory and defend your retention policy field by field: logged, salted, billed or deleted.

<details>
<summary>Self-test</summary>

1. One tenant bursts 5x with no quotas. What happens to the other nine?
   - All violate: P99 climbs to 22 to 30ms against a 10ms contract while the burster itself hits 45ms. Shared pools propagate one burst to every tenant.
2. Same burst with quotas. Who sees what?
   - Only the burster is throttled (admitted at 120 with 50ms latency); the other nine hold 10ms. Quotas convert a fleet incident into one tenant's throttle.
3. Why is token-generation rate the fairness unit instead of request count?
   - KV bytes and decode steps scale with tokens, so equal counts let long requests starve short ones. Rate in tokens per second bounds throughput and memory together.
4. What are the four per-tenant observability dimensions?
   - Request volume with P50/P95/P99 latency, GPU and KV utilization, throttling and preemption counts, and errors by type. Without them a quota violation is invisible until it becomes an SLO breach.

</details>

#### U9. Per-request logs, metrics and traces, and engine and hardware telemetry

**About 4 h** · **Target:** Implement + Measure

Topics: Per-request logs, metrics and traces; Queue, phase, token, cache and scheduler telemetry; GPU, CPU, memory and network telemetry

Undashboarded serving is unoperated serving. The metric names, phases and trace joins chosen here become every later diagnosis.

**You can now**

- Emit per-request logs, metrics and traces joined by `request_id` that explain one request's TTFT and every decode gap.
- Build engine dashboards from queue, phase, token, cache and scheduler metrics with alerts on TTFT, KV pressure and stalls.
- Contrast vLLM and SGLang phase boundaries so dashboards survive an engine swap.

**Study**

1. [vLLM production metrics](https://docs.vllm.ai/en/v0.31.0/usage/metrics/) (vLLM Production Metrics) - General Metrics table (`vllm:num_requests_waiting`, `vllm:num_requests_running`, `vllm:kv_cache_usage_perc`, `vllm:prefix_cache_hits`, `vllm:request_success`, `vllm:time_to_first_token_seconds`, `vllm:request_queue_time_seconds`, `vllm:request_prefill_time_seconds`, `vllm:request_decode_time_seconds`, `vllm:e2e_request_latency_seconds`); MFU counters behind `--enable-mfu-metrics`; Deprecation Policy.
2. [vLLM metrics design and tracing](https://docs.vllm.ai/en/v0.31.0/design/metrics/) (vLLM Online Serving, Architecture and Production Metrics) - Scheduler Stats and Engine Core Events, KV Cache Residency Metrics (`vllm:kv_block_lifetime_seconds`, `vllm:kv_block_idle_before_evict_seconds`), and Tracing with `--otlp-traces-endpoint` plus `--collect-detailed-traces`.
3. [SGLang production metrics](https://docs.sglang.io/docs/references/production_metrics) (SGLang documentation - Production Metrics) - TTFT definition (streaming ends at first output after detokenization, which may hold no printable text; non-streaming ends at first scheduler token); request TPOT as `(finished_time - first_token_time) / (completion_tokens - 1)` with its four exclusions; the p95 TPOT PromQL example (page read 2026-10-14).
4. [AI Systems ch16 monitoring bundle and load harness](https://github.com/cfregly/ai-performance-engineering/tree/main/code/ch16) (AI Systems Performance Engineering - Production Inference Labs) - `monitoring_config.py` metric names with alert thresholds (TTFT p90 warn 0.6s, p99 crit 1.5s, KV warn 90% crit 98%, stalled floor 50); `vllm_monitoring.py` recording rules with `VLLMHighTTFTP90` alerts and Grafana panels; `inference_server_load_test.py` load harness feeding `capacity_planner.py`. Depth: Re-measure every bundled expectation on your hardware. The B200 numbers in the expectations files are the authors' results, not your targets.
5. [Production observability checklist](https://www.baseten.co/inference-engineering/) (Inference Engineering - Chapter 7, Production) - Section 7.4.3 (printed p. 203): volume, request and response sizes, response codes, latency as TTFT plus tokens per second plus end-to-end on P50/P90/P99, replica count, CPU, host memory, GPU and GPU-memory utilization, queue depth; server plus audit logs.

**Focus**

- One request, one ID, three signals: the log line carries `request_id` with queue, prefill, decode and stream timings; the histograms carry the same labels; the trace carries the same ID across frontend, scheduler and runner. Diagnosis starts by joining them.
- Queue versus execution is a metric pair, not a feeling: `vllm:request_queue_time_seconds` against `vllm:request_prefill_time_seconds` plus `vllm:request_decode_time_seconds`. TTFT alone cannot separate them.
- Gauges describe state (`vllm:num_requests_waiting`, `vllm:kv_cache_usage_perc`); counters describe events (`vllm:request_success`, token totals). Rate the counters, read the gauges, never the reverse.
- TTFT, TPOT and ITL are engine-defined. SGLang's streaming TTFT ends at first detokenized output (possibly empty text) while vLLM's measures first-token time; a dashboard that compares them across engines compares different quantities.

**Reproduce:** Under a short local load run, scrape `/metrics` before and after. Show `vllm:num_requests_waiting`, `vllm:kv_cache_usage_perc` and the `vllm:time_to_first_token_seconds` count moving with load, then pull one request's full timeline from logs by its `request_id`.

**Traps**

- Labelling metrics by prompt text or user ID. Cardinality explodes Prometheus; label by model, version and class, and join to raw text only through the request ID in logs.
- Timing decode with per-token host synchronization. The observer serializes the pipeline it measures; prefer engine histograms and sampled profiler ranges over naive timers.
- Treating `vllm:request_success` as a gauge. It is a cumulative counter split by `finished_reason` (`stop`, `length`, `abort`); alert on its rate, and count aborts as cancellations, not successes.

**Practice**

- [AI Systems ch16: monitoring bundle under load](https://github.com/cfregly/ai-performance-engineering/tree/main/code/ch16) - Deploy `vllm_monitoring.py` with `configs/vllm_monitoring.yaml` against a local vLLM server, drive `inference_server_load_test.py`, and satisfy the validation checklist in `README.md`. Show one alert (TTFT, KV or stalled) firing with its Grafana panel, and record exporter overhead beside the latency numbers.

**Stop when:** One request ID yields its full timeline across logs, metrics and traces, and your dashboard separates queue, prefill, decode and KV pressure without ambiguity.

<details>
<summary>Self-test</summary>

1. TTFT spikes but prefill time is flat. Queue or execution problem?
   - Queue. Flat prefill with rising TTFT means `vllm:request_queue_time_seconds` grew while execution held; add replicas or shed instead of tuning kernels.
2. How do you compute per-request decode tokens per second from SGLang's TPOT histogram?
   - Take the reciprocal of the TPOT quantile (p5 TPS equals 1 over p95 TPOT). The reciprocal of mean TPOT is not mean TPS; aggregate rates per request first.
3. Which requests never appear in SGLang's request-TPOT histogram?
   - Requests with fewer than two output tokens, streaming requests finishing in their first output, aborted requests and disaggregated prefill workers.
4. KV usage sits at 0.97 while TTFT p99 reaches 2s. Which ch16 alerts fire, and what do they mean together?
   - The KV warn alert (0.97 is above the 90% warn and below the 98% crit) and the TTFT p99 critical alert (2s against 1.5s). Together they point at memory pressure turning into queueing, not slow compute: shed, evict or add capacity.

</details>

#### U10. Quality, availability, latency and error SLIs, SLOs and error budgets

**About 3 h** · **Target:** Derive

Topics: Quality, availability, latency and error SLIs; SLOs, error budgets and goodput

Throughput without an SLO counts failures as output. Budgets turn latency, errors and quality into one decision currency: ship or harden.

**You can now**

- Define quality, availability, latency and error SLIs with windows and measurement points.
- Set tiered SLOs with error budgets, and state what consumes budget and what happens when it empties.
- Compute goodput (SLO-meeting, accepted-quality work) distinct from raw throughput.

**Study**

1. [Latency and throughput metrics done right](https://www.oreilly.com/library/view/hands-on-llm-serving/9798341621480/) (Hands-On LLM Serving and Optimization - Chapters 3 and 4, serving system design) - Chapter 4, Measuring Performance in LLM Serving (printed pp. 149-155): Latency Metrics with `E2E latency = TTFT + ITL x (N - 1)`; Throughput Metrics on why RPS is workload-sensitive and TPS counts output tokens only and inflates under short inputs; Best Practices (trade-off, latency goals, decompose, simulate real traffic, one knob at a time).
2. [Degradation monitoring](https://mlsysbook.ai/vol2/fault_tolerance/fault_tolerance.html) (Machine Learning Systems, Volume 2 - Inference at Scale and Serving Fault Tolerance) - Graceful Degradation, Degradation monitoring and alerting: Table 17 action map (fallback share above 5 minutes warns, default-feature share above 50% is critical, shed-rate growth triggers capacity review, primary-versus-fallback gap past 1 hour escalates) (page read 2026-10-14).
3. [Deployment health across regions](https://mlsysbook.ai/vol2/inference/inference.html) (Machine Learning Systems, Volume 2 - Inference at Scale and Serving Fault Tolerance) - Autoscaling and Global Infrastructure, Global model deployment: Table 48 Global Deployment Health Metrics (error below 0.1%, P99 within target and below twice single-region, quality within bounds across regions) (page read 2026-10-14).
4. [AI Systems tiered QoS gates](https://github.com/cfregly/ai-performance-engineering/tree/main/code/ch17) (AI Systems Performance Engineering - Production Inference Labs) - `early_rejection.py` `QoSController` tiers: TTFT SLO 200, 500 and 1000ms with TPOT 30, 50 and 100ms per token and max concurrency 50, 100 and 200 for premium, standard and free; `dynamo_config.yaml` early-rejection and cache-hit-ratio QoS block. Depth: Use the tier numbers as worked examples of SLO shape, not as your SLOs. Derive thresholds from your workload and the ch16 alert bands.
5. [vLLM error and quality counters](https://docs.vllm.ai/en/v0.31.0/usage/metrics/) (vLLM Production Metrics) - General Metrics: `vllm:request_success` by `finished_reason`, `vllm:corrupted_requests` for NaN-logit generations, `vllm:num_preemptions`, and `vllm:e2e_request_latency_seconds` as the latency-SLO histogram.

**Focus**

- Latency decomposes as $`\text{E2E} = \text{TTFT} + \text{ITL} \times (N - 1)`$. SLO each piece: queue-heavy TTFT and decode-heavy ITL fail for different reasons and page different owners.
- Goodput is $`G = T \times f_{\text{SLO}} \times f_{\text{quality}}`$: raw token throughput discounted by the in-SLO fraction and the accepted-quality fraction. Retried, shed and over-SLO tokens are cost, not output.
- Budgets are tiered because users are: premium buys 200ms TTFT with tight errors, free buys 1000ms with best effort. One fleet-wide SLO either over-delivers to free or starves premium.
- TPS flatters short inputs and uniform batches; RPS flatters short requests. SLOs pin distributions (p50/p95/p99) on fixed workload mixes so neither metric can be gamed by reshaping traffic.

**Reproduce:** From one load-test trace with raw per-request records, compute TTFT p50 and p99, mean TPOT, error rate and goodput at declared SLOs (for example TTFT p99 under 1.5s with under 0.1% errors). Show goodput below throughput by exactly the over-SLO plus error plus rejected-quality share.

**Traps**

- SLOing the mean. Means hide the p99 that users feel, and near saturation queueing delay grows like $`1/(1 - \rho)`$ with bursts landing in the tail first.
- Counting aborted and preempted requests as successes. `vllm:request_success` splits by `finished_reason`; aborts are cancellations and preemptions are scheduler work, and both leave goodput.
- Treating quality as latency's afterthought. NaN logits, template skew and quantization drift all pass latency SLOs while failing users; sample outputs against acceptance checks as a first-class SLI.

**Practice**

- [AI Systems ch17: tiered QoS gates](https://github.com/cfregly/ai-performance-engineering/tree/main/code/ch17) - Port `early_rejection.py` `QoSController` tiers into your gateway and demonstrate, under one pressure burst, a free-tier request rejected while a premium request passes with TTFT inside 200ms. Derive the tier thresholds from your unit-9 load trace, not from the file defaults. Record budget burn per tier during the burst.

**Stop when:** Your trace yields SLIs, tiered SLOs, budget burn and goodput from the same raw records, with no metric comparable across different workloads.

<details>
<summary>Self-test</summary>

1. A request generates 9 tokens with TTFT 0.4s and ITL 0.05s. What is its E2E latency?
   - $`0.4 + 0.05 \times (9 - 1) = 0.8`$s. TTFT covers the first token; each of the remaining 8 pays one ITL.
2. Throughput reads 1000 tokens/s but 5% of requests breach TTFT SLO and 2% fail quality checks. What is goodput?
   - About $`1000 \times 0.95 \times 0.98 = 931`$ tokens/s. The over-SLO and rejected-quality shares are cost, not useful work.
3. Why do premium and free tiers need different TTFT SLOs instead of one fleet SLO?
   - One SLO either wastes capacity over-delivering to free traffic or starves premium of its 200ms guarantee. Tiered SLOs with separate concurrency caps let each class buy its own latency.
4. The error budget empties two weeks into the quarter. What changes operationally?
   - Feature rollouts and risky config changes freeze; engineering time goes to reliability (capacity, rollback speed, flake removal) until burn stops and budget recovers.

</details>

#### U11. Worker, dependency, cache and bad-rollout failure injection

**About 5 h** · **Target:** Implement + Measure

Topics: Worker and GPU-process failure injection; Dependency delay and cache-degradation injection; Bad model or configuration rollout injection

Recovery is a tested path, not a hoped-for property. Each failure class needs a drill that proves detection, bounded blast radius and clean rejoin.

**You can now**

- Kill a worker process under load and show bounded detection, reroute and recovery with no cross-request corruption.
- Inject dependency delay and cache disablement and show the degradation ladder engaging instead of total failure.
- Ship a bad model or configuration version and roll it back on canary gates without corrupting request or KV state.

**Study**

1. [Serving fault tolerance](https://mlsysbook.ai/vol2/fault_tolerance/fault_tolerance.html) (Machine Learning Systems, Volume 2 - Inference at Scale and Serving Fault Tolerance) - Serving Fault Tolerance: Stateless vs. stateful serving with Table 12, Health checking with liveness plus readiness plus inference correctness, Table 13 stateful failover approaches, Table 14 serving recovery invariants, and Model-specific serving fault tolerance with the KV box (70B, 80 layers, 8 KV heads, 128K context at 128 dim BF16 near 43GB per conversation) (page read 2026-10-14).
2. [Graceful degradation](https://mlsysbook.ai/vol2/fault_tolerance/fault_tolerance.html) (Machine Learning Systems, Volume 2 - Inference at Scale and Serving Fault Tolerance) - Graceful Degradation: Definition 1.4 with the pre-engineered fallback requirement, Table 15 degradation dimensions, the Model fallback cascade (307M at 88% down to 5.4M at 75% then cached), Table 16 feature ladder, and Listing 1 trigger rules (page read 2026-10-14).
3. [vLLM disruption and corruption surfaces](https://docs.vllm.ai/en/v0.31.0/serving/online_serving/) (vLLM Online Serving, Architecture and Production Metrics) - Server in development mode (`VLLM_SERVER_DEV_MODE=1`, never for production): Cache Management APIs (`/reset_prefix_cache`, `/reset_mm_cache`, `/reset_encoder_cache`) marked as able to disrupt service, and `/abort_requests` under Weight Transfer APIs for in-flight abort; the Production Metrics page lists `vllm:corrupted_requests` for NaN-logit requests.
4. [Day 25 failover experiment](https://github.com/elizabetht/100-days-of-inference/blob/main/day25/multi-cloud-capacity.ipynb) (100 Days of LLM Inference - Days 22 to 26) - Try These Experiments 2: fail over 30% of one region and measure redirect plus latency against the active-active versus active-passive discussion. Depth: Run it as a paper drill on your topology first. Real multi-region failover waits for the distributed section.

**Focus**

- A kill proves nothing without traffic: the drill must exercise detection (probe thresholds), action (routing away) and state (session and KV fate). Stateless workers rejoin in milliseconds; stateful LLM sessions regenerate over seconds to minutes.
- A 43GB conversation KV cannot fail over in milliseconds. Budget the loss honestly: accept regeneration, checkpoint high-value sessions, replicate only what the product contract demands, and keep shared prefixes separate from session state.
- Degradation is a ladder built before the incident: smaller model, default features, cached content, then shed load. Each rung needs a measured quality cost and a trigger rule, or operators will not pull it.
- The NaN-logit counter only exists when `VLLM_COMPUTE_NANS_IN_LOGITS` is set, and the cache-reset endpoints disrupt service by design. Silent GPU degradation is caught by the deep inference-health probe, not by process liveness.

**Reproduce:** With two local engine processes behind your router (size each with a small `gpu_memory_utilization` so both fit on your GPU, or run the survivor as a stub) and a steady burst running, SIGKILL one engine mid-burst. Show the health check marking it unhealthy within its thresholds, traffic moving to the survivor, in-flight requests on the dead worker reported failed rather than hung, and clean rejoin after restart.

**Traps**

- Testing failover with an idle standby and no load. Detection latency, queue transfer and KV rebuild only appear under traffic; idle drills certify the easy half.
- Reaching for `/reset_prefix_cache` to simulate degradation in a shared server. It disrupts every tenant's cache by design; scope cache drills to a sacrificial instance.
- Treating a restarted worker as a recovered session. The process is back but conversation KV is gone; clients must see a declared state-loss path, not silent context amnesia.

**Practice**

- The section mini-project covers this: worker-death drill with bounded detection and rejoin, dependency-delay and cache-disablement drills up the degradation ladder, and a bad-version rollout with canary-gated rollback, each with stored evidence.

**Stop when:** Each failure class has a drill with detection time, blast radius and recovery evidence, and no drill corrupts another tenant's requests or cache.

<details>
<summary>Self-test</summary>

1. Why does killing an LLM worker hurt more than killing a stateless classifier replica?
   - The classifier holds no per-request state, so any replica retries in milliseconds. The LLM worker holds KV cache and session context (tens of GB), which must regenerate over seconds to minutes or restore from a checkpoint.
2. Dependency latency triples. Which degradation rung fires first, and what proves it worked?
   - Feature fallback first (cached or default features per the MLSys feature degradation tiers), then model fallback, then shedding. The degradation action map proves it: fallback share, default-feature share and shed rate each stay inside their alert bands.
3. A bad config ships to 5% and p99 doubles with flat errors. Which prior unit's machinery stops it?
   - The canary tail gate (p99 below 1.5 times baseline) rolls it back, and rollback restores the full tuple: weights, template, config and routing.
4. The process is alive but outputs are garbage after a GPU fault. Which probe catches it?
   - Only the deep inference-health probe with a known input and sane-output bounds. Liveness and readiness both pass while the model computes nonsense.

</details>

#### U12. Seeded incidents, runbooks, first-cause timelines and recovery load tests

**About 5 h** · **Target:** Measure

Topics: Seeded performance and security incident diagnosis; Runbooks and first-cause timelines; Saturation, recovery and rollback load tests

The section checkpoint is met here: under saturation, cancellation, worker death and bad rollout, the learner still diagnoses from evidence and recovers cleanly.

**You can now**

- Diagnose one seeded performance incident and one seeded lifecycle or security incident from stored evidence alone.
- Write runbooks with first-cause timelines that a second operator can execute.
- Run saturation, recovery and rollback load tests and show capacity returning without state corruption.

**Study**

1. [Day 26 seeded regression and drain](https://github.com/elizabetht/100-days-of-inference/blob/main/day26/zero-downtime-deployment.ipynb) (100 Days of LLM Inference - Days 22 to 26) - Part 2 Scenario B as the seeded performance incident (nominal p99 380, 420 and 820ms plus Gaussian noise, printed as 397, 417 and 815ms against the 500ms baseline with flat errors, rollback at 5%); Part 4 `GracefulShutdown` drain as the recovery procedure; Part 3 cost-per-million-tokens table for the recovery capacity plan. Depth: Treat the notebook outputs as stored evidence for timeline practice. Derive your own gate numbers from your workload; the 500ms baseline is the notebook's, not yours.
2. [Degradation monitoring and post-incident questions](https://mlsysbook.ai/vol2/fault_tolerance/fault_tolerance.html) (Machine Learning Systems, Volume 2 - Inference at Scale and Serving Fault Tolerance) - Graceful Degradation, Degradation monitoring and alerting: Table 17 action map with its four post-incident questions (root cause, fallback effectiveness, user impact, improvements) (page read 2026-10-14).
3. [Deployment health and cross-user failure](https://mlsysbook.ai/vol2/inference/inference.html) (Machine Learning Systems, Volume 2 - Inference at Scale and Serving Fault Tolerance) - Autoscaling and Global Infrastructure, Global model deployment: Table 48 Global Deployment Health Metrics; Load Balancing and Request Routing, Consistent hashing for stateful routing: War Story 1.1 (shared client state leaking responses across users, March 2023) as the security-timeline example (page read 2026-10-14).
4. [Project 103 troubleshooting runbook scaffold](https://github.com/ai-infra-curriculum/ai-infra-engineer-learning/blob/main/projects/project-103-llm-deployment/docs/TROUBLESHOOTING.md) (AI Infrastructure Engineer Learning - Project 103 LLM Deployment) - Sections 5 (GPU cache and preemption signals), 6 (SSE drops and proxy timeouts), 7 (probe paths), 9 (scaling signals) and 10 (shed rule): use as runbook headings, and verify each command against your manifests before trusting it.
5. [vLLM recovery evidence](https://docs.vllm.ai/en/v0.31.0/usage/metrics/) (vLLM Production Metrics) - Recovery load-test evidence: `vllm:num_requests_waiting` and `vllm:num_requests_running` returning to baseline, `vllm:kv_cache_usage_perc` draining, latency histograms back inside SLO, and `vllm:request_success` by `finished_reason` accounting every in-flight request.

**Focus**

- A timeline entry is a timestamp plus the metric or log line that proves it. Narrative without evidence is a story; the MLSys action-map questions (root cause, fallback value, impact, improvements) each need a cited reading.
- First cause is the earliest evidenced deviation, not the proved root cause. Scenario B's first cause is a version-correlated p99 breach at the 5% step; the mechanism waits for a profile.
- Recovery is declared on distributions returning inside bounds: p99, queue depth, KV usage and error classes, plus passing inference-health probes. Falling averages alone can hide a stuck tail.
- Security incidents need isolation fixes, not capacity. A cache-timing prompt guess or a cross-user leak is closed by salting, scoping and key drills, and the timeline must show the attack stopped, not just the traffic.

**Reproduce:** Take the day26 Scenario B outputs as stored evidence. Write the timeline (first anomaly, gate breach, rollback decision), name the first cause with the metric that proves it, and list one blind spot the stored evidence cannot answer.

**Traps**

- Diagnosing from the live system instead of stored evidence. Live state has already moved on; the discipline is reconstructing from retained logs, metrics and traces only.
- Writing a runbook only its author can run. Every step needs the literal command, the expected output and the abort condition, or the second operator improvises under pressure.
- Closing a security incident on latency recovery. Prompt-leak and cross-tenant drills pass only with attack-stopped evidence: repeated probes after the fix that return no foreign bytes.

**Practice**

- [100 Days day26: seeded diagnosis and recovery](https://github.com/elizabetht/100-days-of-inference/blob/main/day26/zero-downtime-deployment.ipynb) - Scenario B as stored evidence for a first-cause timeline with one named blind spot; Part 4 `GracefulShutdown` drain plus the Part 3 capacity table as the executed recovery with costed capacity. Write the timeline before re-reading the scenario code. Then run the drain and show waiting, running and KV evidence returning to baseline.

**Stop when:** Your Scenario B timeline cites evidence per entry with one blind spot, and your recovery run shows distributions back inside bounds with every request accounted.

<details>
<summary>Self-test</summary>

1. Scenario B's errors stay flat while p99 breaches at the 5% step. What is the first cause, and what remains unknown?
   - First cause: version-correlated tail regression in the new build at 5% traffic, evidenced by the printed p99 of 815ms (nominal 820ms) against the 750ms gate with flat errors. Unknown: the mechanism (decode path, template, config) until a profile separates them.
2. What declares the recovery load test passed?
   - Saturation, then rollback and drain, then waiting and running counts back to baseline, KV usage drained, latency histograms inside SLO, every in-flight request accounted by finished reason, and inference-health probes passing.
3. What does the MLSys War Story 1.1 timeline teach about shared state?
   - Shared client and pool state turned one user's response into another's: isolation of caches, pools and keys is a correctness boundary, and cross-user drills belong in the fault campaign.
4. A runbook step says to restart the slow replica. What is missing?
   - The literal command, the expected output, the abort condition if output differs, and the evidence to retain. Without those the second operator cannot execute or audit the step.

</details>

### Mini-project: Reliable gateway with quotas, shedding and recovery drills

**About 12 to 16 hours.** Build the `gateway/` around a fitting engine with auth, quotas, routing, shedding, telemetry, SLOs, canary and runbooks. Fault drills prove bounded detection and clean recovery before fleet scale.

1. Serve typed chat completions with SSE down to `[DONE]`, per-request queue backpressure and a small fixed-schema structured output, checked against the ch03 stream tests and a vLLM stream. Keep raw bytes and reassembly.
2. Add API-key auth, a token-bucket limiter with `Retry-After`, deadline propagation with upstream close, idempotent retries by `x-request-id`, and allow-listed media fetch, passing the Project 103 suite. Keep limiter and dedupe tests.
3. Implement token-aware and prefix-hash routing with adapter affinity and `FailOpen` fallback, plus work-based admission with priority shedding and a budgeted breaker, checked against the day24 routing and burst drills. Keep replay counts and tail evidence.
4. Split cold start into provision, load and warmup with liveness, readiness and inference-health probes and drain, then run a canary with rollback on error and tail gates, sized by compatibility, replica and reserve math from the day26 drills. Keep timings and gate evaluations.
5. Enforce per-tenant quotas with salted prefix isolation and a cross-key attack drill, emit per-request logs, metrics and traces joined by `request_id`, and compute tiered SLOs with budget burn and goodput from raw records using the ch16 and ch17 bundles. Keep isolation and dashboard evidence.
6. Kill a fitting engine under load to show bounded detection, reroute and rejoin, climb the degradation ladder through dependency and cache drills, roll back a bad version on canary gates, and write runbooks with first-cause timelines proven by recovery load tests. Keep all drill evidence.

**Deliverables**

- `gateway/` with auth, quotas, routing, shedding, probes, canary and SLO dashboards plus tests.
- Isolation, telemetry and fault evidence: salted-cache tests, attack drill, traces and budget burn.
- Runbooks with first-cause timelines and recovery load-test evidence showing clean return to SLO.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [llm-model-inference ch03 streaming tests](https://github.com/orca3/llm-model-inference/blob/main/ch03/single_model_llm_serving/tests/test_api.py). Assert stream framing and concurrent isolation; then assert `[DONE]` on vLLM.
- external-tests: [Project 103 API and middleware tests](https://github.com/ai-infra-curriculum/ai-infra-engineer-learning/blob/main/projects/project-103-llm-deployment/tests/test_api.py). Pass all seven stubbed tests for auth, limits and streaming.
- external-tests: [100 Days day24 routing and burst](https://github.com/elizabetht/100-days-of-inference/blob/main/day24/routing-load-balancing-queueing.ipynb). Run routing, hash-ring and burst drills; port the ring to gateway.
- external-tests: [100 Days day26 canary and recovery](https://github.com/elizabetht/100-days-of-inference/blob/main/day26/zero-downtime-deployment.ipynb). Rerun canary scenarios and drain; write timelines from stored evidence.
- external-tests: [AI Systems ch16 monitoring bundle](https://github.com/cfregly/ai-performance-engineering/tree/main/code/ch16). Deploy monitors under load and show one alert with overhead.
- external-tests: [AI Systems ch17 QoS gates](https://github.com/cfregly/ai-performance-engineering/tree/main/code/ch17). Port tiered gates and show premium passing under pressure.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Gateway and routing | Stream suites pass with `[DONE]` reassembly, limiter and dedupe tests pass, and routing with shedding shows tiered burst protection. | A slow-reader case grows queues without pausing generation, and breaker trips are measured. |
| Isolation and SLOs | Quota and salted-cache tests show no cross-tenant hit, telemetry joins by `request_id`, and SLOs with goodput come from raw records. | The key attack drill names first cause, and tier burn is tracked through the burst. |
| Failure and recovery | Worker, dependency, cache and bad-version drills store detection and recovery evidence, and runbooks with timelines execute cleanly. | Recovery load tests return queues, KV and tails inside SLO with every request accounted. |

Feeds into: `gateway/` with SLOs, isolation evidence and runbooks feeds capacity planning and the capstone operations package.

### Resource route

- **Primary - Documentation:** [vLLM Online Serving, Architecture and Production Metrics](https://docs.vllm.ai/en/v0.31.0/serving/online_serving/) - Trace the API server, engine core, scheduler, KV manager and model runner, then map documented metrics to your SLIs. The link is pinned to v0.31.0; add the auth, tenant, quality and rollout controls the engine leaves to you.
- **Required - Book:** [Hands-On LLM Serving and Optimization - Chapters 3 and 4, serving system design](https://www.oreilly.com/library/view/hands-on-llm-serving/9798341621480/) - Read Chapter 3 (an online service from scratch, batching with streaming, multi-model trade-offs) and the enterprise-architecture part of Chapter 4. Convert the designs into explicit request, model-lifecycle and failure state machines.
- **Required - Reference:** [vLLM Production Metrics](https://docs.vllm.ai/en/v0.31.0/usage/metrics/) - Define every selected queue, cache, phase and request metric, check histogram buckets and measure exporter overhead. Add model version, cancellation, rejection, quality sample and tenant-safe trace fields in the surrounding service.
- **Required - Theory:** [Machine Learning Systems, Volume 2 - Inference at Scale and Serving Fault Tolerance](https://mlsysbook.ai/vol2/inference/inference.html) - Read "Load Balancing and Request Routing", "Multi-Tenancy and Isolation" and "Autoscaling and Global Infrastructure" in Inference at Scale, then "Serving Fault Tolerance" and "Graceful Degradation" in the Fault Tolerance chapter.
- **Support - Book:** [Inference Engineering - Chapter 7, Production](https://www.baseten.co/inference-engineering/) - Read Chapter 7 for containers, autoscaling, cold starts, routing and queueing, zero-downtime deployment, cost estimation and client-side streaming. Skip the vendor section at its end.
- **Required - Reference:** [Gateway API Inference Extension](https://gateway-api-inference-extension.sigs.k8s.io/) - Study model-aware routing, endpoint selection and operational integration. Use it for architecture and an optional local deployment only after the service passes lifecycle and failure tests without Kubernetes.
- **Support - Reference:** [SGLang documentation - Production Metrics](https://docs.sglang.io/docs/references/production_metrics) - Compare its metric names and phase boundaries with vLLM's, so your dashboards do not depend on one engine's vocabulary.
- **Required - Lab:** [AI Systems Performance Engineering - Production Inference Labs](https://github.com/cfregly/ai-performance-engineering/tree/main/code) - Use Chapter 16 monitoring, cache health, capacity planning and load-test utilities, then Chapter 17 routing only if distributed. Add process death, overload and bad-version cases that the performance pairs do not cover.
- **Support - Practice:** [100 Days of LLM Inference - Days 22 to 26](https://github.com/elizabetht/100-days-of-inference) - Use the container, autoscaling, routing, capacity and zero-downtime notebooks as small operational simulations. Replace calendar order and fixed scale targets with the stage checkpoint and your hardware limits.
- **Support - Project:** [AI Infrastructure Engineer Learning - Project 103 LLM Deployment](https://github.com/ai-infra-curriculum/ai-infra-engineer-learning/tree/main/projects/project-103-llm-deployment) - Use its Docker, API, monitoring, Kubernetes and cost files as scaffolding only. Check its resource assumptions against your own model and GPU, and rerun any benchmark before reusing a result.
- **Support - Project:** [LLM Inference Systems Laboratory - Operations and Failure](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/capstones/llm-inference-systems-laboratory.md) - Complete production gateway, isolation, telemetry, canary, drain, rollback and fault campaigns. Store first-cause timelines and revise runbooks from observed blind spots.
- **Reference - Reference:** [OpenAI API Reference - streaming, auth, rate limits and request IDs](https://developers.openai.com/api/reference/overview) - Read the chat streaming event shape with the `[DONE]` terminator, bearer auth, rate-limit headers, and `x-request-id` with caller-supplied `X-Client-Request-Id`. vLLM is the implementation under test; use this only for the contract it claims compatibility with.
- **Reference - Reference:** [vLLM Multimodal Inputs - media validation, fetch policy and cache identity](https://docs.vllm.ai/en/v0.31.0/features/multimodal_inputs/) - Read Online Serving for image, video and audio inputs: `--allowed-media-domains`, fetch timeouts, `--limit-mm-per-prompt`, local-media path restriction, and media UUIDs for cache identity. The link is pinned to v0.31.0.

### Exit checkpoint

Meet the request and isolation contract under saturation, cancellation, worker death and bad rollout, then diagnose one seeded performance incident and one lifecycle or security incident from stored evidence and execute a clean drain and rollback.

<details>
<summary>Deliberately left for later</summary>

- Large Kubernetes deployment before the local service is operable
- Multi-region resilience before one-region recovery and rollback pass
- Private prompt or output capture in unrestricted telemetry

</details>

## INF-9. Capacity, Economics and Engine Extension

**Why:** The final stage turns mechanisms into engineering judgment. You must reconstruct an unfamiliar engine, change one real path and defend its benefit, cost, failure behavior and losing regimes under governed benchmarks.

### Learn this much

- [ ] Benchmark question and decision owner _(Required)_
- [ ] Immutable model, engine, hardware and workload manifest _(Required)_
- [ ] Tuning traces versus final traces _(Required)_
- [ ] Offered versus completed load _(Required)_
- [ ] Throughput versus SLO goodput _(Required)_
- [ ] Utilization versus useful work _(Required)_
- [ ] Cost per input, output and accepted token _(Required)_
- [ ] Quality acceptance and retry cost _(Required)_
- [ ] Warmup, cache state and arrival-process fairness _(Required)_
- [ ] Raw per-request trace retention _(Required)_
- [ ] p50, p95 and p99 with uncertainty _(Required)_
- [ ] Capacity-planning headroom under demand growth _(Required)_
- [ ] Three workload and SLO scenarios _(Required)_
- [ ] Engine API and tokenizer path reconstruction _(Required)_
- [ ] Scheduler and request-state reconstruction _(Required)_
- [ ] Block manager and prefix-cache reconstruction _(Required)_
- [ ] Model runner and attention-backend reconstruction _(Required)_
- [ ] Sampling, streaming and cleanup reconstruction _(Required)_
- [ ] Distributed worker and telemetry reconstruction _(Required)_
- [ ] Contribution hypothesis and predicted boundary _(Required)_
- [ ] One scheduler, cache, routing, instrumentation or kernel change _(Required)_
- [ ] Reference fallback and versioned configuration _(Required)_
- [ ] Unit, property, integration and regression tests _(Required)_
- [ ] Correctness, quality and failure protection _(Required)_
- [ ] Strong baseline and comparable tuning _(Required)_
- [ ] At least three mechanism-isolating ablations _(Required)_
- [ ] At least three informative workload regions _(Required)_
- [ ] Neutral or negative result preservation _(Required)_
- [ ] Bottleneck-shift explanation _(Required)_
- [ ] Capacity and cost decision _(Required)_
- [ ] Independent reproduction package _(Required)_
- [ ] Technical design defense _(Required)_
- [ ] Second model family or hardware generation validation _(Optional)_
- [ ] Upstream-quality patch and external review _(Optional)_
- [ ] Energy and carbon accounting alongside cost _(Optional)_
- [ ] Research proposal grounded in the measured mechanism boundary _(Depth)_
- [ ] Broad engine rewrite instead of a bounded reviewable contribution _(Later)_

### Study units

#### U1. The benchmark question, its decision owner and an immutable manifest

**About 4 h** · **Target:** Explain + Implement

Topics: Benchmark question and decision owner; Immutable model, engine, hardware and workload manifest; Tuning traces versus final traces

Build on Manifests, claim schemas, predictions declared first and artifact lineage. The new contract must support a serving decision, not just reproduce a device timing.

**You can now**

- Turn a serving benchmark into a decision with an owner, two alternatives and a reversal condition.
- Extend your experiment manifest to bind request semantics, quality, failures and cost to each result.
- Separate tuning traffic from a frozen final evaluation corpus before selecting configurations.

**Study**

1. [The optimization plan before the benchmark](https://www.oreilly.com/library/view/hands-on-llm-serving/9798341621480/) (Hands-On LLM Serving and Optimization - Chapters 8 and 9, frameworks and optimization in practice) - Chapter 9, LLM Serving Optimization Plan, printed pp. 294 to 296; Step 2: Generate Benchmark Traffic, pp. 297 to 300. Depth: Read the workflow, not the hardware setup commands. Replace the worked model and deployment with a small model that fits your GPU; keep distributed variants as reading.
2. [Bind experiments to their serving contract](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/capstones/llm-inference-systems-laboratory.md#architecture-constraints) (LLM Inference Systems Laboratory - Full Capstone) - Core requirements: recorded workload corpus; Architecture constraints: versions, tuning versus final traces and hardware tier; Milestone C: hypothesis and reversal conditions.

**Focus**

- Name the decision owner and the action the evidence can change: retain the baseline, enable the contribution or add capacity. Set correctness and SLO gates before tuning.
- Bind model, tokenizer, template, adapter, weight and KV precision, engine revision, effective configuration, hardware state and workload hashes to the run.
- Retain intended arrival times, output limits, stop rules, tenant scope, deadlines, retry policy and quality evaluator. A prompt list alone is not a workload.
- Split by sessions or shared-prefix groups where leakage is possible. Freeze final traces and transformations before configuration selection.

**Reproduce:** Without notes, write a decision record and manifest for your existing `servelab` baseline. Give each tuning and final corpus a digest. Change the output stop rule in a second record and verify that the workload identity changes rather than silently reusing the first result.

**Traps**

- A package version does not identify a locally patched engine. Record the source revision and patch digest too.
- Selecting a configuration after inspecting final traces turns them into tuning data. Acquire a new final set before making a generalization claim.
- Calling synthetic prefix repetition representative of demand. It isolates reuse; it does not supply production arrival or length distributions.

**Practice**

- The section mini-project covers this: the `servelab` decision record, immutable experiment manifests and separate tuning and final traces.

**Stop when:** Your decision record names two alternatives and a reversal condition, and a changed request contract cannot reuse an old manifest identity.

<details>
<summary>Self-test</summary>

1. What makes a benchmark question actionable?
   - An owner, a choice between alternatives, fixed correctness and SLO constraints, and an observation that would reverse the choice.
2. Why is freezing prompts insufficient?
   - Tokenization, arrivals, output lengths, stopping, cache state, retries and evaluation can change the work even when prompt text stays fixed.
3. May the final workload use the same length distribution as tuning?
   - Yes. The distributions can match, but final requests or sessions must not have been used to select the configuration. Record any intended distribution shift separately.

</details>

#### U2. Offered and completed load, goodput and useful work

**About 4 h** · **Target:** Derive + Measure

Topics: Offered versus completed load; Throughput versus SLO goodput; Utilization versus useful work

Build on Benchmark scenarios, MLPerf boundaries and endpoint goodput. Here you audit the engine's accounting and use it to locate sustainable serving capacity.

**You can now**

- Reconcile offered, admitted, completed, failed and pending work from one trace boundary.
- Compute request and token goodput under a fixed quality and latency contract.
- Explain a utilization increase that does not increase useful completed work.

**Study**

1. [Audit throughput and the traffic boundary](https://www.oreilly.com/library/view/hands-on-llm-serving/9798341621480/) (Hands-On LLM Serving and Optimization - Chapters 8 and 9, frameworks and optimization in practice) - Chapter 9, Step 3: Define Evaluation Metrics, printed pp. 300 to 301; Step 5: Benchmark the Qwen3 Model with vLLM, pp. 302 to 303. Depth: Use the two workload reports as accounting examples, not a controlled cache ablation: their length distributions and request rates differ. Do not infer cache benefit from their total-token throughput ratio.
2. [Capacity subject to per-request service quality](https://arxiv.org/html/2407.07000v2#S4.SS2) (Etalon: Holistic Performance Evaluation Framework for LLM Inference Systems) - arXiv:2407.07000v2, Sections 2.2, 3.1 and 4.2: metric boundaries, hidden stalls and Evaluation workflow and implementation (the Capacity Evaluation paragraph).

**Focus**

- Use the same observation interval for rates. Also report an arrival cohort followed to terminal outcomes; a drain interval must not be silently counted as offered-load time.
- Define request goodput as quality-accepted completions satisfying all declared request SLOs per second. Token goodput counts only the accepted outputs of those requests, using one tokenizer.
- Capacity is a sustainable offered rate satisfying the target success fraction without persistent queue growth. It is not the maximum observed completion rate during a drain.
- Device busy time, padding, recomputation and rejected output can increase utilization without increasing useful work. Use correlated request and iteration traces to distinguish them.

**Reproduce:** Recount one `servelab` trace closed-book. For a CPU-checkable fixture, offer 100 unique requests in 10 seconds with no initial queue: 70 succeed, 10 fail, 10 are rejected and 10 remain pending at the boundary. Of the successes, 50 pass both quality and SLO gates and each returns 20 accepted output tokens. Obtain 10 offered requests/s, 7 successful completions/s, 5 good requests/s and 100 good output tokens/s; account for every request once.

**Traps**

- Calling the configured request rate the actual offered rate when client concurrency limits delay sending. Retain intended and actual send times.
- Counting cached input tokens as executed prefill work. Logical input throughput and computed-token throughput need separate counters.
- Dropping timeouts from the denominator. They are demand and service failures, not missing observations.

**Practice**

- The section mini-project covers this: the `servelab` raw-outcome reconciliation and offered-load sweep with quality- and SLO-aware goodput.

**Stop when:** Every offered request is accounted for, and you identify a sustainable load point from success fraction, goodput and queue growth rather than utilization alone.

<details>
<summary>Self-test</summary>

1. Can completed load briefly exceed offered load?
   - Yes, when an earlier backlog drains. Report the initial and final backlog and use a common time boundary.
2. Does higher device utilization prove a useful throughput gain?
   - No. Padding, retries or recomputation can keep the device busy. Valid accepted completions and their SLOs determine useful work.
3. Is request goodput multiplied by mean output length always token goodput?
   - Only if that mean is taken over the same good requests with the same tokenizer and interval. A mean over all completions can give a different value.

</details>

#### U3. Cost per token, quality acceptance, retry cost and energy

**About 4 h** · **Target:** Derive

Topics: Cost per input, output and accepted token; Quality acceptance and retry cost; Energy and carbon accounting alongside cost

Build on Unit cost, headroom and simpler designs. Token counts now need quality, retry and allocation rules before they can support an economic comparison.

**You can now**

- Derive input, output and quality-accepted output unit costs with explicit allocation rules.
- Account for failed attempts, retries, idle capacity and failure reserve in serving cost.
- Optionally derive joules and operational carbon per useful output with an explicit measurement boundary.

**Study**

1. [Lifetime serving economics](https://mlsysbook.ai/vol2/inference/inference.html) (Machine Learning Systems, Volume 2 - The Economics and Architecture of Inference) - Inference at Scale, Serving cost can dominate training cost: Napkin Math 1.1 and equation 2; The serving hierarchy (page read 2026-10-14). Depth: Stop before Serving Architecture Dimensions. Treat the monetary examples as assumed scenarios, not current prices or measurements.
2. [Quality, retries and cost belong to one planner](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/capstones/llm-inference-systems-laboratory.md#measurement-requirements) (LLM Inference Systems Laboratory - Full Capstone) - Core requirements: analytical planner; Architecture constraints: correctness and quality; Failure-injection requirements: retry storm; Measurement requirements: quality and cost/token/request.
3. [Optional energy and operational carbon boundary](https://mlsysbook.ai/vol2/sustainable_ai/sustainable_ai.html#sec-sustainable-ai-energy-measurement-techniques-590e-techniques-590e) (Machine Learning Systems, Volume 2 - Sustainable AI) - Energy measurement techniques: Hardware power counters and System-level energy profiling; Carbon Footprint Calculation: Operational carbon calculation, equation 11 (page read 2026-10-14). Depth: Optional: read the measurement and unit-conversion method only. Do not adopt the chapter's hardware power estimates or fleet results.

**Focus**

- For total interval cost $`C`$, report $`C/N_{\text{in}}`$, $`C/N_{\text{out}}`$ and $`C/N_{\text{accepted}}`$ as separate normalizations, not additive charges. Splitting input and output charges requires an explicit allocation policy.
- Sum costs over every attempt for a logical request; count its accepted output once. Retry amplification depends on failure correlation, backoff, deadline and attempt cap.
- Keep quality acceptance separate from speculative draft-token acceptance. A verified draft token is not evidence that an answer meets the application's quality gate.
- Optional: integrate measured power over the same interval as accepted work. GPU energy alone is not total IT energy; facility overhead and grid intensity are assumptions unless measured.

**Reproduce:** Derive a synthetic accounting example without notes: an interval costs 12 currency units, processes 6000 input tokens and generates 3000 output tokens across all attempts, of which 2000 are quality-accepted useful output tokens. Obtain 0.002 per input token, 0.004 per generated output token and 0.006 per accepted token. With independent attempts of constant cost $`c`$, success probability $`p`$ and unlimited retries, derive expected cost $`c/p`$; state why bounded deadlines and correlated failures require a different model. Optional: a constant 100 W over 10 seconds is 1000 J, or 0.5 J per accepted token for this fixture.

**Traps**

- Dividing only successful-attempt cost by accepted output. Failed attempts and provisioned idle time still consume budget.
- Comparing token costs across tokenizers as if tokens were identical work. Use the same text tasks and quality gate; report tokenizer identity.
- Applying facility overhead twice or to GPU energy alone and calling it a measured facility footprint. State what is missing.

**Practice**

- The section mini-project covers this: the `servelab` attempt-cost ledger and quality-accepted output denominator, with optional energy/carbon accounting.

**Stop when:** Your cost table reconciles all attempts and idle/reserve charges, counts accepted work once and states the units and allocation boundary of every denominator.

<details>
<summary>Self-test</summary>

1. May input-normalized and output-normalized total costs be added?
   - No. Each uses the same numerator. Adding them double counts cost; additive input/output prices need an allocation or billing rule.
2. When does expected retry cost equal $`c/p`$?
   - For independent, identically distributed attempts, constant per-attempt cost, positive success probability and unlimited retries. Deadline caps and correlated failures invalidate that shortcut.
3. What if no output passes the quality gate?
   - Cost per accepted token has no finite value. Report zero accepted output and the spent cost; do not replace the denominator with generated tokens.
4. How do you convert energy to operational carbon?
   - Multiply facility energy in kWh by the corresponding grid intensity in mass per kWh. Apply facility overhead once if starting from complete IT energy; report embodied carbon separately.

</details>

#### U4. Fair warmup and arrivals, raw traces and tail percentiles with uncertainty

**About 4 h** · **Target:** Measure

Topics: Warmup, cache state and arrival-process fairness; Raw per-request trace retention; p50, p95 and p99 with uncertainty

Build on Auditing benchmarks: timing, baselines, parity and cherry-picking. Shared queues and prefix caches make serving requests dependent, so uncertainty needs a serving-specific sampling unit.

**You can now**

- Run paired serving trials with matched arrivals, cache policy, output contract and warmup boundary.
- Regenerate latency and goodput summaries from raw per-request records, including failures.
- Report p50, p95 and p99 with uncertainty that respects trial or session dependence.

**Study**

1. [Benchmark state and endpoint boundary](https://nvidia.github.io/TensorRT-LLM/developer-guide/perf-benchmarking.html) (TensorRT-LLM Benchmarking Guide) - TensorRT-LLM commit cc63e66: Before Benchmarking; Preparing a Dataset; Online Serving Benchmarking; Startup Metrics (page read 2026-10-14). Depth: Read as governance, not commands to change device settings. Record your GPU's clock, power and thermal state; separate startup and warm serving results.
2. [Retain the request evidence and observer control](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/capstones/llm-inference-systems-laboratory.md#milestone-b--instrumentation) (LLM Inference Systems Laboratory - Full Capstone) - Milestone B: correlated events, observer overhead, raw timestamps and decode gaps; Milestone E: open-loop final workloads.
3. [Resampling independent experimental units](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.bootstrap.html) (SciPy bootstrap confidence intervals) - SciPy 1.18.0: Opening resampling procedure; Parameters: statistic, paired, method and rng; Notes: degenerate data; Examples: difference between means and paired-sample statistics (page read 2026-10-14). Depth: Skip plotting and Array API support. Use the procedure on independent replay trials or justified blocks, not on individual dependent tokens.

**Focus**

- Warmup ends at a declared readiness condition. Reset or prepopulate caches identically according to the experiment question; cold cache and cold model startup are different states.
- Randomize off/on order within replay pairs. Keep intended arrivals fixed, record actual sends and retain client delays so a concurrency cap cannot conceal overload.
- Keep arrival, admission, first-content, stream-chunk, completion and terminal-error records with token counts and request identity. Client chunk timestamps are not necessarily individual token timestamps.
- Declare the quantile estimator and the population: request TTFT, request TPOT or token gaps. Resample whole independent trial pairs, recomputing the chosen statistic; report sample counts and sparse-tail limitations.

**Reproduce:** Without notes, reconstruct p50, p95 and p99 and goodput from one stored replay, stating clock and timing boundaries. Then resample independent off/on trial pairs with replacement and recompute the difference in the chosen percentile for each resample. Keep the same pair indices for both variants. Save the seed, quantile method and resampling unit; demonstrate that duplicating a request identifier causes your reconciliation check to fail.

**Traps**

- Computing percentiles of batch means and calling them request percentiles. Aggregation has changed the population.
- Using more bootstrap resamples to compensate for too few tail observations. Resampling cannot invent an unseen tail.
- Filtering failed requests and presenting the remaining latency distribution as all-user service quality. Report failures and censoring alongside successful latencies.

**Practice**

- The section mini-project covers this: the `servelab` paired replay campaign, retained raw traces and percentile/uncertainty transformations.

**Stop when:** A fresh analysis run regenerates your percentile and goodput tables from raw records, and your report justifies cache controls, sampling units and tail uncertainty.

<details>
<summary>Self-test</summary>

1. Why preserve off/on pairing during resampling?
   - The pair shares replay conditions. Breaking it discards that dependence and changes the uncertainty of the difference.
2. Is the average of trial p99 values the pooled request p99?
   - No. Quantiles are nonlinear. Pool raw observations to estimate pooled p99, or explicitly report the mean of trial p99 values as a different statistic.
3. Why not independently resample every token gap?
   - Gaps share requests, scheduler iterations and cache state. Independent resampling can understate uncertainty; use trials or justified dependent blocks.
4. Does a narrow interval from a tiny sample establish p99 precisely?
   - No. Tail coverage may be poor or the bootstrap degenerate. Report the observation count and limitation, and collect more independent evidence.

</details>

#### U5. Capacity headroom under demand growth across three scenarios

**About 4 h** · **Target:** Derive

Topics: Capacity-planning headroom under demand growth; Three workload and SLO scenarios

The serving planner extends Unit cost, headroom and simpler designs with a measured SLO boundary. A token-rate peak is not a safe provisioning point.

**You can now**

- Derive a capacity and cost plan for three workload/SLO scenarios using measured replica capacity.
- Budget demand growth, retries, quality acceptance, startup lag and a stated failure reserve.
- Identify which fleet assumptions remain analytical rather than validated by a single-device run.

**Study**

1. [Choose the constraint before the topology](https://mlsysbook.ai/vol2/inference/inference.html#tbl-distribution-triggers) (Machine Learning Systems, Volume 2 - The Economics and Architecture of Inference) - When single-machine serving is insufficient, Table 1 and Checkpoint 1.1; The serving tax: Overhead of distribution, equation 1; Serving cost can dominate training cost, equation 2 (page read 2026-10-14).
2. [Find capacity under the declared SLO](https://arxiv.org/html/2407.07000v2#S4.SS2) (Etalon: Holistic Performance Evaluation Framework for LLM Inference Systems) - arXiv:2407.07000v2, Section 4.2: Evaluation workflow and implementation, the Capacity Evaluation paragraph; Section 5.2: Evaluating Open Source Systems. Depth: Use the load-search method, not the paper's hardware capacities. Keep your SLO common across compared systems.
3. [The scenario and failure planner](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/capstones/llm-inference-systems-laboratory.md#core-requirements) (LLM Inference Systems Laboratory - Full Capstone) - Core requirements: analytical planner; Hardware variants; Measurement requirements: capacity headroom; Design-defense questions 5, 7 and 10.

**Focus**

- Use three declared scenarios: interactive short prompts with a strict first-token target; long-context summarization; and bursty shared-prefix traffic with cancellations. Preserve their joint length/reuse distributions, not just means.
- Let $`q_s`$ be sustainable attempts/s per healthy replica for scenario $`s`$, and $`h_s`$ the fraction deliberately left unused. Under balanced identical replicas, require $`(n-f)(1-h_s)q_s \geq \lambda_s a_s`$, where $`f`$ is failed replicas, $`\lambda_s`$ logical requests/s and $`a_s`$ expected attempts/request.
- Quality and SLO acceptance convert served attempts into useful outcomes. Do not divide demand by acceptance unless the product actually retries rejected answers; model that retry policy explicitly.
- Sweep growth and a major failure separately. Include startup lag, cold-cache recovery, routing imbalance and reserve charges; the replica inequality is an analytical starting point, not a fleet latency proof.

**Reproduce:** Closed-book, derive the replica inequality and apply it to a labeled analytical fixture: balanced identical replicas each sustain 10 attempts/s; reserve 20% of that rate, allow one failed replica, demand 24 logical requests/s and assume 1.25 attempts/request. Obtain five provisioned replicas. At 10x demand obtain 39. Then build the three-scenario table from your own measured capacity points, with fleet routing and failures checked in a labeled CPU simulation.

**Traps**

- Adding another utilization discount to a capacity number already defined at that same utilization target. State what reserve is additional.
- Multiplying single-replica capacity by replica count without cache skew, imbalance or fault-domain assumptions.
- Budgeting steady-state capacity while ignoring backlog during model startup and cold-cache recovery.

**Practice**

- The section mini-project covers this: the `servelab` three-scenario capacity/cost planner, 10x growth sensitivity and simulated failure reserve.

**Stop when:** Each scenario has a measured single-replica SLO point, a derived growth/failure plan and a cost table whose fleet assumptions are explicitly labeled.

<details>
<summary>Self-test</summary>

1. Why does the fixture need five replicas rather than four?
   - Demand is 30 attempts/s. Four healthy replicas at 8 attempts/s each suffice, but one additional replica is needed to preserve that capacity after one failure.
2. Does sharding always improve a strict latency scenario?
   - No. It adds communication and coordination. Derive those costs and distinguish single-request execution from queueing before choosing it.
3. Can three scenarios share one measured capacity constant?
   - Only with evidence that their service and SLO boundaries match. Length, reuse, bursts and stopping commonly change sustainable capacity.

</details>

#### U6. Reconstructing the engine API, tokenizer path, scheduler and request state

**About 5 h** · **Target:** Explain

Topics: Engine API and tokenizer path reconstruction; Scheduler and request-state reconstruction

Build on Reconstructing a real kernel path and making one bounded change. Serving adds request identity, queues and ownership before the runner ever selects a kernel.

**You can now**

- Map API validation, templating, tokenization and request identity into exact source owners.
- Reconstruct scheduler state transitions and the iteration work order without relying on class names alone.
- Predict where Nano-vLLM responsibilities move in Mini-SGLang and vLLM V1.

**Study**

1. [Nano-vLLM request and scheduler entry](https://github.com/GeeeekExplorer/nano-vllm/blob/bb823b3e06983d71485a8e1f23715ebd87d98ef8/nanovllm/engine/llm_engine.py) (Nano-vLLM and Mini-SGLang as Engine Reconstruction Bridges) - `LLMEngine.add_request`, `step` and `generate`; follow their calls into `nanovllm/engine/sequence.py` and `nanovllm/engine/scheduler.py`: `SequenceStatus`, `schedule`, `preempt` and `postprocess`.
2. [Mini-SGLang separates the frontend and scheduler](https://github.com/sgl-project/mini-sglang/blob/9a91cfafe754aa85daee49998176275667eb58f2/docs/structures.md) (Nano-vLLM and Mini-SGLang as Engine Reconstruction Bridges) - System Architecture: Key Components and Data Flow; Code Organization: server, tokenizer, message and scheduler modules; follow `python/minisgl/scheduler/scheduler.py`, `_process_one_msg` and `_schedule_next_batch`.
3. [The production scheduling work order](https://www.oreilly.com/library/view/hands-on-llm-serving/9798341621480/) (Hands-On LLM Serving and Optimization - Chapters 8 and 9, frameworks and optimization in practice) - Chapter 8, Generation-Request Execution Workflow and Scheduler Deep Dive, printed pp. 278 to 284. Depth: Treat the prose as an architecture sketch, not a fairness guarantee. Use vLLM 0.31.0 source to resolve implementation details.
4. [vLLM 0.31.0 process and input boundaries](https://docs.vllm.ai/en/v0.31.0/design/arch_overview/#v1-process-architecture) (vLLM V1 Architecture Overview) - V1 Process Architecture: API Server Process and Engine Core Process; compare `vllm/v1/engine/input_processor.py`, `vllm/v1/request.py` and `vllm/v1/core/sched/scheduler.py` in release 0.31.0. Depth: Skip the later AsyncLLMEngine description as a V1 implementation guide. In release 0.31.0, the launcher imports `AsyncLLM` from `vllm/v1/engine/async_llm.py`; the older name is a compatibility alias.

**Focus**

- Reuse your earlier request-state invariants. For every arrow, record caller, callee, process, message payload, request ID and owner of terminal cleanup.
- Nano-vLLM accepts token IDs or text but supplies no HTTP frontend. Mini-SGLang adds API, tokenizer and scheduler messages; API schema fields still need tracing to implementation.
- At the pinned Nano-vLLM commit, the scheduler returns a prefill batch before considering decode if prefill work was scheduled. Chunked prefill alone therefore does not prove decode protection.
- Compare the miniature phase flag with V1's token-progress scheduling. Identify admission and preemption decisions separately from batch tensor preparation.

**Reproduce:** Draw the three frontend-to-scheduler maps without notes. Annotate a short request, a chunked long prompt and a preempted request with state owner and token progress. Replay these transitions on CPU with your existing deterministic scheduler and check resource and request invariants; keep differences from the pinned engine explicit rather than claiming simulation is execution evidence.

**Traps**

- Assuming matching class names mean matching process boundaries or scheduling policy across engines.
- Reading only normal completion. Preemption can return a running request to waiting with a different cache state.
- Treating continuous batching as bounded fairness. Demonstrate bounded wait under the actual arrivals and admission policy.

**Practice**

- The section mini-project covers this: the `servelab` frontend/scheduler architecture map and deterministic request-state replay against pinned source.

**Stop when:** You can locate the source owner of validation, tokenization, admission, scheduling and preemption, and predict the next state of all three replay cases.

<details>
<summary>Self-test</summary>

1. Why trace a supported API field past validation?
   - A schema can accept a field that is not forwarded or implemented. The actual request contract is determined by the whole path.
2. Does Nano-vLLM's chunked prefill automatically interleave decode?
   - Not at the pinned commit. `schedule` returns scheduled prefill work before the decode loop; arrivals can keep prefill taking precedence.
3. Which component should own the batch tensor layout?
   - The runner or its preparation layer. The scheduler determines feasible token work and ownership metadata; the runner translates that plan into execution inputs. Verify the actual split in source.

</details>

#### U7. Reconstructing the block manager, prefix cache, model runner and attention backend

**About 5 h** · **Target:** Explain

Topics: Block manager and prefix-cache reconstruction; Model runner and attention-backend reconstruction

Reuse your allocator and paged-attention invariants. The new task is to find their actual enforcement points and follow a schedule into the selected backend.

**You can now**

- Trace logical token positions through cache lookup, physical allocation and runner metadata to attention dispatch.
- Identify cache ownership and lifetime boundaries in two miniature engines and vLLM V1.
- Explain which runner assumptions constrain a scheduler or cache contribution.

**Study**

1. [Nano-vLLM block ownership and attention addresses](https://github.com/GeeeekExplorer/nano-vllm/blob/bb823b3e06983d71485a8e1f23715ebd87d98ef8/nanovllm/engine/block_manager.py) (Nano-vLLM and Mini-SGLang as Engine Reconstruction Bridges) - `can_allocate`, `allocate`, `deallocate`, `may_append` and `hash_blocks`; follow `nanovllm/engine/model_runner.py`: `allocate_kv_cache`, `prepare_prefill`, `prepare_decode` and `run_model`; then `nanovllm/layers/attention.py`: `Attention.forward`.
2. [Mini-SGLang radix ownership and runner preparation](https://github.com/sgl-project/mini-sglang/blob/9a91cfafe754aa85daee49998176275667eb58f2/python/minisgl/kvcache/radix_cache.py) (Nano-vLLM and Mini-SGLang as Engine Reconstruction Bridges) - `RadixPrefixCache.lock_handle`, `match_prefix`, `insert_prefix`, `evict` and `_tree_walk`; follow `python/minisgl/scheduler/scheduler.py`: `_prepare_batch`, including page-table allocation and attention metadata preparation.
3. [vLLM 0.31.0 cache-manager entry points](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/core/kv_cache_manager.py) (vLLM V1 Architecture Overview) - `KVCacheManager.get_computed_blocks`, `allocate_slots` and `free`; follow `vllm/v1/worker/gpu_model_runner.py`: `_prepare_inputs`, `_build_attention_metadata`, `execute_model` and `initialize_attn_backend`. Depth: Trace one supported dense text model and selected backend. Hybrid cache groups and distributed connectors are interface reading, not an implementation requirement.

**Focus**

- Record the cache key, lookup result, references, free/used accounting and invalidation scope. Equal prompt suffixes are not equal prefixes.
- Separate cache storage from attention addressing. The allocator chooses physical pages; the runner supplies positions, lengths, slot mappings and block tables; the backend consumes them.
- Nano-vLLM excludes the final prompt block from prefix lookup at this commit. Follow the exact recomputed suffix rather than assuming every complete prompt block is reused.
- Graph replay, padding and asynchronously prepared metadata extend lifetimes. A free operation must respect in-flight consumers, not merely the host request status.

**Reproduce:** Closed-book, map a cold prompt, an exact shared prefix and an append across a page boundary from request tokens to attention inputs. Use a CPU page-table fixture to compare gathered logical KV with a contiguous oracle and to recount references after release. Annotate the corresponding pinned source calls and graph/eager dispatch boundary; inspect GPU execution separately from this address-correctness check.

**Traps**

- Calling an unreferenced cached page unused memory. It may remain reusable until eviction; release and eviction are different operations.
- Assuming a cache hash supplies model, tokenizer and tenant isolation. Verify the full identity scope separately.
- Treating Mini-SGLang's `check_integrity` as a complete invariant suite. It is an empty method in the pinned radix implementation; write independent checks.

**Practice**

- The section mini-project covers this: the `servelab` cache/runner source map and CPU logical-to-physical KV oracle checks.

**Stop when:** Your three annotated cases reconcile token positions, page ownership and runner metadata, and each attention input has an identified producer and lifetime.

<details>
<summary>Self-test</summary>

1. Which two maps are needed to find a cached token's physical KV?
   - The request's logical token position to logical page/offset, and its block table from logical page to physical page. Layer and KV-head layout then locate the values.
2. Why can released KV still occupy cache storage?
   - Release removes active references, but a prefix index may retain reusable content. Eviction makes that storage available for replacement.
3. Does a prefix hit prove the runner skips the whole prompt?
   - No. Lookup rules, block alignment and the need to recompute a final token or suffix determine actual skipped work. Trace returned token counts and scheduled inputs.

</details>

#### U8. Reconstructing sampling, streaming, cleanup, workers and telemetry

**About 4 h** · **Target:** Explain

Topics: Sampling, streaming and cleanup reconstruction; Distributed worker and telemetry reconstruction

The request is not finished when the kernel returns. Sampling, stream delivery and cleanup determine output correctness, measured latency and whether the next request inherits stale state.

**You can now**

- Trace logits through sampling, token state, detokenization and streaming to the client.
- Locate cancellation and completion cleanup across request, cache and frontend owners.
- Map worker control messages and telemetry boundaries without claiming distributed performance from a single-device run.

**Study**

1. [Nano-vLLM sample and completion loop](https://github.com/GeeeekExplorer/nano-vllm/blob/bb823b3e06983d71485a8e1f23715ebd87d98ef8/nanovllm/engine/model_runner.py) (Nano-vLLM and Mini-SGLang as Engine Reconstruction Bridges) - `run`, `call`, `write_shm`, `read_shm` and `exit`; follow `nanovllm/layers/sampler.py`: `Sampler.forward`; `nanovllm/engine/scheduler.py`: `postprocess`; and `nanovllm/engine/llm_engine.py`: `generate`.
2. [Mini-SGLang output delivery and abort ownership](https://github.com/sgl-project/mini-sglang/blob/9a91cfafe754aa85daee49998176275667eb58f2/python/minisgl/scheduler/scheduler.py) (Nano-vLLM and Mini-SGLang as Engine Reconstruction Bridges) - `_process_last_data`, `_process_one_msg` abort branch and `_free_req_resources`; follow `python/minisgl/tokenizer/detokenize.py`: `DetokenizeManager.detokenize`; `python/minisgl/server/api_server.py`: `stream_chat_completions`, `stream_with_cancellation` and `abort_user`; `python/minisgl/scheduler/io.py`: rank-specific receive/reply methods.
3. [vLLM 0.31.0 output state and telemetry](https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/engine/output_processor.py) (vLLM V1 Architecture Overview) - `OutputProcessor.process_outputs`, `abort_requests`, `_finish_request`, `do_tracing` and `_update_stats_from_finished`; follow `vllm/v1/engine/async_llm.py`: `generate` and `abort`; Architecture Overview: GPU Worker Processes and DP Coordinator Process. Depth: Worker/rank coordination is source reading plus labeled local-process simulation. Trace actual execution with one worker on your GPU; additional GPUs are not required.

**Focus**

- Mark when sampled token IDs become request state, when text becomes printable, when a chunk is sent and when the client sees content. These are distinct timing boundaries.
- Follow cancellation past the frontend acknowledgment. Request queues, KV references, in-flight work and output collectors may have different cleanup times.
- Mini-SGLang's overlap loop can observe terminal requests again while earlier work completes. Its finished-request guard is an ownership clue, not a reason to remove duplicate-event tests.
- Locate each telemetry producer and aggregation boundary. Join request and iteration records without logging sensitive prompt text or introducing unbounded metric labels.

**Reproduce:** Without notes, draw successful completion and cancellation during an in-flight iteration through all output and cleanup owners. Use CPU fake-runner events to replay late output after cancellation and repeated terminal notifications; assert no second client completion and no double release. Link each event to the pinned implementation and identify the telemetry needed to distinguish generated tokens from client-visible content.

**Traps**

- Equating one stream chunk with one model token. Detokenization, buffering and output intervals can merge or delay content.
- Using Nano-vLLM's terminal batch output as proof of online streaming behavior. That interface returns completed outputs, not an HTTP stream.
- Trusting Mini-SGLang's non-streaming usage fields as measured counts. The pinned API returns literal zeros there; count token IDs independently.

**Practice**

- The section mini-project covers this: the `servelab` output/worker/telemetry map and CPU cancellation, late-output and duplicate-terminal replay checks.

**Stop when:** Your map distinguishes generated tokens, visible chunks and safe release, and both normal completion and cancellation reconcile every owner and telemetry record.

<details>
<summary>Self-test</summary>

1. Does receiving an abort acknowledgment prove all KV is reusable immediately?
   - No. Follow the cache owner and any in-flight consumers to the safe release point; acknowledgment and device completion can differ.
2. Why can first-content latency exceed first sampled-token latency?
   - A token may not yet decode to printable text, and output processing, buffering, transport or a slow client can delay visible content.
3. What can a CPU worker-loss simulation establish?
   - Request identity, terminal outcome, retry and bounded cleanup behavior under its event model. It cannot establish collective timing or distributed GPU throughput.

</details>

#### U9. A contribution hypothesis with a predicted boundary and one bounded change

**About 6 h** · **Target:** Implement

Topics: Contribution hypothesis and predicted boundary; One scheduler, cache, routing, instrumentation or kernel change

Your reconstruction now makes a contribution reviewable. Build on the earlier bounded kernel change, but predict effects on serving queues, useful output and failure behavior as well as local time.

**You can now**

- Choose one real-engine change with a quantitative prediction, losing regime and falsifying signal.
- Distinguish the proposed mechanism from scheduler, cache, kernel and measurement alternatives.
- Implement the bounded path without benchmark-only special casing or an engine rewrite.

**Study**

1. [Pick the layer and the trade-off](https://www.oreilly.com/library/view/hands-on-llm-serving/9798341621480/) (Hands-On LLM Serving and Optimization - Chapters 8 and 9, frameworks and optimization in practice) - Chapter 8, vLLM's Layered Optimization Strategy, printed pp. 284 to 285; Chapter 9, Common Optimization Trade-offs, pp. 311 to 312.
2. [A bounded scheduling seam](https://github.com/sgl-project/mini-sglang/blob/9a91cfafe754aa85daee49998176275667eb58f2/python/minisgl/scheduler/scheduler.py) (Nano-vLLM and Mini-SGLang as Engine Reconstruction Bridges) - `_schedule_next_batch`, `normal_loop`, `overlap_loop` and `_process_last_data`. Depth: Use this as one candidate seam, not an instruction to copy a new policy. Choose a scheduler, cache, routing, instrumentation or kernel path justified by your own reconstruction.
3. [The contribution specification](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/capstones/llm-inference-systems-laboratory.md#milestone-c--main-implementation) (LLM Inference Systems Laboratory - Full Capstone) - Milestone C: hypothesis, regimes, invariants, alternatives, reversal conditions and real API integration; Architecture constraints: no benchmark special casing.

**Focus**

- Write the mechanism chain: changed decision, changed work or wait, predicted trace signal, expected endpoint effect. Name a competing explanation and a control that separates it.
- Declare a boundary in arrival, length, reuse, memory pressure or shape before coding. Use a quantitative overhead-versus-saved-work model, not a universal faster claim.
- Keep one code seam and one selectable behavior change. A feature flag is not the mechanism; the changed request, cache or execution path is.
- Instrumentation contributions must improve diagnosis while budgeting observer overhead. Scheduler and cache changes must preserve admission, token progress and safe ownership even when they lose on performance.

**Reproduce:** Closed-book, write a one-page hypothesis from your source map: baseline, changed seam, invariant, overhead model, predicted winning and losing regions, falsifier and rollback boundary. Implement that seam in a real miniature or production engine. Test policy and ownership decisions with a CPU fake runner; on your GPU, use a fitting model to prove the changed path is reached by an ordinary request, not only a benchmark hook. Keep the initial trace before tuning.

**Traps**

- Changing policy, cache budget and sampling together. The result cannot identify which mechanism caused it.
- Choosing a path only because its microbenchmark is slow. It must lie on the workload's relevant execution or queueing path.
- Changing the prediction after the first profile. Preserve the failed prediction and explain the residual before revising it.

**Practice**

- The section mini-project covers this: the `servelab` predeclared contribution hypothesis, one bounded real-engine patch and path-activation evidence.

**Stop when:** One ordinary request reaches the changed seam, its state checks pass, and the preserved hypothesis identifies a measurable falsifier and losing boundary.

<details>
<summary>Self-test</summary>

1. What makes a losing-region prediction useful?
   - It identifies where added overhead, contention or another constraint dominates and gives a falsifiable dispatch boundary.
2. Can an instrumentation change be a real-engine contribution?
   - Yes, if it runs on the real lifecycle, resolves a measurable diagnostic gap and has tested semantics and observer cost. A summary-only benchmark patch does not meet that boundary.
3. What if the predicted trace signal never changes?
   - The mechanism hypothesis is unsupported even if an aggregate improves. Verify path activation and controls before attributing the gain.

</details>

#### U10. Reference fallback, versioned configuration and the test and protection suite

**About 5 h** · **Target:** Implement

Topics: Reference fallback and versioned configuration; Unit, property, integration and regression tests; Correctness, quality and failure protection

Build on Protection, clean reproduction and claim-to-artifact links. Serving fallback must also handle live request state, shared KV and terminal races, not just select a different function.

**You can now**

- Implement a selectable reference fallback with versioned effective configuration and compatible state.
- Protect the contribution with unit, differential, randomized-state, integration and performance-regression checks.
- Diagnose the first correctness or lifecycle divergence under a seeded fault.

**Study**

1. [The reference, fault and rollback contract](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/capstones/llm-inference-systems-laboratory.md#correctness-requirements) (LLM Inference Systems Laboratory - Full Capstone) - Milestone A: full-prefix/reference equivalence; Milestone C: fallback and compatibility; Milestone D: first-cause timeline and divergence bisection; Correctness requirements; Failure-injection requirements. Depth: Choose fault cases touching your contribution plus request cancellation, exhaustion and rollback. Simulate rank/network faults on CPU; do not expand the patch into all capstone mechanisms.
2. [Configuration ingestion and fallback boundary](https://github.com/GeeeekExplorer/nano-vllm/blob/bb823b3e06983d71485a8e1f23715ebd87d98ef8/nanovllm/config.py) (Nano-vLLM and Mini-SGLang as Engine Reconstruction Bridges) - `nanovllm/config.py`: `Config` declaration and post-initialization validation; compare `nanovllm/engine/llm_engine.py`: constructor keyword filtering; `nanovllm/engine/model_runner.py`: `run_model` eager/graph branch.
3. [In-flight output and cleanup protection](https://github.com/sgl-project/mini-sglang/blob/9a91cfafe754aa85daee49998176275667eb58f2/python/minisgl/scheduler/scheduler.py) (Nano-vLLM and Mini-SGLang as Engine Reconstruction Bridges) - `overlap_loop`, `_process_last_data`, `_process_one_msg` and `_free_req_resources`; compare normal execution with the terminal guard and abort branch.

**Focus**

- Keep the unmodified reference selectable and record the effective configuration, not just requested options. Reject unknown settings in your contribution wrapper rather than silently accepting a misspelling.
- Numerical closeness, greedy token agreement, stochastic distribution agreement and application quality are different contracts. Choose the appropriate independent reference and tolerances before timing.
- Unit tests check the decision; randomized histories check state conservation; integration tests prove real-path behavior; regression tests protect quality, tails, memory and failure recovery.
- A fallback switch must drain, migrate or invalidate incompatible state before reuse. Test cancellation, late output, cache pressure and restart through the same boundary.

**Reproduce:** Without copying engine logic, write an independent state oracle and generate CPU histories spanning admit, advance, cancel, fail, release and fallback. Inject a missing release and a duplicate terminal event and require the suite to fail. For numerical paths, compare against a full-prefix reference on your GPU with a fitting model; retain the first divergent request/token or state transition. Exercise contribution off, on and rollback through ordinary requests with the same versioned contract.

**Traps**

- Calling the contribution itself the oracle. Reusing its accounting logic can reproduce the same ownership bug in both paths.
- Assuming a seed guarantees token-identical stochastic output across batching or backends. Check the declared distribution or quality contract instead.
- Switching code while retaining incompatible KV or graph state. A successful flag change is not a successful rollback.

**Practice**

- The section mini-project covers this: the `servelab` independent oracle, randomized/integration/regression suite and exercised versioned fallback and rollback.

**Stop when:** Off, on and rollback preserve the declared contract, seeded defects fail the protection suite, and fault traces reconcile request and cache ownership.

<details>
<summary>Self-test</summary>

1. Is greedy token equality implied by close logits?
   - No. Near a tie, a small numerical difference can change the argmax. Record numerical tolerance and any token-agreement requirement separately.
2. Why test the tests with seeded defects?
   - A passing suite may not exercise the protection boundary. A known missing release or duplicate completion proves the relevant check can fail.
3. When may fallback reuse existing cache state?
   - Only when identity, layout, numerical and ownership contracts remain compatible and in-flight consumers are safe. Otherwise drain, migrate or invalidate it.

</details>

#### U11. Strong baselines, three ablations, three workload regions and a negative result

**About 6 h** · **Target:** Measure

Topics: Strong baseline and comparable tuning; At least three mechanism-isolating ablations; At least three informative workload regions; Neutral or negative result preservation

Build on Workload-weighted impact, negative results and the design defense. The serving contribution must survive different queue, cache and length regimes, not merely its fastest cell.

**You can now**

- Compare contribution off/on against strong alternatives with equal tuning opportunity and serving contracts.
- Run three mechanism-isolating ablations across three informative workload regions without a combinatorial sweep.
- Preserve a neutral or negative result with correctness, uncertainty and diagnostic evidence.

**Study**

1. [From baseline to workload-specific optimization](https://www.oreilly.com/library/view/hands-on-llm-serving/9798341621480/) (Hands-On LLM Serving and Optimization - Chapters 8 and 9, frameworks and optimization in practice) - Chapter 9, Step 5: Benchmark the Qwen3 Model with vLLM, printed pp. 302 to 303; Step 6: Benchmark the Quantized Qwen3 Model with vLLM, pp. 304 to 305; Common Optimization Trade-offs, pp. 311 to 312. Depth: Read the comparison structure. Do not copy the numerical expectations or treat different traffic datasets as an isolated mechanism test. Quantization also needs its own quality control.
2. [A controlled baseline/optimization lab pattern](https://github.com/cfregly/ai-performance-engineering/blob/b57e4c6a9e261c09ac09208705d040c81b03d35e/code/labs/dynamic_router/README.md) (AI Systems Performance Engineering companion code - inference labs) - Learning Goals; Directory Layout: policy, simulator and baseline/optimized integrations; Running the Benchmarks; Validation Checklist. Depth: Use the baseline/optimized artifact pattern only. Skip dual-pool and multi-GPU commands; do not adopt bundled performance expectations. Routing pools may be labeled CPU simulation, while the contribution's real-path comparison stays single-GPU.
3. [Mechanism isolation and preserved losses](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/capstones/llm-inference-systems-laboratory.md#milestone-e--measurement--optimization) (LLM Inference Systems Laboratory - Full Capstone) - Milestone C: strong alternatives and mechanism ablations; Milestone E: model residuals, endpoint workloads and neutral/worse regions; Architecture constraints: tuning/final separation.

**Focus**

- Compare the unmodified engine, your enabled path and the strongest relevant built-in or simpler alternative. Match model, quality, cache policy, resource budget and tuning effort; document deliberate policy differences.
- Choose three ablations from the hypothesis, each with a predicted trace signature. For a reuse mechanism, useful controls include lookup with reuse disabled, matched retained-cache capacity, and fixed load-only routing instead of affinity. Adapt them to your actual seam.
- Use a region predicted to benefit, an overhead-dominated region and a pressure or burst region that stresses the boundary. Select them on tuning traces, then freeze configurations for final replay.
- Keep off/on TTFT, TPOT, end-to-end, p50/p95/p99, throughput, goodput, memory, utilization, fairness, errors, quality and cost. Pair raw trials; keep failed and losing rows as visible as wins.

**Reproduce:** Closed-book, write the minimal comparison matrix: off/on plus three named ablations, each isolating one causal explanation, evaluated over three predeclared regions. Run the real-path variants on your GPU using a fitting model and frozen final traces; use CPU replay for ownership/failure controls. Regenerate the table from raw trials and retain one neutral or losing result with its trace-based explanation. Do not retune on that final loss to erase it.

**Traps**

- Calling three different request rates three ablations. They are workload regions unless they isolate a mechanism under otherwise fixed conditions.
- Giving the contribution an extensive search and comparing it with an untuned default. The tuning budget is part of baseline fairness.
- Keeping only successful outputs from a faster variant. Correctness and quality gates apply before performance conclusions.

**Practice**

- The section mini-project covers this: the `servelab` strong-baseline campaign, three named mechanism ablations, three regions and preserved neutral/negative result.

**Stop when:** Your frozen comparison has three causally justified ablations and three regions, all outputs pass their contract, and one neutral or negative row remains with uncertainty and raw trace links.

<details>
<summary>Self-test</summary>

1. What separates an ablation from a workload region?
   - An ablation removes or controls a mechanism within a fixed workload. A region changes workload conditions to test where the mechanism applies.
2. What does lookup-on/reuse-off isolate?
   - The lookup and bookkeeping overhead without saved execution, provided capacity and other policy effects are held fixed. It does not by itself isolate every cache effect.
3. If the interval for the off/on difference includes zero, is that proof of equal performance?
   - No. It is inconclusive at that uncertainty. An equivalence claim needs a predeclared practical margin and appropriate evidence.

</details>

#### U12. The bottleneck shift and the capacity and cost decision

**About 4 h** · **Target:** Derive + Measure

Topics: Bottleneck-shift explanation; Capacity and cost decision

Build on Cost categories and the Amdahl bound on end-to-end gain. Serving can shift the queueing boundary as well as the execution share, so local speedup is only one input to the decision.

**You can now**

- Explain an endpoint gain or regression using changed critical-path terms and queue/cache evidence.
- Recompute scenario capacity and accepted-output cost after the contribution moves a bottleneck.
- Choose deployment, selective fallback or rejection of the patch with an explicit reversal condition.

**Study**

1. [Reinterpret a changed resource budget](https://www.oreilly.com/library/view/hands-on-llm-serving/9798341621480/) (Hands-On LLM Serving and Optimization - Chapters 8 and 9, frameworks and optimization in practice) - Chapter 9, Step 6: Benchmark the Quantized Qwen3 Model with vLLM, printed pp. 304 to 305; Common Optimization Trade-offs, pp. 311 to 312. Depth: Read how lower weight memory changes the KV budget. Use explicit byte units and your own quality/capacity results; do not infer a universal speedup from the worked run.
2. [Price the serving tax at the right level](https://mlsysbook.ai/vol2/inference/inference.html) (Machine Learning Systems, Volume 2 - The Economics and Architecture of Inference) - The serving tax: Overhead of distribution, equation 1; Serving cost can dominate training cost, equation 2; The serving hierarchy, Table 5 (page read 2026-10-14).
3. [Model residuals and the shipping decision](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/capstones/llm-inference-systems-laboratory.md#milestone-e--measurement--optimization) (LLM Inference Systems Laboratory - Full Capstone) - Milestone E: quantify residuals, optimize critical-path terms and preserve worse regions; Design-defense questions 5, 6, 9 and 10.

**Focus**

- At fixed execution work, a changed share $`f`$, local speedup $`s`$ and added overhead fraction $`o`$ predict latency speedup $`1/(1-f+f/s+o)`$. This model does not hold queueing delay or batch composition fixed under load.
- Reprofile off/on at matched offered load and at each variant's SLO capacity. Look for changed tokenization, dispatch, memory pressure, recomputation, stream delay and queue growth.
- Replace the planner's scenario-specific capacity and attempt-cost inputs with final evidence. Preserve quality, retry, failure reserve and routing assumptions; quantify sensitivity to the weakest input.
- A local gain can improve accepted-output cost without changing integer provisioning, or fail to improve either. Include maintenance, observability, portability and rollback costs in the decision.

**Reproduce:** Closed-book, check a labeled additive execution model: a 10 ms baseline contains a 4 ms term; halving that term and adding 1 ms of overhead yields 9 ms and a speedup of $`10/9`$. Do not convert this directly into serving capacity. Use your final off/on traces to explain the dominant residual, then update the three-scenario `servelab` plan and recommend enablement, bounded dispatch or the unchanged baseline.

**Traps**

- Holding the old bottleneck classification after the change. The next largest constrained term can now dominate.
- Pricing provisioned hardware at full gross throughput while accepted demand is smaller or reserve remains idle.
- Claiming a causal bottleneck from utilization alone. Correlate phase, queue and ownership traces with controlled ablations.

**Practice**

- The section mini-project covers this: the `servelab` prediction-residual report, shifted-bottleneck diagnosis and updated capacity/cost decision.

**Stop when:** Your decision reconciles the local model with endpoint traces, reprices all three scenarios and names an observation that would reverse the recommendation.

<details>
<summary>Self-test</summary>

1. Why can endpoint latency improve by more than the fixed-work Amdahl estimate?
   - Under load, faster service can reduce queueing or change batching. That changes the model's fixed-work assumptions; it does not violate Amdahl's bound.
2. Can a faster path leave provisioned cost unchanged?
   - Yes. Integer replica counts, failure reserve, minimum warm capacity or another resource may prevent removing provisioned capacity.
3. What supports selective fallback rather than universal enablement?
   - A stable observable boundary, correctness-compatible state and held-out evidence that the reference is preferable beyond it. Include dispatch overhead and test the transition.

</details>

#### U13. An independent reproduction package and a technical design defense

**About 5 h** · **Target:** Explain

Topics: Independent reproduction package; Technical design defense; Second model family or hardware generation validation; Upstream-quality patch and external review

Build on Protection, clean reproduction and claim-to-artifact links and the earlier design defense. This final package must connect real serving behavior to the decision, including losses and faults.

**You can now**

- Explain how an independent operator rebuilds the engine and regenerates each decision-critical claim.
- Defend the contribution against two alternatives, 10x demand, changed length/reuse distributions and a major failure.
- State portability and maintenance limits, with optional second-family validation and external patch review.

**Study**

1. [Independent evaluation and the technical defense](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/capstones/llm-inference-systems-laboratory.md#milestone-f--final-evaluation) (LLM Inference Systems Laboratory - Full Capstone) - Deliverables: independent review and reproduction package; Milestone F; Design-defense questions 1 to 10; Rubric; Stretch goals. Depth: Use Milestone F for this section's bounded contribution and its linked earlier artifacts, not a new implementation of the entire capstone. Second-family/hardware validation and upstream review are optional.
2. [What the reproduction report must disclose](https://nvidia.github.io/TensorRT-LLM/developer-guide/perf-benchmarking.html#startup-metrics) (TensorRT-LLM Benchmarking Guide) - TensorRT-LLM commit cc63e66: Running with the PyTorch Workflow, example model/runtime report; Startup Metrics; Online Serving Benchmarking (page read 2026-10-14). Depth: Audit report fields and timing boundaries only. The worked vendor results and device-setting commands are not reproduction targets.

**Focus**

- Package source revision and patch, environment lock, model/tokenizer revisions, effective configurations, workload identities, raw traces, output checks and analysis transformations. Every headline links to regenerable artifacts.
- Give the operator separate commands for CPU semantic/fault replay and single-GPU measurement with a fitting model. State permitted warm state, expected correctness checks and uncertainty, not a promised speed target.
- Defend two alternatives using the same contract. Revisit the 10x, changed-length/reuse and failure scenarios; label unmeasured fleet conclusions analytical or simulated.
- Optional: use another fitting model family on the same GPU, or documented hardware evidence, to test a portability assumption. Prepare a small reviewable patch with rationale, tests and losing regimes; external review does not require upstream acceptance.

**Reproduce:** Without notes, present the chain from changed invariant and predicted boundary to source patch, correctness tests, raw trials, ablations, negative result and capacity decision. Have another operator regenerate one CPU fault trace and the decision-critical single-GPU comparison from the package without verbal repair. If no operator is available, run a clean-room rehearsal and mark independent reproduction pending. Defend the choice against two alternatives and all four demand/distribution/failure challenges.

**Traps**

- Treating a clean rerun by the author as independent reproduction. It is useful rehearsal, but it does not meet the independent-operator claim.
- Hand-copying summaries into the report. Preserve the transformation from raw records to every decision-critical value.
- Calling one model on one device portable. Optional validation narrows uncertainty; it does not establish every model or hardware regime.

**Practice**

- The section mini-project covers this: the `servelab` independent reproduction package and technical defense, with optional second-family validation and external patch review.

**Stop when:** An independent operator regenerates the decision-critical evidence and your defense answers two alternatives, 10x demand, changed lengths, changed reuse and a major failure with explicitly scoped claims.

<details>
<summary>Self-test</summary>

1. What must an operator reproduce if the exact timings differ?
   - The declared semantics and checks, analysis path and decision-critical behavior within the stated uncertainty and hardware scope. A new device may require a new measurement claim.
2. How should a simulated fleet result appear beside single-GPU evidence?
   - With a simulation label, assumptions, calibrated inputs and sensitivity. It must not be presented as measured distributed capacity or failure timing.
3. Does upstream rejection invalidate the contribution?
   - Not by itself. External acceptance also depends on project scope and maintenance policy. Retain review feedback and evaluate the technical claims and costs on their evidence.
4. What if independent reproduction reverses the shipping decision?
   - Investigate workload, state, environment and analysis differences, publish the discrepancy and revise the claim. Do not discard the independent result.

</details>

### Mini-project: Measured engine contribution with capacity decision

**About 14 to 18 hours.** Map a fitting engine from frontend to telemetry, ship one bounded contribution behind a versioned fallback, and prove its boundary across baselines, ablations and regions. The capacity and cost decision plus reproduction package carry directly to the capstone.

1. Write a decision record with owner and reversal in `reports/`, bind manifests to workload and engine revisions with frozen tuning and final traces, and reconcile offered against completed work with quality and SLO goodput plus attempt-cost and optional energy ledgers. Keep digests and sweep tables.
2. Run paired replay trials with matched arrivals and cache policy in `harness/`, regenerate percentiles and goodput from raw traces with whole-pair resampling, and derive a three-scenario capacity and cost plan with growth and failure reserve. Keep raw traces and plan tables.
3. Map frontend, scheduler, cache, runner, sampling, streaming, worker and telemetry owners in `engine/` against pinned source, and replay request states, logical-to-physical KV and cancellation with late and duplicate events on CPU. Keep maps and oracle checks.
4. Predeclare a hypothesis with winning and losing regimes and a falsifier, ship one bounded patch in `engine/` with path-activation evidence, and protect it with an independent oracle plus randomized, integration and regression tests including exercised fallback and rollback against seeded defects. Keep hypothesis and suite.
5. Compare off, on and strong alternatives with matched tuning and contracts across three ablations and three predeclared regions using frozen final traces, pairing raw trials. Keep the full table with a preserved neutral or negative row.
6. Explain the endpoint shift with changed critical-path and queue evidence, update the three-scenario capacity and cost decision with a reversal condition, and package independent reproduction with a defense against alternatives, growth, distribution change and failure plus optional second-family evidence. Keep the report and package.

**Deliverables**

- Decision, manifests, traces and capacity tables in `manifests/`, `workload/`, `harness/` and `reports/`.
- Engine maps, bounded patch with fallback, oracle suite and ablation tables with a negative row.
- Residual report, updated capacity decision and independent reproduction package with defense.

**Checks**

- rubric: Self-grade with the rubric below.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Manifests and goodput | Decision and manifests bind revisions, tuning stays separate from final, and reconciliation plus cost ledgers balance with own checks. | A changed stop rule alters workload identity, and growth and failure sweeps label fleet assumptions. |
| Contribution protection | Maps locate every owner, the oracle suite fails seeded defects, and fallback with rollback preserves contracts. | Path activation is proven on ordinary requests, and incompatible state is drained before reuse. |
| Comparison and defense | Matched baselines with three ablations across three regions keep raw trials and a negative row. | Residuals name the new bottleneck, capacity is repriced, and reproduction regenerates the decision. |

Feeds into: Capstone spine: maps, patch, ablations, capacity decision and reproduction package carry forward as the evaluated contribution.

### Resource route

- **Primary - Book:** [Hands-On LLM Serving and Optimization - Chapters 8 and 9, frameworks and optimization in practice](https://www.oreilly.com/library/view/hands-on-llm-serving/9798341621480/) - Read Chapter 9 as a worked sequence from traffic generation and baseline through quantized and distributed variants, then the vLLM architecture and scheduler sections of Chapter 8. Replace its model, engine version and hardware with your own fixed contract.
- **Required - Reference:** [TensorRT-LLM Benchmarking Guide](https://nvidia.github.io/TensorRT-LLM/developer-guide/perf-benchmarking.html) - Use the benchmark workflow, configuration capture, startup metrics and online-serving path as a benchmark-governance reference. Apply the same discipline to your engine and never import NVIDIA results as your own evidence.
- **Required - Implementation:** [vLLM V1 Architecture Overview](https://docs.vllm.ai/en/v0.31.0/design/arch_overview/) - Map API server, EngineCore, scheduler, KV cache manager, model executor and distributed deployment from the current documentation into exact source files. Select the bounded contribution only after identifying its state and fallback boundaries.
- **Required - Implementation:** [Nano-vLLM and Mini-SGLang as Engine Reconstruction Bridges](https://github.com/GeeeekExplorer/nano-vllm) - Reconstruct Nano-vLLM first, then compare Mini-SGLang cache, scheduler, overlap and model-runner boundaries. Move to vLLM or SGLang only when you can predict where the same responsibility lives.
- **Support - Course:** [UCSD CSE 291A (Spring 2026) - Guest lecture: Engineering vLLM](https://haoailab.com/cse291-s26/assets/scribe_notes/may7_scribe.pdf) - Read the scribe notes, Sections 3, 6 and 7: the architecture overview, model parallelism and serving topology, and the hybrid KV allocator with offloading. Use it to predict where a change would live before reading code.
- **Reference - Reference:** [AI Performance Engineering - Inference Engine and Benchmark Lanes](https://github.com/wafer-ai/gpu-perf-engineering-resources) - A curated index. Use Sections 4 and 5 only to find a mechanism source for the contribution.
- **Required - Lab:** [AI Systems Performance Engineering companion code - inference labs](https://github.com/cfregly/ai-performance-engineering/tree/main/code/labs) - Use `labs/dynamic_router`, `labs/cache_aware_disagg_inference`, `labs/speculative_decode` or `labs/flashinfer_attention` as a pattern for a controlled baseline, optimization and profile. Rerun everything under your own manifest.
- **Required - Paper:** [Etalon: Holistic Performance Evaluation Framework for LLM Inference Systems](https://arxiv.org/abs/2407.07000) - Use its per-request SLO and goodput framing to audit the benchmark. Preserve raw outcomes, quality acceptance and load shape so a throughput increase cannot hide missed latency targets.
- **Support - Theory:** [Machine Learning Systems, Volume 2 - The Economics and Architecture of Inference](https://mlsysbook.ai/vol2/inference/inference.html) - Read the opening sections of Inference at Scale for cost per token, utilization and serving-architecture dimensions, then build your own capacity and cost model from measured numbers.
- **Support - Reference:** [MLPerf Inference Datacenter Benchmark](https://mlcommons.org/benchmarks/inference-datacenter/) - Study scenario definitions, audit discipline and reproducibility. Borrow governance ideas appropriate to the capstone; submitting to MLPerf or reproducing its fleet hardware is outside the gate.
- **Reference - Reference:** [Artificial Analysis - Performance benchmarking methodology](https://artificialanalysis.ai/methodology/performance-benchmarking) - Read how its latency, output speed and price figures are measured. Use its public numbers as an outside comparison for your capacity plan, never as your own evidence.
- **Required - Project:** [LLM Inference Systems Laboratory - Full Capstone](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/capstones/llm-inference-systems-laboratory.md) - Complete the architecture map, contribution, fallbacks, correctness and fault suite, raw benchmark package, negative result, capacity and cost plan, independent reproduction and design defense. This artifact supplies the track milestone.
- **Support - Reference:** [SciPy bootstrap confidence intervals](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.bootstrap.html) - Read the resampling procedure, paired parameter, Notes on degenerate data and Examples. Apply it to independent trials; do not assume correlated serving requests are independent samples.
- **Support - Theory:** [Machine Learning Systems, Volume 2 - Sustainable AI](https://mlsysbook.ai/vol2/sustainable_ai/sustainable_ai.html) - For optional energy/carbon accounting, read Energy measurement techniques, System-level energy profiling and Operational carbon calculation. State meter boundaries and apply PUE only to complete IT energy, once.

### Exit checkpoint

Deliver a tested real-engine contribution with a reference fallback, three workload regions, three mechanism ablations, one honest neutral or negative result, fault evidence, a capacity and cost decision, and independent reproduction with measured, simulated and inferred claims separated.

<details>
<summary>Deliberately left for later</summary>

- Benchmark-only changes that bypass the real request path
- Headline speedups without raw requests, output checks and uncertainty
- A broad engine rewrite that cannot be reviewed or ablated

</details>

## Track milestone

### LLM Inference Systems Laboratory

Extend one service from a reference-equivalent baseline into an observable, failure-aware serving system, then modify one real engine path and defend its workload boundary. CPU or simulation evidence can establish state correctness, while GPU, multi-device and fleet claims require measurements on that exact hardware.

- A request and engine architecture map, analytical model, immutable workload manifest, validated load generator and raw phase-separated baseline traces.
- One scheduler, KV, routing, instrumentation or kernel contribution with fallback, correctness and fault tests, three ablations, three workload regions and a preserved neutral or negative result.
- A production operations and evaluation package with SLO and quality goodput, capacity and cost, isolation, canary and rollback, runbooks, evidence labels and independent reproduction.

**Capstone rubric** (about 20 to 30 hours)

| Criterion | Pass | Strong |
| --- | --- | --- |
| Baseline and workload | Architecture map locates owners, analytical model predicts bounds, manifests bind revisions, generator passes validation, and raw phase-separated traces are retained. | Predictions precede measurement with residuals explained, and tuning stays separate from final traces. |
| Contribution and boundary | One scheduler, KV, routing, instrumentation or kernel contribution ships behind versioned fallback, passes correctness and fault suites, and keeps three ablations across three regions with a negative row. | Ablations isolate mechanisms, losing regimes set dispatch bounds, and fallback is drilled. |
| Operations and evaluation | SLO and quality goodput, capacity and cost, isolation, canary with rollback, runbooks and evidence labels are shown with independent reproduction. | Recovery is load-tested, budgets burn by tier, and a second operator regenerates decision-critical evidence. |
| Reproducibility and judgment | A clean checkout regenerates claims from raw evidence, protections have injected-defect tests, and scoped claims state hardware and simulation limits. | Losing rows stay visible, fleet numbers stay labeled simulated unless measured, and maintenance costs join the decision. |

