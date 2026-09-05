---
name: deliver-work
description: Bring a work candidate to its requested endpoint: local commit, branch publication, PR creation or update, authorized review response, merge, or another explicit delivery action. Reuses current validation and review evidence, invokes concrete runbooks, verifies external state, and reports any unmet boundary.
---

# Deliver work

Apply `work-conventions`. Resolve the requested endpoint from the user and work record; successful implementation does not expand it. Delivery may stop at local changes, a commit, pushed branch, draft PR, reviewed remote candidate, or merge. Deployment and tracker updates require their own requested scope.

## Establish readiness

Identify the exact candidate and inspect current validation/review evidence and required repository checks. Reuse valid proof. If necessary evidence is missing or stale, continue through `validate-work` or `review-work` within the authorized task. Do not knowingly publish failures without an informed explicit override, and never bypass platform protections.

Separate unrelated work and confirm the destination, branch/base, and existing remote object. Do not prepare one giant PR from several independent work records just because they share an epic.

## Perform the requested action

- Local commit, push, or new PR: `publish-pr`.
- Existing PR title/body synchronization or polish: the metadata mode of `publish-pr`.
- Requested rebase onto the integration base: `rebase-pr`.
- One Linear issue or project: `create-issue` or `create-project`.
- Local preservation of unfinished work: `preserve-work` when that is the request.
- Posted review, feedback replies, thread resolution, or merge: `references/github-delivery.md`.

Runbooks can also be called directly; this operation is not a required wrapper. Use the concrete endpoint's smallest protocol. Do not route back from a runbook into delivery and create a cycle.

For a different external system, use its available connector or project runbook with the same target-resolution, authorization, and read-back contract. Do not invent a release or deployment procedure.

## Verify completion

Read back the actual result. Record the commit/PR/artifact identity, endpoint reached, remaining CI or review conditions, and next action. After an ambiguous write, inspect state before retrying. Pending CI supports a conditional result, not a merged or verified claim.

Record published and merged separately. Update external work records only when requested. If delivery changes the candidate, refresh affected evidence before claiming that the delivered candidate is the reviewed and validated one.
