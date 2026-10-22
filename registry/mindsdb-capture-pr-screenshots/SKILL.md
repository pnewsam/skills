---
name: mindsdb-capture-pr-screenshots
description: Capture before and after screenshots of MindsDB Cowork UI changes for a PR, in light and dark themes, saved to one predictable folder with a paste-ready table. Use when the user asks for screenshots, screens, or before/after images of a Cowork change, or when a UI fix makes a PR's existing screenshots stale.
---

# Capture PR screenshots

The result is one folder per PR, `~/Desktop/pr-<number>-screenshots/`, or `~/Desktop/<branch>-screenshots/` before a PR exists. It holds `before-<state>-<theme>.png`, `after-<state>-<theme>.png`, and `screenshots.md`. Always give the user the folder's absolute path and open it in Finder; they upload the images to GitHub themselves, since the CLI cannot.

## Choose how to render the state

Pick the first path that shows the changed state with real components:

- **Code Mode:** run `BUILD_TARGET=web npx vite dev src/renderer --port <spare> --strictPort` and open `/?codeFixture=<name>`. Fixtures live in `src/renderer/cowork/code/fixtures.ts`.
- **Standalone visual fixtures:** `src/renderer/<name>-fixture.html` mounts `visual-fixtures/<name>`. Serve these from a plain `npx vite dev src/renderer` server. The web target redirects them to SSO.
- **Component harnesses:** `e2e/<name>/` has a Vite config that its `playwright.<name>.config.ts` starts on a fixed port.

If none covers the state, add or extend a fixture instead of using a static mock. To mirror a real task, read its `coding/sessions/<id>/events.jsonl` under `~/.cowork-dev`, `~/.cowork-stable` (Staging), or `~/.cowork` (prod). Org homes nest under `orgs/<org-id>/`. Keep the fixture only if the user wants it in the PR.

Use the `localhost` hostname, not `127.0.0.1`, because Vite listens on IPv6. Leave any server the user is running alone.

## Capture both sides

Capture the after side from the PR head. Capture the before side from a separate worktree at the merge base with the PR's base branch, usually `origin/staging`. Symlink `node_modules` into that worktree and serve it on a second port. Never switch branches in a checkout with changes. When the before side cannot render the new state, show only the after side and say so.

Write one shots spec and run [the capture script](scripts/capture.mjs) once per side, changing only `label` and `baseUrl`:

```sh
node <this-skill>/scripts/capture.mjs spec.json
```

Give every shot a `waitFor` selector that exists only in the target state. A wrong server mode renders a clean-looking notice page, and `waitFor` turns that into an error. The script also refuses off-origin redirects. It captures both themes by default, and `selector` crops to one element. Use `hover` or `click` for interaction states.

Look at every image before reporting it. A blank, unstyled, wrong-theme, or notice-page frame is a failed capture.

## Return

Return the folder path, a one-line note per state, and the contents of `screenshots.md`. Add that table under the PR body's `## Screenshots` heading only when the user asked to update the PR (`publish-pr`). Stop only the servers you started, and remove the worktrees and temporary fixtures you created.
