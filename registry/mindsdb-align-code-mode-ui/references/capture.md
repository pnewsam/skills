# Capturing Code Mode screenshots

## Contents

- Render Code Mode
- Reproduce a real state
- Before and after

## Render Code Mode

On web, Code Mode renders only in fixture mode. Start the web renderer on a spare port, so a dev server the user is running stays untouched:

```sh
BUILD_TARGET=web npx vite dev src/renderer --port 5199 --strictPort
```

Open `http://localhost:5199/?codeFixture=<name>`. Fixtures live in `code/fixtures.ts` (`fixtureState`). Existing names include `running`, `approval`, `failed`, `new`, `activity`, and `activity-running`. Drive the page with the Playwright copy in `cowork/node_modules`. Set the theme before load with `localStorage.setItem('anton.theme', 'light' | 'dark')` in an init script. Setting `body[data-theme]` directly produces mixed colors.

## Reproduce a real state

When the user's screenshot shows a real task, read that task's events to see the actual data shapes. Each task keeps `coding/sessions/<id>/events.jsonl` under the matching app home: `~/.cowork-dev` for dev, `~/.cowork-stable` for Staging, or `~/.cowork` for prod. Org-scoped homes nest under `orgs/<org-id>/`. Add or extend a fixture that mirrors those shapes, so the capture is reproducible and remains useful for later visual checks.

## Before and after

Capture the before state from the base, not from memory. For a small working-tree change, stash only the changed source files, capture, then restore them. Otherwise use a separate worktree. Stop only the processes you started, and revert any temporary edit made just for a capture.
