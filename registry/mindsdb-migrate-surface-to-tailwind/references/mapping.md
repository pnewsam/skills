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
- Preflight & cascade footguns
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
| `fontFamily`: mono / `var(--font-sans)` / `inherit` | `font-mono` · `font-[family-name:var(--font-sans)]` · `font-[inherit]` (the **`family-name:`** hint is required — see footguns) |
| `WebkitBackdropFilter`+`backdropFilter:'blur(var(--surface-glass-blur))'` | `[backdrop-filter:blur(var(--surface-glass-blur))] [-webkit-backdrop-filter:blur(var(--surface-glass-blur))]` |
| `border:'1px solid X'` | `border border-solid border-<X>` — **`border-solid` required** (see footguns) |
| `borderTop:'1px solid X'` (one side) | `border-t border-x-0 border-b-0 border-solid border-<X>` — **zero the other 3 sides** or they paint ~3px (see footguns) |
| `borderBottom:'1px solid X'` (one side) | `border-b border-t-0 border-x-0 border-solid border-<X>` |
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
`warning(+…)`, `info-bg/-border/-text`, `success(+…)`. (Also
`text-primary/secondary/faint`, `surface-01/02`, `border-01/02` — these keys
yield **doubled** utilities like `text-text-primary`; avoid them for new work.)

⚠️ **NOT yet in the config** (verified on `staging` 2026-08-12): `muted`,
`strong`, `surface-glass`, `sage-500`. These aliases were in the **closed** PR
#588 and never merged; their addition is deferred to **ENG-1381**. The CSS
*vars* exist in globals.css, but the *utilities* (`text-muted`, `text-strong`,
`bg-surface-glass`, `text-sage-500`) do **not** — emitting them now produces an
undefined class that Tailwind silently drops (preflight off) → invisible
styling. **Keep `[var(--text-muted)]` etc. arbitrary until ENG-1381 lands the
config token.** Re-verify this list against `tailwind.config.js` before relying
on it.

Exact semantic equivalences (a var defined as another var):

| Inline var | Use |
| --- | --- |
| `var(--border-subtle)` (= `var(--line)`) | `border-line` ✅ live |
| `var(--ink)`, `var(--ink-3)`, `var(--line)`, `var(--surface-2)` … | `text-ink`, `text-ink-3`, `border-line`, `bg-surface-2` … ✅ live |
| `var(--text-muted)` (= `var(--ink-3)`) | `text-muted` — ⚠️ pending ENG-1381; keep arbitrary (or use `text-ink-3` directly) |
| `var(--text-strong)` (= `var(--ink)`) | `text-strong` — ⚠️ pending ENG-1381; keep arbitrary (or use `text-ink` directly) |
| `var(--surface-glass)` | `bg-surface-glass` — ⚠️ pending ENG-1381; keep arbitrary |
| `var(--sage-500)` | `text-sage-500` — ⚠️ pending ENG-1381; keep arbitrary |

**Adding a token to the config**: pick a color *key* that produces the utility
you want. Want `text-muted` → key `muted`. A key like `text-muted` would emit
`text-text-muted`. Only add tokens for vars used across surfaces; verify they
emit CSS (see SKILL verification step 3).

## Hover → `hover:` variant (convert these, don't leave inline)

JS hover handlers that only swap styling — `onMouseOver`/`onMouseOut`/`onMouseEnter`/`onMouseLeave` that mutate `e.currentTarget.style.*`, or a `useState` hover flag feeding a `hover ? A : B` style — should become Tailwind `hover:` utilities, and the handlers/state deleted. **Requirement:** the base value must move into `className` too (an inline `style` value always beats a `hover:` class, so a leftover inline base would never let the hover state show). Keep any non-styling work the handler also does (e.g. it sets state). Example: base `text-ink-3 bg-transparent` + `hover:text-ink hover:bg-surface-2`, handlers removed. Visually identical at rest and on hover, and it removes JS.

## Preflight & cascade footguns (these closed real PRs — check every pass)

Preflight is **off** (no global reset, no `border-style` reset) and `globals.css` is imported **after** `tailwind.css` with its component classes **unlayered**. Three failure modes recur:

1. **Borders — two opposite failure modes, both from preflight-off (no `border-width:0` reset).** Every converted solid border needs **`border-solid`** (bare `border`/`border-t` sets only *width* → `border-style` stays `none` → nothing paints; `border-dashed`/`border-dotted` self-declare a style and are fine). *(Settings PR closed over 17 borders that vanished.)* **BUT** a **directional** width + all-sides `border-solid` is *also* a bug: the other three sides are now styled-but-unwidthed → they fall back to the initial `medium` (~3px) and paint a full box (ENG-1017 / #617 — Skills List rows rendered boxed). So a one-side border **must zero the other three**: `borderTop` → **`border-t border-x-0 border-b-0 border-solid border-<X>`**; `borderBottom` → **`border-b border-t-0 border-x-0 border-solid border-<X>`**. Full 4-side border is just `border border-solid border-<X>`. Sweep: every `border-[tblr]`-with-`border-solid` must carry the sibling zeroing utilities.
2. **Unlayered globals win specificity ties.** If an element carries a `globals.css` component class (`.recent-item`, `.menu`, `.menu-item`, `.send-btn`, `.btn`, `.icon-btn`, `.nav-item`, `.meta-pill`, `.anton-sidebar__*`, …), any property that class **already declares** cannot move to a plain utility — the utility loses the tie and the value silently reverts to the class's. **Grep the class body in globals.css first**; if it sets the property, keep that property **inline** (an inline `style` beats the stylesheet). Regressions seen: `.anton-sidebar__chrome-left {gap:14px}` vs `gap-1` (gap jumped 4→14px); `.recent-item {height:26px; padding:0 10px}` vs `h-auto px-3 py-1` (rows clipped to 26px, vertical padding lost).
3. **`font-family` arbitraries need a type hint.** `font-[var(--font-body)]` is ambiguous → Tailwind emits **no** `font-family`. Write `font-[family-name:var(--font-body)]`. Because the inline `fontFamily`/`FONT_*` consts are deleted in the same edit, the un-hinted form silently drops the font to inherited across the whole surface.

## Keep inline (do not convert)

- `mobile ? A : B` and any genuine prop/**app-state** ternary style (`railOpen`, `revealed`, `active`, `editing`, `busy`, `isZero`) — not hover; those can't be a CSS `:hover` variant.
- Any property the element's **`globals.css` component class already declares** (footgun 2) — moving it to a utility loses the cascade tie.
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
