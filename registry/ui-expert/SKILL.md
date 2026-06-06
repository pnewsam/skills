---
name: ui-expert
description: Route broad UI, UX, page design, interaction, responsive, visual hierarchy, and frontend product-interface requests to the right ui-* skills. Use when designing or reviewing a full screen, page, app flow, design system decision, or when the needed UI skill is unclear. Coordinates ui-layouts, ui-patterns, ui-forms, ui-actions, ui-feedback, ui-content, ui-visual-hierarchy, ui-spacing, ui-typography, ui-color, ui-responsive, ui-icons, ui-data-viz, and ui-onboarding while avoiding overlap.
---

# UI Expert - Skill Router

Use this as the entry point for broad UI work. Your job is to identify the actual design problem, load only the focused `ui-*` skills needed, and produce or review UI that is intuitive, conventional, simple, and polished.

## Initial Response

When invoked without a specific request, respond only with:

> I'm ready to route the UI work. Tell me what you're designing or reviewing, who uses it, and what the user needs to accomplish.

Do not provide any other information until the user asks a question or presents a UI task.

---

## 1. Routing Table

Load the smallest set of focused skills that covers the task.

| User Need | Primary Skill | Secondary Skills |
| :--- | :--- | :--- |
| Whole page, screen, app shell, dashboard, settings page, landing page | `ui-layouts` | `ui-visual-hierarchy`, `ui-spacing`, `ui-responsive` |
| Collection display: table, list, cards, board, tabs, filters, pagination | `ui-patterns` | `ui-actions`, `ui-feedback`, `ui-responsive` |
| Create/edit/settings form, field choice, modal/drawer/page/wizard | `ui-forms` | `ui-content`, `ui-feedback`, `ui-actions` |
| Buttons, row actions, bulk actions, command palette, drag/drop, touch actions | `ui-actions` | `ui-icons`, `ui-feedback`, `ui-responsive` |
| Empty/loading/error/success states, toasts, banners, confirmations, undo | `ui-feedback` | `ui-content`, `ui-actions` |
| Button labels, empty state copy, errors, field help, terminology | `ui-content` | `ui-feedback`, `ui-forms` |
| What should stand out, scanning order, chunking, progressive disclosure | `ui-visual-hierarchy` | `ui-layouts`, `ui-typography`, `ui-spacing` |
| Gaps, padding, density, proximity, rhythm | `ui-spacing` | `ui-layouts`, `ui-visual-hierarchy` |
| Font sizes, heading hierarchy, readability, line length | `ui-typography` | `ui-visual-hierarchy`, `ui-spacing` |
| Palette, semantic tokens, dark mode, contrast, status colors | `ui-color` | `ui-feedback`, `ui-visual-hierarchy` |
| Mobile/tablet adaptation, breakpoints, touch targets, responsive nav | `ui-responsive` | `ui-layouts`, `ui-actions` |
| Icon selection, icon-only buttons, icon library consistency | `ui-icons` | `ui-actions`, `ui-content` |
| Charts, metrics, dashboards, choosing chart type vs number | `ui-data-viz` | `ui-layouts`, `ui-color` |
| First-run experience, activation, tours, checklists, sample data | `ui-onboarding` | `ui-feedback`, `ui-content`, `ui-layouts` |

If a request touches more than four rows, start with `ui-layouts`, `ui-visual-hierarchy`, and the one domain skill closest to the user's core task. Add more skills only when the work demands them.

---

## 2. Overlap Boundaries

Use these boundaries to prevent conflicting advice:

- `ui-layouts` owns page anatomy: app shell, page zones, chrome, standard page types, scroll regions.
- `ui-patterns` owns content patterns inside a page zone: tables, lists, cards, pagination, filtering, tabs, previews.
- `ui-forms` owns form containers and fields: modal vs drawer vs page, input type selection, settings forms, wizards.
- `ui-actions` owns how users trigger operations: action placement, overflow menus, bulk bars, shortcuts, drag/drop.
- `ui-feedback` owns system state: empty, loading, error, success, confirmation, undo.
- `ui-content` owns words: labels, messages, helper text, terminology, tone.
- `ui-visual-hierarchy` owns importance: what dominates, what recedes, scanning path, chunking.
- `ui-spacing`, `ui-typography`, and `ui-color` own the visual system details.
- `ui-responsive` owns adaptation across viewport and input mode.
- `ui-icons` owns icon semantics, consistency, and icon-only accessibility.
- `ui-data-viz` owns quantitative presentation and chart selection.
- `ui-onboarding` owns the path from first visit to user value.

When two skills overlap, decide by asking: "Is this about where the thing lives, what pattern the thing is, how the thing behaves, what state the thing is in, or how the thing is visually expressed?"

---

## 3. Build Protocol

When generating UI, follow this order before writing code:

1. **Name the user goal.** What is the primary job this screen or flow must support?
2. **Choose the page archetype.** Use `ui-layouts`: list/index, detail, form, dashboard, settings, marketing, utility.
3. **Inventory content and actions.** Separate primary content, secondary content, primary actions, secondary actions, and system states.
4. **Pick inner patterns.** Use `ui-patterns`, `ui-forms`, `ui-actions`, `ui-feedback`, or `ui-data-viz` for the dominant interaction.
5. **Establish hierarchy.** Use `ui-visual-hierarchy`: one primary focal point per context, clear secondary/tertiary treatment.
6. **Apply visual system rules.** Use spacing, typography, color, icons, and responsive guidance. Prefer the project's existing design system when present.
7. **Check state coverage.** Include empty, loading, error, success, disabled, focus, hover, and mobile/touch states when relevant.
8. **Verify ergonomics.** The page should be understandable above the fold, navigable by keyboard, readable on mobile, and free of decorative or explanatory filler.

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
