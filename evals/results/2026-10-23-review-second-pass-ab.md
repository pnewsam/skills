# Review second pass: default vs opt-in (2026-10-23)

Question: does #66 (one review pass by default, a second pass only when requested or for high-consequence changes) lose defects that main's default second pass catches?

## Method

`evals/real_pr_review.workflow.js` on the 12 calibration rounds (PR-A to PR-D), 2 reps per arm, `effort: medium`, claude-opus-5-5. Both arms used a snapshot of main after #73. The #66 arm had #66's three review files applied: review-work, its review protocol, and the finding model.

A probe showed that workflow reviewer agents cannot start subagents, so a skill's "take a second context-isolated pass" never runs inside this harness. The `secondPass` option now has the harness run it. A fresh reviewer gets the diff and the first review, re-grounds or drops each finding, then adds what was missed. The judge scores that final review.

| Arm | Passes | Skill text |
| --- | --- | --- |
| main | 2 (harness-run second pass) | main |
| pr66 | 1 | main + #66 review changes |

## Results

| Measure | main | pr66 |
| --- | --- | --- |
| Anchors found (anchor-weighted) | 25/68 (0.368) | 22/68 (0.324) |
| Rep 1 / rep 2 | 11/34, 14/34 | 11/34, 11/34 |
| Case-mean recall | 0.333 | 0.333 |
| Distinct anchors ever found | 14 | 13 |
| Grounded unanchored findings per review | 1.25 | 1.25 |
| Ungrounded findings per review | 0.17 | 0.08 |
| Later-round anchors anticipated per review | 0.50 | 0.58 |
| Agents | 72 | 48 |

Main beat pr66 on 3 rounds, pr66 beat main on 2, and 7 tied. 18 anchors were missed in all four runs.

## Findings

- No measurable difference. Main's 3-anchor edge equals main's own rep-to-rep swing (11 vs 14), and the round-level split is 3–2 with 7 ties.
- The default second pass did not buy precision either: ungrounded findings were rare in both arms.
- It cost about 50% more reviewer agents.
- Both arms found far fewer anchors than the September single-pass calibration (35/68) and raised fewer grounded extras (1.25 vs 2.92 per review). The model changed (Opus 5.5) and effort was pinned at `medium`, which on 5.5 means less thinking than earlier defaults. Effort, not the second pass, looks like the larger lever on this set.

## Limits

Two reps over 12 rounds from four PRs. These are the calibration rounds, so they are not held out, though #66 was not written from their misses. Arm pr66 bundles #66's finding-model compression with the opt-in change. A null here does not show the second pass is useless on larger or contested changes, where #66 still calls for it. Only #66's review changes were tested; its work-conventions change was not.

## Follow-up: reviewer effort

The large drop from September prompted one more arm. It used #66's single-pass text with the reviewer at `effort: high`, while the judge stayed at `medium` via the new `judgeEffort` option. The baseline is the pr66 arm above: same text and judge setting, reviewer at `medium`.

| Single pass | medium | high |
| --- | --- | --- |
| Anchors found | 22/68 (0.324) | 31/68 (0.456) |
| Rep 1 / rep 2 | 11, 11 | 15, 16 |
| Rounds won | 0 | 5 (7 ties) |
| Distinct anchors ever found | 13 | 17 (a superset) |
| Grounded unanchored per review | 1.25 | 1.83 |
| Ungrounded per review | 0.08 | 0.08 |

Every rep at `high` beat every rep at `medium`, and `high` lost no round. It found every anchor `medium` found plus four more, with no added noise. A single `high` pass also beat `medium` with the default second pass (31 vs 25) using two thirds of the reviewer runs. That puts it close to the September calibration (35/68), so the drop was mostly effort. Effort is the lever for review recall on this set; a second pass is not.

Limits: the two runs ran separately with a stochastic judge on the same settings. Rounds split 5–0 with 7 ties, a one-sided sign-test p of about 0.03. Total tokens per agent were similar across runs (about 61k vs 57k), so the extra thinking cost is modest.

