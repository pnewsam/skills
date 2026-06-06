---
name: ui-spacing
description: Spacing and proximity principles for UI — consistent spacing rhythm, the proximity law (related things close, unrelated things apart), density decisions, negative space as a design element, and spacing by context (cards, forms, tables, page sections). For page-level zone arrangement, see ui-layouts. For typographic vertical rhythm, see ui-typography.
---

# UI Spacing — Rhythm, Proximity & Density

A decision engine for applying consistent, meaningful spacing throughout the UI. Covers spacing scales, the proximity principle, density modes, negative space, and context-specific spacing rules. For page-level layout and zone arrangement, see `ui-layouts`. For typographic spacing (line height, heading-to-body gaps), see `ui-typography`.

## Initial Response

When this skill is first invoked without a specific request, respond only with:

> I'm ready to help you with spacing — rhythm, proximity, density, or context-specific spacing decisions. What part of the UI are you working on, and what feels off about the spacing?

Do not provide any other information until the user asks a question or presents spacing to review.

---

## 1. The Spacing Scale

Use a defined spacing scale. Don't use arbitrary pixel values. Every gap, padding, and margin should come from the scale.

### Standard 4px-Based Scale

| Token | Value | Use |
| :--- | :--- | :--- |
| **1** | 4px | Minimal gap — icon-to-label, tight inline spacing |
| **2** | 8px | Close related items — items in a group, label-to-input |
| **3** | 12px | Related but distinct — between a checkbox and its label, small section gaps |
| **4** | 16px | Default spacing — card padding, form field gaps, list item gaps |
| **5** | 20px | Spacious default — larger card padding, button groups |
| **6** | 24px | Section separation — between related sections, content area padding |
| **8** | 32px | Major section breaks — between unrelated sections, page-level padding |
| **10** | 40px | Large section breaks — between page zones |
| **12** | 48px | Major page divisions — above/below large content blocks |
| **16** | 64px | Hero-to-section gap, major layout transitions |

**In Tailwind:** these map directly to `p-1` through `p-16` (multiply by 4px).

**The rule:** If a spacing value isn't on the scale, there should be a specific, intentional reason. "It looked better" isn't one — pick the nearest scale value.

### When to Use Which Size

```
4-8px:   Inside a component (icon-to-text, label-to-value, chip-to-chip)
12-16px: Between related elements (form fields, card content, list items)
24-32px: Between related sections (card groups, page sections in the same zone)
40-64px: Between page zones (header-to-content, content-to-footer, hero-to-features)
```

### Start Roomy, Then Tighten

When a layout feels cramped or unclear, first increase spacing more than you think you need, then tighten back to the nearest scale values. It is easier to remove excess whitespace than to diagnose a cramped layout where every relationship is ambiguous.

Do not use this as permission for airy marketing-style layouts in dense tools. The goal is to reveal grouping and hierarchy, then choose the appropriate density for the product.

---

## 2. The Proximity Law

**Elements that are close together are perceived as related. Elements that are far apart are perceived as unrelated.**

This is the single most important spacing principle. The spacing between elements should reflect their logical relationship.

### Proximity in Practice

```
Bad (equal spacing):

Project Name: [____]

Status: [____]

Description: [____]

Team Members: [____]

All gaps are 16px — there's no grouping. The user can't tell
which fields are related.


Good (proximity groups):

Project Name: [____]
Status: [____]              ← 12px gap: these are related
                             ← 24px gap: new group
Description: [____]          ← 12px gap: field + its help text
Must be under 200 characters
                             ← 24px gap: new group
Team Members: [____]
```

### Proximity Rules

| Relationship | Gap | Visual Effect |
| :--- | :--- | :--- |
| **Inside a logical group** (form fields in the same section, items in a list, chips in a set) | 8-16px | Elements read as a unit |
| **Between groups** (separate form sections, separate card groups) | 24-32px | Clear visual boundary between groups |
| **Between unrelated zones** (header to content, sidebar to content, content to footer) | 32-64px | Zones are distinct areas with different purposes |

**The test:** If you show someone the UI and ask "which of these things go together?", their answer should match the spacing. If they hesitate, the proximity isn't clear enough.

### Equal Spacing Is the Enemy

When everything has the same gap, nothing is grouped. Equal spacing says "all these things are equally related to each other" — which is almost never true. Use asymmetric spacing to create groups.

### Avoid Ambiguous Spacing

If the gap between item A and item B is almost the same as the gap between item B and item C, the grouping becomes ambiguous. Make relationship differences obvious:

- Use 8-12px within a tight group.
- Use 24-32px between related groups.
- Use 40px+ only for major page zones.

Small differences like 18px vs 20px usually read as inconsistency, not hierarchy.

---

## 3. Consistent Rhythm

A page has a vertical rhythm: the pattern of gaps as the user scrolls down. Consistent rhythm feels intentional; inconsistent rhythm feels sloppy.

### Section-to-Section Rhythm

```
Page Header
    ↓ 24px
Context Bar (filters, tabs)
    ↓ 16px
Primary Content
    ↓ 24px
Secondary Content
    ↓ 32px
Footer
```

**Rules for rhythm:**
- Use the same gap between all sections at the same level. If section A and section B have a 24px gap, section B and section C should too.
- The largest gaps separate the most distinct content areas. A 48px gap says "this is a new major section." A 16px gap says "these sections are related."
- Don't alternate between 24px and 32px gaps on the same page for sections at the same level. Pick one and stick with it.

### Card Grid Rhythm

In a card grid, the gap between cards should match the padding inside the cards:

```
Card padding: 16px  ←→  Card grid gap: 16px (or the same scale step)
```

When the grid gap and card padding match, the overall rhythm is consistent. A 24px grid gap with 16px card padding creates an awkward halo around each card.

### Vertical vs Horizontal Gaps

In most UIs, vertical gaps should be larger than horizontal gaps within the same context. This is because vertical gaps define reading order and section breaks, while horizontal gaps define parallelism.

```
Two related cards side by side:
[Card A]  16px gap  [Card B]

Next row of cards:
        24px gap

[Card C]  16px gap  [Card D]
```

---

## 4. Density Decisions

Density is how much content fits in a given space. Different contexts need different densities.

| Density | Row Height | Cell Padding | Font Size | Best For |
| :--- | :--- | :--- | :--- | :--- |
| **Compact** | 28-36px | 6-8px | 13-14px | Power users, data-heavy tables, admin tools, 50+ rows |
| **Default / Comfortable** | 40-52px | 12-16px | 14-16px | Most UIs, balanced scanning and readability |
| **Relaxed / Spacious** | 56-80px+ | 16-24px | 16px+ | Consumer apps, small datasets (<20 items), marketing |

### When to Go Compact

- The view regularly shows 50+ rows/items
- Users are expert operators who value information density (admin panels, CRMs, developer tools)
- The primary task is comparing values across rows (financial data, logs)
- Screen real estate is limited and scrolling is expensive

### When to Go Spacious

- The page shows fewer than 20 items
- Users are browsing or discovering (product catalog, content feed)
- Visual richness is important (images, charts, rich media)
- The user task is consideration, not rapid execution

### When to Offer Density Options

If the same view serves both power users and casual users, offer a density toggle (Compact / Default). Persist the choice per user.

---

## 5. Negative Space

Negative space (whitespace) is not "empty" — it's an active design element that creates grouping, emphasis, and calm.

### Negative Space as Emphasis

An element surrounded by generous whitespace reads as important, regardless of its size:

```
[   $12,450   ]     ← Generous whitespace around this metric
  Revenue (MTD)       makes it feel significant and deliberate

vs

[$12,450] Revenue (MTD) [$8,200] Costs [$4,250] Profit
                     ← Crammed together, nothing stands out
```

**Rule:** If you want the user to notice something, give it room. The space around an element is as important as the element itself.

### Negative Space as Grouping

Whitespace between sections defines groups as clearly as borders or background colors. Prefer whitespace over visual separators:

```
Good (whitespace grouping):

Section A content
                     ← 32px gap: this IS the separator
Section B content


Avoid (over-separated):

Section A content
─────────────────  ← unnecessary divider; the gap already separates
Section B content
```

**When to use a separator (line, border, background change):**
- The gap between sections is small (12-16px) and the sections are visually dense — the separator prevents them from blending together
- You need to group items within a single visual container (dividers between list items in a dropdown, rows in a table)

**When to use whitespace alone:**
- The gap between sections is large (24px+) — the whitespace itself is the separator
- The sections are in different visual containers (separate cards)

---

## 6. Spacing by Context

### Forms

- **Label to input:** 4-8px. The label should be visually connected to its input.
- **Between fields:** 16-20px. Enough to separate fields but keep the form feeling like one unit.
- **Help text to field:** 4px below the field. Close enough to read as part of the field.
- **Between field groups/sections:** 24-32px. Clear separation between "Profile" and "Notifications" sections.
- **Form padding (inside a card/modal):** 24px. Consistent with card padding elsewhere.

### Tables

- **Cell padding (horizontal):** 12-16px.
- **Cell padding (vertical):** 8-12px for default density, 6-8px for compact.
- **Header-to-first-row:** Same as cell vertical padding — don't increase it. The header is visually distinct through weight and color, not extra space.
- **Table-to-pagination:** 12-16px. Close enough to read as part of the table component.

### Cards

- **Card padding:** 16-24px. Consistent across all cards of the same type.
- **Card title to card body:** 12-16px.
- **Between card sections (header, body, footer):** 12-16px, optionally with a subtle divider.
- **Between cards in a grid:** Match the card's internal padding (a 16px-padded card → 16px grid gap).

### Page-Level

- **Content area padding:** 24-32px on desktop, 16px on mobile.
- **Page header to context bar:** 16-24px.
- **Context bar to primary content:** 16-24px.
- **Between major content sections:** 32-48px.
- **Last content section to footer:** 32-48px.

### Lists (Vertical)

- **Between list items:** 8-12px for simple lists, 12-16px for rich list items.
- **List item internal (title to description):** 4px. Tight — they're the same item.
- **List section header to first item:** 8-12px. Less than the gap between sections.

### Button Groups

- **Between related buttons (Save + Cancel):** 8-12px.
- **Between unrelated button groups:** 16-24px.
- **Button internal padding:** 8-16px vertical, 16-24px horizontal. Larger buttons need proportionally more padding.

---

## 7. Common Spacing Mistakes

| Mistake | Why It Happens | Fix |
| :--- | :--- | :--- |
| **Arbitrary values** | Developer tweaked spacing by eye until it "looked right" | Replace with the nearest scale value. If 13px looks right, use 12px or 16px. |
| **Equal spacing everywhere** | Default framework gaps were used without thinking about grouping | Use asymmetric spacing: tight within groups, loose between groups. |
| **Inconsistent gaps between similar elements** | Different developers, different sections, no shared convention | Audit and align: all card grids use the same gap; all form sections use the same gap. |
| **Padding too large relative to content** | A 32px-padded card with two lines of text | Reduce padding to 16-20px. Padding should be proportional to content volume. |
| **Cramped interactive elements** | Buttons, icons, or checkboxes too close together | Minimum 8px between adjacent clickable elements; 44x44px touch target minimum on mobile. |
| **Header-to-content gaps are too large** | 48px between page title and the content the title describes | 16-24px is sufficient. The title should read as introducing the content, not floating above it. |

---

## Review Format (Required)

When reviewing spacing, you MUST use this structure:

1. **Current State Summary:** What spacing scale is in use? Are there proximity groupings? What's the density?
2. **Finding → Recommendation Table:**

| # | Current | Issue | Recommendation | Why |
| :--- | :--- | :--- | :--- | :--- |
| 1 | All form field gaps are 16px — profile fields, notification toggles, danger zone | No grouping — everything reads as equally related | 12px within groups, 24-32px between groups | Proximity should reflect logical relationships |
| 2 | Cards use 24px padding but grid gap is 12px | Cards are cramped while internally spacious | Match grid gap to padding (both 16px) | Consistent rhythm between internal and external spacing |
| 3 | Page header has 48px padding-bottom | The title floats disconnected from the content it describes | Reduce to 20-24px | The header should feel like it introduces the content |

3. **Ergonomic Rationale:** 2-4 sentences on the core spacing principle driving these recommendations.
