# review-work checks A/B — adopted

Date: 2026-09-11. Run `wf_6a787ce4-f88` (control arm replayed from cache; candidate arm run fresh). Harness `evals/real_pr_review.workflow.js` over 12 real review rounds from four merged PRs, 2 reps per arm, 96 agents, 0 errors, 0 degenerate reviews. Gate registered in `evals/review_checks_ab_gate.md` before the run, commit `2ff4510`.

## Result

| Metric | control | checks | delta |
| --- | --- | --- | --- |
| Recall | 0.479 (sd 0.352) | **0.736** (sd 0.344) | **+0.257** |
| Anchors found | 35 / 68 | 46 / 68 | +11 |
| Anticipated later-round anchors | 0.67 | 1.08 | +0.41 |
| Grounded unanchored findings | 3.13 | 2.38 | −0.75 |
| Ungrounded unanchored findings | 0.33 | 0.29 | −0.04 |

Gate:

- recall exceeds control by more than 0.10 — **+0.257, pass**
- ungrounded findings do not rise by more than 0.25 per review — **−0.04, pass**
- no case regresses by more than 0.20 recall — **worst −0.083, pass**

**Adopted.** The tested block is appended verbatim to `registry/review-work/SKILL.md`.

Paired by case: 6 wins, 1 loss, 5 ties, mean difference +0.257, worst regression −0.083 on a single case.

## What the candidate was

Not more guidance. Two of the five defect shapes the calibration found — whether a check actually executes the changed code on the engine production uses, and whether a new test would fail with the defect present — were **already in the skill**, in the middle of a dense paragraph, and control missed them anyway. So the candidate gave the existing content the structure obra/superpowers uses for this exact problem: a named gate, five imperative checks, and a short rationalization table. Three shapes the skill genuinely lacked were added into that structure.

The result is evidence for the structural claim. Guidance the model has to locate inside flowing prose is guidance it skips; the same content under a heading, as an enumerated check, gets run.

## Attribution

Every one of the five checks recovered at least one anchor that control missed in both reps:

| Check | Recovered anchor |
| --- | --- |
| Degenerate inputs | empty repeatable value compiling to a filter matching nothing; an extreme but legal bound underflowing into a 500 |
| Empty denominators | a rate returning 0.0 over an unclassified population, reading as healthy |
| The access path | a follow-up cost check on a predicate the row limit does not bound |
| Execution, not intention | **blocking**: a migration no green check has ever run — unit tests are on a different engine, the job that would run it is gated on a label the change does not carry |
| Tests that would fail | a cap patched below the fixture size, so the bound never binds and the test passes with the defect intact |

The arm also became *more focused*, not merely more talkative: grounded unanchored findings fell from 3.13 to 2.38 per review while anchors found rose by 11. It reports fewer things and hits the real ones more often.

## What is still missed

Seven anchors survive both arms across all four runs. Three need access that was never granted — another branch in flight, a second branch's merge interaction, a consumer in a different repository — and remain a separate tier measuring access rather than review quality.

The other four are findable and uncovered:

- a bound that is never clamped to the present, so a future-only window returns zero-filled points as though they were data;
- a cap that cuts through a bucket and moves a range boundary earlier than the sample it describes;
- an identifier promised by one endpoint that a second endpoint's ownership rule will refuse;
- a selective-looking filter on an unindexed column scanning the full range. **The access-path check did not recover this one**, though it recovered a related cost question. Whatever that check is doing, it is not yet reaching index reasoning on the main query path.

Those four are the material for the next candidate, and the last one says the access-path bullet is the weakest of the five as written.

## Limitations

Two reps and twelve cases. A sign test over the seven non-tied cases gives two-sided p = 0.125, so this is a large effect measured at low power, not a significant result in the statistical sense. The gate was pre-registered on effect size, and it clears that comfortably; a confirmation run at higher reps would be cheap and has not been done.

The reviewer whose findings are the anchors writes in this registry's finding model, so some anchors may have been produced with `review-work` itself — a bias that works against the candidate here, not for it.

The judge remains a single model with no calibration set, and the harness self-test — a deliberately sabotaged review, to confirm the judge scores one low — still has not been run. A positive result rests on that judge more heavily than a null did.

Landed exactly as tested, additively. The block now duplicates a clause in the earlier prose about test pinning and engine parity; trimming that redundancy would change the artifact the evidence covers, so it stays for now and belongs in its own tested change.
