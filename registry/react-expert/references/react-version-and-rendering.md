# React version and rendering model

Detect before prescribing. The `react-*` skills default to a client-rendered SPA and to APIs that work across React versions. Before choosing an API, check two things about the project:

- **React major version** — from `package.json`. Prefer a modern primitive only when the installed version supports it and the project has adopted it; keep the pre-19 pattern otherwise. Do not introduce React 19 APIs into a project pinned below 19.
- **Rendering model** — a client-rendered SPA (Vite or CRA-style, client fetching, React Router or TanStack Router) or a framework with server rendering / Server Components (Next.js App Router, React Router v7 framework mode). This changes where data is fetched, how forms submit, and how routing works.

## React 19 features and their pre-19 fallbacks

React 19 (Dec 2024) added primitives that replace common hand-rolled patterns. Use them when the project is on 19+; use the fallback otherwise.

| React 19+ | Replaces / pre-19 fallback |
| --- | --- |
| `useActionState` + `<form action={fn}>` (pending and error built in) | manual `isPending`/error state, or a form library's submit handling |
| `useFormStatus` (read the parent form's pending state) | prop-drilling a `pending` flag |
| `useOptimistic` | manual optimistic local state, or a query library's `onMutate` + rollback |
| `use(promise \| context)` — callable conditionally | `useContext`; library or Suspense data reads |
| `ref` as a normal prop | `forwardRef` |
| `<Context>` as its own provider | `<Context.Provider>` |
| `useEffectEvent` (stable in 19.2) | the ref-holds-latest-value pattern |
| document metadata hoisting (`<title>`/`<meta>`/`<link>`) | `react-helmet` and similar |

`use()` caveat: the promise must come from a cache, a framework, or a parent — a promise created during render re-suspends on every render. `useEffectEvent` caveat: never list it in a dependency array, and use it only for logic that genuinely should not re-trigger the effect.

## React Compiler

If the project has React Compiler enabled (check the build config; stable since v1.0, Oct 2025), prefer it for memoization and treat manual `React.memo`/`useMemo`/`useCallback` as escape hatches for the cases it cannot cover — stable references for third-party or effect dependencies, and genuinely expensive computations. Without the compiler, the manual guidance in `react-performance` is the primary tool. Either way, do not bulk-remove existing memoization: the React team warns it can change compiler output, and it may still be load-bearing for effect-dependency stability.

## Rendering model

Default guidance assumes a client-rendered SPA, which remains fully supported and the most common shape. When the project is a framework or RSC app, adjust:

- **Data:** fetch at the server or route-loader boundary (RSC, Next.js App Router, React Router or TanStack Router loaders) to avoid client waterfalls. A client cache such as TanStack Query still applies to data fetched on the client.
- **Boundaries:** `'use client'` marks a module (and its imports) as client code; `'use server'` marks Server Functions callable from the client — they are different directives.
- **Mutations:** server actions on the server; `useActionState`/`useOptimistic` on the client.

Treat Server Components as a deliberate architecture for a given app, not a default to retrofit onto an existing SPA.
