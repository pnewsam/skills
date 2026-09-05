# Hardening summary comment

When the user explicitly authorizes it, post exactly one top-level PR comment
recording the completed work as an audit trail. This write requires its own
authorization; it is not implied by Local, Publish, or Respond mode. Post it only
when a verified remote PR head reflects the work — that is, in Publish or Respond
mode. Do not post a summary for a local-only candidate, because it would attest to
work that is not on the remote head; present that summary in chat instead.

Derive the comment from the round ledger. Do not re-review to produce it. Keep it
concise and factual, in the shape below, and follow the sentence-level style in
`writing-conventions/references/prose.md`. State outcomes truthfully: never imply
convergence, a passed check, or a merge-ready state the ledger does not support.

```markdown
## PR Hardening Summary

**Result: <converged | conditionally ready | budget exhausted | blocked>**

<Two to four sentences: what was hardened, the one reason the result holds, and the bottom line. Do not re-narrate the PR.>

### Rounds

- Round <n>: reviewer <model, plus whether cross-model and context isolation held> · <Blocking/Major/Minor/Nit counts> · <repairs made> · <validation result>

### Changes made

- <finding cluster → fix, traceable to the commit that resolved it>

### Validation

- <what was actually run, with real results — one line each>

### Deferred or still open

- <deferred finding with its merge-safe reason, remaining actionable thread, or pending or failing CI; omit this section when nothing remains>

_Hardening scope: <head> → <base> at <head SHA> · <date>_
```

Post it once through the selected access path, then fetch the live comment and
verify it appears, per `pr-conventions/references/github-mechanics.md`.
