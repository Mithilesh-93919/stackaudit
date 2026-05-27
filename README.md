# StackAudit

> **Audit your AI tool spend. Find waste. Optimize your stack.**

StackAudit helps startup teams audit what they're paying for AI tools — ChatGPT, Claude, Cursor, GitHub Copilot, Gemini, and more — identify redundant subscriptions and idle seats, and get dollar-quantified optimization recommendations in under 5 minutes. No account required.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)](https://vercel.com)
[![CI](https://github.com/Mithilesh-93919/stackaudit/actions/workflows/ci.yml/badge.svg)](https://github.com/Mithilesh-93919/stackaudit/actions/workflows/ci.yml)

---

## Live Demo

**Production URL:** [https://stackaudit-fawn.vercel.app](https://stackaudit-fawn.vercel.app)

Start a free audit at [/audit/new](https://stackaudit-fawn.vercel.app/audit/new) — no login required.

---

## Screenshots

### Landing Page

![StackAudit landing page — dark hero with violet gradient and tool badges](public/screenshots/landing-desktop.png)

*Dark-mode hero: "Stop Paying for AI Tools Your Team Doesn't Use" — with tool badges for ChatGPT, Claude, Cursor, GitHub Copilot, and more.*

### Audit Wizard — Step 1: Team Context

![Audit wizard step 1 — team size selection with quick-select buttons](public/screenshots/audit-wizard-step1.png)

*Step 1 of 4: Company name and team size. Quick-select buttons (2, 5, 10, 25, 50, 100) or custom input. SSR pre-rendered — zero layout shift on load.*

### Audit Wizard — Step 2: Select Your Stack

![Audit wizard step 2 — AI tool selection grid with check states](public/screenshots/audit-wizard-step2.png)

*Step 2 of 4: Tool selection grid showing Cursor, GitHub Copilot, Claude, ChatGPT, Gemini, Windsurf, Anthropic API, and OpenAI API with live selection counter.*

### Audit Wizard — Step 3: Plan Details

![Audit wizard step 3 — per-tool subscription configuration](public/screenshots/audit-wizard-step3.png)

*Step 3 of 4: Per-tool plan tier, seat count, monthly spend, and active seat configuration. Auto-recalculates spend on plan or seat changes.*

### Results Dashboard — Dark Mode

![Audit results dashboard in dark mode showing Save $270/month](public/screenshots/audit-results.png)

*Results dashboard: Health Score **21/100**, **Save $270/month** ($3,240/year annualized). AI summary, current vs. optimized cost bar, and 3 dollar-quantified recommendations.*

### Optimization Recommendations

![Optimization recommendations list with HIGH PRIORITY Cursor + Copilot finding](public/screenshots/optimizations.png)

*Recommendations sorted by financial impact. Each card shows tool names, severity badge, confidence, monthly savings, and annual savings.*

### Light Mode vs. Dark Mode

| Light Mode | Dark Mode |
|---|---|
| ![Light mode results](public/screenshots/light-mode.png) | ![Dark mode results](public/screenshots/dark-mode.png) |

*Full system-aware theming with manual toggle. Both modes use the same violet accent palette.*

---

## Demo Video

> **Loom title:** `StackAudit — AI Spend Audit SaaS Demo (2 min)`  
> **Loom description:** `A walkthrough of StackAudit, a deterministic AI spend audit tool built in 5 days. See the 4-step wizard, AI-powered savings report, shareable report links, and dark/light mode.`

### Recording Script (target: 2–3 minutes)

| Timestamp | Action | Talking Point |
|-----------|--------|---------------|
| 0:00–0:20 | Open live URL, show landing page | "StackAudit audits your AI tool spend — no login required." |
| 0:20–0:35 | Click "Audit My Stack — Free" | Show the transition into the wizard |
| 0:35–0:50 | Step 1: set team size to 10 | "We use team size to detect seat overprovisioning" |
| 0:50–1:10 | Step 2: select ChatGPT, Claude, Cursor, GitHub Copilot | Point out the tool grid and check states |
| 1:10–1:30 | Step 3: keep defaults, show idle seats warning | "The engine checks declared active seats vs. purchased seats" |
| 1:30–1:40 | Step 4: show review screen with total spend | "$340/month declared" |
| 1:40–1:55 | Click Run Audit — let loader play | "The loading animation covers real API processing" |
| 1:55–2:15 | Show results dashboard | "Score 21/100, $270/month savings identified — 79% reduction" |
| 2:15–2:30 | Expand Cursor + Copilot finding card | Show the action checklist inside the card |
| 2:30–2:45 | Click Share Audit Card | "Public shareable link — send directly to your CFO" |
| 2:45–2:55 | Toggle dark/light mode | Point out the theme persistence |
| 2:55–3:00 | Resize to mobile in DevTools | Show the responsive layout |

**Recommended tools:** Loom (easiest), OBS Studio, or QuickTime (macOS Screen Recording)

---

## Feature Overview

| Feature | Description |
|---------|-------------|
| **Multi-step Audit Wizard** | 4-step form: team size → tool selection → plan details → review |
| **Deterministic Audit Engine** | Rules-based financial model with 9 optimization rules |
| **AI Executive Summary** | Claude Haiku-powered 2-sentence summary; deterministic fallback if API unavailable |
| **Cost Health Score** | 0–100 composite score factoring redundancy, utilization, and overlap |
| **Dollar-Quantified Recommendations** | Every finding shows exact monthly and annual savings |
| **Shareable Reports** | Public `/audit/share/[token]` URL — shareable with finance or leadership |
| **Lead Capture** | Email capture on results page, persisted to Supabase + Resend email delivery |
| **Dark / Light Mode** | Full system-aware theming with manual override |
| **Multi-Currency Display** | USD, INR, EUR, GBP, CAD, AUD via `Intl.NumberFormat` |
| **Draft Persistence** | Wizard state auto-saved to `localStorage` — resumable across sessions |
| **Rate Limiting** | 15 audits/hour/IP via in-memory sliding window |
| **Privacy Pages** | `/privacy` and `/terms` with legally realistic startup wording |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Vercel (CDN + Serverless)                │
├─────────────────────────────────────────────────────────────┤
│                      Next.js 16 App Router                   │
│                                                              │
│  /          → Landing page (static SSG)                      │
│  /audit/new → Audit wizard + results (client component)      │
│  /audit/share/[token] → Public shared report (SSR)           │
│  /privacy, /terms → Static legal pages                       │
│                                                              │
│  API Routes (Node.js runtime)                                │
│  POST /api/audit   → Run audit + persist to Supabase         │
│  GET  /api/audit/[token] → Fetch audit by share token        │
│  POST /api/leads   → Capture lead email                      │
│  GET  /api/tools   → List supported tool registry            │
│  GET  /api/health  → Uptime check                            │
├─────────────────────────────────────────────────────────────┤
│                       lib/ (Business Logic)                  │
│  audit-engine.ts   → Orchestrates audit run                  │
│  audit/rules/      → 9 modular optimization rules            │
│  audit/pricing-data.ts → Static pricing registry             │
│  ai.ts             → Anthropic Claude summary (with fallback) │
│  supabase.ts       → Public + admin Supabase clients         │
│  validations.ts    → Zod schemas for all API inputs          │
│  backend-utils.ts  → Rate limiting + IP utilities            │
├─────────────────────────────────────────────────────────────┤
│                     External Services                        │
│  Supabase (PostgreSQL) │ Anthropic Claude │ Resend Email     │
└─────────────────────────────────────────────────────────────┘
```

### Key Design Decisions

- **Deterministic engine first, AI second.** The audit engine produces financially defensible results using only math and business rules. The AI summary is a non-blocking enrichment layer — if it fails, the product still works completely.
- **Server Components by default.** Only components with state, effects, or browser APIs are marked `"use client"`. The landing page and share page are fully server-rendered.
- **No auth in v1.** Reports are identified by URL-safe share tokens (12-char, 72-bit entropy). Users share links; no accounts required to view a report.
- **Graceful degradation everywhere.** Rate limiter, AI summary, email delivery — each can fail independently without breaking the core audit flow.

---

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Next.js 16.2.6 (App Router) | Turbopack in dev |
| Language | TypeScript 5 (strict mode) | Full type coverage |
| Styling | Tailwind CSS v4 | CSS custom properties, no config file |
| UI Components | shadcn/ui + Base UI | Radix primitives |
| Database | Supabase (PostgreSQL) | Service role key for server-side writes |
| AI | Anthropic claude-haiku-4-5 | Executive summary only; ~$0.0003/call |
| Email | Resend | Transactional audit confirmation |
| Deployment | Vercel | Serverless functions, auto-deploys from `main` |
| Testing | Jest + ts-jest | Unit tests for audit engine |
| CI | GitHub Actions | Lint → type-check → tests on every push |
| Validation | Zod v4 | All API route inputs |

---

## Project Structure

```
stackaudit/
├── app/
│   ├── layout.tsx              # Root layout (fonts, providers, metadata)
│   ├── page.tsx                # Landing page (/)
│   ├── globals.css             # CSS variables + base styles
│   ├── audit/
│   │   ├── new/page.tsx        # Audit wizard + results (/audit/new)
│   │   └── share/[token]/      # Public shared report (/audit/share/:token)
│   ├── api/
│   │   ├── audit/route.ts      # POST /api/audit
│   │   ├── audit/[token]/      # GET /api/audit/:token
│   │   ├── leads/route.ts      # POST /api/leads
│   │   ├── tools/route.ts      # GET /api/tools
│   │   └── health/route.ts     # GET /api/health
│   ├── privacy/page.tsx        # /privacy
│   └── terms/page.tsx          # /terms
├── components/
│   ├── ui/                     # shadcn/ui primitives
│   ├── shared/                 # Navbar, ThemeToggle, CurrencySelector
│   ├── audit/                  # AuditWizard, AuditReport, FindingCard, LeadCapture
│   └── providers/              # ThemeProvider, CurrencyProvider
├── lib/
│   ├── audit-engine.ts         # Main runAudit() orchestrator
│   ├── audit/
│   │   ├── rules/              # 9 modular rule functions
│   │   ├── pricing-data.ts     # Static tool + plan registry
│   │   ├── helpers.ts          # Score, summary, ID generation
│   │   └── types.ts            # AuditInput, AuditResult, Recommendation
│   ├── ai.ts                   # generateAuditSummary() with fallback
│   ├── supabase.ts             # getSupabaseAdmin() + getSupabasePublic()
│   ├── validations.ts          # Zod schemas
│   ├── backend-utils.ts        # Rate limiting
│   └── utils.ts                # cn() and shared utilities
├── types/
│   └── database.ts             # Supabase generated types
├── tests/
│   └── unit/lib/
│       └── audit-engine.test.ts  # 17 assertions on the audit engine
├── supabase/
│   └── schema.sql              # Full DB schema with RLS policies
├── .github/
│   └── workflows/ci.yml        # GitHub Actions CI pipeline
└── public/                     # Static assets
```

---

## Local Setup

### Prerequisites

- Node.js 20+
- npm 10+
- A Supabase project (free tier works)
- Optional: Anthropic API key (for AI summaries)
- Optional: Resend API key (for email delivery)

### Installation

```bash
# Clone the repository
git clone https://github.com/Mithilesh-93919/stackaudit.git
cd stackaudit

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
```

### Environment Variables

Edit `.env.local` with your values:

```bash
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase — required for audit persistence
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Anthropic — optional, enables AI executive summaries
# Falls back to deterministic template if absent
ANTHROPIC_API_KEY=sk-ant-...

# Resend — optional, enables lead capture emails
RESEND_API_KEY=re_...
```

### Database Setup

Run the schema in your Supabase SQL editor:

```bash
# Open supabase/schema.sql and paste it into the Supabase SQL editor
# Or use the Supabase CLI:
supabase db push
```

### Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Database Schema

Two core tables, both with Row Level Security enabled:

**`audits`** — One row per completed audit run. Stores inputs, outputs, and the full result JSON for share page rendering. Contains a unique `share_token` (12-char, URL-safe) for public links.

**`leads`** — Stores email capture submissions linked to an audit via `audit_id`. Contains role, company, team size, and marketing consent.

The schema uses a deferred `ALTER TABLE` pattern to handle the circular FK relationship between `audits.lead_id → leads` and `leads.audit_id → audits`.

---

## Development Commands

```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Build for production
npm run start        # Start production server locally
npm run lint         # Run ESLint
npm run lint:fix     # Auto-fix lint errors
npm run type-check   # TypeScript strict check (no emit)
npm run test         # Run Jest unit tests
npm run format       # Prettier format
```

---

## Testing

The audit engine — the core financial logic — is unit-tested with Jest:

```bash
npm test
```

**Test coverage:**
- `tests/unit/lib/audit-engine.test.ts` — 17 assertions
- Covers: rule calculations, financial aggregations, score computation, edge cases (zero spend, single tool, perfect utilization)

**Testing philosophy:** Test the rules engine thoroughly since it produces financial recommendations. UI components are verified visually; the engine is verified mathematically.

See [TESTS.md](./TESTS.md) for the full testing strategy.

---

## CI/CD Pipeline

Every push to `main` triggers the GitHub Actions workflow at `.github/workflows/ci.yml`:

1. `npm ci` — clean install
2. `npm run lint` — ESLint
3. `npm run type-check` — TypeScript strict check
4. `npm test` — Jest unit tests

Vercel auto-deploys on merge to `main`. Preview deployments are generated for every pull request.

---

## Audit Engine

The engine in `lib/audit/` is fully deterministic — no AI, no randomness. It runs 9 rules against a structured input:

**Per-subscription rules:**
- `overPayingForSeats` — Total seats purchased > team size
- `idleSeatDetection` — Active seats significantly below total seats
- `downgradeAvailable` — Cheaper plan covers actual usage
- `apiAlternativeAvailable` — API access cheaper than managed plan for developers

**Cross-subscription rules:**
- `codingToolOverlap` — Cursor + GitHub Copilot co-licensed for same team
- `chatToolOverlap` — ChatGPT Plus + Claude Pro redundancy
- `redundantGeneralChat` — Multiple general-purpose chat subscriptions

Each rule returns a `Recommendation` with title, description, monthly savings, severity (critical/high/medium/low), confidence, and an action checklist. Results are sorted by highest savings, aggregated into a score, and stored in Supabase.

---

## AI Summary

`lib/ai.ts` wraps Anthropic's Claude (`claude-haiku-4-5`) to produce a 2-sentence executive summary from the deterministic engine's output.

**How it works:**
1. Engine runs first, always produces a complete result
2. If `ANTHROPIC_API_KEY` is set, API call is made with a hard 8-second timeout
3. On success, the AI summary replaces the template summary
4. On failure (timeout, rate limit, missing key), the deterministic template is used transparently

**Why claude-haiku-4-5:** Fastest Anthropic model, ~$0.0003 per call, typically responds in under 2 seconds. The `aiSummaryGenerated` boolean in the API response indicates which path was taken.

---

## Security & Abuse Protection

| Protection | Implementation |
|-----------|---------------|
| Rate limiting | 15 audits/hr/IP — in-memory sliding window |
| Input validation | Zod schemas on all API routes |
| Service role isolation | `SUPABASE_SERVICE_ROLE_KEY` never exposed to client |
| Security headers | `X-Frame-Options: DENY`, `X-Content-Type-Options`, `Referrer-Policy` |
| Honeypot field | `_hp` field in lead capture form rejects bot submissions |
| Environment variable safety | Build-time fallback placeholders prevent crashes on missing env vars |

---

## Lighthouse Scores

Measured on production deployment (https://stackaudit-fawn.vercel.app):

| Category | Score |
|----------|-------|
| Performance | ~85+ |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

**Key performance optimizations applied:**
- `next/font/google` with `display: swap` for Inter + Geist
- Dynamic import of `<AuditReport />` (splits ~11KB from initial bundle)
- Server-side pre-rendering of wizard Step 1 (eliminates hydration CLS)
- Production console removal via SWC compiler
- AVIF/WebP image formats configured

---

## Future Improvements

Given more time, these are the highest-priority improvements:

1. **User Accounts & Audit History** — Supabase Auth, saved audit sessions, a returning-user dashboard
2. **Usage Data Integration** — Browser extension or OAuth integrations to import actual usage data rather than declared usage
3. **Pricing Data Pipeline** — Quarterly automated pricing updates (scraper or manual process with changelogs)
4. **Export to PDF/CSV** — Downloadable audit reports for finance review
5. **Team Comparison Mode** — Multiple audits compared side-by-side
6. **Email Summaries** — Automated monthly re-audit reminders via Resend
7. **Stripe Integration** — Paid tiers once willingness-to-pay is validated
8. **E2E Tests** — Playwright test suite for wizard → results → share flow

---

## Additional Documentation

| File | Purpose |
|------|---------| 
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System design and key decisions |
| [DEVLOG.md](./DEVLOG.md) | Day-by-day development log |
| [REFLECTION.md](./REFLECTION.md) | Engineering post-mortem and lessons learned |
| [USER_INTERVIEWS.md](./USER_INTERVIEWS.md) | User research and discovery findings |
| [DEMO_VIDEO.md](./DEMO_VIDEO.md) | Demo video recording script and metadata |
| [TESTS.md](./TESTS.md) | Testing strategy and coverage targets |
| [PRICING_DATA.md](./PRICING_DATA.md) | AI tool pricing data sources and methodology |
| [PROMPTS.md](./PROMPTS.md) | Anthropic prompt library |
| [GTM.md](./GTM.md) | Go-to-market strategy |
| [ECONOMICS.md](./ECONOMICS.md) | Unit economics |
| [METRICS.md](./METRICS.md) | KPIs and success metrics |

---

## Submission Checklist

- [x] Production deployment live at `stackaudit-fawn.vercel.app`
- [x] Custom Supabase project with full schema applied
- [x] All environment variables configured in Vercel (production + development)
- [x] GitHub Actions CI passing on `main`
- [x] Jest unit tests passing (17/17 assertions)
- [x] TypeScript strict mode — zero errors
- [x] ESLint — zero warnings
- [x] Lighthouse Performance ≥85, Accessibility 100, Best Practices 100, SEO 100
- [x] Dark/light mode working across all pages
- [x] Mobile responsive layout verified
- [x] Shareable report links functional (`/audit/share/[token]`)
- [x] Lead capture flow saves to Supabase
- [x] AI summary falls back gracefully when API key is absent
- [x] Rate limiting active on `/api/audit`
- [x] Privacy Policy and Terms pages live
- [x] Screenshots captured and committed to `public/screenshots/`
- [x] README updated with embedded screenshots and demo video script
- [x] DEMO_VIDEO.md recording guide complete
- [x] All markdown documentation complete and consistent

---

## License

Private — All rights reserved © 2026 StackAudit
