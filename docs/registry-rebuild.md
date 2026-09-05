# Registry rebuild reconciled with main

The current registry has 17 general skills: six operations, three orchestration skills, five runbooks, and three references. Two MindsDB packages remain optional. This reflects the agreed redesign reconciled with the 50 commits between the original checkout at `42f975c` and main at `4c34770`.

## What the rebase preserves

The base model supplies general reasoning; operations define scope, evidence, continuation, and delivery contracts. They are optional capabilities, not six compulsory phases. The agent owns the task without a seventh lifecycle driver. Runbooks may branch; routing is a capability, not another category.

- **PRs #28–39:** preserve evaluation harnesses, fixtures, scorecards, archive families, and the scorer exclusion fix. Preserve plan-named analyzer reruns, read-only analysis and validation boundaries, and the visual comparison tool.
- **PRs #40–42:** keep the unified `publish-pr` entry point, upstream deletions, and the base-model-first admission standard. Do not restore external creative packages, design-exploration, diagnosis, threat modeling, or ingestion as standalone skills. Preserve useful capture code as an optional verification resource. The six agreed operations supersede the earlier delivery-only taxonomy.
- **PR #43 and review commits:** retain issue rationale, system-level dependencies and invariants, coverage accounting, and trustworthy reviewer attribution. Preserve bounded review/repair rounds and candidate-specific evidence from `ship-pr` inside `review-work`; preserve thread dispositions and approval effects inside delivery.
- **PR #31:** retain a focused `rebase-pr` runbook with upstream reconciliation, recovery history, current-base validation, and an explicit expected-head lease. Absorb review-comment handling into review/execution/delivery rather than retaining `address-review`.
- **Evidence-backed references:** keep the TypeScript unsafe-escape and collection-scale objectives as a small conditional validation resource. Do not restore the discarded encyclopedic guidance or turn historical numeric heuristics into universal requirements.

The six-operation design and optional initiative shaping are deliberate differences from main's prior direction. A new charter or directions artifact is never required for bounded work. Standalone architecture-document and threat-model conventions remain retired; an existing project's requested artifact format is honored without imposing that format everywhere.

## Disposition of main's 24 active packages

| Main package | Reconciled disposition |
| --- | --- |
| address-review | Retire; thread triage in review-work, repair in execute-work, authorized replies/resolutions in deliver-work |
| advance-epic | Retire; bounded progress mode in ship-epic |
| create-charter | shape-initiative; no mandatory directions layer |
| create-issue | Retain |
| create-project | Retain |
| execute-feature | execute-work; preserve plan-named measurement reruns |
| mindsdb-migrate-surface-to-tailwind | Retain optional; preserve project mapping and scoped publication |
| mindsdb-track-design-system-metrics | Retain optional; preserve scanner and measurement definition |
| plan-epic | Retain; independent work units and dependency graph |
| plan-feature | plan-work; accept existing records |
| polish-issue | Retire; ordinary editing with existing authorization and unchanged scope |
| pr-conventions | Retain shared content/finding standard |
| publish-pr | Retain unified create/update entry point; carry improved candidate and effect contracts |
| rebase-pr | Retain focused runbook; remove assumed staging base |
| review-pr | review-work; preserve intent, system context, coverage, model attribution, risk, and inline finding rules |
| ship-epic | Retain; coordinate several independently reviewable outcomes |
| ship-pr | Retire entry point; agent owns lifecycle and review-work owns requested convergence protocol |
| stash | preserve-work |
| trim-comments | Retire; ordinary in-scope editing |
| typescript-types | Retire entry point; retain unsafe-escape verification objective |
| ui-color | Retire entry point; retain contrast checker in validate-work |
| ui-patterns | Retire entry point; retain collection completeness objective |
| ui-spacing | Retire entry point; retain scale checker in validate-work |
| writing-conventions | Retain |

Nine new entry points replace fourteen of main's packages: analyze-work, plan-work, execute-work, validate-work, review-work, deliver-work, shape-initiative, preserve-work, and work-conventions. Main's existing archives are preserved in their original locations. The fourteen newly retired packages are archived at their **latest main contents** in `archive/registry-rebuild/`, avoiding duplicate archives of already retired families.

The [initial migration](../archive/registry-rebuild/initial-migration.md) records the first design against the older 70-package checkout. It is historical, not the current installation map. The recovery branch `codex/rebuild-before-main-rebase` retains that complete candidate.

## Installation and records

Install the desired current profile using the dependency-aware installer. Required resources travel with their owner; optional routes do not force installation. `general` contains all 17 general packages; `mindsdb` is optional. No permanent aliases or automatic global cleanup are added.

Existing issues, `docs/features/`, and `docs/epics/` records remain accepted. One unit normally maps to one PR; split older multi-outcome plans only when next worked and preserve completed evidence and identity links. Do not impose a second record or mass-migrate existing plans.

Client installs were not refreshed or pruned. Existing copies may be stale and symlinks to retired packages may dangle. Inspect installed state and preserve local customizations before explicitly replacing entries.

## Evidence

The [rebase validation record](../evals/results/2026-09-05-rebase-validation.md) distinguishes current integration checks from the earlier candidate's smoke comparisons. Historical results are not rewritten into proof for the new operations. A clean rebase or structurally valid registry is not a general model-quality result.
