/**
 * @module lib/audit/rules/overpaying
 * @description Rules that detect when a team is overpaying for their current plan tier.
 *
 * Covers:
 * - Single user on a team/multi-seat plan (should be on individual plan)
 * - On a paid plan when free tier is sufficient
 */

import {
  calculateMonthlyCost,
  clampSavings,
  findPlan,
  generateRecId,
  annualize,
} from "../helpers";
import type { Recommendation, RuleContext, SubscriptionRule } from "../types";

// ── Rule: Single seat on team plan ────────────────────────────────────────────

/**
 * Detects a single user paying team-plan prices when an individual plan exists.
 * E.g. ChatGPT Team ($30) with 1 seat → ChatGPT Plus ($20), saves $10/month.
 */
const singleSeatOnTeamPlan: SubscriptionRule = {
  type: "subscription",
  id: "single-seat-team-plan",
  name: "Single Seat on Team Plan",
  description: "Detects one user paying team pricing when an individual plan is available.",

  applies({ subscription, tool }): boolean {
    const plan = findPlan(tool, subscription.planId);
    return (
      plan?.plan === "team" &&
      subscription.seats === 1 &&
      tool.plans.some((p) => p.plan === "individual")
    );
  },

  evaluate({ subscription, tool }): Recommendation | null {
    const currentPlan = findPlan(tool, subscription.planId);
    if (!currentPlan) return null;

    // Find the best individual plan
    const individualPlan = tool.plans.find((p) => p.plan === "individual");
    if (!individualPlan) return null;

    const currentCost = subscription.monthlySpend;
    const recommendedCost = calculateMonthlyCost(individualPlan, 1);
    const monthlySavings = clampSavings(currentCost, recommendedCost);

    if (monthlySavings <= 0) return null;

    return {
      id: generateRecId("single-seat-team-plan", tool.id),
      ruleId: "single-seat-team-plan",
      toolId: tool.id,
      severity: "high",
      title: `Downgrade ${tool.name} from ${currentPlan.name} to ${individualPlan.name}`,
      description: `You have 1 seat on ${tool.name} ${currentPlan.name} ($${currentCost}/mo), which is priced for teams. The ${individualPlan.name} plan covers 1 user at $${individualPlan.monthlyPricePerSeat}/mo.`,
      currentPlan: currentPlan.name,
      currentMonthlyCost: currentCost,
      recommendedPlan: individualPlan.name,
      recommendedMonthlyCost: recommendedCost,
      monthlySavings,
      annualSavings: annualize(monthlySavings),
      confidence: "high",
      reasoning: `${currentPlan.name} plan costs $${currentPlan.monthlyPricePerSeat}/seat/month. ${individualPlan.name} is $${individualPlan.monthlyPricePerSeat}/month for 1 user. Switching saves $${monthlySavings}/month.`,
      actionSteps: [
        `Log in to ${tool.vendor} account settings`,
        `Navigate to Billing or Subscription`,
        `Downgrade from ${currentPlan.name} to ${individualPlan.name}`,
        `Confirm the plan change before the next billing cycle`,
      ],
    };
  },
};

// ── Rule: On paid plan with zero active usage ────────────────────────────────

/**
 * Detects when all seats on a paid plan are unused (activeSeats = 0 or not set
 * but usageLevel = 'low' with low seat count).
 */
const paidPlanNoActiveUsers: SubscriptionRule = {
  type: "subscription",
  id: "paid-plan-no-active-users",
  name: "Paid Plan With No Active Users",
  description: "Detects a paid subscription where no seats are actively being used.",

  applies({ subscription, tool }): boolean {
    const plan = findPlan(tool, subscription.planId);
    if (!plan || plan.plan === "free") return false;
    // Only trigger if we have explicit activeSeats data showing 0 usage
    return subscription.activeSeats === 0;
  },

  evaluate({ subscription, tool }): Recommendation | null {
    const currentPlan = findPlan(tool, subscription.planId);
    if (!currentPlan) return null;

    const freePlan = tool.plans.find((p) => p.plan === "free");
    const currentCost = subscription.monthlySpend;

    return {
      id: generateRecId("paid-plan-no-active-users", tool.id),
      ruleId: "paid-plan-no-active-users",
      toolId: tool.id,
      severity: "high",
      title: `Cancel ${tool.name} — 0 active users detected`,
      description: `You are paying $${currentCost}/month for ${tool.name} ${currentPlan.name} but no seats are being actively used.`,
      currentPlan: currentPlan.name,
      currentMonthlyCost: currentCost,
      recommendedPlan: freePlan ? freePlan.name : "Cancel subscription",
      recommendedMonthlyCost: 0,
      monthlySavings: currentCost,
      annualSavings: annualize(currentCost),
      confidence: "high",
      reasoning: `0 out of ${subscription.seats} seats are active. Canceling saves $${currentCost}/month ($${annualize(currentCost)}/year).`,
      actionSteps: [
        `Confirm with team that ${tool.name} is not being used`,
        `Export any data or settings before canceling`,
        `Cancel subscription in ${tool.vendor} billing settings`,
        freePlan ? `Downgrade to the free tier to preserve access` : `Cancel the subscription entirely`,
      ],
    };
  },
};

export const overpayingRules: SubscriptionRule[] = [
  singleSeatOnTeamPlan,
  paidPlanNoActiveUsers,
];
