import { NextRequest, NextResponse } from "next/server";
import { runAudit } from "@/lib/audit-engine";
import { generateAuditSummary } from "@/lib/ai";
import { auditInputSchema } from "@/lib/validations";
import { getSupabaseAdmin } from "@/lib/supabase";
import { checkRateLimit, getClientIp } from "@/lib/backend-utils";

export const runtime = "nodejs";

/**
 * POST /api/audit
 *
 * Flow:
 *  1. Rate-limit check (15 audits/hr/IP)
 *  2. Zod validation of request body
 *  3. Deterministic audit engine + AI-enhanced summary (claude-haiku-4-5)
 *  4. Persist full result to Supabase
 *  5. Return AuditResult + share token to client
 *
 * The AI summary generation (step 3) is non-blocking and falls back to the
 * deterministic template if ANTHROPIC_API_KEY is absent or times out.
 */
export async function POST(request: NextRequest) {
  try {
    // ── 1. Abuse Protection: rate limit ────────────────────────────────────
    const ip = getClientIp(request.headers);
    const isAllowed = await checkRateLimit(ip, "audit", 15, 3600);

    if (!isAllowed) {
      return NextResponse.json(
        { error: "Too many audit requests. Please try again in an hour." },
        { status: 429 }
      );
    }

    // ── 2. Parse + validate body ────────────────────────────────────────────
    const body = await request.json().catch(() => ({}));
    const validationResult = auditInputSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid input parameters",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const payload = validationResult.data;

    // ── 3. Run deterministic engine + AI summary enrichment ─────────────────
    // runAudit() always returns a valid result.
    // If ANTHROPIC_API_KEY is missing or the call times out, the fallback
    // deterministic summary is used transparently.
    const auditResult = await runAudit(payload, {
      aiSummaryProvider: generateAuditSummary,
    });

    console.info(
      `[api/audit] Completed — score=${auditResult.score}, savings=$${auditResult.totalMonthlySavings}/mo, ` +
        `aiSummary=${auditResult.aiSummaryGenerated ?? false}, tools=${payload.subscriptions.length}`
    );

    // ── 4. Persist to Supabase ──────────────────────────────────────────────
    const supabase = getSupabaseAdmin();
    const toolIds = payload.subscriptions.map((s) => s.toolId);

    const { data: dbAudit, error: dbError } = await supabase
      .from("audits")
      .insert({
        team_size: payload.teamSize,
        subscriptions_count: payload.subscriptions.length,
        tool_ids: toolIds,
        score: auditResult.score,
        total_current_monthly_spend: auditResult.totalCurrentMonthlySpend,
        total_recommended_monthly_spend: auditResult.totalRecommendedMonthlySpend,
        total_monthly_savings: auditResult.totalMonthlySavings,
        total_annual_savings: auditResult.totalAnnualSavings,
        recommendations_count: auditResult.recommendations.length,
        summary: auditResult.summary,
        // Persist the full AuditResult blob; the share page deserialises this
        result_json: auditResult as unknown as Record<string, unknown>,
        user_agent: request.headers.get("user-agent") ?? null,
      })
      .select("id, share_token")
      .single();

    if (dbError) {
      console.error("[api/audit] Database persistence failure:", dbError);
      return NextResponse.json(
        { error: "Failed to persist audit results to the database." },
        { status: 500 }
      );
    }

    // ── 5. Return result ────────────────────────────────────────────────────
    return NextResponse.json({
      success: true,
      shareToken: dbAudit.share_token,
      auditId: dbAudit.id,
      result: auditResult,
      // Surface to client whether the summary was AI-generated
      aiSummaryGenerated: auditResult.aiSummaryGenerated ?? false,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[api/audit] Handler exception:", message);
    return NextResponse.json(
      { error: "Internal server error during audit compilation." },
      { status: 500 }
    );
  }
}
