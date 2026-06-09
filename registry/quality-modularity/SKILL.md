---
name: quality-modularity
description: Modularity principles for language-agnostic code quality. Use when assessing cohesion, coupling, responsibility boundaries, dependency direction, abstractions, module seams, ownership, and change isolation. Pair with stack experts for framework-specific file and module conventions.
---

# Quality Modularity

Modular code localizes change. A good boundary makes related changes happen together and unrelated changes stay apart.

## Principles

### 1. One Reason To Change

A module, class, component, or service should have a coherent responsibility. Split when one unit changes for unrelated reasons, such as UI layout, persistence, validation, and business rules all changing independently.

Do not split merely because a file is long. Split when responsibilities pull in different directions.

### 2. High Cohesion, Low Coupling

Prefer modules where:

- Most functions use the same domain concepts.
- Public APIs are smaller than private implementation.
- Callers do not know internal data shape unnecessarily.
- Changes inside the module rarely force changes outside it.

### 3. Dependencies Point Toward Stable Concepts

Volatile details should depend on stable abstractions, not the reverse. UI, HTTP, CLI, database, and vendor SDK details should not leak into domain rules unless the application is intentionally thin.

### 4. Hide Volatility Behind Boundaries

Create boundaries around things likely to change:

- External services and SDKs.
- Persistence details.
- Transport protocols.
- Complex business policies.
- Time, randomness, environment, and configuration.

### 5. Avoid Premature Abstraction

Duplication is cheaper than the wrong abstraction. Introduce an abstraction when it removes repeated decision logic or isolates real volatility, not when two blocks merely look similar.

## Smells

- Shotgun surgery: one change requires many small edits across unrelated files.
- Feature envy: a function reaches through another module's data to do its work.
- God object/module: one unit coordinates too many responsibilities.
- Leaky abstraction: callers must understand internal state, ordering, or storage details.
- Circular dependency: two modules cannot be understood or tested independently.

## Review Checks

- What responsibility does this boundary own?
- What changes would force this boundary to change?
- Can the important behavior be tested without unrelated infrastructure?
- Are dependencies flowing toward stable policy and away from volatile mechanisms?
