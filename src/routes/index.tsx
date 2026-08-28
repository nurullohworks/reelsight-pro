import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Activity,
  BarChart3,
  Gauge,
  ShieldCheck,
  Sparkles,
  Upload,
  Zap,
} from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { MetricBar } from "@/components/data/MetricBar";
import { ScoreRing } from "@/components/data/ScoreRing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "REELPREDICT — Predict Instagram Reels performance with AI" },
      {
        name: "description",
        content:
          "Upload a Reel or connect your Instagram account. REELPREDICT estimates performance, finds weaknesses and shows exactly what to improve before you post.",
      },
      { property: "og:title", content: "REELPREDICT — Know before you post" },
      {
        property: "og:description",
        content:
          "AI-powered Instagram performance intelligence: prediction scores, timeline analysis and recommendations before publishing.",
      },
    ],
  }),
  component: Landing,
});

const heroMetrics = [
  { label: "Hook", score: 91 },
  { label: "Retention", score: 78 },
  { label: "Engagement", score: 84 },
  { label: "Visual Quality", score: 88 },
  { label: "CTA", score: 63 },
  { label: "Audience Fit", score: 86 },
];

const audiences = ["Creators", "SMM Specialists", "Influencers", "Agencies", "Brands", "Content Teams"];

const steps = [
  { n: "01", title: "Upload", body: "Upload your Reel or connect your Instagram account." },
  { n: "02", title: "Analyze", body: "AI analyzes the video, account and available performance signals." },
  {
    n: "03",
    title: "Predict",
    body: "The prediction engine estimates potential performance and identifies risk factors.",
  },
  { n: "04", title: "Improve", body: "Get specific recommendations before publishing." },
];

const featureGroups = [
  {
    icon: Sparkles,
    title: "Content analysis",
    items: [
      "Hook strength",
      "Storytelling",
      "Pacing",
      "Scene changes",
      "Visual quality",
      "Audio",
      "Text overlays",
      "CTA",
      "Topic clarity",
    ],
  },
  {
    icon: Activity,
    title: "Performance signals",
    items: [
      "Historical views",
      "Engagement rate",
      "Shares",
      "Saves",
      "Comments",
      "Reach",
      "Audience response",
      "Account growth",
    ],
  },
  {
    icon: Gauge,
    title: "Prediction",
    items: [
      "Performance score",
      "Viral potential",
      "Estimated view range",
      "Confidence score",
      "Strengths",
      "Weaknesses",
      "Risk factors",
    ],
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="relative overflow-hidden border-b border-border">
        <div className="halo pointer-events-none absolute inset-0" />
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-[0.35]" />
        <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-20 md:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-[11px] uppercase tracking-widest text-muted-foreground">
              <Zap className="h-3 w-3 text-primary" /> AI prediction engine
            </span>
            <h1 className="mt-6 text-5xl font-semibold leading-[1.05] md:text-7xl">
              Know Before You Post.
            </h1>
            <p className="mt-5 text-lg text-foreground/80 md:text-xl">
              Predict how your Instagram content could perform before it goes live.
            </p>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Upload a Reel or connect your Instagram account. Our AI analyzes your content, account
              performance and available ranking signals to estimate performance, identify weaknesses
              and show you exactly what to improve.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link to="/analyze">
                  Analyze Your First Reel <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#how-it-works">See How It Works</a>
              </Button>
            </div>
          </div>

          <div className="animate-rise mt-16 rounded-3xl border border-border bg-surface/80 p-2 shadow-[var(--shadow-elevated)] backdrop-blur">
            <div className="rounded-[18px] border border-border bg-background/80 p-6 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5">
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                    Video performance score
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">reel-launch-teaser.mp4 · 21s</p>
                </div>
                <span className="rounded-full border border-border bg-muted px-3 py-1 text-[11px] uppercase tracking-widest text-muted-foreground">
                  Prediction · estimate
                </span>
              </div>

              <div className="grid gap-8 pt-7 md:grid-cols-[220px_1fr]">
                <div className="flex flex-col items-center gap-4">
                  <ScoreRing score={82} />
                  <div className="grid w-full grid-cols-3 gap-2 text-center md:grid-cols-1">
                    <Cell label="Viral potential" value="High" />
                    <Cell label="Estimated views" value="18K – 42K" />
                    <Cell label="Confidence" value="76%" />
                  </div>
                </div>
                <div className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
                  {heroMetrics.map((m) => (
                    <MetricBar key={m.label} label={m.label} score={m.score} suffix="%" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border py-16">
        <div className="mx-auto max-w-6xl px-5 text-center">
          <h2 className="text-2xl font-semibold md:text-3xl">
            Built for people who take content performance seriously.
          </h2>
          <div className="mt-9 grid grid-cols-2 gap-3 md:grid-cols-6">
            {audiences.map((a) => (
              <div
                key={a}
                className="rounded-lg border border-border bg-surface px-4 py-5 text-sm text-foreground/80"
              >
                {a}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-b border-border py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-3xl font-semibold md:text-4xl">How it works</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            UPLOAD → ANALYZE → PREDICT → OPTIMIZE
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {steps.map((s) => (
              <div key={s.n} className="surface-card p-6">
                <span className="font-mono text-xs text-primary">{s.n}</span>
                <h3 className="mt-4 text-lg font-medium">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="max-w-2xl text-3xl font-semibold md:text-4xl">
            One Reel. Hundreds of signals. One clear decision.
          </h2>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {featureGroups.map((g) => (
              <div key={g.title} className="surface-card p-7">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-muted">
                  <g.icon className="h-4 w-4 text-primary" />
                </div>
                <h3 className="mt-5 text-[11px] uppercase tracking-widest text-muted-foreground">
                  {g.title}
                </h3>
                <ul className="mt-4 space-y-2.5 text-sm text-foreground/85">
                  {g.items.map((i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-primary" />
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border py-20">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 md:grid-cols-3">
          <Highlight
            icon={<ShieldCheck className="h-4 w-4 text-primary" />}
            title="Transparent methodology"
            body="We do not claim access to Meta's private ranking algorithm. Predictions are modelled from available Instagram data, publicly documented ranking signals and your historical performance."
          />
          <Highlight
            icon={<BarChart3 className="h-4 w-4 text-primary" />}
            title="Accuracy you can audit"
            body="Log actual results after publishing. Every prediction is scored against reality and tracked over time."
          />
          <Highlight
            icon={<Upload className="h-4 w-4 text-primary" />}
            title="Fits your workflow"
            body="Analyze drafts before publishing, benchmark against your own account average and export client-ready reports."
          />
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <h2 className="text-4xl font-semibold md:text-5xl">Stop guessing. Start analyzing.</h2>
          <p className="mt-4 text-muted-foreground">
            Know what your content is doing before your audience does.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/analyze">Analyze Your First Reel</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/pricing">Explore Pro</Link>
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-3">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}

function Highlight({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div>
      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-muted">
        {icon}
      </div>
      <h3 className="mt-4 font-medium">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}
