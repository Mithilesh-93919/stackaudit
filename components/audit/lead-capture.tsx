"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Building2, Briefcase, CheckCircle2, Loader2, Sparkles } from "lucide-react";

interface LeadCaptureProps {
  shareToken: string;
  totalAnnualSavings: number;
}

export function LeadCapture({ shareToken, totalAnnualSavings }: LeadCaptureProps) {
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [consent, setConsent] = useState(true);
  const [honeypot, setHoneypot] = useState(""); // Bot spam trap
  
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const isHighSavings = totalAnnualSavings >= 1200;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage("Email address is required.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auditShareToken: shareToken,
          email,
          companyName: companyName || undefined,
          role: role || undefined,
          consentedToMarketing: consent,
          _hp: honeypot, // Spam honeypot
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to capture lead details.");
      }

      setStatus("success");
    } catch (err: any) {
      console.error("Lead submission error:", err);
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <Card className="border-emerald-500/20 bg-emerald-500/5 p-6 md:p-8 text-center space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white">Audit Blueprint Sent!</h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
            We have sent a comprehensive cost optimization plan containing all recommended checklist actions directly to <strong className="text-white">{email}</strong>.
          </p>
        </div>

        {isHighSavings && (
          <div className="mt-4 p-4 rounded-lg bg-violet-600/10 border border-violet-500/20 text-left space-y-3">
            <h4 className="text-xs font-bold text-violet-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-violet-400 animate-pulse" />
              <span>Priority Bonus Strategy Call Qualified</span>
            </h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Because your estimated annual savings exceed <strong>$1,200</strong>, you qualify for a complimentary 1-on-1 AI stack consultation with our audit partner <strong>Credex</strong> to help negotiate bulk licensing discounts.
            </p>
            <a 
              href="https://calendly.com/credex-audit-specialist" 
              target="_blank" 
              rel="noreferrer"
              className="inline-block w-full text-center"
            >
              <Button size="sm" className="w-full bg-violet-600 hover:bg-violet-500 text-xs font-semibold">
                Schedule Free 15-Min Consult
              </Button>
            </a>
          </div>
        )}
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden border-slate-800 bg-slate-900/40 p-6 md:p-8 space-y-6">
      <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-violet-600/5 blur-3xl" />
      
      <div className="space-y-1.5 text-center md:text-left">
        <span className="rounded-full bg-violet-500/10 border border-violet-500/25 px-2.5 py-0.5 text-[10px] font-bold text-violet-400 uppercase tracking-wider">
          Receive PDF Report
        </span>
        <h3 className="text-lg font-black text-white">Save & Share This Optimization Plan</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Send the structured checklist action items and dynamic pricing comparative graphs directly to your engineering team.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Spam Honeypot - Hidden from humans */}
        <input
          type="text"
          name="_hp"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          className="hidden"
          autoComplete="off"
        />

        <div className="grid gap-3 sm:grid-cols-2">
          {/* Email (Required) */}
          <div className="space-y-1 sm:col-span-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Work Email <span className="text-violet-400">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 border-slate-800 bg-slate-950 text-slate-350 focus-visible:ring-violet-600 text-xs h-10"
                required
              />
            </div>
          </div>

          {/* Company Name */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Company Name
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                type="text"
                placeholder="Acme Corp"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="pl-10 border-slate-800 bg-slate-950 text-slate-350 focus-visible:ring-violet-600 text-xs h-10"
              />
            </div>
          </div>

          {/* Role */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Your Role
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full pl-10 pr-4 border border-slate-800 bg-slate-950 text-slate-350 rounded-lg focus-visible:ring-2 focus-visible:ring-violet-600 text-xs h-10 appearance-none"
              >
                <option value="">Select your role...</option>
                <option value="CTO">CTO / VP Engineering</option>
                <option value="Founder">Founder / CEO</option>
                <option value="Engineering Manager">Engineering Manager</option>
                <option value="Finance">Finance / Ops</option>
                <option value="Other">Other Role</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Marketing Consent */}
        <div className="flex items-start gap-2 pt-1">
          <input
            type="checkbox"
            id="consent"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 rounded border-slate-800 bg-slate-950 text-violet-600 focus:ring-violet-600"
          />
          <label htmlFor="consent" className="text-[10px] text-slate-400 leading-snug cursor-pointer select-none">
            I agree to receive periodic cost-saving recommendations and product updates. You can unsubscribe at any time.
          </label>
        </div>

        {status === "error" && (
          <div className="text-[11px] text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded p-2 text-center font-medium">
            {errorMessage}
          </div>
        )}

        <Button
          type="submit"
          disabled={status === "submitting"}
          className="w-full bg-violet-600 hover:bg-violet-500 text-xs font-bold h-10"
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Sending Report...</span>
            </>
          ) : (
            <span>Email Me Executive Report</span>
          )}
        </Button>
      </form>
    </Card>
  );
}
