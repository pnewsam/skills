# Trigger routing: prior-art gap mode (2026-11-05)

Question: once `mindsdb-align-code-mode-ui` is retired and `prior-art` gains a gap mode, do competitor and catch-up requests still route to `prior-art`, and does it avoid taking requests that belong to other skills?

## Method

`evals/trigger/run.py` with the `build_fixture.sh` repo, Claude Code 2.1.318, default model (claude-opus-5-5), 3 reps per prompt. Eleven prompts are verbatim user requests from past transcripts, with any slash-command mentions removed. These cover catch-up work, aligning a UI element with a competitor, and competitor lookups. Two catch-up prompts and three align prompts were written as held-out cases. Five prompts are negative controls that belong to execute-work, plan-epic, review-work, and validate-work. The prompts stay outside this public repo.

| Arm | Registry |
| --- | --- |
| A | main: the align skill and the old `prior-art` |
| B | This branch: align skill removed, gap mode added |
| C | B with "align a feature or UI element with what a competitor does" in the description |

## Results

| Category (prompts) | A | B | C |
| --- | --- | --- | --- |
| Catch up or gap (7) | 21/21 | 18/21 | |
| Competitor lookup (4) | 11/12 | 10/12 | |
| Negative controls (4): no `prior-art` misfire | 12/12 | 12/12 | |
| Rerun: align-with-competitor dev prompt (1) | | 2/3 | 3/3 |
| Rerun: held-out align prompts (3) | | 9/9 | 9/9 |

In arm B, every catch-up or lookup miss loaded no skill. No negative control loaded `prior-art` in any arm. The fix prompt loaded no skill in either arm, which matches earlier results for execute-work.

## Findings

- The gap mode keeps routing for catch-up and lookup requests: 28 hits against main's 32. All three catch-up misses came from one prompt, "help me align it with what Claude does." On main, the align skill's name won that prompt.
- On rerun, B picked `prior-art` for that prompt 2/3 times and C 3/3 times. Held-out align prompts went 9/9 in both arms, so the wording change is within noise. It ships because it costs nothing.
- `prior-art` did not take review, planning, or screenshot requests.

## Limits

Three reps per prompt, so arm differences under about five hits are noise. Prompts lacked their conversations. Routing is not outcome quality: this does not test whether gap mode produces better gap lists than the align skill did.
