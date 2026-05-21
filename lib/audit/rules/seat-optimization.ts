/**
 * @module lib/audit/rules/seat-optimization
 * @description Rules that detect unused or excess seats in paid subscriptions.
 *
 * Covers:
 * - Seats paid for but not actively used (low utilization)
 * - Team size mismatch (paying for more seats than team headcount)
 */

import {
  annualize,
  clampSavings,
  findPlan,
  generateRecId,
  hasLowSeatUtilization,
} from "../helpers";
import type { Recommendation, RuleContext, SubscriptionRule } from "../types";

/** Below this utilization rate we flag excess seats. */
const LOW_UTILIZATION_THRESHOLD = 0.7;

// ── Rule: Low seat utilization ────────────────────────────────────────────────

/**
 * Fires when activeSeats is known and < 70% of purchased seats.
 * Recommends reducing seat count to active users (with a small buffer).
 */
const lowSeatUtilization: SubscriptionRule = {
  type: "subscription",
  id: "low-seat-utilization",
  name: "Low Seat Utilization",
  description:
    "Detects when fewer than 70% of purchased seats are actively used.",

  applies({ subscription }): boolean {
    return (
      subscription.activeSeats != null &&
      subscription.seats > 1 &&
      hasLowSeatUtilization(subscription, LOW_UTILIZATION_THRESHOLD)
    );
  },

  evaluate({ subscription, tool }): Recommendation | null {
    const currentPlan = findPlan(tool, subscription.planId);
    if (!currentPlan || currentPlan.flatFee) return null;

    const activeSeats = subscription.activeSeats ?? subscription.seats;
    // Add 10% buffer above active users to prevent immediate re-overage
    const recommendedSeats = Math.ceil(activeSeats * 1.1);
    const excessSeats = subscription.seats - recommendedSeats;

    if (excessSeats <= 0) return null;

    const pricePerSeat = currentPlan.monthlyPricePerSeat;
    const monthlySavings = pricePerSeat * excessSeats;

    if (monthlySavings <= 0) return null;

    const currentCost = subscription.monthlySpend;
    const recommendedCost = clampSavings(currentCost, monthlySavings);
    const utilizationPct = Math.round((activeSeats / subscription.seats) * 100);

    return {
      id: generateRecId("low-seat-utilization", tool.id),
      ruleId: "low-seat-utilization",
      toolId: tool.id,
      severity: "medium",
      title: `Reduce ${tool.name} seats from ${subscription.seats} to ${recommendedSeats}`,
      description:
        `You have ${subscription.seats} seats on ${tool.name} ${currentPlan.name} ` +
        `but only ${activeSeats} (${utilizationPct}%) are actively used. ` +
        `Reducing to ${recommendedSeats} seats (with 10% buffer) saves $${monthlySavings}/month.`,
      currentPlan: `${currentPlan.name} — ${subscription.seats} seats`,
      currentMonthlyCost: currentCost,
      recommendedPlan: `${currentPlan.name} — ${recommendedSeats} seats`,
      recommendedMonthlyCost: recommendedCost,
      monthlySavings,
      annualSavings: annualize(monthlySavings),
      confidence: "high",
      reasoning:
        `${excessSeats} seats unused × $${pricePerSeat}/seat = $${monthlySavings}/month savings. ` +
        `Recommended seat count includes a 10% growth buffer (${recommendedSeats} seats).`,
      actionSteps: [
        `Audit active ${tool.name} users in the admin dashboard`,
        `Remove or deactivate ${excessSeats} inactive seat(s)`,
        `Set a calendar reminder to review seat count quarterly`,
      ],
    };
  },
};

// ── Rule: Seats exceed team size ──────────────────────────────────────────────

/**
 * Fires when the number of purchased seats for a tool exceeds total team size.
 * Likely caused by historical seat purchases that were never cleaned up.
 */
const seatsExceedTeamSize: SubscriptionRule = {
  type: "subscription",
  id: "seats-exceed-team-size",
  name: "Seats Exceed Team Size",
  description: "Detects when paid seats are greater than the total team headcount.",

  applies({ subscription, teamSize }): boolean {
    const plan = PLAN_IS_PER_SEAT(subscription.planId);
    return plan && subscription.seats > teamSize && teamSize > 0;
  },

  evaluate({ subscription, tool, teamSize }): Recommendation | null {
    const currentPlan = findPlan(tool, subscription.planId);
    if (!currentPlan || currentPlan.flatFee) return null;

    const excessSeats = subscription.seats - teamSize;
    if (excessSeats <= 0) return null;

    const pricePerSeat = currentPlan.monthlyPricePerSeat;
    const monthlySavings = pricePerSeat * excessSeats;
    const currentCost = subscription.monthlySpend;
    const recommendedCost = currentCost - monthlySavings;

    return {
      id: generateRecId("seats-exceed-team-size", tool.id),
      ruleId: "seats-exceed-team-size",
      toolId: tool.id,
      severity: "medium",
      title: `${tool.name} has ${excessSeats} more seats than team members`,
      description:
        `Your team has ${teamSize} members but you're paying for ${subscription.seats} ${tool.name} seats. ` +
        `${excessSeats} seat(s) cannot be in use.`,
      currentPlan: `${currentPlan.name} — ${subscription.seats} seats`,
      currentMonthlyCost: currentCost,
      recommendedPlan: `${currentPlan.name} — ${teamSize} seats`,
      recommendedMonthlyCost: Math.max(0, recommendedCost),
      monthlySavings,
      annualSavings: annualize(monthlySavings),
      confidence: "high",
      reasoning:
        `Team size: ${teamSize}. Seats purchased: ${subscription.seats}. ` +
        `${excessSeats} excess × $${pricePerSeat}/seat = $${monthlySavings}/month.`,
      actionSteps: [
        `Log in to ${tool.name} admin panel and audit active users`,
        `Remove the ${excessSeats} excess seat(s) to match team headcount`,
        `Consider 10–15% buffer if rapid hiring is planned`,
      ],
    };
  },
};

/** Helper: returns true for plans that are per-seat (not flat fee or free). */
function PLAN_IS_PER_SEAT(planId: string): boolean {
  // free plans have no cost to optimize; flat-fee plans handle their own rules
  return planId !== "free" && planId !== "hobby";
}

export const seatOptimizationRules: SubscriptionRule[] = [
  lowSeatUtilization,
  seatsExceedTeamSize,
];
