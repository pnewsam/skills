# Security Analysis Metrics

## Contents

- Finding metrics
- Control metrics
- Measurement rules

## Finding metrics

- open findings by verified reachability and severity
- finding age and accepted-risk review age
- unresolved findings merged into protected branches
- remediation rate and mean or median time to remediate
- reopened findings and recurring rules or vulnerable patterns
- findings already covered by active work
- stale or false-positive rate by source

Prioritize verified exposure and impact over raw alert counts.

## Control metrics

- privileged routes with explicit authorization enforcement and negative tests
- sensitive flows with boundary validation and safe error handling
- secrets or sensitive-data sinks without approved controls
- critical controls with automated regression evidence
- dependencies, actions, or base images outside supported ranges
- accepted risks without an owner or current review date
- critical security events without audit or diagnostic evidence

Absence of a test does not prove absence of a control. Inspect implementation
and runtime enforcement before classifying a gap.

## Measurement rules

Record:

- baseline and authoritative evidence source
- observation window and environment
- exclusions and unavailable evidence
- reachability, exposure, and confidence
- target condition and guardrails
- resolution evidence such as a negative test, scanner recheck, dependency
  graph, or focused review

Do not combine unrelated metrics into a security score. Report the dimensions
and uncertainty separately.
