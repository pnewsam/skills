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

- Prefer a before/after pair — a `| Before | After |` table, or `![alt](url)` for after-only when a real "before" is impractical.
- Cover the states that actually changed, not one happy-path shot.

## Diagrams (optional)

Add a small Mermaid diagram only when it conveys the shape of the change faster than prose — a new flow, a state change, a reworked boundary, a data-model relationship. Most PRs need none.

- Keep it to ~5–12 nodes and diagram only what the diff supports.
- Pick the format for the intent: `sequenceDiagram` for flow, `flowchart` (the safe default) for boundaries/control flow, `stateDiagram-v2` for lifecycle, `erDiagram` for data models.
- GitHub renders fenced ```mermaid blocks natively.

## Keep language concise

Write the shortest body that lets a reviewer understand what changed and why. Most PRs fit on one screen: a line-per-item summary, a sentence or two of why, changes grouped by intent, and validation as `command — result`. Length should track the change's complexity, not the effort spent on it — a one-file bug fix does not need five paragraphs.

These habits carry most of the concision:

- **Describe outcomes and boundaries, not the diff.** The files are in the diff; the body says what the change accomplishes and where its edges are. Do not walk through each function, component, or file you touched.
- **One idea per bullet, one statement per idea.** A bullet is a single line. If it runs to two or three sentences, it is narrating the mechanism — cut it back to the outcome. State each thing once; do not restate the before/after in both the summary and the screenshots.
- **One idea per sentence — do not chain clauses.** This governs prose, not just bullets. A sentence that joins two or three points with em-dashes or semicolons is doing too many jobs; split it into short declarative sentences. Prefer active voice and plain words. This is the spirit of simplified technical writing — short sentences, one job each — without adopting a restricted vocabulary that would fight the technical content.

A sentence, tightened:

- Verbose: "The truncation logic is correct and the guard prevents head/tail overlap; the schema change is a prompt edit backed by an n=12/arm A/B, and the tests pin the new behavior."
- Tight: "The truncation logic is correct — the guard prevents overlap. The schema change is a prompt edit, backed by an n=12/arm A/B. The tests pin the new behavior."

A bullet, tightened:

- Verbose: "Extend `deriveProviderStatus` with in-flight inputs (`testPending`, `initialTestDone`) so it also returns `testing` / `display` / `verifying`. The gating rule now lives in the pure helper."
- Tight: "Move the in-flight gating rule into `deriveProviderStatus` so it also reports `testing`/`verifying`."

Cut on sight:

- Root-cause essays and "why it resolved on its own" narration — one sentence of problem in *Why* is enough.
- Per-file or per-function walkthroughs dressed up as bullets.
- Hedging and meta-commentary — stacked-PR preambles, "screenshots to be attached", long environment caveats. Reduce to a single line or drop.
- Validation prose that describes what the tests cover — list `command — result` and, at most, name the new test file.
- Padding an optional section to look complete. Delete a section with nothing real to say.

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
