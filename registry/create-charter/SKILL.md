---
name: create-charter
description: create or refresh a product charter (CHARTER.md) that serves as the north star for all downstream planning. use when starting a new product, pivoting direction, or when existing plans have drifted from core intent. produces a concise, opinionated CHARTER.md in the docs/ directory that subsequent planning skills (plan-epic, plan-feature) align against. Other high-level documents such as BRAND.md also live directly in docs/.
---

# Create Charter

## Overview

Produce a `docs/CHARTER.md` that captures the core product vision in a format short enough to read in five minutes and durable enough to guide decisions for quarters.

The charter is the parent document for all downstream planning. Every epic, project, and feature plan should reference it. When teams disagree on scope or priority, the charter is the tie-breaker.

This skill is interactive and judgment-heavy. It asks clarifying questions when intent is ambiguous. It does not invent product vision — it structures and pressure-test what the user already knows (or thinks they know).

## Goals

- Surface unstated assumptions about the product and its users.
- Force hard choices via the "Non-Goals" section — what is explicitly out of scope.
- Produce a document that is readable, not exhaustive.
- Establish alignment checks that downstream planning skills will enforce.

## Safety rules

- Do not modify source code, configuration, or branches.
- Do not overwrite an existing `CHARTER.md` without reading it first and offering to merge or refresh.
- Do not invent users, problems, or metrics that the user has not confirmed.
- When the user's intent is ambiguous, ask a clarifying question rather than guessing.

## Workflow

### 1. Check for an existing charter

```bash
ls docs/CHARTER.md 2>/dev/null && cat docs/CHARTER.md
```

If a charter exists:

1. Read it fully.
2. Ask the user whether they want a full refresh, a targeted update to specific sections, or to leave it as-is and stop.
3. If refreshing, use the existing charter as source material — preserve what is still accurate, update what has changed, and flag contradictions.

### 2. Establish context

Gather just enough context to make the charter specific to this product:

```bash
git remote -v
git branch --show-current
ls -la
find . -maxdepth 2 -name 'package.json' -o -name 'pyproject.toml' -o -name 'README.md' | head -5
```

Also check for any existing product docs:

```bash
find docs/ -name "*.md" 2>/dev/null | head -10
```

Determine:

- Product type (SaaS, consumer app, library, CLI tool, etc.).
- Stage (pre-launch, early growth, mature).
- Primary audience if known.
- Any existing mission statements, OKRs, or strategy docs.

### 3. Interview the user

Ask concise, high-leverage questions to fill the charter sections. Do not ask all of these if the user has already provided clear answers. Prioritize the questions where the user's input is most vague or contradictory.

**Problem & Opportunity**

- What specific problem does this product solve? For whom?
- Why does this problem matter now? What has changed?
- What do people do today instead of using this product?

**Target Audience**

- Who is the primary user? Be as specific as possible (role, context, motivation).
- Who is the secondary user, if any?
- Who is explicitly *not* the target user?

**Core Value Proposition**

- In one sentence: what changes for the user after they adopt this product?
- What is the "magic moment" — the first time a user experiences the core value?

**Guiding Principles**

- What are 3–5 non-negotiable constraints or beliefs that shape every decision?
  Examples: "privacy-first," "works offline," "sub-100ms interactions," "no AI-generated content," "open source core."
- Which of these would you sacrifice last if forced to choose?

**Success Metrics**

- What is the single most important metric that tells you the product is working?
- What are 2–3 leading indicators that predict that metric?
- How do you currently measure these, if at all?

**Non-Goals**

- What is this product explicitly *not* trying to be or do?
- What features or user types have you already decided to say no to?
- What would be a distraction from the core mission?

### 4. Draft the charter

Write `CHARTER.md` using the template in `references/charter_template.md`. Keep each section brief. Brevity forces clarity.

### 5. Pressure-test the draft

Before finalizing, validate the charter against these checks:

- **Specificity check:** Is the target audience narrow enough that you could name 5 real people who fit the description? If not, narrow it.
- **Differentiation check:** Does the value proposition explain why someone would use this instead of the status quo or a competitor? If not, sharpen it.
- **Sacrifice check:** Are the guiding principles actually non-negotiable? If every principle would survive a trade-off, they are not principles — they are preferences. Make them stricter or remove them.
- **Metric check:** Can the north star metric be measured today? If not, note the gap and add a leading indicator that can be.
- **Non-goal check:** Are the non-goals specific enough to say no to a real request? "We won't build everything" is not a non-goal. "We won't support real-time collaboration in v1" is.

If any check fails, flag it to the user and propose a revision. Do not silently weaken the charter to pass checks.

### 6. Write the file

```bash
# Ensure no accidental overwrite if user hasn't confirmed
ls docs/CHARTER.md 2>/dev/null && echo "WARNING: docs/CHARTER.md exists. Use refresh workflow."
```

Write the finalized charter to `docs/CHARTER.md`.

### 7. Final response

Report:

- Confirmation that `CHARTER.md` has been written (or refreshed).
- A one-paragraph summary of the charter's core argument.
- Any sections where the user's input was ambiguous and the charter makes an assumption — flag these explicitly.
- Recommended next step: run `plan-epic` to break the charter into quarter-level initiatives, or `plan-feature` if the scope is small enough to skip epics.

## Refreshing an existing charter

When updating an existing `CHARTER.md`:

1. Read the current charter fully.
2. Ask the user what changed: market conditions, user learnings, pivot, new constraints?
3. Update the affected sections. Preserve sections that are still accurate.
4. Update the "Last refreshed" date and "Refresh trigger" metadata.
5. If a principle or non-goal is removed, flag all downstream plans that referenced it — they may need re-evaluation.

## When not to use this skill

- Do not use this skill for team-level process documents (use a team charter or operating agreement instead).
- Do not use this skill for technical architecture decisions (use an architecture decision record or RFC instead).
- Do not use this skill if the product vision is already well-captured in a concise, readable document — point the user to it instead.
