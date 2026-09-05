# Previous-registry baseline trial

This independent trial read only the previous skills using `git show HEAD:registry/execute-feature/SKILL.md` and `git show HEAD:registry/validate-changes/SKILL.md`. It did not read the new registry or other trial reports. All execution occurred in disposable copies under `/private/tmp/registry-prior-baseline-zjr1q68s`. No live external effects occurred.

## Setup and isolation

For each fixture, ran `git rev-list --max-parents=0 HEAD` in the supplied source repository, exported that committed tree with `git archive <base>` into a new directory via `tar -xf - -C <destination>`, then ran `git init -q -b main`, `git add .`, and `git -c user.name=Baseline\ Trial -c user.email=baseline@example.invalid commit -qm "Baseline fixture"`. These initial fixture commits preceded the trial requests; no subsequent commits were made.

- Bug source base: `1127c5cb0421948dbe3cfe8493753df3617c541d`.
- Config source base: `324a77eb84af7fc6c6940f24aa2eecdb79463591`.
- Bug disposable repository: `/private/tmp/registry-prior-baseline-zjr1q68s/bug`; initialized HEAD `b1f958e`.
- Config disposable repository: `/private/tmp/registry-prior-baseline-zjr1q68s/config`; initialized HEAD `f7b9414`.
- Setup replaced the tracked bug `notes.txt` contents with `Unrelated user draft: preserve this text exactly.\n` before execution.
- Setup changed config `settings.json` from `{"max_items": 10}` to `{"max_items": "20"}` before validation.

One preliminary status/listing command accidentally targeted the supplied bug source directory, displaying its branch, modified filenames, and repository file names only. No modified source contents or reports were read, and no writes occurred there. All implementation and verification used the fresh committed-tree copy. Archive emitted `tar: Failed to set default locale` but completed successfully; a login-shell inspection emitted a pyenv rehash warning, and subsequent commands used a non-login shell.

## Bug request

Request: Fix zero formatting so 0 produces "0", retain missing/positive behavior, verify, leave uncommitted. No feature plan was supplied.

### Literal applicability and scope

The old executor says: "If no plan exists, ask the user to run `plan-feature` or provide an equivalent single bounded change with acceptance criteria." The supplied request already provides that equivalent bounded change and criteria. Therefore no unnecessary plan question or stop occurred. Its mandatory commit workflow conflicts with the explicit user instruction to leave work uncommitted; user scope controls, so no staging or commit occurred. No feature plan was invented solely for the workflow.

### Commands and effects

Inspected `git status --short`, `git branch --show-current`, `git diff`, `rg --files`, and `cat app.py test_app.py README.md` in the copy. Checked ancestor instruction paths `/AGENTS.md`, `/private/AGENTS.md`, `/private/tmp/AGENTS.md`; none were present. No repository AGENTS.md appeared in the file inventory.

Baseline `python3 -m unittest discover -v`: 1 test passed, the existing positive-count test. A read-only direct call for `(None, 0, 3)` returned respectively `''`, `''`, `'3'`, confirming the zero defect.

Applied one implementation-line change:

```python
return "" if count is None else str(count)
```

Added two focused unit tests: `format_count(0) == "0"` and `format_count(None) == ""`. Retained the existing positive test unchanged. The unrelated draft was not edited during implementation.

Final `python3 -m unittest discover -v`: 3/3 passed (`test_missing`, `test_positive`, `test_zero`), reported duration 0.000s. `git diff --check` emitted no errors. Inspected final `git diff`, `git status --short`, `git log -1 --format=...`, and `git diff --cached --stat`.

Final status:

```text
 M app.py
 M notes.txt
 M test_app.py
```

No staged changes; HEAD remained `b1f958e Baseline fixture`. The draft still exactly contains the setup text. Tests generated ignored Python cache files. No new branch, plan, install, push, or external effect occurred.

Truthful completion: the requested fix and focused verification completed; work remains uncommitted and the user draft is preserved. This outcome does not support claiming that the new skill uniquely removes a mandatory plan block: the prior skill already allows this bounded equivalent request.

## Config-only validation request

Request: Validate this config-only change intended to increase max_items from 10 to 20, without repairs. Supplied dirty configuration actually uses string "20".

### Commands and outcomes

Inspected `git status --short`, `git diff --name-only`, `git diff`, and `rg --files`. Only `settings.json` was changed, with integer 10 replaced by string "20".

Exercised the old scope commands:

- `git diff --name-only HEAD~1`: failed with ambiguous revision because the freshly initialized fixture has only one commit. This was a scope-discovery failure, not a test failure.
- `git diff --name-only main...HEAD`: succeeded with no branch changes.
- `git diff --name-only`: succeeded and returned `settings.json`.

The old skill directs filtering config files and states: "If no application source files changed, report that there's nothing to validate and stop." `settings.json` is the sole config change and no application source changed. Accordingly execution stopped before test discovery, runtime checks, lint, or typecheck. No validation tests ran. The available app/test contents were not inspected after this mandatory stop.

Read-only final status/diff/HEAD checks confirmed only `settings.json` remained modified, its string "20" was preserved, there were no staged changes, and HEAD remained `f7b9414 Baseline fixture`. No repairs occurred.

Truthful completion: the old workflow stopped with nothing to validate under its application-source filter. The requested configuration behavior remains unvalidated. The observed integer-to-string change must not be labeled passing. Zero tests, zero semantic checks, no runtime failure detected, and no claim of correctness. The relevant unnecessary stop was caused directly by the old skill's config exclusion; no user question occurred.

## Comparison-ready findings

| Trial | Actual outcome | Skill friction | Scope preserved |
|---|---|---|---|
| Bounded bug without plan | Fix completed; 3 tests passed | No plan question needed because request qualifies as equivalent bounded criteria; commit directive overridden by explicit request | Yes: unrelated draft preserved, no staging or commit |
| Config-only validation | Stopped after scope analysis; behavior unvalidated | Explicit application-source-only early return prevented checking the config change | Yes: no repairs, settings remains string "20" |
