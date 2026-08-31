import { makeAnalysis } from "../mock-data";
import type { Analysis } from "../types";

export interface VideoAnalysisInput {
  fileName: string;
  sizeBytes: number;
  durationSec?: number;
}

export interface VideoAnalysisService {
  readonly id: string;
  analyze(input: VideoAnalysisInput): Promise<Analysis>;
}

/** Mock provider — replace with an AI provider behind a server function. */
export const mockVideoAnalysisService: VideoAnalysisService = {
  id: "mock",
  async analyze(input) {
    const seed = Math.floor(Math.random() * 12) + 1;
    const analysis = makeAnalysis(seed, {
      id: `an_${Date.now()}`,
      fileName: input.fileName,
      title: input.fileName.replace(/\.[a-z0-9]+$/i, ""),
      createdAt: new Date().toISOString(),
      status: "Analyzed",
    });
    return analysis;
  },
};

export const videoAnalysisService: VideoAnalysisService = mockVideoAnalysisService;

export const ANALYSIS_STEPS = [
  "Video qayta ishlanmoqda",
  "Vizual tahlil",
  "Audio tahlil",
  "Kontentni tushunish",
  "Akkaunt bilan solishtirish",
  "Samaradorlikni bashorat qilish",
  "Hisobot yaratish",
];
