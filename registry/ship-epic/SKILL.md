---
name: ship-epic
description: Complete an epic end-to-end by planning all missing child features, advancing the epic until every feature is complete, validating the completed work, and preparing a pull request. Use when the user asks to run plan-feature until all features are planned, advance-epic until all features are complete, and prepare-pr afterward. Orchestrates plan-feature, advance-epic, validate, and prepare-pr while preserving context, stopping on blockers, and avoiding duplicate plans or unrelated git changes.
---

# Ship Epic

## Overview

Drive one epic from planned initiative to PR-ready branch. This skill is an orchestrator: it does not replace `plan-feature`, `advance-epic`, `execute-feature`, `validate`, or `prepare-pr`; it runs them in the right order until the epic is complete or a blocker requires user input.

Use this when the user wants the full sequence:

1. Plan every unplanned child feature.
2. Advance the epic one feature at a time until all child features are complete.
3. Validate the completed work.
4. Prepare a pull request.

## Safety Rules

- Do not start without an epic plan from `docs/epics/` unless the user explicitly provides another epic source.
- Do not invent child feature scope. Missing or unclear feature scope must go through `plan-feature`.
- Do not implement directly. Delegate feature implementation to `advance-epic`, which delegates to `execute-feature`.
- Do not create duplicate feature plans. Reuse existing `docs/features/` files when they match a child feature.
- Do not run `prepare-pr` until the epic is complete or the user explicitly asks for a partial PR.
- Stop if the working tree contains unrelated changes and ask what should be included.
- Stop on any blocker reported by `plan-feature`, `advance-epic`, `execute-feature`, `validate`, or `prepare-pr`.
- Keep a progress summary after every loop so the run can resume safely if interrupted.

## Workflow

### 1. Establish Context

Inspect repository state:

```bash
git status --short
ls docs/epics/ 2>/dev/null
ls docs/features/ 2>/dev/null
```

If the user did not specify an epic, choose the only active epic if exactly one exists. If multiple plausible epics exist, ask which one to ship.

Read the selected epic fully. Identify:

- child features
- checked vs unchecked items
- linked feature plans
- success criteria
- blockers, dependencies, or non-goals

If no epic exists, stop and recommend `plan-epic`.

### 2. Plan Missing Features

For each child feature in the epic:

1. Check whether it has a corresponding `docs/features/NNN-*.md` plan.
2. If a complete plan exists, leave it alone.
3. If no plan exists or the file is only a stub, run `plan-feature` for that child feature.
4. After planning, update the epic link or progress table if the epic tracks feature plan paths.

Repeat until every child feature has a usable feature plan.

Before moving on, report:

- how many feature plans already existed
- how many were created
- any feature scope that was split, merged, or blocked

### 3. Advance the Epic to Completion

Run `advance-epic` repeatedly for the selected epic.

After each completed child feature:

1. Confirm the epic checkbox or progress entry was updated.
2. Confirm the feature plan reflects completed acceptance criteria.
3. Run the smallest validation tier recommended by `advance-epic` or
   `execute-feature`. If the feature needs an aggregate backend, full browser,
   screenshot, or rehearsal boundary, record that boundary and its due point in
   the feature plan; do not rerun a prior aggregate merely because a focused
   assertion changed. A repeat needs a written changed-checkpoint and
   focused-proof-insufficient reason.
4. Re-read the epic to find remaining incomplete features.

Stop the loop when:

- all child features are complete
- a downstream skill reports a blocker
- validation fails
- unrelated working-tree changes appear
- the user changes direction

Do not skip features out of order unless the user explicitly requests it.

### 4. Final Validation

When the epic appears complete:

1. Re-read the epic and all linked feature plans.
2. Confirm all child feature checkboxes are complete.
3. Confirm no planned acceptance criteria remain unchecked.
4. Run the most relevant validation available for the repo:
   - `validate` for the final or highest-risk feature
   - project test/build commands if known
   - browser tests when the epic touches critical UI flows
5. If validation fails, stop and report the failure before preparing a PR.

### 5. Prepare the PR

Once the epic is complete and validation has passed, run `prepare-pr`.

`prepare-pr` owns:

- branch inspection
- staging decisions
- commit message
- commit creation
- push
- PR creation

If there are unrelated changes, suspicious files, or generated artifacts, follow `prepare-pr` and ask before staging.

### 6. Final Response

Report:

- selected epic
- feature plans created or reused
- child features completed
- validation performed
- PR status or URL, if created
- blockers, if any
- any remaining follow-up work

## Resume Behavior

If this skill is re-run after interruption:

1. Re-read the epic and linked feature plans.
2. Treat checked features and completed acceptance criteria as authoritative.
3. Continue from the first incomplete child feature or missing feature plan.
4. Do not repeat completed work.

## When Not To Use This Skill

- Use `plan-epic` when no epic exists.
- Use `plan-feature` when only one feature needs planning.
- Use `advance-epic` when the user wants exactly one child feature advanced.
- Use `prepare-pr` when the work is already complete and only PR preparation remains.
