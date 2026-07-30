# PR output templates

Use these templates when presenting results after preparing a PR.

## Final status

```markdown
Prepared `<branch>` for PR.

Commit: `<hash>` — `<subject>`
Pushed: `<remote>/<branch>`
PR: <url>

Summary:
- 

Not included / follow-ups:
- 
```

## PR body template

Use repository templates when present. Otherwise fill this evidence-oriented
template from the diff and actual validation. Remove unused optional sections.

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
