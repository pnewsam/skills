> Historical pre-rebuild document. Current architecture and retention policy are in README.md, AUTHORING.md, and docs/registry-rebuild.md.

# UI substitute (arm C) — checks that replace the prose

Arm C of the `ui-family` eviction run tests the model plus this thin substitute —
no hand-maintained ui-* prose (the ~2,800 lines under A/B in
`evals/ui_family_cases.json`). Most of what that prose teaches is either already
enforced by deterministic tooling or reliably produced by the base model; the
durable part is a small set of *checks* that verify rendered output.

This note is arm-C context and the seed for a future `ui-quality-gates` CONVERT
skill, not an active skill.

## Wire into the project, not the registry

- **Contrast** — `ui-color`'s `scripts/check_contrast.py` (WCAG AA on text and
  meaningful-indicator pairs) already replaces the palette/shade/dark-mode prose
  with a computed check (`ui-color` was converted 2026-08-15).
- **Spacing scale** — `ui-spacing`'s `scripts/check_spacing.py` replaces the
  scale-conformance prose with a lint.
- **axe-core** (`@axe-core/playwright`, `jest-axe`, `@axe-core/cli`) — the
  WCAG rule scans that `ui-content`/`ui-icons`/`ui-feedback` describe (names,
  roles, contrast) at the real page.
- **Playwright screenshot diff** (in `validate-changes` / `add-browser-test`)
  — elevation, layout, responsive, and hierarchy claims become *rendered* proof,
  not prose: a component-level baseline and a diff on the moved screen.

## What has no deterministic check (watch these in the A/B)

- `ui-content`, `ui-forms`, `ui-actions`, `ui-onboarding`, `ui-typography` are
  judgment and taste. `ui-data-viz` has a render/annotation check only if a
  dashboard harness exists (chart-type rules are the model's judgment).
- If any pilot case shows arm A clearly beating arms B and C there, that
  specific skill is the CONVERT candidate — reduce it to a short review
  checklist plus an objective, not restored prose.

Per the bitter lesson, do not convert every ui skill to a hand-rolled validator
by reflex: a linter that duplicates advice the model already applies is itself
the hand-knowledge cost, letter-shifted. The endgame is real renders as ground
truth, which the A/B gate decides.