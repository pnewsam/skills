---
name: create-project
description: Create exactly one project in Linear, resolving its team or teams and optional lead, status, dates, priority, summary, and description from live workspace data before writing. Use when the user asks to add, open, start, or create a Linear project. Checks for duplicates, performs one create operation, verifies the live project, and does not create child issues, milestones, documents, or supporting workspace records.
---

# Create Linear Project

## Outcome

Create one correctly scoped Linear project, verify its live fields, return its URL or identifier, and stop.

## Preconditions and effect

Require an authenticated Linear MCP connection. If it is unavailable, follow the Linear connection and OAuth setup, then stop because Codex must restart before continuing.

This workflow performs one external create operation. The user's explicit request to create or start a project authorizes that operation; it does not authorize creating milestones, issues, documents, labels, or initiatives.

Require:

- project name
- at least one target team when the connected workspace requires it

Use supplied context to draft the summary and description. Resolve optional lead, status, priority, start date, and target date only when requested or clearly established by repository instructions or the conversation. Ask only when a missing value would materially change project ownership, scope, or destination.

## Workflow

### 1. Resolve the destination and brief

Read live Linear data before writing:

- resolve every target team and confirm its identifier
- resolve a requested lead or other supported property
- inspect plausible active and recently completed projects for an exact or clearly equivalent name and outcome

If multiple teams, users, or statuses match, stop and ask which one. If a likely duplicate exists, return it and stop unless the user explicitly asks for a separate project.

Draft a concise project brief from known facts. Prefer this compact description when no user or repository template is supplied:

```markdown
## Outcome

<Result the project should deliver>

## Context

<Why this project matters now>

## Success criteria

- <Measurable condition>

## Scope

- In: <included work>
- Out: <explicit boundary>

## Risks and dependencies

- <Known risk, dependency, or open question>
```

Remove empty optional sections. Preserve uncertainty instead of inventing scope, dates, or metrics. If the user supplies a template or repository instructions name one, follow it. Do not claim to have applied a native Linear template unless the connected tool actually supports and confirms that operation.

### 2. Create once

Call the Linear project-creation tool once with the resolved identifiers and supported fields. Do not create milestones, child issues, documents, or other supporting records as side effects. If the tool rejects an optional field, report the unsupported field rather than silently changing project scope or retrying through another integration.

If the create response is ambiguous or times out, search for the intended project before retrying. Never create a second project merely because verification was inconclusive.

### 3. Verify and report

Fetch the created project by its returned identifier and verify:

- name and team membership
- summary and description
- requested lead, status, priority, and dates that the tool accepted
- project identifier or URL and current status

If creation succeeded but verification fails, report the returned identifier and the verification gap; do not retry creation.

Return the project name and URL or identifier, its teams and lead, the properties applied, and any requested property the tool could not set.

## Safety and idempotency

- Create exactly one project per invocation.
- Read before writing and verify after writing.
- Do not modify an existing project; use an update workflow for that.
- Do not create duplicates, milestones, issues, documents, or supporting records.
- Do not expose private workspace data beyond what is necessary to identify the created project.
