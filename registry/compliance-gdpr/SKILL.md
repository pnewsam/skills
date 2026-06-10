---
name: compliance-gdpr
description: GDPR-specific privacy engineering guidance. Use when working with EU/UK personal data, lawful basis, Article 5 principles, data subject rights, consent, retention, breach notification, DPIA triggers, data protection by design/default, processors, and international transfers. This is not legal advice; escalate legal interpretation.
---

# Compliance GDPR

## Use When

Use when GDPR may apply: EU/UK users, EU/UK personal data, data subject rights, lawful basis, consent, profiling, retention, breach response, processors, transfers, or data protection by design/default.

This is engineering guidance, not legal advice. Escalate lawful basis, controller/processor status, transfer mechanisms, DPIA decisions, and breach-reporting obligations to legal/privacy owners.

## Source Anchors

- GDPR Regulation 2016/679: https://eur-lex.europa.eu/eli/reg/2016/679/oj
- Article 5 principles, Article 6 lawful basis, Articles 12-23 rights, Article 25 design/default, Articles 33-34 breach notification, Article 35 DPIA.

## Core Position

GDPR work starts with a data map and purpose. Engineering should minimize personal data, enforce purpose boundaries, support rights workflows, and preserve evidence for accountability.

## Common Agent Mistakes

- Asking for consent when another lawful basis may be intended, or assuming consent by default.
- Collecting personal data without a named purpose.
- Building deletion/export promises without tracing logs, backups, vendors, and derived data.
- Ignoring profiling/automated decision implications.
- Treating pseudonymized data as non-personal without review.

## Decision Rubric

| GDPR Concern | Engineering Requirement |
| :--- | :--- |
| Article 5 principles | Purpose limitation, minimization, accuracy, storage limitation, integrity/confidentiality, accountability evidence. |
| Lawful basis | Product/legal owner must identify basis before collection/use changes. |
| Rights | Access, correction, deletion, restriction, portability, objection workflows or explicit gaps. |
| Consent | Freely given, specific, informed, unambiguous, withdrawable; record consent evidence. |
| Design/default | Collect minimum by default; privacy-protective defaults. |
| Breach | Detection, triage, affected data/users, timeline evidence, escalation path. |
| DPIA trigger | High-risk processing, sensitive data at scale, profiling, systematic monitoring. |

## Do / Don't

| Do | Don't |
| :--- | :--- |
| Map personal data fields, purposes, stores, vendors, retention, and deletion. | Add data collection first and ask privacy later. |
| Build rights workflows from the data model outward. | Assume deleting the user row deletes all personal data. |
| Record consent/version/source when consent is used. | Treat a checked box as enough without evidence and withdrawal. |
| Minimize analytics/model/vendor payloads. | Send full records to third parties by default. |

## Review Checklist

- What personal data is processed and for what purpose?
- Has the lawful basis been identified by the appropriate owner?
- Can the system support access, correction, deletion, and export where required?
- Is retention defined and technically enforceable?
- Do vendors/processors receive only necessary data?
- Does this processing require DPIA, legal review, or breach escalation?

## Handoff Rules

- Use `compliance-privacy` for general data minimization and lifecycle design.
- Use `compliance-security` for confidentiality/integrity controls.
- Use `compliance-auditability` for accountability evidence.
- Use legal/privacy owner review for lawful basis, rights scope, transfer mechanism, DPIA, and breach notification.
