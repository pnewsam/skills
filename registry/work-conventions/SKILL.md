---
name: work-conventions
description: Shared contract for PR-sized work records, scope, evidence freshness, continuation, and delivery boundaries. Read when applying the work operations or coordinating an initiative; no actions of its own.
---

# Work conventions

One work unit is one independently reviewable outcome, normally one PR. It may span several commits and sessions. An epic coordinates multiple units. A task checkbox is not a delivery boundary.

## One record, proportionate to the work

Use the existing issue, feature plan, or other agreed record as the source of intent. Do not create a parallel plan merely to fit a skill. For a small uninterrupted task, concise task context is enough; persist a record before coordination, interruption, or handoff would lose intent. Read `references/artifacts.md` when creating or coordinating durable records; it defines default locations, identity, ownership, and planned versus observed evidence. Use `references/work-record.md` when a new record helps. Existing `docs/features/` records remain valid; `docs/work/` is a default for new records, not a migration requirement.

Record outcome and non-goals, observable acceptance, necessary context and dependencies, progress and evidence, requested delivery boundary, blockers and next action. Omit empty fields. Link large evidence rather than copying logs. Git and external systems remain authoritative for their actual state; record what was observed and when.

## Scope and continuation

The agent owns the user's task. Analyze, plan, execute, validate, review, and deliver are independently callable capabilities, not mandatory phases, separate approvals, or reasons to end a turn. Use the smallest useful set, and continue across them when the request already authorizes the next action. A diagnosis-only or planning-only request stops at that result. Runbooks are directly callable. Required package resources travel with the installed skill; optional skill recommendations apply only when available. Otherwise perform the ordinary capability directly or report the specific missing facility without inventing a delegate.

Carry the user's authorized scope and requested endpoint through handoffs. Implementing normally permits related file changes and necessary verification; it does not by itself request a commit, push, PR, merge, tracker update, posted review, or deployment. An explicit end-to-end request can authorize several of these together. Do not ask again for an already authorized action. Ask only about a consequential ambiguity or a required decision that cannot be resolved from evidence.

Preserve unrelated work. Isolate related changes or use a separate checkout when needed; an unrelated dirty file is not by itself a blocker. Do not stage, discard, publish, or rewrite someone else's work. Discovery of new scope returns a proposed change to the record; it does not silently enlarge the assignment.

## Evidence and completion

Identify the candidate: base/head commits plus relevant staged, unstaged, and intended untracked changes, or an equivalent artifact/version identity. Evidence records the scope, method, result, and relevant environment or limitations. Reuse it while the candidate and relevant assumptions remain unchanged. Refresh the integration base before design or publication work when a remote base is available; identify divergence and incorporate relevant intervening decisions rather than assuming the checkout is current. A source, configuration, dependency, base, runtime, or requirement change invalidates affected evidence; rerun only what that change can invalidate unless a required boundary demands more.

Distinguish implemented, validated, reviewed, published, merged, and deployed. A checked task or green test does not establish all of them. A skipped or unavailable required check remains unverified. Model review is judgment, not proof; a metric is a signal, not automatically a defect.

Review-and-fix requests move between review and execution, with validation after repairs. Seek fresh assessment of the resulting candidate, preserve dissent, and stop at the requested quality boundary. Avoid nit-driven churn. If repeated rounds produce no progress or reveal a material scope decision, report the remaining blocker rather than looping indefinitely.

For external mutations, resolve the target, perform the authorized action, then read back the result. After an ambiguous response, inspect actual state before retrying. A permission rejection is not a reason to switch access paths.
