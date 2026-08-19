# platform-* + soft compliance-* family — family A/B (2026-08-19)

Family: `platform-ci-cd`, `platform-deployments-rollbacks`, `platform-environments`,
`platform-infrastructure-as-code`, `platform-secrets-config`, `compliance-security`,
`compliance-privacy`, `compliance-accessibility`, `compliance-auditability`,
`compliance-vulnerability-management` (10 skills).
Held out of scope (kept regardless): `compliance-gdpr`, `compliance-hipaa` — the
strong external-legal-objective keeps (specific article/safeguard citations, high
cost-of-miss).

Case file: `evals/platform_compliance_pilot_cases.json` (20 cases: each skill gets one
`canonical` + one `openjudgment`). Prompts: same file (self-contained).
Substitute note (arm C): `docs/platform-compliance-substitute-note.md`.
Harness: `evals/family_ab.workflow.js`. Scores: `evals/results/2026-08-19-platform-compliance-scores.tsv`.
Run id: `wf_86a02bd3-a62`. 240 agents, 0 error, 0 dead/degenerate.

## Why this run exists

platform-* and compliance-* were the last untested KEEPs. Every other family went
through this gate and was evicted or converted; these two were deferred on a
*classification argument* — "external objectives, a blind evict-A/B is the wrong
instrument" (`docs/registry-rebalance-plan.md`, 2026-08-15) — and never measured.
Every classification-argument KEEP that was later tested fell (routers: bare beat the
router) or tied on content (methodology: kept on convention/boundary grounds). Neither
of these families bundles a runnable check; their "Checks" sections are prose pointing
at external tools (gitleaks, actionlint, axe, semgrep) — the same prose shape as the
evicted react/python/backend families, not the `ui-color`/`ui-spacing` bundled-checker
shape. This run measures the deferred claim.

## The instrument

- **Arm A**: reads `registry/<skill>/SKILL.md` and applies it.
- **Arm B**: capable bare model, no skill, forbidden from reading `registry/` or `docs/`.
- **Arm C**: arm B + the tool-only substitute note (CONVERT hypothesis) — runs only on
  cases where mean(A) − mean(B) > 0.15.
- Anchors were written as genuine traps, not soft passes: each `must_exclude` is a real
  anti-pattern a hurried strong model could commit (commit a secret to `.env.example`,
  treat image-redeploy as sufficient rollback, hand a real secret to fork PR code,
  soft-delete-only, log full PANs, rank purely on CVSS).

## Result

Official `score_ab.py` verdict: **PASS (evict) on all 10.** Overall **A=1.000, B=1.000,
gap 0.000.** Every one of the 20 cases tied at 1.000/1.000 with zero `must_exclude`
violations in either arm. All 10 `openjudgment` cases flagged "open tie (strong)" (a
tied genuine-judgment case is stronger evidence than a tied canonical one). No case
opened an A−B gap, so **arm C never triggered** — there was no gap for a tool pointer
to recover, i.e. no CONVERT signal either.

| Skill | canonical | openjudgment | Read |
| --- | --- | --- | --- |
| platform-ci-cd | 1.000 / 1.000 | 1.000 / 1.000 | tie |
| platform-deployments-rollbacks | 1.000 / 1.000 | 1.000 / 1.000 | tie |
| platform-environments | 1.000 / 1.000 | 1.000 / 1.000 | tie |
| platform-infrastructure-as-code | 1.000 / 1.000 | 1.000 / 1.000 | tie |
| platform-secrets-config | 1.000 / 1.000 | 1.000 / 1.000 | tie |
| compliance-security | 1.000 / 1.000 | 1.000 / 1.000 | tie |
| compliance-privacy | 1.000 / 1.000 | 1.000 / 1.000 | tie |
| compliance-accessibility | 1.000 / 1.000 | 1.000 / 1.000 | tie |
| compliance-auditability | 1.000 / 1.000 | 1.000 / 1.000 | tie |
| compliance-vulnerability-management | 1.000 / 1.000 | 1.000 / 1.000 | tie |

## Skepticism pass — is the flat 1.000 real, or a lenient judge?

A perfectly flat 1.000/1.000 is the "too clean" pattern that warrants distrust, so the
raw arm-B answers and the judge reasoning were read on the six hardest trap cases
(`secrets-env-example`, `sec-sql-injection`, `deploy-migration-rollback`,
`cicd-fork-pr-secret`, `priv-export-delete`, `audit-admin-action`). Findings:

- The bare answers are **comprehensive, not marginal.** On `cicd-fork-pr-secret` and
  `audit-admin-action` the bare model produced guidance **beyond** the skill prose —
  it named `pull_request_target` + head.sha checkout as "the classic footgun" and gated
  it, and it specified hash-chaining/WORM immutable audit logs and excluded full PANs.
- The **judge is discriminating.** On `cicd-fork-pr-secret` the judge noticed the bare
  answer *mentioned* the risky `pull_request_target` pattern and reasoned that because
  the answer labeled it a footgun and gated it, the "without noting the danger"
  `must_exclude` was NOT met — the exact fine distinction a rubber-stamp would miss. Had
  the answer recommended it naively, the anchor would have fired.
- 0 degenerate reps; the hardened detector held. The flatness reflects internalized
  knowledge, not a soft rubric.

## Verdict

**EVICT all 10** (`platform-*` ×5, `compliance-{security,privacy,accessibility,
auditability,vulnerability-management}`). The base model matches or exceeds the skill
prose on both canonical traps and open-judgment trade-offs, commits none of the
anti-patterns the skills exist to prevent, and names the same external tools the "Checks"
sections point at without being told. There is no bundled check to preserve and no
residual convention/boundary the way there was for the methodology workflows — these are
derivable engineering/best-practice knowledge. Move to `archive/platform-compliance-evicted/`.

**Kept:** `compliance-gdpr`, `compliance-hipaa` (out of scope; external legal objectives),
`threat-model` (compliance evidence artifact, kept 2026-08-18), `analyze-security` +
`compliance-*`-consuming delivery profiles repointed.

## Limitation / optional harder round

The result is unambiguous but flat. If a stricter round is wanted before acting, the
adversarial variant is "plausible-but-subtly-wrong" prompts (a defensible-looking answer
that violates one anchor) to test whether the bare model catches the subtle miss the
skill would. Prior families were not held to that higher bar; noting it for parity.
