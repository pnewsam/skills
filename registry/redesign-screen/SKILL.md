---
name: redesign-screen
description: redesign a screen or page that has become cluttered, confusing, or poorly organized as features accumulated. use when a page has too many sections, unclear hierarchy, mixed concerns, or a layout that no longer serves its purpose well. audits every section, component, and action on the screen, then proposes and implements a better page structure.
---

# Redesign Screen

## Overview

A screen starts focused — a list of items with a create button. Then it gets filters. Then a sidebar with details. Then summary stats at the top, a tab bar for different views, inline editing, bulk actions, an export button, and a notification banner. Each feature was needed, but the page now feels like a dashboard, a list view, and a detail view fighting for the same space.

This skill takes a screen that has outgrown its design, fully understands what it contains and what users need from it, and reimagines the page structure to accommodate everything coherently.

This is the screen-level companion to `redesign-component`. Where `redesign-component` fixes a single card or panel, this skill addresses the arrangement, hierarchy, and flow of an entire page.

## Workflow

### 1. Identify the target screen

The user will name a page or route. Find the page-level component and understand its composition.

```bash
# Find the page component and everything it renders
grep -rn "import.*from" <page-file> | head -50
```

Read the page component completely. Then read every major section or panel component it renders. Build the full picture of the page's composition tree — but focus on the top two levels (page and its direct children), not deep leaf components.

### 2. Catalog everything on the screen

Read the page and its section-level children. Extract a complete inventory:

**Sections and regions:**
List every distinct visual section of the page. For each:
- What is it? (header, filter bar, data table, sidebar, summary stats, tab content, etc.)
- What component renders it?
- How much vertical/horizontal space does it occupy?
- Is it always visible, or conditional (behind a tab, collapsed, shown on certain states)?

**Data displayed:**
List every type of information the screen presents, grouped by section:
- What entities are shown? (list of items, single item detail, aggregated stats)
- What fields/attributes are visible?
- How is data loaded? (all at once, paginated, lazy-loaded tabs)

**Actions available:**
List every action the user can take from this screen, grouped by location:
- Global page actions (create, export, bulk operations)
- Per-item actions (edit, delete, status changes)
- Navigation actions (tabs, filters, sort, search, pagination)
- What triggers each action? (button, menu, link, keyboard shortcut)

**User goals:**
What does a user come to this screen to do? There are usually 2-4 primary goals:
- Browse/find a specific item
- Monitor status of items
- Take action on an item
- Create something new
- Review/analyze aggregate data

Rank these by frequency — what do most users do most of the time on this page?

### 3. Identify the problems

With the full inventory, diagnose what's wrong at the page level:

**Mixed concerns:**
- The page tries to serve multiple distinct goals (monitoring AND detailed editing AND analytics) without clear separation
- Sections that serve different user intents are interleaved rather than organized by task

**Hierarchy problems:**
- No clear primary content area — everything competes for attention equally
- The most common user goal requires scanning past less-important sections
- Header/toolbar area has grown to consume too much vertical space before the user reaches the actual content

**Layout inefficiency:**
- Screen real estate poorly allocated — large sections for rarely-used features, cramped space for primary content
- Fixed layouts that waste space at wide viewports or overflow at narrow ones
- Sections that could be side-by-side are stacked vertically (or vice versa)

**Navigation/state problems:**
- Too many tabs fragmenting related content that the user needs to see together
- Or too few tabs, with unrelated content crammed into one view
- Filter/search state that is hard to understand or reset
- No clear indication of where the user is or how they got here

**Feature accretion symptoms:**
- A toolbar or action bar that has grown to contain 8+ buttons/controls
- Multiple competing ways to do similar things (inline edit vs. edit modal vs. edit page)
- Notification banners, alerts, or callouts that have accumulated and now stack

### 4. Map the user flows

Before redesigning, understand how users actually move through this screen:

- **Entry**: How does the user arrive? (navigation menu, link from another page, direct URL)
- **Primary flow**: What does the most common visit look like? (arrive → scan list → click item → take action)
- **Secondary flows**: What are the less-common but important paths?
- **Exit**: Where does the user go next? (detail page, another screen, stay on this page)

The redesigned page should optimize for the primary flow — the most common visit should require the fewest interactions and the least visual scanning.

### 5. Propose the new page structure

Describe the proposed structure in concrete terms:

**Page zones:**
Define the major spatial regions. Use a simple ASCII sketch or zone descriptions:

```
+---------------------------+
| Header: title + actions   |
+--------+------------------+
| Filters| Primary content  |
|        | (list/grid/table)|
|        |                  |
+--------+------------------+
```

For each zone:
- What goes in it
- Its sizing behavior (fixed, flexible, collapsible)
- Whether it scrolls independently

**Section placement:**
For each section from the inventory (Step 2), specify:
- Which zone it moves to
- Whether it stays, merges with another section, splits, or becomes progressive (collapsible, behind a tab, or moved to a detail view)
- Its relative priority within the zone

**Action consolidation:**
- Which actions stay as top-level buttons
- Which move into menus or contextual locations
- Which get grouped together
- Primary action vs. secondary actions

**What moves off this screen:**
Sometimes the right answer is that a section doesn't belong on this page at all. If content would be better served on its own page, in a modal, or in a sidebar panel, say so and explain why.

**Rationale:**
For each significant structural change, explain why — tie it back to a specific problem from Step 3 or a user flow from Step 4.

Present the proposal to the user before implementing. If the user has feedback, revise.

### 6. Implement the new structure

Modify the page component and its section-level children. Key principles:

- **Work with the existing component library and styling approach.** Match the codebase conventions.
- **Preserve all existing functionality.** Every piece of data, action, and state from the inventory must still be accessible. Restructuring the page must not remove capabilities.
- **Preserve the route and any URL parameters.** The page's URL contract with the rest of the app should not change.
- **Move sections, don't rewrite them.** Prefer relocating existing section components into the new layout over rewriting their internals. The section components themselves are not the problem — their arrangement is.
- **Extract new layout components if needed.** If the new structure introduces layout patterns (sidebar + main, collapsible panel), extract those as layout components rather than inlining complex CSS in the page.

Implementation order:
1. Create any new layout wrapper components needed
2. Restructure the page component's JSX — reorder and regroup sections
3. Update page-level styling (grid/flex layout, spacing)
4. Adjust section visibility logic (tabs, collapsible panels) if sections moved
5. Update any section components that need minor layout adjustments to fit their new context
6. Verify all page states still render correctly

### 7. Verify

After implementation:
- Walk through every section from the Step 2 inventory — confirm it's still present and accessible
- Check that the primary user flow (Step 4) is smoother in the new layout
- Check responsive behavior if the page had responsive concerns
- If there are tests for this page, run them
- If the app can be run locally, suggest the user check the page with realistic data

Report what changed, what moved where, and confirm nothing was lost.

## Handling common situations

### Screen has 10+ distinct sections

This is exactly the problem this skill is for. The proposal will likely involve grouping sections into tabs or collapsible panels, moving some sections to sub-pages, and establishing a clear primary content area. Don't try to keep everything visible — progressive disclosure is the right answer for overloaded screens.

### Screen is actually multiple pages in disguise

If the screen has tabs or modes that share almost no content between them, the right answer may be to split into separate routes. Propose this if the tabs represent genuinely different user goals. Shared context (like a selected entity) can be preserved through URL parameters or layout components.

### Screen is a dashboard

Dashboards are a special case — they're intentionally multi-concern (showing summaries from many areas). For dashboards, focus on: card sizing and visual hierarchy, grouping related metrics, ensuring the most-checked information is in the top-left scanning position, and making drill-down paths obvious.

### Page structure is fine, but a specific component is the problem

If the page layout is coherent but one component within it is cluttered, redirect to the `redesign-component` skill instead. The page doesn't need restructuring — a component within it does.

### User wants to add a new feature to an already-cluttered screen

This is a design opportunity. Rather than just cramming in the new feature, use this skill to restructure the page to accommodate it properly alongside everything else. The new feature is the catalyst, but the redesign benefits the whole page.

### The page has very different states (empty, loading, populated, error)

Audit each state separately. The layout may need to be different for the empty state (onboarding guidance, prominent create action) vs. the populated state (data-dense, filtering). Propose state-aware layouts where the page structure adapts.
