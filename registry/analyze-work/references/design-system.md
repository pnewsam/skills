# Design-system metrics

Use the smallest set that can test the repository's actual convergence hypothesis. Record the revision, scope, method, exclusions, and confidence for every reported value. Counts locate investigation candidates; they do not prove that the UI is wrong.

## Contents

- Measurement contract
- Tokens and visual language
- Components and migration
- Patterns, states, and proof
- Change and maintenance signals
- Interpretation and ranking

## Measurement contract

Establish before measuring:

| Field | Record |
| --- | --- |
| Revision and scope | Commit, package/app, routes, component roots, and themes |
| Canonical sources | Token definitions, primitive roots, documented components, and deprecation markers supported by evidence |
| Eligible population | Style declarations, consumers, components, states, or critical surfaces used as the denominator |
| Reachability | Whether a definition is merely present, statically imported, built, or observed at runtime |
| Exclusions | Generated/vendor code, snapshots, fixtures, demos, data visualization, email, third-party embeds, deliberate campaigns, and other justified exceptions |
| Method | Search, parser, dependency graph, component docs, test inventory, or history command that another reviewer can repeat |
| Window | Current revision plus the chosen history or migration interval |
| Confidence | High, medium, or low, with dynamic styling and missing runtime evidence stated explicitly |

Use repository-relative baselines and trends. A value is meaningful only when the eligible population and canonical target are stable enough to compare. Name the counting unit: declaration, token opportunity, consumer, component, state, or surface. A compound declaration such as two-value padding is one declaration but may contain two token opportunities; choose one unit and do not mix them in the same ratio.

## Tokens and visual language

### Semantic-token adoption

```text
eligible declarations using a canonical semantic token
-------------------------------------------------------
all eligible declarations in the measured scope
```

Separate semantic tokens from palette or scale tokens when possible. A component that uses `blue-500` may be on the token system but still bypass the intended semantic role such as `action-primary`.

Report source-defined adoption separately from effective adoption. A tokenized stylesheet that has no proven import or build path demonstrates a defined system, not a consumer receiving that system at runtime.

Report adoption by property family when useful:

- color and surface
- spacing and sizing
- typography
- radius, border, elevation, and motion

Do not combine incomparable declarations into one headline percentage.

### One-off value density

Count normalized raw values or expressions within an eligible property family, then inspect the most repeated and highest-churn examples. Normalize equivalent syntax only when the transformation is reliable.

Exclude values whose variation is intrinsic, including:

- data visualization and user-authored content
- responsive calculations and asset geometry
- third-party integration constraints
- deliberate brand, editorial, email, or campaign surfaces

A raw value is a candidate when a canonical token plausibly expresses the same role. It is not automatically a defect.

### Token duplication and shadowing

Investigate:

- different token names resolving to the same value and role
- one name resolving differently across themes without documented intent
- local variables that shadow a canonical semantic token
- defined tokens with no eligible consumers
- consumer values that recur but have no canonical semantic role

Value equality alone does not prove duplication. Confirm semantic role, theming behavior, and migration intent.

## Components and migration

### Canonical primitive adoption

For one semantic family at a time:

```text
eligible consumers using the canonical primitive
-------------------------------------------------
all eligible consumers implementing that semantic job
```

Examples include buttons, dialogs, fields, tabs, tables, badges, and feedback messages. Classify by user-facing job and behavior, not filename similarity.

### Duplicate component families

Build a family map with:

- semantic job and supported states
- implementation roots and owners
- consumer counts and import paths
- behavioral, responsive, accessibility, and visual differences
- canonical, legacy, experimental, or intentionally specialized status

Two wrappers around the same library are not necessarily duplicates, and two similarly named components may serve different product jobs.

### Legacy migration progress

```text
eligible consumers migrated away from a documented legacy primitive
-------------------------------------------------------------------
all eligible legacy and migrated consumers in the bounded scope
```

Track remaining consumers by risk and ownership. Do not count deleted, generated, test-only, or explicitly exempt consumers unless the migration contract includes them. If legacy and canonical implementations entered in the same available baseline, report current adoption and remaining inventory; do not claim migration progress without an earlier state or explicit target.

### API and variant burden

Use these as inspection signals:

- documented and observed variants
- boolean props whose combinations create distinct modes
- mutually exclusive or invalid prop combinations
- variants with no consumers
- wrappers that rename or partially expose the same primitive API
- caller-specific branches inside shared primitives

Prefer observed consumer behavior over a raw prop count. A broad but coherent primitive can be healthier than several narrow wrappers.

## Patterns, states, and proof

### Applicable state coverage

For a bounded component family or critical surface, inventory applicable states such as:

- default, hover, active, focus-visible, and disabled
- loading, empty, error, success, and destructive confirmation
- validation, help, and read-only states
- mobile, narrow, wide, touch, reduced-motion, and dark/high-contrast themes

Report each state as implemented, documented, tested, intentionally inapplicable, or unknown. Do not divide by a universal state checklist; the denominator must contain only states relevant to that component or surface.

Use the semantic job to establish a starting contract. For an action primitive, inspect native button-or-link semantics, accessible name, keyboard activation, focus visibility, disabled behavior when supported, default form behavior, and the documented visual states. Add touch, responsive, theme, high-contrast, or motion states only when the product and component make them applicable.

### Accessibility behavior

Use existing automated results and focused inspection to corroborate fragmentation:

- semantic role and accessible name
- keyboard interaction and focus management
- error/help association and live-region behavior
- contrast and non-color cues
- reduced-motion and zoom/reflow behavior

Automated issue counts are incomplete and tool-dependent. Treat a verified behavioral difference across nominally equivalent primitives as stronger evidence than a raw audit count.

### Documentation and visual proof

Possible signals:

- canonical components with representative documented variants and states
- critical surfaces covered by stable visual regression checks
- legacy components still presented as preferred examples
- screenshots or stories that disagree with current APIs

Coverage is useful only when the artifact is maintained and exercises the behavior or appearance at risk. Never accept or regenerate visual baselines in analysis mode.

## Change and maintenance signals

Corroborate structural inventory with:

- UI files or component families with repeated visual or accessibility fixes
- co-change between a shared primitive and many consumer overrides
- recurring one-off values introduced in high-churn surfaces
- visual-test churn or repeated baseline updates tied to unstable APIs
- migration files that remain active across the chosen window

Separate the initial introduction of a system from post-baseline churn. Normalize by current size or eligible consumers when comparing unlike scopes, and inspect representative commits before claiming recurrence.

## Interpretation and ranking

Strong candidates combine several signals:

1. verified semantic duplication, drift, or incomplete migration
2. a credible canonical target or clearly bounded design decision
3. meaningful consumer reach or recurring maintenance evidence
4. explicit behavior, visual, responsive, and accessibility invariants
5. a before/after method that can prove convergence without gaming the metric

Prefer the smallest family or surface that demonstrates the benefit. A good candidate says what becomes safer or easier: changing a status color once, fixing keyboard behavior for every dialog, retiring one legacy button API, or removing repeated overrides from a high-churn workflow.

Keep these as unresolved inventory until inspected:

- high raw-value counts with unknown eligibility
- similarly named components with unverified semantic equivalence
- unused exports that may have external consumers
- inconsistent screenshots without a known canonical design
- low adoption when the migration target was never approved
