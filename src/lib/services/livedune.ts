import type { LiveDuneNicheBenchmark } from "../types";

export interface NicheInfo {
  key: string;
  name: string;
  description: string;
}

export const LIVEDUNE_NICHES: NicheInfo[] = [
  { key: "business", name: "Biznes, Moliya & Startaplar", description: "B2B, investitsiya, savdo, boshqaruv va moliya" },
  { key: "education", name: "Ta'lim, Kurslar & Ekspertlik", description: "Til o'rganish, kasbiy ta'lim, psixologiya va konsalting" },
  { key: "tech", name: "IT, Dasturlash & AI", description: "Dasturlash, texnologiyalar, sun'iy intellekt va gadjetlar" },
  { key: "ecommerce", name: "E-commerce, Kiyim & Mahsulotlar", description: "Onlayn do'konlar, kiyim-kechak, kosmetika va yetkazib berish" },
  { key: "lifestyle", name: "Shaxsiy Brend & Blog", description: "Sayohat, fitnes, salomatlik va kundalik hayot" },
  { key: "entertainment", name: "Yumor, Vaynerlik & Ko'ngilochar", description: "Komedik roliklar, memlar, parodiya va prifessionallik" },
];

/** LiveDune verified market dataset for Instagram Reels benchmarks */
export const LIVEDUNE_DATASET: Record<string, {
  nicheAvgER: number;
  top10ViralER: number;
  sampleAccountsCount: number;
  benchmarks: {
    hookRetention: { avg: number; top: number };
    completionRate: { avg: number; top: number };
    dmShareRatio: { avg: number; top: number };
    saveRatio: { avg: number; top: number };
    viewToFollowerRatio: { avg: number; top: number };
  };
  insight: string;
}> = {
  business: {
    nicheAvgER: 3.4,
    top10ViralER: 8.9,
    sampleAccountsCount: 1420,
    benchmarks: {
      hookRetention: { avg: 64, top: 88 },
      completionRate: { avg: 48, top: 76 },
      dmShareRatio: { avg: 2.1, top: 6.4 },
      saveRatio: { avg: 3.2, top: 7.8 },
      viewToFollowerRatio: { avg: 85, top: 320 },
    },
    insight: "Biznes sohasida Save (saqlab olish) va DM orqali hamkorlarga yuborish ko'rsatkichi eng muhim virallik drayveri hisoblanadi.",
  },
  education: {
    nicheAvgER: 4.2,
    top10ViralER: 11.5,
    sampleAccountsCount: 2150,
    benchmarks: {
      hookRetention: { avg: 68, top: 91 },
      completionRate: { avg: 52, top: 81 },
      dmShareRatio: { avg: 2.8, top: 8.2 },
      saveRatio: { avg: 4.5, top: 12.1 },
      viewToFollowerRatio: { avg: 110, top: 410 },
    },
    insight: "Ta'lim Reels'larida 'Cheat Sheet' yoki 'Aniq formulalar' berilganda Saqlashlar soni 12% dan oshib, Explore'ga chiqish ehtimoli 4x oshadi.",
  },
  tech: {
    nicheAvgER: 3.9,
    top10ViralER: 9.8,
    sampleAccountsCount: 980,
    benchmarks: {
      hookRetention: { avg: 72, top: 93 },
      completionRate: { avg: 55, top: 84 },
      dmShareRatio: { avg: 3.4, top: 9.1 },
      saveRatio: { avg: 3.8, top: 9.6 },
      viewToFollowerRatio: { avg: 95, top: 360 },
    },
    insight: "IT yo'nalishida tezkor ekran yozuvlari va AI workflow namoyishlari eng yuqori DM Share konversiyasini beradi.",
  },
  ecommerce: {
    nicheAvgER: 2.8,
    top10ViralER: 7.4,
    sampleAccountsCount: 3400,
    benchmarks: {
      hookRetention: { avg: 58, top: 84 },
      completionRate: { avg: 42, top: 69 },
      dmShareRatio: { avg: 1.6, top: 5.2 },
      saveRatio: { avg: 2.4, top: 6.1 },
      viewToFollowerRatio: { avg: 70, top: 260 },
    },
    insight: "Savdo va mahsulotlarda muammoni dastlabki 2 soniyada ko'rsatish va narx/chegirma intrigasi completion rate'ni 28% ga oshiradi.",
  },
  lifestyle: {
    nicheAvgER: 4.8,
    top10ViralER: 12.2,
    sampleAccountsCount: 2800,
    benchmarks: {
      hookRetention: { avg: 65, top: 89 },
      completionRate: { avg: 50, top: 78 },
      dmShareRatio: { avg: 2.5, top: 7.5 },
      saveRatio: { avg: 3.1, top: 8.4 },
      viewToFollowerRatio: { avg: 120, top: 450 },
    },
    insight: "Shaxsiy brendda emotsional samimiylik va estetik vizual birinchi 3 soniyadagi drop-offni 40% dan pastda ushlab turadi.",
  },
  entertainment: {
    nicheAvgER: 6.5,
    top10ViralER: 16.8,
    sampleAccountsCount: 4100,
    benchmarks: {
      hookRetention: { avg: 78, top: 95 },
      completionRate: { avg: 62, top: 89 },
      dmShareRatio: { avg: 4.8, top: 14.5 },
      saveRatio: { avg: 1.8, top: 4.5 },
      viewToFollowerRatio: { avg: 210, top: 820 },
    },
    insight: "Komedik va yumor videolarida eng muhim omil — DM Shares (do'stlarga ulashish). U umumiy ko'rishlarning 60% dan ortig'ini ta'minlaydi.",
  },
};

export function getLiveDuneBenchmark(
  nicheKey: string = "business",
  reelScores: {
    hookScore: number;
    retentionScore: number;
    engagementScore: number;
    dmShareScore: number;
    saveScore: number;
  }
): LiveDuneNicheBenchmark {
  const nicheData = LIVEDUNE_DATASET[nicheKey] || LIVEDUNE_DATASET["business"];
  const nicheInfo = LIVEDUNE_NICHES.find((n) => n.key === nicheKey) || LIVEDUNE_NICHES[0];

  const determineStatus = (curr: number, avg: number): "ahead" | "average" | "behind" => {
    if (curr >= avg * 1.08) return "ahead";
    if (curr <= avg * 0.92) return "behind";
    return "average";
  };

  const benchmarks = [
    {
      metric: "3-soniyalik Hook saqlanishi",
      current: reelScores.hookScore,
      nicheAvg: nicheData.benchmarks.hookRetention.avg,
      top10Percent: nicheData.benchmarks.hookRetention.top,
      unit: "%" as const,
      status: determineStatus(reelScores.hookScore, nicheData.benchmarks.hookRetention.avg),
    },
    {
      metric: "To'liq ko'rish (Completion Rate)",
      current: reelScores.retentionScore,
      nicheAvg: nicheData.benchmarks.completionRate.avg,
      top10Percent: nicheData.benchmarks.completionRate.top,
      unit: "%" as const,
      status: determineStatus(reelScores.retentionScore, nicheData.benchmarks.completionRate.avg),
    },
    {
      metric: "DM Share nisbati (Ulashishlar)",
      current: Math.round((reelScores.dmShareScore / 100) * nicheData.benchmarks.dmShareRatio.top * 10) / 10,
      nicheAvg: nicheData.benchmarks.dmShareRatio.avg,
      top10Percent: nicheData.benchmarks.dmShareRatio.top,
      unit: "%" as const,
      status: determineStatus(reelScores.dmShareScore, 65),
    },
    {
      metric: "Save nisbati (Saqlab olish)",
      current: Math.round((reelScores.saveScore / 100) * nicheData.benchmarks.saveRatio.top * 10) / 10,
      nicheAvg: nicheData.benchmarks.saveRatio.avg,
      top10Percent: nicheData.benchmarks.saveRatio.top,
      unit: "%" as const,
      status: determineStatus(reelScores.saveScore, 65),
    },
    {
      metric: "Umumiy Faollik (ER by Reach)",
      current: Math.round((reelScores.engagementScore / 100) * nicheData.top10ViralER * 10) / 10,
      nicheAvg: nicheData.nicheAvgER,
      top10Percent: nicheData.top10ViralER,
      unit: "%" as const,
      status: determineStatus(reelScores.engagementScore, 65),
    },
  ];

  return {
    nicheKey: nicheInfo.key,
    nicheName: nicheInfo.name,
    nicheAvgER: nicheData.nicheAvgER,
    top10ViralER: nicheData.top10ViralER,
    sampleAccountsCount: nicheData.sampleAccountsCount,
    benchmarks,
    insight: nicheData.insight,
  };
}
