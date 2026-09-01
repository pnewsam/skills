---
name: pr-conventions
description: Canonical PR conventions shared across the PR skills — the standard PR description shape, deferring to a repository template, concise language, conventional-commit format, the GitHub interaction mechanics (access-path selection, target-PR resolution, merged/closed handling, and write-once-then-verify), and the code-review finding model (verify-before-reporting, severity, confidence, and dedup). Use when preparing, updating, reviewing, or hardening a pull request, or when asked what the project's PR standards are. Invoked by publish-pr, review-pr, and harden-pr as their shared core.
---

# PR conventions

Shared kernel for the PR skills. `publish-pr`, `review-pr`, and `harden-pr` apply these conventions so that every PR — however it is produced — follows one standard. Read the reference that fits the task:

- **`references/pr-standard.md`** — how a PR description should read: the canonical body shape, deferring to a repository template, concise language, conventional-commit format, and grouping changes by intent. Apply when writing or updating a PR title, body, or commit message.
- **`references/github-mechanics.md`** — how to interact with GitHub safely: selecting one authenticated access path, resolving the target PR, handling merged or closed PRs, and the write-once-then-verify discipline. Apply whenever a PR skill reads or writes GitHub state.
- **`references/visual-evidence.md`** — how to reliably capture UI screenshots and get them into a PR: the capture fallback ladder (real app → user's app → isolated harness), styling/auth/tooling gotchas, and how to deliver the images — a human-in-the-loop **drag-drop by default** (stage files + placeholders), durable hosting only when fully headless. Apply when a UI diff needs before/after evidence and a plain `run` + screenshot did not just work.
- **`references/finding-model.md`** — how to evaluate and classify a review finding: verify-before-reporting (treat each finding as a hypothesis and try to disprove it), the severity ladder, confidence as orthogonal to severity, and one-finding-per-root-cause dedup. Apply when a review or hardening pass produces findings.

Two rules override any per-skill convenience:

- **Fit to the standard.** A PR this family touches must conform to `references/pr-standard.md`, deferring to the repository's own template when one exists.
- **One write, then verify.** Perform each GitHub write once through the selected access path and verify the live result; never retry a rejected write through a different path to bypass the rejection.
