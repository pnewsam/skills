---
name: compliance-security
description: General secure coding and application security guidance anchored in OWASP ASVS, OWASP Top 10, OWASP Cheat Sheet Series, and NIST SSDF. Use when reviewing authentication, authorization, injection risk, secrets, sessions, sensitive logging, supply chain, CI/CD, and secure defaults. Pair with stack experts for implementation details.
---

# Compliance Security

## Use When

Use for application security review, secure implementation planning, auth/authz risk, injection, secrets, session safety, sensitive errors/logging, CI/CD security, or supply-chain controls.

This is engineering guidance, not legal advice. Escalate organization-specific security policy decisions to the security owner.

## Source Anchors

- OWASP ASVS: https://owasp.org/www-project-application-security-verification-standard/
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- OWASP Cheat Sheet Series: https://cheatsheetseries.owasp.org/
- NIST SSDF SP 800-218: https://csrc.nist.gov/pubs/sp/800/218/final

## Core Position

Security controls must be enforced at trusted boundaries, not only hinted in UI or convention. Prefer secure-by-construction APIs over "remember to sanitize" guidance.

## Checks — scan and gate, then verify

Tooling catches the obvious injection, secret, and dependency classes; it cannot prove authorization or supply-chain intent, which stay a manual review. Run these in CI:

- **SAST** — CodeQL, Semgrep, or the language's analyzer with the injection/authz/secret rule sets on every PR.
- **Dependency scanning** — OSV, Dependabot, or platform advisory feed fails the build on reachable vulnerable versions.
- **Secret scanning** — gitleaks/trufflehog in pre-commit plus push protection, so credentials never land in history or logs.
- **CI hardening** — `permissions: read-only` defaults, pinned third-party actions, and no long-lived cloud credentials in workflows.
- **Manual gate** — trace one request through authn → authz → data access per sensitive object; no tool proves authorization.
## Common Agent Mistakes

- Confusing authentication with authorization.
- Checking permissions only in client UI.
- Building SQL, shell, HTML, URLs, or file paths with untrusted strings.
- Logging secrets, tokens, stack traces, or raw personal data.
- Leaving CI tokens, workflow permissions, and dependency provenance unreviewed.

## Decision Rubric

| Risk             | Required Control                                                                       |
| :--------------- | :------------------------------------------------------------------------------------- |
| Authorization    | Server/service/data-layer authorization on every sensitive action and object.          |
| Injection        | Parameterized APIs, contextual encoding, allowlists, and no string-built interpreters. |
| Secrets          | No secrets in source/client/logs; scoped credentials; rotation path for exposure.      |
| Sessions         | Secure cookies/tokens, expiry, revocation, CSRF protection where relevant.             |
| Sensitive errors | User-safe errors; detailed diagnostics only in protected logs.                         |
| Supply chain     | Lockfiles, advisory scanning, trusted registries, minimal CI permissions.              |

## Do / Don't

| Do                                                                    | Don't                                                 |
| :-------------------------------------------------------------------- | :---------------------------------------------------- |
| Enforce authorization where data changes or leaves the system.        | Rely on hidden buttons or route guards alone.         |
| Use structured safe APIs for queries, templates, commands, and paths. | Concatenate untrusted input into an interpreter.      |
| Redact secrets and sensitive data at logging boundaries.              | Log full request/response bodies by default.          |
| Scope tokens, service accounts, and CI permissions narrowly.          | Grant broad repo/cloud permissions "to make CI work." |

## Review Checklist

- What trusted boundary enforces authorization?
- Can untrusted data reach SQL, shell, HTML, URL, path, or code execution?
- Are secrets protected from source, client bundles, logs, and errors?
- Are sessions/tokens scoped, expiring, and revocable?
- Are CI/CD and dependency changes reviewed for supply-chain risk?
- What test, scan, or review proves the control?

## Handoff Rules

- Use stack experts for concrete auth, validation, encoding, and framework APIs.
- Use `compliance-vulnerability-management` for known CVEs/advisories.
- Use `compliance-auditability` for evidence, approvals, and exception tracking.
- Use `analyze-security` for repository-wide posture analysis or recurring hardening candidate discovery.
- Use `plan-feature` and `execute-feature` for one verified, bounded security improvement.
