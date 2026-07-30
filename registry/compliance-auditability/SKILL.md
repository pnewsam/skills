---
name: compliance-auditability
description: Auditability and evidence guidance for compliance-sensitive systems. Use when designing traceability, change records, approval evidence, audit logs, remediation proof, access records, decision records, exception ownership, and verifiable controls. Pair with prepare-pr, review-pr Risk mode, and remediation workflows for PR and evidence artifacts.
---

# Compliance Auditability

## Use When

Use when a team must prove what changed, who approved it, what control exists, what action occurred, or how a risk was resolved.

This is engineering evidence guidance, not legal advice. Escalate records retention, audit scope, and regulatory evidence requirements to the appropriate owner.

## Source Anchors

- NIST SSDF evidence-oriented development practices: https://csrc.nist.gov/pubs/sp/800/218/final
- OWASP ASVS verification framing: https://owasp.org/www-project-application-security-verification-standard/

## Core Position

If it was not captured, linked, and preserved, it is weak evidence. Create evidence as part of the workflow, not after the fact.

## Common Agent Mistakes

- Saying "verified" without naming command, scan, artifact, or reviewer.
- Logging sensitive payloads in the name of auditability.
- Accepting risk without owner, expiry, and rationale.
- Designing audit events that omit actor, resource, action, time, or result.
- Leaving PRs disconnected from alerts, tickets, decisions, and deployments.

## Decision Rubric

| Need | Evidence |
| :--- | :--- |
| Code change | PR, commit, review, test output, deployment record. |
| Vulnerability remediation | Advisory ID, affected/fixed versions, scanner clean result, regression tests. |
| Sensitive action | Audit log with actor, action, resource, timestamp, result, and source context. |
| Risk acceptance | Owner, rationale, expiry, compensating controls, follow-up issue. |
| Compliance control | Policy/control mapping, implementation link, verification artifact. |

## Do / Don't

| Do | Don't |
| :--- | :--- |
| Link issue, PR, scan, test, and deployment evidence. | Leave evidence scattered in chat or local terminal output only. |
| Keep audit logs structured and queryable. | Store unstructured prose that cannot answer who/what/when/result. |
| Redact sensitive payloads. | Log secrets/PII/ePHI to prove access occurred. |
| Time-box exceptions. | Accept permanent risk without review. |

## Review Checklist

- Can someone reconstruct the change from issue to PR to deployment?
- Is there evidence that required tests, scans, or reviews passed?
- Are sensitive actions logged without exposing sensitive data?
- Are exceptions owned, justified, and expiring?
- Would an auditor or future maintainer understand the decision?

## Handoff Rules

- Use `prepare-pr` and `review-pr` Review or Risk mode for PR evidence.
- Use remediation workflow skills for scanner/advisory evidence.
- Use stack experts for concrete audit log implementation.
