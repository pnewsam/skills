# Security Remediation Epic Template

```markdown
# Epic: <Security Remediation Scope>

## Metadata

- **ID:** <NNN>
- **Status:** draft
- **Created:** <date>
- **Last updated:** <date>
- **Sources:** <finding sources>

## Charter Alignment

- **Principle advanced:** <security, trust, reliability, or provisional>
- **Security outcome:** <risk reduced>
- **Non-goals:** <broad upgrades or rewrites excluded>

## Problem Statement

<Summarize verified finding families, exposure, and impact without raw logs or
secrets.>

## Goals

1. Resolve or explicitly disposition verified findings.
2. Keep remediation groups focused and reviewable.
3. Produce evidence that the vulnerable state is removed.

## Success Criteria

| Criterion | Target | Evidence |
| --- | --- | --- |
| Verified groups remediated | <n> | scanner/audit clear and PR validation |
| Unresolved critical/high findings | 0 or explicitly owned | inventory and decisions |

## Child Features

- [ ] <Feature> — remediate `<group_id>`

## Remediation Inventory

<Use the source-specific columns from source_adapters.md.>

## Decisions and Exceptions

- <applicability dispute, risk acceptance, owner, rationale, and expiry>

## Notes

- Existing work:
- Already fixed or stale:
- Needs input:
- Verification and rollout:
```
