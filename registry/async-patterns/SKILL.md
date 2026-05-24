---
name: async-patterns
description: principles for writing asynchronous JavaScript and TypeScript. covers async/await over raw promises, Promise.all for concurrency, avoiding sequential awaits, AbortController for cancellation, race condition guards, and async function coloring. reference this skill when writing async code, reviewing promise usage, or debugging concurrency issues.
---

# Async Patterns

## Overview

This skill defines the principles for writing asynchronous code in JavaScript and TypeScript. The core philosophy: make async control flow as readable as sync, run independent work concurrently, and always handle cancellation and error propagation.

## Principles

### 1. Prefer async/await over raw promise chains

`async`/`await` reads like synchronous code. Promise chains (`.then().catch()`) are harder to follow, especially with branching or loops.

```ts
// Bad: promise chain — hard to trace the data flow
function loadDashboard(userId: string): Promise<Dashboard> {
  return fetchUser(userId)
    .then((user) =>
      Promise.all([fetchInvoices(user.id), fetchNotifications(user.id)])
    )
    .then(([invoices, notifications]) => ({
      user: /* lost access to user */,
      invoices,
      notifications,
    }));
}

// Good: async/await — data flow is linear and clear
async function loadDashboard(userId: string): Promise<Dashboard> {
  const user = await fetchUser(userId);
  const [invoices, notifications] = await Promise.all([
    fetchInvoices(user.id),
    fetchNotifications(user.id),
  ]);
  return { user, invoices, notifications };
}
```

### 2. Run independent work concurrently

When multiple async calls don't depend on each other, run them concurrently with `Promise.all` (or `Promise.allSettled` when partial failure is acceptable).

```ts
// Bad: sequential — each await blocks the next
async function loadPage() {
  const user = await fetchUser();
  const config = await fetchConfig(); // waits for user unnecessarily
  const announcements = await fetchAnnouncements(); // waits for both
  return { user, config, announcements };
}

// Good: concurrent — independent calls run in parallel
async function loadPage() {
  const [user, config, announcements] = await Promise.all([
    fetchUser(),
    fetchConfig(),
    fetchAnnouncements(),
  ]);
  return { user, config, announcements };
}
```

Use `Promise.allSettled` when you want all results regardless of individual failures:

```ts
const results = await Promise.allSettled([
  fetchAnalytics(),
  fetchRecommendations(),
  fetchNotifications(),
]);

for (const result of results) {
  if (result.status === "fulfilled") {
    // result.value
  } else {
    // result.reason
  }
}
```

### 3. Don't mix `await` and `.then()` in the same function

Pick one style per function.

```ts
// Bad: mixing styles
async function getData() {
  const user = await fetchUser();
  return fetchInvoices(user.id).then((invoices) => ({ user, invoices }));
}

// Good: consistent async/await
async function getData() {
  const user = await fetchUser();
  const invoices = await fetchInvoices(user.id);
  return { user, invoices };
}
```

### 4. Use AbortController for cancellable operations

Any async operation that might become irrelevant (user navigates away, types more characters, changes a filter) should be cancellable.

```ts
// Example: search-as-you-type with cancellation
async function search(query: string, signal: AbortSignal): Promise<Result[]> {
  const response = await fetch(`/api/search?q=${query}`, { signal });
  return response.json();
}

// In a React component or event handler:
const controller = new AbortController();

async function handleInput(value: string) {
  controller.abort(); // cancel the previous search
  const newController = new AbortController();
  try {
    const results = await search(value, newController.signal);
    setResults(results);
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return; // expected — the request was cancelled
    }
    throw error;
  }
}
```

### 5. Guard against race conditions from out-of-order responses

When a fast request follows a slow one, the slow response can overwrite the fast one. Cancel the previous request or track the request id.

```ts
// Using an id to ignore stale responses
let nextRequestId = 0;

async function fetchResults(query: string) {
  const requestId = ++nextRequestId;
  const results = await searchAPI(query);

  // Ignore if a newer request was made while this one was in flight
  if (requestId !== nextRequestId) return;

  setResults(results);
}
```

Prefer `AbortController` over request-id tracking — it's cleaner and also cancels the network request.

### 6. Don't make functions async that don't need to be

If a function doesn't use `await`, don't mark it `async`. An `async` function wraps the return value in a Promise, adding overhead and forcing callers to handle a promise.

```ts
// Bad: unnecessary async
async function getUserName(user: User): Promise<string> {
  return user.name;
}

// Good: synchronous
function getUserName(user: User): string {
  return user.name;
}
```

The exception is when implementing an interface or callback that requires returning a Promise — then `async` is appropriate even without `await`.

### 7. Handle Promise rejections at the boundary

Just like synchronous errors, async errors should be caught at system boundaries, not at every call site.

```ts
// Good: catch at the boundary
app.get("/api/users/:id", async (req, res) => {
  try {
    const user = await getUser(req.params.id);
    res.json(user);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});
```

The internal `getUser` function can throw or return a Result — either way, the boundary handler is the right place to map errors to responses.

### 8. Limit concurrency for resource-heavy operations

`Promise.all` on a large array fires all requests at once, which can overwhelm APIs, databases, or file handles. Use batching or a concurrency limit.

```ts
async function processBatch<T, R>(
  items: T[],
  fn: (item: T) => Promise<R>,
  concurrency: number = 5,
): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    const batchResults = await Promise.all(batch.map(fn));
    results.push(...batchResults);
  }
  return results;
}
```

### 9. Prefer `for...of` with `await` over `forEach` with async callbacks

`forEach` does not wait for async callbacks. Use a `for...of` loop when you need sequential async work.

```ts
// Bug: forEach fires all promises but doesn't await them
items.forEach(async (item) => {
  await processItem(item); // these run concurrently, not awaited
});
// Code here runs before any processItem completes

// Good: for...of awaits each iteration
for (const item of items) {
  await processItem(item);
}
```

If you want concurrent execution, use `Promise.all(items.map(fn))` — that makes the concurrency intent explicit.