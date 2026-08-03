# Feature: <Feature Name>

## Contents

- Metadata
- Outcome and context
- Evidence or product alignment
- Acceptance criteria
- Technical notes and risks
- Verification and tasks
- Progress

## Metadata

- **ID:** <NNN>
- **Mode:** product | convergence
- **Status:** draft
- **Created:** <date>
- **Last updated:** <date>
- **Owner:** <role or person>
- **Parent Epic:** <optional in convergence mode>
- **Product Basis:** <charter and parent epic; Product mode only>
- **Source Analysis:** <analyze-* result or stable finding IDs; Convergence mode only>

Omit the metadata field that does not apply to the selected mode.

## Outcome

<One independently verifiable result.>

## Context

<Why this change matters and what is true today.>

## Product Alignment

<Required in Product mode; omit in Convergence mode.>

- **User story:** As a <user>, I want <goal> so that <benefit>.
- **Epic goal advanced:** <goal and link>
- **Charter principle advanced:** <principle>
- **North-star or product metric affected:** <metric, if applicable>
- **Relevant non-goal:** <constraint>

## Convergence Evidence

<Required in Convergence mode; omit in Product mode.>

| Field | Value |
| --- | --- |
| Finding or group ID | <stable identifier> |
| Affected scope | <files, components, packages, routes, controls, or tests> |
| Baseline | <current measured value or condition> |
| Target | <expected value or condition> |
| Method and window | <reproducible measurement> |
| Exclusions | <generated, vendored, snapshot, environment, or other limits> |
| Confidence and limitations | <high/medium/low and missing evidence> |

### Invariants and guardrails

- <Behavior, interface, data, visual state, or security control to preserve>
- <Metric or outcome that must not regress>

## Acceptance Criteria

### Must Have

- [ ] <Specific, testable condition>
- [ ] <Specific, testable condition>

### Should Have

- [ ] <Optional condition that does not expand the core outcome>

## Out of Scope

- <Adjacent cleanup, redesign, hardening, migration, or behavior change>

## Technical Notes

- **Affected boundaries:** <API, component, data, dependency, platform, or module>
- **Dependencies:** <required prior work or external constraints>
- **Compatibility and rollout:** <migration, sequencing, or release considerations>
- **Rollback or recovery:** <how to reverse or contain failure>

### Security evidence when relevant

- **Findings:** <CVE/GHSA/alert/rule/control IDs>
- **Reachability and exposure:** <verified path and affected actors>
- **Fix or control:** <smallest intended remediation>
- **Negative verification:** <test or evidence that unsafe behavior is rejected>
- **Resolution evidence:** <scanner, dependency graph, test, or focused review>

### UI and accessibility evidence when relevant

- **Canonical pattern or primitive:** <target>
- **Affected variants and states:** <hover/focus/error/loading/mobile/etc.>
- **Visual and accessibility checks:** <screenshots, regression, keyboard, semantics>

## Risks

| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| <Risk> | low/medium/high | low/medium/high | <Mitigation> |

## Verification

- <Targeted automated checks>
- <Manual, visual, scanner, or runtime checks when required>
- <Before/after measurement for Convergence mode>

## Definition of Done

- [ ] All must-have acceptance criteria pass.
- [ ] Required invariants and guardrails hold.
- [ ] Verification evidence is recorded.
- [ ] No unrelated changes are included.
- [ ] Relevant documentation is updated.

## Tasks

<Use one to three tasks. Each task is a vertical, independently committable implementation and verification unit that leaves required checks passing. Keep a failing regression test, its implementation, documentation, and final proof in the same task when they are coupled. Prefer one task for a small atomic feature.>

- [ ] <Implement one bounded behavior or convergence change, add its focused coverage and documentation, run required checks, and record evidence>

## Progress

| Criterion or task | Status | Evidence | Notes |
| --- | --- | --- | --- |
