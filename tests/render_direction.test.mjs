import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const script = resolve('registry/validate-work/scripts/render_direction.mjs');
function fixture(t, candidates = [{ id: 'compact', html: 'page.html' }]) {
 const dir = mkdtempSync(join(tmpdir(), 'render-test-'));
 t.after(() => rmSync(dir, { recursive: true, force: true }));
 writeFileSync(join(dir, 'page.html'), '<html><body>Actual candidate</body></html>');
 writeFileSync(join(dir, 'input.json'), JSON.stringify({ candidates }));
 return { dir, out: join(dir, 'out'), run: (...args) => spawnSync(process.execPath,
  [script, '--directions', join(dir, 'input.json'), '--out', join(dir, 'out'), ...args],
  { encoding: 'utf8', env: { ...process.env, CHROME_BIN: join(dir, 'missing-chrome') } }) };
}
test('inventory has exact source identity and never claims rendering', t => {
 const f = fixture(t), run = f.run();
 assert.equal(run.status, 0, run.stderr);
 const m = JSON.parse(readFileSync(join(f.out, 'manifest.json')));
 assert.equal(m.candidates[0].rendered, false);
 assert.equal(m.candidates[0].sha256, createHash('sha256').update(readFileSync(join(f.dir, 'page.html'))).digest('hex'));
 assert.equal(f.run().status, 2, 'existing pass cannot be overwritten');
});
test('missing requested browser is a failure with explicit evidence', t => {
 const f = fixture(t), run = f.run('--shot');
 assert.equal(run.status, 1);
 const m = JSON.parse(readFileSync(join(f.out, 'manifest.json')));
 assert.equal(m.candidates[0].rendered, false);
 assert.match(m.candidates[0].error, /unavailable/);
});
test('rejects empty candidates, duplicate IDs and path-like IDs before output', t => {
 for (const candidates of [[], [{ id: '../escape', html: 'page.html' }],
  [{ id: 'same', html: 'page.html' }, { id: 'same', html: 'page.html' }]]) {
  const f = fixture(t, candidates);
  assert.equal(f.run().status, 2);
  assert.equal(existsSync(f.out), false);
 }
});
test('rejects missing source instead of generating a placeholder', t => {
 const f = fixture(t, [{ id: 'missing', html: 'missing.html' }]);
 assert.equal(f.run().status, 2);
 assert.equal(existsSync(f.out), false);
});

test('complete image permits cleanup of a browser that stays alive', t => {
 const f = fixture(t);
 const chrome = join(f.dir, 'chrome-stub');
 writeFileSync(chrome, `#!/usr/bin/env node\nconst fs = require('fs');\nconst out = process.argv.find(a=>a.startsWith('--screenshot=')).slice(13);\nfs.writeFileSync(out, Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=', 'base64'));\nsetInterval(()=>{},1000);\n`, { mode: 0o755 });
 const run = spawnSync(process.execPath, [script, '--directions', join(f.dir, 'input.json'), '--out', f.out, '--shot'],
  { encoding: 'utf8', timeout: 5000, env: { ...process.env, CHROME_BIN: chrome } });
 assert.equal(run.status, 0, run.stderr);
 assert.equal(JSON.parse(readFileSync(join(f.out, 'manifest.json'))).candidates[0].rendered, true);
});

test('partial screenshot followed by browser failure is not capture evidence', t => {
 const f = fixture(t);
 const chrome = join(f.dir, 'chrome-stub');
 writeFileSync(chrome, `#!/usr/bin/env node\nconst fs = require('fs');\nconst out = process.argv.find(a=>a.startsWith('--screenshot=')).slice(13);\nfs.writeFileSync(out, Buffer.from([137,80,78,71,13,10,26,10]));\nprocess.exit(1);\n`, { mode: 0o755 });
 const run = spawnSync(process.execPath, [script, '--directions', join(f.dir, 'input.json'), '--out', f.out, '--shot'],
  { encoding: 'utf8', timeout: 5000, env: { ...process.env, CHROME_BIN: chrome } });
 assert.equal(run.status, 1, run.stderr);
 assert.equal(JSON.parse(readFileSync(join(f.out, 'manifest.json'))).candidates[0].rendered, false);
});
