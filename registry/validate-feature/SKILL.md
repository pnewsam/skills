---
name: validate-feature
description: Run a comprehensive validation pass after build-feature completes a feature. Reads the plan, runs proportionate targeted and regression tests, verifies acceptance criteria, and writes a validation report plus a plan reference. Use before prepare-pr or when asked for feature-level QA. Does not fix failures, commit, push, or open a PR.
---

# Validate Feature

## Overview

Comprehensive post-build validation of a completed feature. This skill takes
the feature plan from `build-feature`, runs targeted checks for the changed
areas, runs a surface-appropriate regression suite, verifies each acceptance
criterion with the strongest available evidence, and produces a validation
report that can be attached to the feature plan or PR.

This is broader than `validate-changes` (which is a fast spot-check) and narrower than a full QA pass (which would test the entire application). It sits between them: thorough validation scoped to the feature and its blast radius.

## Safety rules

- Do not modify application source code. Report issues; do not fix them.
- Do not mark acceptance criteria as verified if they cannot be confirmed.
- If a test failure indicates a regression, flag it — do not silently note it.
- If a required runtime cannot be started or reached, document what was tested
  and what was skipped.
- Do not run destructive commands or modify the feature plan's content beyond adding the validation report.
- Write the report and plan reference, but do not commit them unless the user
  explicitly asks for a commit.

## Prerequisites

The feature should be fully implemented (all `[x]` in the plan) before running this skill. If items are still unchecked, ask the user whether to validate the partial implementation or finish building first.

## Workflow

### 1. Load the feature plan

```bash
ls docs/features/ 2>/dev/null
```

If no feature plans exist, stop. This skill requires a feature plan from `plan-feature`.

If the user did not specify a feature, list available plans and ask which one to validate.

If the user says "current feature" or "this feature," check the current git branch for a feature slug:

```bash
git branch --show-current
```

Read the full feature plan. Note:
- The acceptance criteria (checklist items)
- Technical notes and implementation details
- Which files were changed (from the plan's Progress section or commit notes)
- The parent epic for broader context

If the plan has a Progress section, read it to understand what was implemented.

### 2. Determine the base and validation surface

Use a base ref named by the user or repository instructions. Otherwise inspect
the remote default and common local base branches:

```bash
git symbolic-ref --quiet --short refs/remotes/origin/HEAD
git branch --list main master develop
```

Choose the ref supported by repository evidence; do not assume `main`. Report
the selected base in the validation report.

Classify the feature's primary surface before choosing checks:

- **Browser/UI:** pages, components, browser configuration, or user-interface
  acceptance criteria
- **Service/API:** endpoints, jobs, persistence, integrations, or service
  contracts
- **Library/CLI:** reusable modules, packages, command-line behavior, or
  non-networked logic
- **Mixed:** more than one material surface

Missing browser infrastructure is a coverage gap only for a browser-facing
feature. Do not fill a library or service report with irrelevant browser
checks.

### 3. Run targeted change validation

Run the equivalent of `validate-changes` for the files touched by this feature.

```bash
# Get the diff between the feature branch and the base branch
git diff --name-only <base-ref>...HEAD
```

Or use the files listed in the feature plan's Progress section.

Execute the same analysis as `validate-changes`:
- Identify changed files and their impact areas
- Find and run relevant tests for the classified surface
- Run unit tests for changed logic
- Run lint and typecheck

Record results for the validation report.

### 4. Run surface-appropriate regression checks

After targeted checks, run the broadest proportionate suite that can catch
regressions for the classified surface:

- **Browser/UI:** configured browser suite, or a strategic browser subset for
  a very large suite
- **Service/API:** API, database, job, or integration tests that exercise the
  affected boundary
- **Library/CLI:** full unit suite plus a CLI or public-API smoke check when
  configured
- **Mixed:** combine the relevant suites without duplicating work

```bash
# Playwright
npx playwright test --reporter=line

# Cypress
npx cypress run
```

If the applicable suite is very large and takes too long, run a strategic
subset:
- All smoke tests
- All tests for shared components modified
- All tests for routes adjacent to the changed area
- All auth-related tests (auth regressions are high-impact)

If any test fails, note it. Determine whether the failure is:
- **From this feature's changes:** flag as a regression
- **Pre-existing:** flag but note it's not caused by this feature
- **Flaky:** note the flakiness

### 5. Verify acceptance criteria

For each acceptance criterion in the feature plan, verify it using the
strongest applicable evidence: automated tests, an API or CLI exercise,
browser automation, or direct code/configuration inspection when runtime
verification is not meaningful.

Start a runtime only when a criterion requires it. Use the project's actual
documented command rather than assuming a browser app:

```bash
# Inspect configured commands
rg -n '"(dev|start|serve|test)"|\\[project\\.scripts\\]' package.json pyproject.toml Makefile 2>/dev/null
```

For each criterion:
1. Read what it specifies
2. Verify it at the relevant surface
3. Note: **VERIFIED**, **CANNOT VERIFY** (with reason), or **FAILED** (with description of the mismatch)

Use browser automation only for browser-facing criteria. Prefer reproducible
automated evidence over subjective manual inspection.

### 6. Check surface-specific post-build issues

Inspect only the concerns relevant to the feature:

- **Browser/UI:** visual regressions, console/network errors, accessibility,
  responsive behavior, and loading/empty/error states
- **Service/API:** contract compatibility, authorization, error translation,
  data integrity, idempotency, and timeout/retry behavior
- **Library/CLI:** public API compatibility, exit codes, error messages,
  deterministic behavior, and documented usage
- **All surfaces:** lint, type checks, security-sensitive changes, and
  dependency/configuration risk when applicable

### 7. Produce the validation report

Write `docs/features/<NNN>-<slug>-validation.md`:

```markdown
# Validation Report: <Feature Name>

**Feature plan:** `docs/features/<NNN>-<slug>.md`
**Validated:** <date>
**Branch:** `<branch-name>`
**Base:** `<base-ref>`
**Surface:** `<browser/UI | service/API | library/CLI | mixed>`

## Summary

| Check | Result |
|-------|--------|
| Targeted checks | <command and result> |
| Regression suite | <command and result, or not applicable> |
| Unit tests | <passing>/<total> passing |
| Lint | pass/fail |
| Typecheck | pass/fail |
| Acceptance criteria verified | <verified>/<total> |

## Acceptance criteria

| # | Criterion | Result | Notes |
|---|-----------|--------|-------|
| 1 | ...       | VERIFIED / FAILED / CANNOT VERIFY | ... |
| 2 | ...       | ...    | ... |

## Test results

### Test and check results

| Test file | Result | Notes |
|-----------|--------|-------|
| ...       | PASS   | ...   |

### Unit tests

| Test file | Result | Notes |
|-----------|--------|-------|
| ...       | PASS   | ...   |

## Surface checks

| Check | Result | Notes |
|-------|--------|-------|
| <relevant check> | pass/fail/not run | ... |

## Coverage gaps

- <area> has no test coverage and was affected by this feature
- ...

## Issues found

### Regressions

- <description of regression and how to reproduce>

### Pre-existing failures

- <description of failure not caused by this feature>

### Flaky tests

- <description of flaky behavior observed>

## Recommendation

- [ ] READY TO SHIP — all checks pass, no regressions
- [ ] SHIP WITH CAVEATS — <describe caveats>
- [ ] DO NOT SHIP — <describe blocking issues>
```

Omit irrelevant rows and empty issue categories. Do not report a missing
browser suite as a gap for a non-browser feature.

### 8. Update the feature plan

Append a "Validation" section to the feature plan (or update the existing one if present):

```markdown
## Validation

Validated: <date> | Report: `docs/features/<NNN>-<slug>-validation.md` | Result: READY TO SHIP / SHIP WITH CAVEATS / DO NOT SHIP
```

Leave the validation report and feature-plan reference in the working tree.
Commit them only when the user explicitly asks.

### 9. Final response

Report:
- Feature validated
- Overall result: READY TO SHIP, SHIP WITH CAVEATS, or DO NOT SHIP
- Acceptance criteria: <verified>/<total> verified
- Regression and targeted checks: <concise results>
- Any regressions found
- Any coverage gaps flagged
- Path to the full validation report
- Recommended next step: `prepare-pr` (if ready to ship) or fix issues (if problems found)

## Handling common situations

### Browser-facing feature has no browser tests

Run unit tests, lint, and typecheck. Verify browser-facing criteria through the
best available manual or automated path. Flag the missing browser coverage and
recommend `plan-browser-tests` when the flow warrants it.

### Feature is partially implemented

If the user wants to validate a partially-implemented feature, validate only the completed criteria. Note which criteria were skipped in the report. Recommend completing the feature before running `prepare-pr`.

### Required runtime cannot be started

Verify whatever criteria can be proven through tests or static evidence and
mark the remainder `CANNOT VERIFY`. Note clearly which runtime checks were
skipped and why.

### Full test suite fails with pre-existing issues

Run the test suite excluding known-failing tests. Note the exclusions in the report. Do not let pre-existing failures block the validation result — but do flag them so they don't get forgotten.

### Feature spans multiple commits with a large diff

Use the feature plan's file list and the `git diff` against the base branch to determine scope. If the diff is very large, focus runtime verification on the changed pages/routes rather than every component.

### No feature plan exists (ad-hoc feature)

If the user asks to validate a feature but no plan exists, ask for:
- What was built
- Which files were changed
- What the acceptance criteria are

Then proceed with the validation using that information instead of a plan file. Note that the lack of a plan means criteria verification is based on the user's description.
