import type { Metadata } from "next";

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
  { value: "$1,840", label: "Avg monthly waste found" },
  { value: "3.2x", label: "Avg tool overlap per team" },
  { value: "< 5 min", label: "Time to complete audit" },
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
    <div className="min-h-screen bg-slate-950 text-white">
      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md"
        aria-label="Main navigation"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <a
            href="/"
            className="flex items-center gap-2 text-xl font-bold tracking-tight"
            aria-label="StackAudit Home"
          >
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-sm font-black"
              aria-hidden="true"
            >
              SA
            </span>
            <span>StackAudit</span>
          </a>

          <div className="hidden items-center gap-6 text-sm text-slate-400 sm:flex">
            <a
              href="#features"
              id="nav-features"
              className="transition-colors hover:text-white focus-visible:text-white"
            >
              Features
            </a>
            <a
              href="#pricing"
              id="nav-pricing"
              className="transition-colors hover:text-white focus-visible:text-white"
            >
              Pricing
            </a>
          </div>

          <a
            href="/audit/new"
            id="nav-cta"
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-violet-500 focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            Start Free Audit
          </a>
        </div>
      </nav>

      <main>
        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <section
          className="relative overflow-hidden px-4 pb-24 pt-20 sm:px-6 sm:pt-28 lg:pt-36"
          aria-labelledby="hero-heading"
        >
          {/* Background gradient */}
          <div
            className="pointer-events-none absolute inset-0 overflow-hidden"
            aria-hidden="true"
          >
            <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/20 blur-3xl" />
            <div className="absolute right-0 top-1/2 h-[400px] w-[400px] -translate-y-1/2 translate-x-1/2 rounded-full bg-indigo-600/15 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300">
              <span
                className="h-1.5 w-1.5 rounded-full bg-violet-400"
                aria-hidden="true"
              />
              Now in beta — free audits available
            </div>

            <h1
              id="hero-heading"
              className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              Stop Paying for AI Tools
              <br />
              <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                Your Team Doesn&apos;t Use
              </span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-slate-400 sm:text-xl">
              StackAudit analyzes your AI tool spend across ChatGPT, Claude,
              Cursor, Copilot, and more — then tells you exactly where
              you&apos;re wasting money.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a
                href="/audit/new"
                id="hero-cta-primary"
                className="w-full rounded-xl bg-violet-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-violet-900/40 transition-all hover:bg-violet-500 hover:shadow-violet-900/60 focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:w-auto"
              >
                Audit My Stack — Free
              </a>
              <a
                href="#features"
                id="hero-cta-secondary"
                className="w-full rounded-xl border border-slate-700 px-8 py-3.5 text-base font-semibold text-slate-300 transition-all hover:border-slate-600 hover:text-white focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:w-auto"
              >
                See How It Works
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
                  className="rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1 text-xs text-slate-400"
                >
                  {tool}
                </span>
              ))}
              <span className="rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1 text-xs text-slate-400">
                +30 more
              </span>
            </div>
          </div>
        </section>

        {/* ── Stats ───────────────────────────────────────────────────────── */}
        <section
          className="border-y border-slate-800 bg-slate-900/50 px-4 py-12 sm:px-6"
          aria-label="Key statistics"
        >
          <dl className="mx-auto grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-3">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <dt className="mb-1 text-sm text-slate-500">{stat.label}</dt>
                <dd className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── Features ────────────────────────────────────────────────────── */}
        <section
          id="features"
          className="px-4 py-20 sm:px-6 sm:py-28"
          aria-labelledby="features-heading"
        >
          <div className="mx-auto max-w-6xl">
            <div className="mb-14 text-center">
              <h2
                id="features-heading"
                className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl"
              >
                Everything you need to
                <span className="text-violet-400"> control AI spend</span>
              </h2>
              <p className="mx-auto max-w-xl text-slate-400">
                Built for CTOs, founders, and finance teams who need visibility
                into AI tool costs — without the enterprise price tag.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature) => (
                <article
                  key={feature.title}
                  className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition-all hover:border-violet-500/40 hover:bg-slate-900"
                >
                  <div
                    className="mb-4 text-3xl"
                    role="img"
                    aria-label={feature.title}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-400">
                    {feature.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Banner ──────────────────────────────────────────────────── */}
        <section
          className="px-4 py-20 sm:px-6"
          aria-labelledby="cta-heading"
        >
          <div className="mx-auto max-w-3xl rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-950/60 to-indigo-950/60 p-10 text-center">
            <h2
              id="cta-heading"
              className="mb-4 text-2xl font-bold sm:text-3xl"
            >
              Ready to find your AI waste?
            </h2>
            <p className="mb-8 text-slate-400">
              Takes 5 minutes. No credit card. No account required.
            </p>
            <a
              href="/audit/new"
              id="footer-cta"
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-violet-900/40 transition-all hover:bg-violet-500 focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Start Free Audit
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer
        className="border-t border-slate-800 px-4 py-10 sm:px-6"
        role="contentinfo"
      >
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-slate-500 sm:flex-row">
          <span className="font-semibold text-slate-400">
            StackAudit
          </span>
          <span>© {new Date().getFullYear()} StackAudit. All rights reserved.</span>
          <nav aria-label="Footer navigation" className="flex gap-4">
            <a
              href="/privacy"
              id="footer-privacy"
              className="transition-colors hover:text-white"
            >
              Privacy
            </a>
            <a
              href="/terms"
              id="footer-terms"
              className="transition-colors hover:text-white"
            >
              Terms
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
