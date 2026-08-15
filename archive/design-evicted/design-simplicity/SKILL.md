---
name: design-simplicity
description: Simplicity, restraint, reduction, decluttering, focus, and clarity principles for UI design. Use when a UI feels busy, cluttered, over-explained, over-decorated, mentally heavy, or inelegant. Focuses on reducing visual and cognitive load without removing necessary capability.
---

# Design Simplicity

Use this skill to reduce a UI to what serves the user's task. Simplicity is not emptiness. It is the absence of unnecessary competition.

For choosing the correct UI pattern, use `ui-expert`. For copy quality, use `ui-content`. This skill owns visual and cognitive restraint.

## Core Principles

### 1. Remove Before Rearranging

Before redesigning layout, ask what can leave.

Candidates for removal:

- decorative icons next to obvious labels
- repeated descriptions
- redundant section titles
- duplicate actions
- low-value stats
- badges that restate text
- explanatory copy that the UI should make unnecessary
- containers around every group

If an element does not help the user decide, act, navigate, or understand state, it needs a reason to stay.

### 2. Demote Before Hiding

Not everything secondary should disappear. Often it should simply become quieter.

Demote by:

- combining metadata into one line
- reducing contrast
- moving details into a secondary area
- using text links instead of buttons
- using disclosure for rare details
- removing borders or backgrounds

### 3. One Primary Idea Per Region

Each region should answer one question:

- What is this?
- What changed?
- What should I do?
- Which item needs attention?
- What options are available?

If a region answers five questions equally, it feels cluttered even with good spacing.

### 4. Prefer Quiet Defaults

A quiet default state lets important exceptions stand out.

Avoid:

- bright color on ordinary statuses
- strong shadows on ordinary cards
- filled buttons for secondary actions
- heavy borders on every surface
- large illustrations in task-focused tools
- all-caps or bold labels everywhere

Reserve strong treatments for strong meaning.

### 5. Progressive Disclosure Is A Design Choice

Hide or defer details when:

- they are rare
- they are diagnostic
- they are advanced
- they are not needed for the next decision
- they interrupt the primary task

Keep visible:

- primary content
- primary action
- critical status
- navigation context
- information needed to choose safely

## The Reduction Pass

Run this pass before adding new styling:

1. **Remove:** delete anything that has no clear job.
2. **Merge:** combine repeated labels, metadata, or controls.
3. **Demote:** reduce emphasis on secondary material.
4. **Relocate:** move rare actions or details to overflow, secondary panels, or detail views.
5. **Clarify:** only after reduction, improve labels or grouping.

## Measurable Heuristics

Use these checks to make "too busy" actionable.

### Action Budget

Per region:

- one primary action
- 1-2 visible secondary actions
- rare or destructive actions in overflow, menus, confirmation flows, or separate danger zones

If a region needs more than 3 visible actions, group them by task or move secondary actions closer to the objects they affect.

### Group Size

Aim for 3-7 items per visual group. Fewer than 3 may not need its own container. More than 7 usually needs grouping, filtering, progressive disclosure, or a different UI pattern.

Examples:

- 9 settings in a flat list -> split into 2-3 sections
- 12 metrics on a dashboard -> promote 2-4, demote or remove the rest
- 8 row actions -> one primary action plus overflow

### Container Budget

Do not combine multiple separation techniques unless the region truly needs them.

Prefer one primary container treatment:

- whitespace
- border
- background tint
- shadow
- divider

A card with a tinted background, border, shadow, divider, icon badge, and large heading is usually over-contained.

### Copy Budget

For task-focused screens:

- avoid paragraphs above the primary work area unless the screen is empty, educational, or high risk
- keep helper text field-specific
- replace repeated explanatory copy with clearer labels, grouping, or defaults
- keep empty states to a clear title, one useful sentence, and one primary action when possible

Every extra unit of information competes with the relevant units of information.

## Common Fixes

| Problem | Move |
| :--- | :--- |
| Too many buttons | Keep one primary action, group secondary actions, move rare actions to overflow |
| Too much explanatory text | Replace paragraphs with clearer labels, structure, or state-specific copy |
| Too many cards | Use whitespace or headings for grouping; reserve cards for true modules |
| Too many badges | Keep badges for state, not for every attribute |
| Page feels heavy | Remove extra borders, shadows, icons, and background fills |

## Review Format

When reviewing simplicity, report:

- what can be removed
- what can be merged
- what can be demoted
- what can be moved out of the primary path
- which budgets are exceeded: actions, group size, containers, or copy
- what must remain visible
