# DEVLOG — StackAudit Development Changelog

Reverse-chronological log of development decisions, progress, and blockers.

---

## [2025-Q2] — Project Initialized

### Setup
- [x] Next.js 15 App Router scaffolded
- [x] TypeScript strict mode configured
- [x] Tailwind CSS v4 configured
- [x] shadcn/ui initialized
- [x] Folder architecture created
- [x] lib/ placeholder modules created
- [x] data/pricing.json populated with initial tool data
- [x] TypeScript type system defined (audit, tools, user)
- [x] Import aliases configured (@/*)
- [x] Environment variables structure defined
- [x] Git initialized

### Decisions
- Used Next.js 15 App Router (not Pages Router) — RSC + streaming support
- Chose Supabase over PlanetScale — built-in auth + RLS simplifies multi-tenant
- Tailwind v4 — PostCSS-native, faster, modern config
- shadcn/ui — owns the component code, not a black box dependency

### Next Steps
- [ ] Install and configure shadcn/ui components
- [ ] Build landing page
- [ ] Set up Supabase project
- [ ] Build audit wizard (multi-step form)
- [ ] Implement audit-engine.ts core logic

---

<!-- Add new entries above this line -->
