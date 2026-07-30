---
name: prepare-pr
description: "Inspect a local Git branch and prepare it only as far as the user requests: summarize changes, create a feature branch, stage and commit related work, push, or open a GitHub pull request. Use when asked to prepare, publish, or open a PR. Supports read-only preview, commit, publish, and open-PR modes and never advances to a later effect without explicit user intent."
---

# Prepare PR

## Overview

Prepare a local Git branch for review while stopping at the effect boundary the user requested.

## Modes and stopping point

Infer the narrowest mode that satisfies the request. If the request is ambiguous,
complete the read-only work and present the proposed next action instead of
silently advancing.

| Mode | Permitted effects | Stop after |
| --- | --- | --- |
| Preview | Read repository and GitHub state | Summary, proposed commit, and PR draft |
| Commit | Preview plus branch creation, staging, and local commit | Verified local commit |
| Publish | Commit plus ordinary push | Verified remote branch |
| Open PR | Publish plus create or update a GitHub PR | Verified PR URL |

A request to "review the branch" means Preview. A request to "commit" does not
authorize pushing. A request to "push" does not authorize opening a PR. An
explicit request to "prepare/open/create the PR" authorizes the full Open PR
sequence, subject to repository permissions.

## Safety rules

- Never run destructive commands such as `git reset --hard`, `git clean`, `git checkout -- .`, `git restore`, force-push, rebasing, or amending unless the user explicitly asks for that exact operation.
- Do not commit secrets, credentials, generated build artifacts, dependency folders, editor files, or local environment files. Flag suspicious files before staging or committing.
- Do not push with `--force` or `--force-with-lease` unless explicitly requested.
- Before committing, inspect the staged patch and report the intended files and
  message. Do not add an extra confirmation when the user already explicitly
  requested the commit and the scope is unambiguous.
- If there are unrelated changes mixed into the working tree, call them out and ask which changes to include rather than guessing.
- Preserve the selected mode. Never treat successful completion of one stage as
  authorization for the next.

## Workflow

### 1. Ensure the work is on a feature branch

Before doing anything else, check which branch is currently active:

```bash
git branch --show-current
```

If the current branch is a protected base branch — `main`, `master`, `develop`, or any branch the user identifies as a trunk — do not proceed with committing or pushing on that branch. Instead:

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

   Keep the description concise (2–5 words, hyphen-separated). Good examples: `feat/user-refresh-tokens`, `fix/empty-search-response`, `chore/update-ci-node-version`.

3. Use a user-provided name when available. Otherwise propose one; create it
   directly only when the selected mode authorizes branch creation and the name
   is an unambiguous fit.

4. When the selected mode authorizes it, create and switch to the new branch.
   Uncommitted changes travel with the switch:

```bash
git switch -c <branch-name>
```

   `git switch -c` preserves uncommitted working-tree and staged changes on the
   new branch, so no stashing is needed.

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

If there is no upstream branch, compare against the likely base branch. Try `origin/main`, then `origin/master`, then ask or infer from the repository conventions:

```bash
git diff --name-status origin/main...HEAD
git diff --stat origin/main...HEAD
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

For larger branches, group changes by intent:

- Feature behavior or user-facing functionality
- API or schema changes
- Tests and fixtures
- Refactors or cleanup
- Documentation and configuration
- Dependency or lockfile updates

When summarizing, mention both committed branch changes and uncommitted working-tree changes. Keep separate what is already committed from what is about to be committed.

### 4. Decide what to stage

If the user asks to prepare the branch and uncommitted changes are clearly related, stage the relevant files:

```bash
git add <paths>
```

Avoid blind `git add .` when the working tree includes unfamiliar, generated, ignored-looking, secret-like, or unrelated files. Use `git status --short` after staging.

If all modified and new files are clearly part of one coherent change and there are no suspicious files, `git add -A` is acceptable.

### 5. Write the commit message

Prefer this format:

```text
<type>(<scope>): <imperative summary>

<short body explaining why and what changed>
```

Use a conventional commit type when it fits:

- `feat`: new capability or user-visible behavior
- `fix`: bug fix
- `refactor`: internal restructuring without behavior change
- `test`: tests only
- `docs`: documentation only
- `chore`: maintenance, tooling, or configuration
- `perf`: performance improvement
- `build` or `ci`: build system or continuous integration changes

Choose a scope from the touched component, package, service, or feature area. Omit the scope if it would be vague.

Good examples:

```text
feat(auth): support refresh token rotation

Add token rotation during session renewal and cover expired-token handling with regression tests.
```

```text
fix(api): handle empty search responses

Return an empty result set instead of raising when the upstream provider responds without matches.
```

```text
refactor(connectors): simplify postgres sync setup

Move shared setup into a helper so connector tests can reuse the same initialization path.
```

Avoid generic messages such as `update code`, `fix stuff`, `changes`, or `wip` unless the user explicitly requests them.

### 6. Commit safely

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

If no changes are staged, do not run `git commit`. Explain that there is nothing staged to commit.

### 7. Push the branch (Publish and Open PR modes only)

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

### 8. Create or update the pull request (Open PR mode only)

Do not infer permission to create a PR merely because the push succeeded. In
Open PR mode, check whether the branch already has a PR before creating one:

```bash
gh --version
gh pr view --json number,title,url,state 2>/dev/null
```

If `gh` is not installed or not authenticated, stop and instruct the user to install it (`brew install gh` on macOS, or visit https://cli.github.com/) and run `gh auth login`.

Use `references/pr_output_templates.md` for the canonical PR body and final
status formats. Populate it with facts from the diff and actual validation
results; remove irrelevant placeholders.

If no PR exists, create one:

```bash
gh pr create \
  --title "<PR title>" \
  --body "<populated PR description>" \
  --base <base-branch> \
  --head <current-branch> \
  --draft
```

Default to a draft unless the user or repository convention clearly requests a
ready-for-review PR.

Optional flags to include when relevant:

- `--reviewer <handle>` — request specific reviewers if the user mentions them
- `--assignee @me` — self-assign the PR
- `--label <label>` — apply a label if one clearly matches (e.g. `bug`, `enhancement`)

After the PR is created, `gh` will return a URL. Share that URL with the user.

### 9. Final response

After preparing the PR, report:

- Current branch name
- Commit hash and commit message, if a commit was created
- Push destination, if pushed
- PR URL, if a PR was created or updated
- Short summary of changes
- Anything not included, skipped, or needing user attention

## Handling common situations

### Already committed branch with no uncommitted changes

Summarize the diff against the base branch, propose a PR title and description, and push if requested.

### Uncommitted changes only

Summarize the working-tree diff, stage intended files, propose a commit message, then commit and push when requested.

### Mixed committed and uncommitted changes

Explain both sets separately. Commit only the uncommitted changes that belong to the PR.

### Multiple unrelated changes

Group files by likely intent and ask which group to commit. Do not create one broad commit unless the user explicitly approves.

### Merge conflicts or failing Git commands

Stop and report the exact problem. Do not attempt risky repair commands. Suggest the safest next command, such as inspecting conflicted files or fetching the base branch.

### Tests

Before committing or creating the PR, look for validation commands in the
repository instructions and build metadata. Run proportionate targeted checks
when they are safe and within the requested workflow; do not invent expensive
or destructive commands.

Use the results to populate the **Validation** section of the PR body:

- If automated tests were run and passed, list the command used and note that they passed.
- If automated tests were run and failed, flag it to the user before pushing and do not proceed until the issue is addressed or the user explicitly overrides.
- If no automated tests exist, describe the manual verification steps taken (e.g. "Ran the app locally and confirmed the login flow works end-to-end").
- If tests were not run at all (e.g. the user skipped this step), state that clearly in both the PR body and the final response.

Always fill in **Validation** with concrete evidence. If a check was not run,
state that fact and why; do not turn suggested reviewer steps into claimed
results.
