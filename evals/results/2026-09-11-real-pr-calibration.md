# Real-PR review calibration — the instrument moves

Date: 2026-09-11. Runs `wf_33f2a0c8-a69` (smoke), `wf_6a787ce4-f88` (calibration, re-scored in place). Harness: `evals/real_pr_review.workflow.js`. Control-only: the current `review-work` against real merged PRs, no candidate prose. 12 cases x 2 reps = 24 reviews, 48 agents, 0 errors, 0 degenerate reviews.

Case data is not in this repository. The subject repo is internal; the harness carries mechanics only, and the diffs, snapshots, anchors and the mapping from the case labels below to real pull requests live outside it. Only aggregates and de-identified shapes appear here.

## Why this run exists

Six prior A/Bs nulled, every one of them saturated: control scored 0.92-1.00 against synthetic anchors, so no candidate could clear its gate. That left two explanations — the model is genuinely at ceiling, or the harness cannot detect anything — and nothing in the suite could tell them apart. This run is the pre-flight ceiling check that was missing, on material we did not author.

## Design

A case is one historical review round on a real merged PR: the diff exactly as it stood at the commit the reviewer commented on, plus a history-free snapshot of the repository at that commit so the arm can read the schema, the callers, the migrations and the tests. Anchors are the findings that reviewer actually raised at that round; each records whether a later commit fixed it. Ground truth comes from the PR, not from the harness author — the construct-validity problem in every prior run.

Integrity measures, because this material makes cheating easy:

- Snapshots are `git archive` exports with no `.git`. Worktrees were built first and discarded: they share an object store, so `git log --all` would have exposed the fix commits.
- Anchors are unreachable from the review prompt. Case data is split into review inputs and an anchors file; the review prompt forbids the anchors file, `gh`, the network, and any lookup of the PR.
- The judge matches on root cause, not wording, and is strict about what counts as reporting a defect: mentioning the area, noting it as untested, or flagging it as a limitation does not count. Ties break toward not-found with a written reason.
- Unanchored findings are classified grounded / ungrounded rather than counted as noise. A real defect the reviewer missed is a win; the old harness would have penalised it.

## Result

| Metric | Control |
| --- | --- |
| Recall (per round) | 0.479 (sd 0.352) |
| Anchors found | 35 of 68 |
| Anticipated (later-round anchors already reported) | 0.67 per review |
| Grounded unanchored findings | 2.92 per review |
| Ungrounded unanchored findings | 0.33 per review |

Recall came out at 0.479 in both judge passes, the second with a materially different prompt. That stability is the best evidence we have that the matcher is measuring something.

Per case:

| Case | Anchors | Recall | Anticipated | Grounded extras |
| --- | --- | --- | --- | --- |
| PR-A round 1 | 6 | 0.667 | 0 | 3.0 |
| PR-B round 1 | 3 | 0.667 | 0 | 0.5 |
| PR-C round 1 | 6 | 0.583 | 1.0 | 3.0 |
| PR-C round 2 | 4 | 0.500 | 0.5 | 2.0 |
| PR-C round 3 | 3 | 0.333 | 0 | 5.5 |
| PR-C round 4 | 2 | 0.000 | 0 | 6.0 |
| PR-C round 5 | 1 | 0.000 | 0 | 4.0 |
| PR-D round 1 | 3 | 0.333 | 3.5 | 0.5 |
| PR-D round 2 | 1 | 1.000 | 0.5 | 4.0 |
| PR-D round 3 | 3 | 0.667 | 1.5 | 1.0 |
| PR-D round 4 | 1 | 0.500 | 1.0 | 2.5 |
| PR-D round 5 | 1 | 0.500 | 0 | 3.0 |

**There is headroom.** The null streak was not the harness failing to detect; it was synthetic material that put control at ceiling. A 1,600-line endpoint with a schema, consumers and migrations behind it does not.

## Where the misses cluster

Recall degrades across rounds of the same PR: PR-C runs 0.58, 0.50, 0.33, 0.00, 0.00. Early rounds catch the obvious defects; each round leaves a harder residue. Late rounds are the valuable test material.

Thirteen anchors were missed in both reps. Three require access we did not grant — another branch in flight, another branch's interaction, a consumer in a different repository. Those measure access, not review quality, and belong in their own tier.

The other ten are findable from the diff and snapshot the arm was given, and they fall into five shapes:

1. **Degenerate parameter values.** An empty repeatable query value arriving as `[""]`, truthy, compiling to `IN ('')` and returning a 200 with zero rows. An extreme but valid ISO bound underflowing `datetime` into a 500.
2. **Whether a computed number means what it claims.** A rate returning 0.0 with an empty denominator, reporting healthy where there is no data. A range boundary that claims coverage of rows the sample dropped.
3. **Whether an index actually serves a new filter.** A no-match filter on an unindexed column scanning the whole window, because the limit caps matches rather than rows examined.
4. **Whether any green check executes the changed code.** A migration whose first execution would be production: unit tests are SQLite, the graph test never opens an engine, and the migrate job is gated on a label the PR does not carry. Control asserted the migration was safe instead.
5. **Whether a new test engages what it claims.** A cap patched to 10 against three rows, so the inner bound never binds and the test would pass with the defect present.

That is a candidate delta written from evidence rather than guessed, which was the point of running control alone first.

## The recall number understates control

Control reports 2.9 grounded findings per review that the reviewer never raised, and some are defects that reviewer raised in a **later** round. Five distinct anchors were anticipated this way, four of them `blocking:`:

- the capped total changing an existing client contract from exact-or-null to a silent lower bound (anticipated in 5 earlier-round reviews);
- embeddings rows adding only successes to an error-rate denominator (3);
- a branch forcing a lifetime-sized count scan because the predicate pairs with no available index (2);
- a cross-PR interaction where an unindexed filter scans the whole history, which the reviewer raised two rounds after control did and noted he had missed earlier himself (1).

Per-round scoring counts these as noise. They are credited separately as `anticipated` rather than folded into recall, deliberately: a later round can concern code the earlier commit does not contain, so crediting them in the denominator would manufacture a flattering number the same way the synthetic cases manufactured ceilings.

Control also raised grounded defects nobody raised at any round — latency percentiles pooling streamed and non-streamed requests into one population despite a `stream` discriminator existing for exactly that reason, reported in all five PR-C rounds, and a route inventory in the docs missing the new endpoint. These are unverified against the repository's own intent and are reported as observations, not as confirmed defects.

## Limitations

The reviewer's comments are in this registry's finding model, so some anchors may have been produced with `review-work` itself. That tilts the test toward control and against any candidate — the opposite of the usual bias, and it belongs in any result this instrument produces.

Two reps give a variance estimate, not power; sd 0.352 is large, and per-case means built on n=2 should not be read as rankings. The judge is a single model with no calibration set and no negative control — it has never been shown a deliberately sabotaged review to confirm it scores one low. Anchors labelled `not-fixed` were kept, since several were deferred or settled by argument rather than refuted, but that is a judgment call and some may not be defects. Four PRs from one service is not a sample of review work in general.

## Disposition

The registry is unchanged; this run tested no candidate. What it establishes is that the instrument has range, which no previous eval in this suite could claim.

Next is a real A/B on this material, with the candidate delta written from the five miss shapes above rather than from a comparison with someone else's registry. Before that, the harness self-test still has not been run: a sabotaged review through this judge, to confirm it scores one low. Until that passes, a positive result here is as provisional as the nulls were.
