---
name: platform-expert
description: Route platform engineering requests to the smallest relevant platform-* skill set and synthesize the guidance. Use when an operational build, review, or planning request spans two or more of environments, CI/CD, secrets, deployment, rollback, or infrastructure as code, or when the primary platform concern is unclear. Prefer one focused platform-* skill for one clearly bounded concern; pair with stack, backend, quality, and compliance experts as needed.
---

# Platform Expert - Skill Router

Use this as the entry point for broad platform engineering work. Identify the operational boundary, load only the focused `platform-*` skills needed, and keep guidance provider-neutral unless the project already has a clear platform.

Platform work is where product code becomes a running service. Prefer repeatable, reviewed, observable, reversible changes over hand-tuned environments and one-off deployment rituals.

Use the router when the request spans two or more focused platform concerns and needs a coherent recommendation. Go directly to one focused `platform-*` skill when exactly one concern is clear.

---

## Source Anchors

- The Twelve-Factor App: https://12factor.net/
- Google SRE Release Engineering: https://sre.google/sre-book/release-engineering/
- SLSA specification: https://slsa.dev/spec/v1.1/
- OpenGitOps principles: https://opengitops.dev/
- DORA deployment automation: https://dora.dev/capabilities/deployment-automation/

Use these as durable anchors, not vendor lock-in. Follow the project's actual hosting platform, CI provider, and operational constraints.

---

## 1. Routing Table

Load the smallest set of focused skills that covers the task.

| User Need | Primary Skill | Secondary Skills |
| :--- | :--- | :--- |
| Local/staging/preview/prod parity, environment variables, backing services, feature flags | `platform-environments` | `platform-secrets-config`, stack expert |
| Build workflows, CI gates, artifacts, tests, release provenance, supply chain hardening | `platform-ci-cd` | `quality-testing`, `compliance-security` |
| Secret storage, config separation, rotation, env vars, CI secrets, runtime injection | `platform-secrets-config` | `compliance-security`, `platform-environments` |
| Release strategy, canaries, blue/green, migrations during deploy, rollback, release evidence | `platform-deployments-rollbacks` | `quality-reliability`, `backend-persistence` |
| Terraform/OpenTofu/Pulumi/CDK/Kubernetes manifests, drift, modules, state, GitOps | `platform-infrastructure-as-code` | `compliance-auditability`, `compliance-security` |

If a request touches more than three rows, start with `platform-deployments-rollbacks`, then add the skill closest to the immediate production risk.

---

## 2. Overlap Boundaries

- `platform-environments` owns environment shape, parity, runtime config, backing-service attachment, preview environments, and environment promotion.
- `platform-ci-cd` owns build/test/package pipelines, release artifacts, pipeline permissions, provenance, and CI/CD gates.
- `platform-secrets-config` owns secret/config separation, injection, storage, rotation, leakage prevention, and runtime secret access.
- `platform-deployments-rollbacks` owns rollout strategy, release sequencing, migration safety, rollback/roll-forward, and post-deploy verification.
- `platform-infrastructure-as-code` owns declarative infrastructure definitions, modules, state, drift, review, and GitOps-style reconciliation.

Pair with `backend-expert` when platform changes affect API behavior, migrations, jobs, queues, data stores, or auth boundaries. Pair with `react-expert` or `python-expert` for framework-specific build/runtime details. Pair with `quality-expert` for test confidence and reliability. Pair with `compliance-expert` for security, privacy, audit, regulatory, or evidence requirements.

---

## 3. Build Protocol

Before editing platform code or configuration:

1. **Identify the blast radius.** Local-only, CI-only, preview, staging, production, data-bearing production, or global shared infrastructure.
2. **Map build-release-run.** Name what is built, what artifact is released, what config is injected, and what runtime receives it.
3. **Check environment parity.** Confirm local/preview/staging/prod differences are intentional and documented.
4. **Protect secrets.** Ensure no secret is written into source, logs, built artifacts, images, or client bundles.
5. **Make changes reviewable.** Prefer committed config/IaC/pipeline changes over dashboard-only mutation.
6. **Plan rollback.** Define rollback, roll-forward, migration recovery, and data compatibility before deploy.
7. **Verify after deploy.** Include smoke checks, health checks, logs/metrics, and explicit release evidence.

Do not create a new platform abstraction, environment, workflow, or IaC module unless it reduces repeated risk or matches the project's existing operational model.

---

## 4. Review Protocol

When reviewing platform work, report in this structure:

1. **Current State Summary:** hosting/runtime, environments, CI/CD, secrets/config, IaC, release flow, and verification.
2. **Skill Routing:** list the focused `platform-*` skills used and why.
3. **Finding -> Recommendation Table:**

| # | Skill | Current | Issue | Recommendation | Why |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `platform-environments` | Staging uses a different database engine from production | Bugs can hide until production deploy | Align staging backing services or document/test the difference | Environment drift is release risk |
| 2 | `platform-ci-cd` | Deploy job runs before integration tests complete | Broken artifacts can reach users | Gate deploy on the same checks that validate the release artifact | CI/CD must protect production, not just automate it |
| 3 | `platform-secrets-config` | API key is baked into the container image | Secret rotation requires rebuild and risks leakage | Inject secret at runtime from the platform secret store | Secrets should not be build artifacts |

4. **Implementation Priority:** name the 1-3 changes that most reduce deployment, security, recovery, or operability risk.

Keep findings grounded in repeatability, reversibility, evidence, and production safety.
