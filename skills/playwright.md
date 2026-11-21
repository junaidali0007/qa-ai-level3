# Skill: Playwright Authoring (`skills/playwright.md`)

## Purpose
Author maintainable, isolated, deterministic TypeScript + `@playwright/test` specs, page objects, API clients, and fixtures[cite: 2, 3, 4, 5].

## Locator & Interaction Policy
- Prefer accessible locators (`getByRole`, `getByLabel`, `getByText`), then stable attributes (`data-qa`, `id`, or scoped selectors); document any exception.
- Never use arbitrary fixed sleeps (`waitForTimeout`) or blanket `{ force: true }` clicks[cite: 2, 5].

## Isolation, Data & Safety
- Use isolated users, unique IDs, per-worker fixtures, and teardown cleanup (including failure paths)[cite: 2, 3, 5].
- Never share a mutable account across concurrent tests[cite: 2, 5].
- Never commit secrets, personal data, or real payment cards; use invented dummy payment values only on this practice site[cite: 2, 3, 5].
- Keep worker counts and retries restrained to avoid abusive load on `https://automationexercise.com`[cite: 1, 2, 5].

## Assertions & Tracing
- Assert domain outcomes (cart math, address fixture equality, downloaded file validity, API response fields)—not just visibility[cite: 2, 3, 5].
- Tag scenarios with scenario IDs (e.g., `AE-06`), priority (`@P0`, `@P1`, `@P2`), and suite tags (`@smoke`)[cite: 2, 3, 5].
- Require PR review, type-checking, linting, and passing tests before accepting AI-generated code[cite: 2, 4, 5].
