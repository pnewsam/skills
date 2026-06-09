---
name: plan-code-scanning-remediation
description: plan safe, idempotent remediation work for GitHub code scanning alerts (CodeQL, SAST) by creating or updating a standard docs/epics security remediation epic with child features. use when asked to triage CodeQL alerts, code scanning findings, SAST issues, or group code scanning vulnerabilities before changing code. for dependency vulnerabilities, use plan-vulnerability-remediation instead.
---

# Plan Code Scanning Remediation

## Overview

Plan remediation for code scanning alerts before making code changes. The durable artifact is a normal security remediation epic in `docs/epics/`, with child features for coherent remediation groups. Do not create a separate remediation tracker.

For dependency vulnerabilities, use `plan-vulnerability-remediation`.

## Goals

- Verify scanner findings against current source code.
- Detect existing PRs that already address alerts.
- Group alerts into focused, reviewable remediation features.
- Use stable group IDs, branch names, and PR markers for idempotency.
- Create or update a `docs/epics/NNN-code-scanning-remediation.md` epic.
- Avoid copying raw scanner logs or secrets into docs; summarize only the actionable facts.

## Inputs

Accept findings from:

- GitHub code scanning alerts via `gh api`.
- User-provided alert numbers, rule IDs, file paths, or alert URLs.
- Security tracking issues or pasted scanner summaries.

Normalize each alert when possible:

- alert number and URL
- rule ID and description
- severity
- tool
- affected file and line range
- message
- current status: ready, covered by existing PR, already fixed locally, needs input

## Safety Rules

- Do not change source code, workflows, branches, or config in this planning skill.
- Do not create separate security tracker files outside the epic/feature flow.
- Treat scanner output as advisory. Read flagged source before planning a fix.
- Do not group unrelated rules, languages, or ownership areas into one feature.
- Do not expose secrets, tokens, or raw CI logs in docs.

## Workflow

### 1. Establish Repository Context

```bash
git status --short --branch
git remote -v
git branch --show-current
```

Determine base branch, source languages, frameworks, and existing security/dependency automation.

### 2. Gather Alerts

If using GitHub:

```bash
gh --version
gh auth status
gh api "repos/{owner}/{repo}/code-scanning/alerts?state=open&per_page=100" --paginate
```

If the user supplied alerts directly, normalize those instead.

### 3. Verify Current Source State

For each alert:

1. Read the flagged file and surrounding function/handler.
2. Check whether the vulnerable pattern still exists.
3. Mark stale findings as `already-fixed-locally`.
4. Identify likely fix strategy for real findings.

### 4. Check Existing PRs

Search open PRs before proposing new work:

```bash
gh pr list --state open --limit 100 --json number,title,headRefName,baseRefName,body,labels,url,updatedAt
```

A PR may already cover an alert if it mentions the alert number/rule, uses the expected PR marker, modifies the affected file, or has a matching security branch. Inspect likely PRs before deciding.

### 5. Group Alerts Into Child Features

Group alerts when they share a cohesive fix:

- Same rule ID in one file or directory.
- Same rule family in one subsystem.
- Same workflow-permissions fix across GitHub Actions files.
- Same source/sink pattern and verification path.

Do not group unrelated languages, rule families, or behavior changes. One child feature should map to one focused PR.

For every group, define:

- `group_id`
- alert numbers and rule IDs
- affected files
- branch name, usually `security/<group_id>`
- PR title
- remediation strategy
- expected code changes
- verification commands
- risk notes
- PR marker:

```text
<!-- code-scanning-remediation: group_id=<group_id>; alerts=<comma-separated numbers>; rules=<comma-separated rule IDs> -->
```

### 6. Write Or Update The Epic

Create or update a normal epic in `docs/epics/`, such as `NNN-code-scanning-remediation.md`:

```bash
mkdir -p docs/epics
ls docs/epics/ | grep -E '^[0-9]+' | sort | tail -1
```

Use this structure:

```markdown
# Epic: Code Scanning Remediation

## Metadata

- **ID:** <NNN>
- **Status:** draft
- **Created:** <date>
- **Last updated:** <date>
- **Source:** GitHub code scanning / user-provided alerts

## Charter Alignment

- **Principle advanced:** <security, trust, reliability, or provisional>
- **Security outcome:** <what risk is reduced>
- **Non-goal check:** <what broad rewrites are excluded>

## Problem Statement

<Summarize alert families and risk. Do not paste raw scanner logs.>

## Goals

1. Resolve verified open code scanning alerts.
2. Keep remediation PRs focused and reviewable.
3. Preserve application behavior unless a security fix requires a documented change.

## Success Criteria

| Criterion | Target | Measurement Method |
| --- | --- | --- |
| Verified alert groups remediated | <n> | PRs merged and scanner re-run |

## Child Features

- [ ] <Feature 1> - Remediate <group_id>
- [ ] <Feature 2> - Remediate <group_id>

## Remediation Inventory

| Group | Alerts | Rule IDs | Severity | Affected files | Status | Child feature |
| --- | --- | --- | --- | --- | --- | --- |
| <group_id> | <alerts> | <rules> | <severity> | <files> | ready/covered/already-fixed/needs-input | <feature> |

## Notes

- Existing PRs:
- Already fixed locally:
- Needs input:
- Verification guidance:
```

Do not create `docs/features/` files unless the user asks to plan the remediation child features now.

## Final Response

Report:

- Code-scanning epic path.
- Alerts examined.
- Groups ready for feature planning/remediation.
- Alerts already fixed locally or covered by existing PRs.
- Alerts needing input.
- Recommended next step: run `plan-feature` for the highest-priority remediation group, or `ship-epic` to plan and advance the remediation epic.
