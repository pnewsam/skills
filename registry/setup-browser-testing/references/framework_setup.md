# Browser framework setup

## Contents

- Framework selection
- Package installation
- Playwright baseline
- Cypress baseline
- Authentication
- Smoke tests

## Framework selection

Preserve an existing framework. When neither Playwright nor Cypress is present,
prefer Playwright unless repository instructions say otherwise.

Detect the package manager from the lockfile and use its normal development
dependency command. Never mix package managers.

## Package installation

Use the repository package manager's equivalent of:

```bash
npm install --save-dev @playwright/test
npx playwright install chromium
```

or:

```bash
npm install --save-dev cypress
npx cypress install
```

Install only the browsers needed by the initial project. CI may use
`playwright install --with-deps chromium`.

## Playwright baseline

Create or extend `playwright.config.ts`. Preserve existing reporters, projects,
timeouts, and web-server behavior.

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: '<verified-base-url>',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: '<verified-dev-command>',
    url: '<verified-base-url>',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

Infer the command and URL from repository configuration. Do not assume port
3000 when the project specifies another port.

Use:

```text
tests/
  helpers/
  smoke.spec.ts
```

Add `tests/.auth/` only when using stored authenticated browser state, and add
that directory to the repository ignore file without disturbing existing
entries.

## Cypress baseline

Create or extend `cypress.config.ts`:

```typescript
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: '<verified-base-url>',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    screenshotOnRunFailure: true,
  },
});
```

Use:

```text
cypress/
  e2e/
  fixtures/
  support/
```

Preserve existing component-test configuration and plugins.

## Authentication

Do not generate a generic login helper from guessed labels, routes, redirects,
or environment-variable names.

When authentication is required:

1. Read the real login route, form, and existing test-data facilities.
2. Prefer a repository-supported API/session fixture over repeated UI login.
3. Read credentials only from documented environment variables or secret
   stores.
4. Store browser state only in an ignored path.
5. Add a setup project or reusable command that reflects the actual app.
6. If the required contract is unknown, leave a documented auth boundary and
   report the missing inputs instead of creating a helper that cannot work.

## Smoke tests

Start with one deterministic assertion that proves the app and framework can
communicate. Choose a route and assertion that exist in the repository.

Playwright shape:

```typescript
import { test, expect } from '@playwright/test';

test('application shell loads', async ({ page }) => {
  const response = await page.goto('<verified-route>');
  expect(response?.ok()).toBe(true);
  await expect(page.getByRole('<verified-role>', { name: '<verified-name>' })).toBeVisible();
});
```

Cypress shape:

```typescript
describe('application smoke test', () => {
  it('loads the application shell', () => {
    cy.visit('<verified-route>');
    cy.findByRole('<verified-role>', { name: '<verified-name>' }).should('be.visible');
  });
});
```

Do not leave angle-bracket placeholders in created project files.
