import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Activity,
  BarChart3,
  Flame,
  ShieldCheck,
  Sparkles,
  Upload,
  Zap,
  CheckCircle2,
  Cpu,
} from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { MetricBar } from "@/components/data/MetricBar";
import { ScoreRing } from "@/components/data/ScoreRing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NEXREEL AI — Instagram Reels Virallik & Algoritmik Tahlili" },
      {
        name: "description",
        content:
          "Reels videongizni yuklang. NEXREEL AI Meta algoritmi (DM Shares, 3s Hook, Loop) va LiveDune benchmarklari asosida videoning uchish yoki uchmasligini joylashdan oldin aniqlaydi.",
      },
      { property: "og:title", content: "NEXREEL AI — Joylashdan Oldin Virallikni Biling" },
      {
        property: "og:description",
        content:
          "AI asosidagi Instagram samaradorlik tahlili: aniq algoritmik ball, soniyalar bo'yicha kamchiliklar va bashorat.",
      },
    ],
  }),
  component: Landing,
});

const heroMetrics = [
  { label: "0-3s Hook Kuchi", score: 92 },
  { label: "DM Shares (Do'stlarga yuborish)", score: 88 },
  { label: "To'liq ko'rish (Loop Faktor)", score: 84 },
  { label: "Vizual sifat & Pacing", score: 90 },
  { label: "Save & Qimmatli qiymat", score: 79 },
  { label: "Nisha auditoriyasiga moslik", score: 86 },
];

const audiences = [
  "Rilskreytorlar",
  "SMM mutaxassislari",
  "Biznes egalari",
  "Mobilograflar",
  "Ekspertlar",
  "Agentliklar",
];

const steps = [
  { n: "01", title: "Video Yuklash", body: "500MB gacha bo'lgan Reels videongizni bir zumda tashlang." },
  { n: "02", title: "Meta Algoritm Tahlili", body: "AI 5 ta asosiy ranking drayveri va nishangiz benchmarklari bo'yicha tahlil qiladi." },
  { n: "03", title: "Virallik Hukmi", body: "Video uchadimi, o'rtacha qoladimi yoki bloklanadimi — aniq xulosani oling." },
  { n: "04", title: "Tuzatish & Joylash", body: "Soniyalar bo'yicha ko'rsatilgan kamchiliklarni to'g'rilab, maksimal qamrovga erishing." },
];

const featureGroups = [
  {
    icon: Sparkles,
    title: "Meta 5 Ranking Drayveri",
    items: [
      "0-3 soniyalik Hook kuchi",
      "DM Shares per Reach (Meta #1 faktor)",
      "Loop & Qayta ko'rish chastotasi",
      "Save & Qimmatli maslahat qiymati",
      "Pacing & Har 2s dinamikasi",
    ],
  },
  {
    icon: Cpu,
    title: "LiveDune Bozor Benchmarklari",
    items: [
      "Nisha bo'yicha o'rtacha ER",
      "Top 10% viral videolar bilan solishtirish",
      "Akkauntingiz o'rtacha ko'rishlariga moslash",
      "Watermark (suv belgisi) jazosi xavfi",
      "Auditoriya drop-off nuqtalari",
    ],
  },
  {
    icon: Flame,
    title: "Aniq Bashorat & Diagnostika",
    items: [
      "Kutilayotgan ko'rishlar oralig'i (Views)",
      "Explore sahifasiga chiqish ehtimoli",
      "Soniyalar bo'yicha aniq kamchiliklar",
      "Joylashdan keyingi aniqlikni tekshirish",
      "PDF hisobot eksport qilish",
    ],
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-cyan-500/30 selection:text-cyan-200">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/70">
        <div className="halo pointer-events-none absolute inset-0" />
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-[0.25]" />
        
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pb-20 pt-16 md:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-300 backdrop-blur-md shadow-sm">
              <Zap className="h-3.5 w-3.5 text-cyan-400 animate-pulse" /> Meta Algoritmi & LiveDune Benchmark Dvigateli
            </span>
            
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight md:text-6xl lg:text-7xl">
              Joylashdan Oldin <span className="gradient-text">Virallikni Biling.</span>
            </h1>
            
            <p className="mt-5 text-base sm:text-lg font-medium text-foreground/90 leading-relaxed">
              Videongiz Explore-ga chiqadimi yoki to'xtab qoladimi? Nashr etishdan oldin aniq bilib oling.
            </p>
            
            <p className="mx-auto mt-3 max-w-2xl text-xs sm:text-sm leading-relaxed text-muted-foreground">
              NEXREEL AI videongizni <strong>Meta Reels algoritmi (DM Shares, 3s Hook, Loop)</strong> hamda <strong>LiveDune benchmarklari</strong> bilan taqqoslab, soniyalar bo'yicha aniq kamchiliklarni ko'rsatadi.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto shadow-xl shadow-cyan-500/25 font-bold py-6 px-8 text-sm bg-gradient-to-r from-cyan-400 to-emerald-400 hover:opacity-95 text-slate-950">
                <Link to="/analyze">
                  Reelsni Tekshirishni Boshlash <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto border-border/80 text-xs font-semibold py-6 px-6 hover:bg-surface-2">
                <a href="#how-it-works">Qanday Ishlaydi?</a>
              </Button>
            </div>
          </div>

          {/* Interactive Preview Card */}
          <div className="animate-rise mt-14 rounded-3xl border border-border/80 bg-surface/60 p-2 shadow-[var(--shadow-elevated)] backdrop-blur-xl">
            <div className="rounded-2xl border border-border/70 bg-card/90 p-6 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <Flame className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">reel_diagnostika_namuna.mp4</p>
                    <p className="text-[11px] text-muted-foreground font-mono">Davomiyligi: 22s · SMM & Biznes</p>
                  </div>
                </div>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-mono font-bold text-emerald-300">
                  🚀 UCHADI (92% Virallik)
                </span>
              </div>

              <div className="grid gap-8 pt-7 md:grid-cols-[220px_1fr]">
                <div className="flex flex-col items-center gap-4">
                  <ScoreRing score={92} size={150} />
                  <div className="grid w-full grid-cols-3 gap-2 text-center md:grid-cols-1">
                    <Cell label="Virallik" value="Yuqori" highlight />
                    <Cell label="Taxminiy ko'rishlar" value="1.8K – 3.6K" />
                    <Cell label="Ishonch darajasi" value="94%" />
                  </div>
                </div>
                <div className="grid content-start gap-x-8 gap-y-5 sm:grid-cols-2">
                  {heroMetrics.map((m) => (
                    <MetricBar key={m.label} label={m.label} score={m.score} suffix="%" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audiences */}
      <section className="border-b border-border/70 py-12 bg-surface/30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <p className="text-xs uppercase font-mono tracking-widest text-muted-foreground font-semibold">
            Kimlar uchun mo'ljallangan?
          </p>
          <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-6">
            {audiences.map((a) => (
              <div
                key={a}
                className="rounded-xl border border-border/70 bg-card/60 px-3.5 py-3 text-xs font-semibold text-foreground/80 hover:border-cyan-500/40 hover:text-cyan-300 transition-colors"
              >
                {a}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-b border-border/70 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">Oddiy & Tezkor</span>
            <h2 className="mt-2 text-2xl font-bold md:text-4xl">Qanday ishlaydi?</h2>
            <p className="mt-2 text-xs text-muted-foreground">4 oddiy qadamda videongizni maksimal natijaga tayyorlang</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {steps.map((s) => (
              <div key={s.n} className="surface-card p-6 relative group hover:border-cyan-500/40 transition-all">
                <span className="font-mono text-sm font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">{s.n}</span>
                <h3 className="mt-4 text-base font-bold text-foreground">{s.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Groups */}
      <section className="border-b border-border/70 py-16 md:py-20 bg-surface/20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold md:text-4xl">
              Bitta Reels. 5 ta Algoritm Drayveri. Aniq Natija.
            </h2>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {featureGroups.map((g) => (
              <div key={g.title} className="surface-card p-6 hover:border-cyan-500/30 transition-all">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
                  <g.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-sm font-bold text-foreground">
                  {g.title}
                </h3>
                <ul className="mt-4 space-y-2.5 text-xs text-muted-foreground">
                  {g.items.map((i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span className="text-foreground/90">{i}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="halo pointer-events-none absolute inset-0 opacity-40" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-extrabold md:text-5xl tracking-tight">Taxmin qilishni to'xtating.</h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
            Instagram Reels algoritmi bo'yicha videolaringizni professional darajada tekshiring.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto shadow-xl shadow-cyan-500/25 font-bold py-6 px-8 text-sm bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950">
              <Link to="/analyze">Birinchi Videoni Tahlil Qilish</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto text-xs font-semibold py-6 px-6">
              <Link to="/pricing">Tariflar & Obuna</Link>
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Cell({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-xl border border-border/70 bg-surface/50 p-2.5">
      <p className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">{label}</p>
      <p className={`mt-0.5 text-xs font-bold ${highlight ? "text-cyan-400" : "text-foreground"}`}>{value}</p>
    </div>
  );
}
