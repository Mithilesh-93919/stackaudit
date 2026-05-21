# REFLECTION — StackAudit Product Thinking

A running document of key product, technical, and business reflections.

---

## Why StackAudit?

Most startups are spending $2,000–$15,000/month on AI tools without any centralized visibility. The problem:

1. **Shadow AI spend** — Individual contributors subscribe independently
2. **Tool overlap** — Teams pay for ChatGPT AND Claude AND Copilot with 60% feature redundancy
3. **Unused seats** — Enterprise plans with 80% inactive seats
4. **No CFO dashboard** — No single view of AI ROI

StackAudit solves this by being the first audit-first, optimization-focused AI spend management tool.

---

## Key Hypotheses

| Hypothesis | Status | Validation Method |
|-----------|--------|-----------------|
| Startups don't know their total AI spend | Unvalidated | User interviews |
| 30%+ spend is redundant or duplicated | Unvalidated | Audit data |
| CTOs/CFOs would pay $99/mo to know | Unvalidated | Sales conversations |
| Manual audit takes 4+ hours | Unvalidated | User interviews |

---

## Competitive Landscape

| Competitor | What they do | Gap |
|-----------|-------------|-----|
| Zylo | Enterprise SaaS management | Too expensive, no AI focus |
| Torii | SaaS discovery | No audit/recommendations |
| Productiv | Usage analytics | Enterprise only |
| Blissfully | SaaS inventory | Acquired/dead |
| **StackAudit** | AI spend audit | Startup-focused, AI-native |

**Moat**: AI-specific pricing intelligence + recommendation engine. No one does this for the SMB/startup segment.

---

## Technical Reflections

- Next.js App Router was the right call — RSC enables fast initial load for audit reports
- Supabase simplifies auth + multi-tenancy vs. rolling our own
- Keeping `data/pricing.json` in-repo means fast reads but requires update process

---

## What Could Go Wrong

1. **Data staleness** — AI tool prices change often; we need an update pipeline
2. **Scope creep** — Temptation to build expense tracking instead of audit
3. **B2B sales motion** — Self-serve may not work for enterprise; need outbound
4. **AI accuracy** — Recommendations must be defensible, not generic

---

<!-- Add reflections as you build -->
