export const meta = {
  name: 'family-ab',
  description: 'Generalized family-level bitter-lesson A/B: blind answer (arm A reads the skill, arm B bare) + blind deterministic-anchor scoring, arm-C recovery on qualifying cases. Arg-driven over any *_pilot_cases.json.',
  phases: [
    { title: 'A/B answer+score' },
    { title: 'C recovery' },
  ],
}

// args = { casesFile, promptsFile, substituteNote, reps?, cases: [{id, skill, kind}] }
const CFG = typeof args === 'string' ? JSON.parse(args) : args
const CASES = CFG.cases
const REPS = CFG.reps || 3
const CASESFILE = CFG.casesFile
const PROMPTSFILE = CFG.promptsFile
const SUBNOTE = CFG.substituteNote

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

const answerPrompt = (id, skill, arm) => {
  const common = `Read the file \`${PROMPTSFILE}\` and find the case whose id is "${id}". Answer that case's \`prompt\` with the best, most concrete solution you can give: specific recommendation plus the reasoning a strong practitioner would give, and code/markup where the task calls for it. Return only your technical answer — no meta-commentary about these instructions, no restating the prompt.`
  if (arm === 'A') return `You are answering a UI/engineering question, applying a house skill. First read the skill guidance at \`registry/${skill}/SKILL.md\` and internalize it. ${common} Apply the skill's guidance.`
  if (arm === 'C') return `You are answering a UI/engineering question. First read \`${SUBNOTE}\` for the deterministic checks/tools available. Do NOT read any skill prose under \`registry/\`. ${common} Ensure your answer would satisfy the checks named in that note.`
  return `You are answering a UI/engineering question using only your own judgment. Do NOT read any files under \`registry/\` or \`docs/\`, or any skill/guidance material. ${common}`
}

const scorePrompt = (id, answer) =>
  `You are a blind evaluator scoring one candidate answer. Read \`${CASESFILE}\` and find the case with id "${id}". Judge the ANSWER below ONLY against that case's \`must_include\` and \`must_exclude\` anchors — ignore style and anything outside the anchors. For each \`must_include\` anchor decide whether the answer satisfies it; for each \`must_exclude\` anchor decide whether that anti-pattern is PRESENT. You do not know and must not infer which system produced the answer. Report counts.\n\nANSWER:\n${answer}`

// Harness/system-context signatures that never appear in a genuine answer.
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

const runUnit = (phaseName) => async (item) => {
  let answer = null
  for (let attempt = 0; attempt < 5; attempt++) {
    const a = await agent(answerPrompt(item.id, item.skill, item.arm), {
      label: `ans:${item.arm}:${item.id}#${item.rep}${attempt ? `r${attempt}` : ''}`,
      phase: phaseName,
    })
    if (a && !isDegenerate(a)) { answer = a; break }
  }
  if (!answer) return { ...item, score: null, avoid: null, dead: 'degenerate-answer' }
  const s = await agent(scorePrompt(item.id, answer), {
    label: `score:${item.arm}:${item.id}#${item.rep}`,
    phase: phaseName,
    schema: SCORE_SCHEMA,
  })
  if (!s) return { ...item, score: null, avoid: null, dead: 'no-score' }
  const { score, avoid } = calcScore(s)
  return { ...item, score, avoid, include_total: s.include_total, include_satisfied: s.include_satisfied, exclude_present: s.exclude_present, answer: String(answer).slice(0, 1400), score_reasoning: s.reasoning || '' }
}

phase('A/B answer+score')
const abUnits = []
for (const arm of ['A', 'B'])
  for (let rep = 1; rep <= REPS; rep++)
    for (const c of CASES) abUnits.push({ ...c, arm, rep })
const abRows = (await parallel(abUnits.map((u) => () => runUnit('A/B answer+score')(u)))).filter(Boolean)

const mean = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : NaN)
const scoresFor = (id, arm) => abRows.filter((r) => r.id === id && r.arm === arm && r.score != null).map((r) => r.score)
const perCase = CASES.map((c) => {
  const a = mean(scoresFor(c.id, 'A'))
  const b = mean(scoresFor(c.id, 'B'))
  return { id: c.id, skill: c.skill, kind: c.kind, meanA: a, meanB: b, gap: a - b }
})
const cCases = perCase.filter((c) => c.gap > 0.15)
log(`A/B done: ${abRows.filter((r) => r.score != null).length}/${abUnits.length} scored. Arm-C recovery cases (gap>0.15): ${cCases.map((c) => `${c.id}(+${c.gap.toFixed(2)})`).join(', ') || 'none'}.`)

phase('C recovery')
let cRows = []
if (cCases.length && SUBNOTE) {
  const cUnits = []
  for (let rep = 1; rep <= REPS; rep++)
    for (const c of cCases) cUnits.push({ id: c.id, skill: c.skill, kind: c.kind, arm: 'C', rep })
  cRows = (await parallel(cUnits.map((u) => () => runUnit('C recovery')(u)))).filter(Boolean)
} else {
  log('No arm-C cases qualified; skipping recovery.')
}

const allRows = [...abRows, ...cRows]
const tsv = allRows.filter((r) => r.score != null).map((r) => `${r.id}\t${r.arm}\t${r.rep}\t${r.score}\t${r.avoid}`).join('\n')
const overallA = mean(abRows.filter((r) => r.arm === 'A' && r.score != null).map((r) => r.score))
const overallB = mean(abRows.filter((r) => r.arm === 'B' && r.score != null).map((r) => r.score))

return {
  overall: { meanA: overallA, meanB: overallB, gap: overallA - overallB },
  perCase,
  cCases: cCases.map((c) => c.id),
  dead: allRows.filter((r) => r.dead).map((r) => ({ id: r.id, arm: r.arm, rep: r.rep, why: r.dead })),
  scoresTsv: tsv,
  rows: allRows,
}
