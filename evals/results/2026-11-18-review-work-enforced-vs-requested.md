# review-work: enforced versus requested (kill test and noise screen)

Date: 2026-11-18. Model: claude-fable-5-2 at default effort, as general-purpose subagents. Cost: 5 agents, 80k–129k tokens each, about $10 in total.

## Question

A merged fix in a private repository made a safety behavior depend on reworded instructions to a model. Its new tests asserted the wording. A teammate replaced it with a code-level stop six days later. `review-work` had reviewed the original and reported no actionable findings.

Does one added sentence make the review report that kind of fix as a defect, and does it add noise elsewhere?

## Candidate

One sentence added to the outward-reading questions in `registry/review-work/SKILL.md`:

> Where the change gets a behavior by asking for it — prompt or tool-description text, a comment, a check only the client makes — what stops that behavior when the request is ignored, and does a test fail when it happens rather than when the wording changes?

Control is the same file at f48414b. All other skills and references are byte-identical in both arms.

## Kill test: the case the sentence was written from

Each arm reviewed the original PR once: its description, its diff, and a history-free snapshot of the repository at its head commit. Reviewers had no network access and no sight of the later replacement.

| | Control | Candidate |
| --- | --- | --- |
| Verdict | COMMENT | REQUEST CHANGES |
| The instruction-only fix | Listed under "Open questions (not defects)" | Major finding |
| Tests that assert wording | Noted in the same question | Part of the Major finding |
| Other findings | 3 Minor, 1 Nit | 3 Minor, 1 Nit |

Control noticed the problem. It filed it as a question because the finding model treats "how often will the model ignore the instruction" as uncertain, and an uncertain item never drives a change request. The candidate confirmed a different claim, that nothing in code stops the next action, and reported that as the defect.

So the sentence changed classification, not detection. This is train-on-test: it shows only that the sentence is not inert on its own source case.

## Noise screen: three held-out rounds

The candidate arm reviewed three held-out rounds from `evals/real_pr_review.workflow.js`, one run each, with that harness's reviewer prompt. No skill text was written from these rounds. I chose the three most likely to provoke the sentence: a small status-mapping fix, a CI attestation check, and a change that lets a model choose a request setting. I checked findings against the snapshots by hand.

| Round | Verdict | Findings | Enforcement findings promoted | Ungrounded (of those checked) | Anchors matched |
| --- | --- | --- | --- | --- | --- |
| H1 | COMMENT | 4 | 0 | 0 of 4 | 1 of 4 |
| H2 | COMMENT | 3, plus 3 questions | 0 | 0 of 3 | 2 of 3 |
| H3 | REQUEST CHANGES | 6 | 0 | 0 of 4 | 2 of 3 |

- The sentence promoted nothing on these rounds.
- On H2 the reviewer doubted whether another service enforces a secret before dispatch. Nothing in the snapshot could confirm it, and the reviewer filed it as a question.
- H3's verdict rests on two findings that match the human reviewer's own anchors.
- Two Minor findings on H3 were not checked.

## Decision

Ship the sentence as adopt-and-observe. It showed no cost on the rounds most likely to provoke it, and its one demonstrated effect is a miss that reached production.

## Limits

- The benefit rests on one case, and the sentence was written from that case.
- The screen is three rounds at one run each, with no same-model control arm. Earlier cached control reviews came from a different model, so anchor counts are not compared.
- I wrote the sentence and scored the screen, and the scoring was not blind.
- One held-out round's recorded intent is the PR's final description, while its diff is an earlier design. Reviews of that round report a description mismatch that is an artifact of the eval inputs.
