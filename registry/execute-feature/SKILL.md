---
name: execute-feature
description: Execute one unchecked criterion or task from a product or convergence feature plan produced by plan-feature. Use when implementing the next bounded unit in docs/features/NNN-*.md, including quality, security, design-system, defect, dependency, testing, platform, or product work. Loads the relevant domain guidance, applies the smallest scoped change, verifies acceptance criteria and before/after evidence, updates the plan, creates one intentional local commit, and stops. Never pushes or opens a pull request.
---

# Execute Feature

## Outcome

Execute exactly one unchecked criterion or task from a feature plan, verify it, record evidence, create one focused local commit, and stop. Rerun this skill for the next item until the feature is complete.

This is the shared executor for product and convergence work. Domain-specific safety belongs in the feature plan and focused reference skills, not in parallel execution workflows.

## Inputs and effects

Prefer a `docs/features/NNN-*.md` plan from `plan-feature` with:

- one bounded outcome and explicit non-goals
- testable criteria or implementation tasks
- technical constraints and affected boundaries
- verification and rollback or recovery expectations
- baseline, target, invariants, and guardrails for Convergence mode

If no plan exists, ask the user to run `plan-feature` or provide an equivalent single bounded change with acceptance criteria. Do not infer a multi-item plan from a broad request.

This workflow may edit project files, update the selected feature plan, create or switch to a repository-compliant feature branch, run verification, and create one local commit. It must not push, open or update a pull request, deploy, post externally, or advance to another item.

Read `references/security.md` when the plan contains security findings, dependency advisories, scanner alerts, control changes, or sensitive boundaries.

## Workflow

### 1. Load one item and establish safety

Read the selected plan and any parent context. Select the first unchecked criterion or task; if all are complete, report completion and stop.

Confirm the selected item is independently committable and can finish with its required checks passing. A failing regression test and the implementation that makes it pass are one item unless the repository explicitly requires red-phase commits and the plan records that policy. If the plan split coupled red, implementation, documentation, or verification work into later tasks, merge those parts into one bounded item in the plan before editing source.

Inspect repository instructions, branch, status, diff, and relevant existing implementation and tests. Preserve unrelated changes. Follow user and repository branch conventions; use `feat/<slug>` only as a fallback.

Route the item to the smallest relevant domain references:

- quality or refactoring: `analyze-quality`, or `typescript-types` (type-level risk; base model covers failure contracts and async natively)
- security: `analyze-security`; secure-coding and vulnerability triage are base-model capability, with `compliance-gdpr` or `compliance-hipaa` for regulated data and `threat-model` for a formal threat model
- UI/design system: `design-explore`, `ui-patterns`, `ui-color`, or `ui-spacing`
- platform work (CI/CD, deploys, environments, IaC, secrets): base-model capability

Mark the selected plan item in progress only when the plan supports that state.

### 2. Implement the bounded change

Apply the smallest coherent change that satisfies the selected item:

- preserve the plan's invariants, public contracts, and non-goals
- follow current repository and stack conventions
- avoid adjacent cleanup, opportunistic hardening, broad dependency upgrades, formatting churn, and unrelated refactors
- add or update focused tests when behavior or controls change
- keep generated output, secrets, caches, and unrelated user work out of scope

If the item is already implemented, verify the evidence, update the plan when appropriate, and do not invent a code change. If the item is too large or the plan is wrong, revise or split the unchecked item and stop rather than producing an oversized diff.

### 3. Verify, record, commit, and stop

Run the plan's verification and the smallest relevant regression checks. Record
the selected validation tier and any prior aggregate evidence reused. For
Convergence mode, repeat the baseline method when practical and report the
before/after result, guardrails, and limitations. When the plan names an
analyzer (`analyze-quality`, `analyze-design-system`, `analyze-security`, or a
named metrics script), **re-run that analyzer as the verification method** and
record its evidence — do not defer it to a separate on-request run. A new
aggregate backend, full-browser, screenshot, or rehearsal run requires a
recorded changed checkpoint and why focused proof is insufficient; this never
waives a required delivery boundary. Use manual, visual, scanner, or runtime
checks when automated tests cannot prove the outcome.

Do not mark the item complete or create a commit when required verification fails. An expected failure that only demonstrates pre-change behavior is baseline evidence, not final passing verification. Record the blocker and leave the item unchecked or explicitly blocked.

When verification passes:

- mark only the selected item complete
- record changed files, verification, and measurement evidence in the plan
- stage only the related implementation and plan update
- inspect the staged diff
- create one conventional local commit that references the feature ID
- report the commit hash, evidence, remaining items, and any gaps

Stop after the commit. Recommend another `execute-feature` run when items remain, or `validate-feature` and then `prepare-pr` when the feature is complete. Do not invoke them automatically.

## Safety and idempotency

- Never use destructive Git commands, force-push, rebase, or amend unless the user explicitly requests the exact operation.
- Resume related partial work instead of replacing it.
- Never reimplement or recommit an item already supported by recorded evidence.
- Never mark completion from code inspection alone when the plan requires a test, measurement, scanner recheck, visual check, or runtime proof.
- Do not weaken tests, controls, thresholds, or metrics merely to make the item pass.
