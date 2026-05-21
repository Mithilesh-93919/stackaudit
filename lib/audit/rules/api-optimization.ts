/**
 * @module lib/audit/rules/api-optimization
 * @description Rules for switching from subscriptions to API for low/medium usage.
 */

import { annualize, clampSavings, findPlan, generateRecId } from "../helpers";
import {
  CLAUDE_API_LOW_USAGE_MONTHLY_USD,
  CLAUDE_API_MEDIUM_USAGE_MONTHLY_USD,
  OPENAI_API_LOW_USAGE_MONTHLY_USD,
} from "../pricing-data";
import type { Recommendation, RuleContext, SubscriptionRule } from "../types";

const claudeProToApiLow: SubscriptionRule = {
  type: "subscription",
  id: "claude-pro-to-api-low",
  name: "Claude Pro → Anthropic API (Low Usage)",
  description: "Low-usage Claude Pro subscribers save by switching to Anthropic API (Haiku).",
  applies({ subscription }): boolean {
    return subscription.toolId === "claude" && subscription.planId === "pro" && subscription.usageLevel === "low";
  },
  evaluate({ subscription, tool }): Recommendation | null {
    const currentPlan = findPlan(tool, subscription.planId);
    if (!currentPlan) return null;
    const currentCost = subscription.monthlySpend;
    const estimatedApiCost = CLAUDE_API_LOW_USAGE_MONTHLY_USD * subscription.seats;
    const monthlySavings = clampSavings(currentCost, estimatedApiCost);
    if (monthlySavings < 5) return null;
    return {
      id: generateRecId("claude-pro-to-api-low", tool.id),
      ruleId: "claude-pro-to-api-low",
      toolId: tool.id,
      severity: "medium",
      title: "Switch Claude Pro to Anthropic API — low usage detected",
      description: `Paying $${currentCost}/month for Claude Pro but usage is low. Anthropic API (Haiku) costs ~$${estimatedApiCost.toFixed(2)}/month at this usage level.`,
      currentPlan: "Claude Pro",
      currentMonthlyCost: currentCost,
      recommendedPlan: "Anthropic API — Claude Haiku (pay-as-you-go)",
      recommendedMonthlyCost: estimatedApiCost,
      monthlySavings,
      annualSavings: annualize(monthlySavings),
      confidence: "medium",
      reasoning: `Claude Pro flat fee: $20/seat. Haiku at ~500K input + 100K output tokens = ~$0.25/user/month. Estimated savings: $${monthlySavings.toFixed(2)}/month.`,
      actionSteps: [
        "Create an Anthropic API account at console.anthropic.com",
        "Integrate Claude Haiku via API into your workflow",
        "Monitor API spend for 30 days before canceling Claude Pro",
        "Cancel Claude Pro if API costs remain consistently lower",
      ],
    };
  },
};

const claudeProToApiMedium: SubscriptionRule = {
  type: "subscription",
  id: "claude-pro-to-api-medium",
  name: "Claude Pro → Anthropic API (Medium Usage)",
  description: "Medium-usage Claude Pro subscribers may save with Anthropic API (Sonnet).",
  applies({ subscription }): boolean {
    return subscription.toolId === "claude" && subscription.planId === "pro" && subscription.usageLevel === "medium";
  },
  evaluate({ subscription, tool }): Recommendation | null {
    const currentPlan = findPlan(tool, subscription.planId);
    if (!currentPlan) return null;
    const currentCost = subscription.monthlySpend;
    const estimatedApiCost = CLAUDE_API_MEDIUM_USAGE_MONTHLY_USD * subscription.seats;
    const monthlySavings = clampSavings(currentCost, estimatedApiCost);
    if (monthlySavings < 5) return null;
    return {
      id: generateRecId("claude-pro-to-api-medium", tool.id),
      ruleId: "claude-pro-to-api-medium",
      toolId: tool.id,
      severity: "low",
      title: "Evaluate Anthropic API vs Claude Pro for medium usage",
      description: `At medium usage, Anthropic API (Sonnet) costs ~$${estimatedApiCost.toFixed(2)}/month vs $${currentCost}/month for Claude Pro.`,
      currentPlan: "Claude Pro",
      currentMonthlyCost: currentCost,
      recommendedPlan: "Anthropic API — Claude Sonnet (pay-as-you-go)",
      recommendedMonthlyCost: estimatedApiCost,
      monthlySavings,
      annualSavings: annualize(monthlySavings),
      confidence: "low",
      reasoning: `~1M input + 300K output tokens/user/month on Sonnet = $3.00 + $4.50 = $7.50/user. Verify with actual usage logs.`,
      actionSteps: [
        "Enable Anthropic API access and log token usage for 1 month",
        "Compare actual API bill against current Claude Pro cost",
        "Switch permanently if API costs are consistently lower",
      ],
    };
  },
};

const chatgptPlusToApiLow: SubscriptionRule = {
  type: "subscription",
  id: "chatgpt-plus-to-api-low",
  name: "ChatGPT Plus → OpenAI API (Low Usage)",
  description: "Low-usage ChatGPT Plus subscribers can switch to OpenAI API (GPT-4o mini) for a fraction of the cost.",
  applies({ subscription }): boolean {
    return subscription.toolId === "chatgpt" && subscription.planId === "plus" && subscription.usageLevel === "low";
  },
  evaluate({ subscription, tool }): Recommendation | null {
    const currentPlan = findPlan(tool, subscription.planId);
    if (!currentPlan) return null;
    const currentCost = subscription.monthlySpend;
    const estimatedApiCost = OPENAI_API_LOW_USAGE_MONTHLY_USD * subscription.seats;
    const monthlySavings = clampSavings(currentCost, estimatedApiCost);
    if (monthlySavings < 5) return null;
    return {
      id: generateRecId("chatgpt-plus-to-api-low", tool.id),
      ruleId: "chatgpt-plus-to-api-low",
      toolId: tool.id,
      severity: "medium",
      title: "Switch ChatGPT Plus to OpenAI API — low usage detected",
      description: `Paying $${currentCost}/month for ChatGPT Plus at low usage. GPT-4o mini via API costs ~$${estimatedApiCost.toFixed(2)}/month.`,
      currentPlan: "ChatGPT Plus",
      currentMonthlyCost: currentCost,
      recommendedPlan: "OpenAI API — GPT-4o mini (pay-as-you-go)",
      recommendedMonthlyCost: estimatedApiCost,
      monthlySavings,
      annualSavings: annualize(monthlySavings),
      confidence: "medium",
      reasoning: `GPT-4o mini: $0.15/1M input + $0.60/1M output. ~500K input + 100K output/user = ~$0.14/user/month. Note: API loses ChatGPT UI, DALL·E, and web browsing.`,
      actionSteps: [
        "Create an OpenAI platform account at platform.openai.com",
        "Integrate GPT-4o mini via API into your workflow",
        "Monitor API costs for 30 days before canceling ChatGPT Plus",
        "Note: you will lose access to ChatGPT web UI features",
      ],
    };
  },
};

export const apiOptimizationRules: SubscriptionRule[] = [
  claudeProToApiLow,
  claudeProToApiMedium,
  chatgptPlusToApiLow,
];
