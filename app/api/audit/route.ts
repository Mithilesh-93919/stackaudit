import { NextRequest, NextResponse } from "next/server";
import { runAudit } from "@/lib/audit-engine";
import { auditInputSchema } from "@/lib/validations";
import { getSupabaseAdmin } from "@/lib/supabase";
import { checkRateLimit, getClientIp } from "@/lib/backend-utils";

export const runtime = "nodejs";

/**
 * POST /api/audit
 * Receives AI stack parameters, runs the deterministic audit engine,
 * persists the results in Supabase, and returns the share token.
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Abuse Protection: Rate Limit Check (max 15 audits per hour per IP)
    const ip = getClientIp(request.headers);
    const isAllowed = await checkRateLimit(ip, "audit", 15, 3600);
    
    if (!isAllowed) {
      return NextResponse.json(
        { error: "Too many audit requests. Please try again in an hour." },
        { status: 429 }
      );
    }

    // 2. Body parsing and schema validation
    const body = await request.json().catch(() => ({}));
    const validationResult = auditInputSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: "Invalid input parameters", 
          details: validationResult.error.flatten().fieldErrors 
        },
        { status: 400 }
      );
    }

    const payload = validationResult.data;

    // 3. Execute the core deterministic engine
    const auditResult = await runAudit(payload);

    // 4. Save to Supabase using admin client (bypasses RLS for secure insert)
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
        result_json: auditResult as any, // Cast to any for JSONB compatibility
        user_agent: request.headers.get("user-agent") || null,
      })
      .select("id, share_token")
      .single();

    if (dbError) {
      console.error("Database persistence failure:", dbError);
      return NextResponse.json(
        { error: "Failed to persist audit results to the database." },
        { status: 500 }
      );
    }

    // 5. Return full audit result along with its public share token
    return NextResponse.json({
      success: true,
      shareToken: dbAudit.share_token,
      auditId: dbAudit.id,
      result: auditResult,
    });
  } catch (error: any) {
    console.error("Audit API handler exception:", error);
    return NextResponse.json(
      { error: "Internal server error during audit compilation." },
      { status: 500 }
    );
  }
}
