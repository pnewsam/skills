# Visual evidence

## Contents

- Output
- Render the state
- Capture before and after
- Helpers and limits
- Attach and clean up

For a project with its own render paths, read its reference first:

- MindsDB Cowork: [mindsdb-cowork.md](mindsdb-cowork.md)

## Output

Save each change's images to one folder the user can find: `~/Desktop/pr-<number>-screenshots/`, or `~/Desktop/<branch>-screenshots/` before a PR exists. Name the files `before-<state>-<theme>.png` and `after-<state>-<theme>.png`. Give the folder's absolute path and open it. Capture the states the change touched, in light and dark when the app has both, not one happy path.

## Render the state

Try these in order and record which one you used:

1. **The real app, driven headlessly.** Use the project's dev server, not a production build.
2. **An existing fixture or harness** that mounts the real component with mock data.
3. **A new fixture.** Copy the app entry's full list of style imports and its theme bootstrap. Overlays portal to `<body>`, so the theme must be on the document, not a wrapper.
4. **The user's own running app,** when an auth wall blocks every path above. Give them the click path and ask them to capture it. Do not screen-scrape their window uninvited.

Recognize an SSO redirect quickly and move down the list instead of fighting it. Leave any server the user is running alone.

## Capture before and after

Capture the after side from the candidate. Capture the before side from a separate worktree at the merge base with the PR's base branch, on a second port. Never switch branches in a checkout with changes. If a real before is impractical, render old and new configurations side by side in one fixture, or show after-only and say so.

Write one shots spec and run `scripts/capture.mjs` once per side, changing only `label` and `baseUrl`. The script's header documents the spec. It uses the target repo's Playwright and falls back to a cached headless shell when the expected browser build is missing. Set `theme.localStorageKey` or `theme.queryParam` when the app reads its theme from either. Each run writes `screenshots.md`, a before/after table for the PR body.

Give every shot a `waitFor` selector that exists only in the target state. A wrong entry point or server mode can render a clean-looking notice page, and `waitFor` turns that into an error. The script also refuses off-origin redirects and dev-server error overlays.

Look at every image. A blank, unstyled, wrong-theme, or notice-page frame is a failed capture. Do not substitute a prose description for a viewed image.

## Helpers and limits

- `scripts/shot_diff.mjs` compares deterministic PNG captures. A difference means pixels changed, not that the change is wrong.
- `scripts/check_contrast.py` calculates contrast for supplied color pairs. It does not discover every rendered pair or prove accessibility.
- `scripts/check_spacing.py` checks literal CSS and Tailwind lengths against a supplied scale. Off-scale values are findings to interpret, not automatic defects.

State the limitation when fonts, authentication, runtime, or a baseline capture are unavailable, and never claim an unrun comparison passed. A static render is a limited substitute that cannot prove the real app's behavior.

## Attach and clean up

The CLI cannot upload images to GitHub; the user drags them in. Add the table to the PR body only when a PR update is authorized (`publish-pr`), and never claim an image is attached while it is still a local file. Upload elsewhere only with authorized visibility. Never use a throwaway branch as an image host, because the embeds break when the branch is deleted.

Stop only the servers you started. Remove the worktrees, temporary fixtures, and exports you added, and keep them out of commits unless the user wants a fixture kept.
