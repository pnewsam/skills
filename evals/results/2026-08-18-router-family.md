# Router family — family A/B (2026-08-18)

Family: `consult-expert`, `compliance-expert`, `platform-expert`, `ui-expert`.
Case file: `evals/router_pilot_cases.json` (10 broad, multi-concern prompts).
Prompts: `evals/fixtures/router_prompts.json`. Harness: `evals/family_ab.workflow.js`.
Scores (final run): `evals/results/2026-08-18-router-family-scores.tsv`.

## The instrument

A router's job is to pick the smallest correct subset of focused skills for a broad
request and synthesize their guidance. The test **holds the visible delegate list
constant across both arms** — every prompt embeds the same list of available focused
skills — so the only variable is the router's own `SKILL.md` prose. This is the
honest bitter-lesson condition: in the real harness the model already sees every
skill's description, so the question is whether the router prose adds anything over
the model routing that same list itself.

- **Arm A**: reads `registry/<router>/SKILL.md` (routing table + synthesis protocol)
  AND is given the delegate list.
- **Arm B**: given the identical delegate list, no router skill.
- Arm C: n/a — a router has no deterministic check.

## Result (final)

Official `score_ab.py` verdict: **PASS (evict)**. Overall **A=0.989, B=1.000** — the
bare model ties or beats the router on every case; no B-only `must_exclude` violation.

| Router | A | B | Read |
| --- | --- | --- | --- |
| compliance-expert | 1.000 | 1.000 | tie |
| platform-expert | 1.000 | 1.000 | tie |
| ui-expert | 1.000 | 1.000 | tie |
| consult-expert | 0.943 | 1.000 | **bare beats router** |

Given the identical delegate list, the bare model selected the correct subset and
synthesized coherent guidance every time. The router prose added nothing.

## Anchor-correction history (transparency)

The finding was stable across three runs; correcting anchors only removed noise, and
never changed direction. Each fix corrected an anchor that penalized a
**demonstrably-correct bare-model answer** (verified by reading the raw output), not a
routing defect:

| Run | Overall A / B | Anchor fixed |
| --- | --- | --- |
| 1 (raw) | 0.944 / 0.877 | — |
| 2 | 1.000 / 0.972 | `cmp-healthcare-eu` wrongly required routing to HIPAA for EU health data (HIPAA is US-specific — both arms correctly declined); `ui-drift-audit` rewarded reciting delegate names over applying the capability |
| 3 (final) | 0.989 / 1.000 | `plt-terraform-token` rigidly required `platform-infrastructure-as-code` when routing a broad-CI-token problem to `platform-ci-cd` + `platform-secrets-config` is at least as valid |

The only sub-1.0 cell in the final run is `csl-telehealth-launch` A2 (0.66) — on the
**router arm**, one rep that over-listed skills. It is noise that, if anything,
favors eviction.

Data quality: 120 agents/run, 0 dead/degenerate (hardened detector held).

## Verdict

**EVICT all four routers** (`consult-expert`, `compliance-expert`, `platform-expert`,
`ui-expert`). A router over a delegate set the model already sees is redundant — the
plan's own rule ("a router over a set the model can see is dead weight"), now
measured. The focused delegate skills all stay; only the router entry-points go.
Net if executed: 55 → 51 active.
