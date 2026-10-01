---
name: mindsdb-align-code-mode-ui
description: Align one piece of MindsDB Cowork Code Mode UI with the app's own patterns and with coding-agent prior art (Claude, Codex, and open-source peers such as t3code). Use when given a UI element, usually with a screenshot and a short critique of why it looks off. Researches references, recommends the smallest fix, and implements it unless asked for a recommendation only.
---

# Align a Code Mode UI element

The input is one UI element, usually with a screenshot and a critique. Keep the work to that element; list other issues you notice instead of fixing them.

## Find the real element

Match the screenshot to its component in `cowork/src/renderer/cowork/code/` and read its CSS and tokens. Look for the same job elsewhere in the app, such as chat mode, `components/ui` primitives, or a sibling Code Mode view. Consistency within the app is the first reference. Constraints come from `cowork/docs/ui-cohesion-plan.md`: the palette is frozen, values use existing tokens, and removing chrome beats adding it.

## Check prior art

Claude and Codex are the primary references, but their apps are closed. Use their docs, changelogs, and screenshots, and never invent their internals. For implementation detail, read the equivalent component in two or three open-source apps or component libraries from [references/prior-art.md](references/prior-art.md). Compare structure, hierarchy, spacing, states, and affordances. Record where the references agree and where they differ, with links.

## Decide and change

Follow the in-app pattern when a sound one exists. Otherwise follow the consensus of the references. If the two conflict, name the conflict and recommend one. Tie the fix to the critique. Implement the smallest change, reuse primitives rather than writing bespoke CSS, and update colocated tests. Take before and after screenshots of the rendered UI as [references/capture.md](references/capture.md) describes, including hover, focus, empty, and dark states where relevant. Look at each image before using it.

## Return

Report the diagnosis, a short table of prior art (source, pattern, link), the decision and its reasoning, the change with before and after screenshots, and any open questions. Give local image paths; the user attaches them to a PR, since images cannot be uploaded to GitHub from the CLI. Commit or open a PR only when asked.
