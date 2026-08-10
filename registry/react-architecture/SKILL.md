---
name: react-architecture
description: Design or review the architecture and project structure of a React application, including the app shell, routes, feature boundaries, dependency direction, shared code, providers, configuration, and deployment assumptions. Use when starting or reorganizing a React app, deciding where code belongs, evaluating architectural coupling, or planning an incremental structural migration. Do not use for isolated component API, state, data-fetching, testing, or performance questions unless structure is the central issue.
---

# React Architecture

## Outcome

Produce a React structure that makes ownership and dependency direction obvious, keeps application infrastructure separate from product features, and can evolve without a repository-wide rewrite.

Respect the framework, build tool, router, and conventions already present. Architectural consistency is usually more valuable than introducing a preferred folder layout.

## Scope

This skill covers two related layers:

- **Application infrastructure:** startup, shell, providers, routing, configuration, authentication bootstrap, API clients, error boundaries, code splitting, and hosting assumptions.
- **Feature structure:** feature ownership, public entrypoints, colocated UI, domain logic, tests, and the boundary between reusable and feature-specific code.

Read:

- `references/app_infrastructure.md` when the request concerns the app shell, startup, routing, environment configuration, deployment, or cross-cutting providers.
- `references/feature_structure.md` when the request concerns folders, modules, feature boundaries, shared code, imports, or migration.

## Effect boundary

This is architectural guidance. Default ambiguous requests such as “help me reorganize” to analysis: inspect the application, propose a target structure, and outline an incremental migration without moving or editing files.

When the user explicitly asks to implement, refactor, or apply the reorganization, use this skill as the architectural constraint while performing the source changes under the task's implementation authorization. Do not change Git or external state unless that is separately requested.

## Principles

### Inspect before prescribing

Identify:

- framework and rendering model
- router and route ownership
- existing feature or package boundaries
- state and data-access conventions
- build, environment, and deployment constraints
- tests and tooling that encode the current structure

Do not prescribe a single-page-app shell to a server-rendered framework or replace framework-native conventions with a generic template.

### Keep the app shell explicit

The application entrypoint should compose a small, visible set of concerns: global styles, required providers, router, top-level error handling, and development instrumentation.

Avoid provider nesting that hides initialization order or turns the root into a service locator.

### Organize product code by ownership

Prefer cohesive feature boundaries over top-level folders that scatter one feature across `components`, `hooks`, `services`, and `utils`.

Each feature should expose a narrow public entrypoint. Keep implementation details private to the feature unless another owner has a stable, demonstrated need for them.

### Enforce dependency direction

A useful default is:

```text
app/routes -> features -> shared/domain -> platform adapters
```

Exact layers may differ, but dependencies should point toward stable contracts. Avoid feature-to-feature imports that create hidden workflows. Move genuinely shared domain concepts to a neutral owner or orchestrate the interaction from a higher layer.

### Keep route modules thin

Routes should identify the screen, load or validate route-level inputs, and delegate behavior to owned features. Do not let route files become the only place where authorization, data rules, and product behavior are expressed.

### Share deliberately

Code is not shared merely because two files look similar. Promote it when it has a stable responsibility, neutral ownership, and an API that is clearer than duplication.

Use specific names such as `currency`, `http-client`, or `form-field`; avoid unbounded dumping grounds such as `helpers`, `common`, or `misc`.

### Make runtime boundaries visible

Centralize and validate environment configuration. Give API, authentication, storage, and telemetry adapters explicit interfaces. Avoid reading environment variables or global browser state throughout feature code.

### Plan for delivery

Align route-level code splitting with user journeys and bundle boundaries. Verify direct navigation and fallback behavior with the deployment target. Architecture is incomplete if it only works after client-side navigation.

## Workflow

1. Map the current application shell, routes, features, shared modules, and platform adapters.
2. Identify the concrete pressure: unclear ownership, cycles, excessive coupling, startup complexity, scaling, or deployment failure.
3. Define the smallest set of boundaries and dependency rules that addresses that pressure.
4. Show the target structure and the public contract of each major boundary.
5. Test the design against one real user flow and one cross-cutting concern.
6. Plan an incremental migration that keeps the application runnable and avoids simultaneous file moves plus behavioral changes.
7. Record intentional exceptions and the condition that would cause them to be revisited.

## Review checklist

- Is the app entrypoint small and understandable?
- Are providers and initialization order explicit?
- Do routes delegate to owned features?
- Can each feature be understood without searching the whole repository?
- Are feature public APIs narrow?
- Are dependency cycles or sideways feature imports prevented?
- Is shared code truly neutral and stable?
- Are environment and platform dependencies centralized?
- Do deep links and deployment fallbacks work?
- Can the proposed structure be reached incrementally?

## Handoffs

- Use `react-component-design` for component API and composition decisions.
- Use `react-state-management` for client-state ownership.
- Use `react-data-fetching` for server-state and cache architecture.
- Use `react-routing` for URL semantics and navigation behavior.
- Use `react-error-handling` for error boundaries and recovery.
- Use `react-testing` for test strategy.
- Use `react-performance` when performance evidence drives the structure.
