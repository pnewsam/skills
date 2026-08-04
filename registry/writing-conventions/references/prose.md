# Prose conventions

Sentence-level style for the concise, human-facing technical writing these skills produce — PR titles, bodies, and code reviews; Linear issues and projects; planning and charter documents; commit messages. It shapes how the prose reads, not what each artifact must contain: the per-artifact structure (headings, required sections, checklists) lives in that skill's own standard, and a repository template's structure still wins where one exists.

## Rules

- **One idea per sentence — do not chain clauses.** A sentence that joins two or three points with em-dashes or semicolons is doing too many jobs. Split it into short declarative sentences.
- **Active voice, plain words.** "The guard prevents overlap," not "overlap is prevented by the guard." Prefer the plain word over the formal one, but keep genuine technical terms — this is short, direct writing, not a restricted vocabulary that would fight the content.
- **Length tracks substance, not effort.** Say a thing once, in as few sentences as it needs. Do not pad to look thorough, and do not restate the same point in two places.
- **Cut hedging and meta-commentary.** Drop "it's worth noting," "as mentioned above," "in order to," and any preamble about the writing itself. State the thing.

A passage, tightened:

- Verbose: "The truncation logic is correct and the guard prevents head/tail overlap; the schema change is a prompt edit backed by an n=12/arm A/B, and the tests pin the new behavior."
- Tight: "The truncation logic is correct. The guard prevents head/tail overlap. The schema change is a prompt edit, backed by an n=12/arm A/B. The tests pin the new behavior."
