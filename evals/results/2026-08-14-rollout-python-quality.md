# Rollout — python-* and quality-* Eviction Trials

Date: 2026-08-14
Run: `wf_c0b31aa7-f70` (120 agents, 0 errors, ~2.76M tokens, ~4.9 min)
Protocol: same strict evidence-grounded judge as `2026-08-14-react-pilot-hardening.md`,
3 reps, 10 cases (6 hard judgment + 4 control). Arm C dropped (its substitute
note was React-specific); any A−B gap > 0.20 flagged as a convert candidate.

## Results

| Family | A anchor | B anchor | A holistic | B holistic |
| --- | --- | --- | --- | --- |
| python | 0.978 | **1.000** | 0.955 | 0.963 |
| quality | 0.978 | 0.978 | 0.944 | 0.951 |

Bare model (B) ties or marginally **beats** the skill on both families and both
metrics. **No convert candidates. No safety failures.**

Per-case highlights:
- Hard cases all tie at 1.0 anchors: `py-async-blocking`, `py-typed-models`,
  `py-session-scope`, `ql-untangle-coupling`, `ql-reliable-writes` (and
  `ql-safe-refactor` where B actually led).
- `py-broad-except` and `ql-safe-refactor`: **B beat A** by 0.111 (a single
  anchor over 3 reps — noise, but no skill advantage).
- `ql-flaky-suite`: A led B by 0.111 — well under the 0.20 convert bar; noise.

Judge verified (journal `wf_c0b31aa7-f70`): 183 anchor hits, **0 zeroed** for
missing evidence; holistic took 6 distinct values (0.90–0.98) — discriminating,
and it found A ≈ B.

## Action taken

Evicted to `archive/python-evicted/` and `archive/quality-evicted/` on branch
`pilot/react-eviction`:

- **python (9):** all `python-*` knowledge skills + the `python-expert` router +
  `fastapi-architecture`. The `python` profile was removed and dropped from
  `advisory.includes`.
- **quality (7):** the `quality-*` knowledge skills + the `quality-expert`
  router. The `quality` profile was slimmed to its survivors.

**Deliberately preserved** (consistent with the thesis — keep measurement and
untested scope):
- `analyze-quality` — a measurement/ground-truth skill, not knowledge prose.
- `async-patterns`, `error-handling`, `typescript-types` — cross-cutting
  references bundled in the quality profile but not `quality-*` and not in this
  rollout's scope.

Dropped now-inactive routing eval cases: `router-python`, `router-quality`,
`router-cross-domain`. Registry validates with 0 errors (96 → 80 active skills).

## Tested vs extrapolated (honest scope)

Individually tested and passed: `python-async-boundaries`,
`python-typing-data-modeling`, `python-database-patterns`,
`python-error-handling`, `python-tooling`; `quality-modularity`,
`quality-refactoring`, `quality-reliability`, `quality-correctness`,
`quality-testing` (10).

Evicted by same-family, same-kind extrapolation (not individually tested):
`fastapi-architecture`, `python-project-structure`, `python-testing`,
`quality-code-clarity`, plus the two orphaned routers. A confirmatory 6-case run
can close this gap if desired; the routers are dead weight regardless once their
children leave.

## Cumulative result (3 rounds, 27 cases)

Across react (17 cases) and python+quality (10 cases), under a strict
evidence-grounded judge, hand-written knowledge prose produced **no measurable
improvement** over the base model and **zero convert candidates** — including on
cases designed to favor the skills.

## Status

python-* and quality-* evicted on the branch, validator green. Same residual
limit as react: this measures advice quality, not multi-file code output.
