/**
 * @module lib/ai
 * @description AI integration layer for StackAudit.
 *
 * Primary feature: generateAuditSummary()
 *   - Calls Anthropic claude-haiku-4-5 with structured audit context
 *   - Returns a ~100-word executive-style optimization narrative
 *   - Gracefully falls back to the deterministic template summary on any failure
 *   - Enforces a hard 8-second timeout to never block the API response
 *   - Retries once on transient 5xx errors
 *
 * Prompt source: PROMPTS.md § "Audit Executive Summary"
 * Model choice: claude-haiku-4-5 — fastest, cheapest, ~$0.0003 per audit call
 */

import Anthropic from "@anthropic-ai/sdk";
import type { Recommendation } from "@/lib/audit/types";

// ── Constants ─────────────────────────────────────────────────────────────────

const MODEL = "claude-haiku-4-5";
const MAX_TOKENS = 220; // ~100 output words with a safety ceiling
const TIMEOUT_MS = 8_000; // Hard wall — never block the API route longer than this
const MAX_RETRIES = 1; // One retry on transient errors

// ── Types ─────────────────────────────────────────────────────────────────────

export type AuditSummaryInput = {
  teamSize: number;
  toolNames: string[]; // e.g. ["Cursor", "GitHub Copilot", "ChatGPT"]
  totalCurrentMonthlySpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  score: number;
  recommendations: Pick<
    Recommendation,
    "title" | "monthlySavings" | "severity" | "confidence"
  >[];
  /** Deterministic fallback — always pre-computed before calling AI */
  fallbackSummary: string;
};

export type AuditSummaryResult = {
  summary: string;
  /** true = Anthropic responded; false = template fallback used */
  aiGenerated: boolean;
  /** Tokens consumed (0 on fallback) */
  tokensUsed: number;
};

// ── Client factory (lazy, avoids build-time crash if key is absent) ───────────

function getAnthropicClient(): Anthropic | null {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    console.warn("[ai] ANTHROPIC_API_KEY is not set — AI summary disabled.");
    return null;
  }
  return new Anthropic({ apiKey: key, maxRetries: MAX_RETRIES });
}

// ── Prompt builder ────────────────────────────────────────────────────────────

/**
 * Builds the structured user message sent to Claude.
 * Kept tightly scoped to minimise tokens and stay on-topic.
 * Full prompt spec in PROMPTS.md § "Audit Executive Summary v2"
 */
function buildPrompt(input: AuditSummaryInput): string {
  const {
    teamSize,
    toolNames,
    totalCurrentMonthlySpend,
    totalMonthlySavings,
    totalAnnualSavings,
    score,
    recommendations,
  } = input;

  const topRecs = recommendations
    .slice(0, 3)
    .map(
      (r, i) =>
        `${i + 1}. ${r.title} — saves $${r.monthlySavings.toFixed(0)}/mo (${r.severity} severity, ${r.confidence} confidence)`
    )
    .join("\n");

  const savingsPct =
    totalCurrentMonthlySpend > 0
      ? Math.round((totalMonthlySavings / totalCurrentMonthlySpend) * 100)
      : 0;

  return `You are an AI spend analyst writing a short executive summary for a startup CTO or founder.

AUDIT DATA:
- Team size: ${teamSize} people
- AI tools audited: ${toolNames.join(", ")}
- Current monthly AI spend: $${totalCurrentMonthlySpend.toFixed(0)}/mo
- Identified monthly savings: $${totalMonthlySavings.toFixed(0)}/mo (${savingsPct}% reduction)
- Annualised savings potential: $${totalAnnualSavings.toFixed(0)}/yr
- Optimization score: ${score}/100
- Top findings:
${topRecs || "No savings identified — stack appears optimized."}

Write a 2-sentence executive summary (≈80–100 words total). Rules:
- Start with the dollar figure or the score.
- Be specific: name actual tools from the audit data.
- Use confident, professional language — no hedging words like "might" or "possibly".
- Do NOT use bullet points, headers, or markdown — plain prose only.
- Do NOT repeat "StackAudit" more than once.
- End with a clear action directive.`;
}

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * Generates an AI-powered executive summary for an audit result.
 *
 * Always returns a valid summary — uses `input.fallbackSummary` if the
 * Anthropic call times out, is unavailable, or throws any error.
 *
 * @example
 * ```ts
 * const { summary, aiGenerated } = await generateAuditSummary({
 *   teamSize: 8,
 *   toolNames: ["Cursor", "GitHub Copilot"],
 *   totalCurrentMonthlySpend: 312,
 *   totalMonthlySavings: 100,
 *   totalAnnualSavings: 1200,
 *   score: 68,
 *   recommendations: [...],
 *   fallbackSummary: "StackAudit identified 2 optimizations...",
 * });
 * ```
 */
export async function generateAuditSummary(
  input: AuditSummaryInput
): Promise<AuditSummaryResult> {
  const client = getAnthropicClient();

  // Immediately return fallback if no key is configured
  if (!client) {
    return {
      summary: input.fallbackSummary,
      aiGenerated: false,
      tokensUsed: 0,
    };
  }

  // Also skip AI call if there are no recommendations — the "optimized" message
  // is already perfect as written and AI would add nothing.
  if (input.recommendations.length === 0) {
    return {
      summary: input.fallbackSummary,
      aiGenerated: false,
      tokensUsed: 0,
    };
  }

  const prompt = buildPrompt(input);

  try {
    // Race the Anthropic call against a hard timeout so we never stall the
    // API route for longer than TIMEOUT_MS.
    const message = await Promise.race([
      client.messages.create({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system:
          "You are a concise AI spend analyst. Output exactly 2 sentences of plain prose. No markdown, no lists.",
        messages: [{ role: "user", content: prompt }],
      }),
      new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error(`Anthropic timeout after ${TIMEOUT_MS}ms`)),
          TIMEOUT_MS
        )
      ),
    ]);

    // Extract the text content block
    const textBlock = message.content.find((c) => c.type === "text");
    const rawText = textBlock?.type === "text" ? textBlock.text.trim() : "";

    if (!rawText) {
      console.warn("[ai] Anthropic returned empty content — using fallback.");
      return {
        summary: input.fallbackSummary,
        aiGenerated: false,
        tokensUsed: message.usage.output_tokens,
      };
    }

    console.info(
      `[ai] Summary generated. Tokens: ${message.usage.input_tokens}in / ${message.usage.output_tokens}out`
    );

    return {
      summary: rawText,
      aiGenerated: true,
      tokensUsed: message.usage.output_tokens,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[ai] generateAuditSummary failed — falling back: ${message}`);

    return {
      summary: input.fallbackSummary,
      aiGenerated: false,
      tokensUsed: 0,
    };
  }
}
