---
name: fix-bug-bash-item
description: implement one fix from a bug bash plan — investigate the issue, apply a targeted fix, verify it, commit, push, and create or update a pull request. use after planning a bug bash or when asked to fix one item from a bug bash tracker. run repeatedly to work through the queue. pairs with plan-bug-bash.
---

# Fix Bug Bash Item

## Overview

Implement one discrete fix from a bug bash plan safely and idempotently. This skill takes an issue from `plan-bug-bash` or enough detail from the user, investigates the root cause, applies a targeted fix, verifies the result, commits, pushes a deterministic branch, and creates or updates a pull request.

The intended automation model is: take one `ready` issue off the queue, run this skill, update progress, and stop after one PR is created or updated. A loop can then invoke the skill again for the next issue.

For longer-running or automated work, the queue and progress log should live in `docs/tmp/bug-bash.md`. This tracker is created by `plan-bug-bash` and consumed by this skill.

## Idempotency requirements

Rerunning this skill for the same issue must not create duplicate branches or PRs.

Use these stable identifiers:

- `issue_id`: from the plan, or derive from the issue description.
- `branch_name`: `bugfix/<issue_id>` unless the plan specifies another deterministic branch.
- PR marker in the PR body:

```text
<!-- bug-bash: issue_id=<issue_id> -->
```

Before creating new work, search for:

- An open PR containing the marker.
- An open PR with a matching branch name.
- An existing local or remote branch with the deterministic branch name.

If a matching open PR already addresses the issue, update that PR only if necessary and do not open another.

## Inputs

There are two supported input modes:

1. **Tracker-file input** — read `docs/tmp/bug-bash.md` and process exactly one issue with `Status: ready`. Prefer this mode for long-running or automated loops.
2. **Conversation input** — consume one issue supplied directly in the conversation by `plan-bug-bash` or the user.

An issue should include when available:

- `issue_id`
- `title`
- `category`
- `severity`
- `effort`
- `location`
- `description`
- `likely_files`
- `reproduction` steps
- `acceptance_criteria`
- `branch_name`

If no plan exists, first check whether `docs/tmp/bug-bash.md` exists. If it does, use the next `Status: ready` issue. If it does not exist, gather enough information from the user to understand the issue, or suggest running `plan-bug-bash` first.

## Safety rules

- Never run destructive git commands such as `git reset --hard`, `git clean`, force-push, rebase, or amend unless the user explicitly requests that exact operation.
- Keep fixes focused and minimal. Do not refactor surrounding code, add unrelated improvements, or "clean up while you're in there."
- Do not commit secrets, local environment files, dependency folders, caches, generated build artifacts, or unrelated user changes.
- Do not overwrite unrelated uncommitted changes. If the working tree is dirty, inspect and either include only related files or stop for user input.
- Avoid direct pushes to protected base branches such as `main`, `master`, `develop`, or release branches.
- One issue should produce one branch and one PR.
- State clearly if verification could not be completed.

## Workflow

### 1. Load the tracker or supplied issue

If `docs/tmp/bug-bash.md` exists and the user did not supply a specific issue, read it and select the first issue under `## Issues` with `Status: ready`. Process exactly one issue per invocation.

If the user supplies an `issue_id`, read the matching `### <issue_id>` section from the tracker when present.

If using tracker-file input, update the selected issue immediately before making changes:

- Change `Status: ready` to `Status: in-progress`.
- Append a progress note that work started.
- Preserve all previous progress notes.
- Do not remove other issues.

If no tracker exists and no issue is supplied, ask the user to provide issue details or run `plan-bug-bash` first.

### 2. Confirm repository state and base branch

```bash
git status --short --branch
git branch --show-current
git remote -v
git fetch origin
```

Determine the default/base branch:

```bash
gh repo view --json defaultBranchRef
```

If `gh` is unavailable or unauthenticated, you may still make local changes, but cannot check or create PRs. Tell the user exactly what is blocked.

### 3. Investigate the issue

Before writing any fix, understand the problem:

1. Read the files identified in `likely_files` from the plan.
2. Search for related code using component names, route paths, CSS selectors, or UI text from the issue description.
3. Follow the reproduction steps mentally through the code to identify the root cause.
4. Check for related tests that might need updating.
5. Look for similar patterns elsewhere in the codebase that might indicate a systemic issue (note but do not fix — keep scope to this one issue).

If the root cause cannot be identified:

- If the issue description is too vague, update the tracker to `Status: needs-clarification` with a specific question, and stop.
- If the code area is found but the bug isn't reproducible from the code alone, apply the best-effort fix based on the description and note the uncertainty.

### 4. Check for existing PRs

Search open PRs before changing files:

```bash
gh pr list --state open --limit 100 --json number,title,headRefName,baseRefName,body,labels,url
```

A PR counts as matching if it has the marker for this `issue_id`, or if it targets the same code for the same issue.

If an open PR already fixes the issue, update the tracker to `Status: covered-by-existing-pr`, set `PR: <url>`, and stop.

If an open PR exists for this branch but is incomplete, check out that branch and continue work there.

### 5. Prepare the deterministic branch

Use the planned branch name, usually `bugfix/<issue_id>`.

```bash
git branch --list <branch_name>
git ls-remote --heads origin <branch_name>
```

If the current branch is a protected base branch, create the fix branch:

```bash
git checkout -b <branch_name> origin/<base_branch>
```

If the remote branch already exists:

```bash
git checkout -B <branch_name> --track origin/<branch_name>
```

### 6. Apply the fix

Write the minimal, targeted fix:

- Change only what is necessary to resolve the issue.
- Follow existing code conventions, patterns, and style.
- Do not add comments explaining the fix unless the logic is genuinely non-obvious.
- Do not refactor adjacent code.
- Do not add error handling for unrelated edge cases.
- If the fix requires changes to multiple files, ensure they are all part of the same logical change.

Common fix patterns by category:

- **bug**: Fix the logic error, off-by-one, null check, race condition, or incorrect API call.
- **ui-polish**: Fix CSS, spacing, alignment, colors, or layout. Match existing design patterns.
- **ux**: Adjust interaction behavior, add loading state, fix focus management, improve feedback.
- **performance**: Optimize the specific bottleneck. Prefer memoization, lazy loading, or query optimization over architectural changes.
- **accessibility**: Add aria attributes, fix tab order, add labels, improve contrast.
- **content**: Fix copy, add missing text, correct translations.
- **data**: Fix data fetching, transformation, or display logic.
- **inconsistency**: Align the outlier with the established pattern.

### 7. Update or add tests

If the project has tests relevant to the fix:

- Update existing tests that now need to reflect the fix.
- Add a focused test for the specific bug if the fix is non-trivial and testable.
- Do not add tests for trivial fixes (typo corrections, simple CSS changes).
- Run the relevant test suite to confirm the fix doesn't break anything.

### 8. Inspect the diff

```bash
git status --short
git diff --stat
git diff --name-status
git diff
```

Confirm:

- Changed files are relevant to the issue.
- No unrelated changes snuck in.
- No secrets or local artifacts were introduced.
- The change is minimal and focused.

### 9. Verify the fix

Run relevant verification commands based on the project:

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

Use the project's actual test/lint commands from package.json, Makefile, or CI config. Use timeouts for expensive commands.

If tests fail:

- Fix failures caused by the change.
- Note pre-existing failures that are unrelated.
- Do not broaden the fix scope to address unrelated test failures.

### 10. Commit

Stage only the intended files:

```bash
git add <changed-files>
```

Inspect staged changes:

```bash
git diff --cached --stat
git diff --cached
```

Use a conventional commit message:

```text
fix(<scope>): <concise description>

<issue description and what was changed>

Bug-bash-item: <issue_id>
```

The scope should reflect the area of the app (e.g., `settings`, `dashboard`, `auth`, `ui`).

```bash
git commit -m "fix(<scope>): <title>" -m "<body with details>"
```

If there are no staged changes, report that the issue may already be fixed or that no safe change was found.

### 11. Push and create or update the PR

```bash
git push -u origin <branch_name>
```

Search for existing PR:

```bash
gh pr list --state open --head <branch_name> --json number,title,url,body
```

If the PR exists, update if needed. If not, create it:

```bash
gh pr create --draft --title "<pr_title>" --body "<pr_body>" --base <base_branch> --head <branch_name>
```

PR body structure:

```markdown
<!-- bug-bash: issue_id=<issue_id> -->

## Summary

<One-sentence description of what was fixed and why.>

## Issue details

- **Category**: <category>
- **Severity**: <severity>
- **Location**: <where in the app>

## Changes

- <file>: <what changed and why>

## Verification

- [x] <test or lint command>
- [x] Manual review of diff

## Original observation

> <raw observation from the user, quoted>
```

Verify the PR:

```bash
gh pr view <number-or-url> --json number,title,body,url,headRefName,baseRefName,state
```

### 12. Update the progress tracker

If `docs/tmp/bug-bash.md` exists, update the issue's section:

- Set `Status: pr-opened` when a PR was created or updated.
- Set `Status: done` when the fix is verified and no PR is needed (e.g., already fixed).
- Set `Status: blocked` when the fix cannot proceed.
- Set `Status: needs-clarification` when the issue description is insufficient.
- Set `PR: <url>` when a PR exists.
- Append progress notes for investigation findings, files changed, verification results, commit hash, and PR URL.
- Update `## Status summary` counts.
- Preserve all other issue sections unchanged.

Do not commit the tracker file by default. Commit it only if the user explicitly wants it included.

### 13. Final response

Report:

- Issue ID and title.
- Tracker path and final status, if used.
- Branch name.
- Root cause (brief).
- What was changed and why.
- Commit hash, if created.
- PR URL, if created.
- Files changed.
- Verification results.
- Any residual risk or follow-up needed.
- The next `issue_id` in the queue, if any.
- Whether the tracker file was left uncommitted.

## Handling common situations

### Issue is already fixed

Verify via code inspection or tests. Update tracker to `Status: done` with evidence. Do not create an empty PR.

### Issue cannot be reproduced from code alone

Apply the best-effort fix based on the description. Note uncertainty in the PR body and tracker. Flag for manual QA.

### Issue requires clarification

Update tracker to `Status: needs-clarification` with a specific question about what's ambiguous. Do not guess.

### Fix would require a large refactor

If the effort is clearly larger than what was estimated in the plan, update the tracker with findings, set `Status: blocked`, and explain what's needed. The user can decide whether to proceed or reprioritize.

### Multiple issues share a root cause

Fix only the current issue. Note the shared root cause in the progress notes. The user or planner can consolidate the related items later.

### Fix breaks existing tests

Determine if the test expectation was wrong (update the test) or if the fix introduced a regression (revise the fix). Do not disable tests to make CI pass.
