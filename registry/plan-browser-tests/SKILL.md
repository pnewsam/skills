---
name: plan-browser-tests
description: analyze an application to identify its most critical browser/UI flows and create or update a standard docs/epics browser-test coverage epic with prioritized child features. use when asked to plan integration tests, browser tests, e2e tests, or identify high-value automated UI coverage. pairs with plan-feature, add-browser-test, advance-epic, and ship-epic.
---

# Plan Browser Tests

## Overview

Analyze an application's UI, routes, and business logic to identify high-value browser test coverage. The durable artifact is a normal epic in `docs/epics/`, not a separate test-plan file.

Browser test coverage should flow through the same planning spine as other work: a browser-test epic, child features, then implementation.

## Goals

- Identify critical user flows worth browser coverage.
- Avoid duplicate coverage by reading existing tests first.
- Group flows into independently plannable child features.
- Create or update a `docs/epics/NNN-<slug>.md` browser-test coverage epic.
- Preserve enough flow detail for `plan-feature` and `add-browser-test` to implement tests later.

## What Makes A Flow Critical

Prioritize flows with high regression cost:

- Authentication, authorization, and session boundaries.
- Core value-proposition workflows.
- Signup, onboarding, checkout, purchase, or activation paths.
- Data creation, editing, deletion, import, export, or persistence.
- Error recovery with visible user impact.
- Workflows with complex branching, permissions, or prior bugs.

Avoid browser tests for static content, purely cosmetic styling, or behavior already covered well by lower-level tests.

## Safety Rules

- Do not run the application, install packages, or modify source files during planning.
- Do not write test code during planning.
- Do not create separate queues or plans outside the epic/feature flow.
- If `docs/CHARTER.md` is missing, note the gap. Browser-test planning may still proceed when the user explicitly asks for engineering coverage, but the epic must document that charter alignment is provisional.

## Workflow

### 1. Understand The App And Test Stack

Inspect the project using read-only commands:

```bash
cat package.json 2>/dev/null
ls src/ app/ pages/ routes/ 2>/dev/null
ls playwright.config.* cypress.config.* 2>/dev/null
find . -name "*.spec.ts" -o -name "*.spec.js" -o -name "*.cy.ts" -o -name "*.cy.js" | grep -v node_modules | sort
```

Detect whether Playwright, Cypress, or another browser-test framework is already present. If none is present, recommend Playwright unless the project clearly prefers another tool.

### 2. Discover Routes And Interactions

Map navigable pages and interactive flows:

```bash
rg -n "path=|<Route|router\\.|app\\.(get|post|put|delete)|onClick|onSubmit|<form|<button|<Button|<input|<Input" src app pages routes 2>/dev/null
```

Look for forms, wizards, CRUD flows, tables, filters, uploads, modals, auth gates, and role-based behavior.

### 3. Read Existing Tests

Read representative existing tests and helpers. Capture:

- Covered flows.
- Test framework and file conventions.
- Selectors and fixtures used.
- Auth/test-data setup patterns.
- Obvious missing or duplicated coverage.

### 4. Group Coverage Into Child Features

Group related flows into child features. Good child feature shapes:

- "Add auth boundary browser coverage"
- "Cover checkout happy path and validation"
- "Cover dashboard filtering and empty states"
- "Cover project CRUD browser flows"

Each child feature should be small enough to plan with `plan-feature` and implement incrementally. A child feature may contain several related tests when they share setup and verification.

### 5. Write Or Update The Epic

Create or update a normal browser-test epic in `docs/epics/`. Assign the next available numeric ID if creating a new file:

```bash
mkdir -p docs/epics
ls docs/epics/ | grep -E '^[0-9]+' | sort | tail -1
```

Use this structure:

```markdown
# Epic: Browser Test Coverage

## Metadata

- **ID:** <NNN>
- **Status:** draft
- **Created:** <date>
- **Last updated:** <date>
- **Framework:** <playwright|cypress|recommended playwright>

## Charter Alignment

- **Principle advanced:** <charter principle, or "provisional - docs/CHARTER.md missing">
- **Reliability outcome:** <what user trust or workflow confidence improves>
- **Non-goal check:** <what this coverage pass will not test>

## Problem Statement

<Summarize the coverage gap and why browser tests are worth adding now.>

## Goals

1. <coverage goal>
2. <coverage goal>

## Success Criteria

| Criterion | Target | Measurement Method |
| --- | --- | --- |
| Critical flows covered | <n> flows | Passing browser tests in CI/local run |

## Child Features

- [ ] <Feature 1> - <flow cluster and outcome>
- [ ] <Feature 2> - <flow cluster and outcome>

## Flow Inventory

| Flow | Priority | Existing coverage | Proposed child feature | Notes |
| --- | --- | --- | --- | --- |
| <flow> | critical/high/moderate/low | none/partial/covered | <feature> | <setup or risk notes> |

## Deferred Flows

- <flow> - <reason deferred>

## Notes

- Framework detected:
- Existing test conventions:
- Auth/test data notes:
```

Do not create `docs/features/` files unless the user asks to plan the child features now.

## Final Response

Report:

- Browser-test epic path.
- Framework detected or recommended.
- Number of critical flows identified.
- Proposed child features.
- Highest-priority flow cluster.
- Recommended next step: run `plan-feature` for the first child feature, or `ship-epic` to plan and advance the browser-test epic end to end.
