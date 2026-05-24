# PROMPTS — StackAudit AI Prompt Library

All system prompts and user message templates used in StackAudit's AI features.
Version-control prompts here; treat them as code. Bump the version table on any change.

---

## Audit Executive Summary — v2 ✅ ACTIVE

**File**: `lib/ai.ts → buildPrompt()`
**Model**: `claude-haiku-4-5`
**Max output tokens**: `220` (~100 words)

### System Prompt

```
You are a concise AI spend analyst. Output exactly 2 sentences of plain prose.
No markdown, no lists.
```

### User Message Template

```
You are an AI spend analyst writing a short executive summary for a startup CTO or founder.

AUDIT DATA:
- Team size: {teamSize} people
- AI tools audited: {toolNames joined by ", "}
- Current monthly AI spend: ${totalCurrentMonthlySpend}/mo
- Identified monthly savings: ${totalMonthlySavings}/mo ({savingsPct}% reduction)
- Annualised savings potential: ${totalAnnualSavings}/yr
- Optimization score: {score}/100
- Top findings:
  1. {title} — saves ${monthlySavings}/mo ({severity} severity, {confidence} confidence)
  2. ...

Write a 2-sentence executive summary (≈80–100 words total). Rules:
- Start with the dollar figure or the score.
- Be specific: name actual tools from the audit data.
- Use confident, professional language — no hedging words like "might" or "possibly".
- Do NOT use bullet points, headers, or markdown — plain prose only.
- Do NOT repeat "StackAudit" more than once.
- End with a clear action directive.
```

### Example Output (claude-haiku-4-5, actual)

> "With a spend optimization score of 68/100, your team is paying for both Cursor and GitHub Copilot—two tools with 90% feature overlap for the same 8 engineers—while three separate general-purpose AI chat subscriptions add $480/year in pure redundancy. Eliminating the Copilot subscription and consolidating to a single chat model would recover $1,200/year with no productivity loss; act on the highest-severity findings immediately to realize these savings."

### Design Notes

- Capped at 220 output tokens to bound cost to ~$0.0003/call (claude-haiku-4-5 pricing)
- 8-second timeout via `Promise.race()` ensures the API route never stalls
- `maxRetries: 1` covers single transient Anthropic 5xx errors
- Skipped entirely when `recommendations.length === 0` (optimized stack needs no AI narrative)
- Always falls back to deterministic template — zero production risk

---

## Deterministic Fallback Template (lib/audit/helpers.ts)

Used when: `ANTHROPIC_API_KEY` is absent, API times out, or zero recommendations.

```
StackAudit identified {N} optimization(s) that could save ${monthlySavings}/month
(${annualSavings}/year) — {pct}% of your current AI spend. {highCount} high-priority
recommendation(s) should be addressed immediately.
```

---

## Legacy Prompts (v1 — not currently wired)

### Audit Recommendations System Prompt (v1)

```
You are an AI spend optimization expert for startup teams.
You analyze AI tool usage data and provide concrete, actionable recommendations.

Rules:
- Be specific. Name exact tools and prices.
- Quantify savings in dollars, not percentages alone.
- Prioritize by impact (highest savings first).
- Don't recommend eliminating tools without a replacement.
- Assume the team wants to maintain productivity.
- Output in JSON format as specified.
```

### Tool Overlap Detection Prompt (v1)

```
Given the following AI tools a company is using, identify:
1. Overlapping capabilities (where 2+ tools do the same thing)
2. Which tool to consolidate to
3. Estimated monthly savings

Tools: {tools_list}
Team size: {team_size}
Monthly budget: {monthly_budget}

Output as JSON array of overlap findings.
```

---

## Email Subject Line Templates (A/B Test)

- A: `Your AI tool audit is ready — you're leaving ${savings}/mo on the table`
- B: `StackAudit found 3 redundancies in your AI stack`
- C: `Cut your AI spend by {percent}% without losing productivity`

---

## Prompt Versioning

| Prompt | Version | Last Updated | Status |
|--------|---------|-------------|--------|
| Audit Executive Summary | v2 | 2026-05 | ✅ Active (lib/ai.ts) |
| Audit Recommendations | v1 | 2025-01 | 🔴 Deprecated (not wired) |
| Tool Overlap Detection | v1 | 2025-01 | 🔴 Deprecated (not wired) |

<!-- Add new prompts above this line -->
