---
name: typescript-types
description: TypeScript type-safety objectives plus the deterministic checks that enforce them — tsc --strict and the @typescript-eslint no-unsafe/no-any rules. Use when writing or reviewing type definitions, modeling data variants, or deciding how to type values. Enforce with the compiler and lint; let the model model the data. For general failure contracts the base model handles it natively.
---

# TypeScript Types — Objectives + Ground-Truth Check

Converted reference (bitter-lesson A/B, 2026-08-17,
`evals/results/2026-08-17-cross-cutting-family.md`): a capable base model already
produces idiomatic discriminated unions, `as const` derivations, `satisfies`,
branded ids, and narrowing without prompting — it tied the old prose skill on
every case. The one residual, durable value was **catching the unsafe escape
hatch the model occasionally reaches for** (`any`, an unsafe `as` cast). That is
mechanically checkable, so it becomes the check; the modeling stays with the model.

## The check (deterministic)

Make the compiler and lint the ground truth instead of eyeballing types:

```
tsc --noEmit            # with "strict": true (noImplicitAny, strictNullChecks,
                        # exactOptionalPropertyTypes) — an unhandled discriminant,
                        # an access before narrowing, or a missing property fails here
```

ESLint (`@typescript-eslint`, type-checked config) is the non-negotiable gate on
the escape hatches:

- `no-explicit-any`
- `no-unsafe-assignment`, `no-unsafe-argument`, `no-unsafe-call`, `no-unsafe-member-access`, `no-unsafe-return`
- `consistent-type-assertions` (flag `as` casts; prefer annotation/narrowing)
- `switch-exhaustiveness-check` (every discriminated union is handled)

Treat every hit as a defect. `any` → `unknown` + narrow; `as X` → a type guard or
an annotation on the assignee; a non-exhaustive switch → handle the variant or add
a `never` check. "It compiled" is not the bar; "it passes strict + no-unsafe" is.

## The objectives (what well-typed code satisfies)

State these as requirements; the model applies them and the check verifies the
mechanical ones:

- **Invalid states are unrepresentable.** Model variant data as a discriminated
  union keyed on a literal discriminant, each variant carrying only its own data —
  not one interface with mutually-exclusive optional fields.
- **No lying to the compiler.** No `any`; narrow from `unknown` with type guards
  rather than asserting with `as` — verified by the check.
- **One source of truth.** Derive types from values (`as const` + `typeof`/`keyof`,
  `satisfies`) so the value and its literal type cannot drift.
- **Distinct domains are distinct types.** Where mixing them is a real bug (ids,
  units), use a branded/nominal type so a wrong-domain value is a compile error at
  no runtime cost.
- **Exhaustiveness is enforced**, not assumed — a new variant should fail to
  compile until it is handled.

## Defer to the model (specify intent, then verify)

Do not hand-maintain worked examples of every pattern here; the model produces
them. Give it the data shape and the invariant you want, let it model the types,
then run `tsc --strict` + the no-unsafe lint to confirm it did not reach for an
escape hatch. For failure contracts (throw vs result, cause chaining) and async
control flow, the base model handles those natively — there is no separate skill.
