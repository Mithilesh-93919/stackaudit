/**
 * @module types/audit
 * @description Audit-related TypeScript types for StackAudit.
 */

export type AuditStatus = "pending" | "running" | "completed" | "failed";

export type AuditSeverity = "low" | "medium" | "high" | "critical";

export type AuditFinding = {
  id: string;
  severity: AuditSeverity;
  title: string;
  description: string;
  toolId: string;
  estimatedSavings?: number;
  recommendation: string;
};

export type AuditReport = {
  id: string;
  organizationId: string;
  status: AuditStatus;
  createdAt: string;
  completedAt?: string;
  totalMonthlySpend: number;
  potentialSavings: number;
  score: number; // 0-100
  findings: AuditFinding[];
  toolsSurveyed: string[];
};

export type AuditSummary = Pick<
  AuditReport,
  | "id"
  | "status"
  | "createdAt"
  | "totalMonthlySpend"
  | "potentialSavings"
  | "score"
>;
