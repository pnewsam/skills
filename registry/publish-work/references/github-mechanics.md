# GitHub interaction mechanics

Use an available authenticated connector or authenticated gh CLI. Do not require both. Resolve the repository from the request and configured remotes. If access is unavailable, prepare what can be prepared locally and report the missing access at the affected boundary.

## Resolve the action's target

For an existing PR action, resolve its number/URL, state, title/body, base/head branches, and current head SHA. Prefer the explicit target, otherwise the matching current branch. Ask only if several plausible targets remain. A closed or merged PR is valid for read-only retrospective analysis; edits require an explicit retrospective request.

For branch publication, the target is the verified remote and branch; no PR number is required. For new PR creation, resolve repository, head, and intended base, then search for an existing matching PR. Absence is the expected condition for creation: continue without asking the user to choose an unrelated PR. Reuse a matching PR; resolve a material base mismatch before writing.

## Write and verify

Carry the user's authorized action through the runbook. Immediately before writing, refresh relevant state: branch/head for publication, existing PR identity/head and editable fields for an update, or the absence of a matching object for creation. Use expected-head or equivalent concurrency guards when the API supports them.

Perform the intended mutation through the selected path, then read back the result: remote head for push; number/URL, title/body, base/head, and draft state for creation; changed fields for metadata; review identity for a posted review; merged state and merge identity for merge.

After an ambiguous response, inspect actual state before retrying so a successful write is not duplicated. If another author changed the candidate, refresh affected evidence and reconcile before writing. If authorization is rejected, preserve the payload and report the rejection; never change access paths to bypass it. Prefer structured text arguments or CLI body files for multiline content.
