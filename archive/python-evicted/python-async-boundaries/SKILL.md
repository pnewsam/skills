---
name: python-async-boundaries
description: guidance for Python async boundaries and concurrency. reference this skill when writing or refactoring async Python, FastAPI handlers, async database access, background tasks, cancellations, timeouts, blocking calls, or sync/async adapter boundaries.
---

# Python Async Boundaries

## Overview

Use this skill to keep async Python code predictable. The goal is clear ownership of async work, no accidental blocking in event loops, explicit timeouts, and boundaries where sync and async code meet safely.

## Principles

- Do not mark code async unless it awaits real async work or must satisfy an async interface.
- Do not call blocking network, filesystem, CPU-heavy, or synchronous database work directly from async handlers. Offload unavoidable blocking work with `asyncio.to_thread(...)`, or a process pool for CPU-bound work.
- Run related concurrent tasks in an `asyncio.TaskGroup` (3.11+): it cancels the remaining tasks when one fails and raises an `ExceptionGroup`. Prefer it to `asyncio.gather`, which leaves siblings running on error.
- Keep task lifetime explicit. A bare `asyncio.create_task` whose result is never awaited can be garbage-collected mid-flight and have its exception swallowed; own it in a task group or a named runner with logging, error handling, and shutdown.
- Wrap external I/O with `async with asyncio.timeout(...)` (3.11+) or an equivalent deadline.
- Treat cancellation as normal control flow for request-scoped work; re-raise `CancelledError` after cleanup rather than swallowing it.
- Keep sync and async versions of the same abstraction separate unless the project already has a clear adapter pattern.

## Boundaries

- Async route handlers should await async services or adapters, not hide blocking calls.
- Async services should depend on async repositories/clients.
- Sync code can call sync services directly; do not force async up the stack without a reason.
- Background jobs should have a clear runner, queue, or task group boundary.
- Database session ownership should be explicit and consistent with the ORM/client.

```python
# Bad: blocks the event loop inside an async handler.
@router.get("/exchange-rates")
async def exchange_rates() -> dict[str, Decimal]:
    response = requests.get("https://example.com/rates", timeout=10)
    return response.json()

# Good: async path uses an async client.
@router.get("/exchange-rates")
async def exchange_rates(client: httpx.AsyncClient = Depends(get_http_client)):
    response = await client.get("https://example.com/rates", timeout=10)
    response.raise_for_status()
    return response.json()
```

## Common Refactors

- Move blocking client calls behind a sync adapter, offload them with `asyncio.to_thread`, or use a real async client.
- Add explicit timeout handling around external I/O.
- Replace scattered background task creation with a named task runner or framework-supported background task boundary.
- Separate pure CPU/data transformation code from async orchestration so it can be tested synchronously.
- Remove unnecessary `async` from functions that do no async work, unless required by a framework interface.

```python
# Bad: task lifetime and errors are unowned.
asyncio.create_task(send_receipt(invoice_id))

# Own concurrent request-scoped work in a task group.
async with asyncio.TaskGroup() as tg:
    tg.create_task(send_receipt(invoice_id))
    tg.create_task(update_ledger(invoice_id))

# For durable work that must outlive the request, hand off to a real queue.
await background_jobs.enqueue(SendReceipt(invoice_id=invoice_id))
```

## FastAPI Notes

- `async def` handlers must not directly call blocking database or network clients.
- Plain `def` handlers are acceptable for sync work; FastAPI can run them in a threadpool.
- Dependencies should match the sync/async nature of the resources they provide.
- Background tasks should not be used for critical durable work unless the project explicitly accepts their lifecycle limits.

```python
# Good for sync database work.
@router.get("/reports/{report_id}")
def get_report(report_id: str, session: Session = Depends(get_session)):
    return report_service.get_report(session, report_id)
```

## Failure Modes

- Missing timeouts cause hung requests and stuck workers.
- Unhandled task exceptions disappear or surface far from the cause.
- Blocking calls in async handlers reduce concurrency for the whole server.
- Cancellation swallowed by broad `except Exception` or cleanup code can waste work after clients disconnect.
- Mixing sync and async database sessions creates transaction and lifecycle confusion.

## Verification

Use the project's configured tests and add targeted checks for async behavior when practical:

```bash
python -m pytest
python -m pytest tests/path/to/async_test.py -q
```

For refactors touching external I/O, verify timeout paths, cancellation-sensitive cleanup, and that blocking clients are not used from async paths.
