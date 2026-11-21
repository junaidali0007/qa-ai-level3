# Skill: Root-Cause Analysis (`skills/rca.md`)

## Purpose
Produce evidence-grounded, structured failure diagnoses with calibrated confidence while preventing unverified claims, anti-bot bypass attempts, or data leaks.

## Allowed RCA Categories
- `PRODUCT_DEFECT`
- `TEST_SCRIPT_DEFECT`
- `LOCATOR_OR_UI_CHANGE`
- `TEST_DATA_OR_STATE`
- `ENVIRONMENT_OR_NETWORK`
- `TIMING_OR_FLAKINESS`
- `THIRD_PARTY_DEPENDENCY`
- `UNKNOWN`

## Evidence Hierarchy & Workflow
1. **Detect**: Read Playwright JSON/JUnit results, test ID, error, stack, retry count, run URL, and commit SHA.
2. **Collect**: Gather trace, screenshot, DOM snapshot (if captured), console errors, sanitized request failures, and recent code diffs.
3. **Correlate**: Pinpoint the failing assertion and prior step; separate root cause from downstream symptoms.
4. **Hypothesize**: Rank competing causes and record evidence for and against each.
5. **Validate**: Re-run isolated test or inspect locator/API payload/diff; never silently edit test files.
6. **Recommend**: Output classification, calibrated confidence (`0.0`–`1.0`), severity, reproduction steps, minimal proposed fix, owner, and next action.
7. **Publish**: Write both a human-readable Markdown report and a structured JSON record (including `UNKNOWN` cases and fallback summary when AI is unavailable).

## Interstitial & Anti-Bot Challenge Rule
- When failure evidence shows `EXTERNAL_INTERSTITIAL_BLOCK` or a page title/content matching `"One moment, please..."` (or a WAF/challenge screen), treat it as an external challenge or network/environment condition rather than a confirmed product bug or broken locator.
- Prioritize `ENVIRONMENT_OR_NETWORK` or `THIRD_PARTY_DEPENDENCY` as the leading hypothesis when supported by the screenshot, trace, and error message; if artifacts are incomplete or inconclusive, lower confidence or use `UNKNOWN`.
- Never recommend bypassing anti-bot controls, spoofing headers/fingerprints, flooding requests, adding arbitrary sleeps, or weakening assertions. Recommend waiting, checking network/runner IP behavior, and running with low concurrency (`workers <= 2`).

## Uncertainty & Privacy Rules
- Every classification must cite actual artifacts and rule out alternatives; missing artifacts automatically lower confidence or yield `UNKNOWN`.
- When `AI_API_KEY` is not set or an AI call fails, produce a deterministic model-free summary from the sanitized failure bundle instead of failing the RCA pipeline.
- Never send full page text, secrets, personal data, or unredacted logs/payment fields to an external AI model.