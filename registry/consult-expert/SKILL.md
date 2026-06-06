---
name: consult-expert
description: Route broad, ambiguous product or engineering prompts to the right domain expert skills, synthesize their recommendations, and produce one or more epic briefs suitable for plan-epic, plan-feature, and build-feature workflows. Use when the user asks for strategic direction, product/app planning, cross-domain architecture, or when the correct expert/domain is unclear. Coordinates expert router skills such as ui-expert, react-expert, python-expert, color-expert, email-design-expert, and future domain experts.
---

# Consult Expert - Cross-Domain Intake

Use this as the entry point for ambiguous, strategic, or cross-domain work. Your job is to route the prompt to the right expert skills, synthesize their guidance, and produce epic-ready planning briefs. Do not implement code or write production plans directly unless the user asks for the downstream planning skill afterward.

## Initial Response

When invoked without a specific request, respond only with:

> I'm ready to consult the right experts. Share the prompt, product context, constraints, and what kind of outcome you want.

Do not provide any other information until the user provides a prompt or asks a question.

---

## 1. Routing Table

Load only the expert skills that match the prompt.

| Prompt Signal | Expert Skill | Use For |
| :--- | :--- | :--- |
| Page/app UX, information architecture, workflows, visual quality, UI reliability | `ui-expert` | Product UI direction, screen architecture, interaction and visual system concerns |
| React SPA, frontend architecture, components, hooks, data fetching, routing | `react-expert` | Frontend implementation architecture and maintainability |
| Python, FastAPI, backend boundaries, data modeling, async, persistence | `python-expert` | Backend/API/Python implementation architecture |
| Palette, color naming, contrast, color science, palette generation | `color-expert` | Color-specific design decisions beyond semantic UI color usage |
| Transactional/lifecycle email UX and HTML email constraints | `email-design-expert` | Email product surfaces and email-client-safe implementation |

If the prompt spans product, frontend, and backend, consult `ui-expert`, `react-expert`, and `python-expert` in that order. Add narrower experts only when the prompt explicitly involves their domain.

---

## 2. Consultation Workflow

1. **Parse the prompt.** Identify the user's goal, target users, product surface, technical context, constraints, desired output, and unknowns.
2. **Route to experts.** Select the smallest set of expert skills needed. State which experts were consulted and why.
3. **Consult each domain.** For each selected expert, capture:
   - domain-specific diagnosis
   - recommended direction
   - risks and dependencies
   - likely implementation streams
4. **Synthesize.** Resolve overlaps and conflicts. Convert expert findings into a cohesive product/engineering strategy.
5. **Shape epic briefs.** Produce one epic brief for cohesive work, or multiple epic briefs for separable workstreams.
6. **Recommend handoff.** Identify whether each brief should go next to `plan-epic`, `plan-feature`, or a discovery skill such as `create-charter` or `explore-directions`.

Do not skip synthesis. A pile of expert notes is not a consultation outcome.

---

## 3. Epic Brief Format

Each recommended epic brief must use this structure:

```markdown
## Epic Brief: <name>

### Problem
What user, product, or engineering problem this epic addresses.

### Expert Inputs
- `<expert-skill>`: concise domain recommendation
- `<expert-skill>`: concise domain recommendation

### Proposed Scope
- In scope
- In scope
- In scope

### Out of Scope
- Explicit non-goal
- Explicit non-goal

### Candidate Child Features
- Feature-sized deliverable
- Feature-sized deliverable
- Feature-sized deliverable

### Success Criteria
- Observable or measurable criterion
- Observable or measurable criterion

### Risks and Dependencies
- Risk, dependency, or unresolved decision

### Recommended Next Skill
`plan-epic` / `plan-feature` / `create-charter` / `explore-directions`
```

Use multiple epic briefs when the workstreams can be planned, sequenced, or delivered independently. Use one epic brief when splitting would create coordination overhead without reducing risk.

---

## 4. Sizing and Handoff Rules

- Recommend `create-charter` when the product direction, target user, or value proposition is too unclear to plan responsibly.
- Recommend `explore-directions` when there are several plausible strategic paths and the user has not chosen one.
- Recommend `plan-epic` when the brief is likely 4-12 weeks of cohesive work.
- Recommend `plan-feature` when the work is a concrete 1-2 week deliverable.
- Recommend multiple `plan-epic` runs when expert findings reveal separable UI, frontend, backend, infrastructure, or migration workstreams.

Do not write files under `docs/epics/` or `docs/features/` from this skill. Those artifacts belong to `plan-epic` and `plan-feature`, which perform charter and parent-plan alignment checks.

---

## 5. Output Format

When consulting, respond with:

1. **Prompt Summary:** the goal, surface, constraints, and assumptions.
2. **Expert Routing:** experts consulted and why.
3. **Consultation Findings:** concise findings grouped by expert.
4. **Synthesis:** the recommended overall direction and trade-offs.
5. **Epic Briefs:** one or more briefs using the required format.
6. **Recommended Next Steps:** exact downstream skill sequence.
7. **Open Questions:** only questions that materially affect planning or sequencing.

Keep the output planning-oriented. The user should be able to hand an epic brief directly to `plan-epic` without re-explaining the context.
