# Epic gap-closure planning

Use this reference in Closure mode.

## Contents

- Normalize the gaps
- Prioritize
- Preserve progress
- Template

## Normalize the gaps

For each unresolved audit finding capture:

- source feature or systemic pattern
- severity and dependency impact
- current evidence
- target state
- action type
- skill, manual step, or human decision needed

Useful mappings:

| Gap | Action |
| --- | --- |
| Missing feature plan | `plan-feature` |
| Required criterion incomplete | `build-feature` for that criterion |
| Checkbox or status mismatch | Verify evidence, then manually update the incorrect record |
| Tracking drift | Verify which criteria the existing work satisfies; build or validate the remainder |
| Incomplete definition of done | Perform the named verification or a focused DoD review |
| Orphaned plan | Human decision: add, move, archive, or remove |
| Repeated tracking problem | One systemic review or process repair |

Do not turn a decision into an automated action. Present the realistic options
and name what each option changes.

## Prioritize

Order by:

1. decisions that block planning
2. gaps that block other features
3. high-severity required behavior or verification
4. medium-severity reconciliation
5. low-severity bookkeeping

Within a tier, place prerequisite work first. Effort may break ties but should
not move cosmetic quick wins ahead of blockers.

## Preserve progress

If `docs/epics/NNN-<slug>-gap-closure.md` exists:

- read it before writing
- retain completed items whose stable identity still maps to a resolved gap
- update evidence and severity without discarding completion history
- add newly discovered gaps
- mark obsolete items explicitly rather than silently repurposing them

Use a stable identity based on feature ID plus gap type when possible.

## Template

```markdown
# Gap Closure Plan: <epic name> (<ID>)

## Metadata

- **Epic:** `<source path>`
- **Audit:** `<audit path and date>`
- **Plan refreshed:** <date>
- **Unresolved gaps:** <count and severity breakdown>

## Summary

<Current state and the outcome this plan should reach.>

## Decisions

### <Decision>

- **Context:** <why a human choice is required>
- **Options:** <realistic options and consequences>
- **Recommendation:** <best-supported option, if evidence permits>

## Systemic actions

- [ ] **<stable title>:** <one action covering the named features>

## Punch list

### Blockers

- [ ] **<feature ID · gap type>:** <concrete action> — **Blocks:** <items>

### High priority

- [ ] **<feature ID · gap type>:** <concrete action>

### Medium priority

- [ ] **<feature ID · gap type>:** <concrete action>

### Low priority

- [ ] **<feature ID · gap type>:** <concrete action>

## Execution order

1. <dependency-aware sequence>

## Completion condition

<Evidence required for the epic to move from its current health to healthy.>
```

Avoid vague actions such as “address discrepancy.” Name the artifact or
criterion, the intended change, and the verification needed.
