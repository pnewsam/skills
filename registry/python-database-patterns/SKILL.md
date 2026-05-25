---
name: python-database-patterns
description: database and persistence guidance for Python applications. reference this skill when creating or refactoring SQLAlchemy models, sessions, transactions, repositories, migrations, query boundaries, async database access, fixtures, or persistence tests.
---

# Python Database Patterns

## Overview

Use this skill to keep Python persistence code predictable. The goal is explicit session ownership, transaction boundaries, query code that lives in known places, and migrations that preserve data safely.

## Principles

- Make session or connection ownership explicit.
- Keep transaction boundaries at service, unit-of-work, route, or job boundaries. Do not scatter commits through low-level helpers.
- Keep query construction in repositories, data-access modules, or clearly named service methods.
- Do not leak database-specific models into API responses unless the project intentionally uses that style.
- Keep sync and async database stacks separate and consistent.
- Prefer simple queries first. Add repository abstractions only when they reduce duplication or clarify ownership.

## Session And Transaction Boundaries

- One request, command, or job should have a clear database session lifecycle.
- Commit once at the owning boundary when a unit of work succeeds.
- Roll back on failure.
- Do not commit inside helper functions that callers might compose into larger operations.
- Avoid long-lived sessions stored in globals.
- For async apps, use async sessions/clients all the way through the async path.

```python
# Bad: helper commits, so callers cannot compose it into a larger transaction.
def create_invoice(session: Session, draft: InvoiceDraft) -> Invoice:
    invoice = Invoice.from_draft(draft)
    session.add(invoice)
    session.commit()
    return invoice

# Good: service owns the unit of work.
def create_invoice(session: Session, draft: InvoiceDraft) -> Invoice:
    invoice = Invoice.from_draft(draft)
    session.add(invoice)
    return invoice


def create_and_send_invoice(session: Session, draft: InvoiceDraft) -> Invoice:
    invoice = create_invoice(session, draft)
    send_invoice(invoice)
    session.commit()
    return invoice
```

## Models And Schemas

- Persistence models represent database tables or documents.
- API schemas represent public input/output.
- Domain objects represent business concepts.
- Mapping between layers belongs at boundaries, not scattered through handlers and tests.
- Avoid adding fields to persistence models only to satisfy one API response shape.

## Query Placement

Good places for queries:

- Feature-local repository modules.
- Data-access classes with explicit dependencies.
- Service methods when the query is tightly coupled to a single business operation.

Poor places for queries:

- Route handlers with lots of business branching.
- Pydantic schema methods.
- Import-time globals.
- Generic `db.py` files that collect unrelated queries.

```python
class InvoiceRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def get_open_for_customer(self, customer_id: str) -> list[Invoice]:
        statement = (
            select(Invoice)
            .where(Invoice.customer_id == customer_id)
            .where(Invoice.status == InvoiceStatus.OPEN)
            .order_by(Invoice.created_at.desc())
        )
        return list(self.session.scalars(statement))
```

## Migrations

- Treat migrations as production code.
- Never edit a migration that has already been applied in shared environments unless the team explicitly allows it.
- Prefer additive migrations for live systems: add nullable column, backfill, switch code, enforce constraints later.
- Separate schema changes from risky data backfills when practical.
- Verify downgrade/rollback expectations according to the project's migration policy.

```text
Safer live migration:
1. Add nullable column.
2. Deploy code that writes both old and new shapes.
3. Backfill existing rows.
4. Deploy code that reads the new shape.
5. Add NOT NULL or uniqueness constraints.
```

## Performance And Correctness

- Watch for N+1 queries when looping over ORM relationships or issuing queries inside loops.
- Be explicit about eager loading when a caller needs related data.
- Keep pagination, ordering, and filtering stable and deterministic.
- Use database constraints for invariants that must hold under concurrency.
- Use idempotency keys or uniqueness constraints for retryable writes.

```python
# Bad: may issue one customer query per invoice.
for invoice in invoices:
    print(invoice.customer.name)

# Good: load the relationship required by the caller.
statement = select(Invoice).options(selectinload(Invoice.customer))
invoices = session.scalars(statement).all()
```

## Testing

- Use a dedicated test database, transaction rollbacks, or isolated schemas according to the project setup.
- Seed only the data each test needs.
- Test repository/query behavior directly when it contains nontrivial filtering, joins, constraints, or transaction logic.
- For API tests, verify persistence side effects through public behavior or focused database assertions.

## Refactor Signals

- Commits happen inside low-level helper functions.
- Route handlers contain complex queries and transaction logic.
- Sync database calls are used from async request paths.
- Tests depend on shared database state from other tests.
- Migrations combine unrelated schema and data changes.
- Query code is duplicated across routes, jobs, and scripts.

## Verification

Use the project's configured checks:

```bash
python -m pytest
alembic upgrade head
alembic downgrade -1
```

Only run migration commands when the project has a safe local/test database configuration. For refactors, also run targeted tests around changed queries and transaction behavior.
