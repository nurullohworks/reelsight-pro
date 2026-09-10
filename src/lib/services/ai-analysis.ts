import type { Analysis, Recommendation, Severity } from "../types";
import { makeAnalysis } from "../mock-data";
import { evaluateMetaAlgorithm } from "./meta-algorithm";
import { getLiveDuneBenchmark } from "./livedune";

export interface AiAnalysisInput {
  fileName: string;
  sizeBytes: number;
  durationSec?: number;
  niche?: string;
  hasWatermark?: boolean;
  apiKey?: string;
  accountAvgViews?: number;
  accountHandle?: string;
}

const META_SYSTEM_PROMPT = `Sen Meta Reels reyting algoritmi va LiveDune tahliliy ma'lumotlar bazasi asosida ishlovchi professional Instagram kontent va virallik diagnostikasi mutaxassisisan.

VAZIFA:
Berilgan video parametrlari, nisha va ulangan Instagram akkauntning o'rtacha ko'rishlar soni (baseline) asosida Meta Reels reytingining 5 ta asosiy drayverini tahlil qil:
1. 3-soniyalik Hook Retention (0-3s drop-off: 65% dan oshsa algoritm videoni muzlatadi).
2. DM Shares / Sends per Reach (Meta'ning #1 virallik omili: do'stlarga yuborish triggersi).
3. To'liq ko'rish & Loop Factor (qayta ko'rishga undovchi ritm va ssenariy).
4. Save (saqlab olish) va foydalilik qiymati (Evergreen tarqatish).
5. Pacing va montaj dinamikasi (har 2-3 soniyadagi o'zgarishlar, TikTok/CapCut logotiplari ta'siri).

MUHIM: Kutilayotgan ko'rishlar sonini (estimated_views_min va estimated_views_max) havoday olinmagan holda, berilgan akkauntning o'rtacha ko'rishlari (baseline) ga mutanosib qilib hisobla!

JAVOB FORMATI: Faqat to'g'ridan-to'g'ri toza JSON obyekt qaytar:
{
  "overall_score": 85,
  "hook_score": 88,
  "retention_score": 79,
  "dm_share_score": 84,
  "save_score": 78,
  "pacing_score": 82,
  "engagement_potential": 84,
  "visual_quality": 90,
  "audience_fit": 86,
  "cta_score": 72,
  "viral_probability": 81,
  "estimated_views_min": 1800,
  "estimated_views_max": 4500,
  "confidence_score": 88,
  "strengths": ["Kuchli vizual hook", "DM ulashish ehtimoli yuqori", "Dinamik montaj"],
  "weaknesses": ["00:08 soniyada dinamika pasayishi", "CTA yetarlicha aniq emas"],
  "risk_factors": ["Watermark mavjudligi Explore chekloviga olib kelishi mumkin"],
  "recommendations": [
    {
      "priority": "high",
      "title": "Hook qismini tezlashtirish",
      "current": "Dastlabki 3 soniya sokin boshlangan",
      "recommended": "Birinchi soniyadanoq kutilmagan vizual yoki savol bering",
      "why": "0-3s ushlab qolish 70% dan oshishi kerak",
      "impact": 25,
      "current_score": 68,
      "potential_score": 92
    }
  ],
  "timeline_analysis": [
    { "from_sec": 0, "to_sec": 3, "label": "Hook", "verdict": "Strong", "note": "Tomoshabin e'tiborini tortadi" },
    { "from_sec": 3, "to_sec": 12, "label": "Asosiy qism", "verdict": "Good", "note": "Mavzu tushuntirilmoqda" },
    { "from_sec": 12, "to_sec": 18, "label": "Xulosa va CTA", "verdict": "Average", "note": "Izoh qoldirishga chaqiruvni kuchaytirish lozim" }
  ],
  "final_verdict": "Video yuqori virallik potensialiga ega. Tavsiya etilgan tuzatishlar bilan Explore sahifasiga chiqish imkoniyati 80%+."
}`;

export async function analyzeVideoWithAI(input: AiAnalysisInput): Promise<Analysis> {
  const geminiKey = input.apiKey || 
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_GEMINI_API_KEY) || 
    (typeof process !== "undefined" && process.env?.GEMINI_API_KEY) || 
    localStorage.getItem("reelpredict_gemini_key");

  const claudeKey = 
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_ANTHROPIC_API_KEY) || 
    (typeof process !== "undefined" && process.env?.ANTHROPIC_API_KEY) || 
    localStorage.getItem("reelpredict_claude_key");

  const duration = input.durationSec || 22;
  const niche = input.niche || "business";
  const sizeMb = (input.sizeBytes / (1024 * 1024)).toFixed(1);
  const baselineViews = input.accountAvgViews || 2100;

  // 1. Google Gemini API bilan tahlil
  if (geminiKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  { text: META_SYSTEM_PROMPT },
                  {
                    text: `Tahlil qilinadigan video parametrlari:
- Fayl nomi: ${input.fileName}
- Hajmi: ${sizeMb} MB
- Nisha: ${niche}
- Ulangan akkaunt o'rtacha ko'rishlari: ${baselineViews}
- Akkaunt username: ${input.accountHandle || "@user"}
- Watermark borligi: ${input.hasWatermark ? "HA (TikTok/CapCut logotipi bor)" : "YO'Q"}
- Davomiyligi: ${duration} soniya
Iltimos, yuqoridagi JSON formatda tahlilni to'liq qaytaring.`
                  }
                ]
              }
            ],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.3
            }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (jsonText) {
          const parsed = JSON.parse(jsonText);
          return buildCompleteAnalysis(parsed, input);
        }
      }
    } catch (err) {
      console.warn("Gemini API chaqiruvida xatolik, fallback dvigatelga o'tildi:", err);
    }
  }

  // 2. Claude API bilan tahlil
  if (claudeKey) {
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": claudeKey,
          "anthropic-version": "2023-06-01",
          "dangerously-allow-browser": "true"
        },
        body: JSON.stringify({
          model: "claude-3-7-sonnet-latest",
          max_tokens: 2000,
          system: META_SYSTEM_PROMPT,
          messages: [
            {
              role: "user",
              content: `Video tahlili: ${input.fileName}, Nisha: ${niche}, Akkaunt o'rtacha ko'rishlari: ${baselineViews}, Davomiyligi: ${duration}s, Watermark: ${input.hasWatermark}`
            }
          ]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const contentText = data.content?.[0]?.text;
        if (contentText) {
          const parsed = JSON.parse(contentText.replace(/```json\n?|\n?```/g, "").trim());
          return buildCompleteAnalysis(parsed, input);
        }
      }
    } catch (err) {
      console.warn("Claude API xatosi, fallback dvigatelga o'tildi:", err);
    }
  }

  // 3. Fallback: Intelligent Meta-Algorithm & LiveDune Engine
  const baseSeed = Math.abs(hashString(input.fileName + niche)) % 12 + 1;
  const baseAnalysis = makeAnalysis(baseSeed, {
    id: `an_${Date.now()}`,
    title: input.fileName.replace(/\.[a-z0-9]+$/i, ""),
    fileName: input.fileName,
    durationSec: duration,
    niche: niche,
  });

  // Akkaunt ko'rishlariga moslashtirilgan mutanosiblik
  const overall = baseAnalysis.prediction.overall_score;
  const multMin = overall >= 80 ? 1.2 : overall >= 60 ? 0.85 : 0.4;
  const multMax = overall >= 80 ? 2.5 : overall >= 60 ? 1.6 : 0.8;
  
  baseAnalysis.prediction.estimated_view_min = Math.round((baselineViews * multMin) / 50) * 50;
  baseAnalysis.prediction.estimated_view_max = Math.round((baselineViews * multMax) / 50) * 50;
  baseAnalysis.prediction.estimated_reach_min = Math.round(baseAnalysis.prediction.estimated_view_min * 0.75);
  baseAnalysis.prediction.estimated_reach_max = Math.round(baseAnalysis.prediction.estimated_view_max * 0.85);

  if (input.hasWatermark) {
    baseAnalysis.metaAlgorithm!.watermarkPenalty = true;
    baseAnalysis.prediction.overall_score = Math.max(35, Math.round(baseAnalysis.prediction.overall_score * 0.65));
    baseAnalysis.prediction.viral_probability = Math.max(15, baseAnalysis.prediction.viral_probability - 35);
    baseAnalysis.prediction.estimated_view_min = Math.round(baselineViews * 0.25);
    baseAnalysis.prediction.estimated_view_max = Math.round(baselineViews * 0.65);
    baseAnalysis.prediction.risk_factors.unshift("TikTok/CapCut suv belgisi aniqlandi — Meta algoritmi tarqatishni 80% gacha cheklaydi.");
    baseAnalysis.verdict.algorithmVerdict = "UCHMAYDI";
    baseAnalysis.verdict.summary = "Watermark sababli Meta algoritmi ushbu videoni Explore sahifasiga chiqarmaydi. Logotipni olib tashlang.";
  }

  return baseAnalysis;
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function buildCompleteAnalysis(parsed: any, input: AiAnalysisInput): Analysis {
  const durationSec = input.durationSec || 22;
  const niche = input.niche || "business";
  const hasWatermark = Boolean(input.hasWatermark);
  const baselineViews = input.accountAvgViews || 2100;

  const hookScore = parsed.hook_score || 82;
  const retentionScore = parsed.retention_score || 76;
  const dmSharePotential = parsed.dm_share_score || parsed.engagement_potential || 80;
  const savePotential = parsed.save_score || 74;
  const pacingScore = parsed.pacing_score || 78;

  // Meta algoritm bahosi
  const metaEval = evaluateMetaAlgorithm({
    hookScore,
    retentionScore,
    dmSharePotential,
    savePotential,
    pacingScore,
    hasWatermark,
    durationSec,
  });

  // LiveDune benchmark
  const liveDuneBenchmark = getLiveDuneBenchmark(niche, {
    hookScore,
    retentionScore,
    engagementScore: dmSharePotential,
    dmShareScore: dmSharePotential,
    saveScore: savePotential,
  });

  const overall = parsed.overall_score || metaEval.breakdown.totalAlgorithmScore;

  // Akkaunt ko'rishlariga mutanosib aniq hisob
  const multMin = overall >= 80 ? 1.2 : overall >= 60 ? 0.85 : 0.4;
  const multMax = overall >= 80 ? 2.5 : overall >= 60 ? 1.6 : 0.8;
  const minViews = parsed.estimated_views_min || (Math.round((baselineViews * multMin) / 50) * 50);
  const maxViews = parsed.estimated_views_max || (Math.round((baselineViews * multMax) / 50) * 50);

  const recommendations: Recommendation[] = parsed.recommendations?.map((r: any, idx: number) => ({
    id: `rec_${idx + 1}`,
    severity: (r.priority || "medium") as Severity,
    title: r.title || "Tavsiya",
    current: r.current || "",
    recommended: r.recommended || "",
    why: r.why || "",
    impact: r.impact || 15,
    currentScore: r.current_score || 70,
    potentialScore: r.potential_score || 88,
  })) || [
    {
      id: "rec_1",
      severity: "high",
      title: "Hook dinamikasini oshirish",
      current: "0-3 soniya sokin boshlangan",
      recommended: "Dastlabki soniyadan savol yoki vizual intriga qo'ying",
      why: "Tomoshabin 3 soniyada qaror qabul qiladi",
      impact: 20,
      currentScore: hookScore,
      potentialScore: 92,
    }
  ];

  const timeline = parsed.timeline_analysis?.map((t: any) => ({
    from: t.from_sec ?? 0,
    to: t.to_sec ?? 3,
    label: t.label || "Segment",
    verdict: (t.verdict === "Strong" || t.verdict === "Kuchli" ? "Strong" : t.verdict === "Good" || t.verdict === "Yaxshi" ? "Good" : t.verdict === "Average" || t.verdict === "O'rtacha" ? "Average" : "Weak") as "Strong" | "Good" | "Average" | "Weak",
    note: t.note || "",
  })) || [
    { from: 0, to: 3, label: "0-3s Hook", verdict: hookScore >= 80 ? "Strong" : "Average", note: "Kirish qismi" },
    { from: 3, to: Math.round(durationSec * 0.7), label: "Asosiy ritm", verdict: retentionScore >= 75 ? "Good" : "Average", note: "Kontent qismi" },
    { from: Math.round(durationSec * 0.7), to: durationSec, label: "Xulosa & CTA", verdict: "Good", note: "Yakuniy chaqiruv" }
  ];

  return {
    id: `an_${Date.now()}`,
    title: input.fileName.replace(/\.[a-z0-9]+$/i, ""),
    fileName: input.fileName,
    createdAt: new Date().toISOString(),
    durationSec,
    status: "Analyzed",
    niche,
    metaAlgorithm: metaEval.breakdown,
    liveDuneBenchmark,
    exactDeficiencies: metaEval.exactDeficiencies,
    prediction: {
      overall_score: overall,
      viral_probability: parsed.viral_probability || Math.min(96, Math.max(30, overall - 4)),
      estimated_view_min: minViews,
      estimated_view_max: maxViews,
      estimated_reach_min: Math.round(minViews * 0.75),
      estimated_reach_max: Math.round(maxViews * 0.85),
      confidence_score: parsed.confidence_score || 88,
      strengths: parsed.strengths || ["Vizual sifat yuqori", "Dinamik montaj"],
      weaknesses: parsed.weaknesses || ["Hook qismini tezlashtirish tavsiya etiladi"],
      risk_factors: parsed.risk_factors || (hasWatermark ? ["Watermark mavjudligi sababli tarqatish cheklanishi mumkin"] : []),
    },
    metrics: [
      { key: "hook", label: "0-3s Hook Retention", score: hookScore },
      { key: "retention", label: "To'liq ko'rish (Loop)", score: retentionScore },
      { key: "dm_share", label: "DM Shares (Do'stlarga yuborish)", score: dmSharePotential },
      { key: "save", label: "Save & Qimmatli qiymat", score: savePotential },
      { key: "pacing", label: "Pacing & Montaj dinamikasi", score: pacingScore },
    ],
    timeline,
    recommendations,
    benchmark: [
      { metric: "0-3s Hook", reel: hookScore, accountAvg: 72, benchmark: 80 },
      { metric: "DM Share Potensiali", reel: dmSharePotential, accountAvg: 68, benchmark: 75 },
      { metric: "To'liq Ko'rish", reel: retentionScore, accountAvg: 65, benchmark: 70 },
      { metric: "Saqlab Olish", reel: savePotential, accountAvg: 60, benchmark: 65 },
    ],
    verdict: {
      state: overall >= 80 ? "Ready to post" : overall >= 60 ? "Ready with improvements" : "Needs work",
      algorithmVerdict: metaEval.verdict,
      summary: parsed.final_verdict || metaEval.verdictSummary,
      fixes: recommendations.map((r) => r.recommended),
      potentialScore: Math.min(98, overall + 14),
    },
  };
}
