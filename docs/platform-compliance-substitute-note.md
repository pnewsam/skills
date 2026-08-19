# Substitute note — platform-* / soft compliance-* (arm C)

This is the CONVERT-hypothesis context for the platform/compliance family A/B. It
lists **only** the deterministic tools and checks the skills point at — no method
prose, no rubric, no "how to think about it." Arm C tests whether naming the
enforceable check recovers any quality gap the prose arm (A) opened over the bare
arm (B). If it does, the skill converts to a thin objective + tool pointer; the prose
is not restored.

Use these as the ground-truth checks for your answer where relevant, and make sure
your recommendation would pass them.

## CI/CD, deploys, environments, IaC

- **actionlint** — lint GitHub Actions workflows (syntax, shell, permissions).
- **Least-privilege permissions** — workflows/jobs default read-only; escalate per job.
- **Pinned actions/images** — pin third-party actions and base images by digest/SHA for privileged jobs.
- **SLSA provenance / build attestations** — build once, attest, deploy the attested artifact.
- **Health/smoke gate** — post-deploy health check + smoke test as a promotion gate; automated rollback trigger on breach.
- **Progressive delivery** — canary / blue-green tooling with metric-based promotion.
- **checkov / tfsec / `terraform plan` + `terraform validate`** — IaC policy, drift detection, plan-review-before-apply.
- **Environment parity** — same backing-service types across environments; config injected per environment at runtime.

## Secrets and config

- **gitleaks / trufflehog** — secret scanning in pre-commit and CI; platform push protection (e.g. GitHub secret scanning).
- **Runtime injection** — secret manager / Kubernetes Secret / external-secrets, injected at runtime not build time.
- **Config validation at startup** — fail fast with redacted errors; checked-in config schema (placeholders only).
- **Short-lived credentials / OIDC / workload identity** over static long-lived keys.

## Application security

- **Parameterized queries / prepared statements** — the injection fix, not string concatenation.
- **SAST** (e.g. CodeQL / semgrep) and **dependency scanning** (e.g. `npm audit`, Dependabot, `pip-audit`, Trivy).
- **Secret scanning** — as above.
- OWASP ASVS / Top 10 as the objective set for auth, session, injection, and sensitive-data handling.

## Privacy

- **Data map / PII inventory** — know where personal data is collected, stored, and flows.
- **Redaction / tokenization** of sensitive fields in logs and analytics; retention limits; access controls.
- **Export + deletion coverage check** — deletion reaches backups, logs, derived data, and third parties, with verification.

## Accessibility

- **axe-core / eslint-plugin-jsx-a11y** — automated a11y lint and scan.
- **Contrast checker** — WCAG AA/AAA contrast ratios (the `ui-color` `check_contrast.py` math).
- **Manual/AT pass** — keyboard walkthrough and screen-reader test for what automation cannot prove.
- WCAG 2.2 success criteria as the objective set.

## Auditability

- **Append-only / tamper-evident audit log** — actor, action, target, time, authorization basis; retained.
- **Change traceability** — requirement/ticket → PR approval → CI evidence → deploy log → artifact identity.

## Vulnerability management

- **Reachability/exploitability triage** over raw CVSS count; proportionate remediation SLAs.
- **Dependency + SAST scanners** — as above; re-scan to produce closure evidence after remediation.
