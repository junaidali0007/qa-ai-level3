# Skill: Test Design (`skills/test-design.md`)

## Purpose
Design risk-prioritized UI, API, and cross-layer test scenarios for Automation Exercise with explicit oracles and boundary coverage[cite: 2, 3, 4, 5].

## Inputs
- Assignment scenario requirements (`AE-01` through `AE-24`)[cite: 3, 5]
- Risk tiers (`P0`, `P1`, `P2`) and business impact[cite: 3, 4, 5]
- Reference test-case mappings (Automation Exercise UI test cases and API list)[cite: 3, 5, 7]

## Outputs
- Traceable test cases linked to `docs/traceability-matrix.md` (`ID`, `priority`, `feature`, `steps`, `test data`, `expected outcome`, `automation layer`, `source test-case mapping`, `evidence`, `status`)[cite: 3, 5]
- Negative/boundary scenarios and explicit missing-oracle questions where site behavior is undocumented or ambiguous[cite: 3, 5, 7]

## Rules & Guardrails
- Do not blindly copy reference steps; design independent boundaries and assertions beyond simple visibility[cite: 2, 3].
- Flag any assumptions or undocumented site behaviors for human review[cite: 5, 7].
- Human reviewer approves test coverage and priority rankings before implementation[cite: 4].
