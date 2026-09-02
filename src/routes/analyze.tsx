import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Check, Film, Loader2, Sparkles, UploadCloud, ShieldAlert, Cpu } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/AppShell";
import { UpgradeModal } from "@/components/app/UpgradeModal";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/app-store";
import { ANALYSIS_STEPS, LIVEDUNE_NICHES, videoAnalysisService } from "@/lib/services";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/analyze")({
  head: () => ({
    meta: [
      { title: "Meta & LiveDune Algoritmik Tahlil — REELPREDICT" },
      {
        name: "description",
        content: "Reels yuklang va Meta reyting algoritmi hamda LiveDune benchmarklari asosida videoning uchish/uchmasligini aniqlang.",
      },
      { property: "og:title", content: "Meta & LiveDune Algoritmik Tahlil — REELPREDICT" },
      { property: "og:description", content: "Reels-ingizni yuklang va Meta algoritmi bo'yicha aniq kamchiliklarni oling." },
    ],
  }),
  component: Analyze,
});

function Analyze() {
  const { canAnalyze, addAnalysis } = useAppStore();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [niche, setNiche] = useState("business");
  const [hasWatermark, setHasWatermark] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [step, setStep] = useState(-1);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const pick = (f: File | undefined) => {
    if (!f) return;
    if (!/\.(mp4|mov)$/i.test(f.name)) {
      toast.error("Qo'llab-quvvatlanmaydigan format", { description: "MP4 yoki MOV faylini yuklang." });
      return;
    }
    if (f.size > 500 * 1024 * 1024) {
      toast.error("Fayl juda katta", { description: "Maksimal hajm 500MB." });
      return;
    }
    setFile(f);
  };

  const run = async () => {
    if (!file) return;
    if (!canAnalyze) {
      setUpgradeOpen(true);
      return;
    }
    for (let i = 0; i < ANALYSIS_STEPS.length; i++) {
      setStep(i);
      await new Promise((r) => setTimeout(r, 650));
    }
    const analysis = await videoAnalysisService.analyze({
      fileName: file.name,
      sizeBytes: file.size,
      niche,
      hasWatermark,
    });
    addAnalysis(analysis);
    void navigate({ to: "/reports/$id", params: { id: analysis.id } });
  };

  const running = step >= 0;

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-primary uppercase">
          <Cpu className="h-4 w-4" />
          <span>Meta Reels Algoritmi & LiveDune Dvigateli</span>
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Algoritmik Video Diagnostikasi</h1>
        <p className="mt-2 text-muted-foreground">
          Reels-ingizni nashr etishdan oldin tekshiring: Meta algoritmi uni Explore-ga chiqaradimi yoki bloklaydimi?
        </p>

        {!running ? (
          <>
            {/* Niche Selector */}
            <div className="mt-6 rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-sm">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Sohangizni (Nishani) tanlang (LiveDune bozor benchmarki uchun):
              </label>
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {LIVEDUNE_NICHES.map((n) => (
                  <button
                    key={n.key}
                    type="button"
                    onClick={() => setNiche(n.key)}
                    className={cn(
                      "flex flex-col items-start rounded-xl border p-3 text-left text-xs transition-all",
                      niche === n.key
                        ? "border-primary bg-primary/10 text-primary font-medium shadow-sm ring-1 ring-primary/30"
                        : "border-border bg-muted/30 text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                    )}
                  >
                    <span className="font-semibold">{n.name}</span>
                    <span className="mt-1 line-clamp-1 text-[10px] opacity-75">{n.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Video Dropzone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                pick(e.dataTransfer.files[0]);
              }}
              onClick={() => inputRef.current?.click()}
              className={cn(
                "mt-6 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-border-strong bg-surface/50 px-6 py-16 text-center transition-all",
                dragging && "border-primary bg-primary/5",
              )}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-muted">
                {file ? <Film className="h-6 w-6 text-primary" /> : <UploadCloud className="h-6 w-6 text-primary" />}
              </div>
              <p className="mt-5 text-lg font-medium">{file ? file.name : "Reels-ingizni shu yerga tashlang"}</p>
              <p className="mt-2 text-xs text-muted-foreground">Qo'llab-quvvatlanadi: MP4, MOV · Maksimal hajm: 500MB</p>
              <input
                ref={inputRef}
                type="file"
                accept="video/mp4,video/quicktime"
                className="hidden"
                onChange={(e) => pick(e.target.files?.[0])}
              />
            </div>

            {/* Additional Options */}
            <div className="mt-4 flex items-center justify-between rounded-xl border border-border/70 bg-card/40 px-4 py-3 text-xs">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-warning" />
                <span className="text-muted-foreground">Videoda TikTok yoki CapCut logotipi (suv belgisi) bormi?</span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasWatermark}
                  onChange={(e) => setHasWatermark(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                />
                <span className="font-medium text-foreground">{hasWatermark ? "Ha (jazo hisoblanadi)" : "Yo'q (toza)"}</span>
              </label>
            </div>

            <Button className="mt-6 w-full py-6 text-base font-semibold shadow-lg shadow-primary/20" size="lg" disabled={!file} onClick={() => void run()}>
              Algoritmik Tahlilni Boshlash (Uchish / Uchmaslikni aniqlash)
            </Button>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Tahlil Meta Reels 2024-2026 ranking signallari (Sends/Reach, 3s Hook retention, Loop factor) va LiveDune bozor ma'lumotlariga tayanadi.
            </p>
          </>
        ) : (
          <div className="surface-card mt-8 p-8 border border-border/80 shadow-xl rounded-2xl">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <div>
                <p className="text-sm font-semibold text-foreground">{file?.name}</p>
                <p className="text-xs text-muted-foreground">Meta algoritmi va LiveDune benchmarklari solishtirilmoqda...</p>
              </div>
            </div>
            <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-500 shadow-sm"
                style={{ width: `${((step + 1) / ANALYSIS_STEPS.length) * 100}%` }}
              />
            </div>
            <ol className="mt-8 space-y-4">
              {ANALYSIS_STEPS.map((label, i) => (
                <li key={label} className="flex items-center gap-3 text-sm">
                  <span
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-md border font-mono text-[10px] font-semibold",
                      i < step && "border-success/40 bg-success/10 text-success",
                      i === step && "border-primary/50 bg-primary/10 text-primary animate-pulse",
                      i > step && "border-border text-muted-foreground",
                    )}
                  >
                    {i < step ? <Check className="h-3.5 w-3.5" /> : String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={cn(i <= step ? "text-foreground font-medium" : "text-muted-foreground")}>
                    {label}
                  </span>
                  {i === step ? <span className="shimmer ml-auto h-1.5 w-24 rounded-full" /> : null}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
      <UpgradeModal open={upgradeOpen} onOpenChange={setUpgradeOpen} />
    </AppShell>
  );
}

