---
name: design-audit
description: scan pages or components against the project's design system contract (docs/design_system.md) and find deviations — wrong spacing values, inconsistent shadows, off-system colors, components that don't follow established patterns. use when you want to find and catalog UI inconsistencies for systematic cleanup. produces a structured audit artifact in docs/tmp/. pairs with design-fix for execution.
---

# Design Audit

## Overview

The design system contract (`docs/design_system.md`) defines what the UI should look like. This skill scans the actual code and finds where it deviates. The output is a structured list of findings that design-fix can execute against, one item at a time.

This is convergence work — the right answer already exists in the contract. The skill's job is to find where the code disagrees.

## Prerequisites

A `docs/design_system.md` must exist. If it doesn't, run `extract-design-system` first.

## Workflow

### 1. Read the contract

Read `docs/design_system.md` completely. Internalize the defined values:
- Spacing scale
- Color palette and semantic roles
- Typography scale and hierarchy
- Component patterns (border radius, shadows, padding)
- Layout conventions

These are the standards you're auditing against.

### 2. Determine scope

The user will specify what to audit. Scope options:

- **A specific page/route** — audit all components rendered on that page
- **A specific component** — audit that component and its children
- **A directory** — audit all components in a directory (e.g., `src/features/dashboard/`)
- **The full app** — audit everything (may produce a long list; suggest scoping down if the codebase is large)

### 3. Scan for deviations

Read the components in scope. For each, check against the contract:

**Spacing deviations:**
- Padding, margin, gap values that aren't on the defined scale
- Inconsistent spacing between similar elements (e.g., one card uses `p-4` and another uses `p-5`)
- Section spacing that doesn't match the documented convention

**Color deviations:**
- Raw color values (hex, rgb) used instead of tokens/variables
- Colors that don't appear in the defined palette
- Semantic misuse (e.g., using the "danger" color for non-error purposes)
- Inconsistent opacity or shade usage

**Typography deviations:**
- Font sizes not on the defined scale
- Wrong font weights for the context (e.g., a heading using regular weight)
- Line heights that don't match the system
- Inconsistent heading levels

**Component pattern deviations:**
- Border radius values that don't match the system
- Shadow values that differ from the defined set
- Button/input sizing that doesn't match established patterns
- Cards or containers with non-standard padding

**Layout deviations:**
- Page structure that doesn't follow documented conventions
- Container widths or padding that differ from the standard
- Grid usage that doesn't match the documented column structure

### 4. Classify each finding

For each deviation, record:

- **Location**: file path and line number
- **Category**: spacing, color, typography, component, or layout
- **Current value**: what the code currently uses
- **Expected value**: what the design system contract specifies
- **Severity**:
  - **Inconsistency** — deviates from the system but may have been intentional (e.g., a slightly different padding in a unique context)
  - **Drift** — clearly should match the system but doesn't (e.g., `13px` where everything else uses `12px` or `16px`)
  - **Violation** — uses a raw value where a token exists, or contradicts the system in a way that's clearly unintentional

### 5. Write the audit artifact

Produce `docs/tmp/design-audit-{scope}.md`:

```markdown
# Design Audit: {scope}

Audited against: docs/design_system.md
Date: {date}
Files scanned: {count}

## Summary

- {N} findings total
- {N} spacing, {N} color, {N} typography, {N} component, {N} layout
- {N} violations, {N} drift, {N} inconsistencies

## Findings

### 1. [drift] Wrong spacing in UserCard header
- **File**: src/components/UserCard.tsx:24
- **Category**: spacing
- **Current**: `p-3` (12px)
- **Expected**: `p-4` (16px) — all other card headers use p-4
- **Fix**: Change `p-3` to `p-4`

### 2. [violation] Raw hex color instead of token
- **File**: src/features/dashboard/StatsPanel.tsx:47
- **Category**: color
- **Current**: `#6366f1`
- **Expected**: `var(--color-primary)` or `text-primary`
- **Fix**: Replace with the primary color token

...
```

Each finding should be specific enough that design-fix can act on it without further investigation.

### 6. Present the summary

After writing the artifact, present the summary to the user:
- Total findings by category and severity
- The highest-severity items
- Recommendations for which items to fix first (violations before drift before inconsistencies)
- If the findings are extensive, suggest focusing on one category or area at a time

## Key principles

- **Only flag deviations from the contract.** Personal aesthetic preferences are not findings. If the design system says cards use `rounded-lg` and a card uses `rounded-lg`, that's not a finding even if you think `rounded-xl` would look better. That's divergence work (design-crit), not convergence work.
- **Be precise about the expected value.** "Should use consistent spacing" is not a finding. "Should use `gap-4` (16px) to match the card grid pattern documented in the design system" is a finding.
- **Don't flag intentional variations.** Some components legitimately need different values (a compact table row vs. a spacious card). If the design system documents these variations, they're not deviations. If it doesn't, flag them as inconsistencies (lowest severity) rather than violations.
- **Batch similar findings.** If 12 components all use `#6366f1` instead of the primary token, that's one finding with 12 locations — not 12 separate findings.

## Handling common situations

### No design system contract exists

Tell the user and recommend running `extract-design-system` first. Do not audit against an imagined standard.

### The contract itself is incomplete

Audit against what's documented. Note sections where the contract is silent and findings are ambiguous. Recommend updating the contract via `extract-design-system` to cover the gaps.

### Too many findings

If the scope produces 50+ findings, the audit is still useful but acting on it will be overwhelming. Suggest the user focus on one category at a time, starting with the highest-severity items. Structure the artifact so categories can be addressed independently.

### The deviation looks intentional

Flag it as an inconsistency (lowest severity) and note that it may be intentional. Let the user decide. The audit's job is to surface deviations, not to judge intent.
