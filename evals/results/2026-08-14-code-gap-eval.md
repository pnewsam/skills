# Code-Gap Eval — does an evicted skill produce better CODE?

Date: 2026-08-14
Run: `wf_48797a0d-2b7` (32 agents, 0 errors, ~0.80M tokens)

## Why

The three eviction rounds scored *advice* to questions. This closes the residual
gap: give arms A (skill available) and B (bare) concrete **implementation** tasks
whose correct approach the evicted skills teach, and blind-score the actual CODE
for those properties.

## Method

4 tasks, arms A (reads the archived `SKILL.md`) / B (bare), 2 reps. A strict
judge marks each implementation property present only with a ≥15-char code quote,
plus a holistic production-quality score. Tasks and their skill-taught property:
- `react-search-hook` (react-data-fetching) — cancel stale requests, cleanup,
  loading/error, debounce.
- `react-editable-list` (react-component-design) — stable id keys, controlled
  edit, by-id mutation.
- `py-thumbnail` (python-async-boundaries) — offload CPU work off the event loop.
- `py-user-repo` (python-database-patterns) — scoped session, typed model,
  explicit transaction.

## Results

| Task | A | B | holA | holB |
| --- | --- | --- | --- | --- |
| react-search-hook | 1.00 | 1.00 | 0.935 | 0.935 |
| react-editable-list | 0.833 | **1.00** | 0.82 | 0.85 |
| py-thumbnail | 1.00 | 1.00 | 0.925 | 0.90 |
| py-user-repo | 1.00 | 1.00 | 0.915 | 0.875 |
| **overall** | 0.958 | **1.00** | 0.899 | 0.89 |

**No task where the skill produced better code; no anti-pattern the skill avoided
that the bare model committed.** On `react-editable-list` the bare model's code
scored higher — and the single `key={index}` anti-pattern in the whole run came
from a *skill* arm, not the bare one.

## Verification (journal `wf_48797a0d-2b7`)

- 51 property hits, **0 zeroed** for missing evidence — every property claim is
  backed by a real code snippet.
- Judge discriminating: holistic took 7 distinct values, 0.72–0.95 (a harder
  floor than the advice judge's 0.90), yet A ≈ B.
- All 4 `py-thumbnail` implementations (both arms) offloaded CPU work
  (`run_in_executor`/`to_thread`/pool); cancellation logic appeared across the
  react-search implementations in both arms.

## Verdict

The eviction holds at the level that actually ships: the bare model writes code
with the same skill-taught properties. Residual caveat: this is code returned as
text and judged, not code committed and run against a test suite in a live repo —
a stronger harness would seed a repo and run tests. But across advice (27 cases)
and code (4 tasks), the signal is one-directional.
