---
name: pr-conventions
description: House standards for commit messages, PR titles and bodies, and evidence-backed review findings. Read before writing or editing any commit message, PR title, or PR body, and before reporting review findings. GitHub mechanics live in publish-pr; this skill defines content only.
---

# PR conventions

Use the repository's own template and conventions when present. These defaults govern content, not authorization or external-system mechanics.

## Rules that general writing habits miss

Apply these on every PR. They are the parts a default PR body gets wrong.

- **Use the repository template.** In a monorepo, pick the template nearest the changed files (`cowork/.github/pull_request_template.md` for changes under `cowork/`) over one at the repository root.
- **Preserve every checkbox and its current state.** Do not toggle a checkbox on inference. Delete instructional placeholder prose once real content replaces it.
- **Link a tracked issue as a clickable URL.** A bare `ENG-1234` renders as plain text on GitHub and reaches nothing. Resolve the canonical URL from the user or a tracker integration. Never invent one.
- **Use closing keywords only when closing that issue is part of the agreed outcome.** Association alone does not authorize a tracker transition.
- **Write validation as `command — result`,** plus an explicit `Not run:` line for skipped checks. Do not describe what the tests cover.
- **Describe outcomes and boundaries, not the diff.** No per-file or per-function walkthroughs. The files are already in the diff.
- **One idea per bullet, one line per bullet.** A bullet that runs to three sentences is narrating mechanism.
- **Delete any section with nothing real to say.** A template is not mandatory padding.
- **Include before/after screenshots for UI changes.** Omit the section entirely for backend-only changes.
- **Use conventional-commit style** for PR titles and commit subjects: `<type>(<scope>): <imperative summary>`.

## Full standards

- `pr-conventions/references/pr-standard.md` — PR body shape, fallback template, linked issues, diagrams, concision, commit format and grouping.
- `pr-conventions/references/finding-model.md` — supported findings, severity, confidence, and deduplication.
- `writing-conventions/references/prose.md` — sentence-level style for all of the above.

Preserve material uncertainty, unsupported evidence, and the distinction between local and published results. Use the concrete PR runbook for target resolution, safe mutation, screenshots, and read-back verification.
