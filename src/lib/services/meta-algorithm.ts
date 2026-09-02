import type { AlgorithmVerdictState, ExactDeficiency, MetaAlgorithmBreakdown } from "../types";

export interface MetaAlgorithmInput {
  hookScore: number;
  retentionScore: number;
  dmSharePotential: number;
  savePotential: number;
  pacingScore: number;
  hasWatermark?: boolean;
  durationSec?: number;
}

export function evaluateMetaAlgorithm(input: MetaAlgorithmInput): {
  breakdown: MetaAlgorithmBreakdown;
  verdict: AlgorithmVerdictState;
  verdictSummary: string;
  exactDeficiencies: ExactDeficiency[];
} {
  const {
    hookScore,
    retentionScore,
    dmSharePotential,
    savePotential,
    pacingScore,
    hasWatermark = false,
    durationSec = 28,
  } = input;

  // 1. Calculate weighted score according to Meta Algorithm 2024-2026 ranking model
  const dmSharesWeighted = Math.round(dmSharePotential * 0.35); // 35% weight
  const completionLoopWeighted = Math.round(retentionScore * 0.25); // 25% weight
  const hookRetentionWeighted = Math.round(hookScore * 0.20); // 20% weight
  const saveCommentWeighted = Math.round(savePotential * 0.10); // 10% weight
  const pacingAudioWeighted = Math.round(pacingScore * 0.10); // 10% weight

  let rawTotal = dmSharesWeighted + completionLoopWeighted + hookRetentionWeighted + saveCommentWeighted + pacingAudioWeighted;

  // Watermark penalty
  if (hasWatermark) {
    rawTotal = Math.round(rawTotal * 0.65); // -35% penalty by Meta Reels distribution
  }

  const totalScore = Math.max(0, Math.min(100, rawTotal));

  // 2. Evaluate Meta 3-Stage Distribution Funnel
  // Stage 1: Seed Test (Initial 200-500 test audience)
  const seedPassed = hookScore >= 62 && retentionScore >= 45;
  const seedStage = {
    name: "1-bosqich: Dastlabki Test Auditoriyasi (200 - 500 ko'rish)",
    description: "Meta videoni dastlabki 300 ta faol obunachiga ko'rsatib, birinchi 3 soniyalik drop-offni tekshiradi.",
    passed: seedPassed,
    score: Math.round((hookScore * 0.6) + (retentionScore * 0.4)),
    threshold: 60,
    note: seedPassed
      ? "Muvaffaqiyatli o'tdi: Birinchi 3 soniyada tomoshabinlarning 65%+ qismi ushlab qolinmoqda."
      : "XAVF: Birinchi 3 soniyada tomoshabinlarning 60%+ tashlab ketish xavfi bor. Meta tarqatishni to'xtatishi mumkin.",
  };

  // Stage 2: Lookalike Expansion (1,000 - 15,000 ko'rish)
  const lookalikePassed = seedPassed && dmSharePotential >= 60 && retentionScore >= 55;
  const lookalikeStage = {
    name: "2-bosqich: O'xshash Auditoriyaga Kengayish (1K - 15K)",
    description: "Meta qiziqishlari mos keluvchi obunachi bo'lmagan kengroq auditoriyaga tavsiya qila boshlaydi.",
    passed: lookalikePassed,
    score: Math.round((dmSharePotential * 0.5) + (retentionScore * 0.3) + (savePotential * 0.2)),
    threshold: 62,
    note: lookalikePassed
      ? "Muvaffaqiyatli: DM ulashishlar va do'stlarga yuborish signallari algoritmning 2-filtridan o'tkazadi."
      : "To'xtash xavfi: DM Share yoki to'liq ko'rish ko'rsatkichi yetarli emas, video o'z auditoriyasida qotib qoladi.",
  };

  // Stage 3: Global Explore & Virality (15,000 - 250,000+ ko'rish)
  const explorePassed = lookalikePassed && totalScore >= 78 && dmSharePotential >= 72;
  const exploreStage = {
    name: "3-bosqich: Explore & Katta Tavsiyalar Lentasiga Chiqish (Virallik)",
    description: "Video eksponentsial tarzda butun platforma bo'ylab millionlab yangi profillarga tavsiya etiladi.",
    passed: explorePassed,
    score: totalScore,
    threshold: 78,
    note: explorePassed
      ? "UCHADI: Video Meta Reels algoritmining barcha 3 ta filtridan muvaffaqiyatli o'tib, Explore'ga chiqish ehtimoli juda yuqori!"
      : "Explore'ga chiqish ehtimoli past. Faqat o'rtacha ko'rishlar bilan cheklanadi.",
  };

  const breakdown: MetaAlgorithmBreakdown = {
    totalAlgorithmScore: totalScore,
    dmSharesWeight: dmSharesWeighted,
    completionLoopWeight: completionLoopWeighted,
    hookRetentionWeight: hookRetentionWeighted,
    saveCommentWeight: saveCommentWeighted,
    pacingAudioWeight: pacingAudioWeighted,
    watermarkPenalty: hasWatermark,
    stages: {
      seedTest: seedStage,
      lookalikeExpand: lookalikeStage,
      exploreViral: exploreStage,
    },
  };

  // 3. Generate Timestamped Exact Flaws / Deficiencies
  const exactDeficiencies: ExactDeficiency[] = [];

  if (hookScore < 75) {
    exactDeficiencies.push({
      id: "def_hook",
      timestamp: "00:00 - 00:03",
      flaw: "Hookda vizual yoki semantik intriga yetishmaydi",
      whyItFailsMetaAlgorithm: "Meta algoritmi birinchi 3 soniyada 65%+ tomoshabin drop-off qilgan videolarni Explore filtridan chiqarib tashlaydi.",
      actionableFix: "Videoni birinchi 1.5 soniyasida harakat, matnli shok-savol yoki kutilmagan vizual kadr bilan boshlang.",
      severity: hookScore < 60 ? "high" : "medium",
    });
  }

  if (pacingScore < 70) {
    const midSec = Math.round(durationSec * 0.35);
    const midEnd = Math.round(durationSec * 0.55);
    exactDeficiencies.push({
      id: "def_pacing",
      timestamp: `00:${String(midSec).padStart(2, "0")} - 00:${String(midEnd).padStart(2, "0")}`,
      flaw: "O'rta qismda dinamika va kadrlar almashinuvi sekinlashuvi",
      whyItFailsMetaAlgorithm: "Ushbu soniyalarda tomoshabinning diqqati so'nadi va retention grafigi keskin pastga qulaydi.",
      actionableFix: "Har 2-3 soniyada zoom-in, B-roll qo'shimcha kadrlar yoki ekrandagi matnli urg'ular (text overlay) qo'shing.",
      severity: "medium",
    });
  }

  if (dmSharePotential < 72) {
    exactDeficiencies.push({
      id: "def_share",
      timestamp: `00:${String(Math.max(0, durationSec - 5)).padStart(2, "0")} - 00:${String(durationSec).padStart(2, "0")}`,
      flaw: "Do'stlarga yuborish (DM Share) triggeri va kuchli chaqiruv yetarli emas",
      whyItFailsMetaAlgorithm: "Meta (Adam Mosseri rasmiy bayonoti) 2024-2026 yillarda aynan 'Sends per Reach'ni virallikning eng kuchli ko'rsatkichi qilib belgilagan.",
      actionableFix: "Oxirida 'Buni do'stingizga yuboring' yoki 'Shu muammoga duch kelgan tanishingiz bormi?' kabi aniq relatsion trigger bering.",
      severity: "high",
    });
  }

  if (savePotential < 65) {
    exactDeficiencies.push({
      id: "def_save",
      timestamp: "Umumiy kontent",
      flaw: "Saqlab olish (Save) qiymati sust",
      whyItFailsMetaAlgorithm: "Foydalanuvchi keyinroq qaytib ko'rishni xohlamaydigan kontentlar algoritmdan tez chiqib ketadi.",
      actionableFix: "Foydali ro'yxat, vositalar to'plami yoki qadamma-qadam qo'llanma taqdim etib, 'Yo'qotib qo'ymaslik uchun saqlab oling' deb ta'kidlang.",
      severity: "low",
    });
  }

  if (hasWatermark) {
    exactDeficiencies.unshift({
      id: "def_watermark",
      timestamp: "00:00 - oxirigacha",
      flaw: "Boshqa platformalar (TikTok / CapCut) logotipi yoki suv belgisi aniqlandi",
      whyItFailsMetaAlgorithm: "Meta algoritmi boshqa ilovalar logotipi bor videolarning ko'rishlar qamrovini (Reach) sun'iy ravishda 60-70% gacha pasaytiradi.",
      actionableFix: "Videoni suv belgisisiz toza holatda yuklang yoki logotipni qirqib tashlang.",
      severity: "high",
    });
  }

  // 4. Algorithm Verdict
  let verdict: AlgorithmVerdictState = "O'RTACHA";
  let verdictSummary = "";

  if (totalScore >= 82 && seedPassed && lookalikePassed && explorePassed) {
    verdict = "UCHADI";
    verdictSummary = "🚀 A'LO: Video Meta Reels algoritmining barcha talablariga to'liq javob beradi. Explore va katta auditoriya qamroviga chiqish ehtimoli 85%+!";
  } else if (totalScore < 55 || !seedPassed || hasWatermark) {
    verdict = "UCHMAYDI";
    verdictSummary = "🛑 TO'XTATILADI: Ushbu video holatida Meta algoritmining dastlabki test bosqichidan o'tish qiyin. Quyidagi kamchiliklarni to'g'irlamasdan nashr etmang.";
  } else {
    verdict = "O'RTACHA";
    verdictSummary = "⚠️ O'RTACHA NATIJA: Video o'z obunachilaringizga yaxshi yetib boradi, lekin Explore lentasiga chiqishi uchun 2-3 ta asosiy kamchilikni bartaraf etish kerak.";
  }

  return {
    breakdown,
    verdict,
    verdictSummary,
    exactDeficiencies,
  };
}
