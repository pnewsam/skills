---
name: add-browser-test
description: implement one browser integration test from a standard docs/features browser-test feature plan or a specific user-supplied flow. use when asked to add a browser test, add an integration/e2e test, or implement browser-test coverage planned by plan-browser-tests. updates the feature plan after the test passes.
---

# Add Browser Test

## Overview

Implement one browser integration test from a `docs/features/NNN-*.md` feature plan or from a specific flow supplied by the user. This skill is a specialized executor for browser-test feature work; it does not read or update separate browser-test trackers.

Run it once per flow or acceptance criterion unless the user explicitly asks to batch related tests.

## Safety Rules

- Do not modify application behavior. Only write or modify test files, test helpers, test config, and minimal selector attributes needed for stable tests.
- Do not mark feature acceptance criteria or tasks complete until the test passes.
- Do not batch unrelated flows into one test.
- Always run the new test.

## Workflow

### 1. Read The Feature Plan Or Flow

Prefer a browser-test feature plan from `docs/features/`:

```bash
ls docs/features/ 2>/dev/null
```

Read the selected feature fully. Identify the next unchecked browser-test acceptance criterion or task. If no feature plan exists and the user did not supply a concrete flow, ask them to run `plan-feature` from the browser-test epic first.

Capture:

- Flow name.
- Preconditions and test data.
- User steps.
- Expected outcome.
- Suggested or inferred test file path.
- Parent epic, if linked.

### 2. Verify Framework Setup

Check for existing browser-test tooling:

```bash
cat package.json 2>/dev/null
ls playwright.config.* cypress.config.* 2>/dev/null
```

If no browser-test framework exists, install/configure only when the feature plan or user request explicitly includes setup. Prefer existing project conventions.

### 3. Read Relevant App And Test Code

Inspect the route, component, helpers, and existing tests for the target flow. Prefer selectors in this order:

1. Role and accessible name.
2. Label text.
3. Stable visible text.
4. `data-testid` / `data-cy`.
5. CSS selectors only as a last resort.

If a stable selector is missing, add the smallest meaningful `data-testid` or `data-cy` attribute.

### 4. Write One Focused Test

Follow existing test conventions. For Playwright:

```typescript
import { expect, test } from "@playwright/test";

test("<user accomplishes flow>", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Start" }).click();
  await expect(page.getByRole("heading", { name: "Done" })).toBeVisible();
});
```

For Cypress:

```typescript
describe("<flow>", () => {
  it("<user accomplishes flow>", () => {
    cy.visit("/");
    cy.contains("button", "Start").click();
    cy.contains("Done").should("be.visible");
  });
});
```

Keep each test focused on one logical flow. Use helpers or fixtures only when they already exist or clearly reduce repeated setup.

### 5. Verify

Run the new test in isolation:

```bash
npx playwright test <path-to-test-file> --reporter=line
npx cypress run --spec <path-to-test-file>
```

Use the actual command for the detected framework. If practical, run the related test directory afterward.

### 6. Update Planning Docs

After the test passes:

- Mark the completed criterion or task in the `docs/features/` plan.
- Add the test file path and command run.
- If the parent epic has a matching child feature checklist item and the feature is now complete, note that it can be checked by `advance-epic` or `ship-epic`.

Do not update any separate browser-test tracker outside the feature plan.

## Final Response

Report:

- Feature plan or flow implemented.
- Test file created or updated.
- Any selector attributes added.
- Verification command and result.
- Remaining unchecked browser-test criteria, if any.
