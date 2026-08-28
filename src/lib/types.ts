export type Severity = "high" | "medium" | "low";

export interface MetricScore {
  key: string;
  label: string;
  score: number;
}

export interface TimelineSegment {
  from: number;
  to: number;
  label: string;
  verdict: "Strong" | "Good" | "Average" | "Weak";
  note?: string;
}

export interface Recommendation {
  id: string;
  severity: Severity;
  title: string;
  current: string;
  recommended: string;
  why: string;
  impact: number;
  currentScore: number;
  potentialScore: number;
}

export interface PredictionResult {
  overall_score: number;
  viral_probability: number;
  estimated_view_min: number;
  estimated_view_max: number;
  estimated_reach_min: number;
  estimated_reach_max: number;
  confidence_score: number;
  strengths: string[];
  weaknesses: string[];
  risk_factors: string[];
}

export type AnalysisStatus = "Analyzed" | "Published" | "Tracking" | "Completed";

export interface Analysis {
  id: string;
  title: string;
  fileName: string;
  createdAt: string;
  durationSec: number;
  status: AnalysisStatus;
  prediction: PredictionResult;
  metrics: MetricScore[];
  timeline: TimelineSegment[];
  recommendations: Recommendation[];
  benchmark: { metric: string; reel: number; accountAvg: number; benchmark: number }[];
  actualViews?: number | undefined;
  verdict: {
    state: "Ready to post" | "Ready with improvements" | "Needs work";
    summary: string;
    fixes: string[];
    potentialScore: number;
  };
}

export interface AccountSnapshot {
  handle: string;
  followers: number;
  avgReelViews: number;
  avgEngagement: number;
  growth: number;
  consistency: number;
  viewsOverTime: { label: string; views: number; engagement: number }[];
  followerGrowth: { label: string; followers: number }[];
  topReels: { title: string; views: number; engagement: number }[];
  lowReels: { title: string; views: number; engagement: number }[];
  patterns: string[];
}

export type PlanId = "free" | "pro" | "agency";

export interface Subscription {
  plan: PlanId;
  status: "active" | "trialing" | "canceled";
  renewsAt: string;
  usedThisMonth: number;
  monthlyLimit: number;
  billingCycle: "monthly" | "yearly";
}
