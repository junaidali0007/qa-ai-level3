# qa-ai-level3 — Assignment Gap Status Report

**Assessed against:** AI Level-3 Quality Engineering — Playwright + Agentic RCA Project (v1.0, issued 18 November 2026)
**Repository state:** `main` @ `6cd2146` — "Added E2E flow of customer purchase journey including invoice"
**Report date:** 25 November 2026
**Latest CI:** run #24 — **23 tests passed in 42.4s on chromium**

---

## 1. Executive summary

The framework is in good shape and materially better than it was two days ago. CI is green, the daily schedule is live, and the flagship purchase journey now runs end to end including payment, order confirmation and invoice download.

Two gates remain narrowly missed on volume (17 UI tests against a required 18; 6 API checks against a required 8). The larger shortfall is evidence rather than code: the two mandatory fault-injection exercises, the human-reviewed repair patch, the three-run stability proof and the quality scorecard have not been started, and the AI-assisted RCA path has never completed successfully end to end.

**Estimated score: approximately 66 / 100** (up from ~53 at commit `27ab24e`). Level-3 READY requires ≥ 85 with RCA ≥ 14/18, so the current standing is **Below Level 3**.

---

## 2. CI run history

Twenty-four workflow runs recorded. The eight most recent:

| Run | Timestamp (UTC) | Trigger | Result | Note |
| :--- | :--- | :--- | :--- | :--- |
| **24** | 25 Nov 13:58 | push | **Success** | 23 passed (42.4s), 0 failures |
| 23 | 25 Nov 06:53 | **schedule** | Success | Cron fired — schedule is live |
| 22 | 24 Nov 17:21 | push | Success | — |
| 21 | 24 Nov 17:17 | push | Failure | AE-01..AE-13 coverage commit |
| 20 | 24 Nov 08:21 | push | Cancelled | Superseded |
| 19 | 24 Nov 08:15 | pull_request | Cancelled | Superseded |
| 18 | 24 Nov 08:12 | push | Success | CI fix: chromium, schedule, always() |
| 17 / 16 | 24 Nov 07:42 | push | Failure | Pre-fix refactor |

Run #24 log confirms all 23 tests green, the RCA stage executing under `if: always()`, and both artifact bundles uploaded (`playwright-reports-24`, `rca-diagnostics-24`).

### Local-versus-CI discrepancy resolved

The eight UI failures recorded in the committed report files (blank page title, no navigation links, no search heading) do not reproduce on the GitHub runner. They were an anti-bot interstitial served to the local network only — an `ENVIRONMENT_OR_NETWORK` condition, not a code or locator defect. This is usable evidence for the live-defense question on distinguishing product defects from environment faults.

---

## 3. Completed since the previous review

- **Scheduled CI:** `schedule: cron "0 0 * * *"` added and confirmed firing (run #23).
- **RCA gating:** changed from `if: failure()` to `if: always()`, on the collector and both uploads.
- **Browser alignment:** chromium project re-enabled, Edge commented out — README setup instructions now match the config.
- **AE-12** quantity and cart-total arithmetic (`ProductDetailsPage.addProductToCartAndVerify`).
- **AE-15** payment entry via `PaymentPage` with dummy card values.
- **AE-16** delivery and billing address assertions against the source fixture.
- **AE-17** invoice capture through the Playwright download event, with filename and non-empty byte assertions.
- **AE-09, AE-10, AE-11, AE-14** category filtering, brand filtering, multiple cart items, and cart persistence across login.
- **AE-02** logout flow added.
- **Structure:** API specs split into `auth.spec.ts` and `catalog.spec.ts`; E2E journey organised with `test.step()` blocks, which produces good evidence granularity.

---

## 4. Scenario coverage

Sixteen of twenty-four scenarios are automated and passing.

| ID | Feature | Status | Remaining work |
| :--- | :--- | :--- | :--- |
| AE-01 | Account registration | Partial | Registration occurs via API fixture; UI signup path not exercised |
| AE-02 | Login / logout | Done | — |
| AE-03 | Invalid login (UI+API) | Done | — |
| AE-04 | Duplicate registration | Done | — |
| AE-05 | Login API validation | Mislabelled | Satisfied by the `@AE-03` API tests; relabel as AE-05 to claim it |
| AE-06 | Product catalogue | Done | — |
| AE-07 | Search relevance | Done | — |
| AE-08 | Search empty / invalid | Partial | UI zero-result done; API missing-param case targets `verifyLogin`, not `searchProduct` |
| AE-09 | Category filtering | Done | — |
| AE-10 | Brand filtering | Done | — |
| AE-11 | Cart multiple items | Done | — |
| AE-12 | Quantity calculation | Done | — |
| AE-13 | Remove from cart | Done | — |
| AE-14 | Cart persists on login | Done | — |
| AE-15 | End-to-end order | Done | — |
| AE-16 | Address consistency | Done | — |
| AE-17 | Invoice download | Done | — |
| AE-18 | Product review | Missing | Submit a review and assert the confirmation |
| AE-19 | Contact form upload | Missing | Upload a dummy `.txt` and assert submission success |
| AE-20 | Subscriptions | Missing | Assert the subscription confirmation banner |
| AE-21 | Recommended items | Missing | Add a carousel item to the cart |
| AE-22 | Account API CRUD | Partial | Create and delete exist; update and `getUserDetailByEmail` missing |
| AE-23 | API method validation | Missing | Assert method-not-supported on unsupported verbs |
| AE-24 | UI / API consistency | Missing | `tests/integration/` directory does not exist |

---

## 5. Remaining work

### 5.1 Coverage gates — narrowly missed

- **17 UI tests written; the gate requires 18.** One additional UI test clears it.
- **6 API checks; the gate requires 8.** Two additional API tests clear it.
- Six negative / edge cases required — **satisfied** (three API negatives, invalid login, duplicate signup, zero-result search).

*Adding AE-19, AE-20, AE-22 and AE-23 clears both volume gates at once and closes four catalogue rows.*

### 5.2 Mandatory gates still at zero

- **FI-01 script fault** — intentionally break a locator or expected cart total on a dedicated branch; RCA must classify `TEST_SCRIPT_DEFECT`; prove the test passes after the fix.
- **FI-02 network / state fault** — Playwright route interception for a single blocked response within local test context; RCA must classify `ENVIRONMENT_OR_NETWORK` without claiming a product defect.
- **Human-reviewed repair patch** — a minimal-patch pull request on a non-protected branch with sign-off recorded.
- **Three consecutive clean smoke runs** — one clean full run exists; three smoke runs is roughly three minutes of CI.
- **Quality scorecard** — pass rate, flaky / retry rate, duration, RCA classification accuracy on known injections, time-to-triage, maintenance effort.

### 5.3 Root-cause analysis — the largest point loss

This dimension carries 18 of 100 points and READY requires at least 14 of them. Current estimate: **8 / 18**.

- `collect.ts` reads only `error-context.md`. **Test ID, retry count, commit SHA and CI run URL are absent** from every finding, though the Detect stage mandates all four.
- Output record lacks `scenario_id`, `status`, `alternatives`, `validation` and `requires_human_approval`. The `alternatives` field matters most: ranking competing causes with evidence for and against each is required by both the brief and your own `skills/rca.md`, yet the analyzer emits a single hypothesis.
- **The AI-assisted path has never completed successfully.** Run #24 had `AI_API_KEY` present but reported `deterministic-fallback` — correct behaviour with zero failures, but combined with the HTTP 404 recorded in the review log, `ai-assisted` mode remains unproven. One real failure against a working text model is needed to demonstrate it.
- The interstitial guard still misses a blank challenge page (empty title, empty body), which is the known-fault case the policy was written for.

### 5.4 Documentation

- **Traceability matrix: all 24 rows still read "Planned"** while 16 are automated and passing. This is the cheapest correction available — roughly ten minutes against a dimension worth 12 points.
- RCA review log: two entries of the five required; Entry 1 still contains unfilled angle-bracket placeholders for category, severity, confidence, summary and recommended action, and its date reads "2026-MM11-23".
- Test strategy: no coverage-gaps section.
- Submission pack: sanitized AI transcripts, model choice rationale and cost / latency figures not yet assembled.

### 5.5 Minor items

- `reports/junit-results.xml` and `reports/playwright-results.json` are still tracked in Git despite `reports/` being gitignored.
- `permissions: contents: read` absent from the workflow job.
- `npm run lint` and `npm run format:check` are defined but never invoked in CI; `prettier --check` still fails.
- `@github/copilot-sdk` is imported by the Copilot extension but declared in neither `package.json` nor `package-lock.json`, so the extension cannot run.

---

## 6. Scoring estimate

| Rubric dimension | Points | Estimate | Principal constraint |
| :--- | :---: | :---: | :--- |
| Risk-based test design / traceability | 12 | 6 | Matrix statuses never updated |
| Playwright architecture / code quality | 15 | 13 | Strong; minor dead code and formatting |
| UI & API coverage / data integrity | 14 | 10 | 17/18 UI, 6/8 API, 16/24 scenarios |
| AI task decomposition and agent design | 15 | 12 | Skills and orchestrator are solid |
| AI RCA and failure classification | 18 | 8 | No injections, no alternatives, AI path unproven |
| CI/CD and report automation | 10 | 8 | Lint / format / permissions missing |
| Reliability, security and governance | 10 | 7 | No three-run stability evidence |
| Communication, metrics and live defense | 6 | 2 | Scorecard and presentation not started |
| **Total** | **100** | **~66** | **Below Level 3 (READY = 85+, RCA ≥ 14/18)** |

---

## 7. Recommended order of work

1. **Traceability matrix statuses.** Ten minutes; approximately 5 points.
2. **FI-01 and FI-02 fault injections.** Unblocks two mandatory gates, supplies the scorecard inputs, and forces the AI RCA path to run for real. Approximately 6 points.
3. **AE-19, AE-20, AE-22, AE-23.** Clears both coverage gates and four catalogue rows. Approximately 4 points.
4. **RCA field enrichment** — test ID, retry count, SHA, run URL, `alternatives`, `scenario_id`, `status`, `requires_human_approval`. Approximately 4 points on the heaviest dimension.
5. **Three smoke runs plus the quality scorecard.** Approximately 3 points.

*Items 1 through 5 would move the estimate from roughly 66 to the low-to-mid 80s and satisfy every mandatory gate except the live defense itself.*
