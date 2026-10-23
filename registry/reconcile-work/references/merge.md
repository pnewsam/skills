# Merge

Merge only when requested. Refresh the current PR head, required CI/checks and review state, conflict/mergeability status, and repository merge policy. Require the merge operation to target the verified head when the API/CLI supports an expected-head guard. If it changed, refresh evidence before retrying. Pending or unavailable required conditions prevent a successful-readiness claim. Never use administrative bypass or change protections to make a merge succeed.

Use the repository's permitted merge method; resolve a consequential ambiguity before writing. After an ambiguous merge response, read PR state and merge identity before retrying. Verify merged state and the merge commit/result. Branch deletion, release, deployment, and tracker transitions are separate effects, not automatic follow-ons.
