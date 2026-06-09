---
name: compliance-auditability
description: Auditability and evidence guidance for compliance-sensitive systems. Use when designing traceability, change records, approval evidence, audit logs, remediation proof, access records, decision records, and verifiable controls. Pair with prepare-pr, assess-pr-risk, and remediation workflows for PR and evidence artifacts.
---

# Compliance Auditability

Auditability means the system and team can prove what happened, who approved it, why it was acceptable, and how resolution was verified.

## Principles

### 1. Capture Evidence At The Moment Of Work

Evidence is strongest when created as part of the workflow: PRs, reviews, test output, scanner output, deployment logs, screenshots, audit events, and linked tickets.

### 2. Link Decisions To Artifacts

Important decisions should connect:

- Requirement or risk.
- Change or control.
- Reviewer or approver.
- Validation evidence.
- Deployment or release record.

### 3. Make Audit Logs Useful

Audit logs should answer who did what, to which resource, when, from where, and with what result. Avoid logging sensitive payloads unless absolutely required.

### 4. Preserve Tamper Resistance Proportionally

High-risk systems may need append-only logs, restricted access, retention policies, signed artifacts, or external log sinks. Lower-risk systems may need clear PR and ticket traceability.

### 5. Track Exceptions Explicitly

Risk acceptance, skipped checks, disabled alerts, and temporary mitigations need owners, expiry dates, rationale, and follow-up work.

## Review Checks

- Can someone reconstruct the change from issue to PR to deployment?
- Is there evidence that required tests, scans, or reviews passed?
- Are sensitive actions logged without exposing sensitive data?
- Are exceptions time-bound and owned?
- Would an auditor or future maintainer understand why the decision was made?
