# Update PR output templates

Use these when presenting results.
The PR body shape itself lives in `pr-conventions/references/pr-standard.md` — defer to the repository's own template when one exists.

## Gap analysis (Sync intent)

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

## Proposed edit preview

Show this before applying an update.

```markdown
### Proposed changes to PR #<number>

**Title:** `<proposed title>` _(unchanged / updated from: `<old title>`)_

**Body:**

---
<full proposed PR body here>
---

<In Preview mode, stop here. In Apply mode, continue if the target and scope are unambiguous.>
```

## Final status

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
