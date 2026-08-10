---
name: error-handling
description: Design or review JavaScript and TypeScript failure contracts across functions, async work, APIs, jobs, and system boundaries. Use when deciding between exceptions and explicit result values, defining typed errors, translating failures, preserving causal context, retrying safely, cleaning up resources, or preventing swallowed and unhandled errors. Adapt to the project's established error model rather than imposing one universal pattern.
---

# Error Handling

## Outcome

Make each failure observable at the right boundary, actionable by the caller, safe for users, and diagnosable by operators without leaking sensitive data.

## Classify before choosing a representation

Distinguish:

- expected domain outcomes such as validation, conflict, missing data, or a denied action
- transient operational failures such as timeout or dependency unavailability
- programmer errors and broken invariants
- cancellation and shutdown
- partial failure in batch or distributed work

Then choose the representation that matches the local API:

- a discriminated result or domain union when callers routinely branch on an expected outcome
- a typed exception when the ecosystem or framework propagates failure that way
- a rejected promise for asynchronous exceptions
- a protocol response at HTTP, queue, CLI, UI, or process boundaries

Do not mix several conventions for the same layer without a clear adapter.

## Preserve structured identity

Use stable error classes or discriminants for programmatic decisions. Messages are for people and may change.

Include relevant structured context, retain the original error as `cause` where supported, and never force callers to parse strings.

When catching an unknown value, narrow or normalize it safely. Do not assume every thrown value is an `Error`.

## Catch only to do useful work

A catch block should:

- recover
- translate to the current boundary
- add meaningful context while preserving the cause
- compensate or clean up
- or report and terminate owned background work

Otherwise, allow propagation. Logging and rethrowing at every layer creates duplicate noise and can expose data.

Never silently swallow a failure. If ignoring it is intentional, encode that decision in the API or name and capture the operational signal appropriate to its consequence.

## Translate at boundaries

Map internal failures once at the boundary that owns the protocol:

- HTTP status and safe response body
- queue acknowledgement, retry, or dead-letter decision
- CLI exit code and stderr
- UI state and recovery action
- process shutdown or supervisor signal

Keep internal details out of user responses. Preserve correlation IDs and safe diagnostic context in logs or telemetry.

## Retry deliberately

Retry only when:

- the failure is plausibly transient
- the operation is idempotent or protected by an idempotency key
- attempts are bounded
- delay uses appropriate backoff and jitter
- cancellation and total deadline are respected
- exhaustion has a defined outcome

Do not retry authorization, validation, deterministic conflict, or programmer errors. Avoid retries at multiple layers that multiply attempts unexpectedly.

## Cleanup and partial work

Use `finally`, disposal APIs, or scoped resource helpers for locks, streams, connections, timers, and temporary state.

For multi-step writes, define atomicity, compensation, resumption, and idempotency. An exception alone does not undo completed side effects.

## Background and detached work

Every asynchronous task needs an owner. Await or return it when possible. For intentional background work, define:

- rejection reporting
- retry and deduplication
- shutdown behavior
- trace/correlation context
- persistence when process loss matters

An unhandled rejection is an ownership defect, not a logging strategy.

## Observability and safety

Record enough to identify the operation and cause, but redact secrets, credentials, request bodies, and personal data. Avoid high-cardinality or attacker-controlled log fields.

Separate:

- user-facing message
- stable programmatic code
- operator detail
- original cause

## Review checklist

- Is the failure classified correctly?
- Does its representation fit the layer and project convention?
- Can callers branch without parsing messages?
- Is causal context preserved?
- Does each catch recover, translate, enrich, clean up, or terminate?
- Are side effects atomic, compensatable, or resumable?
- Are retries bounded, cancellable, and safe?
- Are detached promises owned?
- Does the protocol reveal only safe information?
- Is the unhappy path tested at the boundary that promises the behavior?

Use `async-patterns` for concurrency and cancellation structure and `react-error-handling` for UI containment and recovery.
