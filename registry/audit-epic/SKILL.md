---
name: audit-epic
description: audit an epic to find missing, incomplete, or inconsistent child features. reads the epic plan from docs/epics/NNN-*.md, checks each child feature's plan in docs/features/, cross-references checklist completion, and produces a structured report of gaps and undone work. use when assessing epic readiness, before a milestone, or when wondering "what's left to do on this epic?"
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

Scan for `- [ ]` items under "Tasks".

- Count unchecked tasks.
- If no tasks are checked but some acceptance criteria are: the task list may be stale. Report as a warning.

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

### 6. Produce the audit report

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

#### <Feature 3> — [x] DISCREPANCY

- Feature plan: `docs/features/NNN-*.md` — exists
- Acceptance criteria: 3/4 must-have (1 unchecked)
- **Issue:** Epic marks this feature as `[x]` complete, but 1 must-have criterion is unchecked.
- Recommendation: Either complete the remaining criterion and verify, or revert the epic checkbox.

#### <Feature 4> — [ ] unplanned

- Feature plan: missing — no file found in `docs/features/`
- **Issue:** This feature has no plan.
- Recommendation: run `plan-feature` for "<feature name>".

### Discrepancies

| # | Severity | Feature | Issue |
|---|----------|---------|-------|
| 1 | high | Feature 3 | Epic marked done but 1 criterion unchecked |
| 2 | medium | Feature 4 | No feature plan exists |
| 3 | low | Feature 2 | Task list may be stale (criteria done, tasks not) |

### Orphaned Feature Plans

| File | Parent Epic | Issue |
|------|-------------|-------|
| `docs/features/007-old-feature.md` | References epic 001 | Not listed in epic's child features |

### Recommendations

1. (high) Feature 3: Complete the remaining must-have criterion `[ ] ...` or revert the epic checkbox.
2. (medium) Feature 4: Run `plan-feature` to create a plan, or remove from epic if no longer in scope.
3. (low) Feature 2: Refresh the task list — acceptance criteria are progressing faster than tasks suggest.
4. (info) Run `advance-epic` to continue building the next incomplete feature.
```

### 7. Final response

Deliver the report and highlight:

- The overall health assessment (healthy / caution / at-risk).
- The highest-severity discrepancies that need attention.
- Concrete next steps for each gap found.

## Health assessment criteria

| Health | Criteria |
|--------|----------|
| **healthy** | All child features have plans. All must-have criteria are done. Epic and feature checkboxes agree. No orphans. |
| **caution** | Some should-have criteria or tasks remain, but all must-haves are done. Minor discrepancies only (stale task lists, status fields). |
| **at-risk** | One or more must-have criteria are unchecked. Epic/feature checkbox mismatch. Missing feature plans for features still in scope. Orphans that may represent dropped scope. |

## Discrepancy severity

| Severity | Criteria |
|----------|----------|
| **high** | Epic checkbox says done but feature plan has unchecked must-have criteria. Feature plan says complete but epic checkbox is unchecked. Missing feature plan for an in-scope feature. |
| **medium** | Feature plan missing entirely. Definition of done incomplete despite criteria being met. Orphaned feature plan. |
| **low** | Stale task lists. Status field mismatch (draft vs progress). Should-have criteria unchecked. |

## Idempotency

Running this skill multiple times for the same epic should produce the same report (modulo any changes made between runs). It is read-only and safe to run repeatedly.