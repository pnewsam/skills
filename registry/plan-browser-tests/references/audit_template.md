# Browser-test epic audit template

```markdown
# Browser Test Audit: <epic or application>

## Metadata

- **Coverage epic:** `<path or provisional>`
- **Framework:** <framework>
- **Audit date:** <date>
- **Suite status:** <passed / failed / partially run / not run>
- **Scope:** <areas and exclusions>

## Summary

| Metric | Count |
| --- | ---: |
| Test files inspected | <n> |
| Critical flows identified | <n> |
| Flows credibly covered | <n> |
| Missing critical flows | <n> |
| Broken or stale flows | <n> |
| Flake-risk patterns | <n> |

<Overall assessment and the most important coverage risk.>

## Flow map

| Flow | Priority | Evidence | Coverage | Recommended action |
| --- | --- | --- | --- | --- |
| <flow> | critical/high/moderate/low | <routes and tests> | covered/partial/missing/broken | <specific action> |

## Findings

### <finding>

- **Type:** missing-coverage / broken-test / stale-test / flake-risk /
  weak-assertion / duplicate-coverage / setup-gap
- **Severity:** critical / high / moderate / low
- **Evidence:** <exact source, test, selector, log, or observed run>
- **Consequence:** <user-visible or delivery risk>
- **Proposed child feature:** <name, or none>

## Epic updates

- <entries changed, added, or deliberately preserved>

## Evidence limits

- <what was not run, inspected, or available>

## Next steps

1. <dependency-aware action using plan-feature, add-browser-test,
   fix-browser-test, or setup-browser-testing>
```

Do not label a pattern flaky without observed nondeterminism. Use “flake risk”
when evidence is static.
