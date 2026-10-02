# Code-review finding model

How to evaluate and classify a review finding. Apply this wherever a review produces findings, whether a single read-only pass or a hardening loop. Use it consistently for initial assessment and subsequent review of a changed candidate.

## Contents

- Verify before reporting
- Severity
- Confidence
- One finding per root cause

## Verify before reporting

Treat every candidate finding as a hypothesis. Keep it only if you can name the concrete input, state, or execution path that triggers it and no other mechanism already prevents it. Read the smallest additional context that settles the question. Check whether the issue is pre-existing or intentional; use `git blame` when intent is genuinely ambiguous.

Classify the candidate:

- **Confirmed** — a concrete failure mode supported by the evidence. Only Confirmed candidates are defect findings.
- **Uncertain** — a material concern remains, but the available evidence cannot establish a defect. Report it as a precise question or an evidence limitation. It never drives a change request on its own.
- **Rejected** — contradicted, speculative, pre-existing, intentional, or non-actionable. Drop it.

A missing signal is uncertainty, not evidence that a defect exists.

## Severity

Rate a Confirmed finding by its impact if it occurs, independent of how likely it is.

| Severity | Meaning |
| --- | --- |
| Blocking | Unsafe to merge. Credible security-boundary violation, destructive data behavior, systemic failure, or a correctness failure on an essential path. |
| Major | Material regression or incorrect behavior on a realistic execution path. Should ordinarily be fixed before merge. |
| Minor | Real, bounded defect with a concrete failure mode and limited impact. Does not by itself make the PR unsafe to merge. |
| Nit | Style or preference with no failure mode. Never drives a change request; may be omitted entirely. |

A maintainability concern qualifies as Minor or higher only when it carries a concrete future failure mode. Otherwise it is a Nit.

## Confidence

Confidence is independent of severity.

- **Severity** = impact if the issue is real.
- **Confidence** = certainty that the issue is real.

State confidence when it is not high, and name the evidence that would change it. A high-severity, low-confidence item is a precise question, not a blocking verdict.

## One finding per root cause

Deduplicate by root cause before presenting or posting. When one defect surfaces in several places, report it once at the best causal line and name the important secondary locations within that finding. Never emit multiple findings for the same underlying defect.
