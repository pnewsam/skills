# Functional-redundancy substitution — Tiers 1-3 (2026-08-19)

Specialists tested (8): `plan-browser-tests`, `add-browser-test`, `fix-browser-test`,
`validate-changes`, `validate-feature`, `analyze-security`, `analyze-design-system`,
`analyze-quality`.

Case file: `evals/redundancy_substitution_cases.json` (16 cases, 2 per skill).
Harness: `evals/substitution_ab.workflow.js`. Scores: `evals/results/2026-08-19-redundancy-substitution-scores.tsv`.
Run id: `wf_4a6721de-6f9`. 192 scored units (199 agents; 3 transient API errors auto-retried, 0 dead).

## The instrument (different from the knowledge A/B)

This tests *functional* redundancy, not knowledge quality. Arm A reads the specialist
skill; **arm B reads the general workflow skill(s) it would collapse into** (the
specialist treated as removed), then answers the specialist's own trigger task:

- browser trio → `plan-epic`+`plan-feature` (plan) / `execute-feature` (add) / `diagnose-failure`+`execute-feature` (fix)
- validate pair → `execute-feature`
- analyze trio → a single general `analyze` contract (`docs/analyze-general-note.md`)

Anchors deliberately encode each specialist's **boundaries and artifacts** (read-only,
"updates the plan," "ranked candidates," the validation-report contract) so that a
general skill failing to reproduce a unique convention shows up as arm-B scoring lower
(a KEEP signal). Gate: evict if `mean(B) >= mean(A) - 0.10` and no B-only violation.

## Result

`score_ab.py`: **PASS on all 16 cases.** Overall **A=1.000, B=1.000, gap 0.000**, zero
`must_exclude` violations in either arm. The general loop ties the specialist everywhere.

## Skepticism pass — did arm B reproduce the boundaries/artifacts, or just look plausible?

Read the raw arm-B answers on the six highest-scrutiny cases (the unique-convention risks):

- **`val-feature-shipcheck` (execute-feature):** arm B treated it as a read-only
  verification pass, wrote `docs/features/reports/003-validation.md`, added a reference
  line back into the plan, gave a SHIP/NO-SHIP verdict, and explicitly refused to fix,
  commit, push, or open the PR — handing defects back to another `execute-feature` run.
  This is `validate-feature`'s exact contract, reproduced.
- **`val-changes-spotcheck` (execute-feature):** git-diff → mapped tests → "Scope: 3 of
  214 suites (whole suite NOT run)" → coverage-gap report → refused to edit source.
- **`an-security-posture` (general analyze note):** verified the executable surface
  "rather than reciting a scanner," framed by reachability×exposure×impact, 4 ranked
  feature-sized candidates with evidence, read-only, "ready for plan-feature."
- **`an-designsys-convergence` (general analyze note):** reproducible `rg` drift scans,
  measured baseline, 6 ranked candidates by leverage, read-only.
- **`bt-add-login` (execute-feature):** one focused test, resilient `getByRole`/`getByLabel`
  locators, real post-login assertions, green run before "done," flipped the plan
  checkbox `[ ]`→`[x]`, scope held to the single flow.
- **`bt-fix-flaky` (diagnose-failure + execute-feature):** diagnose-first root-cause
  table, deterministic fix (`cy.intercept` + wait-on-alias), burn-in stability proof,
  explicitly rejected `cy.wait(number)`, `retries`, and `.skip()`.

The judge verified these specific boundary behaviors (artifact paths, read-only stance,
no-blind-retries), not rubber-stamping. The flat 1.000 is genuine functional coverage.

## Verdict

**All 8 specialists are functionally redundant** with the general units-of-work loop.
The thesis holds: `plan-feature`/`execute-feature`/`plan-epic`/`diagnose-failure` are
already the domain-general loop, and domain narrowing (browser vs code, security vs
design-system vs quality) adds no workflow the general skills lack — the domain part is
base-model knowledge (established in the prior phases). Notably the contested Tier-3
collapse held: a single general `analyze` contract + base-model domain knowledge
produced domain-correct read-only ranked analyses for all three domains.

## Execution notes (things to preserve, not just delete)

- **`shot_diff.mjs`** (validate-changes' bundled PNG visual-regression tool) is a real
  deterministic check — migrate it, don't lose it.
- The **validation-report + ship/no-ship contract** (validate-feature) and the
  **read-only "analyze → ranked candidates" contract** (analyze-*) are worth encoding
  explicitly on their absorbing skills so routing still works.
- The `browser-testing` profile is fully gutted → remove; repoint `security-delivery`,
  `design-system-delivery`, and `quality` profiles off the evicted analyzers.
