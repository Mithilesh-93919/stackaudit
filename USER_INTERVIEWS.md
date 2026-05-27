# USER_INTERVIEWS — Discovery Research

**Goal:** Understand whether uncontrolled AI spend is a real, painful problem — and whether people would actually change behavior because of it.

**Method:** Informal 30-min conversations over Discord and LinkedIn DMs. No script, just starting with "walk me through how your team uses AI tools right now."

---

## Interview #1 — Aryan, Indie Developer / Freelancer

**Date:** May 2026  
**Background:** Solo freelancer, builds web apps for clients. 3 years into freelancing. Uses Cursor + ChatGPT Plus + occasionally Claude when ChatGPT is slow.  
**Company size:** 1 (himself)

### Raw Notes

I asked Aryan how much he spends on AI tools monthly. He paused for a moment and said — *"Honestly? I'd have to add it up. Cursor is like $20, ChatGPT is $20, I think I'm on the Pro tier for Claude but I forgot I was even paying for it."*

That turned out to be $60/month. Not huge, but he estimated he was probably using Claude less than 5 times a week. When I pushed on why he kept paying for Claude if he barely used it, he said — *"I don't know, I always mean to cancel it. It's one of those things where it's not enough money to be annoying, but it's still kind of dumb that I'm paying for it."*

He uses ChatGPT for writing and explanations, Cursor almost exclusively for actual coding. I asked if he thought there was overlap. He thought for a second: *"Yeah, Cursor has its own model now so technically I don't need ChatGPT for coding stuff. But I'm used to ChatGPT for everything else. I'd feel weird without it."*

On the tool value question: *"Cursor genuinely makes me faster. I don't know about ChatGPT — I use it a lot but I couldn't tell you if it actually saves me time or if I'm just used to it."*

He was skeptical about paying for an audit product. *"If this just shows me a dashboard saying 'you should cancel Claude,' I don't need to pay for that. I could figure that out myself. But the reason I haven't is not because I don't know — it's because it's $20 and it feels like too small an issue to bother with."*

### Insights

- **The real problem isn't awareness — it's inertia.** Aryan knew he was underusing Claude. The issue is that no individual subscription is painful enough to act on.
- **Overlap isn't about features, it's about habits.** Cursor technically has chat features that replace ChatGPT for coding, but he kept ChatGPT because of familiarity.
- **The "small amounts" problem.** $20/month doesn't register as worth auditing. This suggests the value prop is stronger for teams, not solo devs — the numbers multiply.
- **Surprising:** He wasn't tracking spend at all and had forgotten he even had a Claude subscription. The audit actually showed him something he didn't know.

### How This Influenced the Product

- Strengthened conviction that **the primary ICP is teams, not solos**. At $60/month for one person, the product doesn't deliver dramatic savings.
- Confirmed we need to show **annualized** savings numbers, not monthly — $240/year feels more real than $20/month.
- Added *seat utilization* as a core metric because individual habits don't scale cleanly to team decisions.

---

## Interview #2 — Priya, Technical Co-Founder at a 12-person SaaS Startup

**Date:** May 2026  
**Background:** CTO of a B2B SaaS startup with 12 engineers. Running ChatGPT Team, GitHub Copilot Business, and Cursor for different parts of the team. Some engineers also have personal Claude subscriptions that get expensed.  
**Company size:** 12 engineers, ~35 total

### Raw Notes

This one got uncomfortable fast. When I asked how she tracks AI spend, she laughed — *"We don't, really. It shows up in Brex and my finance person flags it every quarter. Last quarter she came to me with a spreadsheet and I was like — wait, we're spending $4,000 a month on this? I had no idea."*

She broke it down: ChatGPT Team for the whole company ($30/seat × 35 = $1,050), GitHub Copilot Business for engineers ($19 × 12 = $228), Cursor Pro for 8 engineers who requested it ($20 × 8 = $160), plus scattered individual Claude subscriptions her finance team had flagged ($600 in one quarter = ~$200/month unchecked).

*"The thing that annoyed me is we have Copilot AND Cursor. Half the engineers use one, half use the other. Nobody knows who's using what. I've been meaning to standardize but it's hard because engineers are very opinionated about their tools."*

On whether she'd considered canceling anything: *"I brought up Copilot with one of my leads and he basically said 'don't touch it, I'll quit.' I'm joking but not really. So instead I just... don't deal with it. The cost is manageable, the political cost of changing it is not."*

On the idea of StackAudit: *"If you showed me a report I could bring to my finance meeting, I'd use it. But I don't want a tool that tells me to cancel things — I want something I can use to justify what we're keeping. The direction is different than you might think."*

This was a surprise. She wanted **justification**, not cuts. Her job isn't to save money, it's to not get questioned by the CFO.

She pushed back on the accuracy concern: *"If your tool says 'you're wasting $600/month on Claude subscriptions,' that's a tool recommendation, not a fact. How do I know those engineers aren't using it productively? You can't measure productivity."*

### Insights

- **The actual decision-maker is often the CFO, not the CTO.** Priya was trying to avoid scrutiny, not find savings.
- **"Justify" is a stronger use case than "cut."** She wants a report she can walk into a meeting with. This reframes the product entirely.
- **Seat standardization is politically hard.** Engineers are tribal about tools. Recommending cancellation of a tool engineers use daily is a governance problem, not a math problem.
- **Surprising finding:** She didn't want to save money per se — she wanted *defensibility*. She'd pay for something that made her look responsible in finance reviews.
- **AI subscriptions that come through expense reports are invisible in billing dashboards.** A major data visibility gap.

### How This Influenced the Product

- Added the **"already optimized"** success state to the report — sometimes users need confirmation they're not wasting money, not a list of cuts.
- The **shareable report link** (`/audit/share/[token]`) was partly motivated by this: a URL you can send to your CFO or finance team.
- Reframed landing page copy away from "save money" toward "understand your AI spend" — the job-to-be-done is visibility and justification, not just cuts.
- Acknowledged that **usage data is missing** from our model — we only have seat counts and spend, not actual utilization. This is noted as a major future improvement.

---

## Interview #3 — Dhruv, CS Student / Side-Project Developer

**Date:** May 2026  
**Background:** 3rd-year CS student at a Tier-1 engineering college. Runs 2–3 side projects simultaneously. Has GitHub Student Developer Pack, which gives him Copilot for free. Also on ChatGPT Plus (paid personally) and tried Claude free tier.  
**Company size:** N/A (personal)

### Raw Notes

Dhruv was the most skeptical of anyone I talked to. He started by saying: *"I don't pay for that many AI tools because most of the good ones have student discounts or free tiers."*

When I walked him through StackAudit, his first reaction was — *"So this tells me to cancel things? But I'm already on the cheapest plans."* Which is fair — the cost savings pitch doesn't land for students.

He was more interested in the tool comparison angle: *"I've wondered whether Cursor is actually better than Copilot or if it's just hype. But I can't measure that. If your tool could tell me which one is actually worth keeping, that'd be more useful than a dollar figure."*

On ChatGPT: *"I use it every day. I know it's $20/month but I can't imagine not having it. It's basically the first thing I open in the morning. I'd pay $50 for it if I had to."*

He also said something that stuck: *"Most of my friends pirate or share accounts. I know people with 3 people on one ChatGPT Plus account. Your whole model assumes people are paying full price for individual seats, right? What if they're not?"*

This was something I hadn't thought about carefully. Seat sharing and account pooling are real behaviors, especially in student / early indie communities.

On whether he'd recommend StackAudit: *"Maybe to startup founders who have teams? Not to students. We're already trying to spend as little as possible."*

### Insights

- **The student segment is not the ICP.** Cost optimization matters much less when spend is near-zero already. The value is elsewhere.
- **Qualitative tool comparison is desired but undeliverable.** Dhruv wanted "which tool is actually better," which requires usage data we don't have. This is a hard product limitation.
- **Account sharing is common** in early-stage / student communities, which means seat-based pricing models (including our recommendations) can be inaccurate for this segment.
- **Surprising:** Even a highly cost-conscious student who tracks every rupee said he'd pay $50 for ChatGPT without blinking. Utility perception is wildly different from dollar value.

### How This Influenced the Product

- Confirmed that **team size ≥ 5 is the minimum viable audience** for meaningful savings recommendations.
- Influenced the team-size selector UI: we pre-selected "5" as a starting team size to nudge the audit experience toward the intended ICP.
- The **wizard draft persistence in localStorage** was partly motivated by Dhruv's multi-session usage pattern — he mentioned starting forms then coming back later.
- Noted account sharing as a known **data quality caveat** in the audit engine assumptions.

---

## Summary: What We Actually Learned

| Theme | Evidence |
|-------|---------|
| **Awareness ≠ action** | Aryan knew he was underusing Claude but hadn't cancelled for months |
| **Justification > savings** | Priya wanted a CFO-presentable report, not a cut list |
| **Students aren't the ICP** | Dhruv confirmed cost isn't the pain point for low-spend users |
| **Seat overlap is a real problem at team scale** | Cursor + Copilot co-licensing is common and politically hard to resolve |
| **Annualized numbers feel more real** | Monthly savings feel trivial; yearly figures drive action |
| **Expensed subscriptions create blind spots** | Finance teams see charges they can't categorize |
| **Account sharing breaks seat-based models** | Reduces accuracy for indie / student segments |

### Hypotheses Updated

| Hypothesis | Status After Interviews |
|---|---|
| Startups don't know their total AI spend | ✅ Confirmed — Priya literally didn't know |
| 30%+ spend is redundant | 🟡 Partially confirmed — overlap exists, but political barriers to action are high |
| CTOs/CFOs would pay $99/mo to justify spend | 🟡 Revised — value prop is justification + visibility, not cost reduction per se |
| Manual audit takes 4+ hours | 🟡 Not directly tested — but finance flagging via Brex suggests it happens quarterly, not proactively |
