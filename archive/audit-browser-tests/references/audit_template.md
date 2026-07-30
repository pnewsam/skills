# Browser-Test Epic Audit Template

Use this structure for browser-test audits written beside the related browser-test epic in `docs/epics/`.

```markdown
# Browser Test Audit: <epic or app name>

## Summary

| Metric | Count |
| --- | --- |
| Test files found | <n> |
| Flows covered | <n> |
| Broken/stale flows | <n> |
| Missing critical flows | <n> |
| Flaky patterns | <n> |

Suite status: <passed/failed/not run>

## Findings

### <finding title>

- **Type:** stale-test / missing-coverage / flaky-pattern / quality-issue / duplicate-coverage
- **Severity:** critical / high / moderate / low
- **Evidence:** <test file, selector, route, or source reference>
- **Recommended child feature:** <feature name>

## Recommended Epic Updates

- Add child feature: <name> - <reason>
- Update flow inventory: <flow> - <status>

## Recommended Next Steps

1. Plan the highest-priority child feature with `plan-feature`.
2. Implement planned browser-test coverage with `add-browser-test`.
3. Repair named broken tests with `fix-browser-test`.
```
