---
name: reconcile-work
description: Carry an open PR from published to merged by reconciling it with what changes around it, such as review comments, a moved or conflicting base branch, failing CI, or a stale description, and merge it when asked. Use when the user says a PR got a review or comments to address, needs a rebase or has conflicts, has failing checks, needs its description brought up to date, or is ready to merge.
---

# Reconcile work

Apply `work-conventions`. The candidate is a published PR, and something around it changed: review comments, a moved base, failing CI, or a stale description. Bring the PR back into agreement with each change and keep it merge-ready. Merge only when asked.

Resolve the PR, head, base, review state, CI, and mergeability with [GitHub mechanics](../publish-work/references/github-mechanics.md), and fetch unresolved threads as [review threads](references/github-threads.md) describes. Work in the PR's head branch, never in a checkout with unrelated changes.

- **Review feedback:** verify each claim against the current head and give every item a disposition. Fix supported in-scope defects through `execute-work`, and answer unsupported claims with evidence. Do not broaden the PR to satisfy a preference. Ask the user only when a comment needs a product decision.
- **Base moved or conflicts:** follow [rebase](references/rebase.md).
- **Failing CI:** reproduce it, fix it when the PR caused it, and report pre-existing or flaky failures separately.
- **Stale description:** sync it through `publish-work`, and recapture stale screenshots with `validate-work`.

A request to address a review authorizes commits, one push to the PR's head branch, and a reply on each addressed thread. A requested rebase authorizes its lease-guarded push. Neither authorizes resolving threads, merging, or re-requesting review. If the user says to hold pushes, hold them for the rest of the session. Pushing can dismiss an approval, so batch fixes into one push.

After the push, reply on each thread with its disposition and the fixing SHA, sync the description, and read back the remote head, CI, and mergeability. Merge only against the verified head, as [merge](references/merge.md) describes.

Report each item's disposition and commit, the pushed head, the checks run, whether the description changed, anything waiting on the user, and whether the PR is merge-ready, merged, or blocked.
