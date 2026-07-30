---
name: design-rhythm
description: "Rhythm, cadence, repetition, variation, whitespace, density flow, and visual tempo principles for UI design. Use when a screen feels choppy, monotonous, cramped, loose, uneven, or lacking flow. For concrete spacing scales and padding values, use ui-spacing."
---

# Design Rhythm

Use this skill to make a UI feel coherent as the eye moves through it. Rhythm is the pattern of repetition and pause across a screen.

`ui-spacing` owns spacing scale mechanics. This skill owns the felt cadence: where the screen should be tight, where it should breathe, what repeats, and where variation creates emphasis.

## Core Principles

### 1. Repetition Creates Confidence

Users trust interfaces that repeat structure predictably.

Repeat:

- card internal layout
- table row rhythm
- section header pattern
- action placement
- icon size and position
- spacing between peer groups

Do not make each section a custom composition unless each section serves a clearly different purpose.

### 2. Variation Creates Emphasis

Variation should be rare and meaningful.

Use variation to signal:

- a primary metric
- a selected or active object
- a major section break
- a warning or important state
- a different mode of interaction

If every module varies, the screen feels chaotic. If nothing varies, the screen feels flat.

### 3. Use Pauses Deliberately

Whitespace is a pause in the rhythm. A larger pause says "new idea" or "important moment."

Good pauses:

- before a major section
- around the focal point
- between unrelated task groups
- before a destructive or high-risk area

Bad pauses:

- random gaps between peer sections
- large space inside low-value cards
- whitespace created by uneven content rather than intentional layout

### 4. Tune Density By Task

The right rhythm depends on the work:

| Task | Rhythm |
| :--- | :--- |
| Compare many records | compact, repeated, low variation |
| Complete one focused form | steady, linear, modest pauses between sections |
| Browse or discover | more breathing room, stronger module separation |
| Monitor operational status | dense summaries, clear emphasis for exceptions |
| Read long content | calm vertical rhythm, constrained line length |

Do not use relaxed marketing cadence in a dense tool. Do not use compressed table cadence in a page meant for consideration.

### 5. Keep Nested Rhythm Consistent

A page has rhythms at multiple levels:

- page sections
- cards or panels
- rows or fields
- inline elements

Each level should have its own cadence. Problems appear when inline, card, and section gaps all look similar.

## Measurable Heuristics

Use these checks when rhythm feels uneven, cramped, or arbitrary.

### Gap Ratio Ladder

Different relationship levels should have visibly different gaps:

| Relationship | Ratio | Example On 8px Base |
| :--- | :--- | :--- |
| inside a tight group | `1x` | `8px` |
| between related elements | `2x` | `16px` |
| between related groups | `3x` | `24px` |
| between major zones | `4-6x` | `32-48px` |

If two different relationship levels use almost the same gap, grouping becomes ambiguous. Prefer obvious jumps such as `8 -> 16 -> 24/32` over tiny differences like `18 -> 20`.

### Repetition Budget

Repeated modules should share:

- the same internal slot order
- the same title position
- the same metadata rhythm
- the same action placement
- the same padding/gap pattern

Variation is allowed only when it signals role, priority, state, or mode.

### Rhythm Break Limit

Use at most one major rhythm break per viewport unless the screen intentionally has multiple independent zones. A larger hero metric, an alert, or a featured card can break rhythm; three unrelated breaks make the page feel chaotic.

### Ambiguous Density Check

If a screen feels both cramped and empty, density is probably uneven. Tighten repeated low-value elements and add whitespace only around task groups, section breaks, or the focal point.

## Common Fixes

| Problem | Move |
| :--- | :--- |
| Page feels choppy | Normalize section spacing and repeated module structure |
| Page feels monotonous | Add one purposeful break or larger focal area |
| Cards feel uneven | Match internal slots and vertical rhythm across cards |
| Dense UI feels cramped | Add pauses between task groups, not inside every element |
| Spacious UI feels empty | Tighten repeated elements and reserve large whitespace for the focal point |

## Review Format

When reviewing rhythm, identify:

- repeated patterns that should be standardized
- variations that should be removed
- variations that should be made more intentional
- gap ratios that are too similar or too extreme
- major rhythm breaks and whether they are justified
- where the screen needs a pause
- where the screen should tighten
