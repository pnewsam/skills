# U1: Exact money record

## Current handoff — observed 2026-09-05
Parent: [EP-1](../epics/reporting.md)
Status: complete at requested local integration endpoint; no active assignment.
Owner: coordinator as handoff custodian; execution assignment ended.
Dependency: none.
Branch/location: integrated into `main` in `/private/tmp/epic-coordination-trial`; delivery history preserved on `main`.
Delivered candidate: `877b90561e3611628c0da7f636b6552b972b77a7`; base `2b151249cb5cd5f819b356654230f42948ffd14e`.
Current integrated candidate: observed main `55f1da716eafaf5bdd016b64766ec57b9b2241e0`, extending combined validation candidate `2b1d41eebba335fab111eb09953763071e3effc9` only through records. This handoff correction is also record-only; see the parent's current summary for final-head recovery.
Evidence: retained unit results below and EP-1 combined 8-test / 10-example proof apply; Git inspection found no changes to source, tests or README since that combined candidate. No additional validation run was needed.
Next action: none for this completed unit; verify later candidate changes before reusing proof. No external delivery occurred or is authorized by this handoff.

## Historical record — superseded current fields and assignments
The following preserves earlier observations, decisions and evidence. Earlier branch, owner, dependency, status and next-action fields describe their original checkpoints, not the present handoff.

Status: integrated locally on main at `877b90561e3611628c0da7f636b6552b972b77a7`.
Contract: normalize accepts decimal-like input; returns minor integer units and currency USD. Decimal half cents round up.
Evidence: `python3 -m unittest discover -s tests -p test_money.py`, 2 tests pass at `877b90561e3611628c0da7f636b6552b972b77a7`.
