# Threat Model Template

Use this template in Document mode. Remove empty optional sections.

```markdown
# Threat Model: <scope>

## Scope

- **Decision supported:**
- **In scope:**
- **Out of scope:**
- **Evidence reviewed:**
- **Assumptions:**

## Assets and Objectives

| Asset | Security objective | Consequence if compromised |
| --- | --- | --- |
| <asset> | confidentiality / integrity / availability / authorization | <impact> |

## Actors and Entrypoints

| Actor | Trust level | Entrypoints and capabilities |
| --- | --- | --- |
| <actor> | <level> | <entrypoints> |

## Data Flows and Trust Boundaries

| Flow | Data or action | Boundary crossed | Existing controls |
| --- | --- | --- | --- |
| <source → destination> | <data/action> | <boundary> | <controls> |

## Threats

| ID | Abuse case | Asset | Impact | Exploitability | Rating | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| T-01 | <actor can...> | <asset> | <impact> | <path> | <rating> | <evidence> |

## Treatments

| Threat | Prevent | Detect | Limit | Verify | Disposition / owner |
| --- | --- | --- | --- | --- | --- |
| T-01 | <control> | <evidence> | <boundary> | <test/check> | mitigate / owner |

## Residual Risk and Decisions

- <accepted or unresolved risk, owner, rationale, and review trigger>

## Verification Plan

- <test, review, monitoring, or operational evidence>
```
