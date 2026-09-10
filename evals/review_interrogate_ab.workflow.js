export const meta = {
  name: 'review-interrogate-ab',
  description: 'fan-out interrogate A/B: control = one single-pass review (session model); interrogate = 3 independent reviewers on different model families (opus/sonnet/haiku) reconciled by a lead. Blind-score recall/precision against anchors on HARD cases with single-pass headroom. Arg-driven.',
  phases: [
    { title: 'Review' },
    { title: 'Reconcile' },
    { title: 'Score' },
  ],
}

// args = { cases, reps?, models? }
const CFG = typeof args === 'string' ? JSON.parse(args) : args
const CASES = CFG.cases
const REPS = CFG.reps || 3
const MODELS = CFG.models || ['opus', 'sonnet', 'haiku'] // interrogate reviewer families
const ARMS = ['control', 'interrogate']

const SCORE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    include_total: { type: 'integer' },
    include_satisfied: { type: 'integer' },
    exclude_present: { type: 'integer' },
    reasoning: { type: 'string' },
  },
  required: ['include_total', 'include_satisfied', 'exclude_present'],
}

const diffText = (c) => (Array.isArray(c.diff) ? c.diff.join('\n') : String(c.diff))

const reviewPrompt = (c) => `You are performing a code review. First read \`registry/review-work/SKILL.md\` and the references it points to (\`references/review-protocol.md\`, \`references/review-output.md\`, \`references/risk.md\`, and \`registry/pr-conventions/references/finding-model.md\`) and internalize them. Do NOT read anything under \`evals/\`.

Review the change below strictly on its own content. Report each supported finding with its severity, the concrete failing input/state/path, and why it matters, ordered by severity. If there is no supported blocking or major defect, say so plainly. Do not invent findings to appear thorough, and do not withhold a real defect.

INTENT:
${c.intent}

DIFF:
\`\`\`
${diffText(c)}
\`\`\`

Return only your review.`

const reconcilePrompt = (c, reviews) => `You are the lead reconciling ${reviews.length} independent code reviews of the same diff, each from a different model. Produce ONE consolidated review. Apply \`registry/pr-conventions/references/finding-model.md\`: keep only findings the evidence supports; raise confidence on a finding independently raised by more than one reviewer; DROP any finding a reviewer cannot ground in the diff or that another reviewer refutes. Refutation counts as much as extension — do not simply union everything. Order findings by severity; if nothing is supported, say so plainly.

INTENT:
${c.intent}

DIFF:
\`\`\`
${diffText(c)}
\`\`\`

INDEPENDENT REVIEWS:
${reviews.map((r, i) => `--- reviewer ${i + 1} ---\n${r}`).join('\n\n')}

Return only the consolidated review.`

const scorePrompt = (c, review) => {
  const inc = c.must_include.map((s, i) => `  I${i + 1}. ${s}`).join('\n')
  const exc = (c.must_exclude || []).map((s, i) => `  E${i + 1}. ${s}`).join('\n')
  return `You are a blind evaluator scoring one code review. You do not know which system produced it. Judge the REVIEW below ONLY against the anchors.

REAL-DEFECT anchors (a good review reports these):
${inc}

NON-DEFECT / NOISE anchors (a good review should NOT raise these; mark present only if raised above nit and not explicitly declined):
${exc || '  (none)'}

Report:
- include_total = ${c.must_include.length}
- include_satisfied = how many REAL-DEFECT anchors the review reports.
- exclude_present = how many NON-DEFECT anchors the review wrongly raises.

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
  if (t.length < 120) return true
  return HARNESS.some((h) => t.includes(h))
}

const oneReview = async (c, opts) => {
  for (let attempt = 0; attempt < 4; attempt++) {
    const a = await agent(reviewPrompt(c), opts)
    if (a && !isDegenerate(a)) return a
  }
  return null
}

const calcScore = (s) => {
  if (!s || !s.include_total) return { score: 0, incFrac: 0, avoid: s ? (s.exclude_present || 0) : 0 }
  const incFrac = Math.min(s.include_satisfied, s.include_total) / s.include_total
  const raw = incFrac - 0.34 * (s.exclude_present || 0)
  return { score: Math.max(0, Math.round(raw * 1000) / 1000), incFrac, avoid: s.exclude_present || 0 }
}

const runUnit = async (item) => {
  const c = CASES.find((x) => x.id === item.id)
  let review = null
  let modelsUsed = []
  if (item.arm === 'control') {
    review = await oneReview(c, { label: `rev:control:${c.id}#${item.rep}`, phase: 'Review' })
    modelsUsed = ['session']
  } else {
    const revs = await parallel(MODELS.map((m) => () =>
      oneReview(c, { label: `rev:interrogate:${c.id}#${item.rep}:${m}`, phase: 'Review', model: m })
        .then((r) => (r ? { m, r } : null))))
    const good = revs.filter(Boolean)
    modelsUsed = good.map((x) => x.m)
    if (good.length >= 2) {
      review = await agent(reconcilePrompt(c, good.map((x) => x.r)), {
        label: `reconcile:${c.id}#${item.rep}`, phase: 'Reconcile', model: 'opus',
      })
    } else if (good.length === 1) {
      review = good[0].r // degraded: only one reviewer survived
    }
  }
  if (!review || isDegenerate(review)) return { ...item, score: null, dead: 'no-review', modelsUsed }
  const s = await agent(scorePrompt(c, review), {
    label: `score:${item.arm}:${c.id}#${item.rep}`, phase: 'Score', schema: SCORE_SCHEMA,
  })
  if (!s) return { ...item, score: null, dead: 'no-score', modelsUsed }
  const { score, incFrac, avoid } = calcScore(s)
  return {
    ...item, score, incFrac, avoid, modelsUsed,
    include_total: s.include_total, include_satisfied: s.include_satisfied, exclude_present: s.exclude_present,
    review: String(review).slice(0, 1400),
  }
}

phase('Review')
const units = []
for (const arm of ARMS)
  for (let rep = 1; rep <= REPS; rep++)
    for (const c of CASES) units.push({ id: c.id, targets: c.targets, arm, rep })
const rows = (await parallel(units.map((u) => () => runUnit(u)))).filter(Boolean)

const mean = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : NaN)
const rnd = (x) => (Number.isFinite(x) ? Math.round(x * 1000) / 1000 : null)

const overall = {}
for (const arm of ARMS) {
  const sel = rows.filter((r) => r.arm === arm && r.score != null)
  overall[arm] = {
    recall: rnd(mean(sel.map((r) => r.incFrac))),
    falsePositives: rnd(mean(sel.map((r) => r.avoid))),
    score: rnd(mean(sel.map((r) => r.score))),
    n: sel.length,
  }
}

const perCase = CASES.map((c) => {
  const row = { id: c.id, targets: c.targets }
  for (const arm of ARMS) {
    const sel = rows.filter((r) => r.id === c.id && r.arm === arm && r.score != null)
    row[arm] = { recall: rnd(mean(sel.map((r) => r.incFrac))), fp: rnd(mean(sel.map((r) => r.avoid))), n: sel.length }
  }
  return row
})

log(`Done: ${rows.filter((r) => r.score != null).length}/${units.length} scored. interrogate models: ${MODELS.join('/')}`)

const tsv = rows.filter((r) => r.score != null)
  .map((r) => `${r.id}\t${(r.targets || []).join(',')}\t${r.arm}\t${r.rep}\t${r.incFrac}\t${r.exclude_present}\t${r.score}\t${(r.modelsUsed || []).join('+')}`)
  .join('\n')

return {
  overall,
  perCase,
  gate: CFG.gate,
  models: MODELS,
  dead: rows.filter((r) => r.dead).map((r) => ({ id: r.id, arm: r.arm, rep: r.rep, why: r.dead })),
  scoresTsv: `id\ttargets\tarm\trep\tinclude_frac\texclude_present\tscore\tmodels\n${tsv}`,
  rows,
}
