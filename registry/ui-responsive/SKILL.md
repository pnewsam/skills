---
name: ui-responsive
description: Responsive design patterns for web applications — mobile-first workflow, breakpoint selection, responsive pattern catalog (stack, collapse, hide, reorganize, off-canvas), container queries vs media queries, touch-friendly adaptations (target sizes, thumb zones), and responsive typography. For page-level layout adaptation, see ui-layouts.
---

# UI Responsive — Adapting Across Screens

A decision engine for making UIs work across screen sizes. Covers breakpoint strategy, responsive patterns, touch adaptations, and responsive typography. For choosing the desktop layout that will then adapt, see `ui-layouts`.

## Initial Response

When this skill is first invoked without a specific request, respond only with:

> I'm ready to help you with responsive design — breakpoints, adaptation patterns, touch targets, or making a specific component work across screen sizes. What are you adapting, and what screen sizes do you need to support?

Do not provide any other information until the user asks a question or presents a responsive challenge.

---

## 1. Breakpoint Strategy

### Standard Breakpoints

Use a consistent set of breakpoints across the app. These are the Tailwind defaults, which work well for most projects:

| Breakpoint | Width | Target Device |
| :--- | :--- | :--- |
| **sm** | 640px | Large phones in landscape, small tablets |
| **md** | 768px | Tablets, small laptops |
| **lg** | 1024px | Laptops, small desktops |
| **xl** | 1280px | Desktops |
| **2xl** | 1536px | Large desktops |

**The rule:** Design for the content, not for specific devices. Don't add a breakpoint at 834px "for iPad." Add a breakpoint when the content needs it — when text wraps awkwardly, when columns get too narrow, when an element overflows.

### Mobile-First: A Practical Definition

Mobile-first means writing the base (unprefixed) styles for mobile, then using `min-width` media queries to add complexity for larger screens:

```css
/* Base: mobile (all screens) */
.card-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

/* Tablet: 2 columns */
@media (min-width: 768px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop: 3 columns */
@media (min-width: 1024px) {
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

**Why mobile-first:**
- Mobile styles are simpler (single column, stacked). Building up is easier than stripping down.
- Mobile constraints force you to prioritize content. What matters most survives the constraint.
- `min-width` queries are easier to reason about than `max-width`.

**When you can skip mobile-first:**
- The app is desktop-only (internal tools, dashboards, admin panels that are explicitly not used on mobile)
- You're building an existing desktop layout and adding mobile as an afterthought — use `max-width` overrides to collapse the desktop layout

### When to Add a Breakpoint

Add a breakpoint when the content breaks, not at a predetermined width. Resize the browser until something looks wrong, note the width, and add a breakpoint slightly above that width.

Don't add a breakpoint just because you have 3 breakpoints in your config and you've only used 2. Unused breakpoints are not a problem.

---

## 2. Responsive Pattern Catalog

### Stack (The Default)

Elements that sit side-by-side on desktop stack vertically on mobile. This is the most common and most important responsive pattern.

```
Desktop:                 Mobile:
[A] [B] [C]              [A]
                         [B]
                         [C]
```

```css
.row {
  display: flex;
  flex-direction: column;    /* mobile: stacked */
}

@media (min-width: 768px) {
  .row { flex-direction: row; }
}
```

**Use for:** Card grids, form columns, feature sections, any side-by-side content.

### Column Reduction

A multi-column grid reduces the number of columns as the viewport narrows.

```
4-col → 3-col → 2-col → 1-col
```

```css
.grid { grid-template-columns: repeat(1, 1fr); }
@media (min-width: 640px)  { .grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .grid { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 1280px) { .grid { grid-template-columns: repeat(4, 1fr); } }
```

**Use for:** Card grids, image galleries, dashboard widgets, product listings.

### Reveal / Hide

Some content is hidden on mobile and revealed on desktop (or vice versa).

```
Desktop: [Full sidebar] [Content]
Mobile:  [Content]         ← sidebar hidden behind hamburger menu
```

| What to Hide on Mobile | Alternatives |
| :--- | :--- |
| **Sidebar navigation** | Hamburger menu, bottom tab bar |
| **Secondary columns** | Tab switcher, accordion, or separate page |
| **Filter panels** | Filter button → bottom sheet or full-screen overlay |
| **Large tables** | Collapse to cards, or horizontal scroll with frozen first column |
| **Decorative illustrations** | Hide entirely; they're not worth the scroll distance on mobile |

**What to always show on mobile:**
- Primary content — the reason the user is on the page
- Primary actions — at minimum, the one most important action
- Navigation cues — where am I, how do I get back
- Critical status — errors and warnings must be visible

### Reorganize

Content changes order, not just layout, at different breakpoints.

```
Desktop:                    Mobile:
[Sidebar] [Main Content]    [Main Content]
                            [Sidebar]
```

Content that's secondary on desktop (sidebar, metadata) moves below the primary content on mobile. Use CSS Grid or Flexbox `order` to reorder.

```css
.page {
  display: grid;
  grid-template-areas:
    "sidebar main";
  grid-template-columns: 240px 1fr;
}

@media (max-width: 767px) {
  .page {
    grid-template-areas:
      "main"
      "sidebar";
    grid-template-columns: 1fr;
  }
}

.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
```

**Rule:** Primary content goes first on mobile. The user shouldn't scroll past navigation chrome or secondary info to reach the reason they're on the page.

### Off-Canvas

Content slides in from off-screen on mobile rather than being permanently visible.

```
Desktop: [Sidebar | Content]
Mobile:  [Content] ← sidebar slides in from left on tap
```

**Use for:** Navigation menus, filter panels, shopping carts, detail panels. The off-canvas pattern preserves screen real estate for content while keeping secondary UI accessible.

### Horizontal Scroll (with Caution)

For content that genuinely needs its horizontal structure (data tables, code blocks, wide images), allow horizontal scrolling within a container rather than forcing everything to stack:

```css
.table-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch; /* smooth scroll on iOS */
}
```

**Use for:** Data tables with 5+ columns that would be unreadable if stacked as cards. **Freeze the first column** (row identifier) so the user always knows what row they're looking at.

**Avoid for:** Anything that isn't tabular data. Horizontal scroll for marketing content, feature sections, or card grids is a UX failure.

### Bottom Sheet (Mobile Modal Replacement)

On mobile, modals should be replaced by bottom sheets — panels that slide up from the bottom of the screen. They're easier to reach with thumbs and feel native to mobile.

**Use for:** Any modal content on screens under 640px. Bottom sheets support a "grab handle" for drag-to-dismiss and can be partially or fully expanded.

---

## 3. Touch Adaptations

### Touch Target Sizing

| Guideline | Minimum Size | Source |
| :--- | :--- | :--- |
| **Apple HIG** | 44×44px | iOS Human Interface Guidelines |
| **Material Design** | 48×48px | Google Material Design |
| **WCAG (Level AAA)** | 44×44px | Web Content Accessibility Guidelines |

**Practical rule:** 44×44px minimum for any interactive element. This includes buttons, links in nav, checkboxes, radio buttons, icons in toolbars, and list items that are clickable.

**When targets must be smaller** (inline links in text, icons in dense UIs): ensure adequate spacing between adjacent targets so the user doesn't hit the wrong one. 8px minimum separation.

### Thumb Zone (Mobile)

On mobile, the bottom half of the screen is easiest to reach with one thumb. The top of the screen requires stretching or a second hand.

```
Hard to reach (top 1/3)     — Secondary info, back navigation
Reachable (middle 1/3)      — Content (scrolling area)
Easy to reach (bottom 1/3)  — Primary actions, CTAs, tab bars
```

**Rules:**
- Primary CTAs on mobile should be in the bottom portion of the screen, not the top.
- Bottom tab bars (iOS style) are more reachable than top tab bars on large phones.
- Floating action buttons at the bottom-right are in the natural thumb path.

### Hover States on Touch

Hover-to-reveal actions don't work on touch devices. Every action available on hover must have a touch-accessible alternative:

| Desktop (hover) | Mobile (touch) |
| :--- | :--- |
| Button appears on row hover | Button is always visible, or accessible via swipe/long-press |
| Tooltip on hover | Tap to reveal, or info icon with modal |
| Dropdown menu on hover | Tap to open |

**CSS rule:** Gate hover effects behind a media query that checks for hover capability:

```css
@media (hover: hover) and (pointer: fine) {
  .row-actions { opacity: 0; }
  .row:hover .row-actions { opacity: 1; }
}

/* On touch devices, actions are always visible */
.row-actions { /* default: visible */ }
```

---

## 4. Responsive Typography

Responsive typography should preserve a stable type scale. Do not scale font size directly with viewport width. Use the same body text size across breakpoints, and step headings only when the layout context changes enough to justify a different hierarchy.

### Stepped Sizes (Simpler)

Define font sizes per breakpoint using the type scale:

| Element | Mobile (<768px) | Desktop (≥768px) |
| :--- | :--- | :--- |
| Page title (h1) | 24px | 30px |
| Section heading (h2) | 18px | 20px |
| Body | 16px | 16px (no change) |
| Caption | 12px | 12px (no change) |

Body text shouldn't change between mobile and desktop — 16px is right for both. Headings can be slightly larger on desktop to use the available space.

### Avoid Viewport-Scaled Type

Avoid `vw`-based font sizes for application UI. They make text unpredictable, can shrink copy below readable sizes, and often create overflow or crowding at intermediate widths. For marketing heroes, choose explicit mobile/tablet/desktop heading sizes from the type scale instead of a continuously fluid formula.

### Line Length

On mobile, line length naturally shortens. Don't fight this — it's correct. Don't reduce font size to fit more characters per line on mobile; keep 16px body text and accept the shorter lines. If paragraph text falls below ~35 characters per line on mobile, consider reducing horizontal padding rather than shrinking the font.

---

## 5. Responsive Images

Images should serve appropriate resolutions for the device:

```html
<img
  srcset="image-640.jpg 640w, image-1024.jpg 1024w, image-1600.jpg 1600w"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  src="image-1024.jpg"
  alt="Description"
/>
```

**Rules:**
- Don't serve a 2400px-wide image to a 375px-wide phone. Use `srcset`.
- Use `loading="lazy"` for images below the fold.
- Always specify `width` and `height` attributes (or use aspect-ratio CSS) to prevent layout shift as images load.

---

## 6. Responsive Spacing

Spacing should also scale with the viewport. A 64px gap that creates breathing room on desktop is excessive on a 375px-wide phone.

| Spacing | Desktop | Tablet | Mobile |
| :--- | :--- | :--- | :--- |
| **Content area padding** | 32px | 24px | 16px |
| **Between major sections** | 48-64px | 32-48px | 24-32px |
| **Card padding** | 24px | 20px | 16px |
| **Grid gaps** | 24px | 16-20px | 16px |

**Rule:** Don't scale spacing proportionally — mobile doesn't need half the desktop spacing. It needs slightly less, not dramatically less. If desktop uses 32px between sections, mobile should use 20-24px, not 16px. Content still needs room to breathe on small screens.

---

## 7. Responsive Navigation

Navigation is the hardest responsive challenge. The pattern depends on the number of items:

| Nav Items | Desktop | Mobile |
| :--- | :--- | :--- |
| **2-4** | Horizontal links in header | Same, or collapsed into a single dropdown |
| **5-7** | Horizontal links in header | Hamburger menu → overlay or slide-out panel |
| **8+** | Sidebar (app shell) | Hamburger menu → overlay or bottom tab bar (top 3-4 items) |
| **Primary + secondary** | Primary in header, secondary in sidebar | Primary in bottom tab bar, secondary in hamburger menu |

**Hamburger menu rules:**
- It's less discoverable than visible navigation. Accept this tradeoff; don't try to solve discoverability by keeping all nav items visible on mobile — you'll crowd out the content.
- The menu must be clearly labeled (either the word "Menu" next to the icon, or an accessible label).
- Opening the menu should not shift page content. Use an overlay or off-canvas panel.

### Bottom Tab Bar (Mobile)

For apps with 3-5 primary destinations, a bottom tab bar is more reachable and discoverable than a hamburger menu:

```
[Home]  [Search]  [Create]  [Activity]  [Profile]
```

- **3-5 items.** Never more than 5.
- **Icon + short label.**
- **Active tab highlighted** with the brand color.
- **The "Create" or primary action** can be visually distinct (filled circle, different color).

---

## 8. Container Queries vs Media Queries

Media queries respond to the viewport width. Container queries respond to the parent container's width. Use container queries when a component's layout depends on its container, not the viewport:

```css
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 200px 1fr;
  }
}
```

**Use container queries for:**
- Reusable components that appear in different-width contexts (a card that sits in a sidebar AND in a full-width grid)
- Dashboard widgets that can be resized or placed in different-width columns
- Components in a design system that need to adapt to their container, not the viewport

**Use media queries for:**
- Page-level layout (sidebar, header, content area)
- Navigation patterns
- Global spacing and typography
- Anything that depends on the overall viewport, not a specific container

---

## 9. Testing Responsive Design

Test at these widths, at minimum:

| Width | What to Check |
| :--- | :--- |
| **320px** | Small phone (iPhone SE). Does anything overflow? Are touch targets big enough? |
| **375px** | Common phone width. Is the layout usable? Is primary content visible without scrolling a full screen? |
| **768px** | Tablet / small laptop. Do columns wrap correctly? Is the navigation appropriate? |
| **1024px** | Small desktop / landscape tablet. Are there awkward half-width layouts that should be full-width? |
| **1440px** | Common desktop. Is the max-width constraint working? Does the layout gracefully fill the space? |

**Use browser DevTools responsive mode** to test each width. Don't just resize the browser window — DevTools responsive mode more accurately simulates mobile devices.

---

## Review Format (Required)

When reviewing responsive design, you MUST use this structure:

1. **Current State Summary:** What breakpoints are defined? What patterns are used to adapt? What devices are supported?
2. **Finding → Recommendation Table:**

| # | Current | Issue | Recommendation | Why |
| :--- | :--- | :--- | :--- | :--- |
| 1 | 5-column grid collapses directly to 1 column at 768px | Abrupt jump; 3 columns would fit at tablet widths | Add intermediate: 5→3→2→1 columns | Progressive column reduction feels smoother than binary collapse |
| 2 | Hover-only action buttons on touch devices | Actions inaccessible without a mouse | Show actions statically on touch; gate hover effects with `@media (hover: hover)` | Touch users need visible affordances |
| 3 | 48px CTA button at the top of a mobile page | Unreachable with one thumb; user must stretch or use second hand | Move primary CTA to the bottom of the screen on mobile | Thumb zone: the bottom half of the screen is reachable |

3. **Ergonomic Rationale:** 2-4 sentences on the core responsive principle driving these recommendations.
