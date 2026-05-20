---
name: react-component-design
description: principles for designing, creating, and refactoring React components. covers component size, single responsibility, compositional patterns, and the "branch early" principle — prefer distinct components over prop-toggled behavior. reference this skill when creating new components, reviewing component structure, or deciding whether and how to split a component.
---

# React Component Design

## Overview

This skill defines the principles that govern how React components should be designed, structured, and decomposed. It is not a workflow — it is a set of guidelines that other skills (like `decompose-component`, `audit-component-size`, and `redesign-component`) should defer to when making structural decisions.

The core philosophy: components should be small, focused, and compositional. When a component starts doing too much, the answer is almost always to split it into multiple components — not to add props that toggle behavior.

## Principles

### 1. Keep components small

Target **under 150 lines** for most components. **250 lines** is the upper bound for complex components that genuinely need it. These are guidelines, not hard rules — a 180-line component that is cohesive and clear is fine; a 120-line component with three responsibilities crammed together is not.

Size is a *signal*, not the *problem*. A large component is worth investigating, but the question is always "does this component have one clear job?" — not "is this component over N lines?"

### 2. Single responsibility

A component should do one thing and be nameable in a way that describes that one thing. If you struggle to name a component without using "and" or "with," it probably has multiple responsibilities.

Good: `InvoiceLineItem`, `UserProfileHeader`, `SearchFilterBar`
Suspect: `InvoiceLineItemWithActions`, `UserProfileHeaderAndNav`

When a component has multiple responsibilities, the fix is decomposition — extract each responsibility into its own component and compose them in a parent.

### 3. Compositional design

Build UIs by composing small, focused components rather than by building large monolithic ones. A page is a composition of sections. A section is a composition of elements. Each level of composition is a component.

```tsx
// Good: composition of named, focused pieces
function InvoicePage() {
  return (
    <PageLayout>
      <InvoiceHeader invoice={invoice} />
      <InvoiceLineItems items={invoice.lineItems} />
      <InvoiceTotals invoice={invoice} />
      <InvoiceActions invoice={invoice} onSend={handleSend} />
    </PageLayout>
  );
}

// Bad: one component doing everything
function InvoicePage() {
  return (
    <div>
      {/* 50 lines of header JSX */}
      {/* 80 lines of line items JSX */}
      {/* 30 lines of totals JSX */}
      {/* 40 lines of action buttons JSX */}
    </div>
  );
}
```

The parent component should read like a table of contents — you can see the structure of the page at a glance.

### 4. Branch early, branch cleanly

**Prefer two distinct components over one component with a boolean prop that toggles behavior.**

When a component needs to render differently based on a mode, type, or variant, ask: are these really the same component, or are they two different things sharing a name?

```tsx
// Bad: one component with branching behavior
function AgentCard({ agent, isCompact }: Props) {
  // 50 lines of shared logic
  if (isCompact) {
    return (/* compact layout — 40 lines */);
  }
  return (/* full layout — 80 lines */);
}

// Good: two components, shared logic in a hook or shared sub-components
function AgentCardCompact({ agent }: Props) {
  return (/* compact layout */);
}

function AgentCardFull({ agent }: Props) {
  return (/* full layout */);
}

// If they share logic, extract it
function useAgentCardState(agent: Agent) {
  // shared state and handlers
}
```

**Why this matters beyond readability:**

- **Performance:** Cleanly separated components make it easier to place state, memoization, and expensive work at the right boundary. Separation alone does not guarantee fewer renders, but it gives React clearer component boundaries to optimize.
- **Maintenance:** When you modify the compact variant, you can't accidentally break the full variant. The blast radius of changes is contained.
- **Testing:** Each variant can be tested independently with clear inputs and outputs.

**When branching within a component is acceptable:**

- Small visual variations (a color, an icon, a CSS class) controlled by a prop — this is normal variant styling, not behavioral branching.
- Truly shared rendering with a minor conditional (e.g., showing/hiding one element based on a prop).
- The "two versions" share 90%+ of their structure and differ only in a detail.

**When to split:**

- The component has an `if/else` or ternary that returns substantially different JSX trees.
- A boolean prop changes what hooks are needed, what handlers exist, or what state is managed.
- You find yourself writing "if mode is X, do this; if mode is Y, do that" repeatedly throughout the component.

### 5. Minimize lateral coupling

Parent-child relationships are the natural grain of React. A parent passes props down to children — this is easy to trace and reason about.

What to avoid:

- **Sibling components that communicate through shared refs or imperative handles** — if siblings need to coordinate, lift the shared state to the parent.
- **Context used as a back-channel between unrelated components** — context is for truly shared state (theme, auth, locale), not for coupling components that happen to need the same data.
- **Prop drilling through many layers just to connect two distant components** — this is a signal that either the state lives at the wrong level, or you need a more targeted context/provider scoped to that subtree.

### 6. Props should be data, not configuration

A component's props should primarily be the data it needs to render and the callbacks it calls when the user acts. Avoid "configuration" props that control internal component behavior — these are usually a sign that the component is doing too many things.

```tsx
// Suspect: configuration-heavy props
<DataTable
  data={rows}
  sortable={true}
  filterable={true}
  paginated={true}
  editable={false}
  selectable={true}
  expandable={false}
/>

// Better: compose the behaviors you need
<DataTable data={rows}>
  <SortableHeaders />
  <FilterBar />
  <Pagination />
  <SelectionColumn />
</DataTable>
```

This isn't always achievable — some third-party components are configuration-driven by design, and that's fine. But when designing your own components, prefer composition over configuration.

### 7. Compound components

When a component has multiple related parts that need to work together but should be independently composable, use the compound component pattern:

```tsx
// Compound component — consumers compose the pieces they need
<Select value={value} onChange={setValue}>
  <Select.Trigger>Choose a role</Select.Trigger>
  <Select.Content>
    <Select.Group label="Engineering">
      <Select.Option value="fe">Frontend</Select.Option>
      <Select.Option value="be">Backend</Select.Option>
    </Select.Group>
  </Select.Content>
</Select>
```

This pattern uses `children` and React Context internally so the sub-components can communicate without prop drilling. It's the right choice for UI primitives that have flexible internal structure: selects, menus, tabs, accordions, dialogs, tables.

**When to use compound components:**
- The component has multiple parts that can be arranged or omitted by the consumer
- The parts need to share implicit state (which tab is selected, which option is highlighted)
- A flat props API would be unwieldy (`options`, `renderOption`, `renderTrigger`, `groupBy`...)

**When a simpler API is fine:**
- The component has a fixed internal structure — just accept data props
- There's only one reasonable arrangement of the parts

### 8. Controlled vs. uncontrolled

When designing a component that holds state (an input, a disclosure, a select), decide whether the component owns its state (uncontrolled) or the parent owns it (controlled).

```tsx
// Uncontrolled — component owns state, parent gets notified
<Accordion defaultOpen={true} onToggle={handleToggle} />

// Controlled — parent owns state, component reflects it
<Accordion open={isOpen} onToggle={setIsOpen} />
```

**The rule:** Support both patterns when the component is a base UI component. Use `defaultValue`/`defaultOpen` for the uncontrolled case, `value`/`open` for the controlled case. This matches how native HTML elements work (`<input defaultValue>` vs `<input value>`).

For domain-specific components, choose whichever is simpler for the use case — you don't always need both.

### 9. TypeScript prop patterns

**Discriminated unions for variants:**

When a component has modes that require different props, use a discriminated union rather than making everything optional:

```tsx
// Bad: everything optional, easy to pass invalid combinations
interface ButtonProps {
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
}

// Good: the type narrows which props are valid
type ButtonProps =
  | { as: "button"; onClick: () => void; type?: "button" | "submit" }
  | { as: "link"; href: string };
```

**Extending HTML element props:**

When wrapping a native element, extend its props so consumers can pass through standard attributes:

```tsx
interface InputFieldProps extends React.ComponentPropsWithoutRef<"input"> {
  label: string;
  error?: string;
}
```

## When to decompose

Use these questions rather than a line-count threshold:

1. **Can you name this component in 2–3 words that fully describe its job?** If not, it may have multiple responsibilities.
2. **If you removed one section of this component, would the rest still make sense?** If yes, that section is a candidate for extraction.
3. **Does this component have state or hooks that are only used in one part of its JSX?** That state should move with the JSX into a sub-component.
4. **Would you need to read the whole file to understand any one part of it?** If reading the header code requires understanding the footer code, they're too entangled. If they're independent, they should be separate components.
5. **Does modifying one part of this component risk breaking another part?** If yes, the parts are coupled and should be separated.

Line count is a useful early filter — investigate anything over 200 lines — but the decision to split should be based on these questions, not the number.

## When NOT to decompose

Not every large component needs splitting:

- **The component is cohesive.** If all the state, handlers, and JSX are tightly interdependent and serve a single purpose, splitting will just create prop-drilling and indirection. A 250-line component that's one cohesive thing is better than 5 components passing 8 props between them.
- **The extraction would be trivial.** If the sub-component would be 15 lines of JSX with no logic, you're adding a file and an import for no meaningful clarity gain.
- **The "sections" heavily share state.** If extracting a section means passing 6+ props from the parent, the boundary is wrong. Consider extracting a custom hook for the shared state instead.
- **It's a leaf component.** A complex form field, a rich text editor wrapper, a chart component — these can legitimately be larger because they're self-contained and have no sub-structure to extract.
