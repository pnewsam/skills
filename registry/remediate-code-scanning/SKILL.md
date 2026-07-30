---
name: remediate-code-scanning
description: implement one planned code scanning remediation feature or user-supplied CodeQL/SAST alert group, apply the smallest safe source fix, verify it, commit, push, and create or update a pull request. use after plan-security-remediation or plan-feature. for dependency vulnerabilities, use remediate-vulnerability instead.
---

# Remediate Code Scanning

## Overview

Implement one coherent code scanning remediation unit. Prefer a `docs/features/NNN-*.md` feature produced from a code-scanning remediation epic. If the user supplies an alert group directly, consume that group in conversation.

Do not read or update separate remediation trackers outside the feature plan.

## Idempotency Requirements

Use stable identifiers:

- `group_id`: from the feature plan or derived from rule IDs and affected files.
- `branch_name`: usually `security/<group_id>`.
- PR marker:

```text
<!-- code-scanning-remediation: group_id=<group_id>; alerts=<comma-separated numbers>; rules=<comma-separated rule IDs> -->
```

Before changing code, search for open PRs, local branches, and remote branches that already match the group.

## Inputs

Prefer a feature plan with:

- alert numbers and URLs
- rule IDs
- affected files and line ranges
- remediation strategy
- expected code changes
- verification commands
- risk notes

If no plan exists and there are multiple unrelated alerts, ask the user to run
`plan-security-remediation` in Code-scanning mode and `plan-feature` first.

## Safety Rules

- Keep one remediation group to one branch and one PR.
- Read the full function/handler around flagged lines before changing code.
- Prefer the smallest fix that eliminates the vulnerability.
- Do not refactor surrounding code or add unrelated hardening.
- Do not expose secrets in commits or PR text.
- Do not overwrite unrelated working-tree changes.

## Workflow

### 1. Load The Feature Or Alert Group

Read the selected `docs/features/` file or supplied group. Pick one unchecked remediation criterion/task. If the feature is complete, report that no remediation remains.

### 2. Check Existing Work

```bash
git status --short --branch
git branch --show-current
git remote -v
gh pr list --state open --limit 100 --json number,title,headRefName,body,url
```

If an existing PR already fixes the alerts, update the feature plan with the PR URL and stop.

### 3. Apply The Fix

Use the rule documentation and current code to choose the fix. Common patterns:

- Path injection: resolve paths and enforce an allowed base directory.
- Stack trace exposure: log detailed errors server-side and return generic client errors.
- DOM XSS: avoid unsafe HTML insertion or sanitize with an approved library.
- ReDoS: simplify vulnerable regexes or add input length limits.
- URL substring validation: parse URLs and compare hostnames exactly.
- Workflow permissions: add least-privilege GitHub Actions `permissions` blocks.

If a finding is a false positive, document evidence and use the repository's approved suppression mechanism only when appropriate.

### 4. Verify

Run the feature plan's verification commands when available. Otherwise run targeted tests, type checks, linting, and note that scanner closure may require a CodeQL/SAST re-run after push.

### 5. Commit And PR

Stage only intended files. Use a conventional commit such as:

```text
fix(security): remediate <rule/group>
```

Create or update the PR with the marker, affected alerts, verification, and risk notes.

### 6. Update Planning Docs

After verification/PR creation:

- Mark the completed feature criterion/task.
- Add PR URL, branch, files changed, and verification result.
- Leave parent epic status to `advance-epic` or `ship-epic` unless the user asks you to update it.

## Final Response

Report:

- Group remediated.
- Files changed.
- PR URL or blocker.
- Verification run and result.
- Feature plan updated.
