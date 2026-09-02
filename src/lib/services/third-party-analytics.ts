import { accuracyHistory } from "../mock-data";
import { LIVEDUNE_DATASET } from "./livedune";

export interface ThirdPartyAnalyticsService {
  readonly id: string;
  getAccuracyHistory(): Promise<{ label: string; accuracy: number }[]>;
  getBenchmark(category?: string): Promise<{ metric: string; value: number }[]>;
}

export const liveDuneAnalyticsService: ThirdPartyAnalyticsService = {
  id: "livedune",
  async getAccuracyHistory() {
    return accuracyHistory;
  },
  async getBenchmark(category = "business") {
    const data = LIVEDUNE_DATASET[category] || LIVEDUNE_DATASET["business"];
    return [
      { metric: "3s Hook Saqlanishi", value: data.benchmarks.hookRetention.top },
      { metric: "To'liq Ko'rish (Completion)", value: data.benchmarks.completionRate.top },
      { metric: "DM Share nisbati", value: Math.round(data.benchmarks.dmShareRatio.top * 10) },
      { metric: "Save (Saqlash)", value: Math.round(data.benchmarks.saveRatio.top * 10) },
      { metric: "ER by Reach", value: Math.round(data.top10ViralER * 10) },
      { metric: "Virallik Qamrovi", value: 88 },
    ];
  },
};

export const thirdPartyAnalyticsService: ThirdPartyAnalyticsService =
  liveDuneAnalyticsService;

