---
name: ui-patterns
description: Select the right UI pattern for displaying data collections. Decision frameworks for tables vs cards vs lists, pagination strategy, search and filter placement, detail/preview patterns, navigation structure, tabs vs accordions, truncation, and content organization.
---

# UI Patterns — Data Display & Organization

A decision engine for choosing the right layout, navigation, and content organization patterns based on data density, user goals, and information hierarchy. For form container decisions, see `ui-forms`. For action affordances, see `ui-actions`. For loading/empty/error states and notifications, see `ui-feedback`.

## Initial Response

When this skill is first invoked without a specific request, respond only with:

> I'm ready to help you select the right data display, navigation, and content organization patterns. Tell me about the data you're working with — what's the item count, what attributes matter, and what are users trying to do?

Do not provide any other information until the user asks a question or presents a layout to review.

---

## 1. Lists & Data Collections

Choosing how to present collections is a trade-off between **density, scanability, visual richness, and actionability**.

### Primary Collection Patterns

| Pattern | Item Count | Best For | Key Signal |
| :--- | :--- | :--- | :--- |
| **Simple List** | 1–15 | Text-heavy linear reading (settings, notifications, activity logs). | Items have 1–2 primary attributes. |
| **Card Grid** | 3–20 | Visually rich, self-contained items (products, projects, media). | Each item is an independent conceptual unit with 3+ attributes. |
| **Data Table** | 10–1000+ | Multi-column relational data needing comparison, sorting, filtering. | Users compare structured values across rows. |
| **Dense Grid** | 20–1000+ | Media galleries, file browsers, spreadsheet-like views. | Recognition over reading; minimal text per item. |
| **Kanban / Board** | 5–200 | Items progressing through discrete stages (tasks, deals, candidates). | Primary user action is changing status/stage. |
| **Timeline / Feed** | 10–500+ | Chronological events, social feeds, audit logs. | Natural temporal scanning; "what's new?" is the primary question. |
| **Calendar View** | 10–5000+ | Time-scheduled items, bookings, content calendars. | Items are tied to specific dates or time slots. |

### Table vs. Card View — The Decision Framework

**Choose a Data Table when:**
- Users need to **compare numeric or structural values** across rows (prices, statuses, dates).
- Sorting, multi-column filtering, and bulk select-and-operate are primary workflows.
- Content is primarily text, numbers, or compact badges — no large thumbnail focus.
- Users are in "expert operator" mode (admin panels, CRMs, inventory systems).

**Choose a Card Grid when:**
- Items are **highly visual** — images, charts, rich media dominate.
- Users are **browsing or exploring** rather than executing precise comparisons.
- The layout must gracefully reflow across breakpoints (cards reflow; tables require horizontal scroll or column hiding).
- Each item has 3+ distinct attributes that would make a table row too crowded.

**Choose a Simple List when:**
- Fewer than ~10 items. A table with few rows looks barren and over-structured.
- Items have only 1–2 primary attributes (e.g., label + timestamp).
- The user's task is linear reading or sequential scanning.

**Choose a Kanban Board when:**
- Items move through discrete, meaningful stages ("To Do → In Progress → Done").
- The primary action is **changing status/stage**.
- Visualizing bottlenecks and distribution across stages matters.

### Boundary Cases

| If... | Then... |
| :--- | :--- |
| Need comparison AND visual richness | Table with expanded rows (master-detail), or card grid with a compact list toggle. |
| Items have one small visual (avatar, icon) + structured data | Table with a narrow image column. Don't force cards for a single thumbnail. |
| List needs 3+ secondary attributes per item | Upgrade to a compact table. Don't jam metadata into list-item subtitles. |

### Density Modes

Offer display density options when the same view serves both scanning and deep-reading:

| Density | Row Height | Use Case |
| :--- | :--- | :--- |
| **Compact** | 28–36px | Power users scanning 100+ items. Gmail's "Compact" density. |
| **Default / Comfortable** | 40–56px | Balanced for most users. Linear issue list, GitHub PR list. |
| **Relaxed / Spacious** | 60–80px+ | Fewer items (<30), higher visual weight per item. Apple Music album list. |

**Rule:** If a view regularly holds 50+ items, offer a compact mode. If it holds fewer than 20, one comfortable density is sufficient.

---

## 2. Pagination & Data Loading

How users navigate through large datasets.

| Pattern | Best For | Avoid When |
| :--- | :--- | :--- |
| **Numbered Pagination** | Datasets where users need to locate items by position or jump to arbitrary pages. Admin tables, search results where total count matters. | Goal-oriented browsing (users rarely say "page 7 of dresses"). |
| **"Load More" button** | Moderately sized datasets where users want control. Search results on mobile, activity feeds. | The button becomes a repetitive tax if clicked 10+ times. |
| **Infinite Scroll** | Feeds, discovery, casual browsing — content consumption without a natural end. Social feeds, product catalogs. | When a footer contains essential links — infinite scroll makes it unreachable. |
| **Virtual Scrolling** | 10,000+ rows where rendering all DOM nodes kills performance. Log viewers, large tables. | When every row must be in the DOM for Ctrl+F find or accessibility. |

### Anti-Patterns

- **Infinite scroll + footer:** If your footer has navigation, legal links, or contact info, do not use infinite scroll. Users will never reach it.
- **Numbered pagination with no total count:** Users can't decide whether to refine their search or keep paging.
- **"Load more" as disguised infinite scroll:** Load a generous batch (20–50 items), not just enough to require another immediate click.

---

## 3. Search & Filtering

### Search Box Placement

| App Type | Placement | Rationale |
| :--- | :--- | :--- |
| **Content-heavy / discovery** (YouTube, Spotify) | Prominent, centered, top-of-page | Search is the primary navigation method. |
| **Tool / SaaS** (Linear, Notion, Stripe) | Top bar or sidebar + `Cmd+K` command palette | Search is one of several methods; power users use the keyboard shortcut. |
| **Data-heavy admin** (tables, analytics) | Above the table, paired with filters | Search refines what's already visible. |

### Filter Patterns

| Pattern | Best For |
| :--- | :--- |
| **Inline filter bar** (above content) | 2–5 filter criteria that are frequently changed. GitHub issues: search + label + assignee. |
| **Faceted sidebar** | 6+ filter dimensions where users explore by progressively narrowing. E-commerce: category, price, brand, size, color, rating. |
| **Filter within column header** | Table data where each column has a distinct filter type. Text contains, number range, date range, multi-select for status. |
| **Instant search (type-to-filter)** | Filtering an in-memory list by text. Command palette, emoji picker. Filter on every keystroke — no "Search" button. |
| **Submitted search** | Backend queries too slow/expensive for per-keystroke. Full-text search across millions of documents. |

### Filter Best Practices

- **Show active filter count** on the filter button ("Filters (3)") so users know why results are constrained.
- **"Clear all filters"** must be one action. Never force clearing one filter at a time.
- **Persist filters in the URL** (`?status=open&assignee=me`) so filtered views are shareable and bookmarkable.
- **Don't hide filters behind a separate page.** Inline filters let users see results change immediately.

---

## 4. Detail & Preview Patterns

How to show more information about an item without full navigation.

| Pattern | Best For |
| :--- | :--- |
| **Master-Detail (Split Panel)** | Lists where users frequently inspect items without editing. Email (inbox + reading pane), file browsers, CRM contact lists. |
| **Expandable Row / Accordion Row** | Tables where occasional rows need deeper inspection. Shipping tracking, invoice line items. |
| **Popover Preview / Hover Card** | Glance-level preview of a linked entity. Hovering a user avatar shows a mini-profile; hovering a link previews metadata. |
| **Side Panel / Drawer** | Drilling into a list item's full details with editing capability. Linear's issue detail panel. |
| **Full Page Detail** | Complex entities with sub-sections, tabs, or sub-navigation. Project dashboard, user profile. |

### The Preview Decision Tree

```
Can the user decide with just a glance?
  Yes → Popover / Hover Card
  No → Do they need to compare multiple items side-by-side?
    Yes → Master-Detail (Split Panel)
    No → Do they need to edit the item?
      Yes → Drawer or Side Panel
      No → Expandable Row
```

---

## 5. Content Organization

How to structure content sections on a page.

### Tabs vs. Accordions vs. Progressive Disclosure

| Pattern | Best For | Avoid When |
| :--- | :--- | :--- |
| **Horizontal Tabs** | 2–6 parallel views at the same conceptual level. Settings pages, dashboard sub-views. | More than ~6 tabs (they wrap, scroll, or degrade to a "More" dropdown). |
| **Vertical Tabs (Sidebar Tabs)** | 5–15 sections, especially with long labels or nested sub-sections. | Fewer than 5 sections (wasted sidebar space). |
| **Accordion** | Long-form content where users need one section at a time. FAQs, docs navigation. | Most users need to see multiple sections simultaneously. |
| **Collapsible Sections** | Dense pages where some sections are secondary. Expand all by default; let users collapse what they don't need. | Every section is essential (collapse adds friction). |
| **Progressive Disclosure** | Feature-rich UIs where most users only need the basics. "Show advanced options" link. | Power users are the primary audience — they'll resent every click to reveal what they use daily. |

### Tab Rules of Thumb

- **Tabs should be peers, not a hierarchy.** "Overview" and "Billing" are peers. "Settings → Security → API Keys" is a hierarchy (use sidebar + breadcrumbs).
- **Tab order must be stable.** Don't reorder dynamically based on usage — it destroys spatial memory.
- **Active tab state must be reflected in the URL** so deep-linking works.
- **Never nest horizontal tabs inside horizontal tabs.** Two ambiguous levels of selected state is visually confusing.

---

## 6. Navigation & Wayfinding

### Navigation Pattern Selection

```
      Flat hierarchy (2–5 sections)    ───►  Top Nav or Tab Bar
      Medium hierarchy (5–15 sections) ───►  Sidebar Navigation
      Deep hierarchy (15+, nested)     ───►  Sidebar + Sub-menus + Breadcrumbs
      Single-page, task-focused        ───►  Command Palette + minimal chrome
```

| Pattern | Best For | Key Weakness |
| :--- | :--- | :--- |
| **Top Nav Bar** | Consumer apps, marketing sites, SaaS with flat structure. | Doesn't scale past ~5 items. |
| **Sidebar (left)** | Tools, dashboards, consoles — utility-dense applications. | Consumes ~200–280px horizontal; collapsible sidebar mitigates this. |
| **Bottom Tab Bar** | 3–5 primary destinations on mobile. | Not appropriate for desktop. |
| **Command Palette** | Power-user applications where speed matters. `Cmd+K` in Linear, Vercel, Stripe. | Discoverability is poor — must complement visible navigation. |
| **Breadcrumbs** | Any hierarchy deeper than 2 levels. | Complement to primary nav — wayfinding, not browsing. |

### Breadcrumb Rules

- Show the full path: `Settings > Security > API Keys`. The current page is last and not a link.
- Truncate the middle with "..." only when path exceeds one line: `Home > ... > API Keys`
- Breadcrumbs complement the sidebar — they don't replace it.

---

## 7. Truncation & Overflow

| Scenario | Pattern |
| :--- | :--- |
| **Single-line text in constrained cell** | CSS `text-overflow: ellipsis` + tooltip on hover (300ms delay to avoid flicker). |
| **Multi-line text (description preview)** | Line clamp (2–3 lines) + "Show more" expand inline. |
| **Long unbroken strings (URLs, IDs)** | **Mid-truncation**: `"very-long-uuid...a1b2c3d4"` preserves distinctive start and end. |
| **Overflowing horizontal tabs/chips** | Scrollable container with fade gradient on trailing edge, or "+N more" dropdown. |
| **Overflowing table columns** | Collapse secondary columns first. Let users resize/reorder. Never force page-level horizontal scroll. |
| **Avatar/initials list** | Show first 3–5 + "+N more" avatar with tooltip on hover/click. |

---

## 8. View Toggles & Mode Switching

When the same data benefits from multiple visual perspectives:

- **Offer a view toggle** (List ↔ Grid ↔ Board ↔ Calendar) when the data naturally supports multiple mental models.
- **Persist the user's last choice per context.** If they chose "Board" for Project A, don't revert to "List" on next visit.
- **Show the toggle as a segmented control or icon button group**, not a dropdown. Options should be visible for discovery.
- **Edit Mode vs. View Mode:** Inline-edit-on-click for document-like content (Notion, Linear issue titles). Explicit "Edit" button → form for structured records read 50× more often than edited.

---

## Review Format (Required)

When reviewing UI layouts, you MUST use this structure:

1. **Current State Summary:** What patterns are in use? Data density, user goal, task frequency.
2. **Finding → Recommendation Table:**

| # | Current | Issue | Recommendation | Why |
| :--- | :--- | :--- | :--- | :--- |
| 1 | 4-item card grid | Barren, over-structured for so few items | Simple list with metadata | Lower chrome-to-content ratio for small datasets |
| 2 | Infinite scroll on docs site | Footer unreachable | Numbered pagination or "Load more" | Footer contains legal/contact links users need |
| 3 | 8 horizontal tabs | Wrapping to second line, unclear hierarchy | Vertical sidebar tabs | Scales better; allows longer labels |

3. **Ergonomic Rationale:** 2–4 sentences on the core UX principle driving these recommendations.