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
      { title: "Instagram akkaunt tahlili — REELPREDICT" },
      {
        name: "description",
        content: "Akkaunt darajasidagi tahlillar: vaqt bo'yicha ko'rishlar, faollik, obunachilar o'sishi va AI aniqlagan kontent naqshlari.",
      },
      { property: "og:title", content: "Instagram akkaunt tahlili — REELPREDICT" },
      { property: "og:description", content: "Faqat bitta Reels emas, butun akkauntingiz bo'yicha nima yaxshi ishlashini tushunib oling." },
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
      <h1 className="text-3xl font-semibold">Instagram akkaunt tahlili</h1>
      <p className="mt-2 text-muted-foreground">{a.handle} · ulangan ma'lumot manbasi</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Obunachilar" value={formatNumber(a.followers)} />
        <StatCard label="O'rtacha Reels ko'rishlari" value={formatNumber(a.avgReelViews)} />
        <StatCard label="O'rtacha faollik" value={`${a.avgEngagement}%`} />
        <StatCard label="O'sish" value={`+${a.growth}%`} hint="So'nggi 60 kun" />
        <StatCard label="Kontent barqarorligi" value={`${a.consistency}%`} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Panel title="Vaqt bo'yicha ko'rishlar">
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

        <Panel title="Vaqt bo'yicha faollik">
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

        <Panel title="Obunachilar o'sishi">
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

        <Panel title="Vaqt bo'yicha bashorat aniqligi">
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
        <ReelList title="Eng yaxshi natijali Reels" items={a.topReels} />
        <ReelList title="Eng past natijali Reels" items={a.lowReels} />
      </div>

      <section className="surface-card mt-6 p-6">
        <h2 className="text-sm uppercase tracking-widest text-muted-foreground">Nima yaxshi ishlayapti?</h2>
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
          Naqshlar sizning o'z akkaunt ma'lumotlaringizdan olingan. Bashoratlar taxminiy bo'lib, haqiqiy
          natijalar farq qilishi mumkin.
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
