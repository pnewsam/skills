# React application infrastructure

Use this reference for startup, shell, providers, routing, configuration,
authentication bootstrap, platform adapters, and deployment.

## Startup and shell

Keep startup deterministic:

1. load and validate configuration
2. initialize required platform adapters
3. construct providers with explicit dependencies
4. mount the router and application shell
5. enable development-only instrumentation

Do not perform unrelated network work in module scope. Startup failures should
be visible and actionable rather than leaving a blank screen.

## Providers

Providers are appropriate for stable application-wide capabilities such as the
router, theme, data client, authentication context, localization, and telemetry.

For each provider, state:

- what value it owns
- which providers it depends on
- whether initialization is synchronous or asynchronous
- what users see while it initializes or fails
- how tests replace or configure it

Prefer a named `AppProviders` composition over deeply nested anonymous setup in
the entrypoint.

## Configuration

Read runtime or build-time variables in one module. Parse and validate required
values once, expose a typed configuration object, and avoid leaking secrets into
client bundles.

Distinguish:

- values embedded at build time
- values fetched at runtime
- user or tenant settings
- sensitive server-only configuration

## Authentication bootstrap

Authentication initialization should make the states explicit: unknown,
authenticated, anonymous, expired, and failed. Avoid rendering protected
content while authorization is unresolved.

Authentication answers identity. Resource access still requires authorization
at the API or server boundary.

## API and platform adapters

Centralize transport mechanics such as base URLs, credentials, headers,
serialization, cancellation, and consistent error translation. Keep product
decisions out of a generic client.

Wrap browser globals and vendor SDKs when doing so creates a meaningful test or
migration boundary. Avoid wrappers that merely rename an existing API.

## Routing and code splitting

Define route ownership, layouts, permission gates, error handling, and lazy
boundaries deliberately. Split code at boundaries users naturally cross, often
routes or large optional workflows.

Avoid:

- one bundle for the entire application when major routes are independent
- a lazy boundary around every small component
- authorization that exists only in client routing
- redirects that discard the intended destination without a product reason

## Deployment

Verify:

- direct requests to client-managed routes reach the application shell
- static assets use the correct base path and cache policy
- source maps follow the project's exposure policy
- configuration is appropriate for the target environment
- health and error signals distinguish startup failure from route failure

Document hosting assumptions next to the deployment configuration, not only in
tribal knowledge.
