import { NextRequest, NextResponse } from "next/server";
import { leadCaptureSchema } from "@/lib/validations";
import { getSupabaseAdmin } from "@/lib/supabase";
import { checkRateLimit, getClientIp } from "@/lib/backend-utils";
import { sendAuditConfirmationEmail } from "@/lib/email";
import type { AuditResult } from "@/lib/audit/types";

export const runtime = "nodejs";

/**
 * POST /api/leads
 * Captures email contact details after an audit completes, upserts them into
 * the database under the relevant audit reference, and triggers Resend notification.
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Parse request body
    const body = await request.json().catch(() => ({}));

    // 2. Honeypot check: If _hp field is filled, silently discard (return 200 to confuse bots)
    if (body._hp && body._hp !== "") {
      console.warn("[lead-capture] Honeypot field filled. Bot detected.");
      return NextResponse.json({ success: true, message: "Lead captured successfully" });
    }

    // 3. Validation using Zod schema
    const validationResult = leadCaptureSchema.safeParse(body);
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

    // 4. Abuse Protection: Rate Limit Check (max 5 leads per hour per IP)
    const ip = getClientIp(request.headers);
    const isAllowed = await checkRateLimit(ip, "lead", 5, 3600);
    
    if (!isAllowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // 5. Connect to Supabase to resolve the audit reference from shareToken
    const supabase = getSupabaseAdmin();
    
    const { data: dbAudit, error: auditError } = await supabase
      .from("audits")
      .select("id, result_json, total_monthly_savings, total_annual_savings")
      .eq("share_token", payload.auditShareToken)
      .single();

    if (auditError || !dbAudit) {
      return NextResponse.json(
        { error: "Audit session not found. Please run a new audit." },
        { status: 404 }
      );
    }

    const auditResult = dbAudit.result_json as unknown as AuditResult;

    // 6. Insert lead into Supabase leads table
    const { data: dbLead, error: leadError } = await supabase
      .from("leads")
      .insert({
        audit_id: dbAudit.id,
        email: payload.email,
        company_name: payload.companyName || null,
        role: payload.role || null,
        team_size: payload.teamSize || null,
        monthly_savings: dbAudit.total_monthly_savings,
        consented_to_marketing: payload.consentedToMarketing,
      })
      .select("id")
      .single();

    if (leadError) {
      console.error("Failed to insert lead into database:", leadError);
      return NextResponse.json(
        { error: "Failed to capture lead. Please try again." },
        { status: 500 }
      );
    }

    // Link audit record to this new lead (optional relationship back)
    await supabase
      .from("audits")
      .update({ lead_id: dbLead.id })
      .eq("id", dbAudit.id);

    // 7. Dispatch Transactional Confirmation Email via Resend
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://stackaudit.com";
    const shareUrl = `${appUrl}/audit/share/${payload.auditShareToken}`;
    
    const emailResult = await sendAuditConfirmationEmail({
      email: payload.email,
      companyName: payload.companyName,
      auditResult,
      shareUrl,
    });

    // 8. Update DB with email outcomes (graceful, do not crash if email fails)
    if (emailResult.success) {
      await supabase
        .from("leads")
        .update({
          confirmation_sent_at: new Date().toISOString(),
          confirmation_email_id: emailResult.messageId || null,
        })
        .eq("id", dbLead.id);
    } else {
      console.warn(`[lead-capture] Transactional email not sent: ${emailResult.error}`);
    }

    return NextResponse.json({
      success: true,
      message: "Lead captured successfully",
      emailSent: emailResult.success,
    });
  } catch (error: any) {
    console.error("Lead Capture API handler exception:", error);
    return NextResponse.json(
      { error: "Internal server error during lead registration." },
      { status: 500 }
    );
  }
}
