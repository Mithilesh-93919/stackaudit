"use client";

import React, { useState } from "react";
import type { AuditResult } from "@/lib/audit/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { FindingCard } from "./finding-card";
import {
  TrendingDown,
  ArrowRight,
  TrendingUp,
  Share2,
  Copy,
  ChevronLeft,
  DollarSign,
  Award,
  Sparkles,
  CheckCircle,
  FileCheck2,
} from "lucide-react";
import { toast } from "sonner";

import { LeadCapture } from "./lead-capture";

interface AuditReportProps {
  result: AuditResult;
  shareToken?: string;
  onReset: () => void;
}

export function AuditReport({ result, shareToken, onReset }: AuditReportProps) {
  const [copied, setCopied] = useState(false);

  const {
    teamSize,
    subscriptionsEvaluated,
    totalCurrentMonthlySpend,
    totalRecommendedMonthlySpend,
    totalMonthlySavings,
    totalAnnualSavings,
    score,
    recommendations,
    summary,
  } = result;

  const handleCopyReport = () => {
    const text = `StackAudit AI Spend Report Summary:
------------------------------------------
Team Size: ${teamSize} members
Tools Evaluated: ${subscriptionsEvaluated}
Optimization Score: ${score}/100
Current Monthly Spend: $${totalCurrentMonthlySpend.toFixed(2)}/mo
Recommended Monthly Spend: $${totalRecommendedMonthlySpend.toFixed(2)}/mo
Total Monthly Savings: $${totalMonthlySavings.toFixed(2)}/mo
Annualized Savings Potential: $${totalAnnualSavings.toFixed(2)}/yr

Summary:
${summary}

Generated via StackAudit.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Audit report summary copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine score colors
  const getScoreColor = (s: number) => {
    if (s >= 90) return "text-emerald-400";
    if (s >= 70) return "text-violet-400";
    if (s >= 50) return "text-amber-400";
    return "text-rose-400";
  };

  const getScoreBg = (s: number) => {
    if (s >= 90) return "bg-emerald-500/10 border-emerald-500/20";
    if (s >= 70) return "bg-violet-500/10 border-violet-500/20";
    if (s >= 50) return "bg-amber-500/10 border-amber-500/20";
    return "bg-rose-500/10 border-rose-500/20";
  };

  // ── "Already Optimized" Success State ──
  if (recommendations.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <Card className="border-slate-800 bg-slate-900/60 p-8 text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 animate-pulse">
            <Award className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/25 px-3 py-1 text-xs font-bold text-emerald-400 tracking-wider uppercase">
              100/100 Perfect Score
            </span>
            <h2 className="text-2xl font-black text-white">Your stack is perfectly optimized!</h2>
            <p className="mx-auto max-w-md text-sm text-slate-400">
              StackAudit analyzed your stack of {subscriptionsEvaluated} tools for {teamSize} users and found zero waste, redundant plans, or seat overages. Excellent work!
            </p>
          </div>

          <Separator className="border-slate-800/80" />

          <div className="text-left space-y-3 rounded-xl border border-slate-800 bg-slate-950/40 p-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
              How you are staying lean:
            </h3>
            <ul className="text-xs text-slate-400 space-y-2 leading-relaxed pl-5 list-disc">
              <li>No duplicate general chat tools (ChatGPT Plus + Claude Pro) are active.</li>
              <li>No multiple engineering IDE assistants (Cursor + Copilot) are co-licensed.</li>
              <li>Your seat count exactly matches your team headcount.</li>
              <li>All paid users show active tool engagement with zero seat redundancy.</li>
            </ul>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button
              variant="outline"
              onClick={onReset}
              className="border-slate-800 bg-slate-950 hover:bg-slate-850 text-slate-300 hover:text-white"
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Audit a different stack
            </Button>
            <Button
              variant="ghost"
              onClick={handleCopyReport}
              className="text-slate-400 hover:text-white hover:bg-slate-850/50"
            >
              {copied ? "Copied!" : "Copy Report Share Card"}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      {/* Back CTA bar */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="text-slate-400 hover:text-white"
        >
          <ChevronLeft className="mr-1.5 h-4 w-4" /> Edit Stack / Run New Audit
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyReport}
          className="border-slate-850 bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5"
        >
          <Share2 className="h-3.5 w-3.5" />
          <span>Share Audit Card</span>
        </Button>
      </div>

      {/* ── Dashboard Hero Savings Panel ── */}
      <Card className="relative overflow-hidden border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6 md:p-8">
        <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-violet-600/10 blur-3xl" />

        <div className="grid gap-6 md:grid-cols-12 md:items-center">
          {/* Optimization score circle */}
          <div className="md:col-span-4 flex flex-col items-center justify-center text-center">
            <div className={`relative flex h-28 w-28 items-center justify-center rounded-full border-4 border-slate-800 ${getScoreBg(score)}`}>
              <span className={`text-3xl font-black ${getScoreColor(score)}`}>{score}</span>
              <span className="absolute bottom-4 text-[9px] uppercase tracking-wider text-slate-500 font-bold">
                Health Score
              </span>
            </div>
            <h2 className="mt-3 text-base font-bold text-white">AI Cost Health</h2>
            <p className="text-[11px] text-slate-400 max-w-[180px] leading-snug">
              {score >= 80 ? "Healthy, minor waste" : score >= 60 ? "Requires review, mid waste" : "Highly redundant, urgent cleanup"}
            </p>
          </div>

          {/* Savings summaries */}
          <div className="md:col-span-8 space-y-4">
            <div className="flex flex-wrap gap-4 items-baseline justify-between">
              <div>
                <span className="rounded-full bg-green-500/10 border border-green-500/25 px-2.5 py-0.5 text-[10px] font-bold text-green-400 uppercase tracking-wider">
                  Optimization Results
                </span>
                <h1 className="text-3xl font-black text-white mt-1.5 flex items-center gap-2">
                  Save <span className="text-green-400">${totalMonthlySavings.toFixed(0)}</span> / month
                </h1>
              </div>

              <div className="text-left md:text-right">
                <div className="text-xs text-slate-500 font-medium">Annualized Savings Potential</div>
                <div className="text-2xl font-black text-green-400 tracking-tight">
                  ${totalAnnualSavings.toFixed(2)}
                </div>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-slate-400 bg-slate-950/40 border border-slate-805 rounded-lg p-3">
              {summary}
            </p>

            {/* Spend visual progress bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-500">Current Cost: ${totalCurrentMonthlySpend.toFixed(2)}/mo</span>
                <span className="text-violet-400">Optimized Cost: ${totalRecommendedMonthlySpend.toFixed(2)}/mo</span>
              </div>
              <Progress
                value={(totalRecommendedMonthlySpend / totalCurrentMonthlySpend) * 100}
                className="h-2 bg-slate-800"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* ── Recommendations Section ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileCheck2 className="h-5 w-5 text-violet-400" />
              <span>Optimizations Identified ({recommendations.length})</span>
            </h3>
            <p className="text-xs text-slate-400">
              Deterministic, rules-based recommendations ranked by highest financial impact first.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {recommendations.map((rec) => (
            <FindingCard key={rec.id} recommendation={rec} />
          ))}
        </div>
      </div>

      {/* Lead Capture Form — Rendered dynamically if shareToken is present (i.e. not in offline fallback mode) */}
      {shareToken && (
        <LeadCapture shareToken={shareToken} totalAnnualSavings={totalAnnualSavings} />
      )}

      {/* Footer Info Box */}
      <Card className="border-slate-800 bg-slate-900/20 p-5">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-4 w-4 text-violet-400 shrink-0 animate-pulse" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Financially Defensible Recommendations
            </h4>
            <p className="text-xs leading-relaxed text-slate-400">
              StackAudit does not use artificial intelligence or black-box LLMs for financial recommendations. Every optimization uses a rules engine derived directly from standard SaaS software licensing rules and exact tier prices, guaranteeing perfect audit reproducibility and maximum accuracy.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
