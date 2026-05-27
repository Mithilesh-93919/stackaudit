"use client";

import React, { useState, useEffect } from "react";
import { TOOL_REGISTRY } from "@/lib/audit/pricing-data";
import type { ToolId, AuditInput, UsageLevel } from "@/lib/audit/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Settings,
  Layers,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  AlertTriangle,
  RotateCcw,
  Plus,
  Trash2,
  TrendingUp,
  Info,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { FormattedAmount } from "@/components/providers/currency-provider";

// ── Types ──
interface WizardSubscription {
  toolId: ToolId;
  planId: string;
  seats: number;
  monthlySpend: number;
  activeSeats: number;
  usageLevel: UsageLevel;
}

interface FormState {
  teamSize: number;
  companyName: string;
  selectedTools: ToolId[];
  subscriptions: Record<ToolId, WizardSubscription>;
}

interface AuditWizardProps {
  onComplete: (input: AuditInput) => void;
}

const LOCAL_STORAGE_KEY = "stackaudit_wizard_draft";

const DEFAULT_STATE: FormState = {
  teamSize: 5,
  companyName: "",
  selectedTools: ["chatgpt", "cursor"],
  subscriptions: {
    chatgpt: {
      toolId: "chatgpt",
      planId: "plus",
      seats: 5,
      monthlySpend: 100,
      activeSeats: 5,
      usageLevel: "medium",
    },
    cursor: {
      toolId: "cursor",
      planId: "pro",
      seats: 5,
      monthlySpend: 100,
      activeSeats: 5,
      usageLevel: "medium",
    },
  } as Record<ToolId, WizardSubscription>,
};

export function AuditWizard({ onComplete }: AuditWizardProps) {
  const [step, setStep] = useState<number>(1);
  const [formState, setFormState] = useState<FormState>(DEFAULT_STATE);
  const [isMounted, setIsMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.selectedTools && parsed.subscriptions) {
          setFormState(parsed);
        }
      } catch (e) {
        console.error("Failed to parse saved state", e);
      }
    }
  }, []);

  // Save to localStorage on state change
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formState));
    }
  }, [formState, isMounted]);

  const resetForm = () => {
    const confirmed = typeof window !== "undefined" && window.confirm(
      "Are you sure you want to reset the wizard? All draft changes will be lost."
    );
    if (!confirmed) return;
    setFormState(DEFAULT_STATE);
    setStep(1);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    toast.success("Form reset successfully");
  };

  const handleNext = () => {
    // Basic validation
    if (step === 1) {
      if (formState.teamSize < 1) {
        toast.error("Please enter a valid team size of 1 or more");
        return;
      }
    }
    if (step === 2) {
      if (formState.selectedTools.length === 0) {
        toast.error("Please select at least one tool to audit");
        return;
      }
    }
    if (step === 3) {
      // Validate all selected subscriptions
      for (const toolId of formState.selectedTools) {
        const sub = formState.subscriptions[toolId];
        if (!sub) continue;
        if (sub.seats < 1) {
          toast.error(`Please enter at least 1 seat for ${TOOL_REGISTRY[toolId].name}`);
          return;
        }
        if (sub.monthlySpend < 0) {
          toast.error(`Monthly spend for ${TOOL_REGISTRY[toolId].name} cannot be negative`);
          return;
        }
        if (sub.activeSeats > sub.seats) {
          toast.error(
            `Active seats (${sub.activeSeats}) cannot exceed total seats (${sub.seats}) for ${TOOL_REGISTRY[toolId].name}`
          );
          return;
        }
      }
    }

    setStep((prev) => Math.min(prev + 1, 4));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTeamSizeChange = (val: number) => {
    setFormState((prev) => {
      // Auto-update seat counts for selected tools if they match old team size to be helpful
      const oldSize = prev.teamSize;
      const updatedSubs = { ...prev.subscriptions };

      prev.selectedTools.forEach((tid) => {
        const sub = updatedSubs[tid];
        if (sub && sub.seats === oldSize) {
          const tool = TOOL_REGISTRY[tid];
          const plan = tool.plans.find((p) => p.id === sub.planId);
          const price = plan ? plan.monthlyPricePerSeat : 0;
          updatedSubs[tid] = {
            ...sub,
            seats: val,
            activeSeats: val,
            monthlySpend: plan?.flatFee ? price : price * val,
          };
        }
      });

      return {
        ...prev,
        teamSize: val,
        subscriptions: updatedSubs,
      };
    });
  };

  const toggleTool = (toolId: ToolId) => {
    setFormState((prev) => {
      const isSelected = prev.selectedTools.includes(toolId);
      let nextTools: ToolId[];
      const nextSubs = { ...prev.subscriptions };

      if (isSelected) {
        nextTools = prev.selectedTools.filter((t) => t !== toolId);
        // Clean up subscription state for deselected tool
        delete nextSubs[toolId];
      } else {
        nextTools = [...prev.selectedTools, toolId];
        // Initialize default subscription parameters for the tool
        const tool = TOOL_REGISTRY[toolId];
        const defaultPlan = tool.plans.find((p) => p.id !== "free" && p.id !== "hobby") || tool.plans[0];
        const price = defaultPlan ? defaultPlan.monthlyPricePerSeat : 0;

        nextSubs[toolId] = {
          toolId,
          planId: defaultPlan?.id || "free",
          seats: prev.teamSize,
          activeSeats: prev.teamSize,
          monthlySpend: defaultPlan?.flatFee ? price : price * prev.teamSize,
          usageLevel: "medium",
        };
      }

      return {
        ...prev,
        selectedTools: nextTools,
        subscriptions: nextSubs,
      };
    });
  };

  const updateSubscription = (toolId: ToolId, field: keyof WizardSubscription, value: unknown) => {
    setFormState((prev) => {
      const sub = prev.subscriptions[toolId];
      if (!sub) return prev;

      const nextSub = { ...sub, [field]: value } as WizardSubscription;

      // Auto-recalculate spend when plan or seats change
      if (field === "planId" || field === "seats") {
        const tool = TOOL_REGISTRY[toolId];
        const plan = tool.plans.find((p) => p.id === nextSub.planId);
        const price = plan ? plan.monthlyPricePerSeat : 0;

        if (field === "seats") {
          // If total seats decreased, clamp active seats
          if (nextSub.activeSeats > nextSub.seats) {
            nextSub.activeSeats = nextSub.seats;
          }
        } else if (field === "planId") {
          // If switched to flatFee plan, set active seats buffer
          if (plan?.flatFee) {
            nextSub.seats = 1;
            nextSub.activeSeats = 1;
          }
        }

        nextSub.monthlySpend = plan?.flatFee ? price : price * nextSub.seats;
      }

      return {
        ...prev,
        subscriptions: {
          ...prev.subscriptions,
          [toolId]: nextSub,
        },
      };
    });
  };

  const handleRunAudit = () => {
    // Format subscriptions for the audit engine
    const formattedSubs = formState.selectedTools.map((tid) => {
      const sub = formState.subscriptions[tid]!;
      return {
        toolId: sub.toolId,
        planId: sub.planId,
        seats: Number(sub.seats),
        monthlySpend: Number(sub.monthlySpend),
        activeSeats: Number(sub.activeSeats),
        usageLevel: sub.usageLevel,
      };
    });

    const auditInput: AuditInput = {
      teamSize: Number(formState.teamSize),
      subscriptions: formattedSubs,
    };

    localStorage.removeItem(LOCAL_STORAGE_KEY); // Clear draft on successful submit
    onComplete(auditInput);
  };

  // Helper to get total entered current spend
  const totalDraftSpend = formState.selectedTools.reduce((sum, tid) => {
    const sub = formState.subscriptions[tid];
    return sum + (sub ? Number(sub.monthlySpend) : 0);
  }, 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* ── Progress Header ── */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
          <span>Step {step} of 4</span>
          <span className="text-violet-400">
            {step === 1 && "Team Context"}
            {step === 2 && "Select Stack"}
            {step === 3 && "Plan Details"}
            {step === 4 && "Review & Submit"}
          </span>
        </div>
        <Progress value={step * 25} className="mt-2 h-1.5 bg-slate-800" />
      </div>

      {/* ── Step 1: Team Context ── */}
      {step === 1 && (
        <Card className="border-slate-800 bg-slate-900/60 p-6 md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-600/20 text-violet-400">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Let&apos;s start with your team size</h2>
              <p className="text-sm text-slate-400">We use this to analyze seats and plan alignment.</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="company-name" className="text-slate-300">
                Company / Organization Name (Optional)
              </Label>
              <Input
                id="company-name"
                type="text"
                placeholder="e.g. Acme Startup"
                value={formState.companyName}
                onChange={(e) => setFormState((prev) => ({ ...prev, companyName: e.target.value }))}
                className="border-slate-700 bg-slate-850 text-white focus:border-violet-500"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="team-size" className="text-slate-300">
                  Total Team Count using AI Tools
                </Label>
                <span className="rounded-md bg-violet-600/20 px-2.5 py-1 text-sm font-bold text-violet-400">
                  {formState.teamSize} member{formState.teamSize > 1 ? "s" : ""}
                </span>
              </div>

              <div className="flex gap-2">
                {[2, 5, 10, 25, 50, 100].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleTeamSizeChange(size)}
                    className={`flex-1 rounded-lg border py-2 text-center text-sm font-semibold transition-all ${
                      formState.teamSize === size
                        ? "border-violet-500 bg-violet-600/10 text-white shadow-lg shadow-violet-950/20"
                        : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-white"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              <Input
                id="team-size"
                type="number"
                min="1"
                placeholder="Custom team size"
                value={formState.teamSize || ""}
                onChange={(e) => handleTeamSizeChange(Math.max(1, parseInt(e.target.value) || 0))}
                className="border-slate-700 bg-slate-850 text-white focus:border-violet-500"
              />
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-4 w-4 text-violet-400 shrink-0" />
                <p className="text-xs leading-relaxed text-slate-400">
                  <strong className="text-slate-300">Why does team size matter?</strong> Overlap rules check if you are paying for multiple products (e.g. Cursor and Copilot) for the same user headcount. Accurate team counts ensure financial calculations are grounded.
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* ── Step 2: Select Stack ── */}
      {step === 2 && (
        <Card className="border-slate-800 bg-slate-900/60 p-6 md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-600/20 text-violet-400">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Select your active AI stack</h2>
              <p className="text-sm text-slate-400">Select all AI software your startup currently pays for.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {(Object.keys(TOOL_REGISTRY) as ToolId[]).map((tid) => {
              const tool = TOOL_REGISTRY[tid];
              const isSelected = formState.selectedTools.includes(tid);
              return (
                <button
                  key={tid}
                  type="button"
                  onClick={() => toggleTool(tid)}
                  className={`relative flex flex-col items-center justify-center rounded-xl border p-4 text-center transition-all focus:outline-none ${
                    isSelected
                      ? "border-violet-500 bg-violet-600/10 text-white shadow-lg shadow-violet-950/40 ring-1 ring-violet-500"
                      : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  {isSelected && (
                    <CheckCircle2 className="absolute right-2 top-2 h-4 w-4 text-violet-400 fill-violet-950/40" />
                  )}
                  <span className="mb-1 text-2xl" role="img" aria-label={tool.name}>
                    {tool.category === "coding" ? "💻" : tool.category === "chat" ? "💬" : "🔌"}
                  </span>
                  <span className="text-sm font-semibold tracking-tight">{tool.name}</span>
                  <span className="mt-1 text-[10px] uppercase tracking-wider text-slate-500">
                    {tool.category}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between rounded-lg bg-slate-950/40 px-4 py-3 text-sm border border-slate-800">
            <span className="text-slate-400">Tools selected for audit:</span>
            <span className="font-semibold text-white">
              {formState.selectedTools.length} tool{formState.selectedTools.length > 1 ? "s" : ""}
            </span>
          </div>
        </Card>
      )}

      {/* ── Step 3: Spend Details ── */}
      {step === 3 && (
        <div className="space-y-4">
          <Card className="border-slate-800 bg-slate-900/60 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-600/20 text-violet-400">
                  <Settings className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Configure your subscription terms</h2>
                  <p className="text-xs text-slate-400">
                    Pricing defaults are applied. Adjust seats and spend to match your invoice.
                  </p>
                </div>
              </div>
              <div className="hidden text-right sm:block">
                <div className="text-xs text-slate-500">Current Total spend</div>
                <div className="text-lg font-bold text-violet-400"><FormattedAmount value={totalDraftSpend} />/mo</div>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            {formState.selectedTools.map((tid) => {
              const tool = TOOL_REGISTRY[tid];
              const sub = formState.subscriptions[tid];
              if (!sub) return null;

              const activePlan = tool.plans.find((p) => p.id === sub.planId);

              return (
                <Card key={tid} className="border-slate-800 bg-slate-900/60 overflow-hidden">
                  {/* Tool Title bar */}
                  <div className="flex items-center justify-between bg-slate-950/40 px-4 py-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {tool.category === "coding" ? "💻" : tool.category === "chat" ? "💬" : "🔌"}
                      </span>
                      <span className="font-semibold text-white">{tool.name}</span>
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400 capitalize">
                        {tool.vendor}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleTool(tid)}
                      className="h-8 w-8 text-slate-500 hover:text-red-400 hover:bg-red-500/10"
                      aria-label={`Remove ${tool.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Form fields */}
                  <div className="p-4 grid gap-4 md:grid-cols-4">
                    {/* Plan selection */}
                    <div className="space-y-1.5">
                      <Label htmlFor={`${tid}-plan`} className="text-xs text-slate-400">
                        Active Plan tier
                      </Label>
                      <Select
                        value={sub.planId}
                        onValueChange={(val) => updateSubscription(tid, "planId", val)}
                      >
                        <SelectTrigger id={`${tid}-plan`} className="border-slate-700 bg-slate-950/50 text-xs">
                          <SelectValue placeholder="Select plan" />
                        </SelectTrigger>
                        <SelectContent className="border-slate-800 bg-slate-900 text-white text-xs">
                          {tool.plans.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name} (<FormattedAmount value={p.monthlyPricePerSeat} />
                              {p.flatFee ? " flat" : "/seat"})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Seats count */}
                    <div className="space-y-1.5">
                      <Label htmlFor={`${tid}-seats`} className="text-xs text-slate-400">
                        Seats purchased
                      </Label>
                      <Input
                        id={`${tid}-seats`}
                        type="number"
                        min="1"
                        disabled={activePlan?.flatFee}
                        value={activePlan?.flatFee ? 1 : sub.seats}
                        onChange={(e) =>
                          updateSubscription(tid, "seats", Math.max(1, parseInt(e.target.value) || 0))
                        }
                        className="border-slate-700 bg-slate-950/50 text-xs"
                      />
                    </div>

                    {/* Monthly Spend */}
                    <div className="space-y-1.5">
                      <Label htmlFor={`${tid}-spend`} className="text-xs text-slate-400">
                        Monthly Cost ($)
                      </Label>
                      <div className="relative">
                        <DollarSign className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
                        <Input
                          id={`${tid}-spend`}
                          type="number"
                          min="0"
                          step="0.01"
                          value={sub.monthlySpend}
                          onChange={(e) =>
                            updateSubscription(tid, "monthlySpend", Math.max(0, parseFloat(e.target.value) || 0))
                          }
                          className="pl-8 border-slate-700 bg-slate-950/50 text-xs"
                        />
                      </div>
                    </div>

                    {/* Active Seats / Usage Level */}
                    {tool.category === "api" ? (
                      <div className="space-y-1.5">
                        <Label htmlFor={`${tid}-usage`} className="text-xs text-slate-400">
                          Usage Level
                        </Label>
                        <Select
                          value={sub.usageLevel}
                          onValueChange={(val) => updateSubscription(tid, "usageLevel", val)}
                        >
                          <SelectTrigger id={`${tid}-usage`} className="border-slate-700 bg-slate-950/50 text-xs">
                            <SelectValue placeholder="Select usage" />
                          </SelectTrigger>
                          <SelectContent className="border-slate-800 bg-slate-900 text-white text-xs">
                            <SelectItem value="low">Low (Infrequent)</SelectItem>
                            <SelectItem value="medium">Medium (Regular)</SelectItem>
                            <SelectItem value="high">High (Heavy)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <Label htmlFor={`${tid}-active-seats`} className="text-xs text-slate-400 flex items-center justify-between">
                          <span>Active seats</span>
                          {sub.activeSeats < sub.seats && (
                            <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-0.5">
                              <AlertTriangle className="h-3 w-3" /> Unused seats
                            </span>
                          )}
                        </Label>
                        <Input
                          id={`${tid}-active-seats`}
                          type="number"
                          min="0"
                          max={sub.seats}
                          value={sub.activeSeats}
                          onChange={(e) =>
                            updateSubscription(
                              tid,
                              "activeSeats",
                              Math.min(sub.seats, Math.max(0, parseInt(e.target.value) || 0))
                            )
                          }
                          className="border-slate-700 bg-slate-950/50 text-xs"
                        />
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Step 4: Review ── */}
      {step === 4 && (
        <Card className="border-slate-800 bg-slate-900/60 p-6 md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-600/20 text-violet-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Review your inputs</h2>
              <p className="text-sm text-slate-400">Review your final inputs before calculating optimizations.</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Audit parameters
              </h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-400">Company</dt>
                  <dd className="font-semibold text-white">{formState.companyName || "Acme Startup"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-400">Team headcount</dt>
                  <dd className="font-semibold text-white">{formState.teamSize} members</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-400">Total stack tools</dt>
                  <dd className="font-semibold text-white">{formState.selectedTools.length} tools</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 font-semibold">
                Financial Summary
              </h3>
              <div className="flex flex-col items-center justify-center py-2 text-center">
                <div className="text-[10px] uppercase tracking-wider text-slate-500">Declared monthly AI spend</div>
                <div className="text-3xl font-black text-violet-400 mt-1"><FormattedAmount value={totalDraftSpend} /></div>
                <div className="text-[10px] text-slate-400 mt-1">
                  <FormattedAmount value={totalDraftSpend * 12} /> annualized
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Stack breakdown
            </h3>
            <div className="divide-y divide-slate-800 rounded-xl border border-slate-800 bg-slate-950/20 overflow-hidden">
              {formState.selectedTools.map((tid) => {
                const tool = TOOL_REGISTRY[tid];
                const sub = formState.subscriptions[tid]!;
                const activePlan = tool.plans.find((p) => p.id === sub.planId);
                return (
                  <div key={tid} className="flex items-center justify-between px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span>{tool.category === "coding" ? "💻" : "💬"}</span>
                      <div>
                        <div className="font-semibold text-white">{tool.name}</div>
                        <div className="text-xs text-slate-500">
                          {activePlan?.name} Plan • {sub.seats} seat{sub.seats > 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-300"><FormattedAmount value={sub.monthlySpend} />/mo</div>
                      {sub.activeSeats < sub.seats && (
                        <div className="text-[10px] text-amber-400 font-semibold">
                          {sub.seats - sub.activeSeats} idle seat{sub.seats - sub.activeSeats > 1 ? "s" : ""}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {/* ── Footer Navigation ── */}
      <div className="mt-6 flex items-center justify-between">
        {step > 1 ? (
          <Button
            variant="outline"
            onClick={handleBack}
            className="border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        ) : (
          <Button
            variant="ghost"
            onClick={resetForm}
            className="text-slate-500 hover:text-white hover:bg-slate-850/40"
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Reset form
          </Button>
        )}

        {step < 4 ? (
          <Button onClick={handleNext} className="bg-violet-600 hover:bg-violet-500 text-white ml-auto">
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleRunAudit}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white ml-auto shadow-lg shadow-violet-900/40"
          >
            Run Audit <TrendingUp className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
