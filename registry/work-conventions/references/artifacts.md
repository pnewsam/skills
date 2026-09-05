# Durable work artifacts

## Choose the record

Use the agreed existing issue or document as the authoritative record. Do not mirror a live tracker into a competing local status ledger. Link supporting detail from the primary record. A feature describes product scope and may require several independently reviewable work units; it is not automatically one PR.

For a new local record, use these defaults unless the project has a convention:

| Artifact | Default | Owns |
| --- | --- | --- |
| Initiative / epic | `docs/epics/<id>-<slug>.md` | Overall outcome, unit index, dependency conditions, decisions, integration |
| Work unit | `docs/work/<id>-<slug>.md` | One reviewable outcome, acceptance, approach, candidate and proof |
| Existing feature plan | Its current `docs/features/` path | Keep as the unit record if bounded; otherwise link its work units |
| Supporting evidence | A project-appropriate report or artifact linked from its record | Large logs, measurements, diagrams, or captures that would obscure the brief |

Use the next available ID under the project's convention, checking existing and reserved records first. For concurrent creation, let the coordinator allocate IDs or use collision-resistant IDs rather than racing on the next integer. Preserve IDs through title changes. Link each child to its parent and each parent to its children. Do not create a charter, extra feature layer, or report directory solely to satisfy this map.

## Scale the document

A tiny uninterrupted change can use task context. Persist a record before dispatch, handoff, or interruption could lose intent. A coordinated unit needs enough context for a fresh worker to act without the original conversation.

The core is identity, problem/rationale, outcome and non-goals, required acceptance, planned verification, requested endpoint, and current progress/next action. Add ownership for coordinated work. Include approach, dependencies, invariants, optional improvements, source observations, dates, rollout, and recovery when they affect decisions. Omit empty sections; use the work and epic templates as readable defaults, not forms with compulsory placeholders.

## Keep state trustworthy

Record status as of an observed candidate and update time. Assignment/activity (ready, active, blocked, handed off) is separate from delivery evidence (implemented, validated, reviewed, published, merged, deployed). A unit is complete only when its requested endpoint and required proof hold. The epic is complete only when overall acceptance and integration hold too.

Separate planned checks from actual results. Each result names the criterion, method, candidate/environment, result, and material limitation. Keep decision rationale and source links when scope changes. Keep the top-level owner, dependency, branch/candidate, and next-action summary current. Move superseded values into an explicitly historical section rather than leaving contradictory current-looking fields beside newer evidence. Correct a stale summary with a dated observation; do not erase valid historical evidence or silently reopen completed work. The coordinator owns the epic index; workers update their own unit records or return evidence for that owner to record.
