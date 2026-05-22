"use client";

import React, { useEffect, useState } from "react";
import { useCurrency, SUPPORTED_CURRENCIES, CurrencyCode } from "../providers/currency-provider";
import { ChevronDown, Check, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function CurrencySelector() {
  const { currency, setCurrency, mounted } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="h-9 gap-1.5 rounded-lg border-border/40 bg-background/50 text-muted-foreground opacity-50"
        disabled
      >
        <Globe className="h-4 w-4" />
        <span className="text-xs font-semibold">USD</span>
        <ChevronDown className="h-3.5 w-3.5" />
      </Button>
    );
  }

  const currentInfo = SUPPORTED_CURRENCIES[currency];

  return (
    <DropdownMenu onOpenChange={setIsOpen}>
      <DropdownMenuTrigger
        className="group h-9 px-3 gap-1.5 flex items-center justify-between rounded-lg border border-border/40 bg-background/50 hover:bg-accent/80 hover:text-accent-foreground shadow-sm transition-all hover:scale-[1.02] active:scale-95 text-foreground cursor-pointer outline-none"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-muted text-[11px] font-bold text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
          {currentInfo?.symbol}
        </span>
        <span className="text-xs font-bold tracking-tight">{currency}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180 text-foreground" : ""
          }`}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 border-border/80 bg-background/95 backdrop-blur-md animate-in fade-in-50 slide-in-from-top-1 duration-200"
      >
        <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 border-b border-border/40 mb-1">
          Select Display Currency
        </div>
        {Object.values(SUPPORTED_CURRENCIES).map((info) => {
          const isSelected = info.code === currency;
          return (
            <DropdownMenuItem
              key={info.code}
              onClick={() => setCurrency(info.code as CurrencyCode)}
              className={`flex items-center justify-between cursor-pointer px-2.5 py-2 transition-colors ${
                isSelected
                  ? "bg-accent/80 text-accent-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-muted/60 text-xs font-black text-foreground">
                  {info.symbol}
                </span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-foreground leading-none">{info.code}</span>
                  <span className="text-[10px] text-muted-foreground mt-0.5">{info.name}</span>
                </div>
              </div>
              {isSelected && <Check className="h-3.5 w-3.5 text-primary stroke-[3px]" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
