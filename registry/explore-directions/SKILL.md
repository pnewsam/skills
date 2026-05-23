---
name: explore-directions
description: analyze the gap between where a product is and where it could go, then generate 3–5 distinct strategic directions with evidence and trade-offs. use when the next step is unclear, when charter alignment is weak, or when scouting for the highest-leverage path forward. produces a markdown options document in docs/directions/ that the user reviews before committing to a plan via create-charter or plan-epic.
---

# Explore Directions

## Overview

When the path forward is unclear, use this skill to map the territory before choosing a route. It reads the product's current state — charter, existing plans, codebase, and recent activity — and produces a set of distinct, evidence-based strategic directions. Each direction is an *option*, not a commitment.

The output is designed for human review: the user reads the options, asks questions, combines elements, and then invokes `create-charter` or `plan-epic` to formalize the chosen path.

This skill is divergence-heavy. It should surface possibilities the user has not considered, not just organize the ones they have.

## Goals

- Identify the gap between current reality (code, plans, metrics) and stated intent (charter, epics).
- Generate 3–5 genuinely distinct directions, not variations on the same theme.
- Ground each direction in evidence from the codebase, existing plans, or observable user behavior.
- Make trade-offs explicit: what each direction gives up to get what it gains.
- Estimate rough size and charter-fit so the user can compare apples to apples.

## Safety rules

- Do not modify source code, configuration, or branches.
- Do not create plans — this skill produces *options* for human selection.
- Do not invent metrics, user feedback, or market data that cannot be inferred from the repo.
- The charter is not sacred. If it exists, treat it as a working hypothesis that has served until now — not as immutable truth. Flag drift, staleness, or contradictions explicitly.
- Directions must be mutually distinct. If two options converge on the same outcome, merge them or differentiate them more sharply.

## Workflow

### 1. Read the current state

```bash
cat CHARTER.md 2>/dev/null || echo "CHARTER.md not found"
ls docs/epics/ 2>/dev/null
ls docs/features/ 2>/dev/null
ls docs/directions/ 2>/dev/null
git log --oneline -20
```

Also gather codebase context:

```bash
find . -maxdepth 2 -name 'package.json' -o -name 'pyproject.toml' -o -name 'README.md' | head -5
ls -la
```

Determine:

- Does a charter exist? Is it recent? Does it describe the product accurately?
- Are there active epics or features? Are they progressing or stalled?
- What has shipped recently? What has not?
- Are there obvious gaps (e.g., charter says "mobile-first" but no mobile routes exist)?

### 2. Interview the user

Ask concise questions to understand what prompted the exploration:

- What made you run this skill now? (metric decline, user feedback, technical debt, team growth, market shift)
- What does "success" look like 3–6 months from now? Be vague if needed — this helps calibrate direction size.
- Are there directions you have already ruled out? (Prevents wasted cycles.)
- Are there constraints (time, headcount, platform, compliance) that bound the solution space?
- Is the goal to refine the existing charter, or is a pivot or expansion possible?

If the user has no specific prompt, proceed with a pure gap analysis: compare charter intent to codebase reality and surface the biggest mismatches as direction seeds.

### 3. Explore existing directions

Check for prior exploration documents to avoid duplication:

```bash
ls docs/directions/ 2>/dev/null
find . -path "*/directions/*.md" | head -10
```

Read any recent direction documents. Note whether the user chose a direction, abandoned one, or is revisiting after new information.

### 4. Generate directions

For each direction, produce:

| Field | Description |
| ----- | ----------- |
| **Summary** | One paragraph. What this direction is and what it changes. |
| **Charter alignment** | Fits existing charter / Requires charter refresh / Contradicts charter. Explain. |
| **Evidence** | 2–4 bullets from the codebase, commit history, existing plans, or user context that support this direction. |
| **Trade-offs** | What this direction sacrifices. Be specific. |
| **Rough size** | T-shirt size (S/M/L/XL) with a week range. |
| **Confidence** | High / Medium / Low — based on evidence strength, not optimism. |
| **Next step if chosen** | The skill to invoke next (`create-charter`, `plan-epic`, or `plan-feature`). |

**Quality checks for the direction set:**

- **Distinctness:** Do any two directions collapse into the same outcome? If so, merge or sharpen.
- **Coverage:** Does the set span the solution space? If every direction is conservative, add a bold one. If every direction is radical, add a safe one.
- **Evidence strength:** Is each direction supported by at least two observable facts? If a direction is pure speculation, downgrade confidence or remove it.
- **Charter honesty:** If a direction contradicts the charter, say so explicitly. Do not hide misalignment.

### 5. Write the options document

```bash
mkdir -p docs/directions
```

Assign the next available ID:

```bash
ls docs/directions/ | grep -E '^[0-9]+' | sort | tail -1
```

Write the finalized directions to `docs/directions/NNN-<slug>.md` using the template in `references/directions_template.md`.

Include a "Decision log" section at the bottom: a table with columns `Direction`, `Status` (under consideration / chosen / rejected / merged), and `Rationale`. The user fills this in after review.

### 6. Final response

Report:

- Confirmation that the directions document has been written.
- The assigned direction ID and file path.
- A one-sentence summary of each direction.
- Any directions that contradict the existing charter — flag these explicitly.
- Recommended next step: user reviews the document, then runs `create-charter` (if a pivot is needed), `plan-epic` (if a quarter-level initiative is chosen), or `plan-feature` (if a small, self-contained bet is chosen).

## Idempotency

If `docs/directions/NNN-<slug>.md` already exists:

1. Read the existing document fully.
2. Ask the user whether they want to update the existing exploration or create a new one.
3. If updating, preserve the ID and metadata, update changed sections, and refresh the "Last updated" field.
4. If creating a new direction set, assign the next available ID.

## When not to use this skill

- Do not use this skill when the path is already clear — use `plan-epic` or `plan-feature` directly.
- Do not use this skill to produce a single recommended plan — the output must be a set of options for human choice.
- Do not use this skill for purely technical refactoring decisions with no product impact — use an RFC or architecture decision record instead.
- Do not use this skill to update an existing plan in-flight — use `plan-epic` or `plan-feature` to revise the plan directly.
