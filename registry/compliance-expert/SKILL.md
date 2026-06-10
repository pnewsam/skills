---
name: compliance-expert
description: Route broad compliance, security, vulnerability management, accessibility, privacy, GDPR, HIPAA, auditability, and external-risk requests to the right compliance-* reference skills and existing remediation workflows. Use alongside stack experts for implementation details and ui-expert/design-expert for user-facing accessibility and privacy UX. Coordinates compliance-security, compliance-vulnerability-management, compliance-accessibility, compliance-privacy, compliance-gdpr, compliance-hipaa, and compliance-auditability.
---

# Compliance Expert - Skill Router

## Use When

Use for security, privacy, accessibility, regulated data, vulnerability, auditability, GDPR, HIPAA, or "are we allowed/safe/compliant?" prompts.

This is engineering guidance, not legal advice. If a decision depends on jurisdiction, contract terms, organizational policy, or regulatory interpretation, surface the legal/policy question explicitly.

## Source Anchors

- OWASP ASVS: https://owasp.org/www-project-application-security-verification-standard/
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- W3C WCAG 2.2: https://www.w3.org/TR/WCAG22/
- GDPR Regulation 2016/679: https://eur-lex.europa.eu/eli/reg/2016/679/oj
- HHS HIPAA Security Rule: https://www.hhs.gov/hipaa/for-professionals/security/index.html

## Core Position

Compliance skills translate external obligations and unacceptable risks into concrete engineering controls, evidence, and escalation points. They should prevent vague "be compliant" advice.

## Common Agent Mistakes

- Treating compliance as a checklist detached from product data flow.
- Giving legal conclusions instead of identifying engineering controls and escalation points.
- Applying GDPR/HIPAA labels without first checking data, actors, and applicability.
- Ignoring evidence: tests, scans, logs, approvals, and PR links.
- Treating accessibility as visual polish rather than operability and semantics.

## Decision Rubric

| Prompt Signal | Primary Skill | Secondary Skills |
| :--- | :--- | :--- |
| Authn/authz, injection, secrets, session safety, secure defaults | `compliance-security` | stack expert, `quality-correctness` |
| CVE, dependency advisory, CodeQL/SAST finding, patch risk | `compliance-vulnerability-management` | remediation planning workflows |
| Keyboard, screen reader, contrast, focus, form errors, WCAG | `compliance-accessibility` | `ui-expert`, `react-accessibility`, `color-expert` |
| PII, data minimization, retention, deletion, analytics, vendors | `compliance-privacy` | `compliance-gdpr` if EU/UK GDPR applies |
| GDPR, lawful basis, data subject rights, DPIA, breach notification | `compliance-gdpr` | `compliance-privacy`, legal/policy review |
| HIPAA, ePHI, covered entity, business associate, safeguards | `compliance-hipaa` | `compliance-security`, legal/policy review |
| Evidence, audit logs, approvals, exception tracking, traceability | `compliance-auditability` | `prepare-pr`, `assess-pr-risk` |

## Do / Don't

| Do | Don't |
| :--- | :--- |
| Start by identifying data, actors, systems, and obligation. | Say a feature is GDPR/HIPAA compliant without applicability review. |
| Convert obligations into concrete controls and evidence. | Provide generic "ensure compliance" recommendations. |
| Identify legal/policy escalation points. | Pretend engineering guidance is legal advice. |
| Pair with stack experts for implementation details. | Encode framework-specific code patterns in generic compliance skills. |

## Review Checklist

- What obligation or risk class is in scope?
- What data is involved and who can access it?
- What control prevents the unacceptable outcome?
- What evidence proves the control exists and worked?
- What decision needs legal, security, privacy, or policy owner review?

## Handoff Rules

- Use `plan-vulnerability-remediation` or `plan-code-scanning-remediation` for multi-step remediation work.
- Use `plan-feature` or `plan-epic` when compliance work requires product, workflow, or architecture change.
- Use stack experts for concrete implementation and tests.
