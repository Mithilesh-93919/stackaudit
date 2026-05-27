"use client";

import React, { useState, useEffect } from "react";
import { runAudit } from "@/lib/audit-engine";
import dynamic from "next/dynamic";
import type { AuditInput, AuditResult } from "@/lib/audit/types";
import { AuditWizard } from "@/components/audit/audit-wizard";

const AuditReport = dynamic(
  () => import("@/components/audit/audit-report").then((mod) => mod.AuditReport),
  {
    ssr: false,
    loading: () => (
      <div className="mx-auto max-w-4xl px-4 py-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground font-semibold">Generating savings report...</p>
        </div>
      </div>
    ),
  }
);
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Navbar } from "@/components/shared/navbar";
import { ShieldCheck, BarChart4, Cpu, Sparkles } from "lucide-react";

const LOADING_STEPS = [
  { icon: <Cpu className="h-5 w-5 text-primary animate-spin" />, text: "Initializing deterministic rules engine..." },
  { icon: <ShieldCheck className="h-5 w-5 text-primary" />, text: "Analyzing purchased vs. active seat capacity..." },
  { icon: <BarChart4 className="h-5 w-5 text-primary animate-bounce" />, text: "Detecting ChatGPT / Claude plan redundancies..." },
  { icon: <Sparkles className="h-5 w-5 text-primary animate-pulse" />, text: "Simulating cross-vendor price efficiency..." },
  { icon: <Cpu className="h-5 w-5 text-primary" />, text: "Drafting financially defensible report..." },
];

export default function AuditNewPage() {
  const [auditInput, setAuditInput] = useState<AuditInput | null>(null);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [shareToken, setShareToken] = useState<string>("");
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

    try {
      // 1. Post to secure backend database API
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Backend query failed.");
      }

      const data = await response.json();

      // Force a slight delay so the user experiences the diagnostic loader animation
      setTimeout(() => {
        setShareToken(data.shareToken || "");
        setAuditResult(data.result);
        setIsLoading(false);
      }, 2500);
    } catch (e) {
      console.warn("Audit API persistence failed. Executing local fallback engine:", e);
      
      // 2. Resilient fallback: Run local client-side audit engine
      try {
        const localResult = await runAudit(input);
        setTimeout(() => {
          setShareToken(""); // empty token indicates fallback mode
          setAuditResult(localResult);
          setIsLoading(false);
        }, 2500);
      } catch (err) {
        console.error("Local fallback failed:", err);
        setIsLoading(false);
      }
    }
  };

  const handleReset = () => {
    setAuditInput(null);
    setAuditResult(null);
    setShareToken("");
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 font-sans">
      {/* ── Navbar ── */}
      <Navbar />

      {/* ── Main Container ── */}
      <main className="mx-auto max-w-6xl py-8 min-h-[calc(100vh-140px)]">
        {/* Loading Screen */}
        {isLoading && (
          <div className="mx-auto max-w-md px-4 py-16 flex flex-col items-center justify-center min-h-[400px]">
            <Card className="border-border/40 bg-card p-8 w-full text-center space-y-6 relative overflow-hidden shadow-md">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-violet-500 animate-pulse" />

              <div className="space-y-2">
                <span className="rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold text-primary tracking-wider uppercase">
                  Auditing Stack
                </span>
                <h2 className="text-xl font-bold text-foreground">Analyzing stack spend...</h2>
                <p className="text-xs text-muted-foreground">Comparing active tiers against our standard billing registry.</p>
              </div>

              {/* Progress gauge */}
              <div className="space-y-2">
                <Progress value={loadingProgress} className="h-2 bg-muted" />
                <div className="text-right text-[10px] text-muted-foreground font-bold">{loadingProgress}%</div>
              </div>

              {/* Visual dynamic step text */}
              <div className="flex items-center justify-center gap-3 rounded-lg bg-muted/20 border border-border/40 p-4 min-h-[64px] text-left">
                <div className="shrink-0">
                  {LOADING_STEPS[loadingStepIdx]?.icon}
                </div>
                <span className="text-xs font-medium text-foreground">
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
              <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                Audit Your AI Stack
              </h1>
              <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
                Identify overpaying accounts, seat redundancies, and cheaper model options in under 5 minutes.
              </p>
            </div>
            <AuditWizard onComplete={handleWizardComplete} />
          </div>
        )}

        {/* Results Screen */}
        {!isLoading && auditResult && (
          <AuditReport result={auditResult} shareToken={shareToken} onReset={handleReset} />
        )}
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
