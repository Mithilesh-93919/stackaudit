import crypto from "crypto";
import { getSupabaseAdmin } from "./supabase";

/**
 * Generates a privacy-safe SHA-256 hash of the client IP address.
 * This guarantees GDPR compliance by avoiding storage of plain PII.
 */
export function hashIp(ip: string): string {
  return crypto.createHash("sha256").update(ip).digest("hex");
}

/**
 * A lightweight database-backed rate limiter for serverless environments.
 * Prevents API abuse (e.g. running mock audits or spamming lead generation).
 * 
 * @param ip Client IP address
 * @param action Action being performed (e.g. "audit", "lead")
 * @param limit Max allowed attempts in the window
 * @param windowSeconds Window duration in seconds
 * @returns Promise<boolean> True if request is allowed, false if rate limited
 */
export async function checkRateLimit(
  ip: string,
  action: string,
  limit: number,
  windowSeconds: number
): Promise<boolean> {
  try {
    const ipHash = hashIp(ip);
    const supabase = getSupabaseAdmin();
    const cutoffTime = new Date(Date.now() - windowSeconds * 1000).toISOString();

    // 1. Clean up old rate limit events for this action (keep db lean)
    // Run asynchronously to not block the current request
    supabase
      .from("rate_limit_events")
      .delete()
      .lt("created_at", cutoffTime)
      .then(({ error }: any) => {
        if (error) console.error("Rate limit cleanup failed:", error);
      });

    // 2. Count active hits within the window
    const { count, error: countError } = await supabase
      .from("rate_limit_events")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .eq("action", action)
      .gte("created_at", cutoffTime);

    if (countError) {
      console.error("Failed to query rate limit events:", countError);
      return true; // Graceful fallback: fail-open on DB errors
    }

    const currentHits = count || 0;

    if (currentHits >= limit) {
      return false; // Rate limited!
    }

    // 3. Record the current event hit
    const { error: insertError } = await supabase
      .from("rate_limit_events")
      .insert({
        ip_hash: ipHash,
        action,
      });

    if (insertError) {
      console.error("Failed to record rate limit hit:", insertError);
    }

    return true;
  } catch (error) {
    console.error("Rate limiter exception:", error);
    return true; // Graceful fallback: fail-open on code errors
  }
}

/**
 * Extracts the real client IP address from NextRequest headers.
 */
export function getClientIp(headers: Headers): string {
  const xForwardedFor = headers.get("x-forwarded-for");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0]?.trim() || "127.0.0.1";
  }
  const realIp = headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  return "127.0.0.1";
}
