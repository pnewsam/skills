---
name: review-work
description: Critically assess local changes, an artifact, or an existing PR for supported defects, scope gaps, and delivery risk. Includes review feedback triage and independent re-review when requested. Read-only by default; repairs go through execute-work and external reviews or replies through authorized delivery.
---

# Review work

Apply `work-conventions` and the finding standard in `pr-conventions/references/finding-model.md`. Review the actual candidate against its intended outcome; a PR is optional input, not a prerequisite.

Read the work record, the linked ticket and its rationale, the diff, and the acceptance evidence. Identify the base, head, and any unlanded base or sibling PRs. For a live PR, resolve the target and head with `publish-pr/references/github-mechanics.md` and read existing feedback. Stay read-only except for necessary checks; "review and fix" authorizes only related implementation, and commits, posted reviews, resolution, and merge each need their own authorization.

The defects that matter usually sit outside the changed lines. Read the diff for local correctness, then read outward until you can answer, with evidence: does every real consumer of a changed contract — including in other repositories — still work? Does the change actually meet each of the ticket's acceptance criteria, or does it silently miss one? Does it contradict a stated invariant in the docs, comments, or a locked decision? Is each behavior the change relies on pinned by a test that fails when it regresses, on the same engine production runs — and where it is not, is that missing pin recorded as a finding rather than waved off by proving the code correct today? And once any unlanded stack lands, does the merged result still hold? Scale the pass to dependency reach; a locally correct hunk can still break the system.

Give data honesty its own pass, not a glance. For anything that counts, aggregates, buckets time, or filters, ask whether the output is still true at the edges — empty, NULL, capped, future-dated, or mixed-semantics rows. Correct code can still report a dishonest number, and that number is the defect.

One pass both under-finds and over-holds; a first read rationalizes away real defects and clings to false ones a fresh look would drop. For a consequential change, take a second context-isolated pass before calling the review done, tasked with refuting the standing findings as much as extending them — an independent reviewer on a different model family when one is available and authorized (`references/review-protocol.md`).

Report a finding only when its support survives the finding model, ordered by severity; an empty list is a valid result, and optional improvements do not block. For existing feedback, mark each item supported, fixed, duplicate, outdated, unsubstantiated, or deferred, verifying "fixed" against the current candidate. For merge-readiness, assess operational risk with `references/risk.md`; high risk is not itself a defect.

Return supported findings and a readiness assessment tied to the candidate, in the output shape defined in `references/review-output.md`; self-review uses COMMENT unless policy and explicit authorization permit otherwise. If repairs were requested, continue through `execute-work` and `validate-work`, then reassess; `references/review-protocol.md` bounds the fix loop and independent re-review. A changed remote head invalidates affected evidence. Use `deliver-work` for any posting, reply, resolution, or merge; a review-only request ends with the assessment.

## Before the review is done

Evidence before assertion. A claim in the description, a comment, or a test name is not proof. Name what actually ran against this candidate, and when nothing did, that gap is the finding — do not close it by reading the code and declaring it correct.

Run these five checks before calling the review done. Each one has cost a real defect that a careful read of the diff did not catch.

- **Degenerate inputs.** For every parameter the change adds or touches, ask what an empty value does, an absent one, a duplicate, and an extreme but valid one. An empty repeatable value arrives as a one-element list, is truthy, and compiles to a filter that matches nothing while returning success. An extreme but legal bound can underflow arithmetic into a 500.
- **Empty denominators.** A rate, average, or percentile over an empty or unclassified population must say so rather than return zero. A zero error rate with nothing in the denominator reads as healthy and is the defect.
- **The access path.** Does an index actually serve each new filter, sort, or count? A row limit bounds rows returned, not rows examined, so a selective-looking predicate on an unindexed column can still scan the whole range.
- **Execution, not intention.** Does a check that actually runs execute this code, on the engine production uses? Name the job. Code reached only by a job gated on a label this change does not carry, or covered only on a different engine than production, is unverified — report that, rather than proving it correct by inspection.
- **Tests that would fail.** For each test the change adds, ask whether it would fail if the defect it targets were present. A constant patched below the fixture size, a fixture too small to reach the bound it claims to exercise, an assertion true either way — each passes with the defect intact and pins nothing.

When you find yourself concluding one of these is fine, check which move you are making:

| Thought | What it usually means |
| --- | --- |
| "The code is plainly correct here" | You proved the code, not the test. The missing pin is still a finding. |
| "The description says this was validated" | Nothing ran until you can name the job that ran it. |
| "That input cannot reach this path" | Name the validator that rejects it. If none does, it can. |
