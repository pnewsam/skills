# Independent consumer review — final active registry

Scope: rechecked the four original findings against current entry points, GitHub mechanics, catalog dependency/effect declarations, and live prepare-pr/update-pr/pr-conventions supporting resources. No registry files edited. No archive content treated as active. No live external writes.

## Original findings: resolved

1. **New-PR target resolution:** `prepare-pr/references/github-mechanics.md` now distinguishes existing PR actions, branch publication, and new PR creation. Absence of a PR is expected for creation; publication does not require a PR number. Missing authentication no longer prevents independent local preparation.
2. **Tailwind migration endpoint:** revised `mindsdb-migrate-surface-to-tailwind/SKILL.md` applies work-conventions, explicitly leaves ordinary conversion requests at local code/verification, and conditions issue/commit/PR actions on existing authorization. Historical project details no longer grant delivery scope.
3. **Catalog effects:** migration declares tests, Git and external/network writes; metrics declares network reads and external comment writes; threat-model declares document writes. These match the modes at issue. Metrics now defaults to local scan/report and permits useful local progress without Linear.
4. **Standalone MindsDB dependency closure:** computed closure is `create-issue`, `mindsdb-migrate-surface-to-tailwind`, `mindsdb-track-design-system-metrics`, `pr-conventions`, `prepare-pr`, `work-conventions`, `writing-conventions`. Mandatory conventions and delivery mechanics are present. All declared resource paths still exist.

## Supporting-resource findings: resolved

5. **Screenshot hosting authorization:** re-read final `registry/prepare-pr/references/visual-evidence.md`. Hosted evidence now requires an explicitly authorized destination and visibility; headless execution does not authorize public storage or access-control changes. With no approved host, local artifacts and a truthful attachment gap are the required fallback. The checklist now matches this boundary.
6. **Issue closure semantics:** re-read final `registry/pr-conventions/references/pr-standard.md`. GitHub references default to `Related to #123`; Linear uses a verified neutral URL. Closing keywords/transitions now require an agreed closure outcome. Association alone explicitly does not authorize closure.

No unresolved supported findings remain from this review. These final edits revealed no new concrete issue within the requested scope.

## Other reviewed supporting contracts

prepare-pr's current preview/commit/publish/open-PR modes and update-pr's preview/apply modes remain explicit. update-pr preserves facts/checklist state during polish and refreshes editable state before writes. Its optional preview template explicitly continues in Apply mode, so it does not create a new approval gate. Output templates are optional; the entry points prohibit claiming boundaries not reached. No additional substantive publication-default issue found in those templates.

Evidence: read current file contents and computed catalog closure/resource existence with Python. These are static consumer-contract checks, not a live GitHub/Linear trial. All six reported findings were resolved by inspecting the revised contracts. This is a qualified static review result, not proof of all runtime or external-system behavior.
