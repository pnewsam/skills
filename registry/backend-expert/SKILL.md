---
name: backend-expert
description: Route backend engineering requests to the smallest relevant backend-* skill set and synthesize the guidance. Use when a server-side build, review, refactor, or planning request spans two or more of API design, service boundaries, persistence, jobs, integrations, or auth, or when the primary backend concern is unclear. Prefer one focused backend-* skill for one clearly bounded concern; pair with stack experts for implementation.
---

# Backend Expert - Skill Router

Use this as the entry point for broad backend work. Identify the server-side responsibility, load only the focused `backend-*` skills needed, and keep the final advice language-agnostic unless a stack expert is also in scope.

Backend engineering is not governed by one standards body. Use protocol standards where they apply, and otherwise prefer canonical pattern literature, mature vendor architecture guidance, and production-proven provider documentation.

Use the router when the request spans two or more focused backend concerns and
needs a coherent recommendation. Go directly to one focused `backend-*` skill
when exactly one concern is clear.

---

## Source Anchors

- HTTP semantics and method contracts: https://www.rfc-editor.org/rfc/rfc9110.html
- Problem Details for HTTP APIs: https://www.rfc-editor.org/rfc/rfc9457.html
- Martin Fowler Service Layer: https://martinfowler.com/eaaCatalog/serviceLayer.html
- Martin Fowler Bounded Context: https://martinfowler.com/bliki/BoundedContext.html
- AWS Well-Architected Reliability idempotency guidance: https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/rel_prevent_interaction_failure_idempotent.html
- OWASP Authorization Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html

Use these as anchors, not as a mandate to over-architect. Apply the smallest pattern that makes the backend behavior safer, clearer, and easier to operate.

---

## 1. Routing Table

Load the smallest set of focused skills that covers the task.

| User Need | Primary Skill | Secondary Skills |
| :--- | :--- | :--- |
| Endpoints, resource modeling, request/response contracts, errors, pagination, versioning | `backend-api-design` | `backend-auth-boundaries`, `backend-service-boundaries` |
| Use cases, domain services, controllers/handlers, transaction ownership, dependency direction | `backend-service-boundaries` | `backend-persistence`, `quality-modularity` |
| Data modeling, migrations, transactions, consistency, repositories, query boundaries | `backend-persistence` | `backend-service-boundaries`, stack database skill |
| Background jobs, queues, schedules, retries, idempotency, dead-letter handling | `backend-jobs-queues` | `backend-persistence`, `quality-reliability` |
| Webhooks, third-party APIs, external sync, outbox/inbox, API clients, partial failure | `backend-integrations` | `backend-jobs-queues`, `compliance-security` |
| Authentication, authorization, tenant boundaries, sessions, tokens, permission checks | `backend-auth-boundaries` | `compliance-security`, stack expert |

If a request touches more than four rows, start with `backend-service-boundaries`, then add the focused skill closest to the user-visible failure or product behavior.

---

## 2. Overlap Boundaries

Use these boundaries to prevent conflicting advice:

- `backend-api-design` owns external HTTP/API shape: resources, contracts, status codes, pagination, versioning, idempotency keys, and error envelopes.
- `backend-service-boundaries` owns internal server-side ownership: handlers, services, use cases, domain behavior, transaction placement, dependency direction, and module boundaries.
- `backend-persistence` owns data storage shape: schemas, migrations, transactions, query boundaries, consistency, and data lifecycle at rest.
- `backend-jobs-queues` owns deferred work: scheduling, queues, retries, idempotency, concurrency, dead-letter handling, and worker observability.
- `backend-integrations` owns external systems: third-party clients, webhooks, sync jobs, outbox/inbox flows, rate limits, and partial failure handling.
- `backend-auth-boundaries` owns where identity and permission decisions are made and enforced.

Pair with stack experts for implementation details: `python-expert`, `react-expert` for frontend/client coordination, or other language/framework experts. Pair with `quality-expert` for maintainability, correctness, testing, and reliability. Pair with `compliance-expert` for security, privacy, regulated data, accessibility, or audit evidence.

If a request is mostly a security control, privacy obligation, or audit question, route to `compliance-expert` first and use backend skills to place the control in the system. If a request is mostly code health, use `quality-expert` first and use backend skills to preserve contracts and data behavior.

---

## 3. Build Protocol

Before editing backend code:

1. **Identify the boundary.** Is the change about API contract, use-case behavior, data persistence, background work, external integration, or auth?
2. **Trace the request path.** Name the entrypoint, authorization decision, validation boundary, service/use-case, transaction boundary, side effects, emitted events/jobs, and response.
3. **Choose focused skills.** Load only the relevant `backend-*` skills, then add stack skills for language/framework conventions.
4. **Keep IO at boundaries.** Entrypoints parse, validate, authorize, and translate. Core use-case behavior should be named and testable.
5. **Make failure explicit.** Define what happens on validation failure, auth denial, missing records, duplicates, timeouts, retries, and partial writes.
6. **Preserve contracts.** Avoid changing API, database, webhook, or job behavior accidentally. Call out migrations, compatibility, and rollout risk.
7. **Verify at the failure level.** Unit-test pure rules; integration-test database/API behavior; exercise jobs and integrations with realistic failure modes.

Do not introduce a new service layer, repository pattern, queue, cache, or event bus unless the current change needs that boundary.

---

## 4. Review Protocol

When reviewing backend code, report in this structure:

1. **Current State Summary:** entrypoints, data stores, external systems, auth model, async/job behavior, and tests.
2. **Skill Routing:** list the focused `backend-*` skills used and why.
3. **Finding -> Recommendation Table:**

| # | Skill | Current | Issue | Recommendation | Why |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `backend-api-design` | Endpoint returns different error shapes for validation and permission failures | Clients cannot handle failures predictably | Use a consistent error envelope with stable machine codes | API contracts include failure contracts |
| 2 | `backend-service-boundaries` | Route handler validates, mutates records, sends email, and builds response inline | One entrypoint owns too many reasons to change | Move use-case behavior into a named service and keep route translation thin | Behavior becomes easier to test and evolve |
| 3 | `backend-jobs-queues` | Worker retries payment capture without an idempotency guard | Retry can double-charge after partial failure | Store operation idempotency state before retryable side effects | Background work must assume duplicate execution |

4. **Implementation Priority:** name the 1-3 changes that most reduce product, data, security, or operational risk.

Keep findings grounded in behavior, contracts, data integrity, and operability rather than personal architecture preference.
