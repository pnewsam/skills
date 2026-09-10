export const meta = {
  name: 'review-format-ab',
  description: 'review-work OUTPUT-FORMAT A/B: run each arm (control / template) as a review of the cases, then blind-score structural conformance (verdict token, model line, validation section, severity-tagged findings, concise summary) and its across-rep consistency. Arg-driven over review_format_ab_cases.json.',
  phases: [
    { title: 'Review + score' },
  ],
}

// args = the parsed review_format_ab_cases.json, optionally with { reps }.
const CFG = typeof args === 'string' ? JSON.parse(args) : args
const CASES = CFG.cases
const DELTAS = CFG.arm_deltas
const ARMS = Object.keys(DELTAS)
const REPS = CFG.reps || 4

const CONFORM_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    verdict_clear: { type: 'boolean' },
    model_line: { type: 'boolean' },
    validation_section: { type: 'boolean' },
    findings_severity_tagged: { type: 'boolean' },
    summary_concise: { type: 'boolean' },
    reasoning: { type: 'string' },
  },
  required: ['verdict_clear', 'model_line', 'validation_section', 'findings_severity_tagged', 'summary_concise'],
}

const diffText = (c) => (Array.isArray(c.diff) ? c.diff.join('\n') : String(c.diff))

const answerPrompt = (c, arm) => {
  const delta = DELTAS[arm] || ''
  const deltaBlock = delta
    ? `\n\nApply this ADDITIONAL house guidance on top of the skill:\n"""\n${delta}\n"""`
    : ''
  return `You are performing a code review. First read \`registry/review-work/SKILL.md\` and the references it points to (\`references/review-protocol.md\`, \`references/risk.md\`, and \`registry/pr-conventions/references/finding-model.md\`) and internalize them. Do NOT read anything under \`evals/\`, and do NOT read \`registry/review-work/references/review-output.md\`.${deltaBlock}

Review the change below strictly on its own content. Report your findings as the skill and finding model direct, ordered by severity. If there is no supported blocking or major defect, say so plainly. Do not invent findings to appear thorough, and do not withhold a real defect.

INTENT:
${c.intent}

DIFF:
\`\`\`
${diffText(c)}
\`\`\`

Return only your review.`
}

const scorePrompt = (review) => `You are a blind evaluator scoring ONE code review for STRUCTURAL CONFORMANCE ONLY. You do not know which system produced it. Do not judge whether the findings are correct — judge only the presence and shape of the required output elements. For each anchor return a boolean:

- verdict_clear: the review states a single clear overall verdict that is unambiguously one of APPROVE / REQUEST CHANGES / COMMENT (any casing/punctuation), not merely implied by prose.
- model_line: the review explicitly states which model/reviewer produced it (an identifier such as claude-opus-4-8, a model family, or the literal word "unknown" presented as the model). A review that never names its model at all is false.
- validation_section: the review contains a distinct validation/verification section or clearly labeled line stating what was run or inspected (not merely findings).
- findings_severity_tagged: EITHER the review reports no actionable findings AND says so plainly, OR every finding it raises carries an explicit severity label (Blocking/Major/Minor/Nit or equivalent). If any finding lacks a severity tag, false.
- summary_concise: there is a short scope+bottom-line summary of at most ~4 sentences that does not narrate the diff back line by line.

REVIEW:
${review}`

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

const ANCHORS = ['verdict_clear', 'model_line', 'validation_section', 'findings_severity_tagged', 'summary_concise']
const conformFrac = (s) => (s ? ANCHORS.filter((k) => s[k]).length / ANCHORS.length : 0)

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
  if (!review) return { ...item, conform: null, dead: 'degenerate-review' }
  const s = await agent(scorePrompt(review), {
    label: `score:${item.arm}:${item.id}#${item.rep}`,
    phase: 'Review + score',
    schema: CONFORM_SCHEMA,
  })
  if (!s) return { ...item, conform: null, dead: 'no-score' }
  return {
    ...item,
    conform: conformFrac(s),
    anchors: ANCHORS.reduce((o, k) => ((o[k] = !!s[k]), o), {}),
    review: String(review).slice(0, 1600), score_reasoning: s.reasoning || '',
  }
}

phase('Review + score')
const units = []
for (const arm of ARMS)
  for (let rep = 1; rep <= REPS; rep++)
    for (const c of CASES) units.push({ id: c.id, arm, rep })
const rows = (await parallel(units.map((u) => () => runUnit(u)))).filter(Boolean)

const mean = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : NaN)
const stdev = (arr) => {
  if (arr.length < 2) return 0
  const m = mean(arr)
  return Math.sqrt(mean(arr.map((x) => (x - m) ** 2)))
}
const rnd = (x) => (Number.isFinite(x) ? Math.round(x * 1000) / 1000 : null)

// Per arm: overall conformance, across-rep spread, and per-anchor satisfaction rate.
const overall = {}
for (const arm of ARMS) {
  const sel = rows.filter((r) => r.arm === arm && r.conform != null)
  const perAnchor = {}
  for (const k of ANCHORS) perAnchor[k] = rnd(mean(sel.map((r) => (r.anchors[k] ? 1 : 0))))
  overall[arm] = {
    conformance: rnd(mean(sel.map((r) => r.conform))),
    spread: rnd(stdev(sel.map((r) => r.conform))),
    perAnchor,
    n: sel.length,
  }
}

const perCase = CASES.map((c) => {
  const row = { id: c.id }
  for (const arm of ARMS) {
    const sel = rows.filter((r) => r.id === c.id && r.arm === arm && r.conform != null)
    row[arm] = rnd(mean(sel.map((r) => r.conform)))
  }
  return row
})

log(`Done: ${rows.filter((r) => r.conform != null).length}/${units.length} scored across ${ARMS.length} arms x ${CASES.length} cases x ${REPS} reps.`)

const tsv = rows.filter((r) => r.conform != null)
  .map((r) => `${r.id}\t${r.arm}\t${r.rep}\t${r.conform}\t${ANCHORS.map((k) => (r.anchors[k] ? 1 : 0)).join('')}`)
  .join('\n')

return {
  overall,
  perCase,
  gate: CFG.gate,
  dead: rows.filter((r) => r.dead).map((r) => ({ id: r.id, arm: r.arm, rep: r.rep, why: r.dead })),
  scoresTsv: `id\tarm\trep\tconform\tanchors[${ANCHORS.join('|')}]\n${tsv}`,
  rows,
}
