---
name: react-state-management
description: principles for managing state in React — keep state low, minimize global state, and use a caching layer like TanStack Query for server state. reference this skill when deciding where state should live, adding data fetching, or evaluating whether to use global state.
---

# React State Management

## Overview

This skill defines how state should be managed in a React application. The core philosophy: state should live as close to where it's used as possible, global state should be rare, and server state should be handled by a caching layer — not by hand-rolled global stores.

## Principles

### 1. Keep state low

State should be owned by the lowest common ancestor of the components that need it. Don't hoist state to a higher level "just in case" something else might need it later.

```tsx
// Bad: state hoisted to the page when only the filter bar uses it
function InvoicesPage() {
  const [filterText, setFilterText] = useState("");
  const [sortBy, setSortBy] = useState("date");
  // ... passes these down through multiple levels

  return (
    <div>
      <FilterBar
        filterText={filterText}
        onFilterChange={setFilterText}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
      <InvoiceList filter={filterText} sortBy={sortBy} />
    </div>
  );
}

// Better: if FilterBar and InvoiceList both need these, the page is
// the right level — but if only FilterBar uses filterText internally
// and just emits a final filter object, keep the text state in FilterBar
function InvoicesPage() {
  const [filter, setFilter] = useState<InvoiceFilter>(defaultFilter);

  return (
    <div>
      <FilterBar onFilterChange={setFilter} />
      <InvoiceList filter={filter} />
    </div>
  );
}
```

**When to hoist:**
- Two sibling components need to read or write the same state
- A child needs to communicate back to a parent (lift state up, pass a callback down)

**When not to hoist:**
- "Something else might need it" — hoist when it actually does, not before
- "It feels like global state" — if only one subtree uses it, it's not global

### 2. Server state belongs in a caching layer

Data that comes from an API — entities, lists, search results, user profiles — is **server state**. It should be managed by a purpose-built caching library, not by `useState` + `useEffect` + manual fetching.

**Use TanStack Query (React Query), SWR, or a similar library** as the default for all API data. These libraries handle:

- Caching and deduplication (multiple components can request the same data without duplicate fetches)
- Background refetching and staleness
- Loading, error, and success states
- Optimistic updates
- Cache invalidation after mutations

```tsx
// Bad: manual server state management
function InvoiceDetail({ id }: { id: string }) {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchInvoice(id)
      .then(setInvoice)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  // ... handle loading, error, render
}

// Good: caching layer handles it
function InvoiceDetail({ id }: { id: string }) {
  const { data: invoice, isLoading, error } = useQuery({
    queryKey: ["invoice", id],
    queryFn: () => fetchInvoice(id),
  });

  // ... render
}
```

**Why this matters for performance and reactivity:**

When component A updates an invoice and component B displays it, the caching layer ensures B gets the updated data automatically via cache invalidation — without A and B needing to know about each other. This gives you app-wide reactivity without global state.

```tsx
// After a mutation, invalidate the cache — all consumers re-render with fresh data
const mutation = useMutation({
  mutationFn: updateInvoice,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["invoice", id] });
    queryClient.invalidateQueries({ queryKey: ["invoices"] });
  },
});
```

### 3. Context performance — know the tradeoff

React Context is the right tool for low-frequency global state (auth, theme, locale). But it has an important characteristic: **when a context value changes, every component that consumes that context re-renders**, regardless of whether it uses the specific part of the value that changed.

```tsx
// Problem: updating unreadCount re-renders every component that reads AppContext,
// even if they only care about theme
const AppContext = createContext({ theme: "light", unreadCount: 0 });
```

**Mitigations:**
- **Split contexts by update frequency.** Auth context changes rarely; notification count changes often. Keep them separate.
- **Memoize the context value** to prevent re-renders when the parent re-renders but the value hasn't changed:

```tsx
const value = useMemo(() => ({ theme, setTheme }), [theme]);
return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
```

- **Use a selector-based library** (Zustand, Jotai) when you have global state that updates frequently and is consumed by many components. These libraries let consumers subscribe to specific slices of state, so a component only re-renders when its slice changes.

**When to reach for Zustand/Jotai over Context:**
- The state updates frequently (multiple times per second — typing, animations, real-time data)
- Many components across the tree consume the state
- Different consumers need different slices of the state
- You need derived/computed state without manual memoization

### 4. Minimize global state

True global state — state that is genuinely needed everywhere in the app — is rare. Most of what people put in global stores is actually:

- **Server state** → belongs in TanStack Query / SWR
- **URL state** → belongs in the router (see `react-routing`)
- **Form state** → belongs in the form library (see `react-form-patterns`)
- **Local UI state** → belongs in the component that owns it

**Legitimate global state:**
- Authentication / current user session
- Theme / color mode preference
- Locale / language setting
- Feature flags
- A small number of app-wide UI states (e.g., sidebar collapsed)

For these, React Context is usually sufficient — see the performance caveats in Principle 3. Reach for a state management library only when the global state is complex enough to benefit from one (frequent updates consumed by many components, derived state, middleware).

### 5. URL is state too

Filter selections, pagination, sort order, selected tabs, open/closed panels — if the user would expect these to survive a page refresh or be shareable via URL, they should be URL state (search params or route params), not component state.

See the `react-routing` skill for URL design principles. The key point for state management: **don't duplicate URL state in component state.** Read from the URL, write to the URL. The router is your state manager for navigational state.

```tsx
// Bad: duplicating URL state
function InvoicesPage() {
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  // now page and the URL can drift apart

// Good: URL is the source of truth
function InvoicesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const setPage = (p: number) => setSearchParams({ page: String(p) });
```

### 6. Avoid state synchronization

If you find yourself writing `useEffect` to keep two pieces of state in sync, that's a signal one of them shouldn't exist. Derive it instead.

```tsx
// Bad: synchronized state
const [items, setItems] = useState<Item[]>([]);
const [filteredItems, setFilteredItems] = useState<Item[]>([]);

useEffect(() => {
  setFilteredItems(items.filter(i => i.status === "active"));
}, [items]);

// Good: derived value
const [items, setItems] = useState<Item[]>([]);
const filteredItems = useMemo(
  () => items.filter(i => i.status === "active"),
  [items]
);
```

If two pieces of state must always change together, they should probably be one piece of state (an object) or managed by a reducer.

### 7. useReducer for complex local state

When a component's state involves multiple related values or transitions that depend on the previous state, `useReducer` is clearer than multiple `useState` calls:

```tsx
// When multiple state values change together and depend on each other
type State = { status: "idle" | "loading" | "error" | "success"; data: Item[] | null; error: Error | null };
type Action = { type: "fetch" } | { type: "success"; data: Item[] } | { type: "error"; error: Error };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "fetch": return { status: "loading", data: null, error: null };
    case "success": return { status: "success", data: action.data, error: null };
    case "error": return { status: "error", data: null, error: action.error };
  }
}
```

**Prefer `useReducer` when:**
- State transitions depend on the previous state
- Multiple state values must change atomically (they'd go out of sync with separate `useState`)
- The next state depends on which action occurred, not just a new value

**Stick with `useState` when:**
- The state is a single, independent value
- Updates are simple replacements (not dependent on previous state)

### 8. Decision guide: where does this state belong?

| Question | Answer |
|---|---|
| Does it come from the server? | TanStack Query / SWR |
| Should it survive a page refresh? | URL params (router) |
| Is it form input state? | Form library (RHF, TanStack Form) |
| Is it needed app-wide? (auth, theme, locale) | Context provider near app root |
| Is it needed by this component and its children only? | `useState` / `useReducer` in that component |
| Is it derived from other state? | `useMemo` or a plain variable — not separate state |
