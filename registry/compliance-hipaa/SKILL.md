---
name: compliance-hipaa
description: HIPAA-specific privacy and security engineering guidance. Use when handling health data that may be ePHI, covered entity/business associate workflows, safeguards, access controls, audit controls, integrity controls, transmission security, risk assessment, and breach/security review. This is not legal advice; escalate applicability and policy decisions.
---

# Compliance HIPAA

## Use When

Use when a product may handle protected health information, electronic PHI, healthcare workflows, covered entity/business associate relationships, patient data access, or HIPAA Security Rule safeguards.

This is engineering guidance, not legal advice. Escalate covered entity/business associate status, PHI/ePHI classification, business associate agreements, breach determination, and policy decisions.

## Source Anchors

- HHS HIPAA Security Rule: https://www.hhs.gov/hipaa/for-professionals/security/index.html
- HHS HIPAA Privacy Rule: https://www.hhs.gov/hipaa/for-professionals/privacy/index.html
- Security Rule safeguard categories: administrative, physical, and technical safeguards.

## Core Position

HIPAA-oriented engineering starts by identifying ePHI and enforcing safeguards around access, audit, integrity, transmission, and risk management. Do not label a system HIPAA-ready without applicability and policy review.

## Common Agent Mistakes

- Treating all health-adjacent data as HIPAA-covered without checking actors and context.
- Storing ePHI in logs, analytics, support tools, or AI/model providers.
- Adding authentication but not access controls, audit controls, or transmission security.
- Forgetting business associate/vendor review.
- Claiming compliance from encryption alone.

## Decision Rubric

| HIPAA Concern | Engineering Requirement |
| :--- | :--- |
| ePHI identification | Map data elements, systems, logs, backups, exports, and vendors. |
| Access control | Unique users, least privilege, role boundaries, emergency/access procedures where applicable. |
| Audit controls | Record access/use of ePHI with actor, resource, action, time, and result. |
| Integrity | Prevent/detect improper alteration or destruction of ePHI. |
| Transmission security | Protect ePHI in transit; avoid insecure channels and accidental disclosure. |
| Risk assessment | Identify threats, vulnerabilities, likelihood, impact, and mitigation evidence. |
| Vendor/BAA | Confirm business associate handling before sending ePHI to a service. |

## Do / Don't

| Do | Don't |
| :--- | :--- |
| Identify whether data is PHI/ePHI and who is handling it. | Assume HIPAA applies or does not apply from data shape alone. |
| Keep ePHI out of logs, analytics, crash reports, and broad support tooling. | Log full clinical/user payloads for debugging. |
| Enforce least-privilege access and audit sensitive access. | Treat login alone as sufficient control. |
| Review vendors before sharing ePHI. | Send ePHI to tools without BAA/applicability review. |

## Review Checklist

- Is the organization/product acting as covered entity, business associate, or neither?
- Which data is PHI/ePHI and where does it flow?
- What access control and audit controls exist?
- How is ePHI protected in transit and at rest where applicable?
- Are logs/support/analytics/model providers free of ePHI unless approved?
- What risk assessment or security review evidence exists?

## Handoff Rules

- Use `compliance-security` for concrete access, encryption, logging, and transmission controls.
- Use `compliance-privacy` for data minimization and lifecycle design.
- Use `compliance-auditability` for audit logs and evidence.
- Escalate applicability, BAA, breach, and policy decisions to legal/privacy/security owners.
