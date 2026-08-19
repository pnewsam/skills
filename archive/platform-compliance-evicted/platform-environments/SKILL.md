---
name: platform-environments
description: Platform environment guidance for local, preview, staging, production, environment parity, backing services, runtime configuration, feature flags, environment promotion, and operational readiness. Use when a task touches where an application runs or how environments differ.
---

# Platform Environments

## Use When

Use for local/preview/staging/production setup, environment parity, backing-service differences, runtime variables, feature flags, environment promotion, seeded data, and operational readiness.

## Source Anchors

- Twelve-Factor App config, backing services, build-release-run, and dev/prod parity: https://12factor.net/
- Google SRE Release Engineering configuration management: https://sre.google/sre-book/release-engineering/
- Docker build best practices: https://docs.docker.com/build/building/best-practices/

## Core Position

Every environment should exist for a reason. Keep environments similar enough that they catch real failures, different only where the difference is intentional, and explicit enough that an agent can tell where code is safe to run.

## Checks — parity and permission drift are lint-able

The environment surface can be checked with config and CI scripts, so drift fails fast instead of at incident time.

- **Config schema check** — a single validated variables schema; startup validation fails fast with redacted errors in every environment.
- **Parity scan** — diff the backing-services and versions between preview/staging/prod; flag intentional-looking gaps, require justification.
- **Secret hygiene** — preview/prod never share production credentials: a scan asserts unique credential sets per environment.
- **Promotion check** — environment promotion (including seeded data) runs through the same scripted path, not hand-followed steps.
- **Manual gate** — what is intentionally different, and who owns each variable, is a product/ops decision.
## Common Agent Mistakes

- Creating a new `.env` variable without documenting ownership, required environments, or safe defaults.
- Treating staging as production-like while using different databases, queues, auth, or storage behavior.
- Baking config into builds instead of injecting it at release/runtime.
- Making preview environments share production data or production credentials.
- Hiding environment differences in dashboards, shell profiles, or undocumented manual setup.
- Seeding test/demo data in production-like systems without cleanup and isolation.

## Decision Rubric

| Concern | Preferred Guidance |
| :--- | :--- |
| Local development | Fast, isolated, reproducible, no production credentials, close enough for normal work |
| Preview environments | Per-branch or per-PR, disposable, safe data, minimal secrets, easy teardown |
| Staging | Production-like services and deploy path, synthetic or scrubbed data, release candidate validation |
| Production | Reviewed changes, least privilege, audited config/secrets, recovery path, observability |
| Environment variables | Typed/validated at startup, documented, grouped by concern, no secrets in client bundles |
| Feature flags | Named owner, rollout plan, expiry/removal plan, safe default, test coverage for both paths |

## Environment Guardrails

- Track required config in code or checked-in examples, but never include real secret values.
- Validate required runtime config on startup and fail loudly before serving traffic.
- Treat backing services as attached resources: database, queue, cache, object store, email, and auth providers should be swappable by environment without code changes.
- Keep preview/staging data isolated from production unless a reviewed anonymization/scrubbing process exists.
- Document intentional environment drift and add tests or smoke checks for the drift.
- Prefer the same build artifact promoted through environments with different runtime config.
- Give every long-lived environment an owner, purpose, deploy source, data policy, and teardown/recovery notes.

## Do / Don't

| Do | Don't |
| :--- | :--- |
| Make environment differences explicit and reviewable. | Depend on hidden dashboard state or someone's shell profile. |
| Validate config before startup completes. | Let missing config fail deep inside a request. |
| Keep production credentials out of local and preview environments. | Reuse prod secrets because setup is faster. |
| Promote the same artifact where possible. | Rebuild different code for staging and production without a reason. |
| Remove stale flags and preview resources. | Let old environment toggles become permanent architecture. |

## Review Checklist

- Which environments are affected, and what is the blast radius?
- Is the same artifact promoted, or is code rebuilt per environment?
- Are config and secrets separated, validated, and injected at the right phase?
- Are backing services production-like where validation depends on them?
- Is any production data exposed to local, preview, or staging systems?
- Are feature flags owned, observable, tested, and scheduled for removal?
- Can a new developer or CI job reproduce the environment without private tribal knowledge?

## Handoff Rules

- Use `platform-secrets-config` when environment setup involves secrets, credentials, tokens, certificates, or sensitive config.
- Use `platform-deployments-rollbacks` when environment promotion is part of a release.
- Database migrations/data-shape differences and framework-specific config loading
  are base-model capability.
