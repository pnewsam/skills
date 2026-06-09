---
name: quality-testing
description: Language-agnostic testing strategy and test quality principles. Use when deciding what to test, which level to test at, how to evaluate test ROI, how to avoid brittle tests, and how to manage regression confidence. Pair with react-testing, python-testing, or other stack-specific testing skills for framework details.
---

# Quality Testing

Testing is a confidence strategy, not a coverage ritual. The goal is to catch meaningful regressions at the lowest sustainable cost.

## Test Strategy

### 1. Test Risks, Not Files

Prioritize tests for:

- Critical user or business workflows.
- Complex branching or calculations.
- Security, money, permissions, or data integrity.
- Bugs that already happened.
- Integration boundaries where assumptions often drift.

Do not add tests merely because a file changed.

### 2. Choose The Right Level

- **Unit tests:** pure logic, calculations, transformations, validation rules.
- **Integration tests:** module boundaries, persistence, APIs, service collaboration.
- **End-to-end/browser tests:** critical user flows and high-value smoke coverage.
- **Contract tests:** provider/consumer boundaries, third-party or cross-service assumptions.

Prefer the lowest level that proves the behavior without mocking away the risk.

### 3. Write Regression Tests At The Failure Level

When fixing a bug, test at the level where the bug was observable. A parser bug may need a unit test; a checkout failure may need an integration or end-to-end test.

### 4. Keep Tests Stable

Good tests:

- Assert behavior, not implementation.
- Have deterministic data, time, and randomness.
- Avoid shared mutable state between tests.
- Fail with useful messages.
- Do not depend on execution order.

### 5. Treat Flakiness As A Quality Defect

A flaky test trains people to ignore failures. Fix timing, isolation, data setup, and external dependencies. Delete or quarantine only with a visible follow-up plan.

## Test Smells

- Tests mirror implementation structure rather than behavior.
- Mocks replace the thing being tested.
- Test setup is larger than the scenario.
- Assertions prove that code was called, not that behavior happened.
- Coverage is high but critical flows are untested.
- Tests are skipped without a tracked reason.

## Review Checks

- What regression would this test catch?
- Is the test at the cheapest reliable level?
- Does it verify behavior a user or caller depends on?
- Would this test survive a harmless refactor?
- What important risk remains untested?
