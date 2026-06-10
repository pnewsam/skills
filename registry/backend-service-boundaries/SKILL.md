---
name: backend-service-boundaries
description: Backend service boundary guidance for handlers, controllers, services, use cases, domain logic, dependency direction, transaction ownership, side-effect orchestration, and module boundaries. Use when backend code feels tangled, overly thin, overly layered, or hard to test.
---

# Backend Service Boundaries

## Use When

Use for server-side architecture questions about where behavior belongs: routes/controllers, services, use cases, domain modules, repositories, validators, side effects, and transaction boundaries.

## Core Position

Backend code should make the business operation obvious. Entrypoints translate protocols, services/use cases coordinate behavior, persistence modules store and query data, and external side effects are explicit. Add layers only when they clarify ownership or testing.

## Common Agent Mistakes

- Moving code into a "service" file without improving ownership or testability.
- Keeping all behavior inside route handlers because it is initially convenient.
- Creating one generic service or repository that becomes a dumping ground.
- Mixing domain rules with HTTP status codes, database sessions, email clients, and queue clients.
- Starting transactions in multiple layers without clear ownership.
- Adding abstractions before the repeated decision is understood.

## Decision Rubric

| Code Belongs In | Owns | Should Not Own |
| :--- | :--- | :--- |
| Handler/controller | Auth call, input parsing, validation call, response/error translation | Business rules, transaction details, multi-step side effects |
| Use case/service | One named operation, orchestration, transaction scope, domain decisions | Framework objects, raw request/response objects |
| Domain module | Pure rules, state transitions, invariants | Network calls, database sessions, HTTP errors |
| Persistence module | Queries, writes, transaction helpers, storage-specific constraints | Product workflow decisions |
| Integration client | External API protocol, retries allowed by provider, response mapping | Domain policy or user-facing branching |
| Worker/job | Deferred execution and retry handling | New business rules that differ from synchronous path |

## Do / Don't

| Do | Don't |
| :--- | :--- |
| Name use cases after user/business operations, not technical mechanisms. | Create vague classes such as `Manager`, `Helper`, or `Processor` without a clear responsibility. |
| Keep dependency direction inward: protocol/framework code depends on domain/use-case code. | Let domain logic import web framework types or job runner types. |
| Make transaction ownership explicit. | Open implicit nested transactions across unrelated helpers. |
| Isolate side effects behind named calls. | Send emails, webhooks, and queue messages in the middle of hidden helper chains. |
| Prefer one clear boundary over many ceremonial layers. | Add controller-service-repository stacks where direct, testable code is simpler. |

## Review Checklist

- Can you describe each module's reason to change in one sentence?
- Does the route/controller read like protocol translation rather than the whole business process?
- Is the transaction boundary owned by one layer and visible in tests?
- Are domain invariants represented near the domain behavior that changes them?
- Are external side effects ordered intentionally relative to database commits?
- Can core behavior be tested without starting the whole server?
- Is any abstraction justified by repeated behavior or meaningful substitution?

## Handoff Rules

- Use `backend-persistence` when the boundary problem involves schemas, transactions, migrations, or query placement.
- Use `backend-api-design` when boundary changes alter external contracts.
- Use `backend-jobs-queues` when side effects should move to deferred work or need retry/idempotency handling.
- Use `quality-modularity` or `quality-refactoring` when the issue is primarily code health rather than backend architecture.
- Use stack experts for framework-specific dependency injection, module layout, and tests.
