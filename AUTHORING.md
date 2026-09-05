# Authoring and maintaining skills

Skills must improve task outcomes, consistency, or efficiency enough to justify their discovery, context, and maintenance cost. The model already knows general technique. Keep only guidance that changes useful decisions, constraints it cannot infer, fragile mechanics, and tools or evidence contracts that earn their place. A verifier is not automatically valuable, and a short preference is not automatically redundant.

## Architecture

| Layer | Owns | Does not own |
| --- | --- | --- |
| Operation | A meaningful result within one independently reviewable work unit | A mandatory phase or approval ritual |
| Runbook | Concrete task mechanics, effects, verification, and recovery | A second general delivery policy |
| Reference | Compact conventions, requirements, or decision guidance | External actions or an encyclopedia |
| Orchestration | Dependencies, progress, recovery, and proof across several units | Implementation mechanics within a single PR |

The six operations are analyze-work, plan-work, execute-work, validate-work, review-work, and deliver-work. Their shared contract is `registry/work-conventions/SKILL.md`. The agent owns the task and continues through authorized operations without a seventh lifecycle wrapper. Runbooks remain directly callable. Routing is a capability, not a separate layer.

One unit normally produces one PR and may span multiple commits and sessions. Reuse an issue or feature plan as its record; do not impose a new file hierarchy. Separate implemented, validated, reviewed, published, merged, and deployed using actual evidence. Initiative records coordinate multiple units and integration criteria.

## Admission and retention

Identify the recurring user request, the non-obvious value, and the smallest owner before adding a package. First consider ordinary agent behavior, an existing operation, a conditional resource, or an existing tool. Do not preserve an obsolete family by moving all of its prose into a large reference.

Keep a separate runbook when mechanics, recovery, effects, or proof are distinct. Keep a reference when it expresses an actual preference, applicable obligation, or repeatedly useful corrective emphasis. Keep a checker only when its measured property is relevant and its limitations are explicit. Model judgment and metrics are not ground truth.

Compare realistic tasks with and without the skill, including a minimal-agent baseline. Evaluate completion, correctness, evidence, preservation of user work, avoidable questions, recovery, time, and context. Claims of quality improvement need actual trials; package validation is not behavioral evaluation. No category is exempt. Reassess when models, tools, or project needs change.

Retire redundant entry points rather than maintaining permanent aliases. Preserve useful history in archive/ and record migrations in docs/registry-rebuild.md. Only extract material with an identified current caller and decision benefit. Keep project-specific and external packages optional.

## Package contract

Each active package has `SKILL.md` with name and description frontmatter, matching its directory. The description explains the actual trigger and material boundaries. Include matching `agents/openai.yaml` client metadata without changing existing invocation policy unnecessarily. Automatic discovery stays enabled unless the user asks otherwise.

Use `references/`, `scripts/`, and `assets/` only for actual conditional detail, reusable executable mechanics, or output assets. Link every resource from the entry point at the point it is relevant. Longer references need a short contents section. Resolve helper paths from the installed package, not the user's working directory. Avoid generic command catalogs, redundant safety recitations, and mandatory template padding.

Workflow instructions need a result, scope/effects, meaningful decisions, recovery, evidence, and return contract. Use as many sections as clarity requires; neither three phases nor six operations is a mandatory sequence. Detailed steps are justified by fragile mechanics, not habit.

## Authorization and continuation

User and repository instructions govern. Carry established authorization across operations. A user asking to implement a clear change does not need a new plan or approval first. A request to analyze only remains analysis only. Publication, messages, merge, deployment, and external tracker mutations need authorization from the request or established context; completing an earlier stage does not grant it.

Preserve unrelated changes; isolate when possible, clarify only when ownership or consequence is genuinely ambiguous. Do not stop merely at the end of a skill when the task still contains authorized work. Do not record unavailable evidence as passing. After ambiguous external writes, read actual state before retrying; never bypass a permission rejection through a different path.

## Catalog and installation

`catalog.json` records every active package's layer, scope, possible effects, required dependencies, optional skill routes, and resources. Effects describe possible operations across modes, not permission grants. `requires` are acyclic package dependencies installed transitively. `optional_skills` are conditional recommendations that do not expand an installation. If an optional skill is unavailable, use the ordinary capability or state the specific limitation; do not promise an unavailable delegate.

Profiles compose use cases; the general profile contains the seventeen general skills. Source layout stays flat. A cross-package resource path requires a declared dependency. Profiles and individual selections install required dependencies; optional organization packages remain separate.

Preserved external bodies must match their recorded origin commit; update upstream intentionally, never silently rewrite them. Local project rules belong in repository instructions rather than the generic registry.

## Validation

Run `python3 scripts/validate_registry.py`, `python3 -m unittest discover -s scripts -p 'test_*.py'`, `node --test tests/*.test.mjs`, and `go test -count=1 ./...` from cli/ for changes to this architecture/tooling. Run narrower relevant checks for a small later edit. Validate schemas, resource/dependency integrity, active routes, profile closure, and preserved external bodies.

Behavioral trials belong in evals/results with the actual prompt, candidate, actions, results, effects, and limitations. Use fresh disposable repositories and independent evaluation for consequential workflow changes. Compare prior/new/minimal baselines when making improvement claims. Never run live external writes just to make an evaluation look complete.
