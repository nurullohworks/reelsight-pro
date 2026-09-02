import { makeAnalysis } from "../mock-data";
import type { Analysis } from "../types";

export interface VideoAnalysisInput {
  fileName: string;
  sizeBytes: number;
  durationSec?: number;
  niche?: string;
  hasWatermark?: boolean;
}

export interface VideoAnalysisService {
  readonly id: string;
  analyze(input: VideoAnalysisInput): Promise<Analysis>;
}

/** Meta Algorithm & LiveDune engine provider */
export const mockVideoAnalysisService: VideoAnalysisService = {
  id: "meta-livedune-engine",
  async analyze(input) {
    const seed = Math.floor(Math.random() * 12) + 1;
    const analysis = makeAnalysis(seed, {
      id: `an_${Date.now()}`,
      fileName: input.fileName,
      title: input.fileName.replace(/\.[a-z0-9]+$/i, ""),
      createdAt: new Date().toISOString(),
      status: "Analyzed",
      niche: input.niche ?? "business",
    });
    return analysis;
  },
};

export const videoAnalysisService: VideoAnalysisService = mockVideoAnalysisService;

export const ANALYSIS_STEPS = [
  "Video va kadrlar tahlil qilinmoqda",
  "0-3s Hook va retention ehtimoli tekshirilmoqda",
  "Meta algoritmi: DM Shares va Loop ko'rsatkichi baholanmoqda",
  "LiveDune sohaviy benchmarklari bilan solishtirilmoqda",
  "Xatoliklar va kamchiliklar aniqlanmoqda",
  "Algoritmik hukm va hisobot shakllantirilmoqda",
];

