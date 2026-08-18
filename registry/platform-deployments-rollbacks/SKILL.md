---
name: platform-deployments-rollbacks
description: Platform deployment and rollback guidance for release strategy, canary, blue/green, progressive delivery, database migration sequencing, health checks, smoke tests, rollback, roll-forward, and post-deploy verification. Use when a change affects how software reaches or recovers in production.
---

# Platform Deployments And Rollbacks

## Use When

Use for release sequencing, production deployment, canary/blue-green/progressive rollout, migration coordination, rollback/roll-forward plans, health checks, smoke tests, and release evidence.

## Source Anchors

- Google SRE Release Engineering: https://sre.google/sre-book/release-engineering/
- DORA deployment automation: https://dora.dev/capabilities/deployment-automation/
- Twelve-Factor App build-release-run: https://12factor.net/build-release-run
- OpenGitOps principles: https://opengitops.dev/

## Core Position

A deployment is not done when code is copied. It is done when the intended version is running, verified, observable, and recoverable, with a clear path if the release is bad.

## Checks — deploy is verified, observable, recoverable

The runnable checks are the health and smoke gates after rollout, plus rehearsed recovery.

- **Health/smoke gates** — a post-deploy probe hits the new instance's health endpoint plus one user-real request; failure pauses the rollout.
- **Progressive rollout metrics** — canary/blue-green gates on error rate and latency before full traffic (feature-flag or weighted).
- **Migration sequencing** — schema migrations are safe when the new code is leading; add a downgrade path test for the irreversible case.
- **Rollback rehearsal** — the runbook's rollback/roll-forward is executed in a scratch environment, not invented at incident time.
- **Manual gate** — migration data-loss risk, and cross-service/queue/cron compatibility judgment stay human.
## Common Agent Mistakes

- Saying "rollback is redeploy previous version" while introducing irreversible database changes.
- Running migrations after traffic reaches code that expects the new schema.
- Skipping smoke checks because CI already passed.
- Treating deployment and release as the same thing when feature flags or config gates exist.
- Rolling out globally without canarying high-risk changes.
- Forgetting worker, queue, cron, cache, and schema compatibility during deploy.
- Leaving no release evidence tying production version to commit/artifact/config.

## Decision Rubric

| Release Risk | Preferred Strategy |
| :--- | :--- |
| Low-risk stateless code | Automated deploy with smoke checks and quick rollback |
| User-facing behavior change | Feature flag, staged exposure, metrics, support/revert plan |
| Data/schema change | Expand/migrate/contract; backward-compatible app versions; tested rollback/roll-forward |
| Background worker change | Drain/stop/start sequencing, idempotency, queue compatibility, replay plan |
| High-risk infra/runtime change | Canary, blue/green, manual approval, monitoring window, fallback |
| Security hotfix | Minimize scope, expedite gates, preserve evidence, validate vulnerability closure |

## Deployment Guardrails

- Separate build, release, and run: the deploy should identify an immutable artifact plus environment config.
- Define pre-deploy checks, deploy steps, post-deploy smoke checks, monitoring window, and success criteria.
- Prefer progressive delivery for changes with uncertain production behavior.
- Make database migrations backward compatible with both old and new app versions unless downtime is explicitly accepted.
- Rollback plans must cover code, config, migrations, workers, caches, queues, and external integrations.
- Use health checks that reflect dependency readiness, not just process liveness.
- Record release evidence: version/artifact, commit, actor, time, target, config/flag changes, checks, and rollback link.

## Do / Don't

| Do | Don't |
| :--- | :--- |
| Plan deploy and recovery before merging risky changes. | Discover rollback constraints during an incident. |
| Validate the running service after deploy. | Assume CI success means production success. |
| Keep old and new versions compatible during rollout. | Deploy code and schema changes that only work in one exact order without safeguards. |
| Use feature flags for exposure, not as permanent hidden deployments. | Leave stale release flags forever. |
| Prefer roll-forward for irreversible data migrations. | Pretend every migration can be rolled back safely. |

## Review Checklist

- What artifact, commit, config, and environment are being deployed?
- What must be true before traffic shifts?
- Are migrations, workers, queues, caches, and external systems compatible during rollout?
- What health/smoke checks prove the release is serving correctly?
- What is the rollback or roll-forward path, and what data cannot be undone?
- Who owns the monitoring window and release decision?
- Is release evidence preserved for debugging and audit?

## Handoff Rules

- Use `platform-ci-cd` when deployment behavior lives in pipelines.
- Database migration compatibility, data rollback/repair, worker/queue/replay
  concerns, and failure-mode/observability expectations are base-model capability.
