---
name: react-error-handling
description: error handling architecture for React applications — Error Boundaries, route-level error handling, Suspense for loading states, and fallback UI patterns. reference this skill when adding error handling, loading states, or deciding where to place error boundaries and suspense boundaries.
---

# React Error Handling

## Overview

This skill covers how errors, loading states, and failure recovery should be handled in a React application. The core philosophy: **errors are a normal part of the UI, not an afterthought.** Every feature boundary should have an error boundary, every async operation should have a loading state, and users should always have a path to recovery.

## Principles

### 1. Error Boundaries at feature boundaries

An Error Boundary catches JavaScript errors in its child component tree and renders a fallback UI instead of crashing the entire app.

**Where to place error boundaries:**
- Around each major feature section of a page (so one section failing doesn't take down the whole page)
- At route boundaries (so a page crash shows an error page, not a white screen)
- Around third-party components or widgets you don't control
- Around components that render user-generated or external data that might be malformed

```tsx
// A reusable error boundary component
import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  fallback: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  children: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  reset = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      const { fallback } = this.props;
      if (typeof fallback === "function") {
        return fallback(this.state.error, this.reset);
      }
      return fallback;
    }
    return this.props.children;
  }
}
```

**Usage — feature-level boundary:**
```tsx
function DashboardPage() {
  return (
    <PageLayout>
      <ErrorBoundary fallback={<SectionError title="Stats unavailable" />}>
        <DashboardStats />
      </ErrorBoundary>
      <ErrorBoundary fallback={<SectionError title="Recent activity unavailable" />}>
        <RecentActivity />
      </ErrorBoundary>
      <ErrorBoundary fallback={<SectionError title="Agents unavailable" />}>
        <AgentList />
      </ErrorBoundary>
    </PageLayout>
  );
}
```

If `RecentActivity` throws, the user still sees stats and the agent list. Without boundaries, the entire page crashes.

### 2. Route-level error handling

Every route should have an error boundary so that a page failure shows a meaningful error page rather than a white screen.

**With React Router v6.4+:**
```tsx
const routes = [
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <RootErrorPage />,
    children: [
      {
        path: "invoices",
        element: <InvoicesPage />,
        errorElement: <PageErrorFallback />,
      },
      {
        path: "invoices/:id",
        element: <InvoiceDetailPage />,
        errorElement: <PageErrorFallback />,
      },
    ],
  },
];
```

**With a manual boundary wrapper:**
```tsx
function RouteErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={(error, reset) => (
        <PageErrorFallback error={error} onRetry={reset} />
      )}
    >
      {children}
    </ErrorBoundary>
  );
}

// In route config
<Route
  path="/invoices"
  element={
    <RouteErrorBoundary>
      <InvoicesPage />
    </RouteErrorBoundary>
  }
/>
```

**The root error boundary** (at the app level) is your last line of defense. It should render a minimal, self-contained error page that doesn't depend on any app state, providers, or layout components that might themselves be broken.

### 3. Suspense for loading states

`<Suspense>` provides declarative loading states for async operations — data fetching (with Suspense-enabled libraries), lazy-loaded components, and streaming content.

```tsx
import { Suspense, lazy } from "react";

const InvoicesPage = lazy(() => import("./pages/invoices-page"));

function App() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <InvoicesPage />
    </Suspense>
  );
}
```

**Suspense with data fetching** (TanStack Query with `suspense: true`, or React's `use()` in React 19+):

```tsx
function InvoiceDetail({ id }: { id: string }) {
  return (
    <Suspense fallback={<InvoiceDetailSkeleton />}>
      <InvoiceDetailContent id={id} />
    </Suspense>
  );
}

function InvoiceDetailContent({ id }: { id: string }) {
  // This suspends while loading — Suspense above catches it
  const { data: invoice } = useSuspenseQuery({
    queryKey: ["invoice", id],
    queryFn: () => fetchInvoice(id),
  });

  return <InvoiceCard invoice={invoice} />;
}
```

**Where to place Suspense boundaries:**
- Around route-level lazy imports (see `react-performance`)
- Around data-dependent sections of a page, so the page shell renders immediately while data loads
- Around independent sections that load at different speeds, so faster sections appear first
- NOT around every component — too many boundaries create a popcorn effect of content popping in

**Fallback design:**
- Skeleton screens that approximate the layout of the loading content — this prevents layout shift
- The fallback should match the dimensions and structure of the real content
- Avoid generic spinners at the page level; prefer section-specific skeletons
- For very fast loads, consider a slight delay before showing the fallback to avoid flicker

### 4. Pairing Error Boundaries with Suspense

Error Boundaries and Suspense boundaries are complementary — one handles errors, the other handles loading. Place them together at feature boundaries:

```tsx
function FeatureSection({ children, name }: { children: ReactNode; name: string }) {
  return (
    <ErrorBoundary
      fallback={(error, reset) => (
        <SectionError title={`${name} failed to load`} onRetry={reset} />
      )}
    >
      <Suspense fallback={<SectionSkeleton />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

// Usage
function DashboardPage() {
  return (
    <PageLayout>
      <FeatureSection name="Stats">
        <DashboardStats />
      </FeatureSection>
      <FeatureSection name="Activity">
        <RecentActivity />
      </FeatureSection>
    </PageLayout>
  );
}
```

**Order matters:** Error Boundary wraps Suspense. If Suspense is outside, a rendering error in the fallback won't be caught.

### 5. Async error handling with data fetching

For data fetching errors (API failures, network errors, timeouts), the caching layer (TanStack Query, SWR) provides built-in error handling:

```tsx
function InvoiceDetail({ id }: { id: string }) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["invoice", id],
    queryFn: () => fetchInvoice(id),
  });

  if (isLoading) return <InvoiceDetailSkeleton />;

  if (error) {
    return (
      <ErrorCard
        message="Failed to load invoice"
        detail={error.message}
        onRetry={() => refetch()}
      />
    );
  }

  return <InvoiceCard invoice={data} />;
}
```

**Choosing between inline error handling and Error Boundaries for data:**
- **Inline** (`if (error)`) — when the error is expected and recoverable (network failure, 404), and you want to show a contextual error with a retry button in place
- **Error Boundary** — when the error is unexpected (rendering crash, malformed data), or when you want a uniform error experience across many components

TanStack Query's `throwOnError` option lets you choose per-query whether errors should be handled inline or thrown to the nearest Error Boundary:

```tsx
// This throws to the Error Boundary on error
const { data } = useQuery({
  queryKey: ["invoice", id],
  queryFn: () => fetchInvoice(id),
  throwOnError: true,
});
```

### 6. Fallback UI design

Fallback UIs should be helpful, not just "Something went wrong."

**Good error fallback includes:**
- What failed (in user terms, not technical terms)
- A retry action if the error is likely transient
- A way to navigate away (link to home, back button)
- Optionally, details for debugging (collapsible stack trace in development)

```tsx
function SectionError({
  title,
  onRetry,
}: {
  title: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
      <p className="font-medium text-red-800">{title}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-2 text-sm text-red-600 underline">
          Try again
        </button>
      )}
    </div>
  );
}

function PageErrorFallback({
  error,
  onRetry,
}: {
  error: Error;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12">
      <h1 className="text-xl font-semibold">Something went wrong</h1>
      <p className="mt-2 text-gray-600">This page failed to load.</p>
      <div className="mt-4 flex gap-2">
        {onRetry && <button onClick={onRetry}>Try again</button>}
        <a href="/">Go home</a>
      </div>
    </div>
  );
}
```

**Skeleton fallbacks for loading:**
- Match the structure and approximate dimensions of the real content
- Use CSS animations (pulse/shimmer) rather than static gray boxes
- Don't show skeletons for more than a few seconds — if loading is that slow, transition to a message

### 7. Error reporting

In production, errors that reach an Error Boundary should be reported to an error tracking service (Sentry, Datadog, etc.):

```tsx
<ErrorBoundary
  fallback={<PageErrorFallback />}
  onError={(error, errorInfo) => {
    // Report to error tracking
    captureException(error, { extra: { componentStack: errorInfo.componentStack } });
  }}
>
  {children}
</ErrorBoundary>
```

Log enough context to debug: the component stack, the current route, and any relevant entity IDs. Don't log sensitive data (auth tokens, user PII).

### 8. The three states every async UI must handle

Any component that depends on async data has three states. All three must have explicit UI:

1. **Loading** — skeleton, spinner, or deferred content
2. **Error** — contextual error message with retry
3. **Empty** — no data exists yet (distinct from loading and error)

The empty state is the most commonly forgotten. "No invoices yet — create your first one" is more useful than an empty table.

```tsx
function InvoiceList() {
  const { data: invoices, isLoading, error } = useQuery(/* ... */);

  if (isLoading) return <InvoiceListSkeleton />;
  if (error) return <ErrorCard message="Failed to load invoices" onRetry={refetch} />;
  if (invoices.length === 0) return <EmptyState message="No invoices yet" action={<CreateInvoiceButton />} />;

  return <InvoiceTable invoices={invoices} />;
}
```
