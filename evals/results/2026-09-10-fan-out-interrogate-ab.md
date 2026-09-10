# fan-out interrogate A/B — negative (do not adopt for review)

**Date:** 2026-09-10 · **Run:** wf_9d5e08d2-ac6 (84 agents, 0 errors) · **Harness:** `review_interrogate_ab.workflow.js` · **Cases:** `review_interrogate_ab_cases.json`

## Question

Does pstack's `interrogate` (same diff reviewed by several independent models, reconciled by a lead) beat a single-pass review? Tested with **real model diversity** — reviewers on opus + sonnet + haiku, opus lead reconciling — on four **hard cases built with single-pass headroom** (three synthesis/edge defects, one false-positive trap), because review_ab has saturated four times.

## Result

| Arm | Recall | False-positives | Score |
| --- | --- | --- | --- |
| control (single opus pass) | 0.917 | 0.333 | 0.832 |
| interrogate (opus+sonnet+haiku + lead) | 0.917 | 0.417 | 0.803 |

The cases had genuine headroom (recall 0.917, not 1.0; false-positives present), so this is a real test. **Interrogate did not help:** identical recall (multi-model caught nothing the single opus pass missed) and *worse* precision — the weaker haiku reviewer contributed false positives the lead did not fully refute, clearest on the batch-delete FP-trap (fp 0.667 vs control 0.333). ~4x the tokens for a slightly lower score.

## Decision

**Do not adopt interrogate for ordinary code review**, and do not wire `review-work` to it. Fails the gate (no recall gain, precision regression).

## What this does and does not condemn

- **Condemned:** interrogate as a *review-recall* lever on small diffs. Consistent with the accumulating evidence (four prior nulls) that single-pass `review-work` on a frontier model is at ceiling for this material; adding a weaker model to the panel is net-negative.
- **Not tested:** the `arena` (design bakeoff) and `swarm` (coverage/large-surface partition) modes address different failure modes — design lock-in and context-window limits — that this review-recall test says nothing about. They remain plausible but **unproven**.
- **Note on model mix:** a panel of only strong peers (e.g. opus + sonnet, no haiku) might hold precision better, but it would still need a recall gain to justify the cost, and none appeared here.

## Disposition (revised — adopt to observe in real use)

Owner's call: a microcase A/B is the wrong instrument for a capability whose value is coverage/diversity on *complex, real* work — the same category error as testing the review-output template through the recall/precision harness. The negative here is scoped to "interrogate with a cheaper same-lab model on a *small* diff," which is not the value claim. So `fan-out` **is shipped** (`registry/fan-out/`, layer runbook, scope shared) to be exercised on real work and evaluated in the field, not gated on more microcases.

Two corrections baked into the shipped version, both from this run:

- **Diversity means a different-lab frontier model** (GPT/Gemini/DeepSeek-class), not a cheaper same-lab model. The haiku reviewer is exactly what inflated interrogate's false positives; the skill now forbids padding a panel that way.
- **Reserve fan-out for scale** — a large surface, a complex/high-consequence PR, a wide design space. A frontier model on a small diff is at ceiling (five trials show it), so the triggers fire on complexity, not by habit.

Wired to fire where it plausibly helps: `analyze-work` and `shape-initiative` (swarm research over a broad surface), `review-work` (interrogate a complex PR). What to watch in the field: does fan-out surface findings a single pass missed on genuinely complex PRs, and does cross-lab diversity change the outcome. arena/swarm still lack a dedicated trial; revisit with a coverage/design harness if field signal warrants.
