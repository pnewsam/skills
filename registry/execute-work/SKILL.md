---
name: execute-work
description: Implement one agreed work outcome, including necessary tests and documentation, or perform one bounded step when requested. Also fixes in-scope review findings. Accepts issues, feature plans, or clear requests; verifies changes and preserves unrelated work. Commits and publication follow the requested delivery boundary.
---

# Execute work

Apply `work-conventions`. Complete the agreed work unit by default, not just its first checkbox. Honor an explicit one-step request. A fix request with clear acceptance needs no separate planning ceremony; use `plan-work` only to resolve missing scope.

## Establish the candidate

Read the selected record, repository instructions, branch, status, staged and unstaged diff, and relevant implementation. Include intended untracked files in the candidate. Preserve unrelated changes; isolate them rather than stopping just because they exist. Follow user/repository branch conventions and create an isolated branch or checkout when needed for safe work.

Verify that the work is not already implemented. If it is, establish the required evidence and update progress without inventing edits or duplicate commits. When resuming, compare recorded evidence with current state rather than trusting checkboxes alone.

## Implement and verify

Make the smallest coherent change that satisfies all required acceptance. Add or update necessary tests and documentation in the same unit. Include configuration, dependency, build, migration, and test changes when they are the outcome; do not limit implementation to application source.

Use repository conventions and applicable constraints from the record. Read `references/security.md` for vulnerability or sensitive-boundary changes, `references/browser-tests.md` for browser-test implementation or repair, and `references/architecture-document.md` when architecture documentation is the requested artifact. Do not load these for unrelated work.

When the work record names an analyzer or measurement method, rerun that method after the change and record comparable before/after evidence with the target and any exclusions. A code test alone does not establish a measured improvement.

Run immediate, relevant checks while implementing. Use `validate-work` for the complete acceptance assessment and reuse valid intermediate results. Never weaken required checks or mark required acceptance complete to bypass a failure. Separate confirmed pre-existing failures from introduced regressions and record their effect on confidence.

For review feedback, verify each claim against the current candidate and intended scope. Fix supported in-scope defects; explain duplicate, outdated, unsubstantiated, or out-of-scope findings. Do not broaden the feature to satisfy a reviewer's preferences. Return the changed candidate to `review-work` when the request calls for a review-and-fix loop.

## Record and return control

Record implemented acceptance, relevant evidence, candidate identity, and remaining work. An explicit one-step request ends after that bounded step and verification. Otherwise complete the unit and continue to any already requested review or delivery.

Do not auto-commit once per task. Use `publish-pr` when the user requests local commits or PR preparation; use `deliver-work` for the requested delivery boundary. Failed required verification blocks a completion claim and ordinary delivery; preserving a known failing state requires a specific preservation request.
