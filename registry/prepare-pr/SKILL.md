---
name: prepare-pr
description: "Inspect a local Git branch and prepare it only as far as the user requests: summarize changes, create a feature branch, stage and commit related work, push, or open a GitHub pull request through an available authenticated GitHub integration or gh. Use when asked to prepare, publish, or open a PR. Supports read-only preview, commit, publish, and open-PR modes and never advances to a later effect without explicit user intent."
---

# Prepare PR

## Overview

Prepare a local Git branch for review while stopping at the effect boundary the user requested.

Apply the shared kernel when the work reaches GitHub: `pr-conventions/references/pr-standard.md` for the PR title, body, and commit-message conventions, and `pr-conventions/references/github-mechanics.md` for authenticated access and the write-once-then-verify discipline.

## Modes and stopping point

Infer the narrowest mode that satisfies the request.
If the request is ambiguous, complete the read-only work and present the proposed next action instead of silently advancing.

| Mode | Permitted effects | Stop after |
| --- | --- | --- |
| Preview | Read repository and GitHub state | Summary, proposed commit, and PR draft |
| Commit | Preview plus branch creation, staging, and local commit | Verified local commit |
| Publish | Commit plus ordinary push | Verified remote branch |
| Open PR | Publish plus create or update a GitHub PR | Verified PR URL |

A request to "review the branch" means Preview.
A request to "commit" does not authorize pushing.
A request to "push" does not authorize opening a PR.
Only an explicit request to "open" or "create" a PR authorizes the full Open PR sequence.
Treat "prepare this for a PR" without an explicit effect as ambiguous: complete Preview and propose the next action.

## Safety rules

- Never run destructive commands such as `git reset --hard`, `git clean`, `git checkout -- .`, `git restore`, force-push, rebasing, or amending unless the user explicitly asks for that exact operation.
- Do not commit secrets, credentials, generated build artifacts, dependency folders, editor files, or local environment files. Flag suspicious files before staging or committing.
- Do not push with `--force` or `--force-with-lease` unless explicitly requested.
- Before committing, inspect the staged patch and report the intended files and message. Do not add an extra confirmation when the user already explicitly requested the commit and the scope is unambiguous.
- If there are unrelated changes mixed into the working tree, call them out and ask which changes to include rather than guessing.
- Preserve the selected mode. Never treat successful completion of one stage as authorization for the next.

## Workflow

### 1. Ensure the work is on a feature branch

Before doing anything else, check which branch is currently active:

```bash
git branch --show-current
```

If the current branch is a protected base branch — `main`, `master`, `develop`, or any branch the user identifies as a trunk — do not proceed with committing or pushing on that branch.
Instead:

1. Inspect whether there are any uncommitted changes that should travel to the new branch:

```bash
git status --short
git diff --stat
git diff --cached --stat
```

2. Propose a branch name derived from the staged/unstaged changes or any context the user has provided. Use kebab-case and the following naming conventions:

   - `feat/<short-description>` — new functionality
   - `fix/<short-description>` — bug or defect fix
   - `hotfix/<short-description>` — urgent production fix
   - `chore/<short-description>` — maintenance, tooling, config
   - `docs/<short-description>` — documentation only
   - `refactor/<short-description>` — internal restructuring

Keep the description concise (2–5 words, hyphen-separated).
Good examples: `feat/user-refresh-tokens`, `fix/empty-search-response`, `chore/update-ci-node-version`.

3. Use a user-provided name when available. Otherwise propose one; create it directly only when the selected mode authorizes branch creation and the name is an unambiguous fit.

4. When the selected mode authorizes it, create and switch to the new branch. Uncommitted changes travel with the switch:

```bash
git switch -c <branch-name>
```

`git switch -c` preserves uncommitted working-tree and staged changes on the new branch, so no stashing is needed.

5. Confirm the switch succeeded:

```bash
git branch --show-current
```

If the current branch is already a feature branch (i.e. not a protected base branch), skip this step entirely and proceed to Step 2.

### 2. Inspect branch and repository state

Run these read-only commands first:

```bash
git status --short --branch
git branch --show-current
git remote -v
git log --oneline --decorate -n 10
```

If an upstream branch exists, identify the merge base and changed files:

```bash
git rev-parse --abbrev-ref --symbolic-full-name @{u}
git diff --name-status @{u}...HEAD
git diff --stat @{u}...HEAD
```

If there is no upstream branch, identify the remote default and common local base branches instead of assuming `main`:

```bash
git symbolic-ref --quiet --short refs/remotes/origin/HEAD
git branch --list main master develop
git diff --name-status <base-ref>...HEAD
git diff --stat <base-ref>...HEAD
```

Also inspect uncommitted changes:

```bash
git diff --name-status
git diff --stat
git diff --cached --name-status
git diff --cached --stat
```

### 3. Understand the changes

Use targeted diffs rather than dumping everything at once:

```bash
git diff -- <path>
git diff --cached -- <path>
git show --stat --oneline HEAD
```

For larger branches, group changes by intent (see the "Group changes by intent" list in `pr-conventions/references/pr-standard.md`).

When summarizing, mention both committed branch changes and uncommitted working-tree changes.
Keep separate what is already committed from what is about to be committed.

### 4. Validate the candidate change

In Preview mode, inspect existing validation evidence but do not run commands that may create caches, reports, or other files unless the user asks.

In Commit, Publish, and Open PR modes, find the repository's actual validation commands in its instructions, build metadata, or CI configuration.
Run the smallest safe checks that cover the candidate change before staging:

- focused tests for the affected behavior
- lint or type checks when configured and relevant
- a broader regression check only when the blast radius warrants it

Do not install dependencies or invent a command.
If no applicable check exists or the environment cannot run it, continue only with an explicit `not run` result and reason.

If a relevant check fails, stop before committing.
A local commit may proceed only when the user explicitly asks to preserve the failing state.
Never publish or open a PR with a known failure unless the user explicitly overrides the failure after seeing it.

Treat an obvious mismatch between changed behavior, existing tests, and a governing feature plan as a failed preflight even if no test command was run.

### 5. Decide what to stage

If the user asks to prepare the branch and uncommitted changes are clearly related, stage the relevant files:

```bash
git add <paths>
```

Avoid blind `git add .` when the working tree includes unfamiliar, generated, ignored-looking, secret-like, or unrelated files.
Use `git status --short` after staging.

If all modified and new files are clearly part of one coherent change and there are no suspicious files, `git add -A` is acceptable.

### 6. Write the commit message

Use the conventional-commit format from `pr-conventions/references/pr-standard.md` (`<type>(<scope>): <imperative summary>` with a short body).
Example:

```text
feat(auth): support refresh token rotation

Add token rotation during session renewal and cover expired-token handling with regression tests.
```

### 7. Commit safely

After staging, verify staged content:

```bash
git diff --cached --stat
git diff --cached --name-status
```

Then commit:

```bash
git commit -m "<subject>" -m "<body>"
```

After committing, verify:

```bash
git status --short --branch
git log --oneline --decorate -n 5
```

If no changes are staged, do not run `git commit`.
Explain that there is nothing staged to commit.

### 8. Push the branch (Publish and Open PR modes only)

Stop before this step in Preview or Commit mode.

If the current branch has an upstream:

```bash
git push
```

If it has no upstream:

```bash
git push -u origin <current-branch>
```

Do not push directly to `main`, `master`, or protected release branches unless the user explicitly confirms that is intended.

### 9. Create or update the pull request (Open PR mode only)

Do not infer permission to create a PR merely because the push succeeded.
Select an authenticated access path per `pr-conventions/references/github-mechanics.md`.
Resolve the repository, current head branch, and evidence-backed base branch, and search for an existing PR from that head before creating a new one.

Compose the PR body from `pr-conventions/references/pr-standard.md` — defer to the repository's PR template when present — and populate it with facts from the diff and actual validation results.
Use `references/pr_output_templates.md` for the final-status format.

If no PR exists, create it with the selected access path.
For the connector, provide the repository, title, populated body, base branch, head branch, and draft state explicitly.
The `gh` fallback is:

```bash
gh pr create \
  --title "<PR title>" \
  --body "<populated PR description>" \
  --base <base-branch> \
  --head <current-branch> \
  --draft
```

Default to a draft unless the user or repository convention clearly requests a ready-for-review PR.

Optional flags to include when relevant:

- `--reviewer <handle>` — request specific reviewers if the user mentions them
- `--assignee @me` — self-assign the PR
- `--label <label>` — apply a label if one clearly matches (e.g. `bug`, `enhancement`)

After creation, verify the live PR per the kernel's write-once-then-verify rule: fetch it through the same access path and confirm its number, URL, title, base, head, and draft state before claiming completion.

### 10. Final response

After preparing the PR, report:

- Current branch name
- Commit hash and commit message, if a commit was created
- Push destination, if pushed
- PR URL, if a PR was created or updated
- Short summary of changes
- Validation commands and results, including anything not run
- Anything not included, skipped, or needing user attention

## Handling common situations

- **Already committed, nothing uncommitted:** summarize the diff against the base branch, propose a PR title and description, push if requested.
- **Uncommitted changes only:** summarize the working-tree diff, stage intended files, propose a commit message, then commit and push when requested.
- **Mixed committed and uncommitted:** explain both sets separately; commit only the uncommitted changes that belong to the PR.
- **Multiple unrelated changes:** group files by likely intent and ask which group to commit. Do not create one broad commit unless the user explicitly approves.
- **Merge conflicts or failing Git commands:** stop and report the exact problem. Do not attempt risky repair commands; suggest the safest next command (e.g. inspecting conflicted files or fetching the base branch).
