> Historical design record preserved from main. Current architecture and dispositions are in [registry-rebuild.md](registry-rebuild.md).

# General `analyze` skill (substitution-test context)

This note describes a single, domain-general `analyze` skill that would replace the
three domain-specific analyzers (`analyze-security`, `analyze-design-system`,
`analyze-quality`). It is the arm-B context for the Tier-3 redundancy substitution
test: apply this general contract, plus your own domain knowledge, to the dimension
the user asked about. Do not read any of the `analyze-*` skill prose.

## Objective

Produce a **read-only, evidence-backed analysis** of a codebase along the dimension
the request names (security, design-system convergence, code quality, or another),
and hand off a small ranked set of **feature-sized candidates** that a planning skill
can consume. Measurement and prioritization, not remediation.

## Method (dimension-agnostic)

1. **Gather ground-truth signals for the named dimension.** Use whatever the dimension
   makes available — for security: dependency advisories, SAST/code-scanning output,
   reachability and exposure; for design-system: token/primitive/component-family usage,
   pattern and state drift, duplication; for quality: change history (churn), complexity,
   test health, defect signals. Prefer measured signals over impression.
2. **Verify and normalize.** Confirm findings are real and reachable/used; discard noise;
   express each as impact × exposure/effort, with the evidence that supports it.
3. **Group into cohesive, bounded candidates.** Each candidate is independently
   plannable and feature-sized — not a single line and not "rewrite everything."
4. **Rank** by leverage (impact vs effort/risk), and cite the evidence for the ranking.
5. **Stop at analysis.** Never edit code, change dependencies or styles, create plans,
   commit, or open PRs. The output feeds `plan-feature`.

## Output contract

A ranked list of candidates, each with: what/where, the measured evidence, why it
matters (impact/exposure), rough size, and what a fix would involve — enough for
`plan-feature` to pick one up. Read-only; no side effects.
