# Render candidates

The helper captures supplied HTML; generation and visual judgment remain agent/browser work. Paths are relative to the input JSON file. It uses existing local Chrome/Chromium (or `CHROME_BIN`) and never installs a browser.

```json
{
  "viewport": {"w": 1280, "h": 800},
  "candidates": [
    {"id": "compact", "html": "compact.html"},
    {"id": "editorial", "html": "editorial.html"}
  ]
}
```

```text
node scripts/render_direction.mjs --directions /tmp/design/directions.json --out /tmp/design/captures --shot
```

Use a new output directory for each pass. `manifest.json` records source SHA-256, screenshot path, and capture outcome. Nonzero exit means a requested capture or input failed; missing Chrome never silently passes. Without `--shot`, the result is an inventory only and is explicitly unrendered. Open and inspect each returned image before judging. For an application requiring interactive readiness, authentication, external assets, or multiple states, use its actual browser harness instead of assuming the static helper proves readiness.

After synthesis, write the revised HTML and capture it as a new pass. Hashes associate evidence with content; they do not establish that the page meets the brief. Contrast and other checks remain scoped to what was actually measured.

Capture uses an isolated temporary browser profile. The helper waits for complete PNG output, then stops its own browser process; missing or incomplete output fails after at most one minute plus process cleanup. A successful capture still requires visual inspection.
