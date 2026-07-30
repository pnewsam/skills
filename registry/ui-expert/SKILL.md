---
name: ui-expert
description: Route UI and UX requests to the smallest relevant ui-* skill set and synthesize the guidance. Use for a full screen, page, or flow that spans two or more interface concerns, or when the needed pattern is unclear. Prefer one focused ui-* skill for one clearly bounded concern. Owns functional interface decisions; hand purely aesthetic or compositional concerns to design-expert.
---

# UI Expert - Skill Router

Use this as the entry point for broad UI work. Your job is to identify the actual interface problem, load only the focused `ui-*` skills needed, and produce or review UI that is intuitive, conventional, simple, and polished.

If the user says the UI is ugly, clunky, disharmonious, visually awkward, generic, too busy, or not elegant, route aesthetic and compositional judgment to `design-expert` after identifying the functional UI pattern.

Use the router when the request spans two or more focused UI concerns or needs
a unified screen/flow recommendation. Go directly to one focused `ui-*` skill
when exactly one concern is clear.

## 1. Routing Table

Load the smallest set of focused skills that covers the task.

| User Need | Primary Skill | Secondary Skills |
| :--- | :--- | :--- |
| Whole page, screen, app shell, dashboard, settings page, landing page | `ui-layouts` | `visual-hierarchy`, `ui-spacing`, `ui-responsive` |
| Collection display: table, list, cards, board, tabs, filters, pagination | `ui-patterns` | `ui-actions`, `ui-feedback`, `ui-responsive` |
| Create/edit/settings form, field choice, modal/drawer/page/wizard | `ui-forms` | `ui-content`, `ui-feedback`, `ui-actions` |
| Buttons, row actions, bulk actions, command palette, drag/drop, touch actions | `ui-actions` | `ui-icons`, `ui-feedback`, `ui-responsive` |
| Empty/loading/error/success states, toasts, banners, confirmations, undo | `ui-feedback` | `ui-content`, `ui-actions` |
| Button labels, empty state copy, errors, field help, terminology | `ui-content` | `ui-feedback`, `ui-forms` |
| What should stand out, scanning order, chunking, progressive disclosure | `visual-hierarchy` | `ui-layouts`, `ui-typography`, `ui-spacing` |
| Gaps, padding, density, proximity, rhythm | `ui-spacing` | `ui-layouts`, `visual-hierarchy` |
| Font sizes, heading hierarchy, readability, line length | `ui-typography` | `visual-hierarchy`, `ui-spacing` |
| Palette, semantic tokens, dark mode, contrast, status colors | `ui-color` | `ui-feedback`, `visual-hierarchy` |
| Surfaces, shadows, elevation, overlays, image crops, text over images | `ui-depth` | `ui-color`, `ui-spacing`, `visual-hierarchy` |
| Mobile/tablet adaptation, breakpoints, touch targets, responsive nav | `ui-responsive` | `ui-layouts`, `ui-actions` |
| Icon selection, icon-only buttons, icon library consistency | `ui-icons` | `ui-actions`, `ui-content` |
| Charts, metrics, dashboards, choosing chart type vs number | `ui-data-viz` | `ui-layouts`, `ui-color` |
| First-run experience, activation, tours, checklists, sample data | `ui-onboarding` | `ui-feedback`, `ui-content`, `ui-layouts` |
| Transactional emails, digests, reports, product updates, lifecycle emails | `ui-email` | `ui-content`, `visual-hierarchy`, `ui-typography`, `ui-color` |
| Aesthetic quality, composition, elegance, simplicity, visual harmony | `design-expert` | `ui-layouts`, `visual-hierarchy`, `ui-spacing` |

If a request touches more than four rows, start with `ui-layouts`,
`visual-hierarchy`, and the one domain skill closest to the user's core task.
Add more skills only when the work demands them.

---

## 2. Overlap Boundaries

Use these boundaries to prevent conflicting advice:

- `ui-layouts` owns page anatomy: app shell, page zones, chrome, standard page types, scroll regions.
- `ui-patterns` owns content patterns inside a page zone: tables, lists, cards, pagination, filtering, tabs, previews.
- `ui-forms` owns form containers and fields: modal vs drawer vs page, input type selection, settings forms, wizards.
- `ui-actions` owns how users trigger operations: action placement, overflow menus, bulk bars, shortcuts, drag/drop.
- `ui-feedback` owns system state: empty, loading, error, success, confirmation, undo.
- `ui-content` owns words: labels, messages, helper text, terminology, tone.
- `visual-hierarchy` owns importance: what dominates, what recedes, scanning
  path, and chunking.
- `ui-spacing`, `ui-typography`, and `ui-color` own the visual system details.
- `ui-depth` owns surfaces, shadows, elevation, overlays, and image treatment.
- `ui-responsive` owns adaptation across viewport and input mode.
- `ui-icons` owns icon semantics, consistency, and icon-only accessibility.
- `ui-data-viz` owns quantitative presentation and chart selection.
- `ui-onboarding` owns the path from first visit to user value.
- `ui-email` owns email-specific UI patterns, layout constraints, client-safe implementation, inbox-safe hierarchy, and transactional/digest email structures.
- `design-expert` owns visual design judgment: composition, harmony, restraint, rhythm, aesthetic direction, and whether the interface feels elegant or resolved.

When two skills overlap, decide by asking: "Is this about where the thing lives, what pattern the thing is, how the thing behaves, what state the thing is in, or how the thing is visually expressed?"

---

## 3. Build Protocol

When generating UI, follow this order before writing code:

1. **Name the concrete feature.** Start with the user-facing functionality, not app chrome, navigation, or decoration.
2. **Name the user goal.** What is the primary job this screen or flow must support?
3. **Choose the page archetype.** Use `ui-layouts`: list/index, detail, form, dashboard, settings, marketing, utility.
4. **Inventory content and actions.** Separate primary content, secondary content, primary actions, secondary actions, and system states.
5. **Pick inner patterns.** Use `ui-patterns`, `ui-forms`, `ui-actions`, `ui-feedback`, or `ui-data-viz` for the dominant interaction.
6. **Establish hierarchy before styling.** The screen should work in grayscale before relying on brand color, icons, shadows, or imagery.
7. **Apply design judgment when needed.** If the page feels busy, clunky, unbalanced, generic, or visually unresolved, route to `design-expert` before final styling.
8. **Apply visual system rules.** Use spacing, typography, color, depth, icons, and responsive guidance. Prefer the project's existing design system when present.
9. **Check state coverage.** Include empty, loading, error, success, disabled, focus, hover, and mobile/touch states when relevant.
10. **Limit choices.** Use constrained scales for spacing, type, color, radius, shadow, and icon style instead of one-off values.
11. **Verify ergonomics.** The page should be understandable above the fold, navigable by keyboard, readable on mobile, and free of decorative or explanatory filler.

Do not add landing-page hero copy, decorative cards, feature explanations, or onboarding tours unless the user's product context specifically calls for them.

---

## 4. Review Protocol

When reviewing a UI, route findings to focused skills and report in this structure:

1. **Current State Summary:** page type, primary user goal, dominant layout/pattern, and the most visually dominant element.
2. **Skill Routing:** list the focused `ui-*` skills used and why.
3. **Finding -> Recommendation Table:**

| # | Skill | Current | Issue | Recommendation | Why |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `ui-layouts` | Filters are inside the table card | Filters appear scoped to the card body | Move filters to a context bar above the table | Controls that affect the full result set should live above the content they refine |
| 2 | `ui-content` | Primary button says "Submit" | The outcome is vague | Rename to "Create Invoice" | Specific verbs reduce hesitation |
| 3 | `ui-responsive` | Row actions appear only on hover | Touch users cannot access them | Show primary action statically and move secondary actions to overflow | Touch interfaces need visible affordances |

4. **Implementation Priority:** name the 1-3 changes that would most improve usability.

Keep the review grounded in user tasks, not aesthetic preference.
