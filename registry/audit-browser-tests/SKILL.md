---
name: audit-browser-tests
description: audit an existing browser test suite to identify stale tests, missing coverage, flaky patterns, and quality issues. use when asked to audit browser tests, review existing e2e tests, find missing test coverage, or refresh the browser test plan. produces an audit report and an updated browser-test-plan.md that reflects the current state of both the app and the test suite.
---

# Audit Browser Tests

## Overview

Analyze an existing browser test suite against the current application to identify what is well-covered, what is stale or broken, what is missing, and what has quality issues. Produces two outputs:

1. `docs/tmp/browser-test-audit.md` — a full audit report
2. `docs/tmp/browser-test-plan.md` — updated or created, with existing coverage reflected as `[x]`, stale tests flagged, and newly discovered missing flows added as `[ ]`

This skill is the entry point for maintaining browser tests on an existing codebase. Run it before using `fix-browser-test` (to find what needs fixing) or `add-browser-test` (to find what needs adding).

## Safety rules

- Do not modify test files or application source code during the audit. This skill is read-only.
- Do not mark a flow as covered (`[x]`) unless the test actually exercises the full flow described.
- If `docs/tmp/browser-test-plan.md` already exists, preserve its structure and merge findings rather than overwriting.

## What to look for

### Stale tests
Tests that reference selectors, routes, or UI patterns that no longer exist in the application source. Signs:
- `data-testid` values not found in any source file
- URLs or route paths that no longer exist
- Button labels, heading text, or link names that have changed
- Component names or API endpoints referenced in the test that are gone

### Missing coverage
Critical flows that exist in the application but have no corresponding test. Use the same criticality criteria as `plan-browser-tests`: auth flows, core value-proposition flows, data creation/editing/deletion, access control boundaries.

### Flaky patterns
Structural issues that make tests unreliable:
- Hardcoded `wait` or `sleep` calls instead of framework-provided auto-waiting
- Assertions on timing-dependent content (animations, loading states) without proper waits
- Tests that depend on execution order or shared mutable state
- Overly broad selectors (e.g. `cy.get('button').first()`) that break when the DOM changes
- Missing cleanup between tests leaving state that affects subsequent runs

### Quality issues
Tests that pass but are not testing what they claim:
- No assertions, or assertions so broad they always pass
- Tests that only assert URL changes without checking page content
- Single test that tries to cover multiple unrelated flows
- Meaningful steps commented out or skipped
- `data-testid` selectors used where semantic role/label selectors would be more resilient

### Duplicate coverage
Multiple tests that exercise the same flow with no meaningful variation. Flag these so the author can decide whether to consolidate.

## Workflow

### 1. Detect the framework

```bash
cat package.json
ls cypress.config.* playwright.config.* 2>/dev/null
```

Identify whether the project uses Playwright, Cypress, or both.

### 2. Find all existing test files

**Playwright:**
```bash
find tests/ e2e/ -name "*.spec.ts" -o -name "*.spec.js" | sort
```

**Cypress:**
```bash
find cypress/e2e/ -name "*.cy.ts" -o -name "*.cy.js" | sort
```

Also check for helper files, fixtures, and support files:
```bash
find tests/ cypress/ -name "*.ts" -o -name "*.js" | grep -v node_modules | sort
```

### 3. Read and catalog existing tests

Read each test file. For each one, record:
- **File path**
- **Flows covered** — what the test actually does (not just the describe/it names)
- **Selectors used** — `data-testid` values, role queries, text queries, CSS selectors
- **Routes visited** — URLs in `goto()`, `cy.visit()`, or `cy.url()` assertions
- **Patterns** — any hardcoded waits, broad selectors, or missing assertions

Build a catalog of: all `data-testid` values used, all routes visited, all flows covered.

### 4. Audit against the current application

#### Check for stale selectors
Search for each `data-testid` value from the test catalog in the application source:

```bash
grep -r "data-testid=\"<value>\"" src/ app/ pages/ --include="*.tsx" --include="*.jsx" --include="*.html"
```

Flag any `data-testid` that appears in tests but not in source files.

#### Check for stale routes
For each route visited in tests, verify it still exists in the routing configuration:

```bash
# Next.js / file-based
find pages/ app/ src/pages/ src/app/ -name "*.tsx" -o -name "*.jsx" | sort

# React Router
grep -r "path=" src/ --include="*.tsx" --include="*.jsx" -n
```

Flag routes that no longer exist.

#### Discover missing critical flows
Apply the same discovery process as `plan-browser-tests` — scan routes, forms, auth boundaries, and interactive components — then compare against the catalog of covered flows. Identify flows that are critical but untested.

### 5. Run the test suite (optional but recommended)

If the user has confirmed the app is running and the test environment is available, run the full suite to identify tests that are currently failing:

**Playwright:**
```bash
npx playwright test --reporter=line
```

**Cypress:**
```bash
npx cypress run
```

Record which tests pass, fail, or are skipped. Failing tests are immediate candidates for `fix-browser-test`.

If the app is not running, skip this step and note it in the audit report.

### 6. Produce the audit report

Write `docs/tmp/browser-test-audit.md` using the template in `references/audit_template.md`.

```bash
mkdir -p docs/tmp
```

### 7. Update the browser test plan

Update or create `docs/tmp/browser-test-plan.md`:

- Flows with passing tests: mark `[x]` and note the test file
- Flows with failing or stale tests: mark `[~]` (broken) and note what is wrong
- Newly discovered missing flows: add as `[ ]` in priority order
- Flows in the existing plan that no longer apply: mark `[x]` with a note that they were removed from the app

Use `[~]` as a convention for "exists but broken/stale" — `fix-browser-test` targets these entries.

### 8. Final response

Report:
- Total tests found
- Passing / failing / unknown (if suite was not run)
- Number of stale tests found
- Number of missing critical flows identified
- Top 3 most urgent issues
- Path to the audit report and updated plan
- Recommended next step: `fix-browser-test` for broken tests, `add-browser-test` for missing flows

## Handling common situations

### No existing browser tests

Stop the audit and inform the user. Recommend running `plan-browser-tests` instead to start from scratch.

### Test suite is very large (50+ test files)

Do not read every file in full. Instead:
1. Read the directory structure and file names to understand the organization
2. Read a representative sample (5–10 files across different areas)
3. Run the suite to get pass/fail counts
4. Focus the selector and route audit on the highest-risk areas

Note in the report that the audit is based on a sample.

### Tests use Page Object Model or custom abstractions

Read the page object or helper files as well as the test files. Stale selectors may live in the abstractions rather than the tests themselves.

### Both Playwright and Cypress are present

Audit both. Note in the report which framework has better coverage and whether consolidation should be considered.
