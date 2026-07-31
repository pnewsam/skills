# Registry Relic And Pattern Sweep

Date: 2026-07-31

Follow-up: the later evergreen retention audit archived `color-expert` intact
because the complete upstream reference package was unavailable. See
`2026-07-31-evergreen-retention-audit.md` for the superseding decision.

## Scope

Audit the active registry, README, catalog, and routing evaluations for:

- documented skills that no longer exist;
- active skills that duplicate a broader workflow;
- packages that do not fit the registry's workflow, router, reference, or external-source patterns;
- stale response scaffolding and empty package remnants.

## Baseline

The registry began with 108 active skill packages. The README and catalog each named the same 108 skills, so there were no README links to missing packages. The suspected relics, `plan-bug-bash` and `audit-epic`, were still active, documented, and cataloged.

Five empty directories remained from previously retired skills, but none contained a `SKILL.md` or appeared in the README or catalog.

## Decisions

| Finding | Decision | Rationale |
| --- | --- | --- |
| `plan-bug-bash` duplicated general epic planning | Archive it and fold its observation normalization, deduplication, and grouping behavior into `plan-epic` | Bug-bash notes are an input shape, not a distinct delivery lifecycle |
| `audit-epic` created a specialized audit path | Archive it; use direct read-only inspection for status questions and `ship-epic` when execution is requested | The audit does not need a permanent skill or artifact by default |
| Empty historical package directories | Remove them | They were not active packages and added filesystem ambiguity |
| Expert packages were labeled as references | Classify maintained `*-expert` packages and `consult-expert` as routers | Their primary behavior is dispatch, not subject-matter reference guidance |
| UI reference skills contained canned opening responses | Remove those response scripts from maintained UI skills | A reusable reference should guide decisions and outputs without forcing conversational ceremony |
| `svg-animations` was credited externally but included in maintained advisory bundles | Mark it external/preserve and move it to `external-creative` | This preserves provenance and keeps external content out of maintained composite bundles |

The externally sourced `emil-design-eng`, `color-expert`, and `svg-animations` bodies were not edited.

## Result

- 106 active skill packages
- 106 README skill entries
- 106 catalog skill memberships/provenance entries
- exact active/README/catalog set agreement
- 21 archived skill packages
- no empty directories under `registry/`
- no active references to `plan-bug-bash` or `audit-epic`
- canned `Initial Response` scaffolding remains only in externally sourced `emil-design-eng`

## Forward Test: Observation-Driven Epic Planning

A disposable product fixture supplied a charter and unstructured bug-bash notes containing duplicates, ambiguous severity, several related interaction failures, and one unrelated idea.

Using the revised `plan-epic` produced exactly one epic document. It:

- consolidated seven distinct observations after deduplication;
- grouped them into four coherent child features;
- mapped every retained observation to a child feature or explicit out-of-scope decision;
- kept severity unassessed where the source lacked evidence;
- excluded the unrelated idea;
- created no separate bug tracker, feature plans, code changes, Git changes, network calls, or external-system writes.

This supports the consolidation: `plan-epic` can accept observation collections without needing a separate bug-bash planning skill.

## Remaining Judgment Call

`color-expert` is correctly isolated as external/preserve, but the imported package refers to reference files that are not present locally. Its core guidance is still usable, so it was not removed during this sweep. The clean follow-up is either to re-ingest the complete upstream package or archive it; editing the external body in place would violate the preservation policy.

No other active skill failed the current fit test: one clear outcome, explicit effects, and a distinct workflow, routing, reference, or externally preserved role.
