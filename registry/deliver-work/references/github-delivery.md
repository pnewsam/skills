# GitHub delivery actions

Use `publish-pr/references/github-mechanics.md` to resolve one authenticated access path and the exact repository, PR, base/head, and current state. Obtain thread-aware data before replying to or resolving review threads.

## Review and feedback

Post only the review, comment, reply, or resolutions explicitly requested. Use `pr-conventions/references/finding-model.md` for findings. Confirm that the evidence still applies to the current head. Reply with the verified disposition; resolve only the selected threads whose resolution is supported. Local fixes do not establish that the remote head contains them. Do not post internal review rounds automatically.

## Merge

Merge only when requested. Refresh the current PR head, required CI/checks and review state, conflict/mergeability status, and repository merge policy. Require the merge operation to target the verified head when the API/CLI supports an expected-head guard. If it changed, refresh evidence before retrying. Pending or unavailable required conditions prevent a successful-readiness claim. Never use administrative bypass or change protections to make a merge succeed.

Use the repository's permitted merge method; resolve a consequential ambiguity before writing. After an ambiguous merge response, read PR state and merge identity before retrying. Verify merged state and the merge commit/result. Branch deletion, release, deployment, and tracker transitions are separate effects, not automatic follow-ons.

## Thread and approval discipline

Fetch all relevant review threads and nested comments, following pagination rather than assuming the first page is complete. Give every actionable thread a disposition: fixed, rationale, deferred, duplicate, outdated, or superseded. Link verified work where useful; create follow-up issues only when requested. Do not resolve a disputed or deferred thread merely because a disposition was recorded. A request to dismiss a comment is not permission to dismiss the reviewer's entire review.

Before an authorized push, inspect approval state and relevant stale-approval policy. Explain a material approval-dismissal effect that has not already been accepted; honor explicit ask-before-push instructions. Batch related accepted repairs where practical. Do not require redundant confirmation for a previously authorized effect.

Before posting a review, refresh the head and diff, confirm the verdict and each inline position, and submit one review. Put line-anchored findings inline on valid changed lines; use the body only for findings that do not map to a line or whose valid position cannot be established. Verify the posted review and any selected resolutions. If a summary comment is explicitly requested, derive it from the round ledger and verified remote head; do not attest to local-only fixes.
