import type { Analysis, Recommendation } from "../types";

export interface RecommendationService {
  readonly id: string;
  generate(analysis: Analysis): Promise<Recommendation[]>;
}

export const mockRecommendationService: RecommendationService = {
  id: "mock",
  async generate(analysis) {
    return [...analysis.recommendations].sort(
      (a, b) => severityRank(b.severity) - severityRank(a.severity),
    );
  },
};

export function severityRank(severity: Recommendation["severity"]) {
  return severity === "high" ? 3 : severity === "medium" ? 2 : 1;
}

export const recommendationService: RecommendationService = mockRecommendationService;
