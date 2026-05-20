---
name: react-accessibility
description: accessibility principles for React applications — semantic HTML, keyboard navigation, ARIA patterns, focus management, forms, dynamic content, and color/contrast. reference this skill when building interactive components, forms, modals, navigation, or any user-facing UI.
---

# React Accessibility

## Overview

This skill covers the accessibility patterns that matter in React applications. The core philosophy: **use the platform first.** HTML has built-in semantics, keyboard behavior, and screen reader support. Use the right elements before reaching for ARIA. When you do need ARIA, use established widget patterns rather than inventing your own.

Accessibility is not a separate concern bolted on at the end — it's a design constraint that shapes component APIs, keyboard interactions, and state management from the start.

## Principles

### 1. Semantic HTML first

The most impactful accessibility decision is choosing the right HTML element. Native elements come with keyboard behavior, screen reader semantics, and focus management for free.

| Instead of... | Use... | You get for free |
|---|---|---|
| `<div onClick>` | `<button>` | Focus, Enter/Space activation, `role="button"`, disabled state |
| `<div>` with click handler for navigation | `<a href>` | Focus, Enter activation, right-click/new-tab, screen reader link semantics |
| `<div>` as a list | `<ul>` / `<ol>` + `<li>` | Screen reader announces list length and position ("item 3 of 7") |
| `<span>` for a heading | `<h1>`–`<h6>` | Document outline, screen reader heading navigation, SEO |
| `<div>` as a text input | `<input>` | Focus, selection, clipboard, autocomplete, mobile keyboard, form submission |
| `<div>` as a checkbox | `<input type="checkbox">` | Toggle with Space, `checked` state announced, works in forms |

**The rule:** If an HTML element does what you need, use it. Only reach for `role`, `tabIndex`, and `aria-*` when there's no native element that fits (custom select menus, tab panels, tree views, etc.).

### 2. Keyboard navigation

Every interactive element must be operable with a keyboard. This is non-negotiable — it affects users who can't use a mouse, screen reader users, and power users who prefer the keyboard.

**Fundamental keyboard expectations:**

| Key | Expected behavior |
|---|---|
| Tab | Move focus to the next interactive element |
| Shift+Tab | Move focus to the previous interactive element |
| Enter | Activate a button or link |
| Space | Activate a button, toggle a checkbox, open a select |
| Escape | Close a modal, popover, dropdown, or dialog |
| Arrow keys | Navigate within a widget (tabs, menus, list items, radio groups) |

Native HTML elements handle Tab, Enter, and Space automatically. Arrow key navigation and Escape are your responsibility for custom widgets.

**Tab order:**
- Follow the visual order. Don't use `tabIndex` values greater than 0 — they create a confusing, non-sequential tab order.
- `tabIndex={0}` makes an element focusable in the natural tab order (rare — usually means you should use a `<button>` instead).
- `tabIndex={-1}` makes an element programmatically focusable but removes it from the tab order (useful for focus management — e.g., focusing a heading after navigation).

**Arrow key navigation pattern** (for menus, tabs, listboxes):

```tsx
function useRovingTabIndex(items: HTMLElement[]) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    let next = activeIndex;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      next = (activeIndex + 1) % items.length;
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      next = (activeIndex - 1 + items.length) % items.length;
    } else if (e.key === "Home") {
      next = 0;
    } else if (e.key === "End") {
      next = items.length - 1;
    } else {
      return; // don't prevent default for unhandled keys
    }
    e.preventDefault();
    setActiveIndex(next);
    items[next]?.focus();
  };

  return { activeIndex, handleKeyDown };
}
```

The roving tabindex pattern: only the active item in a group has `tabIndex={0}`; all others have `tabIndex={-1}`. Tab moves focus in/out of the group; arrows move within it.

### 3. ARIA for custom widgets

When you build a widget that has no native HTML equivalent (tabs, combobox, tree view, toolbar), use WAI-ARIA roles, states, and properties to communicate its purpose and state to assistive technology.

**Common widget patterns:**

**Tabs:**
```tsx
<div role="tablist">
  <button role="tab" aria-selected={activeTab === "general"} aria-controls="panel-general">
    General
  </button>
  <button role="tab" aria-selected={activeTab === "security"} aria-controls="panel-security">
    Security
  </button>
</div>
<div role="tabpanel" id="panel-general" aria-labelledby="tab-general">
  {/* General settings content */}
</div>
```

**Dialog / Modal:**
```tsx
<div role="dialog" aria-modal="true" aria-labelledby="dialog-title">
  <h2 id="dialog-title">Confirm deletion</h2>
  <p>This action cannot be undone.</p>
  <button onClick={onConfirm}>Delete</button>
  <button onClick={onCancel}>Cancel</button>
</div>
```

**Key ARIA rules:**
- `aria-label` or `aria-labelledby` — every interactive element and landmark needs an accessible name
- `aria-describedby` — link to supplementary text (error messages, help text)
- `aria-expanded` — for toggles that show/hide content (accordions, dropdowns)
- `aria-live` — for dynamic content that should be announced (see Principle 6)
- Don't use `role` to override semantics of native elements — a `<button role="link">` is confusing; just use an `<a>`

**First rule of ARIA:** Don't use ARIA if a native HTML element can do the job. ARIA adds semantics but no behavior — you still have to implement keyboard handling, focus management, and state management yourself.

For complex primitives such as dialogs, popovers, menus, comboboxes, tooltips, and date pickers, prefer the project's existing accessible design-system primitive or a proven library such as React Aria, Radix UI, Ariakit, or Headless UI. Hand-rolled ARIA widgets are easy to get subtly wrong.

### 4. Focus management

When the UI changes dynamically — a modal opens, a route changes, content loads — focus needs to move to the right place. Without this, keyboard and screen reader users get lost.

**Modal / dialog focus:**
- When a modal opens, move focus to the first focusable element inside it (or the dialog itself)
- Trap focus inside the modal — Tab should cycle through modal content, not escape to the page behind
- When the modal closes, return focus to the element that triggered it

```tsx
function useModalFocus(isOpen: boolean, triggerRef: RefObject<HTMLElement>) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus the modal or its first focusable element
      modalRef.current?.focus();
    } else {
      // Return focus to trigger
      triggerRef.current?.focus();
    }
  }, [isOpen, triggerRef]);

  return modalRef;
}
```

For focus trapping, use a library like `focus-trap-react` rather than implementing it from scratch — the edge cases (iframes, shadow DOM, dynamically added content) are numerous.

**Route change focus:**
When the user navigates to a new page, focus should move to the main content area or the page heading. Without this, focus stays on the navigation link and screen reader users don't know the page changed.

```tsx
// After route change, focus the main heading
useEffect(() => {
  const heading = document.querySelector("h1");
  if (heading instanceof HTMLElement) {
    heading.tabIndex = -1;
    heading.focus();
  }
}, [pathname]);
```

**Deletion focus:**
When the user deletes an item from a list, move focus to a sensible place — the next item, the previous item, or a summary element. Don't leave focus on a now-removed element (it vanishes from the DOM and focus drops to `<body>`).

### 5. Accessible forms

Forms are the highest-stakes area for accessibility — they're where users input data, encounter errors, and need the most guidance.

**Labels are mandatory:**
Every input must have a label. Use `<label htmlFor="id">` or `aria-label` for visually hidden labels. Placeholder text is not a label — it disappears when the user starts typing.

```tsx
// Good: visible label
<label htmlFor="email">Email</label>
<input id="email" type="email" />

// Good: visually hidden label (e.g., a search box with a visible icon)
<input type="search" aria-label="Search invoices" />

// Bad: placeholder as only label
<input type="email" placeholder="Email" />
```

**Error messages:**
Connect error messages to their inputs with `aria-describedby` and mark invalid inputs with `aria-invalid`:

```tsx
<label htmlFor="email">Email</label>
<input
  id="email"
  type="email"
  aria-invalid={!!error}
  aria-describedby={error ? "email-error" : undefined}
/>
{error && <span id="email-error" role="alert">{error}</span>}
```

**Focus on validation failure:**
When the user submits a form and there are errors, move focus to the first invalid field. This is critical — without it, screen reader users don't know what went wrong.

```tsx
const onSubmit = async (data) => {
  const errors = validate(data);
  if (errors) {
    // Focus the first field with an error
    const firstErrorField = document.querySelector("[aria-invalid='true']");
    if (firstErrorField instanceof HTMLElement) firstErrorField.focus();
    return;
  }
  // submit...
};
```

**Group related fields:**
Use `<fieldset>` and `<legend>` for groups of related inputs (address fields, radio groups, checkbox groups). Screen readers announce the legend as context for each field in the group.

```tsx
<fieldset>
  <legend>Billing Address</legend>
  <label htmlFor="street">Street</label>
  <input id="street" />
  <label htmlFor="city">City</label>
  <input id="city" />
</fieldset>
```

### 6. Dynamic content and live regions

When content changes without a page reload — a notification appears, a counter updates, a status changes — screen readers need to be told. Use `aria-live` regions:

```tsx
// Polite: announced after the screen reader finishes current speech
<div aria-live="polite">
  {statusMessage && <p>{statusMessage}</p>}
</div>

// Assertive: interrupts current speech (use sparingly — errors, urgent alerts)
<div role="alert">
  {errorMessage && <p>{errorMessage}</p>}
</div>
```

**`role="alert"`** is shorthand for `aria-live="assertive"` + `aria-atomic="true"`. Use it for error messages and urgent notifications.

**`role="status"`** is shorthand for `aria-live="polite"`. Use it for non-urgent status updates ("3 results found", "Saved successfully").

**Key detail:** The live region element must be in the DOM *before* the content changes. Don't conditionally render the `aria-live` container — render it always, and conditionally render the message inside it.

```tsx
// Bad: live region mounts with the message — screen reader may miss it
{message && <div aria-live="polite">{message}</div>}

// Good: live region is always present, message appears inside it
<div aria-live="polite">
  {message && <p>{message}</p>}
</div>
```

### 7. Color and contrast

- **Don't rely on color alone** to convey meaning. An error state should have an icon or text label, not just a red border. A link should be underlined or otherwise distinguishable, not just a different color.
- **Meet WCAG contrast ratios:** 4.5:1 for normal text, 3:1 for large text (18px+ or 14px+ bold), 3:1 for UI components and graphical objects.
- **Test with tools:** Browser DevTools has a contrast checker in the color picker. Lighthouse audits catch contrast failures.
- **Support user preferences:** Respect `prefers-reduced-motion` for animations and `prefers-color-scheme` for dark mode. Use CSS media queries:

```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

### 8. Visually hidden content

Sometimes content is needed for screen readers but not visually. Use a visually-hidden utility class (not `display: none` or `visibility: hidden`, which hide from screen readers too):

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

Common uses:
- Skip-to-content links (visible on focus, hidden otherwise)
- Icon-only button labels: `<button><Icon /><span className="sr-only">Close</span></button>`
- Table captions or section headings that are visually implied by layout

### 9. Testing accessibility

**Automated testing catches ~30-40% of issues.** Use it as a baseline, not a guarantee:

- **axe-core** (via `jest-axe` or `@axe-core/react`) — catches missing labels, invalid ARIA, contrast failures, missing alt text
- **ESLint** — `eslint-plugin-jsx-a11y` catches common issues at lint time (missing `alt`, click handlers without keyboard equivalents)
- **Lighthouse** — accessibility audit in Chrome DevTools
- **Playwright accessibility checks** — run axe or equivalent checks against critical browser flows, especially forms, dialogs, and navigation

**Manual testing catches the rest:**
- **Keyboard-only navigation:** Unplug your mouse and navigate the feature. Can you reach everything? Is the focus order logical? Can you escape modals?
- **Screen reader testing:** VoiceOver (macOS), NVDA (Windows), or similar. Test the primary user flows. Is the content announced in a sensible order? Are interactive elements clearly labeled? Are state changes announced?
- **Zoom to 200%:** Does the layout still work? Is content still readable and usable?
