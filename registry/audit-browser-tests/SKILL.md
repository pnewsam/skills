---
name: audit-browser-tests
description: audit an existing browser test suite to identify stale tests, missing coverage, flaky patterns, and quality issues. use when asked to audit browser tests, review e2e tests, find missing browser coverage, or refresh browser-test planning. writes an epic audit under docs/epics and updates the browser-test coverage epic.
---

# Audit Browser Tests

## Overview

Audit browser tests against the current application and write the findings into the standard planning flow. The durable outputs are:

1. A browser-test epic audit report in `docs/epics/NNN-<slug>-audit.md`.
2. Updates to the related browser-test coverage epic's `Child Features` and `Flow Inventory`.

Do not create separate browser-test tracker or audit artifacts outside the epic/feature flow.

## Safety Rules

- Read-only with respect to source and test files.
- Do not mark coverage as complete unless a test actually exercises the described flow.
- Do not create separate browser-test trackers outside the epic/feature flow.
- If no browser-test epic exists, create or recommend one using the `plan-browser-tests` structure.

## Workflow

### 1. Locate Browser-Test Plans

Check for a browser-test epic and existing feature plans:

```bash
ls docs/epics/ 2>/dev/null
ls docs/features/ 2>/dev/null
```

Read any epic or feature that references browser tests, e2e tests, Playwright, Cypress, or critical UI coverage.

### 2. Catalog Existing Tests

Detect framework and test files:

```bash
cat package.json 2>/dev/null
ls playwright.config.* cypress.config.* 2>/dev/null
find tests/ e2e/ cypress/ -name "*.spec.ts" -o -name "*.spec.js" -o -name "*.cy.ts" -o -name "*.cy.js" 2>/dev/null | sort
```

For each relevant test, record covered flows, selectors, routes, assertions, fixtures, skipped tests, and obvious flake patterns.

### 3. Compare Against The Current App

Check for:

- Stale selectors or route paths.
- Missing critical flows.
- Hardcoded waits or timing-sensitive assertions.
- Tests with weak assertions.
- Duplicate coverage.
- Test files that no longer match current product behavior.

If the user confirms the app/test environment is available, run the suite and record pass/fail/skipped counts.

### 4. Write The Epic Audit

Write the audit beside the browser-test epic:

```text
docs/epics/NNN-<browser-test-slug>-audit.md
```

If there is no browser-test epic yet, create one with `plan-browser-tests` or write a provisional audit filename such as `docs/epics/browser-test-coverage-audit.md` and recommend creating the epic.

Use this structure:

```markdown
# Browser Test Audit: <epic or app name>

## Summary

| Metric | Count |
| --- | --- |
| Test files found | <n> |
| Flows covered | <n> |
| Broken/stale flows | <n> |
| Missing critical flows | <n> |
| Flaky patterns | <n> |

Suite status: <passed/failed/not run>

## Findings

### <finding title>

- **Type:** stale-test / missing-coverage / flaky-pattern / quality-issue / duplicate-coverage
- **Severity:** critical / high / moderate / low
- **Evidence:** <test file, selector, route, or source reference>
- **Recommended child feature:** <feature name>

## Recommended Epic Updates

- Add child feature: <name> - <reason>
- Update flow inventory: <flow> - <status>
```

### 5. Update The Browser-Test Epic

When an epic exists, update it conservatively:

- Mark covered flows as covered in the `Flow Inventory`.
- Add missing or broken flow clusters as child feature candidates.
- Preserve existing child feature checkboxes and notes.
- Do not create feature plans unless the user asks.

## Final Response

Report:

- Audit report path.
- Browser-test epic path updated or recommended.
- Test files found and suite status.
- Top missing/broken flows.
- Recommended next step: `plan-feature` for the highest-priority child feature, `add-browser-test` for a planned feature, or `fix-browser-test` for a named broken test.
