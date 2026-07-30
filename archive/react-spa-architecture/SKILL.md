---
name: react-spa-architecture
description: architecture guidance for React single-page applications. covers app entrypoints, provider composition, routing setup, src/app vs src/features boundaries, environment configuration, API client setup, authentication bootstrap, lazy loading, deployment fallback routing, and production readiness. reference this skill when creating or reorganizing a React SPA, adding app-level providers, configuring routing, or setting up cross-cutting infrastructure.
---

# React SPA Architecture

## Overview

This skill defines the app-level structure for React SPAs. The core philosophy: keep the application shell boring and explicit, isolate cross-cutting setup in `src/app/`, and keep domain behavior in feature modules.

## Principles

### 1. Separate app infrastructure from feature code

Use `src/app/` for app-wide wiring:

```
src/
  app/
    app.tsx
    providers.tsx
    router.tsx
    query-client.ts
    error-boundary.tsx
  features/
    invoices/
    settings/
  components/
    ui/
  lib/
    api-client.ts
    env.ts
```

`src/app/` should define how the app is assembled. It should not contain invoice logic, settings forms, dashboard cards, or other domain behavior.

### 2. Keep the entrypoint minimal

The browser entrypoint should do only bootstrapping:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/app";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

Avoid putting providers, route definitions, auth logic, or feature imports directly in `main.tsx`. Move those into app-level modules.

### 3. Compose providers deliberately

Create one app providers component that makes provider order obvious:

```tsx
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary fallback={<RootErrorPage />}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
```

Provider order matters when one provider reads another. Keep providers stable, memoize context values when needed, and avoid adding app-wide providers for state that belongs to one route or feature subtree.

### 4. Router setup is app infrastructure

Define route structure in `src/app/router.tsx`, `src/routes/`, or the established router location. Route files should compose pages and layouts; feature modules should hold domain UI and logic.

Include:

- App shell route/layout
- Protected route or auth loader pattern when needed
- 404 route
- Route-level error handling
- Lazy-loaded route modules for large pages

See `react-routing` for URL design and `react-error-handling` for route errors.

### 5. App shell owns persistent layout

The app shell handles persistent UI such as sidebar, top nav, command menu host, toast viewport, and route outlet. It should not fetch feature-specific data unless the data is truly app-wide, such as current user or organization switcher data.

Keep shell state small:

- Sidebar collapsed
- Active global command menu
- Theme preference

Feature selection, filters, and entity state belong in URL params, feature components, or server-state cache.

### 6. Environment config is typed and centralized

Read environment variables in one module, validate them at startup, and export typed config.

```ts
export const env = {
  apiBaseUrl: requiredEnv("VITE_API_BASE_URL"),
  appMode: import.meta.env.MODE,
};
```

Do not scatter `import.meta.env` or `process.env` reads throughout feature code. Never expose secrets in SPA env variables; anything shipped to the browser is public.

### 7. API client setup is shared infrastructure

Create one API client layer for base URL, auth headers, response parsing, and normalized errors. Feature API modules should call this client rather than reimplementing fetch details.

```ts
export async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) throw await ApiError.fromResponse(response);
  return response.json() as Promise<T>;
}
```

Match the project's auth model. Cookie-based auth, bearer tokens, and same-origin APIs have different security and refresh behavior.

### 8. Authentication bootstrap should be explicit

At app startup, determine whether the app needs:

- A blocking session load before protected routes render
- Route-level auth guards/loaders
- Token refresh or session revalidation
- Role/permission checks

Avoid letting every feature independently ask "am I logged in?" with duplicate fetches. Current user/session is app-wide server state or auth context, not a random global store.

### 9. Lazy load at route and heavy-feature boundaries

Use code splitting for route modules and heavy optional features such as charts, rich text editors, PDF viewers, maps, and code editors. Pair lazy loading with Suspense fallbacks that preserve layout.

Do not lazy-load tiny components or always-visible shell pieces; the extra network boundary can make the app feel worse.

### 10. SPA deployment needs fallback routing

Because the browser owns routes in an SPA, production hosting must serve `index.html` for app routes. Configure rewrites/fallbacks for Netlify, Vercel, S3/CloudFront, nginx, or the chosen host.

Also make production readiness explicit:

- Build-time env validation
- Error tracking
- Source maps policy
- Cache headers for hashed assets
- 404 behavior inside the app
- Basic smoke test for direct navigation to nested routes

### 11. Architecture decision guide

| Concern | Location |
|---|---|
| Browser root rendering | `src/main.tsx` |
| Providers, app shell, router | `src/app/` |
| Base UI primitives | `src/components/ui/` |
| Domain UI and logic | `src/features/<feature>/` |
| API client and env parsing | `src/lib/` or `src/app/` |
| Route modules/pages | `src/routes/` or `src/pages/` |
| Cross-cutting hooks | `src/hooks/` |
| Feature-specific hooks | `src/features/<feature>/hooks/` |
