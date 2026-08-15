---
name: design-explore
description: Generate several distinct visual-design directions for a UI, judge them against explicit criteria, and synthesize a recommendation. Use when the look/feel is open — a new screen, a restyle, or "make this feel like X" — and one prescribed answer would be premature. Search over directions instead of prescribing one. For a chosen direction's mechanics, hand to the focused ui-* skills; verify with their checks.
---

# Design Explore — Search Instead of Prescription

Visual taste has no single right answer and no validator, so the bitter-lesson
move is **search**: generate genuinely different directions, judge them against
criteria derived from the brief, and synthesize — rather than reciting one house
style. This replaces prescriptive "compose it this way" prose with a repeatable
selection procedure.

## Outcome

One recommended direction with rationale, assembled from the strongest candidate
plus the best ideas grafted from runners-up, and checked against ground truth
(contrast, spacing) before handoff.

## Use when

The visual direction is open (new surface, restyle, mood shift). Do **not** use
when the direction is already set and only mechanics remain — go straight to the
focused `ui-*` skills.

## Procedure

1. **Frame the brief + criteria.** From product intent, write 4–6 explicit,
   weighted judging criteria: audience fit, mood/personality, information
   hierarchy, restraint/clarity, brand fit, accessibility. Vague briefs get
   sharper criteria, not more directions.
2. **Generate N distinct directions (3–5).** Each must commit to a *different
   organizing idea* (e.g. dense-utilitarian vs airy-editorial vs
   bold-expressive), not a color tweak of the same layout. Generate them
   independently so they don't converge — the bundled workflow does this in
   parallel; done by hand, deliberately reset your assumptions between each.
3. **Judge independently, preserve disagreement.** Score every direction against
   every criterion. Keep the split verdicts ("A wins hierarchy, B wins mood")
   rather than flattening to an average.
4. **Synthesize.** Take the highest-scoring direction as the base and graft the
   specific stronger moves from the others. State what you took and why.
5. **Verify against ground truth.** Run the checks before recommending:
   `ui-color` contrast validator on the palette, `ui-spacing` scale lint on the
   spacing. A direction that fails accessibility is out regardless of taste.

## Automated form

`scripts/design_explore.workflow.js` runs steps 2–4 with the Workflow tool:
parallel direction-generators → a judge panel per criterion → a synthesis pass.
Run it with `Workflow({scriptPath})` and a brief in `args`.

## Handoff

Once a direction is chosen, the focused skills own the mechanics: `ui-color`
(palette + contrast check), `ui-spacing` (scale + lint), `ui-typography`,
`ui-layouts`, `visual-hierarchy`. For a specific person's aesthetic, pair with
`emil-design-eng`.
