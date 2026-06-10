---
name: backend-api-design
description: API design guidance for backend services. Use when designing, reviewing, or refactoring HTTP APIs, resource models, request and response contracts, validation, errors, pagination, filtering, versioning, idempotency, and client-facing backend behavior.
---

# Backend API Design

## Use When

Use for endpoint design, resource modeling, API contracts, request/response bodies, errors, pagination, filtering, sorting, versioning, idempotency keys, and compatibility.

## Core Position

An API is a product contract. Design the success path, failure path, compatibility story, and client ergonomics together. Prefer boring, predictable contracts over clever endpoint shapes.

## Common Agent Mistakes

- Designing only the happy-path response and leaving errors ad hoc.
- Using verbs and RPC-style endpoints when a resource/action model would be clearer.
- Returning data that mirrors database tables instead of client needs and permission boundaries.
- Adding filters, pagination, or sorting without stable ordering and documented limits.
- Changing response shapes without a compatibility or migration plan.
- Treating idempotency as optional for create, payment, webhook, and retry-prone operations.

## Decision Rubric

| Decision | Prefer | Avoid |
| :--- | :--- | :--- |
| Endpoint shape | Resource-oriented nouns plus explicit action subresources when needed | Endpoint names that expose implementation steps |
| Request shape | Small, validated DTOs with clear required/optional fields | Passing raw persistence models across the wire |
| Response shape | Stable fields, explicit nullability, client-relevant data | Leaking internal columns, flags, or role-only data |
| Errors | Consistent envelope with human message and stable machine code | Free-form strings or framework default traces |
| Pagination | Cursor pagination for changing lists; limit/offset for stable admin lists | Unbounded list endpoints |
| Versioning | Compatible additive changes first; explicit versioning for breaking changes | Silent breaking changes |
| Idempotency | Required for retryable non-read side effects | Assuming clients will not retry |

## Do / Don't

| Do | Don't |
| :--- | :--- |
| Design errors, empty responses, forbidden responses, and validation failures as first-class API behavior. | Let every handler invent its own status codes and error body. |
| Validate and normalize inputs at the API boundary. | Push raw untrusted request fields deep into domain or persistence code. |
| Include stable identifiers, timestamps, and state names only when clients need them. | Expose internal implementation state because it is easy. |
| Document limits, sort order, filter semantics, and idempotency behavior. | Add list endpoints with no max page size or deterministic ordering. |
| Keep backward compatibility unless a migration plan exists. | Rename or remove fields because a refactor made them inconvenient. |

## Review Checklist

- Can a client predict every response shape, including validation, auth, conflict, not found, rate limit, and server failure?
- Are status codes meaningful and consistent?
- Are request fields validated for type, range, enum membership, length, and cross-field invariants?
- Does the API avoid leaking hidden records, tenant data, internal IDs, secrets, or persistence-only fields?
- Are list endpoints bounded, ordered, filterable, and test-covered?
- Are retryable operations idempotent or explicitly unsafe to retry?
- Is there a compatibility plan for any breaking contract change?

## Handoff Rules

- Use `backend-service-boundaries` when the API shape depends on use-case ownership or domain behavior.
- Use `backend-auth-boundaries` when response data or endpoint availability depends on identity, role, tenant, or permission.
- Use `compliance-security` when API design involves auth, injection, rate limiting, secrets, or abuse prevention.
- Use stack experts for framework-specific router, serializer, validation, and OpenAPI/schema generation details.
