---
name: python-project-structure
description: project structure guidance for maintainable Python applications. reference this skill when creating, reorganizing, or refactoring Python packages, modules, imports, app entrypoints, configuration, scripts, services, utilities, or tests.
---

# Python Project Structure

## Overview

Use this skill to keep Python codebases navigable as they grow. The goal is clear package ownership, boring imports, small modules, and boundaries that make it obvious where new behavior belongs.

## Principles

- Prefer packages organized around domain or responsibility, not large catch-all modules.
- Keep entrypoints thin: CLI commands, ASGI apps, workers, and scripts should wire dependencies and delegate behavior.
- Put reusable business behavior in named modules or services, not in route handlers, scripts, notebooks, or tests.
- Avoid `utils.py` as a junk drawer. Prefer specific modules such as `dates.py`, `slugs.py`, `serialization.py`, or feature-local helpers.
- Follow the existing project convention first. Introduce a new layout only when the current one is clearly absent or failing.
- Avoid broad reorganizations. Move code at the smallest boundary that improves ownership.

## Common Layouts

For installable apps and libraries, prefer a `src/` layout when starting fresh:

```text
pyproject.toml
src/
  my_app/
    __init__.py
    main.py
    config.py
    <domain>/
tests/
```

For existing flat-layout apps, do not migrate to `src/` unless packaging/import confusion is part of the problem.

## Boundaries

- `main.py` or app entrypoints: process setup, dependency wiring, command parsing, app creation.
- Domain packages: business concepts, service logic, domain errors, data transformations.
- Infrastructure packages: database, queues, external clients, filesystem, network integrations.
- Configuration: one settings boundary that reads environment and exposes typed settings.
- Scripts: thin operational entrypoints that call reusable code.
- Tests: mirror the behavior boundaries users care about; avoid depending on private module layout unless testing internals intentionally.

### Entrypoint Example

```python
# Bad: script owns business rules and persistence details.
def main() -> None:
    rows = csv.DictReader(open("invoices.csv"))
    session = Session()
    for row in rows:
        invoice = Invoice(total=Decimal(row["total"]))
        if invoice.total <= 0:
            continue
        session.add(invoice)
    session.commit()

# Good: script wires inputs and delegates behavior.
def main() -> None:
    settings = load_settings()
    importer = InvoiceImporter(session_factory=create_session_factory(settings))
    imported = importer.import_csv(Path("invoices.csv"))
    print(f"Imported {imported} invoices")
```

## Import Guidance

- Keep imports acyclic. If two modules need each other, extract shared types or helper behavior to a lower-level module.
- Avoid import-time side effects such as opening network connections, reading large files, or constructing global clients.
- Prefer explicit imports over star imports.
- Keep public package exports intentional. Do not add broad barrel exports unless the project already uses them safely.

```python
# Bad: import-time client creation makes tests and config order fragile.
client = StripeClient(os.environ["STRIPE_API_KEY"])

def charge_invoice(invoice: Invoice) -> Charge:
    return client.charge(invoice.total)

# Good: dependency is explicit and easy to fake in tests.
def charge_invoice(invoice: Invoice, client: PaymentClient) -> Charge:
    return client.charge(invoice.total)
```

## Refactor Signals

- A module name is generic (`utils`, `helpers`, `common`) and has unrelated functions.
- Entry files contain business rules or data access.
- Import cycles force local imports inside functions.
- Tests need heavy monkeypatching because dependencies are created globally at import time.
- Feature changes require touching several unrelated top-level folders.

## Verification

For structure changes, run the project's import, type, test, and packaging checks when available:

```bash
python -m pytest
python -m compileall .
python -m mypy .
python -m ruff check .
```

Use the actual configured commands from `pyproject.toml`, `tox.ini`, `noxfile.py`, CI, or Makefile.
