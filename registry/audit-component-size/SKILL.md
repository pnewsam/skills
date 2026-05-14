---
name: audit-component-size
description: scan a codebase to find React components that have grown too large and are good candidates for decomposition. use when asked to find large components, audit component sizes, identify components to split, or check which files need breaking up. produces a ranked list of components with size, complexity signals, and recommended extractions.
---

# Audit Component Size

## Overview

As a codebase grows, some components quietly balloon past the point where they're easy to read and maintain. This skill scans the codebase, identifies components over the size threshold, and for each one assesses whether decomposition would help and what the natural split points are.

The output is a prioritized list that the `decompose-component` skill can work through.

## Safety rules

- Do not modify any source files. This is a read-only audit.
- Do not install packages or run build commands.

## Workflow

### 1. Find all component files

Identify the project's component file patterns:

```bash
# Find all component-like files, excluding tests, stories, and node_modules
find src/ app/ -type f \( -name "*.tsx" -o -name "*.jsx" \) \
  ! -name "*.test.*" ! -name "*.spec.*" ! -name "*.stories.*" \
  ! -path "*/node_modules/*" 2>/dev/null | sort
```

### 2. Measure file sizes

Get line counts for all component files, sorted largest first:

```bash
find src/ app/ -type f \( -name "*.tsx" -o -name "*.jsx" \) \
  ! -name "*.test.*" ! -name "*.spec.*" ! -name "*.stories.*" \
  ! -path "*/node_modules/*" 2>/dev/null \
  | xargs wc -l 2>/dev/null | sort -rn | head -40
```

The threshold for investigation is **200 lines**. Components under this are fine. Focus analysis on components above this.

### 3. Analyze each large component

For every component over 200 lines, read the file and assess:

**Size category:**
- 200-300 lines: Worth reviewing, may be fine if cohesive
- 300-500 lines: Likely benefits from decomposition
- 500+ lines: Almost certainly should be decomposed

**Complexity signals — count these:**
- Number of `useState` / `useReducer` calls
- Number of `useEffect` calls
- Number of handler functions (`const handleX = ...`, `function onX`)
- Number of distinct JSX sections (look for comments, blank lines, or `<div className="section-...">` patterns that divide the render)
- Number of conditional rendering branches (`{condition && ...}`, ternaries)

**Cohesion assessment:**
- Does the component have one clear purpose, or multiple?
- Are there internal render functions (`renderHeader`, `renderFooter`)? These signal the developer already felt the need to separate concerns.
- Are there blocks of state + handlers that are only used in one section of the JSX? These are extraction candidates.
- Does the component manage UI that could be visually described as having distinct regions (header, body, sidebar, footer, action bar)?

**Verdict:**
- **Decompose** — clear benefit, multiple natural split points, mixed concerns
- **Consider** — borderline, could go either way, may benefit from extracting 1-2 pieces
- **Leave** — large but cohesive, decomposition would just create prop-drilling without real clarity gain

### 4. For each "Decompose" candidate, sketch the split

Without reading every line in detail, identify the likely sub-components:

- Name them using the parent-prefix convention (`ParentHeader`, `ParentActions`, etc.)
- Note the approximate line range they'd cover
- Note whether they'd need shared state (which affects extraction complexity)

This doesn't need to be precise — `decompose-component` will do the detailed analysis. This is a triage to prioritize work.

### 5. Write the report

Create the report at `docs/tmp/component-size-audit.md`:

```bash
mkdir -p docs/tmp
```

If `docs/tmp/component-size-audit.md` already exists, read it first. Offer to extend rather than overwrite, unless the user asks for a full refresh.

Write findings sorted by priority (largest and most complex first):

```markdown
# Component Size Audit

**Scanned:** <count> component files
**Over threshold (200 lines):** <count> files
**Recommended for decomposition:** <count> files

### Decompose (high priority)

#### 1. `src/components/agent-card.tsx` — 487 lines
- **Complexity:** 8 useState, 5 useEffect, 12 handlers, 4 JSX sections
- **Suggested extractions:**
  - `AgentCardHeader` (~80 lines) — title, status badge, type indicator
  - `AgentCardActions` (~60 lines) — start/stop/configure buttons
  - `AgentCardDetails` (~120 lines) — config details, metadata
  - `AgentCardLogs` (~90 lines) — log tail panel
- **Post-decomposition parent estimate:** ~140 lines

#### 2. `src/components/settings-panel.tsx` — 350 lines
...

### Consider (may benefit)

#### 3. `src/components/dashboard-header.tsx` — 240 lines
- **Complexity:** 3 useState, 2 useEffect, 4 handlers
- **Note:** Large but fairly cohesive. Could extract the filter bar (~70 lines) but the rest hangs together.

### Leave (large but cohesive)

#### 4. `src/components/data-table.tsx` — 280 lines
- **Note:** Single-purpose table component. State is tightly coupled across sorting, filtering, and pagination. Decomposition would create heavy prop-drilling.
```

If there are no components over the threshold, say so explicitly — the codebase is in good shape on this dimension.

### 6. Final response

Report:
- Total component files scanned
- Number over threshold
- Number recommended for decomposition
- The top 3 highest-priority candidates and why
- Path to the report file (`docs/tmp/component-size-audit.md`)
- Next step: run `decompose-component` on the highest-priority candidate

## Handling common situations

### Monorepo or multi-package project

Check for multiple `src/` directories or a `packages/` structure. Scan each package separately and report per-package so the findings are actionable by team.

### Project uses Vue or Svelte single-file components

Adapt the search to `.vue` or `.svelte` files. The same size heuristics apply — a 400-line SFC has the same readability problem as a 400-line React component. For Vue SFCs, count the `<template>` section size separately from `<script>` since they have different density characteristics.

### Many files are large because of inline styles or CSS-in-JS

If a component is 400 lines but 150 of those are styled-component definitions or style objects, the actual component logic may be under threshold. Note this distinction — the recommendation might be to extract styles rather than split the component.

### Generated or config-heavy files

Skip files that are clearly auto-generated (e.g., GraphQL codegen, route configs) or are primarily configuration/data (large arrays of options, column definitions). These aren't decomposition candidates even if they're large.
