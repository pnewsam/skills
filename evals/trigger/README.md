# Trigger test

Measures which registry skill a fresh Claude Code session loads first for a prompt. A skill that never triggers cannot help, so check routing before running a behavioral A/B.

Each run starts `claude -p` in a throwaway git repo whose `.claude/skills` holds one registry variant. `--setting-sources project` hides user-installed skills; Claude Code's built-in skills stay visible, as in real use. A run stops at the first non-reference skill call, after six tool calls, or after four minutes. Reference skills (`*-conventions`) are recorded but do not end a run.

## Layout

Keep prompts outside this public repo when they quote private work. A data directory holds:

- `prompts.json`: `[{"cat": "<category>", "p": "<prompt>"}]`
- `expect.json`: `{"<category>": {"<arm>": ["<acceptable skill>", ...]}}`
- `arms/<arm>/registry/`: each variant's skill packages

Prompts may carry a `split` (`dev` or `holdout`); score.py reports each split separately. Write wording changes from dev misses only, and judge them on holdout.

```sh
python3 evals/trigger/run.py <datadir> <reps> A B C   # appends to <datadir>/results.jsonl
python3 evals/trigger/score.py <datadir>
```

Prompts that refer to existing work ("draft PR it", "how do I QA this") need repo state to act on. In an empty repo the session inspects git, finds nothing, and stops without a skill. `build_fixture.sh <datadir>` builds a small repo with a pushed fix branch; pass it as `FIXTURE`:

```sh
bash evals/trigger/build_fixture.sh <datadir>
PROMPTS=prompts_ctx.json RESULTS=results_ctx.jsonl FIXTURE=<datadir>/fixture python3 evals/trigger/run.py <datadir> 3 E
PROMPTS=prompts_ctx.json RESULTS=results_ctx.jsonl python3 evals/trigger/score.py <datadir>
```

Run arms one after another so the prompt cache stays warm. A run that loads a skill and continues costs about $1.30; stopping at the first pick keeps it near a few cents.

## Limits

Routing is not outcome quality. A prompt without its conversation, or without repo state, is harder to route than the same words mid-session. Real sessions also route lower than this test, because a skill already loaded earlier in a session is not called again. Built-in skills compete differently across Claude Code versions, so record the version with results.
