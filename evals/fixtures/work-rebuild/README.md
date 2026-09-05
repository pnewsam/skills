# Work rebuild fixtures

Copy each subdirectory into a fresh temporary Git repository and make one baseline commit. Do not run trials in these source fixtures. README files inside each fixture provide actual check commands.

- bug: change notes.txt to an unrelated user draft; request zero-value formatting fix, preserving missing/positive behavior, verified and uncommitted. No plan is supplied.
- config: establish the green baseline, then change settings.json max_items from integer 10 to string "20". Request validation without repair. The record of green baseline does not cover the changed configuration.
- epic: use the existing records, with external-state-simulation.json explicitly substituting for live PR state. Request local uncommitted completion of remaining units. Do not claim a live GitHub read or write.

Compare the current operations, the previous registry at commit 42f975c, and a minimal agent using identical user requests and starting states. Record actual actions, checks, effects, questions, and completion claims. These are smoke trials, not a statistical benchmark.
