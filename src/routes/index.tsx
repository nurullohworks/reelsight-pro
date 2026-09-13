import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Sparkles,
  Upload,
  Zap,
  CheckCircle2,
  AlertCircle,
  Scan,
  Layers,
  Flame,
  ShieldCheck,
  Cpu,
  Video,
  Play,
} from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NEXREEL AI — Instagram Reels Kadr-ba-Kadr Neyron Audit" },
      {
        name: "description",
        content:
          "Reels videongizdagi xatoliklarni soniyalar va kadrlar bo'yicha skrinshot bilan aniqlang. Meta reyting algoritmi bo'yicha to'liq diagnostika.",
      },
      { property: "og:title", content: "NEXREEL AI — Kadr-ba-Kadr Reels Diagnostikasi" },
    ],
  }),
  component: Landing,
});

export function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#070B12] text-foreground selection:bg-cyan-500/30 selection:text-cyan-200">
      <SiteHeader />

      {/* Hero Section — Ultra-Compact & High Impact */}
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-20">
        <div className="halo pointer-events-none absolute inset-0 opacity-40" />
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-[0.18]" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1 text-[11px] font-mono font-semibold text-cyan-300 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>NEYRON KADR-BA-KADR AUDIT DASTURI</span>
              </div>

              <h1 className="mt-5 text-3xl font-black leading-[1.1] tracking-tight sm:text-4xl md:text-5xl lg:text-[52px]">
                Reels xatolarini <br />
                <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                  soniyalar va kadrlar bo'yicha
                </span> <br />
                aniq ko'ring.
              </h1>

              <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
                Videongiz nima sababdan to'xtab qolishini joylashdan oldin biling. Algoritm aynan qaysi soniyada jazolayotganini kadr skrinshoti va to'liq yechimi bilan oling.
              </p>

              {/* Direct Quick Dropzone CTA */}
              <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-extrabold py-6 px-7 text-sm shadow-xl shadow-cyan-500/20 hover:opacity-95"
                >
                  <Link to="/analyze">
                    <Upload className="mr-2 h-4 w-4" /> Videoni Tekshirish (500MB) <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-border/80 text-xs font-semibold py-6 px-5 hover:bg-surface-2"
                >
                  <Link to="/accounts">
                    Akkaunt Ulash
                  </Link>
                </Button>
              </div>

              <div className="mt-8 flex items-center gap-6 text-[11px] font-mono text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Kadr skrinshoti</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Meta 5-Drayver</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Aniq Yechim</span>
                </div>
              </div>
            </div>

            {/* Right: Visual Frame Inspector Simulation Card */}
            <div className="relative">
              <div className="rounded-2xl border border-cyan-500/30 bg-slate-950/90 p-4 shadow-2xl shadow-cyan-500/10 backdrop-blur-2xl">
                
                {/* Visual Video Frame Preview Box */}
                <div className="relative overflow-hidden rounded-xl border border-border/80 bg-slate-900 aspect-[16/10] flex flex-col justify-between p-3">
                  <div className="flex items-center justify-between z-10">
                    <span className="rounded bg-black/70 px-2 py-0.5 font-mono text-[10px] font-bold text-cyan-400 border border-cyan-500/30">
                      ⏱ 00:04.2s (KADR SKRINSHOTI)
                    </span>
                    <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[9px] font-bold text-rose-400 border border-rose-500/40">
                      ❌ XATOLIK ANIQLANDI
                    </span>
                  </div>

                  {/* Red Targeted Bounding Box for the exact flaw */}
                  <div className="my-auto mx-auto w-4/5 rounded-lg border-2 border-dashed border-rose-500/80 bg-rose-500/10 p-3 text-center backdrop-blur-sm">
                    <p className="text-[11px] font-bold text-rose-300">
                      [XATOLIK HUDUDI: 00:04s]
                    </p>
                    <p className="mt-1 text-[10px] text-foreground/90 font-medium">
                      Statik pauza: 1.8 soniya davomida vizual dinamika yo'q
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[9px] font-mono text-muted-foreground z-10">
                    <span>AUDITORIYA DROP-OFF XAVFI: 42%</span>
                    <span className="text-emerald-400 font-bold">YECHIM: +1.2s B-ROLL</span>
                  </div>
                </div>

                {/* Instant Diagnostics Card under Frame */}
                <div className="mt-3.5 space-y-2 rounded-xl border border-border/60 bg-surface/60 p-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-foreground">Algoritmik Xulosa:</span>
                    <span className="font-mono font-bold text-cyan-400">92 / 100 (UCHADI)</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    00:04 dagi statik pauza bartaraf etilsa, to'liq ko'rish (retention) darajasi <strong>78% dan 91% gacha</strong> ko'tariladi.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3 Core Pillars — Compact & Punchy */}
      <section className="border-t border-border/70 py-12 bg-surface/20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-3">
            
            <div className="surface-card p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Scan className="h-4 w-4" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-foreground">Kadr-ba-Kadr Skrinshot</h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Aynan qaysi soniya va kadrda xatolik borligini vizual ko'rsatadi.
              </p>
            </div>

            <div className="surface-card p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Zap className="h-4 w-4" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-foreground">Meta 5-Drayver Formulalari</h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                DM Shares, Loop, Hook va Pacing bo'yicha 100% aniq algoritmik tahlil.
              </p>
            </div>

            <div className="surface-card p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-foreground">Aniq Tuzatish Rejasi</h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Har bir kamchilik uchun aniq va amaliy tavsiyalar beriladi.
              </p>
            </div>

          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
