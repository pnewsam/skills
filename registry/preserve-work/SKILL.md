---
name: preserve-work
description: Preserve related unfinished changes on a local WIP branch with a resumable context note, then return to the original branch. Use to shelve work explicitly; protects unrelated staged, unstaged, and untracked changes. Does not push or publish.
---

# Preserve work

Preserve one coherent set of unfinished changes without losing unrelated user work. The request authorizes one local WIP commit, not publication or destructive cleanup.

Never assume every dirty file belongs to the task. If ownership of a change cannot be separated safely, ask. Use a new WIP branch that follows repository conventions, and do not overwrite an existing snapshot. When unrelated work is present, use an isolated checkout or scoped patches. Never run a blanket reset, clean, or stash-pop across unknown changes.

Commit the related changes with a short context note covering the goal, scope, base, verification attempted, known failures, and next action. Use `references/wip-context.md` as needed. Keep secrets and generated files out, and label a failing state as unfinished.

Verify that the WIP commit holds the intended tracked and untracked work before removing those changes from the original checkout. Return to the original branch and confirm unrelated staged, unstaged, and untracked content is unchanged. If restoring fails, stop and report both recoverable states. A rerun that finds the same snapshot verifies it instead of committing again.

Report the original branch, WIP branch and commit, note location, known failures, and how to resume.
