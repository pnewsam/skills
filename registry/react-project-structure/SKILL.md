---
name: react-project-structure
description: conventions for organizing a React project — base UI components as a design system layer, domain components in feature modules under src/features/, and consistent naming. reference this skill when creating new files, adding features, or reorganizing project structure.
---

# React Project Structure

## Overview

This skill defines how files and components should be organized in a React project. The core idea: separate your general-purpose UI building blocks from your domain-specific feature code, and group domain code by feature, not by type.

## Principles

### 1. Two layers of components

**Base UI components** — your design system foundation. These are generic, reusable, domain-free components:

- Buttons, inputs, selects, modals, tooltips, cards, badges, tabs
- Layout primitives (Stack, Grid, Container, Sidebar)
- Typography components if you use them

These live in a shared location such as `src/components/ui/` or `src/components/base/`. They know nothing about your business domain. They are styled, accessible, and composed by everything else.

**Domain components** — components that are specific to a feature or business concept. These use the base UI components but encode domain-specific behavior, data shapes, and layouts:

- `InvoiceLineItem`, `AgentCard`, `PipelineStatus`
- Feature-specific forms, lists, detail views
- Compositions of base components with domain logic

These live in feature modules, not in a shared components folder.

### 2. Organize by feature, not by type

Group domain code by the feature it belongs to, under `src/features/`:

```
src/
  features/
    invoices/
      components/
        invoice-list.tsx
        invoice-detail.tsx
        invoice-line-item.tsx
        invoice-form.tsx
      hooks/
        use-invoice.ts
        use-invoice-list.ts
      api/
        invoice-api.ts
      types/
        invoice.ts
      index.ts              # public API for this feature
    agents/
      components/
        agent-card.tsx
        agent-detail.tsx
      hooks/
        use-agent.ts
      ...
  components/
    ui/
      button.tsx
      input.tsx
      modal.tsx
      card.tsx
      ...
  pages/                    # or routes/ — page-level components
    invoices-page.tsx
    invoice-detail-page.tsx
    agents-page.tsx
```

**Why feature folders over type folders:**

- When working on invoices, everything you need is in one place — you don't jump between `src/components/`, `src/hooks/`, `src/api/`, `src/types/`.
- Features have clear boundaries. You can see what a feature depends on and what depends on it.
- Features can be deleted, extracted, or lazy-loaded as units.
- New developers can understand one feature without understanding the whole codebase.

**Avoid the "type folder" anti-pattern:**

```
# Bad: organized by type
src/
  components/
    invoice-list.tsx
    invoice-detail.tsx
    agent-card.tsx
    agent-detail.tsx
    # ... 80 files all in one folder
  hooks/
    use-invoice.ts
    use-agent.ts
  api/
    invoice-api.ts
    agent-api.ts
```

This fragments related code across the tree and creates folders with dozens of unrelated files.

### 3. Feature boundaries and cross-feature dependencies

A feature module should primarily depend on:
- Its own internal code
- Base UI components
- Shared utilities and types
- Shared hooks (auth, routing, etc.)

A feature should **not** directly import from another feature's internals. If features need to share code:

- Extract the shared code into a shared module (`src/shared/`, `src/lib/`, or `src/utils/`)
- Or promote the shared component to the base UI layer if it's genuinely generic
- Use the feature's public API (`index.ts`) if one feature needs something from another

### 4. Naming conventions

**Files:** Use kebab-case for file names. Match the component name to the file name:
- `invoice-line-item.tsx` → `InvoiceLineItem`
- `use-invoice.ts` → `useInvoice`

**Sub-components:** When a component is decomposed, sub-components use the parent name as a prefix and live alongside the parent:
- `agent-card.tsx` → `AgentCard`
- `agent-card-header.tsx` → `AgentCardHeader`
- `agent-card-actions.tsx` → `AgentCardActions`

**Feature folders:** Use the plural noun for the feature: `invoices/`, `agents/`, `pipelines/`.

**Pages:** Suffix with `-page`: `invoices-page.tsx`, `agent-detail-page.tsx`. Pages are thin — they compose feature components and handle routing concerns but contain minimal logic themselves.

### 5. Where things live — decision guide

| What you're creating | Where it goes |
|---|---|
| Generic button, input, modal, card | `src/components/ui/` |
| Layout primitive (Stack, Grid, Sidebar) | `src/components/ui/` or `src/components/layout/` |
| Domain-specific component (InvoiceCard) | `src/features/<feature>/components/` |
| Hook for a specific feature's data | `src/features/<feature>/hooks/` |
| Hook for a cross-cutting concern (auth, theme) | `src/hooks/` |
| API client for a feature | `src/features/<feature>/api/` |
| Types for a feature's entities | `src/features/<feature>/types/` |
| Shared utility functions | `src/lib/` or `src/utils/` |
| Page-level route component | `src/pages/` or `src/routes/` |
| App-wide providers and configuration | `src/app/` or `src/providers/` |

### 6. Co-located tests and styles

Tests, stories, and style files live next to the component they test, not in a separate `__tests__/` tree:

```
src/features/invoices/components/
  invoice-list.tsx
  invoice-list.test.tsx
  invoice-list.stories.tsx
  invoice-detail.tsx
  invoice-detail.test.tsx
```

Co-location keeps related files together and makes it obvious when a component is missing tests. If the project uses CSS modules, `.module.css` files also live alongside their component.

### 7. Barrel files — use with caution

A barrel file (`index.ts`) that re-exports a feature's public API can be useful for defining a clean import boundary:

```ts
// src/features/invoices/index.ts
export { InvoiceList } from "./components/invoice-list";
export { InvoiceDetail } from "./components/invoice-detail";
export type { Invoice } from "./types/invoice";
```

**However, barrel files have known costs:**
- Some bundlers cannot tree-shake through them, pulling in an entire feature when you import one component
- They create circular dependency risks when features reference each other
- They can slow down IDE tooling (auto-imports, go-to-definition)

If using barrel files, keep them at the feature boundary only (one per feature). Don't create barrel files inside sub-directories (`components/index.ts`). If the project doesn't already use them, don't introduce them.

### 8. Code splitting at the feature level

Features and pages should be lazy-loaded at route boundaries so the initial bundle only includes what's needed for the landing page. See `react-performance` for the `React.lazy` + `Suspense` pattern.

Structure features so they have a clean entry point that can be dynamically imported:

```tsx
// In route config
const InvoicesPage = lazy(() => import("./pages/invoices-page"));
```

This works best when page components are thin (see `react-routing`) and feature code is self-contained in its feature folder.

### 9. Adapting to existing projects

These conventions describe the target structure. When working in an existing project:

- **Don't reorganize the whole project at once.** Follow existing conventions for files you're modifying.
- **Use the target structure for new features.** If adding a new feature, create it under `src/features/` even if older features aren't organized that way.
- **Migrate incrementally.** When significantly modifying an existing feature, it's a natural time to move it into the feature folder structure.
- **Match the project's existing naming conventions** for file names, export styles, and barrel files. Consistency within a project matters more than matching these guidelines exactly.
