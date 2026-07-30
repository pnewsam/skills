---
name: plan-security-remediation
description: Plan safe, idempotent remediation for dependency vulnerabilities or code-scanning findings by verifying current evidence, detecting existing work, grouping cohesive fixes, and creating or updating a standard security-remediation epic with child features. Use for CVEs, GHSAs, Dependabot alerts, package audit findings, CodeQL, SAST, or similar scanner findings before changing code or dependencies. Writes local planning artifacts only.
---

# Plan Security Remediation

## Outcome

Turn verified security findings into focused, reviewable remediation groups in
the normal `docs/epics/` and `docs/features/` planning flow. Do not create a
parallel security tracker and do not remediate findings in this skill.

## Modes

- **Dependency mode:** CVE, GHSA, Dependabot, package-manager audit, base image,
  or vulnerable action/dependency findings.
- **Code-scanning mode:** CodeQL, SAST, source/sink, workflow-permission, or
  other source-code findings.
- **Mixed mode:** Accept both sources, but keep groups separate when their fix,
  owner, verification, or rollout differs.

Read `references/source_adapters.md` for the selected source. Use
`references/epic_template.md` when writing the durable plan.

## Effect boundary

This workflow may read local and authorized remote evidence and write or update
one local epic. It must not:

- modify source, manifests, lockfiles, workflows, or configuration
- create branches, commits, pull requests, or external comments
- paste secrets, credentials, private registry URLs, or raw scanner logs into
  planning documents
- treat scanner output as proof without checking current code or dependency
  state

## Workflow

### 1. Establish repository context

Inspect repository state, base branch, languages, package managers, deployment
shape, and existing security automation. Preserve unrelated work.

### 2. Gather and normalize findings

Use user-provided evidence, authorized GitHub reads, or the project's existing
scanner commands. Do not install a scanner merely to plan.

Normalize every finding to:

- stable finding or advisory ID and source
- severity and confidence
- affected package, file, line, or component
- current vulnerable or flagged state
- fixed version or likely source change when known
- status: ready, covered, already fixed, false/stale, or needs input

### 3. Verify current state

For dependency findings, inspect manifests, lockfiles, dependency paths, and
resolved versions. For code findings, read the flagged source and relevant
control/data flow.

Downgrade or remove stale findings with evidence. Preserve uncertainty when the
finding depends on runtime configuration or unavailable data.

### 4. Detect existing work

Search local branches, plans, and open pull requests for the finding IDs,
packages, rules, affected paths, and remediation markers. Inspect plausible
matches before marking a finding covered.

Do not create a new remediation group for work that already has a credible
owner and path to completion.

### 5. Group cohesive fixes

A group should normally become one child feature and one focused pull request.
Group findings only when they share:

- one underlying cause or update
- compatible ownership and rollout
- the same verification path
- a safe dependency or deployment sequence

Do not combine unrelated ecosystems, major upgrades, rule families, application
areas, or migration work merely to reduce PR count.

For each group define:

- stable `group_id`
- included findings
- affected packages/files
- remediation strategy and non-goals
- branch and PR naming suggestion
- verification and scanner re-check
- compatibility, data, rollout, and rollback risks
- idempotency marker:

```text
<!-- security-remediation: group_id=<id>; source=<source>; findings=<ids> -->
```

### 6. Prioritize

Order groups using:

1. credible exploitability and impact
2. active exposure and reachability
3. dependencies that unblock other fixes
4. availability and risk of a supported fix
5. review and rollout size

Do not sort by scanner severity alone. Flag risk acceptance or disputed
applicability as explicit decisions with an owner.

### 7. Write or update the epic

Create or update a normal numbered epic in `docs/epics/`. Reuse an existing
security-remediation epic when its scope matches. Preserve completed child
features and stable group IDs across reruns.

Use the source-specific inventory columns from
`references/source_adapters.md` and the common structure in
`references/epic_template.md`.

Do not create feature plans unless the user also requested that next planning
step.

### 8. Report

Return:

- epic path
- findings examined by source
- remediation groups and priority
- covered, stale/already-fixed, and needs-input findings
- decisions or access gaps
- recommended next `plan-feature`, `remediate-vulnerability`, or
  `remediate-code-scanning` step

## Idempotency

On rerun, match by stable finding ID, `group_id`, and remediation marker.
Update evidence and status without duplicating groups or overwriting completed
work.
