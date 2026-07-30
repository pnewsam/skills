---
name: advance-epic
description: Advance an epic by coordinating its next incomplete child feature. Use when asked to make one bounded step on a planned epic. Reads docs/epics/NNN-*.md, selects the next child, verifies that a feature plan exists, runs one build-feature step, updates progress only when supported by evidence, then stops. Does not publish or open a PR.
---

# Advance Epic

## Overview

Execute one bounded step of an epic. A single invocation selects one child
feature and runs at most one `build-feature` item. Mark the child complete only
when its entire feature plan is complete and verified.

If planning is missing, stop and recommend `plan-feature`; do not silently
expand a planning request into implementation.

## Idempotency requirements

Rerunning this skill for the same epic must not re-implement features that are already complete.

Before starting work on a child feature:

1. Check the epic for `[ ]` or incomplete child features.
2. If the next feature already has a corresponding `docs/features/NNN-*.md` file with all items checked, mark the epic as complete for that feature and move on.
3. If all child features are complete, report that the epic is done.

## Inputs

Prefer an epic plan from `plan-epic` with:

- A clear "Child Features" section with checkboxes.
- References to `docs/features/` files for planned features.
- Success criteria to guide prioritization.

If no epic plans exist, stop and tell the user to run `plan-epic` first.

## Safety rules

- Do not modify source code directly — delegate implementation to `build-feature`.
- Do not mark a child feature as complete unless `build-feature` reports it done.
- Do not create duplicate feature plans if one already exists.
- Do not skip child features out of order unless the user explicitly requests it.
- If working tree is dirty with unrelated changes, stop and ask which changes to include.

## Workflow

### 1. Load the epic plan

```bash
ls docs/epics/ 2>/dev/null
```

If no epic plans exist, stop and tell the user to run `plan-epic` first.

If the user did not specify an epic, list available plans and ask which one to advance.

Read the selected epic plan fully. Note:

- The epic's goals and success criteria.
- The charter principles it serves.
- The child features in scope.

Also check for a linked charter:

```bash
cat docs/CHARTER.md 2>/dev/null
```

### 2. Find the next incomplete child feature

Scan the epic's "Child Features" section for checklist items (`- [ ]`). Pick the first unchecked one.

If all child features are checked:

1. Report that the epic is complete.
2. Recommend reviewing closed PRs or running a QA pass.
3. Stop.

If the epic does not use checklists, treat each child feature heading as an item and track progress in a "Progress" section at the bottom of the file.

### 3. Ensure the feature is planned

Check whether a `docs/features/NNN-<feature-slug>.md` file exists for the selected child feature.

If the file does **not** exist:

1. Stop.
2. Inform the user that the child feature needs a plan before it can be built.
3. Recommend running `plan-feature` for this child feature (or confirming the user wants to do so now).

If the file exists but is empty or only a stub, recommend running `plan-feature` to flesh it out before proceeding.

### 4. Run `build-feature`

Invoke `build-feature` once for the selected feature plan:

```bash
# The model invokes the build-feature skill conceptually
# Read the plan at docs/features/NNN-<feature-slug>.md and proceed
```

If `build-feature` reports that the feature is already complete, proceed to step 5.

If `build-feature` reports a blocker, propagate that blocker to the user and stop.

### 5. Update the epic plan

Only when `build-feature` reports that the entire feature is complete, mark the
child feature as done in the epic file. If one item was completed but more
remain, leave the epic checkbox open and record the current progress.

- Change `- [ ]` to `- [x]`.
- Append the feature plan file path and the PR or commit reference if available.

Update a "Progress" section at the bottom of the epic if one exists:

```markdown
## Progress

| Feature | Status | Plan | PR / Commit |
| ------- | ------ | ---- | ----------- |
| ...     | [x]    | ...  | ...         |
```

Do not remove other sections.

Include the epic update in the current local commit when it belongs to the same
unit of work. Do not create an extra administrative commit or publish anything
unless the user explicitly asks.

### 6. Final response

Report:

- Which epic was advanced.
- Which child feature was completed.
- The feature plan file path.
- Whether a PR exists for the feature.
- How many child features remain incomplete.
- Recommended next steps:
  - Run `validate-feature` to comprehensively validate the completed child feature.
  - Run `advance-epic` again for the next feature.
  - If all features are complete, recommend the relevant validation pass and
    `prepare-pr`; do not invoke or publish automatically.

## Handling common situations

### Child feature is already complete

If the feature is already shipped or all acceptance criteria are checked in its plan, mark the epic checkbox as `[x]` and move to the next feature.

### Child feature plan is missing

Stop and recommend `plan-feature`. Do not guess at scope.

### Child feature is too large

If running `build-feature` reveals the feature exceeds its 1–2 week estimate, flag it to the user. Recommend splitting the feature into smaller features and updating both the epic and the feature plan.

### Epic contradicts the charter

If completing the child feature surfaces a mismatch between the epic and `CHARTER.md`, flag it explicitly rather than papering over it.
