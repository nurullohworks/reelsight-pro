import { createFileRoute } from "@tanstack/react-router";
import { AuthPanel } from "@/components/auth/AuthPanel";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Kirish — REELPREDICT" },
      { name: "description", content: "REELPREDICT samaradorlik tahlili ish maydoningizga kiring." },
      { property: "og:title", content: "Kirish — REELPREDICT" },
      { property: "og:description", content: "Reels tahlillaringiz, hisobotlaringiz va bashorat tarixingizga kiring." },
    ],
  }),
  component: () => <AuthPanel mode="login" />,
});
