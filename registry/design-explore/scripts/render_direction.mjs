#!/usr/bin/env node
/**
 * render_direction.mjs — turn generated design directions into artifacts.
 *
 * The bitter-lesson move for visual work: a judge must rate what a direction
 * *is*, not what its prose promises. This helper takes the structured token
 * spec that `design_explore.workflow.js` emits, builds a representative
 * standalone HTML screen from it, screenshots it with headless Chrome, and
 * gates it against WCAG AA contrast before anyone approves it.
 *
 * No third-party dependencies. Contrast math mirrors
 * registry/ui-color/scripts/check_contrast.py so verdicts agree.
 *
 * Input schema (--directions FILE):
 *   {
 *     "brief": "one line",
 *     "viewport": { "w": 1280, "h": 800 },          // optional, default 1280x800
 *     "candidates": [{
 *       "id": "dense-utilitarian",
 *       "angle": "dense/utilitarian",
 *       "concept": "one-line concept",
 *       "signature": "signature element the judge should look for",
 *       "tokens": {
 *         "bg", "surface", "text", "muted", "primary", "accent",
 *         "radius": "6px", "font": "system stack", "spacing": 8,
 *         "density": 1.0, "sizes": { "h1","h2","body","caption" },
 *         "dark": { bg/surface/text/muted/primary/accent/radius/danger }
 *       }
 *     }, ...]
 *   }
 *
 * Usage:
 *   node render_direction.mjs --directions dirs.json --out out/             # HTML only
 *   node render_direction.mjs --directions dirs.json --out out/ --shot      # + screenshots
 *   node render_direction.mjs --directions dirs.json --out out/ --shot --scale 4,8,12,16
 *   node render_direction.mjs --directions dirs.json --out out/ --strict-spacing  # promote off-scale to a gate
 *
 * Exit status is nonzero when any candidate fails its AA contrast gate, or the
 * spacing conformance gate under --strict-spacing, or a required step fails.
 */
import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const CHROME_CANDIDATES = [
  process.env.CHROME_BIN,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
].filter(Boolean);

function chromeBin() {
  return CHROME_CANDIDATES.find((p) => existsSync(p)) || null;
}

// ---------- WCAG math (mirrors check_contrast.py) ----------

function parseColor(s) {
  if (!s) return null;
  s = s.trim().toLowerCase().replace(/^#/, '');
  if (/^[0-9a-f]{3}$/.test(s)) s = s.replace(/./g, (c) => c + c);
  if (!/^[0-9a-f]{6}$/.test(s)) return null;
  return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16));
}
const lin = (c) => ((c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
function lum(rgb) {
  const [r, g, b] = rgb;
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}
function ratio(fg, bg) {
  const l1 = lum(parseColor(fg)), l2 = lum(parseColor(bg));
  const hi = Math.max(l1, l2), lo = Math.min(l1, l2);
  return (hi + 0.05) / (lo + 0.05);
}
const AA = (r, large = false) => r >= (large ? 3.0 : 4.5);

const FONT_STACK = "-apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const DEFAULT_SIZES = { h1: '30px', h2: '18px', body: '14px', caption: '12px' };

// ---------- token -> CSS variables ----------

function spacingScale(tokens, explicit) {
  const base = explicit && explicit.length ? explicit : null;
  const unit = Math.max(2, Math.round((tokens.spacing ?? 8) * (tokens.density ?? 1)));
  const near = (v) => (base ? (v > base[base.length - 1] ? v : base.reduce((a, b) => Math.abs(b - v) < Math.abs(a - v) ? b : a, base[0])) : v);
  return {
    sp0: near(2 * unit), sp1: near(4 * unit), sp2: near(8 * unit),
    sp3: near(16 * unit), sp4: near(32 * unit),
  };
}

// spacing conformance (mirrors ui-spacing's lint): flag any rhythm value that
// is off the scale. Advisory by default; --strict-spacing promotes it to a gate.
function spacingGate(t, explicit, base = 4) {
  const rawUnit = Math.max(2, Math.round((t.spacing ?? 8) * (t.density ?? 1)));
  const onScale = (v) => (explicit || []).includes(v) || (!explicit && v % base === 0);
  const nearest = (v) => (explicit && explicit.length
    ? explicit.reduce((a, b) => Math.abs(b - v) < Math.abs(a - v) ? b : a, explicit[0])
    : Math.round(v / base) * base);
  const slots = [['unit', rawUnit], ['2u', 2 * rawUnit], ['4u', 4 * rawUnit], ['8u', 8 * rawUnit], ['16u', 16 * rawUnit], ['32u', 32 * rawUnit]];
  const issues = [];
  for (const [label, v] of slots) if (!onScale(v)) issues.push({ label, requested: v, nearest: nearest(v) });
  return { unit: rawUnit, issues };
}

function cssVarsFor(tokens, sp, sizes, isDark) {
  const t = isDark && tokens.dark ? { ...tokens, ...tokens.dark } : tokens;
  return {
    '--bg': t.bg, '--surface': t.surface, '--text': t.text, '--muted': t.muted,
    '--primary': t.primary, '--accent': t.accent, '--danger': t.danger ?? '#d1453b',
    '--on-primary': t.onPrimary ?? '#ffffff',
    '--radius': t.radius ?? '6px',
    '--line': t.line ?? (isDark && tokens.dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'),
    '--accent-soft': t.accentSoft ?? (isDark && tokens.dark ? 'rgba(43,186,176,0.18)' : 'rgba(18,165,148,0.12)'),
    '--danger-soft': t.dangerSoft ?? (isDark && tokens.dark ? 'rgba(224,106,94,0.18)' : 'rgba(209,69,59,0.12)'),
    '--font': t.font ?? FONT_STACK,
    '--sz-h1': t.sizes?.h1 ?? sizes.h1, '--sz-h2': t.sizes?.h2 ?? sizes.h2,
    '--sz-body': t.sizes?.body ?? sizes.body, '--sz-caption': t.sizes?.caption ?? sizes.caption,
    '--sp-0': `${sp.sp0}px`, '--sp-1': `${sp.sp1}px`, '--sp-2': `${sp.sp2}px`,
    '--sp-3': `${sp.sp3}px`, '--sp-4': `${sp.sp4}px`,
  };
}

// ---------- HTML shell (one representative screen) ----------

function shell(vars, opts) {
  const { id, concept, signature } = opts;
  const darkVarCss = opts.darkVarsCss
    ? opts.darkVarsCss
    : '';
  return `<!doctype html>
<html lang="en"${opts.dark ? ' data-theme="dark"' : ''}>
<head>
<meta charset="utf-8">
<title>${id} — ${concept}</title>
<style>
:root { ${Object.entries(vars).map(([k, v]) => `${k}: ${v};`).join(' ')} }
* { box-sizing: border-box; margin: 0; }
body { background: var(--bg); color: var(--text); font-family: var(--font); font-size: var(--sz-body); line-height: 1.45; }
.wrap { max-width: 1180px; margin: 0 auto; padding: var(--sp-3); }
.topbar { display: flex; align-items: center; gap: var(--sp-3); padding: var(--sp-2) 0; border-bottom: 1px solid var(--line); }
.brand { font-weight: 700; font-size: var(--sz-h2); letter-spacing: -0.02em; }
.nav { display: flex; gap: var(--sp-2); flex: 1; }
.nav a { color: var(--muted); text-decoration: none; }
.nav a.on { color: var(--text); font-weight: 600; }
.avatar { width: var(--sp-3); height: var(--sp-3); border-radius: 50%; background: var(--primary); }
.badge { font-size: var(--sz-caption); padding: 2px var(--sp-1); border-radius: 999px; background: var(--accent-soft); color: var(--accent); }
.hero { padding: var(--sp-4) 0 var(--sp-3); }
.hero h1 { font-size: var(--sz-h1); letter-spacing: -0.03em; }
.hero p { color: var(--muted); max-width: 54ch; margin-top: var(--sp-1); }
.card { background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); padding: var(--sp-3); }
.stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--sp-3); padding: var(--sp-3) 0; }
.stat .k { color: var(--muted); font-size: var(--sz-caption); text-transform: uppercase; letter-spacing: 0.08em; }
.stat .v { font-size: var(--sz-h2); font-weight: 700; margin-top: var(--sp-1); }
.stat .d { font-size: var(--sz-caption); color: var(--accent); }
.panel { display: grid; grid-template-columns: 2fr 1fr; gap: var(--sp-3); padding-bottom: var(--sp-4); }
table { width: 100%; border-collapse: collapse; }
th, td { text-align: left; padding: var(--sp-2); border-bottom: 1px solid var(--line); }
th { color: var(--muted); font-size: var(--sz-caption); text-transform: uppercase; letter-spacing: 0.06em; }
.status { font-size: var(--sz-caption); padding: 2px var(--sp-1); border-radius: 999px; }
.status.paid { background: var(--accent-soft); color: var(--accent); }
.status.due { background: var(--danger-soft); color: var(--danger); }
.cta { display: inline-block; background: var(--primary); color: var(--on-primary); font-weight: 600; padding: var(--sp-2) var(--sp-3); border-radius: var(--radius); text-decoration: none; margin-top: var(--sp-2); }
.sig { border: 1px dashed var(--line); border-radius: var(--radius); padding: var(--sp-3); color: var(--muted); }
.sig b { color: var(--text); display: block; margin-bottom: var(--sp-1); }
${darkVarCss}
</style>
</head>
<body>
<div class="wrap">
  <header class="topbar"><span class="brand">▲ Agency</span><nav class="nav"><a class="on">Invoices</a><a>Clients</a><a>Reports</a></nav><span class="badge">Trial</span><span class="avatar"></span></header>
  <section class="hero"><h1>${concept}</h1><p>${signature}</p><a class="cta">New invoice</a></section>
  <section class="stats">
    <div class="card stat"><div class="k">Billable</div><div class="v">$48,210</div><div class="d">+12% vs last month</div></div>
    <div class="card stat"><div class="k">Outstanding</div><div class="v">$9,340</div><div class="d">3 overdue</div></div>
    <div class="card stat"><div class="k">Payments</div><div class="v">31</div><div class="d">98% on time</div></div>
  </section>
  <section class="panel">
    <div class="card">
      <table>
        <tr><th>Invoice</th><th>Client</th><th>Amount</th><th>Status</th></tr>
        <tr><td>INV-2026-0114</td><td>Northwind Studio</td><td>$4,800.00</td><td><span class="status paid">Paid</span></td></tr>
        <tr><td>INV-2026-0113</td><td>Arc Labs</td><td>$6,200.00</td><td><span class="status due">Due</span></td></tr>
        <tr><td>INV-2026-0112</td><td>Brightline</td><td>$2,750.00</td><td><span class="status paid">Paid</span></td></tr>
        <tr><td>INV-2026-0111</td><td>Blueprint Co</td><td>$8,100.00</td><td><span class="status due">Due</span></td></tr>
      </table>
    </div>
    <div class="card sig"><b>Signature move</b>${signature}</div>
  </section>
</div>
</body>
</html>`;
}

// ---------- contrast gate: the pairs the shell actually renders ----------

function checkPairs(id, t) {
  const pairs = [
    { fg: t.text, bg: t.bg, label: 'body text on bg' },
    { fg: t.text, bg: t.surface, label: 'body text on surface (cards)' },
    { fg: t.muted, bg: t.bg, label: 'muted text on bg' },
    { fg: t.muted, bg: t.surface, label: 'muted text on surface' },
    { fg: t.accent, bg: t.surface, label: 'accent text/icons on surface' },
    { fg: t.primary, bg: t.surface, label: 'primary accent on surface' },
    { fg: t.onPrimary ?? '#ffffff', bg: t.primary, label: 'button text on primary' },
  ];
  const fail = [];
  for (const p of pairs) {
    if (!parseColor(p.fg) || !parseColor(p.bg)) { fail.push({ ...p, r: NaN, note: 'unparseable color' }); continue; }
    const r = ratio(p.fg, p.bg);
    if (!AA(r, false)) fail.push({ ...p, r });
  }
  return { pairs: pairs.map((p) => ({ ...p, r: parseColor(p.fg) && parseColor(p.bg) ? ratio(p.fg, p.bg) : NaN })), fail };
}

// ---------- CLI ----------

function arg(name, def = null) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : def;
}
const has = (name) => process.argv.includes(name);

function main() {
  const directionsPath = arg('--directions');
  const outDir = arg('--out', join(here, 'out'));
  const shot = has('--shot');
  const scaleSpec = arg('--scale');
  const explicit = scaleSpec ? scaleSpec.split(',').map((s) => parseInt(s, 10)).filter((n) => Number.isFinite(n)) : null;
  const strictSpacing = has('--strict-spacing');

  if (!directionsPath) {
    console.error('usage: node render_direction.mjs --directions dirs.json --out out/ [--shot] [--scale 4,8,12,16]');
    process.exit(2);
  }

  const spec = JSON.parse(readFileSync(directionsPath, 'utf8'));
  mkdirSync(outDir, { recursive: true });
  const viewport = spec.viewport || { w: 1280, h: 800 };
  const chrome = shot ? chromeBin() : null;
  let failures = 0;

  for (const d of spec.candidates || []) {
    const t = { sizes: {}, ...(d.tokens || {}) };
    const sp = spacingScale(t, explicit);
    const sizes = { ...DEFAULT_SIZES, ...(t.sizes || {}) };
    const vars = cssVarsFor(t, sp, sizes, false);
    const id = d.id || d.angle || 'direction';

    const htmlPath = join(outDir, `${id}.html`);
    writeFileSync(htmlPath, shell(vars, { id, concept: d.concept || d.angle, signature: d.signature || '', dark: false, darkVarsCss: '' }));

    const report = checkPairs(id, t);
    const fails = report.fail;
    const spacing = spacingGate(t, explicit);
    let line = `[${fails.length ? 'FAIL' : 'ok  '}] ${id}: `;
    const shots = [];
    const themePasses = [['light', t, false]];
    if (t.dark) themePasses.push(['dark', { ...t, ...t.dark }, true]);

    for (const [label, theme, isDark] of themePasses) {
      if (isDark) {
        const tvar = cssVarsFor(t, sp, sizes, true);
        const darkVarsCss = Object.entries(tvar).map(([k, v]) => `${k}: ${v};`).join(' ');
        const darkPath = join(outDir, `${id}.dark.html`);
        writeFileSync(darkPath, shell(vars, { id, concept: d.concept || d.angle, signature: d.signature || '', dark: true, darkVarsCss: '' }));
        const darkReport = checkPairs(id, theme);
        darkReport.fail.forEach((f) => fails.push({ ...f, dark: true }));
        if (chrome) shots.push([darkPath, join(outDir, `${id}.dark.png`)]);
      } else if (chrome) {
        shots.push([htmlPath, join(outDir, `${id}.png`)]);
      }
    }

    line += `${report.pairs.length} contrast pairs; ${fails.length} below AA; spacing off-scale ${spacing.issues.length}`;
    console.log(line);
    for (const f of fails) {
      console.log(`    FAIL  ${f.dark ? '[dark] ' : ''}${(f.r || 0).toFixed(2)}:1  ${f.label}${f.note ? ' (' + f.note + ')' : ''}`);
    }
    for (const w of spacing.issues) {
      console.log(`    WARN spacing  ${w.label}=${w.requested}px off-scale (nearest ${w.nearest}px)`);
    }
    if (fails.length) failures += 1;
    if (strictSpacing && spacing.issues.length) failures += 1;

    if (chrome) {
      for (const [src, dst] of shots) {
        const res = spawnSync(chrome, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--window-size=${viewport.w},${viewport.h}`, `--screenshot=${dst}`, `file://${src}`], { stdio: 'ignore' });
        if (res.status !== 0) { console.error(`    screenshot failed for ${dst} (exit ${res.status})`); failures += 1; }
        else console.log(`    shot: ${dst}`);
      }
    }
  }

  if (!chrome && shot) console.error(`WARNING: --shot requested but no Chrome found (CHROME_BIN, macOS path, google-chrome, chromium). HTML only.`);
  console.log(`\n${spec.candidates?.length || 0} direction(s), ${failures} gate failure(s) (contrast AA${strictSpacing ? ' + spacing on-scale' : ''})`);
  process.exit(failures ? 1 : 0);
}

main();
