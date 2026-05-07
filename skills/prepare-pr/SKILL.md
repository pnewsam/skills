---
name: prepare-pr
description: prepare a pull request from a local git branch. use when asked to review branch changes, summarize code changes, create a commit message, commit staged or unstaged work, push a branch, or get a branch ready for pr review. this skill guides safe git inspection, change summarization, conventional commit creation, and pushing without destructive operations.
---

# Prepare PR

## Overview

Prepare a local Git branch for a pull request by inspecting repository state, summarizing the code changes, creating a useful commit message, committing the intended changes, and pushing the branch safely.

This skill assumes the assistant is operating in a local repository through a terminal. Prefer safe, read-only Git commands until the user explicitly asks to commit or push.

## Safety rules

- Never run destructive commands such as `git reset --hard`, `git clean`, `git checkout -- .`, `git restore`, force-push, rebasing, or amending unless the user explicitly asks for that exact operation.
- Do not commit secrets, credentials, generated build artifacts, dependency folders, editor files, or local environment files. Flag suspicious files before staging or committing.
- Do not push with `--force` or `--force-with-lease` unless explicitly requested.
- Before committing, show the proposed commit message and the files that will be included unless the user has already explicitly requested a fully automatic commit.
- If there are unrelated changes mixed into the working tree, call them out and ask which changes to include rather than guessing.
- Preserve user intent: if the user says only to summarize, do not commit or push.

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

3. Show the proposed branch name to the user and ask for confirmation unless they have already provided one.

4. Once confirmed, create and switch to the new branch. If there are uncommitted changes, carry them across using:

```bash
git checkout -b <branch-name>
```

   `git checkout -b` preserves all uncommitted working-tree and staged changes on the new branch automatically, so no stashing is needed.

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

### 7. Push the branch

If the current branch has an upstream:

```bash
git push
```

If it has no upstream:

```bash
git push -u origin <current-branch>
```

Do not push directly to `main`, `master`, or protected release branches unless the user explicitly confirms that is intended.

### 8. Create the pull request with the GitHub CLI

Once the branch has been pushed, create the PR using the GitHub CLI. Before running, verify `gh` is available:

```bash
gh --version
```

If `gh` is not installed or not authenticated, stop and instruct the user to install it (`brew install gh` on macOS, or visit https://cli.github.com/) and run `gh auth login`.

Populate the template below with real content derived from the diff summary, then create the PR:

```bash
gh pr create \
  --title "<PR title>" \
  --body "<populated PR description>" \
  --base <base-branch> \
  --head <current-branch>
```

Optional flags to include when relevant:

- `--draft` — open as a draft PR when the work is not yet ready for review
- `--reviewer <handle>` — request specific reviewers if the user mentions them
- `--assignee @me` — self-assign the PR
- `--label <label>` — apply a label if one clearly matches (e.g. `bug`, `enhancement`)

Use this PR body template. Fill in every section from the diff analysis. Remove placeholder lines that do not apply (e.g. remove the `Fixes #issue_number` line if no issue number is known, remove screenshot instructions if there are no UI changes, and delete inapplicable type-of-change checkboxes):

```markdown
## Description

Please include a summary of the change and which issue is fixed. Please also include relevant motivation and context. List any dependencies that are required for this change.

Fixes #issue_number

## Screenshots

<!-- Include images of the feature/changes for context. -->

## Type of change

Please delete options that are not relevant.

- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ⚡ New feature (non-breaking change which adds functionality)
- [ ] 🚨 Hotfix (non-breaking change which fixes an issue)
- [ ] 📢 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📄 This change requires a documentation update

## Checklist:

- [ ] My code follows the style guidelines of this project
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have checked my code and corrected any misspellings
```

After the PR is created, `gh` will return a URL. Share that URL with the user.

### 9. Final response

After preparing the PR, report:

- Current branch name
- Commit hash and commit message, if a commit was created
- Push destination, if pushed
- PR URL returned by `gh pr create`
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

If the repository indicates a clear test command in README, package scripts, Makefile, pyproject, or similar, suggest running it before committing or before the final PR summary. Do not invent expensive test commands. If tests were not run, state that clearly in the final response.
