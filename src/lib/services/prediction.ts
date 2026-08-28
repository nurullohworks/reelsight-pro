import type { Analysis, MetricScore, PredictionResult } from "../types";

/**
 * Prediction engine input contract:
 * video features + account features + historical performance +
 * available Instagram signals + audience data + content category +
 * previous prediction accuracy.
 */
export interface PredictionInput {
  videoFeatures: MetricScore[];
  accountAvgViews: number;
  accountEngagement: number;
  historicalAccuracy: number;
  contentCategory?: string;
}

export interface PredictionService {
  readonly id: string;
  predict(input: PredictionInput): Promise<PredictionResult>;
}

function weightedScore(metrics: MetricScore[]) {
  const weights: Record<string, number> = {
    hook: 0.22,
    retention: 0.2,
    engagement: 0.16,
    visual: 0.1,
    audience: 0.14,
    cta: 0.06,
    originality: 0.06,
    story: 0.06,
  };
  const total = metrics.reduce((acc, m) => acc + (weights[m.key] ?? 0.05) * m.score, 0);
  const norm = metrics.reduce((acc, m) => acc + (weights[m.key] ?? 0.05), 0);
  return Math.round(total / Math.max(norm, 0.0001));
}

export const mockPredictionService: PredictionService = {
  id: "mock",
  async predict(input) {
    const score = weightedScore(input.videoFeatures);
    const multiplier = 0.6 + (score / 100) * 1.4;
    const min = Math.round((input.accountAvgViews * multiplier * 0.8) / 100) * 100;
    const max = Math.round((input.accountAvgViews * multiplier * 1.9) / 100) * 100;
    return {
      overall_score: score,
      viral_probability: Math.min(95, Math.round(score * 0.92)),
      estimated_view_min: min,
      estimated_view_max: max,
      estimated_reach_min: Math.round(min * 0.68),
      estimated_reach_max: Math.round(max * 0.74),
      confidence_score: Math.round(60 + input.historicalAccuracy * 0.2),
      strengths: [],
      weaknesses: [],
      risk_factors: [],
    };
  },
};

export const predictionService: PredictionService = mockPredictionService;

export function predictionAccuracy(analysis: Analysis) {
  if (!analysis.actualViews) return null;
  const { estimated_view_min: min, estimated_view_max: max } = analysis.prediction;
  const inRange = analysis.actualViews >= min && analysis.actualViews <= max;
  const mid = (min + max) / 2;
  const deviation = Math.abs(analysis.actualViews - mid) / mid;
  return {
    inRange,
    label: inRange ? "High" : deviation < 0.5 ? "Medium" : "Low",
    percent: Math.max(20, Math.round((1 - Math.min(deviation, 1)) * 100)),
  };
}
