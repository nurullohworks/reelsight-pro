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

export function makeAnalysis(seed = 0, overrides: Partial<Analysis> = {}): Analysis {
  const rnd = (n: number, spread: number) => Math.round(n + ((seed * 37) % spread) - spread / 2);
  const overall = Math.min(96, Math.max(48, rnd(82, 26)));
  const minViews = 1000 * Math.max(6, Math.round(overall * 0.22));
  const maxViews = minViews * 2.3;

  return {
    id: `an_${1000 + seed}`,
    title: titles[seed % titles.length]!,
    fileName: `reel-${1000 + seed}.mp4`,
    createdAt: new Date(BASE_TIME - seed * 86400000 * 2).toISOString(),
    durationSec: 21,
    status: (["Analyzed", "Published", "Tracking", "Completed"] as const)[seed % 4]!,
    prediction: {
      overall_score: overall,
      viral_probability: Math.min(94, overall - 6),
      estimated_view_min: minViews,
      estimated_view_max: Math.round(maxViews),
      estimated_reach_min: Math.round(minViews * 0.68),
      estimated_reach_max: Math.round(maxViews * 0.74),
      confidence_score: 74,
      strengths: [
        "Hook birinchi 1.4 soniyada ishlaydi",
        "Sur'at eng yaxshi natija bergan formatingizga mos",
        "Mavzu auditoriyangiz qiziqishlariga mos keladi",
      ],
      weaknesses: [
        "O‘rta qismida ushlab turish pasayadi",
        "CTA passiv va oson o‘tkazib yuboriladi",
      ],
      risk_factors: [
        "12s va 15s orasida vizual jihatdan o‘xshash sahnalar",
        "Matn qatlami zichligi akkaunt o‘rtachasidan yuqori",
      ],
    },
    metrics: [
      { key: "hook", label: "Hook", score: 91 },
      { key: "retention", label: "Ushlab turish", score: 78 },
      { key: "engagement", label: "Faollik salohiyati", score: 84 },
      { key: "visual", label: "Vizual sifat", score: 88 },
      { key: "audience", label: "Auditoriyaga mosligi", score: 86 },
      { key: "cta", label: "CTA", score: 63 },
      { key: "originality", label: "Originallik", score: 81 },
      { key: "story", label: "Hikoya qilish", score: 79 },
    ],
    timeline: [
      { from: 0, to: 3, label: "Hook", verdict: "Strong" },
      { from: 3, to: 7, label: "Kirish", verdict: "Good" },
      { from: 7, to: 12, label: "Qiymat", verdict: "Strong" },
      {
        from: 12,
        to: 16,
        label: "Ushlab turish xavfi",
        verdict: "Weak",
        note: "Vizual o‘zgarish chastotasini oshiring yoki kuchliroq diqqatni jalb qiluvchi uzilish kiriting.",
      },
      { from: 16, to: 21, label: "CTA", verdict: "Average" },
    ],
    recommendations: [
      {
        id: "r1",
        severity: "high",
        title: "Ochilish hookini kuchaytiring",
        current: "Umumiy kirish",
        recommended:
          "Birinchi soniyalarda darhol qiziqish uyg‘oting yoki aniq foyda ko‘rsating.",
        why: "Dastlabki ikki soniya qisqa formatdagi kontentda ko‘rishning eng katta ulushini belgilaydi.",
        impact: 9,
        currentScore: 68,
        potentialScore: 88,
      },
      {
        id: "r2",
        severity: "medium",
        title: "CTA ni yaxshilang",
        current: "Past darajadagi o‘zaro ta’sir rag‘bati",
        recommended: "Videoning asosiy qiymatiga bog‘liq to‘g‘ridan-to‘g‘ri harakatdan foydalaning.",
        why: "Saqlash va ulashishlar qamrovni kengaytirish uchun kuchli faollik signallaridir.",
        impact: 6,
        currentScore: 63,
        potentialScore: 80,
      },
      {
        id: "r3",
        severity: "low",
        title: "Vizual xilma-xillikni oshiring",
        current: "Bir nechta vizual jihatdan o‘xshash sahnalar",
        recommended: "Nazorat qilinadigan sahna o‘zgarishlarini kiriting.",
        why: "Vizual o‘zgarish chastotasi akkauntingizdagi video o‘rtasida ushlab turish bilan bog‘liq.",
        impact: 3,
        currentScore: 74,
        potentialScore: 84,
      },
    ],
    benchmark: [
      { metric: "Hook", reel: 91, accountAvg: 74, benchmark: 86 },
      { metric: "Retention", reel: 78, accountAvg: 71, benchmark: 83 },
      { metric: "Engagement", reel: 84, accountAvg: 69, benchmark: 80 },
      { metric: "Shares", reel: 66, accountAvg: 58, benchmark: 74 },
      { metric: "Saves", reel: 81, accountAvg: 64, benchmark: 77 },
      { metric: "Views", reel: 79, accountAvg: 70, benchmark: 82 },
    ],
    actualViews: seed % 3 === 0 ? 31400 : undefined,
    verdict: {
      state: "Ready with improvements",
      summary: "Reel’ingiz yuqori salohiyatga ega, ammo 2 ta muammo ushlab turishni cheklashi mumkin.",
      fixes: ["Birinchi 2 soniyani kuchaytiring", "CTA ni yaxshilang"],
      potentialScore: Math.min(97, overall + 9),
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
