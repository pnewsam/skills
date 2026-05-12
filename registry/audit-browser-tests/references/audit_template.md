# Audit report template

Write this to `docs/tmp/browser-test-audit.md`.

```markdown
# Browser Test Audit

Date: <date>
Framework: <playwright|cypress>
App: <brief description>

## Summary

| Metric | Count |
|--------|-------|
| Test files found | <n> |
| Flows covered (passing) | <n> |
| Flows broken / stale | <n> |
| Critical flows missing | <n> |
| Flaky patterns found | <n> |
| Quality issues found | <n> |

Suite status: <passed n/n | not run — app not available>

---

## Stale tests

Tests that reference selectors, routes, or flows that no longer exist in the application.

### <test file path>

- **Issue:** <what is stale — selector, route, or flow>
- **Detail:** `data-testid="<value>"` not found in source / route `/<path>` no longer exists / etc.
- **Recommended action:** Run `fix-browser-test` on this file

<!-- Repeat for each stale test -->

---

## Missing critical flows

Flows that exist in the application but have no test coverage.

### <Flow name>

- **Why critical:** <one sentence>
- **Preconditions:** <starting state>
- **Recommended action:** Added to `browser-test-plan.md` as an unchecked flow

<!-- Repeat for each missing flow -->

---

## Flaky patterns

Tests with structural issues that cause unreliable results.

### <test file path>

- **Pattern:** <hardcoded wait | order dependency | shared state | broad selector>
- **Location:** Line <n> — `<code snippet>`
- **Recommended fix:** <specific suggestion>

<!-- Repeat for each finding -->

---

## Quality issues

Tests that pass but are not providing meaningful coverage.

### <test file path>

- **Issue:** <no assertions | over-broad assertions | multiple unrelated flows | etc.>
- **Location:** Line <n>
- **Recommended fix:** <specific suggestion>

<!-- Repeat for each finding -->

---

## Duplicate coverage

Flows tested by more than one test with no meaningful variation.

- `<file A>` and `<file B>` both test `<flow>` — consider consolidating

---

## Recommended actions

In priority order:

1. **Fix broken tests** — run `fix-browser-test` on: <list files>
2. **Add missing flows** — run `add-browser-test` for: <list flow names>
3. **Address flaky patterns** — <summary of structural fixes needed>
4. **Address quality issues** — <summary>

---

## Notes

<!-- Anything else the team should know: test data setup, environment requirements, framework recommendations, etc. -->
```
