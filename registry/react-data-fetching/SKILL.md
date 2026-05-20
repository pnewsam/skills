---
name: react-data-fetching
description: server-state and data-fetching patterns for React SPA apps. covers TanStack Query or SWR usage, query key design, colocated API clients, loading/error/empty states, mutations, invalidation, optimistic updates, pagination, prefetching, cancellation, and avoiding manual useEffect fetching. reference this skill when adding API calls, queries, mutations, cache invalidation, or data-loading behavior.
---

# React Data Fetching

## Overview

This skill defines how React SPAs should load and mutate API data. The core philosophy: server data is not local UI state. Use a server-state cache for fetching, staleness, retries, deduplication, mutations, and invalidation.

## Principles

### 1. Use a server-state library by default

For API data, prefer the project's existing server-state library: TanStack Query, SWR, Apollo/Relay for GraphQL, or a framework/router data layer if the app already uses one. Do not introduce a new library if the project already has a clear pattern.

Avoid `useEffect` + `useState` fetching for production feature data:

```tsx
// Good: cache owns loading, errors, dedupe, stale data, and refetching
function InvoiceDetail({ id }: { id: string }) {
  const { data: invoice, isLoading, error } = useQuery({
    queryKey: ["invoice", id],
    queryFn: () => fetchInvoice(id),
  });

  if (isLoading) return <InvoiceDetailSkeleton />;
  if (error) return <ErrorCard message="Failed to load invoice" />;
  if (!invoice) return <NotFound />;

  return <InvoiceCard invoice={invoice} />;
}
```

Manual effect fetching is acceptable for tiny apps, prototypes, and non-server integrations, but it must handle cancellation, race conditions, and all UI states.

### 2. Keep API functions separate from components

Components and hooks should call domain API functions, not build request details inline.

```
src/features/invoices/
  api/
    invoice-api.ts
  hooks/
    use-invoice.ts
```

```ts
export async function fetchInvoice(id: string): Promise<Invoice> {
  const response = await apiClient.get(`/invoices/${id}`);
  return invoiceSchema.parse(response.data);
}
```

Keep authentication headers, base URLs, response parsing, and error normalization in the API/client layer so UI code works with typed domain data.

### 3. Design query keys deliberately

Query keys are the cache address. Make them stable, hierarchical, and specific enough for invalidation.

```tsx
const invoiceKeys = {
  all: ["invoices"] as const,
  lists: () => [...invoiceKeys.all, "list"] as const,
  list: (filter: InvoiceFilter) => [...invoiceKeys.lists(), filter] as const,
  detail: (id: string) => [...invoiceKeys.all, "detail", id] as const,
};
```

Guidelines:

- Include every variable the query function depends on
- Use serializable filter objects with stable shapes
- Use key factories when a feature has several related queries
- Invalidate the narrowest key that keeps the UI correct

### 4. Render loading, error, and empty states

Every data-dependent UI needs explicit states:

- Loading: skeleton that matches the final layout
- Error: contextual message and retry when useful
- Empty: clear next action or explanation
- Success: actual content

Do not collapse empty into loading or error. A successful empty list is a real product state.

### 5. Mutations update the cache intentionally

After a mutation, decide how the UI gets correct data:

- Invalidate affected queries when a refetch is cheap and correctness matters most
- Update the cache directly when the server response contains the canonical updated object
- Use optimistic updates when latency would make the UI feel broken and rollback is straightforward

```tsx
const updateInvoiceMutation = useMutation({
  mutationFn: updateInvoice,
  onSuccess: invoice => {
    queryClient.setQueryData(invoiceKeys.detail(invoice.id), invoice);
    queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
  },
});
```

Avoid broad invalidation like `invalidateQueries()` with no key unless the mutation truly affects the whole app.

### 6. Optimistic updates need rollback

Use optimistic updates for reversible, local-feeling actions such as toggles, reorder operations, or quick edits. Always snapshot previous cache data and rollback on error.

```tsx
const mutation = useMutation({
  mutationFn: updateInvoiceStatus,
  onMutate: async ({ id, status }) => {
    await queryClient.cancelQueries({ queryKey: invoiceKeys.detail(id) });
    const previous = queryClient.getQueryData<Invoice>(invoiceKeys.detail(id));
    queryClient.setQueryData(invoiceKeys.detail(id), old =>
      old ? { ...old, status } : old
    );
    return { previous };
  },
  onError: (_error, { id }, context) => {
    queryClient.setQueryData(invoiceKeys.detail(id), context?.previous);
  },
  onSettled: (_data, _error, { id }) => {
    queryClient.invalidateQueries({ queryKey: invoiceKeys.detail(id) });
  },
});
```

Do not use optimistic updates when conflicts are likely, rollback is unclear, or the mutation triggers complex server-side side effects.

### 7. Pagination, search, and filters

Put shareable list state in the URL, then include it in the query key.

```tsx
const filter = parseInvoiceSearchParams(searchParams);
const query = useQuery({
  queryKey: invoiceKeys.list(filter),
  queryFn: () => fetchInvoices(filter),
  placeholderData: keepPreviousData,
});
```

For infinite scrolling, use the library's infinite query API rather than manually appending pages into component state.

### 8. Prefetch at natural intent points

Prefetch data when the user has shown intent:

- Route hover/focus for detail pages
- Opening a tab that will need data soon
- Completing a parent step before a child step

Keep prefetching scoped. Do not prefetch entire apps or large lists speculatively.

### 9. Suspense is optional, not automatic

Use Suspense for data only when the project has already adopted Suspense-enabled queries or router loaders. Otherwise, use explicit `isLoading` and `error` rendering. Suspense boundaries should be paired with error boundaries and fallbacks that match the loaded layout.

### 10. Data-fetching decision guide

| Situation | Prefer |
|---|---|
| Load API entity/list | Query hook with stable query key |
| Create/update/delete | Mutation hook with invalidation or cache update |
| Form submit | Mutation from submit handler |
| Filter/sort/page list | URL search params + query key |
| Realtime stream | Subscription effect that updates query cache |
| Local-only UI value | `useState`/`useReducer`, not query cache |
| Derived view of fetched data | `select`, `useMemo`, or pure helper |
