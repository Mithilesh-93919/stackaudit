import React from "react";
import type { Metadata } from "next";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { AuditResult } from "@/lib/audit/types";
import { AuditReport } from "@/components/audit/audit-report";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ token: string }>;
}

// ── Dynamic SEO & Open Graph Metadata Generation ─────────────────────────────
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

// ── Shared Audit Page Component ──────────────────────────────────────────────
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
      <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col justify-between">
        {/* Navbar */}
        <nav className="sticky top-0 z-50 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-sm font-black">
                SA
              </span>
              <span>StackAudit</span>
            </Link>
          </div>
        </nav>

        {/* Content */}
        <main className="mx-auto max-w-md px-4 py-16 flex flex-col items-center justify-center grow">
          <Card className="border-slate-800 bg-slate-900/60 p-8 w-full text-center space-y-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <ShieldAlert className="h-7 w-7" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">Report Not Found</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                The shared audit link is invalid, has expired, or was removed for privacy reasons.
              </p>
            </div>

            <div className="pt-2">
              <Link href="/audit/new">
                <Button className="w-full bg-violet-600 hover:bg-violet-500 text-xs font-semibold flex items-center justify-center gap-1.5">
                  <span>Run a New Audit</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Card>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-900 py-6 bg-slate-950 text-center text-xs text-slate-500">
          <span>© {new Date().getFullYear()} StackAudit. Security Guaranteed.</span>
        </footer>
      </div>
    );
  }

  const result = dbAudit.result_json as unknown as AuditResult;

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col justify-between">
      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-sm font-black">
              SA
            </span>
            <span>StackAudit</span>
          </Link>
          <span className="rounded-full bg-slate-900 border border-slate-800 px-3 py-1 text-xs text-slate-400 font-medium">
            Shared Spend Report
          </span>
        </div>
      </nav>

      {/* ── Main Dashboard ── */}
      <main className="mx-auto max-w-6xl py-8 grow w-full">
        {/* Banner notifying visitor they are looking at a shared audit */}
        <div className="mx-auto max-w-4xl px-4 mb-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-lg border border-violet-500/20 bg-violet-500/5 px-4 py-3 text-xs">
            <div className="flex items-center gap-2 text-violet-300">
              <Sparkles className="h-4 w-4 shrink-0 animate-pulse" />
              <span>You are viewing a shared cost optimization report. Ready to optimize your own stack?</span>
            </div>
            <Link href="/audit/new" className="shrink-0">
              <Button size="sm" className="h-8 bg-violet-600 hover:bg-violet-500 text-[11px] font-bold">
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
      <footer className="border-t border-slate-900 py-6 bg-slate-950 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>© {new Date().getFullYear()} StackAudit. All rights reserved.</span>
          <span>Security Guaranteed — All data processed locally.</span>
        </div>
      </footer>
    </div>
  );
}
