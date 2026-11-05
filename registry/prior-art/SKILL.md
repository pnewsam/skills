---
name: prior-art
description: Research how competitors and open-source peers solve a product, UI, architecture, protocol, or engineering problem, or find where our product falls behind them and what it would take to catch up. Use when asked for prior art, competitor references, how other apps handle something, a competitive gap analysis, or to bring a feature or UI element up to what competitors or the category standard do. Includes curated reference sets for coding agents and AI coworker apps; a project can keep its own.
---

# Prior art

Find how others solve the same problem, read the evidence, and bring back a comparison that informs the decision. This skill only researches; the caller decides what to change.

## Pick a reference set

First, look in the project for its own reference set, such as `docs/prior-art.md` or a prior-art section in its agent instructions. A project's own set outranks the general ones below.

| Context | Reference |
| --- | --- |
| Coding agents and agent chat UI components | [coding-agents.md](references/coding-agents.md) |
| AI coworker apps: chat, tasks, schedules, skills, connectors, artifacts, sharing, desktop shell | [ai-coworkers.md](references/ai-coworkers.md) |

If no set fits, search for the products and repos that solve the problem, and say the list is ad hoc. If a context keeps coming up, suggest adding a reference set to the project.

## Research

- Read the actual code, docs, changelogs, or release notes. Never invent the internals of a closed product.
- Treat vendor blogs that rank competitors as marketing, not evidence. The user's screenshots and notes about a product outrank anything you infer.
- Products change monthly and repos move code around. Confirm a fact or path before you cite it, and fix the reference file when one has moved.
- Compare two or three references that fit the question: UI paths for interface questions, engine paths for architecture questions.

## Find the gaps

Use this mode when the goal is to catch up, not just to learn. Inspect our own product first, using its code, a running build, or the user's screenshots, because a gap claimed against an unread product is a guess. Then compare the same surface across the references and classify each difference:

- **Missing:** the references have it and we do not.
- **Behind:** we have it, but it is weaker in behavior, states, or polish.
- **Divergent:** we chose differently. Say whether the choice looks deliberate and sound.
- **Ahead:** we do something the references do not. Keep it.

When most references do something, it is the category standard, and missing it costs the most. When only one does, it is an idea, not a gap. Rank the gaps by user impact and cost. Prefer the project's own sound patterns to copying a competitor.

## Return

A short table of source, approach, and link. Say where the references agree and where they differ, and what that suggests for the decision. Treat consensus as a default, not a mandate.

In gap mode, also return the ranked gaps with evidence for both sides. Then name the next step: `execute-work` for one small fix, `plan-work` for one reviewable gap, or `plan-epic` for several.
