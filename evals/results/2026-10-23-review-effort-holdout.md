# Review effort: xhigh and a held-out replication (2026-10-23)

Question: does the calibration finding (a single high-effort pass found 31/68 anchors vs 22/68 at medium) hold on PRs the eval had never seen, and does `xhigh` add more?

## Method

`evals/real_pr_review.workflow.js` with main's review-work text, single pass, judge pinned at `medium`, 2 reps.

The held-out set is 12 rounds and 68 anchors from 8 further merged PRs in the same repository. Anchors come from five independent reviewers: one human from the calibration set, three other humans, and Copilot. Rounds the team reviewed with this registry's own skill were excluded, because they would score the skill against itself. No skill text was written from these rounds. Case data stays in the private eval data directory.

## Results

| Set | Effort | Anchors found | Rep 1 / rep 2 | Ungrounded per review |
| --- | --- | --- | --- | --- |
| Calibration | medium | 22/68 | 11, 11 | 0.08 |
| Calibration | high | 31/68 | 15, 16 | 0.08 |
| Calibration | xhigh | 32/68 | 17, 15 | 0.04 |
| Held-out | medium | 44/136 | 21, 23 | 0.42 |
| Held-out | high | 40/136 | 16, 24 | 0.54 |

On held-out rounds, high beat medium on 3 rounds and lost 4, with 5 ties. On calibration, xhigh beat high on 2 rounds and lost 3, with 7 ties. Pooled over both sets, high found 71 anchors and medium 66, out of 204 each.

## Findings

- The effort gain did not replicate. On held-out PRs, high found slightly fewer anchors than medium. One arm's two reps (16 vs 24) differed by more than the gap between arms.
- xhigh adds nothing over high and ran far longer.
- The calibration result rested on 12 rounds from four PRs that the eval was calibrated on, compared across separate runs. Treat earlier single-set A/Bs here as provisional, including the #66 second-pass null.

## Limits

Two reps per arm. Held-out anchors come from different reviewers with different standards; Copilot's comments are narrower than a human reviewer's. Runs ran concurrently, so wall-clock times are not comparable.
