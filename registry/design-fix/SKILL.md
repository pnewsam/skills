---
name: design-fix
description: fix design system deviations identified by design-audit. picks items from the audit artifact, applies targeted fixes to align the code with the design system contract, and marks items as complete. use after running design-audit, or when asked to fix specific design inconsistencies. mechanical, batchable convergence work.
---

# Design Fix

## Overview

This skill takes findings from a design-audit artifact and fixes them. Each fix aligns the code with the design system contract — replacing an off-system value with the correct one. This is mechanical work: the audit identified the problem and the expected value, this skill applies the change.

## Prerequisites

- A design audit artifact must exist in `docs/tmp/design-audit-*.md`
- The design system contract (`docs/design_system.md`) must exist

If neither exists, tell the user to run `extract-design-system` and then `design-audit` first.

## Workflow

### 1. Read the audit

Read the most recent `docs/tmp/design-audit-*.md`. If multiple exist, ask the user which one to work from (or use the one matching their specified scope).

### 2. Pick items to fix

Either:
- The user specifies which items to fix ("fix items 1-5", "fix all spacing issues", "fix violations only")
- Or pick the next unchecked items, prioritizing: violations > drift > inconsistencies

### 3. Apply each fix

For each item:

1. **Read the file** at the specified location
2. **Verify the finding** — confirm the current value matches what the audit reported. If the code has changed since the audit, skip the item and note it.
3. **Apply the fix** — replace the current value with the expected value from the audit
4. **Verify no breakage** — check that the change doesn't break the component's logic (e.g., a spacing value used in a calculation, a color used conditionally)

Fixes are typically one-line changes:
- `p-3` to `p-4`
- `#6366f1` to `var(--color-primary)`
- `text-sm` to `text-xs`
- `rounded-md` to `rounded-lg`
- `gap-3` to `gap-4`

### 4. Mark items complete

After applying each fix, update the audit artifact — add a checkmark or strikethrough to the completed items so progress is tracked.

```markdown
### ~~1. [drift] Wrong spacing in UserCard header~~ FIXED
```

### 5. Run verification if available

If the project has:
- **Type checking** — run it to catch any type errors from the changes
- **Tests** — run relevant tests
- **Linting** — run the linter

Report any failures. Design fixes should never break functionality — if a fix causes a test failure, revert it and flag it for manual review.

### 6. Report

After completing the batch, report:
- How many items were fixed
- How many were skipped (code changed since audit, or flagged for manual review)
- How many remain in the audit
- Any test or lint failures encountered

## Key principles

- **One concern at a time.** Each fix addresses exactly one finding. Don't expand scope — if you notice other issues while fixing, don't fix them. They'll be caught in the next audit.
- **Preserve behavior.** These are cosmetic/consistency changes. They must not change how the component works, what it renders, or how it responds to interaction.
- **Verify before changing.** Always confirm the current value matches the audit's report. Code changes between audit and fix time.
- **Batch by file when possible.** If multiple findings are in the same file, fix them all at once to minimize file touches.

## Handling common situations

### The audit finding is ambiguous

If the expected value isn't clear from the audit, consult `docs/design_system.md` directly. If it's still ambiguous, skip the item and note it needs manual review.

### The fix would change visual behavior significantly

Some "one value" changes have outsized visual impact (e.g., changing a container's padding from 8px to 16px dramatically changes density). Apply the fix as specified — the audit and contract agreed on the expected value — but note the visual impact in your report so the user can verify.

### Multiple audit artifacts exist

Work from the one the user specifies. If they don't specify, use the most recent. Don't merge findings across audit artifacts — they may have been run against different scopes or different versions of the contract.

### All items are complete

Report that the audit is fully resolved. Suggest re-running `design-audit` to verify and catch any new deviations that may have been introduced elsewhere.
