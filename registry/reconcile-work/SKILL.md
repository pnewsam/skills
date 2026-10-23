---
name: reconcile-work
description: Carry an open PR from published to merged by reconciling it with what changes around it, such as review comments, a moved or conflicting base branch, failing CI, or a stale description, and merge it when asked. Use when the user says a PR got a review or comments to address, needs a rebase or has conflicts, has failing checks, needs its description brought up to date, or is ready to merge.
---

# Reconcile work

Apply `work-conventions`. The candidate is a published PR, and something outside it changed: a reviewer commented, the base branch moved, CI failed, or the description no longer matches the code. Bring the PR back into agreement with each change and keep it merge-ready. This repeats as new events arrive, and ends with a merge when the user asks for one.

## Read what changed

Resolve the PR, head, base, review decision, CI state, and mergeability with [GitHub mechanics](../publish-work/references/github-mechanics.md). Fetch unresolved review threads as [review threads](references/github-threads.md) describes. Check whether sibling or stacked PRs landed. Work in the PR's head branch, reusing its worktree when one exists, and never in a checkout with unrelated changes.

## Reconcile each change

- **Review feedback:** verify each claim against the current head, not the commit the reviewer saw. Give every item a disposition. Fix supported in-scope defects through `execute-work`, and answer unsupported claims with evidence. Do not broaden the PR to satisfy a preference. Ask the user only when a comment needs a product decision.
- **Base moved or conflicts:** rebase as [rebase](references/rebase.md) describes: resolve conflicts by intent, keep a recovery ref, and push with an expected-head lease.
- **Failing CI:** reproduce the failure. Fix it when the PR caused it. Report a pre-existing or flaky failure separately, as `validate-work` distinguishes them.
- **Stale description:** run a factual sync through `publish-work`. Recapture stale screenshots with `validate-work`.

## Authorization

A request to address a review authorizes commits, one push to the PR's head branch, and a reply on each addressed thread. A requested rebase authorizes its lease-guarded push. Neither authorizes resolving threads, merging, or re-requesting review. If the user says to hold pushes, hold them for the rest of the session. Pushing can dismiss an existing approval, so batch fixes into one push.

## Verify and settle

After the push, reply on each thread with its disposition and the fixing SHA. Then sync the description, because fixes often make its behavior notes, validation lines, or screenshots stale. Read back the remote head, CI state, and mergeability.

Merge only when asked, and only against the verified head, as [merge](references/merge.md) describes. Merged is the settled state; record it separately from published.

Return each item with its disposition and commit, the pushed head SHA, the checks run, and whether the description changed. List any item waiting on the user. State whether the PR is merge-ready or merged, and if neither, what blocks it.
