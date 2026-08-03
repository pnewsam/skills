---
name: consult-expert
description: Route broad, ambiguous, or cross-domain product and engineering requests to the smallest relevant expert set, synthesize trade-offs, and produce epic-ready briefs. Use for strategic intake spanning multiple domains or when the correct expert is unclear. Do not use when one focused domain or implementation task is already known.
---

# Consult Expert - Cross-Domain Intake

Use this as the entry point for ambiguous, strategic, or cross-domain work. Your job is to route the prompt to the right expert skills, synthesize their guidance, and produce epic-ready planning briefs. Do not implement code or write production plans directly unless the user asks for the downstream planning skill afterward.

## 1. Routing Table

Load only the expert skills that match the prompt.

| Prompt Signal | Expert Skill | Use For |
| :--- | :--- | :--- |
| Page/app UX, information architecture, workflows, visual quality, UI reliability | `ui-expert` | Product UI direction, screen architecture, interaction and visual system concerns |
| Visual design quality, elegance, composition, hierarchy, rhythm, simplicity, aesthetic direction | `design-expert` | Turning functional UI direction into coherent, calm, polished visual design |
| React SPA, frontend architecture, components, hooks, data fetching, routing | `react-expert` | Frontend implementation architecture and maintainability |
| Backend architecture, API contracts, service boundaries, persistence, jobs, integrations, auth boundaries | `backend-expert` | Language-agnostic server-side architecture and behavior |
| Platform engineering, environments, CI/CD, secrets, config, deploys, rollbacks, infrastructure as code | `platform-expert` | Operational platform, release safety, and production-readiness |
| Python, FastAPI, Python data modeling, async, persistence implementation | `python-expert` | Python and FastAPI implementation architecture |
| Code quality, maintainability, correctness, refactoring, testing strategy, reliability | `quality-expert` | Language-agnostic code health and system quality judgment |
| Security, accessibility, privacy, GDPR, HIPAA, vulnerability management, auditability, external obligations | `compliance-expert` | Required constraints, unacceptable risk, and evidence expectations |
| Palette, color naming, contrast, and palette generation | `ui-color` and `design-visual-language` | Semantic interface color, accessibility, and expressive palette direction |
| Transactional/lifecycle email UX and HTML email constraints | `ui-email` | Email product surfaces and email-client-safe implementation |

If the prompt spans product, frontend, and backend, consult `ui-expert`, `react-expert`, and `backend-expert` in that order. Add `platform-expert` when the work needs environments, CI/CD, secrets, deployment, rollback, infrastructure, or production-readiness planning. Add `python-expert` when the backend implementation is Python or FastAPI-specific. Add `quality-expert` when maintainability, test confidence, correctness, or reliability materially affects the plan. Add `compliance-expert` when security, accessibility, privacy, GDPR, HIPAA, vulnerability, audit, or regulatory concerns are in scope. Add `design-expert` when visual quality, aesthetic coherence, or interface elegance is meaningful. Add narrower experts only when the prompt explicitly involves their domain.

Use `ui-color` for semantic interface color and accessibility, and `design-visual-language` for expressive palette direction. State when a request requires deeper color-science expertise than the maintained registry provides.

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
