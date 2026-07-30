# Browser-test conventions template

Write `tests/README.md` for Playwright or the equivalent location for the
selected framework. Adapt it to actual commands and paths.

```markdown
# Browser tests

## Framework and scope

- Framework: <name and version>
- App/package: <workspace path>
- Base URL: <local test URL>
- CI workflow: <path>

## Commands

- All browser tests: `<command>`
- One test file: `<command>`
- Interactive or debug mode: `<command>`

## Structure

- `<path>` — test specifications
- `<path>` — shared fixtures and helpers
- `<path>` — ignored authentication state, if used
- `<path>` — generated results and reports

## Conventions

- Prefer accessible roles, names, and labels for user-facing interactions.
- Use stable test IDs only when semantic selectors cannot express the target.
- Keep each test independent and deterministic.
- Create and clean up its test data explicitly.
- Avoid fixed sleeps; wait for observable user or network state.
- Reuse documented auth and fixture boundaries.
- Record the smallest command that reproduces a failure.

## Environment

<Document required variables, how developers obtain non-secret test values, and
which values must be configured as CI secrets. Never include secret values.>

## Adding coverage

Use `plan-browser-tests` to prioritize flows and `add-browser-test` to implement
one planned flow at a time.
```

Remove empty optional sections rather than leaving placeholders.
