/**
 * @module lib/audit/rules/cross-vendor
 * @description Rules that detect cheaper alternatives from other vendors
 * or within the same vendor at a lower price point.
 *
 * Covers:
 * - Cursor Pro → Windsurf Pro (same category, $5/seat cheaper)
 * - Cursor Pro → GitHub Copilot Individual (half the price for basic use)
 * - GitHub Copilot Business → Cursor Business (for AI-first teams)
 */

import { annualize, clampSavings, findPlan, generateRecId } from "../helpers";
import { TOOL_REGISTRY } from "../pricing-data";
import type { Recommendation, RuleContext, SubscriptionRule } from "../types";

// ── Rule: Cursor Pro → Windsurf Pro ───────────────────────────────────────────

const cursorProToWindsurfPro: SubscriptionRule = {
  type: "subscription",
  id: "cursor-pro-to-windsurf-pro",
  name: "Cursor Pro → Windsurf Pro",
  description: "Windsurf Pro offers similar AI coding features at $15/seat vs Cursor Pro at $20/seat.",
  applies({ subscription }): boolean {
    // Don't suggest alternatives for high-usage teams already getting good ROI
    return (
      subscription.toolId === "cursor" &&
      subscription.planId === "pro" &&
      subscription.usageLevel !== "high"
    );
  },
  evaluate({ subscription, tool }): Recommendation | null {
    const currentPlan = findPlan(tool, subscription.planId);
    if (!currentPlan) return null;
    const windsurfTool = TOOL_REGISTRY["windsurf"];
    const windsurfPro = windsurfTool.plans.find((p) => p.id === "pro");
    if (!windsurfPro) return null;

    const currentCost = subscription.monthlySpend;
    const recommendedCost = windsurfPro.monthlyPricePerSeat * subscription.seats;
    const monthlySavings = clampSavings(currentCost, recommendedCost);

    if (monthlySavings <= 0) return null;

    return {
      id: generateRecId("cursor-pro-to-windsurf-pro", tool.id),
      ruleId: "cursor-pro-to-windsurf-pro",
      toolId: tool.id,
      severity: "low",
      title: `Switch ${subscription.seats} Cursor Pro seat(s) to Windsurf Pro — save $5/seat`,
      description: `Cursor Pro costs $20/seat/month. Windsurf Pro is $15/seat/month with comparable AI coding features. Saves $${monthlySavings}/month for ${subscription.seats} seat(s).`,
      currentPlan: "Cursor Pro ($20/seat/month)",
      currentMonthlyCost: currentCost,
      recommendedPlan: "Windsurf Pro ($15/seat/month)",
      recommendedMonthlyCost: recommendedCost,
      monthlySavings,
      annualSavings: annualize(monthlySavings),
      confidence: "medium",
      reasoning: `$5/seat/month difference × ${subscription.seats} seats = $${monthlySavings}/month ($${annualize(monthlySavings)}/year). Both offer AI completions and chat. Cursor has stronger multi-file editing; Windsurf has competitive completions.`,
      actionSteps: [
        "Trial Windsurf Pro (free trial available) alongside Cursor",
        "Evaluate feature parity for your team's specific use cases",
        "If satisfied, cancel Cursor Pro before next billing cycle",
        "Sign up for Windsurf Pro at codeium.com",
      ],
      affectedToolIds: ["cursor", "windsurf"],
    };
  },
};

// ── Rule: Cursor Pro → GitHub Copilot Individual (single dev) ─────────────────

const cursorProToCopilotIndividual: SubscriptionRule = {
  type: "subscription",
  id: "cursor-pro-to-copilot-individual",
  name: "Cursor Pro → GitHub Copilot Individual",
  description: "GitHub Copilot Individual at $10/seat is half the price of Cursor Pro for developers who primarily need code completions.",
  applies({ subscription }): boolean {
    return (
      subscription.toolId === "cursor" &&
      subscription.planId === "pro" &&
      subscription.seats <= 3 && // Most relevant for small teams / individuals
      subscription.usageLevel !== "high"
    );
  },
  evaluate({ subscription, tool }): Recommendation | null {
    const currentPlan = findPlan(tool, subscription.planId);
    if (!currentPlan) return null;
    const copilotTool = TOOL_REGISTRY["github-copilot"];
    const copilotIndividual = copilotTool.plans.find((p) => p.id === "individual");
    if (!copilotIndividual) return null;

    const currentCost = subscription.monthlySpend;
    const recommendedCost = copilotIndividual.monthlyPricePerSeat * subscription.seats;
    const monthlySavings = clampSavings(currentCost, recommendedCost);

    if (monthlySavings <= 0) return null;

    return {
      id: generateRecId("cursor-pro-to-copilot-individual", tool.id),
      ruleId: "cursor-pro-to-copilot-individual",
      toolId: tool.id,
      severity: "low",
      title: "Consider GitHub Copilot Individual as a cheaper alternative to Cursor Pro",
      description: `Cursor Pro: $${currentCost}/month. GitHub Copilot Individual: $${recommendedCost}/month. If you primarily need inline completions, Copilot Individual is half the price.`,
      currentPlan: "Cursor Pro ($20/seat/month)",
      currentMonthlyCost: currentCost,
      recommendedPlan: "GitHub Copilot Individual ($10/seat/month)",
      recommendedMonthlyCost: recommendedCost,
      monthlySavings,
      annualSavings: annualize(monthlySavings),
      confidence: "low",
      reasoning: `Cursor Pro is $20/seat; Copilot Individual is $10/seat. Trade-off: Cursor has a superior multi-file AI chat interface; Copilot is deeply integrated with GitHub and VS Code. Best if your team's primary use is inline code completion.`,
      actionSteps: [
        "Evaluate which Cursor features your team actually uses daily",
        "If primarily using completions (not Composer/Chat), trial GitHub Copilot",
        "GitHub Copilot has a 30-day free trial for individuals",
        "Cancel Cursor Pro only after confirming Copilot meets your needs",
      ],
      affectedToolIds: ["cursor", "github-copilot"],
    };
  },
};

export const crossVendorRules: SubscriptionRule[] = [
  cursorProToWindsurfPro,
  cursorProToCopilotIndividual,
];
