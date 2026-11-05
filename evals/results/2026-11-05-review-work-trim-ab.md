# review-work trim A/B (stopped early; provisional read: keep control)

## Question

Does the process prose in `review-work` change review quality, or does the base agent loop already do it? The trim arm keeps only three kinds of content: boundaries, the specific checks that read outward from the diff (including the data-honesty pass), and pointers to the references. It cuts reading-order instructions, routing to other operations, and second-pass guidance, which now sits behind a pointer.

- Control: `registry/review-work/SKILL.md` at 88404ac (514 words).
- Trim: `evals/candidates/review-work-trim/SKILL.md` (249 words).
- All references, including the finding model, are byte-identical in both arms. `evals/build_arm_snapshots.sh` builds both snapshots and fails if anything other than this one file differs.

The trim adds no new checks. The five calibration miss shapes are deliberately left out, so this tests removal only.

## Instrument

The test uses `evals/real_pr_review.workflow.js` on the held-out set: 12 rounds, 68 anchors, and 136 anchor-judgments per arm over 2 reps. Neither arm was written from these rounds. The reviewer runs at `effort: high`, matching the shipped frontmatter, and the judge runs at medium.

Arguments: `caseIds` lists the 12 held-out rounds and `dataDir` points at the private held-out data. Both are kept out of this public repo, and the case-to-PR mapping stays private. The other settings are `skillsDir` and `armSkills`, which point each arm at its snapshot, plus `arm_deltas` `{control: "", trim: ""}`, `reps: 2`, `effort: "high"` and `judgeEffort: "medium"`.

Cost: 48 reviews and 48 judge calls, about 96 agents.

## Gate (set before running)

Earlier held-out runs swung by up to 8 anchors between reps of the same arm, so a gap smaller than that is treated as a tie. A tie favors the shorter skill.

- **Ship the trim** if it finds at least as many anchors as control minus 8 (out of 136), and its ungrounded extras per review are no more than control's plus 0.10. Precision is the outcome to watch most closely, because it is the skill's only measured effect against a bare agent.
- **Keep control** if the trim is more than 8 anchors behind, or its ungrounded rate exceeds that margin.
- **Not tested:** boundaries and routing, meaning commits, posted reviews, and handoff to `execute-work`. The harness is review-only, and both arms keep the boundary text, so a tie says nothing about it.

## Result

The run (`wf_e50c3765-4a4`) was stopped on cost after 35 reviews and no judge calls. It had spent about $70 and moved the 5-hour usage window from 9% to 43%. My estimate of 8–9M tokens before the run left out cache reads, which made up 138M tokens.

**Provisional read: no evidence the trim is safe.** I scored rep 1 of each arm on the 10 rounds both arms completed, which covers 60 anchors. Scoring was by hand, with arm labels shuffled and hidden until all 10 rounds were scored. The same strict rule as the harness judge applied, so a caveat or a "worth watching" note did not count.

| | Anchors found (of 60) | Rounds won |
|---|---|---|
| Control | 22 | 4 |
| Trim | 18 | 0 |

Six rounds tied. Control won each of its four rounds by exactly one anchor. The trim's misses were secondary sites and mismatches between the description and the code that control caught. I saw no difference in ungrounded findings: both arms grounded nearly everything.

The 4-anchor gap is inside the margin set before running (8 of 136, scaled to roughly 4 of 60), so the gate technically passes. The direction is one-sided, though: 0 rounds won and 4 lost. Shipping on a margin that thin goes against the reason the gate exists. **Decision: keep the current skill.** Do not spend more to settle the question.

Limits: one rep per arm, and a single scorer who also wrote the trim, although the scoring was blind. The rep-to-rep variance seen before (up to 8 of 68) is larger than this gap.
