---
name: design-visual-language
description: "Aesthetic direction and visual language principles for digital products: mood, personality, cohesion, materiality, brand fit, restraint, references, and avoiding generic or mismatched styling. Use when a UI feels bland, ugly, incoherent, off-brand, over-styled, or lacking a clear design point of view."
---

# Design Visual Language

Use this skill to decide what the interface should feel like and keep all visual choices aligned with that direction.

For color ramps and semantic tokens, use `ui-color`. For typography mechanics,
use `ui-typography`. This skill owns aesthetic direction, cohesion, and
expressive fit.

## Core Principles

### 1. Name The Direction

A UI needs a visual point of view. Name it before choosing treatments.

Examples:

- quiet, dense operations console
- crisp financial workspace
- warm editorial learning product
- playful consumer creation tool
- premium but restrained commerce experience
- technical developer dashboard

The direction should match the product, audience, and task. Do not apply a dramatic aesthetic to a utilitarian workflow unless it helps the work.

### 2. Choose A Few Signature Traits

A coherent visual language usually has 2-4 signature traits:

- type personality
- density
- shape language
- surface treatment
- image treatment
- accent behavior
- motion style
- illustration style

Everything else should be quiet. Too many signature traits make the UI feel themed rather than designed.

### 3. Make Treatments Belong Together

Common mismatches:

| Mismatch | Why It Feels Wrong |
| :--- | :--- |
| Soft rounded cards plus sharp technical icons | Shape language conflicts |
| Heavy shadows plus flat minimalist typography | Surface model conflicts |
| Playful gradients inside a serious admin tool | Mood conflicts with task |
| Editorial display font in dense tables | Typography personality fights readability |
| Many saturated accents | No stable brand or semantic role |

Visual choices should feel like they came from the same product.

### 4. Avoid Generic Premium

Agents often reach for the same "premium" moves: dark gradients, large rounded cards, glow, glass, heavy blur, huge hero type, and decorative blobs. These are not automatically good design.

Use them only when they match the product and when the content benefits from them. Most tools need restraint, structure, and clarity more than spectacle.

### 5. Match Expression To Task

| Product Surface | Better Direction |
| :--- | :--- |
| SaaS/admin/operator tools | restrained, efficient, high-clarity, low decoration |
| Developer tools | precise, technical, compact, strong information hierarchy |
| Consumer creation apps | expressive, tactile, friendly, stronger motion and visuals |
| Marketing pages | more editorial, stronger imagery, clearer narrative |
| Finance/legal/health | trustworthy, calm, precise, low novelty |

## Measurable Heuristics

Use these checks to make visual language more concrete.

### 60/30/10 Color Budget

Use 60/30/10 as an accent budget, not a law:

| Share | Role In UI |
| :--- | :--- |
| 60% | quiet base: page background, neutral surfaces, ordinary content canvas |
| 30% | supporting structure: cards, panels, secondary surfaces, muted brand presence |
| 10% | accent: primary actions, active states, key highlights, important calls to attention |

For dense tools, the accent share is often under 10%. If a UI feels chaotic, count all saturated fills, bright links, strong badges, and colorful charts as accent usage. If accent usage is everywhere, nothing can lead.

### OKLCH Tonal Ramp Check

When creating or reviewing a single-hue ramp, prefer OKLCH-style thinking:

- keep hue mostly stable across the ramp, unless a deliberate hue shift is part of the brand
- step lightness in a predictable progression from very light to very dark
- let chroma peak around the middle tones and taper near very light/dark tones
- keep neutral chroma low; neutrals with too much chroma feel tinted or muddy
- validate contrast for all text/background pairings

Practical starting points for a 9-step UI ramp:

| Step | Lightness Role |
| :--- | :--- |
| 50 | near-white tint, subtle backgrounds |
| 100-200 | soft backgrounds and hover fills |
| 300-400 | borders, muted accents |
| 500-600 | primary accent and interactive states |
| 700-800 | text on light backgrounds, active emphasis |
| 900 | darkest emphasis or dark-mode surface |

Do not assume equal hue-angle formulas guarantee harmony. Different hues support different chroma at different tones, so check the rendered result.

### Hue Relationship Starting Points

Use hue relationships as starting points, then validate against product mood, contrast, and semantic roles:

| Relationship | Approximate Hue Difference | Use |
| :--- | :--- | :--- |
| analogous | `20-40deg` | calm cohesion, low drama |
| complementary | `180deg` | strong contrast, use sparingly |
| split-complementary | `150deg` and `210deg` | contrast with less tension than direct complement |
| triadic | `120deg` | lively systems, usually too much for dense tools |

For most product UIs, one brand hue plus neutrals and semantic status colors is calmer than a decorative multi-hue palette.

### Accessibility Gate

Visual language cannot override legibility. Before accepting a palette:

- normal text should meet `4.5:1` contrast
- large text should meet `3:1` contrast
- do not use color alone to encode meaning
- test accent text on tinted, saturated, and dark surfaces

## Direction Brief

When establishing visual language, produce:

```markdown
## Visual Direction

Personality: <3-5 adjectives>
Audience fit: <why this direction serves these users>
Signature traits:
- <trait>
- <trait>
- <trait>
Avoid:
- <treatment that would undermine the direction>
- <treatment that would feel generic or mismatched>
Implementation notes:
- <which ui-* skills should carry this into tokens/components>
```

## Review Format

When reviewing visual language, identify:

- the current implied aesthetic
- whether it fits the product and task
- mismatched treatments
- overused or generic styling moves
- color budget, hue relationship, and contrast concerns
- 2-4 traits that should define the product's visual language
