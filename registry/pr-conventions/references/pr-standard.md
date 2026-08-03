# PR description standard

Follow the project's own PR conventions rather than an ad-hoc structure invented per PR. Consistency across PRs is the goal.

## Defer to the repository's template

When the repository defines a PR template — commonly `.github/pull_request_template.md`, `.github/PULL_REQUEST_TEMPLATE/*.md`, or a `docs/` or root-level variant — use it:

- Keep its headings, order, required fields, and checklist.
- Fill each section from the diff and actual validation; delete instructional placeholder prose (e.g. "Please include a summary of...") once real content replaces it.
- Preserve every checkbox and its current state. Do not toggle a checkbox on inference.

In a monorepo, prefer the template nearest the changed files (e.g. `cowork/.github/pull_request_template.md` for changes under `cowork/`) over one at the repository root.

## Fallback body shape

When no repository template exists, use this evidence-oriented shape and remove unused optional sections:

```markdown
## Summary

- <user-visible or operational outcome>
- <important implementation boundary>

## Why

<Problem, motivation, or linked issue. Use `Closes #<number>` only when known.>

## Changes

- <coherent change>
- <tests, migration, documentation, or dependency change>

## Validation

- `<command>` — passed / failed
- <manual verification and observed result>
- Not run: <check and reason>

## Risk and rollout

<Risk, compatibility, migration, feature flag, rollout, or rollback notes. Omit
only when genuinely not applicable.>

## Screenshots

<Before/after evidence for UI changes. Omit for non-visual changes.>
```

Include a Screenshots section for UI/frontend changes; omit it for backend-only changes.

## Keep language concise

Write the shortest title and body that convey what changed and why — tight bullets over paragraphs, outcomes and boundaries over a file-by-file narration of the diff. Cut hedging, restated instructions, and empty sections.

## Conventional-commit format (titles and commit subjects)

Use a conventional style for PR titles and commit subjects:

```text
<type>(<scope>): <imperative summary>

<short body explaining why and what changed>
```

Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `perf`, `build`, or `ci`. Choose a scope from the touched component, package, service, or feature area; omit it if it would be vague. Avoid generic subjects such as `update code`, `fix stuff`, `changes`, or `wip` unless the user explicitly requests them.

## Group changes by intent

When summarizing a branch or diff, group changed files by intent rather than listing every file:

- Feature behavior or user-facing functionality
- API or schema changes
- Tests and fixtures
- Refactors or cleanup
- Documentation and configuration
- Dependency or lockfile updates
