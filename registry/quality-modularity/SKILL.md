---
name: quality-modularity
description: Modularity principles for language-agnostic code quality. Use when assessing cohesion, coupling, responsibility boundaries, dependency direction, abstractions, module seams, ownership, and change isolation. Pair with stack experts for framework-specific file and module conventions.
---

# Quality Modularity

## Use When

Use when a change touches too many places, a module has multiple responsibilities, abstractions feel wrong, or boundaries are unclear.

## Source Anchors

- Google code review guidance on design and complexity: https://google.github.io/eng-practices/review/reviewer/looking-for.html
- Fowler refactorings: Extract Class, Move Function, Inline Class, Hide Delegate, Remove Middle Man, Replace Subclass with Delegate: https://refactoring.com/catalog/

## Core Position

A good boundary makes common changes local and uncommon changes possible. Split by reason to change, not by file length. Abstract only around repeated decisions or real volatility.

## Common Agent Mistakes

- Splitting files because they are long, while preserving the same tangled responsibility.
- Creating generic abstractions after seeing two similar blocks.
- Moving code without changing dependency direction.
- Letting UI, transport, database, or vendor details leak into domain rules.
- Ignoring circular dependencies because imports still compile.

## Decision Rubric

| Symptom | Action |
| :--- | :--- |
| One unit changes for unrelated reasons | Split by responsibility. |
| Callers know internal storage or ordering details | Hide data shape behind a smaller API. |
| One change causes shotgun surgery | Move behavior to the module that owns the concept. |
| Abstraction has one caller or mirrors implementation | Inline it or keep duplication until the pattern is real. |
| Volatile mechanism depends on stable policy | Invert dependency so policy is independent. |

## Do / Don't

| Do | Don't |
| :--- | :--- |
| Keep related data and behavior together. | Scatter one concept across utility files. |
| Put boundaries around IO, vendors, persistence, time, randomness, and policy. | Let every caller directly manage volatile details. |
| Prefer small public APIs and private implementation. | Expose every helper because "someone might need it." |
| Accept local duplication before the right abstraction is clear. | Create framework-y abstractions from coincidence. |

## Review Checklist

- What responsibility does this module own?
- What change would force this boundary to change?
- Can important behavior be tested without unrelated infrastructure?
- Are dependencies flowing toward stable policy and away from volatile mechanisms?
- Would the next likely change be local?

## Handoff Rules

- Use `quality-refactoring` to sequence boundary changes safely.
- Use stack experts for package layout, component/file ownership, and framework conventions.
- Use `quality-testing` when a boundary cannot be changed safely without characterization tests.
