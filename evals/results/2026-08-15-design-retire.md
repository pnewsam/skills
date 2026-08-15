# Retire design-* Prescriptive Prose (in favor of design-explore)

Date: 2026-08-15
Run: `wf_3afdde1d-7fe` (36 agents, 0 errors, ~0.83M tokens)
Protocol: same strict evidence-grounded judge, 3 reps, 3 cases.

## Results

| Family | A anchor | B anchor | A holistic | B holistic |
| --- | --- | --- | --- | --- |
| design | 1.000 | 1.000 | 0.938 | 0.944 |

Every case ties at 1.0 anchors (`composition-balance`, `simplicity-declutter`,
`visual-language-identity`); bare model marginally ahead on holistic. **No
convert candidates, no safety failures.** The prescriptive design-taste prose
did not improve on the base model — the expected result for general taste
principles the model has internalized.

## Action

Archived to `archive/design-evicted/`: `design-composition`, `design-simplicity`,
`design-visual-language` (prescriptive prose) and `design-expert` (router,
orphaned once its focused children leave). The `design` profile is slimmed to
its survivors.

**Kept:** `design-explore` — the search-based replacement (generate-N-and-judge)
that is the actual value-add for open visual direction — and `visual-hierarchy`
(evaluated separately, not in this run).

Design entry point is now `design-explore` (search) → focused `ui-*` skills for
mechanics. Reversible: `git checkout main`.
