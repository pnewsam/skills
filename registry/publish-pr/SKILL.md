---
name: publish-pr
description: "Take a change from a local branch to a shared pull request, and keep that PR's title and body accurate over its life. Detects whether a PR already exists for the branch and forks accordingly: with no PR, prepare and open one (branch, commit, push, create); with a PR, update its title and body — sync to the current diff or polish the language. Use when asked to prepare, publish, or open a PR, or to check, sync, refresh, polish, humanize, or clean up an existing PR. Read-only by default; commit, push, PR creation, and PR edits are each a separately authorized effect. Applies the pr-conventions kernel. Use review-pr to review the code."
---

# Publish PR

## Outcome

Move one unit of work onto GitHub as a pull request and keep that PR's title and
body true to the branch. One skill spans the PR's whole surface: opening it when
it does not exist yet, and updating its description afterward. It never reviews
code for defects (`review-pr`) and never modifies source when only the
description needs work.

Apply the shared kernel throughout: `pr-conventions/references/pr-standard.md`
for how the title, body, and commits should read, and
`pr-conventions/references/github-mechanics.md` for authenticated access, target
resolution, merged/closed handling, and the write-once-then-verify discipline.
`pr-conventions/references/visual-evidence.md` covers UI screenshots. Whatever
mode runs, the result must conform to the standard, deferring to the repository's
own PR template when one exists.

## Step 0 — Detect PR state, then fork

Before anything else, determine whether an open PR already exists for the current
branch, using one authenticated access path per the kernel (`gh pr view --json
number,state,url,title` on the current head, or the connector equivalent).

- **No open PR for this branch → Prepare track.** Go to "Prepare a new PR."
- **An open PR exists → Update track.** Go to "Update an existing PR." Never open
  a second PR for a branch that already has one; a request to "get this ready"
  when a PR exists means update it, not duplicate it.
- **PR is merged or closed:** stop and report per the kernel unless the user
  explicitly asked for a retrospective change.

State the detected state in your first response so the chosen track is visible.

## Effects and stopping points

Choose the narrowest effect that satisfies the request; never treat completing
one stage as authorization for the next.

| Track | Effect | Permitted | Stop after |
| --- | --- | --- | --- |
| Prepare | Preview | Read repo + GitHub state | Summary, proposed commit and PR draft |
| Prepare | Commit | + branch create, stage, local commit | Verified local commit |
| Prepare | Publish | + ordinary push | Verified remote branch |
| Prepare | Open PR | + create the GitHub PR | Verified PR URL |
| Update | Preview | Read the live PR + diff | Proposed title/body (default) |
| Update | Apply | + edit the PR title/body once | Verified live edit |

"Review the branch" = Preview. "Commit" does not authorize push. "Push" does not
authorize opening a PR. Only an explicit "open"/"create" authorizes the full Open
PR sequence. "Prepare this for a PR" with no explicit effect is ambiguous:
complete Preview and propose the next action. On the Update track, Preview is the
default; Apply requires an explicit ask to update/apply the live PR.

## Safety

- Never run destructive Git commands (`reset --hard`, `clean`, `checkout -- .`,
  `restore`, force-push, rebase, amend) unless the user asks for that exact
  operation.
- Never commit secrets, credentials, build artifacts, dependency folders, or
  local env files. Flag suspicious files before staging; avoid blind `git add .`.
- On the Update track, edit only the PR title and body — never source, branches,
  commits, base, labels, assignees, reviewers, or checklist state.
- If unrelated changes are mixed into the working tree, call them out and ask
  which to include rather than guessing.
- Do not add a redundant confirmation when the user already explicitly requested
  the in-scope effect and the scope is unambiguous.

## Prepare a new PR

### 1. Ensure the work is on a feature branch

`git branch --show-current`. If on a protected base (`main`, `master`,
`develop`, or a stated trunk), do not commit or push there. Inspect changes
(`git status --short`, `git diff --stat`, `git diff --cached --stat`), propose a
kebab-case branch (`feat/…`, `fix/…`, `hotfix/…`, `chore/…`, `docs/…`,
`refactor/…`, 2–5 words), and, when the effect authorizes it, `git switch -c
<branch>` (uncommitted work travels with the switch). Confirm with `git branch
--show-current`. If already on a feature branch, skip to step 2.

### 2. Inspect branch and repository state

Read-only first: `git status --short --branch`, `git remote -v`, `git log
--oneline --decorate -n 10`. With an upstream, find the merge base and changed
files (`git diff --name-status @{u}...HEAD`); without one, resolve the remote
default (`git symbolic-ref --short refs/remotes/origin/HEAD`) instead of assuming
`main`. Also inspect uncommitted and staged changes.

### 3. Understand the changes

Use targeted diffs (`git diff -- <path>`), not one dump. Group changes by intent
(see the kernel's pr-standard). Keep committed and about-to-be-committed changes
distinct when summarizing.

### 4. Validate the candidate change

In Preview, inspect existing evidence but do not create caches/reports. In
Commit/Publish/Open PR, find the repository's real validation commands (its
instructions, build metadata, or CI) and run the smallest safe checks covering
the change: focused tests, relevant lint/type checks, broader regression only
when blast radius warrants. Never invent a command or install dependencies; if
nothing applies, record an explicit `not run` with the reason. If a relevant
check fails, stop before committing unless the user explicitly asks to preserve
the failing state; never publish or open a PR over a known failure without an
explicit override after seeing it.

### 5. Stage, commit, push

Stage related files explicitly (`git add <paths>`; `git add -A` only when all
changes are one coherent, non-suspicious set). Write a conventional-commit
message per the kernel (`<type>(<scope>): <imperative summary>` plus a short
body). Verify staged content (`git diff --cached --stat`), commit, then verify
(`git status`, `git log --oneline -n 5`). Push only in Publish/Open PR modes
(`git push -u origin <branch>` when no upstream); never force-push or push to a
protected branch without an explicit request.

### 6. Capture visual evidence for UI changes

When the diff changes something visible, capture before/after screenshots for the
body per `pr-conventions/references/visual-evidence.md`: shoot the changed
states, get a real before from the base via a worktree, and deliver by staging
files plus paste-ready placeholders (the GitHub image CDN can't be written
headlessly). Skip for backend-only changes; in Preview/Commit, just note the
change is visual and offer to.

### 7. Create the pull request (Open PR mode only)

A successful push does not authorize creating a PR. Select an authenticated
access path per the kernel, resolve repo, head, and evidence-backed base, and
search for an existing PR from that head before creating. Compose the body from
the kernel's pr-standard (defer to the repo template), populated from the diff
and real validation results, with the step-6 visual evidence and a small Mermaid
diagram where it helps; add a clickable tracked-issue link when the branch
carries one. Hold the standard's concision rules. Default to `--draft` unless a
ready PR is clearly wanted:

```bash
gh pr create --title "<title>" --body "<body>" --base <base> --head <branch> --draft
```

After creation, verify the live PR (number, URL, title, base, head, draft) per
write-once-then-verify before claiming completion. Use
`references/pr_output_templates.md` for the final-status format.

## Update an existing PR

Two independent axes; pick the narrowest.

**Intent** — what may change:

- **Sync:** make the body true to the current diff; facts may change (add missing
  changes, correct stale claims, fix an inaccurate title). Default for check,
  revise, sync, refresh, audit.
- **Polish:** improve clarity, concision, and tone only; facts are frozen.
  Default for polish, humanize, rewrite, clean up language.

**Effect** — Preview (default, read-only) vs Apply (edit once, then verify).

Do not blur the contract: Polish makes zero factual changes — preserve every
claim, number, link, identifier, command, result, and checkbox exactly. If a
Polish request meets a materially stale, inaccurate, or empty body, stop and
switch to Sync rather than hiding a factual change inside prose cleanup.

### 1. Read the live PR

Resolve the target and fetch state, title, full body, URL, base, head, head SHA,
commits, and changed-file summary; read the repo PR template when present.

### 2. Build an accurate picture

**Sync:** inspect the branch changes without altering refs (`gh pr view <n>
--json files,commits`, `gh pr diff <n>`), group by intent, then audit the body
against the diff and template — summary/motivation and a clickable issue link,
change inventory (API, schema, deps, migration, config, docs, compatibility),
factual validation evidence, risk/rollout, visual evidence (leave a placeholder
for missing UI shots; this skill cannot capture new ones here), and whether a
small Mermaid diagram would help. Produce a plain-English gap analysis; if the
body already matches, say so and stop — do not edit for its own sake.

**Polish:** use commits and the file summary only as a factual guardrail; you are
rewriting accurate content to read better, not auditing for completeness.

### 3. Draft the revised title and body

**Sync:** write the full updated body from the gap analysis, changing only what
the diff supports; add a diagram or Screenshots placeholder where the audit
flagged one; revise the title if inaccurate (conventional-commit style).

**Polish:** rewrite for outcome-first order, plain active voice, and scanability;
cut root-cause essays, per-function walkthroughs, restated-twice content, and
hedging — provided every real claim, number, link, command, result, and checkbox
survives somewhere. Preserve template headings and author voice where already
clear. Cutting length is Polish, not a factual change.

Either way, conform to the kernel's pr-standard.

### 4. Present or apply

Present the proposed changes using `references/update_output_templates.md`.
Preview: current-vs-proposed title (omit if unchanged), the gap-analysis summary
for Sync, and the full proposed body — then stop. Apply: write once and verify
per the kernel:

```bash
gh pr edit <number> --title "<revised title>" --body "<revised body>"
```

Omit `--title` if unchanged. If the write is rejected for missing authorization,
do not retry through another path; report it and preserve the proposed text.

## Final report

Report the detected state and track, the branch, and — as applicable — the commit
hash and message, push destination, PR URL, the intent/effect used, what changed
(title and which body sections), validation commands and results (including `not
run`), visual evidence captured or left for the author, and anything skipped or
needing attention.
