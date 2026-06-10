---
name: quality-code-clarity
description: Code clarity principles for language-agnostic maintainability. Use when improving naming, readability, local reasoning, control flow, comments, intention-revealing structure, hidden dependencies, and removal of clever or surprising code. Pair with stack experts for idiomatic implementation details.
---

# Quality Code Clarity

## Use When

Use when code is technically working but hard to read, reason about, review, or safely modify.

## Source Anchors

- Google code review guidance on complexity, naming, and comments: https://google.github.io/eng-practices/review/reviewer/looking-for.html
- Fowler refactorings: Rename Variable, Extract Function, Extract Variable, Decompose Conditional, Replace Nested Conditional with Guard Clauses: https://refactoring.com/catalog/

## Core Position

Clear code makes intent obvious at the point of use. A maintainer should understand the main path, inputs, outputs, failure modes, and assumptions without reconstructing distant context.

## Common Agent Mistakes

- Renaming everything cosmetically without improving domain meaning.
- Adding comments that restate code instead of simplifying the code.
- Hiding important decisions in clever expressions, nested ternaries, or chained calls.
- Leaving boolean conditions unnamed when they encode product rules.
- Keeping hidden global state or ambient dependencies because "it works."

## Decision Rubric

| Symptom | Action |
| :--- | :--- |
| Reader must parse mechanics to infer meaning | Rename or extract an intention-revealing helper. |
| Main path is buried under error/edge handling | Use guard clauses or early returns. |
| Boolean condition has domain meaning | Extract a named predicate. |
| Function depends on distant mutable state | pass dependency explicitly or isolate side effect at boundary. |
| Comment explains what the code does | Simplify/rename the code; keep comments for why/constraints. |

## Do / Don't

| Do | Don't |
| :--- | :--- |
| Use names from the domain, not implementation mechanics. | Use `data`, `item`, `manager`, `handler`, or `process` when a domain noun exists. |
| Name booleans as predicates: `isEligible`, `hasPermission`, `shouldRetry`. | Use ambiguous booleans like `flag`, `enabled`, or `status` without context. |
| Keep the primary path visually straight. | Nest three or more levels when guard clauses would clarify. |
| Comment surprising constraints, tradeoffs, and external contracts. | Comment obvious assignments or control flow. |

## Review Checklist

- Can a new maintainer identify the main path in under a minute?
- Are names specific enough to survive extraction?
- Are important assumptions, constraints, and failure modes visible?
- Can complex conditions be named without changing behavior?
- Is any cleverness increasing reading cost more than it saves lines?

## Handoff Rules

- Use `quality-refactoring` if clarity requires behavior-preserving transformations.
- Use `quality-modularity` if clarity fails because one unit owns too many responsibilities.
- Use the relevant stack expert for naming/file conventions and idiomatic syntax.
