# Measurement contract

State this contract in every posted report so each week is comparable and no
count is mistaken for a defect. The scanner (`scripts/scan.mjs`) encodes the
scope, groups, and exclusions; this file records what the numbers mean, what
they do not mean, and which sub-ticket owns each signal.

## Contents

- Contract fields
- Signal-to-ticket map
- What each signal means
- Adoption ratios and inventory
- Convergence Index
- Interpretation rules

## Contract fields

| Field | Value |
| --- | --- |
| Revision and scope | Git short commit + the configured scope (default `cowork` `src/renderer`). |
| Eligible population | `.tsx`/`.jsx` components for component signals, ratios, and inventory; `.css` added for color, token-fallback, `!important`, mono-font, and glow signals. |
| Counting units | Occurrences for drift signals; canonical vs raw element **uses** for ratios; component **uses** for inventory; **lines** for legacy footprint. Never mix units in one ratio. |
| Exclusions | Token-definition CSS (`styles/globals.css`, `skin-8bit.css`, `tailwind.css`) for value/`!important`/glow/mono counts; the primitive library (`components/ui`) for element, tooltip, dialog, ratio, and inventory counts; `node_modules`, build output, `public`, dotfolders. |
| Method | Static regex scan over eligible files, repeatable with `node scan.mjs`. |
| Window | Current revision vs the previous posted snapshot — read from the last comment's collapsed `design-metrics-snapshot` block (a fenced JSON payload inside a `<details>`). |
| Confidence | Medium. Static text scan only; it does not observe runtime styling, theming, or dynamically composed class names. |

## Signal-to-ticket map

Each row in the report is keyed to the ENG-641 sub-ticket that owns the work.

| Group | Signal | Ticket |
| --- | --- | --- |
| Styling | Inline `style={{…}}` | ENG-1017 |
| Styling | Raw color literals (hex / rgb / hsl) | ENG-637 |
| Styling | Hex fallbacks in `var(--token, #hex)` | ENG-1153 |
| Styling | Raw `px` values | ENG-637 |
| Styling | Tailwind arbitrary values `-[…]` | ENG-1017 |
| Styling | `!important` overrides | ENG-1020 |
| Interaction | JS hover handlers (`onMouse*`) | ENG-641 |
| Interaction | Native `title=` tooltips → ui/Tooltip | ENG-1152 |
| Interaction | Bespoke `role="dialog"` → ui/Modal | ENG-1014 |
| Typography/icons | Mono-font usage | ENG-636 |
| Typography/icons | Off-brand fonts (regression guard) | ENG-635 |
| Typography/icons | Inline `<svg>` icons | ENG-634 |
| Typography/icons | Local icon-module imports | ENG-634 |
| Effects | Glow effects | ENG-638 |
| Adoption ratios | Button / Input / Textarea / Select / Checkbox | ENG-936 / 1015 / 794 / 1040 |
| Inventory | Alert, Badge, Card, Menu, Modal, Switch, ToggleGroup, Tooltip, … | ENG-639 (+ per-primitive tickets) |
| Legacy | `globals.css` + `styles.css` line count | ENG-1020 |

## What each signal means

- **Inline `style={{…}}`** — JSX inline-style objects Tailwind utilities or
  token classes should usually replace. Some (computed geometry, animation
  values) are legitimate.
- **Raw color / raw `px`** — palette and dimension literals outside the token
  CSS; candidates for `--ink`/`--surface`/`--space-*`/`--r-*` tokens.
- **Hex fallbacks in `var()`** — `var(--token, #hex)` second arguments; a
  hardcoded value shadowing the token, the exact pattern ENG-1153 removes.
- **Tailwind arbitrary values** — `w-[137px]`, `bg-[#fff]` etc. bypass the token
  scale even while using Tailwind. Some (`max-h-[80vh]`) are legitimate; treat
  as candidates, not defects.
- **`!important`** — override smell outside the token monolith; corroborates
  specificity churn during migration.
- **JS hover handlers** — `onMouse*` a CSS `:hover`/`group-hover` state can
  usually express more simply. Handlers driving real logic are not violations.
- **Native `title=`** — browser tooltips ENG-1152 replaces with ui/Tooltip for
  consistent, accessible behavior. Includes some non-interactive uses.
- **Bespoke `role="dialog"`** — dialog markup outside ui/Modal; the remaining
  tail of the modal sweep.
- **Mono-font usage** — `font-mono` and mono family references ENG-636 reduces.
- **Off-brand fonts** — Josefin Sans and similar; target 0. A rising count is a
  regression of ENG-635, not new work.
- **Inline `<svg>` / local icon imports** — the current hand-rolled icon
  surface. Both should fall as ENG-634 consolidates onto one icon library; add
  that library's import as an "up" signal once chosen.
- **Glow effects** — `--glow`, `text-shadow`, `drop-shadow` ENG-638 removes from
  markdown and chrome.

## Adoption ratios and inventory

- **Ratios** — canonical component uses / (canonical + raw element uses), per
  family with a clean raw HTML equivalent. Rising adoption is the convergence
  signal; the raw count is the remaining work.
- **Inventory** — usage counts for primitives without a raw HTML equivalent
  (Alert, Modal, Menu, Switch, …). Rising total = broader adoption. A primitive
  stuck at 0 is defined but unadopted — an inspection candidate, not a defect.
- **Legacy footprint** — line count of the CSS monolith and legacy stylesheet.
  A falling count is the ENG-1020 retirement signal.

## Convergence Index

A single 0–100 progress number, provided for at-a-glance tracking. It is
deliberately **decomposable and repo-relative**, not an absolute quality grade —
report it with its two sub-scores visible, never on its own.

```text
Convergence Index = mean(Component adoption, Style-hygiene progress)
```

- **Component adoption (0–100)** — one unified canonical share:

  ```text
  Σ canonical uses (Button, Input, Select, Textarea, Checkbox, Tooltip, Modal)
  ---------------------------------------------------------------------------
  Σ canonical + Σ raw equivalents (…, native title=, bespoke role="dialog")
  ```

  A true ratio needing no baseline. It rolls up every sweep with a raw
  counterpart into one adoption rate.

- **Style-hygiene progress (0–100)** — mean, over the drift signals, of the
  reduction from the fixed epic day-zero anchor toward zero:

  ```text
  mean over drift signals of  clamp[0,1]( (anchor_count - current_count) / anchor_count )  × 100
  ```

  The anchor is the day-zero occurrence set stored in `scan.mjs` (`config.anchor`),
  so the score measures cumulative progress, not weekly wobble. Per-signal terms
  are clamped to `[0,1]`: a regression scores 0 for that signal rather than
  dragging the mean negative (the signal's own row still shows the ▲ regression).
  `native_title` and `bespoke_dialogs` are excluded here because they already
  feed the adoption sub-score.

Both sub-scores and this formula must stay visible in the report. Do not add
weights, hidden signals, or a second composite without recording the change
here. Re-base the anchor only deliberately, and say so when you do.

## Interpretation rules

- A count is a candidate, never a proven defect. Inspect representative files
  before asserting a signal reflects real fragmentation.
- Prefer the trend over the absolute value. A repository-relative decrease week
  over week is the evidence of progress, not any universal threshold.
- Never combine incomparable signals into one headline score. Each family stays
  on its own line under its group.
- If the scope changes, change `--config`; do not let a wider scope silently
  inflate or deflate a trend established on a narrower one.
- When the ENG-1016 lint/CI guardrail lands, reconcile roles: the guardrail
  prevents regressions at merge time; this tracker measures the trend. Align the
  definitions so a signal the guardrail blocks matches the signal counted here.
