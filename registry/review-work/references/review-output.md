# Review output

The shape a review is presented in — in chat and in any posted review body. Risk mode uses `risk.md` instead. This controls presentation only; what earns a finding is the `pr-conventions/references/finding-model.md` standard, not this template.

Present verdict first, a tight summary, honest validation, then findings ordered by severity:

```markdown
## Code Review

**Verdict: <APPROVE | REQUEST CHANGES | COMMENT>**
**Model: <exact id of the model that produced this review, e.g. claude-opus-4-8; "unknown" if not reliably known>**

<Two to four sentences: what you reviewed (scope), the one reason the verdict holds, and the bottom line (e.g. "No actionable findings."). Do not narrate the change back to the author or list every path you traced — that belongs in Validation or a finding.>

### Validation

- <what you actually ran or inspected, with real results — one line each, a few bullets at most>
```

Record on the **Model** line the exact reviewer-model identifier from trusted runtime metadata; write `unknown` only when the runtime exposes none. A delegated reviewer reports its own model. This line is required in both chat and any posted body; never leave the placeholder unexpanded.

Validation lists only what you genuinely did; never imply a pass you did not observe.

## Findings

Order findings most severe first. Give each the severity from the finding model, then problem, evidence, and the smallest useful fix:

```markdown
**<Blocking | Major | Minor | Nit>:** <problem>. <evidence>. <fix or precise question>.
```

Default to an inline comment anchored to the changed line; reserve the summary for a finding that does not map to one line. When there is no diff to attach to, still tag each finding with its `file:line` so it reads as inline-bound and can be posted as one without rework. If nothing is actionable, say "No actionable findings." and omit the list — an empty list is a valid result.

## Verdict maps to the GitHub state

GitHub's three review states are coarser than the severity scale, so the verdict carries the merge signal and the per-finding severity carries the rest:

- **REQUEST CHANGES** — at least one Blocking finding, or a Major that makes the PR unsafe to merge.
- **COMMENT** — non-blocking findings, unresolved uncertainty, or a self-review where approval is inappropriate. Minor and Nit are non-blocking and never drive REQUEST CHANGES on their own.
- **APPROVE** — no credible merge-blocking finding and enough evidence inspected to support approval. Self-review uses COMMENT unless policy and explicit authorization permit self-approval.

Use the most severe credible merge-relevant finding to choose the verdict. Style preference must not drive REQUEST CHANGES.
