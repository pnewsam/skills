#!/usr/bin/env node
// Capture actual candidate HTML before visual judgment; never claim missing captures passed.
import { existsSync, readFileSync, mkdirSync, writeFileSync, statSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';

const PNG_HEADER = Buffer.from([137,80,78,71,13,10,26,10]);
const PNG_END = Buffer.from([0,0,0,0,73,69,78,68,174,66,96,130]);
function completePNG(path) {
  try {
    const bytes = readFileSync(path);
    return bytes.length >= 45 && bytes.subarray(0, 8).equals(PNG_HEADER)
      && bytes.subarray(-12).equals(PNG_END) ? bytes : null;
  } catch { return null; }
}

// Some Chrome builds keep their process alive after writing --screenshot output.
// Wait for a complete PNG, then stop only this fresh-profile child and await cleanup.
function capture(chrome, args, screenshot) {
  return new Promise(resolveCapture => {
    const child = spawn(chrome, args, { stdio: 'ignore' });
    let settled = false, poll, deadline;
    function finish(result) {
      if (settled) return;
      settled = true;
      clearInterval(poll);
      clearTimeout(deadline);
      if (child.exitCode !== null || child.signalCode !== null || !child.pid) {
        resolveCapture(result);
        return;
      }
      child.kill('SIGTERM');
      const kill = setTimeout(() => child.kill('SIGKILL'), 1000);
      child.once('close', () => { clearTimeout(kill); resolveCapture(result); });
    }
    child.once('error', error => finish({ error: error.message }));
    child.once('close', (code, signal) => {
      if (!settled) finish(completePNG(screenshot)
        ? { captured: true } : { error: `capture exited without a complete PNG: ${code}, ${signal || 'no signal'}` });
    });
    poll = setInterval(() => {
      if (completePNG(screenshot)) finish({ captured: true });
    }, 100);
    deadline = setTimeout(() => finish({ error: 'capture timed out without a complete PNG' }), 60000);
  });
}

function parseArgs(argv) {
  const args = { shot: false };
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i];
    if (key === '--shot') args.shot = true;
    else if (key === '--directions' || key === '--out') {
      if (!argv[i + 1] || argv[i + 1].startsWith('--')) throw new Error(`missing value for ${key}`);
      args[key.slice(2)] = argv[++i];
    } else throw new Error(`unknown argument ${key}`);
  }
  if (!args.directions || !args.out) throw new Error('usage: render_direction.mjs --directions FILE --out NEW_DIRECTORY [--shot]');
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const input = resolve(args.directions), out = resolve(args.out);
  const spec = JSON.parse(readFileSync(input, 'utf8'));
  if (!Array.isArray(spec.candidates) || !spec.candidates.length) throw new Error('at least one candidate is required');
  const { w = 1280, h = 800 } = spec.viewport || {};
  if (![w, h].every(n => Number.isInteger(n) && n > 0 && n <= 10000)) throw new Error('invalid viewport');
  const seen = new Set();
  const candidates = spec.candidates.map(candidate => {
    if (!candidate || !/^[a-z0-9][a-z0-9-]*$/.test(candidate.id) || seen.has(candidate.id)) throw new Error('candidate IDs must be unique safe slugs');
    seen.add(candidate.id);
    if (typeof candidate.html !== 'string') throw new Error(`missing HTML path for ${candidate.id}`);
    const html = resolve(dirname(input), candidate.html);
    if (!statSync(html).isFile()) throw new Error(`not an HTML file: ${html}`);
    const sha256 = createHash('sha256').update(readFileSync(html)).digest('hex');
    return { id: candidate.id, html, sha256 };
  });
  if (existsSync(out)) throw new Error('output directory exists; choose a new pass directory to avoid stale evidence');
  const chrome = process.env.CHROME_BIN || [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
  ].find(existsSync);
  mkdirSync(out, { recursive: true });
  const results = [];
  for (const candidate of candidates) {
    const result = { ...candidate, rendered: false, screenshot: null };
    results.push(result);
    if (!args.shot) { result.note = 'inventory only; capture was not requested'; continue; }
    if (!chrome || !existsSync(chrome)) { result.error = 'Chrome unavailable; no screenshot captured'; continue; }
    const screenshot = join(out, `${candidate.id}.png`);
    const run = await capture(chrome, [
      '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
      `--user-data-dir=${join(out, `.chrome-${candidate.id}`)}`,
      `--window-size=${w},${h}`, `--screenshot=${screenshot}`, pathToFileURL(candidate.html).href,
    ], screenshot);
    const png = completePNG(screenshot);
    if (!run.captured || !png) {
      result.error = run.error || 'capture produced no complete PNG';
      continue;
    }
    if (createHash('sha256').update(readFileSync(candidate.html)).digest('hex') !== candidate.sha256) {
      result.error = 'HTML source changed during capture; evidence is stale';
      continue;
    }
    result.rendered = true;
    result.screenshot = screenshot;
    result.screenshotSha256 = createHash('sha256').update(png).digest('hex');
  }
  const manifest = { input, viewport: { w, h }, captureRequested: args.shot, candidates: results };
  writeFileSync(join(out, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  for (const result of results) console.log(`${result.id}: ${result.rendered ? result.screenshot : result.error || result.note}`);
  console.log(`Manifest: ${join(out, 'manifest.json')}`);
  if (args.shot && results.some(result => !result.rendered)) process.exitCode = 1;
}
try { await main(); } catch (error) { console.error(error.message); process.exitCode = 2; }
