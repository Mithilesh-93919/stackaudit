import { Resend } from "resend";
import type { AuditResult } from "@/lib/audit/types";

// Initialize Resend with key from env
const resendApiKey = process.env.RESEND_API_KEY;
// Safe lazy initialization to prevent crashes if key is initially empty
const getResendClient = () => {
  if (!resendApiKey) {
    return null;
  }
  return new Resend(resendApiKey);
};

interface SendAuditEmailParams {
  email: string;
  companyName?: string;
  auditResult: AuditResult;
  shareUrl: string;
}

/**
 * Sends a high-fidelity audit results confirmation email to the user.
 * Features:
 *  - Clear breakdown of current spend, optimized spend, and annual savings.
 *  - Dynamic conditional CTA: For high-savings teams (>$100/mo or $1200/yr), 
 *    highlights a strategic Credex AI Consultation to execute savings.
 *  - Resend error isolation (graceful fail-safe fallback).
 */
export async function sendAuditConfirmationEmail({
  email,
  companyName,
  auditResult,
  shareUrl,
}: SendAuditEmailParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const resend = getResendClient();
    if (!resend) {
      console.warn("RESEND_API_KEY is not configured. Email notification skipped.");
      return { success: false, error: "Email provider not configured" };
    }

    const { score, totalCurrentMonthlySpend, totalMonthlySavings, totalAnnualSavings, recommendations } = auditResult;
    const nameLabel = companyName ? `team at ${companyName}` : "team";
    const isHighSavings = totalAnnualSavings >= 1200 || totalMonthlySavings >= 100;

    // ── Email Styling Constants ──
    const styles = {
      container: "font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1e293b; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;",
      header: "margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #f1f5f9; text-align: center;",
      title: "font-size: 24px; font-weight: 800; color: #7c3aed; margin: 0 0 8px 0;",
      subtitle: "font-size: 14px; color: #64748b; margin: 0;",
      card: "background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 8px; padding: 20px; margin-bottom: 24px; text-align: center;",
      statsRow: "display: flex; justify-content: space-around; margin: 20px 0;",
      statCol: "flex: 1; padding: 8px;",
      statValue: "font-size: 20px; font-weight: 800; color: #0f172a;",
      savingsValue: "font-size: 24px; font-weight: 800; color: #22c55e;",
      statLabel: "font-size: 11px; font-weight: 600; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px; margin-top: 4px;",
      summaryText: "font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 16px 0; text-align: left;",
      consultCard: "background-color: #f5f3ff; border: 1px solid #ddd6fe; border-radius: 8px; padding: 20px; margin-bottom: 24px; text-align: left;",
      consultTitle: "font-size: 15px; font-weight: 700; color: #6d28d9; margin: 0 0 6px 0; display: flex; align-items: center;",
      consultText: "font-size: 13px; line-height: 1.5; color: #5b21b6; margin: 0 0 14px 0;",
      btn: "display: inline-block; background-color: #7c3aed; color: #ffffff; font-weight: 600; font-size: 14px; text-decoration: none; padding: 12px 24px; border-radius: 8px; text-align: center; margin-top: 10px;",
      consultBtn: "display: inline-block; background-color: #7c3aed; color: #ffffff; font-weight: 600; font-size: 13px; text-decoration: none; padding: 10px 20px; border-radius: 6px; text-align: center;",
      footer: "text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 16px; margin-top: 24px;",
    };

    // ── Email HTML compilation ──
    let emailHtml = `
      <div style="${styles.container}">
        <div style="${styles.header}">
          <h1 style="${styles.title}">StackAudit Results</h1>
          <p style="${styles.subtitle}">Your custom AI tool cost analysis report</p>
        </div>

        <div style="${styles.card}">
          <div style="font-size: 12px; font-weight: 600; text-transform: uppercase; color: #64748b; margin-bottom: 6px;">
            AI Spend Score
          </div>
          <div style="font-size: 40px; font-weight: 900; color: ${score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444'}">
            ${score}/100
          </div>
          <p style="font-size: 13px; color: #64748b; margin: 4px 0 16px 0;">
            ${score >= 80 ? "Great job! Minor optimization possible." : "Significant savings potential identified."}
          </p>

          <div style="${styles.statsRow}">
            <div style="${styles.statCol}">
              <div style="${styles.statValue}">$${totalCurrentMonthlySpend.toFixed(0)}</div>
              <div style="${styles.statLabel}">Current Spend/mo</div>
            </div>
            <div style="${styles.statCol}">
              <div style="${styles.savingsValue}">$${totalMonthlySavings.toFixed(0)}</div>
              <div style="${styles.statLabel}">Monthly Savings</div>
            </div>
            <div style="${styles.statCol}">
              <div style="${styles.savingsValue}">$${totalAnnualSavings.toFixed(0)}</div>
              <div style="${styles.statLabel}">Annual Savings</div>
            </div>
          </div>

          <a href="${shareUrl}" style="${styles.btn}" target="_blank">
            View Complete Report
          </a>
        </div>

        <h3 style="font-size: 15px; font-weight: 750; color: #0f172a; margin: 0 0 8px 0;">Executive Summary</h3>
        <p style="${styles.summaryText}">${auditResult.summary}</p>
        
        <h4 style="font-size: 13px; font-weight: 700; color: #475569; margin: 16px 0 8px 0;">Key Action Steps Identified (${recommendations.length}):</h4>
        <ul style="font-size: 13px; color: #475569; padding-left: 20px; line-height: 1.5; margin: 0 0 24px 0;">
          ${recommendations
            .map((rec) => `<li><strong>${rec.title}</strong>: Save $${rec.monthlySavings.toFixed(0)}/mo</li>`)
            .join("")}
        </ul>
    `;

    // ── High-Savings strategic Credex partner CTA ──
    if (isHighSavings) {
      emailHtml += `
        <div style="${styles.consultCard}">
          <h4 style="${styles.consultTitle}">
            🎁 Strategic AI Cost Consultation Available
          </h4>
          <p style="${styles.consultText}">
            Based on your high annual savings potential of <strong>$${totalAnnualSavings.toFixed(0)}</strong>, 
            you qualify for a complimentary 1-on-1 AI stack review with our partner <strong>Credex</strong>. 
            They will help you negotiate licenses, audit unused API keys, and streamline your software spend securely.
          </p>
          <a href="https://calendly.com/credex-audit-specialist" style="${styles.consultBtn}" target="_blank">
            Schedule 15-Min Strategic Consultation
          </a>
        </div>
      `;
    }

    emailHtml += `
        <div style="${styles.footer}">
          <p>StackAudit — Stop paying for AI tools your team doesn't use.</p>
          <p style="margin-top: 4px; font-size: 11px;">This audit was processed securely. No password or card required.</p>
        </div>
      </div>
    `;

    // Send email using Resend
    const data = await resend.emails.send({
      from: "StackAudit <audits@stackaudit.com>", // or verified sender domain
      to: [email],
      subject: `StackAudit Report: Save $${totalAnnualSavings.toFixed(0)}/yr on your AI Stack`,
      html: emailHtml,
    });

    if (data.error) {
      console.error("Resend delivery failed:", data.error);
      return { success: false, error: data.error.message };
    }

    return { success: true, messageId: data.data?.id };
  } catch (error: any) {
    console.error("Failed to send transactional email:", error);
    return { success: false, error: error.message || "Unknown email dispatch error" };
  }
}
