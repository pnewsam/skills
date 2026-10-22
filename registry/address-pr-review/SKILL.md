---
name: address-pr-review
description: Address review feedback on an existing GitHub PR end to end. Fetch every unresolved thread, verify each claim against the current head, fix the supported ones, push to the PR branch, reply on each thread with its disposition, and re-sync the PR description. Use when the user says a PR got a review or comments and asks to address, fix, handle, or respond to it.
---

# Address PR review

Apply `work-conventions`. A request to address a review authorizes commits and a push to that PR's head branch, plus one reply per addressed thread. It does not authorize resolving threads, re-requesting review, merging, force-pushing, or posting a new review unless the user asks. If the user says to hold the push, stop before it every time for the rest of the session.

## Gather the feedback

Resolve the PR, its head branch, base, head SHA, and review decision with [GitHub mechanics](../publish-pr/references/github-mechanics.md). Fetch threads with GraphQL so resolution state comes back; the REST comment list does not carry it. Page past 100 threads when `hasNextPage` is true.

```bash
gh api graphql -F owner=<owner> -F repo=<repo> -F n=<n> -f query='
query($owner:String!,$repo:String!,$n:Int!){repository(owner:$owner,name:$repo){pullRequest(number:$n){
  reviewDecision headRefOid
  reviews(last:20){nodes{author{login} state body submittedAt}}
  reviewThreads(first:100){pageInfo{hasNextPage endCursor} nodes{id isResolved isOutdated path line
    comments(first:30){nodes{databaseId author{login} body}}}}}}}'
```

Work only on unresolved threads and on actionable points in review bodies. When the user links one review, scope to that review's threads. Work in the PR's head branch, reusing its existing worktree when there is one. Never work in a checkout that holds unrelated changes.

## Decide each item

Verify each claim against the current head, not the commit the reviewer saw. Give every item one disposition: fixed, rationale, deferred, duplicate, or outdated, as defined in [GitHub delivery](../deliver-work/references/github-delivery.md). Fix supported in-scope defects. Answer unsupported claims with evidence. Do not broaden the PR to satisfy a preference. Ask the user only when a comment needs a product decision, and keep working on the other items in the meantime.

## Fix, verify, push

Make the smallest fix for each item and add a test when the comment exposes a correctness gap. Run the checks that cover the touched files. Commit following `pr-conventions`. Pushing may dismiss an existing approval, so batch the fixes into one push. Verify that the remote head matches your commit.

## Reply and sync

Reply in the thread on each addressed item, after the push, so the SHA you cite exists on the remote. Write "Fixed in <short-sha>. <What changed>." or give the reason for leaving the code as it is.

```bash
gh api repos/<owner>/<repo>/pulls/<n>/comments/<databaseId>/replies -f body='Fixed in abc1234. …'
```

Answer points from a review body in a single PR comment. Then run a `publish-pr` factual sync of the description. Fixes often make its behavior notes, validation lines, or screenshots stale. Leave an accurate body alone. Do not append a changelog of review rounds. When the fix changes rendered UI, recapture its screenshots with `capture-pr-screenshots`, or flag them as stale.

## Return

Return a table of items with disposition and commit, the pushed head SHA, the checks run, and whether the description changed. List any item waiting on the user's decision.
