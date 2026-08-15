---
name: backend-service-boundaries
description: Backend service boundary guidance for handlers, controllers, services, use cases, domain logic, dependency direction, transaction ownership, side-effect orchestration, and module boundaries. Use when backend code feels tangled, overly thin, overly layered, or hard to test.
---

# Backend Service Boundaries

## Use When

Use for server-side architecture questions about where behavior belongs: routes/controllers, services, use cases, domain modules, repositories, validators, side effects, and transaction boundaries.

## Source Anchors

- Martin Fowler Service Layer: https://martinfowler.com/eaaCatalog/serviceLayer.html
- Martin Fowler Bounded Context: https://martinfowler.com/bliki/BoundedContext.html
- Domain-Driven Design Reference by Eric Evans: https://domainlanguage.com/wp-content/uploads/2016/05/DDD_Reference_2015-03.pdf
- Microsoft DDD/CQRS microservices architecture guide: https://learn.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/

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

## Boundary Heuristics

- Create a service/use-case boundary when an operation is reused by multiple entrypoints, owns a transaction, coordinates several dependencies, or expresses domain language worth testing directly.
- Do not create a service boundary just to move code out of a handler. The extracted unit must have a clearer name, responsibility, or test surface.
- Put transaction ownership at the operation level that understands the whole invariant. Helpers should not secretly commit or roll back.
- Keep domain language inside the bounded context where it is true. If the same word means different things in two areas, create separate models or an explicit mapping layer.
- Use anti-corruption/mapping boundaries for external systems and legacy subsystems whose concepts do not match the local domain.
- Prefer a modular monolith boundary before splitting a deployable service; distributed boundaries add latency, partial failure, observability, and deployment cost.

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
