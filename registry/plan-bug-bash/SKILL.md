---
name: plan-bug-bash
description: process stream-of-consciousness dictation about bugs, issues, and observations noticed while using an app, then organize them into discrete units of work with a structured plan. use when asked to triage dictated notes, process bug bash observations, organize app feedback, or break down a wall of text about issues into actionable items. pairs with fix-bug-bash-item to execute the plan.
---

# Plan Bug Bash

## Overview

Take unstructured, stream-of-consciousness input — typically dictated while clicking through an app — and transform it into a structured, prioritized plan of discrete issues. Each issue becomes a unit of work that can be independently addressed by the `fix-bug-bash-item` skill.

This skill is designed to pair with `fix-bug-bash-item`. Use this skill first to process raw observations into a plan. Use `fix-bug-bash-item` to implement one fix at a time from the plan.

## Goals

- Parse messy, conversational, stream-of-consciousness input into clear, discrete issues.
- Deduplicate observations that describe the same underlying problem.
- Categorize each issue by type (bug, UI polish, UX improvement, performance, accessibility, content, etc.).
- Estimate relative severity and effort for prioritization.
- Produce enough structured information for `fix-bug-bash-item` to act on each item independently.
- Track progress in a repository-local markdown file that persists across invocations.
- Be idempotent: rerunning with the same input should not create duplicate items.

## Inputs

Accept unstructured text from any of these forms:

- Stream-of-consciousness dictation pasted into the conversation.
- A text file or document containing observations.
- A list of bullet points, even if poorly formatted.
- Follow-up observations added to an existing plan.

The input will often contain:

- Incomplete sentences and filler words.
- Multiple issues mentioned in one sentence.
- Vague references to UI locations ("that button on the settings page").
- Opinions mixed with factual observations.
- Repeated mentions of the same issue from different angles.
- Context switches without clear transitions.

## Safety rules

- Do not change source code, assets, configuration, or branches during planning. This skill is read-only except for the progress tracker.
- It is acceptable to create or update the progress tracker at `docs/tmp/bug-bash.md`.
- Do not discard or editorialize away the user's observations. Every distinct issue should be captured, even if it seems minor.
- Do not invent issues that were not mentioned or implied in the input.
- When the user's intent is ambiguous, preserve the ambiguity in the issue description and flag it as needing clarification.

## Workflow

### 1. Establish repository and application context

Understand the codebase to make issue descriptions actionable:

```bash
git status --short --branch
git remote -v
git branch --show-current
```

Identify the project type, framework, and structure:

```bash
ls -la
find . -maxdepth 2 -name 'package.json' -o -name 'pyproject.toml' -o -name 'Gemfile' -o -name 'Cargo.toml' -o -name 'go.mod' -o -name '*.csproj' | head -20
```

Look for existing issue tracking or similar plans:

```bash
ls docs/tmp/ 2>/dev/null
```

Determine:

- Base branch and default branch.
- Application type (web app, mobile, CLI, library, etc.).
- UI framework if applicable (React, Vue, Svelte, etc.).
- Existing test infrastructure.
- Existing issue tracking conventions.

### 2. Read and parse the raw input

Process the stream-of-consciousness input:

1. Read the full input carefully, multiple times if needed.
2. Identify natural boundaries between distinct observations.
3. Extract the core issue from conversational filler.
4. Note any UI locations, pages, or flows mentioned.
5. Note any reproduction steps implied by the narrative.
6. Identify observations that refer to the same underlying issue.

### 3. Deduplicate and consolidate

Group observations that describe the same root issue:

- Same UI element mentioned multiple times.
- Same behavior described from different angles.
- Cause and effect that are really one issue.
- A general complaint followed by a specific example of the same thing.

Preserve all unique details from duplicate observations — merge them into one richer issue description rather than discarding any.

### 4. Categorize each issue

Assign each issue a category:

- `bug` — something is broken or behaves incorrectly.
- `ui-polish` — visual or layout issue that doesn't break functionality.
- `ux` — usability or interaction flow improvement.
- `performance` — slow, laggy, or resource-heavy behavior.
- `accessibility` — screen reader, keyboard navigation, contrast, or other a11y concerns.
- `content` — typos, unclear copy, missing help text.
- `data` — incorrect data display, stale data, missing data.
- `feature-gap` — missing functionality the user expected.
- `inconsistency` — behavior or appearance differs from similar parts of the app.

### 5. Assess severity and effort

For each issue, estimate:

**Severity** (impact on users):
- `critical` — blocks core functionality, data loss, or security issue.
- `high` — significant degradation of a common workflow.
- `moderate` — noticeable issue that has a workaround.
- `low` — minor annoyance or cosmetic issue.

**Effort** (implementation complexity):
- `trivial` — one-line fix, copy change, or simple CSS tweak.
- `small` — localized change in one component or function.
- `medium` — changes across a few files, may need testing.
- `large` — significant refactor or new functionality needed.
- `unknown` — needs investigation before estimating.

### 6. Locate likely code areas

For each issue, use read-only exploration to identify the probable code location:

- Search for component names, route paths, or UI text mentioned in the observation.
- Identify the file(s) most likely to need changes.
- Note the relevant test files if they exist.

Do not spend excessive time on this — a best guess with 1-2 search queries per issue is sufficient. The `fix-bug-bash-item` skill will do deeper investigation.

### 7. Check for existing bug-bash tracker

If `docs/tmp/bug-bash.md` already exists:

1. Read the existing tracker.
2. Check each new observation against existing items to avoid duplicates.
3. Preserve items that are `in-progress`, `pr-opened`, `blocked`, or `done`.
4. Add newly identified items.
5. Update items if new observations add useful context.
6. Append new observations rather than replacing history.

### 8. Create or update the progress tracker

Create or update `docs/tmp/bug-bash.md` with this structure:

```markdown
# Bug Bash Tracker

## Run metadata

- Started: <date/time if known>
- Repository: <owner/repo or remote URL>
- Base branch: <base branch>
- Source: dictation / user observations
- Tracker version: 1

## Status summary

- Ready: <count>
- In progress: <count>
- PR opened: <count>
- Needs clarification: <count>
- Blocked: <count>
- Done: <count>

## Issues

### <issue_id>

- Title: <clear, concise title>
- Status: ready
- Category: <bug|ui-polish|ux|performance|accessibility|content|data|feature-gap|inconsistency>
- Severity: <critical|high|moderate|low>
- Effort: <trivial|small|medium|large|unknown>
- Branch: bugfix/<issue_id>
- PR: <none or URL>
- Location: <page, screen, or UI area where observed>
- Description: <clear description of the issue, synthesized from raw input>
- Raw observations: <original words from the user, preserved for context>
- Likely files:
  - <file path>
- Reproduction:
  - <step>
- Acceptance criteria:
  - <what "fixed" looks like>
- Progress notes:
  - <date> — identified during bug bash planning
```

Use stable `issue_id` values derived from the issue content, e.g. `settings-page-save-button-disabled`, `dashboard-chart-wrong-date-range`, `login-form-missing-validation`.

### 9. Prioritize the queue

Order issues in the tracker by priority:

1. Critical severity, any effort.
2. High severity, trivial or small effort (quick wins).
3. High severity, medium or large effort.
4. Moderate severity, trivial effort (quick wins).
5. Moderate severity, small to medium effort.
6. Low severity, trivial effort.
7. Everything else.
8. Items needing clarification last.

### 10. Output an automation-friendly summary

End with a concise queue:

```text
READY:
1. <issue_id> — <title> [<severity>/<effort>]
2. <issue_id> — <title> [<severity>/<effort>]

NEEDS CLARIFICATION:
1. <issue_id> — <what's unclear>

ALREADY TRACKED:
1. <issue_id> — <status>
```

## Idempotency contract

A subsequent run with the same input should produce the same plan. Achieve this by:

- Using stable `issue_id` slugs derived from issue content.
- Using stable branch names: `bugfix/<issue_id>`.
- Checking the existing tracker before adding items.
- Matching new observations against existing items by content similarity, not just exact text match.

## When to hand off to `fix-bug-bash-item`

Use `fix-bug-bash-item` for each issue with `Status: ready` in the tracker.

There are two supported handoff modes:

1. **Conversation handoff** — output a full issue description in the response and then invoke `fix-bug-bash-item` with that issue in the conversation context.
2. **Tracker-file handoff** — write the issue into `docs/tmp/bug-bash.md`; `fix-bug-bash-item` reads the next `Status: ready` issue from the tracker and works on it.

For automated or long-running work, prefer tracker-file handoff.

## Final response

Report:

- Number of distinct issues identified from the input.
- Path to the progress tracker.
- Issues organized by priority.
- Issues that need clarification before they can be worked on.
- The next `issue_id` that `fix-bug-bash-item` should process.
- Recommended next step.
