---
name: redesign-component
description: redesign a UI component that has outgrown its original layout. use when a component (card, panel, list item, detail view) has accumulated content and actions over time and no longer presents them well — things feel cramped, unintuitive, or poorly organized. audits everything the component currently displays and does, then proposes and implements a better layout.
---

# Redesign Component

## Overview

A component starts simple — a card with a name and a status. Then it gets an action menu. Then tags. Then a progress indicator, timestamps, a secondary status, config details, error states. Each addition was reasonable, but the result is a component that feels cluttered, cramped, or confusing. The layout that worked for 3 fields doesn't work for 12.

This skill takes a component that has outgrown its design, fully understands what it needs to present, and reimagines the layout to accommodate everything cleanly.

## Workflow

### 1. Identify the target component

The user will point to a component (or the skill should ask which one). Find the component file and all files it imports or that compose it.

```bash
# Find the component and its children
grep -rn "import.*from" <component-file> | head -30
```

Read the component file completely. If it renders child components, read those too. Build the full picture of what this component renders.

### 2. Catalog everything the component presents

Read the component and its children carefully. Extract a complete inventory:

**Data fields displayed:**
List every piece of data the component shows to the user. For each field:
- What is it? (name, status, timestamp, count, etc.)
- Where does it come from? (prop name, API field)
- Is it always present, or conditional?
- How prominent is it currently? (headline, secondary text, badge, tooltip, hidden behind a click)

**Actions available:**
List every action the user can take from this component:
- Buttons, links, menu items
- What does each action do?
- Is it always available, or conditional on state?
- How prominent is it currently?

**Visual states:**
List every distinct visual state the component can be in:
- Loading, empty, error states
- Status-driven variants (running, stopped, failed, etc.)
- Selected, hovered, expanded states
- Responsive breakpoints if any

**Context:**
- Where does this component appear? (in a list/grid, on a detail page, in a sidebar)
- How many instances are typically visible at once?
- What does the user do after interacting with this component? (navigate to detail, trigger an action, compare with others)

### 3. Identify the problems

With the full inventory, diagnose what's wrong. Common issues:

**Content hierarchy problems:**
- Primary information (what the user scans for first) is not visually dominant
- Secondary details compete for attention with the main content
- No clear visual scanning order — the eye doesn't know where to go

**Spatial problems:**
- Too many things fighting for horizontal space on one line
- Awkward wrapping at certain widths
- Actions and content intermixed rather than separated
- Inconsistent spacing/alignment between elements

**Information density problems:**
- Everything shown at once when some details could be progressive (expand, hover, click-through)
- Or the opposite: important info hidden behind interactions when it should be glanceable

**State representation problems:**
- Status conveyed only by text when color/icon would be faster to scan
- Too many badge/tag/pill elements creating visual noise
- Error or warning states not visually distinct enough

### 4. Determine the design priorities

Before proposing a layout, establish what matters most for this specific component based on its context:

- **Scanning context**: If many instances are shown in a list/grid, optimize for quick visual scanning — the user needs to compare and find the one they want. Prioritize the 2-3 fields that differentiate instances.
- **Action context**: If the primary use is to take an action (start, stop, configure), make the action prominent and the status that informs that action immediately visible.
- **Monitoring context**: If the user checks this component to understand current state (is it running? any errors?), optimize for status-at-a-glance.
- **Detail context**: If this is a single-instance detail view, more information density is fine — the user came here specifically to see everything.

### 5. Propose the new layout

Describe the proposed layout in concrete terms:

**Layout structure:**
Describe the spatial organization — what goes where, how sections are divided. Use a simple ASCII sketch or describe zones (top-left, top-right, body, footer, etc.).

**Content placement:**
For each item from the inventory (Step 2), specify:
- Where it goes in the new layout
- Its visual treatment (size, weight, color role)
- Whether it's always visible or progressive (shown on hover, expand, or click-through)

**Rationale:**
For each significant change from the current layout, explain why — tie it back to a specific problem from Step 3.

Present the proposal to the user before implementing. If the user has feedback, revise.

### 6. Implement the new layout

Now modify the component. Key principles:

- **Work with the existing component library and styling approach.** If the codebase uses Tailwind, use Tailwind. If it uses styled-components, use those. Do not introduce new styling paradigms.
- **Preserve all existing functionality.** Every data field, action, and state from the inventory must still be present and working. Refactoring the layout must not break behavior.
- **Preserve all existing props and the component's public API.** Parent components should not need changes unless the user explicitly wants that.
- **Keep the component's footprint reasonable.** If the redesign requires extracting sub-components, do so — but only if the component was already too large. Don't extract prematurely.

Implementation order:
1. Restructure the JSX/template layout
2. Update styling (classes, styles)
3. Adjust any conditional rendering logic that moved
4. Verify all states still render correctly

### 7. Verify

After implementation:
- Check that every item from the Step 2 inventory is still present in the new layout
- Check that all conditional states still render (review every conditional branch in the JSX)
- If there are tests for this component, run them
- If the app can be run locally, suggest the user check key states visually

Report what changed and confirm that nothing was lost.

## Handling common situations

### Component is very large (500+ lines)

Read it fully anyway — understanding the full scope is the whole point. If it's large because it has many responsibilities, the layout refactor may naturally suggest extracting sub-components, but that's a side effect, not the goal.

### Component uses a third-party component as its base

If the component wraps a library component (e.g., MUI Card, Ant Design List.Item), work within the library's composition model. Don't fight the library's layout primitives — use them.

### The real problem is the data model, not the layout

Sometimes a component is confusing because the underlying data is confusing — too many statuses, ambiguous fields, redundant information. Note this if you see it. The layout refactor can still help by imposing hierarchy, but flag the deeper issue.

### User provides a screenshot or mockup

If the user shows what the component currently looks like (screenshot) or what they want (mockup), use that as primary input. The audit still matters — the screenshot may not show all states — but the visual reference anchors the work.

### Multiple variants of the same component

If the component renders very differently based on type or context (e.g., a card that looks different for "running" vs. "template" agents), treat each variant as its own layout problem but ensure they share a coherent structure. The variants should look like they belong to the same family.
