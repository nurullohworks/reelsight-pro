import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, Download, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AppShell } from "@/components/app/AppShell";
import { MetricBar } from "@/components/data/MetricBar";
import { ScoreRing } from "@/components/data/ScoreRing";
import { StatCard } from "@/components/data/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatNumber, useAppStore } from "@/lib/app-store";
import { predictionAccuracy, reportService, REPORT_DISCLAIMER } from "@/lib/services";
import type { Severity } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reports/$id")({
  head: () => ({
    meta: [
      { title: "Reel samaradorligi hisoboti — REELPREDICT" },
      {
        name: "description",
        content: "To‘liq AI samaradorlik hisoboti: ball, taxminiy ko‘rishlar, vaqt tahlili, tavsiyalar va benchmark.",
      },
      { property: "og:title", content: "Reel samaradorligi hisoboti — REELPREDICT" },
      { property: "og:description", content: "Instagram Reel’ingiz uchun batafsil AI bashorat hisoboti." },
    ],
  }),
  component: ReportPage,
});

const severityStyles: Record<Severity, string> = {
  high: "border-destructive/40 text-destructive",
  medium: "border-warning/40 text-warning",
  low: "border-border text-muted-foreground",
};

function ReportPage() {
  const { id } = useParams({ from: "/reports/$id" });
  const { analyses, setActualViews } = useAppStore();
  const analysis = analyses.find((a) => a.id === id);
  const [actual, setActual] = useState("");

  if (!analysis) {
    return (
      <AppShell>
        <div className="surface-card mx-auto max-w-md p-8 text-center">
          <h1 className="text-lg font-semibold">Hisobot topilmadi</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Bu tahlil sizning ish maydoningizda mavjud emas.
          </p>
          <Button asChild className="mt-6">
            <Link to="/history">Tarixga qaytish</Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  const p = analysis.prediction;
  const accuracy = predictionAccuracy(analysis);

  return (
    <AppShell>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
            Reel samaradorligi hisobotingiz
          </p>
          <h1 className="mt-2 text-3xl font-semibold">{analysis.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {analysis.fileName} · {new Date(analysis.createdAt).toLocaleString()} · @yourstudio
          </p>
        </div>
        <Button variant="outline" onClick={() => void reportService.export(analysis)}>
          <Download className="mr-1 h-4 w-4" /> PDF eksport
        </Button>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[320px_1fr]">
        <div className="surface-card flex flex-col items-center p-8">
          <ScoreRing score={p.overall_score} size={200} />
          <p className="mt-5 text-sm font-medium">Yuqori samaradorlik salohiyati</p>
          <p className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">
            Bashoratlar mavjud ma’lumotlar va oldingi samaradorlik signallariga asoslangan taxminlardir.
            Haqiqiy natijalar farq qilishi mumkin.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard
            label="Taxminiy ko‘rishlar"
            value={`${formatNumber(p.estimated_view_min)} – ${formatNumber(p.estimated_view_max)}`}
          />
          <StatCard
            label="Taxminiy qamrov"
            value={`${formatNumber(p.estimated_reach_min)} – ${formatNumber(p.estimated_reach_max)}`}
          />
          <StatCard label="Viral salohiyat" value={`${p.viral_probability}%`} />
          <StatCard label="Ishonch" value={`${p.confidence_score}%`} />
          <div className="surface-card p-5 sm:col-span-2">
            <h2 className="text-[11px] uppercase tracking-widest text-muted-foreground">
              Kuchli va zaif tomonlar hamda xavf omillari
            </h2>
            <div className="mt-4 grid gap-5 md:grid-cols-3">
              <List title="Kuchli tomonlar" items={p.strengths} tone="text-success" />
              <List title="Zaif tomonlar" items={p.weaknesses} tone="text-warning" />
              <List title="Xavf omillari" items={p.risk_factors} tone="text-destructive" />
            </div>
          </div>
        </div>
      </div>

      <section className="surface-card mt-6 p-6">
        <h2 className="text-sm uppercase tracking-widest text-muted-foreground">
          Samaradorlik tafsiloti
        </h2>
        <div className="mt-6 grid gap-x-10 gap-y-5 md:grid-cols-2">
          {analysis.metrics.map((m) => (
            <MetricBar key={m.key} label={m.label} score={m.score} />
          ))}
        </div>
      </section>

      <section className="surface-card mt-6 p-6">
        <h2 className="text-sm uppercase tracking-widest text-muted-foreground">Vaqt tahlili</h2>
        <div className="mt-6 flex gap-1 overflow-hidden rounded-lg">
          {analysis.timeline.map((seg) => (
            <div
              key={seg.label}
              className={cn(
                "h-2 rounded-full",
                seg.verdict === "Strong" && "bg-success",
                seg.verdict === "Good" && "bg-primary",
                seg.verdict === "Average" && "bg-warning",
                seg.verdict === "Weak" && "bg-destructive",
              )}
              style={{ flex: seg.to - seg.from }}
            />
          ))}
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-5">
          {analysis.timeline.map((seg) => (
            <div
              key={seg.label}
              className={cn(
                "rounded-lg border border-border bg-background/40 p-4",
                seg.verdict === "Weak" && "border-destructive/40",
              )}
            >
              <p className="font-mono text-[11px] text-muted-foreground">
                {seg.from}s — {seg.to}s
              </p>
              <p className="mt-2 text-sm font-medium uppercase tracking-wide">{seg.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{seg.verdict}</p>
            </div>
          ))}
        </div>
        {analysis.timeline
          .filter((s) => s.note)
          .map((s) => (
            <div
              key={s.label}
              className="mt-5 flex gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4"
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
              <div>
                <p className="text-sm font-medium">
                  {s.from}–{s.to - 1} soniya atrofida ushlab turish xavfi aniqlandi.
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{s.note}</p>
              </div>
            </div>
          ))}
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold">Joylashtirishdan oldin nimani o‘zgartirish kerak?</h2>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {analysis.recommendations.map((r) => (
            <div key={r.id} className="surface-card p-6">
              <span
                className={cn(
                  "inline-flex rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-widest",
                  severityStyles[r.severity],
                )}
              >
                {r.severity === "high" ? "yuqori" : r.severity === "medium" ? "o‘rta" : "past"} muhimlik
              </span>
              <h3 className="mt-4 font-medium">{r.title}</h3>
              <dl className="mt-4 space-y-3 text-sm">
                <Row label="Hozirgi holat" value={r.current} />
                <Row label="Tavsiya etiladi" value={r.recommended} />
                <Row label="Nima uchun muhim" value={r.why} />
              </dl>
              <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-sm">
                <span className="text-muted-foreground">Ta’sir +{r.impact}</span>
                <span className="tabular-nums">
                  {r.currentScore} <TrendingUp className="mx-1 inline h-3 w-3 text-primary" />{" "}
                  {r.potentialScore}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="surface-card mt-6 p-6">
        <h2 className="text-sm uppercase tracking-widest text-muted-foreground">
          Kontentingizni benchmark bilan solishtiring
        </h2>
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analysis.benchmark}>
              <CartesianGrid stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="metric" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: "var(--color-popover)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 10,
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="reel" name="Sizning Reel’ingiz" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="accountAvg" name="Akkaunt o‘rtachasi" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="benchmark" name="Kontent benchmark" fill="var(--color-chart-3)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="surface-card mt-6 p-6">
        <h2 className="text-sm uppercase tracking-widest text-muted-foreground">
          Bashorat aniqligi
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <StatCard
            label="Bashorat qilingan"
            value={`${formatNumber(p.estimated_view_min)} – ${formatNumber(p.estimated_view_max)}`}
          />
          <StatCard
            label="Haqiqiy"
            value={analysis.actualViews ? formatNumber(analysis.actualViews) : "—"}
          />
          <StatCard label="Aniqlik" value={accuracy ? accuracy.label : "Ma’lumot kutilmoqda"} />
        </div>
        {accuracy ? (
          <p className="mt-4 text-sm text-muted-foreground">
            {accuracy.inRange
              ? "Haqiqiy natijangiz bashorat qilingan samaradorlik oralig‘ida bo‘ldi."
              : "Haqiqiy natijangiz bashorat qilingan oraliqdan tashqarida bo‘ldi. Bu model uchun teskari aloqa sifatida ishlatiladi."}
          </p>
        ) : (
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Input
              value={actual}
              onChange={(e) => setActual(e.target.value)}
              inputMode="numeric"
              placeholder="Joylashtirilgandan keyingi haqiqiy ko‘rishlarni kiriting"
              className="sm:max-w-xs"
            />
            <Button
              variant="outline"
              onClick={() => {
                const v = Number(actual.replace(/\D/g, ""));
                if (v > 0) setActualViews(analysis.id, v);
              }}
            >
              Haqiqiy natijani qayd etish
            </Button>
          </div>
        )}
      </section>

      <section className="surface-card mt-6 border-primary/40 p-8 shadow-[var(--shadow-glow)]">
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
          Joylashtirish bo‘yicha tavsiya
        </p>
        <h2 className="mt-3 text-3xl font-semibold">{analysis.verdict.state}</h2>
        <p className="mt-3 text-sm text-muted-foreground">{analysis.verdict.summary}</p>
        <ul className="mt-5 space-y-2 text-sm">
          {analysis.verdict.fixes.map((f) => (
            <li key={f} className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-primary" /> {f}
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm text-muted-foreground">
          Yaxshilashlardan keyingi salohiyatli ball:{" "}
          <span className="font-medium text-foreground">
            {p.overall_score} → {analysis.verdict.potentialScore}
          </span>
        </p>
        <Button asChild className="mt-6">
          <Link to="/analyze">Ushbu Reel’ni optimallashtirish</Link>
        </Button>
        <p className="mt-6 text-xs text-muted-foreground">{REPORT_DISCLAIMER}</p>
      </section>
    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-widest text-muted-foreground">{label}</dt>
      <dd className="mt-1 leading-relaxed text-foreground/85">{value}</dd>
    </div>
  );
}

function List({ title, items, tone }: { title: string; items: string[]; tone: string }) {
  return (
    <div>
      <p className={cn("text-[11px] uppercase tracking-widest", tone)}>{title}</p>
      <ul className="mt-3 space-y-2 text-sm text-foreground/85">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  );
}
