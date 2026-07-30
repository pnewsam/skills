# Security Finding Source Adapters

Read only the sections that match the selected mode.

## Dependency findings

Possible sources include Dependabot, CVE/GHSA details, package-manager audit
tools, base-image scanners, and user-provided advisories.

Collect when available:

- advisory ID and source URL
- ecosystem, package manager, package, and dependency path
- current resolved version and fixed range
- manifest and lockfile paths
- direct or transitive status
- compatibility or migration implications

Safe groups commonly share a package, parent dependency, manifest, lockfile,
base image, or GitHub Action. Keep unrelated major upgrades separate.

Inventory columns:

| Group | Findings | Ecosystem | Packages | Severity | Exposure | Status | Child feature |
| --- | --- | --- | --- | --- | --- | --- | --- |

Recommended handoff: `remediate-vulnerability`.

## Code-scanning findings

Possible sources include CodeQL, SAST tools, workflow scanners, or
user-provided alert IDs, rules, locations, and messages.

Collect when available:

- alert ID, rule ID, tool, and URL
- severity, confidence, and message
- affected file and line range
- source, sink, guard, or permission path
- runtime reachability or configuration assumptions

Safe groups commonly share one rule/cause in a subsystem, one source/sink
pattern, or one workflow-permission correction. Keep unrelated languages,
rules, owners, and behavior changes separate.

Inventory columns:

| Group | Alerts | Rules | Severity | Affected files | Exposure | Status | Child feature |
| --- | --- | --- | --- | --- | --- | --- | --- |

Recommended handoff: `remediate-code-scanning`.

## Mixed findings

Use one epic when the findings support one security outcome and planning
cadence. Keep separate group IDs, inventories, and remediation handoffs.
Create separate epics when ownership, deadlines, or rollout processes differ.
