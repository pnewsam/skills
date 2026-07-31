---
name: ui-icons
description: Icon selection and usage patterns — when to use icons vs text vs both, icon size consistency and optical alignment, recognizable icon choices, icon-only buttons and their accessibility requirements, and integrating icon libraries. Use when choosing icons, reviewing icon usage, or fixing icon accessibility.
---

# UI Icons — Selection & Usage

A decision engine for using icons effectively in the UI. Covers when to use icons, how to size and align them, accessibility requirements, and library selection. For action affordances and button patterns, see `ui-actions`.

## 1. When to Use Icons

Icons are not decoration. Every icon should earn its place by doing one of these jobs:

### Icons Help When

| Purpose | Example | Why the Icon Helps |
| :--- | :--- | :--- |
| **Speeding recognition** | Magnifying glass for search, envelope for email | Recognized faster than reading the word "Search" |
| **Saving space** | Icon-only buttons in a toolbar (bold, italic, underline in a text editor) | Icons fit in 24-40px where text labels wouldn't |
| **Drawing attention** | Warning triangle on an alert, checkmark on success | Icons add visual weight to states where text alone might be overlooked |
| **Reinforcing meaning** | Trash icon next to "Delete", plus icon next to "Add" | Icons provide a second channel of meaning, reducing ambiguity |
| **Crossing language barriers** | Standard navigation icons (home, settings, user) | Universally recognized, don't need translation |

### Icons Hurt When

| Anti-Pattern | Why It's Bad | Fix |
| :--- | :--- | :--- |
| **Unrecognizable icon** | A cryptic icon that the user must guess at | Add a text label, or pick a more recognizable icon |
| **Icon for every menu item** | A sidebar with 12 items, each with a different icon — visual noise without added meaning | Only icon the 3-5 most important items; the rest are text-only |
| **Decorative icons in body text** | An icon before every paragraph "to make it look nice" | Remove them. They add visual noise without meaning |
| **Duplicate meaning** | An icon next to a clear text label where the icon adds nothing (a user icon next to "Profile") | The text is sufficient. The icon is clutter |
| **Different icons for the same action** | "Add" uses a plus in one place, a person-plus in another | Standardize: one icon per action/concept across the app |

### The Decision Rule

```
Does the icon make the UI faster to understand?
  Yes → Use it
  No → Does it save significant space?
    Yes → Use it (with an accessible label)
    No → Don't use it
```

---

## 2. Icon + Label Pairing

### When to Show Both

Show icon AND text label when:
- The action is uncommon and the icon alone might be ambiguous ("Export", "Duplicate", "Archive")
- The icon is in a navigation context where labels aid scanning (sidebar nav items)
- The target audience includes non-power-users who won't learn icon meanings

### When to Show Icon Only

Show icon only when:
- The action is universally recognized (bold, italic, underline in a text editor; close X; hamburger menu)
- Space is extremely constrained (mobile toolbar, table row actions)
- The icon has a tooltip or accessible label explaining it
- The user sees the icon frequently and learns it (repeated use in a toolbar)

### When to Show Text Only

Show text only when:
- No standard icon exists for the concept ("Audit Log", "Custom Reports", "Integrations")
- The icon would be ambiguous and a tooltip isn't sufficient
- The UI element has room for text and adding an icon doesn't improve recognition speed

### Pairing Rules

- **Icon comes before the label** (in left-to-right languages). Don't put the icon after the label — it breaks the scanning pattern.
- **Consistent spacing between icon and label.** 8px is standard. Don't use 4px on one button and 12px on another.
- **Icon and label should be vertically centered** relative to each other. The icon's visual center (not its bounding box center) should align with the text's x-height center.

---

## 3. Icon Sizing

### Standard Sizes

| Size | Value | Use |
| :--- | :--- | :--- |
| **xs** | 12-14px | Inline with text (badges, inline status indicators) |
| **sm** | 16px | Inside buttons with text, table cells, list items |
| **md** | 20px | Standalone icon buttons, sidebar nav items, form field icons |
| **lg** | 24px | Toolbar buttons, page header actions, card header icons |
| **xl** | 32px+ | Feature illustrations, empty state graphics, hero sections |

### Sizing Consistency

All icons at the same level of the UI should be the same size:

- **All sidebar nav icons:** 20px
- **All toolbar icons:** 20-24px
- **All card header icons:** 20px
- **All inline icons (inside text):** match the font size (16px icon in 16px text)

Don't mix 18px and 20px icons in the same toolbar because "this icon looked better at 18px." Consistency matters more than pixel-perfect individual sizing.

### Optical Sizing

Icons don't all have the same visual weight at the same pixel size. A 20px circle icon looks larger than a 20px line icon. When mixing filled and outlined icons:
- Use the same pixel size but accept that some icons will look slightly heavier
- Or use a consistent style (all outlined, or all filled) — this is the better approach

---

## 4. Icon Button Accessibility

Every icon-only button needs an accessible name. Without one, screen readers announce "button" with no indication of what it does.

### Providing Accessible Names

**Best: `aria-label` on the button**

```html
<button aria-label="Delete invoice">
  <TrashIcon />
</button>
```

**Also good: Visually hidden text inside the button**

```html
<button>
  <TrashIcon />
  <span class="sr-only">Delete invoice</span>
</button>
```

**Do not put the accessible name only on the icon**

```html
<!-- Bad: the button itself may still be announced without a useful name -->
<button>
  <TrashIcon aria-label="Delete" />
</button>
```

The button is the interactive element, so the button must own the accessible name. An icon button with no accessible name on the button is a WCAG failure.

### Tooltips as Supplemental, Not Primary

A tooltip that appears on hover is NOT a substitute for an accessible label. Tooltips are not available to keyboard or screen reader users. Always provide an `aria-label` AND optionally a tooltip for sighted mouse users.

```html
<button aria-label="Delete invoice" title="Delete invoice">
  <TrashIcon />
</button>
```

---

## 5. Choosing an Icon Library

### Library Options

| Library | Style | Size | Best For |
| :--- | :--- | :--- | :--- |
| **Lucide** | Outlined, clean | 1,400+ | Modern SaaS apps, dashboards, tools |
| **Heroicons** | Outlined + solid | 300+ | Tailwind projects, simple UIs |
| **Phosphor** | 6 styles (thin to fill) | 1,400+ | UIs that need multiple weights |
| **Tabler Icons** | Outlined | 4,700+ | Apps that need a very wide range of icons |
| **Material Symbols** | 3 styles, variable weight | 3,000+ | Apps following Material Design |
| **Font Awesome** | Classic, solid, brands | 2,000+ | Legacy projects, marketing sites |
| **Radix Icons** | Crisp 15x15 grid | 300+ | Radix UI projects |

### Library Selection Criteria

1. **Match the design language.** Lucide and Heroicons are clean and modern. Material Symbols are Google-flavored. Font Awesome has a distinct "traditional web" feel. Pick icons that match the app's visual style.

2. **Coverage.** Does the library have icons for all the concepts in the app? Missing icons lead to mixing libraries (bad) or choosing inappropriate icons (worse).

3. **Consistent design.** All icons from the same library share stroke width, corner radius, and grid size. Mixing libraries breaks this consistency.

4. **Tree-shaking.** Import only the icons you use, not the whole library. All modern icon libraries support this.

### Importing Only What You Use

```jsx
// Good: tree-shakeable, only ships used icons
import { Trash2, Plus, Search, Settings } from "lucide-react";

// Bad: imports the entire library
import * as Icons from "lucide-react";
```

---

## 6. Consistent Icon Choices

### One Concept, One Icon

The same concept should use the same icon everywhere in the app:

| Concept | Use This Icon | Not This |
| :--- | :--- | :--- |
| Settings / Preferences | `Settings` or `Sliders` | Don't use `Settings` on one page and `Sliders` on another |
| Delete / Remove | `Trash2` | Don't use `Trash2`, `X`, and `Trash` interchangeably |
| Add / Create | `Plus` | Don't use `Plus` for buttons and `SquarePlus` for menus |
| Edit | `Pencil` or `Pen` | Pick one |
| Search | `Search` (magnifying glass) | Don't use `Search` and `ScanSearch` interchangeably |
| User / Profile | `User` or `CircleUser` | Pick one |
| Close / Dismiss | `X` | Don't use `X` and `XCircle` interchangeably |

Document icon choices in the design system so new contributors use the same icons.

### Icon Antipatterns

| Problem | Why It Happens | Fix |
| :--- | :--- | :--- |
| **Creative uniqueness** | "I'll use a star for 'favorite' on this page and a heart on this other page to keep it fresh" | Consistency over creativity. Same concept, same icon. |
| **Wrong metaphor** | Using a floppy disk for "Save" in a cloud-native app; using a wrench for "Build" | Use modern metaphors that users under 30 understand, or use text if no good icon exists |
| **Overly specific icons** | Using `FileSpreadsheet` instead of `File` for a generic file | Use the most general recognizable icon that conveys the concept |
| **Icon bloat** | Every row, every menu item, every heading gets an icon | Only icon what benefits from being icon'd. A sidebar with 20 icon+label items is visual noise |

---

## 7. Icon Color

### Icon Color Rules

| Context | Icon Color | Rationale |
| :--- | :--- | :--- |
| **Navigation (sidebar, tabs)** | `text-secondary` (current), `text-muted` (inactive) | Active icon is slightly more prominent than inactive |
| **Action buttons (with label)** | Match the text color of the button | Icon and label are one unit |
| **Icon-only buttons** | `text-secondary` default, `text-primary` on hover | Slightly muted to reduce visual noise in toolbars |
| **Status indicators** | Semantic color matching the status | Green for success, red for error — consistent with the rest of the UI |
| **Inline with body text** | Match the text color | The icon is part of the text flow |
| **Form field icons** (inside inputs) | `text-muted` | The icon is a hint, not the content |

### Don't Color Icons Individually

A toolbar where one icon is blue, one is green, and one is red is visually chaotic. Icons at the same level should use the same color unless the color carries semantic meaning (status indicators).

---

## 8. Animated Icons

Animation can make icons feel more responsive and delightful, but only in specific contexts:

**Good candidates for animation:**
- A hamburger menu icon that morphs to a close X (transition between states)
- A copy icon that briefly changes to a checkmark after copying (feedback)
- A loading spinner replacing a button icon during submission (state change)
- A notification bell that rings/shakes on a new notification (drawing attention)

**Don't animate:**
- Static navigation icons
- Icons in data tables or lists (too many simultaneous animations)
- Icons that the user sees hundreds of times per day (see `emil-design-eng` animation frequency rules)

**Keep it short:** 150-300ms. A morphological icon transition should feel like feedback, not a performance.

---

## Review Format (Required)

When reviewing icon usage, you MUST use this structure:

1. **Current State Summary:** What icon library is in use? Where are icons used (buttons, nav, tables)? Are there icon-only buttons?
2. **Finding → Recommendation Table:**

| # | Current | Issue | Recommendation | Why |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Icon-only delete button with no `aria-label` | Inaccessible to screen readers — announces as "button" with no context | Add `aria-label="Delete invoice"` to the button | Every interactive element needs an accessible name |
| 2 | "Add" uses `Plus` on the list page and `UserPlus` on the detail page for the same action | Inconsistent icon erodes user confidence in what the button does | Standardize to `Plus` everywhere for "Create new" | One concept, one icon — across the entire app |
| 3 | 14 icons in a sidebar, each a different color | Visual noise; colors don't carry meaning | Use one color (`text-secondary`) for all nav icons | Color should carry semantic meaning or be uniform — not differ arbitrarily |

3. **Ergonomic Rationale:** 2-4 sentences on the core icon principle driving these recommendations.
