---
name: mindsdb-migrate-surface-to-tailwind
description: Migrate one MindsDB Cowork UI surface from inline styles to Tailwind and exact design tokens, preserving behavior. Optionally snap selected values when explicitly requested. Uses project-specific cascade and token mappings; commits, issue creation, and draft PR delivery only when requested.
---

# Migrate a Cowork surface to Tailwind

Apply `work-conventions`. This optional project runbook preserves the specific mapping and cascade knowledge for the Cowork renderer. Confirm the actual repository configuration and target surface; historical ENG-1017 scope and staging conventions are context, not current authorization.

## Inventory and scope

Read `references/mapping.md` for token mappings, preflight-disabled border behavior, specificity, and font-family utility pitfalls. Recheck those assumptions against the current checkout. Run `scripts/inventory.mjs` on the selected surface to separate exact token mappings, possible snapping, and values that must remain arbitrary or dynamic. Remeasure current counts instead of repeating historical progress totals.

Keep one independently reviewable surface outcome. Confirm component forwarding before moving a style prop to className. Preserve unrelated work. An ordinary conversion request authorizes code and verification; it does not automatically create a tracker issue, commit each pass, push, or open a PR.

## Migrate and prove

Convert static style objects to Tailwind utilities and replace arbitrary values with tokens only where values match exactly. Preserve dynamic geometry and application-state expressions. Treat new shared config tokens as a compatibility surface and verify emitted CSS; successful parsing alone does not prove a utility exists.

Use the project's adopted runtime and actual checks. Verify behavior and rendered states, especially borders with disabled preflight, competing unlayered CSS, directional border resets, and font-family utilities. Keep conversion and exact token adoption pixel-preserving. Necessary regression coverage belongs to the same work unit.

Snap values only within a specifically requested value-changing scope. The mapping reference's thresholds are project guidance, not permission to change pixels. Present consequential alternatives when ambiguous; do not request approval again for exact changes already authorized. Render and inspect the resulting intentional differences.

## Delivery

Record the selected passes, candidate, evidence, remaining dynamic/arbitrary values, and any pixel changes. Leave work at the requested endpoint. If committing or opening a draft PR was requested, use `publish-pr`, honoring the actual target/base and `pr-conventions`. Create an ENG-1017 child issue with `create-issue` only when requested or already established in the task. A related issue does not authorize posting comments or merging.
