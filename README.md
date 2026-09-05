# Skills

A registry built around one record per independently reviewable outcome. The general set has **17 skills**: six operations, three orchestration skills, five runbooks, and three compact references. Two optional organization packages are kept separately.

The base model supplies general reasoning and technique. Skills earn their place through house contracts, corrective objectives, fragile mechanics, or useful verification; the six operations do not prescribe how to think.

The agent owns an ordinary task. Operations are capabilities, not mandatory steps or approval gates. Existing issues and feature plans remain valid work records. An initiative coordinates several units, normally several PRs.

Read [the shared work contract](registry/work-conventions/SKILL.md), [authoring rules](AUTHORING.md), and [the complete migration map](docs/registry-rebuild.md). Installation commands are in [cli/README.md](cli/README.md).

## General registry

| Layer | Skill | Responsibility |
| --- | --- | --- |
| Operation | [analyze-work](registry/analyze-work/SKILL.md) | Evidence and scope |
| Operation | [deliver-work](registry/deliver-work/SKILL.md) | Requested delivery boundary and read-back |
| Operation | [execute-work](registry/execute-work/SKILL.md) | Implementation and in-scope repairs |
| Operation | [plan-work](registry/plan-work/SKILL.md) | One outcome, acceptance, approach, and proof |
| Operation | [review-work](registry/review-work/SKILL.md) | Supported findings and risk |
| Operation | [validate-work](registry/validate-work/SKILL.md) | Candidate-specific acceptance evidence |
| Orchestration | [plan-epic](registry/plan-epic/SKILL.md) | Decomposition and dependencies |
| Orchestration | [shape-initiative](registry/shape-initiative/SKILL.md) | Direction and strategic intent |
| Orchestration | [ship-epic](registry/ship-epic/SKILL.md) | Delivery across work records |
| Runbook | [create-issue](registry/create-issue/SKILL.md) | One verified Linear issue |
| Runbook | [create-project](registry/create-project/SKILL.md) | One verified Linear project |
| Runbook | [publish-pr](registry/publish-pr/SKILL.md) | Commit, push, create or update a PR |
| Runbook | [rebase-pr](registry/rebase-pr/SKILL.md) | Reconcile a branch with its moving integration base |
| Runbook | [preserve-work](registry/preserve-work/SKILL.md) | Recoverable local WIP snapshot |
| Reference | [pr-conventions](registry/pr-conventions/SKILL.md) | PR content and review findings |
| Reference | [work-conventions](registry/work-conventions/SKILL.md) | Scope, continuation, records, and evidence |
| Reference | [writing-conventions](registry/writing-conventions/SKILL.md) | Shared prose preferences |

## Installation profiles

| Profile | Purpose |
| --- | --- |
| `core` | Six work operations with their required contracts and PR mechanics. |
| `orchestration` | Shape, plan, and deliver initiatives across work units. |
| `runbooks` | GitHub, Linear, and recoverable work-preservation procedures. |
| `general` | The seventeen general skills, including operations, orchestration, runbooks, and references. |
| `linear-ops` | Create one verified Linear issue or project. |
| `mindsdb` | Optional organization-specific inventory and migration tools. |

Required package dependencies are installed transitively for profiles and individual selections. Optional skill recommendations do not expand installations. `core` includes six operations plus required shared contracts and PR mechanics. `general` includes all seventeen general packages, excluding optional packages.

Optional packages: `mindsdb-migrate-surface-to-tailwind` and `mindsdb-track-design-system-metrics`.

## Layout and migration

Active packages live in `registry/<name>/`; conditional references and tools travel with their owner. `catalog.json` is the source for layer, scope, effects, dependencies, resources, profiles, and provenance. `archive/` is historical and is not installable.

Against the reconciled main registry, the rebuild retires fourteen entry points and adds nine, taking the active registry from 24 to 19 packages. Previous archive families and evaluation evidence remain intact. See the migration map before replacing an installed profile. Existing client copies and retired symlinks are not automatically removed; inspect and migrate them explicitly, preserving local customizations. No permanent alias skills are installed.

Historical retention plans and scorecards remain under docs/ and evals/results as evidence of earlier decisions. They are not the current architecture or quality verdict. See [evals/README.md](evals/README.md) for current behavioral evaluation and its limits.
