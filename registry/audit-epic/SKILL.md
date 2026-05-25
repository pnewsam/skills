---
name: audit-epic
description: audit an epic to find missing, incomplete, or inconsistent child features. reads the epic plan from docs/epics/NNN-*.md, checks each child feature's plan in docs/features/, cross-references checklist completion, and writes a structured audit report such as docs/epics/NNN-slug-audit.md. use when assessing epic readiness, before a milestone, or when wondering "what's left to do on this epic?"
---

# Audit Epic

## Overview

Audit an epic plan and its child features to produce a structured report of what is complete, what is in progress, what is missing, and what is inconsistent.

Unlike `advance-epic` (which executes the next incomplete feature), this skill is read-only. It reads the epic, reads every referenced feature plan, and reports gaps. It never modifies files, commits, or branches.

Use this skill:
- Before a milestone or deadline to assess readiness.
- When returning to an epic after time away.
- When handing off an epic to another team member.
- Before declaring an epic "done."

## Inputs

- An epic plan at `docs/epics/NNN-*.md`.
- Optional: a specific feature plan ID to audit deeply (otherwise, all child features are audited).

If the user does not specify an epic, list available epics and ask which one to audit.

## Safety rules

- Read-only. Do not modify any files, branches, or configuration.
- Do not mark anything as complete or change checklist status.
- Report findings; do not attempt to fix gaps unless the user explicitly asks.

## Workflow

### 1. Load the epic

```bash
ls docs/epics/ 2>/dev/null
```

If no epic plans exist, report that there is nothing to audit and stop.

If the user did not specify an epic, list available plans and ask which one.

Read the selected epic plan fully. Note:

- The epic's goals, success criteria, and scope.
- The "Child Projects / Features" section with its checkboxes.
- Any references or links to feature plan files.
- The epic's status and target quarter.

### 2. Inventory child features

Extract every child feature from the epic's "Child Projects / Features" section. For each entry, capture:

- The checkbox status (`[ ]` or `[x]`).
- The feature name and one-line description.
- Any explicit file path reference (e.g., `docs/features/003-user-auth.md`).

If a child feature does not have an explicit file path, infer the likely path by slugifying the feature name and checking `docs/features/` for a match:

```bash
ls docs/features/ 2>/dev/null
```

### 3. Cross-reference feature plans

For each child feature:

**A. Feature plan missing**

If no corresponding `docs/features/NNN-*.md` file exists and the epic checkbox is unchecked:

- Report: feature plan missing, feature has not been planned yet.
- Recommend: run `plan-feature` for this child feature.

If no feature plan exists but the epic checkbox is checked:

- Report: discrepancy — the epic marks this feature as done, but no feature plan exists. Cannot verify.
- Flag as high-severity. This is either an oversight (forgot to check it off) or the feature was completed without a plan and needs documentation.

**B. Feature plan exists**

If the feature plan file exists, read it fully. Audit the following:

### 4. Audit each feature plan

For each feature plan that exists, check these sections:

#### Acceptance Criteria

Scan for `- [ ]` items under "Must-Have (MVP)" and "Should-Have (if time permits)".

- Count unchecked must-have criteria — these are blocking.
- Count unchecked should-have criteria — these are nice-to-have, not blocking.
- If all must-haves are `[x]` but the epic checkbox is unchecked: report as discrepancy — feature appears done but epic not updated.

#### Tasks

Scan for `- [x]` and `- [ ]` items under "Tasks".

- Count checked vs unchecked tasks.
- If tasks are checked but acceptance criteria are not: **tracking drift** — the feature was built but the AC checklist was never updated. This is a medium-severity gap. The code exists but the plan doesn't reflect what was verified.
- If no tasks are checked but some acceptance criteria are checked: the task list may be stale. Report as low-severity.

#### Cross-feature dependencies

Scan the feature plan's "Dependencies" section for references to other features in this epic.

- If a dependency references a feature that has a missing plan, unchecked AC, or other gaps: escalate the severity of the dependency's gaps. A missing plan for feature 1 is medium; if feature 4 depends on it, the combined gap is high.
- Flag in the report: "Feature X depends on Feature Y, which has gaps."

#### Definition of Done

Scan for `- [ ]` items under "Definition of Done".

- Flag any unchecked items. The definition of done is the final gate — if criteria are met but the definition of done is not, the feature is not truly complete.

#### Status field

Check the "Metadata" section for a `Status` field.

- If status is "draft" but acceptance criteria are complete: feature may be in flight but not formally marked. Report as info.
- If status is "complete" but acceptance criteria are not: discrepancy.

### 5. Check for orphaned feature plans

```bash
ls docs/features/ 2>/dev/null
```

Look for feature plans in `docs/features/` that reference the epic as their parent but are not listed in the epic's "Child Projects / Features" section.

Report these as orphans — they exist in the filesystem but are not tracked in the epic. This could mean:
- The epic was updated and this feature was removed (stale file).
- The feature was added but the epic was not updated (oversight).

### 6. Write the audit report

Write the audit report to `docs/epics/NNN-<slug>-audit.md`. Use the epic's ID and slug from its filename (e.g., epic `docs/epics/001-user-platform.md` produces audit at `docs/epics/001-user-platform-audit.md`).

If an audit file already exists for this epic, overwrite it — the new audit replaces the old one.

Structure the report as follows:

```markdown
## Epic Audit: <epic name> (<epic ID>)

**Status:** <epic status>
**Target quarter:** <quarter>
**Audit date:** <today>

### Summary

| Metric | Count |
|--------|-------|
| Total child features | N |
| Features complete (plan + epic agree) | N |
| Features in progress | N |
| Features unplanned (no feature file) | N |
| Discrepancies found | N |
| Orphaned feature plans | N |

**Overall health:** <healthy / caution / at-risk>

### Systemic Issues

<Patterns that appear across 3+ features. These are process concerns, not individual oversights.>

| Pattern | Affected Features | Severity |
|---------|-------------------|----------|
| Definition of Done unchecked across all features | All N features | medium |
| Tracking drift — tasks checked, AC not | Features 3, 5, 6 | medium |

Systemic issues should be fixed at the process level (e.g., a DoD review session) rather than as N individual items. See Recommendations below.

### Feature-by-feature

#### <Feature 1> — [x] complete

- Feature plan: `docs/features/NNN-*.md` — exists
- Acceptance criteria: 5/5 must-have, 2/2 should-have
- Tasks: 8/8
- Definition of done: 7/7
- Status: consistent — epic and feature plan agree.

#### <Feature 2> — [ ] in progress

- Feature plan: `docs/features/NNN-*.md` — exists
- Acceptance criteria: 3/4 must-have (1 unchecked), 0/2 should-have
- Tasks: 2/5 (3 unchecked)
- Definition of done: 2/7 (5 unchecked)
- Status: feature plan status is "draft". Epic checkbox is unchecked. Consistent.

#### <Feature 3> — [x] DISCREPANCY (checkbox mismatch)

- Feature plan: `docs/features/NNN-*.md` — exists
- Acceptance criteria: 4/4 must-have, 2/2 should-have — **all complete**
- Tasks: 8/8
- Definition of done: 0/7
- **Issue:** All AC and tasks are complete, but the epic marks this feature as `[ ]` incomplete.
- Recommendation: Update the epic checkbox to `[x]`.

#### <Feature 4> — [ ] TRACKING DRIFT

- Feature plan: `docs/features/NNN-*.md` — exists
- Acceptance criteria: 0/7 must-have (all unchecked)
- Tasks: 4/6 (4 checked)
- Definition of done: 1/7
- **Issue:** 4 of 6 tasks are checked off, but 0 of 7 acceptance criteria are checked. The feature appears partially built but the AC checklist was never updated.
- Recommendation: Verify which AC the completed tasks actually satisfy, then update the AC checklist to match. Any AC not yet satisfied should be built.

#### <Feature 5> — [ ] unplanned, BLOCKS Feature 6

- Feature plan: missing — no file found in `docs/features/`
- Dependencies: Feature 6 lists Feature 5 as a dependency.
- **Issue:** This feature has no plan and blocks Feature 6.
- Severity: **high** — the missing plan has downstream impact.
- Recommendation: run `plan-feature` for "<feature name>" before continuing work on Feature 6.

### Discrepancies

| # | Severity | Feature | Type | Issue |
|---|----------|---------|------|-------|
| 1 | high | Feature 5 | missing-plan + blocks-dep | No feature plan exists, and Feature 6 depends on it |
| 2 | high | Feature 3 | checkbox-mismatch | All AC complete but epic checkbox is `[ ]` |
| 3 | medium | Feature 4 | tracking-drift | 4/6 tasks done but 0/7 AC checked |
| 4 | low | Feature 2 | stale-tasks | Task list behind AC progress |

### Systemic Issues

| Pattern | Affected Features | Recommendation |
|---------|-------------------|----------------|
| Definition of Done at 0% across all features | Features 1–6 | Run a DoD review session to check off completed items across all features at once |

### Orphaned Feature Plans

| File | Parent Epic | Issue |
|------|-------------|-------|
| `docs/features/007-old-feature.md` | References epic 001 | Not listed in epic's child features |

### Recommendations

1. (high) Feature 5: Run `plan-feature` for "<feature name>" — missing plan blocks Feature 6.
2. (high) Feature 3: Update epic checkbox from `[ ]` to `[x]` — all AC and tasks are complete.
3. (medium) Feature 4: Verify which AC the completed tasks satisfy, then update the AC checklist to reflect what was actually built.
4. (medium/systemic) DoD review: Run a session across all features to check off completed definition of done items. Do not fix individually — fix at the process level.
5. (info) Run `advance-epic` to continue building the next incomplete feature.
```

### 7. Final response

Report:

- The path to the audit report file.
- The overall health assessment (healthy / caution / at-risk).
- The highest-severity discrepancies that need attention.
- Recommended next step: run `plan-epic-gaps` to create a closure plan for any gaps found.

## Health assessment criteria

| Health | Criteria |
|--------|----------|
| **healthy** | All child features have plans. All must-have AC are checked. Epic and feature checkboxes agree. No orphans. No systemic issues. |
| **caution** | All must-have AC are checked. Discrepancies are paperwork-only (stale checkbox, stale tasks, status mismatch). Systemic issues limited to DoD or should-have. |
| **at-risk** | One or more must-have AC are unchecked. A missing feature plan blocks another feature. Tracking drift (code built but AC not verified). Orphans that may represent dropped scope. |

Product risk (unbuilt AC, missing plans that block other work) matters more than paperwork risk (checkbox stale on an otherwise-complete feature). A feature with all AC done but a stale epic checkbox is a caution-level paperwork issue, not at-risk.

## Discrepancy severity

| Severity | Criteria |
|----------|----------|
| **high** | Missing feature plan that blocks another feature. Must-have AC unchecked. Tracking drift where code was built but AC never verified. |
| **medium** | Epic/feature checkbox mismatch (either direction). Missing feature plan with no downstream dependents. Definition of done incomplete when AC are complete. Orphaned feature plan. |
| **low** | Stale task list (AC ahead of tasks). Status field mismatch. Should-have criteria unchecked. |

### Adjusting severity for dependencies

When a gap in Feature A has downstream impact on Feature B, escalate by one level:

- A medium-severity missing plan becomes **high** if another feature depends on it.
- A low-severity stale task list in a dependency becomes **medium** if the dependent feature is blocked on clarity.

## Idempotency

Running this skill multiple times for the same epic should produce the same report (modulo any changes made between runs). It is read-only and safe to run repeatedly.
