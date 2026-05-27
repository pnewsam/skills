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
| **Product**   | **product-direction** | explore-directions, create-charter, plan-epic, plan-feature, build-feature, advance-epic                                                                                                 | Global — when defining product vision  |
| **Product**   | **bug-bash**        | plan-bug-bash, fix-bug-bash-item                                                                                                                                                                                                                           | Global — useful anywhere               |
| **Design**    | **frontend-design** | extract-design-system, design-audit, design-fix, design-crit, audit-component-size, decompose-component, redesign-component, redesign-screen, svg-animations, emil-design-eng, color-expert                                                                | Project — when actively refactoring UI |
| **Design**    | **ui-patterns**     | ui-patterns, ui-forms, ui-feedback, ui-actions                                                                                                                                                                                                              | Global or project — when making UI/UX decisions |
| **Engineering** | **git-workflow**    | stash-work, save-session, prepare-pr, revise-pr, review-pr, assess-pr-risk                                                                                                                                                                                 | Global — useful in every repo          |
| **Engineering** | **react-spa**       | react-component-design, react-project-structure, react-spa-architecture, react-hooks-effects, react-form-patterns, react-state-management, react-data-fetching, react-routing, react-performance, react-error-handling, react-accessibility, react-testing | Project — only in React SPA projects   |
| **Engineering** | **security**        | plan-vulnerability-remediation, remediate-vulnerability, plan-code-scanning-remediation, remediate-code-scanning                                                                                                                                           | Project — when doing security work     |
| **Engineering** | **browser-testing** | setup-browser-testing, plan-browser-tests, add-browser-test, audit-browser-tests, fix-browser-test, validate-changes, validate-feature                                                                                                                     | Project — where you have browser tests |

## Authoring skills

Guidelines for writing and maintaining skills in this registry.

### Skill scope

A skill should cover **one decision domain** — a set of related questions a user asks as a unit. The test: can you describe the skill's purpose in a single sentence without using "and"?

| Good scope (single domain) | Too broad (multiple domains) |
| :--- | :--- |
| "How do I handle loading, empty, and error states?" | "How do I build good UI?" |
| "Which React hook pattern should I use?" | "How do I write React and TypeScript and CSS?" |
| "How do I structure form containers and fields?" | "How do I build forms, tables, and modals?" |

### Skill length

- **Target 2,000–6,000 tokens** (roughly 200–600 lines of markdown) for a reference skill. This keeps the invocation cost manageable (see "How skills are loaded" above) while providing enough depth to be useful.
- **Workflow skills** (plan/execute patterns) are typically shorter — 100–300 lines — since they describe a process rather than a knowledge base.
- **If a skill exceeds ~500 lines**, it's a strong signal that it covers multiple decision domains and should be split. The `ui-patterns` skill set (4 files) was split from a single 700-line file into focused skills covering data display, forms, feedback, and actions separately.
- **A skill under ~50 lines** is probably too thin to be worth a separate invocation. Consider merging it into a sibling skill or expanding it.

### When to split a skill

Split when:
- The file exceeds ~500 lines and covers 3+ distinct topics.
- The description needs an "and" to connect unrelated concepts.
- Different user questions would trigger different parts of the file — meaning the model wastes context loading sections irrelevant to the query.
- The skill covers both "how to decide" (reference) and "how to execute" (workflow) for the same domain. These should be separate skills, or the reference should be pulled out.

Keep together when:
- The topics form a natural cascade — the user almost always needs all of them to answer their question.
- Splitting would force the model to invoke 3 skills to answer what should be a single question.
- Each section is too thin to stand alone.

### Skill naming

- Use **kebab-case, lowercase** for the directory and frontmatter `name` field.
- Names should suggest the **decision domain**, not the format: prefer `ui-patterns` over `ui-guide`, prefer `react-hooks-effects` over `react-hooks-best-practices`.
- The name is used for routing, so it must be unique and unambiguous across the entire registry.
- Reference skills typically use a noun phrase (`color-expert`, `ui-patterns`). Workflow skills typically use a verb phrase (`plan-epic`, `build-feature`).
