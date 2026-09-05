---
name: plan-epic
description: Decompose an agreed initiative into independently reviewable work units, normally one PR each, with dependencies, sequencing, integration evidence, and an overall outcome. Creates or updates one initiative record; no mandatory charter or fixed duration. Does not implement or publish.
---

# Plan epic

Apply `work-conventions`. An epic is a coordinated set of work units, not a fixed number of weeks or a single PR. Use `shape-initiative` only when the direction remains materially unclear; one bounded outcome belongs to `plan-work`.

## Decompose

Read the requested initiative, existing plans/issues, relevant constraints, and observed system state. Reuse the agreed initiative record. Normalize rough feedback, deduplicate equivalent observations, and preserve uncertainty. Map retained observations to a unit or an explicit exclusion.

Define units around independently reviewable outcomes. Each needs a stable identity or record link, acceptance summary, dependencies, and requested delivery boundary. Avoid horizontal splits that leave required behavior broken until an unrelated future unit. Keep atomic changes together. An existing feature plan may be reused without renaming; split it only when its outcomes genuinely need separate PRs.

## Sequence and define proof

Represent dependency edges and the condition that satisfies each: for example an API contract available on a branch, or a prerequisite merged. Identify integration checkpoints and the epic-level acceptance that individual tests cannot establish. Detect cycles or blocked prerequisites before execution. Use stacked branches only when the repository and request permit them; otherwise sequence dependent work after merge.

Plan independent units so they can be selected by readiness and value. Do not prescribe parallel agents unless authorized. Record overall non-goals, risks, and recovery expectations when material.

## Record and continue

Use `references/epic-record.md` when no suitable record exists. Prefer `docs/epics/` for a new local record, preserving existing IDs, completed history, and evidence. Creating external projects or issues is a separate requested effect, handled through the relevant runbooks.

Write enough child scope to begin; use `plan-work` just before executing a child when details depend on earlier results. Do not require fully detailed plans for every child before any work starts. Return the dependency graph, next ready unit, and integration proof. Continue to `ship-epic` when the user requested execution; a planning-only request ends here.
