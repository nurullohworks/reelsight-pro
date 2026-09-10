import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
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
import {
  Instagram,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Sliders,
  TrendingUp,
  Users,
  Eye,
  Activity,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/AppShell";
import { StatCard } from "@/components/data/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { formatNumber, useAppStore } from "@/lib/app-store";
import { accuracyHistory } from "@/lib/mock-data";
import { LIVEDUNE_NICHES } from "@/lib/services";

export const Route = createFileRoute("/accounts")({
  head: () => ({
    meta: [
      { title: "Instagram Akkaunt Ulash & Tahlili вЂ” REELPREDICT" },
      {
        name: "description",
        content: "Instagram akkauntingizni ulang va Reels bashoratlari aniqligini 95%+ ga oshiring.",
      },
      { property: "og:title", content: "Instagram Akkaunt Ulash вЂ” REELPREDICT" },
      { property: "og:description", content: "Akkauntingizning real qamrovi va LiveDune benchmarklari bilan kalibratsiyalash." },
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

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="surface-card p-6">
      <h2 className="text-sm font-semibold">{title}</h2>
      <div className="mt-4 h-64">{children}</div>
    </div>
  );
}

function Accounts() {
  const { instagramAccount, connectInstagram, disconnectInstagram } = useAppStore();
  const [modalOpen, setModalOpen] = useState(false);

  // Form states
  const [handle, setHandle] = useState(instagramAccount?.handle || "@my_creator_account");
  const [followers, setFollowers] = useState<number>(instagramAccount?.followers || 3500);
  const [avgViews, setAvgViews] = useState<number>(instagramAccount?.avgReelViews || 1800);
  const [engagement, setEngagement] = useState<number>(instagramAccount?.avgEngagement || 5.2);
  const [niche, setNiche] = useState(instagramAccount?.niche || "business");
  const [loading, setLoading] = useState(false);

  const handleConnect = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      connectInstagram({
        handle: handle.startsWith("@") ? handle : `@${handle}`,
        followers: Number(followers) || 3000,
        avgReelViews: Number(avgViews) || 1500,
        avgEngagement: Number(engagement) || 4.5,
        growth: 12.8,
        consistency: 90,
        niche,
        isConnected: true,
      });

      setLoading(false);
      setModalOpen(false);
      toast.success("Instagram akkaunt muvaffaqiyatli ulandi!", {
        description: `${handle} o'rtacha ${formatNumber(avgViews)} ko'rishga kalibratsiyalandi. Endi barcha tahlillar aniq hisoblanadi.`,
      });
    }, 600);
  };

  const a = instagramAccount || {
    handle: "@ulangan_akkaunt_yoq",
    followers: 0,
    avgReelViews: 0,
    avgEngagement: 0,
    growth: 0,
    consistency: 0,
    isConnected: false,
  };

  const dynamicViewsData = [
    { label: "1-hafta", views: Math.round(a.avgReelViews * 0.85), engagement: a.avgEngagement * 0.9 },
    { label: "2-hafta", views: Math.round(a.avgReelViews * 0.95), engagement: a.avgEngagement * 0.95 },
    { label: "3-hafta", views: Math.round(a.avgReelViews * 1.05), engagement: a.avgEngagement },
    { label: "4-hafta", views: Math.round(a.avgReelViews * 1.25), engagement: a.avgEngagement * 1.1 },
    { label: "5-hafta", views: Math.round(a.avgReelViews * 1.15), engagement: a.avgEngagement * 1.05 },
    { label: "6-hafta", views: Math.round(a.avgReelViews * 1.35), engagement: a.avgEngagement * 1.15 },
  ];

  const dynamicFollowerGrowth = [
    { label: "Yanvar", followers: Math.round(a.followers * 0.82) },
    { label: "Fevral", followers: Math.round(a.followers * 0.89) },
    { label: "Mart", followers: Math.round(a.followers * 0.94) },
    { label: "Aprel", followers: Math.round(a.followers * 0.98) },
    { label: "Hozir", followers: a.followers },
  ];

  return (
    <AppShell>
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-primary uppercase">
            <Instagram className="h-4 w-4" />
            <span>Instagram Akkaunt Kalibratsiyasi</span>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Akkaunt Tahlili & Ulanishi</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Akkauntingizni ulasangiz, AI video bashoratlari sizning real obunachilaringiz va qamrovingizga moslashtiriladi.
          </p>
        </div>

        <div className="flex gap-2">
          {a.isConnected ? (
            <Button variant="outline" className="gap-2" onClick={() => setModalOpen(true)}>
              <Sliders className="h-4 w-4" />
              Metriklarni yangilash
            </Button>
          ) : (
            <Button className="gap-2 bg-gradient-to-r from-pink-500 to-rose-600 font-bold" onClick={() => setModalOpen(true)}>
              <Instagram className="h-4 w-4" />
              Instagramni Ulash
            </Button>
          )}
        </div>
      </div>

      {/* Account Status Card */}
      <div className="mt-6 rounded-2xl border border-border bg-gradient-to-br from-card to-secondary/30 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-yellow-500 via-rose-500 to-purple-600 text-white shadow-lg">
              <Instagram className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{a.handle}</h2>
                {a.isConnected && (
                  <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="h-3 w-3" /> Faol ulangan
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {a.isConnected
                  ? `AI modeli ${formatNumber(a.avgReelViews)} o'rtacha ko'rish asosida kalibratsiyalangan.`
                  : "Akkaunt ulanmagan. Tahlillar umumiy benchmark bo'yicha hisoblanmoqda."}
              </p>
            </div>
          </div>

          <Button
            size="sm"
            variant="outline"
            className="text-xs"
            onClick={() => {
              if (a.isConnected) {
                disconnectInstagram();
                toast.info("Instagram akkaunt uzildi");
              } else {
                setModalOpen(true);
              }
            }}
          >
            {a.isConnected ? "Akkauntni uzish" : "Akkauntni ulash"}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Obunachilar" value={a.isConnected ? formatNumber(a.followers) : "вЂ”"} hint="Auditoriya bazasi" />
        <StatCard label="O'rtacha Reels Ko'rishi" value={a.isConnected ? formatNumber(a.avgReelViews) : "вЂ”"} hint="Kalibratsiya asosi" />
        <StatCard label="O'rtacha Faollik (ER)" value={a.isConnected ? `${a.avgEngagement}%` : "вЂ”"} hint="DM + Save + Like" />
        <StatCard label="Oylik O'sish" value={a.isConnected ? `+${a.growth}%` : "вЂ”"} hint="So'nggi 30 kun" />
        <StatCard label="Bashorat Aniqligi" value={a.isConnected ? "94.6%" : "65.0%"} hint={a.isConnected ? "Yuqori daraja" : "Akkaunt ulanmagan"} />
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Panel title="Vaqt bo'yicha ko'rishlar dinamikasi">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dynamicViewsData}>
              <defs>
                <linearGradient id="rp-views" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="label" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => formatNumber(Number(v))} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="views" stroke="var(--color-primary)" strokeWidth={2} fill="url(#rp-views)" />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Obunachilar o'sishi">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dynamicFollowerGrowth}>
              <CartesianGrid stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="label" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => formatNumber(Number(v))} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="followers" stroke="var(--color-chart-2)" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      {/* Connect Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md bg-card border-border p-6 sm:rounded-2xl">
          <DialogHeader>
            <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase">
              <Sparkles className="h-4 w-4" />
              <span>Kalibratsiya Sozlamalari</span>
            </div>
            <DialogTitle className="text-xl font-bold mt-1">
              Instagram Akkauntni Ulash
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Reels bashorati sizning profilingiz ko'rsatkichlariga 95%+ aniqlikda mos kelishi uchun ma'lumotlarni kiriting.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleConnect} className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ig-handle">Instagram Username</Label>
              <div className="relative">
                <Input
                  id="ig-handle"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="@foydalanuvchi"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="ig-views">O'rtacha Reels Ko'rishi</Label>
                <Input
                  id="ig-views"
                  type="number"
                  value={avgViews}
                  onChange={(e) => setAvgViews(Number(e.target.value))}
                  placeholder="masalan: 1900"
                  required
                />
                <span className="text-[10px] text-muted-foreground">Eng so'nggi 5-10 ta video o'rtachasi</span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ig-followers">Obunachilar Soni</Label>
                <Input
                  id="ig-followers"
                  type="number"
                  value={followers}
                  onChange={(e) => setFollowers(Number(e.target.value))}
                  placeholder="masalan: 4500"
                  required
                />
                <span className="text-[10px] text-muted-foreground">Jami obunachilar</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ig-niche">Akkaunt Nishasi (Sohasi)</Label>
              <select
                id="ig-niche"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {LIVEDUNE_NICHES.map((n) => (
                  <option key={n.key} value={n.key}>
                    {n.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6 flex gap-2">
              <Button type="button" variant="ghost" className="flex-1" onClick={() => setModalOpen(false)}>
                Bekor qilish
              </Button>
              <Button type="submit" disabled={loading} className="flex-1 font-bold bg-primary text-primary-foreground">
                {loading ? "Ulanmoqda..." : "Ulash & Kalibratsiyalash"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}