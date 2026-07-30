---
name: audit-epic
description: Audit an epic and its child feature plans for missing scope, incomplete acceptance criteria, tracking drift, dependency gaps, definition-of-done failures, and inconsistent status. Use when assessing epic health, readiness, or remaining work. Writes a local audit report; when asked for an actionable closure plan, also writes a prioritized gap-closure plan while preserving completed items.
---

# Audit Epic

## Outcome

Produce an evidence-backed view of an epic's actual state and, when requested, a
prioritized plan to close its gaps.

This workflow may write only its local report artifacts. It does not modify the
epic, feature plans, source code, branches, tickets, or external systems.

## Modes

- **Audit:** write or refresh
  `docs/epics/NNN-<slug>-audit.md`. This is the default.
- **Closure:** perform the audit, then write or refresh
  `docs/epics/NNN-<slug>-gap-closure.md`. Use when asked what to do next, to
  plan the gaps, or to create a punch list. Read
  `references/gap_closure.md`.

## Inputs

Use the selected `docs/epics/NNN-*.md` plan and every child feature plan it
references. If the user did not identify an epic and more than one exists, list
the candidates and ask which one.

Exclude existing `-audit.md` and `-gap-closure.md` artifacts when identifying
the source epic.

## Workflow

### 1. Read the epic

Capture:

- purpose, scope, success criteria, status, and target
- every child feature and checkbox state
- explicit feature-plan paths
- stated dependencies and ordering

Resolve missing paths conservatively by matching IDs or slugs under
`docs/features/`. Do not claim a plan is missing before checking plausible
matches.

### 2. Audit each child

For each child feature, record:

- whether its plan exists
- epic checkbox and feature status
- completed and incomplete must-have criteria
- should-have criteria separately
- task progress
- definition-of-done progress
- dependencies on other children
- discrepancies between these signals

Important classifications:

- **Unplanned:** no feature plan exists.
- **Incomplete:** must-have acceptance criteria remain unchecked.
- **Tracking drift:** task completion suggests work occurred but acceptance
  criteria were not verified.
- **Status mismatch:** status or checkbox contradicts the plan's evidence.
- **Incomplete DoD:** acceptance criteria appear complete but final gates remain.

Check whether an apparently complete criterion has validation evidence when the
plan requires it. Checkboxes are evidence of recorded state, not proof of code.

### 3. Check dependencies and orphans

Escalate a gap when it blocks another child. Find feature plans that identify
this epic as their parent but are absent from its child list. Report them as
orphans; do not assume whether they should be added or deleted.

### 4. Identify systemic patterns

Treat the same gap across three or more features as a likely process problem.
Report one systemic finding with the affected features instead of repeating an
identical recommendation many times.

### 5. Rate health

- **Healthy:** child plans exist, must-have criteria and final gates are
  complete, tracking agrees, and no material orphan or dependency gap remains.
- **Caution:** remaining issues are primarily status, documentation, optional
  scope, or other bookkeeping gaps.
- **At risk:** required behavior is incomplete or unverified, a dependency is
  blocked, planning is missing, or tracking drift obscures actual completion.

Product and verification risk outweigh paperwork risk.

### 6. Write the audit

Write `docs/epics/NNN-<slug>-audit.md` with:

1. epic identity, source path, date, and health
2. summary counts
3. systemic findings
4. feature-by-feature evidence
5. discrepancies ordered by severity and dependency impact
6. orphaned plans
7. concrete recommendations

On rerun, replace stale audit conclusions with current evidence. The audit is a
snapshot, so preserving old unchecked rows is not required.

### 7. Write the closure plan when requested

In Closure mode, use the current audit and
`references/gap_closure.md`. Preserve completed punch-list items when their
underlying gap remains resolved. Never reopen an item solely because wording
changed.

Map each unresolved gap to a concrete skill or manual decision. Do not execute
the plan.

## Severity

| Severity | Typical evidence |
| --- | --- |
| High | Required criteria incomplete; missing plan blocks another feature; major tracking drift prevents verification |
| Medium | Missing plan without dependents; checkbox mismatch; isolated incomplete DoD; orphan requiring a decision |
| Low | Optional criteria, stale task detail, or status-only mismatch |

Raise severity one level when a dependency turns a local gap into a downstream
blocker. State any exception rather than applying the table mechanically.

## Final report

Return:

- epic and source plan
- audit path
- closure-plan path when created
- overall health
- highest-severity gaps
- recommended next action

If no gaps remain, say the epic appears healthy and do not manufacture a closure
plan.
