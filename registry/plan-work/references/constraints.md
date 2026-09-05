# Applicable constraints

Load only the concerns the project or change makes relevant. Record the actual requirement, its applicability and source/version, available checks, observed evidence, and any decision still owned by a person. A source citation or suggested tool is not proof that a control exists or that a check ran.

## Sensitive data and security

Start from assets, actors, data flows, and exposure. Use the project's threat model and security policy; verify current primary sources where needed (OWASP ASVS: https://owasp.org/www-project-application-security-verification-standard/). For vulnerabilities, verify affected/resolved versions and reachability using vendor advisories and the actual dependency graph.

For personal data, identify purpose, stores/vendors, retention, access, export, deletion, and logging. Applicable GDPR requirements: https://eur-lex.europa.eu/eli/reg/2016/679/oj. HIPAA scope and safeguards: https://www.hhs.gov/hipaa/for-professionals/index.html. Do not assume applicability or choose a legal basis from a code scan; record qualified privacy/legal decisions when required. Trace deletion and retention through derived data, backups, and vendors; document supported limitations instead of promising universal immediate deletion.

## Accessibility and presentation

Use the adopted accessibility target and actual component states. WCAG 2.2: https://www.w3.org/TR/WCAG22/. Automated scans and contrast calculations cover only part of accessibility; keyboard, focus, semantics, errors, and assistive behavior need suitable verification. Treat project typography, spacing, and visual conventions as selected preferences with context-sensitive exceptions, not universal legal requirements.

## Operations and auditability

Record environment assumptions, least-privilege access, secret handling, immutable artifact identity, migration sequencing, health checks, recovery, and evidence retention where relevant. Prefer the project's actual CI and deployment runbooks. SLSA: https://slsa.dev/; GitHub workflow security: https://docs.github.com/en/actions/security-for-github-actions. Verify current versions and applicability. Distinguish validation tooling from security/policy enforcement; a workflow linter does not prove all supply-chain controls.

For audit-sensitive changes, retain actor/action/object/time and artifact evidence with appropriate access and retention. Do not log secrets or excessive personal data to make an audit trail appear complete. Human approval is required only when the governing policy or unresolved decision actually requires it.
