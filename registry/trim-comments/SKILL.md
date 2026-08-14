---
name: trim-comments
description: "Trim low-value code comments introduced by a branch or pull request's changes — process and chat-history narration, external ticket or plan references, restatements of the obvious, review chatter, and leftover commented-out code — while preserving comments that carry durable rationale, warnings, API docs, and tool directives. Use when asked to trim, prune, clean up, or tidy the comments on a PR or diff, or to strip noisy or AI-generated comments before review. Scoped to the lines the change touches; edits source files in the working tree and stops before committing. Does not rewrite the PR description (see update-pr) or review code for defects (see review-pr)."
---

# Trim comments

## Outcome

The comments a branch adds or changes carry only durable value. Noise a reader outside this moment can't use — process narration, references to plans and tickets that live outside the repo, lines that just restate the code — is gone. Code behavior is unchanged, and the edits sit uncommitted in the working tree for the author to review.

## Use / do not use

- **Use** to clean up the comments a diff introduced, before or during review.
- **Not** for the PR title or body — that's `update-pr`. Not for finding defects — that's `review-pr`. Not for a repo-wide comment sweep unrelated to a change — this skill is scoped to one branch's diff.

## Scope: only what the change touched

Trim only comments on lines this branch **added or modified**. A pre-existing comment that the diff merely sits next to is out of scope — leave it. Do not reformat, re-flow, or renumber surrounding code.

Resolve the change set against the base:

```bash
git rev-parse --abbrev-ref --symbolic-full-name @{u}   # upstream, if any
git diff --name-only <base>...HEAD                      # committed branch changes
git diff <base>...HEAD -- <path>                        # added/changed lines
git diff --name-only && git diff -- <path>              # uncommitted work too
```

For `<base>`, use the upstream's merge base, else `origin/HEAD`'s default branch, else a local `main`/`master`/`develop`. If the user names a PR, take its base branch (`pr-conventions/references/github-mechanics.md`). Work from the `+` lines in the diff — the comments the change is responsible for.

## What to trim

Remove (or tighten to the durable part) comments that a future reader of the merged code cannot act on:

- **Chat-history / process narration** — how the change came about: "changed this from X to Y", "previously we…", "as discussed", "per review feedback", "refactored per the plan", "step 3 of the migration", "moved from foo.ts". The diff and history already record this.
- **External-pointer comments** — references to things that live outside the codebase and mean nothing to a reader without them: Linear/Jira ticket IDs, plan or doc names, sprint or PR numbers, "see the spec doc", "as per the ticket". Keep a link **only** when it points to durable external context for a non-obvious workaround (e.g. an upstream bug); then keep the reason, not the bureaucracy.
- **Restatements of the obvious** — a comment that paraphrases the line under it (`// increment i`, `# set user to null`). The code says it already.
- **Review / author chatter** — "NOTE for reviewers", "AI-generated, please verify", "not sure if this is right", stale "TODO: remove before merge".
- **Leftover commented-out code** — dead code the change left behind, unless a nearby comment explains it's intentionally retained.
- **Decorative noise** — banner dividers and section headers added purely as visual filler.

Verbose-but-useful comments: keep the point, cut the padding. For phrasing a kept comment tightly, `writing-conventions/references/prose.md` applies.

## What to keep

Preserve comments that earn their place:

- **Why, not what** — rationale for a non-obvious choice, a tradeoff, a gotcha, an invariant, an ordering/concurrency/edge-case warning.
- **API documentation** — docstrings and doc comments describing public contracts, params, and return values.
- **Real, actionable TODO/FIXME** pointing to durable follow-up (not "remove before merge").
- **Required headers** — license and copyright notices.
- **Tool directives — never remove these; they change behavior, not just documentation:** `# noqa`, `# type: ignore`, `# pragma`, `// eslint-disable*`, `// @ts-expect-error` / `@ts-ignore`, `// biome-ignore`, `// prettier-ignore`, coverage pragmas, `#!` shebangs, and similar linter/compiler/codegen pragmas.

When a call is genuinely borderline, keep the comment and note it in the report rather than deleting silently.

## Workflow

1. **Resolve the change set** (above). List the files with added/changed comments.
2. **Edit in place.** For each such comment, decide trim / tighten / keep by the rules above, and apply the edit. Change only comment text — never a code token. Don't leave a syntactically empty block (e.g. add `pass` if a Python block loses its only line); the file must still parse.
3. **Report and stop** (below). Do not stage, commit, or push.

## Safety

- Comment-only edits. If removing a comment would change behavior — a tool directive, a heredoc, a string literal that only looks like a comment — leave it.
- Never touch comments outside the branch's diff.
- Reversible by design: leave changes in the working tree; committing is the author's separate, explicit step.

## Output

Report: files touched, a short count of comments trimmed vs. kept, a few representative removals, any borderline comments kept for the author to judge, and the reminder that nothing was committed.
