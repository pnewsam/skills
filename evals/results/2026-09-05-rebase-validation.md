# Rebase validation and preservation record

## Candidate and scope

Reconcile the rebuild at `97fbcb7` with main at `4c34770`, incorporating the 50 intervening commits. The original rebuild is retained at `codex/rebuild-before-main-rebase`. Current package decisions and their rationale are in [the migration record](../../docs/registry-rebuild.md).

The resulting registry contains 19 active packages: 17 general (six operations, three orchestration skills, five runbooks, three references) and two optional MindsDB packages. Unified publication and focused rebase mechanics survive. Review context, attribution, convergence, inbound feedback, and measurement reruns retain explicit owners. Previously evicted standalone packages stay evicted.

## Preservation audit

- Compared 310 upstream archive, result, and fixture files byte-for-byte with main; all preserved. The archive index is intentionally updated for the new dispositions.
- Compared all 62 upstream evaluation assets outside the intentionally migrated evaluation README/current routing definitions; all preserved, including harnesses and scorecards.
- Preserved the upstream scorer exclusion fix and tracked CLI binary unchanged.
- Archived the fourteen newly retired active packages at their latest main contents. Existing family archives retain their original paths; old versions are not duplicated over them.
- Read the intervening decision history and PR workflow changes. Mapped important behavior into the new owners, including the latest issue-rationale and system-context review changes.
- Added six routing/scope definitions for rebase preservation and concurrency, contextual review, bounded review-and-fix, existing-PR code publication, and retained TypeScript/collection objectives.

## Current integration checks

- Registry validator: 19 packages, zero errors, zero warnings; 58 scenario definitions structurally valid.
- Python integrity tests: 4 passed.
- Node capture-helper tests: 6 passed after relocation to validate-work; complete capture cleanup and partial-output failure remain covered.
- PNG comparison helper self-test: round trip passed, one changed pixel detected out of six.
- Go tests: all passed with `go test -count=1 ./...` and a writable temporary cache. CI now also uses `-count=1` to avoid reusing test results after catalog-only changes.
- Built the installer and copied core (10 packages) and general (17 packages) into fresh temporary destinations. Verified required dependency closure and each declared resource's exact bytes against the source.
- Prose wrapping: two existing advisory warnings in unchanged MindsDB reference documents.

The earlier behavioral smoke comparisons and real-browser captures remain historical evidence for their recorded candidate. The six new scenario definitions have not been run as model trials; this rebase does not claim new comparative quality, token, or latency results. No client installation or tracker was changed. Remote PR state and CI are reported separately when the rebased branch is published.
