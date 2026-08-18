---
name: ui-patterns
description: Objectives for displaying a data collection — matching the container to the data's shape and density, and the completeness checklist a large collection must satisfy (filter/search, pagination, density, empty/overflow). Use when choosing tables vs cards vs lists or reviewing a collection view. The base model picks sensible containers; this skill's job is the scale-completeness the model tends to omit.
---

# UI Patterns — Collection Objectives

Converted reference (bitter-lesson A/B, 2026-08-17,
`evals/results/2026-08-17-ui-family.md`): a capable base model already picks the
right container (table vs cards vs list vs board) from the data's shape — it tied
the old prose on that. Its one reproducible **miss** was scale-completeness: given a
large collection it recommends the right container but forgets to make it usable at
size. So the durable value is the objective + checklist below, not the pattern
tables. For page chrome and zones the base model handles it directly.

## Match the container to the data (state the intent, let the model pick)

- **Scan-and-compare across repeatable columns → data table.** Homogeneous records
  with structured fields the user compares row to row.
- **Heterogeneous or media-heavy items, browsing over comparing → cards / grid.**
  Each item is a self-contained unit with a dominant visual.
- **Few items (<~10) with 1–2 attributes → simple list.** A table looks barren.
- **Items moving through discrete stages → board.** The primary action is changing
  status.
- **Chronological "what's new" → feed/timeline. Date-bound → calendar.**

Give the model the data shape, density, and primary task; it produces a sensible
container. Don't hand-maintain exhaustive selection tables.

## The completeness checklist (what the model tends to omit — enforce it)

A collection view is not done until, **at the scale it will actually hold**:

- **Filter / search when it grows.** Past ~20–30 items, the view needs filtering or
  search — inline filter bar for a few criteria, faceted for many, type-to-filter
  for in-memory lists. This is the omission the base model most often makes; require
  it explicitly.
- **A pagination/loading strategy** matched to the data: numbered (jump/locate),
  load-more (moderate), infinite scroll (feeds — never with an essential footer),
  virtualization (10k+ rows).
- **Density fits the user.** Offer a compact mode once a view regularly holds 50+
  items; one comfortable density is fine below ~20.
- **Empty, loading, and overflow states exist.** Especially the first-run empty
  state and per-cell truncation (ellipsis + tooltip; mid-truncate ids/URLs; collapse
  secondary table columns before any page-level horizontal scroll).
- **Filtered/sorted state is shareable** (persisted in the URL) and clearable in one
  action, with the active filter count visible.

## Guardrails

- Don't force cards for a single thumbnail on otherwise structured data — use a
  table with a narrow image column.
- Don't jam 3+ secondary attributes into list subtitles — upgrade to a compact table.
- Tabs are peers with stable order and URL-reflected state; never nest horizontal
  tabs in horizontal tabs.

For open visual direction see `design-explore`; for contrast/color tokens `ui-color`;
for spacing scale `ui-spacing`.
