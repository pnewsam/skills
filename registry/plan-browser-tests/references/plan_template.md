# Browser-Test Epic Template

Use this structure when creating or updating a browser-test coverage epic in `docs/epics/`.

```markdown
# Epic: Browser Test Coverage

## Metadata

- **ID:** <NNN>
- **Status:** draft
- **Created:** <date>
- **Last updated:** <date>
- **Framework:** <playwright|cypress|recommended playwright>

## Charter Alignment

- **Principle advanced:** <charter principle, or provisional if docs/CHARTER.md is missing>
- **Reliability outcome:** <what user trust or workflow confidence improves>
- **Non-goal check:** <what this coverage pass will not test>

## Problem Statement

<Summarize the coverage gap and why browser tests are worth adding now.>

## Goals

1. <coverage goal>
2. <coverage goal>

## Success Criteria

| Criterion | Target | Measurement Method |
| --- | --- | --- |
| Critical flows covered | <n> flows | Passing browser tests in CI/local run |

## Child Features

- [ ] <Feature 1> - <flow cluster and outcome>
- [ ] <Feature 2> - <flow cluster and outcome>

## Flow Inventory

| Flow | Priority | Existing coverage | Proposed child feature | Notes |
| --- | --- | --- | --- | --- |
| <flow> | critical/high/moderate/low | none/partial/covered | <feature> | <setup or risk notes> |

## Deferred Flows

- <flow> - <reason deferred>

## Notes

- Framework detected:
- Existing test conventions:
- Auth/test data notes:
```
