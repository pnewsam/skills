---
name: add-browser-test
description: implement one browser integration test from the plan produced by plan-browser-tests. use when asked to add a browser test, add an integration test, add an e2e test, or implement the next test from the plan. reads docs/tmp/browser-test-plan.md, picks the next unchecked flow, writes the test file, runs it to verify it passes, and marks the flow as complete in the plan.
---

# Add Browser Test

## Overview

Implement one browser integration test from the plan at `docs/tmp/browser-test-plan.md`. Each invocation picks the next unchecked flow, writes a well-structured test file, runs it to confirm it passes, and marks the flow as done in the plan.

Run this skill repeatedly — once per flow — until all flows are checked off.

## Safety rules

- Do not modify application source code. Only write or modify test files and test configuration.
- Do not mark a flow as complete (`[x]`) until the test actually passes.
- If the test cannot be made to pass in this session, leave the flow unchecked and explain what is blocking it.
- Do not batch multiple flows into one invocation unless the user explicitly asks.
- Always run the test after writing it. Do not ship an untested test.

## Prerequisites

Before writing any test, verify the framework is installed and configured.

### Playwright

```bash
npx playwright --version
ls playwright.config.*
```

If not installed:

```bash
npm init playwright@latest
```

Accept the defaults (TypeScript, `tests/` directory, GitHub Actions optional). Commit the generated config before proceeding.

### Cypress

```bash
npx cypress --version
ls cypress.config.*
```

If not installed:

```bash
npm install --save-dev cypress
npx cypress open
```

Complete the initial setup wizard, then close the GUI. Commit the generated config before proceeding.

## Workflow

### 1. Read the plan

```bash
cat docs/tmp/browser-test-plan.md
```

If the file does not exist, stop and tell the user to run `plan-browser-tests` first.

### 2. Select the next flow

Find the first unchecked flow (`- [ ]`). Read its:
- Flow name
- Why critical
- Preconditions
- Steps
- Expected outcome
- Suggested file name

If all flows are checked, tell the user the plan is complete and stop.

If the user specifies a particular flow by name or number, use that instead.

### 3. Understand the relevant application code

Before writing the test, read the source files relevant to this flow:

- The page/route component(s) involved
- Any form components, auth hooks, or API calls in the flow
- Existing test utilities, fixtures, or helpers in the test directory
- The framework config file (`playwright.config.ts` or `cypress.config.ts`) for the base URL

This ensures the test uses the correct selectors, routes, and data.

Look for accessible selectors in priority order:
1. `data-testid` or `data-cy` attributes (best)
2. ARIA roles and labels (`getByRole`, `getByLabel`)
3. Text content (`getByText`) for stable, user-visible strings
4. CSS classes or IDs only as a last resort (fragile)

If no `data-testid` attributes exist, add the minimum necessary ones to the application source as part of this task. Keep additions minimal and targeted.

### 4. Write the test file

Create the test file at the path specified in the plan (or a sensible equivalent). Follow the conventions below for the detected framework.

#### Playwright conventions

```typescript
import { test, expect } from '@playwright/test';

test.describe('<Flow name>', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the starting point
    await page.goto('/');
  });

  test('<what the user accomplishes>', async ({ page }) => {
    // Step-by-step, matching the plan
    await page.getByRole('link', { name: 'Sign in' }).click();
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('password');
    await page.getByRole('button', { name: 'Sign in' }).click();

    // Assert the expected outcome
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });
});
```

- Use `@playwright/test` imports, not the global `test`
- Prefer `getByRole`, `getByLabel`, `getByText`, and `getByTestId` over CSS selectors
- Use `await expect(...).toBeVisible()`, `.toHaveText()`, `.toHaveURL()` for assertions
- Keep each test to one logical flow — no branching logic inside a test
- Use `test.beforeEach` for shared setup within a describe block
- Store reusable helpers in `tests/helpers/` or `tests/fixtures/`

#### Cypress conventions

```typescript
describe('<Flow name>', () => {
  beforeEach(() => {
    // Navigate to the starting point
    cy.visit('/');
  });

  it('<what the user accomplishes>', () => {
    // Step-by-step, matching the plan
    cy.get('[data-testid="sign-in-link"]').click();
    cy.get('[data-testid="email-input"]').type('user@example.com');
    cy.get('[data-testid="password-input"]').type('password');
    cy.get('[data-testid="sign-in-button"]').click();

    // Assert the expected outcome
    cy.get('[data-testid="dashboard-heading"]').should('be.visible');
    cy.url().should('include', '/dashboard');
  });
});
```

- Prefer `data-testid` or `data-cy` attributes for selectors
- Use `cy.contains()` for text-based assertions
- Use `beforeEach` for navigation and shared setup
- Store reusable commands in `cypress/support/commands.ts`

#### Handling authentication in tests

For flows that require a logged-in user, avoid repeating the login UI steps in every test. Instead:

**Playwright:** Use `storageState` to save and restore authentication:

```typescript
// tests/auth.setup.ts
import { test as setup } from '@playwright/test';

setup('authenticate', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill(process.env.TEST_EMAIL!);
  await page.getByLabel('Password').fill(process.env.TEST_PASSWORD!);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL('/dashboard');
  await page.context().storageState({ path: 'tests/.auth/user.json' });
});
```

Reference it in `playwright.config.ts` as a project dependency.

**Cypress:** Use `cy.session()` or a custom `cy.login()` command in `cypress/support/commands.ts` that calls the API directly (faster than UI login):

```typescript
Cypress.Commands.add('login', (email, password) => {
  cy.session([email, password], () => {
    cy.request('POST', '/api/auth/login', { email, password })
      .its('body.token')
      .then((token) => cy.setCookie('auth_token', token));
  });
});
```

### 5. Run the test

Run only the newly written test file to verify it passes:

**Playwright:**
```bash
npx playwright test <path-to-test-file> --reporter=line
```

**Cypress:**
```bash
npx cypress run --spec <path-to-test-file>
```

#### If the test fails

Read the error output carefully. Common causes and fixes:

- **Selector not found** — the element may have a different selector than expected; read the component source and adjust
- **Timing issue** — add an explicit wait or use a framework-provided auto-waiting assertion
- **Auth state missing** — ensure the preconditions in the plan are met (e.g. auth setup step runs first)
- **Base URL wrong** — check `playwright.config.ts` or `cypress.config.ts`
- **App not running** — the test environment requires the dev server; note this and provide the start command

If the test cannot be made to pass, do not mark it complete. Document the blocker in the plan file under the flow's entry.

### 6. Mark the flow as complete

Once the test passes, update the plan file:

Change `- [ ] <flow name>` to `- [x] <flow name>` for the completed flow.

Also append the actual file path if it differed from the plan's suggestion.

### 7. Final response

Report:
- Which flow was implemented
- The test file path
- The test run result (pass, number of assertions)
- Any `data-testid` attributes added to application source
- How many flows remain in the plan
- The name of the next unchecked flow (so the user knows what to run next)

## Writing good tests: principles

**Test behavior, not implementation.** Assert what the user sees and experiences, not internal state or component structure.

**One flow per test.** A test that covers login *and* profile editing is two tests. Keep them separate.

**Stable selectors.** `data-testid` and ARIA roles don't break when you refactor CSS or rename classes. Invest in them.

**Minimal setup.** Only put in `beforeEach` what is genuinely shared. Test isolation is more important than DRY.

**Descriptive names.** `it('shows an error when login fails with wrong password')` is better than `it('handles error state')`.

**No conditional logic.** If you find yourself writing `if` inside a test, split it into two tests.

## Handling common situations

### The app requires a running dev server

Note the start command in the final response. For Playwright, add a `webServer` entry to `playwright.config.ts`:

```typescript
webServer: {
  command: 'npm run dev',
  url: 'http://localhost:3000',
  reuseExistingServer: !process.env.CI,
},
```

For Cypress, add to `cypress.config.ts`:

```typescript
baseUrl: 'http://localhost:3000',
```

And document that `npm run dev` must be running before `cypress run`.

### The flow requires test data (e.g. a seeded database)

Note the dependency in the test file as a comment and in the final response. Do not invent test credentials or assume database state — ask the user how test data is managed in this project (fixtures, seeds, mocks, or a test database).

### The flow cannot be tested without mocking external services

Use the framework's network interception to stub external calls:

**Playwright:** `page.route('**/api/payments/**', route => route.fulfill({ json: { status: 'ok' } }))`

**Cypress:** `cy.intercept('POST', '/api/payments/**', { statusCode: 200, body: { status: 'ok' } })`

Document the mock clearly in a comment so future maintainers understand the stub.

### A flow is already covered by an existing test

Note this, skip to the next unchecked flow, and mark the already-covered flow as `[x]` with a note pointing to the existing test file.
