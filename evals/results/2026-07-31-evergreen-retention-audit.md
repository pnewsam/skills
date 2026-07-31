# Evergreen Skill Retention Audit

Date: 2026-07-31

## Question

Which active packages justify permanent routing and maintenance attention as
recurring workflows, evergreen references, or necessary specialist routers?

## Retention test

Assess skills without collapsing the decision into a universal numeric score:

1. **Recurrence:** Is there a plausible repeated user task or repeated decision?
2. **Distinctive value:** Does the skill add non-obvious judgment, fragile
   mechanics, safety, recovery, or proof beyond a capable direct prompt?
3. **Pattern fit:** Does it have one clear role, outcome, effect boundary, and
   relationship with neighboring skills?
4. **Maintenance integrity:** Is the package complete, current, testable, and
   proportionate to the routing attention it consumes?

A lower-frequency skill can remain when its decisions are high-risk or its
artifact is strategically durable. A frequently usable prompt template does
not automatically deserve a skill.

## Archived now

| Skill | Decision | Replacement |
| --- | --- | --- |
| `setup-browser-testing` | Archive | One-time framework setup is ordinary implementation work. Represent it as a `plan-feature` / `execute-feature` item when durable planning is warranted, or request it directly. |
| `save-session` | Archive | Built-in task continuity and direct handoff-note requests cover this generic summarization behavior without permanent routing metadata. |
| `color-expert` | Archive intact | The preserved external package advertises missing references. Use maintained `ui-color` and `design-visual-language`; re-import only if the complete upstream package is available. |

`plan-browser-tests` remains, but Audit mode now reports in chat by default and
updates an epic only when explicitly requested. It no longer creates a
permanent audit artifact or routes to a setup skill.

## Family assessment

| Family | Assessment | Rationale |
| --- | --- | --- |
| Diagnosis, Git, PR, and validation | Strong keep | Repeated workflows with consequential effect boundaries, evidence requirements, and dirty-worktree or external-write safety. |
| Product direction and delivery | Strong keep | The charter, direction, epic, feature, execution, and validation artifacts carry durable state and recovery semantics. |
| Repository analysis | Strong keep | Quality, security, design-system, failure, and threat analysis encode metrics, uncertainty, and proof boundaries rather than generic review prompts. |
| Browser-test coverage | Keep after pruning | Coverage planning, adding tests, and repairing tests recur; setup itself does not. The two executors remain narrow but protect test intent and distinguish product regressions from test defects. |
| Linear operations | Keep | Record creation and polishing recur across issues/projects and benefit from live field resolution, duplicate checks, one-write stopping points, and verification. |
| Expert routers | Keep, with `consult-expert` monitored | Domain routers prevent loading entire specialist families. `consult-expert` adds cross-domain synthesis and epic-ready intake, but should be retired if platform routing becomes equally reliable without it. |
| Backend, platform, compliance, quality | Strong keep | Focused references encode durable architecture, operational, security, testing, and maintainability decisions with clear adjacent boundaries. |
| React and Python | Keep | Stack-specific references repeatedly change implementation decisions and are more useful as project-scoped profiles than global defaults. |
| UI and design | Keep; compact separately | The decision domains are durable and distinct. Several files are long, so progressive-disclosure cleanup is warranted, but length alone is not a removal reason. |
| External creative | Opt-in keep | `emil-design-eng` and `svg-animations` are complete, explicitly external, and excluded from maintained advisory profiles. They add no local editing obligation unless intentionally updated from upstream. |

## Borderline skills to monitor

- `consult-expert`: useful cross-domain synthesis today, but potentially
  redundant with increasingly capable automatic skill routing.
- `add-browser-test` and `fix-browser-test`: retain while their test-intent,
  selector, regression, and plan-update boundaries materially improve direct
  execution. Merge them into shared execution/diagnosis only if those behaviors
  become reliably covered there.
- `polish-issue` and `polish-pr`: low algorithmic novelty, but repeated use and
  strict substance-preservation/external-write boundaries currently justify
  their small routing cost.

## Important retains despite lower frequency

- `create-charter` creates and refreshes a constitutional product artifact; it
  is not ordinary project scaffolding.
- `document-architecture` is refreshable, evidence-derived documentation with
  architecture and diagram-selection judgment.
- `threat-model` may be invoked less often, but its security consequence and
  structured trust-boundary reasoning justify retention.
- `create-project` is one operation per project, not one operation per
  installation; live workspace resolution and external-write safety recur.

## Separate improvement backlog

1. Namespace `async-patterns` and `error-handling` consistently with their
   JavaScript/TypeScript scope, likely as `typescript-*` references.
2. Review the longest maintained UI and React references for progressive
   disclosure and duplicated examples without merging distinct decision domains.
3. Add real invocation telemetry if the client can provide it. This audit uses
   structural and behavioral evidence, not observed frequency counts.

## Validation

- Registry validation: 103 active skills, 0 errors, 50 warnings, and 43 routing/effect cases.
- Remaining warnings: 49 packages lack optional `default_prompt` metadata; the
  externally preserved `emil-design-eng` body exceeds the progressive-disclosure
  guideline. Neither warning is a broken active route.
- `plan-browser-tests` and `consult-expert` package validation passed.
- Catalog and evaluation JSON parsed successfully.
- Git whitespace validation passed.
- All CLI tests passed.

An independent disposable Audit-mode trial inspected a Playwright fixture with
one weak login test and three uncovered priority flows. It correctly reported
the coverage mismatch, distinguished a static flake risk from observed
flakiness, treated missing app startup as an ordinary prerequisite, did not run
an unavailable suite, and caused no file, Git, network, or external writes. No
epic or audit artifact was created.
