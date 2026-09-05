# Browser test implementation and repair

Use the project's actual runner, fixtures, and dev/runtime setup. Cover an observable user outcome with stable accessible selectors and controlled data. Keep fixture cleanup and isolation part of the test. A new test must fail for the intended missing behavior and pass with the implemented behavior.

For a flaky test, reproduce and classify the cause: product race, asynchronous assertion, unstable data, environment, or selector. Inspect traces and failure artifacts before changing waits or retries. Prefer waiting for a meaningful condition to fixed sleeps. Repeated passing runs alone do not prove the cause is fixed; connect the repair to the reproduced mechanism.

Run the changed test and relevant neighboring flows. Record browser/environment requirements and unavailable proof. Do not weaken assertions, skip tests, or raise retries merely to obtain green output. Treat a product fix and its regression coverage as one coherent unit when coupled.
