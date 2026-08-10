---
name: react-expert
description: Route React application requests to the smallest relevant react-* skill set and synthesize the guidance. Use when a React build, review, refactor, or debugging request spans two or more concerns, or when the primary concern is unclear. Prefer one focused react-* skill for one clearly bounded concern.
---

# React Expert - Skill Router

Use this as the entry point for broad React work. Identify the actual engineering problem, load only the focused `react-*` skills needed, and keep the implementation aligned with the app's existing framework, file structure, and component conventions.

Use the router when the request spans two or more focused React concerns and needs a coherent recommendation. Go directly to one focused `react-*` skill when exactly one concern is clear.

## 1. Routing Table

Load the smallest set of focused skills that covers the task.

| User Need | Primary Skill | Secondary Skills |
| :--- | :--- | :--- |
| App shell, providers, router setup, feature boundaries, auth/bootstrap, deployment | `react-architecture` | `react-routing`, `react-error-handling` |
| Component API, decomposition, variants, composition, oversized components | `react-component-design` | `react-architecture`, `react-performance`, `react-accessibility` |
| File organization, feature modules, shared layers, naming, ownership boundaries | `react-architecture` | `react-component-design` |
| Effects, dependencies, cleanup, stale closures, refs, custom hooks | `react-hooks-effects` | `react-state-management`, `react-data-fetching` |
| Forms, validation, field components, dirty state, wizard flow | `react-form-patterns` | `react-state-management`, `react-accessibility`, `react-testing` |
| Local/global state, derived state, URL state, context, reducers, stores | `react-state-management` | `react-routing`, `react-data-fetching`, `react-hooks-effects` |
| API data, queries, mutations, invalidation, optimistic updates, pagination | `react-data-fetching` | `react-error-handling`, `react-state-management`, `react-testing` |
| URL design, route hierarchy, search params, navigation state | `react-routing` | `react-architecture`, `react-state-management` |
| Slow renders, memoization, virtualization, code splitting, profiling | `react-performance` | `react-component-design`, `react-data-fetching` |
| Error boundaries, route errors, expected data/action failures, recovery | `react-error-handling` | `react-data-fetching`, `react-accessibility` |
| Semantic HTML, keyboard behavior, ARIA, focus, forms, live regions | `react-accessibility` | `react-component-design`, `react-form-patterns`, `react-error-handling` |
| Test strategy, integration tests, component tests, mocks, providers | `react-testing` | `react-data-fetching`, `react-routing`, `react-accessibility` |
| Design-system component adoption, legacy primitives, variants, or migration | `analyze-design-system` | `react-component-design`, `react-accessibility`, `react-testing` |

If a request touches more than four rows, start with `react-architecture`, then add the one focused skill closest to the user's immediate task. Add more only when implementation requires it.

---

## 2. Overlap Boundaries

Use these boundaries to prevent conflicting advice:

- `react-architecture` owns app-level wiring, feature boundaries, dependency direction, and where application modules live.
- `react-component-design` owns component shape, composition, variants, and decomposition.
- `react-hooks-effects` owns effect correctness and hook boundaries.
- `react-form-patterns` owns form state, validation, field components, and form flow.
- `react-state-management` owns client state placement and derivation.
- `react-data-fetching` owns server state and API synchronization.
- `react-routing` owns URL structure and navigational state.
- `react-performance` owns measurement-driven optimization.
- `react-error-handling` owns error boundaries, fallback UI, and recovery.
- `react-accessibility` owns semantic and keyboard correctness.
- `react-testing` owns validation strategy and test shape.

When two skills overlap, decide by asking: "Is this problem about app wiring, file ownership, component shape, hook correctness, state ownership, server data, navigation, runtime failure, accessibility, performance, or tests?"

---

## 3. Design-System Convergence Signals

For a broad component-system audit, route to `analyze-design-system`. When that workflow loads this expert, contribute React interpretation for:

- canonical versus legacy imports and consumer migration progress
- duplicate semantic component families and wrapper layers
- variant APIs, boolean-mode combinations, invalid states, and unused variants
- behavioral, accessibility, responsive, and test differences across nominally equivalent components

Component size, prop count, and import frequency are investigation signals. Confirm ownership, semantic equivalence, consumer behavior, and external usage before recommending consolidation or deletion.

## 4. Build Protocol

When building or refactoring React code, follow this order before editing:

1. **Identify the boundary.** App infrastructure, route/page, feature module, component, hook, form, data layer, or test.
2. **Follow existing conventions.** Use the project's current router, data library, form library, styling system, and file layout unless they are absent or clearly failing. Detect the React major version and rendering model (SPA vs framework/RSC) and prefer modern APIs only when the installed version supports them; keep pre-19 patterns otherwise. See `references/react-version-and-rendering.md`.
3. **Route to focused skills.** Load only the skills needed for the boundary and failure mode.
4. **Keep ownership clear.** App wiring stays in app-level modules; domain UI and behavior stay in feature modules; reusable primitives stay in the base UI layer.
5. **Minimize state.** Derive what can be derived, keep state as low as possible, and avoid duplicating URL, form, and server state.
6. **Handle states and errors.** Loading, error, empty, success, disabled, and focus states should match the interaction and route boundary.
7. **Verify behavior.** Add or run tests that cover the user-visible behavior or regression risk; prefer integration tests for critical flows.

Do not introduce a new library, global store, route structure, or component abstraction if the codebase already has a clear local pattern.

---

## 5. Review Protocol

When reviewing React code, route findings to focused skills and report in this structure:

1. **Current State Summary:** app boundary, affected components/routes, data/state approach, and test coverage.
2. **Skill Routing:** list the focused `react-*` skills used and why.
3. **Finding -> Recommendation Table:**

| # | Skill | Current | Issue | Recommendation | Why |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `react-state-management` | URL filter is copied into component state | State can drift from the address bar | Read from and write to search params directly | URL state should have one source of truth |
| 2 | `react-component-design` | One page component renders header, table, drawer, and form inline | Component has multiple responsibilities | Extract named section components | The parent should read like a table of contents |
| 3 | `react-error-handling` | Query errors render as a blank page | User loses context and recovery path | Add route/section fallback with retry | Recoverable failures need visible recovery |

4. **Implementation Priority:** name the 1-3 changes that most reduce risk or improve maintainability.

Keep findings grounded in behavior, ownership, and maintainability rather than stylistic preference.
