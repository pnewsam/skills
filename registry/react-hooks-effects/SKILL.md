---
name: react-hooks-effects
description: principles for React hooks and effects in SPA React apps. covers useEffect as an escape hatch, avoiding derived-state effects, dependency arrays, stale closures, cleanup, refs vs state, custom hooks, and Strict Mode behavior. reference this skill when adding or reviewing hooks, effects, subscriptions, browser API integration, timers, or reusable hook abstractions.
---

# React Hooks and Effects

## Overview

This skill defines how hooks should be used in React SPAs. The core philosophy: render should stay pure, effects should synchronize with external systems, and reusable hooks should package behavior without hiding control flow.

## Principles

### 1. Effects are for external systems

Use `useEffect` when React needs to synchronize with something outside React:

- Browser APIs: `localStorage`, `document.title`, media queries, observers
- Network or realtime subscriptions: WebSocket, EventSource, custom event emitters
- Timers and intervals
- Third-party widgets that manage their own DOM or imperative lifecycle

Do not use effects for values that can be calculated during render.

```tsx
// Bad: redundant state and an unnecessary effect
const [fullName, setFullName] = useState("");

useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);

// Good: derive during render
const fullName = `${firstName} ${lastName}`;
```

If an effect only copies props or state into another piece of state, remove the second state or use a reducer that updates the related values atomically.

### 2. Event logic belongs in event handlers

If logic happens because the user did something, put it in that event handler. Effects run because rendering happened, so they should not be used to infer which user action occurred.

```tsx
// Good: submit action is explicit
async function handleSubmit(values: FormValues) {
  await saveInvoice(values);
  toast.success("Invoice saved");
}
```

Use effects for "the component is now connected to X" work, not "the user clicked Y" work.

### 3. Dependency arrays describe what the effect reads

The dependency array is not a scheduling preference. It is a declaration of the reactive values the effect reads. Include props, state, and functions from component scope unless they are stable by construction.

```tsx
useEffect(() => {
  const connection = createConnection(roomId);
  connection.connect();
  return () => connection.disconnect();
}, [roomId]);
```

If adding a dependency causes unwanted reruns, change the code structure instead of suppressing the lint rule:

- Move event-specific logic to an event handler
- Move pure calculations into render or `useMemo`
- Move unstable objects/functions inside the effect
- Stabilize callback props only when a stable reference is semantically needed

### 4. Clean up every subscription

Any effect that registers, starts, opens, or schedules something should clean it up.

```tsx
useEffect(() => {
  const controller = new AbortController();

  fetch(`/api/invoices/${id}`, { signal: controller.signal })
    .then(response => response.json())
    .then(setInvoice)
    .catch(error => {
      if (error.name !== "AbortError") setError(error);
    });

  return () => controller.abort();
}, [id]);
```

For API data in production apps, prefer a server-state library such as TanStack Query or SWR; see `react-data-fetching`. Manual effect fetching is acceptable for one-off browser integration or very small projects, but it should still handle cancellation and race conditions.

### 5. Strict Mode should not break effects

In development, React Strict Mode intentionally mounts, unmounts, and remounts components to expose unsafe effects. Effects must be idempotent:

- Setup should tolerate running more than once
- Cleanup should fully undo setup
- Network writes should usually happen in event handlers, not mount effects
- Analytics and logging effects should deduplicate if duplicate development events are noisy

Do not "fix" Strict Mode by disabling it or by adding flags that hide missing cleanup.

### 6. Use refs for mutable values that do not render

Use `useRef` for mutable values that should survive renders but should not trigger a render:

- DOM nodes
- Timeout or interval IDs
- Previous values used for comparison
- Imperative integration handles

Use `useState` when the UI should update in response to the value changing.

```tsx
const timeoutRef = useRef<number | null>(null);

function scheduleSave() {
  if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
  timeoutRef.current = window.setTimeout(saveDraft, 500);
}
```

### 7. Avoid stale closures

A closure becomes stale when async work or a callback reads values from an old render. Prefer patterns that make the data flow explicit:

- Use functional state updates when the next value depends on the previous value
- Include changing values in dependency arrays
- Store non-rendering latest values in a ref only when you deliberately need "latest value" semantics
- Keep async work cancellable

```tsx
// Good: avoids closing over a stale count
setCount(current => current + 1);
```

Do not use refs to dodge dependencies by default. Refs trade reactivity for mutability; use that trade only when it is intentional.

### 8. Extract custom hooks around behavior, not files

Create a custom hook when it names a reusable behavior or isolates a complex integration:

- `useMediaQuery`
- `useDebouncedValue`
- `useInvoiceQuery`
- `useUnsavedChangesWarning`
- `useRovingTabIndex`

Avoid extracting a hook that is just a random bundle of state variables from one component. A good hook has a clear contract: inputs, outputs, ownership of side effects, and cleanup.

```tsx
function useDebouncedValue<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timeoutId);
  }, [value, delay]);

  return debouncedValue;
}
```

### 9. Hook decision guide

| Situation | Prefer |
|---|---|
| Value can be calculated from props/state | Plain variable or `useMemo` if expensive |
| User action triggers work | Event handler |
| Component synchronizes with browser/external system | `useEffect` with cleanup |
| Multiple related state transitions | `useReducer` |
| Mutable value does not affect UI | `useRef` |
| Reusable behavior with state/effects | Custom hook |
| API server state | TanStack Query/SWR, not hand-rolled effects |
