---
name: ui-color
description: Color-system objectives plus a runnable WCAG contrast check. Use when building or auditing a UI color system, choosing colors, or fixing color accessibility. Specify intent and let the model build the palette; verify contrast with scripts/check_contrast.py rather than eyeballing ratios.
---

# UI Color — Objectives + Ground-Truth Check

This skill keeps the parts a capable model does not reliably reconstruct on its
own — the exact accessibility thresholds, as a runnable check — and defers
palette construction to the model. It is a converted reference: specify what you
want, let the model build it, then **verify with the check instead of trusting
prose tables of ratios**.

## The check (non-negotiable, deterministic)

Contrast is measurable, so measure it — never guess or cite a remembered ratio.
Run the bundled validator on every foreground/background pair (body text,
secondary text, placeholders, text on tinted/colored surfaces, and UI-component
borders against their background):

```
python3 scripts/check_contrast.py "#111827" "#ffffff"        # one pair
python3 scripts/check_contrast.py "#ffffff" "#2563eb" --large # large-text thresholds
python3 scripts/check_contrast.py --json pairs.json          # batch; nonzero exit if any fail AA
```

Thresholds enforced (WCAG AA): **4.5:1** normal text, **3:1** large text
(≥18.66px bold or ≥24px) and UI-component/graphic boundaries. Treat any pair
below AA as a defect to fix, not a preference. In review, report each failing
pair with its measured ratio from the tool — e.g. muted `#9ca3af` on white is
2.54:1 (fail), darken until it passes.

## The objectives (what "good" must satisfy)

State these as requirements; the model implements them to current best practice:

- **Semantic tokens, not raw values.** Colors are referenced through role tokens
  (`--color-text-primary`, `--color-primary`, `--color-danger`, surface/border
  roles) so the palette can change in one place.
- **Color carries meaning, not decoration.** It marks hierarchy, state, and
  interactivity; it is not sprinkled to look lively.
- **Never color-only.** Any status/error conveyed by color is also conveyed by
  text, icon, or shape — an accessibility invariant, not a style choice.
- **Dark mode preserves hierarchy** rather than inverting values; elevated
  surfaces get lighter, saturated hues get slightly muted.
- **Every colored surface defines its own foreground**, verified by the check.

## Defer to the model (specify intent, then verify)

Palette structure and shade scales (50–950), neutral undertone, dark-mode token
mapping, and brand-color generation are well-trodden; a capable model produces
them to standard. Give it the intent — brand hue, mood, density, light/dark —
and let it build. Then run the check on the result. Do not hand-maintain shade
tables here.

## Handoff

Which feedback pattern a color belongs to (error/success/warning states) and how
contrast feeds visual hierarchy are base-model capability now (the `ui-feedback` /
`visual-hierarchy` prose was evicted 2026-08-17); this skill owns the palette and
the runnable contrast check.
