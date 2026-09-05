---
name: validate-work
description: Verify a work candidate against acceptance and relevant regressions, from a targeted check to a complete assessment. Covers source, tests, configuration, dependencies, infrastructure, and documentation. Reports evidence and limitations; does not fix code or publish. Writes a report only when requested or part of the work record.
---

# Validate work

Apply `work-conventions`. Establish which requirements hold for the actual candidate. Reuse valid evidence; do not rerun checks merely because another operation called validation.

## Scope the proof

Resolve the requested scope: a targeted check, selected completed criteria, or the entire unit. Accept an issue, existing feature plan, or user-described acceptance; no plan file is mandatory. Partial validation must label unchecked requirements rather than presenting them as complete.

Identify the evidence-backed base and head, staged and unstaged changes, and intended untracked files. Do not assume a branch name or inspect only the last commit. Exclude unrelated work from the candidate but account for its presence when interpreting results.

Consider every changed surface. Do not filter out configuration, manifests, lockfiles, test-only changes, schemas, infrastructure, generated artifacts, or documentation merely by extension. Determine what each can affect. Read `references/verification.md` to select proof by surface. Read `references/visual-checks.md` only for visual evidence; optional helpers are `scripts/check_contrast.py`, `scripts/check_spacing.py`, and `scripts/shot_diff.mjs`.

Read `references/retained-objectives.md` for TypeScript safety or large collection views. For static HTML capture, `scripts/render_direction.mjs` and `references/rendering.md` provide optional evidence mechanics; they do not prescribe a design workflow.

## Gather evidence

Map each required criterion and invariant to its strongest practical evidence. Rerun a plan-named analyzer using the recorded baseline method and guardrails when it is the acceptance measure. Inspect actual repository commands and required CI checks; do not invent commands or install tools simply to fill a report. Run focused checks first, then relevant regression or integration boundaries. A passing smoke test cannot substitute for missing required acceptance proof.

Reuse prior evidence only when its candidate and relevant assumptions remain valid. Changes to configuration, dependencies, base, runtime, or requirements can invalidate results even when source files did not change. Record why a broader repeat is necessary. Runtime or browser startup is appropriate when needed and authorized; use the documented environment rather than requiring the user to start it automatically.

Distinguish a reproduced baseline failure, an introduced regression, a flaky result, and unavailable evidence. A rerun that happens to pass does not erase a flake. Do not edit implementation or tests, weaken thresholds, or convert an unavailable check into a pass.

## Report

For each required criterion report pass, fail, or unverified with method, result, candidate, and material limitations. State coverage gaps and the effect of pre-existing failures. Use `references/evidence.md` if a structured report helps; otherwise keep the result compact. Update the selected local record when in scope; never write a second report by default or mutate a tracker without authorization.

Return to execution for necessary repairs when the user requested completion, or to review/delivery when proof is sufficient. Validation alone never commits, publishes, merges, or claims deployment readiness beyond the verified scope.
