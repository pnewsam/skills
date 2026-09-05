# U3: JSON export
Outcome: format_export(record) serializes named money fields as JSON; key ordering deterministic.
Parent: ../epics/reporting.md
Dependency: U1 named record accepted in design; branch implementation itself only depends on standard library.
Status: implemented; not integrated.
Owner: worker-export (finished).
Branch: unit/export
Candidate: `dd5f190b5a9d58da13fbf107b9791a1c9805425a`; base `2b151249cb5cd5f819b356654230f42948ffd14e`.
Evidence: `python3 -m unittest discover -s tests -p test_export.py`, 1 test passed at `dd5f190b5a9d58da13fbf107b9791a1c9805425a`.
Handoff: output.py also changes heading; inspect overlap with receipt before combining. No review of combined semantics performed.
