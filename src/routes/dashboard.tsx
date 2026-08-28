import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Plus } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/app/AppShell";
import { StatCard } from "@/components/data/StatCard";
import { Button } from "@/components/ui/button";
import { useAppStore, formatNumber } from "@/lib/app-store";
import { accountSnapshot } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — REELPREDICT" },
      {
        name: "description",
        content: "Your Reels performance intelligence workspace: scores, trends and AI insights.",
      },
      { property: "og:title", content: "Dashboard — REELPREDICT" },
      { property: "og:description", content: "Track prediction scores, accuracy and recent analyses." },
    ],
  }),
  component: Dashboard,
});

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

function Dashboard() {
  const { analyses, user } = useAppStore();
  const last = analyses[0];
  const avg = Math.round(
    analyses.reduce((a, x) => a + x.prediction.overall_score, 0) / Math.max(analyses.length, 1),
  );

  return (
    <AppShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">{greeting()}{user ? `, ${user.name}` : ""}.</h1>
          <p className="mt-2 text-muted-foreground">What are you analyzing today?</p>
        </div>
        <Button asChild size="lg">
          <Link to="/analyze">
            <Plus className="mr-1 h-4 w-4" /> Analyze New Reel
          </Link>
        </Button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Last analysis" value={`${last?.prediction.overall_score ?? 0}/100`} hint={last?.title} />
        <StatCard label="Average score" value={`${avg}/100`} hint="Across all analyses" />
        <StatCard label="Prediction accuracy" value="81%" hint="Based on published results" />
        <StatCard label="Videos analyzed" value={analyses.length} hint="This workspace" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="surface-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm uppercase tracking-widest text-muted-foreground">
              Performance trends
            </h2>
            <span className="text-xs text-muted-foreground">Last 8 weeks</span>
          </div>
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={accountSnapshot.viewsOverTime}>
                <defs>
                  <linearGradient id="rp-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="label" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => formatNumber(Number(v))} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 10,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="var(--color-chart-1)"
                  strokeWidth={2}
                  fill="url(#rp-area)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="surface-card p-6">
          <h2 className="text-sm uppercase tracking-widest text-muted-foreground">AI insights</h2>
          <ul className="mt-5 space-y-4">
            {accountSnapshot.patterns.map((p) => (
              <li key={p} className="rounded-lg border border-border bg-background/40 p-4 text-sm leading-relaxed text-foreground/85">
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="surface-card mt-6 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm uppercase tracking-widest text-muted-foreground">Recent analyses</h2>
          <Link to="/history" className="text-xs text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="mt-4 divide-y divide-border">
          {analyses.slice(0, 5).map((a) => (
            <Link
              key={a.id}
              to="/reports/$id"
              params={{ id: a.id }}
              className="flex items-center justify-between gap-4 py-4 transition-colors hover:bg-muted/40"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{a.title}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(a.createdAt).toLocaleDateString()} · {a.status}
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="tabular-nums">{a.prediction.overall_score}/100</span>
                <span className="hidden text-muted-foreground sm:inline">
                  {formatNumber(a.prediction.estimated_view_min)} –{" "}
                  {formatNumber(a.prediction.estimated_view_max)}
                </span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
