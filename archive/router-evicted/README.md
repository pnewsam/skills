# router-evicted (bitter-lesson)

The four skill routers — `consult-expert`, `compliance-expert`, `platform-expert`,
`ui-expert` — evicted 2026-08-18 after a family A/B
(evals/results/2026-08-18-router-family.md). Holding the visible delegate list
constant across arms, the bare model routed to the correct focused-skill subset and
synthesized as well or better without the router prose (final A=0.989, B=1.000;
consult-expert: bare beat the router). A router over a delegate set the model already
sees is redundant. History/reversibility only. Reverse: git checkout main.

The focused delegate skills they routed to all remain active in registry/.
