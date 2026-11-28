# AI Root-Cause Analysis (RCA) Review & Audit Log

- **Repository / Branch:** `qa-ai-level3` / `feat/day-4-ai-rca`
- **Pipeline Order:** `npm run rca:collect` → `npm run rca:analyze`
- **Configured Provider / Model:** `gemini` / `gemini-2.5-flash`
- **Policy Reference:** `docs/ai-policy.md`, `skills/rca.md`

---

## Policy & Privacy Checklist (Per Run / Release)

Before signing off on AI-assisted RCA outputs, verify:

- [ ] **Command Order:** `npm run rca:collect` ran prior to `npm run rca:analyze` on fresh failure telemetry.
- [ ] **PII & Secret Redaction:** No raw emails, credentials, tokens, session cookies, or sensitive identifiers appear in prompt inputs or `artifacts/rca/report.{md,json}`.
- [ ] **Untrusted Telemetry Framing:** Failure messages, DOM/locator strings, and external responses were treated strictly as untrusted data, not instructions.
- [x] **Deterministic Guardrails Respected:** Anti-bot/interstitial failures (`interstitialDetected: true`) and missing/invalid API key runs used deterministic classification/fallback rules without overclaiming.
- [ ] **Evidence Grounding:** Reported `category`, `severity`, `confidence`, and `recommendedAction` align with actual failure logs, traces, or screenshots—with uncertainty noted when evidence is incomplete.

---

## RCA Review Entries

### Entry 1 — `2026-11-23` | `feat/day-4-ai-rca`

- **Run Context:** Local (`powershell`)
- **Execution Mode:** `deterministic-fallback`
- **Provider / Model:** `gemini` / `gemini-2.5-flash`
- **Target / Failure Summary:** Intentional test failure run through `npm run rca:collect` followed by `npm run rca:analyze`, where `gemini-2.5-flash` returned HTTP 404 and fell back cleanly to deterministic RCA classification.

#### AI RCA Output Summary

- **Category:** `<e.g., locator_timeout | assertion_mismatch | auth_or_session | network_or_environment | anti_bot_interstitial | unknown>`
- **Severity:** `<critical | high | medium | low>`
- **Confidence:** `<high | medium | low>`
- **Summary:** `<Concise summary from report.md / report.json>`
- **Recommended Action:** `<Proposed fix or investigation step>`

#### Critical Review, Challenges & Corrections

- **SUPERSEDED BY ENTRY 2 (2026-11-27):** the root cause recorded below was *incorrect*. Re-testing the same key showed `/v1beta/models` returns 50 models, including `gemini-2.5-flash`, `gemini-2.5-pro` and `gemini-3.8-flash`, all advertising `generateContent`. The 404 was caused by model **retirement for new API keys**, not by an absence of text-generation models. The fallback behaviour described below was correct; the diagnosis of *why* was not.
- **Agreement / Discrepancy:** gemini-2.5-flash returned HTTP 404 during npm run rca:analyze, and querying /v1beta/models for this API key returned only specialized/preview/audio/embedding models (lyria-*, _-tts_, robotics-er, computer-use, antigravity, deep-research, gemini-embedding-001) rather than a standard text-generation chat model.
- **Corrections Made:** tools/rca/analyze.ts on its deterministic fallback guardrail instead of forcing a non-text model (such as TTS or embedding) to perform RCA classification, allowing report.md and report.json to complete safely with deterministic rules.
- **Privacy / Guardrail Notes:** Confirmed HTTP 404 handled gracefully without crashing the pipeline or exposing secrets/PII; next step is re-verifying live AI mode once a key with a standard text Gemini model is used (and keeping npm run rca:collect ahead of npm run rca:analyze).

#### Human Sign-Off

- **Reviewer:** Junaid
- **Decision:** Approved
- **Date (PKT / UTC):** 2026-11-23 08:20 PKT

---

### Entry 2 — `2026-11-27` | `fix/rca-gemini-model`

- **Run Context:** Local container verification on branch `fix/rca-gemini-model`, cut from `main` @ `0fa4b3a`. Correlated with CI run #30 (`29317dd`), which logged the same 404 three times.
- **Execution Mode:** `deterministic-fallback` reproduced, then `ai-assisted` achieved
- **Provider / Model:** `gemini` / `gemini-2.5-flash` (failing) -> `gemini-flash-lite-latest` (working)
- **Target / Failure Summary:** Investigation of the persistent `Gemini RCA request returned HTTP 404` seen in every AI-assisted attempt since Day 4, blocking live verification of the AI RCA path.

#### AI RCA Output Summary

Once the model was corrected, the analyzer returned a schema-valid, evidence-grounded finding for a staged checkout-timeout failure:

- **Category:** `LOCATOR_OR_UI_CHANGE`
- **Severity:** `HIGH`
- **Confidence:** `0.85`
- **Summary:** "The test timed out while attempting to click the checkout button using the locator `#cart_info .check_out`, indicating the element may have changed, moved, or failed to render properly on the cart page."
- **Recommended Action:** "Inspect the trace.zip and test-failed-1.png to verify if the cart page UI was updated, the selector needs adjustment, or if the test reached the cart page in the correct state."

#### Critical Review, Challenges & Corrections

- **Agreement / Discrepancy:** The provider returned an explicit, actionable 404: *"This model models/gemini-2.5-flash is no longer available to new users. Please update your code to use models/gemini-3.8-flash."* This **overturns Entry 1's diagnosis**. `ListModels` returning a model proves nothing about callability, because retired models remain listed; availability must be confirmed by invoking the model. Entry 1's conclusion was reached by reading the model list and inferring, which is precisely the unverified-hypothesis failure mode `skills/rca.md` warns against — the correct status for it at the time was low-confidence or `UNKNOWN`, not a stated cause.
- **Challenge to the provider's own advice:** the suggested replacement `gemini-3.8-flash` returned HTTP 503 "experiencing high demand" on every attempt, as did `gemini-3.6-flash` and `gemini-3.5-flash`. The provider's recommendation was therefore **not** adopted verbatim. `gemini-flash-lite-latest` was verified to answer successfully and became the default.
- **Challenge to the AI finding itself:** the model classified the staged failure as `LOCATOR_OR_UI_CHANGE` (0.85) where the deterministic rule classified the same evidence as `TIMING_OR_FLAKINESS` (0.72). Reviewer judgement: the AI classification is the better one for this input, because the error is a timeout on a *specific, previously stable* selector rather than a general wait failure. The deterministic rule is retained unchanged as the safe default; it is not tuned to match the model, since matching a single sample would be overfitting.
- **Corrections Made:**
  1. `DEFAULT_AI_MODEL` changed to `gemini-flash-lite-latest`, with the evidence recorded in-code.
  2. Bounded retry (3 attempts, exponential backoff) added for HTTP 429/503 so a transient demand spike no longer silently degrades the entire run to the deterministic path. 404 is deliberately **not** retried, being a configuration fault.
  3. Fallback reasons split into `ai_model_retired` and `ai_overloaded`, so the audit trail distinguishes "we configured the wrong model" from "the provider was busy" instead of collapsing both into `ai_http_error`.
  4. Secret-redaction pattern extended to cover the `AQ.` API-key prefix, which the previous `Bearer|sk-|AIza` pattern would not have matched.
- **Privacy / Guardrail Notes:** The API key was supplied as an environment variable only; it is absent from the repository, from `report.json`/`report.md`, and from this log. `.env` remains gitignored and CI continues to read `secrets.AI_API_KEY`. Provider error bodies are passed through `sanitizeText` before being logged. The failure telemetry remained wrapped in the `UNTRUSTED_TELEMETRY` envelope throughout. **Action required:** the key used for this verification was exposed in a chat transcript and must be rotated.

#### Human Sign-Off

- **Reviewer:** Junaid
- **Decision:** `<Approved | Approved with Adjustments | Rejected / Needs Re-run>`
- **Date (PKT / UTC):** `<YYYY-MM-DD>`

---
### Entry 3 — `2026-11-28` | `fi-01-script-fault` (FI-01 controlled script fault)

- **Run Context:** Local run on branch `fi-01-script-fault`, cut from `main` @ `db887a60` ("Decrease Smoke tests"). Target test: `tests/ui/catalog/product-detail.spec.ts` (`@AE-12`).
- **Execution Mode:** `ai-assisted`
- **Provider / Model:** `gemini` / `gemini-flash-lite-latest`
- **Injected Fault:** commit `76d127898a6e35b4a1eab62450141d9113fb2a66` changed `src/pages/ProductDetailsPage.ts:103` from `expect(total).toBe(unitPrice * quantity)` to `expect(total).toBe(unitPrice * (quantity + 1))`, making the test assert an arithmetically wrong cart total while the application remained untouched.
- **Repair:** commit `6d14cb0239faf6f5f72727afe9ddd244b8cbee5f` restored the original oracle. Minimal patch (one line): https://github.com/junaidali0007/qa-ai-level3/compare/76d127898a6e35b4a1eab62450141d9113fb2a66...6d14cb0239faf6f5f72727afe9ddd244b8cbee5f

#### AI RCA Output Summary

- **Category:** `PRODUCT_DEFECT`
- **Severity:** `MEDIUM`
- **Confidence:** `0.85`
- **Summary:** `The test asserted a cart total or quantity of 2000, but the application calculated or displayed 1500, indicating a potential logic defect in the cart calculation.`
- **Recommended Action:** `Investigate the product's pricing logic or cart calculation service on the backend/frontend to ensure quantity increases correctly update the total to 2000.`

#### Critical Review, Challenges & Corrections

- **Agreement / Discrepancy: REJECTED.** The AI classified an injected test-side fault as `PRODUCT_DEFECT` at 0.85 confidence. The correct classification is `TEST_SCRIPT_DEFECT`. This is precisely the error the assignment prohibits ("do not claim a real product defect from injected behavior"), and it was caught by human review rather than by the tooling.

- **Evidence ruling out `PRODUCT_DEFECT`:** the application was never modified and behaved identically throughout. `docs/evidence/fi-01/before-pass.txt` (before injection) and `docs/evidence/fi-01/after-fix-pass.txt` (after repair) both pass against the same live site, with commit `76d1278` as the only intervening change — and that commit touches a test oracle, not application code. The site's rendered cart total was correct in every run. `docs/evidence/fi-01/error-context.md` is the exact input the collector passed to the classifier and contains no application-side anomaly.

- **Why the model could not have known:** the telemetry contract in `tools/rca/analyze.ts` sends only `testTitle`, `sanitizedErrorMessage`, `availableArtifacts` and `hasTraceOrScreenshot`. It sends no code diff and no commit SHA, both of which the RCA specification lists under the "Collect" stage. A wrong expected value in a test and a wrong computed value in the application produce byte-identical telemetry, so the discriminating evidence was never available. The misclassification is therefore traceable to a gap in evidence collection, not to model judgement alone.

- **Second finding — miscalibrated confidence:** `analyze.ts` caps confidence at 0.55 only when no screenshot or trace exists (`hasVisualOrTrace`). This run had both, so the raw 0.85 passed through uncapped. The guard keys on artifact *presence* rather than artifact *relevance*: `test-failed-1.png` and `trace.zip` prove the interaction occurred but cannot discriminate between the competing hypotheses. The guard did not merely fail to fire — it permitted the overclaim. Per the RCA specification an unverified hypothesis must read as low-confidence or `UNKNOWN`, never as fact; 0.85 states it as fact.

- **Deterministic comparison:** the deterministic path alone would have returned `UNKNOWN` at 0.40 for this error shape, because `expect(received).toBe(expected)` matches none of the interstitial, network, timeout or strict-mode rules in `classifyDeterministically()`. For this fault the deterministic fallback was the **safer** answer — uncertain and honest rather than confident and wrong.

- **Corrections Made:** the injected oracle was reverted in `6d14cb0` and the test verified passing (`after-fix-pass.txt`). Neither the deterministic rules nor the model prompt were changed before recording this result, so the evidence reflects the system as it actually behaved. Follow-up identified and deferred: (1) cap `PRODUCT_DEFECT` confidence below 0.5 unless code-diff evidence corroborates it; (2) instruct the model that an assertion mismatch alone cannot support `PRODUCT_DEFECT`; (3) extend `collect.ts` to gather commit SHA and recent diffs per the "Collect" stage.

- **Privacy / Guardrail Notes:** No product defect is claimed against automationexercise.com. The fault was introduced deliberately by the engineer, is confined to a branch that is never merged, and the failure is test-controlled by construction. The API key was supplied via environment variable only and appears nowhere in the repository, in `report.json`/`report.md`, or in this log. Failure telemetry remained inside the `UNTRUSTED_TELEMETRY` envelope.

- **RCA accuracy on this injection: 0 / 1.** Recorded as a miss. The analyzer was not re-run to obtain a more favourable classification.

#### Human Sign-Off

- **Reviewer:** Junaid
- **Decision:** AI classification **rejected**; human classification `TEST_SCRIPT_DEFECT` adopted; repair validated and approved.
- **Date (PKT / UTC):** 2026-11-28

---
## Additional Entry Template (Copy for Next Finding)

### Entry `<N>` — `<YYYY-MM-DD>` | `<Test ID or Run / PR Reference>`

- **Run Context:** `<Local or CI run details>`
- **Execution Mode:** `<ai-assisted | deterministic-fallback | deterministic>`
- **Provider / Model:** `gemini` / `gemini-2.5-flash`
- **Target / Failure Summary:** `<Brief description>`

#### AI RCA Output Summary

- **Category:** `<category>`
- **Severity:** `<severity>`
- **Confidence:** `<confidence>`
- **Summary:** `<summary>`
- **Recommended Action:** `<recommendedAction>`

#### Critical Review, Challenges & Corrections

- **Agreement / Discrepancy:** `<Notes on accuracy and limitations>`
- **Corrections Made:** `<Any manual overrides or follow-up actions>`
- **Privacy / Guardrail Notes:** `<PII redaction and policy compliance check>`

#### Human Sign-Off

- **Reviewer:** `<Name / GitHub handle>`
- **Decision:** `Approved` | `Approved with Adjustments` | `Rejected / Needs Re-run`
- **Date (PKT / UTC):** `<YYYY-MM-DD>`
