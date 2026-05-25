---
name: apply-refactor
description: implement the next unchecked task from a docs/refactors maintainability refactor plan. use after plan-refactor, or when asked to execute one unit of a planned refactor. applies one behavior-preserving split, move, extraction, disentangling, or cleanup step idempotently, verifies it, and marks the task complete. pairs with plan-refactor.
---

# Apply Refactor

## Overview

Execute one unit from a maintainability refactor plan. The goal is to improve structure without changing behavior: split files, move code to clearer modules, extract focused units or helpers, disentangle logic, or reorganize folders in a controlled, verifiable step.

Run this skill repeatedly until the refactor plan is complete.

## Idempotency Requirements

Rerunning this skill must not duplicate files, re-extract the same code, or mark unfinished work complete.

Before editing:

1. Read the selected `docs/refactors/NNN-*.md` plan.
2. Pick the first unchecked `- [ ]` task unless the user specifies another task.
3. Inspect the working tree for partial work.
4. If the task is already complete, verify it and mark it complete instead of redoing it.
5. If all tasks are complete, report that the refactor is finished and stop.

## Use With Other Skills

This skill is domain-neutral. When the task touches a specific framework, language, runtime, or architecture, explicitly load the relevant specialist skills before editing. Use this skill to keep execution incremental and idempotent; use specialist skills to preserve domain-specific behavior and conventions.

## Safety Rules

- Preserve behavior and public APIs unless the refactor plan explicitly allows a change.
- Keep edits scoped to the current task.
- Do not opportunistically redesign behavior, rename unrelated concepts, or reorganize neighboring code.
- Do not introduce new abstractions unless they directly serve the task.
- Do not move code across feature boundaries without checking imports and ownership.
- Do not mark a task complete until verification passes or the remaining risk is clearly documented.
- Respect dirty working trees. Do not revert or overwrite user changes.

## Workflow

### 1. Load The Refactor Plan

```bash
ls docs/refactors/ 2>/dev/null
```

If no plan exists, ask the user to run `plan-refactor` or provide the plan details.

Read the plan fully. Note:

- Target scope and non-goals.
- Current and desired shape.
- Safety constraints.
- Verification commands.
- The next unchecked task.

### 2. Detect Relevant Guidance

After reading the plan and before editing, inspect the task's named files and the project stack enough to identify relevant frameworks, languages, and architectural patterns:

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

If no specialist skill fits, proceed with the general refactor workflow and follow the project's existing conventions. Do not edit until this guidance pass is complete.

### 3. Inspect The Current Code

Read the files named by the task and enough neighboring code to preserve behavior:

- Current target files.
- Callers/importers.
- Relevant tests, fixtures, generated outputs, or entry points.
- Shared types, helpers, state utilities, or constants.

For moves and extractions, search importers before editing:

```bash
rg "<export-or-symbol-name>" src tests
```

### 4. Apply One Focused Refactor

Choose the smallest edit that satisfies the task:

- Extract one focused unit, helper, type file, constants file, data file, configuration file, or orchestration piece.
- Move one responsibility to the planned folder.
- Update imports.
- Remove now-unused imports, local helpers, or constants.
- Keep names clear and consistent with the codebase.
- Preserve tests and snapshots unless the plan explicitly includes test relocation.

For stateful code:

- Keep coordination at the nearest owner that genuinely needs it.
- Move state only when ownership is clear.
- Pass or inject only the dependencies the extracted unit needs.
- Avoid new global state, registries, service locators, or context-like mechanisms unless the plan calls for them and the need is cross-cutting.

### 5. Verify

Run the plan's verification commands when available. Otherwise infer targeted checks from the project:

```bash
npm run typecheck
npm test
npm run lint
npm run build
```

Use the actual package scripts, Makefile targets, or test commands present in the repo. For user-facing changes, inspect the affected behavior manually when practical.

If verification fails, fix the refactor or leave the task unchecked with a clear blocker note.

### 6. Update The Plan

After verification:

- Change the completed task from `- [ ]` to `- [x]`.
- Add a brief note under the task or in a progress section with files changed and verification run.
- Leave future tasks unchanged.

If the task was already complete before editing, mark it complete only after verifying the current code matches the intended shape.

## Final Response

Report:

- Which task was completed.
- Files changed.
- Specialist guidance applied.
- Behavior/API preservation notes.
- Verification run and result.
- The next unchecked task, if any.
