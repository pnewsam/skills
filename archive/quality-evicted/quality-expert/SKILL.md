---
name: quality-expert
description: Route language-agnostic code quality requests and measured quality evidence to the smallest relevant quality-* skill set and synthesize the guidance. Use when a review, improvement, or analyze-quality result spans two or more of clarity, modularity, refactoring, correctness, testing, or reliability, or when the primary quality risk is unclear. Prefer one focused quality-* skill for one clearly bounded concern; pair with stack experts for implementation details.
---

# Quality Expert - Skill Router

Use this as the entry point for cross-cutting software quality work. Use the router when the request spans two or more focused quality concerns or needs a single prioritized recommendation. Go directly to one focused `quality-*` skill when exactly one concern is clear.

Pair this with stack experts for implementation. Quality skills decide what good means; React/Python/etc. skills decide how to implement it idiomatically.

## Source Anchors

- Google engineering code review guidance: https://google.github.io/eng-practices/review/reviewer/looking-for.html
- Fowler refactoring catalog: https://refactoring.com/catalog/
- Fowler test pyramid: https://martinfowler.com/bliki/TestPyramid.html
- Google Testing Blog on E2E overuse: https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html

## Core Position

Quality is not polish. Quality is the degree to which code can be understood, changed, verified, and operated without surprising defects. Prefer small, validated improvements that reduce future risk over broad rewrites.

## Decision Rubric

| Risk Signal | Primary Skill | Secondary Skills |
| :--- | :--- | :--- |
| Hard to read, bad names, tangled conditionals, surprising cleverness | `quality-code-clarity` | `quality-refactoring` |
| Wrong responsibilities, high coupling, unclear boundaries, abstraction disputes | `quality-modularity` | `quality-refactoring`, stack expert |
| Existing code should improve without behavior change | `quality-refactoring` | `quality-testing`, `quality-modularity` |
| Edge cases, invariants, idempotency, data integrity, concurrency | `quality-correctness` | `quality-testing`, `quality-reliability` |
| What to test, test level, brittle tests, flaky tests, coverage gaps | `quality-testing` | stack-specific testing skill |
| Timeouts, retries, degradation, observability, operational failure modes | `quality-reliability` | `quality-correctness`, `compliance-security` |

If more than three rows apply, start with `quality-modularity` and `quality-correctness`, then add the most immediate risk skill.

## Evidence Routing

Treat metrics as investigation signals, not verdicts:

| Evidence | Primary Skill | Corroborate With |
| :--- | :--- | :--- |
| High churn plus high local complexity or reading cost | `quality-refactoring` | `quality-code-clarity`, recent change intent |
| Frequent co-change, dependency cycles, broad fan-out, structural outliers | `quality-modularity` | ownership and likely next changes |
| Long functions, deep nesting, dense branching, large parameter surfaces | `quality-code-clarity` | change frequency and defect history |
| Reverts, repeated bug fixes, invariant failures, boundary incidents | `quality-correctness` | `quality-testing`, runtime evidence |
| Untested churn, flakes, old skips, retries, duration variance | `quality-testing` | test purpose and failure classification |
| Incidents, timeout/retry volume, queue growth, weak recovery evidence | `quality-reliability` | workload and environment context |

Do not create a composite quality score or enforce universal thresholds. Prefer repository-relative trends and at least two corroborating signals unless direct defect or incident evidence is strong.

## Common Agent Mistakes

- Treating quality as subjective style instead of change risk, defect risk, and operability.
- Recommending rewrites when a sequence of safe refactorings would work.
- Adding abstractions because code looks similar, not because decisions repeat.
- Equating high coverage with confidence.
- Ignoring reliability and failure behavior because tests pass locally.

## Do / Don't

| Do | Don't |
| :--- | :--- |
| Name the specific quality risk before recommending changes. | Say "clean up the code" without a concrete failure mode. |
| Prefer behavior-preserving, test-backed steps. | Mix refactoring, feature changes, formatting churn, and architecture changes. |
| Route implementation details to stack skills. | Invent language/framework conventions inside generic quality skills. |
| Require validation proportional to risk. | Require exhaustive tests for low-risk trivial changes. |

## Review Checklist

- What quality risk is most likely to hurt the next change?
- Is the main issue readability, boundaries, safe refactoring, correctness, testing, or reliability?
- What is the smallest change that materially reduces the risk?
- What evidence would prove the risk is reduced?

## Handoff Rules

- Use `react-expert`, `python-expert`, or another stack expert for idiomatic implementation details.
- Use `compliance-expert` when the risk involves security, privacy, accessibility, regulated data, or audit evidence.
- Use `analyze-quality` when the user wants a recurring or repository-wide evidence-gathering pass rather than focused guidance.
- Use `plan-feature` in Convergence mode for one verified improvement; use `plan-epic` only for a deliberately managed larger program.
