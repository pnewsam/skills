# Epic coordination forward test

Build with `python3 build_fixture.py /private/tmp/unique-epic-fixture`. The destination must not exist. The builder creates a small Python project, local Git branches and durable records; it does not implement the final solution or access a remote. It prints the generated candidate identities (commit timestamps may differ between builds).

Give the executor the generated repository, current ship-epic skill and `request.txt`. Keep `evaluator-only.md` out of executor context. For a two-session run, ask the first worker to advance one ready unit and checkpoint, then give the second worker the original completion request and repository only. Do not pass the first worker's narrative or evaluation verdict to the second.

The five-unit case includes an interrupted owner, changed prerequisite, independently ready work, overlapping branches, and isolated tests that do not prove integration. Worker state is a captured fixture snapshot, not a live harness observation. All edits, commits and integration are local to the disposable repository. There is no remote publication or real simultaneous-worker race.
