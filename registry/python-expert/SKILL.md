---
name: python-expert
description: Route Python engineering requests to the smallest relevant python-* or fastapi-* skill set and synthesize the guidance. Use when a Python build, review, refactor, or debugging request spans two or more concerns, or when the primary concern is unclear. Prefer one focused Python skill for one clearly bounded concern. Use backend-expert for language-agnostic service architecture.
---

# Python Expert - Skill Router

Use this as the entry point for broad Python work. Identify the actual engineering problem, load only the focused Python skills needed, and keep changes aligned with the project's existing package layout, tooling, runtime model, and test conventions.

For language-agnostic backend architecture such as API contract shape, service boundary strategy, persistence lifecycle, background jobs, external integrations, or auth boundary placement, use `backend-expert` first, then return to `python-expert` for Python/FastAPI implementation details.

Use the router when the request spans two or more focused Python concerns and needs a coherent recommendation. Go directly to one focused Python skill when exactly one concern is clear.

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
- `backend-expert` owns language-agnostic backend architecture decisions before they become Python/FastAPI implementation work.

When two skills overlap, decide by asking: "Is this problem about tooling, ownership, data shape, async behavior, error translation, persistence, API boundaries, or tests?"

---

## 3. Quality Baseline

Follow a working project's conventions by default. But "follow existing conventions" is not a reason to keep a quality gap. When the project is new, or an area is absent or clearly below the baseline, propose establishing the floor — do not silently inherit the gap.

The floor for new code and new projects:

- **Typed config.** Settings loaded and validated once, not read ad hoc from `os.environ`.
- **Types on new code.** Type public and boundary interfaces and run a type checker in strict mode on new modules, even when the legacy tree is loose. Ratchet legacy per module; do not flip a whole repo mid-refactor.
- **A check gate.** Format, lint, type-check, and test run the same way locally and in CI.
- **Structured logging** for services and async apps, and **bounded retries** at external boundaries.
- **Tests at the boundary** that can catch the regression.

Introducing a dependency to close a real gap is in scope; churning a working project to restyle it is not. Consult `references/python-libraries.md` for the capability-to-library index and each library's "when to introduce" trigger, and `python-tooling` for the toolchain baseline and the safe migration workflow. Propose the change, scope it small, and roll it out without altering existing behavior.

---

## 4. Build Protocol

When building or refactoring Python code, follow this order before editing:

1. **Identify the boundary.** CLI, library module, service, API route, database layer, background job, model/schema, or test.
2. **Follow existing conventions.** Use the project's package layout, dependency tool, formatter, type checker, async style, and test patterns unless they are absent or clearly failing. When they are absent or below the baseline in §3, propose establishing the floor rather than inheriting the gap.
3. **Route to focused skills.** Load only the skills needed for the boundary and failure mode.
4. **Keep entrypoints thin.** Entrypoints wire configuration, dependencies, and IO; reusable behavior lives in named modules or services.
5. **Make data boundaries explicit.** Validate at API/CLI/job boundaries, keep domain and persistence models distinct when the project does, and type public interfaces.
6. **Control side effects.** Avoid import-time IO, hidden global clients, unscoped sessions, and blocking calls inside async code.
7. **Verify behavior.** Add or run tests at the boundary that can catch the regression: unit tests for pure logic, integration tests for database/API/workflow behavior.

Do not reorganize a whole Python app when a local extraction, clearer module, or focused service boundary solves the problem.

---

## 5. Review Protocol

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
