---
name: stash-work
description: stash in-progress work onto a local wip branch with a descriptive commit and context file. use when you want to preserve uncommitted changes without pushing to origin, shelve work-in-progress for later, save current state before switching tasks, or review previously stashed wip branches. pairs with prepare-pr when you're ready to push.
---

# Stash Work

## Overview

Preserve in-progress work by moving it to a dedicated local branch with a clear commit message and a markdown context file that captures what was being worked on and why. The working tree is left clean on the original branch so you can switch tasks.

This is for work that is not ready to push — you want to save your place without creating a PR or touching origin. When you later return and decide to push, use `prepare-pr`.

## Safety rules

- Never run destructive commands such as `git reset --hard`, `git clean`, `git checkout -- .`, `git restore`, force-push, or rebasing.
- Never push to origin. This skill is strictly local.
- Do not delete or overwrite existing branches. If a `wip/` branch with the proposed name already exists, append a numeric suffix (e.g. `wip/auth-refactor-2`).
- Do not commit secrets, credentials, build artifacts, dependency folders, editor files, or local environment files. Flag suspicious files before staging.
- If there are no uncommitted changes and no staged changes, do not create a branch or commit. Instead, list existing `wip/` branches as a convenience.

## Workflow

### 1. Inspect current state

```bash
git status --short --branch
git branch --show-current
git diff --stat
git diff --cached --stat
```

If there are no uncommitted or staged changes, skip to **Step 7** (list existing wip branches).

### 2. Understand the changes

Review what has been modified to inform the branch name, commit message, and context file:

```bash
git diff --name-status
git diff --cached --name-status
```

For files where intent is unclear, read targeted diffs:

```bash
git diff -- <path>
git diff --cached -- <path>
```

Group changes by intent:

- Feature behavior or user-facing functionality
- Bug fixes
- Refactors or cleanup
- Tests
- Documentation and configuration
- Dependency updates

### 3. Create the wip branch

Derive a branch name from the changes. Use the pattern:

```
wip/<short-description>
```

Keep the description concise (2–5 words, hyphen-separated). Examples:

- `wip/auth-token-rotation`
- `wip/search-results-pagination`
- `wip/migrate-to-prisma`
- `wip/fix-dashboard-layout`

Before creating, check that the name is not taken:

```bash
git branch --list "wip/<proposed-name>"
```

If it exists, append `-2`, `-3`, etc. until a free name is found.

Record the original branch name — you will return to it at the end.

Create and switch to the new branch. `git checkout -b` carries uncommitted changes automatically:

```bash
git checkout -b wip/<name>
```

### 4. Stage and commit

Stage all relevant changes. Avoid `git add .` if there are suspicious or unrelated files; otherwise it is acceptable:

```bash
git add -A
```

Verify what is staged:

```bash
git diff --cached --stat
git diff --cached --name-status
```

Write a commit message that captures the state of work. Use the format:

```text
wip(<scope>): <what was being worked on>

<current state — what works, what's partially done, what's left>
```

Examples:

```text
wip(auth): refresh token rotation

Working: token issuance and storage. Partially done: rotation logic in
session renewal endpoint. Remaining: expiry edge cases and regression tests.
```

```text
wip(search): paginated results with cursor-based navigation

Search API endpoint returns paginated results. Frontend integration started
but not wired up. No tests yet.
```

Commit:

```bash
git commit -m "<subject>" -m "<body>"
```

### 5. Write the context file

Create a markdown file at `docs/tmp/wip-<name>.md` that serves as a breadcrumb for your future self. Create the `docs/tmp/` directory if it does not exist.

```bash
mkdir -p docs/tmp
```

The file should contain:

```markdown
# WIP: <title>

**Branch:** `wip/<name>`
**Stashed from:** `<original-branch>`
**Date:** <YYYY-MM-DD>

## What was being worked on

<1–3 sentence summary of the goal or motivation>

## Current state

<What works, what's partially done, what's broken>

## Files changed

<List of modified/added/deleted files, grouped by intent>

## Next steps

<What you would do next if you picked this back up>

## Notes

<Any context that would be hard to reconstruct from the code alone — design decisions, rejected approaches, relevant links or conversations>
```

Commit the context file on the wip branch:

```bash
git add docs/tmp/wip-<name>.md
git commit -m "docs: add wip context for <name>"
```

### 6. Return to the original branch

Switch back to the branch you were on before:

```bash
git checkout <original-branch>
```

Verify the working tree is clean:

```bash
git status --short
```

### 7. List existing wip branches (if no changes to stash, or as a final step)

Show all wip branches with their latest commit:

```bash
git branch --list "wip/*" -v
```

If there are wip branches, also check for any context files:

```bash
ls docs/tmp/wip-*.md 2>/dev/null
```

### 8. Final response

Report:

- The wip branch name that was created
- Commit hash and summary
- Path to the context file
- The branch you are now on (the original branch)
- A reminder that the work is local-only and can be resumed with `git checkout wip/<name>`
- List of any other existing wip branches, if present

## Handling common situations

### No uncommitted changes

Do not create a branch or commit. Instead, list existing `wip/` branches so the user can browse their stashed work. If there are none, say so.

### Already on a wip branch

The user may have already manually created a wip branch. In this case, commit the current changes on the existing branch (do not create a new one), write/update the context file, and stay on the branch. Ask the user if they want to switch back to another branch.

### Untracked files mixed with modifications

Show the untracked files and ask whether to include them. Common cases: new source files (usually include), generated files or build artifacts (usually exclude), environment files (never include).

### Very large set of changes

If more than ~30 files are modified, group them by directory or intent in the context file rather than listing every file individually.

### The docs/tmp directory is gitignored

Check whether `docs/tmp/` is gitignored. If it is, the context file won't be committed — note this to the user and suggest either un-ignoring the specific file or placing the context file elsewhere (e.g. at the repo root as `.wip-context.md`).

### Resuming stashed work

If the user asks to resume or pick up a wip branch, check it out, read the context file, and summarize where things left off. This skill focuses on stashing, but providing a quick summary when resuming is a natural extension.
