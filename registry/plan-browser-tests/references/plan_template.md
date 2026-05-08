# Plan file template

Write this to `docs/tmp/browser-test-plan.md`. Fill in every section.

```markdown
# Browser Test Plan

Generated: <date>
Framework: <playwright|cypress>
App: <brief description of what the app does>
Total flows: <n>

## Setup

<!-- Include this section only if the framework is not yet installed -->

Install and initialize <framework>:

```bash
<setup command>
```

<!-- Remove this section once the framework is installed -->

## Flows

<!-- Each flow has a checkbox. The add-browser-test skill marks it [x] when implemented. -->
<!-- Priority order: highest-value flows first. -->

### 1. [ ] <Flow name>

**Why critical:** <one sentence>
**Preconditions:** <starting state, e.g. "logged-out user on the home page">
**File:** `<tests/flows/flow-name.spec.ts>` or `<cypress/e2e/flow-name.cy.ts>`

Steps:
1. <User action>
2. <User action>
3. ...

Expected outcome: <what the user sees when the flow completes successfully>

---

### 2. [ ] <Flow name>

**Why critical:** <one sentence>
**Preconditions:** <starting state>
**File:** `<path>`

Steps:
1.
2.

Expected outcome:

---

<!-- Repeat for each flow -->

## Deferred flows

<!-- Flows that were identified but intentionally left out of this plan -->

- <flow name> — <reason deferred>

## Notes

<!-- Anything the implementer should know: auth setup, test data, environment variables, base URL config, etc. -->
```
