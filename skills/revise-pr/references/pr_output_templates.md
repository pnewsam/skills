# PR output templates

Use these templates when presenting results after revising a PR.

## Gap analysis (Step 5 output)

Present this before proposing any edits.

```markdown
### PR audit for #<number> — `<branch>`

**Missing from description:**
- <change in diff not mentioned in body>

**Stale or inaccurate:**
- <claim in body not supported by the diff>

**Type of change:**
- <current selection> → <correct selection based on diff>

**Testing / Verification:**
- <missing / placeholder-only / steps don't match diff — describe what needs to change>

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

Shall I apply these changes?
```

## Final status (Step 9 output)

```markdown
Updated PR #<number> — <url>

Changes applied:
- <title updated to "..."> (omit if unchanged)
- <Description section: added mention of X, removed stale reference to Y>
- <Type of change: checked ⚡ New feature, removed 🐛 Bug fix>

Remaining for author:
- <e.g. Screenshots section still needs images>
- <e.g. Checklist items to tick once verified>
```

## PR body template

The canonical template used for both writing and auditing PR descriptions.
Fill in every section from the diff analysis. Remove placeholder lines that do not apply.

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

## Testing / Verification

<!-- Describe how this change was tested or how reviewers can verify it. -->

Steps to verify:

1.
2.

<!-- If automated tests cover this change, list the relevant test files or commands. -->
<!-- If no tests exist, explain why or note what manual verification was done. -->

## Checklist:

- [ ] My code follows the style guidelines of this project
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have checked my code and corrected any misspellings
- [ ] I have added or updated tests that cover my changes
```
