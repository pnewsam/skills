---
name: design-review
description: evaluate a UI at the page/app level for structural UX quality — information hierarchy, navigation patterns, content prioritization, page structure, and "does this UI make sense?" questions. produces a structured critique with architectural recommendations. use when a page feels confusing or cluttered, or when reviewing overall UX before shipping. for component-level visual polish (spacing, alignment, typography, color), use design-polish instead.
---

# Design Crit

## Overview

A design critique evaluates a UI at the page or app level — not whether the pixels are right, but whether the structure makes sense. Does the information hierarchy guide the eye correctly? Is the navigation intuitive? Do page-level controls live where users expect them? Are there moments of confusion about what belongs where?

This is divergence work at the structural level. The skill identifies opportunities to reorganize, re-prioritize, or rethink how pages and flows are composed. Findings are typically architectural recommendations rather than quick CSS fixes.

For component-level visual polish (spacing, alignment, typography, color, pixel issues), use `design-polish`.

## When to use

- Evaluating a page that feels confusing, cluttered, or hard to scan
- Reviewing navigation patterns and page structure across the app
- After features accumulate on a page — checking if the original structure still works
- When asking "does this UI make sense?" or "should this live somewhere else?"
- Before shipping a new page — structural review of layout and content organization
- Periodically, as a UX health check on important flows

## Workflow

### 1. Identify the target

The user specifies a page, route, view, or flow to critique. Find the relevant files and read them completely.

If the user provides a screenshot, read it first — it anchors the visual assessment of layout and hierarchy. Then read the code to understand the component tree and what states the screenshot doesn't show.

If no screenshot is provided, work from code. You can infer a great deal about page structure from the component tree, conditional rendering paths, and how data flows into the view.

### 2. Understand the context

Before critiquing, understand:

- **What is this page for?** What user goal does it serve? What task is the user trying to accomplish?
- **Who uses it?** Admin tool, consumer app, dashboard, settings page? Power users or casual users?
- **Where does it sit in the app?** What page comes before? What comes after? Is this a destination or a passthrough?
- **What state is shown?** Is this the populated state, empty state, loading state, error state?
- **How did it evolve?** Did features accumulate over time? Is the current structure the original design or an accretion?

Context determines what "good" means. A 7-section admin settings page has different structural needs than a marketing landing page.

### 3. Evaluate through each lens

Work through each lens systematically. Not every lens will produce findings for every page — that's fine.

#### Lens 1: Information Hierarchy

The "squint test" lens. If you squint at the page, can you tell what's most important? Examine:

- **Visual dominance** — Does the most important content have the most visual weight (size, color, position)? Or is a secondary element accidentally dominant?
- **Scanning order** — Does the natural reading pattern (F-pattern or Z-pattern) align with the content priority? Where does the eye land first? Second? Is that the right order?
- **Grouping** — Are related items visually grouped? (Gestalt: proximity) Do unrelated items have clear separation? Are there items that should be grouped but aren't?
- **Levels of detail** — Is there a clear primary → secondary → tertiary hierarchy, or does everything compete at the same level? Can the user quickly identify what matters?
- **Content density** — Is the density appropriate for the context? Too dense for casual browsing? Too sparse for power users who need to scan quickly?
- **Section labeling** — Are sections clearly labeled? Can the user build a mental map of the page from section titles alone? Or do they need to read body content to understand what each section does?

#### Lens 2: Page Structure & Composition

The "does this belong here?" lens. Examine:

- **Control placement** — Do page-level controls (filters, date pickers, refresh buttons) live at the page level, or are they buried inside content cards? Controls that affect all sections below them should not live inside a card.
- **Section ordering** — Is the order of sections logical for the user's workflow? Most-used sections first? Configuration before diagnostics? Does the order tell a story?
- **Proportion** — Are the relative sizes of sections appropriate to their importance? Is a次要 section taking up prime real estate while a primary section is cramped?
- **Navigation placement** — Are navigation elements (back buttons, breadcrumbs, tabs) positioned consistently and predictably? Do they follow platform conventions?
- **Above the fold** — What does the user see before scrolling? Is it the right content? Or do they need to scroll past boilerplate to reach the primary task?
- **Card vs. non-card content** — Is everything in a card? Cards are for content sections, not for page chrome. Are there controls or elements that should be extracted from cards?

#### Lens 3: Navigation & Wayfinding

The "can the user find their way?" lens. Examine:

- **App navigation** — Is the global navigation clear? Does it indicate where the user is in the app? Is it consistent across pages?
- **Breadcrumbs and context** — Does the user know where they are in the app hierarchy? Can they navigate up a level easily?
- **Page-to-page flow** — Is the transition between pages natural? Does the user maintain context when drilling down or navigating back?
- **Navbar elements** — Are navbar items meaningful? Do they change per-context or remain static? Is there confusion about what an icon or label means?
- **Back navigation** — Are back buttons positioned consistently? Do they have adequate hit targets? Is the destination predictable?

#### Lens 4: Content & Data Presentation

The "is the right data shown?" lens. Examine:

- **Data relevance** — Does the page surface the data users actually need? Or is it showing low-value metrics (e.g., report count instead of traffic snapshot) because they were easy to implement?
- **Card content** — What data does each card/section surface? Is it immediately useful, or does the user need to click through to get value?
- **Empty states** — Are empty states helpful (guide the user to add content) or just blank? Do they provide clear next actions?
- **Loading states** — Do sections disappear during loading? Is there a skeleton or placeholder that maintains the page structure?
- **Progressive disclosure** — Is complexity revealed gradually, or is everything shown at once? Are advanced settings separated from common ones?

#### Lens 5: Interaction Design & Consistency

The "does this feel like one app?" lens. Examine:

- **Save patterns** — Are save actions consistent across the page? Does every section use the same pattern (explicit save button vs. auto-save)? Inconsistency creates surprise.
- **Control choices** — Are the right controls used for the right jobs? Would a toggle be better than a checkbox? Would a segmented control be better than a dropdown for 2 options?
- **Cross-page consistency** — Does this page use the same structural patterns as other pages? Same header layout, same section chrome, same action placement?
- **User menu & identity** — Is the user's identity and session management clear? Is there a user menu with name/email/logout, or opaque icons (lock symbol)?
- **Platform conventions** — Does the UI follow web platform expectations? Primary actions on the right, navigation on the left/top, standard icon meanings?

### 4. Classify each finding

For each issue found, record:

- **Lens**: which lens identified it
- **Description**: specific, concrete observation
- **Impact**: how it affects the user's ability to understand or navigate the page
- **Effort**: quick fix (reorder/add a label), moderate (extract a component, restructure a section), or structural (rethink page architecture)
- **Recommendation**: what to do about it
  - Quick fixes → describe the specific change
  - Component-level issues → recommend `redesign-component`
  - Page-level structural issues → recommend `redesign-screen`
  - System-level issues → recommend updating navigation patterns or page templates

### 5. Write the critique artifact

Produce `docs/tmp/design-review-{target}.md`:

```markdown
# Design Critique: {target}

Date: {date}
Source: {code-only | screenshot + code}

## Context

{Brief description of the page's purpose, audience, place in the app, and how it evolved}

## Summary

{2-3 sentence overall assessment. What's working well structurally? What's the biggest opportunity?}

### Strengths

- {Structural things the page does well — always include these}

### Key Findings

{Top 3-5 most impactful structural findings, briefly}

## Detailed Findings

### Information Hierarchy

#### 1. {Finding title}

- **Observation**: {What you see — be specific about what's wrong structurally}
- **Impact**: {How it affects the user's ability to scan, understand, or navigate}
- **Effort**: quick fix | moderate | structural
- **Recommendation**: {What to do about it}

### Page Structure & Composition

...

### Navigation & Wayfinding

...

### Content & Data Presentation

...

### Interaction Design & Consistency

...

## Recommended Actions

### Quick Fixes

{Numbered list of changes that can be made directly}

### Deeper Work

{Items that need redesign-component, redesign-screen, or navigation pattern updates}
```

### 6. Present the critique

Summarize for the user:

- The overall structural impression and biggest strengths
- The top 3-5 findings by impact
- The split between quick fixes and deeper work
- Recommended next steps

## Key principles

- **Always lead with strengths.** A critique that only lists problems is demoralizing and incomplete. What's working well structurally is important context.
- **Be specific about what the user experiences.** Not "the hierarchy is wrong" but "all 7 sections have equal visual weight, so the user must read every title to build a mental map of the page."
- **Tie findings to user tasks.** Every finding should explain how it affects the user's ability to accomplish their goal. "The date picker lives inside a card, so it reads as belonging to that card's content rather than controlling all sections below it."
- **Respect intentional design choices.** If something looks deliberate and works — even if it's unconventional — it's not a finding.
- **Scale the critique to the context.** An admin settings page has different structural needs than a consumer dashboard. Judge against what the page is trying to be.
- **Reference established heuristics when relevant.** Naming the principle (Gestalt proximity, Fitts's law, F-pattern scanning, progressive disclosure) adds credibility. But don't lecture — cite the principle and move on.
- **Recommend over describe.** Every finding should include a concrete recommendation. "Consider grouping into 3-4 labeled sections" is better than "the flat structure is confusing."

## Handling common situations

### The page is clearly early/rough

Focus on structural issues (lenses 1-3) rather than interaction consistency (lens 5). Early work benefits more from "the section ordering doesn't match the user's workflow" than "the save pattern is different from other pages."

### The page is structurally sound

Some pages have good structure. Say so. A short critique with minor findings is an honest result. Don't manufacture problems.

### The finding is a visual polish issue

If you notice spacing, alignment, or color issues, note them briefly but recommend `design-polish` for a thorough pass. Don't go deep on polish here — stay at the structural level.

### The page has multiple states

Check conditional rendering paths and critique each significant state (empty, error, loading, populated). A page may be well-structured in its populated state but collapse in its empty state.

### Multiple pages share the same structural problem

Flag as a systemic issue. If every settings page has the same flat section structure, the fix should be a page template or component pattern, not N individual fixes.

### A finding crosses into component polish territory

If you find both structural AND polish issues, produce the structural critique here and recommend a follow-up `design-polish` pass for the component-level details.
