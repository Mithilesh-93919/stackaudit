-- ============================================================
-- StackAudit — Supabase Database Schema
-- Run this in: Supabase Dashboard > SQL Editor
-- ============================================================

-- ── Extensions ───────────────────────────────────────────────────────────────
create extension if not exists "pgcrypto";   -- gen_random_bytes, crypt
create extension if not exists "citext";     -- case-insensitive text for email

-- ── Helpers ──────────────────────────────────────────────────────────────────

-- Generates a URL-safe public share token (12 chars, ~72 bits of entropy)
create or replace function generate_share_token()
returns text language sql as $$
  select replace(replace(
    encode(gen_random_bytes(9), 'base64'),
    '/', '_'), '+', '-');
$$;

-- ── Table: audits ─────────────────────────────────────────────────────────────
-- Stores one row per completed audit run.
-- Public share pages only expose non-PII fields.

create table if not exists audits (
  -- Internal surrogate key
  id                          uuid primary key default gen_random_uuid(),

  -- Short, URL-safe token for /audit/share/[token]  (e.g. "xK3mNpQrSt0")
  share_token                 text not null unique default generate_share_token(),

  -- Optional: link to a lead once they submit the email capture form
  lead_id                     uuid,

  -- ── Audit inputs (sanitised — no PII) ─────────────────────────────────────
  team_size                   integer not null check (team_size >= 1),
  subscriptions_count         integer not null,
  tool_ids                    text[]  not null,   -- ["cursor","chatgpt"]

  -- ── Audit outputs ──────────────────────────────────────────────────────────
  score                       integer not null check (score between 0 and 100),
  total_current_monthly_spend numeric(10, 2) not null,
  total_recommended_monthly_spend numeric(10, 2) not null,
  total_monthly_savings       numeric(10, 2) not null,
  total_annual_savings        numeric(10, 2) not null,
  recommendations_count       integer not null,
  summary                     text not null,

  -- Full result blob for share page rendering (JSONB — no email/PII)
  result_json                 jsonb not null,

  -- ── Provenance ─────────────────────────────────────────────────────────────
  ip_hash                     text,              -- SHA-256 of client IP — for rate limiting, not PII
  user_agent                  text,
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);

-- ── Table: leads ─────────────────────────────────────────────────────────────
-- Stores opt-in lead data submitted after viewing audit results.
-- Created AFTER the audit row exists.

create table if not exists leads (
  id              uuid primary key default gen_random_uuid(),

  -- Link back to the audit that triggered this lead capture
  audit_id        uuid not null references audits(id) on delete cascade,

  -- Contact info (PII — never exposed via public APIs)
  email           citext not null,
  company_name    text,
  role            text,          -- "CTO", "Founder", "Finance", etc.
  team_size       integer,

  -- Qualification
  monthly_savings numeric(10, 2), -- copy from audit for quick CRM filtering

  -- Consent + source
  consented_to_marketing  boolean not null default false,
  source                  text not null default 'audit-flow',

  -- Email send status
  confirmation_sent_at    timestamptz,
  confirmation_email_id   text,       -- Resend message ID for idempotency

  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),

  -- One lead per email per audit (user can re-submit but it upserts)
  unique (audit_id, email)
);

-- ── Rate limit table ──────────────────────────────────────────────────────────
-- Lightweight IP-based rate limiting without a Redis dependency.
-- Rows are pruned by the cleanup function below.

create table if not exists rate_limit_events (
  id         bigserial primary key,
  ip_hash    text not null,
  action     text not null,    -- e.g. "audit", "lead"
  created_at timestamptz not null default now()
);

create index if not exists idx_rate_limit_ip_action_time
  on rate_limit_events (ip_hash, action, created_at desc);

-- ── Updated-at trigger ────────────────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger audits_updated_at
  before update on audits
  for each row execute function set_updated_at();

create trigger leads_updated_at
  before update on leads
  for each row execute function set_updated_at();

-- ── Row-Level Security ────────────────────────────────────────────────────────
-- Public read for share pages. All writes go through service-role key only.

alter table audits enable row level security;
alter table leads  enable row level security;
alter table rate_limit_events enable row level security;

-- Anyone can read audits by share_token (used by /audit/share/[token])
create policy "Public read audits by share_token"
  on audits for select
  using (true);

-- Only service role can insert/update/delete
create policy "Service role full access — audits"
  on audits for all
  using (auth.role() = 'service_role');

-- Leads are never public
create policy "Service role full access — leads"
  on leads for all
  using (auth.role() = 'service_role');

create policy "Service role full access — rate_limit"
  on rate_limit_events for all
  using (auth.role() = 'service_role');

-- ── Cleanup: prune old rate limit rows (run via pg_cron or manual) ────────────
create or replace function prune_rate_limit_events()
returns void language sql as $$
  delete from rate_limit_events where created_at < now() - interval '1 hour';
$$;

-- ── Circular Reference Constraint ───────────────────────────────────────────
alter table audits
  add constraint fk_audits_lead_id
  foreign key (lead_id)
  references leads(id)
  on delete set null;

