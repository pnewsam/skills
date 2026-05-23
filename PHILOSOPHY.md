# Philosophy

Skills organize around two dimensions: **mode** and **phase**.

## Modes

| Convergence                                                                                                              | Divergence                                                                                                                                         |
| ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Toward established patterns**                                                                                          | **Into new territory**                                                                                                                             |
| The intent already exists. The work is alignment, consistency, and closing gaps.                                         | The intent doesn't exist yet, or requirements have outgrown it. The work is exploration, judgment, and choosing among valid outcomes.              |
| Fix design-system drift. Remediate known vulnerabilities. Repair broken tests. Enforce conventions. Update dependencies. | Redesign a page whose requirements grew. Plan tests for untested flows. Rearchitect a feature. Build a new product surface. Research alternatives. |

## Phases

| Analyze                             | Plan                                     | Execute                    |
| ----------------------------------- | ---------------------------------------- | -------------------------- |
| Observe, measure, diagnose.         | Decide, propose, prioritize, get buy-in. | Do the work.               |
| Output: audit, critique, or review. | Output: plan.                            | Output: code changes, PRs. |

How each phase behaves depends on the mode:

| Phase       | Convergence                                               | Divergence                                                        |
| ----------- | --------------------------------------------------------- | ----------------------------------------------------------------- |
| **Analyze** | Pattern-match: find deviations from established standards | Evaluate: assess fitness for purpose, identify what's not working |
| **Plan**    | Often trivial — the fix is obvious from the deviation     | Substantive — multiple valid approaches, human weighs in          |
| **Execute** | Mechanical, batchable, low-risk                           | Creative, iterative, requires judgment                            |

Some skills span multiple phases (the redesign skills analyze, propose, and implement in one pass). Others are phase-specific and compose together — `plan-browser-tests` produces a plan that `add-browser-test` executes against, one item at a time.

## Mapping skills to the grid

|                 | Analyze                                                 | Plan                                                           | Execute                                                                                                                |
| --------------- | ------------------------------------------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Convergence** | design-audit, audit-component-size, audit-browser-tests | plan-vulnerability-remediation, plan-code-scanning-remediation | design-fix, fix-browser-test, fix-bug-bash-item, remediate-vulnerability, remediate-code-scanning, decompose-component, build-feature, advance-epic |
| **Divergence**  | explore-directions, design-crit, extract-design-system  | plan-browser-tests, plan-bug-bash, create-charter, plan-epic   | plan-feature, redesign-component, redesign-screen, add-browser-test                                                    |

## Types

| Workflow                                                                                                                   | Reference                                                                                                                                                           |
| -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Invoked to get something done. Have steps, produce artifacts or code changes, and operate within the mode/phase framework. | Encode knowledge — principles, patterns, conventions, or domain expertise. Inform how work is done across modes and phases rather than driving a specific workflow. |
| Examples: `plan-browser-tests`, `remediate-vulnerability`, `prepare-pr`                                                    | Examples: `react-*` principles, `color-expert`, `emil-design-eng`                                                                                                   |
