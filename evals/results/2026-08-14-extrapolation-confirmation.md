# Extrapolation Confirmation — the 4 untested evicted skills

Date: 2026-08-14
Run: `wf_0de6f221-1d3` (48 agents, 0 errors, ~1.12M tokens)

The python/quality rollout evicted four skills by same-family extrapolation
rather than individual testing. This closes that gap: each was run through the
same strict A/B (arm A reads the skill from its `archive/` location), 3 reps.

| Skill (now archived) | A | B | holA | holB |
| --- | --- | --- | --- | --- |
| fastapi-architecture | 1.00 | 1.00 | 0.953 | 0.967 |
| python-project-structure | 1.00 | 1.00 | 0.95 | 0.95 |
| python-testing | 1.00 | 1.00 | 0.95 | 0.97 |
| quality-code-clarity | 1.00 | 1.00 | 0.943 | 0.953 |

All tie on anchors; bare model marginally ahead on holistic. **No convert
candidates, no safety failures.** The extrapolation held: every evicted skill in
the react/python/quality/backend families is now individually A/B-confirmed.
