export const meta = {
  name: 'cross-cutting-ab',
  description: 'Family-level A/B for the cross-cutting method trio (typescript-types, error-handling, async-patterns): blind answer+score across arms A/B, then arm-C recovery on qualifying cases.',
  phases: [
    { title: 'A/B answer+score' },
    { title: 'C recovery' },
  ],
}

// Cases mirror evals/cross_cutting_pilot_cases.json (id/skill/kind only; prompts
// and anchors are read from files by the agents so nothing is re-transcribed here).
const CASES = [
  { id: 'tt-state-discriminated-union', skill: 'typescript-types', kind: 'canonical' },
  { id: 'tt-derive-from-value', skill: 'typescript-types', kind: 'canonical' },
  { id: 'tt-branded-id', skill: 'typescript-types', kind: 'openjudgment' },
  { id: 'tt-discriminated-fetch-response', skill: 'typescript-types', kind: 'openjudgment' },
  { id: 'eh-exception-vs-null', skill: 'error-handling', kind: 'canonical' },
  { id: 'eh-preserve-cause', skill: 'error-handling', kind: 'canonical' },
  { id: 'eh-retry-vs-permanent', skill: 'error-handling', kind: 'openjudgment' },
  { id: 'eh-typed-result-pipeline', skill: 'error-handling', kind: 'openjudgment' },
  { id: 'ap-search-stale-result', skill: 'async-patterns', kind: 'canonical' },
  { id: 'ap-bounded-parallelism', skill: 'async-patterns', kind: 'canonical' },
  { id: 'ap-fire-and-forget-unhandled', skill: 'async-patterns', kind: 'openjudgment' },
  { id: 'ap-timeout-race', skill: 'async-patterns', kind: 'openjudgment' },
]
const REPS = 3

const SCORE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    include_total: { type: 'integer', description: 'number of must_include anchors for this case' },
    include_satisfied: { type: 'integer', description: 'how many must_include anchors the answer satisfies' },
    exclude_present: { type: 'integer', description: 'how many must_exclude anti-patterns are present in the answer' },
    reasoning: { type: 'string', description: 'one sentence per anchor decision' },
  },
  required: ['include_total', 'include_satisfied', 'exclude_present'],
}

const answerPrompt = (id, skill, arm) => {
  const common = `Read the file \`evals/fixtures/cross_cutting_prompts.json\` and find the case whose id is "${id}". Answer that case's \`prompt\` with the best, most idiomatic TypeScript/JavaScript solution: give the actual types/code plus a brief justification. Return only your technical answer (code + short rationale) — no meta-commentary about these instructions.`
  if (arm === 'A') {
    return `You are answering a technical code question, applying a house skill. First read the skill guidance at \`registry/${skill}/SKILL.md\` and internalize its principles. ${common} Apply the skill's guidance in your answer.`
  }
  if (arm === 'C') {
    return `You are answering a technical code question. First read \`docs/cross-cutting-substitute-note.md\` for the deterministic checks your answer must satisfy. Do NOT read any skill prose under \`registry/\`. ${common} Make sure your answer would pass the checks named in the substitute note.`
  }
  // arm B — bare capable model
  return `You are answering a technical code question using only your own engineering judgment. Do NOT read any files under \`registry/\` or \`docs/\`, or any skill/guidance material. ${common}`
}

const scorePrompt = (id, answer) =>
  `You are a blind evaluator scoring one candidate answer to a coding question. Read \`evals/cross_cutting_pilot_cases.json\` and find the case with id "${id}". Judge the ANSWER below ONLY against that case's \`must_include\` and \`must_exclude\` anchors — ignore prose style and anything outside the anchors. For each \`must_include\` anchor, decide whether the answer satisfies it. For each \`must_exclude\` anchor, decide whether that anti-pattern is PRESENT in the answer. You do not know and must not try to infer which system produced this answer. Report the counts.\n\nANSWER:\n${answer}`

// per-rep 0-1 score: (fraction of must_include satisfied) - 0.34 * (must_exclude present), floored at 0
const calcScore = (s) => {
  if (!s || !s.include_total) return { score: 0, avoid: s ? (s.exclude_present || 0) : 0 }
  const frac = Math.min(s.include_satisfied, s.include_total) / s.include_total
  const raw = frac - 0.34 * (s.exclude_present || 0)
  return { score: Math.max(0, Math.round(raw * 1000) / 1000), avoid: s.exclude_present || 0 }
}

// A degenerate answer is harness boilerplate / system-prompt leakage, not a real
// attempt. Detect and retry so a flaky subagent never contaminates a score cell.
// Harness/system-context signatures that never appear in a genuine coding answer.
// Any occurrence => the subagent leaked its context instead of answering.
const HARNESS = [
  'ReportFindings', 'Deferred MCP', 'You are Claude Code', 'system-reminder',
  'sourced from third parties', 'operating system is', 'To many degrees',
  'TodoWrite', 'official CLI for Claude', 'MCP servers', 'Skill tool',
  'skills listed above', 'You are only permitted to invoke', 'scratchpad directory',
  'claude_ai_', 'current todo list', 'Merge PR #', 'Skills may only be available',
  'Only invoke these skills', 'Skill tool available',
]
const isDegenerate = (a) => {
  const t = String(a || '').trim()
  if (t.length < 180) return true
  if (HARNESS.some((h) => t.includes(h))) return true
  if (!t.includes('```') && t.length < 600) return true
  return false
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

// ---- A/B arms ----
phase('A/B answer+score')
const abUnits = []
for (const arm of ['A', 'B'])
  for (let rep = 1; rep <= REPS; rep++)
    for (const c of CASES) abUnits.push({ ...c, arm, rep })

const abRows = (await parallel(abUnits.map((u) => () => runUnit('A/B answer+score')(u)))).filter(Boolean)

// ---- decide arm-C recovery cases: A - B > 0.15, and only typescript-types has a real substitute ----
const mean = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : NaN)
const scoresFor = (id, arm) => abRows.filter((r) => r.id === id && r.arm === arm && r.score != null).map((r) => r.score)
const perCase = CASES.map((c) => {
  const a = mean(scoresFor(c.id, 'A'))
  const b = mean(scoresFor(c.id, 'B'))
  return { id: c.id, skill: c.skill, kind: c.kind, meanA: a, meanB: b, gap: a - b }
})
const cCases = perCase.filter((c) => c.gap > 0.15 && c.skill === 'typescript-types')
const cSkippedNoChecker = perCase.filter((c) => c.gap > 0.15 && c.skill !== 'typescript-types')
log(`A/B done: ${abRows.filter((r) => r.score != null).length}/${abUnits.length} rows scored. Arm-C recovery cases (tt, gap>0.15): ${cCases.map((c) => c.id).join(', ') || 'none'}. Non-tt cases over threshold (C≡B, not run): ${cSkippedNoChecker.map((c) => c.id).join(', ') || 'none'}.`)

// ---- arm C ----
phase('C recovery')
let cRows = []
if (cCases.length) {
  const cUnits = []
  for (let rep = 1; rep <= REPS; rep++)
    for (const c of cCases) cUnits.push({ id: c.id, skill: c.skill, kind: c.kind, arm: 'C', rep })
  cRows = (await parallel(cUnits.map((u) => () => runUnit('C recovery')(u)))).filter(Boolean)
} else {
  log('No arm-C cases qualified; skipping recovery phase.')
}

// ---- emit a ready-to-write scores.tsv body ----
const allRows = [...abRows, ...cRows]
const tsv = allRows
  .filter((r) => r.score != null)
  .map((r) => `${r.id}\t${r.arm}\t${r.rep}\t${r.score}\t${r.avoid}`)
  .join('\n')

const overallA = mean(abRows.filter((r) => r.arm === 'A' && r.score != null).map((r) => r.score))
const overallB = mean(abRows.filter((r) => r.arm === 'B' && r.score != null).map((r) => r.score))

return {
  overall: { meanA: overallA, meanB: overallB, gap: overallA - overallB },
  perCase,
  cCases: cCases.map((c) => c.id),
  cSkippedNoChecker: cSkippedNoChecker.map((c) => c.id),
  dead: allRows.filter((r) => r.dead).map((r) => ({ id: r.id, arm: r.arm, rep: r.rep, why: r.dead })),
  scoresTsv: tsv,
  rows: allRows,
}
