---
name: quality-code-clarity
description: Code clarity principles for language-agnostic maintainability. Use when improving naming, readability, local reasoning, control flow, comments, intention-revealing structure, and removal of clever or surprising code. Pair with stack experts for idiomatic implementation details.
---

# Quality Code Clarity

Code is clear when a maintainer can understand what it does, why it exists, and what would break if it changed without reconstructing the whole system.

## Principles

### 1. Make Intent Visible

- Prefer names that describe domain meaning, not mechanics.
- Name booleans as predicates: `isEligible`, `hasPermission`, `shouldRetry`.
- Name side-effecting functions with verbs: `sendInvoice`, `persistUser`, `emitMetric`.
- Avoid vague names like `data`, `item`, `manager`, `handler`, and `process` unless the scope makes them obvious.

### 2. Optimize For Local Reasoning

Good code lets the reader answer:

- What inputs matter?
- What output or side effect occurs?
- What can fail?
- Which invariants are assumed?

Move hidden dependencies into parameters, constructors, or explicit context. Avoid functions that depend on distant mutable state.

### 3. Prefer Straight-Line Control Flow

- Handle exceptional or invalid cases early.
- Keep the main path visually obvious.
- Avoid deeply nested conditionals.
- Replace complex boolean expressions with named predicates.

### 4. Remove Cleverness

Clever code compresses writing effort into reading effort. Prefer explicit steps when the compressed version hides branching, mutation, or non-obvious type behavior.

Use compact expressions only when they preserve intent.

### 5. Comment The Why

Comments should explain constraints, trade-offs, protocol details, and surprising choices. Do not comment what the next line mechanically does.

Good comments usually start from:

- "We do this because..."
- "This cannot be..."
- "Keep this in sync with..."
- "This handles..."

## Review Checks

- Can a new maintainer identify the primary path in under a minute?
- Are names domain-specific enough to survive extraction?
- Are hidden assumptions named?
- Is the code boring where it can be boring?
- Would a smaller helper or named predicate reduce mental stack?
