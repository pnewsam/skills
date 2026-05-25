---
name: python-error-handling
description: error handling guidance for Python applications. reference this skill when designing or refactoring exceptions, domain errors, API error translation, logging, retries, validation failures, transaction rollback behavior, or CLI/service boundary failures.
---

# Python Error Handling

## Overview

Use this skill to make Python failure paths explicit and boring. The goal is clear domain errors, consistent boundary translation, useful logs, and no swallowed failures.

## Principles

- Raise exceptions for exceptional or unrecoverable failures; return explicit values for normal absence or expected branching.
- Use typed exception classes for programmatic handling. Do not parse error message strings.
- Catch errors at boundaries where you can translate, retry, log, or recover meaningfully.
- Do not catch broad exceptions inside domain logic unless you re-raise, wrap, or convert them intentionally.
- Preserve traceback context with `raise` or `raise ... from ...`.
- Keep sensitive values out of exception messages and logs.

## Error Boundaries

- API boundary: translate domain errors to HTTP status codes and response shapes.
- CLI boundary: translate failures to user-readable messages and nonzero exit codes.
- Job/worker boundary: log context, classify retryable failures, and decide retry/dead-letter behavior.
- Repository/client boundary: wrap low-level persistence or network errors only when it improves caller behavior.
- Domain layer: raise or return domain-specific failures without importing framework-specific error types.

```python
# Bad: framework error leaks into domain logic.
def send_invoice(invoice: Invoice) -> None:
    if invoice.status != "draft":
        raise HTTPException(status_code=409, detail="Invoice cannot be sent")

# Good: domain raises a domain error.
def send_invoice(invoice: Invoice) -> None:
    if invoice.status != "draft":
        raise InvalidInvoiceTransitionError(invoice.id, invoice.status)
```

## Domain Errors

Prefer small typed errors with meaningful names:

```python
class InvoiceNotFoundError(Exception):
    def __init__(self, invoice_id: str) -> None:
        self.invoice_id = invoice_id
        super().__init__(f"Invoice not found: {invoice_id}")
```

Use domain errors for conditions callers can handle: not found, invalid transition, permission denied, quota exceeded, conflict, duplicate key, or external dependency unavailable.

## API Translation

- Keep framework-specific exceptions at the API boundary.
- Do not raise `HTTPException` from deep service or repository code unless the project explicitly uses route-level services only.
- Keep error response shapes consistent with the existing app.
- Register shared exception handlers when the same domain error appears across multiple routes.

```python
@router.post("/invoices/{invoice_id}/send")
async def send_invoice(invoice_id: str) -> InvoiceResponse:
    try:
        invoice = await invoice_service.send(invoice_id)
    except InvalidInvoiceTransitionError as error:
        raise HTTPException(
            status_code=409,
            detail={"error": "invalid_invoice_transition", "status": error.status},
        ) from error
    return InvoiceResponse.from_domain(invoice)
```

## Logging

- Log where the failure is handled, not at every layer.
- Include stable identifiers and operation names; avoid raw secrets, tokens, passwords, and sensitive payloads.
- Do not log and then silently continue unless continuing is the intended recovery behavior.
- Use `logger.exception` inside exception handlers when stack traces are useful.

```python
try:
    await payment_client.capture(payment_id)
except PaymentProviderError:
    logger.exception("payment_capture_failed", extra={"payment_id": payment_id})
    raise
```

## Retries

- Retry only failures that are plausibly transient.
- Use bounded retries with backoff for external network calls, queues, and dependency outages.
- Do not retry validation errors, permission failures, invariant violations, or non-idempotent writes without a safe idempotency mechanism.
- Keep retry policy near the client or job boundary, not scattered through business logic.

## Refactor Signals

- `except Exception: pass` or catch blocks that only print.
- Framework exceptions raised from domain or repository modules.
- Tests assert on fragile error message text instead of error type or response shape.
- The same error-to-response mapping is repeated across routes.
- Low-level database or HTTP client errors leak into API responses.

## Verification

When changing error handling, test both success and failure paths:

```bash
python -m pytest
```

Verify status codes, response shapes, log behavior when observable, transaction rollback for failed writes, and retry/dead-letter behavior for jobs.
