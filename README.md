# StackAudit

> **Audit your AI tool spend. Cut waste. Optimize your stack.**

StackAudit is a SaaS platform that helps startups audit their AI tool spending (ChatGPT, Claude, Cursor, Copilot, Gemini, and more) and recommends cost optimizations.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| AI | OpenAI / Anthropic |
| Deployment | Vercel |

---

## 📁 Project Structure

```
stackaudit/
├── app/                    # Next.js App Router
│   ├── (marketing)/        # Landing, pricing, blog pages
│   ├── (dashboard)/        # Authenticated app pages
│   ├── api/                # API Route Handlers
│   └── globals.css         # Global styles
├── components/
│   ├── ui/                 # shadcn/ui primitives
│   ├── shared/             # Layout components (Navbar, Footer)
│   ├── audit/              # Audit-specific components
│   ├── forms/              # Form components
│   └── charts/             # Data visualization
├── lib/
│   ├── audit-engine.ts     # Core audit logic
│   ├── pricing.ts          # Pricing calculations
│   ├── ai.ts               # AI provider integrations
│   ├── utils.ts            # Shared utilities
│   ├── validations.ts      # Zod schemas
│   └── supabase.ts         # Database client
├── data/
│   └── pricing.json        # AI tool pricing data
├── types/                  # TypeScript types
├── hooks/                  # Custom React hooks
├── tests/                  # Test suite
└── public/                 # Static assets
```

---

## 🛠 Development Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix lint errors
npm run type-check   # TypeScript check
npm run test         # Run tests
npm run format       # Prettier format
```

---

## 🌱 Environment Variables

See `.env.example` for all required variables.

---

## 📖 Documentation

| File | Purpose |
|------|---------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System design decisions |
| [DEVLOG.md](./DEVLOG.md) | Development changelog |
| [TESTS.md](./TESTS.md) | Testing strategy |
| [PRICING_DATA.md](./PRICING_DATA.md) | Pricing data sources |
| [PROMPTS.md](./PROMPTS.md) | AI prompt library |
| [GTM.md](./GTM.md) | Go-to-market strategy |
| [ECONOMICS.md](./ECONOMICS.md) | Unit economics |
| [METRICS.md](./METRICS.md) | KPIs & success metrics |

---

## 📄 License

Private — All rights reserved.
