import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/app/AppShell";
import { StatCard } from "@/components/data/StatCard";
import { formatNumber } from "@/lib/app-store";
import { accountSnapshot, accuracyHistory } from "@/lib/mock-data";

export const Route = createFileRoute("/accounts")({
  head: () => ({
    meta: [
      { title: "Instagram Account Intelligence — REELPREDICT" },
      {
        name: "description",
        content: "Account-level analytics: views over time, engagement, follower growth and the content patterns AI detects.",
      },
      { property: "og:title", content: "Instagram Account Intelligence — REELPREDICT" },
      { property: "og:description", content: "Understand what is working across your account, not just one Reel." },
    ],
  }),
  component: Accounts,
});

const tooltipStyle = {
  background: "var(--color-popover)",
  border: "1px solid var(--color-border)",
  borderRadius: 10,
  fontSize: 12,
};

function Accounts() {
  const a = accountSnapshot;
  return (
    <AppShell>
      <h1 className="text-3xl font-semibold">Instagram Account Intelligence</h1>
      <p className="mt-2 text-muted-foreground">{a.handle} · connected data source</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Followers" value={formatNumber(a.followers)} />
        <StatCard label="Average Reel views" value={formatNumber(a.avgReelViews)} />
        <StatCard label="Average engagement" value={`${a.avgEngagement}%`} />
        <StatCard label="Growth" value={`+${a.growth}%`} hint="Last 60 days" />
        <StatCard label="Content consistency" value={`${a.consistency}%`} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Panel title="Views over time">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={a.viewsOverTime}>
              <defs>
                <linearGradient id="rp-views" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="label" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => formatNumber(Number(v))} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="views" stroke="var(--color-chart-1)" strokeWidth={2} fill="url(#rp-views)" />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Engagement over time">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={a.viewsOverTime}>
              <CartesianGrid stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="label" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} unit="%" />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="engagement" stroke="var(--color-chart-2)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Follower growth">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={a.followerGrowth}>
              <CartesianGrid stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="label" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => formatNumber(Number(v))} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="followers" stroke="var(--color-chart-3)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Prediction accuracy over time">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={accuracyHistory}>
              <CartesianGrid stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="label" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} unit="%" domain={[50, 100]} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="accuracy" stroke="var(--color-chart-1)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <ReelList title="Top performing Reels" items={a.topReels} />
        <ReelList title="Lowest performing Reels" items={a.lowReels} />
      </div>

      <section className="surface-card mt-6 p-6">
        <h2 className="text-sm uppercase tracking-widest text-muted-foreground">What is working?</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {a.patterns.map((p) => (
            <p
              key={p}
              className="rounded-lg border border-border bg-background/40 p-4 text-sm leading-relaxed text-foreground/85"
            >
              {p}
            </p>
          ))}
        </div>
        <p className="mt-5 text-xs text-muted-foreground">
          Patterns are derived from your own account data. Predictions are estimates and actual
          results may vary.
        </p>
      </section>
    </AppShell>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="surface-card p-6">
      <h2 className="text-sm uppercase tracking-widest text-muted-foreground">{title}</h2>
      <div className="mt-6 h-60">{children}</div>
    </div>
  );
}

function ReelList({
  title,
  items,
}: {
  title: string;
  items: { title: string; views: number; engagement: number }[];
}) {
  return (
    <div className="surface-card p-6">
      <h2 className="text-sm uppercase tracking-widest text-muted-foreground">{title}</h2>
      <ul className="mt-4 divide-y divide-border">
        {items.map((r) => (
          <li key={r.title} className="flex items-center justify-between gap-4 py-3 text-sm">
            <span className="truncate">{r.title}</span>
            <span className="shrink-0 tabular-nums text-muted-foreground">
              {formatNumber(r.views)} · {r.engagement}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
