---
name: react-routing
description: principles for URL design and routing in React — RESTful URL conventions, new views correspond to new URLs, and the URL is a source of truth for navigational state. reference this skill when adding pages, designing navigation, or deciding how to represent view state.
---

# React Routing

## Overview

This skill defines how routes and URLs should be designed in a React application. The core philosophy: URLs are a first-class part of your application's design. Every distinct view should have its own URL, URL structure should follow RESTful conventions, and navigational state should live in the URL — not in component state.

## Principles

### 1. New views get new URLs

If the user is looking at something substantially different — a different entity, a different list, a different mode of interaction — it should be a different URL. This is the most important rule.

**Should have its own URL:**
- A list of invoices → `/invoices`
- A specific invoice's detail → `/invoices/:id`
- Creating a new invoice → `/invoices/new`
- Editing an invoice → `/invoices/:id/edit`
- A user's settings → `/settings`
- A specific settings tab → `/settings/notifications`

**Should NOT have its own URL:**
- A tooltip or popover
- A confirmation dialog
- A dropdown menu
- An inline edit mode (unless it's a full editing view)

**Gray area — use judgment:**
- Modals that show significant content (sometimes yes — `/invoices/:id` could render as a modal over the list)
- Tab panels within a page (yes if the tabs represent different views; no if they're just organizing content within one view)
- Filter states (often yes — via search params — so users can share/bookmark filtered views)

### 2. RESTful URL conventions

Design URLs the same way you'd design a REST API. Users, developers, and tools all benefit from predictable URL structure.

```
# Collection (list)
/invoices
/agents
/users

# Individual resource
/invoices/:id
/agents/:id

# Nested resource
/invoices/:id/line-items
/agents/:id/runs

# Actions on a resource
/invoices/:id/edit
/invoices/new

# Sub-views of a resource
/agents/:id/settings
/agents/:id/logs
```

**URL naming conventions:**
- Use kebab-case: `/line-items`, not `/lineItems` or `/line_items`
- Use plural nouns for collections: `/invoices`, not `/invoice`
- Use nouns, not verbs: `/invoices/new`, not `/create-invoice`
- Keep nesting shallow — rarely go beyond 3 segments. If you're at `/orgs/:orgId/projects/:projectId/pipelines/:pipelineId/runs/:runId`, consider flattening

### 3. URL as state

Navigational state — anything the user would expect to survive a refresh or be shareable — belongs in the URL.

**Use route params for identity:**
```
/invoices/:id        → which invoice
/agents/:id/runs     → which agent's runs
```

**Use search params for view configuration:**
```
/invoices?status=overdue&sort=amount&page=2
/agents?search=prod&type=scheduled
```

**Rules for search params:**
- Default values should not appear in the URL. `/invoices` and `/invoices?page=1&sort=date` should mean the same thing if page 1 and date sorting are defaults.
- Read from the URL, write to the URL. Don't copy URL state into `useState` — the URL is your source of truth.
- Use `useSearchParams` (React Router) or the equivalent in your router. Parse and validate the params near where you use them.
- Keep param names short but clear: `q` for search query, `page`, `sort`, `status`, `tab`.

### 4. Use a routing library

Always use a proper routing library. For SPA React apps, default to the project's existing router, usually React Router or TanStack Router. Don't build routing from scratch with `window.location` and conditionals.

The routing library provides:
- Declarative route definitions
- URL parameter parsing
- Navigation guards and loaders
- Code splitting per route
- Nested layouts

**Route definitions should be discoverable** in one place (a route config file or a routes directory), not scattered invisibly across leaf components. This makes the app's URL structure visible at a glance.

```tsx
// Good: centralized route definitions
const routes = [
  { path: "/", element: <DashboardPage /> },
  { path: "/invoices", element: <InvoicesPage /> },
  { path: "/invoices/new", element: <CreateInvoicePage /> },
  { path: "/invoices/:id", element: <InvoiceDetailPage /> },
  { path: "/invoices/:id/edit", element: <EditInvoicePage /> },
  { path: "/settings", element: <SettingsPage /> },
];
```

### 5. Nested layouts with Outlet

Most apps have shared layout that persists across related routes — a sidebar, a header, a settings navigation. Use nested routes and `<Outlet>` (React Router) or equivalent to avoid remounting shared layout on navigation:

```tsx
const routes = [
  {
    path: "/",
    element: <AppLayout />,         // renders header + sidebar + <Outlet />
    children: [
      { path: "invoices", element: <InvoicesPage /> },
      { path: "invoices/:id", element: <InvoiceDetailPage /> },
      {
        path: "settings",
        element: <SettingsLayout />,  // renders settings nav + <Outlet />
        children: [
          { path: "profile", element: <ProfileSettings /> },
          { path: "notifications", element: <NotificationSettings /> },
          { path: "billing", element: <BillingSettings /> },
        ],
      },
    ],
  },
];
```

`AppLayout` renders the app shell and an `<Outlet />` where child routes render. `SettingsLayout` renders its own sub-navigation and another `<Outlet />` for settings sub-pages. When the user navigates between settings tabs, only the inner content swaps — the settings nav and app shell stay mounted.

### 6. Route-level data loading and error handling

Modern routers support data loading at the route level, co-located with the route definition rather than inside the component:

```tsx
// React Router v6.4+ loaders
{
  path: "invoices/:id",
  loader: ({ params }) => fetchInvoice(params.id),
  element: <InvoiceDetailPage />,
  errorElement: <PageErrorFallback />,
}
```

Whether you use route loaders or fetch data inside the component (via TanStack Query), every route should have error handling. See `react-error-handling` for Error Boundary and Suspense patterns at route boundaries.

**Always include a catch-all 404 route:**

```tsx
{ path: "*", element: <NotFoundPage /> }
```

### 7. Pages are thin

Page components (the components that route definitions point to) should be thin orchestrators. They:

- Read route params and search params
- Set up data fetching (via TanStack Query or loaders)
- Compose feature components
- Handle page-level layout

They should **not** contain significant business logic, complex state management, or large amounts of JSX. That belongs in feature components.

```tsx
// Good: thin page
function InvoiceDetailPage() {
  const { id } = useParams();
  const { data: invoice, isLoading } = useQuery({
    queryKey: ["invoice", id],
    queryFn: () => fetchInvoice(id!),
  });

  if (isLoading) return <PageSkeleton />;
  if (!invoice) return <NotFound />;

  return (
    <PageLayout title={`Invoice ${invoice.number}`}>
      <InvoiceDetail invoice={invoice} />
    </PageLayout>
  );
}
```

### 8. Navigation patterns

**Use links, not programmatic navigation, for user-initiated navigation.** The `<Link>` component (or `<NavLink>`) gives you proper anchor elements — right-click to open in new tab, middle-click, accessibility, etc.

```tsx
// Good: link for navigation
<Link to={`/invoices/${invoice.id}`}>View Invoice</Link>

// Programmatic navigation is for post-action redirects
const navigate = useNavigate();
const handleCreate = async (data) => {
  const invoice = await createInvoice(data);
  navigate(`/invoices/${invoice.id}`);
};
```

**Breadcrumbs and back navigation** should reflect the URL hierarchy. If the URL is `/invoices/:id/edit`, the breadcrumbs should be Invoices → Invoice #123 → Edit, and each crumb should be a link.

### 9. Protected routes and redirects

Authentication checks should happen at the route level, not inside individual components. Use route guards, layout wrappers, or loader functions:

```tsx
// Good: route-level protection
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

// In route config
{ path: "/invoices", element: <ProtectedRoute><InvoicesPage /></ProtectedRoute> }
```

Redirect after login should return the user to where they were trying to go. Store the intended destination in a `redirect` search param: `/login?redirect=/invoices/123`.
