---
name: react-performance
description: performance principles for React applications — memoization, code splitting, virtualization, concurrent features, and profiling. reference this skill when diagnosing re-render issues, optimizing large lists, splitting bundles, or deciding whether to use React.memo / useMemo / useCallback.
---

# React Performance

## Overview

This skill covers the performance patterns and APIs that matter in production React applications. The core philosophy: **profile first, optimize second.** Most React apps are fast enough by default if the component design is clean (see `react-component-design`). Optimization should target measured bottlenecks, not speculative concerns.

## Principles

### 1. Profile before optimizing

React DevTools Profiler is your primary tool. Before adding `React.memo`, `useMemo`, or `useCallback` anywhere, open the profiler and identify what's actually slow.

**How to profile:**
- Open React DevTools → Profiler tab
- Click record, perform the slow interaction, stop recording
- Look at the flamegraph: which components re-rendered, and how long did each take?
- Focus on components that re-render frequently AND take measurable time (>1ms)

**Common findings:**
- A component re-renders 50 times but each render is 0.1ms → not a problem, don't optimize
- A component re-renders once but takes 200ms → the render itself is expensive (large list, complex computation)
- A parent re-renders and causes 500 children to re-render → consider memoization at the boundary

Don't optimize render counts. Optimize render *cost*.

### 2. React.memo — use sparingly and intentionally

`React.memo` prevents a component from re-rendering when its props haven't changed. It's useful at specific boundaries, not as a default.

**When to use `React.memo`:**
- A component is expensive to render (complex JSX, many children) AND its parent re-renders frequently for reasons unrelated to this component
- List item components rendered many times — memoizing the item prevents all items from re-rendering when the list container's state changes
- Components that receive stable props but sit under a frequently-updating parent

```tsx
// Good use: expensive list item under a parent that re-renders often
const AgentCard = React.memo(function AgentCard({ agent }: Props) {
  // complex rendering
});

// The parent re-renders when selection changes, but unselected cards
// don't need to re-render because their props haven't changed
function AgentList({ agents }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  return agents.map(agent => (
    <AgentCard
      key={agent.id}
      agent={agent}
      isSelected={agent.id === selectedId}
      onSelect={setSelectedId}
    />
  ));
}
```

**When NOT to use `React.memo`:**
- On every component by default — this adds comparison overhead and creates false confidence
- When the component's props change on every render anyway (new objects/arrays created inline) — memo will compare and re-render every time, adding cost
- On small, cheap components — the comparison costs more than just re-rendering

**The key insight:** `React.memo` only helps if the props are actually stable between renders. If the parent creates new objects or callbacks on every render, memo does nothing. This is where `useMemo` and `useCallback` come in.

### 3. useMemo and useCallback — stabilize expensive computations and references

**`useMemo`** — memoize the result of an expensive computation:

```tsx
// Good: expensive filtering/sorting that shouldn't re-run on every render
const sortedItems = useMemo(
  () => items.sort((a, b) => a.name.localeCompare(b.name)),
  [items]
);

// Bad: memoizing something trivial
const fullName = useMemo(() => `${first} ${last}`, [first, last]);
// Just write: const fullName = `${first} ${last}`;
```

**`useCallback`** — memoize a function reference so it doesn't change on every render:

```tsx
// Useful when passing callbacks to memoized children
const handleSelect = useCallback((id: string) => {
  setSelectedId(id);
}, []);

// Without useCallback, a new function is created every render,
// which defeats React.memo on the child component
```

**Rules of thumb:**
- Use `useMemo` for computations that are genuinely expensive (sorting large arrays, complex transformations, creating derived data structures)
- Use `useCallback` for callbacks passed to `React.memo`-wrapped children or as dependencies of other hooks
- Don't use either for cheap operations — the memoization overhead isn't free
- If you're not sure whether something is expensive, it probably isn't. Profile to find out.

### 4. Code splitting with React.lazy and Suspense

Don't ship the entire app in one bundle. Split code at route boundaries so users only download what they need for the current page.

```tsx
import { lazy, Suspense } from "react";

// Each page is loaded only when its route is visited
const InvoicesPage = lazy(() => import("./pages/invoices-page"));
const AgentsPage = lazy(() => import("./pages/agents-page"));
const SettingsPage = lazy(() => import("./pages/settings-page"));

function AppRoutes() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/invoices/*" element={<InvoicesPage />} />
        <Route path="/agents/*" element={<AgentsPage />} />
        <Route path="/settings/*" element={<SettingsPage />} />
      </Routes>
    </Suspense>
  );
}
```

**Where to split:**
- **Route boundaries** — the most impactful and lowest-risk split point. Each page becomes its own chunk.
- **Heavy feature components** — a rich text editor, chart library, or code editor that isn't needed on initial load
- **Modals with heavy content** — the modal's content can be lazy-loaded when opened

**Where NOT to split:**
- Small components that are used everywhere — the overhead of loading outweighs the savings
- Components that are always visible on the page — they'll just flash a loading state

**Suspense fallbacks should match the layout** of what's loading. Use skeleton screens that approximate the page structure, not a generic spinner. This prevents layout shift when the content loads.

### 5. Virtualization for long lists

If you're rendering more than ~100 items in a list, don't render them all. Use virtualization to render only the visible items plus a small buffer.

Libraries: **TanStack Virtual**, **react-virtuoso**, **react-window**

```tsx
import { useVirtualizer } from "@tanstack/react-virtual";

function LongList({ items }: { items: Item[] }) {
  const parentRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
  });

  return (
    <div ref={parentRef} style={{ height: 600, overflow: "auto" }}>
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: "absolute",
              top: virtualItem.start,
              height: virtualItem.size,
              width: "100%",
            }}
          >
            <ListItem item={items[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

**When to virtualize:**
- Lists or tables with 100+ rows
- Grids with many items
- Any scrollable container where rendering all items causes jank

**When NOT to virtualize:**
- Short lists (under 50-100 items) — the complexity isn't worth it
- Lists where items have highly variable, unknown heights and you can't estimate them
- When the user needs to Cmd+F search the page content (virtualized items aren't in the DOM)

### 6. Concurrent features: useTransition and useDeferredValue

React's concurrent features let you mark some state updates as non-urgent so they don't block the UI.

**`useTransition`** — wrap a state update to tell React it's low-priority:

```tsx
function SearchableList({ items }: Props) {
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSearch = (value: string) => {
    // The input updates immediately
    setQuery(value);
    // The expensive filtering is deferred
    startTransition(() => {
      setFilteredItems(items.filter(item =>
        item.name.toLowerCase().includes(value.toLowerCase())
      ));
    });
  };

  return (
    <>
      <input value={query} onChange={e => handleSearch(e.target.value)} />
      {isPending && <Spinner />}
      <ItemList items={filteredItems} />
    </>
  );
}
```

**`useDeferredValue`** — create a deferred version of a value that lags behind during urgent updates:

```tsx
function SearchResults({ query }: { query: string }) {
  // deferredQuery updates after the UI has responded to the keystroke
  const deferredQuery = useDeferredValue(query);
  const results = useMemo(
    () => expensiveSearch(deferredQuery),
    [deferredQuery]
  );

  return <ResultsList results={results} />;
}
```

**When to use:**
- Search/filter interactions where typing should feel instant but results can lag slightly
- Tab switching where the new tab content is expensive to render
- Any interaction where the UI should remain responsive while expensive rendering happens in the background

### 7. Common performance anti-patterns

**Creating objects/arrays inline in JSX:**
```tsx
// Bad: new object every render, defeats memo on the child
<Chart options={{ color: "blue", animate: true }} />

// Good: stable reference
const chartOptions = useMemo(() => ({ color: "blue", animate: true }), []);
<Chart options={chartOptions} />
```

**Defining components inside components:**
```tsx
// Bad: ItemCard is re-created every render, destroying all internal state
function ItemList({ items }) {
  function ItemCard({ item }) { /* ... */ }
  return items.map(item => <ItemCard key={item.id} item={item} />);
}

// Good: define components at module scope
function ItemCard({ item }: Props) { /* ... */ }
function ItemList({ items }: Props) {
  return items.map(item => <ItemCard key={item.id} item={item} />);
}
```

**Using index as key for dynamic lists:**
```tsx
// Bad: if items reorder, React reuses the wrong DOM nodes
{items.map((item, index) => <ItemCard key={index} item={item} />)}

// Good: stable identity
{items.map(item => <ItemCard key={item.id} item={item} />)}
```

**Fetching in useEffect without cleanup:**
```tsx
// Bad: race condition if id changes rapidly
useEffect(() => {
  fetchItem(id).then(setItem);
}, [id]);

// Better: use TanStack Query or at minimum handle cleanup
useEffect(() => {
  let cancelled = false;
  fetchItem(id).then(data => {
    if (!cancelled) setItem(data);
  });
  return () => { cancelled = true; };
}, [id]);

// Best: use a caching layer (see react-state-management)
const { data: item } = useQuery({ queryKey: ["item", id], queryFn: () => fetchItem(id) });
```

### 8. Bundle size awareness

- **Check your bundle** regularly with tools like `source-map-explorer`, `webpack-bundle-analyzer`, or `vite-bundle-visualizer`
- **Avoid importing entire libraries** when you need one function: `import { format } from "date-fns"` not `import moment from "moment"`
- **Be cautious with barrel files** (`index.ts` that re-exports everything) — some bundlers can't tree-shake through them, pulling in the entire module when you import one thing
- **Dynamic imports for heavy dependencies** — if a feature uses a large library (chart lib, PDF renderer, code editor), lazy-load both the component and the library together
