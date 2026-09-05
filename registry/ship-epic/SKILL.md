---
name: ship-epic
description: Coordinate delivery of an initiative across PR-sized work records. Advances one ready unit or continues through the requested scope, respecting dependencies, per-unit delivery boundaries, recovery, and integration proof. Absorbs one-step epic advancement; does not infer permission to merge or deploy.
---

# Ship epic

Apply `work-conventions`. Own coordination across work records. Use the six operations for each unit; do not collapse an epic into one PR or reimplement the operations here.

## Establish the run

Read the initiative record and linked work records, current Git/PR state, dependencies, and integration acceptance. Reconcile recorded progress with evidence; a checked box alone is not completion. Use `plan-epic` when decomposition is missing and planning is authorized.

Resolve run scope: one ready unit, selected units, or the full initiative. Resolve delivery endpoints from the request and existing record. An unqualified request to ship an epic prepares independently reviewable PR candidates locally; it does not authorize external publication, merge, deployment, or tracker writes. Carry explicit broader authorization through all child operations.

## Coordinate ready work

Select a unit whose prerequisite conditions actually hold. Detail its plan with `plan-work` when needed, then use `execute-work`, `validate-work`, `review-work`, and `deliver-work` as required by its acceptance and endpoint. Reuse valid work and evidence; skip operations whose result is already established.

A request for one ready unit ends after that unit reaches its requested boundary and the initiative record is updated. An explicit one-step request performs only that bounded step and records what remains. A full run continues through ready units without asking the user to name the next obvious skill.

Keep separate branches or checkouts and PRs for independent units. Parallelize only when authorized and when shared files, environments, and dependencies permit safe isolation. If one unit is blocked, continue independent authorized units; report the blocked edge. If none are ready, surface the prerequisite or cycle rather than silently combining units or bypassing the condition.

After each unit, record candidate identity, proof, endpoint reached, blockers, and next action. Do not add bookkeeping commits unless committing records is in the requested scope. If a prerequisite changes, reassess dependent scope and invalidate affected evidence.

## Integration and resume

At declared checkpoints, verify the combined outcome against the initiative's acceptance. Individual green PRs do not prove integration. Record the exact combined candidate/environment; do not rerun expensive aggregate checks without an invalidating change or a required delivery checkpoint.

After interruption, refresh external state, compare candidates and evidence, and continue the first ready incomplete unit. Do not duplicate PRs, implementation, or records. Completed historical units remain intact unless evidence shows a discrepancy; record the discrepancy explicitly.

Report units and endpoints achieved, integration evidence, and remaining conditions. The initiative is complete only at the requested endpoint with required overall acceptance established. Pending merges or deployment may remain separate requested work; never describe them as done because implementation finished.
