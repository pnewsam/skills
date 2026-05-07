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

Fill in every section from the diff analysis before passing to `gh pr create --body`.
Remove placeholder lines that do not apply (e.g. remove `Fixes #issue_number` if no issue is
referenced, remove the Screenshots section if there are no UI changes, and delete inapplicable
type-of-change checkboxes).

```markdown
## Description

Please include a summary of the change and which issue is fixed. Please also include relevant motivation and context. List any dependencies that are required for this change.

Fixes #issue_number

## Screenshots

<!-- Include images of the feature/changes for context. -->

## Type of change

Please delete options that are not relevant.

- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ⚡ New feature (non-breaking change which adds functionality)
- [ ] 🚨 Hotfix (non-breaking change which fixes an issue)
- [ ] 📢 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📄 This change requires a documentation update

## Checklist:

- [ ] My code follows the style guidelines of this project
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have checked my code and corrected any misspellings
```
