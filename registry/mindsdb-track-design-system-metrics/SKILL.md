---
name: mindsdb-track-design-system-metrics
description: Measure reproducible MindsDB UI convergence signals and compare compatible snapshots. Read-only scan/report by default; posts one verified Linear progress comment only when requested. Preserves measurement definitions and limitations without treating counts as defects.
---

# Track design-system metrics

Apply `work-conventions`. Use `references/measurement.md` for scope, units, exclusions, baseline compatibility, and interpretation. The scanner's historical project defaults must be checked against the actual target repository; override its config when appropriate and disclose changes that break comparability.

## Scan and report

Run `scripts/scan.mjs` with the intended repository and configuration. It reads files and produces counts/markdown. Use a supplied baseline or the most recent compatible snapshot from the agreed tracking record. Reading a live tracker requires an available authenticated connection; lack of that connection does not prevent a requested local scan with an explicit missing-baseline limitation.

Capture the measured revision and relevant local changes, scope, method, exclusions, baseline identity, and confidence. Do not label the working tree as a clean commit when it differs. Counts and composite progress scores are investigation signals, not defects or absolute quality grades. Do not alter counts, weights, or scope to improve the reported trend.

## Optional publication

Scan/report is the default. Post only when the user requests a comment or an established recurring-task instruction authorizes it. ENG-641 is historical destination context; resolve the actual intended issue. Inspect existing snapshot markers before posting to avoid duplicate observations for the same revision/window.

Post the rendered report once, then read back the comment and its design-metrics-snapshot marker. After an ambiguous response, search actual comments before retrying. If the write succeeded but verification is unavailable, report its identity and gap rather than posting again. Do not edit source, create issues, commit, or mutate other tracker fields.

Return the actual counts, compatible deltas or first-baseline status, limitations, and comment URL only if posted. Refer to `analyze-work` when interpretation and prioritized work candidates are requested; no separate analysis is required merely to report a scan.
