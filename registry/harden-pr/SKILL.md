---
name: harden-pr
description: Iteratively harden an open GitHub pull request by alternating model-diverse independent code-review passes with traceable fixes and validation until it converges or reaches a bounded stop. Use when asked to harden a PR, address review feedback and re-review it, repeat review-and-fix cycles, use a different model to review a prepared PR, or make a PR merge-ready. Modifies the local PR branch by default; commits, pushes, review replies, thread resolution, a posted hardening summary comment, posted reviews, and merges require their own explicit authorization. Use review-pr for one read-only review and update-pr for PR title or body synchronization.
---

# Harden PR

## Outcome

Produce a reviewed and validated PR candidate whose latest exact state has no credible merge-blocking findings, or stop with a precise account of what still prevents that claim.

Hardening secures the functional correctness of what the PR already does. It fixes defects in the change's declared scope; it does not add capabilities, handle cases the PR never set out to handle, reinterpret the author's intent, or broaden the diff to satisfy a reviewer's preferences. When in doubt about whether a finding lies inside the PR's intent, treat it as out of scope and surface it rather than fix it. Growing the diff is warranted only when a defect or a merge-blocking issue in the existing scope cannot otherwise be resolved.

Treat hardening as bounded convergence, not an instruction to eliminate every nit. Prefer a reviewer from a different model family than the model that produced the exact candidate. Preserve reviewer independence, user work, and a traceable relationship between each finding, fix, and verification result.

## Modes and effects

Choose the narrowest mode authorized by the request:

| Mode | Permitted effects | Completion claim |
| --- | --- | --- |
| Local | Read the live PR, edit its checked-out branch, and run validation | The local candidate is hardened and ready to publish |
| Publish | Local mode plus create ordinary commits and push the PR branch | The remote PR head is hardened; CI status is reported |
| Respond | Publish mode plus reply to or resolve verified review threads | The remote PR and explicitly selected threads are updated |

Use Local mode for “harden,” “fix the feedback,” or “review and fix” unless the user also asks to commit, push, update the PR, reply, or resolve. A request to “review” without a fix cycle belongs to `review-pr` and remains read-only.

Never post the internal review passes. Posting a review, approving, requesting changes, posting the hardening summary comment, merging, changing PR metadata, force-pushing, rebasing, or rewriting history requires separate explicit authorization and the appropriate workflow.

## Convergence contract

Default to at most three repair rounds. Permit one additional clean verification review after the last repair, for no more than four review passes unless the user sets another budget.

Call the candidate sufficiently hardened only when all of these are true:

- a fresh independent review examined the exact candidate state after the last source change and found no credible Blocking or Major issue
- every credible Minor finding and unresolved actionable human review thread is fixed, explicitly deferred with a merge-safe reason, or identified as superseded, duplicate, outdated, or not applicable
- relevant repository-required and change-targeted validation has no known failure; unavailable required evidence remains a blocker to an unconditional claim
- the candidate contains no unexplained or unrelated changes
- in Publish or Respond mode, the verified remote head SHA is the reviewed candidate and required CI is green; pending CI produces a conditional result

Nits do not prevent convergence unless repository policy makes them required. Do not create churn merely to reach zero comments. A finding that asks the PR to do more than it set out to do does not prevent convergence regardless of its stated severity; record it as deferred-out-of-scope so the author can decide whether it belongs in this PR or a follow-up.

## Phase 1: Establish the candidate

1. Select an authenticated access path and resolve the repository and open PR per `pr-conventions/references/github-mechanics.md`, then record its number, URL, base, head, remote head SHA, intent, changed files, commits, CI, and review state.
2. Read repository instructions and the complete relevant diff and context. Fetch thread-aware review data when unresolved, outdated, or resolved state matters; do not infer thread state from a flat comment list.
3. Verify that the checked-out branch is the PR head. Do not switch branches across unrelated uncommitted work or discard any existing change.
4. Inspect staged, unstaged, and untracked files. Include related edits in the candidate; leave unrelated edits untouched. Stop when the two cannot be isolated safely.
5. Define the exact candidate for review:
   - in Local mode, combine the PR base-to-HEAD diff with related staged, unstaged, and intended untracked content
   - in Publish or Respond mode, begin from the verified remote PR head and refresh it after every pushed repair
6. Start a round ledger containing the candidate fingerprint or SHA, findings, dispositions, changed files, validation, publication state, and remaining uncertainty.
7. Record the candidate-producer model when it is available from task metadata, explicit user input, or durable provenance. Do not infer model identity from code style. After a repair, treat the model that made that repair as the producer of the new candidate.

If the remote head changes outside this workflow, invalidate the current review evidence and refresh. Never overwrite or silently race another author’s update.

## Phase 2: Review, repair, and verify

Repeat within the budget.

### Review independently

Use a fresh reviewer subagent when multi-agent execution is available. Route it with this priority:

1. Honor an explicitly requested reviewer model when it is available and capable of the repository and tool work.
2. Otherwise choose an available model whose base model or family differs from the candidate-producer model. Prefer comparable review capability; do not choose a clearly unsuitable model merely to manufacture diversity.
3. If producer provenance is unknown, choose a model different from the active hardening or repair model and mark the original producer as unknown.
4. When multiple suitable alternatives exist, prefer one not used for the immediately preceding review.

Spawn the reviewer with an explicit model override and no inherited conversation history when the agent runtime supports those controls. In runtimes exposing `model` and `fork_turns`, set `model` to the selected alternative and `fork_turns` to `none`; do not use a full-history fork for an independent review. Give it only the PR intent, governing repository instructions, exact candidate diff, relevant unchanged context, and current validation evidence. Do not give it prior round conclusions, attempted fixes, or the desired verdict. Instruct it to use `review-pr` in Review Analyze mode, judge the change against its stated intent, return evidence-backed findings and a proposed verdict, and make no edits or external writes. Tell it to concentrate on functional correctness, security, and reliability within the declared scope, and to mark any finding that would add capability, handle out-of-scope cases, or reinterpret intent as out of scope rather than raise it as blocking.

If no different suitable model is available, use a context-isolated fresh reviewer on the same model. If no fresh reviewer is available, perform a new evidence pass from the current candidate. Disclose the missing cross-model or agent independence in either case; never imply that a same-model pass was model-diverse.

Model diversity supplements evidence isolation; it does not replace complete diff inspection, repository context, or validation.

Require every finding to include severity, confidence, exact location, consequence, and smallest useful repair. Reconcile the results with live human review threads only after the independent pass. Deduplicate findings without hiding repeated evidence.

### Repair credible findings

1. Classify each finding or thread as fix, clarify, defer, duplicate, outdated, superseded, or not applicable. Record a concrete reason for every non-fix.
2. Fix credible Blocking and Major findings that concern the correctness, security, or reliability of the change as scoped. Fix Minor findings when they are merge-relevant and the repair is proportionate. Do not implement subjective preferences, add capability, handle cases outside the PR's intent, refactor adjacent code, expand scope, or weaken behavior merely to satisfy a comment. A finding that can only be resolved by widening scope or reinterpreting intent is deferred with that reason, not fixed — even when the reviewer rated it Major.
3. When comments conflict, requirements are ambiguous, a fix would enlarge the PR's scope or change its intent, or a proposed fix would cause a regression or material product choice, stop that item and surface the decision instead of guessing.
4. Keep edits traceable to findings. Add or update focused regression coverage when a finding exposes behavior that should remain protected.
5. Preserve unrelated user changes and avoid adjacent cleanup.

### Validate and advance

Run the repository’s actual focused tests and checks for the repair, plus any broader required check justified by its blast radius. Do not install dependencies or invent commands. Diagnose and repair an in-scope regression before advancing; retain truthful failing or unavailable results in the ledger.

In Publish mode, after a repair batch passes its applicable checks:

1. inspect the staged patch and include only the hardening changes
2. create one ordinary commit describing the finding cluster it resolves
3. verify the remote head still equals the expected predecessor
4. push without force and verify the new remote head SHA

Then start a fresh review against the new exact candidate. A review from before the latest source change cannot satisfy the convergence gate.

Stop early and report the state when:

- the convergence contract is satisfied
- the review or repair budget is exhausted
- the same material finding survives two attempted repairs
- validation cannot pass without widening scope or making a product decision
- authentication, branch ownership, concurrent changes, or repository state prevents a safe next action

## Phase 3: Close the loop

In Respond mode, reply to or resolve only the explicitly authorized review threads whose fixes are present on the verified remote head. Reference the fix and validation succinctly. Do not resolve ambiguous, disputed, deferred, or merely outdated threads on the reviewer’s behalf.

Refresh the PR one final time. Verify the head SHA, CI, remaining unresolved actionable threads, and that every completion claim corresponds to the round ledger. Do not call a local-only candidate the hardened remote PR.

### Post the hardening summary

When the user explicitly authorizes it, post exactly one top-level PR comment recording the completed hardening as an audit trail. This write requires its own authorization; it is not implied by Local, Publish, or Respond mode. Post it only when a verified remote PR head reflects the hardening — that is, in Publish or Respond mode. Do not post a summary for a local-only candidate, because it would attest to work that is not on the remote head; present that summary in chat instead.

Derive the comment from the round ledger. Do not re-review to produce it. Keep it concise and factual, in the shape below, and follow the sentence-level style in `writing-conventions/references/prose.md`. State outcomes truthfully: never imply convergence, a passed check, or a merge-ready state the ledger does not support.

```markdown
## PR Hardening Summary

**Result: <converged | conditionally ready | budget exhausted | blocked>**

<Two to four sentences: what was hardened, the one reason the result holds, and the bottom line. Do not re-narrate the PR.>

### Rounds

- Round <n>: reviewer <model, plus whether cross-model and context isolation held> · <Blocking/Major/Minor/Nit counts> · <repairs made> · <validation result>

### Changes made

- <finding cluster → fix, traceable to the commit that resolved it>

### Validation

- <what was actually run, with real results — one line each>

### Deferred or still open

- <deferred finding with its merge-safe reason, remaining actionable thread, or pending or failing CI; omit this section when nothing remains>

_Hardening scope: <head> → <base> at <head SHA> · <date>_
```

Post it once through the selected access path, then fetch the live comment and verify it appears, per `pr-conventions/references/github-mechanics.md`.

## Final report

Return:

- PR number and URL
- mode and stopping reason: converged, conditionally ready, budget exhausted, or blocked
- reviewed local fingerprint or remote head SHA
- a compact round ledger: verdict, finding counts, repairs, validation, commit or push state
- the known candidate-producer model and reviewer model for each round, plus whether cross-model and context isolation were achieved
- remaining findings, deferred comments, failing or pending checks, and evidence limitations
- whether commits, pushes, replies, resolutions, the hardening summary comment, posted reviews, or merges did or did not occur

Never claim “clean,” “approved,” “merge-ready,” or “hardened” from an earlier candidate, a review with unresolved Blocking or Major findings, or incomplete required validation.
