/**
 * @module lib/audit/pricing-data
 * @description Static pricing registry for all supported AI tools.
 *
 * MAINTENANCE: Verify prices quarterly against vendor pricing pages.
 * See PRICING_DATA.md for sources and update process.
 *
 * Last verified: 2025-01
 */

import type { ToolDefinition, ToolId } from "./types";

// ── Tool Registry ─────────────────────────────────────────────────────────────

export const TOOL_REGISTRY: Record<ToolId, ToolDefinition> = {
  cursor: {
    id: "cursor",
    name: "Cursor",
    vendor: "Anysphere",
    category: "coding",
    plans: [
      {
        id: "hobby",
        name: "Hobby",
        monthlyPricePerSeat: 0,
        plan: "free",
      },
      {
        id: "pro",
        name: "Pro",
        monthlyPricePerSeat: 20,
        annualBillingMonthlyPrice: 16, // $192/year
        plan: "individual",
      },
      {
        id: "business",
        name: "Business",
        monthlyPricePerSeat: 40,
        annualBillingMonthlyPrice: 32, // $384/year
        plan: "team",
      },
    ],
    website: "https://cursor.com",
  },

  "github-copilot": {
    id: "github-copilot",
    name: "GitHub Copilot",
    vendor: "GitHub / Microsoft",
    category: "coding",
    plans: [
      {
        id: "individual",
        name: "Individual",
        monthlyPricePerSeat: 10,
        annualBillingMonthlyPrice: 8.33, // $100/year
        plan: "individual",
      },
      {
        id: "business",
        name: "Business",
        monthlyPricePerSeat: 19,
        plan: "team",
      },
      {
        id: "enterprise",
        name: "Enterprise",
        monthlyPricePerSeat: 39,
        plan: "enterprise",
      },
    ],
    website: "https://github.com/settings/copilot",
  },

  claude: {
    id: "claude",
    name: "Claude",
    vendor: "Anthropic",
    category: "chat",
    plans: [
      {
        id: "free",
        name: "Free",
        monthlyPricePerSeat: 0,
        plan: "free",
      },
      {
        id: "pro",
        name: "Pro",
        monthlyPricePerSeat: 20,
        annualBillingMonthlyPrice: 16.67, // $200/year
        flatFee: true, // single-user flat fee
        plan: "individual",
      },
      {
        id: "team",
        name: "Team",
        monthlyPricePerSeat: 30,
        annualBillingMonthlyPrice: 25,
        minSeats: 5,
        plan: "team",
      },
      {
        id: "enterprise",
        name: "Enterprise",
        monthlyPricePerSeat: 0, // custom pricing
        plan: "enterprise",
      },
    ],
    website: "https://claude.ai/settings/billing",
  },

  chatgpt: {
    id: "chatgpt",
    name: "ChatGPT",
    vendor: "OpenAI",
    category: "chat",
    plans: [
      {
        id: "free",
        name: "Free",
        monthlyPricePerSeat: 0,
        plan: "free",
      },
      {
        id: "plus",
        name: "Plus",
        monthlyPricePerSeat: 20,
        flatFee: true, // single-user flat fee
        plan: "individual",
      },
      {
        id: "team",
        name: "Team",
        monthlyPricePerSeat: 30,
        annualBillingMonthlyPrice: 25,
        minSeats: 2,
        plan: "team",
      },
      {
        id: "enterprise",
        name: "Enterprise",
        monthlyPricePerSeat: 0, // custom pricing
        plan: "enterprise",
      },
    ],
    website: "https://chatgpt.com/#settings/billing",
  },

  "anthropic-api": {
    id: "anthropic-api",
    name: "Anthropic API",
    vendor: "Anthropic",
    category: "api",
    plans: [
      {
        id: "pay-as-you-go",
        name: "Pay-as-you-go",
        monthlyPricePerSeat: 0, // usage-based, no fixed fee
        plan: "api",
      },
    ],
    website: "https://console.anthropic.com/settings/billing",
  },

  "openai-api": {
    id: "openai-api",
    name: "OpenAI API",
    vendor: "OpenAI",
    category: "api",
    plans: [
      {
        id: "pay-as-you-go",
        name: "Pay-as-you-go",
        monthlyPricePerSeat: 0, // usage-based, no fixed fee
        plan: "api",
      },
    ],
    website: "https://platform.openai.com/settings/billing",
  },

  gemini: {
    id: "gemini",
    name: "Gemini",
    vendor: "Google",
    category: "chat",
    plans: [
      {
        id: "free",
        name: "Free",
        monthlyPricePerSeat: 0,
        plan: "free",
      },
      {
        id: "advanced",
        name: "Advanced (Google One AI Premium)",
        monthlyPricePerSeat: 19.99,
        flatFee: true,
        plan: "individual",
      },
    ],
    website: "https://one.google.com",
  },

  windsurf: {
    id: "windsurf",
    name: "Windsurf",
    vendor: "Codeium",
    category: "coding",
    plans: [
      {
        id: "free",
        name: "Free",
        monthlyPricePerSeat: 0,
        plan: "free",
      },
      {
        id: "pro",
        name: "Pro",
        monthlyPricePerSeat: 15,
        plan: "individual",
      },
      {
        id: "teams",
        name: "Teams",
        monthlyPricePerSeat: 35,
        plan: "team",
      },
    ],
    website: "https://codeium.com/windsurf",
  },
};

// ── Token Pricing (per 1M tokens, USD) ───────────────────────────────────────

export type TokenPricing = {
  model: string;
  inputPricePer1M: number;
  outputPricePer1M: number;
};

export const ANTHROPIC_TOKEN_PRICING: TokenPricing[] = [
  { model: "claude-3-haiku", inputPricePer1M: 0.25, outputPricePer1M: 1.25 },
  { model: "claude-3-5-sonnet", inputPricePer1M: 3.0, outputPricePer1M: 15.0 },
  { model: "claude-3-opus", inputPricePer1M: 15.0, outputPricePer1M: 75.0 },
];

export const OPENAI_TOKEN_PRICING: TokenPricing[] = [
  { model: "gpt-4o-mini", inputPricePer1M: 0.15, outputPricePer1M: 0.6 },
  { model: "gpt-4o", inputPricePer1M: 2.5, outputPricePer1M: 10.0 },
  { model: "gpt-4-turbo", inputPricePer1M: 10.0, outputPricePer1M: 30.0 },
];

/**
 * Estimated monthly API cost for a LOW-usage user on Claude (via Anthropic API, Haiku model).
 * Based on ~500K input + 100K output tokens/month.
 */
export const CLAUDE_API_LOW_USAGE_MONTHLY_USD = 0.25; // Haiku: 0.5M * $0.25/1M + 0.1M * $1.25/1M

/**
 * Estimated monthly API cost for a MEDIUM-usage user on Claude (Sonnet model).
 * Based on ~1M input + 300K output tokens/month.
 */
export const CLAUDE_API_MEDIUM_USAGE_MONTHLY_USD = 7.5; // Sonnet: 1M * $3 + 0.3M * $15

/**
 * Estimated monthly API cost for a LOW-usage user on OpenAI (GPT-4o mini model).
 * Based on ~500K input + 100K output tokens/month.
 */
export const OPENAI_API_LOW_USAGE_MONTHLY_USD = 0.14; // gpt-4o-mini: 0.5M * $0.15/1M + 0.1M * $0.60/1M

/**
 * Estimated monthly API cost for a MEDIUM-usage user on OpenAI (GPT-4o).
 * Based on ~1M input + 300K output tokens/month.
 */
export const OPENAI_API_MEDIUM_USAGE_MONTHLY_USD = 5.5; // gpt-4o: 1M * $2.50 + 0.3M * $10
