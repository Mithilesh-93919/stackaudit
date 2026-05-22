import React from "react";
import type { Metadata } from "next";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { AuditResult } from "@/lib/audit/types";
import { AuditReport } from "@/components/audit/audit-report";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/shared/navbar";
import { ShieldAlert, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ token: string }>;
}

// ── Dynamic SEO & Open Graph Metadata Generation ──
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { token } = await params;
  
  try {
    const supabase = getSupabaseAdmin();
    const { data: dbAudit } = await supabase
      .from("audits")
      .select("score, total_annual_savings, tool_ids")
      .eq("share_token", token)
      .single();

    if (!dbAudit) {
      return {
        title: "Audit Report Not Found | StackAudit",
        description: "The requested AI spend audit report could not be found or has expired.",
      };
    }

    const savings = Number(dbAudit.total_annual_savings);
    const score = dbAudit.score;
    const toolsCount = dbAudit.tool_ids.length;

    const title = `StackAudit Report: Save $${savings.toLocaleString()}/yr on AI Tools`;
    const description = `This team has an AI Spend Health score of ${score}/100 and identified $${savings.toLocaleString()}/year in potential savings across ${toolsCount} tools. Review the details here.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
        url: `${process.env.NEXT_PUBLIC_APP_URL || "https://stackaudit.com"}/audit/share/${token}`,
        siteName: "StackAudit",
        images: [
          {
            url: `${process.env.NEXT_PUBLIC_APP_URL || "https://stackaudit.com"}/og-share-template.png`, // fallback absolute path
            width: 1200,
            height: 630,
            alt: "StackAudit Spend Optimization Report",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [`${process.env.NEXT_PUBLIC_APP_URL || "https://stackaudit.com"}/og-share-template.png`],
      },
    };
  } catch (error) {
    return {
      title: "AI Spend Audit Report | StackAudit",
      description: "Analyze startup AI software subscription spending and discover cost optimizations.",
    };
  }
}

// ── Shared Audit Page Component ──
export default async function SharePage({ params }: PageProps) {
  const { token } = await params;
  
  // 1. Query Supabase directly on the server
  let dbAudit = null;
  let fetchError = false;

  try {
    const supabase = getSupabaseAdmin();
    const { data } = await supabase
      .from("audits")
      .select("team_size, score, total_annual_savings, result_json")
      .eq("share_token", token)
      .single();
    
    dbAudit = data;
  } catch (err) {
    console.error("Error reading shared audit:", err);
    fetchError = true;
  }

  // 2. Render beautifully styled "Audit Not Found" empty state
  if (!dbAudit || fetchError) {
    return (
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300 font-sans flex flex-col justify-between">
        {/* Navbar */}
        <Navbar />

        {/* Content */}
        <main className="mx-auto max-w-md px-4 py-16 flex flex-col items-center justify-center grow">
          <Card className="border-border/40 bg-card p-8 w-full text-center space-y-6 shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 border border-destructive/20 text-destructive">
              <ShieldAlert className="h-7 w-7" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-foreground">Report Not Found</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The shared audit link is invalid, has expired, or was removed for privacy reasons.
              </p>
            </div>

            <div className="pt-2">
              <Link href="/audit/new">
                <Button className="w-full bg-primary hover:bg-primary/95 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-primary/10">
                  <span>Run a New Audit</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Card>
        </main>

        {/* Footer */}
        <footer className="border-t border-border/40 py-6 bg-muted/10 text-center text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} StackAudit. Security Guaranteed.</span>
        </footer>
      </div>
    );
  }

  const result = dbAudit.result_json as unknown as AuditResult;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 font-sans flex flex-col justify-between">
      {/* ── Navbar ── */}
      <Navbar />

      {/* ── Main Dashboard ── */}
      <main className="mx-auto max-w-6xl py-8 grow w-full">
        {/* Banner notifying visitor they are looking at a shared audit */}
        <div className="mx-auto max-w-4xl px-4 mb-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-xs">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="h-4 w-4 shrink-0 animate-pulse" />
              <span className="font-medium">You are viewing a shared cost optimization report. Ready to optimize your own stack?</span>
            </div>
            <Link href="/audit/new" className="shrink-0">
              <Button size="sm" className="h-8 bg-primary text-primary-foreground hover:bg-primary/95 text-[11px] font-bold shadow-md shadow-primary/10">
                Audit Your AI Stack Free
              </Button>
            </Link>
          </div>
        </div>

        {/* Mount sanitized shared report */}
        <AuditReport 
          result={result} 
          onReset={() => {
            // Client-side viral loop action redirecting public user to create their own audit
            if (typeof window !== "undefined") {
              window.location.href = "/audit/new";
            }
          }} 
        />
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border/40 py-6 bg-muted/10 text-center text-xs text-muted-foreground">
        <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>© {new Date().getFullYear()} StackAudit. All rights reserved.</span>
          <span>Security Guaranteed — All data processed locally.</span>
        </div>
      </footer>
    </div>
  );
}
