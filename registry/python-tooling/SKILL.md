---
name: python-tooling
description: Select, configure, or migrate Python project tooling for environments, dependencies, packaging, linting, formatting, typing, testing, task execution, and CI. Use when starting a Python project, rationalizing an existing toolchain, or deciding among tools. Preserve working repository conventions by default; verify current official documentation before introducing or migrating tools whose behavior, compatibility, or support may have changed.
---

# Python Tooling

## Outcome

Choose the smallest coherent toolchain that fits the project's delivery model, team, supported Python versions, packaging needs, and existing conventions.

Do not churn a functioning project merely to standardize names. A migration needs a concrete benefit, an adoption plan, and verification that local and CI workflows remain reproducible.

## Inspect first

Read:

- `pyproject.toml` and any legacy packaging or tool configuration
- lockfiles and dependency inputs
- developer setup and task commands
- supported Python versions and platforms
- CI, release, container, and deployment workflows
- editor and pre-commit integration
- whether the repository is an application, library, CLI, monorepo, or teaching project

Identify which file is authoritative for direct dependencies and which artifact locks a reproducible environment.

## Decision principles

### Environments and dependencies

For new projects, `uv` is a strong default when its current behavior supports the project's index, platform, build, and deployment needs. Existing Poetry, PDM, pip-tools, conda, or pip workflows may be entirely reasonable.

Choose based on:

- standards-compatible metadata and lock behavior
- private indexes, workspaces, editable installs, and platform markers
- application lockfile versus library compatibility needs
- production install path
- team and CI support

Do not maintain multiple competing lockfiles. During migration, define the temporary source of truth and remove the old path only after equivalent builds are verified.

### Packaging and builds

Use `[build-system]` only when the project is packaged. Select a backend based on actual needs such as extension modules, dynamic versioning, editable installs, and publishing—not fashion.

Applications that are never distributed as Python packages may not need a build backend.

### Linting and formatting

`ruff` is a strong new-project default for fast linting, import organization, and formatting. Preserve another formatter or linter when it enforces valuable rules Ruff does not cover or when migration noise outweighs the benefit.

Adopt rules in stages. Separate mechanical formatting changes from behavioral changes.

### Type checking

Choose the checker already supported by the codebase and editor workflow. Mypy and Pyright are both production-ready and differ in inference, configuration, and framework integration; Pyright drives most editor tooling, while Mypy has the widest plugin ecosystem. Astral's `ty` and Meta's `pyrefly` are much faster and maturing, but are not yet the risk-free default — track them without standardizing on one. Do not run two checkers with divergent configs.

For new projects and new code:

- type public and architectural boundaries first
- run strict mode on new code from the start; ratchet legacy modules toward it rather than flipping a whole repo mid-refactor
- ratchet coverage without hiding errors behind broad ignores
- verify plugin and framework support in current official documentation

### Testing

`pytest` is a common default, but standard-library `unittest` or framework-native tools can be appropriate. Preserve a coherent existing suite.

Configure test discovery, markers, async support, coverage, and warnings explicitly enough that local and CI runs agree.

### Task execution and hooks

Use the repository's existing task surface when it is clear and portable: Make, Just, Tox, Nox, Hatch environments, shell scripts, or package-manager commands may each be appropriate.

Git hooks improve feedback but are not the enforcement boundary. CI must run the authoritative checks.

## New-project baseline

A concrete starting point for a greenfield project, subject to current verification:

- `uv` for the environment, dependencies, Python version, and a committed `uv.lock`; CI installs with `uv sync --frozen`
- `ruff` for both linting and formatting
- a type checker run in strict mode on new code — `mypy` or `pyright` today (see Type checking); type public and boundary interfaces first
- `pytest`, with branch coverage and a `fail_under` no-regression floor
- `pre-commit` for fast local feedback on format, lint, and types
- PEP 621 metadata in `pyproject.toml` as the single source of truth, with a `hatchling` build backend when the project is packaged
- dependency advisory scanning such as `pip-audit`; see `compliance-vulnerability-management` for triage
- a short documented task surface for setup, format, lint, type-check, test, build, and release
- CI running the same commands developers run

Add tools only when they own a distinct responsibility. Keep tool config in `pyproject.toml` (`[tool.ruff]`, `[tool.mypy]`, `[tool.pytest.ini_options]`).

Establishing this baseline on a project that lacks it is in scope, not churn. Introduce a missing piece when it closes a real gap, one change at a time, without altering application behavior. See `python-expert` §3 for the quality floor and `python-expert/references/python-libraries.md` for the capability-to-library index. "Do not churn" forbids restyling a working toolchain for fashion; it does not forbid raising a project to the floor.

## Migration workflow

1. State the problem and measurable benefit.
2. Record current setup, lock, checks, build, and release behavior.
3. Verify candidate tools against current official docs and project constraints.
4. Introduce the new configuration without changing application behavior.
5. Compare resolved dependencies and build artifacts.
6. Run the supported test, lint, type, and packaging matrix.
7. Update local, CI, container, and release instructions together.
8. Remove obsolete configuration only after the new path is proven.

Avoid combining dependency upgrades, formatting the repository, and changing the build backend in one migration.

## Report

Explain:

- current source of truth
- recommended stack and why it fits
- tools deliberately retained
- migration and compatibility risks
- exact validation needed
- current documentation consulted for time-sensitive decisions
