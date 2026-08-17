# Cross-cutting method trio — family A/B (2026-08-17)

Family: `typescript-types`, `error-handling`, `async-patterns`
Case file: `evals/cross_cutting_pilot_cases.json` (12 cases, 4/skill)
Harness: `cross_cutting_ab.workflow.js` (blind answer + blind score, deterministic
anchor scoring), 3 full runs with captured answers pooled (204 clean reps).
Scores: `evals/results/2026-08-17-cross-cutting-scores.tsv`.
Gate (pre-registered in the case file): EVICT if `mean(B) >= mean(A) - 0.10` AND
no B-only `must_exclude` violation on a case where A has none.

## Method

- **Arm A** (control): answer agent reads the skill's `registry/<skill>/SKILL.md`
  and applies it. **Arm B** (bare): capable base model, forbidden from reading any
  guidance. **Arm C** (recovery): substitute-check context
  (`docs/cross-cutting-substitute-note.md`); runs only where `mean(A)-mean(B)>0.15`.
- Answer generation and scoring are **separate blind agents**. The scorer reads the
  case anchors from the case file and never learns the arm. Per-rep score is
  computed deterministically from anchor counts:
  `(must_include satisfied / total) - 0.34 * (must_exclude present)`, floored at 0.
- 3 answer-capturing runs (`wf_31a07aaa-d0c`, `wf_b1556ffe-98b`, and the
  answer-enriched replay of `wf_300ccfb1-35c`) pooled → 5–9 clean reps per cell.

## Measurement-integrity note (important)

The raw first pass looked like a decisive evict (bare 0.94 vs skill 0.83). **That
gap was an artifact.** ~1 in 10 answer-generations returned harness/system-context
leakage instead of an answer (`"To many degrees."`, `"You are Claude Code…"`,
`"<system-reminder>…"`, MCP-server lists, a fabricated todo list, and even
prompt-injection-styled text). The blind judge correctly scored every one of these
0; by chance they landed disproportionately on arm A, manufacturing a fake gap.
Every single 0 across all runs was traced by hand to such a degenerate answer —
**not one genuine anchor miss.** Two fixes:

1. **Workflow hardened** with a degeneracy detector (harness-signature markers +
   length) and up to 5 answer retries so a flaky subagent never contaminates a cell.
   Remaining leaks were excluded from the pool by the same marker filter.
2. **`scripts/score_ab.py --exclude` was silently a no-op** — it stored `rep` as an
   int but compared against textual score rows, so no exclusion ever applied. Fixed
   and verified. This affects the integrity of any prior run that leaned on
   `--exclude` to drop degenerate reps; those should be re-checked.

## Result (pooled, degenerate leaks removed)

Per-skill means and `must_exclude` violations:

| Skill | A mean | B mean | A viol | B viol | reps A/B |
| --- | --- | --- | --- | --- | --- |
| typescript-types | 1.000 | 0.991 | 0 | **1** | 36 / 36 |
| error-handling | 1.000 | 1.000 | 0 | 0 | 29 / 33 |
| async-patterns | 0.975 | 1.000 | **1** | 0 | 34 / 36 |

Overall A=0.992, B=0.997. Whole-family `score_ab.py` verdict: **FAIL** — the mean
clause passes decisively, but the strict clause trips on the single B-only
violation on `tt-discriminated-fetch-response`.

The two non-degenerate imperfections in the whole corpus:
- **B, `tt-discriminated-fetch` (1/36):** bare model typed the response but reached
  for an unsafe `as` cast — a `must_exclude` the skill arm never hit.
- **A, `ap-bounded-parallelism` (1/34):** the *skill* arm once wrote a fail-fast
  pool that halts the batch on first failure. Favors evict, if anything.

## Verdict (per skill, not blanket)

- **`error-handling` → EVICT.** Perfect 1.000/1.000 tie, zero violations over 62
  clean reps. Pure code-writing judgment with no deterministic checker; the base
  model has fully absorbed it. Archive to `archive/cross-cutting-evicted/`.
- **`async-patterns` → EVICT.** Bare model ties or beats (A=0.975 only because of
  the skill arm's own fail-fast slip; B=1.000), zero B-only violations. Base model
  handles concurrency, cancellation, stale-result guarding, bounded parallelism,
  timeout cleanup natively. Archive to `archive/cross-cutting-evicted/`.
- **`typescript-types` → CONVERT (do NOT evict).** Means tie, but the strict clause
  correctly fires: the bare model occasionally emits an unsafe cast / `any`, which
  the skill prevents — and that exact failure mode is deterministically catchable by
  `tsc --strict` + `@typescript-eslint` `no-explicit-any` / `no-unsafe-assignment` /
  `no-unsafe-argument` / `consistent-type-assertions` (the arm-C substitute). Keep a
  one-paragraph objective + point at the lint/tsc check; drop the prescriptive
  prose. Same shape as `ui-color` / `ui-spacing`. Arm C was not triggered because
  `mean(A)-mean(B) < 0.15`; the convert signal here is the strict-clause violation
  against an existing deterministic check, not a mean gap.

Net: −2 active skills (evict eh, ap), 1 converted to a check (tt).

## Reproduce

    node scripts/scaffold_scores.mjs --cases evals/cross_cutting_pilot_cases.json
    python3 scripts/score_ab.py evals/cross_cutting_pilot_cases.json \
      evals/results/2026-08-17-cross-cutting-scores.tsv
