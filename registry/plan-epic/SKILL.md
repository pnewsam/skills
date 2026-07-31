---
name: plan-epic
description: Create or update one charter-aligned epic plan for a cohesive 4–12 week initiative. Use for strategic initiatives or large collections of bug-bash, app-feedback, or quality observations that need deduplication and grouping into independently plannable child features. Reads the charter, directions, and existing plans and writes one docs/epics/ document; never modifies source code, Git, or external systems.
---

# Plan Epic

## Outcome

Create or update one `docs/epics/NNN-<slug>.md` plan with a bounded problem,
measurable success criteria, explicit scope, and independently plannable child
features. Stop before creating feature plans or implementing work.

## Use and boundaries

Use `plan-epic` when one cohesive initiative needs roughly 4–12 weeks of work
or coordination across several child features. The input may be a selected
strategic direction, a broad technical initiative, or an unstructured set of
bug-bash or product-feedback observations.

- Use `plan-feature` directly for one bounded 1–2 week deliverable.
- Use `create-charter` when `docs/CHARTER.md` is absent or no longer provides a
  usable product direction.
- Use `explore-directions` when several strategic paths remain plausible and
  none has been selected.
- For a read-only question about an existing epic's status, inspect the plan
  and linked evidence directly in chat; do not create a permanent audit
  artifact unless the user explicitly requests a document.

## Effects and inputs

This workflow may read planning and repository context and create or update one
epic file. It does not modify source code, configuration, branches, commits,
feature plans, tickets, or external systems.

Require:

- a usable `docs/CHARTER.md`
- one identifiable initiative or collection of observations
- an existing epic path when the user wants an update

Treat dictated notes and rough observations as evidence to normalize, not as
verified defects. Preserve uncertainty rather than inventing reproduction
steps, causes, or scope.

## Workflow

### 1. Establish context and normalize the input

Read `docs/CHARTER.md` fully. Capture the relevant value proposition, guiding
principles, north-star or leading indicators, and non-goals. If the initiative
cannot be connected to the charter in one clear sentence, stop and recommend a
charter or direction decision.

Inspect `docs/directions/`, `docs/epics/`, and `docs/features/` for a chosen
direction, overlapping plans, dependencies, and the next available epic ID.
When updating, read the existing epic and preserve its ID, completed child
features, decisions, and supported progress.

Clarify the intended outcome, affected users or systems, time horizon,
deadlines, dependencies, and non-goals. If the scope is smaller than one epic,
route to `plan-feature`.

For bug-bash, app-feedback, or other observation collections:

1. Extract distinct observations and retain useful source wording.
2. Deduplicate only observations that describe the same underlying behavior.
3. Record category, severity, effort, and confidence when supported.
4. Group observations by workflow, area, likely root cause, or shared
   verification path into a small number of coherent child features.
5. Keep ambiguity visible and do not create a parallel bug-bash tracker.

### 2. Draft or update the epic

Use `references/epic_template.md`. Define:

- charter alignment and the concrete problem or opportunity
- 2–4 goals and measurable, time-bounded success criteria
- explicit in-scope and out-of-scope boundaries
- independently plannable child features with stable checklist state
- dependencies, risks, sequencing, and target window

For observation-driven epics, include the conditional issue inventory and
source-notes sections from the template. Every retained observation must map to
one child feature or an explicit out-of-scope decision.

When updating an epic, change only conclusions affected by new evidence.
Preserve completed items unless the evidence shows they are no longer complete;
state that discrepancy instead of silently reopening work.

### 3. Validate, write, and report

Before writing, check:

- **Alignment:** goals and criteria directly support the charter.
- **Scale:** one team could plausibly deliver the scope in 4–12 weeks.
- **Measurement:** each success criterion has a target and method.
- **Boundaries:** non-goals exclude plausible scope expansion.
- **Decomposition:** each child can be planned and deprioritized independently.
- **Coverage:** observation-driven inputs are deduplicated without losing a
  distinct issue, and every issue has a disposition.

Revise failures before writing. Create or update exactly one
`docs/epics/NNN-<slug>.md` file. Do not create `docs/features/` plans in the same
run.

Report the path, epic ID, core argument, number of child features, material
scope or alignment concerns, and the recommended next `plan-feature` target.
For observation-driven input, also report distinct observation count,
highest-severity items, and unresolved ambiguities.

## Safety and idempotency

- Never invent charter content, observed behavior, severity, or certainty.
- Never discard a distinct observation merely because it is small.
- Never reset completed epic progress during an update.
- Reuse a matching existing epic rather than creating a duplicate; if create
  versus update is materially ambiguous, ask before writing.
- Keep planning, implementation, Git delivery, and publication as separately
  authorized actions.

## Output contract

Return the source inputs inspected, epic path and ID, create/update decision,
child-feature count, observation count when applicable, validation results,
unresolved questions, and a complete file/Git/external-effect audit.
