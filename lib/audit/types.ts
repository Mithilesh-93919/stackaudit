/**
 * @module lib/audit/types
 * @description All TypeScript interfaces for the StackAudit audit engine.
 */

// ── Tool Identifiers ──────────────────────────────────────────────────────────

export type ToolId =
  | "cursor"
  | "github-copilot"
  | "claude"
  | "chatgpt"
  | "anthropic-api"
  | "openai-api"
  | "gemini"
  | "windsurf";

export type ToolCategory = "coding" | "chat" | "api";

export type PlanCategory = "free" | "individual" | "team" | "enterprise" | "api";

// ── Pricing Definitions ───────────────────────────────────────────────────────

export type PlanDefinition = {
  /** Unique plan identifier within the tool, e.g. "pro", "business" */
  id: string;
  /** Human-readable plan name */
  name: string;
  /** Monthly price per seat (0 for free). Use for per-seat billing. */
  monthlyPricePerSeat: number;
  /** Monthly equivalent when billed annually (per seat) */
  annualBillingMonthlyPrice?: number;
  /**
   * If true, this plan is a flat fee for one user, not per-seat.
   * e.g. ChatGPT Plus ($20) or Claude Pro ($20) are single-user flat fees.
   */
  flatFee?: boolean;
  /** Minimum seats required to purchase this plan */
  minSeats?: number;
  plan: PlanCategory;
};

export type ToolDefinition = {
  id: ToolId;
  name: string;
  vendor: string;
  category: ToolCategory;
  plans: PlanDefinition[];
};

// ── Audit Input ───────────────────────────────────────────────────────────────

export type UsageLevel = "low" | "medium" | "high" | "unknown";

export type ToolSubscription = {
  toolId: ToolId;
  /** Must match a PlanDefinition.id from the tool's plans array */
  planId: string;
  /** Number of seats being paid for */
  seats: number;
  /** Actual monthly spend in USD */
  monthlySpend: number;
  /** Seats actively used — if provided, enables unused-seat detection */
  activeSeats?: number;
  /** For API tools: monthly input token consumption */
  monthlyInputTokens?: number;
  /** For API tools: monthly output token consumption */
  monthlyOutputTokens?: number;
  /** Self-reported or inferred usage level (used for API-vs-subscription rules) */
  usageLevel?: UsageLevel;
};

export type AuditInput = {
  organizationId?: string;
  /** Total headcount of the team using AI tools */
  teamSize: number;
  subscriptions: ToolSubscription[];
};

// ── Audit Output ──────────────────────────────────────────────────────────────

export type Confidence = "low" | "medium" | "high";
export type Severity = "low" | "medium" | "high";

export type Recommendation = {
  /** Unique ID for this recommendation instance */
  id: string;
  /** Which rule generated this */
  ruleId: string;
  /** Primary tool this recommendation is about. "cross-tool" for overlap rules. */
  toolId: ToolId | "cross-tool";
  severity: Severity;
  title: string;
  description: string;
  currentPlan: string;
  currentMonthlyCost: number;
  recommendedPlan: string;
  recommendedMonthlyCost: number;
  monthlySavings: number;
  annualSavings: number;
  confidence: Confidence;
  /** Plain-English explanation of the savings calculation */
  reasoning: string;
  /** Step-by-step action items */
  actionSteps: string[];
  /** Tool IDs affected (for cross-tool recommendations) */
  affectedToolIds?: ToolId[];
};

export type AuditResult = {
  auditId: string;
  generatedAt: string;
  teamSize: number;
  subscriptionsEvaluated: number;
  totalCurrentMonthlySpend: number;
  totalRecommendedMonthlySpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  /**
   * Optimization score 0–100.
   * 100 = no savings found (fully optimized).
   * 0 = entire spend is recoverable.
   */
  score: number;
  recommendations: Recommendation[];
  summary: string;
};

// ── Rule System ───────────────────────────────────────────────────────────────

/** Context passed to every per-subscription rule */
export type RuleContext = {
  subscription: ToolSubscription;
  tool: ToolDefinition;
  allSubscriptions: ToolSubscription[];
  teamSize: number;
};

/**
 * A rule that runs once per subscription.
 * Use for: overpaying, unused seats, plan downgrades, single-tool alternatives.
 */
export type SubscriptionRule = {
  type: "subscription";
  id: string;
  name: string;
  description: string;
  applies: (ctx: RuleContext) => boolean;
  evaluate: (ctx: RuleContext) => Recommendation | null;
};

/**
 * A rule that runs once across ALL subscriptions.
 * Use for: tool overlap, redundancy detection, portfolio optimization.
 */
export type CrossSubscriptionRule = {
  type: "cross";
  id: string;
  name: string;
  description: string;
  applies: (subscriptions: ToolSubscription[], teamSize: number) => boolean;
  evaluate: (subscriptions: ToolSubscription[], teamSize: number) => Recommendation | null;
};

export type Rule = SubscriptionRule | CrossSubscriptionRule;
