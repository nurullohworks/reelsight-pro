import type { AccountSnapshot, Analysis } from "./types";

const titles = [
  "3 hooks that stop the scroll",
  "Editing workflow in 20 seconds",
  "Why your reach dropped",
  "Client onboarding teardown",
  "Studio lighting on a budget",
  "Behind the scenes: launch day",
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
    createdAt: new Date(Date.now() - seed * 86400000 * 2).toISOString(),
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
        "Hook lands within the first 1.4 seconds",
        "Pacing matches your best performing format",
        "Topic is consistent with your audience interests",
      ],
      weaknesses: [
        "Retention dips in the mid-section",
        "CTA is passive and easy to skip",
      ],
      risk_factors: [
        "Visually similar scenes between 12s and 15s",
        "Text overlay density above your account average",
      ],
    },
    metrics: [
      { key: "hook", label: "Hook", score: 91 },
      { key: "retention", label: "Retention", score: 78 },
      { key: "engagement", label: "Engagement Potential", score: 84 },
      { key: "visual", label: "Visual Quality", score: 88 },
      { key: "audience", label: "Audience Fit", score: 86 },
      { key: "cta", label: "CTA", score: 63 },
      { key: "originality", label: "Originality", score: 81 },
      { key: "story", label: "Storytelling", score: 79 },
    ],
    timeline: [
      { from: 0, to: 3, label: "Hook", verdict: "Strong" },
      { from: 3, to: 7, label: "Setup", verdict: "Good" },
      { from: 7, to: 12, label: "Value", verdict: "Strong" },
      {
        from: 12,
        to: 16,
        label: "Retention risk",
        verdict: "Weak",
        note: "Increase visual change frequency or introduce a stronger pattern interrupt.",
      },
      { from: 16, to: 21, label: "CTA", verdict: "Average" },
    ],
    recommendations: [
      {
        id: "r1",
        severity: "high",
        title: "Strengthen the opening hook",
        current: "Generic introduction",
        recommended:
          "Create immediate curiosity or establish a clear benefit within the first seconds.",
        why: "The first two seconds drive the largest share of watch-through in short form content.",
        impact: 9,
        currentScore: 68,
        potentialScore: 88,
      },
      {
        id: "r2",
        severity: "medium",
        title: "Improve the CTA",
        current: "Low interaction incentive",
        recommended: "Use a direct action connected to the video's main value.",
        why: "Saves and shares are strong engagement signals for reach expansion.",
        impact: 6,
        currentScore: 63,
        potentialScore: 80,
      },
      {
        id: "r3",
        severity: "low",
        title: "Increase visual variation",
        current: "Several visually similar scenes",
        recommended: "Introduce controlled scene changes.",
        why: "Visual change frequency correlates with mid-video retention on your account.",
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
      summary: "Your Reel has strong potential, but 2 issues may limit retention.",
      fixes: ["Strengthen the first 2 seconds", "Improve the CTA"],
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
    { title: "3 hooks that stop the scroll", views: 92400, engagement: 9.4 },
    { title: "Editing workflow in 20 seconds", views: 61800, engagement: 8.1 },
    { title: "Why your reach dropped", views: 54300, engagement: 7.6 },
  ],
  lowReels: [
    { title: "Studio tour part 2", views: 6100, engagement: 2.4 },
    { title: "Weekend recap", views: 7400, engagement: 2.9 },
    { title: "Gear unboxing", views: 8800, engagement: 3.3 },
  ],
  patterns: [
    "Short educational Reels between 15–25 seconds perform 34% better than your account average.",
    "Videos with direct hooks in the first 2 seconds receive higher average engagement.",
    "Posts published Tuesday and Thursday show stronger early velocity in your sample.",
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
