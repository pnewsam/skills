# U5: Public examples
Status: complete; executable examples verified and integrated locally. No active assignment.
Parent: ../epics/reporting.md
Dependency: settled U1 named record contract only. Can draft while consumer integration is pending.
Acceptance: README describes normalize/receipt/export with executable examples and exact half-cent behavior. Verify examples against the integrated tree before marking complete. Do not document the retired tuple API.

## Assignment — 2026-09-05
Coordinator coordination_resume owns `codex/u5-public-examples` in the sole checkout, input main `3d0f5e8`. U1 is settled and consumers now integrated. Document current signatures and named fields with executable examples for both required amounts. Validate using README doctest on the integrated source; self-review, commit and integrate locally.

## Observed evidence — 2026-09-05
Base `3d0f5e8` plus README and records: `python3 -m doctest -v README.md` passed all 10 examples under Python 3.10.6; `git diff --check` passed. Examples demonstrate the actual named API and exact half-cent results. Self-review: COMMENT, model unknown; README claims and examples checked against both consumers and normalization, all record changes inspected. No supported findings; not independent approval. Ready for local commit/integration. No external writes.

## Final handoff — 2026-09-05
Unit committed and verified fast-forward integrated into main at `2b1d41eebba335fab111eb09953763071e3effc9`. Final combined main candidate `2b1d41eebba335fab111eb09953763071e3effc9`, tree `143463a86bf44a40fc45a56516f5a1730b29ddda`, passed 8 full-suite tests and all 10 README doctest examples under Python 3.10.6. See the parent epic's final checkpoint for included revisions and local delivery boundaries. No relevant uncommitted changes remain; only these subsequent record corrections extend the checked tree. Assignment ended. No blocker or next implementation action remains; future external delivery requires separate scope.
