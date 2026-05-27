import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "StackAudit — AI Spend Audit for Startups",
    template: "%s | StackAudit",
  },
  description:
    "Audit your AI tool spending in minutes. Find waste, eliminate redundancies, and optimize your team's AI stack.",
  keywords: [
    "AI spend management",
    "AI tool audit",
    "ChatGPT cost",
    "AI budget optimization",
    "startup AI tools",
  ],
  authors: [{ name: "StackAudit" }],
  creator: "StackAudit",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://stackaudit.io"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "https://stackaudit.io",
    title: "StackAudit — AI Spend Audit for Startups",
    description:
      "Stop paying for AI tools your team doesn't use. Audit your stack in minutes.",
    siteName: "StackAudit",
  },
  twitter: {
    card: "summary_large_image",
    title: "StackAudit — AI Spend Audit for Startups",
    description:
      "Stop paying for AI tools your team doesn't use. Audit your stack in minutes.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { ThemeProvider } from "@/components/providers/theme-provider";
import { CurrencyProvider } from "@/components/providers/currency-provider";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable, inter.variable)} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased transition-colors duration-300">
        <ThemeProvider>
          <CurrencyProvider>
            {children}
            <Toaster richColors position="top-right" />
          </CurrencyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

