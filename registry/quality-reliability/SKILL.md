---
name: quality-reliability
description: Reliability principles for language-agnostic software quality. Use when designing or reviewing failure modes, timeouts, retries, graceful degradation, observability, operational readiness, backpressure, recovery, and production confidence. Pair with compliance-security for abuse risks and stack experts for implementation details.
---

# Quality Reliability

Reliable systems behave predictably under stress, partial failure, dependency failure, and ordinary operational messiness.

## Principles

### 1. Assume Dependencies Fail

Every network call, database query, queue, cache, file system operation, and third-party API can timeout, fail, return malformed data, or succeed partially.

For each dependency, decide:

- Timeout.
- Retry policy.
- Fallback behavior.
- User-visible error.
- Logging/metric signal.

### 2. Use Retries Carefully

Retries help transient failures and amplify persistent ones. Use bounded retries with backoff, jitter, and idempotency. Never retry unsafe writes blindly.

### 3. Fail Gracefully

Prefer partial functionality over total failure when safe:

- Show cached or partial data with clear state.
- Degrade non-critical features first.
- Preserve user work.
- Provide recovery actions.

Do not hide failures that affect correctness or compliance.

### 4. Make Operations Observable

Important flows should emit enough logs, metrics, traces, or audit events to answer:

- Did it run?
- How long did it take?
- Did it fail?
- Which dependency failed?
- How many users or records were affected?

Avoid logging secrets or unnecessary personal data.

### 5. Control Load And Backpressure

Protect the system from overload with pagination, batching, rate limits, queue bounds, concurrency limits, circuit breakers, or admission control where appropriate.

## Review Checks

- What happens when each dependency is slow or down?
- Are timeouts explicit and shorter than caller timeouts?
- Are retries bounded and idempotent?
- Can operators diagnose failure without reproducing it locally?
- Is the user left with a clear recovery path?
