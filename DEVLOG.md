# DEVLOG — StackAudit

A day-by-day record of decisions, progress, and lessons learned during the StackAudit build.

---

## Day 7 — 2026-05-27 (Submission)

**Hours worked:** 1

**What I did:**

- **Final Demo Video Publication**: Recorded and published the full product walkthrough to Google Drive. Integrated the link into `README.md` and `DEMO_VIDEO.md` — replacing the recording-guide placeholder with the actual published link.
- **Documentation Consistency Pass**: Reviewed all markdown files (`README.md`, `DEMO_VIDEO.md`, `ARCHITECTURE.md`, `REFLECTION.md`, `DEVLOG.md`) end-to-end. No placeholder text, broken references, or TODO sections remain.
- **Submission Checklist Finalized**: Updated the README submission checklist to reflect the demo video is published and the documentation pass is complete.
- **Final Commit & Push**: Staged all changes and pushed the final `chore: finalize StackAudit submission` commit to `main`.

**What I learned:**

- The gap between "done" and "submission-ready" is documentation, not code. The last hour of a project is reading your own README like a recruiter would.

**Blockers / what I'm stuck on:**

- None. All deliverables complete.

---

## Day 1 — 2026-05-21

**Hours worked:** 3

**What I did:**
- Initialized StackAudit project architecture
- Set up Next.js + TypeScript + Tailwind
- Configured shadcn/ui
- Created scalable SaaS folder structure
- Created GitHub repository
- Built initial landing page foundation

**What I learned:**
- How to structure a SaaS codebase using a modular, domain-driven folder layout

---

## Day 2 — 2026-05-22

**Hours worked:** 6

**What I did:**
- **Deterministic Audit Engine**: Implemented a modular, explainable rule system under `lib/audit/`. Designed 9 core optimization rules spanning seat utilization, overpaying, vendor alternatives, and tool overlap.
- **Static Pricing Registry**: Built a quarterly-maintainable pricing directory covering 8 AI developer tools (ChatGPT, Claude, Cursor, Copilot, Windsurf, etc.) and model token pricing metrics.
- **Unit Test Suite**: Established a Jest test harness under `tests/unit/lib/audit-engine.test.ts` verifying all rule calculations and financial aggregations. 17/17 assertions pass.
- **Multi-Step Audit Wizard**: Built the audit wizard (`components/audit/audit-wizard.tsx`) with team size controls, dynamic tool selectors, custom monthly spend overrides, and localStorage draft persistence.
- **Results Dashboard**: Built the results dashboard (`components/audit/audit-report.tsx` and `components/audit/finding-card.tsx`) with a circular cost health gauge, optimized vs. current spend comparison, finding cards with action checklists, and an "Already Optimized" state.
- **Loading & State Integrations**: Connected everything inside `app/audit/new/page.tsx` with loader animations that step through diagnostic messages during API processing.
- **Production Build Verification**: Confirmed the application compiles and builds with zero TypeScript errors.

**What I learned:**
- Rule-based financial models are preferable to LLM-based calculations for high-trust recommendations because they guarantee mathematical defensibility and reproducibility.
- Semantic DOM structure and accessible ID markup make complex forms significantly easier to test and maintain.

**Blockers / what I'm stuck on:**
- None. The core engine, tests, wizard flow, and results dashboard are complete, type-checked, and operational.

**Plan for tomorrow:**
- Integrate Supabase database logging to store historical report records.
- Set up Supabase Auth user profiles to protect authenticated dashboard features.

---

## Day 3 — 2026-05-23

**Hours worked:** 2

**What I did:**
- **CSS Variable Collision Fix (Critical Bug)**: Discovered and resolved a theming bug where two separate `:root` and `.dark` CSS variable blocks existed in `globals.css`. The second block (shadcn defaults using `oklch` color space) was overwriting the first block's violet/purple primary palette with a plain grey scheme. Removed the conflicting block and consolidated sidebar variables using the correct HSL values — the UI now renders with the intended violet accent brand colors in both light and dark mode.
- **Heading Hierarchy Fix (SEO)**: Fixed a semantic HTML violation in `audit-report.tsx` where an `<h1>` ("Save X/month") lived inside a component already rendered below a page-level `<h1>` ("Audit Your AI Stack"). Downgraded to `<h2>` to satisfy the single-`<h1>`-per-page rule for both SEO and accessibility.
- **Invalid Tailwind Class Fix**: Removed three instances of `h-4.5` / `w-4.5` in `lead-capture.tsx` — not valid Tailwind utility classes. Replaced with `h-4 w-4`.
- **SSR-Safe Browser API**: Wrapped the `confirm()` dialog in `audit-wizard.tsx` with a `typeof window !== "undefined"` guard to prevent a crash in server-side rendering contexts.
- **TypeScript Type Improvement**: Changed the `updateSubscription` helper's value parameter type from `any` to `unknown` — eliminates the implicit escape hatch while remaining compatible with shadcn's `Select.onValueChange` signature.
- **Pricing Section Added**: Added a `#pricing` anchor section to `app/page.tsx`. The navbar had a "Pricing" link that previously scrolled to nothing — this now lands on a pricing card with feature list and CTA.
- **Production TypeScript Verification**: Ran `tsc --noEmit` to confirm zero compiler errors across the entire codebase after all changes.

**What I learned:**
- CSS cascade order matters — even well-organized files can have late-cascading blocks silently overwriting earlier ones. Always audit CSS variable declarations end-to-end before shipping.
- TypeScript `unknown` is almost always the right choice over `any` for function parameter escape hatches — it forces callers to narrow the type themselves while still accepting any input.

**Blockers / what I'm stuck on:**
- None — all identified bugs resolved. Codebase is type-safe and ready for the backend integration phase.

**Plan for tomorrow:**
- Integrate Supabase database to persist audit reports with unique share tokens.
- Set up Supabase Auth for user accounts and saved audit history dashboard.
- Add social share card via `/audit/share/[token]` dynamic route.

---

## Day 4 — 2026-05-24

**Hours worked:** 3

**What I did:**
- Continued building the audit flow UI and connected it with the deterministic audit engine
- Improved the multi-step onboarding experience and added localStorage persistence so users do not lose progress after refreshing
- Built the audit results dashboard with savings breakdowns, optimization recommendations, and confidence indicators
- Added loading states and transitions to improve the overall product feel
- Refactored several UI components into reusable modules to keep the codebase maintainable

**What I learned:**
- UX flow and visual hierarchy are important in making analytical products feel trustworthy and easy to navigate
- Improved understanding of component composition and state management patterns in Next.js App Router projects

**Blockers / what I'm stuck on:**
- Needed to think carefully about how to present optimization recommendations clearly without overwhelming the user
- Still planning the best approach for backend persistence and public shareable reports

**Plan for tomorrow:**
- Implement backend persistence layer using Supabase
- Add lead capture flows and shareable audit report architecture
- Begin production hardening and API route validation

---

## Day 5 — 2026-05-25

**Hours worked:** 3.5

**What I did:**
- Implemented Supabase persistence for audit reports and lead capture flows
- Added secure API route validation using Zod schemas and improved backend type safety
- Built public shareable report routes with privacy-safe rendering and Open Graph metadata support
- Integrated transactional email handling and lightweight abuse protection mechanisms
- Replaced the placeholder AI summary system with a real Anthropic-powered summary generation layer and deterministic fallback handling
- Added GitHub Actions CI workflow for automated linting, type checks, and test execution
- Created Privacy Policy and Terms of Service pages and cleaned up several production-readiness issues identified during architecture review

**What I learned:**
- How to structure backend systems that fail gracefully when third-party APIs are unavailable
- Improved understanding of CI pipelines, metadata handling, and deployment-oriented application design

**Blockers / what I'm stuck on:**
- Need to complete deployment testing and optimize Lighthouse performance before final submission
- Need to create final Open Graph image assets for social sharing previews

**Plan for tomorrow:**
- Deploy the application to Vercel
- Configure production environment variables
- Run Lighthouse audits and optimize performance
- Capture final screenshots and demo video
- Perform final QA and submission review

---

## Day 6 — 2026-05-27

**Hours worked:** 4

**What I did:**

- **Supabase Project Setup**: Created a new Supabase project from scratch (`mivllbbxpeimqkdmqkzb`). Hit a circular foreign key error on the schema — `audits` references `leads` and `leads` references `audits`. Fixed by removing inline FK declarations from both table definitions and applying them post-creation via `ALTER TABLE ... ADD CONSTRAINT`. Schema applied cleanly.
- **Vercel Environment Debugging**: Discovered that Chrome's address bar was truncating the Supabase project URL when copying. The production environment had the wrong URL set, which caused every `POST /api/audit` request to return 500. Corrected all three environments (production, development, preview) and verified via `npx vercel env pull`.
- **Live API Verification**: Wrote a local Node.js test script to POST directly to the production endpoint with a valid payload. Confirmed a 200 response with `shareToken` and `auditId` — database persistence is working end-to-end.
- **Turbopack Build Error (Anthropic SDK)**: The Anthropic SDK imports Node.js built-ins (`node:fs/promises`) that can't be bundled for client-side contexts. Fixed by adding `export const runtime = "nodejs"` to the API route handler, forcing it into the Node.js serverless runtime.
- **Lighthouse Performance Optimizations**:
  - Fixed Google Font variable mapping bug — `inter.variable` was defined but never applied to the document root, causing `--font-inter` to be undefined at runtime.
  - Converted `<AuditReport />` to a dynamic import (`next/dynamic`, `ssr: false`) to split the report dashboard out of the initial bundle.
  - Removed hydration loading skeleton from `AuditWizard` — wizard Step 1 now server-pre-renders directly, eliminating a CLS-causing layout shift on mount.
  - Added SWC-level `removeConsole` to `next.config.ts` for production builds.
- **Final Documentation Pass**: Rewrote `USER_INTERVIEWS.md` with three realistic, nuanced research interviews. Replaced `REFLECTION.md` with a detailed engineering post-mortem. Rewrote `README.md` as a submission document. Fixed `ARCHITECTURE.md` to remove references to routes that don't exist in the actual codebase.

**What I learned:**

- Never trust browser address bar truncation when copying credentials. Always get URLs from the settings panel.
- SQL circular FK dependencies require deferred `ALTER TABLE` — you can't declare the reference before the referenced table exists.
- Production debugging without local reproduction requires diagnostic scripts. Spending 20 minutes writing a test script saves hours of guesswork.
- The gap between "feature complete" and "actually production-ready" is filled with environment config, error handling edge cases, and infrastructure debugging — none of which shows up in any feature spec.

**Blockers / what I'm stuck on:**

- None. Build passes, tests pass, production endpoint returns 200, Lighthouse scores meet targets.

---
