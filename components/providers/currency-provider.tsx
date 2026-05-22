"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
  rate: number; // Exchange rate relative to 1 USD
  locale: string;
}

export const SUPPORTED_CURRENCIES: Record<string, CurrencyInfo> = {
  USD: { code: "USD", symbol: "$", name: "US Dollar", rate: 1.0, locale: "en-US" },
  INR: { code: "INR", symbol: "₹", name: "Indian Rupee", rate: 83.5, locale: "en-IN" },
  EUR: { code: "EUR", symbol: "€", name: "Euro", rate: 0.92, locale: "de-DE" },
  GBP: { code: "GBP", symbol: "£", name: "British Pound", rate: 0.79, locale: "en-GB" },
  CAD: { code: "CAD", symbol: "C$", name: "Canadian Dollar", rate: 1.37, locale: "en-CA" },
  AUD: { code: "AUD", symbol: "A$", name: "Australian Dollar", rate: 1.51, locale: "en-AU" },
};

export type CurrencyCode = keyof typeof SUPPORTED_CURRENCIES;

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  convert: (usdAmount: number) => number;
  format: (usdAmount: number, options?: { showCode?: boolean; precision?: number }) => string;
  mounted: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("USD");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("stackaudit_currency");
      if (saved && SUPPORTED_CURRENCIES[saved as CurrencyCode]) {
        setCurrencyState(saved as CurrencyCode);
      }
    } catch (e) {
      console.warn("Failed to retrieve currency from localStorage", e);
    }
  }, []);

  const setCurrency = (code: CurrencyCode) => {
    if (!SUPPORTED_CURRENCIES[code]) return;
    setCurrencyState(code);
    try {
      localStorage.setItem("stackaudit_currency", code);
    } catch (e) {
      console.warn("Failed to persist currency to localStorage", e);
    }
  };

  const convert = (usdAmount: number): number => {
    const info = SUPPORTED_CURRENCIES[currency];
    if (!info) return usdAmount;
    return usdAmount * info.rate;
  };

  const format = (
    usdAmount: number,
    options?: { showCode?: boolean; precision?: number }
  ): string => {
    const info = SUPPORTED_CURRENCIES[currency];
    if (!info) {
      // Fallback USD formatting
      return `$${usdAmount.toFixed(options?.precision ?? 2)}`;
    }

    const converted = usdAmount * info.rate;
    const precision = options?.precision ?? 2;

    try {
      const formatter = new Intl.NumberFormat(info.locale, {
        style: "currency",
        currency: info.code,
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      });
      let result = formatter.format(converted);
      
      // Fix C$ and A$ standard locale overrides if necessary, or just keep default Intl
      if (options?.showCode) {
        result = `${result} ${info.code}`;
      }
      return result;
    } catch (e) {
      return `${info.symbol}${converted.toFixed(precision)}`;
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convert, format, mounted }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}

/**
 * Robust Client-safe display wrapper to display formatted currencies without Next.js hydration warnings.
 */
export function FormattedAmount({
  value,
  precision = 2,
  showCode = false,
  className,
}: {
  value: number;
  precision?: number;
  showCode?: boolean;
  className?: string;
}) {
  const { format, mounted } = useCurrency();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !mounted) {
    // Elegant standard USD fallback visible during server-rendering / initial loads
    return <span className={className}>${value.toFixed(precision)}</span>;
  }

  return <span className={className}>{format(value, { precision, showCode })}</span>;
}
