# Harness validation — does this instrument measure anything, and does the skill do anything

Date: 2026-09-11. Runs `wf_66b3bb98-d2f` (negative control) and `wf_6a787ce4-f88` (bare arm; control replayed from cache). Prompted by the owner's question after seven nulls and one overfit positive: what real data suggests the eval harness is effective?

Two tests, neither of which had ever been run.

## 1. Negative control — does the judge credit garbage?

Four deliberately worthless reviews, scored by a byte-identical copy of the live judge prompt against real anchors on four cases. 16 runs, 72 anchor judgments.

| Sabotage | Recall | Grounded extras | Ungrounded extras |
| --- | --- | --- | --- |
| `vacuous` — clean, follows patterns, add docstrings, ship it | 0.000 | 0 | 3 |
| `fabricated` — five confident blocking findings about locks, retries, injection, fd leaks, none present | 0.000 | 0 | 5 |
| `restated` — the PR description's own claims echoed back as verification | 0.000 | 0 | 0 |
| `mismatched` — a competent React review aimed at a Python SQL endpoint | 0.000 | 0 | 5 |

**Not one anchor credited, in any run.** The classification is also correct in the other direction: `fabricated`'s five inventions all land as ungrounded rather than grounded, so authoritative-sounding fabrication earns nothing; and `restated` produces no extras at all, because echoing the intent back is not a finding either way.

Set against control scoring 0.479 on these same cases with the same judge, this establishes **specificity**: real reviews get credit, worthless ones get none.

It does not establish sensitivity. A judge answering "not found" to everything would also score zero here. We know it is not that, since control scores 0.479 — but whether its "found" calls are *correct* cannot be settled from inside the system. That needs a human to read the judge's notes against their own reading of one case.

## 2. Bare versus skill — does `review-work` beat no skill at all?

The test this suite never ran. Every prior comparison was skill versus skill-plus-delta. Identical artifacts, identical rules, identical output ask; the bare arm reads no skill, guidance, or convention file. Its instruction is phrased the way any competent reviewer would state it rather than in the registry's finding-model vocabulary — coaching it would understate the skill, handicapping it would overstate it. That phrasing is a judgment call that moves the result.

| Metric | bare | `review-work` | delta |
| --- | --- | --- | --- |
| Recall (anchor-weighted) | 0.412 | 0.515 | **+0.103** |
| Anchors found | 28 / 68 | 35 / 68 | +7 |
| Recall (case-mean) | 0.382 | 0.479 | +0.097 |
| Grounded unanchored findings | 5.21 | 3.25 | −1.96 |
| Ungrounded unanchored findings | 0.333 | 0.125 | −0.208 |
| Anticipated later-round anchors | 0.71 | 0.67 | −0.04 |

Paired by case: the skill wins 3, loses 0, ties 9. Sign test two-sided p = 0.250.

**The skill does something, and it is smaller and different than the registry's framing implies.** It finds seven more real defects out of sixty-eight. Its larger and more consistent effect is on noise: the bare arm produces 60% more unanchored findings and **2.7x** more ungrounded ones. What `review-work` mostly buys is focus — fewer claims, better grounded — not coverage.

Nine of twelve cases tie. On three quarters of this material the skill changes nothing measurable. Both arms miss the same thirteen anchors; hard defects stay hard with or without it.

## What this does and does not license

Established: the judge does not credit worthless reviews; the harness detects a known-real difference in the expected direction, with no case going the wrong way.

Not established: that the effect is large, that p = 0.25 on three non-tied cases is more than suggestive, that any of this generalizes past four PRs from one service with one author and one reviewer in one domain, or that the judge's positive calls are correct.

Emphatically not established: that the *registry* works. This tested one skill. Nineteen others have never been compared against their own absence on real work, and the cheapest honest reading of this result is that a skill's contribution may be a small precision gain rather than the capability its description claims.

## Cost

The negative control took 16 agents, 689k tokens, 53 seconds — the cheapest test in the suite, and the only one that could have voided every other result. It should have been built first. It was built ninth.

## Correction to the record

The checks A/B (`2026-09-11-review-checks-ab.md`) reported recall as a mean over cases, which weights a 1-anchor case equally with a 6-anchor case; four of twelve cases have a single anchor, carrying a third of that metric for a ninth of the defects. Anchor-weighted, that result is +0.162, not +0.257. More seriously, its five checks were written from the miss list of these same twelve cases and then evaluated on them — training and test are the same set, so the gain is not evidence of generalization. That change was closed unmerged and its write-up should be read with both corrections attached.
