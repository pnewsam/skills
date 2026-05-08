---
name: fix-browser-test
description: repair a broken, failing, or flaky browser test. use when a test that was passing has started failing, when a test is marked as broken in the browser test plan, or when asked to fix a flaky test. reads the failure, identifies the root cause by comparing the test against recent app changes, applies a targeted fix, and re-runs to confirm the test passes.
---

# Fix Browser Test

## Overview

Diagnose and repair a single broken or flaky browser test. Works from a test file path, a failure output, or a `[~]` entry in `docs/tmp/browser-test-plan.md`.

Each invocation fixes one test file. If multiple tests are broken, run the skill once per file.

## Safety rules

- Only modify test files, test helpers, and `data-testid` attributes in application source. Do not change application logic or behavior.
- If a test is failing because the application behavior genuinely changed (not just the selector or flow path), flag this to the user before modifying the test. A test may be doing its job by catching a regression.
- Do not change a test's intended assertions to make it pass — fix the test to correctly target what it was originally verifying.
- Always re-run the test after applying a fix. Do not report success without a passing run.
- If the root cause cannot be determined, document what was found and stop rather than making speculative changes.

## Distinguishing a broken test from a caught regression

Before touching the test, determine which situation this is:

- **The app changed intentionally** (refactor, redesign, renamed component) → fix the test to match the new reality
- **The app changed unintentionally** (a regression broke the flow) → do not fix the test; report the regression to the user
- **The test was always fragile** (hardcoded waits, order-dependent, flaky selector) → fix the structural issue
- **The test environment changed** (base URL, auth setup, test data) → fix the configuration, not the test logic

If unsure, err toward reporting and asking rather than silently updating assertions.

## Workflow

### 1. Identify the failing test

**If the user provides a file path:** use that directly.

**If the user points to the plan:** read `docs/tmp/browser-test-plan.md` and find entries marked `[~]`. Pick the first one or the one the user specifies.

**If no specific test is named:** run the full suite to find failures:

_Playwright:_
```bash
npx playwright test --reporter=line
```

_Cypress:_
```bash
npx cypress run
```

Pick one failing test to focus on. Do not attempt to fix all failures in a single invocation.

### 2. Run the failing test in isolation

Get the exact, current failure output:

_Playwright:_
```bash
npx playwright test <path-to-test-file> --reporter=line
```

_Cypress:_
```bash
npx cypress run --spec <path-to-test-file>
```

Read the full error carefully. Note:
- The exact error message
- The line number in the test where it failed
- The selector or action that failed
- Any screenshot or trace paths (Playwright generates these on failure)

For Playwright, check for a trace file:
```bash
npx playwright show-trace test-results/<trace-file>.zip
```

### 3. Read the test file

Read the full test file. Understand:
- What flow it is testing
- What the failing step is trying to do
- What selector or assertion is failing
- What the test expects to find

### 4. Identify what changed in the application

Check recent git history for changes to files relevant to this flow:

```bash
git log --oneline -20
git diff HEAD~5..HEAD -- src/ app/ pages/
```

For a targeted search, look for changes to the specific component or route the test covers:

```bash
git log --oneline -- <path-to-component>
git diff HEAD~5..HEAD -- <path-to-component>
```

Also search for the failing selector in the current application source to see if it still exists:

```bash
grep -r "data-testid=\"<value>\"" src/ app/ pages/ --include="*.tsx" --include="*.jsx" --include="*.html"
grep -r "<route-path>" src/ app/ pages/ --include="*.tsx" --include="*.ts"
```

### 5. Diagnose the root cause

Match the failure to a root cause category:

#### Stale selector
The element exists but has a different `data-testid`, label, role, or text than the test expects.

_Fix:_ Update the selector in the test to match the current source. Prefer `data-testid` or ARIA role/label over CSS classes or positional selectors.

#### Removed or renamed element
The element the test targets no longer exists in the UI.

_Fix:_ Identify the replacement element or flow. If the feature was removed entirely, flag the test for deletion rather than repair.

#### Changed route or URL
The page the test navigates to has moved.

_Fix:_ Update the URL in `goto()` or `cy.visit()`. Verify the new route exists in the routing config.

#### Changed flow steps
New steps were added to the flow (e.g. an extra confirmation dialog, a new required field, or an additional redirect).

_Fix:_ Add the missing steps to the test. Review the current UI to understand the full flow end-to-end before writing the fix.

#### Timing / flakiness
The test assumes an element is present before it appears, or asserts on content that loads asynchronously.

_Fix:_
- **Playwright:** Replace hardcoded `page.waitForTimeout()` with `await expect(locator).toBeVisible()` or `page.waitForSelector()`. Use `waitForLoadState('networkidle')` only when necessary.
- **Cypress:** Remove `cy.wait(<ms>)` and replace with `cy.get(...).should('be.visible')` or `cy.intercept()` + `cy.wait('@alias')` for network-dependent content.

#### Auth or session state
The test requires authentication but the session is not being set up correctly, or the session setup itself is failing.

_Fix:_ Check the auth setup (`storageState` for Playwright, `cy.session()` or `cy.login()` for Cypress). Re-run the auth setup step and verify it produces a valid session.

#### Environment or configuration
The base URL, environment variable, or test database state is wrong.

_Fix:_ Check `playwright.config.ts` or `cypress.config.ts` for the base URL. Verify the dev server is running on the expected port. Check for missing environment variables in `.env.test` or equivalent.

### 6. Apply the fix

Make the minimal change needed to fix the root cause. Do not refactor surrounding test code unless it is directly contributing to the failure.

If the fix requires adding a `data-testid` attribute to application source:
- Add only the specific attribute(s) needed
- Keep the attribute name consistent with the project's naming convention
- Note the change in the final response

### 7. Re-run the test

```bash
npx playwright test <path-to-test-file> --reporter=line
# or
npx cypress run --spec <path-to-test-file>
```

The test must pass before proceeding. If it still fails after the fix, re-diagnose before making further changes.

If the test passes, also run a broader set of related tests to confirm the fix did not break anything adjacent:

```bash
# Run the directory containing the fixed test
npx playwright test tests/<directory>/ --reporter=line
```

### 8. Update the plan

If `docs/tmp/browser-test-plan.md` exists and the flow was marked `[~]` (broken):
- Change `[~]` to `[x]` once the test passes
- Add a note with the fix summary

### 9. Final response

Report:
- Test file that was fixed
- Root cause category
- What changed in the test (and in app source if `data-testid` was added)
- Test run result after the fix
- Whether any related tests were checked
- If the failure indicated a regression rather than a stale test, clearly state that and describe what behavior changed

## Handling common situations

### Test failure indicates a real regression

If the failing step reveals that the application is not behaving as it should (the flow is genuinely broken for users), do not update the test. Instead:

1. Note the regression clearly in the final response
2. Describe what the expected behavior was and what is happening instead
3. Suggest opening a bug fix PR rather than silently updating the test

### Test should be deleted, not fixed

If the feature being tested has been removed from the application:
1. Confirm this with the user before deleting
2. If confirmed, delete the test file
3. Mark the flow as `[x]` in the plan with a note that the feature was removed

### Multiple cascading failures from one root cause

If many tests fail because of a single shared change (e.g. a renamed `data-testid` on a layout component used everywhere), fix the root cause once (update the shared component, helper, or page object) rather than editing every test individually.

### Flaky test that passes sometimes

Flaky tests are harder to diagnose because the failure is not deterministic. Approach:
1. Run the test 3–5 times to observe the pattern
2. Look for timing-dependent assertions, shared state, or network-dependent content
3. Apply the structural fix (proper waits, isolated state, network interception)
4. Run 3–5 times again to confirm stability
