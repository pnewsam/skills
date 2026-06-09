---
name: quality-correctness
description: Correctness principles for language-agnostic software quality. Use when reasoning about invariants, edge cases, data integrity, idempotency, concurrency hazards, boundary validation, and whether code actually preserves intended behavior. Pair with quality-testing and stack experts for implementation and verification.
---

# Quality Correctness

Correctness means the system preserves its intended truths across ordinary use, edge cases, retries, partial failure, and hostile inputs.

## Principles

### 1. Name The Invariants

An invariant is something that must remain true:

- A balance cannot go negative.
- A user cannot access another user's private data.
- An order cannot be both cancelled and fulfilled.
- A migration cannot run twice and corrupt data.

Make invariants explicit in code, tests, validation, schema constraints, or documented assumptions.

### 2. Validate At Boundaries

Validate untrusted input at system boundaries: API, CLI, job payload, database read, file import, third-party callback, user input, and environment config.

Inside trusted boundaries, prefer validated types or normalized data over repeated defensive checks.

### 3. Design For Edge Cases

Check:

- Empty, null, missing, duplicated, and malformed inputs.
- Minimum and maximum values.
- Time zones, clock skew, and daylight saving transitions.
- Partial success and retry.
- Concurrent updates.
- Deleted or stale referenced records.

### 4. Make Idempotency Deliberate

Operations that may retry should be safe to run more than once, or they should have explicit deduplication keys, transaction boundaries, or conflict handling.

### 5. Preserve Data Integrity Near The Data

Use database constraints, unique indexes, transactions, and schema validation where available. Application checks are useful, but integrity that matters should not rely only on UI behavior.

## Review Checks

- What must always be true after this code runs?
- Where is untrusted input validated?
- What happens if the operation is retried?
- What happens if two copies run at the same time?
- Which edge case would cause the most damage?
- Is there a test or constraint proving the important invariant?
