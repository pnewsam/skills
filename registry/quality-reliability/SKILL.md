---
name: quality-reliability
description: Reliability principles for language-agnostic software quality. Use when designing or reviewing failure modes, timeouts, retries, graceful degradation, observability, operational readiness, backpressure, recovery, and production confidence. Pair with compliance-security for abuse risks and stack experts for implementation details.
---

# Quality Reliability

## Use When

Use when a system must behave predictably under dependency failure, load, retries, partial success, or production debugging.

## Source Anchors

- Google code review guidance on functionality and complexity: https://google.github.io/eng-practices/review/reviewer/looking-for.html
- NIST SSDF for secure/resilient development process context: https://csrc.nist.gov/pubs/sp/800/218/final

## Core Position

Reliable systems make failure explicit: bounded, observable, recoverable, and safe. Local success is not enough if production failure modes are undefined.

## Common Agent Mistakes

- Calling external services without timeouts.
- Retrying writes without idempotency.
- Logging too little to debug or too much sensitive data.
- Treating queues/caches/databases as always available.
- Showing generic failure states with no recovery path.

## Decision Rubric

| Failure Mode | Required Design |
| :--- | :--- |
| Slow dependency | Timeout shorter than caller timeout; visible fallback or error. |
| Transient dependency failure | Bounded retry with backoff/jitter if operation is safe. |
| Unsafe write retry | Idempotency key, dedupe, transaction, or no retry. |
| Partial success | Compensation, resume, or explicit user/operator state. |
| Overload | Backpressure, pagination, rate limiting, queue bounds, or concurrency limits. |
| Production incident | Logs/metrics/traces that identify operation, dependency, duration, and outcome. |

## Evidence Signals

- Failure and recovery rate, timeout frequency, retry volume, queue age,
  dead-letter volume, and backlog growth can reveal recurring failure modes.
- Retry amplification or duplicate work is stronger evidence than raw retry
  count.
- Mean time to detect or diagnose is useful only when incident and observation
  data are trustworthy.
- Compare operational metrics only across compatible workloads, environments,
  and windows; a traffic increase is not automatically a reliability
  regression.

## Do / Don't

| Do | Don't |
| :--- | :--- |
| Define timeout, retry, fallback, and observability for each dependency. | Let default client timeouts decide production behavior. |
| Preserve user work on recoverable failures. | Drop input or hide failure behind a spinner. |
| Emit structured operational signals. | Log secrets, tokens, raw PII, or full sensitive payloads. |
| Limit concurrency and queue growth. | Assume traffic and background jobs are always small. |

## Review Checklist

- What happens when each dependency is slow, down, or malformed?
- Are retries bounded and idempotent?
- Is partial success recoverable?
- Can operators diagnose the failure without reproducing locally?
- Is the user given a safe next action?

## Handoff Rules

- Use stack experts for concrete timeout/retry/observability APIs.
- Use `compliance-security` or `compliance-privacy` when logs or failure paths touch sensitive data.
- Use `quality-correctness` when recovery must preserve invariants.
