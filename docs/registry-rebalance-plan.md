# Rebalancing the registry around the bitter lesson

A plan to re-weight the skill registry away from hand-encoded method knowledge
and toward objective-specification and ground-truth verification — the parts
that keep their value (or gain value) as the base model improves.

## Progress (2026-08-14) — branch `pilot/react-eviction`

Executed on a reversible branch (`git checkout main` reverts everything):

- **Evicted (evidence-backed):** `react-*` (12), `python-*` (9), `quality-*`
  knowledge skills (7), `backend-*` (7) → `archive/*-evicted/`. Active skills
  **108 → 73**, validator green throughout.
- **Evidence:** 4 A/B rounds (31 advice cases + 4 real-code tasks) under a
  strict evidence-grounded judge. The bare model tied or beat every skill; zero
  convert candidates. Scorecards: `evals/results/2026-08-14-*`.
- **Deliberately preserved:** `analyze-quality` (measurement) and cross-cutting
  `async-patterns` / `error-handling` / `typescript-types`.

### Remaining families — NOT blanket-evict (deliberate stop)

These need conversion, not eviction, so they are left active pending that work:

- **`compliance-*`, `threat-model`, `platform-*`:** these encode *external
  objectives* (regulatory standards, operational guardrails), not derivable
  technique. Convert each to "what must be true + a pinned citation + an
  automated check" (e.g. axe for a11y); keep the objective, drop how-to-code
  prose. A blind evict-A/B is the wrong instrument here.
  - **Status (2026-08-15):** on inspection these skills were already
    objective+citation+rubric shaped (e.g. `compliance-accessibility` 65 lines
    with WCAG anchors; `platform-secrets-config` 79 lines with 12-factor/OWASP
    anchors) — confirming "keep, don't evict." The only missing layer was the
    concrete automated check, now added to two flagships (a11y → axe /
    jsx-a11y / the `ui-color` contrast validator; secrets → gitleaks/trufflehog
    + startup validation). The remaining compliance/platform skills follow the
    same light pattern: name the runnable check, keep the objective.
- **`ui-*`, `design-*`:** replace prose with checks/search — `ui-color`→contrast
  validator, `ui-spacing`→scale lint, keep `ui-data-viz` (validator template);
  `design-*` → a generate-N-and-judge Workflow. Evict prose only once the
  replacement exists, so capability isn't lost.
- `writing-conventions` (house voice) and the PR/Linear/planning/verification
  skills remain (objective/plumbing/ground-truth).

## The rule this plan applies

**Keep skills that specify _what you want_ or _check what you got_. Drop or
convert skills that prescribe _how to get it_.** Sort each skill by "can the
model derive this itself?", not by "is it a task or a fact?"

Three fates:

- **KEEP (active):** objective-specification, org-specific context, mechanical
  plumbing, and verification/measurement.
- **CONVERT:** method knowledge that has a deterministic check — keep the check
  (a script or an existing linter), delete the prose. `ui-data-viz`
  (palette + runnable validator) is the reference shape.
- **EVICT:** method knowledge with no durable check — remove from the active
  registry into cold storage, re-vendorable later if a real need appears.

## Two eviction tiers (both already supported here)

- **Tier A — separate `skills-knowledge` repo.** Editable cold storage for
  families you still value and might selectively re-vendor into a project via
  `provenance: external` + `policy: preserve` + `ingest-skill`. Move with
  `git mv` / `git filter-repo` to preserve history. This is the "retain in a
  separate repo even if we delete them here" path.
- **Tier B — in-repo `archive/`.** History-only, not discoverable or
  installable. Use for anything already superseded (the design/UI consolidation
  already lives here).

Default: method families → Tier A; already-superseded one-offs → Tier B.

## Classification (family-level, ~132 active skills)

| Group | Approx. members | Fate | Notes |
| --- | --- | --- | --- |
| **Verification & measurement** | `validate-changes`, `validate-feature`, `diagnose-failure`, `analyze-quality`, `analyze-security`, `analyze-design-system`, `review-pr`, `harden-pr`, `document-architecture`, `mindsdb-track-design-system-metrics` | **KEEP + grow** | The pile to multiply. Value rises with model capability. |
| **Product / planning workflow** | `create-charter`, `explore-directions`, `plan-epic`, `plan-feature`, `advance-epic`, `ship-epic`, `execute-feature` | **KEEP** | Objective + org process; produces org-specific artifacts the model can't derive. |
| **PR / Linear / repo plumbing** | `prepare-pr`, `update-pr`, `pr-conventions`, `create-issue`, `create-project`, `polish-issue`, `stash`, `ingest-skill`, `trim-comments` | **KEEP** | Mechanical environment glue, not knowledge. |
| **Browser-test workflow** | `add-browser-test`, `fix-browser-test`, `plan-browser-tests` | **KEEP** | They write/verify real tests = ground truth. |
| **Org-specific & taste-as-objective** | `mindsdb-migrate-surface-to-tailwind`, `emil-design-eng` (already `external/preserve`), `writing-conventions` (house voice) | **KEEP** | Irreducible context; a specific taste is an objective, not a technique. |
| **React knowledge** | `react-*` (11) + `react-expert` | **CONVERT → eslint-plugin-react-hooks / RTL conventions, else EVICT** | **Pilot family** — strongest deterministic substitutes. |
| **Python knowledge** | `python-*` (7) + `python-expert` + `fastapi-architecture` | **CONVERT → ruff / mypy config, else EVICT** | Tooling already enforces most of it. |
| **Quality knowledge** | `quality-*` (6) + `quality-expert` | **CONVERT → metrics via `analyze-quality`, else EVICT** | Measurement skill already exists. |
| **UI knowledge** | `ui-*` (15) + `visual-hierarchy` + `ui-expert` | **CONVERT the measurable (`ui-color`→contrast, `ui-spacing`→scale-lint; keep `ui-data-viz` as the template), else EVICT** | Design/UI already partly archived. |
| **Design knowledge** | `design-composition`, `design-simplicity`, `design-visual-language`, `design-expert` | **EVICT → replace with a generate-N-and-judge Workflow** | Pure taste-prescription; better served by search + selection. |
| **Backend knowledge** | `backend-*` (6) + `backend-expert` | **EVICT (thin objective survivors only)** | Weak deterministic substitutes; keep only genuine org guardrails as objectives. |
| **Platform knowledge** | `platform-*` (5) + `platform-expert` | **EVICT / thin** | Keep any org-specific deploy/secrets guardrail as an objective + a check. |
| **Compliance / risk** | `compliance-*` (7), `threat-model`, `consult-expert` | **CONVERT to checklist-objective + automated checks** | Regulatory rules are *external objectives*: keep "what must be true" + a pinned citation + an automated check (e.g. axe for a11y); drop the how-to-code prose. |
| **Cross-cutting knowledge** | `async-patterns`, `error-handling`, `typescript-types` | **CONVERT → lint/types config, else EVICT** | |
| **Routers** | `*-expert` (ui, design, react, python, backend, quality, platform, compliance), `consult-expert` | **Collapse** | A router over evicted children is dead weight. Keep one only if it now routes among *survivors + validators*. |

Net effect: roughly 70–80 of the ~132 skills are in the method/router bucket
being evicted, converted, or collapsed. Nearly everything in KEEP is already
what you'd call task- or objective-oriented.

## Phased procedure

### Phase 0 — Instrument (do this before deleting anything)
- Run `scripts/validate_registry.py` and the `evals/` suite to snapshot current
  routing on `high_use_cases.json`.
- Add hold-out prompts for the knowledge domains ("fix this spacing", "review
  this hook", "is this GDPR-safe") and record where they route today.
- **Define the eviction gate:** a family is safe to evict when, for its trigger
  prompts, the model either (a) does the task well natively, or (b) routes to a
  validator/verification skill — demonstrated on the evals, not asserted.

### Phase 1 — Pilot one family end-to-end: `react-*`
Chosen because the deterministic substitutes are strongest (eslint-plugin-
react-hooks, react-testing-library), so it's the cleanest test of "does removing
the prose hurt, given model + linters?"
1. Stand up the `skills-knowledge` repo; `git mv` the `react-*` family in with
   history preserved.
2. In the active registry, replace them with nothing but a short `react` profile
   note pointing at the lint/test substitutes.
3. Re-run evals + a small A/B on real React tasks (registry-with vs -without).
4. **Decide per outcome:** no regression → evicted for good. Localized
   regression on one sub-skill (e.g. `react-performance`) → that one becomes a
   CONVERT (perf checklist + a profiler-in-the-loop step), not a restore.

### Phase 2 — Roll eviction across the method families
Same gate, one family per change, ordered by strength of existing tooling
(cheapest wins first): **python → quality → react (done) → ui → backend /
platform → compliance.** Collapse each `*-expert` router as its children leave.

### Phase 3 — Convert the survivors to validators
For every skill that *fails* the evict gate, do not restore the prose. Express
it as a check: a `scripts/` validator or a pointer to an existing tool, plus a
one-paragraph objective. Shape it like `ui-data-viz`.

### Phase 4 — Reinvest the freed budget in the loop
The maintenance and routing attention you free goes into the part that scales:
- Strengthen `validate-changes` / `verify` to render UI and screenshot-diff, not
  just run tests.
- Wire `analyze-*` to run as part of `execute-feature`, not on request.
- Add a "generate N directions → judge panel → synthesize" design Workflow that
  replaces the `design-*` prose with search + selection (the harness already
  supports this).

### Phase 5 — Governance
- Rewrite the `AUTHORING.md` retention test around the method/objective/
  verification axis explicitly.
- Add a recurring (e.g. quarterly) retention review that re-runs the evict gate:
  as models improve, more CONVERT skills graduate to EVICT.

## Per-skill decision gate (the checklist)

For each candidate, in order:
1. Does it specify an **objective / taste / org fact** the model can't derive?
   → KEEP.
2. Does it **connect to ground truth** (run, render, test, measure, review)?
   → KEEP and consider growing.
3. Is it **method knowledge with a deterministic check**? → CONVERT (keep the
   check, delete the prose).
4. Is it **method knowledge with no durable check**, and does the model handle
   its trigger prompts well on the evals? → EVICT to `skills-knowledge`.

## Open decisions (need your call)

1. **Retention tier for the method families** — editable separate repo
   (`skills-knowledge`, my recommendation, since you may re-vendor) vs in-repo
   `archive/` (history only)?
2. **Compliance & platform aggressiveness** — keep thin "objective + citation +
   automated check" survivors (recommended, given legal/operational risk) or
   evict fully?
3. **Pilot family** — `react-*` (recommended: strongest tooling substitute) or
   `ui-*` (more consolidation momentum, already partly archived)?
