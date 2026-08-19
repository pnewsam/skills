# Security Finding Sources

## Contents

- Dependency findings
- Code-scanning findings
- Posture findings
- Grouping and status

## Dependency findings

Possible sources include Dependabot, CVE/GHSA details, package-manager audit tools, base-image scanners, and user-provided advisories.

Collect when available:

- advisory ID and authoritative source
- ecosystem, package manager, package, and dependency path
- current resolved version and fixed range
- manifest and lockfile paths
- direct or transitive status
- production reachability and exposure
- compatibility or migration implications
- an existing bot PR, branch, feature plan, or owner

Safe groups commonly share a package, parent dependency, manifest, lockfile, base image, or GitHub Action. Keep unrelated ecosystems and risky major upgrades separate.

Suggested inventory:

| Group | Findings | Ecosystem | Packages | Severity | Exposure | Status |
| --- | --- | --- | --- | --- | --- | --- |

## Code-scanning findings

Possible sources include CodeQL, SAST tools, workflow scanners, or user-provided alert IDs, rules, locations, and messages.

Collect when available:

- alert ID, rule ID, tool, and authoritative link
- severity, confidence, and message
- affected file and line range
- source, sink, guard, or permission path
- runtime reachability or configuration assumptions
- an existing branch, pull request, feature plan, or owner

Safe groups commonly share one rule or cause in a subsystem, one source/sink pattern, or one workflow-permission correction. Keep unrelated languages, rules, owners, and behavior changes separate.

Suggested inventory:

| Group | Alerts | Rules | Severity | Affected files | Exposure | Status |
| --- | --- | --- | --- | --- | --- | --- |

## Posture findings

Inspect the following directly — secure-coding assessment is base-model capability:

- authentication, authorization, tenant, and object ownership boundaries
- injection and unsafe interpreter boundaries
- secrets, credentials, tokens, and sensitive logging
- sessions, CSRF, expiry, revocation, and administrative operations
- CI/CD permissions, trusted artifacts, registries, and provenance
- control verification, negative tests, audit evidence, and accepted risk

Describe a gap as an evidence-backed missing or ineffective control, not a generic best-practice recommendation.

## Grouping and status

A candidate should normally become one feature and one focused change. Group only when findings share:

- one underlying cause or dependency update
- compatible ownership and rollout
- the same verification path
- a safe dependency or deployment sequence

Use stable group IDs derived from the source and cause. Preserve these statuses:

- **ready:** verified and feature-sized
- **covered:** credible existing work owns it
- **already fixed:** current state no longer contains it
- **stale/false:** evidence shows the reported path does not apply
- **accepted risk:** named owner, rationale, evidence, and review date exist
- **needs input:** reachability, ownership, policy, or runtime evidence is missing
