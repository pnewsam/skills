---
name: plan-refactor
description: create a structured maintainability refactor plan for code that has become too large, tangled, poorly organized, or hard for future developers and agents to navigate. use when asked to split code across files, reorganize modules, disentangle logic, clean up architecture, reduce file or module size, or improve maintainability without changing behavior. pairs with apply-refactor.
---

# Plan Refactor

## Overview

Create an implementation plan for a behavior-preserving maintainability refactor. The plan should split large files, reorganize modules, move logic to better boundaries, extract focused units or helpers, and make the code easier for future humans and agents to read.

This skill plans the work only. It does not edit source code.

## Use With Other Skills

This skill is domain-neutral. When the target code belongs to a specific framework, language, or architecture, explicitly load the relevant specialist skills before choosing boundaries. Use this skill to structure the refactor plan; use specialist skills to judge domain-specific boundaries and safety rules.

## Goals

- Produce a concrete plan that can be executed one small unit at a time.
- Preserve user-facing behavior and public APIs unless the user explicitly asks otherwise.
- Reduce cognitive load: smaller files, clearer ownership, simpler imports, less tangled state or logic.
- Respect the existing project structure before introducing a new one.
- Avoid speculative abstraction. Extract only boundaries that are already visible in the code.
- Make each task independently verifiable.

## Workflow

### 1. Detect Relevant Guidance

Before planning, inspect the stack so the plan uses the right architectural vocabulary:

```bash
rg --files | rg '(^package.json$|\.tsx?$|pyproject.toml|requirements.*\.txt|\.py$|pytest|vitest|jest|playwright|Makefile)'
rg -n "from fastapi|import fastapi|APIRouter|Depends|BaseModel|use[A-Z]|jsx|tsx|createRoot|BrowserRouter|RouterProvider" .
```

Apply these mappings when signals are present:

| Signals | Specialist guidance to load |
|---|---|
| `package.json`, `.tsx`, `src/App.tsx`, JSX, hooks, React router | `react-component-design`, `react-project-structure` |
| React app entrypoints, providers, routing, environment config | `react-spa-architecture` |
| React state, effects, forms, data fetching, routing, tests | `react-state-management`, `react-hooks-effects`, `react-form-patterns`, `react-data-fetching`, `react-routing`, `react-testing` as relevant |
| `pyproject.toml`, `requirements.txt`, `.py`, pytest config, Python package imports | `python-project-structure`, `python-testing` as relevant |
| Pydantic models, dataclasses, DTOs, `TypedDict`, `Protocol`, type-checker config | `python-typing-data-modeling` |
| `async def`, async database/client usage, background tasks, cancellation or timeout concerns | `python-async-boundaries` |
| Python exceptions, domain errors, retries, logging, API/CLI/job error translation | `python-error-handling` |
| SQLAlchemy, Alembic, sessions, transactions, repositories, migrations, query duplication | `python-database-patterns` |
| `fastapi`, `APIRouter`, `Depends`, Pydantic request/response models | `fastapi-architecture`, plus the Python skills above as relevant |
| Async JavaScript/TypeScript, functional transforms, error modeling, TypeScript types | `async-patterns`, `functional-patterns`, `error-handling`, `typescript-types` as relevant |

If no specialist skill fits, proceed with the general refactor workflow and rely on the project's own conventions.

### 2. Understand The Refactor Target

Inspect the requested files, directories, or feature area. If the user is vague, identify likely candidates with fast searches:

```bash
rg --files
find . -type f | sed 's#^\./##' | sort
wc -l <target-files>
```

Read enough code to understand:

- The current responsibilities in the target area.
- Existing folder and naming conventions.
- Public exports and callers.
- Tests, fixtures, generated outputs, or snapshots that depend on the code.
- State ownership, side effects, I/O, data access, and business rules.
- Repeated structure, helper logic, constants, data, or configuration.

### 3. Identify Refactor Problems

Look for maintainability signals:

- A file has multiple unrelated responsibilities.
- A module, class, function, view, script, or configuration file is too large to scan comfortably.
- Presentation, state, data, handlers, side effects, and helpers are all mixed together.
- Domain code lives in generic shared folders without clear ownership.
- Shared utilities contain domain-specific behavior.
- A change in one feature requires reading unrelated features.
- Logic is duplicated or hidden inside orchestration code.
- Import paths reveal unclear ownership or circular dependency risk.
- Tests are hard to target because behavior has no clear boundary.

Do not over-index on line count. Size is a signal, not proof. A large cohesive file can be fine; a smaller tangled file can be worth refactoring.

### 4. Choose Target Boundaries

Prefer boundaries that are already present in the code:

- Entry points, adapters, screens, commands, handlers, or orchestration boundaries.
- Layout, shell, or orchestration modules.
- Feature modules.
- Focused domain units such as services, classes, components, commands, handlers, or jobs.
- Dedicated state, side-effect, or I/O boundaries.
- Pure helpers for formatting, parsing, filtering, sorting, grouping, or mapping.
- Constants, mock data, schema definitions, fixtures, or config.
- Types shared by multiple files.

Avoid boundaries that would create:

- Many tiny wrapper files with no real nameable responsibility.
- Heavy prop drilling.
- New global state or context without a stable cross-cutting need.
- A full project restructure when a local extraction would solve the problem.
- Behavior changes disguised as cleanup.

### 5. Write The Plan

Create `docs/refactors/NNN-<slug>.md`. Assign the next available numeric ID.

Use this structure:

```markdown
# Refactor: <Title>

## Target

- Scope:
- Current pain:
- Non-goals:

## Current Shape

- Key files:
- Existing conventions:
- Guidance loaded:
- Public APIs/callers:
- Tests or validation:

## Desired Shape

- Proposed boundaries:
- New or moved files:
- Responsibilities after refactor:

## Safety Constraints

- Behavior to preserve:
- Public APIs to preserve:
- Risks:

## Tasks

- [ ] <small behavior-preserving task>
- [ ] <small behavior-preserving task>
- [ ] <small behavior-preserving task>

## Verification

- Command or manual check:
- Command or manual check:
```

Tasks should be small enough for `apply-refactor` to complete one at a time. Each task should name the files or responsibilities involved and include an observable verification path.

### 6. Validate The Plan

Before finishing, check:

- **Behavior preservation:** Does every task avoid changing user-facing behavior unless explicitly scoped?
- **Incrementality:** Can tasks be applied independently without requiring a giant final move?
- **Ownership clarity:** Will future readers know where each responsibility lives?
- **Reference alignment:** Does the plan follow any relevant language, framework, architecture, or project-structure guidance unless the existing project convention says otherwise?
- **Rollbackability:** If one task is wrong, can it be reverted without undoing the whole refactor?

If a refactor area is too large, split it into multiple refactor plans.

## Final Response

Report:

- The refactor plan path.
- The core maintainability problem.
- Specialist guidance applied.
- The proposed target shape.
- How many executable tasks were created.
- The recommended first task.
