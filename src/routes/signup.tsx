import { createFileRoute } from "@tanstack/react-router";
import { AuthPanel } from "@/components/auth/AuthPanel";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Hisob yaratish — REELPREDICT" },
      {
        name: "description",
        content: "Bepul REELPREDICT hisobini yarating va bugunoq birinchi Instagram Reels'ingizni tahlil qiling.",
      },
      { property: "og:title", content: "Hisob yaratish — REELPREDICT" },
      { property: "og:description", content: "Joylashtirishdan oldin Reels samaradorligini bashorat qilishni boshlang." },
    ],
  }),
  component: () => <AuthPanel mode="signup" />,
});
