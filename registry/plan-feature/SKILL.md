---
name: plan-feature
description: Create or update a structured plan for one bounded, independently verifiable product feature or convergence improvement. Use after product direction is clear or after an analyze-* workflow identifies a quality, security, design-system, defect, dependency, testing, or other maintenance candidate. Product mode aligns to a charter and parent epic; Convergence mode consumes evidence directly and records a baseline, target, invariants, guardrails, and verification. Writes local docs/features planning artifacts only and never implements, commits, pushes, or publishes.
---

# Plan Feature

## Outcome

Produce one implementation-ready `docs/features/NNN-<slug>.md` plan for a
bounded change. A feature is the durable unit consumed by `execute-feature`;
it may deliver user value or converge an existing system toward a measurable
known-good state.

Use `references/feature_template.md` when writing the plan.

## Modes and effects

- **Product mode:** plan a user-facing or enabling capability. Require a
  relevant charter and parent epic, and preserve their goals and non-goals.
- **Convergence mode:** plan one evidence-backed improvement from
  `analyze-quality`, `analyze-security`, another `analyze-*` workflow, or
  equivalent user-supplied evidence. A parent epic is optional. Do not invent a
  user story when the real outcome is maintainability, security, reliability,
  consistency, or defect reduction.

This workflow may create or update one local feature plan. It must not modify
source or configuration, create branches or commits, push, publish, or update
external trackers.

## Inputs

Product mode needs:

- the product outcome and user or enabling value
- `docs/CHARTER.md` and the relevant parent epic
- available designs, contracts, dependencies, and constraints

Convergence mode needs:

- the analyzed finding or equivalent evidence
- affected scope and current baseline
- expected target or condition
- behavior, interfaces, or controls that must remain invariant
- measurement method, window, exclusions, and confidence when metrics are used
- verification and rollback or recovery expectations

If the evidence is unverified, ambiguous, or still a long inventory, stop and
recommend the relevant `analyze-*` workflow. If the work contains independent
outcomes, plan only one and leave the others for separate invocations.

## Workflow

### 1. Establish context and boundary

Inspect existing feature plans and relevant repository documentation to avoid
duplication. In Product mode, read the charter and parent epic and name the
goal and non-goal this feature advances. In Convergence mode, inspect the
finding evidence, existing work, and any relevant quality, compliance, design,
stack, or platform references.

Define one independently verifiable outcome. Keep the implementation and review
surface focused; split unrelated findings, ecosystems, controls, component
families, or behavior changes. Prefer work that can be completed in days to two
weeks. Use an epic only when the user is deliberately managing a larger program.

### 2. Define the plan and proof

Write:

- outcome, context, scope, and explicit non-goals
- testable acceptance criteria and one to three implementation tasks
- dependencies, affected boundaries, and compatibility risks
- verification, rollback or recovery, and definition of done

Make every task a vertical, independently committable implementation and
verification unit. Include its focused tests, documentation, and evidence in
the same task when they are required for that change. Do not create separate
sequential tasks for a failing test, its implementation, and final
verification: an `execute-feature` run must not stop with required checks
failing. For a small feature that must land atomically, prefer one task.

For Product mode, include the user story and charter/epic alignment.

For Convergence mode, include:

- source finding or stable evidence marker
- baseline and target
- metric method, window, exclusions, confidence, and limitations
- behavior or control invariants
- guardrails that must not regress
- negative tests, scanner rechecks, visual checks, or runtime evidence when
  relevant

Use at most three primary success metrics. Metrics are evidence, not goals to
game. A structural change must identify the change or risk it makes easier.

### 3. Write, validate, and report

Assign the next available feature ID and create or update the feature plan. On
update, preserve its ID, completed work, evidence, and accurate history.

Validate that:

- the outcome is one coherent, independently reviewable change
- every must-have criterion is objectively verifiable
- Product mode aligns with its charter and parent epic
- Convergence mode has evidence, a baseline, a target, invariants, and a
  proportionate proof method
- non-goals prevent adjacent cleanup or unrelated hardening
- each task can finish with its required checks passing and a reviewable commit
- `execute-feature` can perform the next unchecked item without rediscovering
  the intent or depending on a later task to make the repository healthy

Report the path, mode, outcome, size, evidence or alignment concerns, and the
recommended `execute-feature` invocation.

## Safety and idempotency

- Preserve unrelated plans and working-tree changes.
- Never include secrets, credentials, private scanner logs, or sensitive raw
  data in the plan.
- Reuse an existing plan when its outcome and evidence match; do not duplicate
  work that already has a credible owner.
- Do not silently convert an analysis inventory into multiple plans.
- Do not advance to implementation without explicit user intent.
