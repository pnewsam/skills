---
name: backend-persistence
description: Backend persistence guidance for data modeling, database boundaries, migrations, transactions, consistency, repositories, query placement, retention, indexing, concurrency, and safe schema evolution. Use when backend work touches durable data or storage behavior.
---

# Backend Persistence

## Use When

Use for data modeling, schema changes, migrations, transactions, consistency, repository/query boundaries, indexing, retention, soft delete, concurrency, and data repair.

## Core Position

Persistence is a contract with time. Model durable facts carefully, change schemas compatibly, make transactions intentional, and prove data integrity with tests or migration evidence.

## Common Agent Mistakes

- Treating database schema as an implementation detail rather than a durable product contract.
- Adding nullable columns, enums, or flags without lifecycle semantics.
- Writing migrations that assume perfect production data.
- Splitting one invariant across multiple writes without a transaction.
- Hiding expensive queries behind harmless-looking helper methods.
- Ignoring concurrent updates, uniqueness, and retry behavior.
- Logging or retaining personal data without purpose or deletion behavior.

## Decision Rubric

| Concern | Preferred Guidance |
| :--- | :--- |
| Data model | Store durable facts, not transient UI state. Name tables/fields after product concepts. |
| Validation | Validate at input boundaries and enforce critical invariants with constraints where possible. |
| Transactions | Put all writes that must succeed/fail together in one explicit transaction boundary. |
| Migrations | Make production-safe, reversible when feasible, idempotent for data backfills, and compatible across deploys. |
| Queries | Keep query shape near the storage boundary; make performance-sensitive queries visible and tested. |
| Concurrency | Use uniqueness constraints, optimistic locking, row locks, or idempotency records when duplicates matter. |
| Retention | Define deletion, archival, audit, and personal-data retention behavior before data accumulates. |

## Do / Don't

| Do | Don't |
| :--- | :--- |
| Separate domain/persistence models when the project already distinguishes them. | Pass raw database records through every layer and API by default. |
| Add indexes for real query paths and verify cardinality/selectivity when possible. | Add indexes blindly to appease slow queries without checking write cost. |
| Use constraints for non-negotiable invariants. | Rely only on application code for uniqueness and referential integrity. |
| Stage breaking schema changes with expand/migrate/contract steps. | Drop or rename fields in one deploy when old code may still run. |
| Test migrations and backfills against representative messy data. | Assume local seed data represents production. |

## Review Checklist

- What durable fact is being stored, and who owns its lifecycle?
- Are critical invariants enforced by validation, database constraints, or both?
- Is the transaction boundary explicit and covered by a failure test?
- Can the schema change deploy safely with old and new application versions?
- Are queries bounded, indexed, and resistant to N+1 behavior?
- What happens under duplicate requests, concurrent writes, and partial failure?
- Is personal or regulated data minimized, retained intentionally, and deletable where required?

## Handoff Rules

- Use `backend-service-boundaries` when persistence ownership depends on use-case boundaries.
- Use `backend-jobs-queues` for backfills, async projections, deferred side effects, or retryable data repair.
- Use `compliance-privacy`, `compliance-gdpr`, or `compliance-hipaa` when personal data, ePHI, retention, deletion, or audit obligations are in scope.
- Use stack database skills such as `python-database-patterns` for ORM/session/migration tool details.
