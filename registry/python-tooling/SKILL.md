---
name: python-tooling
description: Select, configure, or migrate Python project tooling for environments, dependencies, packaging, linting, formatting, typing, testing, task execution, and CI. Use when starting a Python project, rationalizing an existing toolchain, or deciding among tools. Preserve working repository conventions by default; verify current official documentation before introducing or migrating tools whose behavior, compatibility, or support may have changed.
---

# Python Tooling

## Outcome

Choose the smallest coherent toolchain that fits the project's delivery model,
team, supported Python versions, packaging needs, and existing conventions.

Do not churn a functioning project merely to standardize names. A migration
needs a concrete benefit, an adoption plan, and verification that local and CI
workflows remain reproducible.

## Inspect first

Read:

- `pyproject.toml` and any legacy packaging or tool configuration
- lockfiles and dependency inputs
- developer setup and task commands
- supported Python versions and platforms
- CI, release, container, and deployment workflows
- editor and pre-commit integration
- whether the repository is an application, library, CLI, monorepo, or teaching
  project

Identify which file is authoritative for direct dependencies and which artifact
locks a reproducible environment.

## Decision principles

### Environments and dependencies

For new projects, `uv` is a strong default when its current behavior supports
the project's index, platform, build, and deployment needs. Existing Poetry,
PDM, pip-tools, conda, or pip workflows may be entirely reasonable.

Choose based on:

- standards-compatible metadata and lock behavior
- private indexes, workspaces, editable installs, and platform markers
- application lockfile versus library compatibility needs
- production install path
- team and CI support

Do not maintain multiple competing lockfiles. During migration, define the
temporary source of truth and remove the old path only after equivalent builds
are verified.

### Packaging and builds

Use `[build-system]` only when the project is packaged. Select a backend based on
actual needs such as extension modules, dynamic versioning, editable installs,
and publishing—not fashion.

Applications that are never distributed as Python packages may not need a
build backend.

### Linting and formatting

`ruff` is a strong new-project default for fast linting, import organization,
and formatting. Preserve another formatter or linter when it enforces valuable
rules Ruff does not cover or when migration noise outweighs the benefit.

Adopt rules in stages. Separate mechanical formatting changes from behavioral
changes.

### Type checking

Choose the checker already supported by the codebase and editor workflow.
Mypy, Pyright, and other current checkers have different inference,
configuration, and framework integration.

For new projects:

- type public and architectural boundaries first
- select strictness the team can sustain
- ratchet coverage without hiding errors behind broad ignores
- verify plugin and framework support in current official documentation

### Testing

`pytest` is a common default, but standard-library `unittest` or framework-native
tools can be appropriate. Preserve a coherent existing suite.

Configure test discovery, markers, async support, coverage, and warnings
explicitly enough that local and CI runs agree.

### Task execution and hooks

Use the repository's existing task surface when it is clear and portable:
Make, Just, Tox, Nox, Hatch environments, shell scripts, or package-manager
commands may each be appropriate.

Git hooks improve feedback but are not the enforcement boundary. CI must run the
authoritative checks.

## New-project baseline

A reasonable starting point, subject to current verification:

- PEP 621 metadata in `pyproject.toml` when packaging applies
- one environment/dependency manager and one lock strategy
- Ruff for linting and formatting
- one type checker chosen deliberately
- pytest when no framework constraint suggests otherwise
- a short documented task surface for setup, format, lint, type-check, test,
  build, and release
- CI using the same commands developers run

Add tools only when they own a distinct responsibility.

## Migration workflow

1. State the problem and measurable benefit.
2. Record current setup, lock, checks, build, and release behavior.
3. Verify candidate tools against current official docs and project
   constraints.
4. Introduce the new configuration without changing application behavior.
5. Compare resolved dependencies and build artifacts.
6. Run the supported test, lint, type, and packaging matrix.
7. Update local, CI, container, and release instructions together.
8. Remove obsolete configuration only after the new path is proven.

Avoid combining dependency upgrades, formatting the repository, and changing
the build backend in one migration.

## Report

Explain:

- current source of truth
- recommended stack and why it fits
- tools deliberately retained
- migration and compatibility risks
- exact validation needed
- current documentation consulted for time-sensitive decisions
