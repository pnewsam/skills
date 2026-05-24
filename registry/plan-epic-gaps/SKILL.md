---
name: plan-epic-gaps
description: create a prioritized plan to close gaps found by audit-epic. reads the audit report from docs/epics/NNN-<slug>-audit.md, maps each gap to a concrete action, prioritizes by severity and dependency order, and writes a structured gap-closure plan. use after audit-epic to turn findings into an actionable punch list. pairs with audit-epic.
---

# Plan Epic Gaps

## Overview

Take the findings from `audit-epic` and produce a prioritized, actionable plan to close every gap. This skill transforms a list of discrepancies into an ordered punch list — what to do, in what order, and which skill to use for each item.

Unlike `audit-epic` (read-only analysis), this skill produces a plan that guides execution. It does not modify files itself — it writes a gap-closure plan that can be executed item by item.

## Inputs

- An audit report at `docs/epics/NNN-<slug>-audit.md`, produced by `audit-epic`.
- If no audit report exists for this epic, run `audit-epic` first to generate one.

## Safety rules

- Do not modify the epic, feature plans, or source code. This skill produces a plan only.
- Do not execute the planned actions — leave that to the user or the referenced skills.
- Every planned action must reference a specific skill or manual step. No vague "figure it out" items.
- Gaps that require a human decision (e.g., "should we keep this feature or drop it?") must be flagged as decisions, not automated actions.

## Workflow

### 1. Load the audit report

Find the audit report for the epic:

```bash
ls docs/epics/*audit*.md 2>/dev/null
```

If the user specified an epic, look for the corresponding audit file (e.g., `docs/epics/001-user-platform-audit.md`).

If the audit file exists, read it fully. Note the health assessment, every discrepancy, and every orphaned feature plan.

If no audit file exists:

1. Stop.
2. Inform the user that `audit-epic` must be run first to generate the audit report.
3. Recommend running `audit-epic` for this epic, then returning to `plan-epic-gaps`.

### 2. Inventory the gaps

From the audit report, extract every gap into a flat list. Each gap must have:

- **Source:** which feature or section it came from.
- **Severity:** high, medium, or low (as assigned by `audit-epic`).
- **Type:** what kind of gap it is (see classification below).
- **Current state:** what's wrong now.
- **Target state:** what "fixed" looks like.

Gap types:

| Type | Description | Fix action |
|------|-------------|-------------|
| `missing-plan` | Feature in epic has no feature plan file | Run `plan-feature` |
| `unchecked-criteria` | Must-have acceptance criteria not done | Run `build-feature` for each unchecked criterion |
| `checkbox-mismatch` | Epic checkbox disagrees with feature plan state | Manual: verify actual state, then update the incorrect checkbox |
| `incomplete-dod` | Definition of done has unchecked items | Run `build-feature` or manual verification for each undone item |
| `stale-tasks` | Task list doesn't reflect actual progress | Manual: refresh the task list to match reality |
| `orphan-plan` | Feature plan file not tracked in any epic | Decision needed: add to epic or delete the file |
| `status-mismatch` | Feature plan status field doesn't match reality | Manual: update the status field |
| `missing-epic-reference` | Feature plan doesn't link to its parent epic | Manual: add the parent epic reference |

### 3. Determine the fix for each gap

For each gap, map it to a concrete action. Be specific:

**Good actions:**
- "Run `plan-feature` for 'User Notifications' feature"
- "Complete acceptance criterion: 'User receives email on signup' via `build-feature`"
- "Verify whether 'Payment Integration' is actually done, then update the epic checkbox"

**Bad actions:**
- "Fix the feature plan"
- "Address the discrepancy"
- "Figure out what's missing"

Gaps that require a human decision (e.g., whether to keep an orphaned feature, whether to descope a should-have) must be surfaced as decision points with clear options:

```markdown
### Decision: Orphaned feature "Old Dashboard"

The file `docs/features/007-old-dashboard.md` references epic 001 but is not listed in the epic's child features.

**Options:**
1. Add it to the epic if it's still in scope.
2. Delete the file if the feature was intentionally dropped.
3. Move it to a different epic if it belongs elsewhere.
```

### 4. Prioritize

Order the actions by:

1. **Severity:** high before medium before low.
2. **Dependency:** actions that unblock other actions go first. A missing feature plan must be created before its acceptance criteria can be built. An orphan decision must be resolved before the file can be acted on.
3. **Effort:** within the same severity and dependency level, prefer quick wins first.

### 5. Write the gap-closure plan

Write the plan to `docs/epics/NNN-<slug>-gap-closure.md` using the structure below. If the file already exists, update it (preserving any items already marked complete).

```markdown
# Gap Closure Plan: <epic name> (<epic ID>)

## Metadata

- **Epic:** `docs/epics/NNN-<slug>.md`
- **Audit date:** <date from audit>
- **Plan created:** <today>
- **Total gaps:** N
- **High:** N | **Medium:** N | **Low:** N

## Summary

<One paragraph describing the overall state and the most important gaps to close.>

## Decision Points

<Any gaps that require a human decision before the plan can proceed. These block the items below them.>

### Decision 1: <title>

- **Context:** <what the gap is and why it needs a decision>
- **Options:**
  1. <Option A — with implications>
  2. <Option B — with implications>
- **Recommendation:** <which option and why>

## Punch List

### Blockers (decisions needed first)

- [ ] **DECIDE:** <decision title> — see Decision Points above.

### High Priority

- [ ] **<Feature name>:** Run `plan-feature` for "<feature name>" — no feature plan exists.
- [ ] **<Feature name>:** Run `build-feature` to complete criterion: "<criterion text>"
- [ ] **<Feature name>:** Verify feature is actually complete, then update epic checkbox from `[ ]` to `[x]`.

### Medium Priority

- [ ] **<Feature name>:** Complete definition of done items: <list unchecked items>
- [ ] **Orphan:** Decide fate of `docs/features/NNN-<slug>.md` — add to epic or delete.

### Low Priority

- [ ] **<Feature name>:** Refresh stale task list to reflect actual progress.
- [ ] **<Feature name>:** Update status field from "draft" to "in progress".

## Execution Order

<Numbered list showing the recommended order to work through the punch list, respecting dependencies.>

1. Resolve Decision 1 (blocks items 2 and 3).
2. Run `plan-feature` for "<Feature 4>" (unblocks item 3).
3. Run `build-feature` to complete unchecked criteria in "<Feature 3>".
4. ...
```

### 6. Final response

Report:

- The epic audited and the number of gaps found.
- How many are high / medium / low severity.
- How many require a human decision.
- The path to the gap-closure plan.
- Recommended next step: work through the punch list from top to bottom, or run `advance-epic` if the remaining gaps are just "build the next feature."

## Gap classification reference

When classifying gaps, use these mappings:

| Audit finding | Gap type | Default action |
|---------------|----------|----------------|
| Feature plan missing, epic unchecked | `missing-plan` | Run `plan-feature` |
| Feature plan missing, epic checked | `checkbox-mismatch` | Decision: verify if done, then fix |
| Must-have criteria unchecked, epic checked | `checkbox-mismatch` | Run `build-feature` for remaining criteria |
| Must-have criteria unchecked, epic unchecked | `unchecked-criteria` | Run `build-feature` |
| Should-have criteria unchecked | `stale-tasks` (low) | Run `build-feature` if time permits |
| Definition of done incomplete | `incomplete-dod` | Run `build-feature` or manual verification |
| Task list stale | `stale-tasks` | Manual: refresh task list |
| Orphaned feature plan | `orphan-plan` | Decision: add to epic or delete |
| Status field mismatch | `status-mismatch` | Manual: update status field |

## Idempotency

If a gap-closure plan already exists for this epic, read it first. Preserve items already marked `[x]`. Only add new gaps from the latest audit. Update severity ratings if the audit shows they changed.

## When not to use this skill

- If `audit-epic` found no gaps, there is nothing to plan. Report that the epic is healthy.
- If the epic has no child features, there is nothing to audit or plan. Recommend `plan-epic` to define the child features first.