# Rebalancing the registry around the bitter lesson

A plan to re-weight the skill registry away from hand-encoded method knowledge
and toward objective-specification and ground-truth verification — the parts
that keep their value (or gain value) as the base model improves.

## Progress (2026-08-15) — main

- **Evicted (evidence-backed):** `react-*` (12), `python-*` (9), `quality-*`
  (7), `backend-*` (7), `design-*` prose (4) → `archive/*-evicted/`. Active
  skills **108 → 70**, validator + CLI tests green throughout.
- **Evidence:** 5 A/B rounds (advice + real-code tasks) under a strict
  evidence-grounded judge; bare model tied or beat every family; zero convert
  candidates. Scorecards: `evals/results/2026-08-1?`.
- **Converted (prose → objective + runnable check):** `ui-color` (contrast
  validator), `ui-spacing` (scale lint); `design-explore` added as the
  search-based replacement for prescriptive design taste.
- **Check layer landed** on compliance/platform flagships
  (`compliance-accessibility` → axe / jsx-a11y / contrast; `platform-secrets-config` → gitleaks/trufflehog), confirming those families convert, not evict.
- **Pending run:** consolidated `ui-*` family A/B defined in
  `evals/ui_family_cases.json` (14 cases, 13 prose skills + visual-hierarchy)
  with substitute note `docs/ui-substitute-note.md`; `ui-expert` slims after the verdict.
- **Deliberately preserved:** measurement/verification (`analyze-*`,
  `validate-*`, `review-pr`, `diagnose-failure`) and cross-cutting
  `async-patterns` / `error-handling` / `typescript-types`.

Earlier prototype state (branch `pilot/react-eviction`): executed
reversibly; the eviction evidence and archive moves now live on `main`.

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
    concrete automated check, now added to every compliance/platform skill
    (2026-08-15): a11y → axe/`ui-color` validator; secrets → gitleaks; security
    → SAST + dependency + secret scans; GDPR/HIPAA/privacy → data-map,
    deletion/export, and audit-trail checks; vulnerability management → closure
    evidence; auditability → evidence invariants; platform → actionlint,
    plan-validate/policy-as-code, health/smoke gates, parity scans.
- **`ui-*`:** prose family A/B defined in `evals/ui_family_cases.json` (14
  cases, 13 prose skills + `visual-hierarchy`); keep the converted checkers,
  evict (or convert per-case) whatever ties the bare model. `design-*` prose is
  already retired in favor of `design-explore` (search over prescription);
  `ui-expert` slims to a survivor index after the verdict.
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
| **React knowledge** | `react-*` (11) + `react-expert` | **EVICTED (pilot)** | A/B + code-gap eval: bare model tied/beat every case. `archive/react-pilot/`. |
| **Python knowledge** | `python-*` (7) + `python-expert` + `fastapi-architecture` | **EVICTED** | A/B + extrapolation confirmation. `archive/python-evicted/`. |
| **Quality knowledge** | `quality-*` (6) + `quality-expert` | **EVICTED** | A/B + extrapolation confirmation. `archive/quality-evicted/`. |
| **UI knowledge** | `ui-*` (15) + `visual-hierarchy` + `ui-expert` | **RESOLVED 2026-08-17: evict 13, keep+convert `ui-patterns`, slim `ui-expert`** | A/B (`evals/results/2026-08-17-ui-family.md`, gate PASS A=0.913/B=0.905): 13 prose skills (incl. `visual-hierarchy`) → `archive/ui-evicted/`; `ui-patterns` was the lone reproducible edge (scale-completeness) → converted to a slim objective; `ui-color`/`ui-spacing` checkers kept; `ui-expert` slimmed to a survivor index. |
| **Design knowledge** | `design-composition`, `design-simplicity`, `design-visual-language`, `design-expert` | **EVICTED** | A/B tied; replaced by `design-explore` (generate-N-and-judge). `archive/design-evicted/`. |
| **Backend knowledge** | `backend-*` (6) + `backend-expert` | **EVICTED** | A/B tied; keep only genuine org guardrails as objectives. `archive/backend-evicted/`. |
| **Platform knowledge** | `platform-*` (5) + `platform-expert` | **EVICT / thin (partially converted)** | Keep org-specific deploy/secrets guardrails as objective + check; check layer landed on `platform-secrets-config`, the rest follow the light pattern. |
| **Compliance / risk** | `compliance-*` (7), `threat-model`, `consult-expert` | **CONVERT: objective + pinned citation + automated checks** | Flagships (`accessibility`, `secrets`) done; the rest follow. Never a blind evict-A/B for external objectives. |
| **Cross-cutting knowledge** | `async-patterns`, `error-handling`, `typescript-types` | **RESOLVED 2026-08-17: evict eh + ap, CONVERT tt** | A/B run (`evals/results/2026-08-17-cross-cutting-family.md`, 204 pooled blind reps): bare model ties the skill on every case (A=0.992, B=0.997). `error-handling` (1.000/1.000, 0 violations) and `async-patterns` (0.975/1.000, 0 B-only violations) → **EVICT**. `typescript-types` ties on means but the bare model emits an unsafe cast/`any` the skill prevents, and that failure mode is deterministically caught by `tsc --strict` + `@typescript-eslint/no-unsafe-*` → **CONVERT** (objective + check, drop prose). |
| **Routers** | `*-expert` (ui, design, react, python, backend, quality, platform, compliance), `consult-expert` | **Collapse** | A router over evicted children is dead weight. react/python/quality/backend/design experts already gone; `ui-expert` slims after the ui A/B; keep `consult-expert`/`compliance-expert` only as an index over the legislative families. |

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

### Phase 1 — Pilot one family end-to-end: `react-*` ✅
Chosen because the deterministic substitutes are strongest (eslint-plugin-
react-hooks, react-testing-library). **Status:** complete — A/B + code-gap
eval passed, family archived (`archive/react-pilot/`), evidence in
`evals/results/2026-08-14-*`.

### Phase 2 — Roll eviction across the method families ✅ (ui pending A/B)
Executed in order: **python → quality → react → backend → design**, each
behind its own A/B. Remaining: **ui-* prose** (case file ready — run, then
evict/convert per verdict) and collapse of `ui-expert`. compliance/platform
are CONVERT families, not evictions.

### Phase 3 — Convert the survivors to validators
For every skill that *fails* the evict gate, do not restore the prose. Express
it as a check: a `scripts/` validator or a pointer to an existing tool, plus a
one-paragraph objective. Shape it like `ui-data-viz`.

### Phase 4 — Reinvest the freed budget in the loop ✅ (design-explore render) + next
The maintenance and routing attention you free goes into the part that scales:
- **`design-explore` now renders before judging** (2026-08-15): the workflow's
  generators emit a structured `tokens` block; `scripts/render_direction.mjs`
  turns each into a standalone page + Chrome screenshot and runs the WCAG AA
  gate on the pairs it actually renders (math identical to `ui-color`'s
  checker, verified 1:1) and a spacing-conformance advisory mirroring
  `ui-spacing`'s lint (`--strict-spacing` gates it). A direction below AA is
  out regardless of taste.
- **`shot_diff.mjs` added to `validate-changes`** (2026-08-15): a
  dependency-free pure-Node PNG decoder + diff (strict by default: any pixel
  above tolerance is a change; `--threshold` for non-deterministic renders).
  Documented as optional step 4b for visual-only changes; the design-explore
  renderer is the capture primitive for static HTML / token specs.
- **`analyze-*` wired into the `execute-feature` loop** (2026-08-15): when a
  plan names an analyzer (`analyze-quality`, `analyze-design-system`,
  `analyze-security`, or a metrics script), `execute-feature` re-runs it as the
  verification method and records the before/after evidence in the plan —
  analyzers are part of execution, not on-request chores.

### Phase 5 — Governance ✅ (AUTHORING.md) + recurring cadence
- Rewrite the `AUTHORING.md` retention test around the method/objective/
  verification axis explicitly — done 2026-08-15: the admission test sorts by
  "can the model derive this?" first, then KEEP/CONVERT/EVICT, with the A/B
  gate for families.
- Add a recurring (e.g. quarterly) retention review that re-runs the evict gate:
  as models improve, more CONVERT skills graduate to EVICT, and the evals README
  now documents how to run a family quality A/B end-to-end. **First pass run
  2026-08-15 → `evals/results/2026-08-15-retention-first-pass.md`**: sweeps all
  70 active packages; remaining work is exactly two trails — the instrumented
  ui-* run and the cross-cutting method trio (`async-patterns`,
  `error-handling`, `typescript-types`). **Both trails are now run and executed
  (2026-08-17):** cross-cutting → evict eh+ap, convert tt
  (`evals/results/2026-08-17-cross-cutting-family.md`); ui-* → evict 13 (incl.
  `visual-hierarchy`), keep+convert `ui-patterns`, slim `ui-expert`
  (`evals/results/2026-08-17-ui-family.md`). Active skills 70 → 55, all on branch
  `chore/cross-cutting-ab`. No family trails remain; the next retention pass just
  re-runs the standing gate as models improve.

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

## Decisions (2026-08-15)

1. **Pilot family — RESOLVED (react-*):** strongest tooling substitute, clean
   A/B; evicted and archived.
2. **Compliance & platform aggressiveness — RESOLVED:** convert, not evict.
   Objective + pinned citation + automated check for each; blind evict-A/B is
   the wrong instrument for external objectives. Flagships done;
   remaining skills follow the same light pattern.
3. **Retention tier for the method families — choosing in-repo `archive/`
   over a separate `skills-knowledge` repo, pending evidence of actual
   re-vendor demand.** Every family A/B so far says the base model covers the
   archived material, so there is no demonstrated consumer for editable cold
   storage; `archive/` preserves history and reversibility cheaply. If a
   project actually asks to re-vendor a family (via `ingest-skill` with
   `provenance: external`), split it to a `skills-knowledge` repo at that
   point — the eviction remains reversible either way.
4. **Remaining open:** the `ui-*` prose A/B verdict (case file ready in
   `evals/ui_family_cases.json`), and whether `visual-hierarchy` stays as a
   lone survivor once it is decided.
