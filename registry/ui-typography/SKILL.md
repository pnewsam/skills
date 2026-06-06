---
name: ui-typography
description: Typography principles for web applications — type scale construction, font pairing, readable line lengths, heading hierarchy, vertical rhythm, and typography by context (data tables vs cards vs forms vs long-form text). Use when choosing fonts, building a type system, or fixing readability issues.
---

# UI Typography — Type Systems & Readability

A decision engine for building and applying a typographic system. Covers type scale construction, font selection, hierarchy, line length, and context-specific typography patterns. For visual hierarchy across a full page, see `ui-visual-hierarchy`. For spacing between typographic elements, see `ui-spacing`.

## Initial Response

When this skill is first invoked without a specific request, respond only with:

> I'm ready to help you with typography — type scales, font choices, hierarchy, readability, or context-specific type patterns. What are you working on, and what's the typographic challenge?

Do not provide any other information until the user asks a question or presents typography to review.

---

## 1. The System Font Stack

For most web applications, the system font stack is the right default. It loads instantly, looks native on every platform, and avoids the performance cost of web fonts.

```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
  "Helvetica Neue", Arial, sans-serif;
```

**Use the system stack when:**
- Building a SaaS tool, dashboard, admin panel, or developer tool
- Performance and load time matter
- The brand identity is conveyed through layout, color, and functionality — not typographic uniqueness

**Use a custom font when:**
- The product is consumer-facing and typography is a core part of the brand (marketing sites, editorial products, luxury brands)
- You need a specific personality that system fonts can't convey
- You're willing to accept the performance cost (200-500KB of font files, FOUT/FOIT management)

### Font Pairing

When using custom fonts, pair a display/heading font with a body font:

| Heading Font | Body Font | Vibe |
| :--- | :--- | :--- |
| **Inter** | Inter | Clean, modern, neutral — the default for SaaS |
| **Satoshi / Cabinet Grotesk** | Inter | Bold, contemporary, startup aesthetic |
| **Playfair Display** | Lora or Inter | Editorial, elegant, literary |
| **Space Grotesk** | Inter or system | Technical, quirky, developer-tool feel |
| **Fraunces** | Inter or system | Warm, creative, sophisticated |
| **DM Sans** | DM Sans or Inter | Geometric, friendly, product-design aesthetic |

**Rules for pairing:**
- One font family is enough for most apps. Two (heading + body) is a deliberate choice. Three is almost always too many.
- Pair a distinctive heading font with a neutral body font — never two distinctive fonts that compete.
- The body font does the heavy lifting (90%+ of rendered text). Optimize for readability, not personality.

---

## 2. The Type Scale

A type scale is a set of font sizes with deliberate ratios between them. The scale provides consistency — every text element picks from a defined set, not an arbitrary pixel value.

### Scale Construction

Choose a base size and a ratio. The ratio determines the step between sizes.

| Scale Ratio | Sizes (base 16px) | Best For |
| :--- | :--- | :--- |
| **1.25 (Major Third)** | 12, 16, 20, 25, 31, 39 | Data-dense UIs, dashboards, dev tools |
| **1.333 (Perfect Fourth)** | 12, 16, 21, 28, 37, 50 | Most SaaS apps — the default choice |
| **1.5 (Perfect Fifth)** | 12, 16, 24, 36, 54 | Marketing sites, consumer apps, anything with hero text |

**The base size is 16px** — this is the browser default and the reference point for `rem` units. Don't change it on `<html>` unless you have a specific reason.

### Standard Scale (1.25 ratio, base 16px)

| Token | Size | Line Height | Weight | Use |
| :--- | :--- | :--- | :--- | :--- |
| **xs** | 12px | 1.5 (18px) | Regular | Captions, labels, helper text, timestamps |
| **sm** | 14px | 1.5 (21px) | Regular | Secondary text, descriptions, table cell text |
| **base** | 16px | 1.6 (25.6px) | Regular | Body text, form inputs, list items, the default |
| **lg** | 18px | 1.5 (27px) | Medium | Lead paragraphs, emphasized body, card titles (large cards) |
| **xl** | 20px | 1.4 (28px) | Semibold | Section headers, card titles |
| **2xl** | 24px | 1.3 (31px) | Semibold | Page section headings, modal titles |
| **3xl** | 30px | 1.2 (36px) | Bold | Page titles |
| **4xl** | 38px | 1.1 (42px) | Bold | Hero headings (landing pages), major section breaks |

**For marketing/consumer:** Shift the scale up one step — use the 1.333 or 1.5 ratio. Hero text may go to 48-64px.

**For data-dense tools:** Drop the scale — base at 14px, headings that don't exceed 20px. Compensate with weight and color for hierarchy rather than size.

### What Size for What Context

| Context | Title | Body | Secondary | Caption/Label |
| :--- | :--- | :--- | :--- | :--- |
| **Data Table** | - | 14px | 12px (column metadata) | - |
| **Card (in grid)** | 16px semibold | 14px | 12px (timestamp, metadata) | - |
| **Card (standalone)** | 18-20px semibold | 16px | 14px | - |
| **Form** | 20px (form title) | 16px (labels, inputs) | 14px (help text) | 12px (field hints) |
| **Settings** | 20px (section heading) | 14px (setting labels) | 13px (descriptions) | - |
| **Dashboard Widget** | 14-16px semibold | 24-30px (big number) | 12-13px (label, change %) | - |
| **Marketing Hero** | 48-64px bold | 18-20px (subhead) | - | - |
| **Blog/Article** | 32-38px bold | 18px | 14px (byline, date) | 13px (footnotes) |

---

## 3. Line Height & Line Length

### Line Height by Context

| Context | Line Height | Rationale |
| :--- | :--- | :--- |
| **Body text (reading)** | 1.5–1.6 | Gives the eye a clear path to the next line. |
| **Body text (scanning — tables, lists)** | 1.3–1.4 | Tighter for scan-heavy contexts where each line is short. |
| **Headings** | 1.1–1.3 | Headings are short; large line-height creates awkward gaps. |
| **Form labels & inputs** | 1.4–1.5 | Labels are one line; inputs need comfortable internal padding. |
| **Captions & small text** | 1.4–1.5 | Small text needs slightly more line-height to stay readable. |

**The rule:** Longer lines need more line-height. A 72-character line at 1.4 is harder to read than the same text at 1.6. A 30-character line (table cell) is fine at 1.3.

### Line Length (Measure)

The optimal line length for continuous reading is **45-75 characters**. This translates to:

| Font Size | Optimal Width |
| :--- | :--- |
| 14px | 480-640px |
| 16px | 560-720px |
| 18px | 600-780px |
| 20px | 640-840px |

**For reading-focused content** (articles, documentation, long descriptions): constrain to 600-720px max-width regardless of viewport size.

**For data displays** (tables, card grids): line length doesn't apply — the user is scanning, not reading. Let tables and cards fill available width.

**For forms:** Single-column forms should be 400-560px wide. Wider forms create a disconnect between labels and their inputs.

---

## 4. Heading Hierarchy

### Heading Levels Map to Document Structure

Use heading levels (`h1`–`h4`) to reflect the document outline, not to achieve a specific visual size:

```
h1 — Page title (one per page)
  h2 — Major section ("Billing Details", "Recent Activity")
    h3 — Subsection within a major section
      h4 — Minor heading within a subsection (rarely needed)
```

**Rules:**
- **One `<h1>` per page.** It's the page title. Screen readers use it for navigation.
- **Don't skip levels.** `<h2>` → `<h4>` without an `<h3>` in between breaks the document outline.
- **Don't use headings for styling.** If you want big, bold text that isn't a structural heading, use a `<p>` or `<span>` with a font-size class.
- **Headings should describe what follows.** "Details" is a bad heading. "Invoice Details" or "Payment History" is good.

### Visual Weight Distribution

```
h1: 30px Bold         — The page identity. Immediately obvious.
h2: 20px Semibold     — Major sections. Clear visual breaks.
h3: 16px Semibold     — Subsections. Less weight than h2.
body: 16px Regular    — Content. Neutral weight.
caption: 12px Regular — Supporting information. Muted color.
```

The progression should be obvious at a glance. If h2 and h3 look the same, increase the weight or size difference.

### Headings + Body Spacing

The space above a heading should be greater than the space below it. This groups the heading with its content:

```
32px above h2 (distance from previous section)
  h2
8px below h2 (close to its content)
  body text...
```

This uses the Gestalt proximity principle: the heading is closer to the content it introduces than to the content above it. See `ui-spacing` for more on proximity.

---

## 5. Typography by Context

### Data Tables

- **Cell text:** 14px regular (or 13px for dense tables). Line height 1.3-1.4.
- **Column headers:** 12-13px, medium weight, uppercase or not — be consistent. Muted color.
- **Alignment:** Text left-aligned. Numbers right-aligned (with tabular figures for consistent width). Status badges centered.
- **Truncation:** Single-line cells use `text-overflow: ellipsis`. Multi-line content in a table cell is a design smell — consider a detail view instead.

### Cards

- **Card title:** 16px semibold. One line. Truncate with ellipsis if needed.
- **Primary metadata:** 14px, regular. One line per attribute. Label in muted color.
- **Secondary metadata:** 12px, muted. Timestamps, IDs, counts.
- **Actions:** 13-14px, medium weight. Button labels should be verbs.

### Forms (see also `ui-forms`)

- **Field labels:** 14-15px, medium weight. Above the input. Sentence case.
- **Input text:** 16px regular. 16px prevents iOS zoom on focus.
- **Help text:** 13px, muted. Below the input, one line. "Must be at least 8 characters."
- **Error text:** 13px, error color. Replaces or appears alongside help text.
- **Section headings within a form:** 18-20px semibold, with 24-32px space above.

### Marketing / Landing Pages

- **Hero headline:** 40-64px, bold. The largest text on the page. One sentence, no more than 10-12 words.
- **Hero subhead:** 18-22px, regular. 1-2 sentences explaining what the product does.
- **Section headings:** 28-36px, bold. One per feature section.
- **Body:** 16-18px, 1.6 line-height. Reading-oriented.
- **CTAs:** 16-18px, medium/semibold. Button labels should be specific and action-oriented.

---

## 6. Font Weight

### The Weight Scale

Use a limited set of weights consistently:

| Weight | Value | Use |
| :--- | :--- | :--- |
| **Regular (400)** | Default | Body text, form inputs, table cell text, captions |
| **Medium (500)** | Slightly emphasized | Labels, button text, secondary headings |
| **Semibold (600)** | Clearly emphasized | Section headings, card titles, emphasized metadata |
| **Bold (700)** | Maximum emphasis | Page titles, hero headings, key metrics |

**Rules:**
- Two or three weights per page is the norm. Four is excessive.
- Don't use light weights (300) for body text — they're hard to read, especially on low-DPI screens.
- Bold body text is exhausting to read. Reserve bold for short spans: headings, labels, emphasized words.
- A weight difference of one step (400 → 500) is subtle. A difference of two steps (400 → 600) is obvious. Choose the right contrast for the context.

### Weight and Size Together

When decreasing font size (e.g., captions at 12px), consider increasing weight slightly (to medium) to maintain legibility. Very small text at regular weight can wash out.

---

## 7. Text Color & Contrast

Typography isn't just size and weight — color establishes hierarchy too.

### Text Color Tiers

| Tier | Color | Use |
| :--- | :--- | :--- |
| **Primary** | Near-black (`#111` or `gray-900`) | Body text, headings, form labels, anything the user needs to read |
| **Secondary** | Medium gray (`#555` or `gray-600`) | Descriptions, metadata, captions, help text |
| **Muted / Tertiary** | Light gray (`#888` or `gray-400`) | Placeholders, disabled text, timestamps, "No results" messages |
| **Link / Accent** | Brand color (e.g., blue) | Links, interactive text, clickable rows |
| **Error** | Red | Validation errors, destructive warnings |
| **Success** | Green | Confirmation messages |

**Minimum contrast ratios (WCAG AA):**
- Normal text (under 18px): 4.5:1 against background
- Large text (18px+, or 14px+ bold): 3:1 against background
- Muted/placeholder text: aim for 3:1 at minimum — don't go below

**The most common mistake:** Muted text that's too light. `gray-400` on white is borderline; `gray-300` on white fails WCAG. When in doubt, darken muted text.

---

## 8. Tabular Figures & Numbers

For any UI that displays numbers — especially numbers that change or are compared — use tabular figures. These are fixed-width digits so "1" takes the same space as "8", preventing layout shift as values update.

```css
font-feature-settings: "tnum";
font-variant-numeric: tabular-nums;
```

**Essential for:** Dashboards, counters, timers, prices, tables with numeric columns, anywhere numbers update dynamically.

Most system fonts and quality web fonts support tabular figures. If the font doesn't, consider a different font for numeric displays.

---

## Review Format (Required)

When reviewing typography, you MUST use this structure:

1. **Current State Summary:** What fonts, sizes, weights are in use? What's the context (tool, marketing, reading)?
2. **Finding → Recommendation Table:**

| # | Current | Issue | Recommendation | Why |
| :--- | :--- | :--- | :--- | :--- |
| 1 | 4 different font sizes on one card (12, 14, 16, 18) | Too many sizes weaken hierarchy | Reduce to 3: title (16px), body (14px), caption (12px) | Each size should signal a distinct level in the hierarchy |
| 2 | Body text at 14px/1.2 line-height | Too tight for reading | Increase to 1.5 line-height | Long lines at tight line-height strain the eye |
| 3 | h2 and h3 visually identical (both 18px semibold) | No hierarchy between heading levels | h2: 20px semibold; h3: 16px semibold | Different heading levels must be visually distinct |

3. **Ergonomic Rationale:** 2-4 sentences on the core typographic principle driving these recommendations.