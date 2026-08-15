---
name: platform-infrastructure-as-code
description: Infrastructure-as-code guidance for Terraform/OpenTofu/Pulumi/CDK/Kubernetes manifests, modules, state, drift, plans, review, GitOps, environment promotion, least privilege, and infrastructure change safety. Use when editing or reviewing declarative platform/infrastructure configuration.
---

# Platform Infrastructure As Code

## Use When

Use for Terraform/OpenTofu/Pulumi/CDK/Kubernetes manifests, cloud resources, modules, state, drift, plans, GitOps, review practices, and infrastructure change safety.

## Source Anchors

- OpenGitOps principles: https://opengitops.dev/
- Terraform style guide: https://developer.hashicorp.com/terraform/language/style
- SLSA specification: https://slsa.dev/spec/v1.1/
- Kubernetes Secrets: https://kubernetes.io/docs/concepts/configuration/secret/
- GitHub Actions secure use reference: https://docs.github.com/en/actions/reference/security/secure-use

## Core Position

Infrastructure should be declared, reviewed, planned, applied predictably, and recoverable. Avoid invisible dashboard drift and avoid broad shared modules that make small changes dangerous.

## Checks — plan, validate, and verify state

IaC is the highest-value automation of the platform set: a plan diff and validate run are ground truth, not review.

- **validate + plan in CI** — `terraform validate` (or the provider equivalent) on every PR; the plan diff is part of review (openTofu/OPA/Checkov for policy).
- **Policy-as-code** — deny broad IAM grants, public buckets, and secrets-in-state with Checkov or OPA; failures block the plan.
- **Drift detection** — scheduled runs show state vs live drift and enforce that manual changes are re-imported, not left invisible.
- **State locking** — backend locking on so concurrent plans cannot race; destructive output is reviewed explicitly before apply.
- **Manual gate** — module ownership and broad cross-cutting change require a human approval.
## Common Agent Mistakes

- Editing cloud resources manually without reflecting the change in IaC.
- Combining unrelated infrastructure changes in one plan.
- Creating generic modules before resource ownership and variation are understood.
- Ignoring state locking, drift, imports, and destructive plan output.
- Storing secrets in state, variables files, plan logs, or repository files.
- Using one environment's values for another environment by copy/paste.
- Applying infrastructure changes without understanding replacement, downtime, or data-loss implications.

## Decision Rubric

| Concern | Preferred Guidance |
| :--- | :--- |
| Ownership | Resource names, modules, and directories map to service/team/environment ownership |
| State | Remote, locked, access-controlled, backed up, and separated by environment/blast radius |
| Modules | Small, purposeful, versioned or locally owned, with clear inputs/outputs |
| Plan review | Human-readable diff, destructive changes highlighted, unrelated churn removed |
| Drift | Detect, reconcile, import, or intentionally ignore with documented reason |
| Secrets | References to secret stores, not plaintext secrets in code/state/logs where avoidable |
| GitOps | Desired state in Git, automated reconciliation, reviewed changes, observable sync status |

## IaC Guardrails

- Read the generated plan before applying. Replacement, deletion, and permission expansion need explicit attention.
- Keep state boundaries small enough that a state or plan problem does not threaten unrelated systems.
- Separate reusable module logic from environment-specific values.
- Prefer explicit dependencies only when the tool cannot infer them; excessive dependency edges hide design problems.
- Name resources predictably with environment/service/purpose, but avoid renames that force destructive recreation without a migration plan.
- Treat IAM and network changes as high-risk even when the diff looks small.
- Include import/migration steps when bringing existing resources under IaC management.

## Do / Don't

| Do | Don't |
| :--- | :--- |
| Make infra changes through reviewed code and plans. | Fix production by clicking around and leaving drift behind. |
| Split risky/destructive changes into small, reversible steps. | Mix refactors, renames, permissions, and resource replacements in one apply. |
| Scope state, IAM, and modules by ownership and blast radius. | Put everything in one shared state because it is easy. |
| Keep secrets out of IaC files and logs. | Store secret values in variables or outputs. |
| Document manual import and migration steps. | Pretend existing resources magically belong to the new config. |

## Review Checklist

- What resources will be created, updated, replaced, or destroyed?
- Is the state backend locked, backed up, access-controlled, and scoped appropriately?
- Are secrets, credentials, or sensitive outputs exposed in code, state, plan, or logs?
- Are IAM/network changes least privilege and reviewed as security-sensitive?
- Does the module abstraction reduce duplication without hiding dangerous behavior?
- Is drift intentional, imported, ignored, or fixed?
- Is there a rollback/recovery path for destructive or replacement changes?

## Handoff Rules

- Use `platform-deployments-rollbacks` when infrastructure changes affect release sequencing or production availability.
- Use `platform-secrets-config` when IaC references secrets, config, certificates, keys, or secret stores.
- Use `compliance-security` for IAM, network, supply-chain, or CI/CD security controls.
- Use provider-specific skills or docs when resource semantics are cloud-specific.
