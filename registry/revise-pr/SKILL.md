---
name: revise-pr
description: Audit an existing pull request through an available authenticated GitHub integration or gh against its current diff and, when explicitly requested, update its title or body so the metadata accurately reflects the branch. Use when asked to check, revise, sync, or refresh PR metadata after code changes. Defaults to a read-only audit; editing is a separate external-write mode. Use polish-pr instead for language-only clarity and tone improvements.
---

# Revise PR

## Overview

Audit an open pull request by comparing its current title and description against
the actual code changes on the branch.

Use `polish-pr` when the existing metadata is substantively accurate and only
its clarity, concision, tone, or human readability needs improvement.

- **Audit mode:** Report discrepancies and draft a replacement. This is the
  default for "review" or "check" requests.
- **Apply mode:** Audit, edit PR metadata, and verify the live result. Use only
  when the user asks to update, revise, sync, refresh, or apply.

Always fetch the live PR state and real diff before proposing edits.

## Safety rules

- Never modify source code, commit history, or branch state. This skill only
  edits PR title or body through the selected GitHub access path.
- Preserve author-written sections and repository-template fields that remain
  accurate. Do not toggle checklist items based only on inference.
- Do not change the base branch, assignees, labels, or reviewers unless the user explicitly asks.
- Do not add a redundant confirmation when the user has already explicitly
  requested Apply mode and the proposed changes stay within that scope.
- If the PR is already merged or closed, stop and inform the user. Do not edit closed PRs.

## Workflow

### 1. Select an authenticated GitHub access path

Prefer an available GitHub connector or app. Otherwise use authenticated `gh`:

```bash
gh --version
gh auth status
```

Do not require both. If neither path is authenticated, stop and explain how to
connect the integration or authenticate `gh`.

### 2. Identify the target PR

If the user names a specific PR number, use that. Otherwise, detect the PR associated with the current branch:

With a connector, resolve the repository, search open PRs for the current head,
and fetch the selected PR metadata. With `gh`, use:

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

Read the live PR evidence without changing local branches or remote-tracking
refs. With a connector, fetch the PR, list exact changed filenames, and retrieve
their patches in bounded groups. With `gh`, use:

```bash
gh pr view <number> --json files,commits
gh pr diff <number>
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

Compare the current PR body against the diff and the repository's own PR
template, if present. Check:

- **Summary and motivation:** Does the body describe the actual outcome, why it
  exists, and any linked issue without unsupported claims?
- **Change inventory:** Are material API, schema, dependency, migration,
  configuration, documentation, and compatibility changes represented?
- **Validation evidence:** Are commands and results factual and current? Never
  infer that a test passed because a test file exists.
- **Risk and rollout:** Are breaking behavior, data risk, feature flags,
  migrations, rollout, and rollback needs stated when relevant?
- **Visual evidence:** For user-visible UI changes, is useful before/after
  evidence present or explicitly left for the author?
- **Repository fields:** Preserve accurate custom sections and checklist state;
  do not replace a repository template with the fallback template.

### 5. Identify discrepancies

Produce a plain-English gap analysis before drafting any edits. List:

- **Missing from description** — changes in the diff that the body does not mention
- **Stale or inaccurate** — claims in the body that are not supported by the diff
- **Missing validation evidence** — commands, results, or manual checks are
  absent, placeholder-only, or inconsistent with the diff
- **Missing risk or rollout context** — material operational consequences are
  not disclosed
- **Title mismatch** — if the title no longer reflects the scope of changes
- **No issues found** — explicitly state this if the description is already accurate

If no issues are found, tell the user and stop. Do not make edits for the sake of making edits.

### 6. Draft the revised PR body

Using the gap analysis from Step 5, write an updated version of the full PR
body. Use `references/pr_output_templates.md` for the canonical audit, preview,
body, and final-status formats. Keep accurate content and change only what the
diff supports.

Also draft a revised title if the current title is inaccurate or too vague.

### 7. Present the proposed changes

Show the user a clear diff of what will change:

- **Current title** vs **Proposed title** (omit if the title is unchanged)
- **Gap analysis summary** — bullet list of what was wrong or missing
- **Full proposed PR body** — the complete revised markdown

In Audit mode, stop here. In Apply mode, proceed unless the audit exposed an
ambiguity that would materially change the PR's stated scope.

### 8. Apply the updates (Apply mode only)

With a connector, call its update-pull-request action once with the repository,
PR number, and only the revised title/body fields. Otherwise use:

```bash
gh pr edit <number> \
  --title "<revised title>" \
  --body "<revised body>"
```

Omit `--title` if the title is unchanged.

After editing, verify the live PR reflects the update through the connector's
PR-info action or:

```bash
gh pr view <number> --json title,body,url
```

If the selected access path rejects the write because direct user authorization
is missing, do not retry through another path. Report the rejection and preserve
the exact proposed title/body for the original user-authorized context.

### 9. Final response

Report:

- PR number and URL
- What was changed (title, which sections of the body were updated)
- A one-line summary of what the PR now accurately describes
- Anything left for the author to address, such as screenshots or unavailable
  validation evidence

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

### The PR metadata update fails

Report the exact error. Common causes include expired authentication, wrong
repository, insufficient permissions, or a locked PR. Do not retry
destructively.
