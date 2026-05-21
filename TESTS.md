# TESTS — StackAudit Testing Strategy

## Philosophy

- Test behavior, not implementation
- Every lib/ function must have unit tests
- Every API route must have integration tests
- Critical user flows covered by E2E

---

## Stack

| Layer | Tool | Purpose |
|-------|------|---------|
| Unit | Jest + ts-jest | Pure function testing |
| Components | React Testing Library | Component behavior |
| API | Jest + MSW | Route handler testing |
| E2E | Playwright | Full user journey |
| Coverage | Istanbul (built into Jest) | Coverage reporting |

---

## Installation

```bash
# Unit + Integration
npm install -D jest @types/jest ts-jest jest-environment-jsdom
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install -D msw

# E2E
npm install -D @playwright/test
npx playwright install
```

---

## Test Structure

```
tests/
├── unit/
│   ├── lib/
│   │   ├── audit-engine.test.ts
│   │   ├── pricing.test.ts
│   │   ├── ai.test.ts
│   │   └── utils.test.ts
│   └── components/
│       ├── shared/
│       └── audit/
├── integration/
│   └── api/
│       ├── audit.test.ts
│       └── tools.test.ts
├── e2e/
│   ├── landing.spec.ts
│   ├── audit-wizard.spec.ts
│   └── dashboard.spec.ts
└── fixtures/
    ├── audit-report.ts
    └── tools.ts
```

---

## Coverage Targets

| Module | Target |
|--------|--------|
| `lib/audit-engine.ts` | 90% |
| `lib/pricing.ts` | 90% |
| `lib/utils.ts` | 95% |
| `app/api/**` | 85% |
| `components/**` | 75% |

---

## CI Integration

Tests run on every PR via GitHub Actions:
1. `npm run type-check`
2. `npm run lint`
3. `npm test -- --coverage`
4. `npx playwright test` (on main branch only)
