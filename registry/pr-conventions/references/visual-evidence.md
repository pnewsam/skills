# Visual evidence for UI PRs

How to reliably capture UI screenshots and get them into a PR when the happy path fails. Read this from the "capture visual evidence" step of a PR workflow whenever the diff changes something a user can see and a plain `run` + screenshot did not just work.

Default: capture from the **real running app**. Everything below is the fallback ladder for when that is blocked, plus how to actually host the images.

## Contents

- Capture ladder (most faithful first)
- Reliability gotchas
- Before/after strategy
- Hosting and embedding in the PR
- Cleanup and safety
- Checklist

## Capture ladder

Try in order; stop at the first that works. Note in the PR which one you used.

1. **Real app, driven headlessly.** Launch via the `run` skill or the project's dev command — prefer a **dev server over a full production build**; a build is almost never required just for a screenshot. Drive it with a headless browser (Playwright/Chromium already vendored in most web repos) to the states the diff changed. **Look at each screenshot before delivering it** — a blank or unstyled frame is a failed capture, not evidence.
2. **User's already-running app.** If the app gates behind interactive login/SSO you cannot complete headlessly (see gotchas), the fastest authentic shot is the user's own running instance: give them the exact click path and ask them to grab it. Do not screen-scrape their live window uninvited.
3. **Isolated-component harness.** Fully in your control, no backend or auth. Mount the *real* component on the project's dev bundler with mock props, drive and shoot it. Use this when the route is deep, data-gated, or auth-walled. Getting it to render faithfully has sharp edges — see the styling gotcha.

## Reliability gotchas

- **Auth walls end the headless-web path.** A web SPA that redirects to SSO (e.g. Keycloak/OAuth) will reject a non-whitelisted `redirect_uri` for your ad-hoc port, and cross-origin `/api` calls hit CORS. Recognize the redirect fast and drop to ladder step 2 or 3 instead of fighting it.
- **A broken backend blocks the full app, not the renderer.** If the dev backend won't boot (e.g. a stale virtualenv), the renderer alone often still gates on the missing API. That pushes you to the component harness — which needs none of it.
- **Harness styling: import what the app's entry imports.** The #1 cause of an "unstyled" harness is loading the design-token CSS but not the **utility/base layer** (e.g. Tailwind's `@tailwind base/components/utilities` usually lives in a *separate* file from the token definitions). Copy the app entry's *full* list of style imports in the same order, and replicate its theme bootstrap (`data-theme`/theme class on `<body>`). Overlays — dropdowns, menus, tooltips — portal to `<body>`, so tokens and theme must be on the document, not just a wrapper `<div>`, or the popup renders bare.
- **Broken `.bin` shims.** When a version-managed `node_modules/.bin/<tool>` shim fails to resolve, invoke the real entrypoint directly (`node node_modules/<tool>/bin/<tool>.js …`, `node node_modules/vitest/vitest.mjs …`).
- **Don't over-claim the cost.** "This needs a full build" is usually wrong — say what you actually tried and what blocked it.

## Before/after strategy

- Real before/after: capture the after-state on the branch and the before-state from the base via a worktree or second checkout — never an in-place branch switch of a dirty tree.
- Harness before/after: render both states from current code — the old config (e.g. the pre-fix prop) beside the new one — in one page. This is a legitimate, reproducible before/after when a real base checkout is impractical.
- When a true before is impractical, show after-only and say so.

## Hosting and embedding in the PR

GitHub's drag-drop image CDN can't be written headlessly (it needs a browser session + CSRF token a `gh`/PAT token lacks), but it's the right host — permanent, attached to the PR, nothing to clean up. So:

- **Default — stage for drag-drop.** Save PNGs to a Finder-friendly folder (`~/Desktop/pr-screenshots/<pr>/`, ordered names) and put one labeled placeholder per image in the PR body (e.g. ``_⬇️ drag `1-before-after.png` here_``). Tell the user the folder; they drag them in. Don't embed URLs they're about to replace.
- **Headless only (cron/CI)** — upload to durable object storage (e.g. S3/R2, public read), embed the URL, and verify it's `image/*` and present in the live body.
- **Avoid** per-PR throwaway branches as an image host — the embeds die when the ref is deleted, across every PR that used it.

## Cleanup and safety

- Remove anything temporary you added to capture: harness files, a temporary `export` added to reach a component, throwaway entries.
- Stop any dev server/bundler *you* started. Never kill or disturb a dev process the **user** is already running — scope your process-matching so you only stop your own.
- Keep capture scaffolding out of the PR diff and out of any commit.

## Checklist

- [ ] Change is user-visible (else skip screenshots).
- [ ] Captured the states the diff changed, not one happy-path shot.
- [ ] Viewed each image; it is styled and non-blank.
- [ ] Before/after present, or after-only with a reason.
- [ ] Default: files staged + labeled placeholders in the PR body, user told where to drop; headless: durable host, URLs verified `image/*`.
- [ ] Temporary scaffolding removed; only my own dev processes stopped.
