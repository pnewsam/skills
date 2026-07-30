# Security Feature Execution

## Contents

- Common safeguards
- Dependency remediation
- Code-scanning remediation
- Control hardening
- Resolution evidence

## Common safeguards

- Keep one verified finding group or control objective to one feature and
  focused commit series.
- Preserve stable advisory, alert, rule, or control IDs in the plan and
  evidence.
- Recheck current state and existing branches or pull requests before changing
  code or dependencies.
- Prefer the smallest fix that removes or contains the verified risk.
- Keep secrets, private registry details, raw scanner logs, and sensitive data
  out of code, plans, commits, and responses.
- Add positive and negative tests when a security control changes.

## Dependency remediation

- Confirm the resolved dependency path, affected version, fixed range, and
  manifest or lockfile before updating.
- Respect the repository's package manager and lockfile policy.
- Avoid broad lockfile churn and unrelated direct, transitive, ecosystem, or
  major-version upgrades.
- Include required compatibility migrations only when the plan scopes them.
- Verify the resolved graph, targeted tests, build or type checks, and the
  existing audit or advisory command when available.

If the supported fix requires a risky major migration, stop and update the
feature plan rather than hiding the migration inside remediation.

## Code-scanning remediation

- Read the full function, handler, workflow, and relevant source-to-sink or
  control path around the flagged location.
- Use rule documentation and current code to distinguish a real path from
  stale or false evidence.
- Fix the vulnerable boundary rather than only changing the flagged line.
- Use an approved suppression only when evidence proves the path is safe and
  the repository has an accepted suppression convention.
- Run targeted tests and the configured scanner when possible; state when
  closure requires a remote CI rerun after publication.

## Control hardening

- Place authorization, validation, or integrity enforcement at the trusted
  service or data boundary, not only in a client.
- Preserve safe defaults and least privilege.
- Define denial, failure, retry, and recovery behavior.
- Add negative verification for unauthorized actors, malicious or malformed
  input, replay, cross-tenant access, or other relevant abuse cases.
- Avoid combining unrelated hardening opportunities with the planned control.

## Resolution evidence

Use the evidence named in the plan, such as:

- dependency graph resolves outside the vulnerable range
- advisory or scanner no longer reports the verified path
- negative test proves unsafe behavior is rejected
- positive regression test proves intended behavior remains
- permissions or configuration are demonstrably narrower
- focused review proves a disputed finding is unreachable or safely controlled

Do not claim remote alert closure before the remote system has rerun.
