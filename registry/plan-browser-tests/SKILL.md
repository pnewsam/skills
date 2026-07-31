---
name: plan-browser-tests
description: Plan or audit high-value browser and end-to-end test coverage by mapping critical user flows, existing tests, stale or flaky patterns, and coverage gaps into the standard epic and feature-planning flow. Use when asked to plan browser tests, integration tests, or E2E coverage; identify critical UI flows; audit an existing browser suite; or refresh browser-test priorities. Plan mode may write one coverage epic; Audit mode is read-only unless the user explicitly requests an epic update. Never writes test code.
---

# Plan Browser Tests

## Outcome

Create an evidence-backed browser-test coverage epic, or audit an existing
suite and report prioritized findings. Keep durable work in the normal
`docs/epics/` and `docs/features/` planning flow.

## Modes

- **Plan:** identify critical flows and create or refresh a browser-test
  coverage epic. This is the default for new coverage planning.
- **Audit:** compare the current application, suite, and coverage epic and
  report verified coverage and prioritized gaps. This is read-only by default.
  Update the epic only when the user explicitly asks to refresh or apply the
  findings.

Plan mode may write one local epic. Audit mode does not write an audit artifact
or update plans without explicit user intent. Neither mode may edit test or
source code, install packages, change Git state, or write to external systems.

## What deserves browser coverage

Prioritize flows with expensive regressions:

- authentication, authorization, session, and tenant boundaries
- the product's primary value-producing workflow
- signup, onboarding, purchase, activation, and destructive operations
- creation, editing, deletion, import, export, and persistence
- permissions, branching workflows, and error recovery
- regressions that lower-level tests did not reliably prevent

Do not prioritize static content, purely visual polish, or behavior already
verified more cheaply and reliably below the browser layer.

## Shared discovery

Inspect:

- product charter and relevant feature or epic plans
- routes, forms, controls, navigation, and permission gates
- browser-test framework and configuration
- representative tests, fixtures, selectors, authentication, and data setup
- CI commands and browser-test conventions

If no framework exists, describe the required foundation as a prerequisite
child feature or ordinary setup task. Recommend a named framework only after
considering project language, runtime, team conventions, and current official
support; do not create a permanent setup workflow merely to scaffold it once.

Do not run the application or test suite in Plan mode. In Audit mode, run the
existing suite only when the user requested execution or the environment is
already available and the run is safe and proportionate.

## Plan mode

1. Map navigable screens and user-visible workflows.
2. Identify business-critical, security-sensitive, state-changing, and
   historically fragile flows.
3. Read existing tests to avoid duplicating coverage.
4. Group related flows into independently plannable child features.
5. Create or update `docs/epics/NNN-<slug>.md` using
   `references/plan_template.md`.

Preserve existing child-feature checkboxes and verified inventory entries.
Do not create feature plans unless the user also asks to plan the children.

Each proposed child feature should name:

- user outcome and route or surface
- setup and identity/permission needs
- happy path and material failure path
- stable observable result
- prerequisite fixture or environment work

## Audit mode

Read `references/audit_template.md`, then:

1. Locate the browser-test coverage epic and relevant feature plans.
2. Catalog test files and map each test to the user behavior it actually
   exercises.
3. Compare that behavior with the current routes, controls, product rules, and
   critical-flow inventory.
4. Identify missing coverage, stale routes/selectors, weak assertions, hidden
   dependencies, duplicate coverage, skipped tests, and credible flaky patterns.
5. If the suite was run, distinguish reproducible failures from static risk
   signals. A hardcoded wait is a flake risk, not proof of a flake by itself.
6. Report the audit using `references/audit_template.md`.
7. When the user explicitly requested an epic refresh, update it conservatively:
   - mark a flow covered only when a test verifies its intended outcome
   - preserve child-feature completion and notes
   - add missing or broken flow clusters as child candidates
   - do not create feature plans or test code

If no browser-test epic exists, create one in the same pass only when the user
asked to establish the plan. Otherwise report a clearly provisional audit and
recommend Plan mode.

## Prioritization

Rank a flow by:

- consequence of regression
- likelihood of regression or past instability
- absence of cheaper verification
- breadth of users and data affected
- feasibility and determinism of browser setup

Avoid pretending that every flow should be browser-tested. State why lower-level
coverage is sufficient when that is the better choice.

## Final report

Return:

- mode used
- epic path written, if any
- framework detected
- suite status when actually run
- number of critical flows and test files mapped
- highest-priority missing, broken, or flaky flow clusters
- next step: `plan-feature`, `add-browser-test`, or `fix-browser-test`
