---
name: ui-layouts
description: Select the right page-level layout pattern. Decision frameworks for app shell vs centered content vs dashboard grid vs marketing layout, page chrome placement (headers, sidebars, breadcrumbs), content area zoning, and a catalog of standard page types with their anatomy (list page, detail page, settings page, dashboard, landing page). For data display patterns within a layout, see ui-patterns. For form containers, see ui-forms.
---

# UI Layouts — Page Structure & Composition

A decision engine for choosing the right page-level layout, arranging content zones, and composing pages from building blocks. For data display patterns within a zone (tables, cards, lists), see `ui-patterns`. For form container decisions (modal vs drawer vs page), see `ui-forms`. For spacing between zones, see `ui-spacing`.

## 1. Page Layout Patterns

Every page has a primary layout pattern. The choice starts with understanding the app type and the page's role within it.

### Feature-First Rule

Do not start a new product UI by designing the app shell. Start with one concrete feature or user task, then choose the surrounding layout after the content, actions, and navigation needs are known.

**Use this sequence:**
1. List the fields, content, controls, and states the feature needs.
2. Arrange the feature so the primary task works without global chrome.
3. Add page header, context bar, navigation, and app shell only when the feature reveals a real need for them.

This prevents agents from producing attractive but hollow layouts: oversized nav, decorative dashboards, and page chrome before the actual workflow is understood.

### The Layout Decision Tree

```
What kind of app is this?
  ├─ Tool / SaaS / Dashboard ──► App Shell
  ├─ Marketing / Content site ──► Marketing Layout
  ├─ Simple utility (1-2 functions) ──► Centered Single-Column
  └─ Mixed ──► see Boundary Cases below

What is this specific page's role?
  ├─ Browse/search a collection ──► List/Index layout
  ├─ View one item in detail    ──► Detail layout
  ├─ Create or edit an entity   ──► Form layout (see ui-forms)
  ├─ Monitor status at a glance ──► Dashboard layout
  ├─ Configure settings         ──► Settings layout
  └─ Inform or convert          ──► Marketing/Landing layout
```

### Boundary Cases

| Situation | Use | Avoid |
| :--- | :--- | :--- |
| **Small SaaS with 2-4 sections** | Top navigation + content area | Full app shell with a large sidebar |
| **Marketing site with an authenticated product area** | Marketing layout for public routes; app shell after sign-in | Mixing marketing sections into the authenticated tool chrome |
| **Content-heavy product with search as primary task** | Prominent search + list/index layout | Dashboard grid full of summary cards |
| **Single-purpose internal tool** | Centered or full-width task layout with minimal chrome | Decorative landing page or multi-section app shell |
| **Mobile-first app with 3-5 primary destinations** | Bottom tab bar on mobile; simple top nav or sidebar on desktop | Hiding every primary destination in a hamburger menu |
| **Unclear app shell because only one feature exists** | Design the feature first; revisit shell after 2-3 core workflows | Premature sidebar, dashboard, or marketing-style wrapper |

### Primary Layout Patterns

| Pattern | Structure | Best For | Key Signal |
| :--- | :--- | :--- | :--- |
| **App Shell** | Persistent header + sidebar + content area. Sidebar may collapse. | Tools, dashboards, SaaS apps with 5+ navigation sections. | The user navigates between many sections frequently. |
| **Centered Single-Column** | Content in a narrow column (600-800px), centered on the page. | Simple utilities, auth pages, reading-focused pages, privacy policies. | The page has one focused task with no need for persistent nav chrome. |
| **Two-Column** | Sidebar (filters, nav, or metadata) + main content. | Search results with facets, documentation with nav, detail views with metadata sidebar. | The secondary column is essential context for the primary content. |
| **Dashboard Grid** | Widgets/cards arranged in a responsive grid, often with drag-to-reorder. | Monitoring dashboards, analytics, home pages that aggregate data from multiple domains. | The user needs to scan multiple unrelated summaries at once. |
| **Marketing Layout** | Full-width sections stacked vertically: hero, features, testimonials, CTA, footer. | Landing pages, marketing sites, product pages. | Content tells a linear story; user scrolls to consume it. |
| **Split Screen** | Two equal panels side-by-side. | Compare views, diff tools, translation interfaces. | The user needs to reference two things simultaneously and equally. |

### Pattern Details

#### App Shell

```
+------------------------------------------+
| Header: logo, nav, search, user menu     |
+--------+---------------------------------+
|        |                                 |
| Sidebar| Content Area                    |
|        | (scrolls independently)         |
|        |                                 |
+--------+---------------------------------+
```

- **Sidebar:** 200-280px wide. Contains primary navigation sections, optionally collapsible to icons-only (~60px). Active section is highlighted.
- **Header:** 48-64px tall. Contains app identity, global search, command palette trigger, user menu. Stays fixed or scrolls with content — fixed is more common for tools.
- **Content area:** Fills remaining space. Scrolls independently from sidebar and header. Padding: 24-32px.

**When the app shell is right:** The app has 5+ navigation destinations that the user switches between frequently. The sidebar provides persistent access without requiring back-button navigation.

**When the app shell is wrong:** The app has 2-3 sections. The sidebar wastes 200+ pixels of horizontal space that could be used for content. Use top navigation instead.

#### Centered Single-Column

```
+------------------------------------------+
|                                          |
|          +------------------+            |
|          |                  |            |
|          | Content (600px)  |            |
|          |                  |            |
|          +------------------+            |
|                                          |
+------------------------------------------+
```

- Content max-width: 600-800px, centered with `margin: auto`.
- No persistent navigation chrome — maybe a minimal header with a logo and a back link.
- The focus is entirely on the content. No competing UI elements.

**Best for:** Login/signup pages, password reset, simple single-purpose tools (JSON formatter, QR code generator), reading-focused pages (terms of service, documentation articles).

#### Dashboard Grid

```
+------------------------------------------+
| [Stat Card] [Stat Card] [Stat Card] [Card]|
|                                          |
| [Big Chart                   ] [Activity]|
| [                           ] [Feed     ]|
| [                           ] [         ]|
|                                          |
| [Table or List                          ]|
| [                                      ]|
+------------------------------------------+
```

- Content arranged in a CSS Grid or flexbox grid. Cards span 1-4 columns of a 12-column grid.
- Full-width sections (tables, big charts) span all columns.
- Most important metrics go top-left (F-pattern scanning entry point).
- Responsive: 4 columns on desktop → 2 on tablet → 1 on mobile.

**Best for:** Home pages that aggregate data from multiple domains, analytics dashboards, monitoring overviews.

**Avoid when:** The page is primarily a list or a detail view. A dashboard layout for a list of items wastes space and forces scrolling where a table would be more efficient.

---

## 2. Page Chrome Patterns

Chrome is the persistent UI that frames the content — headers, sidebars, breadcrumbs, footers.

### Header

| App Type | Header Content | Height | Behavior |
| :--- | :--- | :--- | :--- |
| **SaaS Tool** | Logo, global search, command palette, user menu | 48-56px | Fixed or sticky |
| **Marketing Site** | Logo, nav links, CTA button | 64-80px | Sticky on scroll |
| **Simple Utility** | Logo + maybe a back link | 40-48px | Static |
| **Mobile App** | Back button, page title, primary action | 44-48px | Fixed top |

**Header rules:**
- Don't put page-level actions (filters, date pickers) inside the global header. These belong in the content area, near the data they affect.
- The header should not grow past ~80px — if it needs more content, it's becoming a content zone, not chrome.
- On scroll, a sticky header should stay the same height, not expand. Unexpected header size changes are disorienting.

### Sidebar

```
Section 1
  ├─ Item A
  ├─ Item B
Section 2
  ├─ Item C
  ├─ Item D
```

- Group navigation items into labeled sections. Each section has a subtle header.
- 5-15 items: full-width sidebar (200-280px). 15+: add collapsible sections or a search field at the top.
- Active item highlighted with a background color or left-border accent.
- Icons should be consistent in size and style. They help scanning but the text label is the primary identifier — never icon-only for navigation items.

### Breadcrumbs

- Show the full path: `Projects > API Migration > Settings`
- The current page is the last item and is not a link.
- Truncate middle with "..." only when the path exceeds one line width.
- Breadcrumbs complement primary navigation — they don't replace it.

### Footer

- **Tool/SaaS apps:** Footer usually omitted from the app shell — the content area scrolls infinitely. Legal links, if needed, go in settings or a user menu.
- **Marketing sites:** Footer is essential — contains navigation links, legal, contact, social. Full-width, muted background.
- **Simple utilities:** Either no footer or a minimal one-line footer with a copyright and a link.

---

## 3. Content Area Zoning

A page's content area is not a blank canvas — it has zones with predictable roles.

### Zone Hierarchy (Top to Bottom)

| Zone | Purpose | Example Contents |
| :--- | :--- | :--- |
| **Page Header** | Identifies the page and provides top-level actions | Page title, description, primary CTA, view toggles |
| **Context Bar** (optional) | Refines or filters the content below | Filters, search, date range picker, tabs |
| **Primary Content** | The main thing the user came here for | Data table, card grid, detail view, form, chart |
| **Secondary Content** (optional) | Supporting information or related actions | Metadata panel, activity feed, related items |
| **Page Footer** (rare in tools) | Pagination, legal, or end-of-content marker | Pagination controls, "End of results" message |

### Page Header Best Practices

The page header answers three questions immediately:
1. **Where am I?** — Page title
2. **What can I do here?** — Primary action button
3. **What am I looking at?** — Brief description or item count

```
+------------------------------------------+
| Invoices                          [New]  |  ← Title + primary action
| 24 invoices · Last updated 2 min ago     |  ← Description/metadata
+------------------------------------------+
```

**Anti-patterns:**
- Title-only headers with no action or context — the user doesn't know what they can do.
- Headers that consume 120+ vertical pixels — the content is what matters, not the header.
- Headers that repeat information already visible in the sidebar or breadcrumbs.

### Context Bar Placement

Context controls (filters, search, tabs, view toggles) live between the page header and the primary content. They refine what appears below.

- **Place above the content, not inside it.** Filters inside a card imply they only affect that card.
- **Keep to one line on desktop** — a context bar that wraps to 2-3 lines on a wide screen is too heavy. Consolidate or move advanced filters to a collapsible panel.
- **Tabs in the context bar** when they switch between views of the same entity. Filters in the context bar when they refine a single view.

---

## 4. Standard Page Types

Most app pages fall into one of these archetypes. Each has a standard anatomy.

### List / Index Page

```
+------------------------------------------+
| Invoices                          [New]  |
| 24 invoices · Sorted by date             |
+------------------------------------------+
| [Search...]  [Status ▼] [Date ▼] [...]  |  ← Context bar
+------------------------------------------+
| [ ] Client       Amount   Status   Due   |  ← Data table or card grid
| [ ] Acme Corp    $1,500   Paid     May 1 |
| [ ] Globex       $3,200   Overdue  Apr 15|
| ...                                      |
+------------------------------------------+
| 1 2 3 ... 8         24 results           |  ← Pagination
+------------------------------------------+
```

**Anatomy:**
1. Page header: title, item count, primary CTA (Create/Add)
2. Context bar: search, filters, sort, view toggle (table/card/board)
3. Primary content: data table or card grid (see `ui-patterns`)
4. Pagination or infinite scroll (see `ui-patterns`)

**When this fits:** The user's goal is to find a specific item, compare items, or monitor the collection. This is the most common page type in SaaS apps.

### Detail Page

```
+------------------------------------------+
| ← Back to Invoices                       |
| Invoice #1234                    [Edit]  |
+------------------------------------------+
| Status: Paid  |  Client: Acme Corp       |
| Amount: $1,500|  Due: May 1, 2026       |
+------------------------------------------+
| Line Items                               |
| Design ........... $500                  |
| Development ..... $1,000                 |
+------------------------------------------+
| Activity                                 |
| May 1 - Invoice paid                     |
| Apr 15 - Invoice sent                    |
+------------------------------------------+
```

**Anatomy:**
1. Back navigation + page title + Edit action
2. Summary/metadata section — the key facts at a glance
3. Primary detail sections — line items, description, related entities
4. Activity/timeline (optional) — chronological events for this entity

**Layout options:**
- **Stacked sections** (most common) — sections flow top-to-bottom. Best when each section needs full width.
- **Two-column detail** — summary in left column, activity in right column. Best when there are exactly two types of information and both benefit from being visible simultaneously.
- **Tabbed detail** — sections behind tabs. Best when there are 3+ distinct sections and the user typically only needs one at a time. The first tab (Overview/Summary) shows the most important information and loads by default.

### Settings Page

See `ui-forms` for settings organization by item count. Layout conventions:

```
+------------------------------------------+
| Settings                          [Save] |
+------------------------------------------+
| [General]  | Profile                     |
| [Security] | ┌─────────────────────────┐ |
| [Billing]  | │ Name    [_________]    │ |
| [Team]     | │ Email   [_________]    │ |
|            | └─────────────────────────┘ |
+------------------------------------------+
```

- **30+ settings:** Sidebar nav with categories on the left, settings panel on the right. The sidebar is secondary chrome — narrower than the app sidebar, typically 180-240px.
- **10-30 settings:** Grouped sections on one scrollable page, with optional anchor links in a sticky sidebar.
- **<10 settings:** Single flat page with labeled sections.

### Dashboard Page

```
+------------------------------------------+
| Dashboard                                |
+------------------------------------------+
| [Metric A] [Metric B] [Metric C] [Metric]|
|                                          |
| [Chart: Revenue over time        ]       |
| [                               ]       |
+------------------------------------------+
| Recent Activity                [View all]|
| ● User X created invoice #1234  2m ago  |
| ● Payment received for #1233   10m ago  |
+------------------------------------------+
```

**Anatomy:**
1. Minimal page header — title, date range selector, maybe an export action
2. KPI/metric cards in a row (2-4 cards)
3. Primary chart or visualization
4. Secondary sections: recent activity, top items, status summaries

**Dashboard rules:**
- Each card/widget should be independently understandable. The user shouldn't need to read card A to understand card B.
- Metrics should answer questions, not just display numbers. "$12,450 revenue" is a number. "$12,450 revenue · ↑ 18% vs last month" answers a question.
- Provide drill-down: clicking a metric card or chart section should navigate to the relevant detail page.
- Avoid dashboard-only data — if a metric matters enough to be on the dashboard, there should be a page where the user can explore it in depth.

### Landing / Marketing Page

```
+------------------------------------------+
| Logo      Features  Pricing  Docs  [CTA] |  ← Nav
+------------------------------------------+
|                                          |
|        Hero: Headline + Subtext          |
|        [Primary CTA] [Secondary]         |
|                                          |
+------------------------------------------+
| Feature Section 1 (image left, text right)|
+------------------------------------------+
| Feature Section 2 (text left, image right)|
+------------------------------------------+
| Testimonials / Social Proof              |
+------------------------------------------+
| Pricing Table                            |
+------------------------------------------+
| Final CTA Section                        |
+------------------------------------------+
| Footer: links, legal, social             |
+------------------------------------------+
```

**Anatomy:**
1. Navigation bar: logo, section links, CTA button
2. Hero: headline, subtext, primary CTA, optional product screenshot/illustration
3. Feature sections: 3-5 alternating sections, each making one point
4. Social proof: testimonials, logos, metrics ("10,000+ teams use...")
5. Final CTA: restate the value proposition, prominent CTA button
6. Footer: navigation links, legal, social

**Content rules for marketing pages:**
- Each section should communicate one idea. If a section has 3 paragraphs and 2 images, split it.
- CTAs should be specific: "Start building" or "View pricing", not "Learn more" (too vague).
- The hero should explain what the product does in 5 seconds or less.

---

## 5. Content Area Sizing

### Max-Width Guidelines

| Content Type | Max-Width | Rationale |
| :--- | :--- | :--- |
| **Reading / long-form text** | 600-720px | Optimal line length for readability (60-80 characters) |
| **Forms (single-column)** | 480-640px | Keeps fields scannable, prevents labels from disconnecting from inputs |
| **Data tables** | Fill available width | Tables need horizontal space for columns |
| **Card grids** | 1200-1400px | Cards need room for 3-4 per row on desktop |
| **Dashboard widgets** | Fill available width | Widgets should use available space |
| **Marketing content** | 1100-1200px | Wide enough for side-by-side feature sections |

### Content Padding

- **App shell content area:** 24-32px padding on all sides
- **Centered single-column on mobile:** 16px padding
- **Card grids within content area:** no additional padding — the content area padding is sufficient
- **Sections within a page:** 32-48px vertical gap between major sections

### Don't Fill Space by Default

Full-width is not automatically better. If content becomes harder to scan when stretched, constrain it:

- Forms, settings, and readable text should use max-widths.
- Tables, dashboards, and dense grids can fill available width when comparison benefits from horizontal space.
- Empty side areas are acceptable when they preserve readability and focus.

---

## 6. Scroll Behavior

| Pattern | Use When | Implementation |
| :--- | :--- | :--- |
| **Page scrolls as one unit** | Simple pages, marketing sites, dashboards | Default browser behavior |
| **Fixed header, scrollable content** | App shell, list pages where filters should stay visible | `position: sticky; top: 0` on header |
| **Fixed sidebar, scrollable content** | App shell | Sidebar `position: fixed` or `sticky`, content area scrolls independently |
| **Fixed header + fixed sidebar** | Full app shell | Both fixed, content area is the only scrollable region |
| **Scrollable panels** | Master-detail views, settings with sidebar nav | Each panel has `overflow-y: auto` and its own scroll context |

**Rules:**
- Never have three independently scrolling regions on one page. Two is acceptable (sidebar + content); three is confusing.
- Fixed elements must account for the viewport height. A fixed header (56px) + fixed status bar (32px) leaves `100vh - 88px` for content.
- On mobile, avoid fixed elements except for a minimal top bar. Screen real estate is too scarce.

---

## 7. Responsive Layout Adaptation

For detailed responsive patterns, see `ui-responsive`. At the layout level:

| Desktop Pattern | Tablet (<1024px) | Mobile (<768px) |
| :--- | :--- | :--- |
| **App Shell (sidebar + content)** | Collapse sidebar to icons, or hide behind hamburger menu | Full-screen content, sidebar as overlay/drawer |
| **Two-Column** | Two columns (narrower) | Stack vertically (column 1 on top) |
| **Dashboard Grid** | 3-4 columns | 1-2 columns |
| **Centered Single-Column** | Centered (600-720px) | Full-width with 16px padding |
| **Split Screen** | Two equal panels | Switch to tabs or single-panel-with-toggle |

---

## Review Format (Required)

When reviewing page layouts, you MUST use this structure:

1. **Current State Summary:** What layout pattern is in use? What page type is this? What are the zones?
2. **Finding → Recommendation Table:**

| # | Current | Issue | Recommendation | Why |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Filters inside a card body | Controls appear to belong to card content | Move filters to context bar above primary content | Controls that affect all content below should live above, not inside, content cards |
| 2 | Two-column layout on a detail page with 5 sections | Columns force an arbitrary split; sections don't pair naturally | Stacked sections with optional tabs for secondary content | Stacked sections let each section take full width; tabs let user focus on one section at a time |
| 3 | Full app shell for a 3-page app | Sidebar wastes 240px of space for 3 nav items | Centered header with horizontal nav + full-width content | App shell is overhead for apps with shallow navigation |

3. **Ergonomic Rationale:** 2-4 sentences on the core layout principle driving these recommendations.
