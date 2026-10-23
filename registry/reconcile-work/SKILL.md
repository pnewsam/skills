---
name: reconcile-work
description: Bring an open PR back to merge-ready after something changed around it, such as review comments, a moved or conflicting base branch, failing CI, or a stale description. Use when the user says a PR got a review or comments to address, needs a rebase or has conflicts, has failing checks, or needs its description brought up to date.
---

# Reconcile work

Apply `work-conventions`. The candidate is a published PR, and something outside it changed: a reviewer commented, the base branch moved, CI failed, or the description no longer matches the code. Bring the PR back into agreement with each change and leave it merge-ready. This repeats as new events arrive. Merging is a separate `deliver-work` endpoint.

## Read what changed

Resolve the PR, head, base, review decision, CI state, and mergeability with [GitHub mechanics](../publish-pr/references/github-mechanics.md). Fetch unresolved review threads as `deliver-work` describes. Check whether sibling or stacked PRs landed. Work in the PR's head branch, reusing its worktree when one exists, and never in a checkout with unrelated changes.

## Reconcile each change

- **Review feedback:** verify each claim against the current head, not the commit the reviewer saw. Give every item a disposition as `deliver-work` defines. Fix supported in-scope defects through `execute-work`, and answer unsupported claims with evidence. Do not broaden the PR to satisfy a preference. Ask the user only when a comment needs a product decision.
- **Base moved or conflicts:** rebase with `rebase-pr`, which resolves conflicts by intent and pushes with an expected-head lease.
- **Failing CI:** reproduce the failure. Fix it when the PR caused it. Report a pre-existing or flaky failure separately, as `validate-work` distinguishes them.
- **Stale description:** run a `publish-pr` factual sync. Recapture stale screenshots with `validate-work`.

## Authorization

A request to address a review authorizes commits, one push to the PR's head branch, and a reply on each addressed thread. A requested rebase authorizes its lease-guarded push. Neither authorizes resolving threads, merging, or re-requesting review. If the user says to hold pushes, hold them for the rest of the session. Pushing can dismiss an existing approval, so batch fixes into one push.

## Verify and return

After the push, reply on each thread with its disposition and the fixing SHA. Then sync the description, because fixes often make its behavior notes, validation lines, or screenshots stale. Read back the remote head, CI state, and mergeability.

Return each item with its disposition and commit, the pushed head SHA, the checks run, whether the description changed, and any item waiting on the user. State whether the PR is merge-ready, and if not, what blocks it.
