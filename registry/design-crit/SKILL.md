---
name: design-crit
description: evaluate a UI view or page through multiple design lenses and produce a structured critique. use when you want a fresh assessment of how a page looks and feels — visual polish, UX clarity, information hierarchy, layout composition, and consistency. this is divergence-mode analysis — it identifies what could be better, not just what deviates from a contract. produces a critique artifact in docs/tmp/. findings that are structural recommend handoff to redesign-component or redesign-screen.
---

# Design Crit

## Overview

A design critique evaluates a UI as a user experiences it — not just whether it follows the rules, but whether it works well. Does the eye know where to go? Does the page feel polished or rough? Is it obvious what to do next? Are there moments of confusion, clutter, or visual dissonance?

This is divergence work. The skill identifies opportunities for improvement that go beyond what a contract can specify. Some findings may be quick fixes; others may require rethinking a component or page structure.

## When to use

- Evaluating a page or view that feels "off" but you can't articulate why
- Reviewing a new feature or page before shipping
- After implementing a design — checking it with fresh eyes
- When the user provides a screenshot and asks "what could be better?"
- Periodically, as a design health check on important views

## Workflow

### 1. Identify the target

The user specifies a page, route, view, or component to critique. Find the relevant files and read them completely.

If the user provides a screenshot, read it first — it anchors the visual assessment. Then read the code to understand what produces the visuals and to see states the screenshot doesn't show.

If no screenshot is provided, work from code. You can infer a great deal about visual quality from code alone — spacing values, color choices, typography, component structure, conditional states.

### 2. Understand the context

Before critiquing, understand:
- **What is this page for?** What user goal does it serve?
- **Who uses it?** Is this an admin tool, a consumer app, a dashboard?
- **What state is shown?** Is this the populated state, empty state, loading state?
- **Where does it sit in the app?** What comes before and after in the user flow?

Context determines what "good" means. A data-dense admin dashboard has different quality standards than a consumer onboarding flow.

### 3. Evaluate through each lens

Work through each lens systematically. Not every lens will produce findings for every page — that's fine.

#### Lens 1: Visual Polish

The "does a designer's eye twitch?" lens. Examine:

- **Spacing consistency** — Are gaps between elements rhythmic and intentional, or do they feel arbitrary? Does vertical rhythm hold?
- **Alignment** — Do elements that should be aligned actually align? Are there subtle misalignments that create unease?
- **Typography** — Is there a clear hierarchy (headline, subhead, body, caption)? Does text weight and size guide the eye? Is line length comfortable for reading (45-75 characters)?
- **Color usage** — Are colors purposeful or decorative? Is contrast sufficient? Does the palette feel cohesive? Does the 60-30-10 rule roughly hold (dominant, secondary, accent)?
- **Borders, shadows, dividers** — Are these consistent? Are there too many competing separation techniques (border AND shadow AND background change)?
- **Whitespace** — Is there enough breathing room? Or is it too sparse, making the page feel empty?
- **Visual weight balance** — Does the page feel balanced or lopsided? Is there a heavy element with no counterweight?
- **Pixel precision** — Odd-pixel values, half-pixel misalignments, inconsistent icon sizes, images at non-native resolution

#### Lens 2: UX Clarity

The "can a new user figure this out?" lens. Examine:

- **Affordances** — Do interactive elements look interactive? Do non-interactive elements look static? Can you tell what's clickable?
- **Feedback** — When the user takes an action, does the UI respond? Are there loading states, success confirmations, error messages?
- **Discoverability** — Can the user find the features they need? Are important actions visible or buried in menus?
- **Cognitive load** — How many things compete for attention? Can the user focus on their task, or must they parse a complex layout first?
- **Error prevention** — Does the UI prevent mistakes (disabled buttons, confirmation dialogs) or just report them after the fact?
- **Empty and edge states** — What happens when there's no data? Is the empty state helpful (guides the user to add content) or just blank?
- **Progressive disclosure** — Is complexity revealed gradually, or is everything shown at once?

#### Lens 3: Information Hierarchy

The "squint test" lens. If you squint at the page, can you tell what's most important? Examine:

- **Visual dominance** — Does the most important content have the most visual weight (size, color, position)?
- **Scanning order** — Does the natural reading pattern (F-pattern or Z-pattern) align with the content priority?
- **Grouping** — Are related items visually grouped? (Gestalt: proximity) Do unrelated items have clear separation?
- **Levels of detail** — Is there a clear primary → secondary → tertiary hierarchy, or does everything compete at the same level?
- **Content density** — Is the density appropriate for the context? Too dense for casual browsing? Too sparse for power users?

#### Lens 4: Layout and Composition

The "structure" lens. Examine:

- **Spatial organization** — Is the layout grid coherent? Do elements align to a consistent grid or feel randomly placed?
- **Proportion** — Are the relative sizes of sections appropriate to their importance? Is the sidebar taking up 40% of the page but containing 10% of the value?
- **Responsive behavior** — If applicable, does the layout adapt gracefully or break at certain widths?
- **Scroll behavior** — How much content is above the fold? Does the user need to scroll to reach primary content?
- **Negative space** — Is whitespace used intentionally to create structure, or is it just leftover?

#### Lens 5: Consistency

The "does this feel like one app?" lens. Examine:

- **Internal consistency** — Does this page use the same patterns as other pages in the app? Same button styles, same card treatments, same spacing?
- **Component consistency** — Are similar elements treated similarly? (e.g., all status badges styled the same way)
- **Interaction consistency** — Do similar actions behave similarly across the page?
- **Platform conventions** — Does the UI follow platform expectations? (e.g., primary actions on the right, navigation on the left/top)

### 4. Classify each finding

For each issue found, record:

- **Lens**: which lens identified it
- **Description**: specific, concrete observation
- **Impact**: how it affects the user experience
- **Effort**: quick fix, moderate change, or structural rework
- **Recommendation**: what to do about it
  - Quick fixes → describe the specific change
  - Component-level issues → recommend `redesign-component`
  - Page-level structural issues → recommend `redesign-screen`
  - System-level issues → recommend updating the design system

### 5. Write the critique artifact

Produce `docs/tmp/design-crit-{target}.md`:

```markdown
# Design Critique: {target}

Date: {date}
Source: {code-only | screenshot + code}

## Context
{Brief description of the page's purpose, audience, and place in the app}

## Summary

{2-3 sentence overall assessment. What's working well? What's the biggest opportunity?}

### Strengths
- {Things the page does well — always include these}

### Key Findings

{Top 3-5 most impactful findings, briefly}

## Detailed Findings

### Visual Polish

#### 1. {Finding title}
- **Observation**: {What you see}
- **Impact**: {Why it matters}
- **Effort**: quick fix | moderate | structural
- **Recommendation**: {What to do}

...

### UX Clarity
...

### Information Hierarchy
...

### Layout and Composition
...

### Consistency
...

## Recommended Actions

### Quick Fixes
{Numbered list of changes that can be made directly — these can be handed to design-fix or done inline}

### Deeper Work
{Items that need redesign-component, redesign-screen, or design system updates}
```

### 6. Present the critique

Summarize for the user:
- The overall impression and biggest strengths
- The top 3-5 findings by impact
- The split between quick fixes and deeper work
- Recommended next steps

## Key principles

- **Always lead with strengths.** A critique that only lists problems is demoralizing and incomplete. What's working well is important context for what to improve.
- **Be specific, not vague.** "The spacing feels off" is not a finding. "The 8px gap between the title and subtitle is too tight relative to the 24px gap below — it makes them feel disconnected from each other while being crammed together" is a finding.
- **Tie findings to user impact.** Every finding should explain why it matters — not in abstract design terms, but in terms of what the user experiences. "The call-to-action button uses the same visual weight as the secondary text, so users may not notice it" is better than "the button lacks visual hierarchy."
- **Respect intentional design choices.** If something looks deliberate and works — even if it's unconventional — it's not a finding. Critique what's broken or suboptimal, not what's merely different from your preference.
- **Scale the critique to the context.** A prototype doesn't need pixel-perfect polish feedback. A shipping product page does. Match the depth and severity of findings to what's appropriate.
- **Reference established heuristics when relevant.** Naming the principle (Gestalt proximity, Fitts's law, 60-30-10 rule, F-pattern scanning) helps the user understand the "why" and builds their design vocabulary. But don't lecture — cite the principle and move on.

## Handling common situations

### The user provides only a screenshot

Work from the screenshot. You can assess visual polish, hierarchy, composition, and some UX clarity without code. Note that you can't evaluate: hover/focus states, animations, responsive behavior, empty/error states, or accessibility. Recommend a code-based follow-up for a complete critique.

### The page is clearly early/rough

Scale the critique appropriately. Focus on structural and UX issues (lenses 2-4) rather than polish (lens 1). Early work benefits more from "the information hierarchy is unclear" than "the spacing is inconsistent."

### The page is very good

Some pages don't have much wrong. Say so. A short critique with minor findings is an honest result. Don't manufacture problems to fill a template.

### Multiple states need review

A page may look fine in its happy path but fall apart in edge cases (empty, error, loading, long content, many items). If you can see the code, check the conditional rendering paths and critique each significant state. Note which states you reviewed and which you couldn't assess.

### The finding is a design system gap, not a page problem

Sometimes a page faithfully implements the design system and the result is still suboptimal — the system itself needs updating. Flag these as system-level findings and recommend running `extract-design-system` to refresh the contract after the design system evolves.
