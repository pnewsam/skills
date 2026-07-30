# Authoring and maintaining skills

Skills are compact operating manuals for agents. They should add repeatable
judgment, safe workflow, or domain knowledge that the base model and repository
instructions do not already provide.

## Loading model

Clients normally discover a skill from its `name` and `description`, then load
the full `SKILL.md` only when selected. This has two consequences:

- Every installed description consumes routing attention even when the skill is
  never invoked. Prefer a relevant install profile over installing everything.
- The full skill competes with the task, code, and conversation for context.
  Keep the main file focused and move optional detail to named resources.

Descriptions are routing contracts, not summaries. State what the skill does,
concrete trigger phrases or situations, important exclusions, and any material
effects such as writing files, committing, pushing, or posting externally.

## Skill kinds

Use three kinds. A skill should have one primary kind.

| Kind | Purpose | Typical shape |
| --- | --- | --- |
| Router | Select the smallest relevant expert set | Routing table, overlap boundaries, synthesis rules |
| Workflow | Produce a repeatable outcome | Preconditions, modes/effects, ordered procedure, verification, output |
| Reference | Supply judgment in one decision domain | Decision rubric, examples, failure modes, review checklist |

An orchestrator is a workflow that invokes other workflows. Keep it only when
the sequence has durable state and recovery semantics; do not create an
orchestrator merely to save the user from naming the next obvious skill.

## Scope and granularity

A skill should cover one user-recognizable decision domain or one bounded
workflow outcome.

Split a skill when:

- Different requests use disjoint sections.
- It mixes a reusable knowledge base with a long operational procedure.
- It has multiple independent external effects or ambiguous stopping points.
- Its description needs several unrelated trigger clauses.
- The main file exceeds roughly 500 lines and optional detail can be loaded
  lazily.

Keep related material together when splitting would make an ordinary request
load several tiny skills or when the decisions form one natural cascade.

Line count is a diagnostic, not a target. Fifty precise lines can be valuable;
two hundred repetitive lines are not. Prefer the shortest instructions that
reliably change agent behavior.

## Required package structure

```text
<skill-name>/
  SKILL.md                 # required
  agents/
    openai.yaml            # recommended client metadata
  references/              # optional, loaded only when named by SKILL.md
  scripts/                 # optional deterministic helpers
  assets/                  # optional output inputs, not prompt material
```

Keep `SKILL.md` frontmatter limited to:

```yaml
---
name: kebab-case-name
description: Clear routing contract with triggers, exclusions, and material effects.
---
```

The directory and `name` must match. Use a verb phrase for workflows
(`prepare-pr`) and a decision-domain noun phrase for references
(`react-state-management`). Router names may use `-expert` when they genuinely
route among focused children.

For repeatable convergence families, use consistent stage verbs:

- `analyze-<domain>` examines evidence and produces ranked candidates.
- `plan-feature` creates one bounded product or convergence work unit.
- `execute-feature` performs and verifies one planned item.

Name an analysis workflow for the domain or condition it examines, not for a
generic repository container. Prefer `analyze-quality`, `analyze-security`, or
`analyze-design-system` over `analyze-codebase`. Add a domain-specific
planning or execution workflow only when it has materially different
artifacts, effects, recovery semantics, or proof obligations that cannot be
expressed through the feature workflow.

## Recommended workflow anatomy

Use only the sections the workflow needs:

1. **Outcome** — the observable result and the natural stopping point.
2. **Use / do not use** — boundaries with neighboring skills.
3. **Modes and effects** — read-only, local files, local Git, network read, or
   external write.
4. **Inputs and preconditions** — required artifacts, tools, and repository
   state.
5. **Workflow** — ordered decisions and actions, with proportional detail.
6. **Safety and idempotency** — what reruns do and how user work is preserved.
7. **Verification** — evidence required before claiming success.
8. **Output contract** — what is returned or written, including incomplete work.

Do not encode product-level approval rituals inside a skill. If the user already
explicitly requested an in-scope action, an extra confirmation is usually noise.
Ask only when the target, scope, or material consequence remains ambiguous.

For multi-effect workflows, define explicit stop points. For example:

```text
preview -> local commit -> push -> external PR write
```

Completion of one stage never authorizes the next stage.

Keep a normal linear workflow to no more than three top-level phases. Approval
is a gate, not a phase. Put proportionate verification inside execution; keep
publication, deployment, or external writes as separately authorized delivery
actions. Internal substeps may be more detailed when they clarify a fragile
decision without creating additional lifecycle stages.

For metric-driven analysis and convergence planning, preserve this contract:

- baseline
- target
- guardrails or invariants
- reproducible measurement method and window
- exclusions, confidence, and limitations
- before/after evidence

Metrics identify investigation candidates; they do not establish defects by
themselves. Prefer repository-relative trends and corroborating signals over
universal thresholds or composite quality scores.

## Recommended reference anatomy

A reference skill should contain:

- A concise position or default.
- A decision rubric ordered by practical importance.
- Context-sensitive exceptions and trade-offs.
- Common failure modes, especially plausible agent mistakes.
- A review checklist that can be applied to real work.
- Handoff rules for adjacent domains.

Avoid encyclopedic background that does not alter a decision. Link to
authoritative primary sources when facts are unstable or precise attribution
matters; do not copy a documentation corpus into the skill.

## Routers

Routers should:

- Load the smallest set of focused skills needed for the request.
- Activate when the dominant child is unclear or the request spans two or more
  child domains that need synthesis.
- Yield directly to one focused child when exactly one bounded concern is
  clear.
- Define overlap boundaries and precedence.
- Preserve disagreements instead of flattening them into generic advice.
- Synthesize one recommendation and identify the next workflow, if any.
- Avoid duplicating the child skills' substantive guidance.

Do not include canned "initial response" text. The router is invoked in the
context of a real task and should respond to that task.

A router must add synthesis value; it should not become a mandatory tax on
every request in its family.

## Progressive disclosure

Keep always-needed instructions in `SKILL.md`. Put optional templates, detailed
rubrics, examples, and protocol minutiae in `references/`, and link each resource
from the exact step that needs it.

Rules:

- Do not duplicate a reference inline.
- Keep references one hop from `SKILL.md`; avoid reference chains.
- Give references over roughly 100 lines a short contents list.
- Delete or repair unreferenced and missing resources.
- Put deterministic, error-prone mechanics in `scripts/` and test them.
- Keep assets separate when they are copied into output rather than read as
  instructions.

## What not to put in a skill

- Generic encouragement, role-play, or tone instructions.
- Facts the base model reliably knows and can apply without help.
- Repository-specific rules that belong in `AGENTS.md` or project docs.
- Large command catalogs without decision logic.
- Destructive defaults, blind staging, force pushes, or unrelated cleanup.
- Hidden transitions to commit, push, deploy, post, or message.
- Claims about files, tools, ignore rules, or authentication that were not
  checked.
- Broken links, stale skill names, duplicate templates, or recovery-only
  deprecated skills in the active registry.
- Multiple competing ways to do the same operation unless the choice itself is
  the domain knowledge.

## Installation profiles

Keep the globally installed set small and broadly applicable:

- read-only diagnosis
- session preservation and local Git workflows
- PR preparation/review when GitHub is common

Install stack, framework, compliance, platform, and product-delivery families
at project scope when relevant. Use the `advisory` profile when broad
cross-domain routing is genuinely useful; a router and all of its children need
not be globally installed by default.

Define profile membership, profile composition, and provenance in the root
`catalog.json`. Keep includes acyclic and use them for semantic composition,
not as a substitute for deciding what belongs in a profile. Treat skills marked
`provenance: external` and `policy: preserve` as vendored: do not edit their
`SKILL.md` locally. Update their origin commit only when intentionally importing
a new upstream version.

## Validation and evaluation

Every change should pass four layers:

1. **Package validation:** frontmatter, name, metadata, and allowed structure.
2. **Resource integrity:** every referenced local file exists; every bundled
   reference or script is reachable from `SKILL.md`.
3. **Routing checks:** representative positive, negative, and overlap prompts
   select the intended skill.
4. **Behavior checks:** dry-run or sandbox scenarios verify stopping points,
   idempotency, preservation of unrelated work, and truthful completion.

High-effect workflows need regression cases for ambiguous requests, dirty
working trees, pre-existing destinations, unavailable tools, partial failures,
and reruns.

When changing a high-use skill, compare representative tasks before and after.
The useful metric is not whether the prose sounds better; it is whether the
agent chooses the right skill, takes the right bounded action, and stops in the
right place.
