# Feature: <Feature Name>

## Metadata

- **ID:** <NNN>
- **Status:** draft
- **Created:** <date>
- **Owner:** <role or person>
- **Parent Epic:** <epic ID and link — `../epics/NNN-epic-name.md`>
- **Last updated:** <date>

## Parent Alignment

### Epic Reference
- **Epic goal advanced:** <quote the epic goal this feature serves>
- **Epic success criterion affected:** <which criterion and how>

### Charter Alignment Check
- [ ] This feature advances charter principle: <quote principle>
- [ ] This feature affects north star metric: <which metric — even indirectly>
- [ ] This feature does not violate charter non-goal: <quote non-goal>
- [ ] If partially misaligned, the exception is justified and documented below.

<If misaligned: explain the exception here.>

## User Story

As a <type of user>, I want <goal> so that <benefit>.

### Context

<What does the user do before, during, and after this feature? What is their mental model? 2–4 sentences.>

## Acceptance Criteria

<Each criterion must be testable and unambiguous. A QA engineer should be able to verify it without asking questions.>

### Must-Have (MVP)
- [ ] <Criterion 1 — specific, testable condition>
- [ ] <Criterion 2>
- [ ] <Criterion 3>

### Should-Have (if time permits)
- [ ] <Criterion 4>
- [ ] <Criterion 5>

### Won't-Have (explicitly out of scope for this feature)
- [ ] <What is deferred to a future iteration>

## Technical Notes

### Open Questions
- <Technical or product question that needs resolution before implementation>
- <Another open question>

### Architecture / Data Model
- <Any API changes, DB schema changes, or new services>
- <Data flow or state management considerations>

### Dependencies
- <What this feature depends on that is not in this feature's scope>
- <Other features, infrastructure, vendor services, etc.>

### Risk & Mitigation
| Risk | Likelihood | Impact | Mitigation |
| ---- | ---------- | ------ | ---------- |
| <Risk 1> | low/medium/high | low/medium/high | <how to reduce or handle> |

## UI / UX Notes

- <Link to designs, wireframes, or Figma>
- <Key interaction patterns>
- <Accessibility considerations>
- <Responsive behavior>

## Out of Scope

<What is explicitly not part of this feature, even if it seems related. Be specific enough to prevent scope creep.>

- <Item 1>
- <Item 2>

## Definition of Done

- [ ] All must-have acceptance criteria pass.
- [ ] Code is reviewed and merged to the main branch.
- [ ] Feature is tested in a staging environment.
- [ ] No regression in existing critical flows.
- [ ] Documentation updated (API docs, user-facing help, or internal wiki).
- [ ] Analytics / metrics instrumented, if applicable.
- [ ] Parent epic's feature checkbox is updated.

## Tasks

<Breakdown of implementation steps. Each task should be 1–3 days of work.>

- [ ] <Task 1 — e.g., scaffold API endpoint>
- [ ] <Task 2 — e.g., build UI component>
- [ ] <Task 3 — e.g., integrate frontend and backend>
- [ ] <Task 4 — e.g., write tests>
- [ ] <Task 5 — e.g., QA and bug fixes>

## Notes

<Open questions, decisions made, or references to discussions.>
