---
name: polish-issue
description: Improve the title and description of an existing Linear issue for clarity, concision, natural tone, and human readability without changing its requirements, scope, acceptance meaning, links, checklist state, or workspace properties. Use when asked to polish, humanize, rewrite, edit, or clean up a Linear issue or ticket. Supports read-only preview and explicitly requested apply modes; it does not perform substantive issue updates.
---

# Polish Linear Issue

## Outcome

Make one existing Linear issue easier for people to understand and act on while
preserving its exact substantive meaning.

## Modes and effects

- **Preview:** Fetch the live issue and return a proposed title and description
  without editing Linear. Use for requests to suggest, draft, or show a rewrite.
- **Apply:** Update only the issue title and description, then verify the live
  result. Use when the user explicitly asks to polish, clean up, rewrite, edit,
  or apply the language change.

Require an authenticated Linear MCP connection. If it is unavailable, follow
the Linear connection and OAuth setup, then stop because Codex must restart
before continuing.

Never change status, team, project, assignee, priority, labels, estimate, cycle,
due date, parent, relations, comments, or checklist state. If the user wants
requirements, scope, acceptance criteria, or properties substantively changed,
use an issue-update workflow instead.

## Workflow

### 1. Read the live issue

Resolve the exact issue and fetch its identifier, URL, state, title, complete
description, properties, parent or project context, and relevant template or
repository instructions. Read comments only when they are necessary to
understand a referenced fact; do not silently promote discussion into accepted
requirements.

If the issue is ambiguous, resolve it before continuing. If the description is
empty or too incomplete to polish without inventing substance, stop and explain
what factual input is missing.

### 2. Rewrite without changing substance

Preserve:

- outcome, requirements, scope, acceptance meaning, constraints, and open
  questions
- issue references, links, code, commands, identifiers, evidence, and dates
- template headings, required sections, formatting, and every checkbox state
- uncertainty, caveats, exclusions, and ownership language

Improve:

- outcome-first organization and scanability
- plain language, active voice, sentence length, and paragraph flow
- repetitive, vague, inflated, mechanical, or overly formal phrasing
- unexplained jargon when it can be clarified without adding a new requirement

Do not infer user impact, priority, acceptance criteria, or implementation
details. Do not convert tentative ideas into commitments. Keep useful technical
precision and the issue author's recognizable voice.

If a wording change could alter scope or acceptance meaning, preserve the
original and flag it instead.

### 3. Preview or apply once

Present the proposed complete title and description and summarize the editorial
changes. In Preview mode, stop.

In Apply mode, update the title only when its language needs improvement and
update the description once. Fetch the live issue again and verify the exact
title, description, identifier, and URL. If the write fails, preserve the
proposed text and report the error; do not retry through another integration.

Report the issue identifier and URL, whether the title or description changed,
the main readability improvements, and anything preserved because changing it
risked altering meaning.

## Safety and idempotency

- Re-polishing already clear language should produce no edit.
- Do not create a comment, issue, label, project, or supporting record.
- Do not change substantive content or workspace properties.
- Never toggle checkboxes or turn discussion into accepted scope.
