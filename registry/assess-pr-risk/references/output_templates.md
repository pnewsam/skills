# Output templates

Use these templates when formatting and posting the risk assessment.

## Risk badges

Use the appropriate badge text in the comment header:

| Level | Badge text |
|-------|-----------|
| Low | `LOW RISK` |
| Medium | `MEDIUM RISK` |
| High | `HIGH RISK` |
| Critical | `CRITICAL RISK` |

## PR comment template

Fill in every section from the assessment. Remove dimension rows marked N/A if you prefer a cleaner table, or keep them to show completeness.

```markdown
## PR Risk Assessment

**Overall risk: <LEVEL>** — <one-sentence reason for the overall rating>

<One paragraph summarizing the most important findings. Be specific: name the files, areas, or patterns that drove the rating. Avoid generic language.>

### Dimension breakdown

| Dimension | Rating | Notes |
|-----------|--------|-------|
| Blast radius | <Low/Medium/High/Critical> | <file count, modules affected> |
| Change type | <Low/Medium/High/Critical> | <type of change, breaking or not> |
| Security sensitivity | <Low/Medium/High/Critical> | <areas touched or "none"> |
| Data risk | <Low/Medium/High/Critical> | <schema changes, deletions, or "none"> |
| Test coverage | <Low/Medium/High/Critical> | <coverage state, new tests added or not> |
| Dependencies | <Low/Medium/High/Critical or N/A> | <packages changed, or "no changes"> |
| Infrastructure / config | <Low/Medium/High/Critical or N/A> | <files changed, or "no changes"> |

### Recommendations

- <Specific action the author or reviewer should take before merging>
- <Add more items as needed — keep each one actionable and tied to a specific finding>

---
_Assessed by Claude Code · <branch> → <base> · <date>_
```

## Final status (Step 9 output)

```markdown
Posted risk assessment on PR #<number> — <url>

Overall risk: <LEVEL>
Key factor: <the single dimension or finding that drove the rating>
```
