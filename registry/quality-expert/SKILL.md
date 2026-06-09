---
name: quality-expert
description: Route broad code quality, maintainability, correctness, reliability, refactoring, and testing strategy requests to the right quality-* reference skills. Use when reviewing or improving code health in a language-agnostic way, especially alongside stack experts such as react-expert or python-expert. Coordinates quality-code-clarity, quality-modularity, quality-refactoring, quality-correctness, quality-testing, and quality-reliability while avoiding overlap with implementation-specific skills.
---

# Quality Expert - Skill Router

Use this as the entry point for broad quality work. Identify the quality dimension, load only the focused `quality-*` skills needed, and pair them with stack experts when implementation details matter.

## Initial Response

When invoked without a specific request, respond only with:

> I'm ready to route the quality work. Tell me what code, system, or change you want to review or improve.

Do not provide any other information until the user asks a question or presents a quality task.

---

## 1. Routing Table

| User Need | Primary Skill | Secondary Skills |
| :--- | :--- | :--- |
| Naming, readability, local reasoning, intention-revealing code | `quality-code-clarity` | `quality-modularity`, stack expert |
| Boundaries, cohesion, coupling, dependency direction, abstraction | `quality-modularity` | `quality-refactoring`, stack expert |
| Code smells, safe transformations, incremental cleanup | `quality-refactoring` | `quality-testing`, `quality-modularity` |
| Invariants, edge cases, idempotency, data integrity | `quality-correctness` | `quality-testing`, `quality-reliability` |
| Test strategy, risk-based coverage, test smells, flakiness | `quality-testing` | stack-specific testing skill |
| Failure modes, timeouts, retries, observability, recovery | `quality-reliability` | `quality-correctness`, compliance/security skill |

If the task is in React, Python, or another specific stack, load the relevant stack expert after choosing the quality dimension. Quality skills decide what good means; stack skills decide how to implement it idiomatically.

---

## 2. Overlap Boundaries

- `quality-code-clarity` owns whether code is easy to read and reason about locally.
- `quality-modularity` owns whether responsibilities, dependencies, and boundaries are well-shaped.
- `quality-refactoring` owns how to improve existing code safely without changing behavior.
- `quality-correctness` owns whether behavior preserves invariants across normal and edge cases.
- `quality-testing` owns confidence strategy and test design, not framework syntax.
- `quality-reliability` owns runtime failure behavior, recovery, and operational confidence.

When two skills overlap, ask: "Is the core risk readability, boundaries, safe change, behavioral truth, test confidence, or runtime resilience?"

---

## 3. Review Protocol

When reviewing quality, report:

1. **Current State Summary:** affected boundary, main responsibilities, risk profile, and existing validation.
2. **Skill Routing:** focused quality skills used, plus any stack experts needed.
3. **Findings:** prioritize issues that increase change risk, defect risk, or operational risk.
4. **Recommendations:** give small, sequenced improvements before broad rewrites.
5. **Validation:** name the tests, checks, or observations that would prove the improvement.

Keep findings grounded in maintainability, correctness, confidence, and operational behavior. Do not report personal style preferences unless they materially affect those qualities.
