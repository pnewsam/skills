#!/usr/bin/env node
// Capture one side (before or after) of a PR's screenshots and refresh the
// paste-ready table. Usage: node capture.mjs <spec.json>
//
// spec = {
//   "repo": "/path/to/cowork",            // resolves its own Playwright install
//   "baseUrl": "http://127.0.0.1:5199",
//   "out": "~/Desktop/pr-1234-screenshots",
//   "label": "before" | "after",
//   "themes": ["light", "dark"],          // default both
//   "viewport": { "width": 1280, "height": 900 },
//   "shots": [{ "name": "composer-running", "path": "/?codeFixture=running",
//               "selector": ".code-composer", "hover": "...", "click": "...",
//               "waitFor": "...", "delay": 300, "fullPage": false }]
// }
// Writes <out>/<label>-<name>-<theme>.png and <out>/screenshots.md.
import { createRequire } from 'node:module';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';

const specPath = process.argv[2];
if (!specPath) {
  console.error('usage: node capture.mjs <spec.json>');
  process.exit(2);
}
const spec = JSON.parse(readFileSync(specPath, 'utf8'));
const expand = (p) => resolve(p.replace(/^~(?=\/|$)/, homedir()));
const repo = expand(spec.repo);
const out = expand(spec.out);
const label = spec.label;
if (!['before', 'after'].includes(label)) throw new Error('label must be "before" or "after"');
const themes = spec.themes ?? ['light', 'dark'];
mkdirSync(out, { recursive: true });

const { chromium } = createRequire(join(repo, 'package.json'))('playwright');

// The repo's Playwright often expects a browser build that is not installed.
// Fall back to $PW_CHROMIUM, then to the newest cached headless shell.
async function launch() {
  try {
    return await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
  } catch (error) {
    if (!/Executable doesn't exist/.test(String(error))) throw error;
    const cache = join(homedir(), 'Library/Caches/ms-playwright');
    const shells = existsSync(cache)
      ? readdirSync(cache).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse()
      : [];
    for (const dir of shells) {
      for (const sub of readdirSync(join(cache, dir))) {
        const exe = join(cache, dir, sub, 'chrome-headless-shell');
        if (existsSync(exe)) return chromium.launch({ executablePath: exe });
      }
    }
    throw error;
  }
}
const browser = await launch();
const written = [];
try {
  for (const theme of themes) {
    const context = await browser.newContext({
      viewport: spec.viewport ?? { width: 1280, height: 900 },
      deviceScaleFactor: 2,
      colorScheme: theme,
    });
    // The app reads anton.theme; visual fixtures read ?theme=. Set both.
    await context.addInitScript((t) => {
      try { localStorage.setItem('anton.theme', t); } catch {}
    }, theme);
    for (const shot of spec.shots) {
      const page = await context.newPage();
      const url = new URL(shot.path, spec.baseUrl);
      url.searchParams.set('theme', theme);
      await page.goto(url.href, { waitUntil: 'networkidle' });
      // An auth redirect still yields a clean-looking page; refuse to save it.
      if (new URL(page.url()).origin !== url.origin) {
        throw new Error(`${shot.name}: redirected to ${page.url()}; this server mode cannot render ${shot.path}`);
      }
      if (shot.waitFor) await page.waitForSelector(shot.waitFor, { timeout: 15000 });
      if (shot.click) await page.click(shot.click);
      if (shot.hover) await page.hover(shot.hover);
      await page.waitForTimeout(shot.delay ?? 300);
      const file = join(out, `${label}-${shot.name}-${theme}.png`);
      const target = shot.selector ? page.locator(shot.selector).first() : page;
      if (shot.selector && (await target.count()) === 0) {
        throw new Error(`${shot.name}: selector ${shot.selector} not found at ${url.href}`);
      }
      await target.screenshot({ path: file, fullPage: shot.selector ? undefined : !!shot.fullPage });
      written.push(file);
      await page.close();
    }
    await context.close();
  }
} finally {
  await browser.close();
}

// One row per state and theme, in the table layout the PR template uses. Cells
// name the file to drag in, since the CLI cannot upload images to GitHub.
const keys = new Set();
for (const f of readdirSync(out)) {
  const m = f.match(/^(before|after)-(.+)\.png$/);
  if (m) keys.add(m[2]);
}
const cell = (side, key) => (existsSync(join(out, `${side}-${key}.png`)) ? `${side}-${key}.png` : '(none)');
const rows = [...keys].sort().map((key) =>
  `<tr><td colspan="2"><b>${key}</b></td></tr>\n<tr>\n<td>\n\n${cell('before', key)}\n\n</td>\n<td>\n\n${cell('after', key)}\n\n</td>\n</tr>`);
writeFileSync(join(out, 'screenshots.md'),
  `## Screenshots\n\n<table>\n<thead>\n<tr>\n<th>Before</th>\n<th>After</th>\n</tr>\n</thead>\n<tbody>\n${rows.join('\n')}\n</tbody>\n</table>\n`);

console.log(written.join('\n'));
console.log(join(out, 'screenshots.md'));
