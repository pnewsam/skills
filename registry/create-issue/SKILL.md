---
name: create-issue
description: Create exactly one issue in Linear, resolving the target team and optional project, status, priority, assignee, labels, cycle, due date, estimate, or parent from live workspace data before writing. Use when the user asks to open, file, add, or create a Linear issue or ticket. Checks for duplicates, performs one create operation, verifies the live issue, and does not create supporting labels, projects, or additional issues.
---

# Create Linear Issue

## Outcome

Create one correctly scoped Linear issue, verify its live fields, return its
identifier and URL, and stop.

## Preconditions and effect

Require an authenticated Linear MCP connection. If it is unavailable, follow
the Linear connection and OAuth setup, then stop because Codex must restart
before continuing.

This workflow performs one external create operation. The user's explicit
request to create or file an issue authorizes that operation; it does not
authorize creating a project, label, cycle, or another issue.

Require:

- target team
- concise title

Use supplied context to draft the description. Resolve optional project,
status, priority, assignee, labels, cycle, due date, estimate, and parent only
when requested or clearly established by repository instructions or the
conversation. Ask only when a missing value would materially change the issue
or its destination.

## Workflow

### 1. Resolve the destination and content

Read live Linear data before writing:

- resolve the team and confirm its identifier
- resolve every requested project, status, label, cycle, user, or parent
- inspect plausible active issues in the target team or project for an exact or
  clearly equivalent title and outcome

If multiple teams, projects, users, or statuses match, stop and ask which one.
If a likely duplicate exists, return it and stop unless the user explicitly
asks for a separate issue.

Draft an actionable description from known facts. Prefer this compact shape
when no user or repository template is supplied:

```markdown
## Outcome

<Result or problem to resolve>

## Context

<Why it matters and what is true today>

## Acceptance criteria

- [ ] <Observable condition>

## Notes

<Constraints, evidence, links, or open questions>
```

Remove empty optional sections. Preserve uncertainty instead of inventing
requirements. If the user supplies a template or repository instructions name
one, follow it. Do not claim to have applied a native Linear template unless
the connected tool actually supports and confirms that operation.

### 2. Create once

Call the Linear issue-creation tool once with the resolved identifiers and
supported fields. Do not create missing labels or other supporting records as
a side effect. If the tool rejects an optional field, report the unsupported
field rather than silently creating a less specific issue or retrying through
another integration.

If the create response is ambiguous or times out, search for the intended
issue before retrying. Never create a second issue merely because verification
was inconclusive.

### 3. Verify and report

Fetch the created issue by its returned identifier and verify:

- title and team
- description
- requested project and properties that the tool accepted
- issue identifier, URL, and current status

If creation succeeded but verification fails, report the returned identifier
and the verification gap; do not retry creation.

Return the issue identifier and URL, its team and project, the properties
applied, and any requested property the tool could not set.

## Safety and idempotency

- Create exactly one issue per invocation.
- Read before writing and verify after writing.
- Do not modify an existing issue; use an update workflow for that.
- Do not create duplicates, supporting records, comments, or child issues.
- Do not expose private workspace data beyond what is necessary to identify the
  created issue.
