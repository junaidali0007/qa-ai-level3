# Test Strategy

## Objective & Scope
Build a Playwright and TypeScript UI, API, and integration test suite alongside an AI-assisted, human-governed Root-Cause Analysis (RCA) workflow for `https://automationexercise.com`.

## In Scope & Out of Scope
- **In Scope:** Risk-prioritized scenarios (`AE-01` through `AE-24`), at least 18 UI scenarios spanning six functional areas, at least 6 negative/edge cases, at least 8 API assertions, the flagship customer purchase-to-invoice journey with disposable account cleanup, CI/CD execution (PR, manual dispatch, and daily 05:00 PKT / 00:00 UTC schedule), deterministic + AI-assisted RCA reporting, two controlled fault-injection exercises, a quality scorecard, and live defense readiness.
- **Out of Scope:** Real monetary payments, real personal or production credentials, bypassing anti-bot controls, generating abusive load or security/vulnerability scans against the public site, and autonomous AI merges or deployments.

## Risk Prioritization
- **P0 (Critical):** Core account registration and login/logout, product catalogue and search relevance, cart operations and quantity math, end-to-end checkout, address consistency against source fixtures, and disposable test-user cleanup.
- **P1 (High):** Duplicate registration handling, login/search/HTTP-method API validations, category and brand filtering, invoice download verification, product review submission, contact form upload, account API CRUD, and UI/API consistency checks.
- **P2 (Medium / Stretch):** Subscriptions and recommended items.

## Assumptions & External-Site Behavior
- **Third-Party Practice Target:** Automation Exercise (`https://automationexercise.com`) is a public third-party practice site whose content, layout, API payloads, and edge-case behaviors can evolve or vary across runs. We validate observed behavior in the test environment and record assumptions rather than assuming undocumented rules.
- **Anti-Bot / Interstitial Challenge (`"One moment, please..."`):** During local runs, navigating to `https://automationexercise.com/` occasionally returned `"One moment, please..."` instead of `"Automation Exercise"`, indicating a browser or network challenge/interstitial.
- **Strict Non-Bypass & Low-Load Guardrails:** We do not attempt to bypass anti-bot controls, evade protections, flood traffic, or use high worker/retry counts. We keep concurrency restrained and retries minimal.
- **Evidence & Classification Rule:** When a challenge or network delay blocks or stalls a test, we preserve concrete artifacts (trace, screenshot, error context, and test logs). We do not mask failures with arbitrary sleeps or claim a confirmed product defect without proof; instead, we record evidence, evaluate competing hypotheses (`ENVIRONMENT_OR_NETWORK`, `THIRD_PARTY_DEPENDENCY`, or `UNKNOWN`), and document any external-site variance with concrete evidence.
