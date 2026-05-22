"use client";

import React, { useState } from "react";
import type { Recommendation, ToolId } from "@/lib/audit/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TOOL_REGISTRY } from "@/lib/audit/pricing-data";
import {
  TrendingDown,
  CheckSquare,
  Square,
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
} from "lucide-react";

interface FindingCardProps {
  recommendation: Recommendation;
}

import { FormattedAmount } from "@/components/providers/currency-provider";

export function FindingCard({ recommendation }: FindingCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  const {
    severity,
    title,
    description,
    currentPlan,
    currentMonthlyCost,
    recommendedPlan,
    recommendedMonthlyCost,
    monthlySavings,
    annualSavings,
    confidence,
    reasoning,
    actionSteps,
    toolId,
    affectedToolIds,
  } = recommendation;

  // Resolve visual cues based on severity
  const severityColors = {
    critical: "bg-red-500/15 border-red-500/30 text-red-400 hover:bg-red-500/20",
    high: "bg-orange-500/15 border-orange-500/30 text-orange-400 hover:bg-orange-500/20",
    medium: "bg-amber-500/15 border-amber-500/30 text-amber-400 hover:bg-amber-500/20",
    low: "bg-slate-500/15 border-slate-500/30 text-slate-400 hover:bg-slate-500/20",
  };

  const confidenceColors = {
    high: "bg-green-500/10 text-green-400 border-green-500/20",
    medium: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    low: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  };

  const toggleStep = (idx: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const getToolLogo = (id: string) => {
    if (id === "cross-tool") return "🔄";
    const tool = TOOL_REGISTRY[id as ToolId];
    if (!tool) return "⚙️";
    if (tool.category === "coding") return "💻";
    if (tool.category === "chat") return "💬";
    return "🔌";
  };

  const getToolName = (id: string) => {
    if (id === "cross-tool") {
      if (affectedToolIds && affectedToolIds.length > 0) {
        return affectedToolIds.map((tid) => TOOL_REGISTRY[tid]?.name || tid).join(" + ");
      }
      return "Cross-Tool Overlap";
    }
    return TOOL_REGISTRY[id as ToolId]?.name || id;
  };

  return (
    <Card className="border-slate-800 bg-slate-900/40 transition-all hover:border-slate-700/80 hover:bg-slate-900/60 overflow-hidden">
      {/* ── Summary Bar ── */}
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-800/80 border border-slate-700 text-2xl shadow-inner">
            {getToolLogo(toolId)}
          </span>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-xs tracking-wider uppercase text-slate-500">
                {getToolName(toolId)}
              </span>
              <Badge variant="outline" className={`${severityColors[severity]} border font-semibold text-[10px] uppercase py-0 px-2`}>
                {severity} priority
              </Badge>
              <Badge variant="outline" className={`${confidenceColors[confidence]} border font-medium text-[10px] capitalize py-0 px-2`}>
                {confidence} confidence
              </Badge>
            </div>
            <h3 className="text-base font-bold text-white leading-snug">{title}</h3>
            <p className="text-xs text-slate-400 line-clamp-2 max-w-xl">{description}</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-slate-800/60 pt-3 sm:border-t-0 sm:pt-0 shrink-0">
          <div className="text-left sm:text-right">
            <div className="text-[10px] uppercase tracking-wider text-slate-500">Monthly savings</div>
            <div className="text-xl font-black text-green-400"><FormattedAmount value={monthlySavings} /></div>
            <div className="text-[10px] text-slate-400"><FormattedAmount value={annualSavings} /> / year</div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-9 w-9 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white"
            aria-label={isExpanded ? "Collapse recommendation" : "Expand recommendation"}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* ── Expanded content drawer ── */}
      {isExpanded && (
        <div className="bg-slate-950/40 border-t border-slate-800/60 p-5 space-y-5 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Comparison grids */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-800/60 bg-slate-900/20 p-4">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Current Setup
              </span>
              <div className="mt-1 font-bold text-slate-300">{currentPlan}</div>
              <div className="mt-1 text-sm text-slate-400">
                Cost: <span className="font-semibold text-slate-200"><FormattedAmount value={currentMonthlyCost} />/mo</span>
              </div>
            </div>

            <div className="rounded-lg border border-violet-500/20 bg-violet-950/5 p-4 relative overflow-hidden">
              <div className="absolute right-0 top-0 h-16 w-16 -translate-y-6 translate-x-6 rotate-45 bg-violet-500/10 pointer-events-none" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Recommended Alternative
              </span>
              <div className="mt-1 font-bold text-white">{recommendedPlan}</div>
              <div className="mt-1 text-sm text-slate-300">
                Cost: <span className="font-semibold text-white"><FormattedAmount value={recommendedMonthlyCost} />/mo</span>
              </div>
            </div>
          </div>

          {/* Reasoning */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <Lightbulb className="h-3.5 w-3.5 text-violet-400 shrink-0" />
              <span>Financially Defensible Reasoning</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400 bg-slate-900/60 border border-slate-800/80 rounded-lg p-3">
              {reasoning}
            </p>
          </div>

          {/* Action Steps checklist */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <CheckSquare className="h-3.5 w-3.5 text-violet-400" />
              <span>How to execute this optimization</span>
            </h4>
            <ul className="grid gap-2 text-xs">
              {actionSteps.map((step, idx) => {
                const isCompleted = !!completedSteps[idx];
                return (
                  <li
                    key={idx}
                    onClick={() => toggleStep(idx)}
                    className={`flex items-start gap-2.5 rounded-lg border p-2.5 cursor-pointer transition-all hover:bg-slate-900/50 ${
                      isCompleted
                        ? "border-green-500/20 bg-green-500/5 text-slate-500 line-through"
                        : "border-slate-800 bg-slate-950/40 text-slate-300"
                    }`}
                  >
                    <button type="button" className="mt-0.5 shrink-0 text-slate-500 focus:outline-none">
                      {isCompleted ? (
                        <CheckSquare className="h-4 w-4 text-green-400" />
                      ) : (
                        <Square className="h-4 w-4 text-slate-650 hover:text-slate-400" />
                      )}
                    </button>
                    <span className="leading-snug">{step}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Vendor Billing Link button */}
          {toolId !== "cross-tool" && (
            <div className="flex justify-end pt-1">
              <a
                href={TOOL_REGISTRY[toolId]?.website || "#"}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-violet-400 hover:text-violet-300 transition-colors"
              >
                Go to {TOOL_REGISTRY[toolId]?.name || "vendor"} billing dashboard
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
