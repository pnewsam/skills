# Browser-test CI template

Use the repository's existing CI conventions, action pinning policy, package
manager, Node version, cache, and default branch.

Add browser tests to an existing compatible workflow when that keeps CI easier
to understand. Otherwise create `.github/workflows/browser-tests.yml`.

```yaml
name: Browser tests

on:
  pull_request:
  push:
    branches:
      - <default-branch>
  workflow_dispatch:

jobs:
  browser-tests:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: <repository-node-version>
          cache: <package-manager>

      - name: Install dependencies
        run: <frozen-install-command>

      - name: Install browser dependencies
        run: <framework-browser-install-command>

      - name: Run browser tests
        run: <browser-test-command>
        env:
          <documented-test-variable>: ${{ secrets.<documented-secret> }}

      - name: Upload browser-test artifacts
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: browser-test-results
          path: |
            test-results/
            playwright-report/
          retention-days: 7
```

Replace every placeholder with repository evidence. Omit environment variables
and artifact paths that do not apply.

Do not add a schedule, notification integration, third-party action, secret, or
production test target unless the user or repository explicitly requires it.
Scheduled browser tests have operational cost and ownership requirements; make
that a separate decision.
