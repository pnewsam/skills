---
name: validate-changes
description: run targeted validation against recent code changes. reads the git diff, identifies which areas of the app changed, finds the relevant tests, runs only those tests, and reports what was validated and what gaps remain. use for spot-checking after making changes, before committing, after build-feature completes an item, or anytime you want fast targeted feedback on whether recent changes broke anything.
---

# Validate Changes

## Overview

Targeted validation of recent code changes. Instead of running the full test suite, this skill reads the git diff, maps changed files to affected application areas, identifies which existing tests cover those areas, and runs only those tests. This gives fast feedback on whether recent changes introduced regressions.

If no tests exist that cover the changed areas, the skill runs existing smoke tests and flags the coverage gap.

## Safety rules

- Do not modify source code or test files. This skill is read-only except for running tests.
- Do not run destructive commands or install packages.
- If the working tree is dirty with unstaged changes, include them in the diff analysis.
- Do not mark tests as passing or failing in any plan file — this skill only reports results.

## When to use

- After `build-feature` completes an item: validate the specific changes
- Before committing: quick spot-check
- After merging a branch: verify nothing broke
- Anytime you want fast, targeted feedback on recent changes

## Workflow

### 1. Determine the scope of changes

Identify what to validate against. In priority order:

**If the user specifies a base ref:**

```bash
git diff --name-only <base-ref>
```

**If the user says "recent changes" or doesn't specify:**

```bash
git diff --name-only HEAD~1  # Last commit
git diff --name-only main...HEAD  # Branch diff (if on a feature branch)
```

**If there are unstaged changes:**

```bash
git diff --name-only  # Working tree changes
```

List all changed files. Filter out:
- Test files themselves (`.spec.ts`, `.cy.ts`, `.test.ts`)
- Config files (`*.config.*`, `package.json`, `tsconfig.json`)
- Documentation (`*.md`, `docs/`)
- Generated files and lock files

Focus on application source: `src/`, `app/`, `pages/`, `components/`, `lib/`, `utils/`, `api/`, `routes/`.

If no application source files changed, report that there's nothing to validate and stop.

### 2. Categorize the changes

For each changed source file, determine what type of change it is and what it might affect:

| File pattern | Change type | Risk area |
|---|---|---|
| `pages/**`, `app/**/page.tsx` | Route/page | Navigation, page rendering |
| `components/**` | Shared or feature component | Reusable UI, component composition |
| `lib/**`, `utils/**` | Business logic / utility | Data processing, calculations |
| `api/**`, `services/**` | API / data fetching | Network calls, data shapes |
| `hooks/**` | Shared hook | Component behavior, side effects |
| `styles/**`, `*.css` | Styling | Visual rendering |
| `types/**`, `*.d.ts` | Types | Compile-time only (low risk) |
| `db/**`, `prisma/**` | Database / schema | Data persistence |

For each changed file, note:
- The route(s) or feature(s) it belongs to
- Which other files import it (to find affected components/pages)

```bash
# Find files that import a changed module
grep -r -l "<changed-module-path>" src/ app/ pages/ --include="*.tsx" --include="*.ts" --include="*.jsx" 2>/dev/null
```

### 3. Find relevant tests

Check for the browser test framework:

```bash
cat package.json | grep -E "playwright|cypress|@playwright"
ls playwright.config.* cypress.config.* e2e/ tests/ 2>/dev/null
```

If no browser test framework is detected, skip to Step 5 (run unit tests only).

Map changed files to existing test files. Strategy:

**By route:** If a page or route file changed, find tests that visit that route:

```bash
grep -r -l "<route-path>" tests/ cypress/e2e/ --include="*.spec.ts" --include="*.cy.ts" 2>/dev/null
```

**By component:** If a component changed, find tests that reference it or its `data-testid` values:

```bash
# Find data-testid values in the changed component
grep -o 'data-testid="[^"]*"' <changed-file> | cut -d'"' -f2

# Find tests that use those data-testid values
grep -r -l "<data-testid-value>" tests/ cypress/e2e/ 2>/dev/null
```

**By feature/slug:** If the change belongs to a named feature, find tests with matching describe blocks or file names:

```bash
grep -r -l "<feature-name>" tests/ cypress/e2e/ --include="*.spec.ts" --include="*.cy.ts" 2>/dev/null
find tests/ cypress/e2e/ -name "*<feature-slug>*" 2>/dev/null
```

**By user flow:** If the change affects a user flow (login, checkout, settings, etc.), find tests that cover that flow.

Compile the list of relevant test files. Deduplicate.

### 4. Run the targeted tests

Run only the identified test files. If no relevant tests were found, run the smoke tests instead.

#### Playwright

```bash
# Run specific test files
npx playwright test <test-file-1> <test-file-2> --reporter=line

# If many files, use a grep pattern
npx playwright test --grep "<feature-or-flow-name>" --reporter=line
```

#### Cypress

```bash
npx cypress run --spec "<test-file-1>,<test-file-2>"
```

If the dev server is not running, start it first or use `webServer` config.

**If no relevant tests found:**

Run the smoke tests as a minimal safety net:

```bash
npx playwright test tests/smoke.spec.ts --reporter=line
# or
npx cypress run --spec cypress/e2e/smoke.cy.ts
```

### 5. Run unit tests for changed logic

If the changes include business logic files (`lib/`, `utils/`, hooks), also run the corresponding unit tests:

```bash
# Find unit test files related to changed logic
find . -name "*<changed-file-basename>*" -path "*.test.*" -o -name "*<changed-file-basename>*" -path "*.spec.*" | grep -v node_modules | grep -v e2e | grep -v cypress

# Run them
npx vitest run <test-file> --reporter=verbose
# or
npx jest <test-file> --verbose
```

### 6. Run lint and typecheck on changed files

```bash
# TypeScript typecheck
npx tsc --noEmit

# Lint changed files only
npx eslint <changed-files> --max-warnings 0
```

If the full typecheck is too slow, note it but proceed with test results.

### 7. Produce the validation report

Output a structured summary:

```markdown
## Validation Report

**Scope:** <number> files changed across <number> areas
**Diff:** `<base-ref>...HEAD` (or "working tree")

### Changes

| File | Type | Affected area |
|------|------|---------------|
| ...  | ...  | ...           |

### Tests executed

| Test file | Result | Duration | Notes |
|-----------|--------|----------|-------|
| ...       | PASS/FAIL | ...   | ...   |

### Results

- **Browser tests:** <passing>/<total> passing
- **Unit tests:** <passing>/<total> passing
- **Lint:** pass/fail
- **Typecheck:** pass/fail

### Coverage gaps

- <file/area> has no browser test coverage
- <file/area> has no unit test coverage
```

If any tests failed, include the failure output and suggest next steps:

- If the failure matches the changed code → likely a real regression. Recommend reverting or fixing.
- If the failure is in unrelated code → likely a pre-existing issue or flaky test. Recommend running `fix-browser-test`.

### 8. Final response

Report:
- Number of files changed and areas affected
- Number of tests run (browser + unit)
- Pass/fail summary
- Any coverage gaps flagged
- If failures occurred: whether they appear to be regressions from the changes or pre-existing issues
- Recommended next step: if all passing, proceed confidently; if failures, investigate before continuing

## Handling common situations

### No browser tests exist at all

Run unit tests, lint, and typecheck only. In the report, flag that the project has no browser test facility and recommend running `setup-browser-testing` followed by `plan-browser-tests`.

### No tests cover the changed area

Run smoke tests and the full unit test suite as a safety net. Flag the coverage gap prominently in the report. Recommend running `add-browser-test` to add coverage for the affected flow.

### Very large diff (20+ files)

Do not try to categorize every file individually. Group by area/feature and run the broadest relevant test set. Note in the report that the validation is broad due to the large diff.

### Changes are only in test files

If only test files changed, run just the changed test files to verify they pass. Note that no application code was changed so regression risk is low.

### Working tree has both staged and unstaged changes

Ask whether to validate staged only, unstaged only, or both. Default to both if the user doesn't specify.

### Dev server is not running

Note the start command. If `webServer` is configured in `playwright.config.ts`, Playwright will start it automatically. Otherwise, tell the user to start the dev server first.