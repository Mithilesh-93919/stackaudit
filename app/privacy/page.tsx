import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Shield, 
  Eye, 
  Database, 
  Mail, 
  BarChart, 
  Lock, 
  ArrowLeft, 
  FileText, 
  Info,
  CheckCircle2
} from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | StackAudit",
  description: "Learn how StackAudit protects your privacy, secures your AI spend audits, and handles your email and data. We do not sell your data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col">
      {/* Navbar */}
      <Navbar />

      <main className="flex-1">
        {/* Header Section */}
        <section className="relative overflow-hidden px-4 pb-12 pt-16 sm:px-6 sm:pt-20 lg:pt-24 border-b border-border/40 bg-muted/10">
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl dark:bg-primary/10" />
            <div className="absolute right-0 top-1/2 h-[300px] w-[300px] -translate-y-1/2 translate-x-1/2 rounded-full bg-violet-500/5 blur-3xl dark:bg-violet-500/10" />
          </div>
          
          <div className="relative mx-auto max-w-4xl text-center">
            <Link href="/" className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-3 w-3" />
              <span>Back to Home</span>
            </Link>
            
            <div className="mt-2 mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
              <Shield className="h-3.5 w-3.5" />
              <span>Security & Trust</span>
            </div>
            
            <h1 className="mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-foreground font-heading">
              Privacy Policy
            </h1>
            
            <p className="mx-auto max-w-xl text-sm sm:text-base text-muted-foreground">
              Last updated: May 25, 2026. We believe in complete transparency. Here is how we protect, store, and process your AI stack spend audits and personal information.
            </p>
          </div>
        </section>

        {/* Highlight Cards Section */}
        <section className="px-4 py-12 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-6 sm:grid-cols-3">
              {/* Highlight 1 */}
              <div className="rounded-xl border border-border/60 bg-card/30 p-6 backdrop-blur-sm transition-all hover:border-primary/30 dark:bg-card/10">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Eye className="h-5 w-5" />
                </div>
                <h3 className="mb-2 font-bold text-foreground text-sm">No Resale of Data</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We will never sell, rent, or trade your company's spending charts, audit details, or email addresses with third parties. Ever.
                </p>
              </div>

              {/* Highlight 2 */}
              <div className="rounded-xl border border-border/60 bg-card/30 p-6 backdrop-blur-sm transition-all hover:border-primary/30 dark:bg-card/10">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Database className="h-5 w-5" />
                </div>
                <h3 className="mb-2 font-bold text-foreground text-sm">Secure Audit Storage</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your raw audits are securely stored, isolated, and shared only via secret, cryptographically random, unguessable URLs.
                </p>
              </div>

              {/* Highlight 3 */}
              <div className="rounded-xl border border-border/60 bg-card/30 p-6 backdrop-blur-sm transition-all hover:border-primary/30 dark:bg-card/10">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Lock className="h-5 w-5" />
                </div>
                <h3 className="mb-2 font-bold text-foreground text-sm">Privacy by Design</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We don't ask for financial login credentials or read-access to your banks. You input your counts, we optimize your spend.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Legal Content */}
        <section className="px-4 pb-24 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <div className="prose prose-sm dark:prose-invert max-w-none space-y-10 text-sm sm:text-base leading-relaxed text-muted-foreground">
              
              {/* Introduction */}
              <div>
                <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary shrink-0" />
                  1. Our Core Privacy Philosophy
                </h2>
                <p className="mb-4">
                  At <strong>StackAudit</strong>, we build tools to help startups and companies optimize their spend on AI platforms (like ChatGPT, Claude, Cursor, and others). We operate under a very simple ethos: <strong>your company&apos;s financial data and tech stack metrics are your business, not ours.</strong>
                </p>
                <p>
                  We design our SaaS platform with data minimization in mind. We only ask for the minimum amount of data required to calculate your optimizations, evaluate redundancy, and deliver actionable results. We do not monetize your data, and we do not act as data brokers.
                </p>
              </div>

              <Separator />

              {/* Information We Collect */}
              <div>
                <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary shrink-0" />
                  2. Information We Collect and Process
                </h2>
                <p className="mb-4">
                  To provide our AI spend audit services, we collect three primary types of information:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>
                    <strong className="text-foreground">Audit Data:</strong> This includes specific inputs you provide regarding your team&apos;s AI tool stack, such as the tools used (e.g., Cursor, GitHub Copilot, ChatGPT Plus), license counts, custom plan pricing, billing cycles, and team size. This data is processed to calculate overlap, redundancy, and financial optimizations.
                  </li>
                  <li>
                    <strong className="text-foreground">Email Collection:</strong> We collect your email address if you explicitly choose to save your audit, subscribe to our newsletter, request recurring optimization alerts, or generate a shareable audit link. Your email is used to send transactional reports and occasional marketing/product updates. You can unsubscribe at any time.
                  </li>
                  <li>
                    <strong className="text-foreground">Technical and Usage Analytics:</strong> We collect non-personally identifiable technical information when you visit StackAudit. This includes IP address (anonymized/hashed), browser type, device details, and standard web page clickstreams.
                  </li>
                </ul>
              </div>

              <Separator />

              {/* Analytics */}
              <div>
                <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-primary shrink-0" />
                  3. Analytics and Tracking Technologies
                </h2>
                <p className="mb-4">
                  We use cookies and web analytics software to understand how visitors interact with our application, analyze performance, and prevent fraud.
                </p>
                <p className="mb-4">
                  Our analytics systems are specifically configured to respect user privacy:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>We anonymize IP addresses at the point of ingestion.</li>
                  <li>We track site usage patterns (e.g., which buttons are clicked, audit completion rates) to improve our algorithms and visual interface.</li>
                  <li>We do not track you across other third-party websites or engage in behavioral ad retargeting.</li>
                </ul>
              </div>

              <Separator />

              {/* Audit Storage */}
              <div>
                <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary shrink-0" />
                  4. Audit Storage and Data Security
                </h2>
                <p className="mb-4">
                  The security of your company&apos;s AI spend data is a paramount priority:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>
                    <strong className="text-foreground">Database Storage:</strong> Our database is hosted securely with enterprise-grade cloud providers (specifically Supabase and PostgreSQL). Data is encrypted both in transit (using SSL/TLS) and at rest.
                  </li>
                  <li>
                    <strong className="text-foreground">Shareable Reports:</strong> When you generate a shareable audit report, we create a secure, cryptographically random, and high-entropy token URL (e.g., <code className="bg-muted px-1 py-0.5 rounded text-xs">/audit/share/[token-key]</code>). Only individuals who possess this exact link can view the shared spend analysis.
                  </li>
                  <li>
                    <strong className="text-foreground">Limited Internal Access:</strong> Access to our databases is restricted to core engineering personnel on a strict, audited, "need-to-know" basis for maintenance, updates, and customer support.
                  </li>
                </ul>
              </div>

              <Separator />

              {/* Data Resale & Sharing */}
              <div>
                <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                  5. No Resale of Data and Third-Party Sharing
                </h2>
                <p className="mb-4 font-semibold text-foreground">
                  StackAudit operates on a direct, value-driven software business model. We do not, have never, and will never sell, rent, lease, or distribute your company’s audit statistics or personal contact details to advertisers, data brokers, or marketing networks.
                </p>
                <p className="mb-4">
                  We share your data only with specific infrastructure services necessary to run our application:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>
                    <strong className="text-foreground">Database Hosting:</strong> Supabase (to store and query your audit metrics securely).
                  </li>
                  <li>
                    <strong className="text-foreground">Email Delivery:</strong> Resend (to dispatch your transactional audit reports and newsletters).
                  </li>
                  <li>
                    <strong className="text-foreground">AI Inference (Optional):</strong> If you request AI-driven stack analysis, we send structured, non-personally identifiable numbers to Anthropic (Claude API) or OpenAI. We enforce strict protocols ensuring these providers do not use your inputs to train their base models.
                  </li>
                </ul>
              </div>

              <Separator />

              {/* Your Rights */}
              <div>
                <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary shrink-0" />
                  6. Your Rights, Data Deletion, and Contact
                </h2>
                <p className="mb-4">
                  Regardless of your geographic location, we respect your rights to control your personal and company information:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>
                    <strong className="text-foreground">Right to Erasure (Right to be Forgotten):</strong> You can request the permanent deletion of your email records and saved audits at any time.
                  </li>
                  <li>
                    <strong className="text-foreground">Right to Export:</strong> You can export your audit results to CSV or PDF via the audit dashboard.
                  </li>
                </ul>
                <p className="mt-4">
                  To request a complete deletion of your data, or if you have any questions about this Privacy Policy, please email our security officer at: <strong className="text-foreground">privacy@stackaudit.io</strong>.
                </p>
              </div>

            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 px-4 py-10 sm:px-6 bg-muted/10 text-muted-foreground">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm sm:flex-row">
          <span className="font-semibold text-foreground/80">
            StackAudit
          </span>
          <span>© {new Date().getFullYear()} StackAudit. All rights reserved.</span>
          <nav aria-label="Footer navigation" className="flex gap-4 font-medium">
            <Link
              href="/privacy"
              className="transition-colors hover:text-foreground text-foreground font-semibold"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="transition-colors hover:text-foreground"
            >
              Terms
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
