---
name: build-feature
description: implement one acceptance criterion or task from a feature plan produced by plan-feature. use when building a planned feature. reads docs/features/NNN-*.md, picks the next unchecked item, implements the code change, verifies it against the criterion, commits on a feature branch, and marks the item as complete in the plan. run repeatedly until the feature is complete. when all items are done, invokes prepare-pr to push the branch to GitHub and open a pull request. pairs with plan-feature.
---

# Build Feature

## Overview

Execute a planned feature one acceptance criterion or task at a time. This skill reads a feature plan from `docs/features/NNN-*.md`, identifies the next unimplemented item, writes the minimal code to satisfy it, verifies the result, commits, and updates the plan.

The intended automation model is: take one unchecked item, run this skill, commit the work, mark the item done, and stop. A loop can then invoke the skill again for the next item.

## Idempotency requirements

Rerunning this skill for the same feature must not re-implement items that are already checked off.

Before starting work on an item:

1. Scan the plan for `[ ]` list items.
2. If the first unchecked item is already partially addressed in the working tree, resume from there rather than starting over.
3. If all items are `[x]`, report that the feature is complete and recommend running `prepare-pr`.

If the current branch already contains commits for this feature but no PR exists yet, continue committing to the same branch.

## Inputs

Prefer a feature plan from `plan-feature` with:

- Clear acceptance criteria or implementation tasks as a checklist (`- [ ]`).
- A parent epic reference for context.
- Technical notes or API contracts.
- Estimated size (to calibrate expected scope per item).

If no plan exists, ask the user to run `plan-feature` first or supply the feature details directly.

## Safety rules

- Never run destructive git commands such as `git reset --hard`, `git clean`, force-push, rebase, or amend unless the user explicitly requests that exact operation.
- Keep changes focused to the current item. Do not refactor adjacent code or add unrelated improvements.
- Do not mark an item as complete until it has been verified.
- Do not commit secrets, generated artifacts, or unrelated changes.
- If a working tree is dirty with unrelated changes, stop and ask which changes to include.
- Avoid direct pushes to protected base branches.

## Workflow

### 1. Load the feature plan

```bash
ls docs/features/ 2>/dev/null
```

If no feature plans exist, stop and tell the user to run `plan-feature` first.

If the user did not specify a feature, list available plans and ask which one to build.

Read the selected feature plan fully. Note:

- The user story and acceptance criteria.
- Any implementation tasks or technical notes.
- The parent epic for broader context.

Also read the parent epic if referenced:

```bash
cat docs/epics/<parent>.md 2>/dev/null
```

### 2. Confirm repository state and feature branch

```bash
git status --short --branch
git branch --show-current
git remote -v
```

Determine the feature branch. Use the plan ID or slug:

```text
feat/<feature-slug>
```

If the current branch is `main`, `master`, or a protected branch, create and switch to the feature branch:

```bash
git checkout -b feat/<feature-slug>
```

If already on `feat/<feature-slug>`, continue.

If on a different branch, ask the user whether to switch or stay.

### 3. Select the next unchecked item

Scan the feature plan for checklist items (`- [ ]`). Pick the first one.

If all items are checked:

1. Report that the feature is complete.
2. Invoke `prepare-pr` to push the feature branch to GitHub and open a pull request.
3. Stop.

If the plan does not contain checklists, treat each acceptance criterion as a single item and track progress in a "Progress" section at the bottom of the file.

Before starting, update the plan (if possible) to indicate the item is in progress — change `- [ ]` to `- [~]`. Do not commit the plan file yet.

### 4. Understand the requirement

Read the specific item carefully. Ask clarifying questions only if the requirement is genuinely ambiguous. Otherwise, proceed to implementation.

Identify the relevant files by:

- Reading the technical notes in the feature plan.
- Searching for components, routes, or APIs mentioned in the criterion.
- Reading existing tests that cover related behavior.

### 5. Implement the change

Write the minimal code necessary to satisfy the acceptance criterion:

- Follow existing code conventions, patterns, and style.
- Do not refactor adjacent code.
- Do not add error handling for unrelated edge cases.
- If the change spans multiple files, ensure they are part of the same logical unit of work.

Common implementation patterns:

- **New UI**: Add or modify React components, CSS, and routing.
- **New API**: Add or modify endpoints, handlers, and validation.
- **Data/model change**: Update schemas, migrations, and fixtures.
- **Integration**: Wire frontend to backend, or connect to a third-party service.
- **Test**: Add tests that verify the acceptance criterion.

### 6. Verify

Run verification commands based on the project:

```bash
# JavaScript/TypeScript
npm test
npm run lint
npm run typecheck

# Python
pytest
python -m mypy .

# Ruby
bundle exec rspec
bundle exec rubocop

# Rust
cargo test
cargo clippy

# Go
go test ./...
go vet ./...
```

Use the project's actual commands from `package.json`, `Makefile`, CI config, or the feature plan's technical notes.

If there is no automated test for the new behavior, perform manual verification (e.g., run the app locally and walk through the user story). Document the manual verification steps.

Do not mark the item complete if verification fails. Fix the issue or mark it as blocked and explain why.

**After the item passes basic verification:** If the change touches UI, routing, or shared components, recommend running `validate-changes` for targeted regression testing on the changed area. This is optional during the build loop but highly recommended for items with broad blast radius.

### 7. Update the feature plan

Mark the item as complete in the plan file:

- Change `- [~]` or `- [ ]` to `- [x]`.
- Append a brief note: what was changed, files touched, verification result, and commit hash.

Update a "Progress" section at the bottom of the plan if one exists:

```markdown
## Progress

| Criterion | Status | Commit | Notes |
|-----------|--------|--------|-------|
| ...       | [x]    | abc123 | ...   |
```

Do not remove other sections or alter unchecked items.

### 8. Commit

Stage only the intended files:

```bash
git add <changed-files>
```

Include the updated feature plan file in the commit so progress is tracked in git.

Inspect staged changes:

```bash
git diff --cached --stat
git diff --cached
```

Use a conventional commit message. Reference the plan ID:

```text
feat(<scope>): <description of the acceptance criterion>

<short body explaining what changed and why>

Feature: <plan-id>
```

```bash
git commit -m "feat(<scope>): <title>" -m "<body>" -m "Feature: <plan-id>"
```

If there are no staged changes, report that the item may already be implemented or that no safe change was found.

### 9. Final response

Report:

- Which feature plan was used and which item was implemented.
- The acceptance criterion that was satisfied.
- Files changed.
- Verification result (test command and outcome, or manual verification steps).
- Commit hash.
- How many items remain unchecked in the plan.
- Recommended next steps:
  - If items remain: run `build-feature` again for the next item.
  - If the feature is complete: run `validate-feature` for a comprehensive validation pass, then invoke `prepare-pr` to push the branch to GitHub and open a pull request.
  - If changes touched UI, routing, or shared components: consider running `validate-changes` for targeted regression testing.

## Handling common situations

### Item is already implemented

Verify via code inspection or tests. Mark it as `[x]` in the plan with a note and skip to the next item.

### Item requires a plan update

If implementing the item reveals that the acceptance criterion was underspecified, update the plan to reflect reality (add sub-tasks, clarify edge cases) and inform the user.

### Item is too large for one commit

If the acceptance criterion turns out to span multiple logical changes, consider breaking it into sub-items in the plan. Implement one sub-item per invocation. Do not create giant commits.

### Verification requires a running dev server

Note the start command in the final response. If manual verification was performed, document the exact steps.

### Tests do not exist for this area

Add a focused test for the new behavior if the project has a test setup. If not, document manual verification steps clearly.

### Parent epic references a different direction

If the feature implementation contradicts the parent epic's current understanding, flag the mismatch to the user rather than silently overriding the epic.
