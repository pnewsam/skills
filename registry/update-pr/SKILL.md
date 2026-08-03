---
name: update-pr
description: "Update an existing GitHub pull request's title and body: either sync them to match the current diff (Sync) or improve their language without changing facts (Polish), always fitting the result to the project's PR standard. Use when asked to check, revise, sync, refresh, or audit PR metadata after code changes, or to polish, humanize, rewrite, edit, or clean up PR language. Defaults to a read-only preview; editing GitHub is a separate, explicitly requested step. Applies the pr-conventions kernel for the PR standard and GitHub mechanics. Use review-pr to review the code and prepare-pr to open a new PR."
---

# Update PR

## Outcome

Bring one open pull request's title and body into good shape — accurate to the branch and easy to read — without touching source, branches, or commits.

Apply the shared kernel throughout: `pr-conventions/references/github-mechanics.md` for reading and writing GitHub state, and `pr-conventions/references/pr-standard.md` for how the resulting title and body should read. Regardless of mode, the updated PR must conform to that standard, deferring to the repository's own PR template when one exists.

## Modes

Two independent axes. Choose the narrowest that satisfies the request.

**Intent** — what may change:

- **Sync:** make the body true to the current diff. Facts may change: add missing changes, correct stale claims, fix an inaccurate title. Default when asked to check, revise, sync, refresh, or audit.
- **Polish:** improve clarity, concision, and tone only. Facts are frozen. Default when asked to polish, humanize, rewrite, edit, or clean up language.

**Effect** — what is written:

- **Preview:** fetch the live PR and return the proposed title/body. Read-only. This is the default.
- **Apply:** update the PR title and body once, then verify. Use only when the user explicitly asks to apply, update, revise, or clean up the live PR.

### Mode contract (do not blur)

- **Polish makes zero factual changes.** Preserve every claim, number, link, identifier, command, result, and checkbox state exactly. If a wording change could alter scope or acceptance meaning, keep the original and flag it.
- **If a Polish request meets a materially stale, inaccurate, or empty body, stop and switch to Sync** — do not hide a factual synchronization inside prose cleanup, and do not fabricate content the diff does not support.
- Sync changes facts only where the diff supports them; it does not invent motivation, validation, risk, or impact.

## Safety

- Never modify source, branches, commits, base branch, labels, assignees, or reviewers. This skill edits only the PR title and body.
- Do not toggle checklist items based on inference; preserve their state.
- If the PR is merged or closed, stop and inform the user (see the kernel).
- Do not add a redundant confirmation when the user already explicitly requested Apply and the proposed change stays within that scope.

## Workflow

### 1. Resolve the target and read the live PR

Select one authenticated access path and resolve the target PR per `pr-conventions/references/github-mechanics.md`. Fetch its state, title, full body, URL, base, head, head SHA, commits, and changed-file summary. Read the repository's PR template when present.

Stop if the PR is merged or closed unless the user asked for a retrospective change.

### 2. Build an accurate picture

**Sync intent:** inspect the actual changes on the branch without altering local or remote-tracking refs. With a connector, list changed filenames and fetch patches in bounded groups; with `gh`:

```bash
gh pr view <number> --json files,commits
gh pr diff <number>
```

Group the changes by intent (see the kernel's pr-standard), then audit the body against the diff and the repository template:

- **Summary and motivation** — does the body describe the actual outcome, why it exists, and any linked issue without unsupported claims?
- **Change inventory** — are material API, schema, dependency, migration, configuration, documentation, and compatibility changes represented?
- **Validation evidence** — are commands and results factual and current? Never infer a test passed because a test file exists.
- **Risk and rollout** — are breaking behavior, data risk, feature flags, migrations, and rollback needs stated when relevant?
- **Visual evidence** — for user-visible UI changes, is before/after evidence present or explicitly left for the author? This skill cannot capture new screenshots, so leave a placeholder for any that are missing.
- **Diagram** — would a small Mermaid diagram convey the change's shape faster than prose (a new flow, state change, or boundary)? Add one where it clearly helps; most changes need none.

Produce a plain-English gap analysis: what is **missing from the description**, **stale or inaccurate**, **missing validation evidence**, **missing risk/rollout context**, or a **title mismatch** — or state that the description is already accurate. If nothing is wrong, say so and stop; do not edit for its own sake.

**Polish intent:** use the commit and file summary only as a factual guardrail; inspect patches only to check a claim you intend to keep. You are not auditing for completeness — you are rewriting existing, accurate content to read better.

### 3. Draft the revised title and body

**Sync:** write the full updated body from the gap analysis, keeping accurate content and changing only what the diff supports. Add a small Mermaid diagram when the audit flagged one as worthwhile, and a Screenshots placeholder when visual evidence is missing. Draft a revised title if the current one is inaccurate or vague (conventional-commit style, per the kernel).

**Polish:** rewrite for outcome-first organization, plain language, active voice, and scanability. Improve repetitive, vague, inflated, or overly formal phrasing and clarify unexplained jargon without adding a new claim. Preserve repository-template headings, required fields, and formatting. Do not add generic praise or filler; human-readable does not mean non-technical. Update the title only when its language needs improvement.

Either way, the result must conform to `pr-conventions/references/pr-standard.md`.

### 4. Present (Preview) or apply once (Apply)

Present the proposed changes using `references/update_output_templates.md`:

- current vs proposed title (omit if unchanged)
- for Sync, the gap-analysis summary
- the full proposed body

In Preview mode, stop here. In Apply mode, write the update once through the selected access path and verify the live result per the kernel's write-once-then-verify rule. With `gh`:

```bash
gh pr edit <number> --title "<revised title>" --body "<revised body>"
```

Omit `--title` if unchanged. If the write is rejected for missing authorization, do not retry through another path; report it and preserve the proposed text.

### 5. Final report

Report the PR number and URL, the intent and effect used, what changed (title and which body sections), a one-line summary of what the PR now accurately describes or reads as, and anything left for the author — e.g. screenshots or validation evidence they still need to collect.

## Handling common situations

- **Description already accurate (Sync):** state it matches the diff; make no edit.
- **New commits since the PR opened (Sync):** the most common case — treat all unmentioned changes as missing and add them.
- **Empty body:** treat as Sync and write a full description from the diff and template, even if the request said "polish."
- **Placeholder title (WIP, branch name):** flag it and propose a conventional title derived from the diff.
- **Very large diff (Sync):** summarize by component or layer; focus on user-visible and API-level impact; mention tests and config briefly.
- **Already-clear language (Polish):** re-polishing clear text should produce no edit. Preserve author voice where it is already clear and professional.
- **Update fails:** report the exact error (expired auth, wrong repo, insufficient permissions, locked PR). Do not retry destructively.
