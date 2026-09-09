# Review protocol

Reviewing another author's PR, return a verdict — APPROVE (sufficient evidence, no credible blocker), REQUEST_CHANGES (a supported blocking defect), or COMMENT (uncertainty, or notes without a gate) — plus a short reason, the validation run, and findings ordered by severity.

Self-review has no verdict: you are not gating your own PR, and the platform blocks self-approval. Return a readiness self-assessment instead — ready, ready after the listed fixes, or not ready with the blocker named — then the findings and open items. When posted, a self-review is a COMMENT.

Report a reviewer model only from trusted runtime metadata, else `unknown`; a delegated reviewer reports its own model.

The agent owns the review-fix-validate-deliver loop. A single pass under-finds, so for a consequential change take a second context-isolated pass by default — not only when one is requested; give the second reviewer the diff plus the first pass's findings and task it with what they missed. Prefer a fresh reviewer from a different model family when available and authorized, given intent, diff, context, and validation but not the prior verdict; disclose any fallback. Allow three repair rounds plus one clean review unless told otherwise; stop on convergence or the same finding surviving two repairs. Re-review after edits — an earlier clean review cannot certify later ones. A remote-readiness claim needs the remote head to match the reviewed candidate with required CI green. Do not post reviews, replies, or resolutions automatically; use authorized delivery.
