---
name: backend-jobs-queues
description: Backend background work guidance for queues, workers, scheduled jobs, retries, idempotency, dead-letter queues, concurrency, backpressure, long-running tasks, and operational visibility. Use when work should be deferred, retried, scheduled, or processed outside the request path.
---

# Backend Jobs And Queues

## Use When

Use for background jobs, queues, workers, scheduled tasks, long-running operations, retry policy, idempotency, dead-letter queues, backfills, rate-limited processing, and request-to-worker handoff.

## Source Anchors

- Amazon SQS at-least-once delivery: https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/standard-queues-at-least-once-delivery.html
- AWS Well-Architected idempotent mutating operations: https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/rel_prevent_interaction_failure_idempotent.html
- Enterprise Integration Patterns, Idempotent Receiver: https://www.enterpriseintegrationpatterns.com/patterns/messaging/IdempotentReceiver.html
- Microservices.io Idempotent Consumer: https://microservices.io/patterns/communication-style/idempotent-consumer.html
- Azure Retry pattern: https://learn.microsoft.com/en-us/azure/architecture/patterns/retry

## Core Position

Background work is distributed systems work in miniature. Assume duplicate execution, partial failure, reordering, delays, and retries. Make every job observable, bounded, idempotent, and recoverable.

## Common Agent Mistakes

- Moving slow work to a queue without defining idempotency or retry behavior.
- Retrying non-idempotent side effects such as payments, emails, or external writes.
- Letting jobs run forever without timeout, cancellation, or progress checkpoints.
- Treating dead-letter queues as a storage bin instead of an operations signal.
- Scheduling periodic jobs that overlap themselves.
- Hiding user-visible state transitions inside workers with no status model.
- Testing only enqueue success, not worker execution and failure handling.

## Decision Rubric

| Need | Preferred Pattern |
| :--- | :--- |
| Slow but required side effect | Commit primary data first, enqueue job after commit or via outbox |
| Retryable external call | Store idempotency key/state before the side effect and retry with bounded backoff |
| User-visible long task | Create a status record with progress, failure reason, retry/cancel behavior, and timestamps |
| Periodic sync | Use leases/locks to prevent overlap; record last successful checkpoint |
| High-volume queue | Add concurrency limits, backpressure, batching, and operational metrics |
| Poison message | Move to dead-letter queue with reason, attempt count, and replay path |
| Backfill | Make resumable, chunked, monitored, and safe to run more than once |

## Queue Guardrails

- Assume at-least-once delivery unless the platform proves otherwise, and still protect external side effects with idempotency.
- Treat enqueue as a state transition. If losing the job would corrupt product state, enqueue after commit via a transactional outbox or equivalent durable handoff.
- Use unique operation/message IDs and persist processed IDs or operation state before performing non-idempotent work.
- Configure visibility timeout/lease, worker timeout, retry backoff, max attempts, and dead-letter behavior together.
- Do not let scheduled jobs overlap unless overlap is explicitly safe. Use leases, checkpoints, or sharded work claims.
- Make user-visible asynchronous work queryable: `pending`, `running`, `succeeded`, `failed`, `cancelled`, timestamps, progress, and last error where relevant.
- Include replay guidance for dead-lettered jobs. A dead-letter queue without ownership and replay rules becomes silent data loss.

## Do / Don't

| Do | Don't |
| :--- | :--- |
| Treat at-least-once delivery as the default. | Assume a job executes exactly once. |
| Put idempotency around the side effect, not just around enqueue. | Check "was queued" and assume the side effect is safe. |
| Bound retries with exponential backoff and dead-letter behavior. | Retry forever or drop failures silently. |
| Record job state, attempts, duration, and last error. | Leave operators with only generic logs. |
| Keep request handlers fast but honest about eventual consistency. | Return success before the system can recover from failed deferred work. |

## Review Checklist

- Why is this work asynchronous, and what user/system state represents "pending"?
- Can the job run twice, out of order, late, or after a deploy?
- Is enqueue durable relative to the database commit that made the job necessary?
- Is each external side effect protected by idempotency or a provider idempotency key?
- Are timeout, retry, backoff, max attempts, and dead-letter behavior explicit?
- Is there a replay, repair, or manual intervention path?
- Are metrics/logs/traces sufficient to find stuck, slow, failing, and high-volume jobs?
- Are worker tests exercising success, retryable failure, permanent failure, and duplicate delivery?

## Handoff Rules

- Use `backend-persistence` for status tables, outbox/inbox tables, checkpoints, and migration/backfill storage.
- Use `backend-integrations` when jobs call third-party APIs or process webhooks.
- Use `quality-reliability` for operational failure modes, backpressure, and recovery evidence.
- Use stack experts for queue library, worker runtime, scheduler, and test harness details.
