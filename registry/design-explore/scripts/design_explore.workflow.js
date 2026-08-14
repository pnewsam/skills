// design_explore.workflow.js — generate-and-judge over visual-design directions.
// Run with: Workflow({ scriptPath: "<this file>", args: { brief, criteria?, n? } })
// args.brief: string design brief. args.criteria: optional string[]. args.n: directions (default 4).
export const meta = {
  name: 'design-explore',
  description: 'Generate N distinct design directions, judge them against criteria, synthesize',
  phases: [
    { title: 'Generate', detail: 'N independent, deliberately distinct directions' },
    { title: 'Judge', detail: 'score each direction against each criterion' },
    { title: 'Synthesize', detail: 'assemble a recommendation from the best moves' },
  ],
}

const A = typeof args === 'string' ? JSON.parse(args) : (args || {})
const brief = A.brief || 'Design a clean, modern UI for the described product.'
const N = A.n || 4
const criteria = A.criteria || [
  'audience fit', 'mood/personality', 'information hierarchy',
  'restraint/clarity', 'brand fit', 'accessibility',
]

const SCORE_SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: {
    scores: { type: 'array', items: { type: 'object', additionalProperties: false,
      properties: { criterion: { type: 'string' }, score: { type: 'number' }, note: { type: 'string' } },
      required: ['criterion', 'score'] } },
  },
  required: ['scores'],
}

// 1. Generate N deliberately distinct directions, in parallel so they don't converge.
phase('Generate')
const angles = ['dense/utilitarian', 'airy/editorial', 'bold/expressive', 'calm/minimal', 'playful/tactile', 'classic/trustworthy']
const directions = (await parallel(
  Array.from({ length: N }, (_, i) => () =>
    agent(
      `Design brief:\n${brief}\n\nPropose ONE visual-design direction committed to a "${angles[i % angles.length]}" organizing idea — distinct from the obvious default. Specify: overall concept in one line, palette (with hex), type treatment, spacing/density, layout structure, and the signature move that makes it feel intentional. Be concrete. Output only the direction.`,
      { label: `dir:${i}:${angles[i % angles.length]}`, phase: 'Generate', agentType: 'general-purpose' },
    ).then(text => ({ i, angle: angles[i % angles.length], text })),
  )
)).filter(Boolean).filter(d => d.text && d.text.trim())

// 2. Judge each direction against all criteria (independent scoring; keep the splits).
phase('Judge')
const judged = await parallel(directions.map(d => () =>
  agent(
    `Score this design direction against each criterion 0..1 for the brief.\n\nBrief:\n${brief}\n\nDirection (${d.angle}):\n"""\n${d.text}\n"""\n\nCriteria: ${criteria.join(', ')}. Judge strictly; note the standout strength or weakness per criterion.`,
    { label: `judge:${d.i}`, phase: 'Judge', schema: SCORE_SCHEMA },
  ).then(r => {
    const s = (r?.scores || [])
    const total = s.reduce((a, b) => a + (b.score || 0), 0) / (s.length || 1)
    return { ...d, scores: s, total: +total.toFixed(3) }
  })
)).then(xs => xs.filter(Boolean).sort((a, b) => b.total - a.total))

// 3. Synthesize from the winner, grafting the best moves from the rest.
phase('Synthesize')
const digest = judged.map(d => `#${d.i} (${d.angle}) total=${d.total}\n${d.text}`).join('\n\n---\n\n')
const recommendation = await agent(
  `You are the design lead. From these judged directions, recommend ONE final direction: take the highest-scoring as the base and graft the specific stronger moves from the runners-up. State the base, exactly what you borrowed and from which, and why. Then list the ground-truth checks to run before build (contrast via ui-color's check, spacing via ui-spacing's lint).\n\nOutput ONLY the final recommendation — no preamble, no "let me…", no meta-commentary, no restating the task.\n\n${digest}`,
  { label: 'synthesize', phase: 'Synthesize' },
)

return {
  brief, criteria,
  ranked: judged.map(d => ({ i: d.i, angle: d.angle, total: d.total })),
  recommendation,
  directions: judged,
}
