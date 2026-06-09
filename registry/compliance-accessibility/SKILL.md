---
name: compliance-accessibility
description: General accessibility compliance guidance for digital products. Use when reviewing keyboard access, semantic structure, accessible names, focus order, contrast, forms, errors, motion, assistive technology support, and WCAG-oriented obligations. Pair with ui-expert, react-accessibility, and color-expert for implementation details.
---

# Compliance Accessibility

Accessibility means people with different abilities and assistive technologies can perceive, operate, understand, and trust the product.

## Principles

### 1. Prefer Native Semantics

Use native controls and document structure before ARIA. A real button, link, input, heading, list, table, or landmark carries behavior that custom elements must recreate.

### 2. Everything Interactive Must Be Keyboard Operable

Users must be able to reach, understand, operate, and leave every interactive control with the keyboard. Focus order should match visual and task order.

### 3. Names, Roles, And States Must Be Clear

Controls need accessible names that describe their purpose. Custom widgets must expose role, state, and keyboard behavior correctly.

### 4. Do Not Rely On Color Alone

Color can reinforce status but cannot be the only signal. Use text, icons, shape, position, or pattern alongside color. Verify contrast for text and meaningful UI indicators.

### 5. Forms Need Explicit Help And Error Recovery

Labels, requirements, field help, validation errors, and summaries should be programmatically associated with fields. Errors should explain how to fix the problem.

### 6. Respect Motion And Cognitive Load

Avoid flashing content. Honor reduced-motion preferences. Keep flows predictable and avoid time pressure unless necessary.

## Review Checks

- Can the full flow be completed with keyboard only?
- Does the page have meaningful headings, landmarks, labels, and names?
- Is focus visible and restored after dialogs, navigation, and async updates?
- Are errors announced and tied to fields?
- Does contrast pass for text and essential indicators?
- Is accessibility verified with automated checks plus manual keyboard review?
