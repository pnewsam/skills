---
name: revise-pr
description: revise an existing pull request to ensure the title, description, type of change, and checklist accurately reflect the latest code changes. use when asked to update a pr, sync a pr description, review whether a pr body is accurate, or refresh pr metadata after new commits have been pushed.
---

# Revise PR

## Overview

Audit an open pull request by comparing its current title and description against the actual code changes on the branch, then update the PR metadata so everything is accurate and complete.

This skill is read-first: always fetch the live PR state and the real diff before proposing any edits. Never guess at what the description says or what the code does — derive both from ground truth.

## Safety rules

- Never modify source code, commit history, or branch state. This skill only edits PR metadata via `gh pr edit`.
- Do not overwrite checklist items that the author has already ticked. Preserve their checked state unless the underlying code evidence clearly contradicts it.
- Do not change the base branch, assignees, labels, or reviewers unless the user explicitly asks.
- Always show the proposed new title and body to the user and get confirmation before applying the edit, unless the user has explicitly asked for a fully automatic update.
- If the PR is already merged or closed, stop and inform the user. Do not edit closed PRs.

## Workflow

### 1. Verify the GitHub CLI is available

```bash
gh --version
```

If `gh` is not installed or not authenticated, stop and instruct the user to install it (`brew install gh` on macOS, or visit https://cli.github.com/) and run `gh auth login`. Do not proceed until this is resolved.

### 2. Identify the target PR

If the user names a specific PR number, use that. Otherwise, detect the PR associated with the current branch:

```bash
gh pr view --json number,title,body,baseRefName,headRefName,state,url
```

If this returns no PR, list open PRs for the repo so the user can pick one:

```bash
gh pr list --state open
```

If the PR state is `MERGED` or `CLOSED`, stop and tell the user. Do not edit it.

Store the following for later comparison:
- `number` — PR number
- `title` — current title
- `body` — current description (the full markdown text)
- `baseRefName` — the target branch (e.g. `main`)
- `headRefName` — the feature branch
- `url` — PR URL

### 3. Inspect the actual changes on the branch

Fetch the latest remote state before diffing:

```bash
git fetch origin
```

Diff the feature branch against the base to see what is actually in the PR:

```bash
git diff --stat origin/<baseRefName>...origin/<headRefName>
git diff --name-status origin/<baseRefName>...origin/<headRefName>
```

For a narrative view of commits:

```bash
git log --oneline origin/<baseRefName>..origin/<headRefName>
```

For targeted file-level diffs when you need to understand intent:

```bash
git diff origin/<baseRefName>...origin/<headRefName> -- <path>
```

Group the changed files by intent as you read them:

- Feature behavior or user-facing functionality
- API or schema changes
- Tests and fixtures
- Refactors or cleanup
- Documentation and configuration
- Dependency or lockfile updates

Build a clear mental model of what the branch actually does before moving to the next step.

### 4. Audit the existing PR description

Compare the current PR body (from Step 2) against the real diff (from Step 3). For each section of the template, assess accuracy:

#### Description section
- Does it correctly describe what was changed and why?
- Are there significant changes in the diff that are not mentioned?
- Does it mention anything that is not present in the diff (e.g. a feature that was removed or never implemented)?
- If a `Fixes #<number>` line is present, is the issue number plausible given the changes?

#### Screenshots section
- If UI files (templates, CSS, component files) were modified, is the Screenshots section present?
- If no UI files were touched, the Screenshots section can be removed or left as a placeholder comment.

#### Type of change section
- Based on the diff, which type(s) of change accurately apply?
  - 🐛 Bug fix — patches a defect without changing external behavior
  - ⚡ New feature — adds new user-visible functionality
  - 🚨 Hotfix — urgent patch, typically targeting a release branch
  - 📢 Breaking change — alters existing public interfaces or behavior
  - 📄 Documentation update required — public-facing docs need updating
- Are the correct boxes checked? Are any wrong boxes checked?
- Note: preserve any boxes the author has already checked (`[x]`) unless the diff clearly contradicts the selection.

#### Checklist section
- Do not change items the author has already checked.
- If unchecked items are clearly satisfied by the diff (e.g. tests are present, no new warnings visible in changed files), you may note this to the user but do not auto-check them.

### 5. Identify discrepancies

Produce a plain-English gap analysis before drafting any edits. List:

- **Missing from description** — changes in the diff that the body does not mention
- **Stale or inaccurate** — claims in the body that are not supported by the diff
- **Wrong type of change** — checkboxes that do not match what the diff shows
- **Title mismatch** — if the title no longer reflects the scope of changes
- **No issues found** — explicitly state this if the description is already accurate

If no issues are found, tell the user and stop. Do not make edits for the sake of making edits.

### 6. Draft the revised PR body

Using the gap analysis from Step 5, write an updated version of the full PR body. Follow the template below. Keep all content that is already accurate. Only change what needs to change.

Fill in every section from the diff analysis. Remove placeholder lines that do not apply:
- Remove `Fixes #issue_number` if no linked issue is known
- Remove the Screenshots section body if there are no UI changes (keep the heading as a placeholder comment if the PR author included it)
- Delete type-of-change checkboxes that clearly do not apply

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

Also draft a revised title if the current title is inaccurate or too vague.

### 7. Present the proposed changes for confirmation

Show the user a clear diff of what will change:

- **Current title** vs **Proposed title** (omit if the title is unchanged)
- **Gap analysis summary** — bullet list of what was wrong or missing
- **Full proposed PR body** — the complete revised markdown

Ask the user to confirm before applying. If they ask for adjustments, incorporate their feedback and re-present before applying.

Skip confirmation only if the user has explicitly requested a fully automatic update (e.g. "just update it").

### 8. Apply the updates with the GitHub CLI

Once confirmed, apply the edit:

```bash
gh pr edit <number> \
  --title "<revised title>" \
  --body "<revised body>"
```

Omit `--title` if the title is unchanged.

After editing, verify the live PR reflects the update:

```bash
gh pr view <number> --json title,body,url
```

### 9. Final response

Report:

- PR number and URL
- What was changed (title, which sections of the body were updated)
- A one-line summary of what the PR now accurately describes
- Anything left for the author to address (e.g. Screenshots still needed, checklist items to tick)

## Handling common situations

### PR description is already accurate

State clearly that the description matches the diff and no edits are needed. Do not fabricate changes.

### New commits have been pushed since the PR was opened

This is the most common case. The diff will include work not reflected in the original description. Treat all unmentioned changes as missing from the description and add them.

### PR has no description at all

Treat the body as empty. Write a full description from scratch using the diff and the template. Follow the same confirmation flow before applying.

### PR title is a placeholder (e.g. "WIP", "fix stuff", branch name)

Flag this explicitly and propose a properly formatted title derived from the diff. Use conventional commit style: `<type>(<scope>): <imperative summary>`.

### Multiple unrelated concerns in one PR

Note this to the user. Write the description to cover all of them clearly. Do not silently omit changes.

### The diff is very large

Prioritize summarizing by component or layer rather than listing every file. Focus the description on user-visible and API-level impact, and mention test and config changes briefly.

### `gh pr edit` fails

Report the exact error. Common causes: authentication expired (`gh auth login`), wrong remote, or the PR is locked. Do not retry destructively.
