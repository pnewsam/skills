# Trigger test

Measures which registry skill a fresh Claude Code session loads first for a prompt. A skill that never triggers cannot help, so check routing before running a behavioral A/B.

Each run starts `claude -p` in a throwaway git repo whose `.claude/skills` holds one registry variant. `--setting-sources project` hides user-installed skills; Claude Code's built-in skills stay visible, as in real use. A run stops at the first non-reference skill call, after six tool calls, or after four minutes. Reference skills (`*-conventions`) are recorded but do not end a run.

## Layout

Keep prompts outside this public repo when they quote private work. A data directory holds:

- `prompts.json`: `[{"cat": "<category>", "p": "<prompt>"}]`
- `expect.json`: `{"<category>": {"<arm>": ["<acceptable skill>", ...]}}`
- `arms/<arm>/registry/`: each variant's skill packages

```sh
python3 evals/trigger/run.py <datadir> <reps> A B C   # appends to <datadir>/results.jsonl
python3 evals/trigger/score.py <datadir>
```

Run arms one after another so the prompt cache stays warm. A run that loads a skill and continues costs about $1.30; stopping at the first pick keeps it near a few cents.

## Limits

Routing is not outcome quality. A prompt without its conversation is harder to route than the same words mid-session. Built-in skills compete differently across Claude Code versions, so record the version with results.
