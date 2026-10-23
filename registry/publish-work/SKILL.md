---
name: publish-work
description: "Publish finished work for others to see and respond to, as a local commit, a pushed branch, a new or updated PR, or a posted review. Use when asked to commit, push, open a draft PR, update a PR's title or description, or post a review. Reuses current validation and review evidence, verifies the published state, and reports any unmet boundary. Published is not settled; reconcile-work carries an open PR to merge."
---

# Publish work

Apply `work-conventions`. Publishing puts work where others can see and respond to it. It does not settle the work: an open PR stays with `reconcile-work` until it merges. Resolve the requested endpoint from the user and work record; successful implementation does not expand it. The endpoint may be a local commit, a pushed branch, a new or updated PR (draft by default), a title or body update, or a posted review. Merging, deployment, and tracker updates are not publication.

## Establish readiness

Identify the exact candidate and inspect current validation and review evidence and required repository checks. Reuse valid proof. If necessary evidence is missing or stale, continue through `validate-work` or `review-work` within the authorized task. Do not knowingly publish failures without an informed explicit override, and never bypass platform protections. A PR for a user-visible UI change needs before/after evidence from `validate-work`, or a stated reason it has none.

Separate unrelated work. Do not prepare one giant PR from several independent work records just because they share an epic.

## Prepare the candidate

Read repository instructions, branch, status, the committed diff against the verified base, staged and unstaged changes, and intended untracked files. Fetch the current base and compare divergence before claiming integration readiness. A feature-branch upstream is not the PR base.

Do not commit on a protected base branch; follow the user's or repository's branch convention. Stage explicit related paths or hunks and inspect the staged diff. Exclude credentials, dependency directories, and incidental build artifacts. Do not rewrite history or broadly clean the checkout for convenience. Skip duplicate commits.

Before drafting any commit message, PR title, PR body, or posted finding, read [PR conventions](../pr-conventions/SKILL.md) and every reference it requires. Do not draft from memory of what a PR body usually looks like.

## Publish on the platform

Platform mechanics live in references:

- GitHub access, target resolution, and verified writes: [GitHub mechanics](references/github-mechanics.md).
- Opening, reusing, or updating a PR, its screenshots, and posting a review: [pull requests](references/pull-request.md). Output shapes: [PR templates](references/pr_output_templates.md) and [update templates](references/update_output_templates.md).

For another system, use its available connector with the same target-resolution, authorization, and read-back contract. Do not invent a release or deployment procedure.

## Verify and continue

Record the commit, PR, or review identity, the endpoint reached, and remaining CI or review conditions. Pending CI supports a conditional result, not a verified claim.

If publishing changed the candidate, refresh affected evidence before claiming the published candidate is the reviewed and validated one. Continue to `reconcile-work` when the user asked to carry an open PR further.
