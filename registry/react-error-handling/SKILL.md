---
name: react-error-handling
description: Design or review failure handling and recovery in React applications, including render error boundaries, route errors, expected data failures, mutation failures, reset behavior, and user-safe reporting. Use when deciding where errors should surface, preventing one failure from crashing an entire interface, or building contextual retry and recovery. Loading-state and Suspense design belong to react-data-fetching or ui-feedback unless directly coupled to an error boundary.
---

# React Error Handling

## Outcome

Contain failures at the smallest useful boundary, present an honest and actionable user state, preserve unaffected work, and capture enough evidence to diagnose unexpected errors.

Follow the router, framework, and data library already used by the project.

## Classify the failure

Choose handling based on origin and recoverability:

| Failure | Typical treatment |
| --- | --- |
| Render or lifecycle exception | Nearest meaningful Error Boundary |
| Route loader/action/render failure | Framework or router route-error surface |
| Expected query failure | Contextual inline state with retry when safe |
| Expected mutation rejection | Keep user input; attach feedback to the action or fields |
| Event-handler failure | Catch in the handler or called action; boundaries do not catch it |
| Background async failure | Explicit rejection handling plus user or operational signal |
| Application bootstrap failure | Minimal root fallback independent of fragile providers |

React Error Boundaries do not catch every asynchronous callback, event handler, server-rendering failure, or error thrown inside the boundary itself. Do not use them as a universal error channel.

## Place boundaries by recovery scope

Use a boundary where:

- one section can fail while the rest remains useful
- a route should fail without destroying the application shell
- an untrusted or third-party widget needs isolation
- recovery can reset the failed state or navigate elsewhere

Avoid a boundary around every small component. Excess boundaries fragment recovery, hide systemic failures, and create noisy fallback UI.

Always keep a root boundary as a last resort. Its fallback should not depend on the same providers, data, translations, or component tree that may have failed.

## Expected data and action failures

Handle expected failures close to the task:

- preserve entered data after a failed mutation
- identify what failed in user terms
- distinguish validation, authorization, conflict, missing data, and transient service failure when the API contract supports it
- retry only when the operation is safe or idempotent
- avoid exposing stack traces, internal identifiers, or sensitive details

Use a boundary for unexpected rendering or invariant failures, not for every ordinary 404 or rejected form submission.

## Recovery and reset

A Retry button must do more than rerender the same broken state. Define what it resets:

- error-boundary state
- failed query or loader
- stale route state
- relevant local state
- cached or memoized value that caused the failure

Key boundaries to stable resource or route identity when changing that identity should clear the error. Preserve unrelated user work and prevent repeated destructive mutations.

Offer navigation away when local recovery is not credible.

## Reporting

Unexpected errors should produce:

- normalized error and causal chain
- route or feature boundary
- release/build version
- correlation or trace identifier when available
- safe user/session context permitted by policy
- component stack or framework context

Deduplicate repeated reports and redact secrets, tokens, form contents, and personal data. Expected validation or authorization outcomes normally need metrics or audit events, not exception reports.

## Workflow

1. Map error sources and existing router, data, and telemetry conventions.
2. Classify each failure as expected/unexpected and local/systemic.
3. Choose the smallest recovery scope that preserves useful UI.
4. Specify user message, retry semantics, navigation, and state preservation.
5. Specify operational evidence and redaction.
6. Test render failure, expected data failure, failed mutation, retry failure, successful recovery, and root fallback.

## Checklist

- Does each boundary isolate a meaningful unit?
- Are event and async errors handled outside render boundaries?
- Are expected failures represented contextually?
- Does retry reset the actual failed dependency?
- Is user input preserved when appropriate?
- Can the root fallback render with minimal dependencies?
- Are errors reported once with safe diagnostic context?
- Are error messages accessible and focus behavior deliberate?

## Handoffs

- Use `react-data-fetching` for query state, retry policy, and Suspense-enabled data flows.
- Use `ui-feedback` for loading, empty, success, and non-error status patterns.
- Use `error-handling` for JavaScript/TypeScript failure contracts below the UI.
- Use `react-testing` for boundary and recovery test strategy.
