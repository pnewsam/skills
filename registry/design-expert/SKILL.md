---
name: design-expert
description: Route visual-design and aesthetic-quality requests to the smallest relevant design-* skill set and synthesize the guidance. Use when a functional interface feels clunky, noisy, generic, disharmonious, or visually unresolved and the request spans two or more design concerns, or when the primary concern is unclear. Prefer one focused design-* skill for one clearly bounded concern. Owns composition and visual language; hand interface mechanics to ui-expert.
---

# Design Expert - Skill Router

Use this as the entry point for visual design judgment. The goal is to make a functional interface feel intentional, clear, harmonious, and refined.

This skill does not replace `ui-expert`. Use `ui-expert` for interface mechanics: page archetypes, forms, actions, feedback states, data display, responsive behavior, copy, icons, and concrete visual-system implementation. Use `design-expert` when the problem is that the UI feels busy, clunky, disharmonious, unfocused, generic, heavy, or visually unresolved.

Use the router when the request needs synthesis across two or more focused
design concerns or the dominant concern is unclear. Go directly to one focused
`design-*` skill when exactly one concern is clear.

## 1. Routing Table

Load the smallest set of focused skills that covers the design problem.

| User Need | Primary Skill | Secondary Skills |
| :--- | :--- | :--- |
| Page feels unbalanced, awkward, visually lopsided, poorly structured | `design-composition` | `design-hierarchy`, `design-rhythm` |
| User cannot tell what matters, everything competes, emphasis feels wrong | `design-hierarchy` | `design-simplicity`, `design-composition` |
| UI feels uneven, choppy, monotonous, cramped, or lacking flow | `design-rhythm` | `design-composition`, `design-simplicity` |
| UI is cluttered, busy, over-explained, over-decorated, or mentally heavy | `design-simplicity` | `design-hierarchy`, `design-rhythm` |
| UI feels generic, mismatched, off-brand, or aesthetically incoherent | `design-visual-language` | `design-composition`, `design-hierarchy` |
| Broad "make this elegant/simple/beautiful" request | `design-simplicity` | `design-composition`, `design-hierarchy`, `design-visual-language` |

If the task also requires choosing a UI pattern, route through `ui-expert` first or alongside this skill. If the task requires implementing React components, route through `react-expert` after the design direction is clear.

---

## 2. Separation From UI Skills

Use these boundaries:

- `ui-layouts` owns page archetypes, app shell, page zones, and chrome. `design-composition` owns balance, proportion, focal point, and spatial harmony within that structure.
- `ui-visual-hierarchy` owns task priority, scanning order, chunking, and progressive disclosure. `design-hierarchy` owns visual dominance, contrast, de-emphasis, and how emphasis feels.
- `ui-spacing` owns spacing scales, padding, gaps, density values, and context-specific spacing mechanics. `design-rhythm` owns cadence, repetition, pauses, and the felt tempo of the screen.
- `ui-color`, `ui-typography`, and `ui-depth` own implementation systems and semantic roles. `design-visual-language` owns aesthetic direction, mood, coherence, and expressive fit.
- `ui-content` owns words and microcopy. `design-simplicity` owns whether the total surface has too many words, options, decorations, or competing ideas.

When two skills overlap, ask: "Is this a conventional interface-pattern decision, or a visual/design-quality decision?"

---

## 3. Design Review Protocol

When reviewing a UI through design skills:

1. **Name the intended experience.** Calm admin tool, editorial landing page, focused creation flow, dense operations console, etc.
2. **Name the primary user task.** Design quality serves the task.
3. **Diagnose the felt problem.** Busy, flat, heavy, chaotic, generic, cramped, weak, loud, fragmented, or unfinished.
4. **Route to focused design skills.** Use only the skills needed.
5. **Separate design direction from UI implementation.** First decide what should change visually. Then use `ui-*` or `react-*` skills to implement with the right pattern and code.
6. **Prefer subtraction before addition.** Remove, demote, align, group, or simplify before adding color, shadow, decoration, copy, or new components.

## 4. Measurable Design Pass

Run this pass when the request is broad, subjective, or asks for elegance, beauty, simplicity, or polish.

| Check | Skill | What To Look For |
| :--- | :--- | :--- |
| Focal point and layout ratio | `design-composition` | rule-of-thirds fit when relevant, stable axis balance, clear equal/unequal proportions |
| Emphasis budget | `design-hierarchy` | one visual lead, one primary action, max 2-3 prominent type sizes, limited accents |
| Rhythm ladder | `design-rhythm` | `1x/2x/3x/4x` gap relationships, repeated module slots, justified rhythm breaks |
| Reduction budget | `design-simplicity` | action count, group size, container count, copy amount |
| Visual-language budget | `design-visual-language` | 60/30/10 accent use, OKLCH-like ramp logic, hue relationships, contrast gates |

Do not force every heuristic onto every UI. Use the checks that match the surface. For example, a dense settings page needs action, grouping, and rhythm checks more than rule-of-thirds composition.

## 5. Output Format

For critique or recommendations, respond with:

1. **Design Diagnosis:** the core visual/design issue in 1-3 sentences.
2. **Skill Routing:** focused design skills used and why.
3. **Heuristic Checks:** measured checks that were relevant, with pass/warn/fix status.
4. **Findings:** a concise table:

| # | Skill | Current | Issue | Recommendation | Why |
| :--- | :--- | :--- | :--- | :--- | :--- |

5. **Top Moves:** the 1-3 changes most likely to improve the design.
6. **Implementation Handoff:** which `ui-*`, `react-*`, or workflow skill should apply the changes, if implementation is needed.

Keep design advice concrete. "Make it cleaner" is not useful. "Demote all tertiary metadata to one muted line, remove the second border treatment, and give the primary metric the only large type on the card" is useful.
