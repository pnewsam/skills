---
name: analyze-security
description: Analyze a repository's application-security posture or current dependency and code-scanning findings; verify and normalize evidence, assess reachability and exposure, group cohesive risks, and rank feature-sized remediation candidates. Use for recurring security hardening reviews, CVE/GHSA or Dependabot triage, CodeQL/SAST analysis, control-gap assessment, or when security findings need evidence before planning. Defaults to read-only analysis and never changes code, dependencies, plans, Git state, or external systems.
---

# Analyze Security

## Outcome

Produce a read-only, evidence-backed security assessment with a small ranked set of feature-sized remediation candidates. Convert alerts and suspected control gaps into reachability, exposure, impact, fix path, regression risk, and required evidence before planning.

Use `compliance-expert` to route security judgment. Use `threat-model` instead when the requested outcome is a formal asset, actor, data-flow, trust-boundary, and abuse-case model for one feature or system.

## Source anchors

- OWASP ASVS: https://owasp.org/www-project-application-security-verification-standard/
- OWASP SAMM requirements-driven testing: https://owaspsamm.org/model/verification/requirements-driven-testing/
- GitHub CodeQL pull-request alert metrics: https://docs.github.com/en/code-security/concepts/code-scanning/pull-request-alert-metrics

## Modes and effects

- **Posture:** assess secure defaults and control gaps across authentication, authorization, input boundaries, secrets, sessions, sensitive logging, CI/CD, and supply chain.
- **Dependency findings:** analyze CVEs, GHSAs, Dependabot, package-manager audits, base images, actions, and transitive dependencies.
- **Code-scanning findings:** analyze CodeQL, SAST, workflow, source/sink, and similar source-code findings.
- **Broad:** combine posture and current findings but keep candidates separate when their fix, owner, verification, or rollout differs.

This workflow may inspect local files, Git history, authorized remote findings, and existing project scanner output. It must not install or run active probes, modify files or dependencies, create plans, commit, push, suppress findings, or write to external systems.

Read `references/findings.md` for the selected finding sources and `references/metrics.md` when measuring posture or trends.

## Workflow

### 1. Scope and gather

Define the repository, application, environment, finding sources, and explicit exclusions. Identify current languages, package managers, deployment shape, identity boundaries, sensitive data, and existing security automation.

Use user-provided evidence, authorized remote reads, and scanners already configured by the project. Do not install a scanner merely to complete the analysis. Never paste secrets, credentials, private registry URLs, or raw sensitive logs into the report.

### 2. Verify, group, and prioritize

Normalize each finding or control gap to:

- stable ID or evidence marker and source
- affected package, file, route, control, or component
- current state, reachability, exposure, impact, and confidence
- plausible fix or control and regression risk
- verification, negative-test, scanner, or review evidence
- status: ready, covered, already fixed, stale/false, accepted risk, or needs input

Inspect current manifests, lockfiles, source, control paths, configuration, and existing branches, plans, or pull requests before marking a finding ready. Preserve uncertainty when runtime configuration or unavailable evidence is material.

Group only findings that share one cause or update, compatible ownership and rollout, and the same verification path. Rank groups by credible impact and exploitability, active exposure and reachability, dependency order, supported fix availability, and review size. Do not rank by scanner severity alone.

### 3. Report and hand off

Return:

- scope, sources, windows, exclusions, and evidence gaps
- ready groups with stable IDs, included findings, priority, and rationale
- covered, already-fixed, stale/false, accepted-risk, and needs-input findings
- baseline, target, guardrails, and verification for each leading candidate
- existing work that should be continued rather than duplicated
- the best candidate for `plan-feature` in Convergence mode

Do not create the feature plan from this skill. When there are many findings, recommend repeated `plan-feature` runs for the ranked groups; use an epic only when the user is deliberately managing a larger security program.

## Safety and reruns

- Do not probe production or third-party systems without separate explicit authorization.
- Do not treat scanner output as proof without checking current state.
- Risk acceptance requires a named owner, rationale, review date, and evidence.
- On rerun, match stable IDs and groups, update evidence and status, and do not duplicate already-owned work.
