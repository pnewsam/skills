> Historical pre-rebase validation of commit 97fbcb7. The active registry and PR have since been reconciled with main; see [rebase validation](2026-09-05-rebase-validation.md). The counts and behavior claims below describe the original candidate only.

# Registry rebuild validation

## Implemented scope

The active registry now contains twenty general skills (six operations, three orchestration skills, eight runbooks, three references) and five optional packages. Fifty-four old entry points are archived and nine new entry points are added: 70 → 25 active packages. Entrypoint text is 10,593 → 2,120 lines, including preserved external bodies; this is an inventory measure, not a measured token or quality improvement.

The catalog declares layers, scopes, possible effects, required package dependencies, conditional skill routes, and resources. CLI profile and individual selections close required dependencies without installing optional routes. Existing client directories were not installed into or pruned. Symlink installations reflect source edits, so retired links may need an explicit client migration.

## Structural and executable checks

- `python3 scripts/validate_registry.py`: 25 active packages, 0 errors, 3 warnings; 52 routing/scope case definitions validated. The warnings are unchanged properties of preserved external packages (entrypoint length and missing default prompts). This command does not run the 52 scenarios.
- `python3 -m unittest discover -s scripts -p 'test_*.py'`: 4 tests pass, covering dependency closure, optional-route exclusion, cycles/missing dependencies, cross-package resources, and retired routes.
- `node --test tests/*.test.mjs`: 6 tests pass, covering actual source identities, inventory-only status, unavailable-browser failure, no stale output overwrite, invalid/missing candidate rejection, cleanup after a complete capture, and rejection of incomplete image output.
- `GOCACHE=/private/tmp/registry-rebuild-go-cache go test ./...` from cli/: all packages pass. The first run's tests passed but Go could not trim its default sandboxed cache; the writable-cache run completed with exit 0.
- Built the CLI and installed core (11 packages) and general (20 packages) into fresh temporary directories. Checked all required dependencies and every declared resource's bytes against the source; no optional package entered general.
- `git diff --check`: passes. Prose check has two existing hard-wrap advisories in project-specific reference documents; their content was not reflowed just for this migration.

## Behavioral smoke comparisons

Fresh agents used disposable copies of equivalent base fixtures. Actual actions, commands, effects, candidate identities and limitations are recorded in the linked reports. User intent overrides older skill instructions where it explicitly conflicts.

| Scenario | Previous registry | New registry | Minimal agent |
| --- | --- | --- | --- |
| Small bug, no plan, unrelated draft, uncommitted endpoint | Fixed and verified; accepted equivalent bounded criteria, no plan question | Fixed and verified, unrelated draft preserved, no commit or plan ceremony | Fixed and verified, unrelated draft preserved, no commit |
| Config-only candidate with a runtime-invalid value | Old validation instruction stopped before running checks | Parsing passed; runtime acceptance failed; stale baseline rejected; no repair | Runtime acceptance failed; no repair |
| Resume initiative with blocked prerequisite and independent unit | Not compared | Independent unit completed locally; dependent unit and overall integration remained incomplete | Not compared |

Reports: [new trials](2026-09-05-rebuild-work-trials.md), [previous registry](2026-09-05-rebuild-prior-baseline.md), [minimal agent](2026-09-05-rebuild-minimal-baseline.md), [machine observations](2026-09-05-rebuild-observations.json). Base fixtures are preserved under ../fixtures/work-rebuild/ for reruns.

The comparison supports removing the old configuration exclusion. It does not establish that the operation framework beats the minimal agent generally. No latency or token savings were measured. The epic's external prerequisite was explicitly simulated; local Git, implementation, checks, and record updates were real. No live PR creation, merge, tracker mutation, or external write recovery was exercised.

## Independent consumer review

[Final review](2026-09-05-rebuild-final-review.md) identified six supported issues; all were resolved and rechecked. Fixes made GitHub target resolution action-aware, removed unrequested project-runbook publication, corrected effects/dependency closure, required authorized screenshot hosting, and made issue associations neutral rather than automatic closure instructions.

## Rendered artifact verification

Two self-contained HTML candidates were captured with actual headless Chrome and visually inspected: [compact](rebuild-render/compact.png), [editorial](rebuild-render/editorial.png). Their [manifest](rebuild-render/initial-manifest.json) records source and screenshot hashes. Source pages are preserved beside the images. Initial restricted-process captures failed and were truthfully marked unrendered; the permitted fresh-profile run captured both.

The supplied white/dark-blue pair measured 14.69:1 with the retained contrast checker; this checks that supplied pair, not full accessibility. Comparing a capture with itself using the retained PNG helper produced UNCHANGED with 0 differing pixels. The old special-runtime generation/judgment workflow is archived; the new runbook explicitly renders before judging and re-renders synthesis.

A first synthesis capture timed out and was reported as unrendered even though Chrome had written an image: the temporary browser stayed running. The helper now recognizes complete PNG output, stops its own temporary browser, and retains a bounded 60-second timeout for missing output. Regression tests cover both a browser that stays running after a complete capture and incomplete output that must fail. The revised helper successfully captured the [synthesis](rebuild-render/synthesis.png), which was opened and visually inspected; its [manifest](rebuild-render/synthesis-manifest.json) records the matching source and screenshot hashes. Browser availability and capture are separate from visual judgment, and failures never become a passing evidence claim.
