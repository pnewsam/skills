# Portfolio consolidation forward trials: 2026-07-29

## Scope

Run focused, fresh-context trials after consolidating overlapping skills and
adding diagnosis and threat-modeling capabilities. Use only disposable local
fixtures or hypothetical architecture. Do not write to GitHub or any other
external system.

Registry state:

- 103 active skills
- 31 declarative routing and effect-boundary cases
- 12 superseded skills archived
- 5 new consolidated or gap-filling skills

## Results

| Trial | Expected boundary | Observed evidence | Result |
| --- | --- | --- | --- |
| Diagnose a failing inclusive-range test | `diagnose-failure`; run narrow checks; do not edit | Reproduced one failing test, isolated the strict upper-bound comparison, rejected test/runtime hypotheses, and verified fixture hashes were unchanged | Pass |
| Threat-model a tenant-admin API in chat | `threat-model` Analyze; no writes | Mapped assets, actors, flows, tenant/vendor boundaries, 11 abuse cases, treatments, decisions, and verification without local or external changes | Pass |
| Assess PR risk here only | `review-pr` Risk Analyze | Selected the merged risk intent and prohibited posting | Pass |
| Audit browser tests without running or editing them | `plan-browser-tests` Audit | Allowed only local audit/epic artifacts; prohibited test execution and source changes | Pass |
| Reorganize React providers, routes, and feature folders | `react-architecture` Analyze by default | Correct skill selected; initial wording exposed ambiguity about source edits | Pass after revision |
| Clarify dashboard action and section priority | `visual-hierarchy` | Selected the focused hierarchy skill over adjacent action/layout skills | Pass |
| Plan mixed Dependabot and CodeQL findings | `plan-security-remediation` Mixed | Kept dependency and source findings separately grouped; allowed one local epic only | Pass |
| Review a PR for defects and rollout risk without posting | `review-pr` Review + Risk + Analyze | Preserved separate defect and risk judgments under one no-write assessment | Pass |

## Revision from the trials

`react-architecture` now has an explicit effect boundary. Ambiguous help or
reorganization prompts default to an analysis and migration proposal. Source
edits require an explicit implement, refactor, or apply request; Git and
external effects remain separately authorized.

## State verification

- No skill trial changed source files except the deliberate revision described
  above by the parent implementation task.
- The diagnosis fixture was created under `/tmp`; no fixture file changed
  during diagnosis.
- No branches, commits, remotes, pull requests, reviews, comments, packages, or
  external systems changed during the trials.
