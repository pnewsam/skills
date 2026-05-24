---
name: plan-epic
description: create a structured epic plan that translates a product charter into a quarter-level initiative. use when breaking down docs/CHARTER.md into actionable, time-bounded workstreams. produces a markdown epic document in docs/epics/ that features and projects will reference. enforces charter alignment via mandatory checks.
---

# Plan Epic

## Overview

Translate a product charter (or a large strategic initiative) into a concrete epic: a quarter-level body of work with clear goals, scope boundaries, success criteria, and child projects/features.

An epic is the bridge between vision and execution. It answers: "What are we doing this quarter, why does it matter, and how will we know it worked?"

Every epic must reference `docs/CHARTER.md` and pass an alignment check. If no charter exists, stop and recommend `create-charter` first.

## Goals

- Break a strategic initiative into a well-scoped, time-bounded epic.
- Define what is in scope, what is out of scope, and what success looks like.
- Identify child projects or features that can be planned independently.
- Enforce charter alignment — refuse to proceed if the epic cannot demonstrate how it advances the product vision.

## Safety rules

- Do not modify source code, configuration, or branches.
- Do not create an epic without reading `docs/CHARTER.md` first.
- Do not invent charter content — reference it by section.
- Do not produce vague or unmeasurable success criteria.
- Epics should represent 4–12 weeks of work. If the scope is smaller, recommend `plan-feature` instead.

## Workflow

### 1. Read the charter

```bash
cat docs/CHARTER.md 2>/dev/null || echo "docs/CHARTER.md not found"
```

If no charter exists:

1. Stop.
2. Inform the user that epics must align to a charter.
3. Recommend running `create-charter` first, or confirm whether a charter exists elsewhere.

If a charter exists, read it fully. Note:

- The north star metric and leading indicators.
- The guiding principles most relevant to this epic.
- The non-goals that could constrain this epic's scope.

### 2. Check for direction documents

This skill may be invoked after `explore-directions`, which produces options documents in `docs/directions/`. If direction documents exist, they contain the strategic reasoning that led to this epic — use them.

```bash
ls docs/directions/ 2>/dev/null
```

If direction documents exist:

1. Read the most recent direction document(s).
2. Check the "Decision log" table for a direction marked as **chosen**. If none is marked chosen, ask the user which direction they selected.
3. Note the chosen direction's evidence, trade-offs, confidence, and rough size — these directly inform the epic's problem statement, scope, and risks.
4. If the chosen direction says the charter needs a refresh, flag this. The epic may need to account for charter drift.
5. If the chosen direction's next step is `plan-feature` (not `plan-epic`), confirm with the user that an epic-level plan is appropriate — the direction may have been sized smaller.

If no direction documents exist, proceed to understand the initiative directly.

### 3. Understand the initiative

Ask the user to describe the initiative they want to epic-ize. Gather:

- What prompted this initiative? (user feedback, metric decline, strategic bet, technical debt)
- What part of the charter does this advance?
- What would the user see or experience differently if this epic succeeds?
- Any hard deadlines or external constraints (conference, regulatory, partnership)?
- What is the rough time horizon? (default to a quarter if unspecified)

If the user describes something that feels smaller than 4 weeks, recommend `plan-feature` instead.

### 4. Explore existing plans

Check for prior epics to avoid duplication and understand current priorities:

```bash
ls docs/epics/ 2>/dev/null
find . -path "*/epics/*.md" -o -path "*/plans/*.md" | head -20
```

Read any existing epics that seem related. Note:

- Whether this initiative overlaps with or supersedes an existing epic.
- Dependencies on work already in flight.

### 5. Draft the epic

Write the epic document using the template in `references/epic_template.md`. Store it at `docs/epics/NNN-epic-name.md` where `NNN` is a zero-padded number (e.g., `001`, `002`).

### 6. Validate the epic

Before finalizing, run these checks:

- **Charter coherence check:** Can you draw a straight line from this epic's goals to the charter's value proposition? If the connection requires more than one sentence of explanation, the epic is either too broad or misaligned.
- **Scope check:** Can a single team reasonably deliver the "In Scope" items in 4–12 weeks? If not, split into multiple epics or move items to out-of-scope.
- **Success criteria check:** Is each criterion measurable without a survey? Prefer behavioral or system metrics over subjective ratings.
- **Non-goal check:** Does the out-of-scope section actually exclude tempting but distracting work? If it only excludes obviously unrelated things, it is not doing its job.
- **Child clarity check:** Are the child projects/features independent enough that one could be deprioritized without killing the whole epic? If not, reconsider the decomposition.

If any check fails, flag it to the user and propose a revision.

### 7. Write the file

```bash
mkdir -p docs/epics
```

Assign the next available ID by scanning existing files:

```bash
ls docs/epics/ | grep -E '^[0-9]+' | sort | tail -1
```

Write the finalized epic to `docs/epics/NNN-<slug>.md`.

### 8. Final response

Report:

- Confirmation that the epic document has been written.
- The assigned epic ID and file path.
- A one-paragraph summary of the epic's core argument.
- Any alignment concerns or scope warnings flagged during validation.
- Recommended next step: run `plan-feature` to plan the first child feature, or `plan-project` if the epic contains multi-week cross-functional workstreams.

## Idempotency

If `docs/epics/NNN-<slug>.md` already exists:

1. Read the existing epic fully.
2. Ask the user whether they want to update the existing epic or create a new one.
3. If updating, preserve the ID and metadata, update changed sections, and refresh the "Last updated" field.
4. If creating a new epic, assign the next available ID.

## When not to use this skill

- Do not use this skill for work that fits in 1–2 weeks — use `plan-feature` instead.
- Do not use this skill without a charter — the alignment step will fail.
- Do not use this skill for purely technical refactoring with no user-facing outcome — use an RFC or architecture decision record instead (unless the refactoring is chartered as a strategic initiative).
