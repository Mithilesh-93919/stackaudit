# PRICING_DATA — AI Tool Pricing Reference

Data sources and methodology for `data/pricing.json`.

---

## Data Sources

| Tool | Source | Last Verified |
|------|--------|--------------|
| ChatGPT Plus | https://openai.com/chatgpt/pricing | 2025-01 |
| Claude Pro | https://www.anthropic.com/claude | 2025-01 |
| Cursor | https://cursor.com/pricing | 2025-01 |
| GitHub Copilot | https://github.com/features/copilot | 2025-01 |
| Gemini Advanced | https://one.google.com/about/ai-premium | 2025-01 |
| OpenAI API | https://openai.com/api/pricing | 2025-01 |
| Anthropic API | https://www.anthropic.com/api | 2025-01 |

---

## Update Process

1. Check vendor pricing pages monthly
2. Update `data/pricing.json`
3. Bump `meta.lastUpdated` field
4. Update this document's verification dates
5. Add changelog entry in DEVLOG.md

---

## Tools To Add

- [ ] Perplexity Pro
- [ ] Midjourney
- [ ] Runway
- [ ] ElevenLabs
- [ ] Notion AI
- [ ] Grammarly Business
- [ ] Codeium
- [ ] Amazon CodeWhisperer
- [ ] Tabnine
- [ ] Jasper AI
- [ ] Copy.ai

---

## Pricing Methodology

### Seat-based tools
- Record per-seat monthly price
- Record annual price (usually 15-20% discount)
- Note minimum seat requirements

### Usage-based tools (APIs)
- Record input/output token prices per 1M tokens
- Note any volume discounts
- Track free tier limits

### Enterprise tools
- Mark as `null` (contact sales)
- Note typical range if known from public sources

---

## Known Complexities

1. **Volume discounts** — API pricing often has non-linear tiers
2. **Committed use discounts** — Annual commitments at 15-40% off
3. **Enterprise custom pricing** — Not publicly disclosed
4. **Feature-gated models** — Some features only on higher tiers
5. **Bundled tools** — e.g., Microsoft 365 Copilot bundled with Office
