# StackAudit — Architecture

## Overview

StackAudit is a multi-tenant SaaS application built on Next.js 15 App Router with a clean domain-driven architecture.

---

## System Design

```
┌─────────────────────────────────────────────────────────┐
│                      Vercel Edge                        │
├─────────────────────────────────────────────────────────┤
│                   Next.js 15 App                        │
│  ┌────────────────┐  ┌────────────────┐                 │
│  │   Marketing    │  │   Dashboard    │                 │
│  │  (public)      │  │  (authed)      │                 │
│  └────────────────┘  └────────────────┘                 │
│  ┌─────────────────────────────────────┐                │
│  │          API Route Handlers          │                │
│  │  /api/audit  /api/tools  /api/user  │                │
│  └─────────────────────────────────────┘                │
├─────────────────────────────────────────────────────────┤
│                    lib/ (Business Logic)                 │
│  audit-engine │ pricing │ ai │ utils │ validations      │
├─────────────────────────────────────────────────────────┤
│                   External Services                      │
│  Supabase (DB + Auth) │ OpenAI │ Anthropic              │
└─────────────────────────────────────────────────────────┘
```

---

## Route Architecture

```
app/
├── layout.tsx                    # Root layout (fonts, providers)
├── page.tsx                      # Landing page (/)
├── (marketing)/
│   ├── pricing/page.tsx          # /pricing
│   ├── about/page.tsx            # /about
│   └── blog/                     # /blog/*
├── (dashboard)/
│   ├── layout.tsx                # Auth guard + sidebar layout
│   ├── dashboard/page.tsx        # /dashboard
│   ├── audit/
│   │   ├── new/page.tsx          # /audit/new (wizard)
│   │   └── [id]/page.tsx         # /audit/:id (report)
│   ├── tools/page.tsx            # /tools
│   └── settings/page.tsx        # /settings
└── api/
    ├── audit/route.ts            # POST /api/audit
    ├── tools/route.ts            # GET /api/tools
    └── user/route.ts             # GET/PATCH /api/user
```

---

## Key Design Decisions

### 1. Route Groups
- `(marketing)` — unauthenticated pages with landing layout
- `(dashboard)` — authenticated pages with sidebar layout
- Avoids layout bleed between contexts

### 2. Server Components by Default
- All components are RSC unless explicitly marked `"use client"`
- Data fetching happens in Server Components
- Client components only for interactivity (forms, charts, state)

### 3. Multi-tenant Data Model
- `organization` is the tenancy boundary
- All data scoped to `organization_id` via RLS in Supabase
- Users belong to one organization (v1), multiple (v2)

### 4. AI Tool Pricing Data
- Stored in `data/pricing.json` for fast loading
- Updated manually + via scheduled job
- Source of truth for audit calculations

### 5. Audit Score
- 0–100 composite score
- Factors: redundancy, utilization, cost efficiency, overlap
- Deterministic algorithm (reproducible)

---

## Data Flow

```
User fills Audit Wizard
  → POST /api/audit
    → runAudit() in lib/audit-engine.ts
      → Lookups in data/pricing.json
      → AI recommendations via lib/ai.ts
      → Result stored in Supabase
        → AuditReport rendered in /audit/:id
```

---

## Security

- All API routes validate session via Supabase JWT
- Row Level Security enforced at DB level
- Environment variables never exposed to client
- CORS restricted to own domain in production
- Input validated with Zod on all API routes

---

## Performance Targets

| Metric | Target |
|--------|--------|
| LCP | < 1.5s |
| FID | < 100ms |
| CLS | < 0.1 |
| Lighthouse | 95+ |
| TTFB | < 200ms |
