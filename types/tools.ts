/**
 * @module types/tools
 * @description AI tool TypeScript types for StackAudit.
 */

export type ToolCategory = "chat" | "coding" | "api" | "image" | "voice" | "video" | "other";

export type ToolVendor =
  | "OpenAI"
  | "Anthropic"
  | "Google"
  | "GitHub"
  | "Anysphere"
  | "Perplexity"
  | "Mistral"
  | "Other";

export type ToolPricingModel = "seat" | "usage" | "flat" | "freemium" | "enterprise";

export type AITool = {
  id: string;
  name: string;
  vendor: ToolVendor | string;
  category: ToolCategory;
  website: string;
  logoUrl?: string;
  description?: string;
  pricingModel: ToolPricingModel;
  monthlyPricePerSeat?: number;
  freeTrialAvailable: boolean;
};

export type ToolUsage = {
  toolId: string;
  seats: number;
  monthlySpend: number;
  usageHoursPerWeek?: number;
  primaryUseCase?: string;
};
