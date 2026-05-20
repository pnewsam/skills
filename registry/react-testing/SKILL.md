---
name: react-testing
description: testing philosophy for React applications — integration tests for critical flows, unit tests for business logic, minimal component tests. covers where to invest testing effort for maximum confidence per unit of cost. reference this skill when deciding what to test, how to test it, or whether a test is worth writing.
---

# React Testing

## Overview

This skill defines a testing philosophy for React applications. The core insight: **tests have real costs** — time to write, time to run, time to maintain when they break — and event-driven UIs are fundamentally harder to test than server APIs. Testing effort should be targeted where it produces the most confidence, not spread evenly across everything.

The testing pyramid for React apps looks different from backend services. Browser tests are proportionally more valuable because they verify what the user actually experiences, while component tests (rendering in jsdom) sit in an uncanny valley — more expensive than unit tests but less reliable than browser tests because they run in a fake environment.

## The three tiers

### 1. Integration / browser tests — for critical user flows

These are your highest-value tests. They run in a real browser, interact with real UI, and verify end-to-end flows the way a user would.

**What to cover:**
- Core user journeys: sign up, log in, create/edit/delete the primary entity, complete the main workflow
- Smoke tests: each major page loads without crashing
- Flows involving multiple pages or navigation
- Flows where a failure would have significant business impact

**What NOT to cover with browser tests:**
- Every edge case and validation rule (too slow, too brittle)
- Visual styling or pixel-level details (use visual regression tools if needed)
- Exhaustive combinations of inputs

**Tools:** Playwright is the current standard. Cypress is also widely used.

**Characteristics of good browser tests:**
- Test user-visible behavior, not implementation details. Click buttons by their text or role, not by CSS selectors or test IDs where avoidable.
- Each test should be independent — no shared state between tests, no ordering dependencies.
- Seed data explicitly. Don't rely on data from other tests or a pre-populated database.
- Keep them focused. A browser test that takes 30 seconds and tests one flow is better than a 3-minute test that tests five flows in sequence.
- Accept that browser tests are slower and run fewer of them. 20-40 well-chosen browser tests covering critical flows provide more confidence than 200 shallow component tests.

```ts
// Good: tests the actual user flow
test("user can create an invoice", async ({ page }) => {
  await page.goto("/invoices");
  await page.getByRole("button", { name: "New Invoice" }).click();
  await page.getByLabel("Client Name").fill("Acme Corp");
  await page.getByLabel("Amount").fill("1500");
  await page.getByRole("button", { name: "Create" }).click();
  await expect(page.getByText("Invoice created")).toBeVisible();
  await expect(page.getByText("Acme Corp")).toBeVisible();
});
```

### 2. Unit tests — for important business logic

Pure functions with clear inputs and outputs are cheap to test and the tests are fast, stable, and valuable. This is where unit tests shine.

**What to cover:**
- Calculations, transformations, and formatting functions (price calculations, date formatting, data normalization)
- Validation logic (especially complex validation rules that aren't obvious from the schema)
- State reducers and state machine transitions
- Utility functions and helpers with non-trivial logic
- Custom hooks that encapsulate business logic (test via `renderHook` or by testing the functions they use internally)

**What NOT to unit test:**
- Trivial functions (getters, simple mappings, one-liners)
- Implementation details that are covered by integration tests
- Functions that are just thin wrappers around a library

**Characteristics of good unit tests:**
- Test behavior, not implementation. Assert on outputs given inputs, not on internal method calls.
- One assertion per logical concept (not necessarily one `expect` per test, but each test should verify one thing).
- No mocks unless absolutely necessary. If a function is hard to test without mocking, it may be doing too much.

```ts
// Good: tests business logic with clear inputs and outputs
describe("calculateInvoiceTotal", () => {
  it("sums line items with tax", () => {
    const items = [
      { description: "Design", amount: 1000 },
      { description: "Development", amount: 2000 },
    ];
    expect(calculateInvoiceTotal(items, { taxRate: 0.1 })).toBe(3300);
  });

  it("returns zero for empty line items", () => {
    expect(calculateInvoiceTotal([], { taxRate: 0.1 })).toBe(0);
  });
});
```

### 3. Component tests — minimal and targeted

Component tests render a React component in jsdom (via Testing Library) and assert on its DOM output and interactions. They're useful in specific situations but should not be the default testing strategy.

**When component tests are worth it:**
- Complex interactive components where the interaction logic is the thing you're testing — a multi-select with keyboard navigation, a drag-and-drop interface, a date picker with range selection
- Components with complex conditional rendering where the branching logic benefits from explicit coverage
- Shared base UI components that many other components depend on — a bug here has wide blast radius

**When component tests are NOT worth it:**
- Page-level components that compose other components — test these through browser tests instead
- Components that are primarily layout/presentation — if it renders JSX from props without complex logic, the test adds cost without confidence
- Components where the interesting behavior involves API calls, routing, or interaction across multiple components — browser tests handle this better

**Why minimal:**
- jsdom is not a real browser. It doesn't support layout, real event bubbling, intersection observers, CSS, or many Web APIs. Tests pass in jsdom but fail in a real browser, or vice versa. This is the fake-environment tax.
- Component tests that mock too many things test the mocks, not the component. If you're mocking the router, the API layer, and three contexts, the test isn't verifying much.
- Every component test is a maintenance liability — when you refactor the component, the test breaks even if the behavior is unchanged.

```tsx
// Worth it: tests complex interaction logic on a shared component
describe("MultiSelect", () => {
  it("selects multiple items with keyboard", async () => {
    const onChange = vi.fn();
    render(
      <MultiSelect options={["Red", "Green", "Blue"]} onChange={onChange} />
    );
    const trigger = screen.getByRole("combobox");
    await userEvent.click(trigger);
    await userEvent.click(screen.getByRole("option", { name: "Red" }));
    await userEvent.click(screen.getByRole("option", { name: "Blue" }));
    expect(onChange).toHaveBeenLastCalledWith(["Red", "Blue"]);
  });
});
```

## Decision guide: should I write a test for this?

| What changed | Test type | Write a test? |
|---|---|---|
| New critical user flow (create, edit, delete, auth) | Browser / integration | Yes — always |
| New page or route | Browser (smoke test) | Yes — verify it loads |
| Business logic function (calculation, validation, transformation) | Unit test | Yes — if logic is non-trivial |
| Custom hook with business logic | Unit test (renderHook or test underlying functions) | Yes |
| New shared UI component (design system) | Component test | Yes — it's widely used, bugs have high blast radius |
| New feature-specific component | Usually none | Covered by the browser test for the flow that uses it |
| Bug fix | Test at the level the bug manifests | Yes — regression test at the right tier |
| Refactor (no behavior change) | None | Existing tests should still pass; don't add new ones |
| Styling / layout change | None (or visual regression) | No — not testable in jsdom, and browser tests catch rendering crashes |

## Principles

### Test ROI, not coverage percentage

Code coverage is a trailing indicator, not a goal. 90% coverage with shallow component tests that assert on DOM structure gives less confidence than 60% coverage with targeted browser tests and unit tests on business logic.

Ask: "If this test fails, does it tell me something useful?" If the answer is "it tells me someone renamed a CSS class" — that test is not earning its keep.

### Test behavior, not implementation

Tests should assert on what the user sees and what the system does, not on internal component structure, state values, or method calls.

```tsx
// Bad: tests implementation
expect(component.state.isOpen).toBe(true);
expect(mockDispatch).toHaveBeenCalledWith({ type: "TOGGLE" });

// Good: tests behavior
await userEvent.click(screen.getByRole("button", { name: "Open menu" }));
expect(screen.getByRole("menu")).toBeVisible();
```

### Avoid mocking what you don't own

Heavy mocking creates tests that verify your mocks, not your code. Minimize mocking, and when you do mock:

- **Mock at the network boundary** (MSW for API mocking) rather than mocking hooks, services, or internal modules. This keeps more of your real code in the test path.
- **Don't mock the router, the form library, or the state management library.** Render with real providers. If this is hard, it's a signal that the test should be a browser test instead.
- **Mock time and randomness** when needed for determinism — these are legitimate mocks.

### Flaky tests are worse than no tests

A flaky test trains the team to ignore test failures. If a test flakes:
1. Fix it or delete it. Don't skip it and forget about it.
2. Common causes in browser tests: timing issues (add proper waits for elements, don't use `sleep`), shared state between tests, animations interfering with clicks.
3. Common causes in component tests: async state updates not wrapped in `act`, timers not advanced, race conditions in mocked responses.

### Run tests in CI, not just locally

Tests that only run on a developer's machine don't protect the main branch. Browser tests especially should run in CI on every PR — they're the tests most likely to catch real regressions.

Keep the CI test suite fast enough that developers don't skip it. If browser tests are slow, run a subset (smoke tests) on every push and the full suite on PR merge.

### Include accessibility in the right tier

Accessibility checks belong where the behavior happens. Use linting for static issues, component tests for shared primitives, and browser tests for keyboard flows, focus management, dialogs, forms, and route navigation. Automated axe checks are useful, but they do not replace keyboard and screen-reader-oriented flow testing.
