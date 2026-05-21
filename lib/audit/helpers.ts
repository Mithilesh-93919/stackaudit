/**
 * @module lib/audit/helpers
 * @description Pure utility functions for the audit engine.
 * All functions are deterministic and side-effect free — easy to unit test.
 */

import { TOOL_REGISTRY } from "./pricing-data";
import type {
  PlanDefinition,
  Recommendation,
  ToolDefinition,
  ToolId,
  ToolSubscription,
} from "./types";

// ── Tool & Plan Lookups ───────────────────────────────────────────────────────

/** Returns the tool definition or throws if toolId is not in the registry. */
export function getToolById(toolId: ToolId): ToolDefinition {
  const tool = TOOL_REGISTRY[toolId];
  if (!tool) throw new Error(`Unknown toolId: "${toolId}"`);
  return tool;
}

/** Returns the plan definition or undefined if not found. */
export function findPlan(tool: ToolDefinition, planId: string): PlanDefinition | undefined {
  return tool.plans.find((p) => p.id === planId);
}

/** Returns the plan definition or throws if not found. */
export function requirePlan(tool: ToolDefinition, planId: string): PlanDefinition {
  const plan = findPlan(tool, planId);
  if (!plan) throw new Error(`Plan "${planId}" not found in tool "${tool.id}"`);
  return plan;
}

// ── Cost Calculations ─────────────────────────────────────────────────────────

/**
 * Calculates the monthly cost for a given plan and seat count.
 * Handles flat-fee plans (1 user, not per-seat).
 */
export function calculateMonthlyCost(
  plan: PlanDefinition,
  seats: number,
  annualBilling = false
): number {
  const pricePerSeat = annualBilling && plan.annualBillingMonthlyPrice != null
    ? plan.annualBillingMonthlyPrice
    : plan.monthlyPricePerSeat;

  if (plan.flatFee) {
    // Flat fee regardless of seats (e.g., Claude Pro is $20 for 1 person)
    return pricePerSeat;
  }

  return pricePerSeat * seats;
}

/** Converts a monthly amount to annual. */
export function annualize(monthly: number): number {
  return monthly * 12;
}

/** Rounds to 2 decimal places for display. */
export function roundCents(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Returns savings clamped to >= 0. */
export function clampSavings(current: number, recommended: number): number {
  return Math.max(0, current - recommended);
}

// ── Subscription Helpers ──────────────────────────────────────────────────────

/**
 * Returns a subscription by toolId from the list, or undefined.
 */
export function findSubscription(
  subscriptions: ToolSubscription[],
  toolId: ToolId
): ToolSubscription | undefined {
  return subscriptions.find((s) => s.toolId === toolId);
}

/**
 * Returns all subscriptions that match a tool category.
 * E.g. all "coding" tools: cursor, github-copilot, windsurf.
 */
export function subscriptionsByCategory(
  subscriptions: ToolSubscription[],
  category: "coding" | "chat" | "api"
): ToolSubscription[] {
  return subscriptions.filter((s) => {
    const tool = TOOL_REGISTRY[s.toolId];
    return tool?.category === category;
  });
}

/**
 * Returns true if a subscription's active seat utilization is below threshold.
 * @param threshold - fraction (0.0–1.0). Default 0.7 = 70% utilization
 */
export function hasLowSeatUtilization(
  sub: ToolSubscription,
  threshold = 0.7
): boolean {
  if (sub.activeSeats == null || sub.seats === 0) return false;
  return sub.activeSeats / sub.seats < threshold;
}

// ── Score Calculation ─────────────────────────────────────────────────────────

/**
 * Calculates the audit optimization score (0–100).
 *
 * Formula: score = (1 - totalSavings / totalSpend) * 100
 * - 100 = no savings found, spend is optimized
 * - 0   = all spend could be recovered
 *
 * If totalSpend is 0, returns 100 (nothing to optimize).
 */
export function calculateScore(
  totalCurrentSpend: number,
  totalSavings: number
): number {
  if (totalCurrentSpend <= 0) return 100;
  const ratio = totalSavings / totalCurrentSpend;
  return Math.round(Math.max(0, Math.min(100, (1 - ratio) * 100)));
}

// ── Summary Generation ────────────────────────────────────────────────────────

/**
 * Generates a plain-English executive summary of the audit.
 */
export function generateSummary(
  recommendations: Recommendation[],
  totalCurrentSpend: number,
  totalMonthlySavings: number
): string {
  if (recommendations.length === 0) {
    return "Your AI tool spend appears well-optimized. No significant savings opportunities were identified.";
  }

  const annualSavings = annualize(totalMonthlySavings);
  const pct = totalCurrentSpend > 0
    ? Math.round((totalMonthlySavings / totalCurrentSpend) * 100)
    : 0;

  const highCount = recommendations.filter((r) => r.severity === "high").length;
  const parts: string[] = [
    `StackAudit identified ${recommendations.length} optimization${recommendations.length > 1 ? "s" : ""} ` +
      `that could save $${roundCents(totalMonthlySavings)}/month ($${roundCents(annualSavings)}/year) — ` +
      `${pct}% of your current AI spend.`,
  ];

  if (highCount > 0) {
    parts.push(
      `${highCount} high-priority recommendation${highCount > 1 ? "s" : ""} should be addressed immediately.`
    );
  }

  return parts.join(" ");
}

// ── ID Generation ─────────────────────────────────────────────────────────────

/** Generates a deterministic-ish audit ID (not cryptographically random). */
export function generateAuditId(): string {
  return `audit_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/** Generates a recommendation ID from the rule and tool. */
export function generateRecId(ruleId: string, toolId: string): string {
  return `rec_${ruleId}_${toolId}_${Date.now()}`;
}
