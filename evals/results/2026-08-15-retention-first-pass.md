# Retention First-Pass (bitter-lesson era)

Date: 2026-08-15
Scope: all 70 active packages, assessed against the admission/retention gate
in `AUTHORING.md` (method prose vs objective vs verification — KEEP / CONVERT /
EVICT), following the format of the classic presence/retention audits.

## Question

After the conversion sweep (compliance/platform check-layers) and the
instrumented eviction tooling (react/python/quality/backend/design-* evicted;
ui-* gated), which remaining packages are genuinely KEEP, and which are
outstanding CONVERT/EVICT candidates still awaiting evidence?

## Gate restated (per AUTHORING.md)

- **KEEP** when it carries an objective (an objective the base model cannot
  short-circuit) or a deterministic verification/measurement — or when it is a
  necessary router, workflow, plumbing, ground-truth, or external/org preserve.
- **CONVERT** when the objective is real but the skill is method prose with a
  checkable surface — reduce to a checklist + objective + proving case.
- **EVICT** is gated: a family may only be evicted when the A/B gate passes
  (`mean(B) >= mean(A) - 0.10`, no B-only `must_exclude` violation, and any
  case A beats by > 0.25 unrecovered by C becomes a CONVERT candidate). No
  eviction ships without the eval verdict.

## Sweep of the 70 active packages

### KEEP — plus-growth (verification / measurement / diagnosis)

`analyze-quality`, `analyze-design-system`, `analyze-security`,
`diagnose-failure`, `validate-feature`, `review-pr`, `harden-pr`,
`document-architecture`, `mindsdb-track-design-system-metrics`.

These are the reinvestment target: ground truth, measurable. `analyze-*` /
`validate-*` / `diagnose-*` carry objectives and checks the base model cannot
short-circuit, and their capture primitives (`render_direction.mjs`,
`shot_diff.mjs`) now support real artifact gates.

### KEEP — converted check-layers added (objective + check)

All compliance-*, all platform-* (incl. `threat-model`), plus the ui checkers
`ui-color` and `ui-spacing`. Already audited this era; no changes.

### KEEP — workflows, routers, plumbing, ground truth

Product/planning: `create-charter`, `explore-directions`, `create-project`,
`create-issue`, `polish-issue`, `plan-epic`, `plan-feature`, `advance-epic`,
`ship-epic`, `execute-feature`, `plan-browser-tests`, `add-browser-test`,
`fix-browser-test`.
PR/git: `prepare-pr`, `update-pr`, `review-pr`(also above), `stash`,
`ingest-skill`, `trim-comments`.
Routers: `consult-expert`, `platform-expert`, `compliance-expert`.
Convention references: `pr-conventions`, `writing-conventions` (binding
standards used by the workflows — KEEP).
External/org preserve: `emil-design-eng`, `svg-animations`,
`mindsdb-migrate-surface-to-tailwind`.
Design engine: `design-explore` (render + spacing + contrast gate).

### Outstanding candidates (evidence still required — no blind eviction)

| Package(s) | Status | Next action |
| --- | --- | --- |
| 13 prose `ui-*` (`ui-actions`, `ui-content`, `ui-data-viz`, `ui-depth`, `ui-email`, `ui-feedback`, `ui-forms`, `ui-icons`, `ui-layouts`, `ui-onboarding`, `ui-patterns`, `ui-responsive`, `ui-typography`) | EVICT on gate | **Already instrumented** (`evals/ui_family_cases.json`, substitute note, `extract_ui_pilot.sh --apply`, `score_ab.py`) — verdict is the single remaining blocker. On pass: evict via extract script. |
| `ui-expert` (router over the ui-* family) | Slim after run | After the family verdict, slim profiles.routing donations; drop the 3 ui routing cases or retarget the router's surviving donor set. |
| `visual-hierarchy` | Assessed in the ui run | It is in the ui-family case set; its verdict rides the same A/B. |
| `typescript-types`, `error-handling`, `async-patterns` (cross-cutting method prose) | **Enroll in next A/B** | Not yet instrumented. All three are method prose with at best `tsc`/no-`any` as a partial check for `typescript-types`. Plan: build a small case set (reuse the scaffold+scorer), run the A/B, and evict on gate or reduce to a fixed check where one exists. |

## Verdict

The inventory is in good shape: the conversion sweep moved compliance/platform
to objective-first, the verification/measurement set is the growth axis, and
the eviction tooling makes every removal evidence-gated and reversible.

**Two open trails exhaust the remaining work:**

1. **ui-* family** — instrumented and tooled; verdict awaits the evaluation
   harness. Mechanics are one command once the journal exists.
2. **cross-cutting method trio** (`typescript-types`, `error-handling`,
   `async-patterns`) — the next CONVERT/EVICT candidates; schedule their A/B
   (or a typescript-types lint conversion) as the follow-up retention pass.

## Follow-ups

- Re-run this pass after the ui-* verdict lands; the ui-* rows collapse to
  "evicted" or "converted" and the trio becomes the only open bucket.
- Consider folding the three cross-cutting skills into one combined A/B case
  set to amortize harness cost.