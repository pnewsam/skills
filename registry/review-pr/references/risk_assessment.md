# Pull-request risk assessment

Use this reference in Risk mode. Risk describes the chance and consequence of a bad merge; it is related to, but distinct from, proven code-review findings.

## Contents

- Levels
- Dimensions
- Confidence
- Output

## Levels

| Level | Meaning |
| --- | --- |
| Low | Contained, reversible change with strong verification and no sensitive boundary |
| Medium | Moderate reach, meaningful uncertainty, or limited contact with a sensitive area |
| High | Broad or difficult-to-reverse impact, sensitive behavior, or weak verification on a critical path |
| Critical | Credible path to auth bypass, secret exposure, destructive data loss, systemic outage, or another severe outcome |

Start with the highest credible single-dimension level. Calibrate with mitigations, reversibility, validation, and confidence. Do not compute an average.

## Dimensions

### Blast radius

Consider dependency reach and runtime scope, not only file count:

- affected modules, services, tenants, users, and regions
- shared middleware, base types, libraries, or configuration
- synchronous versus staged or feature-flagged rollout
- ability to isolate and revert the change

### Change type

Identify behavior changes, public contracts, migrations, refactors, new capabilities, safety-control changes, and removals. Large mechanical diffs can be low risk; a one-line permission change can be critical.

### Security and privacy

Inspect authentication, authorization, sessions, cryptography, secrets, untrusted input, file or query construction, administrative paths, tenant boundaries, sensitive logging, and personal data.

### Data integrity

Inspect schema and storage changes, backfills, transformations, deletion, idempotency, retries, concurrency, downgrade compatibility, and rollback.

### Verification

Assess whether tests, type checks, builds, staged rollout, monitoring, and manual validation cover the actual failure modes. Separate missing PR-local evidence from repository-wide test debt.

### Dependencies and supply chain

Inspect new packages, major upgrades, lockfile changes, build scripts, maintainer or provenance changes, known advisories, and changes to security-critical libraries.

Verify any advisory against a current source before asserting it. Do not rely on recalled vulnerability status; mark an unverifiable advisory as unconfirmed.

### Infrastructure and operations

Inspect CI/CD, IAM, secrets wiring, environment variables, networking, deployment manifests, resource limits, observability, feature flags, and rollback procedures.

## Confidence

State High, Medium, or Low confidence and what evidence would materially change the assessment. Missing production topology, migration volume, or rollout details may limit confidence without raising the risk level by itself.

## Output

```markdown
## PR Risk Assessment

**Overall risk: <Low / Medium / High / Critical>**
**Confidence: <High / Medium / Low>**

<Why this rating is appropriate and what primarily drives it.>

| Dimension | Rating | Evidence |
| --- | --- | --- |
| Blast radius | <level> | <specific files, modules, users, or rollout> |
| Change type | <level> | <behavior and compatibility> |
| Security / privacy | <level or N/A> | <specific boundary> |
| Data integrity | <level or N/A> | <migration or persistence evidence> |
| Verification | <level> | <tests and remaining uncertainty> |
| Dependencies | <level or N/A> | <package evidence> |
| Infrastructure | <level or N/A> | <configuration or deployment evidence> |

### Before merge

- <specific action tied to a material risk>

### Rollout and rollback

- <monitoring, staging, flag, rollback, or "no special action needed">

_Assessment scope: <head> → <base> at <head SHA> · <date> · model <exact id of the model that produced this assessment, or "unknown">_
```

Omit recommendations that do not materially reduce risk. If the evidence supports Low risk, say so without manufacturing precautions.
