# React Knowledge-Eviction Pilot — Hardening Round

Date: 2026-08-14
Run: `wf_a8e86a33-4cd` (84 agents, 0 errors, ~1.99M tokens, ~2.8 min)
Prior: `2026-08-14-react-pilot-trials.md` (round 1)

## Why this round

Round 1 passed the gate but had two weaknesses: a lenient judge (41/42 perfect)
and only canonical, heavily-documented cases. This round fixes both to test the
actual thesis — does react-*'s *judgment* survive, not just its canonical tips.

## Method changes

- **Strict, evidence-grounded judge.** An anchor counts as met only if the judge
  supplies a ≥15-char verbatim quote from the answer supporting it; otherwise it
  is false. Plus a separate 0–1 holistic "would this resolve it for a senior
  engineer" score to catch quality the binary anchors miss.
- **Anti-artifact guard.** Answerers instructed to emit only the final answer
  (round 1's one gap was a returned preamble).
- **Harder cases.** 4 judgment-heavy cases with no single canonical answer —
  `state-architecture` (server vs URL vs local vs cross-step), `decomposition-
  boundaries`, `abstraction-timing` (rule of three), `effect-sync-judgment`
  (single source of truth vs effect chains) — plus 3 canonical controls.
- 3 reps per case.

## Results

| Set | A anchor | B anchor | A holistic | B holistic |
| --- | --- | --- | --- | --- |
| Hard cases (4) | 1.00 | 1.00 | 0.958 | 0.958 |
| All cases (7) | 1.00 | 1.00 | 0.957 | 0.961 |

Per case, anchor A = B = 1.00 everywhere; holistic within ±0.023 (bare model
marginally ahead on `test-implementation-details` and `abstraction-timing`). No
arm C triggered (no gap > 0.15). **No convert candidates. No safety failures.**

## Spot-check (journal `wf_a8e86a33-4cd/journal.jsonl`)

- **Strict rule enforced:** 150 true anchor-hits, **0 zeroed** for missing
  evidence, median evidence length 142 chars — the 1.0s are grounded quotes, not
  leniency.
- **Judge discriminated:** holistic took 7 distinct values from 0.92 to 0.98, so
  it was capable of separating answers; it found A and B equivalent.
- **No artifacts:** shortest answer 1,380 chars; the anti-preamble guard worked.
- A bare-model answer on `state-architecture` explicitly reproduced the skill's
  own framework ("match each kind of state to the narrowest scope that fits its
  lifetime and who reads it") without reading the file — the knowledge is in the
  weights.

## Verdict

Across two rounds and 17 cases spanning canonical pitfalls and hard architecture/
decomposition/state-design judgment, under a strict evidence-grounded judge, the
~2,497 lines of `react-*` prose produced **no measurable improvement** over the
base model, and produced **no convert candidate** — not even on the cases
designed to favor the skill. This clears the eviction gate decisively.

## Remaining limits (stated honestly)

- **Q&A proxy, not multi-file code.** These score advice quality, not whether the
  agent writes better code across a real repo. That is the main residual
  uncertainty; a follow-up could compare committed diffs on a seeded repo.
- **Bounded set (17 cases).** The long tail is untested, but the burden has
  flipped: there is now no measured case where the skill helps.
- **Strong base model (Opus 4.8).** On a weaker model the skills might earn more;
  this registry targets frontier models.

## Recommendation

Evict `react-*`: run `scripts/extract_react_pilot.sh --apply` on the pilot branch
(reversible; no commit/push), then roll this exact protocol — strict judge, hard
+ control cases — to `python-*` and `quality-*`. Keep `docs/react-substitute-note.md`
as the seed for a lint/test quality-gate note if any project wants an explicit
React check surface.

## Status

Round complete and spot-checked. Extraction still staged, not applied.
