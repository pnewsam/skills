---
name: prior-art
description: Research how competitors and open-source peers solve a product, UI, architecture, protocol, or engineering problem before deciding how to solve it ourselves. Use when asked for prior art, competitor references, or how other apps handle something. Includes curated reference sets for MindsDB Cowork (AI coworker apps such as Claude Cowork, Copilot Cowork, ChatGPT, goose, and Eigent) and for coding agents (Claude Code, Codex, Cursor, t3code, opencode, Zed).
---

# Prior art

Find how others solve the same problem, read the evidence, and bring back a comparison that informs the decision. Research only; the caller decides and changes things.

## Pick a reference set

| Context | Reference |
| --- | --- |
| MindsDB Cowork as a whole: chat, tasks, schedules, skills, connectors, artifacts, sharing, desktop shell | [cowork.md](references/cowork.md) |
| Coding agents, including Cowork Code Mode, and agent chat UI components | [coding-agents.md](references/coding-agents.md) |

When no set fits, search for the products and repos that solve the problem, and say the list is ad hoc. If a context recurs, add a reference file and a row here.

## Research

- Read the actual code, docs, changelogs, or release notes. Never invent the internals of a closed product.
- Treat vendor blogs that rank competitors as marketing, not evidence. The user's screenshots and notes about a product outrank anything you infer.
- Products change monthly and repos move code around. Confirm a fact or path before you cite it, and fix the reference file when one has moved.
- Compare two or three references that fit the question: UI paths for interface questions, engine paths for architecture questions.

## Return

A short table of source, approach, and link; where the references agree and where they differ; and what that suggests for the decision. Treat consensus as a default, not a mandate. The project's own sound patterns come first.
