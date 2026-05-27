# REFLECTION — Building StackAudit

*An honest post-mortem on five days of building a production SaaS product from scratch.*

---

## Why This Was Harder Than Expected

The pitch sounds simple: a form wizard that takes AI tool subscriptions as input, runs some math, and shows you a savings dashboard. A weekend project, maybe. But scope has a way of expanding when you're trying to build something that actually feels production-ready.

What I underestimated was how much of the complexity is *invisible* — not in the features themselves, but in the edges around them. Input validation that fails gracefully. API routes that don't crash when Anthropic is down. A database schema with two tables that reference each other circularly. A font variable that loads but never gets mapped to the document root. None of these appear on any spec doc.

---

## The Hardest Engineering Problems

### 1. Circular Foreign Key Reference in the Database Schema

This cost me the most debugging time relative to how simple the eventual fix was.

The `audits` table has a `lead_id` column that references `leads(id)`. The `leads` table has an `audit_id` column that references `audits(id)`. Both are nullable — the relationship is optional in both directions. Logically fine. SQL disagrees.

When I ran the schema in Supabase, it threw `relation "leads" does not exist` because `audits` was being created first and trying to reference `leads` before that table existed. The fix was to remove the inline `REFERENCES` constraint from both table definitions and add them back at the end using `ALTER TABLE ... ADD CONSTRAINT`. This is the correct way to handle circular FK dependencies, but it's not obvious until you've hit the error.

```sql
-- Wrong: inline reference on table creation
lead_id uuid references leads(id) on delete set null,

-- Right: deferred ALTER TABLE after both tables exist
ALTER TABLE audits ADD CONSTRAINT fk_audits_lead
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL;
```

### 2. Turbopack Client-Side Import Errors

Early in the project, the Anthropic SDK was being bundled for client-side rendering because of how the module graph resolved. Turbopack threw: `the chunking context does not support external modules (request: node:fs/promises)`. The SDK uses Node.js built-ins (`fs/promises`, `net`, `tls`) that cannot run in a browser context.

The fix was adding `export const runtime = "nodejs"` to the API route handler. This forces the route into the Node.js runtime rather than the edge runtime, which doesn't support native modules. The route was always intended to be server-only — the error exposed that the runtime annotation was missing.

### 3. Vercel Environment Variables and Deployment Debug Cycle

The Supabase URL I was copying from the browser's address bar was being truncated by Chrome. The URL `https://mivllbbxpeimqkdmqkzb.supabase.co` appeared as `https://mivllbbxpeimqkdmq...` in the address bar. I copied the truncated version into the Vercel environment variables and didn't notice for two deploys.

This caused every `POST /api/audit` request to return 500, and since Vercel's log filtering by branch was defaulting to `main` with no results, I couldn't see the actual error messages. Debugging required writing a local Node.js script to directly test the Supabase connection with the explicit URL. Once I confirmed the connection worked locally, the URL mismatch became obvious.

The lesson: never trust what the browser address bar shows you for credentials. Always get URLs from the API settings panel directly.

---

## What Was Overengineered

**The multi-currency system.** I built a full `CurrencyProvider` context with live exchange rates (hardcoded but swappable), a `FormattedAmount` component that handles SSR hydration safely, and a dropdown UI that persists the user's selection to `localStorage`. This adds meaningful complexity to the codebase and has essentially zero impact on the audit engine's actual value. Every price the engine uses is in USD. The currency selector is a UI nicety.

In retrospect, I should have launched with USD-only and added currency as a v2 feature if users outside the US became a real segment. I built it because it felt like good engineering practice. It is. But it wasn't the right thing to build on day 2.

**The loading animation step system.** The `LOADING_STEPS` array in `app/audit/new/page.tsx` creates a fake diagnostic sequence — "Initializing rules engine... Analyzing seat capacity..." — that cycles through messages while the API is processing. It's purely theater. The backend audit completes in under 200ms. The 2.5 second delay is artificial.

This is a product decision I made deliberately, not a mistake. It *does* make the product feel more substantial. But it's engineered fakery, and I'm aware of that.

---

## What I Would Do Differently

**Authentication from day one.** The current architecture has no user accounts. There's no login, no saved history, no dashboard to return to. The shareable report link (`/audit/share/[token]`) is genuinely useful, but without accounts, users can't retrieve their own past audits. This is the single biggest functional gap in the product.

I skipped auth because Supabase Auth would have added another day of setup, and I wanted the core product working first. The right decision given the constraints, but it means the "return visitor" experience is basically nothing.

**TypeScript strict mode from the start, not as an afterthought.** I added type improvements incrementally (like changing `any` to `unknown` in form handlers) rather than designing types carefully upfront. This created some technical debt in the component layer where TypeScript is doing less useful work than it should be.

**Thinner first pass on the UI.** I spent more time on the visual layer than I should have in the early days. The gradient backgrounds, animation states, dark/light mode system, and currency selector are all good. But they took time away from the product's core functionality, and some features I wanted to build (usage analytics, historical comparisons) got cut because of it.

---

## How Deterministic Logic Was Separated From AI Generation

This was one of the most intentional architectural decisions.

The audit engine in `lib/audit/` is purely mathematical. It runs rules against structured input (subscriptions, seats, spend) and produces a structured output (recommendations, savings, score). No AI involved. No natural language. No external calls. Fully testable with Jest, 100% reproducible.

The AI summary in `lib/ai.ts` sits entirely outside this core. It receives the *output* of the deterministic engine — a structured `AuditSummaryInput` object — and transforms it into a 2-sentence narrative. If the Anthropic call fails, times out, or is misconfigured, the engine's own `generateSummary()` function produces a template-based fallback. The result is indistinguishable to most users.

The API route (`app/api/audit/route.ts`) wires these together in sequence: run the engine, then optionally enrich with AI. The AI step is genuinely non-blocking — the deterministic result is returned regardless of what the AI layer does.

This separation was the right call for a financial tool specifically because recommendations need to be **auditable**. A CTO looking at a savings recommendation of "$240/month" needs to be able to trace that back to actual math — seat counts, price tiers, utilization rates. AI-generated financial advice that can't be traced is not advice anyone will act on.

---

## AI Integration Lessons

**Timeouts are not optional.** The first draft of `generateAuditSummary()` had no timeout. In testing, Anthropic's API typically responds in 1–2 seconds. In production, under load or when there are service issues, it can take 15+ seconds or not respond at all. A 15-second delay in an API route that the user is waiting on is completely unacceptable. Adding `Promise.race()` against a hard 8-second timeout was non-negotiable.

**The system prompt does more work than you think.** Early versions of the prompt produced summaries with bullet points and markdown headers, which broke the UI rendering. Adding "Output exactly 2 sentences of plain prose. No markdown, no lists." to the system prompt fixed this completely. Small prompt changes have large output-format effects.

**Track whether AI was used.** The `aiSummaryGenerated` boolean in the API response isn't shown to users prominently, but it lets me understand in logs how often the AI path is actually taken vs. the fallback. Without this, it's impossible to debug "why is the summary bad" reports because you don't know which code path generated it.

---

## Tradeoffs Made Under Time Constraints

| Tradeoff | What Was Sacrificed | Justification |
|---|---|---|
| No auth | Return visitor experience | Core product had to work first |
| Hardcoded pricing | Freshness | Runtime accuracy vs. deployment complexity |
| No usage data | Utilization recommendations | Would require browser extension or API integrations |
| No E2E tests | Test coverage completeness | Unit tests cover the critical financial logic |
| Fake loading animation | Transparency | Product feel vs. honest feedback |

---

## Mistakes and Reversals

**I initially tried to make the landing page a Server Component that also renders the audit wizard.** This broke immediately because the wizard uses `useState`, `useEffect`, and `localStorage` — it's fundamentally client-side. I had to restructure the page hierarchy and move the wizard to a dedicated `/audit/new` route with its own `"use client"` boundary. This was the right architecture from the start; I wasted an hour realizing it.

**The CSS variable collision bug** (Day 3) was embarrassing in retrospect. I had two separate `:root` blocks in `globals.css` — one with the violet brand palette and one from the shadcn import that used oklch colors. The second block was silently overwriting the first. The app was shipping with flat grey instead of the intended purple accent for at least a day before I caught it. The fix was trivial. The lesson was to audit CSS variable declarations holistically, not just check "does it look right in dev mode."

**I almost added Stripe integration.** I wrote a few hundred lines of a subscription management system before realizing it was entirely premature. The product has zero paying users. Adding payment infrastructure before validating willingness-to-pay is a classic mistake. I deleted it.

---

## What Building This Taught Me About Production SaaS

**The surface area of "production-ready" is enormous.** A working feature is maybe 40% of the work. The rest is error handling, edge cases, validation, fallback behavior, security headers, rate limiting, environment configuration, and documentation. Each one of these is easy to skip and hard to explain why you skipped it.

**Database schema design has long-term consequences.** The circular FK issue and the field naming decisions I made on Day 1 couldn't be changed without a migration. Schema decisions are permanent in a way that TypeScript types are not.

**Deployment isn't the finish line.** Getting the build to pass and the site to load was not the hard part. The hard part was debugging a 500 error in a serverless environment with no local reproduction path, figuring out why environment variables weren't propagating, and verifying that a database table actually existed in a remote Supabase project I'd just created.

**Product thinking and engineering are genuinely different skills.** The best engineering decisions I made — deterministic engine, fallback AI, shareable tokens, rate limiting — were made because I was thinking about what the product needed to be trustworthy, not what would be technically interesting to build. The worst time I spent — the multi-currency system, the elaborate loading animation — was when I was prioritizing engineering craft over product value.
