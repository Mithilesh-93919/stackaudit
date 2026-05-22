/**
 * @module types/database
 * @description TypeScript types derived from the Supabase schema.
 *
 * These are hand-authored to stay in sync with supabase/schema.sql.
 * They are NOT auto-generated — keep them aligned on schema changes.
 */

// ── Raw DB row types ──────────────────────────────────────────────────────────

export type DbAudit = {
  id: string;
  share_token: string;
  lead_id: string | null;
  team_size: number;
  subscriptions_count: number;
  tool_ids: string[];
  score: number;
  total_current_monthly_spend: number;
  total_recommended_monthly_spend: number;
  total_monthly_savings: number;
  total_annual_savings: number;
  recommendations_count: number;
  summary: string;
  result_json: unknown;        // typed at point of use via AuditResult
  ip_hash: string | null;
  user_agent: string | null;
  created_at: string;
  updated_at: string;
};

export type DbLead = {
  id: string;
  audit_id: string;
  email: string;
  company_name: string | null;
  role: string | null;
  team_size: number | null;
  monthly_savings: number | null;
  consented_to_marketing: boolean;
  source: string;
  confirmation_sent_at: string | null;
  confirmation_email_id: string | null;
  created_at: string;
  updated_at: string;
};

export type DbRateLimitEvent = {
  id: number;
  ip_hash: string;
  action: string;
  created_at: string;
};

// ── Supabase Database helper type (for createClient<Database>) ────────────────

export type Database = {
  public: {
    Tables: {
      audits: {
        Row: DbAudit;
        Insert: {
          id?: string;
          share_token?: string;
          lead_id?: string | null;
          team_size: number;
          subscriptions_count: number;
          tool_ids: string[];
          score: number;
          total_current_monthly_spend: number;
          total_recommended_monthly_spend: number;
          total_monthly_savings: number;
          total_annual_savings: number;
          recommendations_count: number;
          summary: string;
          result_json: unknown;
          ip_hash?: string | null;
          user_agent?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          share_token?: string;
          lead_id?: string | null;
          team_size?: number;
          subscriptions_count?: number;
          tool_ids?: string[];
          score?: number;
          total_current_monthly_spend?: number;
          total_recommended_monthly_spend?: number;
          total_monthly_savings?: number;
          total_annual_savings?: number;
          recommendations_count?: number;
          summary?: string;
          result_json?: unknown;
          ip_hash?: string | null;
          user_agent?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      leads: {
        Row: DbLead;
        Insert: {
          id?: string;
          audit_id: string;
          email: string;
          company_name?: string | null;
          role?: string | null;
          team_size?: number | null;
          monthly_savings?: number | null;
          consented_to_marketing?: boolean;
          source?: string;
          confirmation_sent_at?: string | null;
          confirmation_email_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          audit_id?: string;
          email?: string;
          company_name?: string | null;
          role?: string | null;
          team_size?: number | null;
          monthly_savings?: number | null;
          consented_to_marketing?: boolean;
          source?: string;
          confirmation_sent_at?: string | null;
          confirmation_email_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      rate_limit_events: {
        Row: DbRateLimitEvent;
        Insert: {
          id?: number;
          ip_hash: string;
          action: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          ip_hash?: string;
          action?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};

// ── Public-safe audit response type (no PII) ─────────────────────────────────

export type PublicAudit = {
  shareToken: string;
  teamSize: number;
  toolIds: string[];
  score: number;
  totalCurrentMonthlySpend: number;
  totalRecommendedMonthlySpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  recommendationsCount: number;
  summary: string;
  resultJson: unknown;
  createdAt: string;
};
