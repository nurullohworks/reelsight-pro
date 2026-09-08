import type { Analysis } from "../types";
import { analyzeVideoWithAI, type AiAnalysisInput } from "./ai-analysis";

export interface VideoAnalysisInput extends AiAnalysisInput {}

export interface VideoAnalysisService {
  readonly id: string;
  analyze(input: VideoAnalysisInput): Promise<Analysis>;
}

export const aiVideoAnalysisService: VideoAnalysisService = {
  id: "gemini-claude-meta-engine",
  async analyze(input: VideoAnalysisInput) {
    return await analyzeVideoWithAI(input);
  },
};

export const videoAnalysisService: VideoAnalysisService = aiVideoAnalysisService;

export const ANALYSIS_STEPS = [
  "Video va kadrlar tahlil qilinmoqda",
  "0-3s Hook va retention ehtimoli tekshirilmoqda",
  "Meta algoritmi: DM Shares va Loop ko'rsatkichi baholanmoqda",
  "LiveDune sohaviy benchmarklari bilan solishtirilmoqda",
  "Xatoliklar va kamchiliklar aniqlanmoqda",
  "Algoritmik hukm va hisobot shakllantirilmoqda",
];