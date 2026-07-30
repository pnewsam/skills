# Design-system analysis forward trial: 2026-07-30

## Scope

Run `analyze-design-system` in Broad mode against a disposable React fixture
with:

- one documented canonical button and token source
- one legacy button with two focused repair commits
- one bespoke clickable action
- one canonical consumer and a default-only story
- no runnable application, test suite, or visual harness

The analyzer could read source and history but could not edit, plan, install,
commit, publish, accept baselines, or use external systems.

## First-pass result

The analyzer correctly:

- mapped the canonical, legacy, and bespoke action implementations
- measured canonical component adoption as 1 of 3 eligible consumers
- separated deliberate exclusions from eligible style declarations
- verified semantic and keyboard gaps in the bespoke clickable `div`
- identified repeated legacy repair history without overstating a three-commit
  fixture as a meaningful long-term churn trend
- detected that the nominal canonical stylesheet had no tracked import path
- left the repository clean and recommended no automatic migration

The first pass exposed six precision gaps:

1. whether consulting a router required loading all of its children
2. how source-defined tokenization differs from reachable or runtime adoption
3. how to count compound declarations
4. how to report migration when canonical and legacy code share one baseline
5. how to establish applicable interaction states
6. how to keep the feature handoff to one independently reviewable slice

## Revisions

- Router guidance is sufficient unless a material signal needs a focused child;
  recursive rerouting and indiscriminate child loading are prohibited.
- Metrics must distinguish source-defined, statically reachable, built, and
  runtime-observed adoption.
- Every ratio names its unit; declaration and token-opportunity counts cannot be
  mixed.
- Same-baseline systems report current adoption and inventory, not invented
  migration progress.
- State analysis starts from the component's semantic job. Action primitives
  explicitly cover native semantics, accessible name, keyboard activation,
  focus, disabled behavior, default form behavior, and documented visuals.
- The `plan-feature` handoff is one coherent consumer or independently valuable
  prerequisite; later migrations remain inventory.

## Recheck

The recheck passed all six boundaries and produced one bounded handoff:

> Make the canonical `Button` entry statically reach its intended stylesheet,
> preserving native behavior and documented states.

It deliberately left Export and Billing migrations as follow-up inventory.
The corrected evidence distinguished:

- component-import adoption: 1 of 3 consumers
- source-defined token adoption: color 3/8 declarations, padding 1/3, radius 1/3
- statically reachable canonical component styling: 0 of 3 consumers proven
- built or runtime-observed adoption: unknown
- migration progress: not reportable from the available baseline

The fixture remained clean at the same commit. No file, Git, dependency,
network, plan, baseline, or external-system effect occurred.
