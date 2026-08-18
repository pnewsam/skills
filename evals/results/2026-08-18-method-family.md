# Methodology-workflow family — family A/B (2026-08-18)

Family: `diagnose-failure`, `document-architecture`, `explore-directions`,
`threat-model`, `polish-issue`. Case file: `evals/method_pilot_cases.json` (10
scenarios, 2/skill). Prompts: `evals/fixtures/method_prompts.json`. Harness:
`evals/family_ab.workflow.js`. Scores: `evals/results/2026-08-18-method-family-scores.tsv`.

## What this A/B does and does NOT measure

Each case gives a self-contained scenario and judges the **artifact's content
quality** (a diagnosis, an architecture doc, strategic directions, a threat model, a
polished issue) with vs without the skill. It does **not** measure two things these
skills also provide: (a) a durable **file/format convention** the rest of the system
consumes (`docs/architecture/ARCHITECTURE.md`, `docs/directions/NNN-*.md`,
`docs/security/threat-model-*.md`), and (b) **effect-boundary discipline**
(`diagnose-failure` stays read-only and does not fix; `polish-issue` must not change
issue scope). Read the verdict with that in mind.

## Result

Official `score_ab.py` verdict: **PASS (evict) on content quality** — overall
**A=0.972, B=0.972**, a dead tie; every case 1.000/1.000 except `polish-vague-bug`
(0.72/0.72, symmetric — both arms occasionally over-edited and tripped the
no-scope-change anti-pattern). No B-only violations.

| Case | Skill | A | B |
| --- | --- | --- | --- |
| diag-flaky-test / diag-intermittent-500 | diagnose-failure | 1.000 | 1.000 |
| arch-document-service / arch-data-flow | document-architecture | 1.000 | 1.000 |
| dir-product-gap / dir-stalled-growth | explore-directions | 1.000 | 1.000 |
| tm-file-upload / tm-webhook-integration | threat-model | 1.000 | 1.000 |
| polish-vague-bug | polish-issue | 0.720 | 0.720 |
| polish-feature-request | polish-issue | 1.000 | 1.000 |

The bare model wrote an equally good diagnosis, architecture doc, direction set,
threat model, and polished issue. **No skill added content the base model lacks.**

Data note: a first run was corrupted (a concurrent `git stash` transiently removed
the case file, so scorers in that window returned 0 against good answers); this is
the clean re-run (`wf_ccd8a52f-b23`, 0 dead).

## Verdict (per skill — NOT a blanket evict)

Content quality ties everywhere, so the decision turns on convention/boundary value
the A/B doesn't capture:

- **`document-architecture` → KEEP as convention.** Content ties, but it defines the
  `docs/architecture/ARCHITECTURE.md` artifact (diagram set + structure) that the
  planning system references. A convention is an objective, not derivable knowledge.
  Optionally slim to a template + objective.
- **`explore-directions` → KEEP as contract.** Part of the planning pipeline
  (`create-charter → explore-directions → plan-epic`); produces `docs/directions/`
  that `plan-epic` consumes. Same class as `plan-feature`/`plan-epic`, which we keep.
- **`threat-model` → KEEP (lean).** Ties on content, but it is the security-evidence
  artifact in the compliance profile and encodes an external-objective-adjacent
  structure (assets/boundaries/abuse-cases/controls/residual-risk).
- **`diagnose-failure` → EVICT candidate.** Generic debugging methodology the base
  model matches; produces no artifact convention. Caveat: it sits in the `core`
  profile and encodes a **read-only, don't-fix** effect-boundary — a behavioral
  objective the content A/B doesn't score. Evict only if that discipline is
  considered derivable.
- **`polish-issue` → EVICT candidate.** The copy-editing ties; its residual value is
  the Linear write mechanic + the don't-change-scope guardrail (thin, 64 lines).
  Weakest keep of the family.

Net: the two conventions and the security artifact stay; `diagnose-failure` and
`polish-issue` are the genuine (but caveated) eviction candidates. Unlike the
knowledge families and routers, this is a judgment call, not a clean gate-driven cut.
