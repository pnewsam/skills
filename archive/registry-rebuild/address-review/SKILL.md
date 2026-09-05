---
name: address-review
description: "Triage inbound reviewer comments on a GitHub PR, decide per comment whether to fix now, reply, defer to a follow-up, or fold into another in-flight PR, then implement accepted changes, reply to threads, and resolve the addressed ones. Use when a human review left comments and the ask is to address, reply to, resolve, or decide dismiss-vs-follow-up on them. Reads and drafts by default; committing, pushing, replying, and resolving threads are separate explicitly authorized steps. Pushing may dismiss an existing approval, so it always asks first."
---

# Address Review Comments

## Overview

Handle the receiving side of code review: a reviewer left comments and you need to resolve them without churn. This is distinct from `review-pr` (you writing an outbound review) and `ship-pr` (your own review→fix loop). The recurring constraint here is that **pushing new commits can dismiss an existing approval** — so changes are batched and the push is always confirmed, and non-urgent items may be deferred rather than forced into an approved PR.

Apply the shared kernels: `pr-conventions/references/github-mechanics.md` for access, PR resolution, and write-once-then-verify; `writing-conventions` for reply and follow-up prose.

## Modes and stopping point

Infer the narrowest mode. Do not advance past the requested effect.

| Mode | Permitted effects | Stop after |
| --- | --- | --- |
| Triage | Fetch comments and reviews; classify and propose a disposition per thread | Triage table |
| Address | Triage plus implement accepted changes as local commits | Verified local commits |
| Respond | Address plus reply to threads and resolve the addressed ones | Verified replies/resolutions |
| Publish | Respond plus push the commits | Verified remote head |

"Help me address these comments" defaults to Triage → present dispositions and the proposed diff, then stop for confirmation. Replying, resolving threads, and pushing are each their own authorized step. Never dismiss the reviewer's *review*; "dismiss" from the user means closing out a comment thread (reply + resolve), not `gh pr review --dismiss`.

## Safety rules

- Check approval state before any push. If a review is `APPROVED` and the repo dismisses stale approvals on new commits, say so and confirm before pushing. Batch all accepted changes so approval is invalidated at most once.
- When the user says "ask before pushing, it dismisses the review," treat push as hard-gated for the whole session — implement and reply, but stop before pushing every time.
- Reply to a thread only after the corresponding change is committed (or a clear decision is made). Do not resolve a thread you have not actually addressed.
- Do not silently drop a comment. Every thread ends in one of: fixed, replied-with-rationale, deferred-to-follow-up, or folded-into-another-PR — and the user sees which.

## Workflow

### 1. Fetch reviews and threads

Resolve the PR via the kernel, then pull the review state and unresolved threads. With `gh`:

```bash
gh pr view <n> --json reviews,reviewDecision,state,headRefOid
gh api graphql -f query='
  query($owner:String!,$repo:String!,$n:Int!){
    repository(owner:$owner,name:$repo){
      pullRequest(number:$n){
        reviewThreads(first:100){ nodes{
          id isResolved isOutdated
          comments(first:20){ nodes{ id author{login} path line body } }
        }}
      }
    }
  }' -f owner=<owner> -f repo=<repo> -F n=<n>
```

### 2. Triage each thread

Classify every unresolved thread and propose a disposition:

| Class | Typical disposition |
| --- | --- |
| Must-fix (correctness, security, breakage) | Fix now |
| Nit / style | Fix now if cheap, or fold into another PR touching that file |
| Question / clarification | Reply; fix only if it reveals a real issue |
| Out-of-scope / non-urgent | Reply and file a follow-up issue |
| Already addressed / stale | Reply pointing to the commit; resolve |

Present this as a short table. For deferrable items, note whether an existing in-flight PR touches the same file (a good home for an unrelated nit). Stop here unless the mode is Address or beyond.

### 3. Implement accepted changes (Address)

Apply the smallest change that satisfies each accepted comment. Group related fixes into intentional commits referencing what they resolve. Run the repo's fast gates. Do not push yet.

### 4. Reply and resolve (Respond)

Reply on each thread with a one-line rationale in the project's voice (`writing-conventions`) — what changed and why, or why not. Then resolve the addressed threads.

```bash
# reply to a review comment
gh api repos/<owner>/<repo>/pulls/<n>/comments \
  -f body='Done in <sha> — <one line>.' -F in_reply_to=<comment_id>

# resolve the thread
gh api graphql -f query='mutation($id:ID!){
  resolveReviewThread(input:{threadId:$id}){ thread{ isResolved } }
}' -f id=<threadId>
```

For deferred items, open the follow-up (`create-issue`) and link it in the reply instead of resolving silently.

### 5. Publish (only when authorized)

Confirm the approval-dismissal implication, then push once and verify the new head SHA (kernel). Re-state the final disposition of every thread so nothing was dropped.
