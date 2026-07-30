---
name: quality-refactoring
description: "Language-agnostic refactoring principles: identifying code smells, mapping them to safe transformations, preserving behavior, improving names and boundaries, and sequencing cleanup work. Use when improving existing code without changing user-visible behavior. Pair with quality-testing and stack experts for validation and idioms."
---

# Quality Refactoring

## Use When

Use when existing code should become easier to change without altering observable behavior.

## Source Anchors

- Fowler refactoring catalog: https://refactoring.com/catalog/
- Google code review guidance on complexity and tests: https://google.github.io/eng-practices/review/reviewer/looking-for.html

## Core Position

Refactoring is behavior-preserving structural change. If behavior changes, it is not "just refactoring" and must be planned, reviewed, and tested as feature or bug work.

## Common Agent Mistakes

- Performing a rewrite and calling it a refactor.
- Changing behavior, naming, formatting, file layout, and architecture in one diff.
- Refactoring before characterizing risky behavior.
- Adding patterns instead of making the next change easier.
- Continuing after the code is good enough for the intended next change.

## Decision Rubric

| Smell                                        | Prefer                                                                                         |
| :------------------------------------------- | :--------------------------------------------------------------------------------------------- |
| Long function with mixed abstraction levels  | Extract Function, Extract Variable, Decompose Conditional.                                     |
| Repeated branching policy                    | Consolidate Conditional Expression, Extract Function, or strategy only when variants are real. |
| Primitive obsession around meaningful values | Replace Primitive with Object or a validated type if the stack supports it.                    |
| Data clumps passed together                  | Introduce Parameter Object or Preserve Whole Object.                                           |
| Feature envy                                 | Move Function toward the data/concept it uses.                                                 |
| Misleading abstraction                       | Inline Function/Class or Remove Middle Man.                                                    |
| Flag argument controls separate behaviors    | Remove Flag Argument; expose explicit operations.                                              |

## Evidence Signals

Prioritize refactoring where change pressure and structural friction overlap:

- high relative churn plus high complexity or reading cost
- repeated bug fixes or reverts in the same area
- files that repeatedly change together across an unclear boundary
- duplicated decisions or competing patterns with active usage
- an upcoming change that is difficult because of the current structure

Do not refactor solely to improve a dashboard value. Name the next change or
risk the refactor should make easier, preserve behavior, and stop when that
objective is met.

## Do / Don't

| Do                                              | Don't                                                 |
| :---------------------------------------------- | :---------------------------------------------------- |
| State the behavior that must be preserved.      | Start moving code before naming the invariant.        |
| Make one transformation at a time.              | Batch unrelated cleanup.                              |
| Run targeted validation after meaningful steps. | Trust "simple refactor" intuition for risky code.     |
| Stop when the next change is easy.              | Chase an ideal architecture with no immediate payoff. |

## Review Checklist

- What behavior is preserved?
- Which smell is being addressed?
- Which specific refactoring transformation is being applied?
- Is the diff small enough to review mechanically?
- What test/check would catch an accidental behavior change?

## Handoff Rules

- Use `quality-testing` before refactoring poorly covered, high-risk code.
- Use `quality-modularity` when refactoring changes ownership boundaries.
- Use stack experts for idiomatic transformations and framework constraints.
