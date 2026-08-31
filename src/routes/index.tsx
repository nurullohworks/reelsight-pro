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
      { title: "REELPREDICT — Instagram Reels samaradorligini AI yordamida bashorat qiling" },
      {
        name: "description",
        content:
          "Reels videongizni yuklang yoki Instagram hisobingizni ulang. REELPREDICT samaradorlikni baholaydi, zaif tomonlarni topadi va joylashtirishdan oldin nimani yaxshilash kerakligini aniq ko'rsatadi.",
      },
      { property: "og:title", content: "REELPREDICT — Joylashdan oldin biling" },
      {
        property: "og:description",
        content:
          "AI asosidagi Instagram samaradorlik tahlili: bashorat ballari, vaqt jadvali tahlili va joylashtirishdan oldingi tavsiyalar.",
      },
    ],
  }),
  component: Landing,
});

const heroMetrics = [
  { label: "Ilgak (Hook)", score: 91 },
  { label: "Ushlab turish", score: 78 },
  { label: "Faollik", score: 84 },
  { label: "Vizual sifat", score: 88 },
  { label: "CTA", score: 63 },
  { label: "Auditoriyaga mosligi", score: 86 },
];

const audiences = ["Kontent yaratuvchilar", "SMM mutaxassislari", "Influencerlar", "Agentliklar", "Brendlar", "Kontent jamoalari"];

const steps = [
  { n: "01", title: "Yuklash", body: "Reels videongizni yuklang yoki Instagram hisobingizni ulang." },
  { n: "02", title: "Tahlil qilish", body: "AI videoni, hisobni va mavjud samaradorlik signallarini tahlil qiladi." },
  {
    n: "03",
    title: "Bashorat qilish",
    body: "Bashorat tizimi potensial samaradorlikni baholaydi va xavf omillarini aniqlaydi.",
  },
  { n: "04", title: "Yaxshilash", body: "Joylashtirishdan oldin aniq tavsiyalar oling." },
];

const featureGroups = [
  {
    icon: Sparkles,
    title: "Kontent tahlili",
    items: [
      "Ilgak kuchi",
      "Hikoya qilish",
      "Ritm",
      "Sahna almashinuvi",
      "Vizual sifat",
      "Audio",
      "Matn qoplamalari",
      "CTA",
      "Mavzu aniqligi",
    ],
  },
  {
    icon: Activity,
    title: "Samaradorlik signallari",
    items: [
      "Tarixiy ko'rishlar",
      "Faollik darajasi",
      "Ulashishlar",
      "Saqlanganlar",
      "Izohlar",
      "Qamrov",
      "Auditoriya munosabati",
      "Hisob o'sishi",
    ],
  },
  {
    icon: Gauge,
    title: "Bashorat",
    items: [
      "Samaradorlik balli",
      "Viral bo'lish salohiyati",
      "Taxminiy ko'rishlar oralig'i",
      "Ishonch darajasi",
      "Kuchli tomonlar",
      "Zaif tomonlar",
      "Xavf omillari",
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
              <Zap className="h-3 w-3 text-primary" /> AI bashorat tizimi
            </span>
            <h1 className="mt-6 text-5xl font-semibold leading-[1.05] md:text-7xl">
              Joylashdan Oldin Biling.
            </h1>
            <p className="mt-5 text-lg text-foreground/80 md:text-xl">
              Instagram kontentingiz e'lon qilinishidan oldin qanday natija berishini bashorat qiling.
            </p>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Reels videongizni yuklang yoki Instagram hisobingizni ulang. Bizning AI tizimimiz
              kontentingizni, hisob samaradorligini va mavjud reyting signallarini tahlil qilib,
              samaradorlikni baholaydi, zaif tomonlarni aniqlaydi va aynan nimani yaxshilash
              kerakligini ko'rsatadi.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link to="/analyze">
                  Birinchi Reelsni Tahlil Qiling <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#how-it-works">Qanday Ishlashini Ko'ring</a>
              </Button>
            </div>
          </div>

          <div className="animate-rise mt-16 rounded-3xl border border-border bg-surface/80 p-2 shadow-[var(--shadow-elevated)] backdrop-blur">
            <div className="rounded-[18px] border border-border bg-background/80 p-6 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5">
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                    Video samaradorlik balli
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">reel-launch-teaser.mp4 · 21s</p>
                </div>
                <span className="rounded-full border border-border bg-muted px-3 py-1 text-[11px] uppercase tracking-widest text-muted-foreground">
                  Bashorat · taxmin
                </span>
              </div>

              <div className="grid gap-8 pt-7 md:grid-cols-[220px_1fr]">
                <div className="flex flex-col items-center gap-4">
                  <ScoreRing score={82} />
                  <div className="grid w-full grid-cols-3 gap-2 text-center md:grid-cols-1">
                    <Cell label="Viral salohiyat" value="Yuqori" />
                    <Cell label="Taxminiy ko'rishlar" value="18K – 42K" />
                    <Cell label="Ishonch darajasi" value="76%" />
                  </div>
                </div>
                <div className="grid content-start gap-x-10 gap-y-6 sm:grid-cols-2">
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
            Kontent samaradorligini jiddiy qabul qiladiganlar uchun yaratilgan.
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
          <h2 className="text-3xl font-semibold md:text-4xl">Qanday ishlaydi</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            YUKLASH → TAHLIL QILISH → BASHORAT QILISH → OPTIMALLASHTIRISH
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
            Bitta Reels. Yuzlab signallar. Bitta aniq qaror.
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
            title="Shaffof metodologiya"
            body="Biz Meta'ning maxfiy reyting algoritmiga kirish huquqimiz borligini da'vo qilmaymiz. Bashoratlar mavjud Instagram ma'lumotlari, ommaviy hujjatlashtirilgan reyting signallari va sizning tarixiy samaradorligingiz asosida modellashtiriladi."
          />
          <Highlight
            icon={<BarChart3 className="h-4 w-4 text-primary" />}
            title="Tekshirilishi mumkin bo'lgan aniqlik"
            body="Nashr qilingandan so'ng haqiqiy natijalarni qayd eting. Har bir bashorat haqiqat bilan solishtirilib baholanadi va vaqt o'tishi bilan kuzatiladi."
          />
          <Highlight
            icon={<Upload className="h-4 w-4 text-primary" />}
            title="Ish jarayoningizga mos keladi"
            body="Nashr qilishdan oldin qoralamalarni tahlil qiling, o'z hisobingiz o'rtacha ko'rsatkichi bilan solishtiring va mijozlar uchun tayyor hisobotlarni eksport qiling."
          />
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <h2 className="text-4xl font-semibold md:text-5xl">Taxmin qilishni to'xtating. Tahlil qilishni boshlang.</h2>
          <p className="mt-4 text-muted-foreground">
            Auditoriyangizdan oldin kontentingiz nima qilayotganini biling.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/analyze">Birinchi Reelsni Tahlil Qiling</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/pricing">Pro'ni Ko'rib Chiqing</Link>
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
