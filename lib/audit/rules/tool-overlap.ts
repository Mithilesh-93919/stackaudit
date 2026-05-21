/**
 * @module lib/audit/rules/tool-overlap
 * @description Cross-subscription rules that detect redundant tool combinations.
 *
 * Covers:
 * - Multiple coding tools (Cursor + Copilot + Windsurf)
 * - Multiple chat tools (ChatGPT + Claude + Gemini — triple overlap)
 * - ChatGPT + Claude double overlap
 * - Anthropic API + Claude Pro (same vendor, redundant)
 * - OpenAI API + ChatGPT Plus (same vendor, redundant)
 */

import { annualize, findSubscription, generateRecId, subscriptionsByCategory } from "../helpers";
import { TOOL_REGISTRY } from "../pricing-data";
import type { CrossSubscriptionRule, Recommendation, ToolId, ToolSubscription } from "../types";

// ── Rule: Multiple coding tools ───────────────────────────────────────────────

const multipleCodingTools: CrossSubscriptionRule = {
  type: "cross",
  id: "multiple-coding-tools",
  name: "Multiple Coding Tools Detected",
  description: "Team is paying for 2+ AI coding tools (Cursor, GitHub Copilot, Windsurf) with overlapping functionality.",
  applies(subscriptions): boolean {
    return subscriptionsByCategory(subscriptions, "coding").filter(
      (s) => s.monthlySpend > 0
    ).length >= 2;
  },
  evaluate(subscriptions): Recommendation | null {
    const codingTools = subscriptionsByCategory(subscriptions, "coding").filter(
      (s) => s.monthlySpend > 0
    );

    if (codingTools.length < 2) return null;

    // Sort descending by monthly spend — recommend keeping the cheapest
    const sorted = [...codingTools].sort((a, b) => b.monthlySpend - a.monthlySpend);
    const mostExpensive = sorted[0]!;
    const totalCodingSpend = codingTools.reduce((sum, s) => sum + s.monthlySpend, 0);
    const monthlySavings = mostExpensive.monthlySpend;

    const toolNames = codingTools
      .map((s) => `${TOOL_REGISTRY[s.toolId]?.name ?? s.toolId} ($${s.monthlySpend}/mo)`)
      .join(", ");

    const expensiveName = TOOL_REGISTRY[mostExpensive.toolId]?.name ?? mostExpensive.toolId;

    return {
      id: generateRecId("multiple-coding-tools", "cross-tool"),
      ruleId: "multiple-coding-tools",
      toolId: "cross-tool",
      severity: "high",
      title: `Consolidate ${codingTools.length} overlapping coding tools`,
      description: `You're paying for ${toolNames} — all provide AI code completions and chat. Pick one to eliminate $${monthlySavings}/month in redundant spend.`,
      currentPlan: toolNames,
      currentMonthlyCost: totalCodingSpend,
      recommendedPlan: `Keep the tool that best fits your team, cancel the rest`,
      recommendedMonthlyCost: totalCodingSpend - monthlySavings,
      monthlySavings,
      annualSavings: annualize(monthlySavings),
      confidence: "high",
      reasoning: `All ${codingTools.length} tools offer AI code completion. Keeping only the best-fit tool saves $${monthlySavings}/month. Eliminating ${expensiveName} produces the highest savings.`,
      actionSteps: [
        "Survey developers on which tool they prefer and use most",
        "Run a 1-week trial with only the preferred tool",
        `Cancel ${expensiveName} first (highest spend: $${mostExpensive.monthlySpend}/month)`,
        "Standardize on a single coding AI tool company-wide",
      ],
      affectedToolIds: codingTools.map((s) => s.toolId) as ToolId[],
    };
  },
};

// ── Rule: Triple chat tool overlap ────────────────────────────────────────────

const tripleChatOverlap: CrossSubscriptionRule = {
  type: "cross",
  id: "triple-chat-overlap",
  name: "Three Paid Chat AI Tools",
  description: "Team pays for ChatGPT, Claude, and Gemini Advanced — significant redundancy.",
  applies(subscriptions): boolean {
    const chatgpt = findSubscription(subscriptions, "chatgpt");
    const claude = findSubscription(subscriptions, "claude");
    const gemini = findSubscription(subscriptions, "gemini");
    return !!(
      chatgpt && chatgpt.monthlySpend > 0 &&
      claude && claude.monthlySpend > 0 &&
      gemini && gemini.monthlySpend > 0
    );
  },
  evaluate(subscriptions): Recommendation | null {
    const chatgpt = findSubscription(subscriptions, "chatgpt")!;
    const claude = findSubscription(subscriptions, "claude")!;
    const gemini = findSubscription(subscriptions, "gemini")!;

    const allThree = [chatgpt, claude, gemini];
    const totalSpend = allThree.reduce((sum, s) => sum + s.monthlySpend, 0);

    // Recommend keeping the cheapest two, cutting the most expensive one
    const sorted = [...allThree].sort((a, b) => b.monthlySpend - a.monthlySpend);
    const toCut = sorted[0]!;
    const toCutName = TOOL_REGISTRY[toCut.toolId]?.name ?? toCut.toolId;
    const monthlySavings = toCut.monthlySpend;

    return {
      id: generateRecId("triple-chat-overlap", "cross-tool"),
      ruleId: "triple-chat-overlap",
      toolId: "cross-tool",
      severity: "high",
      title: "Cut one of three overlapping AI chat tools",
      description: `You're paying $${totalSpend}/month for ChatGPT, Claude, and Gemini Advanced simultaneously. Most teams only need one or two chat AI tools.`,
      currentPlan: `ChatGPT ($${chatgpt.monthlySpend}/mo) + Claude ($${claude.monthlySpend}/mo) + Gemini ($${gemini.monthlySpend}/mo)`,
      currentMonthlyCost: totalSpend,
      recommendedPlan: `Keep 2 tools, cancel ${toCutName}`,
      recommendedMonthlyCost: totalSpend - monthlySavings,
      monthlySavings,
      annualSavings: annualize(monthlySavings),
      confidence: "high",
      reasoning: `Three paid chat AI subscriptions = $${totalSpend}/month. Cutting ${toCutName} ($${monthlySavings}/month) saves $${annualize(monthlySavings)}/year with minimal workflow disruption.`,
      actionSteps: [
        "Survey which chat AI tool each team member uses daily",
        `Identify if ${toCutName} has any unique workflows that can't be replicated`,
        `Cancel ${toCutName} subscription if no unique use cases exist`,
        "Consolidate team usage around the 1-2 most-used tools",
      ],
      affectedToolIds: ["chatgpt", "claude", "gemini"],
    };
  },
};

// ── Rule: Double chat overlap (ChatGPT + Claude) ──────────────────────────────

const doubleChatOverlapChatgptClaude: CrossSubscriptionRule = {
  type: "cross",
  id: "double-chat-chatgpt-claude",
  name: "ChatGPT + Claude Double Overlap",
  description: "Team pays for both ChatGPT Plus and Claude Pro — both are general-purpose chat AI with significant feature overlap.",
  applies(subscriptions): boolean {
    // Only fires if triple overlap rule hasn't already fired
    const chatgpt = findSubscription(subscriptions, "chatgpt");
    const claude = findSubscription(subscriptions, "claude");
    const gemini = findSubscription(subscriptions, "gemini");
    const hasTriple = !!(gemini && gemini.monthlySpend > 0);
    return !hasTriple && !!(chatgpt && chatgpt.monthlySpend > 0 && claude && claude.monthlySpend > 0);
  },
  evaluate(subscriptions): Recommendation | null {
    const chatgpt = findSubscription(subscriptions, "chatgpt")!;
    const claude = findSubscription(subscriptions, "claude")!;

    const totalSpend = chatgpt.monthlySpend + claude.monthlySpend;
    // Recommend keeping Claude (generally preferred for writing/reasoning) and cutting ChatGPT
    const cheaper = chatgpt.monthlySpend <= claude.monthlySpend ? chatgpt : claude;
    const toCut = chatgpt.monthlySpend > claude.monthlySpend ? chatgpt : claude;
    const toCutName = TOOL_REGISTRY[toCut.toolId]?.name ?? toCut.toolId;

    return {
      id: generateRecId("double-chat-chatgpt-claude", "cross-tool"),
      ruleId: "double-chat-chatgpt-claude",
      toolId: "cross-tool",
      severity: "medium",
      title: "Consolidate ChatGPT Plus + Claude Pro into one chat AI",
      description: `You pay $${totalSpend}/month for both ChatGPT and Claude. Both cover general chat, writing, and analysis. Most teams can standardize on one.`,
      currentPlan: `ChatGPT ($${chatgpt.monthlySpend}/mo) + Claude ($${claude.monthlySpend}/mo)`,
      currentMonthlyCost: totalSpend,
      recommendedPlan: `Keep one chat AI, cancel ${toCutName}`,
      recommendedMonthlyCost: cheaper.monthlySpend,
      monthlySavings: toCut.monthlySpend,
      annualSavings: annualize(toCut.monthlySpend),
      confidence: "medium",
      reasoning: `ChatGPT Plus ($${chatgpt.monthlySpend}/mo) + Claude Pro ($${claude.monthlySpend}/mo) = $${totalSpend}/month. Canceling ${toCutName} saves $${toCut.monthlySpend}/month. Note: some teams legitimately use both for different strengths (coding vs writing).`,
      actionSteps: [
        "Survey team: which tool do they reach for first for different task types?",
        "Identify if there are unique features (code interpreter, DALL·E, Artifacts) creating lock-in",
        `If no unique use cases, cancel ${toCutName}`,
        "Document which tool to use for which task types to prevent re-subscription creep",
      ],
      affectedToolIds: ["chatgpt", "claude"],
    };
  },
};

// ── Rule: Same-vendor API + Subscription ──────────────────────────────────────

const anthropicApiAndClaudePro: CrossSubscriptionRule = {
  type: "cross",
  id: "anthropic-api-and-claude-pro",
  name: "Anthropic API + Claude Pro (Same Vendor Redundancy)",
  description: "Paying for both Claude Pro and Anthropic API access from the same vendor may indicate overlap.",
  applies(subscriptions): boolean {
    const claude = findSubscription(subscriptions, "claude");
    const api = findSubscription(subscriptions, "anthropic-api");
    return !!(claude && claude.monthlySpend > 0 && api && api.monthlySpend > 0);
  },
  evaluate(subscriptions): Recommendation | null {
    const claude = findSubscription(subscriptions, "claude")!;
    const api = findSubscription(subscriptions, "anthropic-api")!;
    const totalSpend = claude.monthlySpend + api.monthlySpend;

    return {
      id: generateRecId("anthropic-api-and-claude-pro", "cross-tool"),
      ruleId: "anthropic-api-and-claude-pro",
      toolId: "cross-tool",
      severity: "medium",
      title: "Review Claude Pro + Anthropic API — same vendor overlap",
      description: `You pay $${claude.monthlySpend}/month for Claude Pro and $${api.monthlySpend}/month for Anthropic API. Ensure these serve distinct use cases (UI vs. programmatic access).`,
      currentPlan: `Claude Pro ($${claude.monthlySpend}/mo) + Anthropic API ($${api.monthlySpend}/mo)`,
      currentMonthlyCost: totalSpend,
      recommendedPlan: "Keep API only if Claude Pro is for personal UI use",
      recommendedMonthlyCost: api.monthlySpend,
      monthlySavings: claude.monthlySpend,
      annualSavings: annualize(claude.monthlySpend),
      confidence: "medium",
      reasoning: `Both give access to Claude models. Claude Pro ($${claude.monthlySpend}/month) is for claude.ai UI access. If team only needs API access, Claude Pro is redundant. If UI access is needed, both may be justified.`,
      actionSteps: [
        "Identify who uses Claude Pro (claude.ai UI) vs Anthropic API",
        "If API is used in production and Pro is for personal UI access, consider keeping both",
        "If no one relies on the claude.ai UI, cancel Claude Pro and use API only",
        "Consider claude.ai API calls can replicate most claude.ai UI features",
      ],
      affectedToolIds: ["claude", "anthropic-api"],
    };
  },
};

export const toolOverlapRules: CrossSubscriptionRule[] = [
  multipleCodingTools,
  tripleChatOverlap,
  doubleChatOverlapChatgptClaude,
  anthropicApiAndClaudePro,
];
