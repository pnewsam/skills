---
name: design-composition
description: "Visual composition principles for digital interfaces: balance, alignment, proportion, focal point, spatial structure, grouping, figure-ground, visual weight, rhythm, repetition, and cadence. Use when a UI feels awkward, lopsided, poorly arranged, visually unstable, choppy, monotonous, or structurally disharmonious after the correct UI patterns are already known."
---

# Design Composition

Use this skill to arrange interface elements so the screen feels stable, intentional, and easy to scan. Composition is about how parts relate as a whole.

For page archetypes, app shells, and standard page anatomy, use `ui-layouts`. For spacing scale values, use `ui-spacing`. This skill owns balance, proportion, focal point, alignment, grouping, visual weight, and the cadence created by repeated visual structures.

## Core Principles

### 1. Establish A Focal Point

Every screen or component needs one clear visual entry point. The focal point is usually the primary content, primary metric, page title, active object, or primary action.

If the eye enters in the wrong place, fix composition before adding decoration:

- move the focal point earlier in the reading path
- give it more space
- remove competing accents nearby
- reduce nearby borders, badges, shadows, and icons
- group supporting content around it

### 2. Balance Visual Weight

Balance does not mean symmetry. It means the screen feels stable.

Visual weight comes from:

- size
- contrast
- color intensity
- density
- image mass
- shadow or border strength
- position
- whitespace

Common failures:

| Failure | Fix |
| :--- | :--- |
| Heavy sidebar overpowers the content | Reduce sidebar contrast, width, icon weight, or active treatment |
| One card looks heavier than peer cards | Normalize shadow, border, padding, and title weight |
| A bright badge pulls attention away from the main item | Mutate the badge or move it into secondary metadata |
| Empty left side and crowded right side | Rebalance columns, width, or grouping |

### 3. Use Alignment As Structure

Alignment creates invisible order. Elements that belong to the same system should share edges, baselines, or centerlines.

Rules:

- Align text-heavy groups on a left edge.
- Align mixed text and icons optically, not just mathematically.
- Align repeated cards by the same internal slots: title, metadata, action, status.
- Avoid almost-aligned edges. A 3px accidental offset feels sloppy.
- Do not center-align dense content unless the content is ceremonial or very short.

### 4. Manage Proportion

The amount of space an element receives should match its importance and content load.

Ask:

- Is a secondary panel taking primary real estate?
- Is a primary table cramped while decorative stats are spacious?
- Is a two-column layout giving equal width to unequal jobs?
- Does card padding exceed the amount of content it contains?

Proportion should communicate priority before the user reads labels.

### 5. Group Before Decorating

Related elements should feel like a unit before you add borders, cards, dividers, or shadows.

Use:

- proximity
- common alignment
- shared background only when needed
- shared heading or label
- repeated internal structure

Avoid carding every group by default. Too many containers create visual noise and make the page feel boxed-in.

### 6. Preserve Figure-Ground Clarity

Users should be able to tell foreground from background.

- Primary content should sit on the clearest surface.
- Chrome should recede unless it is being actively used.
- Overlays must visually sit above persistent surfaces.
- Background decoration must not compete with content.

### 7. Build Rhythm Through Repetition And Variation

Rhythm is the pattern users feel as modules, gaps, alignments, and visual roles repeat. Establish a recognizable cadence, then break it only to signal a real change in meaning or priority.

Use:

- consistent internal slots across repeated cards, rows, or sections
- a small spacing ladder rather than unrelated gaps
- recurring heading, body, metadata, and action roles
- intentional pauses around major transitions
- restrained variation for milestones, exceptions, or focal content

Avoid:

- arbitrary alternation that makes equivalent content look unrelated
- identical emphasis for every repeated item
- one-off spacing that has no semantic reason
- overly uniform modules that hide important changes in state

`ui-spacing` owns the actual tokens and density values. Composition owns how those values create cadence across the whole surface.

## Measurable Heuristics

Use these as diagnostic guardrails, not universal laws.

### Rule Of Thirds Check

For hero sections, editorial layouts, image-led cards, dashboards with a primary metric, or any screen with one strong focal area:

1. Mentally divide the composition into a 3 x 3 grid.
2. Check whether the focal point sits near a third line or intersection.
3. If the focal point sits dead center, confirm that symmetry is intentional.
4. If the focal point sits at the edge, confirm that another element or whitespace balances it.

Do not force rule-of-thirds composition onto dense tables, settings pages, forms, or CRUD tools where conventional alignment and task flow matter more.

### Proportion Families

Major layout splits should be either clearly equal or clearly unequal:

| Ratio | Use |
| :--- | :--- |
| `1:1` | true comparison, split editors, before/after views |
| `3:2` or `5:3` | primary content with meaningful secondary support |
| `8:5` or `13:8` | editorial, hero, media/text, or presentation-heavy layouts |
| `3:1` or `4:1` | main work area plus narrow supporting rail |

Avoid accidental near-equality. A `47/53` or `52/48` split often looks like a mistake; make it `1:1` or push it to a clearer ratio such as `3:2`.

### Visual-Mass Axis Check

Draw an imaginary vertical or horizontal axis through the composition. The two sides do not need to mirror, but their visual mass should feel intentionally distributed.

When one side feels heavy, balance by:

- reducing color, contrast, shadow, image mass, or density on the heavy side
- adding whitespace around the heavy side
- moving secondary material away from the heavy side
- adding a quieter counterweight, not another loud element

### Alignment Tolerance

Repeated elements should share stable alignment. Accidental offsets of more than 1-2px in icons, baselines, card edges, or repeated rows usually read as sloppiness. If an element breaks alignment, it should be because it is changing level, state, or role.

## Composition Checklist

Before implementation, check:

- What is the focal point?
- What is the heaviest visual element? Should it be?
- Do related elements share alignment?
- Are proportions matched to importance?
- Are major layout splits clearly equal or clearly unequal?
- Does the focal point benefit from a thirds-grid or deliberate symmetry check?
- Are groups clear without excess containers?
- Do repeated modules establish a useful cadence?
- Are rhythm breaks justified by a change in meaning or priority?
- Does the page feel stable at a glance?

## Review Format

When reviewing composition, use:

| # | Current | Composition Issue | Recommendation | Why |
| :--- | :--- | :--- | :--- | :--- |

End with the one compositional move that would most improve the screen.
