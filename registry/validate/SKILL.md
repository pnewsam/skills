---
name: validate
description: Run read-only validation against code changes or a completed feature — map the diff (or feature plan) to the relevant tests, run proportionate targeted and regression checks, verify acceptance criteria, and report what passed, what failed, and what remains uncovered. Use to spot-check recent changes before committing, to run a feature-level ship/no-ship pass before opening a PR, or anytime you want targeted feedback on whether something is safe. Never edits code, fixes failures, commits, pushes, or opens a PR.
---

# Validate

## Use When

Verify work without changing it. Two modes, chosen by scope:

- **Changes mode** — a fast, targeted spot-check of recent/uncommitted changes: read the
  diff, run only the tests that cover what changed, report pass/fail and gaps. Use during
  or after `execute-feature`, before committing, or after a merge.
- **Feature mode** — a comprehensive ship/no-ship pass on a completed feature: read its
  plan, run proportionate targeted + regression tests, verify each acceptance criterion
  against evidence, and write a validation report referenced from the plan. Use before
  `prepare-pr` or when asked for feature-level QA.

## Objective

An honest, evidence-backed verdict on whether the work is safe/shippable, plus the gaps
that remain — produced without touching the code.

## Method

1. **Scope.** Changes mode: `git diff` the relevant range (base ref, last commit, branch,
   or working tree) and map changed source areas to the tests that exercise them; run only
   those (plus smoke tests if none cover a changed area, flagging the gap). Feature mode:
   read `docs/features/NNN-*.md`, classify the feature's surface (UI / service / library),
   and select proportionate targeted + regression checks for its blast radius.
2. **Run proportionate checks** — the mapped tests, plus lint/typecheck where cheap. Do not
   run the whole suite blindly, and do not skip the checks that actually cover the change.
3. **Verify against criteria** (feature mode): confirm each acceptance criterion with the
   strongest available evidence; an unverifiable criterion is a no-ship, regardless of a
   checked box.
4. **Report.** State what was validated, the pass/fail results, remaining coverage gaps,
   and — in feature mode — a clear **SHIP / NO-SHIP** verdict written to a validation report
   (e.g. `docs/features/reports/NNN-validation.md`) with a reference line added back into
   the plan.

## Visual regression (optional, deterministic UI changes)

For visual changes with a deterministic render, add pixel evidence on top of tests with the
bundled dependency-free helper — it never replaces tests:

```bash
node scripts/shot_diff.mjs BEFORE.png AFTER.png [--tolerance 32] [--out diff.png] [--report report.json]
```

Identical screenshots exit 0 (UNCHANGED); any real difference exits 1 (CHANGED). Use
`--threshold 0.01` only for non-deterministic renders. Capture both shots on the same
viewport with animations disabled; log the `--report` JSON in the validation report.

## Boundaries

- Read-only. Never modify source or test files, fix failures, install packages, run
  destructive commands, commit, push, or open a PR. A surfaced defect is a finding handed
  back for an `execute-feature` run, not something this skill patches.
- Do not mark plan items complete or acceptance criteria verified beyond writing the
  report; do not certify a criterion that cannot be confirmed with evidence.

## Handoffs

- Use `execute-feature` to fix anything validation surfaces, then re-validate.
- Use `diagnose-failure` when a failure's cause is unclear and needs root-causing before a fix.
- Use `prepare-pr` once a feature-mode pass returns SHIP.
