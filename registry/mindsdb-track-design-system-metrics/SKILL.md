---
name: mindsdb-track-design-system-metrics
description: Measure reproducible design-system convergence metrics for a configured UI scope, compute week-over-week deltas from the previous snapshot, and post one progress comment to a tracking Linear issue. Use for recurring UI consolidation tracking across styling drift (inline styles, raw colors/pixels, token-fallback and arbitrary-value density), interaction and accessibility patterns (JS hover handlers, native title tooltips), primitive adoption ratios and usage inventory, typography and icon consolidation, effects, and legacy-CSS footprint on an epic. Runs a read-only scan and performs one external Linear comment write; it does not edit code, rank candidates, or create plans.
---

# Track Design-System Metrics

## Outcome

Produce one weekly progress comment on a tracking Linear issue that reports current design-system convergence counts, their week-over-week change, and the top offending files, then stop.

This is a lightweight recurring tracker, not an audit. Use `analyze` (Design-system dimension) when the goal is to interpret drift and rank bounded consolidation candidates for `plan-feature`; use this skill only to record and post the trend line for an initiative that already exists.

## Modes and effects

- **Scan** (read-only): run `scripts/scan.mjs` over the configured UI scope to count drift signals and primitive adoption.
- **Report and post** (one external write): render the Linear-ready markdown and post it as a single comment on the tracking issue.

The scan reads source only. It never edits files, installs tools, changes styles, or commits. The one external effect is a single Linear comment; the user's request to run the weekly tracker authorizes that comment and nothing else.

## Inputs and preconditions

- Node 16+ available on PATH.
- The repository to measure. Default scope: the `cowork` app renderer (`src/renderer`), the active ENG-641 migration target. Override with `--config <file>` for a different app.
- Default tracking issue: **ENG-641** (UI design system consolidation). Confirm the identifier if the user names a different epic.
- An authenticated Linear MCP connection. If it is unavailable, stop and report that Linear is not connected rather than writing the report anywhere else.

Read `references/measurement.md` before reporting so the contract (scope, units, exclusions, confidence) is stated correctly and consistently every week.

## Workflow

### 1. Establish baseline from the tracking issue

Fetch the tracking issue's comments and find the most recent one containing the `design-metrics-snapshot` marker. That embedded JSON is the previous snapshot and the only baseline source — the Linear thread is the history, so nothing is written to the repository.

If no prior comment carries the marker, this run is the first baseline; proceed with no baseline and label the report accordingly.

### 2. Scan and render

Run the scanner against the repository, passing the prior snapshot so deltas are computed:

```bash
node scripts/scan.mjs --repo <path-to-app> --markdown --baseline <prior-snapshot-file-or->
```

Pass the prior snapshot (or bare snapshot JSON) on stdin with `--baseline -`, or omit `--baseline` entirely on the first run. The script prints the full comment: the Convergence Index and its two sub-scores; a contract line; grouped drift tables (styling, interaction/accessibility, typography/icons, effects — lower is better); primitive adoption ratios and a usage inventory (higher is better); a legacy-footprint table; a collapsed top-offenders list; and a collapsed `design-metrics-snapshot` block (fenced JSON inside a `<details>`) for next week. Every row is keyed to the sub-ticket that owns that convergence work (see `references/measurement.md` for the signal-to-ticket map and the Convergence Index formula).

Do not hand-edit the counts, add weights or hidden signals to the index, or reorder signals to look more favorable. The index is a decomposable, repo-relative progress number, not an absolute quality grade — always keep its two sub-scores visible. If a signal moved sharply, you may add one short plain-sentence note above the tables, but the numbers come only from the script.

### 3. Post once and verify

Post the rendered markdown as one comment on the tracking issue via the Linear MCP. Then fetch the issue's comments and confirm the new comment is present and carries the `design-metrics-snapshot` marker.

If posting succeeds but verification fails, report the gap; do not post a second comment.

## Safety and idempotency

- One scan and at most one comment per invocation.
- Each run appends a new weekly datapoint; it does not edit or delete prior comments. Do not run twice for the same week — a duplicate comment would corrupt the visible trend and become the next baseline.
- Counts locate convergence candidates; they are not defects. Never claim the UI is wrong from a count alone, and never recommend a change solely to move a number.
- Keep token definitions and primitive internals excluded (the scanner does this); if the scope changes, update `--config` rather than silently recounting definitions as violations.
- Leave the repository and all other external systems unchanged.

## Verification

Before claiming success, confirm: the scan completed and produced counts for every configured signal; deltas reflect the baseline actually found on the issue (or "first snapshot" when none exists); exactly one comment was posted to the intended issue; and the posted comment carries the machine-readable marker the next run depends on.

## Output contract

Return the tracking issue identifier and comment URL, the current counts and their deltas, the baseline used (date and commit, or "none"), the scope and commit measured, and any signal that could not be computed. Report the exact command run and the exclusions in force.
