---
name: fix-browser-test
description: repair a broken, failing, or flaky browser test. use when a test that was passing has started failing, when a browser-test feature identifies a broken test, or when asked to fix a flaky Playwright/Cypress test. updates standard docs/features plans when applicable.
---

# Fix Browser Test

## Overview

Diagnose and repair one broken or flaky browser test. Work from a test file path, failure output, or a browser-test feature plan in `docs/features/`. Do not use or update separate browser-test trackers.

Each invocation fixes one test file or one tightly related failure cluster.

## Safety Rules

- Only modify test files, test helpers, test config, and minimal selector attributes in application source.
- Do not change application behavior to make a test pass.
- If the test reveals a real regression, report it instead of weakening the test.
- Always re-run the fixed test.

## Workflow

### 1. Identify The Failing Test

Use the supplied file path, failure output, or selected `docs/features/` browser-test feature. If no specific failure is named, run the browser-test suite and pick one failing file:

```bash
npx playwright test --reporter=line
npx cypress run
```

### 2. Reproduce In Isolation

Run the failing test file directly and capture the exact failure:

```bash
npx playwright test <path-to-test-file> --reporter=line
npx cypress run --spec <path-to-test-file>
```

Read the full test file and the relevant application route/component.

### 3. Diagnose Root Cause

Classify the failure:

- Stale selector.
- Removed or renamed UI element.
- Changed route.
- Changed flow steps.
- Timing/flakiness.
- Auth/session/test-data setup.
- Environment/configuration issue.
- Real application regression.

If it is a real regression, stop and report the user-facing behavior that changed.

### 4. Apply The Minimal Test Fix

Fix the test or test support code while preserving the intended assertion. Prefer resilient selectors: role/name, label, stable text, then test IDs. Add a minimal selector attribute only when needed.

Do not refactor unrelated tests.

### 5. Verify

Run the fixed test in isolation. If practical, run the related test directory afterward.

### 6. Update Feature Plan

If a `docs/features/` browser-test feature tracks this broken test:

- Mark the relevant criterion/task complete only after the test passes.
- Add the test file and verification command.
- Leave unrelated child features unchanged.

Do not update any separate browser-test tracker outside the feature plan.

## Final Response

Report:

- Test file fixed.
- Root cause category.
- What changed.
- Verification command and result.
- Whether the failure was a test issue or an application regression.
