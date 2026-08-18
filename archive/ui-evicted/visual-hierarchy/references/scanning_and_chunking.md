# Scanning and chunking

Use these patterns when hierarchy must support fast scanning through dense or repeated information.

## Reading patterns

Do not assume one universal eye pattern. Content shape, language direction, task, viewport, and prior familiarity all affect scanning.

Common behaviors include:

- scanning headings, labels, and leading values before body copy
- following aligned edges through repeated rows
- comparing columns when labels and values remain consistently placed
- looking first near a known task anchor such as search, navigation, or a primary status

Design for the actual task instead of forcing every page into an F- or Z-shaped template.

## Chunking

A chunk should represent one meaningful unit. Use:

- headings to name the unit
- proximity to bind its contents
- whitespace to separate neighboring units
- consistent alignment to make repeated units comparable
- containment only when proximity and alignment are insufficient

Avoid nested cards or repeated divider lines that give every boundary equal weight.

## Dense interfaces

For tables, dashboards, forms, and operational tools:

- keep row and column alignment stable
- make the primary comparison dimension visually consistent
- distinguish labels, values, status, and actions
- use progressive disclosure for detail that is not needed during scanning
- keep filters and scope visible enough to explain what data is shown
- anchor important totals or exceptions without making every alert dominant

Density is not automatically poor hierarchy. Compact layouts can scan well when alignment, labels, and grouping are disciplined.

## Responsive reflow

When columns become stacked:

- preserve semantic order rather than visual desktop coordinates
- repeat labels when their column context disappears
- keep primary actions near the object they affect
- avoid moving destructive or secondary actions into a newly dominant position
- verify that headings still describe the content that follows

Do not hide necessary context solely to make the small-screen layout appear cleaner.

## Quick validation

Ask a reviewer unfamiliar with the design to identify, within a few seconds:

- the page or object's identity
- the most important value or status
- the primary available action
- which items form one group

Their answer is evidence about the rendered hierarchy; it does not replace task-based usability testing.
