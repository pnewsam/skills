---
name: assess-pr-risk
description: assess the risk level of a pull request and post the assessment as a PR comment. use when asked to risk-assess a PR, flag risky changes, evaluate blast radius, or check whether a PR is safe to merge. analyzes blast radius, security sensitivity, test coverage, dependencies, and infrastructure changes, then posts a structured comment via the GitHub CLI.
---

# Assess PR Risk

## Overview

Evaluate the risk level of a pull request by inspecting the diff, commit history, and PR metadata. Produce a structured risk assessment across key dimensions and post it as a comment on the PR via the GitHub CLI.

This skill is read-only with respect to source code and branch state. The only write operation is posting the comment.

## Safety rules

- Never modify source code, commit history, branch state, or PR metadata. This skill only posts a comment.
- Do not post a comment until the full assessment is complete and the user has confirmed (unless explicitly asked to run automatically).
- If the PR is merged or closed, still assess and post — the comment may inform retrospectives or future work.
- Do not invent risk factors. Every finding must be traceable to specific files or lines in the diff.

## Risk levels

Assign one of four levels based on the combined weight of risk factors:

| Level | Label | Meaning |
|-------|-------|---------|
| 1 | Low | Small, well-contained change with good test coverage and no sensitive areas touched |
| 2 | Medium | Moderate scope, limited test coverage, or incidental contact with sensitive areas |
| 3 | High | Large blast radius, security-adjacent changes, schema/API changes, or missing tests on critical paths |
| 4 | Critical | Auth or permission bypass risk, destructive data operations, production config changes, or secrets exposure |

When multiple dimensions point in different directions, use the **highest** single-dimension rating as the overall level. Explain the deciding factor clearly.

## Risk dimensions

Evaluate each dimension independently, then combine into an overall level.

### 1. Blast radius

How many files and distinct areas of the codebase are touched?

- **Low** — fewer than 10 files, all within one module or package
- **Medium** — 10–30 files, or changes span 2–3 modules
- **High** — 30+ files, or changes span many modules/packages
- **Critical** — changes to shared foundational code (base classes, middleware, core utilities) used across the entire codebase

Note the file count and the modules affected.

### 2. Change type

What kind of change is this?

- **Low** — documentation, tests only, or a well-scoped bug fix with no interface changes
- **Medium** — new feature with no breaking changes, internal refactor
- **High** — breaking change to a public API or interface, schema migration, large refactor
- **Critical** — removal of safety checks, disabling of auth or validation, destructive migration

### 3. Security sensitivity

Does the diff touch security-critical areas?

Areas to flag: authentication, authorization, session management, cryptography, secret or credential handling, input validation, SQL queries (injection risk), file system access, environment variable handling, permission checks, PII or sensitive data storage/transmission.

- **Low** — no security-sensitive files touched
- **Medium** — security-adjacent changes (e.g. adding a new route behind existing auth)
- **High** — changes to auth logic, permission checks, or cryptographic operations
- **Critical** — removing or weakening auth/validation, exposing secrets, privilege escalation paths

### 4. Data risk

Could this change cause data loss, corruption, or irreversible state changes?

- **Low** — no database or persistent storage changes
- **Medium** — additive schema changes (new columns, new tables)
- **High** — schema migrations with column renames, type changes, or index drops; bulk update queries
- **Critical** — destructive migrations (drop table, drop column with data), irreversible data transformations, deletion of production data

### 5. Test coverage

Are the changed paths covered by tests?

- **Low** — existing tests cover the changed code, and new tests are added for new behavior
- **Medium** — changed paths have some test coverage but new behavior is not fully tested
- **High** — changed paths have little or no test coverage
- **Critical** — critical paths (auth, payments, data integrity) changed with no tests

To assess, look for test files in the diff and check whether test files exist adjacent to changed source files.

### 6. Dependencies

Are third-party dependencies added, removed, or updated?

- **Low** — no dependency changes
- **Medium** — patch or minor version bumps of existing dependencies
- **High** — new dependencies added, or major version bumps of existing ones
- **Critical** — dependency with known CVEs, or replacing a security-critical library

Check `package.json`, `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, `requirements.txt`, `Pipfile`, `pyproject.toml`, `Cargo.toml`, `go.mod`, or equivalent lockfiles.

### 7. Infrastructure and configuration

Does the diff touch deployment, CI/CD, environment, or infrastructure config?

- **Low** — no infrastructure or config changes
- **Medium** — CI workflow updates, non-secret config changes
- **High** — environment variable changes, Dockerfile changes, deployment manifest changes
- **Critical** — production secrets, IAM policies, firewall rules, database connection strings

## Workflow

### 1. Verify the GitHub CLI is available

```bash
gh --version
```

If `gh` is not installed or not authenticated, stop and instruct the user to install it and run `gh auth login`.

### 2. Identify the target PR

If the user provides a PR number, use that. Otherwise, detect from the current branch:

```bash
gh pr view --json number,title,body,baseRefName,headRefName,state,url,author
```

If no PR is found, list open PRs:

```bash
gh pr list --state open
```

Store: `number`, `title`, `baseRefName`, `headRefName`, `state`, `url`.

### 3. Fetch the diff

```bash
git fetch origin
git diff --stat origin/<baseRefName>...origin/<headRefName>
git diff --name-status origin/<baseRefName>...origin/<headRefName>
```

For targeted inspection of sensitive or large files:

```bash
git diff origin/<baseRefName>...origin/<headRefName> -- <path>
```

For a narrative view of commits:

```bash
git log --oneline origin/<baseRefName>..origin/<headRefName>
```

### 4. Assess each risk dimension

Work through all seven dimensions. For each one:
- Assign a level (Low / Medium / High / Critical)
- Note the specific files or patterns that drove the rating
- Keep findings short and traceable to the diff

### 5. Determine the overall risk level

The overall level is the **highest** level across all dimensions. State which dimension drove the overall rating and why.

### 6. Draft the assessment comment

Use the template in `references/output_templates.md`. Fill in:
- Overall risk level and badge
- A one-paragraph summary of the most important findings
- The dimension table with per-dimension ratings and brief justification
- A recommendations section with specific, actionable next steps
- A footer noting who ran the assessment and when

Remove any dimension rows that are not applicable (e.g. no dependency changes → omit the Dependencies row, or mark it N/A).

### 7. Confirm before posting

Show the full comment to the user and ask for confirmation unless they have explicitly asked for automatic posting.

### 8. Post the comment

```bash
gh pr comment <number> --body "<assessment comment>"
```

After posting, verify and share the PR URL.

### 9. Final response

Report:
- PR number and URL
- Overall risk level assigned
- The single most significant risk factor
- Whether the comment was posted successfully

## Handling common situations

### PR is already merged or closed

Note the state but still complete the assessment and post the comment. Risk assessments on merged PRs are useful for post-merge review and team learning.

### Very large diff (500+ files)

Do not attempt to read every file. Instead:
1. Use `git diff --stat` to identify the highest-churn files and areas
2. Sample representative files from each affected module
3. Note in the comment that the assessment is based on a sample due to diff size, and flag the size itself as a High blast-radius indicator

### No tests in the repository at all

Note this explicitly in the test coverage dimension. Do not penalize the PR for the absence of tests if the repository has no testing infrastructure — instead flag it as a repo-level risk.

### Conflicting signals

When one dimension is Critical and others are Low, do not average them. The overall rating is Critical. Explain the specific factor and why it outweighs the lower-risk dimensions.
