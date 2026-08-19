---
name: threat-model
description: Threat-model a feature, service, architecture, integration, or planned change by mapping assets, actors, data flows, trust boundaries, abuse cases, controls, and residual risk. Use before implementation, during architecture or security review, or when a change introduces authentication, authorization, sensitive data, external integrations, privileged operations, or new attack surface. Defaults to analysis in chat; writes a local threat-model document only when explicitly requested.
---

# Threat Model

## Outcome

Produce a scoped, evidence-backed threat model that helps engineering decide what must be prevented, detected, limited, tested, or explicitly accepted. Prioritize credible abuse paths over exhaustive checklist coverage.

This is engineering security analysis, not legal advice or a penetration test. Secure-coding guidance and applicable controls are base-model capability once the threats are understood.

## Modes and effects

- **Analyze mode:** inspect available architecture and return the model in chat. This is the default and performs no writes.
- **Document mode:** write or refresh `docs/security/threat-model-<scope>.md` only when the user asks to save, create, or update the document.

Never modify source code, infrastructure, tickets, commits, or external systems. Do not run active security scans or probes unless separately requested and authorized.

## Inputs

Use the best available evidence:

- architecture and data-flow documentation
- routes, handlers, clients, schemas, storage, queues, and deployment config
- identity, session, tenant, and permission model
- feature plan or proposed design
- existing security controls and incident history

If a material boundary is unknown, state the assumption instead of inventing the architecture.

## Workflow

### 1. Set the scope

Name the feature or system, its entrypoints, users, deployment boundary, and explicit exclusions. Identify the security decision the model should support.

Avoid modeling an entire organization when the requested change affects one bounded flow.

### 2. Inventory assets and security objectives

List what requires protection and why:

- credentials, sessions, secrets, and cryptographic material
- personal, financial, health, or proprietary data
- integrity of permissions, transactions, configuration, and audit evidence
- availability of critical workflows and dependencies
- administrative or destructive capabilities

Express objectives as confidentiality, integrity, availability, authenticity, authorization, accountability, or privacy properties.

### 3. Map actors, entrypoints, and data flows

Include legitimate users, administrators, services, vendors, anonymous users, compromised accounts, malicious tenants, and relevant insiders.

Trace data and control across:

- browsers, devices, APIs, workers, and administrative surfaces
- databases, object stores, caches, and queues
- identity providers and third-party integrations
- CI/CD, runtime configuration, and operational tooling

### 4. Mark trust boundaries

A trust boundary exists where identity, ownership, validation, privilege, execution environment, or control changes. Typical examples include:

- public client to authenticated API
- one tenant to shared services or storage
- application to database or queue
- first-party system to vendor webhook/API
- build system to production deployment
- ordinary user to administrative action

Do not treat network location alone as trust.

### 5. Identify abuse cases

Use STRIDE as a coverage aid, not as the output:

- spoofing or session theft
- tampering with requests, state, artifacts, or audit records
- repudiation where evidence is insufficient
- information disclosure
- denial of service or resource exhaustion
- elevation of privilege

Also ask:

- Can one tenant act on another tenant's object?
- Can a replay, race, retry, or duplicate operation cause harm?
- Can untrusted content cross into code, queries, templates, paths, or logs?
- Can a lower-trust system influence a higher-trust decision?
- Can recovery, support, import/export, or admin paths bypass normal controls?

Write each threat as:

> An actor can exploit an entrypoint or boundary to affect an asset, causing a
> concrete security consequence.

### 6. Rank and treat

Rate each threat by credible impact and exploitability: Critical, High, Medium, or Low. Avoid numeric precision unsupported by evidence.

For every Critical or High threat, identify:

- preventive control
- detection or audit evidence
- limiting control or blast-radius boundary
- verification method
- owner or unresolved decision

Mark the disposition: mitigate, avoid, transfer, accept, or investigate. Acceptance requires an explicit owner and rationale.

### 7. Validate completeness

Check that:

- every important asset crosses or resides behind a named boundary
- every privileged or destructive action has an authorization decision
- tenant and object ownership checks are explicit
- external inputs are authenticated or validated as appropriate
- retries, concurrency, and failure recovery do not bypass controls
- critical controls have tests or other verifiable evidence
- residual risks and assumptions are visible

### 8. Present or write the model

Use `references/threat_model_template.md`. In Document mode, preserve accurate existing content and update evidence, assumptions, threats, and decisions without erasing unresolved ownership.

## Handoffs

- Identity, tenant, and permission-boundary implementation is base-model capability.
- Regulated-data obligations (GDPR, HIPAA) are base-model capability for engineering guidance; escalate legal interpretation to a privacy/legal owner.
- Use `analyze-security` when the model should be compared with current controls or combined with dependency and code-scanning evidence.
- Use `plan-feature` in Convergence mode for one concrete remediation outcome.
- Use `review-pr` Risk mode when evaluating the implementation diff.
