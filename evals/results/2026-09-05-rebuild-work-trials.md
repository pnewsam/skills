# Independent forward-testing evidence

Test root: `/private/tmp/registry-work-trials-4me0oanv`. Registry was read only. These are actual disposable Git repositories and actual executed checks, with one baseline fixture commit each. No live remote or external write occurred. Scenarios and authoring decisions were made independently from the skill text and supplied parent request, not from expected-output examples.

Applied `work-conventions`, `execute-work`, `validate-work` plus `references/verification.md`; used `review-work`/finding model and `ship-epic` for the epic case. Read `analyze-work`, `plan-work`, and `deliver-work` to evaluate boundaries; no artificial analysis/plan phases were needed. No skill-induced user questions were asked.

## 1. Small bug; no plan; unrelated dirty file; uncommitted endpoint

Request exercised: fix zero formatting so 0 produces "0", retain missing/positive behavior, verify, leave uncommitted. Existing unrelated `notes.txt` contained a user draft before execution.

- Repo: `/private/tmp/registry-work-trials-4me0oanv/bug`; base/head `1127c5cb0421948dbe3cfe8493753df3617c541d` on main.
- Read Git status/diff, source/tests and README command. Existing test passed (1 case). Added zero and missing-value cases. Zero test failed (`'' != '0'`), missing and positive passed.
- Replaced falsey fallback with explicit `None` handling. `python3 -m unittest discover -v` then passed all 3; `git diff --check` passed.
- Final related candidate is unstaged `app.py` + `test_app.py`; diff SHA-256 `2d66cd8449ce23b7e43b8123deef03f5a50d67b7bfbb6a0b7c55da4b8ac24f81`. No intended untracked files. `notes.txt` is excluded from candidate and byte-for-byte preserved (verified programmatically).
- Final Git index empty, head unchanged, total commits still 1. No plan/record created inside this uninterrupted small task. No commit, push, PR, or tracker write.
- Completion claim warranted: implemented and validated locally; left uncommitted. No independent review or published/merged claim.

## 2. Config-only candidate validation and stale baseline proof

Request exercised: validate a config-only candidate intended to increase max_items to 20, without repairs.

- Repo: `/private/tmp/registry-work-trials-4me0oanv/config`; base/head `324a77eb84af7fc6c6940f24aa2eecdb79463591`. Only unstaged `settings.json` changes, from integer 10 to string "20". Candidate diff SHA-256 `901e6c5c72d56cf164da31e589ecd0e36d31009c99d9cb75738db62130c75a94`.
- Baseline `python3 -m unittest discover -v` passed 1 case. Candidate JSON parsing (`python3 -m json.tool settings.json`) passed, but actual configured application test errored with `ValueError: max_items must be a positive integer` from app.py:7. This is a candidate-introduced runtime failure, not a reproduced baseline failure.
- Green baseline evidence was not reused after configuration changed. Parsing was not treated as adequate behavioral proof. Required runtime criterion is FAIL; intended 20-item boundary remains unverified because runtime rejects configuration.
- Validation made no repair to source/tests/config, did not weaken a test, and left only the supplied config change. Index empty, total commits 1, no publication. Completion claim warranted: validation completed with failed acceptance; candidate not validated successfully.
- One batched shell inspection ended with exit 0 because a later diff command succeeded; the visible unittest output was still FAILED. A direct subprocess capture confirmed unittest exit 1 and preserved it in `observations.json`. This was a harness reporting pitfall, not a skill rule failure.

## 3. Resume epic with blocked dependency, independent unit, local endpoint

Request exercised: finish two remaining units locally, keep changes uncommitted. Unit A requires prerequisite PR #41 merged; B independently strips surrounding whitespace. Overall acceptance includes both outcomes and integration.

External state is explicitly SIMULATED in `/private/tmp/registry-work-trials-4me0oanv/external-state-simulation.json` (OPEN, mergedAt null); no live PR refresh is claimed. Actual local Git, implementation, validation, branch, and records were exercised.

- Repo: `/private/tmp/registry-work-trials-4me0oanv/epic`; base/head `1cda1f375412eb65475795516631b1ac8621dd33`. Read existing epic/unit records, actual Git state, empty remote list, and refreshed simulated PR state.
- A's prerequisite did not hold, so A was not implemented or marked complete. Selected B and created branch `codex/unit-b`.
- Added padded-space and tab/newline cases; both failed on baseline, plain case passed. Implemented `value.strip().lower().replace(" ", "-")`. All 3 cases passed; whitespace check passed.
- Reviewed actual source/test diff against B acceptance/non-goals and found no supported defects. This was a local assessment by the implementing trial agent, not an independent second-reviewer claim. No review was posted.
- Source/test diff SHA-256 `77d5a2bef0e7c8d6f8a57e4c297a8d45c594fe74761bee00fca735833e3200f8`. Updated existing `docs/unit-b.md` with candidate/proof/endpoint and `docs/epic.md` with the blocked edge, simulated-state limitation, incomplete integration and next action. No duplicate plan or bookkeeping commit.
- Final unstaged files: app.py, test_app.py, docs/epic.md, docs/unit-b.md. Unit A record unchanged; index empty; total commits still 1. No push, PR creation, merge, deploy, or tracker update.
- Completion claim warranted: B implemented, validated and locally reviewed at uncommitted endpoint. Epic incomplete: A blocked and aggregate acceptance unverified. Next action requires actual prerequisite merge evidence before A can proceed. No permission question is needed to report this prerequisite.

## Assessment and limitations

All three forward trials respected intended scope, uncommitted/local boundaries and evidence freshness without mandatory-plan/approval friction. Required failure was surfaced, unrelated dirty state was preserved, and a blocked dependency did not stop independent work. No substantive contract failure emerged from these scenarios.

Minor text defect: `registry/pr-conventions/references/finding-model.md` says “`review-work` and `review-work` both consume it”; stale duplicated reference, no observed operational harm.

The shell emitted an unrelated pyenv rehash-permission warning in subdirectory login shells; Python/tests still ran. Tests used local Python unittest fixtures rather than a product's browser, CI or live GitHub environment. Remote read-back, ambiguous external-write recovery, PR lifecycle and true multi-reviewer behavior were not exercised. The evidence supports these bounded trials, not universal correctness.

Machine-readable final status, head/index/commit counts, whole-worktree diff hashes, preservation assertion, and direct failing config-test exit are in `/private/tmp/registry-work-trials-4me0oanv/observations.json`. Related candidate hashes above exclude unrelated notes and record bookkeeping where appropriate.
