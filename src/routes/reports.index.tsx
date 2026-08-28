import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { formatNumber, useAppStore } from "@/lib/app-store";

export const Route = createFileRoute("/reports/")({
  head: () => ({
    meta: [
      { title: "Reports — REELPREDICT" },
      { name: "description", content: "All generated Reel performance reports in your workspace." },
      { property: "og:title", content: "Reports — REELPREDICT" },
      { property: "og:description", content: "Browse and export your AI performance reports." },
    ],
  }),
  component: Reports,
});

function Reports() {
  const { analyses } = useAppStore();
  return (
    <AppShell>
      <h1 className="text-3xl font-semibold">Reports</h1>
      <p className="mt-2 text-muted-foreground">Exportable AI performance reports.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {analyses.map((a) => (
          <Link
            key={a.id}
            to="/reports/$id"
            params={{ id: a.id }}
            className="surface-card p-6 transition-colors hover:border-border-strong"
          >
            <div className="flex items-center justify-between">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">{a.status}</span>
            </div>
            <h2 className="mt-4 truncate font-medium">{a.title}</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {new Date(a.createdAt).toLocaleDateString()}
            </p>
            <div className="mt-5 flex items-baseline justify-between">
              <span className="text-2xl font-semibold tabular-nums">
                {a.prediction.overall_score}
                <span className="text-sm text-muted-foreground">/100</span>
              </span>
              <span className="text-xs text-muted-foreground">
                {formatNumber(a.prediction.estimated_view_min)} –{" "}
                {formatNumber(a.prediction.estimated_view_max)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
