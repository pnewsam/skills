---
name: python-typing-data-modeling
description: guidance for Python type hints and data modeling. reference this skill when designing or refactoring Pydantic models, dataclasses, DTOs, typed dictionaries, protocols, validation boundaries, serialization, or mypy/pyright-friendly APIs.
---

# Python Typing And Data Modeling

## Overview

Use this skill to make data shapes explicit without turning Python into ceremony. The goal is clear boundaries between external input, domain concepts, persistence models, and serialized output.

## Principles

- Types should document real contracts, not decorate unclear code.
- Validate data at boundaries: HTTP input, config, files, queues, external APIs, and database rows if needed.
- Keep domain models, API schemas, and persistence models separate when they change for different reasons.
- Avoid `Any` unless the boundary is genuinely untyped and immediately narrowed.
- Prefer small, named data shapes over dictionaries passed through several layers.
- Let existing project tooling decide strictness. Do not introduce strict mypy or pyright settings during a local refactor.

## Model Choices

- Pydantic models: external validation, API request/response schemas, settings, serialized data.
- Dataclasses: internal domain data when validation is already done or not needed.
- `TypedDict`: dictionary-shaped data from APIs, JSON, or partial records where a class would be too heavy.
- `Protocol`: structural interfaces for injectable dependencies, clients, repositories, or services.
- `Enum` or `Literal`: closed sets of values that affect branching or validation.

```python
class CreateInvoiceRequest(BaseModel):
    customer_id: str
    line_items: list[InvoiceLineItemRequest]


@dataclass(frozen=True)
class InvoiceDraft:
    customer_id: str
    line_items: tuple[LineItem, ...]


class InvoiceRepository(Protocol):
    async def save(self, draft: InvoiceDraft) -> Invoice:
        ...
```

## Boundaries

- Request schemas should describe accepted input, not database tables.
- Response schemas should describe public output, not internal objects.
- Persistence models should not leak into service APIs unless the project intentionally uses an active-record style.
- Mapping code belongs at boundaries: route/service, service/repository, external-client/domain.
- Configuration should be typed and validated once, then passed explicitly or injected.

```python
# Bad: service API depends on an HTTP request schema.
async def create_invoice(input: CreateInvoiceRequest) -> InvoiceResponse:
    ...

# Good: route maps validated input into a domain shape.
async def create_invoice_route(input: CreateInvoiceRequest) -> InvoiceResponse:
    draft = InvoiceDraft.from_request(input)
    invoice = await invoice_service.create(draft)
    return InvoiceResponse.from_domain(invoice)
```

## Refactor Guidance

- Extract shared model types when multiple modules depend on the same shape.
- Split a large schema file by domain when it contains unrelated API areas.
- Replace repeated untyped dictionaries with named models when fields are read in more than one place.
- Use `Protocol` to type dependencies instead of concrete classes when tests or multiple implementations need the same contract.
- Avoid broad model rewrites during structural refactors. Preserve serialized field names and validation behavior.

## Type Hints

- Type public functions, service methods, and boundary adapters first.
- Use `Sequence` or `Iterable` for read-only inputs when callers should not depend on a concrete list.
- Use `Mapping` for read-only dictionary inputs.
- Prefer `X | None` over sentinel values when absence is real and expected.
- Keep casts close to the untyped boundary and explain non-obvious casts.

```python
def total_for(items: Sequence[LineItem]) -> Decimal:
    return sum((item.amount for item in items), Decimal("0"))


def label_for(statuses: Mapping[str, str], status: str) -> str:
    return statuses.get(status, "Unknown")
```

## Verification

Run configured type and test checks when available:

```bash
python -m mypy .
python -m pyright
python -m pytest
```

For API or serialization changes, verify public field names, aliases, required/optional behavior, and error shapes stayed compatible.
