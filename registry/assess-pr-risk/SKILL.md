---
name: assess-pr-risk
description: Assess a pull request's operational and merge risk through an available authenticated GitHub integration or gh across blast radius, security, data, tests, dependencies, and infrastructure, and optionally post the assessment as a PR comment. Use when asked to risk-assess a PR, flag risky changes, or evaluate merge readiness. Defaults to analysis only unless posting is explicitly requested.
---

# Assess PR Risk

## Overview

Evaluate the risk level of a pull request by inspecting the diff, commit history,
and PR metadata. Use **Analyze mode** by default. Use **Post mode** only when the
user explicitly asks to comment or post the result.

This skill is read-only with respect to source code and branch state. The only write operation is posting the comment.

## Safety rules

- Never modify source code, commit history, branch state, or PR metadata. This skill only posts a comment.
- Never post in Analyze mode. In Post mode, complete the assessment before the
  single external write.
- If the PR is merged or closed, assess it when useful but do not post unless the
  user explicitly asked for a retrospective comment.
- Do not invent risk factors. Every finding must be traceable to specific files or lines in the diff.

## Risk levels

Assign one of four levels based on the combined weight of risk factors:

| Level | Label | Meaning |
|-------|-------|---------|
| 1 | Low | Small, well-contained change with good test coverage and no sensitive areas touched |
| 2 | Medium | Moderate scope, limited test coverage, or incidental contact with sensitive areas |
| 3 | High | Large blast radius, security-adjacent changes, schema/API changes, or missing tests on critical paths |
| 4 | Critical | Auth or permission bypass risk, destructive data operations, production config changes, or secrets exposure |

Use the highest **credible** single-dimension rating as the default overall
level, then calibrate it with evidence and confidence. Numeric thresholds are
signals, not substitutes for understanding dependency reach or runtime impact.

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

### 1. Select an authenticated GitHub access path

Prefer an available GitHub connector or app. Otherwise use authenticated `gh`:

```bash
gh --version
gh auth status
```

Do not require both. If neither path is authenticated, stop and explain how to
connect the integration or authenticate `gh`.

### 2. Identify the target PR

If the user provides a PR number, use that. Otherwise, detect from the current branch:

With a connector, resolve the repository and search open PRs for the current
head branch, then fetch the selected PR metadata. With `gh`, use:

```bash
gh pr view --json number,title,body,baseRefName,headRefName,state,url,author
```

If no PR is found, list open PRs:

```bash
gh pr list --state open
```

Store: `number`, `title`, `baseRefName`, `headRefName`, `state`, `url`.

### 3. Fetch the PR evidence

With a connector, fetch the PR and retrieve patches for the exact changed
filenames in bounded groups. With `gh`, use:

```bash
gh pr view <number> --json files,commits
gh pr diff <number>
```

For large PRs, inspect file patches in bounded groups without modifying local
Git refs:

```bash
gh api repos/<owner>/<repo>/pulls/<number>/files --paginate
```

### 4. Assess each risk dimension

Work through all seven dimensions. For each one:
- Assign a level (Low / Medium / High / Critical)
- Note the specific files or patterns that drove the rating
- Keep findings short and traceable to the diff

### 5. Determine the overall risk level

The overall level is the highest credible level across all dimensions. State
which evidence drove it, how confident the assessment is, and any information
that could materially lower or raise the rating.

### 6. Draft the assessment comment

Use the template in `references/output_templates.md`. Fill in:
- Overall risk level and badge
- A one-paragraph summary of the most important findings
- The dimension table with per-dimension ratings and brief justification
- A recommendations section with specific, actionable next steps
- A footer noting who ran the assessment and when

Remove any dimension rows that are not applicable (e.g. no dependency changes → omit the Dependencies row, or mark it N/A).

### 7. Present the assessment

Stop here in Analyze mode. In Post mode, verify the target PR and proceed unless
the target or requested scope is ambiguous.

### 8. Post the comment (Post mode only)

With a connector, call its top-level PR-comment action once with the repository,
PR number, and completed assessment body. Otherwise use:

```bash
gh pr comment <number> --body "<assessment comment>"
```

After posting, fetch the live conversation through the same access path, verify
the comment appears, and share the PR URL.
If the selected access path rejects publication because direct user
authorization or a content-safety approval is missing, do not retry through
another path. Report the rejection and preserve the completed assessment for
the original user-authorized context.

### 9. Final response

Report:
- PR number and URL
- Overall risk level assigned
- The single most significant risk factor
- Whether the comment was posted successfully

## Handling common situations

### PR is already merged or closed

Note the state and complete the assessment. Post only when the user explicitly
requested a retrospective comment.

### Very large diff (500+ files)

Do not attempt to read every file. Instead:
1. Use the PR file metadata to identify the highest-churn files and areas
2. Sample representative files from each affected module
3. Note in the comment that the assessment is based on a sample due to diff size, and flag the size itself as a High blast-radius indicator

### No tests in the repository at all

Note this explicitly in the test coverage dimension. Distinguish PR-local
responsibility from repository-level debt, but still count the resulting lack of
evidence in the risk assessment.

### Conflicting signals

When one dimension is Critical and others are Low, do not average them. The overall rating is Critical. Explain the specific factor and why it outweighs the lower-risk dimensions.
