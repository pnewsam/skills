# Select proof by changed surface

| Surface | Useful proof |
| --- | --- |
| Behavior/API | Focused regression, negative cases, contract and relevant integration tests |
| Shared library/type API | Consumer/type checks and affected downstream behavior |
| Tests only | Execute changed tests; confirm assertions exercise the intended behavior and fail on the relevant regression |
| Configuration/CI | Parse/validate config, exercise affected command or pipeline behavior, inspect privileges and triggers where relevant |
| Manifest/lockfile | Verify resolution consistency, affected imports/build/runtime, relevant dependency/security evidence |
| Schema/migration | Apply in disposable state, check compatibility/data preservation and recovery expectations |
| Infrastructure | Provider/project validation or plan, policy checks, and scoped health evidence without applying unrequested changes |
| Documentation | Verify factual claims, examples, links, generated output or rendering where material |
| UI | Changed interaction states, keyboard/semantics, relevant viewports and actual rendered artifacts |
| Generated artifacts | Reproduce from source where practical and verify consumers; do not dismiss generated changes automatically |

Use the repository's configured commands. Proof scales with consequence and shared dependencies, not file-count thresholds. Required CI/integration boundaries remain due even when focused checks pass. A non-browser project does not need a missing-browser-suite warning.

Compare results with baseline evidence when failures may predate the change. Do not exclude failures merely because someone labels them pre-existing; confirm the classification and explain its impact on acceptance. Required unavailable evidence remains unverified. Run only the scope the user authorized when they explicitly constrain validation.
