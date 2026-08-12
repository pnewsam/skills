---
name: mindsdb-migrate-surface-to-tailwind
description: Migrate one MindsHub Cowork UI surface's inline styles to Tailwind, adopt design tokens, and optionally snap near-scale values onto the grid — as three separately-committed passes on a draft PR. Use for the ENG-1017 phased per-surface inline→Tailwind migration, or when asked to convert a component/view's inline `style={{…}}` to Tailwind classes, replace arbitrary `[Npx]`/`[var(--…)]` utilities with tokens, or normalize drifted pixel/type values onto the design system. Scoped to one surface per PR. Preserves behavior in passes 1–2; pass 3 changes pixels and requires explicit approval. Writes code, may add tokens to tailwind.config.js, commits locally, and opens a draft PR against staging; it does not merge.
---

# Migrate a Cowork surface to Tailwind

## Outcome

One UI surface (a view + its section components) converted from inline `style={{…}}` to Tailwind utilities, on a draft PR against `staging`, delivered as up to three separately-reviewable commits:

1. **Convert** — behavior-preserving inline→Tailwind (pixel-identical).
2. **Tokens** — swap arbitrary utilities for real tokens where the value maps exactly (pixel-identical).
3. **Snap** — *optional, value-changing, approval-gated* — snap near-scale values onto the grid.

Stop after opening (or updating) the draft PR. Do not merge.

## Use / do not use

- **Use** for the ENG-1017 phased migration, one surface at a time, or any "convert this view's inline styles to Tailwind / use tokens / snap to the scale" request in `cowork/`.
- **Do not use** to build the design system itself (that is ENG-641 / the shared primitives) or to restyle a surface. This changes the *mechanism*, not the look — except pass 3, which only snaps to the existing scale.
- Pair with `analyze-design-system` (to pick which surface) and `mindsdb-track-design-system-metrics` (to record the drop in arbitrary-value density).

## Modes and effects

`preview (inventory) -> pass 1 commit -> pass 2 commit -> [approval] -> pass 3 commit -> push -> draft PR`

Completion of one stage never authorizes the next. Passes 1–2 are pixel-preserving. **Pass 3 changes rendered sizes** and runs only on explicit approval. Adding tokens to `tailwind.config.js` (pass 2) is an additive shared-config change — call it out.

## Inputs and preconditions

- Repo: `cowork/` (Electron+Vite+React+Tailwind). Node 20 on PATH (`PATH="/opt/homebrew/opt/node@20/bin:$PATH"`).
- **Tailwind preflight is disabled** (`tailwind.config.js`) — utilities are additive, no global reset. This is why the surfaces are inline-styled, but it has footguns that have **closed PRs**: a bare border utility renders **no border** (`border-style:none`), unlayered `globals.css` component classes **win specificity ties** against utilities, and `font-[var(--…)]` without a `family-name:` hint drops `font-family`. Read the **Preflight & cascade footguns** section of `references/mapping.md` before converting.
- The token bridge lives in `tailwind.config.js`; the resolved values live in `src/renderer/cowork/styles/globals.css`. The exact tables and the full style→class mapping are in **`references/mapping.md`** — read it before converting.
- A surface = one `views/**/XView.jsx` plus its co-located section components. One surface per PR.

## Workflow

### 0. Inventory the surface

Run `node scripts/inventory.mjs <file...>` to get: the `style={{` count, and a histogram of arbitrary utilities bucketed into **EXACT token available**, **SNAP candidate**, and **no token (keep arbitrary)**. This is the worklist. Also skim the files so you can tell dynamic objects from static ones.

**Repo-wide baseline / picking a surface.** The renderer is **`.jsx`, not `.tsx`** — a `git grep -- 'src/renderer/**/*.tsx'` pathspec silently matches almost nothing (git doesn't expand `**` without `:(glob)`, and it's the wrong extension); scan with a plain dir pathspec: `git grep -c 'style={{' origin/staging -- 'src/renderer/cowork'`. As of 2026-08-12 the original ENG-1017 queue (the top-8 surfaces) is **merged**, but it was never the whole job: **~610 raw inline `style={{}}` across ~69 un-queued `.jsx` files remain** (plus ~150 arbitrary utilities to tokenize/snap). Bucket un-queued work by feature area (views, then `components/<area>/`), one surface per PR. Raw counts mix static (migratable) and dynamic (keep) — the static/dynamic split still needs a per-file skim; inventory.mjs counts objects and classifies only the already-arbitrary utilities.

Open a tracking issue under **ENG-1017** (`create-issue`), branch off `staging` (or off the prior stacked PR's branch if this surface builds on unmerged work), and name it `paul/eng-<n>-<surface>-tailwind`.

### 1. Convert (pixel-preserving)

Convert **static** style objects to `className`; keep **dynamic** ones inline. An element may carry both a `className` and a trimmed `style`. Per `references/mapping.md`: use a token where the value maps exactly, arbitrary `[…]` where it doesn't.

**Convert JS hover to `hover:` variants** — `onMouseOver`/`onMouseOut`/`onMouseEnter`/`onMouseLeave` that only swap styling (or a `useState` hover flag feeding a style ternary) become `hover:` utilities with the base value in `className`; delete the handlers/state. See `references/mapping.md`.

**Leave inline** (do not force to classes):

- `mobile ? A : B` (or any genuine **app-state**) layout/style ternaries — `railOpen`, `revealed`, `active`, `editing`, `busy`,
- `color-mix(… ${jsVar} …)` templates and any JS-computed value,
- conditional colors/opacity, and transitions whose value is conditional,
- `style` passed to a **component** unless you've confirmed it forwards `className`.

Guardrails: append to an existing `className`, never emit two; arbitrary values contain **no spaces** (`_` for spaces, strip spaces inside `min()/calc()`); don't delete a `const` that's still referenced. **Footguns (mapping.md):** emit `border-solid` on every converted solid border (bare `border` is invisible under preflight-off); write `font-family` as `font-[family-name:var(--…)]`; before moving a property onto an element that carries a `globals.css` component class, grep that class — if it declares the property, keep it inline (the utility loses the tie). Commit: `refactor(<surface>): migrate inline styles to Tailwind`.

### 2. Tokens (pixel-preserving)

Swap arbitrary utilities for tokens **only where the value maps exactly** (tables in `references/mapping.md`): on-scale spacing (4/8/12/16/20/24/32/40/48px), exact font sizes (10/11/12.5/14/15/17/22/28/36px), and colors. When a semantic var aliases an existing token, use it (`var(--border-subtle)` → `border-line`). When a pervasive semantic var has **no** clean utility, add it to `tailwind.config.js` **choosing a color key that produces the intended utility** — key `muted` → `text-muted` (NOT key `text-muted`, which yields `text-text-muted`). Off-scale/non-scale values stay arbitrary. Commit: `refactor(<surface>): prefer design tokens over arbitrary values where they map`.

### 3. Snap to grid — optional, approval-gated, value-changing

Only after the user explicitly approves snapping. Present the candidate list (with deltas) from the Snap policy section of `references/mapping.md` and confirm scope. Then:

- **Type scale** (≤0.5px): snap to nearest `text-*` token; on an exact tie, ask which way.
- **Radius**: `rounded-[8px]`→`rounded-card-row` (exact); `rounded-[6px]`→`rounded-card-row` only if approved (+2px).
- **Spacing half-steps** (6/10/14/18px), round-half-up → 8/12/16/20, on gap/padding/margin **only**. Leave micro-gaps (1/2/3px) and **component dimensions** (icon/button/panel widths & heights) — those are deliberate sizes, not grid rhythm.

Commit: `refactor(<surface>): snap near-scale values onto the design grid`, and list the deltas in the body.

## Safety and idempotency

Reruns are safe: the inventory script is read-only and each pass only rewrites class strings. Never force-push or amend a pushed commit — add a new commit. Never stage unrelated files (e.g. a stray `.worktrees/`).

## Verification

Before claiming a pass is done, from `cowork/` with the Node 20 PATH:

1. `npm run typecheck` — clean.
2. `npx vitest run <surface test dir>` — the surface's colocated tests pass (Cowork colocates `*.test.jsx`; e.g. `src/renderer/cowork/views/settings/`).
3. `npm run build:web` — the renderer bundle builds. **If pass 2 added config tokens, grep the emitted CSS** (`dist/renderer-web/assets/*.css`) to confirm each new token class exists (e.g. `.text-muted{color:var(--text-muted)}`) — Tailwind silently omits unknown classes, so this is the only proof they resolve.
4. Integrity: no element with two `className`; `node scripts/inventory.mjs` shows zero EXACT-token arbitraries remaining after pass 2 (and zero SNAP candidates after pass 3).
5. **Footgun sweep** (grep the surface): every `border`/`border-[tblrxy]` width utility has a sibling `border-solid`/`border-dashed`; no `font-[var(--font-…)]` missing the `family-name:` hint; nothing moved to a utility on an element whose `globals.css` class already sets that property. Typecheck/build passing does **not** prove pixels — **drive the surface and look** (the `run` skill / `npm run dev`), especially for pass 3. Never label a snap screenshot "no change": snapping changes rendered sizes by definition.

## Output contract

A draft PR on `staging` (via `prepare-pr`/`gh`, `--draft`), body per `pr-conventions`, linking the ENG-1017 child issue. State per-pass what changed and the validation results. Flag: pass 3 as **intentional pixel changes** (offer before/after screenshots — the app is Electron; run via the `run` skill or `npm run dev`), the `tailwind.config.js` change for reviewers, and any **stacking** (which PR must merge first). List what was deliberately left inline (dynamic) and left arbitrary (off-scale), so coverage reads honestly.
