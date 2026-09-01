---
name: ship-pr
description: "Drive one PR-sized unit of work through its whole lifecycle to a merge-ready pull request: frame the intent, plan the approach when it isn't obvious, build and verify the change, publish the PR, then run model-diverse review→revise→verify rounds until it converges or hits a bounded stop. Use to take a change or feature all the way to a merge-ready PR, to harden a PR, to run repeated review-and-fix cycles, or to make a PR merge-ready. Composes plan-feature, execute-feature, publish-pr, review-pr, and address-review and owns the loop between them. Stops before merge; commits, pushes, review replies, thread resolution, a posted summary comment, and posted reviews each require their own explicit authorization. Use ship-epic for a multi-feature epic, review-pr for one read-only review, and publish-pr to just open or update a PR."
---

# Ship PR

## Outcome

Take one PR-sized change from intent to a merge-ready pull request whose latest
exact state has no credible merge-blocking findings — or stop with a precise
account of what still prevents that claim. This is the top-level runbook for a
single PR: it drives the whole lifecycle and owns the feedback loops, delegating
each atomic step to the operation that owns it.

It never merges. Merge is a separate, explicitly authorized action.

## Use / do not use

- **Use** to drive a change or feature to a merge-ready PR, to harden an open PR,
  to run repeated review-and-fix cycles, or to make a PR merge-ready.
- **Not** for a multi-feature epic — that is `ship-epic`, which coordinates many
  features and hands off a prepared PR (they are siblings at different grains;
  neither merges). Not for a single read-only review — that is `review-pr`. Not
  for merely opening or syncing a PR without the review loop — that is
  `publish-pr`. Not to merge.

## The lifecycle it drives

Each phase delegates to the operation that owns it; `ship-pr` owns the ordering,
the gates, and the back-edges. Skip a phase whose step is obvious (a clear
one-line fix needs no Plan).

| Phase | Delegate | Gate to leave |
| --- | --- | --- |
| Frame | base-model inline | intent and done-condition are stated (for a bug, a reproduction) |
| Plan | `plan-feature` (only if approach unclear) | an approach is chosen and, if needed, approved |
| Build | `execute-feature` | the scoped change plus tests exist as local commits |
| Verify | `verify` (base-model inline) | behavior confirmed end-to-end |
| Publish | `publish-pr` | the PR is open and its head is the reviewed candidate |
| Review → Revise → Verify | `review-pr` + `address-review`, looped | the convergence contract holds |

Back-edges `ship-pr` owns: Verify → Build (fails/regressions), Verify → Frame
(scope was wrong), Review → Plan (rethink approach), and the Review → Revise →
Verify convergence loop below.

## Scope discipline

Ship what the change set out to do. Fix defects in its declared scope; do not add
capability, handle cases it never set out to handle, reinterpret intent, or
broaden the diff to satisfy a reviewer's preference. A finding that can only be
resolved by widening scope or reinterpreting intent is deferred with that reason
— even when rated Major — not fixed. Grow the diff only when a merge-blocking
issue in the existing scope cannot otherwise be resolved.

## Effects and authorization

Choose the narrowest mode the request authorizes; completing one stage never
authorizes the next.

| Mode | Adds | Completion claim |
| --- | --- | --- |
| Local | read the PR, edit the checked-out branch, run validation | the local candidate is merge-ready |
| Publish | + ordinary commits and push | the remote head is hardened; CI reported |
| Respond | + reply to / resolve verified review threads | remote PR + selected threads updated |

Never post the internal review passes. Posting a review, approving or requesting
changes, posting the summary comment, changing PR metadata, force-push, rebase,
history rewrite, and **merge** each require their own explicit authorization.

## Front half: frame → build → publish

1. **Frame.** Read the intent — the issue, ticket, or request; for a bug,
   reproduce the failure first. State the done-condition. When a linked ticket
   exists, treat its acceptance criteria as the intended behavior.
2. **Plan.** If the approach is not obvious, run `plan-feature`; when the UI look
   is open, that includes its divergent design mode. Skip for an obvious change.
   Approval is a gate here, not a phase.
3. **Build.** Run `execute-feature` for the scoped change plus regression
   coverage. Keep unrelated edits out of the candidate.
4. **Verify.** Run the repository's real checks for the change. On failure, take
   the Verify → Build edge and repair before advancing; if the failure shows the
   framing was wrong, take Verify → Frame.
5. **Publish.** Run `publish-pr` to open the PR (it detects whether one already
   exists and forks accordingly). Stop here if the request authorized only
   preparation.

## Back half: the convergence loop (Review → Revise → Verify)

This is the convergence engine — model-diverse review, traceable repair, and
re-verification, repeated within the budget.

### Establish the candidate

Resolve the PR per `pr-conventions/references/github-mechanics.md` and record its
number, URL, base, head, remote head SHA, intent, changed files, commits, CI, and
review state. Verify the checked-out branch is the PR head. Define the exact
candidate (base-to-HEAD diff plus related local content in Local mode; the
verified remote head in Publish/Respond, refreshed after every push). Start a
**round ledger**: candidate fingerprint/SHA, findings and dispositions, changed
files, validation, publication state, remaining uncertainty. Record the
candidate-producer model when known.

### Review independently

Run each review pass through `review-pr` in its analyze mode, in a fresh
context-isolated reviewer from a **different model family** than the candidate
producer. Give it only the intent, linked ticket, repository instructions, exact
diff, relevant unchanged context, and current validation — never prior-round
conclusions or the desired verdict. See
`references/reviewer-independence.md` for the reviewer-routing priority, the
model-override/no-history mechanics, the fallbacks, and the required disclosure
when cross-model or agent independence could not be achieved. Findings carry
severity, confidence, location, consequence, and smallest repair per
`pr-conventions/references/finding-model.md`; reconcile with live human threads
only after the independent pass.

### Revise

Delegate inbound human review threads to `address-review` (fix / reply / defer /
fold, and the push-dismisses-approval gate it owns). For findings from the
independent pass, classify each as fix / clarify / defer / duplicate / outdated /
superseded / not-applicable with a concrete reason for every non-fix. Fix
credible Blocking and Major findings in scope; fix Minor when merge-relevant and
proportionate. Keep every edit traceable to a finding and add regression coverage
where a finding exposes behavior that should stay protected. When comments
conflict, a fix would enlarge scope or change intent, or a fix risks a regression
or a product decision, stop that item and surface it.

### Validate and advance

Re-run the repository's focused checks for the repair plus any broader required
check its blast radius warrants. Repair an in-scope regression before advancing;
keep truthful failing or unavailable results in the ledger. In Publish mode,
commit only the hardening changes as one ordinary commit describing the finding
cluster, verify the remote head is the expected predecessor, push without force,
and verify the new SHA. Then start a **fresh** review against the new exact
candidate — a review from before the latest source change cannot satisfy the gate.

### Convergence contract

Default budget: at most three repair rounds plus one clean verification review
(≤4 review passes) unless the user sets another. Call the PR merge-ready only when
all hold:

- a fresh independent review of the exact latest candidate found no credible
  Blocking or Major issue;
- every credible Minor and unresolved actionable human thread is fixed or
  deferred with a merge-safe reason (or superseded/duplicate/outdated/NA);
- required and change-targeted validation has no known failure (unavailable
  required evidence stays a blocker to an unconditional claim);
- the candidate contains no unexplained or unrelated changes;
- in Publish/Respond mode, the verified remote head SHA is the reviewed candidate
  and required CI is green (pending CI → a conditional result).

Nits do not block convergence unless repository policy requires them; do not
churn to reach zero comments. Stop early and report when: the contract holds; the
budget is exhausted; the same material finding survives two repairs; validation
cannot pass without widening scope or a product decision; or auth, branch
ownership, concurrent changes, or repository state blocks a safe next action.

## Close the loop

In Respond mode, reply to or resolve only the explicitly authorized threads whose
fixes are on the verified remote head; do not resolve ambiguous, disputed,
deferred, or merely outdated threads. Refresh the PR once more and verify the head
SHA, CI, remaining actionable threads, and that every completion claim traces to
the ledger.

When the user explicitly authorizes it and a verified remote head reflects the
work, post exactly one top-level summary comment as an audit trail, per
`references/hardening-summary.md`. This write needs its own authorization and is
never posted for a local-only candidate.

## Final report

Return: the PR number and URL; the mode and stopping reason (converged,
conditionally ready, budget exhausted, or blocked); the reviewed fingerprint or
remote head SHA; a compact round ledger (verdict, finding counts, repairs,
validation, commit/push state); the candidate-producer and reviewer model per
round with whether cross-model and context isolation held; remaining findings,
deferred threads, failing or pending checks, and evidence limits; and whether
commits, pushes, replies, resolutions, the summary comment, posted reviews, or
merges did or did not occur. Never claim clean, approved, merge-ready, or shipped
from an earlier candidate, a review with unresolved Blocking/Major findings, or
incomplete required validation.
