---
name: compliance-privacy
description: Privacy engineering guidance for personal data handling. Use when reviewing PII collection, data minimization, consent, purpose limitation, retention, deletion, logging, analytics, third-party sharing, user rights, and privacy-safe defaults. Pair with stack experts for implementation and legal review for jurisdiction-specific obligations.
---

# Compliance Privacy

Privacy work limits what personal data is collected, how it is used, where it flows, how long it remains, and who can access it.

## Principles

### 1. Classify Data Before Designing The Flow

Identify whether the system handles:

- Direct identifiers: name, email, phone, address, account ID.
- Sensitive data: health, finance, precise location, credentials, government IDs.
- Behavioral data: analytics, events, search, clicks, device metadata.
- Derived or inferred data: scores, segments, predictions, risk labels.

### 2. Minimize Collection And Retention

Collect only what the product needs for a named purpose. Retain it only as long as needed for that purpose, legal obligation, abuse prevention, or user expectation.

### 3. Keep Purpose Boundaries Clear

Do not reuse data for analytics, training, marketing, sharing, or personalization unless that use is expected, disclosed, and permitted by the product's policy and consent model.

### 4. Avoid Sensitive Logs

Logs, analytics, crash reports, traces, and support tools often become accidental data stores. Redact or avoid personal data unless operationally necessary.

### 5. Design For Deletion And Access

If users or admins may need export, correction, deletion, or account closure, data relationships must make that feasible.

### 6. Review Third Parties

Map data sent to vendors, model providers, analytics tools, payment processors, email providers, and observability platforms. Know what leaves the system.

## Review Checks

- What personal data is collected and why?
- Where is it stored, logged, cached, exported, or shared?
- How long is it retained?
- Can it be deleted or corrected?
- Is consent or notice required for this use?
- Does a lower-data design satisfy the same product need?
