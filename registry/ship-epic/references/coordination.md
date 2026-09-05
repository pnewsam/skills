# Coordinating several work units

Contents: ownership; dispatch and handoff; checkpoints and replanning; integration; recovery and completion.

Use this protocol for work spanning workers, branches, sessions, or integration checkpoints. A short sequential epic can keep the same information in a compact index; no separate scheduler, heartbeat, or tracking system is required.

## Ownership and readiness

One coordinator owns the epic index and integration decisions. Each active unit has one current assignment: worker/session, checkout/branch, input candidate or prerequisite version, intended output, and last meaningful checkpoint. Recheck current assignments before dispatch; do not issue the same unit to two workers because a reply is slow. When multiple coordinators are possible, use the system's atomic claim facility or serialize dispatch through one owner. A Markdown row alone is not a concurrent lock.

A ready unit has a bounded outcome and acceptance, the required prerequisite state/version, a usable record, an available execution location, and an authorized endpoint. Absence of implementation detail for distant future units is not a blocker to ready work. Prefer ready work by value and dependency impact, accounting for shared files, scarce environments, and user priorities. Parallel work requires authorization and isolated execution; cap it to available capacity.

## Dispatch and handoff

Give a worker the unit/parent record, relevant decisions and repository guidance, exact starting candidate and prerequisite contracts, editable scope, required proof, requested endpoint, and return location. State any coordination constraint such as a shared-file owner or reserved integration environment. Do not copy the entire initiative's history into every assignment.

Require the return to identify its assignment and actual branch/checkout, base/head and relevant uncommitted changes, acceptance and checks with results, remaining findings/blockers, external actions actually taken, and the next safe action. Preserve local work before abandoning its execution environment. The coordinator verifies the result, reconciles current-looking metadata in the child record, and updates the index; a worker's "done" message does not prove merge, integration, or deployment.

## Checkpoints and replanning

Checkpoint after a unit return, prerequisite/contract change, integration result, or interruption. Refresh actual state, reconcile the index, then dispatch the next ready work. A late return from a superseded assignment is evidence to inspect, not permission to overwrite the current candidate or mark the unit complete.

When a dependency or shared contract changes, identify affected descendants and active workers. Pause or redirect only affected work; independent units may continue. Record the decision, revised dependency version/acceptance, and which earlier evidence is invalidated. Preserve historical results as results for their original candidates. If a unit splits or is superseded, retain its identity with links to successors and preserve observation coverage. Seek a user decision when revised scope changes the agreed outcome or consequences; do not hide it as routine replanning.

## Integration

Name the integration owner, candidate location, included unit revisions, prerequisite state, required combined checks, and rollout boundary before combining work. Local combination does not authorize merging hosted PRs or deploying. Serialize integration into a shared branch/environment. Resolve overlapping edits by behavior and intent, not by last writer; validate their combined effect even if Git reports no textual conflict.

A failure of combined behavior blocks epic completion even when every unit passed alone. Trace it to the affected contracts/units and create or update bounded repair work within authorized scope. Keep unrelated ready work moving when safe. Recheck the repaired combined candidate and affected descendants; earlier isolated green checks do not certify it.

## Recovery and completion

At resume, read the durable epic and child records, then inspect actual branches, worktrees, PRs, and worker state before dispatch. Elapsed time or missing messages alone do not establish abandonment. Confirm the old worker has stopped or is no longer assigned before reassigning; if its state is unknowable, isolate recovery and do not race writes to its checkout. Record reassignment and reject stale completion messages from the prior assignment.

Distinguish a blocked prerequisite (wait or independent work), a failed attempt (retain evidence and diagnose), a stale record (reconcile), and an abandoned assignment (preserve recoverable output before reassignment). After ambiguous external writes inspect actual state before retrying. Reuse completed work; do not recreate a PR or repeat a successful action from an outdated record.

Honor user limits on scope, time, budget, or concurrency. Without explicit limits, proceed through authorized ready work, checkpoint before losing context, and stop when no safe progress remains or a material decision is needed. Do not create scheduled follow-ups without a request. Report the next responsible action rather than repeatedly retrying an unchanged blocker.

Declare completion only when each required unit reached its requested endpoint and the identified combined candidate meets overall acceptance. Record deferred scope explicitly. A publish-only or local-only endpoint can be complete at that boundary; never label it merged or deployed. Return a concise unit summary, integration proof, remaining conditions, and durable resume location.
