---
name: create-design-system
description: create a documented design system contract (docs/DESIGN_SYSTEM.md) for a project. when existing patterns are present in the codebase, derives the system from those patterns — extracting spacing scales, color tokens, typography, component patterns, and layout conventions. when no patterns exist (greenfield), proposes a complete design system with a cohesive aesthetic, spacing scale, color palette, and typography. use when starting design work, when a design system has never been documented, or when the documented system has drifted from reality.
---

# Create Design System

## Overview

Every project needs a design system contract — an explicit reference that downstream skills (design-audit, design-fix) can enforce against. This skill creates that contract. It works in two modes:

- **Derive mode**: when the codebase already has patterns, extract and document them. This is the common case for existing projects.
- **Propose mode**: when starting fresh (greenfield) or when the existing patterns are too inconsistent to derive from, propose a complete design system.

The output is always `docs/DESIGN_SYSTEM.md` — a structured reference that makes design decisions explicit and enforceable.

## When to use

- Starting design work on a project for the first time
- The design system has never been documented
- After a round of divergent work (redesigns, new features) that may have introduced new patterns
- When you suspect the documented system has drifted from what's actually in the code
- Setting up a new project that needs a design foundation

## Mode selection

### Determining the mode

Survey the codebase to decide:

```bash
# Check for existing styling infrastructure
ls tailwind.config.* theme.* src/theme* src/styles* 2>/dev/null
# Check for component files
find src/ -name '*.tsx' -o -name '*.jsx' -o -name '*.vue' -o -name '*.svelte' | head -30
# Check for existing design tokens
find . -name 'tokens.*' -o -name 'variables.*' -o -name '*.css' | head -10
```

**Use derive mode when:**
- The project has a non-trivial amount of UI code with visible patterns
- A styling infrastructure exists (Tailwind config, theme files, CSS variables)
- Components follow repeatable conventions even if not formally documented

**Use propose mode when:**
- The project is new with little or no UI code
- The existing UI is too inconsistent to extract a meaningful system
- The user explicitly asks for a new design system rather than documenting the current one
- The existing system is fundamentally broken and the user wants a fresh start

**Use a blended approach when:**
- Some domains have strong patterns (e.g., spacing) while others are inconsistent (e.g., color)
- Derive where there's a clear majority pattern, propose where there isn't

If unsure, default to derive mode — it's always safer to document what exists than to impose something new.

## Workflow: Derive Mode

### 1. Survey the codebase

Identify the styling approach and where design decisions live.

Read the relevant configuration files. Look for:
- **Tailwind config** — the `theme` and `extend` sections define the design system explicitly
- **CSS custom properties** — `:root` or theme files with `--color-*`, `--spacing-*`, etc.
- **Theme objects** — JS/TS theme files for styled-components, MUI, Chakra, etc.
- **Design token files** — JSON or YAML token definitions

If a formal design system configuration already exists (e.g., a Tailwind config with extensive customization, or a dedicated `tokens/` directory), the job is to document it — not reinvent it.

### 2. Extract the spacing scale

Find the spacing values actually used in the codebase:

```bash
# For Tailwind projects, the config defines the scale
# For CSS projects, find the most common values
grep -rohE '(padding|margin|gap):\s*[0-9]+px' src/ | sort | uniq -c | sort -rn | head -20
```

Document the scale:
- The base unit (commonly 4px or 8px)
- The set of values in active use (e.g., 4, 8, 12, 16, 24, 32, 48, 64)
- Any outliers that appear to be one-offs vs. intentional additions

### 3. Extract the color system

```bash
grep -rohE '#[0-9a-fA-F]{3,8}' src/ | sort | uniq -c | sort -rn | head -30
grep -rn 'color' src/theme* src/styles* tailwind.config.* 2>/dev/null | head -40
```

Document both the palette (raw colors) and the semantic mapping (what role each color plays):
- Named color tokens/variables
- Raw color values and their frequency
- Semantic color roles (primary, secondary, success, warning, danger, background, surface, text)
- Light/dark mode considerations

### 4. Extract the typography scale

Find the type system:
- Font families in use
- Font size scale
- Font weight usage
- Line height values
- Any heading hierarchy

### 5. Extract component patterns

Survey the component library:

- **Layout patterns** — how pages are structured (sidebar + main, header + content, grid systems)
- **Card/container patterns** — border radius, shadows, padding conventions
- **Interactive patterns** — button styles, form inputs, dropdowns, modals
- **Feedback patterns** — toasts, alerts, loading states, empty states
- **Spacing between sections** — vertical rhythm between page sections, between cards in a list

Focus on patterns that repeat across multiple components — these are the system. One-off treatments are not part of the system.

### 6. Extract layout conventions

- Page max-width and container behavior
- Grid column structure
- Responsive breakpoints and how the layout adapts
- Sidebar widths, header heights
- Content area padding

## Workflow: Propose Mode

### 1. Understand the product

Before proposing a system, understand what's being built:
- What kind of product is this? (SaaS dashboard, marketing site, developer tool, consumer app)
- Who uses it? (power users, casual users, developers, consumers)
- What's the brand personality? (professional, playful, minimalist, technical)
- Are there existing brand assets? (logo, brand colors, marketing site)

If `docs/CHARTER.md` exists, read it for product direction.
If a `design-consultation` has been run, read its output.

### 2. Propose the aesthetic direction

Write a brief aesthetic statement (2-3 sentences) that anchors all downstream decisions:

> "A clean, high-density developer dashboard. Dark-forward with accent color for focus. Typography-driven hierarchy with minimal decoration. Spacing is tight but rhythmic — information density over breathing room."

This statement resolves arguments before they start. Every spacing, color, and typography choice should be consistent with it.

### 3. Propose the spacing scale

Choose a base unit and scale appropriate to the aesthetic:

| Aesthetic | Base | Scale |
|---|---|---|
| High-density dashboards, dev tools | 4px | 4, 8, 12, 16, 20, 24, 32, 40, 48 |
| Consumer, marketing, content | 8px | 8, 16, 24, 32, 48, 64, 80, 96 |
| Hybrid (most SaaS) | 4px | 4, 8, 12, 16, 24, 32, 48, 64 |

### 4. Propose the color palette

Define:
- **Brand/accent color** — the primary color for buttons, links, focus states
- **Neutral scale** — 3-5 grays for backgrounds, surfaces, borders, text
- **Semantic colors** — success (green), warning (amber), danger (red), info (blue)
- **Background hierarchy** — default page bg, elevated surface bg, hover state bg
- **Text hierarchy** — primary text, secondary text, muted/disabled text

Each color should have a clear semantic role. Avoid orphan colors with no defined purpose.

### 5. Propose the typography system

Define:
- **Font families** — UI font (system font stack is often right), display font if needed, mono font for code
- **Type scale** — size, weight, and line height for each level
- **Semantic mapping** — heading-1 through caption, body, label

Prefer system font stacks unless there's a strong brand reason otherwise. They're free, they load instantly, and they look native on every platform.

### 6. Propose component conventions

Define the baseline for common component types:
- **Border radius** — none (sharp), small (4px), medium (8px), large (12px), full (rounded-full)
- **Shadows** — none, subtle, medium, heavy (with values)
- **Button sizing** — sm, md, lg (with padding and font size for each)
- **Input sizing** — to match buttons
- **Card padding** — default interior padding

### 7. Propose layout conventions

- Page max-width
- Container padding at each breakpoint
- Responsive breakpoints
- Sidebar width (if applicable)

## Writing the Contract

Both modes produce the same output structure:

```markdown
# Design System

## Aesthetic

{A 2-3 sentence statement that anchors all decisions. In derive mode, infer this from the patterns found. In propose mode, write it fresh.}

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
[If consistent animation patterns exist or are proposed, document them]
```

Not every section applies to every project. Omit sections that don't apply. Add sections for patterns specific to this codebase.

### Consistency notes

At the end of the contract, add a section documenting where the codebase disagrees with the system:

```markdown
## Consistency Notes

{In derive mode: where does the codebase disagree with itself? Where do patterns conflict?}

{In propose mode: where will existing code need to change to align with the new system?}

These are the first candidates for convergence work (design-audit + design-fix).
```

## Key principles

- **In derive mode, describe what is, not what should be.** Document the existing system. If the codebase uses two conflicting spacing values, note both and flag the inconsistency — don't just pick one.
- **In propose mode, be decisive.** Don't offer options. Make a choice and commit to it. The team can adjust later.
- **Prefer the majority pattern.** When there's a clear majority (80% of cards use 12px border-radius, 20% use 8px), document the majority as the system and note the minority as deviations.
- **Stay concrete.** Document actual values. "Use consistent spacing" is useless. "Section spacing: 32px between major sections, 16px between related items" is actionable.
- **Include code references.** Point to where the canonical definitions live (which file defines the theme, where base components are) so the contract stays grounded in the codebase.
- **The aesthetic matters.** A good design system reflects a point of view. The aesthetic statement is not decoration — it's the decision-making anchor.

## Handling common situations

### The project uses Tailwind with no customization

The design system IS Tailwind's default scale. Document the subset of Tailwind values the project actually uses. The contract documents which values from Tailwind's large set are the project's chosen subset.

### The project uses a component library (MUI, Chakra, Ant Design)

The library provides the base system. Document how the project customizes or extends it — theme overrides, custom components alongside library components, and when to use library vs. custom components.

### The project has no consistent system (derive mode)

This happens. Document the most common patterns even if they're not universal. The "Consistency Notes" section may be long. This is valuable — it makes the scope of alignment work visible. If the inconsistency is severe enough that deriving is meaningless, switch to propose mode.

### The project has a documented design system that may be stale

Read both the existing documentation and the actual codebase. If they largely agree, update the doc. If they've diverged significantly, derive fresh from the codebase and note what changed.

### Greenfield project

Use propose mode. Don't try to derive from a few starter files. Make clear, decisive choices. The team can evolve the system later — the important thing is that there IS a system to converge toward.

### User asks for a new design system for an existing project

Confirm: do they want a fresh system (propose mode) or to document what exists (derive mode)? If they want fresh, understand that existing code will need to be brought into alignment. Flag this in the "Consistency Notes" section so the scope of migration work is visible from the start.