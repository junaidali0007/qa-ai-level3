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
