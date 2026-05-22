"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { CurrencySelector } from "./currency-selector";
import { Button } from "@/components/ui/button";
import { Sparkles, Menu, X, ArrowRight } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLandingPage = pathname === "/";
  const isAuditNew = pathname === "/audit/new";
  const isSharedAudit = pathname?.includes("/audit/share");

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex max-w-6xl h-16 items-center justify-between px-4 sm:px-6">
        
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-extrabold tracking-tight hover:opacity-90 transition-opacity text-foreground"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-black shadow-md shadow-primary/20">
            SA
          </span>
          <span className="font-heading">StackAudit</span>
        </Link>

        {/* Dynamic Context Content (Desktop) */}
        <div className="hidden md:flex items-center gap-6">
          {isLandingPage && (
            <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
              <a
                href="#features"
                className="hover:text-foreground transition-colors duration-200"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="hover:text-foreground transition-colors duration-200"
              >
                Pricing
              </a>
            </div>
          )}

          {isAuditNew && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold text-primary tracking-wide">
              <Sparkles className="h-3.5 w-3.5" />
              AI Spend Optimizer
            </span>
          )}

          {isSharedAudit && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary border border-border px-3 py-1 text-xs font-semibold text-muted-foreground tracking-wide">
              Shared Cost Report
            </span>
          )}
        </div>

        {/* Controls and CTA (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          <CurrencySelector />
          <ThemeToggle />
          
          {isLandingPage && (
            <Link href="/audit/new">
              <Button size="sm" className="h-9 font-bold bg-primary text-primary-foreground hover:bg-primary/95 transition-all shadow-md shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.02] active:scale-95">
                Start Free Audit
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          )}

          {(isAuditNew || isSharedAudit) && !isLandingPage && (
            <Link href="/">
              <Button variant="ghost" size="sm" className="h-9 font-bold text-muted-foreground hover:text-foreground">
                Home
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Controls & Trigger */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-lg border border-border/40 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background px-4 py-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Mobile navigation links/context */}
          {isLandingPage && (
            <div className="flex flex-col space-y-3 pl-1">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </a>
            </div>
          )}

          {isAuditNew && (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold text-primary tracking-wide">
              <Sparkles className="h-3.5 w-3.5" />
              AI Spend Optimizer
            </div>
          )}

          {isSharedAudit && (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary border border-border px-3 py-1 text-xs font-semibold text-muted-foreground tracking-wide">
              Shared Cost Report
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-border/30">
            <span className="text-xs font-bold text-muted-foreground">Display Currency</span>
            <CurrencySelector />
          </div>

          <div className="pt-2">
            {isLandingPage ? (
              <Link href="/audit/new" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full font-bold bg-primary text-primary-foreground flex items-center justify-center gap-1.5">
                  <span>Start Free Audit</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full font-bold text-muted-foreground hover:text-foreground">
                  Back to Home
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
