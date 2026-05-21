/**
 * @module lib/audit-engine
 * @description StackAudit deterministic audit engine.
 *
 * Entry point: runAudit(input) → AuditResult
 *
 * This engine is:
 * - Fully deterministic (no AI, no randomness in recommendations)
 * - Rules-based and financially defensible
 * - Modular (each rule is an isolated, testable function)
 * - Zero external dependencies (no API calls)
 */

import type { AuditInput, AuditResult, RuleContext } from "./audit/types";
import { getToolById } from "./audit/helpers";
import {
  calculateScore,
  generateAuditId,
  generateSummary,
  roundCents,
  annualize,
} from "./audit/helpers";
import { runSubscriptionRules, runCrossRules } from "./audit/rules/index";

export type { AuditInput, AuditResult } from "./audit/types";
export type { ToolSubscription, Recommendation, ToolId } from "./audit/types";

// ── Main Export ───────────────────────────────────────────────────────────────

/**
 * Runs a complete deterministic audit on an organization's AI tool subscriptions.
 *
 * @param input - The subscriptions and team context to audit
 * @returns A fully populated AuditResult with sorted recommendations
 *
 * @example
 * ```ts
 * const result = await runAudit({
 *   teamSize: 8,
 *   subscriptions: [
 *     { toolId: "cursor", planId: "pro", seats: 8, monthlySpend: 160 },
 *     { toolId: "github-copilot", planId: "business", seats: 8, monthlySpend: 152 },
 *     { toolId: "chatgpt", planId: "plus", seats: 1, monthlySpend: 20, usageLevel: "low" },
 *   ],
 * });
 * console.log(result.totalAnnualSavings); // → $1,944
 * ```
 */
export async function runAudit(input: AuditInput): Promise<AuditResult> {
  validateInput(input);

  const auditId = generateAuditId();
  const generatedAt = new Date().toISOString();

  // ── Total current spend ──────────────────────────────────────────────────
  const totalCurrentMonthlySpend = input.subscriptions.reduce(
    (sum, s) => sum + s.monthlySpend,
    0
  );

  const allRecommendations = [];

  // ── Per-subscription rules ───────────────────────────────────────────────
  for (const subscription of input.subscriptions) {
    let tool;
    try {
      tool = getToolById(subscription.toolId);
    } catch {
      // Skip unknown tools gracefully
      console.warn(`[audit-engine] Unknown toolId: "${subscription.toolId}" — skipping`);
      continue;
    }

    const ctx: RuleContext = {
      subscription,
      tool,
      allSubscriptions: input.subscriptions,
      teamSize: input.teamSize,
    };

    const recs = runSubscriptionRules(ctx);
    allRecommendations.push(...recs);
  }

  // ── Cross-subscription rules ─────────────────────────────────────────────
  const crossRecs = runCrossRules(input.subscriptions, input.teamSize);
  allRecommendations.push(...crossRecs);

  // ── Aggregate financials ─────────────────────────────────────────────────
  const totalMonthlySavings = roundCents(
    allRecommendations.reduce((sum, r) => sum + r.monthlySavings, 0)
  );
  const totalAnnualSavings = roundCents(annualize(totalMonthlySavings));
  const totalRecommendedMonthlySpend = roundCents(
    Math.max(0, totalCurrentMonthlySpend - totalMonthlySavings)
  );
  const score = calculateScore(totalCurrentMonthlySpend, totalMonthlySavings);

  // Sort recommendations by monthly savings descending (highest impact first)
  const sortedRecommendations = allRecommendations.sort(
    (a, b) => b.monthlySavings - a.monthlySavings
  );

  return {
    auditId,
    generatedAt,
    teamSize: input.teamSize,
    subscriptionsEvaluated: input.subscriptions.length,
    totalCurrentMonthlySpend: roundCents(totalCurrentMonthlySpend),
    totalRecommendedMonthlySpend,
    totalMonthlySavings,
    totalAnnualSavings,
    score,
    recommendations: sortedRecommendations,
    summary: generateSummary(sortedRecommendations, totalCurrentMonthlySpend, totalMonthlySavings),
  };
}

// ── Input Validation ──────────────────────────────────────────────────────────

function validateInput(input: AuditInput): void {
  if (!input.subscriptions || !Array.isArray(input.subscriptions)) {
    throw new Error("AuditInput.subscriptions must be an array");
  }
  if (typeof input.teamSize !== "number" || input.teamSize < 0) {
    throw new Error("AuditInput.teamSize must be a non-negative number");
  }
  for (const sub of input.subscriptions) {
    if (!sub.toolId) throw new Error("Each subscription must have a toolId");
    if (!sub.planId) throw new Error("Each subscription must have a planId");
    if (typeof sub.monthlySpend !== "number" || sub.monthlySpend < 0) {
      throw new Error(`Subscription "${sub.toolId}" has invalid monthlySpend`);
    }
    if (typeof sub.seats !== "number" || sub.seats < 0) {
      throw new Error(`Subscription "${sub.toolId}" has invalid seats count`);
    }
  }
}
