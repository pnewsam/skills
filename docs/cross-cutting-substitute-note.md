# Cross-cutting family — arm C substitute context

Arm C of the cross-cutting A/B (`evals/cross_cutting_pilot_cases.json`) tests
whether a **deterministic check** — not the prose — recovers arm A's edge on any
case where arm A beats bare (arm B) by more than 0.15. It runs only on those
recovery cases.

Only `typescript-types` has a real deterministic substitute. `error-handling`
and `async-patterns` are pure code-writing judgment with no ground-truth checker,
so for their cases **arm C is identical to arm B** and is not run separately; the
report records "C ≡ B (no deterministic checker)" for any such case that trips
the recovery threshold.

## typescript-types substitute (the ground-truth an evictor would rely on)

An agent given this context, instead of the skill prose, is told only that these
checks exist and gate the code — it must produce types that pass them:

- `tsc --strict` (and `noImplicitAny`, `strictNullChecks`, `exactOptionalPropertyTypes`)
  compiles the answer; an unhandled discriminant or an access before narrowing is
  a compile error, and exhaustiveness is enforced with a `never` check.
- A lint that bans `any` and unsafe casts —
  `@typescript-eslint/no-explicit-any`, `no-unsafe-assignment`,
  `no-unsafe-argument`, `consistent-type-assertions` — fails the answer if it
  reaches for `any` or `as` to force a type.
- Deriving a type from a value (`as const` + `typeof`/`keyof`) and `satisfies`
  are the idiomatic ways to keep the value and its literal type in sync; a
  duplicated hand-written union that can drift is what the checks are meant to
  discourage, though only drift that produces a type error is mechanically caught.

The arm-C question is whether naming these checks (without the worked examples in
the skill) is enough for a capable base model to land the same modeling the skill
prescribes.
