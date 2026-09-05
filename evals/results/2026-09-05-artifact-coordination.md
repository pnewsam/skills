# Artifact and epic coordination validation

## Change

Keep the 17 general skills and two optional project packages. Expand the work and epic templates into readable briefs with identity, rationale, acceptance, planned proof, current state, and separately recorded evidence. Define default locations and links without requiring duplicate records or a new charter. Add a conditional ship-epic protocol for assignment ownership, handoff, replanning, integration, and recovery.

## Independent five-unit exercise

An independent fixture author built a small Python reporting project with five work units, actual Git branches, a changed prerequisite contract, overlapping edits, and an interrupted worker whose record was stale. All original isolated branch checks passed; they did not prove combined behavior. Worker availability was explicitly a captured snapshot, not live runtime observation.

[Fixture builder and instructions](../fixtures/epic-coordination/README.md) reproduce the scenario. Executor agents received the raw repository and skill guidance, not the evaluator invariants or intended repair. All execution stayed in `/private/tmp/epic-coordination-trial`; no remote was configured.

1. **Bounded checkpoint:** a fresh worker completed U2 only, preserving the stopped worker's original receipt commit and U1's changed named-field contract. It observed the old receipt fail against the new prerequisite, repaired the consumer, and passed six tests. Local integration: `c5ff759e6e49fcd13cf4cb5e5b527db49008f6a5`; checkpoint: `e2ba3b3`. [Epic checkpoint](artifact-coordination/checkpoint/docs/epics/reporting.md), [unit evidence](artifact-coordination/checkpoint/docs/work/u2-receipt.md).
2. **Fresh-session completion:** a second worker received the completion request, repository and skills, without the first worker's narrative. It reused U1/U2, integrated the preserved export branch, resolved overlapping output behavior, added real combined-flow coverage, and completed executable documentation. Eight tests and ten README examples passed at `2b1d41eebba335fab111eb09953763071e3effc9`; subsequent record-only checkpoint: `55f1da716eafaf5bdd016b64766ec57b9b2241e0`.
3. **Independent verification:** the fixture author and coordinating agent independently reran all eight tests and ten examples. The original receipt/export histories survive as merge parents; U1's named-field and decimal-rounding implementation is unchanged. Code and integration acceptance pass.

## Observed weakness and narrow correction

The first two workers appended correct new evidence but left old candidate/branch/handoff fields looking current. The epic also retained an unlabeled older checkpoint saying it was incomplete. See the [pre-correction epic](artifact-coordination/resume/docs/epics/reporting.md) and [export record](artifact-coordination/resume/docs/work/u3-export.md). A reader could reconstruct the truth, but the records did not provide an unambiguous current summary.

Strengthened the artifact convention and ship-epic completion step: current metadata must agree with observed state; superseded fields and checkpoints belong under explicit historical headings. Preserve evidence without leaving contradictory current-looking summaries. A third fresh worker exercised the revised contract through a record-only handoff reconciliation. It corrected the epic and all five child summaries, labeled superseded assignments/candidates as history, and committed `3956486720ce1092f67102673512cdbc3eeadb32`. Parent verification confirms the final tree is clean, original branches are unchanged, and every difference from the proven combined candidate is under docs/. No code/test rerun was needed for this record-only correction. See the [final epic](artifact-coordination/final/docs/epics/reporting.md) and [final receipt record](artifact-coordination/final/docs/work/u2-receipt.md). The [implemented change](artifact-coordination/implemented-change.patch) and [local history](artifact-coordination/history.txt) preserve the executable result and provenance.

## Structural checks

- Registry: 19 active packages, zero errors/warnings; existing 58 routing definitions valid.
- Skill-creator validation: work-conventions, plan-work, plan-epic, ship-epic pass.
- Python registry-integrity tests: four pass.
- A fresh general-profile installation contains all 17 packages and the new supporting resources. Changed-package files were compared byte-for-byte with source.
- Fixture builder runs in a new temporary directory, with baseline tests passing. An existing destination is rejected without changing its Git head.
- README links and diff whitespace checks pass. Only the two existing MindsDB prose-wrap advisories remain.

## Limits

This is one five-unit serial recovery exercise, not a comparison against the old registry or proof of broad multi-epic reliability. It did not test simultaneous coordinators, an actual late worker, remote PR creation/merge, or tracker recovery. Executed tests establish the observed fixture behavior; model self-review is not independent approval. No token, latency, or general quality improvement is claimed. The pre-existing local edit in docs/registry-rebuild.md was left untouched.
