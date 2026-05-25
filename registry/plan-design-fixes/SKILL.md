---
name: plan-design-fixes
description: create a prioritized, sequenced punch list from design findings produced by design-polish, design-review, or design-audit. triages each finding by effort and type, routes it to the right execution path, and produces a structured plan. use after running any design analysis skill when there are enough findings to warrant a plan before execution. pairs with design-fix, redesign-component, and redesign-screen for execution.
---

# Plan Design Fixes

## Overview

Take a design artifact — from design-polish, design-review, or design-audit — and transform it into a prioritized, sequenced plan of discrete work items. Each item is routed to the appropriate execution path based on effort and type.

This skill plans the work only. It does not edit source code.

## When to use

- After running design-polish, design-review, or design-audit and the artifact has more than a handful of findings
- When findings span multiple effort levels and execution paths — you need a plan before diving in
- When you want to sequence work to avoid conflicts (fix spacing before restructuring a component)
- When you want to batch similar fixes together for efficiency

Skip this skill when the artifact has only 2-3 trivial fixes — just apply them directly.

## Inputs

Read the design artifact. Look for the most recent file matching one of these patterns:

- `docs/tmp/design-polish-*.md`
- `docs/tmp/design-review-*.md`
- `docs/tmp/design-audit-*.md`

If multiple artifacts exist, ask the user which to plan from. If the user specifies a target name, use that one.

## Goals

- Parse findings from any of the three source artifact formats into discrete, actionable work items.
- Classify each item by effort, type, and execution path.
- Sequence items to minimize conflicts and maximize efficiency.
- Produce a tracker file that execution skills can consume item-by-item.
- Be idempotent: rerunning with the same artifact should not create duplicate items.

## Safety rules

- Do not change source code, assets, configuration, or branches during planning. This skill is read-only except for creating the tracker file.
- Do not discard findings from the source artifact. Every distinct finding should be captured as a work item.
- Do not invent findings that were not in the source artifact.
- When a finding is ambiguous about the right fix, preserve the ambiguity and flag it as needing clarification.

## Workflow

### 1. Read the source artifact

Read the design artifact completely. Identify:

- The source skill (polish, crit, or audit)
- The target (page, component, or scope)
- The date of the analysis
- All findings across all lenses/sections

### 2. Classify each finding

For each finding, determine the execution path:

| Effort | Type | Execution path |
|---|---|---|
| Quick fix | Spacing, alignment, color, typography tweak | Direct fix (apply inline, no separate skill needed) |
| Quick fix | Known deviation from design system contract | `design-fix` |
| Moderate | Component-level rework (new layout, split, restructure) | `redesign-component` |
| Structural | Page-level restructure (reorder sections, change navigation) | `redesign-screen` |
| System gap | Missing design tokens, no defined pattern | `create-design-system` |

Classification rules:

- **Quick fix**: a 1-2 line change with a known correct value. The finding itself contains the answer (e.g., "change gap-3 to gap-4").
- **design-fix**: the finding is a mechanical deviation from a documented design system contract where the correct value is known.
- **redesign-component**: the component has accumulated too many responsibilities or its layout no longer fits. The fix requires rethinking the component, not tweaking a value.
- **redesign-screen**: the page structure, section ordering, or navigation needs rethinking. Multiple components may be affected.
- **create-design-system**: the finding reveals a gap in the design system itself — no defined token, scale, or pattern exists, so individual fixes would be arbitrary.

For findings that could go either way (e.g., a component-level spacing issue that might indicate a deeper layout problem), classify conservatively (start with quick fix) and add a note to escalate if the quick fix doesn't resolve it.

### 3. Group and sequence

Group related items to avoid conflicts and maximize efficiency:

- **Same file**: items touching the same file should be grouped so they can be done in one pass.
- **Same component**: items affecting the same component should be sequenced together.
- **Dependencies**: a design system gap should be resolved before fixing deviations that depend on it.

Sequence in this order:

1. Design system gaps first (they unblock other fixes)
2. Mechanical batch fixes (design-fix items, all at once)
3. Quick fixes grouped by file
4. Component reworks (redesign-component)
5. Page restructures (redesign-screen, last — they have the largest blast radius)

Within each group, order by impact (highest first).

### 4. Create the tracker

Create `docs/tmp/design-fixes-{target}.md`:

```markdown
# Design Fixes: {target}

## Metadata

- Source: {design-polish | design-review | design-audit}
- Source artifact: {path to the artifact this plan was built from}
- Date planned: {date}
- Total items: {count}

## Status summary

- Ready: {count}
- In progress: {count}
- Done: {count}
- Needs clarification: {count}

## Execution queue

### {execution_path}

#### {item_id}

- Status: ready
- Source lens: {lens or category from the source artifact}
- Effort: {quick | moderate | structural}
- Files:
  - {file path}
- Finding: {what's wrong, from the source artifact}
- Fix: {what to do, from the source artifact's recommendation}
- Execution path: {direct-fix | design-fix | redesign-component | redesign-screen | create-design-system}
- Notes: {dependencies, warnings, or escalation conditions}

## Resolved

{Moved here once marked done}
```

Use stable `item_id` values derived from the finding content, e.g. `card-spacing-inconsistent`, `nav-labels-unclear`, `header-typo-hierarchy`.

### 5. Output summary

Report:

- Number of items created
- Breakdown by execution path
- The recommended first item to execute
- Any items needing clarification
- Path to the tracker file

## Idempotency contract

A subsequent run with the same source artifact should produce the same plan. Achieve this by:

- Using stable `item_id` slugs derived from finding content.
- Checking for an existing tracker at `docs/tmp/design-fixes-{target}.md` before creating a new one.
- If a tracker already exists: add new items not already present, skip duplicates, and preserve status on existing items.
- Matching new findings against existing items by content similarity, not just exact text match.

## Execution handoff

After planning, items are ready for execution. The execution path determines what happens next:

- **direct-fix**: the agent applies the fix inline. No separate skill needed — the finding contains the exact change.
- **design-fix**: invoke `design-fix` to mechanically apply the known correction.
- **redesign-component**: invoke `redesign-component` for component-level rework.
- **redesign-screen**: invoke `redesign-screen` for page-level restructure.
- **create-design-system**: invoke `create-design-system` to fill the design system gap.

Direct fixes should be done first (they're quick and reduce noise), followed by mechanical batches, then component/page rework.

## Final response

Report:

- Source artifact used
- Number of work items created
- Breakdown by execution path: X direct fixes, Y design-fix, Z redesign-component, etc.
- Path to the tracker file
- The recommended first item
- Any items that need clarification before execution