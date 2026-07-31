---
name: quality-correctness
description: Correctness principles for language-agnostic software quality. Use when reasoning about invariants, edge cases, data integrity, idempotency, concurrency hazards, boundary validation, and whether code actually preserves intended behavior. Pair with quality-testing and stack experts for implementation and verification.
---

# Quality Correctness

## Use When

Use when a change may break business rules, data integrity, edge cases, permissions, retries, concurrency, or user-visible behavior.

## Source Anchors

- Google code review guidance on functionality, edge cases, and concurrency: https://google.github.io/eng-practices/review/reviewer/looking-for.html

## Core Position

Start with invariants. Correct code preserves required truths across normal inputs, edge cases, retries, partial failure, and concurrent activity.

## Common Agent Mistakes

- Testing only the happy path.
- Validating in the UI but not at the service/data boundary.
- Ignoring retry/idempotency for writes.
- Treating null/empty/missing/duplicate values as afterthoughts.
- Missing race conditions because single-run tests pass.

## Decision Rubric

| Risk | Required Question |
| :--- | :--- |
| Invariant | What must always be true before and after this code runs? |
| Boundary input | Where is untrusted or external data parsed and validated? |
| Persistence | What database constraint, transaction, or unique key protects integrity? |
| Retry | Is this operation idempotent or deduplicated? |
| Concurrency | What happens if two actors do this at the same time? |
| Time | What happens across time zones, clock skew, or boundary dates? |

## Evidence Signals

- Reverts, repeated bug-fix changes, and recurring failures can identify an
  error-prone subsystem, but inspect the changes before classifying them.
- Concentrated incidents around retries, races, partial writes, or boundary
  validation are strong evidence of an unprotected invariant.
- Changed critical rules without corresponding behavioral tests increase
  uncertainty; absence of a nearby test alone does not prove incorrectness.
- Use runtime and support evidence to corroborate static suspicion whenever
  possible.

## Do / Don't

| Do | Don't |
| :--- | :--- |
| Put critical invariants near the data or domain boundary. | Rely on UI-only checks for important rules. |
| Handle empty, missing, duplicate, malformed, min, and max cases deliberately. | Assume "normal input" is the only input. |
| Use transactions/constraints when integrity matters. | Trust application checks alone for critical uniqueness or consistency. |
| Make retry behavior explicit. | Retry unsafe writes blindly. |

## Review Checklist

- What invariant could this code violate?
- What input shape would break it?
- What happens on partial failure?
- What happens if the operation runs twice?
- What happens if two actors run it concurrently?
- What test or constraint proves the important behavior?

## Handoff Rules

- Use `quality-testing` to design regression and edge-case tests.
- Use `quality-reliability` when correctness depends on dependency failure behavior.
- Use `compliance-security` when correctness involves authorization or sensitive data boundaries.
