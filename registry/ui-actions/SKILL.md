---
name: ui-actions
description: Select the right affordance pattern for user actions. Decision frameworks for row-level actions (inline vs overflow menu), bulk operations, hover vs static visibility, keyboard shortcuts and command palette, drag-and-drop vs button reordering, and mobile touch adaptations (swipe, bottom sheets, touch targets).
---

# UI Actions — Affordances & Interaction Patterns

A decision engine for choosing how users trigger actions on data. For data display patterns, see `ui-patterns`. For form containers and fields, see `ui-forms`. For empty/loading/error states and notifications, see `ui-feedback`.

## Initial Response

When this skill is first invoked without a specific request, respond only with:

> I'm ready to help you design action affordances — where to place buttons, how to reveal actions, and how to handle bulk operations, keyboard access, and touch interactions. What actions are users performing, and on what kind of items?

Do not provide any other information until the user asks a question or presents an interaction to review.

---

## 1. Single-Row Actions (Tables, Lists, Cards)

Where to put actions, and how to reveal them, dictates perceived robustness and visual clutter.

| Actions per Item | Pattern | Location | Details |
| :--- | :--- | :--- | :--- |
| **1 action** | Single visible button or link | Right-aligned in row, or clicking the entire row. | Text button or high-recognition icon. Never bury a single action in a menu. |
| **2 actions** | Primary + Secondary split | Right side of row. | Primary fully visible; secondary as an adjacent icon. |
| **3–5 actions** | Overflow menu (`···`) + visible primary | Ellipsis button at row end. Put the single most common action visible. | Reduces visual noise; the most-used action stays one click away. |
| **6+ actions** | Overflow menu (`···`) | Ellipsis button. | Consider whether the item model is overloaded — 6+ actions on a row is a design smell. |

### Hover-to-Reveal vs. Static Affordances

- **Never rely solely on hover-to-reveal for primary actions.** It fails on touch devices and forces pointer-hunting on desktop. Linear.app reveals action icons on row hover — but complements with `Cmd+K` command palette for keyboard-first access.
- **Static visibility rule:** If an action is critical to the user's primary workflow (e.g., "Edit", "Approve"), render it statically. If secondary or infrequent (e.g., "Copy ID", "Duplicate"), revealing on hover is an acceptable de-cluttering technique.
- **Keyboard parity:** Every hover-revealed action must be reachable via keyboard — through a context menu (right-click / `Shift+F10`), a command palette, or focus-visible styles.

### The "Click the Row" Affordance

- If clicking a row navigates to a detail view, make the entire row clickable with a pointer cursor.
- If the row is clickable *and* contains inline actions (buttons, links), ensure those action targets have distinct, large-enough click zones — don't make users precision-click to avoid navigating.
- **Checkbox exclusion:** Checkboxes inside clickable rows must stop event propagation so checking doesn't also navigate.

---

## 2. Bulk Actions (Batch Operations)

When users act on multiple items simultaneously:

1. Add **checkboxes** (left-aligned) to each row or card.
2. Reveal a **floating bulk action bar** (sticky header or bottom bar) only when ≥1 item is selected.
3. The bar shows: selected count, available batch actions, and a clear "Deselect all" affordance.
4. **Never** show bulk action buttons on every individual row — they belong in the batch bar.

---

## 3. Swipe Actions (Mobile & Touch)

On touch devices, a horizontal swipe on a list item can reveal 1–2 hidden actions.

Best practices:
- Maximum 2 swipe actions (left-swipe and right-swipe).
- Destructive actions (delete) on the harder-to-trigger side (typically full left-swipe).
- Reveal progressively: short swipe reveals one action, full swipe reveals the second.
- Always provide a visible non-swipe fallback for the same actions (overflow menu or edit screen).
- Swipe actions are a **convenience shortcut**, not the only way to access the action.

---

## 4. Drag & Drop / Reordering

When to offer drag-and-drop vs. simpler alternatives.

| Scenario | Best Pattern | Rationale |
| :--- | :--- | :--- |
| **Reordering 3–20 items** | **Drag handles** (grip icon on each row) + up/down buttons as fallback. | Drag handles signal draggability. Up/down buttons are essential for accessibility and precision. |
| **Moving items between categories** | **Drag across lists** (Trello-style boards). | The spatial metaphor of moving a card between columns is intuitive. |
| **Sorting a large list** (>20 items) | **Sort dropdown** (by name, date, priority) + drag as secondary. | Manual reordering of 50+ items by dragging is tedious. Give users a programmatic sort. |
| **File upload** | **Drop zone** with click-to-browse fallback. | Drag-and-drop for files is universally expected. Always include the click fallback. |
| **Nested / tree reordering** | **Drag with indentation guides** showing where the item lands and at what nesting level. | Without clear drop indicators (line between items, indentation preview), nested drag is confusing. |

### Drag-and-Drop Accessibility

- All drag interactions **must** have a keyboard-accessible alternative (cut/paste, move up/down buttons, or a "Move to..." dropdown).
- Use `aria-grabbed` and `aria-dropeffect` for screen reader announcements.
- Provide visible focus indicators for drag handles.

---

## 5. Keyboard & Power-User Patterns

Patterns that separate great tools from adequate ones.

### Command Palette (`Cmd+K`)

- **Essential for any productivity tool or SaaS with 10+ discrete actions.** Linear, Vercel, Notion, Stripe — every modern tool has one.
- Index: page navigation, entity creation, quick actions (change status, assign), settings search, and recent items.
- Every action available in the command palette reduces the need to design visible buttons for infrequent actions — the palette is the overflow valve.

### Keyboard Shortcuts

| Frequency | Pattern | Example |
| :--- | :--- | :--- |
| **Hundreds/day** (navigate, submit, dismiss) | Single-key or widely-known combos. `Enter`, `Escape`, `Space`. | `Enter` to submit, `Escape` to close modal. |
| **Dozens/day** (create, search, toggle) | `Cmd/Ctrl + single key`. | `Cmd+K` for command palette, `Cmd+F` for search. |
| **Occasional** (specific tools) | `Cmd/Ctrl + Shift + key`. | `Cmd+Shift+P` for command palette in VS Code. |

### Focus Management

- **On modal open:** Move focus to the first focusable element (typically the primary input or close button).
- **On modal close:** Return focus to the element that triggered the modal.
- **On page navigation:** Move focus to the main content heading so screen readers start from the new page's content.
- **On deleting an item in a list:** Move focus to the next item, or the previous if it was the last. Never let focus disappear into the void.

---

## 6. Mobile-Specific Affordances

Patterns that change when screen width drops below ~768px or touch is the primary input.

### Responsive Adaptations

| Desktop Pattern | Mobile Adaptation | Trigger |
| :--- | :--- | :--- |
| **Data Table** | Collapse to card list, or horizontal-scroll with frozen first column. | < 768px or columns overflow. |
| **Sidebar Navigation** | Hamburger menu or bottom tab bar. | < 768px. |
| **Master-Detail Split Panel** | Full-screen transition: list → tap → detail page with back button. | < 768px. |
| **Multi-column Form** | Single-column, full-width fields. | < 600px. |
| **Modal** | Bottom sheet (slides up from bottom) — easier to reach with thumbs. | < 640px or touch device. |
| **Hover-revealed actions** | Always-visible actions (via swipe, long-press, or static icons). | Touch device (no hover). |

### Touch Target Sizing

- **Minimum touch target:** 44×44px (Apple HIG), 48×48px (Material Design). Smaller targets are error-prone.
- **Related actions need spacing:** Enough gap between adjacent icon buttons that a finger doesn't hit both.
- **Primary actions in the "thumb zone"** — the bottom half of the screen on mobile. Critical CTAs at the top are physically hard to reach on large phones.

### Bottom Sheet (Mobile Modal Alternative)

- Slides up from the bottom, partially or fully covering the screen.
- Supports a "grab handle" for drag-to-dismiss.
- Much easier to reach than a centered modal on large phones.
- Supports progressive reveal: half-sheet for quick info, drag up for full detail.

---

## Review Format (Required)

When reviewing action affordances and interactions, use this structure:

1. **Current State Summary:** What actions exist? How are they revealed? What's the user's primary workflow?
2. **Finding → Recommendation Table:**

| # | Current | Issue | Recommendation | Why |
| :--- | :--- | :--- | :--- | :--- |
| 1 | 4 icon buttons per table row | Visual noise, no action hierarchy | Primary action visible + overflow `···` for rest | Reduces scanning cost; users learn the primary action's position |
| 2 | Delete button with no confirmation | Accidental data loss | Undo toast pattern (if reversible) or inline confirmation popover | Prevents mistakes without modal friction |
| 3 | Drag-to-reorder list, no keyboard alternative | Inaccessible to keyboard and screen reader users | Add Move Up / Move Down buttons | Required for WCAG compliance; precision for large lists |

3. **Ergonomic Rationale:** 2–4 sentences on the core UX principle driving these recommendations.