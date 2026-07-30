---
name: analyze-design-system
description: Analyze a product UI for design-system convergence across tokens, primitives, component families, interaction patterns, states, accessibility, and migration drift. Use for a repository-wide or scoped design-system audit, consolidation assessment, legacy-component inventory, or recurring UI consistency review. Measures and ranks bounded candidates without editing code, changing styles, creating plans, or publishing results.
---

# Analyze Design System

## Outcome

Produce an evidence-backed assessment of design-system adoption and drift,
then rank a small set of bounded consolidation candidates for
`plan-feature` in Convergence mode.

This is a read-only analysis workflow. It identifies where shared UI decisions
have fragmented; it does not redesign screens, create a new visual language,
replace a component library, implement migrations, or create feature plans.

Read `references/metrics.md` before collecting metrics.

## Modes and effects

- **Broad** (default): examine tokens, components, patterns, states, and
  migration signals across the requested UI scope.
- **Tokens and visual language:** focus on semantic-token adoption, one-off
  values, scale coherence, and exceptions.
- **Components and patterns:** focus on canonical primitives, duplicate
  families, variants, states, accessibility, and legacy usage.

The workflow may inspect source, history, existing tests, Storybook or other
component documentation, and already available static-analysis or visual-test
results. It may run existing read-only inventory commands and relevant tests
when useful. It must not edit files, install tools, regenerate snapshots,
accept visual baselines, create plans, create commits, push, publish, or update
external systems.

## Routing and boundaries

Use the smallest relevant expert set:

- `ui-expert` for functional patterns, state coverage, responsive behavior,
  interaction consistency, and accessibility expectations
- `design-expert` for visual-language coherence, hierarchy, restraint, and
  whether token exceptions express a deliberate direction
- `react-expert` for React component ownership, primitive APIs, variants,
  migration boundaries, and test strategy

Load focused children only for signals that need interpretation. Do not load
React guidance for a non-React system. Once this workflow is active, use expert
and focused-skill guidance as references; do not recursively reroute the same
request or load every child in a router.

Use `analyze-quality` when the primary question is general code health,
correctness, test quality, or module structure rather than UI-system
convergence. Use a focused `ui-*`, `design-*`, or `react-*` skill for one
already-known design or implementation decision. Use `compliance-accessibility`
for a dedicated accessibility compliance assessment. This workflow may record
verified accessibility gaps that corroborate component or state fragmentation,
but it is not a compliance audit.

## Workflow

### 1. Establish the system and measurement contract

Identify the actual styling and component stack, canonical token sources,
primitive or component-library roots, documentation surfaces, and current
migration or deprecation markers. Do not assume a `components/ui` directory or
theme file is authoritative merely because it exists.

Define:

- repository revision, UI scope, and relevant history window
- eligible source and exclusions such as generated CSS, vendored libraries,
  snapshots, examples, fixtures, data visualizations, and deliberate branded
  or editorial surfaces
- canonical candidates and how adoption or duplication will be recognized
- which metrics are reproducible with existing evidence
- confidence and important blind spots, including dynamic styling, runtime
  theming, undocumented consumers, or missing visual coverage

Choose a small metric set that fits the repository. Never invent a universal
design-system score or silently treat every raw value as a defect. State the
unit of analysis for each metric. Keep source-defined, statically reachable,
and runtime-observed adoption separate.

### 2. Measure and interpret convergence signals

Collect low-cost inventory signals first, then inspect representative
consumers and history to determine whether they reflect real fragmentation.
Relevant signal families include:

- semantic-token adoption, raw-value density, unused or shadow tokens, and
  scale exceptions
- canonical primitive adoption, duplicate semantic families, legacy imports,
  wrapper layers, and migration progress
- component API and variant burden, boolean-mode combinations, and divergent
  state or responsive behavior
- applicable state coverage, accessibility behavior, visual regression
  coverage, and documentation coverage
- UI churn, repeated visual fixes, co-change, and exceptions concentrated in
  frequently modified surfaces

Route each material signal to the relevant expert. Verify semantic equivalence
before calling two components duplicates, and identify the user-visible,
maintenance, accessibility, or migration risk that consolidation would reduce.
Preserve deliberate product variation and local opt-outs that have a clear
reason. Consulting a router's own convergence guidance is sufficient when the
signal does not require a focused child.

### 3. Rank candidates and hand off

Group evidence by one shared cause and remediation path, not merely by folder,
token value, or visual similarity. Rank only candidates that have:

- a verified inconsistency, duplication, or incomplete migration
- a plausible canonical target or a specific decision that must be made
- enough consumer and state evidence to bound the blast radius
- behavior, visual, responsive, and accessibility invariants to preserve
- a proportionate before/after proof method

For each candidate report the scope, evidence, baseline, target condition,
expected benefit, migration and regression risks, first bounded change,
verification, confidence, and plausible false positives. Keep unresolved
inventory separate from ready work.

Recommend at most one independently reviewable candidate for
`plan-feature`'s Convergence mode: one evidence-backed improvement with a
baseline, target, invariants, guardrails, and proof method. When a component
family needs staged migration, hand off only the first coherent consumer or an
independently valuable prerequisite and leave later consumers as unresolved
inventory. Do not bundle a prerequisite with later migrations merely to make
the candidate larger, turn the handoff into a multi-step migration program, or
create the plan.

## Safety and output contract

- Preserve unrelated work and leave the repository and external systems
  unchanged.
- Do not recommend standardization solely to improve a metric.
- Do not replace an established library or token model without evidence that
  incremental convergence cannot meet the target.
- Do not hide behavior, accessibility, responsive, or brand differences behind
  visual similarity.
- Report commands and sources used, exclusions, missing evidence, and exact
  effects.

Return: mode and scope, measurement contract, current-system map, measured
signals, ranked candidates, unresolved inventory, one optional
`plan-feature` handoff, and an effect/state audit.
