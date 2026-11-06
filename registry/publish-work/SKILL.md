---
name: publish-work
description: "Publish finished work for others to see and respond to, as a local commit, a pushed branch, a new or updated PR, or a posted review. Use when asked to commit, push, open a draft PR, update a PR's title or description, or post a review. Reuses current validation and review evidence, verifies the published state, and reports any unmet boundary. Published is not settled; reconcile-work carries an open PR to merge."
---

# Publish work

Apply `work-conventions`. Publishing puts work where others can see and respond to it. It does not settle the work: an open PR stays with `reconcile-work` until it merges. Reach only the endpoint the user asked for: a local commit, a pushed branch, a new or updated PR (draft by default), a title or body update, or a posted review. Merging, deployment, and tracker updates are not publication.

Reuse current validation and review evidence. When it is missing or stale, continue through `validate-work` or `review-work`. Do not knowingly publish failures without an explicit override, and never bypass platform protections. A PR for a user-visible UI change needs before/after evidence from `validate-work`, or a stated reason it has none. Keep independent work records in separate PRs.

Do not commit on a protected base branch. Stage explicit related paths, and exclude credentials, dependency directories, and build artifacts. Do not rewrite history or broadly clean the checkout. Compare against the fetched base, not the feature branch's upstream.

Before drafting any commit message, PR title, PR body, or posted finding, read [PR conventions](../pr-conventions/SKILL.md) and every reference it requires.

Platform mechanics live in references. [GitHub mechanics](references/github-mechanics.md) covers access, target resolution, and verified writes. [Pull requests](references/pull-request.md) covers opening, reusing, or updating a PR, its screenshots, and posting a review, with output shapes in [PR templates](references/pr_output_templates.md) and [update templates](references/update_output_templates.md). For another system, use its connector with the same contract, and do not invent a release or deployment procedure.

Read back what was published. Report the commit, PR, or review identity and any pending CI or review conditions; pending CI supports only a conditional result. If publishing changed the candidate, refresh affected evidence before calling it reviewed or validated.
