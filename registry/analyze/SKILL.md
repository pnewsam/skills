---
name: analyze
description: Produce a read-only, evidence-backed analysis of a codebase along a requested dimension — security posture and dependency/scanning findings, design-system convergence and UI drift, code quality and maintainability hotspots, test health, or another named dimension — and hand off a small ranked set of feature-sized candidates. Use when asked to analyze, assess, audit, measure, or triage a codebase for what is worth fixing, or to turn scanner/advisory output into prioritized candidates, before any planning. Read-only: never edits code, dependencies, styles, plans, Git state, or external systems.
---

# Analyze

## Use When

Use to measure and prioritize, along whichever dimension the request names, before
work is planned:

- **Security** — application-security posture, dependency advisories (Dependabot/CVE/GHSA),
  SAST/code-scanning (CodeQL/semgrep) findings, control gaps, reachability and exposure.
- **Design system** — token/primitive/component-family usage, pattern and state drift,
  duplication, legacy-component inventory, migration debt.
- **Quality** — maintainability and correctness hotspots from change history (churn),
  complexity, test health, and defect-prone areas; refactoring leverage.
- **Any other dimension** the request names (performance, dependency freshness, etc.).

This is the single analysis operation; the dimension is a parameter, not a separate
skill. What good looks like for a given dimension is base-model capability — this skill
supplies the read-only measurement discipline and the output contract, not domain prose.

## Objective

A read-only, evidence-backed analysis that hands a planning step a small ranked set of
**feature-sized candidates**. Measurement and prioritization, never remediation.

## Method (dimension-agnostic)

1. **Gather ground-truth signals for the named dimension.** Prefer measured signals over
   impression — run the scanners, greps, and metrics the dimension makes available
   (advisories and SAST for security; token/component scans for design-system; churn ×
   complexity, coverage, and defect history for quality). Cite the command or source for
   each number.
2. **Verify and normalize.** Confirm findings are real and reachable/used; discard noise;
   express each as impact × exposure (or effort), with its supporting evidence.
3. **Group into cohesive, bounded candidates** — each independently plannable and
   feature-sized, not a single line and not "rewrite everything."
4. **Rank** by leverage (impact vs effort/risk) and cite the evidence behind the ranking.
5. **Stop at analysis.** The output feeds `plan-feature`.

## Output contract

A ranked list of candidates, each with: what/where, the measured evidence, why it matters
(impact/exposure), rough size, and what a fix would involve — enough for `plan-feature` to
pick one up. Record a reproducible baseline where the dimension supports one (counts,
scanner summary) so a later run can measure movement.

## Boundaries

- Read-only. Never edit code, dependencies, styles, or configuration; never create plans,
  commit, push, or change external systems.
- Do not invent findings; every candidate carries verifiable evidence.
- Escalate legal/regulatory interpretation (e.g. GDPR/HIPAA applicability) to a
  privacy/legal owner; this skill assesses engineering exposure, not legal obligation.

## Handoffs

- Use `plan-feature` (Convergence mode) to turn one ranked candidate into a plan.
- Use `execute-feature` to implement and verify a planned candidate; it can re-run this
  analysis as the before/after verification method when a plan names the dimension.
- A different output framing — a formal asset/actor/trust-boundary/abuse-case threat model, or
  a current-state architecture document — is base-model capability; produce it directly rather
  than routing to a dedicated skill.
