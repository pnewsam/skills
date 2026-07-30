---
name: setup-browser-testing
description: Initialize or repair a project's browser-test foundation using its existing package manager and CI conventions. Use when a Node-based app has no viable Playwright or Cypress setup, or when configuration, smoke coverage, authentication fixtures, CI, or test documentation is incomplete. Installs local development dependencies and writes test-infrastructure files, but never commits, pushes, adds secrets, or modifies product behavior.
---

# Setup Browser Testing

## Outcome

Leave one project or monorepo package with a working, documented browser-test
foundation:

- an existing framework preserved, or Playwright selected when none exists
- package and browser dependencies installed locally
- configuration aligned with the real dev server
- one deterministic smoke test
- authentication support only when its contract is known
- CI aligned with repository conventions
- commands and structure documented

This is a local-files workflow. It may change dependency manifests, lockfiles,
test configuration, CI, ignore rules, and test documentation. It does not
commit, push, create a PR, configure live secrets, or change application
behavior.

## Safety and idempotency

- Require a Node project or a selected Node workspace package. Do not force a
  browser framework into a non-Node project.
- Preserve the package manager selected by the repository lockfile.
- Read existing configuration before editing it. Extend compatible setup; do
  not replace it with a generic template.
- Do not modify application source except for a user-approved stable selector
  when no semantic selector is possible.
- Never write credentials, session state, or secret values to tracked files.
- Do not add schedules, notifications, third-party CI integrations, or
  production test targets without explicit requirements.
- Reruns should fill verified gaps and leave equivalent existing behavior
  unchanged.
- Stop when a correct setup depends on an unknown app route, credential
  contract, workspace target, or dev-server command that cannot be discovered.

## Workflow

### 1. Select the project boundary

Read repository instructions and locate manifests and workspace configuration:

```bash
rg --files -g 'package.json' -g 'pnpm-workspace.yaml' -g 'yarn.lock' \
  -g 'pnpm-lock.yaml' -g 'package-lock.json' -g 'bun.lock*'
```

For a monorepo, identify the app/package that owns the browser experience. If
the user's target is not discoverable, ask before installing anything.

Read the selected `package.json`, its lockfile, relevant framework
configuration, and existing CI.

Determine:

- package manager and frozen-install command
- framework and verified dev-server command
- local URL and port
- repository Node version
- default branch and CI conventions
- existing Playwright, Cypress, or other browser-test setup

### 2. Inventory before changing

```bash
rg --files -g 'playwright.config.*' -g 'cypress.config.*' \
  -g '*.{spec,cy}.{ts,tsx,js,jsx}' -g '.github/workflows/*'
rg -n 'playwright|cypress|test:e2e|test:browser' package.json '**/package.json'
```

Classify each expected element as present and usable, present but incomplete,
or missing:

1. dependency and executable
2. framework configuration
3. test directory and helpers
4. smoke test
5. authentication fixture, when required
6. CI job
7. ignored generated/auth state
8. test documentation

Do not reinstall or regenerate usable elements.

### 3. Choose and configure the framework

- Preserve Playwright when present.
- Preserve Cypress when present.
- When neither exists, prefer Playwright unless repository instructions or the
  user choose otherwise.

Read `references/framework_setup.md` only for the selected framework and the
authentication/smoke sections that apply. Replace every template placeholder
with repository evidence before writing files.

Install through the detected package manager. Verify the installed executable
and record the version.

### 4. Decide the authentication boundary

Search for real auth routes, middleware, test users, fixtures, and environment
contracts:

```bash
rg -n 'login|sign.?in|auth|session|storageState|cy\\.session' \
  src app pages tests cypress package.json 2>/dev/null
```

Add auth support only when an authenticated smoke or future critical flow needs
it. Follow the authentication guidance in
`references/framework_setup.md`. Never generate a helper from guessed selectors
or credentials.

If auth exists but its test contract is unknown, complete the unauthenticated
foundation and report the precise missing inputs.

### 5. Add CI proportionately

Read all relevant workflow files first. Use `references/ci_template.md` to add
the smallest compatible job.

Default to pull-request, default-branch, and manual triggers. Treat schedules,
notifications, and external service credentials as separate explicitly owned
decisions.

### 6. Document the facility

Use `references/conventions_template.md` to create or update the test README.
Document only commands, paths, environment variables, and conventions that now
exist.

### 7. Verify

Run checks in increasing cost:

1. framework version command
2. configuration discovery or list command
3. smoke test with the repository's normal dev-server integration
4. the exact CI test command when practical

Examples:

```bash
npx playwright --version
npx playwright test --list
npx playwright test tests/smoke.spec.ts --reporter=line
```

or:

```bash
npx cypress --version
npx cypress run --spec cypress/e2e/smoke.cy.ts
```

If the app cannot start, distinguish framework/configuration validation from
the unverified runtime smoke test. Do not claim the facility works end to end.

Inspect the final diff for secrets, guessed placeholders, unrelated changes,
duplicate configuration, and generated artifacts.

## Final response

Report:

- selected app/package, framework, and version
- files created or extended
- dependency and lockfile changes
- auth support added, skipped, or blocked
- CI triggers and required secret *names*
- commands run and their results
- anything not verified
- next step: `plan-browser-tests` for coverage planning or `add-browser-test`
  for an already planned flow

## Common boundaries

- If a partial setup already exists, repair only the missing or broken pieces.
- If both Playwright and Cypress are present, preserve both unless the user asks
  for consolidation; choose the one already used by the target app.
- If the dev server is nonstandard, derive its command from project tooling.
  Ask only when multiple plausible targets remain.
- If package installation or browser downloads require approval or network
  access, obtain it through the execution environment and resume verification.
