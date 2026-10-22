---
name: capture-pr-screenshots
description: Capture before and after screenshots of a UI change for a PR, in light and dark themes, saved to one predictable folder with a paste-ready table. Use when the user asks for screenshots, screens, or before/after images of a change, or when a fix makes a PR's existing screenshots stale.
---

# Capture PR screenshots

The result is one folder per PR, `~/Desktop/pr-<number>-screenshots/`, or `~/Desktop/<branch>-screenshots/` before a PR exists. It holds `before-<state>-<theme>.png`, `after-<state>-<theme>.png`, and `screenshots.md`. Always give the user the folder's absolute path and open it. Capture the states the diff changed, not one happy path.

Read the project reference first when one applies:

- MindsDB Cowork: [references/mindsdb-cowork.md](references/mindsdb-cowork.md)

## Choose how to render the state

Try these in order and record which one you used:

1. **The real app, driven headlessly.** Use the project's dev server, not a production build.
2. **An existing fixture or harness** that mounts the real component with mock data.
3. **A new fixture.** Copy the app entry's full list of style imports and its theme bootstrap. Overlays portal to `<body>`, so the theme must be on the document, not a wrapper.
4. **The user's own running app,** when an auth wall blocks every path above. Give them the click path and ask them to capture it. Do not screen-scrape their window uninvited.

Recognize an SSO redirect quickly and move down the list instead of fighting it. Leave any server the user is running alone.

## Capture both sides

Capture the after side from the PR head. Capture the before side from a separate worktree at the merge base with the PR's base branch, on a second port. Never switch branches in a checkout with changes. If a real before is impractical, render old and new configurations side by side in one fixture, or show after-only and say so.

Write one shots spec and run [the capture script](scripts/capture.mjs) once per side, changing only `label` and `baseUrl`:

```sh
node <this-skill>/scripts/capture.mjs spec.json
```

The script uses the target repo's Playwright and falls back to a cached headless shell when the expected browser build is missing. It captures both themes by default. Set `theme.localStorageKey` or `theme.queryParam` when the app reads its theme from either.

Give every shot a `waitFor` selector that exists only in the target state. A wrong entry point or server mode can render a clean-looking notice page, and `waitFor` turns that into an error. The script also refuses off-origin redirects and dev-server error overlays. Use `selector` to crop to one element, and `hover` or `click` for interaction states.

Look at every image before reporting it. A blank, unstyled, wrong-theme, or notice-page frame is a failed capture.

## Return

Return the folder path, a one-line note per state, and the contents of `screenshots.md`. The CLI cannot upload images to GitHub; the user drags them in. Add the table under the PR body's `## Screenshots` heading only when the user asked to update the PR (`publish-pr`), and never claim an image is attached when it is still a local file. Upload to another host only with authorized visibility. Never use a throwaway branch as an image host, because the embeds break when the branch is deleted.

Stop only the servers you started. Remove the worktrees, temporary fixtures, and exports you added, and keep them out of commits unless the user wants a fixture kept.
