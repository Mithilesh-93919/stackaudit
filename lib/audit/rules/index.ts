/**
 * @module lib/audit/rules/index
 * @description Rule registry — exports all rules and the rule runner.
 */

import { apiOptimizationRules } from "./api-optimization";
import { crossVendorRules } from "./cross-vendor";
import { overpayingRules } from "./overpaying";
import { seatOptimizationRules } from "./seat-optimization";
import { toolOverlapRules } from "./tool-overlap";
import type {
  CrossSubscriptionRule,
  Recommendation,
  RuleContext,
  SubscriptionRule,
  ToolSubscription,
} from "../types";

// ── Rule Collections ──────────────────────────────────────────────────────────

/** All per-subscription rules, in evaluation priority order. */
export const SUBSCRIPTION_RULES: SubscriptionRule[] = [
  ...overpayingRules,       // highest priority — clear financial waste
  ...seatOptimizationRules, // seat-level waste
  ...apiOptimizationRules,  // API vs subscription trade-offs
  ...crossVendorRules,      // alternative tool suggestions
];

/** All cross-subscription rules, evaluated once per audit. */
export const CROSS_RULES: CrossSubscriptionRule[] = [
  ...toolOverlapRules,
];

// ── Rule Runner ───────────────────────────────────────────────────────────────

/**
 * Runs all per-subscription rules against a single subscription.
 * Returns all non-null recommendations from matching rules.
 */
export function runSubscriptionRules(ctx: RuleContext): Recommendation[] {
  const results: Recommendation[] = [];

  for (const rule of SUBSCRIPTION_RULES) {
    try {
      if (rule.applies(ctx)) {
        const rec = rule.evaluate(ctx);
        if (rec !== null) results.push(rec);
      }
    } catch (err) {
      // Isolate rule failures — one bad rule must not abort the full audit
      console.error(`[audit-engine] Rule "${rule.id}" threw an error:`, err);
    }
  }

  return results;
}

/**
 * Runs all cross-subscription rules against the full subscription list.
 * Returns all non-null recommendations from matching rules.
 */
export function runCrossRules(
  subscriptions: ToolSubscription[],
  teamSize: number
): Recommendation[] {
  const results: Recommendation[] = [];

  for (const rule of CROSS_RULES) {
    try {
      if (rule.applies(subscriptions, teamSize)) {
        const rec = rule.evaluate(subscriptions, teamSize);
        if (rec !== null) results.push(rec);
      }
    } catch (err) {
      console.error(`[audit-engine] Cross-rule "${rule.id}" threw an error:`, err);
    }
  }

  return results;
}
