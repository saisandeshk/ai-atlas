<!-- Generated from content/curriculum.json. Edit the JSON and run npm run content:generate. -->

# 02. LLM Research, Training & Post-training

**Level:** Advanced  
**Scope:** 11 track stages · 203 required topics · 43 optional, depth, or later topics

Design and execute trustworthy language-model training and post-training research from data and architecture through scaling, evaluation, adaptation, preference optimization, reasoning, multimodality and safety. One versioned research program grows across the track and ends in a mechanism-isolating contribution.

## Order

LMR-1. Data and Tokenizer Systems
LMR-2. Architecture and Numerics
LMR-3. Pretraining Reliability
LMR-4. Scaling and Data Mixtures
LMR-5. Language-Model Evaluation
LMR-6. Adaptation and Distillation
LMR-7. Preference Modeling and Direct Optimization
LMR-8. RL Post-training and Reasoning
LMR-9. Multimodal Language Models
LMR-10. Alignment, Safety and Release Evaluation
LMR-11. Research-Scale Integration

## LMR-1. Data and Tokenizer Systems

**Why:** Language-model behavior begins in the corpus. This stage makes extraction, filtering, deduplication, tokenization, mixing and batch lineage reproducible enough that a model result can be attributed to a real data intervention.

### Learn this much

- [ ] Corpus purpose, target population and intended model behavior _(Required)_
- [ ] Acquisition provenance, consent, licensing, permitted use and deletion obligations _(Required)_
- [ ] WARC and HTML parsing, boilerplate removal and document-boundary preservation _(Required)_
- [ ] Language, domain and source identification with confidence and sampled error review _(Required)_
- [ ] Unicode, normalization and irreversible text-cleaning decisions _(Required)_
- [ ] Quality rules and learned filters, threshold choice and false-positive analysis _(Required)_
- [ ] Stable exact document and line deduplication _(Required)_
- [ ] MinHash, LSH and task-appropriate near-deduplication thresholds _(Required)_
- [ ] Evaluation contamination checks with stored matches and adjudication _(Required)_
- [ ] PII, toxicity and harmful-content detection with utility and coverage trade-offs _(Required)_
- [ ] Tokenizer fertility, vocabulary choice and language or domain disparities _(Required)_
- [ ] Document packing, boundary tokens, causal masks and cross-document leakage _(Required)_
- [ ] Source mixture weights, temperature sampling and realized-token accounting _(Required)_
- [ ] Curriculum order, repetition, synthetic data and effective data diversity _(Required)_
- [ ] Deterministic shards, shuffle state, worker ownership and restart position _(Required)_
- [ ] Raw tokens, effective tokens, data epochs and small-source oversampling _(Required)_
- [ ] Lineage from raw document through every transform to a concrete training batch _(Required)_
- [ ] Immutable dataset versions, manifests, data cards and checkpoint linkage _(Required)_
- [ ] Multilingual and code-corpus quality audits beyond English web text _(Optional)_
- [ ] Model-based data selection and influence-style attribution _(Depth)_
- [ ] Production-scale deletion propagation across derived datasets and checkpoints _(Later)_
- [ ] Large human annotation operations and governance platforms _(Later)_

### Study units

#### U1. Corpus purpose, target population, provenance and usage rights

**About 3 h** · **Target:** Explain

Topics: Corpus purpose, target population and intended model behavior; Acquisition provenance, consent, licensing, permitted use and deletion obligations

Every filter and mixture choice later in this section is judged against what the corpus is for, and every rights question is answered from a record made when the data was acquired. A record you did not keep at download time cannot be rebuilt afterwards.

**You can now**

- Write a corpus purpose statement that names the intended model behavior and the population of text and users it must serve, and state what the corpus must not be used for.
- Trace one source from live site to crawl to dump to your files, and record at each hop the license or consent basis, the restrictions that apply and what is still unknown.
- Explain why a stable source and document id, kept through every later version, is what makes a deletion or blocklist request actionable.

**Study**

1. [CS336 2026 Lecture 13: Data I (executable trace)](https://cs336.stanford.edu/lectures/?trace=lecture_13) (CS336 2026 - Data Lectures 13 and 14) - The `raw_sources`, `copyright`, `common_crawl` and `common_pile` steps: why a live service is not training data, the crawl restrictions, the decline-of-consent item, licenses, fair use, terms of service, the lawsuit summaries, and the 'Subtleties' list under CommonPile. Depth: Skim the dataset tour from `bert` to `nemotron_cc`; you need it only for the Dolma and Dodge readings below. The lecture is a non-lawyer account of US law at its date, and its copyright term of 75 years is a simplification, so do not copy that figure into a rights record.
2. [Dolma (Soldaini et al., 2024)](https://arxiv.org/abs/2402.00159v2) (Dolma: an Open Corpus of Three Trillion Tokens for Language Model Pretraining Research (Soldaini et al., 2024)) - Section 3 (Data Design Goals, the four goals and their footnotes) and Table 1 (the corpus at a glance).
3. [Documenting Large Webtext Corpora (Dodge et al., 2021)](https://arxiv.org/abs/2104.08758v2) (Documenting Large Webtext Corpora: A Case Study on the Colossal Clean Crawled Corpus (Dodge et al., 2021)) - Section 3 (corpus-level statistics: 3.1 domains, 3.2 utterance date, 3.3 geolocation) and Sections 5.2 and 5.3 (which identities and whose English the filters removed).
4. [Dolma Toolkit: data format](https://github.com/allenai/dolma/blob/669f534823b08d266a8fff01f8a1c916a5a56576/docs/data-format.md) (Dolma Toolkit) - 'Dolma Document Format' with the `id` field and the `metadata` field.

**Focus**

- State the purpose before you filter: the behavior the model must have and the population it serves. Dolma scopes itself to English text on purpose and says that this reinforces English as the default (Section 3), which is what makes its English-only rules defensible.
- A page reaches you through several hops, and each hop has its own rules: `robots.txt` and terms of service at crawl time, copyright and any license on the content, and the license on the collection that redistributes it. Keep one row per source and mark each field verified, assumed or unknown.
- A collection license does not pass to the documents inside it, and a content license does not override a site's terms of service. The lecture's CommonPile list and the YouTube example make both points.
- A deletion or takedown request can be honored only if the document id is stable across every later version and every derived artifact keeps it. Dolma requires this of the `id` field so that a blocklist applies to all versions.

**Reproduce:** Closed-book, write the one-page ledger for a corpus you plan to build: a purpose statement of three or four lines (behavior, population, out-of-scope uses), then one row per source with `source`, `acquired_from`, `date`, `basis` (license, consent or exception claimed), `restrictions` (`robots.txt`, terms), `personal_data`, `deletion_contact` and `unknown`. Mark every cell verified, assumed or unknown, and list which cells you could not fill from the data alone.

**Traps**

- Treating 'it is in the crawl' as 'it may be used for training'. A crawl records how you obtained a page, not what its owner permits.
- Writing the purpose as a list of sources ('web, code, books'). That gives you nothing to test filters against: Dodge Sections 5.2 and 5.3 show a blocklist removing text by and about minority groups, which counts as a loss only if those groups are in the population you stated.
- Filling the rights record after the download. The date, the version of the terms and the `robots.txt` you saw at that time cannot be rebuilt later, so capture them while acquiring.

**Practice**

- [CS336 Assignment 4: Problem `look_at_cc`](https://github.com/stanford-cs336/assignment4-data/blob/0555bea66369872d912652debf10b115ca0688c8/cs336_assignment4_data.pdf) - Section 2.1 (p. 3), parts (a) to (d); download the example files with `uv run scripts/download_data.py --offline-only`. The problem is written, with no test. For (d) keep the 25 annotations as a table and add two columns: the rights position you can see from the page (license, terms, none) and whether it holds personal data. The section mini-project reuses this ledger for your own corpus; do not publish the course's solutions.

**Stop when:** You have a ledger for your planned corpus in which every cell is marked verified, assumed or unknown, and you can say what a deletion request would need in order to find its document in every later version.

<details>
<summary>Self-test</summary>

1. A page is in the crawl snapshot you downloaded. Give two separate reasons you may still be unable to train on it.
   - The owner holds copyright unless a license or an exception such as fair use applies, and that exception is unsettled. Independently, the site's terms of service or `robots.txt` can restrict automated copying even when the content is licensed, and the page may contain personal data.
2. Why must a document id stay the same from the raw files to every later dataset version?
   - A blocklist for takedown requests, evaluation leaks or manual rejection is a list of ids. If ids were reassigned per version, the list would stop matching the later versions without any error, and a deleted document could survive in them.
3. A corpus is released under a permissive collection license. Can you assume each document in it is free to use?
   - No. The collection license covers the compilation. Each document keeps whatever status its owner gave it, so you still need a per-source basis, and laundering of copyrighted work into a permissive collection is a known risk.
4. A corpus is scoped to English on purpose. Name one thing that scope justifies and one claim it does not support.
   - It justifies English-specific rules such as a stop-word test or an English language-ID threshold. It does not support any claim about how a model trained on it behaves in other languages, and the scope should be stated in the card so readers do not infer one.

</details>

#### U2. WARC and HTML text extraction with document boundaries preserved

**About 4 h** · **Target:** Implement

Topics: WARC and HTML parsing, boilerplate removal and document-boundary preservation

Extraction decides what text exists at all. Navigation text left in becomes repeated text that every later step must catch, and a document that loses its record id can no longer be traced to a source or deleted.

**You can now**

- Implement text extraction from raw HTML bytes that tries UTF-8 first, falls back to a detected encoding, and records which route it took.
- Iterate the response records of a WARC file so that each record yields exactly one document that keeps its record id, URL and date.
- Compare full-page and main-content extraction on pages you have read, and say what each one removes, keeps and cannot recover.

**Study**

1. [CS336 Assignment 4 handout](https://github.com/stanford-cs336/assignment4-data/blob/0555bea66369872d912652debf10b115ca0688c8/cs336_assignment4_data.pdf) (CS336 Assignment 4 - Data) - Section 2.2, HTML to text conversion, and Problem (`extract_text`) parts (a) and (b) (pp. 3 to 4), with the FastWARC note. Depth: Read Section 2.1 (WARC, WAT and WET) only for the definitions of the three formats.
2. [CS336 2026 Lecture 14: Data II (executable trace)](https://cs336.stanford.edu/lectures/?trace=lecture_14) (CS336 2026 - Data Lectures 13 and 14) - The `transformation` step: raw data is HTML, PDF or directories, HTML to text is lossy and needs linearizing, the rule-based tools, and why extraction accuracy matters.
3. [FineWeb (Penedo et al., 2024)](https://arxiv.org/abs/2406.17557v2) (FineWeb Paper and DataTrove Pipeline) - Section 3.1 (experimental setup, for how each choice is ablated) and Section 3.2 (text extraction: WARC versus WET, Figure 1). Depth: Stop after Section 3.2 here; Sections 3.3 and 3.4 belong to the filtering and deduplication units.
4. [DataComp-LM (Li et al., 2024)](https://arxiv.org/abs/2406.11794v4) (DataComp for Language Models) - Section 4.2 'Text extraction' and Table 3 (resiliparse, trafilatura and the WET files compared at 1B-1x scale). Depth: Optional second opinion on extraction. Read the scores as that paper's results on its own recipe; the authors report resiliparse as about 8 times faster than trafilatura at similar CORE.
5. [Resiliparse: HTML2Text and FastWARC](https://resiliparse.chatnoir.eu/en/stable/man/extract/html2text.html) (Resiliparse, fastText and datasketch on Four Documents) - HTML2Text sections 'Basic Plain Text Conversion' and 'Main Content Extraction'; then the FastWARC page at https://resiliparse.chatnoir.eu/en/stable/man/fastwarc.html, sections 'Iterating WARC Files', 'Filtering Records', 'Record Properties' and 'Freezing Records' (page read 2026-10-16, Resiliparse and FastWARC 1.0.9).

**Focus**

- A WARC file interleaves record types. Only `response` records hold a page; `request`, `warcinfo` and `metadata` records are not documents. Select the type when you open the iterator.
- The document identity comes from the WARC header: `record_id` is the `WARC-Record-ID`, and the target URI and date sit beside it. Write them next to the text at the moment you extract, because nothing later can recover them.
- Extraction is lossy and a choice, not a fact. With `main_content=False` (the default) `extract_plain_text` keeps navigation and footer text; with `main_content=True` it removes them, and it can also remove short real text such as list items and captions. FineWeb found WET text retained too much menu text and that extraction changed the trained model.
- Bytes come first. Try UTF-8, fall back to `detect_encoding`, and keep the encoding you used in the record, since a wrong guess produces plausible but damaged text.

**Reproduce:** Closed-book, write `extract_records(warc_path)` that opens the file with FastWARC, keeps only `response` records, decodes the body (UTF-8 first, then the detected encoding), calls `extract_plain_text`, and yields a dict with `record_id`, `url`, `date`, `encoding` and `text`. On a WARC you build with three response records and one request record, show that you get three documents and that `record_id` matches the header. Then run one page with `main_content=False` and `True` and write down one piece of text the second setting removed correctly and, if you can find one, one it removed wrongly.

**Traps**

- Passing the course test and believing boilerplate is gone. The fixture's expected text equals the default output (`main_content=False`), and with `main_content=True` it no longer matches, so the test checks decoding and plain-text conversion, not boilerplate removal. Measure that separately on pages you read.
- Reading `record.reader.read()` twice. The reader is a live stream, so the second call returns empty bytes; call `freeze()` first if you need the payload again.
- Storing documents as one text file and treating each line as a document. Extracted pages contain newlines, so the handout's tokenization starter, which adds the end-of-text token after every line, would insert document boundaries inside documents. Store one JSON object per document and tokenize each document as a unit.

**Practice**

- [CS336 Assignment 4: `extract_text`](https://github.com/stanford-cs336/assignment4-data/blob/0555bea66369872d912652debf10b115ca0688c8/tests/test_extract.py) - Problem (`extract_text`) in Section 2.2; connect your function to `run_extract_text_from_html_bytes` in `tests/adapters.py` and pass `test_extract_text_from_html_bytes`. The test compares your output with a stored extraction of one HTML page. Then do part (b) on the example WARC and its WET file. The section mini-project covers the record-preserving iterator from the reproduce step. Implement it in your own repository.

**Stop when:** Your extraction function passes `test_extract_text_from_html_bytes`, and your WARC iterator turns a file with mixed record types into one document per response record with the record id attached.

<details>
<summary>Self-test</summary>

1. A WARC file has 10 records: 1 `warcinfo`, 4 `request` and 5 `response`. How many documents should extraction produce, and where does each one's id come from?
   - Five, one per response record. The id is the `WARC-Record-ID` header of that record, read as `record_id` in FastWARC.
2. Why can the same HTML give different training text under `main_content=True` and `main_content=False`, and which output is the better training data?
   - The default keeps navigation, footer and sign-in text, and the main-content setting removes it and can also remove short real text such as a list item. Neither is better in general: it depends on what the page is and on what the model is for, so decide by reading samples and by an ablation, as FineWeb did, not by assumption.
3. A page declares no charset and its bytes are Latin-1 text. What happens if you decode it as UTF-8 with `errors='replace'`, and what should the pipeline do instead?
   - Bytes above 127 usually fail as UTF-8 and become replacement characters, so accented letters are lost silently. Fall back to a detected encoding, keep the encoding you used in the record, and count how often the fallback runs.
4. Why is it a boundary bug to concatenate extracted documents into one file separated by blank lines?
   - A blank line also occurs inside documents, so the original document boundaries cannot be recovered. Use an explicit record format with the id, or an end-of-document marker that cannot occur in the text, and test that the document count survives a write and read.

</details>

#### U3. Language and domain identification, and irreversible normalization decisions

**About 4 h** · **Target:** Implement + Measure

Topics: Language, domain and source identification with confidence and sampled error review; Unicode, normalization and irreversible text-cleaning decisions

A language filter decides which languages the model will ever see, and a normalization step decides which character distinctions it can ever learn. Both are applied once, at scale, and a bad choice cannot be undone from the cleaned output.

**You can now**

- Implement language identification with fastText that returns a language and a score between 0 and 1, and choose a keep threshold from a hand-labeled sample with a stated interval, not from the score alone.
- Measure retention per language and per kind of text at a threshold, and find which languages, short texts, code and mixed pages the filter drops or mislabels.
- Choose a Unicode normalization form for each stage, state which distinctions it erases, and keep the raw text so that the choice can be revisited.

**Study**

1. [CS336 Assignment 4 handout](https://github.com/stanford-cs336/assignment4-data/blob/0555bea66369872d912652debf10b115ca0688c8/cs336_assignment4_data.pdf) (CS336 Assignment 4 - Data) - Section 2.3, Language identification, and Problem (`language_identification`) parts (a) to (c) (pp. 4 to 5); in Section 3.2 the normalization list in Problem (`minhash_deduplication`) (p. 11).
2. [CS336 2026 Lecture 14: Data II (executable trace)](https://cs336.stanford.edu/lectures/?trace=lecture_14) (CS336 2026 - Data Lectures 13 and 14) - The `filtering` step: the target-versus-raw framing, 'Language identification' (176 languages, training sites, the English threshold Dolma uses) and 'Scale-dependent effects of filtering'.
3. [Gopher, Appendix A (Rae et al., 2021)](https://arxiv.org/abs/2112.11446v2) (Scaling Language Models: Methods, Analysis and Insights from Training Gopher, Appendix A) - Appendix A.4 'Text normalisation' (p. 46): the tokenizer's NFKC step, why it is not lossless, and the authors' recommendation.
4. [Unicode Standard Annex #15: Unicode Normalization Forms](https://www.unicode.org/reports/tr15/tr15-58.html) (Unicode Standard Annex #15: Unicode Normalization Forms) - Section 1.1 (canonical and compatibility equivalence) and Section 1.2 (the four normalization forms, and why the compatibility forms 'may remove distinctions that are important to the semantics of the text').
5. [FineWeb (Penedo et al., 2024)](https://arxiv.org/abs/2406.17557v2) (FineWeb Paper and DataTrove Pipeline) - Section 3.3 (base filtering: a fastText English score of at least 0.65). Depth: Read only the language-filter sentence; the rest of 3.3 belongs to the quality-filter unit.

**Focus**

- The off-the-shelf identifier, `lid.176.bin`, returns a label and a probability for text on one line; it was trained on Wikipedia, Tatoeba and SETimes, and it knows 176 languages. A text in any other language still gets one of those labels.
- A threshold such as 0.5 or 0.65 is a pipeline policy, not a property of the model. The score is not calibrated across languages, so measure retention per language on parallel or hand-labeled text before you fix the number.
- Sample and audit: read labeled examples, count errors per slice, and report the error rate with an interval. Twenty samples can only bound an error rate loosely.
- Normalization has two kinds of use. A matching key (for deduplication or contamination) may be aggressive because you keep the original. Stored training text should change only distinctions the standard says carry no meaning. NFKC does not meet that bar, which is Gopher's own conclusion.

**Reproduce:** Closed-book, write `identify(text)` that removes newlines, calls `predict(text, k=1)` on `lid.176.bin`, and returns `(code, score)`. Run it on the 1,012 `devtest` sentences of FLORES-200 (CC BY-SA 4.0) for English, Swahili, Yoruba and Shan, and tabulate top-1 accuracy, the share of sentences that are both correct and at least 0.65, and the mean score. In one run with fastText 0.9.2 (the `fasttext-numpy2-wheel` build) and `lid.176.bin`, English was 100% correct with 99.7% kept, Swahili 94.8% correct but only 28.7% kept, Yoruba 56.0% correct with 200 sentences labeled Irish, and every Shan sentence but one was labeled Burmese (mean score 0.89, since Shan is not among the 176). Then write what NFC and NFKC each do to `ﬁ` (U+FB01), the full-width `Ｈｅｌｌｏ` and `x²`, and say which result you could not undo.

**Traps**

- Reading the score as a probability of being right. Shan was labeled Burmese at a mean score of 0.89, and a short Norwegian Bokmål sentence (`Jeg bor i en liten by ved kysten og går til jobb hver dag.`) came back Danish at 0.96 in the same setup. A high score says the model is sure, not that it is correct.
- Using one threshold for every language. A cutoff that keeps 99.7% of English can keep under a third of correctly identified Swahili, so a global rule silently removes a language from the corpus.
- Cleaning the stored text with the same normalization you use for dedup keys. Lowercasing, accent stripping and whitespace collapse (the handout's MinHash step) are fine for a key; applied to the training text they erase case, diacritics and the indentation in code.

**Practice**

- [CS336 Assignment 4: `language_identification`](https://github.com/stanford-cs336/assignment4-data/blob/0555bea66369872d912652debf10b115ca0688c8/tests/test_langid.py) - Problem (`language_identification`) in Section 2.3; connect your function to `run_identify_language` in `tests/adapters.py` and pass both tests in `tests/test_langid.py`. The tests check an English page and a Chinese sentence, so they do not test thresholds. For part (c) label 20 documents by hand and report the errors with an interval, then add the per-language FLORES table from the reproduce step. The section mini-project reuses that table. Implement it in your own repository.

**Stop when:** Your function passes both language tests, you have a per-language retention table at your chosen threshold with the audit interval beside it, and you can state which normalization your pipeline applies to keys and which to stored text.

<details>
<summary>Self-test</summary>

1. A model is right on 94.8% of Swahili sentences, yet an English-tuned cutoff of 0.65 keeps 28.7% of them. What does this tell you about choosing a threshold?
   - The score distribution differs by language, so one number trades very different amounts of recall per language. Choose the cutoff per language, or per slice, from a labeled sample, and report retention by language.
2. You audit 300 sampled documents and find no language errors. What can you claim about the error rate?
   - Only an upper bound: with 0 errors in 300 the two-sided 95% Clopper-Pearson upper bound is about 1.2%, and the one-sided rule of three gives about 3/300 = 1%. You cannot claim zero, and the bound holds for the population you sampled from, not for slices you did not sample.
3. Why can NFKC be used to build a deduplication key but should not be applied to the text you train on?
   - NFKC replaces compatibility forms, for example `x²` becomes `x2` and ligatures and full-width letters become plain letters. A key only needs to treat such variants as equal, and the original stays available. Stored text would lose distinctions that math, code and typography rely on, and the change cannot be reversed from the output.
4. A four-line Python function is labeled Swedish at 0.27. What does this say about running language identification on mixed web data?
   - The identifier was trained on prose, so code, tables and markup get arbitrary labels and low scores. A language threshold would remove them as a side effect. Decide the domain first and route code and non-prose to their own rules.

</details>

#### U4. Quality rules, learned quality classifiers and false-positive analysis

**About 5 h** · **Target:** Implement + Measure

Topics: Quality rules and learned filters, threshold choice and false-positive analysis

Quality filters are the first data intervention that moves model results, and also the first that removes whole kinds of text by accident. Counting only what survives hides the false positives, so the audit of removed text is the measurement.

**You can now**

- Implement the Gopher-style rules from the handout so that each decision returns the name of the rule that failed, and say which rules of the original paper you left out.
- Train a fastText quality classifier from a reference set and a raw set, and choose its threshold from a held-out labeled sample using precision and recall with intervals.
- Find the false positives of each filter by slice (language, kind of text, length), report how many documents and tokens it removes, and say which removals you would reverse.

**Study**

1. [CS336 Assignment 4 handout](https://github.com/stanford-cs336/assignment4-data/blob/0555bea66369872d912652debf10b115ca0688c8/cs336_assignment4_data.pdf) (CS336 Assignment 4 - Data) - Section 2.6, Quality Rules, with Problem (`gopher_quality_filters`) (pp. 7 to 8), then Section 2.7, Quality Classifier, with Problem (`quality_classifier`) (pp. 8 to 9).
2. [Gopher, Appendix A (Rae et al., 2021)](https://arxiv.org/abs/2112.11446v2) (Scaling Language Models: Methods, Analysis and Insights from Training Gopher, Appendix A) - Appendix A.1, the 'Quality Filtering' paragraph (p. 40) and the 'Repetition Removal' paragraph with Table A1 (pp. 40 to 41).
3. [CS336 2026 Lecture 14: Data II (executable trace)](https://cs336.stanford.edu/lectures/?trace=lecture_14) (CS336 2026 - Data Lectures 13 and 14) - The `filtering` step: the target-versus-raw framing, the generative (KenLM) and discriminative (fastText) classifiers, 'Model-based filtering?', the GPT-3, LLaMA and textbook-quality code-model examples, and 'Scale-dependent effects of filtering'.
4. [Dolma (Soldaini et al., 2024)](https://arxiv.org/abs/2402.00159v2) (Dolma: an Open Corpus of Three Trillion Tokens for Language Model Pretraining Research (Soldaini et al., 2024)) - Section 5.2 'Quality Filtering' with its footnote 4 on why 'quality' is an ideological label, and Section 4.2 for the ablation method.
5. [DataComp-LM (Li et al., 2024)](https://arxiv.org/abs/2406.11794v4) (DataComp for Language Models) - Section 4.4 with Table 4 (filter comparison) and Table 5 (reference data and threshold). Depth: Optional, after your own filtered-versus-unfiltered comparison. Read the numbers as that paper's results on its pool and recipe; do not compare its CORE scores with other papers' scores.

**Focus**

- Each rule is a guess about what bad text looks like, written for English prose. The handout implements four of Gopher's rules: word count, mean word length, lines ending in an ellipsis, and the share of words with a letter. The paper also has a stop-word test, a symbol-to-word ratio, a bullet-line rule and the repetition thresholds of Table A1.
- A learned filter is a classifier of 'looks like the reference set', not of quality. The reference set decides what it learns: in DCLM Table 5 the choice of positive data moved CORE by more than five points at the same top-10% threshold (7B-1x scale, that paper's setup).
- The threshold trades quantity for quality, and the right value depends on the token budget. The lecture's scale-dependent effects slide and the DCLM top-10% result both belong to one recipe, so a threshold from one run does not transfer.
- The audit is the result. For every filter, keep the removed documents, sample them, and report the false-positive rate with an interval for each slice.

**Reproduce:** Closed-book, write `gopher_reason(text)` that returns `pass` or the name of the first failed rule: fewer than 50 or more than 100,000 words, mean word length outside 3 to 10, more than 30% of lines ending in `...`, fewer than 80% of words containing a letter, and fewer than two of the eight stop words `the be to of and that have with`. Run it on `"The city is on the banks of the river and has more than a hundred thousand people. " * 8` and on `"La ville est située au bord de la rivière et compte plus de cent mille habitants. " * 8`, then on `"def add(a, b):\n    return a + b\n\n" * 30`. Split words on whitespace: the English text passes, and the French text and the code fail only the stop-word rule. With `nltk.word_tokenize`, which the handout suggests, the code also fails the mean-word-length and alphabetic-share rules, so state your word split with the rules.

**Traps**

- Reading a passing test as evidence of quality. The handout's tests use constructed strings that each break one rule, so they check the thresholds and say nothing about false positives on real pages. `test_classify_quality` checks only two fixture texts.
- Calling the handout's four rules 'the Gopher filter'. State the rules you ran. The stop-word test is the one that removes non-English text and code, so leaving it out changes what the filter does to a multilingual corpus.
- Judging a filter on twenty examples, or scoring the classifier on pages it was trained on. One false positive in twenty gives an interval of about 0.1% to 25% (Clopper-Pearson), so the sample cannot tell a harmless filter from a harmful one. Audit more, per slice, and keep the audit sample out of training and out of threshold tuning.

**Practice**

- [CS336 Assignment 4: Gopher filters and the quality classifier](https://github.com/stanford-cs336/assignment4-data/blob/0555bea66369872d912652debf10b115ca0688c8/tests/test_quality.py) - Problems (`gopher_quality_filters`) and (`quality_classifier`); connect `run_gopher_quality_filter` and `run_classify_quality` in `tests/adapters.py` and pass the seven `test_gopher_*` tests and `test_classify_quality` in `tests/test_quality.py`. The list of positive URLs in part 2.7 comes from a full Wikipedia dump. Replace it with a few hundred pages that articles you choose link to, fetched with the handout's `wget` command, and use random records from the example WET file as negatives. Do part (b) of `gopher_quality_filters` with a per-rule false-positive count. The small filtered-versus-unfiltered training comparison belongs to the section mini-project. Implement it in your own repository.

**Stop when:** Your code passes the seven Gopher tests and `test_classify_quality`, and you have a table of removals per rule and per slice with a sampled false-positive rate and its interval for each.

<details>
<summary>Self-test</summary>

1. Why can the rule 'at least 80% of words contain an alphabetic character' remove good text?
   - It assumes prose. Tables of numbers, math, data listings and symbol-heavy code fail it although they can be valuable training text. It is a statement about the kind of text you want, which should match the corpus purpose.
2. A classifier is trained with pages linked from Wikipedia as positives and random crawl pages as negatives. What does it learn, and where will it fail?
   - It learns what separates those two samples: style, topic and source type. It will score low on good text unlike the references (forum answers, code, other languages) and can score high on reference-shaped text that is wrong. Its score has meaning only after you check it against labeled samples.
3. You audit 20 removed documents and 1 was a false positive. What can you report?
   - An observed rate of 5%, with a 95% interval of roughly 0.1% to 25%. Twenty documents cannot separate 1% from 20%, so sample more and report per slice.
4. A top-10% threshold gave the best model in one paper. Why is that not a rule for your pipeline?
   - The threshold trades data quantity for quality, so the best value depends on the token budget, the pool and the reference set. A longer run wants more, lower-scoring data. Tune it on your own comparison at your own budget.

</details>

#### U5. Exact deduplication and MinHash near-deduplication thresholds

**About 5 h** · **Target:** Derive + Implement

Topics: Stable exact document and line deduplication; MinHash, LSH and task-appropriate near-deduplication thresholds

Duplicates waste training tokens, inflate memorization, and let evaluation text leak into training. MinHash lets you find near-duplicates without comparing every pair, but its parameters are easy to get wrong by a factor that the code never reports.

**You can now**

- Derive the probability $`1 - (1 - s^r)^b`$ that two documents with Jaccard similarity $`s`$ share a bucket, and the threshold $`(1/b)^{1/r}`$ where it rises, then choose $`b`$ and $`r`$ for a target similarity.
- Implement exact line deduplication and MinHash-LSH document deduplication that verifies each candidate pair with exact Jaccard, clusters duplicates and keeps one document by a fixed rule.
- State what the shingle size, the threshold and the scope of deduplication (per snapshot or global) trade, and keep a record of each duplicate cluster.

**Study**

1. [CS336 Assignment 4 handout](https://github.com/stanford-cs336/assignment4-data/blob/0555bea66369872d912652debf10b115ca0688c8/cs336_assignment4_data.pdf) (CS336 Assignment 4 - Data) - Section 3 introduction, Section 3.1 with Problem (`exact_deduplication`) (pp. 9 to 10), and Section 3.2 with Problem (`minhash_deduplication`): MinHashing, locality-sensitive hashing and clustering (pp. 10 to 12).
2. [CS336 2026 Lecture 14: Data II (executable trace)](https://cs336.stanford.edu/lectures/?trace=lecture_14) (CS336 2026 - Data Lectures 13 and 14) - The `deduplication` step: the design space (item, match rule, action), `hash_functions`, `exact_deduplication`, `jaccard_minhash` and `locality_sensitive_hashing`. Depth: In `locality_sensitive_hashing` the closing example sets n = 9000 with b = 20 and r = 450 and then reads a threshold of about 0.99 from it. That is not the setting of Lee et al.; see the first trap before you use those numbers.
3. [Deduplicating Training Data Makes Language Models Better (Lee et al., 2022)](https://arxiv.org/abs/2107.06499v2) (Deduplicating Training Data Makes Language Models Better (Lee et al., 2022)) - Section 4.2 (approximate matching with MinHash) and Appendix A (parameters), Section 5.1 and 5.3 (how much each dataset loses, and train-test leakage), Section 6.1 and 6.2 (perplexity and copied text). Depth: Skip the suffix-array material in Sections 4.1 and Appendix B; read only that exact-substring matching uses a 50-token threshold chosen for English web text.
4. [FineWeb (Penedo et al., 2024) and the DataTrove example](https://github.com/huggingface/datatrove/tree/1977fbb0f3c163d43cace334b073dda17fa3ef26) (FineWeb Paper and DataTrove Pipeline) - FineWeb paper (https://arxiv.org/abs/2406.17557v2) Section 3.4 with Figures 3 and 4: per-snapshot versus global MinHash; then `examples/fineweb.py` at the pinned commit, the `MinhashConfig` with 14 buckets of 8 hashes and word 5-grams.
5. [datasketch: MinHash LSH](https://ekzhu.com/datasketch/lsh.html) (Resiliparse, fastText and datasketch on Four Documents) - 'Retrieval characteristics and parameter tuning' and 'Common Issues with MinHash LSH' (page read 2026-10-16, datasketch 2.0.0).

**Focus**

- Fix three choices before you code: the item that is compared (line, paragraph, document or n-gram span), the match rule (exact, shared piece, fraction shared), and the action (drop all, keep one). Exact dedup is a hash of the normalized item; equal hashes are a candidate until the bytes are compared.
- MinHash gives $`P[h(A) = h(B)] = J(A, B)`$ for one random hash. With $`k = b \cdot r`$ hashes split into $`b`$ bands of $`r`$ rows, two documents collide if any band matches, which has probability $`1 - (1 - s^r)^b`$. More rows per band raises the threshold, more bands lowers it.
- LSH proposes candidates and does not decide. Check each candidate with exact Jaccard on the shingles, as the handout does, then cluster by connected components and keep one document per cluster by a fixed rule. Normalize only for the key (the handout lists lowercasing, punctuation, whitespace, accents and NFD) and keep the raw text and the cluster record.
- The threshold is a modeling choice. Lee et al. use word 5-grams with a Jaccard test at 0.8 followed by an edit-similarity test at 0.8, Gopher uses 13-grams at 0.8, FineWeb uses 5-grams targeting about 75%, and FineWeb found that deduplicating each snapshot separately beat deduplicating all of them together.

**Reproduce:** Derive $`P = 1 - (1 - s^r)^b`$ and the threshold $`(1/b)^{1/r}`$. Then compute, with 9000 hashes as Lee et al. arrange them (450 bands of 20 rows, their Appendix A), the threshold and $`P`$ at $`s = 0.8`$; repeat for 20 bands of 450 rows as the lecture example reads them; and for 100 hashes in 10 bands (the first MinHash test in the handout) at $`s = 0.8`$. Expect a threshold of about 0.737 and $`P \approx 0.995`$; a threshold of about 0.993 and $`P`$ about $`5 \times 10^{-43}`$; and $`P \approx 0.679`$.

**Traps**

- Lee et al. name the parameters the other way round from the lecture and the handout. Their Section 4.2 writes $`1 - (1 - s^b)^r`$ with $`b = 20`$ hashes per bucket and $`r = 450`$ buckets, which is 450 bands of 20 rows. The lecture's code puts 20 bands of 450 rows through $`(1/b)^{1/r}`$ and gets a threshold near 0.99, where two documents at $`s = 0.8`$ essentially never collide. Always check which variable counts bands and test the result against the target similarity.
- Treating a library threshold as a hard cutoff. `MinHashLSH(threshold=0.9, num_perm=128)` in datasketch 2.0.0 picks 5 bands of 25 rows, and `threshold=0.5` picks 25 bands of 5 rows, by balancing false positives and false negatives. It returns candidates; keep the exact Jaccard check.
- Believing that more deduplication is always better. FineWeb's global MinHash removed up to 90% of the oldest snapshots and left worse text than it removed, and Lee et al. note that train and test duplicates must be handled on purpose (they kept the copy in the evaluation set).

**Practice**

- [CS336 Assignment 4: exact and MinHash deduplication](https://github.com/stanford-cs336/assignment4-data/blob/0555bea66369872d912652debf10b115ca0688c8/tests/test_deduplication.py) - Problems (`exact_deduplication`) and (`minhash_deduplication`); connect `run_exact_line_deduplication` and `run_minhash_deduplication` in `tests/adapters.py` and pass the three tests in `tests/test_deduplication.py`. The fuzzy test uses two MIT license texts with 5-word shingles; compute their exact Jaccard yourself and compare it with the collision probability for 50 bands of 10 rows. Implement it in your own repository.
- [TensorTonic: Perform Stable Exact Deduplication and Build Deterministic MinHash Signatures](https://www.tensortonic.com/problems/cs336-l14-minhash-signatures) - `cs336-l14-stable-exact-deduplication` (https://www.tensortonic.com/problems/cs336-l14-stable-exact-deduplication) and `cs336-l14-minhash-signatures`. Both are free. The first normalizes with NFKC and case folding and keeps unequal texts apart even under a 1-bit hash. The second hashes with SHA-256 of a seed and shingle, so its signatures will not match datasketch's. The public cases check these edge cases only, so keep your own tests beside each solution.

**Stop when:** You pass the three A4 deduplication tests, you can compute the collision probability and threshold for any $`b`$ and $`r`$ without notes, and you know how to tell which variable counts bands in a source.

<details>
<summary>Self-test</summary>

1. A 128-hash signature is split as 16 bands of 8 rows, or as 8 bands of 16 rows. Which setup has the lower threshold, and what does the lower threshold cost?
   - 16 bands of 8 rows: its threshold is $`(1/16)^{1/8} \approx 0.707`$, against $`(1/8)^{1/16} \approx 0.878`$. The lower threshold raises recall and also produces more candidate pairs, so more exact checks and, if you skip them, more false positives.
2. With 10 bands of 10 rows, what is the chance that documents at $`s = 0.9`$ collide, and at $`s = 0.5`$?
   - At $`s = 0.9`$: $`1 - (1 - 0.9^{10})^{10} \approx 0.986`$. At $`s = 0.5`$: about 0.0097. That is small for one pair but not for a corpus: with a million documents there are about $`5 \times 10^{11}`$ pairs, so even rare collisions give many candidates to verify.
3. Two different documents hash to the same value in exact deduplication, here with a 1-bit hash. What must the algorithm do?
   - Treat the hash only as a bucket key and compare the normalized text inside the bucket, keeping both documents when the texts differ. Dropping on a hash match alone silently deletes distinct documents.
4. FineWeb's globally deduplicated data trained a model barely better than the undeduplicated data. Name one reason the paper gives.
   - Global deduplication removed most of the older snapshots, and the part it kept was worse text (more ads and keyword lists) than the part it removed. Removing duplicates also removes the many repeats of good pages, so what remains need not be better. Per-snapshot deduplication gave the improvement.

</details>

#### U6. Benchmark contamination checks, PII masking and harmful-content filtering with stored evidence

**About 5 h** · **Target:** Implement + Measure

Topics: Evaluation contamination checks with stored matches and adjudication; PII, toxicity and harmful-content detection with utility and coverage trade-offs

A contaminated benchmark makes a data intervention look better than it is, and a careless PII or harm filter removes useful text from the people the corpus was meant to serve. Both need a stored record of what matched, so that someone else can check the decision.

**You can now**

- Implement a train-versus-evaluation overlap check whose match unit, normalization and threshold you can justify for the evaluation task, and store each match with both ids and the matched span for review.
- Implement regex masks for emails, phone numbers and IPv4 addresses, review their false positives and false negatives on real text, and keep the evidence without keeping the personal data itself.
- Compare a word-list and a classifier harmful-content filter by what they remove, at which thresholds and from which groups, using a sampled audit with intervals.

**Study**

1. [CS336 Assignment 4 handout](https://github.com/stanford-cs336/assignment4-data/blob/0555bea66369872d912652debf10b115ca0688c8/cs336_assignment4_data.pdf) (CS336 Assignment 4 - Data) - Section 2.4, Personally identifiable information, with Problem (`mask_pii`) (pp. 5 to 6); Section 2.5, Harmful content, with Problem (`harmful_content`) (pp. 6 to 7); and the rule in Section 4 that validation text must not be copied into training data (p. 12).
2. [Gopher, Appendix A (Rae et al., 2021)](https://arxiv.org/abs/2112.11446v2) (Scaling Language Models: Methods, Analysis and Insights from Training Gopher, Appendix A) - Appendix A.1, 'Document Deduplication' and 'Test-set Filtering' (p. 41): 13-gram Jaccard above 0.8 between whole documents.
3. [Tulu 3 (Lambert et al., 2024)](https://arxiv.org/abs/2411.15124v5) (Tulu 3: Pushing Frontiers in Open Language Model Post-Training, Section 3.2) - Section 3.2 'Prompt Decontamination' (p. 14): why n-gram matching beat full-string and embedding matching, the 8-gram rule on prompts only, the 50% token-coverage test per instance, and the 2% rule per dataset.
4. [Documenting Large Webtext Corpora (Dodge et al., 2021)](https://arxiv.org/abs/2104.08758v2) (Documenting Large Webtext Corpora: A Case Study on the Colossal Clean Crawled Corpus (Dodge et al., 2021)) - Section 4.2 (benchmark contamination: input versus input-and-label) and Sections 5.1 to 5.3 (what the word-list blocklist removed, and from whom).
5. [Dolma (Soldaini et al., 2024)](https://arxiv.org/abs/2402.00159v2) (Dolma: an Open Corpus of Three Trillion Tokens for Language Model Pretraining Research (Soldaini et al., 2024)) - Section 5.3 'Content Filtering': the toxicity thresholds and what each removed, and the regex PII filter for emails, IP addresses and phone numbers.
6. [DataComp-LM (Li et al., 2024)](https://arxiv.org/abs/2406.11794v4) (DataComp for Language Models) - Section 4.6 'Decontamination' and Table 7. Depth: Optional. Read how the match is defined (the question text plus one answer option, and only the last sentence of long MMLU questions) and the authors' remark that this still gives many false positives.

**Focus**

- Contamination is overlap between one named evaluation set and your training text, and the unit of overlap depends on the task. A 13-gram test on whole documents cannot see a six-word question. Compare the designs: Gopher (whole-document 13-gram Jaccard), Tulu 3 (8-grams, prompts only, token coverage), DCLM (question plus an answer option).
- Use containment, not Jaccard, when a short item may sit inside a long page: Jaccard divides by the union and the page dominates it. Count the share of the item's tokens or n-grams found in the training text.
- A detector reports what it can see. Paraphrases and answer-only text have no shared n-grams with the question, and an item with fewer than n tokens cannot match at all. Report 'no verbatim overlap at n = 8', not 'clean', and review every match by hand.
- PII and harm filters are precision-recall trades. Dolma masks only emails, IP addresses and phone numbers because regexes find those with high precision; its two toxicity thresholds removed 5.5% to 7.3% of content or 29.1% to 34.9%. Dodge shows a word list removing text from and about minority groups at unequal rates, so report removal by slice.

**Reproduce:** Closed-book, write `coverage(test, train, n)` that returns the share of the test item's lowercase `\w+` tokens lying inside at least one n-gram that also occurs in the training text. Use n = 8 on `Maria has 12 apples and buys 15 more at the market. She gives 9 apples to her neighbour. How many apples does Maria have now?` against four training texts: the item inside a longer page, a copy with 12, 15 and 9 changed to 14, 17 and 11, a copy with `local` inserted before `market`, and a paraphrase. You should get 1.0, 0.44, 1.0 and 0.0. Say which of the four a rule 'more than 50% covered' flags, and what the numbers become at n = 4 (1.0, 0.68, 1.0, 0.0) and n = 13 (1.0, 0.0, 0.6, 0.0).

**Traps**

- Choosing the match unit from the dataset you have read about instead of from the evaluation items. With the Maria item inside a page of 200 filler sentences, 13-gram Jaccard is below 0.01 while containment is 1.0, so a Jaccard-above-0.8 rule would miss a verbatim copy; and an item of fewer than n tokens never matches any n-gram at all, so add an exact normalized full-string check.
- Reading zero matches as 'not contaminated'. The detector sees surface overlap only: the paraphrase scored 0.0 in the reproduce step, an answer-only passage shares no n-gram with its question, and the changed-number copy fell below the 50% rule at n = 8. State what the detector cannot establish, and review a sample of matches and of near-misses.
- Storing the evidence in a way that recreates the harm. An audit file of raw emails and phone numbers is itself a PII leak, so store the type, offsets, a keyed hash and a masked excerpt. Also keep the unmasked counts: a mask string such as `|||EMAIL_ADDRESS|||` can already occur in the text, and only real emails should be counted.

**Practice**

- [CS336 Assignment 4: PII masks and harmful-content classifiers](https://github.com/stanford-cs336/assignment4-data/blob/0555bea66369872d912652debf10b115ca0688c8/tests/test_pii.py) - Problems (`mask_pii`) and (`harmful_content`); connect `run_mask_emails`, `run_mask_phone_numbers`, `run_mask_ips`, `run_classify_nsfw` and `run_classify_toxic_speech` in `tests/adapters.py` and pass the five tests in `tests/test_pii.py` and the two in `tests/test_toxicity.py`. The toxicity tests are sanity checks on two Jigsaw examples, as the handout says; they do not validate the classifier. Do the review parts (e) and (d) on 20 masked or flagged documents each and report error rates with intervals. Implement it in your own repository.
- [CS336 Assignment 4: keep the validation text out of training](https://github.com/stanford-cs336/assignment4-data/blob/0555bea66369872d912652debf10b115ca0688c8/cs336_assignment4_data.pdf) - Section 4 (p. 12): you may use the validation data to build filters but must not copy any of it into training data. Write the check that proves it for your filtered set, with stored matches: n-gram containment of the validation tokens in your training tokens, the matched spans, and a decision after review. The section mini-project covers the audit on your own corpus and an evaluation set of your choice.

**Stop when:** Your mask and classifier code passes the seven tests, and for one evaluation set you have a stored table of overlap matches with the n, the rule, the reviewed decision and a statement of what the detector cannot see.

<details>
<summary>Self-test</summary>

1. A training page contains an evaluation question verbatim among 200 other sentences. Why does a 'Jaccard above 0.8 on 13-grams' rule miss it, and what would catch it?
   - The union of n-grams is dominated by the page, so the Jaccard similarity is tiny (below 0.01 for the Maria item in a 200-sentence page). The share of the question's n-grams that appear in the page, its containment, is 1.0 and would catch it.
2. An evaluation item has six words and you check 8-grams. What happens, and what do you do?
   - The item has no 8-grams, so it can never be flagged and the check passes silently. Add an exact match on the normalized full item, or a smaller n with manual review, for items shorter than n.
3. With n = 8, a copy of a math problem with three changed numbers has 44% token coverage. Does a 50% rule flag it, and does it matter?
   - No, it is just below the rule. It matters because the problem structure and its solution pattern are still in the training text. Use a lower coverage threshold or a number-masked comparison and review the matches; the right threshold depends on the item length and the number of edits.
4. Why does Dolma mask only emails, IP addresses and phone numbers?
   - Those can be matched with regular expressions at high precision and web-scale speed. Names and addresses need a model-based detector, which is slower and less precise. The cost is recall: anything the patterns miss stays in the data, so the card should say so.
5. A word-list filter removes 6.2% of one group's documents and 42% of another's, as estimated by a dialect model. What does an overall removal rate of, say, 8% hide?
   - It hides the unequal removal by group. The corpus would underrepresent the second group's text, which counts as a loss if that group is in the population stated in the corpus purpose. Report removal by slice and review a sample of removed text per slice.

</details>

#### U7. Tokenizer fertility, vocabulary disparities and multilingual and code audits

**About 4 h** · **Target:** Measure

Topics: Tokenizer fertility, vocabulary choice and language or domain disparities; Multilingual and code-corpus quality audits beyond English web text

Every token count in a training plan is an assumption about one tokenizer. If the tokenizer needs several times more tokens for one language, that language gets less content per context window and per training token, and no later step shows it unless you measured.

**You can now**

- Measure the tokenization premium of a tokenizer on parallel text for several languages, and report it with the corpus, split, tokenizer revision and sentence count.
- Choose a length measure that is comparable across languages and scripts, and explain why tokens per word and bytes per token are not.
- Turn a premium into a cost: the share of a context window or token budget that a language gets, and audit a code slice for the same effect.

**Study**

1. [Language Model Tokenizers Introduce Unfairness Between Languages (Petrov et al., 2023)](https://arxiv.org/abs/2305.15425v2) (Language Model Tokenizers Introduce Unfairness Between Languages (Petrov et al., 2023)) - Section 3 (parity and premium), Section 4.1 with Table 1 (English-centric tokenizers on FLORES-200) and Sections 5.1 to 5.3 (cost, latency and long-context consequences). Depth: Skip Section 6 on mitigations; they are proposals, not tested recipes.
2. [FLORES-200 parallel sentences](https://github.com/facebookresearch/flores/blob/main/flores200/README.md) (FLORES-200 parallel sentences) - The README for the dataset and its download link; use the `devtest` split (1,012 sentences per language, the same sentences in the same order for every language) with codes such as `eng_Latn`, `fra_Latn`, `hin_Deva` and `zho_Hans`.
3. [Project: Tokenizer and Corpus Pipeline](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/tokenizer-corpus-pipeline.md) (Tokenizer and Corpus Pipeline) - Milestone E (measurement) and the 'Measurement requirements': compression and fertility by slice, and the effect of vocabulary and packing on sequence length, embedding parameters and KV memory.

**Focus**

- Fertility is tokens per word, and it needs a definition of word. Whitespace splitting gives 13 tokens per 'word' for Chinese in the run below, so use parallel text: the same sentences in two languages, and the ratio of token counts (Petrov's premium).
- Bytes per token is not comparable across scripts, because an unaccented Latin letter takes 1 byte, a Cyrillic letter 2 and a Devanagari or Han character 3. Under the Qwen3 tokenizer Russian shows more bytes per token than English and still needs 1.75 times the tokens.
- The premium changes the budget. A fixed context window holds $`1/\text{premium}`$ of the content, a fixed training-token budget buys the same fraction, and a loss per token cannot be compared between tokenizers. Compare bits per byte of the same held-out text instead.
- FLORES-200 is translated encyclopedic and news text, so it measures that domain. Web text, code and your own domain differ, and a tokenizer trained on other languages falls back to bytes: GPT-2 averaged 1.00 bytes per token on Tamil and 1.03 on Shan in the run below.

**Reproduce:** Closed-book, for the 1,012 FLORES-200 `devtest` sentences of English, French, Hindi, Tamil, Thai and Simplified Chinese, encode each sentence with `encode(s, add_special_tokens=False)` and compute the premium as total tokens divided by the English total, for GPT-2 and for the Qwen3-0.6B tokenizer. In one run (transformers 5.19.0, tokenizers 0.23.3, `gpt2` revision 607a30d783dfa663caf39e06633721c8d4cfcd7e, `Qwen/Qwen3-0.6B` revision c1899de289a04d12100db370d81485cdf75e47ca) the premiums were, for GPT-2 then Qwen3: French 2.00 and 1.58, Hindi 7.41 and 4.42, Tamil 15.54 and 6.11, Thai 8.99 and 2.55, Chinese 3.15 and 1.00. Report your own table with the median of the per-sentence ratios beside each total.

**Traps**

- Reporting tokens per word for every language. In the same run Qwen3 gave 13.4 tokens per whitespace-separated unit for Chinese, 16.4 for Thai and 35.8 for Japanese, because those texts have few spaces. The number is a property of the splitter, not of the tokenizer.
- Comparing bytes per token across languages, or loss per token across tokenizers. Both change when the unit changes, so they can rank languages or models the wrong way round. Use token counts on parallel text for languages and bits per byte on a shared held-out set for models.
- Trusting the premium of one tokenizer for another or for another domain. The same sentences cost GPT-2 7.41 times the English tokens in Hindi and Qwen3 4.42 times. On one Python file (`tests/test_deduplication.py` from CS336 Assignment 4, 133 lines), GPT-2 gave 2.21 bytes per token and Qwen3 gave 4.81, against about 4.7 to 4.8 for the English `devtest` text in both.

**Practice**

- [Petrov et al. premium on FLORES-200 for your own tokenizer](https://github.com/facebookresearch/flores/blob/main/flores200/README.md) - The `devtest` split for English plus at least five other languages, including one non-Latin script and one language without spaces. Measure the premium for the tokenizer of your project and one other, add a Python file from your own repository as a code slice (bytes per token and the effect of collapsing indentation), and compare your GPT-2 numbers with Petrov Table 1. Their table uses the 2,000 sentences they describe, not only `devtest`, so expect differences of a few hundredths. The section mini-project reuses the table. Implement it in your own repository.

**Stop when:** You have a premium table for two tokenizers over at least six languages with the split, revisions and sentence count stated, and you can say what the table means for context length and for a token-budgeted mixture.

<details>
<summary>Self-test</summary>

1. A tokenizer has a premium of 4.42 for Hindi relative to English. What does that mean for a fixed 8,192-token context and for a fixed training-token budget?
   - The context holds about 1/4.42, or 23%, of the English content, and a budget split equally by tokens gives Hindi about 23% as much content as English. Both follow from counting in tokens.
2. Under one tokenizer, Russian shows 5.37 bytes per token and English 4.78, yet Russian needs 1.75 times the tokens for the same sentences. How?
   - A Cyrillic letter takes two UTF-8 bytes against one for a Latin letter, so each Russian token carries more bytes but fewer letters of content. Bytes per token is not normalized by content; the premium on parallel text is.
3. Why is 'tokens per word' a poor fertility measure for Chinese, Japanese and Thai?
   - Those scripts do not separate words with spaces, so a whitespace 'word' is a whole clause and the ratio is about the splitter. Use tokens per character, or the ratio of token counts on parallel text.
4. A model with a larger vocabulary reports a lower per-token validation loss than a baseline. Can you say it models the text better?
   - No. The two models split the same text into different numbers of tokens, so the losses average over different units. Convert both to bits per byte (or per character) on the same held-out text, then compare.

</details>

#### U8. Document packing, boundary tokens and cross-document attention leakage

**About 3 h** · **Target:** Implement

Topics: Document packing, boundary tokens, causal masks and cross-document leakage

Packing is how short documents fill a fixed context. With a plain causal mask a later document can read an earlier, unrelated one, so the model trains on contexts that never occur at inference, and nothing in the loss tells you.

**You can now**

- Pack tokenized documents into fixed-length sequences with an end-of-document token, a stated truncation and tail rule, and a record of the document id and offsets of every span.
- Build the intra-document causal mask and the loss mask from per-token document ids, and test that changing one document leaves another document's logits unchanged.
- State what packing and masking change in the training signal, and what they cost, using the evidence in the packing paper and your own test.

**Study**

1. [Analyzing the Impact of Sequence Composition on Language Model Pre-Training (Zhao et al., 2024)](https://arxiv.org/abs/2402.13991v1) (Analysing the Impact of Sequence Composition on Language Model Pre-Training (Zhao et al., 2024)) - Section 2.1 (packing: random, same-source and retrieval-based), Section 2.2 (causal versus intra-document causal masking), Table 1 (perplexity per packing and masking strategy) and Appendix A (the FlashAttention-2 implementation and its cost). Depth: Stop after Table 1 and Appendix A. The downstream-task sections measure in-context learning and memorization, which this unit does not need.
2. [Gopher, Appendix A (Rae et al., 2021)](https://arxiv.org/abs/2112.11446v2) (Scaling Language Models: Methods, Analysis and Insights from Training Gopher, Appendix A) - Appendix A.1.2 'Constructing Token Sequences' (p. 42): cropping, BOS and EOS, concatenating crops, splitting at the sequence length, dropping the short final chunk.
3. [Modern LLM Notebook: Data Engineering](https://github.com/walkinglabs/modern-llm-notebook/blob/979eecf09669121167184ef925d8edbc089fc13e/notebooks-en/part2-training/15-data-engineering.ipynb) (Modern LLM Notebook - Data Engineering) - Section 8 'From Tokenize to Training Stream', 8.1 'Sequence Packing' (the first-fit-decreasing cell) and 8.2 'Block-Diagonal Attention Mask' (the mask cell). Depth: Skip 8.3 on fill-in-the-middle. The notebook says position ids must restart for every document; with rotary positions they need not, as the reproduce step shows.

**Focus**

- Two masks, two jobs. The attention mask says which earlier tokens a position may read; the loss mask says which positions have a valid target. The position that holds an end-of-document token predicts the first token of the next document, which its own document cannot predict. Pipelines differ here: the Assignment 5 supplement trains on every packed position, others mask that one, so choose and record it. Padding positions are always masked.
- With a plain causal mask a token in the second document attends to the first. Zhao et al. train 1.3B models on the same 150B tokens with and without intra-document masking, and the masked model has the lowest average perplexity: 8.410 against 9.172 at 2K context and 8.079 against 9.065 at 8K (Table 1).
- With rotary position embeddings the attention score depends only on the offset between two positions, so a document's logits are the same whether its positions start at 0 or at its offset in the sequence, up to floating-point error. Zhao et al. apply rotary embeddings before the variable-length attention call and do not reset positions. With learned absolute positions you must reset them.
- Decide the tail and truncation rules and record them: Gopher drops the final short chunk, and a document longer than the context is split. A document continued in the next sequence has lost its beginning, so keep each span's `doc_id`, start and end offsets.

**Reproduce:** Closed-book, build a 2-layer decoder with rotary positions (model width 32, 4 heads, a 50-token vocabulary, `torch.manual_seed(0)`) and pack document A (6 tokens), an end token, document B (5 tokens) and an end token. Build a plain causal mask and an intra-document mask from per-token document ids (the end token belongs to the document it closes). Show that replacing A changes B's logits under the causal mask (max absolute difference about 0.4 in the run, PyTorch 2.14.1 on CPU) and changes nothing under the intra-document mask (0.0). Then show that B's logits from the packed intra-document run match B run alone with `torch.allclose(a, b, atol=1e-5)`, while `torch.equal` is `False` (max absolute difference 3.6e-07), and that resetting positions per document changes them by at most about 2e-07.

**Traps**

- Testing equality with `==` or `torch.equal`. A packed batch and a single document run different matrix shapes, so the results differ in the last bits; assert closeness with a tolerance, and assert exact zero only for the case where one document's tokens are replaced inside the same packed run.
- Building the attention mask and forgetting the loss mask, so that padding tokens count in the loss denominator, or the end-token position is trained on the next document's first token when your design meant to mask it.
- Treating a continued document as a new one. When a long document is split across two sequences, the second part starts mid-document with no left context; mark it as a continuation in the span record so that later counts of documents and tokens stay correct.

**Practice**

- [CS336 Assignment 5 supplement: Problem (`data_loading`)](https://github.com/stanford-cs336/assignment5-alignment/blob/c2734a26308710949fe13226960a1e8cece94b7e/tests/test_data.py) - Supplement Section 4.2.1 (pp. 9 to 10); connect `get_packed_sft_dataset` and `run_iterate_batches` in `tests/adapters.py` and pass `test_packed_sft_dataset` and `test_iterate_batches` in `tests/test_data.py`. The tests run on CPU with a tokenizer stored in the repository. They check the stored tokenization of a small file, the constant sequence length, the dropped tail chunk and the batch shapes. They do not test attention leakage, so add the swap test from the reproduce step beside your solution. The section mini-project covers the packed-batch test on your own corpus. Do not publish solutions.

**Stop when:** Your packing code passes the two data tests, the span record lets you read off the document and offsets of any token, and your swap test shows exact independence under the intra-document mask and dependence under the plain one.

<details>
<summary>Self-test</summary>

1. Two documents are packed in one sequence with a plain causal mask. Does changing the first document's tokens change the loss on the second? Which mask removes the effect?
   - Yes: every token of the second document can attend to the first, so its hidden states depend on it. A block-diagonal causal mask built from the document ids removes the dependence, which the swap test above checks.
2. Should the loss at the position holding the end token be kept in packed pretraining?
   - It is a design choice to record. Its target is the first token of the next document, which the current document cannot predict, so under an intra-document mask that position can only learn how documents tend to begin. Many pipelines keep it (the Assignment 5 supplement trains on every position) and others mask it. If you mask it, the model still learns to emit the end token, because that is the target at the previous position, whose loss is kept.
3. Why do the logits of a document not change when its rotary positions start at an offset instead of 0?
   - The rotary score of a query and key depends only on the difference of their positions, which is unchanged by a common offset, so within one document the attention scores are the same up to rounding. A learned absolute embedding depends on the position itself, so there the offset matters.
4. Zhao et al. report intra-document masking lowers perplexity at both context lengths. What does that not show?
   - It shows this effect for 1.3B models on 150B tokens of one corpus (SlimPajama), measured on documents scored one at a time. It does not show the size of the effect for other models or data, nor that the masking is free: they measured a 4% slowdown with FlashAttention-2, and much larger ones with an explicit mask.

</details>

#### U9. Mixture weights, temperature sampling, repetition and effective tokens

**About 5 h** · **Target:** Derive + Implement

Topics: Source mixture weights, temperature sampling and realized-token accounting; Curriculum order, repetition, synthetic data and effective data diversity; Raw tokens, effective tokens, data epochs and small-source oversampling

The mixture decides how often each source is read, and small high-quality sources are the ones that get repeated. A recipe written in documents, or tuned at a small budget, can give a different realized composition and a very different number of epochs than the one you meant.

**You can now**

- Derive the sampling probability $`p_i = n_i^{\alpha} / \sum_j n_j^{\alpha}`$, the expected tokens $`T p_i`$ and the expected epochs $`T p_i / n_i`$ of each source, and show how the exponent moves a small source between a fraction of an epoch and dozens of epochs.
- Implement a mixture sampler that works in tokens, caps the epochs of each source, and checks the realized token shares against the targets.
- Separate raw tokens, processed tokens and effective tokens, convert epochs to effective tokens with a fitted repetition curve, and state where that curve does not apply.

**Study**

1. [CS336 2026 Lecture 14: Data II (executable trace)](https://cs336.stanford.edu/lectures/?trace=lecture_14) (CS336 2026 - Data Lectures 13 and 14) - The `data_mixing` step: the mixture baselines, the 50-epoch example for a scarce source, UniMax, regression-based mixing, the scale-dependent effect and simulated epoching; then the summary of `post_training_data` for synthetic data. Depth: Read RegMix as a method name only; fitting mixtures belongs to the scaling section.
2. [Scaling Data-Constrained Language Models (Muennighoff et al., 2023)](https://arxiv.org/abs/2305.16264v5) (Scaling Data-Constrained Language Models (Muennighoff et al., 2023)) - Section 3 and Section 3.1 (unique tokens, repetitions and the effective-data term of Equation 5), Section 6 with Figure 1 (return on compute when repeating), and Appendix A (the derivation and the fitted $`R_D^{*}`$, Equation 17). Depth: Skip the allocation experiments of Section 5 and the code-augmentation results; read the abstract's claim about up to four epochs as that paper's result for its models and data.
3. [Modern LLM Notebook: Data Engineering](https://github.com/walkinglabs/modern-llm-notebook/blob/979eecf09669121167184ef925d8edbc089fc13e/notebooks-en/part2-training/15-data-engineering.ipynb) (Modern LLM Notebook - Data Engineering) - Section 4 'Data Mixing', 4.1 (the source table with epochs) and 4.2 (recipes A, B and C), then Exercise 3. Depth: The 'Effective' column there is raw tokens times epochs, that is tokens processed, which is not the effective data of Muennighoff et al. The scores in 4.2 are labeled teaching simulations, not measurements.
4. [Gopher, Appendix A (Rae et al., 2021)](https://arxiv.org/abs/2112.11446v2) (Scaling Language Models: Methods, Analysis and Insights from Training Gopher, Appendix A) - Appendix A.1.2 step 6: sequences are drawn from the subsets according to fixed weights.

**Focus**

- State weights in tokens of one named tokenizer. Sampling documents 50/50 from a source of 100-token documents and one of 1,000-token documents gives a token share of 9.1% and 90.9%, not 50/50.
- The exponent $`\alpha`$ interpolates: $`\alpha = 1`$ is proportional to size, $`\alpha = 0`$ is uniform. With a 1T-token budget, a 10T-token source and a 10B-token source, uniform sampling reads the large one for 0.05 epochs and the small one for 50 epochs, which the lecture flags as overfitting risk.
- Repetition is not free and not worthless. Muennighoff et al. model effective data as $`D' = U_D + U_D R_D^{*} (1 - e^{-R_D / R_D^{*}})`$ where $`U_D`$ is the unique tokens and $`R_D`$ the number of repeats; with their fitted $`R_D^{*} \approx 15.4`$ each token of a 4-epoch run is worth about 0.93 of a fresh one, and of a 40-epoch run about 0.38. That is a fit to their models, data and setup.
- A mixture that is best for a small run is not best for a large one, because epochs scale with the budget. Cap epochs per source (UniMax) or simulate the large run's epochs at small scale. Treat synthetic text as its own source with a recorded generator, and sample it under the same cap.

**Reproduce:** Derive the expected epochs of source $`i`$ as $`T p_i / n_i`$. Then, for $`n = (10^{13}, 10^{10})`$ tokens and $`T = 10^{12}`$, compute $`p`$ and the epochs for $`\alpha = 1`$, $`0.5`$ and $`0`$. Expect $`p = (0.999, 0.001)`$ with 0.1 epochs each; $`p = (0.969, 0.031)`$ with epochs (0.097, 3.07); and $`p = (0.5, 0.5)`$ with epochs (0.05, 50). Then cap each source at 4 epochs by giving the small source 4 epochs ($`4 \times 10^{10}`$ tokens, $`p = 0.04`$) and the rest to the large one, and compute $`D'/U_D`$ for 4 epochs with $`R_D^{*} = 15.39`$, which is 3.73.

**Traps**

- Reading 'effective tokens' the same way in every source. In the notebook it means raw tokens times epochs; in Muennighoff et al. it means tokens counted by value, which is less than the tokens processed once data repeats. Write which one you mean in every table.
- Treating the four-epoch result as a safe rule. It came from fixed-compute runs of models up to 9B parameters on subsets of C4 (with a check on OSCAR in an appendix), and the fitted curve says each repeated token is already worth a bit less. Check it for your model size and data, and check that filtering did not make your small source even smaller.
- Tuning weights on a small run and applying them at scale. A weight of 0.9 on a 10B-token source is 0.9 epochs at a 10B-token budget and 90 epochs at 1T, so the small-run optimum silently becomes an overfitting recipe.

**Practice**

- [TensorTonic: Compute Temperature-Based Data Mixtures](https://www.tensortonic.com/problems/cs336-l14-temperature-data-mixture) - `cs336-l14-temperature-data-mixture`: `temperature_data_mixture(token_counts, alpha, training_budget)` returning probabilities, expected tokens and expected epochs. Free. The public cases check the proportional case, the uniform case with sizes 1 and 100, and a zero-size source that must receive zero for all three values. They do not test caps. Write your own tests for an epoch cap and for realized shares of a sampler beside the solution. The section mini-project covers the sampler and its realized-share table.

**Stop when:** You can derive the sampling probabilities and expected epochs without notes, your sampler's realized token shares match the targets within the sampling error you expect, and your tables say whether each 'effective' count is tokens processed or tokens by value.

<details>
<summary>Self-test</summary>

1. Two sources have 100 and 400 tokens, the budget is 1,000 tokens, and $`\alpha = 1`$. What are the probabilities, tokens and epochs? What changes at $`\alpha = 0`$?
   - $`p = (0.2, 0.8)`$, tokens (200, 800), epochs (2, 2). At $`\alpha = 0`$, $`p = (0.5, 0.5)`$, tokens (500, 500) and epochs (5, 1.25): the small source is repeated four times more often than the large one.
2. Source A has 1,000 documents of 100 tokens and source B has 1,000 documents of 1,000 tokens. You sample documents with probability 0.5 each. What are the token shares?
   - A gets $`0.5 \times 100 = 50`$ and B gets $`0.5 \times 1000 = 500`$ tokens per draw, so the shares are 9.1% and 90.9%. To get 50/50 in tokens, weight by tokens or sample so that the expected token counts match.
3. Using the fitted repetition curve, what share of the processed tokens of a source repeated for 40 epochs counts as effective?
   - About 38%: $`D'/U_D = 1 + 15.39 (1 - e^{-39/15.39}) \approx 15.2`$ against 40 tokens processed per unique token. The curve flattens at $`1 + R_D^{*} \approx 16.4`$ unique-token equivalents, so more epochs add almost nothing.
4. A small run finds the best weight for a scarce source is 0.9. Why might that fail at 100 times the tokens?
   - Epochs of the source scale with the budget, so 100 times more tokens means 100 times more epochs over the same source. What was a good weight at 0.9 epochs becomes about 90 epochs of repetition, past the point where repeats help.

</details>

#### U10. Deterministic shards, restart position and document-to-batch lineage

**About 5 h** · **Target:** Implement

Topics: Deterministic shards, shuffle state, worker ownership and restart position; Lineage from raw document through every transform to a concrete training batch

A run that cannot be resumed exactly, or a batch that cannot be traced to its documents, turns every later question (a loss spike, a deletion request, a contamination finding) into guesswork. Deterministic data order is also what lets a second person reproduce your result.

**You can now**

- Implement shard assignment and batch order as pure functions of the dataset version, seed, epoch and step, with a manifest that lists every shard and its checksum, so that any batch can be regenerated without replaying earlier steps.
- Resume from a saved position and show that the remaining batches, and the documents in them, equal those of an uninterrupted run; find the omitted or repeated documents when a framework loses part of the state.
- Keep a lineage index from batch to sequence to document spans to raw record ids, and use it to answer which documents were in step $`k`$ and which steps saw document $`d`$.

**Study**

1. [Project: Tokenizer and Corpus Pipeline](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/tokenizer-corpus-pipeline.md) (Tokenizer and Corpus Pipeline) - 'Core requirements' and 'Architecture constraints' (a manifest, never directory-order discovery), Milestone C, the failure injections of Milestone D, and 'Correctness requirements' (complete, nonoverlapping, checksummed, atomically published shards). Depth: Take the sharding, resume and lineage requirements only; the tokenizer parts belong to earlier units.
2. [Hugging Face Datasets: Stream](https://huggingface.co/docs/datasets/stream) (Hugging Face Datasets: Stream) - Sections 'Shard', 'Shuffle', 'Interleave', and 'Save a dataset checkpoint and resume iteration', including its tip on shuffle buffers (page read 2026-10-17, behavior re-run with datasets 5.1.0). Depth: Use a tiny local dataset. Do not stream a web-scale corpus or push anything to the Hub.
3. [Dolma Toolkit: data format](https://github.com/allenai/dolma/blob/669f534823b08d266a8fff01f8a1c916a5a56576/docs/data-format.md) (Dolma Toolkit) - 'Dolma Document Format' (the `source` and `id` pair) and 'Dolma Toolkit Attributes Format' (attribute files that line up row for row with the documents); and in https://github.com/allenai/dolma/blob/669f534823b08d266a8fff01f8a1c916a5a56576/docs/taggers.md the `random_number_v1` tagger for split assignment.
4. [Gopher, Appendix A (Rae et al., 2021)](https://arxiv.org/abs/2112.11446v2) (Scaling Language Models: Methods, Analysis and Insights from Training Gopher, Appendix A) - Appendix A.1.2 'Constructing Token Sequences' (p. 42), steps 1 to 7 from drawing a document to shuffling and batching.

**Focus**

- Make position a value, not a hidden state. If the order of epoch $`e`$ is a function of the seed and $`e`$ alone, for example `np.random.Generator(np.random.PCG64([seed, epoch])).permutation(n)`, then batch $`k`$ is the slice $`[kB, (k+1)B)`$ of it and a resume needs only the epoch and step. A single random generator shared across epochs needs replaying to reach epoch 2.
- Shard by a stable hash of the document id and list the result in the manifest. Python's built-in `hash` of a string differs between processes, and changing the shard count moves most documents, so a shard is a manifest entry and not a directory listing.
- Resume has to give each record exactly once. The documented tip says that with `.shuffle()` the examples in the shuffle buffer are lost on resume; the reproduce step measures how many.
- Lineage is a join. Keep one record per packed sequence with its `(doc_id, start, end)` spans, join on the stable `source` and `id` pair, and build the inverse index from document to steps so that a deletion or contamination finding can name the batches and checkpoints affected.

**Reproduce:** From a blank file, write `batch(version, seed, epoch, step)` that returns the `(doc_id, start, end)` spans of that batch, taking the order of sequences from `np.random.Generator(np.random.PCG64([seed, epoch])).permutation(n_sequences)`. Show that a run resumed at step 61 reproduces steps 61 onward of an uninterrupted run exactly (1,003 sequences, batch size 8, 125 steps, 3 sequences unused per epoch). Assign documents `doc-000000` to `doc-019999` to shards with the first eight bytes of a SHA-256 digest modulo $`K`$, and show that only 20.0% keep their shard when $`K`$ goes from 4 to 5. Then break it twice: use the built-in `hash` and see the assignment change between fresh processes (in one run `hash('doc-000001') % 4` gave 3, 0, 1, 3, 0, 3 over six processes), and resume a shuffled Hugging Face `IterableDataset`.

**Traps**

- Losing records on resume while the loss looks fine. With datasets 5.1.0, a dataset of 40 rows in 4 shards, `shuffle(seed=7, buffer_size=8)` and an interruption after 13 rows, the resumed run skipped 5 rows and repeated 1. Only a comparison of document ids with an uninterrupted run shows it.
- Letting worker count change the data. If every worker shuffles its own shards, the content of batch $`k`$ depends on the number of workers and a rerun on other hardware gives different batches. Define batch content globally and let workers only fetch.
- Forgetting the unused tail. A partial last batch that is dropped means some sequences are not seen in that epoch, and with a new permutation each epoch it is a different set each time. Write the dropped sequence ids into the lineage record, or you cannot say that every document was seen.

**Practice**

- [Hugging Face Datasets: checkpoint and resume an iterable dataset](https://huggingface.co/docs/datasets/stream) - 'Save a dataset checkpoint and resume iteration': reproduce the documented example, then repeat it after `.shuffle(seed=7, buffer_size=8)` on 40 rows in 4 shards. Count the rows missing and repeated against an uninterrupted run, then replace the shuffle with the order function from the reproduce step and show the counts go to zero. The section mini-project covers the batch-lineage index and the regenerate-any-batch test on your own corpus.

**Stop when:** Given a dataset version, seed, epoch and step, your code regenerates the same batch of token ids in two separate processes and after a simulated interruption, and your lineage index answers both the batch-to-documents and document-to-batches questions.

<details>
<summary>Self-test</summary>

1. Why does computing the epoch order from `(seed, epoch)` make resuming cheap, while one generator shared across epochs does not?
   - The permutation of any epoch can be recomputed directly, so a resume needs only the epoch and step. With one shared generator, the state at epoch 2 exists only after the earlier permutations have consumed it, so you must either store the generator state or replay the epochs, and a fresh generator gives a different permutation.
2. Documents are assigned to shards by a hash modulo $`K`$. You change $`K`$ from 4 to 5. What happens, and what does it mean for lineage?
   - About four in five documents move to another shard (20.0% stayed in the run above). Any record that names a shard becomes wrong, so lineage should refer to document ids and the manifest version, and a change of shard count must create a new dataset version.
3. The loss jumps after a resume. Name three data-side causes you can check from lineage.
   - The shuffle buffer or other loader state was lost, so records are missing or repeated; the epoch, seed or worker count differs, so the order changed; or the dataset version or tail handling differs. Compare the document ids of steps $`k`$ to $`k+m`$ of the resumed run with those of an uninterrupted run.
4. A document must be removed. How do you find which batches and checkpoints are affected?
   - Invert the lineage: document id to the sequences that contain its spans, to the (epoch, step) of each such sequence, to the first checkpoint saved after the earliest of those steps. The index must keep the dropped-tail sequences too, or you will miss documents that were never trained on.

</details>

#### U11. Immutable dataset versions, manifests, data cards and checkpoint linkage

**About 3 h** · **Target:** Implement

Topics: Immutable dataset versions, manifests, data cards and checkpoint linkage

A model result is only attributable to a data intervention if you can say which data it saw. The manifest makes that statement checkable, and the card makes the choices behind it readable by someone who was not there.

**You can now**

- Build an immutable dataset version: a manifest of files with sizes and checksums, the configuration and code commit, and a version id computed from content, so that changing one byte changes the id and rewriting the same bytes does not.
- Write a data card for your filtered corpus from a template: purpose, sources and rights, transformations with per-stage counts, known gaps, contamination and PII findings, and intended and out-of-scope uses.
- Link a checkpoint to the dataset version, tokenizer and sampler seed, and make resume and evaluation refuse a mismatch.

**Study**

1. [Data Cards Playbook (Google PAIR)](https://sites.research.google/datacardsplaybook/guide/) (Data Cards Playbook) - User Guide steps 3 to 6 ('Collect your documents', 'Build up from the Data Card design', 'Collaboratively review and expand your content', 'Final Checks') and step 8 (revisit the card about every six months); then the extended template at https://github.com/PAIR-code/datacardsplaybook/blob/main/templates/DataCardsExtendedTemplate.md, sections 'Motivations & Intentions', 'Access, Rentention, & Wipeout', 'Provenance', 'Human and Other Sensitive Attributes', 'Transformations', 'Sampling Methods' and 'Known Applications & Benchmarks'. Depth: Skip the activities, patterns and labs pages; you need the guide and the template.
2. [Dolma (Soldaini et al., 2024)](https://arxiv.org/abs/2402.00159v2) (Dolma: an Open Corpus of Three Trillion Tokens for Language Model Pretraining Research (Soldaini et al., 2024)) - Table 1 (the corpus at a glance; its caption names the tokenizer used for the token counts) and Appendix N, the Datasheet.
3. [Gopher, Appendix A (Rae et al., 2021)](https://arxiv.org/abs/2112.11446v2) (Scaling Language Models: Methods, Analysis and Insights from Training Gopher, Appendix A) - Appendix A.5 'MassiveText Datasheet' (Table A3), which follows the datasheet framework of Gebru et al.
4. [Dolma Toolkit: data format](https://github.com/allenai/dolma/blob/669f534823b08d266a8fff01f8a1c916a5a56576/docs/data-format.md) (Dolma Toolkit) - 'Directory Structure' (documents and attributes per dataset) and the `id` field: 'Document 12345 in `raw` is the same as Document 12345 in `v0`, `v1`'.
5. [Project: Tokenizer and Corpus Pipeline](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/tokenizer-corpus-pipeline.md) (Tokenizer and Corpus Pipeline) - Milestone F (delete the derived artifacts and regenerate identical manifests and checksums from the raw inputs and the configuration) and the 'Design-defense questions'.

**Focus**

- A version is its content, not its name or its date. Hash every file, sort the entries, include the configuration that produced the files, and hash that list; reordering or touching files then changes nothing, and one changed byte does.
- Derived data is regenerated, not trusted. Record the raw input versions, the code commit, the filter and tokenizer versions and the seeds, then check that deleting the derived files and rebuilding gives the same manifest.
- The card states purpose, sources and rights, transformations with removal rates per stage, sampling and mixture, known gaps, contamination and PII findings, and uses to avoid. Every number belongs to a named tokenizer and a dataset version.
- A checkpoint stores the dataset version, the tokenizer identity and the loader position. Resume and evaluation compare them with the manifest and fail loudly when they differ.

**Reproduce:** Closed-book, write `build_manifest(root, config)` that returns a version id: the SHA-256 of a sorted list of `[relative_path, size, file_sha256]` entries together with the configuration, serialized with sorted keys. In a small test show that a copy written in another order with other modification times has the same id, that changing one byte of one file changes it, and that changing `seed` in the configuration changes it. Then write a `verify(manifest, root)` that recomputes it, and a `resume(checkpoint, manifest)` that raises when the checkpoint's `data_version` differs.

**Traps**

- Versioning by directory name or date. `data_v3` says nothing about its bytes, and two runs with that label can differ. Name the version by the content hash and keep the label as a convenience.
- Leaving out the pieces that change the result: the tokenizer revision, the filter thresholds, the sampler seed and the contamination reference sets. A manifest of files alone cannot tell you why two corpora from the same files trained differently.
- Writing the card once, at release. Counts go stale when a stage is rerun, and the card must quote the dataset version it describes. Regenerate the numbers from the manifest and the stage logs instead of typing them.

**Practice**

- [Data Cards Playbook: write the card for your filtered corpus](https://github.com/PAIR-code/datacardsplaybook/blob/main/templates/DataCardsExtendedTemplate.md) - The extended template, filled in for the corpus from this section. Quote counts from your stage logs for each filter, the language table, the duplicate clusters and the contamination and PII findings, and mark each unknown. The section mini-project covers the manifest, the card and the checkpoint link for your own corpus. Implement it in your own repository.

**Stop when:** Deleting your derived files and rebuilding gives the same version id, your card quotes that id and its numbers come from the logs, and a checkpoint with another data version is refused.

<details>
<summary>Self-test</summary>

1. Why does the version id hash the sorted list of file entries rather than the modification times or the archive of the files?
   - Modification times and archive layout change when the same bytes are rewritten, which would give a new version for identical data. Sorted path, size and content hash depend only on the data, so the id is stable across copies and changes when any byte changes.
2. Two corpora were built from identical raw files and trained different models. Which manifest fields would you compare first?
   - The configuration and code commit: filter thresholds, language-ID and quality-model versions, the tokenizer revision, the mixture weights and the seeds. Identical inputs with different processing parameters give different corpora.
3. A token count in a card says 3 billion. What else must the card state for that number to mean anything?
   - The tokenizer and its revision, and the dataset version. Token counts depend on the tokenizer: the same text has a different count under another one, as the premium measurements showed.
4. What should happen when you try to evaluate a checkpoint whose recorded dataset version differs from the one in your manifest?
   - The run should stop with an error that names both versions, not continue with a warning. A silent mismatch makes every later comparison about different data.

</details>

### Mini-project: Versioned corpus with replayable token exposure

**About 16 to 22 hours.** Create `lmlab`, the Python and PyTorch repository for your versioned language-model study. Build a bounded corpus pipeline whose filtering decisions, tokenizer costs and training batches can be independently audited on your machine, using pinned libraries from the units and no paid API.

1. Create `lmlab`: `data/` (corpus/tokenizer/shards), `model/` (decoders), `train/` (training/recovery), `scaling/` (fits), `eval/` (tasks/graders), `adapt/` (SFT/distillation), `pref/` (preferences), `rl/` (rollouts/updates), `mm/` (image-text), `safety/` (attacks/release), `registry/` (run manifests), `tests/` and `reports/` (evidence). Choose a bounded behavior question; retain a source-rights ledger checked against acquisition records.
2. Build a record-preserving WARC iterator and extraction, language and quality stages in `data/`. Pass CS336 Assignment 4 extraction, language-ID and quality tests; reuse your language-retention table and hand-label extraction losses and per-rule false positives by slice, retaining intervals and normalization decisions.
3. Deduplicate with collision-safe exact matching and MinHash candidates verified by exact Jaccard. Audit evaluation containment, PII masking and word-list versus classifier harm decisions against planted controls and hand labels; retain clusters, reviewed spans, masked evidence, slice intervals and detector blind spots.
4. Version the project tokenizer and reuse your FLORES-200 premium table against another tokenizer, checking sentence alignment and totals independently. Add your repository's code slice and indentation perturbation; retain revisions, language-ID retention, fertility and context-budget consequences without comparing cross-tokenizer token losses.
5. Build packing masks and a token-weighted, epoch-capped mixture sampler. Check packed logits against separate-document execution, document swaps and position offsets; compare realized shares with analytical expectations. Retain boundary, truncation and tail rules, valid-target counts, unique and processed exposure, and assumption-labeled effective-token estimates.
6. Publish checksummed shards and content-addressed manifests with a bidirectional batch-lineage index. Regenerate arbitrary batches in fresh processes and compare resumed order against uninterrupted iteration; inject corruption and data/tokenizer mismatches. Retain dropped tails, refusal tests and checkpoint links to data, tokenizer and sampler identity.
7. Gate your small LLM Foundations decoder on frozen-batch loss, gradient, mask and analytical parameter/FLOP-count oracles before matched-token, equally tuned filtered-versus-unfiltered comparisons across paired seeds. Keep held-out outcomes and failed attempts; regenerate artifacts and a Data Cards Playbook card from raw inputs and stage logs.

**Deliverables**

- The `data/` pipeline, tokenizer, checksummed shards and batch-lineage index with independent regression tests.
- Source-rights ledger, filter and contamination audits, tokenizer tables and a version-bound data card.
- Matched filtering comparison with held-out records, all-attempt manifests and a clean regeneration transcript.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [CS336 Assignment 4 extraction tests](https://github.com/stanford-cs336/assignment4-data/blob/0555bea66369872d912652debf10b115ca0688c8/tests/test_extract.py). Pass the extraction fixture; add record-boundary and hand-reviewed main-content checks.
- external-tests: [CS336 Assignment 4 language identification tests](https://github.com/stanford-cs336/assignment4-data/blob/0555bea66369872d912652debf10b115ca0688c8/tests/test_langid.py). Pass label checks; retain your own per-language threshold and normalization audit.
- external-tests: [CS336 Assignment 4 quality tests](https://github.com/stanford-cs336/assignment4-data/blob/0555bea66369872d912652debf10b115ca0688c8/tests/test_quality.py). Pass rule and classifier fixtures; they do not establish quality or false-positive rates.
- external-tests: [FLORES-200 parallel-sentence audit](https://github.com/facebookresearch/flores/blob/main/flores200/README.md). Use aligned sentences as the comparison reference; preserve split, tokenizer revisions and counting checks.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Corpus decisions | Hand labels and planted controls check pipeline decisions; rights unknowns and masked evidence remain visible. Filtering comparisons follow frozen-batch oracles, matched budgets and paired seeds, preserving held-out outcomes and failed attempts. | A matched unique-data control separates filtering from scarcity; a reviewed near-miss changes a decision and becomes a privacy-preserving regression. |
| Token exposure correctness | Your separate-document and perturbation oracles check attention and loss boundaries; analytical shares check the capped sampler. Tokenizer audits distinguish processed, unique and assumed effective tokens. | A document-weighted sampler and a leaking mask each fail targeted regressions before their repairs pass. |
| Lineage and regeneration | Fresh-process replay and interrupted-order tests match batch identities; content tampering and identity mismatches fail. Raw-input regeneration reproduces manifests, and checkpoints resolve to source spans. | A deletion request identifies affected batches and checkpoints, while a metadata-only rewrite preserves content identity. |

Feeds into: Corpus, tokenizer, packing contracts and batch lineage feed Architecture and Numerics, Pretraining Reliability, scaling and contamination evaluation; immutable identities and regeneration evidence become the capstone baseline package.

### Resource route

- **Primary - Assignment:** [CS336 Assignment 4 - Data](https://github.com/stanford-cs336/assignment4-data) - Implement the handout functions in Sections 2.2 to 2.7 (`extract_text`, `language_identification`, the PII masks, the harmful-content classifiers, `gopher_quality_filter`, `classify_quality`) and Section 3 (`exact_deduplication`, `minhash_deduplication`) until the 21 tests in `tests/` pass on CPU. The 8-GPU leaderboard run is out of reach: replace it with one small local training comparison on a filtered sample and keep the retained-token and source-mix tables as evidence.
- **Required - Course:** [CS336 2026 - Data Lectures 13 and 14](https://cs336.stanford.edu/lectures/?trace=lecture_14) - Step through the Lecture 13 trace (sources: WebText, Common Crawl, CCNet, C4, The Pile, MassiveText, RefinedWeb, Dolma, DCLM, Nemotron-CC, copyright) and the Lecture 14 trace (KenLM and fastText filters, importance resampling, Bloom filters, MinHash and LSH) at `cs336.stanford.edu/lectures/?trace=lecture_13` and `?trace=lecture_14`. Reconcile each lecture claim with your Assignment 4 implementation.
- **Required - Paper:** [Deduplicating Training Data Makes Language Models Better (Lee et al., 2022)](https://arxiv.org/abs/2107.06499) - Read Section 4 (exact substring matching with suffix arrays, 50-token threshold justified in Appendix B, and MinHash near-duplicate removal) Section 5 (how much each dataset loses, including train-test overlap) and Section 6 (effects on perplexity and memorization). This is the method behind Assignment 4 Section 3; the 50-token threshold is tuned to English web text.
- **Support - Paper:** [Scaling Language Models: Methods, Analysis and Insights from Training Gopher, Appendix A](https://arxiv.org/abs/2112.11446) - Read Appendix A.1 for the exact quality rules behind "Gopher-style" filters (50 to 100,000 words, mean word length 3 to 10, symbol ratios, bullet and ellipsis lines, the stop-word test) and A.5 for the datasheet. The rules are English-specific.
- **Required - Implementation:** [Dolma Toolkit](https://github.com/allenai/dolma/tree/669f534823b08d266a8fff01f8a1c916a5a56576) - Read `docs/data-format.md` (stable source and id, attributes aligned row for row), `docs/taggers.md`, `docs/deduplication.md` and `docs/mixer.md` after your CS336 pipeline works. Its deduplication is a Bloom filter over document keys or paragraphs, with possible false positives, not MinHash; record which production concerns your smaller pipeline omits.
- **Support - Paper:** [Dolma: an Open Corpus of Three Trillion Tokens for Language Model Pretraining Research (Soldaini et al., 2024)](https://arxiv.org/abs/2402.00159) - Read Section 4.2 (data ablations) and Table 1 (the corpus card) as the template for your own data card. The token count depends on the tokenizer used to count.
- **Support - Implementation:** [FineWeb Paper and DataTrove Pipeline](https://github.com/huggingface/datatrove/tree/1977fbb0f3c163d43cace334b073dda17fa3ef26) - Read FineWeb Section 3 (each extraction, filtering and per-snapshot MinHash decision ablated on small models) and trace `examples/fineweb.py` in DataTrove at commit 1977fbb (14 bands x 8 hashes = 112 hashes, 5-gram words). `LanguageFilter()` with no arguments keeps every language above 0.65, so pass `languages` yourself; the cluster script is a reference, not a local run.
- **Support - Practice:** [Resiliparse, fastText and datasketch on Four Documents](https://ekzhu.com/datasketch/lsh.html) - Build one CPU exercise: extract text with Resiliparse `extract_plain_text` (it keeps navigation unless you pass `main_content=True`), identify language with fastText `lid.176.bin` and `predict(text, k=1)`, and find near duplicates with datasketch `MinHashLSH`. Check every candidate against exact shingle Jaccard: at `threshold=0.9` the index uses 5 bands x 25 rows, so it is a candidate filter, not a hard cutoff.
- **Support - Paper:** [Language Model Tokenizers Introduce Unfairness Between Languages (Petrov et al., 2023)](https://arxiv.org/abs/2305.15425) - Read Section 3 (tokenization parity and premium) and Sections 4 and 5 (premiums on FLORES-200, cost and context consequences), then measure the premium of your own tokenizer on a parallel slice.
- **Support - Paper:** [Analysing the Impact of Sequence Composition on Language Model Pre-Training (Zhao et al., 2024)](https://arxiv.org/abs/2402.13991) - Read Section 2 (random, same-source and retrieval packing; causal versus intra-document masking) and Table 1 (perplexity for each strategy). It is the source for testing cross-document attention leakage in your packed batches.
- **Support - Paper:** [Documenting Large Webtext Corpora: A Case Study on the Colossal Clean Crawled Corpus (Dodge et al., 2021)](https://arxiv.org/abs/2104.08758) - Read Sections 3 to 5: what C4 contains, what its filters removed, and how the blocklist removed text from and about minority groups. Use it to audit the trade-offs of your own PII and harm filters; it audits, it does not propose a recipe.
- **Support - Guide:** [Data Cards Playbook](https://sites.research.google/datacardsplaybook/guide/) - Follow the guide steps and use the templates to write the card for your filtered corpus: sources, rights, filters with removal rates, known gaps and intended use.
- **Support - Lab:** [Modern LLM Notebook - Data Engineering](https://github.com/walkinglabs/modern-llm-notebook/tree/979eecf09669121167184ef925d8edbc089fc13e) - Work through `notebooks-en/part2-training/15-data-engineering.ipynb` (extraction, quality filtering, deduplication, mixing). Reproduce its compact examples, then compare their assumptions with the stricter CS336 tests.
- **Support - Practice:** [TensorTonic - Data Processing Set](https://www.tensortonic.com/problems/cs336-l14-minhash-signatures) - Solve Perform Stable Exact Deduplication (`cs336-l14-stable-exact-deduplication`), Build Deterministic MinHash Signatures (`cs336-l14-minhash-signatures`) and Compute Temperature-Based Data Mixtures (`cs336-l14-temperature-data-mixture`). Its MinHash uses SHA-256 of a seed and shingle, so outputs will not match datasketch. Public test cases check the listed edge cases, not gradients or the hidden grader, so keep your own tests beside each solution. 
- **Support - Project:** [Tokenizer and Corpus Pipeline](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-1/tokenizer-corpus-pipeline.md) - Reuse the project correctness, lineage and contamination contracts. Extend the artifact instead of starting another tokenizer implementation.
- **Depth - Research:** [DataComp for Language Models](https://arxiv.org/abs/2406.11794) - Read Section 4.4 and Table 4 (a fastText classifier keeping the top 10% of documents beat other filters), Figure 4 (removal at each stage) and the Section 3 compute table after the bounded data experiment. The repository dedups with a Bloom-filter tool (BFF), not MinHash, and CORE scores changed between v1 and v2, so never compare them directly.
- **Reference - Reference:** [Unicode Standard Annex #15: Unicode Normalization Forms](https://unicode.org/reports/tr15/) - Read Sections 1.1 and 1.2: canonical versus compatibility equivalence, the four forms NFD, NFC, NFKD and NFKC, and why the compatibility forms can remove distinctions that matter. Use it to decide which form belongs to a matching key and which, if any, to stored text.
- **Support - Paper:** [Tulu 3: Pushing Frontiers in Open Language Model Post-Training, Section 3.2](https://arxiv.org/abs/2411.15124) - Read Section 3.2 'Prompt Decontamination' (p. 14 of arXiv:2411.15124v5): the comparison of full-string, n-gram and embedding matching, the 8-gram rule on prompts only, the 50% token-coverage test per instance and the 2% rule per dataset. Use it as a worked example of choosing the match unit and thresholds from the evaluation items.
- **Support - Practice:** [FLORES-200 parallel sentences](https://github.com/facebookresearch/flores/blob/main/flores200/README.md) - Use the devtest split (1,012 sentences, the same sentences in the same order for every language) to measure tokenizer premiums and per-language language-ID retention. The dataset card lists CC BY-SA 4.0 (page read 2026-10-16). The repository is archived and points to a successor; keep the original release for results you want to compare with Petrov et al.
- **Support - Paper:** [Scaling Data-Constrained Language Models (Muennighoff et al., 2023)](https://arxiv.org/abs/2305.16264) - Read Section 3.1 (Equation 5, the effective-data term for repeated tokens), Section 6 with Figure 1 (return on compute when repeating data) and Appendix A (the derivation and the fitted constants). Use it to convert epochs into effective tokens and to see how far that fit reaches: models up to 9B parameters on C4 subsets.
- **Reference - Reference:** [Hugging Face Datasets: Stream](https://huggingface.co/docs/datasets/stream) - Read Shard, Shuffle, Interleave, and Save a dataset checkpoint and resume iteration, including the tip that shuffle-buffer contents are lost when resuming. Use tiny local data and check resume by comparing document ids with an uninterrupted run; do not stream a web-scale corpus or upload to the Hub.

### Exit checkpoint

Reproduce an arbitrary training batch from dataset version, seed, shard and position; bound duplicate and evaluation overlap with reviewed evidence; then show a fixed-compute model result for one filtering or mixture intervention.

<details>
<summary>Deliberately left for later</summary>

- Full-corpus Common Crawl processing and the CS336 data leaderboard
- Cluster-scale data stores and deletion services
- General-purpose data attribution and active data selection research

</details>

## LMR-2. Architecture and Numerics

**Why:** Advanced architecture work matters only when the mechanism, numerics and comparison budget are controlled. This stage moves beyond assembling a standard decoder to reconstructing and testing one meaningful variant.

### Learn this much

- [ ] Residual-stream semantics, pre-normalization and depth stability _(Required)_
- [ ] Initialization, residual scaling and signal propagation with depth _(Required)_
- [ ] RMSNorm, LayerNorm, logit scale and numerical hotspots _(Required)_
- [ ] SwiGLU, gated feed-forwards and parameter-matched width accounting _(Required)_
- [ ] MHA, MQA and GQA shape, quality and state trade-offs _(Required)_
- [ ] RoPE, position offsets and extrapolation failure _(Required)_
- [ ] Position interpolation, NTK-aware scaling and YaRN vocabulary _(Required)_
- [ ] Sparse, linear, recurrent and state-space sequence mechanisms as distinct contracts _(Required)_
- [ ] Sparse MoE routing, expert capacity, dispatch and token ownership _(Required)_
- [ ] Auxiliary load balancing, router z-loss, dropped tokens and expert collapse _(Required)_
- [ ] Expert-parallel communication implications without implementing the distributed runtime _(Required)_
- [ ] Parameter, activation, KV-memory and operation accounting for architecture variants _(Required)_
- [ ] Precision boundaries, stable softmax, normalization accumulation and overflow _(Required)_
- [ ] Activation and gradient-scale diagnostics across layers and sequence lengths _(Required)_
- [ ] Shape, causal, position-offset, dtype and long-context property tests _(Required)_
- [ ] Weight transfer and differential tests where variant semantics overlap _(Required)_
- [ ] Matched-parameter, matched-token and matched-compute architecture comparisons _(Required)_
- [ ] Architecture selection from a decisive mechanism-risk experiment _(Required)_
- [ ] Multi-head latent attention and decoupled-RoPE vocabulary _(Optional)_
- [ ] A bounded Mamba-2 or gated state-space implementation _(Optional)_
- [ ] Original sequence-model architecture research _(Depth)_
- [ ] Custom fused kernels and production optimization _(Later)_
- [ ] Distributed expert routing and fault-tolerant MoE training _(Later)_

### Study units

#### U1. Residual streams, pre-normalization, initialization and residual scaling with depth

**About 4 h** · **Target:** Explain + Derive

Topics: Residual-stream semantics, pre-normalization and depth stability; Initialization, residual scaling and signal propagation with depth

A variant that changes norms, depth or initialization is judged against a baseline whose stream scale already depends on depth. You need the scale argument before you can tell a real architectural effect from a scale effect.

**You can now**

- Explain why a pre-norm block leaves an unnormalized residual stream, and what that does to the stream scale and the last-layer gradient as depth grows.
- Derive the variance of the stream after $`N`$ independent residual branches and the $`1/\sqrt{N}`$ branch scaling that holds it constant.
- Compare two initializations by measuring activation and gradient norm growth across layers, and say which claims the measurement cannot support.

**Study**

1. [CS336 Spring 2026, Lecture 3 slides (architectures and hyperparameters)](https://github.com/stanford-cs336/lectures/blob/main/lecture_03.pdf) (CS336 2026 - Architectures and Attention Alternatives) - Slides 10 to 13: pre-versus-post norm, the data, the two explanations (gradient attenuation, gradient spikes) and the double-norm layouts. Depth: Stop at slide 13. The rest of the deck belongs to later units. The lecture has no initialization content; that comes from the OLMo 2 report below.
2. [On Layer Normalization in the Transformer Architecture (arXiv:2002.04745v2)](https://arxiv.org/abs/2002.04745v2) (On Layer Normalization in the Transformer Architecture (Xiong et al., 2020)) - Figure 1; Section 3.3 (Lemma 2 and Theorem 1, with the setting they assume); Section 3.4 and Figure 3 (empirical check). Depth: Skip Section 4. It is translation and BERT with a warmup comparison, not decoder language models.
3. [2 OLMo 2 Furious (arXiv:2501.00656v3)](https://arxiv.org/abs/2501.00656v3) (OLMo 2 Open Model and Training Recipe) - Table 1 (page 5); Section 3.2 Model Initialization, including the growth exponent and Figures 4 to 6; Section 3.3.2 Reordered norm and QK-norm, Figure 7.
4. [CS336 Assignment 1 handout (Spring 2026 repository)](https://github.com/stanford-cs336/assignment1-basics/blob/main/cs336_assignment1_basics.pdf) (CS336 2026 - Architectures and Attention Alternatives) - Section 3.3.1 Parameter Initialization (p. 17) and the opening of Section 3.4 (p. 19); then Section 7.3, Ablation 1 and the problem (`pre_norm_ablation`) (pp. 42 to 43).

**Focus**

- A pre-norm sublayer reads a normalized copy of the stream but writes into the unnormalized stream. The stream is the embedding plus every earlier branch output, so its scale can grow with depth. A post-norm model renormalizes after every addition. Xiong Lemma 2 states exactly this for their setting: the expected squared norm is flat in depth for Post-LN and grows linearly for Pre-LN.
- Theorem 1 bounds one thing: the gradient of the last FFN layer. It is independent of $`L`$ for Post-LN and shrinks like $`1/\sqrt{L}`$ for Pre-LN. Lemma 3 gives the mechanism: the Jacobian of a normalization scales like $`1/\|x\|`$, and $`\|x\|`$ is what differs. Read the assumptions before you trust the picture: initialization only, uniform attention (query and key weights zero), one head, square weight matrices and Gaussian inputs.
- Two ways to hold the stream scale: scale each residual output projection by $`1/\sqrt{2L}`$ (two branches per block), or keep a fixed small standard deviation and rely on normalization. OLMo 2 dropped a depth-dependent scheme for a flat standard deviation of 0.02 and reports growth exponents closer to 0 for activations and gradients. That is one report on its own models with its own measurement, and it compares against OLMo-0424's layer-index scheme, not against uniform $`1/\sqrt{2L}`$.
- OLMo 2 changed several things as a package (reordered norm, QK-norm, z-loss, initialization). Section 3.3.2 says reordered norm and QK-norm 'in isolation' do not give good results, so the report cannot attribute the gain to any one of them.

**Reproduce:** Closed-book, derive the mean square of the stream after $`N`$ residual branches whose outputs are independent, zero-mean and each of variance $`v`$, on an input of variance $`\sigma_0^2`$: $`\sigma_0^2 + Nv`$. Scaling each branch by $`1/\sqrt{N}`$ gives $`\sigma_0^2 + v`$ for every $`N`$. Then, on your own pre-norm decoder with random token IDs and no training, record the stream mean square after every block for $`L = 4, 16, 64`$, with and without scaling the attention output projection and FFN down projection by $`1/\sqrt{2L}`$. Labeled example, not a target: with a toy decoder (width 128, 4 heads, FFN width 344, RMSNorm, normal initialization with variance $`2/(\text{fan-in} + \text{fan-out})`$, 4 sequences of 64 random tokens, mean of 3 seeds, PyTorch 2.14.1 on CPU) the final mean square was 2.38, 10.6 and 56.7 for $`L = 4, 16, 64`$ unscaled, and 1.14, 1.15 and 1.15 scaled. Growth in the unscaled runs was faster than linear in $`L`$ (the increment per sublayer rose from 0.17 to 0.30 to 0.43), so the independence assumption does not hold exactly. Expect the scaled values to stay flat and the unscaled ones to grow.

**Traps**

- Reading Theorem 1 as a layer profile. It bounds the last layer only. In the same toy at $`L = 64`$ with post-norm, the FFN down-projection gradient norm was 0.156 at the last block and 6.1 at the first, the opposite order to 'gradients are large near the output', while the last-layer value stayed between 0.14 and 0.16 for $`L = 4, 16, 64`$ (0.151, 0.141, 0.156) as the theorem says. Pre-norm gave 0.108, 0.049 and 0.022 at the last block. Measure the whole profile in your own model.
- Treating the OLMo 2 stability result as evidence for one component. Its Table 1 and Section 3.3.2 describe a package, and Equation 2 in Section 2.1 writes $`\operatorname{MLP}(x)`$ where Table 1 and the Section 3.3.2 table use the intermediate state $`h`$. Follow the table.
- Calling a flat curve of stream norm 'stable'. The stream scale at initialization says nothing about training, and the final norm hides a growing stream from the output head. Compare the stream scale at several points in training before you claim a depth effect.

**Practice**

- [CS336 Assignment 1: `pre_norm_ablation`](https://github.com/stanford-cs336/assignment1-basics/blob/main/cs336_assignment1_basics.pdf) - Section 7.3, problem (`pre_norm_ablation`) (p. 43). The handout asks for a post-norm variant of your own block and a learning curve against pre-norm. The handout budgets 0.5 B200 hours and gives no tests. Substitute the handout's TinyStories setup (4 layers, 16 heads, width 512, FFN width 1344) at its low-resource 40,000,000-token budget, or a smaller model on your own decoder. Keep tokens, data order, warmup and learning rate identical, use three seeds, and also record the highest learning rate at which each variant still trains. Add the per-layer stream and gradient norm profile at initialization for two depths. The section mini-project reuses that profile.

**Stop when:** You can derive the stream variance with and without $`1/\sqrt{N}`$ scaling, and your own per-layer stream and gradient norms at initialization, for two depths and both norm placements, either agree with Theorem 1's last-layer claim or contradict it for a reason you can state.

<details>
<summary>Self-test</summary>

1. Why does a pre-norm model need a final norm before the output head?
   - The stream is unnormalized and its scale depends on depth and position in training. Without a final norm the logits would carry that scale. The final norm restores a fixed scale before the head.
2. $`N`$ branch outputs are independent, zero-mean, each of variance $`v`$, and are added to a stream of variance 1. What is the variance after the additions, and after scaling each branch by $`1/\sqrt{N}`$? What changes if the outputs are perfectly correlated?
   - $`1 + Nv`$, and $`1 + v`$ after scaling. If the $`N`$ outputs are perfectly correlated, the sum has variance $`N^2 v`$, so growth is quadratic in $`N`$ and $`1/\sqrt{N}`$ scaling no longer holds the scale.
3. Why does Theorem 1 give a last-layer gradient that falls like one over the square root of depth for Pre-LN but is flat for Post-LN?
   - The Jacobian of the final normalization scales like $`1/\|x\|`$. In Pre-LN the squared norm of the stream grows linearly with $`L`$, so the gradient shrinks like $`1/\sqrt{L}`$. In Post-LN the input to the normalization has a depth-independent norm.
4. A colleague says the OLMo 2 report shows depth-scaled initialization is worse than a flat standard deviation. What does the report actually compare?
   - A flat standard deviation of 0.02 against OLMo-0424's scheme, which scaled output projections by a factor that depends on the layer index. It measured growth exponents and spike scores in its own setup, alongside other changes. It does not test uniform scaling by one over the square root of twice the layer count.

</details>

#### U2. RMSNorm, LayerNorm, logit scale and precision hotspots in softmax and normalization

**About 4 h** · **Target:** Derive + Measure

Topics: RMSNorm, LayerNorm, logit scale and numerical hotspots; Precision boundaries, stable softmax, normalization accumulation and overflow

Most numerical failures in a decoder sit in three places: the norm, the attention softmax and the output softmax. A variant that changes any of them changes where precision is lost, so you need to know each hotspot before you attribute a loss difference to the mechanism.

**You can now**

- Derive RMSNorm from LayerNorm, state when they coincide exactly, and derive the RMSNorm Jacobian $`\frac{1}{r}\left(I - \frac{yy^\top}{d}\right)`$.
- Derive the z-loss gradient and explain why cross-entropy alone cannot control the logit offset that z-loss controls.
- Find the precision hotspots in a block (squares, exponentials, long accumulations) and measure each against a float64 reference at a stated dtype and shape.
- Reproduce attention-logit growth in a small model and show what QK-norm does to it.

**Study**

1. [CS336 Spring 2026, Lecture 3 slides](https://github.com/stanford-cs336/lectures/blob/main/lecture_03.pdf) (CS336 2026 - Architectures and Attention Alternatives) - Slides 14 to 19 (LayerNorm versus RMSNorm, why RMSNorm, dropping bias terms); slides 52 to 56 (stability: softmax hotspots, output z-loss, QK-norm, logit soft-capping). Depth: Slide 15 asks whether 'RMSNorm is faster because it has fewer operations' makes sense and slide 16 answers with data movement. Treat that as a claim to test, not a result.
2. [CS336 Assignment 1 handout](https://github.com/stanford-cs336/assignment1-basics/blob/main/cs336_assignment1_basics.pdf) (CS336 2026 - Architectures and Attention Alternatives) - Section 3.4.1 RMSNorm (pp. 19 to 20, the upcast to float32) and Section 3.4.4 softmax and masking (pp. 23 to 24).
3. [2 OLMo 2 Furious (arXiv:2501.00656v3)](https://arxiv.org/abs/2501.00656v3) (OLMo 2 Open Model and Training Recipe) - Section 3.3.1 (nonparametric LayerNorm to RMSNorm), Section 3.3.3 Z-Loss and Figure 8 (a fused and a plain implementation give the same forward value and different backward behavior), Table 1. Depth: Section 3.3.3 writes the z-loss term as $`10^{-4} \cdot \log^2 Z`$ while Table 1 lists the weight as $`10^{-5}`$. Take the coefficient from the training configuration you reproduce, not from either.
4. [Small-Scale Proxies for Large-Scale Transformer Training Instabilities (arXiv:2309.14322v2)](https://arxiv.org/abs/2309.14322v2) (Small-Scale Proxies for Large-Scale Transformer Training Instabilities (Wortsman et al., 2023)) - Section 3.1 (3.1.1 attention logit growth and 3.1.2 output logit divergence), Figures 1 to 4. Depth: Stop before Section 3.2. The muParam, warmup and depth experiments belong to later units.

**Focus**

- LayerNorm is RMSNorm applied to the mean-centered input. The two agree exactly when the feature mean is zero (same $`\epsilon`$ and gain, no bias). Add a constant to every feature and LayerNorm does not change, while RMSNorm rescales and keeps the offset. Dropping the mean removes one reduction and the bias parameter, and the claim that this makes the model faster is about memory traffic, not FLOPs.
- The Jacobian of a normalization is $`1/r`$ times a projection, so gradients through a norm scale like one over the input scale. That is the mechanism behind Xiong's Lemma 3 and behind the learning-rate sensitivity in Wortsman et al.
- Softmax is invariant to adding a constant to all logits, so cross-entropy is flat along that direction and nothing stops the offset from drifting. z-loss, $`c(\log Z)^2`$ with $`Z = \sum_i e^{z_i}`$, adds a gradient $`2c \log Z`$ times the softmax along it. QK-norm bounds the attention logits directly: after per-head RMSNorm with unit gains each query and key has norm $`\sqrt{d_h}`$, so $`|z| \le \sqrt{d_h}`$ before the gains.
- Name each hotspot with its failure. Squares in float16 overflow when $`|x| \ge 256`$, because $`256^2 = 65536`$ exceeds the float16 maximum 65504. bfloat16 keeps the float32 range but has 8 bits of precision, so logits in $`[64, 128)`$ are rounded to multiples of 0.5. Naive sequential accumulation stalls once the running sum reaches 256 in bfloat16. Library reductions and fused norm kernels accumulate in a wider type, so you must check your own code, not the library's.

**Reproduce:** Closed-book, derive the RMSNorm Jacobian at $`\epsilon = 0`$ and show that its largest singular value is $`1/r`$ with $`r = \sqrt{\frac{1}{d}\sum_i x_i^2}`$ and that $`x`$ itself is mapped to zero. Show $`\operatorname{LayerNorm}(x) = \operatorname{RMSNorm}(x - \bar{x})`$. Then derive the z-loss gradient with respect to the logits, $`\operatorname{softmax}(z) - \text{onehot}(y) + 2c \log Z \cdot \operatorname{softmax}(z)`$, and check it against autograd in float64 for $`z = [2, 0, -1]`$, $`y = 0`$, $`c = 10^{-4}`$: the gradient is $`[-0.15584, 0.11424, 0.04203]`$ with $`\log Z = 2.16985`$. Finally, in PyTorch 2.14.1 on CPU, take a float16 vector of 4095 ones and one entry 300. A hand-written `x.pow(2).mean()` gives `inf` and the normalized row is all zeros. After `x.float()` the entries are 0.2086 and 62.59. `torch.nn.functional.rms_norm` on the same float16 input returns finite values because the library upcasts.

**Traps**

- Testing a hotspot through the library function instead of your own code. In the check above `torch.nn.functional.rms_norm` is safe in float16, and `torch.ones(10000, dtype=torch.bfloat16).sum()` gives 9984 (a rounded result of a wider accumulation), but a Python loop adding ones in bfloat16 stops at 256. The hand-written norm and reduction in your block are what can fail.
- Claiming QK-norm 'fixes' attention logit growth without a baseline run at the same learning rate. Wortsman et al. show growth at high learning rates in small models and relate it to the quadratic dependence of logits on parameter norms; they call that a hypothesis. Run both variants at several learning rates.
- Trusting a fused z-loss kernel. OLMo 2 Figure 8 shows a fused implementation and a plain PyTorch one that agree in the forward pass and diverge in the backward pass, and the report suspects precision. Compare gradients, not only the loss value.

**Practice**

- [TensorTonic: RMSNorm Forward Pass](https://www.tensortonic.com/problems/cs336-l03-rmsnorm-forward) - Free problem `cs336-l03-rmsnorm-forward`, function `rmsnorm(x, g, epsilon)`. The three public cases check two rows with unit gain, a learned gain of `[2, 0.5]`, and an all-zero row. They do not test float16 or bfloat16 inputs or gradients. Add your own tests: a float16 row with an entry above 256, and a float64 reference.
- [CS336 Assignment 1: `rmsnorm`](https://github.com/stanford-cs336/assignment1-basics/blob/main/tests/test_model.py) - Problem (`rmsnorm`), Section 3.4.1; implement `run_rmsnorm` in `tests/adapters.py` and pass `test_rmsnorm`. If you passed this earlier, rerun it after adding the float16 test above.
- [Attention-logit growth with and without QK-norm](https://arxiv.org/abs/2309.14322v2) - Reproduce the idea of Figure 2 on a model of a few million parameters or fewer: track the maximum layer-0 attention logit during training at four learning rates, with and without QK-norm. Labeled example, not a target: 4-layer pre-norm decoder, width 128, 4 heads, FFN width 344, a byte-level text corpus, batch 16 by 128 tokens, AdamW with betas 0.9 and 0.95, no weight decay, 20 warmup steps, 400 steps, one seed, PyTorch 2.14.1 on CPU. The maximum layer-0 logit seen was about 45, 1,000, 14,000 and 360,000 at learning rates 0.003, 0.01, 0.03 and 0.1 without QK-norm, and about 10, 14, 19 and 29 with it; a rerun with the same seed moved the values without QK-norm by up to a quarter. Use three seeds on your own data and report the spread.

**Stop when:** You can derive the Jacobian and the z-loss gradient from a blank page, and you have a table of your own measurements: one row per hotspot, with dtype, shape and error against float64, plus the attention-logit curves with and without QK-norm.

<details>
<summary>Self-test</summary>

1. When do LayerNorm (no bias) and RMSNorm give the same output, and what happens to each when you add a constant to every feature?
   - They agree when the input already has zero mean over the feature axis, with the same $`\epsilon`$ and gain. Adding a constant leaves LayerNorm unchanged, because it subtracts the mean. RMSNorm still divides by the new root mean square, so the constant remains in the output at a different scale.
2. Why can't cross-entropy alone stop all the logits from drifting upward together, and what does z-loss add?
   - Cross-entropy depends only on logit differences, so adding $`\delta`$ to every logit leaves the loss and its gradient unchanged while $`\log Z`$ rises by $`\delta`$. The term $`c(\log Z)^2`$ is not shift-invariant and adds the gradient $`2c \log Z \cdot \operatorname{softmax}(z)`$, which pulls $`\log Z`$ toward 0.
3. After per-head RMSNorm with unit gains, what is the largest possible attention logit $`q \cdot k / \sqrt{d_h}`$?
   - $`\sqrt{d_h}`$. Each normalized vector has root mean square 1, so norm $`\sqrt{d_h}`$, and Cauchy-Schwarz bounds the dot product by $`d_h`$. Learned gains multiply the bound, so the observed maximum can exceed $`\sqrt{d_h}`$.
4. An activation vector in float16 has largest entry 200. Is a hand-written RMS computation safe? What if the entry is 260?
   - At 200 the square is 40000, below the float16 maximum 65504, so the square is finite. At 260 the square is 67600, which overflows to `inf`, and every output of that row becomes 0. The threshold is 256 because $`256^2 = 65536 > 65504`$.
5. Two runs differ only in whether QK-norm is on, and the QK-norm run reaches a lower loss at one learning rate. What else must hold before you credit QK-norm?
   - Several seeds at that learning rate, a learning-rate sweep for both variants (the best learning rates may differ), and the same data order and token budget. A single run at one learning rate cannot separate the mechanism from learning-rate sensitivity.

</details>

#### U3. Gated feed-forward width matching and parameter, activation and KV-memory accounting

**About 4 h** · **Target:** Derive

Topics: SwiGLU, gated feed-forwards and parameter-matched width accounting; Parameter, activation, KV-memory and operation accounting for architecture variants

Every later comparison in this section says 'at matched parameters'. A gated feed-forward network matches parameters and matmul FLOPs with its ungated baseline but not activation memory, and a rounded width does not even match parameters exactly. This unit gives you the accounting to state exactly what is matched.

**You can now**

- Derive the gated feed-forward width that matches a two-matrix feed-forward network in parameters, and quantify what rounding the width does to the match.
- Derive per-block parameter counts, per-token KV bytes and saved-activation counts for a standard block and for one variant (SwiGLU, GQA), and say which of them a width match leaves unmatched.
- Count saved activations in your own block with autograd hooks and reconcile the count with the formula.

**Study**

1. [GLU Variants Improve Transformer (arXiv:2002.05202v1)](https://arxiv.org/abs/2002.05202v1) (GLU Variants Improve Transformer (Shazeer, 2020)) - Section 2 (Equations 4 to 6); Section 3.1 (hidden width 3072 reduced to 2048); Table 1 with its standard deviations at 65,536 steps.
2. [CS336 Spring 2026, Lecture 3 slides](https://github.com/stanford-cs336/lectures/blob/main/lecture_03.pdf) (CS336 2026 - Architectures and Attention Alternatives) - Slides 20 to 26 (activations and gated units), slides 36 to 41 (feed-forward to model-dimension ratio, the gated exception).
3. [CS336 Assignment 1 handout](https://github.com/stanford-cs336/assignment1-basics/blob/main/cs336_assignment1_basics.pdf) (CS336 2026 - Architectures and Attention Alternatives) - Section 3.4.2 Position-Wise Feed-Forward Network, the SwiGLU definition (pp. 21 to 22) and Problem (`transformer_accounting`) (pp. 27 to 28). Depth: You did parts (a) to (c) in LLM Foundations. Redo the arithmetic for a grouped-query, SwiGLU block instead of repeating them.
4. [2 OLMo 2 Furious (arXiv:2501.00656v3)](https://arxiv.org/abs/2501.00656v3) (OLMo 2 Open Model and Training Recipe) - Section 2.1, the SwiGLU bullet: hidden size about 8/3 of the model width, rounded up to a multiple of 128 (11,008 for the 7B model).
5. [Modern LLM Notebook, Appendix B: From Parameters to Memory](https://github.com/walkinglabs/modern-llm-notebook/blob/979eecf09669121167184ef925d8edbc089fc13e/notebooks-en/appendix-advanced/B-flops-memory-accounting.ipynb) (Modern LLM Notebook, Appendix B: From Parameters to Memory) - Section 1 (Parameters) and Section 2 (Activation Memory). Depth: Section 2 lists the tensors a forward pass produces, not the tensors autograd saves, and omits two that a SwiGLU feed-forward network saves. Use it for the layout and recount with hooks. Stop before Section 3.

**Focus**

- A gated feed-forward network has three $`d \times h`$ matrices and an ungated one has two $`d \times 4d`$ matrices, so equal parameters means $`3dh = 8d^2`$ and $`h = \tfrac{8}{3}d`$. Shazeer's Section 3.1 states the same match as 3072 to 2048 at $`d = 768`$: $`2 \cdot 768 \cdot 3072 = 3 \cdot 768 \cdot 2048`$.
- Real configurations round the width. For $`d = 4096`$ the exact width is 10922.67 and OLMo 2 uses 11,008, so the gated block has 0.78% more parameters than a 4x ungated block. State the counted parameters of both variants in any comparison.
- Parameters and matmul FLOPs match; saved activations do not. For one token, an ungated GELU feed-forward network at width $`4d`$ saves $`2h + d = 9d`$ elements for backward (input, pre-activation, activation), while the gated one at width $`\tfrac{8}{3}d`$ saves $`4h + d \approx 11.67d`$ (input, two projections, the activated gate and the product).
- Shazeer's Table 1 reports means with standard deviations of 0.003 to 0.010 for four 65,536-step runs and single values at 524,288 steps. The 0.003 gap between GEGLU (1.633) and SwiGLU (1.636) at the longest run is smaller than that run-to-run spread. The setting is T5 span-filling with Adafactor and no dropout.

**Reproduce:** Closed-book, for width $`d = 4096`$: derive $`h = 8d/3`$, then count a 4x GELU feed-forward network ($`2 \cdot 4096 \cdot 16384 = 134{,}217{,}728`$ parameters) against the gated one at width 11,008 ($`3 \cdot 4096 \cdot 11008 = 135{,}266{,}304`$), a difference of 1,048,576 or 0.78%. Then for a block with 32 query heads, 8 KV heads, head size 128 and $`d = 4096`$, derive 41,943,040 attention parameters (67,108,864 for multi-head) and 4096 bytes of bfloat16 KV cache per token per layer. Finally, wrap each feed-forward module in `torch.autograd.graph.saved_tensors_hooks`, count unique saved non-weight tensors for $`d = 96`$ at widths 384 (GELU) and 256 (SwiGLU), and match $`9d`$ and $`11.67d`$ elements per token (864 and 1120). The two modules both hold 73,728 parameters. Measured in PyTorch 2.14.1 eager mode, float32.

**Traps**

- Calling a width match a cost match. Equal parameters and equal matmul FLOPs leave saved activations and elementwise work different (about 1.3 times the saved elements here), and a recompute or fused-kernel policy changes the saved set again. Report which cost you matched.
- Recounting with the notebook's Section 2 recipe. It lists produced tensors, counts a feed-forward block as $`2\,\text{BSD} + 2\,\text{BSF}`$ and rounds the gated block up to $`8\,\text{BSD}`$, after misstating its sum as $`6.33\,\text{BSD}`$ ($`2 + 16/3 = 22/3 \approx 7.33`$). Autograd also saves the activated gate and the gated product, and a count from hooks is the check.
- Reading the 8/3 rule as exact. Rounding the width to a multiple of 64, 128 or 256 changes the parameter count, and the 4x baseline in the A1 SiLU ablation matches the gated width only 'approximately'.

**Practice**

- [TensorTonic: Parameter-Matched SwiGLU Block](https://www.tensortonic.com/problems/cs336-l03-parameter-matched-swiglu) - Free problem `cs336-l03-parameter-matched-swiglu`, function `parameter_matched_swiglu(x, w_g, w_v, w_o, base_params)`. The three public cases check the selected width (a rounded $`P/(3d)`$, clamped to the weight pool), the parameter count $`3dh`$ and the output on small matrices. They do not check gradients or the activation memory. Add a test that counts saved tensors with hooks and compares it with your formula.

**Stop when:** You can state, for a block you choose, the parameter count, the per-token KV bytes and the saved-activation count of both the baseline and the variant, and your hook count agrees with the formula.

<details>
<summary>Self-test</summary>

1. Why is the matched gated width $`\tfrac{8}{3}d`$ and not $`\tfrac{2}{3} \cdot 4d`$ of something else?
   - It is the same number: three matrices of $`d \times h`$ must equal two matrices of $`d \times 4d`$, so $`3h = 8d`$. Equivalently the ungated width $`4d`$ is reduced by a factor of 2/3.
2. A model with width 4096 uses a gated feed-forward width of 11,008. By how many parameters per layer does it differ from a 4x ungated network?
   - $`3 \cdot 4096 \cdot 11008 = 135{,}266{,}304`$ against $`2 \cdot 4096 \cdot 16384 = 134{,}217{,}728`$, so 1,048,576 more, about 0.78%.
3. A SwiGLU and a GELU feed-forward network have identical parameter counts. Which one saves more activations for backward, by how much, and why?
   - SwiGLU, about 11.67d against 9d elements per token (1.3 times). It saves the shared input, both projections, the activated gate and their product, while GELU saves the input, the pre-activation and the activation.
4. Shazeer's Table 1 has GEGLU at 1.633 and SwiGLU at 1.636 after 524,288 steps. What can you conclude about their ranking?
   - Nothing firm. The gap is 0.003, the 65,536-step runs have standard deviations of 0.004 and 0.010, and the longest runs are single values. The paper recommends SwiGLU on the whole table, not on that gap.
5. Per token and per layer, how many KV-cache bytes does a bfloat16 model with 8 KV heads of size 128 need, and what is the cache for one 8192-token sequence in a 32-layer model?
   - $`2 \cdot 8 \cdot 128 \cdot 2 = 4096`$ bytes per token per layer. Over 32 layers and 8192 tokens that is $`4096 \cdot 32 \cdot 8192 = 1{,}073{,}741{,}824`$ bytes, exactly 1 GiB (1.07 GB).

</details>

#### U4. MHA, MQA and GQA trade-offs, and multi-head latent attention

**About 4 h** · **Target:** Derive + Implement

Topics: MHA, MQA and GQA shape, quality and state trade-offs; Multi-head latent attention and decoupled-RoPE vocabulary

The head layout sets how many bytes each decoded token adds to the cache, so it sets the batch and context your serving budget allows. Your variant choice here also changes parameters, which makes it a common confound in architecture comparisons.

**You can now**

- Derive KV-cache elements per token for MHA, MQA, GQA and multi-head latent attention (MLA), and say which of them changes memory traffic, which changes FLOPs and which changes neither.
- Implement MLA with decoupled RoPE two ways, with keys and values materialized and with the key and value up-projections absorbed, and show that they agree.
- Explain why converting a multi-head checkpoint to GQA by mean pooling is not function-preserving, while the reverse conversion is exact, and what the GQA paper does about it.

**Study**

1. [Fast Transformer Decoding: One Write-Head is All You Need (arXiv:1911.02150v1)](https://arxiv.org/abs/1911.02150v1) (GQA: Training Generalized Multi-Query Transformer Models from Multi-Head Checkpoints (Ainslie et al., 2023) with Fast Transformer Decoding: One Write-Head is All You Need (Shazeer, 2019)) - Section 2.4.1 (performance analysis of incremental multi-head attention), Section 3 and 3.1 (multi-query attention and its memory-to-compute ratio), Sections 4.2 and 4.3 (quality and speed). Depth: The experiments are 2019 translation and language modeling. Read them for the size of the quality gap, not as a result for modern decoders.
2. [GQA: Training Generalized Multi-Query Transformer Models from Multi-Head Checkpoints (arXiv:2305.13245v3)](https://arxiv.org/abs/2305.13245v3) (GQA: Training Generalized Multi-Query Transformer Models from Multi-Head Checkpoints (Ainslie et al., 2023) with Fast Transformer Decoding: One Write-Head is All You Need (Shazeer, 2019)) - Section 2.1 (uptraining by mean pooling) and 2.2 (grouped heads), Section 3.3 (ablations: Figures 4 to 6), Table 1.
3. [CS336 Spring 2026, Lectures 3 and 4 slides](https://github.com/stanford-cs336/lectures/blob/main/lecture_04.pdf) (CS336 2026 - Architectures and Attention Alternatives) - Lecture 4 slides 57 to 58 (MLA and the RoPE conflict); also Lecture 3 (https://github.com/stanford-cs336/lectures/blob/main/lecture_03.pdf) slides 57 to 63 (arithmetic intensity of incremental decoding, MQA, GQA, quality).
4. [DeepSeek-V2 (arXiv:2405.04434)](https://arxiv.org/abs/2405.04434v5) (DeepSeek-V2, Section 2.1 (Multi-head Latent Attention)) - Sections 2.1.1 to 2.1.4 (Equations 1 to 19, Table 1) and Appendices D.1 and D.2 (their attention ablations). Depth: Skip Section 2.2 onward. Appendix D.1 aligns the MHA, GQA and MQA models at about 7B parameters by changing the number of layers, so depth differs between the arms.
5. [Build a Large Language Model (From Scratch), companion bonus code](https://github.com/rasbt/LLMs-from-scratch/tree/ec0bac5e1d854306a8ea6c308da49aae22479bd1/ch04/04_gqa) (Build a Large Language Model (From Scratch), Chapters 3 and 4) - `ch04/04_gqa`: README and `memory_estimator_gqa.py`; `ch04/05_mla`: README and `gpt_with_kv_mla.py`. Depth: The MLA code caches the latent and up-projects it at every step, with no decoupled RoPE and no absorption. It shows the cache saving, not the compute path.
6. [Modern LLM Notebook: KV Cache and Its Architectural Evolution](https://github.com/walkinglabs/modern-llm-notebook/blob/979eecf09669121167184ef925d8edbc089fc13e/notebooks-en/part2-training/11-mla-kv-cache.ipynb) (Modern LLM Notebook - Architecture Frontiers) - Sections 1 to 5 and the exercises. Do not use Section 6's cache count (see the traps).

**Focus**

- KV elements per token per layer: MHA $`2 n_h d_h`$, GQA with $`n_g`$ groups $`2 n_g d_h`$, MQA $`2 d_h`$, MLA $`d_c + d_h^R`$. For DeepSeek-V2 (128 heads, $`d_h = 128`$, $`d_c = 512`$, $`d_h^R = 64`$, 60 layers) that is 1,966,080 against 34,560 elements per token, a ratio of 56.9, equal to GQA with 2.25 groups (Table 1).
- MQA and GQA reduce the bytes loaded per decoded token. The attention multiply-adds are unchanged, because every query head still attends over every cached position. Shazeer's ratio of memory access to arithmetic drops from $`\Theta(n/d + 1/b)`$ to $`\Theta(1/d + n/(dh) + 1/b)`$, and only the $`n/d`$ term shrinks, by a factor $`h`$.
- RoPE sits between the query projection and the key up-projection, so $`W^{UK}`$ cannot be absorbed into the query projection. DeepSeek-V2 carries position in extra query heads and one shared rotated key of size $`d_h^R`$ that is also cached. That shared key is why the cache is $`d_c + d_h^R`$, not $`d_c`$.
- Conversion direction matters. Replicating each GQA key and value head into a full MHA gives an identical model. Mean pooling the heads of an MHA checkpoint into groups does not, which is why the GQA paper uptrains (5% of the original compute for T5 XXL) and finds mean pooling beats taking the first head or random initialization (Figure 4).

**Reproduce:** Closed-book, derive the four cache formulas and the DeepSeek-V2 cache sizes in its Table 1. Then implement MLA with decoupled RoPE in float64 for $`B = 2`$, $`T = 9`$, width 48, 4 heads, $`d_h = 12`$, $`d_c = 16`$, $`d_h^R = 8`$. Path 1 materializes the keys and values from the latent. Path 2 absorbs $`W^{UK}`$ into the query and $`W^{UV}`$ into the output projection, so attention touches only the latent and the shared rotated key. Both paths apply a causal mask and must agree: the maximum absolute difference was 1.3e-15 in one run (PyTorch 2.14.1, CPU), and anything under 1e-10 passes. Cache elements per token per layer for these shapes: 24 for MLA, 96 for MHA. Also check that expanding GQA key and value weights into an MHA gives a difference of exactly 0.0, and that mean pooling a random MHA does not.

**Traps**

- The Modern LLM Notebook (Section 6, commit 979eecf) counts the decoupled RoPE key as $`\text{num\_heads} \times d_r = 8192`$ elements per token per layer and prints MLA as 8704 elements (3.8 times smaller than MHA), while saying the RoPE side path is 'only a small portion'. DeepSeek-V2 Equation 15 defines one key shared by all heads, so the cache is $`512 + 64 = 576`$ elements.
- Trusting a shape-only exercise. Notebook Exercise 3 passes if the output has the right shape and is finite, and its `SimpleMLA` has no causal mask. Add the absorbed-path equality test and a future-token test before you call the layer correct.
- Reading the quality results as portable. MQA reports a small loss in 2019 translation and language modeling. GQA reports T5 encoder-decoder summarization, translation and question answering. DeepSeek-V2's Appendix D.1 matches parameters by changing depth, and its claim that MLA beats MHA comes from the authors' own models. None is a decoder ablation at your scale.

**Practice**

- [TensorTonic: Causal Grouped-Query Attention](https://www.tensortonic.com/problems/cs336-l03-causal-grouped-query-attention) - Free problem `cs336-l03-causal-grouped-query-attention`, function `causal_gqa(q, k, v)`, without repeating key or value heads. The three public cases check single-head causal attention, multi-query attention with two query heads, and two key-value heads with four query heads, on tiny tensors. They do not check gradients, odd group sizes or float16. Add your own test against a version that repeats the heads.
- [Modern LLM Notebook 11: Exercises 1 to 3, then your own MLA test](https://github.com/walkinglabs/modern-llm-notebook/blob/979eecf09669121167184ef925d8edbc089fc13e/notebooks-en/part2-training/11-mla-kv-cache.ipynb) - Exercises 1 to 3 at the end of the notebook; then extend `SimpleMLA` with a causal mask, decoupled RoPE and the absorbed path, and test both paths against each other. Exercises 1 and 2 are cache arithmetic; Exercise 3 fills in three lines. The absorbed-path test is the part that checks your understanding. Use a float64 tolerance.

**Stop when:** Your two MLA paths agree to float64 tolerance under a causal mask and nonzero positions, and you can state the cache elements per token for all four layouts for a configuration you choose.

<details>
<summary>Self-test</summary>

1. A decoder has 32 layers, 8 KV heads of size 128 and bfloat16 caches. How many bytes does each token add, and what would 32 KV heads cost? What is the cache of one 4096-token sequence in each case?
   - $`2 \cdot 8 \cdot 128 \cdot 2 \cdot 32 = 131{,}072`$ bytes per token with 8 KV heads and 524,288 with 32. For 4096 tokens that is 512 MiB and 2 GiB.
2. Does GQA reduce attention FLOPs during decoding? What does it reduce?
   - No. Each query head still computes scores against every cached position, so the multiply-adds are unchanged. It reduces the keys and values stored and loaded per step, which shrinks the $`n/d`$ memory-to-compute term in decoding.
3. Which conversion is exact: GQA to MHA by copying each group's key and value weights to all its query heads, or MHA to GQA by averaging the heads in a group? Why does the other one need training?
   - Copying is exact, because attention with replicated keys and values is what GQA computes. Averaging keys and values changes every head's attention scores and values, so the converted model computes a different function. Uptraining lets the model adapt.
4. Why does MLA cache $`d_c + d_h^R`$ rather than $`d_c`$?
   - Applying RoPE to the up-projected keys would put a position-dependent rotation between the query projection and $`W^{UK}`$, blocking the absorption and forcing recomputation of all prefix keys. DeepSeek-V2 therefore uses extra query heads and one shared rotated key of size $`d_h^R`$ for position, and that key must be cached as well.
5. In absorbed MLA decoding with $`d_c = 4 d_h`$, roughly how does the number of multiply-adds per head per cached position compare with materialized keys and values, ignoring the RoPE part?
   - About four times larger: scores and the weighted sum run in the latent dimension $`d_c = 4 d_h`$ instead of $`d_h`$. MLA trades extra arithmetic for a much smaller cache, so it moves decoding toward compute-bound.

</details>

#### U5. RoPE offsets, extrapolation failure, and position interpolation, NTK-aware scaling and YaRN

**About 5 h** · **Target:** Derive + Implement

Topics: RoPE, position offsets and extrapolation failure; Position interpolation, NTK-aware scaling and YaRN vocabulary

Long context fails in a specific way: some rotation angles at long range were never seen in training. Knowing which dimension pairs carry that risk lets you choose a scaling method for a stated length and know what fine-tuning it still needs.

**You can now**

- Derive the relative-position property of RoPE with explicit position offsets, and explain why neither it nor the long-term decay bound guarantees behavior beyond the trained length.
- Implement position interpolation, NTK-aware base scaling, NTK-by-parts and the YaRN attention temperature as maps on positions and frequencies, and predict which dimension pairs each one changes.
- Measure loss against evaluation length on a small trained model for direct extrapolation and each scaling method, and state what the measurement does not show.

**Study**

1. [RoFormer: Enhanced Transformer with Rotary Position Embedding (arXiv:2104.09864v5)](https://arxiv.org/abs/2104.09864v5) (RoFormer: Enhanced Transformer with Rotary Position Embedding (Su et al., 2021)) - Section 3.1 (Equation 11, the relative-position requirement), Sections 3.2.1 and 3.2.2 (2D case and general form), Section 3.3 (properties) and Section 3.4.3 with Figure 2 (long-term decay). Depth: Skip Sections 4 and 5, the Chinese and BERT-style experiments.
2. [Extending Context Window of Large Language Models via Position Interpolation (arXiv:2306.15595v2)](https://arxiv.org/abs/2306.15595v2) (Extending Context Window of Large Language Models via Positional Interpolation (Chen et al., 2023) and YaRN (Peng et al., 2023)) - Section 2.2 (direct extrapolation and Figure 2), Section 2.3 (the method and Theorem 2.1), Section 3.2 (Table 1), Section 3.3 (passkey retrieval, Table 4).
3. [YaRN: Efficient Context Window Extension of Large Language Models (arXiv:2309.00071v3)](https://arxiv.org/abs/2309.00071v3) (Extending Context Window of Large Language Models via Positional Interpolation (Chen et al., 2023) and YaRN (Peng et al., 2023)) - Sections 2.2 and 3.1 to 3.4 (Equations 10 to 15), Appendix A.1 to A.3 (Equations 16 to 23). Depth: Stop before Section 4. Use Appendix A.1 (Equation 16) for the direction of position interpolation; see the traps.
4. [CS336 Spring 2026, Lecture 3 slides](https://github.com/stanford-cs336/lectures/blob/main/lecture_03.pdf) (CS336 2026 - Architectures and Attention Alternatives) - Slides 30 to 35 (position embeddings, RoPE, the actual RoPE math, implementation).
5. [Modern LLM Notebook: Long Context Extrapolation](https://github.com/walkinglabs/modern-llm-notebook/blob/979eecf09669121167184ef925d8edbc089fc13e/notebooks-en/part4-frontiers/27-long-context.ipynb) (Modern LLM Notebook - Architecture Frontiers) - Sections 4 to 9 (RoPE, why extrapolation fails, position interpolation, NTK-aware) and Section 12 (how to validate long context). Depth: Do not use Section 10 or the `yarn` branch of `ExtrapolatableRoPE` as a description of YaRN (see the traps).

**Focus**

- RoPE rotates each pair $`2i, 2i+1`$ of a query or key by the angle $`p\,\theta_i`$ with $`\theta_i = b^{-2i/d}`$, so $`\langle R_m q, R_n k\rangle`$ depends on $`m - n`$ only. With explicit position IDs this also holds for any common offset, which is what a KV cache and a packed batch rely on.
- Relative encoding does not make extrapolation safe. The PI paper shows a fitted attention-score function that stays within $`[-1, 1]`$ on the trained range and reaches values above 8000 outside it (Figure 2), and calls the RoFormer decay bound too loose to rule that out. YaRN's account: pairs whose wavelength $`\lambda_i = 2\pi b^{2i/d}`$ exceeds the trained length $`L`$ never complete a rotation in training, so long-range angles are new to the model.
- The four maps, with $`s = L'/L`$. PI divides positions by $`s`$. NTK-aware sets the base to $`b' = b\, s^{d/(d-2)}`$, which leaves the first pair unchanged and divides the last pair's frequency by exactly $`s`$. NTK-by-parts leaves pairs with $`L/\lambda_i > \beta`$ alone, divides pairs with $`L/\lambda_i < \alpha`$ by $`s`$ and ramps between ($`\alpha = 1`$, $`\beta = 32`$ for Llama). YaRN adds one scalar on the attention logits, $`1/t = (0.1 \ln s + 1)^2`$, applied by scaling both queries and keys by $`\sqrt{1/t}`$.
- Fine-tuning needs differ. PI needs a short fine-tune and is worse than the other maps without one in the small run of the reproduce step. NTK-aware works better than PI without fine-tuning, but the YaRN paper reports that fine-tuning with it gives inferior results to PI. With dynamic scaling the scale follows the current length, so cache keys before applying RoPE.

**Reproduce:** Closed-book, derive $`\langle R_m q, R_n k\rangle = \langle R_{m-n}\, q, k\rangle`$ pair by pair, then compute for head size 128, $`b = 10000`$, $`L = 4096`$, $`\alpha = 1`$, $`\beta = 32`$ the number of pairs with $`L/\lambda_i < 1`$, with $`L/\lambda_i > 32`$ and in the ramp (18, 21 and 25 of the 64 pairs). Compute the NTK-aware base for $`s = 8`$ (82,684.6) and check that the last pair's frequency ratio is 0.125 exactly. Implement RoPE with explicit position IDs and check in float64 that for random $`q, k`$ the score at positions (2, 5) equals the score at (12, 15), and that with PI at $`s = 4`$ the score at (40, 100) equals the unscaled score at (10, 25), so distance 60 looks like distance 15. Then measure: labeled example, not a target, from a 4-layer pre-norm decoder (width 128, 4 heads, head size 32, base 10000, byte-level text, 2500 steps at length 128, cosine schedule, one seed, PyTorch 2.14.1 on CPU, no fine-tuning at the longer lengths). Mean held-out next-byte loss in nats at length 128 was 1.119. At lengths 256, 512, 1024 and 2048 ($`s = 2, 4, 8, 16`$) direct extrapolation gave 2.008, 2.979, 3.657 and 4.241, PI 2.985, 3.802, 4.152 and 4.619, NTK-aware 1.437, 2.058, 2.789 and 3.580, NTK-by-parts 1.807, 2.568, 3.041 and 3.606, and YaRN 1.825, 2.613, 3.083 and 3.644. Your numbers will differ, and with another seed, model or corpus the ordering can too; compare methods across seeds rather than against this run.

**Traps**

- Applying position interpolation in the wrong direction. YaRN v3 Equation 9 writes $`g(m) = s \cdot m`$ with $`s = L'/L`$, which would stretch positions; its own Appendix A.1 Equation 16 and the PI paper use $`m L / L' = m / s`$. Divide by $`s`$.
- Taking the Modern LLM Notebook's Section 10 as YaRN. It describes NTK base change plus a per-dimension temperature, while YaRN's temperature is one scalar on all logits and the per-dimension step is the frequency ramp of NTK-by-parts. The notebook's `ExtrapolatableRoPE` implements the `yarn` strategy as NTK-aware only and marks it as simplified.
- Calling a method 'extended' from one perplexity number or one passkey test. In the small run in the reproduce step, YaRN's temperature did not help (its loss was slightly above NTK-by-parts at every length), and a 16-pair model is not a Llama. Compare methods at several lengths and seeds, and report whether any fine-tuning happened.

**Practice**

- [TensorTonic: Rotary Query and Key Embeddings](https://www.tensortonic.com/problems/cs336-l03-rotary-query-key-embeddings) - Free problem `cs336-l03-rotary-query-key-embeddings`, function `rotary_embed(q, k, positions, inv_freq)`. The three public cases check zero and one positions, a fractional angle from position 50 with `inv_freq=[0.01]`, and batch-specific position offsets of shape (B, S). The caller supplies the frequencies, so this is the place to plug in the PI, NTK-aware and NTK-by-parts maps. They do not test gradients or dtype. Add your own relative-offset and float16 tests.
- [Loss against length for four scaling methods on your own decoder](https://arxiv.org/abs/2309.00071v3) - YaRN Section 3 and Appendix A.2; write one function per map that returns inverse frequencies and a logit multiplier, test it against the exact numbers in the reproduce step, then repeat the measurement above. Use your own small decoder trained at a short length. Evaluate at 2, 4, 8 and 16 times that length without fine-tuning, with three seeds if your budget allows, and report which methods needed fine-tuning in the papers.

**Stop when:** Your RoPE passes the offset and PI-equivalence tests in float64, your four maps reproduce 18, 21, 25 and 82,684.6, and you have a loss-against-length table for your own model with the fine-tuning status stated.

<details>
<summary>Self-test</summary>

1. Show that the RoPE score depends only on $`m - n`$.
   - Per pair, $`R_{m\theta}^\top R_{n\theta} = R_{(n-m)\theta}`$, because rotations are orthogonal and compose by adding angles. So $`\langle R_m q, R_n k\rangle`$ is a function of $`q`$, $`k`$ and $`n - m`$ for every pair, hence of the position difference only.
2. For head size 128 and base 10000, what base does NTK-aware scaling use for $`s = 8`$, and what happens to the first and last pairs' frequencies?
   - $`b' = 10000 \cdot 8^{128/126} \approx 82{,}684.6`$. The first pair has $`\theta_0 = 1`$ either way and is unchanged. The last pair's frequency is multiplied by exactly $`1/8`$, as in position interpolation.
3. With PI at $`s = 4`$, what does the model see for two tokens that are 60 positions apart, and what is the cost?
   - They look 15 positions apart, because positions are divided by 4. The model never sees angles beyond the trained range, but all neighboring tokens are 4 times closer in angle, so local resolution drops. That is the reason a short fine-tune is needed.
4. For $`s = 8`$, what multiplier does YaRN apply to the attention logits, and how is it implemented without changing the attention code?
   - $`1/t = (0.1 \ln 8 + 1)^2 \approx 1.459`$ (so $`\sqrt{1/t} \approx 1.208`$). Scale both the queries and the keys by $`\sqrt{1/t}`$, for example by scaling the cached rotary cosine and sine tables.
5. A model passes a passkey test at 4 times its trained length with a scaled RoPE and no fine-tuning. What else do you need before you say it handles that length?
   - Loss or perplexity against length on held-out long documents, tasks that need information spread across the context, the same tests at the trained length (scaling can hurt there), and more than one seed or document set. A single retrieval test shows that one capability exists at that length.

</details>

#### U6. Sparse, linear, recurrent and state-space sequence mixers, and a bounded Mamba-2 style layer

**About 5 h** · **Target:** Explain + Implement

Topics: Sparse, linear, recurrent and state-space sequence mechanisms as distinct contracts; A bounded Mamba-2 or gated state-space implementation

Sub-quadratic mixers change the state the model carries, not just its cost. If you cannot say what the state can store, you cannot say what a hybrid gains or loses, and a speed claim hides the recall question.

**You can now**

- State, for softmax attention, sliding-window attention, linear attention, a gated state-space (Mamba-2 style) layer and a DeltaNet-style layer, the state size, the cost of training and of decoding one token, and what each cannot do.
- Show that causal linear attention and a gated scalar state-space layer have identical parallel (masked-matrix) and recurrent forms, and implement a chunked version that matches the recurrence.
- Explain why these mixers are different contracts, not drop-in replacements for attention, and what a fair hybrid comparison must hold fixed.

**Study**

1. [CS336 Spring 2026, Lecture 4 slides (attention alternatives and mixtures of experts)](https://github.com/stanford-cs336/lectures/blob/main/lecture_04.pdf) (CS336 2026 - Architectures and Attention Alternatives) - Slides 2 to 13: the local-plus-global toolkit, linear attention and its recurrent form, MiniMax M1, from linear attention to Mamba-2, Nemotron 3, gated DeltaNet, Qwen next, hybrid performance and sparse adaptation (DSA). Depth: Stop at slide 13; slide 14 starts mixture of experts. Slide 4 reorders $`QK^\top V = Q(K^\top V)`$ without the causal mask, and slide 11 says there are few controlled ablations of hybrids.
2. [CS336 Spring 2026, Lecture 3 slides](https://github.com/stanford-cs336/lectures/blob/main/lecture_03.pdf) (CS336 2026 - Architectures and Attention Alternatives) - Slides 64 to 66 (sparse and sliding-window attention, interleaving full and local layers).
3. [Transformers are SSMs: Generalized Models and Efficient Algorithms Through Structured State Space Duality (arXiv:2405.21060)](https://arxiv.org/abs/2405.21060v1) (Transformers are SSMs: Generalized Models and Efficient Algorithms Through Structured State Space Duality (Dao and Gu, 2024)) - Section 1; Section 5.1 to 5.3 (scalar-identity SSMs, 1-semiseparable masked attention, the duality); Section 6 and Listing 1 (printed p. 21, the chunked SSD algorithm and `segsum`). Depth: Skip Sections 3 and 4 (the structured-matrix and kernel-attention theory) and everything after Section 7.1. Listing 1 uses `rearrange` from einops.
4. [Modern LLM Notebook: Efficient Attention](https://github.com/walkinglabs/modern-llm-notebook/blob/979eecf09669121167184ef925d8edbc089fc13e/notebooks-en/part4-frontiers/30-efficient-attention.ipynb) (Modern LLM Notebook - Architecture Frontiers) - Sections 2.1 to 2.9 (linear attention, its sharpness cost, SSMs, selective SSM, Mamba-2, Lightning Attention, hybrids). Depth: The code in 2.1 and in Homework 2 on vectorized linear attention is non-causal, and the 'fast' form in 2.1 reuses the quadratic normalizer. The Jamba row in 2.9 says '24 Mamba : 8 Attention' and 'one attention layer every 8 layers', which disagree.

**Focus**

- Write each mixer by its state. Softmax attention keeps the whole KV cache, which grows with length. Sliding-window attention keeps the last $`w`$ keys and values. Linear attention keeps $`S_t = S_{t-1} + k_t v_t^\top`$, a $`d_k \times d_v`$ matrix, and reads $`y_t = S_t^\top q_t`$. A Mamba-2 style layer adds a scalar gate, $`S_t = \gamma_t S_{t-1} + k_t v_t^\top`$. The DeltaNet rule $`S_t = \gamma_t (I - \beta_t k_t k_t^\top) S_{t-1} + \beta_t k_t v_t^\top`$ can erase what a key already holds.
- The duality is exact for the scalar-gate case. The recurrent form and the masked-matrix form $`Y = (L \circ C B^\top) X`$ with $`L_{ts} = \gamma_{s+1} \cdots \gamma_t`$ compute the same function, so you can train in the matrix or chunked form and decode with the recurrence. Section 5.1 states the result for a scalar times identity $`A`$; it is not a statement about every selective SSM.
- A fixed state stores a bounded number of associations. With $`d_k`$ orthonormal keys the read returns each value exactly; a repeated key adds to the old value in linear attention (reading it returns the sum), while the DeltaNet rule overwrites it. Gates decide what is forgotten. Softmax attention can look up any earlier token, so recall is where hybrids keep a few full-attention layers.
- The cost you quote must name the form. The reordering $`Q(K^\top V)`$ is valid without a causal mask. With the mask it becomes a scan, or chunks inside which you use the matrix form, as in Listing 1. FLOPs are linear in length for the scan, but the chunked algorithm is what makes it fast on matrix hardware.

**Reproduce:** Closed-book, show that $`\sum_{s \le t} (q_t \cdot k_s) v_s`$ equals $`q_t^\top S_t`$ for $`S_t = \sum_{s \le t} k_s v_s^\top`$, and extend it to the gated form with $`L_{ts}`$ above. Then run the chunked algorithm of Listing 1 against a plain recurrence in float64 for $`B = 2`$, $`T = 16`$, 3 heads, head size 5, state size 4, log-gates $`A_t = -u`$ with $`u`$ uniform in $`[0, 1)`$, chunk length 4. Outputs and final state should agree to about 1e-15 (1.8e-15 and 8.9e-16 in one run, PyTorch 2.14.1 on CPU), chunk lengths 4 and 8 should agree with each other, the masked-matrix form should agree with the recurrence, and splitting the sequence in two and passing the first final state as `initial_states` to the second call should reproduce the full run. Finally check the interference example: keys $`e_1, e_2, e_1`$ with values $`v_1, v_2, v_3`$ (the unit vectors of 3 dimensions). Reading $`e_1`$ gives $`[1, 0, 1]`$ in linear attention and $`[0, 0, 1]`$ under the DeltaNet rule with $`\gamma = \beta = 1`$.

**Traps**

- Using the unmasked reordering for a decoder. For random $`Q, K, V`$ with 6 tokens, $`(QK^\top \text{ masked}) V`$ and $`Q(K^\top V)`$ differ in every row but the last. Test the causal identity row by row, and test that changing a future token leaves earlier outputs unchanged.
- Reading 'Transformers are SSMs' as 'any SSM equals attention'. The duality needs the scalar-gate structure, and the result says nothing about quality. A model with a fixed state compared with softmax attention at equal parameters can still fail recall tasks. Test with an associative-recall or copy task, not only loss.
- Treating a hybrid's gain as an architecture result without controls. Slide 11 of Lecture 4 says there are few controlled ablations; a published hybrid changes layer ratio, depth, width and data together. Hold parameters, tokens and sequence length fixed and vary one thing.

**Practice**

- [TensorTonic: Parallel and Recurrent Linear Attention](https://www.tensortonic.com/problems/cs336-l04-linear-attention-duality) - Free problem `cs336-l04-linear-attention-duality`, function `linear_attention_duality(q, k, v)`. The three public cases check a scalar two-step sequence, orthogonal keys, and independent batches with unequal widths; the function returns both forms and the final state. There is no feature map or normalizer and no gate. They do not test the gated form. Extend your solution with a scalar gate and compare it with the Listing 1 oracle.
- [A bounded Mamba-2 style layer](https://arxiv.org/abs/2405.21060v1) - Listing 1 in Section 6; implement the chunked algorithm and a recurrent oracle, then wrap them in a layer with input projections to $`X`$, $`B`$, $`C`$ and a per-head gate. Keep it small: no convolution and no gated normalization. Tests to write: chunk-length invariance, recurrence equality in float64, split-sequence equality with carried state, and future-token invariance. Optional: swap in your layer for half the attention layers of your decoder and compare under a matched contract.

**Stop when:** Your chunked scan matches the recurrence, the masked-matrix form and the split-sequence run in float64, and you can fill in a table of state size, training cost, decoding cost and recall behavior for five mixers.

<details>
<summary>Self-test</summary>

1. Per head, what is the decoding state of softmax attention, sliding-window attention with window $`w`$, and linear attention, and how does the per-token decoding cost scale in each?
   - Softmax attention: keys and values for all $`T`$ past tokens, cost $`O(T d)`$ per token. Sliding window: the last $`w`$ keys and values, $`O(w d)`$. Linear attention: one $`d_k \times d_v`$ matrix, $`O(d_k d_v)`$, independent of $`T`$.
2. For the gated recurrence $`S_t = \gamma_t S_{t-1} + k_t v_t^\top`$, write the matrix $`M`$ with $`Y = MX`$.
   - $`M_{ts} = (q_t \cdot k_s) \prod_{r=s+1}^{t} \gamma_r`$ for $`s \le t`$ and 0 otherwise. The product of gates is the 1-semiseparable mask $`L`$, and $`M = L \circ (C B^\top)`$ in the paper's notation.
3. Why does the reordering of slide 4 not apply directly to a causal decoder?
   - The causal mask zeroes the entries above the diagonal of $`QK^\top`$ before multiplying by $`V`$. The matrix $`K^\top V`$ sums over all positions, including future ones, so $`Q(K^\top V)`$ leaks the future. The causal version is a running sum, either a scan or a chunked algorithm.
4. A layer with state $`d_k \times d_v`$ with $`d_k = 2`$ has stored two associations with orthonormal keys. What does a third write with a new key do in linear attention and in the DeltaNet rule?
   - The new key lies in the span of the two existing ones, so its value adds into the same state entries. Reads of the old keys are perturbed in linear attention. The DeltaNet rule first removes what the new key already retrieves, which changes the old reads as well. A fixed state cannot keep more independent associations than its key dimension.
5. Name three things a hybrid-versus-attention comparison must hold fixed.
   - Parameters (or compute) counted from the actual models, training tokens and data order, and sequence length, plus the optimizer and learning-rate tuning budget for each arm. It also needs a recall-sensitive evaluation next to loss, and more than one seed.

</details>

#### U7. Sparse MoE routing, expert capacity, dispatch and expert-parallel communication

**About 4 h** · **Target:** Derive + Implement

Topics: Sparse MoE routing, expert capacity, dispatch and token ownership; Expert-parallel communication implications without implementing the distributed runtime

A sparse layer separates parameters from compute, but it also makes each token's output depend on the other tokens in its batch, because capacity is shared. You need the dispatch rule before you can write an honest test for causality, determinism or an equal-compute comparison.

**You can now**

- Derive router probabilities, top-k selection, expert capacity, dispatch counts and dropped tokens for a small example by hand, and reproduce them in code.
- Implement a sparse expert layer with dispatch, capacity, combine and dropped-token handling, and test it against a per-token loop.
- Derive the per-layer all-to-all payload of expert parallelism from the token count, $`k`$, the capacity factor and the model width, without implementing the distributed runtime.

**Study**

1. [CS336 Spring 2026, Lecture 4 slides (mixtures of experts)](https://github.com/stanford-cs336/lectures/blob/main/lecture_04.pdf) (CS336 2026 - Architectures and Attention Alternatives) - Slides 14 to 35 (what an MoE is, routing types, top-k routing in detail, shared and fine-grained experts, the expert-setup table) and slides 44 to 47 (systems side, MegaBlocks, communication, the stochasticity of token dropping). Depth: Stop at slide 47. Slides 36 to 43 (training the router and balancing losses) belong to the next unit, and slides 54 to 59 are a DeepSeek case study.
2. [Switch Transformers (arXiv:2101.03961v3, JMLR version)](https://arxiv.org/abs/2101.03961v3) (Switch Transformers) - Section 2.1 (Equations 1 and 2, why a gate value keeps the router differentiable), Section 2.2 (Equation 3, expert capacity, dropped tokens) and Figure 3 (capacity factors), Section 5.4 (expert and data parallelism); Appendix F as a pseudocode reference for dispatch and combine tensors. Depth: Appendix F is a reference to read once; do not port it.
3. [Build a Large Language Model (From Scratch), companion bonus code](https://github.com/rasbt/LLMs-from-scratch/tree/ec0bac5e1d854306a8ea6c308da49aae22479bd1/ch04/07_moe) (Build a Large Language Model (From Scratch), Chapters 3 and 4) - `ch04/07_moe`: README and `MoEFeedForward` in `gpt_with_kv_moe.py`. Depth: It groups tokens by expert but has no capacity limit, so nothing is ever dropped. It also has no balancing loss.
4. [Modern LLM Notebook: From Dense to MoE Architectures](https://github.com/walkinglabs/modern-llm-notebook/blob/979eecf09669121167184ef925d8edbc089fc13e/notebooks-en/part2-training/13-moe.ipynb) (Modern LLM Notebook - Architecture Frontiers) - Sections 1 to 3 and Section 5 (the parameter-versus-compute argument and the inference-memory consequence). Depth: Its `MoELayer` loops over tokens in Python and has no capacity; use it for the routing rule, not for dispatch. Section 4 (load balancing) is for the next unit.

**Focus**

- Two router conventions. Switch and DeepSeek's first models take a softmax over all $`E`$ experts, then the top-$`k`$ probabilities as gate values. Mixtral-style routers take the top-$`k`$ logits, then a softmax over just those. They agree for $`k \ge 2`$ only up to a renormalization, and they differ in an important way at $`k = 1`$: a softmax over one logit is the constant 1, so the router gets no gradient from the language-model loss.
- Capacity is a per-expert, per-batch limit: $`C = \lceil \text{cf} \cdot k\,T / E \rceil`$ for $`T`$ tokens in the group that shares the buffer. Switch's Equation 3 is the $`k = 1`$ case; with top-$`k`$ there are $`kT`$ assignments to spread over $`E`$ experts. A token that arrives after an expert is full is not computed for that expert, and passes on through the residual connection. Which tokens lose a slot is a rule you must choose and test, for example token order within the group.
- A drop is silent. The loss still goes down, so track the dropped fraction per layer and per batch. Switch reports under 1% with its balancing loss. Because capacity is shared across the batch, a token's output can depend on its neighbors; Lecture 4 slide 47 points out that other requests can drop your token.
- Expert parallelism sends tokens to the device that holds their expert and brings the results back, so each MoE layer does two all-to-alls in the forward pass and two in the backward pass. With fixed-size capacity buffers the payload is set by the capacity, not by the actual routing, and only the fraction $`(P-1)/P`$ leaves the device.

**Reproduce:** By hand, route 8 tokens to 4 experts with top-1 assignments $`[0, 0, 0, 0, 0, 1, 2, 3]`$, counts $`[5, 1, 1, 1]`$. With capacity factor 1.0 the capacity is 2, tokens 2, 3 and 4 are dropped, and the dropped fraction is 0.375. With 1.25 the capacity is $`\lceil 2.5 \rceil = 3`$ and tokens 3 and 4 are dropped (0.25). With 2.5 the capacity is 5 and nothing is dropped. Then derive the payload for 8192 tokens per device, width 4096, bfloat16, $`k = 2`$, capacity factor 1.25 and 8 expert-parallel devices: $`1.25 \cdot 2 \cdot 8192 \cdot 4096 \cdot 2 \cdot \tfrac{7}{8} = 146{,}800{,}640`$ bytes, exactly 140 MiB, per all-to-all per device. Finally implement dispatch (position in expert from a cumulative sum of the assignment mask), expert computation on the gathered tokens, and combine with gate weights, and check it against a per-token loop with the capacity set high enough that nothing drops. In float32 on random inputs the two should agree to about 1e-6.

**Traps**

- Using a softmax over the selected logits when $`k = 1`$. In a 6-token, 8-wide toy router (PyTorch 2.14.1), the gate values were exactly 1.0 and the summed absolute gradient of the router weights was 0.0, against 46.2 when the softmax was taken over all experts before the top-1. TensorTonic's router returns weight 1 for $`k = 1`$ because it renormalizes over the selected experts, which is correct for its statement and has this consequence.
- Testing an MoE layer for causality or batch independence with capacity pressure on. A dropped token makes a layer's output depend on which other tokens share the buffer, and a priority by router score can let a later token take an earlier token's slot. Turn drops off (capacity at least $`T`$) for equivalence tests, and test the drop path separately with a fixed priority rule.
- Counting capacity from tokens rather than assignments for $`k > 1`$, or forgetting that two assignments of one token go to different experts. Check that a token's $`k`$ experts are distinct, and that the sum of the dispatched counts equals $`kT`$ minus the drops.

**Practice**

- [TensorTonic: Top-k MoE Router with Load Statistics](https://www.tensortonic.com/problems/cs336-l04-topk-moe-router) - Free problem `cs336-l04-topk-moe-router`, function `topk_moe_router(x, w_router, expert_outputs, shared_output, k)`. The three public cases check top-2 routing with a tie broken toward the lower expert index, a single selected expert, and a case where every expert ties, and they return the selected experts, their weights, the dispatched fraction $`f_e`$ and the mean router probability $`m_e`$. Expert outputs are given in advance. There is no capacity, no dropping and no gradient check. Add your own tests for capacity and dropped tokens (the hand example above), distinct experts per token, and a gradient test of the router.
- [Capacity and dispatch on top of your own router](https://arxiv.org/abs/2101.03961v3) - Section 2.2 and Appendix F; build dispatch and combine with a fixed priority rule and a switch that turns drops off. Tests to write: equal to the per-token loop with no drops, the hand example above, the sum of dispatched counts equals $`kT`$ minus the drops, dropped tokens leave only the residual, and the router weights receive a nonzero gradient. The section mini-project reuses this layer.

**Stop when:** Your dispatch matches the per-token loop with drops off, reproduces the 0.375, 0.25 and 0 dropped fractions of the hand example, and you can derive the all-to-all payload for a configuration you choose.

<details>
<summary>Self-test</summary>

1. A group has 4096 tokens, 64 experts, $`k = 2`$ and a capacity factor of 1.25. What is the expert capacity?
   - $`\lceil 1.25 \cdot 2 \cdot 4096 / 64 \rceil = 160`$ tokens per expert. The ideal load is 128 assignments per expert, and the factor adds a 25% buffer.
2. Eight tokens are assigned to experts $`[0, 0, 0, 0, 0, 1, 2, 3]`$ with capacity 3 and token order as priority. Which tokens are dropped and what is the dropped fraction?
   - Tokens 3 and 4, the fourth and fifth arrivals at expert 0, so the fraction is 2/8 = 0.25. The other tokens fit, since experts 1 to 3 hold one token each.
3. Why does a top-1 router with a softmax over the selected logit never learn from the language-model loss, and what fixes it?
   - The gate value is $`\operatorname{softmax}`$ of one number, which is always 1, so the output has no dependence on the router logits except through the discrete choice, which has no gradient. Take the softmax over all experts first and multiply the expert output by the selected probability, as Switch does, or use a balancing loss as the only router signal (which is not enough by itself).
4. Give the all-to-all payload per device for 4096 tokens, width 2048, bfloat16, $`k = 1`$, capacity factor 1.0 and 4 devices. Does a more balanced router change it with fixed buffers?
   - $`1.0 \cdot 1 \cdot 4096 \cdot 2048 \cdot 2 \cdot \tfrac{3}{4} = 12{,}582{,}912`$ bytes (12 MiB) per all-to-all. With fixed-size buffers, no: the payload is set by the capacity. Balance changes how many slots hold real tokens and how many are padding.
5. Why must a causal-prefix test of an MoE layer run with drops disabled?
   - With drops, a token's output depends on the other tokens competing for the same expert buffer. Under a rule that lets a later token take a slot from an earlier one, a future token can change a past token's output, which breaks prefix invariance by design of the dispatch rule, not by a mask bug. With capacity at least the token count nothing is dropped, and the layer is a function of each token alone.

</details>

#### U8. Load-balancing losses, router z-loss, dropped tokens and expert collapse

**About 4 h** · **Target:** Implement + Measure

Topics: Auxiliary load balancing, router z-loss, dropped tokens and expert collapse

A router is trained only through the gate values, so nothing in the language-model loss asks it to use every expert. Imbalance wastes capacity and drops tokens silently, and the fixes (a balancing loss, a z-loss, a capacity factor) each add a coefficient that you have to justify with measurements.

**You can now**

- Implement the Switch load-balancing loss and the router z-loss, and derive their values and gradients on a small example.
- Instrument a small MoE decoder with per-layer expert load, dropped fraction and router statistics, and recognize imbalance and expert collapse from them.
- Run a balance, capacity and z-loss campaign with several seeds and report which effects exceed the seed spread.

**Study**

1. [Switch Transformers (arXiv:2101.03961v3, JMLR version)](https://arxiv.org/abs/2101.03961v3) (Switch Transformers) - Section 2.2: Equations 4 to 6 (the differentiable load-balancing loss, the $`\alpha = 10^{-2}`$ sweep and the dropped-token rate), Figure 3 (capacity factors); Section 2.4 with Table 2 (selective precision) and Table 3 (smaller initialization); Appendix B (No-Token-Left-Behind) as depth.
2. [ST-MoE: Designing Stable and Transferable Sparse Expert Models (arXiv:2202.08906v2)](https://arxiv.org/abs/2202.08906v2) (ST-MoE: Designing Stable and Transferable Sparse Expert Models (Zoph et al., 2022)) - Section 3.3 (Equations 5 and 6, the router z-loss and $`c_z = 0.001`$, Table 4), Section 3.4 and Figure 2 (precision and roundoff), Section 5.2 and Table 8 (capacity factor and routing), Appendix A (token load balance) and Appendix B (z-loss dynamics, Figure 7). Depth: The setting is a T5 encoder-decoder trained with Adafactor. Skip Sections 4, 6 and 7 (fine-tuning, the 269B model, expert specialization).
3. [CS336 Spring 2026, Lecture 4 slides](https://github.com/stanford-cs336/lectures/blob/main/lecture_04.pdf) (CS336 2026 - Architectures and Attention Alternatives) - Slides 36 to 43 (training the router: reinforcement learning, stochastic jitter, balancing losses, DeepSeek's per-expert bias, what happens without balancing) and slides 47 to 49 (token-dropping stochasticity, router stability and z-loss).
4. [Modern LLM Notebook: From Dense to MoE Architectures](https://github.com/walkinglabs/modern-llm-notebook/blob/979eecf09669121167184ef925d8edbc089fc13e/notebooks-en/part2-training/13-moe.ipynb) (Modern LLM Notebook - Architecture Frontiers) - Section 4 and Section 4.1 (load balancing, the bias update, and the table of metrics to print every few steps). Depth: Its simplified loss in Section 4 is not the Switch loss; see the traps.

**Focus**

- The Switch loss is $`\alpha N \sum_i f_i P_i`$, with $`f_i`$ the fraction of tokens whose top choice is expert $`i`$ and $`P_i`$ the mean router probability. $`f_i`$ comes from an argmax and carries no gradient; all of the gradient reaches the router through $`P_i`$, with size proportional to $`f_i`$ (slide 40: more frequent use means a stronger push down). The factor $`N`$ keeps the uniform value at $`\alpha`$ for any number of experts.
- The router z-loss is $`L_z = \frac{1}{B}\sum_i \left(\log \sum_j e^{x_j^{(i)}}\right)^2`$ on the router logits, added with weight $`c_z = 0.001`$ (ST-MoE Equations 5 and 6). It keeps router logits small, which matters because large numbers have large roundoff in bfloat16 (ST-MoE Figure 2 gives up to 65,536 times worse than float32). In their Table 4, tightening Adafactor's update clipping stabilized 3 of 3 runs but cost about 2.5 points of quality (-4.206 against -1.755), while the z-loss stabilized 3 of 3 at no loss in quality (baseline: 4 of 6 stable).
- Imbalance has three symptoms to log per layer: the load histogram (maximum load against $`1/E`$), the dropped fraction at your capacity factor, and the router entropy or the share of experts below a small fraction of the ideal load. Total loss can fall while a layer routes most tokens to a few experts, and averaging across layers hides a collapsed layer.
- The three controls interact. A balancing loss moves load toward uniform at the cost of the router's freedom, a higher capacity factor trades wasted compute and memory for fewer drops, and the z-loss shapes logit scale, not balance. ST-MoE recommends top-2 routing with capacity factor 1.25 in its setting. Sweep one control at a time, with seeds.

**Reproduce:** Closed-book, derive for 8 tokens, 4 experts and top-1 counts $`[5, 1, 1, 1]`$ that $`f = [0.625, 0.125, 0.125, 0.125]`$ and that the Switch loss is $`\alpha`$ when the mean router probability $`P`$ is uniform and $`1.75\alpha`$ when $`P = f`$; with $`P = f`$ the loss is $`\alpha N \sum_i f_i^2`$, which is smallest, $`\alpha`$, at uniform load. Show that the gradient with respect to $`p_i(x)`$ is $`\alpha N f_i / T`$. For router logits $`[2, 0, -1]`$ show $`\log Z = 2.16985`$, $`L_z = 4.708`$ and $`c_z L_z = 0.004708`$ at $`c_z = 0.001`$. Then implement both losses in a small MoE decoder and measure. Labeled example, not a target: 4 layers, width 128, 8 SwiGLU experts of width 128, top-2 routing with softmax over all experts and renormalized gates, router in float32, byte-level text (2 MB of JSON files, 90/10 split), 600 steps of 16 sequences of 128 tokens, AdamW with betas 0.9 and 0.95, learning rate 3e-3 with 30 warmup steps, no weight decay, 2 seeds, PyTorch 2.14.1 on CPU. Validation cross-entropy (seed 0, seed 1), dropped fraction and mean over layers of the largest expert load (ideal 0.125), over the last 50 steps: no balancing loss, capacity factor 1.0: 1.450, 1.479, 0.450, 0.373; $`\alpha = 0.01`$, 1.0: 1.398, 1.370, 0.105, 0.176; no balancing loss, 1.25: 1.485, 1.477, 0.325, 0.369; $`\alpha = 0.01`$, 1.25: 1.379, 1.338, 0.042, 0.193; $`\alpha = 0.01`$ with $`c_z = 0.001`$, 1.25: 1.369, 1.302, 0.037, 0.186; $`\alpha = 0.1`$, 1.25: 1.385, 1.322, 0.031, 0.183. Paired by seed at capacity factor 1.25, the balancing loss lowered validation loss by 0.106 and 0.139, but the z-loss effect (0.010 and 0.036) and the $`\alpha = 0.1`$ against 0.01 effect (+0.006, -0.016) are smaller than the gap between the two seeds within a configuration (0.04 to 0.07 in the balanced runs), so two seeds cannot resolve them.

**Traps**

- Using the notebook's simplified balancing loss, the sum over experts of $`(\text{actual load} - \text{ideal load})^2`$. Loads are counts of discrete choices, so this has no gradient path to the router and adds nothing to training. The Switch loss gets its gradient through the differentiable $`P_i`$.
- Reading one summary number as 'collapsed' or 'fine'. In the run above the unbalanced router did not kill any expert but sent the largest expert about three times its ideal share (0.37 against 0.125) and dropped 32% to 45% of assignments; only a per-layer histogram and the dropped fraction show that. A mean over layers can hide one collapsed layer.
- Carrying a coefficient from one setting to another. The values $`\alpha = 10^{-2}`$ and $`c_z = 10^{-3}`$ come from T5-style encoder-decoder models, and the router z-loss is a different term from OLMo 2's z-loss on the output logits (whose weight is given as $`10^{-4}`$ in the text and $`10^{-5}`$ in Table 1). Sweep your own, with the seed spread beside the result.

**Practice**

- [TensorTonic: Top-k MoE Router with Load Statistics](https://www.tensortonic.com/problems/cs336-l04-topk-moe-router) - Free problem `cs336-l04-topk-moe-router`: the returned `token_fraction` ($`f_e`$) and `probability_mass` ($`m_e`$) are the two vectors of the Switch loss. The public cases check these vectors on small inputs. For the first case the expected `token_fraction` is `[0.5, 0.5, 1]` and `probability_mass` is `[0.288841, 0.288841, 0.422319]`. Build the Switch loss and the router z-loss on top of your solution, and add your own gradient tests: the loss equals $`\alpha`$ at uniform load, and no gradient reaches the router through $`f`$.
- [A balance, capacity and z-loss campaign on a small MoE decoder](https://arxiv.org/abs/2202.08906v2) - ST-MoE Section 3.3 and Appendix B (z-loss coefficient sweep, Figure 7) as the template; vary the balancing coefficient, the capacity factor and the z-loss one at a time. Use at least 3 seeds with paired data order, log per-layer load histograms, dropped fraction and router entropy, and report each effect next to the seed spread. The section mini-project reuses the router and the logging.

**Stop when:** Your balancing loss equals $`\alpha`$ at uniform routing and $`1.75\alpha`$ on the hand example, its gradient reaches the router only through the probabilities, and your campaign table shows each effect next to the seed spread.

<details>
<summary>Self-test</summary>

1. For 8 tokens and 4 experts with top-1 counts $`[5, 1, 1, 1]`$, what is the Switch loss divided by $`\alpha`$ if the mean router probabilities are uniform, and if they equal the load fractions?
   - $`N \sum f_i P_i`$ with $`N = 4`$: uniform $`P = 0.25`$ gives $`4 \cdot 0.25 \cdot 1 = 1.0`$; $`P = f`$ gives $`4 \cdot (25 + 1 + 1 + 1)/64 = 1.75`$. With $`P = f`$ the value is $`N \sum_i f_i^2`$, whose minimum, 1.0, is reached at uniform load. Over all batches it is not a strict minimum, because argmax counts and mean probabilities can disagree and give less than 1.0.
2. Why does the balancing loss push down the probability of overloaded experts and not touch the counts directly?
   - The counts come from an argmax, which has no gradient. The gradient with respect to the router probability $`p_i(x)`$ is $`\alpha N f_i / T`$, so experts with a larger load fraction receive a larger push to lower their probability.
3. Compute the router z-loss contribution for one token with logits $`[2, 0, -1]`$ and $`c_z = 0.001`$, and say which direction its gradient pushes.
   - $`\log Z = \log(e^2 + 1 + e^{-1}) = 2.16985`$, so $`c_z (\log Z)^2 = 0.004708`$. The gradient on logit $`j`$ is $`2 c_z \log Z \cdot \operatorname{softmax}(x)_j`$, positive for every logit, so it pulls all logits down in proportion to their probability.
4. A layer drops 30% of its assignments, but validation loss looks normal. What do you check and change?
   - Check whether the loss is better with a larger capacity factor or a stronger balancing loss at the same tokens, and check per-layer loads. Dropped tokens still flow through the residual path, so the loss can look normal while the layer wastes capacity. The remedy trades compute and memory (capacity factor) against router freedom (balancing).
5. Why is a router softmax usually computed in float32 even in a bfloat16 model, and what does the z-loss add?
   - The exponential amplifies rounding error in large logits, and bfloat16 numbers of large magnitude have large roundoff (ST-MoE Figure 2). Float32 gives a precise softmax, and the z-loss keeps the logits small so the same error matters less.

</details>

#### U9. Activation and gradient scale diagnostics, and shape, mask, position and dtype property tests

**About 4 h** · **Target:** Implement + Measure

Topics: Activation and gradient-scale diagnostics across layers and sequence lengths; Shape, causal, position-offset, dtype and long-context property tests

Every architecture variant in this section can fail silently: a flipped mask, a position offset that drifts in float32, a norm that upcasts and spoils a gradient check. The tests and scale logs are what let you say a measured difference comes from the mechanism and not from a bug.

**You can now**

- Log per-layer activation norms, gradient norms and maximum attention logits in a decoder without retaining graphs, and summarize them with OLMo 2's growth exponent.
- Write a property-test battery for a decoder variant (shape, causal prefix, position offset, padding, batch independence, dtype and finite-difference gradients) and show that each test fails on a seeded defect.
- Choose a test tolerance from the dtype and the position offset instead of one fixed constant.

**Study**

1. [2 OLMo 2 Furious (arXiv:2501.00656v3)](https://arxiv.org/abs/2501.00656v3) (OLMo 2 Open Model and Training Recipe) - Section 3.2, the paragraphs Gradient and activation growth (the growth exponent, Figure 5), Hyperparameter transfer across width (Figure 6) and Spike score (page 14).
2. [Small-Scale Proxies for Large-Scale Transformer Training Instabilities (arXiv:2309.14322v2)](https://arxiv.org/abs/2309.14322v2) (Small-Scale Proxies for Large-Scale Transformer Training Instabilities (Wortsman et al., 2023)) - Figures 2 and 4 as instrumentation designs (maximum attention logit per layer, output logit mean); the Figure 9 caption and Section 3.3 on predicting attention logit growth from scale. Depth: You read Section 3.1 for the mechanisms. Here read only what each figure logs and how often. Section 3.3 tested one prediction from the small models (a 4.8B model at learning rate 1e-2 diverged, as the fit predicted): one confirmed case, not a guarantee for your run.
3. [CS336 Assignment 1 handout](https://github.com/stanford-cs336/assignment1-basics/blob/main/cs336_assignment1_basics.pdf) (CS336 2026 - Architectures and Attention Alternatives) - Section 7.2.3 (debugging tips: overfit one minibatch, monitor activation, weight and gradient norms; p. 40) and the model tests in `tests/test_model.py`.
4. [Roadmap-Final project: Decoder-Only Transformer Stack](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-2/decoder-only-transformer-stack.md) (Decoder-Only Transformer Stack) - Milestone A (future-token intervention), Milestone D (the defect-injection list) and Failure-injection requirements.
5. [CS336 Spring 2026, Lecture 3 slides](https://github.com/stanford-cs336/lectures/blob/main/lecture_03.pdf) (CS336 2026 - Architectures and Attention Alternatives) - Slides 52 to 56 (what the stability tricks protect).

**Focus**

- Log from hooks on detached tensors, every few steps, and keep the numbers as Python floats. Per layer: the root mean square of the residual stream, the gradient norm of one weight per sublayer, and the maximum attention logit. Per run: the mean of $`\log Z`$ over output logits. A hook that keeps a tensor with its graph leaks memory, and one that calls `.item()` every layer every step adds synchronizations.
- OLMo 2 summarizes growth with $`\lambda = \frac{1}{n_{\text{layers}}} \log\left(\|v'\| / \|v\|\right)`$, where $`v`$ and $`v'`$ are the average activation (or gradient) vectors at the first and last layer. A constant per-layer gain $`g`$ gives $`\lambda = \log g`$, so ideal is 0. It averages over documents and positions, so also compute it at several sequence lengths and note that it hides a profile that rises then falls.
- Choose the oracle per property. Prefix invariance is exact in the same shapes (0.0 in the example). Position-offset invariance is exact in real arithmetic but not in floating point, because the rotation angle is the product of the position and the frequency, so its error grows with the offset. Padding invariance needs an attention mask for left padding. Gradient checks need a float64 path with no hard-coded float32 inside.
- A test that cannot fail proves nothing. For each property, seed one defect (flipped mask, ignored offset, angles in float32, wrong group mapping, norm over the wrong axis) and check the test goes red, then remove it. The A1 tests compare outputs with stored snapshots of the baseline model. They pin the baseline against regression and do not test causality or offsets directly.

**Reproduce:** On a tiny decoder (vocabulary 64, width 32, 2 layers, 4 query heads, 2 KV heads, FFN width 64, RoPE, RMSNorm, random weights), implement the battery and run it. Labeled example, not a target (PyTorch 2.14.1, CPU, four runs with unseeded inputs): changing the last 12 of 24 tokens left the first 12 logits identical (difference 0.0) in float32 and float64; flipping the mask made the same test fail with differences of 2.0 to 2.7. Shifting all positions by 0, 1000, 4096 and 100000 changed float64 logits by 0 and then about 1e-14, 3e-14 and 1e-12, and float32 logits differed from the float64 reference by under 1e-6, about 5e-6, 2e-5 and 5e-4. Computing the angles in float32 inside a float64 model reproduced the float32 error at offset 100000 (about 5e-4), and the offset test caught it. Random content in right padding changed nothing (0.0); left padding with correct position ids but no attention mask changed the real tokens' logits by 1.6 to 2.7. Float64 finite-difference checks on entries of a key projection (step 1e-6, central differences) gave relative errors between 1e-9 and 6e-8. Your values will differ; the pattern to reproduce is exact zero, error that grows with the offset in float32, and every seeded defect going red.

**Traps**

- One tolerance for every test. In float32 the position-offset error is under 1e-6 at offset 0 and 5e-4 at offset 100000, so a fixed 1e-5 either fails a correct model at long offsets or is too loose to catch a defect at short ones. Set the tolerance from the offset and the dtype, and compare against a float64 reference.
- A float64 gradient check through a stack that upcasts internally. In one toy decoder, a norm and a softmax that cast to float32 gave relative errors of 0.07 to 1.0 on the same entries that gave 1e-9 after the casts were made dtype-aware. The check measured float32 noise, not the gradient. Promote to at least float32 (`torch.promote_types`), not to exactly float32.
- Calling padding handled because right padding passes. A causal mask alone makes right padding harmless. Left padding changes which keys are visible, so it needs an attention mask as well as shifted position ids.

**Practice**

- [CS336 Assignment 1 model tests as a baseline, then your own battery](https://github.com/stanford-cs336/assignment1-basics/blob/main/tests/test_model.py) - `test_transformer_lm`, `test_transformer_lm_truncated_input`, `test_rope`, `test_multihead_self_attention_with_rope` run through `tests/adapters.py`. These compare outputs with stored snapshots at `atol` 1e-4 or 1e-5, so they guard the baseline path. Then write the battery above for your variant, with one seeded defect per test. The section mini-project covers this battery and the per-layer scale log on your variant.

**Stop when:** Every property test passes on your baseline and variant, each goes red on its seeded defect, and you have a per-layer scale table (stream norm, gradient norm, maximum attention logit, growth exponent) for two depths or two sequence lengths.

<details>
<summary>Self-test</summary>

1. Per-layer activation norm grows by a factor of 1.05 each layer in a 48-layer model. What is the growth exponent and what is the ratio of last-layer to first-layer norm?
   - $`\lambda = \log 1.05 \approx 0.049`$ and the ratio is $`1.05^{48} \approx 10.4`$. A small positive exponent compounds into an order of magnitude over depth.
2. Why can't a RoPE position-offset test demand exact equality in float32 at offset 100000, and what is the spacing of float32 numbers near that angle?
   - The angle is position times frequency, about $`10^5`$ for the fastest pair, and float32 numbers in $`[65536, 131072)`$ are spaced $`2^{-7} \approx 0.0078`$ apart. The angle is rounded, so cosine and sine change by up to a few thousandths. The offset-0 and offset-100000 logits cannot be equal, only close.
3. A batch is left-padded and the position ids are shifted to start at 0 on the first real token. Real-token logits still differ from the unpadded run. Why?
   - The pad tokens are still valid keys for every later query, because the causal mask only hides the future. Without an attention mask that hides the pad keys, they change the attention weights. Right padding is safe because the pads come after every real token.
4. Name two properties that an MoE layer with dropped tokens will violate, and the settings under which they hold.
   - Batch independence and causal prefix invariance can fail, because a token's output depends on the other tokens that share expert capacity. Both hold when capacity is at least the token count, so nothing is dropped. A fixed causal dropping rule restores causal prefix invariance, but batch independence also needs capacity counted per sequence rather than across the batch.
5. You see a finite-difference relative error of 0.4 on a single weight entry. List two causes to rule out before you suspect the backward pass.
   - Float32 operations inside the forward path (noise larger than the step times the gradient), and a step size or an entry whose gradient is near zero. Also check dropout and other randomness, and weight aliasing from expanded or shared tensors.

</details>

#### U10. Weight transfer and differential tests between overlapping architecture variants

**About 3 h** · **Target:** Implement

Topics: Weight transfer and differential tests where variant semantics overlap

A variant you add to your decoder can be wrong in ways its own training loss will not show. When a variant contains the baseline as a special case, loading the same weights into both gives you an oracle that costs nothing to run and localizes the first mismatch.

**You can now**

- List the parameter settings at which two architecture variants compute the same function, and load one set of weights into both to test it.
- Write exact differential tests for grouped-query against multi-head attention, a mixture of experts against a dense feed-forward network, latent against multi-head attention, and scaled against unscaled RoPE.
- Say which conversions are lossy, test what they must preserve instead, and set tolerances from the precision of the least precise operation in the path.

**Study**

1. [GQA (arXiv:2305.13245v3)](https://arxiv.org/abs/2305.13245v3) (GQA: Training Generalized Multi-Query Transformer Models from Multi-Head Checkpoints (Ainslie et al., 2023) with Fast Transformer Decoding: One Write-Head is All You Need (Shazeer, 2019)) - Section 2.1 (checkpoint conversion by mean pooling), Section 2.2 (GQA-1 is MQA, GQA-H is MHA) and Figure 4 (mean pool, first head, random).
2. [Build a Large Language Model (From Scratch), companion bonus code](https://github.com/rasbt/LLMs-from-scratch/tree/ec0bac5e1d854306a8ea6c308da49aae22479bd1/ch04/04_gqa) (Build a Large Language Model (From Scratch), Chapters 3 and 4) - `ch04/04_gqa/gpt_with_kv_mha.py` against `gpt_with_kv_gqa.py`, and `ch04/07_moe/gpt_with_kv_ffn.py` against `gpt_with_kv_moe.py`: diff each pair and list what changes. Depth: The pairs are written to compare memory, not to share weights. Writing the weight mapping is the exercise.
3. [DeepSeek-V2 (arXiv:2405.04434)](https://arxiv.org/abs/2405.04434v5) (DeepSeek-V2, Section 2.1 (Multi-head Latent Attention)) - Section 2.1.1 and 2.1.2 (Equations 1 to 11) and Appendix C (full formulas of MLA), read for the mapping from multi-head weights to latent weights.
4. [Roadmap-Final project: Decoder-Only Transformer Stack](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-2/decoder-only-transformer-stack.md) (Decoder-Only Transformer Stack) - Architecture constraints (every component has an independent reference configuration) and Milestone C (match full and cached logits across MHA, GQA and MQA).

**Focus**

- A special-case table is the unit of work. GQA with $`n_{kv} = n_h`$ is MHA, and with $`n_{kv} = 1`$ is MQA. Copying each group's key and value weights to all its query heads turns GQA into an MHA that computes exactly the same function. An MoE whose experts are all copies of one dense feed-forward network equals it when the gate weights sum to 1 and nothing is dropped. MLA with a latent of width $`2 n_h d_h`$ (no compression, no RoPE) equals MHA. RoPE scaling at $`s = 1`$ equals the baseline. A gated scan with gate 1 equals causal linear attention.
- Load the same weights, not the same seed. Write one function per pair that maps the baseline state dictionary to the variant state dictionary, then compare logits and gradients. The first mismatch is usually a layout error: `repeat` against `repeat_interleave` gives the same shapes and a different function.
- Test the lossy direction by what it must preserve. Mean pooling heads into groups changes the function, so do not assert equality with the original. Assert instead that the converted model equals an MHA whose heads inside each group are all set to the group mean.
- The tolerance belongs to the weakest link. A router that computes its softmax in float32 makes an otherwise float64 MoE-versus-dense test agree only to about 1e-8. Gates that you renormalize must sum to 1 to the precision of that softmax.

**Reproduce:** Write the state-dictionary maps and run these checks in float64 on a tiny model (width 32, 4 heads, FFN width 48, 6 experts, PyTorch 2.14.1 on CPU). Labeled example: GQA with 2 KV heads against the replicated 4-head MHA, difference 0.0; the same copy with `repeat` in place of `repeat_interleave`, difference 2.32; MHA against mean-pooled GQA, 1.44 (not equal, as expected); NTK-aware base and position interpolation at $`s = 1`$, 0.0, with the YaRN temperature factor exactly 1; MHA against MLA with latent width $`2 n_h d_h = 64`$ and the up-projections set to the two halves of the identity, 0.0; the gated scan with gate 1 against causal linear attention, 1.8e-15. For the MoE with 6 identical experts and renormalized top-2 and top-3 gates, the difference to the dense network was 1.4e-8 and 1.9e-8, limited by the float32 router; with top-1 and the raw probability as gate, the output was the dense output times the selected probability (ratio 0.18 to 0.22).

**Traps**

- Comparing two models built from the same seed instead of the same weights. Different module layouts consume random numbers in a different order, and the test fails or, worse, passes by luck of a symmetric initialization. Always build the variant by mapping the baseline's state dictionary.
- Demanding exactness where the variant is lossy or the gate does not sum to 1. Top-1 routing with a raw probability gate gives $`p`$ times the dense output by design, and mean-pooled heads are not the original heads. Write the expected relation, not the identity you wish held.
- Passing a shape check and calling the transfer done. Equal shapes hide wrong head order, wrong axis in the pooled mean and a missing scale. Compare logits and at least one gradient on inputs with nonzero positions and a causal mask.

**Practice**

- [Differential tests for your chosen variant](https://github.com/stanford-cs336/assignment1-basics/blob/main/tests/adapters.py) - Use the adapter pattern of `tests/adapters.py` (`run_multihead_self_attention_with_rope` and `run_transformer_lm` load a weights dictionary into your module) as the template for the baseline-to-variant weight map. Write the special-case tests for your variant from the list above, one seeded defect per test (`repeat` for `repeat_interleave`, a missing renormalization, the wrong pooling axis). Report the tolerance you used for each and why. The section mini-project builds on this: it asks for one tested variant on your decoder.

**Stop when:** For your variant you have a state-dictionary map from the baseline, an exact test in float64 at its special case, a stated expectation for the lossy case, and each test fails on its seeded defect.

<details>
<summary>Self-test</summary>

1. Which conversion between MHA and GQA is exact, and how do you build it?
   - GQA to MHA. Copy each group's key and value projection rows to every query head in the group, in contiguous order, and keep the query and output projections. The MHA then computes the same attention as the GQA model. The other direction needs mean pooling plus training.
2. An MoE layer has 8 identical experts and top-2 routing with softmax over all experts followed by renormalization over the two selected. When does it equal the dense layer with the same weights?
   - When no token is dropped, because then each token's output is the sum of two weights that add to 1 times the same dense output. With capacity pressure a dropped assignment removes part of the sum, and with unnormalized gates the output is the sum of the selected probabilities times the dense output.
3. What latent width makes MLA without RoPE reproduce an MHA layer, and what are the up-projections?
   - $`2 n_h d_h`$, the full width of the keys and values together. The down-projection stacks the key and value projections of the MHA, and the key and value up-projections select the first and second half. Any narrower latent compresses and cannot reproduce arbitrary MHA weights.
4. Why is it wrong to test MHA against a mean-pooled GQA for equality, and what can you assert?
   - Averaging heads changes the keys and values each query sees, so the function changes. Assert that the converted GQA equals an MHA whose heads in each group are replaced by the group mean, and that shapes, parameter counts and KV bytes are what the formulas say.
5. Your float64 MoE-versus-dense test agrees to 1e-8 and not 1e-14. Where do you look first?
   - For operations inside the path that run in float32, such as a router computed in float32 for stability. The gate weights then sum to 1 only to about 1e-8. Either make the router dtype-aware for the test or set the tolerance to the router's precision.

</details>

#### U11. Matched-parameter, matched-token and matched-compute comparisons and the decisive mechanism-risk experiment

**About 5 h** · **Target:** Measure

Topics: Matched-parameter, matched-token and matched-compute architecture comparisons; Architecture selection from a decisive mechanism-risk experiment

Every unit in this section produces a variant that looks better or worse in one run. Whether that difference belongs to the mechanism depends on the contract you ran it under, and most published architecture gains are reported at one scale, one seed and one learning rate.

**You can now**

- Write a comparison contract for an architecture variant: what is matched (parameters, tokens, compute, data order), what is tuned per arm, what is fixed, and what the claim may and may not say.
- Count parameters, active parameters and training FLOPs of both arms from the actual models, and say which budget each arm was matched on.
- Run a paired, multi-seed comparison, report the difference against the seed spread, and attribute it to architecture, parameter count, token budget, sequence length or optimizer retuning.
- Name the decisive mechanism-risk experiment for choosing among architectures under a stated context, data, compute and serving objective.

**Study**

1. [Deep Learning Tuning Playbook](https://github.com/google-research/tuning_playbook#identifying-scientific-nuisance-and-fixed-hyperparameters) (Deep Learning Tuning Playbook) - Identifying scientific, nuisance and fixed hyperparameters, then Determining whether to adopt a training pipeline change or hyperparameter configuration (trial variance, study variance). Depth: Skip the batch-norm and quasi-random-search material.
2. [CS336 Assignment 1 handout](https://github.com/stanford-cs336/assignment1-basics/blob/main/cs336_assignment1_basics.pdf) (CS336 2026 - Architectures and Attention Alternatives) - Section 7.3, problems (`layer_norm_ablation`), (`pre_norm_ablation`), (`no_pos_emb`) and (`swiglu_ablation`) (pp. 42 to 44); note the parameter-matching rule in the SwiGLU ablation (feed-forward width 4 times the model width against about 8/3). Depth: The handout asks for one learning curve per variant and a few sentences. It does not ask for seeds or a retuned learning rate; the card adds both. Its budgets are B200 hours; use the substitute described in the practice item.
3. [GLU Variants Improve Transformer (arXiv:2002.05202v1)](https://arxiv.org/abs/2002.05202v1) (GLU Variants Improve Transformer (Shazeer, 2020)) - Section 3.1 and Table 1 as a worked comparison: parameters and operations matched by width, four runs at 65,536 steps for the variance, single runs at 524,288.
4. [2 OLMo 2 Furious (arXiv:2501.00656v3)](https://arxiv.org/abs/2501.00656v3) (OLMo 2 Open Model and Training Recipe) - Section 3.3.2 (reordered norm and QK-norm, 'in isolation neither of these changes yield good results'), Figure 7, and Table 1 as an example of a package of changes.
5. [DeepSeek-V2 (arXiv:2405.04434)](https://arxiv.org/abs/2405.04434v5) (DeepSeek-V2, Section 2.1 (Multi-head Latent Attention)) - Appendix D.1 (MHA, GQA and MQA models aligned at about 7B parameters by changing the number of layers) and D.2 (MLA against MHA). Depth: Read it as a design review: list what differs between arms besides the attention head layout.
6. [Roadmap-Final project: Decoder-Only Transformer Stack](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-2/decoder-only-transformer-stack.md) (Decoder-Only Transformer Stack) - Measurement requirements ('No quality or speed target without baseline') and the design-defense questions.

**Focus**

- Write the contract before the run. The scientific variable is the mechanism. Nuisance variables that change with it, above all the learning rate and sometimes warmup, are tuned per arm or you must say that they were not. Everything else is fixed and becomes a caveat on the conclusion (Tuning Playbook). Fix the token budget and the data order, and record parameters, active parameters and FLOPs per token for each arm.
- Parameters, tokens and compute are three different matches. A gated feed-forward network or a head layout can be matched in parameters by changing a width, and GQA saves parameters that must go somewhere (deeper, wider, or left unmatched). A mixture of experts matches active parameters and FLOPs but not total parameters or memory. DeepSeek-V2's dense ablation aligned parameters by changing depth, so depth is a second difference between its arms.
- Compare the difference with the spread. Use the same seeds for data order in both arms, take paired differences, and report them next to the standard deviation across seeds. GLU Variants' Table 1 shows what that looks like: four runs at 65,536 steps have a standard deviation of 0.004 to 0.010, and a 0.003 gap at the longest run is a single value. One run per arm cannot support a ranking.
- Packages hide attributions, so test one mechanism with a negative control (the baseline with the knob at its null value) and the strongest simple alternative. OLMo 2 changed norm placement, QK-norm, initialization and z-loss together and says two of them 'in isolation' do not give good results. Then pick the decisive experiment from the risk: for a stated serving context, ask which single assumption would make the variant a bad choice (long-context recall for a mixer, drop rate and balance for MoE, quality lost to fewer KV heads at your scale) and design the smallest run that could falsify it.

**Reproduce:** Write the contract for four arms on your own decoder, then run it at fixed tokens, with 3 seeds, paired data order, and a stated learning rate policy. Labeled example, not a target: decoder with 4 layers, width 128, 4 heads, byte-level text (2 MB of JSON files, 90/10 split), 600 steps of 16 sequences of 128 tokens (1,228,800 tokens), AdamW with betas 0.9 and 0.95 and no weight decay, peak learning rate 3e-3 for every arm (not retuned), 30 warmup steps and a cosine schedule to 10%, PyTorch 2.14.1 on CPU. Arms: A multi-head attention with SwiGLU feed-forward width 344; B the same with a GELU feed-forward network of width 516 (equal parameters to A); C grouped-query attention with 2 KV heads and SwiGLU width 344 (fewer parameters); D grouped-query attention with SwiGLU width 387 (parameters about equal to A). Parameter counts: A 857,216; B 857,216; C 791,680; D 857,728. Validation cross-entropy in nats per byte on 64 held-out sequences of 128 bytes, seeds 0, 1 and 2: A 1.4821, 1.3742, 1.4224 (mean 1.426, standard deviation 0.054); B 1.4917, 1.3940, 1.3881 (1.425, 0.058); C 1.4889, 1.4820, 1.4546 (1.475, 0.018); D 1.4329, 1.3781, 1.3800 (1.397, 0.031). Paired differences against A for seeds 0, 1, 2: B +0.0095, +0.0198, -0.0344; C +0.0068, +0.1078, +0.0321; D -0.0492, +0.0039, -0.0424. The B and D differences change sign across seeds and are smaller than the seed spread, so three seeds do not rank A, B and D. Only C, which has fewer parameters, is worse in all three seeds, and its gap ranges from 0.007 to 0.108. One run per arm could have shown D as a clear win or B as a clear loss. Your numbers will differ; the target is the table with the paired differences next to the spread.

**Traps**

- Comparing at one learning rate and calling it architecture. The best learning rate depends on the architecture, so a fixed value favors the arm it happens to suit. A fair statement is 'at this learning rate' or a per-arm sweep with the same budget for each arm.
- Letting parameters, depth and tokens drift together. A variant that saves parameters (GQA, MoE active parameters) looks worse unless you decide what happens to the saved budget, and one that adds layers looks better for reasons that are not the mechanism. State which budget was matched and show the arm that matches the other budgets.
- Reading a package result as a component result, or a scale-specific result as general. A change evaluated at a few million parameters on one corpus says little about a billion parameters. Say what scale, data and sequence length the claim covers and what experiment would extend it.

**Practice**

- [CS336 Assignment 1: ablations with seeds and a retuned learning rate](https://github.com/stanford-cs336/assignment1-basics/blob/main/cs336_assignment1_basics.pdf) - Section 7.3: problems (`layer_norm_ablation`), (`pre_norm_ablation`), (`no_pos_emb`) and (`swiglu_ablation`); Section 7.2.1 for the base configuration. The handout budgets 0.5 B200 hours per ablation and has no tests. Substitute its TinyStories setup at the 40,000,000-token low-resource budget, or your own smaller decoder, and run the one variant you chose for this section against your baseline: same tokens and data order, 3 seeds, a stated or swept learning rate for each arm, parameter and FLOP counts from the models. The section mini-project is this comparison.

**Stop when:** You have a written contract, parameter and FLOP counts for both arms, a paired multi-seed table with the difference next to the seed spread, and a one-paragraph claim that names what was matched, tuned and fixed, plus the experiment that would extend it.

<details>
<summary>Self-test</summary>

1. Two arms differ by a gated feed-forward network and are matched in parameters. What have you not matched, and which of those can change the outcome?
   - Activation memory and elementwise work (the gated one stores more activations per token for the backward pass), possibly throughput, and the optimal learning rate. Any of them can change the result or the cost of achieving it, so state the matched budget and the unmatched ones.
2. Variant B beats baseline A by 0.02 in validation loss in one run each. List what you need before claiming B is better.
   - Several seeds with paired data order and the spread of the difference, the same token budget, matched parameters or a stated reason for unequal ones, learning rate tuned (or a sweep) for both arms, and the same evaluation data, tokenizer and context length. Then compare the difference with the trial-to-trial standard deviation.
3. You save parameters with GQA and spend them on a wider feed-forward network. Why is the comparison with MHA still not a pure test of the head layout?
   - The FFN width also changed, so a difference could come from the wider FFN. A fuller design adds the arm with GQA and the original FFN (fewer parameters) and the arm with MHA and the wider FFN, so each change is isolated.
4. An MoE with the same active parameters as a dense model trains at lower loss for the same tokens. What claims does that support and what claims does it not?
   - It supports a quality gain per active parameter and per training token at that scale. It does not support equal memory or serving cost, since total parameters are larger, nor equal training throughput or wall-clock time, since routing and communication cost time, nor a claim at larger scale.
5. A source claims QK-norm lets a model train at a learning rate ten times higher. What runs does the claim need?
   - The claim is about the range of learning rates that train stably, so both arms need the same learning-rate grid and the same seeds, and you compare where each diverges or degrades. A single high-rate run of each arm cannot separate the mechanism from one unlucky baseline run, and a single learning rate cannot show a range.

</details>

### Mini-project: Decoder variant with numerical and mechanism controls

**About 16 to 22 hours.** Extend `lmlab` with a tested decoder variant and a bounded architecture comparison. Establish numerical and weight-transfer correctness before training, then distinguish mechanism evidence from parameter, routing, context and tuning effects using your existing corpus on your GPU or a reduced CPU decoder.

1. Extend `model/` with your decoder from LLM Foundations and pass CS336 Assignment 1 model tests. Check frozen-batch objectives, norm and softmax gradients against float64 oracles; reconcile total/active parameters, FLOPs, saved activations and KV bytes with tensor inventories, hooks and analytical counts before training.
2. Choose a variant and reuse your weight maps and overlap tests: replicated GQA, uncompressed MLA, null RoPE scaling or gated-scan duality as applicable. Compare logits and gradients with the independent baseline or recurrence; retain lossy-conversion expectations and defect-catching regressions in `tests/`.
3. Reuse your capacity-limited MoE layer independently of the chosen variant. Check dispatch and combine against a per-token loop, assignment conservation and dropped residuals; verify gate, balance and router z-loss gradients against hand algebra, retaining precision conventions and analytical communication payloads.
4. Build the shape, causal-prefix, position-offset, padding, batch-independence, dtype and finite-difference battery; make every test reject a planted defect. Reuse initialization profiles across norm placements and depths; retain detached per-layer activation, gradient, attention-logit and growth summaries, with capacity-pressure exceptions tested separately.
5. Freeze an architecture contract in `registry/`: baseline, variant, null control and strongest simple alternative. Compare at matched tokens and declared parameter or compute budgets across paired seeds, retuning each arm equally; retain held-out records, resource counts, uncertainty and failed runs.
6. Run the bounded MoE balance, capacity and router z-loss campaign, changing controls separately at matched token and tuning budgets across paired seeds. Check language loss independently of auxiliary losses; retain per-layer loads, drops, entropy, logit scales and effects beside seed spread.
7. Test the chosen mechanism's risk with a held-out recall, context-length or routing-pressure probe against the baseline. Retain adverse or unresolved regimes, fine-tuning status and alternative explanations; regenerate tables from raw records and reproduce a comparison from clean state before recommending an architecture.

**Deliverables**

- The `model/` baseline and variant, reused MoE layer, property battery, weight maps and numerical oracles.
- Count reconciliations, per-layer scale logs, MoE campaign and paired architecture comparisons with all attempts retained.
- Mechanism-risk evidence, clean reproduction transcript and a hardware-scoped architecture decision in `reports/`.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [CS336 Assignment 1 model tests](https://github.com/stanford-cs336/assignment1-basics/blob/main/tests/test_model.py). Guard the baseline with model snapshots; add independent gradient, mask, position, transfer and dtype checks for the variant.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Numerical and transfer correctness | Your frozen-batch losses, gradients and transfer special cases match independent oracles before training. Tensor inventories reconcile parameter, operation, activation and KV counts; every property has a defect-catching regression. | The first mismatching layer localizes a planted layout or precision fault, and the defense distinguishes lossy conversion from an implementation defect. |
| Routing evidence | Your loop and algebra oracles validate capacity, conservation, dropped residuals and auxiliary gradients. Paired campaigns retain per-layer load, entropy, drops and seed variation without assuming balance improves quality. | A capacity-pressure counterexample explains a failed independence property, while the no-drop path still satisfies the exact equivalence contract. |
| Architecture attribution | Matched budgets, paired seeds, equal tuning, null and simple controls support a bounded claim. Raw evaluation, failed runs, mechanism-risk probes and clean reproduction remain linked to immutable run identities. | An adverse or inconclusive regime changes the recommendation; an independent rerun reproduces the comparison and its strongest alternative explanation. |

Feeds into: The tested decoder, variant, scale hooks and cost counts feed Pretraining Reliability and scaling. Weight-transfer regressions and matched architecture evidence become the capstone model manifest and mechanism controls.

### Resource route

- **Primary - Course:** [CS336 2026 - Architectures and Attention Alternatives](https://github.com/stanford-cs336/lectures/blob/main/lecture_03.pdf) - Study the Lecture 3 slides (`lecture_03.pdf`, architectures and hyperparameters) and Lecture 4 slides (`lecture_04.pdf`, attention alternatives and mixture of experts) in `stanford-cs336/lectures`, then implement the Assignment 1 Section 3.3 to 3.5 pieces (RMSNorm, SwiGLU, RoPE, causal attention, the pre-norm block) against its tests. Reconstruct every parameter and state equation before you change one mechanism. Keep GPUs, kernels and parallelism (Lectures 5 to 8) for their own tracks.
- **Required - Case-study:** [OLMo 2 Open Model and Training Recipe](https://arxiv.org/abs/2501.00656) - Read Section 2.1 (architecture), Section 3.2 (initialization) and Sections 3.3.1 to 3.3.3 (non-parametric norm to RMSNorm, reordered norm with QK-norm, z-loss) and Table 1, then find the same settings in a released configuration. The changes were adopted as a package, so the report cannot attribute stability to any single one.
- **Support - Book:** [Build a Large Language Model (From Scratch), Chapters 3 and 4](https://www.manning.com/books/build-a-large-language-model-from-scratch) - Use Chapter 3 (causal multi-head attention, pp. 50-91) and Chapter 4 (the GPT model, pp. 92-127) as the smallest runnable decoder, then the companion bonus folders `ch04/04_gqa` and `ch04/07_moe` for one bounded variant. The printed chapters use GPT-2 parts (LayerNorm, GELU, absolute positions); the modern pieces live only in the bonus folders.
- **Support - Paper:** [On Layer Normalization in the Transformer Architecture (Xiong et al., 2020)](https://arxiv.org/abs/2002.04745) - Read Figure 1 and Sections 3 and 4: why Post-LN gradients near the output are large at initialization and need warmup, and why Pre-LN does not. The analysis holds at initialization only and assumes uniform attention weights and Gaussian inputs there.
- **Support - Paper:** [GLU Variants Improve Transformer (Shazeer, 2020)](https://arxiv.org/abs/2002.05202) - Read Section 2 (the GLU family and SwiGLU) and Section 3.1 (hidden width cut from 3072 to 2048 so parameters match), then Table 1, where GEGLU edges out SwiGLU on the longest run. Check the matching arithmetic yourself.
- **Support - Paper:** [GQA: Training Generalized Multi-Query Transformer Models from Multi-Head Checkpoints (Ainslie et al., 2023) with Fast Transformer Decoding: One Write-Head is All You Need (Shazeer, 2019)](https://arxiv.org/abs/2305.13245) - Read MQA Sections 2 and 3 (one shared key and value head to cut decoding memory traffic), then GQA Section 2 (grouped heads as the interpolation, mean-pooled uptraining with 5% of pretraining compute) and Table 1. Both report encoder-decoder results. MQA is at https://arxiv.org/abs/1911.02150.
- **Required - Paper:** [RoFormer: Enhanced Transformer with Rotary Position Embedding (Su et al., 2021)](https://arxiv.org/abs/2104.09864) - Read Section 3: the rotation-matrix form of RoPE, why the attention score depends only on relative position, and the long-distance decay property. Base 10000 is the original choice; later models raise it.
- **Support - Paper:** [Extending Context Window of Large Language Models via Positional Interpolation (Chen et al., 2023) and YaRN (Peng et al., 2023)](https://arxiv.org/abs/2306.15595) - Read Position Interpolation Sections 2 and 3 (scale positions by the length ratio instead of extrapolating), then YaRN Section 3 (frequency-dependent interpolation and the attention temperature). Both still fine-tune. YaRN is at https://arxiv.org/abs/2309.00071.
- **Support - Paper:** [Small-Scale Proxies for Large-Scale Transformer Training Instabilities (Wortsman et al., 2023)](https://arxiv.org/abs/2309.14322) - Read Section 3.1: attention-logit growth and output-logit divergence reproduced in small models at high learning rates, and the QK-layernorm and z-loss fixes (Figures 1 to 4). It explains two of the OLMo 2 choices; transfer to a specific large run is argued, not proven.
- **Support - Lab:** [Modern LLM Notebook - Architecture Frontiers](https://github.com/walkinglabs/modern-llm-notebook/tree/979eecf09669121167184ef925d8edbc089fc13e) - Use `notebooks-en/part2-training/08-gpt2-to-modern-models.ipynb`, `11-mla-kv-cache.ipynb` and `13-moe.ipynb`, and `notebooks-en/part4-frontiers/27-long-context.ipynb` and `30-efficient-attention.ipynb`. Implement only the one variant selected for the checkpoint.
- **Support - Practice:** [TensorTonic - Architecture and Attention Alternatives](https://www.tensortonic.com/problems/cs336-l03-rmsnorm-forward) - Solve RMSNorm Forward Pass (`cs336-l03-rmsnorm-forward`), Parameter-Matched SwiGLU Block (`cs336-l03-parameter-matched-swiglu`), Rotary Query and Key Embeddings (`cs336-l03-rotary-query-key-embeddings`), Causal Grouped-Query Attention (`cs336-l03-causal-grouped-query-attention`), Top-k MoE Router with Load Statistics (`cs336-l04-topk-moe-router`) and one of `cs336-l04-linear-attention-duality` or `cs336-l04-mamba2-gated-state-scan`. Add capacity and token-drop cases the router tests lack. Public test cases check the listed edge cases, not gradients or the hidden grader, so keep your own tests beside each solution. 
- **Support - Project:** [Decoder-Only Transformer Stack](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-2/decoder-only-transformer-stack.md) - Extend the already-tested decoder with the chosen mechanism. Preserve its slow oracle, causal and position tests, generation behavior and model arithmetic.
- **Depth - Paper:** [Switch Transformers](https://arxiv.org/abs/2101.03961) - Use Equations 4 to 6 (the load-balancing loss), Figure 3 (capacity factors), Table 3 (smaller initialization for stability) and the Appendix F pseudocode as the deeper MoE reference. Reproduce only a tiny router experiment; full sparse pretraining belongs to later systems work.
- **Depth - Paper:** [ST-MoE: Designing Stable and Transferable Sparse Expert Models (Zoph et al., 2022)](https://arxiv.org/abs/2202.08906) - Read Section 3 and Appendix B: the router z-loss in Equation 5, its coefficient 0.001 and the load-balance weight in Equation 6, and why update clipping stabilizes runs at a quality cost. Its setting is encoder-decoder T5.
- **Optional - Paper:** [DeepSeek-V2, Section 2.1 (Multi-head Latent Attention)](https://arxiv.org/abs/2405.04434) - Read Sections 2.1.1 to 2.1.4: low-rank joint key-value compression, decoupled RoPE and the cache comparison. The 93.3% cache reduction is against their own 67B model, not a portable ratio.
- **Optional - Paper:** [Transformers are SSMs: Generalized Models and Efficient Algorithms Through Structured State Space Duality (Dao and Gu, 2024)](https://arxiv.org/abs/2405.21060) - Read Section 1 and Sections 5 and 6, including Listing 1 (the `segsum` reference), for a state-space alternative. Skip the full duality theory; compare against a linear-attention baseline in your own harness.
- **Support - Reference:** [Modern LLM Notebook, Appendix B: From Parameters to Memory](https://github.com/walkinglabs/modern-llm-notebook/blob/979eecf09669121167184ef925d8edbc089fc13e/notebooks-en/appendix-advanced/B-flops-memory-accounting.ipynb) - Appendix B Section 1 (parameters per block and per model, GQA and SwiGLU) and Section 2 (activation memory). Recount the activation tables with autograd hooks; the notebook lists produced tensors, not saved ones. Pin commit 979eecf.
- **Support - Reference:** [Deep Learning Tuning Playbook](https://github.com/google-research/tuning_playbook#identifying-scientific-nuisance-and-fixed-hyperparameters) - Read 'Identifying scientific, nuisance, and fixed hyperparameters' and 'Determining whether to adopt a training pipeline change or hyperparameter configuration' as the protocol for comparing architecture variants (per-arm learning rate, trial variance). Skip the batch-norm material. Last commit 2024; pin commit 7554a51.

### Exit checkpoint

Reconstruct one unfamiliar architecture mechanism from equations, add it to the tested decoder, pass shape, mask, position, precision and gradient checks, and attribute a measured difference under a fair parameter or compute contract.

<details>
<summary>Deliberately left for later</summary>

- A survey implementation of every architecture family
- Custom production kernels and distributed expert parallelism
- Frontier-scale long-context or MoE pretraining

</details>

## LMR-3. Pretraining Reliability

**Why:** A small training run should already have the state, observability and failure discipline required at larger scale. This stage makes silent data, numerical, checkpoint and performance failures diagnosable.

### Learn this much

- [ ] Token-weighted causal loss, valid-token masks and denominator checks _(Required)_
- [ ] Microbatches, accumulation, global batch tokens, optimizer steps and seen-token counts _(Required)_
- [ ] AdamW state, parameter groups, weight decay and update-to-weight ratios _(Required)_
- [ ] Warmup, stable training, decay and stop schedules _(Required)_
- [ ] Gradient noise, critical-batch vocabulary and batch-size limits _(Required)_
- [ ] Mixed precision, loss scaling, accumulation dtype and nonfinite handling _(Required)_
- [ ] Gradient clipping semantics, placement and diagnostics _(Required)_
- [ ] Initialization transfer and muP width-scaling vocabulary _(Required)_
- [ ] Deterministic smoke tests and overfit-one-batch checks _(Required)_
- [ ] Model, optimizer, scheduler, scaler, RNG, data and configuration checkpoint state _(Required)_
- [ ] Atomic checkpoint publication, restart selection and corrupted-state handling _(Required)_
- [ ] Exact and statistical resume equivalence and explicit nondeterminism _(Required)_
- [ ] Data-source, shard, tokenizer and sequence-length discontinuity diagnostics _(Required)_
- [ ] Loss spikes, divergence, plateaus and delayed numerical failure _(Required)_
- [ ] Activation, gradient, update, norm and nonfinite instrumentation _(Required)_
- [ ] Input, forward, backward, optimizer, checkpoint and evaluation step timelines _(Required)_
- [ ] Tokens per second, peak memory, state memory and operation accounting _(Required)_
- [ ] Failed-run triage, exclusion policy and all-attempt retention _(Required)_
- [ ] Versioned run contract, monitoring, rollback and stop rules _(Required)_
- [ ] Hardware and interconnect failure signatures _(Optional)_
- [ ] Gradient-noise-scale estimation and large-batch optimization theory _(Depth)_
- [ ] Multi-node fleet operations and elastic recovery _(Later)_

### Study units

#### U1. Token-weighted loss denominators, microbatches, accumulation and seen-token counts

**About 4 h** · **Target:** Derive + Implement

Topics: Token-weighted causal loss, valid-token masks and denominator checks; Microbatches, accumulation, global batch tokens, optimizer steps and seen-token counts

The next-token objective is already familiar. Here the risk is a trainer that silently changes its weighting when masks, sequence lengths or accumulation change.

**You can now**

- Derive one token-weighted objective across uneven microbatches and a partial accumulation window.
- Separate input tokens, valid loss tokens, attempted steps and successful optimizer updates.
- Test a real trainer's denominator against a concatenated-batch gradient oracle.

**Study**

1. [OLMo-core: the effective-batch loss contract](https://github.com/allenai/OLMo-core/blob/5f6f58a133e7ef577d596295f2c8db4651c27857/src/olmo_core/train/train_module/transformer/train_module.py) (OLMo-core and Official Training Scripts) - `TransformerTrainModule.train_batch`: label generation, `batch_num_tokens_for_loss`, `instance_mask` handling, microbatch splitting, summed loss and backward. Depth: Read this single-device path, not pipeline parallelism. The instance-filter path deliberately includes excluded instances in the denominator; do not use that reported loss as the valid-token mean.

**Focus**

- The LLM Foundations unit on the next-token objective covers shifts and masks. For this run, define the valid-token mask after shifting and packing, not from the raw input length.
- For microbatch loss sums $`S_i`$ and valid counts $`n_i`$, backpropagate $`S_i/\sum_j n_j`$. Averaging microbatch means is correct only when their valid counts are equal.
- Log processed input tokens, valid targets and per-source exposure separately. A skipped optimizer update still consumed data and compute; it must not disappear from the ledger.
- A zero-valid-token window has no mean objective. Reject or skip it explicitly before division, and record the decision.

**Reproduce:** Closed-book, derive the loss for two microbatches with loss sums 4 and 6 and valid counts 2 and 6: the token mean is 1.25, not the mean-of-means 1.5. Then use PyTorch 2.14.1 on CPU to compare summed-loss accumulation with concatenated-batch gradients on fixed logits with unequal masks. Disable dropout and use explicit floating-point tolerances.

**Traps**

- Dividing every microbatch by the configured accumulation length when the final window is shorter. Normalize by the actual valid count in that window.
- Calling nanoGPT's last-microbatch training loss the effective-batch loss. Accumulate detached loss sums and counts for logging too.
- Assuming input tokens equal supervised targets. Padding, ignored labels and boundary policies can make those counts different.

**Practice**

- [TensorTonic: Gradient Accumulation Equivalence](https://www.tensortonic.com/problems/cs336-l02-gradient-accumulation-step) - Implement `gradient_accumulation_step`; public cases Uneven microbatches, Two equal microbatches and Zero loss. The free problem weights linear-model squared error by examples, not language-model tokens. Transfer its denominator argument to valid targets in lmlab and add a partial-window test; the public cases do not test masking or autograd gradients.

**Stop when:** The public cases pass, and your masked accumulated gradient matches the concatenated oracle within a stated tolerance, including an uneven final window and explicit empty-window handling.

<details>
<summary>Self-test</summary>

1. Why can repartitioning the same valid targets into uneven microbatches change a mean-of-means gradient?
   - Each microbatch mean receives equal weight despite different valid counts, changing the per-token weights. Summing valid losses and dividing once by the total count preserves the additive objective. Adding only ignored padding does not itself change either masked mean.
2. One device processes two sequences of length 64 per microbatch, with four microbatches per update. What can you count without inspecting labels?
   - 512 input-token positions per attempted update. The valid-target count needs the shifted-label mask, and the successful-update count needs the optimizer outcome.
3. When should full-batch and accumulated gradients agree?
   - When they evaluate the same additive objective at the same weights with the same data and stochastic choices, without batch-dependent operations or intermediate updates. Floating-point reduction order still permits small differences.

</details>

#### U2. AdamW state, parameter groups, weight decay and update-to-weight ratios

**About 3 h** · **Target:** Implement + Measure

Topics: AdamW state, parameter groups, weight decay and update-to-weight ratios

The LLM Foundations unit on AdamW and schedules supplied the update equations. Research comparisons now need evidence that every named parameter received the intended update and retained the right state.

**You can now**

- Audit parameter groups for missing, duplicate and unintentionally decayed parameters, including tied weights.
- Explain an observed update using moments, bias correction, decay and the learning-rate history.
- Measure update-to-weight ratios without mistaking gradient norms for parameter changes.

**Study**

1. [CS336 Spring 2026 Assignment 1: inspect your existing AdamW](https://github.com/stanford-cs336/assignment1-basics/blob/a158843b20107949f1a8d7df1b05cd33b9166712/cs336_assignment1_basics.pdf) (CS336 Assignment 1 - Training and Serialization) - Version 26.0.3, Section 4.3: Algorithm 1 and problems `adamw` and `adamw_accounting`. Depth: Do not rebuild the foundation optimizer. Use the equations to audit the implementation and state you will actually train with.
2. [OLMo-core: stateful and skipped AdamW updates](https://github.com/allenai/OLMo-core/blob/5f6f58a133e7ef577d596295f2c8db4651c27857/src/olmo_core/optim/adamw.py) (OLMo-core and Official Training Scripts) - `adamw_step` and `SkipStepAdamW._step`: `step_factor`, `exp_avg`, `exp_avg_sq`, bias correction and `step_increment_bugfix`. Depth: Follow the scalar path; skip `foreach_adamw_step`. The skip-step policy is a case study, not a requirement to adopt it.

**Focus**

- Keep a table of parameter names, tensor identities, shapes, decay settings and learning rates. A tied embedding and output head share one parameter, not two optimizer entries.
- Compare $`\|\theta_{t+1}-\theta_t\|_2/\|\theta_t\|_2`$ per group or layer. Mark a zero denominator as undefined and log the absolute update instead.
- Measure the actual before-and-after parameter change. Adam's preconditioning, decay and clipping make the gradient norm an inadequate proxy.
- Distinguish a missing gradient from a zero gradient. With PyTorch 2.14.1 AdamW, a parameter with `grad=None` is skipped; a zero tensor can still produce decay and momentum-driven updates.

**Reproduce:** On CPU with PyTorch 2.14.1, take one float64 AdamW step from weight 2 and gradient 3, with learning rate 0.1, betas `(0.9, 0.99)`, $`\epsilon = 10^{-8}`$ and weight decay 0.1. Derive first moment 0.3, second moment 0.09 and new weight about 1.8800000003. The total update-to-weight ratio is about 0.06. Compare a second step with and without the saved moments, using the same next gradient.

**Traps**

- Calling decoupled weight decay an extra loss gradient. It acts outside Adam's adaptive denominator.
- Loading optimizer state into a differently ordered parameter-group layout. Matching shapes alone does not prove the moments belong to the same parameter.
- Treating one update-ratio threshold as universal across embeddings, norms and hidden matrices. Keep layerwise baselines and investigate changes.

**Practice**

- [CS336 Assignment 1: adamw regression audit](https://github.com/stanford-cs336/assignment1-basics/blob/a158843b20107949f1a8d7df1b05cd33b9166712/tests/test_optimizer.py) - `test_adamw` and its `_optimize` helper; connect your optimizer through `get_adamw_cls`. The public test compares the final linear-model weights after 1000 updates against PyTorch or a snapshot with tolerance; it does not audit parameter groups or resume. Add those checks in lmlab. The handout and tests are public study material; never publish assignment solutions.

**Stop when:** The scalar update and public regression agree within declared tolerances, and every trainable tensor appears once in a named group with a recorded actual update ratio.

<details>
<summary>Self-test</summary>

1. A parameter has zero current gradient but moves. Is that necessarily a bug?
   - No. Stored momentum and decoupled decay can both move it. Inspect the moments, decay and actual gradient representation before diagnosing it.
2. Two layers have equal gradient norms. Must their update-to-weight ratios match?
   - No. Their moment histories, weight norms, group learning rates and decay can differ.
3. Why is a weights-only restart not the same AdamW experiment?
   - It resets the moments and step counters, hence the adaptive direction and bias corrections. Even identical next data and learning rate do not recover the original update.

</details>

#### U3. Warmup-stable-decay schedules, gradient noise and the critical batch

**About 6 h** · **Target:** Derive + Measure

Topics: Warmup, stable training, decay and stop schedules; Gradient noise, critical-batch vocabulary and batch-size limits

A stable-phase checkpoint can support several cooldown experiments, but those branches still cost tokens and compute. This unit makes that reuse explicit instead of treating a paper's schedule as a universal recipe.

**You can now**

- Specify warmup, stable and decay phases with unambiguous step and token boundaries.
- Explain the critical batch as an optimization trade-off, not a memory-capacity limit.
- Compare schedule and batch interventions under fixed tokens, held-out evaluation and recorded seed variation.

**Study**

1. [Constant learning rate plus cooldown](https://arxiv.org/abs/2405.18392v3) (Scaling Laws and Compute-Optimal Training Beyond Fixed Training Durations (Hagele et al., 2024) with MiniCPM Section 4) - Sections 2 and 3, especially 3.1 The Advantages and 3.2 Experimental Comparison, Figures 3 to 6. Depth: Stop before stochastic weight averaging. Treat the 210M SlimPajama comparisons as the authors' evidence, not a target for your decoder.
2. [MiniCPM: the WSD contract](https://arxiv.org/abs/2404.06395v3) (Scaling Laws and Compute-Optimal Training Beyond Fixed Training Durations (Hagele et al., 2024) with MiniCPM Section 4) - Section 4.2 WSD LRS, Equation 1; Section 4.3 and its decay-stage experiments. Depth: Read the schedule and branch-reuse argument only. Do not reproduce MiniCPM's model-scale runs.
3. [Noise scale and the useful-batch frontier](https://arxiv.org/abs/1812.06162v1) (An Empirical Model of Large-Batch Training (McCandlish et al., 2018)) - Figure 1; Sections 2.1 to 2.3, especially Equations 2.2, 2.8 and 2.12. Depth: Stop after the steps-versus-examples trade-off. Full noise-scale estimation and large-batch theory are depth, not the exit gate.

**Focus**

- Write which learning rate is used by each attempted update and whether the schedule advances on attempted or successful updates. Record both counters and the consumed-token position.
- WSD names phases, not one decay function. The TensorTonic drill uses endpoint-inclusive cosine decay; MiniCPM permits a decreasing decay function and Hagele studies linear and square-root cooldowns.
- The paper's inverse-batch covariance law assumes independent samples. Adjacent language-model tokens are correlated; report your batch unit and do not call a token count an independent-sample count.
- At fixed tokens, a larger batch gives fewer updates. Retune learning rate with the same small search budget, and compare held-out loss after cooldown, not an unannealed branch against an annealed one.

**Reproduce:** Derive the free WSD drill's six rates for total steps 6, warmup steps 2, stable steps 2, peak rate 1 and final ratio 0: `[0.5, 1, 1, 1, 1, 0]`. Explain why its one-step decay uses the final rate immediately. In lmlab, fork one saved stable-phase state into constant and cooldown branches with identical next tokens and held-out evaluation; keep both outcomes rather than requiring cooldown to win.

**Traps**

- Counting a reused prefix once in every branch's independent-run cost, or counting all cooldown branches as free. Report shared cost, marginal branch cost and total study cost separately.
- Calling the largest batch that fits memory the critical batch. One is a system limit; the other concerns diminishing optimization returns.
- Transferring a source's decay fraction without checking your budget, data and optimizer. Tiny-scale evidence supports only the tested regime.

**Practice**

- [TensorTonic: Generate a Warmup-Stable-Decay Schedule](https://www.tensortonic.com/problems/cs336-l11-wsd-learning-rate) - Implement `wsd_learning_rate`; public cases Warmup stable and two-step decay, No warmup and One-step decay. The free cases check specific rate vectors, not learning quality. The section mini-project adds a fixed-token schedule fork and a small batch-size comparison on your decoder, using three paired seeds and a fixed held-out slice. On CPU, shorten context and the common token budget for every arm equally.

**Stop when:** The boundary cases pass, and your branch ledger accounts for all consumed tokens, successful updates and shared versus marginal cost, with held-out outcomes and seed spread for the small comparisons.

<details>
<summary>Self-test</summary>

1. Why can a stable-phase checkpoint be more useful for continued training than its cooled-down descendant?
   - It preserves the high-rate trajectory. Continuing the cooled-down state at a high rate introduces a rewarming intervention whose stability and forgetting need separate testing.
2. Why can doubling batch size reduce steps without reducing total tokens to a given loss?
   - Larger-batch gradients are less noisy but have diminishing per-step benefit. The step saving may be smaller than the doubled examples per step.
3. If the token batch doubles at a fixed token budget, what happens to the number of optimizer opportunities?
   - It roughly halves, with rounding and the final partial batch handled explicitly. This changes the optimization horizon even before considering skipped steps.

</details>

#### U4. Mixed precision, loss scaling, nonfinite handling and gradient-clipping placement

**About 4 h** · **Target:** Implement

Topics: Mixed precision, loss scaling, accumulation dtype and nonfinite handling; Gradient clipping semantics, placement and diagnostics

Mixed precision, autocast and gradient scaling are prerequisites. The new contract is their interaction with uneven accumulation, skipped updates, schedule position and recoverable language-model state.

**You can now**

- Integrate autocast, token-normalized accumulation, unscaling and clipping at effective-batch boundaries.
- Reject nonfinite updates while retaining the offending batch and precision-state evidence.
- Record the actual parameter, gradient, moment and accumulation dtypes rather than assuming them from the precision label.

**Study**

1. [Mixed Precision Training: the three numerical safeguards](https://arxiv.org/abs/1710.03740v3) (Mixed Precision Training (Micikevicius et al., 2018)) - Sections 3.1 FP32 Master Copy of Weights, 3.2 Loss Scaling and 3.3 Arithmetic Precision, plus Figure 1. Depth: Stop before the benchmark results. This is the FP16 rationale, not a claim that every current BF16 implementation uses the same storage layout.
2. [PyTorch 2.14 AMP: clipping and accumulation](https://docs.pytorch.org/docs/2.14/notes/amp_examples.html#gradient-accumulation) (PyTorch 2.14 - AMP Examples and Profiler) - Typical Mixed Precision Training; Working with Unscaled Gradients - Gradient clipping; Working with Scaled Gradients - Gradient accumulation. Depth: Use the single-optimizer path. Replace division by the configured accumulation length with the actual valid-token denominator from the first unit.

**Focus**

- With PyTorch 2.14.1, keep the scaler's scale fixed throughout an accumulation window. Unscale once after its last backward, inspect finiteness, record the unclipped norm, clip, then perform the conditional step and scale update.
- FP32 parameters under autocast retain FP32 leaf gradients and normally FP32 AdamW moments. Autocast does not itself convert the stored parameters to BF16 or create an extra persistent master copy.
- BF16's exponent range usually removes the need for scaling, not the need for finiteness checks. Use FP32 on CPU if BF16 operations are unsupported; a CPU `torch.amp.GradScaler('cpu')` can test skip semantics without requiring FP16 kernels.
- Keep consumed-token counters even when the optimizer skips. Log scale, pre-clip norm, skip decision and schedule position so a resume preserves the chosen policy.

**Reproduce:** On CPU with PyTorch 2.14.1, give an SGD parameter gradient `[3.0, 4.0]` through a loss scaled by 8. Unscale, record norm 5, then clip with maximum norm 1; the result is approximately `[0.6, 0.8]` within `1e-6`. Repeat with one infinite gradient using `torch.amp.GradScaler('cpu', init_scale=8.0)`: the parameter must not change and the default scale update reduces the scale to 4. Do not clip the invalid gradient before recording it.

**Traps**

- Unscaling each microbatch separately. Later scaled gradients then accumulate into unscaled buffers and cannot be interpreted with one scale.
- Using the return value of `scaler.step(optimizer)` as a universal success flag. Most optimizer steps return `None` even on success; instrument the actual step decision.
- Clipping each microbatch instead of the accumulated gradient. Clipping is nonlinear, so that trains a different update.

**Practice**

- The section mini-project covers this: the mixed-precision accumulation path, one seeded nonfinite event, a refused update and a precision-state resume regression in lmlab.

**Stop when:** Your finite accumulated update matches an FP32 control within a declared tolerance, and an injected nonfinite gradient leaves parameters and optimizer moments unchanged while the event and counters remain recorded.

<details>
<summary>Self-test</summary>

1. Why is clipping before unscaling wrong?
   - The threshold is applied to the scaled norm. After unscaling, the effective clipping threshold is smaller by the scale factor.
2. A scaler skipped an update. Should you replay the batch automatically?
   - Not silently. Replaying changes data exposure and cost. Follow the run's declared skip or replay policy, and record the consumed tokens and every attempt either way.
3. Does enabling BF16 autocast guarantee that accumulation uses BF16?
   - No. FP32 leaf parameters normally accumulate FP32 gradients. Inspect actual buffers and optimizer state; operation precision and stored-state precision are different choices.

</details>

#### U5. Initialization transfer and muP width-scaling rules

**About 3 h** · **Target:** Derive

Topics: Initialization transfer and muP width-scaling vocabulary

Initialization at one width is not a scaling rule. A research program needs a family of parameterizations whose learning-rate transfer can be tested, not a copied learning rate from a smaller model.

**You can now**

- Derive width multipliers for input, hidden and output weights under one stated muP convention.
- Distinguish transferable optimization hyperparameters from regularization choices that need new evidence.
- Specify a width-transfer control that keeps architecture, depth, data and optimization budget comparable.

**Study**

1. [Tensor Programs V: muTransfer and explicit width rules](https://arxiv.org/abs/2203.03466v2) (Tensor Programs V: Tuning Large Neural Networks via Zero-Shot Hyperparameter Transfer (Yang et al., 2022)) - Algorithm 1 and Table 1; Section 4, Table 3 and Equations 3 and 4 for the MLP; Figure 1 for Transformer learning-rate transfer; Section 6.1 for caveats. Depth: Use the Table 3 convention for the derivation. Stop before the derivation in Appendix J. A decoder with tied embeddings needs the compatible convention in Table 8, not a direct copy of the untied MLP rules.

**Focus**

- Table 3 states initialization variances, not standard deviations. A hidden-weight variance proportional to $`1/n`$ gives standard deviation proportional to $`1/\sqrt{n}`$; the output-weight variance there scales as $`1/n^2`$.
- Separate the tuned base learning rate from width-dependent group multipliers. Input, hidden and output matrices do not all receive one identical Adam learning rate under Table 3.
- muP is a joint initialization, parameterization and update-scaling contract. Changing only initialization is not muTransfer; Transformer attention and tied weights introduce further rules.
- Table 1 does not promise transfer of dropout or weight decay. Keep fixed-depth, fixed-data width tests separate from claims about depth, sequence length or a new optimizer.

**Reproduce:** Closed-book, widen the equal-hidden-width MLP in Equation 4 from its base width by a factor of 4, keeping input and output dimensions fixed. Hidden-weight initialization standard deviation halves and output-weight standard deviation quarters. Under its SGD convention, input-weight and hidden-bias learning rates multiply by 4, hidden-weight learning rate stays fixed and output-weight learning rate divides by 4. Then read Table 3's Adam row: input weights and biases keep their rates, while hidden and output weight rates divide by 4. State the convention before each comparison.

**Traps**

- Applying a variance multiplier directly to the initialization standard deviation. Take the square root first.
- Using the Table 3 output-weight rule with a separately scaled readout from another convention. Equivalent parameterizations require consistent forward and optimizer transformations.
- Calling stable activation magnitudes proof that the best learning rate transfers. A coordinate-scale check and a held-out optimization comparison answer different questions.

**Practice**

- The section mini-project covers this: a width-rule worksheet for the chosen decoder and a bounded initialization-transfer check, with actual parameter-group multipliers and activation scales saved alongside the run contract.

**Stop when:** You derive the fourfold-width multipliers without the table, identify your decoder's tied-weight and attention conventions, and separate a scale check from evidence of optimal-hyperparameter transfer.

<details>
<summary>Self-test</summary>

1. Why are width-independent initial activations insufficient to establish useful width transfer?
   - They constrain the initial forward pass, not the sizes and effects of learned updates. The optimizer and parameterization must also scale appropriately.
2. Can a transferred base learning rate imply different actual learning rates for two matrix groups?
   - Yes. The base hyperparameter can stay fixed while prescribed width multipliers change each group's rate.
3. A learning rate transferred across two widths. Does the result establish transfer to a deeper decoder or a new tokenizer?
   - No. Those changes alter the tested family or data representation. They need separate controlled evidence.

</details>

#### U6. Versioned run contracts, deterministic smoke tests, overfit checks and stop rules

**About 4 h** · **Target:** Implement

Topics: Deterministic smoke tests and overfit-one-batch checks; Versioned run contract, monitoring, rollback and stop rules

The lmlab run is now an experiment, not just a training script. A frozen contract makes later changes to data, schedule, resume and evaluation visible rather than silently redefining the baseline.

**You can now**

- Implement a versioned run contract binding corpus, tokenizer, model, objective, optimizer, precision and evaluator identity.
- Gate launches on deterministic smoke tests and a separate overfit-one-batch diagnostic.
- Declare budgets, validation cadence, stop triggers and rollback ownership before comparing configurations.

**Study**

1. [Specify the comparison before launching it](https://github.com/google-research/tuning_playbook/tree/7554a51f5d3002ba90308d39701b586f5a9b962e#identifying-scientific-nuisance-and-fixed-hyperparameters) (Deep Learning Tuning Playbook) - Identifying scientific, nuisance, and fixed hyperparameters; Determining the number of steps for each training run; Saving checkpoints and retrospectively selecting the best checkpoint; Setting up experiment tracking. Depth: Skip batch-normalization guidance. Here compute-limited means budget-limited training, not evidence that GPU kernels are compute-bound.
2. [OLMo-core: a bounded CPU integration configuration](https://github.com/allenai/OLMo-core/blob/5f6f58a133e7ef577d596295f2c8db4651c27857/src/integration_tests/test_train_small_model.py) (OLMo-core and Official Training Scripts) - `build_config` and `test_train_small_model_cpu`: `olmo3_30M`, sequence length 64, five steps and model-merge/load checks. Depth: Read as the reference contract. Running the OLMo test is optional: it needs extra dependencies and external data. Do not launch the official large-model scripts.
3. [CS336 Spring 2026 Assignment 1: launch and overfit checks](https://github.com/stanford-cs336/assignment1-basics/blob/a158843b20107949f1a8d7df1b05cd33b9166712/cs336_assignment1_basics.pdf) (CS336 Assignment 1 - Training and Serialization) - Version 26.0.3, Section 5.3 Training loop and Section 7.2.3 Tips and tricks for debugging model architectures. Depth: Use your existing decoder on a small versioned corpus slice. Replace the assignment's full training and leaderboard budgets with minutes-long smoke runs; do not adopt its score targets or publish solutions.

**Focus**

- The Deep Learning unit on objective checks covers tiny-set overfitting and shuffled-label controls. A smoke run checks finite state and reproducible execution; overfitting one batch tests whether the implementation can learn its targets, not generalization.
- Record code revision, dependency versions, data and tokenizer hashes, model shape, masks, groups, schedule units, RNG streams, checkpoint policy and the fixed held-out evaluation slice. Pin this training path to PyTorch 2.14.1.
- Use your decoder from the Architecture and Numerics section, at around 10M parameters, for the small study. If it does not fit your GPU, use shorter context and smaller microbatches; a two-layer, width-64 decoder with a small vocabulary on CPU suffices for contract and failure tests.
- Predeclare token and wall-time budgets, nonfinite refusal, identity-mismatch refusal, validation selection and rollback rules. A changed contract starts a named branch with a parent checkpoint, not an invisible continuation.

**Reproduce:** From the same initial state, run five updates twice on an immutable small token fixture with fixed batches and a deterministic CPU path. Compare the batch identities, losses, optimizer counters and final tensors. Separately repeat one fixed batch with dropout and decay disabled until its loss falls substantially; save the curve as a diagnostic, and evaluate the actual study only on held-out documents. A constant-sequence fixture is acceptable for this test, not for a quality claim.

**Traps**

- Expecting every overfit-one-batch run to reach zero loss. Conflicting targets for identical available contexts can impose a nonzero optimum; choose a learnable diagnostic fixture.
- Selecting checkpoints on the final test set. Use a development slice for selection and reserve an untouched evaluation slice for the frozen result.
- Trusting nanoGPT's `max_iters` as an update count. At the pinned revision its loop executes `max_iters + 1` updates; test and fix your stop boundary.

**Practice**

- The section mini-project covers this: lmlab's frozen baseline manifest, deterministic launch gate, learnable single-batch overfit check, fixed held-out evaluation and tested stop/rollback policy.

**Stop when:** A clean invocation reproduces the smoke trace at the declared equivalence level, the separate learnable fixture overfits, and an exceeded budget or identity mismatch triggers the declared stop with evidence retained.

<details>
<summary>Self-test</summary>

1. The batch overfit check passes. What has not been established?
   - Generalization, correct data order over a full run, resume equivalence and fairness of later comparisons. A model can memorize a flawed diagnostic batch.
2. Why distinguish a budget stop from a numerical stop?
   - The first completes the planned exposure; the second is a failed or interrupted attempt. Combining them hides instability and makes completed-run averages misleading.
3. You double the batch while leaving maximum steps fixed. Is that the same token-budget experiment?
   - No. It roughly doubles data exposure. Recompute steps or explicitly change the comparison contract.

</details>

#### U7. Complete language-model checkpoint state, atomic publication and corrupted-state handling

**About 5 h** · **Target:** Implement

Topics: Model, optimizer, scheduler, scaler, RNG, data and configuration checkpoint state; Atomic checkpoint publication, restart selection and corrupted-state handling

Complete checkpoints and atomic writes are familiar. This unit audits a real trainer, extends a deliberately incomplete one, and proves that interruption and corruption cannot silently select an invalid continuation.

**You can now**

- Map every mutable language-model training state to its owner and serialized representation.
- Publish immutable local checkpoints with integrity metadata and an explicit reader acceptance rule.
- Reject incomplete, corrupted or incompatible state before mutating the live training objects.

**Study**

1. [OLMo-core: trainer state versus model and optimizer state](https://github.com/allenai/OLMo-core/blob/5f6f58a133e7ef577d596295f2c8db4651c27857/src/olmo_core/train/trainer.py) (OLMo-core and Official Training Scripts) - `Trainer.state_dict`, `load_state_dict` and `load_checkpoint`: counters, loader, callbacks and conditional RNG restoration. Depth: Do not mistake `Trainer.state_dict` alone for the full checkpoint; model and optimizer state belong to the train module.
2. [OLMo-core: local publication and discovery](https://github.com/allenai/OLMo-core/blob/5f6f58a133e7ef577d596295f2c8db4651c27857/src/olmo_core/train/checkpoint.py) (OLMo-core and Official Training Scripts) - `Checkpointer.save`, `dir_is_checkpoint`, `find_checkpoints`, `latest_checkpoint`, `_save_metadata`, `_get_tmp_dir` and `_teardown_tmp_dir`. Depth: Trace local storage only. Remote uploads do not inherit local atomic-rename semantics; sharding and fleet recovery stay outside this section.
3. [nanoGPT: the checkpoint to extend](https://github.com/karpathy/nanoGPT/blob/3adf61e154c3fe3fca428ad6bc3818b27a3b8291/train.py) (nanoGPT Training Loop) - `init_from == 'resume'` branch; scaler creation; checkpoint dictionary and `torch.save` inside the evaluation branch; initial and prefetched `X`, `Y` batches.
4. [Local atomic replacement and synchronization](https://docs.python.org/3/library/os.html#os.replace) (Python - Atomic Replacement and File Synchronization) - `os.replace` and `os.fsync` entries, including the same-filesystem restriction and flush-before-fsync instruction (page read 2026-10-16).

**Focus**

- Save at a completed-update boundary: model, moments and group mapping, schedule position, scaler, counters, CPU and device RNG, sampler/shuffle state, corpus/tokenizer/config hashes and callback state. Mid-accumulation saves additionally need partial gradients and window position.
- nanoGPT does not save RNG, scaler or loader state. Its random-window sampler also prefetches the next batch before saving; either save that pending batch and its identity or move publication to a boundary with a fully specified next-batch recipe.
- For local single-file checkpoints, write an immutable payload through a temporary sibling, flush and synchronize it, then atomically replace its final name. Publish a manifest last with size, digest, schema and run identity; readers require all checks before loading into fresh objects.
- A successful rename gives atomic visibility, not guaranteed survival of power loss. Directory synchronization and filesystem behavior matter for durability. Keep the previous verified checkpoint until the new one has passed validation.

**Reproduce:** In a CPU test, retain one verified checkpoint, start a separate writer for the next temporary payload, and terminate it after it signals that only part was written. Discovery must ignore that unpublished attempt. Next, alter one byte in a copied published payload without updating its recorded digest: validation must reject it before deserialization or live-state mutation. Keep both failure records and show explicit fallback to the older verified state.

**Traps**

- Calling successful deserialization an integrity check. Corrupted tensor bytes may still deserialize; validate the recorded digest and semantic identity too.
- Using a filename or modification time as proof of completeness. Select the highest accepted step with its manifest, not merely the newest path.
- Treating an in-memory state dictionary as an immutable snapshot. Its tensors can alias live state; serialize immediately or copy them before training continues.

**Practice**

- The section mini-project covers this: extend the pinned nanoGPT checkpoint path in lmlab with complete state, immutable publication, a manifest, kill-during-save and corruption tests, and explicit last-good fallback.

**Stop when:** Interrupted publication, byte tampering and tokenizer/config mismatches are rejected without changing live state, and the previous verified checkpoint remains loadable.

<details>
<summary>Self-test</summary>

1. The model and optimizer reload correctly. Why might the next training batch still be wrong?
   - The loader position, random stream or already-prefetched batch may be missing. A checkpoint must describe the next consumed batch, not only the last completed update.
2. A checkpoint's checksum passes, but its tokenizer hash differs. May you resume it as the same run?
   - No. Integrity proves the bytes match the manifest, not that the bytes belong to a compatible experiment. Reject the mismatch or declare an explicit new intervention.
3. Can an atomic rename alone guarantee a checkpoint survives sudden power loss?
   - No. Visibility and durability are different guarantees. Buffered data and directory entries need appropriate synchronization, with filesystem-specific limits.

</details>

#### U8. Exact and statistical resume equivalence, and data discontinuity diagnostics

**About 5 h** · **Target:** Measure

Topics: Exact and statistical resume equivalence and explicit nondeterminism; Data-source, shard, tokenizer and sequence-length discontinuity diagnostics

A smooth loss curve is weak evidence of correct resume. Token exposure can repeat or skip without a conspicuous spike, so continuation must be checked against an uninterrupted trace at the same logical position.

**You can now**

- Specify exact, tolerance-based and statistical continuation criteria before running a restart test.
- Compare next-batch identities, RNG-dependent computation, optimizer state and held-out loss across a process restart.
- Localize a data discontinuity to corpus, shard, tokenizer, mixture, sequence-length or sampler-state changes.

**Study**

1. [OLMo-core: loader fingerprint and consumed position](https://github.com/allenai/OLMo-core/blob/5f6f58a133e7ef577d596295f2c8db4651c27857/src/olmo_core/data/data_loader.py) (OLMo-core and Official Training Scripts) - `NumpyDataLoaderBase.state_dict` and `load_state_dict`: `dataset_fingerprint_version`, `dataset_fingerprint`, `batches_processed`, `tokens_processed`, `seed` and `epoch`. Depth: Notice that a fingerprint-version mismatch only warns, while a same-version fingerprint mismatch normally raises. Make lmlab's strict acceptance policy explicit rather than assuming both cases fail closed.
2. [OLMo-core: RNG restoration boundary](https://github.com/allenai/OLMo-core/blob/5f6f58a133e7ef577d596295f2c8db4651c27857/src/olmo_core/train/trainer.py) (OLMo-core and Official Training Scripts) - `Trainer.load_state_dict`: loader restoration, callback state, matching-world-size RNG restore and library-version warning.
3. [Recognize resume and repetition patterns](https://github.com/stas00/ml-engineering/blob/139708e52cb06f9191cf1d9959def9187b205c58/training/instabilities/training-loss-patterns.md#resume-related-spikes) (Machine Learning Engineering - Instabilities, Checkpoints and Debugging) - Resume-related spikes: DataSampler related issues and Impacts of repeat data. Depth: Treat the historical framework anecdotes as cases, not current universal defaults. Use batch lineage to test your loader directly.

**Focus**

- Compare the resumed run with the uninterrupted suffix, including the first consumed batch, valid-target count, learning rate, scaler, moments and parameter tensors. Evaluation must not perturb the training RNG stream unnoticed.
- Exact equivalence means bitwise state and trace agreement within a frozen deterministic environment. Tolerance-based numerical agreement is a different claim; cross-release or cross-device identity is not promised by PyTorch.
- For an explicitly nondeterministic path, compare paired multi-seed held-out results and diagnostics against a prespecified practical margin. An insignificant difference or one similar curve is not proof of statistical equivalence.
- Log source, shard, token offsets, tokenizer hash, packing version, sequence length and batch digest. A corpus fingerprint alone does not certify every tokenizer or packing choice.

**Reproduce:** Using PyTorch 2.14.1 on CPU, run your tiny decoder with nonzero dropout and fixed data order. Save after three completed updates, continue two more as the reference, then terminate and resume fresh objects in a new process for those same two updates. Restore RNG only after object construction and loader setup. Require exact batch identities and bitwise tensor agreement on this deterministic path. Repeat with RNG restoration omitted and with the sampler reset; your checks must identify the earliest differing stream, not merely the final loss.

**Traps**

- Treating statistical equivalence as permission for repeated or missing documents. Logical data identity remains testable even when kernels are nondeterministic.
- Restoring RNG before constructing the model. Initialization consumes draws and shifts the resumed stochastic stream.
- Ignoring a fingerprint mismatch because the validation curve seems healthy. That turns a continuation into an undocumented data intervention.

**Practice**

- The section mini-project covers this: an uninterrupted-versus-killed-process continuation test with dropout, missing-RNG and repeated-shard negative controls, plus strict data/tokenizer/config fingerprint failures.

**Stop when:** A real restart passes the declared equivalence contract, and the omitted-RNG, reset-sampler and changed-identity controls fail at the expected boundary with the earliest differing evidence preserved.

<details>
<summary>Self-test</summary>

1. Batch hashes match after resume, but dropout outputs differ immediately. What do you inspect first?
   - The relevant RNG state and restoration order, train/eval mode and deterministic execution settings. Matching data does not imply matching stochastic computation.
2. Why can a reset sampler initially improve the training loss?
   - It can replay already-learned examples. Lower replay loss is not evidence of better generalization or correct exposure.
3. Three seeds show no statistically significant loss difference. Have you proved equivalence?
   - No. Failure to detect a difference can reflect low power. Specify a meaningful equivalence margin and report the uncertainty relative to it, while checking deterministic state and lineage directly.

</details>

#### U9. Loss spikes, divergence and delayed failure, with activation, gradient and update instrumentation

**About 5 h** · **Target:** Measure

Topics: Loss spikes, divergence, plateaus and delayed numerical failure; Activation, gradient, update, norm and nonfinite instrumentation

A spike is an observation, not a cause. The research task is to distinguish a hard batch from a changed data stream, an unstable update or a delayed numerical failure without discarding the failed trajectory.

**You can now**

- Build a diagnostic decision tree linking loss events to data, activations, gradients, updates and precision state.
- Capture the earliest nonfinite value and the preceding batch/state history, rather than only the eventual loss failure.
- Diagnose a seeded numerical or data failure from stored evidence and verify a single-mechanism repair.

**Study**

1. [Loss-pattern taxonomy, not a causal classifier](https://github.com/stas00/ml-engineering/blob/139708e52cb06f9191cf1d9959def9187b205c58/training/instabilities/training-loss-patterns.md#main-types-of-loss-spikes) (Machine Learning Engineering - Instabilities, Checkpoints and Debugging) - Main types of loss spikes: Fast recovering spikes, Slow recovering spikes, Not fully recovering spikes, Non-spike diverging and Multiple datasets spikes. Depth: Skip the earlier grokking anecdote: a training-loss drop alone does not establish held-out generalization or grokking.
2. [Forward-frame evidence for the first invalid value](https://github.com/stas00/ml-engineering/blob/139708e52cb06f9191cf1d9959def9187b205c58/debug/pytorch.md#underflow-and-overflow-detection) (Machine Learning Engineering - Instabilities, Checkpoints and Debugging) - Underflow and Overflow Detection: `DebugUnderflowOverflow` hooks and the last-forward-frames report; Specific batch absolute min and max value tracing. Depth: Transfer the hook and rolling-history idea to your decoder; do not download the demonstration's T5 model. The old `underflow_overflow.md` page redirects here.
3. [Separate early instability from delayed failure](https://github.com/google-research/tuning_playbook/tree/7554a51f5d3002ba90308d39701b586f5a9b962e#how-can-optimization-failures-be-debugged-and-mitigated) (Deep Learning Tuning Playbook) - Identifying unstable workloads and Potential fixes for common instability patterns. Depth: Use the hypothesis-and-control method; do not copy the source's learning-rate sweep multipliers or vision-era batch-normalization interventions.

**Focus**

- Keep per-source loss sums and denominators, batch lineage, sequence lengths, learning rates, unclipped gradient norms, clipping frequency, scaler events and actual update ratios. Aggregate loss can hide a source-specific regression.
- Sample residual, attention-logit and output-logit scales by layer. Store norms and extrema without retaining the autograd graph; capture full tensors only for a bounded diagnostic replay.
- Seed one known fault in a copy of the baseline: insert a nonfinite intermediate at a named step and module, or reset the data cursor. Store the parent state and preceding window so another reader can infer the cause without your injection note.
- Replay the suspect batch at the pre-event state, then change only the suspected cause. A replay that fails only after several preceding updates points to state-history dependence, not proof that the last document is bad.

**Reproduce:** With the small PyTorch 2.14.1 CPU decoder, place finite-value checks at block outputs and before the optimizer step. At a recorded step, deliberately set one chosen block-output element to infinity. Save the input batch identity, the last finite state, the first failing module and the refused-update event. Replay from that state with the injection disabled and confirm finite execution on the same batch. Keep both traces; a successful replay is a control for this injected fault, not a general stability guarantee.

**Traps**

- Calling fast recovery proof that a spike was harmless. Check held-out slices and post-event state; the aggregate curve alone cannot establish that.
- Attaching diagnostics that save graph-bearing tensors at every step. The resulting memory leak and synchronization overhead can become a second failure.
- Assuming anomaly detection catches every invalid forward value. Check forward finiteness explicitly; backward anomaly reporting has a narrower contract.

**Practice**

- The section mini-project covers this: one seeded numerical or data incident, stored pre-event history, first-invalid or first-discontinuity localization, a matched replay and a regression that catches the original fault.

**Stop when:** Your stored evidence identifies the earliest affected component, a one-cause replay explains the seeded event, and the original failed run remains available beside the passing regression.

<details>
<summary>Self-test</summary>

1. Why preserve the pre-spike history rather than only the batch with the largest loss?
   - Earlier updates may have grown activations or corrupted optimizer state. The final batch can merely expose an already developing failure.
2. Aggregate loss jumps while each source's held-out loss is unchanged. What alternative explanation should you test?
   - Changed mixture weights, valid-token denominators or sequence composition. A weighted average can move even when its conditional source losses do not.
3. A smaller learning rate prevents the spike. Does that prove the data are correct?
   - No. It may only reduce sensitivity to a data or objective defect. Check batch lineage, masks and targets independently before attributing the repair.

</details>

#### U10. Step timelines, tokens per second and memory and operation accounting

**About 6 h** · **Target:** Measure

Topics: Input, forward, backward, optimizer, checkpoint and evaluation step timelines; Tokens per second, peak memory, state memory and operation accounting

Parameter and FLOP arithmetic is already familiar. The new task is reconciling those estimates with a real run, including evaluation, publication and failed attempts rather than timing only convenient kernels.

**You can now**

- Attribute a training timeline to input wait, transfer, forward, backward, optimizer, evaluation and checkpoint work.
- Reconcile predicted tensor-state bytes and operation counts with measured runs and named residual costs.
- Diagnose a seeded throughput regression without changing the model's token exposure or update semantics.

**Study**

1. [OLMo-core: throughput numerator and interval](https://github.com/allenai/OLMo-core/blob/5f6f58a133e7ef577d596295f2c8db4651c27857/src/olmo_core/train/callbacks/speed_monitor.py) (OLMo-core and Official Training Scripts) - `SpeedMonitorCallback.pre_load_batch`, `pre_step` and `post_step`; `get_device_peak_flops_per_second`. Depth: Do not use the fallback peak FLOP rate for an unrecognized GPU: the implementation assumes a different device. Supply verified specifications for your GPU or omit MFU.
2. [PyTorch 2.14: bounded profile capture](https://docs.pytorch.org/docs/2.14/profiler.html) (PyTorch 2.14 - AMP Examples and Profiler) - Overview and API Reference: `profile` activities, `schedule`, `profile_memory`, `record_shapes`, `with_flops`, `key_averages` and `export_chrome_trace`. Depth: Use a short capture on your machine, with CPU-only activities as the fallback. The FLOP option estimates selected operators; it is not a complete hardware instruction counter.
3. [Appendix B: inspect the accounting assumptions](https://github.com/walkinglabs/modern-llm-notebook/blob/979eecf09669121167184ef925d8edbc089fc13e/notebooks-en/appendix-advanced/B-flops-memory-accounting.ipynb) (Modern LLM Notebook - Training and Accounting) - Sections 2 Activation Memory, 3 FLOPs, 4 Backpropagation and 6 Training Memory. Depth: Recompute Section 2's FFN subtotal: $`2 + 16/3 = 22/3 \approx 7.33`$, not 6.33. Do not copy Section 4's extra factor of 2: forward plus backward is approximately three times forward for the stated dense-matmul model, not six. Section 6's listed FP32 weights, gradients and two moments total 16 bytes per parameter before its listed BF16 copy, which would add 2 more. Treat activation formulas as implementation-dependent estimates, not exact peaks.

**Focus**

- Use processed input tokens per elapsed second for execution throughput and report valid-target throughput separately. Give both warmed-up training-only time and end-to-end time including evaluation, checkpoint publication and restarts.
- Annotate phase boundaries before collecting traces. CUDA launches are asynchronous: use synchronized interval boundaries or device events on your GPU, and read overlapping work as a timeline rather than summing nested operator totals.
- Build a dtype-specific ledger of unique parameter storage, gradients and moments after state initialization, then add saved activations, temporary copies, workspaces and inputs. Report allocated and reserved memory separately; allocator reserve is not live tensor storage.
- Under the declared multiply-add convention, a matmul costs approximately $`2\,m\,k\,n`$ FLOPs. Backward is approximately twice forward when both operand gradients are needed; embeddings, frozen inputs, recomputation, loss and optimizer operations require their own accounting.

**Reproduce:** First derive the free drills' small examples: parameter shapes `[4, 3]` and `[3]`, 2-byte parameters, 4-byte gradients and Adam moments, plus a `[2, 4]` 2-byte activation give 226 bytes without a master copy. A forward matmul `[2, 4, 4]` plus 32 attention FLOPs gives forward 96, backward 192 and total 288 FLOPs under the drill's convention. Then capture an annotated step of your PyTorch 2.14.1 decoder, seed an input-wait delay, and show that its trace localizes the added wait without changing batch hashes or final updates. Reconcile one state-memory prediction and one forward/backward operation prediction with your capture; timings are observations, never targets.

**Traps**

- Calling profiler operator FLOPs a complete count, or dividing them by an unrelated peak precision to claim MFU. State included operations and the device precision first.
- Adding every per-operator memory allocation to estimate peak live memory. Tensors are freed and storage can be reused; peak is simultaneous liveness, not cumulative allocations.
- Claiming an optimization from a profiled run alone. Measure a separate clean timing run, then rerun loss, gradient and resume controls.

**Practice**

- [TensorTonic: Mixed-Precision Training Memory Accountant](https://www.tensortonic.com/problems/cs336-l02-training-memory-accountant) - Implement `memory_accountant`; public examples cover BF16 parameters with FP32 Adam gradients/state, FP32 SGD without activations and BF16 AdaGrad. This free problem excludes master copies and allocator overhead. Add those only if your measured implementation actually has them. The section mini-project supplies the measured reconciliation.
- [TensorTonic: Transformer Training FLOP Estimator](https://www.tensortonic.com/problems/cs336-l02-training-flop-estimator) - Implement `flop_estimator`; public examples cover one matmul plus attention, two matmuls and a zero-batch matmul. The free tests exercise the supplied shape arithmetic, not a decoder's full operation graph. Extend your existing foundation solution with an included/excluded-operation ledger rather than treating it as a hardware oracle.

**Stop when:** Both drills pass, one memory and one operation estimate have measured reconciliations, and the input-delay regression is localized while the unchanged batch/update controls pass.

<details>
<summary>Self-test</summary>

1. Why can two runs have equal training-only tokens per second but different study cost?
   - They may differ in evaluation, checkpoint, startup, retry and failed-run overhead. End-to-end elapsed time and total attempts expose those costs.
2. Does switching FP32-parameter AdamW to autocast halve persistent optimizer memory?
   - No. Stored parameters, gradients and moments can remain FP32. Most savings then come from lower-precision intermediates, with any cast-copy cost counted separately.
3. The trace shows long input wait while GPU kernels are short. What is the next controlled change?
   - Change only the input path, for example by replaying the same preloaded batches. Keep batch order and updates fixed, and verify end-to-end time separately.

</details>

#### U11. Failed-run triage, all-attempt retention and hardware failure signatures

**About 3 h** · **Target:** Explain

Topics: Failed-run triage, exclusion policy and all-attempt retention; Hardware and interconnect failure signatures

Successful runs alone hide instability and wasted budget. A defensible research result retains the attempts that did not finish and separates an observed signature from a proven cause.

**You can now**

- Explain why failed, stopped and retried attempts belong in the study's evidence and cost ledger.
- Distinguish numerical, data, capacity and storage failures from evidence suggesting a device fault.
- Explain a seeded incident using retained traces, a controlled repair and explicit limits on local evidence.

**Study**

1. [OPT: retain the interrupted training history](https://arxiv.org/abs/2205.01068v4) (OPT: Open Pre-trained Transformer Language Models, Section 2.5 (Zhang et al., 2022)) - Section 2.5 Training Processes: Hardware Failures, Loss Divergences and Other Mid-flight Changes; Figures 1 and 2. Depth: Read the incident narrative, not the model-scale recipe. The reported restarts and combined interventions do not isolate a universal repair or predict your GPU's failure rate.
2. [Recovery policy without blind retries](https://github.com/stas00/ml-engineering/blob/139708e52cb06f9191cf1d9959def9187b205c58/training/fault-tolerance/README.md) (Machine Learning Engineering - Instabilities, Checkpoints and Debugging) - Queue up multiple training jobs; Frequent checkpoint saving; Kill switch; Save switch; Is-job-hanging watchdog and Low disk space alerts. Depth: Extract the stop, evidence and last-good recovery ideas. Skip SLURM commands, spare-node provisioning and multi-replica recovery; no cluster or watchdog service is required.
3. [Hardware signatures are evidence, not verdicts](https://github.com/stas00/ml-engineering/blob/139708e52cb06f9191cf1d9959def9187b205c58/compute/accelerator/nvidia/debug.md#errors-and-diagnostics) (Machine Learning Engineering - Instabilities, Checkpoints and Debugging) - Errors and diagnostics: Xid Errors and uncorrectable ECC error encountered; How to detect if you get the same broken node again and again. Depth: Read only. Do not run stress tests, reset hardware or request administrator access. Skip the page's categorical claims that every uncorrectable error crashes the application and every correctable error has no impact; behavior depends on device and containment policy. ECC telemetry can be unavailable on consumer GPUs.

**Focus**

- Give every launch an attempt ID and parent checkpoint. Retain contract, seed, batch lineage, logs, exit status, stop reason, consumed tokens, elapsed time and last verified state, even for failed or cancelled attempts.
- An out-of-memory error indicates a capacity or allocation problem, not proof of broken hardware. An invalid token index, nonfinite activation, full disk and stalled input path require different controls before any hardware hypothesis.
- If available, preserve timestamped driver messages, Xid codes, ECC counters, GPU identity, temperature and software versions. These can support escalation, but a generic CUDA error or loss spike alone cannot establish a defective device.
- Keep observation, hypothesis, intervention and outcome separate. State retry limits and who can authorize recovery. A CPU or one-GPU injection validates local detection and recovery only, not fleet reliability or real hardware failure rates.

**Reproduce:** Closed-book, reconstruct the seeded block-output failure from the instrumentation unit using only its retained evidence. Explain the first invalid module, the refused update, the last-good checkpoint and the successful same-batch control with injection disabled. Give the failed attempt and replay separate IDs and costs. List the missing evidence that prevents calling this a hardware fault; do not inject real device faults or fabricate driver logs.

**Traps**

- Deleting failed seeds before averaging completed runs. Report completion counts and all-attempt cost alongside held-out outcomes; do not invent a final loss for an unfinished run.
- Restarting repeatedly without changing a persistent cause such as a full filesystem. Bound retries, retain each attempt and stop for diagnosis.
- Treating a passing replay as proof the original hardware is healthy. Intermittent faults and changed software state need separate evidence.

**Practice**

- The section mini-project covers this: an all-attempt incident index, the seeded failure and matched replay, retained original evidence, bounded recovery policy and a local-only claims statement.

**Stop when:** You can explain the seeded incident from its evidence, account for the failed and repaired attempts, and distinguish supported numerical findings from untested hardware and fleet hypotheses.

<details>
<summary>Self-test</summary>

1. OPT reports at least 35 manual restarts. Is that its total restart count?
   - No. Section 2.5 also estimates over 70 automatic restarts due to hardware failures. Manual restarts alone undercount the interrupted history.
2. A run fails with a nonfinite loss and no available ECC telemetry. What can you conclude?
   - Only that numerical failure was observed and hardware telemetry is unavailable. Inspect data, precision, activations and update history; absent telemetry is neither proof of hardware health nor evidence of a fault.
3. A repair succeeds after both lowering the learning rate and replacing the input shard. Which cause is established?
   - Neither individually. Both changed. Preserve the combined outcome, then use controlled replays if safe to isolate the responsible mechanism.

</details>

### Mini-project: Restartable decoder training with retained failure evidence

**About 18 to 24 hours.** Extend `lmlab` with a reliable single-device trainer for the tested decoder and versioned corpus. Use the pinned nanoGPT path and PyTorch from the units, prove updates and recovery before the bounded study, and retain numerical, data and performance incidents without claiming fleet reliability.

1. Adapt the pinned nanoGPT trainer in `train/` to your decoder. Check masked token accumulation against concatenated-batch gradients, including uneven, partial and empty windows; pass CS336 Assignment 1 AdamW tests and retain scalar-update, tied-group, moment-resume and actual update-ratio audits before training.
2. Save a decoder-specific muP worksheet, actual group multipliers and bounded initialization-transfer scales against the stated parameterization rules. Check accumulation, unscaling and clipping against full-precision updates; inject a nonfinite event and retain refused-update, unchanged-moment and precision-state restoration regressions with preceding diagnostics.
3. Freeze the baseline contract in `registry/`, binding code, dependencies, data, tokenizer, model, objective, optimizer, precision and evaluator. Gate launches on deterministic trace equality and a separate learnable-batch overfit diagnostic; retain fixed held-out evaluation and budget, identity-mismatch, stop and rollback tests.
4. Extend nanoGPT's checkpoint path with a state inventory covering model, moments, groups, schedule, scaler, counters, RNG, loader, prefetch and callbacks. Publish immutable payloads with integrity manifests; test killed writers and corruption against acceptance rules, retaining explicit last-good fallback without claiming power-loss durability.
5. Compare uninterrupted training with killed-process continuation under dropout, checking batches, losses, updates and complete state against the deterministic CPU reference. Retain missing-RNG, repeated-shard and strict data/tokenizer/config fingerprint negative controls, first-discontinuity evidence and the declared numerical or statistical equivalence boundary.
6. Fork stable-phase state into constant and cooldown schedules and compare token batches under equal learning-rate search budgets. Hold tokens, held-out evaluation and paired seeds fixed; retain losses, uncertainty, exposure, attempted/successful updates and shared, marginal and all-attempt costs. Reproduce the baseline from clean state.
7. Instrument phase timelines, per-source losses and layer scales; localize injected numerical and input-wait incidents against unchanged-batch replays. Reconcile dtype-specific state-memory and operation predictions with profiles, retaining pre-event history, throughput, observer overhead, first-invalid evidence, repaired regressions, an incident index and bounded, single-device recovery claims.

**Deliverables**

- The `train/` trainer, complete-state inventory, immutable checkpoints and objective, precision, publication and killed-process resume regressions.
- Frozen baseline and schedule/batch studies with fixed evaluation, update ledgers, paired uncertainty and all attempts retained.
- Incident index, matched replays, profiling reconciliations and clean baseline reproduction instructions with explicit recovery and hardware-scope limits.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [CS336 Assignment 1 AdamW regression tests](https://github.com/stanford-cs336/assignment1-basics/blob/a158843b20107949f1a8d7df1b05cd33b9166712/tests/test_optimizer.py). Pass the optimizer regression; add masked accumulation, parameter-group, precision and complete-state continuation tests in your trainer.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Update and launch correctness | Your masked gradient and scalar AdamW oracles pass before training; group identities, width multipliers and precision state are audited. Deterministic launch, learnable-batch, stop and nonfinite-refusal tests pass. | A wrong denominator or clipping order fails a targeted regression, and the repaired update agrees with the independent full-precision control. |
| Publication and continuation | Your killed-writer and corruption tests reject uncommitted state without live mutation. Dropout continuation matches the uninterrupted reference; missing-RNG, repeated-shard and fingerprint controls fail, with last-good recovery explicit. | Fresh-process state comparisons localize the earliest differing owner, including a pending batch; a clean baseline rerun reproduces the documented recovery contract. |
| Measured reliability evidence | Matched schedule and batch studies retain paired-seed outcomes and all costs. Timeline and memory/operation reconciliations, incident histories, matched replays and regressions support bounded diagnoses rather than hardware-fault assertions. | An input-wait repair preserves updates and resume behavior; separate clean timings expose observer overhead, and the negative regime changes the next experiment. |

Feeds into: Complete checkpoints, deterministic exposure, schedules and all-attempt ledgers feed scaling, adaptation and real-code integration. Resume regressions, failure postmortems and measured resource residuals become the capstone's reproducible baseline and recovery evidence.

### Resource route

- **Primary - Implementation:** [OLMo-core and Official Training Scripts](https://github.com/allenai/OLMo-core/tree/5f6f58a133e7ef577d596295f2c8db4651c27857) - Trace `src/examples/llm/train.py` through `nn/transformer/`, `optim/`, `train/train_module/`, `train/trainer.py` and `train/callbacks/checkpointer.py`. Note what `Trainer.state_dict` saves (loader, RNG and callback state) and how the data loader checks its fingerprint. The CPU integration test `test_train_small_model_cpu` needs extra packages and downloads external data, so point it at a small local fixture or treat the run as optional.
- **Required - Assignment:** [CS336 Assignment 1 - Training and Serialization](https://github.com/stanford-cs336/assignment1-basics) - Revisit only the optimizer, schedule, gradient clipping, data loading, checkpointing, training-together and decoding problems. Add kill-and-resume, tokenizer mismatch and corrupted-checkpoint tests beyond the foundation implementation.
- **Required - Guide:** [Deep Learning Tuning Playbook](https://github.com/google-research/tuning_playbook) - Read `#a-scientific-approach-to-improving-model-performance` (scientific, nuisance and fixed hyperparameters; incremental tuning), `#determining-the-number-of-steps-for-each-training-run`, `#saving-checkpoints-and-retrospectively-selecting-the-best-checkpoint` and the FAQ entries on schedules and `#how-can-optimization-failures-be-debugged-and-mitigated`. Write the run and triage protocol before launching comparisons; skip the batch-norm material.
- **Support - Book:** [Build a Large Language Model (From Scratch), Chapter 5 and Appendix D](https://www.manning.com/books/build-a-large-language-model-from-scratch) - Use Chapter 5 (the loss, training loop and saving weights, pp. 128-167) and Appendix D (warmup, cosine decay and gradient clipping, pp. 313-321) as the first correct tiny pretraining loop before the large-run recipe.
- **Support - Lab:** [nanoGPT Training Loop](https://github.com/karpathy/nanoGPT/tree/3adf61e154c3fe3fca428ad6bc3818b27a3b8291) - Read `train.py` and `model.py` at commit 3adf61e and run the reduced CPU or small-GPU configuration. The repository is marked deprecated, its checkpoint holds no RNG, scaler or data-loader state, and the loop runs `max_iters + 1` updates. Use those gaps for your kill-and-resume and atomic-save tests.
- **Support - Guide:** [Machine Learning Engineering - Instabilities, Checkpoints and Debugging](https://github.com/stas00/ml-engineering/tree/139708e52cb06f9191cf1d9959def9187b205c58) - Read `training/instabilities/README.md` and `training/instabilities/training-loss-patterns.md` (spike types, resume and data-sampler spikes), `training/checkpoints/README.md`, `debug/underflow_overflow.md` and `training/dtype.md`. Use the spike taxonomy to label the failure you inject.
- **Support - Guide:** [The Smol Training Playbook - Preflight and Training Marathon](https://huggingface.co/spaces/HuggingFaceTB/smol-training-playbook) - Read the Preflight Checklist, the Training Marathon and the loss-spike stories for checks to run before and during a small pretraining run. The page has no stable anchors, so cite section names; its SmolLM numbers do not transfer to your model.
- **Support - Paper:** [2 OLMo 2 Furious, Sections 2.3, 3.1 to 3.4 and 6.3](https://arxiv.org/abs/2501.00656) - Read the base training recipe (Section 2.3), the stability deep dive (repeated n-grams, initialization, norm and z-loss changes, embedding weight decay; Sections 3.1 to 3.4) and stability operations (Section 6.3) as the real narrative behind your tiny-run contracts.
- **Support - Paper:** [OPT: Open Pre-trained Transformer Language Models, Section 2.5 (Zhang et al., 2022)](https://arxiv.org/abs/2205.01068) - Read Table 1 and Section 2.5: at least 35 manual restarts, loss divergences handled by lowering the learning rate and restarting from an earlier checkpoint, and mid-run clipping changes. Use it as the failed-run case study when you write your own run log.
- **Support - Paper:** [Scaling Laws and Compute-Optimal Training Beyond Fixed Training Durations (Hagele et al., 2024) with MiniCPM Section 4](https://arxiv.org/abs/2405.18392) - Read Hagele Sections 2 and 3 (constant learning rate plus cooldown matches cosine and allows mid-run evaluation) and MiniCPM Section 4 (warmup-stable-decay with a short decay phase). MiniCPM is at https://arxiv.org/abs/2404.06395. Both use sub-billion or small models.
- **Support - Paper:** [Tensor Programs V: Tuning Large Neural Networks via Zero-Shot Hyperparameter Transfer (Yang et al., 2022)](https://arxiv.org/abs/2203.03466) - Read Algorithm 1 (muTransfer) and Table 1 (which hyperparameters transfer and which do not), then one transfer figure. Transfer holds within one architecture, optimizer and data family.
- **Reference - Paper:** [Mixed Precision Training (Micikevicius et al., 2018)](https://arxiv.org/abs/1710.03740) - Read Section 3: FP32 master weights, loss scaling and FP32 accumulation, and the rule to unscale gradients before clipping. It predates BF16, which needs little or no loss scaling.
- **Reference - Paper:** [An Empirical Model of Large-Batch Training (McCandlish et al., 2018)](https://arxiv.org/abs/1812.06162) - Read Section 2: the gradient noise scale, the critical batch size and the steps-versus-examples trade-off in Figure 1. The noise scale grows as loss falls, so measure it at more than one point.
- **Support - Lab:** [Modern LLM Notebook - Training and Accounting](https://github.com/walkinglabs/modern-llm-notebook/tree/979eecf09669121167184ef925d8edbc089fc13e) - Use `notebooks-en/part2-training/10-training-loss.ipynb` and the appendix notebooks `B-flops-memory-accounting.ipynb` and `C-mixed-precision-training.ipynb` for the compact trainer, FLOP and memory accounting and mixed precision. Seed one numerical failure and reconcile the estimate with measurement.
- **Support - Practice:** [TensorTonic - Training Reliability Drills](https://www.tensortonic.com/problems/cs336-l02-training-memory-accountant) - Solve Mixed-Precision Training Memory Accountant (`cs336-l02-training-memory-accountant`), Transformer Training FLOP Estimator (`cs336-l02-training-flop-estimator`), Gradient Accumulation Equivalence (`cs336-l02-gradient-accumulation-step`) and Generate a Warmup-Stable-Decay Schedule (`cs336-l11-wsd-learning-rate`). Validate each against your training harness. Public test cases check the listed edge cases, not gradients or the hidden grader, so keep your own tests beside each solution. 
- **Support - Project:** [Decoder-Only Transformer Stack - Reliable Training](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-2/decoder-only-transformer-stack.md) - Use the existing training, resume and arithmetic contracts as the small controlled system. Add stored evidence for data, numerical, state and throughput failure injections.
- **Reference - Reference:** [PyTorch 2.14 - AMP Examples and Profiler](https://docs.pytorch.org/docs/2.14/notes/amp_examples.html) - AMP examples: Gradient clipping and Gradient accumulation, including effective-batch scale updates and skipped optimizer steps. Profiler reference: `record_function`, `schedule` and memory capture. Use with PyTorch 2.14.1.
- **Reference - Reference:** [Python - Atomic Replacement and File Synchronization](https://docs.python.org/3/library/os.html#os.replace) - Read `os.replace` and `os.fsync` for the local single-file publication extension. Atomic visibility is not a power-loss durability guarantee. Page read 2026-10-16.

### Exit checkpoint

Resume a versioned run without an unexplained state or data discontinuity, diagnose one seeded data, numerical, checkpoint and throughput failure from stored evidence, and reconcile one memory and one compute prediction with measurements.

<details>
<summary>Deliberately left for later</summary>

- Multi-node parallelism and optimizer sharding
- Production fleet schedulers and elastic recovery
- Hyperparameter sweeps without a stated mechanism question

</details>

## LMR-4. Scaling and Data Mixtures

**Why:** Scaling claims are empirical models with narrow support, not universal laws. This stage uses small experiments to allocate compute while exposing uncertainty, confounding and regimes where the fitted relationship fails.

### Learn this much

- [ ] Parameter, data, token and compute scaling as separate variables _(Required)_
- [ ] Fixed-token, fixed-data and fixed-compute comparison contracts _(Required)_
- [ ] Kaplan-style loss scaling and its compute-allocation conclusion _(Required)_
- [ ] Chinchilla IsoFLOP profiles and compute-optimal allocation _(Required)_
- [ ] Irreducible loss, additive noise floors and unstable exponent fitting _(Required)_
- [ ] Sparse but identifiable experiment matrices under a fixed budget _(Required)_
- [ ] Nonlinear versus log-space fitting and weighting choices _(Required)_
- [ ] Parameter uncertainty, residual analysis and influence of failed runs _(Required)_
- [ ] Prediction on a configuration excluded from fitting _(Required)_
- [ ] Critical batch, learning-rate scaling and optimization transfer _(Required)_
- [ ] muP width invariants and limits of hyperparameter transfer _(Required)_
- [ ] Source-specific mixture response curves and realized-token counts _(Required)_
- [ ] Data quality, quantity, repetition and effective diversity _(Required)_
- [ ] Curriculum, mid-training and annealing as distribution changes _(Required)_
- [ ] Synthetic-data gains, teacher dependence and collapse risk _(Required)_
- [ ] Architecture, optimization, tokenizer, kernel and evaluator confounding _(Required)_
- [ ] Budget allocation across models, tokens, mixtures and experiments _(Required)_
- [ ] Inference-aware scaling and lifetime-compute trade-offs _(Optional)_
- [ ] Data-constrained and repeated-token scaling _(Optional)_
- [ ] Theoretical derivations of empirical scaling exponents _(Depth)_
- [ ] Frontier-scale validation across many model families _(Later)_

### Study units

#### U1. Parameters, tokens and compute as separate variables, and fixed-token versus fixed-compute contracts

**About 3 h** · **Target:** Derive

Topics: Parameter, data, token and compute scaling as separate variables; Fixed-token, fixed-data and fixed-compute comparison contracts

The LLM Foundations unit on parameter and FLOP counts supplied the arithmetic. Research comparisons now need a contract that says which resource is conserved and which effects remain entangled.

**You can now**

- Separate parameter count, processed tokens, unique data and arithmetic compute in a run contract.
- Derive fixed-token and fixed-compute comparisons with an explicit FLOP-count convention.
- Budget memory and elapsed time separately from the arithmetic approximation.

**Study**

1. [CS336 Spring 2026 Assignment 3, Version 26.0.5](https://github.com/stanford-cs336/assignment3-scaling/blob/03e9372992e913061b9e78b5cfcb62ad8a87de35/cs336_assignment3_scaling.pdf) (CS336 Assignment 3 - Scaling) - Section 2.1, Scaling Laws from IsoFLOPs profiles; Section 3.1, Training Run Details. Depth: Read the API setup as a comparison contract only. Use your existing decoder and corpus locally, not the enrollment-only training service. Never publish assignment solutions.
2. [Porian et al.: what counts as model size](https://arxiv.org/html/2406.19146v1#S2) (Resolving Discrepancies in Compute-Optimal Scaling of Language Models (Porian et al., 2024)) - arXiv:2406.19146v1, Sections 2.1 and 2.2, Section 3.2, and Appendix B, Estimating FLOPs and accounting for attention.

**Focus**

- Use $`N`$ for a declared parameter count, $`D`$ for processed training tokens and $`C`$ for training FLOPs. Unique corpus tokens are a separate quantity when sampling repeats data.
- The dense matmul estimate $`C\approx6ND`$ is not an identity. Count the output projection even with tied embeddings; account separately for attention, recomputation and other omitted operations.
- Fixed tokens asks about capacity at a shared exposure budget. Fixed FLOPs trades capacity against exposure. Fixed unique data permits different repetition counts. None isolates model size by itself.
- Keep tokenizer, document split, context, loss denominator, architecture family and tuning budget explicit. Memory depends on microbatch and activations; elapsed time depends on the implementation, not just FLOPs.

**Reproduce:** Closed-book, plan dense models with 10 million and 20 million counted parameters. At 2 million processed tokens each, $`6ND`$ gives $`1.2\times10^{14}`$ and $`2.4\times10^{14}`$ FLOPs. At the first compute budget, the larger model instead gets 1 million tokens. Verify with integer arithmetic, then write the analogous two rows for your decoder, including output-head cost, memory state dtypes and omitted FLOPs.

**Traps**

- Tied weights reduce stored parameters but do not remove the output matrix multiplication.
- Equal optimizer steps do not mean equal tokens if token batch changes. Equal nominal tokens also need the same mask and padding-count policy.
- Calling equal elapsed time an IsoFLOP comparison. A kernel improvement can buy more tokens in that time without changing the statistical scaling relationship.

**Practice**

- The section mini-project covers this: the lmlab run planner records fixed-token and fixed-compute rows, parameter-count conventions, unique and processed tokens, estimated FLOPs, measured time and peak memory.

**Stop when:** Your two comparison tables conserve their declared budgets, and each row names parameter and token conventions plus the main compute and memory omissions.

<details>
<summary>Self-test</summary>

1. Under $`C\approx6ND`$, what happens to tokens if parameter count doubles at fixed compute?
   - They halve. At fixed tokens, the estimated compute instead doubles; these answer different questions.
2. Is training twice over a corpus equivalent to a corpus twice as large?
   - No. Processed-token count can match while unique data and repetition differ. Record both and evaluate on documents excluded from training.
3. Can equal FLOPs guarantee equal peak memory?
   - No. State, activations, sequence length, microbatch, precision and recomputation determine peak memory. Measure feasibility separately.

</details>

#### U2. Kaplan scaling, Chinchilla IsoFLOP profiles and why their allocations disagree

**About 5 h** · **Target:** Derive + Measure

Topics: Kaplan-style loss scaling and its compute-allocation conclusion; Chinchilla IsoFLOP profiles and compute-optimal allocation

An allocation rule inherits the experiment that produced it. Separate the empirical frontier from a parametric fit before spending a budget on either.

**You can now**

- Derive the allocation implied by a separable parameter-and-token loss model.
- Distinguish sampled IsoFLOP minima, fitted valleys and the resulting frontier.
- Explain the Kaplan-Chinchilla disagreement using optimization and accounting evidence, not a universal token ratio.

**Study**

1. [Kaplan et al.: historical allocation](https://arxiv.org/abs/2001.08361v1) (Scaling Laws for Neural Language Models) - arXiv:2001.08361v1, Sections 1 and 2, Figure 1, and Section 6, Optimal Allocation of the Compute Budget. Depth: Section 5 supplies training-time and batch corrections; the allocation conclusion is in Section 6. Read it with Porian below, not as a current prescription.
2. [Hoffmann et al.: three allocation methods](https://arxiv.org/abs/2203.15556v1) (Training Compute-Optimal Large Language Models) - arXiv:2203.15556v1, Figure 1, Sections 3.2 and 3.3, and Appendix D.2, especially Equation 10.
3. [Porian et al.: diagnosing the discrepancy](https://arxiv.org/html/2406.19146v1#S3) (Resolving Discrepancies in Compute-Optimal Scaling of Language Models (Porian et al., 2024)) - arXiv:2406.19146v1, Figure 1, Sections 3.1 to 3.5 and 5.2.
4. [Besiroglu et al.: Approach 3 replication](https://arxiv.org/html/2404.10102v2) (Chinchilla Scaling: A Replication Attempt (Besiroglu et al., 2024)) - arXiv:2404.10102v2, Sections 1 to 4 and Appendix A.1.

**Focus**

- For $`L=E+A N^{-\alpha}+B D^{-\beta}`$ with positive coefficients and exponents, substitute $`D=C/(6N)`$. The stationary condition is $`\alpha A N^{-\alpha}=\beta B D^{-\beta}`$, not equality of the two reducible-loss terms unless the exponents match.
- This yields $`N_*=(\alpha A/(\beta B))^{1/(\alpha+\beta)}(C/6)^{\beta/(\alpha+\beta)}`$. Equal growth follows only when $`\alpha=\beta`$. Twenty tokens per parameter is not a universal constant.
- Porian isolates output-head FLOPs, excessive warmup and scale-dependent optimizer tuning. Matching decay changes loss but does not by itself explain the allocation gap in that study.
- Besiroglu challenges Approach 3 rounding, optimizer termination and intervals using reconstructed data. That does not invalidate the separate IsoFLOP evidence or establish a law for your decoder.

**Reproduce:** Derive the stationary condition without notes. As an arithmetic audit, use the rounded Equation 10 constants $`E=1.69`$, $`A=406.4`$, $`B=410.7`$, $`\alpha=0.34`$, $`\beta=0.28`$ and $`C=5.88\times10^{23}`$ FLOPs. Obtain approximately 32.491 billion parameters and 3.01622 trillion tokens; compare with a one-dimensional numerical minimization and require relative allocation error below $`10^{-5}`$. This is the rounded published fit, not a recommendation or a reproduction of Chinchilla. Explain the mismatch using Besiroglu.

**Traps**

- Fitting a valley when every sampled point is still descending. An optimum outside the sampled range is not identified.
- Treating the historical allocation exponents as percentages of actual dollars or wall-clock time.
- Repeating the introductory IsoFLOP fixture from the LLM Foundations arithmetic unit and calling it a new measured result.

**Practice**

- [TensorTonic: Recover an IsoFLOP Compute-Optimal Frontier](https://www.tensortonic.com/problems/cs336-l09-isoflop-optimal-frontier) - Fit a quadratic in $`\log N`$ at each compute budget, then a log-space frontier across the recovered minima. Free. The public cases supply square-root and four-tenths-power frontiers with guaranteed interior positive-curvature minima. Add your own boundary-minimum rejection test. These are supplied-data drills, not measured scaling evidence.

**Stop when:** Your analytic and numerical allocations agree, your frontier code rejects an unsupported valley, and you can explain both the Porian and Besiroglu caveats.

<details>
<summary>Self-test</summary>

1. Why does the additive floor not change the fixed-compute optimum in this model?
   - It is constant in $`N`$ and $`D`$, so its derivative vanishes. Estimating it can still change the other fitted parameters and hence the estimated optimum.
2. What allocation exponents follow from $`\alpha=0.34`$ and $`\beta=0.28`$?
   - Approximately 0.451613 for parameters and 0.548387 for tokens. They sum to one under $`C=6ND`$, but are not both 0.5.
3. Does Porian show that decay never matters?
   - No. It can improve loss substantially. The claim concerns its limited role in explaining the allocation discrepancy in their tested setups.

</details>

#### U3. Irreducible loss, noise floors, and nonlinear versus log-space fitting

**About 4 h** · **Target:** Derive + Implement

Topics: Irreducible loss, additive noise floors and unstable exponent fitting; Nonlinear versus log-space fitting and weighting choices

A straight line on log axes can hide a missing additive term. Small fitting choices can reverse the allocation inferred from the same runs.

**You can now**

- Implement a positive-coefficient loss model with an explicit additive floor.
- Compare raw-loss and log-loss objectives and explain their different error weighting.
- Diagnose floor-exponent trade-offs and distinguish an asymptotic loss floor from measurement noise.

**Study**

1. [Hoffmann et al.: the fitted loss surface](https://arxiv.org/abs/2203.15556v1) (Training Compute-Optimal Large Language Models) - arXiv:2203.15556v1, Section 3.3, Equations 2 and 3, and Appendix D.2, Equations 10 and 11. Depth: Use the model and fitting objective, not Appendix D.2 as a proof of separability. Read the Approach 3 caveat below before using its constants.
2. [Besiroglu et al.: numerical fitting failure](https://arxiv.org/html/2404.10102v2#S3) (Chinchilla Scaling: A Replication Attempt (Besiroglu et al., 2024)) - arXiv:2404.10102v2, Sections 3.1 and 3.2.
3. [Fit a Data Power Law with a Noise Floor](https://www.tensortonic.com/problems/cs336-l09-fit-data-power-law) (TensorTonic - Scaling Laws I and II) - Statement: candidate-floor eligibility, log-space least squares and raw-loss RMSE selection; the three public cases.

**Focus**

- For $`L(D)=E+A D^{-\alpha}`$, only $`\log(L-E)=\log A-\alpha\log D`$ is linear. Logging total loss does not remove the floor. A candidate floor must leave positive residual loss.
- Raw least squares weights absolute loss errors. For small errors, squared log-loss residuals behave like squared raw errors divided by $`L^2`$. Logging the floor-subtracted loss instead gives sensitivity proportional to $`1/(L-E)^2`$; these are three different objectives.
- An irreducible conditional entropy belongs to a specified tokenizer, context and evaluation distribution. A short sweep cannot establish that a fitted intercept is that entropy. Seed and evaluation noise are variation around measurements, not the intercept.
- Use multiple starts, scaled variables, parameter bounds and convergence diagnostics. Save full-precision fits. Besiroglu shows why a solver returning successfully is not enough; Porian also makes optimization quality part of the run contract.

**Reproduce:** Construct noiseless losses $`L(D)=1+4D^{-1/2}`$ at $`D=1,4,16,64`$. Closed-book, recover the floor-subtracted log slope and predict 1.25 at $`D=256`$. Fit a no-floor log line to the same observations: its exponent is about 0.289793 and prediction about 0.948683. Then fit the floor, positive coefficient and positive exponent jointly by raw nonlinear least squares from several starts; require maximum absolute fitted-loss error below $`10^{-8}`$. Keep the constructed truth separate from your later measured decoder losses.

**Traps**

- Calling a fitted floor the entropy of language. Tokenization, context, domain, finite optimization and misspecification all matter.
- Silently switching from log total loss to log excess loss. Their noise weighting differs, especially near the floor.
- Interpreting a tiny training residual as parameter identifiability. Many floor-exponent combinations can agree over a narrow range.

**Practice**

- [TensorTonic: Fit a Data Power Law with a Noise Floor](https://www.tensortonic.com/problems/cs336-l09-fit-data-power-law) - Implement the candidate-floor procedure in the statement, not a different joint nonlinear fit. Free. Public cases use inverse-square-root and inverse-linear curves and multiple target sizes. They do not test noisy-run uncertainty. Compare this prescribed fitter with your raw nonlinear fit on the constructed check, then keep both for the mini-project.

**Stop when:** You pass the named drill, reproduce the missing-floor failure and compare the three objectives without confusing a floor with noise.

<details>
<summary>Self-test</summary>

1. Why can a log-log total-loss slope flatten with more data even with a constant true exponent?
   - The constant floor contributes more of the total loss. The reducible term still follows its power law, but the total does not.
2. Does multiplying an objective by a positive constant change its exact minimizer?
   - No. It can change a numerical solver's stopping behavior under absolute tolerances. Check gradients, objective improvement and multi-start agreement rather than relying only on a termination flag.
3. Can fixing the floor make an interval look artificially precise?
   - Yes. It conditions on a value that may be uncertain or wrong. Profile plausible floors and report how predictions and allocation change.

</details>

#### U4. Identifiable run matrices under a fixed budget and held-out configuration tests

**About 6 h** · **Target:** Measure

Topics: Sparse but identifiable experiment matrices under a fixed budget; Prediction on a configuration excluded from fitting

The fixture has already taught the mechanics. Now the evidence must come from your machine, with enough independent variation to challenge the fit.

**You can now**

- Design a sparse matrix that varies capacity and exposure independently enough for the chosen fit.
- Run a bounded measured decoder sweep with versioned data, tuning and all-attempt accounting.
- Freeze a prediction and acceptance rule before training a configuration excluded from all fitting.

**Study**

1. [CS336 Spring 2026 Assignment 3: designing a scaling experiment](https://github.com/stanford-cs336/assignment3-scaling/blob/03e9372992e913061b9e78b5cfcb62ad8a87de35/cs336_assignment3_scaling.pdf) (CS336 Assignment 3 - Scaling) - Version 26.0.5, Sections 3.1 and 3.3, problem `scaling_laws`, including the run-selection and predicted-loss questions. Depth: Replace the enrollment-only service with the local sweep below. The public `test_api.py` and `test_scheduler.py` test the training service itself and need a local PostgreSQL server; they are not an offline fitter test suite. Never publish solutions.
2. [Porian et al.: grid, tuning and transfer limits](https://arxiv.org/html/2406.19146v1#S2) (Resolving Discrepancies in Compute-Optimal Scaling of Language Models (Porian et al., 2024)) - arXiv:2406.19146v1, Sections 2.2, 2.3, 3.3, 3.5 and 5.2.
3. [Applied Science Research Laboratory: precommitment and lineage](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/capstones/applied-science-research-laboratory.md#architecture-constraints) (Applied Science Research Laboratory - Scaling Study) - Core requirements; Architecture constraints; Milestones B and C. Depth: Borrow the experiment protocol only, not the capstone scale or its full experiment program.

**Focus**

- Use the tested decoder and versioned corpus from lmlab. In PyTorch 2.14.1, pilot three same-family sizes near 10, 20 and 40 million total parameters at a common context of 128 and three terminal token budgets near 0.25, 0.5 and 1 million. Record actual counts, not size labels.
- Reserve a middle-size, middle-token cell before outcomes. Train the other eight cells independently with schedules ending at their own token budgets. Repeat two contrasting fitting cells with three seeds total. Keep one tokenizer, document-disjoint evaluation set, loss mask and loss denominator throughout.
- Cap the measured sweep at a few hours using pilot throughput. If CPU-only or memory-limited, shrink all sizes, contexts or token budgets before freezing the matrix. Preserve three sizes and three exposures, record the reduced regime and avoid frontier claims. Count tuning, retries and evaluation in the budget.
- For a five-parameter surface, inspect the scaled prediction Jacobian for deficient rank and small singular values. Eight cells do not guarantee practical identifiability. If weak, fit one capacity slice or a simpler local model and report the unresolved terms rather than manufacturing exponents.

**Reproduce:** Closed-book, turn your pilot into a run table with planned and actual parameters, processed and unique tokens, token batch, schedule, seeds, estimated FLOPs and measured runtime. Show which rows isolate a size effect, a token effect and a fixed-compute trade-off. Before running the reserved cell, commit its predicted document-held-out loss, uncertainty procedure, tolerance and a plan for a miss. Include a matched-compute pair, adjusting token counts to your actual counted model sizes.

**Traps**

- Varying only along one compute contour, then claiming independent capacity and data effects without checking identifiability.
- Counting checkpoints from one trajectory as independently trained terminal runs. A schedule designed for the longest run changes the treatment at earlier checkpoints.
- Tuning the fit after seeing the reserved loss and still calling the configuration held out. A revised fit needs a new confirmatory configuration.

**Practice**

- The section mini-project covers this: the lmlab measured run matrix, a matched-compute pair, repeated fitting cells and a configuration-level prediction committed before its training run.

**Stop when:** Your fitting runs are measured and versioned, your fit has a defensible identifiability audit, and the reserved configuration has a committed prediction but has not yet been run.

<details>
<summary>Self-test</summary>

1. Why is holding out documents not the same as holding out a configuration?
   - Document holdout tests language-model generalization. Configuration holdout tests the fitted response model on a model-and-token setting it did not use. Both boundaries are needed.
2. Can a full-rank Jacobian certify the scaling law?
   - No. It is a local identifiability diagnostic under the assumed form and parameter values. Conditioning, noise, optimization and misspecification can still make estimates unstable.
3. What should you do when the fitted surface is unstable?
   - Report the instability. Narrow the question to an identifiable slice or simpler model, or use the reserved experiment budget to vary the confounded factors. Do not report a precise joint allocation.

</details>

#### U5. Fit uncertainty, residual analysis and the influence of failed runs

**About 4 h** · **Target:** Measure

Topics: Parameter uncertainty, residual analysis and influence of failed runs

A small fitting error is not a trustworthy prediction. The result matters only if it survives the reserved run and the strongest plausible failure analysis.

**You can now**

- Quantify prediction uncertainty while distinguishing seed variation, evaluation sampling and fit misspecification.
- Audit residual structure and influence without silently censoring difficult runs.
- Evaluate the frozen held-out configuration and preserve a regime the fitted relationship does not explain.

**Study**

1. [Besiroglu et al.: uncertainty and outliers](https://arxiv.org/html/2404.10102v2#S3) (Chinchilla Scaling: A Replication Attempt (Besiroglu et al., 2024)) - arXiv:2404.10102v2, Sections 3.1 to 3.3, Figures 3 to 5 and Appendix A.1.
2. [Porian et al.: uncertainty construction](https://arxiv.org/html/2406.19146v1#S2.SS3) (Resolving Discrepancies in Compute-Optimal Scaling of Language Models (Porian et al., 2024)) - arXiv:2406.19146v1, Section 2.3 and Appendix C, Additional data analysis details. Depth: Distinguish their noise-and-interpolate procedure from resampling independent training seeds. Do not copy its calibrated noise magnitude into your study.
3. [Applied Science Research Laboratory: failed-run accounting](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/capstones/applied-science-research-laboratory.md#architecture-constraints) (Applied Science Research Laboratory - Scaling Study) - Architecture constraints; Milestones D, E and F; Correctness requirements. Depth: Apply these to the bounded scaling study, not a new capstone.

**Focus**

- The Math Foundations units on resampling and on regression diagnostics supply the tools. Resample the independent unit you actually have. Checkpoints from one run and tokens in one document are not independent seed replicates.
- Use the repeated fitting cells to estimate seed variation, with the limitation that it may vary across the matrix. Resample evaluation documents for evaluation uncertainty. A parametric bootstrap can propagate these assumptions through the fitter, but must name the assumed noise model and flag failed refits.
- Plot observed-minus-predicted loss against $`N`$, $`D`$, fitted loss, repetition and optimizer steps. Compare leave-one-configuration-out fits and alternative floors or objectives. Parameter intervals and intervals for a new noisy run answer different questions.
- Keep every run and its spent budget. A timeout has no terminal loss at the planned token budget. Exclude invalid measurements by a declared reason; compare fits with and without valid high-loss points. Besiroglu critiques Approach 3 specifically, while Porian shows why optimization mismatches can create structured residuals.

**Reproduce:** Closed-book, regenerate your fit from immutable terminal-run records. Add residual plots, leave-one-configuration-out prediction shifts and a seed-noise sensitivity analysis. Confirm the reserved prediction and tolerance were committed first, then train and score that configuration once under the frozen protocol. Report the signed prediction error and whether it meets the declared rule. Preserve one failed regime, such as a pilot with excessive warmup or repeated data; do not promise the failure has a particular loss.

**Traps**

- Bootstrapping many checkpoints from a single trajectory and reporting them as many independent experiments.
- Assigning a timeout its last partial loss as though it reached the terminal token budget. That changes the predictor and the response together.
- Discarding a valid high-loss run because it spoils a power law. It may be the most informative evidence about the law's boundary.

**Practice**

- The section mini-project covers this: residual and influence plots, conditional uncertainty with declared resampling units, the measured held-out prediction error and a retained failure regime.

**Stop when:** A clean analysis regenerates your uncertainty and residuals, the reserved configuration has an honest pass or miss, and every failed or excluded attempt remains traceable.

<details>
<summary>Self-test</summary>

1. Does a confidence interval for the fitted mean predict the next training seed?
   - Not by itself. A new run adds training-seed and measurement variation. A predictive interval must include the relevant noise and still depends on the assumed response model.
2. What can three repeated seeds at two cells establish?
   - A limited view of variability at those cells. It does not establish constant variance across all sizes or a reliable tail distribution. Report the sparse replication and use sensitivity analyses.
3. The reserved run misses the interval. What follows?
   - The frozen procedure failed that check. Audit data lineage, budgets, optimization and model form. Keep the miss; a refit using it becomes exploratory and needs another held-out confirmation.

</details>

#### U6. Critical batch, learning-rate scaling and the limits of muP width transfer

**About 6 h** · **Target:** Derive + Measure

Topics: Critical batch, learning-rate scaling and optimization transfer; muP width invariants and limits of hyperparameter transfer

A small model can look inefficient simply because its batch or warmup is inappropriate. Transfer rules reduce search only when their parameterization and scope are checked.

**You can now**

- Estimate a target-dependent critical batch from reached runs without treating it as a hardware constant.
- Fit local learning-rate and batch trends and test transfer at another width under matched exposure.
- Diagnose muP coordinate behavior and distinguish width transfer from depth, data or schedule transfer.

**Study**

1. [Porian et al.: scale-dependent optimization](https://arxiv.org/html/2406.19146v1#S3.SS5) (Resolving Discrepancies in Compute-Optimal Scaling of Language Models (Porian et al., 2024)) - arXiv:2406.19146v1, Section 3.5, Figure 3 and Appendix E.1 to E.3.
2. [Official muP implementation guide](https://github.com/microsoft/mup/blob/19814971934ef91dd546f88e913fc963e096d11c/README.md) (Maximal Update Parametrization: width-transfer checks) - Basic Usage; How mup Works Under the Hood; Current Limitations; Coord Check through Tips for Coord Check. Depth: Read as a design reference for your existing width-scaling implementation. Skip installation and the legacy loading examples. Read Wider is Always Better as a warning sign to investigate: a reversal at one width and step can also be seed noise, so repeat it before you call the parameterization wrong.
3. [Estimate Critical Batch Size](https://www.tensortonic.com/problems/cs336-l09-critical-batch-size) (TensorTonic - Scaling Laws I and II) - Statement: reached-target filtering, separate step and example minima, and their ratio.

**Focus**

- The drill estimates $`B_{\text{crit}}=E_{\min}/S_{\min}`$, where examples and steps have separate minima among reached runs. These observed minima approximate limiting quantities; a narrow batch grid can bias the estimate. For language models, declare whether exposure and batch use examples or tokens.
- Changing token batch changes the number of updates at fixed exposure. Retune learning rate under the same search budget and keep warmup expressed in a declared unit. Porian also finds the AdamW second-moment coefficient matters at small batches; blindly scaling learning rate is not enough.
- The Pretraining Reliability unit on initialization transfer and muP covers the width-scaling rules. The official guide distinguishes hidden matrices, input and readout weights, fixed dimensions and width dimensions. There is no single inverse-width learning-rate rule for every tensor or optimizer.
- Coordinate checks should cover initialization and early updates across seeds. Stable activation scales do not guarantee the best learning rate transfers, and width transfer does not license changing depth, tokenizer, sequence length, data distribution or training horizon.

**Reproduce:** Closed-book, for reached batches of 8, 16 and 32 examples with 100, 60 and 50 steps, compute consumed examples 800, 960 and 1600; the drill estimate is 16 examples. Then use the smallest two widths of your local decoder with PyTorch 2.14.1: compare a small learning-rate-by-token-batch grid at fixed processed tokens. Record actual updates and warmup tokens. Add initialization and early-update coordinate summaries across three widths and three seeds; compare a predicted transferred learning rate with a neighboring rate at the reserved width. Report whether it transfers, not an expected winning rate.

**Traps**

- Treating the batch that fits in memory as the critical batch. Memory capacity and statistical efficiency are different constraints.
- Fitting a scaling trend through grid winners at the grid boundary without checking whether the optimum lies outside the grid.
- Using the per-matrix learning-rate summary in Section 5 of the Modern LLM Notebook's scaling-laws notebook as a complete muP specification. Use the official parameter-class rules instead; stable coordinates are a diagnostic, not a universal loss guarantee.

**Practice**

- [TensorTonic: Estimate Critical Batch Size](https://www.tensortonic.com/problems/cs336-l09-critical-batch-size) - Implement the statement's reached-target minima and ratio. Free. Public cases all reach the target and include minima at different batches. Add unreached points and an explicit all-unreached policy in your own tests.
- [TensorTonic: Fit Learning-Rate and Batch-Size Scaling](https://www.tensortonic.com/problems/cs336-l11-hyperparameter-scaling-fit) - Select per-scale grid winners, then fit the two specified log-space lines and residuals. Free. Public cases cover exact trends, grid tie order and three-scale residuals. They do not establish transfer from a measured decoder sweep.
- [TensorTonic: Diagnose muP Width Invariants](https://www.tensortonic.com/problems/cs336-l11-mup-invariant-diagnostics) - Fit log-width slopes for activation and update-change RMS and apply the supplied tolerance. Free. Public cases cover constant series, one noninvariant series and small width variation. Keep the actual coordinate and transfer experiment in the section mini-project; supplied arrays are preparation only.

**Stop when:** You complete the three drills, retain unreached attempts, and distinguish measured coordinate stability from the observed success or failure of learning-rate transfer.

<details>
<summary>Self-test</summary>

1. Does the batch with the fewest steps necessarily consume the fewest examples?
   - No. In the constructed sweep it takes 50 steps but consumes 1600 examples, while the 100-step run consumes 800. The two minima serve different objectives.
2. A batch never reaches the target before the cap. How do you include it?
   - Keep it as an unreached, budgeted attempt. Do not use its capped steps as steps-to-target. Report censoring and add an all-unreached guard to your own tests.
3. Can flat coordinate scales prove the same learning rate is optimal at every width?
   - No. They check scale behavior over the measured widths and early steps. Test the transferred setting against neighboring settings at the new width under the same data and budget.

</details>

#### U7. Mixture response curves, quality versus quantity, repetition and the data-constrained regime

**About 6 h** · **Target:** Measure

Topics: Source-specific mixture response curves and realized-token counts; Data quality, quantity, repetition and effective diversity; Data-constrained and repeated-token scaling

Filtering, mixtures and deterministic shards taught the sampler. The research question is now whether a mixture gain survives exposure matching, domain slices and a new mixture prediction.

**You can now**

- Fit source-specific response curves at fixed model size and processed tokens, using realized rather than requested mixture weights.
- Separate quality selection from unique-data quantity, repetition and evaluation-domain overlap.
- Test a held-out mixture and identify where a single-epoch scaling assumption fails.

**Study**

1. [Ye et al.: data mixing response models](https://arxiv.org/html/2403.16952v1#S3) (Data Mixing Laws: Optimizing Data Mixtures by Predicting Language Modeling Performance (Ye et al., 2024)) - arXiv:2403.16952v1, Section 3.1 to 3.3, Equations 6 to 8 and Table 1; Appendix A. Depth: Use the two-domain curve and explicit evaluation-domain aggregation. Skip the large nested extrapolation program in Section 4; validate only within your tested proportions.
2. [Muennighoff et al.: repeated-data scaling](https://arxiv.org/html/2305.16264v5#S3) (Scaling Data-Constrained Language Models) - arXiv:2305.16264v5, Sections 3 and 3.1, Sections 5 and 6, and Appendix A. Depth: Use the effective-data model and the fixed-FLOP repetition comparison. Skip fitting its full effective-parameter extension. The few-epoch finding is specific to the reported GPT-2-style models and C4 experiments, not a safe repetition limit.

**Focus**

- At fixed size and exposure, fit each evaluation domain separately, for example $`L_i(r)=c_i+k_i\exp(t_i r)`$ for a two-source proportion $`r`$. Freeze evaluation token weights before comparing mixtures. A different evaluation mixture changes the objective, not the trained model.
- Mixture weights sum to one, so an unrestricted exponential multi-domain model has redundant parameters: a common shift in all $`t_{ij}`$ can be absorbed into $`k_i`$. Use a reference domain or identifiable contrasts; do not interpret individual coefficients as causal source effects.
- Record requested and realized token shares, unique documents, unique token positions, source repetition, sequence lengths and contamination checks. A domain loss gain may be evaluation overlap or concentrated repetition, not improved general data quality.
- Compare filtering against both a random subset with the same unique-token budget and the unfiltered pool at the same processed-token budget. Keep tokenizer, model, tuning and held-out documents fixed. More epochs spend real compute even when their effective information gain decays.

**Reproduce:** Closed-book, derive the geometric effective-data toy model $`D_{\text{eff}}=U\sum_{j=0}^{m-1}(1-\delta)^j`$ for $`m`$ complete passes and $`0<\delta<1`$. With 100 unique token positions, three passes and $`\delta=0.5`$, obtain 175 effective versus 300 processed tokens. This is an assumed decay illustration, not a measured conversion. Then fit a two-domain curve from four measured proportions in lmlab and freeze the prediction at a fifth interior proportion before running it; compare per-domain loss, realized exposure and residuals.

**Traps**

- Interpreting TensorTonic's curve across data sizes as a direct fit across mixture proportions. Those are different predictors.
- Claiming a higher-quality source wins when it also has more unique tokens, fewer duplicates or more overlap with evaluation.
- Treating the repeated-token fit as a guarantee against overfitting. The paper notes failure runs whose increasing held-out loss the saturating formula does not model.

**Practice**

- [TensorTonic: Extrapolate Data-Mixture Scaling Curves](https://www.tensortonic.com/problems/cs336-l09-data-mixture-extrapolation) - Fit one candidate-floor power law across data sizes per named mixture, then compare target predictions. Free. Public cases include crossing curves, mixture-index ties and three fitted mixtures. Add uncertainty and measured proportions in the mini-project: use a small fixed decoder and the existing two source corpora, hold one proportion out, and compare a repeated subset against fresh data at matched processed tokens. Shrink the token budget on CPU before freezing the protocol.

**Stop when:** Your named drill passes, the measured mixture prediction has a recorded error, and your quality and repetition comparisons retain unique-token counts and fixed evaluation weights.

<details>
<summary>Self-test</summary>

1. Domain losses are 2.0 and 2.8 nats per scored token. What is loss with fixed evaluation token shares 25% and 75%?
   - 2.6 nats per scored token. This is a token-weighted cross-entropy average with the same tokenizer and scoring policy, not an average of perplexities.
2. Can two mixtures trade places as token budget increases?
   - Yes. Their floors, coefficients and exponents can differ. The crossing-curve drill illustrates this; predicting the crossing is not evidence until an excluded configuration is measured.
3. Why does the geometric effective-token sum saturate?
   - For $`0<\delta<1`$, the ratio $`1-\delta`$ is below one, so the infinite sum is $`U/\delta`$. This follows from the assumed decay rule, not from a universal law of repeated text.

</details>

#### U8. Curriculum, mid-training and annealing, and synthetic-data gains and collapse risk

**About 5 h** · **Target:** Explain + Measure

Topics: Curriculum, mid-training and annealing as distribution changes; Synthetic-data gains, teacher dependence and collapse risk

A curriculum changes the order of exposure, not just its total. OLMo 2 provides a concrete late-stage recipe; recursive-data experiments show why a synthetic source needs more than a good average score.

**You can now**

- Separate a late data-distribution change from learning-rate annealing with a matched continuation experiment.
- Audit synthetic examples for teacher dependence, verification, diversity and evaluation leakage.
- Explain recursive replacement collapse without claiming that every use of generated data must fail.

**Study**

1. [OLMo 2: annealing and targeted data](https://arxiv.org/html/2501.00656v3#S4) (2 OLMo 2 Furious, Section 4 (Mid-training Recipe)) - arXiv:2501.00656v3, Sections 4.1 to 4.5, especially 4.4.2, Evaluating Math Data with Microanneals. Depth: Read checkpoint soups as an additional experimental cost and confound. Do not reproduce the large-model training or paid synthetic-data generation; use your small decoder and a bounded local source.
2. [Shumailov et al.: recursive replacement and its assumptions](https://arxiv.org/abs/2305.17493v3) (The Curse of Recursion: Training on Generated Data Makes Models Forget (Shumailov et al.; Nature 2024)) - arXiv:2305.17493v3, Section 3, What is model collapse?, and Sections 4.1 and 4.2, including the single-dimensional Gaussian example. Depth: Keep the finite-sample recursive model separate from claims about verified synthetic math. Stop before the later large-language-model experiments; the Gaussian loop is the CPU reproduction.

**Focus**

- The Pretraining Reliability unit on warmup-stable-decay schedules covers the schedule mechanics. From one checkpoint including optimizer state, cross original versus targeted data with unchanged versus annealed learning rate. Match continuation tokens and use the same seed list; score both general and target domains.
- To test order rather than composition, compare a shuffled fixed mixture with a staged schedule using the same source-token totals. The four-way continuation separates local schedule and data effects but does not alone establish that late exposure is better than early exposure.
- For synthetic data, record the teacher or generator version, prompts, sampling settings, verification rule, rejection rate, accepted diversity and total generation cost. Freeze evaluation before generation and check both prompt and answer overlap. A verifier can select its own blind spots.
- Recursive replacement can lose support and amplify sampling or approximation error. Fresh real-data replay, accumulation rather than replacement, external verification and teacher quality change the process. Neither a successful targeted rewrite nor a collapse toy establishes a universal scaling law.

**Reproduce:** Closed-book, implement a NumPy recursive Gaussian fit-generate-refit loop from a standard normal, using 32 samples per generation, 100 generations and seeds 0 through 19. Compare replacement-only fitting with a control that draws fresh standard-normal samples every generation. Track fitted mean, variance and the probability mass outside the original interval $`[-2,2]`$. Name whether variance uses `ddof=0` or `ddof=1`; the MLE conditional expectation multiplies variance by $`31/32`$, whereas the unbiased estimator does not have that conditional mean shrinkage. Individual trajectories need not shrink monotonically. Then write the four matched local-decoder continuation rows before training any of them.

**Traps**

- Crediting a new mixture for a gain while also changing the schedule, checkpoint selection or model soup. These interventions require separate accounting.
- Reading the $`1-q`$ in collapse v3 Section 4.1 as the chance of losing an event in one generation. It is the probability of losing it at some point in the recursion, since the chain ends on that state with probability $`q`$; one generation of $`M`$ independent draws misses it with probability $`(1-q)^M`$.
- Saying unbiased sample variance prevents recursive collapse. Conditional unbiasedness is not a guarantee about a typical long recursive path or preservation of support.

**Practice**

- The section mini-project covers this: a CPU recursive-data diagnostic and four short continuations of the smallest existing decoder, crossing schedule and data while retaining general-domain loss. Use locally generated or already available licensed synthetic text, not a paid teacher API; cap generation and continuation time during the pilot.

**Stop when:** Your diagnostic distinguishes estimator bias from recursive path behavior, and the matched continuations separate data, schedule and their interaction without hiding general-domain regressions.

<details>
<summary>Self-test</summary>

1. Why branch every continuation from the same complete checkpoint?
   - It fixes the starting weights and optimizer history. Otherwise a data or schedule effect can be a different starting state or a reset-state effect. Record any intentionally reset state as another intervention.
2. What would establish a local data-by-schedule interaction?
   - The targeted-minus-original data difference changes between the two schedules beyond the declared uncertainty. Report all four cells and their domain slices rather than only the winning continuation.
3. Does the Gaussian toy contradict useful synthetic math data in OLMo 2?
   - No. The toy studies finite-sample recursive fitting under explicit replacement rules. OLMo 2 uses targeted data, mixed sources and a different training process. Its result is evidence for that recipe, not protection against every recursive-data failure.

</details>

#### U9. Confounded scaling gains, inference-aware scaling and the budget allocation decision

**About 4 h** · **Target:** Explain

Topics: Architecture, optimization, tokenizer, kernel and evaluator confounding; Budget allocation across models, tokens, mixtures and experiments; Inference-aware scaling and lifetime-compute trade-offs

The deliverable is not an exponent. It is a defensible change in what you train next, including the case where uncertainty makes another measurement worth more than a larger run.

**You can now**

- Separate statistical scaling gains from architecture, tokenizer, optimizer, implementation and evaluator changes.
- Choose a next model, token or mixture experiment using measured uncertainty and total research cost.
- State the supported range and a decisive falsification test for the resulting budget recommendation.

**Study**

1. [Porian et al.: confounds that change allocation](https://arxiv.org/html/2406.19146v1#S3) (Resolving Discrepancies in Compute-Optimal Scaling of Language Models (Porian et al., 2024)) - arXiv:2406.19146v1, Sections 3.1 to 3.5 and Section 5.2. Depth: Revisit the intervention evidence, not the entire paper. Map each proposed local gain to a changed or conserved variable.
2. [Applied Science Research Laboratory: decision and reproduction](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/capstones/applied-science-research-laboratory.md#completion-checklist) (Applied Science Research Laboratory - Scaling Study) - Milestones D, E and F; Deliverables; Completion checklist. Depth: Borrow the skeptical review and clean reproduction requirements for this small study, not the full laboratory project.
3. [Optional: lifetime compute versus serving cost](https://arxiv.org/html/2401.00448v3#S2) (Beyond Chinchilla-Optimal: Accounting for Inference in Language Model Scaling Laws (Sardana et al., 2024)) - arXiv:2401.00448v3, Section 2 (Equation 3), Sections 3 and 4 (47 trained models up to 10,000 tokens per parameter) and Section 6 (Equation 6). Depth: Optional serving extension. Equations 3 and 6 are conditional cost models: their answers depend on the assumed demand, utilization and prices, not on your hardware. Skip Appendix A and do not inherit the rounded Chinchilla coefficients as a local fit.

**Focus**

- Use the measured fixed-token and matched-compute comparisons, held-out error and retained failure regime. State tokenizer and evaluator identity before comparing loss; changed tokens or scoring denominators can make numerical losses incomparable.
- A kernel change can improve elapsed-time allocation without changing loss per processed token. An architecture change can alter both FLOPs and the fitted response. A larger hyperparameter search can move the apparent frontier while spending unreported compute. Keep search, pilot, failed-run and evaluation costs in the ledger.
- Compare the next capacity increase, more tokens, a mixture change and a replication run. Report predicted gain with sensitivity to floor, objective and noisy cells; include feasibility and the cost of being wrong. Choose another measurement when plausible fits reverse the decision.
- Optional: with the simplified dense convention, lifetime FLOPs are $`C_{\text{life}}=6ND_{\text{train}}+2ND_{\text{infer}}`$. This omits important context and attention costs. Prompt processing and autoregressive decoding have different utilization, so FLOPs alone do not price a service or prove a latency target.

**Reproduce:** Closed-book, regenerate your study tables and plots from terminal records, then write a one-page budget decision naming the winning action, its uncertainty, the held-out miss or success, one failed regime and the scale or data boundary beyond which you will not use the fit. Optional arithmetic audit: suppose equal useful quality has been established separately for a 20M-parameter model trained on 1M tokens and a 10M-parameter model trained on 3M tokens. Under the stated dense convention their training costs are $`1.2\times10^{14}`$ and $`1.8\times10^{14}`$ FLOPs; the smaller model recovers the extra training cost at 3M lifetime inference tokens. Check equality at that demand. These constructed rows do not establish equal quality or equal dollar cost.

**Traps**

- Selecting the most confident-looking fit rather than the one whose held-out prediction and residuals survive the protocol.
- Spending all remaining compute on the nominal optimum when a cheap repeated cell could distinguish opposite recommendations.
- Reading Sardana's Section 6 cost optimum as a measured price. It rests on assumed utilization, hardware and request mix; the paper's experiments test only the loss side, at its own model scale.

**Practice**

- The section mini-project covers this: the final bounded budget decision, all-attempt cost ledger, clean regeneration, skeptical confound audit and next decisive experiment. If taking the optional serving extension, measure prompt and decode time separately on the existing small models and fixed local prompts; record hardware, precision, batch and context instead of borrowing a paper's utilization or prices.

**Stop when:** A clean rerun regenerates the evidence, your decision changes a named budget allocation, and another reader can see what would overturn it and where it must not be extrapolated.

<details>
<summary>Self-test</summary>

1. A faster kernel yields lower loss in the same hour. Is that a new statistical scaling law?
   - Not by itself. It may allow more tokens or search within the hour. Compare at matched tokens and matched counted compute as well as elapsed time, and identify which budget the recommendation conserves.
2. Two plausible fits recommend different model sizes. What is the next decision?
   - Choose a feasible measurement that separates their predictions or reduces influential noise, and freeze its decision rule. Report that the current allocation is not identified rather than averaging the recommendations without justification.
3. Why can a smaller model trained longer be attractive for deployment?
   - Extra training cost can be amortized over lower per-token serving cost if it reaches the required quality. Demand, prompt and output lengths, batching, memory and latency constraints can change the result; the training-only optimum is a different objective.

</details>

### Mini-project: Measured scaling predictions and a bounded budget decision

**About 18 to 24 hours.** Extend `lmlab` with a small measured scaling and mixture study using the reliable trainer, existing decoder family and corpus. Reserve configurations before fitting, test predictions rather than importing published exponents, and choose the next experiment from uncertainty and all-attempt cost on your GPU or CPU.

1. Build `scaling/`'s fixed-token and fixed-compute planner using the tested decoder. Before training, check parameter conventions, output-head and attention FLOPs, masks and token denominators against analytical counts and tensor inventories; retain unique/processed-token definitions, memory predictions, omitted costs and study-wide budget caps.
2. Pass TensorTonic's Fit a Data Power Law with a Noise Floor and compare its prescribed fitter with raw nonlinear and no-floor fits on constructed truth. Check analytical allocation against numerical minimization and reject unsupported frontier minima; retain convergence diagnostics and full-precision fits.
3. Pilot runtime and peak memory, then freeze a capacity-by-exposure matrix with a matched-compute pair, repeated fitting cells and reserved configuration. Train terminal runs independently under fixed tokenizer, evaluation and tuning contracts across paired seeds; audit identifiability and commit the reserved prediction before its run.
4. Reuse the muP worksheet for measured initialization and early-update coordinate checks across widths and seeds; pass TensorTonic's Diagnose muP Width Invariants. Compare learning-rate-by-batch sweeps and transferred versus neighboring rates at matched tokens and tuning budgets; retain actual updates, warmup exposure and unreached targets.
5. Fit domain response curves from realized proportions of your existing source corpora; freeze and test an excluded proportion with uncertainty. At matched processed tokens, compare repeated subsets with fresh data and filtered data with unique-token-matched random subsets; retain domain losses, exposure and prediction errors.
6. Run a CPU recursive-fit diagnostic against fresh sampling, declaring variance conventions. Cross unchanged/annealed schedules and original/synthetic data from the smallest complete decoder checkpoint at matched tokens across paired seeds. Use licensed or decoder-generated text; retain general-domain loss, provenance, overlap/diversity audits and pilot-capped generation/continuation costs.
7. Measure the reserved error against the frozen rule; retain residual and influence plots, floor/objective sensitivity, declared resampling units and failed regimes. Regenerate evidence from all study records, audit confounds and recommend capacity, tokens, mixture or replication with uncertainty, boundaries and a decisive next experiment.

**Deliverables**

- The `scaling/` planner, measured run matrix, fit implementations and committed held-out predictions linked to `registry/`.
- Residual, influence, uncertainty, width-transfer, mixture, repetition and synthetic-continuation evidence with all attempts and costs retained.
- Clean evidence-regeneration transcript and skeptical budget decision with supported range, negative regime and next decisive experiment.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [TensorTonic: Fit a Data Power Law with a Noise Floor](https://www.tensortonic.com/problems/cs336-l09-fit-data-power-law). Pass the prescribed candidate-floor procedure; keep raw nonlinear fits and constructed-truth checks as separate implementations.
- external-tests: [TensorTonic: Diagnose muP Width Invariants](https://www.tensortonic.com/problems/cs336-l11-mup-invariant-diagnostics). Pass supplied-array cases; measured decoder coordinates and held-out rate-transfer comparisons must supply the actual evidence.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Counts and prediction discipline | Your count and fitting oracles pass before training. Measured independent terminal runs conserve declared budgets; repeated cells quantify seed variation, identifiability is audited and reserved predictions precede their runs. | An ill-conditioned surface triggers a simpler identifiable question rather than precise unsupported exponents; held-out misses remain in the evidence. |
| Mechanism and uncertainty evidence | Residual and influence checks retain valid high-loss and unfinished attempts distinctly. Declared resampling units support conditional uncertainty; measured transfer, held-out mixtures, repetition controls and schedule/data continuations isolate their stated contrasts. | The CPU recursive diagnostic separates estimator bias from path behavior, while general-domain loss and synthetic provenance bound decoder-level conclusions without asserting inevitable collapse. |
| Reproducible budget judgment | Clean regeneration rebuilds tables from immutable records. The all-attempt ledger includes pilots, tuning, generation, retries and evaluation; the decision names uncertainty, confounds, a retained failure regime and the next falsifying experiment. | Plausible fits reverse an allocation, so the learner chooses an informative replication instead; an independent baseline rerun confirms the strongest supported conclusion. |

Feeds into: Measured resource contracts, held-out prediction errors and mixture decisions feed adaptation and real-code integration. Frozen evaluator and tokenizer identities, negative regimes and all-attempt accounting become the capstone's allocation and uncertainty evidence.

### Resource route

- **Primary - Assignment:** [CS336 Assignment 3 - Scaling](https://github.com/stanford-cs336/assignment3-scaling) - Read the handout Sections 2 and 3, then fit IsoFLOP profiles and a scaling law to the public `data/isoflops_curves.json` with residuals and one held-out prediction. The hosted training API and leaderboard need enrollment, and the tests need postgres and keys, so the graded half is out of reach; add a small local sweep of your own and keep the failed runs. Pair it with the Lecture 9 and 11 slides (`lecture_09.pdf`, `lecture_11.pdf` in `stanford-cs336/lectures`).
- **Required - Paper:** [Scaling Laws for Neural Language Models](https://arxiv.org/abs/2001.08361) - Read Sections 1 and 2 (the three power laws in Equations 1.1 to 1.3), Figure 1 and Section 6 (optimal allocation). Reproduce one fit and list every assumption that differs from your experiment: fixed batch size, one schedule length and single-epoch data. Read Porian et al. before trusting its allocation rule.
- **Required - Paper:** [Training Compute-Optimal Large Language Models](https://arxiv.org/abs/2203.15556) - Study Figure 1, Section 3.2 (IsoFLOP profiles over nine compute budgets), Section 3.3 (the parametric loss in Equation 2) and Appendix D.2 (the fitted constants in Equation 10). Recreate the conclusion only within the range your run matrix supports; read Besiroglu et al. on the Approach 3 fit.
- **Required - Paper:** [Resolving Discrepancies in Compute-Optimal Scaling of Language Models (Porian et al., 2024)](https://arxiv.org/abs/2406.19146) - Read Figure 1 and Sections 3 to 5: the Kaplan and Chinchilla allocation gap closes once last-layer FLOPs, warmup length and scale-dependent optimizer tuning are fixed. It also gives learning-rate and batch-size fits and shows AdamW beta2 matters at small batches.
- **Support - Paper:** [Chinchilla Scaling: A Replication Attempt (Besiroglu et al., 2024)](https://arxiv.org/abs/2404.10102) - Read all seven pages after Chinchilla: the Approach 3 estimates disagree with Approaches 1 and 2, the reported intervals are implausibly narrow, and refitting reconstructed data restores agreement. It targets Approach 3, not the IsoFLOP evidence.
- **Support - Paper:** [DeepSeek LLM, Section 3 (Scaling Laws)](https://arxiv.org/abs/2401.02954) - Read Sections 3.1 and 3.2: batch-size and learning-rate trends with compute, and the model and data allocation fit. Its data mix is bilingual, so the exponents are specific to it.
- **Support - Paper:** [Data Mixing Laws: Optimizing Data Mixtures by Predicting Language Modeling Performance (Ye et al., 2024)](https://arxiv.org/abs/2403.16952) - Read Section 3 (the exponential law for per-domain loss as a function of mixture proportions, Equations 1 and 6) and Table 1. It interpolates within tested proportions; it does not extrapolate.
- **Support - Paper:** [The Curse of Recursion: Training on Generated Data Makes Models Forget (Shumailov et al.; Nature 2024)](https://arxiv.org/abs/2305.17493) - Read Sections 1 to 4 on model collapse: training on generated data loses the tails of the original distribution. Keep it beside every synthetic-data decision; it does not show that any synthetic data collapses a model.
- **Support - Guide:** [The Smol Training Playbook - Scaling Laws and Data Mixture](https://huggingface.co/spaces/HuggingFaceTB/smol-training-playbook) - Read the scaling-laws section and the SmolLM3 data-mixture ablations for how a small team chose model size, token count and mixture under a fixed budget. Cite section names; the numbers are specific to SmolLM3.
- **Support - Paper:** [2 OLMo 2 Furious, Section 4 (Mid-training Recipe)](https://arxiv.org/abs/2501.00656) - Read Sections 4.1 to 4.5: learning-rate annealing, the Dolmino mid-training mix, math microanneals and checkpoint soups. It is the curriculum and annealing case the scaling papers lack.
- **Support - Lab:** [Modern LLM Notebook - Scaling Laws](https://github.com/walkinglabs/modern-llm-notebook/tree/979eecf09669121167184ef925d8edbc089fc13e) - Use `notebooks-en/part2-training/14-scaling-laws.ipynb` for a compact bridge among Kaplan, Chinchilla, muP, FLOPs and memory. Treat its calculations as exercises to verify, not as evidence for extrapolation; its prices are dated samples.
- **Support - Practice:** [TensorTonic - Scaling Laws I and II](https://www.tensortonic.com/problems/cs336-l09-isoflop-optimal-frontier) - Solve Fit a Data Power Law with a Noise Floor (`cs336-l09-fit-data-power-law`), Extrapolate Data-Mixture Scaling Curves (`cs336-l09-data-mixture-extrapolation`), Estimate Critical Batch Size (`cs336-l09-critical-batch-size`), Recover an IsoFLOP Compute-Optimal Frontier (`cs336-l09-isoflop-optimal-frontier`), Fit Learning-Rate and Batch-Size Scaling (`cs336-l11-hyperparameter-scaling-fit`) and Diagnose muP Width Invariants (`cs336-l11-mup-invariant-diagnostics`). Supplied-data drills are preparation, not a measured scaling result. Public test cases check the listed edge cases, not gradients or the hidden grader, so keep your own tests beside each solution. 
- **Depth - Research:** [Scaling Data-Constrained Language Models](https://arxiv.org/abs/2305.16264) - Read Section 3 (the data-constrained law, in which repeated tokens lose value at a fitted rate), Appendix A (its derivation) and Sections 5 and 6 (up to about four epochs of repetition cost little; returns fall quickly after that), then inspect the reproducibility repository (https://github.com/huggingface/datablations). Use one small repeated-data experiment to challenge the compute-optimal assumption.
- **Depth - Paper:** [DoReMi: Optimizing Data Mixtures Speeds Up Language Model Pretraining (Xie et al., 2023)](https://arxiv.org/abs/2305.10429) - Read Section 2 (Group DRO over domain weights with a small proxy) and Section 4. A larger proxy can do worse, so proxy scale does not transfer automatically.
- **Optional - Paper:** [Beyond Chinchilla-Optimal: Accounting for Inference in Language Model Scaling Laws (Sardana et al., 2024)](https://arxiv.org/abs/2401.00448) - Read Section 2 (training plus inference cost for a target quality and inference demand) and Sections 4 and 6 (results and real-world cost). Its demand model is illustrative.
- **Support - Project:** [Applied Science Research Laboratory - Scaling Study](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/capstones/applied-science-research-laboratory.md) - Borrow the preregistration, matched-budget, uncertainty, residual and negative-result requirements for the scaling experiment.
- **Support - Documentation:** [Maximal Update Parametrization: width-transfer checks](https://github.com/microsoft/mup/blob/19814971934ef91dd546f88e913fc963e096d11c/README.md) - Read Basic Usage, How mup Works Under the Hood, Current Limitations, and Coord Check through Tips for Coord Check at commit 1981497. Use as a design reference, not an installation requirement; skip Wider is Always Better, which is not a finite-run guarantee.

### Exit checkpoint

Fit a scaling or mixture relationship with identifiable variables, uncertainty and residuals; validate one held-out configuration; preserve one failed regime; and state the budget decision it changes plus the range where it must not be used.

<details>
<summary>Deliberately left for later</summary>

- Purchasing frontier-scale training solely to imitate published curves
- Distributed-training implementation and topology tuning
- Treating a fitted exponent as mechanism proof

</details>

## LMR-5. Language-Model Evaluation

**Why:** Training research is only as trustworthy as its instruments. This stage builds an evaluator hierarchy, attacks its failure modes and fixes inference budgets before comparing checkpoints or methods.

### Learn this much

- [ ] Task definition, construct validity and intended decision _(Required)_
- [ ] Likelihood, multiple-choice and generation evaluation contracts _(Required)_
- [ ] Prompt, few-shot set, system instruction and chat-template versioning _(Required)_
- [ ] Answer extraction, normalization, invalid outputs and denominator policy _(Required)_
- [ ] Exact, executable and structured verifiers with false-acceptance tests _(Required)_
- [ ] Model-judge prompts, rubrics, calibration and residual uncertainty _(Required)_
- [ ] Position, length, style, verbosity, identity and self-preference bias _(Required)_
- [ ] Human pairwise evaluation, disagreement, adjudication and annotator effects _(Required)_
- [ ] Bradley-Terry and Elo-style summaries with ordering limits _(Required)_
- [ ] Pass-at-k, self-consistency and sampling-budget accounting _(Required)_
- [ ] Matched tokens, samples, verifier calls, latency and inference compute _(Required)_
- [ ] Train-evaluation overlap, contamination, memorization and leakage _(Required)_
- [ ] Benchmark saturation, selection pressure and hidden-test limits _(Required)_
- [ ] Capability versus elicitation, prompting and search gains _(Required)_
- [ ] Prompt variants, perturbations, domains, languages and failure slices _(Required)_
- [ ] Paired uncertainty, multiple comparisons and practical effect size _(Required)_
- [ ] Item-level inputs, raw outputs, scores, evaluator versions and lineage _(Required)_
- [ ] Evaluator agreement, calibration against trusted subsets and failure taxonomy _(Required)_
- [ ] Primary metrics, guardrails, regression thresholds and rollback _(Required)_
- [ ] Tool-use and long-horizon agentic evaluation _(Optional)_
- [ ] Adaptive and contamination-resistant benchmark research _(Depth)_
- [ ] Restricted dangerous-capability evaluations _(Later)_

### Study units

#### U1. Construct validity and likelihood, multiple-choice and generation evaluation contracts

**About 4 h** · **Target:** Explain + Implement

Topics: Task definition, construct validity and intended decision; Likelihood, multiple-choice and generation evaluation contracts

The LLM Foundations unit on likelihood and perplexity taught the arithmetic. Here you make that arithmetic an instrument whose score supports a specific decision, rather than a general claim about intelligence.

**You can now**

- Turn an intended research decision into a task contract with a target population, observable behavior and explicit exclusions.
- Implement response-only likelihood, multiple-choice likelihood and generation scoring without changing the question being measured.
- Explain why capability, truthfulness, robustness, privacy and harmlessness need separate evidence.

**Study**

1. [CS336 Spring 2026 Lecture 12: evaluation](https://cs336.stanford.edu/lectures/?trace=lecture_12) (CS336 2026 - Evaluation) - Trace functions `what_is_good`, `perplexity`, `exam_benchmarks`, `realism` and `how_to_think_about_evaluation`. Depth: Skip leaderboard browsing. Correct two slips in `perplexity`: conditional perplexity is the reciprocal geometric mean probability, and minimum population perplexity is exponentiated entropy, not entropy.
2. [HELM: scenarios, adaptation and metric dimensions](https://arxiv.org/abs/2211.09110v1) (Holistic Evaluation of Language Models) - Sections 2 to 4: Preliminaries, Core scenarios and General metrics; Section 7, Adaptation. Depth: Read the taxonomy and metric definitions; skim individual dataset descriptions. Do not run another evaluation framework.
3. [Harness task contracts](https://github.com/EleutherAI/lm-evaluation-harness/blob/ddd67220430a2470529f25fd5c05a576ca1057a0/docs/new_task_guide.md) (Language Model Evaluation Harness) - Using Local Datasets; Writing a Prompt Template, including Multiple choice format; inspect `output_type` in the linked Task Configuration guide. Depth: Use local JSON with lm-eval 0.4.13, not a custom dataset loading script. Build one tiny task, not a benchmark sweep.

**Focus**

- Write down the population, item unit, allowed inputs, answer space, scoring rule and intended decision before selecting a benchmark. A multiple-choice knowledge test is not a privacy or safety test.
- For a nonempty response, conditional perplexity is $`\exp[-\sum_t \log p(y_t\mid x,y_{<t})/T]`$, where $`T`$ counts response tokens. Corpus aggregation weights tokens, not sequences. Compare only under the same tokenizer and context policy.
- Summed continuation log likelihood and length-normalized scores define different choice rules. Generating a letter is a third protocol; do not silently substitute it for scoring continuations.
- TensorTonic supplies aligned logits. A causal model pipeline must align next-token predictions separately and exclude prompt and padding targets. Its empty-mask return is a programming convention, not evidence of perfect prediction.

**Reproduce:** Closed-book, implement the two TensorTonic functions, then attach the same three scoring interfaces to a local JSON task in `lmlab`. For the uniform two-token public perplexity case, selected count is 2, NLL is $`\log 2`$ and perplexity is 2. Add an empty-mask status so an undefined evaluation cannot enter an aggregate as perplexity 1. Use fixed logits for CPU checks; model scores are not targets.

**Traps**

- Averaging per-item perplexities. Exponentiate the token-weighted aggregate NLL instead.
- Allowing an empty continuation to compete with nonempty choices. Its summed log likelihood is zero; reject empty choices in the task contract even though the component drill defines them.
- Calling a higher preference score a correctness gain without a correctness measure.

**Practice**

- [TensorTonic: Compute Conditional Perplexity](https://www.tensortonic.com/problems/cs336-l12-conditional-perplexity) - Implement `conditional_perplexity(logits, target_ids, response_mask)`; public cases Uniform selected tokens, One confident selected token and Empty response mask. Use PyTorch 2.14.1 on CPU. These cases exercise selected-token reduction and the stated empty convention, not causal alignment or gradients.
- [TensorTonic: Score Multiple-Choice Continuations](https://www.tensortonic.com/problems/cs336-l12-multiple-choice-likelihood) - Implement `multiple_choice_likelihood(logits, token_ids, continuation_mask)`; public cases One-token choice ranking, Variable continuation lengths and Empty continuations tie. Keep summed likelihood and lowest-index tie breaking. The section mini-project extends these components into likelihood and generation contracts with raw item records.

**Stop when:** Both component drills pass their public cases, your local task exposes all three scoring contracts, and each metric has a written decision it can and cannot support.

<details>
<summary>Self-test</summary>

1. Why is conditional perplexity useful but insufficient for a generation task?
   - It scores reference response tokens given the prompt. It does not test the sampled answer, stopping behavior or semantic correctness of alternative valid answers.
2. With natural-log entropy, what is minimum population perplexity?
   - $`\exp H(P)`$. Cross-entropy equals entropy plus KL divergence when defined; its minimum occurs when the model matches the target distribution on its support. This population result is not a finite-sample guarantee.
3. Does identical text make token perplexity comparable across tokenizers?
   - No. Token counts and probability factorizations differ. Fix the tokenizer or define and justify a common scoring unit and boundary policy.

</details>

#### U2. Prompt, few-shot and chat-template versioning, answer extraction and denominator policy

**About 4 h** · **Target:** Implement

Topics: Prompt, few-shot set, system instruction and chat-template versioning; Answer extraction, normalization, invalid outputs and denominator policy

The LLM Foundations unit on stopping rules and reproducible generation established local controls. Research comparisons need those controls bound to every item, so a parser change cannot pass for a better checkpoint.

**You can now**

- Version system instructions, few-shot identities and order, chat rendering, decoding and answer extraction as one evaluation contract.
- Diagnose a score gain caused only by parsing or selective item removal.
- Replay scoring on unchanged raw outputs while retaining invalid responses in the declared denominator.

**Study**

1. [Lessons from the Trenches: implementation is part of the experiment](https://arxiv.org/abs/2405.14782v2) (Lessons from the Trenches on Reproducible Evaluation of Language Models (Biderman et al., 2024)) - Sections 2.3.1 to 2.3.3, Section 3 best practices and Section 5.2, Difficulties in Comparing Scores Across Evaluation Setups.
2. [Prompt and filter configuration](https://github.com/EleutherAI/lm-evaluation-harness/blob/ddd67220430a2470529f25fd5c05a576ca1057a0/docs/task_guide.md) (Language Model Evaluation Harness) - Parameters: Prompting / in-context formatting options and Scoring details; Filters and Multiple Filter Pipelines. Depth: Use lm-eval 0.4.13. Inspect the self-consistency example as a filter pipeline; do not generate its 64 samples here.
3. [Raschka: final-answer extraction](https://www.manning.com/books/build-a-reasoning-model-from-scratch) (Build a Reasoning Model (From Scratch), Chapter 3 and Appendix F) - Chapter 3, Section 3.4, Extracting the final answer box, pp. 66 to 70; Listings 3.4 and 3.5. Depth: Use fixed strings, not model generation. Treat the last-number fallback as a policy to audit, not a universal answer parser.

**Focus**

- Save rendered prompt text and token IDs, not just template names. Include system instructions, few-shot item IDs and order, tokenizer revision, special tokens and whether an assistant prefix was added.
- Keep parser version separate from generation version. Rescoring saved outputs isolates an evaluator change; regenerating does not.
- Predeclare normalization, multiple-answer handling, truncation, abstention and timeout policies. Keep all scheduled items visible with status and coverage; unresolved infrastructure errors block a complete-run claim.
- For the primary task-success rate, invalid model outputs remain failures. A valid-only score may be secondary, with its smaller denominator and validity rate shown.

**Reproduce:** Closed-book, build a replay table with gold answers `['A', 'B', 'C', 'A']` and raw outputs `['A', 'B', 'unknown', '']`. An exact letter parser gives 2 correct of 4, or 50%. Silently dropping the last two gives 100% on 2 valid outputs without any model change. Write a regression that preserves four scheduled IDs, raw strings, parser version and the invalid-output rate under both reports.

**Traps**

- Accepting the last number in a refusal or an unfinished calculation as the final answer.
- Changing the system prompt or few-shot order while claiming only the checkpoint changed.
- Treating a human-readable prompt in a paper as an exact serialization, including whitespace and special tokens.

**Practice**

- The section mini-project covers this: the versioned local JSON task, prompt snapshots, strict-versus-lenient parser replay and denominator regression in lmlab.

**Stop when:** You reproduce the denominator-only gain, rescore without regenerating, and trace every changed score to a parser version or a preserved raw response.

<details>
<summary>Self-test</summary>

1. A lenient parser improves scores on unchanged generations. What improved?
   - The scoring policy changed. It may repair false rejections or add false acceptances; check both against independently labeled examples before calling it a better instrument.
2. Why keep the empty output in the four-item replay?
   - It is a model outcome under the fixed item contract. Removing it changes the estimand from task success to success conditional on validity.
3. Must different chat models use identical special-token strings?
   - Not necessarily. Native templates may be necessary. Declare the model-plus-template comparison, preserve both renderings, and do not describe it as a weights-only intervention.

</details>

#### U3. Exact, executable and structured verifiers with false-acceptance tests

**About 3 h** · **Target:** Implement

Topics: Exact, executable and structured verifiers with false-acceptance tests

A deterministic evaluator can be consistently wrong. Before it becomes a reward or a release gate, attack its acceptance boundary rather than testing only ordinary correct answers.

**You can now**

- Implement separate extraction, schema validation and semantic verification stages with explicit failure statuses.
- Construct accepted wrong answers and rejected correct answers, then retain both as verifier regressions.
- Explain why passing executable tests is evidence about those tests, not a proof of correctness.

**Study**

1. [Raschka: normalization, equivalence and grading](https://www.manning.com/books/build-a-reasoning-model-from-scratch) (Build a Reasoning Model (From Scratch), Chapter 3 and Appendix F) - Chapter 3, Sections 3.5 to 3.7, pp. 71 to 80; Listings 3.6 to 3.11. Depth: Read the general symbolic parser, but do not run it on untrusted output. Use a restricted rational-number grammar for your implementation. Percent-sign deletion is not semantic normalization: preserve or reject percentages rather than treating them as plain numbers.
2. [Inspect: explicit scorer interfaces](https://inspect.aisi.org.uk/custom-scorers.html) (Inspect) - Overview, Example, Score and Example: Includes (page read 2026-10-16). Depth: Use the `Score` interface in Inspect 0.3.281. Audit rather than adopt the example's last-number extraction. Do not require newer unscored-result APIs from the live page.
3. [Functional correctness and finite tests](https://arxiv.org/abs/2107.03374v2) (Evaluating Large Language Models Trained on Code, Section 2 (Chen et al., 2021)) - Sections 2.1, Functional Correctness, and 2.2, HumanEval: Hand-Written Evaluation Set. Depth: Study the executable-test contract. Do not execute generated programs on your host; use an isolated execution environment with no network or secrets for any optional code task.

**Focus**

- Separate formatting acceptance from correctness. A valid JSON object may contain a wrong answer; an equivalent value may still violate a deliberately strict output contract.
- False acceptance is acceptance conditional on an independently known wrong answer. False rejection conditions on known correct answers. Build both sets before adjusting the verifier.
- Choose semantic domains deliberately: ordered tuples are not sets, percentages are not plain numbers, and algebraic simplification may discard domain restrictions.
- Executable checks need adversarial inputs, resource limits and tests hidden from the candidate. A constant-return program can pass an underspecified public example while failing the intended task.

**Reproduce:** Closed-book, write a structured verifier for JSON objects with exactly one `answer` field whose value is a string containing an integer or integer fraction. Reject duplicate keys, extra keys, zero denominators, empty strings and trailing prose before comparing exact rational values with `fractions.Fraction`. Against reference `'1/2'`, accept `'2/4'`, reject `'2/3'`, and reject `'50%'` as unsupported rather than stripping its sign. Add a constant-return counterexample to a small handwritten executable test contract, then an input that exposes it.

**Traps**

- Using `eval` or a general expression parser as a security boundary. Exception handling and a string-length cap do not make model-controlled code safe.
- Matching an answer substring inside a negation, quotation or list of guesses.
- Measuring only agreement on mostly correct answers. A verifier can appear accurate while accepting most deliberately wrong attacks.

**Practice**

- The section mini-project covers this: the exact, structured and executable verifier adapters, an independently labeled false-acceptance set, and regression tests for each repaired loophole in lmlab.

**Stop when:** Your verifier rejects seeded wrong and malformed answers, accepts supported equivalent answers, and a saved counterexample shows why the original executable test contract was insufficient.

<details>
<summary>Self-test</summary>

1. Should an ordered pair and its reversal receive the same score?
   - Not unless the task defines an unordered object. Sorting every answer to increase matches silently changes the task.
2. Does symbolic equality of simplified expressions prove equality on every input?
   - No. For example, canceling a factor can remove a point where the original expression was undefined. State the domain and preserve exclusions.
3. A program passes every supplied example. What remains unestablished?
   - Correctness on unsupplied inputs, resource behavior and safety. Add boundary, adversarial and independently generated checks; even then finite tests are not a proof.

</details>

#### U4. Model-judge rubrics and calibration, and position, length, style and self-preference bias

**About 5 h** · **Target:** Implement + Measure

Topics: Model-judge prompts, rubrics, calibration and residual uncertainty; Position, length, style, verbosity, identity and self-preference bias

Model judges make open-ended evaluation cheap enough to iterate, but their shortcuts can become the optimization target. This unit extends the LLM Foundations unit on model judges and human review from warning about bias to measuring it in your own instrument.

**You can now**

- Write an anchored judge rubric and compare its decisions with a hand-labeled subset not used to revise the rubric.
- Implement controlled position, length, style, identity-cue and self-preference probes on fixed answer pairs.
- Separate length-adjusted preference from correctness and report residual disagreement and invalid judge outputs.

**Study**

1. [MT-Bench: judge biases and human agreement](https://arxiv.org/abs/2306.05685v4) (Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena (Zheng et al., 2023)) - Sections 3.1 to 3.5, especially 3.3 Limitations and 3.4 Addressing limitations; Section 4.2, High agreement between GPT-4 and humans. Depth: Study the rubric and counterexamples. The paper's hosted judges and agreement figures are not the learner's implementation or expected results.
2. [Length control is a fitted counterfactual](https://arxiv.org/abs/2404.04475v1) (Length-Controlled AlpacaEval: A Simple Way to Debias Automatic Evaluators (Dubois et al., 2024)) - Section 3, Length-Controlled AlpacaEval: Length control via regression, The regression model and Obtaining length corrected (LC) win-rate; Other biases discussion. Depth: Do not run the paid annotation pipeline. Contrast its instruction and transformed-length terms with TensorTonic's simpler linear-length drill; they are not the same estimator.
3. [Inspect: explicit rubric and grader selection](https://inspect.aisi.org.uk/model-graded.html) (Inspect) - Overview, Template Variables and Reproducible Grading (page read 2026-10-16). Depth: Use Inspect 0.3.281 with an explicitly selected local grader. For its Hugging Face backend set `do_sample=False` in model arguments, not `temperature=0`. Skip hosted-provider examples.

**Focus**

- Label 20 short answer pairs by hand against explicit correctness and usefulness anchors. Split by question into rubric-development and held-out audit halves before inspecting judge errors. Record uncertainty in your own labels.
- Swap order while preserving candidate identity. Add controlled verbosity, formatting and claimed-author changes with content checked by hand. Identity cues test attribution bias; actual judge-authored versus other-authored answers test self-preference but also confound answer quality.
- Use Qwen/Qwen3-0.6B at revision c1899de289a04d12100db370d81485cdf75e47ca for a local grader, with model and tokenizer from that revision, PyTorch 2.14.1 and transformers 5.19. Disable thinking and cap judge output at 128 tokens. Run short pairs serially on your GPU or CPU; a weak judge is an audit result, not a reason to buy an API.
- Calibration here means checking and revising the instrument against trusted labels, then auditing held-out agreement. It is not proof that rubric scores are calibrated probabilities. Separate raw preference, length-adjusted preference, correctness and invalid-verdict coverage.

**Reproduce:** Derive one full-batch gradient step for TensorTonic's Balanced identities with length bias case. Start utilities and length coefficient at zero, use mean binary cross-entropy and learning rate 0.1. Utilities stay zero, the length coefficient becomes 0.1, and equal-length probabilities remain 0.5. Then run the specified 20 steps for the public case and audit whether padding a known wrong answer changes your local judge's preference; no direction of change is guaranteed.

**Traps**

- Calling order-swap consistency accuracy. A judge can be consistently wrong in both orders.
- Dividing a score by answer length and calling it Length-Controlled AlpacaEval. The paper fits a regression and evaluates it at equal length.
- Tuning rubric and acceptance thresholds on the same subset used to report agreement, or dropping unparsable grades from coverage counts.

**Practice**

- [TensorTonic: Remove Response-Length Bias from Judge Scores](https://www.tensortonic.com/problems/cs336-l12-judge-length-debiasing) - Implement `judge_length_debiasing`; public cases Balanced identities with length bias, Neutral reciprocal ties and Unseen third model. Use PyTorch 2.14.1 on CPU. The public inputs exercise the supplied finite-step fitting rule and neutral unseen-model convention, not causal identification or grader correctness. The section mini-project covers rubric calibration and the controlled local judge probes.

**Stop when:** The drill passes its public cases, and your held-out judge audit reports raw decisions, swapped-order consistency, coverage and residual errors for each controlled probe.

<details>
<summary>Self-test</summary>

1. Can longer answers legitimately be better?
   - Yes. Extra content can supply needed evidence. A controlled length probe preserves relevant content; an observational length coefficient alone does not prove causal bias.
2. Why does changing only the claimed author not isolate actual self-preference?
   - It isolates sensitivity to the identity cue. Genuine self-preference involves answer provenance; comparing naturally different outputs also needs quality controls.
3. A small local judge disagrees with trusted labels. Should it decide release?
   - Not without a justified error budget. Retain the failure, use deterministic or manual scoring for the decision, and limit any model-judge claim to the audited task and slices.

</details>

#### U5. Human pairwise evaluation, disagreement and Bradley-Terry and Elo summaries

**About 4 h** · **Target:** Derive

Topics: Human pairwise evaluation, disagreement, adjudication and annotator effects; Bradley-Terry and Elo-style summaries with ordering limits

Human preference gives a reference for open-ended answers, not an infallible total order. You need both the vote protocol and the statistical model to know what a rating summarizes.

**You can now**

- Derive Bradley-Terry likelihoods, their additive non-identifiability and their conversion to an Elo-style scale.
- Design blinded pairwise review with ties, disagreement records and adjudication that preserves original labels.
- Recognize disconnected comparison graphs, separation and uncertain rankings before interpreting fitted scores.

**Study**

1. [Chatbot Arena: votes, coefficients and uncertainty](https://arxiv.org/abs/2403.04132v1) (Chatbot Arena: An Open Platform for Evaluating LLMs by Human Preference (Chiang et al., 2024)) - Section 3, Human Preference Data Collection; Section 4, From Pairwise Comparisons to Rankings; Section 5 through Estimating the BT scores; Appendix A, Confidence Interval Simulation Study. Depth: Skip anomalous-user detection and adaptive sampling implementation. Use fixed local answer pairs, not live Arena voting.
2. [Human labels and agreement protocols](https://arxiv.org/abs/2306.05685v4) (Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena (Zheng et al., 2023)) - Sections 4.1 and 4.2; Table 5's distinction between agreement with and without ties. Depth: Read the labeling and agreement conventions, not the benchmark scores as targets.

**Focus**

- For binary votes, $`P(A\succ B)=\sigma(s_A-s_B)`$. Maximize summed vote log likelihood after fixing one score or centering all scores. State any regularizer and tie convention separately.
- An undirected connected graph permits comparison across all models, but does not guarantee a finite unregularized optimum. A model that only wins can drive a score difference without bound.
- Blind identities and randomize display order. Retain tie, both-bad and unsure labels separately even if a fitting convention maps some to half a win. Review correctness separately from stylistic preference.
- On the hand-labeled pairs, do a delayed blinded second pass and record changes before adjudicating. With only one reviewer, this measures intra-rater stability, not inter-rater agreement or population consensus.

**Reproduce:** Closed-book, fit the two-model vote table in which A wins three times and B wins once, with no ties or regularizer. The fitted A-win probability is 0.75 and the natural-log score difference is $`\log 3`$. On the base-10 Elo-style scale the gap is $`400\log_{10}3`$, approximately 190.8485 points. Derive this from the likelihood, then compare with a numerical optimum. Explain why a finite-step TensorTonic fit need not reach that optimum.

**Traps**

- Treating full-batch maximum-likelihood fitting as the same algorithm as online Elo updates. They can share a probability link while producing different estimates.
- Ranking disconnected components by their arbitrary fitted offsets.
- Treating overlapping marginal intervals as a total ordering or as a paired test of the rating difference.

**Practice**

- [TensorTonic: Fit Elo Ratings from Pairwise Votes](https://www.tensortonic.com/problems/cs336-l12-pairwise-elo-fit) - Implement `pairwise_elo_fit`; public cases Single decisive comparison, Connected tie cycle and Two disconnected components. Use PyTorch 2.14.1 on CPU. Implement exactly the finite-step simultaneous update rule, not a converged optimizer. Public cases exercise those vote graphs; add your own separation diagnostic. The section mini-project covers blinded review, delayed relabeling and disagreement records.

**Stop when:** You derive the fixed vote-table optimum, pass the finite-step drill, and explain which model comparisons your graph and reviewer evidence leave unidentified or uncertain.

<details>
<summary>Self-test</summary>

1. Why does adding the same constant to every BT coefficient change nothing?
   - All modeled probabilities depend only on differences. Fixing an offset chooses a representation, not additional preference evidence.
2. A connected graph has one model that wins every comparison. Does centering guarantee convergence?
   - No. Centering removes an additive degree of freedom, not separation. The unregularized likelihood can approach its supremum while score differences diverge.
3. Why not discard ties before reporting human agreement?
   - That conditions on decisive items and can inflate agreement. Report the full label policy, tie rate and denominators; a non-tie analysis is a separately labeled subset.

</details>

#### U6. Pass-at-k, self-consistency and compute-normalized comparison

**About 4 h** · **Target:** Derive + Implement

Topics: Pass-at-k, self-consistency and sampling-budget accounting; Matched tokens, samples, verifier calls, latency and inference compute

More attempts can improve success without changing the weights. An evaluation must say whether it measures a single answer, an oracle over candidates or an implementable selection policy.

**You can now**

- Derive and implement the unbiased per-problem pass-at-k estimator and distinguish it from majority-vote accuracy.
- Construct an inference-budget ledger for greedy, repeated sampling, self-consistency and verifier-based selection.
- Compare checkpoints on a declared budget axis while disclosing unmatched prefill, verification and latency costs.

**Study**

1. [Chen et al.: unbiased pass-at-k](https://arxiv.org/abs/2107.03374v2) (Evaluating Large Language Models Trained on Code, Section 2 (Chen et al., 2021)) - Section 2.1, Equation 1 and Figure 3; Appendix A, Estimating pass-at-k.
2. [Self-consistency on the same saved samples](https://github.com/EleutherAI/lm-evaluation-harness/blob/ddd67220430a2470529f25fd5c05a576ca1057a0/docs/task_guide.md) (Language Model Evaluation Harness) - Filters: Multiple Filter Pipelines, the `score-first`, `maj@64` and `maj@8` examples. Depth: Use lm-eval 0.4.13. Reduce the example to five saved candidates per question; do not generate 64 answers.
3. [Efficiency is a separate measurement axis](https://arxiv.org/abs/2211.09110v1) (Holistic Evaluation of Language Models) - Section 4.9, Efficiency. Depth: Use the cost distinctions for your ledger. Historical provider timings are not local performance targets.

**Focus**

- With $`n`$ independent samples from one fixed policy and $`c`$ passing candidates, estimate success among $`k`$ draws by $`1-\binom{n-c}{k}/\binom{n}{k}`$, for $`1\leq k\leq n`$. Average per problem, not after pooling candidates across problems.
- Pass-at-k asks whether any candidate passes the verifier. It assumes an oracle selection event, not that your deployed selector can find that candidate. Self-consistency selects by normalized-answer frequency and may select a common wrong answer.
- Fix sampling, stopping, parser and tie policies. Preserve invalid candidates as failed attempts. Repeated greedy decoding does not supply independent stochastic draws with new diversity.
- Record input and output tokens, actual sample counts, tool and verifier calls, elapsed time and a stated compute model. Equal output-token caps are not equal FLOPs: prompt prefill, context lengths, model sizes and evaluator work also matter.

**Reproduce:** Closed-book, enumerate every two-candidate subset of five saved binary outcomes `[1, 1, 0, 0, 0]`. Seven of ten subsets contain a success, so the pass-at-2 estimate is 0.7; the plug-in expression $`1-(1-c/n)^k`$ instead gives 0.64. Implement the stable estimator, including zero-success and all-success cases and rejection when $`k>n`$. Add majority voting on five answer strings and a ledger that distinguishes one 128-token cap from four 32-token caps with repeated prompt prefill.

**Traps**

- Using gold labels to choose the delivered answer, then reporting the result as a real selector's accuracy.
- Pooling all successful candidates before computing pass-at-k. This changes equal problem weighting and the target quantity.
- Crediting training for a gain that used more samples, longer responses, extra verifier calls or a changed stopping rule.

**Practice**

- The section mini-project covers this: per-problem pass-at-k and self-consistency from saved samples, invalid-candidate handling, and matched-budget checkpoint comparisons with a complete inference ledger in lmlab.

**Stop when:** Your estimator matches subset enumeration, your delivered-answer policy never consults gold labels, and each comparison names both its matched budget axis and its remaining cost differences.

<details>
<summary>Self-test</summary>

1. What does the unbiased estimator return at one sample?
   - For $`k=1`$, it is $`c/n`$. At $`k=n`$, it is one if any candidate succeeds and zero otherwise.
2. Two of five candidates are correct. Must majority voting succeed?
   - No. Three wrong candidates can agree on one wrong answer. Pass-at-k and voting measure different events.
3. Does matching total generated tokens make two different models compute-matched?
   - No. Per-token costs differ by model and context, and prefill and selection have costs. State the matched axis, measure the others and avoid a stronger compute-equivalence claim.

</details>

#### U7. Contamination and memorization, benchmark saturation and capability versus elicitation

**About 4 h** · **Target:** Explain + Measure

Topics: Train-evaluation overlap, contamination, memorization and leakage; Benchmark saturation, selection pressure and hidden-test limits; Capability versus elicitation, prompting and search gains

The LLM Foundations unit on contamination and memorization taught the risk. Here the evidence is a real search over a named corpus plus controls, not a harness flag or a score drop interpreted as proof of leakage.

**You can now**

- Audit accessible training text for exact and near-overlap with evaluation items, preserving matched evidence and search limitations.
- Distinguish exposure, memorization, benchmark selection pressure and saturated measurement.
- Separate checkpoint changes from prompting and search gains with frozen evaluation and inference budgets.

**Study**

1. [CS336 Spring 2026 Lecture 12: saturation and validity](https://cs336.stanford.edu/lectures/?trace=lecture_12) (CS336 2026 - Evaluation) - Trace functions `exam_benchmarks`, `validity` and `how_to_think_about_evaluation`. Depth: Use the harder-benchmark and overlap examples as motivations, not evidence that a high score identifies memorization or that private tests stay private forever.
2. [Oren et al.: what an ordering test detects](https://arxiv.org/abs/2310.17623v2) (Proving Test Set Contamination in Black Box Language Models (Oren et al., 2023)) - Section 2, Problem Setting; Sections 3.1 and 3.2, permutation and sharded likelihood tests; Section 6, Limitations. Depth: Explain the null and assumptions. Do not reproduce contaminated pretraining or require a black-box audit for a model without log-probability access.
3. [Tulu 3: overlap evidence and development versus unseen evaluation](https://arxiv.org/html/2411.15124v5#S3.SS2) (Tulu 3, Sections 3.2 and 7 (decontamination and the evaluation framework)) - Section 3.2, Prompt Decontamination; Sections 7.1 to 7.4, evaluation framework and development versus unseen suites. Depth: Read the matching rule and suite separation. Skim task inventories; do not reproduce the large-model benchmark matrix.

**Focus**

- Record corpus revision, normalization, tokenization, window size, matching threshold and searched fields. Search prompts and available reference answers; report them separately. Preserve train-document and eval-item IDs plus matched spans.
- Tulu 3 flags a test prompt when more than half of its tokens have 8-gram matches in one training instance, not when a single 8-gram is shared. A smaller local any-8-word-match audit is a different, explicitly labeled screening rule and needs manual review for boilerplate false positives.
- No matches means no matches under this rule in this corpus. It does not cover inaccessible pretraining data, paraphrases, translations, later training stages or evaluator exposure. `should_decontaminate` alone searches none of these.
- Saturation reduces room to distinguish systems; it does not prove general capability. An unchanged checkpoint with better prompts or more search shows elicitation gains, not learning. Repeated hidden-test feedback can still guide selection.

**Reproduce:** Closed-book, implement a lowercased whitespace-word 8-gram index over your versioned training corpus. Plant one exact evaluation sentence, one punctuation-only variant and one unrelated control in a separate audit fixture, then search both the fixture and the real corpus. Show which cases exact raw matching and your declared 8-gram rule detect. Keep source spans, full-versus-flagged-versus-unflagged results and coverage limits; any score difference is descriptive because flagged items can differ in difficulty.

**Traps**

- Calling a full-versus-clean score difference the causal benefit of contamination. Item difficulty and selection also change.
- Treating a nonsignificant ordering test as a clean-training certificate. It may have low power or fail to detect partial or reordered exposure.
- Claiming a capability ceiling from failure under one prompt, or claiming a training gain after changing elicitation.

**Practice**

- The section mini-project covers this: the actual corpus overlap search with planted positive and negative controls, matched-span evidence, separate development and held-out items, and a capability-versus-elicitation comparison in lmlab.

**Stop when:** You retrieve the planted overlap, report the real search boundary and false-positive review, and qualify both non-detection and elicitation gains without asserting unseen training data is clean.

<details>
<summary>Self-test</summary>

1. When is a canonical-versus-shuffled ordering test justified?
   - When examples are exchangeable under the stated null and sequence log probabilities are available. Sorting, duplicate structure or serialization effects can invalidate the intended inference.
2. Does a matching training passage prove the model memorized its answer?
   - No. It establishes accessible-corpus exposure under the matching rule. Demonstrating memorization or attributing a score gain needs additional evidence and controls.
3. Why can a hidden test still become a development set?
   - Repeated scores, pass/fail decisions or error feedback can influence prompt and checkpoint selection even when item text is never disclosed. Record access and selection history.

</details>

#### U8. Prompt perturbations and failure slices, paired uncertainty and multiple comparisons

**About 5 h** · **Target:** Measure

Topics: Prompt variants, perturbations, domains, languages and failure slices; Paired uncertainty, multiple comparisons and practical effect size

The Classical ML unit on paired bootstrap, permutation tests and multiplicity supplied the statistical tools. Language-model evaluations add repeated generations, translated questions and prompt searches that can quietly change the sampling unit.

**You can now**

- Measure a predeclared prompt-format and failure-slice sweep with shared item identities and fixed generation settings.
- Compute paired standard errors at the question level and account for shared-source or translated-item clusters.
- Report practical effect thresholds, comparison families and selection history without turning exploratory slices into confirmatory findings.

**Study**

1. [Sclar et al.: meaning-preserving format perturbations](https://arxiv.org/abs/2310.11324v1) (Quantifying Language Models' Sensitivity to Spurious Features in Prompt Design (Sclar et al., 2023)) - Sections 3.1, Grammar of Plausible Prompt Formats; 3.2, Measuring Sensitivity; and 4.2, prompt-format performance spread. Depth: Run three declared formats on your existing small item set. Do not implement the large bandit search or treat the paper's spread as a local target.
2. [Miller: question units, pairing and power](https://arxiv.org/abs/2411.00640v1) (Adding Error Bars to Evals: A Statistical Approach to Language Model Evaluations (Miller, 2024)) - Sections 2.1 and 2.2, independent and clustered questions; Section 4, especially Equation 7 for paired differences and Equation 8 for clusters; Section 5, Power analysis. Depth: Use the equations, not the arithmetic in Section 4.2's uniform-score example: with both variances 1/12 and covariance 1/24, the difference variance is 1/12, not 1/9. The relative reduction from 1/6 is one half.
3. [Pointwise versus multiplicity-corrected intervals](https://arxiv.org/abs/2403.04132v1) (Chatbot Arena: An Open Platform for Evaluating LLMs by Human Preference (Chiang et al., 2024)) - Appendix A, Confidence Interval Simulation Study, especially Figure 13's multiplicity-corrected intervals. Depth: Connect this to the Math Foundations unit on bootstrap, permutation tests and multiple comparisons. Do not repeat the full ranking simulation.

**Focus**

- Declare format variants, slices, primary contrast and minimum useful effect before the final run. Check that paraphrases, option permutations and translated items preserve the task and gold mapping.
- For independent question-level differences $`d_i`$, use $`\operatorname{SE}(\bar d)=\sqrt{\sum_i(d_i-\bar d)^2/[n(n-1)]}`$. Average repeated generations within question first; translated variants and shared passages may need cluster-level uncertainty.
- Pairing preserves covariance; it narrows uncertainty when covariance is positive, not universally. Keep pairs together in the bootstrap and keep source clusters together when resampling clusters.
- Show slice support, invalid counts, paired effect and uncertainty. Apply the earlier Holm procedure to the predeclared confirmatory family; label discovered slices exploratory and require fresh confirmation. More sampled answers do not replace more independent questions.

**Reproduce:** Closed-book, compute paired uncertainty for fixed synthetic correctness vectors A `[1, 1, 1, 0, 0]` and B `[0, 1, 1, 0, 0]`. The mean A-minus-B difference is 0.2 and its sample-standard-deviation-over-square-root-count SE is 0.2. Treating the two vectors as independent gives approximately 0.346410. Verify both in NumPy `float64` with `ddof=1`. This five-item calculation checks arithmetic, not normal-interval coverage. Then run the predeclared three-format sweep and retain the complete item-by-format table.

**Traps**

- Counting every generation, translation and format variant as an independent question.
- Selecting the best prompt or worst slice on final items and reporting an unadjusted interval as confirmatory evidence.
- Reading a wide interval that includes zero as proof of equivalence. Compare its bounds with the predeclared practical margin.

**Practice**

- The section mini-project covers this: a predeclared format and slice sweep, question-paired and source-cluster uncertainty, and a comparison-family record with practical margins in lmlab.

**Stop when:** You reproduce the fixed-vector SEs, preserve pairing and cluster membership, and report every format and slice with its support, selection status and practical effect threshold.

<details>
<summary>Self-test</summary>

1. Can pairing increase the standard error?
   - Yes. The difference variance subtracts twice the covariance. Negative covariance increases it relative to an independent calculation; positive covariance reduces it.
2. Do item-level error bars include checkpoint-training seed variation?
   - No. They describe the stated question or cluster sampling process and possibly generation randomness. Training-run variation needs independently trained runs and a separate analysis.
3. What does a slice with only three questions establish?
   - It can supply concrete failure examples but usually weak population-rate evidence. Report the count and uncertainty, and confirm a general claim with more independent items.

</details>

#### U9. Item-level output lineage and evaluator agreement against a trusted subset

**About 4 h** · **Target:** Implement + Measure

Topics: Item-level inputs, raw outputs, scores, evaluator versions and lineage; Evaluator agreement, calibration against trusted subsets and failure taxonomy

An aggregate score cannot explain an instrument failure. A complete output ledger lets another reader replay the score and locate the exact item that changed the conclusion.

**You can now**

- Reconstruct aggregate metrics from immutable item-level inputs, raw outputs, evaluator versions and statuses without rerunning generation.
- Measure evaluator agreement, false acceptance and false rejection against an independently labeled held-out subset.
- Diagnose disagreements by extraction, reference, rubric, judge and model failure while preserving original evidence.

**Study**

1. [Share outputs, not just headline scores](https://arxiv.org/abs/2405.14782v2) (Lessons from the Trenches on Reproducible Evaluation of Language Models (Biderman et al., 2024)) - Section 3, Always share your exact prompts and code, Always provide model outputs, Perform qualitative analyses and Measure and Report Uncertainty.
2. [Harness sample logging](https://github.com/EleutherAI/lm-evaluation-harness/blob/ddd67220430a2470529f25fd5c05a576ca1057a0/docs/interface.md) (Language Model Evaluation Harness) - Data and Output: `--output_path`, `--log_samples` and `--samples`; Advanced Options: `--seed`. Depth: Use lm-eval 0.4.13 and its `lm-eval run` CLI. Save samples from the local task already built; do not add a benchmark sweep.
3. [Inspect native logs and stable sample identities](https://inspect.aisi.org.uk/eval-logs.html) (Inspect) - Log Format; Log File API, especially EvalLog and Functions; Eval Retries and Sample Preservation (page read 2026-10-16). Depth: Use Inspect 0.3.281 and `read_eval_log` for `.eval` records. Skip cloud storage and log-editing APIs; retain immutable originals and write rescoring as a separate artifact.
4. [Agreement needs its denominator](https://arxiv.org/abs/2306.05685v4) (Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena (Zheng et al., 2023)) - Section 4.2 and Tables 5 and 6, human-judge agreement with explicit tie conventions.

**Focus**

- Join by stable item ID and attempt ID, not row position. Keep dataset and checkpoint revisions, rendered prompt, raw output, extracted answer, score, status, generation controls, parser and judge versions, plus token and verifier-call counts.
- Framework logs are evidence containers, not complete experiment manifests. Add any missing model/tokenizer revision, corpus boundary, human-label provenance and run configuration yourself.
- Reuse the question-disjoint trusted audit half from the judge unit. Report the full confusion table and invalid-grade coverage, with slice counts and question-level uncertainty; do not relabel it to agree with the judge.
- Keep original labels, uncertainty notes, adjudication reasons and scorer outputs. Classify disagreements before assigning blame: reference error, unsupported equivalence, parser failure, rubric ambiguity, judge shortcut or actual model error.

**Reproduce:** Closed-book, join six fixed synthetic trusted labels `[1, 1, 0, 0, 0, 1]` to judge labels `[1, 0, 1, 0, 0, 1]` by item ID, where 1 means correct. Agreement is four of six, false acceptance is one of three trusted-wrong items, and false rejection is one of three trusted-correct items. Shuffle record order and verify the same results. Delete one ID and duplicate another to make your join fail rather than silently scoring a different set. Then rebuild one real aggregate from saved harness or Inspect outputs.

**Traps**

- Replacing raw outputs with extracted answers, which makes parser bugs impossible to replay.
- Reporting high overall agreement when the trusted subset contains almost no wrong answers.
- Overwriting scores or labels during adjudication and losing which evaluator originally accepted the wrong answer.

**Practice**

- [ARENA 3.3: Extract data from log files](https://learn.arena.education/chapter3_llm_evals/03_running_evals/3-writing-tasks-and-evaluating/) - Intro to Inspect's EvalLogs; Exercise (optional) - Extract data from log files. Do this named extraction exercise on your local task logs, not the paid-model sweep. It has no supplied solution or public correctness tests. Add join, duplicate-ID and denominator tests yourself. The section mini-project covers the trusted-subset comparison and failure taxonomy.

**Stop when:** A fresh scoring process rebuilds the aggregate and confusion table from preserved records, rejects missing or duplicate identities, and traces each disputed grade to raw output and label provenance.

<details>
<summary>Self-test</summary>

1. Why is a hash insufficient to replay a result?
   - It can verify the identity of bytes you still have, but cannot recover missing prompts, outputs or code. Keep the artifacts and their hashes together.
2. What is the denominator of verifier false acceptance?
   - The independently known wrong items under the declared task contract, not every item and not only accepted items. Accepted-wrong among accepted is a different quantity.
3. Does model-judge agreement validate a whole evaluator stack?
   - Only on the audited population, labels and versions, within uncertainty. Unreviewed slices, shared reference mistakes and later grader changes remain outside that evidence.

</details>

#### U10. Release and regression gates, and tool-use and long-horizon agentic evaluation

**About 3 h** · **Target:** Explain

Topics: Primary metrics, guardrails, regression thresholds and rollback; Tool-use and long-horizon agentic evaluation

Evaluation should end in a bounded decision, not a larger leaderboard. A release record says which evidence was sufficient, what blocked the change and which future observation would trigger rollback.

**You can now**

- Explain a release gate with a primary effect threshold, separate guardrails, completeness checks, manual review and rollback ownership.
- Defend a checkpoint decision using paired evidence and at least three diagnosed evaluator failures with mitigation evidence.
- Describe how optional agent evaluation changes the object from model outputs to scaffold, tools, environment state and trajectories.

**Study**

1. [ARENA 3.1: connect measured properties to decisions](https://learn.arena.education/chapter3_llm_evals/01_intro_evals/3-threat-modeling-specification-design/) (ARENA 3.1 Intro to Evals and 3.3 Running Evals with Inspect) - What are evals trying to achieve?; Threat-Modeling; Specification; Exercise - Design a specification. Depth: Use the framework for one bounded research decision. Write assumptions by hand; skip API calls and any restricted dangerous-capability testing.
2. [Post-training laboratory: external outcomes and failure gates](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-3/llm-post-training-laboratory.md) (LLM Research Track Checkpoint) - Architecture constraints; Milestone D - Failure handling; Milestone F - Final evaluation; Correctness requirements; Measurement requirements. Depth: Use its evidence and rollback requirements, not the full project's training scope. Reuse your small local evaluator suite.
3. [Closed-note evidence audit](https://github.com/saisandeshk/Roadmap-Final/blob/main/checkpoints/llm-research-training-posttraining.md) (LLM Research Track Checkpoint) - Implement and test: external evaluation; Debug and measure: matched baselines and retained negative results; Pass condition. Depth: Audit only the evaluation evidence here. This unit does not certify the whole track checkpoint.
4. [Optional: agent evaluation changes the system under test](https://cs336.stanford.edu/lectures/?trace=lecture_12) (CS336 2026 - Evaluation) - Spring 2026 Lecture 12 trace: `agentic_benchmarks` and `validity`, Dataset quality. Depth: Optional reading only. Do not run SWE-Bench, Terminal-Bench or a long-horizon agent suite for this exit gate.

**Focus**

- Freeze the comparison's item set, prompts, decoding, output and inference budgets, evaluator versions and selection history before final scoring. Name one primary metric and a minimum useful effect; define per-slice non-regression margins and how uncertainty affects each gate.
- A primary gain cannot compensate for a breached privacy, safety or correctness guardrail. Missing items, unresolved evaluator failures or unsupported contamination claims trigger hold and review, not automatic success.
- Keep a release record with baseline and candidate identities, evidence links, decision, reviewer, unresolved risks, monitoring signals, rollback trigger, known-good checkpoint and responsible owner. A research-scale pass is not safety certification.
- Optional agent scope: version tool schemas, scaffold, environment snapshot, state reset, retry policy and horizon. Score final environment success as well as intermediate violations, tool-call failures and total budget; a fluent final answer need not mean the task succeeded.

**Reproduce:** Closed-book, reconstruct a release decision from three fixed audit cases: primary passes but a guardrail fails; all metric gates pass but item lineage is incomplete; all gates pass with complete evidence and no unresolved blockers. The first two must hold; only the third is eligible for approval under this rule. Apply the same decision table to your matched checkpoint comparison, linking three evaluator counterexamples to before-and-after mitigation evidence and retaining any negative result.

**Traps**

- Choosing thresholds after seeing the candidate's final scores, then presenting the rule as predeclared.
- Releasing because a primary interval includes an improvement. The rule needs a supported effect relative to its practical margin and separate guardrails.
- Comparing agents with different tool permissions, retries or horizons as though only the language-model weights changed.

**Practice**

- The section mini-project covers this: the predeclared release and regression decision, matched checkpoint evidence, three evaluator-failure mitigations, manual review and rollback record in lmlab. Agentic execution is optional and not required for this gate.

**Stop when:** You defend a release or hold decision from complete item-level evidence, three evaluator failures and their mitigations, paired uncertainty, contamination limits and an owned rollback condition; optional agent execution is not needed.

<details>
<summary>Self-test</summary>

1. A candidate gains on the primary task but breaches a mandatory guardrail. Release?
   - No under a conjunctive gate. Hold, diagnose and repair, or revise the policy transparently before a new independent evaluation. Do not average the breach away.
2. What does a rollback condition add beyond a failed pre-release test?
   - It defines what post-release observation requires reverting, who owns that action and which known-good version to restore. It covers failures that appear after the initial evaluation.
3. Why can an agent's final text be a misleading success metric?
   - The agent may claim success without the required state change, exceed its budget or violate tool constraints along the way. Inspect the environment state and full trajectory under a resettable contract.

</details>

### Mini-project: Replayable evaluation with attacked instruments and release gates

**About 14 to 18 hours.** Extend `lmlab` with a versioned evaluator in `eval/` for the study's bounded behavior question. Separate checkpoint changes from prompting, sampling and scoring effects, then defend a release or hold decision using independent labels and replayable evidence on your machine without paid APIs.

1. Build a file-backed JSON task in `eval/` with likelihood, multiple-choice and generation contracts using pinned lm-eval. Check frozen logits against TensorTonic conditional-perplexity and continuation-scoring cases; retain token alignment, prompt snapshots, strict-versus-lenient parser replays and invalid-denominator regressions before model evaluation.
2. Implement exact, restricted structured and executable verifier adapters. Check independently labeled correct, wrong and malformed fixtures, including a constant-return counterexample; retain false-acceptance and false-rejection tables and repaired-loophole regressions. Keep any generated-code execution isolated from network access and secrets.
3. Calibrate an anchored rubric with question-disjoint development and trusted audit subsets. Audit the section's pinned judge on your machine with content-matched order, length, style, identity and authorship probes against blinded labels; preserve invalid verdicts, delayed self-relabeling and pre-adjudication disagreements, without claiming inter-rater agreement.
4. Search the versioned corpus for evaluation overlap using independently planted positive and negative controls. Preserve matched spans, source and item identities, manual false-positive review and search limits in `data/`; separate development from held-out items and freeze the capability-versus-elicitation comparison.
5. Compute per-problem pass-at-k and self-consistency from immutable samples, checking the estimator against subset enumeration. Compare frozen checkpoints and prompting controls at matched inference budgets across seeds; keep invalid candidates and reconcile prefill, decode, selection, verifier calls, FLOPs and elapsed time.
6. Run the predeclared format and slice sweep with practical margins and a comparison-family record. Check question-paired and source-cluster uncertainty against synthetic oracles; join raw outputs to `registry/` identities, reject missing or duplicate IDs, and retain trusted-subset confusion tables and a disagreement taxonomy.
7. Apply predeclared primary, guardrail and completeness gates to the matched checkpoint evidence. In `reports/`, retain manual review, parser, verifier and judge failures with before-and-after mitigations, negative findings, rollback ownership and a known-good checkpoint; reproduce the decision from saved records in a clean scoring process.

**Deliverables**

- Versioned `eval/` tasks, prompts, parsers, verifiers, judge audit and independent regression tests.
- Immutable item records, trusted labels, corpus-overlap evidence, inference ledger and paired robustness report linked through `registry/`.
- Reproducible release or hold record with evaluator-failure mitigations, manual review, scope limits and rollback conditions.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [TensorTonic: Compute Conditional Perplexity](https://www.tensortonic.com/problems/cs336-l12-conditional-perplexity). Pass public reductions; add causal alignment, empty-status and denominator tests.
- external-tests: [TensorTonic: Score Multiple-Choice Continuations](https://www.tensortonic.com/problems/cs336-l12-multiple-choice-likelihood). Pass continuation cases; distinguish summed scoring, normalized scoring and generated answers.
- external-tests: [lm-eval file-backed task contract at pinned commit](https://github.com/EleutherAI/lm-evaluation-harness/blob/ddd67220430a2470529f25fd5c05a576ca1057a0/docs/new_task_guide.md). Use the documented task interface; your own fixed-logit and replay tests establish correctness.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Instrument correctness | Frozen-logit, parser and independently labeled verifier tests validate alignment, semantics and denominators; held-out trusted labels anchor judge confusion tables and bias probes, with blinded delayed review and original disagreements retained. | Planted defects fail before repair; authorship effects remain distinct from identity cues and answer quality, and unreliable judge slices defer to deterministic or manual decisions. |
| Comparison discipline | Subset enumeration validates pass-at-k; matched-budget comparisons retain invalid attempts, seed variation, overlap limits, format slices, paired and clustered uncertainty, and declared comparison families. | Prompting, selection and evaluator alternatives bound the checkpoint claim, with unmatched cost dimensions and inconclusive slices made explicit. |
| Replayable decision | Identity-join regressions reject incomplete records; a clean scoring process rebuilds aggregates and the gate decision, including parser, verifier and judge mitigation evidence and rollback ownership. | An independent reader reconstructs the decision without generation, and a simulated guardrail breach or missing artifact forces hold despite a primary gain. |

Feeds into: Tasks, trusted labels, verifier attacks and release gates anchor Adaptation and Distillation, Preference Modeling and Direct Optimization, RL Post-training and Reasoning, safety evaluation and the capstone's independent behavior evidence.

### Resource route

- **Primary - Course:** [CS336 2026 - Evaluation](https://cs336.stanford.edu/lectures/?trace=lecture_12) - Step through the Lecture 12 trace (perplexity, knowledge, instruction, agent, reasoning and safety benchmarks, validity). Rebuild conditional perplexity, multiple-choice scoring and one generation evaluator, then fix prompt, decoding, item and inference-compute versions before any comparison.
- **Required - Implementation:** [Language Model Evaluation Harness](https://github.com/EleutherAI/lm-evaluation-harness) - Follow `docs/new_task_guide.md` to write one local JSON task (`dataset_path: json`) with explicit `output_type`, prompt, choices, filters and metrics, and run it with `--log_samples` to keep per-sample outputs. Pin the harness version (0.4.13 was checked). `should_decontaminate` only marks a query; it does not search any training corpus.
- **Required - Paper:** [Lessons from the Trenches on Reproducible Evaluation of Language Models (Biderman et al., 2024)](https://arxiv.org/abs/2405.14782) - Read Section 2.3 (why implementations of the same benchmark disagree), Section 3 (share exact prompts, code and model outputs) and Section 4 (uncertainty). Section 4.3 notes that its bootstrapped standard error covers resampling the questions, not training seeds.
- **Required - Paper:** [Adding Error Bars to Evals: A Statistical Approach to Language Model Evaluations (Miller, 2024)](https://arxiv.org/abs/2411.00640) - Read Section 2 (independent and clustered questions), Section 4 (unpaired and paired comparisons) and Section 5 (power). Repeated answers to one question are not new questions.
- **Required - Paper:** [Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena (Zheng et al., 2023)](https://arxiv.org/abs/2306.05685) - Read Section 3 (position, verbosity and self-enhancement bias and their mitigations) and Section 4.2 (agreement with humans). Swapping order reduces position bias but does not prove the judge correct.
- **Support - Paper:** [Evaluating Large Language Models Trained on Code, Section 2 (Chen et al., 2021)](https://arxiv.org/abs/2107.03374) - Read Section 2, Figure 3 and Appendix A for the unbiased pass@k estimator `1 - comb(n-c, k)/comb(n, k)` and its stable implementation. Never report k larger than n, and run generated code only in a sandbox.
- **Support - Paper:** [Chatbot Arena: An Open Platform for Evaluating LLMs by Human Preference (Chiang et al., 2024)](https://arxiv.org/abs/2403.04132) - Read Sections 4 and 5 and Appendix A: Bradley-Terry fitting, bootstrap and robust intervals. Online Elo is not this estimator, and overlapping intervals do not give a total order.
- **Support - Paper:** [Length-Controlled AlpacaEval: A Simple Way to Debias Automatic Evaluators (Dubois et al., 2024)](https://arxiv.org/abs/2404.04475) - Read Section 3: a regression that asks what the preference would be at equal length. Dividing a score by length is not this method, and length control leaves style biases.
- **Support - Paper:** [Quantifying Language Models' Sensitivity to Spurious Features in Prompt Design (Sclar et al., 2023)](https://arxiv.org/abs/2310.11324) - Read Section 3 (a grammar of plausible formats) and Section 4.2 (spread across formats), then run a predeclared format sweep on your task. Choosing the best format on the test set leaks.
- **Support - Paper:** [Proving Test Set Contamination in Black Box Language Models (Oren et al., 2023)](https://arxiv.org/abs/2310.17623) - Read Sections 2 and 3 (compare canonical-order likelihood with shuffled orders) and Section 6 (limits). It needs log probabilities and exchangeable examples, and it does not replace direct overlap checks.
- **Support - Course:** [ARENA 3.1 Intro to Evals and 3.3 Running Evals with Inspect](https://learn.arena.education/chapter3_llm_evals/01_intro_evals/) - Do 3.1 by hand (threat model, specification and 20 questions for one property) and 3.3 against a local model (Inspect dataset, solvers, scorers, choice shuffling). 3.1 and 3.2 assume a paid OpenAI API for generation; skip those calls rather than buying credit.
- **Support - Book:** [Build a Reasoning Model (From Scratch), Chapter 3 and Appendix F](https://www.manning.com/books/build-a-reasoning-model-from-scratch) - Use Chapter 3 (pp. 57-93: boxed-answer extraction, normalization, equivalence checks and grading on a MATH subset) as the first verifier you can break on purpose, and Appendix F for evaluation approaches.
- **Support - Paper:** [Tulu 3, Sections 3.2 and 7 (decontamination and the evaluation framework)](https://arxiv.org/abs/2411.15124) - Read Section 3.2 (prompt decontamination) and Sections 7.1 to 7.4 (OLMES, the development and unseen suites, how design decisions were evaluated) as a case of separating development from held-out evaluation.
- **Required - Methodology:** [Holistic Evaluation of Language Models](https://arxiv.org/abs/2211.09110) - Read Sections 2 to 4 (scenarios and the seven metrics) and Section 7 (adaptation via prompting) to define capability, robustness, fairness, toxicity and efficiency as separate evidence. HELM entered maintenance mode on 2026-06-01, so treat the framework as methodology and do not run a second full evaluation stack.
- **Support - Lab:** [Modern LLM Notebook - Evaluation](https://github.com/walkinglabs/modern-llm-notebook/tree/979eecf09669121167184ef925d8edbc089fc13e) - Use `notebooks-en/part3-inference/25-evaluation.ipynb` for the framework map and judge examples. Its judge cells need an OpenAI-compatible endpoint, so point them at a local model or read them only, then add position and response-length counterexamples.
- **Support - Practice:** [TensorTonic - Evaluation Set](https://www.tensortonic.com/problems/cs336-l12-conditional-perplexity) - Solve Compute Conditional Perplexity (`cs336-l12-conditional-perplexity`), Score Multiple-Choice Continuations (`cs336-l12-multiple-choice-likelihood`), Fit Elo Ratings from Pairwise Votes (`cs336-l12-pairwise-elo-fit`) and Remove Response-Length Bias from Judge Scores (`cs336-l12-judge-length-debiasing`). Add all four to evaluator unit tests. Public test cases check the listed edge cases, not gradients or the hidden grader, so keep your own tests beside each solution. 
- **Support - Implementation:** [Inspect](https://inspect.aisi.org.uk/scorers.html) - Implement one small Inspect task on a local Hugging Face model with a deterministic scorer and one model-graded scorer. For greedy decoding pass `do_sample=False` in the model arguments; `temperature=0` fails. Keep the `.eval` logs and compare the model grader against a trusted subset before using it for a claim.
- **Support - Assessment:** [LLM Research Track Checkpoint](https://github.com/saisandeshk/Roadmap-Final/blob/main/checkpoints/llm-research-training-posttraining.md) - Use the evaluation and compare sections as a closed-note audit after the harness exposes at least three instrument failures.

### Exit checkpoint

Compare two checkpoints under identical items, prompts, output budgets and evaluator versions; demonstrate three evaluator failures with mitigations; quantify agreement against a trusted subset; and state what the evidence cannot establish.

<details>
<summary>Deliberately left for later</summary>

- A giant benchmark sweep without a release decision
- Safety certification from general capability benchmarks
- Agentic, multimodal and restricted dangerous-capability evaluation suites

</details>

## LMR-6. Adaptation and Distillation

**Why:** Adaptation is a data, objective and deployment choice. This stage compares supervised, low-rank and distillation routes while proving masks, merges, forgetting and end-to-end cost.

### Learn this much

- [ ] Continued pretraining, mid-training and supervised instruction tuning as distinct interventions _(Required)_
- [ ] Instruction, input, response and conversation data contracts _(Required)_
- [ ] Chat templates, roles, special tokens and train-serve consistency _(Required)_
- [ ] Assistant-only loss masks and token-level denominator checks _(Required)_
- [ ] Packed SFT boundaries, attention masks and cross-example leakage _(Required)_
- [ ] Full fine-tuning state, memory and optimizer cost _(Required)_
- [ ] LoRA factorization, rank, scale, initialization and target modules _(Required)_
- [ ] Adapter serialization, merge, unmerge and forward equivalence _(Required)_
- [ ] QLoRA, quantized base weights and optimizer-state vocabulary _(Required)_
- [ ] Trainable-parameter savings versus activation and total training memory _(Required)_
- [ ] Domain balancing, replay and prerequisite-skill retention _(Required)_
- [ ] Forgetting, interference and capability regression slices _(Required)_
- [ ] Teacher-student logit distillation, temperature and KL direction _(Required)_
- [ ] Sequence and synthetic-data distillation with teacher provenance _(Required)_
- [ ] Feature and representation distillation boundaries _(Required)_
- [ ] On-policy distillation and exposure-bias motivation _(Required)_
- [ ] Prompted, smaller-model and no-training baselines _(Required)_
- [ ] Quality, train memory, latency, serving memory and update-cost comparison _(Required)_
- [ ] Model merging and task-vector vocabulary _(Optional)_
- [ ] Prompt and prefix-tuning mechanisms _(Optional)_
- [ ] Original teacher-signal or on-policy distillation research _(Depth)_
- [ ] Multi-tenant adapter serving and production lifecycle _(Later)_

### Study units

#### U1. Continued pretraining, mid-training and SFT as distinct interventions, against no-training baselines

**About 4 h** · **Target:** Explain

Topics: Continued pretraining, mid-training and supervised instruction tuning as distinct interventions; Prompted, smaller-model and no-training baselines

A training run is not the baseline. First establish what the frozen model can do, then choose the intervention whose data and objective address the observed failure.

**You can now**

- Choose continued pretraining, mid-training or SFT from the data and behavior gap, rather than from a method name.
- Design a comparison against unchanged, prompted and smaller instruction-tuned models with a fixed evaluator and inference budget.
- Separate gains from training from gains due to templates, demonstrations or answer parsing.

**Study**

1. [RLHF Book, Chapters 3 and 4: recipes and instruction tuning](https://rlhfbook.com/c/03-training-overview#canonical-training-recipes) (RLHF Book - Training Overview, Instruction Tuning and Synthetic Data) - Chapter 3, Canonical Training Recipes: InstructGPT and Tulu 3; Chapter 4, Instruction Fine-Tuning, opening discussion before Chat Templates and the Structure of Instructions. Depth: Open Chapter 4 at https://rlhfbook.com/c/04-instruction-tuning. Stop before its chat-template section; defer preference and RL implementations.
2. [Don't Stop Pretraining: domain versus task adaptation](https://arxiv.org/abs/2004.10964v3) (Don't Stop Pretraining: Adapt Language Models to Domains and Tasks (Gururangan et al., 2020)) - Sections 3, Domain-Adaptive Pretraining, and 4, Task-Adaptive Pretraining, including the supervised baseline in Section 3.2. Depth: Read the data and comparison design, not the full experiment tables. These are masked-LM RoBERTa classification experiments, not causal-decoder SFT results.

**Focus**

- Continued pretraining uses unlabeled domain or task text with a language-model objective. SFT uses demonstrations of desired responses. Both change weights; prompting does not.
- Mid-training names a stage or recipe, often a targeted mixture and annealing phase. It is not a unique loss, nor a synonym for instruction tuning.
- Freeze item IDs, splits, parsing, output-token cap, decoding and template versions before comparing. Different checkpoints may need their own native templates; record that difference rather than forcing a malformed common template.
- Match training input tokens and report supervised target tokens separately. Equal optimizer steps do not match exposure when lengths or response masks differ.

**Reproduce:** Closed-book, write a comparison table for domain-text adaptation versus response-format adaptation. Include unchanged and prompted versions of the same base, an existing smaller instruct model, continued pretraining and SFT. For each row name the data, predicted tokens, changed state, inference budget and held-out target and retention measures. Explain which comparisons isolate training and which compare complete products.

**Traps**

- Changing the prompt after training and attributing the full gain to weight updates. Re-evaluate the frozen checkpoint with the new prompt too.
- Using a held-out set to tune both the adaptation and its prompt. Keep development and final evaluation separate, with duplicate-group separation.
- Treating lower domain language-model loss as proof of better instruction following. Measure the behavior the intervention was meant to change.

**Practice**

- The section mini-project covers this: the frozen, prompted and smaller-model baseline ledger and the prespecified adaptation comparison in `lmlab`.

**Stop when:** Your comparison table names a measurable behavior gap, a no-training alternative, controlled budgets and a held-out decision rule that could reject training.

<details>
<summary>Self-test</summary>

1. Does training on unlabeled task inputs become SFT because the inputs came from a supervised dataset?
   - No. Without the labels or demonstrated responses it is task-adaptive continued pretraining. The objective and target construction, not the dataset's origin, determine the intervention.
2. A new chat prompt improves the adapted model. What control is missing?
   - The unchanged checkpoint under that same valid prompt and decoding budget. Otherwise prompt elicitation and learning are confounded.
3. Why retain a smaller instruct model even though it cannot isolate the adaptation mechanism?
   - It tests whether training is worth doing at all under the deployment constraints. It is a product alternative, not a same-initialization causal control.

</details>

#### U2. Instruction data contracts, chat templates, roles and special tokens

**About 4 h** · **Target:** Implement

Topics: Instruction, input, response and conversation data contracts; Chat templates, roles, special tokens and train-serve consistency

The LLM Foundations unit on tokenizer design choices established token identity. Here that identity must survive a real conversation pipeline, including roles, hidden defaults and the generation header.

**You can now**

- Validate instruction-response and multi-turn records before tokenization, with source and split ownership preserved.
- Serialize training and generation inputs with the checkpoint's pinned chat template and special-token policy.
- Diagnose a train-serve template mismatch by comparing token IDs rather than rendered appearance.

**Study**

1. [RLHF Book, Chapter 4: Instruction Fine-Tuning](https://rlhfbook.com/c/04-instruction-tuning#chat-templates-and-the-structure-of-instructions) (RLHF Book - Training Overview, Instruction Tuning and Synthetic Data) - Chat Templates and the Structure of Instructions; Implementation Details, especially the two multi-turn masking choices. Depth: Read template examples as illustrations, not portable validators. Validate the actual checkpoint template instead of copying the illustrative Jinja.
2. [Transformers 5.19.0: Chat templates](https://huggingface.co/docs/transformers/v5.19.0/en/chat_templating) (Hugging Face LLM Course Chapter 11 and smol-course Unit 1) - Using `apply_chat_template`, `add_generation_prompt`, `continue_final_message` and Model training. Depth: Use only text conversations. Skip tool and multimodal extensions.

**Focus**

- A data contract specifies supported roles, message ordering, empty-content policy, truncation, source, rights and split IDs. Role validity is template-dependent; reject unsupported records before training.
- Pin PyTorch 2.14.1 and Transformers 5.19.0 for the token fixtures. Use `Qwen/Qwen3-0.6B` tokenizer revision `c1899de289a04d12100db370d81485cdf75e47ca`, with `enable_thinking=False`; tokenizer checks need no model weights or GPU.
- Completed training conversations use `add_generation_prompt=False`. For generation from a final user message, append the checkpoint's assistant header; a prefilled assistant message instead needs continuation semantics.
- Direct template tokenization and rendering followed by tokenization with `add_special_tokens=False` should produce the same IDs for the tested record. Save template text and token fixtures with the model artifact.

**Reproduce:** Using the pinned Qwen tokenizer, serialize five messages: system `Be brief.`, user `Hi.`, assistant `Hello.`, user `Again.`, assistant `Hello again.`. Compare the `input_ids` from direct template tokenization with rendering then tokenizing using `add_special_tokens=False`. Require exact ID equality. Remove the final assistant message and inspect generation with and without `add_generation_prompt=True`; explain every added control token, including the non-thinking prefix.

**Traps**

- Searching decoded text for the word assistant to assign roles. Message content can contain that word or delimiter-like text; ownership must come from structured serialization.
- Adding BOS or EOS again after the template already emitted them. Inspect IDs, not just readable text.
- Assuming every template supports a system message, strict alternation or assistant masks. Test each capability instead of inferring it from the model family.

**Practice**

- The section mini-project covers this: the `lmlab` conversation schema, tokenizer/template manifest and train-serve token fixtures, including malformed roles and truncation.

**Stop when:** Your serializer has exact token fixtures for single-turn, multi-turn, empty-content and truncated records, and a template change fails the train-serve regression test.

<details>
<summary>Self-test</summary>

1. Why is a byte-for-byte rendered string check weaker than a token-ID check?
   - Different tokenizer settings can add special tokens or map control strings differently. The model consumes IDs, so rendered equality alone does not prove equal inputs.
2. Should a completed training answer get an extra generation header?
   - No. It would ask for another assistant turn after the demonstration. The generation header belongs at the inference boundary where a new answer should begin.
3. Can instruction and input fields simply be concatenated without a separator?
   - Not safely. Their boundary can become ambiguous. Define a deterministic conversion into message content, including the empty-input case, and bind that conversion to the dataset version.

</details>

#### U3. Assistant-only loss masks and packed SFT boundaries

**About 6 h** · **Target:** Implement

Topics: Assistant-only loss masks and token-level denominator checks; Packed SFT boundaries, attention masks and cross-example leakage

The LLM Foundations unit on packing and loss masks established the two-mask distinction. Now prove it on a real instruction pipeline, where role headers, assistant endings and library label shifting can silently change the objective.

**You can now**

- Implement assistant-only targets with an explicit shift convention and valid-target denominator.
- Check real chat-template spans against an independently marked token table, including multiple assistant turns and truncation.
- Prove packed examples are attention-isolated and label-isolated under the declared packing policy.

**Study**

1. [CS336 Spring 2026 Assignment 5 Supplement, Version 26.0.0](https://github.com/stanford-cs336/assignment5-alignment/blob/c2734a26308710949fe13226960a1e8cece94b7e/cs336_spring2026_assignment5_supplement_safety_rlhf.pdf) (CS336 Assignment 5 Supplement - SFT) - Section 4.2.1, Data Loader, Problem `data_loading`, pp. 9 to 10; `get_packed_sft_dataset` and `run_iterate_batches`. Depth: Implement its concatenated-stream contract separately from your isolated assistant-only path. The assignment's token fixtures do not prove assistant masks or attention isolation. Do not publish assignment solutions.
2. [TRL 1.15.0: SFT masking and packing](https://huggingface.co/docs/trl/v1.15.0/en/sft_trainer) (Hugging Face LLM Course Chapter 11 and smol-course Unit 1) - Train on assistant messages only; Train on completion only; `SFTConfig` entries for `packing`, `packing_strategy`, `padding_free`, `completion_only_loss` and `assistant_only_loss`.
3. [RLHF Book code: final-turn-only labels](https://github.com/natolambert/rlhf-book/blob/1042143366d73ff654727e4d18a1d3a21209c3a3/code/instruction_tuning/utils.py) (RLHF Book Code - Instruction Tuning and Distillation) - `_encode_batch`, `compute_loss` and `_collate`. Depth: Trace one multi-turn record. This is final-assistant-turn-only supervision, not all-assistant-turn supervision; do not reuse prefix lengths without checking prefix ID equality.

**Focus**

- For logits indexed by source position, supervise the next token only if it belongs to an eligible assistant span in the same example. Decide whether assistant endings are targets; include the stop token in this route. Mask padding and cross-example transitions.
- Compute summed negative log likelihood divided by the number of valid shifted targets, not padded length. Reject or explicitly skip zero-target batches. Accumulated microbatches need one combined valid-token denominator.
- With conversational language-modeling records, TRL 1.15.0 defaults to full-sequence loss. Prompt-completion records default to completion-only loss. `assistant_only_loss=True` is separate; the template must expose generation spans. TRL can substitute a bundled Qwen3 training template, so inspect the effective template and token IDs too.
- EOS does not isolate attention. For isolated packing allow only causal, same-example visibility and reset positions as in separate forwards. On CPU use a small decoder with an explicit dense mask, or train unpacked; TRL's default `bfd` packing enables padding-free execution with a FlashAttention backend requirement.

**Reproduce:** Closed-book, recover TensorTonic's first public case: `input_ids=[[10,11,20,21,2]]`, `role_ids=[[-1,0,-1,1,-1]]`, all positions attended and `assistant_role=1` give source-aligned labels `[[-100,-100,21,-100,-100]]`. Then pack two conversations from the preceding unit with the real tokenizer. Independently mark target owners and the block-causal attention matrix. On a tiny PyTorch 2.14.1 decoder in evaluation mode, compare packed logits with separate forwards using the same position IDs and a declared tolerance; changing the first example must not change the second example's logits.

**Traps**

- Passing already shifted TensorTonic labels into a causal-LM loss that shifts labels internally. Choose source-aligned or token-aligned labels, then shift exactly once.
- Treating a public packing test as a leakage oracle. Matching token and label fixtures says nothing about which examples attend to one another.
- Masking every token equal to the padding ID when padding and EOS share an ID. Use position validity so real assistant stop tokens remain supervised.

**Practice**

- [TensorTonic: Build an Assistant-Only SFT Loss Mask](https://www.tensortonic.com/problems/cs336-l15-assistant-only-sft-mask) - Implement `assistant_only_sft_mask(input_ids, role_ids, attention_mask, assistant_role)`. The three public cases cover one, no and two assistant targets. They consume role IDs, not text, and do not check gradients or packing. The section mini-project supplies real-template, truncation, denominator and packed-attention oracles.
- [CS336 Assignment 5 Supplement: `data_loading`](https://github.com/stanford-cs336/assignment5-alignment/blob/c2734a26308710949fe13226960a1e8cece94b7e/tests/test_data.py) - `test_packed_sft_dataset` and `test_iterate_batches`. CPU tests compare packed input and label IDs, exercise shuffling, and check batch count, shapes and integer dtypes. Keep the stream baseline distinct from the isolated SFT implementation.

**Stop when:** The public cases pass, your real-tokenizer label oracle catches a seeded one-token shift, and the packed-versus-separate and cross-example perturbation tests pass within your declared tolerance.

<details>
<summary>Self-test</summary>

1. Can a masked user token still influence an assistant prediction?
   - Yes. Loss masking removes its prediction from the objective, not its use as context. Attention permissions govern influence.
2. Why can averaging two microbatch mean losses misweight SFT?
   - Different valid-target counts give each token a different weight. Sum the token losses and divide by the total valid-target count across the accumulation window.
3. What must match between packed and separate forwards besides the labels?
   - Token IDs, causal and example visibility, position IDs and model state. Disable dropout and compare with a stated numeric tolerance. Labels alone cannot make logits equivalent.
4. Why inspect the effective TRL template after enabling assistant-only loss?
   - The trainer can replace a template lacking generation markers. That may change serialized tokens as well as mask ownership, so rerun the train-serve and stop-token fixtures.

</details>

#### U4. Full fine-tuning state, and trainable versus activation and total training memory

**About 3 h** · **Target:** Derive + Measure

Topics: Full fine-tuning state, memory and optimizer cost; Trainable-parameter savings versus activation and total training memory

The Deep Learning unit on GPU memory taught the counters. Here the question is whether freezing parameters changes the memory term that actually limits adaptation, while keeping a credible full-update control.

**You can now**

- Derive persistent state bytes for full and partially frozen fine-tuning from actual parameter, gradient and optimizer dtypes.
- Reconcile persistent-state savings with activation, workspace and measured peak memory.
- Run a bounded full-SFT control with correct target weighting and resumable training state.

**Study**

1. [CS336 Spring 2026 Assignment 5 Supplement: SFT loop](https://github.com/stanford-cs336/assignment5-alignment/blob/c2734a26308710949fe13226960a1e8cece94b7e/cs336_spring2026_assignment5_supplement_safety_rlhf.pdf) (CS336 Assignment 5 Supplement - SFT) - Section 4.2.2, Training Script, and Problem `sft_script`, pp. 10 to 11. Depth: Use your tested masks and a roughly 10M-parameter `lmlab` decoder, batch one and context 128 on CPU or your GPU. Run at most 100 updates on a fixed training subset. Skip the Llama 8B hardware recipe and leaderboard-scale run; do not publish solutions.
2. [LoRA: where the state savings come from](https://arxiv.org/abs/2106.09685v2) (LoRA: Low-Rank Adaptation of Large Language Models) - Section 4.2, Applying LoRA to Transformer: the Practical Benefits and Limitations paragraph. Depth: Read the frozen-state and deployment arguments only. The reported memory and throughput gains belong to the paper's GPT-3 setup, not your training loop.

**Focus**

- Count unique parameter storage, not duplicated names for tied weights. Full fine-tuning needs weights, gradients and optimizer state; checkpoints also bind schedule, data order and RNG state, as in the LLM Foundations unit on resumable checkpoints.
- For plain float32 AdamW without AMSGrad or master copies, weights and gradients cost 4 bytes each per scalar and the two moments cost 8. A frozen scalar retains its weight storage. Count scalar step counters separately after the first optimizer update.
- Frozen weights can still participate in input-gradient computation when earlier trainable modules need gradients. Freezing them does not justify putting the whole forward under `torch.no_grad()`.
- Measure forward, backward and optimizer peaks separately, then vary context length at fixed batch. Use the preceding unit's valid-token denominator when accumulation windows or response lengths differ. On CPU keep a tensor-storage ledger rather than pretending CUDA counters measure host RAM.

**Reproduce:** Closed-book, derive float32 AdamW state for 12 million total parameters with no master copy: full updates need 192 MB; training only 250,000 of those parameters needs 51 MB. These totals include weights, gradients and two moments, not activations or scalar counters. On CPU with PyTorch 2.14.1 and `foreach=False`, allocate the corresponding trainable and frozen tensors, perform one update and sum their tensor bytes to check both totals. Then explain why neither total is a peak-memory prediction.

**Traps**

- Measuring optimizer state before the first update. AdamW allocates its moments lazily, so the initial ledger understates steady training state.
- Importing a 16-byte or mixed-precision rule without naming tensor dtypes and master-copy behavior. Inspect the optimizer state your loop actually creates.
- Averaging microbatch means without their valid-target counts. The course's simple accumulation sketch is not a token-weighting oracle for unequal masked lengths or a partial last window.

**Practice**

- The section mini-project covers this: a bounded full-SFT control, post-update state census, context-length memory sweep and explanation of the peak-versus-ledger residual.

**Stop when:** Your post-update census matches both analytical totals with exclusions stated, and your small full-SFT control retains resumable state and held-out outputs without exceeding your machine's budget.

<details>
<summary>Self-test</summary>

1. Where do the 51 MB in Reproduce come from?
   - 48 MB of weights, 1 MB of gradients and 2 MB of moment tensors. The frozen parameters save gradients and moments, not their own weight storage. MB here means decimal megabytes.
2. Why might adapter training still save activations in a frozen layer?
   - The backward pass may need that layer's input derivative to update an earlier adapter. No weight gradient does not mean no backward computation.
3. Is reserved CUDA memory a count of live model tensors?
   - No. It includes allocator-held segments, including unused space. Compare live tensor storage, allocated peak and reserved peak with outside-allocator memory kept separate.

</details>

#### U5. LoRA factorization, rank, scale and target modules, and merge and unmerge equivalence

**About 5 h** · **Target:** Derive + Implement

Topics: LoRA factorization, rank, scale, initialization and target modules; Adapter serialization, merge, unmerge and forward equivalence

The Math Foundations unit on SVD, pseudoinverse and low-rank approximation supplied the rank bound. LoRA constrains an update during optimization, rather than truncating a finished weight matrix; its export path must preserve the trained function.

**You can now**

- Derive LoRA shapes, trainable counts, scale and initialization gradients for a chosen set of linear layers.
- Implement an adapter with independently checked forward and gradients, serialization and merge/unmerge behavior.
- Design a rank or target-module ablation without assuming attention-only adaptation is sufficient.

**Study**

1. [LoRA: Low-Rank Adaptation of Large Language Models](https://arxiv.org/abs/2106.09685v2) (LoRA: Low-Rank Adaptation of Large Language Models) - Figure 1 and Sections 4.1 and 4.2, including Equation 3, initialization, scaling and merge discussion.
2. [LoRA Without Regret: current target and tuning choices](https://thinkingmachines.ai/blog/lora/) (LoRA Without Regret) - What matters for LoRA; Methods and results, LoRA rank and Batch size effects; Layers Where LoRA Is Applied; Setting LoRA hyperparameters, Optimal learning rate and rank. Depth: Read the SFT comparisons, not the RL experiments or later parameterization invariance derivation. The supervised curves measure log loss, not sampled task accuracy.

**Focus**

- Use the paper's column-vector convention: $`W_0\in\mathbb{R}^{d_{\text{out}}\times d_{\text{in}}}`$, $`A\in\mathbb{R}^{r\times d_{\text{in}}}`$, $`B\in\mathbb{R}^{d_{\text{out}}\times r}`$, and $`\Delta W=(\alpha/r)BA`$. The trainable count is $`r(d_{\text{in}}+d_{\text{out}})`$ per adapted matrix, excluding any separately trained bias.
- Random $`A`$ and zero $`B`$ start with no update. Initially the data-loss gradient of $`A`$ is zero; the gradient of $`B`$ can be nonzero. Initializing both factors to zero blocks both data-loss gradients.
- Merge into $`W_0+\Delta W`$ and remove or disable the side path. Compare against the unmerged evaluation-mode forward with dropout disabled, the same bias and a declared dtype-dependent tolerance; floating-point reassociation need not be bitwise identical.
- Record the actual matched module names, shapes and trainable tensors. Compare attention-only and attention-plus-MLP targets under a declared parameter or compute budget, tuning learning rates with equal search effort rather than copying the full-update rate.

**Reproduce:** For a bias-free $`4096\times4096`$ matrix at rank 16, derive 16,777,216 dense parameters versus 131,072 adapter parameters, a fraction of $`1/128`$. On CPU in PyTorch 2.14.1 float64, use $`W_0=I_2`$, $`A=[0.1,0.2]`$, $`B=[0.3,-0.1]^\top`$ and scale 1. Obtain merged weight $`\left[\begin{smallmatrix}1.03&0.06\\-0.01&0.98\end{smallmatrix}\right]`$. For input rows `[1.0,2.0]` and `[-1.0,0.5]`, compare separate and merged forwards, then subtract the update and recover the base within absolute and relative tolerance 1e-12. Check both factor gradients with `torch.autograd.gradcheck`.

**Traps**

- Confusing equal parameter counts with equal expressivity. A rank-2 update to a 4 by 4 matrix has 16 factor entries but cannot represent an arbitrary rank-4 update.
- Merging twice, retaining the active side path after merging, or unmerging with factors that changed since the merge. Keep the untouched base and adapter identity for recovery.
- Loading an adapter onto a shape-compatible but different base checkpoint. Serialize base revision, target-module list, factor convention, rank and scale, then check logits after reload.

**Practice**

- [Modern LLM Notebook 16: Exercises 1 and 2, parameter count and weight merging](https://github.com/walkinglabs/modern-llm-notebook/blob/979eecf09669121167184ef925d8edbc089fc13e/notebooks-en/part2-training/16-lora.ipynb) - Exercises: Exercise 1, LoRA parameter count; Exercise 2, LoRA weight merging. Use the shape-correct outer product from Exercise 2's hint: the paper convention is $`BA`$, despite the exercise's opening $`AB`$. Skip Section 5's equal-count expressivity claim: rank 2 cannot represent arbitrary 4 by 4 updates. The section mini-project adds state round-trip, frozen-base and merge/unmerge regression tests on your decoder.

**Stop when:** Your counts, finite-difference gradients and initial-gradient test pass, and a nonzero adapter round-trips through serialization and merge/unmerge without changing logits beyond a stated tolerance.

<details>
<summary>Self-test</summary>

1. Does rank 16 guarantee the learned update has rank exactly 16?
   - No. Its rank is at most 16 and can be smaller, including zero at initialization.
2. Why do two zero factors fail to start learning from the data loss?
   - Each factor's gradient contains the other factor. With both zero, both gradients vanish.
3. Does a passed merge test prove equal task quality to full fine-tuning?
   - No. It proves the merged artifact preserves the adapter's function within the tested tolerance. Full-update quality requires a controlled held-out comparison.
4. Can a rank-2 factorization represent a 4 by 4 identity update?
   - No. The identity has rank 4. Having 16 factor entries does not remove the rank constraint or factorization redundancy.

</details>

#### U6. QLoRA quantized bases, and prompt and prefix tuning

**About 3 h** · **Target:** Explain

Topics: QLoRA, quantized base weights and optimizer-state vocabulary; Prompt and prefix-tuning mechanisms

Plain LoRA preserves a dense base. QLoRA changes its storage and numerical reference; soft prompts instead change the model's conditioning, with different serving requirements.

**You can now**

- Separate quantized weight storage, computation dtype, trainable adapters and optimizer-state paging in QLoRA.
- Explain why dequantized merge equivalence and requantized deployment equivalence are different checks.
- Distinguish learned input prompts and layerwise prefixes from LoRA weight updates.

**Study**

1. [QLoRA: Efficient Finetuning of Quantized LLMs](https://arxiv.org/abs/2305.14314v1) (QLoRA: Efficient Finetuning of Quantized LLMs) - Section 2, Memory Requirement of Parameter-Efficient Finetuning; Section 3, QLoRA Finetuning, including NF4, Double Quantization, Paged Optimizers and Equations 5 and 6. Depth: Start after the plain LoRA tests pass. Stop before Section 4's large-model experiments. Required work is accounting and a numerical-reference diagram, not a bitsandbytes training run.
2. [Soft prompts: input embeddings versus layerwise prefixes](https://huggingface.co/docs/peft/main/en/conceptual_guides/prompting) (PEFT conceptual guide: Soft prompts) - Prompt tuning and Prefix tuning (page read 2026-10-16). Depth: Optional topic: explain these two mechanisms and their serving state. Skip P-tuning, multitask methods and all linked training walkthroughs.

**Focus**

- NF4 is a storage codebook, not ordinary 4-bit arithmetic for the entire training loop. The paper dequantizes frozen base weights into the computation dtype and trains higher-precision LoRA parameters.
- Double quantization compresses quantization constants. Paged optimizers move optimizer-state pages between host and device; they do not remove the state or guarantee a latency improvement.
- The adapter was trained against the dequantized quantized base. Merging into the original unquantized base changes that reference; requantizing a merged weight introduces another approximation. Validate outputs and held-out quality for each exported artifact.
- Optional: prompt tuning learns input embeddings; prefix tuning supplies learned layerwise attention prefixes, often key/value state in decoder implementations. Both freeze base weights but require conditioning state at serving time; neither generally folds into a fixed dense weight update like LoRA.

**Reproduce:** Draw the storage-to-compute-to-gradient path for one QLoRA layer without consulting the paper. For 1,048,576 quantized scalars, 4-bit payloads and one float32 scale per block of 64, derive 524,288 payload bytes plus 65,536 scale bytes: 576 KiB before double quantization, adapters, gradients, optimizer state, alignment and other metadata. Explain why calling this total training memory would be wrong. For the optional soft-prompt topic, annotate where each method's learned state enters a decoder and where it remains during serving.

**Traps**

- Reporting exactly half a byte per parameter as complete QLoRA memory. Scales, unquantized modules, adapters, activations and temporary dequantization buffers also occupy memory.
- Reusing a plain-LoRA merge tolerance after requantization. Quantization changes the reference function, so retain both a numerical residual and held-out evaluation.
- Calling learned virtual tokens free at inference. Input prompts or prefixes consume conditioning capacity and attention work, even if task-specific checkpoint storage is small.

**Practice**

- The section mini-project covers this: the adaptation artifact's storage/compute dtype ledger and deployment compatibility decision, including a reason to keep plain LoRA when quantization is unnecessary.

**Stop when:** You can account for the 576 KiB example with exclusions and identify the correct base reference for a quantized adapter export; optional soft-prompt study ends at its conditioning-state diagram.

<details>
<summary>Self-test</summary>

1. Does QLoRA train the discrete NF4 base codes by ordinary gradient descent?
   - No. The base remains frozen. Gradients pass through its dequantized computation to the trainable adapters and earlier trainable state.
2. What does double quantization quantize a second time?
   - The first quantization's scale constants, not the adapter weights or every activation.
3. Why is merging into the original full-precision checkpoint not the same reference as the training forward?
   - Training used the dequantized quantized base, which generally differs from the original weights. Adding the same adapter update to different base tensors need not preserve outputs.
4. Optional: is prompt tuning just choosing a better text instruction?
   - No. It optimizes continuous embedding parameters while holding the base fixed. A hard text prompt changes discrete inputs without gradient-based parameter training.

</details>

#### U7. Catastrophic forgetting, interference, domain balancing and replay

**About 5 h** · **Target:** Measure

Topics: Domain balancing, replay and prerequisite-skill retention; Forgetting, interference and capability regression slices

An average improvement can hide the loss of prerequisite skills. Retention slices and replay controls make the adaptation decision depend on what the model must keep, not just what it learns next.

**You can now**

- Measure target learning and source-skill regression on separate held-out slices with paired item identities.
- Compare replay and target-only adaptation under a declared total-token budget while reporting target exposure.
- Distinguish interference from template, evaluator and sampling changes before calling a regression forgetting.

**Study**

1. [LoRA Learns Less and Forgets Less](https://arxiv.org/abs/2405.09673v2) (LoRA Learns Less and Forgets Less (Biderman et al., 2024)) - Section 3; Sections 4.1 to 4.7 and Figures 2 to 4; Section 5, Learning-Forgetting tradeoffs paragraph on replay. Depth: Read for the evaluation design and rank, duration and module confounds. Inspect the spectral argument in 4.6 without reproducing its large training runs.
2. [Tulu 3: mixture choices and skill ablations](https://arxiv.org/abs/2411.15124v5) (Tulu 3, Sections 3 and 4 (data and supervised fine-tuning)) - Sections 4.1.2, The Tulu 3 SFT Mix, and 4.2, Key Data Experiments, with Table 10. Depth: Use the remove-one-source comparison as a design example, not a scale or score to reproduce.

**Focus**

- Predeclare target, general-language, instruction-following and prerequisite-skill slices. Use held-out source examples, not replay training rows, to measure retention. Keep raw outputs and per-item before/after scores.
- The Biderman results depend on task, rank, learning rate, target modules and duration. Less forgetting can accompany less learning; compare the learning-retention frontier rather than only one checkpoint per method.
- Replay mixes source training data back into adaptation. Fix total input tokens for the budget comparison and log actual source and target tokens plus supervised targets. Fixed total tokens and fixed target exposure are different experiments.
- Use the same small decoder, evaluator and inference budget for target-only and replay runs. Reuse the bounded SFT route from the full fine-tuning unit, repeat across three seeds, and report paired item uncertainty and between-seed spread separately. A negative or inconclusive retention result is valid evidence.

**Reproduce:** Closed-book, audit a fixed synthetic correctness table: base outcomes `[1,1,0,0]` and adapted outcomes `[1,0,1,0]`, with the first two items in a prerequisite slice and the last two in the target slice. Both aggregate accuracies are 0.5, but prerequisite accuracy falls by 0.5 while target accuracy rises by 0.5. Recompute by item ID, then state why four synthetic items support no real-model claim. Write the analogous paired analysis for your held-out retention records before running another adaptation.

**Traps**

- Changing the template or parser and calling the new score forgetting. First rerun the frozen model through the changed evaluation path.
- Adding replay on top of a target-only token budget and crediting replay for all gains. That also adds optimization work; disclose it or run a matched-total-token control.
- Treating a favorable average as a retention guarantee. Small regressions on an important slice can be hidden by larger gains elsewhere.

**Practice**

- The section mini-project covers this: held-out retention slices, a matched-total-token replay comparison, per-source exposure and a learning-retention plot with paired and seed uncertainty.

**Stop when:** Your held-out plot shows target gains and each retention slice for frozen, target-only and replay checkpoints, with token exposure and uncertainty; you can defend keeping or rejecting replay.

<details>
<summary>Self-test</summary>

1. Why is no measured forgetting insufficient evidence that an adapter is better?
   - It may have learned almost nothing. Compare target gains and retention jointly, including uncertainty, against full fine-tuning and the frozen baseline.
2. At a fixed total-token budget, what does increasing replay usually reduce?
   - Target-domain exposure. Report actual tokens from each source so retention is not mistaken for a free improvement in both objectives.
3. Can a replay evaluation use the exact examples in the replay buffer?
   - Not as evidence of held-out retention. That measures performance on training examples and can hide memorization. Split by source and duplicate group before sampling replay.
4. What does a negative gradient dot product between two minibatch losses establish?
   - A local first-order conflict at that parameter state: a small descent step on one tends to increase the other. It does not by itself establish long-run forgetting or a held-out capability loss.

</details>

#### U8. Logit distillation, temperature and KL direction, and feature distillation

**About 5 h** · **Target:** Derive + Implement

Topics: Teacher-student logit distillation, temperature and KL direction; Feature and representation distillation boundaries

The Math Foundations unit on entropy, cross-entropy, KL divergence and mutual information established the identities. Here the teacher signal, temperature and token alignment decide which objective the student actually learns.

**You can now**

- Derive masked soft-target distillation with temperature, hard-label mixing and an explicit KL direction.
- Implement a stable loss whose values and gradients match an independent finite-vocabulary reference.
- Define a feature-distillation alignment contract for teacher layers, token positions, widths and gradient ownership.

**Study**

1. [Distilling the Knowledge in a Neural Network](https://arxiv.org/abs/1503.02531v1) (Distilling the Knowledge in a Neural Network (Hinton et al., 2015)) - Sections 1 and 2, especially Equation 1, hard/soft objective mixing, and Section 2.1, Equations 2 to 4. Depth: Stop before Section 3's MNIST experiments. The high-temperature centered-logit argument is an approximation, not an identity at finite temperature.
2. [Modern LLM Notebook 17: logit and feature signals](https://github.com/walkinglabs/modern-llm-notebook/blob/979eecf09669121167184ef925d8edbc089fc13e/notebooks-en/part2-training/17-distillation.ipynb) (Modern LLM Notebook - LoRA, Distillation and OPD) - Section 2, Method 1: Logit Distillation; Section 4, Method 3: Feature Distillation; Exercises 1 and 2. Depth: Skip the API and 7B training recipe in Section 5. Section 4's GPT-4 layer diagram is illustrative, not verified access to that model's hidden states.

**Focus**

- For teacher logits $`v`$ and student logits $`z`$, define $`p_T=\operatorname{softmax}(v/T)`$, $`q_T=\operatorname{softmax}(z/T)`$. Use the valid-token mean of $`(1-\lambda)\operatorname{CE}(y,q_1)+\lambda T^2\operatorname{KL}(p_T\|q_T)`$. State the hard-label source, mask, temperature and mixture weight.
- The teacher is frozen and detached. In PyTorch 2.14.1, `torch.nn.functional.kl_div` takes student log probabilities as its input and teacher probabilities as its target for teacher-to-student KL. Use `reduction='none'`, sum over vocabulary, then apply the valid-token mask and denominator.
- The scaled soft-loss gradient with respect to student logits is $`T(q_T-p_T)`$. The $`T^2`$ multiplier compensates the high-temperature gradient shrinkage approximately; it does not make all temperatures equivalent.
- Feature matching requires accessible teacher activations, declared layer pairs, aligned token positions and a learned projection when widths differ. Mask invalid positions before reducing. Matching hidden coordinates is an extra constraint, not implied by matching output probabilities; different tokenizers need an alignment method or a text-level route.

**Reproduce:** On CPU with PyTorch 2.14.1 float64 and natural logarithms, take teacher probabilities $`p=(0.7,0.2,0.1)`$ and student probabilities $`q=(0.5,0.3,0.2)`$. Recover $`\operatorname{KL}(p\|q)=0.0851228259572216`$ and $`\operatorname{KL}(q\|p)=0.0920328502338319`$, within 1e-12. Implement temperature-scaled forward KL and check its student-logit gradient against $`T(q_T-p_T)`$ and `torch.autograd.gradcheck`. Add a tokenwise linear projection from width 4 to width 6 and verify that a masked feature-loss position has zero direct feature-loss gradient with respect to its student hidden state.

**Traps**

- Using a batch mean that also divides by sequence length or vocabulary size. Specify the vocabulary sum and valid-token mean explicitly.
- Equating low teacher probability with factual wrongness. Soft targets encode the teacher's beliefs and errors; held-out task quality remains a separate outcome.
- Matching vocabulary indices across different tokenizers. Equal vector lengths are not enough; each coordinate must refer to the same event at an aligned prefix.

**Practice**

- [Modern LLM Notebook 17: temperature and hand-KL exercises](https://github.com/walkinglabs/modern-llm-notebook/blob/979eecf09669121167184ef925d8edbc089fc13e/notebooks-en/part2-training/17-distillation.ipynb) - Exercise 1, Effect of temperature on soft labels; Exercise 2, KL divergence by hand. Use the supplied three-logit and three-probability inputs. Add your own reverse-direction, gradient, masking and zero-valid-target tests; the exercise cells do not establish those properties. The section mini-project covers the projected-feature oracle and a no-distillation control.

**Stop when:** Both KL values and the gradient checks pass, temperature and token reductions are explicit, and your feature-loss test distinguishes a masked direct term from indirect attention gradients.

<details>
<summary>Self-test</summary>

1. Why do soft-target cross-entropy and forward KL have the same student gradient with a fixed teacher?
   - They differ by teacher entropy, which is independent of student parameters at the fixed prefix. Detach the teacher and keep the same temperature and reduction.
2. Is the reverse-KL student-logit gradient also student probability minus teacher probability?
   - No. At temperature 1 and a fixed prefix it is $`q_i[\log(q_i/p_i)-\operatorname{KL}(q\|p)]`$. The familiar $`q_i-p_i`$ belongs to forward KL with a fixed teacher.
3. What does increasing temperature do to a fixed finite-logit distribution?
   - It makes it softer, approaching uniform as temperature grows. The scaled loss can still retain centered-logit differences in its high-temperature limit; a flatter probability vector does not prove the scaled learning signal vanishes.
4. Does masking one hidden-state position mean its input token can have no gradient?
   - No. It removes that position's direct feature-loss term. The token may still influence other supervised positions through attention and receive an indirect gradient.

</details>

#### U9. Sequence and synthetic-data distillation and on-policy distillation

**About 6 h** · **Target:** Implement

Topics: Sequence and synthetic-data distillation with teacher provenance; On-policy distillation and exposure-bias motivation

Offline teacher completions are cheap to reuse but do not expose the student to its own mistakes. On-policy supervision changes the visited prefixes and the compute budget, not automatically the KL direction.

**You can now**

- Build an offline sequence-distillation data contract with teacher provenance, filtering counts and leakage-safe splits.
- Implement a bounded student-rollout and teacher-scoring loop that distinguishes prefix source from divergence direction.
- Test a fixed-prefix reverse-KL gradient estimator without claiming it differentiates full trajectory visitation.

**Study**

1. [RLHF Book Chapter 12: synthetic data and distillation](https://rlhfbook.com/c/12-synthetic-data) (RLHF Book - Training Overview, Instruction Tuning and Synthetic Data) - Distillation with Synthetic Data; The Path to On-Policy, Teacher-Student Distillation, subsections Adapting Knowledge-Distillation for LMs and From Offline to On-Policy Distillation. Depth: Read for vocabulary, not a guarantee that generated answers are correct or that imitation-learning bounds transfer unchanged to language models. Headings checked 2026-10-16.
2. [Build a Reasoning Model (From Scratch): offline sequence distillation](https://www.manning.com/books/build-a-reasoning-model-from-scratch) (Build a Reasoning Model (From Scratch), Chapter 8) - Chapter 8: Section 8.3, pp. 273-275; Section 8.4, pp. 276-284, especially 8.4.3, p. 282; Section 8.6, pp. 286-291; Section 8.7, pp. 291-296; Section 8.8, pp. 296-301, stopping before Section 8.9. Depth: Skip the paid teacher generation in Section 8.2. Inspect a small subset of the pregenerated data in 8.3 or use local synthetic fixtures. Adapt the data and loss logic, not the book's whole-model run; validate masks against the earlier card.
3. [On-Policy Distillation of Language Models: Learning from Self-Generated Mistakes](https://arxiv.org/abs/2306.13649v3) (On-Policy Distillation of Language Models: Learning from Self-Generated Mistakes (Agarwal et al., 2024)) - Section 3, Equations 2 to 5; Section 3.1 and Algorithm 1; Section 4, GKD Variants paragraph. Depth: Implement the data-source switch and detached-rollout convention. Do not reproduce the TPU experiments. If you open the Modern LLM Notebook's `31-opd.ipynb`, its opening OPD simulation labels the student-minus-teacher gradient as reverse KL; that gradient belongs to forward KL.

**Focus**

- Offline sequence distillation is response-only next-token likelihood on teacher-generated text. It needs no teacher logits and can cross tokenizers by retokenizing text. Record teacher checkpoint or supplied provenance, prompt, template, decoding settings, generated text, filter decisions, license and split hashes. Unknown provenance stays unknown.
- Split by source problem or document before generation and filtering, deduplicate across splits and retain an untouched evaluation set. Correct-answer filtering changes the distribution; log acceptance rates and inspect rejected and accepted traces. A correct final answer does not verify the reasoning trace.
- GKD chooses a student-data fraction and a divergence separately. On-policy forward KL is valid. Collect fresh student prefixes without gradient through sampled IDs, then score teacher and student on those same prefixes with aligned vocabulary, temperature and EOS masks. GKD's detached visitation update is a semi-gradient, not the full derivative of its displayed expectation.
- For a fixed prefix, let teacher probabilities be $`p`$ and student probabilities be $`q`$. A sampled reverse-KL surrogate is $`\operatorname{stopgrad}[\log q(a)-\log p(a)]\log q(a)`$, with $`a\sim q`$. Its expected gradient matches the fixed-prefix reverse-KL gradient. This local identity omits future-prefix credit assignment; it is not a full MiniLLM reproduction.

**Reproduce:** On CPU with PyTorch 2.14.1 float64, enumerate three actions with teacher probabilities $`(0.7,0.2,0.1)`$ and student probabilities $`(0.5,0.3,0.2)`$. Weight each surrogate by detached student probability. Match its student-logit gradient to exact reverse KL within 1e-12; it is approximately $`(-0.2142525434,0.0940296774,0.1202228661)`$, not $`(-0.2,0.1,0.1)`$. Then use a tiny two-step categorical teacher and student to log fixed-data versus freshly sampled prefix IDs under the same prompts. Show that switching the prefix source does not switch your chosen divergence. Keep masks and teacher parameters fixed and compare against a no-distillation update.

**Traps**

- Training the student to imitate its own sampled tokens without a teacher signal. On-policy collection alone supplies no corrective supervision.
- Calling a negative sampled log-ratio a negative exact KL. An unbiased finite-sample estimate can be negative even when the population divergence is nonnegative; test the expectation and gradient separately.
- Changing prompt distribution and calling it an exposure-bias fix. Exposure bias here concerns generated prefixes under the same prompts. Cached old student rollouts are off-policy unless explicitly treated as such.

**Practice**

- The section mini-project covers this: the `lmlab` offline teacher-data manifest, finite-vocabulary distillation oracle and bounded detached student-rollout loop, with a no-distillation control.

**Stop when:** The section mini-project's distillation evidence includes the finite-vocabulary gradient oracle, a tiny detached-rollout loop, an offline provenance manifest and a matched no-distillation control. A real-model gain is not required to pass these mechanism tests.

<details>
<summary>Self-test</summary>

1. Can offline teacher-text distillation use a different tokenizer?
   - Yes, retokenize the text for the student. Direct token-distribution KL cannot compare unrelated vocabulary coordinates without an additional alignment method.
2. Does a student-data fraction of one imply reverse KL?
   - No. It specifies student-generated prefixes. GKD independently chooses forward KL, reverse KL or another divergence.
3. Why detach the log-ratio coefficient in the sampled surrogate?
   - It is the score-function coefficient, not a second differentiable loss factor. At a fixed prefix the expected detached-coefficient gradient equals reverse KL's gradient; differentiating it too changes the estimator.
4. Why keep evaluation prompts out of generation and filtering?
   - Teacher answers, duplicate source problems and filter choices can leak evaluation information into training or selection. Hold out source groups before constructing the distillation data.

</details>

#### U10. Quality, memory, latency and update-cost comparison, and model merging

**About 5 h** · **Target:** Measure

Topics: Quality, train memory, latency, serving memory and update-cost comparison; Model merging and task-vector vocabulary

A training-memory saving is not a serving-speed result. The final choice must meet quality and retention constraints while accounting for every update and inference cost.

**You can now**

- Compare prompted, smaller-model, full-update and low-rank or distilled candidates under a fixed evaluator and inference budget.
- Separate training memory, serving memory, latency, throughput and total update cost in a decision table.
- Explain task vectors and test a small common-base merge without assuming capability composition.

**Study**

1. [LoRA Without Regret: matched comparisons and compute accounting](https://thinkingmachines.ai/blog/lora/) (LoRA Without Regret) - What matters for LoRA; Methods and results, with its subsections LoRA rank and Batch size effects; Layers Where LoRA Is Applied; and Compute efficiency advantage of LoRA under Discussion. Depth: Read the curves as log-loss evidence under the article's settings, not sampled task scores or universal hyperparameters. The roughly two-thirds FLOP ratio is an analytical matrix-operation estimate, not measured wall time. Headings checked 2026-10-16.
2. [Modern LLM Notebook 16: model-merging vocabulary](https://github.com/walkinglabs/modern-llm-notebook/blob/979eecf09669121167184ef925d8edbc089fc13e/notebooks-en/part2-training/16-lora.ipynb) (Modern LLM Notebook - LoRA, Distillation and OPD) - Section 11, Model Merging; Mainstream Merging Methods, Task Arithmetic code block. Depth: Optional topic: stop after the common-base task-vector formula. Skip the mergekit installation and 7B recipe. Treat the method table as vocabulary, not evidence that a method is best for a given pair.

**Focus**

- Hold evaluation prompts, scoring, decoding, maximum generated tokens and batch policy fixed. Report target and retention slices with uncertainty or paired per-example changes. Give each training method its own small declared learning-rate search; also report total search cost and matched-token comparisons.
- Measure peak allocated and reserved training memory separately from steady serving memory, optimizer state and saved artifact bytes. Record hardware, library and checkpoint revisions, precision, context, batch and cache policy. Include warmup and synchronization in timings, but exclude them from measured repetitions. On CPU, report process memory and elapsed time rather than invented CUDA measurements.
- Separate prefill, decode, time to first token, end-to-end latency and throughput. Measure merged and unmerged adapters separately. Include teacher generation/scoring, filtering, student rollouts, retries and evaluation in update cost. Use CPU toy models when the full comparison does not fit; label those results mechanism evidence, not production rankings.
- A task vector is $`\Delta_i=\theta_i-\theta_0`$; task arithmetic forms $`\theta_{\mathrm{merge}}=\theta_0+\sum_i\alpha_i\Delta_i`$. Require a common base revision, matching tensors and tokenizer semantics. This differs from exactly folding one LoRA branch into its base. Select coefficients on validation data and test target and retention regressions.

**Reproduce:** Make the section mini-project's decision table using a CPU toy run or one consumer GPU. Mark unmeasured candidates explicitly. First check a synthetic cost ledger: an extra 3,600 seconds of one-time update work and 0.02 seconds saved per request break even at 180,000 requests, assuming equal quality, hardware cost per second and all other costs. This is arithmetic, not a benchmark. For the optional merge check, use base vector $`(1,2)`$ and adapted vectors $`(2,2)`$ and $`(1,4)`$. Coefficients 0.5 and 0.25 yield merged vector $`(1.5,2.5)`$. Verify zero coefficients recover the base and one unit coefficient recovers that adapted vector; then evaluate rather than infer skill composition.

**Traps**

- Reporting fewer trainable parameters as an equal-factor speedup. Frozen layers still run forward and usually propagate input gradients; attention, activation storage and kernel overhead remain.
- Comparing methods with different generated lengths or batch sizes and calling the result a latency win. Report both controlled-budget measurements and any separate production-policy experiment.
- Averaging LoRA factors instead of their effective weight updates. The product of averaged factors introduces cross terms and need not equal the average update; quantized merges also need numerical and task regression checks.

**Practice**

- The section mini-project covers this: the `lmlab` matched quality, retention, training-memory, serving-memory, latency and update-cost ledger, plus the optional common-base merge checks.

**Stop when:** The section mini-project's comparison names a preferred intervention under explicit quality, retention, memory and latency constraints, includes prompted and no-training controls, and separates measurements from estimates. The optional merge arithmetic must pass before any behavioral merge claim.

<details>
<summary>Self-test</summary>

1. Does an exactly merged ordinary LoRA adapter make the dense model smaller?
   - No. It removes the extra inference branch, not the base weight tensor. Saving adapter files alone is a different storage and deployment choice.
2. Can the smallest training-memory method have the worst serving latency?
   - Yes. Training state, inference kernels, quantization, extra branches, prefix length and generated length affect different costs. Measure the actual deployment form.
3. When does the synthetic break-even calculation stop being useful?
   - When per-request savings are nonpositive, quality differs, updates recur, hardware costs differ or omitted teacher and deployment costs matter. Recompute with the actual workload and constraints.
4. Does task-vector addition prove the merged model has both source skills?
   - No. Tensor compatibility makes the arithmetic defined, not the behaviors compositional. Conflicting updates can harm either skill or retention, so use held-out evaluations.

</details>

### Mini-project: Adaptation with checked masks, adapters and teacher signals

**About 16 to 22 hours.** Extend `lmlab` in `adapt/` with tested full-SFT and LoRA paths, retention controls and a bounded distillation mechanism study. Use the existing model family, lineage and frozen evaluator to decide whether adaptation is worth its training and deployment costs on your machine, without paid teacher APIs.

1. Prespecify the adaptation question, target and retention slices, matched budgets and stop rules in `registry/`. Plan frozen, prompted and smaller instruction-model baselines against the existing evaluator; independently recount parameters and estimate FLOPs before approving a CPU or single-GPU run plan.
2. Build the conversation schema and pinned tokenizer/template manifest in `adapt/`. Check train-serve token equality, malformed roles and truncation against template serialization; pass TensorTonic assistant-mask cases, then retain independent shifted-target, stop-token, denominator, accumulation and packed-versus-separate attention-isolation oracles in `tests/`.
3. Implement counted LoRA factors on the existing decoder using Modern LLM Notebook 16's corrected exercises. Check dense-update forwards and finite-difference gradients before training; retain frozen-base, initialization-gradient, state round-trip, wrong-base rejection and merge/unmerge regressions with declared precision-dependent tolerances.
4. Build an offline teacher-text manifest with source-group splits, provenance and filter counts. Extend Modern LLM Notebook 17's exercises with full-vocabulary KL-gradient and projected-feature oracles; retain detached teacher, mask and reverse-KL enumeration tests, then a bounded categorical student-prefix update loop with a no-distillation control.
5. Run bounded full-SFT and LoRA controls only after preflight, checking resumed updates against uninterrupted training. Reconcile post-update tensor-state counts and a context-length memory sweep with measured peaks or CPU storage accounting; retain residual explanations, storage/compute dtype ledgers and a deployment-compatibility decision about quantization.
6. Compare target-only adaptation with replay at matched total input tokens across seeds, using the frozen `eval/` suite. Retain per-source input and supervised exposure, paired item uncertainty, seed spread and learning-retention plots; investigate regressions against unchanged-model template and parser controls rather than assuming forgetting.
7. Rebuild a matched quality, retention, training/serving-memory, latency and update-cost table from raw records in a clean process. Include no-training baselines, merged/unmerged adapters, prefill/decode and teacher/filter/rollout costs; retain failed runs and a deployment verdict. Optional common-base task merges require independent arithmetic and behavior regressions.

**Deliverables**

- The `adapt/` serializers, full-SFT and LoRA paths, distillation fixtures and independent objective, export and resume tests.
- Teacher-data, template, checkpoint and adapter manifests linked to `registry/`, including all failed attempts.
- Reproducible learning-retention plots, memory reconciliation and deployment decision with complete training, teacher and inference costs.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [TensorTonic: Build an Assistant-Only SFT Loss Mask](https://www.tensortonic.com/problems/cs336-l15-assistant-only-sft-mask). Pass public role-ID cases; add real-template target ownership, denominator, gradient and attention-isolation tests.
- external-tests: [Modern LLM Notebook 16: parameter count and weight merging](https://github.com/walkinglabs/modern-llm-notebook/blob/979eecf09669121167184ef925d8edbc089fc13e/notebooks-en/part2-training/16-lora.ipynb). Use the corrected factor order from the unit; exercise cells do not replace your decoder-state and gradient regressions.
- external-tests: [Modern LLM Notebook 17: temperature and hand-KL exercises](https://github.com/walkinglabs/modern-llm-notebook/blob/979eecf09669121167184ef925d8edbc089fc13e/notebooks-en/part2-training/17-distillation.ipynb). Extend the named exercises with independent gradients, projected-feature masking and finite-vocabulary reverse-KL enumeration.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Objective and state correctness | Your template, shifted-mask, denominator and packed-attention oracles pass; dense-update and finite-difference checks validate LoRA before training, with frozen-base, export, wrong-base and resume regressions. | Injected template shifts, cross-example leakage and duplicate merges fail independently; nonzero adapters preserve logits through serialization and export under justified precision-dependent tolerances. |
| Teacher signal ownership | Independent KL and projected-feature gradient checks pass; teacher provenance, source-group splits and filtering are recorded, and the detached student-prefix loop retains a matched no-distillation control. | Exact enumeration distinguishes forward from reverse KL and detached visitation from a full trajectory derivative; teacher errors and unknown provenance explicitly limit the claim. |
| Adaptation decision evidence | Matched full-SFT, LoRA, replay and no-training controls retain seed variation, paired retention, state/peak residuals, dtype compatibility and complete costs; a clean process rebuilds the decision and failures. | The verdict separates learning from elicitation and retention from exposure, explains when plain LoRA suffices, and distinguishes measured resource savings from estimates and unsupported deployment claims. |

Feeds into: Versioned SFT checkpoints, adapter exports, masks, teacher-signal oracles and retention slices feed Preference Modeling and Direct Optimization, RL Post-training and Reasoning, multimodal adaptation and the capstone's matched-budget post-training study.

### Resource route

- **Primary - Book:** [RLHF Book - Training Overview, Instruction Tuning and Synthetic Data](https://rlhfbook.com/c/04-instruction-tuning.html) - Read Chapter 3 (training overview and canonical recipes; no exercises), Chapter 4 (instruction tuning, `04-instruction-tuning.html`) and Chapter 12 (synthetic data and distillation, `12-synthetic-data.html`). Do the Suggested Experiments in Chapters 4 and 12 at a scale that fits your GPU. Use the recipe maps to separate continued pretraining, SFT, rejection sampling and distillation before selecting an intervention.
- **Required - Assignment:** [CS336 Assignment 5 Supplement - SFT](https://github.com/stanford-cs336/assignment5-alignment) - Do supplement Sections 3 and 4: zero-shot baselines, `look_at_sft`, `get_packed_sft_dataset` and the SFT script, with the data tests passing on CPU. The handout fine-tunes Llama 3.1 8B on B200s and judges with a 70B model; use a small open model that fits your GPU and rule-based scoring on fixed MMLU and GSM8K subsets, and keep the evaluation identical before and after.
- **Required - Paper:** [LoRA: Low-Rank Adaptation of Large Language Models](https://arxiv.org/abs/2106.09685) - Read Section 4 and Figure 1 (Section 3 explains why adapters add latency): derive the low-rank update, the alpha over r scale, the zero initialization of B and the parameter count, then implement LoRA for selected decoder linear layers and test that the merged weights reproduce the adapter output. The paper adapts attention only; later work finds the MLP layers matter.
- **Required - Paper:** [LoRA Learns Less and Forgets Less (Biderman et al., 2024)](https://arxiv.org/abs/2405.09673) - Read Section 3 and Sections 4.1 to 4.7 with Figures 2 to 4: on code and math, full fine-tuning learns more of the target and forgets more of the source, and LoRA rank controls the trade-off. Slice forgetting on your own evaluations.
- **Support - Article:** [LoRA Without Regret](https://thinkingmachines.ai/blog/lora/) - Read "What matters", the rank, batch-size and layer results, and "Setting LoRA hyperparameters": all-layer LoRA at high rank matches full fine-tuning loss, the best LoRA learning rate is about ten times higher, and large batches hurt LoRA more. The curves are log loss, not sampled evaluations.
- **Reference - Paper:** [QLoRA: Efficient Finetuning of Quantized LLMs](https://arxiv.org/abs/2305.14314) - Read the method and memory-analysis sections only after plain LoRA passes. Use it to explain quantized-base adaptation and its numerical assumptions, not as a mandatory large training run.
- **Reference - Paper:** [Distilling the Knowledge in a Neural Network (Hinton et al., 2015)](https://arxiv.org/abs/1503.02531) - Read Sections 1 and 2 for the temperature-softened softmax and the mix of soft and hard targets that later distillation methods reuse.
- **Support - Course:** [Hugging Face LLM Course Chapter 11 and smol-course Unit 1](https://huggingface.co/learn/llm-course/en/chapter11/1) - Work through 11.2 (chat templates), 11.3 (SFT with TRL) and 11.4 (LoRA with PEFT) on SmolLM2-135M, then smol-course Unit 1 for an SFT, LoRA and evaluation loop. TRL 1.15.0 trains on the whole sequence unless you set `assistant_only_loss=True`, and the template must expose assistant spans for that to work.
- **Support - Paper:** [MiniLLM: Knowledge Distillation of Large Language Models (Gu et al., 2024)](https://arxiv.org/abs/2306.08543) - Read Section 2.1 (reverse KL from student to teacher, and why it is mode-seeking) and Section 2.2 (the on-policy gradient and its stabilizers). It needs white-box teacher log probabilities.
- **Support - Paper:** [On-Policy Distillation of Language Models: Learning from Self-Generated Mistakes (Agarwal et al., 2024)](https://arxiv.org/abs/2306.13649) - Read Sections 3 and 4 with Algorithm 1: the student-data fraction lambda mixes fixed data with student samples, and the divergence is a choice. Budget the extra student rollouts and teacher scoring per step.
- **Support - Article:** [On-Policy Distillation](https://thinkingmachines.ai/blog/on-policy-distillation/) - Read the loss (per-token reverse KL on student samples), the pseudocode and the reasoning and personalization results. Teacher and student share a tokenizer and lineage there; the FLOP ratios are estimates.
- **Support - Paper:** [Tulu 3, Sections 3 and 4 (data and supervised fine-tuning)](https://arxiv.org/abs/2411.15124) - Read Section 3 (prompt curation and decontamination) and Section 4 (the SFT mix, data experiments and recipe) as an auditable data contract to imitate at small scale, not a scale to reproduce.
- **Support - Paper:** [Don't Stop Pretraining: Adapt Language Models to Domains and Tasks (Gururangan et al., 2020)](https://arxiv.org/abs/2004.10964) - Read Sections 3 and 4: domain-adaptive and task-adaptive continued pretraining before fine-tuning. Compare continued pretraining with SFT at matched tokens and a fixed evaluator.
- **Support - Book:** [Build a Large Language Model (From Scratch), Chapter 7 and Appendix E](https://www.manning.com/books/build-a-large-language-model-from-scratch) - Use Chapter 7 (SFT, pp. 204-249) and Appendix E (LoRA, pp. 322-336) for the smallest full SFT and LoRA run. The chapter trains on instructions too by default; Exercise 7.2 (p. 223) is the masked variant, and there is no packing.
- **Support - Book:** [Build a Reasoning Model (From Scratch), Chapter 8](https://www.manning.com/books/build-a-reasoning-model-from-scratch) - Use Chapter 8 (pp. 267-304: generating and filtering a distillation set, losses, training loop and evaluation) as a runnable 0.6B sequence-distillation baseline with provenance.
- **Support - Lab:** [Modern LLM Notebook - LoRA, Distillation and OPD](https://github.com/walkinglabs/modern-llm-notebook/tree/979eecf09669121167184ef925d8edbc089fc13e) - Use `notebooks-en/part2-training/16-lora.ipynb`, `17-distillation.ipynb` and `notebooks-en/part4-frontiers/31-opd.ipynb` for compact implementations. Derive the objectives from MiniLLM and GKD rather than the notebooks, and scale the 7B distillation example down.
- **Support - Practice:** [TensorTonic - Assistant-Only SFT Loss Mask](https://www.tensortonic.com/problems/cs336-l15-assistant-only-sft-mask) - Solve Build an Assistant-Only SFT Loss Mask (`cs336-l15-assistant-only-sft-mask`). It takes role ids, so add your own tests for chat-template parsing, multi-turn roles, truncation, packed examples and special-token boundaries. Public test cases check the listed edge cases, not gradients or the hidden grader, so keep your own tests beside each solution. 
- **Support - Implementation:** [RLHF Book Code - Instruction Tuning and Distillation](https://github.com/natolambert/rlhf-book/tree/1042143366d73ff654727e4d18a1d3a21209c3a3/code) - Read `instruction_tuning/train.py` and `utils.py` (it masks all but the final assistant turn) and `distillation/loss.py`. The default configs use 1B to 1.7B models and long contexts; cut the model, context and sample count to fit your GPU, hold the data and evaluator fixed, sweep one variable and compare with a no-distillation baseline.
- **Reference - Documentation:** [PEFT conceptual guide: Soft prompts](https://huggingface.co/docs/peft/main/en/conceptual_guides/prompting) - Read Prompt tuning and Prefix tuning only (page read 2026-10-16). These supply the optional soft-prompt mechanisms missing from the section pool; no extra training run is required.

### Exit checkpoint

Produce a tested SFT or continued-pretraining baseline plus one low-rank or distillation route; prove masks, trainable state and merge behavior; and show quality, forgetting, memory and latency under the same evaluator and inference budget.

<details>
<summary>Deliberately left for later</summary>

- Completing every parameter-efficient fine-tuning variant
- Large synthetic-data factories and teacher fleets
- Production multi-tenant adapter serving and quantization kernels

</details>

## LMR-7. Preference Modeling and Direct Optimization

**Why:** Preference optimization can improve its own reward while degrading real behavior. This stage derives the data and objective path, then tests it against length, style, evaluator and distribution shortcuts.

### Learn this much

- [ ] Policy-dependent preference-data generation and prompt sampling _(Required)_
- [ ] Pairwise, listwise, ratings, ties and indifference labels _(Required)_
- [ ] Annotator disagreement, noise, expertise and adjudication _(Required)_
- [ ] Position, length, style, verbosity, identity and presentation bias _(Required)_
- [ ] Bradley-Terry preference likelihood and reward differences _(Required)_
- [ ] Reward identifiability, offsets, scale and calibration limits _(Required)_
- [ ] Preference and outcome reward-model training contracts _(Required)_
- [ ] Reward-model shift across policies, prompts and response lengths _(Required)_
- [ ] Reward overoptimization, Goodhart effects and proxy regressions _(Required)_
- [ ] Reference policies, KL-regularized RL objective and policy distance _(Required)_
- [ ] DPO derivation from policy and reference log-probability ratios _(Required)_
- [ ] Beta, margins and gradient pressure on chosen and rejected responses _(Required)_
- [ ] Response-only sequence log probabilities, masks and length normalization _(Required)_
- [ ] Reference-checkpoint identity, tokenizer compatibility and stale caches _(Required)_
- [ ] Provenance, duplicates, leakage, balance, agreement and slice audit _(Required)_
- [ ] Preference-loss numerical, sign, gradient and invariance tests _(Required)_
- [ ] Independent capability, safety, calibration and diversity evaluation _(Required)_
- [ ] Versioned sampling, labeling, optimization, evaluation and rollback loop _(Required)_
- [ ] IPO, SimPO, ORPO and related direct-objective vocabulary _(Optional)_
- [ ] AI feedback and constitution-conditioned preference generation _(Optional)_
- [ ] New direct preference objectives and consistency theory _(Depth)_
- [ ] Sensitive large-scale human preference collection _(Later)_

### Study units

#### U1. Policy-dependent preference data and pairwise, listwise and tie labels

**About 4 h** · **Target:** Explain

Topics: Policy-dependent preference-data generation and prompt sampling; Pairwise, listwise, ratings, ties and indifference labels

A preference label describes a comparison under a collection process, not an absolute quality certificate. That process defines what the later reward or policy fit can claim.

**You can now**

- Specify whose preferences a dataset represents, under which rubric and prompt distribution.
- Trace each comparison to its generating policy, sampling settings and presentation order.
- Convert rankings into strict pairs without silently turning ties, missing judgments or ratings into wins.

**Study**

1. [The RLHF Book: Chapter 10, The Nature of Preferences; Chapter 11, Preference Data](https://rlhfbook.com/c/11-preference-data.html) (RLHF Book - Reward Models, Direct Alignment and Preferences) - Chapter 11: Collecting Preference Data through Structured Preference Data, including Interfaces, Rankings vs. Ratings and Multiturn Data; Open Questions in RLHF Preference Data. Depth: Skip Sourcing and Contracts. For the specification problem, also read Chapter 10, When Preference Replaces Correctness and Complexity of Optimizing Preferences, at https://rlhfbook.com/c/10-preferences.html. Do not repeat the basic judge survey from the LLM Foundations unit on model judges and human review.
2. [CS336 Spring 2026 Assignment 5 supplement: inspect HH](https://github.com/stanford-cs336/assignment5-alignment/blob/c2734a26308710949fe13226960a1e8cece94b7e/cs336_spring2026_assignment5_supplement_safety_rlhf.pdf) (CS336 Assignment 5 Supplement - Preference Data and DPO) - Section 6.2, Looking at Preference Data, Problem `look_at_hh`, parts (a) and (b), printed p. 16.

**Focus**

- Record prompt source, generator checkpoint, decoding settings, rubric, labeler identity or type, displayed order and raw votes before making chosen/rejected records.
- Preference collection often calls data from the same model family on-policy. This is not the strict RL definition of samples from the current update's policy. Off-policy pairs are usable, but coverage must be tested rather than assumed.
- A ranking creates dependent pairs within a prompt. Preserve the ranking and prompt group so expanding it does not silently overweight prompts with more candidates.
- Separate indifference, both-bad, uncertainty and missing labels. A rating difference is not automatically a calibrated preference probability.

**Reproduce:** Without notes, draw the provenance chain from a sampled prompt to a training pair. For candidate IDs `a`, `b`, `c`, `d` with ranks `[1, 2, 2, 4]`, list the five strict winner-loser pairs and retain the tie separately. State which weighting rule would give this prompt the same total weight as a prompt with only one pair.

**Traps**

- Treating chosen as correct. Two wrong answers can still have a meaningful relative preference.
- Splitting expanded pairs randomly. The same prompt, conversation or candidate can then cross the train/evaluation boundary.
- Discarding the source collection after merging HH. Helpful, harmless and rejection-sampled data need separate audit slices.

**Practice**

- [CS336 Assignment 5 supplement: `look_at_hh`](https://github.com/stanford-cs336/assignment5-alignment/blob/c2734a26308710949fe13226960a1e8cece94b7e/cs336_spring2026_assignment5_supplement_safety_rlhf.pdf) - Section 6.2, parts (a) and (b): combine the four HH collections, retain source, remove multi-turn examples as specified, and inspect three helpful and three harmless comparisons. This is a written/data-inspection problem, not an autograded one. Save accepted and excluded counts and your reasons for disagreeing with any labels. Use a bounded subset on CPU. The public handout and tests are study material; never publish assignment solutions.
- [TensorTonic: Canonicalize Pairwise Preference Data](https://www.tensortonic.com/problems/cs336-l15-canonical-preference-pairs) - Implement `canonical_preference_pairs(records)`. Free. Public cases cover a three-candidate ranking, unsorted candidate input and two prompt records. Add your own tie and duplicate-ID rejection cases; the public cases do not establish those behaviors.

**Stop when:** Your HH inspection retains source and exclusion counts, your strict-ranking converter passes the public examples, and your collection contract specifies ties, grouping and generator lineage.

<details>
<summary>Self-test</summary>

1. Does changing the generator leave the preference task unchanged?
   - The rubric may stay fixed, but the compared response distribution changes. New failure modes and harder or easier comparisons can change observed agreement and learned behavior.
2. How many strict pairs come from ranks `[1, 2, 2, 4]`?
   - Five: `a` beats `b`, `c` and `d`; `b` and `c` each beat `d`. The `b`/`c` tie supplies no strict winner.
3. Can an indifference label enter ordinary binary DPO unchanged?
   - No. Declare a policy such as excluding it from the strict-pair objective while reporting it, or using an explicitly defined soft-label or tie-aware objective. Do not pick a winner arbitrarily.

</details>

#### U2. Annotator agreement and noise, and position, length and style bias

**About 4 h** · **Target:** Measure

Topics: Annotator disagreement, noise, expertise and adjudication; Position, length, style, verbosity, identity and presentation bias

An optimizer can learn an annotation interface's shortcuts as easily as its intended rubric. This audit extends the LLM Foundations unit on model judges and human review from evaluating outputs to checking the labels that will train a policy.

**You can now**

- Measure agreement and presentation sensitivity while preserving raw votes, ties and abstentions.
- Separate annotator error from rubric ambiguity, expertise gaps and legitimate preference differences.
- Design a label-noise intervention and a length/style control before fitting the preference route.

**Study**

1. [InstructGPT: labeler selection and disagreement](https://arxiv.org/abs/2203.02155v1) (Training Language Models to Follow Instructions with Human Feedback (Ouyang et al., 2022)) - arXiv:2203.02155v1, Section 3.4, Human data collection; Appendix B.1, including the labeler selection procedure. Depth: Read the collection and agreement protocol, not the large-model training recipe. The paper's agreement rates describe its recruited population, not a target for your audit.
2. [The RLHF Book: collection bias and judge instructions](https://rlhfbook.com/c/11-preference-data.html) (RLHF Book - Reward Models, Direct Alignment and Preferences) - Chapter 11, Bias: Things to Watch Out For in Data Collection and Open Questions in RLHF Preference Data; Chapter 5, Generative Reward Modeling, at https://rlhfbook.com/c/05-reward-models.html.
3. [A Long Way to Go: length as a confound](https://arxiv.org/abs/2310.03716v2) (A Long Way to Go: Investigating Length Correlations in RLHF (Singhal et al., 2023)) - arXiv:2310.03716v2, Sections 2 to 5: task setup, length-stratified reward analysis, length-only reward, interventions and preference analysis. Depth: Read the controls and plots. Do not reproduce the paper's PPO training or use correlation alone as evidence of a causal length shortcut.

**Focus**

- Translate displayed-side labels back to response identity before comparing votes across order swaps. Report agreement, tie/abstention rates and counts by rubric axis and source.
- Use blinded order swaps and identity removal; vary formatting or verbosity only after checking that the factual content and task constraints remain matched. Report both response lengths beside every win rate, using one fixed tokenizer and also a text-length measure.
- Retain disagreements before adjudication. Record the reason and expertise needed; consensus can erase a real harmlessness/helpfulness trade-off rather than resolve it.
- Flip labels only in a separate, versioned training intervention. Keep held-out labels untouched so robustness is not scored against the corruption you introduced.

**Reproduce:** Closed-book, canonicalize two annotators' votes on four fixed pairs: `["a", "b", "tie", "a"]` and `["a", "a", "tie", "b"]`. Exact agreement, counting a shared tie as agreement, is 50%. Then derive that symmetric independent label flipping with probability 0.25 changes an underlying strict preference probability of 0.8 to 0.65. These are constructed checks, not estimates of human reliability.

**Traps**

- Calling delayed self-relabeling inter-annotator agreement. It measures your repeatability; use existing repeated labels or another consenting reviewer for between-person evidence.
- Assuming a judge instruction to ignore length removes length bias. The instruction is a hypothesis to test, not a control that proves itself.
- Treating all disagreement as random flips. Rubric conflict and population differences need separate slices, not just a noise rate.

**Practice**

- The section mini-project covers this: the raw-vote and adjudication ledger, order/identity/length/style audit, and a versioned annotator-noise intervention evaluated on untouched held-out labels.

**Stop when:** Your audit distinguishes raw agreement from presentation sensitivity, includes untouched held-out labels, and reports paired lengths and sample counts beside every win rate.

<details>
<summary>Self-test</summary>

1. A judge chooses the left response in both orders. What does that establish?
   - On that pair, its content preference is inconsistent under an order swap. More pairs are needed to estimate a position effect; a single pair does not identify a population bias.
2. Why is 50% raw agreement not automatically chance agreement?
   - Chance agreement depends on the label marginals and tie policy. Raw agreement alone does not adjust for skewed response preferences or annotator populations.
3. Does a higher reward-length correlation prove the reward model ignores correctness?
   - No. Correctness may require detail. Compare content-matched length interventions and inspect residual errors before attributing a shortcut.

</details>

#### U3. The Bradley-Terry likelihood and reward identifiability

**About 4 h** · **Target:** Derive

Topics: Bradley-Terry preference likelihood and reward differences; Reward identifiability, offsets, scale and calibration limits

DPO inherits its probability model from pairwise reward learning. Building on the Math Foundations unit on maximum likelihood and MAP estimation and the Classical ML unit on logistic regression and stable binary cross-entropy, the new work is to state what a preference fit does not identify.

**You can now**

- Derive a prompt-conditioned Bradley-Terry likelihood and its stable negative log-likelihood.
- Identify the reward offsets that comparisons cannot recover, and distinguish them from score scale.
- Check a repeated-vote fit and explain why ranking accuracy does not establish probability calibration.

**Study**

1. [The RLHF Book: Chapter 5, Reward Modeling](https://rlhfbook.com/c/05-reward-models.html) (RLHF Book - Reward Models, Direct Alignment and Preferences) - Training a Bradley-Terry Reward Model, from positive strengths through the log-sigmoid/softplus equivalence; Other Reward Model Variants, Balancing Multiple Comparisons Per Prompt and K-Wise Loss Function. Depth: Derive the pairwise model fully. Read the grouped and listwise variants only to explain how expanding a ranking changes the sampling weights.
2. [DPO: reward equivalence](https://arxiv.org/abs/2305.18290v3) (Direct Preference Optimization) - arXiv:2305.18290v3, Section 5.1, Your Language Model Is Secretly a Reward Model: Definition 1 and Lemmas 1 and 2; Appendix A.5, Proof of Lemma 1 and 2.

**Focus**

- For fixed prompt $`x`$, $`P(y_a \succ y_b \mid x)=\sigma(r(x,y_a)-r(x,y_b))`$. Fit the sum or declared weighted mean of log likelihoods, not the log of an average probability.
- Adding any prompt-only offset $`c(x)`$ changes neither comparison probability nor the normalized KL-regularized optimal policy. Disconnected comparison components can have additional unidentified offsets without further assumptions.
- With a fixed sigmoid link, multiplying all score differences changes probabilities, even when rankings stay fixed. If a separate temperature is also fitted, score scale and that temperature can be confounded.
- A scalar reward is not a standalone correctness probability. Only the linked difference gives a pairwise probability under this model, and calibration must be assessed on held-out comparisons.

**Reproduce:** For one prompt with two responses and ten recorded strict votes, eight favor the first and two the second. Derive the unregularized optimum score difference $`\log 4`$, predicted probability 0.8 and mean negative log-likelihood 0.5004024235381879. On CPU with PyTorch 2.14.1 and `torch.float64`, evaluate stable binary cross-entropy on the ten labels and check the derivative at $`\log 4`$ is zero within absolute tolerance $`10^{-12}`$. Show that a shared offset leaves the likelihood unchanged but doubling the difference does not. This is an in-sample likelihood oracle, not a generalization score.

**Traps**

- Calling reward scale unidentifiable under a fixed logistic link. The free additive offset and the probability-sensitive multiplicative scale are different issues.
- Reporting a finite unregularized optimum when all votes go one way. The logistic likelihood then favors an unbounded difference; an iteration limit can masquerade as a fitted scale.
- Counting every expanded ranking pair as an independent annotation. Preserve prompt groups for weighting and uncertainty.

**Practice**

- The section mini-project covers this: the pairwise likelihood oracle, repeated-vote calibration check, and offset/scale and separated-vote regression tests for the reward route.

**Stop when:** You derive and numerically check the repeated-vote optimum, distinguish offset from scale, and explain the all-one-label boundary without trusting a stopped solver.

<details>
<summary>Self-test</summary>

1. Why can the two scores not be recovered separately from the ten votes?
   - The likelihood depends only on their difference. An arbitrary common offset gives the same probabilities. Fix one score or impose a centering convention to choose a representative.
2. What changes if both scores are multiplied by two?
   - The ranking stays the same, but the difference doubles, so the sigmoid probability changes unless the difference is zero. This generally changes likelihood and calibration.
3. Can equal rewards represent an explicit tie category in ordinary Bradley-Terry?
   - No. They assign equal probabilities to the two strict outcomes. An explicit tie category requires an extension or a declared soft-label encoding; indifference and uncertainty remain different observations.

</details>

#### U4. Reward-model training contracts and reward shift across policies and lengths

**About 5 h** · **Target:** Implement + Measure

Topics: Preference and outcome reward-model training contracts; Reward-model shift across policies, prompts and response lengths

A correct loss can still train a scorer of padding, length or generator style. The research question is whether its rankings and probabilities survive a change in the responses being scored.

**You can now**

- Train a bounded scalar reward head with a prompt-grouped split and an explicit padding/truncation contract.
- Assess held-out ranking and pairwise probability calibration separately across generator and length slices.
- Distinguish preference labels from outcome labels and diagnose a reward shortcut under distribution shift.

**Study**

1. [The RLHF Book: Chapter 5, Reward Modeling](https://rlhfbook.com/c/05-reward-models.html) (RLHF Book - Reward Models, Direct Alignment and Preferences) - The Default Reward Model Architecture; Implementation Example; Outcome Reward Models; Suggested Experiments, item 1, Train a Bradley-Terry reward model. Depth: Use the preference experiment. Read outcome modeling to specify its label and pooling contract, not to add a process-reward implementation. The example's last-token index assumes right padding; do not copy it for left-padded inputs.
2. [Reward-model training and evaluation implementation](https://github.com/natolambert/rlhf-book/blob/1042143366d73ff654727e4d18a1d3a21209c3a3/code/reward_models/train_preference_rm.py) (RLHF Book Code - Reward Models and Direct Alignment) - `build_preference_dataset`, `collate_fn`, `PreferenceRewardModel.get_reward`, `evaluate_preference_rm` and the accumulation loop in `train_preference_rm`. Depth: Inspect rather than run the default full-backbone configuration. The final partial accumulation window uses a fixed divisor and is under-weighted; use accumulation 1 or correct the window weighting.
3. [Length shifts in reward learning](https://arxiv.org/abs/2310.03716v2) (A Long Way to Go: Investigating Length Correlations in RLHF (Singhal et al., 2023)) - arXiv:2310.03716v2, Sections 3.1 and 4.2: length-stratified analysis and interventions on reward modeling.

**Focus**

- Reuse the audited preference records, but split by prompt/conversation and near-duplicate group before expansion. Reserve distinct training, calibration and final evaluation prompts; freeze their manifests.
- Use the last real token's hidden state under a declared EOS and padding convention. Count empty, invalid and token-identical truncated pairs instead of silently losing them.
- Report pairwise accuracy, margins, probability NLL and Brier score. Fit any temperature only on calibration prompts and freeze it before final scoring. Report source/generator and response-length slices with counts.
- A preference reward predicts relative choice under a rubric. An outcome head predicts a specified correctness label with its own token or sequence supervision; swapping these targets changes the meaning of calibration.

**Reproduce:** Closed-book, reconstruct the path from two tokenized responses through their last real hidden states, one scalar head and stable pairwise loss. Add padding without changing the real tokens and require scores to agree within a declared dtype tolerance. Then repeat held-out scoring on a different generator or length slice without refitting either the reward head or its calibrator; record whether errors track correctness, length or style rather than assuming transfer.

**Traps**

- Using the last array position when it is padding, or using the count of real tokens as an index under left padding. Test both layouts or reject the unsupported one explicitly.
- Reading the companion evaluator as a calibration audit. It reports pair-averaged loss, strict accuracy, mean rewards and mean margin; you must add calibration and shift slices.
- Centering scores on each new policy's outputs. This changes the measurement scale and can conceal shift. Freeze calibration statistics and report raw scores too.

**Practice**

- [RLHF Book Chapter 5 Suggested Experiments: Train a Bradley-Terry reward model](https://rlhfbook.com/c/05-reward-models.html) - Suggested Experiments, item 1; adapt the linked preference reward-model implementation. Freeze the backbone and train only the head on at most 1,000 audited training pairs with context at most 256 and batch 1. Use your immutable small-decoder SFT checkpoint from the Adaptation and Distillation section, or its smaller CPU version, rather than the default model. Pin PyTorch 2.14.1 and, if using the companion loader, Transformers 5.19.0 and datasets 5.1.0. Keep separate calibration and held-out prompts; compare at least two fixed training seeds and save all attempts. The mini-project retains the shift, calibration and shortcut evidence.

**Stop when:** Your head passes padding and identical-pair tests, and its frozen held-out report separates ranking, calibration and generator/length shift with counts and raw records, including a negative or inconclusive slice.

<details>
<summary>Self-test</summary>

1. Can ranking accuracy stay unchanged while probability NLL worsens?
   - Yes. Enlarging correctly ordered but overconfident margins leaves order unchanged while increasing the cost of misranked or noisy comparisons. Evaluate probabilities, not only signs.
2. A frozen backbone fits the training pairs. What has not been established?
   - Held-out calibration, ranking under another policy, and behavior improvement after policy optimization. A reward-head fit alone establishes none of these.
3. Why use a separate calibration split?
   - Temperature or other calibration fitting is model selection. Using final evaluation labels for it leaks evaluation information into the scoring pipeline.

</details>

#### U5. Reward overoptimization and the KL-regularized objective with a reference policy

**About 4 h** · **Target:** Derive

Topics: Reward overoptimization, Goodhart effects and proxy regressions; Reference policies, KL-regularized RL objective and policy distance

A reference policy constrains how a learned proxy is exploited. The derivation gives a precise optimization target, but it does not turn a misspecified reward into a trustworthy measure of behavior.

**You can now**

- Derive the optimal policy of a fixed-reward, KL-regularized objective and state its support assumptions.
- Distinguish a sampled log ratio, a policy KL estimate and an offline preference margin.
- Explain why rising proxy reward can accompany worse independent behavior and why KL control is not a reward repair.

**Study**

1. [DPO: the KL-regularized optimum](https://arxiv.org/abs/2305.18290v3) (Direct Preference Optimization) - arXiv:2305.18290v3, Section 3 equation 3; Section 4 equation 4; Appendix A.1, Deriving the Optimum of the KL-Constrained Reward Maximization Objective.
2. [The RLHF Book: Chapters 14 and 15, Over-Optimization and Regularization](https://rlhfbook.com/c/14-over-optimization.html) (RLHF Book - Reward Models, Direct Alignment and Preferences) - Chapter 14, Managing Proxy Objectives and Quantitative Over-Optimization; Chapter 15, KL Divergence in RL Optimization and Reference Model to Generations, at https://rlhfbook.com/c/15-regularization.html. Depth: Use the KL definition from the Math Foundations unit on entropy, cross-entropy, KL divergence and mutual information. Skip Chapter 15's implementation example here; derive the distribution and sampling units yourself. The book's claims that direct alignment fixes a KL distance are too strong: a fixed coefficient does not fix realized KL.
3. [Scaling Laws for Reward Model Overoptimization](https://arxiv.org/abs/2210.10760v1) (Scaling Laws for Reward Model Overoptimization (Gao et al., 2022)) - arXiv:2210.10760v1, Sections 2 to 4, especially 2.1 Synthetic Data Setup, 3.5 RL vs BoN and 3.6 Effect of KL Penalty. Depth: Read the proxy/gold design and its curve shapes, not a universal threshold. The gold scorer is a larger model standing in for humans, and the horizontal optimization measure uses the square root of KL.

**Focus**

- For each prompt and fixed reward, maximize $`J(\pi)=\mathbb{E}_{y\sim\pi}[r(x,y)]-\beta\operatorname{KL}(\pi\|\pi_{\text{ref}})`$. Assume $`\beta>0`$, finite normalizer and support compatible with the reference.
- The solution is $`\pi^*(y\mid x)=\pi_{\text{ref}}(y\mid x)\exp(r(x,y)/\beta)/Z(x)`$. Certify it by rewriting $`J(\pi)=\beta\log Z(x)-\beta\operatorname{KL}(\pi\|\pi^*)`$, not only by taking derivatives.
- A sampled sequence log ratio can be negative. Its expectation under the current policy gives the declared KL only with the correct sampling distribution, response support and termination convention. An average over fixed preference pairs is not that expectation.
- Plot independent task quality beside proxy reward and policy drift. Different optimization procedures can exploit the same reward differently; the paper's best-of-many and RL results do not establish a universal safe KL budget.

**Reproduce:** Derive the optimum closed-book. For one prompt with three possible completions, reference probabilities $`(0.2,0.3,0.5)`$, rewards $`(\log 2,0,0)`$ and $`\beta=1`$, obtain $`Z=1.2`$, optimal probabilities $`(1/3,1/4,5/12)`$ and objective $`\log 1.2`$. Check normalization and the KL rewrite on CPU with PyTorch 2.14.1, `torch.float64`, natural logs and absolute tolerance $`10^{-12}`$. No model or random sampling is involved.

**Traps**

- Treating a single negative sampled log ratio as a negative KL divergence. Non-negativity applies to the population divergence, not each draw.
- Ignoring reference zeros. A policy putting mass where the reference is zero incurs infinite KL; finite offline observations do not certify useful coverage elsewhere.
- Claiming a higher penalty guarantees safety. It restrains movement for a fixed reward optimization problem, but does not validate the reward or prescribe the realized drift of a finite training run.

**Practice**

- [TensorTonic: Score a KL-Regularized Policy Batch](https://www.tensortonic.com/problems/cs336-l15-kl-regularized-policy-objective) - Implement `kl_regularized_policy_objective(policy_log_probs, reference_log_probs, rewards, response_mask, beta)`. Free. Public cases cover positive sampled divergence, a mixed masked batch and a fully masked response. Keep its sum-over-response-tokens convention and do not clamp negative sampled divergences. These cases check supplied scores, not whether the responses came from the correct policy.

**Stop when:** You certify the three-completion optimum, pass the named masked-batch examples, and can explain what additional independent evidence would expose reward overoptimization.

<details>
<summary>Self-test</summary>

1. Why does a prompt-only reward offset not change the optimum?
   - It multiplies every unnormalized probability for that prompt by the same factor, which cancels in normalization. The optimal objective value shifts, but the policy does not.
2. Why is the gold score in Gao et al. not direct human evidence?
   - A larger reward model supplies the synthetic labels and evaluation score. It permits controlled proxy/gold comparisons, but its errors and population coverage remain assumptions.
3. What is wrong with calling the fixed preference-set mean log ratio the deployed policy KL?
   - Its responses were not necessarily sampled from the current policy. Without the right sampling or weighting it measures a different distribution, even if the arithmetic is correct.

</details>

#### U6. The DPO derivation, $`\beta`$, margins and gradient pressure

**About 5 h** · **Target:** Derive + Implement

Topics: DPO derivation from policy and reference log-probability ratios; Beta, margins and gradient pressure on chosen and rejected responses

The reparameterization removes a reward-model training stage, not the assumptions behind preference learning. The gradient reveals which mislabeled or poorly covered comparisons can dominate a bounded run.

**You can now**

- Derive DPO by substituting the KL-optimal policy into a Bradley-Terry likelihood, retaining the partition term until it cancels.
- Implement stable DPO from four response log-probability tensors and verify its policy-input gradients.
- Explain how the adjusted margin, label noise and regularization coefficient affect update pressure without promising behavior gains.

**Study**

1. [DPO: derivation and gradient](https://arxiv.org/abs/2305.18290v3) (Direct Preference Optimization) - arXiv:2305.18290v3, Section 4 equations 4 to 7 and What does the DPO update do?; Appendix A.2 and A.4, deriving the Bradley-Terry objective and its gradient.
2. [The RLHF Book: Chapter 8, Direct-Alignment Algorithms](https://rlhfbook.com/c/08-direct-alignment.html) (RLHF Book - Reward Models, Direct Alignment and Preferences) - DPO Derivation: Deriving DPO Objectives for BT Models and Deriving the BT DPO Gradient; Implementation Details. Depth: Use the derivation and loss listing, not the claim that KL is static or that each update reaches the optimal policy. Finite-data, finite-step fitting need not recover the population optimum.
3. [Stable differential reference for the pair loss](https://github.com/natolambert/rlhf-book/blob/1042143366d73ff654727e4d18a1d3a21209c3a3/code/direct_alignment/loss.py) (RLHF Book Code - Reward Models and Direct Alignment) - `DPOLoss.forward`: chosen/rejected log ratios, stable logistic loss and detached logging metrics. Depth: Use the executable two-term smoothing expression if exploring soft labels. Ignore the nearby comment that combines a sum of log sigmoids into the log of their sum; that algebra is invalid.

**Focus**

- Let $`\ell_\theta(y)=\log\pi_\theta(y\mid x)`$, $`\ell_{\text{ref}}(y)=\log\pi_{\text{ref}}(y\mid x)`$, and $`m=[\ell_\theta(y_w)-\ell_\theta(y_l)]-[\ell_{\text{ref}}(y_w)-\ell_{\text{ref}}(y_l)]`$. The pair loss is $`L=-\log\sigma(\beta m)`$.
- Recover $`r(x,y)=\beta\log[\pi^*(y\mid x)/\pi_{\text{ref}}(y\mid x)]+\beta\log Z(x)`$. Only a shared prompt lets the partition term cancel in the pair likelihood. State the fixed-reference, Bradley-Terry and support assumptions.
- The scalar derivative is $`\partial L/\partial m=-\beta\sigma(-\beta m)`$. Its magnitude is greater for negative than positive margins at the same coefficient. A mislabeled hard pair can therefore exert substantial pressure.
- The reference is frozen. The coefficient controls both loss scaling and the population reward/KL trade-off; changing it is not merely changing the learning rate, nor a guarantee of monotonic realized KL.

**Reproduce:** Derive the substitution and margin gradient without notes. On CPU with PyTorch 2.14.1 and `torch.float64`, use policy chosen/rejected log probabilities -3 and -5, reference chosen/rejected -4 and -5, and $`\beta=0.4`$. Obtain $`m=1`$, loss 0.5130152523999526, and policy-input derivatives approximately -0.1605249359550192 and 0.1605249359550192. Match the pinned `DPOLoss` and `torch.autograd.gradcheck`; compare these values with absolute tolerance $`10^{-12}`$. Repeat stable loss evaluation at scaled logits -1000 and 1000, requiring finite losses and gradients rather than nonzero gradients at saturation.

**Traps**

- Subtracting the reference gap in the wrong direction. Write all four scores before simplifying the margin.
- Using detached implicit rewards to form the training loss. Detachment is for reporting only; the policy scores in the loss must retain their graph.
- Saying every parameter update raises the chosen probability and lowers the rejected probability. The scalar score derivatives have opposite signs, but shared model parameters and probability normalization can move both probabilities down.

**Practice**

- [TensorTonic: Implement the DPO Loss](https://www.tensortonic.com/problems/cs336-l15-direct-preference-optimization-loss) - Implement `direct_preference_optimization_loss(policy_chosen, policy_rejected, reference_chosen, reference_rejected, beta, label_smoothing)`. Free. Public cases cover a positive margin, mixed margin signs and a zero margin with smoothing; strict reward ties count as incorrect. They do not test gradients or text masking. Add the independent derivative check above before using a model.

**Stop when:** You derive the complete substitution, pass the public score examples and match the independent gradient oracle, including finite extreme-logit behavior.

<details>
<summary>Self-test</summary>

1. At identical policy and reference scores, is there no learning signal?
   - The adjusted margin is zero and loss is $`\log 2`$, but the margin derivative is $`-\beta/2`$. The parameter gradient need not vanish unless the two policy-score gradients cancel.
2. Does increasing the coefficient always increase gradient magnitude?
   - No. At a fixed positive margin, the coefficient multiplies a sigmoid weight that decreases as the scaled margin grows. At zero margin the magnitude is $`\beta/2`$; negative margins behave differently.
3. Does the derivation prove that an offline DPO run equals online RLHF in behavior?
   - No. It reparameterizes a preference model through the optimal policy of a specified KL-regularized reward problem. Coverage, model fit, optimization and preference-model assumptions still limit the learned policy.

</details>

#### U7. Response-only log probabilities, masks and reference-checkpoint identity

**About 5 h** · **Target:** Implement

Topics: Response-only sequence log probabilities, masks and length normalization; Reference-checkpoint identity, tokenizer compatibility and stale caches

The four scalars in a DPO loss are meaningful only if they score the same conditional events. A stale reference cache or a shifted completion mask silently defines a different experiment.

**You can now**

- Compute shifted response-only log probabilities with explicit prompt, padding, EOS and truncation rules.
- Bind reference scores to the exact checkpoint, tokenizer, template and scored token sequence.
- Demonstrate that reference mismatch changes policy gradients even when the policy scores stay fixed.

**Study**

1. [Shifted sequence-scoring reference](https://github.com/natolambert/rlhf-book/blob/1042143366d73ff654727e4d18a1d3a21209c3a3/code/direct_alignment/loss.py) (RLHF Book Code - Reward Models and Direct Alignment) - `compute_logprobs`: the logit, label and mask shifts; gathered token scores; `average_log_prob` branches. Depth: Pass a completion-and-padding mask, not merely the attention mask suggested by the helper's docstring. Its average branch is a different score convention, not ordinary summed DPO.
2. [CS336 Spring 2026 Assignment 5 supplement: model-to-loss contract](https://github.com/stanford-cs336/assignment5-alignment/blob/c2734a26308710949fe13226960a1e8cece94b7e/cs336_spring2026_assignment5_supplement_safety_rlhf.pdf) (CS336 Assignment 5 Supplement - Preference Data and DPO) - Section 6.3, Implementing the DPO Loss, Problem `dpo_loss`, printed p. 17: Alpaca template, appended EOS and `run_compute_per_instance_dpo_loss`. Depth: Use the public tiny-model test on CPU. Skip Section 6.4's two-device training recipe; the bounded comparison uses your own SFT checkpoint. Prompt cancellation requires the exact same tokenized prefix in both branches, not merely similar prompt text.
3. [TRL 1.15.0: preprocessing and frozen-reference configuration](https://huggingface.co/docs/trl/v1.15.0/en/dpo_trainer) (TRL DPO Trainer) - Expected dataset type and format; Preprocessing and tokenization; DPOTrainer `ref_model`; DPOConfig `precompute_ref_log_probs`, `sync_ref_model`, `disable_dropout` and loss types.

**Focus**

- Score each response token from its preceding context. Shift the labels and completion mask together with the causal prediction boundary. Prompt tokens condition the model but do not enter the response sum.
- Keep attention and loss masks distinct. Include EOS under one declared rule, exclude padding, and reject or separately count pairs whose distinguishing response is lost to truncation.
- Hash the frozen reference weights and adapter state, tokenizer revision, template, exact token IDs, masks, EOS/truncation rules and score convention into cache identity. A filename or model family is not sufficient.
- TRL 1.15.0 defaults to `loss_type=["sigmoid"]`, `beta=0.1` and summed completion scores. `sigmoid_norm` changes the aggregation. The trainer rejects a policy and reference that are the same object; keep reference synchronization off for this fixed-reference study.

**Reproduce:** On CPU with PyTorch 2.14.1 and `torch.float64`, use zero logits of shape `(1, 5, 3)`, token IDs `[[0, 1, 2, 0, 1]]` and unshifted completion mask `[[0, 0, 1, 1, 0]]`. Derive score $`-2\log 3`$; only logit positions 1 and 2 receive score gradients. Match `compute_logprobs` within absolute tolerance $`10^{-12}`$. Then hold the preceding unit's policy scores and coefficient fixed, changing only the reference chosen score from -4 to -2. Loss becomes 0.9130152523999526 and the chosen policy-input derivative becomes approximately -0.2394750640449808. The rejection score stays -5. Confirm the altered gradient and require the manifest to reject that cache mismatch.

**Traps**

- Tokenizing prompt and response independently without inspecting the join. Boundary tokenization can differ from tokenizing the formatted sequence; inspect actual IDs and the first scored token.
- Assuming equal initial policy/reference values imply zero parameter gradient. The reference must be fixed independently, not connected to the policy's autograd graph.
- Equating a mean token log probability with a sequence log probability. Changing sum to mean changes pair weighting and the objective, especially with unequal response lengths.

**Practice**

- [CS336 Assignment 5 supplement: `dpo_loss`](https://github.com/stanford-cs336/assignment5-alignment/blob/c2734a26308710949fe13226960a1e8cece94b7e/tests/test_dpo.py) - Section 6.3; connect `run_compute_per_instance_dpo_loss` and run `uv run pytest -k test_per_instance_dpo_loss`. The public test uses tiny policy/reference fixtures and a local word tokenizer, then compares one scalar loss to its expected value. It does not check gradients or every mask boundary. Add unequal response lengths, padding, prompt-boundary and stale-reference tests yourself. Use PyTorch 2.14.1 and Transformers 5.19.0 for your recorded implementation, and keep solutions private.

**Stop when:** Your scorer passes the public tiny-model scalar check and your independent mask and reference-mismatch gradient tests, while cached scores are accepted only under matching manifests.

<details>
<summary>Self-test</summary>

1. Which state changes invalidate a precomputed reference score?
   - Anything changing the reference conditional event or its probability: weights/adapters, tokenizer, template, token IDs, masking, EOS, truncation or aggregation. Recompute rather than mixing identities.
2. Does this one-pair reference mismatch reverse the chosen-score derivative?
   - No. With a positive coefficient its sign stays negative. The changed reference margin changes the gradient's weight; across shared model parameters and many pairs that can change the update direction.
3. How should you check a cached reference on a model batch?
   - Reload the exact frozen checkpoint in deterministic evaluation mode and rescore the same IDs and masks. Compare within a dtype-specific tolerance and verify the full manifest before accepting the cache.

</details>

#### U8. Preference-data audits and objective sign, gradient and invariance tests

**About 4 h** · **Target:** Implement

Topics: Provenance, duplicates, leakage, balance, agreement and slice audit; Preference-loss numerical, sign, gradient and invariance tests

A healthy training curve cannot distinguish a correct objective from a consistently reversed label pipeline. Preflight tests must catch failures before the preference route spends its training budget.

**You can now**

- Build an audit ledger for provenance, duplicate groups, split leakage, raw votes and presentation/length slices.
- Test objective signs, gradients, numerical stability and valid invariances against an independent oracle.
- Inject reversed labels, reference mismatch and mask/normalization errors and retain a failing regression for each.

**Study**

1. [CS336: pair inspection and the checked model-to-loss path](https://github.com/stanford-cs336/assignment5-alignment/blob/c2734a26308710949fe13226960a1e8cece94b7e/cs336_spring2026_assignment5_supplement_safety_rlhf.pdf) (CS336 Assignment 5 Supplement - Preference Data and DPO) - Sections 6.2 and 6.3, Problems `look_at_hh` and `dpo_loss`; revisit the raw records and the public scalar test, not the full training run.
2. [The RLHF Book: audit-sensitive collection and optimization](https://rlhfbook.com/c/11-preference-data.html) (RLHF Book - Reward Models, Direct Alignment and Preferences) - Chapter 11, Collecting Preference Data, Multiturn Data and Bias: Things to Watch Out For in Data Collection; Chapter 8, Implementation Details and Suggested Experiments item 4, Change the data before changing the loss, at https://rlhfbook.com/c/08-direct-alignment.html.
3. [TRL 1.15.0: logs and objective conventions](https://huggingface.co/docs/trl/v1.15.0/en/dpo_trainer) (TRL DPO Trainer) - Computing the loss, Loss Types and Logged metrics; DPOConfig `loss_type`, `label_smoothing` and `beta`. Depth: Use the default sigmoid branch as a differential reference, not the catalog as an assignment. Keep the explicit response-score oracle independent of trainer preprocessing.

**Focus**

- Audit both raw and model-visible data: prompt/candidate duplicates, source licenses and provenance, prompt-group leakage, label polarity, ties, annotator agreement, length/style balance, truncation and post-tokenization identical pairs. Save counts and reasons at every filter.
- Compare scratch loss and policy-input gradients against analytic values before comparing to library code. Then check an actual batch with the frozen reference and the same IDs and completion masks.
- Batch permutation and whole-batch duplication preserve a mean loss. Common chosen/rejected score offsets cancel within each model. These invariances do not justify changing one response, reference gap or length convention.
- Seed corrupted copies, never overwrite the clean manifest: swapped labels, duplicate leakage, non-response mask bits, sum-to-mean replacement and stale reference scores. Require the intended check to fail and then pass after repair.

**Reproduce:** Assemble a CPU preflight suite with PyTorch 2.14.1 and `torch.float64` from the previous units' loss, derivative, mask and reference-mismatch oracles. On the fixed pair with scaled margin $`z=0.4`$, swap chosen and rejected in both policy and reference scores. Verify $`L(-z)-L(z)=z`$ within absolute tolerance $`10^{-12}`$, and verify that gradients now pressure the opposite response identity. Also test identical tokenized responses through the same deterministic scorer: loss is $`\log 2`$ and the shared model-parameter gradient is zero. Preserve the failures from a single-sided swap and a stale cache as separate diagnoses.

**Traps**

- Calling label reversal an invariance of the loss. Swapping the two outcomes negates the logit; the loss generally changes. Batch permutation is an invariance, label polarity is not.
- Requiring zero gradients for independent equal-valued chosen/rejected score tensors. Their partial derivatives are opposite and nonzero; cancellation occurs through the shared model graph for identical responses.
- Claiming prompt decontamination from an exact-string check alone. State the normalization and duplicate-group rule, review matches and bound the claim; paraphrases may remain.

**Practice**

- The section mini-project covers this: the versioned preference audit and preflight failure campaign, including annotator-noise, swapped-label, mask, normalization and reference-mismatch regressions.

**Stop when:** Your clean manifest passes preflight, every seeded defect fails a named independent check, and the retained report distinguishes data failure from loss or reference failure.

<details>
<summary>Self-test</summary>

1. Why can initial loss fail to expose reversed labels?
   - With matching policy and reference, both label orientations have zero adjusted margin and loss $`\log 2`$. Check the response-identity gradient and the raw label provenance, not only the loss.
2. Which gradient should whole-batch duplication preserve?
   - For the same deterministic model and a mean reduction, the aggregated model-parameter gradient. Independent per-copy input-score gradients can each be smaller because there are more averaged entries.
3. Can the public DPO test certify this entire preflight?
   - No. It checks one scalar fixture. Data lineage, leakage, response boundaries, gradients and reference-cache identity require independent tests.

</details>

#### U9. External evaluation and the versioned sampling, labeling and optimization loop

**About 6 h** · **Target:** Measure

Topics: Independent capability, safety, calibration and diversity evaluation; Versioned sampling, labeling, optimization, evaluation and rollback loop

Preference accuracy is an internal diagnostic. The section's result is a bounded claim about a language model's external behavior, supported by controls that separate training from longer answers, sampling changes and judge preferences.

**You can now**

- Compare untouched SFT, chosen-only SFT and DPO under matched or explicitly disclosed training and generation budgets.
- Evaluate capability, safety, calibration and diversity on held-out prompts never used for preference training or selection.
- Version a sampling, labeling, optimization and rollback loop while retaining failed runs and inconclusive results.

**Study**

1. [DPO: evaluation contracts and judge validation](https://arxiv.org/abs/2305.18290v3) (Direct Preference Optimization) - arXiv:2305.18290v3, Section 6, Tasks, Evaluation and Methods; Sections 6.3, Generalization to a new input distribution, and 6.4, Validating GPT-4 judgments with human judgments. Depth: Read the controls and evaluator comparison. Paid judge calls and the paper's model sizes are not required; use your frozen local task scorer and blinded manual review.
2. [Tulu 3: preference-data and recipe ablations](https://arxiv.org/abs/2411.15124v5) (Tulu 3, Section 5 (Preference Finetuning)) - arXiv:2411.15124v5, Sections 5.2 to 5.4: Tülu 3 Preference Data (5.2.1, From Prompts to Preference Data), Key Findings of Data Ablations, and Preference Tuning Recipe and Analyses; Figure 7 and Table 18. Depth: Trace one data-source ablation and one objective comparison. Do not reproduce the model pool, proprietary annotation or distributed training. Its final recipe uses length-normalized DPO, not the original summed loss.
3. [CS336 supplement: after-training behavior checks](https://github.com/stanford-cs336/assignment5-alignment/blob/c2734a26308710949fe13226960a1e8cece94b7e/cs336_spring2026_assignment5_supplement_safety_rlhf.pdf) (CS336 Assignment 5 Supplement - Preference Data and DPO) - Section 6.4, Problem `dpo_training`, parts (b) to (d): preference, safety and capability comparison. Depth: Replace hosted judging with manual review and small local capability/safety subsets. In 6.4's preceding paragraph, raw chosen likelihood exceeding rejected likelihood is not implicit reward accuracy: use the reference-adjusted margin instead.

**Focus**

- Freeze the evaluator from the Language-Model Evaluation section, prompt groups, parser, decoding, output budget, tie/failure policy and selection rule before training. Final prompts and labels must not enter preference collection, calibration or checkpoint selection.
- Keep an untouched SFT control and a chosen-only SFT control trained on the same audited data. Match update-token or compute budgets where possible; disclose reference-scoring, labeling, candidate generation and any mismatch rather than calling equal steps equal compute.
- Report independent task correctness, harmful compliance and benign refusal separately, probability calibration on a defined labeled task, and diversity/repetition at matched sampling settings. Every preference win rate includes both response-length distributions, item counts, tie handling and prompt-group uncertainty.
- Use development-only interventions for label noise, $`\beta`$, data size, length/style controls and judge swaps. Archive failed/inconclusive runs, then freeze one candidate for untouched final evaluation and a clean-state repeat. A changed judge or rubric starts a new version of the loop.

**Reproduce:** Rebuild a report from a fixed synthetic six-prompt ledger, not its summary: candidate outcomes are three wins, two losses and one tie; candidate token lengths are `[20, 30, 40, 50, 60, 70]` and baseline lengths are `[30, 30, 30, 30, 30, 30]`. With ties counted as half-wins and all six prompts retained, obtain win rate $`7/12`$, candidate mean length 45 and baseline mean length 30. The token counts use one declared tokenizer; this arithmetic fixture is not model evidence. Explain why the result alone cannot establish a length-independent gain, then use the same raw-record accounting on your bounded study.

**Traps**

- Selecting a checkpoint or a rubric on the final held-out scores. That set becomes development data; reserve a new untouched set for the final claim.
- Dropping invalid generations or failed attempts from the denominator. Keep them under the predeclared scoring rule and report their counts.
- Calling a small positive win-rate difference a gain without uncertainty or length/style controls. A failed control or broad interval supports a narrower or inconclusive claim.

**Practice**

- [RLHF Book Chapter 8 Suggested Experiments: small DPO run and data intervention](https://rlhfbook.com/c/08-direct-alignment.html) - Suggested Experiments items 1 and 4: Train a small DPO run on UltraFeedback; Change the data before changing the loss. Adapt to your audited preference subset and immutable small-decoder SFT checkpoint from the Adaptation and Distillation section: at most 1,000 pairs, context at most 256, batch 1 and at most 100 updates per trained arm. Use your GPU or the smaller CPU decoder, with precomputed frozen reference scores if needed. Pin PyTorch 2.14.1; for a TRL implementation also pin TRL 1.15.0, Transformers 5.19.0 and datasets 5.1.0. Compare at least two fixed seeds, keep the objective unchanged for the noise intervention, and state the reduced-scale limits. The section mini-project retains the baselines, held-out behavior, length/style/judge controls and rollback record.

**Stop when:** A clean-state repeat reconstructs your selected comparison from manifests and raw held-out outputs, and your report states whether the gain survives length, style, judge and failure controls or remains inconclusive.

<details>
<summary>Self-test</summary>

1. Preference accuracy rose while held-out task accuracy fell. Which result decides the claim?
   - The external outcome and predeclared gates. Rising preference accuracy cannot override a capability or safety regression; preserve the negative result and diagnose the mechanism.
2. Why keep chosen-only SFT when you already have untouched SFT?
   - It tests whether gains come from extra exposure to the preferred responses rather than the contrastive objective. Account for its different token and reference-scoring cost.
3. What must be versioned to roll back a labeling round?
   - The generating and reference checkpoints, sampling config, prompt split, raw outputs/votes, rubric or judge, filters, training settings, evaluator and selected artifact. Roll back to a complete accepted manifest, not just a weight file.

</details>

#### U10. IPO, SimPO and ORPO, and constitution-conditioned AI feedback

**About 4 h** · **Target:** Explain

Topics: IPO, SimPO, ORPO and related direct-objective vocabulary; AI feedback and constitution-conditioned preference generation

This optional unit gives enough mechanism vocabulary to evaluate a proposed alternative, not a catalog to train. An objective change and an AI-labeling change are separate interventions and need separate controls.

**You can now**

- Contrast IPO, SimPO and ORPO by feedback contract, score normalization, reference dependence and optimization pressure.
- Separate constitution-conditioned comparison labeling from critique/revision instruction tuning.
- Specify one optional mechanism-isolating comparison without reusing its training judge as the final evaluator.

**Study**

1. [IPO: a finite squared-margin target](https://arxiv.org/abs/2310.12036v2) (A General Theoretical Paradigm to Understand Learning from Human Preferences (Azar et al., 2023)) - arXiv:2310.12036v2, Section 4.2, Weak Regularisation and Overfitting; Section 5.2, Sampled Loss for IPO, equation 17 and Algorithm 1. Depth: Read the failure case and sampled loss. Skip the full general-framework proof. The book's Chapter 8 variant bullet incorrectly associates IPO with a logit transform: IPO uses the identity transform; use this paper for the distinction.
2. [SimPO: normalized policy score without a reference](https://arxiv.org/abs/2405.14734v3) (SimPO: Simple Preference Optimization with a Reference-Free Reward (Meng et al., 2024)) - arXiv:2405.14734v3, Sections 2.2 and 2.3, equations 3 to 6: length-normalized reward and target reward margin. Depth: Stop after the objective and the discussion of drift without KL regularization. Length normalization does not by itself validate behavior or remove all length effects.
3. [ORPO: preference pressure inside an SFT objective](https://arxiv.org/abs/2403.07691v2) (ORPO: Monolithic Preference Optimization without Reference Model (Hong et al., 2024)) - arXiv:2403.07691v2, Sections 3 and 4, especially 4.1 Preliminaries and 4.2 Objective Function of ORPO. Depth: Stop before the training configurations. Note that its odds use the paper's length-normalized probability score, not the raw product of token probabilities.
4. [Constitutional AI: which principle generated the label?](https://arxiv.org/abs/2212.08073v1) (Constitutional AI: Harmlessness from AI Feedback) - arXiv:2212.08073v1, Figure 1; Sections 3.1 and 4.1, Method; Appendix C.2, Principles for RL-CAI. Depth: Trace the data transformations and one comparison principle, not the large-model training. Human helpfulness labels remain in the paper's mixed preference model; AI harmlessness labels do not mean human values disappeared.

**Focus**

- IPO's sampled objective regresses the reference-adjusted log-ratio margin toward $`(2\tau)^{-1}`$; its $`\tau`$ occupies DPO's $`\beta`$ regularization role. A squared finite target differs from logistic pressure that keeps rewarding larger margins on deterministic labels.
- SimPO uses $`\beta\log\pi_\theta(y\mid x)/|y|`$ as a reward and subtracts a target margin inside the logistic argument. It removes the reference and changes normalization and margin together; a comparison must isolate these changes rather than attribute everything to reference removal.
- ORPO combines chosen-response SFT loss with a weighted negative log-sigmoid of a chosen/rejected log-odds ratio. No reference model is required, but the SFT component and odds transformation must remain explicit in the contract.
- A constitution conditions label generation through the feedback model's interpretation of a principle. Store the exact principle, judge revision, order, prompt and output with each comparison; keep an external human-checked or executable anchor for correlated judge/policy errors.

**Reproduce:** Without notes, make a four-row contract table for DPO, IPO, SimPO and ORPO: feedback unit, score aggregation, reference, margin or target, and chosen-only term. Trace one Appendix C.2 constitutional principle through Section 4.1's comparison-label path, then contrast it with Section 3.1's critique/revision-to-SFT path. Mark what would change in your manifests and controls if only the labeling principle changed. No additional model training is needed for this explanation check.

**Traps**

- Treating TRL's `sigmoid_norm` as full SimPO. It changes length aggregation but retains reference-adjusted scores; SimPO also removes the reference and adds a margin.
- Comparing raw losses across objective families. Squared margins, logistic losses and SFT mixtures have different scales and optima; compare matched external behavior instead.
- Interpreting a principle as a proof of label correctness. The feedback model can misunderstand it, prefer its own style or follow a presentation artifact.

**Practice**

- The section mini-project covers this: the optional objective-contract comparison and a principle-conditioned label-provenance audit, without requiring a second full training sweep or a paid judge.

**Stop when:** You can explain the four contracts and the two constitutional data paths, and propose one controlled optional change with its independent evaluation and lineage consequences.

<details>
<summary>Self-test</summary>

1. What distinguishes IPO from simply stopping DPO earlier?
   - IPO changes the sampled loss to a squared target-margin fit. Early stopping changes the optimization trajectory of the logistic objective; it does not make the objectives identical.
2. Does removing the reference make an objective identical to chosen-only SFT?
   - No. SimPO and ORPO still compare chosen and rejected responses. Chosen-only SFT uses no rejected-response contrast.
3. Does constitution-conditioned AI feedback require DPO?
   - No. It is a labeling method. The original paper distills AI comparisons into a preference model and uses RL, while critique/revision examples support a separate supervised stage.

</details>

### Mini-project: Audited preferences with independent behavior and rollback evidence

**About 16 to 20 hours.** Extend `lmlab` in `pref/` with audited comparison data, a bounded reward head and a checked DPO path from the existing SFT checkpoint. Test whether preference optimization changes the study's behavior rather than merely its proxy, length or judge score, using your machine and no paid judge.

1. Version preference records in `pref/` with generator identities, source-group splits, raw votes, ties and adjudication. Pass TensorTonic canonical-pair cases; retain blinded order/identity/length/style audits and trace a principle-conditioned label's exact principle and judge identity, distinguishing comparison provenance from critique/revision data.
2. Implement Bradley-Terry likelihood and certify the KL-regularized optimum against independent algebra and TensorTonic policy-objective cases. Before training, retain repeated-vote calibration, offset/scale and separated-vote regressions; test reward-head pooling against last-real-token fixtures, padding changes, identical pairs and partial accumulation windows.
3. Derive DPO and implement shifted response-only scoring with explicit EOS, padding, empty and truncation rules. Match analytic loss and gradients, TensorTonic DPO cases, pinned RLHF Book scoring/loss code and CS336's tiny-model DPO test; preserve token evidence and reference-identity rejection tests.
4. Gate training on parameter/FLOP counts and versioned audits: annotator-noise copies, swapped labels, duplicate leakage, mask shifts, wrong normalization and reference mismatch must fail named independent checks. Retain before-and-after regressions; optionally specify an alternative objective contract without requiring another training sweep.
5. Train or reuse the section's bounded frozen-backbone reward head across seeds. Freeze calibration on separate prompts, then check held-out ranking and probability calibration under generator and length shifts against trusted labels; retain raw scores, shortcut probes, counts and negative or inconclusive evidence.
6. Compare untouched SFT, chosen-only SFT and DPO with a versioned training-label-noise intervention at matched training and inference budgets across seeds. Use the frozen `eval/` suite and untouched held-out labels; retain independent capability, safety, calibration and diversity outcomes beside margins, proxy rewards and policy drift.
7. Reproduce the selected comparison from clean state and rebuild `reports/` from raw `registry/` records. Check length/style and judge controls against blinded review; retain paired uncertainty, all candidate-generation, labeling, reference-scoring and failed-run costs, proxy-versus-behavior discrepancies, reduced-scale limits and an owned release or rollback decision.

**Deliverables**

- Versioned `pref/` data and label audit, scalar reward head, DPO scorer and objective preflight regressions.
- Immutable SFT, reference and preference checkpoints with raw votes, generations, calibration, shift, noise and budget records in `registry/`.
- Clean reproduction and independent behavior report with length/style/judge controls, negative evidence and rollback ownership.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [TensorTonic: Canonicalize Pairwise Preference Data](https://www.tensortonic.com/problems/cs336-l15-canonical-preference-pairs). Pass public ranking cases; add tie, duplicate, grouping and label-provenance checks.
- external-tests: [TensorTonic: Score a KL-Regularized Policy Batch](https://www.tensortonic.com/problems/cs336-l15-kl-regularized-policy-objective). Pass masked-score cases; independently certify the normalized optimum and state its support assumptions.
- external-tests: [TensorTonic: Implement the DPO Loss](https://www.tensortonic.com/problems/cs336-l15-direct-preference-optimization-loss). Pass public loss cases; add analytic gradients, extreme logits and response-identity swap tests.
- external-tests: [RLHF Book response scoring and DPOLoss at pinned commit](https://github.com/natolambert/rlhf-book/blob/1042143366d73ff654727e4d18a1d3a21209c3a3/code/direct_alignment/loss.py). Differential-test frozen-batch scores, loss and gradients with the same completion masks and summed-score convention.
- external-tests: [CS336 Assignment 5 supplement: tiny-model DPO test](https://github.com/stanford-cs336/assignment5-alignment/blob/c2734a26308710949fe13226960a1e8cece94b7e/tests/test_dpo.py). Keep course solutions private; the scalar test supplements rather than replaces your mask, gradient and reference regressions.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Label and reward integrity | Raw votes, adjudication, presentation audits and principle provenance survive conversion; independent likelihood and pooling oracles pass, and held-out calibration and shift reports retain untouched labels and shortcut evidence. | Offset, scale and separation tests distinguish identification failures from probability errors; disagreements remain traceable to source, rubric, annotator and generator without being erased by adjudication. |
| Objective preflight correctness | Analytic and pinned-reference loss/gradient tests validate shifted response scoring and DPO; each planted label, leakage, mask, normalization and reference defect fails a named check before training. | Equal-valued independent score inputs are distinguished from identical responses sharing model parameters, and gradient checks expose defects hidden by initial scalar loss equality. |
| Independent behavior decision | Matched multi-seed controls, noise intervention, length/style/judge checks and untouched capability/safety evaluation support a bounded verdict; clean reproduction rebuilds paired outcomes, costs, failed attempts and rollback evidence. | The report separates proxy fit from behavior, discloses residual budget mismatches and tests the strongest alternative explanation without requiring DPO to win. |

Feeds into: Audited preference data, reward calibration, frozen references, DPO checkpoints and independent behavior controls feed RL Post-training and Reasoning, safety release analysis and the capstone's versioned post-training comparison.

### Resource route

- **Primary - Book:** [RLHF Book - Reward Models, Direct Alignment and Preferences](https://rlhfbook.com/c/05-reward-models.html) - Read Chapter 5 (reward models), Chapter 8 (direct alignment), Chapters 10 and 11 (preferences and preference data) and Chapters 14 and 15 (over-optimization and regularization) at `rlhfbook.com/c/NN-slug.html`. Only Chapters 5 and 8 have Suggested Experiments; do those. Trace preference data through reward modeling or DPO and list each distribution and evaluator assumption before training.
- **Required - Paper:** [Direct Preference Optimization](https://arxiv.org/abs/2305.18290) - Read Section 4 and Appendix A: derive the objective from the KL-constrained reward formulation, implement it from policy and reference log probabilities summed over response tokens, and gradient-check $`\beta`$, sign, masking and identical-pair cases. TRL's `sigmoid_norm` variant normalizes by length, which the paper does not.
- **Required - Paper:** [Training Language Models to Follow Instructions with Human Feedback (Ouyang et al., 2022)](https://arxiv.org/abs/2203.02155) - Read Sections 1 to 3: demonstrations, comparisons, the reward model and PPO with a pretraining mix, then the human-preference results. The 1.3B-beats-175B headline is a preference win rate, not capability.
- **Required - Paper:** [Scaling Laws for Reward Model Overoptimization (Gao et al., 2022)](https://arxiv.org/abs/2210.10760) - Read Sections 2 to 4: a gold reward model stands in for humans, and gold score against optimization pressure takes different forms for best-of-n and RL. The lesson is the shape, not a universal KL threshold.
- **Required - Paper:** [A Long Way to Go: Investigating Length Correlations in RLHF (Singhal et al., 2023)](https://arxiv.org/abs/2310.03716) - Read Sections 2 to 5: reward correlates with length, PPO lengthens outputs, and a length-only reward reproduces much of the gain. Report length beside every preference result.
- **Support - Paper:** [Disentangling Length from Quality in Direct Preference Optimization (Park et al., 2024)](https://arxiv.org/abs/2403.19159) - Read Sections 2 and 3: add a length penalty to the reward and derive length-regularized DPO, then check its length-controlled results in Section 4.
- **Support - Paper:** [A General Theoretical Paradigm to Understand Learning from Human Preferences (Azar et al., 2023)](https://arxiv.org/abs/2310.12036) - Read Sections 3 to 5: why DPO can overfit deterministic preferences and how IPO's squared loss avoids it. Its tau is DPO's beta under another name.
- **Support - Paper:** [SimPO: Simple Preference Optimization with a Reference-Free Reward (Meng et al., 2024)](https://arxiv.org/abs/2405.14734) - Read Section 2 (length-normalized average log probability as the reward plus a target margin, with no reference model) and Sections 4.2 and 4.3 (the length-normalization and margin ablations). Without the reference there is no KL anchor, so watch for drift.
- **Support - Paper:** [ORPO: Monolithic Preference Optimization without Reference Model (Hong et al., 2024)](https://arxiv.org/abs/2403.07691) - Read Sections 3 and 4: an odds-ratio penalty added to the SFT loss in one stage. Merging the stages makes an SFT-versus-preference ablation harder, so evaluate them apart.
- **Support - Paper:** [KTO: Model Alignment as Prospect Theoretic Optimization (Ethayarajh et al., 2024)](https://arxiv.org/abs/2402.01306) - Read Section 3.2 (human-aware losses) and Section 4 (a loss for unpaired desirable and undesirable examples with a reference point). Unpaired data still needs label-noise and reference-drift checks.
- **Support - Paper:** [RewardBench: Evaluating Reward Models for Language Modeling (Lambert et al., 2024)](https://arxiv.org/abs/2403.13787) - Read Section 4 (the chat, chat-hard, safety and reasoning splits, detailed in Appendix F), Section 5 and Appendix H.2 (length bias). Pin the benchmark version; reward accuracy is not policy quality.
- **Support - Paper:** [RLAIF vs. RLHF: Scaling Reinforcement Learning from Human Feedback with AI Feedback (Lee et al., 2023)](https://arxiv.org/abs/2309.00267) - Read Sections 2 to 5: AI-labeled versus human-labeled preferences on summarization and dialogue, and direct RLAIF without a distilled reward model. The parity holds for their tasks and labelers.
- **Support - Paper:** [Tulu 3, Section 5 (Preference Finetuning)](https://arxiv.org/abs/2411.15124) - Read Sections 5.2 to 5.4: building on-policy preference data, the data ablations and the DPO recipe. Use the ablations as the model for your own one-variable comparison.
- **Required - Assignment:** [CS336 Assignment 5 Supplement - Preference Data and DPO](https://github.com/stanford-cs336/assignment5-alignment) - Do supplement Section 6: inspect the HH preference data (`look_at_hh`) and implement `dpo_loss` until its test passes. Run a bounded DPO comparison only after the baseline and evaluator are frozen, with a small open model in place of the Llama 3.1 8B B200 run.
- **Support - Implementation:** [RLHF Book Code - Reward Models and Direct Alignment](https://github.com/natolambert/rlhf-book/tree/1042143366d73ff654727e4d18a1d3a21209c3a3/code) - Run the preference reward model with a frozen backbone (only the head trains) and the DPO, IPO and length-normalized DPO configs with smaller models and contexts than the defaults. The final partial accumulation window is under-weighted, so fix or avoid it. Explain margins, accuracy and rewards rather than raw loss.
- **Support - Practice:** [TensorTonic - Preference Optimization Set](https://www.tensortonic.com/problems/cs336-l15-direct-preference-optimization-loss) - Solve Canonicalize Pairwise Preference Data (`cs336-l15-canonical-preference-pairs`), Score a KL-Regularized Policy Batch (`cs336-l15-kl-regularized-policy-objective`) and Implement the DPO Loss (`cs336-l15-direct-preference-optimization-loss`). The DPO problem takes sequence log probabilities, so add your own swapped-label, duplicate, length and reference-mismatch cases. Public test cases check the listed edge cases, not gradients or the hidden grader, so keep your own tests beside each solution. 
- **Support - Reference:** [TRL DPO Trainer](https://huggingface.co/docs/trl/dpo_trainer) - After the scratch loss passes, map dataset format, reference model, $`\beta`$ and loss variants into TRL 1.15.0: the default `loss_type` is `["sigmoid"]` with `beta=0.1`, log probabilities are summed over the completion, and the trainer refuses a policy that is the same object as the reference. Confirm the library loss matches your scratch objective on one frozen batch.
- **Optional - Lab:** [Modern LLM Notebook - RLHF Alignment](https://github.com/walkinglabs/modern-llm-notebook/tree/979eecf09669121167184ef925d8edbc089fc13e) - Use `notebooks-en/part2-training/19-rlhf-alignment.ipynb` as a compact end-to-end orientation. Do not substitute its overview for the RLHF Book derivations or the CS336 objective tests.
- **Reference - Implementation:** [Build a Large Language Model (From Scratch) - DPO Bonus Notebook](https://github.com/rasbt/LLMs-from-scratch/tree/main/ch07/04_preference-tuning-with-dpo) - Use `ch07/04_preference-tuning-with-dpo/` only as a gentle starter before the DPO paper and CS336 tests.
- **Support - Paper:** [Constitutional AI: Harmlessness from AI Feedback](https://arxiv.org/abs/2212.08073v1) - arXiv:2212.08073v1, Sections 3.1 and 4.1 and Appendix C.2: distinguish critique/revision data from constitution-conditioned comparison labels and trace the principle into label provenance. Read and audit the examples; no large-model RL reproduction is required.

### Exit checkpoint

Gradient-check the chosen preference objective, audit its data and policy versions, then show that its improvement over SFT survives external evaluation and controls for response length, style, judge bias, $`\beta`$ and reference mismatch.

<details>
<summary>Deliberately left for later</summary>

- A catalog of every DPO-family objective
- Large-scale human-feedback operations
- Treating reward or preference accuracy as the final capability metric

</details>

## LMR-8. RL Post-training and Reasoning

**Why:** Reasoning post-training combines policy learning, sampling and verification, so an apparent gain has several competing explanations. This stage separates learned capability from search, reward and evaluator effects.

### Learn this much

- [ ] Prompts, prefixes, tokens, trajectories and terminal events as a decision process _(Required)_
- [ ] Sequence, token, outcome and process rewards _(Required)_
- [ ] Score-function policy gradient for language trajectories _(Required)_
- [ ] Baselines, leave-one-out estimators and variance reduction _(Required)_
- [ ] Value functions and generalized advantage estimation vocabulary _(Required)_
- [ ] Importance ratios, PPO clipping and failure boundaries _(Required)_
- [ ] Group-normalized advantages and zero-variance groups _(Required)_
- [ ] Sequence versus token loss normalization and length pressure _(Required)_
- [ ] Reference KL, entropy, exploration and collapse diagnostics _(Required)_
- [ ] Actor, reference, reward model, verifier and value-model roles _(Required)_
- [ ] Immutable prompt, policy, reference, reward, RNG and trajectory metadata _(Required)_
- [ ] On-policy sampling, asynchronous policy lag and stale rollouts _(Required)_
- [ ] Off-policy importance weighting, clipping and support mismatch _(Required)_
- [ ] Rule-based verifiers, false acceptance and reward loopholes _(Required)_
- [ ] Reward hacking, format gaming, length bias and evaluator exploitation _(Required)_
- [ ] Reasoning traces, hidden reasoning, outcome and process feedback boundaries _(Required)_
- [ ] Best-of-N and self-consistency as selection methods _(Required)_
- [ ] Search, verifier-guided inference and test-time compute curves _(Required)_
- [ ] Learned capability versus sampling, search and answer-length gains _(Required)_
- [ ] Distilling rollout or search improvements into the policy _(Required)_
- [ ] Rejection fine-tuning, RLOO and neighboring estimators _(Optional)_
- [ ] Process reward models and step-level credit _(Optional)_
- [ ] Full RL convergence, trust-region and off-policy theory _(Depth)_
- [ ] Frontier-scale reasoning and long-horizon agent training _(Depth)_
- [ ] Distributed rollout scheduling and fault tolerance _(Later)_

### Study units

#### U1. Language generation as a decision process, and sequence, token, outcome and process rewards

**About 3 h** · **Target:** Explain

Topics: Prompts, prefixes, tokens, trajectories and terminal events as a decision process; Sequence, token, outcome and process rewards

An RL result is about a particular task and trajectory contract. Changing answer extraction or the stopping rule can change the measured gain without changing the model.

**You can now**

- Specify the prompt distribution, token actions, prefix transitions and stopping events for a verifiable language task.
- Distinguish reward timing from reward meaning, and record what the verifier actually observes.

**Study**

1. [CS336 Spring 2026 Assignment 5: language trajectories](https://github.com/stanford-cs336/assignment5-alignment/blob/c2734a26308710949fe13226960a1e8cece94b7e/cs336_spring2026_assignment5_alignment.pdf) (CS336 Assignment 5 - Alignment and Reasoning RL) - Sections 4.1.1 to 4.1.3, Language models as policies, Trajectories, and Rewards and return.
2. [RLHF Book Chapter 6: Reinforcement Learning](https://rlhfbook.com/c/06-policy-gradients#related-mdp-vs.-bandit-framing) (RLHF Book - Policy Gradients, Reasoning and Rejection Sampling) - Implementation, Related: MDP vs. Bandit Framing.
3. [RLHF Book Chapter 7: Reasoning and Inference-Time Scaling](https://rlhfbook.com/c/07-reasoning#the-role-of-rlvr) (RLHF Book - Policy Gradients, Reasoning and Rejection Sampling) - The Role of RLVR: math-answer extraction, code-test rewards and the verifier loop.

**Focus**

- The Reinforcement Learning unit on trajectory objectives and the likelihood-ratio identity supplies the estimator. For a single-turn task, the prompt is sampled externally; appending a generated token is the deterministic transition.
- Sequence versus token describes where reward attaches. Outcome versus process describes what it judges. A step reward can attach to the last token of a multi-token step.
- Record EOS, a stop string and a token-limit stop separately. A token limit does not imply a sampled EOS, and a multi-token stop string is not necessarily one action.
- Use one small task in `lmlab`, such as reversing short strings. Freeze train, validation and test prompt identities, the accepted output grammar and the independent exact-answer evaluator before collecting data.

**Reproduce:** Closed-book, write the trajectory contract for reversing `ab` to `ba`, with one character per token and a sampled EOS. List the three sampled actions and their prefixes. Put reward 1 only on the correct terminal answer and use $`\gamma=1`$: each action's reward-to-go is 1. Then place an additional process reward after the first character and show which returns change.

**Traps**

- Calling deterministic prefix transitions a deterministic policy. The next token is still sampled.
- Treating a correct final answer as proof that every intermediate step is correct. The verifier may inspect only the answer.
- Dropping malformed or truncated outputs. Keep their outcome classes and costs even when the declared loss excludes them.

**Practice**

- The section mini-project covers this: the versioned task, split, output grammar, terminal-event and reward-placement contract for the tiny RL study.

**Stop when:** Your task contract assigns a state, action mask, stopping reason and reward to a correct, incorrect, malformed and truncated response without ambiguity.

<details>
<summary>Self-test</summary>

1. Does broadcasting a terminal reward to every token create process supervision?
   - No. It assigns outcome credit through the estimator; no intermediate step has been checked.
2. When do the bandit and token views describe the same expected reward?
   - When they induce the same distribution over completed responses and use the same terminal reward and stopping contract, without changing length weighting or discounting.
3. What belongs in the state for a token action?
   - The prompt and all preceding generated tokens, plus any task state needed for the declared environment. The completed answer must not leak into an earlier prefix.

</details>

#### U2. The score-function gradient for language trajectories, baselines and variance

**About 4 h** · **Target:** Derive

Topics: Score-function policy gradient for language trajectories; Baselines, leave-one-out estimators and variance reduction

The earlier REINFORCE derivation becomes a research tool here: it supplies an oracle for the language loss, and exposes normalization changes that no longer estimate the raw-reward gradient.

**You can now**

- Derive the completion-only score-function gradient for a fixed prompt distribution and parameter-independent reward.
- Check baseline bias and variance by exact enumeration before trusting a language-model learning curve.
- Translate the estimator into a detached-reward loss with independently checked token masks.

**Study**

1. [CS336 Spring 2026 Assignment 5: gradient and baseline audit](https://github.com/stanford-cs336/assignment5-alignment/blob/c2734a26308710949fe13226960a1e8cece94b7e/cs336_spring2026_assignment5_alignment.pdf) (CS336 Assignment 5 - Alignment and Reasoning RL) - Sections 4.1.4 and 4.1.5, including `baseline_calcs`; Section 4.2.3, `compute_policy_gradient_loss_on_policy`. Depth: Use the earlier policy-gradient units for prerequisite repair only. Spend this pass on the language loss and the baseline counterexample.
2. [RLHF Book Chapter 6: Reinforcement Learning](https://rlhfbook.com/c/06-policy-gradients#deriving-the-policy-gradient) (RLHF Book - Policy Gradients, Reasoning and Rejection Sampling) - Deriving the Policy Gradient through REINFORCE Leave One Out (RLOO).

**Focus**

- For fixed prompts and rewards, $`\nabla_\theta J=\mathbb{E}[R(x,y)\sum_t\nabla_\theta\log\pi_\theta(y_t\mid x,y_{<t})]`$. Sum only sampled completion actions, including sampled EOS.
- Hold sampled IDs, rewards and baselines fixed during differentiation. Current selected log probabilities carry gradients; generated text need not be differentiable.
- An action-independent baseline preserves the expected score-function gradient, but need not reduce variance. The reward mean is not generally the variance-minimizing baseline.
- An inclusive group mean depends on the current completion. With independent siblings and no standard-deviation scaling, it shrinks the expected raw-reward gradient by $`(G-1)/G`$.

**Reproduce:** Derive `baseline_calcs` symbolically first, then check your expressions by enumeration on CPU. For a Bernoulli action with success probability $`p=0.8=\sigma(\theta)`$, reward equal to the action and logit score $`a-p`$, the single-sample estimator has mean 0.16. Its variance is 0.0064 with baseline 0, 0.0576 with baseline 0.8, and zero with baseline 0.2. Recover these values in `float64`; divide variance by the number of independent samples for a sample mean.

**Traps**

- Differentiating the sample-average reward directly. A detached discrete reward has no path through the sampled tokens; use the score-function loss.
- Replacing the sum of token log probabilities with a response mean. Variable lengths then change the estimator, not just its numerical scale.
- Calling all centering unbiased. Sibling dependence, inclusive means and random standard-deviation division require separate analysis.

**Practice**

- [CS336 Assignment 5: `baseline_calcs` and `compute_policy_gradient_loss_on_policy`](https://github.com/stanford-cs336/assignment5-alignment/blob/c2734a26308710949fe13226960a1e8cece94b7e/tests/test_grpo.py) - Section 4.1.5, `baseline_calcs` parts (a) to (c); Section 4.2.3 with `test_compute_policy_gradient_loss_on_policy`. The public test compares loss values with a snapshot; add your own selected-log-probability gradient and padding-invariance tests. Use public handouts and tests privately as study material; do not publish assignment solutions.

**Stop when:** Your baseline variance derivation agrees with exact enumeration, the on-policy loss snapshot passes, and your own test detects an included prompt token or a differentiated baseline.

<details>
<summary>Self-test</summary>

1. Why does subtracting a fixed prompt-only baseline preserve the expected gradient?
   - Conditioned on the prompt, the expected policy score is zero, since the derivative of total probability 1 is zero.
2. Does a lower variance of raw rewards guarantee a lower variance of the gradient?
   - No. Gradient variance also depends on policy scores and their correlation with rewards. The reproduce example gives a counterexample to using the mean-reward baseline.
3. What changes if the reward itself depends differentiably on policy parameters?
   - The derivative also has an expected reward-derivative term. The fixed-verifier derivation assumes that term is absent.

</details>

#### U3. Value functions, GAE and PPO clipping for language models

**About 4 h** · **Target:** Derive

Topics: Value functions and generalized advantage estimation vocabulary; Importance ratios, PPO clipping and failure boundaries

PPO adds a learned credit model and reuses trajectories. This unit audits those extra dependencies before deciding whether a critic is worth its cost for the small study.

**You can now**

- Derive prefix-value targets and GAE for a completed language trajectory with explicit terminal masks.
- Check both signs of the clipped surrogate and explain why clipping does not enforce a hard policy-distance bound.
- Separate actor advantages, critic targets and old-policy scores in a fixed-rollout audit.

**Study**

1. [RLHF Book Chapter 6: Reinforcement Learning](https://rlhfbook.com/c/06-policy-gradients#proximal-policy-optimization-ppo) (RLHF Book - Policy Gradients, Reasoning and Rejection Sampling) - Proximal Policy Optimization (PPO), Understanding the PPO Objective, Value Functions and PPO; Auxiliary Topics, Generalized Advantage Estimation (GAE). Depth: Read the token and prefix interpretation, not another general RL first pass. The prose calls clipping a bound on drift; it is only a clipped surrogate, not a hard bound on ratios or KL.
2. [CS336 Spring 2026 Assignment 5: token clipping](https://github.com/stanford-cs336/assignment5-alignment/blob/c2734a26308710949fe13226960a1e8cece94b7e/cs336_spring2026_assignment5_alignment.pdf) (CS336 Assignment 5 - Alignment and Reasoning RL) - Section 6.2.2, Clipping, and `compute_policy_gradient_loss_off_policy`.

**Focus**

- The Reinforcement Learning unit on n-step advantages and Generalized Advantage Estimation derived the estimator; here it runs over token prefixes. A prefix value predicts future reward before the next sampled token, not correctness after reading the answer.
- Use $`\delta_t=r_t+\gamma(1-d_t)V_{t+1}-V_t`$ and $`\hat A_t=\delta_t+\gamma\lambda(1-d_t)\hat A_{t+1}`$. Set terminal bootstrap to zero; decide separately whether a length-limit stop is terminal or censored.
- Freeze rollout-time values and advantages during reuse. Actor advantage normalization must not replace the unnormalized critic return target.
- The surrogate plateaus for positive advantages above the upper ratio limit and negative advantages below the lower limit. Other samples and shared parameters can still move those probabilities.

**Reproduce:** On CPU in PyTorch 2.14.1 `float64`, use a completed two-action response with rewards `[0., 1.]`, prefix values `[0.2, 0.6]`, zero terminal bootstrap, $`\gamma=1`$ and $`\lambda=0.5`$. Recover TD residuals `[0.4, 0.4]` and GAE `[0.6, 0.4]`. Separately use ratios `[0.7, 1.3, 0.7, 1.3]`, advantages `[1., 1., -1., -1.]` and clip width 0.2. The negative mean clipped surrogate is 0.05; its current-log-probability gradients are `[-0.175, 0., 0., 0.325]`, within floating-point tolerance.

**Traps**

- Clipping the ratio and multiplying without the pessimistic minimum. That loses the sign-dependent branches.
- Using final-answer information as the prefix baseline. It can depend on the action whose score it weights.
- Assuming GAE is needed for GRPO. Group estimators remove the learned critic; TRL 1.15.0 has no `PPOTrainer`.

**Practice**

- [CS336 Assignment 5: `compute_policy_gradient_loss_off_policy`](https://github.com/stanford-cs336/assignment5-alignment/blob/c2734a26308710949fe13226960a1e8cece94b7e/tests/test_grpo.py) - Section 6.2.2; `test_compute_policy_gradient_loss_off_policy` compares unclipped and clipped per-token loss snapshots. Add your own GAE boundary fixture and finite-difference checks away from clipping kinks. No critic training run is required; the mini-project can use the simpler group estimator. Do not publish solutions.

**Stop when:** The public clipping snapshot and your GAE boundary and sign-branch gradient tests pass, and you can explain a policy change beyond the clipping interval without calling it a contradiction.

<details>
<summary>Self-test</summary>

1. What happens to GAE at the final terminal action?
   - No future value or advantage is bootstrapped. The advantage is the terminal reward minus the prefix value.
2. A negative-advantage token has ratio 1.3 and clip width 0.2. Is its surrogate gradient zero?
   - No. The unclipped negative term is smaller, so it remains active and pushes the probability down.
3. Can every sampled token be on a flat branch while KL continues to grow?
   - Yes. The clipped objective does not impose a hard trust region. Other losses, shared parameters and optimizer state can still change the policy.

</details>

#### U4. Group-normalized advantages, zero-variance groups and sequence versus token normalization

**About 5 h** · **Target:** Derive + Implement

Topics: Group-normalized advantages and zero-variance groups; Sequence versus token loss normalization and length pressure

Two runs called GRPO can optimize different weighted objectives. Fixed-rollout comparisons separate this mechanism from changes in sampled answers or verifier quality.

**You can now**

- Implement group advantages with a declared standard-deviation convention and finite all-equal-group behavior.
- Derive how sequence, token and constant denominators weight unequal-length responses.
- Specify the exact GRPO variant used in the study and isolate one normalization ablation.

**Study**

1. [CS336 Spring 2026 Assignment 5: normalization choices](https://github.com/stanford-cs336/assignment5-alignment/blob/c2734a26308710949fe13226960a1e8cece94b7e/cs336_spring2026_assignment5_alignment.pdf) (CS336 Assignment 5 - Alignment and Reasoning RL) - Sections 4.1.6 and 4.1.7; Section 4.2.3 group normalization and aggregation problems; Section 5.1, Dr. GRPO.
2. [DeepSeekMath: original GRPO objective](https://arxiv.org/abs/2402.03300v3) (DeepSeekMath, Section 4 (Group Relative Policy Optimization) (Shao et al., 2024)) - arXiv:2402.03300v3, Sections 4.1.1 and 4.1.2, Equations 3 and 4 and outcome advantages. Depth: Read the objective, not the large-model training recipe. Its KL estimator is nonnegative, not strictly positive: it is zero when the sampled probability ratio is 1.
3. [TRL 1.15.0: explicit objective configuration](https://github.com/huggingface/trl/blob/v1.15.0/trl/trainer/grpo_config.py) (TRL GRPO Trainer) - `GRPOConfig`: `scale_rewards`, `loss_type`, `beta` and `use_bias_correction_kl` field documentation.

**Focus**

- The assignment uses sample standard deviation via `torch.std`; a population-standard-deviation implementation has different finite-group weights. Specify the stabilizer and reject singleton sample-standard-deviation groups.
- All-equal rewards yield zero outcome advantages with a finite denominator. They do not imply identical texts or zero KL gradient. Log all-correct and all-wrong groups separately.
- Original GRPO averages token losses within each response, then responses. Dr. GRPO removes response-length division and group-standard-deviation division. DAPO keeps group scaling and uses an active-token denominator; these choices are not interchangeable.
- TRL 1.15.0 defaults to `loss_type="dapo"`, `scale_rewards="group"` and `beta=0.0`. Set every relevant choice explicitly. Choosing `loss_type="grpo"` alone does not reproduce every paper detail or KL gradient.

**Reproduce:** On CPU with PyTorch 2.14.1 in `torch.float64`, normalize rewards `[2., 2., 0., 0.]` by centered reward divided by standard deviation plus `1e-6`. Sample-standard-deviation magnitudes are approximately 0.86602465; population magnitudes are approximately 0.99999900. Next reduce two response loss lists `[2.]` and `[0., 0., 0.]`: the sequence mean is 1, the active-token mean is 0.5, and total sum divided by a fixed constant 8 is 0.25. Verify gradients and padding invariance as well as values.

**Traps**

- Calling group scaling an unbiased raw-reward gradient. Its random denominator changes prompt weighting.
- Averaging microbatch token means equally when active token counts differ. Accumulate sums against one shared denominator to match the full-batch token mean.
- Filtering equal-reward groups without counting generation attempts. Filtering changes prompt exposure and still consumes the rollout budget.

**Practice**

- [CS336 Assignment 5: GRPO and Dr. GRPO normalization components](https://github.com/stanford-cs336/assignment5-alignment/blob/c2734a26308710949fe13226960a1e8cece94b7e/tests/test_grpo.py) - `test_compute_group_normalized_rewards_grpo`, `test_compute_group_normalized_rewards_drgrpo`, `test_aggregate_loss_across_microbatch_sequence` and `test_aggregate_loss_across_microbatch_constant`. These compare outputs against snapshots. Add equal groups, singleton rejection, unequal lengths and gradient tests yourself. The mini-project reuses the components in one live normalization ablation. Do not publish solutions.

**Stop when:** All four normalization snapshots and your edge-case and gradient tests pass, and a written objective states the mean, scale, mask, denominator and KL choices without relying on the name GRPO.

<details>
<summary>Self-test</summary>

1. Does zero scalar loss prove there is no policy gradient?
   - No. Centered contributions can cancel in value but have different derivatives. Test gradients explicitly.
2. Why can padding change a token-mean implementation accidentally?
   - Including padded positions in the denominator dilutes active gradients. Both numerator and denominator must use the action mask.
3. Is changing only the loss denominator a complete Dr. GRPO ablation?
   - No. Dr. GRPO also removes group-standard-deviation scaling. Isolate each change before combining them.

</details>

#### U5. Reference KL, entropy and collapse diagnostics, and actor, reference, reward and verifier roles

**About 4 h** · **Target:** Measure

Topics: Reference KL, entropy, exploration and collapse diagnostics; Actor, reference, reward model, verifier and value-model roles

Reward can rise while exploration disappears or the policy drifts toward a verifier shortcut. Role identities and independent diagnostics make those explanations testable.

**You can now**

- Separate current actor, rollout policy, frozen reference, reward model, verifier and critic responsibilities.
- Measure reference KL, token entropy, answer diversity and zero-signal groups without treating any one trace as a diagnosis.
- Check sampled KL estimates against an exact categorical oracle.

**Study**

1. [RLHF Book Chapters 6 and 15: roles and regularization](https://rlhfbook.com/c/15-regularization#kl-divergence-in-rl-optimization) (RLHF Book - Policy Gradients, Reasoning and Rejection Sampling) - Chapter 15, KL Divergence in RL Optimization through Implementation Example; Chapter 6, The Role of Reinforcement Learning in RLHF. Depth: Stop before Other Tools to Control Optimization. In the Implementation Example, `F.kl_div` receives log targets without `log_target=True`; do not copy that call. Use the exact oracle below instead.
2. [Build a Reasoning Model: entropy diagnostics](https://www.manning.com/books/build-a-reasoning-model-from-scratch) (Build a Reasoning Model (From Scratch), Chapters 4 to 7) - Chapter 7, Section 7.3.2, Entropy tracking, printed pp. 236 to 240. Depth: Use the calculation, not the illustrative entropy bands as universal collapse thresholds. Entropy depends on vocabulary, prefixes and sampling policy.
3. [TRL 1.15.0: reference loading and KL estimator](https://github.com/huggingface/trl/blob/v1.15.0/trl/trainer/grpo_trainer.py) (TRL GRPO Trainer) - Reference-model initialization at `self.beta == 0.0`; loss computation of `per_token_kl` and `use_bias_correction_kl`.

**Focus**

- The actor learns; the rollout snapshot generated the data; the reference defines drift. A learned reward model and a rule-based verifier are alternative feedback sources, not interchangeable evidence of correctness. A critic predicts future return.
- The Math Foundations unit on entropy and KL divergence supplies the definitions. State the direction as $`D_{\mathrm{KL}}(\pi_\theta\|\pi_{\text{ref}})`$. Token means and sequence sums have different length weighting.
- For current-policy samples with common support, let $`d=\log\pi_\theta-\log\pi_{\text{ref}}`$. Both $`d`$ and $`\exp(-d)+d-1`$ have the KL expectation. The latter is nonnegative per sample in exact arithmetic; an old-policy sample average is not automatically that expectation.
- Keep fixed diagnostic prefixes as well as rollout averages. Read entropy beside duplicate answers, length, invalid outputs, advantage spread and held-out correctness. A zero-variance reward group is not proof of entropy collapse.

**Reproduce:** On CPU with PyTorch 2.14.1, let `policy = torch.tensor([0.6, 0.4], dtype=torch.float64)` and `reference = torch.tensor([0.5, 0.5], dtype=torch.float64)`. Compute exact policy-to-reference KL, the policy-weighted log ratio and the policy-weighted k3 expression. All give approximately 0.02013551 nats. Policy entropy is approximately 0.67301167 nats. Cross-check with `torch.nn.functional.kl_div(reference.log(), policy.log(), reduction="sum", log_target=True)` within `1e-12` absolute tolerance.

**Traps**

- Using the reference in the PPO ratio denominator. Old-policy drift and reference drift are different quantities.
- Calling estimator-value agreement a proof of gradient agreement. Differentiating a fixed-old-sample KL surrogate requires its own check; TRL's ratio correction changes the gradient even at a ratio value of 1.
- Reading low KL as guaranteed safety or generalization. It only measures the declared distributions on the declared support and prefixes.

**Practice**

- The section mini-project covers this: role-bound reference scoring and KL, entropy, diversity, length and signal-coverage traces for the live study and preserved failure.

**Stop when:** Your categorical oracle agrees across all three KL calculations, and your study dashboard distinguishes reference drift, old-policy drift and loss of outcome signal.

<details>
<summary>Self-test</summary>

1. Can a sampled log-ratio KL estimate be negative?
   - Yes. Individual log ratios and finite-sample means can be negative even though the population KL is nonnegative.
2. Does setting TRL's KL coefficient to zero mean no reference needs recording?
   - The trainer need not load a reference for optimization, but the study still records the starting reference identity and can score it separately for diagnostics.
3. All rewards are equal but completions differ. What has disappeared?
   - The centered outcome signal, not necessarily exploration. A separate KL or entropy term may still produce gradients.

</details>

#### U6. Immutable rollout metadata, policy freshness, lag and off-policy importance weights

**About 5 h** · **Target:** Implement

Topics: Immutable prompt, policy, reference, reward, RNG and trajectory metadata; On-policy sampling, asynchronous policy lag and stale rollouts; Off-policy importance weighting, clipping and support mismatch

A loss can pass its arithmetic tests while training on the wrong distribution. The research artifact must preserve which policy actually produced each action, including failed and filtered work.

**You can now**

- Collect immutable language rollouts bound to prompt, sampler, policy, reference, verifier and RNG identities.
- Implement a bounded rollout-update-evaluation cycle and detect overwritten old log probabilities.
- Derive trajectory importance weights and explain what token clipping cannot correct.

**Study**

1. [CS336 Spring 2026 Assignment 5: live step and stale data](https://github.com/stanford-cs336/assignment5-alignment/blob/c2734a26308710949fe13226960a1e8cece94b7e/cs336_spring2026_assignment5_alignment.pdf) (CS336 Assignment 5 - Alignment and Reasoning RL) - Section 4.2.4, `grpo_train_step_standard_on_policy`; Sections 6.1 and 6.2.1, importance reweighting and token-level surrogates. Depth: Do not run the two-GPU vLLM recipe. Use the small synchronous substitute described below; read asynchronous execution as a source of lag, not infrastructure to build.
2. [RLHF Book code: rollout ownership](https://github.com/natolambert/rlhf-book/blob/1042143366d73ff654727e4d18a1d3a21209c3a3/code/policy_gradients/rollout.py) (RLHF Book Code - Policy Gradients and Rejection Sampling) - `RolloutEngine._generate_experience`: generation configuration, action mask, rewards, `log_probs_old`, `log_probs_ref` and `Experience` construction. Depth: Trace the data flow only. Add immutable version and outcome records yourself; the example's tensor buffer is not a complete experiment manifest.
3. [LLM Post-Training Laboratory: identity contract](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-3/llm-post-training-laboratory.md) (LLM Post-Training Laboratory - RL and Reasoning) - Architecture constraints; Milestone C; Milestone D stale-log-probability, ratio-direction and policy-lag injections.

**Focus**

- Bind token IDs, prompt split and template, policy and reference hashes, verifier version, sampling settings, RNG state, action masks, raw reward components and stopping reasons. Stored old scores must survive later parameter changes unchanged.
- Start the live study on your existing roughly 10M-parameter decoder and short string-reversal task, on CPU or your GPU. Use PyTorch 2.14.1, a character tokenizer, a small SFT initialization, groups of 4, at most 8 generated tokens and an initial 10-update budget. Keep the model config and starting checkpoint hash.
- Choose the assignment's one-update on-policy variant explicitly: inclusive group mean, sample standard deviation plus `1e-6`, response-mean loss, no KL optimization term. Keep a frozen reference for diagnostics. Use temperature 1 without probability truncation, disable dropout, and regenerate after each update.
- Collect, verify, update and externally evaluate fresh held-out outputs. Count prompts, attempts, generated and training tokens, verifier calls and failures separately. Later minibatches become stale after an optimizer step; asynchronous version lag is another mismatch.

**Reproduce:** Enumerate a two-token binary completion with independent tokens: behavior probabilities `[0.5, 0.5]`, current probabilities `[0.75, 0.25]` at both positions. For sequences `'00'`, `'01'`, `'10'`, `'11'`, trajectory weights are `[2.25, 0.75, 0.75, 0.25]`. Weighting the behavior probabilities by these recovers the current joint distribution. Implement this oracle, then inject an old-score overwrite into a collected batch and require the identity check to fail before an update.

**Traps**

- Recording raw-model scores after sampling through temperature or truncation. The actual behavior distribution includes those transformations; removed support cannot be restored by importance weights.
- Calling a token ratio exact trajectory correction. It leaves old prefix visitation in place; the full trajectory weight is a product of token ratios.
- Overwriting sampler scores with learner scores from a newer checkpoint. If scoring backends differ, retain both sets at the same old checkpoint under separate names.

**Practice**

- [CS336 Assignment 5: `grpo_train_step_standard_on_policy`](https://github.com/stanford-cs336/assignment5-alignment/blob/c2734a26308710949fe13226960a1e8cece94b7e/tests/test_grpo.py) - `test_grpo_train_step_standard_on_policy`: loss and updated-parameter snapshot with two accumulation microbatches and a final cleared-gradient assertion. Use the public fixture on CPU and keep solutions private. It tests a supplied-response update, not on-policy collection or generalization. The mini-project supplies the actual small rollout-update-evaluation cycle and immutable manifest.

**Stop when:** The train-step snapshot passes, the old-score overwrite is rejected, and one bounded live run records fresh rollouts, updates, reference diagnostics and independent held-out evaluation without losing failed attempts.

<details>
<summary>Self-test</summary>

1. Do importance weights recover actions given zero behavior probability?
   - No. Exact correction requires behavior support wherever the target distribution contributes.
2. Why are first-update ratios near 1 rather than necessarily bit-identical to 1?
   - Matching weights and distributions imply equality mathematically, but different kernels, precision or dropout can change computed scores. Test under a declared tolerance and fixed scoring mode.
3. Does clipping a huge importance weight preserve unbiasedness?
   - Generally no. It trades bias for reduced influence of extreme weights, and does not repair missing support or wrong metadata.

</details>

#### U7. Verifiable rewards, false acceptance and reward hacking

**About 5 h** · **Target:** Implement + Measure

Topics: Rule-based verifiers, false acceptance and reward loopholes; Reward hacking, format gaming, length bias and evaluator exploitation

A deterministic verifier can be consistently wrong. Optimizing it makes a small parsing loophole into a competing explanation for the entire RL result.

**You can now**

- Implement a versioned verifier contract with malformed-output and false-acceptance tests.
- Construct a deliberate reward exploit and measure proxy reward against an independent evaluator.
- Preserve the hacked or unstable run and a regression that distinguishes the failure from a genuine task gain.

**Study**

1. [CS336 Spring 2026 Assignment 5: grading contract](https://github.com/stanford-cs336/assignment5-alignment/blob/c2734a26308710949fe13226960a1e8cece94b7e/cs336_spring2026_assignment5_alignment.pdf) (CS336 Assignment 5 - Alignment and Reasoning RL) - Section 3.3, Grading function; Section 4.2.3, `compute_rollout_rewards`.
2. [RLHF Book Chapter 14: Over-Optimization](https://rlhfbook.com/c/14-over-optimization#managing-proxy-objectives) (RLHF Book - Policy Gradients, Reasoning and Rejection Sampling) - Opening reward-overoptimization distinction and Qualitative Over-Optimization, Managing Proxy Objectives.
3. [DeepSeek-R1: rule-based feedback](https://arxiv.org/abs/2501.12948v2) (DeepSeek-R1 Technical Report) - arXiv:2501.12948v2, Section 2.2, Reward Design. Depth: Read the accuracy and format reward split. Rule-based feedback avoids a learned scorer but does not prove immunity to parser errors or test exploitation.

**Focus**

- The Language Model Evaluation unit on verifiers and false-acceptance tests supplies the test design. Separate parsing, format compliance and semantic correctness; freeze the training verifier and independent evaluator before optimization.
- Test empty output, duplicated answer delimiters, extra trailing content, embedded target strings, invalid syntax and overlong responses. State whether ambiguity fails closed rather than silently choosing a favorable answer.
- For the reversal study, contrast strict whole-answer equality with a deliberately weak substring reward. Keep both verdicts on the same outputs, including correct-answer lists embedded in wrong text.
- Run the weak-reward ablation under the same starting checkpoint and generation budget. Preserve outputs and policy identities even if exploitation does not emerge naturally; a planted accepted exploit is still a verifier regression, not evidence that training discovered it.

**Reproduce:** On CPU, define the toy arithmetic target as the string `"4"`. The deliberately flawed check `"4" in response` accepts `"14"`, while strict whole-string equality rejects it. Reproduce that disagreement and its string-reversal analogue. Add a correct output, an empty output and an output containing several candidate answers. Keep the flawed verdicts as evidence, then require the strict evaluator to reject the planted false acceptance.

**Traps**

- Using the same parser implementation for training reward and independent evaluation. Shared bugs can make the two metrics agree falsely.
- Treating a verifier timeout as a wrong answer without recording the error. Missing evidence, invalid syntax and semantic failure need distinct outcomes.
- Repairing the verifier and deleting the old run. Preserve its version and outputs; rescoring is a separate analysis, not the original reward trace.

**Practice**

- [CS336 Assignment 5: `compute_rollout_rewards`](https://github.com/stanford-cs336/assignment5-alignment/blob/c2734a26308710949fe13226960a1e8cece94b7e/tests/test_grpo.py) - `test_compute_rollout_rewards` compares the returned raw-reward tensor against a snapshot. This is not a verifier-soundness test and does not validate your metadata. The mini-project adds the strict-versus-substring exploit campaign, component verdicts and preserved weak-reward run. Do not publish assignment solutions.

**Stop when:** A planted false acceptance is reproduced and rejected by an independent evaluator, and the preserved ablation records whether the policy exploited it, failed to learn or became unstable.

<details>
<summary>Self-test</summary>

1. Can held-out prompts expose a parser bug shared by training and evaluation?
   - Not reliably. The same bug may accept the same exploit on unseen prompts. Use an independent evaluator and adversarial outputs.
2. What would support a claim that RL learned to exploit the verifier?
   - Fresh policy outputs increasingly receive flawed reward while failing independent checks, with fixed scoring versions, budgets and a matched starting-policy control. A hand-written exploit alone does not show learned exploitation.
3. Does passing public code tests prove program correctness?
   - No. It establishes behavior only on those cases. Hidden tests and specification-based checks can reveal hardcoded or incomplete solutions.

</details>

#### U8. Reasoning traces, outcome and process feedback and process reward models

**About 4 h** · **Target:** Explain

Topics: Reasoning traces, hidden reasoning, outcome and process feedback boundaries; Process reward models and step-level credit

A correct final answer can hide an invalid intermediate step. Process supervision offers a different measurement, but its labels and aggregation introduce new assumptions.

**You can now**

- Distinguish outcome labels, step labels and token likelihoods as supervision signals.
- Specify step boundaries, ambiguity handling and first-error supervision for a process verifier.
- Explain why better process-based selection does not establish improved generator weights or faithful reasoning.

**Study**

1. [Let's Verify Step by Step: what is supervised](https://arxiv.org/abs/2305.20050v1) (Let's Verify Step by Step (Lightman et al., 2023)) - Sections 2.1 and 2.3 to 2.6: Scope, Generator, Data Collection, outcome-supervised and process-supervised reward models; Figure 2. Depth: Stop before the large-scale experiments. Section 2.1 fixes the generator and evaluates best-of-N selection, not generator RL. No PRM training run is required.

**Focus**

- Separate the generator from the reward model. Outcome supervision labels a completed solution; process supervision labels steps under an explicit segmentation rule. Neither automatically reveals the generator's internal computation.
- The paper uses newline-delimited steps with positive, negative and neutral labels. It supervises only through the first incorrect step. Missing labels after that point are not negative labels.
- The paper multiplies step correctness probabilities to rank solutions. This is a scoring rule, not proof that independently calibrated step events yield a calibrated probability of whole-solution correctness.
- Reuse the reversal study's held-out outputs for a small prefix audit: mark the first character inconsistent with the target and keep segmentation fixed. This deterministic audit illustrates process feedback, not a learned PRM or human reasoning judgment.

**Reproduce:** On CPU with Python 3.13, compare two synthetic process-score lists, `[0.9, 0.9]` and `[0.8]`. Their products are 0.81 and 0.8, so the first ranks higher. Split its second step into two steps each scored 0.9; its product becomes 0.729 and the ranking reverses. Reproduce the same products using sums of logarithms, then explain why a changed segmentation invalidates a direct score comparison.

**Traps**

- Calling a convincing trace faithful. A trace can be useful for verification without reporting the mechanism that produced the answer.
- Comparing outcome and process models with different label budgets and claiming the entire gap comes from supervision type. The paper itself distinguishes its large-scale and controlled small-scale regimes.
- Assuming more steps always help a product score. Additional factors below 1 reduce the product, so verbosity and segmentation can change rankings.

**Practice**

- The section mini-project covers this: audit first-error positions on a small fixed set of reversal outputs and keep a segmentation-sensitive process-score fixture beside outcome verdicts. No learned PRM is required.

**Stop when:** Your audit separates final correctness from first-error position, and you can reproduce the segmentation-induced ranking reversal without claiming a generator improvement.

<details>
<summary>Self-test</summary>

1. Does a correct final answer imply all steps are valid?
   - No. Errors can cancel, or a correct answer can be appended to an invalid derivation.
2. What changes in the paper's best-of-N evaluation?
   - The selected response changes with the reward model. The generator used to sample candidates stays fixed.
3. What must accompany a neutral step label?
   - A declared ambiguity policy for training and scoring. Neutral is not silently equivalent to correct or incorrect.

</details>

#### U9. Best-of-N, self-consistency, search and test-time compute curves

**About 4 h** · **Target:** Measure

Topics: Best-of-N and self-consistency as selection methods; Search, verifier-guided inference and test-time compute curves

More attempts can improve reported accuracy with no weight update. Selection quality and compute accounting decide whether that improvement is usable.

**You can now**

- Separate oracle coverage, verifier-selected accuracy and answer-vote accuracy.
- Compare parallel sampling, revision and process-guided search under declared generation and scoring budgets.
- Produce a no-update sampling curve with explicit extraction, tie and invalid-output rules.

**Study**

1. [Self-Consistency: aggregate answers, not traces](https://arxiv.org/abs/2203.11171v4) (Self-Consistency Improves Chain of Thought Reasoning in Language Models (Wang et al., 2023)) - Section 2, Self-Consistency over Diverse Reasoning Paths; Figure 1 and Table 1. Depth: Use the unweighted answer vote for the study. Do not add probability-weighted voting or reproduce the benchmark suite.
2. [Test-time compute: proposer, verifier and allocation](https://arxiv.org/abs/2408.03314v1) (Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters (Snell et al., 2024) with Large Language Monkeys (Brown et al., 2024)) - Sections 2, 3.1 and 3.2; Section 5.2, Search Methods Against a PRM; Figure 2. Depth: Read search and revision conceptually. The live study only needs short independent samples. Section 3.2 omits difficulty-estimation cost from its reported accounting; disclose and count any such cost in your own curves.
3. [Reasoning coverage: pass-at-k estimator](https://arxiv.org/abs/2504.13837v5) (Does Reinforcement Learning Really Incentivize Reasoning Capacity in LLMs Beyond the Base Model? (Yue et al., 2025)) - Section 2.2, Metrics for LLM Reasoning Capacity Boundary; Appendix A.2, Low-Variance pass@k Estimation.

**Focus**

- Best-of-N ranks candidates with an available scorer. Self-consistency votes over extracted answers. Oracle pass-at-k asks whether any candidate is correct; it does not supply a deployable way to choose that candidate.
- For independent identically distributed samples, estimate pass-at-k from the total sample count and correct count using the combinatorial estimator in Appendix A.2. Do not apply it to correlated tree nodes or sequential revisions as if they were independent completions.
- Reuse each frozen candidate pool for random choice, answer voting and verifier selection. Declare tie breaking and whether invalid outputs abstain or fail. Record candidate coverage beside selected correctness.
- Plot budgets of 1, 2 and 4 short samples on the same held-out prompts. Count all generated tokens, scoring calls, revision context and any difficulty estimation; matching sample counts alone does not match compute.

**Reproduce:** On CPU with Python 3.13, enumerate all pairs of indices from 8 candidate outputs, exactly 2 of which are correct. Thirteen of the 28 pairs contain a correct output, giving pass-at-2 of approximately 0.46428571. Check this against `1 - math.comb(6, 2) / math.comb(8, 2)`. Then give a scorer that ranks both correct outputs below an incorrect output: oracle coverage stays unchanged while top-ranked accuracy can be zero.

**Traps**

- Voting over full text instead of normalized answers. Different valid traces may support the same answer.
- Using the held-out correct answer to choose a candidate and calling it best-of-N deployment accuracy. That is oracle coverage.
- Tuning compute allocation on the evaluation answers. Select the strategy on validation data and freeze it before the final comparison.

**Practice**

- The section mini-project covers this: a frozen-policy reversal sampling curve with random, answer-vote and verifier-selected outputs, oracle coverage and complete token and verifier-call accounting.

**Stop when:** The enumeration matches the estimator, and your no-update curve reports selected accuracy separately from oracle coverage at each declared budget.

<details>
<summary>Self-test</summary>

1. Can adding candidates hurt best-of-N selected accuracy?
   - Yes. A flawed scorer can prefer a new incorrect candidate even though oracle coverage cannot decrease for a nested candidate set.
2. Is the most common answer necessarily correct?
   - No. Samples can share the same systematic error. Voting measures agreement, not independent verification.
3. Why can two four-sample runs have different costs?
   - Lengths, scoring models, search expansions and reused context can differ. Report token and scoring budgets as well as sample counts.

</details>

#### U10. Learned capability versus sampling gains, and distilling search into the policy

**About 4 h** · **Target:** Measure

Topics: Learned capability versus sampling, search and answer-length gains; Distilling rollout or search improvements into the policy

A higher single-sample score can reflect useful weight changes without proving new reasoning support. Distillation adds another source of learning signal that must be separated from extra search.

**You can now**

- Compare updated and frozen policies at matched decoding, prompt and evaluation budgets.
- Distinguish evidence of changed sampling efficiency from claims about new reasoning capability.
- Specify offline search distillation and student-prefix distillation with explicit teacher, prefix and loss identities.

**Study**

1. [Reasoning capacity: control matrix and limits](https://arxiv.org/abs/2504.13837v5) (Does Reinforcement Learning Really Incentivize Reasoning Capacity in LLMs Beyond the Base Model? (Yue et al., 2025)) - Section 2.2; Section 3 opening Evaluation Protocol and Section 3.1, RLVR for Mathematical Reasoning. Depth: Use the matched-model comparisons as an experimental question, not the paper's broad capacity conclusion as a theorem. Finite sampling cannot establish absent support.
2. [DeepSeek-R1: distillation after reasoning training](https://arxiv.org/abs/2501.12948v2) (DeepSeek-R1 Technical Report) - Appendix F, DeepSeek-R1 Distillation, opening paragraphs; Appendix B.4.3, Hyper-Parameters of Distillation. Depth: Distinguish training on teacher-generated responses from student-prefix distribution matching. No large teacher run is required.
3. [On-policy distillation: prefix source and teacher signal](https://github.com/walkinglabs/modern-llm-notebook/blob/979eecf09669121167184ef925d8edbc089fc13e/notebooks-en/part4-frontiers/31-opd.ipynb) (Modern LLM Notebook - Reasoning and On-Policy Distillation) - Headings 2, Comparing Four Training Methods; 4, OPD's Solution; 7, Three Signal Granularity Levels; 8, KL Estimators; 9, Complete OPD Training Loop. Depth: Read as a simulation, not a working trainer: `simulate_opd_training` reports losses without updating a model. Skip Exercises 1 to 3: their feedback conflates prompts with generated prefixes, overstates mode behavior and treats negative KL estimates as automatic penalty failure. Prefix source does not determine KL direction.

**Focus**

- Compare the same SFT starting checkpoint with its RL descendant, the frozen no-update sampler and filtered SFT. Hold prompt templates, tokenizer, answer extraction, temperature and length limits fixed; tune only on validation data.
- Report single-sample correctness, selected correctness and pass-at-k curves under sample-matched and token-budget-matched views. Keep training, teacher scoring and inference cost separate. Prompt-level paired uncertainty matters more than a tiny point difference.
- A finite-sample zero is not zero probability. Better held-out single-sample accuracy supports a changed useful distribution, not proof of a new algorithm, faithful trace or a universal capacity ceiling.
- Offline search distillation fits selected teacher trajectories. Student-prefix distillation queries a frozen teacher at prefixes the student actually generated. Declare KL direction, support, temperature, masks and regeneration schedule independently of prefix source; truncated teacher probabilities define a different target.

**Reproduce:** On CPU with PyTorch 2.14.1 and float64, use trainable student logits `[0.0, 0.0]` and frozen teacher probabilities `[0.8, 0.2]` at one fixed student-generated prefix. Compute teacher-to-student full-vocabulary KL. Its value is approximately 0.19274476 nats and its gradient with respect to the student logits is `[-0.3, 0.3]`. Cross-check the gradient against teacher cross-entropy and a central finite difference. This is a fixed-prefix local update, not the total derivative through a sampled trajectory distribution.

**Traps**

- Giving RL more evaluation samples and attributing the entire gain to learning. Evaluate both checkpoints under the same decoder and budgets.
- Calling a forward KL on student prefixes impossible. Prefix visitation and next-token divergence are separate design choices.
- Treating a printed simulated loss as learning. Require trainable parameters, a checked gradient, an optimizer update and fresh evaluation to claim a trained student.

**Practice**

- The section mini-project covers this: compare frozen SFT, RL and filtered-SFT reversal checkpoints with the same evaluator and sampling curves; keep the full-vocabulary distillation gradient fixture as the teacher-signal audit, not a required extra teacher-training run.

**Stop when:** Your gradient oracle passes, and your comparison separates weight updates from selection, discloses training and inference budgets, and states what the small study cannot establish.

<details>
<summary>Self-test</summary>

1. RL improves single-sample accuracy but lowers large-budget coverage. Is that contradictory?
   - No. Probability can concentrate on more reliably correct outputs while reducing observed diversity across solvable prompts. Report both measurements.
2. Must student-prefix distillation use reverse KL?
   - No. The prefix source and the token-distribution loss are independent choices. Full-vocabulary teacher-to-student KL is valid at a student-generated prefix.
3. What would show search has been usefully distilled?
   - The updated student improves fresh held-out performance without the search at inference, against the same initial student and a matched-data control. Include the search and training cost rather than claiming a free gain.

</details>

#### U11. Rejection fine-tuning, RLOO and neighboring estimators

**About 3 h** · **Target:** Implement

Topics: Rejection fine-tuning, RLOO and neighboring estimators

Simple controls can explain a result attributed to a complex RL recipe. Baseline dependence and data reuse matter more than the estimator's name.

**You can now**

- Implement leave-one-out advantages and verify their relation to inclusive group centering.
- Build a filtered-SFT control with explicit acceptance, retention and normalization rules.
- Compare estimator assumptions without treating every newer named loss as a required experiment.

**Study**

1. [CS336 Spring 2026 Assignment 5: rejection fine-tuning](https://github.com/stanford-cs336/assignment5-alignment/blob/c2734a26308710949fe13226960a1e8cece94b7e/cs336_spring2026_assignment5_alignment.pdf) (CS336 Assignment 5 - Alignment and Reasoning RL) - Section 5.2, Rejection fine tuning; Equations 34 to 36 and `think_about_rft`. Depth: Stop before Section 5.3, MaxRL. Compare gradient estimators with detached samples; do not assume the inclusive group baseline has the same expectation as raw REINFORCE.
2. [RLHF Book code: leave-one-out implementation](https://github.com/natolambert/rlhf-book/blob/1042143366d73ff654727e4d18a1d3a21209c3a3/code/policy_gradients/utils.py) (RLHF Book Code - Policy Gradients and Rejection Sampling) - `compute_loo_advantages` and `compute_nonstandardized_advantages`. Depth: The first tensor axis is the rollout group. Add an explicit error for groups smaller than 2; the source formula alone does not guard that case.
3. [RLHF Book code: selection controls](https://github.com/natolambert/rlhf-book/blob/1042143366d73ff654727e4d18a1d3a21209c3a3/code/rejection_sampling/selection.py) (RLHF Book Code - Policy Gradients and Rejection Sampling) - `select_top_per_prompt`, `select_random_per_prompt` and `_chapter_worked_example`. Depth: Read the matched per-prompt selection controls. Top-ranked is not necessarily correct; add a strict correctness threshold for binary-reward RFT. Do not launch the default large reward model.

**Focus**

- For independent same-prompt samples, use $`A_i=R_i-\frac{1}{G-1}\sum_{j\ne i}R_j=\frac{G}{G-1}(R_i-\bar R)`$. Detach rewards and baselines. The leave-one-out baseline is independent of the current sampled action conditional on the prompt; the inclusive mean is not.
- With identical sequence-sum scores, fixed normalization and no extra scaling, inclusive group centering has expected gradient $`(G-1)/G`$ times raw REINFORCE. Leave-one-out removes that factor. Reward standardization, response-length weighting and clipping break this simple equivalence.
- Fresh on-policy binary reward weighting with fixed normalization is a REINFORCE estimator. Repeated likelihood training on a fixed retained set is filtered SFT, not a fresh on-policy update. Normalizing by a random accepted count changes the estimator.
- For the tiny reversal control, reuse a versioned starting-policy candidate pool, retain strict-correct outputs and fit with response-only cross-entropy. Record empty groups, retained counts, duplicates, training tokens and optimizer steps. Compare a matched-size random-per-prompt refit where data permit; disclose prompt or token imbalance.

**Reproduce:** On CPU with PyTorch 2.14.1 and float64, rewards `[0, 0, 3]` have inclusive centered values `[-1, -1, 2]` and leave-one-out values `[-1.5, -1.5, 3]`. Verify the explicit other-sample means against the scaled centered formula, then test equal rewards and reject a singleton group. Enumerate two independent Bernoulli actions with success probability 0.5 and reward equal to the action: raw REINFORCE and leave-one-out have expected logit gradient 0.25, while inclusive centering gives 0.125, using the same group-mean reduction.

**Traps**

- Dividing by group standard deviation and still calling it the unscaled leave-one-out estimator. That changes prompt weighting.
- Keeping one top-ranked output even when all candidates fail. That is ranking-based self-training, not correct-only RFT.
- Calling accepted-data count the rollout budget. Rejected generations and scoring work still cost compute and can expose different task coverage.

**Practice**

- [CS336 Assignment 5: Think about RFT](https://github.com/stanford-cs336/assignment5-alignment/blob/c2734a26308710949fe13226960a1e8cece94b7e/cs336_spring2026_assignment5_alignment.pdf) - Section 5.2, `think_about_rft`, 2 points. Write the comparison privately and check it with the two-action enumeration. This is a discussion exercise, not an autograded guarantee of unbiasedness. The mini-project supplies the small retained-data refit and matched evaluation.

**Stop when:** The leave-one-out fixtures and expected-gradient enumeration pass, and the filtered-SFT control retains its acceptance rule, data lineage and full cost ledger even if no outputs pass.

<details>
<summary>Self-test</summary>

1. Why does leave-one-out need at least two samples?
   - There is no other-sample reward mean for a singleton group, and the formula divides by zero.
2. Can a correct-only refit improve when every collected output is wrong?
   - Not from that pool. It has no retained training examples. Preserve the empty-pool result rather than inventing successful data.
3. Does an action-independent baseline always reduce variance?
   - No. It preserves the expected score-function gradient under the stated assumptions, but its variance effect depends on the baseline and reward distribution.

</details>

### Mini-project: Versioned reversal RL against sampling and filtered-SFT controls

**About 16 to 22 hours.** Extend `lmlab` in `rl/` with a bounded synchronous reversal study from the existing small-decoder SFT initialization. Check objectives before live updates, preserve a weak-verifier ablation, and compare learned policies with frozen sampling and filtered SFT on your machine without paid APIs or a learned process reward model.

1. Freeze reversal splits, character-tokenizer lineage, output grammar, action masks, terminal events and reward placement in `rl/`, linked to the SFT checkpoint. Check correct, wrong, malformed and truncated fixtures against an independent exact-answer evaluator; retain the task contract, parameter/FLOP budget and stop rules.
2. Before live training, check frozen-rollout REINFORCE, RLOO, GAE boundaries and signed clipping against exact enumeration, autodiff and CS336 Assignment 5 loss cases. Retain detached-baseline, ratio-direction and padding regressions, categorical KL/entropy checks and the full-vocabulary distillation gradient fixture; no critic training is required.
3. Implement explicit group centering, standard-deviation and loss-denominator choices, passing CS336 GRPO and Dr. GRPO component cases. Check unequal lengths, accumulation, all-correct/all-wrong groups and singleton rejection against independent reductions and gradients; retain the objective contract and isolate the planned live normalization change.
4. Build bounded synchronous collection, verification, update and held-out evaluation, passing CS336's on-policy train-step case first. Bind immutable rollouts to prompt, sampler, RNG, actor, old-policy, reference and verifier identities; inject old-score overwrite and lag failures, retain rejection evidence, and regenerate after each update.
5. Run matched normalization and strict-versus-substring reward ablations across seeds from the same initialization. Check planted exploits with independent verdicts; preserve the weak-reward run, parsing/format/correctness components, role-bound KL, entropy, diversity, length and signal-coverage traces, plus every invalid, filtered, timed-out and retried attempt.
6. Refit strict-correct outputs from a versioned starting-policy pool with response-only SFT and a matched random-per-prompt control where feasible. Check retained counts and empty groups against the pool; audit first-error positions against reversal targets and retain a segmentation-sensitive process-score fixture beside outcome verdicts.
7. Compare frozen SFT, RL and filtered-SFT checkpoints through the same `eval/` sampling curves: random, answer-vote, verifier selection and oracle coverage. Validate pass-at-k by subset enumeration; retain sample/token-matched views, paired and seed uncertainty, complete training/inference/verifier costs, failed runs and clean reproduction with bounded claims.

**Deliverables**

- The `rl/` task, immutable rollout collector and update path with frozen-rollout, role, freshness and verifier regressions.
- Normalization and weak-reward ablations, filtered/random refit controls, first-error audit and teacher-signal fixture linked through `registry/`.
- Reproducible sampling curves and resource ledger separating selected accuracy, oracle coverage, policy updates and verifier exploitation.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [CS336 Assignment 5: policy losses, normalization and on-policy update](https://github.com/stanford-cs336/assignment5-alignment/blob/c2734a26308710949fe13226960a1e8cece94b7e/tests/test_grpo.py). Pass loss, normalization, aggregation and train-step snapshots privately; independent gradient, collection, identity and verifier checks cover their missing guarantees.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Objective and identity correctness | Independent enumeration and gradient tests validate masks, baselines, clipping, GAE, normalization, KL and teacher signal before updates; immutable role manifests reject overwritten old scores and stale-policy inputs. | Tests distinguish scalar agreement from gradient agreement, inclusive centering from RLOO, old-policy drift from reference drift, and fixed-prefix distillation from full trajectory differentiation. |
| Failure and signal diagnosis | Matched normalization and weak-reward runs retain component verdicts, exploits, role-bound traces and every failed attempt; independent reversal checks validate first-error positions and segmentation-sensitive scoring. | The report distinguishes verifier loopholes, zero outcome signal, mastery, collapse and infrastructure errors without claiming a planted exploit was discovered by training. |
| Learned versus selected behavior | Frozen SFT, RL and filtered-SFT curves share an evaluator and matched budgets across seeds; enumeration validates coverage, and clean reproduction rebuilds uncertainty, retention counts, random-refit controls and complete costs. | Negative and empty-pool regimes remain visible; claims separate changed sampling efficiency from new support, faithful reasoning or universal capacity, with residual prompt/token imbalances disclosed. |

Feeds into: Immutable rollouts, tested policy objectives, verifier exploits, process-audit fixtures and compute-matched sampling curves feed safety stress tests and the capstone's mechanism-isolating extension, independent evaluation and failure dossier.

### Resource route

- **Primary - Assignment:** [CS336 Assignment 5 - Alignment and Reasoning RL](https://github.com/stanford-cs336/assignment5-alignment) - Do Sections 3 to 5: prompting and grading baselines, `baseline_calcs`, then the Section 4.2 functions (tokenization, response log probabilities, rollout rewards, group-normalized rewards, loss aggregation, the on-policy GRPO step) until the GRPO and metrics tests pass on CPU. The handout runs OLMo-2 1B with a two-GPU vLLM loop; run a small GRPO on a model and task that fit your GPU instead, with one normalization ablation and one preserved failure.
- **Required - Book:** [RLHF Book - Policy Gradients, Reasoning and Rejection Sampling](https://rlhfbook.com/c/06-policy-gradients.html) - Read Chapter 6 (policy gradients: REINFORCE, RLOO, PPO, GRPO and loss aggregation), Chapter 7 (reasoning), Chapter 9 (rejection sampling), Chapter 12 (distillation) and Chapter 15 (regularization). Do the Suggested Experiments in Chapters 6 and 9. Derive only the estimator used in your experiment, then use Chapters 14 and 15 to design the reward-hacking tests.
- **Required - Paper:** [DeepSeek-R1 Technical Report](https://arxiv.org/abs/2501.12948) - Read v2 Sections 2 and 3 (R1-Zero with rule-based rewards and GRPO, then cold-start SFT, RL and distillation) and the limitations (language mixing, the length jump). Separate evidence in the report from your tiny experiment and list the scale, data and infrastructure differences that block reproduction; read Dr. GRPO alongside it.
- **Required - Paper:** [DeepSeekMath, Section 4 (Group Relative Policy Optimization) (Shao et al., 2024)](https://arxiv.org/abs/2402.03300) - Read Section 4: GRPO drops the critic and uses the group mean and standard deviation as the baseline, averages within each sequence, then over the group, and adds a KL term. Section 5 relates RFT, DPO, PPO and GRPO. TRL 1.15.0 defaults differ (`loss_type="dapo"`, `beta=0.0`).
- **Support - Paper:** [Understanding R1-Zero-Like Training: A Critical Perspective (Liu et al., 2025)](https://arxiv.org/abs/2503.20783) - Read Sections 1 and 3 and Figure 1: dividing by response length favors long wrong answers, and dividing by the group standard deviation reweights questions by difficulty. Dr. GRPO removes both.
- **Support - Paper:** [DAPO: An Open-Source LLM Reinforcement Learning System at Scale (Yu et al., 2025)](https://arxiv.org/abs/2503.14476) - Read Sections 2 and 3: asymmetric clipping, no KL term, token-level loss averaging, dynamic sampling of mixed-outcome groups and overlong reward shaping. It keeps the standard deviation that Dr. GRPO drops; treat the disagreement as open.
- **Support - Paper:** [Back to Basics: Revisiting REINFORCE Style Optimization for Learning from Human Feedback in LLMs (Ahmadian et al., 2024)](https://arxiv.org/abs/2402.14740) - Read Sections 2 to 4: REINFORCE with a leave-one-out baseline over k samples, and why PPO's extra machinery may not pay off in their on-policy LLM setting.
- **Support - Paper:** [Self-Consistency Improves Chain of Thought Reasoning in Language Models (Wang et al., 2023)](https://arxiv.org/abs/2203.11171) - Read Sections 2 and 3: sample several reasoning paths and take the majority answer. It is the no-training baseline any RL result must beat at matched samples and tokens.
- **Support - Paper:** [Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters (Snell et al., 2024) with Large Language Monkeys (Brown et al., 2024)](https://arxiv.org/abs/2408.03314) - Read Snell Sections 2 and 3 (proposer, verifier and compute-optimal allocation), Section 5 (best-of-N and search against a verifier) and Section 6 (revisions), and Large Language Monkeys Sections 2 to 4 (coverage grows with repeated sampling; precision depends on the verifier, https://arxiv.org/abs/2407.21787). Report tokens and verifier calls, not only sample counts.
- **Support - Paper:** [Does Reinforcement Learning Really Incentivize Reasoning Capacity in LLMs Beyond the Base Model? (Yue et al., 2025)](https://arxiv.org/abs/2504.13837) - Read Sections 2 to 4: compare base and RL models at matched sampling with pass@k. The finding is debated; use its control matrix, not its verdict.
- **Support - Paper:** [Let's Verify Step by Step (Lightman et al., 2023)](https://arxiv.org/abs/2305.20050) - Read Sections 2 and 3: outcome versus process supervision on MATH and the PRM800K labels. Define step boundaries before you train any step-level verifier.
- **Support - Paper:** [STaR: Bootstrapping Reasoning With Reasoning (Zelikman et al., 2022) with Rejection Sampling Fine-Tuning (Yuan et al., 2023)](https://arxiv.org/abs/2203.14465) - Read STaR Section 3 (rationalization with the answer as a hint, then fine-tuning) and Yuan et al. Sections 3.3 and 4.1 (keep only correct sampled paths and refit, https://arxiv.org/abs/2308.01825). Neither is RL; both are the self-training controls an RL claim needs.
- **Support - Book:** [Build a Reasoning Model (From Scratch), Chapters 4 to 7](https://www.manning.com/books/build-a-reasoning-model-from-scratch) - Use Chapter 4 (temperature, top-p and self-consistency, pp. 94-135), Chapter 6 (GRPO on Qwen3-0.6B, pp. 179-224) and Chapter 7 (clipping, KL and metrics, pp. 225-266). Listing 6.13 is the unclipped policy gradient; clipping and KL arrive in Sections 7.4 and 7.5. Its advantage uses `torch.std`, which is the unbiased estimator.
- **Support - Paper:** [Tulu 3, Section 6 (Reinforcement Learning with Verifiable Rewards)](https://arxiv.org/abs/2411.15124) - Read Sections 6.1 to 6.4: RLVR data, recipe findings, infrastructure and results, plus the appendix on IFEval over-optimization. It ships data and configs you can inspect.
- **Reference - Reference:** [TRL GRPO Trainer](https://huggingface.co/docs/trl/grpo_trainer) - Read after your scratch loss passes. In TRL 1.15.0 the defaults are `loss_type="dapo"` (token mean), `beta=0.0` (no reference model loaded) and `scale_rewards="group"`; set `loss_type="grpo"` and `beta` above zero to approach the DeepSeekMath objective, and state the choice beside any comparison.
- **Support - Implementation:** [RLHF Book Code - Policy Gradients and Rejection Sampling](https://github.com/natolambert/rlhf-book/tree/1042143366d73ff654727e4d18a1d3a21209c3a3/code) - Run `policy_gradients/train.py` with the REINFORCE, RLOO or GRPO config and the rejection-sampling selection controls (`top_per_prompt` against `random_per_prompt`). Defaults use Qwen3-1.7B and a 7B scorer, so shrink the model, rollouts and tokens to fit your GPU. Sweep one variable and keep an unstable or hacked run.
- **Support - Practice:** [TensorTonic - RLVR Set](https://www.tensortonic.com/problems/cs336-l16-grpo-group-advantages) - Solve Normalize GRPO Group Advantages (`cs336-l16-grpo-group-advantages`), Compute a Clipped GRPO Surrogate (`cs336-l16-clipped-grpo-surrogate`) and Compare Sequence and Token Length Normalization (`cs336-l16-grpo-length-normalization-audit`). Add rollouts with unequal active lengths, and cross-check against the CS336 tests. Public test cases check the listed edge cases, not gradients or the hidden grader, so keep your own tests beside each solution. 
- **Support - Lab:** [Modern LLM Notebook - Reasoning and On-Policy Distillation](https://github.com/walkinglabs/modern-llm-notebook/tree/979eecf09669121167184ef925d8edbc089fc13e) - Use `notebooks-en/part4-frontiers/28-cot-thinking.ipynb` and `31-opd.ipynb` to compare CoT, inference-time search and on-policy distillation; notebook 28 needs API keys for some cells. Count tokens and verifier calls so selection is not confused with learning.
- **Reference - Course:** [Berkeley CS285 - LLM Reinforcement Learning](https://rail.eecs.berkeley.edu/deeprlcourse/static/slides/lec-14.pdf) - Read Lecture 14 "LLM RL", PDF pages 13 to 39: Part 2 (language models as policies), Part 3 (baselines, regularization and GRPO, pages 25 to 30) and Part 4 (Bradley-Terry, RLHF and verifier rewards, pages 31 to 39). Use it to repair RL prerequisites; HW4 needs Modal H100 credit and is not required.
- **Support - Project:** [LLM Post-Training Laboratory - RL and Reasoning](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-3/llm-post-training-laboratory.md) - Use the rollout, objective, policy-version, reward-hacking and compute-normalized evaluation requirements as the persistent artifact for this and later stages.

### Exit checkpoint

Run a tiny verifiable-reward study with SFT or direct-preference and no-RL baselines; show external improvement under matched inference compute; attack the reward and verifier; and explain one negative or unstable run from trajectory and policy-version evidence.

<details>
<summary>Deliberately left for later</summary>

- Full RL foundations already owned by the Reinforcement Learning track
- Distributed rollout engines and asynchronous fleet scheduling
- Claims that tiny-task reasoning results transfer to frontier models

</details>

## LMR-9. Multimodal Language Models

**Why:** Multimodal models add representation, alignment and data contracts that text-only intuition does not cover. This stage implements one bounded image-text path and tests whether the model is grounded or merely exploiting pairing and language priors.

### Learn this much

- [ ] Image patching, vision encoders and visual-token sequences _(Required)_
- [ ] Projectors between modality and language representation spaces _(Required)_
- [ ] Early fusion, late fusion and cross-attention trade-offs _(Required)_
- [ ] Symmetric CLIP contrastive loss and temperature _(Required)_
- [ ] SigLIP pairwise sigmoid loss and batch-size behavior _(Required)_
- [ ] Paired, interleaved and instruction-tuning multimodal data _(Required)_
- [ ] Synthetic captions and instruction data with generator provenance _(Required)_
- [ ] Modality tokens, attention masks and position ownership _(Required)_
- [ ] Multimodal RoPE coordinates and aspect or resolution handling _(Required)_
- [ ] Resolution, patch count, context length, memory and compute _(Required)_
- [ ] Frozen encoders, projector warmup and staged fine-tuning _(Required)_
- [ ] Paired retrieval versus generative instruction objectives _(Required)_
- [ ] Missing, corrupted and conflicting modality behavior _(Required)_
- [ ] Visual grounding, hallucination and language-prior shortcuts _(Required)_
- [ ] Cross-modal duplicates, benchmark contamination and pairing leakage _(Required)_
- [ ] Object, text-in-image, spatial, counting and resolution slices _(Required)_
- [ ] Text-only, shuffled-pair and corrupted-image baselines _(Required)_
- [ ] Audio and video tokenization and temporal-alignment vocabulary _(Optional)_
- [ ] Image or audio generation objectives _(Optional)_
- [ ] Large-scale multimodal mixture and scaling research _(Depth)_
- [ ] Production VLM serving, batching and modality pipelines _(Later)_

### Study units

#### U1. Image patches, vision encoders and visual-token counts, and resolution, context and compute cost

**About 4 h** · **Target:** Derive + Implement

Topics: Image patching, vision encoders and visual-token sequences; Resolution, patch count, context length, memory and compute

Patch extraction is already familiar from the Deep Learning unit on patch embeddings and positional information. The research problem is tracking what survives preprocessing and compression, and which component pays for each token.

**You can now**

- Derive separate token counts for the vision encoder and the language decoder after merging and delimiters.
- Implement rectangular patch extraction with an explicit flattening order and grid coordinates.
- Budget resolution changes across vision attention, decoder context and cached state.

**Study**

1. [CS336 Spring 2026 Lecture 17: multimodal models](https://cs336.stanford.edu/lectures/?trace=lecture_17) (CS336 2026 - Alignment and Multimodality) - The `clip` data-processing and vision-encoder blocks, then `llava_onevision` Data processing and `qwen2_vl` Visual encoder. Depth: Read for preprocessing and token budgets, not the reported large-model speed comparisons. The Qwen2-VL count of 66 includes two delimiters, not 66 visual features.
2. [Qwen2-VL, arXiv:2409.12191v1](https://arxiv.org/abs/2409.12191v1) (Qwen2-VL: Enhancing Vision-Language Model's Perception of the World at Any Resolution (Wang et al., 2024)) - Section 2.1, Model Architecture: the Naive Dynamic Resolution paragraph (2D positions, adjacent 2 by 2 token compression and vision delimiters).

**Focus**

- Count the processed image, not its original dimensions. Resizing, cropping and tiling change both evidence and token count.
- For divisible dimensions and square patch width $`p`$, the vision grid has $`N=HW/p^2`$ patches. A 2 by 2 merger gives $`N/4`$ visual decoder tokens when both grid dimensions are even.
- Doubling both image dimensions quadruples patch count. Dense vision attention score entries grow sixteenfold; projections grow fourfold. Decoder attention instead depends on the total visual plus text length.
- Attention score counts are not measured latency or peak memory. Fused attention can avoid storing the full score matrix; decoder KV state grows linearly with its sequence length.

**Reproduce:** Closed-book, count a 224 by 224 image with patch width 14: 256 vision patches, 64 visual tokens after 2 by 2 merging, and 66 positions including two delimiters. For a 448 by 448 input, get 1024, 256 and 258 respectively. With 32 text tokens and no other special tokens, the decoder lengths are 98 and 290. Implement the TensorTonic rectangular patch contract and check its channel ordering against a nested-loop oracle on CPU with PyTorch 2.14.1.

**Traps**

- Counting a pooled CLIP embedding as a sequence of patch features. A pooled vector discards the explicit grid the projector may need.
- Changing a frozen encoder's input resolution without checking its positional encoding and preprocessing contract. A valid tensor shape is not proof of compatible features.
- Calling a sixteenfold attention-score increase a sixteenfold runtime increase. Other operations, kernels and memory traffic still matter.

**Practice**

- [TensorTonic: Patchify a Batch of Images](https://www.tensortonic.com/problems/cs336-l17-vision-transformer-patchify) - Implement `vision_transformer_patchify(images, patch_height, patch_width)`; public cases Four horizontal patches, Two-channel patches and Whole-image patch. The public cases cover rectangular extraction, channel-first flattening and a whole-image patch. Add noncontiguous-input, dtype and reconstruction tests; reuse the result for the mini-project's resolution budget rather than repeating the earlier square-patch exercise.

**Stop when:** Your rectangular patch outputs match the public cases and your loop oracle, and your budget distinguishes vision patches, merged decoder tokens and delimiters at both resolutions.

<details>
<summary>Self-test</summary>

1. Why does Qwen2-VL describe 66 tokens for a 224 by 224 image?
   - Patch width 14 gives 256 patches. Merging each 2 by 2 group gives 64 visual tokens; the start and end delimiters add two positions.
2. Does doubling image resolution quadruple the whole decoder's attention cost?
   - No. Visual token count quadruples under the stated grid rule, but dense decoder attention uses the square of text plus visual length, including delimiters.
3. Can a center crop improve efficiency without changing the task?
   - Only if it preserves the evidence the task needs. Cropping away a small object or text changes what can be answered from the input.

</details>

#### U2. Projectors between representation spaces, and early, late and cross-attention fusion

**About 4 h** · **Target:** Explain + Implement

Topics: Projectors between modality and language representation spaces; Early fusion, late fusion and cross-attention trade-offs

Equal widths permit concatenation, but do not establish semantic alignment. Fusion placement also determines which representations can interact and what a text-only control must bypass.

**You can now**

- Trace visual features through a linear or MLP projector into decoder-width embeddings.
- Compare joint token processing, separate-encoder scoring and inserted cross-attention using explicit interaction shapes.
- Test a gated fusion branch against the unfused residual path at initialization.

**Study**

1. [CS336 Spring 2026 Lecture 17: multimodal models](https://cs336.stanford.edu/lectures/?trace=lecture_17) (CS336 2026 - Alignment and Multimodality) - The `llava` Model block and `qwen_vl` Architecture block.
2. [LLaVA projector builder at commit c121f04](https://github.com/haotian-liu/LLaVA/blob/c121f0432da27facab705978f83c4ada465e46fd/llava/model/multimodal_projector/builder.py) (LLaVA - Visual Instruction Tuning) - `build_vision_projector`: `linear`, `mlpNx_gelu` and `identity` branches.
3. [Flamingo, arXiv:2204.14198v1](https://arxiv.org/abs/2204.14198v1) (Flamingo: a Visual Language Model for Few-Shot Learning (Alayrac et al., 2022)) - Sections 3.1.1 to 3.1.3, Figures 4 to 6: resampler, gated cross-attention and image-causal masking. Depth: These are the architecture sections in this edition; Sections 2.1 to 2.3 are related work. Do not implement the full model.
4. [Modern LLM Notebook 29: projector and fusion](https://github.com/walkinglabs/modern-llm-notebook/blob/979eecf09669121167184ef925d8edbc089fc13e/notebooks-en/part4-frontiers/29-vlm.ipynb) (Modern LLM Notebook - Vision-Language Models) - Sections 5 and 6, then Exercise 2: Implement a Single-Layer Projector. Depth: The Section 6 demo adds LayerNorm after the gated residual, so its zero gate returns normalized input, not unchanged input. Use Flamingo Figure 5 for an identity-preserving insertion.

**Focus**

- For visual features of shape $`B\times N\times d_v`$, a biased linear projector has $`d_vd_l+d_l`$ parameters and returns $`B\times N\times d_l`$. It changes width, not token count.
- Use early fusion to mean joint processing of modality tokens; Chameleon uses it from pretraining. Separate CLIP towers combine only at scoring, a late interaction. LLaVA concatenates pretrained features before decoder processing. State the actual interaction rather than relying on labels alone.
- Cross-attention uses text queries and visual keys and values: per-head score shape $`B\times h\times T\times N`$. Its cost includes text self-attention, visual encoding, projections and any resampler, not just this matrix.
- For a finite branch output, $`x+\tanh(\alpha)f(x,v)`$ equals $`x`$ at a zero gate. This is an initialization contract, not evidence that the model later uses vision.

**Reproduce:** On CPU with PyTorch 2.14.1, build biased linear and two-layer GELU projectors from width 32 to 64, with hidden width 64. Count 2112 and 6272 parameters and verify both map `(2, 6, 32)` to `(2, 6, 64)`. Implement the gated residual from Flamingo Figure 5 and test zero-gate identity on finite inputs. Contrast it with the notebook's post-residual normalization.

**Traps**

- Treating equal embedding dimensions as aligned spaces. Only an objective and external evaluation can establish useful correspondence.
- Claiming a resampler removes all resolution cost. Its output length is fixed, but visual encoding and resampling still process the input grid.
- Treating the notebook's schematic attention-entry counts as total FLOPs or a speed measurement. They omit projections and the vision tower.

**Practice**

- [Modern LLM Notebook 29, Exercise 2: Implement a Single-Layer Projector](https://github.com/walkinglabs/modern-llm-notebook/blob/979eecf09669121167184ef925d8edbc089fc13e/notebooks-en/part4-frontiers/29-vlm.ipynb) - Exercise 2 under Exercises: construct the linear map and satisfy the `(2, 196, 4096)` output assertion. Run on CPU. Add the smaller linear-versus-MLP parameter test and zero-gate regression above. The section mini-project connects the projector to frozen features and a decoder; this exercise checks shapes, not grounding.

**Stop when:** The exercise and your parameter and gate tests pass, and you can draw the interaction shapes and cost omissions for all three fusion designs.

<details>
<summary>Self-test</summary>

1. Does a tokenwise MLP projector reduce a 196-token grid to 32 tokens?
   - No. It changes each token's features independently. Pooling, merging or a query-based resampler must explicitly change the token axis.
2. Why can Flamingo text depend on older images when direct cross-attention sees only the most recent image?
   - Earlier text states can already contain information from those images. Causal text self-attention carries that information forward.
3. At a zero gate, must the added branch's own parameters receive nonzero gradients?
   - No. Their gradient through the gated output is multiplied by zero. The gate can receive a gradient and open the branch on later updates.

</details>

#### U3. The symmetric CLIP contrastive loss, the SigLIP pairwise sigmoid loss and batch-size behavior

**About 6 h** · **Target:** Derive + Implement

Topics: Symmetric CLIP contrastive loss and temperature; SigLIP pairwise sigmoid loss and batch-size behavior

The Deep Learning unit on paired modalities already implemented symmetric CLIP. Here the new work is an independent loss oracle, gradient checks and the reduction and negative-sampling contracts needed for a controlled objective comparison.

**You can now**

- Derive CLIP and SigLIP losses and their logit gradients with explicit reductions.
- Differential-test both losses and gradients against OpenCLIP 3.3.0 on one device.
- Separate batch-size effects on negatives, reduction scale and optimization budget.

**Study**

1. [CLIP, ICML 2021 PMLR edition](https://proceedings.mlr.press/v139/radford21a/radford21a.pdf) (CLIP Paper and Official Code) - Section 2.2 and Figure 3: normalized embeddings, learned logit multiplier and the two cross-entropies. Depth: Use this edition's numbering, not the earlier prerequisite card's section labels. Reconstruct the gradient rather than repeating the first-pass implementation.
2. [Sigmoid Loss for Language Image Pre-Training, arXiv:2303.15343v4](https://arxiv.org/abs/2303.15343v4) (Sigmoid Loss for Language Image Pre-Training (Zhai et al., 2023)) - Sections 3.1 and 3.2 and Algorithm 1; Figure 2 and Sections 4.1 and 4.2 for batch-size experiments. Depth: Algorithm 1 in this version uses positive similarity logits with positive diagonal labels; the first arXiv version printed a negated dot product there. OpenCLIP, below, uses the same positive-similarity and bias convention. Read the batch curves under their own model, data and seen-example budgets; do not reproduce the large runs.
3. [OpenCLIP release 3.3.0 loss definitions](https://github.com/mlfoundations/open_clip/blob/v3.3.0/src/open_clip/loss.py) (OpenCLIP) - `ClipLoss.get_logits`, `ClipLoss.forward`, `SigLipLoss.get_ground_truth` and `SigLipLoss._loss`. Depth: Use `world_size=1`. Pass normalized features and the multiplier itself; these loss classes do not normalize features or exponentiate the supplied multiplier.

**Focus**

- For batch size $`B`$, normalized features and logits $`S`$, CLIP averages row and column cross-entropy: $`L=-\frac{1}{2B}\sum_i[\log\operatorname{softmax}(S_{i,:})_i+\log\operatorname{softmax}(S_{:,i})_i]`$. A shared scalar bias cancels from both softmaxes.
- SigLIP uses $`L=\frac{1}{B}\sum_{i,j}\log(1+\exp(-z_{ij}S_{ij}))`$, with diagonal labels 1 and off-diagonal labels -1. For this reduction, $`\partial L/\partial S_{ij}=-z_{ij}\sigma(-z_{ij}S_{ij})/B`$. Use a stable softplus or log-sigmoid implementation.
- TensorTonic divides the SigLIP sum by $`B^2`$; OpenCLIP divides by $`B`$. Multiply the exercise loss and gradients by $`B`$ before comparison, keeping logits identical.
- SigLIP removes the softmax normalization across candidates, not the need for negative pairs. Batch size changes negative coverage and class imbalance; accumulating isolated microbatch losses does not create the cross-microbatch negatives of a full batch.

**Reproduce:** On CPU with PyTorch 2.14.1 and `open_clip_torch==3.3.0`, use two orthogonal unit vectors as both image and text features in `float64`. CLIP with multiplier 1 gives 0.3132616875. SigLIP with multiplier 2 and bias -1 gives 0.6265233750 in OpenCLIP and 0.3132616875 as an all-pairs mean. Derive the factor of two, then compare your losses and feature, multiplier and bias gradients against OpenCLIP on seeded nonzero random features, using `torch.manual_seed(42)` and `torch.testing.assert_close` with `rtol=1e-7, atol=1e-9`.

**Traps**

- Passing a stored logarithmic scale where the API expects its exponential. The OpenCLIP loss call and TensorTonic's SigLIP problem take the multiplier itself; TensorTonic's CLIP problem takes the temperature $`\tau`$ and divides by it.
- Using a one-pair CLIP batch as a learning test. Its loss and gradient are zero because there are no competing candidates; SigLIP still trains its positive term.
- Treating every off-diagonal pair as truly negative. Duplicate images or equivalent captions can make the diagonal-only supervision contradictory.

**Practice**

- [TensorTonic: Implement Symmetric CLIP Contrastive Loss](https://www.tensortonic.com/problems/cs336-l17-symmetric-clip-loss) - `symmetric_clip_loss`: public cases Orthogonal matched pairs, Single normalized pair and One ambiguous image. Reuse your prerequisite implementation. The cases check normalized logits, loss and directional accuracies including an argmax tie; they do not check gradients. Add the OpenCLIP differential tests instead of treating this as a new first-pass exercise.
- [TensorTonic: Implement the SigLIP Pairwise Loss](https://www.tensortonic.com/problems/cs336-l17-siglip-pairwise-loss) - `siglip_pairwise_loss`: public cases Aligned orthogonal pairs, Single confident pair and Swapped pairs. Follow its all-pairs-mean contract for the exercise, then convert the reduction for your OpenCLIP oracle. Add large-magnitude finite-logit tests and a gradient check on nonzero features; the public cases do not validate gradients.

**Stop when:** Both exercise contracts pass, both converted objectives and gradients agree with OpenCLIP within the stated tolerance, and you explain why microbatch accumulation does not reproduce full-batch negatives.

<details>
<summary>Self-test</summary>

1. Why is a learned scalar bias useful for SigLIP but ineffective for CLIP's softmax loss?
   - SigLIP's bias moves all binary decision logits to reflect the positive-negative imbalance. In CLIP a common additive bias cancels inside each softmax.
2. What happens to the SigLIP reduction factor for a batch of eight pairs?
   - OpenCLIP's sum divided by eight is eight times the all-64-pairs mean, for identical logits and labels. Gradients differ by the same factor.
3. Does a lower raw SigLIP loss than CLIP loss prove a better encoder?
   - No. Their objectives and reductions differ. Compare held-out retrieval on the same candidates and account for data exposure, optimization and compute.
4. If two captions describe the same image, is diagonal-only retrieval accuracy a complete evaluation?
   - No. A different valid caption may be counted as wrong. Keep relevance groups and specify whether any valid caption counts as a retrieval hit.

</details>

#### U4. Paired, interleaved, instruction and synthetic multimodal data with generator provenance

**About 4 h** · **Target:** Explain

Topics: Paired, interleaved and instruction-tuning multimodal data; Synthetic captions and instruction data with generator provenance

A fluent synthetic answer can contain claims the image never supported. Data lineage must preserve the evidence available to the generator, not just the final image-answer pair.

**You can now**

- Explain how paired examples, interleaved documents and instruction conversations define different alignment contracts.
- Trace synthetic answers back to their image, captions or boxes, generator and prompt version.
- Specify source-group splits, rights and modality exposure in a versioned data manifest.

**Study**

1. [Visual Instruction Tuning, arXiv:2304.08485v1](https://arxiv.org/abs/2304.08485v1) (LLaVA - Visual Instruction Tuning) - Section 3, GPT-assisted Visual Instruction Data Generation, and Table 1: caption and box contexts, conversation, description and reasoning outputs. Depth: Study the construction and inspect its assumptions. Do not call the paid generator; use existing annotations and hand-written instruction templates for the small local route.
2. [Flamingo, arXiv:2204.14198v1: data mixtures](https://arxiv.org/abs/2204.14198v1) (Flamingo: a Visual Language Model for Few-Shot Learning (Alayrac et al., 2022)) - Sections 3.2.1 to 3.2.3 and Figures 6 and 7: interleaved webpage records, paired records and dataset-weighted text likelihood.
3. [COCO terms of use](https://cocodataset.org/dataset/termsofuse.htm) (COCO Captions Subset) - Terms of Use: Annotations & Website, then Images (page read 2026-10-17).

**Focus**

- A paired caption gives a designated correspondence. Interleaved webpage proximity is weaker supervision; preserve image order, surrounding text and source-document boundaries.
- LLaVA's original language-only generator received captions and boxes, not image pixels. Generated reasoning is not a new independent observation of the image.
- Keep source image id, content hash, parent annotation ids, split, license evidence, transformations and answer origin. For synthetic answers also retain generator checkpoint or service edition, prompt, decoding settings and review decisions; mark unavailable upstream details as unknown.
- Count both examples and supervised text tokens by modality and source. Repeating a caption as several instructions increases exposure without creating independent evidence. COCO annotation terms do not relicense the images.

**Reproduce:** Without notes, draw the lineage for one image with several captions, one caption-derived question and one generator-derived conversation. Mark exactly which evidence each answer used. Allocate the source image and all its derivatives to one split before creating the conversations; identify which fields would let a reviewer reconstruct or reject each derivative.

**Traps**

- Moving synthetic paraphrases into evaluation because their text differs. The parent image and answer evidence can still be training data.
- Treating unpaired images and text as positive contrastive pairs. A shared batch or document does not establish semantic correspondence.
- Dropping missing-image or rejected examples without counts. Filtering changes the modality distribution and must remain visible in the manifest.

**Practice**

- The section mini-project covers this: a versioned manifest for 50 to 200 COCO image ids, their caption and instruction derivatives, image-level splits, per-image rights and generator provenance without paid generation.

**Stop when:** You can trace each answer in a sample manifest to its actual evidence, explain every split decision and distinguish unknown generator details from verified provenance.

<details>
<summary>Self-test</summary>

1. Can a caption-only generator certify a small object's color when the captions never mention it?
   - No. It can guess, but has no pixel evidence. Review that claim against the image or exclude it from grounded supervision.
2. Why split by image or source group before instruction generation?
   - Captions, crops, questions and synthetic answers derived from one source share evidence. Splitting derivatives independently leaks that evidence.
3. Do equal numbers of image-text and text-only examples imply equal objective weight?
   - No. Lengths, loss masks, sampling frequency and reduction determine the supervised weight. Visual positions may provide conditioning without being prediction targets.

</details>

#### U5. Modality tokens, attention masks and multimodal RoPE coordinates

**About 4 h** · **Target:** Implement

Topics: Modality tokens, attention masks and position ownership; Multimodal RoPE coordinates and aspect or resolution handling

The Deep Learning unit on causal and padding masks and the LLM Foundations unit on RoPE supply the mechanics. Multimodal assembly adds a second indexing system: image grids expand placeholders, while coordinate offsets need not equal the packed token count.

**You can now**

- Expand image placeholders while keeping embeddings, labels, attention masks and position metadata synchronized.
- Implement temporal, height and width coordinates for mixed text and visual grids with explicit offsets.
- Test causal isolation, padding, image ownership and truncation after visual-token expansion.

**Study**

1. [Qwen2-VL, arXiv:2409.12191v1: M-RoPE](https://arxiv.org/abs/2409.12191v1) (Qwen2-VL: Enhancing Vision-Language Model's Perception of the World at Any Resolution (Wang et al., 2024)) - Section 2.1, Multimodal Rotary Position Embedding, and Figure 3; Section 3.3.2 and Table 8 for the ablation. Depth: Implement the coordinate contract, not the full Qwen2-VL model. Its ablation results belong to its own training setup, not your small decoder.
2. [LLaVA input assembly at commit c121f04](https://github.com/haotian-liu/LLaVA/blob/c121f0432da27facab705978f83c4ada465e46fd/llava/model/llava_arch.py) (LLaVA - Visual Instruction Tuning) - `prepare_inputs_labels_for_multimodal`: image-placeholder replacement, `IGNORE_INDEX` image labels, expanded-sequence truncation and rebuilt padding, masks and positions. Depth: Trace the one-image path. LLaVA's rebuilt one-dimensional positions are not Qwen2-VL M-RoPE; treat them as separate designs.

**Focus**

- Attention permission and prediction supervision are different. Visual features may condition answers while having ignored labels; user prompts may also be visible but unsupervised.
- M-RoPE allocates rotary channel groups to temporal, height and width axes. Text repeats the same position on all axes; an image holds time fixed and varies grid row and column. This changes rotary coordinates, not the causal order of the packed sequence.
- The exercise advances the next segment to one beyond the largest coordinate already used, not one beyond the token count. Record grid dimensions after merging, row-major ordering and the separator policy.
- Expand first, then validate lengths and truncation. A cut through visual features or an assistant answer needs a declared rejection or truncation policy, not silent misalignment.

**Reproduce:** Implement the TensorTonic coordinate builder on CPU with PyTorch 2.14.1. For two text tokens, a 2 by 2 image and one separator, reproduce time `[0, 1, 2, 2, 2, 2, 4]`, height `[0, 1, 2, 2, 3, 3, 4]` and width `[0, 1, 2, 3, 2, 3, 4]`. Then assemble a visual prefix plus text and perturb a future text embedding: earlier valid outputs must stay within your stated tolerance in evaluation mode. Repeat with padding changed and with two examples batched separately and together.

**Traps**

- Using coordinate magnitude to decide causal visibility. Visual grid coordinates can repeat; causality follows sequence order and the chosen fusion policy.
- Sending a placeholder sentinel into the ordinary text embedding table. Replace it before lookup if it is not a real vocabulary id.
- Assuming the coordinate exercise validates rotary channel allocation, cached decoding or model masks. It returns coordinates only; those need separate integration tests.

**Practice**

- [TensorTonic: Assign Multimodal RoPE Coordinates](https://www.tensortonic.com/problems/cs336-l17-multimodal-rope-coordinates) - `multimodal_rope_coordinates(segments)`; public cases Text image and separator, Wide image grid and Strided video grid. The cases check coordinates for mixed segments, a rectangular image and a strided video. Add empty-segment and offset tests. The section mini-project covers expanded labels, padding, future-token isolation, serialization and cached-versus-full decoding; the exercise does not test those.

**Stop when:** The three public coordinate cases pass, and your expanded batch preserves valid outputs under padding and future-token interventions without confusing attention masks with loss masks.

<details>
<summary>Self-test</summary>

1. Why is the separator coordinate 4 after a 2 by 2 image starting at offset 2, although seven tokens are emitted in total?
   - The image uses coordinates up to 3 and advances the offset by its largest grid dimension, two. Coordinate progression is not packed sequence length.
2. Does ignoring the visual labels prevent the decoder from attending to the image?
   - No. Ignored labels remove prediction losses at those positions. Attention masks separately determine which visual features can condition text.
3. Why must the image placeholder expand before checking the context budget?
   - One placeholder can become hundreds of positions. A text-only length check can pass while the expanded input truncates image evidence or answer targets.

</details>

#### U6. Frozen encoders, projector warmup, staged fine-tuning, and retrieval versus generative objectives

**About 5 h** · **Target:** Implement

Topics: Frozen encoders, projector warmup and staged fine-tuning; Paired retrieval versus generative instruction objectives

A correct forward shape is not a generative model. The important transition is from disconnected components to causal answer training whose gradients, frozen state and held-out behavior can be audited.

**You can now**

- Implement a frozen-encoder, trainable-projector path into a causal decoder with answer-only likelihood.
- Verify the gradient and optimizer boundaries of projector warmup and bounded decoder fine-tuning.
- Evaluate retrieval and generation as distinct objectives without inferring grounding from either training loss.

**Study**

1. [CS336 Spring 2026 Lecture 17: multimodal models](https://cs336.stanford.edu/lectures/?trace=lecture_17) (CS336 2026 - Alignment and Multimodality) - The `clip` Ablation block and `llava` Training block.
2. [Visual Instruction Tuning, arXiv:2304.08485v1: training](https://arxiv.org/abs/2304.08485v1) (LLaVA - Visual Instruction Tuning) - Sections 4.1 and 4.2, Table 2 and Equation 3: architecture, assistant prediction targets and the two training stages. Depth: Use the freeze schedule and objective, not the Vicuna-scale run. Reuse your saved small `lmlab` decoder and the vision encoder from the Deep Learning unit on paired modalities; pin both checkpoint hashes and preprocessing in the run manifest.
3. [Modern LLM Notebook 29: freeze schedule and minimal pipeline](https://github.com/walkinglabs/modern-llm-notebook/blob/979eecf09669121167184ef925d8edbc089fc13e/notebooks-en/part4-frontiers/29-vlm.ipynb) (Modern LLM Notebook - Vision-Language Models) - Sections 8 to 10 and Exercise 3: Calculate Two-Stage Training Ratios. Depth: Section 10 is a shape demo: its `TransformerEncoder` call has no causal mask or positional encoding. Do not use its loss as autoregressive evidence. Insert the visual prefix into your tested causal decoder, retaining its positions and loss shift.

**Focus**

- Warm up only the projector with the encoder and decoder parameters frozen. The decoder still needs autograd through its operations to the projected inputs; do not wrap that forward pass in `torch.no_grad()`.
- For the local route, reuse the paired encoder's frozen grid features and a roughly 10M-parameter decoder from your earlier work. Cache detached vision features with preprocessing and checkpoint hashes. PyTorch 2.14.1 is the reference; CPU and shorter sequences suffice for the same correctness tests.
- In stage two, unfreeze a declared decoder subset and rebuild or update optimizer groups deliberately. Match image ids, answer-token exposure, update budget and evaluation settings against a no-warmup branch initialized from the same saved state; report any compute difference.
- Retrieval ranks candidates in a shared feature space; generative training predicts answer tokens conditioned on image and prompt. Keep a frozen retrieval baseline, a text-only decoder baseline and independent answer evaluation. Neither low contrastive loss nor low answer loss proves grounding.

**Reproduce:** From a blank file, write one answer-only training step through a trainable projector and a frozen causal decoder. Snapshot frozen tensors before the step: they must remain unchanged while the projector receives a finite nonzero gradient on a nondegenerate batch. With shifted labels, check that only assistant targets enter the denominator, not visual or prompt positions. Save and reload the projector plus assembly metadata; in evaluation mode require the same logits within `rtol=1e-5, atol=1e-6` on the same fixed CPU batch.

**Traps**

- Equating `eval()` with freezing. It changes behavior such as dropout, not parameter trainability; `requires_grad=False` does not itself select evaluation behavior.
- Detaching projector outputs or disabling decoder autograd during warmup. The projector then cannot learn through the frozen decoder.
- Selecting a training stage on the final test images. Keep a development split and preserve the final split for the frozen comparison.

**Practice**

- The section mini-project covers this: one small frozen-encoder plus projector-to-decoder path, projector warmup and a bounded decoder update, gradient and serialization tests, and held-out retrieval and answer evaluation against fixed baselines.

**Stop when:** Your warmup step changes only permitted state, reload preserves fixed-batch logits within tolerance, and you can state separate retrieval and generation evaluation contracts before training longer.

<details>
<summary>Self-test</summary>

1. Why can a frozen decoder still train a projector?
   - Its operations remain differentiable with respect to the input embeddings. Frozen weights need no gradients, but gradients to projected visual inputs can still flow.
2. Does a smaller count of trainable parameters imply proportionally smaller total training memory?
   - No. Frozen weights remain resident and decoder activations may still be needed for the projector's backward path. Optimizer state, activations and total memory must be accounted for separately.
3. A model ranks the correct caption first but cannot answer a counting question. Is that inconsistent?
   - No. Ranking a finite candidate set and generating an accurate count are different tasks. The contrastive representation may not preserve or expose the required count.

</details>

#### U7. Missing, corrupted and conflicting modalities, visual grounding and hallucination

**About 4 h** · **Target:** Measure

Topics: Missing, corrupted and conflicting modality behavior; Visual grounding, hallucination and language-prior shortcuts

A model can answer from language priors while ignoring the image, or change its answer when the image changes without becoming more accurate. Grounding needs both intervention evidence and independently checked answers.

**You can now**

- Measure answer changes under missing-image, corrupted-image and conflicting-text interventions on the same held-out items.
- Evaluate one original POPE sampling slice with audited parsing, confusion counts and answer bias.
- Distinguish image sensitivity, correct grounding and unsupported claims about safety.

**Study**

1. [Evaluating Object Hallucination in Large Vision-Language Models, EMNLP 2023](https://aclanthology.org/2023.emnlp-main.20.pdf) (POPE: Evaluating Object Hallucination in Large Vision-Language Models) - Sections 5.1 and 5.2, Figure 3 and Table 3: object probing, random/popular/adversarial negatives and reported metrics. Depth: The Metrics paragraph on printed p. 298 misdescribes precision and recall as correct yes/no answers respectively. Use the positive-class formulas in the next item: recall is not specificity. Object presence is also narrower than general visual grounding.
2. [Original POPE evaluator at commit 08d957b](https://github.com/AoiDragon/POPE/blob/08d957b917e5a378a2f99d35b6293c536a66298b/evaluate.py) (POPE: Evaluating Object Hallucination in Large Vision-Language Models) - Answer normalization, `TP`, `TN`, `FP`, `FN`, precision, recall, F1 and yes-ratio computation. Depth: Inspect rather than run unchanged. It zips rows instead of joining ids, treats unrecognized answers as yes and does not guard zero denominators. Keep original POPE data separate from POPEv2.
3. [Original POPE COCO random-sampling questions](https://github.com/AoiDragon/POPE/blob/08d957b917e5a378a2f99d35b6293c536a66298b/output/coco/coco_pope_random.json) (POPE: Evaluating Object Hallucination in Large Vision-Language Models) - Records keyed by `question_id`, with `image`, `text` and `label`; image names identify COCO validation 2014. Depth: Reserve 10 to 20 image ids before training and keep all their questions. Use this fixed random-negative slice on CPU or your GPU, not a full benchmark sweep; keep its images and caption derivatives out of adaptation.

**Focus**

- Fix model, question, decoding and evaluator; change only the declared modality condition. Missing-image removal, a blank image, a shuffled image and a conflicting caption are distinct interventions, not interchangeable controls.
- For a conflicting-caption test, ask an image-grounded question whose answer you checked from pixels, then add contradictory text. A changed answer measures susceptibility only under that stated instruction and evidence policy.
- On parsed binary predictions, use positive-class precision $`\mathrm{TP}/(\mathrm{TP}+\mathrm{FP})`$, recall $`\mathrm{TP}/(\mathrm{TP}+\mathrm{FN})`$ and F1 $`2\mathrm{TP}/(2\mathrm{TP}+\mathrm{FP}+\mathrm{FN})`$. Declare zero-denominator handling before scoring.
- Require a single yes/no answer for your local parser, with case and surrounding whitespace normalized. Mark other outputs invalid. Report parsed-subset confusion metrics and coverage, all-item accuracy with invalids incorrect, and yes count divided by all items. Disclose this departure from the original parser and hand-check a sample.

**Reproduce:** Without model inference, score four items whose labels are `['yes', 'yes', 'no', 'no']` with an always-yes predictor. Get accuracy 0.5, precision 0.5, recall 1, F1 $`2/3`$ and yes ratio 1. Repeat with mixed predictions, then permute prediction rows while preserving `question_id`: an id-based join must preserve the scores and reject duplicate or missing ids. Check this before scoring the image interventions.

**Traps**

- Calling a performance drop after image corruption proof of correct grounding. It establishes dependence on changed input, not that the intact answer was right.
- Treating high F1 as freedom from hallucination. Always-yes already gets substantial F1 on a balanced presence test; report accuracy and yes ratio too.
- Scoring missing-image runs after discarding failed generations. Failures belong in all-item accuracy and coverage, not outside the denominator.

**Practice**

- The section mini-project covers this: the held-out original POPE random-negative slice, id-joined raw answers, parser calibration, missing-image and corrupted-image runs, and hand-checked conflicting-caption cases on the same tiny generative path.

**Stop when:** Your synthetic scorer and join tests pass, and your intervention report preserves invalids and separates correct grounding, image dependence and language-prior errors.

<details>
<summary>Self-test</summary>

1. Why can an always-no predictor have zero false-positive hallucinations but still fail this unit?
   - It misses every present object and may ignore the image completely. Negative errors, positive recall and image-sensitive correct answers must be considered together.
2. What does a model unchanged under every image intervention tell you?
   - Its answers show no measured image dependence on those items. Check assembly and modality wiring, then language shortcuts; do not claim the image pathway is universally unused.
3. Does passing a POPE slice establish spatial reasoning or multimodal safety?
   - No. It tests prompted object presence for its images, sampling strategy and parser. Spatial relations, instruction conflicts and harmful image content require separate evaluations.

</details>

#### U8. Cross-modal leakage, modality slices, and text-only and corrupted-pair baselines

**About 5 h** · **Target:** Measure

Topics: Cross-modal duplicates, benchmark contamination and pairing leakage; Object, text-in-image, spatial, counting and resolution slices; Text-only, shuffled-pair and corrupted-image baselines

The Deep Learning unit on linear probes, transfer evaluation and pair leakage covered source splits. Research-depth evidence must also survive cross-modal derivatives, altered candidate sets and the possibility that a visual gain is just extra computation or answer leakage.

**You can now**

- Audit image, caption, question and synthetic-answer overlap without treating a clean local split as proof of clean pretraining.
- Compare intact, text-only and corrupted-pair conditions on fixed held-out modality slices.
- Report paired quality deltas with image-group uncertainty and measured modality-conditioned cost.

**Study**

1. [CLIP, ICML 2021 PMLR edition: overlap and limitations](https://proceedings.mlr.press/v139/radford21a/radford21a.pdf) (CLIP Paper and Official Code) - Sections 4 and 6: Data Overlap Analysis and Limitations.
2. [Flamingo, arXiv:2204.14198v1: deduplication scope](https://arxiv.org/abs/2204.14198v1) (Flamingo: a Visual Language Model for Few-Shot Learning (Alayrac et al., 2022)) - Appendix A.3, Dataset deduplication against evaluation tasks. Depth: Read the exceptions as well as the method: not every dataset or modality was deduplicated. Do not attempt to reproduce the internal search service.
3. [Qwen2-VL, arXiv:2409.12191v1: resolution ablation](https://arxiv.org/abs/2409.12191v1) (Qwen2-VL: Enhancing Vision-Language Model's Perception of the World at Any Resolution (Wang et al., 2024)) - Section 3.3.1, Dynamic Resolution, Table 7 and Figure 4. Depth: Use its task-dependent resolution behavior to motivate slices, not as a predicted gain for your encoder. Your frozen encoder must support the chosen input sizes.

**Focus**

- Audit raw and decoded-image hashes, source ids and caption/question/answer lineage. Review near-duplicate candidates across crops and re-encodings; a high feature similarity is a candidate, not proof of duplication. Record pretraining overlap as unknown when the encoder's training data cannot be audited.
- Predeclare object presence, text-in-image, spatial relation, counting and resolution slices with checked answers. Add benign cases and harmless text-in-image instruction conflicts; score image-grounded utility separately from whether embedded instructions overrode the user's task.
- Evaluate identical item ids and prompts with intact images, an absent visual prefix, shuffled image assignments and corrupted images. Use a derangement with no retained original pair and inspect accidental semantic matches. Separate inference interventions from separately trained shuffled-pair controls.
- Hold candidate pools fixed for retrieval and decoding budgets fixed for generation. Report answer quality, valid-answer coverage, visual/text token counts, elapsed time and available peak-memory measurements by slice. A text-only baseline does less work; disclose that gap or add a length-matched blank-feature control instead of claiming exact compute matching.

**Reproduce:** Seed a manifest audit with an evaluation image that is a byte-identical training image under a new id, a re-encoded copy, and a new question derived from a training caption. Exact hashing must catch the first; parent lineage must catch the question; decoded-image comparison or reviewed near-duplicate search must catch the re-encoding. Quarantine the whole leaking source group and recompute the split report before examining model scores. Preserve the planted failures as regression fixtures.

**Traps**

- Treating changed filenames or caption paraphrases as held-out evidence. Shared pixels or answer provenance can cross the split without any repeated text.
- Expecting a shuffled-pair score to equal chance. Repeated objects, language priors and semantically similar images can retain useful information.
- Bootstrapping questions as independent when several refer to one image. Resample image groups for paired uncertainty, and keep training-seed variation separate.

**Practice**

- The section mini-project covers this: planted cross-modal leak detection, image-group held-out slices, text-only and checked shuffled-pair baselines, resolution and length controls, paired uncertainty and per-modality cost evidence in `lmlab`.

**Stop when:** The planted leaks are detected, and your comparison table keeps item identities, budgets, invalids and image-group uncertainty visible while preserving at least one negative result.

<details>
<summary>Self-test</summary>

1. Why can a higher resolution help OCR but not improve a counting or reasoning score?
   - It may preserve readable detail without fixing the model's reasoning or task representation. It also changes visual token count and computation, so measure each slice rather than asserting a universal gain.
2. Does a text-only score close to the intact score prove an assembly bug?
   - No. The data may be answerable from text or the trained model may use language shortcuts. Test controlled image-dependent items and inspect wiring before choosing an explanation.
3. Why is a random shuffle weaker than a checked derangement for an image intervention?
   - A random permutation may leave some original pairs intact. A derangement removes identity matches, although semantic matches still need inspection.

</details>

#### U9. Audio and video tokenization and native multimodal generation objectives

**About 2 h** · **Target:** Explain

Topics: Audio and video tokenization and temporal-alignment vocabulary; Image or audio generation objectives

This optional unit is a vocabulary bridge, not a second implementation project. It makes clear which parts of the image-text contract generalize to time and which require a decoder for the output modality.

**You can now**

- Explain video frame or tube tokens and audio codec tokens with explicit temporal alignment and rate budgets.
- Distinguish codec reconstruction, next-code prediction and conditional text generation objectives.
- Explain what an autoregressive mixed-modal model needs to generate images rather than only describe them.

**Study**

1. [Qwen2-VL, arXiv:2409.12191v1: video inputs](https://arxiv.org/abs/2409.12191v1) (Qwen2-VL: Enhancing Vision-Language Model's Perception of the World at Any Resolution (Wang et al., 2024)) - Section 2.1, Model Architecture: the M-RoPE paragraph and Figure 3 (temporal coordinates) and the Unified Image and Video Understanding paragraph (3D convolutions with a depth of two).
2. [EnCodec, arXiv:2210.13438v1](https://arxiv.org/html/2210.13438v1) (High Fidelity Neural Audio Compression (EnCodec)) - Sections 3.1 to 3.4 and Figure 1: encoder stride, residual vector quantization, code language model and training objectives. Depth: Stop before the experiments. No audio download, codec training or listening panel is required.
3. [Chameleon, arXiv:2405.09818v1](https://arxiv.org/abs/2405.09818v1) (Chameleon: Mixed-Modal Early-Fusion Foundation Models (Chameleon Team, 2024)) - Section 2 and Sections 2.1 to 2.3: autoregressive mixed-modal sequences, image tokenizer, pretraining data and stability. Depth: Read the representation and objective, not the full training recipe. Image generation does not require diffusion: this model predicts discrete image codes and decodes them.
4. [CS336 Spring 2026 Lecture 17: multimodal models](https://cs336.stanford.edu/lectures/?trace=lecture_17) (CS336 2026 - Alignment and Multimodality) - The `chameleon` block: discrete image tokens, training mixture and stability summary.

**Focus**

- Video needs time as well as frame-local position. Frame sampling, timestamps, temporal stride and dropped frames change the evidence; an average of frame embeddings can erase event order.
- Audio sample rate, latent frame rate and code-id rate are different. In the stated EnCodec encoder, strides 2, 4, 5 and 8 give total stride 320, hence 75 latent frames per second at 24 kHz. Each residual codebook adds another id per frame.
- The codec reconstructs waveforms with time-domain, spectral, adversarial and commitment losses. A separate language model predicts code distributions; codec reconstruction alone does not teach text-conditioned audio generation.
- Chameleon predicts categorical tokens in mixed text-image order. Its tokenizer maps a 512 by 512 image to 1024 codes from 8192 entries. Token count, codebook cardinality and output-decoding cost are separate quantities; the tokenizer's lost detail limits downstream reconstruction.

**Reproduce:** Without code or notes, budget a two-second, 24 kHz clip with encoder stride 320 and four 1024-entry codebooks: 150 latent frames, 600 code ids and 6000 fixed-width bits, or 3 kbps before framing and entropy coding. Contrast this with two image frames encoded by Chameleon's stated tokenizer: 2048 image codes, excluding separators. Explain why neither count alone specifies autoregressive latency: codebooks may be predicted in parallel rather than flattened into sequential steps.

**Traps**

- Calling a spectrogram frame or a continuous visual embedding a discrete vocabulary entry. Continuous features need a different prediction or output-decoding contract.
- Interpreting codec codebook size as sequence length. More codebooks or a longer recording add code ids without changing the number of entries per codebook.
- Comparing image and audio token likelihoods as if they shared a unit. Tokenization, codebook structure and loss weighting differ.

**Practice**

- [TensorTonic: Assign Multimodal RoPE Coordinates, Strided video grid case](https://www.tensortonic.com/problems/cs336-l17-multimodal-rope-coordinates) - The public Strided video grid case and its two-frame example with `frame_stride=2`. Reuse your coordinate builder. Explain the temporal coordinates and the next-segment offset when frame stride changes while the number of frames stays fixed. This is a coordinate exercise, not video understanding or audio generation; no second model training run is required.

**Stop when:** You reproduce the rate budget and strided-video coordinates, and can state the representation, prediction target and output decoder for text-conditioned image or audio generation without proposing a large training run.

<details>
<summary>Self-test</summary>

1. Does adding four residual codebooks make the latent frame rate four times higher?
   - No. The frame rate is unchanged; four code ids describe each frame. A flattened serialization would have four times as many ids as latent frames.
2. What is missing from a CLIP encoder plus a text decoder if the task is to output an image?
   - An image-output representation, a model objective for predicting it and a decoder that turns it into pixels. Describing an image in words does not supply those.
3. Why are equal numbers of video frames not necessarily equal temporal evidence?
   - Sampling rate and timestamps determine coverage and order. Sparse or irregular frames can miss short events even when the frame count matches.

</details>

### Mini-project: A grounded image-text branch with intervention evidence

**About 18 to 24 hours.** Extend `lmlab` with a frozen vision encoder and a tested projector into your existing causal decoder. Keep retrieval, answer generation and image dependence separate so a fluent answer or lower loss cannot stand in for grounding. Run on CPU or your GPU without paid generation.

1. Build the COCO manifest in `mm/` with caption and instruction parents, image-group splits, per-image rights, transformations, generator provenance and rejected-item counts. Plant renamed, re-encoded and caption-derived leaks; check hashes and reviewed lineage against known fixtures, quarantine affected groups and retain the audit.
2. Reuse TensorTonic Patchify and notebook Projector checks; add loop-oracle reconstruction, noncontiguous-input, dtype, parameter-count and zero-gate tests. Differential-test frozen-batch CLIP and SigLIP losses and gradients against OpenCLIP, reconciling reductions; retain resolution, token and FLOP budgets before training.
3. Connect frozen features through the projector to the causal decoder in `mm/`. Pass TensorTonic Multimodal RoPE coordinates, then independently test expanded labels, truncation, image ownership, padding, future-token isolation, serialization and cached-versus-full logits; retain failures. Optionally explain strided-video coordinates and audio/image generation's missing output contracts.
4. Check answer-only loss and gradients against a shifted-target oracle, optimizer membership and unchanged frozen tensors. Compare projector warmup plus bounded decoder updates against no warmup from shared state, across seeds with matched exposure and update budgets; retain compute differences and failed runs in `registry/`.
5. Build the original POPE random-negative scorer: test joins, missing and duplicate ids, strict parsing and confusion counts against hand-labeled fixtures. Reserve image groups before training; retain raw answers, parsed-subset metrics, all-item accuracy, yes ratio, invalids and coverage beside frozen retrieval and text-only baselines.
6. Evaluate intact, missing, corrupted and checked deranged-image conditions plus pixel-verified conflicting captions on identical held-out items. Predeclare object, text-in-image, spatial, counting, resolution and harmless embedded-instruction slices; check answers independently and retain image-group paired uncertainty separately from seed variation, including a negative or unresolved result.
7. Compare fixed retrieval candidates and generation budgets with length-matched blank features and a trained shuffled-pair control. Reconcile raw records with per-modality quality, coverage, token, latency and peak-memory tables in `reports/`; disclose unmatched compute, unknown pretraining overlap and distinctions between image dependence, grounding and safety.

**Deliverables**

- The `mm/` module, versioned COCO lineage, encoder and decoder identities, assembly metadata and independent correctness tests.
- Matched staged-training and modality-control records in `registry/`, including failed attempts and retained negative evidence.
- A `reports/` grounding dossier with original POPE answers, parser audits, retrieval and generation results, clustered uncertainty and modality costs.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [TensorTonic: Patchify a Batch of Images](https://www.tensortonic.com/problems/cs336-l17-vision-transformer-patchify). Reuse public patch cases; add reconstruction, noncontiguous-input and dtype checks.
- external-tests: [Modern LLM Notebook 29: Projector exercise](https://github.com/walkinglabs/modern-llm-notebook/blob/979eecf09669121167184ef925d8edbc089fc13e/notebooks-en/part4-frontiers/29-vlm.ipynb). Reuse the projector assertion, not the noncausal pipeline demo or post-normalization gate as an identity oracle.
- external-tests: [OpenCLIP release 3.3.0 loss oracle](https://github.com/mlfoundations/open_clip/blob/v3.3.0/src/open_clip/loss.py). Compare losses and feature, multiplier and bias gradients with normalized features and explicitly aligned reductions.
- external-tests: [TensorTonic: Assign Multimodal RoPE Coordinates](https://www.tensortonic.com/problems/cs336-l17-multimodal-rope-coordinates). Coordinate cases do not replace expanded-sequence, causal-mask or cached-decoding tests.
- external-tests: [Original POPE COCO random-negative questions at pinned commit](https://github.com/AoiDragon/POPE/blob/08d957b917e5a378a2f99d35b6293c536a66298b/output/coco/coco_pope_random.json). Use held-out image groups and your audited parser; disclose departures from the original evaluator and limited subset scope.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Lineage and leakage | Your audit catches all planted leak types, quarantines their source groups and preserves per-image rights, answer evidence, generator unknowns and rejection counts. | A rebuilt manifest reproduces splits and exposure counts; reviewed near-duplicate candidates distinguish semantic similarity from shared pixels without claiming clean pretraining. |
| Connected objective correctness | Your loop, gradient and OpenCLIP oracles pass before training; assembly, freeze boundaries, parameter counts, serialization and cached decoding pass independent regression tests. | Planted mask, reduction, image-ownership and stale-feature defects fail their intended checks; actual optimizer and activation storage explain the resource ledger. |
| Grounding attribution | Your hand-checked scorer preserves invalids and ids; retrieval, answer quality and modality interventions retain fixed budgets, clustered uncertainty, seed variation and negative evidence. | Separate inference interventions and trained shuffled-pair controls isolate language shortcuts, resolution and extra-context explanations; no benchmark outcome is presented as general multimodal safety. |

Feeds into: The image-text module, modality failures, lineage and cost records feed Alignment, Safety and Release's threat model and the capstone's bounded module; Research-Scale Integration joins their identities and reproduces the supported claims.

### Resource route

- **Primary - Course:** [CS336 2026 - Alignment and Multimodality](https://cs336.stanford.edu/lectures/?trace=lecture_17) - Step through the Lecture 17 trace ("multimodal models": CLIP, SigLIP, LLaVA, LLaVA-OneVision, Qwen-VL, Qwen2-VL, Qwen3-VL, Chameleon). Reconstruct patching, projector, fusion, multimodal positions and the chosen objective before implementing the bounded image-text path.
- **Required - Paper-code:** [CLIP Paper and Official Code](https://proceedings.mlr.press/v139/radford21a/radford21a.pdf) - Read Section 2.2 and the Figure 3 pseudocode (normalized embeddings, logits scaled by a learned temperature, the symmetric cross-entropy), then Section 2.3. Check preprocessing and tokenization in the official code (`clip/clip.py` `_transform` and `tokenize`, https://github.com/openai/CLIP). The README says logits are "times 100", but the model learns the scale.
- **Required - Paper:** [Sigmoid Loss for Language Image Pre-Training (Zhai et al., 2023)](https://arxiv.org/abs/2303.15343) - Read Sections 3.1 and 3.2 and Algorithm 1: a pairwise sigmoid loss with a learned temperature and bias instead of a softmax over the batch. Negatives still matter; keep the reduction convention explicit.
- **Required - Paper-code:** [LLaVA - Visual Instruction Tuning](https://arxiv.org/abs/2304.08485) - Read Section 3 (GPT-assisted instruction data built from captions and boxes) and Sections 4.1 and 4.2 (a linear projection, then two-stage training). LLaVA-1.5 (https://arxiv.org/abs/2310.03744) swaps in a two-layer MLP; see `build_vision_projector` in the code. Build only a tiny frozen-encoder plus projector path and compare it with text-only and shuffled-pair controls.
- **Required - Paper:** [Qwen2-VL: Enhancing Vision-Language Model's Perception of the World at Any Resolution (Wang et al., 2024)](https://arxiv.org/abs/2409.12191) - Read Section 2.1 and Figure 3 (dynamic resolution, 2x2 token merging, M-RoPE with temporal, height and width components) and Section 3.3.2 (the M-RoPE ablation). Variable resolution means variable tokens and memory.
- **Required - Benchmark:** [POPE: Evaluating Object Hallucination in Large Vision-Language Models](https://github.com/AoiDragon/POPE/tree/08d957b917e5a378a2f99d35b6293c536a66298b) - Read Sections 5.1 and 5.2 of the paper (https://aclanthology.org/2023.emnlp-main.20.pdf), then evaluate one negative-sampling slice (random, popular or adversarial) with accuracy, F1 and the yes ratio. Join answers by question id, not row order, and keep the original files apart from POPEv2.
- **Support - Lab:** [Modern LLM Notebook - Vision-Language Models](https://github.com/walkinglabs/modern-llm-notebook/tree/979eecf09669121167184ef925d8edbc089fc13e) - Complete `notebooks-en/part4-frontiers/29-vlm.ipynb` through the minimal VLM. Add missing-image, conflicting-caption, resolution and serialization tests that the walkthrough does not supply.
- **Support - Course:** [smol-course Unit 3 - Vision Language Models](https://huggingface.co/learn/smol-course/unit3/1) - Work through Unit 3 for a runnable VLM fine-tuning path on SmolVLM2. Check its memory notes against your GPU and shrink the model, image resolution or batch before running.
- **Support - Dataset:** [COCO Captions Subset](https://cocodataset.org/#termsofuse) - Select 50 to 200 image ids from one annotation split with all their captions, record each image's license, and keep every caption of an evaluation image out of training. The annotations are CC BY 4.0; the images keep their own terms.
- **Support - Paper:** [Flamingo: a Visual Language Model for Few-Shot Learning (Alayrac et al., 2022)](https://arxiv.org/abs/2204.14198) - Read Sections 2.1 to 2.3 (details in Appendix A.1.1 to A.1.3): the Perceiver Resampler, gated cross-attention with tanh gates starting at zero, and multi-image masking. It is the cross-attention contrast to LLaVA's token concatenation.
- **Support - Practice:** [TensorTonic - Alignment and Multimodality Set](https://www.tensortonic.com/problems/cs336-l17-symmetric-clip-loss) - Solve Patchify a Batch of Images (`cs336-l17-vision-transformer-patchify`), Implement Symmetric CLIP Contrastive Loss (`cs336-l17-symmetric-clip-loss`), Implement the SigLIP Pairwise Loss (`cs336-l17-siglip-pairwise-loss`) and Assign Multimodal RoPE Coordinates (`cs336-l17-multimodal-rope-coordinates`). Its SigLIP loss averages over all B squared pairs while OpenCLIP divides the sum by B, so multiply by B before comparing. Public test cases check the listed edge cases, not gradients or the hidden grader, so keep your own tests beside each solution. 
- **Reference - Implementation:** [OpenCLIP](https://github.com/mlfoundations/open_clip) - Use release 3.3.0 for one small comparison: `ClipLoss` and `SigLipLoss` in `src/open_clip/loss.py` as oracles for your losses, and the zero-shot classifier. OpenAI RN50 weights need `force_quick_gelu=True`. The main branch has a refactored training stack; do not adopt the distributed trainer.
- **Reference - Paper:** [Chameleon: Mixed-Modal Early-Fusion Foundation Models (Chameleon Team, 2024)](https://arxiv.org/abs/2405.09818) - Read Sections 2.1 to 2.3: images as 1024 discrete tokens from an 8192-entry codebook, interleaved data and the stability fixes. Early fusion still depends on the image tokenizer.
- **Support - Project:** [LLM Post-Training Laboratory - Multimodal Module](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-3/llm-post-training-laboratory.md) - Use the optional multimodal evidence module for versioned aligned data, projector or fusion tests, retrieval and generation evaluation, and modality-specific safety checks.
- **Reference - Paper:** [High Fidelity Neural Audio Compression (EnCodec)](https://arxiv.org/html/2210.13438v1) - Sections 3.1 to 3.4 of arXiv:2210.13438v1: temporal downsampling, residual codebooks, code prediction and codec reconstruction objectives. Read for audio-token vocabulary and rate accounting, not a codec training run.

### Exit checkpoint

Implement one image-text encoder, projector or fusion mechanism; verify masks and positions; compare against text-only and corrupted-pair baselines; and report retrieval or generation quality, grounding failures and compute by modality slice.

<details>
<summary>Deliberately left for later</summary>

- Training a general-purpose frontier VLM
- Audio, video and image-generation model families
- Production multimodal serving and high-resolution optimization

</details>

## LMR-10. Alignment, Safety and Release Evaluation

**Why:** A safety score is meaningful only relative to a threat model, benign utility and adaptive attacks. This stage tests training and mitigation claims without equating refusal or benchmark success with alignment.

### Learn this much

- [ ] Behavioral specification, policy boundaries and unresolved normative choices _(Required)_
- [ ] Assets, actors, capabilities, attack surfaces, mitigations and residual consequences _(Required)_
- [ ] Harmful capability, elicitation and harmful compliance as distinct measurements _(Required)_
- [ ] Refusal, overrefusal, helpfulness and safe-completion trade-offs _(Required)_
- [ ] Jailbreak, prompt-injection and multi-turn attack families _(Required)_
- [ ] Memorization, training-data extraction and sensitive-information leakage _(Required)_
- [ ] Bias, representation, disparate errors and affected-group slices _(Required)_
- [ ] Adaptive red teaming, attack provenance and held-out attack families _(Required)_
- [ ] Matched benign utility and false-positive controls _(Required)_
- [ ] Deterministic, model-graded and human safety-evaluator calibration _(Required)_
- [ ] Reward-model and evaluator exploitation, style and length shortcuts _(Required)_
- [ ] Safety SFT, preference and constitutional data lineage _(Required)_
- [ ] Critique, revision and AI-feedback loops with explicit principles _(Required)_
- [ ] Training, classifier, system and monitoring mitigations as defense in depth _(Required)_
- [ ] Capability-safety trade-off curves rather than aggregate refusal rates _(Required)_
- [ ] Safety-test contamination, stale attacks and test-set gaming _(Required)_
- [ ] Predeclared capability, safety and uncertainty release thresholds _(Required)_
- [ ] Staged rollout, monitoring, incident response and rollback _(Required)_
- [ ] Residual risk, evidence gaps and explicit ownership _(Required)_
- [ ] Activation probes and mechanistic evidence as supporting, not conclusive, safety evidence _(Optional)_
- [ ] Debate, recursive oversight and supervision beyond human capability _(Optional)_
- [ ] Sparse autoencoders, causal tracing and mechanistic anomaly research _(Depth)_
- [ ] Frontier safety certification or real dangerous-capability testing _(Later)_

### Study units

#### U1. Behavioral specifications, policy boundaries and threat models

**About 4 h** · **Target:** Explain

Topics: Behavioral specification, policy boundaries and unresolved normative choices; Assets, actors, capabilities, attack surfaces, mitigations and residual consequences

The Systems unit on security goals, trust boundaries and threat models taught system threat modeling. Here the new job is to connect a model behavior to a plausible harm and a measurable policy boundary, not just draw the system.

**You can now**

- Separate intended behavior, observed compliance and unresolved policy choices.
- Map an LLM application's assets, actors, access, trust boundaries and residual consequences to testable claims.
- Specify expected behavior for benign, ambiguous and disallowed requests before labeling outputs.

**Study**

1. [OpenAI Model Spec, 2026-08-18: one worked behavior contract](https://model-spec.openai.com/2026-08-18.html) (OpenAI Model Spec (2026-08-18)) - Instructions and levels of authority; The chain of command, especially Follow all applicable instructions and Ignore untrusted data by default; Protect people's privacy. Depth: Read these sections and their examples only. Treat the vendor's choices as an example, not a universal policy or evidence of compliance.
2. [ARENA 3.1: Threat-Modeling & Specification Design](https://learn.arena.education/chapter3_llm_evals/01_intro_evals/3-threat-modeling-specification-design/) (ARENA - Evals, Alignment and Interpretability) - What are evals trying to achieve?; Threat-Modeling; Specification; Question Design. Depth: Work by hand. Skip hosted API calls and the alignment-faking replication.
3. [NIST AI 600-1: policy and threat-model ownership](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf) (NIST AI RMF Generative AI Profile) - Section 3, GOVERN 3.2: GV-3.2-003 (acceptable use and refusal criteria) and GV-3.2-005 (threat modeling).

**Focus**

- Write the deployment scope first: a local assistant with offline documents and no real credentials or external actions. Name who can edit user messages, retrieved text and tool results.
- Give every test a policy clause, expected behavior, severity and rationale. Clarification and safe assistance are distinct from refusal.
- Connect each threat to an asset, attacker capability, entry point, mitigation, detection signal and residual consequence. Record assumptions the experiment cannot test.
- Freeze the specification before labels. Keep disputed normative cases visible rather than relabeling them to match a benchmark.

**Reproduce:** Closed-book, trace a fake instruction in a retrieved document through an offline assistant to an unauthorized disclosure of a synthetic secret. Mark the authority boundary, then write one benign request, one ambiguous request and one disallowed request with expected behavior and the policy clause that decides each.

**Traps**

- Calling a specification an empirical safety result. It states what should happen; the campaign measures what actually happens.
- Treating a model's stated intentions or multiple-choice answer as proof of its motives. Measure behavior under a stated protocol instead.
- Letting the benchmark silently define policy. Its labels may disagree with your intended application.

**Practice**

- [ARENA 3.1: Build threat models; Design a specification](https://learn.arena.education/chapter3_llm_evals/01_intro_evals/3-threat-modeling-specification-design/) - Exercises Build threat models and Design a specification. Adapt one property to your offline assistant. Write the causal scenario and operational definitions by hand; no paid API is needed. Keep the assumptions and unresolved choices for the campaign.

**Stop when:** Your written scope and policy decide the three boundary cases, and every modeled threat ends in a testable claim or an owned evidence gap.

<details>
<summary>Self-test</summary>

1. A retrieved page says it is a system message. Does that grant it authority?
   - No. Its provenance remains untrusted retrieved data. A textual claim of authority does not change the message's trust boundary.
2. Why keep ambiguous requests in the specification?
   - They test clarification and context-sensitive assistance. A binary refuse-or-comply policy can hide both unsafe completions and unnecessary refusals.
3. A test passes, but its assumed tool permission is absent in the application. What follows?
   - The result describes that test configuration, not the proposed harm pathway. Reconcile the access assumption before using it in the safety argument.

</details>

#### U2. Harmful capability versus harmful compliance, refusal and overrefusal

**About 4 h** · **Target:** Measure

Topics: Harmful capability, elicitation and harmful compliance as distinct measurements; Refusal, overrefusal, helpfulness and safe-completion trade-offs

A model can stop saying refusal phrases without producing useful harmful content. It can also improve a safety score by refusing everything. This unit establishes the two-sided baseline for the campaign.

**You can now**

- Measure harmful compliance, refusal and benign overrefusal as separate outcomes.
- Distinguish failed elicitation from evidence that a model lacks a capability.
- Diagnose a safety-score gain caused by indiscriminate refusal or degraded answer quality.

**Study**

1. [CS336 Spring 2026 Assignment 5 supplement, Version 26.0.0](https://github.com/stanford-cs336/assignment5-alignment/blob/main/cs336_spring2026_assignment5_supplement_safety_rlhf.pdf) (CS336 Assignment 5 Supplement - Safety Alignment) - Sections 3.4 and 5.4: SimpleSafetyTests before and after SFT, problems `sst_baseline` and `sst_sft`. Depth: Keep the before/after protocol, not the large models or hosted setup. Use the small-model substitute in Practice and hand labels instead of the 70B grader.
2. [XSTest: safe and unsafe contrast prompts](https://github.com/paul-rottger/xstest/tree/d7bb5bd738c1fcbc36edd83d5e7d1b71a3e2d84d) (XSTest: Exaggerated Safety Behaviours in Large Language Models) - README, Using XSTest; `xstest_prompts.csv`, columns `id`, `type` and `label`; `evaluation/classify_completions_strmatch.py`.
3. [StrongREJECT, arXiv:2402.10260v1](https://arxiv.org/html/2402.10260v1) (A StrongREJECT for Empty Jailbreaks (Souly et al., 2024)) - Section 2.2, Response evaluation; Section 3.4, Our StrongREJECT autograder; Sections 6.2 and 6.3 on capability degradation. Depth: Study the rubric and controls. Do not run its paid or gated graders.

**Focus**

- The pinned XSTest table has 250 safe prompts and 200 unsafe contrast prompts. Preserve row IDs and report denominators separately; a small subset is not the full benchmark.
- Label refusal, policy violation and useful assistance separately. A disclaimer followed by a disallowed answer remains a violation; a harmless off-topic answer is not useful compliance.
- Use the written policy to adjudicate borderline cases. Review offensive or distressing examples privately and stop review when needed; do not publish raw harmful generations.
- Freeze checkpoint, template, decoding, token budget and item IDs across comparisons. Failed generations remain in the ledger with explicit status.

**Reproduce:** Closed-book, construct a score table for an always-refuse assistant and an always-answer assistant on your policy-labeled safe and unsafe slices. The first has complete overrefusal on safe requests and no harmful compliance if its refusals contain no disallowed content. The second's harmful-compliance rate still depends on what its answers actually contain, not just the absence of refusal words.

**Traps**

- Calling non-refusal an attack success. StrongREJECT checks whether the answer actually addresses the harmful goal.
- Calling failure on one prompt proof of absent capability. Prompting, output budget and model comprehension can all limit elicitation.
- Using XSTest's string labels as policy truth. Its prefix matcher has no partial-compliance category and can mistake an apology for a full refusal.

**Practice**

- [CS336 supplement: `sst_baseline` and `sst_sft`, reduced-scale adaptation](https://github.com/stanford-cs336/assignment5-alignment/blob/main/cs336_spring2026_assignment5_supplement_safety_rlhf.pdf) - Sections 3.4 and 5.4; retain prompts, raw generations and item-level scores. Use your existing small SFT checkpoint and its parent. Otherwise use HuggingFaceTB/SmolLM2-135M-Instruct at revision 12fd25f77366fa6b3b4b768ec3050bf629380bac as a single baseline, with transformers 5.19 and PyTorch 2.14.1. Generate a preselected small harm-area-balanced SimpleSafetyTests subset and a type-balanced XSTest subset on your GPU or CPU, one request at a time. Record the chat template and a fixed short output budget. Hand-score both; there are no public safety-label tests. Do not claim an SFT effect without two related checkpoints. The handouts and tests are public study material; never publish course solutions.

**Stop when:** Your baseline report separates harmful compliance, safe-prompt overrefusal and useful benign answers, with item IDs, raw outputs, failure counts and a stated elicitation limit.

<details>
<summary>Self-test</summary>

1. Can refusal rate rise while useful safety gets worse?
   - Yes. Benign requests may be refused more often while harmful completions persist. Inspect both slices and the content of each answer.
2. An encoded attack produces nonsense rather than a refusal. Is it successful?
   - Not on that evidence. Non-refusal alone does not establish useful harmful assistance; the encoding may have destroyed comprehension.
3. Why not pool the safe and unsafe denominators?
   - Their desired behaviors differ. A pooled score changes with the slice mixture and can hide benign utility loss.

</details>

#### U3. Jailbreak, prompt-injection and multi-turn attacks, and adaptive red teaming

**About 5 h** · **Target:** Implement + Measure

Topics: Jailbreak, prompt-injection and multi-turn attack families; Adaptive red teaming, attack provenance and held-out attack families

The Systems unit on tenant isolation, input validation and injection covered classic injection. LLM attacks add natural-language instruction conflicts and adaptive feedback, so a fixed prompt list cannot establish resistance to a changing attacker.

**You can now**

- Implement a bounded adaptive attack loop with complete query and feedback provenance.
- Distinguish direct jailbreaks, indirect injection and target-side multi-turn attacks.
- Measure mitigation generalization on attack families excluded from development.

**Study**

1. [Indirect prompt injection, arXiv:2302.12173v1](https://arxiv.org/abs/2302.12173v1) (Not What You've Signed Up For: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection (Greshake et al., 2023)) - Figures 1 and 2; Section 3, Attack Surface of Application-Integrated Large Language Models; Section 4, Discussion on the Validity of Attacks. Depth: Read the trust boundaries and synthetic application, not the product demonstrations as current vulnerabilities. Never target a live third-party system.
2. [PAIR, arXiv:2310.08419v1](https://arxiv.org/abs/2310.08419v1) (Jailbreaking Black Box Large Language Models in Twenty Queries (Chao et al., 2023)) - Section 3, especially Algorithm 1 and Sections 3.1, 3.2 and 3.4. Depth: Reconstruct one serial stream. Skip published multi-model sweeps and hosted attackers or judges.
3. [CS336 supplement: red-team after instruction tuning](https://github.com/stanford-cs336/assignment5-alignment/blob/main/cs336_spring2026_assignment5_supplement_safety_rlhf.pdf) (CS336 Assignment 5 Supplement - Safety Alignment) - Section 5.5, problem `red_teaming`.

**Focus**

- A direct jailbreak tries to override policy through the user's request. Indirect injection arrives through lower-trust retrieved content. Multi-turn attacks preserve target conversation state; record it explicitly.
- PAIR retains attacker history but normally gives the target a fresh candidate prompt. Do not describe that alone as target-side multi-turn evaluation.
- Retain parent attack ID, source, family, edits, feedback, target checkpoint, full transcript, query count and token budget. Count unsuccessful and malformed attempts too.
- Split by attack family and source before tuning. Freeze the defense, then allow a fresh, budget-matched adaptation on held-out families without changing the defense again.

**Reproduce:** Closed-book, draw one PAIR stream from candidate to target response to judged feedback to revised candidate. Then contrast it with a target conversation that retains earlier turns. Give each an explicit stopping budget and show which transcript must be restored to replay an unsuccessful attempt.

**Traps**

- Reporting only the winning prompt. Selection consumed failed queries and can overstate a method's efficiency.
- Counting paraphrases of a training attack as held-out families. Shared templates and sources can leak across the split.
- Using a fake secret copied into the attack itself as extraction evidence. Success must require crossing the boundary, not echoing attacker-supplied text.

**Practice**

- [CS336 supplement: `red_teaming`, local adaptive extension](https://github.com/stanford-cs336/assignment5-alignment/blob/main/cs336_spring2026_assignment5_supplement_safety_rlhf.pdf) - Section 5.5, `red_teaming`. Use the frozen small checkpoint and software from the earlier unit on harmful compliance and overrefusal. Bound one stream to five target queries per behavior; act as the attacker by hand and hand-check feedback. Include direct, offline retrieved-text and target-history cases using invented policy violations only. Disable network tools and real credentials. This is a reduced manual adaptation, not a PAIR replication. Keep regression fixtures for the query cap and transcript replay; the course has no public attack-success tests. Never publish course solutions.

**Stop when:** You can replay every attempt, enforce the declared budget, and report static versus adaptive outcomes on a family-held-out slice with all failures retained.

<details>
<summary>Self-test</summary>

1. Two attacks each succeed once, but one uses more retries. Are their success rates comparable?
   - Not without a common budget and success unit. Report success per behavior under the same query and token limits, plus the cost of all attempts.
2. Does an attacker editing a retrieved document need control of the user's prompt?
   - No. Retrieval can carry attacker text into the assistant even when the user makes an ordinary request.
3. Why rerun an adaptive attacker after installing a defense?
   - A defense may only block known strings. Fresh feedback tests whether the attacker can route around it within the declared budget.

</details>

#### U4. Memorization, training-data extraction and sensitive-information leakage

**About 4 h** · **Target:** Measure

Topics: Memorization, training-data extraction and sensitive-information leakage

The Systems unit on membership inference, extraction, inversion and poisoning and the LLM Foundations unit on contamination and memorization introduced the attacks. The new evidence is controlled exposure in your own training pipeline, not searching a pretrained model for real people's records.

**You can now**

- Measure extraction of planted synthetic canaries under a declared access and query budget.
- Separate training-data memorization, prefix-assisted discovery and leakage from the current context.
- Explain why a failed extraction attempt and low perplexity alone cannot establish a privacy guarantee.

**Study**

1. [Carlini et al., USENIX Security 2021 proceedings](https://www.usenix.org/system/files/sec21-carlini-extracting.pdf) (Extracting Training Data from Large Language Models (Carlini et al., 2021)) - Section 3, Threat Model & Ethics, especially Definitions 1 and 2, Section 3.2 threat model and Section 3.4 ethics; Section 5.2, Improved Membership Inference. Depth: Study the generation-and-ranking method, but replace all real-data discovery and validation with your own invented canaries. Do not reproduce Internet searches for personal records.
2. [Nasr et al., arXiv:2311.17035v1](https://arxiv.org/html/2311.17035v1) (Scalable Extraction of Training Data from (Production) Language Models (Nasr et al., 2023)) - Section 1, Ethics & Responsible Disclosure; Section 3.1, Prior Approaches and Definitions; Section 3.5, Discoverable Mem. vs. Extractable Mem. Depth: Stop at the definitions and limits. Production-endpoint attacks and large-corpus searches are not practice.

**Focus**

- Plant invented random strings in a known number of training documents. Track document multiplicity separately from repeated occurrences and actual token exposure.
- Use an untouched checkpoint and untrained canaries as controls. Keep all secret suffixes out of prompts, retrieval, judge instructions and logs exposed to the target.
- Predeclare byte-exact suffix matching, prefix lengths, decoding and total attempts. Report prefix-assisted and unprompted results separately, including negative results.
- Perplexity or a reference-model ratio ranks candidates; it does not prove membership. Matching a known planted suffix supplies ground truth for this experiment only.

**Reproduce:** Closed-book, design a canary experiment with a training-exposed string, an untrained control string and an unchanged checkpoint. Specify which prefix the attacker knows and which suffix must be generated. Draw a separate path for a synthetic secret present only in retrieved context, and explain why that path tests context leakage rather than training memorization.

**Traps**

- Scoring tokens supplied in the prefix as extracted content. Score only the withheld suffix and record how much context the attack received.
- Interpreting non-extraction as non-memorization. A finite attack can miss stored information or lack a suitable prompt.
- Assuming public information has no privacy risk. Reproduction in a new context can violate contextual integrity.

**Practice**

- The section mini-project covers this: a bounded synthetic-canary exposure study on your existing tiny decoder, with an unchanged checkpoint, untrained canaries, withheld suffixes, complete query records and a separate synthetic context-leakage test. Reuse the recorded training stack; CPU with a smaller decoder is sufficient. No real personal data or production endpoint is involved.

**Stop when:** Your privacy evidence distinguishes exposure from discovery, includes controls and failed queries, and states exactly which matching rule and attack budget the result supports.

<details>
<summary>Self-test</summary>

1. A canary occurs ten times in one training document. Is its document multiplicity ten?
   - No. It is one document under the paper's definition. Repeated occurrences and token exposure are separate experimental quantities.
2. A low-perplexity completion looks like an address. Does it prove extraction?
   - No. It may be common, fabricated or inferable. This exercise verifies only exact matches to known synthetic training records.
3. Why compare with an unchanged checkpoint?
   - It helps distinguish an effect of your planted-data training from pre-existing completion behavior. It does not by itself prove that every observed difference is memorization.

</details>

#### U5. Bias, representation and disparate errors across affected-group slices

**About 3 h** · **Target:** Measure

Topics: Bias, representation, disparate errors and affected-group slices

The Classical ML unit on learning curves, error taxonomies and slices taught slice reporting. Here the new job is to test whether stereotypes replace missing evidence or override supplied evidence, not merely to find a low-scoring subgroup.

**You can now**

- Measure ambiguous and disambiguated BBQ outcomes separately, with affected-group support counts.
- Distinguish representational harm from disparate task errors and option-order artifacts.
- State what one US-English benchmark category cannot establish about fairness.

**Study**

1. [BBQ, Findings of ACL 2022 proceedings](https://aclanthology.org/2022.findings-acl.165.pdf) (BBQ: A Hand-Built Bias Benchmark for Question Answering) - Sections 3 to 5: coverage, template construction, validation, accuracy and bias scores; Figure 1's ambiguous/disambiguated contrast.
2. [BBQ data and metadata contract](https://github.com/nyu-mll/BBQ/tree/bea11bd97d79217245b5871acd247b9d6eb24598) (BBQ: A Hand-Built Bias Benchmark for Question Answering) - README, File structure and Models; `data`, `templates` and `supplemental/additional_metadata.csv`. Depth: Choose one category and a small template-balanced subset. Preserve both context conditions and question polarities; do not reproduce the full model sweep.
3. [NIST AI 600-1: bias beyond one benchmark](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf) (NIST AI RMF Generative AI Profile) - Section 2.6, Harmful Bias and Homogenization.

**Focus**

- An ambiguous context supports the unknown answer. A disambiguated context supplies evidence for a person. Always choosing unknown trades stereotype avoidance for task failure.
- Join metadata by category and example ID, not example ID alone. Use the bias target and question polarity to identify stereotype-aligned outputs; an incorrect answer is not automatically stereotype-aligned.
- Report accuracy, unknown-answer rate, invalid outputs, support and bias score separately by context. Undefined conditional scores stay undefined when every valid answer is unknown.
- Keep template variants together for splitting and uncertainty. Name-based categories are imperfect proxies, and the benchmark's US-English stereotypes do not define global fairness.

**Reproduce:** Closed-book, apply Section 5's ambiguous-context bias score to an invented table of 20 valid answers: 12 unknown, six stereotype-aligned and two against the stereotype. Accuracy is 60%, the conditional directional score is 0.5, and the ambiguity-scaled score is 0.2, or 20%. Then explain why balanced directional errors could give zero bias score while accuracy remains poor.

**Traps**

- Calling a zero directional score unbiased behavior. Opposing stereotypes or other errors can cancel in the aggregate.
- Treating every template expansion as an independent observation. Shared wording and labels induce dependence.
- Silently dropping unparsable answers. Declare a parsing policy and show invalid counts; an instrument failure is not a fairness improvement.

**Practice**

- The section mini-project covers this: one pinned BBQ category with a template-balanced local-model subset, option-order checks, metadata-validated target labels, separate context-condition results and support-counted affected-group slices. Use the campaign's frozen small checkpoint and software; manually review a few scoring decisions.

**Stop when:** Your category report separates evidence use from stereotype direction, reproduces the toy score, and names coverage, parsing and template-dependence limits.

<details>
<summary>Self-test</summary>

1. Why report disambiguated cases whose answer contradicts the stereotype?
   - They test whether explicit evidence overrides the stereotype. Overall accuracy can hide a gap between aligned and nonaligned correct answers.
2. Every ambiguous answer is unknown. What is the conditional directional score?
   - Undefined because there are no non-unknown outputs. The ambiguity-scaled score can be reported as zero by an explicit convention, alongside perfect ambiguous accuracy and the zero denominator.
3. Does one category with no measured gap establish fairness?
   - No. Coverage, statistical power, deployment population, language and untested harms remain limits.

</details>

#### U6. Matched benign utility controls and safety-evaluator calibration

**About 4 h** · **Target:** Measure

Topics: Matched benign utility and false-positive controls; Deterministic, model-graded and human safety-evaluator calibration

The LLM Foundations unit on model judges and human review and the Classical ML unit on cost-sensitive thresholds, imbalance and prevalence change supply the tools. The new job is to show that a safety grader remains trustworthy on refusals, partial compliance and unfamiliar attacks.

**You can now**

- Calibrate deterministic and local model graders against a policy-linked hand-labeled subset.
- Measure grader false positives, false negatives, parse failures and uncertainty separately from model behavior.
- Compare interventions with matched benign tasks, not refusal rates alone.

**Study**

1. [Inspect Evals: XSTest task 5-A](https://github.com/UKGovernmentBEIS/inspect_evals/blob/d2d3aac91a37a8c7c8ed3de8b4e899c2594f24a9/src/inspect_evals/xstest/xstest.py) (Inspect and Inspect Evals) - `scorer_template`, `scorer_instructions`, `xstest`, `refusal_rate` and `record_to_sample`; accompanying README, Scoring and Changelog. Depth: Inspect the interfaces, then build a local adaptation. Do not invoke the default OpenAI scorer. Give changed scoring rules their own task version.
2. [StrongREJECT: rubric and human calibration, arXiv:2402.10260v1](https://arxiv.org/html/2402.10260v1) (A StrongREJECT for Empty Jailbreaks (Souly et al., 2024)) - Section 3.4; Sections 4.2 and 5; Appendix A.4 grading instructions. Depth: Use the rubric as a manually checked measurement design, not a claim that a tiny local judge reproduces the paper's grader.
3. [CS336 supplement: benign baselines beside safety](https://github.com/stanford-cs336/assignment5-alignment/blob/main/cs336_spring2026_assignment5_supplement_safety_rlhf.pdf) (CS336 Assignment 5 Supplement - Safety Alignment) - Sections 3.1 to 3.4 and 5.1 to 5.4: knowledge, arithmetic, instruction utility and safety. Depth: Reuse a small frozen benign subset and saved outputs. Replace AlpacaEval's large judge with a blind hand review; do not run the full suites.

**Focus**

- Write labels from the frozen policy before seeing automatic scores. Reserve separate examples for rubric development and held-out grader assessment; adjudicate uncertain cases with reasons.
- Compare string refusal detection and a rubric-based local judge on identical saved outputs. Keep semantic harmfulness separate from refusal class and answer quality.
- Match benign controls by task type, topic, format and output budget where possible. Include ordinary utility tasks as well as XSTest's sensitive-but-benign prompts.
- Define harmful output as the positive class when reporting detection precision and recall. Also report grader coverage, confusion counts, uncertainty and errors by attack family.

**Reproduce:** Closed-book, score an invented held-out ledger of 20 outputs: eight are harmful by adjudicated labels; the grader flags six of those and four of the twelve harmless outputs. Recover six true positives, two false negatives, four false positives and eight true negatives. Detection precision is 60%, recall is 75%, and the false-positive rate is one third. Explain why none is the target model's harmful-compliance rate.

**Traps**

- Optimizing a rubric and reporting its agreement on the same labels. Hold out calibration-assessment cases as well as final model-evaluation cases.
- Treating unparseable judge output as a safe target response. Preserve it as an instrument failure with a predeclared denominator policy.
- Trusting aggregate agreement dominated by easy refusals. Inspect partial compliance, safe completion and family-specific errors.

**Practice**

- The section mini-project covers this: one versioned Inspect adaptation with a deterministic scorer and a local rubric scorer, calibrated against held-out hand labels, plus matched benign controls. Pin inspect-ai 0.3.281 and the Inspect Evals commit in Study; reuse the frozen SmolLM2 baseline and transformers 5.19/PyTorch 2.14.1. Score saved outputs sequentially on CPU if needed. Keep task 5-A as a reference, not the name of your changed scorer. If the local judge fails calibration, retain its diagnostic results and use hand review for decisions.

**Stop when:** Your held-out grader report includes confusion counts, coverage and family-level disagreements, and every safety comparison has a paired benign-utility result.

<details>
<summary>Self-test</summary>

1. A grader flags almost nothing on a mostly harmless set and has high accuracy. Is it adequate?
   - Not necessarily. Harm detection recall may be poor. Inspect confusion counts and errors on harmful and partial-compliance examples.
2. Why retain both XSTest and ordinary benign tasks?
   - XSTest measures exaggerated safety refusals. Ordinary tasks test broader usefulness that can regress without appearing as an explicit refusal.
3. The local judge performs poorly on held-out hand labels. What should the release report use?
   - Hand-adjudicated outcomes on a bounded subset, with uncertainty and the judge failure disclosed. A weak grader is not made valid by automation.

</details>

#### U7. Reward and evaluator gaming, and safety-test contamination and stale attacks

**About 3 h** · **Target:** Measure

Topics: Reward-model and evaluator exploitation, style and length shortcuts; Safety-test contamination, stale attacks and test-set gaming

The LLM Foundations unit on contamination and memorization covered exposed test items. The new failure is selection against a safety instrument: a model or developer can learn its shortcuts without improving the policy behavior the instrument was meant to measure.

**You can now**

- Expose a reward or grader improvement that does not survive independent behavior review.
- Audit safety-test exposure, attack-family overlap and stale evaluator versions.
- Protect final evaluation from repeated prompt, defense and threshold selection.

**Study**

1. [StrongREJECT: scoring shortcuts, arXiv:2402.10260v1](https://arxiv.org/html/2402.10260v1) (A StrongREJECT for Empty Jailbreaks (Souly et al., 2024)) - Section 2.2; Section 5; Appendix B, Autograder Robustness Experiments. Depth: Focus on enthusiastic but uninformative answers, disclaimers and errors that depend on attack format. Skip new attack generation.
2. [NIST AI 600-1: evaluation provenance and validity](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf) (NIST AI RMF Generative AI Profile) - Section 3: MS-2.5-005 (training and TEVV provenance), MS-2.5-006 (review guardrails), MS-2.11-001 (benchmark limitations and cross contamination), MS-2.13-001 (measurement error).
3. [LLM Post-Training Laboratory: proxy failure campaign](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-3/llm-post-training-laboratory.md) (LLM Post-Training Laboratory - Safety Campaign) - Milestone D, Failure handling; Milestone F, Final evaluation; Correctness requirements; Failure-injection requirements. Depth: Use the reward/behavior divergence and final-evaluation requirements only; do not repeat earlier training stages.

**Focus**

- Audit the measuring instrument with content-preserving style and length changes. A score change is suspicious only after checking that the edit preserved the policy-relevant meaning.
- Trace safety items through SFT data, preference data, synthetic critiques, prompt development and evaluator tuning. Exact text checks miss shared templates and paraphrased attack families.
- Separate development attacks, grader-calibration cases and final held-out families. Repeatedly choosing the best defense on the final set turns it into development data.
- Freeze evaluator prompts, parsing, task revision, model revision and denominator rules. Add fresh attacks on a scheduled review, but keep a fixed regression set for longitudinal comparisons.

**Reproduce:** Closed-book, design a harmless proxy hack: prepend an apology to an otherwise useful answer to a benign request. The XSTest prefix matcher calls an answer beginning with an apology a full refusal even if it continues to answer. Specify the hand label and a content-preserving control that would expose the shortcut, then explain how the same shortcut could distort a safety-training reward.

**Traps**

- Calling any near-duplicate scan proof of clean pretraining. It checks only available data under its stated normalization and matching rule.
- Updating the evaluator between checkpoints and attributing the whole score change to training. Rescore identical saved outputs to isolate the instrument change.
- Retiring every attack a defense blocks. That erases regression evidence and rewards memorizing the latest public suite.

**Practice**

- The section mini-project covers this: a seeded apology, style or length shortcut on harmless saved outputs; independent labels; a safety-item exposure manifest; family-level split checks; and a replay comparing evaluator versions. Retain the original failures and keep final attacks out of defense selection.

**Stop when:** Your audit exposes one proxy shortcut, distinguishes evaluator drift from behavior change, and documents known and unknown exposure routes for the final attack set.

<details>
<summary>Self-test</summary>

1. Reward rises but blind hand review finds unchanged policy behavior. What improved?
   - The proxy score improved. Training may have exploited a shortcut; it has not demonstrated a behavioral safety gain.
2. No exact training/test string overlap is found. Can you rule out contamination?
   - No. Paraphrases, shared templates, indirect feedback and unknown pretraining data remain possible exposure routes.
3. How do you separate evaluator drift from policy drift?
   - Rescore fixed raw outputs with both evaluator versions and evaluate both policies with one frozen evaluator. Preserve item-level disagreements.

</details>

#### U8. Safety training-data lineage and constitutional critique and revision

**About 4 h** · **Target:** Implement

Topics: Safety SFT, preference and constitutional data lineage; Critique, revision and AI-feedback loops with explicit principles

A safety intervention starts with data choices, not a loss function. This unit adds policy and generator lineage to the SFT and preference contracts from earlier sections without repeating their optimization work.

**You can now**

- Implement a small principle-conditioned critique/revision data loop with complete lineage.
- Audit safety SFT and preference records for policy conflicts, source exposure and evasiveness.
- Separate AI-generated supervision from independent evidence of safer behavior.

**Study**

1. [Constitutional AI, arXiv:2212.08073v1](https://arxiv.org/abs/2212.08073v1) (Constitutional AI: Harmlessness from AI Feedback) - Figure 1; Section 3.1, Method; Section 4.1, Method; Sections 4.3 and 4.4, including Harmlessness vs. Evasiveness; Appendix A critique/revision examples. Depth: Implement one critique/revision pass and its records. The full preference-model and RL pipeline is reading only, not a required reproduction.
2. [CS336 supplement: inspect safety demonstrations and preferences](https://github.com/stanford-cs336/assignment5-alignment/blob/main/cs336_spring2026_assignment5_supplement_safety_rlhf.pdf) (CS336 Assignment 5 Supplement - Safety Alignment) - Section 4.1, `look_at_sft`; Section 6.2, `look_at_hh`. Depth: Read for data-inspection questions and source tracking. Use your existing small SFT/preference data instead of the course's shared-volume corpus.
3. [NIST AI 600-1: data origin and transformations](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf) (NIST AI RMF Generative AI Profile) - Section 3: GV-1.2-001 and MP-2.1-002.

**Focus**

- Record source prompt, original response, principle and policy version, critique, revision, generator checkpoint, template, decoding and review decision. Retain rejected revisions with reasons.
- Supervised CAI trains on the revised response paired with the original prompt. Its AI-feedback phase instead creates comparisons for a preference model and subsequent RL. A revision loop alone is neither phase's trained outcome.
- AI feedback still depends on human-chosen principles and can inherit the generator's errors. Critique fluency is not evidence that a revision is correct or harmless.
- Split by source conversation and generator lineage. Keep evaluation prompts and final attack families out of synthetic-data generation, preference selection and rubric tuning.

**Reproduce:** Closed-book, draw the two CAI supervision paths: prompt to answer to critique to revision to an SFT pair; and prompt to response pair to principle-conditioned preference to preference model to RL. Then reconstruct one record from your small loop and identify which fields distinguish human policy choices, generated supervision and independent review.

**Traps**

- Discarding the original unsafe or unhelpful response once a revision exists. That loses the intervention's baseline and hides failed revisions.
- Using the same model's approval as the only evaluation. Shared blind spots can certify a worse answer.
- Training on blanket refusals for every sensitive topic. That changes the policy boundary and can reward evasiveness over useful safe completion.

**Practice**

- The section mini-project covers this: one local critique/revision pass on a handful of invented policy-boundary cases and matched benign requests, with complete SFT or preference-data lineage and blind hand review. Reuse the frozen small-model/software setup from the baseline, sequentially on CPU if needed. Keep an unmodified response control and failed revisions; no full RLAIF training is required.

**Stop when:** You can reconstruct every revision from its policy and generator record, form the correct training pair, and distinguish a reviewed data intervention from a demonstrated trained-policy improvement.

<details>
<summary>Self-test</summary>

1. Does constitutional supervision remove human normative choices?
   - No. Humans choose principles, data, deployment scope and review criteria; the paper also retains human helpfulness feedback in its RL phase.
2. A revision becomes less specific and the generator praises it. Is that a safety gain?
   - Not established. Independent review must check policy behavior and usefulness; evasiveness can improve a proxy while degrading assistance.
3. What is the supervised training target after critique and revision?
   - The revised response to the original prompt. The critique is part of data generation, not automatically part of the deployed assistant's target response.

</details>

#### U9. Defense in depth and capability-safety trade-off curves

**About 4 h** · **Target:** Measure

Topics: Training, classifier, system and monitoring mitigations as defense in depth; Capability-safety trade-off curves rather than aggregate refusal rates

A system prompt, a trained policy and an output filter fail in different places. This unit asks which layer changes the measured failure and what useful behavior it costs, rather than treating more layers as automatic safety.

**You can now**

- Compare training, classifier, application and monitoring controls without assuming independent failures.
- Measure a capability-safety frontier under matched generation and attack budgets.
- Diagnose gains caused by capability loss, overrefusal or a stale attacker rather than robust mitigation.

**Study**

1. [NIST AI 600-1: layered controls and reassessment](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf) (NIST AI RMF Generative AI Profile) - Section 3: MG-3.1-001 and MG-3.1-003 (filters, fine-tuning and reassessment); MS-2.6-005 to MS-2.6-007 (monitoring, handling misuse and circumvention).
2. [Constitutional AI: competing objectives, arXiv:2212.08073v1](https://arxiv.org/abs/2212.08073v1) (Constitutional AI: Harmlessness from AI Feedback) - Sections 4.3 and 4.4: helpfulness/harmlessness comparisons and Harmlessness vs. Evasiveness. Depth: Read the trade-offs and evaluator dependence, not the large-model scores as local targets.
3. [StrongREJECT: capability loss as an alternative explanation](https://arxiv.org/html/2402.10260v1) (A StrongREJECT for Empty Jailbreaks (Souly et al., 2024)) - Sections 6.2 and 6.3: jailbreaks can hurt model performance, including on MMLU.

**Focus**

- Distinguish a policy intervention from an application restriction. Removing tool authority can prevent an action even when the language model still proposes it; report both attempted and executed violations.
- Compare the unchanged system, each individual control and their combination. A training control can reuse an earlier SFT/preference checkpoint; no new large training run is needed.
- Sweep one development-set control strength, such as a classifier threshold, then freeze settings. Plot harmful compliance against benign utility and overrefusal, with privacy and group slices alongside.
- Use paired item comparisons and template/family-aware uncertainty. Hold query and output budgets fixed, include control overhead, and rerun a fresh adaptive attacker against the frozen candidate.

**Reproduce:** Closed-book, sketch a frontier with useful benign completion on one axis and harmful compliance on the other. Add an always-refuse baseline and mark dominated configurations: a configuration is dominated if another has no worse measured utility and compliance, with a strict improvement in at least one. Explain why uncertainty, severity and unplotted privacy risks can still prevent selecting an apparently dominant point.

**Traps**

- Multiplying layer failure rates without independence evidence. A shared prompt or model can defeat several layers together.
- Calling a classifier block a better model. The system's output policy changed; the underlying model may not have changed at all.
- Trading one severe failure for many easy successes in an average. Retain severity gates and affected-group regressions beside the curve.

**Practice**

- The section mini-project covers this: a matched-budget baseline, individual-control and combined-control comparison, a development-set control-strength curve, and one frozen mitigation retested on held-out adaptive attacks. Use the campaign's small checkpoint on your GPU or CPU. Cheap application permission checks and a deterministic synthetic-secret output check are valid controls; report their narrow coverage rather than implying learned alignment.

**Stop when:** Your comparison identifies each control's contribution and cost, keeps benign and severe-failure slices visible, and states whether the mitigation survives held-out adaptive review.

<details>
<summary>Self-test</summary>

1. All outputs are blocked. Has the system reached a useful safety frontier?
   - It supplies a limiting refusal baseline, not useful assistance. Benign utility and overrefusal expose the cost.
2. Why test each layer alone before the combination?
   - Ablations identify which control changes behavior and whether combined controls add value or merely share failures and overhead.
3. A defense improves only against yesterday's fixed attacks. What is missing?
   - Held-out-family and adaptive evaluation at the same declared budget, with a frozen defense and calibrated success labels.

</details>

#### U10. Release thresholds, staged rollout, monitoring, rollback and residual-risk ownership

**About 4 h** · **Target:** Explain

Topics: Predeclared capability, safety and uncertainty release thresholds; Staged rollout, monitoring, incident response and rollback; Residual risk, evidence gaps and explicit ownership

The Systems units on failure domains, correctness signals and safe rollout and on backups, runbooks, incident timelines and postmortems cover the operations. Here the new job is deciding whether model-behavior evidence is strong enough for a specific use, including uncertainty and untested harms.

**You can now**

- Defend predeclared safety, utility and uncertainty gates for a bounded release candidate.
- Explain a staged rollout with review, monitoring, incident handling and a tested rollback.
- Assign residual risks and evidence gaps to an owner without claiming certification.

**Study**

1. [NIST AI 600-1: release, review and deactivation](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf) (NIST AI RMF Generative AI Profile) - Section 3: GV-1.2-002; GOVERN 1.5 and 1.7; MG-2.3-001; MG-2.4-001 to MG-2.4-004; MG-4.1-002. Depth: Read these actions as governance requirements. NIST does not supply numeric release thresholds for your application.
2. [LLM Post-Training Laboratory: release evidence boundary](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-3/llm-post-training-laboratory.md) (LLM Post-Training Laboratory - Safety Campaign) - Architecture constraints; Milestones D to F; Correctness requirements; Completion checklist; Out of scope. Depth: Use immutable records, independent evaluation and rollback criteria. Frontier certification and production operations remain outside this study.

**Focus**

- Before final evaluation, declare acceptable harmful-compliance, privacy, overrefusal, utility and critical-slice outcomes. Specify sample counts, uncertainty method, coverage requirements and what forces a hold.
- Bind a decision to policy, threat model, model, tokenizer, data, attack and grader versions. Preserve failures and human adjudications; an incomplete instrument can block promotion even if its scored subset passes.
- Rehearse offline evaluation, shadow replay and a restricted simulated canary before any broader use. Monitor behavior and utility by version and slice, not just availability or aggregate refusal.
- Name the release decision owner, incident responder and residual-risk owner. Define the previous complete system configuration, the rollback trigger and the check that verifies restoration.

**Reproduce:** Closed-book, assess an idealized fixed sample of 20 independent, identically distributed Bernoulli trials with zero failures. The exact one-sided 95% upper bound on the failure probability is $`1-0.05^{1/20}`$, about 13.91%, not zero. Then explain why correlated adaptive attempts or a hand-selected attack set do not justify applying that bound to deployment traffic.

**Traps**

- Choosing the gate after seeing candidate scores. That turns a release criterion into a description of the chosen model.
- Rolling back only weights when the failure came from a prompt, retrieval source, filter or evaluator. Restore the relevant versioned system, not one artifact.
- Assigning risk to a team with no decision maker or expiry. Give each accepted gap an owner, review date and reopening condition.

**Practice**

- The section mini-project covers this: a signed-off local release/hold record with predeclared thresholds, uncertainty and coverage checks, staged replay, a seeded behavioral regression, a rollback rehearsal and owned residual risks. The learner may hold all roles, but names each responsibility. No real deployment or external users are required.

**Stop when:** A reviewer can reproduce the release or hold decision from frozen evidence, trigger the simulated rollback, verify restoration and identify who owns every unresolved risk.

<details>
<summary>Self-test</summary>

1. No severe failures appear in a small final set. Is release automatically justified?
   - No. The sample may have low power or poor coverage. Apply the predeclared uncertainty and coverage gates and disclose what was not tested.
2. Why include benign utility in rollback triggers?
   - A change can prevent misuse by making the assistant unusable. User-visible task regressions are release failures even when refusal rises.
3. What distinguishes a release record from a safety certificate?
   - The record supports a scoped decision for named versions, evidence and assumptions. It cannot establish universal alignment, future robustness or regulatory certification.

</details>

#### U11. Activation probes and scalable oversight as supporting safety evidence

**About 3 h** · **Target:** Explain

Topics: Activation probes and mechanistic evidence as supporting, not conclusive, safety evidence; Debate, recursive oversight and supervision beyond human capability

This optional unit examines evidence that can complement the behavioral campaign. Neither a probe nor an assisted judge replaces its policy, attack and utility gates; skip this unit without leaving a required safety claim unfinished.

**You can now**

- Explain why activation decodability is supporting evidence, not proof of causal use, truthful intent or safety.
- Design a probe evaluation with source-held-out tests and shortcut controls.
- Separate debate and recursive oversight proposals from demonstrated supervision beyond human capability.

**Study**

1. [ARENA 1.3.1 Linear Probes: evidence and limits](https://learn.arena.education/chapter1_transformer_interp/11_probing/intro/) (ARENA - Evals, Alignment and Interpretability) - What is probing?; Why this matters for safety; What you'll build; Models we'll use; learning objectives for Training & comparing probes and Causal interventions. Depth: Read the evidence distinctions only. Do not load the large gated models or run the full deception-detection pipeline.
2. [ARENA: cross-dataset probe generalization](https://learn.arena.education/chapter1_transformer_interp/11_probing/2-training-comparing-probes/) (ARENA - Evals, Alignment and Interpretability) - Exercise - cross-dataset generalization matrix; Discussion - interpreting the generalization matrix. Depth: Use the exercise to design a held-out-source comparison. Skip the source's large-model accuracy assertions; they are not targets for a different checkpoint.
3. [AI safety via debate, arXiv:1805.00899v1](https://arxiv.org/html/1805.00899v1) (AI Safety via Debate (Irving et al., 2018)) - Sections 1 to 3: the debate game and preliminary experiments; Section 7, Approximate equivalence with amplification. Depth: Read for assumptions and the recursive-supervision connection. Skip the complexity proof details and full MNIST experiment.

**Focus**

- Fix the probe target, checkpoint, layer, token position, labels and split before fitting. A property predictable from activations may reflect topic, format or supplied instructions rather than hidden intent.
- Compare held-out sources, label-shuffled controls and simple text-feature baselines. Fit any normalization on probe training data only; selecting layers on the final test set leaks feedback.
- Intervening along a direction asks a causal question that classification alone cannot answer. A changed output can still result from nonspecific damage, so use control directions and utility checks.
- Debate and recursive amplification try to make difficult judgments tractable through challenges or decomposition. They still depend on truthful evidence access, capable challengers and a judge that can recognize the decisive error.

**Reproduce:** Closed-book, draw two competing explanations for a successful probe: it reads a behavior-relevant representation, or it reads a label-correlated topic cue. Specify a source-held-out comparison and a controlled intervention that could distinguish them. Then draw a debate or recursive-decomposition path that ends at a human-checkable claim and name the assumption that could break that path.

**Traps**

- Calling a high probe score a lie detector. The measured target and transfer setting may not capture deception or intent at all.
- Calling a probe trained on the campaign's labels an independent oracle. It can inherit the same annotation and source shortcuts.
- Treating optimal-play reasoning or toy debate experiments as deployed alignment evidence. Finite models and human judges need separate validation.

**Practice**

- The section mini-project covers this: an optional supporting-evidence note with a probe hypothesis, source-held-out design, shortcut and causal controls, and a debate or recursive-oversight failure analysis. It must state which behavioral release gates remain unchanged. No large-model probe run or multi-agent service is required.

**Stop when:** You can propose discriminating probe controls and identify the empirical assumptions of assisted oversight, while keeping both outside the required behavioral safety claim.

<details>
<summary>Self-test</summary>

1. Does accurate decoding prove the model uses that feature to produce its answer?
   - No. Prediction establishes accessible information under that probe and split. Causal-use claims need controlled interventions and alternative explanations checked.
2. A probe fails after a topic shift. What can you conclude?
   - Its measured transfer is poor. It may have relied on a topic cue or the representation may have shifted; the failure does not show the underlying property disappeared.
3. Why can two persuasive debaters still mislead a judge?
   - They may share blind spots, lack access to verifiable evidence or exploit the judge's weaknesses. More argument is not automatically better supervision.

</details>

### Mini-project: A policy-linked safety campaign and reversible release decision

**About 20 to 28 hours.** Extend `lmlab` with an offline safety campaign for its existing model family, using synthetic secrets and no external actions. Test the graders as well as the model, then defend a release or hold decision that preserves benign usefulness. Reuse the units' pinned PyTorch, Transformers and Inspect setup on CPU or your GPU without paid APIs.

1. Freeze `safety/`'s behavior specification, threat model and release gates, carrying forward modality failures. Version an Inspect XSTest adaptation with deterministic and model-rubric scorers; test against held-out policy-linked hand labels before comparisons. Retain confusion counts, coverage and family errors; use hand decisions if calibration fails.
2. Adapt CS336's SimpleSafetyTests baseline/SFT protocol and XSTest with ordinary matched benign tasks. Score a pinned, template-balanced BBQ category against hand-checked metadata and option-order fixtures; retain context-separated accuracy, unknowns, invalids, bias and affected-group support. Compare related checkpoints only, preserving utility, harmful compliance and overrefusal separately.
3. Test a bounded synthetic-canary exposure update against an unchanged checkpoint and untrained canaries using withheld-suffix exact matching. Keep multiplicity, token exposure, prefix-assisted versus unprompted queries and failures in `registry/`; test a separate context-only secret against a known-source oracle, never real personal data.
4. Build a critique/revision pass with policy, generator and SFT-pair lineage; blind-review against unmodified responses, retaining rejected revisions. Plant a harmless apology/style/length grader shortcut and replay evaluator versions against independent labels; keep exposure manifests and source/family split checks excluding final attacks from selection.
5. Implement bounded direct, retrieved-text and target-history attacks using invented violations, with network actions disabled. Check query caps and transcript replay against hand-counted traces; retain every edit, feedback, token cost and failure. Separate development families from final families and static attempts from fresh adaptation.
6. Compare unchanged, individual and combined controls across seeds at matched generation and attack budgets, charging overhead. Freeze a development control-strength curve before held-out adaptive attacks; check outcomes by blind review, retaining utility, privacy, group and severe-failure slices, paired family/template uncertainty and narrow application-control claims.
7. Sign a version-bound release/hold record from predeclared uncertainty and coverage gates. Check staged shadow/canary replay and a planted behavioral regression against the previous complete configuration; retain verified rollback, monitoring roles and owned residual risks. Optionally append probe and recursive-oversight controls without changing behavioral gates.

**Deliverables**

- The `safety/` specification, threat model, exposure manifests, versioned Inspect adaptation and held-out grader-calibration evidence.
- Item-level utility, safety, BBQ, synthetic-canary, revision and adaptive-attack ledgers with controls, uncertainty, failed attempts and restricted raw outputs.
- A signed release/hold record with staged replay, rollback regression, residual-risk ownership and claim limits in `reports/`.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [Inspect Evals: XSTest reference task at pinned commit](https://github.com/UKGovernmentBEIS/inspect_evals/blob/d2d3aac91a37a8c7c8ed3de8b4e899c2594f24a9/src/inspect_evals/xstest/xstest.py). Pin inspect-ai 0.3.281; give changed scorers their own task version and replace hosted grading with calibrated scoring and hand adjudication.
- external-tests: [CS336 Assignment 5 safety supplement: reduced baseline and SFT protocol](https://github.com/stanford-cs336/assignment5-alignment/blob/main/cs336_spring2026_assignment5_supplement_safety_rlhf.pdf). Use bounded SimpleSafetyTests subsets and saved checkpoints; hand-score outputs. No public safety-label tests or large-model grader is required.
- external-tests: [XSTest safe and unsafe contrasts at pinned commit](https://github.com/paul-rottger/xstest/tree/d7bb5bd738c1fcbc36edd83d5e7d1b71a3e2d84d). Keep safe and unsafe denominators separate; audit prefix matching against semantic labels and preserve selected row identities.
- external-tests: [BBQ data and metadata at pinned commit](https://github.com/nyu-mll/BBQ/tree/bea11bd97d79217245b5871acd247b9d6eb24598). Join category and example identities; preserve context conditions, question polarities and template groups. Subset results do not establish global fairness.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Measurement before mitigation | Your scorer fixtures and held-out hand labels validate confusion counts, parsing, coverage and BBQ metadata. Harmful assistance, refusal and benign utility remain distinct, with related-checkpoint identities verified. | A grader that fails held-out calibration hands its slices to hand decisions, and planted parser and metadata defects fail their fixtures before repair. An optional probe note, if written, stays outside the behavioral gates. |
| Adaptive attribution discipline | Your replay tests enforce attack budgets; matched controls preserve all attempts across seeds, uncertainty and slice harms. Independent labels expose the planted shortcut and distinguish scorer drift from model change. | Fresh adaptation tests the frozen mitigation on held-out families; ablations distinguish application restrictions from learned behavior and preserve correlated failures and capability-loss alternatives. |
| Reversible release judgment | Your signed decision applies frozen safety, privacy, utility and coverage gates; a regression triggers verified complete-system rollback. Release, incident and residual-risk responsibilities are named, with restricted harmful outputs. | A reviewer reproduces the hold or release from item records; every accepted gap has an owner, review date and reopening condition, and simulated rollout is never described as deployment certification. |

Feeds into: The policy, calibrated graders, attacks, privacy and group slices, release record and rollback tests feed Research-Scale Integration's identity-bound governance and the capstone's external safety evaluation, bounded safety module and skeptical-review defense.

### Resource route

- **Primary - Assignment:** [CS336 Assignment 5 Supplement - Safety Alignment](https://github.com/stanford-cs336/assignment5-alignment) - Do supplement Sections 3 and 5 (zero-shot MMLU, GSM8K, AlpacaEval and SimpleSafetyTests baselines, then the red-teaming problem) around the bounded SFT and DPO paths. The handout uses Llama 3.1 8B and a 70B judge; use a small open model and rule-based or hand-checked scoring instead, and keep benign utility beside safety results.
- **Required - Implementation:** [Inspect and Inspect Evals](https://github.com/UKGovernmentBEIS/inspect_evals/tree/d2d3aac91a37a8c7c8ed3de8b4e899c2594f24a9) - Build one versioned safety task in Inspect with attack provenance, a deterministic scorer and a calibrated model scorer, kept transcripts and a regression threshold. Start from the pinned BBQ or XSTest task and a small hand-labeled subset; per-task versions change denominators (XSTest 4-A and 5-A), and many suites need Docker or paid graders, so name the task, version and limit.
- **Required - Guide:** [NIST AI RMF Generative AI Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence) - Use Section 2 (the twelve risks, especially 2.3, 2.4, 2.6 and 2.8) and selected actions: GV-3.2-005 (threat modeling), GV-1.2 to GV-1.5 (testing before and after deployment, incident disclosure, including GV-1.5-002), GOVERN 1.7 (decommissioning), MP-1.1-001 and MP-2.1-002 (intended use, data provenance). Tie each to evidence, an owner and a rollback decision; it gives actions, not thresholds.
- **Required - Specification:** [OpenAI Model Spec (2026-08-18)](https://model-spec.openai.com/2026-08-18.html) - Read "Instructions and levels of authority", "The chain of command", "Ignore untrusted data by default" and "Protect people's privacy" as one worked behavioral specification, then write your own short spec before labeling any responses. It states intended behavior, not measured compliance.
- **Required - Benchmark:** [XSTest: Exaggerated Safety Behaviours in Large Language Models](https://github.com/paul-rottger/xstest/tree/d7bb5bd738c1fcbc36edd83d5e7d1b71a3e2d84d) - Run the pinned prompt set (250 safe prompts and 200 unsafe contrast prompts) beside SimpleSafetyTests to measure overrefusal separately from harmful compliance. Calibrate string-match refusal labels on a hand-labeled sample; the paper is https://arxiv.org/abs/2308.01263.
- **Required - Paper:** [A StrongREJECT for Empty Jailbreaks (Souly et al., 2024)](https://arxiv.org/abs/2402.10260) - Read Section 2.2 (the rubric autograder), Section 3 (agreement with human labels) and Section 4 (jailbreaks that lower capability): score how specific and convincing a harmful answer is, not just whether it refused. Its graders need an OpenAI key or gated weights, so calibrate a local rubric on a small hand-labeled set.
- **Required - Paper:** [Extracting Training Data from Large Language Models (Carlini et al., 2021)](https://www.usenix.org/system/files/sec21-carlini-extracting.pdf) - Read Section 3 (memorization definitions and threat model), Section 3.4 (ethics) and Section 5.2 (membership inference by comparing perplexity with zlib entropy or a smaller model), then test extraction only on synthetic canaries you planted in your own training data. Never search for real personal records.
- **Required - Benchmark:** [BBQ: A Hand-Built Bias Benchmark for Question Answering](https://github.com/nyu-mll/BBQ/tree/bea11bd97d79217245b5871acd247b9d6eb24598) - Read Sections 3 to 5 of the paper (https://aclanthology.org/2022.findings-acl.165.pdf): ambiguous versus disambiguated contexts and the bias score. Evaluate one category and report the two context types separately; its coverage is US English stereotypes.
- **Support - Paper:** [Not What You've Signed Up For: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection (Greshake et al., 2023)](https://arxiv.org/abs/2302.12173) - Read Figures 1 and 2 and Sections 3 and 4: instructions planted in retrieved content cross a trust boundary the user never sees. It shows the threat exists, not how common it is.
- **Support - Paper:** [Jailbreaking Black Box Large Language Models in Twenty Queries (Chao et al., 2023)](https://arxiv.org/abs/2310.08419) - Read Section 3 and Algorithm 1: an attacker model refines a prompt from the target's replies. Run a tiny local loop with an explicit query budget and hand-checked success labels; the repository's no-judge mode always scores 1.
- **Support - Paper:** [HarmBench: A Standardized Evaluation Framework for Automated Red Teaming and Robust Refusal (Mazeika et al., 2024)](https://arxiv.org/abs/2402.04249) - Read Section 3.1 (metrics) and Sections 4.1 to 4.3 (behaviors and the evaluation pipeline) for attack provenance and pipeline design. Its main classifier is a fine-tuned Llama 2 13B Chat (Appendix B.5) and its full grid is cluster-scale.
- **Reference - Paper:** [Constitutional AI: Harmlessness from AI Feedback](https://arxiv.org/abs/2212.08073) - Read Figure 1 and Section 3.1 (supervised critique and revision) and Sections 4.1, 4.3 and 4.4 (RLAIF, results, harmlessness versus evasiveness). Reproduce only a tiny critique-revision or preference-data intervention and test for evasiveness, overrefusal and evaluator dependence.
- **Support - Paper:** [RLAIF vs. RLHF (Lee et al., 2023), harmless dialogue results](https://arxiv.org/abs/2309.00267) - Read Sections 2 to 5 for the harmless-dialogue comparison of AI and human preference labels, as the control for any AI-feedback safety data you build.
- **Reference - Paper:** [Scalable Extraction of Training Data from (Production) Language Models (Nasr et al., 2023)](https://arxiv.org/abs/2311.17035) - Read Section 1 (ethics and disclosure) and Sections 3.1 and 3.5 (extractable versus discoverable memorization). The production-endpoint behavior it reports is historical.
- **Reference - Paper:** [AI Safety via Debate (Irving et al., 2018)](https://arxiv.org/abs/1805.00899) - Read Sections 1 to 3 for the debate proposal as one scalable-oversight idea; it is a proposal with toy experiments, not a tested safety method.
- **Optional - Course:** [ARENA - Evals, Alignment and Interpretability](https://learn.arena.education/) - Use 3.1 (threat model and specification by hand) and 3.3 (Inspect scorers) for attack sets and grader tests, and Chapter 4.1 and 4.2 as case studies. 3.1, 3.2 and 3.4 assume a paid OpenAI API; work by hand or with a local model. The probing (1.3.1) and toy SAE (1.5.4) exercises are optional evidence for one concrete hypothesis and need a smaller model than the 13B they assume.
- **Support - Project:** [LLM Post-Training Laboratory - Safety Campaign](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-3/llm-post-training-laboratory.md) - Run the reward-hacking, adversarial and failure campaign. Preserve attacks, false positives, raw generations, evaluator versions and the rollback decision.

### Exit checkpoint

Produce a threat model and adaptive safety/privacy evaluation with matched benign utility; demonstrate one mitigation whose gain survives held-out attacks and evaluator review; and state residual risk without claiming general alignment or certification.

<details>
<summary>Deliberately left for later</summary>

- Restricted evaluations that require controlled access or domain experts
- A comprehensive interpretability curriculum
- Regulatory certification and production incident operations

</details>

## LMR-11. Research-Scale Integration

**Why:** The final stage connects data, model, objective, training state, rollout and evaluation into one auditable experiment. It proves that a bounded real-code change, rather than extra compute or evaluator drift, caused the reported result.

### Learn this much

- [ ] Data-to-checkpoint-to-post-training-to-evaluation lifecycle _(Required)_
- [ ] Ownership of dataset, tokenizer, model, optimizer, policy, reference, reward and evaluator state _(Required)_
- [ ] Configuration, code, environment, artifact and evaluation lineage _(Required)_
- [ ] Reconstructing launch, configuration, data, model, objective, trainer and evaluation paths _(Required)_
- [ ] Compute, training state, activation, communication and checkpoint budgets with uncertainty _(Required)_
- [ ] Data, tensor, pipeline, sequence and expert parallel interfaces _(Required)_
- [ ] Checkpoint publication, resume, conversion and resharding contracts _(Required)_
- [ ] Rollout, reward, verifier and evaluation service boundaries _(Required)_
- [ ] Data, loss, gradient, update, throughput, rollout, reward and evaluator observability _(Required)_
- [ ] Failures spanning data version, checkpoint, policy freshness, reward and evaluation _(Required)_
- [ ] Retry, duplication, partial work and artifact-commit semantics _(Required)_
- [ ] Training, rollout, evaluation, storage and researcher-time cost _(Required)_
- [ ] Privacy, access, safety gates and rollback across the research lifecycle _(Required)_
- [ ] A bounded modification to a real training or post-training implementation _(Required)_
- [ ] Strong baseline, matched budget, mechanism ablation and negative control _(Required)_
- [ ] Data, scale, kernel, communication and evaluator confounds _(Required)_
- [ ] Analytical resource prediction versus measured residual _(Required)_
- [ ] Local, simulated, analytical and distributed evidence labels _(Required)_
- [ ] Clean reproduction and discrepancy log _(Required)_
- [ ] Research contribution, skeptical review and next decisive experiment _(Required)_
- [ ] Measured multi-node validation of the full system _(Optional)_
- [ ] Frontier-scale training-system ownership and fleet operations _(Depth)_
- [ ] General training-platform or orchestration construction _(Later)_

### Study units

#### U1. The data-to-evaluation lifecycle and ownership of every state

**About 4 h** · **Target:** Explain

Topics: Data-to-checkpoint-to-post-training-to-evaluation lifecycle; Ownership of dataset, tokenizer, model, optimizer, policy, reference, reward and evaluator state

Earlier units proved individual components. Integration asks whether a reported result can be traced through the same data, policy and evaluator identities without an undocumented handoff.

**You can now**

- Map your existing corpus, decoder, pretraining, adaptation, preference, RL, multimodal and safety artifacts into one experiment graph.
- Name the writer, immutable identity, consumers and recovery rule for each state.
- Explain why the training reward and the independent evaluator need separate ownership.

**Study**

1. [LLM Post-Training Laboratory: state contracts](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-3/llm-post-training-laboratory.md#architecture-constraints) (LLM Post-Training Laboratory) - Core requirements, Architecture constraints, Deliverables and Milestones A to C. Depth: Audit the artifacts already built in lmlab. Do not restart the full laboratory or add another training stage.
2. [OLMo 2: infrastructure and evaluation handoffs](https://arxiv.org/html/2501.00656v3#S6) (OLMo Fully Open Training Stack) - arXiv:2501.00656v3, Sections 6.1 to 6.3; Appendix A.1 and A.2, including Tables 20 and 21. Depth: Read the cluster descriptions for storage, isolation and ownership boundaries, not as a deployment assignment. Compare evaluation contracts, not the paper's scores with your small model.

**Focus**

- Use one root manifest to connect raw-document lineage, tokenizer and templates, model configuration, optimizer and sampler state, checkpoints, adapters, reference policy, reward or verifier, rollouts and evaluation outputs.
- A role can share a process with another role and still own different state. The learner updates the policy; rollout generation consumes a particular policy version; scoring consumes a particular reward or verifier version.
- Carry the image-text module and the safety release record as versioned branches of the same graph. A missing component is an explicit evidence gap, not an implied successful stage.
- The Deep Learning unit on complete checkpoints, atomic writes and reproducibility boundaries covered saving and restoring. Here the new question is which downstream artifacts become stale when an upstream identity changes.

**Reproduce:** Without notes, draw the path from one corpus document to a training batch, checkpoint, post-training policy, generated answer and independent score. Add the reference and reward branches, then mark the owner and identity on every edge. Replace the tokenizer identity on paper and list the descendants that must be rebuilt or revalidated.

**Traps**

- Calling a directory name an immutable version. Reusing the name can silently attach old evaluation to new weights.
- Treating a reference policy, rollout policy and current learner policy as interchangeable because their architecture is identical.
- Calling a connected dashboard a connected lifecycle. The join must reach the actual inputs, outputs and state identities.

**Practice**

- The section mini-project covers this: lmlab's root lifecycle manifest, state-ownership table and descendant-invalidation audit.

**Stop when:** An answer and score can be traced to their corpus, checkpoint and post-training ancestors, and every state has one declared writer and a recovery rule.

<details>
<summary>Self-test</summary>

1. Why is a checkpoint step number insufficient to identify an evaluation target?
   - Different runs can use the same step. Bind the score to a run identity and checkpoint content digest, plus tokenizer, template and generation configuration.
2. Can the reward model also be the only external evaluator?
   - No. Optimizing its score can exploit its errors. Use independent task and safety evidence, with their own versions and calibration records.
3. Does sharing weights imply sharing optimizer state?
   - No. An inference export can preserve model behavior while omitting optimizer, sampler and RNG state needed to continue training.

</details>

#### U2. Experiment lineage and reconstructing a real training codebase

**About 5 h** · **Target:** Implement

Topics: Configuration, code, environment, artifact and evaluation lineage; Reconstructing launch, configuration, data, model, objective, trainer and evaluation paths

A recipe name does not specify an experiment. Reconstructing the executed path exposes configuration overrides and hidden transformations before they become explanations for a gain.

**You can now**

- Trace one real SFT path from launch arguments through tokenization, masking, loss, update and checkpoint publication.
- Attach resolved configuration, source revision, environment and artifact digests to each experiment edge.
- Separate a historical released recipe from the current code path used for your modification.

**Study**

1. [Open Instruct: reconstruct the SFT execution path](https://github.com/allenai/open-instruct/blob/11826255077617a46919ce75cadf1f3d53f30dac/open_instruct/finetune.py) (Open Instruct) - `FlatArguments`, `main`, dataset construction with `get_cached_dataset_tulu`, model and optimizer construction, training loop, checkpoint and final-save branches. Depth: Read, do not launch the default recipe. Follow `sft_tokenize_mask_out_prompt_v1` and `mask_labels` in `dataset_transformation.py` at the same revision. Keep native evaluation launchers outside your independent evaluation path.
2. [The Turing Way: capture the execution environment](https://book.the-turing-way.org/reproducible-research/renv) (The Turing Way - Reproducible Research) - Reproducible Environments: Summary, What is a Computational Environment?, and Motivation and Background (page read 2026-10-16).

**Focus**

- Record the effective values after CLI overrides, model loading and dataset transformations. A configuration file alone omits runtime decisions and inherited defaults.
- Trace a real message into token IDs and labels, then into the scalar loss and optimizer update. Distinguish final-assistant-only targets from all-assistant targets; the two named masking paths have different contracts.
- The Programming unit on dependency locks, run manifests and quality gates already records the environment. Add dataset-transform fingerprints, upstream checkpoint digests and evaluator identity rather than another generic environment tutorial.
- Read the OLMo 2 release as a historical case. A newer OLMo-core or Open Instruct revision does not retroactively identify the code that trained that release. Record unknown historical edges as unknown.

**Reproduce:** Close the source and reconstruct the SFT call graph from arguments to saved policy. Reopen it and correct each unsupported edge. In lmlab, serialize one resolved run record and verify every parent digest before accepting its outputs; changing a parent identity must invalidate that binding rather than relabel an old result.

**Traps**

- Recording a Git commit while ignoring an uncommitted patch. Store both the base revision and the patch digest.
- Treating a dataset cache hit as proof that tokenizer, template and filtering settings match. Check the cache's identity contract.
- Tracing only the forward call. Reduction, accumulation, clipping and scheduler placement can change the effective objective or update.

**Practice**

- The section mini-project covers this: lmlab's annotated real-code trace, resolved run record and parent-identity rejection tests.

**Stop when:** Your trace names the executed data, masking, objective, update and save functions, and a changed upstream identity is caught before old outputs enter a comparison.

<details>
<summary>Self-test</summary>

1. What does a clean source revision fail to identify?
   - Data and model revisions, resolved arguments, environment, external evaluators and any local patch. Those belong in the run record too.
2. Why inspect both prompt masking and the training loss?
   - Correct labels can still receive wrong weighting through reduction or accumulation. Trace which tokens contribute and their denominator through the update.
3. An old checkpoint loads under current code. Have you reconstructed its training recipe?
   - No. Load compatibility establishes only that loading succeeded. Historical code, configuration, data and update semantics still need evidence.

</details>

#### U3. Compute, memory and checkpoint budgets with uncertainty, and the parallelism interface

**About 4 h** · **Target:** Derive

Topics: Compute, training state, activation, communication and checkpoint budgets with uncertainty; Data, tensor, pipeline, sequence and expert parallel interfaces

The useful budget is the cost of answering a research question, including baselines, failed attempts and evaluation. A model that fits alone may not fit beside a reference policy or rollout buffers.

**You can now**

- Derive separate training, rollout, evaluation, host-memory and checkpoint budgets for one experiment.
- Specify what data, tensor, pipeline, sequence and expert parallelism would partition and communicate.
- Defend a feasible plan using ranges for unknown workspace, bandwidth and failure overhead.

**Study**

1. [How to Scale Your Model: training ownership and communication](https://jax-ml.github.io/scaling-book/training/) (How to Scale Your Model) - Part 5: What Do We Mean By Scaling?, Data Parallelism, Fully-Sharded Data Parallelism, Tensor Parallelism, Combining FSDP and Tensor Parallelism, and Pipelining (page read 2026-10-16). Depth: Use the diagrams and forward/backward algorithms for an analytical plan only. The two-matrix MLP omits attention and gating. The 10-byte parameter ledger excludes gradients and other live storage; add them. Overlap is an assumption, not a guaranteed saving.
2. [Sequence and expert interfaces on GPU systems](https://jax-ml.github.io/scaling-book/gpus/#expert-parallelism) (How to Scale Your Model) - Part 12: Expert Parallelism, Pipeline Parallelism and Caveat about latency; Part 5's Note [context parallelism] (pages read 2026-10-16). Depth: Identify dispatch, combine and sequence exchange boundaries. Do not adopt the source hardware constants or implement a distributed runtime.
3. [Budget the whole study](https://neurips.cc/public/guides/PaperChecklist) (NeurIPS Paper Checklist) - Q8, Experiments Compute Resource, including preliminary and failed experiments (page read 2026-10-16).

**Focus**

- The LLM Foundations units on parameter and FLOP counts and on memory and arithmetic intensity supply the estimates. List every live tensor by owner, shape and dtype; separate device peak, host staging and durable storage.
- DP partitions examples and combines gradients; TP partitions tensor work; PP partitions layers. Sequence or context partitioning needs attention exchanges. EP moves routed tokens to expert owners and back. State which axes are independent and which reuse ranks.
- Count valid training tokens separately from padded input tokens, generated tokens and verifier calls. More TP, PP or sequence ranks do not create more unique examples.
- Give both a single-device plan and an analytical distributed alternative. Include checkpoint copies, conversion scratch space, reference and reward models, and uncertainty intervals that could reverse the preferred plan.

**Reproduce:** For a synthetic 12-million-parameter model with BF16 weights and gradients, two FP32 Adam moments and no master weights, derive 144,000,000 bytes of persistent training tensors. A weights-plus-moments checkpoint contains 120,000,000 tensor bytes before metadata; it omits gradients. Add activation, workspace, host staging and storage reserves separately. For microbatch 2 sequences, accumulation 4 and length 128 on one data replica, derive 1,024 input tokens per update, then budget all experiment arms and evaluation.

**Traps**

- Treating the synthetic dtype ledger as a PyTorch optimizer default. Inspect the tensors your chosen implementation actually stores.
- Dividing every memory term by every parallelism degree. Gather buffers and replicated tensors do not obey that shortcut.
- Using peak FLOP/s or link bandwidth as attained throughput. State the assumed rates and test sensitivity to them.

**Practice**

- The section mini-project covers this: lmlab's whole-study resource ledger, single-device feasibility check and analytical parallelism alternative with sensitivity ranges.

**Stop when:** Every arm fits a declared local budget, every distributed tensor has an owner and transfer boundary, and at least one uncertain assumption has a decision-changing sensitivity check.

<details>
<summary>Self-test</summary>

1. Does a 120,000,000-byte weights-plus-moments checkpoint imply that the synthetic model trains in that much memory?
   - No. Even the stated persistent training tensors need 144,000,000 bytes. Activations, workspace and runtime storage are additional.
2. Can a sequence split be treated as ordinary DP for attention?
   - Not generally. Queries can depend on keys and values held by other sequence owners, so attention needs an explicit exchange and masking contract.
3. What if the estimated best plan loses at the low end of the bandwidth range?
   - The ranking is unresolved under that uncertainty. Measure the decisive rate or choose a more robust feasible alternative; do not report a guaranteed winner.

</details>

#### U4. Checkpoint conversion and resharding contracts, and rollout, reward and evaluation service boundaries

**About 4 h** · **Target:** Explain

Topics: Checkpoint publication, resume, conversion and resharding contracts; Rollout, reward, verifier and evaluation service boundaries

Successful deserialization proves little about the experiment. The consumer must receive the intended model semantics and the state its particular job requires.

**You can now**

- Distinguish behavior-preserving export, training resume and layout-only resharding contracts.
- Specify rollout, reward, verifier and evaluation request identities and rejection rules.
- Explain which state cannot be assumed equivalent after a topology or precision change.

**Study**

1. [OLMo-core: model export is a consumer contract](https://github.com/allenai/OLMo-core/blob/5f6f58a133e7ef577d596295f2c8db4651c27857/src/examples/huggingface/convert_checkpoint_to_hf.py) (OLMo Fully Open Training Stack) - Module description, `parse_args` and `main`: configuration, tokenizer revision, dtype and validation handoff. Depth: Read only. Do not convert a released large model. Transfer the contract to your existing small checkpoint with fixed token-ID probes and tokenizer round trips.
2. [OLMo-core: separate resharded tensors from trainer state](https://github.com/allenai/OLMo-core/blob/5f6f58a133e7ef577d596295f2c8db4651c27857/src/scripts/reshard_core_checkpoint.py) (OLMo Fully Open Training Stack) - `config_dicts_from_path` and `_worker_process`: model and optimizer reconstruction, load, copied ancillary files and save. Depth: Keep resharding analytical. Cross-check `Trainer.load_state_dict` in `src/olmo_core/train/trainer.py` at the same revision: rank RNG restoration is conditional on unchanged world size. Copied trainer files do not prove equivalent continuation.
3. [Laboratory: immutable service inputs and outputs](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-3/llm-post-training-laboratory.md#architecture-constraints) (LLM Post-Training Laboratory) - Architecture constraints and Milestone C, bounded versioned rollout/verification queue and independent behavior evaluation.

**Focus**

- An export needs parameter-name, shape, dtype, tied-weight, positional and tokenizer semantics. Test fixed-input logits within a justified tolerance, not identical sampled text alone.
- A training resume additionally needs optimizer, schedule, data position and RNG. Resharding changes physical ownership; it does not automatically define equivalent random streams or sample order.
- A rollout request binds prompt, policy checkpoint, template, decoding configuration and sample identity. Its result preserves generated tokens and behavior-policy log probabilities where the objective needs them.
- Reward and evaluation records bind their own scorer version and the immutable response they scored. Stale-policy acceptance, timeouts and invalid responses need explicit policies even when all roles are local function calls.

**Reproduce:** Without notes, write three acceptance tables for the same small checkpoint: inference export, same-environment resume and an analytical changed-mesh restore. For each state, mark preserve, remap, regenerate or reject. Add a rollout-to-verifier-to-evaluator record and show exactly which check rejects a response paired with the wrong policy or scorer identity.

**Traps**

- Promoting a weights-only export to a resume checkpoint. A compatible forward pass does not reconstruct optimizer history.
- Expecting bitwise logits after a dtype change. Quantization and floating-point reduction order can change outputs; choose the comparison and tolerance before conversion.
- Recomputing old rollout log probabilities under the current policy and calling them behavior-policy probabilities. That changes the objective's data.

**Practice**

- The section mini-project covers this: lmlab's checkpoint-consumer acceptance tests, local rollout/scoring contracts and analytical resharding state table.

**Stop when:** The three consumer contracts distinguish preserved from missing state, and mismatched policy, tokenizer or scorer identities are refused at the appropriate boundary.

<details>
<summary>Self-test</summary>

1. Why compare token IDs as well as decoded strings after export?
   - Different token sequences can decode to similar text while assigning different probabilities and boundaries. Tokenizer and special-token semantics are part of the model interface.
2. Do matching full weights after resharding establish exact training continuation?
   - No. Optimizer alignment, data ownership, RNG streams and numerical execution also matter. State what was preserved and what was reset.
3. May rollout, reward and evaluation services run sequentially on one CPU?
   - Yes. These are ownership and record contracts, not a requirement for separate machines. Such a run provides local evidence, not distributed throughput evidence.

</details>

#### U5. Lifecycle observability and failures that span data, checkpoints, policies and evaluators

**About 4 h** · **Target:** Measure

Topics: Data, loss, gradient, update, throughput, rollout, reward and evaluator observability; Failures spanning data version, checkpoint, policy freshness, reward and evaluation

A rising reward and falling task score can be an objective failure, stale policy, data change or evaluator drift. Joined identities make those explanations distinguishable.

**You can now**

- Join data, update, checkpoint, rollout and evaluator events into one causal investigation.
- Measure instrumentation overhead separately from the uninstrumented workload.
- Localize a seeded cross-component failure and preserve the first bad handoff.

**Study**

1. [Laboratory: joined instrumentation and failure campaign](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-3/llm-post-training-laboratory.md#milestone-b--instrumentation) (LLM Post-Training Laboratory) - Milestone B, Milestone D, Failure-injection requirements and Measurement requirements. Depth: Select one failure crossing two existing components. Do not repeat all objective probes from earlier sections. Use synthetic or already-approved data.
2. [OLMo-core: inspect the data-resume identity check](https://github.com/allenai/OLMo-core/blob/5f6f58a133e7ef577d596295f2c8db4651c27857/src/olmo_core/data/data_loader.py) (OLMo Fully Open Training Stack) - `NumpyDataLoaderBase.state_dict` and `load_state_dict`: fingerprint version, fingerprint, counters, seed and epoch. Depth: Compare the code with your manifest checks. This loader warns on fingerprint-version changes and can explicitly ignore a same-version fingerprint mismatch; do not treat it as unconditional fail-closed validation.
3. [Fault Tolerance: detect missing progress](https://github.com/stas00/ml-engineering/blob/139708e52cb06f9191cf1d9959def9187b205c58/training/fault-tolerance/README.md#is-job-hanging-watchdog) (Machine Learning Engineering - Fault Tolerance and Reproducibility) - Is-job-hanging watchdog and Low disk space alerts. Depth: Use progress and storage signals as vocabulary. No scheduler, notification service or cluster watchdog installation is required.

**Focus**

- Extend the Systems unit's metrics, logs, traces and cardinality rules with run, artifact, batch, policy and evaluator joins. Put unbounded item IDs in event records, not metric labels.
- Keep valid-token denominators, data-source exposure, loss, gradient and update norms, phase times and memory alongside rollout lag, length, reward, invalid counts and external outcomes.
- Choose competing hypotheses before inspecting the answer. A wrong dataset version after resume should be visible in the checkpoint-to-loader join; evaluator drift should be visible when rescoring unchanged outputs.
- Use the first bad boundary, an independent oracle and a targeted rerun to establish the root cause. Correlated metric changes alone do not establish causation.

**Reproduce:** Replay saved responses from one lmlab policy with the original scorer, then deliberately attach a changed parser or verifier identity. Trace the discrepancy through response digest, scorer version and item denominator without retraining. Separately replay a synthetic checkpoint manifest against a changed dataset digest and require refusal before the next batch. Keep the original evidence and the seeded incident in separate attempt records.

**Traps**

- Averaging failed and successful attempts after silently dropping invalid items. Preserve the declared denominator and failure reasons.
- Inferring a bad optimizer from a loss discontinuity before checking tokenizer, data and sampler identity.
- Profiling every run and calling the result normal throughput. Keep diagnostic traces separate and measure observer overhead.

**Practice**

- The section mini-project covers this: lmlab's joined event ledger, seeded data/resume and scorer-drift incidents, root-cause regressions and observer-overhead measurement.

**Stop when:** A reviewer can locate each seeded incident's first invalid handoff from stored records, and a targeted regression prevents recurrence without hiding failed attempts.

<details>
<summary>Self-test</summary>

1. Saved answers are unchanged but the score changes. Where should you look first?
   - Scorer, parser, reference answers, item joins and denominator versions. A training explanation cannot account for an unchanged response artifact by itself.
2. What distinguishes a quiet model from a hung process?
   - Progress evidence such as completed batches, emitted tokens or committed artifacts, with a declared timeout. A live process alone does not establish useful progress.
3. Why keep raw outputs when aggregate metrics already exist?
   - They permit item-level diagnosis, independent rescoring and denominator checks without conflating generation changes with evaluator changes.

</details>

#### U6. Retry and artifact-commit semantics, cost accounting and governance gates

**About 4 h** · **Target:** Explain

Topics: Retry, duplication, partial work and artifact-commit semantics; Training, rollout, evaluation, storage and researcher-time cost; Privacy, access, safety gates and rollback across the research lifecycle

A retry can duplicate data or publish half a result. A technically reproducible artifact can still be unsafe or unlicensed to share. These are lifecycle decisions, not end-of-report footnotes.

**You can now**

- Explain how retry identity, attempt identity and committed artifact identity differ.
- Account for failed training, rollout, evaluation, storage and researcher effort without changing sample denominators.
- Apply privacy, access, safety and rollback gates to the complete artifact chain.

**Study**

1. [OLMo-core: publication boundaries](https://github.com/allenai/OLMo-core/blob/5f6f58a133e7ef577d596295f2c8db4651c27857/src/olmo_core/train/checkpoint.py) (OLMo Fully Open Training Stack) - `Checkpointer.save`, `_prepare_dir`, `_get_tmp_dir`, `_teardown_tmp_dir`, `_temporary_wd` and `_save_metadata`. Depth: Trace the synchronous local path and contrast the remote-upload branch. Do not infer crash durability or object-store atomicity from the local directory rename. Leave asynchronous execution for Distributed Training.
2. [Laboratory: failed work and rollback](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-3/llm-post-training-laboratory.md#milestone-d--failure-handling) (LLM Post-Training Laboratory) - Architecture constraints, Milestone D and Measurement requirements: failed/filtered rollouts, root-cause regressions and rollback criteria.
3. [Compute, safeguards and asset rights](https://neurips.cc/public/guides/PaperChecklist) (NeurIPS Paper Checklist) - Q8 and Q11 to Q13: compute including failed experiments, safeguards, licenses and asset documentation (page read 2026-10-16). Depth: Use these as an audit checklist. Skip submission and anonymity procedures. Bring forward the safety release record from the earlier section.

**Focus**

- A logical rollout request may have several execution attempts but at most one accepted result under your deduplication rule. Preserve every attempt's work and reason even when only one result contributes to the metric.
- Publish immutable payloads, verify completeness and digests, then expose a commit record that readers require. A process dying after payload write but before commit must not make a partial artifact eligible for use.
- Count training, generation, verification, evaluation, checkpoint copies and failed retries separately. Keep researcher hours separate from device time; a cheaper device path may require more debugging effort.
- Bind access restrictions, license, synthetic-data provenance and the earlier safety gate to artifact identities. Rollback selects the last acceptable artifact and records affected descendants; it does not erase the incident.

**Reproduce:** On paper, replay one logical rollout with a timeout, a retry and a late original response. Give each attempt a distinct identity, select one result by a declared rule and charge both attempts. Then interrupt artifact publication before and after its commit record. State which versions a reader may use, which remain quarantined and how a later safety failure revokes acceptance without deleting the audit trail.

**Traps**

- Calling retry-until-success unbiased evaluation. Excluding persistent failures can change the population being measured.
- Equating atomic visibility with durable persistence. The filesystem and storage protocol need their own durability contract.
- Assuming a code repository's license also licenses its datasets, model weights and generated sensitive outputs. Audit each asset separately.

**Practice**

- The section mini-project covers this: lmlab's retry/late-result ledger, interrupted artifact publication, whole-study cost record and identity-bound release/rollback gates.

**Stop when:** The replay accepts no duplicate result or uncommitted artifact, accounts for every attempt and blocks an artifact whose privacy, license or safety gate fails.

<details>
<summary>Self-test</summary>

1. If two attempts answer one request, should both enter the task metric?
   - Not under a one-result-per-request contract. Apply the predetermined deduplication rule, but count the work and retain the outcomes of both attempts.
2. A payload exists but its required commit record is absent. May evaluation use it?
   - No. Under this protocol it is not published. Quarantine or complete recovery verification before making it eligible.
3. The aggregate safety score passes but a privacy slice violates the declared gate. What happens?
   - Block acceptance or roll back according to the recorded policy, name the owner and preserve the failing evidence with appropriate access controls. The aggregate does not override the slice gate.

</details>

#### U7. A bounded, tested change to a real training or post-training implementation

**About 6 h** · **Target:** Implement

Topics: A bounded modification to a real training or post-training implementation

The contribution is a tested change in an actual execution path, not another standalone objective demo. Its boundary must be small enough that the experiment can identify what changed.

**You can now**

- Modify one bounded mechanism in a real trainer without rewriting the surrounding pipeline.
- Check unchanged behavior against an independent frozen-batch oracle and changed behavior against a failing regression.
- Preserve numerical, resume and failure evidence for the modified path.

**Study**

1. [nanoGPT: a CPU-sized real-code fallback](https://github.com/karpathy/nanoGPT/blob/3adf61e154c3fe3fca428ad6bc3818b27a3b8291/train.py) (nanoGPT and TRL as Modifiable Code) - Configuration overrides, `get_batch`, `estimate_loss`, resume branch, checkpoint dictionary and training loop. Depth: Use this deprecated but pinned implementation if Open Instruct is too heavy. Read `model.py` at the same revision for `GPT.forward` and optimizer construction. Run tiny CPU fixtures with PyTorch 2.14.1 and NumPy 2.5.4; keep compilation, hosted logging and uploads disabled. Stock checkpoints omit RNG and scaler state and are not atomically published.
2. [Open Instruct: inspect what existing tests actually assert](https://github.com/allenai/open-instruct/blob/11826255077617a46919ce75cadf1f3d53f30dac/open_instruct/test_dataset_transformation.py) (Open Instruct) - `TestMaskLabels`: `test_has_both_masked_and_kept_tokens` and `test_boundary_masking`. Depth: Read these assertions beside `mask_labels`. They check presence of masked/kept tokens and selected prefix boundaries, not every label or an optimizer update. Do not download their default tokenizer merely to copy the test pattern.
3. [Laboratory: correctness before extension](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-3/llm-post-training-laboratory.md#correctness-requirements) (LLM Post-Training Laboratory) - Correctness requirements, Milestone D and Milestone F.

**Focus**

- Choose one seam in the traced implementation: sampler isolation, mask validation, loss reduction or artifact acceptance. State the intended invariant and the smallest counterexample before editing.
- A concrete nanoGPT option is separating training and evaluation sampling RNGs. Its stock `get_batch` uses the global torch RNG for both; changing evaluation frequency can change subsequent training batches even without an update.
- Use an independent oracle for labels, loss or state, not a second call to the patched helper. Compare logits, loss, gradients and an update on the same frozen batch with declared tolerances.
- Reuse earlier resume and regression work. Save any newly introduced RNG or sampler state, reject incompatible old state explicitly, and keep the baseline revision available. Do not bundle unrelated performance changes into the patch.

**Reproduce:** In the pinned nanoGPT sampling path, reset the CPU torch seed to 1337 and compare two successive training batches with the same run containing one validation draw between them. Use distinct synthetic train/validation token arrays, batch size 2 and context 16; record the changed training positions. Introduce separate seeded training and evaluation generators and require training positions to stay unchanged by that validation draw. Then round-trip both generator states and test the next draws. This is sampler-isolation evidence, not evidence of improved language quality.

**Traps**

- Calling a smoke test an independent oracle. Merely executing the new branch does not check its semantics.
- Saving a new generator's seed but not its current state. A seed restarts its stream rather than continuing it.
- Assuming the stock nanoGPT iteration cap counts updates as its name suggests. Inspect the post-update termination check and record actual completed updates in your comparison.

**Practice**

- The section mini-project covers this: one lmlab patch to Open Instruct, OLMo-core or the nanoGPT fallback, with frozen-batch, numerical, resume, regression and interrupted-state tests.

**Stop when:** The regression fails on the baseline and passes on the patch, unchanged frozen-batch behavior matches its oracle, and resumed execution preserves the new state contract.

<details>
<summary>Self-test</summary>

1. Why can evaluation change training even when it performs no backward pass?
   - It can consume a shared RNG stream or mutate mode, buffers or other state. In this sampling example the validation draw advances the RNG used for later training positions.
2. What should the RNG-isolation patch preserve on an identical frozen batch?
   - The model's forward, objective, gradients and optimizer update within the declared numerical contract. The patch changes sampling ownership, not the objective.
3. The new regression passes before the patch too. What is missing?
   - It has not demonstrated sensitivity to the defect. Construct a counterexample or inject the old behavior and require the test to fail.

</details>

#### U8. Strong baselines, mechanism ablations, negative controls and scale and system confounds

**About 5 h** · **Target:** Measure

Topics: Strong baseline, matched budget, mechanism ablation and negative control; Data, scale, kernel, communication and evaluator confounds

A successful patch does not establish why a result improved. Matched controls make the mechanism falsifiable and keep extra compute or a different evaluator from becoming the hidden treatment.

**You can now**

- Compare the tested patch with an unchanged baseline, a mechanism ablation and a prespecified extension under disclosed budgets.
- Separate mechanism evidence from extra data, tuning, sampling and system throughput.
- Report negative results and quality, safety, resource and failure outcomes without selecting on the final evaluation.

**Study**

1. [Laboratory: matched comparisons and independent outcomes](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-3/llm-post-training-laboratory.md#milestone-e--measurement--optimization) (LLM Post-Training Laboratory) - Milestones E and F, Measurement requirements and Design-defense questions. Depth: Reuse existing lmlab artifacts. Run only the bounded comparison, not every laboratory variant; use the minimum CPU/tiny-model hardware route.
2. [Tulu 3: informative unsuccessful experiments](https://arxiv.org/html/2411.15124v5#S8.SS2) (Tulu 3, Section 8.2 (Insights from the Unfruitful)) - Section 8.2, Insights from the Unfruitful (its Online DPO and Rejection Sampling paragraphs). Depth: Read the setup-specific conclusions and proposed explanations. Do not reproduce the large-model experiments or generalize their negative results to all online preference learning.
3. [Disclose settings, uncertainty and total compute](https://neurips.cc/public/guides/PaperChecklist) (NeurIPS Paper Checklist) - Q6, Experimental Setting/Details; Q7, Experiment Statistical Significance; Q8, Experiments Compute Resource (page read 2026-10-16).

**Focus**

- Freeze data identities, initial weights, objective, evaluator, decoding and stopping rules before the comparison. Match training exposure and tuning effort; when wall time is also a question, report it as a separate budget axis.
- For sampler isolation, compare stock behavior, separate streams and an ablation that routes evaluation back through the training stream. Add a no-evaluation negative control and vary evaluation frequency as the prespecified extension; count completed updates, not loop labels.
- Use paired prompts and seeds, retain raw outputs, and distinguish uncertainty across evaluation examples from variation across training runs. A tiny seed set supports a local robustness check, not a universal effect estimate.
- Defend against two alternatives, such as fixed cached evaluation batches and snapshot/restoration of RNG state around evaluation. Compare coverage, state complexity and overhead. Preserve quality and safety slices even when the intended contribution is repeatability rather than quality.

**Reproduce:** Before running, predict training-batch invariance for stock and isolated samplers with evaluation absent, frequent and infrequent. On synthetic CPU token arrays, use three paired seeds and the same fixed update count to test that table; restore the shared-stream ablation and require the interference to return. Keep the quality result explicitly unmeasured for this sampler-only fixture. Attach the existing tiny model's paired held-out and adversarial outputs for the end-to-end comparison rather than treating batch equality as language-quality evidence.

**Traps**

- Giving only the patch more tuning, samples or training tokens, then attributing the resulting difference to its mechanism.
- Calling an unchanged metric proof of equivalence. Specify the practical tolerance and uncertainty; limited data may leave the comparison unresolved.
- Discarding failed or invalid generations before computing outcomes. Keep their denominators and reasons, and report all attempts.

**Practice**

- The section mini-project covers this: lmlab's unchanged baseline, mechanism ablation, negative control and prespecified extension, with paired outcomes, two alternative designs and all-attempt costs.

**Stop when:** The mechanism prediction survives its controls or is explicitly rejected, and the comparison table includes quality, safety, compute, memory, latency and failure evidence or a justified unmeasured label.

<details>
<summary>Self-test</summary>

1. Why include the no-evaluation control for sampler isolation?
   - There is no evaluation draw to perturb the training stream. An unexplained difference there points to initialization or another changed path rather than the proposed interference mechanism.
2. Does Tulu 3 establish that rejection sampling never helps?
   - No. It reports small gains relative to compute in its setup and sensitivity to judge strength and retaining original answers. Those constraints bound the conclusion.
3. Can matched wall time and matched training tokens answer different questions?
   - Yes. Equal tokens tests behavior at equal exposure; equal time includes throughput effects. State which comparison supports each claim and disclose other costs.

</details>

#### U9. Analytical prediction versus measured residual, evidence labels and distributed validation

**About 4 h** · **Target:** Measure

Topics: Analytical resource prediction versus measured residual; Local, simulated, analytical and distributed evidence labels; Measured multi-node validation of the full system

A resource estimate becomes useful when its misses change the next plan. Local correctness and a plausible distributed diagram are different evidence, even when they describe the same code.

**You can now**

- Compare one frozen resource prediction with a local measurement using the same accounting boundary.
- Explain residuals by separating algorithmic work, kernel efficiency, input, communication, imbalance and failure overhead.
- Label each claim as local, simulated, analytical or validated on distributed hardware and specify the missing validation.

**Study**

1. [Laboratory: instrumentation and hardware-scoped measurement](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-3/llm-post-training-laboratory.md#measurement-requirements) (LLM Post-Training Laboratory) - Hardware variants, Milestone B, Measurement requirements and Rubric: Systems reasoning. Depth: Measure the existing tiny local path. Do not launch the extended multi-process variant to satisfy this card.
2. [How to Scale Your Model: analytical lower bounds](https://jax-ml.github.io/scaling-book/roofline/) (How to Scale Your Model) - Part 1, All About Rooflines: Where Does the Time Go?, Visualizing rooflines, Matrix multiplication and Network communication rooflines (page read 2026-10-16). Depth: Use only for the analytical distributed alternative. Read the compute, memory and network bounds, not hardware constants as predictions for your machine; skip the worked-problem set.
3. [Claims must match evidence and resources](https://neurips.cc/public/guides/PaperChecklist) (NeurIPS Paper Checklist) - Q1, Claims; Q7, Experiment Statistical Significance; Q8, Experiments Compute Resource (page read 2026-10-16).

**Focus**

- Freeze a predicted quantity, its units, scope and uncertainty interval before measuring. Compare tensor payload with tensor payload, checkpoint file size with serialized size, and process peak with a process-memory model; do not subtract incomparable counters.
- A payload residual can reveal an omitted tensor or dtype. Serialized-file overhead includes metadata and storage layout. Timing residuals may include input stalls, launch cost, compilation, synchronization, evaluation, retries or checkpoint publication.
- Reuse earlier timing and profiler skills rather than adding another benchmark. Warm up outside the steady-state window, include startup separately, and synchronize asynchronous device work when timing it. Report allocated and reserved device memory separately; CPU tensor bytes are not process RSS.
- A simulated queue or remapped tensor fixture does not validate collectives, transport, multi-rank recovery or changed-mesh RNG behavior. Write an optional distributed validation plan naming topology, counters, correctness checks, failure injections and an acceptance rule, with no required multi-GPU execution.

**Reproduce:** From the tiny trainer's actual parameter, gradient and optimizer tensors, predict unique live-storage bytes by shape and dtype after the first update. Measure storage bytes without double-counting shared storage and explain any mismatch before examining process peak. Predict the tensor payload of the checkpoint, then measure its serialized file and classify the difference. Record hardware, versions, phase and repetitions. Finally label that result local, the budget model analytical, any synthetic queue test simulated, and the unexecuted multi-rank recovery claim unvalidated.

**Traps**

- Applying the synthetic BF16 ledger to an FP32 CPU run or counting tied weights twice. Inspect actual dtype and storage ownership.
- Treating the maximum of ideal compute and bandwidth times as a guaranteed runtime. It is a bound under stated assumptions, not evidence of attained overlap.
- Explaining a scale regression from throughput alone. Separate changed algorithmic work from input, kernel, communication, imbalance and fault time before assigning a cause.

**Practice**

- The section mini-project covers this: lmlab's frozen resource prediction, measured residual ledger, phase-scoped profiling evidence and optional distributed validation plan with explicit evidence labels.

**Stop when:** One prediction is reconciled against a comparable local measurement, unexplained residuals remain visible, and no simulated or analytical result is described as distributed validation.

<details>
<summary>Self-test</summary>

1. The checkpoint file exceeds the predicted tensor payload. Is the prediction necessarily wrong?
   - No. The file includes serialization metadata and layout overhead. First ensure both totals count the same tensors and shared storages, then account for the remaining difference.
2. Does passing a one-process changed-shape restore fixture prove distributed resharding?
   - No. It can test mapping and value invariants but not multi-rank coordination, transport, rank failures or the RNG contract after a mesh change.
3. A local run is slower than the analytical lower bound. What should be reported?
   - The measured runtime, the assumptions and the residual, with evidence for its components. Do not tune the prediction after the fact and present it as a successful forecast.

</details>

#### U10. Independent clean reproduction, skeptical review and the next decisive experiment

**About 5 h** · **Target:** Measure

Topics: Clean reproduction and discrepancy log; Research contribution, skeptical review and next decisive experiment

The final product is not the best score from the author's machine. It is an inspectable chain of evidence that survives a clean run and changes a research or engineering decision.

**You can now**

- Package the connected experiment so a reviewer can rerun the baseline and extension without hidden local state.
- Defend the smallest supported conclusion against alternative explanations and explicit evidence gaps.
- Choose the next decisive experiment or stop decision using expected information, cost and safety constraints.

**Study**

1. [The Turing Way: an executable research compendium](https://book.the-turing-way.org/reproducible-research/compendia) (The Turing Way - Reproducible Research) - Structure of a Research Compendium, Separating Methods, Data, Output, Creating a Compendium, Using a Compendium and Checklist (page read 2026-10-16). Depth: Build a local review bundle. Public publication, Binder and archival services are not required; preserve privacy and licensing restrictions.
2. [The Turing Way: review beyond the author's tests](https://book.the-turing-way.org/reproducible-research/reviewing) (The Turing Way - Reproducible Research) - Code Reviewing Process: Summary (page read 2026-10-16).
3. [Laboratory: clean reproduction and bounded conclusions](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-3/llm-post-training-laboratory.md#milestone-f--final-evaluation) (LLM Post-Training Laboratory) - Milestone F, Design-defense questions, Rubric and Completion checklist.
4. [Final claim and artifact audit](https://neurips.cc/public/guides/PaperChecklist) (NeurIPS Paper Checklist) - Q1, Q4 to Q8 and Q11 to Q13: claims, reproducibility, artifacts, settings, uncertainty, compute, safeguards and licenses (page read 2026-10-16).

**Focus**

- Package the root manifest, pinned source and patch, environment lock, permitted inputs, resolved configs, raw outputs, tests and analysis entry point. Separate read-only inputs from generated outputs and document any unavailable licensed or private artifact.
- Ask another person to follow only the written instructions in a fresh environment. Without a reviewer, perform a clean-room self-rerun and label it honestly; a fresh directory alone is not independent reproduction and shared caches can hide missing inputs.
- Audit numerical tolerance, paired identities, failed attempts, safety gates and all four evidence classes. A reproducible result can still have a wrong objective or biased evaluator, so inspect the independent oracle and adversarial slices too.
- Write the decision before proposing more scale: adopt, revise, reject or defer the patch. Compare two architecture/system alternatives and the extra-data/compute/sampling explanation. Select one experiment whose possible outcomes would change that decision, with a budget, falsifier and stopping rule.

**Reproduce:** From the review bundle in a fresh environment, regenerate the baseline, mechanism regression and one prespecified extension using the CPU-sized fixture and permitted local inputs. Recompute the summary from raw records, compare identities and declared tolerances, and retain the complete command transcript including failed setup attempts. Have a reviewer try one documented variation, such as evaluation frequency, without oral guidance. If no reviewer is available, record that independence remains untested rather than marking it passed.

**Traps**

- Shipping only a notebook with cached outputs. The bundle must regenerate its conclusion from identified inputs and executable analysis.
- Reproducing a number while silently changing its checkpoint, prompt subset or evaluator. Compare the full lineage contract before comparing scores.
- Calling every null result inconclusive or every positive result scalable. A precise local regression may justify a small engineering change without establishing language-quality or distributed gains.

**Practice**

- The section mini-project covers this: lmlab's clean-run bundle and transcript, reviewer variation or explicitly labeled self-rerun, skeptical claim audit and next-experiment decision record.

**Stop when:** The documented clean run regenerates the evidence within its contract, reviewer independence is passed or explicitly pending, and a bounded conclusion changes a named decision with one justified next experiment or stop rule.

<details>
<summary>Self-test</summary>

1. What distinguishes independent reproduction from a clean self-rerun?
   - A different reviewer executes the documented route without the author's hidden operational knowledge. Both are useful, but the self-rerun does not establish reviewer independence.
2. Can sampler isolation justify adoption without better held-out loss?
   - Yes, if controlled tests establish the intended noninterference and resume contract with acceptable overhead and no observed regressions. The supported contribution is experiment reliability, not improved model quality.
3. What makes the next experiment decisive rather than merely larger?
   - Its competing predicted outcomes distinguish live explanations and would change an explicit decision within an affordable, safe budget. More scale alone need not do either.

</details>

### Mini-project: A traced real-code extension and reproducible research decision

**About 22 to 30 hours.** Join `lmlab`'s existing study into an inspectable lifecycle, then modify one bounded mechanism in a real trainer. Keep its independent evaluation, image-text module and safety record attached to the same lineage. CPU-sized fixtures or your GPU suffice; distributed execution and another full training pipeline are not required.

1. Join existing artifacts through a root manifest in `registry/` and a state-ownership/recovery table. Trace pinned Open Instruct arguments through labels, loss, update and publication against source; retain resolved configuration, environment and patch digests. Plant parent-identity changes and test descendant invalidation, including modality and safety branches.
2. Freeze whole-study predictions from independent parameter, FLOP and live-storage counts. Check CPU or single-device feasibility; retain training, rollout, evaluation, checkpoint, failed-attempt and researcher-cost budgets. Check analytical parallelism ownership/communication and resharding tables against pinned OLMo-core contracts; retain sensitivity ranges and an optional distributed-validation plan.
3. Implement checkpoint-consumer and rollout/scoring acceptance tests in `tests/`. Compare export logits and tokenizer round trips with the original checkpoint, resume with uninterrupted state, and request identities with independent fixtures; reject policy, tokenizer and scorer mismatches while keeping behavior scores immutable and analytical resharding claims separate.
4. Extend joined events with data/resume and scorer-drift incidents; identify the first invalid handoff using unchanged-output and next-batch oracles. Replay timeout, retry, late-result and interrupted-publication fixtures; require one accepted result and committed payloads. Retain root-cause regressions, all-attempt costs and identity-bound license, privacy, release and rollback gates.
5. Patch a bounded seam in pinned Open Instruct, OLMo-core or nanoGPT in `train/`, preserving upstream revision and patch. Inspect Open Instruct's mask tests without treating partial assertions as complete coverage; retain independent frozen-batch logits, loss, gradients, update, numerical, resume, interrupted-state and fail-before/pass-after regression evidence.
6. After correctness gates, compare unchanged baseline, mechanism ablation, negative control and prespecified extension across paired seeds under matched exposure, tuning and evaluation budgets. Retain raw quality/safety outcomes, failures, latency and memory; reconcile phase-scoped resource residuals and observer overhead against frozen predictions, defending against alternative designs.
7. Package permitted inputs, locks, manifests, tests and analysis; cleanly regenerate baseline and extension with a reviewer or explicitly labeled self-rerun. Retain transcripts and reviewer variation; generate `reports/` with claim-to-artifact links, skeptical-review responses, evidence labels, alternative-design decisions and the next smallest decisive experiment or stop.

**Deliverables**

- The root lifecycle graph, source trace, state contracts, acceptance tests and incident/retry/publication ledger in `registry/` and `tests/`.
- A pinned real-code patch with independent correctness, numerical, resume and failure regressions, plus matched controls and whole-study resource reconciliation.
- The clean-reproduction bundle and transcript, generated claim-linked report, skeptical-review response and bounded next-experiment decision in `reports/`.

**Checks**

- rubric: Self-grade with the rubric below.
- external-tests: [Open Instruct mask tests at pinned commit](https://github.com/allenai/open-instruct/blob/11826255077617a46919ce75cadf1f3d53f30dac/open_instruct/test_dataset_transformation.py). Inspect the presence and boundary assertions; supplement with independent full-label, denominator and optimizer-update oracles without fetching the default tokenizer.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Lifecycle acceptance correctness | Your parent, consumer, retry and publication fixtures reject stale bindings, duplicate results and uncommitted artifacts. Independent joins locate both incidents; ownership, recovery, license, privacy and safety gates cover every artifact. | A changed upstream identity invalidates all affected descendants without erasing attempts; export, resume and analytical changed-mesh contracts explicitly identify preserved, remapped, regenerated and rejected state. |
| Mechanism and resource attribution | Your independent frozen-batch oracle and numerical, resume and interrupted-state regressions pass. Paired controls retain negative evidence, resource residuals and observer overhead; compare alternative designs and disclose unmatched costs. | Quality, safety, compute, memory, latency and failures carry evidence or justified unmeasured labels. The optional distributed plan names topology, counters, correctness, fault injections and acceptance; unexecuted distributed claims remain unvalidated. |
| Reproduction and research judgment | Your bundle rebuilds evidence from permitted inputs and raw records. A reviewer executes the documented variation, or a self-rerun is labeled with independence pending; the report links claims and answers skeptical objections. | Independent reproduction passes; the decision compares two alternative designs and extra-data/compute/sampling explanations, labels local, simulated, analytical and distributed evidence, and proposes a budgeted decisive experiment with falsifier and stopping rule. |

Feeds into: The capstone consumes this tested real-code extension, connected baseline and post-training lineage, clean-reproduction bundle, generated claim-linked report and skeptical-review response; the decision record supplies the next smallest decisive experiment rather than another scale-up mandate.

### Resource route

- **Primary - Project:** [LLM Post-Training Laboratory](https://github.com/saisandeshk/Roadmap-Final/blob/main/projects/tier-3/llm-post-training-laboratory.md) - Complete the project through its baseline, SFT, preference or reward, RL or reasoning, evaluation, failure campaign, reproduction and extension gates. Keep one versioned artifact chain across the whole track.
- **Required - Case-study:** [OLMo Fully Open Training Stack](https://arxiv.org/abs/2501.00656) - Read Section 6 (clusters, Beaker, stability and operations, hardware utilization, environmental cost) and the evaluation appendices, then trace one released configuration from data and tokenizer through OLMo-core training code, checkpoints and evaluation. Reconstruct only the paths your modification touches and record what was measured versus inferred.
- **Required - Implementation:** [Open Instruct](https://github.com/allenai/open-instruct/tree/11826255077617a46919ce75cadf1f3d53f30dac) - Read one recipe path (`open_instruct/finetune.py`, `dpo.py` or `grpo_fast.py`) with its tests and the chat-template and label-masking code in `dataset_transformation.py`. Make a bounded tested change on a small model or fixture. Its native evaluations are unmaintained and its single-GPU smoke launcher needs Beaker, so evaluate with a separately pinned evaluator.
- **Support - Assignment-set:** [CS336 Assignments 4 and 5 - Integration Handoff](https://cs336.stanford.edu/) - Reuse the data and alignment artifacts already completed. Connect their versions through a single manifest and rerun one clean baseline before the extension.
- **Support - Implementation:** [RLHF Book Companion Code](https://github.com/natolambert/rlhf-book/tree/1042143366d73ff654727e4d18a1d3a21209c3a3/code) - Use one complete module path (for example `direct_alignment/` or `policy_gradients/`) as the small reference implementation, with model, context and sample sizes cut to fit your GPU. Trace one objective end to end, add resume and regression coverage, then compare the modified and unchanged paths.
- **Support - Guide:** [The Turing Way - Reproducible Research](https://book.the-turing-way.org/reproducible-research/reproducible-research) - Use the chapters on reproducible environments, testing, code review, research data management and research compendia (under `book.the-turing-way.org/reproducible-research/`) to package the final artifact for an independent clean run.
- **Support - Checklist:** [NeurIPS Paper Checklist](https://neurips.cc/public/guides/PaperChecklist) - Answer Q1 (claims), Q4 to Q8 (reproducibility, code and data, settings, uncertainty, compute including failed runs) and Q11 to Q13 where you share artifacts, as the claim and evidence contract for the final report. Skip the submission rules.
- **Support - Paper:** [Tulu 3, Section 8.2 (Insights from the Unfruitful)](https://arxiv.org/abs/2411.15124) - Read Section 8.2 for how a team reports what did not work, then write your own negative results the same way.
- **Support - Implementation:** [nanoGPT and TRL as Modifiable Code](https://github.com/karpathy/nanoGPT/tree/3adf61e154c3fe3fca428ad6bc3818b27a3b8291) - If OLMo-core or Open Instruct is too heavy for your machine, make the bounded tested change in nanoGPT (commit 3adf61e) or in a TRL 1.15.0 trainer or collator instead, with a frozen-batch oracle before and after.
- **Depth - Reference:** [How to Scale Your Model](https://jax-ml.github.io/scaling-book/) - Use the roofline, sharding, training, transformers, profiling and GPU parts (`/scaling-book/roofline`, `/sharding`, `/training`, `/transformers`, `/profiling`, `/gpus`) only to defend the analytical distributed plan. Measured multi-device work belongs to the ML Systems track.
- **Reference - Guide:** [Machine Learning Engineering - Fault Tolerance and Reproducibility](https://github.com/stas00/ml-engineering/tree/139708e52cb06f9191cf1d9959def9187b205c58) - Use `training/fault-tolerance/`, `training/reproducibility/README.md` and `training/emulate-multi-node.md` for the vocabulary of the analytical failure and retry plan.

### Exit checkpoint

Modify a real training or post-training implementation, reproduce the unchanged baseline, run a matched mechanism ablation with quality, safety and resource evidence, survive a clean rerun, and label every claim as local, simulated, analytical or distributed.

<details>
<summary>Deliberately left for later</summary>

- Owning every component of a production training platform
- Reimplementing distributed runtime and kernel internals
- Claiming frontier-scale validity from a single-device experiment

</details>

## Track milestone

### Versioned LLM Training and Post-Training Study

Choose one bounded language-model capability or behavior question and carry the same model family, data lineage, evaluator suite and experiment registry from corpus construction through pretraining or adaptation, post-training, multimodal or safety stress tests, and a final mechanism-isolating extension.

- A reproducible baseline package with dataset, tokenizer, model, optimizer, checkpoint and evaluator manifests; a small reliable training or adaptation run; batch lineage; resume tests; compute and memory accounting; and a discrepancy log.
- A matched-budget post-training study containing SFT, a preference or reward route, and one RL, reasoning or distillation route; external capability and safety evaluation; reward and evaluator attacks; uncertainty; ablations; and all valid and failed runs.
- A tested real-code extension plus one bounded multimodal or safety module, an independent clean reproduction, a generated research report with claim-to-artifact links, a skeptical-review response, and the next smallest decisive experiment.

**Capstone rubric** (about 30 to 45 hours)

| Criterion | Pass | Strong |
| --- | --- | --- |
| Reproducible baseline package | Dataset, tokenizer, model, optimizer, checkpoint and evaluator manifests identify a small reliable training or adaptation run, with batch lineage, independent objective checks, resume tests, compute and memory accounting, and a discrepancy log. | Independent batch reconstruction and interrupted continuation pass declared contracts; planted identity, mask, numerical and publication defects fail before acceptance. Every discrepancy links its first divergence, retained evidence and regression rather than an unexplained aggregate. |
| Matched post-training study | Matched-budget SFT, a preference or reward route, and an RL, reasoning or distillation route retain external capability and safety evaluation, reward and evaluator attacks, uncertainty, ablations, and all valid and failed runs across seeds. | Frozen-batch loss, mask and gradient oracles gate comparisons; immutable policy and evaluator identities preserve denominators. Independent behavior, safety and retained negative regimes separate learning from selection, proxy gaming, data exposure and extra compute. |
| Extension and research report | Research-Scale Integration's tested real-code extension and reproduction bundle accompany a bounded multimodal or safety module, a generated report with claim-to-artifact links, a skeptical-review response and the next smallest decisive experiment. | The linked extension's mechanism regression, matched ablation and negative control survive review; the report defends its decision against alternative designs without requiring a quality gain or extrapolating a small-model result. |
| Reproducibility and judgment | An independent reviewer cleanly reproduces the baseline and extension through Research-Scale Integration's bundle, regenerates the report from raw records and executes a documented variation. Safety gates, uncertainty, resource scope and unresolved discrepancies bound the conclusion. | Reviewer objections change or strengthen the decision with artifact-linked evidence; local, simulated, analytical and distributed claims remain distinct. The next experiment has competing predictions, a budget, falsifier and stopping rule; pending independence never counts as passed. |

