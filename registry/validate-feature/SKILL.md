---
name: validate-feature
description: run a comprehensive validation pass after build-feature completes a feature. reads the feature plan, runs targeted tests via validate-changes, runs the full browser test suite, verifies acceptance criteria against the running app, and produces a validation report attached to the feature plan. use after build-feature finishes all items in a feature, before prepare-pr, or when the user wants a thorough validation of a completed feature.
---

# Validate Feature

## Overview

Comprehensive post-build validation of a completed feature. This skill takes the feature plan from `build-feature`, runs targeted tests for the changed areas, runs the full browser test suite to check for regressions, verifies each acceptance criterion against the running application, and produces a validation report that can be attached to the feature plan or PR.

This is broader than `validate-changes` (which is a fast spot-check) and narrower than a full QA pass (which would test the entire application). It sits between them: thorough validation scoped to the feature and its blast radius.

## Safety rules

- Do not modify application source code. Report issues; do not fix them.
- Do not mark acceptance criteria as verified if they cannot be confirmed.
- If a test failure indicates a regression, flag it — do not silently note it.
- If the app is not running or cannot be reached, document what was tested and what was skipped.
- Do not run destructive commands or modify the feature plan's content beyond adding the validation report.

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

### 2. Run targeted change validation

Run the equivalent of `validate-changes` for the files touched by this feature.

```bash
# Get the diff between the feature branch and the base branch
git diff --name-only main...HEAD
```

Or use the files listed in the feature plan's Progress section.

Execute the same analysis as `validate-changes`:
- Identify changed files and their impact areas
- Find and run relevant browser tests
- Run unit tests for changed logic
- Run lint and typecheck

Record results for the validation report.

### 3. Run the full browser test suite

Even though `validate-changes` runs targeted tests, run the full browser test suite to catch regressions in areas that weren't directly changed but might be affected (shared components, routing, auth, etc.).

```bash
# Playwright
npx playwright test --reporter=line

# Cypress
npx cypress run
```

If the full suite is very large (50+ tests) and takes too long, run a strategic subset:
- All smoke tests
- All tests for shared components modified
- All tests for routes adjacent to the changed area
- All auth-related tests (auth regressions are high-impact)

If any test fails, note it. Determine whether the failure is:
- **From this feature's changes:** flag as a regression
- **Pre-existing:** flag but note it's not caused by this feature
- **Flaky:** note the flakiness

### 4. Verify acceptance criteria

For each acceptance criterion in the feature plan, verify it against the running application.

If the app is not running, start it:

```bash
# Read the dev server command from package.json
cat package.json | grep -A5 '"scripts"'
```

For each criterion:
1. Read what it specifies
2. Verify it in the running app (navigate to the relevant page, perform the action, check the result)
3. Note: **VERIFIED**, **CANNOT VERIFY** (with reason), or **FAILED** (with description of the mismatch)

Use browser automation (`browse` skill) or manual inspection to verify. Prioritize automated verification.

### 5. Check for common post-build issues

Inspect the running application for common problems that tests might miss:

- **Visual regressions:** Does the new feature look correct? Are layouts broken on mobile widths?
- **Console errors:** Check the browser console for errors introduced by the feature
- **Network errors:** Check for failed API calls in the Network tab
- **Accessibility:** Can the new UI be navigated by keyboard? Are form inputs properly labeled?
- **Loading states:** Does the feature handle loading, empty, and error states gracefully?

### 6. Produce the validation report

Write `docs/features/<NNN>-<slug>-validation.md`:

```markdown
# Validation Report: <Feature Name>

**Feature plan:** `docs/features/<NNN>-<slug>.md`
**Validated:** <date>
**Branch:** `<branch-name>`
**Base:** `main`

## Summary

| Check | Result |
|-------|--------|
| Targeted browser tests | <passing>/<total> passing |
| Full browser test suite | <passing>/<total> passing |
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

### Browser tests

| Test file | Result | Notes |
|-----------|--------|-------|
| ...       | PASS   | ...   |

### Unit tests

| Test file | Result | Notes |
|-----------|--------|-------|
| ...       | PASS   | ...   |

## Post-build QA checks

| Check | Result | Notes |
|-------|--------|-------|
| Console errors | pass/fail | ... |
| Visual correctness | pass/fail | ... |
| Mobile layout | pass/fail | ... |
| Keyboard navigation | pass/fail | ... |
| Loading states | pass/fail | ... |
| Error states | pass/fail | ... |

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

### 7. Update the feature plan

Append a "Validation" section to the feature plan (or update the existing one if present):

```markdown
## Validation

Validated: <date> | Report: `docs/features/<NNN>-<slug>-validation.md` | Result: READY TO SHIP / SHIP WITH CAVEATS / DO NOT SHIP
```

Commit the validation report and updated feature plan.

### 8. Final response

Report:
- Feature validated
- Overall result: READY TO SHIP, SHIP WITH CAVEATS, or DO NOT SHIP
- Acceptance criteria: <verified>/<total> verified
- Browser tests: <passing>/<total> passing
- Any regressions found
- Any coverage gaps flagged
- Path to the full validation report
- Recommended next step: `prepare-pr` (if ready to ship) or fix issues (if problems found)

## Handling common situations

### Feature has no browser tests

Run unit tests, lint, and typecheck. Verify acceptance criteria manually. In the report, flag the lack of browser test coverage and recommend running `plan-browser-tests` to add coverage for this feature's flows.

### Feature is partially implemented

If the user wants to validate a partially-implemented feature, validate only the completed criteria. Note which criteria were skipped in the report. Recommend completing the feature before running `prepare-pr`.

### App cannot be started

Skip acceptance criteria verification and post-build QA checks. Run only tests and static analysis. Note clearly in the report that runtime verification was skipped and why.

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