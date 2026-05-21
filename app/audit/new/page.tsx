"use client";

import React, { useState, useEffect } from "react";
import { runAudit } from "@/lib/audit-engine";
import type { AuditInput, AuditResult } from "@/lib/audit/types";
import { AuditWizard } from "@/components/audit/audit-wizard";
import { AuditReport } from "@/components/audit/audit-report";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ShieldCheck, BarChart4, Cpu, Sparkles } from "lucide-react";

const LOADING_STEPS = [
  { icon: <Cpu className="h-5 w-5 text-violet-400 animate-spin" />, text: "Initializing deterministic rules engine..." },
  { icon: <ShieldCheck className="h-5 w-5 text-violet-400" />, text: "Analyzing purchased vs. active seat capacity..." },
  { icon: <BarChart4 className="h-5 w-5 text-violet-400 animate-bounce" />, text: "Detecting ChatGPT / Claude plan redundancies..." },
  { icon: <Sparkles className="h-5 w-5 text-violet-400 animate-pulse" />, text: "Simulating cross-vendor price efficiency..." },
  { icon: <Cpu className="h-5 w-5 text-violet-400" />, text: "Drafting financially defensible report..." },
];

export default function AuditNewPage() {
  const [auditInput, setAuditInput] = useState<AuditInput | null>(null);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStepIdx, setLoadingStepIdx] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Handle loading animations when audit is running
  useEffect(() => {
    if (!isLoading) return;

    // Fast loading progress increments
    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 25);

    // Step increments
    const stepInterval = setInterval(() => {
      setLoadingStepIdx((prev) => {
        if (prev >= LOADING_STEPS.length - 1) {
          clearInterval(stepInterval);
          return LOADING_STEPS.length - 1;
        }
        return prev + 1;
      });
    }, 600);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, [isLoading]);

  // Execute the audit engine
  const handleWizardComplete = async (input: AuditInput) => {
    setAuditInput(input);
    setIsLoading(true);
    setLoadingProgress(0);
    setLoadingStepIdx(0);

    // Run audit logic immediately
    try {
      const result = await runAudit(input);

      // Force a slight aesthetic delay so the user experiences the audit animation
      setTimeout(() => {
        setAuditResult(result);
        setIsLoading(false);
      }, 3000);
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAuditInput(null);
    setAuditResult(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <a href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-sm font-black">
              SA
            </span>
            <span>StackAudit</span>
          </a>
          <span className="rounded-full bg-slate-900 border border-slate-800 px-3 py-1 text-xs text-slate-400 font-medium">
            AI Spend Optimizer
          </span>
        </div>
      </nav>

      {/* ── Main Container ── */}
      <main className="mx-auto max-w-6xl py-8 min-h-[calc(100vh-140px)]">
        {/* Loading Screen */}
        {isLoading && (
          <div className="mx-auto max-w-md px-4 py-16 flex flex-col items-center justify-center min-h-[400px]">
            <Card className="border-slate-800 bg-slate-900/60 p-8 w-full text-center space-y-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-indigo-500 animate-pulse" />

              <div className="space-y-2">
                <span className="rounded-full bg-violet-500/10 border border-violet-500/25 px-3 py-1 text-xs font-bold text-violet-400 tracking-wider uppercase">
                  Auditing Stack
                </span>
                <h2 className="text-xl font-bold text-white">Analyzing stack spend...</h2>
                <p className="text-xs text-slate-400">Comparing active tiers against our standard billing registry.</p>
              </div>

              {/* Progress gauge */}
              <div className="space-y-2">
                <Progress value={loadingProgress} className="h-2 bg-slate-800" />
                <div className="text-right text-[10px] text-slate-500 font-bold">{loadingProgress}%</div>
              </div>

              {/* Visual dynamic step text */}
              <div className="flex items-center justify-center gap-3 rounded-lg bg-slate-950/60 border border-slate-800/80 p-4 min-h-[64px] text-left">
                <div className="shrink-0">
                  {LOADING_STEPS[loadingStepIdx]?.icon}
                </div>
                <span className="text-xs font-medium text-slate-300">
                  {LOADING_STEPS[loadingStepIdx]?.text}
                </span>
              </div>
            </Card>
          </div>
        )}

        {/* Form Wizard Screen */}
        {!isLoading && !auditResult && (
          <div className="space-y-4">
            <div className="text-center px-4 mb-6">
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                Audit Your AI Stack
              </h1>
              <p className="mx-auto mt-2 max-w-lg text-sm text-slate-400">
                Identify overpaying accounts, seat redundancies, and cheaper model options in under 5 minutes.
              </p>
            </div>
            <AuditWizard onComplete={handleWizardComplete} />
          </div>
        )}

        {/* Results Screen */}
        {!isLoading && auditResult && (
          <AuditReport result={auditResult} onReset={handleReset} />
        )}
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
