---
name: review-pr
description: Review a GitHub pull request for actionable correctness, security, reliability, performance, test, and maintainability issues, or assess its operational and merge risk across blast radius, data, dependencies, infrastructure, and verification. Use when asked to review, approve, comment on, risk-assess, flag risky changes in, or evaluate the merge readiness of a PR. Defaults to analysis only; posts a review or risk comment only when explicitly requested.
---

# Review PR

## Outcome

Provide an evidence-backed code review or merge-risk assessment of the actual pull-request diff. Keep findings specific, calibrated, and useful to the merge decision.

This skill never edits source, branches, commits, or PR metadata.

## Choose two independent modes

### Intent

- **Review:** find actionable defects and determine a proposed review verdict. This is the default for requests to review, approve, or request changes.
- **Risk:** characterize operational and merge risk, even when no code defect is proven. Use when asked about blast radius, risk, safety, or merge readiness. Read `references/risk_assessment.md`.

When both are requested, perform both analyses but do not treat a high-risk change as defective merely because it is risky.

### Effect

- **Analyze:** return the completed assessment in chat. This is the default.
- **Post:** perform one GitHub write only when the user explicitly asks to post, submit, approve, comment, or request changes.

In Review Post mode, submit a GitHub review. In Risk Post mode, add one top-level PR comment. If both are requested, prefer one review whose summary contains the risk assessment unless the user explicitly asks for separate artifacts.

## Safety

- Read and analyze the complete relevant evidence before drafting a write.
- Never post in Analyze mode.
- Verify the repository, PR number, current head SHA, and PR state immediately before posting.
- Every defect must be traceable to the diff and relevant context.
- Only attach an inline comment to a valid changed line. Put broader findings in the summary.
- Do not approve when credible blocking defects remain.
- A missing signal is uncertainty, not evidence that a defect exists.
- If the selected GitHub path rejects a write, do not retry through another path to bypass the rejection.

## Evidence

Select an authenticated access path and resolve the target PR per `pr-conventions/references/github-mechanics.md`.

Collect:

- PR title, body, author, state, base, head, head SHA, and commit list
- complete changed-file list and patches
- relevant surrounding code and repository guidance
- tests and validation changed or referenced by the PR
- existing review conversation when it affects whether a finding is current
- CI status when the merge decision depends on it

Fetch large diffs in bounded groups. For very large PRs, prioritize security-sensitive, data, infrastructure, public-interface, and high-churn areas; disclose the sampling boundary and list areas not reviewed in depth.

## Review workflow

### 1. Understand the change

Restate the intended behavior, affected boundaries, and claims made in the PR description. Note mismatches between the stated and actual scope.

### 2. Inspect every relevant hunk

Evaluate:

- correctness, edge cases, ordering, concurrency, and state transitions
- authentication, authorization, input handling, secrets, and sensitive data
- error propagation, cleanup, recovery, and observability
- public contracts, compatibility, migrations, and rollback behavior
- performance on plausible hot paths
- tests for new behavior, failures, and regressions
- maintainability issues only when they create a concrete future failure mode

Read enough unchanged context to understand the hunk. Do not report an issue in unrelated pre-existing code unless the PR makes it reachable or materially worse.

### 3. Record findings

For each finding capture:

- exact file and valid new-file line when inline
- severity: Blocking, Major, Minor, or Nit
- concise issue statement
- concrete consequence
- smallest useful repair or question
- confidence and missing context when uncertain

Praise may appear in the summary but should not dilute actionable findings.

### 4. Determine the proposed verdict

- **REQUEST_CHANGES:** at least one credible Blocking issue, or a Major issue that makes the PR unsafe to merge.
- **COMMENT:** non-blocking feedback, unresolved uncertainty, or a self-review where approval is inappropriate.
- **APPROVE:** no credible merge-blocking issues and enough evidence was inspected to support approval.

Use the most severe credible merge-relevant finding. Style preference must not drive REQUEST_CHANGES.

### 5. Present the review

Present the review in the shape defined under **Review output** below: verdict first, a tight summary, honest validation, and findings ordered by severity. If there are no findings, say so directly.

## Review output

Use this shape for both the in-chat assessment (Analyze) and the body of a posted GitHub review (Post). Keep it tighter than a PR description: verdict first, reasoning as prose, findings that carry their own fix. Risk mode uses `references/risk_assessment.md` instead.

```markdown
## Code Review

**Verdict: <APPROVE | REQUEST CHANGES | COMMENT>**

<One tight paragraph: what was reviewed and the specific things confirmed — the reasoning behind the verdict — ending with a bottom line such as "No actionable findings." or "One blocking issue below.">

### Validation

- <what was actually run or inspected, with real results>
- Not run: <check> — <reason>
```

- Lead with the verdict; never bury it. The summary explains why you reached it, not a restatement of the diff.
- **Validation is honest and adaptive.** List only what you actually did — checks you ran with their results, or what you inspected when you could not run the code. Never imply a pass you did not observe; a test file existing is not a passing test. Omit the section only when there is genuinely nothing to report.
- Optionally close with a one-line note, such as what the new tests cover.

Findings — inline on a changed line, or in the summary when broader — are ordered by severity, most severe first, each in one tight unit:

```markdown
**<Blocking | Major | Minor | Nit>:** <the problem>. <concrete evidence — exact path, observed values, or a short repro>. <the fix, or a precise question>.
```

- A short category may follow the severity when it aids scanning: **Major (correctness):**, **Nit (naming):**.
- Give evidence proportional to the finding: a subtle bug earns a repro; a nit is one line.
- Offer the smallest useful fix or a precise question, not a vague concern.
- If nothing is actionable, write "No actionable findings." and omit the findings list.

Example — an approving summary and one blocking finding:

> ## Code Review
>
> **Verdict: APPROVE**
>
> Reviewed the shared truncation-retry helper and all eight call-site migrations. Retries stay limited to confirmed truncation, non-truncation failures keep the existing fallback with content-safe logging, and the per-site budget overrides match their workloads. No actionable findings.
>
> ### Validation
>
> - 237 targeted regression and surrounding tests passed.
> - `git diff --check` and Python compilation passed.

> **Blocking:** Do not persist an unscoped runtime into a shared `_no-session` bucket. Cowork's transient `CredentialProbe` builds `ChatSession` without `session_id` and can inherit a process-global `ANTON_SCRATCHPAD_PERSIST_SESSION=true` from an earlier chat, so a later probe reusing the pad name reloads those values — and cowork-server#250 never sweeps this bucket. Disable persistence when `session_id` is absent, or give each probe a unique scoped ID and clean it afterward.

## Posting

### Review Post

Before the single submission:

1. refresh the PR head and diff
2. verify each inline position belongs to the current diff
3. ensure the summary and verdict still match the evidence
4. submit one review with `APPROVE`, `REQUEST_CHANGES`, or `COMMENT`
5. fetch the live review and verify it appears

If an inline position is invalid, correct it only when the intended changed line is unambiguous; otherwise move the finding to the review body.

For a self-authored PR, use COMMENT unless repository policy permits self-approval and the user explicitly requests it.

### Risk Post

Refresh the PR, verify the assessment still matches its head, add one top-level comment using the risk template, and fetch the live conversation to verify it.

For a merged or closed PR, analyze when useful but post only when the user explicitly requests a retrospective comment.

## Final report

Include:

- PR number and URL
- Review verdict, overall risk, or both
- most important finding or risk driver
- number of inline comments by severity, when applicable
- whether anything was posted and verified
- any evidence limitations that materially affect confidence

## Common traps

- Do not invent findings to justify a review.
- Do not equate file count with risk without considering dependency reach.
- Do not average away a credible critical risk.
- Do not call missing tests a defect without explaining the unverified behavior.
- Do not post a review based on a stale head SHA.
- Do not move a comment to an unrelated diff line merely to satisfy GitHub.
