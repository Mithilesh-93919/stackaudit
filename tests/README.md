/**
 * @file tests/README.md
 * # Testing Strategy
 *
 * ## Stack
 * - **Unit**: Jest + React Testing Library
 * - **Integration**: Jest with MSW (Mock Service Worker)
 * - **E2E**: Playwright
 *
 * ## Commands
 * - `npm test` — Run all unit/integration tests
 * - `npm run test:watch` — Watch mode
 * - `npx playwright test` — E2E tests
 *
 * ## Coverage Targets
 * - lib/ — 90%+
 * - components/ — 80%+
 * - app/api/ — 90%+
 *
 * ## Structure
 * tests/
 *   unit/        — Pure function tests (lib, utils)
 *   integration/ — API route tests
 *   e2e/         — Playwright tests
 *   fixtures/    — Shared test data
 *   __mocks__/   — Module mocks
 */
