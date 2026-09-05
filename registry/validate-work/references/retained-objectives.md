# Evidence-backed corrective objectives

The August 17 retention trials found two residual benefits worth preserving after retiring the larger knowledge skills. These are focused checks, not instructions to install a new toolchain or enforce unrelated work.

## TypeScript safety

For TypeScript changes, use the repository's compiler and configured type-aware lint to verify narrowing, exhaustive variants, and unsafe escape hatches. Check applicable `no-explicit-any`, `no-unsafe-*`, `consistent-type-assertions`, and `switch-exhaustiveness-check` rules where configured. A compile pass alone does not prove that unsafe assertions or `any` were avoided. Record missing relevant checks; do not silently claim strict/no-unsafe validation. `exactOptionalPropertyTypes` is a separate compiler option, not implied by `strict`.

## Collection completeness

Evaluate a collection at its expected size, not only with a small fixture: search/filter access, pagination or loading strategy, usable density, empty/loading/overflow states, and shareable and clearable filtered/sorted state when relevant. Derive acceptance from actual data and user tasks, not universal item-count thresholds. Choosing a sensible table/card/list container is not evidence that these scale requirements hold.
