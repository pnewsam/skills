---
name: polish-pr
description: Improve the title and body of an existing GitHub pull request for clarity, concision, natural tone, and reviewer readability without changing its facts, scope, validation claims, links, template fields, or checklist state. Use when asked to polish, humanize, rewrite, edit, or clean up PR language. Supports read-only preview and explicitly requested apply modes. Use revise-pr instead when metadata must be synchronized with the actual diff.
---

# Polish PR

## Outcome

Make one pull request easier for a human reviewer to understand while preserving
its exact substantive meaning.

## Modes and effects

- **Preview:** Fetch the live PR and return the proposed title and body without
  editing GitHub. Use for requests to suggest, draft, or show a rewrite.
- **Apply:** Update only the PR title and body, then verify the live result. Use
  when the user explicitly asks to polish, clean up, rewrite, edit, or apply the
  language change.

Never modify source, branches, commits, base branch, labels, assignees,
reviewers, or checklist state.

This skill is editorial. If the title or body is materially stale, inaccurate,
missing substantive sections, or inconsistent with the branch, stop and use
`revise-pr`. Do not hide a factual synchronization task inside prose cleanup.

## Workflow

### 1. Read the live PR

Prefer an authenticated GitHub connector; otherwise use authenticated `gh`.
Resolve the repository and target PR, then fetch its state, title, complete
body, URL, base, head, commits, and changed-file summary. Read the repository's
PR template when present.

Use the commit and file summary only as a factual guardrail. Inspect patches
when a claim cannot otherwise be checked. If the PR is closed or merged, do not
edit it unless the user explicitly asks for a retrospective metadata change.

If the PR body is empty or cannot support an accurate rewrite, stop and
recommend `revise-pr`, which can reconstruct it from the diff.

### 2. Rewrite without changing substance

Preserve:

- factual claims, scope, issue references, links, code, commands, identifiers,
  screenshots, and validation results
- repository-template headings, required fields, comments, and formatting
- every checkbox and its current state
- explicit uncertainty, limitations, risks, rollout notes, and work not run

Improve:

- outcome-first organization and reviewer scanability
- plain language, active voice, sentence length, and paragraph flow
- repetitive, vague, inflated, mechanical, or overly formal phrasing
- unexplained jargon when it can be clarified without adding a new claim

Do not invent motivation, validation, risk, user impact, or implementation
details. Do not add generic praise, promotional language, or filler. Keep useful
technical precision; human-readable does not mean non-technical.

If a wording change could alter scope or acceptance meaning, preserve the
original and flag it instead.

### 3. Preview or apply once

Present the proposed complete title and body and summarize the editorial
changes. In Preview mode, stop.

In Apply mode, update the title only when its language needs improvement and
update the body once through the selected GitHub path. Fetch the live PR again
and verify the exact title and body. If the write fails, preserve the proposed
text and report the error; do not retry through another integration.

Report the PR URL, whether the title or body changed, the main readability
improvements, and anything preserved because changing it risked altering
meaning.

## Safety and idempotency

- Re-polishing already clear language should produce no edit.
- Make no factual or structural correction that requires interpreting the diff;
  route that work to `revise-pr`.
- Preserve author voice where it is already clear and professional.
- Never toggle checkboxes or imply verification that is not already recorded.
