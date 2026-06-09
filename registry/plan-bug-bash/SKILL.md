---
name: plan-bug-bash
description: process stream-of-consciousness bug, issue, and app-feedback observations into a standard docs/epics bug-bash epic with prioritized child features. use when asked to triage dictated notes, organize bug bash observations, process app feedback, or convert a wall of issues into the directions -> epics -> features workflow. pairs with plan-feature, advance-epic, build-feature, and ship-epic.
---

# Plan Bug Bash

## Overview

Take unstructured bug bash input — often dictated while clicking through an app — and transform it into a normal epic plan under `docs/epics/`. A bug bash is not a separate queue or tracker type. It is an epic with child features, and each child feature can later be expanded with `plan-feature` and executed with `advance-epic`, `build-feature`, or `ship-epic`.

Do not create a separate bug-bash tracker. Execution belongs to `plan-feature`, `advance-epic`, `build-feature`, and `ship-epic`.

## Goals

- Parse messy, conversational observations into clear, discrete issues.
- Deduplicate observations that describe the same underlying problem.
- Categorize each issue by type, severity, effort, and affected area.
- Group related issues into independently plannable child features.
- Produce or update a `docs/epics/NNN-<slug>.md` bug-bash epic.
- Preserve raw observation details so later feature planning has enough context.
- Keep the standard planning flow: `docs/directions/` -> `docs/epics/` -> `docs/features/`.

## Inputs

Accept unstructured text from any of these forms:

- Stream-of-consciousness dictation pasted into the conversation.
- A text file or document containing observations.
- A rough bullet list of bugs, UI issues, or app feedback.
- Follow-up observations for an existing bug-bash epic.

The input may contain incomplete sentences, repeated complaints, ambiguous UI references, opinions mixed with facts, and several issues in one paragraph. Preserve ambiguity rather than inventing certainty.

## Safety Rules

- Do not change source code, assets, configuration, or branches.
- Do not create a separate bug-bash tracker outside the epic/feature flow.
- Do not discard distinct observations, even if they seem minor.
- Do not invent issues that were not mentioned or directly implied.
- Do not create feature plans directly unless the user explicitly asks to plan the child features now.
- If `docs/CHARTER.md` is missing, stop and recommend `create-charter` before creating an epic.

## Workflow

### 1. Read Planning Context

Understand the existing planning state before deciding whether to create a new bug-bash epic or update an existing one:

```bash
cat docs/CHARTER.md 2>/dev/null || echo "docs/CHARTER.md not found"
ls docs/directions/ 2>/dev/null
ls docs/epics/ 2>/dev/null
ls docs/features/ 2>/dev/null
```

If `docs/CHARTER.md` is missing, stop and recommend `create-charter`. If related epics already exist, read them enough to avoid duplicating an active initiative.

### 2. Parse Observations

Read the raw input carefully and extract distinct observations:

- What page, flow, or component was involved?
- What happened?
- What did the user expect instead?
- Is there an implied reproduction path?
- Does the observation duplicate or refine another observation?
- Is the issue a product bug, UX problem, UI polish issue, accessibility gap, content problem, performance problem, data issue, or missing capability?

Preserve useful raw phrases in the issue notes. They often contain the context needed to reproduce the problem later.

### 3. Deduplicate And Categorize

For each distinct issue, estimate:

| Field | Values |
| --- | --- |
| Category | `bug`, `ui-polish`, `ux`, `performance`, `accessibility`, `content`, `data`, `feature-gap`, `inconsistency` |
| Severity | `critical`, `high`, `moderate`, `low` |
| Effort | `trivial`, `small`, `medium`, `large`, `unknown` |
| Confidence | `high`, `medium`, `low` |

Use severity for user impact and effort for implementation uncertainty. If the user was vague, mark confidence lower instead of over-specifying.

### 4. Group Into Child Features

Group issues into child features by workflow, page, root cause, or verification path. Prefer a small number of coherent child features over one feature per tiny bug.

Good child feature shapes:

- "Fix checkout blockers" — several high-severity issues in one critical flow.
- "Stabilize dashboard data display" — data freshness, formatting, and empty-state issues in one area.
- "Polish mobile settings experience" — layout, tap target, and copy issues on one screen.
- "Resolve accessibility regressions" — keyboard, label, and contrast issues that can be verified together.

If one issue is large enough to stand alone, make it its own child feature. If the whole bug bash is only a few small fixes, create one small bug-bash epic with a single "quick fixes" child feature rather than a separate top-level tracker.

### 5. Write Or Update The Bug-Bash Epic

Create or update a normal epic at `docs/epics/NNN-<slug>.md`. Assign the next available numeric ID if creating a new file:

```bash
mkdir -p docs/epics
ls docs/epics/ | grep -E '^[0-9]+' | sort | tail -1
```

Use the standard epic shape from `plan-epic`, with these bug-bash-specific additions:

```markdown
# Epic: <Bug Bash Title>

## Metadata

- **ID:** <NNN>
- **Status:** draft
- **Created:** <date>
- **Owner:** <role or person>
- **Last updated:** <date>

## Charter Alignment

- **Principle advanced:** <quote or summarize relevant charter principle>
- **User/reliability outcome:** <what improves when this bug bash is complete>
- **Non-goal check:** <what this bug bash will not expand into>

## Problem Statement

<Summarize the observed quality, reliability, UX, or polish problem.>

## Goals

1. <Goal 1>
2. <Goal 2>
3. <Goal 3>

## Success Criteria

| Criterion | Target | Measurement Method |
| --- | --- | --- |
| <criterion> | <target> | <how verified> |

## Scope

### In Scope

- <issue area or workflow>

### Out of Scope

- <scope boundary>

## Child Features

- [ ] <Feature 1> — <issue cluster and intended outcome>
- [ ] <Feature 2> — <issue cluster and intended outcome>

## Issue Inventory

| Issue | Category | Severity | Effort | Confidence | Child feature |
| --- | --- | --- | --- | --- | --- |
| <short issue title> | <category> | <severity> | <effort> | <confidence> | <feature name> |

## Raw Observation Notes

<Preserve concise raw notes or representative quotes from the input.>

## Risks / Clarifications

- <Any ambiguity or reproduction risk>
```

Do not create `docs/features/` files unless the user asks to plan the child features now. The expected next step is `plan-feature` for each child feature, or `ship-epic` if the user wants the full epic planned and advanced.

### 6. Validate The Epic

Before finishing, check:

- **No parallel tracker:** The plan uses `docs/epics/` and does not create a separate tracker.
- **Child feature clarity:** Each child feature is independently plannable and verifiable.
- **Deduplication:** Repeated observations were merged without losing useful details.
- **Prioritization:** Critical and high-severity issues are visible near the top of the child feature order or issue inventory.
- **Charter fit:** The bug bash is framed as quality, reliability, usability, or trust work aligned with `docs/CHARTER.md`.

## Final Response

Report:

- The bug-bash epic path.
- Number of distinct issues identified.
- Number of child features proposed.
- Highest-severity issues.
- Any issues needing clarification.
- Recommended next step: run `plan-feature` for the first child feature, or run `ship-epic` to plan and advance the bug-bash epic end to end.
