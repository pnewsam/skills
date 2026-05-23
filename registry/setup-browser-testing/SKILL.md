---
name: setup-browser-testing
description: set up the browser testing facility for a project. installs and configures Playwright (or Cypress if already present), creates directory scaffold, auth helpers, CI workflow with scheduled runs, and a conventions README. use when a project has no browser tests yet, when onboarding a new project to browser testing, or when the testing facility needs to be initialized before running plan-browser-tests or add-browser-test.
---

# Setup Browser Testing

## Overview

Initialize the complete browser testing facility for a project. This skill handles framework installation, configuration, directory scaffolding, authentication helpers, CI integration with scheduled runs, and documentation — everything needed so that `plan-browser-tests` and `add-browser-test` can operate.

Run this once per project. It is idempotent: re-running will fill in missing pieces without overwriting existing work.

## Safety rules

- Do not modify application source code. Only create or modify test infrastructure files.
- Do not overwrite existing config files without asking. If `playwright.config.ts` or `cypress.config.ts` already exists, read it first and offer to extend rather than replace.
- Do not install packages globally. Always use the project's package manager.
- Do not commit secrets or credentials to the CI workflow file. Use GitHub Secrets references.
- If the project has no `package.json`, stop and inform the user — browser testing requires a Node.js project.

## Prerequisites

Verify the project is a Node.js project:

```bash
cat package.json
```

If `package.json` does not exist, stop. This skill requires a Node.js project.

## Workflow

### 1. Detect the project setup

Read the project configuration to understand the stack:

```bash
cat package.json
```

Note:
- **Package manager**: `npm`, `yarn`, `pnpm`, or `bun` (check for `yarn.lock`, `pnpm-lock.yaml`, `bun.lockb`)
- **Framework**: React, Next.js, Vue, Svelte, Angular, or plain HTML/JS
- **Dev server command**: check `scripts.dev` or `scripts.start` in `package.json`
- **Default port**: infer from framework (Next.js: 3000, Create React App: 3000, Vite: 5173, Angular: 4200)

Check for an existing browser test framework:

```bash
ls playwright.config.* cypress.config.* 2>/dev/null
cat package.json | grep -E "playwright|cypress|@playwright"
```

Decision:
- If **Playwright** is already in `package.json` or `playwright.config.*` exists → use Playwright
- If **Cypress** is already in `package.json` or `cypress.config.*` exists → use Cypress
- If **neither** is present → use Playwright (recommended default)

### 2. Install the framework

#### Playwright

Use the detected package manager:

```bash
# npm
npm init playwright@latest -- --no-install --quiet -- --typescript --tests=tests --github

# yarn
yarn create playwright --no-install --typescript --tests=tests --github

# pnpm
pnpm create playwright --no-install --typescript --tests=tests --github

# If the init command fails, install manually:
npm install --save-dev @playwright/test
npx playwright install
```

If the `npm init playwright` wizard creates unwanted files, clean up and install manually:

```bash
npm install --save-dev @playwright/test
npx playwright install --with-deps chromium
```

Verify installation:

```bash
npx playwright --version
```

#### Cypress

```bash
npm install --save-dev cypress
npx cypress install
```

Verify installation:

```bash
npx cypress --version
```

### 3. Create the framework configuration

#### Playwright config

If `playwright.config.ts` does not exist, create it. If it exists, read it and only add missing sections.

Minimal config template:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],
  use: {
    baseURL: '<inferred-base-url>',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    // Auth setup (if the app has authentication)
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // storageState: 'tests/.auth/user.json', // depends on setup project
      },
      // dependencies: ['setup'], // depends on setup project
    },
  ],
  webServer: {
    command: '<dev-server-command>',
    url: '<inferred-base-url>',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
```

**baseURL**: Infer from the framework and port. Read `next.config.*`, `vite.config.*`, or `package.json` scripts. Default to `http://localhost:3000`.

**webServer.command**: Use the dev command from `package.json` scripts. If multiple exist, prefer `dev` over `start`.

**Authentication projects**: Only add the `setup` project and `storageState` if the application has authentication (detected by searching for login/signin routes, auth hooks, or auth middleware in Step 4).

#### Cypress config

If `cypress.config.ts` does not exist, create it:

```typescript
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: '<inferred-base-url>',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    video: false,
    screenshotOnRunFailure: true,
  },
});
```

### 4. Detect authentication requirements

Check if the application has authentication:

```bash
grep -r -l "useAuth\|isAuthenticated\|requireAuth\|ProtectedRoute\|withAuth\|middleware\|login\|Login\|signin\|SignIn\|sign-in" src/ app/ pages/ --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" | head -10
```

Also check for auth-related routes:

```bash
grep -r -l "login\|signin\|sign-in\|auth" pages/ app/ src/pages/ src/app/ --include="*.tsx" --include="*.jsx" 2>/dev/null | head -10
```

If auth is detected, create authentication helpers.

### 5. Create directory scaffold

#### Playwright

```bash
mkdir -p tests/helpers tests/.auth
```

Create `tests/.auth/.gitkeep`:

```bash
touch tests/.auth/.gitkeep
```

Add `.auth/` to `.gitignore` to prevent committing auth state:

```bash
grep -q "tests/.auth" .gitignore 2>/dev/null || echo "tests/.auth/" >> .gitignore
```

#### Cypress

```bash
mkdir -p cypress/e2e cypress/support cypress/fixtures
```

### 6. Create authentication helpers

Only if auth was detected in Step 4.

#### Playwright auth setup

Create `tests/auth.setup.ts`:

```typescript
import { test as setup } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '.auth/user.json');

setup('authenticate', async ({ page }) => {
  // Navigate to login
  await page.goto('/login');

  // Fill credentials from environment variables
  await page.getByLabel(/email/i).fill(process.env.TEST_EMAIL || '');
  await page.getByLabel(/password/i).fill(process.env.TEST_PASSWORD || '');
  await page.getByRole('button', { name: /sign in|log in|login/i }).click();

  // Wait for post-login redirect
  await page.waitForURL('**/dashboard', { timeout: 10000 }).catch(() => {
    // If /dashboard doesn't exist, wait for any non-login URL
    page.waitForURL((url) => !url.pathname.includes('login'), { timeout: 10000 });
  });

  // Save auth state
  await page.context().storageState({ path: authFile });
});
```

Update `playwright.config.ts` to reference this setup if it wasn't already configured in Step 3.

Create a `tests/helpers/auth.ts` helper:

```typescript
import { Page } from '@playwright/test';

export async function loginAsUser(page: Page) {
  // For tests that need to log in programmatically.
  // Prefer storageState via the setup project for most tests.
  await page.goto('/login');
  await page.getByLabel(/email/i).fill(process.env.TEST_EMAIL || '');
  await page.getByLabel(/password/i).fill(process.env.TEST_PASSWORD || '');
  await page.getByRole('button', { name: /sign in|log in/i }).click();
  await page.waitForURL((url) => !url.pathname.includes('login'));
}
```

#### Cypress auth commands

Create or extend `cypress/support/commands.ts`:

```typescript
Cypress.Commands.add('login', (email?: string, password?: string) => {
  const userEmail = email || Cypress.env('TEST_EMAIL');
  const userPassword = password || Cypress.env('TEST_PASSWORD');

  cy.session([userEmail, userPassword], () => {
    cy.visit('/login');
    cy.get('[data-testid="email-input"], input[name="email"]').type(userEmail || '');
    cy.get('[data-testid="password-input"], input[name="password"]').type(userPassword || '');
    cy.get('[data-testid="login-button"], button[type="submit"]').click();
    cy.url().should('not.include', '/login');
  });
});

// Type declaration
declare global {
  namespace Cypress {
    interface Chainable {
      login(email?: string, password?: string): Chainable<void>;
    }
  }
}
```

Create or extend `cypress/support/e2e.ts`:

```typescript
import './commands';
```

### 7. Create the CI workflow

#### GitHub Actions with scheduled runs

Create `.github/workflows/browser-tests.yml`:

```yaml
name: Browser Tests

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]
  schedule:
    # Run every 4 hours during business days (Mon-Fri)
    - cron: '0 */4 * * 1-5'
  workflow_dispatch:  # Allow manual trigger

jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 30

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: '<package-manager>'

      - name: Install dependencies
        run: <install-command>

      - name: Install <framework> browsers
        run: npx playwright install --with-deps chromium

      - name: Run browser tests
        run: npx playwright test
        env:
          TEST_EMAIL: ${{ secrets.TEST_EMAIL }}
          TEST_PASSWORD: ${{ secrets.TEST_PASSWORD }}

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: test-results
          path: |
            test-results/
            playwright-report/
          retention-days: 7
```

Tailor `<package-manager>`, `<install-command>`, and `<framework>` to the detected project setup.

For the scheduled run, add a separate job or condition so it can notify on failure:

```yaml
  notify:
    needs: test
    if: failure() && github.event_name == 'schedule'
    runs-on: ubuntu-latest
    steps:
      - name: Notify on scheduled failure
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "Scheduled browser tests failed on ${{ github.repository }}: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}"
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

### 8. Create a smoke test

Create `tests/smoke.spec.ts` (Playwright) or `cypress/e2e/smoke.cy.ts` (Cypress) with a basic page-load test:

**Playwright:**

```typescript
import { test, expect } from '@playwright/test';

test.describe('Smoke', () => {
  test('home page loads', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.ok()).toBeTruthy();
  });
});
```

**Cypress:**

```typescript
describe('Smoke', () => {
  it('home page loads', () => {
    cy.visit('/');
    cy.get('body').should('be.visible');
  });
});
```

### 9. Write the test conventions README

Create `tests/README.md`:

```markdown
# Browser Tests

## Framework

<Playwright | Cypress>

## Directory structure

- `tests/` — all test files (`.spec.ts`)
- `tests/helpers/` — shared test utilities and page objects
- `tests/.auth/` — auth state files (gitignored)
- `tests/smoke.spec.ts` — basic page-load smoke tests

## Running tests

\`\`\`bash
# All tests
npx playwright test

# Single file
npx playwright test tests/smoke.spec.ts

# Debug mode (headed browser)
npx playwright test --debug

# UI mode
npx playwright test --ui
\`\`\`

## Conventions

- Use `data-testid` attributes for stable selectors. Fall back to ARIA roles and labels.
- Each test file covers one user flow. One describe block per flow, one test per scenario.
- Use the auth setup project (`tests/auth.setup.ts`) for authenticated tests — do not repeat login steps.
- Seed test data explicitly in `beforeEach`. Do not depend on database state from other tests.
- Tests must be independent and runnable in any order.

## CI

Tests run on every push and PR to main, and on a schedule (every 4 hours, Mon-Fri).
See `.github/workflows/browser-tests.yml`.

## Adding new tests

1. Run `plan-browser-tests` to identify critical flows.
2. Run `add-browser-test` to implement one flow at a time.
3. Run `validate-changes` after making changes to verify nothing broke.
```

### 10. Verify the setup

Run the smoke test to confirm everything works:

**Playwright:**

```bash
npx playwright test tests/smoke.spec.ts --reporter=line
```

**Cypress:**

```bash
npx cypress run --spec cypress/e2e/smoke.cy.ts
```

If the dev server is not running, note the start command and tell the user to start it first.

If the smoke test passes, the facility is ready.

### 11. Final response

Report:
- Framework installed and version
- Files created:
  - Config: `playwright.config.ts` or `cypress.config.ts`
  - Auth setup: `tests/auth.setup.ts` (if auth detected)
  - Auth helpers: `tests/helpers/auth.ts` (if auth detected)
  - CI workflow: `.github/workflows/browser-tests.yml`
  - Smoke test: `tests/smoke.spec.ts`
  - Conventions: `tests/README.md`
- CI schedule configured (e.g., every 4 hours Mon-Fri)
- Environment variables needed in GitHub Secrets: `TEST_EMAIL`, `TEST_PASSWORD` (and `SLACK_WEBHOOK_URL` for failure notifications)
- Next step: run `plan-browser-tests` to identify critical flows, then `add-browser-test` to implement them

## Handling common situations

### Playwright init wizard fails or is blocked

Install manually:

```bash
npm install --save-dev @playwright/test
npx playwright install chromium
```

Then write `playwright.config.ts` by hand using the template in Step 3.

### Project uses a non-standard dev server

Read `package.json` scripts, `Makefile`, `docker-compose.yml`, or any dev tooling config. Ask the user for the correct dev server command if it's not obvious.

### Project already has some test infrastructure

If config files exist, read them first. Only add what's missing (smoke test, CI workflow, auth helpers, README). Do not overwrite existing configuration.

For CI: if a workflow file already exists, check if it includes browser tests. If not, offer to add a browser test job to the existing workflow.

### Monorepo

Check for multiple `package.json` files or a workspace config. Ask the user which package/app to set up browser testing for. Use the relevant package's directory and dev server command.

### No authentication detected

Skip Step 6 (auth helpers) and the `setup` project in the Playwright config. Note in the final response that auth helpers were skipped and can be added later if needed.