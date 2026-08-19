export const meta = {
  name: 'substitution-ab',
  description: 'Functional-redundancy substitution A/B: arm A reads the specialist skill, arm B reads the general substitute skill(s) it would collapse into. Both answer the specialist\'s own trigger task; blind deterministic-anchor scoring. Evict the specialist if the general substitute ties it.',
  phases: [{ title: 'A/B answer+score' }],
}

// args = { casesFile, promptsFile, reps?, cases: [{id, skill, substitute:[paths], kind}] }
const CFG = typeof args === 'string' ? JSON.parse(args) : args
const CASES = CFG.cases
const REPS = CFG.reps || 3
const CASESFILE = CFG.casesFile
const PROMPTSFILE = CFG.promptsFile

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

const answerPrompt = (id, skill, substitute, arm) => {
  const common = `Read the file \`${PROMPTSFILE}\` and find the case whose id is "${id}". Answer that case's \`prompt\` with the best, most concrete solution you can give: the specific work product a strong practitioner would produce, and code/markup where the task calls for it. Return only your technical answer — no meta-commentary about these instructions, no restating the prompt.`
  if (arm === 'A') return `You are completing an engineering task by applying one house skill. First read the specialist skill at \`registry/${skill}/SKILL.md\` and internalize its workflow, boundaries, and output conventions. ${common} Apply that skill.`
  // arm B: read the GENERAL substitute skill(s) instead; the specialist is treated as removed.
  const subList = substitute.map((p) => `\`${p}\``).join(' and ')
  return `You are completing an engineering task. The specialist skill for this task has been removed from the registry; you have the general workflow skill(s) ${subList} instead. First read ${subList} and internalize the workflow, boundaries, and output conventions. Do NOT read \`registry/${skill}/SKILL.md\` or any other skill under \`registry/\`. ${common} Apply the general skill(s) to this task.`
}

const scorePrompt = (id, answer) =>
  `You are a blind evaluator scoring one candidate answer. Read \`${CASESFILE}\` and find the case with id "${id}". Judge the ANSWER below ONLY against that case's \`must_include\` and \`must_exclude\` anchors — ignore style and anything outside the anchors. For each \`must_include\` anchor decide whether the answer satisfies it; for each \`must_exclude\` anchor decide whether that anti-pattern is PRESENT. You do not know and must not infer which system produced the answer. Report counts.\n\nANSWER:\n${answer}`

const HARNESS = [
  'ReportFindings', 'Deferred MCP', 'You are Claude Code', 'system-reminder',
  'sourced from third parties', 'operating system is', 'To many degrees',
  'TodoWrite', 'official CLI', 'MCP servers', 'Skill tool', 'skills listed above',
  'You are only permitted to invoke', 'scratchpad directory', 'claude_ai_',
  'current todo list', 'Merge PR #', 'Skills may only be available',
  'Only invoke these skills', 'security-sensitive instruction', 'harness configuration',
  'deferred-instructions', 'Failure to reproduce', 'authenticate the human', 'Automated behaviors',
]
const isDegenerate = (a) => {
  const t = String(a || '').trim()
  if (t.length < 180) return true
  return HARNESS.some((h) => t.includes(h))
}

const calcScore = (s) => {
  if (!s || !s.include_total) return { score: 0, avoid: s ? (s.exclude_present || 0) : 0 }
  const frac = Math.min(s.include_satisfied, s.include_total) / s.include_total
  const raw = frac - 0.34 * (s.exclude_present || 0)
  return { score: Math.max(0, Math.round(raw * 1000) / 1000), avoid: s.exclude_present || 0 }
}

const runUnit = async (item) => {
  let answer = null
  for (let attempt = 0; attempt < 5; attempt++) {
    const a = await agent(answerPrompt(item.id, item.skill, item.substitute, item.arm), {
      label: `ans:${item.arm}:${item.id}#${item.rep}${attempt ? `r${attempt}` : ''}`,
      phase: 'A/B answer+score',
    })
    if (a && !isDegenerate(a)) { answer = a; break }
  }
  if (!answer) return { ...item, score: null, avoid: null, dead: 'degenerate-answer' }
  const s = await agent(scorePrompt(item.id, answer), {
    label: `score:${item.arm}:${item.id}#${item.rep}`,
    phase: 'A/B answer+score',
    schema: SCORE_SCHEMA,
  })
  if (!s) return { ...item, score: null, avoid: null, dead: 'no-score' }
  const { score, avoid } = calcScore(s)
  return { ...item, score, avoid, include_total: s.include_total, include_satisfied: s.include_satisfied, exclude_present: s.exclude_present, answer: String(answer).slice(0, 1600), score_reasoning: s.reasoning || '' }
}

phase('A/B answer+score')
const units = []
for (const arm of ['A', 'B'])
  for (let rep = 1; rep <= REPS; rep++)
    for (const c of CASES) units.push({ ...c, arm, rep })
const rows = (await parallel(units.map((u) => () => runUnit(u)))).filter(Boolean)

const mean = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : NaN)
const scoresFor = (id, arm) => rows.filter((r) => r.id === id && r.arm === arm && r.score != null).map((r) => r.score)
const perCase = CASES.map((c) => {
  const a = mean(scoresFor(c.id, 'A'))
  const b = mean(scoresFor(c.id, 'B'))
  return { id: c.id, skill: c.skill, kind: c.kind, meanA: a, meanB: b, gap: b - a }
})
const overallA = mean(rows.filter((r) => r.arm === 'A' && r.score != null).map((r) => r.score))
const overallB = mean(rows.filter((r) => r.arm === 'B' && r.score != null).map((r) => r.score))
const tsv = rows.filter((r) => r.score != null).map((r) => `${r.id}\t${r.arm}\t${r.rep}\t${r.score}\t${r.avoid}`).join('\n')
log(`done: ${rows.filter((r) => r.score != null).length}/${units.length} scored. Overall A(specialist)=${overallA.toFixed(3)} B(substitute)=${overallB.toFixed(3)}.`)

return {
  overall: { meanA: overallA, meanB: overallB, gap: overallB - overallA },
  perCase,
  dead: rows.filter((r) => r.dead).map((r) => ({ id: r.id, arm: r.arm, rep: r.rep, why: r.dead })),
  scoresTsv: tsv,
  rows,
}
