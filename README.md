# Skills

Collected agent skills for Claude Code.

## Philosophy

Skills organize around two dimensions: **mode** and **phase**.

### Modes

| Convergence                                                                                                              | Divergence                                                                                                                                         |
| ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Toward established patterns**                                                                                          | **Into new territory**                                                                                                                             |
| The intent already exists. The work is alignment, consistency, and closing gaps.                                         | The intent doesn't exist yet, or requirements have outgrown it. The work is exploration, judgment, and choosing among valid outcomes.              |
| Fix design-system drift. Remediate known vulnerabilities. Repair broken tests. Enforce conventions. Update dependencies. | Redesign a page whose requirements grew. Plan tests for untested flows. Rearchitect a feature. Build a new product surface. Research alternatives. |

Work oscillates between the two. The first pass on anything is divergent. Once patterns are established, maintaining them is convergent. Over time, convergent work dominates — until requirements shift and another round of divergence is needed.

### Phases: Analyze, Plan, Execute

```
┌───────────┐      ┌───────────┐      ┌───────────┐
│  Analyze  │ ───> │   Plan    │ ───> │  Execute  │
│           │      │           │      │           │
│ Observe,  │      │ Decide,   │      │ Do the    │
│ measure,  │      │ propose,  │      │ work.     │
│ diagnose. │      │ prioritize│      │           │
│           │      │ get       │      │           │
│ Output:   │      │ buy-in.   │      │ Output:   │
│ audit,    │      │           │      │ code      │
│ critique, │      │ Output:   │      │ changes,  │
│ or review │      │ plan      │      │ PRs       │
└───────────┘      └───────────┘      └───────────┘
       ^                                    │
       └────────────────────────────────────┘
```

How each phase behaves depends on the mode:

| Phase       | Convergence                                               | Divergence                                                        |
| ----------- | --------------------------------------------------------- | ----------------------------------------------------------------- |
| **Analyze** | Pattern-match: find deviations from established standards | Evaluate: assess fitness for purpose, identify what's not working |
| **Plan**    | Often trivial — the fix is obvious from the deviation     | Substantive — multiple valid approaches, human weighs in          |
| **Execute** | Mechanical, batchable, low-risk                           | Creative, iterative, requires judgment                            |

Some skills span multiple phases (the redesign skills analyze, propose, and implement in one pass). Others are phase-specific and compose together — `plan-browser-tests` produces a plan that `add-browser-test` executes against, one item at a time.

### Mapping skills to the grid

|                 | Analyze                                                 | Plan                                                           | Execute                                                                                                                |
| --------------- | ------------------------------------------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Convergence** | design-audit, audit-component-size, audit-browser-tests | plan-vulnerability-remediation, plan-code-scanning-remediation | design-fix, fix-browser-test, fix-bug-bash-item, remediate-vulnerability, remediate-code-scanning, decompose-component |
| **Divergence**  | design-crit, extract-design-system                      | plan-browser-tests, plan-bug-bash                              | redesign-component, redesign-screen, add-browser-test                                                                  |

### Skill types: Workflow and Reference

**Workflow** skills are invoked to get something done. They have steps, produce artifacts or code changes, and operate within the mode/phase framework above.

**Reference** skills encode knowledge — principles, patterns, conventions, or domain expertise. They inform how work is done across modes and phases rather than driving a specific workflow. The react-\* principles, color-expert, and emil-design-eng are reference skills.

## Installation

```bash
git clone https://github.com/paulnewsam/skills.git
cd skills/cli
go build -o skills-cli ./cmd/skills
```

## Usage

```bash
# Interactive — choose harnesses and skills via TUI
./skills-cli

# Install all skills to all harnesses
./skills-cli install -a -y

# Install to a specific harness
./skills-cli install -t claude -y

# Project install (copies into <cwd>/.claude/skills)
./skills-cli install -p -y

# Check what's installed
./skills-cli status
```

Run `./skills-cli setup` to register `skills` as a global command in `~/.local/bin`. See [cli/README.md](cli/README.md) for full CLI documentation.

## How skills are loaded

Skills are installed by symlinking SKILL.md files into a skills directory that the AI tool reads. At session startup, only the **name and description** from each skill's frontmatter are loaded into context. The full skill content is loaded only when the skill is invoked during a session.

This means:

- **Having many skills available is cheap.** 50+ installed skills add only a few thousand tokens of description text at startup. Install liberally.
- **Invoking a skill is what costs context.** Each invocation loads the full SKILL.md (typically 3,000-8,000 tokens). Invoking 3-5 skills in a session is comfortable; invoking 15 would crowd out working context.
- **Descriptions matter for routing.** The model uses the one-line description to decide which skill to invoke. As your skill library grows, descriptions must be precise and non-overlapping so the right skill triggers.

### Where to install

Skills can be installed at two levels:

| Level                 | Location                    | Scope                         | Best for                                                                    |
| --------------------- | --------------------------- | ----------------------------- | --------------------------------------------------------------------------- |
| **Personal / global** | `~/.claude/skills/`         | Every session, every project  | General-purpose workflow skills (git, session logging, PR prep)             |
| **Project**           | `<project>/.claude/skills/` | Sessions in this project only | Stack-specific skills (React, security, testing patterns for this codebase) |

**For teams:** Project-level skills committed to the repo (in `.claude/skills/`) are shared with everyone who works on the project. This is the right place for team conventions, stack-specific principles, and project-specific workflows. Personal skills stay in `~/.claude/skills/` and reflect individual preferences.

### Skill groups

The skills in this registry are organized into groups. As the library grows, groups help you install or remove related skills as a unit and reason about which skills are active where.

| Group               | Skills                                                                                                                                                                                                                                                     | Recommended install                    |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| **git-workflow**    | stash-work, save-session, prepare-pr, revise-pr, review-pr, assess-pr-risk                                                                                                                                                                                 | Global — useful in every repo          |
| **react-spa**       | react-component-design, react-project-structure, react-spa-architecture, react-hooks-effects, react-form-patterns, react-state-management, react-data-fetching, react-routing, react-performance, react-error-handling, react-accessibility, react-testing | Project — only in React SPA projects   |
| **security**        | plan-vulnerability-remediation, remediate-vulnerability, plan-code-scanning-remediation, remediate-code-scanning                                                                                                                                           | Project — when doing security work     |
| **browser-testing** | plan-browser-tests, add-browser-test, audit-browser-tests, fix-browser-test                                                                                                                                                                                | Project — where you have browser tests |
| **bug-bash**        | plan-bug-bash, fix-bug-bash-item                                                                                                                                                                                                                           | Global — useful anywhere               |
| **frontend-design** | extract-design-system, design-audit, design-fix, design-crit, audit-component-size, decompose-component, redesign-component, redesign-screen, svg-animations, emil-design-eng, color-expert                                                                | Project — when actively refactoring UI |

## Skills

### Git Workflow

| Skill                                              | Type     | Mode        | Phase   | Description                                                                                                         |
| -------------------------------------------------- | -------- | ----------- | ------- | ------------------------------------------------------------------------------------------------------------------- |
| [stash-work](registry/stash-work/SKILL.md)         | workflow |             | execute | Stash in-progress work onto a local `wip/` branch with a descriptive commit and context file.                       |
| [save-session](registry/save-session/SKILL.md)     | workflow |             | analyze | Summarize the current working session and save it to `docs/tmp/`.                                                   |
| [prepare-pr](registry/prepare-pr/SKILL.md)         | workflow |             | execute | Prepare a pull request from a local branch — inspect changes, write a conventional commit, push, and open a PR.     |
| [revise-pr](registry/revise-pr/SKILL.md)           | workflow | convergence | execute | Revise an existing PR to ensure the title, description, and checklist accurately reflect the latest commits.        |
| [review-pr](registry/review-pr/SKILL.md)           | workflow |             | analyze | Review a pull request and post inline code review comments with an overall verdict.                                 |
| [assess-pr-risk](registry/assess-pr-risk/SKILL.md) | workflow |             | analyze | Assess the risk level of a pull request across blast radius, security sensitivity, test coverage, and dependencies. |

### Security

| Skill                                                                              | Type     | Mode        | Phase         | Description                                                                                                  |
| ---------------------------------------------------------------------------------- | -------- | ----------- | ------------- | ------------------------------------------------------------------------------------------------------------ |
| [plan-vulnerability-remediation](registry/plan-vulnerability-remediation/SKILL.md) | workflow | convergence | analyze, plan | Triage CVEs, Dependabot alerts, and audit findings, then group them into safe remediation PR plans.          |
| [remediate-vulnerability](registry/remediate-vulnerability/SKILL.md)               | workflow | convergence | execute       | Execute a vulnerability remediation plan — update dependencies, verify the fix, commit, push, and open a PR. |
| [plan-code-scanning-remediation](registry/plan-code-scanning-remediation/SKILL.md) | workflow | convergence | analyze, plan | Triage CodeQL and SAST alerts, then group them into remediation PR plans.                                    |
| [remediate-code-scanning](registry/remediate-code-scanning/SKILL.md)               | workflow | convergence | execute       | Apply source code fixes for CodeQL/SAST alerts, verify the fix, and create or update a pull request.         |

### Testing

| Skill                                                        | Type     | Mode        | Phase         | Description                                                                                                                    |
| ------------------------------------------------------------ | -------- | ----------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| [plan-browser-tests](registry/plan-browser-tests/SKILL.md)   | workflow | divergence  | analyze, plan | Analyze an application to identify critical user flows and produce a prioritized browser test plan.                            |
| [add-browser-test](registry/add-browser-test/SKILL.md)       | workflow | divergence  | execute       | Implement one browser integration test from the plan — picks the next unchecked flow, writes the test, and verifies it passes. |
| [audit-browser-tests](registry/audit-browser-tests/SKILL.md) | workflow | convergence | analyze       | Audit an existing browser test suite to identify stale tests, missing coverage, flaky patterns, and quality issues.            |
| [fix-browser-test](registry/fix-browser-test/SKILL.md)       | workflow | convergence | execute       | Repair a broken or flaky browser test — diagnoses the root cause, applies a targeted fix, and re-runs to confirm.              |

### Bug Bash

| Skill                                                    | Type     | Mode        | Phase         | Description                                                                                                                    |
| -------------------------------------------------------- | -------- | ----------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| [plan-bug-bash](registry/plan-bug-bash/SKILL.md)         | workflow |             | analyze, plan | Process stream-of-consciousness dictation about bugs and issues into a structured, prioritized plan of discrete units of work. |
| [fix-bug-bash-item](registry/fix-bug-bash-item/SKILL.md) | workflow | convergence | execute       | Execute one fix from a bug bash plan — investigate, apply a targeted fix, verify, commit, push, and open a PR.                 |

### React SPA Principles

| Skill                                                                | Type      | Description                                                                                                                                |
| -------------------------------------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| [react-component-design](registry/react-component-design/SKILL.md)   | reference | Component size, single responsibility, compositional patterns, and "branch early" — prefer distinct components over prop-toggled behavior. |
| [react-project-structure](registry/react-project-structure/SKILL.md) | reference | Base UI as a design system layer, domain components in `src/features/`, naming conventions, and feature module boundaries.                 |
| [react-spa-architecture](registry/react-spa-architecture/SKILL.md)   | reference | App entrypoints, provider composition, routing setup, environment config, API clients, auth bootstrap, and SPA deployment concerns.        |
| [react-hooks-effects](registry/react-hooks-effects/SKILL.md)         | reference | Effects as escape hatches, dependency arrays, cleanup, stale closures, refs vs state, Strict Mode, and custom hook boundaries.             |
| [react-form-patterns](registry/react-form-patterns/SKILL.md)         | reference | Form-library contexts for non-trivial forms, reusable field components, schema-level validation, dirty tracking, and wizards.              |
| [react-state-management](registry/react-state-management/SKILL.md)   | reference | Keep state low, minimize global state, treat URL/form/server/local state differently, derive don't sync.                                   |
| [react-data-fetching](registry/react-data-fetching/SKILL.md)         | reference | Server-state fetching, query keys, colocated API clients, mutations, invalidation, optimistic updates, pagination, and prefetching.        |
| [react-routing](registry/react-routing/SKILL.md)                     | reference | RESTful URL design, new views = new URLs, URL as source of truth for navigational state.                                                   |
| [react-performance](registry/react-performance/SKILL.md)             | reference | Profile first, then optimize — React.memo, useMemo/useCallback, code splitting, virtualization, concurrent features.                       |
| [react-error-handling](registry/react-error-handling/SKILL.md)       | reference | Error Boundaries at feature boundaries, Suspense for loading states, fallback UI design, route-level error handling.                       |
| [react-accessibility](registry/react-accessibility/SKILL.md)         | reference | Semantic HTML first, keyboard navigation, ARIA patterns, focus management, accessible forms, live regions, color/contrast.                 |
| [react-testing](registry/react-testing/SKILL.md)                     | reference | Integration tests for critical flows, unit tests for business logic, minimal component tests — test ROI over coverage percentage.          |

### Frontend / Design

| Skill                                                            | Type      | Mode        | Phase                  | Description                                                                                                                                           | Origin                                                                                     |
| ---------------------------------------------------------------- | --------- | ----------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| [extract-design-system](registry/extract-design-system/SKILL.md) | workflow  | divergence  | analyze                | Extract the implicit design system from a codebase into a documented contract (`docs/design_system.md`).                                              |                                                                                            |
| [design-audit](registry/design-audit/SKILL.md)                   | workflow  | convergence | analyze                | Scan pages or components against the design system contract and find deviations.                                                                      |                                                                                            |
| [design-fix](registry/design-fix/SKILL.md)                       | workflow  | convergence | execute                | Fix design system deviations identified by design-audit — mechanical, batchable alignment work.                                                       |                                                                                            |
| [design-crit](registry/design-crit/SKILL.md)                     | workflow  | divergence  | analyze                | Evaluate a UI view or page through multiple design lenses (polish, UX, hierarchy, composition, consistency).                                          |                                                                                            |
| [audit-component-size](registry/audit-component-size/SKILL.md)   | workflow  | convergence | analyze                | Scan a codebase to find React components that have grown too large and are good candidates for decomposition.                                         |                                                                                            |
| [decompose-component](registry/decompose-component/SKILL.md)     | workflow  | convergence | execute                | Break a large React component into smaller, well-named sub-components in separate files.                                                              |                                                                                            |
| [redesign-component](registry/redesign-component/SKILL.md)       | workflow  | divergence  | analyze, plan, execute | Redesign a UI component that has outgrown its original layout — audit what it displays and does, then propose and implement a better layout.          |                                                                                            |
| [redesign-screen](registry/redesign-screen/SKILL.md)             | workflow  | divergence  | analyze, plan, execute | Redesign a screen or page that has become cluttered or poorly organized as features accumulated.                                                      |                                                                                            |
| [svg-animations](registry/svg-animations/SKILL.md)               | reference |             |                        | Create performant SVG animations and illustrations: path animations, shape morphing, loading spinners, animated logos, gradients, masks, and filters. | [supermemoryai](https://github.com/supermemoryai/skills/blob/main/svg-animations/SKILL.md) |
| [color-expert](registry/color-expert/SKILL.md)                   | reference |             |                        | Color science expert — color theory, accessibility standards, palette generation, and practical color tools.                                          | [meodai](https://github.com/meodai/skill.color-expert)                                     |
| [emil-design-eng](registry/emil-design-eng/SKILL.md)             | reference |             |                        | Design engineering philosophy — polished animations, thoughtful component design, and invisible details that make software feel great.                | [emilkowalski](https://github.com/emilkowalski/skill)                                      |

**References:** [components.build](https://www.components.build/) · [frontend-guidelines](https://github.com/bendc/frontend-guidelines)

## Other Skill Collections

| Collection                                                                     | Author     |
| ------------------------------------------------------------------------------ | ---------- |
| [andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills) | multica-ai |
| [agent-skills](https://github.com/addyosmani/agent-skills)                     | addyosmani |
| [skills](https://github.com/mattpocock/skills)                                 | mattpocock |
| [gstack](https://github.com/garrytan/gstack)                                   | garrytan   |
