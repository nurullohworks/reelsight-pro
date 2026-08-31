import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Check, Film, Loader2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/AppShell";
import { UpgradeModal } from "@/components/app/UpgradeModal";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/app-store";
import { ANALYSIS_STEPS, videoAnalysisService } from "@/lib/services";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/analyze")({
  head: () => ({
    meta: [
      { title: "Video tahlilchisi — REELPREDICT" },
      {
        name: "description",
        content: "Reels yuklang va nashr etishdan oldin AI samaradorlik bashorati, vaqt jadvali tahlili va tavsiyalarni oling.",
      },
      { property: "og:title", content: "Video tahlilchisi — REELPREDICT" },
      { property: "og:description", content: "Reels-ingizni yuklang va nashr etishdan oldin uning samaradorligini bashorat qiling." },
    ],
  }),
  component: Analyze,
});

function Analyze() {
  const { canAnalyze, addAnalysis } = useAppStore();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
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
      await new Promise((r) => setTimeout(r, 520));
    }
    const analysis = await videoAnalysisService.analyze({
      fileName: file.name,
      sizeBytes: file.size,
    });
    addAnalysis(analysis);
    void navigate({ to: "/reports/$id", params: { id: analysis.id } });
  };

  const running = step >= 0;

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold">Video tahlilchisi</h1>
        <p className="mt-2 text-muted-foreground">
          Nashr etishdan oldin Reels-ni tahlil qiling. Hech narsa Instagram-ga joylanmaydi.
        </p>

        {!running ? (
          <>
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
                "mt-8 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-border-strong bg-surface/50 px-6 py-20 text-center transition-colors",
                dragging && "border-primary bg-primary/5",
              )}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-muted">
                {file ? <Film className="h-6 w-6 text-primary" /> : <UploadCloud className="h-6 w-6 text-primary" />}
              </div>
              <p className="mt-6 text-lg font-medium">{file ? file.name : "Reels-ingizni shu yerga tashlang"}</p>
              <p className="mt-2 text-xs text-muted-foreground">Qo'llab-quvvatlanadi: MP4, MOV · Maksimal hajm: 500MB</p>
              <input
                ref={inputRef}
                type="file"
                accept="video/mp4,video/quicktime"
                className="hidden"
                onChange={(e) => pick(e.target.files?.[0])}
              />
            </div>

            <Button className="mt-6 w-full" size="lg" disabled={!file} onClick={() => void run()}>
              Videoni tahlil qilish
            </Button>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Bashoratlar mavjud ma'lumotlar va tarixiy samaradorlik signallariga asoslangan taxminlardir.
              Haqiqiy natijalar farq qilishi mumkin.
            </p>
          </>
        ) : (
          <div className="surface-card mt-8 p-8">
            <div className="flex items-center gap-3">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">{file?.name} tahlil qilinmoqda</p>
            </div>
            <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-500"
                style={{ width: `${((step + 1) / ANALYSIS_STEPS.length) * 100}%` }}
              />
            </div>
            <ol className="mt-8 space-y-4">
              {ANALYSIS_STEPS.map((label, i) => (
                <li key={label} className="flex items-center gap-3 text-sm">
                  <span
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-md border border-border font-mono text-[10px]",
                      i < step && "border-success/40 text-success",
                      i === step && "border-primary/50 text-primary",
                      i > step && "text-muted-foreground",
                    )}
                  >
                    {i < step ? <Check className="h-3 w-3" /> : String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={cn(i <= step ? "text-foreground" : "text-muted-foreground")}>
                    {label}
                  </span>
                  {i === step ? <span className="shimmer ml-auto h-1 w-24 rounded-full" /> : null}
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
