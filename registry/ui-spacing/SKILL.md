---
name: ui-spacing
description: Spacing objectives (scale conformance, proximity, density) plus a runnable scale-conformance lint. Use when applying or auditing UI spacing. Enforce on-scale spacing with scripts/check_spacing.py; let the model apply proximity and density judgment. For page zones see ui-layouts; for type rhythm see ui-typography.
---

# UI Spacing — Objectives + Ground-Truth Check

Converted reference: the one mechanical, non-negotiable rule (every gap lands on
the scale) becomes a runnable lint; the judgment (proximity, rhythm, density)
stays as objectives the model applies.

## The check (deterministic)

Off-scale spacing is measurable, so lint for it instead of eyeballing pixels.
The bundled checker flags any `margin`/`padding`/`gap`/inset/offset value — CSS
or Tailwind arbitrary utilities like `p-[13px]` — that isn't on the scale, with
the nearest on-scale value:

```
python3 scripts/check_spacing.py src/**/*.css              # multiples of 4px (default)
python3 scripts/check_spacing.py --allowed 0,4,8,12,16,24,32,48,64 App.tsx
cat Component.tsx | python3 scripts/check_spacing.py -      # nonzero exit if any off-scale
```

Treat every off-scale value as a defect: snap `13px→12px`, `18px→16px`. "It
looked better" is not a reason to leave a value off the grid.

## The objectives (what "good spacing" satisfies)

State these as requirements; the model applies them:

- **On the scale.** All spacing comes from one scale (4px base is the common
  default); arbitrary values are the enemy — verified by the check.
- **Proximity reflects relationship.** Related elements sit closer than
  unrelated ones; equal spacing everywhere destroys grouping. The test: if you
  ask "which of these go together?", the answer should match the spacing.
- **Consistent rhythm.** The same gap between peers at the same level; the
  largest gaps separate the most distinct zones.
- **Density fits the context.** Compact for data-dense/expert views, comfortable
  for most UIs, spacious for browsing; offer a toggle when one view serves both.
- **Negative space is active** — it groups and emphasizes; prefer it over
  dividers once gaps are ≥24px.

## Defer to the model (specify intent, then verify)

Per-context spacing values (forms, tables, cards, lists, buttons, page zones)
are well-trodden; a capable model produces sensible defaults. Give it the intent
— product density, platform, grouping — let it lay out, then run the lint to
confirm everything is on the grid. Do not hand-maintain per-context pixel tables
here.

## Handoff

Page-level zone arrangement → `ui-layouts`. Typographic vertical rhythm
(line-height, heading-to-body) → `ui-typography`.
