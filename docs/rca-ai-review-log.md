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

### Entry 1 — `2026-MM11-23` | `feat/day-4-ai-rca`

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

- **Agreement / Discrepancy:** gemini-2.5-flash returned HTTP 404 during npm run rca:analyze, and querying /v1beta/models for this API key returned only specialized/preview/audio/embedding models (lyria-*, _-tts_, robotics-er, computer-use, antigravity, deep-research, gemini-embedding-001) rather than a standard text-generation chat model.
- **Corrections Made:** tools/rca/analyze.ts on its deterministic fallback guardrail instead of forcing a non-text model (such as TTS or embedding) to perform RCA classification, allowing report.md and report.json to complete safely with deterministic rules.
- **Privacy / Guardrail Notes:** Confirmed HTTP 404 handled gracefully without crashing the pipeline or exposing secrets/PII; next step is re-verifying live AI mode once a key with a standard text Gemini model is used (and keeping npm run rca:collect ahead of npm run rca:analyze).

#### Human Sign-Off

- **Reviewer:** Junaid
- **Decision:** Approved
- **Date (PKT / UTC):** 2026-11-23 08:20 PKT

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
