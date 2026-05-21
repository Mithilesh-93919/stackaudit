/**
 * @module types/user
 * @description User and organization TypeScript types for StackAudit.
 */

export type UserRole = "owner" | "admin" | "member" | "viewer";

export type Plan = "free" | "starter" | "pro" | "enterprise";

export type Organization = {
  id: string;
  name: string;
  slug: string;
  plan: Plan;
  teamSize: number;
  industry?: string;
  createdAt: string;
};

export type User = {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  role: UserRole;
  organizationId: string;
  createdAt: string;
  lastLoginAt?: string;
};

export type Session = {
  user: User;
  organization: Organization;
  expiresAt: string;
};
