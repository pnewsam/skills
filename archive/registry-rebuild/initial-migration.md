# Registry rebuild

Implemented from the agreed first-principles design: one record per independently reviewable outcome, six operations, three orchestration skills, eight runbooks, and three references. Five optional maintenance/project/external packages remain outside the general profile. No client install or prune command is performed. Existing symlink installations reflect source changes immediately; retired entries may be dangling until explicitly migrated.

## Work contract

The agent owns an ordinary task. Operations are independently callable and can continue within existing authorization. The work record carries outcome, scope, acceptance, context, candidate/evidence, requested endpoint, and remaining work. Existing issues and feature plans remain valid; do not duplicate or mass-migrate them. Each initiative coordinates several records and normally several PRs.

## Disposition of all 70 previous active packages

Retired packages are in `archive/registry-rebuild/` for reversible history, never discoverable by the installer. Existing archive families remain historical. Extracted resources are conditional; retired knowledge families are not repackaged wholesale. No active alias skills remain.

| Previous skill | Disposition |
| --- | --- |
| `add-browser-test` | execute-work browser test resource |
| `advance-epic` | ship-epic (entry point deleted) |
| `analyze-design-system` | analyze-work design-system resource |
| `analyze-quality` | analyze-work quality resource |
| `analyze-security` | analyze-work security resource |
| `async-patterns` | Delete entry point; no replacement required |
| `compliance-accessibility` | Delete entry point; retain only applicable constraint anchors in plan-work |
| `compliance-auditability` | Delete entry point; retain only applicable constraint anchors in plan-work |
| `compliance-expert` | Delete entry point; no replacement required |
| `compliance-gdpr` | Delete entry point; retain only applicable constraint anchors in plan-work |
| `compliance-hipaa` | Delete entry point; retain only applicable constraint anchors in plan-work |
| `compliance-privacy` | Delete entry point; retain only applicable constraint anchors in plan-work |
| `compliance-security` | Delete entry point; retain only applicable constraint anchors in plan-work |
| `compliance-vulnerability-management` | Delete entry point; retain only applicable constraint anchors in plan-work |
| `consult-expert` | Delete entry point; no replacement required |
| `create-charter` | shape-initiative charter resource |
| `create-issue` | Retain; revise contract and dependencies |
| `create-project` | Retain; revise contract and dependencies |
| `design-explore` | Retain; revise contract and dependencies |
| `diagnose-failure` | Retain; revise contract and dependencies |
| `document-architecture` | execute-work architecture resource |
| `emil-design-eng` | Retain optional package |
| `error-handling` | Delete entry point; no replacement required |
| `execute-feature` | execute-work |
| `explore-directions` | shape-initiative |
| `fix-browser-test` | execute-work browser test resource |
| `harden-pr` | review-work + execute-work (entry point deleted) |
| `ingest-skill` | Retain optional package |
| `mindsdb-migrate-surface-to-tailwind` | Retain optional package |
| `mindsdb-track-design-system-metrics` | Retain optional package |
| `plan-browser-tests` | analyze-work browser coverage resource |
| `plan-epic` | Retain; revise contract and dependencies |
| `plan-feature` | plan-work |
| `platform-ci-cd` | Delete entry point; retain only applicable constraint anchors in plan-work |
| `platform-deployments-rollbacks` | Delete entry point; retain only applicable constraint anchors in plan-work |
| `platform-environments` | Delete entry point; retain only applicable constraint anchors in plan-work |
| `platform-expert` | Delete entry point; no replacement required |
| `platform-infrastructure-as-code` | Delete entry point; retain only applicable constraint anchors in plan-work |
| `platform-secrets-config` | Delete entry point; retain only applicable constraint anchors in plan-work |
| `polish-issue` | Delete entry point; no replacement required |
| `pr-conventions` | Retain; revise contract and dependencies |
| `prepare-pr` | Retain; revise contract and dependencies |
| `review-pr` | review-work |
| `ship-epic` | Retain; revise contract and dependencies |
| `stash` | preserve-work |
| `svg-animations` | Retain optional package |
| `threat-model` | Retain; revise contract and dependencies |
| `trim-comments` | Delete entry point; no replacement required |
| `typescript-types` | Delete entry point; no replacement required |
| `ui-actions` | Delete entry point; no replacement required |
| `ui-color` | validate-work contrast checker |
| `ui-content` | Delete entry point; no replacement required |
| `ui-data-viz` | Delete entry point; no replacement required |
| `ui-depth` | Delete entry point; no replacement required |
| `ui-email` | Delete entry point; no replacement required |
| `ui-expert` | Delete entry point; no replacement required |
| `ui-feedback` | Delete entry point; no replacement required |
| `ui-forms` | Delete entry point; no replacement required |
| `ui-icons` | Delete entry point; no replacement required |
| `ui-layouts` | Delete entry point; no replacement required |
| `ui-onboarding` | Delete entry point; no replacement required |
| `ui-patterns` | Delete entry point; no replacement required |
| `ui-responsive` | Delete entry point; no replacement required |
| `ui-spacing` | validate-work spacing checker |
| `ui-typography` | Delete entry point; no replacement required |
| `update-pr` | Retain; revise contract and dependencies |
| `validate-changes` | validate-work |
| `validate-feature` | validate-work |
| `visual-hierarchy` | Delete entry point; no replacement required |
| `writing-conventions` | Retain; revise contract and dependencies |

## Migration and installation

Use the new profiles and dependency-aware installer described in the README. Legacy profile names with changed meaning are removed rather than silently expanded. Source changes do not remove old client copies or dangling symlinks; inspect installed state before removing retired entries, preserving user-owned modifications. Reinstall the selected new profile into a clean destination or explicitly replace only intended entries. No automatic global cleanup is performed.

Current known records under `docs/features/` and `docs/epics/` remain accepted. A old feature containing several independently deliverable outcomes can be split when next worked, preserving identity links and completed evidence. Previously delivered PRs and historical evaluation reports are not rewritten.

## Validation

Package/resource checks and installer tests establish structural integrity, not model quality. Behavioral scenarios and execution evidence are recorded under `evals/`; historical retention scores do not establish performance of the new operations. Compare completion, scope, evidence freshness, unnecessary questions, recovery, time, and context against both the previous registry and a minimal baseline.

## Completion evidence

See [the rebuild validation report](../evals/results/2026-09-05-registry-rebuild.md) for structural checks, installation verification, independent trials, baseline comparisons, consumer-review fixes, and remaining evidence limitations.
