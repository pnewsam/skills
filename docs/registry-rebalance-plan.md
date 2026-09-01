# Rebalancing the registry around the bitter lesson

A plan to re-weight the skill registry away from hand-encoded method knowledge
and toward objective-specification and ground-truth verification — the parts
that keep their value (or gain value) as the base model improves.

## Progress (2026-09-01) — UOW-lifecycle taxonomy + publish-pr merge

- **Reframe.** Adopted a unit-of-work lifecycle model (`docs/uow-lifecycle.md`): a
  PR is a UOW moving through phases (Frame → Plan → Build → Verify → Publish →
  Review → Revise → Merge), each served by at most one **operation** verb, with
  **runbooks** owning the feedback edges between phases. Goal: one generalizable
  verb per phase.
- **Taxonomy cleanup (pure classification, no code enforcement — facets live in
  README + AUTHORING only).** Retired the divergence/convergence lens (never
  drove routing or installation). Split the `Kind` axis `workflow → operation +
  runbook`, giving `operation | runbook | reference`. Reclassified the README
  tables (dropped the Mode column; `advance-epic`/`ship-epic`/`harden-pr` →
  runbook, the rest → operation) and rewrote AUTHORING's kinds table with the
  runbook bitter-lesson bar (a runbook that lists the obvious order is dead
  weight). Router marked a retired kind.
- **publish-pr merge.** Collapsed `prepare-pr` + `update-pr` → one `publish-pr`
  operation that detects PR state in Step 0 and forks: no PR → prepare/commit/
  push/create; PR exists → sync-or-polish. Preserves both effect ladders, the
  open-vs-update fork, and the union of safety rules; ported both `references/`
  output-template files. **Decided on design grounds** (refactor-equivalence,
  not a base-model-subsumption question) rather than via the substitution A/B —
  the empirical gate is a transient eviction instrument, and both arms here would
  still read skills. A generalized merge A/B (`merge_ab.workflow.js` + cases) was
  drafted, then removed unused per that reasoning; the candidate became the live
  skill.
- **Plumbing:** `prepare-pr` + `update-pr` → `archive/publish-pr-merge-evicted/`;
  `core` profile repointed to `publish-pr`; 10 `high_use_cases.json` routing
  cases remapped to `publish-pr`; cross-references updated in pr-conventions,
  harden-pr, ship-epic, advance-epic, execute-feature, stash, trim-comments,
  mindsdb-migrate-surface-to-tailwind, AUTHORING, evals/README. **Active 28 →
  27.** Validator green (0 errors), Go tests pass.
- **ship-pr runbook (decision #2, executed).** Created `registry/ship-pr/` as the
  top-level **whole-lifecycle** runbook for one PR (Frame→Plan→Build→Verify→
  Publish→Review→Revise→merge-ready; stops before merge). Delegates each phase to
  its operation (plan-feature, execute-feature, publish-pr, review-pr,
  address-review) and owns the loop: the model-diverse review→revise→verify
  convergence engine, convergence contract, bounded stop, ledger, effect ladder
  (Local/Publish/Respond), and scope discipline — all ported from `harden-pr`,
  whose review/repair prose is now delegated to review-pr/address-review
  (bundled references `reviewer-independence.md` + `hardening-summary.md`).
  Whole-lifecycle scope + `ship-pr` name were user decisions; sibling to
  `ship-epic` at the single-PR grain (future: ship-epic delegates delivery to
  ship-pr). `harden-pr` → `archive/ship-pr-merge-evicted/`; core profile, 4
  routing cases, README (table + mermaid), pr-conventions, finding-model,
  address-review, AUTHORING repointed. Active stays **27** (−harden +ship). Spec
  `docs/ship-pr-spec.md`. Validator green, Go tests pass.
- **design-explore evicted (decision #3, executed).** Deleted rather than folded
  into `plan-feature`: folding solves no essential gap. The canonical ground-truth
  checks it leaned on already live in `ui-color` (`check_contrast.py`) and
  `ui-spacing` (`check_spacing.py`), so no verification is lost; its unique bits —
  the generate-N-directions-and-judge orchestration and a headless render wrapper
  (`render_direction.mjs`) — are a base-model + Workflow-tool pattern, and folding
  them in would only contaminate a general planning verb with UI-rendering
  machinery. Archived to `archive/design-explore-evicted/`. Removed the `design`
  profile and dropped it from `advisory` and `design-system-delivery` includes;
  repointed `execute-feature`, `ui-patterns`, and the `shot_diff.mjs` comment;
  removed the README Design section. Also **fixed a stale `catalog_test.go`**
  (`wantCore` + advisory list were left stale by the publish-pr/ship-pr commits;
  the Go test cache had masked the failure — always `go test -count=1`). **Active
  27 → 26.** Validator green, Go tests pass.
- **Frame/Merge — reversed to candidate operations (user call).** Earlier this
  session they were "base-model bookends, no verb"; the user then decided the
  kernel should have a skill for each of the 8 phases, so Frame/Plan/Build/Merge
  are now candidate operations to create (base-model today). Open tension to
  watch: an abstract Frame/Build/Merge operation that conveys only base-model
  heuristics could fail the bitter-lesson bar — resolve per-skill at creation.
- **README restructured around three skill tiers (user-directed).** Simplified
  the taxonomy to four categories — **operation** (abstract kernel step),
  **runbook** (concrete domain procedure an operation delegates to; e.g. open a
  GitHub PR, create a Linear issue — a catalog, eventually a marketplace),
  **orchestration** (above one UOW: charter/epic/feature stack), **reference**
  (knowledge). Note this **redefines runbook**: it is now the concrete leaf, not
  the high-level composer. README sections are now Operations (kernel: ship-pr
  driver + publish-pr/review-pr/address-review/rebase-pr/stash/trim-comments,
  with Frame/Plan/Build/Verify/Merge as base-model/candidates), Runbooks
  (create-issue/create-project/polish-issue/mindsdb-*), Orchestration (the epic
  stack), Reference (unchanged). Added the 8-phase state-machine mermaid + the
  operations kernel table. `ship-pr` is the kernel **driver**, not a runbook.
- **NOT yet aligned (follow-up):** AUTHORING still defines Kind as operation/
  runbook/reference with runbook = composer and no orchestration category; and
  `ship-pr`'s own SKILL.md still calls itself a runbook. These need a matching
  pass so the taxonomy is consistent across README + AUTHORING + skill self-labels.
- **Runbook-vs-playbook closed:** one `runbook` kind, branching allowed. The
  conventional split (runbook = linear/deterministic, playbook = branching/
  judgment) gives no clean partition here — every runbook we have branches — and
  both would share identical anatomy, routing, and authoring rules, so a second
  kind would add a category and a boundary question with no downstream effect.
  Revisit only if a future member genuinely needs different structure.
- **Router concept (raised, deferred).** User flagged wanting a router concept but
  was unsure where it fits, and chose to revisit later. Working analysis to pick
  up from: routing has two senses — skill-selection (which skill to invoke) stays
  a base-model/harness job (the `*-expert` routers were evicted as redundant), and
  operation-dispatch within a UOW (which verb/phase next; fork on state or type)
  is already a **capability of runbooks** (`publish-pr` Step-0 detect-and-fork,
  `ship-pr` phase forks). A possible third sense is a top-level front-door triage
  (which UOW/entry point for a request) — base-model unless it encodes org-specific
  logic. Proposed home when revisited: document routing as a runbook capability
  rather than a Router kind. Not executed; AUTHORING's router section left as-is.

## Progress (2026-08-19d) — analysis/validation trim; PR as the discrete unit of work

- **User-directed reorientation.** The organizing principle is now the **PR as the discrete unit
  of delivery**; analysis, diagnosis, and verification are base-model capabilities the model
  performs inline while working, and `review-pr` assesses the result — none needs a dedicated skill.
- **Evicted (4) → `archive/analysis-validation-evicted/`:** `analyze` and `validate` (created
  earlier this same day, but too vague / too much overlap with `review-pr`; "run the tests" and
  "measure a dimension" are base-model when asked), `diagnose-failure` (base-model-native root-causing),
  and `ingest-skill` (unneeded). `validate`'s bundled `shot_diff.mjs` visual-regression tool was
  migrated to `review-pr/scripts/` (kept as a deterministic check, documented as optional visual
  evidence for a UI PR).
- **KEEP:** the full planning stack (create-charter, plan-epic, plan-feature, execute-feature,
  advance-epic, ship-epic) and all PR operations. The conservative trim ("PR-centric radius: analysis/
  validation only") — the feature/epic machinery stays.
- **Plumbing:** removed the `skill-maintenance` and `security-delivery` profiles; dropped `analyze`/
  `validate` from `core`/`product-delivery`/`design-system-delivery`/`quality`; removed 8 routing
  cases; repointed advance-epic/execute-feature/plan-feature/ship-epic/mindsdb handoffs to base-model
  verification/analysis; updated catalog_test.go, AUTHORING.md (workflow anatomy now teaches
  PR-as-unit), and the README (removed the Analysis/Validation/Security-Analysis/Skill-Maintenance
  sections and, per the user, the whole **Archived Families** section). **Active 32 → 28.**
- Principle: the registry is now operation-verbs on a unit of work, with the **PR** as the delivery
  unit; standalone analysis/verification skills are retired because the base model does them inline.

## Progress (2026-08-19c) — doc-convention trio evicted + directions layer removed

- **User-directed, evidence-consistent.** `threat-model`, `document-architecture`, and
  `explore-directions` were the survivors kept on the "produces a conventional doc" argument
  after all three tied the base model in the 2026-08-18 methodology A/B (A=B=0.972). The user
  retired that keep-argument from direct usage experience: document-architecture unused,
  explore-directions "the wrong way to use agents — leaves too much open to interpretation,"
  threat-model still fundamentally a knowledge skill. No new A/B (content-tie evidence already
  on record; this was a product/judgment call on the artifact keep-arg, not a plausibility bet).
- **Executed:** evicted all three → `archive/doc-convention-evicted/`. Also removed the
  **`docs/directions/` planning layer** (the level above epics) from the taxonomy — charter now
  flows directly to epics (`create-charter` → `plan-epic` → `plan-feature`). Removed the
  `compliance` catalog profile (down to just `analyze` after threat-model left) and dropped it
  from `advisory`; pulled the trio from `product-delivery`; deleted 2 threat-model routing cases;
  repointed `analyze`/`execute-feature`/`plan-epic`/`ship-epic` handoffs (threat modeling +
  architecture docs are base-model capability); updated catalog_test.go and the README
  (dropped the Architecture Documentation section, the directions node/artifacts, and the
  security threat-model row). **Active 35 → 32.** Validator green (0 errors), Go tests pass.
- Consistent principle established: a conventional output document alone does not justify a
  skill when the content is base-model — the doc-convention class is retired.

## Progress (2026-08-19b) — functional-redundancy pass (Tiers 1-3) → collapse to operation-verbs

- **New axis, new instrument.** After the knowledge axis was exhausted, tested *functional*
  redundancy: are domain-specialized WORKFLOW skills redundant with the general units-of-work
  loop? Built a **substitution A/B** (`evals/substitution_ab.workflow.js`): arm A reads the
  specialist; **arm B reads the general skill(s) it would collapse into** (specialist treated
  as removed). Anchors encode each specialist's boundaries/artifacts so a general skill failing
  to reproduce a unique convention shows up as a KEEP signal. Gate: evict if B ties A.
- **Result: PASS on all 16 cases** (8 specialists × 2), A=1.000/B=1.000, 0 violations, run
  `wf_4a6721de-6f9`. Skepticism pass confirmed arm B reproduced the real conventions — the
  validation report + read-only stance, the plan-checkbox flip, diagnose-first flaky fixes,
  and domain-correct read-only ranked analyses (the contested analyze-* collapse held).
  Evidence: `evals/results/2026-08-19-redundancy-substitution-family.md`.
- **Executed (Tier 1-3, "operation-verbs" shape):** evicted the browser-test trio
  (`plan/add/fix-browser-test`), the validate pair (`validate-changes`, `validate-feature`),
  and the analyze trio (`analyze-security/-design-system/-quality`) → `archive/redundancy-evicted/`.
  Created two general operation-verbs: **`analyze`** (dimension = parameter) and **`validate`**
  (modes: changes / feature), the latter owning the migrated `shot_diff.mjs` visual-diff tool.
  Deleted the `browser-testing` profile; repointed `core`/`product-delivery`/`compliance`/
  `security-delivery`/`design-system-delivery`/`quality` profiles and all handoffs onto the two
  verbs; updated 5 routing cases, catalog_test.go, and AUTHORING.md (whose guidance now teaches
  operations-on-a-unit, not per-domain analyzers). **Active 41 → 35.**
- The thesis held: `plan-feature`/`execute-feature`/`plan-epic`/`diagnose-failure` were already
  the domain-general loop; domain narrowing (browser vs code, security vs design-system vs
  quality) added no workflow the general skills lack. Registry is now organized as operations on
  a unit of work (analyze → plan → execute → validate → deliver), not domain-flavored copies.

## Progress (2026-08-19) — platform-* + soft compliance-* tested → EVICT

- **The last untested classification-argument KEEPs, now measured.** platform-* and
  compliance-* had been deferred as CONVERT ("external objectives, a blind evict-A/B is
  the wrong instrument") and never A/B'd. Ran the standard family gate on the 10 prose
  best-practice skills — `platform-*` (5) + `compliance-{security,privacy,accessibility,
  auditability,vulnerability-management}` (5) — holding `compliance-gdpr`/`compliance-hipaa`
  out as the strong external-legal-objective keeps.
- **Result: PASS (evict) on all 10.** Overall **A=1.000, B=1.000**, every one of 20 cases
  (each skill: 1 canonical + 1 openjudgment) a tie, zero `must_exclude` violations, arm C
  never triggered (no gap to recover → no CONVERT signal). 240 agents, 0 dead. Anchors
  were written as genuine traps (commit a secret, couple a migration to its rollback, hand
  a secret to fork PR code, soft-delete-only, log full PANs); the bare model avoided every
  one and on two cases exceeded the skill prose. The flat 1.000 was skeptically checked:
  raw bare answers + judge reasoning read on the 6 hardest cases; the judge is
  discriminating (it correctly reasoned a `pull_request_target` mention gated as a "footgun"
  did NOT trip the danger anchor), not a rubber stamp. Evidence:
  `evals/results/2026-08-19-platform-compliance-family.md` (+ `-scores.tsv`),
  case file `evals/platform_compliance_pilot_cases.json`, run `wf_86a02bd3-a62`.
- **Executed:** git-mv'd the 10 skills to `archive/platform-compliance-evicted/`; deleted
  the `platform` catalog profile, slimmed `compliance` (→ analyze-security, gdpr, hipaa,
  threat-model) and `security-delivery` (→ analyze-security, plan-feature, execute-feature),
  dropped `platform` from the now-headless `advisory`; repointed all handoff refs
  (analyze-security/-design-system, execute-feature, threat-model, compliance-gdpr/-hipaa)
  to base-model capability or surviving skills; updated README + catalog_test.go advisory
  assertion. Active skills **53 → 43**, validator green (0 errors), Go tests pass.
- This corrects the 2026-08-15 "convert, not evict" call for these families: the "check
  layer" was prose pointing at external tools (gitleaks/actionlint/axe), not a bundled
  runnable check like `ui-color`/`ui-spacing`, and the base model names those tools itself.
- **Follow-up same day — `compliance-gdpr` + `compliance-hipaa` also EVICTED.** These were
  held out as the strong external-legal-objective keeps, then tested with a harder,
  legal-accuracy-focused A/B (`evals/gdpr_hipaa_pilot_cases.json`, 6 cases, anchors requiring
  exact article/CFR/timeline citations, `must_exclude` = subtle legal traps: 72h-vs-60-day,
  the "any health-data app is HIPAA" myth, purpose-limitation ignorance). Result PASS
  (A=1.000/B=1.000, 0 violations, run `wf_b077e72b-483`); the bare model cited Art. 17 / Art.
  33/34 / §164.400-414 correctly and called out the planted traps by name. Read every bare
  answer to confirm real accuracy, not a lenient judge. No artifact/boundary/plumbing value to
  invoke (unlike the methodology KEEPs), so the tie is an evict. Archived to
  `archive/platform-compliance-evicted/`; `compliance` profile now `analyze-security` +
  `threat-model`; handoffs repointed with the "escalate legal interpretation to a privacy/legal
  owner" guardrail preserved. Evidence: `evals/results/2026-08-19-gdpr-hipaa-family.md`.
  **Active 43 → 41. No prose-knowledge skills remain; the rebalance is complete at 108 → 41.**

## Progress (2026-08-18c) — methodology workflows tested → KEEP all

- **Methodology-workflow family A/B** (`diagnose-failure`, `document-architecture`,
  `explore-directions`, `threat-model`, `polish-issue`) —
  `evals/results/2026-08-18-method-family.md`. Content-quality tie everywhere
  (A=0.972, B=0.972): the base model writes an equally good diagnosis, architecture
  doc, direction set, threat model, and polished issue. **But content quality is not
  the whole value** — the decision was made on convention/boundary value the A/B
  can't score, and all five were KEPT:
  - `document-architecture`, `explore-directions` → keep as artifact
    conventions/contracts the planning pipeline consumes (docs/architecture,
    docs/directions → plan-epic).
  - `threat-model` → keep as the compliance security-evidence artifact.
  - `diagnose-failure` → keep (user call): read-only "don't fix" effect-boundary +
    anchors the core profile.
  - `polish-issue` → keep as Linear plumbing (write mechanic + don't-change-scope
    guardrail).
  This confirms the KEEP categories are defensible: a convention/boundary/plumbing
  objective is not derivable knowledge, even when the base model matches the content.
  **No family or candidate trails remain.**

## Progress (2026-08-18b) — routers evicted

- **Router family evicted (`consult-expert`, `compliance-expert`, `platform-expert`,
  `ui-expert`) → `archive/router-evicted/`.** Family A/B holding the visible delegate
  list constant across arms (`evals/results/2026-08-18-router-family.md`): the bare
  model routed to the correct focused-skill subset and synthesized as well or better
  without the router prose (final A=0.989, B=1.000; consult-expert: bare beat it).
  A router over a delegate set the model already sees is redundant — the plan's own
  "collapse routers" rule, now measured. Focused delegates all stay. **Active skills
  55 → 51.** Rewrote the catalog_test.go advisory assertion and repointed all router
  references (compliance-accessibility, analyze-design-system, analyze-security,
  execute-feature, ship-epic, README, one routing eval case).
- **Still untested (next):** the generic-methodology workflows — `diagnose-failure`,
  `document-architecture`, `explore-directions`, `threat-model`, and `polish-issue` —
  scheduled for an artifact-quality A/B.

## Progress (2026-08-18) — main

- **Cross-cutting + ui-* families resolved and merged (PR #29):** active skills
  **70 → 55**. Evicted `error-handling`, `async-patterns`, and 13 ui-* prose skills
  (incl. `visual-hierarchy`); converted `typescript-types` and `ui-patterns` to
  objective+check; slimmed `ui-expert`. Evidence:
  `evals/results/2026-08-17-{cross-cutting,ui}-family.md`. Fixed a silent
  `score_ab.py --exclude` no-op and hardened the A/B harness against subagent
  context-leakage (`evals/family_ab.workflow.js`, generalized over any family).
- **compliance-*/platform-* check-layer verified complete (PR #30):** on audit, the
  "objective + pinned citation + automated check" layer is present on all 13
  reference skills; routers and `threat-model` don't need one. The only remaining
  debt was stale handoff references to earlier-evicted skills (react-accessibility,
  quality-*, backend-*) — repointed across compliance/platform + analyze-quality;
  repo-wide sweep now clean.
- **No family A/B trails remain.** Future retention passes just re-run the standing
  gate as models improve.

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
| **Platform knowledge** | `platform-*` (5) + `platform-expert` | **EVICTED 2026-08-19** | A/B tied the base model on every case incl. canonical traps; the "check layer" was prose naming external tools, not a bundled check. `archive/platform-compliance-evicted/`; `platform` profile removed. `evals/results/2026-08-19-platform-compliance-family.md`. |
| **Compliance / risk** | `compliance-*` (7), `threat-model`, `consult-expert` | **RESOLVED 2026-08-19: evict all 7 prose, keep only `threat-model`** | All 5 best-practice skills + `compliance-gdpr`/`compliance-hipaa` A/B-tied the base model (the latter under a harder legal-accuracy gate) → `archive/platform-compliance-evicted/`. `threat-model` kept as evidence artifact; `consult-expert`/`compliance-expert` routers already evicted 2026-08-18. |
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
