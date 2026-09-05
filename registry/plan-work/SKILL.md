---
name: plan-work
description: Define one independently reviewable outcome with scope, acceptance, constraints, and verification. Use for a feature, bug fix, dependency, configuration, documentation, or maintenance change. Reuse an existing issue or plan; no charter or epic required. Planning alone does not implement or publish.
---

# Plan work

Apply `work-conventions`. Produce enough clarity to execute one work unit without rediscovering intent. Prefer the existing issue, feature plan, or concise brief; create a local record only when useful. Update an external record only when authorized.

## Define the outcome

Inspect the relevant implementation and existing records to avoid duplicate work. Resolve material uncertainties with `analyze-work` when needed. Accept equivalent user-supplied evidence. A charter or parent epic is useful context when available, never a prerequisite for a bounded product change.

Define one independently reviewable result, explicit non-goals, and required acceptance conditions. Distinguish optional improvements. Split unrelated outcomes; do not split a regression test from its necessary fix merely to produce more tasks or commits. If an existing feature plan contains several independent PR-sized outcomes, propose their boundaries and preserve existing IDs, completed work, and evidence.

## Choose an approach and proof

Describe only implementation decisions that constrain the work. Let the executor determine recoverable details. Record affected interfaces, data or runtime boundaries, compatibility, dependencies, and rollback expectations when material. For measured improvements, preserve the baseline, target, method, and guardrails.

Choose verification based on the changed behavior and risks, including configuration, dependencies, tests, and documentation where applicable. Identify requirements that tools cannot establish. Avoid required new infrastructure solely to make a small plan look comprehensive.

For an open visual direction, compare concrete rendered alternatives when useful; no separate design-exploration workflow is required. For applicable sensitive-data, accessibility, or operational requirements, consult `references/constraints.md`; load only the relevant portion and verify sources.

## Record and continue

Write the problem and rationale, agreed scope, required acceptance, planned verification, approach, requested endpoint, and next action into the selected record. For a new durable document, use `work-conventions/references/artifacts.md` and `work-conventions/references/work-record.md`; retain an existing suitable format. Keep planned proof separate from observed results. Tasks are optional implementation aids, not separate lifecycle gates. A small change can be one paragraph plus acceptance.

A planning-only request returns this plan without code, commits, or publication. When the user requested implementation too, continue to `execute-work`; do not demand a second approval for the established scope. Stop for user input only if the unresolved choice materially changes the intended outcome or consequences.
