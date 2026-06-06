---
name: ui-visual-hierarchy
description: Establish clear visual hierarchy in UI — using size, weight, color, position, and spacing to guide the user's eye to what matters most. Decision frameworks for the squint test, content chunking, progressive disclosure, scanning patterns (F-pattern, Z-pattern), and making primary content visually dominant. For typographic hierarchy specifically, see ui-typography. For page-level layout, see ui-layouts.
---

# UI Visual Hierarchy — Guiding the Eye

A decision engine for establishing visual hierarchy — ensuring the most important content is visually dominant and the user's eye flows through the page in the right order. For typography-specific hierarchy (sizes, weights, line heights), see `ui-typography`. For page-level zone arrangement, see `ui-layouts`.

## Initial Response

When this skill is first invoked without a specific request, respond only with:

> I'm ready to help you establish visual hierarchy. Tell me about the page or component — what's the most important thing the user should see first, and what do they come here to do?

Do not provide any other information until the user asks a question or presents a UI to review.

---

## 1. The Squint Test

The squint test is the single most useful hierarchy check: squint at the page until details blur. What still stands out? That's what a first-time visitor's eye will catch.

**A page passes the squint test when:**
- The primary heading or title is the most visually prominent element
- The primary action (CTA, create button) is clearly visible
- Sections are distinguishable as distinct blocks
- Nothing unintended grabs attention (a bright icon, a colorful badge, a heavy border)

**Common squint test failures:**
- Secondary information (timestamps, metadata, badge counts) is as visually heavy as primary content
- A colorful illustration or icon draws the eye before the heading
- All sections have equal visual weight — nothing reads as "start here"
- The sidebar or navigation chrome is visually heavier than the content

**How to fix:** Increase the visual weight of what should dominate, or decrease the weight of what shouldn't. Don't try to make everything prominent — hierarchy is about contrast.

### Prefer De-Emphasis First

When everything competes, demote secondary elements before making the primary element louder. Reducing metadata size, muting borders, softening icons, or simplifying badges often improves hierarchy more than making the title bigger.

Use this order:
1. Remove unnecessary emphasis from tertiary elements.
2. Reduce color, contrast, border weight, or shadow from secondary elements.
3. Increase size, weight, or position of the primary element only if it still does not dominate.

---

## 2. The Four Levers of Visual Weight

Every element has visual weight. To establish hierarchy, manipulate these four levers:

### Size

Larger elements have more weight. This is the strongest lever.

| Technique | Example |
| :--- | :--- |
| Page title at 30px, body at 16px | The title dominates immediately |
| Primary CTA button 20% larger than secondary | Clear which action is primary |
| KPI number at 32px, label at 12px | The metric, not the label, is what matters |

**Rule:** The size difference must be obvious. 30px vs 28px reads as a mistake, not a hierarchy.

### Weight (Boldness)

Bolder text draws the eye. Use weight differences within the same size to create a secondary hierarchy.

| Technique | Example |
| :--- | :--- |
| Card title semibold, body regular | The title announces what the card is about |
| Table column header medium, cell text regular | Headers read as labels, not data |
| Active nav item semibold, inactive regular | The current location is clear |

**Rule:** One weight step (regular → medium, 400 → 500) is subtle. Two steps (regular → semibold, 400 → 600) is clear. Choose the right contrast.

### Document vs. Visual Hierarchy

Semantic heading structure and visual hierarchy are related but not identical. Use semantic HTML for document structure, then style headings and labels to match the user's scanning needs.

Example: a card title may be visually prominent without becoming an `h1`; a page `h1` may be visually restrained in a dense tool if the primary task is the table or editor below it.

### Color & Contrast

High-contrast elements demand attention; low-contrast elements recede.

| Technique | Example |
| :--- | :--- |
| Primary text near-black (`#111`), secondary text medium-gray (`#666`) | Eye goes to primary first |
| Primary button filled with brand color, secondary button outlined | Clear action hierarchy |
| Active state with a colored left-border, inactive without | The current section is instantly identifiable |

**Rule:** Color should reinforce the hierarchy that size and weight establish, not compete with them. A 12px red error message can overpower a 24px heading if the heading is muted gray.

### Position & Space

Elements at the top and left of a page are seen first (F-pattern scanning). Elements with surrounding whitespace draw attention.

| Technique | Example |
| :--- | :--- |
| Most important content top-left | Matches natural F-pattern scanning |
| Primary CTA in the top-right of a card header | After scanning the title, the eye goes to the top-right action |
| Isolate a critical metric with ample whitespace | The whitespace says "this is important" before the user reads the number |

**Rule:** If everything has whitespace around it, nothing does. Whitespace creates emphasis through contrast with density.

---

## 3. Content Chunking

Users don't read pages — they scan chunks. Breaking content into clear, labeled chunks makes it scannable.

### How to Chunk

1. **Group related items visually.** Items that belong together should be closer to each other than to items outside the group (Gestalt proximity).
2. **Label each chunk.** A heading, a section title, or a card header tells the user what this chunk contains without reading the body.
3. **Separate chunks clearly.** Use whitespace, cards, dividers, or background color changes. The boundary between chunks should be obvious.

```
Bad (unchunked):

User Settings
Name: [____]
Email: [____]
Timezone: [____]
Notify me about: [ ] Comments [ ] Mentions [ ] Invites
API Key: sk-abc123...
Delete Account [Delete]

Good (chunked):

Profile
Name: [____]
Email: [____]
Timezone: [____]

Notifications
Notify me about:
[ ] Comments
[ ] Mentions
[ ] Invites

API
API Key: sk-abc123... [Regenerate]

Danger Zone
Delete Account [Delete]
```

### Chunk Size

- **3-7 items per chunk** is the sweet spot. This maps to working memory limits (Miller's Law).
- If a chunk has 10+ items, consider splitting it into sub-chunks.
- If a chunk has 1-2 items, consider whether it deserves to be a separate chunk or can merge with a neighbor.

### Chunking Patterns

| Pattern | When to Use | Example |
| :--- | :--- | :--- |
| **Cards** | Each chunk is a self-contained unit with its own title, content, and optionally actions | Dashboard widgets, search results, product listings |
| **Sections with headings** | Chunks are sequential and read top-to-bottom | Settings pages, detail pages, long-form content |
| **Tabs** | Chunks are mutually exclusive views of the same context | Detail page tabs (Overview, Activity, Settings) |
| **Accordion / Collapsible** | Chunks are secondary and the user only needs one at a time | FAQs, advanced settings, documentation nav |

### Labels Are a Last Resort

If a value can be understood from context, position, formatting, or grouping, do not add a label just to be explicit. Labels add visual noise and can make every row or card feel heavier.

Use labels when:
- the value is ambiguous without one
- multiple nearby values could be confused
- accessibility or data interpretation depends on explicit naming

Prefer recognizable formatting for common values: currency, dates, counts, avatars, status badges, and units.

---

## 4. Progressive Disclosure

Show the most important information first. Reveal details on demand. Don't show everything at once.

### When to Hide (and How to Reveal)

| What to Hide | Reveal Trigger | Example |
| :--- | :--- | :--- |
| **Advanced settings** | "Show advanced" link or toggle | Form fields that 80% of users never need |
| **Secondary metadata** | Hover, expand, or detail page | Full timestamp on hover, item count in a tooltip |
| **Detailed explanations** | Info icon with tooltip, or expandable inline | "What's this?" next to a setting label |
| **Rarely-used actions** | Overflow menu (`···`) | Copy ID, Duplicate, Export as JSON |
| **Additional list items** | "Show all N items" link | Show first 5, reveal rest on click |

### What to Always Show

- **Primary content** — hiding the main thing the user came for defeats the purpose
- **Critical status** — errors, warnings, and state indicators must be immediately visible
- **Primary actions** — the 1-2 most common actions per context
- **Navigation cues** — where am I, how do I get back, what can I do next

### The "Above the Fold" Test

Everything visible without scrolling is "above the fold." It should answer:
- What page is this?
- What can I do here?
- Is there anything I need to do right now?

If these questions aren't answered above the fold, the page has a hierarchy problem.

---

## 5. Scanning Patterns

Users scan before they read. Design for the scanning pattern that matches the content.

### F-Pattern (Text-Heavy Pages)

```
→ → → → → → → → → → → → → → →
→ → → → → → →
→ → → → →
        ↓
```

Users read the first line fully, then less of each subsequent line, creating an F shape. This is the default for text-heavy pages (articles, documentation, search results).

**Design for F-pattern:**
- Put the most important words in the first few words of headings and list items — that's what gets read.
- Start paragraphs with the key point.
- Use bold on key terms — they catch the eye during vertical scanning.

### Z-Pattern (Visual/Landing Pages)

```
→ → → → → → → → → → → → → → →
                              ↓
← ← ← ← ← ← ← ← ← ← ← ← ← ← ←
↓
→ → → → → → → → → → → → → → →
```

Users scan across the top, diagonally down, then across the bottom. Common on pages with less text — landing pages, dashboards.

**Design for Z-pattern:**
- Top-left: logo/brand
- Top-right: primary CTA
- Diagonal: supporting visual or content
- Bottom-left: secondary content
- Bottom-right: secondary CTA

### Layer-Cake Pattern (Headings + Content)

Users scan headings and skip body text until a heading catches their interest. This is how most people read web content — not linearly, but by hopping between headings.

**Design for layer-cake:**
- Headings must be meaningful on their own. "Overview" means nothing. "Q2 Revenue Up 18%" tells a story.
- Headings should be visually distinct from body text — size, weight, and spacing should make headings obvious at scanning speed.
- Place key information in headings, not buried in paragraphs.

---

## 6. Establishing Primary-Secondary-Tertiary

Every UI element fits into one of three tiers. The tiers must be visually distinct.

| Tier | Role | Visual Treatment | Examples |
| :--- | :--- | :--- | :--- |
| **Primary** | What the user needs to see or act on first | Largest, boldest, highest contrast, most whitespace | Page title, CTA button, KPI metric, error alert |
| **Secondary** | Supporting information the user looks for next | Medium weight/size, medium contrast | Section headings, card titles, form labels, data values |
| **Tertiary** | Detail that's nice to have but not essential | Small, light weight, low contrast | Timestamps, IDs, metadata, captions, help text |

**The test:** Can the user find the primary elements without reading any secondary text? Can they find secondary elements without reading tertiary text? If not, the tiers aren't visually distinct enough.

**Common failure:** Everything at secondary weight. When nothing is primary, the user must read everything to find what matters.

---

## 7. Visual Weight of Actions

Not all actions are equal. Their visual weight should match their importance.

| Action Priority | Visual Treatment | Example |
| :--- | :--- | :--- |
| **Primary** | Filled button, brand color, largest in the group | "Create Invoice", "Save", "Buy Now" |
| **Secondary** | Outlined button or text button, same size or slightly smaller | "Cancel", "Save as Draft", "Preview" |
| **Tertiary** | Text link or icon button, smaller | "Learn more", "Export CSV", "Copy Link" |
| **Destructive** | Filled red or outlined red, visually distinct from primary | "Delete", "Remove", "Close Account" |

**Rules:**
- One primary action per context. If you have two filled, colored buttons side by side, neither is primary.
- Destructive actions should not use the brand color — they need their own visual treatment so users don't click by habit.
- If every action in a row is a filled button, none of them have hierarchy. Use outline and text variants to create tiers.

---

## 8. Common Hierarchy Failures

| Problem | Why It Happens | Fix |
| :--- | :--- | :--- |
| **Everything competes** | Features accumulated; each was added with "normal" prominence, and now the page has 12 "normal" things | Identify the 1-2 primary elements; demote everything else to secondary/tertiary |
| **The chrome is louder than the content** | The sidebar has heavy icons, bold labels, and bright active states | Reduce sidebar visual weight: smaller text, lighter colors, subtle active indicators |
| **Status badges overwhelm the data** | Every row has a colored badge, creating a rainbow of competing signals | Use muted colors for common statuses; reserve bright colors for states that need attention |
| **Equal spacing creates ambiguity** | Every section has the same 32px gap, so nothing is grouped | Use proximity: 16px within groups, 32-48px between groups |
| **Metadata at the same weight as content** | Timestamps, IDs, and counts use the same font size and color as titles and values | Metadata always gets a smaller size AND a lighter color — both, not one |

---

## Review Format (Required)

When reviewing visual hierarchy, you MUST use this structure:

1. **Current State Summary:** What's the most visually dominant element? Does it match the user's primary goal? Run the squint test.
2. **Finding → Recommendation Table:**

| # | Current | Issue | Recommendation | Why |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Timestamps at 14px semibold — same weight as card titles | Secondary data competes with primary content | Reduce timestamps to 12px regular, muted color | Metadata should never have the same visual weight as content the user needs to scan for |
| 2 | Three filled blue buttons in the same card header | No action hierarchy — user must read all three labels to decide | One filled "Edit" button + "Duplicate" and "Archive" as text buttons | Primary action should be visually distinct from secondary actions |
| 3 | 8 sections on settings page with equal visual weight | Nothing stands out; user must read all section titles | Group into 3 logical categories with category headings | Chunking reduces the scanning burden from 8 items to 3 groups |

3. **Ergonomic Rationale:** 2-4 sentences on the core hierarchy principle driving these recommendations.
