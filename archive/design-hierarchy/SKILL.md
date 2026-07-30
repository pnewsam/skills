---
name: design-hierarchy
description: "Visual hierarchy principles for design quality: dominance, emphasis, contrast, de-emphasis, foreground/background, hierarchy ladders, and calm visual priority. Use when a UI has the right content but everything competes, the wrong thing dominates, or the page lacks a clear visual lead. For UI task priority and scanning mechanics, use ui-visual-hierarchy."
---

# Design Hierarchy

Use this skill after the UI priority is known. `ui-visual-hierarchy` helps decide what users should notice first. `design-hierarchy` makes that priority visually convincing, calm, and beautiful.

## Core Principles

### 1. One Clear Lead

A design should have one lead idea per view or component. The lead may be a title, metric, object, action, image, or status.

If there are multiple leads, the design feels noisy. Choose one, then subordinate the others.

### 2. De-Emphasize Before Amplifying

When hierarchy is weak, agents often make the primary element bigger or brighter. Usually the better move is to quiet the surrounding elements.

Use this order:

1. Remove unnecessary accents.
2. Reduce secondary contrast.
3. Collapse redundant labels.
4. Lower border, icon, badge, or shadow weight.
5. Increase the primary element only if it still does not lead.

This produces calmer interfaces than adding emphasis on top of emphasis.

### 3. Build A Hierarchy Ladder

A hierarchy ladder is a small set of visual levels:

| Level | Treatment | Use |
| :--- | :--- | :--- |
| Lead | largest or strongest treatment | page title, primary metric, active object |
| Section | medium weight and spacing | major content groups |
| Body | neutral treatment | ordinary readable content |
| Support | muted, smaller, lower contrast | metadata, helper text, timestamps |
| Background | lowest contrast | chrome, dividers, inactive controls |

Avoid more than 4-5 levels in one component. Too many levels make the UI feel fiddly.

### 4. Contrast Must Be Meaningful

Contrast creates hierarchy only when it reflects importance.

Useful contrast:

- one filled primary button among quieter secondary actions
- one larger metric among smaller supporting metrics
- one active nav item among muted inactive items
- one strong title among subdued metadata

Noisy contrast:

- every badge uses a bright color
- every card has a strong shadow
- every link is bright blue in a dense table
- every section title has the same large size

### 5. Make Secondary Elements Earn Attention

Secondary information should be easy to find but not eager to interrupt.

Demote:

- timestamps
- IDs
- helper text
- inactive navigation
- repeated labels
- rare actions
- supporting metrics

Promote only if the user needs it to make the next decision.

## Measurable Heuristics

Use these checks when hierarchy feels vague or noisy.

### Emphasis Budget

Each region should have:

- one visual lead
- one primary action, if an action is needed
- no more than 1-2 visible secondary actions
- no more than one strong accent treatment unless the region is explicitly comparing peers

If a card, panel, or header has multiple filled buttons, multiple bright badges, and multiple bold labels, the hierarchy budget is overspent.

### Size And Type Limits

As a starting point:

- use no more than 3 prominent text sizes inside one component
- use 2-3 type sizes for most page regions
- keep 4-5 hierarchy levels maximum: lead, section, body, support, background
- make size differences intentional: `30px` vs `28px` is noise; `30px` vs `20px` is hierarchy

When the design needs more levels, try reducing secondary material before adding another size.

### Lead Contrast Test

The intended lead should differ from its nearest peer by at least one clear visual step:

- size step: about `1.25x` or more
- weight step: regular to semibold/bold, not regular to medium only
- contrast step: primary text vs secondary/muted text
- spatial step: more surrounding whitespace or earlier placement

If the user must read labels to know which item leads, the contrast is too subtle.

### Accent Count

Strong color, strong shadow, heavy border, large type, and filled buttons are all accents. Count them together. A region with 5 accents will feel busy even if each individual treatment is defensible.

## Common Fixes

| Problem | Move |
| :--- | :--- |
| Everything feels equally loud | Pick one lead and demote everything else by one level |
| Metadata competes with title | Combine metadata into one muted line |
| Multiple primary actions | Keep one primary, convert others to secondary or overflow |
| Cards feel noisy | Reduce shadow/border/badge contrast before changing layout |
| Page feels flat | Increase separation between lead, section, body, and support levels |

## Review Format

When reviewing hierarchy, report:

1. **Current visual lead:** what dominates now.
2. **Intended visual lead:** what should dominate.
3. **Hierarchy ladder:** proposed lead, section, body, support, background levels.
4. **Heuristic checks:** emphasis budget, type-size count, lead contrast, accent count.
5. **Top hierarchy fixes:** 1-3 concrete demotions or promotions.
