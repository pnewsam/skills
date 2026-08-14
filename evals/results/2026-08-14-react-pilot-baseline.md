# React Knowledge-Eviction Pilot — Baseline

Date: 2026-08-14

## Question

Does the `react-*` knowledge prose change answer quality beyond what the base
model produces? This pilot is the first application of the bitter-lesson
rebalancing plan (`docs/registry-rebalance-plan.md`) and deliberately re-tests
the 2026-07-31 retention audit, which kept React on plausibility grounds. This
time the keep/evict decision must rest on measured A/B evidence.

## Structural baseline (captured, deterministic)

- `validate_registry.py`: **0 errors**, 54 warnings, 108 active skills, 49 eval
  cases. Warnings are pre-existing cosmetic issues (missing `default_prompt` in
  `agents/openai.yaml`), unrelated to this pilot.
- `check_prose_wrap.py`: react-* files are clean; the 5 flagged files are
  elsewhere (`mindsdb-track-design-system-metrics`, `ship-epic`,
  `validate-feature`).
- Family under test: **12 skills, 2,497 lines** of prose.
  - largest: `react-accessibility` (317), `react-performance` (311),
    `react-form-patterns` (266), `react-component-design` (257).
- Catalog exposure: a dedicated `react` profile (all 12) and membership in the
  `advisory` profile via `includes`.

## Instrumentation authored this phase

- `evals/react_pilot_cases.json` — 10 quality/routing cases spanning the family,
  each targeting a specific trap the prose exists to prevent (derived-state
  effect, stale-closure interval, missing cleanup, index keys, premature memo,
  fetch race, context re-render, form re-render, modal focus trap, testing
  internals). Kept separate from `high_use_cases.json` (different schema; not
  parsed by the validator).
- `docs/react-substitute-note.md` — the arm-C replacement: lint/test/compiler
  checks that enforce most of the prose deterministically, plus the two areas
  with no tool coverage to watch (component decomposition, state/context
  judgment).
- `scripts/extract_react_pilot.sh` — reversible extraction. Dry-run verified;
  `--apply` moves the family to `archive/react-pilot/` on a `pilot/react-eviction`
  branch and updates `catalog.json`; `--tier-a` prints the separate-repo recipe
  (needs `git-filter-repo`, not installed here). Not applied — registry
  unchanged, `git status` shows only new files.

## A/B protocol

Three arms per `react_pilot_cases.json`:

- **A (control):** registry with react-* installed.
- **B (bare):** registry with react-* removed (run `--apply` on a branch).
- **C (substitute):** react-* removed + the lint/test substitute context.

Run each case 3x per arm in fresh context. Score 0–1 against the case anchors
(`must_include` / `must_avoid`). Record raw answers before scores.

## Eviction gate

Evict the family when `mean(B) >= mean(A) - 0.10` **and** arm B commits no
`must_avoid` violation on any case arm A avoids. Any case where A beats B by
>0.25 and C does not recover it flags that one sub-skill as a CONVERT candidate
(reduce to a check + objective), not a blanket keep.

## Status

Phase 0 complete: baseline captured, cases + substitute + reversible extraction
staged. **Trials pending** — they require model-in-the-loop runs in disposable
repos and cannot be self-scored here. Next: run arms A/B/C, fill scores into a
`results/2026-…-react-pilot-trials.md`, then apply the gate.
