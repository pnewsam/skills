# Evidence record

Candidate: <base/head plus local diff identity or artifact version>
Scope and environment: <what was actually exercised>

| Requirement | Method / command | Result | Evidence / limitation |
| --- | --- | --- | --- |
| <acceptance or invariant> | <actual method> | pass / fail / unverified | <artifact or concise observation> |

Prior evidence reused: <candidate and why still applicable>
Remaining conditions: <required failures, unavailable checks, or relevant uncertainty>

Do not infer passing from a test file's existence. Report actual commands and outcomes; keep sensitive raw logs out of the record. State readiness only for the evaluated boundary. Writing this as a separate file is optional.
