---
name: rebase-pr
description: Rebase a PR branch onto its verified integration base, resolve conflicts by intent, and reconcile work already present upstream. Preserve recovery history, validate the resulting candidate, and publish with an explicit expected-head lease only when the requested endpoint includes updating the PR.
---

# Rebase PR

Apply `work-conventions` and `publish-pr/references/github-mechanics.md`. The result is a reconciled candidate, not merely a conflict-free Git operation.

## Resolve and preserve

Read the requested branch/PR, actual base, current local and remote head, approvals, repository instructions, and dirty/index state. Fetch the base; never assume staging or main. Preserve unrelated work through isolation or an agreed preservation method. Do not implicitly stash, reset, clean, or overwrite it.

Preview inspects and proposes without rewriting. A rebase request authorizes the local rewrite and conflict resolution. Publication follows the requested endpoint and established authorization: updating an existing PR may include the lease-protected push; a local-only request stops locally. Honor explicit ask-before-push constraints. Explain approval invalidation when it is material and not already accepted. Do not post reviews or merge automatically.

Record the pre-rebase head and observed remote head. Create a recovery ref before rewriting. Compare both histories and overlapping changes, including commits whose effects are already upstream. Check for ongoing Git operations and resolve them before starting another.

## Reconcile by intent

Rebase onto the verified base. Resolve each conflict from the work's intent, current upstream behavior, and relevant history. Do not choose one side wholesale, skip a conflicted commit to make progress, or resurrect an upstream deletion without explaining the new need.

Preserve upstream fixes, tests, conventions, and evidence. For overlapping implementations, keep one owner and migrate callers and resources. Record material retained, superseded, or retired behavior and its destination. Seek a user decision only where the intended outcome cannot be resolved from existing context.

Inspect the complete net diff against the new base after conflict resolution. Check duplication and semantic conflicts even in files Git merged cleanly. Confirm every intended commit remains represented or is explicitly accounted for as already upstream or intentionally superseded.

## Verify and publish

Run the established checks affected by the new base, resolutions, or assumptions. Earlier candidate evidence is not evidence for the rebased integration. Verify a clean tree, the intended base ancestry, the resulting commit range, and current PR state.

When publication is authorized, push using an explicit lease tied to the remote head observed before rewriting: `--force-with-lease=refs/heads/BRANCH:EXPECTED_SHA`. Never use bare force. If the remote moved, stop publication and reconcile that work; do not simply refresh the lease and overwrite it. Read back the remote SHA, PR base/head, and mergeability after pushing. Report actual checks and remaining conditions; update stale PR metadata when within the requested PR update.
