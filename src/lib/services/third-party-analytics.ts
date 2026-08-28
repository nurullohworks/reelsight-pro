import { accuracyHistory } from "../mock-data";

export interface ThirdPartyAnalyticsService {
  readonly id: string;
  getAccuracyHistory(): Promise<{ label: string; accuracy: number }[]>;
  getBenchmark(category: string): Promise<{ metric: string; value: number }[]>;
}

export const mockThirdPartyAnalyticsService: ThirdPartyAnalyticsService = {
  id: "mock",
  async getAccuracyHistory() {
    return accuracyHistory;
  },
  async getBenchmark() {
    return [
      { metric: "Hook", value: 86 },
      { metric: "Retention", value: 83 },
      { metric: "Engagement", value: 80 },
      { metric: "Shares", value: 74 },
      { metric: "Saves", value: 77 },
      { metric: "Views", value: 82 },
    ];
  },
};

export const thirdPartyAnalyticsService: ThirdPartyAnalyticsService =
  mockThirdPartyAnalyticsService;
