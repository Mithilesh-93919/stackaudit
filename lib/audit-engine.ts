/**
 * @module lib/audit-engine
 * @description StackAudit deterministic audit engine.
 *
 * Entry point: runAudit(input) → AuditResult
 *
 * This engine is:
 * - Fully deterministic (no randomness in recommendations or financials)
 * - Rules-based and financially defensible
 * - Modular (each rule is an isolated, testable function)
 *
 * The executive summary is generated via Anthropic claude-haiku-4-5
 * when ANTHROPIC_API_KEY is present, with a deterministic template fallback.
 * AI enrichment is opt-in — the engine works identically without a key.
 *
 * AI enrichment: lib/ai.ts → generateAuditSummary()
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
import { TOOL_REGISTRY } from "./audit/pricing-data";
import { generateAuditSummary } from "./ai";

export type { AuditInput, AuditResult } from "./audit/types";
export type { ToolSubscription, Recommendation, ToolId } from "./audit/types";

// ── Main Export ───────────────────────────────────────────────────────────────

/**
 * Runs a complete audit on an organization's AI tool subscriptions.
 *
 * Steps:
 *  1. Validate input
 *  2. Run all per-subscription rules (overpaying, seat waste, API alternatives, cross-vendor)
 *  3. Run all cross-subscription rules (overlap detection)
 *  4. Aggregate financials & compute score
 *  5. Generate executive summary (AI-enhanced when ANTHROPIC_API_KEY is set)
 *
 * @param input - The subscriptions and team context to audit
 * @param options.skipAiSummary - Force-skip AI enrichment (used by unit tests)
 * @returns A fully populated AuditResult with sorted recommendations
 *
 * @example
 * ```ts
 * const result = await runAudit({
 *   teamSize: 8,
 *   subscriptions: [
 *     { toolId: "cursor",         planId: "pro",        seats: 8, monthlySpend: 160 },
 *     { toolId: "github-copilot", planId: "business",   seats: 8, monthlySpend: 152 },
 *     { toolId: "chatgpt",        planId: "plus",        seats: 1, monthlySpend: 20, usageLevel: "low" },
 *   ],
 * });
 * console.log(result.totalAnnualSavings); // → $1,944
 * console.log(result.aiSummaryGenerated); // → true (if API key set), false otherwise
 * ```
 */
export async function runAudit(
  input: AuditInput,
  options: { skipAiSummary?: boolean } = {}
): Promise<AuditResult> {
  validateInput(input);

  const auditId = generateAuditId();
  const generatedAt = new Date().toISOString();

  // ── Total current spend ──────────────────────────────────────────────────
  const totalCurrentMonthlySpend = input.subscriptions.reduce(
    (sum, s) => sum + s.monthlySpend,
    0
  );

  const allRecommendations: ReturnType<typeof runSubscriptionRules> = [];

  // ── Per-subscription rules ───────────────────────────────────────────────
  for (const subscription of input.subscriptions) {
    let tool;
    try {
      tool = getToolById(subscription.toolId);
    } catch {
      // Skip unknown tools gracefully — don't crash the whole audit
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

  // Sort by highest monthly savings first
  const sortedRecommendations = allRecommendations.sort(
    (a, b) => b.monthlySavings - a.monthlySavings
  );

  // ── Summary (deterministic baseline — always computed first) ─────────────
  const deterministicSummary = generateSummary(
    sortedRecommendations,
    totalCurrentMonthlySpend,
    totalMonthlySavings
  );

  // ── AI-enhanced summary (non-blocking enrichment) ────────────────────────
  // Resolves to fallback instantly if ANTHROPIC_API_KEY is absent or times out.
  let summary = deterministicSummary;
  let aiSummaryGenerated = false;

  if (!options.skipAiSummary) {
    const toolNames = input.subscriptions
      .map((s) => TOOL_REGISTRY[s.toolId]?.name ?? s.toolId)
      .filter(Boolean);

    const aiResult = await generateAuditSummary({
      teamSize: input.teamSize,
      toolNames,
      totalCurrentMonthlySpend: roundCents(totalCurrentMonthlySpend),
      totalMonthlySavings,
      totalAnnualSavings,
      score,
      recommendations: sortedRecommendations.map((r) => ({
        title: r.title,
        monthlySavings: r.monthlySavings,
        severity: r.severity,
        confidence: r.confidence,
      })),
      fallbackSummary: deterministicSummary,
    });

    summary = aiResult.summary;
    aiSummaryGenerated = aiResult.aiGenerated;
  }

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
    summary,
    // Surface whether AI enhanced the summary — useful for UI badge and logging
    aiSummaryGenerated,
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
