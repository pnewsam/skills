#!/usr/bin/env node
// Read-only inventory for the Cowork inline→Tailwind migration.
// Usage: node inventory.mjs <file.jsx> [file2.jsx ...]
//
// Prints, per the given files combined:
//   - count of remaining inline `style={{` objects
//   - arbitrary Tailwind utilities bucketed into:
//       EXACT   — a token maps to this value exactly (convert in pass 2)
//       SNAP    — near a token (candidate for the approval-gated pass 3)
//       KEEP    — no token; correctly stays arbitrary
// Nothing is written. This only classifies; it does not edit.

import { readFileSync } from 'node:fs';

const files = process.argv.slice(2);
if (!files.length) {
  console.error('usage: node inventory.mjs <file.jsx> [more...]');
  process.exit(2);
}
const src = files.map((f) => readFileSync(f, 'utf8')).join('\n');

// --- token tables (keep in sync with references/mapping.md) ---
const SPACE = { 4: '1', 8: '2', 12: '3', 16: '4', 20: '5', 24: '6', 32: '8', 40: '10', 48: '12' };
const SPACE_SNAP = { 6: '2', 10: '3', 14: '4', 18: '5' }; // half-steps, round-half-up
const FONT = { 10: '2xs', 11: 'xs', 12.5: 'sm', 14: 'base', 15: 'md', 17: 'lg', 22: 'xl', 28: '2xl', 36: '3xl' };
const FONT_PTS = Object.keys(FONT).map(Number);
const RADIUS = { 8: 'card-row', 12: 'card' };
// Only vars whose Tailwind utility is actually defined in tailwind.config.js today.
// `border-subtle` → `border-line` is the only live color equivalence on staging.
const COLOR_VAR = {
  'border-subtle': 'border-line',
};
// These vars exist in globals.css but have NO matching config utility yet — the
// tokens were in the closed PR #588 and their addition is deferred to ENG-1381.
// Converting to the bare utility now emits an UNDEFINED class that Tailwind
// silently drops (preflight off) → invisible styling. Keep arbitrary until the
// config token lands. Re-verify against tailwind.config.js if ENG-1381 merges.
const COLOR_VAR_PENDING = {
  'text-muted': 'text-muted', 'text-strong': 'text-strong',
  'surface-glass': 'bg-surface-glass', 'sage-500': 'text-sage-500',
};

const buckets = { EXACT: new Map(), SNAP: new Map(), KEEP: new Map() };
const add = (b, from, to) => {
  const k = `${from}  →  ${to}`;
  buckets[b].set(k, (buckets[b].get(k) || 0) + 1);
};

// spacing / dimension utilities: prefix-[Npx]
const SPACE_PREFIXES = /\b(gap|gap-x|gap-y|p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr)-\[(\d+(?:\.\d+)?)px\]/g;
for (const m of src.matchAll(SPACE_PREFIXES)) {
  const [, pre, nStr] = m; const n = Number(nStr); const cls = `${pre}-[${nStr}px]`;
  const isSpacing = /^(gap|gap-x|gap-y|p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr)$/.test(pre);
  if (SPACE[n]) add('EXACT', cls, `${pre}-${SPACE[n]}`);
  else if (isSpacing && SPACE_SNAP[n]) add('SNAP', cls, `${pre}-${SPACE_SNAP[n]} (round-half-up ${n}→${n === 6 ? 8 : n === 10 ? 12 : n === 14 ? 16 : 20}px)`);
  else add('KEEP', cls, 'no token (off-scale / dimension)');
}

// font sizes: text-[Npx]
for (const m of src.matchAll(/\btext-\[(\d+(?:\.\d+)?)px\]/g)) {
  const nStr = m[1]; const n = Number(nStr); const cls = `text-[${nStr}px]`;
  if (FONT[n] != null) add('EXACT', cls, `text-${FONT[n]}`);
  else {
    const near = FONT_PTS.reduce((a, b) => (Math.abs(b - n) < Math.abs(a - n) ? b : a));
    if (Math.abs(near - n) <= 0.5) add('SNAP', cls, `text-${FONT[near]} (${n}→${near}px)`);
    else add('KEEP', cls, 'no token');
  }
}

// radius: rounded-[Npx]
for (const m of src.matchAll(/\brounded-\[(\d+(?:\.\d+)?)px\]/g)) {
  const nStr = m[1]; const n = Number(nStr); const cls = `rounded-[${nStr}px]`;
  if (RADIUS[n]) add('EXACT', cls, `rounded-${RADIUS[n]}`);
  else if (n === 6) add('SNAP', cls, 'rounded-card-row (6→8px, +2)');
  else add('KEEP', cls, 'no token');
}

// arbitrary color vars: (text|bg|border)-[var(--x)]
for (const m of src.matchAll(/\b(text|bg|border)-\[var\(--([a-z0-9-]+)\)\]/g)) {
  const cls = `${m[1]}-[var(--${m[2]})]`;
  if (COLOR_VAR[m[2]]) add('EXACT', cls, COLOR_VAR[m[2]]);
  else if (COLOR_VAR_PENDING[m[2]]) add('KEEP', cls, `${COLOR_VAR_PENDING[m[2]]} — token NOT in config yet; add via ENG-1381 before converting`);
  else add('KEEP', cls, 'semantic var — keep, or add a config token');
}

const styleCount = (src.match(/style=\{\{/g) || []).length;
console.log(`\nFiles: ${files.length}   inline style={{ objects remaining: ${styleCount}\n`);
for (const b of ['EXACT', 'SNAP', 'KEEP']) {
  const entries = [...buckets[b].entries()].sort((a, z) => z[1] - a[1]);
  const total = entries.reduce((s, [, c]) => s + c, 0);
  const note = b === 'EXACT' ? 'convert in pass 2 (pixel-identical)'
    : b === 'SNAP' ? 'pass 3 candidates (value-changing, approval-gated)'
    : 'correctly stays arbitrary';
  console.log(`── ${b}  (${total})  — ${note}`);
  for (const [k, c] of entries) console.log(`   ${String(c).padStart(3)}  ${k}`);
  console.log('');
}
