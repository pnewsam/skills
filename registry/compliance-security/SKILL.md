---
name: compliance-security
description: General secure coding and application security guidance. Use when reviewing authentication, authorization, input handling, injection risk, secrets, dependency trust, least privilege, session safety, sensitive logging, and secure defaults. Pair with stack experts for implementation details and compliance-vulnerability-management for known advisories.
---

# Compliance Security

Security work reduces the chance that users, data, systems, or operations can be abused beyond their intended boundaries.

## Principles

### 1. Check Authorization Where The Data Changes Or Leaves

Authentication proves who the caller is. Authorization proves what they may do. Enforce authorization at server, service, or data boundaries, not only in the UI.

### 2. Treat All External Input As Hostile

Validate, parse, normalize, and encode input at boundaries:

- User input.
- Query params and request bodies.
- Webhooks and callbacks.
- File uploads and imports.
- Environment variables.
- Third-party API responses.

### 3. Prevent Injection By Construction

Prefer parameterized queries, safe template APIs, structured command execution, framework encoders, and allowlists. Avoid concatenating untrusted strings into SQL, shell commands, HTML, URLs, file paths, or code.

### 4. Protect Secrets

- Do not commit secrets.
- Do not log secrets.
- Keep secrets out of client bundles.
- Rotate exposed credentials.
- Prefer scoped credentials with the smallest required privileges.

### 5. Use Least Privilege

Permissions, tokens, service accounts, database users, CI jobs, and cloud roles should have only the access required for the task.

### 6. Make Sensitive Failure Safe

Errors should be useful to legitimate users and operators without exposing stack traces, credentials, internal identifiers, or sensitive records.

## Review Checks

- What boundary enforces authorization?
- Can untrusted data reach an interpreter, query, template, path, or command?
- Are secrets isolated from source, logs, and client-visible output?
- Are privileges scoped and revocable?
- Does failure leak sensitive information?
- Is the security property covered by a test, scan, or review artifact?
