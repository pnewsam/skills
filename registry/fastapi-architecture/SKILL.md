---
name: fastapi-architecture
description: architecture and maintainability guidance for Python FastAPI applications. reference this skill when creating, reorganizing, or refactoring FastAPI apps, APIRouter modules, Pydantic schemas, dependency injection, service layers, settings, async database boundaries, error handling, or tests.
---

# FastAPI Architecture

## Overview

Use this skill to keep FastAPI applications readable as they grow. The goal is thin HTTP handlers, clear domain boundaries, explicit dependencies, and testable business logic. Route modules should explain the API surface; services and repositories should own behavior and data access.

## Project Shape

Prefer organizing by domain or feature rather than by technical type when the app has multiple business areas:

```text
app/
  main.py
  core/
    config.py
    errors.py
  api/
    routes/
      users.py
      invoices.py
  domains/
    users/
      schemas.py
      service.py
      repository.py
    invoices/
      schemas.py
      service.py
      repository.py
  dependencies.py
tests/
```

Follow the existing project convention first. Do not reorganize the whole app if a local extraction solves the problem.

## Boundaries

- `main.py`: create the `FastAPI` app, configure middleware, register routers, and wire app-level exception handlers. Keep it free of business logic.
- Router modules: define paths, request/response models, status codes, dependencies, and HTTP-specific branching. Keep handlers thin.
- Schemas: use Pydantic models for request bodies, responses, and domain-facing DTOs. Keep persistence models separate from API schemas unless the project already intentionally combines them.
- Services: own business rules, coordination, and transactions. They should be callable from tests without ASGI or HTTP setup.
- Repositories or data access modules: own database queries, external API persistence, and storage details.
- Dependencies: use FastAPI dependency injection for request-scoped concerns such as auth, current user, sessions, clients, and settings.
- Settings: centralize configuration in one settings module, usually Pydantic settings or the project's established equivalent.

## Refactor Guidance

- Extract route handlers when a router mixes several domains or has repeated dependency setup.
- Move business rules out of route handlers before splitting routers if handlers are doing too much.
- Move repeated response shaping, validation, or query construction into named helpers or services.
- Keep dependency functions small and explicit. Avoid hidden global clients when dependency injection would make tests cleaner.
- Keep async boundaries consistent: do not call blocking database or network clients directly from async handlers unless the project already wraps them safely.
- Preserve public API behavior: paths, methods, status codes, response shapes, error shapes, auth requirements, and OpenAPI-visible models.
- Avoid premature layering in tiny apps. A small app can have routers and schemas without a full service/repository split until business logic justifies it.

### Thin Route Example

```python
# Bad: HTTP, validation, business rules, and persistence all in one handler.
@router.post("/invoices/{invoice_id}/send")
async def send_invoice(invoice_id: str, session: AsyncSession = Depends(get_session)):
    invoice = await session.get(Invoice, invoice_id)
    if invoice is None:
        raise HTTPException(status_code=404, detail="Invoice not found")
    if invoice.status != "draft":
        raise HTTPException(status_code=409, detail="Invoice cannot be sent")
    invoice.status = "sent"
    await email_client.send(invoice.customer_email, render_invoice(invoice))
    await session.commit()
    return InvoiceResponse.model_validate(invoice)

# Good: route describes the API boundary; service owns the workflow.
@router.post("/invoices/{invoice_id}/send", response_model=InvoiceResponse)
async def send_invoice(
    invoice_id: str,
    service: InvoiceService = Depends(get_invoice_service),
) -> InvoiceResponse:
    invoice = await service.send_invoice(invoice_id)
    return InvoiceResponse.model_validate(invoice)
```

## Error Handling

- Convert domain errors to HTTP responses at the API boundary, not throughout business logic.
- Prefer typed domain exceptions or result objects over raising `HTTPException` from deep service code.
- Keep error response shapes consistent with the existing app.
- Register exception handlers centrally when the same domain error appears in multiple routers.

```python
@app.exception_handler(InvoiceNotFoundError)
async def invoice_not_found_handler(
    request: Request,
    error: InvoiceNotFoundError,
) -> JSONResponse:
    return JSONResponse(
        status_code=404,
        content={"error": "invoice_not_found", "invoice_id": error.invoice_id},
    )
```

## Testing

- Test route behavior with FastAPI's test client or the project's async client setup.
- Test service logic directly without HTTP when possible.
- Override dependencies in tests rather than monkeypatching globals.
- Include regression checks for paths, status codes, response bodies, auth behavior, and validation errors when a refactor touches routers or schemas.

```python
def test_send_invoice_uses_service(app: FastAPI, client: TestClient) -> None:
    service = FakeInvoiceService()
    app.dependency_overrides[get_invoice_service] = lambda: service

    response = client.post("/invoices/inv_123/send")

    assert response.status_code == 200
    assert service.sent_invoice_ids == ["inv_123"]
```

## Refactor Plan Checklist

When planning or applying a FastAPI refactor, identify:

- Routers and paths affected.
- Pydantic request/response models affected.
- Dependencies and settings involved.
- Service or repository boundaries to create or preserve.
- Database/session ownership and async behavior.
- Tests that prove HTTP behavior and business logic stayed the same.
