# Cowork inline→Tailwind mapping & token tables

Values below are from `cowork/tailwind.config.js` (the bridge) and
`cowork/src/renderer/cowork/styles/globals.css` (the resolved vars). Verify
they still hold if the config/globals change.

## Contents

- Property → utility mapping
- Spacing scale
- Type scale
- Radius
- Colors
- Keep inline
- Snap policy

## Property → utility mapping

Prefer a **token** (later sections) when the value maps exactly; otherwise an
**arbitrary** utility. Arbitrary values must contain **no spaces** — use `_`
for spaces and strip spaces inside `min()/calc()` (`min(520px,52vh)`).

| Inline | Utility |
| --- | --- |
| `display: flex/grid/inline-flex/inline-grid/block/none` | `flex` / `grid` / `inline-flex` / `inline-grid` / `block` / `hidden` |
| `flexDirection: column` | `flex-col` |
| `alignItems: center/flex-start/flex-end` | `items-center` / `items-start` / `items-end` |
| `justifyContent: center/space-between/flex-end/flex-start` | `justify-center` / `justify-between` / `justify-end` / `justify-start` |
| `flexWrap: wrap` · `flex: 1` · `flexShrink: 0` · `placeItems: center` | `flex-wrap` · `flex-1` · `shrink-0` · `place-items-center` |
| `gap/rowGap/columnGap: N` | `gap-*` / `gap-y-*` / `gap-x-*` (scale token if on-grid, else `gap-[Npx]`) |
| `padding/margin` (per side) | `p*/m*` per side (`padding:'14px 18px 0'` → `pt-[14px] px-[18px] pb-0`) |
| `width/height/min*/max*: N` | `w-[Npx]` etc. (component **dimensions** — keep arbitrary; not grid rhythm) |
| `maxHeight:'min(520px, 52vh)'` | `max-h-[min(520px,52vh)]` (drop the space) |
| `position/top/bottom/left/right/zIndex` | `absolute/relative/sticky/fixed` · `top-0`… · `z-[N]` |
| `overflow/overflowY: hidden/auto` | `overflow-hidden` / `overflow-auto` / `overflow-y-auto` |
| `whiteSpace:'pre-wrap'` · `wordBreak:'break-word'` · `userSelect:'text'` · `cursor:'pointer'` | `whitespace-pre-wrap` · `break-words` · `select-text` · `cursor-pointer` |
| `fontWeight: 500/600/700` · `'inherit'` | `font-medium` / `font-semibold` / `font-bold` · `font-[inherit]` |
| `letterSpacing:'Xem'` · `lineHeight:X` | `tracking-[Xem]` · `leading-[X]` (`1` → `leading-none`) |
| `textTransform:'uppercase'` · `textAlign:'left'/'center'` | `uppercase` · `text-left` / `text-center` |
| `fontFamily`: mono / `var(--font-sans)` / `inherit` | `font-mono` · `font-[var(--font-sans)]` · `font-[inherit]` |
| `WebkitBackdropFilter`+`backdropFilter:'blur(var(--surface-glass-blur))'` | `[backdrop-filter:blur(var(--surface-glass-blur))] [-webkit-backdrop-filter:blur(var(--surface-glass-blur))]` |
| `background:'none'` · `border:'none'/0` · `textDecoration:'underline'` | `[background:none]` · `border-0` · `underline` |
| anything else static | `[prop:value]` with `_` for spaces; if dynamic, keep inline |

## Spacing scale

`tailwind.config.js` binds `1–12` to `var(--space-*)`, which are **px-exact**
in globals.css. Map a value to a token only if it equals one of these:

| px | token | · | px | token |
| --- | --- | --- | --- | --- |
| 4 | `1` | | 24 | `6` |
| 8 | `2` | | 32 | `8` |
| 12 | `3` | | 40 | `10` |
| 16 | `4` | | 48 | `12` |
| 20 | `5` | | | |

So `gap-[8px]`→`gap-2`, `px-[16px]`→`px-4`, `pb-[4px]`→`pb-1`. **Off-scale**
values (2, 3, 6, 10, 14, 18, 26, 34, …) have no token — keep arbitrary in
passes 1–2 (they're candidates for the snap pass). There is no `1.5`/half step.

## Type scale

`fontSize` tokens resolve to `var(--text-*)` in globals.css (px-exact):

| px | token | px | token |
| --- | --- | --- | --- |
| 10 | `text-2xs` | 17 | `text-lg` |
| 11 | `text-xs` | 22 | `text-xl` |
| 12.5 | `text-sm` | 28 | `text-2xl` |
| 14 | `text-base` | 36 | `text-3xl` |
| 15 | `text-md` | | |

Exact only: `text-[12.5px]`→`text-sm`. Non-scale sizes (9.5, 10.5, 11.5, 12,
13, 13.5, 32, …) have no token — arbitrary in passes 1–2; snap candidates.
(Ignore the `detail`/`body`/`small` fontSize keys — those exist only for
verbatim mdb-ai ports; prefer the numbered scale.)

## Radius

`--card-radius: var(--r-12)` (12px) → `rounded-card`;
`--card-radius-row: var(--r-8)` (8px) → `rounded-card-row`. So `rounded-[8px]`
and `rounded-[12px]` are **exact** token matches. `6px` and others have none.

## Colors

`theme.extend.colors` keys → `text-/bg-/border-<key>`. Present:
`surface`, `surface-2`, `surface-3`, `ink`, `ink-2…5`, `line`, `line-2`,
`accent`, `accent-2/3`, `accent-bg`, `danger(+-bg/-border/-text)`,
`warning(+…)`, `info-bg/-border/-text`, `success(+…)`, and the semantic
aliases added for this migration: `muted`, `strong`, `surface-glass`,
`sage-500`. (Also `text-primary/secondary/faint`, `surface-01/02`,
`border-01/02` — these keys yield **doubled** utilities like `text-text-primary`;
avoid them for new work.)

Exact semantic equivalences (a var defined as another var):

| Inline var | Use |
| --- | --- |
| `var(--text-muted)` (= `var(--ink-3)`) | `text-muted` |
| `var(--text-strong)` (= `var(--ink)`) | `text-strong` |
| `var(--border-subtle)` (= `var(--line)`) | `border-line` |
| `var(--surface-glass)` | `bg-surface-glass` |
| `var(--sage-500)` | `text-sage-500` |
| `var(--ink)`, `var(--ink-3)`, `var(--line)`, `var(--surface-2)` … | `text-ink`, `text-ink-3`, `border-line`, `bg-surface-2` … |

**Adding a token to the config**: pick a color *key* that produces the utility
you want. Want `text-muted` → key `muted`. A key like `text-muted` would emit
`text-text-muted`. Only add tokens for vars used across surfaces; verify they
emit CSS (see SKILL verification step 3).

## Hover → `hover:` variant (convert these, don't leave inline)

JS hover handlers that only swap styling — `onMouseOver`/`onMouseOut`/`onMouseEnter`/`onMouseLeave` that mutate `e.currentTarget.style.*`, or a `useState` hover flag feeding a `hover ? A : B` style — should become Tailwind `hover:` utilities, and the handlers/state deleted. **Requirement:** the base value must move into `className` too (an inline `style` value always beats a `hover:` class, so a leftover inline base would never let the hover state show). Keep any non-styling work the handler also does (e.g. it sets state). Example: base `text-ink-3 bg-transparent` + `hover:text-ink hover:bg-surface-2`, handlers removed. Visually identical at rest and on hover, and it removes JS.

## Keep inline (do not convert)

- `mobile ? A : B` and any genuine prop/**app-state** ternary style (`railOpen`, `revealed`, `active`, `editing`, `busy`, `isZero`) — not hover; those can't be a CSS `:hover` variant.
- `color-mix(in srgb, ${jsVar} …)` and any JS-computed value.
- Conditional colors/opacity, `order`, invalid-state borders, animation whose
  name/value is conditional (`animation: x ? 'pulse …' : 'none'`).
- `style` on a **component** (`<Alert>`, `<Input>`, `<Button>`, `<Section>`)
  unless you've confirmed it spreads `className`. When unsure, leave it.

## Snap policy

Value-changing; approval-gated. Present candidates with deltas first.

- **Type scale** — snap to nearest `text-*` token when within ~0.5px:
  `9.5→text-2xs`, `11.5→text-xs`, `12→text-sm`, `13→text-sm`, `13.5→text-base`.
  On an exact tie (`10.5` between 10/11), ask which way (pilot chose up → `text-xs`).
- **Radius** — `rounded-[8px]`→`rounded-card-row` (exact); `rounded-[6px]`→
  `rounded-card-row` is a real **+2px** snap (approve separately).
- **Spacing half-steps** — 6/10/14/18px sit exactly between grid steps.
  Round-**half-up**: `6→2 (8)`, `10→3 (12)`, `14→4 (16)`, `18→5 (20)`, on
  **gap/padding/margin only**. Leave `1/2/3px` micro-gaps (icon+label optical
  spacing) and all **width/height** component dimensions (e.g. `34px` icon,
  `28px` button, `180px` nav) — those are intentional sizes, not rhythm.
