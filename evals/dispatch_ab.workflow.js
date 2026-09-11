export const meta = {
  name: 'dispatch-ab',
  description: 'in-unit subagent dispatch A/B: each arm (control / +dispatch-conventions / +trim) composes the dispatch package for a controller situation, then a blind evaluator scores it against good-dispatch anchors and anti-pattern anchors. Objective prompt size is measured in-script. Arg-driven over dispatch_ab_cases.json.',
  phases: [
    { title: 'Compose + score' },
  ],
}

// args = the parsed dispatch_ab_cases.json, optionally with { reps }.
// Pass it in the Workflow call: args = <contents of evals/dispatch_ab_cases.json> (add "reps": 3 if desired).
const CFG = typeof args === 'string' ? JSON.parse(args) : args
const CASES = CFG.cases
const DELTAS = CFG.arm_deltas
const ARMS = Object.keys(DELTAS)          // ['control','dispatch','trim']
const REPS = CFG.reps || 2

const DISPATCH_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    dispatches: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          covers: { type: 'string' },
          model: { type: 'string' },
          prompt: { type: 'string' },
        },
        required: ['covers', 'model', 'prompt'],
      },
    },
    notes: { type: 'string' },
  },
  required: ['dispatches'],
}

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

const materialText = (c) => (Array.isArray(c.material) ? c.material.join('\n\n') : String(c.material || ''))

const answerPrompt = (c, arm) => {
  const delta = DELTAS[arm] || ''
  const deltaBlock = delta
    ? `\n\nApply this ADDITIONAL house guidance on top of those skills:\n"""\n${delta}\n"""`
    : ''
  return `You are the controller of one unit of work, executing a plan by dispatching worker subagents. First read \`registry/work-conventions/SKILL.md\`, \`registry/fan-out/SKILL.md\`, \`registry/ship-epic/SKILL.md\`, and \`registry/ship-epic/references/coordination.md\`, and internalize them. Do NOT read anything under \`evals/\`.${deltaBlock}

SITUATION:
${c.situation}

MATERIAL AVAILABLE TO YOU:
${materialText(c)}

Compose the dispatch package you would actually send right now. For each dispatch, give what it covers, the model you are dispatching it on, and the full prompt text verbatim as the worker would receive it — not a description of the prompt. Decide how many dispatches to send. Use \`notes\` only for decisions you made that are not visible in the prompts themselves.

Return only the dispatch package.`
}

const renderPackage = (pkg) => {
  const ds = (pkg && pkg.dispatches) || []
  const body = ds.map((d, i) => `--- DISPATCH ${i + 1} ---\nCOVERS: ${d.covers}\nMODEL: ${d.model}\nPROMPT:\n${d.prompt}`).join('\n\n')
  return `NUMBER OF DISPATCHES: ${ds.length}\n\n${body}${pkg && pkg.notes ? `\n\n--- CONTROLLER NOTES ---\n${pkg.notes}` : ''}`
}

const scorePrompt = (c, rendered) => {
  const inc = c.must_include.map((s, i) => `  I${i + 1}. ${s}`).join('\n')
  const exc = (c.must_exclude || []).map((s, i) => `  E${i + 1}. ${s}`).join('\n')
  return `You are a blind evaluator scoring one subagent dispatch package produced by a controller. You do not know and must not infer which system produced it. Judge the PACKAGE below ONLY against the anchors, on what the package actually does — not on whether it reads well.

SITUATION THE CONTROLLER FACED:
${c.situation}

GOOD-DISPATCH anchors (a good package shows these) — for each, decide whether the package shows it:
${inc}

ANTI-PATTERN anchors (a good package does NOT do these) — for each, decide whether the package does it:
${exc || '  (none)'}

Report:
- include_total = number of GOOD-DISPATCH anchors (${c.must_include.length}).
- include_satisfied = how many GOOD-DISPATCH anchors the package shows.
- exclude_present = how many ANTI-PATTERN anchors the package exhibits.

PACKAGE:
${rendered}`
}

const HARNESS = [
  'ReportFindings', 'Deferred MCP', 'You are Claude Code', 'system-reminder',
  'scratchpad directory', 'claude_ai_', 'official CLI', 'MCP servers', 'Skill tool',
  'You are only permitted to invoke', 'harness configuration', 'TodoWrite',
]
const isDegenerate = (pkg) => {
  const ds = (pkg && pkg.dispatches) || []
  if (!ds.length) return true
  const t = ds.map((d) => String(d.prompt || '')).join('\n')
  if (t.trim().length < 200) return true
  return HARNESS.some((h) => t.includes(h))
}

const runUnit = async (item) => {
  const c = CASES.find((x) => x.id === item.id)
  let pkg = null
  for (let attempt = 0; attempt < 4; attempt++) {
    const a = await agent(answerPrompt(c, item.arm), {
      label: `disp:${item.arm}:${item.id}#${item.rep}${attempt ? `r${attempt}` : ''}`,
      phase: 'Compose + score',
      schema: DISPATCH_SCHEMA,
    })
    if (a && !isDegenerate(a)) { pkg = a; break }
  }
  if (!pkg) return { ...item, score: null, dead: 'degenerate-package' }

  const rendered = renderPackage(pkg)
  const chars = pkg.dispatches.reduce((n, d) => n + String(d.prompt || '').length, 0)
  const named = pkg.dispatches.filter((d) => {
    const m = String(d.model || '').trim().toLowerCase()
    return m && !['', 'default', 'unspecified', 'inherit', 'session default', 'n/a', 'none'].includes(m)
  }).length

  const s = await agent(scorePrompt(c, rendered), {
    label: `score:${item.arm}:${item.id}#${item.rep}`,
    phase: 'Compose + score',
    schema: SCORE_SCHEMA,
  })
  if (!s) return { ...item, score: null, dead: 'no-score' }

  const incFrac = s.include_total ? Math.min(s.include_satisfied, s.include_total) / s.include_total : 0
  return {
    ...item,
    incFrac,
    avoid: s.exclude_present || 0,
    dispatches: pkg.dispatches.length,
    chars,
    modelNamedFrac: pkg.dispatches.length ? named / pkg.dispatches.length : 0,
    include_total: s.include_total,
    include_satisfied: s.include_satisfied,
    exclude_present: s.exclude_present,
    score: Math.max(0, Math.round((incFrac - 0.34 * (s.exclude_present || 0)) * 1000) / 1000),
    score_reasoning: s.reasoning || '',
    package: rendered.slice(0, 2000),
  }
}

phase('Compose + score')
const units = []
for (const arm of ARMS)
  for (let rep = 1; rep <= REPS; rep++)
    for (const c of CASES) units.push({ id: c.id, targets: c.targets, arm, rep })
const rows = (await parallel(units.map((u) => () => runUnit(u)))).filter(Boolean)

const mean = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : NaN)
const rnd = (x) => (Number.isFinite(x) ? Math.round(x * 1000) / 1000 : null)
const summarize = (sel) => ({
  recall: rnd(mean(sel.map((r) => r.incFrac))),
  antiPatterns: rnd(mean(sel.map((r) => r.avoid))),
  score: rnd(mean(sel.map((r) => r.score))),
  dispatches: rnd(mean(sel.map((r) => r.dispatches))),
  chars: rnd(mean(sel.map((r) => r.chars))),
  modelNamed: rnd(mean(sel.map((r) => r.modelNamedFrac))),
  n: sel.length,
})

const scored = rows.filter((r) => r.score != null)

const overall = {}
for (const arm of ARMS) overall[arm] = summarize(scored.filter((r) => r.arm === arm))

const TARGETS = [...new Set(CASES.flatMap((c) => c.targets))]
const byTarget = {}
for (const t of TARGETS) {
  byTarget[t] = {}
  for (const arm of ARMS) byTarget[t][arm] = summarize(scored.filter((r) => r.arm === arm && (r.targets || []).includes(t)))
}

const perCase = CASES.map((c) => {
  const row = { id: c.id, targets: c.targets }
  for (const arm of ARMS) {
    const sel = scored.filter((r) => r.id === c.id && r.arm === arm)
    row[arm] = { recall: rnd(mean(sel.map((r) => r.incFrac))), anti: rnd(mean(sel.map((r) => r.avoid))), chars: rnd(mean(sel.map((r) => r.chars))), dispatches: rnd(mean(sel.map((r) => r.dispatches))) }
  }
  return row
})

log(`Done: ${scored.length}/${units.length} scored across ${ARMS.length} arms x ${CASES.length} cases x ${REPS} reps.`)

const tsv = scored
  .map((r) => `${r.id}\t${(r.targets || []).join(',')}\t${r.arm}\t${r.rep}\t${rnd(r.incFrac)}\t${r.exclude_present}\t${r.dispatches}\t${r.chars}\t${rnd(r.modelNamedFrac)}\t${r.score}`)
  .join('\n')

return {
  overall,
  byTarget,
  perCase,
  gate: CFG.gate,
  dead: rows.filter((r) => r.dead).map((r) => ({ id: r.id, arm: r.arm, rep: r.rep, why: r.dead })),
  scoresTsv: `id\ttargets\tarm\trep\tinclude_frac\texclude_present\tdispatches\tchars\tmodel_named\tscore\n${tsv}`,
  rows,
}
