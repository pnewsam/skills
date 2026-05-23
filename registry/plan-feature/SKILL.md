---
name: plan-feature
description: create a structured feature plan that defines a 1–2 week deliverable and links it to a parent epic or project. use when scoping a concrete, implementable body of work. produces a markdown feature document in docs/features/ with user stories, acceptance criteria, and technical notes. enforces charter and epic alignment via mandatory checks.
---

# Plan Feature

## Overview

Translate an epic-level initiative (or a small, self-contained piece of work) into a concrete feature plan: a 1–2 week deliverable with clear user stories, acceptance criteria, and a definition of done.

A feature plan is the handoff document between product and engineering. It should be detailed enough that an engineer can read it and begin implementation without asking clarifying questions about scope or intent.

Every feature must reference a parent epic (or the charter directly, for small products) and pass alignment checks. If no parent plan exists, stop and recommend `plan-epic` or `create-charter` first.

## Goals

- Define a feature small enough to ship in 1–2 weeks.
- Write user stories from the user's perspective, not the system's.
- Specify acceptance criteria that are unambiguous and testable.
- Identify technical considerations and dependencies before implementation starts.
- Enforce alignment with the parent epic and charter.

## Safety rules

- Do not modify source code, configuration, or branches.
- Do not create a feature plan without reading its parent epic or charter first.
- Do not invent parent plan content — reference it by section.
- Features must be shippable independently. If the feature cannot be shipped without other work, it is not a feature — it is a task within a larger feature.
- Acceptance criteria must be specific enough that a QA engineer could verify them without asking questions.

## Workflow

### 1. Read the parent plan

```bash
cat CHARTER.md 2>/dev/null
cat docs/epics/*.md 2>/dev/null | head -100
ls docs/epics/ docs/projects/ 2>/dev/null
```

Identify the parent epic or project this feature belongs to. If multiple epics exist, ask the user which one this feature advances.

If no charter or epic exists:

1. Stop.
2. Inform the user that features must align to a parent plan.
3. Recommend running `create-charter` or `plan-epic` first.

Read the parent plan fully. Note:

- The epic's goals and success criteria.
- The charter principles this epic serves.
- Any non-goals that constrain this feature's scope.
- Whether this feature fills a checkbox in the epic's "Child Projects / Features" section.

### 2. Understand the feature

Ask the user to describe the feature. Gather:

- What user problem does this feature solve?
- What does the user do today without this feature?
- What is the smallest version of this that would still be valuable? (MVP scope)
- Are there existing designs, wireframes, or user flows?
- Are there API contracts, data models, or external dependencies?
- What does "done" mean? When would we feel confident shipping this?

If the user describes something larger than 2 weeks, recommend breaking it into multiple features or using `plan-epic`.

### 3. Explore existing features

Check for prior feature plans:

```bash
ls docs/features/ 2>/dev/null
find . -path "*/features/*.md" | head -20
```

Read related features to avoid duplication and ensure consistent patterns.

### 4. Draft the feature plan

Write the feature document using the template in `references/feature_template.md`. Store it at `docs/features/NNN-feature-name.md`.

### 5. Validate the feature plan

Before finalizing, run these checks:

- **Parent coherence check:** Can you draw a straight line from this feature's user story to the parent epic's goals? If not, the feature is misaligned or the epic needs revision.
- **Size check:** Can this feature reasonably be coded, reviewed, and tested in 1–2 weeks by 1–2 engineers? If not, decompose into multiple features.
- **Acceptance criteria check:** Is each criterion verifiable without subjective judgment? "It feels fast" is not a criterion. "Page load completes in < 200ms on 3G" is.
- **Independence check:** Can this feature be shipped and rolled out without waiting for other in-flight features? If not, identify the dependency and decide whether to merge features or accept the coupling.
- **Non-goal check:** Does the out-of-scope section protect against scope creep? Would a reasonable stakeholder ask for one of the listed out-of-scope items? If not, the section is too weak.

If any check fails, flag it to the user and propose a revision.

### 6. Write the file

```bash
mkdir -p docs/features
```

Assign the next available ID:

```bash
ls docs/features/ | grep -E '^[0-9]+' | sort | tail -1
```

Write the finalized feature plan to `docs/features/NNN-<slug>.md`.

If the parent epic has a "Child Projects / Features" section, prompt the user to update the epic's checkbox to link to this feature plan.

### 7. Final response

Report:

- Confirmation that the feature plan has been written.
- The assigned feature ID and file path.
- A one-sentence summary of the user story.
- Size and independence assessment — is this truly a 1–2 week feature?
- Any alignment concerns or scope warnings flagged during validation.
- Recommended next step: begin implementation, or run `plan-feature` again for the next feature in the epic.

## Idempotency

If `docs/features/NNN-<slug>.md` already exists:

1. Read the existing feature plan fully.
2. Ask the user whether they want to update the existing plan or create a new one.
3. If updating, preserve the ID and metadata, update changed sections, and refresh the "Last updated" field.
4. If creating a new feature, assign the next available ID.

## When not to use this skill

- Do not use this skill for work estimated at >2 weeks — use `plan-epic` instead.
- Do not use this skill without a parent epic or charter — the alignment step will fail.
- Do not use this skill for pure tech-debt tasks with no user-facing outcome — use a task tracker or RFC instead.
- Do not use this skill to produce a detailed implementation spec — acceptance criteria are the boundary; implementation details belong in code review and architecture discussions.
