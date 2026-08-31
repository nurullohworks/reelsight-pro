import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatNumber, useAppStore } from "@/lib/app-store";
import { predictionAccuracy } from "@/lib/services";
import type { AnalysisStatus } from "@/lib/types";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Tahlillar tarixi — REELPREDICT" },
      {
        name: "description",
        content: "Har bir tahlil qilingan Reels — ball, taxminiy ko'rishlar, haqiqiy ko'rishlar va bashorat aniqligi bilan.",
      },
      { property: "og:title", content: "Tahlillar tarixi — REELPREDICT" },
      { property: "og:description", content: "O'tgan Reels bashoratlaringizni qidiring, saralang va tekshiring." },
    ],
  }),
  component: History,
});

const statuses: (AnalysisStatus | "all")[] = ["all", "Analyzed", "Published", "Tracking", "Completed"];

const statusLabels: Record<string, string> = {
  Analyzed: "Tahlil qilingan",
  Published: "Nashr etilgan",
  Tracking: "Kuzatilmoqda",
  Completed: "Yakunlangan",
};

function History() {
  const { analyses } = useAppStore();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [sort, setSort] = useState("recent");

  const rows = useMemo(() => {
    let list = analyses.filter((a) => a.title.toLowerCase().includes(query.toLowerCase()));
    if (status !== "all") list = list.filter((a) => a.status === status);
    return [...list].sort((a, b) =>
      sort === "score"
        ? b.prediction.overall_score - a.prediction.overall_score
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [analyses, query, status, sort]);

  return (
    <AppShell>
      <h1 className="text-3xl font-semibold">Tahlillar tarixi</h1>
      <p className="mt-2 text-muted-foreground">
        Har bir tahlil, bashorat qilingan va haqiqiy samaradorlik bilan.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tahlillarni qidirish"
            className="pl-9"
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="sm:w-44">
            <SelectValue placeholder="Holat" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((s) => (
              <SelectItem key={s} value={s}>
                {s === "all" ? "Barcha holatlar" : statusLabels[s] ?? s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="sm:w-44">
            <SelectValue placeholder="Saralash" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Eng so'nggi</SelectItem>
            <SelectItem value="score">Eng yuqori ball</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="surface-card mt-5 overflow-x-auto">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[11px] uppercase tracking-widest text-muted-foreground">
              <th className="px-5 py-4 font-normal">Video</th>
              <th className="px-5 py-4 font-normal">Sana</th>
              <th className="px-5 py-4 font-normal">Ball</th>
              <th className="px-5 py-4 font-normal">Taxminiy ko'rishlar</th>
              <th className="px-5 py-4 font-normal">Haqiqiy ko'rishlar</th>
              <th className="px-5 py-4 font-normal">Aniqlik</th>
              <th className="px-5 py-4 font-normal">Holat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((a) => {
              const acc = predictionAccuracy(a);
              return (
                <tr key={a.id} className="transition-colors hover:bg-muted/40">
                  <td className="px-5 py-4">
                    <Link to="/reports/$id" params={{ id: a.id }} className="hover:text-primary">
                      {a.title}
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">
                    {new Date(a.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 tabular-nums">{a.prediction.overall_score}</td>
                  <td className="px-5 py-4 tabular-nums text-muted-foreground">
                    {formatNumber(a.prediction.estimated_view_min)} –{" "}
                    {formatNumber(a.prediction.estimated_view_max)}
                  </td>
                  <td className="px-5 py-4 tabular-nums">
                    {a.actualViews ? formatNumber(a.actualViews) : "—"}
                  </td>
                  <td className="px-5 py-4">{acc ? acc.label : "—"}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full border border-border px-2.5 py-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                      {statusLabels[a.status] ?? a.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
