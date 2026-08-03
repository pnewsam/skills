---
name: visual-hierarchy
description: Establish or critique visual hierarchy in an interface, page, component, or graphic by aligning task priority, semantic importance, reading order, emphasis, grouping, and de-emphasis. Use when users cannot tell what matters, where to look, what to do next, or how information relates; when a composition feels flat, noisy, or dominated by the wrong element; or when reviewing hierarchy across responsive states. Covers both UI scanning behavior and general visual dominance.
---

# Visual Hierarchy

## Outcome

Make the intended order of attention match the user's task and the meaning of the content. A successful hierarchy answers, at a glance:

1. Where am I?
2. What matters most?
3. What can I do next?
4. What belongs together?
5. What can I safely ignore for now?

Hierarchy is relational. Making everything larger, brighter, or bolder removes hierarchy rather than strengthening it.

## Diagnose first

Identify:

- primary user task and primary action
- most important information or object
- required sequence, if any
- secondary context and metadata
- destructive, exceptional, or low-frequency actions
- viewport, input mode, content length, and state variations

When reviewing an existing design, inspect it at normal scale and with blurred or squinted vision. If the dominant shapes do not match the intended priorities, the hierarchy is structurally wrong.

Read `references/scanning_and_chunking.md` for dense pages, lists, dashboards, forms, tables, and responsive layouts.

## Levers

Use the fewest levers necessary:

- **Position:** earlier and structurally central elements are usually noticed first.
- **Scale:** reserve meaningful size changes for meaningful rank changes.
- **Weight:** use typographic or visual mass to reinforce semantic importance.
- **Contrast:** spend the highest contrast on the current task, not decoration.
- **Color:** use accent color deliberately and preserve semantic color meanings.
- **Whitespace:** separation signals different groups; proximity signals relationship.
- **Containment:** borders, surfaces, and cards create groups but also add visual mass.
- **Repetition:** consistent styling lets users recognize equivalent roles.
- **Motion:** temporary emphasis can direct attention, but must not create a permanent competing focal point.

Do not stack every lever on the same element unless it is genuinely dominant.

## Workflow

### 1. Write the intended attention order

List the first three to five things a user should notice. If the team cannot agree on the order, resolve product priority before polishing the visual system.

### 2. Map the current attention order

Record what actually dominates and why. Distinguish:

- excessive emphasis
- insufficient emphasis
- poor grouping
- ambiguous action priority
- decorative competition
- hierarchy that collapses with real content or small screens

### 3. Fix structure before styling

Change ordering, grouping, and proximity before increasing font size, color, or shadow. A structurally clear design usually needs less decoration.

### 4. Assign a small set of levels

Define a limited hierarchy such as:

1. page or workflow identity
2. current task, key value, or primary action
3. section and supporting actions
4. body content
5. metadata, helper text, and tertiary controls

Not every screen needs every level. Equivalent roles should look equivalent.

### 5. De-emphasize actively

Reduce contrast, weight, containment, or prominence for elements that interrupt the task. De-emphasis must preserve readability, discoverability, and accessible contrast.

### 6. Validate in context

Check:

- first glance at normal size
- keyboard focus and interactive states
- long, empty, error, and loading states
- narrow and wide viewports
- color-vision and contrast requirements
- whether destructive actions are clear without overpowering the primary task

## Review checklist

- Does the visual focal point match the primary task?
- Is there one clear primary action per decision context?
- Can users scan headings and groups without reading every line?
- Are related items closer to one another than to unrelated items?
- Are metadata and low-frequency controls quieter but still usable?
- Do typography, spacing, color, and containment reinforce the same ranking?
- Does hierarchy survive real content and responsive reflow?
- Are focus, validation, warning, and error states perceivable?

## Handoffs

- Use `design-composition` for balance, focal structure, and spatial relationships across the whole composition.
- Use `ui-spacing` for spacing tokens, density, and proximity systems.
- Use `ui-typography` for type scale and text-role decisions.
- Use `ui-color` for contrast and semantic color.
- Use `ui-actions` when the ambiguity is primarily action selection.
- Use `ui-layouts` when page-level layout is the central decision.
