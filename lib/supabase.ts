/**
 * @module lib/supabase
 * @description Typed Supabase clients for StackAudit.
 *
 * Two clients:
 *   - supabasePublic  — anon key, safe for client components (RLS enforced)
 *   - supabaseAdmin   — service-role key, server-only, bypasses RLS
 *
 * Designed to dynamically evaluate env variables to prevent next build crashes.
 */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const getSupabaseUrl = () => process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const getSupabaseAnonKey = () => process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";
const getSupabaseServiceKey = () => process.env.SUPABASE_SERVICE_ROLE_KEY;

// ── Public client (RLS-gated) ─────────────────────────────────────────────────
// Lazily created wrapper to avoid module-load failures during static analysis
let publicClientInstance: any = null;

export const getSupabasePublic = (): any => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn("Supabase public credentials missing. Returning fallback placeholder client.");
  }
  
  if (!publicClientInstance) {
    publicClientInstance = createClient<Database>(
      getSupabaseUrl(),
      getSupabaseAnonKey(),
      { auth: { persistSession: false } }
    ) as any;
  }
  return publicClientInstance;
};

// For backward compatibility if imported as a constant
export const supabasePublic = getSupabasePublic();

// ── Admin client (service-role — server only) ─────────────────────────────────
export function getSupabaseAdmin(): any {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = getSupabaseServiceKey();

  if (!url || !serviceKey) {
    // Only throw at query runtime when called, never on module load
    console.warn("SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL is missing. DB operations will fail.");
    return createClient<Database>(
      getSupabaseUrl(),
      getSupabaseAnonKey(),
      { auth: { persistSession: false } }
    ) as any;
  }

  return createClient<Database>(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  }) as any;
}
