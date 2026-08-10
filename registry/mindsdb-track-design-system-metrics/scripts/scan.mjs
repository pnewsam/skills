#!/usr/bin/env node
//
// Design-system convergence scanner (ENG-641).
//
// Emits reproducible, repository-relative counts for a configured UI scope,
// grouped by the epic's tracks. Counts LOCATE convergence candidates; they do
// not prove the UI is wrong. Token definitions and primitive internals are
// excluded so the numbers track real drift, not the design system defining
// itself.
//
// Usage:
//   node scan.mjs --repo <path>                 # print JSON snapshot (default)
//   node scan.mjs --repo <path> --markdown      # print Linear-ready comment
//   node scan.mjs --repo <path> --markdown \
//       --baseline <file|->                     # comment with week-over-week deltas
//   node scan.mjs --repo <path> --config c.json # override the default scope
//
// --baseline accepts a snapshot file, "-" for stdin, or the prior Linear
// comment (the embedded `design-metrics-snapshot` marker is extracted). The
// Linear thread is the history — nothing is written to the repo.
//
// Zero dependencies. Node 16+.

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const COMP = ['.tsx', '.jsx'];
const CSS = ['.css'];

// ---------------------------------------------------------------------------
// Default scope: the cowork renderer (the active ENG-641 migration target).
// Each signal cites the sub-ticket that owns the convergence work.
// Override any of this with --config <file>.
// ---------------------------------------------------------------------------
const DEFAULT_CONFIG = {
  scope: 'src/renderer',
  excludeDirs: ['node_modules', 'dist', 'build', 'coverage', '.next', 'public'],
  // Paths inside the scope that are NOT part of this design system, so they must
  // not inflate its drift counts. `pages/arcade` is the standalone 8-bit arcade
  // surface — it has its own aesthetic and token set (`skin-8bit.css`) and is
  // measured separately, not against cowork primitives (ENG-641 audit 2026-08-10).
  excludePaths: ['pages/arcade'],
  // Non-product files: tests/stories are not shipped UI and must not be counted.
  excludeFileMatch: ['.test.', '.spec.', '.stories.'],
  // CSS where raw color/px values DEFINE the system — not violations.
  tokenSources: [
    'cowork/styles/globals.css',
    'cowork/styles/skin-8bit.css',
    'cowork/styles/tailwind.css',
  ],
  // The primitive library. Raw elements / inventory usages here are internal.
  primitiveDir: 'cowork/components/ui',

  // Grouped count signals. polarity 'down' = fewer is better.
  groups: [
    {
      key: 'styling',
      title: 'Styling drift — lower is better',
      signals: [
        { key: 'inline_styles', label: 'Inline `style={{…}}`', ticket: 'ENG-1017',
          include: COMP, patterns: [/style=\{\{/g] },
        { key: 'raw_colors', label: 'Raw color literals (hex / rgb / hsl)', ticket: 'ENG-637',
          include: [...COMP, ...CSS], excludeTokenSources: true,
          patterns: [/#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/g, /\b(?:rgb|rgba|hsl|hsla)\(/g] },
        { key: 'var_hex_fallbacks', label: 'Hex fallbacks in `var(--token, #hex)`', ticket: 'ENG-1153',
          include: [...COMP, ...CSS], patterns: [/var\(\s*--[a-z0-9-]+\s*,\s*#[0-9a-fA-F]{3,8}/g] },
        { key: 'raw_px', label: 'Raw `px` values', ticket: 'ENG-637',
          include: COMP, patterns: [/\b\d+(?:\.\d+)?px\b/g] },
        { key: 'tw_arbitrary', label: 'Tailwind arbitrary values `-[…]`', ticket: 'ENG-1017',
          include: COMP, patterns: [/\b[a-z][a-z-]*-\[[^\]]+\]/g],
          note: 'some are legitimate (e.g. `max-h-[80vh]`)' },
        { key: 'important', label: '`!important` overrides', ticket: 'ENG-1020',
          include: [...COMP, ...CSS], excludeTokenSources: true, patterns: [/!important/g] },
      ],
    },
    {
      key: 'interaction',
      title: 'Interaction & accessibility — lower is better',
      signals: [
        { key: 'js_hover_handlers', label: 'JS hover handlers (`onMouse*`)', ticket: 'ENG-641',
          include: COMP, patterns: [/on(?:MouseEnter|MouseLeave|MouseOver|MouseOut)\s*=/g] },
        { key: 'native_title', label: 'Native `title=` tooltips → ui/Tooltip', ticket: 'ENG-1152',
          include: COMP, excludePrimitiveDir: true, matcher: 'nativeTitle',
          note: 'DOM elements + title-forwarding controls only; excludes component `title` props (headings)' },
        { key: 'bespoke_dialogs', label: 'Bespoke `role="dialog"` → ui/Modal', ticket: 'ENG-1014',
          include: COMP, excludePrimitiveDir: true, patterns: [/role=["']dialog["']/g] },
      ],
    },
    {
      key: 'typography_icons',
      title: 'Typography & icons — lower is better',
      signals: [
        { key: 'mono_font', label: 'Mono-font in non-code chrome', ticket: 'ENG-636',
          include: [...COMP, ...CSS], excludeTokenSources: true,
          // Mono on code/terminal surfaces is correct usage, not drift — measure
          // only mono in ordinary UI chrome (ENG-641 audit 2026-08-10).
          excludeFileContains: ['CodeBlock', 'ScratchpadModal', 'MarkdownCode'],
          patterns: [/\bfont-mono\b/g, /JetBrains Mono/g, /Roboto Mono/g] },
        { key: 'offbrand_fonts', label: 'Off-brand fonts (regression guard, target 0)', ticket: 'ENG-635',
          include: [...COMP, ...CSS], patterns: [/Josefin\s*Sans/gi, /Comic Sans/gi] },
        { key: 'inline_svg', label: 'Inline `<svg>` icons → single icon lib', ticket: 'ENG-634',
          include: COMP, patterns: [/<svg[\s>]/g] },
        { key: 'local_icon_imports', label: 'Imports from local icon modules', ticket: 'ENG-634',
          include: COMP, patterns: [/from ['"][^'"]*[Ii]cons?['"]/g] },
      ],
    },
    {
      key: 'effects',
      title: 'Effects — lower is better',
      signals: [
        { key: 'glow_effects', label: 'Glow effects (`--glow` / text-shadow / drop-shadow)', ticket: 'ENG-638',
          include: [...COMP, ...CSS], excludeTokenSources: true,
          patterns: [/--glow/g, /text-shadow/g, /drop-shadow/g] },
      ],
    },
  ],

  // Adoption ratios: canonical uses / (canonical + raw). rawPattern overrides
  // the default `<element` match (e.g. checkbox is an input variant).
  primitiveRatios: [
    { family: 'button', element: 'button', component: 'Button', ticket: 'ENG-936' },
    { family: 'input', element: 'input', component: 'Input', ticket: 'ENG-1015',
      rawMatcher: 'inputTextLike' },
    { family: 'textarea', element: 'textarea', component: 'Textarea', ticket: 'ENG-1015' },
    { family: 'select', element: 'select', component: 'Select', ticket: 'ENG-794' },
    { family: 'checkbox', component: 'Checkbox', ticket: 'ENG-1040',
      rawPattern: /type=["']checkbox["']/g },
  ],

  // Usage inventory for primitives without a clean raw HTML equivalent.
  // Rising total = broader adoption. Counts uses OUTSIDE the primitive dir.
  primitiveInventory: [
    'Alert', 'Badge', 'Card', 'Combobox', 'Crumb', 'EmptyState', 'Eyebrow',
    'Field', 'Kbd', 'Menu', 'Modal', 'Spinner', 'Switch', 'ToggleGroup',
    'Toast', 'Tooltip',
  ],

  // Legacy files whose shrinking line count is the convergence signal.
  fileSizes: [
    { label: 'CSS monolith `cowork/styles/globals.css`', path: 'src/renderer/cowork/styles/globals.css', ticket: 'ENG-1020' },
    { label: 'Legacy `styles.css`', path: 'src/renderer/styles.css', ticket: 'ENG-1020' },
  ],

  // Fixed epic day-zero (ENG-641) baseline used ONLY for the style-hygiene
  // sub-score, so the Convergence Index measures cumulative progress from a
  // stable anchor rather than week-to-week wobble. Values are the drift-signal
  // occurrences at commit 3a92bf1b (2026-07-07). Update only if the anchor is
  // deliberately re-based. native_title / bespoke_dialogs are excluded here —
  // they feed the adoption sub-score instead, to avoid double-counting.
  anchor: {
    date: '2026-07-07',
    commit: '3a92bf1b',
    // Re-scanned 2026-08-10 under the refined scope (arcade + test/story files
    // excluded; mono counts non-code chrome only) so the hygiene sub-score stays
    // comparable to current counts. Prior (pre-refinement) anchor for reference:
    // inline_styles 1363, raw_colors 501, var_hex_fallbacks 64, raw_px 1388,
    // mono_font 61, inline_svg 105, glow_effects 20.
    signals: {
      inline_styles: 1245, raw_colors: 343, var_hex_fallbacks: 62, raw_px: 1356,
      tw_arbitrary: 92, important: 10, js_hover_handlers: 141, mono_font: 48,
      offbrand_fonts: 19, inline_svg: 104, local_icon_imports: 54, glow_effects: 16,
    },
  },
};

const round1 = (n) => Math.round(n * 10) / 10;

// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const args = { markdown: false, baseline: null, config: null, repo: null, asOf: null };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--markdown') args.markdown = true;
    else if (a === '--baseline') args.baseline = argv[++i];
    else if (a === '--config') args.config = argv[++i];
    else if (a === '--repo') args.repo = argv[++i];
    else if (a === '--as-of') args.asOf = argv[++i];
    else if (a === '--help' || a === '-h') { help(); process.exit(0); }
  }
  if (!args.repo) { help(); throw new Error('--repo <path> is required'); }
  return args;
}
function help() {
  process.stderr.write('Usage: node scan.mjs --repo <path> [--markdown] [--baseline <file|->] [--config <file>] [--as-of YYYY-MM-DD]\n');
}

function toRe(p) { return p instanceof RegExp ? p : new RegExp(p, 'g'); }
function count(text, patterns) {
  let n = 0;
  for (const p of patterns) { const m = text.match(toRe(p)); if (m) n += m.length; }
  return n;
}

// Components verified to forward a `title` prop onto a native DOM node (so they
// render a real browser tooltip). Extend as title-forwarding wrappers are found.
const TITLE_FORWARDING = ['Button', 'Switch', 'IconButton', 'CardIconButton', 'SmallBtn'];

// Tag-aware matchers for signals where a bare regex over-counts. A signal opts
// in via `matcher: '<name>'`, which wins over `patterns`; kept here rather than
// in config so JSON `--config` overrides stay declarative and reference a
// matcher by name.
const MATCHERS = {
  // Native `title=` browser tooltips (ENG-1152). Counts `title=` only when its
  // owning JSX element is a native lowercase HTML tag, or a component verified
  // to forward `title` to the DOM (TITLE_FORWARDING). Capitalized components
  // such as <Section>, <ModalHeader>, <PageHeader>, <EmptyState> render `title`
  // as VISIBLE TEXT — those are headings, not tooltips, and are excluded. A bare
  // /\btitle=/ counted them all, inflating the signal ~3x and polluting the
  // adoption denominator it feeds. Owner = nearest tag-open at or before the
  // attribute; a JSX element passed as an earlier prop value can misattribute in
  // rare cases (medium-confidence static scan, consistent with the contract).
  nativeTitle(text) {
    const opens = [];
    const tag = /<([A-Za-z][A-Za-z0-9.]*)/g;
    let m;
    while ((m = tag.exec(text))) opens.push([m.index, m[1]]);
    const title = /\btitle=/g;
    let n = 0;
    while ((m = title.exec(text))) {
      let owner = null;
      for (let i = opens.length - 1; i >= 0; i--) {
        if (opens[i][0] <= m.index) { owner = opens[i][1]; break; }
      }
      if (owner && (/^[a-z]/.test(owner) || TITLE_FORWARDING.includes(owner))) n++;
    }
    return n;
  },

  // Raw <input> count for the Input adoption ratio, restricted to the text-like
  // inputs ui/Input actually replaces. type=file/color/range/date/checkbox/radio
  // are different controls (checkbox has its own ratio), so counting them as
  // "raw Input" understated adoption. type-less inputs default to text.
  inputTextLike(text) {
    const TEXTLIKE = new Set(['text', 'search', 'email', 'password', 'url', 'tel', 'number', '']);
    const re = /<input\b[^>]*>/g;
    let n = 0, m;
    while ((m = re.exec(text))) {
      const t = /type=["']?([a-zA-Z]+)/.exec(m[0]);
      if (TEXTLIKE.has(t ? t[1].toLowerCase() : '')) n++;
    }
    return n;
  },
};

function walk(dir, excludeDirs, out) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    if (e.isDirectory()) {
      if (excludeDirs.includes(e.name) || e.name.startsWith('.')) continue;
      walk(path.join(dir, e.name), excludeDirs, out);
    } else out.push(path.join(dir, e.name));
  }
  return out;
}

function gitCommit(repo) {
  try {
    return execSync('git rev-parse --short HEAD', { cwd: repo, stdio: ['ignore', 'pipe', 'ignore'] })
      .toString().trim();
  } catch { return null; }
}

function scan(repo, cfg, asOf) {
  const scopeRoot = path.join(repo, cfg.scope);
  const allFiles = walk(scopeRoot, cfg.excludeDirs, []);
  const isToken = (rel) => cfg.tokenSources.some((t) => rel.endsWith(t) || rel.includes(t));
  const inPrim = (rel) => rel.includes(cfg.primitiveDir);

  // Load eligible files once with metadata.
  const files = [];
  let componentFiles = 0;
  for (const abs of allFiles) {
    const ext = path.extname(abs);
    if (!COMP.includes(ext) && !CSS.includes(ext)) continue;
    const rel = path.relative(repo, abs);
    if ((cfg.excludePaths || []).some((p) => rel.includes(p))) continue;
    if ((cfg.excludeFileMatch || []).some((m) => path.basename(rel).includes(m))) continue;
    let text; try { text = fs.readFileSync(abs, 'utf8'); } catch { continue; }
    if (COMP.includes(ext)) componentFiles++;
    files.push({ rel, ext, text, token: isToken(rel), prim: inPrim(rel) });
  }

  // Grouped count signals.
  const groups = [];
  for (const g of cfg.groups) {
    const signals = [];
    for (const s of g.signals) {
      let occurrences = 0; const byFile = {};
      for (const f of files) {
        if (!s.include.includes(f.ext)) continue;
        if (s.excludeTokenSources && f.token) continue;
        if (s.excludePrimitiveDir && f.prim) continue;
        if (s.excludeFileContains && s.excludeFileContains.some((x) => f.rel.includes(x))) continue;
        const n = s.matcher ? MATCHERS[s.matcher](f.text) : count(f.text, s.patterns);
        if (n > 0) { occurrences += n; byFile[f.rel] = n; }
      }
      const top = Object.entries(byFile).sort((a, b) => b[1] - a[1]).slice(0, 5)
        .map(([file, c]) => ({ file, count: c }));
      signals.push({ key: s.key, label: s.label, ticket: s.ticket, note: s.note || null,
        occurrences, files: Object.keys(byFile).length, top });
    }
    groups.push({ key: g.key, title: g.title, signals });
  }

  // Adoption ratios.
  const ratios = [];
  for (const r of cfg.primitiveRatios) {
    let raw = 0, canonical = 0;
    const rawRe = r.rawPattern ? r.rawPattern : new RegExp(`<${r.element}[\\s/>]`, 'g');
    const compRe = new RegExp(`<${r.component}[\\s/>]`, 'g');
    for (const f of files) {
      if (!COMP.includes(f.ext) || f.prim) continue;
      raw += r.rawMatcher ? MATCHERS[r.rawMatcher](f.text) : count(f.text, [rawRe]);
      canonical += count(f.text, [compRe]);
    }
    const denom = raw + canonical;
    ratios.push({ family: r.family, component: r.component, ticket: r.ticket,
      canonical, raw, adoptionPct: denom === 0 ? null : Math.round((canonical / denom) * 1000) / 10 });
  }

  // Primitive usage inventory.
  const inventory = {}; let inventoryTotal = 0;
  for (const name of cfg.primitiveInventory) {
    const re = new RegExp(`<${name}[\\s/>]`, 'g');
    let n = 0;
    for (const f of files) { if (COMP.includes(f.ext) && !f.prim) n += count(f.text, [re]); }
    inventory[name] = n; inventoryTotal += n;
  }

  // Legacy file sizes.
  const fileSizes = [];
  for (const fsz of cfg.fileSizes) {
    let lines = null;
    try { lines = fs.readFileSync(path.join(repo, fsz.path), 'utf8').split('\n').length; } catch {}
    fileSizes.push({ label: fsz.label, ticket: fsz.ticket, lines });
  }

  // --- Aggregate scores (0–100), transparent and decomposable ---------------
  // Current occurrences by signal key.
  const cur = {};
  for (const g of groups) for (const s of g.signals) cur[s.key] = s.occurrences;

  // Adoption sub-score: canonical share across every family with a raw
  // counterpart — ratio primitives plus tooltip (vs native title=) and modal
  // (vs bespoke role="dialog"). A true 0–100 ratio, no anchor needed.
  let can = 0, rawc = 0;
  for (const r of ratios) { can += r.canonical; rawc += r.raw; }
  can += inventory.Tooltip || 0; rawc += cur.native_title || 0;
  can += inventory.Modal || 0; rawc += cur.bespoke_dialogs || 0;
  const adoption = (can + rawc) ? round1((100 * can) / (can + rawc)) : null;

  // Hygiene sub-score: mean reduction across drift signals vs the fixed epic
  // baseline (target = 0). Clamped to [0,1] per signal so regressions score 0
  // rather than dragging the mean negative.
  const anchorSig = cfg.anchor?.signals || {};
  const hk = Object.keys(anchorSig);
  let sum = 0;
  for (const k of hk) {
    const B = anchorSig[k], C = cur[k] ?? 0;
    sum += B > 0 ? Math.max(0, Math.min(1, (B - C) / B)) : (C === 0 ? 1 : 0);
  }
  const hygiene = hk.length ? round1((100 * sum) / hk.length) : null;
  const index = (adoption != null && hygiene != null) ? round1((adoption + hygiene) / 2) : null;

  return {
    schema: 2,
    scope: cfg.scope,
    commit: gitCommit(repo),
    generatedAt: asOf || new Date().toISOString().slice(0, 10),
    componentFiles,
    scores: { index, adoption, hygiene, anchorDate: cfg.anchor?.date || null },
    groups,
    ratios,
    inventory, inventoryTotal,
    fileSizes,
  };
}

// --- Markdown ---------------------------------------------------------------

function dlt(cur, base, goodDown = true) {
  if (base == null || cur == null) return '—';
  const d = Math.round((cur - base) * 10) / 10;
  if (d === 0) return '±0';
  const better = goodDown ? d < 0 : d > 0;
  const arrow = d < 0 ? '▼' : '▲';
  const sign = d > 0 ? `+${d}` : `${d}`;
  return `${arrow} ${sign}${better ? '' : ' ⚠'}`;
}

function indexSnapshot(snap) {
  if (!snap) return { sig: {}, rat: {}, inv: {}, invTotal: undefined, fsz: {}, scores: {} };
  // Compact (v3) form embedded in posted comments — already flat.
  if (snap.v === 3) {
    return {
      sig: snap.signals || {}, rat: snap.ratios || {}, inv: snap.inventory || {},
      invTotal: snap.inventoryTotal, fsz: snap.legacy || {}, scores: snap.scores || {},
    };
  }
  // Full snapshot (e.g. a JSON file from a re-scan) — flatten for lookups.
  const sig = {}, rat = {}, inv = snap.inventory || {}, fsz = {};
  for (const g of snap.groups || []) for (const s of g.signals) sig[s.key] = s.occurrences;
  for (const r of snap.ratios || []) rat[r.family] = r.adoptionPct;
  for (const f of snap.fileSizes || []) fsz[f.label] = f.lines;
  return { sig, rat, inv, invTotal: snap.inventoryTotal, fsz, scores: snap.scores || {} };
}

function renderMarkdown(snap, base) {
  const b = indexSnapshot(base);
  const L = [];
  L.push('## Design-system convergence — weekly metrics (ENG-641)');
  L.push('');
  const commit = snap.commit ? `\`${snap.commit}\`` : 'n/a';
  const baseDate = base ? (base.date || base.generatedAt) : null;
  const baseNote = base
    ? `vs baseline ${baseDate}${base.commit ? ` (\`${base.commit}\`)` : ''}`
    : 'first snapshot — no prior baseline';
  L.push(`**Scope:** \`${snap.scope}\` · **Commit:** ${commit} · **Date:** ${snap.generatedAt} · **Components scanned:** ${snap.componentFiles}`);
  L.push('');
  L.push(`_${baseNote}. Each row is a convergence candidate keyed to its sub-ticket — counts locate work, they are not defects by themselves. Token definitions and primitive internals are excluded. Confidence: medium (static scan; dynamic styling not observed)._`);
  L.push('');

  // Convergence Index — decomposable, repo-relative composite.
  const sc = snap.scores || {};
  const bsc = b.scores || {};
  if (sc.index != null) {
    L.push(`### 🎯 Convergence Index — ${sc.index}/100 ${dlt(sc.index, bsc.index, false)}`);
    L.push('');
    L.push('| Sub-score | Value | Δ | What it measures |');
    L.push('| --- | ---: | :--- | --- |');
    L.push(`| Component adoption | ${sc.adoption}% | ${dlt(sc.adoption, bsc.adoption, false)} | canonical primitives / tooltips / modals as a share of all (canonical + raw) equivalents |`);
    L.push(`| Style-hygiene progress | ${sc.hygiene}% | ${dlt(sc.hygiene, bsc.hygiene, false)} | mean reduction across drift signals vs the epic baseline (${sc.anchorDate}) |`);
    L.push('');
    L.push('_Directional, repo-relative composite (the mean of the two sub-scores above) — a progress index, not an absolute quality grade. Full formula in the skill\'s `references/measurement.md`._');
    L.push('');
  }

  for (const g of snap.groups) {
    L.push(`### ${g.title}`);
    L.push('');
    L.push('| Signal | Ticket | Count | Files | Δ |');
    L.push('| --- | --- | ---: | ---: | :--- |');
    for (const s of g.signals) {
      const label = s.note ? `${s.label} <sup>${s.note}</sup>` : s.label;
      L.push(`| ${label} | ${s.ticket} | ${s.occurrences} | ${s.files} | ${dlt(s.occurrences, b.sig[s.key])} |`);
    }
    L.push('');
  }

  L.push('### Primitive adoption ratios — higher is better');
  L.push('');
  L.push('| Family | Ticket | Canonical | Raw | Adoption | Δ |');
  L.push('| --- | --- | ---: | ---: | ---: | :--- |');
  for (const r of snap.ratios) {
    const pct = r.adoptionPct == null ? 'n/a' : `${r.adoptionPct}%`;
    L.push(`| \`<${r.component}>\` | ${r.ticket} | ${r.canonical} | ${r.raw} | ${pct} | ${dlt(r.adoptionPct, b.rat[r.family], false)} |`);
  }
  L.push('');

  L.push(`### Primitive usage inventory — higher is better (total ${snap.inventoryTotal}, Δ ${dlt(snap.inventoryTotal, b.invTotal, false)})`);
  L.push('');
  L.push('| Primitive | Uses | Δ |');
  L.push('| --- | ---: | :--- |');
  for (const [name, n] of Object.entries(snap.inventory)) {
    L.push(`| \`<${name}>\` | ${n} | ${dlt(n, b.inv[name], false)} |`);
  }
  L.push('');

  L.push('### Legacy footprint — lower is better');
  L.push('');
  L.push('| File | Ticket | Lines | Δ |');
  L.push('| --- | --- | ---: | :--- |');
  for (const f of snap.fileSizes) {
    L.push(`| ${f.label} | ${f.ticket} | ${f.lines ?? 'n/a'} | ${dlt(f.lines, b.fsz[f.label])} |`);
  }
  L.push('');

  L.push('### Top files by drift signal');
  L.push('');
  for (const g of snap.groups) for (const s of g.signals) {
    if (!s.top.length) continue;
    L.push(`**${s.label}** (${s.ticket})`);
    L.push('');
    for (const t of s.top) L.push(`- \`${t.file}\` — ${t.count}`);
    L.push('');
  }
  // Embed a COMPACT snapshot for next week's baseline. Linear renders neither
  // HTML comments nor <details>, so this goes in a plain fenced json block —
  // only the numbers the delta computation actually reads, keyed flat, to keep
  // the visible block small. The `design-metrics-snapshot` token anchors
  // extraction.
  L.push('### Machine-readable snapshot');
  L.push('');
  L.push('_The weekly tracker reads the block below to compute next week\'s deltas — please don\'t edit it._');
  L.push('');
  L.push('```json');
  L.push(JSON.stringify(compactSnapshot(snap)));
  L.push('```');
  return L.join('\n');
}

// Flat, minimal snapshot: only the fields delta computation consumes. The
// `_marker` field carries the extraction token so the JSON is self-describing.
function compactSnapshot(snap) {
  const signals = {};
  for (const g of snap.groups) for (const s of g.signals) signals[s.key] = s.occurrences;
  const ratios = {};
  for (const r of snap.ratios) ratios[r.family] = r.adoptionPct;
  const legacy = {};
  for (const f of snap.fileSizes) legacy[f.label] = f.lines;
  return {
    _marker: 'design-metrics-snapshot',
    v: 3,
    date: snap.generatedAt,
    commit: snap.commit,
    files: snap.componentFiles,
    scores: snap.scores,
    signals,
    ratios,
    inventory: snap.inventory,
    inventoryTotal: snap.inventoryTotal,
    legacy,
  };
}

// --- Main -------------------------------------------------------------------

function loadBaseline(arg) {
  if (!arg) return null;
  const raw = arg === '-' ? fs.readFileSync(0, 'utf8') : fs.readFileSync(arg, 'utf8');
  const t = raw.trim();
  if (!t) return null;
  // Preferred: whichever fenced code block parses to our marker snapshot. Robust
  // to the token living inside the JSON and to other fences in the text.
  for (const fence of t.match(/```(?:json)?\s*[\s\S]*?```/g) || []) {
    const inner = fence.replace(/^```(?:json)?/, '').replace(/```$/, '').trim();
    try {
      const o = JSON.parse(inner);
      if (o && (o._marker === 'design-metrics-snapshot' || o.v === 3 || o.schema === 2)) return o;
    } catch { /* not the snapshot fence */ }
  }
  // Legacy format: HTML-comment marker.
  const m = t.match(/design-metrics-snapshot:\s*(\{[\s\S]*\})\s*-->/);
  if (m) return JSON.parse(m[1]);
  // Bare snapshot JSON.
  if (t.startsWith('{')) return JSON.parse(t);
  return null;
}

function main() {
  const args = parseArgs(process.argv);
  const cfg = args.config
    ? { ...DEFAULT_CONFIG, ...JSON.parse(fs.readFileSync(args.config, 'utf8')) }
    : DEFAULT_CONFIG;
  const snap = scan(path.resolve(args.repo), cfg, args.asOf);
  if (!args.markdown) { process.stdout.write(JSON.stringify(snap, null, 2) + '\n'); return; }
  process.stdout.write(renderMarkdown(snap, loadBaseline(args.baseline)) + '\n');
}

main();
