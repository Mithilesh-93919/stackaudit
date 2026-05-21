/**
 * @module validations
 * @description Zod validation schemas for StackAudit.
 * Covers form validation, API request/response validation,
 * and data integrity checks.
 *
 * TODO: Add Zod as dependency: npm install zod
 */

// import { z } from "zod";

// ── Audit Form ──────────────────────────────────────────────────────────────

// export const auditFormSchema = z.object({
//   companyName: z.string().min(1, "Company name is required").max(100),
//   teamSize: z.number().int().positive("Team size must be positive"),
//   monthlyBudget: z.number().nonnegative().optional(),
//   selectedTools: z.array(z.string()).min(1, "Select at least one tool"),
//   email: z.string().email("Invalid email address"),
// });

// export type AuditFormValues = z.infer<typeof auditFormSchema>;

// ── Onboarding ──────────────────────────────────────────────────────────────

// export const onboardingSchema = z.object({
//   companyName: z.string().min(1),
//   industry: z.enum(["startup", "smb", "enterprise", "agency", "freelance"]),
//   teamSize: z.number().int().min(1).max(100000),
// });

// export type OnboardingValues = z.infer<typeof onboardingSchema>;

// ── Placeholder export to prevent "empty module" TS error ──────────────────

export const VALIDATIONS_PLACEHOLDER = true;
