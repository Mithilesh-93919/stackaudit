/**
 * @module supabase
 * @description Supabase client configuration for StackAudit.
 * Provides typed database client for server-side and client-side usage.
 *
 * TODO: Install Supabase: npm install @supabase/supabase-js @supabase/ssr
 * TODO: Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
 * TODO: Set SUPABASE_SERVICE_ROLE_KEY in .env.local (server-side only)
 */

// import { createClient } from "@supabase/supabase-js";
// import { createServerClient } from "@supabase/ssr";
// import type { Database } from "@/types/database";

// ── Client-side Supabase client ─────────────────────────────────────────────

// export const supabase = createClient<Database>(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );

// ── Server-side Supabase client (for Route Handlers / Server Actions) ───────

// export function createSupabaseServerClient() {
//   return createServerClient<Database>(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     { cookies: {} } // Wire up Next.js cookies() here
//   );
// }

export const SUPABASE_PLACEHOLDER = true;
