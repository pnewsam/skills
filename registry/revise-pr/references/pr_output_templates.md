# PR output templates

Use these templates when presenting results after revising a PR.

## Contents

- Gap analysis
- Proposed edit preview
- Final status
- PR body template

## Gap analysis (Step 5 output)

Present this before proposing any edits.

```markdown
### PR audit for #<number> — `<branch>`

**Missing from description:**
- <change in diff not mentioned in body>

**Stale or inaccurate:**
- <claim in body not supported by the diff>

**Missing validation evidence:**
- <missing / placeholder-only / inconsistent command or result>

**Missing risk or rollout context:**
- <material consequence not disclosed>

**Title:**
- Current: `<current title>`
- Proposed: `<proposed title>` (omit row if unchanged)
```

If everything is accurate:

```markdown
### PR audit for #<number> — `<branch>`

✅ The PR description accurately reflects the current branch changes. No edits needed.
```

## Proposed edit preview (Step 7 output)

Show this to the user before applying the update.

```markdown
### Proposed changes to PR #<number>

**Title:** `<proposed title>` _(unchanged / updated from: `<old title>`)_

**Body:**

---
<full revised PR body here>
---

<In Audit mode, stop here. In Apply mode, continue if the target and scope are unambiguous.>
```

## Final status (Step 9 output)

```markdown
Updated PR #<number> — <url>

Changes applied:
- <title updated to "..."> (omit if unchanged)
- <Description section: added mention of X, removed stale reference to Y>
- <Validation: replaced a stale claim with the actual command and result>

Remaining for author:
- <e.g. Screenshots section still needs images>
- <e.g. Validation evidence the author still needs to collect>
```

## PR body template

Use the repository's PR template when present. Otherwise audit against this
evidence-oriented shape and remove unused optional sections.

```markdown
## Summary

- <user-visible or operational outcome>
- <important implementation boundary>

## Why

<Problem, motivation, or linked issue. Use `Closes #<number>` only when known.>

## Changes

- <coherent change>
- <tests, migration, documentation, or dependency change>

## Validation

- `<command>` — passed / failed
- <manual verification and observed result>
- Not run: <check and reason>

## Risk and rollout

<Risk, compatibility, migration, feature flag, rollout, or rollback notes. Omit
only when genuinely not applicable.>

## Screenshots

<Before/after evidence for UI changes. Omit for non-visual changes.>
```
