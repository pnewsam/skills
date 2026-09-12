export const meta = {
  name: 'judge-negative-control',
  description: 'Validates the real-PR review judge by scoring deliberately bad reviews against real anchors. A judge that credits a vacuous, fabricated, restated, or entirely mismatched review is not measuring review quality, and every result it has produced is void.',
  phases: [
    { title: 'Score sabotage' },
  ],
}

// args = { caseIds, dataDir, reps? }
// The judge prompt below is a verbatim copy of the one in
// real_pr_review.workflow.js. If that prompt changes, change this one too, or
// this is no longer a test of the judge we actually use.
const CFG = typeof args === 'string' ? JSON.parse(args) : args
const CASE_IDS = CFG.caseIds
const DATA = CFG.dataDir
const REPS = CFG.reps || 1

const MATCH_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    matches: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          anchor_id: { type: 'string' },
          found: { type: 'boolean' },
          note: { type: 'string' },
        },
        required: ['anchor_id', 'found'],
      },
    },
    extras: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          summary: { type: 'string' },
          grounded: { type: 'boolean' },
          severity: { type: 'string' },
        },
        required: ['summary', 'grounded'],
      },
    },
    reasoning: { type: 'string' },
  },
  required: ['matches'],
}

const matchPrompt = (id, review) => `You are a blind evaluator. Read \`${DATA}/anchors.json\` and take the array under the key "${id}": those are DEFECT ANCHORS a reviewer raised on the same change the review below covers. Decide, for each anchor, whether the review reports the SAME underlying defect.

Match on the defect itself, not on wording, severity label, or line number. The review reports an anchor if it identifies the same root cause and the same consequence — even in different words, even at a different severity. You do not know and must not infer which system produced the review.

Be strict about what counts as reporting it. The review must actually raise the defect: name the faulty behavior and the condition that triggers it. These do NOT match:
- mentioning the same function, symbol, or file while describing a different problem;
- noting the area as a caveat, a limitation, an untested surface, or a thing worth watching, without stating the defect itself;
- describing the correct behavior, or confirming the code does what the intent says, where the anchor says it does not;
- a generic concern that would read the same against any change of this kind.
A reviewer who says "no test exercises this path" has not reported a defect on that path. When in doubt, mark it not found and say why in the note.

Then list any finding the review raises that matches NO anchor, and judge whether it is grounded: does the review name a concrete input, state, or execution path in this change that makes it bite? A grounded unanchored finding may be a real defect the anchor list simply does not cover — do not treat unanchored as automatically wrong.

Return one entry in \`matches\` for every anchor id in that array, using the anchor's \`id\` verbatim, and one entry in \`extras\` per unanchored finding.

REVIEW:
${review}`

// Four ways a review can be worthless. A sound judge scores every one of them
// at zero recall; `fabricated` should additionally show ungrounded extras.
const SABOTAGE = {
  vacuous: `## Code Review

**Verdict: APPROVE**

I read through the diff and the surrounding module. The implementation is clean and follows the patterns already established in this codebase. Naming is consistent, the structure is easy to follow, and the change does what the description says it does.

### Findings

**Minor:** Consider adding docstrings to the new functions for consistency with the rest of the module.

**Minor:** A few of the new blocks are long enough that extracting a helper would improve readability.

**Nit:** Some of the added lines exceed the typical line length used elsewhere in this file.

Nothing here blocks. The tests added alongside the change look reasonable and the overall approach is sound. Good to merge once the minor comments are addressed.`,

  fabricated: `## Code Review

**Verdict: REQUEST CHANGES**

Several serious problems in this change.

**Blocking:** The new code mutates a module-level cache without holding a lock. Two concurrent requests entering this path will interleave their writes and the later one will silently overwrite the earlier, producing corrupted state that persists for the lifetime of the worker.

**Blocking:** The retry loop has no backoff and no maximum attempt count. A downstream timeout will therefore spin at full rate until the request is killed, turning a transient dependency failure into a self-inflicted outage.

**Major:** User-supplied values are interpolated directly into the query string rather than bound as parameters, so a crafted value escapes the intended predicate.

**Major:** The new file handle is opened but never closed on the error path, leaking a descriptor per failed request until the process exhausts its limit.

**Minor:** Exceptions are caught with a bare except that swallows KeyboardInterrupt and SystemExit along with the intended error.

These need to be addressed before this can merge.`,

  restated: `## Code Review

**Verdict: APPROVE**

This change does what it sets out to do. The new fields are returned in the response as described, the filters are applied consistently across both code paths, and the sort order requested by the caller is honored. Pagination continues to behave as it did before, and the added tests cover the new parameters.

The schema changes line up with the service layer, and the endpoint signature matches the documented contract. Error handling follows the existing convention of translating service errors into the appropriate status code.

I verified the description's claims against the diff and they hold. No defects found.`,

  mismatched: `## Code Review

**Verdict: REQUEST CHANGES**

**Blocking:** \`useEffect\` here has no dependency array, so it re-runs on every render. Because the effect also calls \`setState\`, this is an infinite render loop the moment the component mounts with a non-null \`user\` prop.

**Major:** The list is keyed by array index. When an item is removed from the middle, React reuses the wrong DOM nodes and the rows below inherit the removed row's local state — the open/closed state of each accordion shifts by one.

**Major:** The fetch in \`loadProfile\` is not cancelled when the component unmounts, so a slow response resolves against a dead component and logs a state-update warning.

**Minor:** The inline object passed as \`style\` is reconstructed on every render, defeating the memo on the child.

**Nit:** \`ProfileCard\` is exported both as a default and as a named export, which makes the import sites inconsistent across the app.`,
}

const runUnit = async (item) => {
  const m = await agent(matchPrompt(item.id, SABOTAGE[item.kind]), {
    label: `neg:${item.kind}:${item.id}#${item.rep}`,
    phase: 'Score sabotage',
    schema: MATCH_SCHEMA,
  })
  if (!m || !m.matches) return { ...item, dead: 'no-score' }
  const all = m.matches
  const found = all.filter((x) => x.found)
  const extras = m.extras || []
  return {
    ...item,
    anchors: all.length,
    found: found.length,
    recall: all.length ? found.length / all.length : null,
    foundIds: found.map((x) => x.anchor_id),
    extrasGrounded: extras.filter((e) => e.grounded).length,
    extrasUngrounded: extras.filter((e) => !e.grounded).length,
    reasoning: String(m.reasoning || '').slice(0, 900),
  }
}

phase('Score sabotage')
const units = []
for (const kind of Object.keys(SABOTAGE))
  for (let rep = 1; rep <= REPS; rep++)
    for (const id of CASE_IDS) units.push({ id, kind, rep })
const rows = (await parallel(units.map((u) => () => runUnit(u)))).filter(Boolean)

const scored = rows.filter((r) => !r.dead)
const mean = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : NaN)
const rnd = (x) => (Number.isFinite(x) ? Math.round(x * 1000) / 1000 : null)

const byKind = {}
for (const kind of Object.keys(SABOTAGE)) {
  const sel = scored.filter((r) => r.kind === kind)
  byKind[kind] = {
    recall: rnd(mean(sel.map((r) => r.recall))),
    worstCaseRecall: rnd(Math.max(...sel.map((r) => r.recall))),
    anchorsCredited: sel.reduce((n, r) => n + r.found, 0),
    anchorsSeen: sel.reduce((n, r) => n + r.anchors, 0),
    extrasGrounded: rnd(mean(sel.map((r) => r.extrasGrounded))),
    extrasUngrounded: rnd(mean(sel.map((r) => r.extrasUngrounded))),
    n: sel.length,
  }
}

// The bar: a sound judge credits nothing to any of these. Real control recall
// on this material is 0.479, so anything approaching that is disqualifying.
const worst = Math.max(...scored.map((r) => r.recall))
const verdict = worst === 0
  ? 'PASS — no sabotaged review was credited with any anchor'
  : worst < 0.15
    ? `WEAK PASS — highest sabotage recall ${rnd(worst)}; inspect which anchors leaked`
    : `FAIL — sabotage scored ${rnd(worst)} against real control recall 0.479; the judge is not measuring review quality`

log(`Done: ${scored.length}/${units.length} scored. ${verdict}`)

return {
  verdict,
  byKind,
  credited: scored.filter((r) => r.found > 0).map((r) => ({ kind: r.kind, id: r.id, found: r.foundIds, why: r.reasoning })),
  rows: scored.map(({ reasoning, ...rest }) => rest),
}
