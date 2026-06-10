---
name: backend-integrations
description: Backend integration guidance for third-party APIs, webhooks, external clients, sync flows, provider rate limits, outbox/inbox patterns, partial failure, retries, mapping external data, and integration observability. Use when backend work crosses system or vendor boundaries.
---

# Backend Integrations

## Use When

Use for third-party API clients, webhooks, inbound/outbound sync, provider data mapping, rate limits, outbox/inbox flows, secrets/configuration, integration tests, and partial failure handling.

## Core Position

Every external system is unreliable, slower than local code, and governed by contracts you do not control. Isolate provider details, make sync state explicit, verify authenticity, and design for partial failure from the start.

## Common Agent Mistakes

- Calling external APIs directly from domain logic or route handlers.
- Trusting inbound webhooks without signature verification and replay protection.
- Treating provider IDs, states, and error messages as internal domain truth.
- Retrying requests without checking provider idempotency and rate limits.
- Failing the whole user operation because a non-critical notification or analytics call failed.
- Storing secrets or provider tokens in logs, fixtures, or client-visible responses.
- Testing only mocked happy paths, not contract drift or provider failure.

## Decision Rubric

| Integration Concern | Preferred Guidance |
| :--- | :--- |
| Client boundary | One provider client module translates auth, requests, responses, errors, and timeouts. |
| Inbound webhook | Verify signature, timestamp/tolerance, idempotency, event type allowlist, and replay handling. |
| Outbound side effect | Use idempotency keys where available and record provider operation state. |
| Sync | Store cursor/checkpoint and make sync resumable and safe to rerun. |
| Mapping | Translate provider enums/IDs into internal concepts at the boundary. |
| Rate limits | Apply backoff, concurrency limits, and queued processing for bursty flows. |
| Provider outage | Degrade gracefully, queue retryable work, and expose status when user-visible. |

## Do / Don't

| Do | Don't |
| :--- | :--- |
| Keep provider-specific code at the integration boundary. | Let provider response shapes leak through services, APIs, and UI. |
| Verify webhook authenticity before parsing into trusted events. | Process unauthenticated webhook payloads because they "look right." |
| Record enough state to reconcile and replay. | Assume local state and provider state will never drift. |
| Classify provider errors as retryable, permanent, auth/config, rate limit, or unknown. | Catch all integration errors and return generic failure. |
| Use realistic fixtures or contract tests for critical integrations. | Mock away every behavior that could break in production. |

## Review Checklist

- What is the provider boundary, and are provider details isolated there?
- Are credentials, tokens, signatures, and secrets protected from logs and client responses?
- Are inbound events authenticated, deduplicated, ordered/tolerant of reordering, and replay-safe?
- Are outbound calls timed out, retried only when safe, and rate-limit aware?
- Is there reconciliation for drift between local and provider state?
- What happens when the provider is slow, down, changes contract, or returns partial success?
- Are integration tests covering authentication failure, retryable failure, permanent failure, and duplicate events?

## Handoff Rules

- Use `backend-jobs-queues` when integration work should be queued, retried, scheduled, or reconciled asynchronously.
- Use `backend-auth-boundaries` when external identity providers, OAuth, sessions, tenant claims, or permissions are involved.
- Use `compliance-security` for secret handling, webhook verification, SSRF risk, supply chain, and secure configuration.
- Use `compliance-privacy` for vendor data sharing, personal data flows, and data processing concerns.
- Use stack experts for HTTP client, SDK, environment/config, and test implementation details.
