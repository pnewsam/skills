# Rollout — backend-* Eviction Trials

Date: 2026-08-14
Run: `wf_b4f5dd3e-73b` (48 agents, 0 errors, ~1.11M tokens)
Protocol: identical strict evidence-grounded judge as the python/quality rollout,
3 reps, 4 cases (3 hard + 1 control).

## Results

| Family | A anchor | B anchor | A holistic | B holistic |
| --- | --- | --- | --- | --- |
| backend | 1.000 | 1.000 | 0.954 | 0.960 |

Every case ties at 1.0 anchors; bare model marginally ahead on holistic. **No
convert candidates, no safety failures.** Cases: `be-service-layers`,
`be-persistence-tx`, `be-api-design` (hard), `be-authz-boundary` (control).

## Action

Evicted the full backend knowledge family + `backend-expert` router (7) to
`archive/backend-evicted/`; removed the `backend` profile and its
`advisory.includes` entry. No eval cases referenced backend. Registry validates
with 0 errors (80 → 73 active skills). Reversible: `git checkout main`.

## Note

`be-authz-boundary` is authorization *design placement* (a code-structure
question the model handles), distinct from `backend-auth-boundaries` as a
security-objective. The compliance/security families are treated separately and
were NOT evicted — see the plan's remaining-family dispositions.
