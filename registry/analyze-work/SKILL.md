---
name: analyze-work
description: Investigate a proposed change or audit, establish evidence and uncertainty, and identify a bounded outcome. Use for quality, security, design-system, test-coverage, or maintenance analysis. Read-only by default; includes diagnosis of concrete failures; use shape-initiative for open product direction.
---

# Analyze work

Apply `work-conventions`. Establish what is happening, why it matters, and what evidence would change the next decision. A broad audit may identify several candidates; do not turn them into multiple implementation commitments.

## Scope and evidence

Resolve the requested question and inspect existing findings, records, relevant code, configuration, history, and available runtime or external evidence. Separate observations, hypotheses, and unknowns. Use existing checks or disposable experiments when necessary; do not edit project files or install analyzers for an analysis-only request. Save findings only when requested or already within an authorized work-record update.

Choose a focused procedure only when it adds value:

- A concrete error, flaky test, hang, or regression: reproduce and localize with focused experiments; a diagnosis-only request does not authorize repair.
- New assets, privileges, sensitive flows, or trust boundaries: inspect assets, trust boundaries, abuse paths, controls, and residual uncertainty as needed; do not impose a separate threat-model document.
- Quality hotspots: `references/quality.md`.
- Dependency or code-scanning findings: `references/security.md`.
- Design-system convergence: `references/design-system.md`.
- Browser coverage or flakiness: `references/browser-coverage.md`.

These are conditional resources, not a checklist to run on every task. Reference definitions and citations need current applicability checked before relying on them.

## Interpretation

Collect evidence that can affect scope or priority. For measurements, record baseline, method, window, exclusions, and confidence. Prefer relative trends and corroborating signals over universal thresholds. Do not infer a defect from churn, complexity, or a scanner label alone. Trace reachability or reproduce behavior when needed.

Rank only credible candidates, describing affected scope, expected benefit, invariants, possible false positives, and a proportionate proof method. If the question cannot be resolved, name the missing evidence and a useful next experiment.

## Result

Return the supported conclusion, evidence and uncertainty, and the smallest useful next action. For one chosen outcome, continue to `plan-work` when planning or implementation is already requested; otherwise return the analysis. For several dependent outcomes, `plan-epic` can organize the initiative if requested. Do not manufacture an epic for a small change.
