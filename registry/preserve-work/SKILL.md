---
name: preserve-work
description: Preserve related unfinished changes on a local WIP branch with a resumable context note, then return to the original branch. Use to shelve work explicitly; protects unrelated staged, unstaged, and untracked changes. Does not push or publish.
---

# Preserve work

Preserve one coherent set of unfinished changes without losing unrelated user work. The preservation request authorizes its local WIP commit; it does not authorize publication or destructive cleanup.

Read repository instructions, original branch/HEAD, index, working diff, and untracked files. Identify exactly which changes belong to the request. If ownership cannot be separated safely, ask about that ambiguity. Never assume all dirty files belong to the task.

Choose a new repository-compliant WIP branch. Inspect an existing destination before reusing it; do not overwrite another snapshot. Use an isolated checkout or carefully separated patches/index state when the original checkout contains unrelated work. Never use a blanket reset, clean, or stash-pop across unknown changes.

Write a short context note with the outcome, changed scope, candidate/base, verification attempted, known failures, and next action; use `references/wip-context.md` only as needed. Keep secrets, caches, and generated files out. Place the note in a trackable project location when appropriate, otherwise report its durable path.

Stage only the related snapshot and note, inspect the exact staged diff, and create one descriptive local commit. An unfinished or failing state may be preserved here, but label it accurately; do not represent it as validated delivery.

Verify the WIP commit contains the intended tracked and untracked work. Return to the original branch and verify unrelated staged/unstaged/untracked content retains its prior state. Remove the preserved changes from the original checkout only after verifying the snapshot, using a scoped safe operation. If restoring the checkout fails, stop destructive actions and report both recoverable states and precise remaining steps.

Return original branch, WIP branch/commit, context location, known failures, and how to resume. A rerun that finds the same snapshot should verify it rather than create duplicate commits.
