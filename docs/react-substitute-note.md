> Historical pre-rebuild document. Current architecture and retention policy are in README.md, AUTHORING.md, and docs/registry-rebuild.md.

# React substitute (arm C) — checks that replace the prose

The eviction pilot removes ~2,497 lines of react-* prose. Most of what that
prose asserts is already enforceable by deterministic tools that run against the
real code, or is reliably produced by the base model. Arm C tests the model
plus this thin, durable substitute — no hand-maintained knowledge prose.

This note is a **draft**: it is context for the arm-C trials and the seed for a
future `react-quality-gates` CONVERT skill, not an active skill yet.

## Wire these into the project, not the registry

- **`eslint-plugin-react-hooks`** (`rules-of-hooks`, `exhaustive-deps`) — catches
  the stale-closure, missing-dependency, and conditional-hook classes that
  `react-hooks-effects` describes, at the exact call site, every run.
- **`eslint-plugin-jsx-a11y`** — flags the accessible-name, role, and keyboard
  issues that `react-accessibility` describes; pair with automated axe checks in
  the browser-test layer (`add-browser-test`).
- **React Testing Library conventions** — encode "test behavior, not internals"
  as a lint rule (`eslint-plugin-testing-library`) and a review check, replacing
  `react-testing` guidance with an enforced default.
- **React Compiler / profiler evidence** — replaces `react-performance` opinion
  with measurement: memoize only what the profiler flags, or let the compiler
  handle memoization, rather than prescribing it in prose.
- **TypeScript + the framework's own data/routing APIs** — route loaders and a
  query library handle the fetch-race and waterfall cases from
  `react-data-fetching` structurally, not by advice.

## What has no deterministic check (watch these in the A/B)

Component decomposition, state-colocation, and context-splitting judgment
(`react-component-design`, `react-state-management`) are the least tool-covered.
If any pilot case shows arm A clearly beating arms B and C there, that specific
skill is the CONVERT candidate — reduce it to a short review checklist plus an
objective, not restored prose.
