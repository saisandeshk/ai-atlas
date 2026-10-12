<!-- Generated from content/curriculum.json. Edit the JSON and run npm run content:generate. -->

# 07. LLM Foundations

**Level:** Core  
**Scope:** 5 sections · 101 required topics · 21 optional, depth, or later topics

Build the tokenizer-to-cached-generation path, test every causal and state boundary, and connect model quality claims to evaluation and arithmetic.

## Order

01. Tokenization, Corpus Identity & Packed Data
02. Decoder Transformer Mechanics
03. Causal Training, Checkpointing & Generation
04. Evaluation, Claims & Model Arithmetic
05. KV Cache, Prefill & Decode

## 01. Tokenization, Corpus Identity & Packed Data

**Why:** The model sees token identities and loss masks rather than raw text. This section makes every transformation from bytes to training examples deterministic, reversible where promised and auditable across splits.

### Learn this much

- [ ] Unicode code points, byte encodings and invalid-byte policy _(Required)_
- [ ] Normalization choices and distinctions they erase _(Required)_
- [ ] Character, byte and token counts _(Required)_
- [ ] Byte-level tokenization and complete input coverage _(Required)_
- [ ] BPE pair counts, merges and deterministic tie breaking _(Required)_
- [ ] Unigram tokenizer intuition and contrast with BPE _(Required)_
- [ ] Vocabulary size, token fertility and sequence-length trade-offs _(Required)_
- [ ] Special-token IDs, boundaries and injection policy _(Required)_
- [ ] Encode, decode, round-trip and serialized tokenizer identity _(Required)_
- [ ] Streaming inputs and chunk-boundary invariance _(Required)_
- [ ] Documents, boundary tokens, truncation and packing _(Required)_
- [ ] Causal loss masks across packed document boundaries _(Required)_
- [ ] Source and document identities, lineage and provenance _(Required)_
- [ ] Split-before-fit and split-before-pack discipline _(Required)_
- [ ] Exact deduplication and near-duplicate strategy _(Required)_
- [ ] Contamination probes and false-match review _(Required)_
- [ ] Filtering reasons, yield and representative slices _(Required)_
- [ ] Mixture weights, sampling units and token exposure _(Required)_
- [ ] Deterministic sharding, manifests and restart behavior _(Required)_
- [ ] Tokenizer comparisons across language and code slices _(Optional)_
- [ ] Small PII, toxicity and quality-filter policy exercise _(Optional)_
- [ ] Internet-scale crawling and distributed corpus processing _(Later)_
- [ ] Full Unigram tokenizer training and production data governance _(Later)_

### Study units

#### U1. Text as bytes: Unicode, encodings and normalization

**About 3 h** · **Target:** Explain

Topics: Unicode code points, byte encodings and invalid-byte policy; Normalization choices and distinctions they erase; Character, byte and token counts

A tokenizer receives encoded text, not the glyphs on your screen. A silent decoding or normalization change can alter document identity before BPE even starts.

**You can now**

- Explain why code-point, UTF-8 byte and token counts differ, including combining marks and control characters.
- Defend a normalization and invalid-byte policy, and state which distinctions it cannot preserve.
- Predict whether a round trip returns the original text or only its normalized form.

**Study**

1. [CS336 Assignment 1: Unicode and encodings](https://github.com/stanford-cs336/assignment1-basics/blob/main/cs336_assignment1_basics.pdf) (Stanford CS336 Assignment 1 - tokenizer contract) - Sections 2.1 and 2.2, including Problems (unicode1) and (unicode2) (pp. 3 to 5); Section 2.6.2, Decoding text (p. 11).
2. [Canonical and compatibility normalization](https://docs.python.org/3/library/unicodedata.html#unicodedata.normalize) (Python unicodedata - normalization forms) - unicodedata.normalize: NFC, NFD, NFKC and NFKD, with the cedilla and Roman numeral examples; unicodedata.unidata_version.
3. [Normalization and pre-tokenization](https://huggingface.co/learn/llm-course/chapter6/4#normalization) (Hugging Face LLM Course - tokenizer translation) - Normalization, Pre-tokenization and SentencePiece: normalize_str and the repeated-space examples. Depth: Stop before Algorithm overview. Use the library calls to inspect behavior, not to replace your later blank-file implementation.

**Focus**

- Python len(str) counts code points, not visible grapheme clusters. UTF-8 uses one to four bytes per Unicode scalar value; token counts depend on the tokenizer.
- NFC merges canonically equivalent spellings. NFKC also collapses compatibility distinctions; lowercasing and accent stripping are separate choices.
- Rejecting malformed UTF-8, replacing it and preserving raw bytes are different contracts. The CS336 text decoder uses replacement, not a reversible arbitrary-byte interface.
- Record the encoding, error policy, normalization form and Unicode database version before comparing counts or content hashes.

**Reproduce:** Without notes, make a count table for 'é', 'e\u0301', '牛' and chr(0): code points and UTF-8 bytes before and after NFC. Explain why the first two become identical under NFC, but a token count still needs a named tokenizer.

**Traps**

- Decoding one byte at a time. A UTF-8 character can span several bytes, so concatenate token bytes before decoding.
- Promising raw-text round trips after lowercasing or normalization. Lost distinctions cannot be recovered from token IDs alone.
- Using errors='ignore' as cleanup. It deletes malformed bytes and can make distinct raw documents look identical.

**Practice**

- [Hugging Face LLM Course: cased versus uncased normalization](https://huggingface.co/learn/llm-course/chapter6/4#normalization) - Try it out! in Normalization: pass 'Héllò hôw are ü?' to bert-base-cased and bert-base-uncased normalizers. Write down the erased distinctions. Then check the count table from Reproduce with Python and state an explicit invalid-byte policy for your corpus.

**Stop when:** Your count table agrees with Python, and you can predict the cased/uncased outputs and explain exactly what your decoding and normalization policy loses.

<details>
<summary>Self-test</summary>

1. Why can 'é' and 'e\u0301' look identical but have different lengths?
   - The first has one code point and two UTF-8 bytes. The second has two code points and three bytes. Both represent the same canonical text; NFC maps both to 'é'.
2. What happens to the Roman numeral 'Ⅰ' under NFC and NFKC?
   - NFC retains it. NFKC maps it to the Latin capital letter 'I', erasing the compatibility distinction.
3. Does complete byte vocabulary coverage make replacement decoding reversible for malformed input?
   - No. Token bytes can preserve the input, but replacing malformed UTF-8 with U+FFFD loses information. Keep a separate raw-byte path if that round trip is promised.
4. Is chr(0) an empty string or a text terminator in Python?
   - Neither. It is the NUL code point, has length one and encodes as byte 0. It may be invisible when printed but remains in the string.

</details>

#### U2. Byte-level BPE: training, merges and tie-breaking

**About 6 h** · **Target:** Derive + Implement

Topics: Byte-level tokenization and complete input coverage; BPE pair counts, merges and deterministic tie breaking

Every later count in this stage, from sequence lengths to KV-cache bytes, is measured in tokens, and BPE decides what a token is. The merge list is part of the model's identity: change one tie-break and every token ID downstream shifts.

**You can now**

- Run BPE training by hand on a small corpus, apply the tie-breaking rule, and predict the merge list.
- Implement byte-level BPE training from a blank file, with regex pre-tokenization and special tokens as hard boundaries.
- Explain why a byte-level vocabulary encodes any input without an unknown token.

**Study**

1. [BPE tokenizer from scratch (notebook)](https://github.com/rasbt/LLMs-from-scratch/blob/main/ch02/05_bpe-from-scratch/bpe-from-scratch.ipynb) (LLMs from Scratch companion - tokenization and data loading) - Sections 1.1 to 1.4 for bytes, the vocabulary and a worked example, then 3.1 for training, encoding and decoding. Depth: Skim section 2, the simple implementation. Skip 3.3, loading OpenAI's GPT-2 files, until the identity unit.
2. [CS336 Assignment 1 handout](https://github.com/stanford-cs336/assignment1-basics/blob/main/cs336_assignment1_basics.pdf) (Stanford CS336 Assignment 1 - tokenizer contract) - Section 2.4, BPE Tokenizer Training, with Example (bpe_example) (pp. 5 to 7), then Section 2.5 on removing special tokens before pre-tokenization and optimizing the merge step (pp. 8 to 9).

**Focus**

- The base vocabulary is all 256 byte values, so coverage is complete before the first merge. Merges only shorten sequences.
- Pairs are counted inside pre-tokens, weighted by how often each pre-token occurs. No pair crosses a pre-token or special-token boundary.
- Ties go to the lexicographically greater pair. Without a fixed rule, two correct trainers produce different merge lists.
- After a merge, only the counts of pairs that overlap the merged occurrences change. Updating just those makes training fast.

**Reproduce:** By hand, train on the CS336 example corpus (low x5, lower x2, widest x3, newest x6) for six merges and get s t, e st, o w, l ow, w est, n e. Then tokenize newest as [ne, west].

**Traps**

- Decoding token bytes to str to compare or print them. A merged token can be a partial UTF-8 sequence, so decoding fails or maps distinct tokens to the same replacement character.
- Pre-tokenizing before splitting on special tokens. Their text then enters the pair counts as ordinary pieces such as <| and endoftext, and steals merges.
- Treating vocab_size as the number of merges. It includes the 256 byte values, the merges and the special tokens.

**Practice**

- [CS336 Assignment 1: train_bpe](https://github.com/stanford-cs336/assignment1-basics/blob/main/tests/test_train_bpe.py) - Problem (train_bpe) in Section 2.4; connect your trainer to run_train_bpe in tests/adapters.py and pass tests/test_train_bpe.py. The public tests compare your merges and vocabulary with a reference, check special-token handling, and require training on the small fixture in under 1.5 seconds. Implement it in your own repository.

**Stop when:** You reproduce the six example merges by hand, and your own trainer passes all three tests in tests/test_train_bpe.py.

<details>
<summary>Self-test</summary>

1. Why can byte-level BPE encode any string, while a character vocabulary built from a corpus cannot?
   - Its base vocabulary holds all 256 byte values, and every string has a UTF-8 encoding. A character vocabulary covers only the characters seen in training, so an unseen character needs an unknown token.
2. The pairs (A, B), (A, C), (B, ZZ) and (BA, A) tie for the highest count. Which one merges under the CS336 rule?
   - (BA, A). The rule takes the lexicographically greatest pair, and BA sorts after A and B.
3. After (s, t) merges into st, which pair counts can change?
   - Only counts next to the merged occurrences. Each neighbouring pair (x, s) or (t, y) loses those occurrences, the new pairs (x, st) and (st, y) gain them, and (s, t) loses every occurrence that merged. All other counts stay the same.
4. A training file contains [Doc 1]<|endoftext|>[Doc 2]. What goes wrong if you pre-tokenize it without splitting on the special token first?
   - The special token's text is pre-tokenized like ordinary text, so its pieces enter the pair counts and can earn merges. The trainer should split on special tokens so that they act as hard boundaries and contribute nothing to the counts.

</details>

#### U3. Tokenizer design choices: vocabulary size, Unigram and special tokens

**About 3 h** · **Target:** Explain + Derive

Topics: Unigram tokenizer intuition and contrast with BPE; Vocabulary size, token fertility and sequence-length trade-offs; Special-token IDs, boundaries and injection policy; Tokenizer comparisons across language and code slices

A shorter token sequence buys context space, but a larger vocabulary costs parameters and output work. Special-token recognition also decides whether ordinary input can impersonate a document boundary.

**You can now**

- Contrast BPE's ordered merges with Unigram's scored segmentations and vocabulary pruning.
- Derive bytes-per-token, sequence-count and vocabulary-axis parameter consequences of a vocabulary change.
- Define fixed special-token IDs and distinguish trusted boundary insertion from matching untrusted literal text.
- Compare tokenizer efficiency on matched language and code slices without treating compression as model quality.

**Study**

1. [Unigram tokenization](https://huggingface.co/learn/llm-course/chapter6/7#tokenization-algorithm) (Hugging Face LLM Course - tokenizer translation) - Training algorithm, Tokenization algorithm and Back to training; the Viterbi explanation and the 'huggun' Now your turn! question. Depth: Stop before Implementing Unigram. Recompute examples from the frequency table: the printed 'pug' products mistakenly use 5 rather than 17 for p and pu.
2. [BPE vocabulary sizes and special tokens](https://github.com/walkinglabs/modern-llm-notebook/blob/979eecf09669121167184ef925d8edbc089fc13e/notebooks-en/part1-foundation/02-bpe-tokenizer.ipynb) (Modern LLM Notebook - tokenization and data experiments) - Vocabulary Sizes in Practice and Appendix: Special Tokens and the Vocabulary, immediately before Summary. Depth: Treat the vocabulary-size ranges as examples, not an optimum for every language or corpus. Skip the later step-by-step BPE appendix.
3. [Compression and special-token contracts](https://github.com/stanford-cs336/assignment1-basics/blob/main/cs336_assignment1_basics.pdf) (Stanford CS336 Assignment 1 - tokenizer contract) - Section 2.3 (p. 5), Special tokens in Section 2.4 (pp. 6 to 7), and Problem (tokenizer_experiments), parts (a) and (b) in Section 2.7 (p. 12). Depth: Use the experiment's matched-sample method on small local slices; do not train the full OpenWebText tokenizer here.
4. [Reserved-token policy](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/tokenizer-corpus-pipeline.md#architecture-constraints) (Tokenizer and Corpus Pipeline - reduced foundation slice) - Architecture constraints: reserved tokens cannot be produced from ordinary text unless explicitly escaped or policy-defined.

**Focus**

- Unigram maximizes a segmentation's product of token probabilities, or minimizes its summed negative logs. BPE follows merge ranks; neither is simply longest-prefix matching.
- For B bytes encoded as T tokens, compression is B/T. Compare the same text and preprocessing on each tokenizer, and report per-slice results rather than only a pooled mean.
- Adding delta-V tokens adds delta-V times d embedding parameters, plus the same again for an untied output head. Shorter sequences do not make vocabulary costs disappear.
- CS336 deliberately recognizes configured special strings. A corpus-facing interface needs a separate policy for untrusted literals and trusted boundary insertion.

**Reproduce:** Closed-book, score both segmentations of 'ab' with P(a)=0.4, P(b)=0.4 and P(ab)=0.2, and select [ab]. Then derive that 12,000 bytes at 3 versus 4 bytes/token require 4,000 versus 3,000 tokens, or 8 versus 6 length-512 windows if the tail is padded.

**Traps**

- Assuming the fewest-token Unigram segmentation always wins. Token probabilities, not token count alone, determine the score.
- Calling a tokenizer better because it compresses English prose more. Code, other languages, throughput and downstream behavior can disagree.
- Letting a user-typed EOS spelling silently acquire the trusted EOS ID. Decide whether to reject, escape or encode it as ordinary bytes.

**Practice**

- [Hugging Face LLM Course: Unigram 'huggun' segmentation](https://huggingface.co/learn/llm-course/chapter6/7#tokenization-algorithm) - Now your turn!: determine the tokenization of 'huggun' and its score. Enumerate valid paths from the given vocabulary and frequency table before using code. The best path is [hug, g, un], with score (15/210)*(20/210)*(16/210).
- [Deep-ML Lab 19: Build a Tokenizer for Language Modeling](https://www.deep-ml.com/labs/19) - Implement train_tokenizer(corpus, vocab_size) in standard Python; the lab trains a bigram model on your tokens and scores held-out bits per character. Free in the browser. Compare a byte-level baseline with BPE at the full 256-token budget, and check whether the better compressor also gives the lower bits per character.

**Stop when:** You solve the segmentation and window-count examples without notes, and can defend vocabulary and literal-special-token policies with separate prose, code and non-English examples.

<details>
<summary>Self-test</summary>

1. Why can Unigram choose a segmentation that is not the longest available prefix?
   - It scores the whole path. A shorter first piece can lead to a larger total probability; Viterbi compares complete paths through the token lattice.
2. A 32,000-token vocabulary grows to 48,000 at width 512. How many parameters does one embedding matrix gain?
   - 16,000 times 512 = 8,192,000. An untied output matrix gains another 8,192,000; a tied matrix does not.
3. A 1,000-byte sample takes 250 tokens with tokenizer A and 400 with B. What is the compression ratio?
   - A has 4 bytes/token and B has 2.5. A uses fewer tokens on this sample; that alone says nothing about model quality.
4. Does reserving an EOS ID prevent special-token injection?
   - No. The encoder must also distinguish trusted insertion from untrusted literal text. Reserving an ID only establishes its meaning.

</details>

#### U4. A tokenizer you can trust: round trips, identity and streaming

**About 6 h** · **Target:** Implement

Topics: Encode, decode, round-trip and serialized tokenizer identity; Streaming inputs and chunk-boundary invariance

A round trip can succeed even when token IDs differ from the model's training IDs. Serialization and streaming must preserve the exact encoding, not just readable text.

**You can now**

- Implement encode, decode and reload from a byte vocabulary and ordered merges without changing token IDs.
- Test multilingual text, whitespace, controls, overlapping specials and malformed decoded byte sequences against a stated contract.
- Preserve one-shot token IDs across streaming splits, retaining unfinished text until a safe boundary is known.
- Reject tokenizer artifacts whose vocabulary, merge ranks or preprocessing policy differs from the expected identity.

**Study**

1. [Encoding, decoding and iterable input](https://github.com/stanford-cs336/assignment1-basics/blob/main/cs336_assignment1_basics.pdf) (Stanford CS336 Assignment 1 - tokenizer contract) - Section 2.6, including Example (bpe_encoding), Memory considerations, Section 2.6.2 and Problem (tokenizer) (pp. 10 to 12).
2. [Saving, loading and reference tokenizer files](https://github.com/rasbt/LLMs-from-scratch/blob/main/ch02/05_bpe-from-scratch/bpe-from-scratch.ipynb) (LLMs from Scratch companion - tokenization and data loading) - Sections 3.2, Saving and loading the tokenizer, and 3.3, Loading the original GPT-2 BPE tokenizer from OpenAI. Depth: Use the save/reload examples as a workflow, not a byte-correctness oracle. Keep the CS336 bytes-based representation and test against tiktoken through the public suite.
3. [Public tokenizer acceptance cases](https://github.com/stanford-cs336/assignment1-basics/blob/main/tests/test_tokenizer.py) (Stanford CS336 Assignment 1 - tokenizer contract) - test_roundtrip_unicode_string, test_overlapping_special_tokens, the two test_encode_special_token_* cases, and test_encode_iterable_tinystories_matches_tiktoken; test_encode_iterable_memory_usage.
4. [Tokenizer identity and adversarial boundaries](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/tokenizer-corpus-pipeline.md#correctness-requirements) (Tokenizer and Corpus Pipeline - reduced foundation slice) - Correctness requirements: supported round trip and deterministic versioned merges/IDs; Failure-injection requirements: malformed encoding, corrupt model and stale tokenizer.

**Focus**

- Match exact IDs as well as decoded text. Two vocabularies can reconstruct the same bytes while indexing different embedding rows.
- Persist the ID-to-bytes map, ordered merges, special IDs, regex and normalization/error policies. Encode bytes losslessly in the artifact and hash a canonical serialization.
- A transport chunk is not a pre-token. Retain unfinished pre-tokens, whitespace lookahead and special-token prefixes; use an incremental UTF-8 decoder if the input arrives as bytes.
- CS336's iterable tests use file lines. Add every split point of short strings and splits inside special literals; the public suite alone does not prove arbitrary chunk invariance.

**Reproduce:** From a blank file, load your byte vocabulary and merge ranks, encode and decode a string, then serialize and reload. For a short multilingual string containing spaces and a configured special token, assert that every two-chunk split yields the same IDs as one-shot encoding under the same special-token policy.

**Traps**

- Encoding every incoming chunk independently. A split inside a pre-token or special literal changes IDs even when concatenated decoded text is unchanged.
- Serializing vocabulary bytes as decoded Unicode. Partial UTF-8 token bytes can fail decoding or collide under replacement.
- Claiming a fixed memory bound while buffering an arbitrarily long unfinished pre-token. State the maximum-document/pre-token policy and never silently truncate it.

**Practice**

- [CS336 Assignment 1: tokenizer](https://github.com/stanford-cs336/assignment1-basics/blob/main/tests/test_tokenizer.py) - Problem (tokenizer), Section 2.6; connect your implementation to get_tokenizer in tests/adapters.py and run tests/test_tokenizer.py. Implement in your own repository. The encode memory test is expected to fail; the iterable memory test is Linux-only. Add reload identity, arbitrary chunk-split and malformed-byte properties beyond the public cases.

**Stop when:** The public tokenizer suite has no unexpected failures, and your own reload and every-split-point tests preserve exact IDs while a changed tokenizer identity is rejected.

<details>
<summary>Self-test</summary>

1. Why is decode(encode(text)) == text insufficient to establish tokenizer compatibility?
   - Different ID assignments or segmentations can decode to the same text. Compatibility also requires identical IDs for the same input and identical preprocessing and special-token policies.
2. An input chunk ends with '<|endo'. Can you emit its ordinary-text IDs immediately?
   - Not if special recognition is enabled: the next chunk may complete '<|endoftext|>'. Retain the possible special-token prefix until it is resolved.
3. A token ends with byte 0xC3 and the next begins with 0xA9. How should the decoder handle them?
   - Concatenate their bytes first. Together they encode 'é'; decoding each token separately can raise or insert replacement characters.
4. Can a decoder with errors='replace' promise a round trip for arbitrary raw bytes?
   - No. It can round-trip supported valid text, but malformed raw bytes are changed. Preserve them with a separate byte decoder if the byte contract requires it.

</details>

#### U5. From documents to training examples: packing and loss masks

**About 4 h** · **Target:** Derive + Implement

Topics: Documents, boundary tokens, truncation and packing; Causal loss masks across packed document boundaries; Split-before-fit and split-before-pack discipline

Packing changes which tokens become context and which predictions enter the loss. An EOS token marks a boundary, but it does not enforce attention isolation or remove an unwanted target.

**You can now**

- Derive shifted inputs, targets and valid-loss positions for packed documents, including EOS and padding.
- Implement packing with document lineage, a declared truncation/tail policy and separate attention and loss masks.
- Keep split ownership fixed before fitting a tokenizer or packing, so evaluation text cannot become training context.

**Study**

1. [Shifted targets and sliding windows](https://github.com/rasbt/LLMs-from-scratch/blob/main/ch02/01_main-chapter-code/ch02.ipynb) (LLMs from Scratch companion - tokenization and data loading) - Section 2.4: EOS between independent sources; Section 2.6, Data sampling with a sliding window: GPTDatasetV1 and stride/context-length examples. Depth: Stop before Section 2.7. The single-text loader is a baseline; it does not supply document isolation or split-safe corpus construction.
2. [Data loader intuition with integers](https://github.com/rasbt/LLMs-from-scratch/blob/main/ch02/04_bonus_dataloader-intuition/dataloader-intuition.ipynb) (LLMs from Scratch companion - tokenization and data loading) - Data sampling with a sliding window with number data: GPTDatasetV1, then max_length=4 with stride=1 and stride=4. Depth: Stop before Finally, a data loader with shuffling. Track indices and the last omitted tail rather than running the full number file.
3. [Split ownership and packed boundary contract](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/tokenizer-corpus-pipeline.md#core-requirements) (Tokenizer and Corpus Pipeline - reduced foundation slice) - Core requirements: split assignment before leakage-causing transforms and deterministic sample/pack construction with document-boundary/loss-mask policy; Architecture constraints: evaluation data cannot influence vocabulary/filters/mixture; Correctness requirements: fixed split ownership and packed masks. Depth: Apply these requirements to a few local documents. Do not implement the full project or distributed corpus processing.

**Focus**

- Declare whether packed documents may attend to earlier documents. Continuous-stream training and isolated-document training are different objectives; neither policy is created by EOS alone.
- For isolated documents, attention allows j <= i only within the same document. The loss mask separately excludes padding targets and cross-document next-token transitions.
- Attach EOS to the document it ends. Predicting that EOS is valid; predicting the next document's first token from that EOS is masked under the isolated policy.
- Split raw documents or duplicate groups before fitting and packing. Record token spans back to document IDs, and account for every retained, padded or deliberately dropped tail token.

**Reproduce:** Closed-book, pack A=[11,12] and B=[21,22] with EOS=9 into z=[11,12,9,21,22,9]. For x=z[:-1] and y=z[1:], derive y=[12,9,21,22,9] and isolated-document loss mask [1,1,0,1,1]. Build the lower-triangular same-document attention mask for x and explain which prediction it does not remove by itself.

**Traps**

- Masking EOS as if it were padding. The last content token should usually learn to predict its own document's EOS.
- Using only a block-diagonal attention mask. The shifted label after one document's EOS can still be the next document's first token unless loss is masked too.
- Splitting after packing or overlapping-window construction. The same document can enter both splits, even when their packed rows differ.

**Practice**

- The section mini-project covers this: split-before-fit and split-before-pack, document-span lineage, EOS/tail handling, and independently checked shifted loss and attention masks.

**Stop when:** Your packer matches the hand-derived inputs, targets and both masks on two documents, padding and an overlength document, with no document ID shared across splits.

<details>
<summary>Self-test</summary>

1. In Reproduce, which target is excluded and why?
   - Target 21 at x position 2 is excluded: its context token is A's EOS, but 21 belongs to B. Predictions of either document's EOS remain valid.
2. Does masking a loss position stop that token from being used as context?
   - No. Loss masking removes a prediction from the objective. Attention masking controls which input tokens can influence later representations.
3. With ten tokens, context length four and stride four, how many complete shifted windows does the notebook loader produce?
   - Two, starting at 0 and 4. Each needs five stream tokens to make four input-target pairs; the remaining suffix cannot form another complete window.
4. Why split before fitting the tokenizer if no evaluation examples enter model training?
   - Fitting on evaluation text still uses held-out distribution information to choose the representation. Fit on training data unless a separate, declared evaluation protocol permits otherwise.

</details>

#### U6. Provenance, deduplication and contamination

**About 4 h** · **Target:** Implement

Topics: Source and document identities, lineage and provenance; Exact deduplication and near-duplicate strategy; Contamination probes and false-match review

Distinct files can contain the same document, and distinct documents can share an evaluation answer. Deduplication and contamination checks need traceable identities, not just a smaller output corpus.

**You can now**

- Implement stable raw document IDs and retain source, transformation versions and duplicate-cluster lineage.
- Remove exact duplicates under a declared byte policy and implement a small shingle-based near-duplicate comparison.
- Probe train/evaluation overlap, review false matches and report what the detector cannot establish.

**Study**

1. [Exact deduplication, shingles and overlap probes](https://github.com/walkinglabs/modern-llm-notebook/blob/979eecf09669121167184ef925d8edbc089fc13e/notebooks-en/part2-training/15-data-engineering.ipynb) (Modern LLM Notebook - tokenization and data experiments) - Sections 3.1 and 3.2 with Exact Dedup and MinHash approximate deduplication code; Section 3.3, Decontamination, with word_ngrams and max_overlap; Exercises, Exercise 2: Complete Jaccard similarity. Depth: Use exact Jaccard as the small-corpus oracle. Treat the four-position MinHash as a noisy demonstration and the stated corpus-removal percentages as unverified examples, not expected results.
2. [Provenance and duplicate-cluster contract](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/tokenizer-corpus-pipeline.md#architecture-constraints) (Tokenizer and Corpus Pipeline - reduced foundation slice) - Core requirements: versioned schemas, source/document identities, exact/near dedup and contamination probes; Architecture constraints: raw source identity and separate versioned stages; Correctness requirements: cluster lineage; Failure-injection requirements: hash collision simulation and duplicate clusters spanning sources/splits. Depth: Implement a tiny exact pipeline and all-pairs shingle comparison. Leave large-scale approximate search and distributed processing for later.

**Focus**

- Keep source ID, stable raw record ID, raw-byte hash, normalized-content hash and transform version separately. A normalization collision is not evidence that two raw records were identical.
- Use the full digest and verify bytes within a candidate hash bucket. Choose a deterministic representative and retain every removed member's source and raw identity.
- Define shingles, Jaccard threshold and empty-set behavior. Similarity is not transitive: connected-component clustering can join two endpoints below the pairwise threshold.
- The notebook's contamination score is shared evaluation shingles divided by evaluation shingles, not Jaccard. Common boilerplate can trigger it, while paraphrases and non-Latin text can escape its ASCII-word regex.

**Reproduce:** From a blank file, deduplicate a few documents by full SHA-256 plus byte equality, retaining cluster lineage. Compute exact word-shingle Jaccard for a copied, lightly edited and unrelated pair; plant a held-out passage in one training document and emit the matched spans and both record IDs for review.

**Traps**

- Replacing a raw ID with a normalized-text hash. Different sources or byte spellings can collapse, and the audit loses their origins.
- Hashing and splitting each record independently before handling duplicates. A duplicate cluster can span train and evaluation; fix group ownership or quarantine cross-split matches before packing.
- Calling a no-hit report proof of no contamination. Exact and shingle probes miss transformed content, and short common matches need review.

**Practice**

- The section mini-project covers this: raw and transformed document identities, exact and near-duplicate lineage, planted train/evaluation overlap, collision simulation and false-match review.

**Stop when:** Your small pipeline retains all removed-record lineage, detects a planted overlap and survives a simulated hash collision, with reviewed false matches and explicit limits on any no-hit claim.

<details>
<summary>Self-test</summary>

1. Two records have the same NFC text but different raw bytes. Which identities should survive?
   - Both raw record IDs and raw hashes survive in lineage. They may share a normalized-content hash and cluster only if the declared dedup policy permits it.
2. Shingle sets have three members each and share two. What is their Jaccard score?
   - 2/(3+3-2) = 0.5. The denominator is the union, not the size of the smaller set.
3. A four-word evaluation phrase appears in a long training article. Why can containment be 1 while Jaccard is small?
   - Every evaluation shingle is present, so the containment denominator is fully covered. Jaccard also counts the many unrelated training shingles in its union.
4. A-B and B-C exceed the near-duplicate threshold. Must A-C exceed it?
   - No. Threshold similarity is not transitive. A connected-component policy can group A and C anyway, so document that choice and review its removals.

</details>

#### U7. Filtering, mixtures and deterministic shards

**About 5 h** · **Target:** Explain + Implement

Topics: Filtering reasons, yield and representative slices; Mixture weights, sampling units and token exposure; Deterministic sharding, manifests and restart behavior; Small PII, toxicity and quality-filter policy exercise

Filter and mixture choices determine which text the model repeatedly sees. A reproducible recipe also needs stable shard contents and restart state, not just a random seed.

**You can now**

- Implement versioned filter decisions and quantify retained documents, bytes and tokens by source and representative slice.
- Distinguish document sampling probabilities from token exposure and defend a small source mixture.
- Publish deterministic, checksummed local shards and resume without omitted or duplicated records under a fixed configuration.
- Use synthetic examples to distinguish PII redaction, toxicity review and quality filtering without claiming production safety.

**Study**

1. [Filter decisions and source mixtures](https://github.com/walkinglabs/modern-llm-notebook/blob/979eecf09669121167184ef925d8edbc089fc13e/notebooks-en/part2-training/15-data-engineering.ipynb) (Modern LLM Notebook - tokenization and data experiments) - Section 2.1 with quality_check; Section 2.3, PII and Safety Filtering, with redact_or_drop; Sections 4.1 and 4.2 with source effective-token amounts and Recipe A/B; Exercises 1 and 3. Depth: Skip Section 2.2 and Sections 4.3 onward. The rules and recipe scores are teaching examples, not validated quality thresholds or measured model results. Use only synthetic sensitive-data examples.
2. [Shard ownership, mixture sampling and iterator state](https://huggingface.co/docs/datasets/stream) (Hugging Face Datasets - streaming, sharding and resume) - Shard under Split dataset; Interleave, including probabilities and stopping_strategy; Save a dataset checkpoint and resume iteration, including its shuffle-buffer warning; Export. Depth: Use tiny local records and the six-record checkpoint example. Skip remote corpus downloads, the training loop and Save to the Hub. Library resume is a comparison, not a substitute for testing your own exact-resume contract.
3. [Auditable recipes and local shard publication](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/tokenizer-corpus-pipeline.md#core-requirements) (Tokenizer and Corpus Pipeline - reduced foundation slice) - Core requirements: mixture weights, deterministic sample/pack construction, checksums, atomic manifests and resume; Architecture constraints: manifests instead of directory discovery; Milestone B: per-stage counts and filter samples; Correctness requirements: complete nonoverlapping shards. Depth: Keep one process and a few local shards. Leave distributed storage, production classifiers and internet-scale processing for later.

**Focus**

- Log keep, redact, reject or review with a reason and policy version. Report yields by source/language/code slice and by documents, bytes and tokens; a smaller corpus is not automatically better.
- For source document probability p_s and mean retained length L_s, expected token share is p_s*L_s divided by sum(p_j*L_j), before truncation and exhaustion effects. Declare the sampling unit and replacement policy.
- A manifest fixes ordered shard paths, checksums, counts, split, tokenizer identity and recipe version. Publish only complete shards and reject resume under a changed configuration.
- Exact resume needs input/shard cursor, sampling RNG, any shuffle buffer and the unfinished pack. HF's documented iterable resume loses buffered shuffle examples; a seed alone does not restore them.

**Reproduce:** Build a tiny local recipe that records filter reasons, samples two unequal-length sources and writes ordered shards plus a checksummed manifest. Save the cursor, RNG and partial-pack state, interrupt mid-shard, and compare the resumed record IDs, token exposure and artifact bytes with an uninterrupted run.

**Traps**

- Applying English word-length and punctuation rules to code or languages without spaces. Inspect false rejections by slice before choosing thresholds.
- Treating email regex redaction or a toxic-word hit as a safety guarantee. Names, context and obfuscation can escape it; benign quotations can be flagged.
- Rebuilding shard order from a directory listing or restarting from only a seed. Either can change the next record, duplicate work or lose a partially built pack.

**Practice**

- The section mini-project covers this: reason-coded filters on representative slices, a synthetic PII/toxicity/quality policy table, source token-exposure accounting, deterministic shard manifests and interruption/resume equivalence.

**Stop when:** An interrupted and uninterrupted small run produce identical ordered IDs and artifact checksums, changed-config resume is rejected, and your audit explains filter yields and observed document versus token shares.

<details>
<summary>Self-test</summary>

1. Sources A and B are sampled equally by document, with mean lengths 100 and 900 tokens. What token share is expected?
   - About 10% A and 90% B before exhaustion or truncation. Equal document probabilities do not imply equal token exposure.
2. What should you report if a filter retains 80% of documents but only 30% of tokens?
   - Both yields and per-slice results. The filter disproportionately removed long documents; neither number establishes a quality improvement.
3. Why does HF's iterable state checkpoint not guarantee exact shuffled continuation?
   - The documented shuffle buffer is lost on resume and refilled. The saved shard/example position alone does not restore the buffered records or their future order.
4. A crash leaves a shard file but no manifest entry. Should the reader consume it?
   - No. Read only completed, validated artifacts declared in the manifest. Recovery must verify or rebuild unpublished work before publishing it.
5. What does a synthetic toxicity-policy test demonstrate?
   - That declared keep/reject/review behavior is implemented on those examples. It does not demonstrate calibrated detection, generalization or production safety.

</details>

### Mini-project: Tokenizer and corpus audit pack

**About 12 to 16 hours.** Turn a small public-domain corpus into a packed, auditable training split with your own byte-level BPE. Every packed token traces back to a source document, and every claim about the split, such as no duplicates across splits and no planted evaluation text in training, is backed by a test or a report you can rerun.

1. Start one repository for the whole stage: a uv project with a src package and a tests folder. Pick a small public-domain corpus under 20 MB, such as a few Project Gutenberg books or the TinyStories validation file.
2. Implement BPE training, encoding, decoding and streaming encoding. Connect them to tests/adapters.py in your clone of the CS336 assignment and pass tests/test_train_bpe.py and tests/test_tokenizer.py.
3. Serialize the tokenizer canonically with a content hash, and make loading fail on a changed merge list, special-token set or normalization policy.
4. Assign raw documents to train and evaluation splits by a stable hash of their raw ID, before fitting the tokenizer or packing. Record source, raw hash, normalized hash and transform version for each document.
5. Remove exact and near duplicates while keeping cluster lineage, and simulate a hash collision to show that your byte comparison catches it. Plant three evaluation passages in training documents, make your contamination probe find them, and review its false matches.
6. Apply a reason-coded filter table with quality rules and synthetic PII and toxicity examples, and report document, byte and token yields per source.
7. Pack the training split with EOS boundaries, a loss mask and per-token document IDs. Write ordered, checksummed shards and a manifest, and show that an interrupted run produces byte-identical shards.
8. Connect the atlas lab adapters for section 1 and pass tests/test_s1_data.py.

**Deliverables**

- The tokenizer package with its serialized artifact, identity hash and passing CS336 tokenizer tests.
- The packed training split: shards, manifest, per-token document IDs and loss masks.
- An audit report: split assignment, duplicate clusters, contamination hits with reviewed false matches, filter yields and per-source token shares.
- A resume test that interrupts packing mid-shard and compares checksums with an uninterrupted run.

**Checks**

- external-tests: [CS336 tests/test_train_bpe.py and tests/test_tokenizer.py](https://github.com/stanford-cs336/assignment1-basics/tree/main/tests). Run `uv run pytest tests/test_train_bpe.py tests/test_tokenizer.py`. Run in your clone of the assignment with tests/adapters.py calling your package. test_encode_memory_usage is expected to fail.
- harness: [Atlas lab, section 1: packing, masks, deduplication and contamination](https://github.com/saisandeshk/ai-atlas/tree/main/labs/llm-foundations). Run `uv run pytest tests/test_s1_data.py`. Run in labs/llm-foundations of an ai-atlas clone after you connect adapters.py to your package. It checks the cross-document loss-mask rule, the document attention mask, NFC-aware exact deduplication, exact Jaccard near-duplicates and the 13-gram contamination fraction.
- rubric: Self-grade with the rubric below.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Tokenizer correctness | Both CS336 tokenizer test files pass with no unexpected failures. | Your own property tests also cover every two-chunk split of multilingual strings and partial special-token prefixes, and a reloaded artifact gives identical IDs. |
| Tokenizer identity | Loading rejects a changed merge list or special-token set. | The hash covers a canonical serialization of vocabulary bytes, merges, special tokens, regex and normalization policy, and the error names what changed. |
| Splits and lineage | Splits are assigned before tokenizer fitting and packing, and every packed token maps to a document ID. | Duplicate clusters that span splits are quarantined or reassigned, and the report counts them. |
| Packing and masks | The section 1 lab tests pass. | You also check your masks against a hand-derived example and explain which predictions the attention mask alone would not remove. |
| Deduplication and contamination | The probe finds every planted passage and the report lists its hits. | The report reviews false matches, states what the probe cannot detect, such as paraphrase or translation, and simulates a hash collision. |
| Reproducibility | Rerunning the pipeline gives the same manifest checksums. | An interrupted run resumed from its saved cursor, RNG and partial pack gives byte-identical shards, and a changed config is rejected on resume. |

Feeds into: Capstone artifact 1, the tokenizer and corpus audit pack. Sections 3 and 4 train and evaluate on this split, and every token count in the capstone uses this tokenizer.

### Resource route

- **Primary - Implementation:** [LLMs from Scratch companion - tokenization and data loading](https://github.com/rasbt/LLMs-from-scratch/tree/main/ch02) - Work through the ch02 main notebook, 05_bpe-from-scratch and 04_bonus_dataloader-intuition. Rebuild byte-level BPE, serialization and packed windows in blank files, then add multilingual, control, whitespace and chunk-boundary properties.
- **Required - Assessment:** [Stanford CS336 Assignment 1 - tokenizer contract](https://github.com/stanford-cs336/assignment1-basics) - Read the Assignment 1 tokenizer handout and use the named unicode1, unicode2, train_bpe, tokenizer and tokenizer_experiments specifications plus public tests as an acceptance contract. Implement independently in your own repository and do not copy or modify course solutions.
- **Support - Implementation:** [Modern LLM Notebook - tokenization and data experiments](https://walkinglabs.github.io/modern-llm-notebook/?lang=en) - Run English notebooks 01-tokenizer-basics and 02-bpe-tokenizer. Use only the quality, deduplication and mixture examples from 15-data-engineering. Change the corpus and tie cases, then verify every quantitative claim independently.
- **Support - Project:** [Tokenizer and Corpus Pipeline - reduced foundation slice](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/tokenizer-corpus-pipeline.md) - Use the byte, identity, split, deduplication, contamination, packing, manifest and restart correctness requirements. Keep the corpus small and stop before distributed processing or internet-scale filtering.
- **Optional - Reference:** [Hugging Face LLM Course - tokenizer translation](https://huggingface.co/learn/llm-course/chapter6/1) - After the blank-file tokenizer passes, use the tokenizer chapters to map vocabulary, special tokens, fast tokenizers and batching into library APIs. Do not replace the deterministic implementation gate with a pretrained tokenizer call.
- **Reference - Reference:** [Python unicodedata - normalization forms](https://docs.python.org/3/library/unicodedata.html#unicodedata.normalize) - Read unicodedata.normalize for canonical and compatibility equivalence, and unidata_version for recording the normalization database version.
- **Reference - Reference:** [Hugging Face Datasets - streaming, sharding and resume](https://huggingface.co/docs/datasets/stream) - Read Shard, Interleave, Save a dataset checkpoint and resume iteration, and Export. Use tiny local data and inspect the warning that shuffle buffers are lost on resume; do not download web-scale corpora or upload to the Hub.

### Exit checkpoint

Implement and serialize deterministic byte-level BPE, pass adversarial round-trip, merge-tie, special-token and chunk-boundary tests, then publish a small packed split with provenance and an automated contamination check.

<details>
<summary>Deliberately left for later</summary>

- Internet-scale collection, distributed sharding and data lakes
- Production PII, toxicity and quality classifiers
- Full Unigram training and exhaustive tokenizer comparison

</details>

## 02. Decoder Transformer Mechanics

**Why:** The transformer should be a set of owned tensor operations rather than a diagram or framework class. This section connects shapes, causal information flow, modern block choices and parameter arithmetic.

### Learn this much

- [ ] Token embeddings, vocabulary axis and lookup semantics _(Required)_
- [ ] Absolute, sinusoidal and relative position vocabulary _(Required)_
- [ ] Query, key and value projections with explicit shapes _(Required)_
- [ ] Scaled dot-product attention and the scaling term _(Required)_
- [ ] Stable softmax and causal mask construction _(Required)_
- [ ] Padding masks versus causal masks _(Required)_
- [ ] Head split, transpose, merge and tensor layout _(Required)_
- [ ] Multi-head attention forward and backward behavior _(Required)_
- [ ] Multi-query and grouped-query attention shapes _(Required)_
- [ ] MHA, MQA and GQA parameter and KV trade-offs _(Required)_
- [ ] Rotary Position Embedding as paired rotations _(Required)_
- [ ] RoPE offsets and relative-position identity _(Required)_
- [ ] Residual stream and pre-norm decoder blocks _(Required)_
- [ ] LayerNorm versus RMSNorm _(Required)_
- [ ] GELU, gated feed-forward blocks and SwiGLU _(Required)_
- [ ] Embedding-output weight tying and final logits _(Required)_
- [ ] Initialization and residual-scale vocabulary _(Required)_
- [ ] Decoder composition and configuration ownership _(Required)_
- [ ] Parameter counts and dominant operation terms _(Required)_
- [ ] Slow attention oracle and causal intervention tests _(Required)_
- [ ] Encoder-only BERT contrast _(Optional)_
- [ ] One small MHA versus GQA memory comparison _(Optional)_
- [ ] MLA, MoE and architecture-specific model surveys _(Later)_
- [ ] FlashAttention kernels, sparse attention and long-context methods _(Later)_

### Study units

#### U1. Embeddings, positions and the vocabulary axis

**About 3 h** · **Target:** Explain

Topics: Token embeddings, vocabulary axis and lookup semantics; Absolute, sinusoidal and relative position vocabulary

Token IDs select rows; their numerical order carries no meaning. Position representations supply information that a token lookup alone cannot provide.

**You can now**

- Explain embedding lookup with a [V, D] table and trace [B, T] token IDs to [B, T, D] vectors.
- Distinguish learned absolute positions, fixed sinusoidal positions and relative-position schemes.
- Explain why computing an encoding beyond the training length does not prove useful length extrapolation.

**Study**

1. [Token embedding lookup](https://github.com/walkinglabs/modern-llm-notebook/blob/main/notebooks-en/part1-foundation/03-embedding.ipynb) (Modern LLM Notebook - decoder construction path) - Section 2, Embedding Lookup, including the end-to-end training demo. Depth: Skip the model configuration survey and section 3's corpus training and t-SNE demo.
2. [Absolute and sinusoidal positions](https://github.com/walkinglabs/modern-llm-notebook/blob/main/notebooks-en/part1-foundation/04-position-encoding.ipynb) (Modern LLM Notebook - decoder construction path) - Sections 1 to 3, then Appendix: Extrapolation of Sinusoidal Position Encoding. Depth: Read the relative-position vocabulary in the appendix; leave interpolation and long-context methods for later.

**Focus**

- The vocabulary axis indexes rows. A [B, T] integer tensor gathers vectors without allocating a [B, T, V] one-hot tensor.
- Repeated IDs select identical vectors before position information or contextual layers are applied.
- Learned and sinusoidal encodings are absolute-position representations. RoPE changes Q and K rather than adding a position vector to the input.

**Reproduce:** Closed-book, draw a [3, 2] embedding table, gather IDs [2, 0, 2], and add distinct position vectors. Explain which two vectors match before the addition and why they need not match afterward.

**Traps**

- Treating adjacent token IDs as similar numbers. IDs are labels, not coordinates.
- Calling sinusoidal encoding a guarantee of long-context accuracy. Its formula extends; the learned model's behavior may not.

**Practice**

- [Modern LLM Notebook: Exercise 1, Embedding Lookup](https://github.com/walkinglabs/modern-llm-notebook/blob/main/notebooks-en/part1-foundation/03-embedding.ipynb) - Exercises: Exercise 1, Embedding Lookup; complete the lookup and pass its exact-equality assertion
- [Modern LLM Notebook: Exercise 1, Adding Position Encoding](https://github.com/walkinglabs/modern-llm-notebook/blob/main/notebooks-en/part1-foundation/04-position-encoding.ipynb) - Exercises: Exercise 1, Adding Position Encoding; add the position vectors and pass the repeated-token assertion

**Stop when:** Both named exercises pass, and you explain the lookup shapes and the three position families without notes.

<details>
<summary>Self-test</summary>

1. With V=1000, D=32 and IDs shaped [2, 5], what are the table and output shapes?
   - The table is [1000, 32], the output is [2, 5, 32], and the table has 32,000 parameters.
2. Does moving a token to another position change its raw lookup vector?
   - No. The same ID selects the same row. Position addition or later contextual processing can change its representation.
3. Is sinusoidal encoding relative just because it can express offsets?
   - No. It assigns a vector to each absolute position. Trigonometric identities let fixed offsets relate those vectors; RoPE instead writes a relative rotation into Q-K dot products.

</details>

#### U2. Scaled dot-product attention from scratch

**About 5 h** · **Target:** Derive + Implement

Topics: Query, key and value projections with explicit shapes; Scaled dot-product attention and the scaling term; Stable softmax and causal mask construction; Padding masks versus causal masks

Attention is a weighted read from permitted keys, not a framework black box. Correct shapes and masks make the decoder's causal information boundary testable.

**You can now**

- Derive softmax(QK^T/sqrt(d_k))V with explicit projection, score and output shapes.
- Implement stable softmax and combine causal and padding masks before normalization.
- Diagnose scale, mask-polarity and fully masked-row failures using a small explicit reference.

**Study**

1. [Attention scores and causal masking](https://github.com/walkinglabs/modern-llm-notebook/blob/main/notebooks-en/part1-foundation/05-transformer-block.ipynb) (Modern LLM Notebook - decoder construction path) - Sections 2, Scaled Dot-Product Attention, and 3, Causal Masking.
2. [Trainable Q, K and V projections](https://github.com/rasbt/LLMs-from-scratch/blob/main/ch03/01_main-chapter-code/ch03.ipynb) (LLMs from Scratch companion - attention and GPT construction) - Section 3.4.1, Computing the attention weights step by step.
3. [Stable softmax and masked attention contract](https://github.com/stanford-cs336/assignment1-basics/blob/main/cs336_assignment1_basics.pdf) (Stanford CS336 Assignment 1 - model contract) - Section 3.4.4, Scaled Dot-Product Attention, including problems (softmax) and (scaled_dot_product_attention), printed pp. 23 to 25.
4. [Mask shape and polarity reference](https://docs.pytorch.org/docs/stable/generated/torch.nn.functional.scaled_dot_product_attention.html#torch.nn.functional.scaled_dot_product_attention) (PyTorch scaled dot product attention reference) - Equivalent Python implementation, boolean-mask semantics note, and Parameters: attn_mask and is_causal. Depth: Read this after your explicit oracle works. Use the contract for padding-mask broadcasting; skip kernel selection.

**Focus**

- For X=[B, T, D], Q and K are [B, T, d_k], V is [B, T, d_v], scores are [B, T, T], and the output is [B, T, d_v].
- With independent zero-mean unit-variance Q and K components, their dot product has variance d_k. Dividing by sqrt(d_k) keeps the variance near one.
- Subtract each score row's maximum before exponentiating. Mask forbidden entries before softmax and normalize over keys.
- An allow mask combines j<=i with valid_key[b,j]. Broadcast key validity as [B, 1, T]; exclude padded query outputs separately and define a policy for rows with no valid key.

**Reproduce:** From a blank file, compute one causal attention row with explicit dot products, max-subtracted exponentials and a weighted sum of V. Match it with a batched implementation on a three-token example containing a masked key.

**Traps**

- Using sqrt(D) after splitting into heads. The scale uses the query/key width of one head.
- Copying a boolean mask between APIs without checking polarity. CS336 and SDPA use True for allowed entries; MultiheadAttention padding masks use True for blocked entries.
- Assuming max subtraction fixes an all-negative-infinity row. It gives undefined subtraction; reject that row or explicitly return zero for an ignored padded query.

**Practice**

- [CS336 Assignment 1: softmax](https://github.com/stanford-cs336/assignment1-basics/blob/main/tests/test_nn_utils.py) - Problem (softmax), section 3.4.4; implement run_softmax in tests/adapters.py and pass test_softmax_matches_pytorch
- [CS336 Assignment 1: scaled_dot_product_attention](https://github.com/stanford-cs336/assignment1-basics/blob/main/tests/test_model.py) - Problem (scaled_dot_product_attention), section 3.4.4; implement run_scaled_dot_product_attention and pass test_scaled_dot_product_attention and test_4d_scaled_dot_product_attention. Work in your own repository and respect the course AI policy. Add causal-plus-padding and fully masked-row tests; the public snapshots do not cover every mask edge case.

**Stop when:** The three named public tests pass, your explicit row matches the batched result, and changing a forbidden key or value cannot affect a valid query's output.

<details>
<summary>Self-test</summary>

1. If all allowed logits gain 1000, should the attention output change?
   - No. Softmax is invariant to a common additive shift; max subtraction avoids overflow.
2. Why does replacing a forbidden score with zero fail?
   - exp(0) is one, so the forbidden key receives probability. Use negative infinity before softmax.
3. Does a causal mask remove padding keys?
   - No. It only forbids future positions. A padding key earlier than the query is still causally permitted and needs a separate validity mask.
4. With Q=[2, 3, 4], K=[2, 5, 4] and V=[2, 5, 6], what are scores and output?
   - Scores are [2, 3, 5], softmax runs over the five keys, and output is [2, 3, 6].

</details>

#### U3. Multi-head attention: split, merge and gradients

**About 4 h** · **Target:** Implement

Topics: Head split, transpose, merge and tensor layout; Multi-head attention forward and backward behavior

A reshape can preserve every tensor size while mixing tokens and heads. Forward and backward comparisons check that the batched code implements the intended operation.

**You can now**

- Implement head splitting, transposition, attention, merging and output projection without a high-level attention module.
- Match outputs and input and projection-weight gradients against a per-head reference under identical weights.
- Localize head-layout and scaling errors with a changed batch size, sequence length or head count.

**Study**

1. [Multi-head data flow](https://github.com/walkinglabs/modern-llm-notebook/blob/main/notebooks-en/part1-foundation/05-transformer-block.ipynb) (Modern LLM Notebook - decoder construction path) - Section 4, Multi-Head Attention, especially How Multi-Head Is Implemented in Code and Complete Data Flow.
2. [Explicit head split and merge](https://github.com/rasbt/LLMs-from-scratch/blob/main/ch03/01_main-chapter-code/ch03.ipynb) (LLMs from Scratch companion - attention and GPT construction) - Section 3.6.2, Implementing multi-head attention with weight splits, including the separate-head matrix multiplication example.
3. [Causal MHA contract](https://github.com/stanford-cs336/assignment1-basics/blob/main/cs336_assignment1_basics.pdf) (Stanford CS336 Assignment 1 - model contract) - Section 3.4.5, Causal Multi-Head Self-Attention, printed pp. 25 to 26. Depth: Implement the no-RoPE adapter here. Leave Applying RoPE and the with_rope adapter to the RoPE unit.
4. [Independent batched attention comparison](https://docs.pytorch.org/docs/stable/generated/torch.nn.functional.scaled_dot_product_attention.html#torch.nn.functional.scaled_dot_product_attention) (PyTorch scaled dot product attention reference) - Equivalent Python implementation, dropout warning, numerical backend note and Shape legend. Depth: Compare only after the explicit per-head oracle passes. Set dropout_p=0.0; kernel tuning is outside this unit.

**Focus**

- With D=H*d, split [B, T, D] to [B, T, H, d], then transpose to [B, H, T, d]. A reshape alone does not exchange T and H.
- Each head normalizes its own [T, T] score matrix. Concatenate head outputs before applying the output projection.
- Reverse the transpose before merging. A transposed tensor may need contiguous storage or reshape rather than view.
- Transfer identical weights into a per-head loop and the batched path. Backpropagate the same scalar contraction of outputs and compare gradients, not just shapes.

**Reproduce:** Implement causal two-head attention for B=2, T=3, D=8. Reproduce its output and gradients with a loop over heads using sliced projection weights, then compare the attention core with SDPA at zero dropout.

**Traps**

- Comparing separately initialized modules. Different random weights do not test implementation equivalence.
- Merging [B, H, T, d] directly into [B, T, D]. This silently scrambles head and token ordering.
- Assuming eval() disables functional SDPA dropout. Its dropout_p argument must be zero explicitly.

**Practice**

- [CS336 Assignment 1: multihead_self_attention](https://github.com/stanford-cs336/assignment1-basics/blob/main/tests/test_model.py) - Problem (multihead_self_attention), section 3.4.5; implement run_multihead_self_attention in tests/adapters.py and pass test_multihead_self_attention. The public test checks a forward snapshot, not gradients. Extend your own tests with a transferred-weight per-head oracle, input and all four projection gradients, and non-contiguous input.

**Stop when:** The named public test passes and your float64 forward and gradient comparisons agree within atol=1e-8 and rtol=1e-6 for one and multiple heads, with dropout disabled.

<details>
<summary>Self-test</summary>

1. For B=2, T=5, D=12 and H=3, what shapes enter attention and leave the merge?
   - Q, K and V are [2, 3, 5, 4], scores are [2, 3, 5, 5], and the merged output is [2, 5, 12].
2. At fixed D, does doubling H double the bias-free MHA projection parameter count?
   - No. Head width halves, so Q, K, V and output projections still total 4D^2 parameters.
3. Why compare projection-weight gradients as well as input gradients?
   - They check that each head uses and differentiates the intended weight slice. A forward-only or input-only comparison can miss a detached or incorrectly registered parameter.

</details>

#### U4. MQA and GQA: sharing keys and values

**About 4 h** · **Target:** Derive + Implement

Topics: Multi-query and grouped-query attention shapes; MHA, MQA and GQA parameter and KV trade-offs; One small MHA versus GQA memory comparison

Sharing K and V changes both the learned projections and the state kept during decoding. Counting query heads as KV heads gives the wrong memory estimate.

**You can now**

- Derive MHA, MQA and GQA projection shapes and bias-free parameter counts at matched model and head widths.
- Implement causal grouped attention with an explicit query-to-KV-head mapping and differential tests.
- Explain KV-memory savings without claiming an equal reduction in attention work or unchanged expressivity.

**Study**

1. [MHA, MQA and grouped-query implementation](https://github.com/walkinglabs/modern-llm-notebook/blob/main/notebooks-en/part2-training/08-gpt2-to-modern-models.ipynb) (Modern LLM Notebook - decoder construction path) - Multi-Head Attention: MHA and GQA, the MHA vs GQA vs MQA KV Cache hand calculation comparison, and GQA implementation. Depth: Stop before QK-Norm. Skip MLA and the architecture survey. Read Exercise 3, How much KV Cache does GQA save, for practice.
2. [Contiguous grouped-head reference](https://docs.pytorch.org/docs/stable/generated/torch.nn.functional.scaled_dot_product_attention.html#torch.nn.functional.scaled_dot_product_attention) (PyTorch scaled dot product attention reference) - Equivalent Python implementation: enable_gqa and repeat_interleave; GQA constraints note; Parameters and Shape legend. Depth: Use the head mapping and functional contract after your explicit grouped oracle passes. Skip backend and kernel tuning.

**Focus**

- Let D=Hq*d and Hkv divide Hq. Q is [B, Hq, T, d]; unexpanded K and V are [B, Hkv, T, d]. MHA has Hkv=Hq; MQA has Hkv=1.
- In PyTorch weight layout, Wq and Wo are [D, D], while Wk and Wv are [Hkv*d, D]. The bias-free total is 2D^2 + 2D*Hkv*d.
- SDPA maps query head h to KV head floor(h/(Hq/Hkv)). The notebook's expand-then-reshape instead interleaves KV heads; choose one convention and make weight ordering and the oracle agree.
- Optional comparison: allocate unexpanded K and V at the same B, T, d and dtype for MHA and GQA, then compare numel()*element_size(). Do not count expanded temporary tensors as compact cache storage.

**Reproduce:** Implement a causal grouped-head loop and batched path for D=16, Hq=4 and Hkv=2, using contiguous groups. Derive 768 projection parameters versus MHA's 1024, and show that compact KV tensors use half the bytes at matched B, T and dtype.

**Traps**

- Using repeat rather than repeat_interleave while assuming contiguous groups. Shapes match, but queries read the wrong KV head.
- Storing expanded K and V as the cache. That loses the compact representation's memory saving.
- Expecting independently initialized MHA and GQA to produce equal outputs. Sharing restricts projections; equality needs a deliberately expanded shared-weight MHA reference.

**Practice**

- [Modern LLM Notebook: Exercise 3, How much KV Cache does GQA save](https://github.com/walkinglabs/modern-llm-notebook/blob/main/notebooks-en/part2-training/08-gpt2-to-modern-models.ipynb) - Exercises: Exercise 3, How much KV Cache does GQA save; complete the three quantities and pass its assertions. Extend the exercise in your own repository with the reproduce task. Compare outputs and shared-KV gradients against a head loop for Hkv=Hq, Hkv=1 and an intermediate group count. Reject invalid divisibility.

**Stop when:** The named exercise passes, your grouped outputs and gradients match the explicit loop for all three head structures, and you derive compact KV bytes and projection counts without notes.

<details>
<summary>Self-test</summary>

1. With Hq=8 and Hkv=2 under contiguous grouping, which query heads share KV head 1?
   - Zero-based query heads 4, 5, 6 and 7. Each group contains Hq/Hkv=4 query heads.
2. For D=1024, Hq=16 and Hkv=4, what are the K weight shape and total projection parameters?
   - d=64, so Wk is [256, 1024]. The four bias-free projections total 2,621,440 parameters, versus MHA's 4,194,304.
3. Does four times fewer KV heads imply four times less QK attention work?
   - No. Every query head still computes scores and a weighted value sum. KV projection and compact storage costs shrink; the number of query-head score matrices stays the same.
4. For B=1, T=2048, d=128 and two-byte elements, what does changing 32 KV heads to 4 save per layer?
   - K plus V fall from 33,554,432 bytes to 4,194,304 bytes: 32 MiB to 4 MiB, an 87.5% reduction.

</details>

#### U5. RoPE: positions as rotations

**About 4 h** · **Target:** Derive + Implement

Topics: Rotary Position Embedding as paired rotations; RoPE offsets and relative-position identity

RoPE makes position differences enter attention through rotations of Q and K. An implementation that silently restarts positions at zero can pass a short demo and fail incremental decoding.

**You can now**

- Derive (R_i q)^T(R_j k)=q^T R_(j-i) k for paired rotations.
- Implement RoPE on Q and K with explicit position IDs, head-local pairs and preserved output dtype.
- Detect pairing and offset errors using norm, common-offset and nonzero-position tests.

**Study**

1. [Paired rotations and relative dot products](https://github.com/walkinglabs/modern-llm-notebook/blob/main/notebooks-en/part2-training/08-gpt2-to-modern-models.ipynb) (Modern LLM Notebook - decoder construction path) - Rotary Position Encoding (RoPE): 2D rotation mathematical intuition, From 2D to higher dimensions, and Full RoPE implementation. Depth: Stop before Experimental comparison. The rotation identity, not a plotted attention pattern, is the result to reproduce.
2. [Explicit position IDs and rotary attention contract](https://github.com/stanford-cs336/assignment1-basics/blob/main/cs336_assignment1_basics.pdf) (Stanford CS336 Assignment 1 - model contract) - Section 3.4.3, Relative Positional Embeddings and problem (rope), printed pp. 22 to 23; section 3.4.5, Applying RoPE, printed p. 25.

**Focus**

- For zero-based pair r, frequency is theta^(-2r/d). Rotate [x_2r, x_(2r+1)] by position*frequency using radians, not degrees.
- R_i^T R_j=R_(j-i). The positional factor depends on the difference; content vectors q and k still matter.
- Apply the rotation after projection and head splitting to Q and K, not V. Require an even rotary width and agree on adjacent-pair versus split-half layout.
- Index sin/cos with the supplied positions, including nonzero offsets. Compute angles and rotations in float32 when needed and cast the result back; buffers are not trainable weights.

**Reproduce:** Closed-book, multiply the two 2D rotation matrices to derive R_i^T R_j=R_(j-i), then implement adjacent-pair RoPE. For fixed q and k, verify equal dot products at positions (2, 5) and (12, 15) and compare against the unrotated relative-rotation expression.

**Traps**

- Mixing adjacent pairs with a split-half reference without permuting channels and projection weights. Both conventions can work, but their raw tensors are not interchangeable.
- Using arange(T) instead of supplied position IDs. This discards offsets and per-sequence positions.
- Inferring monotonic distance decay or reliable long-context quality from the identity. Rotations are periodic, and the identity alone guarantees neither.

**Practice**

- [CS336 Assignment 1: rope and rotary multihead_self_attention](https://github.com/stanford-cs336/assignment1-basics/blob/main/tests/test_model.py) - Problem (rope), section 3.4.3, and Applying RoPE, section 3.4.5; implement run_rope and run_multihead_self_attention_with_rope and pass test_rope and test_multihead_self_attention_with_rope. Add your own position-zero, nonzero-offset, common-offset dot-product, norm-preservation and odd-width rejection tests. Test float32 and a supported low-precision dtype. For positions beyond a precomputed table, test the documented extension or rejection policy.

**Stop when:** Both named public tests and your offset and pairing tests pass, and you derive the relative-position identity without looking at the notebook.

<details>
<summary>Self-test</summary>

1. Why do a common offset c on query and key positions cancel?
   - R_(i+c)^T R_(j+c)=R_(j-i), assuming unchanged q, k and frequencies. The rotary positional factor is unchanged.
2. With theta=10000 and d=4, what frequencies do the two adjacent pairs use?
   - 1 and 0.01 radians per position. Position p gives angles p and p/100.
3. Should rotating a vector change its norm?
   - Not in exact arithmetic. Each 2D rotation is orthogonal; numerical tests allow a dtype-appropriate tolerance.
4. For a full paired rotation, what should happen with an odd head width?
   - Reject it unless a separate partial-rotation contract explicitly leaves a channel unrotated. The assignment's full paired construction needs an even width.

</details>

#### U6. The modern decoder block: residuals, RMSNorm and SwiGLU

**About 6 h** · **Target:** Explain + Implement

Topics: Residual stream and pre-norm decoder blocks; LayerNorm versus RMSNorm; GELU, gated feed-forward blocks and SwiGLU; Initialization and residual-scale vocabulary

Attention mixes positions; the feed-forward network transforms each position, and residual additions preserve the model width. Normalization placement and initialization change how a deep stack carries signals and gradients.

**You can now**

- Explain the pre-norm residual stream and contrast its gradient path with post-norm.
- Implement per-token RMSNorm, a bias-free SwiGLU feed-forward network and both residual sublayers.
- Contrast LayerNorm with RMSNorm and a two-matrix GELU FFN with three-matrix SwiGLU.
- Distinguish component initialization from depth-dependent residual-projection scaling and state the chosen recipe.

**Study**

1. [Normalization, gating and norm placement](https://github.com/walkinglabs/modern-llm-notebook/blob/main/notebooks-en/part2-training/08-gpt2-to-modern-models.ipynb) (Modern LLM Notebook - decoder construction path) - Component Upgrades: LayerNorm and RMSNorm hand calculations, RMSNorm full implementation, The SwiGLU gating mechanism, Full SwiGLU FFN implementation, and Post-Norm versus Pre-Norm comparison. Depth: Read the formulas and code. Skip the eight-layer gradient demonstration; a single random example is not a general stability proof.
2. [GELU FFN baseline](https://github.com/rasbt/LLMs-from-scratch/blob/main/ch04/01_main-chapter-code/ch04.ipynb) (LLMs from Scratch companion - attention and GPT construction) - Section 4.3, Implementing a feed forward network with GELU activations.
3. [Initialization and modern block specifications](https://github.com/stanford-cs336/assignment1-basics/blob/main/cs336_assignment1_basics.pdf) (Stanford CS336 Assignment 1 - model contract) - Section 3.3.1, Parameter Initialization, printed p. 17; section 3.4 through 3.4.2, printed pp. 19 to 22; section 3.5 through problem (transformer_block), printed p. 26.
4. [Depth-scaled residual initialization](https://github.com/karpathy/nanoGPT/blob/master/model.py) (nanoGPT - residual projection initialization) - MLP and Block classes; GPT.__init__ from self.apply(self._init_weights) through the c_proj.weight initialization loop; GPT._init_weights. Depth: Use this as a contrasting GPT-2 recipe, not a replacement for the CS336 test architecture. Skip pretrained loading, optimizer setup and generation.

**Focus**

- Write y=x+Attn(RMSNorm(x)), then z=y+FFN(RMSNorm(y)). Normalize the branch input, not the residual sum; final stack normalization comes later.
- LayerNorm subtracts the feature mean and divides by feature standard deviation. RMSNorm divides by sqrt(mean(x^2)+eps), without centering, and uses one learned gain per feature.
- SwiGLU is W_down(SiLU(W_gate*x) * (W_up*x)). Its gate is not bounded to [0, 1]. Three bias-free matrices cost 3D*F parameters; a two-matrix GELU FFN costs 2D*F at the same hidden width.
- CS336 specifies truncated-normal component weights and unit RMSNorm gains. nanoGPT instead uses base std=0.02 and residual-projection std=0.02/sqrt(2L); that scales initial branch weights, not the residual identity path.

**Reproduce:** From a blank file, implement a pre-norm RMSNorm-SwiGLU block with the causal attention you already own. Zero the attention output projection and FFN down projection: the block must return x and give the identity input gradient, with dropout disabled.

**Traps**

- Normalizing across tokens instead of the feature axis. That couples positions and can leak future information even when attention is causal.
- Squaring low-precision activations before upcasting. Overflow has already happened; accumulate RMS statistics in float32 first.
- Copying the notebook's explanation that a SwiGLU gate is a probability. SiLU can be negative or exceed one; the sigmoid factor alone is bounded.

**Practice**

- [CS336 Assignment 1: rmsnorm and positionwise_feedforward](https://github.com/stanford-cs336/assignment1-basics/blob/main/tests/test_model.py) - Problems (rmsnorm) and (positionwise_feedforward), sections 3.4.1 and 3.4.2; implement run_rmsnorm, run_silu and run_swiglu and pass test_rmsnorm, test_silu_matches_pytorch and test_swiglu
- [CS336 Assignment 1: transformer_block](https://github.com/stanford-cs336/assignment1-basics/blob/main/tests/test_model.py) - Problem (transformer_block), section 3.5; implement run_transformer_block and pass test_transformer_block. Add your own zero-branch identity and gradient test, zero-input RMSNorm test and a test showing that changing another token cannot change this token's norm or FFN output.

**Stop when:** All four named public tests pass, the zero-branch block passes output and input-gradient identity checks, and you explain norm placement, gating and your initialization recipe without notes.

<details>
<summary>Self-test</summary>

1. For x=[1, 3, 5, 7], unit gains and negligible epsilon, how do LayerNorm and RMSNorm differ?
   - LayerNorm gives [-3, -1, 1, 3]/sqrt(5), before any affine shift. RMSNorm gives [1, 3, 5, 7]/sqrt(21), whose mean is not zero.
2. Why does SwiGLU often use F near 8D/3 instead of 4D?
   - Three matrices give 3D*F weights. Setting F=8D/3 matches the 8D^2 weights of a two-matrix FFN with hidden width 4D, before rounding or biases.
3. What is the clean gradient path supplied by x+f(norm(x))?
   - Its Jacobian includes an identity term plus the branch Jacobian. Unlike post-norm, the residual identity contribution does not pass through a normalization Jacobian; this is not a guarantee against every training instability.
4. In nanoGPT, why are both attention and MLP c_proj weights scaled with layer count?
   - Both project branch outputs back into the residual stream. With two residual branches per layer, the recipe reduces their initial standard deviation by sqrt(2L) to limit accumulation across depth.

</details>

#### U7. Assembling and verifying a decoder

**About 6 h** · **Target:** Derive + Implement

Topics: Embedding-output weight tying and final logits; Decoder composition and configuration ownership; Parameter counts and dominant operation terms; Slow attention oracle and causal intervention tests; Encoder-only BERT contrast

Correct components do not automatically make a correct model. Assembly checks catch final-norm, configuration, weight-sharing and information-flow defects before training hides them.

**You can now**

- Assemble a configurable decoder from owned tensor components, ending in raw [B, T, V] logits.
- Derive component parameter counts and dominant forward matrix-multiplication terms, distinguishing tied and untied heads.
- Verify causal prefix equivalence and match an independent reference under transferred weights.
- Contrast the decoder's causal next-token use with BERT's bidirectional masked-token use.

**Study**

1. [Decoder assembly, configuration and tying](https://github.com/walkinglabs/modern-llm-notebook/blob/main/notebooks-en/part1-foundation/06-mini-gpt.ipynb) (Modern LLM Notebook - decoder construction path) - Implementing MiniGPT from scratch: Implementation of MiniGPT and Logits and predictions; Reading the nanoGPT source code: The main thread of GPT.forward and Weight Tying: sharing weights between input and output. Depth: Read architecture and shape flow only. Skip training, generation demos and the full GPT-2 parameter survey; substitute your modern blocks for the teaching version.
2. [Full tensor model and tied parameter count](https://github.com/rasbt/LLMs-from-scratch/blob/main/ch04/01_main-chapter-code/ch04.ipynb) (LLMs from Scratch companion - attention and GPT construction) - Section 4.6, Coding the GPT model, through the weight-tying and memory-count discussion. Depth: Skip the larger GPT-2 configuration exercise and section 4.7 generation. Keep the final normalization and raw-logit contract.
3. [Full model and resource accounting](https://github.com/stanford-cs336/assignment1-basics/blob/main/cs336_assignment1_basics.pdf) (Stanford CS336 Assignment 1 - model contract) - Section 3.1, Transformer LM, printed pp. 13 to 14; section 3.5, The Full Transformer LM, including (transformer_lm), Resource accounting and (transformer_accounting), printed pp. 26 to 28. Depth: Do transformer_accounting parts (a) to (c). Leave the model-size sweep and long-context sweep in parts (d) and (e) for the model-arithmetic section.
4. [Optional encoder-only contrast](https://github.com/walkinglabs/modern-llm-notebook/blob/main/notebooks-en/part2-training/08-gpt2-to-modern-models.ipynb) (Modern LLM Notebook - decoder construction path) - Decoder-Only Architecture: the Encoder-Only, Encoder-Decoder and next-token-training comparison. Depth: Use only for the optional BERT contrast. Do not start an encoder implementation or model survey.

**Focus**

- One configuration owns V, D, layer count L, query and KV head counts, FFN width F, RoPE theta, context policy and tying. Validate divisibility before creating weights; different layers share a design, not all their parameters.
- A tied head uses the same [V, D] Parameter as input lookup and computes h @ E^T. Equal initial values in separate Parameters are not tying; gradients from lookup and classification must accumulate into one weight.
- For bias-free MHA with two RMSNorms and SwiGLU per block, untied parameters are 2VD + L*(4D^2 + 3DF + 2D) + D. Tying subtracts VD; standard RoPE adds no learned parameters.
- List dense forward terms: per layer 8BTD^2 for MHA projections, 4BT^2D for QK and AV, and 6BTDF for SwiGLU matrices; the vocabulary head adds 2BTDV. Use the slow per-head oracle and suffix interventions to check causality, not a loss curve.

**Reproduce:** Build a two-layer decoder with V=32, D=16, H=4 and F=48, using bias-free MHA, RoPE, two RMSNorms per block and one final RMSNorm. Derive 7,760 untied or 7,248 tied parameters, reconcile with unique registered weights, and verify unchanged prefix logits after replacing every suffix token.

**Traps**

- Adding softmax inside the model's training forward path. Return raw logits; the loss owns normalization.
- Matching a CS336 snapshot with a tied output head. Its supplied embedding and lm_head weights are independent; test untied mode there and tying separately.
- Checking causality only in the attention matrix. Cross-token normalization or a composition error can still alter prefix logits.

**Practice**

- [CS336 Assignment 1: transformer_lm](https://github.com/stanford-cs336/assignment1-basics/blob/main/tests/test_model.py) - Problem (transformer_lm), section 3.5; implement run_transformer_lm and pass test_transformer_lm and test_transformer_lm_truncated_input. Use the untied MHA contract for snapshots. Add prefix-alone versus full-sequence comparisons, adversarial suffix changes, tied-weight identity and gradient accumulation checks, and a full-model comparison using the slow attention oracle. Keep dropout off.
- [CS336 Assignment 1: transformer_accounting, parts (a) to (c)](https://github.com/stanford-cs336/assignment1-basics/blob/main/cs336_assignment1_basics.pdf) - Problem (transformer_accounting), printed pp. 27 to 28: parameter and FP32 weight memory count, forward matrix multiplies and dominant FLOPs. This written problem has no public accounting test. Check its algebra against your tiny model's unique parameter count, using tests/test_model.py's model tests for implementation correctness; do not allocate the XL model.

**Stop when:** Both full-model public tests pass, the tiny parameter count matches the derivation, and your model matches the slow reference and preserves prefix logits under suffix replacement in tied and untied modes.

<details>
<summary>Self-test</summary>

1. Does tying the head remove the vocabulary projection's compute?
   - No. It removes a separate VD weight matrix, but h @ E^T still costs about 2BTDV dense FLOPs.
2. What should changing tokens after zero-based position i do to logits through i?
   - Nothing within numerical tolerance, with identical prefix positions and deterministic evaluation. Those logits may depend on tokens at positions at most i, not the suffix.
3. If sequence length doubles at fixed batch and width, which dominant terms quadruple?
   - Dense QK and attention-times-V work, and the stored score/probability matrices, scale quadratically. Projection and FFN terms scale linearly with length.
4. Why cannot an ordinary BERT forward pass serve as this causal decoder oracle?
   - BERT uses bidirectional attention for masked-token prediction, so its representations can use right context. The decoder must preserve the causal prefix boundary.

</details>

### Mini-project: Tiny decoder with an independent oracle

**About 10 to 14 hours.** Build a configurable decoder-only model from tensor operations in the same repository, and prove it correct without trusting a training curve: public snapshot tests for each component, a slow per-head reference for attention, and intervention tests for causality.

1. Implement linear, embedding, RMSNorm, SwiGLU, RoPE, softmax and scaled dot-product attention from tensor operations, and pass the matching CS336 tests in tests/test_model.py and tests/test_nn_utils.py.
2. Add grouped KV heads to your attention with an explicit map, query head h reads KV head h // (Hq / Hkv), so that MHA and MQA are the two ends of one code path.
3. Write a slow reference that loops over heads with sliced weights, and compare outputs and gradients in float64 with your batched path for MHA, GQA and MQA.
4. Assemble the decoder from one config object with optional embedding tying, and pass test_transformer_block, test_transformer_lm and test_transformer_lm_truncated_input.
5. Derive the parameter count of your config by hand and assert that it equals the count of unique registered parameters, tied and untied.
6. Connect the atlas lab adapters for section 2 and pass tests/test_s2_decoder.py.

**Deliverables**

- The model package: components, config, grouped attention and the tied or untied head.
- Your test suite: the head-loop oracle, float64 gradient comparisons, suffix-intervention tests and the parameter-count assertion.
- A one-page shape and parameter sheet for your config, derived by hand.

**Checks**

- external-tests: [CS336 tests/test_model.py and the softmax test](https://github.com/stanford-cs336/assignment1-basics/tree/main/tests). Run `uv run pytest tests/test_model.py tests/test_nn_utils.py::test_softmax_matches_pytorch`. Use the untied head for the snapshot tests; test tying separately.
- harness: [Atlas lab, section 2: grouped attention, RoPE offsets and causality](https://github.com/saisandeshk/ai-atlas/tree/main/labs/llm-foundations). Run `uv run pytest tests/test_s2_decoder.py`. Run in labs/llm-foundations of an ai-atlas clone after you connect adapters.py to your package. It checks grouped attention with query offsets against a head loop, RoPE norm, relative and offset properties, causal intervention, batch independence and the parameter count for MHA, GQA, MQA and tied heads.
- rubric: Self-grade with the rubric below.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Component correctness | All CS336 model tests and the softmax test pass. | Your own tests add fully masked rows, padding plus causal masks and non-contiguous inputs. |
| Independent oracle | The batched attention matches the head loop on outputs. | Outputs and all projection gradients match in float64 for MHA, GQA and MQA within atol 1e-8. |
| Causality | Changing a suffix leaves prefix logits unchanged. | Your tests also show that the change does reach the logits at and after the edited position, and they cover batch independence. |
| Grouped heads and RoPE | The section 2 lab tests pass. | You explain why an interleaved KV expansion differs from the PyTorch grouping convention, and your weights load correctly under yours. |
| Accounting | The hand-derived parameter count equals the registered count. | The sheet also gives the dominant forward FLOP terms and predicts how each scales when the sequence length doubles. |

Feeds into: Capstone artifact 2, the tiny decoder stack. Section 3 trains this model, and section 5 adds a cache to it.

### Resource route

- **Primary - Course:** [Modern LLM Notebook - decoder construction path](https://walkinglabs.github.io/modern-llm-notebook/?lang=en) - Work through English notebooks 03-embedding, 04-position-encoding, 05-transformer-block, 06-mini-gpt and the selected normalization, RoPE, GQA and SwiGLU comparisons in 08-gpt2-to-modern-models. Re-derive shapes and rerun with changed dimensions.
- **Required - Implementation:** [LLMs from Scratch companion - attention and GPT construction](https://github.com/rasbt/LLMs-from-scratch) - Use the ch03 attention notebooks and ch04 model code. Rebuild the model without a high-level Transformer module and compare one forward and backward path with an independent small reference.
- **Required - Assessment:** [Stanford CS336 Assignment 1 - model contract](https://github.com/stanford-cs336/assignment1-basics) - Use the named linear, embedding, rmsnorm, positionwise_feedforward, rope, softmax, scaled_dot_product_attention, multihead_self_attention, transformer_block, transformer_lm and transformer_accounting specifications and public tests. Keep implementation independent and respect the course AI and honor-code boundary.
- **Support - Reference:** [PyTorch scaled dot product attention reference](https://docs.pytorch.org/docs/stable/generated/torch.nn.functional.scaled_dot_product_attention.html) - Use the functional contract only after the explicit attention oracle passes. Transfer identical weights and masks, compare outputs and gradients, and explain dtype, causal and dropout behavior from the documented semantics.
- **Optional - Practice:** [Deep-ML candidate - three transformer closing drills](https://www.deep-ml.com/problems) - After the platform quality sample passes, attempt at most problems 490, 53 and 904 as changed-prompt drills for attention shapes and multi-head composition. Preserve independent tests; a judge result does not replace the section checkpoint.
- **Support - Implementation:** [nanoGPT - residual projection initialization](https://github.com/karpathy/nanoGPT/blob/master/model.py) - Read model.py: MLP, Block, GPT.__init__'s special scaled initialization of c_proj.weight, and GPT._init_weights. Contrast the depth-dependent residual initialization with CS336's component initialization; do not adopt the training or generation code.

### Exit checkpoint

Build a tiny decoder from blank tensor operations, derive every intermediate shape and parameter count, and pass causal intervention, mask, RoPE-offset, grouped-head, residual, normalization, tying and differential forward or backward tests.

<details>
<summary>Deliberately left for later</summary>

- MoE, MLA and broad modern-architecture catalogs
- FlashAttention and custom GPU kernels
- Long-context extension and production transformer libraries

</details>

## 03. Causal Training, Checkpointing & Generation

**Why:** A correct forward pass is only the beginning. This section fixes target alignment, valid-token weighting, full training state and sampling semantics so that a tiny model can train, resume and generate reproducibly.

### Learn this much

- [ ] Autoregressive factorization and next-token likelihood _(Required)_
- [ ] Input-target shift and off-by-one failure modes _(Required)_
- [ ] Packed document, padding and valid-token loss masks _(Required)_
- [ ] Token-weighted cross-entropy and perplexity _(Required)_
- [ ] Sequence batching, shuffling and data-loader state _(Required)_
- [ ] Initialization and stable first-step controls _(Required)_
- [ ] AdamW moments and decoupled weight decay _(Required)_
- [ ] Warmup, cosine decay and schedule state _(Required)_
- [ ] Gradient accumulation and global token batch _(Required)_
- [ ] Gradient clipping and numerical-event logging _(Required)_
- [ ] Mixed-precision vocabulary, scaling and overflow signals _(Required)_
- [ ] Model, optimizer, scheduler, scaler and RNG checkpoint state _(Required)_
- [ ] Tokenizer, data and configuration identity binding _(Required)_
- [ ] Interrupted versus uninterrupted resume equivalence _(Required)_
- [ ] Logits, greedy decoding and deterministic argmax _(Required)_
- [ ] Temperature and distribution renormalization _(Required)_
- [ ] Top-k and nucleus top-p truncation _(Required)_
- [ ] Beam-search objective and cost vocabulary _(Required)_
- [ ] EOS, stop sequences, maximum length and finished batches _(Required)_
- [ ] Sampling RNG, reproducibility and output validation _(Required)_
- [ ] Tiny-set overfit and shuffled-label controls _(Required)_
- [ ] Prompt and chat-template comparison _(Optional)_
- [ ] Repetition and length penalties _(Optional)_
- [ ] Supervised fine-tuning, LoRA and preference optimization _(Later)_
- [ ] Distributed training and large-scale pretraining _(Later)_

### Study units

#### U1. The next-token objective: shifts, masks and perplexity

**About 4 h** · **Target:** Derive + Implement

Topics: Autoregressive factorization and next-token likelihood; Input-target shift and off-by-one failure modes; Packed document, padding and valid-token loss masks; Token-weighted cross-entropy and perplexity

Every later number in this section, from optimizer steps to evaluation claims, reads off this loss. A shifted-by-one or unmasked loss trains the wrong objective while the curve still falls.

**You can now**

- Derive token-weighted cross-entropy and perplexity with an explicit valid-token mask.
- Explain the input-target shift and predict the failure when labels are off by one.
- Explain which positions a packed or padded batch must exclude from the loss and why.

**Study**

1. [CS336 Assignment 1 handout: cross-entropy and perplexity](https://github.com/stanford-cs336/assignment1-basics/blob/main/cs336_assignment1_basics.pdf) (Stanford CS336 Assignment 1 - training and decoding contract) - Section 4.1, Cross-entropy loss (pp. 28 to 29): equations 16 to 18 for shifted likelihood, the numerically stable cross-entropy requirements and perplexity.
2. [LLMs from Scratch ch05: generation loss and train/val loss](https://github.com/rasbt/LLMs-from-scratch/blob/main/ch05/01_main-chapter-code/ch05.ipynb) (LLMs from Scratch companion - training and generation) - Sections 5.1.2 (shifted inputs and targets, flattening logits for cross_entropy, perplexity as the exponential of the loss) and 5.1.3 (train and validation loss with calc_loss_batch and calc_loss_loader).
3. [Modern LLM Notebook 10-training-loss: shift, hand loss and valid tokens](https://github.com/walkinglabs/modern-llm-notebook/blob/main/notebooks-en/part2-training/10-training-loss.ipynb) (Modern LLM Notebook - configuration, loss and generation) - Sections 1 (input and label shift on [1, 3, 4, 5, 6]), 3 (hand-computed cross-entropy from logits [2.0, 1.0, 0.1, -1.0]), 10 (perplexity table) and 11 (shift in the data versus shift in the model), plus Homework 3 (mean over valid tokens only).

**Focus**

- Position i predicts token i+1 from context 1 to i. Inputs and labels are the same sequence offset by one.
- The mean runs over valid tokens only. Padding and -100 label positions leave both the sum and the count.
- Perplexity is exp of the mean cross-entropy, so it reads as the effective shortlist size at each step.
- One forward pass yields every position's distribution at once, which is why training parallelizes but generation does not.

**Reproduce:** From a 2 by 3 logit batch and its targets, derive the per-position losses, the masked mean and the perplexity by hand, then match F.cross_entropy on the flattened tensors.

**Traps**

- Averaging over all positions including padding. The denominator changes, so short and padded batches get different objectives.
- Shifting twice: slicing tokens in the data loader and again inside the model. Every target then predicts two steps ahead.
- Comparing perplexity across tokenizers. Different vocabularies split the same text into different token counts, so the means are over different units.

**Practice**

- [CS336 Assignment 1: cross_entropy](https://github.com/stanford-cs336/assignment1-basics/blob/main/tests/test_nn_utils.py) - Problem (cross_entropy) in Section 4.1; connect your function to run_cross_entropy in tests/adapters.py and pass test_cross_entropy in tests/test_nn_utils.py. The tests compare against F.cross_entropy on a fixed batch and on a 1000x scaled copy, so subtract the row max and cancel log with exp. Implement it in your own repository.

**Stop when:** You hand-compute a masked loss and perplexity that match code, and your cross_entropy passes test_cross_entropy including the overflow case.

<details>
<summary>Self-test</summary>

1. Why does the Raschka code flatten logits to (B*T, V) before calling cross_entropy?
   - The function expects a 2D (N, C) input with one target index per row. Flattening keeps one row per position while targets flatten to (N,), so each position is scored against its own shifted target.
2. Logits are [2.0, 1.0, 0.1, -1.0] and the correct token is 0. What is the loss?
   - About 0.45. Softmax gives the correct token probability exp(2.0) / (exp(2.0) + exp(1.0) + exp(0.1) + exp(-1.0)) = 0.64, and -log(0.64) = 0.45.
3. Labels are not shifted, so position i supervises with token i. What breaks?
   - The model is asked to output a token already in its context, so it learns copying. The loss still falls, but the trained objective is not next-token prediction and the perplexity is meaningless.
4. Six positions have losses [0.2, 0.4, 1.0, 0.3, 0.8, 0.5] with labels [10, 11, -100, 3, -100, 12]. What is the training loss?
   - 0.35. Only the four positions with real labels count: (0.2 + 0.4 + 0.3 + 0.5) / 4. Including the masked positions changes both the sum and the denominator.

</details>

#### U2. Feeding the model: batches, initialization and first steps

**About 3 h** · **Target:** Implement + Measure

Topics: Sequence batching, shuffling and data-loader state; Initialization and stable first-step controls; Tiny-set overfit and shuffled-label controls

Silent data bugs, from ordered batches to bad initialization, waste every GPU hour after them. Two tiny controls on CPU catch them in minutes before any real run.

**You can now**

- Build a batch sampler that draws uniform random windows with correct input-target pairing.
- Apply the assignment initialization recipe per module type and explain each choice.
- Run overfit-one-batch and shuffled-label controls and read the verdict from each.

**Study**

1. [CS336 Assignment 1 handout: data loading](https://github.com/stanford-cs336/assignment1-basics/blob/main/cs336_assignment1_basics.pdf) (Stanford CS336 Assignment 1 - training and decoding contract) - Section 5.1, Data Loader (pp. 34 to 35): (batch_size, context_length) input and target pairs, targets offset by one, random start indices and memory-mapped loading with np.memmap.
2. [CS336 Assignment 1 handout: initialization recipe](https://github.com/stanford-cs336/assignment1-basics/blob/main/cs336_assignment1_basics.pdf) (Stanford CS336 Assignment 1 - training and decoding contract) - Section 3.3.1, Parameter Initialization (p. 17): truncated normal for linear weights and embeddings with torch.nn.init.trunc_normal_, ones for RMSNorm.
3. [CS336 Assignment 1 handout: debugging controls](https://github.com/stanford-cs336/assignment1-basics/blob/main/cs336_assignment1_basics.pdf) (Stanford CS336 Assignment 1 - training and decoding contract) - Section 7.2.3, Tips and tricks for debugging model architectures (p. 40): overfit a single minibatch to near-zero loss, inspect tensor shapes in a debugger, monitor activation, weight and gradient norms.

**Focus**

- Each row draws its own random start in [0, n - m), so a start never runs past the end of the token array.
- Inputs and targets share the same device as the model. The handout CPU tip names cpu and mps explicitly.
- Linear, embedding and norm layers get different initial scales because they play different roles in the first forward pass.
- The two controls answer different questions. Driving one tiny batch to near-zero loss proves the model and optimizer can fit at all. Training on shuffled targets should leave validation loss near the unigram baseline; doing much better means the answer leaks in, for example through a broken causal mask or a missing shift.

**Reproduce:** Write get_batch from scratch: memory-mapped load, uniform random starts, and (B, m) input and target tensors with targets offset by one.

**Traps**

- Sampling a start index up to n instead of n - m. The window reads past the array end or wraps into unrelated tokens.
- Initializing every weight to zero or one constant. Symmetric weights get identical gradients and never break symmetry.
- Judging initialization from the first-step loss alone. A healthy init shows in stable norms and in the overfit control, not in one number.

**Practice**

- [CS336 Assignment 1: data_loading](https://github.com/stanford-cs336/assignment1-basics/blob/main/tests/test_data.py) - Problem (data_loading) in Section 5.1; connect your sampler to run_get_batch in tests/adapters.py and pass test_get_batch in tests/test_data.py. The test draws 1000 batches from arange(100) and checks shapes, the offset-by-one relation and uniform start coverage. Implement it in your own repository.

**Stop when:** Your sampler passes test_get_batch, your loop drives one tiny batch to near-zero loss, and a run on shuffled targets leaves validation loss near the unigram baseline.

<details>
<summary>Self-test</summary>

1. The token array has n = 100 entries and context length m = 7. Which start indices are valid?
   - 0 through 92, which is 93 values. The window needs m tokens plus one target, so the last start is n - m - 1 = 92.
2. You train on shuffled targets and validation loss falls almost as fast as with the real targets. What does that tell you?
   - The model is reading the answer through a leak, such as a causal mask that lets position i see position i+1, or inputs and targets taken from the same unshifted window. Shuffled targets carry no signal beyond token frequencies, so validation loss should stall near the unigram baseline.
3. Overfit-one-batch stalls at high loss. What does that verdict mean?
   - The pipeline or model is broken, not the data. Check tensor shapes, the label shift, the learning rate and whether any parameter is frozen or detached.
4. Why does the recipe give RMSNorm ones but small truncated weights to linear and embedding layers?
   - Norms start as identity so they pass activations through, while small weights keep first-step activations and gradients finite. Large or constant init risks exploding or vanishing gradients before step one.

</details>

#### U3. AdamW, schedules and the global token batch

**About 4 h** · **Target:** Derive + Implement

Topics: AdamW moments and decoupled weight decay; Warmup, cosine decay and schedule state; Gradient accumulation and global token batch

Learning rate, batch size and schedule interact, and runs compare by tokens, not steps. Until you can state any run's token batch, tuning is guessing.

**You can now**

- Derive one AdamW step from the two moments, the bias correction and the decoupled decay.
- Implement AdamW and the warmup-cosine schedule so both pass the CS336 public tests.
- Derive the global token batch and step count from sequences, length, accumulation and parallelism.

**Study**

1. [CS336 Assignment 1 handout: AdamW and its accounting](https://github.com/stanford-cs336/assignment1-basics/blob/main/cs336_assignment1_basics.pdf) (Stanford CS336 Assignment 1 - training and decoding contract) - Section 4.3, AdamW (pp. 31 to 32): Algorithm 1 with moments, bias-corrected step and decoupled decay, typical betas (0.9, 0.999) versus (0.9, 0.95), then the adamw_accounting deliverables for memory, FLOPs and MFU time.
2. [CS336 Assignment 1 handout: cosine schedule with warmup](https://github.com/stanford-cs336/assignment1-basics/blob/main/cs336_assignment1_basics.pdf) (Stanford CS336 Assignment 1 - training and decoding contract) - Section 4.4, Learning rate scheduling (p. 33): linear warmup, cosine annealing and post-annealing phases as a pure function of step t.
3. [LLMs from Scratch Appendix D: warmup, cosine and the modified loop](https://github.com/rasbt/LLMs-from-scratch/blob/main/appendix-D/01_main-chapter-code/appendix-D.ipynb) (LLMs from Scratch companion - training and generation) - Sections D.1 (warmup over 0.1 percent to 20 percent of steps), D.2 (cosine decay) and D.4 (the modified training function combining both with gradient clipping).
4. [Modern LLM Notebook 10-training-loss: mini Trainer and batch arithmetic](https://github.com/walkinglabs/modern-llm-notebook/blob/main/notebooks-en/part2-training/10-training-loss.ipynb) (Modern LLM Notebook - configuration, loss and generation) - Section 6 (mini Trainer skeleton with optimizer and scheduler step order) and Homework 2 (effective batch size from per-device batch, GPU count and accumulation steps).

**Focus**

- Weight decay sits outside the gradient in AdamW: parameters shrink by alpha times lambda directly, not through the moments.
- The schedule is a pure function of t, so resuming needs t itself rather than a schedule object.
- Global tokens per optimizer step equal sequences times length times accumulation times data-parallel width.
- Appendix D sizes warmup as a fraction of total steps, typically 0.1 to 20 percent; many runs fix a step count instead. Either way, the warmup length belongs in the config.

**Reproduce:** Derive one scalar AdamW update from Algorithm 1, the learning rate at a step inside each of the three schedule phases, and the step count for a 327.68M-token budget.

**Traps**

- Adding weight decay to the gradients and calling it AdamW. That is Adam with L2, and the decay gets divided by the adaptive denominator.
- Stepping the scheduler per microbatch under accumulation. The schedule then decays faster than intended because it sees more steps.
- Comparing two runs by step count at different batch sizes. Fix tokens first: batch times steps times length is the common currency.

**Practice**

- [CS336 Assignment 1: adamw](https://github.com/stanford-cs336/assignment1-basics/blob/main/tests/test_optimizer.py) - Problem (adamw) in Section 4.3; expose your optimizer through get_adamw_cls in tests/adapters.py and pass test_adamw in tests/test_optimizer.py. The test trains a small linear model for 1000 steps and matches PyTorch AdamW or the reference snapshot. Implement it in your own repository.
- [CS336 Assignment 1: learning_rate_schedule](https://github.com/stanford-cs336/assignment1-basics/blob/main/tests/test_optimizer.py) - Problem (learning_rate_schedule) in Section 4.4; expose your function through get_lr_cosine_schedule in tests/adapters.py and pass test_get_lr_cosine_schedule in tests/test_optimizer.py
- [Modern LLM Notebook 10-training-loss Homework 2: effective batch size](https://github.com/walkinglabs/modern-llm-notebook/blob/main/notebooks-en/part2-training/10-training-loss.ipynb) - Homework 2: compute effective_batch_size from per-device batch, GPU count and accumulation steps; the cell asserts 64. Derive the token batch for your own planned run the same way before trusting any step-based comparison.

**Stop when:** Your AdamW and schedule pass both optimizer tests including phase boundaries, and you can state any run's token batch and step count from its config.

<details>
<summary>Self-test</summary>

1. How does AdamW apply weight decay differently from Adam with L2 regularization?
   - AdamW subtracts alpha times lambda times theta from the parameters directly. With L2 in Adam, the decay enters the gradient and is rescaled by the adaptive denominator, so large-gradient parameters get less decay.
2. Per-device batch 2, 4 GPUs, 8 accumulation steps. What is the effective batch size?
   - 64 samples. 2 times 4 times 8 accumulation groups form one optimizer step, matching the notebook Homework 2 assert.
3. Batch size 1024, context 256, budget 327.68M tokens. How many optimizer steps?
   - 1250. Each step consumes 1024 times 256 = 262144 tokens, and 327680000 / 262144 = 1250.
4. Training resumes at step t. What schedule state must the checkpoint hold?
   - Only t. The schedule is a closed-form function of t, so restoring the exact step restores the exact rate. The optimizer moments are separate state and must be restored alongside.

</details>

#### U4. Keeping training numerically healthy

**About 3 h** · **Target:** Explain + Measure

Topics: Gradient clipping and numerical-event logging; Mixed-precision vocabulary, scaling and overflow signals

One bad batch can end a run, and mixed precision makes bad batches likelier. Clipping, scaling and logging turn a crash into a diagnosed event with a known remedy.

**You can now**

- Explain the clipping rule, where it sits in the step order, and how it changes with a gradient scaler.
- Explain autocast dtype choice and how GradScaler protects small gradients from underflow.
- Log gradient norms, loss scale and skipped steps, and read overflow signals from the log.

**Study**

1. [CS336 Assignment 1 handout: gradient clipping](https://github.com/stanford-cs336/assignment1-basics/blob/main/cs336_assignment1_basics.pdf) (Stanford CS336 Assignment 1 - training and decoding contract) - Section 4.5, Gradient clipping (p. 34): the global norm rule with max M and eps 1e-6, applied in place after the backward pass.
2. [PyTorch AMP recipe: autocast, GradScaler and clipping order](https://docs.pytorch.org/tutorials/recipes/recipes/amp_recipe.html) (PyTorch Automatic Mixed Precision recipe) - Sections Adding torch.autocast (forward under autocast, never backward), Adding GradScaler (scale, backward, conditional step, update) and Inspecting/modifying gradients (unscale_ before clipping), plus Troubleshooting for inf and NaN loss.
3. [LLMs from Scratch Appendix D: worked clipping example](https://github.com/rasbt/LLMs-from-scratch/blob/main/appendix-D/01_main-chapter-code/appendix-D.ipynb) (LLMs from Scratch companion - training and generation) - Section D.3 (L2 norm worked example on the gradient matrix G, before-and-after clipping comparison) and Section D.4 (clipping inside the modified training function).

**Focus**

- Clipping rescales the whole gradient vector when its global norm passes M. Direction is preserved; only the step length is capped.
- Under a scaler, gradients are scaled by s, so unscale_ must run before the norm check or the threshold tests the wrong numbers.
- Autocast keeps compute-heavy ops in float16 but reductions and the loss in float32, because they need the dynamic range.
- A skipped optimizer step is protection working, not a bug. The log should show the skip, the shrunken scale and the recovery.

**Reproduce:** Write the clip-then-step order for a plain loop and an AMP loop, including unscale_, the skip-on-inf rule and the per-step values to log.

**Traps**

- Clipping the scaled gradients. The norm test then uses a threshold meant for unscaled values and either never fires or always fires.
- Running backward under autocast. Backward ops must run in the dtype chosen for the forward ops, outside the context.
- Retrying a diverged run with the same seed and settings. The overflow recurs; lower the scale policy, the clip threshold or the learning rate first.

**Practice**

- [CS336 Assignment 1: gradient_clipping](https://github.com/stanford-cs336/assignment1-basics/blob/main/tests/test_nn_utils.py) - Problem (gradient_clipping) in Section 4.5; connect your function to run_gradient_clipping in tests/adapters.py and pass test_gradient_clipping in tests/test_nn_utils.py. The test compares against clip_grad_norm_ with a frozen parameter and max_norm 1e-2. Implement it in your own repository.
- [PyTorch AMP recipe: add autocast and GradScaler to the default-precision loop](https://docs.pytorch.org/tutorials/recipes/recipes/amp_recipe.html) - Sections Adding torch.autocast through All together: run the default-precision loop, convert it, and keep the output-dtype and loss-dtype asserts green. Run on any CUDA machine you can access; on CPU, read the scale and skip logic and wire the same order into your own loop without claiming speedups.

**Stop when:** Your clipping matches the reference in test_gradient_clipping, and your AMP loop holds the recipe dtype asserts while you explain each skip from your own log.

<details>
<summary>Self-test</summary>

1. The global gradient norm is 5 and M is 1. What does clipping do?
   - It multiplies every gradient by about 1/5, the factor M / (norm + eps). The resulting norm sits just under 1 and the update direction is unchanged.
2. Why must scaler.unscale_ run before gradient clipping?
   - Backward under a scaler leaves gradients multiplied by the scale s. Clipping tests the norm against M, so on scaled values the comparison is wrong by a factor of s and corrupts the step.
3. The scaler finds inf gradients and skips optimizer.step. What must still run, and what happens to the batch?
   - scaler.update() still runs so the scale shrinks for the next step. The batch contributes no update; its gradients are discarded.
4. Under autocast, linear layers run in float16 but the loss stays in float32. Why?
   - Linears are compute-heavy and safe in half precision, while the loss is a reduction that needs float32 dynamic range. The recipe asserts output is float16 and loss is float32.

</details>

#### U5. Checkpoints that really resume

**About 4 h** · **Target:** Implement + Measure

Topics: Model, optimizer, scheduler, scaler and RNG checkpoint state; Tokenizer, data and configuration identity binding; Interrupted versus uninterrupted resume equivalence

A weights-only checkpoint restarts training but not the run: learning rate, moments and data order all jump. Equivalence tests turn resume from a hope into a measured fact.

**You can now**

- Save and load complete training state: model, optimizer, schedule step, scaler, RNG and data order.
- Bind tokenizer, data and configuration identity to each checkpoint so mismatches fail loudly.
- Prove interrupted training matches uninterrupted training to a stated equivalence level.

**Study**

1. [CS336 Assignment 1 handout: checkpointing and the training loop](https://github.com/stanford-cs336/assignment1-basics/blob/main/cs336_assignment1_basics.pdf) (Stanford CS336 Assignment 1 - training and decoding contract) - Section 5.2, Checkpointing (p. 35): model and optimizer state_dict plus iteration through torch.save and torch.load; then Section 5.3, Training loop (p. 36): configurable hyperparameters, memmap datasets, checkpoint paths and step plus wall-clock logging.
2. [LLMs from Scratch ch05: saving and loading weights](https://github.com/rasbt/LLMs-from-scratch/blob/main/ch05/01_main-chapter-code/ch05.ipynb) (LLMs from Scratch companion - training and generation) - Section 5.4 (torch.save on state_dict, load_state_dict into a fresh model, and why adaptive optimizers need their state saved too).
3. [PyTorch saving and loading: general checkpoint plus RNG control](https://docs.pytorch.org/tutorials/beginner/saving_loading_models.html) (PyTorch saving, loading and reproducibility references) - Saving and Loading a General Checkpoint for Inference and/or Resuming Training (Save and Load: model plus optimizer state dicts with the epoch or step).
4. [PyTorch reproducibility notes: RNG and DataLoader state](https://docs.pytorch.org/docs/stable/notes/randomness.html) (PyTorch saving, loading and reproducibility references) - Controlling sources of randomness (torch, Python and other libraries) and DataLoader (generator seeds for worker shuffling), plus Avoiding nondeterministic algorithms. Depth: Read for the checklist of what counts as state; skip CUDA kernel backend options until GPU work needs them.
5. [Modern LLM Notebook 09-model-config: repository and config identity](https://github.com/walkinglabs/modern-llm-notebook/blob/main/notebooks-en/part2-training/09-model-config.ipynb) (Modern LLM Notebook - configuration, loss and generation) - Repository File Map (config, tokenizer_config and generation_config roles) and the tokenizer_config section (special tokens, max length, truncation and padding sides).

**Focus**

- The iteration number restores the schedule exactly, the optimizer state restores the moments, and the scaler state restores the loss scale.
- RNG seeds and data-loader order are training state. A fresh shuffle on resume silently starts a different run.
- Equivalence needs a stated level: exact loss match for a few steps on fixed hardware, then tolerance bands beyond that.
- Tokenizer and config versions pin the meaning of every saved tensor. A changed vocabulary or width redefines all IDs and shapes.

**Reproduce:** Write save and load for model, optimizer, iteration, scaler and RNG seeds, then an interrupted-versus-uninterrupted equivalence test over fixed steps.

**Traps**

- Saving weights only. The resumed run restarts the schedule and moments, so loss jumps even though the model is identical.
- Recreating the DataLoader without its generator state. Batches arrive in a new order and the run diverges from the uninterrupted reference.
- Loading weights into an edited config. Shapes may still match while token IDs or widths mean something new, and nothing raises an error.

**Practice**

- [CS336 Assignment 1: checkpointing](https://github.com/stanford-cs336/assignment1-basics/blob/main/tests/test_serialization.py) - Problem (checkpointing) in Section 5.2; connect save and load to run_save_checkpoint and run_load_checkpoint in tests/adapters.py and pass test_checkpointing in tests/test_serialization.py. The test trains 10 AdamW steps, round-trips through a file and compares model and optimizer states exactly. Then extend it in your own repository with scaler, RNG and DataLoader order plus a resume-equivalence check.

**Stop when:** Your checkpoint round-trips through test_checkpointing, and your own resume test matches the uninterrupted loss to your stated tolerance.

<details>
<summary>Self-test</summary>

1. The checkpoint holds model, optimizer and iteration. Why is the iteration number needed?
   - It restores the schedule position. Without it the learning rate restarts at the wrong phase, for example back at the warmup peak, and the run diverges from the original.
2. Your resume test matches the uninterrupted run exactly for five steps on CPU, but on a GPU the losses drift apart by about 1e-6 per step. Is resume broken?
   - Not necessarily. Nondeterministic kernels and reduction order give tiny float differences that compound, so state the equivalence level: exact on CPU with deterministic algorithms, a tolerance band on GPU. A sudden jump at the resume step, by contrast, means missing state.
3. Resumed loss diverges from the uninterrupted run within a few steps. Name two suspects.
   - Unrestored RNG or DataLoader order, which feeds different batches, and missing scaler or optimizer moment state, which changes the update itself.
4. Why pin tokenizer_config and config versions alongside the checkpoint?
   - Token IDs and tensor shapes are config-relative. A changed vocabulary or width silently redefines what every saved number means, so the binding must fail loudly on mismatch.

</details>

#### U6. Decoding policies: from greedy to nucleus sampling

**About 4 h** · **Target:** Derive + Implement

Topics: Logits, greedy decoding and deterministic argmax; Temperature and distribution renormalization; Top-k and nucleus top-p truncation; Beam-search objective and cost vocabulary; Repetition and length penalties

The model outputs probabilities; the policy decides the text. The same logits can produce a memo or gibberish depending on truncation, so the policy must be owned separately from the weights.

**You can now**

- Derive the renormalized distribution after temperature, top-k and top-p with their edge cases.
- Implement greedy, temperature, top-k and top-p sampling with deterministic seeds.
- Compare decoding policies on matched logits with fixed output budgets, including beam search and repetition control.

**Study**

1. [CS336 Assignment 1 handout: decoding with temperature and top-p](https://github.com/stanford-cs336/assignment1-basics/blob/main/cs336_assignment1_basics.pdf) (Stanford CS336 Assignment 1 - training and decoding contract) - Section 6, Generating text (pp. 37 to 38): equations 21 and 22 for last-position sampling, temperature scaling in equation 23 with the argmax limit, and nucleus sampling in equation 24 as the smallest set with cumulative probability at least p.
2. [LLMs from Scratch ch05: temperature, top-k and the generate function](https://github.com/rasbt/LLMs-from-scratch/blob/main/ch05/01_main-chapter-code/ch05.ipynb) (LLMs from Scratch companion - training and generation) - Sections 5.3.1 (multinomial versus argmax, temperature 0.1 and 5.0 behavior), 5.3.2 (top-k masking with negative infinity) and 5.3.3 (the generate function combining temperature, top-k and eos_id).
3. [Modern LLM Notebook 20-generation: truncation arithmetic](https://github.com/walkinglabs/modern-llm-notebook/blob/main/notebooks-en/part3-inference/20-generation.ipynb) (Modern LLM Notebook - configuration, loss and generation) - Sections 3 (greedy as argmax), 4 (temperature table), 5.1 (top-k with the 0.71 and 0.29 renormalization), 5.2 (top-p nucleus with p 0.9) and 5.3 (industry default of top-k plus top-p).
4. [Modern LLM Notebook 20-generation: beam search and repetition](https://github.com/walkinglabs/modern-llm-notebook/blob/main/notebooks-en/part3-inference/20-generation.ipynb) (Modern LLM Notebook - configuration, loss and generation) - Sections 6 (beam search keeps K paths, fits translation and summarization, bores creative writing) and 7 (repetition penalty divides positive logits and multiplies negative ones). Depth: Read for objective and cost vocabulary only; full beam and penalty tuning belong to later tracks.

**Focus**

- Temperature approaching zero recovers argmax, and top-k with k 1 is greedy by another name.
- Truncation zeroes the tail first, then renormalizes, then samples. Sampling before renormalizing draws from the wrong distribution.
- Top-p adapts the candidate count to the distribution shape, which is why a fixed k fails on both sharp and flat distributions.
- Beam search optimizes sequence score over K paths; it is not a sampling method and it trades diversity for safety.

**Reproduce:** Implement top-k and top-p filters from sorted probabilities with renormalization, plus the temperature zero and one edge cases, all under a fixed seed.

**Traps**

- Applying top-p to raw logits. Cumulative probability needs probabilities, so softmax must come before sorting and accumulation.
- Forgetting renormalization after masking. The kept tokens must sum to one before multinomial sees them.
- Expecting diversity from beam search. Wider beams concentrate on safe sequences; temperature and nucleus control diversity instead.

**Practice**

- [Modern LLM Notebook 20-generation Exercises 1 to 3: temperature, top-k, top-p](https://github.com/walkinglabs/modern-llm-notebook/blob/main/notebooks-en/part3-inference/20-generation.ipynb) - Exercises section: Exercise 1 (scaled logits assert), Exercise 2 (top-k positions assert) and Exercise 3 (top-p accumulation); each cell asserts the exact answer. Solve each by hand first, then confirm with the cell. Afterwards reproduce fixed-seed greedy, temperature, top-k and top-p outputs from your own sampler on matched logits.

**Stop when:** Your filters pass all three exercise asserts, and your sampler reproduces fixed-seed outputs for each policy on matched logits within a fixed budget.

<details>
<summary>Self-test</summary>

1. Logits [2.0, 1.0, 0.5] with temperature 0.5. What are the scaled logits?
   - [4.0, 2.0, 1.0]. Temperature divides the logits, which sharpens the distribution toward the argmax.
2. Logits [0.1, 2.0, 0.5, 3.0, 0.01] with top_k 2. Which positions survive?
   - Positions 3 (value 3.0) and 1 (value 2.0). Everything else is set to negative infinity before softmax.
3. Probabilities [0.4, 0.3, 0.15, 0.1, 0.05] with p 0.8. Which tokens stay?
   - The first three. Sorted accumulation gives 0.4, then 0.7, then 0.85, which first reaches 0.8 at the third token.
4. The distribution is sharp and k is 40. What goes wrong, and what fixes it?
   - Top-k drags 39 implausible tail tokens into the candidate set. Top-p fixes it by stopping accumulation once the nucleus reaches p, keeping only the concentrated head.

</details>

#### U7. Stopping rules and reproducible generation

**About 3 h** · **Target:** Implement

Topics: EOS, stop sequences, maximum length and finished batches; Sampling RNG, reproducibility and output validation; Prompt and chat-template comparison

Unbounded generation never terminates cleanly, and unseeded sampling cannot be debugged. Stopping, seeds and validation turn demos into experiments that can be rerun and compared.

**You can now**

- Implement EOS, stop-sequence, maximum-length and finished-batch handling in a generate loop.
- Make sampling exactly reproducible from a recorded seed and validate the outputs.
- Compare prompts and chat templates while holding decoding fixed, and state each choice in config.

**Study**

1. [Raschka gpt_generate.py: bounded generation with eos_id](https://github.com/rasbt/LLMs-from-scratch/blob/main/ch05/01_main-chapter-code/gpt_generate.py) (LLMs from Scratch companion - training and generation) - generate(): context-window slicing of the running sequence, the max_new_tokens loop, the eos_id early break and appending each sampled token.
2. [Modern LLM Notebook 20-generation: complete pipeline and order](https://github.com/walkinglabs/modern-llm-notebook/blob/main/notebooks-en/part3-inference/20-generation.ipynb) (Modern LLM Notebook - configuration, loss and generation) - Section 9 (complete generate with penalty, temperature, top-k and top-p, eos_id and seed) and the Summary execution order: penalty, temperature, top-k and top-p, sample, then eos.
3. [PyTorch reproducibility notes: seeding for exact reruns](https://docs.pytorch.org/docs/stable/notes/randomness.html) (PyTorch saving, loading and reproducibility references) - Controlling sources of randomness (seed torch, Python and other libraries together); the Raschka scripts set torch.manual_seed(123) before generation.
4. [Modern LLM Notebook 20-generation and 10-training-loss: templates](https://github.com/walkinglabs/modern-llm-notebook/blob/main/notebooks-en/part3-inference/20-generation.ipynb) (Modern LLM Notebook - configuration, loss and generation) - Notebook 20 Section 8 (chat templates stitch turns into model text, wrong template degrades quality, apply_chat_template) with notebook 10 Section 2 (templates decide which tokens the loss sees).
5. [Hugging Face LLM Course: inference translation](https://huggingface.co/learn/llm-course/chapter1/8) (Hugging Face LLM Course - library translation) - Chapter 1, Inference with LLMs (chapter1/8): map generation configuration and stopping behavior into library APIs. Depth: Open only after the blank-file loop passes fixed-seed checks; the from-scratch tests stay the authority.

**Focus**

- Check EOS every step and cap length regardless. EOS is model-controlled and may never arrive.
- Seed every RNG in the path and record the seeds with the output. One unseeded source breaks reruns.
- Validation is cheap and explicit: EOS present, length within cap, template matching training, decoded text well-formed.
- Hold decoding fixed when comparing prompts or templates, or policy differences will masquerade as prompt effects.

**Reproduce:** Write a generate loop with max_new_tokens, eos_id, a stop-sequence check and seed control that returns identical tokens on every rerun.

**Traps**

- Stopping on EOS alone. A model that never emits EOS generates until the budget or the wallet runs out.
- Seeding torch but not the Python RNG or sampler state. Multinomial draws still differ and the mismatch looks like a model bug.
- Grading a chat model with the wrong template and blaming the weights. Format mismatch degrades answers without changing any parameter.

**Practice**

- [Modern LLM Notebook 09-model-config Exercise 1: compare generation configs](https://github.com/walkinglabs/modern-llm-notebook/blob/main/notebooks-en/part2-training/09-model-config.ipynb) - Exercise 1: open two model generation_config files, write three differences with explanations for temperature, top_p, top_k, max_new_tokens and stopping entries. Then encode your own loop's stopping and sampling choices as one such config and demonstrate the EOS plus max-length stops with a fixed seed.

**Stop when:** Your loop stops on EOS and on the cap, reruns bit-identically from a recorded seed, and every stopping and template choice is stated in one config.

<details>
<summary>Self-test</summary>

1. Why does the loop need both eos_id and max_new_tokens?
   - EOS is emitted by the model and may never come, so it cannot bound cost. The cap bounds tokens, latency and cost on every call no matter what the model does.
2. Same seed, different outputs on rerun. Name two suspects.
   - An unseeded RNG such as Python random or a sampler without generator control, and a nondeterministic kernel or op ordering. Both must be fixed before blaming the policy code.
3. What failure does apply_chat_template prevent?
   - Train and serve format mismatch. The template wraps turns exactly as training saw them; a hand-rolled prompt can silently use the wrong markers and degrade quality.
4. A run uses temperature 0.6, top_p 0.9, top_k 50 and repetition penalty 1.1. In what order do they apply?
   - Penalty first, then temperature, then top-k and top-p truncation, then sampling, then the EOS check, as the notebook summary lists. The order matters: temperature changes the probabilities, so applying it before or after top-p changes which tokens the nucleus keeps. Record the order in the config.

</details>

### Mini-project: Train, resume and sample the tiny decoder

**About 10 to 14 hours.** Turn the decoder into a trained model you can trust: a loss you can derive by hand, a loop that resumes exactly, and decoding policies whose distributions you can check. Train on the packed split from section 1 on a CPU or a free GPU notebook.

1. Implement cross-entropy, gradient clipping, AdamW, the warmup-cosine schedule, get_batch and checkpointing, and pass the CS336 tests in test_nn_utils.py, test_optimizer.py, test_data.py and test_serialization.py.
2. Run two controls before any real run: drive one tiny batch to near-zero loss, and confirm that a run on shuffled targets leaves validation loss near the unigram baseline.
3. Train on your section 1 split with a fixed seed, logging loss, gradient norm, learning rate and tokens seen, with a validation curve from the held-out split.
4. Save complete state, including model, optimizer, step, RNG and data cursor, and show that an interrupted run matches an uninterrupted one to a stated level.
5. Implement greedy, temperature, top-k and top-p sampling with EOS and length stops, and reproduce fixed-seed outputs exactly.
6. Connect the atlas lab adapters for section 3 and pass tests/test_s3_training.py.

**Deliverables**

- The training script and config, with the checkpoint format documented.
- The training log and validation curve for your run, plus the two control runs.
- A resume-equivalence result: the steps compared, the tolerance and why it is the right one.
- Sample outputs for each decoding policy from one prompt and seed, with the config that reproduces them.

**Checks**

- external-tests: [CS336 tests for cross-entropy, clipping, AdamW, the schedule, data loading and checkpointing](https://github.com/stanford-cs336/assignment1-basics/tree/main/tests). Run `uv run pytest tests/test_nn_utils.py tests/test_optimizer.py tests/test_data.py tests/test_serialization.py`.
- harness: [Atlas lab, section 3: loss threshold, resume equivalence and sampling filters](https://github.com/saisandeshk/ai-atlas/tree/main/labs/llm-foundations). Run `uv run pytest tests/test_s3_training.py`. Run in labs/llm-foundations of an ai-atlas clone after you connect adapters.py to your package. The threshold test trains on a Markov chain with a known entropy rate: validation loss must approach that rate, and a loss below it means the labels leak. Resume must match an uninterrupted run exactly on CPU.
- rubric: Self-grade with the rubric below.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Objective | Your cross-entropy passes the public test, including the overflow case. | You derive one masked loss by hand and match your code, and the shuffled-target control behaves as you predicted. |
| Training | Validation loss falls on your split and the section 3 lab threshold test passes. | The log shows learning rate, gradient norm and tokens seen, and you explain one anomaly from it. |
| Resume | An interrupted run continues without a loss jump. | Losses after resume match the uninterrupted run exactly on CPU, and your stated GPU tolerance is justified. |
| Decoding | Each policy runs and stops on EOS or the length cap. | Fixed-seed outputs reproduce exactly, and you show by hand how temperature followed by top-p changes the kept set at one step. |

Feeds into: Capstone artifact 2: the trained checkpoint and its decoding policies. Section 4 evaluates this checkpoint, and section 5 must reproduce its greedy outputs with a cache.

### Resource route

- **Primary - Implementation:** [LLMs from Scratch companion - training and generation](https://github.com/rasbt/LLMs-from-scratch/tree/main/ch05) - Use the ch05 training and generation code for the small pretraining loop. Add full checkpoint state, explicit loss masks and resume-equivalence tests that the base example does not supply.
- **Required - Assessment:** [Stanford CS336 Assignment 1 - training and decoding contract](https://github.com/stanford-cs336/assignment1-basics) - Use cross_entropy, adamw, adamw_accounting, learning_rate_schedule, gradient_clipping, data_loading, checkpointing, training_together and decoding specifications plus public tests. Debug on CPU and implement independently in your own repository.
- **Support - Implementation:** [Modern LLM Notebook - configuration, loss and generation](https://walkinglabs.github.io/modern-llm-notebook/?lang=en) - Use English notebooks 09-model-config, 10-training-loss and 20-generation to visualize configuration ownership, shifted loss and decoding policies. Change edge cases and cross-check probability calculations against your own implementation.
- **Support - Reference:** [PyTorch saving, loading and reproducibility references](https://docs.pytorch.org/tutorials/beginner/saving_loading_models.html) - Use the state-dict and reproducibility notes to enumerate all state needed for the supported resume guarantee. Test model, optimizer, schedule, scaler, data order and RNG state across an interruption.
- **Optional - Application:** [Hugging Face LLM Course - library translation](https://huggingface.co/learn/llm-course/chapter1/1) - Only after the blank-file loop passes, map tokenization, model configuration, data collation, generation configuration and stopping behavior into Transformers APIs. Keep the from-scratch tests as the authority.
- **Support - Reference:** [PyTorch Automatic Mixed Precision recipe](https://docs.pytorch.org/tutorials/recipes/recipes/amp_recipe.html) - Use the autocast, GradScaler, unscale-before-clip, scaler checkpointing and inf-NaN troubleshooting sections to add mixed precision to the blank-file loop. Keep the CS336 clipping contract as the authority for the clipping rule.

### Exit checkpoint

Overfit one tiny batch, prove target and mask alignment, train and resume a compact decoder with a stated equivalence level, then reproduce fixed-seed greedy, temperature, top-k and top-p outputs while explaining each distributional change.

<details>
<summary>Deliberately left for later</summary>

- Large-scale pretraining and distributed checkpointing
- SFT, LoRA, DPO, RLHF and RLVR
- Production decoding servers and fleet scheduling

</details>

## 04. Evaluation, Claims & Model Arithmetic

**Why:** A score is useful only when the task, parser, sampling policy, uncertainty and contamination boundary are defensible. Cost estimates must likewise state shapes, units and omitted overhead before they guide a design.

### Learn this much

- [ ] Conditional likelihood and token-weighted perplexity _(Required)_
- [ ] Tokenizer dependence and limits of perplexity comparison _(Required)_
- [ ] Task contract, prompt version and output schema _(Required)_
- [ ] Exact match, normalized match and structured verifiers _(Required)_
- [ ] Generation metrics and their counterexamples _(Required)_
- [ ] Human review and adjudication subsets _(Required)_
- [ ] Model-based judge position, length, style and identity bias _(Required)_
- [ ] Raw-output retention and evaluator versioning _(Required)_
- [ ] Slices, paired comparisons and bootstrap uncertainty _(Required)_
- [ ] Prompt sensitivity, robustness and sampling-compute budgets _(Required)_
- [ ] Exact and approximate contamination checks _(Required)_
- [ ] Memorization, duplicates and unsupported capability claims _(Required)_
- [ ] Capability versus safety evaluation boundaries _(Required)_
- [ ] Embedding, attention, feed-forward and output parameter counts _(Required)_
- [ ] Forward, backward and training FLOP approximations _(Required)_
- [ ] Gradient, optimizer, activation and temporary memory _(Required)_
- [ ] Sequence length, vocabulary and batch scaling terms _(Required)_
- [ ] Arithmetic intensity vocabulary and hardware-independent limits _(Required)_
- [ ] Allocator, graph, kernel and framework overhead reconciliation _(Required)_
- [ ] Quality-compute comparisons and uncertainty ranges _(Required)_
- [ ] Small evaluator-disagreement study _(Optional)_
- [ ] Bounded IsoFLOPs curve-fitting exercise _(Optional)_
- [ ] Benchmark leadership and large-scale contamination research _(Later)_
- [ ] Safety red teaming and post-training evaluation suites _(Later)_

### Study units

#### U1. Likelihood and perplexity, and their limits

**About 3 h** · **Target:** Derive

Topics: Conditional likelihood and token-weighted perplexity; Tokenizer dependence and limits of perplexity comparison

Perplexity guides training and scaling because it is smooth, but it scores every token including ones the task does not care about. A lower number on different tokenizers or splits is not a better model.

**You can now**

- Derive token-weighted perplexity with an explicit valid-token mask and state the conditional form for prompt-conditioned scoring.
- Explain why perplexity comparisons need the same tokenizer, data split and conditioning before any ranking claim.
- Read word, byte and bits-per-byte variants from an evaluation config and say which one removes tokenizer effects.

**Study**

1. [CS336 Lecture 12: perplexity()](https://github.com/stanford-cs336/lectures/blob/main/lecture_12.py) (Stanford CS336 - resource accounting, inference and evaluation) - Function perplexity(): p(x) over token sequences, perplexity (1/p(D))^(1/|D|), PTB, WikiText-103 and One Billion Word splits, GPT-2 WebText 40GB zero-shot on small versus 1BW sets, conditional perplexity p(response|prompt)^(1/|response|), the trust warning for perplexity leaderboards, and LAMBADA plus HellaSwag as perplexity in disguise.
2. [Modern LLM Notebook 25-evaluation: perplexity and metric choice](https://github.com/walkinglabs/modern-llm-notebook/blob/main/notebooks-en/part3-inference/25-evaluation.ipynb) (Modern LLM Notebook - evaluation and FLOP accounting) - Intro (perplexity suits language modeling and pretraining monitoring, not chat, reasoning or safety) and Section 9.1 (perplexity row: sum of logprobs, ppl and bpb on WikiText and Lambada).
3. [lm-eval-harness: wikitext perplexity config](https://github.com/EleutherAI/lm-evaluation-harness/blob/main/lm_eval/tasks/wikitext/wikitext.yaml) (Language Model Evaluation Harness) - wikitext.yaml: loglikelihood_rolling with word_perplexity, byte_perplexity and bits_per_byte (version 2.0).
4. [lm-eval-harness: perplexity aggregations in metrics.py](https://github.com/EleutherAI/lm-evaluation-harness/blob/main/lm_eval/api/metrics.py) (Language Model Evaluation Harness) - perplexity as exp(-mean), weighted_perplexity as exp(-weighted_mean) and bits_per_byte as -weighted_mean/log(2).

**Focus**

- The mean runs over scored tokens only. Prompt tokens leave both the sum and the count in the conditional form.
- Perplexity is exp of the mean negative log likelihood, so it reads as the effective shortlist size at each step.
- A new tokenizer changes the token count for the same text, so the means run over different units. Bits per byte divides by bytes to remove that effect.
- Perplexity is smooth and universal for scaling, but it penalizes tokens the task ignores. Task accuracy still needs its own contract.

**Reproduce:** From correct-token probs 0.5, 0.7 and 0.5, derive the mean negative log likelihood 0.58 and the perplexity 1.79 by hand, then state the conditional form for a prompt plus response.

**Traps**

- Comparing perplexity across tokenizers or splits. Different vocabularies split the same text into different token counts, so the ranking is meaningless.
- Reading a low perplexity as chat quality, reasoning or safety. The lecture and notebook both limit it to language modeling and pretraining monitoring.
- Trusting submitted perplexity numbers without checking that probs sum to one. Accuracy needs only output text, but perplexity needs valid probabilities.

**Practice**

- [Modern LLM Notebook 25-evaluation Exercise 1: Perplexity by Hand](https://github.com/walkinglabs/modern-llm-notebook/blob/main/notebooks-en/part3-inference/25-evaluation.ipynb) - Exercises: Exercise 1 with output probs [0.5, 0.3, 0.2], [0.1, 0.7, 0.2], [0.4, 0.1, 0.5]; take the log prob at each step, average, then exponentiate. Take the stated correct-token probs as given and compare your hand result with code. Then rescore the same text after a tokenizer change to see the denominator move.

**Stop when:** You hand-compute 1.79 from the three probs, and you can say for any reported perplexity which tokenizer, split and conditioning it used.

<details>
<summary>Self-test</summary>

1. Correct-token probs are 0.5, 0.7 and 0.5. What is the perplexity?
   - About 1.79. The mean negative log likelihood is -(ln0.5 + ln0.7 + ln0.5)/3 = 0.58, and exp(0.58) = 1.79.
2. Two tokenizers score the same text with mean NLL 2.0 over 100 tokens and 1.8 over 150 tokens. Which model is better?
   - The first, if both scored the same text. Per-token means use different denominators, so compare totals instead: 2.0 x 100 = 200 nats versus 1.8 x 150 = 270 nats. The first model gives the text higher probability even though its per-token perplexity looks worse; bits per byte makes the same comparison.
3. Why does the lecture warn that a perplexity leaderboard must trust the model?
   - Perplexity computes from the model's own probabilities, so they must sum to one. A task accuracy check only reads generated text and does not need that trust.
4. When should you report conditional perplexity instead of full perplexity?
   - When a prompt is given and only the response matters. Score p(response|prompt) normalized by response length, so prompt tokens do not dilute the number.

</details>

#### U2. Task contracts and automatic metrics

**About 4 h** · **Target:** Implement

Topics: Task contract, prompt version and output schema; Exact match, normalized match and structured verifiers; Generation metrics and their counterexamples; Raw-output retention and evaluator versioning

Most evaluation gains come from parsing, prompts or versions, not from the model. A contract plus raw outputs turns a score into evidence that survives review.

**You can now**

- Define a task contract with prompt version, few-shot count, output schema and parsing rules before running any model.
- Implement exact and normalized match plus a structured verifier, and show a counterexample for each automatic metric.
- Retain raw outputs and version the task, prompt, parsing and model so another run reproduces the score.

**Study**

1. [Modern LLM Notebook 25-evaluation: metric system and pitfalls](https://github.com/walkinglabs/modern-llm-notebook/blob/main/notebooks-en/part3-inference/25-evaluation.ipynb) (Modern LLM Notebook - evaluation and FLOP accounting) - Section 9.1 (loglikelihood acc and acc_norm for MCQ, generate_until exact_match, pass@k and F1 for generation, strict_acc for IFEval) and Sections 10.1 to 10.2 (prompt sensitivity 5 to 15 percent with OLMES prompts, few-shot 0, 5 and 8, seed, temperature 0, Chat versus Completions API confusion).
2. [lm-eval-harness: GSM8K task contract](https://github.com/EleutherAI/lm-evaluation-harness/blob/main/lm_eval/tasks/gsm8k/gsm8k.yaml) (Language Model Evaluation Harness) - doc_to_text and doc_to_target, metric exact_match with strict-match regex #### (number) versus flexible-extract last-number regex, generation_kwargs until Question with do_sample false and temperature 0.0, num_fewshot 5, metadata version 3.0.
3. [lm-eval-harness: task configuration guide](https://github.com/EleutherAI/lm-evaluation-harness/blob/main/docs/task_guide.md) (Language Model Evaluation Harness) - Task naming, doc_to_text, doc_to_target, doc_to_choice, num_fewshot, output_type generate_until, loglikelihood and multiple_choice, filter_list pipelines, metadata version.
4. [lm-eval-harness: exact match and accuracy metrics](https://github.com/EleutherAI/lm-evaluation-harness/blob/main/lm_eval/api/metrics.py) (Language Model Evaluation Harness) - exact_match_hf_evaluate with regexes_to_ignore, ignore_case and ignore_punctuation plus mean aggregation; acc and acc_norm entries for loglikelihood and multiple_choice.
5. [CS336 Lecture 12: exam benchmarks and rules of the game](https://github.com/stanford-cs336/lectures/blob/main/lecture_12.py) (Stanford CS336 - resource accounting, inference and evaluation) - Function exam_benchmarks() with MMLU 57 subjects and few-shot prompting, MMLU-Pro 4 to 10 choices with 16 to 33 percent drops, IFEval synthetic constraints that check format not semantics; plus how_to_think_about_evaluation() with methods versus models and the nanogpt speedrun and DataComp-LM rules of the game.

**Focus**

- The task is the prompt plus few-shot plus parsing plus version, not just the dataset name. Change any part and the score means something new.
- Strict match needs the #### marker, flexible extract takes the last number. The same outputs can pass one and fail the other.
- acc picks the highest-prob choice, acc_norm corrects for length. IFEval strict_acc checks format and keywords, not whether the answer is right.
- Keep raw generations and the config hash. Reruns compare filtered outputs, not just the mean.

**Reproduce:** From one GSM8K output without a #### marker that states the right number, show strict-match failing while flexible-extract passes, then write the version string that would catch the parser change.

**Traps**

- Comparing scores across papers with different prompts, few-shot counts or parsers. The notebook calls such comparisons invalid without aligned configs.
- Treating flexible-extract as strict. Lenient parsing inflates the score without changing the model.
- Reading IFEval strict accuracy as semantic quality. It verifies constraints such as word count and keywords, not the meaning of the response.

**Practice**

- The section mini-project covers this: a versioned task contract with prompt, parser and exact or structured metric, raw outputs kept beside the scores, and one parser failure exposed and fixed.

**Stop when:** Your harness records prompt, few-shot, parser and versions with raw outputs, and you can show one output where strict and flexible disagree.

<details>
<summary>Self-test</summary>

1. An output says The answer is 42 with no #### marker. How do strict-match and flexible-extract score it?
   - Strict fails because there is no #### (number) match, while flexible extracts the last number-like token 42 and passes. Report both pipeline names with the score.
2. When should you report acc_norm instead of acc?
   - acc compares raw choice loglikelihoods, acc_norm normalizes by length or bytes. Use the normalized form when choices differ in length or tokenization, and state which one the table uses.
3. Which temperature and sampling settings suit deterministic task metrics?
   - Use temperature 0 with do_sample false for exact and structured metrics. Use non-zero temperature only for pass@k, self-consistency or robustness runs, and then fix the seed.
4. What must be versioned for a task result to be reproducible?
   - Task YAML plus commit hash, prompt text, few-shot count and split, filter regexes, generation kwargs, model version and evaluator version, plus raw outputs saved with log_samples and output_path.

</details>

#### U3. Model judges and human review

**About 3 h** · **Target:** Explain + Measure

Topics: Human review and adjudication subsets; Model-based judge position, length, style and identity bias; Small evaluator-disagreement study

Open-ended quality has no ground truth, so a judge is a measuring instrument with its own errors. Without bias controls and a human spot check, win rates measure style more than correctness.

**You can now**

- Explain position, length, style, identity and verbosity biases in model judges and the fix for each.
- Explain when human review and adjudication subsets are needed instead of another automatic metric.
- Measure judge disagreement with a position-swap study and report residual uncertainty against a human or deterministic subset.

**Study**

1. [Modern LLM Notebook 25-evaluation: LLM-as-Judge and AlpacaEval](https://github.com/walkinglabs/modern-llm-notebook/blob/main/notebooks-en/part3-inference/25-evaluation.ipynb) (Modern LLM Notebook - evaluation and FLOP accounting) - Section 4.1 to 4.3 (judge idea, WR, LC win rate and MT-Bench scores, JUDGE_PROMPT with [[rating]] format and the two-sample scoring loop) and Section 6.1 to 6.5 (AlpacaEval 805-prompt workflow, CLI and Python API, LC versus raw win rate with average length).
2. [Modern LLM Notebook 25-evaluation: judge bias and consistency](https://github.com/walkinglabs/modern-llm-notebook/blob/main/notebooks-en/part3-inference/25-evaluation.ipynb) (Modern LLM Notebook - evaluation and FLOP accounting) - Section 8.1 (position, length, egocentric and verbosity biases with randomize, LC win rate and cross-judge mitigations) and Section 8.2 (CR@K, prompt, order and sampling robustness, plus manual review proportion by risk).
3. [CS336 Lecture 12: chat benchmarks](https://github.com/stanford-cs336/lectures/blob/main/lecture_12.py) (Stanford CS336 - resource accounting, inference and evaluation) - Function chat_benchmarks() with Chatbot Arena pairwise ELO, live prompts, style versus correctness and sycophancy risks; AlpacaEval 805 win rate versus GPT-4 preview with length gaming and 2.0 regression debias plus Arena correlation; WildBench 1024 examples with checklist judging.

**Focus**

- Randomize order and average both directions. A judge that flips with position is reporting position, not quality.
- Report LC win rate with raw win rate and average length. Longer answers win raw comparisons even when they are worse.
- Checklists and rubrics beat single scores for both human and model judges. WildBench uses them for that reason.
- One judge model is one instrument. Cross-check with a second judge plus a human or deterministic subset before claiming a win.

**Reproduce:** Run the position-swap study on one answer pair three times each way, compute the inconsistency rate, and state the LC win rate with the average lengths.

**Traps**

- Treating a single GPT-4 score as ground truth. Agreement with humans depends on task, prompt, version and format.
- Assuming length control fixes everything. It corrects length, not position, style, identity or verbosity effects.
- Skipping human review because the judge correlates with Arena. Correlation on past prompts does not certify your task.

**Practice**

- [Modern LLM Notebook 25-evaluation Exercise 2: LLM-as-Judge Bias Detection](https://github.com/walkinglabs/modern-llm-notebook/blob/main/notebooks-en/part3-inference/25-evaluation.ipynb) - Exercises: Exercise 2 with the same answer pair swapped across 3 repeats; the position bias rate is inconsistent scores over total

**Stop when:** Your swap study reports an inconsistency rate, and every win rate you quote comes with LC, lengths and a human-checked subset.

<details>
<summary>Self-test</summary>

1. The judge picks answer A when it is first, then answer B after a swap. What is that, and what fixes it?
   - Position bias. Randomize the order, average both directions, and report the inconsistency rate before trusting the verdict.
2. Model X has higher raw win rate but lower LC win rate than baseline, with much longer outputs. Which rate should you trust?
   - The LC rate. Raw win rate is inflated by length, so check average length and inspect a subset by hand.
3. How does Chatbot Arena turn pairwise votes into ELO scores?
   - p(A beats B) = 1/(1 + 10^((ELO_B - ELO_A)/400)). Fit ELO scores to maximize the likelihood of the observed pairwise wins.
4. When is human adjudication required?
   - When correctness matters rather than style, when judge disagreement is high, or when the risk is high. Size the subset by risk and budget, judge with a checklist, and keep every raw judgment.

</details>

#### U4. Uncertainty, robustness and honest claims

**About 4 h** · **Target:** Implement + Measure

Topics: Slices, paired comparisons and bootstrap uncertainty; Prompt sensitivity, robustness and sampling-compute budgets; Capability versus safety evaluation boundaries

A single mean hides where a model fails and how fragile the number is. Slices plus uncertainty plus sensitivity turn a leaderboard entry into a claim you can defend.

**You can now**

- Build slices, paired comparisons and bootstrap intervals for a small evaluation, and read overlapping intervals correctly.
- Measure prompt, order and sampling sensitivity under fixed compute budgets and report the range, not just the best run.
- Separate capability results from safety results with distinct gates and stop conditions.

**Study**

1. [Modern LLM Notebook 25-evaluation: aggregation and composite scores](https://github.com/walkinglabs/modern-llm-notebook/blob/main/notebooks-en/part3-inference/25-evaluation.ipynb) (Modern LLM Notebook - evaluation and FLOP accounting) - Section 5 comparison table with analysis points (same-scale compare, business-relevant metrics, trends over single numbers, labeled source and config) and Section 5.2 (arithmetic, normalized, weighted, geometric and rank-sum methods with geometric penalizing weak spots).
2. [Modern LLM Notebook 25-evaluation: robustness and pitfalls](https://github.com/walkinglabs/modern-llm-notebook/blob/main/notebooks-en/part3-inference/25-evaluation.ipynb) (Modern LLM Notebook - evaluation and FLOP accounting) - Section 8.2 (CR@K, prompt, order and sampling robustness) and Sections 10.1 to 10.3 (prompt sensitivity 5 to 15 percent with OLMES prompts, few-shot counts, HumanEval 164 variance, seed, temperature, mean plus minus std, per-subject slices, length bias, best-score reporting).
3. [lm-eval-harness: bootstrap uncertainty in metrics.py](https://github.com/EleutherAI/lm-evaluation-harness/blob/main/lm_eval/api/metrics.py) (Language Model Evaluation Harness) - bootstrap_stderr with resampling and iters, stderr_for_metric with the bootstrappable list (median, matthews, f1, perplexity, bleu, chrf, ter, nanmean) and closed-form mean and acc_all, plus pooled_sample_stderr for groups.
4. [CS336 Lecture 12: safety benchmarks and realism](https://github.com/stanford-cs336/lectures/blob/main/lecture_12.py) (Stanford CS336 - resource accounting, inference and evaluation) - Function safety_benchmarks() with HarmBench 510 behaviors, AIR-Bench 314 categories and 5694 prompts, GCG transfer, contextual safety and dual-use CyBench; plus realism() with GDPVal, MedHELM 121 tasks from 29 clinicians, and Clio.

**Focus**

- Slice first, then aggregate. Report per-slice means before any composite, and say which slice drives the headline.
- Compare paired deltas on the same prompts, not two independent means. Pairing cancels prompt difficulty, which two independent intervals would both include.
- Bootstrap resamples with replacement and reports the std of the stat. Use the closed-form SE for plain means and bootstrap for medians, F1, perplexity and similar.
- Fix the sampling and prompt budget before comparing. Temperature, seed, few-shot and prompt version are part of the result.

**Reproduce:** From the Exercise 3 scores, compute arithmetic means (A 74.0, B 73.8) and geometric means (A 73.7, B 73.7), then state which model is more balanced and why the headline mean misleads.

**Traps**

- Reading overlapping intervals as proof of no difference without a paired test. Pair the prompts first, then test the delta.
- Reporting the best prompt or seed. Prompt swings of 5 to 15 percent dwarf small model gaps.
- Claiming safety from a capability average. A model at 90 math and 10 safety averages 50 and is still unsafe, so gate safety separately.

**Practice**

- The section mini-project covers this: 20-example two-slice evaluator with raw outputs, paired deltas and bootstrap intervals, plus one deliberate prompt or sampling failure.

**Stop when:** Your two-slice report shows per-slice means, a paired delta with an interval, and a sensitivity range for one prompt or sampling change.

<details>
<summary>Self-test</summary>

1. Exercise 3 scores Model A at 82, 71, 65, 78 and Model B at 78, 75, 70, 72. What do the two means say?
   - Arithmetic: A 74.0, B 73.8, so A leads by 0.25. Geometric: both about 73.7, so the gap vanishes. B is more balanced (range 8 versus 17) because the geometric mean punishes the weak 65 that the headline average hides.
2. When should you use bootstrap_stderr instead of a closed-form SE?
   - Plain means and acc_all have closed forms (mean_stderr, acc_all_stderr). Medians, F1, perplexity, BLEU and similar use bootstrap_stderr with resampling, and groups combine with pooled_sample_stderr.
3. Why compare paired deltas rather than two independent means?
   - Both models see the same prompts, so prompt difficulty cancels and the delta isolates the model effect. Independent means mix model differences with prompt sampling noise.
4. How should capability and safety results be gated?
   - Gate them separately with distinct primary tasks, regressions, slices, safety checks and stop conditions. Dual-use tasks such as CyBench count as both, so state which claim each result supports.

</details>

#### U5. Contamination and memorization

**About 3 h** · **Target:** Implement

Topics: Exact and approximate contamination checks; Memorization, duplicates and unsupported capability claims

Training on the Internet means the test set may already be in the weights. Without overlap checks, a benchmark measures recall, not generalization.

**You can now**

- Implement exact and approximate contamination checks between train and evaluation texts and produce a clean subset.
- Explain memorization, duplicate inflation and why a contaminated score cannot support a capability claim.
- State the contamination boundary in the release gate with fresh or private evals where needed.

**Study**

1. [CS336 Lecture 12: validity and train-test overlap](https://github.com/stanford-cs336/lectures/blob/main/lecture_12.py) (Stanford CS336 - resource accounting, inference and evaluation) - Function validity() with train-test overlap routes (exchangeability paper 2310.17623, reporting norms 2410.08385 with confidence intervals, fresh evals LiveCodeBench and UncheatableEval with unsafe timestamps, private evals with perplexity as the easiest private check) plus dataset quality (SWE-Bench Verified, Platinum, agentic test gaps with Docent).
2. [Modern LLM Notebook 25-evaluation: contamination pitfalls](https://github.com/walkinglabs/modern-llm-notebook/blob/main/notebooks-en/part3-inference/25-evaluation.ipynb) (Modern LLM Notebook - evaluation and FLOP accounting) - Section 10.1 (contamination as critical with exact, n-gram and embedding matching, check_integrity limits, stale HumanEval toward HumanEval+ and LiveCodeBench, small-data variance).
3. [lm-eval-harness: decontamination guide](https://github.com/EleutherAI/lm-evaluation-harness/blob/main/docs/decontamination.md) (Language Model Evaluation Harness) - 13-gram overlap rule from Few-Shot Learners Appendix C with N 8 to 13, decontaminate.py n-gram dicts plus training scan, clean benchmark with decontaminate suffix, disabled by default.
4. [lm-eval-harness: task decontamination fields](https://github.com/EleutherAI/lm-evaluation-harness/blob/main/docs/task_guide.md) (Language Model Evaluation Harness) - should_decontaminate and doc_to_decontamination_query fields for enabling task decontamination.

**Focus**

- Run both exact and approximate (n-gram or embedding) checks. Exact catches copies, n-grams catch near copies.
- check_integrity checks task and data plumbing, not training overlap. Do not cite it as decontamination.
- Duplicates and memorized benchmarks inflate scores without new capability. Prefer fresh or private evals for the headline claim.
- Report full versus clean side by side. A large drop is evidence of leakage, not a worse model.

**Reproduce:** Write the 13-gram overlap scan from decontamination.md: build eval n-grams, scan training n-grams, mark contaminated docs, and report the metric with a decontaminate suffix on the clean subset.

**Traps**

- Equating deduplication with decontamination. Dedup cleans training, while decontamination checks train versus eval overlap.
- Trusting timestamps for freshness. Copied text carries old dates into new pages, so scraped evals still need overlap checks.
- Claiming reasoning from a memorized benchmark. Unique tasks or fresh problems test generalization, while leaked sets test recall.

**Practice**

- The section mini-project covers this: exact and approximate contamination checks between the tiny train corpus and the eval set, with full versus clean reporting.

**Stop when:** Your report shows full versus clean scores from an explicit n-gram check, and every capability claim names the evals excluded as contaminated.

<details>
<summary>Self-test</summary>

1. Which n does the harness use for decontamination, and what marks a doc as contaminated?
   - 13. OpenAI used 8 to 13 by dataset, and the harness fixes 13 for simplicity. A doc is contaminated if any 13-gram overlaps a training doc.
2. What does check_integrity do, and what does it not do?
   - It checks task and data integrity such as config and loading, not train-eval overlap. It cannot replace decontamination.
3. HumanEval is stale and widely memorized. What should you do?
   - Move to HumanEval+ or LiveCodeBench, run overlap checks, and cross-validate with more sets, because 164 items carry high variance on their own.
4. Full-set accuracy is 85 percent but clean-subset accuracy is 71 percent. What should you claim?
   - Report both, headline the clean number, and present the drop as leakage evidence. Never claim broad capability from the full score alone.

</details>

#### U6. Counting parameters and FLOPs

**About 4 h** · **Target:** Derive

Topics: Embedding, attention, feed-forward and output parameter counts; Forward, backward and training FLOP approximations; Sequence length, vocabulary and batch scaling terms; Bounded IsoFLOPs curve-fitting exercise

Every cost claim in later sections multiplies these counts. A wrong parameter or FLOP formula silently moves every budget, schedule and scaling conclusion.

**You can now**

- Derive embedding, attention, feed-forward and output parameter counts for MHA, MQA and GQA, with tied versus untied heads.
- Derive forward, backward and training FLOPs from shapes, and state sequence, vocabulary and batch scaling terms.
- Fit a bounded IsoFLOPs curve from offline points and predict the compute-optimal size without running the training API.

**Study**

1. [Modern LLM Notebook Appendix B Section 1: parameter counting](https://github.com/walkinglabs/modern-llm-notebook/blob/main/notebooks-en/appendix-advanced/B-flops-memory-accounting.ipynb) (Modern LLM Notebook - evaluation and FLOP accounting) - Section 1 (D, L, V, H, K, d_h, F, B, S, P symbols, GQA Q, K, V, O shapes, SwiGLU 3DF with 8D/3 rationale, per-layer 12D2, global 2VD plus 12LD2, tied versus untied, SmolLM2-135M validation with sum(p.numel())).
2. [Modern LLM Notebook Appendix B Sections 3 and 4: FLOPs and training rule](https://github.com/walkinglabs/modern-llm-notebook/blob/main/notebooks-en/appendix-advanced/B-flops-memory-accounting.ipynb) (Modern LLM Notebook - evaluation and FLOP accounting) - Section 3 (matmul 2mkn, attention 8BSD2 plus 4BS2D, FFN 6BSDF as 16BSD2, global 2BSD(12LD plus 2LS plus V) with unembedding) and Section 4 (backward 2 times forward, 6PD rule with SmolLM2 135M on 2T and 7B on 1.5T wall-clock).
3. [CS336 Lecture 2: napkin math, FLOPs and gradients](https://github.com/stanford-cs336/lectures/blob/main/lecture_02.py) (Stanford CS336 - resource accounting, inference and evaluation) - motivating_questions() with 6 times 70e9 times 15e12 at MFU 0.5 and the 80e9 times 8 over 12 bound, tensor_operations_flops() with 2 times B times D times K and MFU, gradients_flops() with forward 2NP, backward 4NP and total 6NP.
4. [Raschka FLOPS analysis: thop benchmarks and MFU](https://github.com/rasbt/LLMs-from-scratch/blob/main/ch04/02_performance-analysis/flops-analysis.ipynb) (LLMs from Scratch companion - GPT FLOP analysis) - Fixed-batch forward with thop profile and MACS times 2 on gpt-small to gpt-xl (vocab 50257, context 1024), plus the MFU section with observed over theoretical tokens per second and forward plus backward as 3 times forward.
5. [CS336 Assignment 3: IsoFLOPs method and offline curves](https://github.com/stanford-cs336/assignment3-scaling/blob/main/cs336_assignment3_scaling.pdf) (Stanford CS336 Assignment 3 - IsoFLOPs scaling) - Section 2.1 Scaling Laws from IsoFLOPs profiles with C about 6ND, quadratic loss versus size per budget, optima per profile then power laws N_opt and D_opt; Problem chinchilla_isoflops with data/isoflops_curves.json fields parameters, compute_budget and final_loss, fitted offline without the training API.

**Focus**

- Count each projection separately under GQA: Q stays D by H times d_h, while K and V shrink to D by K times d_h. MHA 4D2 is the special case K equals H.
- One matmul [m,k] by [k,n] costs 2mkn. Sum Q, K, V, QK^T, AV and O plus gate, up and down plus unembedding 2BSDV, and do not drop the V term at large V.
- Backward costs about twice forward, so training is about 6 times params times tokens for short contexts. Long S adds the 2LS term.
- IsoFLOPs fixes C and varies N, finds the loss minimum per budget, then fits N_opt and D_opt power laws. Fit the offline points, and do not burn the hosted budget.

**Reproduce:** Derive the LLaMA-2 70B count from D8192 L80 V32000 as 2VD plus 12LD2 equals 64.9B, then the 70B 15T training total 6.3e24 FLOPs and the 144-day estimate on 1024 H100s at MFU 0.5.

**Traps**

- Counting MACs as FLOPs. One multiply-accumulate is two FLOPs, so double the thop MACS number.
- Comparing runs by steps at different batch sizes. Convert to tokens first: batch times steps times length.
- Fitting IsoFLOPs on the hosted API when the exercise gives offline curves. The bounded task uses isoflops_curves.json only.

**Practice**

- [Modern LLM Notebook Appendix B Exercise 1: LLaMA-2 70B parameters and FP16 memory](https://github.com/walkinglabs/modern-llm-notebook/blob/main/notebooks-en/appendix-advanced/B-flops-memory-accounting.ipynb) - Exercise 1 with D8192 L80 H64 K8 V32000; compute P as 2VD plus 12LD2 and FP16 bytes as 2P; the cells assert within 1 percent
- [CS336 Assignment 3: chinchilla_isoflops (bounded, offline)](https://github.com/stanford-cs336/assignment3-scaling/blob/main/data/isoflops_curves.json) - Problem (chinchilla_isoflops) in Section 2.1; fit power laws from data/isoflops_curves.json offline (fields parameters, compute_budget, final_loss) without the training API

**Stop when:** You derive the 64.9B estimate and the 6.3e24 total from shapes alone, and your IsoFLOPs script predicts optimal sizes from the offline JSON.

<details>
<summary>Self-test</summary>

1. What is the largest AdamW model on 8 H100s at 12 bytes per param?
   - 80e9 times 8 divided by 12 is 53.3B. It is an upper bound because activations are not counted.
2. What does 2VD plus 12LD2 give for LLaMA-2 70B?
   - 2 x 32000 x 8192 + 12 x 80 x 8192^2 = 0.52B + 64.42B, about 64.9B. The real model has about 69B: GQA shrinks K and V, but its SwiGLU width of 28672 is well above 8D/3, which more than makes up for it. The 12LD^2 shortcut assumes MHA and a 4D-equivalent FFN.
3. Why is the training rule 6NP?
   - Forward is 2NP and backward is 4NP (one matmul for dW plus one for dX per op), so training is 6NP. Raschka measures forward with thop then triples it for forward plus backward.
4. What are the IsoFLOPs fitting steps?
   - Group runs by C, take the min-loss N per budget (or a quadratic fit), fit N_opt and D_opt power laws in C, then extrapolate to the target budget such as 1e23 or 1e24 in exercise units.

</details>

#### U7. Memory, arithmetic intensity and reconciling estimates

**About 4 h** · **Target:** Derive + Measure

Topics: Gradient, optimizer, activation and temporary memory; Arithmetic intensity vocabulary and hardware-independent limits; Allocator, graph, kernel and framework overhead reconciliation; Quality-compute comparisons and uncertainty ranges

Analytical math sets the budget, but allocators, graphs and kernels decide what fits. Reconciliation is what makes the next capacity plan trustworthy.

**You can now**

- Derive gradient, optimizer, activation and KV memory for a stated precision and config, including checkpointing savings.
- Explain arithmetic and accelerator intensity and predict memory-bound versus compute-bound regimes for prefill and decode.
- Reconcile an analytical estimate with measured memory and state quality-compute comparisons as ranges, not points.

**Study**

1. [Modern LLM Notebook Appendix B: activations, inference, training and checkpointing](https://github.com/walkinglabs/modern-llm-notebook/blob/main/notebooks-en/appendix-advanced/B-flops-memory-accounting.ipynb) (Modern LLM Notebook - evaluation and FLOP accounting) - Section 2 (attention 6BSD plus BHS2, FFN 2BSD plus 2BSF to 8BSD, per-layer 14BSD plus BNS2 with the S4096 dominant-term check), Section 5 (FP16 weights 2P, KV B times S times K times d_h times L times 2 times bytes with 7B scenarios and weights, KV and activations regimes), Section 6 (AdamW ledger with FP32 master, BF16 copy, m, v and grads plus BF16 activations and A100 fit) and Section 7 (checkpoint trade to O(sqrt L) with torch.utils.checkpoint API).
2. [CS336 Lecture 2: intensity, roofline and checkpointing](https://github.com/stanford-cs336/lectures/blob/main/lecture_02.py) (Stanford CS336 - resource accounting, inference and evaluation) - arithmetic_intensity_relu through arithmetic_intensity_matmul with H100 accelerator intensity and roofline_plots(), activation_checkpointing() with the O(sqrt L) rule, tensors_memory() with dtypes and the 2.3GB example, and optimizer() memory plus erees and adamcasson links.
3. [CS336 Lecture 10: inference intensity and throughput](https://github.com/stanford-cs336/lectures/blob/main/lecture_10.py) (Stanford CS336 - resource accounting, inference and evaluation) - review_of_arithmetic_intensity() with 2BDF over 2BD plus 2DF plus 2BF to intensity B and the H100 295 bound, arithmetic_intensity_of_inference() with MLP 6BTDF and attention 4BSTD to BT and ST/(S plus T) plus prefill S/2 and generation below 1, and throughput_and_latency() with Llama 2 13B at B1, B64 and B256 plus the TTFT note.
4. [LLM Foundations Checkpoint: debug and measure contract](https://github.com/saisandeshk/Roadmap-Final/blob/main/checkpoints/llm-foundations.md) (LLM Foundations Checkpoint - evaluation and arithmetic slice) - Debug and measure bullets: reconcile analytical parameters, FLOPs, state and KV with profiles and separate prefill and decode across batch and context regimes.

**Focus**

- State the precision for every term. Mixed bf16 params and grads with fp32 master and moments is 12 bytes without master and 16 to 18 with it, so measure to confirm which ledger your loop keeps.
- Compare arithmetic intensity to accelerator intensity (H100 about 295). Below it you are memory-bound no matter how good the kernels are.
- Prefill grows with B times T for MLP and S/2 for attention, while generation sits at B for MLP and below 1 for attention. Batching rescues MLP generation, not attention.
- Expect measured memory above the formula. Name allocator caching, fragmentation, graph, workspace and framework overhead before doubting the math.

**Reproduce:** Derive the 13B training total from Exercise 2 inputs (fixed 208GB plus BF16 activations 617GB equals 825GB, 11 A100 80GB units) and the H100 B above 295 compute-bound rule, then reconcile one measured number with named overheads.

**Traps**

- Quoting the formula as the fit result. torch.cuda.memory_allocated includes caching and fragmentation, so report both numbers and explain the gap.
- Assuming a bigger batch fixes generation attention. Its intensity stays below 1 because each sequence owns its KV, while batching only helps the MLP part.
- Comparing quality at unequal compute. Fix prompts, decoding, budgets and evaluator versions, then report quality with compute ranges.

**Practice**

- [Modern LLM Notebook Appendix B Exercise 2: 13B training memory](https://github.com/walkinglabs/modern-llm-notebook/blob/main/notebooks-en/appendix-advanced/B-flops-memory-accounting.ipynb) - Exercise 2 with D5120 L40 H40 B8 S4096 P13B; fixed 16P, activations L times (14BSD plus BHS2) times 2 bytes, total GB and A100 count; the cells assert fixed bytes, elements and count

**Stop when:** You predict memory-bound versus compute-bound for one prefill and one decode case before measuring, and your worksheet reconciles one analytical total with allocated memory.

<details>
<summary>Self-test</summary>

1. What is the Exercise 2 training total for the 13B config?
   - Fixed 16 times 13e9 is 208GB, activations are 617GB in BF16, total 825GB, so 11 A100 80GB units.
2. When is an XW matmul compute-bound on an H100?
   - Intensity B versus 295. Compute-bound iff B is above 295. B equals 1 gives 1, which is memory-bound, and that is the inference matvec regime.
3. How do prefill and generation intensities differ for MLP versus attention?
   - MLP intensity is B times T (prefill with large BT is compute-bound, generation with T equals 1 needs a large batch), while attention is ST/(S plus T) (prefill S/2 is good, generation below 1 is bad, and batching does not help).
4. Measured memory is 10 percent above the formula. Name the suspects and one isolation per suspect.
   - Allocator cache and fragmentation, saved graph tensors, kernel workspace, framework overhead and KV reserve. Isolate with allocated versus reserved readings, a batch and length sweep, and a checkpointing toggle.

</details>

### Mini-project: Evaluation and arithmetic dossier

**About 10 to 14 hours.** Evaluate the trained model honestly and account for its cost. The evaluation is versioned and rerunnable, every number carries uncertainty, one evaluator failure is exposed on purpose, and every parameter, FLOP and memory estimate is reconciled with a measurement.

1. Report validation likelihood and perplexity with the tokenizer and split named, and explain why the number does not compare across tokenizers.
2. Define one small task with at least 20 examples in each of two slices, a versioned prompt, parser and exact or structured metric. Run it on your model and store raw outputs next to the scores.
3. Report the metric per slice with bootstrap intervals, compare two checkpoints or decoding settings with a paired bootstrap, and report the range across two prompt versions.
4. Expose one evaluator failure on purpose, such as a parser that accepts a wrong format or a judge that prefers longer answers, and show the fix.
5. Run exact and n-gram contamination checks between the evaluation set and your training split, report full and clean scores side by side, and state what the checks cannot rule out.
6. Write a worksheet of parameters, forward FLOPs, activation memory and AdamW memory for your model, and reconcile each with a measurement: FlopCounterMode, tensor sizes or peak memory.
7. Connect the atlas lab adapters for section 4 and pass tests/test_s4_eval_arithmetic.py.

**Deliverables**

- An evaluation manifest: data version, prompt, parser, metric, seeds and decoding config.
- Raw outputs, slice scores with bootstrap intervals and the paired comparison.
- The evaluator-failure case with results before and after the fix.
- The arithmetic worksheet, with each estimate next to its measurement and the reason for any gap.

**Checks**

- harness: [Atlas lab, section 4: counts, memory and bootstrap intervals](https://github.com/saisandeshk/ai-atlas/tree/main/labs/llm-foundations). Run `uv run pytest tests/test_s4_eval_arithmetic.py`. Run in labs/llm-foundations of an ai-atlas clone after you connect adapters.py to your package. It checks parameter and matmul-FLOP counts against exact counts of a reference module, AdamW memory, bootstrap determinism and coverage, and the paired bootstrap.
- rubric: Self-grade with the rubric below.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Versioning | Rerunning the manifest reproduces the scores. | A changed prompt, parser or tokenizer changes the manifest hash, and the report says which changed. |
| Uncertainty | Every headline number has a bootstrap interval. | The comparison uses a paired bootstrap, and the report states which claim the interval supports and which it does not. |
| Evaluator failure | One failure is shown with its fix. | You found the failure by reading raw outputs, and a regression test now covers it. |
| Contamination | The probe runs between evaluation and training data and its result is reported. | The report separates overlap from memorization and lists what the probe cannot detect. |
| Arithmetic | The section 4 lab tests pass and every estimate is within 10 percent of its measurement. | Every gap above 2 percent is explained, for example by elementwise ops, buffers or allocator overhead. |

Feeds into: Capstone artifact 3, the evaluation and arithmetic half of the dossier. Section 5 extends the memory worksheet with the KV cache.

### Resource route

- **Primary - Course:** [Stanford CS336 - resource accounting, inference and evaluation](https://cs336.stanford.edu/) - Use Spring 2026 Lectures 2, 10 and 12 for FLOPs, memory, arithmetic intensity, inference and evaluation. Reproduce the small calculations locally. Assignment 3 IsoFLOPs analysis is optional; do not require its hosted training API or costly experiments.
- **Required - Implementation:** [LLMs from Scratch companion - GPT FLOP analysis](https://github.com/rasbt/LLMs-from-scratch/blob/main/ch04/02_performance-analysis/flops-analysis.ipynb) - Use ch04/02_performance-analysis/flops-analysis.ipynb as a concrete calculator, then rebuild the formulas from the model configuration and reconcile parameters and at least one memory or operation estimate with runtime state.
- **Required - Implementation:** [Modern LLM Notebook - evaluation and FLOP accounting](https://walkinglabs.github.io/modern-llm-notebook/?lang=en) - Use English notebook 25-evaluation and Appendix B FLOP and memory accounting. Build a 20-example evaluator with two slices, raw outputs and bootstrap intervals, and deliberately create one parser, prompt or judge failure.
- **Support - Assessment:** [LLM Foundations Checkpoint - evaluation and arithmetic slice](https://github.com/saisandeshk/Roadmap-Final/blob/main/checkpoints/llm-foundations.md) - Use the contamination, evaluator-bias, parameter, FLOP, activation, state and KV requirements as the assessment contract. Keep raw outputs and distinguish a verified task result from a broad model capability claim.
- **Optional - Reference:** [Language Model Evaluation Harness](https://github.com/EleutherAI/lm-evaluation-harness) - After the small evaluator passes, inspect task versioning, request construction and result schemas to understand production evaluation plumbing. Do not use the harness as a substitute for owning the task and metric contract.
- **Optional - Practice:** [Stanford CS336 Assignment 3 - IsoFLOPs scaling](https://github.com/stanford-cs336/assignment3-scaling/blob/main/cs336_assignment3_scaling.pdf) - Use Section 2.1 and Problem chinchilla_isoflops with data/isoflops_curves.json for the bounded curve-fitting exercise only. Do not use the hosted training API or costly experiments.

### Exit checkpoint

Produce a versioned evaluation with likelihood, one exact or structured metric, two slices, raw outputs, bootstrap uncertainty and contamination checks. Expose one evaluator failure and reconcile parameter, FLOP, activation and optimizer-memory estimates with the tiny model.

<details>
<summary>Deliberately left for later</summary>

- Leaderboard claims and broad capability conclusions
- Large scaling-law sweeps and hosted-compute experiments
- Full safety, alignment and model-judge research

</details>

## 05. KV Cache, Prefill & Decode

**Why:** Autoregressive generation has two distinct execution regimes and a stateful cache. This final section proves cache correctness first, then explains capacity and latency without importing an entire serving stack.

### Learn this much

- [ ] Autoregressive dependency and naive prefix recomputation _(Required)_
- [ ] Cached keys and values versus token-specific queries _(Required)_
- [ ] Per-layer KV ownership and sequence identity _(Required)_
- [ ] KV tensor shapes, layout, capacity and append state _(Required)_
- [ ] Position offsets and RoPE consistency under cached decode _(Required)_
- [ ] MHA, MQA and GQA KV head mapping _(Required)_
- [ ] KV bytes per token, sequence, layer and batch _(Required)_
- [ ] Full-prefix versus cached-logit equivalence _(Required)_
- [ ] Variable-length batches and padding state _(Required)_
- [ ] Finished-sequence compaction and EOS handling _(Required)_
- [ ] Cancellation cleanup, truncation, forks and stale-cache hazards _(Required)_
- [ ] Prefill parallelism and prompt-length scaling _(Required)_
- [ ] Decode serialization and per-token work _(Required)_
- [ ] Compute, memory-bandwidth, launch and capacity limits _(Required)_
- [ ] Time to first token and prefill latency _(Required)_
- [ ] Inter-token latency and decode throughput _(Required)_
- [ ] Batch, context and generated-length regime changes _(Required)_
- [ ] Warmup, synchronization and phase-specific timing _(Required)_
- [ ] Cache dtype and quantized-cache vocabulary _(Required)_
- [ ] Prefix sharing and paged-cache vocabulary _(Required)_
- [ ] Speculative decoding promise and exactness contract _(Required)_
- [ ] One small prefix-sharing state diagram _(Optional)_
- [ ] Cache-capacity sensitivity across dtypes _(Optional)_
- [ ] Paged attention and continuous batching implementation _(Later)_
- [ ] Quantized KV kernels and speculative decoding implementation _(Later)_
- [ ] Production scheduling, disaggregation and serving fleets _(Later)_

### Study units

#### U1. Why cache: recomputation in autoregressive decoding

**About 2 h** · **Target:** Explain + Derive

Topics: Autoregressive dependency and naive prefix recomputation; Cached keys and values versus token-specific queries

Serial generation reprocesses its own prefix at every step, so cost grows faster than length. The cache is the one idea that removes that repeated work, and every later unit builds on it.

**You can now**

- Explain why cached keys and values remove repeated projection and attention work while queries stay token-specific.
- Derive naive versus cached attention work across generated tokens and name the terms that remain.
- Compute the repeated-prefix share for a generation length from the triangular sum.

**Study**

1. [Modern LLM Notebook 21: why generation is slow](https://github.com/walkinglabs/modern-llm-notebook/blob/main/notebooks-en/part3-inference/21-inference-acceleration.ipynb) (Modern LLM Notebook - KV cache and inference acceleration) - Section 1 (naive_generation_cost table for 10 to 2000 tokens with 99.8 percent repeated work at 1000 tokens, plus the O(N squared) versus O(N) plot).
2. [Raschka ch04/03_kv-cache README: how it works](https://github.com/rasbt/LLMs-from-scratch/blob/main/ch04/03_kv-cache/README.md) (LLMs from Scratch companion - KV cache and GQA) - How it works (Time flies then Time flies fast figures with identical keys and values for the first two tokens) and KV cache advantages and disadvantages (per-step work O(n squared) versus O(n), memory grows linearly).
3. [Modern LLM Notebook 21 Section 2: KV cache saves K and V only](https://github.com/walkinglabs/modern-llm-notebook/blob/main/notebooks-en/part3-inference/21-inference-acceleration.ipynb) (Modern LLM Notebook - KV cache and inference acceleration) - Section 2 through the AttentionWithKVCache class and the 5-token equivalence check (max diff 2e, cache shapes [1,4,1,8] growing to [1,4,5,8]).

**Focus**

- Each new token depends on all past tokens, so naive generation reruns the full prefix. The triangular sum 1 to n is the proxy for that repeated work.
- Past tokens never change, so their K and V projections stay valid. The new token still needs a fresh Q to score against cached K.
- The cache removes K and V recomputation and past hidden-state work. It does not remove the new Q projection or the read of cached K and V.
- Cached and uncached runs compute the same function. Identical outputs are the correctness check, not a coincidence.

**Reproduce:** Derive the triangular naive cost n(n+1)/2 for n tokens, the cached per-step new-token cost, and the 99.8 percent repeated-work share at n equal to 1000.

**Traps**

- Thinking the cache skips attention. It skips recomputing past K and V, but each step still reads the full cache to score the new query.
- Caching the query. Queries are token-specific, so caching them across steps is wrong; only K and V persist.
- Reading speedup from multiply counts as GPU time. Counts prove the scaling change; wall time needs warmup and synchronization, which belong to the measurement unit.

**Practice**

- [No Magic microkv.py: no-cache versus cached multiply comparison](https://github.com/no-magic-ai/no-magic/blob/main/03-systems/microkv.py) - generate_no_cache versus generate_with_cache with GEN_LEN 16, the assert that both token lists match, the per-step multiply table and the linear memory-growth table. CPU multiply counts only. Do not present wall time as GPU or serving evidence.

**Stop when:** You derive the triangular share by hand and your microkv.py run shows identical tokens with per-step multiplies falling from growing to flat.

<details>
<summary>Self-test</summary>

1. Why are K and V reusable across steps but Q is not?
   - Past tokens never change, so their K and V projections stay valid. The new token needs a fresh Q to score against the cached K, so Q work remains each step.
2. Under the triangular proxy, what share of work is repeated prefix processing when generating 1000 tokens?
   - 99.8 percent. Total proxy cost is 500500, new-token work is 1000, so 499500 of 500500 is avoidable recomputation.
3. microkv.py asserts the cached and uncached token lists are identical. Does the cache change the sampling distribution?
   - No. It memoizes the same math, so greedy tokens must match exactly. Logits can differ in the last bits because the cached path multiplies differently shaped tensors, so compare them with a small tolerance; a larger mismatch is a bug in positions, masking or stale state.
4. In the Modern 21 demo with d_model 32 and 4 heads, what is the K cache shape at step 5 and what does each dim mean?
   - [1,4,5,8]: batch 1, 4 heads, 5 cached tokens, head dim 8. Step i holds i tokens and each step computes K and V for 1 new token only.

</details>

#### U2. Building a KV cache

**About 5 h** · **Target:** Implement

Topics: Per-layer KV ownership and sequence identity; KV tensor shapes, layout, capacity and append state; Position offsets and RoPE consistency under cached decode; MHA, MQA and GQA KV head mapping

A cache that shares layers, mixes sequences or misplaces positions returns fluent garbage with matching shapes. Ownership, layout and offsets are what make it correct.

**You can now**

- Implement per-layer KV allocation, append and single-token cached decode with absolute position offsets for the tiny transformer.
- Explain MHA, MQA and GQA head mappings and the repeat_interleave rule for shared KV heads.
- Explain KV tensor shapes and why each layer owns its cache for its own sequence.

**Study**

1. [Raschka gpt_with_kv_cache.py: per-layer cache with positions](https://github.com/rasbt/LLMs-from-scratch/blob/main/ch04/03_kv-cache/gpt_with_kv_cache.py) (LLMs from Scratch companion - KV cache and GQA) - MultiHeadAttention (cache_k and cache_v buffers, use_cache append by torch.cat on dim 1, ptr_current_pos mask slice, reset_cache), GPTModel (current_pos with pos_ids arange, ModuleList loop, reset_kv_cache) and generate_text_simple_cached (full-prompt prefill then single-token loop).
2. [Raschka ch04/04_gqa: GQA head mapping and memory](https://github.com/rasbt/LLMs-from-scratch/blob/main/ch04/04_gqa/gpt_with_kv_gqa.py) (LLMs from Scratch companion - KV cache and GQA) - GroupedQueryAttention (num_kv_groups with group_size, K and V cache on dim 2, repeat_interleave mapping with the repeat versus repeat_interleave comment, q_positions versus k_positions mask) plus the README bytes formula with n_kv_heads and the 4096/32/32/32768 example.
3. [Modern LLM Notebook 21 Sections 2 and 4: shapes and head sharing](https://github.com/walkinglabs/modern-llm-notebook/blob/main/notebooks-en/part3-inference/21-inference-acceleration.ipynb) (Modern LLM Notebook - KV cache and inference acceleration) - Section 2 shape evolution ([batch, num_heads, cached_seq_len, d_k] from [1,4,1,8] to [1,4,5,8]) and Section 4 MHA/MQA/GQA (32 Q heads with 32, 8 and 1 KV heads at 8K, the 8 Q with 2 KV repeat_interleave demo, savings ratio 32/8 = 4x). Depth: Skip Sections 5 to 8 and 10 (quantization, GGUF, PagedAttention, FlashAttention, batching) until their own units.

**Focus**

- Each layer owns its K and V tensors and each batch row owns its positions. Sharing a cache across layers or sequences mixes unrelated spaces.
- Append grows the sequence dim by the new chunk only. Prefill appends the whole prompt at once, decode appends one token per step.
- Positions are absolute. pos_ids and the mask pointer advance by the chunk length, so decode step k uses position current_pos plus k.
- GQA stores fewer KV heads and expands them with repeat_interleave. With 8 Q heads and 2 KV heads, heads 0 to 3 share KV head 0.

**Reproduce:** Write the cache-owning attention forward from scratch: buffers, append, pointer-based mask slice, absolute pos_ids, reset, and the GQA repeat_interleave mapping for 8 Q heads with 2 KV heads.

**Traps**

- Forgetting reset_kv_cache between independent generations. Stale K, V and pointers leak the old sequence into the new one.
- Using repeat instead of repeat_interleave for grouped heads. Tiling maps the wrong KV head to each query group while shapes still match.
- Restarting positions at 0 on every decode step. Absolute embeddings repeat and RoPE rotations reuse early angles, so logits diverge from the full prefix.

**Practice**

- [Raschka ch04/03_kv-cache tests: cached equivalence](https://github.com/rasbt/LLMs-from-scratch/blob/main/ch04/03_kv-cache/tests.py) - test_gpt_model_equivalence_cached and test_gpt_model_equivalence_not_cached (30 new tokens from Hello, I am across base, cached and optimized models with torch.equal). Run against the reference files, then re-run against your own per-layer cache in your own repository.

**Stop when:** Your own cache passes both equivalence tests with torch.equal and you can state the cache shape after each step.

<details>
<summary>Self-test</summary>

1. After a 4-token prefill, the first decode step feeds 1 token. What are the Q and K lengths and which mask row applies?
   - Q has 1 token and K has 5 (4 cached plus 1 new). The pointer is 4, so the slice is row 4 over 5 columns, which lets the new query attend to all 5 positions.
2. With 32 Q heads and 8 KV heads, which Q heads share KV head 0, and why repeat_interleave?
   - Q heads 0 to 3 share KV head 0 in contiguous groups of 4. repeat_interleave gives [K1,K1,K2,K2], while repeat would tile as [K1,K2,K1,K2] and map the wrong heads.
3. Why must decode pos_ids use current_pos, and what breaks for RoPE if they restart at 0?
   - Positions are absolute. Restarting at 0 reuses early embeddings and early RoPE angles for late tokens, so relative distances are wrong and logits diverge from the full prefix.
4. Two layers share one cache object to save memory. What fails?
   - Each layer has its own projections, so its K and V live in different spaces. Sharing mixes them and equivalence fails; each layer needs its own cache just as each sequence needs its own rows.

</details>

#### U3. Proving the cache correct

**About 4 h** · **Target:** Implement

Topics: Full-prefix versus cached-logit equivalence; Variable-length batches and padding state; Finished-sequence compaction and EOS handling; Cancellation cleanup, truncation, forks and stale-cache hazards

A cache that is fast but subtly wrong poisons every measurement after it. Equivalence across shapes, offsets and messy batches is what lets you trust the rest of the section.

**You can now**

- Write equivalence tests comparing full-sequence logits with token-by-token cached logits across MHA and GQA, batch sizes and position offsets.
- Handle variable lengths with padding masks, EOS compaction and cache cleanup without breaking equivalence.
- Diagnose truncation, fork and stale-cache failures from a failing equivalence test.

**Study**

1. [Raschka tests.py and optimized cache: equivalence, chunking and overflow](https://github.com/rasbt/LLMs-from-scratch/blob/main/ch04/03_kv-cache/tests.py) (LLMs from Scratch companion - KV cache and GQA) - test_gpt_model_equivalence_cached and not_cached (30 tokens with torch.equal), test_prefill_chunking_basic (kv_window_size 4 over 10 tokens in 3 chunks, 12 total with input preserved) and test_context_overflow_bug (context_length 10 with 5 plus 10 tokens hitting the position-embedding assert).
2. [CS336 Lecture 10: selective batching and paged sharing](https://cs336.stanford.edu/lectures/?trace=lecture_10) (Stanford CS336 - Lecture 10 Inference) - continuous_batching (ragged lengths [3,9,5] with attention per sequence and non-attention concatenated) and paged_attention (blocks, sharing the system prompt and parallel samples, copy-on-write at block level). Depth: Read the two functions only. Keep kernels, distributed serving and expensive performance experiments for the later tracks.
3. [JAX scaling book inference: ragged reads and the EOS loop](https://jax-ml.github.io/scaling-book/inference/) (How to Scale Your Model - inference chapter) - Tricks section (ragged HBM reads and Paged Attention that read only the non-padding part) and The Basics (Generation repeats until EOS or a maximum length).

**Focus**

- Generated tokens must match exactly at a fixed seed; logits must match within a small tolerance, such as 1e-5 in float32, because different matmul shapes round differently. Check both before trusting any timing.
- Variable lengths need per-row lengths and padding masks. Reading the padded tail as real tokens breaks both equivalence and the batch.
- Finished sequences need compaction: free or clear their rows, compact the batch, and stop them at EOS plus a length cap. Reused slots must be cleared first.
- Truncation, forks and reuse without reset are stale-cache hazards. Chunked prefill and windowed caches must preserve order and positions.

**Reproduce:** Write the equivalence harness: exact token match and per-step logits within tolerance for full-prefix versus token-by-token cached decoding, plus the chunked-prefill case (4-token window over 10 tokens) and the position-overflow assert case.

**Traps**

- Testing equivalence on one prompt length and head count. Offset, GQA grouping and batch bugs hide until adversarial shapes and longer contexts.
- Freeing a finished row without clearing it. The next request inherits old K and V and attends to another sequence, which looks like a model bug.
- Truncating the cache but keeping old position ids. Tokens shift left while positions stay high, so RoPE and absolute embeddings disagree with the full prefix.

**Practice**

- [Raschka ch04/03_kv-cache tests: chunking and overflow](https://github.com/rasbt/LLMs-from-scratch/blob/main/ch04/03_kv-cache/tests.py) - test_prefill_chunking_basic and test_context_overflow_bug (windowed chunking with input preservation, plus the position-embedding overflow assert). Then extend in your own repository to variable-length batches with padding masks, EOS compaction and a stale-cache reuse test. The mini-project checks the full matrix across MHA and GQA.

**Stop when:** Your harness shows identical tokens and per-step logits within tolerance on adversarial MHA and GQA shapes with offsets, and your chunking, overflow and slot-reuse tests all pass.

<details>
<summary>Self-test</summary>

1. Cached and full-prefix logits differ from position 0 onward. What class of bug is it?
   - A systematic one: wrong weights, a different prompt, a stale cache from a prior run, or a wrong mask or position base. Late-only divergence would point at windows or truncation instead.
2. With kv_window_size 4, a 10-token prompt prefills in 3 chunks and generates 2 tokens. What total length and input check must hold?
   - 12 total tokens. The first 10 must equal the input, as the chunking test asserts with shape 12 and input preservation.
3. Batch lengths are [3,9,5]. Why does CS336 run attention per sequence but concatenate to [17,H] for the MLP?
   - MLP weights are shared, so concatenated tokens batch well. Attention KV differs per sequence, so scores must stay per sequence; padding all to 9 wastes compute.
4. A finished sequence is freed without clearing and a new request reuses the slot. What hazard and what fix?
   - A stale-cache hazard: the new request attends to old K and V, possibly leaking another sequence. Clear or reset slots on finish, compact the batch, and test slot reuse against the full prefix.

</details>

#### U4. KV memory arithmetic

**About 2 h** · **Target:** Derive

Topics: KV bytes per token, sequence, layer and batch; Cache dtype and quantized-cache vocabulary; Cache-capacity sensitivity across dtypes

The cache can outweigh the weights at long context, so every serving decision starts with its size. One formula with head count and dtype predicts whether a workload fits before anything runs.

**You can now**

- Derive KV bytes per token, sequence, layer and batch from layers, KV heads, head dim, dtype and batch.
- Predict cache capacity across dtypes including INT8 and INT4 and state GB versus GiB units.
- Explain the quantized-cache trade-off: a smaller cache for a small quality risk.

**Study**

1. [Modern LLM Notebook 21 Section 3 and Exercise 1: KV sizes](https://github.com/walkinglabs/modern-llm-notebook/blob/main/notebooks-en/part3-inference/21-inference-acceleration.ipynb) (Modern LLM Notebook - KV cache and inference acceleration) - Section 3 (kv_cache_size as 2 x layers x heads x head_dim x seq_len x bytes, LLaMA-2 7B, 13B and 70B from 2K to 128K, FP16/INT8/INT4 plot) and Exercise 1 (32 layers, 32 heads, 128 dim, 4096 tokens FP16 with the 2048 MB assert).
2. [Raschka GQA estimator and README numbers](https://github.com/rasbt/LLMs-from-scratch/blob/main/ch04/04_gqa/memory_estimator_gqa.py) (LLMs from Scratch companion - KV cache and GQA) - calc_kv_bytes_total (per_layer as batch x context x head_dim x n_kv_heads x 2 x bytes, times layers; DTYPE_BYTES with fp32 4, bf16 and fp16 2, fp8 and int8 1) and the README example (4096 emb, 32 heads, 32 layers, 32768 context, 4 groups, bf16: MHA 17.18 GB versus GQA 4.29 GB at 4.00x and 75 percent).
3. [Modern LLM Notebook 11 Sections 1 and 2: back-of-envelope and head schemes](https://github.com/walkinglabs/modern-llm-notebook/blob/main/notebooks-en/part2-training/11-mla-kv-cache.ipynb) (Modern LLM Notebook - KV cache and inference acceleration) - Section 1 (Llama-7B 32K FP16 back-of-envelope with the cache above the 13 GB weights) and Section 2 (MHA, GQA-8, GQA-4 and MQA table at 32768 tokens with the kv_cache_elements function).

**Focus**

- Bytes equal batch x seq_len x layers x n_kv_heads x head_dim x 2 for K and V x bytes per element. Every term is load-bearing.
- MHA stores n_heads KV heads, MQA stores one, and GQA stores something in between, so the saving is n_heads / n_kv_heads. In the Raschka estimator, --n_kv_groups is the number of query heads per KV head: 32 heads with --n_kv_groups 4 store 8 KV heads.
- Dtype scales the total directly: FP16 2 bytes, INT8 1 byte, INT4 half a byte. Quantized cache is lossy while head sharing is structural.
- The estimator divides by 1000 cubed (GB) and the notebooks by 1024 cubed (GiB). Same bytes, different labels.

**Reproduce:** Derive per-token, per-layer and total KV bytes for Llama-7B at 32K FP16 in both GB and GiB, plus the 4-group GQA and INT8 savings, from the head formula.

**Traps**

- Forgetting one factor of 2. K and V each store a full vector, so dropping either 2 halves or doubles the answer.
- Counting query heads instead of KV heads under GQA. Only KV heads occupy cache; 32 Q heads with 8 KV heads store 8, not 32.
- Comparing GB and GiB numbers as if they disagree. 17179869184 bytes is both 17.18 GB and 16.0 GiB.

**Practice**

- [Modern LLM Notebook 21 Exercise 1: KV cache memory](https://github.com/walkinglabs/modern-llm-notebook/blob/main/notebooks-en/part3-inference/21-inference-acceleration.ipynb) - Exercise 1: compute kv_bytes for 32 layers, 32 heads, 128 dim and 4096 tokens FP16; the cell asserts 2048 MB. Solve by hand from the head formula first, then confirm with the cell.
- [Modern LLM Notebook 11 Exercise 1: KV footprint at 16K](https://github.com/walkinglabs/modern-llm-notebook/blob/main/notebooks-en/part2-training/11-mla-kv-cache.ipynb) - Exercise 1: fill elements_per_token_per_layer, total_elements and total_gb for 4096 hidden, 32 layers, 32 heads and 16384 tokens FP16; the cell asserts 8.00 GB. Report the answer in both GB and GiB and name which divisor each uses.

**Stop when:** You derive the 2048 MB and 8.00 GB answers by hand and both exercise asserts pass with units stated.

<details>
<summary>Self-test</summary>

1. With 32 heads and head dim 128 in FP16, what are the K plus V elements and bytes per token per layer?
   - 8192 elements (32 x 128 x 2) and 16384 bytes (x 2 bytes), which is 16 KiB.
2. Same model with 32 layers at 16384 tokens FP16. What is the total cache?
   - 4294967296 elements x 2 bytes = 8589934592 bytes, which is 8.0 GiB in 1024-cubed units.
3. The estimator says 17.18 GB and notebook math says 16.0 for Llama-7B at 32K. Which is right?
   - Both. The bytes are 17179869184 either way; the estimator divides by 1000 cubed (GB) and the notebook by 1024 cubed (GiB). State the units.
4. 32 heads at bf16 with the estimator's --n_kv_groups 4, which stores 8 KV heads, then an INT8 cache. What are the savings?
   - Head sharing gives 32/8 = 4x (MHA 17.18 GB to GQA 4.29 GB decimal, as run). INT8 halves it again to about 2.15 GB, for 8x versus FP16 MHA at a small quality risk.

</details>

#### U5. Two regimes: prefill and decode

**About 3 h** · **Target:** Explain + Derive

Topics: Prefill parallelism and prompt-length scaling; Decode serialization and per-token work; Compute, memory-bandwidth, launch and capacity limits

Latency and throughput numbers are meaningless without the regime behind them. Prefill scales with prompt length in parallel while decode pays per token in serial, so each needs its own bottleneck story.

**You can now**

- Explain prefill parallelism versus decode serialization and why one is compute-bound and the other bandwidth-bound.
- Derive MLP and attention intensities and predict the limiting regime for short prefill, long prefill, single decode and batched decode.
- Explain batch effects and phase interference between concurrent prefills and decodes.

**Study**

1. [CS336 Lecture 10: arithmetic intensity of inference](https://cs336.stanford.edu/lectures/?trace=lecture_10) (Stanford CS336 - Lecture 10 Inference) - arithmetic_intensity_of_inference (naive O(T cubed) without cache, MLP intensity B times T with prefill large-T versus generation T=1, attention intensity S times T over S plus T with prefill S/2 versus generation below 1, batching helps MLP but not attention).
2. [JAX scaling book inference: linear ops, attention and the step-time formula](https://jax-ml.github.io/scaling-book/inference/#theoretical-estimates-for-llm-latency-and-throughput) (How to Scale Your Model - inference chapter) - Linear operations (critical batch 240 on TPU v5e, about 280 on H100), What about attention (prefill T/2 compute-bound, generation about 1 and always bandwidth-bound) and Theoretical estimates (step time as batch x KV plus params over bandwidth, with the batch 4 versus 256 Pop Quiz). Depth: Read the three named subsections only. Skip sharding, the serving engine and worked problems; they belong to the later tracks.
3. [Modern LLM Notebook 21 Section 9: prefill versus decode](https://github.com/walkinglabs/modern-llm-notebook/blob/main/notebooks-en/part3-inference/21-inference-acceleration.ipynb) (Modern LLM Notebook - KV cache and inference acceleration) - Section 9 table (prefill parallel and compute-bound with FlashAttention versus decode serial and bandwidth-bound with KV cache plus PagedAttention) with the 50-token prefill versus 20-step decode timing cell.

**Focus**

- Prefill processes the whole prompt at once like training, so long prompts saturate compute. Decode handles one token per request, so it streams weights and KV from memory.
- MLP intensity is B times T: batching requests helps decode. Attention intensity is about 1 at decode because each sequence owns its KV, so batching cannot fix it.
- Short prefills and single-token decodes can be launch-bound: tiny kernels cost more to start than to run. Long contexts and big batches turn capacity-bound when the KV no longer fits.
- A prefill running beside decodes steals the compute the decodes share. That interference is why serving separates or interleaves the phases.

**Reproduce:** Derive MLP intensity B times T and attention intensity S times T over S plus T, then classify short prefill, long prefill, single decode and batched decode as launch, compute, memory or capacity limited.

**Traps**

- Expecting bigger batches to fix decode attention. Batching helps MLP reuse of weights, but per-sequence KV keeps attention bandwidth-bound.
- Calling decode compute-bound because FLOPs look small. Small FLOPs with large streaming reads is the definition of bandwidth-bound.
- Treating every small step as compute-bound. A 32-token prefill sits far below the roughly 240-token critical batch, so streaming the weights bounds it; for a tiny model, kernel-launch overhead can dominate even that.

**Practice**

- [JAX scaling book inference Pop Quiz: step-time bounds at batch 4 and 256](https://jax-ml.github.io/scaling-book/inference/#theoretical-estimates-for-llm-latency-and-throughput) - Pop Quiz under Theoretical estimates (30B dense, TPU v5e 4x4 slice, int8 params with bf16 FLOPs, 8192 context, 100 kB per token KV; batch 4 bounds 2.5 ms memory-bound, batch 256 bounds 21 ms compute-bound). Derive both bounds from the step-time formula by hand first, then check against the given answer.

**Stop when:** You derive both Pop Quiz bounds within rounding and classify all four regimes with the intensity formulas.

<details>
<summary>Self-test</summary>

1. MLP intensity is B times T. Compare B=8, T=1 decode with B=1, T=1024 prefill against a critical batch near 240.
   - 8 versus 1024. The decode step is memory-bound and the prefill is compute-bound in bf16.
2. Attention intensity is S times T over S plus T. Compare prefill with S=2048 to decode with S=2048 and T=1.
   - Prefill gives S/2 = 1024 (compute-bound) while decode gives about 1 (always bandwidth-bound). Batching does not raise the decode value because each sequence has its own KV.
3. The JAX Pop Quiz bounds a 30B step at 2.5 ms for batch 4 and 21 ms for batch 256. Why does latency rise while throughput improves?
   - Batch 4 is memory-bound (batch x KV plus params over bandwidth). Batch 256 pushes the MLP into the compute-bound term, so each step costs more but carries 64x the tokens.
4. A 32-token single-stream decode feels slow despite tiny FLOPs. Name two likely limiters besides FLOPs.
   - Kernel-launch overhead on tiny ops and memory bandwidth from streaming weights plus KV each step. Capacity is not the issue at this size.

</details>

#### U6. Measuring time to first token and inter-token latency

**About 4 h** · **Target:** Measure

Topics: Time to first token and prefill latency; Inter-token latency and decode throughput; Batch, context and generated-length regime changes; Warmup, synchronization and phase-specific timing

One blended tokens-per-second number hides whether the prompt or the generation is slow. Split timing shows which phase to fix and whether the fix worked.

**You can now**

- Measure TTFT with prefill latency and decode ITL with throughput separately, using warmup and explicit synchronization.
- Compare regimes across batch, context and generated length and name the bottleneck in each.
- Diagnose misleading latency from async timing, missing warmup, tokenization in the timed region, output mismatch or phase aggregation.

**Study**

1. [Modern LLM Notebook 21 Section 9: split prefill and decode timing](https://github.com/walkinglabs/modern-llm-notebook/blob/main/notebooks-en/part3-inference/21-inference-acceleration.ipynb) (Modern LLM Notebook - KV cache and inference acceleration) - Section 9 code cell (50-token prefill timed once for TTFT, then 20 single-token decodes timed separately with mean ITL and the per-step plot).
2. [Raschka gpt_with_kv_cache.py main(): synchronized timing pattern](https://github.com/rasbt/LLMs-from-scratch/blob/main/ch04/03_kv-cache/gpt_with_kv_cache.py) (LLMs from Scratch companion - KV cache and GQA) - main() (torch.cuda.synchronize before and after the run, time.time around 200-token generation from Hello, I am, tokens/sec plus max_memory_allocated). Depth: Read for the synchronization pattern only. main() times the whole run at once, so add your own warmup and phase split from the focus points.
3. [CS336 Lecture 10: metrics and batch trade-offs](https://cs336.stanford.edu/lectures/?trace=lecture_10) (Stanford CS336 - Lecture 10 Inference) - landscape (TTFT, latency in seconds per token and throughput in tokens per second, training parallel versus inference sequential) and throughput_and_latency (Llama 2 13B on H100 at batch 1, 64 and 256 with smaller batches favoring latency and larger favoring throughput, TTFT as a function of prefill).

**Focus**

- TTFT comes from the prefill call plus the first sample. ITL is the mean over steady decode steps. Never average the two phases together.
- Warm up first and discard the cold runs: allocation, compilation and caches make the first iteration much slower than the rest.
- CUDA launches are async, so synchronize around each timed region. Without it the clock measures launch speed, not work.
- Fix everything else before comparing: same prompt, batch, lengths and seeds, tokenization outside the clock, and identical outputs on both sides.

**Reproduce:** Write the phase-split benchmark: warmup, synchronized prefill timing for TTFT and per-token decode timing for ITL at two context and batch regimes with identical-output checks.

**Traps**

- Timing tokenization with the model. Encode and decode outside the clock or tokenizer speed masquerades as model speed.
- Claiming a speedup with different outputs. Different lengths or sampling paths do different work, so verify identical tokens first.
- Reporting one blended rate. A fast prefill can hide a slow decode and misdirect the next optimization.

**Practice**

- [Raschka ch04 KV-cache timing: uncached versus cached 200-token runs](https://github.com/rasbt/LLMs-from-scratch/blob/main/ch04/03_kv-cache/gpt_with_kv_cache.py) - main() in gpt_with_kv_cache.py versus gpt_ch04.py (Hello, I am prompt with 200 new tokens, synchronize-then-time, tokens/sec and max_memory_allocated; README table of 27 versus 144 versus 166 tokens/sec on M4 CPU). Your numbers will differ by hardware. The checks are identical outputs, then your own phase-split repeat with warmup. The mini-project does the full two-regime matrix.

**Stop when:** You report separate TTFT and ITL with warmup and synchronization at two regimes, with identical outputs on both sides.

<details>
<summary>Self-test</summary>

1. Where do TTFT and ITL come from in the Modern 21 Section 9 cell?
   - The cell times one 50-token prefill call (the TTFT proxy; a full TTFT adds the first sample) and takes ITL as the mean of the 20 one-token calls. Mixing them hides the regime difference.
2. CUDA timing without synchronization shows impossibly fast decodes. Why?
   - Kernel launches are async, so the clock measures launch instead of work. Synchronize before and after each region as the Raschka main() does.
3. The first timed run is 3x slower than repeats. What do you do?
   - Discard it as warmup (cold allocation, compilation and caches) and report the median or mean over repeats with fixed prompt, batch and lengths.
4. The cached run is faster but its tokens differ from the baseline. Is that a valid speedup?
   - No. Verify identical tokens or logits first at a fixed seed. Different outputs mean different work or a correctness bug, so fix that before claiming anything.

</details>

#### U7. Beyond one cache: prefix sharing, paging and speculation

**About 2 h** · **Target:** Explain

Topics: Prefix sharing and paged-cache vocabulary; Speculative decoding promise and exactness contract; One small prefix-sharing state diagram

Single-request caching stops at the serving door. Shared prefixes, paged blocks and draft verification are the vocabulary that later tracks use to reason about real serving.

**You can now**

- Explain prefix sharing, paged blocks with block tables and copy-on-write vocabulary without implementing a server.
- Explain the speculative-decoding promise (draft guesses, target verifies in parallel) and its exactness contract (output equals target-only sampling).
- Draw a small block-sharing diagram for a shared prefix and a divergence.

**Study**

1. [CS336 Lecture 10: paged attention and speculative sampling](https://cs336.stanford.edu/lectures/?trace=lecture_10) (Stanford CS336 - Lecture 10 Inference) - paged_attention (blocks, fragmentation, sharing the system prompt and parallel samples, copy-on-write at block level) and speculative_sampling (draft p guesses 4 tokens with target q verifying in parallel, exact-sample guarantee with the {A,B} proof, 70B/8B and 8B/1B pairs, Medusa and EAGLE).
2. [Modern LLM Notebook 21 Section 7: PagedAttention waste](https://github.com/walkinglabs/modern-llm-notebook/blob/main/notebooks-en/part3-inference/21-inference-acceleration.ipynb) (Modern LLM Notebook - KV cache and inference acceleration) - Section 7 (contiguous versus paged diagram with fixed-size pages, simulate_memory with block_size 16 showing paged waste 3 to 5 percent versus contiguous 13 to 20 percent).
3. [Modern LLM Notebook 23 Sections 2 and 3: acceptance and exactness](https://github.com/walkinglabs/modern-llm-notebook/blob/main/notebooks-en/part3-inference/23-speculative-decoding.ipynb) (Modern LLM Notebook - KV cache and inference acceleration) - Section 2 (draft guesses K tokens, target verifies in one pass) and Section 3 (accept_prob as min(1, p_target over p_draft)) with Exercise 1 (0.5 versus 0.8 giving 1.0). Depth: Do Sections 2 and 3 and Exercise 1 only. Skip Exercises 2 and 3: their expected-token formula drops the extra token the target always contributes, so their numbers disagree with the K + 1 ceiling. Skip draft-model training and variants; they belong to later tracks.

**Focus**

- Sharing needs exact token equality on the prefix. One differing token ends sharing after that point, and only later blocks diverge.
- Pages are fixed-size blocks with a table from logical to physical positions. Waste per sequence caps at block_size minus 1 instead of max_len minus 1.
- Forks share prefix pages and copy on write. Only the diverged block is copied, not the whole prefix.
- Speculation is exact: the acceptance ratio plus the residual correction reproduce target-only sampling. Speed depends on draft quality, not on luck.

**Reproduce:** Draw the shared-prefix block table for two requests over an 8-token prefix with block_size 4, show the copy-on-write step on divergence, and state the speculative exactness contract with the acceptance formula.

**Traps**

- Treating speculative decoding as approximate sampling. Unverified draft tokens change the distribution; only the accept plus correction loop preserves it.
- Expecting sharing across different prefixes. Similar text with different token ids shares nothing; the match is on tokens, not meaning.
- Paging away the math. Blocks only relocate storage; attention still gathers the same K and V, so outputs must match contiguous storage exactly.

**Practice**

- [Modern LLM Notebook 23 Exercise 1: acceptance probability](https://github.com/walkinglabs/modern-llm-notebook/blob/main/notebooks-en/part3-inference/23-speculative-decoding.ipynb) - Exercise 1 (acceptance probability for draft 0.5 versus target 0.8, asserting 1.0). Skip Exercises 2 and 3, whose expected-token formula is off by one token. Then compute the expected tokens per pass for K = 4 at acceptance 0.5 and 0.8 with the K + 1 form, and draw the 8-token shared-prefix diagram from the reproduce step.

**Stop when:** Exercise 1 passes, your expected-token numbers use the K + 1 form, and your diagram shows shared blocks plus the copy-on-write step with the exactness contract stated.

<details>
<summary>Self-test</summary>

1. Two requests share an 8-token system prefix with block_size 4. How many physical prefix blocks with sharing versus without?
   - 2 shared blocks versus 4 (2 per request). Sharing saves half the prefix memory, and a divergence copies only the affected block.
2. Draft assigns token A 0.5 and target assigns 0.8. What is the acceptance probability?
   - min(1, 0.8/0.5) = 1.0, so always accept.
3. A draft proposes K = 4 tokens and each is accepted with probability 0.5, independently. How many tokens does one target pass yield on average, and what is the ceiling?
   - (1 - 0.5^5) / (1 - 0.5) = 1.94, counting the token the target always adds after the last accepted draft token. A perfect draft gives K + 1 = 5. Notebook 23's exercises use 1 - alpha^K and drop that token, so trust the K + 1 form.
4. Does speculative decoding change the output distribution?
   - No. With the residual correction it is exact and equals target-only sampling. It changes speed, not the distribution.

</details>

### Mini-project: Cached generation, proved and measured

**About 10 to 14 hours.** Add a KV cache to the decoder and prove that it changes nothing but cost. Then measure prefill and decode separately, and explain the numbers with the arithmetic from section 4.

1. Add a per-layer cache of unexpanded K and V to your model, with absolute positions for RoPE, and a forward that takes new tokens, the cache and a start position.
2. Prove equivalence: greedy tokens match and per-step logits agree within tolerance with the uncached model for MHA, GQA and MQA, chunked prefill, a one-token prompt, a variable-length batch with padding, a sequence that stops early at EOS, and a reused cache slot.
3. Derive the KV-cache bytes for your config and for one published model config, and check the formula against the real tensor sizes of your cache.
4. Measure time to first token and inter-token latency on a CPU or a free GPU across two context lengths and two batch sizes, with warm-up, device synchronization and repeated trials.
5. Explain the measurements: which phase is compute-bound, which is memory-bound, and how the cache changes the cost of each decode step.
6. Connect the atlas lab adapters for section 5 and pass tests/test_s5_kv_cache.py.

**Deliverables**

- The cached model and its equivalence test suite.
- A KV memory sheet: the formula, your config, one published config and the measured cache size.
- A latency report: time to first token and inter-token latency per regime, the timing method, and an explanation of each trend.

**Checks**

- harness: [Atlas lab, section 5: cache equivalence, cache size and decode cost](https://github.com/saisandeshk/ai-atlas/tree/main/labs/llm-foundations). Run `uv run pytest tests/test_s5_kv_cache.py`. Run in labs/llm-foundations of an ai-atlas clone after you connect adapters.py to your package. It compares cached and uncached logits and tokens across head layouts, offsets and chunked prefill, checks the cache-size formula against your cache, and fails a decode step that recomputes the prefix.
- rubric: Self-grade with the rubric below.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Equivalence | Cached and uncached greedy tokens match on the lab cases. | Per-step logits also match within 1e-5 on your own adversarial cases, and a deliberately wrong RoPE offset makes your tests fail. |
| Memory | The KV formula matches the measured cache size. | The sheet scales the formula to a published model at long context and large batch, and names what dominates memory there. |
| Timing method | Prefill and decode are timed separately with warm-up and repeated trials. | The report gives medians with spread, synchronizes the device and states what the timings exclude. |
| Explanation | Each trend is explained in a sentence. | The explanation uses arithmetic intensity from section 4 and predicts one result before measuring it. |

Feeds into: Capstone artifact 3: the cached-generation half of the dossier and the full-prefix cache equivalence that the stage milestone asks for.

### Resource route

- **Primary - Implementation:** [LLMs from Scratch companion - KV cache and GQA](https://github.com/rasbt/LLMs-from-scratch/tree/main/ch04) - Use ch04/03_kv-cache and ch04/04_gqa with the chapter model code. Add explicit per-layer ownership, position offsets, variable lengths, EOS compaction and MHA-versus-GQA cache arithmetic to the runnable comparison.
- **Required - Implementation:** [Modern LLM Notebook - KV cache and inference acceleration](https://walkinglabs.github.io/modern-llm-notebook/?lang=en) - Use the KV-cache portions of English notebooks 11-mla-kv-cache and 21-inference-acceleration. Skip MLA and advanced acceleration as core work. Recalculate cache sizes and verify timing after warmup and explicit synchronization.
- **Required - Theory:** [Stanford CS336 - Lecture 10 Inference](https://cs336.stanford.edu/) - Use the Spring 2026 inference lecture to connect KV arithmetic, phase behavior and batching vocabulary. Keep kernels, distributed serving and expensive performance experiments for the later tracks.
- **Depth - Theory:** [How to Scale Your Model - inference chapter](https://jax-ml.github.io/scaling-book/inference/) - After cache equivalence and phase measurement pass, read the inference chapter for arithmetic intensity, parallelism and production-scale reasoning. Treat it as the handoff to inference and performance tracks, not required foundation work.
- **Depth - Reference:** [AI Performance Engineering - inference-engine bridge](https://github.com/wafer-ai/gpu-perf-engineering-resources) - Use Sections 4 and 5 only after this gate to choose the next inference, KV-cache, scheduling, quantization or distributed-serving resource. Do not treat its GPU and kernel material as unfinished LLM Foundations work.
- **Optional - Practice:** [No Magic - micro KV or paged-cache simulation](https://github.com/no-magic-ai/no-magic) - Use one small CPU simulation such as microkv.py or micropaged.py only to visualize state ownership. Do not present Python timing as GPU or serving-performance evidence.

### Exit checkpoint

Prove full-prefix and cached logits or tokens agree across adversarial MHA and GQA shapes, offsets and variable lengths. Derive KV capacity and measure prefill and decode separately across at least two context and batch regimes with trustworthy timing.

<details>
<summary>Deliberately left for later</summary>

- FlashAttention, Triton and custom GPU kernels
- Paged attention, continuous batching and production schedulers
- Tensor parallelism, disaggregation and serving-fleet design

</details>

## Stage milestone

### Tokenizer-to-Cached-Generation Evidence Pack

Keep one small corpus, tokenizer identity, model configuration and evaluation manifest across three artifacts. The result proves the whole causal-language-model mechanism while leaving large-scale training and serving to their dedicated tracks.

- Tokenizer and corpus audit pack - deterministic byte-safe BPE, serialized identity, adversarial properties, split-before-pack pipeline, provenance manifest, deduplication report, contamination probe and reproducible restart
- Tiny decoder stack - blank-file embeddings, RoPE, RMSNorm, MHA plus GQA or MQA, SwiGLU, causal loss, AdamW, complete checkpoint state, four decoding policies and differential, causality, mask and resume tests
- Evaluation, arithmetic and cached-generation dossier - versioned task and parser, raw outputs, slices and uncertainty, evaluator failure case, parameter, FLOP and memory worksheet, full-prefix cache equivalence and separate prefill and decode measurements

**Capstone rubric** (about 8 to 12 hours)

| Criterion | Pass | Strong |
| --- | --- | --- |
| One identity across artifacts | All three artifacts use one tokenizer hash, one model config and one evaluation manifest. | One command checks the hashes and fails if any artifact uses a different one. |
| Tokenizer and corpus audit pack | The section 1 mini-project meets Pass on every criterion. | It meets Strong on at least half its criteria, including reproducibility. |
| Tiny decoder stack | The section 2 and 3 mini-projects meet Pass, and their CS336 and atlas lab tests pass in one run. | Resume is exact on CPU, and the attention oracle compares gradients in float64. |
| Evaluation, arithmetic and cached-generation dossier | The section 4 and 5 mini-projects meet Pass. | Every estimate sits next to a measurement, and cache equivalence covers MHA, GQA and MQA. |
| Rebuild from a clean clone | A README lists the commands that rebuild each artifact. | One script rebuilds every reported number from a fresh clone on a CPU in under an hour. |
| Honest limits | The dossier states what the tiny model and small corpus cannot show. | Each limit names the later track that addresses it. |

