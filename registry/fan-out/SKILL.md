---
name: fan-out
description: Run several subagents in parallel on one work unit and reconcile their results — competing design or implementation attempts then graft the best (arena), partitioned coverage or research across a broad surface (swarm), or the same artifact reviewed by independent models and reconciled (interrogate). Reach for it when one pass genuinely under-covers or locks in the first shape: a complex or high-consequence review, an implementation whose approach is uncertain, a wide or contested design, research spanning many sources, or a coverage surface too big for one context. Skip it for routine changes a single pass handles, and prefer a different-lab frontier model for diversity over a cheaper same-family one. A capability any operation may call, not a lifecycle phase; needs a subagent/workflow substrate.
---

# Fan-out

Parallelism is a method for producing a result an operation already owns, not a new result. `execute-work` and `plan-work` call the design modes, `validate-work` and `review-work` call the coverage and review modes. Fan out within one work unit; coordinating several units is `ship-epic`, not this.

Fan-out earns its cost only when one pass genuinely under-covers or over-commits: a contested design, a diff whose defects hide in synthesis across distant code, coverage too broad for one context, or a complex change where a single model's blind spots matter. For a small, well-understood change a single pass is cheaper and usually enough — say so and do it directly rather than fanning out by habit. A frontier model reviewing a small diff is already at ceiling; fan-out pays off with scale (a large surface, a complex or high-consequence PR, a wide design space), not with routine changes.

This runbook needs a subagent or workflow substrate (parallel workers, per-worker model selection, result aggregation). When none is available, run the closest sequential approximation and state the limitation; do not claim a parallel result you did not produce.

## Choose the mode

- **arena** — competing attempts at the *same* brief (a design or a self-contained implementation). Use when the solution space is wide and the first shape would otherwise stick.
- **swarm** — workers over *different* slices: a coverage matrix, a race or gauntlet, or an exploration partition. Use for breadth one context cannot hold.
- **interrogate** — the *same* artifact reviewed by several independent reviewers, at least one a different-lab frontier model. Use before shipping a contested or high-consequence change.

If the task is a single clear decision, none of these applies — decide it. If it crosses a boundary or moves ownership, design first (arena), then interrogate the result.

## Shared mechanics

Isolate anything that writes. Workers that touch the same files run in separate worktrees or checkouts so they cannot clobber each other; read-only workers need no isolation. Give every worker the same brief, context, and acceptance, and withhold the other workers' output so each is genuinely independent.

Diversify where diversity is the point, and diversify toward strength. For interrogate and for any judge, the useful axis is a genuinely different training lineage — a frontier model from a different lab (a GPT-, Gemini-, or DeepSeek-class model) reviewing alongside the primary one — because it brings blind spots the primary model does not share. A cheaper or smaller model of the same family is not diversity: measured, it adds false positives without new signal, so do not pad a panel with one. The reviewer of a change should not be the model that wrote it, and a finding two independent frontier models raise is higher-confidence signal. Cross-lab access may depend on a provider or MCP being wired up; disclose the actual models used and, when a different lab was unavailable, say so rather than substituting a weaker same-lab model and calling it diversity.

Reconcile in a single pass over the collected results. Deduplicate by root cause. Keep what the evidence supports; drop what a worker asserted without support, especially from a weaker model. Apply nothing to the working tree automatically — reconciliation produces a result for the calling operation, which owns any change, commit, or posting under its own authorization.

## Mode contracts

**arena.** Spawn N attempts on the same brief in isolated worktrees. Score them with a read-only judge on a different model family against the brief's acceptance, not on style. Pick one base and graft the stronger ideas from the others into it; name what was grafted and from where. Return the chosen candidate and the judge's reasoning, not N diffs for the user to compare.

**swarm.** Partition the work into slices — coverage cells, race arms, or exploration branches — and give each worker one slice. Each returns a compact `PASS` / `ISSUES` / `BLOCKED` with evidence. The parent aggregates one report keyed by slice; a `BLOCKED` slice is reported, not silently dropped. No base-selection or grafting.

**interrogate.** Send the same diff, intent, context, and validation to several reviewers — including at least one different-lab frontier model when access allows — each blind to the others and to any prior verdict. A lead reconciles: keep findings the finding model supports, raise confidence on those independently raised by more than one reviewer, drop those a reviewer cannot ground or that another refutes. Return findings ordered by severity through `review-work`'s output shape, disclosing the models used. Refutation counts as much as extension — a fan-out that only adds findings inflates false positives, which is exactly how a weaker reviewer degrades a panel.

## Return contract

Return the reconciled result the calling operation needs — the chosen candidate (arena), the per-slice report (swarm), or the consolidated findings and verdict (interrogate) — plus the models used and any worker that failed or was skipped. State the parallel width actually achieved; if the substrate forced a narrower or sequential run, say so rather than implying full fan-out.
