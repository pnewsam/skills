---
name: decompose-component
description: break a large React component into smaller, well-named sub-components in separate files. use when a component has grown too large (200+ lines), has multiple visual sections or responsibilities crammed into one file, or when asked to split, extract, or decompose a component. preserves all functionality and the parent component's public API.
---

# Decompose Component

## Overview

Components grow. A card component starts as 80 lines, then gets a header with status badges, an action menu, a details section, a footer with metadata. Each piece is reasonable, but the file is now 400 lines and hard to navigate. The fix isn't a redesign — the layout is fine — it's extracting coherent pieces into their own files.

This skill breaks a large component into a parent and named sub-components, each in its own file, following a consistent naming convention.

## Naming convention

Sub-components use the parent name as a prefix:

```
# Parent
agent-card.tsx          → AgentCard

# Extracted children
agent-card-header.tsx   → AgentCardHeader
agent-card-actions.tsx  → AgentCardActions
agent-card-details.tsx  → AgentCardDetails
```

Sub-components live alongside the parent in the same directory. They don't need their own sub-folder unless they have significant internal complexity.

## Safety rules

- Preserve the parent component's public API (props, exports). No changes should be required in files that consume the parent.
- Do not change behavior. This is a structural refactoring — the rendered output must be identical.
- Do not rename the parent component or its file.
- Do not extract components that are only a few lines — extraction should reduce complexity, not add indirection for trivial markup.

## Workflow

### 1. Read the component fully

Read the target component file completely. Also read any types/interfaces file it imports, and scan its imports to understand dependencies.

```bash
grep -rn "import.*from" <component-file>
```

Note:
- Total line count
- The component's props interface
- All hooks used (useState, useEffect, custom hooks, etc.)
- All handler functions
- The JSX structure — identify the major visual sections

### 2. Identify extraction boundaries

Look for natural split points. Prefer splitting along:

**Visual sections** — regions of JSX that correspond to a distinct part of the UI:
- Header area (title, status, badges)
- Body/content area (main information)
- Footer area (metadata, timestamps)
- Action areas (buttons, menus, toolbars)
- Sidebar or secondary panels

**Distinct responsibilities** — self-contained logic + UI pairs:
- A form section with its own validation
- A data table with sorting/filtering
- A modal or dialog triggered from the component
- A loading/empty/error state display

**Do NOT extract:**
- Tiny fragments (under ~30 lines of JSX) that would become trivial wrapper components
- Pieces that need access to most of the parent's state and handlers — this creates prop-drilling that's worse than the original large file
- Utility logic that isn't a visual component — move that to a hook or helper instead

For each candidate extraction, note:
- What section of JSX it covers
- What props it would need from the parent (state, handlers, data)
- How many props — if it needs more than 5-6 props from the parent, the boundary may be wrong

### 3. Plan the extraction

For each sub-component to extract, define:

| Sub-component | Lines (approx) | Props it needs | Purpose |
|---------------|----------------|----------------|---------|
| `ParentHeader` | ~60 | title, status, onEdit | Header with title and status badge |
| `ParentActions` | ~45 | onStart, onStop, isRunning | Action button group |
| ... | ... | ... | ... |

Also note:
- **Hooks that move:** If a hook is used exclusively by one sub-component, it should move with it.
- **Hooks that stay:** If a hook provides state used by multiple sections, it stays in the parent. The parent passes the relevant pieces as props.
- **Types to create:** Each sub-component needs a props interface.

Verify that the parent component will shrink meaningfully (target: under 200-250 lines after extraction) and that each extracted piece is a coherent named concept.

### 4. Check for existing patterns

Before extracting, check how the codebase already handles sub-components:

```bash
# See if there are existing sub-component patterns in the project
ls <component-directory>/
```

Match the existing convention for:
- File naming (kebab-case, PascalCase, etc.)
- Whether sub-components are co-located or in sub-folders
- Export style (named exports, default exports)
- Props interface naming (`ComponentNameProps`, `Props`, etc.)
- Whether the project uses barrel files (index.ts re-exports)

### 5. Extract sub-components

For each sub-component, in order from simplest (fewest dependencies) to most complex:

**a. Create the sub-component file:**
- File name follows the parent's naming convention with the parent name as prefix
- Define a props interface with only what this sub-component needs
- Move the relevant JSX from the parent into the new component
- Move any imports that only this sub-component uses
- Move any hooks or handlers that only this sub-component uses

**b. Update the parent:**
- Import the new sub-component
- Replace the extracted JSX with `<SubComponent prop={value} ... />`
- Remove imports, hooks, and handlers that moved to the sub-component
- Keep shared state and handlers in the parent, pass as props

**c. Verify the extraction:**
- The sub-component file should be self-contained — all its imports resolve
- The parent should be smaller and its JSX structure easier to scan
- No circular dependencies between parent and child

### 6. Handle shared types

If the parent and sub-components share types (e.g., the entity type, status enum):

- If types are already in a separate file, import from there — don't duplicate
- If types are defined inline in the parent, extract them to a shared types file (e.g., `agent-card.types.ts` or the project's existing types location)
- Sub-component props interfaces live in their own files, not in the shared types file

### 7. Update barrel files if applicable

If the directory uses an `index.ts` that re-exports components:

- Add exports for any sub-components that should be available outside the directory
- Usually only the parent needs to be exported — sub-components are implementation details
- If sub-components ARE used elsewhere, export them too

### 8. Verify

After all extractions:

- **Read the parent component** — it should be under ~200-250 lines and its JSX should read as a clear composition of named sections
- **Check each sub-component** — each should be a coherent, focused piece
- **Run existing tests** if they exist for this component
- **Search for other imports of the parent** to confirm nothing broke:
  ```bash
  grep -rn "import.*from.*<parent-component-path>" src/
  ```
- **Check TypeScript compilation** if applicable:
  ```bash
  npx tsc --noEmit
  ```

Report:
- Original line count
- New parent line count
- Sub-components created with their line counts
- Any hooks or handlers that moved
- Confirmation that the parent's public API is unchanged

## Handling common situations

### Component has deeply intertwined state

If most state and handlers are used across most of the JSX, extraction will just create prop-drilling. In this case:

1. First consider extracting state logic into a custom hook (e.g., `useAgentCard`) to reduce the component's non-JSX bulk
2. Then extract visual sub-components that receive the hook's return values as props
3. If it's still too tangled, the component may genuinely be one cohesive unit — note this and extract only the clearly separable pieces

### Component already uses render functions internally

If the component has internal `renderHeader()`, `renderBody()` type functions, these are natural extraction targets — they're already conceptually separated, just not in their own files. Convert each to a proper sub-component.

### Component has context providers or consumers

Keep context consumption in the sub-component that actually uses the context value. Don't pass context values through the parent as props when the child can consume the context directly.

### The component is a form

Forms are tricky because form state (react-hook-form, formik, etc.) often spans the whole component. Extract visual field groups rather than trying to split form logic. The parent keeps the form provider/hook, and sub-components render field sections.

### Some sub-components are reusable beyond this parent

If an extracted piece is genuinely reusable (e.g., a status badge component), give it a generic name (not prefixed with the parent) and place it in the shared components directory. But only do this if it's clearly reusable — don't speculate. Start with the parent-prefixed name; it can be promoted to a shared component later if needed.
