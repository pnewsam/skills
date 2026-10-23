# MindsDB Cowork

Paths are relative to the `cowork` app in the MindsDB monorepo. PRs usually target `staging`, so take the before side from the merge base with `origin/staging`. Symlink `node_modules` into the before worktree.

## Render paths

Each path needs its own server mode. Using the wrong one renders a notice page or an SSO redirect instead of the UI.

| State | Server | URL |
| --- | --- | --- |
| Code Mode | `BUILD_TARGET=web npx vite dev src/renderer --port <spare> --strictPort` | `/?codeFixture=<name>` |
| Standalone visual fixture | `npx vite dev src/renderer --port <spare> --strictPort` | `/<name>-fixture.html` |
| Component harness | The `webServer` in `playwright.<name>.config.ts` | That config's `baseURL` |

- Code Mode fixtures live in `src/renderer/cowork/code/fixtures.ts`.
- Standalone fixtures are `src/renderer/<name>-fixture.html`, mounting `src/renderer/visual-fixtures/<name>`.
- Component harnesses live in `e2e/<name>/`.
- The full app needs SSO, so prefer a fixture.

Use `http://localhost:<port>`, not `127.0.0.1`, because Vite listens on IPv6. Check readiness against the fixture URL, never bare `/`. Under the web target, `/` raises a deployment-brand error overlay that Vite pushes onto every open page. `index-web.html` does not render Code Mode fixtures.

Use fixture text as `waitFor`, such as `text=Running npm test` for `running`. Class-name selectors often match hidden elements.

## Theme

Set `"theme": { "localStorageKey": "anton.theme", "queryParam": "theme" }`. The app reads `anton.theme`, and the visual fixtures read `?theme=`. Setting `body[data-theme]` directly in Code Mode produces mixed colors.

## Reproduce a real state

When the user's screenshot shows a real task, read that task's `coding/sessions/<id>/events.jsonl` to see the actual data shapes. Look under `~/.cowork-dev` for dev, `~/.cowork-stable` for Staging, or `~/.cowork` for prod. Org-scoped homes nest under `orgs/<org-id>/`. Add or extend a fixture that mirrors those shapes, so the capture is reproducible.
