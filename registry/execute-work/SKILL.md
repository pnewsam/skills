---
name: execute-work
description: Implement one agreed work outcome, including necessary tests and documentation, or perform one bounded step when requested. Also fixes in-scope review findings. Accepts issues, feature plans, or clear requests; verifies changes and preserves unrelated work. Commits and publication follow the requested delivery boundary.
---

# Execute work

Apply `work-conventions`. Complete the agreed unit, not just its first checkbox, unless one step was requested. A fix with clear acceptance needs no planning ceremony; use `plan-work` only to resolve missing scope.

Follow user and repository branch conventions, and create an isolated branch or checkout when safe work needs one. Check whether the work is already implemented. When resuming, compare recorded evidence with current state rather than trusting checkboxes.

Read `references/security.md` for vulnerability or sensitive-boundary changes, `references/browser-tests.md` for browser-test implementation or repair, and `references/architecture-document.md` when architecture documentation is the requested artifact.

When the work record names an analyzer or measurement method, rerun it after the change and record comparable before/after evidence with the target and any exclusions. A code test alone does not establish a measured improvement.

Never weaken a required check or mark acceptance complete to get past a failure. Separate confirmed pre-existing failures from introduced regressions. Use `validate-work` for the complete acceptance assessment.

For review feedback, verify each claim against the current candidate. Fix supported in-scope defects and explain the rest, without broadening the feature to satisfy a preference. Feedback on an open PR belongs to `reconcile-work`, which calls this operation for the fixes.

Record implemented acceptance, evidence, candidate identity, and remaining work. Do not auto-commit per task; use `publish-work` when the user requests commits, a push, or a PR.
