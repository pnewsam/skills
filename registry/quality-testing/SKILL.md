---
name: quality-testing
description: Language-agnostic testing strategy and test quality principles. Use when deciding what to test, which level to test at, how to evaluate test ROI, how to avoid brittle tests, and how to manage regression confidence. Pair with react-testing, python-testing, or other stack-specific testing skills for framework details.
---

# Quality Testing

## Use When

Use when deciding test strategy, test level, regression coverage, flakiness response, or whether a test is worth writing.

## Source Anchors

- Fowler test pyramid: https://martinfowler.com/bliki/TestPyramid.html
- Google Testing Blog on end-to-end test overuse: https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html
- Google code review guidance on tests: https://google.github.io/eng-practices/review/reviewer/looking-for.html

## Core Position

Test risk, not files. Coverage percentage is a weak proxy. A good test would fail for a meaningful regression, at the cheapest reliable level, without making harmless refactors painful.

## Common Agent Mistakes

- Adding tests just because a file changed.
- Mocking away the behavior the test claims to prove.
- Using broad UI/E2E tests for logic that a unit or service test could prove.
- Accepting flaky tests as "known issues."
- Asserting implementation calls instead of user/caller-observable behavior.

## Decision Rubric

| Risk | Test Level |
| :--- | :--- |
| Pure calculation, parser, mapper, validation rule | Unit test. |
| Service collaboration, persistence, API contract, integration boundary | Integration or contract test. |
| Critical user workflow or smoke path | End-to-end/browser test. |
| Bug fix | Test at the level where the bug was observable; add lower-level test if broad test exposed missing coverage. |
| Refactor only | Existing tests should pass; add characterization tests if behavior is risky or unclear. |

## Do / Don't

| Do | Don't |
| :--- | :--- |
| Prefer the lowest level that proves the behavior. | Default to E2E because it feels realistic. |
| Assert behavior and outcomes. | Assert private methods, component internals, or call counts unless that is the contract. |
| Make data, time, randomness, and environment deterministic. | Share mutable state or rely on test order. |
| Fix, delete, or visibly track flaky tests. | Leave skipped/flaky tests without an owner and reason. |

## Review Checklist

- What regression would this test catch?
- Would it fail if the behavior were broken?
- Is this the cheapest reliable level?
- Does the test survive harmless refactoring?
- What important risk remains untested?
- Is any existing failure flaky, unrelated, or a real regression?

## Handoff Rules

- Use `react-testing`, `python-testing`, or another stack testing skill for framework syntax and fixtures.
- Use `quality-correctness` to identify edge cases and invariants worth testing.
- Use browser-test workflow skills only when browser/user-flow coverage is actually needed.
