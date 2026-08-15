# UI Knowledge-Eviction Pilot — Trials

<!-- COPY THIS FILE to evals/results/2026-08-XX-ui-family.md and fill every
     <<placeholder>>. Delete this comment. The raw answers stay in the journal;
     the numbers below are what scripts/score_ab.py verified. -->

Date: <<YYYY-MM-DD>>
Run: `wf_<<run id>>` (<<N>> agents, 0 errors, ~<<M>> tokens, ~<<min>> min)
Baseline: `2026-08-15-ui-family-baseline.md` <<or delete>>

## Method as run

- Arms per `evals/ui_family_cases.json`: **A** (prose ui-* family installed),
  **B** (prose ui-* removed via `scripts/extract_ui_pilot.sh --apply`; only the
  `ui-color`/`ui-spacing` checkers remain), **C** (B + `docs/ui-substitute-note.md`:
  axe-core, Playwright screenshot diff, kept checks). 3 reps per case, fresh
  context, via the `ui-pilot-trials` workflow.
- Answering and scoring were separate agents; scorers saw prompt + answer +
  anchors only, never the arm label.
- Arm C ran only where `mean(A) − mean(B) > 0.15` (the recovery test).
- Degenerate reps (returned preamble only) are excluded and listed under
  Spot-check; they do not count toward the means.

## Raw result

| Overall | A | B | Δ(B−A) | C (n cases) |
| --- | --- | --- | --- | --- |
| mean score | <<…>> | <<…>> | <<…>> | <<…>> |

Gate (`mean(B) >= mean(A) − 0.10` and no B-only `must_exclude` violation):
**<<PASS / FAIL>>** <<one line on how the strict clause was assessed>>

`python3 scripts/score_ab.py evals/ui_family_cases.json <scores.tsv>` —
<<paste the emitted per-case table and verdict here; keep it if it matches
below>>

| Case | skill | kind | A | B | C | Δ(B−A) | note |
| --- | --- | --- | --- | --- | --- | --- | --- |
| empty-state-copy | ui-content | canonical | | | — | | |
| row-action-overflow | ui-actions | openjudgment | | | — | | |
| chart-choice | ui-data-viz | canonical | | | — | | |
| elevation-scale | ui-depth | openjudgment | | | — | | |
| email-client-hell | ui-email | canonical | | | — | | |
| toast-banner-inline | ui-feedback | openjudgment | | | — | | |
| settings-layout-choice | ui-forms | openjudgment | | | — | | |
| icon-only-accessibility | ui-icons | canonical | | | — | | |
| settings-page-zoning | ui-layouts | openjudgment | | | — | | |
| first-run-value | ui-onboarding | openjudgment | | | — | | |
| table-vs-card-list | ui-patterns | canonical | | | — | | |
| responsive-breakpoint | ui-responsive | canonical | | | — | | |
| type-scale | ui-typography | canonical | | | — | | |
| hierarchy-critique | visual-hierarchy | openjudgment | | | — | | |

## Spot-check (journal `wf_<<run id>>`)

Verify, do not trust the clean numbers:

1. <<list degenerate reps excluded (case, arm, rep) and why>>
2. <<any case where A > B by >0.25: check C recovered it (CONVERT candidate) or not>>
3. <<judge leniency note — symmetric across arms? absolute scores inflated?>>
4. `visual-hierarchy` is **decided separately** from the other 13: state its
   verdict in its own line here even when the family verdict is unified.

## Verdict

<<Family verdict — evict the 13 prose skills (keep `ui-color`, `ui-spacing`;
slim/remove `ui-expert` to a survivor index) / convert per-case [list] / keep
prose [list, with the case-level evidence]>>. <<visual-hierarchy verdict — keep
as a lone survivor or evict>>.

When stating the verdict, say whether the tied cases were `canonical`
(well-known trap the model has internalized — weaker evidence) or
`openjudgment` (genuine trade-off — stronger evidence), per the case-file gate.

## Limits

Non-canonical-case bias? Even the openjudgment prompts are text answers, not
rendered artifacts; render + screenshot would be the harder probe (Phase 4).
Judge leniency and rep count — say both.

## Recommended next step

<<action now mechanically gated by scripts/extract_ui_pilot.sh --apply>>.
Per-case CONVERT candidates (if any): reduce to a short review checklist +
objective, not restored prose.

## Status

Trials <<complete / pending spot-check>>; extraction <<staged, not applied /
applied on branch pilot/ui-eviction>> — registry <<unchanged / at arm B>>.