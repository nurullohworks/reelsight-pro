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
      { title: "Video Analyzer — REELPREDICT" },
      {
        name: "description",
        content: "Upload a Reel and get an AI performance prediction, timeline analysis and fixes before you publish.",
      },
      { property: "og:title", content: "Video Analyzer — REELPREDICT" },
      { property: "og:description", content: "Drop your Reel and predict its performance before publishing." },
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
      toast.error("Unsupported format", { description: "Upload an MP4 or MOV file." });
      return;
    }
    if (f.size > 500 * 1024 * 1024) {
      toast.error("File too large", { description: "Maximum size is 500MB." });
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
        <h1 className="text-3xl font-semibold">Video Analyzer</h1>
        <p className="mt-2 text-muted-foreground">
          Analyze a Reel before publishing. Nothing is posted to Instagram.
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
              <p className="mt-6 text-lg font-medium">{file ? file.name : "Drop your Reel here"}</p>
              <p className="mt-2 text-xs text-muted-foreground">Supported: MP4, MOV · Maximum size: 500MB</p>
              <input
                ref={inputRef}
                type="file"
                accept="video/mp4,video/quicktime"
                className="hidden"
                onChange={(e) => pick(e.target.files?.[0])}
              />
            </div>

            <Button className="mt-6 w-full" size="lg" disabled={!file} onClick={() => void run()}>
              Analyze Video
            </Button>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Predictions are estimates based on available data and historical performance signals.
              Actual results may vary.
            </p>
          </>
        ) : (
          <div className="surface-card mt-8 p-8">
            <div className="flex items-center gap-3">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Analyzing {file?.name}</p>
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
