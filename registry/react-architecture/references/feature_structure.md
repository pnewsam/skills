# React feature structure

Use this reference for folders, feature boundaries, public APIs, shared code,
imports, and incremental migration.

## A practical shape

Adapt names to the repository:

```text
src/
  app/             # startup, providers, shell, global routing
  routes/          # route composition when the framework uses route modules
  features/
    checkout/
      components/
      hooks/
      model/
      api/
      tests/
      index.ts
  domain/          # neutral business concepts shared across features
  platform/        # HTTP, storage, telemetry, vendor adapters
  ui/              # reusable design-system primitives
```

The directory names are less important than clear ownership and enforced import
direction.

## Feature boundaries

A feature represents a user or business capability, not a technical category.
Colocate its UI, state, data access, tests, and internal types when they change
together.

Expose a narrow entrypoint. Consumers should not import deep internal paths
unless the repository deliberately treats them as public contracts.

Consider splitting a feature when it has:

- multiple independent owners
- unrelated release cadence
- conflicting dependency needs
- a public surface too broad to explain

Do not split merely to keep files below an arbitrary count.

## Shared code

Promote code only after its stable responsibility is understood.

Good shared candidates:

- design-system primitives
- domain value objects with neutral ownership
- platform adapters
- pure formatting or parsing with explicit contracts

Poor shared candidates:

- feature-specific components with configurable labels
- convenience hooks that hide product behavior
- a `utils` directory with unrelated functions
- abstractions created in anticipation of a second use

## Imports

Use lint or build rules when the architecture depends on import boundaries.
Typical rules:

- features may depend on domain, platform contracts, and UI primitives
- shared layers must not depend on product features
- one feature should not reach into another feature's internals
- application composition may depend on feature public entrypoints

Barrel files should define a deliberate public surface. Avoid repository-wide
barrels that create cycles, obscure source ownership, or undermine tree shaking.

## Migration

Move one coherent slice at a time:

1. define its future public API
2. add boundary checks where practical
3. move implementation without changing behavior
4. update consumers to the public API
5. validate and remove the old path
6. make behavioral improvements separately

Use temporary compatibility exports only with an owner and removal condition.
Keep tests passing at each step so structural migration does not mask defects.
