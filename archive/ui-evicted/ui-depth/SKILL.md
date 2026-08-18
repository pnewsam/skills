---
name: ui-depth
description: Surface, elevation, shadow, layering, and image-treatment principles for UI. Use when designing or reviewing shadows, raised surfaces, overlays, cards, modals, inset controls, overlapping layers, image crops, text over images, user-uploaded media, or finishing visual polish. For color tokens, see ui-color. For spacing and layout, see ui-spacing and ui-layouts.
---

# UI Depth - Surfaces, Elevation & Media

A decision engine for adding depth without visual clutter. Covers elevation systems, shadow usage, layered surfaces, subtle borders, image treatment, and media safety. For page structure, see `ui-layouts`. For visual importance, see `visual-hierarchy`.

## 1. Elevation Is Meaning

Depth should communicate relationship, not decoration.

| Elevation | Treatment | Use |
| :--- | :--- | :--- |
| **Base** | Page background, no shadow | Default canvas |
| **Surface** | White or subtle neutral surface, border or tiny shadow | Cards, panels, table containers |
| **Raised** | Stronger shadow, clearer separation | Dropdowns, popovers, sticky controls |
| **Overlay** | Highest shadow + backdrop or scrim | Modals, command palettes, blocking dialogs |
| **Inset** | Inner shadow or recessed border | Text inputs, wells, embedded code blocks |

**Rules:**
- Higher elevation must sit visually above lower elevation. A dropdown should look above the card it opens from.
- Do not give every card a strong shadow. If every surface floats, nothing feels grounded.
- Use elevation consistently. A modal shadow should not be weaker than a card shadow.

---

## 2. Shadow System

Define a small shadow scale and reuse it. Avoid hand-tuned shadows per component.

| Token | Example CSS | Use |
| :--- | :--- | :--- |
| `shadow-sm` | `0 1px 2px rgb(0 0 0 / 0.08)` | Subtle cards, buttons |
| `shadow-md` | `0 4px 8px rgb(0 0 0 / 0.10)` | Popovers, dropdowns |
| `shadow-lg` | `0 12px 24px rgb(0 0 0 / 0.14)` | Modals, command palettes |
| `shadow-inset` | `inset 0 1px 2px rgb(0 0 0 / 0.08)` | Inputs, recessed wells |

### Two-Part Shadows

More realistic shadows often combine:

- **Contact shadow:** small blur, low offset, slightly darker; anchors the object.
- **Ambient shadow:** larger blur, larger spread, lighter; shows surrounding elevation.

Use two-part shadows for overlays and important raised surfaces, not for every card.

---

## 3. Light Source Consistency

Assume one light source, usually above the UI. Shadows should generally fall downward. Mixed shadow directions make the interface feel fake and noisy.

**Avoid:**
- Shadows that point upward on one component and downward on another.
- Heavy glow around all sides of a card when only slight separation is needed.
- Combining strong borders and strong shadows on the same surface unless the design language intentionally calls for it.

---

## 4. Depth Without Shadows

Flat designs can still show depth through:

- Surface color: raised surfaces slightly lighter than the page in light mode, slightly lighter than background in dark mode.
- Borders: subtle borders for low elevation, especially in dense tools.
- Overlap: one element partially covering another to establish layering.
- Inset treatment: inputs and wells can feel recessed with inner shadow, background tint, or border.

Prefer subtle borders over shadows for dense SaaS tables and settings pages. Prefer shadows for transient overlays like menus and dialogs.

---

## 5. Image Treatment

Images need constraints. They should not dictate the layout unless the product is image-first.

### Intended Size

Every image slot should define:
- aspect ratio
- object fit (`cover` for thumbnails, `contain` for inspectable assets)
- min/max dimensions
- fallback treatment if the image fails or is missing

Do not let user-uploaded images resize cards, tables, or page sections unpredictably.

### Text Over Images

Text over images needs consistent contrast regardless of the image:
- Use a scrim, gradient overlay, or solid text backing.
- Test against light, dark, busy, and low-contrast images.
- Do not rely on white text directly over arbitrary images.

### User-Uploaded Media

User-uploaded images are unpredictable. Plan for:
- very light and very dark images
- tiny images scaled up
- panoramic or portrait aspect ratios
- transparent PNGs
- missing alt text or filenames

Use neutral placeholders, fixed aspect-ratio containers, and explicit cropping rules.

---

## Review Format (Required)

When reviewing depth, surfaces, or image treatment, you MUST use this structure:

1. **Current State Summary:** What surfaces exist? What appears raised, recessed, or layered? How are images constrained?
2. **Finding -> Recommendation Table:**

| # | Current | Issue | Recommendation | Why |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Every card uses `shadow-lg` | No elevation hierarchy; page feels noisy | Use subtle border or `shadow-sm` for cards; reserve `shadow-lg` for overlays | Elevation should communicate relationship and priority |
| 2 | Dropdown shadow is weaker than card shadow | Dropdown does not read as above the card | Promote dropdown to `shadow-md` and reduce card shadow | Transient surfaces must sit visually above persistent surfaces |
| 3 | Text sits directly on user-uploaded images | Contrast changes per image and may fail readability | Add a gradient scrim and test light/dark/busy images | Image-backed text needs controlled contrast |

3. **Ergonomic Rationale:** 2-4 sentences on the core depth or media principle driving these recommendations.
