import { createFileRoute } from "@tanstack/react-router";
import { AuthPanel } from "@/components/auth/AuthPanel";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — REELPREDICT" },
      { name: "description", content: "Log in to your REELPREDICT performance intelligence workspace." },
      { property: "og:title", content: "Log in — REELPREDICT" },
      { property: "og:description", content: "Access your Reels analyses, reports and prediction history." },
    ],
  }),
  component: () => <AuthPanel mode="login" />,
});
