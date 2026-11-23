# AI Level-3 QA Capstone — Completion Checklist

Source: AI Level-3 Quality Engineering Playwright + Agentic RCA Project (v1.0, issued 18 Nov 2026)
Repo: qa-ai-level3 | Checked against commit 27ab24e

How to use: every box is unchecked. Tick the ones you have finished.
Inline status is my verification against the repo as of this commit:
- STATUS: DONE = verified present and working
- STATUS: PARTIAL = exists but does not meet the stated requirement
- STATUS: MISSING = not in the repo

---

## 1. Mandatory acceptance gates (Section 2 + Section 16)

- [ ] Deliver a functioning Git repository with repeatable LOCAL execution. STATUS: PARTIAL - README says `npx playwright install chromium` but playwright.config.ts only defines the "Microsoft Edge" project (chromium is commented out), so a fresh clone installs the wrong browser.
- [ ] Deliver a functioning Git repository with repeatable CI execution. STATUS: PARTIAL - workflow runs, but has no schedule trigger and RCA uses if:failure() instead of if:always().
- [ ] Implement at least 18 automated UI scenarios. STATUS: PARTIAL - 10 UI tests written; only 1 of 10 passed in the last committed run.
- [ ] UI scenarios must span six functional areas. STATUS: PARTIAL - 5 areas present (auth, catalog, cart, checkout, home/ancillary); ancillary area has only a navigation test.
- [ ] Include at least 6 negative/edge cases. STATUS: DONE - 6 tests tagged @negative.
- [ ] Include at least 8 API checks. STATUS: PARTIAL - 6 API tests exist.
- [ ] Show requirements-to-test traceability. STATUS: PARTIAL - docs/traceability-matrix.md exists but all 24 rows say "Planned".
- [ ] Show documented risk prioritization (P0/P1/P2). STATUS: PARTIAL - documented in test-strategy.md, but only 1 test carries a priority tag (@P0 on AE-01).
- [ ] All critical user journeys must have assertions beyond page visibility. STATUS: PARTIAL - checkout asserts address content; catalog/search tests assert visibility only.
- [ ] Execute scheduled CI at 05:00 Asia/Karachi (cron '0 0 * * *'). STATUS: MISSING - no schedule: block in .github/workflows/playwright.yml.
- [ ] Execute CI on pull requests. STATUS: DONE.
- [ ] Attach a per-run RCA artifact even if tests fail. STATUS: PARTIAL - RCA step is gated on if:failure(), so no RCA artifact on passing runs.
- [ ] Demonstrate fault-injection exercise 1: one GENUINE failure classification. STATUS: MISSING.
- [ ] Demonstrate fault-injection exercise 2: one NON-PRODUCT failure classification. STATUS: MISSING.
- [ ] Provide evidence and human review for both fault injections. STATUS: MISSING.
- [ ] Deliver AI-agent design with tool/skill definitions. STATUS: DONE - agents/orchestrator.md + 4 skills files.
- [ ] Deliver AI-agent guardrails. STATUS: DONE - docs/ai-policy.md.
- [ ] Deliver structured RCA output. STATUS: PARTIAL - JSON+MD emitted, but missing required fields (see Section 6 below).
- [ ] Deliver decision thresholds. STATUS: PARTIAL - confidence calibration exists in code; no documented threshold table.
- [ ] Deliver audit logs. STATUS: PARTIAL - docs/rca-ai-review-log.md has 1 entry with unfilled placeholders; 5 required.
- [ ] Demonstrate repeatability: 3 consecutive smoke runs with no unexplained failures. STATUS: MISSING - no evidence captured.
- [ ] OR document and triage every failure from those runs. STATUS: MISSING.
- [ ] Final readiness check: at least 18 PASSING executable UI cases. STATUS: MISSING - 1 passing.
- [ ] Final readiness check: 8 passing API assertions. STATUS: PARTIAL - 6 passing.
- [ ] Final readiness check: working CI artifact capture. STATUS: DONE.
- [ ] Final readiness check: two properly labelled fault-injection RCAs. STATUS: MISSING.
- [ ] Final readiness check: one human-reviewed patch validation. STATUS: MISSING.
- [ ] Final readiness check: demonstration of prompt/skill and security controls. STATUS: PARTIAL - documented, not demonstrated with evidence.

---

## 2. Scenario catalogue AE-01 to AE-24 (Section 5)

### Already covered

- [ ] AE-03 P0 Invalid login (UI + API). STATUS: DONE - AE-AUTH-02 and AE-API-03.
- [ ] AE-04 P1 Duplicate registration (UI). STATUS: DONE - AE-AUTH-03.
- [ ] AE-05 P1 Login API validation (API 7, 8, 10). STATUS: DONE - AE-API-03 and AE-API-04.
- [ ] AE-13 P0 Remove from cart (UI). STATUS: DONE - cart-mutations.spec.ts.
- [ ] AE-16 P0 Address consistency vs source fixture (UI + API). STATUS: DONE - authenticated-checkout.spec.ts.

### Partially covered - finish these

- [ ] AE-01 P0 Account registration via UI signup form (not only the API fixture). STATUS: PARTIAL - registration happens only through the API fixture.
- [ ] AE-01 Re-label the spec currently tagged "AE-01" - it is a homepage-load test, not registration. STATUS: PARTIAL - mislabeled.
- [ ] AE-02 P0 Valid login. STATUS: DONE - login.spec.ts first test (needs the AE-02 tag).
- [ ] AE-02 P0 Logout and verify session terminates. STATUS: MISSING.
- [ ] AE-06 P0 Product catalogue renders in UI. STATUS: DONE - smoke-catalogue.spec.ts.
- [ ] AE-06 P0 Assert UI catalogue MATCHES the API product structure. STATUS: MISSING - UI and API are tested separately, never compared.
- [ ] AE-07 P0 Search relevance in UI. STATUS: PARTIAL - asserts heading visibility only; requirement is "matching items displayed with valid prices".
- [ ] AE-07 P0 Assert searched product names actually match the keyword. STATUS: MISSING.
- [ ] AE-07 P0 Assert displayed prices are valid/non-empty. STATUS: MISSING.
- [ ] AE-08 P1 Zero-result search in UI. STATUS: DONE - AE-CAT-03.
- [ ] AE-08 P1 API searchProduct with MISSING search_product parameter returns error. STATUS: MISSING - the missing-param test was written against verifyLogin instead.
- [ ] AE-15 P0 End-to-end order: set quantity and add a product. STATUS: PARTIAL - adds hardcoded product id 1 only.
- [ ] AE-15 P0 End-to-end order: fill dummy payment fields. STATUS: MISSING.
- [ ] AE-15 P0 End-to-end order: submit order and verify success confirmation. STATUS: MISSING - test stops at asserting "Place Order" is visible.
- [ ] AE-15 P0 End-to-end order: delete the disposable account after evidence capture. STATUS: DONE - fixture teardown.
- [ ] AE-22 P1 Account API: create user. STATUS: DONE.
- [ ] AE-22 P1 Account API: verify/read user (getUserDetailByEmail, API 14). STATUS: MISSING.
- [ ] AE-22 P1 Account API: update user (API 13). STATUS: MISSING.
- [ ] AE-22 P1 Account API: delete user. STATUS: DONE.

### Not started at all

- [ ] AE-09 P1 Category filtering: filtered list shows only matching category items (UI; TC 18). STATUS: MISSING.
- [ ] AE-10 P1 Brand filtering: UI filtered items match API brandList (UI + API 3). STATUS: MISSING.
- [ ] AE-10 Add a brandList API client method to src/api/products.ts. STATUS: MISSING.
- [ ] AE-11 P0 Cart with two distinct products, both with accurate unit prices (TC 12). STATUS: MISSING.
- [ ] AE-12 P0 Quantity calculation: set qty = 4, assert line total == unit_price * 4 (TC 13). STATUS: MISSING.
- [ ] AE-14 P0 Cart persists after login: guest cart items remain after authenticating (TC 20). STATUS: MISSING.
- [ ] AE-17 P1 Invoice download: file exists, is non-empty, and is parseable (TC 24). STATUS: MISSING.
- [ ] AE-18 P1 Product review submission shows confirmation (TC 21). STATUS: MISSING.
- [ ] AE-19 P1 Contact form file upload accepts a dummy .txt and confirms submission (TC 6). STATUS: MISSING.
- [ ] AE-20 P2 Subscription confirmation banner (TC 10, 11). STATUS: MISSING.
- [ ] AE-21 P2 Recommended items: add a carousel item to cart (TC 22). STATUS: MISSING.
- [ ] AE-23 P1 API method validation: unsupported HTTP verbs return method-not-supported (API 2, 4). STATUS: MISSING.
- [ ] AE-24 P1 UI/API consistency: UI prices and brands match API responses (API 1, 3). STATUS: MISSING.
- [ ] Create the tests/integration/ directory required by Section 7 for AE-24. STATUS: MISSING - referenced in docs but does not exist.

---

## 3. Flagship customer purchase journey (Section 6, 10 steps)

- [ ] Step 1: Unique account identity and address fixture, no reliance on prior tests. STATUS: DONE.
- [ ] Step 2: Navigate to Products, search a known product, capture displayed name AND unit price. STATUS: PARTIAL - searches, does not capture name or price.
- [ ] Step 3: Open product details page. STATUS: MISSING.
- [ ] Step 3: Set quantity to four. STATUS: MISSING.
- [ ] Step 3: Add to cart and verify item name, quantity, and calculated total. STATUS: MISSING.
- [ ] Step 4: Add a second distinct product. STATUS: MISSING.
- [ ] Step 4: Validate both line totals. STATUS: MISSING.
- [ ] Step 4: Validate overall cart arithmetic where presented. STATUS: MISSING.
- [ ] Step 5: Proceed to checkout; create account and return to cart if registration is required. STATUS: PARTIAL - logs in first instead; path works but does not exercise the registration branch.
- [ ] Step 6: Assert delivery AND billing addresses against the source fixture (not just text present). STATUS: DONE.
- [ ] Step 7: Enter order comment. STATUS: PARTIAL - CheckoutPage method exists but no test calls it.
- [ ] Step 7: Fill dummy payment fields only. STATUS: MISSING.
- [ ] Step 7: Submit order. STATUS: MISSING.
- [ ] Step 7: Verify order success. STATUS: MISSING.
- [ ] Step 8: Capture invoice via Playwright download event. STATUS: MISSING.
- [ ] Step 8: Validate invoice exists, is non-empty, and has plausible content/type when parseable. STATUS: MISSING.
- [ ] Step 9: Delete disposable account after evidence capture. STATUS: DONE.
- [ ] Step 9: Ensure cleanup also runs on failure paths. STATUS: DONE - finally block.
- [ ] Step 9: Log cleanup status. STATUS: MISSING - errors are swallowed by a bare .catch(() => {}).
- [ ] Step 10: Attach trace/screenshots on failure. STATUS: DONE - config.
- [ ] Step 10: Tag EVERY assertion with scenario ID and risk. STATUS: PARTIAL - most tests carry no AE ID or priority tag.
- [ ] Negative extension: duplicate signup. STATUS: DONE.
- [ ] Negative extension: invalid credentials. STATUS: DONE.
- [ ] Negative extension: zero-result search. STATUS: DONE.
- [ ] Negative extension: missing API search parameter. STATUS: MISSING - done on verifyLogin, not searchProduct.
- [ ] Negative extension: unusual but site-accepted cart quantity. STATUS: MISSING.
- [ ] Document observations and intended oracle for each negative/boundary case. STATUS: MISSING.

---

## 4. Repository structure (Section 7)

- [ ] .github/workflows/playwright.yml. STATUS: DONE.
- [ ] config/ environment and non-secret settings. STATUS: DONE.
- [ ] docs/ strategy, traceability, architecture, AI policy. STATUS: DONE.
- [ ] skills/ test-design.md, playwright.md, rca.md, review.md. STATUS: DONE.
- [ ] agents/ orchestration and agent instructions. STATUS: DONE.
- [ ] src/pages/ page objects. STATUS: DONE.
- [ ] src/api/ typed API clients and response validators. STATUS: DONE.
- [ ] src/fixtures/ account/data lifecycle and isolated contexts. STATUS: DONE.
- [ ] src/utils/ logging, calculations, evidence packaging. STATUS: PARTIAL - only navigation.ts; no logging, no calculation helpers, no evidence packaging.
- [ ] tests/ui/ auth, catalog, cart, checkout, ancillary. STATUS: DONE.
- [ ] tests/api/ products, brands, users, negative API. STATUS: PARTIAL - no brands, no users CRUD beyond create/delete.
- [ ] tests/integration/ UI + API consistency. STATUS: MISSING.
- [ ] tools/rca/ failure collector, classifier, report generator. STATUS: DONE.
- [ ] reports/ must be GITIGNORED generated output. STATUS: PARTIAL - listed in .gitignore but 2 report files are committed anyway; run `git rm --cached reports/junit-results.xml reports/playwright-results.json`.
- [ ] playwright.config.ts, package.json, README.md, .env.example. STATUS: DONE.

---

## 5. CI/CD workflow (Section 11)

- [ ] Add schedule trigger: cron '0 0 * * *' (05:00 PKT). STATUS: MISSING.
- [ ] Keep pull_request trigger. STATUS: DONE.
- [ ] Keep workflow_dispatch trigger. STATUS: DONE.
- [ ] Ensure the scheduled workflow lives on the repository DEFAULT branch. STATUS: PARTIAL - workflow is on main, but has no schedule to run.
- [ ] Add `permissions: contents: read` to the job. STATUS: MISSING.
- [ ] Set timeout-minutes (spec example uses 35). STATUS: DONE - 30.
- [ ] Node.js LTS 22 with npm cache. STATUS: DONE.
- [ ] npm ci. STATUS: DONE.
- [ ] Install browser with --with-deps. STATUS: DONE - msedge; spec skeleton uses chromium.
- [ ] Run Playwright tests. STATUS: DONE.
- [ ] Failure collector step must run with if: always(). STATUS: MISSING - currently if: failure().
- [ ] AI RCA step must run with if: always(). STATUS: MISSING - currently if: failure().
- [ ] RCA stage must gracefully handle missing reports. STATUS: DONE - analyze.ts writes an empty report.
- [ ] Upload playwright-report/, test-results/, reports/rca/ with if: always(). STATUS: PARTIAL - RCA artifacts upload only on failure.
- [ ] Prove AI/reporting failures cannot hide the original test result. STATUS: PARTIAL - RCA failure sets exitCode 1 and is a separate step; add explicit evidence/doc.
- [ ] Prove secrets are unavailable to untrusted PR execution. STATUS: MISSING - not documented or demonstrated.
- [ ] Prove the model-free fallback still produces a structured summary with no API key. STATUS: DONE in code; needs a captured artifact as evidence.
- [ ] Add `npm run lint` to CI. STATUS: MISSING - Section 4 requires linting as an acceptance condition.
- [ ] Add `npm run format:check` to CI. STATUS: MISSING.
- [ ] Fix the 30 files currently failing prettier --check. STATUS: MISSING - run `npx prettier --write .`.

---

## 6. RCA specification (Section 10)

### Detect stage - required evidence currently not collected

- [ ] Parse Playwright JSON results in tools/rca/collect.ts. STATUS: MISSING - collector reads only error-context.md.
- [ ] Parse JUnit results. STATUS: MISSING.
- [ ] Capture test ID in each finding. STATUS: MISSING.
- [ ] Capture error message. STATUS: DONE.
- [ ] Capture stack trace. STATUS: MISSING.
- [ ] Capture retry count. STATUS: MISSING.
- [ ] Capture CI run URL. STATUS: MISSING.
- [ ] Capture commit SHA. STATUS: MISSING.

### Collect stage

- [ ] Collect trace. STATUS: DONE.
- [ ] Collect screenshot. STATUS: DONE.
- [ ] Collect DOM snapshot if captured. STATUS: PARTIAL - only via error-context.md.
- [ ] Collect console errors. STATUS: MISSING.
- [ ] Collect sanitized request failures. STATUS: MISSING.
- [ ] Collect recent code changes / diff. STATUS: MISSING.

### Correlate / Hypothesize / Validate stages

- [ ] Identify the failing assertion and the prior step. STATUS: MISSING.
- [ ] Distinguish the FIRST failure from downstream symptoms. STATUS: MISSING.
- [ ] Rank competing causes. STATUS: MISSING - analyzer emits exactly one hypothesis.
- [ ] Mark evidence FOR and AGAINST each hypothesis. STATUS: MISSING.
- [ ] Record the validation step (re-run isolated test / inspect locator / inspect API response / inspect diff). STATUS: MISSING.

### Required output record fields (per the PDF's example JSON)

- [ ] scenario_id (e.g. "AE-12"). STATUS: MISSING.
- [ ] classification. STATUS: DONE - field is named `category`.
- [ ] confidence. STATUS: DONE.
- [ ] status (e.g. "HYPOTHESIS_PENDING_REVIEW"). STATUS: MISSING.
- [ ] symptom. STATUS: PARTIAL - folded into `summary`.
- [ ] evidence as typed objects {type, path}. STATUS: PARTIAL - plain string array.
- [ ] alternatives array. STATUS: MISSING.
- [ ] validation. STATUS: MISSING.
- [ ] recommended_action. STATUS: DONE.
- [ ] requires_human_approval. STATUS: MISSING.
- [ ] Publish artifact URLs alongside the report. STATUS: MISSING.
- [ ] Include UNKNOWN cases in published output. STATUS: DONE.
- [ ] Document the RCA JSON schema. STATUS: MISSING.

### RCA correctness bug found in the repo

- [ ] Fix assertNoInterstitialBlock to also catch a BLANK challenge page (empty title + empty body). STATUS: MISSING - the last committed run's 8 UI failures (empty title, no elements) were an interstitial but would be classified TIMING_OR_FLAKINESS / LOCATOR_OR_UI_CHANGE instead of THIRD_PARTY_DEPENDENCY.
- [ ] Fix collect.ts artifact matching: `m.startsWith(dirRel)` also absorbs sibling dirs such as foo-retry1 into foo's evidence. STATUS: MISSING - add a trailing path separator.
- [ ] Deduplicate the two divergent redaction implementations in collect.ts and analyze.ts into one shared module. STATUS: MISSING.

---

## 7. Fault-injection exercises (Section 12)

- [ ] FI-01: create a dedicated branch. STATUS: MISSING.
- [ ] FI-01: intentionally change a stable locator OR a correct expected cart total. STATUS: MISSING.
- [ ] FI-01: RCA must classify it TEST_SCRIPT_DEFECT. STATUS: MISSING.
- [ ] FI-01: locate the changed commit. STATUS: MISSING.
- [ ] FI-01: propose a minimal patch. STATUS: MISSING.
- [ ] FI-01: prove the test passes after the fix. STATUS: MISSING.
- [ ] FI-02: use Playwright route interception to simulate ONE request failure or blocked response, inside local test context only. STATUS: MISSING.
- [ ] FI-02: RCA must classify it ENVIRONMENT_OR_NETWORK or test-controlled fault. STATUS: MISSING.
- [ ] FI-02: show the network evidence. STATUS: MISSING.
- [ ] FI-02: avoid any false product-defect claim. STATUS: MISSING.
- [ ] FI-03 (stretch): introduce a controlled delayed response via interception, no arbitrary sleeps. STATUS: MISSING.
- [ ] FI-03 (stretch): show repeat count / reproducibility and isolate the synchronization issue. STATUS: MISSING.
- [ ] For each exercise: publish BEFORE run evidence. STATUS: MISSING.
- [ ] For each exercise: publish AFTER run evidence. STATUS: MISSING.
- [ ] For each exercise: record commit IDs. STATUS: MISSING.
- [ ] For each exercise: attach screenshots/trace. STATUS: MISSING.
- [ ] For each exercise: record the AI hypothesis. STATUS: MISSING.
- [ ] For each exercise: record the human rebuttal. STATUS: MISSING.
- [ ] For each exercise: record the human decision. STATUS: MISSING.
- [ ] For each exercise: record the final validated fix. STATUS: MISSING.
- [ ] Never claim a real product defect from injected behavior. STATUS: MISSING - no exercises exist yet to judge.

---

## 8. Agent and skills contract (Section 9)

- [ ] skills/test-design.md with inputs = requirements + risks + reference mappings. STATUS: DONE.
- [ ] skills/test-design.md output = traceable test cases + missing-oracle questions. STATUS: DONE.
- [ ] skills/playwright.md locator policy, fixture isolation, assertions, API patterns, tracing, code-review checklist. STATUS: DONE.
- [ ] skills/rca.md evidence hierarchy, classification policy, JSON schema, confidence rubric, uncertainty policy. STATUS: PARTIAL - JSON schema is not stated in the skill file.
- [ ] skills/review.md security/privacy and prompt-injection checks. STATUS: DONE.
- [ ] agents/orchestrator.md execution order, tool allowlist, handoffs, time/token budget, retry limits, exit conditions. STATUS: DONE.
- [ ] Retain at least 5 representative prompts/outputs showing how you CHALLENGED or CORRECTED AI suggestions. STATUS: PARTIAL - 1 entry exists in docs/rca-ai-review-log.md.
- [ ] Fill in the unfilled placeholder fields in review-log Entry 1 (category, severity, confidence, summary, recommended action are still angle-bracket placeholders). STATUS: MISSING.
- [ ] Fix the typo'd date in review-log Entry 1 ("2026-MM11-23"). STATUS: MISSING.
- [ ] Record human approval decisions for each entry. STATUS: PARTIAL - 1 of 5.
- [ ] Repair proposal agent: produce an actual minimal-patch PR on a non-protected branch. STATUS: MISSING.
- [ ] Repair proposal agent: show sandbox/branch verification of that patch. STATUS: MISSING.
- [ ] Quality reporting agent: produce the aggregated run summary output. STATUS: MISSING.

---

## 9. Required submission pack (Section 14)

- [ ] GitHub repository URL. STATUS: DONE.
- [ ] Commit history. STATUS: DONE.
- [ ] README with setup. STATUS: PARTIAL - browser install instruction is wrong.
- [ ] README with npm commands. STATUS: DONE.
- [ ] README with test tags. STATUS: DONE.
- [ ] README with local/CI configuration. STATUS: PARTIAL - claims a daily schedule that does not exist.
- [ ] README with limitations. STATUS: DONE.
- [ ] Test strategy: risk matrix. STATUS: DONE.
- [ ] Test strategy: assumptions. STATUS: DONE.
- [ ] Test strategy: in/out scope. STATUS: DONE.
- [ ] Test strategy: full 24-scenario catalogue. STATUS: DONE.
- [ ] Test strategy: prioritization. STATUS: DONE.
- [ ] Test strategy: traceability. STATUS: PARTIAL - statuses never updated.
- [ ] Test strategy: COVERAGE GAPS section. STATUS: MISSING.
- [ ] Architecture diagram covering page objects, API clients, fixtures, agent orchestrator, data flow, evidence collection, RCA, approval gate. STATUS: DONE - mermaid in docs/architecture.md.
- [ ] All executable tests, config, fixtures. STATUS: PARTIAL - 10 of 18+ UI scenarios.
- [ ] Deterministic test-data generation. STATUS: DONE.
- [ ] Cleanup evidence. STATUS: PARTIAL - cleanup runs but its status is never logged or published.
- [ ] CI evidence: a PR run. STATUS: DONE.
- [ ] CI evidence: a scheduled OR manual run. STATUS: MISSING - show workflow_dispatch output if the schedule has not elapsed.
- [ ] CI evidence: artifacts and failure handling. STATUS: PARTIAL.
- [ ] CI evidence: schedule definition. STATUS: MISSING.
- [ ] AI artifacts: prompts and skill files. STATUS: DONE.
- [ ] AI artifacts: model/tool choice rationale. STATUS: PARTIAL - noted in the review log, not as a decision doc.
- [ ] AI artifacts: sanitized transcripts. STATUS: MISSING.
- [ ] AI artifacts: human interventions. STATUS: PARTIAL - 1 recorded.
- [ ] AI artifacts: cost/latency if available. STATUS: MISSING.
- [ ] RCA package: JSON schema. STATUS: MISSING.
- [ ] RCA package: 2 injected-failure reports. STATUS: MISSING.
- [ ] RCA package: 1 normal-run summary. STATUS: MISSING.
- [ ] RCA package: root-cause alternatives and confidence. STATUS: MISSING - alternatives are not emitted.
- [ ] Quality scorecard: execution pass rate. STATUS: MISSING.
- [ ] Quality scorecard: flaky/retry rate. STATUS: MISSING.
- [ ] Quality scorecard: duration. STATUS: MISSING.
- [ ] Quality scorecard: RCA classification accuracy on known injections. STATUS: MISSING - needs FI-01/FI-02 first.
- [ ] Quality scorecard: time-to-triage. STATUS: MISSING.
- [ ] Quality scorecard: maintenance effort. STATUS: MISSING.
- [ ] Final presentation, 10 minutes. STATUS: MISSING.
- [ ] Live defense, 20 minutes. STATUS: MISSING.

---

## 10. Live-defense preparation (Section 17)

- [ ] Be able to change the search term, add a new expectation, show traceability, and minimally adapt automation on the spot. STATUS: MISSING.
- [ ] Be able to run an evidence-led RCA on a deliberately failing assertion BEFORE touching any code. STATUS: MISSING.
- [ ] Be able to explain product defect vs locator defect with exact artifact citations. STATUS: MISSING.
- [ ] Be able to explain why a test passes on retry and whether it should be marked flaky. STATUS: MISSING.
- [ ] Be able to show prompt-injection text embedded in test data and prove the agent does not follow it. STATUS: PARTIAL - UNTRUSTED_TELEMETRY framing exists in analyze.ts; no demonstration captured.
- [ ] Be able to run a failed test with AI disabled and still produce a deterministic RCA bundle. STATUS: DONE in code; capture the artifact as evidence.
- [ ] Be able to estimate throughput, cost, and false-classification risk at 100 product teams. STATUS: MISSING.

---

## 11. Code-quality fixes found during review

- [ ] Fix README: align browser install instruction with playwright.config.ts, or re-enable the chromium project. STATUS: MISSING.
- [ ] Remove the committed report files that .gitignore already excludes. STATUS: MISSING.
- [ ] Declare the @github/copilot-sdk dependency used by .github/extensions/.../extension.mjs, or remove the extension. STATUS: MISSING - it is in neither package.json nor package-lock.json, so the extension cannot run.
- [ ] Stop silently swallowing createAccount failures in src/fixtures/testFixtures.ts. STATUS: MISSING - a failed provision makes AE-API-05 report the wrong thing (a successful create reads as "duplicate not rejected").
- [ ] Replace the hardcoded product id 1 in cart and checkout specs with an ID taken from the products API. STATUS: MISSING - in the checkout spec it runs after a search for "Top", so the click times out if product 1 is not in those results.
- [ ] Strip UTF-8 BOMs from the 15 files that still carry them. STATUS: MISSING.
- [ ] Reconcile test IDs with the traceability matrix (specs use AE-AUTH-02, AE-CAT-03, AE-API-03..05, which match no matrix row). STATUS: MISSING.
- [ ] Update all 24 traceability-matrix status cells from "Planned" to real status. STATUS: MISSING.
- [ ] Add @P0/@P1/@P2 priority tags to every test. STATUS: MISSING - only AE-01 has one.
- [ ] Remove or finish the commented-out dead code in src/pages/ProductsPage.ts and playwright.config.ts. STATUS: MISSING.

---

## Summary count

- Mandatory gates fully met: 6 of 28
- Scenario catalogue fully covered: 5 of 24
- Flagship journey steps fully done: 4 of 10 (plus 3 of 5 negative extensions)
- Fault injections complete: 0 of 2 required
- Estimated rubric score as of commit 27ab24e: approximately 53 of 100 (Below Level 3; READY needs >=85 with RCA >=14/18)
