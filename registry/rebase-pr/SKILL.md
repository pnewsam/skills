---
name: rebase-pr
description: "Rebase one or more open PR branches onto their integration base (default staging), resolve conflicts, reconcile changes that upstream already made, and optionally force-push and re-review. Use when asked to rebase a PR or branch on staging/main, catch a stale branch up to its base, rebase a batch of PRs, or sweep sibling rebases for missed reconciliations. Rebases locally by default; force-push and posting a review are separate, explicitly authorized steps. Never merges."
---

# Rebase PR

## Overview

Bring a PR branch back onto a moving base branch (this org integrates on `staging`) without losing work or silently duplicating changes the base already contains. The recurring failure mode is not the rebase mechanics — it is landing a rebased branch that re-adds something upstream already added (for example a build-kind env var defined twice) or force-pushing before the user is ready.

Apply the shared kernel for GitHub access and PR resolution: `pr-conventions/references/github-mechanics.md`.

## Modes and stopping point

Infer the narrowest mode. Do not advance past the requested effect without explicit intent.

| Mode | Permitted effects | Stop after |
| --- | --- | --- |
| Preview | Fetch and inspect divergence; report conflicts and duplication risk | Rebase plan |
| Rebase | Preview plus perform the rebase locally and resolve conflicts | Verified clean local rebase |
| Publish | Rebase plus `git push --force-with-lease` | Verified remote head |
| Re-review | Publish plus an independent post-rebase review | Review presented or posted |

"Rebase on staging" authorizes local rebase, not a push. "Rebase and push" (or a prior standing "yes force push") authorizes Publish. Posting a review is never implied — present it and let the user say post.

## Safety rules

- Default base is `staging`. Confirm the base per repo before rebasing (some repos integrate on `main`); use the PR's actual `baseRefName` when in doubt.
- Only ever `git push --force-with-lease`, never a bare `--force`. A lease push aborts if the remote moved under you.
- Do not force-push until the mode is Publish. Force-pushing may dismiss a stale approval — if the PR is already approved, say so and confirm before pushing.
- Do not `git rebase --skip` a conflicted commit to make the rebase "pass." A dropped commit is silent data loss — stop and surface the conflict instead.
- Do not merge, squash-rewrite unrelated history, or touch any branch other than the PR head and its base.

## Workflow

### 1. Resolve targets and bases

For each PR, resolve number → `headRefName` and `baseRefName` via the kernel. For a batch, list them explicitly so the user can see the set. Then refresh remotes:

```bash
git fetch origin
```

### 2. Assess divergence (Preview)

For each branch, report what the rebase will touch before doing it:

```bash
git checkout <headRefName>
git log --oneline origin/<base>..HEAD          # our commits being replayed
git log --oneline HEAD..origin/<base>          # what landed on base since we branched
git diff --stat HEAD origin/<base>
```

Flag likely conflict files and — importantly — changes on base that overlap our diff, since those are candidates for post-rebase duplication.

### 3. Rebase (Rebase)

```bash
git rebase origin/<base>
```

On conflict: resolve each file by intent (keep both behaviors, not just "ours"/"theirs"), then `git add` and `git rebase --continue`. If a conflict is genuinely ambiguous, stop and ask rather than guessing. Never `--skip`.

### 4. Reconcile against upstream

After a clean rebase, look for work that base already did and that our branch now duplicates or contradicts:

```bash
git diff origin/<base>...HEAD                  # our net remaining delta vs base
```

Read the net delta. If something we add is now redundant with an upstream addition (the duplicated-env-var pattern), collapse to the upstream form. When rebasing a batch, run this reconciliation on **every** branch — a fix applied to one often applies to its siblings.

### 5. Verify locally

Run the fast gates the repo expects (build/lint/type/targeted tests) so the rebased branch is known-good before any push. Confirm the tree is clean and the head is where you expect:

```bash
git status --short --branch
git log --oneline -5
```

### 6. Publish (only when authorized)

Warn first if the PR is approved (force-push may dismiss it). Then:

```bash
git push --force-with-lease
```

Re-fetch and confirm the remote head SHA matches local (kernel: write once, then verify).

### 7. Re-review (only when asked)

Offer a quick independent pass over the rebased diff via `review-pr`; post only on explicit request.
