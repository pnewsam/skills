# React Knowledge-Eviction Pilot — Trials

Date: 2026-08-14
Run: `wf_98c10eb8-e7e` (84 agents, 0 errors, ~1.96M tokens, ~3.8 min)
Baseline: `2026-08-14-react-pilot-baseline.md`

## Method as run

- Arms **A** (skill file in context), **B** (bare model, no files), **C**
  (substitute note), 2 reps per case, via the `react-pilot-trials` workflow.
- Answering and scoring were separate agents. Scorers were **blind to arm** —
  they saw only prompt, answer, and the case anchors.
- Arm C ran only where `mean(A) − mean(B) > 0.15` (the recovery test).

## Raw result

| Overall | A | B | Δ(B−A) |
| --- | --- | --- | --- |
| mean score | 1.00 | 0.95 | −0.05 |

Gate (`B ≥ A − 0.10` and no B-only `must_avoid` violation): **PASS.** Zero
`must_avoid` violations in any arm. No convert candidates.

| Case | skill | A | B | C | note |
| --- | --- | --- | --- | --- | --- |
| derived-state-effect | react-hooks-effects | 1.0 | 1.0 | — | tie |
| stale-closure-interval | react-hooks-effects | 1.0 | 1.0 | — | tie |
| effect-cleanup-subscription | react-hooks-effects | 1.0 | 1.0 | — | tie |
| list-key-index | react-component-design | 1.0 | 1.0 | — | tie |
| premature-memo | react-performance | 1.0 | 1.0 | — | tie |
| fetch-waterfall-cancel | react-data-fetching | 1.0 | 1.0 | — | tie |
| context-rerender | react-state-management | 1.0 | 1.0 | — | tie |
| controlled-form-perf | react-form-patterns | 1.0 | 0.5 | 1.0 | **artifact (see below)** |
| modal-focus-trap | react-accessibility | 1.0 | 1.0 | — | tie |
| test-implementation-details | react-testing | 1.0 | 1.0 | — | tie |

## Spot-check (journal `wf_98c10eb8-e7e/journal.jsonl`)

The clean numbers were verified, not trusted:

1. **The only A>B gap is a harness artifact, not a skill win.** One of the two
   arm-B reps on `controlled-form-perf` returned the agent's preamble ("…Let me
   write a practical, opinionated answer.") instead of an answer — 379 chars, 0
   anchors hit, scored 0.0. Its sibling rep scored 1.0, averaging 0.5. The other
   nine cases tie at 1.0/1.0. **With the artifact excluded, B ties A on every
   case.** This strengthens the evict signal on the merits.

2. **The scorer was lenient.** Only 1 of 42 scored answers was non-perfect (the
   artifact above). The judge credited anchors generously. Because leniency is
   symmetric across arms, the *comparison* A ≈ B is robust, but the absolute
   "1.0" is a ceiling, not a measure of quality.

## Verdict

On these ten canonical React pitfalls, the ~2,497 lines of `react-*` prose
**changed nothing** the base model didn't already produce, and the lone apparent
exception was a returned-preamble artifact. The gate passes. This is real
evidence for evicting the **canonical-knowledge** portion of the family.

## Limits — why this is not yet "delete react-\*, done"

- **Canonical-case bias.** These are the most-documented React traps — the
  weakest test for the skills, and exactly where the model is strongest. The
  harder, less-canonical judgment (large-app architecture, component
  decomposition, state/context design, error-boundary strategy) was
  under-probed. The substitute note itself flagged decomposition/state judgment
  as the least tool-covered — and no case stressed it.
- **Lenient judge + 2 reps.** Absolute scores are inflated and one flaky sample
  moved a case mean by 0.5. A stricter judge and ≥3 reps would tighten it.

## Recommended next step

One cheap hardening round before permanent removal and before generalizing to
other families: (1) a stricter scoring rubric/judge, (2) 3–4 harder cases on
architecture/decomposition/state-design judgment. If arm B still ties, evict
`react-*` (run `scripts/extract_react_pilot.sh --apply` on the pilot branch) and
roll the same protocol to `python-*` and `quality-*` next. If a hard case shows
a durable A>B that C doesn't recover, that one sub-skill converts to a
check + objective rather than being evicted.

## Status

Trials complete and spot-checked. Extraction still staged, not applied —
registry unchanged.
