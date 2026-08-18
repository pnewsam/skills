---
name: ui-expert
description: Thin index for UI/UX work after the bitter-lesson rebalance. Routes to the few surviving UI skills that carry non-derivable value — ui-patterns (collection completeness), ui-color and ui-spacing (runnable checks), design-explore (visual direction), analyze-design-system (audit) — and otherwise tells you the base model handles the interface work directly. Use for a full screen or flow, or when unsure which surviving skill applies.
---

# UI Expert — Survivor Index

The `ui-*` prose family (layouts, forms, actions, feedback, content, typography,
icons, depth, responsive, onboarding, email, visual-hierarchy) was evicted on
2026-08-17 after a family A/B showed the base model produces equal-quality UI on
those concerns unaided (`evals/results/2026-08-17-ui-family.md`). Build and review
those directly — sensible layout, field choice, action placement, empty/error
states, labels, type hierarchy, icon use, responsive adaptation are all native
capability now. This index exists only to route the handful of concerns where a
skill still earns its keep.

## Route to a surviving skill

| Concern | Skill | Why it survived |
| :--- | :--- | :--- |
| Displaying a data collection at scale — table vs cards vs list, and the filter/search/pagination/density/empty completeness a large collection needs | `ui-patterns` | The base model picks the right container but reliably omits scale-completeness; kept as a slim objective. |
| Palette, semantic tokens, dark mode, **contrast** | `ui-color` | Bundles a runnable WCAG contrast check — ground truth, not taste. |
| Gaps, padding, density, **scale conformance** | `ui-spacing` | Bundles a runnable scale-conformance lint. |
| Open visual direction, mood, "make it feel less generic" | `design-explore` | Generate-N-directions-and-judge beats prescribing taste. |
| Repository-wide design-system drift, consolidation, pattern audit | `analyze-design-system` | Measurement/audit workflow — value rises with model capability. |

Go straight to the one skill that matches. If a request is just "build/critique this
screen," do it directly and pull in `ui-patterns` only when a sizeable collection is
involved, `ui-color`/`ui-spacing` to verify tokens, and `design-explore` when the
open question is visual direction rather than a functional pattern.

## Build order (unchanged principles, no prose dependency)

1. Name the concrete feature and the user's primary goal.
2. Inventory primary/secondary content and actions and the system states.
3. Establish hierarchy before styling — the screen should work in grayscale.
4. For a data collection, apply `ui-patterns`' completeness checklist.
5. Verify tokens with `ui-color` (contrast) and `ui-spacing` (scale); route open
   visual direction to `design-explore`.
6. Cover empty, loading, error, success, disabled, focus, hover, and touch states.
7. Keep to constrained scales; understandable above the fold, keyboard-navigable,
   readable on mobile, free of decorative filler.
