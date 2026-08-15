---
name: compliance-accessibility
description: Accessibility compliance guidance anchored in WCAG 2.2. Use when reviewing keyboard access, semantic structure, accessible names, focus order, contrast, forms, errors, motion, assistive technology support, and WCAG-oriented obligations. Pair with ui-expert, react-accessibility, and ui-color for implementation details.
---

# Compliance Accessibility

## Use When

Use for accessibility reviews, WCAG-oriented fixes, keyboard/screen reader issues, forms, focus, contrast, motion, or accessible error handling.

This is engineering guidance, not legal advice. Escalate formal conformance claims, contract obligations, and jurisdiction-specific accessibility duties.

## Source Anchors

- W3C WCAG 2.2: https://www.w3.org/TR/WCAG22/
- WAI ARIA Authoring Practices Guide: https://www.w3.org/WAI/ARIA/apg/

## Core Position

Accessibility is operability and semantics, not visual polish. Automated checks help, but a meaningful review always includes keyboard flow, accessible names, focus behavior, and user-task completion.

## Checks — run these, then verify by hand

Automated scans catch roughly a third of WCAG issues; they gate the obvious, they do not certify accessibility. Run them in CI, then complete the Review Checklist by keyboard and screen reader.

- **axe-core** (`@axe-core/cli`, `jest-axe`, or `@axe-core/playwright`) — automated WCAG rule scan in tests/CI.
- **eslint-plugin-jsx-a11y** — static lint for missing names, roles, and keyboard handlers at the source.
- **Contrast** — `ui-color`'s `scripts/check_contrast.py` on text and meaningful-indicator pairs (WCAG AA), or the browser's contrast tooling.
- **Keyboard + screen reader** — no tool replaces tabbing the primary flow and listening to it; this is required, not optional.

## Common Agent Mistakes

- Adding ARIA instead of using native HTML.
- Making hover-only controls inaccessible to keyboard/touch users.
- Checking contrast but ignoring focus, names, and error recovery.
- Using color as the only state signal.
- Claiming accessibility from automated tools alone.

## Decision Rubric

| Area | Required Check |
| :--- | :--- |
| Keyboard | Every interactive element can be reached, operated, and exited. |
| Semantics | Native elements and landmarks/headings expose structure. |
| Names | Controls have clear accessible names, roles, and states. |
| Focus | Focus is visible, ordered, trapped/restored for dialogs, and not lost after async changes. |
| Forms/errors | Labels, requirements, help, and errors are programmatically associated. |
| Contrast/color | Text and meaningful indicators meet contrast and do not rely on color alone. |
| Motion | Reduced-motion preference is honored for non-essential motion. |

## Do / Don't

| Do | Don't |
| :--- | :--- |
| Use native controls before custom widgets. | Add ARIA to a non-semantic element when a native element exists. |
| Test the primary flow with keyboard only. | Assume click success means accessibility success. |
| Pair visual state with text/icon/shape. | Use color alone for errors, status, or required fields. |
| Verify manually plus automated scans. | Treat automated a11y output as complete coverage. |

## Review Checklist

- Can the full flow be completed with keyboard only?
- Are headings, landmarks, labels, names, roles, and states meaningful?
- Is focus visible and restored after dialogs, navigation, and async updates?
- Are form errors announced and tied to fields?
- Does contrast pass for text and essential indicators?
- Is motion safe and reduced-motion aware?

## Handoff Rules

- Use `ui-expert` for interaction pattern and UX decisions.
- Use `react-accessibility` for React implementation details.
- Use `ui-color` for contrast and color-system decisions.
