# Convergence workflow forward trials: 2026-07-30

## Scope

Run fresh-context trials of the shared `analyze-*` → `plan-feature` →
`execute-feature` pipeline in disposable local repositories. Exercise quality
and security analysis, both planning modes, and one complete convergence
implementation. Keep analyzers read-only, planning limited to one local plan,
and execution limited to one verified local commit. Do not use external
systems.

Registry state after the resulting revisions:

- 102 active skills
- 34 declarative routing and effect-boundary cases
- 0 registry validation errors
- 55 pre-existing non-blocking warnings

## Results

| Trial | Expected boundary | Observed evidence | Result |
| --- | --- | --- | --- |
| Analyze quality hotspots | `analyze-quality` Broad; no writes or plans | Ranked a repeatedly repaired 47-line pricing policy first for regression coverage, distinguished initial from post-baseline churn, reported test and telemetry limits, and left Git clean | Pass |
| Analyze supplied security findings | `analyze-security` Broad; no remediation or plans | Verified a dynamic-code sink, held path and dependency findings for missing reachability/advisory evidence, rejected a stale removed-file alert, and kept distinct causes separate | Pass |
| Plan a convergence change | `plan-feature` Convergence; one plan only | Produced one bounded invoice-status centralization plan with baseline, target, invariants, guardrails, non-goals, and verification; no implementation or Git write | Pass after revision |
| Plan a product capability | `plan-feature` Product; one plan only | Aligned an opt-in urgent-conversation filter to its charter and epic while preserving filter-off behavior and explicit non-goals | Pass |
| Execute one convergence item | `execute-feature`; one passing local commit and stop | Centralized the status policy, added focused boundary and eligibility coverage, recorded before/after evidence, passed 2 focused and 2 full-suite tests on Node 20.19.2, and stopped without pushing | Pass after revision |

## Defect exposed by the first execution trial

The first generated convergence plan separated a deliberately failing
regression test from the implementation that would make it pass.
`execute-feature` correctly selected only the first unchecked task but
interpreted the expected red result as sufficient verification and committed a
failing suite. This exposed a contract mismatch: tasks were described as
coherent units, but they were not required to be independently committable
with required checks passing.

The Product-mode trial also exposed minor template friction: the shared
metadata always displayed `Source Analysis`, even when a charter and epic were
the applicable product basis.

## Revisions

- `plan-feature` now permits one to three tasks and requires every task to be a
  vertical, independently committable implementation and verification unit.
- Coupled failing tests, implementation, documentation, and final proof must
  stay in the same task; small atomic features should normally have one task.
- `execute-feature` now checks task atomicity before editing, merges coupled
  plan items when necessary, and treats an expected pre-change failure as
  baseline evidence rather than passing final verification.
- The feature template now distinguishes Product Basis from Convergence Source
  Analysis and tells authors to omit the field that does not apply.

## Recheck

A fresh planning run produced exactly one task combining the policy
centralization, focused tests, full verification, and evidence recording. A
fresh execution run then created one clean commit,
`cb87f7eb1985d39153695beae7cb846d02797e21`, with:

- one canonical status decision tree
- 2 focused tests passed and 0 failed
- the full 2-test suite passed and 0 failed
- `reminderStatus(30)` intentionally converged from `overdue` to `due`
- `shouldSendReminder(30)` remained `true`
- no push, pull request, deployment, dependency, or external-system effect

The deliberately failing commit from the first disposable trial is not in the
fresh recheck history.
