---
name: review-pr
description: Review a GitHub pull request for actionable correctness, security, reliability, performance, test, and maintainability issues, or assess its operational and merge risk across blast radius, data, dependencies, infrastructure, and verification. Use when asked to review, approve, comment on, risk-assess, flag risky changes in, or evaluate the merge readiness of a PR. Defaults to analysis only; posts a review or risk comment only when explicitly requested.
---

# Review PR

## Outcome

Provide an evidence-backed code review or merge-risk assessment of the actual pull-request diff — and of how that diff behaves in the system it lands in. Keep findings specific, calibrated, and useful to the merge decision.

This skill never edits source, branches, commits, or PR metadata.

## Choose two independent modes

### Intent

- **Review:** find actionable defects and determine a proposed review verdict. This is the default for requests to review, approve, or request changes.
- **Risk:** characterize operational and merge risk, even when no code defect is proven. Use when asked about blast radius, risk, or safety. Read `references/risk_assessment.md`.

A merge-readiness question — "is this safe to merge?", "should we merge this?", "is this merge-ready?" — is both modes at once. It asks whether a defect is proven (Review) and what happens if the change's assumptions are wrong (Risk). Run both.

When both modes apply, perform both analyses but do not treat a high-risk change as defective merely because it is risky.

### Effect

- **Analyze:** return the completed assessment in chat. This is the default.
- **Post:** perform one GitHub write only when the user explicitly asks to post, submit, approve, comment, or request changes.

In Review Post mode, submit a GitHub review. In Risk Post mode, add one top-level PR comment. If both are requested, prefer one review whose summary contains the risk assessment unless the user explicitly asks for separate artifacts.

## Safety

- Read and analyze the complete relevant evidence before drafting a write.
- Never post in Analyze mode.
- Verify the repository, PR number, current head SHA, and PR state immediately before posting.
- Every defect must be traceable to the diff and relevant context.
- Post every finding that anchors to a changed line as an inline comment on that line — this is the default, not an option. The summary is only for findings that genuinely do not map to a single diff line (e.g. cross-cutting concerns, a stale PR description, an architectural observation). Never park a line-anchored finding in the summary because it is low severity or because inlining is more effort. Only attach an inline comment to a valid changed line.
- Do not approve when credible blocking defects remain.
- A missing signal is uncertainty, not evidence that a defect exists.
- If the selected GitHub path rejects a write, do not retry through another path to bypass the rejection.

## Evidence

Select an authenticated access path and resolve the target PR per `pr-conventions/references/github-mechanics.md`.

## Reviewer model attribution

Resolve the active reviewer model once, before drafting the review, and retain
that exact identifier for every chat or GitHub review body produced in the
turn.

1. Prefer the most specific trusted execution metadata the current harness
   provides for the active turn or agent. Discover and use any available
   read-only runtime, request, turn, run, or agent metadata capability.
2. Otherwise, use an exact model identifier explicitly supplied in trusted
   system or orchestrator context. Do not infer it from behavior, branding, a
   model catalog, or a list of models the harness could run.
3. Do not treat a configured default as proof of the active model. A run-,
   agent-, turn-, or thread-level override can supersede it.
4. Write `unknown` only after the harness offers no trustworthy exact model
   identifier. Do not use `unknown` merely because the identifier was not
   already present in the conversational context.

Keep this procedure capability-based. Do not depend on a vendor, product,
tool name, metadata key, environment variable, or config path. Read and retain
only the model identifier. Do not expose unrelated execution metadata in the
review. If a separate reviewer agent produces the substantive review, require
that agent to return its own runtime model identifier and attribute the review
to that model rather than to the coordinator.

Collect:

- PR title, body, author, state, base, head, head SHA, and commit list
- the linked ticket or issue, when the PR references one — read it for the intended behavior and acceptance criteria the diff should satisfy
- complete changed-file list and patches
- relevant surrounding code and repository guidance
- tests and validation changed or referenced by the PR
- existing review conversation when it affects whether a finding is current
- CI status when the merge decision depends on it

Fetch large diffs in bounded groups. For very large PRs, prioritize security-sensitive, data, infrastructure, public-interface, and high-churn areas; disclose the sampling boundary and list areas not reviewed in depth.

When the environment supports it, run the smallest read-only check that would confirm or refute a material candidate — a focused test, a type check, or a targeted build. Claim only what you actually ran. Do not run a broad suite to make the review look thorough, and never edit source to run one.

## Review workflow

### 1. Understand the change and why it exists

Before inspecting any hunk, establish what the change is for. Restate the intended behavior, affected boundaries, and claims made in the PR description. When the PR links a ticket or issue, read it first — including the rationale and the problem behind the work, not only its acceptance criteria — because the reason for a change can change how a hunk should be read and which risks matter. Note mismatches between the stated and actual scope, and between the linked ticket and the diff.

### 2. Inspect every relevant hunk

Evaluate:

- correctness, edge cases, ordering, concurrency, and state transitions
- authentication, authorization, input handling, secrets, and sensitive data
- error propagation, cleanup, recovery, and observability
- public contracts, compatibility, migrations, and rollback behavior
- performance on plausible hot paths
- tests for new behavior, failures, and regressions
- maintainability issues only when they create a concrete future failure mode

Read outward far enough to judge the change, not just to understand the hunk. Beyond the correctness of the changed lines, evaluate the change against the system it lands in: the callers of what changed, the invariants and assumptions it relies on but does not touch, and the states and data the diff does not show. A hunk can be internally correct and still break the system around it — that is the failure this review most often misses.

Scale this to the change's reach. A localized, low-blast-radius change — a copy string, a comment, an isolated constant — needs little beyond the hunk. A change to a shared contract, a caller-heavy function, shared state, or a migration earns a deliberate pass over what depends on it. Spend the system-level effort where the blast radius is real.

Do not report an issue in unrelated pre-existing code unless the PR makes it reachable or materially worse.

Track coverage internally across every changed file: reviewed, mechanically inspected, sampled, or not reviewed. Do not stop because a Blocking or Major finding already surfaced — continue through the planned scope and collect all credible findings. Before finalizing, reconcile the ledger against the complete changed-file list. Surface it in the output only when material areas were sampled or left unreviewed.

### 3. Record candidate findings

Capture each candidate finding with:

- exact file and valid new-file line when inline
- severity per the shared ladder in `pr-conventions/references/finding-model.md`
- concise issue statement
- concrete consequence
- smallest useful repair or question
- confidence and missing context when it is not high

These are candidates, not conclusions. Praise may appear in the summary but should not dilute actionable findings.

### 4. Verify candidate findings

Run every candidate through the verify-before-reporting discipline in `pr-conventions/references/finding-model.md`: try to disprove it, name the concrete trigger, check for an existing guard, and check whether the issue is pre-existing or intentional. Use `git blame` or history when the intent is genuinely ambiguous.

Keep only **Confirmed** candidates as defect findings. Report an **Uncertain** candidate as a precise question or an evidence limitation; it must not drive REQUEST_CHANGES on its own. Drop **Rejected** candidates. Deduplicate by root cause so one defect yields one finding.

### 5. Determine the proposed verdict

- **REQUEST_CHANGES:** at least one credible Blocking issue, or a Major issue that makes the PR unsafe to merge.
- **COMMENT:** non-blocking feedback, unresolved uncertainty, or a self-review where approval is inappropriate.
- **APPROVE:** no credible merge-blocking issues and enough evidence was inspected to support approval.

Use the most severe credible merge-relevant finding. Style preference must not drive REQUEST_CHANGES.

### 6. Present the review

Present the review in the shape defined under **Review output** below: verdict first, a tight summary, honest validation, and findings ordered by severity. If there are no findings, say so directly.

## Review output

Present the review — in chat and in a posted review body — in this shape, tighter than a PR description. Risk mode uses `references/risk_assessment.md` instead.

```markdown
## Code Review

**Verdict: <APPROVE | REQUEST CHANGES | COMMENT>**
**Model: <exact id of the model that produced this review, e.g. claude-opus-4-8; "unknown" if not reliably known>**

<Two to four sentences. Only: what you reviewed (scope), the one reason the verdict holds, and the bottom line (e.g. "No actionable findings."). Do NOT narrate or re-explain the change — the author wrote it and knows what it does — or list every path you traced; that belongs in Validation or the findings. If a reader needs the diff summarized back to them, the summary is too long.>

### Validation

- <what you actually ran or inspected, with real results — one line each, a few bullets at most>
```

Record on the **Model** line the exact identifier resolved under **Reviewer model attribution**, so a reader knows what generated the verdict. This line is required in both chat and any posted review. Never leave the placeholder unexpanded. Write `unknown` only when the runtime exposes no exact identifier. The risk template carries the same attribution in its scope footer.

Validation lists only what you genuinely did; never imply a pass you did not observe. Findings are ordered most severe first. Default to an inline comment anchored to the changed line; reserve the summary for findings that do not map to a single diff line. In Analyze mode, where there is no diff to attach to, still tag each finding with its `file:line` so it reads as an inline-bound finding and can be posted as one without rework:

```markdown
**<Blocking | Major | Minor | Nit>:** <problem>. <evidence>. <fix or precise question>.
```

Give evidence proportional to the finding and the smallest useful fix. If nothing is actionable, say "No actionable findings." and omit the list.

For a PR with a deterministic visual change, optional pixel evidence is available via the bundled dependency-free helper — capture the same screen before and after and diff the PNGs (identical exits 0, any real difference exits 1):

```bash
node scripts/shot_diff.mjs BEFORE.png AFTER.png [--tolerance 32] [--out diff.png] [--report report.json]
```

This never replaces tests or code review; it is supporting evidence for a visual finding.

### Keep sentences short

The shape above controls length; this controls density. Follow the sentence-level style in the shared `writing-conventions/references/prose.md` — one idea per sentence, active voice, plain words, no clause-chaining — and apply it to the summary and validation prose, not just findings. A finding reads better as three short sentences (problem, evidence, fix) than one long one, which the `<problem>. <evidence>. <fix>.` shape already implies.

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
- Do not report a candidate you have not tried to disprove — an unfalsified suspicion is a question at most, not a finding.
- Do not emit multiple comments for one root cause; report it once at the best causal line.
- Do not equate file count with risk without considering dependency reach.
- Do not average away a credible critical risk.
- Do not call missing tests a defect without explaining the unverified behavior.
- Do not post a review based on a stale head SHA.
- Do not write `unknown` before attempting the runtime model-attribution path.
- Do not move a comment to an unrelated diff line merely to satisfy GitHub.
- Do not clear a hunk as correct on its own terms without checking what outside the diff depends on it, whenever its reach is nontrivial.
- Do not summarize the change back to the author. The verdict, one reason, and the findings carry the review; a paragraph re-narrating what the diff does is noise.
