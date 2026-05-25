import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Scale, 
  Sparkles, 
  AlertTriangle, 
  Laptop, 
  ArrowLeft, 
  Info,
  ShieldCheck,
  Zap
} from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | StackAudit",
  description: "Read the Terms of Service for StackAudit, including our rules for using the AI spend optimization platform, liability, and usage rights.",
};

export default function TermsPage() {
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
              <Scale className="h-3.5 w-3.5" />
              <span>User Agreement</span>
            </div>
            
            <h1 className="mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-foreground font-heading">
              Terms of Service
            </h1>
            
            <p className="mx-auto max-w-xl text-sm sm:text-base text-muted-foreground">
              Last updated: May 25, 2026. Please read these terms carefully before auditing your AI spend stacks on StackAudit.
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
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="mb-2 font-bold text-foreground text-sm">Free Beta Program</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  StackAudit is currently provided free of charge during our public beta. Terms and pricing may change upon official release.
                </p>
              </div>

              {/* Highlight 2 */}
              <div className="rounded-xl border border-border/60 bg-card/30 p-6 backdrop-blur-sm transition-all hover:border-primary/30 dark:bg-card/10">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="mb-2 font-bold text-foreground text-sm">Data Ownership</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  You retain full ownership of the spend numbers and audit metadata you input. We own our proprietary audit analytics engine.
                </p>
              </div>

              {/* Highlight 3 */}
              <div className="rounded-xl border border-border/60 bg-card/30 p-6 backdrop-blur-sm transition-all hover:border-primary/30 dark:bg-card/10">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="mb-2 font-bold text-foreground text-sm">Fair & Ethical Use</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  You agree not to scrape our platform, disrupt our database operations, or reverse engineer our optimization logic.
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
                  1. Agreement to Terms
                </h2>
                <p className="mb-4">
                  Welcome to <strong>StackAudit</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). By accessing or using our website, platform, or tools located at stackaudit.io (collectively, the &ldquo;Service&rdquo;), you agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;).
                </p>
                <p>
                  If you are using our Service on behalf of a company, organization, or other legal entity, you represent and warrant that you have the authority to bind that entity to these Terms, in which case the terms &ldquo;you&rdquo; or &ldquo;your&rdquo; shall refer to such entity. If you do not agree to these Terms, you must not access or use the Service.
                </p>
              </div>

              <Separator />

              {/* Service Description & Beta Program */}
              <div>
                <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                  <Laptop className="h-5 w-5 text-primary shrink-0" />
                  2. Description of Service & Beta Access
                </h2>
                <p className="mb-4">
                  StackAudit provides a software-as-a-service (SaaS) spend auditing tool that evaluates active licenses, pricing models, and team usage across multiple artificial intelligence developer tools and productivity systems.
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>
                    <strong className="text-foreground">Beta Status:</strong> The Service is currently offered in a &ldquo;Beta&rdquo; stage. During this beta phase, we offer stack auditing, saving options, and sharing features free of charge.
                  </li>
                  <li>
                    <strong className="text-foreground">Service Updates:</strong> We reserve the right to modify, suspend, or discontinue any part of the Service at any time, with or without notice. We will not be liable to you or any third party for any modifications or discontinuation.
                  </li>
                  <li>
                    <strong className="text-foreground">Future Billing:</strong> We reserve the right to introduce premium paid subscription plans or features in the future. Beta users will be notified well in advance before any subscription fees are initiated.
                  </li>
                </ul>
              </div>

              <Separator />

              {/* User Data and Content */}
              <div>
                <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary shrink-0" />
                  3. Audit Metrics and Data Ownership
                </h2>
                <p className="mb-4">
                  We respect your rights and ownership over your company&apos;s data:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>
                    <strong className="text-foreground">Your Inputs:</strong> You retain all proprietary rights, copyright, and ownership of the raw data, spend statistics, and email addresses you upload or enter into the StackAudit system (&ldquo;User Content&rdquo;).
                  </li>
                  <li>
                    <strong className="text-foreground">Our License:</strong> To perform your spend audit, generate visualization metrics, and deliver shareable URLs, you grant StackAudit a worldwide, royalty-free, fully-paid license to host, parse, cache, and display your User Content strictly for the purpose of delivering the Service to you.
                  </li>
                  <li>
                    <strong className="text-foreground">Proprietary Materials:</strong> The software engine, code logic, UI designs, stylesheets, text copy, database architecture, and trademarked name &ldquo;StackAudit&rdquo; are the exclusive property of StackAudit and are protected by international copyright laws.
                  </li>
                </ul>
              </div>

              <Separator />

              {/* Rules of Conduct */}
              <div>
                <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
                  4. Rules of Conduct & Acceptable Use
                </h2>
                <p className="mb-4">
                  By using StackAudit, you explicitly agree not to engage in any of the following prohibited behaviors:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>
                    Using the Service to conduct fake audits or input malicious code injections.
                  </li>
                  <li>
                    Employing automated web scrapers, crawlers, indexers, or extraction bots to systematically copy, extract, or monitor StackAudit&apos;s templates, algorithms, or visual designs.
                  </li>
                  <li>
                    Interfering with, overloading, or attempting to compromise the system security of our server infrastructure or databases.
                  </li>
                  <li>
                    Attempting to reverse engineer or replicate our spend-overlap and alternative-recommendation calculation matrices.
                  </li>
                </ul>
              </div>

              <Separator />

              {/* Warranties Disclaimer */}
              <div>
                <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-primary shrink-0" />
                  5. Disclaimer of Warranties
                </h2>
                <p className="mb-4 font-semibold text-foreground">
                  The Service is provided on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis, without warranties of any kind.
                </p>
                <p className="mb-4">
                  To the maximum extent permitted by law, StackAudit disclaims all warranties, express or implied, including but not limited to:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Warranties of merchantability, fitness for a particular purpose, and non-infringement.</li>
                  <li>That the Service will be completely secure, error-free, uninterrupted, or perfectly accurate.</li>
                  <li>That our savings recommendations will result in guaranteed cost reductions. Actual financial savings depend on your third-party contract negotiations, cancellations, and enterprise agreements.</li>
                </ul>
              </div>

              <Separator />

              {/* Limitation of Liability */}
              <div>
                <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                  <Scale className="h-5 w-5 text-primary shrink-0" />
                  6. Limitation of Liability
                </h2>
                <p className="mb-4">
                  In no event shall StackAudit, its founders, employees, or infrastructure providers be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                </p>
                <p>
                  This limitation applies whether the alleged liability is based on contract, tort, negligence, strict liability, or any other basis, even if StackAudit has been advised of the possibility of such damage. Our total liability for any claim arising out of these Terms or the use of our platform shall not exceed fifty US dollars ($50.00).
                </p>
              </div>

              <Separator />

              {/* Governing Law & Dispute Resolution */}
              <div>
                <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary shrink-0" />
                  7. Governing Law and Contact
                </h2>
                <p className="mb-4">
                  These Terms of Service, along with your use of the StackAudit platform, shall be governed by, construed, and enforced in accordance with the laws of the jurisdiction in which StackAudit operates, without regard to its conflict of law principles.
                </p>
                <p className="mb-4">
                  If any provision of these Terms is deemed invalid or unenforceable by a court of competent jurisdiction, that specific provision will be modified to be enforceable, and the remaining provisions of these Terms will continue in full force and effect.
                </p>
                <p className="mt-4">
                  If you have any questions or feedback regarding these Terms, please contact our legal support desk at: <strong className="text-foreground">legal@stackaudit.io</strong>.
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
              className="transition-colors hover:text-foreground"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="transition-colors hover:text-foreground text-foreground font-semibold"
            >
              Terms
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
