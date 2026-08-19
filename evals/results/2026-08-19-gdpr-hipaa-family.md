# compliance-gdpr + compliance-hipaa — family A/B (2026-08-19)

Family: `compliance-gdpr`, `compliance-hipaa` — the last two prose-knowledge skills,
kept in the 2026-08-19 platform/compliance eviction purely on the external-legal-objective
argument (specific article/rule citations, high cost-of-miss) and not yet tested.

Case file: `evals/gdpr_hipaa_pilot_cases.json` (6 cases: 3 per skill, canonical + openjudgment).
Harness: `evals/family_ab.workflow.js` (no arm C — no deterministic external checker for legal
citation accuracy). Scores: `evals/results/2026-08-19-gdpr-hipaa-scores.tsv`.
Run id: `wf_b077e72b-483`. 72 agents, 0 error, 0 dead.

## The instrument — deliberately harder than the generic gate

These skills' claimed value is not better general advice but EXACT regulatory accuracy — the
kind of thing a fluent model states confidently but wrong. So the anchors require specific,
checkable legal facts, and the `must_exclude` anchors are subtle legal errors:

- GDPR: Art. 17 erasure timeline (one month + two-month extension) vs the wrong "72 hours";
  Art. 33 72-hour authority breach window vs Art. 34 high-risk-only data-subject notice
  (the classic conflation); purpose limitation (Art. 5(1)(b)) + new lawful basis for reuse.
- HIPAA: business-associate scope + BAA; the "any health-data app is HIPAA" myth (a D2C
  fitness app is generally NOT covered); the §164.400-414 Breach Notification Rule 60-day
  timeline vs the wrong "72 hours"; the unencrypted-ePHI → no encryption safe harbor point.

A B-only `must_exclude` violation on any of these would be a direct KEEP/CONVERT signal:
it would mean the skill prevents a confident-but-wrong citation the bare model emits.

## Result

Official `score_ab.py` verdict: **PASS (evict).** Overall **A=1.000, B=1.000**, all 6 cases
tied, zero `must_exclude` violations in either arm. Both `openjudgment` cases (the ML-reuse
lawful basis and the HIPAA consumer-app myth) flagged "open tie (strong)."

## Skepticism pass — did the bare model get the SPECIFIC facts right, or hand-wave?

The whole point of this run is legal accuracy, so every bare (arm-B) answer was read, not just
the aggregate. The base model stated the exact facts correctly on all six:

- **gdpr-breach-notification (bare):** Art. 4(12); 72h from "becoming aware" per Art. 33
  (cites EDPB Guidelines 9/2022 / WP250); Art. 33(5) documentation duty; Art. 34 high-risk
  only — and explicitly "there is no 72h deadline for individuals; that number belongs only to
  the authority notification." Dodged the planted conflation trap outright.
- **hipaa-breach-rule (bare):** 45 CFR §§164.400-414; four-factor risk assessment §164.402(2);
  §164.410 BA→CE 60-day duty; >500 → HHS + prominent media within 60 days; unencrypted → safe
  harbor unavailable. Explicitly labeled "72 hours" as the GDPR window and HIPAA as 60 days —
  the exact trap, called out by name.
- **hipaa-consumer-app-myth (bare):** "generally not subject to HIPAA"; "HIPAA is not a 'health
  data' law — it's a 'who is handling the data' law"; then FTC Health Breach Notification Rule,
  FTC Act §5, Washington MHMDA, CCPA/CPRA, and GDPR for EU users. Refuted the myth and refused
  the "no obligations" conclusion — the strongest case *for* the skill, handled cleanly bare.
- **gdpr-erasure (bare):** Art. 17; one month + two further months (Art. 12(3)); Art. 17(3)
  exceptions; explicitly rebuts "72 hours/30 days/immediately."
- **hipaa-startup-scope (bare):** Business Associate (45 CFR 160.103); BAA (164.502(e),
  164.504(e)); all three safeguard categories (164.308/310/312); minimum necessary; HITECH
  direct liability.
- **gdpr-repurpose-ml (bare):** new purpose under Art. 5(1)(b); Art. 6(4) compatibility;
  consent vs legitimate-interests balancing; Art. 9; Art. 35 DPIA; pseudonymization ≠
  anonymization.

The judge was again discriminating (it explicitly checked the 72h-vs-60-day distinction and the
Art. 33/34 non-conflation). The flat 1.000 is real accuracy, not a lenient rubric.

## Verdict

**EVICT `compliance-gdpr` and `compliance-hipaa`.** The external-legal-objective KEEP argument
was that the base model would state a regulatory citation fluently but wrong; this run tested
exactly that with planted legal traps and the base model was precisely correct every time,
including the specific timelines, CFR sections, and scope boundaries, and it named the adjacent
regimes (FTC HBNR, state laws, GDPR) unprompted. These skills have no artifact convention,
effect boundary, or external plumbing to preserve — the value was purely the reference content,
and the content is derivable. Move to `archive/platform-compliance-evicted/`.

**Residual risk (stated honestly):** regulations change and legal misses are costly. But a frozen
`SKILL.md` is no more current or authoritative than the model — both defer to legal review, and
current primary sources at use time mitigate staleness better than static prose. Eviction does
not remove the "escalate to a privacy/legal owner" guidance; that is preserved in the handoff
refs of the surviving skills.

## Net

With these two gone, **no prose-knowledge skills remain in the active registry.** Active skills
43 → 41. The bitter-lesson rebalance is complete: 108 → 41.
