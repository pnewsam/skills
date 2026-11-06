---
name: review-work
description: Critically assess local changes, an artifact, or an existing PR for supported defects, scope gaps, and delivery risk. Includes independent re-review, and triage of review feedback when only an assessment is wanted; reconcile-work addresses it. Read-only by default; repairs go through execute-work and posted reviews through publish-work.
effort: high
---

# Review work

Read-only by default. "Review and fix" authorizes only related implementation, through `execute-work` and `validate-work`. Commits, posted reviews, resolutions, and merge each need their own authorization (`publish-work`, `reconcile-work`).

Report only findings that survive `pr-conventions/references/finding-model.md`, in the shape in `references/review-output.md`. An empty list is a valid result.

The defects that matter usually sit outside the changed lines. Check each:

- Every real consumer of a changed contract, including in other repositories, and the merged result once any unlanded base or sibling PR lands.
- Each acceptance criterion of the linked ticket, and any stated invariant in docs, comments, or a locked decision.
- Whether a test pins each behavior the change relies on, on the engine production runs. A missing pin is a finding even when the code is correct today.
- Data honesty, for anything that counts, aggregates, buckets time, or filters: is the output still true for empty, NULL, capped, future-dated, or mixed-semantics rows? A dishonest number is a defect.

For existing feedback, mark each item supported, fixed (verified against the current candidate), duplicate, outdated, unsubstantiated, or deferred. Use `references/risk.md` for merge-readiness and `references/review-protocol.md` for a second pass or a fix loop.
