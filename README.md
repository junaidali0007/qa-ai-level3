QA AI Level-3 (qa-ai-level3)
Playwright and TypeScript test automation framework paired with an AI-assisted, human-governed Root-Cause Analysis (RCA) workflow for [https://automationexercise.com](https://automationexercise.com).

Setup
Install Node.js LTS (v22+) and clone this repository.

Install dependencies and Chromium:

npm ci

npx playwright install chromium

Copy .env.example to .env for local configuration (optional; leave AI_API_KEY empty to run deterministic model-free RCA fallback):

cp .env.example .env

NPM Commands
npm run typecheck — Run TypeScript type checking (tsc --noEmit).

npm run lint — Run ESLint checks.

npm run format:check — Check Prettier formatting.

npm test — Run the full Playwright test suite.

npm run test:smoke — Run @smoke tagged tests.

npm run test:ui — Run UI test suites (tests/ui/).

npm run test:api — Run API test suites (tests/api/).

npm run rca:collect — Collect and sanitize deterministic failure artifacts.

npm run rca:analyze — Generate structured JSON and Markdown RCA reports.

Test Tags
@smoke — Critical path subset used for quick verification and 3-run stability gates.

@P0, @P1, @P2 — Risk priority tags mapped to docs/traceability-matrix.md.

AE-01 .. AE-24 — Scenario IDs linked to requirements and test evidence.

Local & CI Configuration
Local: Configured via playwright.config.ts and config/env.config.ts (BASE_URL, AI_PROVIDER, AI_MODEL). Never commit .env, secrets, personal data, or real payment card details.

CI (GitHub Actions): Configured in .github/workflows/playwright.yml to run on pull requests, manual workflow_dispatch, and daily at 00:00 UTC (05:00 Asia/Karachi). Artifacts (HTML/JSON/JUnit reports, traces, screenshots, and RCA reports) are uploaded even when tests fail (if: always()).

Limitations & External-Site Assumptions
Automation Exercise ([https://automationexercise.com](https://automationexercise.com)) is a third-party public practice website whose content, payloads, and anti-bot challenge pages (such as "One moment, please...") may vary across runs.

Concurrency (workers: 2) and retries are intentionally restrained to avoid abusive load on the public site, and anti-bot controls are never bypassed.