---
name: compliance-privacy
description: Privacy engineering guidance for personal data handling. Use when reviewing PII collection, minimization, purpose limitation, retention, deletion, logging, analytics, third-party sharing, user rights support, and privacy-safe defaults. Use compliance-gdpr for GDPR-specific obligations. Pair with stack experts for implementation and legal review for jurisdiction-specific obligations.
---

# Compliance Privacy

## Use When

Use for general privacy engineering: personal data flows, minimization, retention, deletion, logging, analytics, vendor sharing, privacy-safe defaults, and data lifecycle design.

This is engineering guidance, not legal advice. Use `compliance-gdpr` for GDPR-specific obligations and escalate legal interpretation.

## Source Anchors

- NIST Privacy Framework: https://www.nist.gov/privacy-framework
- GDPR Regulation 2016/679 for GDPR-specific work: https://eur-lex.europa.eu/eli/reg/2016/679/oj

## Core Position

Privacy-safe systems collect less, expose less, retain less, and make data flows explicit. If a lower-data design satisfies the product need, choose it.

## Checks — make the data map and lifecycle runnable

Privacy is auditable in the repo: collection, flow, logging, and deletion can be checked as tests/sweeps, and the results are the reviewable record.

- **PII inventory sweep** — scripted search for PII fields and full-payload logging; keep the inventory generated.
- **Third-party flow map** — each analytics/SDK/vendor integration lists the data it receives and the purpose.
- **Delete/export test** — run through storage, logs, caches, backups, and vendors, and assert the result.
- **Retention asserts** — default retention config must be explicit; flag unbounded retention in review.
- **Manual gate** — new-purpose reuse, notice/consent updates, and jurisdiction decisions belong with privacy/legal owners.
## Common Agent Mistakes

- Treating email/name as the only personal data.
- Logging full payloads "for debugging."
- Sending data to analytics/model/vendor services without mapping the flow.
- Adding retention/deletion promises without data-model support.
- Reusing data for a new purpose without checking consent/notice/policy.

## Decision Rubric

| Question | Expected Output |
| :--- | :--- |
| What data is collected? | Direct identifiers, sensitive data, behavioral data, derived data. |
| Why is it collected? | Named product, security, legal, or operational purpose. |
| Where does it flow? | Storage, logs, analytics, vendors, exports, caches, backups. |
| How long is it kept? | Retention rule or explicit unknown requiring owner decision. |
| Who can access it? | User/admin/staff/vendor/system roles and enforcement point. |
| Can it be deleted/exported/corrected? | Supported workflow or explicit gap. |

## Do / Don't

| Do | Don't |
| :--- | :--- |
| Minimize fields, events, logs, and vendor payloads. | Collect "maybe useful later" data. |
| Redact or avoid personal data in logs/traces/crash reports. | Treat observability stores as safe by default. |
| Map third-party data sharing. | Add analytics/model/email vendors without data review. |
| Design deletion/retention with data relationships in mind. | Promise deletion while leaving orphaned copies. |

## Review Checklist

- What personal data exists and why?
- Where is it stored, logged, cached, exported, or shared?
- What is the retention/deletion path?
- What role or system can access it?
- What lower-data alternative would still work?
- Does this trigger GDPR, HIPAA, or another specific regime?

## Handoff Rules

- Use `compliance-gdpr` for GDPR, EU/UK users, lawful basis, rights, breach, or DPIA concerns.
- Use `compliance-hipaa` when health data may be ePHI.
- Use stack experts for implementation and `compliance-auditability` for evidence/log design.
