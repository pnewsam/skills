# Skill evaluations

## Structural checks versus behavior

`high_use_cases.json` contains routing, scope, continuation, and effect contracts. `scripts/validate_registry.py` validates their definitions and active targets; it does not run a model or establish that a scenario passed. A null expected_skill means ordinary agent behavior should suffice; no dedicated skill is required. expected_sequence describes operation handoffs for compound requests, not mandatory steps for every task.

Actual trials run in fresh disposable repositories. Record prompt, fixture/base, selected resources, actions, questions, effects, candidate identity, check results, and completion claims. Tests/configuration and known failing states need truthful failure reporting. External state may be simulated, but label it and never claim live publication was tested.

## Rebuild evaluation

Exercise a small bug without a plan, unrelated dirty state, configuration-only and test-only validation, missing required evidence, a changed PR head, duplicate PR prevention, interruption/resume, blocked prerequisites with independent ready work, and rendered design synthesis. Prefer outcome assertions to wording/heading matching.

For quality comparisons, use the same starting fixtures and user requests with the previous registry, the new operations, and a minimal agent. Separate answering and evaluation where feasible. Compare task success and evidence, unrelated changes, unnecessary questions, duplicate work, recovery, elapsed time, and context usage when measured. Do not infer unmeasured latency or token savings. A few successful smoke trials establish bounded behavior, not statistical superiority.

The prior/new/minimal smoke evidence for this rebuild is recorded in dated results. Preserve raw outputs and candidate IDs or hashes. A failed check can be the correct validation outcome; a green structural validator is not model-quality evidence.

## Historical retention experiments

The existing family case files, scorer, and older results remain historical evidence. Their original prompts refer to packages now archived. Do not treat their scores as a verdict on the rebuilt operations. The original A/B protocol and raw score tooling remain available for deliberate follow-up comparisons; do not run old extraction scripts against the new registry.

## Safe fixtures

Copy fixtures to temporary repositories; never mutate the fixture source during a trial. No live external write is required for local behavioral evaluation. For a deliberately authorized integration trial, use a sandbox account/repository and record live read-back separately from simulated cases.

## Main reconciliation

The rebase preserves main's retention harnesses, scorecards, fixtures, and the scorer exclusion fix. The current 58 scenario definitions include rebase preservation/concurrency, issue rationale and system review, bounded review loops, existing-PR code publication, and retained TypeScript/collection objectives. These added definitions are not claims of executed model trials. See [the rebase record](results/2026-09-05-rebase-validation.md) for current integration checks; earlier rebuild smoke trials describe the pre-rebase candidate.

## Review-work quality A/B (variant comparison)

`review_ab_pilot_cases.json` and `review_ab.workflow.js` stage a *variant* A/B for `review-work` — control versus control-plus-a-candidate-addition — distinct from the bitter-lesson skill-vs-bare `family_ab`. It tests two additions surfaced by comparison against well-regarded review skills: a noise-exclusion discipline (#2, precision) and a design/over-engineering pass (#3, coverage). Each arm reviews planted-defect diffs blind; a blind evaluator scores recall (real defects reported via `must_include`) and precision (noise baits wrongly raised via `must_exclude`). The arm deltas in the cases file are the exact prose that would be promoted into the skill if an arm clears its gate; nothing is applied to the live skill until then. Run by passing the cases file contents as the workflow `args` (optionally add `"reps"`). Adopt only per the `gate` block; a null result keeps the current trimmed skill.

## Artifact and coordination exercise

The [five-unit fixture](fixtures/epic-coordination/README.md) exercises interrupted ownership, changed prerequisites, preserved branch work, integration, and handoff across fresh sessions. Keep its evaluator-only file out of executor context. The [execution record](results/2026-09-05-artifact-coordination.md) separates observed behavior, an artifact-consistency defect, its correction, and remaining concurrency/remote-system limits.
