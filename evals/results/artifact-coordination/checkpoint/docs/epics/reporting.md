# EP-1: Consistent money reports

Outcome: a caller can normalize an amount once and produce a human receipt and a machine-readable export without inconsistent money values. Local delivery only; no remote exists.

## Units
| ID | Outcome | Dependencies | Record | Last recorded state |
| --- | --- | --- | --- | --- |
| U1 | Named money fields and decimal rounding | none | ../work/u1-money.md | integrated |
| U2 | Human receipt | U1 contract | ../work/u2-receipt.md | complete: integrated locally at c5ff759 |
| U3 | JSON export of money record | U1 contract | ../work/u3-export.md | implemented |
| U4 | Combined behavior proof and integration | U1, U2, U3 | ../work/u4-integration.md | waiting |
| U5 | Document public examples | U1 contract | ../work/u5-docs.md | ready |

## Decisions
- The original tuple contract was superseded by U1 after receipt work had started. The authoritative contract is now `{"minor": int, "currency": str}`; use decimal half-up rounding. Do not revert this to accommodate a consumer.
- Receipt is `Receipt: 12.34 USD`; JSON export contains exactly the named money fields. The generic heading helper has no separate compatibility requirement.
- Integration owner is the coordinator. Keep completed unit commits as separate history; locally merge/rebase or make adaptation commits as appropriate.
- Unit completion requires current relevant evidence. Final initiative completion requires combined behavior on one identified integrated tree and documentation examples verified against it.

## Historical checkpoint before this resume
Worker-receipt was interrupted before the contract change was reconciled. The owner field has not yet been cleared. Export was built separately. U4 has never run against their combination. U5 can proceed independently of the stopped worker. See runtime snapshot for observed worker state.

## Resume decision — 2026-09-05
Coordinator owns the index and serialized local integration in `/private/tmp/epic-coordination-trial`. Selected U2: the supplied runtime snapshot confirms the prior worker stopped, the implementation is preserved, and adapting this outdated consumer removes a prerequisite of U4. U1 remains integrated and unchanged. U3 is implemented on its preserved branch but has no combined review. U5 can draft independently, but its completion proof needs the integrated consumer tree. No unit is concurrently dispatched.
Integration target for this run: main plus U2 only, via `codex/u2-receipt-recovery`, starting at `aac42f1869d6f6045e8726a6a8ad57c8de1dec02`. Required proof is current U1/receipt regression testing; U4 aggregate acceptance stays pending. One-unit scope ends after the U2 endpoint and this checkpoint.

## Durable checkpoint — 2026-09-05
One-unit run finished: U2 reached validated, self-reviewed, committed and locally integrated status at `c5ff759e6e49fcd13cf4cb5e5b527db49008f6a5` (tree `4d3ea060131ca2e1fb9765c12b5de5141310398e`). Main includes U1 and U2. Six current tests passed under Python 3.10.6; detailed proof and the historical failure are in [U2](../work/u2-receipt.md). No aggregate U4 result is claimed.
All original unit branches and commits are preserved. Receipt recovery is on `codex/u2-receipt-recovery`; export remains at `dd5f190b5a9d58da13fbf107b9791a1c9805425a` on `unit/export`. There are no dispatched active workers. The runtime snapshot is captured evidence, not a live heartbeat; recheck assignments and actual Git state on resume.
The next coordinator owns serialized integration in `/private/tmp/epic-coordination-trial`. Next ready unit: U3, whose named-record implementation exists but needs adaptation to the current output.py and current evidence before local integration. Preserve both existing unit histories, resolve the generic heading overlap by behavior, and keep the receipt prefix stable. Its isolated export test does not prove real normalization flow.
After U3, U4 must exercise normalize-to-receipt and normalize-to-export for `12.34` and `1.005`, run the full suite on the exact combined tree, and record local integration. U5 remains unclaimed: draft named-contract examples and verify them against that integrated tree before completion. U1 historical completion remains intact. EP-1 is incomplete pending U3/U4/U5.
No remote or external writes were attempted. This session stops here as requested. The accompanying checkpoint commit changes only these existing records; code evidence remains tied to the candidate above. Resume from main and these linked records, first reconciling Git/worktree state; do not repeat U2 or trust stale historical status fields.
