import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { FormattedAmount } from "@/components/providers/currency-provider";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "StackAudit — AI Spend Audit for Startups",
  description:
    "Stop paying for AI tools your team doesn't use. Audit your AI stack in minutes, find redundancies, and cut waste.",
};

const TOOLS = [
  "ChatGPT Plus",
  "Claude Pro",
  "Cursor",
  "GitHub Copilot",
  "Gemini Advanced",
  "Midjourney",
  "Perplexity",
  "OpenAI API",
];

const STATS = [
  { value: 1840, isCurrency: true, label: "Avg monthly waste found" },
  { value: "3.2x", isCurrency: false, label: "Avg tool overlap per team" },
  { value: "< 5 min", isCurrency: false, label: "Time to complete audit" },
];

const FEATURES = [
  {
    icon: "🔍",
    title: "Instant AI Stack Audit",
    description:
      "Select the tools your team uses, enter seat counts, and get a complete spend breakdown in seconds.",
  },
  {
    icon: "💸",
    title: "Detect Hidden Waste",
    description:
      "Identify overlapping tools, idle licenses, and overpaid tiers with precision. No guesswork.",
  },
  {
    icon: "📊",
    title: "Dollar-Quantified Recommendations",
    description:
      "Every recommendation comes with exact savings — not vague advice. Cut what you don't need.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* ── Nav ── */}
      <Navbar />

      <main>
        {/* ── Hero ── */}
        <section
          className="relative overflow-hidden px-4 pb-24 pt-20 sm:px-6 sm:pt-28 lg:pt-36"
          aria-labelledby="hero-heading"
        >
          {/* Background gradient effects */}
          <div
            className="pointer-events-none absolute inset-0 overflow-hidden"
            aria-hidden="true"
          >
            <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl dark:bg-primary/20" />
            <div className="absolute right-0 top-1/2 h-[400px] w-[400px] -translate-y-1/2 translate-x-1/2 rounded-full bg-violet-500/5 blur-3xl dark:bg-violet-500/10" />
          </div>

          <div className="relative mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
              <Sparkles className="h-4 w-4 shrink-0 animate-pulse" />
              <span>Now in beta — free audits available</span>
            </div>

            <h1
              id="hero-heading"
              className="mb-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl text-foreground font-heading"
            >
              Stop Paying for AI Tools
              <br />
              <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                Your Team Doesn&apos;t Use
              </span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              StackAudit analyzes your AI tool spend across ChatGPT, Claude,
              Cursor, Copilot, and more — then tells you exactly where
              you&apos;re wasting money.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/audit/new" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto h-12 px-8 text-base font-bold bg-primary text-primary-foreground hover:bg-primary/95 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] active:scale-95">
                  Audit My Stack — Free
                </Button>
              </Link>
              <a href="#features" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto h-12 px-8 text-base font-bold border-border/80 bg-background/50 hover:bg-accent/40 text-muted-foreground hover:text-foreground">
                  See How It Works
                </Button>
              </a>
            </div>

            {/* Tool badges */}
            <div
              className="mt-12 flex flex-wrap justify-center gap-2"
              aria-label="Supported AI tools"
            >
              {TOOLS.map((tool) => (
                <span
                  key={tool}
                  className="rounded-full border border-border/40 bg-card px-3.5 py-1 text-xs font-semibold text-muted-foreground shadow-sm"
                >
                  {tool}
                </span>
              ))}
              <span className="rounded-full border border-border/40 bg-card px-3.5 py-1 text-xs font-semibold text-muted-foreground shadow-sm">
                +30 more
              </span>
            </div>
          </div>
        </section>

        {/* ── Stats ── */}
        <section
          className="border-y border-border/40 bg-muted/20 px-4 py-12 sm:px-6"
          aria-label="Key statistics"
        >
          <dl className="mx-auto grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-3">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <dt className="mb-1 text-sm font-medium text-muted-foreground">{stat.label}</dt>
                <dd className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                  {stat.isCurrency ? (
                    <FormattedAmount value={Number(stat.value)} precision={0} />
                  ) : (
                    stat.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── Features ── */}
        <section
          id="features"
          className="px-4 py-20 sm:px-6 sm:py-28"
          aria-labelledby="features-heading"
        >
          <div className="mx-auto max-w-6xl">
            <div className="mb-14 text-center">
              <h2
                id="features-heading"
                className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl text-foreground font-heading"
              >
                Everything you need to
                <span className="text-primary"> control AI spend</span>
              </h2>
              <p className="mx-auto max-w-xl text-muted-foreground text-sm">
                Built for CTOs, founders, and finance teams who need visibility
                into AI tool costs — without the enterprise price tag.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature) => (
                <article
                  key={feature.title}
                  className="group rounded-2xl border border-border/40 bg-card p-6 shadow-sm transition-all hover:border-primary/40 hover:bg-accent/10"
                >
                  <div
                    className="mb-4 text-3xl transition-transform duration-300 group-hover:scale-110"
                    role="img"
                    aria-label={feature.title}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-foreground font-heading">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section
          className="px-4 py-20 sm:px-6"
          aria-labelledby="cta-heading"
        >
          <div className="mx-auto max-w-3xl rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-violet-500/5 dark:from-primary/10 dark:to-violet-500/10 p-10 text-center shadow-md">
            <h2
              id="cta-heading"
              className="mb-4 text-2xl font-bold sm:text-3xl text-foreground font-heading"
            >
              Ready to find your AI waste?
            </h2>
            <p className="mb-8 text-muted-foreground text-sm">
              Takes 5 minutes. No credit card. No account required.
            </p>
            <Link href="/audit/new">
              <Button size="lg" className="h-12 px-8 font-bold bg-primary text-primary-foreground hover:bg-primary/95 shadow-md shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.02] active:scale-95 flex items-center gap-1.5 mx-auto">
                <span>Start Free Audit</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer
        className="border-t border-border/40 px-4 py-10 sm:px-6 bg-muted/10 text-muted-foreground"
        role="contentinfo"
      >
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
