# Mechanics

How the skills system works, how to think about using it, and how to install skills effectively.

## How skills are loaded

Skills are installed by symlinking SKILL.md files into a skills directory that the AI tool reads. At session startup, only the **name and description** from each skill's frontmatter are loaded into context. The full skill content is loaded only when the skill is invoked during a session.

This means:

- **Having many skills available is cheap.** 50+ installed skills add only a few thousand tokens of description text at startup. Install liberally.
- **Invoking a skill is what costs context.** Each invocation loads the full SKILL.md (typically 3,000-8,000 tokens). Invoking 3-5 skills in a session is comfortable; invoking 15 would crowd out working context.
- **Descriptions matter for routing.** The model uses the one-line description to decide which skill to invoke. As your skill library grows, descriptions must be precise and non-overlapping so the right skill triggers.

## Where to install

Skills can be installed at two levels:

| Level                 | Location                    | Scope                         | Best for                                                                    |
| --------------------- | --------------------------- | ----------------------------- | --------------------------------------------------------------------------- |
| **Personal / global** | `~/.claude/skills/`         | Every session, every project  | General-purpose workflow skills (git, session logging, PR prep)             |
| **Project**           | `<project>/.claude/skills/` | Sessions in this project only | Stack-specific skills (React, security, testing patterns for this codebase) |

**For teams:** Project-level skills committed to the repo (in `.claude/skills/`) are shared with everyone who works on the project. This is the right place for team conventions, stack-specific principles, and project-specific workflows. Personal skills stay in `~/.claude/skills/` and reflect individual preferences.

## Skill groups

The skills in this registry are organized into groups. As the library grows, groups help you install or remove related skills as a unit and reason about which skills are active where.

| Category      | Group               | Skills                                                                                                                                                                                                                                                     | Recommended install                    |
| ------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| **Product**   | **product-direction** | create-charter, plan-epic, plan-feature                                                                                                                                                                                                                  | Global — when defining product vision  |
| **Product**   | **bug-bash**        | plan-bug-bash, fix-bug-bash-item                                                                                                                                                                                                                           | Global — useful anywhere               |
| **Design**    | **frontend-design** | extract-design-system, design-audit, design-fix, design-crit, audit-component-size, decompose-component, redesign-component, redesign-screen, svg-animations, emil-design-eng, color-expert                                                                | Project — when actively refactoring UI |
| **Engineering** | **git-workflow**    | stash-work, save-session, prepare-pr, revise-pr, review-pr, assess-pr-risk                                                                                                                                                                                 | Global — useful in every repo          |
| **Engineering** | **react-spa**       | react-component-design, react-project-structure, react-spa-architecture, react-hooks-effects, react-form-patterns, react-state-management, react-data-fetching, react-routing, react-performance, react-error-handling, react-accessibility, react-testing | Project — only in React SPA projects   |
| **Engineering** | **security**        | plan-vulnerability-remediation, remediate-vulnerability, plan-code-scanning-remediation, remediate-code-scanning                                                                                                                                           | Project — when doing security work     |
| **Engineering** | **browser-testing** | plan-browser-tests, add-browser-test, audit-browser-tests, fix-browser-test                                                                                                                                                                                | Project — where you have browser tests |
