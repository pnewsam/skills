---
name: design-polish
description: evaluate a UI at the component level for visual polish — spacing, alignment, typography, color, and pixel-level issues. produces a structured critique focused on quick mechanical fixes. use when checking if a component or page looks refined, or after implementing a design. this is the "does a designer's eye twitch?" skill. for structural, page-level, or navigation concerns, use design-review instead.
---

# Design Polish

## Overview

A design polish pass evaluates a UI at the component level — is every pixel right? Are spacing values rhythmic and intentional? Do colors match the system? Does the typography hierarchy hold? This is the "does a designer's eye twitch?" skill.

This is convergence work against an implicit standard of visual quality. Findings are typically quick fixes: wrong spacing value, misaligned icon, inconsistent border radius, off-brand color. The output is specific enough that each item can be fixed inline without further investigation.

For holistic UX review (page structure, navigation, information hierarchy, "does this UI make sense?"), use `design-review`.

## When to use

- Checking a component or page for visual refinement before shipping
- After implementing a design — verifying it matches the intended look
- When something looks "off" at the detail level but you can't articulate why
- As a final polish pass on a new feature
- Periodically, as a visual quality health check

## Workflow

### 1. Identify the target

The user specifies a page, route, view, or component to polish-check. Find the relevant files and read them completely.

If the user provides a screenshot, use it to anchor the visual assessment. Then read the code to understand what produces the visuals and to see states the screenshot doesn't show.

If no screenshot is provided, work from code. You can infer visual quality from spacing values, color choices, typography, component structure, and conditional states.

### 2. Understand the context

Before evaluating, note:

- **What is this page/component for?** What user goal does it serve?
- **Who uses it?** Admin tool, consumer app, dashboard?
- **What state is shown?** Populated, empty, loading, error?

Context calibrates expectations. A data-dense admin table has different polish standards than a consumer landing page.

### 3. Evaluate through each lens

#### Lens 1: Spacing & Alignment

- **Spacing consistency** — Are gaps between elements rhythmic and intentional? Does the spacing scale hold (4px increments, Tailwind spacing tokens)? Are there arbitrary values outside the scale?
- **Alignment** — Do elements that should align actually align? Are there subtle 1-2px misalignments? Do icon sizes match their text labels?
- **Vertical rhythm** — Does the vertical spacing feel consistent across sections? Are section gaps uniform?

#### Lens 2: Typography

- **Hierarchy** — Is there a clear headline → subhead → body → caption progression? Do font sizes use the defined scale?
- **Weight** — Do headings use appropriate weight (semibold/bold)? Is body text readable? Are there competing bold elements?
- **Line height** — Is line height appropriate for the context? Body text at 1.5-1.6, headings tighter?
- **Truncation** — Are long strings handled (truncate, overflow hidden)? Or do they break the layout?

#### Lens 3: Color & Visual Treatment

- **Color usage** — Are colors from the design system? Any raw hex values? Are semantic colors used correctly (destructive for errors, muted for secondary)?
- **Contrast** — Is text legible against its background? Are muted/foreground combinations sufficient?
- **Borders, shadows, dividers** — Are these consistent? Are there competing separation techniques (border AND shadow AND background change on the same element)?
- **Visual weight** — Is the most important element visually dominant? Are there elements that draw attention inappropriately?

#### Lens 4: Component Consistency

- **Pattern matching** — Do similar elements use the same treatment? Same border-radius, same padding, same shadow on all cards?
- **Interactive elements** — Do buttons, inputs, selects use consistent sizing? Are focus rings consistent?
- **Icon consistency** — Are icons the same size within a context? Same stroke width? From the same icon set?
- **Component library usage** — Are there raw HTML elements where a base UI component exists? (native `<select>` instead of `Select`, native `<input type="checkbox">` instead of a styled switch)

#### Lens 5: Layout Precision

- **Responsive behavior** — Does the layout break or overflow at common widths? Are responsive classes used correctly?
- **Overflow/overflow issues** — Do elements overflow their containers? Are scrollbars appearing where they shouldn't?
- **Empty space** — Is whitespace used intentionally or is it leftover? Are there awkward gaps?

### 4. Classify each finding

For each issue found, record:

- **Lens**: which lens identified it
- **Observation**: specific, concrete description of what's wrong
- **Impact**: how it affects the user's perception of quality
- **Effort**: quick fix (1-2 lines), moderate (component restructure), or structural (design system gap)
- **Recommendation**: the specific fix — exact Tailwind class to change, component to use, value to update

### 5. Write the polish artifact

Produce `docs/tmp/design-polish-{target}.md`:

```markdown
# Design Polish: {target}

Date: {date}
Source: {code-only | screenshot + code}

## Context

{Brief description — what is this, who uses it, what state is shown}

## Summary

{1-2 sentence overall assessment of visual quality}

### Strengths

- {Things that are visually refined — always include these}

### Key Findings

{Top 3-5 most impactful polish issues, briefly}

## Detailed Findings

### Spacing & Alignment

#### 1. {Finding title}

- **Observation**: {What you see — be specific about values}
- **Impact**: {Why it matters visually}
- **Effort**: quick fix | moderate | structural
- **Recommendation**: {Specific fix — exact class name, value, or component}

### Typography

...

### Color & Visual Treatment

...

### Component Consistency

...

### Layout Precision

...

## Recommended Actions

### Quick Fixes

{Numbered list of mechanical fixes}

### Deeper Work

{Items needing component redesign or design system updates}
```

### 6. Present findings

Summarize:

- Overall visual quality assessment
- Top 3-5 findings by impact
- Split between quick fixes and deeper work
- Recommended next step: fix inline, or run `design-review` for structural issues

## Key principles

- **Be specific about values.** Not "the spacing is wrong" but "uses `gap-3` (12px) where all other card grids use `gap-4` (16px)."
- **Only flag polish issues.** Don't critique information hierarchy, navigation patterns, or page structure — that's `design-review` territory. Stay at the component level.
- **Respect intentional choices.** If a deliberate design decision produces a different-but-valid result, it's not a finding.
- **Scale to context.** A prototype doesn't need pixel-perfect spacing. A shipping product does.
- **Tie to user perception.** "The misalignment between the icon and label makes the row feel unstable" is better than "the icon is 2px off."

## Handling common situations

### The page is early/rough

Focus on component consistency and obvious misalignments. Skip pixel-precision checks. Note that the page is early and a full polish pass would be premature.

### The page is very polished

Say so. A short report with 1-2 minor findings is an honest result.

### The finding is a design system gap

If components consistently use a value that's wrong because the design system doesn't define it, flag as a system-level gap. Recommend `create-design-system`.

### A finding crosses into structural territory

If you find yourself questioning whether something belongs on the page at all (not just how it looks), flag it briefly but note it's a `design-review` concern. Don't go deep on structural critique here.
