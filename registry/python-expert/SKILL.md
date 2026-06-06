---
name: python-expert
description: Route broad Python architecture, project structure, tooling, typing, data modeling, async boundaries, error handling, database, testing, and FastAPI requests to the right python-* or fastapi-* skills. Use when building, reviewing, refactoring, or debugging Python code and the needed Python skill is unclear. Coordinates python-tooling, python-project-structure, python-testing, python-typing-data-modeling, python-async-boundaries, python-error-handling, python-database-patterns, and fastapi-architecture while avoiding overlap.
---

# Python Expert - Skill Router

Use this as the entry point for broad Python work. Identify the actual engineering problem, load only the focused Python skills needed, and keep changes aligned with the project's existing package layout, tooling, runtime model, and test conventions.

## Initial Response

When invoked without a specific request, respond only with:

> I'm ready to route the Python work. Tell me what you're building, reviewing, or debugging, and what part of the codebase is involved.

Do not provide any other information until the user asks a question or presents a Python task.

---

## 1. Routing Table

Load the smallest set of focused skills that covers the task.

| User Need | Primary Skill | Secondary Skills |
| :--- | :--- | :--- |
| Packaging, dependency management, ruff, mypy, pytest, pre-commit, commands | `python-tooling` | `python-testing`, `python-project-structure` |
| Package layout, modules, entrypoints, imports, scripts, service boundaries | `python-project-structure` | `python-tooling`, `python-testing` |
| Type hints, Pydantic, dataclasses, DTOs, protocols, serialization models | `python-typing-data-modeling` | `python-error-handling`, `python-database-patterns` |
| Async handlers, blocking calls, background tasks, timeouts, cancellation | `python-async-boundaries` | `python-database-patterns`, `python-error-handling` |
| Exceptions, domain errors, API/CLI/job boundary translation, retries, logging | `python-error-handling` | `python-typing-data-modeling`, `python-testing` |
| SQLAlchemy, sessions, transactions, repositories, migrations, query boundaries | `python-database-patterns` | `python-async-boundaries`, `python-testing` |
| Pytest, fixtures, dependency overrides, mocks, factories, integration tests | `python-testing` | `python-database-patterns`, `python-error-handling` |
| FastAPI routers, schemas, dependency injection, services, settings, API tests | `fastapi-architecture` | `python-async-boundaries`, `python-error-handling`, `python-database-patterns` |

If a request touches more than four rows, start with `python-project-structure`, then add the one focused skill closest to the user's immediate task. For FastAPI apps, start with `fastapi-architecture`.

---

## 2. Overlap Boundaries

Use these boundaries to prevent conflicting advice:

- `python-tooling` owns environment, package manager, linting, formatting, type checking, test commands, and automation.
- `python-project-structure` owns package/module layout, import boundaries, entrypoints, scripts, and service ownership.
- `python-typing-data-modeling` owns type hints, validation models, DTOs, protocols, and serialization boundaries.
- `python-async-boundaries` owns async correctness, blocking-call risk, concurrency, cancellation, and background work.
- `python-error-handling` owns exception shape, domain errors, retries, logging, and boundary translation.
- `python-database-patterns` owns sessions, transactions, repositories, migrations, and query boundaries.
- `python-testing` owns pytest strategy, fixtures, integration boundaries, mocks, and regression coverage.
- `fastapi-architecture` owns HTTP routes, FastAPI dependency injection, API schemas, app wiring, and OpenAPI-visible behavior.

When two skills overlap, decide by asking: "Is this problem about tooling, ownership, data shape, async behavior, error translation, persistence, API boundaries, or tests?"

---

## 3. Build Protocol

When building or refactoring Python code, follow this order before editing:

1. **Identify the boundary.** CLI, library module, service, API route, database layer, background job, model/schema, or test.
2. **Follow existing conventions.** Use the project's package layout, dependency tool, formatter, type checker, async style, and test patterns unless they are absent or clearly failing.
3. **Route to focused skills.** Load only the skills needed for the boundary and failure mode.
4. **Keep entrypoints thin.** Entrypoints wire configuration, dependencies, and IO; reusable behavior lives in named modules or services.
5. **Make data boundaries explicit.** Validate at API/CLI/job boundaries, keep domain and persistence models distinct when the project does, and type public interfaces.
6. **Control side effects.** Avoid import-time IO, hidden global clients, unscoped sessions, and blocking calls inside async code.
7. **Verify behavior.** Add or run tests at the boundary that can catch the regression: unit tests for pure logic, integration tests for database/API/workflow behavior.

Do not reorganize a whole Python app when a local extraction, clearer module, or focused service boundary solves the problem.

---

## 4. Review Protocol

When reviewing Python code, route findings to focused skills and report in this structure:

1. **Current State Summary:** package boundary, runtime path, data/error/persistence approach, and test coverage.
2. **Skill Routing:** list the focused `python-*` or `fastapi-*` skills used and why.
3. **Finding -> Recommendation Table:**

| # | Skill | Current | Issue | Recommendation | Why |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `python-project-structure` | Script opens files, validates rows, and writes database records inline | Entrypoint owns reusable business behavior | Move import logic into an `InvoiceImporter` service | Thin entrypoints are easier to test and reuse |
| 2 | `python-async-boundaries` | Async route calls a blocking database client | Event loop can stall under load | Use an async client or isolate blocking work safely | Async handlers must not hide blocking IO |
| 3 | `python-error-handling` | Service raises `HTTPException` | Domain logic depends on FastAPI | Raise a domain error and translate at the route boundary | API concerns should stay at the API boundary |

4. **Implementation Priority:** name the 1-3 changes that most reduce risk or improve maintainability.

Keep findings grounded in behavior, boundaries, and testability rather than personal style.
