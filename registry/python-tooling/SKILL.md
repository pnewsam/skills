---
name: python-tooling
description: preferred Python tooling choices for the ecosystem — package management, linting, formatting, type checking, testing, and task running. reference this skill when setting up a new Python project, adding tooling to an existing project, or when choices about Python tooling arise. establishes the standard stack and what it replaces.
---

# Python Tooling

## Overview

The Python ecosystem has consolidated around a faster, simpler set of tools. This skill defines the standard stack and establishes clear preferences so every Python project uses the same foundation.

The guiding principle: fewer tools, less config, everything in `pyproject.toml`.

## The stack

| Concern | Tool | Replaces |
|---|---|---|
| Package management, venv, lockfiles | [uv](https://docs.astral.sh/uv/) | pip, pip-tools, pipx, virtualenv, poetry, pipenv |
| Linting + formatting | [ruff](https://docs.astral.sh/ruff/) | flake8, isort, black, pylint, pyflakes, pycodestyle |
| Type checking | [mypy](https://mypy-lang.org/) | — (pyright is fine if already adopted, but mypy is the default) |
| Testing | [pytest](https://docs.pytest.org/) | unittest, nose |
| Git hooks | [pre-commit](https://pre-commit.com/) | manual hook scripts |
| Task running | [just](https://github.com/casey/just) | make, shell scripts in package.json |

All configuration lives in `pyproject.toml`. No `setup.cfg`, no `.flake8`, no `pyproject.toml` sections for tools we don't use.

## uv (package management)

### Why uv

uv is an order of magnitude faster than pip. It manages Python installations, virtual environments, packages, and lockfiles — replacing four or five tools with one. It has become the de facto standard for new Python projects.

### Usage

```bash
# Create a new project
uv init my-project
uv add fastapi pydantic
uv add --dev pytest ruff mypy pre-commit

# In an existing project
uv sync                    # install from lockfile
uv sync --group dev        # include dev dependencies
uv run pytest              # run in project venv
uv lock --upgrade          # update lockfile
```

### Key conventions

- Use `uv.lock` (committed to version control) as the single source of truth for dependency resolution.
- Use `uv sync` to create and populate the virtual environment. Never activate a venv manually.
- Use `uv run` to execute commands in the project environment. No manual activation, no `./venv/bin/python`.
- Install Python itself through uv (`uv python install 3.12`) rather than system package managers or pyenv.
- For projects that ship as tools, use `uv add --dev` for development-only dependencies, and rely on `uv sync` default behavior to exclude them from production installs.

### Migration from pip

- `pip install` → `uv add` (or `uv sync` for existing lockfile)
- `pip install -e .` → `uv sync` (editable installs handled automatically)
- `pip freeze > requirements.txt` → `uv lock` (produces `uv.lock`)
- `python -m venv .venv && source .venv/bin/activate` → `uv sync` (handles venv automatically)
- `pipx install` → `uv tool install`

Do not maintain both `requirements.txt` and `uv.lock`. If migrating, replace — don't dual-wield.

## ruff (linting + formatting)

### Why ruff

ruff is written in Rust and is 10-100x faster than the tools it replaces. It combines a linter (replacing flake8 + dozens of plugins), an import sorter (replacing isort), and a formatter (replacing black) into a single tool with zero-config defaults.

### Usage

```bash
ruff check .          # lint
ruff check --fix .    # auto-fix lint violations
ruff format .         # format
ruff format --check . # check formatting in CI
```

### Recommended config (pyproject.toml)

```toml
[tool.ruff]
target-version = "py312"
line-length = 100

[tool.ruff.lint]
select = [
    "E",   # pycodestyle errors
    "F",   # pyflakes
    "I",   # isort (import sorting)
    "N",   # pep8-naming
    "UP",  # pyupgrade (modern syntax)
    "B",   # flake8-bugbear
    "SIM", # flake8-simplify
    "TCH", # flake8-type-checking
    "RUF", # ruff-specific rules
]

[tool.ruff.format]
quote-style = "double"
indent-style = "space"
```

### Migration from black/isort/flake8

Remove all config and dependencies for black, isort, flake8, and flake8 plugins. Replace with ruff. A single `pyproject.toml` section covers everything.

## mypy (type checking)

### Why mypy

Python's type system becomes more valuable as codebases grow. mypy catches an entire class of bugs at dev time that would otherwise surface in production. It has the broadest ecosystem support and is the most mature type checker.

### Usage

```bash
mypy src/           # check source
mypy tests/         # check tests (optional, often skipped)
```

### Recommended config (pyproject.toml)

```toml
[tool.mypy]
strict = true
python_version = "3.12"
```

Prefer `strict = true` for new projects. For existing untyped projects, start with a more permissive config and tighten over time. `strict` enables all optional checks — if a project can't handle that yet, at minimum enable:

```toml
[tool.mypy]
check_untyped_defs = true
disallow_untyped_defs = true
warn_return_any = true
```

## pytest (testing)

### Why pytest

pytest is the unquestioned standard. Its fixture system, parametrization, and plugin ecosystem have no real competitors. Do not use `unittest` directly.

### Recommended config (pyproject.toml)

```toml
[tool.pytest.ini_options]
testpaths = ["tests"]
addopts = ["-v", "--tb=short", "--strict-markers"]
```

### Key conventions

- Tests live in a top-level `tests/` directory mirroring the source structure.
- Uses pytest fixtures for dependency injection and setup.
- Prefer `pytest.mark.parametrize` over hand-rolled test loops.
- Use `pytest-asyncio` for async tests. Use `httpx` + `respx` for mocking HTTP in tests.

## pre-commit (git hooks)

### Usage

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.6.0
    hooks:
      - id: ruff
        args: [--fix]
      - id: ruff-format
  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.11.0
    hooks:
      - id: mypy
        additional_dependencies: [pydantic, types-requests]
```

Run `pre-commit run --all-files` in CI to enforce it everywhere.

## just (task runner)

### Why just

just is a command runner with a clean syntax. Unlike make, it doesn't use tabs, doesn't conflate tasks with file targets, and produces better error messages. It's the simplest way to document and run project commands.

### Example justfile

```justfile
# List available commands
default:
    @just --list

# Install dependencies and set up the project
install:
    uv sync --group dev
    pre-commit install

# Run linting and type checking
check:
    ruff check .
    ruff format --check .
    mypy src/

# Run linting with auto-fixes
fix:
    ruff check --fix .
    ruff format .

# Run the test suite
test:
    uv run pytest

# Run tests with coverage
test-cov:
    uv run pytest --cov=src --cov-report=term-missing

# Format, lint, type check, and test
ci: fix check test

# Build the package
build:
    uv build
```

### Key conventions

- `just install` sets up the project from scratch.
- `just check` runs all static checks (lint + format-check + mypy).
- `just fix` auto-fixes what it can.
- `just test` runs the test suite.
- `just ci` runs the full pipeline — what CI would do.

## What we don't use

These tools were once common but are no longer part of the standard stack. Do not add them to new projects. When encountered in existing projects, migrate away.

| Tool | Replaced by | Reason |
|---|---|---|
| pip | uv | Slower, no lockfile, doesn't manage venvs |
| pip-tools | uv | uv does everything pip-tools does, faster |
| virtualenv | uv | uv manages venvs automatically |
| pipenv | uv | Complex, slow, uv is the successor |
| poetry | uv | Slower resolver, non-standard pyproject.toml sections, uv has won |
| flake8 | ruff | Slower, requires plugins for basic functionality |
| isort | ruff | ruff's import sorting is faster and equally capable |
| black | ruff format | ruff format produces near-identical output, much faster |
| pylint | ruff | ruff covers the most valuable rules with less config |
| setuptools (direct) | uv + hatchling | uv abstracts the build backend; prefer hatchling over setuptools when a backend is needed |
| setup.py / setup.cfg | pyproject.toml | pyproject.toml is the PEP standard |
| tox / nox | just | just is simpler; use CI matrix for multi-version testing |
| make | just | just has simpler syntax, no tab requirements, better errors |

## Project setup checklist

When setting up a new Python project:

- [ ] `uv init` to create the project scaffold
- [ ] Add dependencies with `uv add`
- [ ] Add dev dependencies with `uv add --dev pytest ruff mypy pre-commit`
- [ ] Configure `[tool.ruff]`, `[tool.mypy]`, `[tool.pytest.ini_options]` in `pyproject.toml`
- [ ] Add `.pre-commit-config.yaml`
- [ ] Add `justfile` with `install`, `check`, `fix`, `test`, and `ci` commands
- [ ] Run `just install` to verify everything works
- [ ] Run `just ci` to verify the full pipeline passes