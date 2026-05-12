---
name: plan-browser-tests
description: analyze an application to identify its most critical user flows and produce a prioritized browser test plan. use when asked to plan integration tests, plan browser tests, plan e2e tests, or identify which flows need automated testing. explores the UI, routes, and application logic to find the highest-value flows, then writes a structured plan to docs/tmp/browser-test-plan.md for use by the add-browser-test skill.
---

# Plan Browser Tests

## Overview

Analyze an application's UI, routes, and business logic to identify the most critical user flows, then produce a prioritized test plan that the `add-browser-test` skill can execute one test at a time.

This skill is read-only with respect to source code. It writes only the plan file.

## What makes a flow "critical"

Focus on flows that meet one or more of these criteria:

- **High traffic** — accessed by most users on every session (login, home, primary navigation)
- **Business-critical** — directly tied to the core value proposition (checkout, signup, core feature activation)
- **High risk of regression** — complex multi-step flows, flows with many conditionals, or areas with a history of bugs
- **Data integrity** — flows that create, update, or delete persistent data
- **Access control** — flows that enforce authentication or authorization boundaries
- **Error recovery** — flows where failure has a visible, user-facing impact

Avoid testing purely cosmetic UI, static content, or flows covered well by existing unit tests.

## Safety rules

- Do not run the application, install packages, or modify source files.
- Do not write test code during planning — the plan describes flows in plain English.
- Write the plan file only after the full analysis is complete.
- If `docs/tmp/browser-test-plan.md` already exists, read it first. Offer to extend it rather than overwriting it, unless the user asks for a full refresh.

## Detecting the test framework

Check for an existing browser test framework before recommending one:

```bash
# Check package.json for existing test dependencies
cat package.json
```

Look for: `cypress`, `@cypress/`, `playwright`, `@playwright/test`, `puppeteer`, `testcafe`.

- If **Playwright** is present: plan for Playwright (`@playwright/test`, TypeScript, `.spec.ts` files in `tests/` or `e2e/`)
- If **Cypress** is present: plan for Cypress (`.cy.ts` or `.cy.js` files in `cypress/e2e/`)
- If **neither** is present: recommend Playwright. Note the setup command in the plan and proceed with Playwright conventions.

Record the detected or recommended framework in the plan file header.

## Workflow

### 1. Understand the application type and stack

Read the following to understand what kind of app this is:

```bash
cat package.json          # scripts, dependencies, framework
ls src/ app/ pages/       # routing structure (Next.js, React Router, etc.)
```

Also check for:
- `next.config.*` — Next.js app
- `vite.config.*` — Vite-based SPA
- `angular.json` — Angular app
- `nuxt.config.*` — Nuxt app
- `routes/`, `app/routes/` — Remix or React Router
- Backend route files if the app is server-rendered

Note the framework and routing convention — it affects how flows are discovered.

### 2. Discover all routes and entry points

List every navigable route or page in the application:

**For file-based routing (Next.js, Nuxt, Remix):**
```bash
find pages/ app/ src/pages/ src/app/ -name "*.tsx" -o -name "*.jsx" -o -name "*.vue" | sort
```

**For React Router / client-side routing:**
Search for route definitions:
```bash
grep -r "path=" src/ --include="*.tsx" --include="*.jsx" -l
grep -r "<Route" src/ --include="*.tsx" --include="*.jsx" -n
```

**For backend-rendered apps:**
```bash
grep -r "router\." routes/ src/ --include="*.ts" --include="*.js" -n
grep -r "app\.get\|app\.post\|app\.put\|app\.delete" src/ routes/ -n
```

Build a complete list of routes before moving on.

### 3. Identify UI components and interaction patterns

Scan for interactive UI elements to understand what users can actually do:

```bash
grep -r "onClick\|onSubmit\|onChange\|handleSubmit" src/ --include="*.tsx" --include="*.jsx" -l
grep -r "<form\|<Form\|<button\|<Button\|<input\|<Input" src/ --include="*.tsx" --include="*.jsx" -l
```

Look for:
- Forms (login, signup, checkout, search, settings, data entry)
- Modals and dialogs
- Multi-step wizards
- Navigation menus and tabs
- Data tables with sorting, filtering, pagination
- File uploads
- Real-time features (search-as-you-type, live updates)

### 4. Identify authentication and authorization boundaries

```bash
grep -r "useAuth\|isAuthenticated\|requireAuth\|ProtectedRoute\|withAuth\|middleware" src/ --include="*.tsx" --include="*.ts" --include="*.js" -l
```

Note which routes are protected and what roles or conditions gate access. These flows are always high priority.

### 5. Identify existing tests

Check what is already covered so the plan does not duplicate it:

```bash
find . -name "*.cy.ts" -o -name "*.cy.js" -o -name "*.spec.ts" -o -name "*.spec.js" -o -name "*.test.ts" -o -name "*.test.js" | grep -v node_modules | sort
```

Read a sample of existing test files to understand the current coverage level and naming conventions.

### 6. Prioritize and select flows

From everything discovered, select the flows to include in the plan. Apply this priority order:

1. Authentication flows (login, logout, session expiry, password reset)
2. Core value-proposition flows (the primary thing the app does)
3. Signup / onboarding
4. Data creation flows (creating the main entity the app manages)
5. Data editing and deletion flows
6. Access control boundaries (what a logged-out or unauthorized user sees)
7. Error and edge cases on critical paths (invalid input, network failure states)
8. Secondary features with meaningful user impact

Aim for 8–15 flows for a typical app. Fewer is fine for a focused app; more is acceptable for a large one, but keep each test focused on a single flow.

For each flow, note:
- **Why it's critical** — one sentence
- **Preconditions** — what state the app must be in before the test starts
- **Steps** — numbered list of user actions
- **Expected outcome** — what the user should see when the flow succeeds
- **Suggested file name** — where this test should live

### 7. Write the plan file

Create or update `docs/tmp/browser-test-plan.md` using the template in `references/plan_template.md`.

Ensure the directory exists:
```bash
mkdir -p docs/tmp
```

Then write the file. Each flow gets a checkbox (`- [ ]`) so `add-browser-test` can mark flows as complete.

### 8. Final response

Report:
- The framework detected or recommended
- Total number of flows identified
- The top 3 most critical flows and why
- Path to the plan file
- Next step: run `add-browser-test` to implement the first flow

## Handling common situations

### App has no existing tests at all

Note this in the plan header. Include a setup section with the command to install and initialize the chosen framework. The `add-browser-test` skill will handle installation before writing the first test.

### App is very large (many routes)

Do not try to cover everything. Focus on the top 10–15 flows. Add a note in the plan listing areas that were intentionally deferred for a future planning pass.

### App is an API with no UI

Stop and inform the user. This skill is for browser/UI flows. For API testing, a different approach (e.g. Supertest, Jest, or contract testing) is more appropriate.

### Plan file already exists

Do not overwrite. Instead:

1. Read the existing plan fully.
2. Run the same route and component discovery as Steps 2–4.
3. Compare: identify routes or components that are new since the plan was written, flows in the plan that reference routes or components that no longer exist, and critical flows in the app that the plan does not mention.
4. Produce a structured diff summary before touching the file:
   - **New flows to add** — critical flows discovered that are not in the plan
   - **Stale flows to flag** — plan entries whose routes or selectors no longer exist in the app (mark these `[~]` rather than deleting them, so `fix-browser-test` can address them)
   - **No changes** — explicitly state this if the plan is still accurate
5. Add new `[ ]` flows at the bottom of the Flows section in priority order.
6. Change stale entries from `[ ]` or `[x]` to `[~]` with a brief note explaining what changed.
7. Do not remove any existing entries — use `[~]` to flag problems rather than deleting, preserving history.

If the user asks for a full refresh (start over), back up the existing plan to `docs/tmp/browser-test-plan.bak.md` before overwriting.
