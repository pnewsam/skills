---
name: compliance-expert
description: Route broad compliance, security, vulnerability management, accessibility, privacy, auditability, and external-risk requests to the right compliance-* reference skills and existing remediation workflows. Use alongside stack experts for implementation details and ui-expert/design-expert for user-facing accessibility and privacy UX. Coordinates compliance-security, compliance-vulnerability-management, compliance-accessibility, compliance-privacy, and compliance-auditability.
---

# Compliance Expert - Skill Router

Use this as the entry point for compliance-oriented work. Identify the obligation or risk class, load only the relevant `compliance-*` skills, and route implementation to stack or workflow skills when needed.

This skill provides engineering guidance, not legal advice. If a decision depends on jurisdiction, contract terms, or regulatory interpretation, surface that explicitly.

## Initial Response

When invoked without a specific request, respond only with:

> I'm ready to route the compliance work. Tell me the product surface, data involved, and the obligation or risk you're concerned about.

Do not provide any other information until the user asks a question or presents a compliance task.

---

## 1. Routing Table

| User Need | Primary Skill | Secondary Skills |
| :--- | :--- | :--- |
| Secure coding, auth/authz, secrets, injection, least privilege | `compliance-security` | stack expert, `quality-correctness` |
| CVEs, dependency advisories, CodeQL/SAST findings, patch risk | `compliance-vulnerability-management` | `plan-vulnerability-remediation`, `plan-code-scanning-remediation` |
| Keyboard access, semantic structure, contrast, forms, assistive tech | `compliance-accessibility` | `ui-expert`, `react-accessibility`, `color-expert` |
| PII, consent, minimization, retention, deletion, logging, third parties | `compliance-privacy` | stack expert, `quality-reliability` |
| Evidence, traceability, logs, approvals, change records, audit trails | `compliance-auditability` | `prepare-pr`, `assess-pr-risk` |

If implementation is required, route to the relevant stack expert after the compliance risk is clear. If remediation needs durable planning, hand off to the epic/feature workflow or existing remediation planning skills.

---

## 2. Overlap Boundaries

- `compliance-security` owns abuse resistance and secure implementation constraints.
- `compliance-vulnerability-management` owns advisory triage and remediation strategy.
- `compliance-accessibility` owns disability access obligations and inclusive interaction requirements.
- `compliance-privacy` owns personal data collection, use, sharing, retention, and deletion risk.
- `compliance-auditability` owns evidence that the system did what it was supposed to do.

When two skills overlap, ask: "Is the main concern attack resistance, known vulnerability exposure, accessibility, personal data, or evidence?"

---

## 3. Review Protocol

When reviewing compliance risk, report:

1. **Scope:** product surface, data involved, users affected, and systems touched.
2. **Obligation/Risk Class:** security, vulnerability, accessibility, privacy, auditability, or mixed.
3. **Findings:** prioritized by severity, exploitability, user impact, and remediation urgency.
4. **Recommended Path:** immediate fix, planned epic/feature, policy/legal escalation, or accepted risk.
5. **Evidence:** tests, scans, logs, screenshots, PR links, or artifacts needed to prove resolution.

Avoid vague "be compliant" advice. Tie every recommendation to a concrete risk and observable proof.
