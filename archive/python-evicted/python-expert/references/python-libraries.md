# Python libraries: capability → canonical choice

An index of the libraries that most often pay for themselves early, so a capability can be met with the standard tool instead of a hand-rolled version. Used by the quality baseline (see `python-expert` §3) and by focused skills that need the canonical tool for a capability.

Naming a library is a default, not a mandate. Prefer a working project's existing choice. Verify current maintenance and compatibility in official docs before adding a dependency. Introduce one only when it removes real, present risk — never for fashion.

## Configuration

- **`pydantic-settings`** — typed, validated config loaded from environment, `.env`, and secrets files, with a defined precedence order and fail-fast validation at startup. Introduce when config is read ad hoc from `os.environ` across the app, when a missing or malformed variable fails deep instead of at boot, or when settings need types, defaults, or nesting. Prefer over hand-rolled config objects. (`BaseSettings` moved out of core Pydantic into this separate package in v2.)

## Logging

- **`structlog`** — structured logging: key-value events, request context bound once via `contextvars`, JSON in production and readable output in development. Introduce for any service or async app beyond a small script. Libraries should stay on stdlib `logging` + `NullHandler` and not impose a logging library on consumers.

## Resilience

- **`tenacity`** — bounded retry with backoff and jitter for transient failures. Introduce when retry logic is hand-rolled or scattered through business code; keep the policy at the client or job boundary. Do not retry non-idempotent writes without an idempotency key.

## Data modeling and serialization

Validate at the boundary; keep the interior cheap. Reaching for Pydantic on every internal object adds allocation and validation cost for no safety gain.

- **`pydantic` v2** — validation and (de)serialization at boundaries: HTTP request/response, config, external input, LLM output. Default for API layers because of FastAPI integration.
- **`attrs`** — internal value objects that want slots, converters, or opt-in validators without runtime-validation-by-default. A superset of `dataclasses`.
- **`msgspec`** — high-throughput (de)serialization of trusted, typed data on hot paths and message queues.
- **stdlib `dataclasses`** — plain internal containers with no dependency and no validation.

## Type checking

- **`mypy` or `pyright`** — both production-ready; use the one the codebase and editor already run. Pyright powers editor tooling (Pylance); mypy has the widest plugin ecosystem (Django, SQLAlchemy). Astral's **`ty`** and Meta's **`pyrefly`** are far faster and maturing (ty beta as of late 2025; pyrefly 1.0 in 2026) but are not yet the risk-free default — track them, do not standardize on one yet. Do not run two checkers with divergent configs.

## Testing

- **`pytest`** — default runner; plain functions and `assert`.
- **`pytest-cov`** — coverage. Enable branch coverage; use `fail_under` as a no-regression floor, never as a quality target.
- **`hypothesis`** — property-based tests for parsers, serializers, encoders, validators, and numeric code, expressed as round-trip or invariant properties.
- **`time-machine`** (or `freezegun`) — control the clock instead of patching `datetime`.
- **`respx`** (httpx) / **`responses`** (requests) — fake HTTP at the client boundary.
- **`testcontainers`** — real backing services (database, queue) in integration tests when a fake is not faithful enough.
- **`syrupy`** / **`inline-snapshot`** — snapshot large structured output; review every snapshot diff like an assertion.

## Async

- **`anyio`** — structured concurrency plus asyncio/Trio portability; the substrate under Starlette and FastAPI. Prefer stdlib `asyncio.TaskGroup` and `asyncio.timeout` for a plain asyncio app; reach for anyio in a library or when Trio support matters.

## Packaging and workflow

- **`uv`** — environment, dependency resolution, Python install, and lockfile (`uv.lock`). The greenfield default.
- **`ruff`** — lint and format in one tool, replacing black, isort, and flake8.
- **`pre-commit`** — run ruff and type checks on commit; CI still runs the authoritative checks.

## Supply chain

- **`pip-audit`** — scan resolved dependencies for known advisories. See `compliance-vulnerability-management` for triage and remediation sequencing.
