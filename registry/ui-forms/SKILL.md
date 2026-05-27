---
name: ui-forms
description: Select the right container and field patterns for forms. Decision frameworks for modals vs drawers vs pages based on field count and task nature, input type selection (radio vs select vs autocomplete vs toggle), single-page vs wizard, and settings page organization.
---

# UI Forms — Container & Field Selection

A decision engine for choosing form containers, input types, and layout patterns. For data display patterns (tables, cards, lists), see `ui-patterns`. For action affordances (buttons, menus, bulk ops), see `ui-actions`. For loading/empty/error states on forms, see `ui-feedback`.

## Initial Response

When this skill is first invoked without a specific request, respond only with:

> I'm ready to help you select form containers, field types, and layout patterns. Tell me about the form — how many fields, how often it's used, and what the user's relationship to the surrounding context is.

Do not provide any other information until the user asks a question or presents a form to review.

---

## 1. Form Container Selection

Form complexity — field count, task nature, and relationship to surrounding context — is the primary signal for container choice.

### The Field-Count Heuristic

```
     1 – 3 fields       ───►  Inline Edit / Popover
     3 – 8 fields       ───►  Modal / Dialog
     8 – 15 fields      ───►  Slide-out Drawer or Split Panel
    15 – 30 fields      ───►  Full Page (grouped into sections)
    30+ fields          ───►  Multi-step Wizard or Tabbed Sections
```

| Fields | Container | Best Practice |
| :--- | :--- | :--- |
| **1–3** | **Inline edit or Popover** | Never route to a new page for renaming one thing. Use click-to-edit, a dropdown popover, or a small attached panel. Preserves context and scroll position. |
| **3–8** | **Modal / Dialog** | Self-contained, focused task. Ideal for creating a single entity (new project, invite user). Escape dismisses. Background is inert. |
| **8–15** | **Drawer / Slide-out** | Anchored right or bottom. More vertical room than a modal. Preserves the background for reference. Good for "edit full details" or multi-section config. |
| **15–30** | **Dedicated Full Page** | Needs breathing room. Use clear section groupings. Two-column layout for short label+input pairs. |
| **30+** | **Multi-step Wizard** | Break into 3–5 labeled steps with a progress indicator. Allow backward navigation without data loss. Validate step-by-step; submit only at the final "Confirm" step. |

### Beyond Field Count — Task Nature Adjustments

Field count is the starting heuristic, not the only one. Adjust based on:

- **Frequency of use:** A 3-field form used 50×/day should be inline or a popover, never a modal. A 12-field form used once per quarter can be a full page.
- **Context dependency:** If the user needs to reference the page underneath (e.g., cross-referencing a customer profile while editing an invoice), use a **drawer or split panel**, not a modal. Modals obscure the background.
- **Creation vs. editing:** Creating a new entity benefits from modal focus. Editing an existing entity benefits from a drawer (so the user can see the "before" state).
- **Multi-entity workflows:** If the user creates three related entities in sequence (customer → order → payment), use a wizard rather than three separate modals.

### The Container Escalation Ladder

```
Popover  →  Modal  →  Drawer  →  Full Page  →  Wizard
(light)                                              (heavy)
```

Start as light as possible. Escalate only when content or task demands it. **The cost of escalating unnecessarily is context loss, disorientation, and slower task completion.**

---

## 2. Modals, Drawers, Popovers & Pages

### Modal (Dialog)

**Use when:**
- You need **absolute, isolated focus** — the user must complete or dismiss before continuing.
- The task is short, self-contained, and interactive (3–8 fields, a confirmation, a preview).
- You need to grab attention for critical moments (destructive confirmations, session expiry).

**Avoid when:**
- The form inside is long and requires significant scrolling. Use a drawer or page.
- The user needs to copy-paste or reference content from behind the modal. Use a drawer.
- The task is trivial (1–2 fields). A modal feels like overkill. Use a popover.
- The modal would launch another modal. Nested modals are a UX anti-pattern.

### Drawer / Sheet / Slide-over Panel

**Use when:**
- The content or form is vertically long but doesn't warrant full page navigation.
- The user needs to maintain context — reference or copy from the main view.
- You want a lightweight "Quick View" or "Detail Panel" for drill-down on list items.

**Avoid when:**
- The task is extremely simple (1–3 fields — use a popover).
- The task is a major context shift to a new domain. Use a full page with its own URL.

### Popover (Dropdown Panel)

**Use when:**
- The action is anchored to a specific trigger (button, icon, row).
- The content is small: 1–4 fields, a compact list, or a small preview card.
- The user should not lose position or context.

**Avoid when:**
- The content requires scrolling. Popovers with internal scrollbars feel fragile.
- The user needs to interact with multiple popovers simultaneously.

### Full Page

**Use when:**
- The view deserves its own **URL/route** for bookmarking, sharing, or direct navigation.
- The activity is a **major context shift** (Dashboard → Report Builder, Profile → Billing Portal).
- The page contains rich sub-navigation, multi-pane layouts, or deeply nested content.
- The task is infrequent and warrants full attention (annual tax settings, initial project setup).

---

## 3. Form Field Selection Heuristics

| Input Scenario | Best Control | Avoid |
| :--- | :--- | :--- |
| 2–5 mutually exclusive options | **Radio buttons** | Select dropdown (hides options, extra click). |
| 6–15 mutually exclusive options | **Select dropdown** or **Autocomplete** | Radio buttons (consume too much vertical space). |
| 15+ options | **Autocomplete / Combobox** with search | Raw select dropdown (unscannable). |
| Single on/off, immediate effect | **Toggle switch** | Checkbox (less immediate, less satisfying). |
| Single yes/no in a form (saved on submit) | **Checkbox** | Toggle switch (implies immediate effect, which checkboxes don't). |
| Multiple selections from a medium set | **Multi-select with chips** | Long list of checkboxes (unless ≤5 options). |
| Numeric value with small range (e.g., qty 1–10) | **Stepper / Number input** | Slider (imprecise for exact values). |
| Numeric value with large range + visual feedback | **Slider** | Stepper (tedious for large ranges; e.g., price range filter). |
| Date input | **Date picker** | Free-text date field (format ambiguity). |
| Short free text (≤1 sentence) | **Single-line text input** | Textarea (wasted space, wrong affordance). |
| Long free text (>1 sentence) | **Textarea** | Single-line input (constrained, poor writing experience). |
| Selecting from visual/icon set | **Radio group of cards** or **Select with preview** | Plain text select (loses visual meaning). |

### Toggle vs. Checkbox — The Critical Distinction

- **Toggle switches:** For settings that take effect *immediately* on toggle. "Enable notifications," "Dark mode." The switch implies instant, persistent state change.
- **Checkboxes:** For settings that require an explicit "Save" or "Submit" to take effect. "I agree to terms," "Subscribe to newsletter." The checkbox is a form input, not an action.

---

## 4. Settings & Configuration Pages

Settings pages are often the least-loved part of an app. Good organization prevents them from becoming a dumping ground.

| Number of Settings | Pattern |
| :--- | :--- |
| **1–10** | Single flat page, grouped into 2–3 labeled sections. |
| **10–30** | Grouped sections with headers on one scrollable page + optional sidebar anchor links. |
| **30–100** | Sidebar nav with 5–10 categories, each containing a focused page. Vercel project settings, GitHub repo settings. |
| **100+** | Sidebar + search. A real-time search bar that filters settings by name, description, and section is essential. macOS System Settings, Stripe Dashboard. |

### Settings Page Principles

- **Add search when settings exceed ~20.** Match setting names, descriptions, and the section they live in.
- **Group related settings visually.** Section header "Notifications" with 4 related toggles is clearer than a flat list of 40 items.
- **Show inherited values.** If a setting comes from a parent scope (org → project), show the current value and its source.
- **Don't nest deeper than 3 levels.** `Settings > Security > API Keys` is fine. `Settings > Integrations > Third-Party > Email > Providers > SMTP > Advanced` signals a need to flatten.

### Form Layout Within Settings Pages

- **Single-column for most settings.** Two-column (label left, input right) only when:
  - The input is a short text field or select.
  - Labels are consistently short enough to not wrap.
  - The setting benefit is clear without a description paragraph.
- **Stacked layout (label above input)** when settings need explanatory microcopy below the label.

---

## Review Format (Required)

When reviewing forms, use this structure:

1. **Current State Summary:** Field count, container choice, task frequency, context dependency.
2. **Finding → Recommendation Table:**

| # | Current | Issue | Recommendation | Why |
| :--- | :--- | :--- | :--- | :--- |
| 1 | 12-field form in a modal | Internal scroll, can't reference page behind | Slide-out drawer | Preserves context; more vertical room; user can copy-paste from background |
| 2 | 25-field single page, no grouping | Overwhelming wall of inputs | Group into 4–5 labeled sections | Chunking reduces cognitive load; sticky section nav aids orientation |
| 3 | Radio buttons for 25-item country list | Massive vertical space consumption | Autocomplete/combobox | Same selection power in a single line |

3. **Ergonomic Rationale:** 2–4 sentences on the core UX principle.