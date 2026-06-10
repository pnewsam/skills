---
name: platform-secrets-config
description: Platform secrets and configuration guidance for environment variables, secret stores, runtime injection, CI secrets, rotation, leakage prevention, config validation, and separation of secret vs non-secret settings. Use when work touches credentials, tokens, keys, certificates, or runtime configuration.
---

# Platform Secrets And Config

## Use When

Use for secrets, credentials, API keys, tokens, certificates, runtime config, environment variables, secret stores, CI secrets, rotation, redaction, and config validation.

## Source Anchors

- Twelve-Factor App config: https://12factor.net/config
- OWASP Secrets Management Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html
- Kubernetes Secrets: https://kubernetes.io/docs/concepts/configuration/secret/
- GitHub Actions secure use reference: https://docs.github.com/en/actions/reference/security/secure-use

## Core Position

Secrets and config are different things. Config can be reviewed and documented; secrets must be protected, rotated, scoped, audited, and injected only where needed.

## Common Agent Mistakes

- Putting secrets in `.env.example`, fixtures, screenshots, logs, images, or generated docs.
- Treating every environment variable as a secret and losing reviewability for normal config.
- Baking secrets into build artifacts, container images, static bundles, or client-side code.
- Using one shared secret across local, staging, CI, and production.
- Adding a secret without owner, rotation plan, scope, or revocation procedure.
- Printing config objects in logs without redaction.
- Reading secrets at import/build time when runtime injection is required.

## Decision Rubric

| Value Type | Handling |
| :--- | :--- |
| Non-sensitive config | Document in checked-in examples; validate at startup; review changes |
| Public client config | Explicitly mark safe for browser/mobile exposure; never include secrets |
| Secret | Store in platform secret manager; inject at runtime; redact logs; scope access |
| High-risk secret | Prefer short-lived/dynamic credential, rotation, audit, break-glass plan |
| CI secret | Restrict to trusted workflows/environments; avoid fork PR exposure |
| Certificate/key material | Track expiry, rotation, ownership, and dependent services |

## Guardrails

- Keep a checked-in config schema or documented list of required variables with type, purpose, default, owner, and environments.
- Validate config at startup and fail fast with a safe error that does not print secret values.
- Inject production secrets at runtime or deploy time, not build time, unless the artifact is environment-specific and protected accordingly.
- Prefer short-lived credentials and workload identity/OIDC over static long-lived keys.
- Rotate secrets with overlapping old/new support when downtime or deploy race is possible.
- Redact by key name and value pattern in logs, CI output, error reports, and diagnostics.
- Add leak response steps when touching high-risk secrets: revoke, rotate, audit use, and check logs/artifacts.

## Do / Don't

| Do | Don't |
| :--- | :--- |
| Separate secret values from reviewable config shape. | Commit real secrets or encourage copying them into examples. |
| Scope secrets to environment, app, and purpose. | Reuse one broad secret everywhere. |
| Use runtime injection for values that must rotate independently. | Bake secrets into images or static bundles. |
| Redact secrets in logs and CI output. | Dump environment variables during debugging. |
| Track owner and rotation for sensitive credentials. | Create permanent mystery keys. |

## Review Checklist

- Is this value actually secret, or just environment-specific config?
- Where is the value stored, injected, read, logged, rotated, and revoked?
- Can untrusted CI jobs, preview deployments, or client bundles access it?
- Does startup validation catch missing or malformed config safely?
- Are secrets scoped to least privilege and the smallest necessary environment?
- Is there a safe rotation path with overlapping credentials if needed?
- Are logs, traces, errors, screenshots, and artifacts protected from leakage?

## Handoff Rules

- Use `compliance-security` for deeper secret, credential, token, and supply-chain controls.
- Use `platform-ci-cd` when secrets are consumed by workflows.
- Use `platform-environments` when config varies across local, preview, staging, and production.
- Use stack experts for framework-specific env loading and build-time/runtime config behavior.
