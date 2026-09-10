export const meta = {
  name: 'review-ab',
  description: 'review-work quality A/B: run each arm (control / +exclusion / +design) as a blind review of planted-defect diffs, then blind-score recall (real defects found) and precision (noise baits wrongly raised). Arg-driven over review_ab_pilot_cases.json.',
  phases: [
    { title: 'Review + score' },
  ],
}

// args = the parsed review_ab_pilot_cases.json, optionally with { reps }.
// Pass it in the Workflow call: args = <contents of evals/review_ab_pilot_cases.json> (add "reps": 3 if desired).
const CFG = typeof args === 'string' ? JSON.parse(args) : args
const CASES = CFG.cases
const DELTAS = CFG.arm_deltas
const ARMS = Object.keys(DELTAS)          // e.g. ['control','exclusion','design']
const REPS = CFG.reps || 3

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

const answerPrompt = (c, arm) => {
  const delta = DELTAS[arm] || ''
  const deltaBlock = delta
    ? `\n\nApply this ADDITIONAL house guidance on top of the skill:\n"""\n${delta}\n"""`
    : ''
  return `You are performing a code review. First read \`registry/review-work/SKILL.md\` and the references it points to (\`references/review-protocol.md\`, \`references/risk.md\`, and \`registry/pr-conventions/references/finding-model.md\`) and internalize them. Do NOT read anything under \`evals/\`.${deltaBlock}

Review the change below strictly on its own content. Report your findings exactly as the skill and finding model direct: each supported finding with its severity, the concrete failing input/state/path, and why it matters, ordered by severity. If there is no supported blocking or major defect, say so plainly. Do not invent findings to appear thorough, and do not withhold a real defect.

INTENT:
${c.intent}

DIFF:
\`\`\`
${diffText(c)}
\`\`\`

Return only your review.`
}

const scorePrompt = (c, review) => {
  const inc = c.must_include.map((s, i) => `  I${i + 1}. ${s}`).join('\n')
  const exc = (c.must_exclude || []).map((s, i) => `  E${i + 1}. ${s}`).join('\n')
  return `You are a blind evaluator scoring one code review. You do not know and must not infer which system produced it. Judge the REVIEW below ONLY against the anchors.

REAL-DEFECT anchors (should be reported by a good review) — for each, decide whether the review reports it:
${inc}

NON-DEFECT / NOISE anchors (a good review should NOT raise these as findings) — for each, decide whether the review DOES raise it as a finding (mark present if raised at any severity above nit; a review that explicitly declines to raise it is NOT present):
${exc || '  (none)'}

Report:
- include_total = number of REAL-DEFECT anchors (${c.must_include.length}).
- include_satisfied = how many REAL-DEFECT anchors the review reports.
- exclude_present = how many NON-DEFECT anchors the review wrongly raises as findings.

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

const calcScore = (s) => {
  if (!s || !s.include_total) return { score: 0, incFrac: 0, avoid: s ? (s.exclude_present || 0) : 0 }
  const incFrac = Math.min(s.include_satisfied, s.include_total) / s.include_total
  const raw = incFrac - 0.34 * (s.exclude_present || 0)
  return { score: Math.max(0, Math.round(raw * 1000) / 1000), incFrac, avoid: s.exclude_present || 0 }
}

const runUnit = async (item) => {
  const c = CASES.find((x) => x.id === item.id)
  let review = null
  for (let attempt = 0; attempt < 5; attempt++) {
    const a = await agent(answerPrompt(c, item.arm), {
      label: `rev:${item.arm}:${item.id}#${item.rep}${attempt ? `r${attempt}` : ''}`,
      phase: 'Review + score',
    })
    if (a && !isDegenerate(a)) { review = a; break }
  }
  if (!review) return { ...item, score: null, dead: 'degenerate-review' }
  const s = await agent(scorePrompt(c, review), {
    label: `score:${item.arm}:${item.id}#${item.rep}`,
    phase: 'Review + score',
    schema: SCORE_SCHEMA,
  })
  if (!s) return { ...item, score: null, dead: 'no-score' }
  const { score, incFrac, avoid } = calcScore(s)
  return {
    ...item, score, incFrac, avoid,
    include_total: s.include_total, include_satisfied: s.include_satisfied, exclude_present: s.exclude_present,
    review: String(review).slice(0, 1600), score_reasoning: s.reasoning || '',
  }
}

phase('Review + score')
const units = []
for (const arm of ARMS)
  for (let rep = 1; rep <= REPS; rep++)
    for (const c of CASES) units.push({ id: c.id, targets: c.targets, arm, rep })
const rows = (await parallel(units.map((u) => () => runUnit(u)))).filter(Boolean)

const mean = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : NaN)
const rnd = (x) => (Number.isFinite(x) ? Math.round(x * 1000) / 1000 : null)

// Per (arm,target) recall (include-fraction) and false-positive count (exclude_present).
const TARGETS = [...new Set(CASES.flatMap((c) => c.targets))]
const byTarget = {}
for (const t of TARGETS) {
  byTarget[t] = {}
  for (const arm of ARMS) {
    const sel = rows.filter((r) => r.arm === arm && r.score != null && (r.targets || []).includes(t))
    byTarget[t][arm] = {
      recall: rnd(mean(sel.map((r) => r.incFrac))),
      falsePositives: rnd(mean(sel.map((r) => r.avoid))),
      score: rnd(mean(sel.map((r) => r.score))),
      n: sel.length,
    }
  }
}

// Per-case per-arm, for inspection.
const perCase = CASES.map((c) => {
  const row = { id: c.id, targets: c.targets }
  for (const arm of ARMS) {
    const sel = rows.filter((r) => r.id === c.id && r.arm === arm && r.score != null)
    row[arm] = { recall: rnd(mean(sel.map((r) => r.incFrac))), fp: rnd(mean(sel.map((r) => r.avoid))) }
  }
  return row
})

const overall = {}
for (const arm of ARMS) {
  const sel = rows.filter((r) => r.arm === arm && r.score != null)
  overall[arm] = { recall: rnd(mean(sel.map((r) => r.incFrac))), falsePositives: rnd(mean(sel.map((r) => r.avoid))), score: rnd(mean(sel.map((r) => r.score))) }
}

log(`Done: ${rows.filter((r) => r.score != null).length}/${units.length} scored across ${ARMS.length} arms x ${CASES.length} cases x ${REPS} reps.`)

const tsv = rows.filter((r) => r.score != null)
  .map((r) => `${r.id}\t${(r.targets || []).join(',')}\t${r.arm}\t${r.rep}\t${r.incFrac}\t${r.exclude_present}\t${r.score}`)
  .join('\n')

return {
  overall,
  byTarget,
  perCase,
  gate: CFG.gate,
  dead: rows.filter((r) => r.dead).map((r) => ({ id: r.id, arm: r.arm, rep: r.rep, why: r.dead })),
  scoresTsv: `id\ttargets\tarm\trep\tinclude_frac\texclude_present\tscore\n${tsv}`,
  rows,
}
