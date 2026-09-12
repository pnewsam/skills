export const meta = {
  name: 'real-pr-review',
  description: 'Review calibration and A/B against real merged PRs: each arm reviews the diff exactly as it stood at a historical review round, with a history-free snapshot of the repo at that commit, and a blind judge matches the arm findings against what the human reviewer actually raised that round. Anchors come from the PRs, not from the harness author.',
  phases: [
    { title: 'Review + match' },
  ],
}

// args = { caseIds, dataDir, skillsDir, reps?, arm_deltas? }
// Case data lives OUTSIDE this repo (the subject repos are not public) and is
// never passed through args: reviewers read `<dataDir>/review_inputs.json` for
// their own case, the judge reads `<dataDir>/anchors.json`, and this script
// carries no case content at all.
const CFG = typeof args === 'string' ? JSON.parse(args) : args
const CASE_IDS = CFG.caseIds
const DELTAS = CFG.arm_deltas || { control: '' }
const ARMS = Object.keys(DELTAS)
const REPS = CFG.reps || 2
const DATA = CFG.dataDir
const SKILLS = CFG.skillsDir

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
    anticipated: {
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
    reasoning: { type: 'string' },
  },
  required: ['matches'],
}

const reviewPrompt = (id, arm) => {
  const delta = DELTAS[arm] || ''
  const deltaBlock = delta
    ? `\n\nApply this ADDITIONAL house guidance on top of the skill:\n"""\n${delta}\n"""`
    : ''
  return `You are reviewing a real pull request. First read \`${SKILLS}/registry/review-work/SKILL.md\` and the references it points to (\`references/review-protocol.md\`, \`references/risk.md\`, and \`${SKILLS}/registry/pr-conventions/references/finding-model.md\`) and internalize them.${deltaBlock}

THE CHANGE UNDER REVIEW

Read \`${DATA}/review_inputs.json\` and find the entry whose id is "${id}". It gives the PR title, the intent from its description, and the paths below.

The diff is at \`${DATA}/diffs/${id}.diff\`. A complete snapshot of the repository as it stood at this commit — the code this diff applies to, its tests, its migrations, its callers — is at \`${DATA}/trees/${id}/\`. Read whatever you need from that snapshot: the diff alone will not tell you how the changed code behaves against the schema, its consumers, or the rest of the codebase.

RULES

- Do NOT use \`gh\`, the GitHub API, the network, or any lookup of this pull request, its comments, or its later commits. The snapshot and the diff are all you get.
- Do NOT read anything under \`${DATA}\` other than \`review_inputs.json\`, this case's diff, and this case's snapshot. Never read \`anchors.json\`, \`cases.json\`, or another case's directory. Those hold the evaluation key.
- Do NOT read anything under \`${SKILLS}/evals/\`.

Review the change on its own content and report your findings exactly as the skill and finding model direct: each supported finding with its severity, the concrete failing input, state, or execution path that makes it bite, and why it matters, ordered by severity. If there is no supported blocking or major defect, say so plainly. Do not invent findings to appear thorough, and do not withhold a real defect.

Return only your review.`
}

// Anchors from LATER rounds of the same PR. A review that reports one of these
// found a defect before the human reviewer did; per-round recall alone scores
// that as noise, so it is credited separately rather than folded into recall
// (later rounds can concern code this commit does not yet contain, so these
// must never enter the recall denominator).
const laterKeysOf = (id) => {
  const m = /^(pr\d+)-round(\d+)$/.exec(id)
  if (!m) return []
  return CASE_IDS.filter((o) => {
    const n = /^(pr\d+)-round(\d+)$/.exec(o)
    return n && n[1] === m[1] && Number(n[2]) > Number(m[2])
  })
}

const matchPrompt = (id, review) => {
  const later = laterKeysOf(id)
  const laterBlock = later.length
    ? `\n\nSECOND TASK. The same reviewer raised further anchors on LATER rounds of this same pull request, under these keys in that file: ${later.map((k) => `"${k}"`).join(', ')}. Read them too. For each, decide by the same strict standard whether THIS review already reports that defect — the review would then have caught it before the reviewer did. Some later anchors describe code that did not exist yet at this point; if the review could not have seen the code in question, mark it not found. Report these in \`anticipated\`, using each anchor's \`id\` verbatim.`
    : ''
  return `You are a blind evaluator. Read \`${DATA}/anchors.json\` and take the array under the key "${id}": those are DEFECT ANCHORS a reviewer raised on the same change the review below covers. Decide, for each anchor, whether the review reports the SAME underlying defect.

Match on the defect itself, not on wording, severity label, or line number. The review reports an anchor if it identifies the same root cause and the same consequence — even in different words, even at a different severity. You do not know and must not infer which system produced the review.

Be strict about what counts as reporting it. The review must actually raise the defect: name the faulty behavior and the condition that triggers it. These do NOT match:
- mentioning the same function, symbol, or file while describing a different problem;
- noting the area as a caveat, a limitation, an untested surface, or a thing worth watching, without stating the defect itself;
- describing the correct behavior, or confirming the code does what the intent says, where the anchor says it does not;
- a generic concern that would read the same against any change of this kind.
A reviewer who says "no test exercises this path" has not reported a defect on that path. When in doubt, mark it not found and say why in the note.

Then list any finding the review raises that matches NO anchor, and judge whether it is grounded: does the review name a concrete input, state, or execution path in this change that makes it bite? A grounded unanchored finding may be a real defect the anchor list simply does not cover — do not treat unanchored as automatically wrong.

Return one entry in \`matches\` for every anchor id in that array, using the anchor's \`id\` verbatim, and one entry in \`extras\` per unanchored finding. A finding that matches a later-round anchor (see below) belongs in \`anticipated\`, not in \`extras\`.${laterBlock}

REVIEW:
${review}`
}

const HARNESS = [
  'ReportFindings', 'Deferred MCP', 'You are Claude Code', 'system-reminder',
  'scratchpad directory', 'claude_ai_', 'official CLI', 'MCP servers', 'Skill tool',
  'You are only permitted to invoke', 'harness configuration', 'TodoWrite',
]
const isDegenerate = (a) => {
  const t = String(a || '').trim()
  if (t.length < 200) return true
  return HARNESS.some((h) => t.includes(h))
}

const runUnit = async (item) => {
  let review = null
  for (let attempt = 0; attempt < 4; attempt++) {
    const a = await agent(reviewPrompt(item.id, item.arm), {
      label: `rev:${item.arm}:${item.id}#${item.rep}${attempt ? `r${attempt}` : ''}`,
      phase: 'Review + match',
    })
    if (a && !isDegenerate(a)) { review = a; break }
  }
  if (!review) return { ...item, dead: 'degenerate-review' }

  const m = await agent(matchPrompt(item.id, review), {
    label: `match:${item.arm}:${item.id}#${item.rep}`,
    phase: 'Review + match',
    schema: MATCH_SCHEMA,
  })
  if (!m || !m.matches) return { ...item, dead: 'no-match' }

  // The judge reports one entry per anchor; totals come from its reply, since
  // this script never sees the anchor list.
  const all = m.matches
  const found = all.filter((x) => x.found)
  const foundIds = new Set(found.map((x) => x.anchor_id))
  const extras = m.extras || []
  const ant = (m.anticipated || []).filter((x) => x.found)

  return {
    ...item,
    anticipated: ant.length,
    anticipatedIds: ant.map((x) => x.anchor_id),
    anchors: all.length,
    found: found.length,
    recall: all.length ? found.length / all.length : null,
    missedIds: all.filter((x) => !x.found).map((x) => x.anchor_id),
    seenIds: all.map((x) => x.anchor_id),
    extrasGrounded: extras.filter((e) => e.grounded).length,
    extrasUngrounded: extras.filter((e) => !e.grounded).length,
    extraSummaries: extras.slice(0, 8).map((e) => `${e.grounded ? 'grounded' : 'ungrounded'}: ${String(e.summary).slice(0, 180)}`),
    review: String(review).slice(0, 2500),
    match_reasoning: m.reasoning || '',
  }
}

phase('Review + match')
const units = []
for (const arm of ARMS)
  for (let rep = 1; rep <= REPS; rep++)
    for (const id of CASE_IDS) units.push({ id, arm, rep })
const rows = (await parallel(units.map((u) => () => runUnit(u)))).filter(Boolean)

const scored = rows.filter((r) => !r.dead)
const mean = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : NaN)
const rnd = (x) => (Number.isFinite(x) ? Math.round(x * 1000) / 1000 : null)
const stdev = (a) => {
  const xs = a.filter(Number.isFinite)
  if (xs.length < 2) return NaN
  const m = mean(xs)
  return Math.sqrt(xs.reduce((s, x) => s + (x - m) ** 2, 0) / (xs.length - 1))
}
const summarize = (sel) => ({
  recall: rnd(mean(sel.map((r) => r.recall).filter(Number.isFinite))),
  recallSd: rnd(stdev(sel.map((r) => r.recall))),
  anchorsSeen: sel.reduce((n, r) => n + (r.anchors || 0), 0),
  anchorsFound: sel.reduce((n, r) => n + (r.found || 0), 0),
  anticipated: rnd(mean(sel.map((r) => r.anticipated || 0))),
  extrasGrounded: rnd(mean(sel.map((r) => r.extrasGrounded))),
  extrasUngrounded: rnd(mean(sel.map((r) => r.extrasUngrounded))),
  n: sel.length,
})

const overall = {}
for (const arm of ARMS) overall[arm] = summarize(scored.filter((r) => r.arm === arm))

const perCase = CASE_IDS.map((id) => {
  const row = { id, anchors: (scored.find((r) => r.id === id) || {}).anchors || null }
  for (const arm of ARMS) {
    const sel = scored.filter((r) => r.id === id && r.arm === arm)
    row[arm] = { recall: rnd(mean(sel.map((r) => r.recall))), anticipated: rnd(mean(sel.map((r) => r.anticipated || 0))), grounded: rnd(mean(sel.map((r) => r.extrasGrounded))), ungrounded: rnd(mean(sel.map((r) => r.extrasUngrounded))) }
  }
  return row
})

// Which specific anchors survive every run: the headroom this instrument found.
const missCount = {}
const seenCount = {}
for (const r of scored) {
  for (const id of (r.missedIds || [])) missCount[id] = (missCount[id] || 0) + 1
  for (const id of (r.seenIds || [])) seenCount[id] = (seenCount[id] || 0) + 1
}
const alwaysMissed = Object.entries(missCount)
  .filter(([id, n]) => n === (seenCount[id] || n))
  .sort((a, b) => b[1] - a[1])
  .map(([id, n]) => ({ id, missedInAllRuns: n }))

log(`Done: ${scored.length}/${units.length} scored; ${rows.filter((r) => r.dead).length} dead.`)

// An anchor the reviewer raised at round N that some earlier-round review
// already reported: recall at its own round understates the skill by this much.
const anticipatedIds = {}
for (const r of scored) for (const id of (r.anticipatedIds || [])) anticipatedIds[id] = (anticipatedIds[id] || 0) + 1

return {
  overall,
  perCase,
  anticipatedIds,
  alwaysMissed,
  missCount,
  dead: rows.filter((r) => r.dead).map((r) => ({ id: r.id, arm: r.arm, rep: r.rep, why: r.dead })),
  rows: rows.map(({ review, ...rest }) => rest),
  reviewsSample: scored.slice(0, 3).map((r) => ({ id: r.id, arm: r.arm, review: r.review })),
}
