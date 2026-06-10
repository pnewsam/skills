---
name: backend-auth-boundaries
description: Backend authentication and authorization boundary guidance for identity propagation, permission checks, tenant isolation, sessions, tokens, roles, policies, service-to-service auth, and secure server-side access control placement. Use when backend work decides who can do or see what.
---

# Backend Auth Boundaries

## Use When

Use for authentication/authorization placement, session/token handling, tenant isolation, role/permission checks, service-to-service identity, object-level access control, and access-control testing.

## Source Anchors

- OWASP Authorization Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html
- OWASP API Security 2023, Broken Object Level Authorization: https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/
- OAuth 2.0 Security Best Current Practice, RFC 9700: https://www.rfc-editor.org/rfc/rfc9700.html
- NIST SP 800-63B authentication guidance: https://pages.nist.gov/800-63-4/sp800-63b.html

## Core Position

Authorization is backend behavior, not UI state. Authenticate once at a trusted boundary, propagate identity deliberately, authorize every protected action and object, and fail closed.

## Common Agent Mistakes

- Checking permissions only in the UI or client route guard.
- Authorizing a list endpoint but not each object inside the list.
- Treating role names as enough when object ownership, tenant, or state also matters.
- Passing raw tokens through many layers instead of a minimal identity/context object.
- Mixing authentication, authorization, billing entitlement, and feature flag concepts.
- Returning different data for unauthorized users after fetching hidden records.
- Logging session tokens, JWTs, reset tokens, or authorization headers.

## Decision Rubric

| Concern | Preferred Guidance |
| :--- | :--- |
| Authentication | Establish identity at trusted entrypoints; reject missing/invalid credentials before protected work. |
| Authorization | Check action + resource + tenant/owner + relevant state, not only role. |
| Identity context | Pass minimal trusted identity/tenant/claims context to services. |
| Object access | Filter queries by tenant/ownership and also guard direct object lookup paths. |
| Sessions/tokens | Keep server-side validation, expiry, rotation, revocation, and secure storage/cookie settings explicit. |
| Service-to-service | Authenticate callers and authorize scopes/capabilities separately from user auth. |
| Failure | Fail closed with consistent forbidden/not-found behavior that avoids data leaks. |

## Auth Boundary Guardrails

- Define a permission matrix before coding: actor, action, resource type, object relationship, tenant, state, and exceptional cases.
- Prefer policy helpers or a policy engine for repeated decisions. A scattered `if role == admin` codebase is hard to audit.
- Check object-level authorization for list, detail, mutation, export, job, webhook, and admin paths. Hidden IDs and unguessable IDs are not authorization.
- Filter by tenant/owner in the query when possible, then still handle direct object access consistently.
- Keep authentication context minimal: subject ID, tenant/account, roles/scopes/claims, assurance if relevant. Do not pass raw tokens through domain code.
- Separate authentication, authorization, entitlements, feature flags, and billing state. They answer different questions.
- Log access denials and sensitive access events safely with actor/resource/action/outcome/correlation ID, not secrets or token material.

## Do / Don't

| Do | Don't |
| :--- | :--- |
| Put authorization checks at backend boundaries where protected behavior happens. | Rely on hidden buttons, disabled controls, or client-side route guards. |
| Make tenant and object ownership constraints part of queries when possible. | Fetch broad data and filter after permission checks in memory. |
| Use named policy/helper functions for repeated permission decisions. | Scatter ad hoc role checks across handlers. |
| Test forbidden, cross-tenant, unauthenticated, expired, and privilege-change cases. | Test only the admin/success path. |
| Keep auth errors predictable and non-revealing. | Leak whether a hidden object exists when the user lacks access. |

## Review Checklist

- Where is identity established, and can untrusted callers bypass that point?
- What action is being authorized against which resource and tenant?
- Is the permission decision based on object relationship/state, not only global role?
- Are list, detail, mutation, export, background job, and integration paths all protected?
- Does the data query enforce tenant/owner boundaries before records leave storage?
- Are token/session expiry, revocation, rotation, and secure transport/storage addressed?
- Are authorization failures logged safely without leaking secrets or personal data?
- Do tests cover unauthorized users, wrong tenant, wrong role, missing object, and stale privileges?

## Handoff Rules

- Use `compliance-security` for deeper secure-session, token, OWASP, secret, logging, and abuse-prevention controls.
- Use `backend-api-design` for status code and error-body decisions at API boundaries.
- Use `backend-persistence` for tenant filters, row-level security, ownership constraints, and audit records.
- Use `compliance-privacy`, `compliance-gdpr`, or `compliance-hipaa` when access controls protect personal data, regulated data, or ePHI.
- Use stack experts for middleware, framework auth libraries, policy engines, and test implementation.
