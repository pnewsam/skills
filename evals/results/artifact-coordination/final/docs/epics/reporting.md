# EP-1: Consistent money reports

Outcome: a caller can normalize an amount once and produce a human receipt and a machine-readable export without inconsistent money values. Local delivery only; no remote exists.

## Current handoff — observed 2026-09-05
Status: complete at the verified local integration endpoint; U1–U5 acceptance and combined proof hold. No active unit assignment or remaining blocker is recorded. Handoff custodian: coordinator; the receiving coordinator owns any later reconciliation.
Checkout: `/private/tmp/epic-coordination-trial`, branch `main`. Observed clean head: `55f1da716eafaf5bdd016b64766ec57b9b2241e0`, based on validated combined candidate `2b1d41eebba335fab111eb09953763071e3effc9` (tree `143463a86bf44a40fc45a56516f5a1730b29ddda`). Git confirms only records changed between those commits; source, tests and README evidence below remains applicable. This handoff correction also changes only records; its final head is the commit containing this section, recoverable from `git log` on main.
Dependencies: U1 named record contract and U2/U3 consumers are integrated; U4 combined proof and U5 executable examples are complete. Git shows one checkout and no remote. Worker snapshot is historical; no new worker liveness claim is made.
Next action: no EP-1 implementation remains. A fresh coordinator should confirm main and any later differences before reusing evidence; external delivery requires new scope. All earlier assignments and next actions below are historical and superseded by this summary.

## Units
| ID | Outcome | Dependencies | Record | Last recorded state |
| --- | --- | --- | --- | --- |
| U1 | Named money fields and decimal rounding | none | ../work/u1-money.md | complete: integrated locally at 877b905 |
| U2 | Human receipt | U1 contract | ../work/u2-receipt.md | complete: integrated locally at c5ff759 |
| U3 | JSON export of money record | U1 contract | ../work/u3-export.md | complete: integrated locally at 334c67c |
| U4 | Combined behavior proof and integration | U1, U2, U3 | ../work/u4-integration.md | complete: integrated proof at 3d0f5e8; final checks at 2b1d41e |
| U5 | Document public examples | U1 contract | ../work/u5-docs.md | complete: integrated locally at 2b1d41e |

## Decisions
- The original tuple contract was superseded by U1 after receipt work had started. The authoritative contract is now `{"minor": int, "currency": str}`; use decimal half-up rounding. Do not revert this to accommodate a consumer.
- Receipt is `Receipt: 12.34 USD`; JSON export contains exactly the named money fields. The generic heading helper has no separate compatibility requirement.
- Integration owner is the coordinator. Keep completed unit commits as separate history; locally merge/rebase or make adaptation commits as appropriate.
- Unit completion requires current relevant evidence. Final initiative completion requires combined behavior on one identified integrated tree and documentation examples verified against it.

## Historical checkpoint before this resume
Worker-receipt was interrupted before the contract change was reconciled. The owner field has not yet been cleared. Export was built separately. U4 has never run against their combination. U5 can proceed independently of the stopped worker. See runtime snapshot for observed worker state.

## Historical resume decision — 2026-09-05
Coordinator owns the index and serialized local integration in `/private/tmp/epic-coordination-trial`. Selected U2: the supplied runtime snapshot confirms the prior worker stopped, the implementation is preserved, and adapting this outdated consumer removes a prerequisite of U4. U1 remains integrated and unchanged. U3 is implemented on its preserved branch but has no combined review. U5 can draft independently, but its completion proof needs the integrated consumer tree. No unit is concurrently dispatched.
Integration target for this run: main plus U2 only, via `codex/u2-receipt-recovery`, starting at `aac42f1869d6f6045e8726a6a8ad57c8de1dec02`. Required proof is current U1/receipt regression testing; U4 aggregate acceptance stays pending. One-unit scope ends after the U2 endpoint and this checkpoint.

## Historical durable checkpoint — 2026-09-05
One-unit run finished: U2 reached validated, self-reviewed, committed and locally integrated status at `c5ff759e6e49fcd13cf4cb5e5b527db49008f6a5` (tree `4d3ea060131ca2e1fb9765c12b5de5141310398e`). Main includes U1 and U2. Six current tests passed under Python 3.10.6; detailed proof and the historical failure are in [U2](../work/u2-receipt.md). No aggregate U4 result is claimed.
All original unit branches and commits are preserved. Receipt recovery is on `codex/u2-receipt-recovery`; export remains at `dd5f190b5a9d58da13fbf107b9791a1c9805425a` on `unit/export`. There are no dispatched active workers. The runtime snapshot is captured evidence, not a live heartbeat; recheck assignments and actual Git state on resume.
The next coordinator owns serialized integration in `/private/tmp/epic-coordination-trial`. Next ready unit: U3, whose named-record implementation exists but needs adaptation to the current output.py and current evidence before local integration. Preserve both existing unit histories, resolve the generic heading overlap by behavior, and keep the receipt prefix stable. Its isolated export test does not prove real normalization flow.
After U3, U4 must exercise normalize-to-receipt and normalize-to-export for `12.34` and `1.005`, run the full suite on the exact combined tree, and record local integration. U5 remains unclaimed: draft named-contract examples and verify them against that integrated tree before completion. U1 historical completion remains intact. EP-1 is incomplete pending U3/U4/U5.
No remote or external writes were attempted. This session stops here as requested. The accompanying checkpoint commit changes only these existing records; code evidence remains tied to the candidate above. Resume from main and these linked records, first reconciling Git/worktree state; do not repeat U2 or trust stale historical status fields.

## Historical full resume assignment — 2026-09-05
The current request supersedes the prior one-unit stop: complete U3/U4/U5 and prove local integration. Coordinator coordination_resume owns serial execution and integration in the sole clean checkout, starting main `e2ba3b3`. Captured worker states are stopped/completed; no workers are dispatched. U1/U2 are already integrated and their code evidence remains applicable. All original branches remain preserved. U3 recovery begins on `codex/u3-export-recovery` from main, merging `unit/export` (`dd5f190`); U4 follows usable consumers, and U5 follows for verified public examples. Integration target is main; combined acceptance is full tests including both specified normalize flows and executed README examples. Local commits/merges only.

## Historical u3 return / U4 assignment — 2026-09-05
U3 integrated on main at `334c67c923b88211bef1255f83ecea195e5a6274`, tree `790bcdc04d8c710318501acfa5a3c38e417e8857`. Merge preserves `dd5f190` as its second parent. Seven current tests pass; U3 self-review found no supported defect. Generic heading uses Export and receipt retains its fixed prefix. U3 assignment ended. Coordinator now owns U4 on `codex/u4-reporting-proof` from that candidate; dependencies hold.

## Historical u4 return / U5 assignment — 2026-09-05
U4 proof integrated at `3d0f5e8e22b5cba4c4c2a7b7c076d667c3ef18b5`. Eight tests pass, including both required real normalization flows. U4 waits only for final aggregate checkpoint with U5 documentation. Coordinator owns U5 at `codex/u5-public-examples` from that main candidate. No other active assignment exists.

## Historical final durable checkpoint — 2026-09-05
EP-1 is complete at the requested verified local integration endpoint. Coordinator coordination_resume owns this final checkpoint; all assignments ended and no next unit remains. U1 and U2 historical completion remains intact. U3 was integrated at `334c67c923b88211bef1255f83ecea195e5a6274`, U4 at `3d0f5e8e22b5cba4c4c2a7b7c076d667c3ef18b5`, and U5 at `2b1d41eebba335fab111eb09953763071e3effc9`. Separate unit histories and original `unit/receipt` / `unit/export` branches remain preserved.

Final combined candidate: main `2b1d41eebba335fab111eb09953763071e3effc9`, tree `143463a86bf44a40fc45a56516f5a1730b29ddda`, clean checkout `/private/tmp/epic-coordination-trial`. On that committed tree, Python 3.10.6 ran `python3 -m unittest discover -s tests`: 8 tests passed, including real normalize-to-receipt and normalize-to-export for 12.34 and 1.005. `python3 -m doctest README.md` passed (all 10 examples, counted in the earlier verbose run on the same README/source). `git diff --check` passed. Named-field normalization remains unchanged. Self-review is COMMENT, model unknown; all changed code, tests, README and records inspected, no supported remaining finding. No independent review was claimed.

The final checkpoint branch `codex/ep1-completion-checkpoint` adds only durable record corrections to this proven tree and is locally fast-forwarded into main. Its exact head is recoverable with `git rev-parse main`; this avoids a self-referential commit hash. No source, tests, dependencies or README changed after the combined checks, so their evidence remains current. On resume read this final checkpoint before historical statuses and confirm Git remains at this checkpoint or inspect subsequent changes. The runtime snapshot remains captured evidence, not a live heartbeat; do not revive superseded worker assignments.

No remote exists. No external writes, push, PR, hosted merge, tracker update or deployment occurred. There are no remaining EP-1 acceptance conditions at the local endpoint. External delivery is outside scope.
