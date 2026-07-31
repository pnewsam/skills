---
name: ui-color
description: Color system principles for UI — building a coherent palette, semantic color roles (primary, secondary, success, warning, danger, surface, text), using color for hierarchy not decoration, dark mode strategy, and accessible contrast. Use when creating or auditing a color system, choosing colors for a component, or fixing color accessibility issues.
---

# UI Color — Systems & Semantic Usage

A decision engine for building and applying a color system. Covers palette
construction, semantic roles, color for hierarchy, dark mode, and contrast.
For which feedback pattern a color belongs to (error, success, warning states),
see `ui-feedback`. State when a request requires deeper color science than this
maintained UI reference provides.

## 1. The Color Palette Structure

A UI color system has two layers: the **palette** (raw colors) and **semantic tokens** (what each color means in context). The palette is the "what"; the semantic tokens are the "when and why."

### The Minimum Palette

Every UI needs these color families:

| Family | Count | Purpose |
| :--- | :--- | :--- |
| **Neutral (grays)** | 8-12 shades | Backgrounds, surfaces, borders, text |
| **Brand / Primary** | 5-8 shades | Primary buttons, links, focus rings, active states |
| **Success** | 3-5 shades | Confirmation, positive trends, completed states |
| **Warning** | 3-5 shades | Cautions, approaching limits, attention-needed states |
| **Danger / Error** | 3-5 shades | Destructive actions, errors, critical alerts |
| **Info** (optional) | 3-5 shades | Informational alerts, help tooltips, neutral status |

### Shade Naming Convention

Use a numeric scale from light to dark (50 = lightest, 950 = darkest):

```
primary-50   → light tint (backgrounds, hover states)
primary-100  → subtle background
primary-200  → subtle border
primary-300  → light border
primary-400  → muted text on dark
primary-500  → BASE — the canonical brand color
primary-600  → hover state on white
primary-700  → active state, text on light backgrounds
primary-800  → text
primary-900  → dark text
primary-950  → darkest shade
```

**500 is the base.** Lighter shades (50-400) are for backgrounds, hover states, and subtle accents. Darker shades (600-950) are for text, active states, and emphasis.

### How Many Shades per Color?

| App Type | Shades Needed |
| :--- | :--- |
| Simple utility, prototype | 3-5 per color (light, base, dark) |
| Standard SaaS app | 5-8 per color |
| Design system / component library | 9-11 per color (full range) |

Start with fewer. Add shades when you need them, not before. An unused shade in the palette is dead weight.

---

## 2. Semantic Color Roles

The palette defines available colors. Semantic tokens define when to use each one. This indirection is essential — it lets you change the palette without changing every component, and it prevents "I'll just use this blue because it looks nice" decisions.

### Core Semantic Tokens

| Token | Maps To | Use |
| :--- | :--- | :--- |
| `--color-background` | neutral-50 or white | Default page background |
| `--color-surface` | white or neutral-50 | Card, modal, dropdown backgrounds |
| `--color-surface-raised` | white | Elevated surfaces (modals over cards) |
| `--color-border` | neutral-200 or 300 | Default borders, dividers |
| `--color-border-strong` | neutral-300 or 400 | Emphasized borders |
| `--color-text-primary` | neutral-900 or 950 | Body text, headings, labels |
| `--color-text-secondary` | neutral-500 or 600 | Descriptions, metadata, captions |
| `--color-text-muted` | neutral-400 | Placeholders, disabled text |
| `--color-text-link` | primary-600 or 700 | Links, clickable text |
| `--color-primary` | primary-500 | Primary buttons, focus rings, active indicators |
| `--color-primary-hover` | primary-600 | Button hover states |
| `--color-primary-text` | white or primary-50 | Text on primary backgrounds |
| `--color-success` | green-500 or 600 | Success indicators, positive trends |
| `--color-warning` | amber-500 or 600 | Warnings, attention states |
| `--color-danger` | red-500 or 600 | Destructive actions, errors, critical states |

### Using Semantic Tokens in Code

```css
/* Bad: raw values */
.button {
  background: #2563eb;
  color: #ffffff;
}
.error-message {
  color: #dc2626;
}

/* Good: semantic tokens */
.button-primary {
  background: var(--color-primary);
  color: var(--color-primary-text);
}
.error-message {
  color: var(--color-danger);
}
```

If you change the brand from blue to purple, semantic-token code changes in one place. Raw-value code changes everywhere.

---

## 3. Neutral Scale

The neutral (gray) scale does more work than any other color in the system. It's the background, the borders, the text — the canvas everything else sits on.

### Neutral Scale Construction

A good neutral scale isn't just evenly-spaced gray values. It needs:
- **Warm or cool undertone.** Pure gray (#808080) looks dead. Warm grays feel more natural; cool grays feel more technical. Pick one and be consistent.
- **Tighter spacing at the light end.** You need more distinction between 50, 100, 200 (subtle backgrounds and borders) than between 700, 800, 900 (all dark text variants).

| Shade | Value (warm gray) | Use |
| :--- | :--- | :--- |
| 50 | #fafaf9 | Page background (very light) |
| 100 | #f5f5f4 | Hover states, subtle section backgrounds |
| 200 | #e7e5e4 | Borders, dividers |
| 300 | #d6d3d1 | Strong borders, disabled states |
| 400 | #a8a29e | Muted text, placeholder text |
| 500 | #78716c | Secondary text |
| 600 | #57534e | Secondary text (high contrast) |
| 700 | #44403c | Primary text (body) |
| 800 | #292524 | Headings |
| 900 | #1c1917 | High-emphasis text |
| 950 | #0c0a09 | Dark mode backgrounds |

**In Tailwind:** The `stone` or `neutral` palette follows this pattern.

---

## 4. Color in Dark Mode

Dark mode isn't "swap white for black." It's a separate color mapping that preserves hierarchy and readability.

### Dark Mode Principles

1. **Don't invert everything.** Pure white text on pure black backgrounds ($#000) causes eye strain. Use dark grays (#111 to #1a1a) for backgrounds and slightly muted whites (#e5e5e5 to #f5f5f5) for text.

2. **Reduce contrast slightly.** In light mode, text-on-background contrast is high. In dark mode, reduce it slightly — `neutral-100` text on `neutral-900` background instead of `white` on `black`. The eye is more sensitive to contrast in dark environments.

3. **Desaturate colors.** A fully saturated blue looks neon on a dark background. Reduce saturation by 10-20% for dark mode variants of brand, success, warning, and danger colors.

4. **Elevation should go lighter, not darker.** In light mode, elevated surfaces (cards, modals) are lighter than the background. In dark mode, elevated surfaces are also lighter — a dark gray card on a near-black background.

### Dark Mode Token Mapping

| Token | Light Mode | Dark Mode |
| :--- | :--- | :--- |
| `--color-background` | neutral-50 (#fafaf9) | neutral-950 (#0c0a09) |
| `--color-surface` | white | neutral-900 (#1c1917) |
| `--color-surface-raised` | white | neutral-800 (#292524) |
| `--color-border` | neutral-200 | neutral-700 |
| `--color-text-primary` | neutral-900 | neutral-100 |
| `--color-text-secondary` | neutral-500 | neutral-400 |
| `--color-text-muted` | neutral-400 | neutral-500 |

### Implementation Pattern

```css
:root {
  --color-background: #fafaf9;
  --color-surface: #ffffff;
  --color-text-primary: #1c1917;
  /* ... */
}

[data-theme="dark"], .dark {
  --color-background: #0c0a09;
  --color-surface: #1c1917;
  --color-text-primary: #f5f5f4;
  /* ... */
}
```

Define all tokens in both modes. Never use a raw color value in a component — use the token.

---

## 5. Color for Hierarchy, Not Decoration

Color should guide the eye to what's important and communicate meaning. It should not be used "to make things look nice" without a functional purpose.

### When to Use Color

| Purpose | Technique | Example |
| :--- | :--- | :--- |
| **Draw attention to primary action** | Filled color on primary button; muted/outlined on secondary | [Save] [Cancel] |
| **Indicate state** | Semantic colors on status badges | Green "Active", Red "Failed" |
| **Show relationships** | Consistent color for related elements | All "Revenue" metrics use the same blue |
| **Mark the current location** | Color on active nav item | Active sidebar item with a colored left border |
| **Signal interactivity** | Color on links and clickable elements | Blue links in body text |

### When NOT to Use Color

| Anti-Pattern | Why It's Bad | Fix |
| :--- | :--- | :--- |
| **Rainbow dashboard** | Every widget a different color "to make it interesting" — nothing is semantically meaningful | Use one accent color; vary by saturation or pair with neutral |
| **Color as the only differentiator** | A red border on an error field with no icon or text — colorblind users can't distinguish it | Always pair color with an icon, text label, or pattern change |
| **Too many semantic colors** | Every status gets its own color (purple for "pending review", teal for "in progress", orange for "on hold") — the system becomes unlearnable | Limit to 3-4 status colors; use text labels for finer distinctions |
| **Decorative color blocks** | Colored backgrounds behind card headers or section titles that don't carry meaning | Remove the color or assign it a semantic role |

### Colored Backgrounds Need Their Own Text Colors

Do not put ordinary gray text on saturated or tinted colored backgrounds. Gray text is tuned for neutral surfaces; on colored surfaces it often looks muddy or fails contrast.

Use:
- white or near-white text on dark saturated backgrounds
- a darker shade of the same hue on pale tinted backgrounds
- semantic foreground tokens such as `--color-primary-foreground`, `--color-danger-foreground`, and `--color-warning-foreground`

Every colored surface should define both background and foreground tokens.

### Accent Borders Over Color Fills

When a component needs a touch of color but does not need to dominate, prefer an accent border, left rail, icon, or small badge over a full colored background. This keeps the page from turning into competing color blocks while still signaling category, status, or emphasis.

---

## 6. Accessible Contrast

### Minimum Contrast Ratios (WCAG AA)

| Content | Minimum Ratio | Example |
| :--- | :--- | :--- |
| **Normal text** (<18px, or <14px bold) | 4.5:1 | Body text, labels, table cells |
| **Large text** (≥18px, or ≥14px bold) | 3:1 | Headings, hero text |
| **UI components & graphics** | 3:1 | Button borders, input borders, icons |

### Common Contrast Failures

| Failure | Why It Happens | Fix |
| :--- | :--- | :--- |
| **Gray text on white** | `#9ca3af` (gray-400) on white = 2.6:1 | Darken to `#6b7280` (gray-500) or darker |
| **Light placeholder text** | `#d1d5db` (gray-300) on white = 1.8:1 | Darken to at least `#9ca3af` (gray-400) |
| **White text on light brand color** | White on `#93c5fd` (blue-300) = 2.0:1 | Use a darker shade of the brand color, or use dark text on light brand backgrounds |
| **Muted error text** | `#fca5a5` (red-300) on white = 2.1:1 | Error messages must be readable — use at least `#ef4444` (red-500) or darker |

**Check contrast** with browser DevTools (color picker shows contrast ratio) or tools like WebAIM's contrast checker. Don't guess.

---

## 7. Status & Semantic Colors

Every UI needs status colors, but the system should be simple and learnable.

### The Standard Set

| Status | Color | Use |
| :--- | :--- | :--- |
| **Success / Positive / Active** | Green | Confirmation messages, "Active" status, positive trends |
| **Warning / Pending / Attention** | Amber/Yellow | Cautions, "Pending" status, approaching limits |
| **Error / Danger / Inactive** | Red | Error messages, "Failed" status, destructive actions |
| **Info / Neutral** | Blue or neutral gray | Informational messages, neutral statuses |

**Don't add more colors for more statuses.** If you need to distinguish 7 statuses, use the 3-4 colors AND text labels. The text label carries the precise meaning; the color carries the urgency. Green + "Deployed" and green + "Completed" can coexist — the shared green means "everything is fine."

---

## 8. Building a Brand Color

If you need to pick a brand/primary color:

1. **Start with a well-known accessible color.** Blue (#2563eb), indigo (#4f46e5), or a blue-adjacent hue that passes contrast with white text.

2. **Generate the full scale.** Use a tool like Tailwind's color generator, UI Colors, or Colormind to create 50-950 shades from a single base color.

3. **Check white text on 500 and 600.** The primary button color (usually 500) must have sufficient contrast with white text (≥4.5:1). If it doesn't, darken it.

4. **Check dark text on 50 and 100.** The subtle background shades should have enough contrast with dark text if used as badge or tag backgrounds.

---

## Review Format (Required)

When reviewing color usage, you MUST use this structure:

1. **Current State Summary:** What color system is in use (tokens, raw values, library defaults)? What's the palette?
2. **Finding → Recommendation Table:**

| # | Current | Issue | Recommendation | Why |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Body text is `#9ca3af` (gray-400) on white background | Fails WCAG AA (2.6:1 contrast) | Use `#6b7280` (gray-500) minimum for body text | Body text must meet 4.5:1 contrast for readability |
| 2 | Raw hex `#3b82f6` used in 12 files instead of `--color-primary` token | Changing the brand color would require editing 12 files | Replace with `var(--color-primary)` | Semantic tokens keep colors consistent and maintainable |
| 3 | Five different status colors (green, red, yellow, purple, teal) with no text labels | Color-only differentiation fails for colorblind users | Reduce to 3-4 colors + always include text labels | Color alone is not an accessible differentiator |

3. **Ergonomic Rationale:** 2-4 sentences on the core color principle driving these recommendations.
