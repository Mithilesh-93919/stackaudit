/**
 * @module lib/validations
 * @description Zod schemas for all StackAudit API request/response validation.
 *
 * Schema map:
 *   auditInputSchema      — POST /api/audit body
 *   leadCaptureSchema     — POST /api/leads body
 *   shareTokenSchema      — GET /api/audit/[token] param
 */

import { z } from "zod";

// ── Re-usable primitives ──────────────────────────────────────────────────────

const usageLevelSchema = z.enum(["low", "medium", "high", "unknown"]);

const toolIdSchema = z.enum([
  "cursor",
  "github-copilot",
  "claude",
  "chatgpt",
  "anthropic-api",
  "openai-api",
  "gemini",
  "windsurf",
]);

// ── Audit Input ───────────────────────────────────────────────────────────────

const toolSubscriptionSchema = z.object({
  toolId: toolIdSchema,
  planId: z.string().min(1).max(50),
  seats: z.number().int().min(1).max(10_000),
  monthlySpend: z.number().min(0).max(1_000_000),
  activeSeats: z.number().int().min(0).max(10_000).optional(),
  monthlyInputTokens: z.number().min(0).optional(),
  monthlyOutputTokens: z.number().min(0).optional(),
  usageLevel: usageLevelSchema.optional(),
});

export const auditInputSchema = z.object({
  teamSize: z.number().int().min(1).max(100_000),
  subscriptions: z
    .array(toolSubscriptionSchema)
    .min(1, "At least one subscription is required")
    .max(20, "Maximum 20 subscriptions per audit"),
});

export type AuditInputPayload = z.infer<typeof auditInputSchema>;

// ── Lead Capture ──────────────────────────────────────────────────────────────

export const leadCaptureSchema = z.object({
  auditShareToken: z.string().min(1).max(50),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(254)
    .toLowerCase()
    .trim(),
  companyName: z.string().max(100).trim().optional(),
  role: z
    .enum(["CTO", "Founder", "Engineering Manager", "Finance", "Other", ""])
    .optional(),
  teamSize: z.number().int().min(1).max(100_000).optional(),
  consentedToMarketing: z.boolean().default(false),
  // Honeypot — must be empty string (bots fill this in)
  _hp: z.literal("").optional(),
});

export type LeadCapturePayload = z.infer<typeof leadCaptureSchema>;

// ── Share token param ─────────────────────────────────────────────────────────

export const shareTokenSchema = z.object({
  token: z
    .string()
    .min(8)
    .max(20)
    .regex(/^[A-Za-z0-9_-]+$/, "Invalid share token format"),
});
