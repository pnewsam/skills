---
name: async-patterns
description: Design or review asynchronous JavaScript and TypeScript control flow, including dependency-aware concurrency, cancellation, stale-result prevention, bounded parallelism, promise ownership, timeouts, and cleanup. Use when writing or diagnosing promise-based code, race conditions, hanging work, unhandled rejections, accidental serialization, or resource overload. Follow the project's runtime and framework conventions.
---

# Async Patterns

## Outcome

Make asynchronous ownership, ordering, cancellation, failure, and resource use
explicit. Optimize concurrency only after identifying which operations are
independent and what failure semantics the caller needs.

## Model the operation

Before choosing a pattern, answer:

- Which work depends on earlier results?
- Which work may run concurrently?
- Who owns completion or cancellation?
- What happens when one operation fails?
- Can partial results be used?
- What resource limits apply?
- Can a late result overwrite newer state?

## Patterns

### Use the clearest control flow

`async`/`await` is usually clearest for multi-step logic. Promise composition
can be clearer for direct transforms or library APIs. Consistency within one
operation matters more than banning `.then()`.

Do not add `async` merely to wrap a synchronous result unless an interface
requires a promise.

### Express dependency and concurrency honestly

Await dependent work in order. Start independent operations together:

```ts
const user = await loadUser(userId);
const [orders, preferences] = await Promise.all([
  loadOrders(user.id),
  loadPreferences(user.id),
]);
```

`Promise.all` fails fast from the caller's perspective, but it does not cancel
the remaining operations. Ensure abandoned work is harmless or pass a shared
cancellation signal.

Use `Promise.allSettled` only when the product can meaningfully process partial
success and every rejection will be inspected.

### Propagate cancellation

Make cancellation part of the operation contract when work can become
irrelevant:

```ts
async function search(query: string, signal: AbortSignal) {
  const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
    signal,
  });
  return response.json();
}

let activeController: AbortController | undefined;

async function handleInput(query: string) {
  activeController?.abort();
  const controller = new AbortController();
  activeController = controller;

  try {
    const results = await search(query, controller.signal);
    if (activeController === controller) setResults(results);
  } catch (error) {
    if (!isAbortError(error)) throw error;
  } finally {
    if (activeController === controller) activeController = undefined;
  }
}
```

Abort only work owned by the caller. Propagate the signal through internal
layers rather than creating unrelated controllers at each function.

### Guard stale results

Cancellation may be unavailable or arrive too late. Use a generation, request
identity, or framework-native mechanism to prevent an older result from
overwriting current state.

The guard protects state; cancellation additionally saves resources. They may
both be needed.

### Bound parallelism

Do not apply `Promise.all(items.map(...))` to an unbounded collection. Choose a
limit based on the downstream service, connection pool, memory, file handles,
and rate limits. Prefer an existing project utility or library over a naive
batch loop when fairness, ordering, or continuous scheduling matters.

### Own every promise

Every promise should be:

- awaited
- returned to a caller that owns it
- collected into an explicit group
- or intentionally detached with rejection reporting

For detached work, record failure and shutdown behavior. `void task()` documents
that the result is ignored; it does not handle rejection by itself.

### Timeouts and cleanup

A timeout should cancel or otherwise retire the underlying work, not merely
stop waiting for it. Release timers, listeners, locks, streams, and other
resources in `finally` or the runtime's structured cleanup mechanism.

### Loops

Use `for...of` with `await` for intentional sequencing. Use a mapped promise
group or concurrency limiter for intentional parallelism. Avoid async
`forEach`, whose returned promises are not collected.

## Review checklist

- Are actual dependencies serialized and independent tasks concurrent?
- Does failure behavior match all-or-nothing versus partial-success needs?
- Is cancellation owned and propagated?
- Can stale work mutate current state?
- Is parallelism bounded for large inputs?
- Are detached promises observed?
- Do timeouts retire work and cleanup resources?
- Are retry and idempotency handled by the correct boundary?

Use `error-handling` for the failure contract and `react-hooks-effects` for
React effect lifecycles.
