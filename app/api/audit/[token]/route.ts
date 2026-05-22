import { NextRequest, NextResponse } from "next/server";
import { shareTokenSchema } from "@/lib/validations";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { AuditResult } from "@/lib/audit/types";

export const runtime = "nodejs";

/**
 * GET /api/audit/[token]
 * Fetches a saved audit report by its public share token.
 * Guarantees privacy by sanitizing all responses to remove internal UUIDs,
 * client IP hashes, and personal metadata.
 */
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await props.params;

    // 1. Validate the share token path parameter
    const validationResult = shareTokenSchema.safeParse({ token });
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid share token format" },
        { status: 400 }
      );
    }

    // 2. Fetch the audit by token from the database
    const supabase = getSupabaseAdmin();
    const { data: dbAudit, error: dbError } = await supabase
      .from("audits")
      .select(`
        share_token,
        team_size,
        tool_ids,
        score,
        total_current_monthly_spend,
        total_recommended_monthly_spend,
        total_monthly_savings,
        total_annual_savings,
        summary,
        result_json,
        created_at
      `)
      .eq("share_token", token)
      .single();

    if (dbError || !dbAudit) {
      return NextResponse.json(
        { error: "Audit report not found or expired." },
        { status: 404 }
      );
    }

    // 3. Sanitise the JSON result block (strip internal IDs / user metadata if any)
    const rawResult = dbAudit.result_json as unknown as AuditResult;
    const sanitizedRecommendations = (rawResult.recommendations || []).map((rec) => ({
      id: rec.id,
      ruleId: rec.ruleId,
      toolId: rec.toolId,
      severity: rec.severity,
      title: rec.title,
      description: rec.description,
      currentPlan: rec.currentPlan,
      currentMonthlyCost: rec.currentMonthlyCost,
      recommendedPlan: rec.recommendedPlan,
      recommendedMonthlyCost: rec.recommendedMonthlyCost,
      monthlySavings: rec.monthlySavings,
      annualSavings: rec.annualSavings,
      confidence: rec.confidence,
      reasoning: rec.reasoning,
      actionSteps: rec.actionSteps,
      affectedToolIds: rec.affectedToolIds || [],
    }));

    const sanitizedResult: AuditResult = {
      auditId: rawResult.auditId,
      generatedAt: rawResult.generatedAt,
      teamSize: dbAudit.team_size,
      subscriptionsEvaluated: rawResult.subscriptionsEvaluated,
      totalCurrentMonthlySpend: Number(dbAudit.total_current_monthly_spend),
      totalRecommendedMonthlySpend: Number(dbAudit.total_recommended_monthly_spend),
      totalMonthlySavings: Number(dbAudit.total_monthly_savings),
      totalAnnualSavings: Number(dbAudit.total_annual_savings),
      score: dbAudit.score,
      recommendations: sanitizedRecommendations,
      summary: dbAudit.summary,
    };

    // 4. Return clean sanitised audit summary
    return NextResponse.json({
      success: true,
      audit: {
        shareToken: dbAudit.share_token,
        teamSize: dbAudit.team_size,
        toolIds: dbAudit.tool_ids,
        score: dbAudit.score,
        totalCurrentMonthlySpend: Number(dbAudit.total_current_monthly_spend),
        totalRecommendedMonthlySpend: Number(dbAudit.total_recommended_monthly_spend),
        totalMonthlySavings: Number(dbAudit.total_monthly_savings),
        totalAnnualSavings: Number(dbAudit.total_annual_savings),
        summary: dbAudit.summary,
        resultJson: sanitizedResult,
        createdAt: dbAudit.created_at,
      },
    });
  } catch (error: any) {
    console.error("Fetch Shared Audit API handler exception:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
