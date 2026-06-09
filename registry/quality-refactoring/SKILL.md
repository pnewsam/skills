---
name: quality-refactoring
description: "Language-agnostic refactoring principles: identifying code smells, making safe incremental transformations, preserving behavior, improving names and boundaries, and sequencing cleanup work. Use when improving existing code without changing user-visible behavior. Pair with quality-testing and stack experts for validation and idioms."
---

# Quality Refactoring

Refactoring changes structure without changing observable behavior. It should make the next change safer, clearer, or smaller.

## Safety Protocol

1. **Name the behavior to preserve.** Identify current inputs, outputs, side effects, and edge cases.
2. **Find or add characterization coverage.** Use existing tests when possible; add focused regression tests when behavior is risky or unclear.
3. **Make one transformation at a time.** Rename, extract, move, invert dependency, or simplify conditionals in small steps.
4. **Run validation after meaningful steps.** Prefer fast targeted tests, then broader checks near the end.
5. **Stop when the next change is easy.** Refactoring is not a mandate to perfect the whole area.

## Common Transformations

- Rename for intent.
- Extract function for a named concept.
- Extract module/service around a responsibility.
- Inline a misleading abstraction.
- Replace conditionals with named predicates or strategy only when it reduces branching.
- Move side effects to the boundary.
- Separate parsing/validation from domain behavior.
- Replace primitive obsession with a named value object or validated type where the language supports it.

## Smells Worth Acting On

- Long function with multiple levels of abstraction.
- Conditional logic duplicated across call sites.
- Comments explaining tangled code that could be named instead.
- Hidden temporal coupling: callers must invoke methods in a fragile order.
- Data clumps passed together repeatedly.
- Tests that require excessive setup because the unit owns too much.

## Avoid

- Rewrites disguised as refactors.
- Broad file moves without behavior protection.
- Introducing patterns because they are fashionable.
- Changing formatting, naming, behavior, and architecture in one diff.
- Refactoring code that is about to be deleted or whose requirements are unknown.

## Output Guidance

When recommending refactors, include:

- The smell.
- The risk it creates.
- The smallest safe transformation.
- The validation that should pass.
