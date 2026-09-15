# Web source audit

Audited on 2026-09-15 against `content/curriculum.json`.

## Scope and decision rule

The curriculum contains 268 resource assignments with a `localPath`. This audit excludes all 64 Roadmap-Final assignments because the complete source is already public in the [Roadmap-Final repository](https://github.com/saisandeshk/Roadmap-Final). The remaining scope is 204 assignments across 54 distinct paths.

For each remaining path, I inspected the local checkout, its Git remote when present, and the resource owner's public site. The preferred target order is:

1. The author's official online book or lawful web PDF.
2. The author's or project's official GitHub repository.
3. The publisher's official catalog or companion-material page for commercial books.
4. A local path only when no public equivalent exists.

Unofficial PDF mirrors are deliberately excluded. A public companion repository is considered sufficient when the full book is commercial, following the requested policy.

## Result

Of the 204 non-Roadmap assignments, 203 had a suitable public target. The remaining assignment referenced the personal LNO study suite; it was a support resource rather than a primary route, so it was removed from the curriculum. The 21 assignments that contained both a URL and a local path dropped the local path, and the other 182 replaceable assignments received a public URL.

The migration is complete. All 749 resource assignments now open a public web destination. Roadmap-Final checkpoints and projects link to their exact files in the public repository, and validation rejects every resource `localPath`.

| Local family | Assignments | Preferred public target | Notes |
| --- | ---: | --- | --- |
| `AI-Systems/100-days-of-inference` | 5 | [elizabetht/100-days-of-inference](https://github.com/elizabetht/100-days-of-inference) | Exact public upstream of the local checkout. |
| `AI-Systems/AISys.pdf` and `AI-Systems/ai-performance-engineering/**` | 23 | [cfregly/ai-performance-engineering](https://github.com/cfregly/ai-performance-engineering) | Author's code, labs, chapter map, checklist and resources. The commercial text also has an [official O'Reilly page](https://www.oreilly.com/library/view/ai-systems-performance/9798341627772/). Use the repository as requested. |
| `AI-Systems/Hands-On LLM Serving and Optimization.pdf` | 6 | [orca3/llm-model-inference](https://github.com/orca3/llm-model-inference) | Official chapter-organized companion code from the book authors. The text remains available through the [O'Reilly book page](https://www.oreilly.com/library/view/hands-on-llm-serving/9798341621480/). |
| `AI-Systems/PMPP.pdf` | 2 | [Elsevier 4e companion site](https://shop.elsevier.com/books/book-companion/9780323912310) | Lawful labs, slides and student material. The full commercial book is represented by its [official publisher page](https://www.educate.elsevier.com/book/details/9780323912310). |
| `AI-Systems/ai-infra-engineer-learning/projects/project-103-llm-deployment` | 1 | [Project 103 on GitHub](https://github.com/ai-infra-curriculum/ai-infra-engineer-learning/tree/main/projects/project-103-llm-deployment) | Exact public upstream path. |
| `AI-Systems/modern-gpu-programming-for-mlsys` | 4 | [Modern GPU Programming for MLSys](https://mlc.ai/modern-gpu-programming-for-mlsys/) | Official rendered book. Its source is also on [GitHub](https://github.com/mlc-ai/modern-gpu-programming-for-mlsys). |
| `AI-Systems/time-to-first-token` | 1 | [patchy631/time-to-first-token](https://github.com/patchy631/time-to-first-token) | Exact public upstream. |
| `Learn/AI-Performance-Engineering.md` | 12 | [wafer-ai/gpu-perf-engineering-resources](https://github.com/wafer-ai/gpu-perf-engineering-resources) | The local guide is a near-copy of this public Wafer reading list, with only small link and ordering differences. Use the maintained repository. |
| `Courses/LNO` | 1 | Removed | Personal exam notes, worksheets, solutions and past papers. No public upstream or equivalent was found, and the assignment was not part of the primary route. |
| `Deep-Learning/Deep Learning with PyTorch.pdf` | 1 | [deep-learning-with-pytorch/dlwpt-code-2e](https://github.com/deep-learning-with-pytorch/dlwpt-code-2e) | Official second-edition code linked by the [Manning book page](https://www.manning.com/books/deep-learning-with-pytorch-second-edition). |
| `Deep-Learning/UnderstandingDeepLearning_02_09_26_C.pdf` | 6 | [Understanding Deep Learning](https://udlbook.github.io/udlbook/) | Official open-access book site with chapter PDFs, notebooks and supporting material. The existing URLs are already correct. |
| `Deep-Learning/d2l-en` | 7 | [Dive into Deep Learning](https://d2l.ai/) | Official interactive book. The notebooks are maintained in the [D2L repository](https://github.com/d2l-ai/d2l-en). |
| `Deep-Learning/handson-mlp` | 4 | [ageron/handson-mlp](https://github.com/ageron/handson-mlp) | Author's current Scikit-Learn and PyTorch companion notebooks and exact upstream of the local checkout. |
| `Deep-Learning/pytorch-deep-learning` | 2 | [Learn PyTorch](https://www.learnpytorch.io/) | Official free online course. The notebooks are also in the [author's repository](https://github.com/mrdbourke/pytorch-deep-learning). |
| `LLM/AI-Agents-in-Depth-en.pdf` | 7 | [AI Agents in Depth](https://bojieli.github.io/ai-agent-book/) | Official online multilingual book. The complete text and experiments are also in the [author's repository](https://github.com/bojieli/ai-agent-book). |
| `LLM/Guide.pdf` | 6 | [The Hitchhiker's Guide to Agentic AI on arXiv](https://arxiv.org/abs/2606.24937) | Author-posted paper/book record with a lawful [web PDF](https://arxiv.org/pdf/2606.24937). |
| `LLM/LLMs-from-scratch` | 5 | [rasbt/LLMs-from-scratch](https://github.com/rasbt/LLMs-from-scratch) | Author's official companion repository. Existing URLs are already correct. |
| `LLM/cs336/**` | 16 | [Stanford CS336](https://cs336.stanford.edu/spring2025/) | Official course hub. Use the exact assignment repositories listed below for assignment-specific cards. |
| `LLM/distributed-training-guide` | 6 | [LambdaLabsML/distributed-training-guide](https://github.com/LambdaLabsML/distributed-training-guide) | Exact public upstream and full rendered source. |
| `LLM/modern-llm-notebook` | 14 | [Modern LLM Notebook](https://walkinglabs.github.io/modern-llm-notebook/?lang=en) | Official rendered notebook. The existing five URLs are already correct; use the same URL for the other nine. |
| `ML-Systems/Machine-Learning-Systems-Vol1.pdf` | 1 | [Machine Learning Systems Volume I PDF](https://mlsysbook.ai/vol1/assets/downloads/Machine-Learning-Systems-Vol1.pdf) | Official free web PDF. |
| `ML-Systems/Machine-Learning-Systems-Vol2.pdf` | 3 | [Machine Learning Systems Volume II PDF](https://mlsysbook.ai/vol2/assets/downloads/Machine-Learning-Systems-Vol2.pdf) | Official free web PDF. Both volumes and their source are indexed by [harvard-edge/cs249r_book](https://github.com/harvard-edge/cs249r_book). |
| `ML-Systems/ml-engineering/**` | 5 | [stas00/ml-engineering](https://github.com/stas00/ml-engineering) | Author's public full-book source, including the inference subtree. |
| `Projects/bumblebee` | 3 | [isLinXu/bumblebee](https://github.com/isLinXu/bumblebee) | Exact public upstream. |
| `Projects/mini-sglang` | 3 | [sgl-project/mini-sglang](https://github.com/sgl-project/mini-sglang) | Exact public upstream. |
| `Projects/nano-vllm` | 3 | [GeeeekExplorer/nano-vllm](https://github.com/GeeeekExplorer/nano-vllm) | Exact public upstream. |
| `Projects/no-magic/**` | 2 | [no-magic-ai/no-magic](https://github.com/no-magic-ai/no-magic) | Exact public upstream. The agent exercises can link directly to [`04-agents`](https://github.com/no-magic-ai/no-magic/tree/main/04-agents). |
| `Projects/picotron` | 6 | [huggingface/picotron](https://github.com/huggingface/picotron) | Exact public upstream. |
| `Projects/torchfeather` | 6 | [hkproj/torchfeather](https://github.com/hkproj/torchfeather) | Exact public upstream. |
| `Python/High Performance Python.pdf` | 1 | [mynameisfiber/high_performance_python_3e](https://github.com/mynameisfiber/high_performance_python_3e) | Author's code for the third edition. The text remains on the [official O'Reilly page](https://www.oreilly.com/library/view/high-performance-python/9781098165956/). |
| `Python/python-cookbook/content/README.md` | 3 | [Stas' Python Cookbook](https://github.com/stas00/python-cookbook/blob/master/content/README.md) | Exact public source. This repository uses the `master` branch. |
| `RL/rlhf-book/**` | 13 | [RLHF Book](https://rlhfbook.com/) | Official full online book. Use the [code subtree](https://github.com/natolambert/rlhf-book/tree/main/code) for the five code-specific cards. |
| `Systems/DDIA.pdf` | 11 | [Designing Data-Intensive Applications](https://dataintensive.net/) | Official author/book website. Existing URLs are already correct; the full text remains commercial. |
| `Systems/engineering-handbook/content/hld/**` | 15 | [HLD Handbook](https://hld.handbook.academy/) | Official complete online handbook. Exact source files are in the [canonical GitHub repository](https://github.com/handbook-academy/engineering-handbook/tree/main/content/hld). |

## CS336 exact mappings

The generic `LLM/cs336` path is best represented by the [course hub](https://cs336.stanford.edu/spring2025/). Assignment-specific paths should retain their precision:

| Local path suffix | Official repository |
| --- | --- |
| `assignment1-basics` | [stanford-cs336/assignment1-basics](https://github.com/stanford-cs336/assignment1-basics) |
| `assignment2-systems` | [stanford-cs336/assignment2-systems](https://github.com/stanford-cs336/assignment2-systems) |
| `assignment3-scaling` | [stanford-cs336/assignment3-scaling](https://github.com/stanford-cs336/assignment3-scaling) |
| `assignment4-data` | [stanford-cs336/assignment4-data](https://github.com/stanford-cs336/assignment4-data) |
| `assignment5-alignment` | [stanford-cs336/assignment5-alignment](https://github.com/stanford-cs336/assignment5-alignment) |

## Metadata cleanup required with the migration

Removing `localPath` is not sufficient for a clean public deployment. The corresponding metadata should also be normalized:

- Change `access` values such as `Free / local`, `Local and free`, and `Local + Free` to `Free` or `Free online`.
- Change commercial book values such as `Local commercial PDF`, `Local paid book`, and `Local commercial book` to `Paid book / free companion code` when the card points to companion code, or `Paid` when it points to the publisher.
- Remove `local copy` from the providers for High Performance Python and Stas' Python Cookbook.
- Rename providers such as `Local curated guide`, `Local project`, and `Local study projects` to their public owner or project name.
- Review the few usage notes that say `local journal`, `local dated repository snapshot`, or `local code`. References to running experiments locally can remain because they describe execution, not resource access.

## Ambiguities resolved

- The Wafer performance guide initially looked local because the Markdown file itself has no Git metadata. Direct comparison shows that it is a lightly modified copy of the public [Wafer resource repository](https://github.com/wafer-ai/gpu-perf-engineering-resources), so it does not need to remain local.
- AISys chapter references point to Chris Fregly's commercial book. The author's repository mirrors the chapter structure and supplies code, labs and checklists, which makes it the strongest public replacement under the companion-code policy.
- PMPP has no verified free full-text fourth-edition source. Elsevier's official companion and catalog pages are the lawful web targets.
- DDIA has an official website but no lawful free full text. The website remains a valid web-first landing page.
- The Hands-On LLM Serving, Deep Learning with PyTorch and High Performance Python PDFs are commercial. Their author or publisher-linked companion repositories replace the private PDF paths without implying that the full books are freely licensed.
