# Review-work quality A/B — noise-exclusion (#2) and design-pass (#3) deltas

Harness: `evals/review_ab.workflow.js` over `evals/review_ab_pilot_cases.json`.
Run: 3 arms (control / +exclusion / +design) × 6 cases × 3 reps = 54 blind reviews + 54 blind scores (108 agents, 0 errors, 0 degenerate). opus-4-8, ~2.2M subagent tokens, ~3 min.

## Result: null. Keep control; do not adopt #2 or #3.

Every arm scored perfectly on every case: recall 1.0, false positives 0, blended score 1.0 — overall and on each target (calibration / noise / design).

| Target | control (recall, FP) | +exclusion | +design |
| --- | --- | --- | --- |
| calibration | 1.0, 0 | 1.0, 0 | 1.0, 0 |
| noise (#2) | 1.0, 0 | 1.0, 0 | 1.0, 0 |
| design (#3) | 1.0, 0 | 1.0, 0 | 1.0, 0 |

Neither delta cleared its gate, because the control skill was already at ceiling.

## Why the deltas added nothing

The base skill's finding model already does the work each delta proposed:

- **#2 (noise discipline):** control suppressed every planted false-positive bait unprompted — rate-limiting and DoS on the SQL-injection endpoint, log-spoofing, unverified-outdated-dependency, and reading a file "unboundedly." On `cal-real-bug` it explicitly declined type-hints and out-of-range as blocking. The finding model's "name the concrete failing input or drop it" rule already enforces the exclusion list's intent.
- **#3 (design pass):** control caught both over-engineering cases via its existing scope-gap framing. It flagged the strategy/factory/registry-for-one-caller as speculative generality (correctly a **Nit** — no concrete failure mode) and the env-config-for-fixed-behavior as scope creep (**Minor**, because it found a concrete import-time `ValueError` path). This matches the delta's own "Minor unless a concrete future failure mode" rule — i.e. the delta is redundant with observed behavior.

## Honesty caveat: low discriminating power

This is a null result, not proof of no effect. The ceiling means the cases were too easy — blatant baits and blatant over-engineering. A real difference, if one exists, would only surface on subtler inputs: borderline-tempting noise and over-engineering that reads as reasonable. The binary recall/precision scorer also cannot see **severity** shifts (e.g. control called speculative generality a Nit; the #3 delta would push it to Minor) — whether that shift is desirable is a judgment call, not something this run measured.

## Decision

Keep the current trimmed skill; do not add #2 or #3. The additions are redundant with the finding model on clear cases and would cost lines for no measured gain — consistent with the trim preference. If we want a stronger test before closing the door, harden the cases (subtler baits, subtler over-engineering) and make the scorer severity-sensitive, then re-run. Separately, the refute-pass edit (#1) is not part of this A/B and stands on its own.
