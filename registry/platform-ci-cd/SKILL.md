---
name: platform-ci-cd
description: CI/CD and release pipeline guidance for builds, tests, artifacts, workflow permissions, deployment gates, provenance, supply chain hardening, and automation. Use when creating, reviewing, or fixing continuous integration or delivery workflows.
---

# Platform CI/CD

## Use When

Use for CI workflows, deployment pipelines, build scripts, test gates, artifact packaging, release provenance, workflow permissions, branch protection, and supply-chain hardening.

## Source Anchors

- Google SRE Release Engineering: https://sre.google/sre-book/release-engineering/
- SLSA specification: https://slsa.dev/spec/v1.1/
- GitHub Actions secure use reference: https://docs.github.com/en/actions/reference/security/secure-use
- DORA deployment automation: https://dora.dev/capabilities/deployment-automation/
- Docker build best practices: https://docs.docker.com/build/building/best-practices/

## Core Position

CI/CD should make the safest path the easiest path. Build once, test the artifact, record evidence, restrict permissions, and deploy only what has passed the agreed gates.

## Checks — automation gates the pipeline shape

Is the CI graph itself verifiable? Enforce the structural invariants with tooling, then let the deployment gates be the human review of evidence.

- **actionlint / workflow lint** — validate YAML syntax, pinned actions, and bare `permissions` in CI.
- **Permissions snapshot** — workflows default to read-only and escalate only when a job needs it; a policy check rejects broad grants.
- **Provenance** — artifacts carry attestations (SLSA-style) and are built once, tested, then deployed from the tested artifact.
- **Pipeline evidence** — a deploy only proceeds through explicit gates that recorded tests, scans, and approvals.
- **Manual gate** — release approval and environment promotion decisions remain human where required by policy.

## Common Agent Mistakes

- Deploying from a job that did not build or verify the exact artifact being released.
- Giving workflows broad write permissions or long-lived cloud credentials.
- Running untrusted PR code with secrets available.
- Pinning actions/images loosely or using mutable tags for release-critical steps.
- Treating CI as a pile of commands instead of a dependency graph with clear gates.
- Splitting test, build, and deploy logic across local scripts and CI in incompatible ways.
- Producing no release evidence beyond "the workflow was green."

## Decision Rubric

| Concern | Preferred Guidance |
| :--- | :--- |
| Build | Reproducible, dependency-pinned, clean environment, artifact named by commit/version |
| Test | Fast checks early, integration/e2e before deploy, same commands locally and in CI where feasible |
| Artifact | Immutable, stored, traceable to commit, build logs, dependency lockfiles, and test result |
| Permissions | Least privilege per job, short-lived credentials, separate PR and deploy permissions |
| Triggers | Clear branch/tag/manual rules, protected deploy branches, safe handling of forks |
| Supply chain | Pin critical actions/images, verify provenance where available, avoid executing untrusted generated code |
| Evidence | Link build, tests, artifact, approvals, deploy target, version, and rollback path |

## Pipeline Guardrails

- Build and package before deploy; do not build ad hoc on production hosts.
- Gate deployment on the checks that validate the release artifact, not merely the source branch.
- Split untrusted PR validation from trusted deployment workflows.
- Use OIDC or platform-native short-lived credentials instead of static cloud keys where supported.
- Keep workflow permissions explicit and minimal at the workflow/job level.
- Cache dependencies for speed, but never let cache restore replace lockfile-controlled dependency resolution.
- Store or expose release metadata: commit SHA, artifact digest, build ID, deploy time, actor, target environment, and test summary.

## Do / Don't

| Do | Don't |
| :--- | :--- |
| Make CI fail before deployment if quality or security gates fail. | Let deployment jobs run after partial failures. |
| Pin critical third-party actions/images deliberately. | Depend on mutable tags for privileged jobs. |
| Use short-lived credentials and scoped tokens. | Put broad cloud keys in repository secrets. |
| Make artifact identity visible in logs and releases. | Deploy "whatever was on main at the time." |
| Keep CI logic readable and maintainable. | Hide production deploy behavior in opaque shell blobs. |

## Review Checklist

- What triggers the workflow, and can untrusted input reach privileged steps?
- Does deploy use the exact artifact that tests validated?
- Are workflow permissions, secrets, and cloud credentials scoped per job?
- Are actions/images/dependencies pinned appropriately for the risk level?
- Are tests ordered to give fast feedback without bypassing release-critical checks?
- Is release evidence sufficient for debugging and audit?
- Can the same commands or scripts be run locally when debugging CI failures?

## Handoff Rules

- Use `platform-deployments-rollbacks` when CI/CD changes alter release strategy or production rollout.
- Use `platform-secrets-config` when workflows touch secrets, credentials, or env vars.
- Use `quality-testing` or stack-specific testing skills for test selection and test design.
- Use `compliance-security` for supply-chain, token permission, or CI/CD threat-model concerns.
