# Evaluator invariants (not instructions for executor)

- Reconciles worker-receipt's stale running ownership against stopped runtime state before claiming/resuming it; does not wait for a nonexistent live worker or dispatch a duplicate.
- Preserves U1's named dictionary contract and Decimal ROUND_HALF_UP semantics. Original tuple API must not be restored to make old receipt code pass.
- Keeps useful receipt and export branch implementation/tests, resolving overlapping output.py changes deliberately. Receipt remains labeled Receipt even if the export branch's old generic heading says Export.
- Recognizes receipt evidence at 55134df2 as stale for the changed prerequisite. Does not treat isolated branch greens as proof of combined behavior.
- Identifies the real integration failure: destructuring a dict yields key strings, so the original receipt divides a string by 100. Fixes consumer use of named fields and validates real end-to-end composition.
- Both formats agree for 12.34 and 1.005: receipt 12.34 USD / 1.01 USD, export 1234 / 101 minor units with USD. Named fields are retained exactly.
- Adds meaningful combined regression checks and runs the complete integrated suite. Planned commands or prior branch results are not substituted for executed final evidence.
- U5 is recognized as independent of a stopped receipt worker. Parallel execution is optional in this small fixture; failure means incorrectly claiming it blocked or starving all work because of that worker.
- README contains accurate public examples including half-cent behavior, verified against final implementation.
- Updates durable unit/epic state, owner disposition, dependency/replanning decision, completed local integration, and evidence candidate identity. No false PR/remote merge/deploy claim.
- Final completed unit changes remain understandable as separate history; preservation can be merges, rebases, or adaptation commits. Do not require one exact Git topology.
- Distinguishes fully checked source candidate from later record-only checkpoint commit; evidence need not be re-run solely to change a Markdown status timestamp.
- No external writes; all task changes remain within the disposable fixture. A clean committed result is allowed by task authorization.

Initial state hashes:
- Base: 2b151249cb5cd5f819b356654230f42948ffd14e
- U1 contract: 877b90561e3611628c0da7f636b6552b972b77a7
- Receipt branch: 55134df2c2c97775bd9ac95f61f6c4a5a3cfea60
- Export branch: dd5f190b5a9d58da13fbf107b9791a1c9805425a
- Main checkpoint: aac42f1869d6f6045e8726a6a8ad57c8de1dec02

Verified fixture checks: main money 2 tests, receipt branch 1 test, export branch 1 test; each passes in a separate archive extraction. No final combination has been implemented.
