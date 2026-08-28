import { createFileRoute } from "@tanstack/react-router";
import { AuthPanel } from "@/components/auth/AuthPanel";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create account — REELPREDICT" },
      {
        name: "description",
        content: "Create a free REELPREDICT account and analyze your first Instagram Reel today.",
      },
      { property: "og:title", content: "Create account — REELPREDICT" },
      { property: "og:description", content: "Start predicting Reels performance before you post." },
    ],
  }),
  component: () => <AuthPanel mode="signup" />,
});
