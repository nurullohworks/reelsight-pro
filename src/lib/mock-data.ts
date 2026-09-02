import type { AccountSnapshot, Analysis } from "./types";

// Fixed base date keeps mock timestamps identical on server and client (no hydration drift).
const BASE_TIME = Date.parse("2026-02-02T09:00:00.000Z");

const titles = [
  "Skrollashni to‘xtatuvchi 3 ta hook",
  "20 soniyada montaj ish jarayoni",
  "Nega qamrovingiz tushib ketdi",
  "Mijozlarni jalb qilish tahlili",
  "Byudjetli studiya yorug‘ligi",
  "Sahna ortida: startap kuni",
];

import { evaluateMetaAlgorithm } from "./services/meta-algorithm";
import { getLiveDuneBenchmark } from "./services/livedune";

export function makeAnalysis(seed = 0, overrides: Partial<Analysis> = {}): Analysis {
  const rnd = (n: number, spread: number) => Math.round(n + ((seed * 37) % spread) - spread / 2);
  const hookScore = Math.min(98, Math.max(52, rnd(84, 22)));
  const retentionScore = Math.min(95, Math.max(48, rnd(78, 24)));
  const dmShareScore = Math.min(96, Math.max(45, rnd(82, 28)));
  const saveScore = Math.min(95, Math.max(40, rnd(74, 26)));
  const pacingScore = Math.min(94, Math.max(50, rnd(80, 20)));
  const durationSec = 21 + (seed % 10);
  const niche = overrides.niche ?? (["business", "education", "tech", "ecommerce", "lifestyle", "entertainment"][seed % 6]!);

  const metaEval = evaluateMetaAlgorithm({
    hookScore,
    retentionScore,
    dmSharePotential: dmShareScore,
    savePotential: saveScore,
    pacingScore,
    hasWatermark: overrides.metaAlgorithm?.watermarkPenalty ?? false,
    durationSec,
  });

  const liveDuneBenchmark = getLiveDuneBenchmark(niche, {
    hookScore,
    retentionScore,
    engagementScore: dmShareScore,
    dmShareScore,
    saveScore,
  });

  const overall = metaEval.breakdown.totalAlgorithmScore;
  const minViews = 1000 * Math.max(6, Math.round(overall * 0.28));
  const maxViews = minViews * 2.5;

  return {
    id: `an_${1000 + seed}`,
    title: titles[seed % titles.length]!,
    fileName: `reel-${1000 + seed}.mp4`,
    createdAt: new Date(BASE_TIME - seed * 86400000 * 2).toISOString(),
    durationSec,
    status: (["Analyzed", "Published", "Tracking", "Completed"] as const)[seed % 4]!,
    niche,
    metaAlgorithm: metaEval.breakdown,
    liveDuneBenchmark,
    exactDeficiencies: metaEval.exactDeficiencies,
    prediction: {
      overall_score: overall,
      viral_probability: Math.min(96, Math.max(30, overall - 4)),
      estimated_view_min: minViews,
      estimated_view_max: Math.round(maxViews),
      estimated_reach_min: Math.round(minViews * 0.72),
      estimated_reach_max: Math.round(maxViews * 0.82),
      confidence_score: 82,
      strengths: [
        "Hook birinchi 1.4 soniyada ishlaydi va drop-offni pasaytiradi",
        "DM orqali ulashish (Share trigger) yuqori salohiyatga ega",
        "Mavzu tanlangan nisha auditoriyasiga to'liq mos keladi",
      ],
      weaknesses: [
        "O‘rta qismida dinamika pasayishi (drop-off xavfi)",
        "Oxirgi soniyalarda aniq Save/Share chaqiruvi sust",
      ],
      risk_factors: [
        "12s va 15s orasida vizual bir xillik sababli e'tibor susayishi",
        "Matn qatlami zichligi akkaunt o‘rtachasidan yuqori",
      ],
    },
    metrics: [
      { key: "hook", label: "3s Hook kuchi", score: hookScore },
      { key: "retention", label: "Ushlab turish & Loop", score: retentionScore },
      { key: "engagement", label: "DM Shares & Ulashish", score: dmShareScore },
      { key: "visual", label: "Vizual dinamika", score: Math.min(98, hookScore + 2) },
      { key: "audience", label: "Auditoriyaga mosligi", score: 86 },
      { key: "cta", label: "Save & CTA kuchi", score: saveScore },
      { key: "originality", label: "Originallik", score: 81 },
      { key: "story", label: "Pacing & Montaj", score: pacingScore },
    ],
    timeline: [
      { from: 0, to: 3, label: "Hook (0-3s)", verdict: hookScore >= 75 ? "Strong" : "Average" },
      { from: 3, to: 7, label: "Kirish & Intriga", verdict: "Good" },
      { from: 7, to: 12, label: "Asosiy Qiymat", verdict: "Strong" },
      {
        from: 12,
        to: 16,
        label: "Ushlab turish xavfi",
        verdict: pacingScore < 70 ? "Weak" : "Good",
        note: "Vizual o‘zgarish chastotasini oshiring yoki qo'shimcha B-roll kadrlar kiriting.",
      },
      { from: 16, to: durationSec, label: "CTA & Save", verdict: saveScore >= 70 ? "Good" : "Average" },
    ],
    recommendations: [
      {
        id: "r1",
        severity: "high",
        title: "Ochilish hookini kuchaytiring (0-3s)",
        current: "Sekin kirish",
        recommended:
          "Birinchi 1.5 soniyada darhol savol, shok vizual yoki qiziqarli muammoni ko'rsating.",
        why: "Meta birinchi 3 soniyada 65%+ tomoshabin tashlab ketsa, videoni Explore filtridan chiqaradi.",
        impact: 12,
        currentScore: hookScore,
        potentialScore: Math.min(98, hookScore + 14),
      },
      {
        id: "r2",
        severity: "medium",
        title: "DM orqali ulashish chaqiruvini (Share CTA) qo'shing",
        current: "Oddiy yoki noaniq yakun",
        recommended: "Videoni do'stiga yuborishga undovchi aniq ssenariy bering.",
        why: "Meta algoritmi (Sends per Reach) layklardan 3-5 barobar ko'proq tavsiyaga chiqaradi.",
        impact: 10,
        currentScore: dmShareScore,
        potentialScore: Math.min(96, dmShareScore + 12),
      },
      {
        id: "r3",
        severity: "low",
        title: "Vizual dinamikani oshiring",
        current: "Bir nechta vizual jihatdan o‘xshash sahnalar",
        recommended: "Har 2-2.5 soniyada kadr almashing yoki zoom-in effektidan foydalaning.",
        why: "Vizual o‘zgarish chastotasi tomoshabinni oxirigacha ushlab turishni 32% ga oshiradi.",
        impact: 6,
        currentScore: pacingScore,
        potentialScore: Math.min(95, pacingScore + 8),
      },
    ],
    benchmark: [
      { metric: "Hook (0-3s)", reel: hookScore, accountAvg: 74, benchmark: 86 },
      { metric: "Retention", reel: retentionScore, accountAvg: 71, benchmark: 83 },
      { metric: "DM Shares", reel: dmShareScore, accountAvg: 58, benchmark: 74 },
      { metric: "Saves", reel: saveScore, accountAvg: 64, benchmark: 77 },
      { metric: "Views", reel: overall, accountAvg: 70, benchmark: 82 },
    ],
    actualViews: seed % 3 === 0 ? 31400 : undefined,
    verdict: {
      state: metaEval.verdict === "UCHADI" ? "Ready to post" : metaEval.verdict === "O'RTACHA" ? "Ready with improvements" : "Needs work",
      algorithmVerdict: metaEval.verdict,
      summary: metaEval.verdictSummary,
      fixes: metaEval.exactDeficiencies.map((d) => `${d.timestamp}: ${d.flaw}`).slice(0, 3),
      potentialScore: Math.min(97, overall + 11),
    },
    ...overrides,
  };
}

export const seedAnalyses: Analysis[] = Array.from({ length: 6 }, (_, i) => makeAnalysis(i + 1));

export const accountSnapshot: AccountSnapshot = {
  handle: "@yourstudio",
  followers: 48200,
  avgReelViews: 21400,
  avgEngagement: 6.8,
  growth: 12.4,
  consistency: 78,
  viewsOverTime: [
    { label: "Wk 1", views: 14200, engagement: 5.4 },
    { label: "Wk 2", views: 17600, engagement: 5.9 },
    { label: "Wk 3", views: 15900, engagement: 6.1 },
    { label: "Wk 4", views: 23100, engagement: 6.6 },
    { label: "Wk 5", views: 26800, engagement: 7.2 },
    { label: "Wk 6", views: 24300, engagement: 6.9 },
    { label: "Wk 7", views: 31200, engagement: 7.6 },
    { label: "Wk 8", views: 29400, engagement: 7.1 },
  ],
  followerGrowth: [
    { label: "Wk 1", followers: 42800 },
    { label: "Wk 2", followers: 43600 },
    { label: "Wk 3", followers: 44300 },
    { label: "Wk 4", followers: 45100 },
    { label: "Wk 5", followers: 46000 },
    { label: "Wk 6", followers: 46900 },
    { label: "Wk 7", followers: 47600 },
    { label: "Wk 8", followers: 48200 },
  ],
  topReels: [
    { title: "Skrollashni to‘xtatuvchi 3 ta hook", views: 92400, engagement: 9.4 },
    { title: "20 soniyada montaj ish jarayoni", views: 61800, engagement: 8.1 },
    { title: "Nega qamrovingiz tushib ketdi", views: 54300, engagement: 7.6 },
  ],
  lowReels: [
    { title: "Studiya sayohati 2-qism", views: 6100, engagement: 2.4 },
    { title: "Dam olish kuni xulosasi", views: 7400, engagement: 2.9 },
    { title: "Jihozlarni ko‘rib chiqish", views: 8800, engagement: 3.3 },
  ],
  patterns: [
    "15–25 soniyalik qisqa ta’limiy Reel’lar akkaunt o‘rtachangizdan 34% yaxshiroq natija ko‘rsatadi.",
    "Birinchi 2 soniyada to‘g‘ridan-to‘g‘ri hookka ega videolar o‘rtacha faollikni yuqori qiladi.",
    "Seshanba va payshanba kunlari joylashtirilgan postlar namunangizda tezroq boshlang‘ich o‘sish ko‘rsatadi.",
  ],
};

export const accuracyHistory = [
  { label: "Mar", accuracy: 68 },
  { label: "Apr", accuracy: 72 },
  { label: "May", accuracy: 74 },
  { label: "Jun", accuracy: 79 },
  { label: "Jul", accuracy: 81 },
  { label: "Aug", accuracy: 84 },
];
