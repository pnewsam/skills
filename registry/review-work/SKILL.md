---
name: review-work
description: Critically assess local changes, an artifact, or an existing PR for supported defects, scope gaps, and delivery risk. Includes review feedback triage and independent re-review when requested. Read-only by default; repairs go through execute-work and external reviews or replies through authorized delivery.
---

# Review work

Apply `work-conventions` and the finding standard in `pr-conventions/references/finding-model.md`. Review the actual candidate against the intended outcome. A PR is an optional input, not a prerequisite.

## Establish context

Read the work record or request, diff and surrounding implementation, acceptance evidence, and repository requirements. Read the linked ticket or issue, including its rationale and the problem behind the work, before judging hunks; disclose inaccessible intent and mismatches with the diff. Identify the candidate's base/head and related local changes. For a live PR, use `publish-pr/references/github-mechanics.md` to resolve the target and current head; read existing feedback, using thread-aware data when replies or resolution matter.

An ordinary review stays read-only except for necessary checks and temporary artifacts. A request to review and fix already authorizes related implementation; it does not itself authorize commits, pushes, posted reviews, thread resolution, or merge. Carry separately granted authorization through the task without asking again.

For a merge-readiness question, assess both defects and operational risk using `references/risk.md`; high risk alone is not proof of a defect. Read `references/review-protocol.md` for reviewer attribution, coverage, output, and the bounded review-and-fix contract.

## Assess and disposition

Read outward from the diff into callers, shared contracts and state, untouched invariants, and migration/data assumptions. Scale this pass to actual dependency reach; a locally correct hunk can still break the system. Account for the full changed-file list and disclose sampled or unreviewed material areas. Continue the planned scope after the first serious finding.

Treat each finding as a hypothesis: trace a concrete failure path, seek counterevidence, and report it only when support survives. Distinguish defects from incomplete evidence, operational risk, and preferences. Use `references/risk.md` when the user asks about merge or rollout risk. Do not inflate severity to force a scope expansion.

Deduplicate by root cause. Include affected location, trigger, consequence, confidence, and verification or repair direction. An empty finding list is a valid result. Do not invent nits to demonstrate effort.

For existing feedback, mark supported, fixed, duplicate, outdated, unsubstantiated, or deferred with a reason. Verify fixed claims against the current candidate, not merely the presence of a commit. Optional improvements do not block the agreed outcome.

For an explicitly requested independent review or a consequential review-and-fix loop, use a fresh reviewer when available and authorized. Supply the intent, raw candidate, relevant constraints, and evidence without the author's proposed verdict. Honor an explicitly requested suitable model; do not claim independence or model diversity that was unavailable. A second model's opinion still needs evidence.

## Return control

Return supported findings and a qualified readiness assessment tied to the candidate. If repairs were requested, continue through `execute-work` and `validate-work`, then reassess affected findings on the new candidate. End when required findings are resolved or explicitly dispositioned and required proof holds; stop unproductive loops at a precise blocker, not at an arbitrary demand for zero comments.

A changed remote head invalidates affected review evidence. Refresh before making a readiness claim or publishing feedback. Use `deliver-work` for explicitly requested posting, replies, resolution, or merge. A review-only request ends with the assessment.
