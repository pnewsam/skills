---
name: python-testing
description: testing guidance for Python applications. reference this skill when adding, reorganizing, or refactoring pytest suites, fixtures, dependency overrides, async tests, mocks, factories, integration tests, or regression coverage.
---

# Python Testing

## Overview

Use this skill to keep Python tests useful, focused, and maintainable. The goal is tests that verify behavior through stable boundaries, with fixtures that make setup clear instead of hiding the system under a pile of magic.

## Principles

- Test behavior at the narrowest reliable boundary.
- Prefer real collaborators for cheap pure code and fakes for expensive or external systems.
- Use monkeypatching sparingly. If tests require lots of monkeypatching, the production code likely needs better dependency injection.
- Keep fixtures explicit and local until multiple test modules genuinely share setup.
- Avoid autouse fixtures unless they enforce a global invariant such as environment isolation.
- Regression tests should name the bug or behavior they protect.

## Test Boundaries

- Unit tests: pure functions, services, validators, mappers, and domain logic.
- Integration tests: database behavior, framework routing, serialization, dependency wiring, external client adapters with fakes.
- End-to-end tests: only for critical flows where lower-level tests cannot provide confidence.

For FastAPI apps, use dependency overrides for request-scoped dependencies and test services directly when HTTP is not the behavior under test.

## Fixtures

- Name fixtures after the role they play: `db_session`, `user_factory`, `settings`, `api_client`.
- Keep fixture scope as narrow as practical. Use session-scoped fixtures only for immutable or expensive setup.
- Prefer factories/builders for varied data over many near-duplicate fixtures.
- Keep test data close to the test unless it is shared domain vocabulary.
- Clean up external resources deterministically.

### Fixture Example

```python
# Bad: hidden state and unclear relationship between fixtures.
@pytest.fixture(autouse=True)
def setup_everything(monkeypatch):
    monkeypatch.setenv("PAYMENTS_ENABLED", "false")
    create_user(email="a@example.com")
    create_invoice(total=100)

# Good: tests request the setup they actually need.
@pytest.fixture
def user_factory(db_session):
    def create_user_for_test(**overrides):
        user = User(email=overrides.get("email", "a@example.com"))
        db_session.add(user)
        db_session.flush()
        return user

    return create_user_for_test
```

## Mocking

- Mock at system edges: network calls, clocks, random IDs, filesystem, queues, email, payment providers.
- Do not mock the function being tested or its immediate pure helpers.
- Prefer fakes when a dependency has meaningful behavior across several tests.
- Assert observable outcomes first; assert calls only when the interaction is the behavior.

```python
class FakeEmailClient:
    def __init__(self) -> None:
        self.sent: list[Email] = []

    def send(self, email: Email) -> None:
        self.sent.append(email)


def test_invoice_send_emails_customer() -> None:
    email_client = FakeEmailClient()
    service = InvoiceService(email_client=email_client)

    service.send_invoice(invoice)

    assert email_client.sent == [Email(to=invoice.customer_email)]
```

## Async Tests

- Use the project's configured async test runner, such as `pytest-asyncio` or `anyio`.
- Await async work directly. Avoid sleeping to wait for background work unless there is no deterministic signal.
- Keep event loop and database/session fixtures aligned with the project's async stack.

```python
@pytest.mark.anyio
async def test_fetch_invoice(async_client: AsyncClient) -> None:
    response = await async_client.get("/invoices/inv_123")

    assert response.status_code == 200
    assert response.json()["id"] == "inv_123"
```

## Refactor Signals

- A small behavior change breaks many unrelated tests.
- Fixtures form a hidden dependency chain that is hard to inspect.
- Tests rely on private implementation details instead of public behavior.
- Many tests patch the same global client or settings object.
- Integration tests duplicate large setup blocks.

## Verification

Use the project's configured commands:

```bash
python -m pytest
python -m pytest tests/path/to/test_file.py -q
python -m coverage run -m pytest
```

When changing test structure, run both the moved/changed tests and at least one adjacent suite that exercises the same production boundary.
