---
name: save-session
description: summarize the current working session and save it as a markdown file in docs/tmp for future reference. use when wrapping up a session, when you've solved a tricky problem worth remembering, when you want to capture decisions and context before switching tasks, or when asked to log or document what was done.
---

# Save Session

## Overview

Capture a concise, searchable summary of the current working session as a markdown file in `docs/tmp/`. The goal is to build a lightweight knowledge base of past sessions — solutions, decisions, debugging paths, and context — that can be referenced in future conversations.

This is not a commit log or changelog. It captures the *narrative* of a session: what problem was being solved, what approaches were tried, what worked, and what decisions were made along the way.

## Safety rules

- This skill only creates or appends to files in `docs/tmp/`. It does not modify source code, commit, or push.
- Do not include secrets, credentials, API keys, or tokens in the summary.
- Do not fabricate or embellish — only summarize work that actually happened in the session.

## Workflow

### 1. Gather session context

Review what happened during the current conversation. Sources of truth:

- The conversation history itself (what was asked, what was done)
- Files that were created, modified, or read during the session
- Commands that were run and their outcomes
- Decisions that were made and alternatives that were rejected

If the session involved code changes, also inspect the current state:

```bash
git status --short
git diff --stat
git diff --cached --stat
git log --oneline -n 5
```

### 2. Choose a filename

Use the pattern:

```
docs/tmp/session-<YYYY-MM-DD>-<short-slug>.md
```

The slug should be 2–4 words capturing the primary topic. Examples:

- `session-2025-03-15-auth-token-rotation.md`
- `session-2025-03-15-fix-search-pagination.md`
- `session-2025-03-15-prisma-migration-setup.md`

If multiple sessions happen on the same day on the same topic, append a numeric suffix: `-2`, `-3`, etc.

Create the directory if needed:

```bash
mkdir -p docs/tmp
```

### 3. Write the summary

The summary should be concise but complete enough to be useful months later. Use this structure:

```markdown
# Session: <title>

**Date:** <YYYY-MM-DD>
**Branch:** `<current branch>`
**Status:** <completed | in-progress | paused | abandoned>

## Problem / Goal

<What were we trying to accomplish? What triggered this work? 1–3 sentences.>

## What was done

<Chronological or logical summary of the work performed. Focus on actions and outcomes, not the back-and-forth of conversation. Use bullet points.>

## Key decisions

<Decisions made during the session and brief rationale. Include alternatives that were considered and rejected, if relevant.>

## Solution / Outcome

<What was the end result? If a bug was fixed, what was the root cause and fix? If a feature was built, what's the shape of it? Include relevant file paths and code patterns.>

## Files touched

<List of files created, modified, or deleted — grouped if there are many.>

## Open questions / Follow-ups

<Anything left unresolved, or work that should happen next. Omit this section if there's nothing pending.>

## References

<Links, docs, error messages, or stack traces that were relevant. Omit if none.>
```

Omit any section that has nothing meaningful to say — don't leave empty sections or placeholder text.

### 4. Tailor depth to the session

Not every session needs the full template. Scale the summary to the session:

- **Quick fix or small change:** A few sentences under Problem/Goal and Solution/Outcome may be enough. Skip Key Decisions and References.
- **Debugging session:** Emphasize the diagnosis path — what was tried, what was ruled out, what the root cause turned out to be. This is the most valuable thing to capture for future reference.
- **Architecture or design session:** Emphasize Key Decisions — the options considered, trade-offs, and why the chosen approach won.
- **Exploration or research:** Summarize what was learned, with links. Note what turned out to be dead ends.

### 5. Review before saving

Read back the summary and check:

- Would this be useful to someone (including future-you) encountering the same problem?
- Is it searchable — does it contain the key terms someone would grep for?
- Is it accurate — does it reflect what actually happened?
- Is it concise — could any section be shorter without losing value?

### 6. Save the file

Write the summary to `docs/tmp/`. Do not commit it — the user's global gitignore handles `docs/tmp/` by default, and committing is a separate decision.

### 7. Final response

Report:

- The file path of the saved summary
- A one-line description of what was captured
- A reminder that the file is in `docs/tmp/` and won't be committed unless explicitly added

## Handling common situations

### Very short session

If the session was brief (a single question answered, a one-line fix), write a proportionally short summary. Even a 5-line file can be valuable if it captures a non-obvious solution.

### Multiple distinct topics in one session

If the session covered unrelated topics, write separate summary files — one per topic. Each file should stand alone.

### Session is still in progress

If the user wants to save a checkpoint mid-session, set status to `in-progress` and note what's been done so far. The summary can be updated or a follow-up summary written later.

### Similar session already exists

If a file with a very similar slug exists from a previous session, read it first. If the new session is a continuation, consider either:
- Appending a new section to the existing file with the new date
- Creating a new file with a `-2` suffix

Use judgment — if the sessions are tightly related, a single file is easier to reference.

### User provides specific instructions on what to capture

Follow the user's lead. If they say "just save the part about the database migration," scope the summary accordingly. The template is a guide, not a mandate.
