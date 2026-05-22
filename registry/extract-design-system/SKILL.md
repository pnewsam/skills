---
name: extract-design-system
description: extract the implicit design system from a codebase into a documented contract (docs/design_system.md). use when starting design work on a project, when the design system has never been documented, or when you suspect the documented system has drifted from reality. reads the codebase to identify spacing scales, color tokens, typography, component patterns, and layout conventions, then produces a structured reference that convergence skills (design-audit, design-fix) can enforce against.
---

# Extract Design System

## Overview

Every codebase has a design system — it's just not always written down. Spacing values cluster around certain numbers. Colors repeat. Typography follows a rough scale. Components share structural patterns. This skill reads the codebase to find those patterns and documents them as an explicit contract.

The output (`docs/design_system.md`) becomes the reference that convergence skills enforce against. Without it, there's nothing to converge toward.

## When to use

- Starting design work on a project for the first time
- The design system has never been documented
- After a round of divergent work (redesigns, new features) that may have introduced new patterns
- When you suspect the documented system has drifted from what's actually in the code

## Workflow

### 1. Survey the codebase

Identify the styling approach and where design decisions live.

```bash
# What styling approach is used?
# Look for: tailwind config, CSS variables, theme files, styled-components, CSS modules
ls tailwind.config.* theme.* src/theme* src/styles* 2>/dev/null
```

Read the relevant configuration files. Look for:
- **Tailwind config** — the `theme` and `extend` sections define the design system explicitly
- **CSS custom properties** — `:root` or theme files with `--color-*`, `--spacing-*`, etc.
- **Theme objects** — JS/TS theme files for styled-components, MUI, Chakra, etc.
- **Design token files** — JSON or YAML token definitions

If a formal design system already exists (e.g., a Tailwind config with extensive customization, or a dedicated `tokens/` directory), the job is to document it — not reinvent it.

### 2. Extract the spacing scale

Find the spacing values actually used in the codebase. Look at:
- Padding and margin values in CSS/Tailwind classes
- Gap values in flex/grid layouts
- Component spacing props

```bash
# For Tailwind projects, the config defines the scale
# For CSS projects, find the most common values
grep -rohE '(padding|margin|gap):\s*[0-9]+px' src/ | sort | uniq -c | sort -rn | head -20
```

Document the scale. Identify:
- The base unit (commonly 4px or 8px)
- The set of values in active use (e.g., 4, 8, 12, 16, 24, 32, 48, 64)
- Any outliers that appear to be one-offs vs. intentional additions

### 3. Extract the color system

Find the color palette in use:
- Named color tokens/variables
- Raw color values and their frequency
- Semantic color roles (primary, secondary, success, warning, danger, background, surface, text)
- Light/dark mode considerations

```bash
# Find color definitions
grep -rohE '#[0-9a-fA-F]{3,8}' src/ | sort | uniq -c | sort -rn | head -30
grep -rn 'color' src/theme* src/styles* tailwind.config.* 2>/dev/null | head -40
```

Document both the palette (the raw colors) and the semantic mapping (what role each color plays).

### 4. Extract the typography scale

Find the type system:
- Font families in use
- Font size scale
- Font weight usage
- Line height values
- Any heading hierarchy

Document the scale and how it maps to UI roles (body, caption, heading levels, labels, etc.).

### 5. Extract component patterns

Survey the component library — both the base/shared components and how they're used:

- **Layout patterns** — how pages are structured (sidebar + main, header + content, grid systems)
- **Card/container patterns** — border radius, shadows, padding conventions
- **Interactive patterns** — button styles, form inputs, dropdowns, modals
- **Feedback patterns** — toasts, alerts, loading states, empty states
- **Spacing between sections** — how much vertical space between page sections, between cards in a list, etc.

Focus on the patterns that repeat across multiple components — these are the system. One-off treatments are not part of the system (though they may be candidates for alignment later).

### 6. Extract layout conventions

Document higher-level layout patterns:
- Page max-width and container behavior
- Grid column structure
- Responsive breakpoints and how the layout adapts
- Sidebar widths, header heights
- Content area padding

### 7. Write the contract

Produce `docs/design_system.md` with the following structure:

```markdown
# Design System

## Spacing

Base unit: Xpx
Scale: [list of values]
Usage: [brief guidance on when to use which values]

## Color

### Palette
[Named colors with values]

### Semantic Roles
[Mapping of roles to palette colors]

## Typography

### Font Families
[List with usage context]

### Type Scale
[Sizes, weights, line heights]

### Hierarchy
[How headings, body, captions, labels are styled]

## Components

### Layout
[Page structure patterns, grid, containers]

### Surfaces
[Cards, panels — border radius, shadow, padding]

### Interactive
[Buttons, inputs, selects — sizing, states]

### Feedback
[Toasts, alerts, loading, empty states]

## Conventions

### Spacing Between Sections
[Vertical rhythm patterns]

### Responsive Behavior
[Breakpoints, adaptation patterns]

### Animation
[If the codebase has consistent animation patterns, document them]
```

Not every section will be relevant to every project. Omit sections that don't apply. Add sections for patterns specific to this codebase.

### 8. Identify inconsistencies

While extracting, you'll inevitably find inconsistencies — places where the codebase disagrees with itself. Note these at the end of the document in an "Inconsistencies" section. These are the first candidates for convergence work (design-audit + design-fix).

## Key principles

- **Describe what is, not what should be.** This skill documents the existing system, not an aspirational one. If the codebase uses 14px and 16px spacing interchangeably, note both and flag the inconsistency — don't just pick one.
- **Prefer the majority pattern.** When there's a clear majority (80% of cards use 12px border-radius, 20% use 8px), document the majority as the system and note the minority as deviations.
- **Stay concrete.** Document actual values, not vague guidance. "Use consistent spacing" is useless. "Section spacing: 32px between major sections, 16px between related items" is actionable.
- **Include code references.** Point to where the canonical definitions live (which file defines the theme, where the base components are, etc.) so the contract stays grounded in the codebase.

## Handling common situations

### The project uses Tailwind with no customization

The design system IS Tailwind's default scale. Document the subset of Tailwind values the project actually uses. The contract is less about defining values and more about documenting which values from Tailwind's large set are the project's chosen subset.

### The project uses a component library (MUI, Chakra, Ant Design)

The library provides the base system. Document how the project customizes or extends it — theme overrides, custom components that sit alongside library components, and any patterns for when to use library components vs. custom ones.

### The project has no consistent system

This happens. Document the most common patterns even if they're not universal. The "Inconsistencies" section may be long. This is valuable — it makes the scope of alignment work visible.

### The project has a documented design system that may be stale

Read both the existing documentation and the actual codebase. Produce a fresh extraction and note where the documentation disagrees with reality. The fresh extraction is the source of truth.
