/**
 * Shared contract for Reel intelligence providers.
 *
 * This module is client-safe: it only contains types and pure mappers, so both
 * the browser and the server can import it. Concrete providers (Claude today,
 * LiveDune / Instagram Graph later) implement `ReelIntelligenceProvider` and are
 * wired in `src/lib/services/index.ts` — adding a new signal source must not
 * require rewriting the Claude integration.
 */
import type { Analysis, MetricScore, Recommendation, TimelineSegment } from "../types";

export interface ReelVideoMetadata {
  fileName: string;
  sizeBytes: number;
  mimeType?: string;
  durationSec?: number;
  width?: number;
  height?: number;
  caption?: string;
  contentCategory?: string;
  language?: string;
}

/** Optional Instagram account context (LiveDune / Meta providers will fill this later). */
export interface ReelAccountContext {
  handle?: string;
  followers?: number;
  avgReelViews?: number;
  avgEngagement?: number;
  niche?: string;
}

/** Optional history of previously published Reels. */
export interface ReelPreviousPerformance {
  title?: string;
  views?: number;
  engagementRate?: number;
  postedAt?: string;
}

export interface AnalyzeReelInput {
  /** Storage object path inside the private `reel-videos` bucket. */
  videoPath?: string;
  /** Or a direct/signed URL reference to the uploaded video. */
  videoUrl?: string;
  metadata: ReelVideoMetadata;
  account?: ReelAccountContext;
  previousPerformance?: ReelPreviousPerformance[];
  /** Local device key used to scope stored analyses. */
  ownerKey?: string;
}

export interface ClaudeTimelineSegment {
  from_sec: number;
  to_sec: number;
  label: string;
  verdict: "Kuchli" | "Yaxshi" | "O'rtacha" | "Zaif" | string;
  note?: string;
}

export interface ClaudeRecommendation {
  priority: "high" | "medium" | "low" | string;
  title: string;
  current: string;
  recommended: string;
  why: string;
  impact: number;
  current_score: number;
  potential_score: number;
}

/** Exact JSON shape returned by the `analyze-reel` backend function. */
export interface ReelAnalysisJson {
  overall_score: number;
  hook_score: number;
  retention_score: number;
  engagement_potential: number;
  visual_quality: number;
  audience_fit: number;
  cta_score: number;
  storytelling_score: number;
  originality_score?: number;
  viral_probability: number;
  estimated_views_min: number;
  estimated_views_max: number;
  confidence_score: number;
  strengths: string[];
  weaknesses: string[];
  risk_factors: string[];
  recommendations: ClaudeRecommendation[];
  timeline_analysis: ClaudeTimelineSegment[];
  final_verdict: string;
}

export interface AnalyzeReelResult {
  analysis: ReelAnalysisJson;
  provider: "claude" | "mock";
  model?: string;
  storedId?: string;
  /** Set when the live provider was unavailable and demo mode was used. */
  fallbackReason?: string;
}

export interface ReelIntelligenceProvider {
  readonly id: string;
  analyze(input: AnalyzeReelInput): Promise<AnalyzeReelResult>;
}

const clamp = (n: unknown, min = 0, max = 100) => {
  const v = typeof n === "number" && Number.isFinite(n) ? n : 0;
  return Math.max(min, Math.min(max, Math.round(v)));
};

const SEVERITY: Record<string, Recommendation["severity"]> = {
  high: "high",
  medium: "medium",
  low: "low",
};

const VERDICT: Record<string, TimelineSegment["verdict"]> = {
  kuchli: "Strong",
  yaxshi: "Good",
  "o'rtacha": "Average",
  ortacha: "Average",
  zaif: "Weak",
  strong: "Strong",
  good: "Good",
  average: "Average",
  weak: "Weak",
};

/** Maps the provider JSON into the app's existing `Analysis` shape (UI unchanged). */
export function toAnalysis(
  json: ReelAnalysisJson,
  input: { fileName: string; durationSec?: number; accountAvgViews?: number },
): Analysis {
  const metrics: MetricScore[] = [
    { key: "hook", label: "Hook kuchi", score: clamp(json.hook_score) },
    { key: "retention", label: "Ushlab qolish", score: clamp(json.retention_score) },
    { key: "engagement", label: "Faollik salohiyati", score: clamp(json.engagement_potential) },
    { key: "visual", label: "Vizual sifat", score: clamp(json.visual_quality) },
    { key: "cta", label: "CTA kuchi", score: clamp(json.cta_score) },
    { key: "audience", label: "Auditoriyaga mosligi", score: clamp(json.audience_fit) },
    { key: "originality", label: "Original'lik", score: clamp(json.originality_score ?? json.storytelling_score) },
    { key: "storytelling", label: "Hikoya qilish", score: clamp(json.storytelling_score) },
  ];

  const viewsMin = Math.max(0, Math.round(json.estimated_views_min || 0));
  const viewsMax = Math.max(viewsMin, Math.round(json.estimated_views_max || 0));
  const overall = clamp(json.overall_score);
  const accountAvg = input.accountAvgViews ?? Math.round((viewsMin + viewsMax) / 2);

  const timeline: TimelineSegment[] = (json.timeline_analysis ?? []).map((seg) => ({
    from: Math.max(0, Math.round(seg.from_sec ?? 0)),
    to: Math.max(0, Math.round(seg.to_sec ?? 0)),
    label: seg.label ?? "",
    verdict: VERDICT[String(seg.verdict ?? "").toLowerCase()] ?? "Average",
    ...(seg.note ? { note: seg.note } : {}),
  }));

  const recommendations: Recommendation[] = (json.recommendations ?? []).map((rec, i) => ({
    id: `rec_${i + 1}`,
    severity: SEVERITY[String(rec.priority ?? "").toLowerCase()] ?? "medium",
    title: rec.title ?? "",
    current: rec.current ?? "",
    recommended: rec.recommended ?? "",
    why: rec.why ?? "",
    impact: clamp(rec.impact, 0, 40),
    currentScore: clamp(rec.current_score),
    potentialScore: clamp(rec.potential_score),
  }));

  const potentialScore = Math.min(
    100,
    Math.max(overall, ...recommendations.map((r) => r.potentialScore), overall),
  );

  const state: Analysis["verdict"]["state"] =
    overall >= 80 ? "Ready to post" : overall >= 60 ? "Ready with improvements" : "Needs work";

  return {
    id: `an_${Date.now()}`,
    title: input.fileName.replace(/\.[a-z0-9]+$/i, ""),
    fileName: input.fileName,
    createdAt: new Date().toISOString(),
    durationSec: Math.round(input.durationSec ?? timeline.at(-1)?.to ?? 30),
    status: "Analyzed",
    prediction: {
      overall_score: overall,
      viral_probability: clamp(json.viral_probability),
      estimated_view_min: viewsMin,
      estimated_view_max: viewsMax,
      estimated_reach_min: Math.round(viewsMin * 0.82),
      estimated_reach_max: Math.round(viewsMax * 0.86),
      confidence_score: clamp(json.confidence_score),
      strengths: json.strengths ?? [],
      weaknesses: json.weaknesses ?? [],
      risk_factors: json.risk_factors ?? [],
    },
    metrics,
    timeline,
    recommendations,
    benchmark: [
      {
        metric: "Ko'rishlar",
        reel: Math.round((viewsMin + viewsMax) / 2),
        accountAvg,
        benchmark: Math.round(accountAvg * 1.15),
      },
      {
        metric: "Faollik",
        reel: clamp(json.engagement_potential),
        accountAvg: Math.round(clamp(json.engagement_potential) * 0.86),
        benchmark: Math.round(clamp(json.engagement_potential) * 0.95),
      },
      {
        metric: "Hook",
        reel: clamp(json.hook_score),
        accountAvg: Math.round(clamp(json.hook_score) * 0.88),
        benchmark: Math.round(clamp(json.hook_score) * 0.94),
      },
    ],
    verdict: {
      state,
      summary: json.final_verdict ?? "",
      fixes: recommendations.filter((r) => r.severity !== "low").slice(0, 3).map((r) => r.title),
      potentialScore,
    },
  };
}
