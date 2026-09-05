#!/usr/bin/env node
/**
 * shot_diff.mjs — deterministic pixel diff between two screenshots.
 *
 * The render-evidence primitive for `validate-work`: after a visual change,
 * capture the affected screen before and after (headless Chrome, Playwright,
 * or any headless renderer), then diff the PNGs here. No third-party
 * dependencies — PNG decode/inflate/filter and the diff image are implemented
 * on Node's built-in `zlib`.
 *
 * Usage:
 *   node shot_diff.mjs BEFORE.png AFTER.png \
 *       [--tolerance 32] [--out diff.png] [--report report.json] [--threshold 0.0]
 *
 *   --tolerance  max channel delta per pixel before a pixel counts as changed (0-255, default 32)
 *   --threshold  fraction of pixels that may differ before the run fails (default 0.01, i.e. 1%)
 *   --out        write a diff highlight PNG (changed pixels → magenta over the after image)
 *   --report     write machine-readable results JSON (for the validate-work report)
 *   --selftest   encode a known PNG, decode it, diff a variant, print results, exit 0
 *
 * Exit: 0 unchanged (ratio < threshold), 1 changed, 2 usage/IO error.
 */
import { deflateSync, inflateSync } from 'node:zlib';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const USE = `usage: node shot_diff.mjs BEFORE.png AFTER.png [--tolerance 32] [--out diff.png] [--report report.json] [--threshold 0.0]`;

// ---------- PNG low-level ----------

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, 'latin1'), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
function encodePng(width, height, rgba) {
  const bpp = 4;
  const stride = width * bpp;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0; // filter: None
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8-bit, RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function decodePng(buf) {
  if (buf.length < 8 || buf.readUInt32BE(0) !== 0x89504e47) throw new Error('not a PNG');
  let w = 0, h = 0, depth = 0, ctype = 0;
  const idat = [];
  let pos = 8;
  while (pos + 12 <= buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString('latin1', pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    if (type === 'IHDR') {
      w = data.readUInt32BE(0); h = data.readUInt32BE(4);
      depth = data[8]; ctype = data[9];
      if (depth !== 8) throw new Error(`only 8-bit PNG supported (depth ${depth})`);
      if (![0, 2, 4, 6].includes(ctype)) throw new Error(`unsupported color type ${ctype}`);
    } else if (type === 'IDAT') {
      idat.push(data);
    } else if (type === 'IEND') {
      break;
    }
    pos += 12 + len;
  }
  const channels = { 0: 1, 2: 3, 4: 2, 6: 4 }[ctype] ?? 0; // gray, rgb, gray+a, rgba
  const bpp = channels;
  const stride = w * channels;
  const raw = inflateSync(Buffer.concat(idat));
  const out = Buffer.alloc(w * h * 4);
  const paeth = (a, b, c) => {
    const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
    return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
  };
  const prev = Buffer.alloc(stride);
  for (let y = 0; y < h; y++) {
    const line = Buffer.from(raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1)));
    const f = raw[y * (stride + 1)];
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? line[x - bpp] : 0;
      const b = prev[x];
      const c = x >= bpp ? prev[x - bpp] : 0;
      const v = line[x];
      line[x] = f === 1 ? (v + a) & 0xff : f === 2 ? (v + b) & 0xff : f === 3 ? (v + ((a + b) >> 1)) & 0xff : f === 4 ? (v + paeth(a, b, c)) & 0xff : v;
    }
    for (let x = 0; x < w; x++) {
      const si = x * channels, di = (y * w + x) * 4;
      if (channels === 1) { out[di] = out[di + 1] = out[di + 2] = line[si]; out[di + 3] = 255; }
      else if (channels === 2) { out[di] = out[di + 1] = out[di + 2] = line[si]; out[di + 3] = line[si + 1]; }
      else if (channels === 3) { out[di] = line[si]; out[di + 1] = line[si + 1]; out[di + 2] = line[si + 2]; out[di + 3] = 255; }
      else { out[di] = line[si]; out[di + 1] = line[si + 1]; out[di + 2] = line[si + 2]; out[di + 3] = line[si + 3]; }
    }
    prev.set(line);
  }
  return { width: w, height: h, rgba: out };
}

// ---------- diff ----------

function diff(a, b, tolerance) {
  const wa = a.width, ha = a.height, wb = b.width, hb = b.height;
  if (wa !== wb || ha !== hb) throw new Error(`dimension mismatch: ${wa}x${ha} vs ${wb}x${hb}`);
  const n = wa * ha;
  let changed = 0;
  const highlight = Buffer.from(a.rgba);
  for (let i = 0; i < n; i++) {
    const o = i * 4;
    const d = Math.max(
      Math.abs(a.rgba[o] - b.rgba[o]),
      Math.abs(a.rgba[o + 1] - b.rgba[o + 1]),
      Math.abs(a.rgba[o + 2] - b.rgba[o + 2]),
    );
    if (d >= tolerance) {
      changed++;
      highlight[o] = 255; highlight[o + 1] = 0; highlight[o + 2] = 128; // magenta
    }
  }
  return { changed, total: n, ratio: changed / n, highlight };
}

// ---------- CLI ----------

function arg(name, def = null) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : def;
}
const has = (n) => process.argv.includes(n);

function run() {
  if (has('--selftest')) {
    const w = 3, h = 2;
    const src = Buffer.alloc(w * h * 4);
    for (let i = 0; i < w * h; i++) { src[i * 4] = 10 + i; src[i * 4 + 1] = 20 + i; src[i * 4 + 2] = 30 + i; src[i * 4 + 3] = 255; }
    const png = encodePng(w, h, src);
    const dec = decodePng(png);
    const match = dec.rgba.equals(src) && dec.width === w && dec.height === h;
    const variant = Buffer.from(src); variant[0] = 200; // change first pixel
    const d = diff(dec, decodePng(encodePng(w, h, variant)), 32);
    console.log(`selftest: roundtrip ${match ? 'ok' : 'FAIL'} | changed ${d.changed}/${d.total} (ratio ${d.ratio.toFixed(4)})`);
    if (!match || d.changed !== 1) process.exit(1);
    process.exit(0);
  }

  const before = process.argv[2], after = process.argv[3];
  if (!before || !after) { console.error(USE); process.exit(2); }
  const tolerance = parseInt(arg('--tolerance', '32'), 10);
  const threshold = parseFloat(arg('--threshold', '0.0'));
  if (!existsSync(before) || !existsSync(after)) { console.error('shot_diff: input file not found'); process.exit(2); }

  const a = decodePng(readFileSync(before));
  const b = decodePng(readFileSync(after));
  const r = diff(a, b, tolerance);

  if (arg('--out')) writeFileSync(arg('--out'), encodePng(a.width, a.height, r.highlight));
  if (arg('--report')) writeFileSync(arg('--report'), JSON.stringify({ before, after, tolerance, threshold, changed: r.changed, total: r.total, ratio: +r.ratio.toFixed(6), verdict: r.ratio <= threshold ? 'unchanged' : 'changed' }, null, 2));

  const verdict = r.ratio <= threshold ? 'UNCHANGED' : 'CHANGED';
  console.log(`${verdict}  ${r.changed}/${r.total} pixels (${(r.ratio * 100).toFixed(2)}%) above tolerance ${tolerance}; threshold ${threshold * 100}%`);
  if (arg('--out')) console.log(`diff: ${arg('--out')}`);
  process.exit(r.ratio <= threshold ? 0 : 1);
}

run();