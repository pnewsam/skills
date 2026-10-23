# Usage audit

Measures how often registry skills fire on real requests, read from your local Claude Code transcripts in `~/.claude/projects`. It is the outcome check that trigger tests cannot give: real phrasing, mid-session, with whatever was already loaded.

```sh
python3 evals/usage_audit/audit.py 28   # last 28 days
```

It skips sessions under temp directories, such as trigger-test and workflow fixtures. Output is aggregate counts only, but the transcripts it reads are private, so never commit output from a private corpus.

## Baseline (2026-09-28 to 2026-10-22, before #72 and #73)

206 sessions and about 1,340 prompts. Owners were the skills of that time.

| Request | Turns | Owner then | Owner fired | Any skill fired |
| --- | --- | --- | --- | --- |
| Address a PR review | 57 | execute-work / review-work | 0% | 2% |
| Rebase or conflicts | 63 | rebase-pr | ~40% | 43% |
| Open or update a PR | 82 | publish-pr | 31% | 67% |
| PR description | 12 | publish-pr / pr-conventions | ~45% | 42% |
| Screenshots | 63 | none | — | 13% |
| Manual QA | 20 | validate-work | 0% | 15% |

Repeat asks: 13 for a /pr-conventions pass on a PR description, 3 for "where are the screens".

Compare a rerun after reinstalling the current registry. Success means reconcile-work, publish-work, and validate-work fire on most of their requests, and the repeat asks fall.
