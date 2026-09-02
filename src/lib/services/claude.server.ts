/**
 * Server-only Claude (Anthropic) provider for Reel analysis.
 * The API key never leaves this module — it is read inside handlers only.
 */
import type {
  AnalyzeReelInput,
  ReelAnalysisJson,
} from "./reel-intelligence";

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";

/** Active Claude models (Sept 2026). First is used; the rest are fallbacks if a model id is retired. */
const MODEL_CANDIDATES = ["claude-sonnet-4-5", "claude-opus-4-1", "claude-3-7-sonnet-latest"];

export const SYSTEM_PROMPT = `Sen professional Instagram kontent analitigi va Reels samaradorligi bo'yicha mutaxassissan.

VAZIFA
Senga Reel haqidagi metadata, ixtiyoriy Instagram akkaunt konteksti va ixtiyoriy oldingi natijalar beriladi.
Ularni professional analitik sifatida baholab, quyidagilarni tahlil qilasan:
- birinchi 1-3 soniya
- hook (diqqatni ushlash)
- pacing (sur'at)
- sahna almashinuvlari
- storytelling (hikoya tuzilmasi)
- vizual sifat
- audio
- ekrandagi matnlar (text overlay)
- CTA
- kontent aniqligi
- auditoriyaga mosligi
- ushlab qolish (retention) risklari
- faollik (engagement) salohiyati
- original'lik
- ehtimoliy zaif tomonlar

MUHIM CHEKLOVLAR
- Sen Meta yoki Instagram'ning yopiq reyting algoritmiga kirish huquqiga EGA EMASSAN va bunday da'vo qilishing MUMKIN EMAS.
- Barcha bashoratlar taxmin sifatida ifodalanadi: "Instagram performance signals asosida taxmin".
- "Meta algoritmi aniq shuni aytdi" kabi iboralarni ISHLATMA.
- Ma'lumot yetishmasa, taxminni pasaytirilgan confidence_score bilan ber va buni weaknesses yoki risk_factors ichida ayt.

TIL
Barcha foydalanuvchiga ko'rinadigan matnlar TABIIY O'ZBEK TILIDA (lotin alifbosi) bo'lishi shart.
Kalitlar (JSON key) ingliz tilida qoladi.

CHIQISH FORMATI
Faqat JSON obyekt qaytar. Hech qanday izoh, markdown yoki matn qo'shma. Shakl:
{
  "overall_score": 0-100,
  "hook_score": 0-100,
  "retention_score": 0-100,
  "engagement_potential": 0-100,
  "visual_quality": 0-100,
  "audience_fit": 0-100,
  "cta_score": 0-100,
  "storytelling_score": 0-100,
  "originality_score": 0-100,
  "viral_probability": 0-100,
  "estimated_views_min": butun son,
  "estimated_views_max": butun son,
  "confidence_score": 0-100,
  "strengths": ["..."],
  "weaknesses": ["..."],
  "risk_factors": ["..."],
  "recommendations": [
    {
      "priority": "high" | "medium" | "low",
      "title": "...",
      "current": "...",
      "recommended": "...",
      "why": "...",
      "impact": 0-40,
      "current_score": 0-100,
      "potential_score": 0-100
    }
  ],
  "timeline_analysis": [
    { "from_sec": 0, "to_sec": 3, "label": "...", "verdict": "Kuchli" | "Yaxshi" | "O'rtacha" | "Zaif", "note": "..." }
  ],
  "final_verdict": "..."
}
strengths, weaknesses, risk_factors: 3-5 tadan. recommendations: 3-5 ta. timeline_analysis: video davomiyligini qoplaydigan 4-6 segment.`;

function buildUserPrompt(input: AnalyzeReelInput) {
  return [
    "Quyidagi Reel'ni tahlil qil va faqat JSON qaytar.",
    "",
    "VIDEO METADATA:",
    JSON.stringify(input.metadata, null, 2),
    "",
    "VIDEO MANBASI:",
    JSON.stringify({ videoPath: input.videoPath ?? null, videoUrl: input.videoUrl ?? null }),
    "",
    "INSTAGRAM AKKAUNT KONTEKSTI (ixtiyoriy):",
    JSON.stringify(input.account ?? null, null, 2),
    "",
    "OLDINGI NATIJALAR (ixtiyoriy):",
    JSON.stringify(input.previousPerformance ?? null, null, 2),
  ].join("\n");
}

function extractJson(text: string): ReelAnalysisJson {
  const cleaned = text.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("Claude JSON qaytarmadi");
  return JSON.parse(cleaned.slice(start, end + 1)) as ReelAnalysisJson;
}

export interface ClaudeCallResult {
  analysis: ReelAnalysisJson;
  model: string;
}

export async function analyzeWithClaude(
  input: AnalyzeReelInput,
  apiKey: string,
): Promise<ClaudeCallResult> {
  const configured = process.env["ANTHROPIC_MODEL"];
  const models = configured ? [configured, ...MODEL_CANDIDATES] : MODEL_CANDIDATES;

  let lastError: unknown;
  for (const model of models) {
    const res = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": ANTHROPIC_VERSION,
      },
      body: JSON.stringify({
        model,
        max_tokens: 4000,
        temperature: 0.4,
        system: SYSTEM_PROMPT,
        messages: [
          { role: "user", content: buildUserPrompt(input) },
          { role: "assistant", content: "{" },
        ],
      }),
    });

    if (res.status === 404 || res.status === 400) {
      lastError = new Error(`Model ${model}: ${res.status}`);
      continue;
    }
    if (!res.ok) {
      throw new Error(`Anthropic API xatosi: ${res.status}`);
    }

    const payload = (await res.json()) as { content?: { type: string; text?: string }[] };
    const text = (payload.content ?? [])
      .filter((part) => part.type === "text")
      .map((part) => part.text ?? "")
      .join("");
    return { analysis: extractJson(`{${text}`), model };
  }

  throw (lastError instanceof Error ? lastError : new Error("Claude modeli topilmadi"));
}

export async function saveAnalysis(row: {
  ownerKey: string;
  fileName: string;
  videoPath?: string | undefined;
  metadata: unknown;
  account?: unknown;
  previousPerformance?: unknown;
  result: unknown;
  provider: string;
  model?: string | undefined;
}): Promise<string | undefined> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("reel_analyses")
      .insert({
        owner_key: row.ownerKey,
        file_name: row.fileName,
        video_path: row.videoPath ?? null,
        video_metadata: row.metadata as never,
        account_data: (row.account ?? null) as never,
        previous_performance: (row.previousPerformance ?? null) as never,
        result: row.result as never,
        provider: row.provider,
        model: row.model ?? null,
      })
      .select("id")
      .single();
    if (error) throw error;
    return data?.id;
  } catch (error) {
    console.error("Tahlilni saqlashda xatolik:", error);
    return undefined;
  }
}
